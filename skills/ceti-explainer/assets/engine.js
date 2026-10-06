/* ════════════════════════════════════════════════════════════════════
   CETI Explainer Engine
   --------------------------------------------------------------------
   ONE deterministic clock. Everything renders as a pure function of time.

   Design contract that makes explainers "just work":
     • A single rAF loop advances `t` (seconds) only while playing.
     • content.render(t, ctx) reconstructs the EXACT visual for any t.
     • No chained setTimeouts, no scroll/IntersectionObserver coupling.
     => scrubbing, replay, pause/resume and reduced-motion are all free.

   A content module looks like:
     {
       duration?: number,             // optional; else summed from beats
       beats: [{ id, label, dur, caption }],
       build(stageEl): void,          // create persistent nodes ONCE
       render(t, ctx): void,          // mutate nodes from time
     }
   ──────────────────────────────────────────────────────────────────── */
window.CetiExplainer = (function () {
  /* ---- easing: cubic-bezier sampler (Newton-Raphson) ---- */
  function cubicBezier(p1x, p1y, p2x, p2y) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const fx = (t) => ((ax * t + bx) * t + cx) * t;
    const fy = (t) => ((ay * t + by) * t + cy) * t;
    const dfx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = fx(t) - x;
        if (Math.abs(e) < 1e-4) break;
        const d = dfx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      return fy(Math.min(1, Math.max(0, t)));
    };
  }

  const ease = {
    glaser: cubicBezier(0.22, 1, 0.36, 1),
    warmIn: cubicBezier(0.4, 0, 0.2, 1),
    defer: cubicBezier(0.25, 0.46, 0.45, 0.94),
    collect: cubicBezier(0.55, 0, 0.55, 0.2),
    rest: cubicBezier(0.4, 0, 0.6, 1),
    linear: (t) => t,
  };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  /* local progress through a window [start,end], optionally eased */
  function win(t, start, end, easing) {
    if (end <= start) return t >= end ? 1 : 0;
    const p = clamp((t - start) / (end - start));
    return easing ? easing(p) : p;
  }
  /* ramp 0..1 over `dur` seconds starting at `start` */
  function ramp(t, start, dur, easing) {
    return win(t, start, start + dur, easing || ease.defer);
  }
  /* fade in then out: 1 inside [a,b], ramped over `f` seconds at each edge */
  function pulse(t, a, b, f) {
    f = f || 0.35;
    return Math.min(win(t, a - f, a, ease.defer), 1 - win(t, b, b + f, ease.collect));
  }
  /* segment: like pulse but the fades are CONTAINED INSIDE [a,b] (0 at and
     outside both edges). Use this for two scenes that share a region (e.g. the
     detail band): give them adjacent windows and they hand off through a brief
     empty gap — never two half-lit at once (no frozen "double-exposure" mush).
     pulse() spills its fades OUTSIDE the window, so adjacent pulses overlap. */
  function seg(t, a, b, f) {
    f = f || 0.4;
    if (b - a <= 2 * f) f = Math.max(1e-4, (b - a) / 2);
    if (t <= a || t >= b) return 0;
    const up = win(t, a, a + f, ease.defer);
    const down = 1 - win(t, b - f, b, ease.collect);
    return Math.min(up, down);
  }
  const fmt = (s) => {
    s = Math.max(0, s);
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  };
  /* auto-fit: shrink an SVG <text> until it fits maxWidth. Call in build()
     (the node must be mounted so it can be measured). This is the safety net
     that keeps layouts clean when a brand swaps in a different-metric font:
     anything that could be too wide for its box stays inside it.
     No-ops where measurement isn't available (e.g. the Node test shim). */
  function fit(node, maxWidth, minSize) {
    if (!node || typeof node.getComputedTextLength !== "function" || !maxWidth) return node;
    minSize = minSize || 9;
    let size = parseFloat(node.getAttribute("font-size")) || 12;
    let guard = 0;
    try {
      while (node.getComputedTextLength() > maxWidth && size > minSize && guard++ < 60) {
        size = Math.max(minSize, size - 0.5);
        node.setAttribute("font-size", size);
      }
    } catch (_) { /* not measurable in this environment */ }
    return node;
  }

  function create(config) {
    const root = config.root;
    const content = config.content;
    const storageKey = config.storageKey ? "ceti-ex-" + config.storageKey : null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- compute beat windows (single source of truth) ---- */
    let cursor = 0;
    const beats = content.beats.map((b, i) => {
      const start = cursor;
      cursor += b.dur;
      return { ...b, index: i, start, end: cursor };
    });
    const duration = content.duration || cursor;

    const $ = (sel) => root.querySelector(sel);
    const stage = $("[data-ex-stage]");
    const elPlay = $("[data-ex-play]");
    const elPrev = $("[data-ex-prev]");
    const elNext = $("[data-ex-next]");
    const elScrub = $("[data-ex-scrub]");
    const elProgress = $("[data-ex-progress]");
    const elHandle = $("[data-ex-handle]");
    const elTicks = $("[data-ex-ticks]");
    const elTime = $("[data-ex-time]");
    const elDur = $("[data-ex-duration]");
    const elBeatLabel = $("[data-ex-beatlabel]");
    const elBeatIndex = $("[data-ex-beatindex]");
    const elCaption = $("[data-ex-caption]");
    const elChapters = $("[data-ex-chapters]");

    /* ---- build the diagram once ---- */
    content.build(stage, { beats, duration, ex: api });

    /* ---- populate scrub ticks + chapter rail ---- */
    beats.forEach((b) => {
      if (b.index === 0) return;
      const tick = document.createElement("div");
      tick.className = "ex-tick";
      tick.style.left = (b.start / duration) * 100 + "%";
      elTicks && elTicks.appendChild(tick);
    });
    if (elChapters) {
      beats.forEach((b) => {
        const btn = document.createElement("button");
        btn.className = "ex-chapter";
        btn.type = "button";
        btn.dataset.exChapter = b.index;
        btn.innerHTML =
          '<span class="ex-chapter__n">' + String(b.index + 1).padStart(2, "0") + "</span>" +
          '<span class="ex-chapter__l">' + b.label + "</span>";
        btn.addEventListener("click", () => { toBeat(b.index); });
        elChapters.appendChild(btn);
      });
    }
    if (elDur) elDur.textContent = fmt(duration);

    /* ---- clock state ---- */
    let t = 0;
    let playing = false;
    let rafId = null;
    let lastTs = 0;
    let speed = 1;
    let ended = false;
    let lastBeat = -1;

    /* restore position (but replay if a finished view is reopened) */
    if (storageKey) {
      const saved = parseFloat(localStorage.getItem(storageKey));
      if (!isNaN(saved) && saved > 0 && saved < duration * 0.85) t = saved;
    }

    function activeBeatIndex(time) {
      for (let i = beats.length - 1; i >= 0; i--) {
        if (time >= beats[i].start - 1e-4) return i;
      }
      return 0;
    }

    function renderChrome() {
      const pct = (t / duration) * 100;
      if (elProgress) elProgress.style.width = pct + "%";
      if (elHandle) elHandle.style.left = pct + "%";
      if (elTime) elTime.textContent = fmt(t);
      const bi = activeBeatIndex(t);
      if (bi !== lastBeat) {
        lastBeat = bi;
        const b = beats[bi];
        if (elBeatLabel) elBeatLabel.textContent = b.label;
        if (elBeatIndex) elBeatIndex.textContent = String(bi + 1).padStart(2, "0");
        if (elCaption) {
          elCaption.classList.remove("is-in");
          // force reflow so the fade re-triggers
          void elCaption.offsetWidth;
          elCaption.textContent = b.caption;
          elCaption.classList.add("is-in");
        }
        if (elChapters) {
          elChapters.querySelectorAll(".ex-chapter").forEach((c, i) => {
            c.classList.toggle("is-active", i === bi);
            c.classList.toggle("is-done", i < bi);
          });
        }
      }
    }

    function renderAll() {
      content.render(t, { t, duration, beats, activeBeat: activeBeatIndex(t), ex: api });
      renderChrome();
    }

    function setPlaying(p) {
      playing = p;
      root.classList.toggle("is-playing", p);
      if (elPlay) {
        elPlay.setAttribute("aria-label", p ? "Pause" : "Play");
        elPlay.dataset.state = p ? "playing" : "paused";
      }
      if (p) {
        ended = false;
        lastTs = 0;
        rafId = requestAnimationFrame(loop);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function loop(ts) {
      if (!playing) return;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000); // clamp big tab-switch gaps
      lastTs = ts;
      t += dt * speed;
      if (t >= duration) {
        t = duration;
        renderAll();
        persist();
        ended = true;
        setPlaying(false);
        return;
      }
      renderAll();
      persist();
      rafId = requestAnimationFrame(loop);
    }

    let persistTick = 0;
    function persist() {
      if (!storageKey) return;
      if (++persistTick % 12 === 0) localStorage.setItem(storageKey, t.toFixed(2));
    }

    function seek(time, { fromUser } = {}) {
      t = clamp(time, 0, duration);
      ended = t >= duration;
      renderAll();
      if (storageKey) localStorage.setItem(storageKey, t.toFixed(2));
    }

    function play() {
      if (ended || t >= duration - 1e-3) t = 0;
      setPlaying(true);
    }
    function pause() { setPlaying(false); }
    function toggle() { playing ? pause() : play(); }
    function toBeat(i) {
      i = Math.max(0, Math.min(beats.length - 1, i));
      seek(beats[i].start + 1e-3);
    }
    function nextBeat() {
      const bi = activeBeatIndex(t);
      // if we're already near the start of a beat, jump to next; else snap to current start unless last
      if (bi >= beats.length - 1) { seek(duration); return; }
      toBeat(bi + 1);
    }
    function prevBeat() {
      const bi = activeBeatIndex(t);
      // if more than 0.6s into the beat, restart it; else go to previous
      if (t - beats[bi].start > 0.6 || bi === 0) toBeat(bi);
      else toBeat(bi - 1);
    }

    /* ---- chrome events ---- */
    elPlay && elPlay.addEventListener("click", toggle);
    elNext && elNext.addEventListener("click", () => { pause(); nextBeat(); });
    elPrev && elPrev.addEventListener("click", () => { pause(); prevBeat(); });

    /* scrub: click + drag */
    function scrubTo(clientX) {
      const r = elScrub.getBoundingClientRect();
      const p = clamp((clientX - r.left) / r.width);
      seek(p * duration);
    }
    let dragging = false;
    if (elScrub) {
      elScrub.addEventListener("pointerdown", (e) => {
        dragging = true;
        pause();
        elScrub.setPointerCapture(e.pointerId);
        scrubTo(e.clientX);
      });
      elScrub.addEventListener("pointermove", (e) => { if (dragging) scrubTo(e.clientX); });
      elScrub.addEventListener("pointerup", (e) => {
        dragging = false;
        try { elScrub.releasePointerCapture(e.pointerId); } catch (_) {}
      });
      elScrub.addEventListener("pointercancel", () => { dragging = false; });
    }

    /* keyboard — bound at DOCUMENT level so it works the instant the page
       loads (no click-to-focus required) and is never silently overwritten.
       Guards: if a form control is focused, let it keep its keys (the pace
       slider keeps arrows; a focused button keeps Space/Enter). */
    root.setAttribute("tabindex", "0");
    function onKey(e) {
      const el = document.activeElement;
      const tag = el && el.tagName;
      if (el && (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable)) return;
      if (tag === "BUTTON" && (e.key === " " || e.key === "Enter")) return; // button handles its own activation
      switch (e.key) {
        case " ": case "k": e.preventDefault(); toggle(); break;
        case "ArrowRight": e.preventDefault(); pause(); e.shiftKey ? nextBeat() : seek(t + 2); break;
        case "ArrowLeft": e.preventDefault(); pause(); e.shiftKey ? prevBeat() : seek(t - 2); break;
        case "Home": e.preventDefault(); seek(0); break;
        case "End": e.preventDefault(); seek(duration); break;
        default: if (/^[1-9]$/.test(e.key)) { e.preventDefault(); toBeat(parseInt(e.key, 10) - 1); }
      }
    }
    document.addEventListener("keydown", onKey);

    /* pause when tab hidden so the clock can't drift */
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });

    /* ---- public controller ---- */
    const controller = {
      play, pause, toggle, seek, toBeat, nextBeat, prevBeat,
      setSpeed(s) { speed = s; },
      getSpeed() { return speed; },
      beats, duration,
      get time() { return t; },
      get playing() { return playing; },
      rerender() { renderAll(); },
    };

    /* first paint */
    renderAll();
    /* autoplay video-style (unless reduced motion or resumed mid-way) */
    config.autoplay !== false && !reduced && t < 0.05 && play();

    return controller;
  }

  const api = { create, ease, clamp, lerp, win, ramp, pulse, seg, fmt, fit, cubicBezier };
  return api;
})();
