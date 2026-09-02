(function (global) {
  "use strict";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function cubicBezier(x1, y1, x2, y2) {
    if (x1 === y1 && x2 === y2) return function (t) { return t; };
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    const sampleX = function (t) { return ((ax * t + bx) * t + cx) * t; };
    const sampleY = function (t) { return ((ay * t + by) * t + cy) * t; };
    const sampleDX = function (t) { return (3 * ax * t + 2 * bx) * t + cx; };

    return function (x) {
      let t = clamp(x, 0, 1);
      for (let i = 0; i < 8; i += 1) {
        const dx = sampleX(t) - x;
        if (Math.abs(dx) < 1e-6) return sampleY(t);
        const slope = sampleDX(t);
        if (Math.abs(slope) < 1e-6) break;
        t -= dx / slope;
      }
      let lo = 0;
      let hi = 1;
      t = clamp(x, 0, 1);
      for (let i = 0; i < 18; i += 1) {
        const estimate = sampleX(t);
        if (Math.abs(estimate - x) < 1e-6) break;
        if (estimate > x) hi = t;
        else lo = t;
        t = (lo + hi) / 2;
      }
      return sampleY(t);
    };
  }

  const ease = {
    glaser: cubicBezier(0.22, 1, 0.36, 1),
    warmIn: cubicBezier(0.4, 0, 0.2, 1),
    defer: cubicBezier(0.25, 0.46, 0.45, 0.94),
    collect: cubicBezier(0.55, 0, 0.55, 0.2),
    rest: cubicBezier(0.4, 0, 0.6, 1),
    linear: cubicBezier(0, 0, 1, 1)
  };

  function win(t, start, end, easing) {
    if (end <= start) return t >= end ? 1 : 0;
    return (easing || ease.linear)(clamp((t - start) / (end - start), 0, 1));
  }

  function ramp(t, start, dur, easing) {
    if (dur <= 0) return t >= start ? 1 : 0;
    return win(t, start, start + dur, easing);
  }

  function pulse(t, start, end, fade) {
    const edge = fade == null ? 0.35 : fade;
    if (edge <= 0) return t >= start && t <= end ? 1 : 0;
    if (t < start - edge || t > end + edge) return 0;
    if (t < start) return clamp((t - (start - edge)) / edge, 0, 1);
    if (t <= end) return 1;
    return 1 - clamp((t - end) / edge, 0, 1);
  }

  function seg(t, start, end, fade) {
    const span = Math.max(0, end - start);
    const edge = Math.min(fade == null ? 0.4 : fade, span / 2 || 0);
    if (t < start || t > end) return 0;
    if (edge <= 0) return 1;
    if (t < start + edge) return clamp((t - start) / edge, 0, 1);
    if (t > end - edge) return 1 - clamp((t - (end - edge)) / edge, 0, 1);
    return 1;
  }

  function fmt(seconds) {
    const total = Math.max(0, seconds || 0);
    const minutes = Math.floor(total / 60);
    const secs = Math.floor(total % 60);
    return minutes + ":" + String(secs).padStart(2, "0");
  }

  function fit(node, maxWidth, minSize) {
    if (!node || typeof node.getComputedTextLength !== "function") return node;
    const floor = minSize == null ? 9 : minSize;
    const attr = node.getAttribute && node.getAttribute("font-size");
    let size = parseFloat(attr || (global.getComputedStyle ? global.getComputedStyle(node).fontSize : "16")) || 16;
    let width = node.getComputedTextLength();
    while (width > maxWidth && size > floor) {
      size = Math.max(floor, size - 0.5);
      node.setAttribute("font-size", String(size));
      width = node.getComputedTextLength();
    }
    return node;
  }

  function create(options) {
    const root = options && options.root;
    const content = options && options.content ? options.content : global.EXPLAINER;
    const autoplay = !options || options.autoplay !== false;
    if (!root) throw new Error("create() needs a root node");
    if (!content || typeof content.build !== "function" || typeof content.render !== "function") {
      throw new Error("window.EXPLAINER must expose build() and render()");
    }

    const ex = api;
    const doc = root.ownerDocument || global.document;
    const prefersReduced = !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const storageKey = (options && options.storageKey) || (content.meta && content.meta.id ? "ceti-explainer:" + content.meta.id : "ceti-explainer");
    const $ = function (name) { return root.querySelector("[data-ex-" + name + "]"); };
    const refs = {
      stage: $("stage"),
      play: $("play"),
      prev: $("prev"),
      next: $("next"),
      scrub: $("scrub"),
      progress: $("progress"),
      handle: $("handle"),
      ticks: $("ticks"),
      time: $("time"),
      duration: $("duration"),
      beatlabel: $("beatlabel"),
      beatindex: $("beatindex"),
      caption: $("caption"),
      chapters: $("chapters"),
      detail: $("detail"),
      speed: $("speed"),
      rmNote: $("rm-note"),
      eyebrow: $("eyebrow"),
      title: $("title"),
      lede: $("lede"),
      tag: $("tag"),
      synthTitle: $("synth-title"),
      synthesis: $("synthesis")
    };

    let cursor = 0;
    const beats = (content.beats || []).map(function (beat, index) {
      const copy = Object.assign({}, beat);
      copy.index = index;
      copy.start = cursor;
      copy.end = cursor + copy.dur;
      cursor = copy.end;
      return copy;
    });
    const duration = beats.length ? beats[beats.length - 1].end : 0;

    const state = {
      playing: false,
      t: 0,
      speed: 1,
      math: true,
      raf: 0,
      lastTs: 0
    };

    function safeStorage(readOnly) {
      try {
        if (!global.localStorage) return null;
        return readOnly ? global.localStorage.getItem(storageKey) : global.localStorage;
      } catch (err) {
        return null;
      }
    }

    const savedRaw = safeStorage(true);
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        if (saved && typeof saved.t === "number") state.t = clamp(saved.t, 0, duration);
        if (saved && typeof saved.speed === "number") state.speed = clamp(saved.speed, 0.5, 2);
        if (saved && typeof saved.math === "boolean") state.math = saved.math;
      } catch (err) {
        /* ignore bad state */
      }
    }

    if (refs.eyebrow) refs.eyebrow.textContent = content.meta && content.meta.eyebrow ? content.meta.eyebrow : "Animated explainer";
    if (refs.title) refs.title.textContent = content.meta && content.meta.title ? content.meta.title : "Episode";
    if (refs.lede) refs.lede.textContent = content.meta && content.meta.lede ? content.meta.lede : "";
    if (refs.tag) refs.tag.textContent = content.meta && content.meta.tag ? content.meta.tag : "";
    if (refs.synthTitle) refs.synthTitle.textContent = content.meta && content.meta.synthTitle ? content.meta.synthTitle : "Takeaway";
    if (refs.synthesis) refs.synthesis.textContent = content.meta && content.meta.synthesis ? content.meta.synthesis : "";
    if (refs.rmNote) {
      refs.rmNote.hidden = !prefersReduced;
      refs.rmNote.textContent = prefersReduced ? "Reduced motion is active, so the player starts paused." : "";
    }

    if (refs.stage) refs.stage.textContent = "";
    content.build(refs.stage || root, { beats: beats, duration: duration, ex: ex });

    function applyMath(on) {
      state.math = !!on;
      if (typeof content.setMath === "function") content.setMath(state.math);
      else if (typeof content.setDetail === "function") content.setDetail(state.math);
      if (refs.detail) refs.detail.checked = state.math;
    }

    function store() {
      const bucket = safeStorage(false);
      if (!bucket) return;
      bucket.setItem(storageKey, JSON.stringify({ t: state.t, speed: state.speed, math: state.math }));
    }

    function activeBeatIndex() {
      for (let i = beats.length - 1; i >= 0; i -= 1) {
        if (state.t >= beats[i].start) return i;
      }
      return 0;
    }

    function renderCurrent() {
      const index = activeBeatIndex();
      const beat = beats[index] || beats[0] || { index: 0, label: "", caption: "" };
      content.render(state.t, { t: state.t, duration: duration, beats: beats, activeBeat: beat, flags: { math: state.math }, ex: ex });
      const pct = duration ? (state.t / duration) * 100 : 0;
      if (refs.scrub) refs.scrub.value = String(state.t);
      if (refs.progress) refs.progress.style.width = pct + "%";
      if (refs.handle) refs.handle.style.left = pct + "%";
      if (refs.time) refs.time.textContent = fmt(state.t);
      if (refs.duration) refs.duration.textContent = fmt(duration);
      if (refs.beatlabel) refs.beatlabel.textContent = beat.label || "";
      if (refs.beatindex) refs.beatindex.textContent = String((beat.index || 0) + 1) + "/" + beats.length;
      if (refs.caption) refs.caption.textContent = beat.caption || "";
      if (refs.play) {
        refs.play.textContent = state.playing ? "Pause" : "Play";
        refs.play.setAttribute("aria-pressed", state.playing ? "true" : "false");
      }
    }

    function seek(next, persist) {
      state.t = clamp(next, 0, duration);
      renderCurrent();
      if (persist !== false) store();
    }

    function tick(ts) {
      if (!state.playing) return;
      if (!state.lastTs) state.lastTs = ts;
      const dt = ((ts - state.lastTs) / 1000) * state.speed;
      state.lastTs = ts;
      if (state.t + dt >= duration) {
        state.t = duration;
        state.playing = false;
        renderCurrent();
        store();
        return;
      }
      state.t += dt;
      renderCurrent();
      state.raf = global.requestAnimationFrame(tick);
    }

    function play() {
      if (state.playing) return;
      state.playing = true;
      state.lastTs = 0;
      renderCurrent();
      state.raf = global.requestAnimationFrame(tick);
    }

    function pause() {
      if (!state.playing) return;
      state.playing = false;
      if (state.raf) global.cancelAnimationFrame(state.raf);
      state.raf = 0;
      renderCurrent();
      store();
    }

    function toggle() {
      if (state.playing) pause();
      else play();
    }

    function stepBeat(dir) {
      const index = activeBeatIndex();
      if (dir < 0) {
        const current = beats[index] || beats[0];
        const target = state.t > current.start + 0.25 ? current.start : (beats[Math.max(0, index - 1)] || current).start;
        seek(target);
      } else {
        const nextBeat = beats[Math.min(beats.length - 1, index + 1)] || beats[index];
        seek(nextBeat.start);
      }
    }

    function jumpBeat(index) {
      const target = beats[Math.min(beats.length - 1, Math.max(0, index))];
      if (target) seek(target.start);
    }

    function setSpeed(value) {
      state.speed = clamp(Number(value) || 1, 0.5, 2);
      if (refs.speed) refs.speed.value = String(state.speed);
      store();
    }

    if (refs.scrub) {
      refs.scrub.min = "0";
      refs.scrub.max = String(duration);
      refs.scrub.step = "0.01";
      refs.scrub.addEventListener("input", function () { seek(Number(refs.scrub.value)); });
    }

    if (refs.prev) refs.prev.addEventListener("click", function () { stepBeat(-1); });
    if (refs.next) refs.next.addEventListener("click", function () { stepBeat(1); });
    if (refs.play) refs.play.addEventListener("click", toggle);
    if (refs.detail) refs.detail.addEventListener("change", function () { applyMath(refs.detail.checked); seek(state.t, false); store(); });
    if (refs.speed) {
      refs.speed.value = String(state.speed);
      refs.speed.addEventListener("change", function () { setSpeed(refs.speed.value); });
    }

    function pointerSeek(event) {
      const rail = refs.scrub || refs.progress && refs.progress.parentNode;
      if (!rail || typeof rail.getBoundingClientRect !== "function") return;
      const rect = rail.getBoundingClientRect();
      const ratio = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      seek(ratio * duration);
    }

    const clickable = refs.progress && refs.progress.parentNode;
    if (clickable) clickable.addEventListener("click", pointerSeek);

    if (refs.ticks) {
      refs.ticks.textContent = "";
      beats.forEach(function (beat) {
        const tickEl = doc.createElement("span");
        tickEl.className = "ex-tick";
        tickEl.style.left = (duration ? (beat.start / duration) * 100 : 0) + "%";
        refs.ticks.appendChild(tickEl);
      });
    }

    if (refs.chapters) {
      refs.chapters.textContent = "";
      beats.forEach(function (beat, index) {
        const button = doc.createElement("button");
        button.type = "button";
        button.textContent = String(index + 1) + ". " + beat.label;
        button.addEventListener("click", function () { jumpBeat(index); });
        refs.chapters.appendChild(button);
      });
    }

    function shouldIgnoreKey(target, key) {
      if (!target || !target.tagName) return false;
      const tag = target.tagName.toLowerCase();
      if (key === " " && tag === "button") return true;
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      return !!target.isContentEditable;
    }

    function onKey(event) {
      if (shouldIgnoreKey(event.target, event.key)) return;
      if (event.key === " " || event.key === "k") {
        event.preventDefault();
        toggle();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (event.shiftKey) stepBeat(-1);
        else seek(state.t - 2);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (event.shiftKey) stepBeat(1);
        else seek(state.t + 2);
      } else if (event.key === "Home") {
        event.preventDefault();
        seek(0);
      } else if (event.key === "End") {
        event.preventDefault();
        seek(duration);
      } else if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        jumpBeat(Math.min(beats.length, Number(event.key)) - 1);
      }
    }

    doc.addEventListener("keydown", onKey);
    applyMath(state.math);
    renderCurrent();
    if (autoplay && !prefersReduced) play();

    const ctrl = {
      root: root,
      content: content,
      beats: beats,
      duration: duration,
      play: play,
      pause: pause,
      toggle: toggle,
      seek: function (t) { seek(t); },
      stepBeat: stepBeat,
      jumpBeat: jumpBeat,
      setMath: function (on) { applyMath(on); renderCurrent(); store(); },
      setDetail: function (on) { applyMath(on); renderCurrent(); store(); },
      setSpeed: setSpeed,
      destroy: function () {
        pause();
        doc.removeEventListener("keydown", onKey);
      }
    };

    global.__ctrl = ctrl;
    return ctrl;
  }

  const api = {
    create: create,
    ease: ease,
    clamp: clamp,
    lerp: lerp,
    win: win,
    ramp: ramp,
    pulse: pulse,
    seg: seg,
    fmt: fmt,
    fit: fit,
    cubicBezier: cubicBezier
  };

  global.CetiExplainer = api;
})(typeof window !== "undefined" ? window : globalThis);
