/* ════════════════════════════════════════════════════════════════════
   <Title> — CETI Explainer content module
   --------------------------------------------------------------------
   Read first : SKILL.md (the build contract)
   Reference  : ../reference/self-attention.js  (the quality bar)
   Gate       : node assets/gate.mjs <thisfile>   (must PASS before ship)

   A content module is a PURE render-from-time description of one diagram.
   The engine owns the clock; you only describe what the frame looks like
   at any time t. It MUST end by assigning the module to window.EXPLAINER.
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, pulse, seg, fit } = ex;
  const flags = { math: true };

  /* ── 1) DATA ──────────────────────────────────────────────────────
     Derive EVERY on-screen number in code so figures are internally
     consistent (compute the softmax / the average / the score — never
     hand-type a derived value). Lock ONE fully-worked example. */
  // e.g. const SCORES = [...]; const W = softmax(SCORES); ...

  /* ── 2) BEATS ─────────────────────────────────────────────────────
     EXACTLY 8. Durations sum to ~35–45s. Beat 1 introduces the anchor;
     beat 8 is always "Why it matters". One plain-language, no-hype
     caption per beat (≤ ~118 chars) — the spoken idea; the diagram shows it. */
  const beats = [
    { id: "b1",  label: "...",            dur: 3.6, caption: "..." },
    { id: "b2",  label: "...",            dur: 5.0, caption: "..." },
    { id: "b3",  label: "...",            dur: 5.2, caption: "..." },
    { id: "b4",  label: "...",            dur: 4.4, caption: "..." },
    { id: "b5",  label: "...",            dur: 5.2, caption: "..." },
    { id: "b6",  label: "...",            dur: 5.0, caption: "..." },
    { id: "b7",  label: "...",            dur: 4.4, caption: "..." },
    { id: "why", label: "Why it matters", dur: 5.8, caption: "..." },
  ];

  /* ── 3) GEOMETRY ──────────────────────────────────────────────────
     Canvas is ALWAYS 1000 × 464. Anchor near the top (y≈34–200) for
     continuity. Working zone in the middle (one scene visible at a time,
     cross-faded with ex.pulse). Worked arithmetic in a lower-third
     (y≈300–460) gated by flags.math. Min SVG text 11px. Mono for numbers
     & eyebrows, sans for words. Reference --ex-* colors, never raw hex. */
  const VW = 1000, VH = 464;
  const ACC = "var(--ex-accent)", ACC2 = "var(--ex-accent2)", SUP = "var(--ex-support)";
  const INK = "var(--ex-ink)", DIM = "var(--ex-dim)", LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)", CELL = "var(--ex-cell)";
  const LT_Y = 302;

  /* ── tiny SVG helpers (copy as-is) ── */
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) k === "text" ? (n.textContent = attrs[k]) : n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (p, a) => el("g", a, p);
  const setO = (n, o) => { n.style.opacity = o; };
  // a horizontal strip of value-cells (vectors / matrices). returns {group, cells}
  function strip(parent, x, y, vals, cw, ch, opts) {
    opts = opts || {};
    const grp = g(parent, { transform: `translate(${x} ${y})` });
    const cells = vals.map((val, i) => {
      const cx = i * (cw + 3);
      const rect = el("rect", { x: cx, y: 0, width: cw, height: ch, rx: 4,
        fill: opts.fill || CELL, stroke: opts.stroke || LINE, "stroke-width": 1 }, grp);
      const text = el("text", { x: cx + cw / 2, y: ch / 2 + 1, "text-anchor": "middle",
        "dominant-baseline": "middle", "font-family": "var(--font-mono)", "font-size": opts.fs || 12,
        fill: opts.ink || INK, text: typeof val === "number" ? val.toFixed(1) : val }, grp);
      return { rect, text };
    });
    return { group: grp, cells };
  }

  const D = {}; // persistent node refs — created ONCE in build()

  /* ── BUILD: create every node ONCE (never create/destroy in render) ── */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((b) => (D.beats[b.id] = b)); // each beat now has {start,end,index}
    const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img", "aria-label": "..." }, stage);
    D.svg = svg;
    // lower-third divider
    D.ltRule = el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    setO(D.ltRule, 0);
    // ... build the anchor, the working-zone scenes, the lower-third scenes.
    // Everything starts hidden: setO(node, 0).
    // AUTO-FIT any variable / long text so it can't overflow under a brand font:
    //   fit(el("text", {...x, text: longCaption}, scene), maxWidth);
    // (fit measures the rendered width and shrinks to fit; no-ops in the gate.)
    // For same-region scenes use seg(), never pulse(); expose them in __REGIONS.
  }

  /* ── RENDER: mutate nodes as a PURE function of t (seconds) ──
     No setTimeout / no state machine. Drive opacity & transforms from beat
     windows with ex.ramp / ex.win / ex.pulse. Gate the lower-third math by
     (flags.math ? 1 : 0). One scene visible at a time in the working zone. */
  function render(t) {
    const B = D.beats;
    const mathOn = flags.math ? 1 : 0;
    // setO(D.anchorItem[i], ramp(t, B.b1.start + 0.15 + i*0.12, 0.5)); // stagger-in
    // setO(D.sceneA, pulse(t, B.b3.start + 0.3, B.b4.end - 0.1, 0.4) * mathOn);
    // setO(D.ltRule, ramp(t, B.b2.start, 0.5) * mathOn);
  }

  /* ── MATH INVARIANT (recommended): the gate calls this ── */
  window.__AUDIT = function () {
    // recompute derived figures from raw inputs; return {ok:false,msg} on mismatch
    return { ok: true, note: "all worked numbers verified" };
  };

  return {
    meta: {
      id: "ep-id",                                   // kebab-case; storageKey + filename stem
      eyebrow: "Series · NN",                        // mono uppercase kicker
      title: "...",                                  // Fraunces italic H1
      lede: "... <em>one italic word</em> ...",       // HTML ok
      synthTitle: "What this <em>really</em> is",      // HTML ok
      tag: "... real sizes / citation (≤58 chars) ...",
      synthesis: "Two–four sentences. The durable takeaway, in CETI voice.",
    },
    beats, build, render,
    setMath(on) { flags.math = !!on; },
  };
})();
