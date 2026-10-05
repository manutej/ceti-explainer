/* ════════════════════════════════════════════════════════════════════
   Self-Attention — CETI Explainer content module
   --------------------------------------------------------------------
   The coreference classic: "The animal didn't cross the street because
   it was tired."  We compute what "it" attends to, step by step, with
   REAL numbers (softmax derived in code so every figure is consistent).

   Exposes the CetiExplainer content contract: { meta, beats, build, render }.
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, pulse, seg } = ex;

  /* ---------- DATA (locked + internally consistent) ---------- */
  const TOKENS = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "tired"];
  const FOCUS = 7; // "it"

  // scaled scores sᵢ = (q·kᵢ)/√dₖ  — anchored on the worked "animal" example.
  const SCALED = [-0.9, 1.35, -0.7, -0.3, -0.9, 0.45, -0.5, 0.55, -0.2, -0.4];
  // softmax → attention weights (computed, sums to 1)
  const EXP = SCALED.map(Math.exp);
  const SUM = EXP.reduce((a, b) => a + b, 0);
  const W = EXP.map((e) => e / SUM);
  const MAXW = Math.max(...W);

  // value vectors (dₖ = 4) — animal's value carries the "biological entity" signal
  const V = {
    0: [0.1, 0.0, 0.2, 0.1], 1: [0.9, 0.7, 0.3, 0.2], 2: [-0.2, 0.1, 0.0, 0.3],
    3: [0.3, -0.1, 0.4, 0.0], 4: [0.1, 0.0, 0.2, 0.1], 5: [0.4, 0.2, 0.6, -0.2],
    6: [0.0, 0.2, -0.1, 0.2], 7: [0.2, 0.5, 0.1, 0.0], 8: [0.1, 0.1, 0.0, 0.3],
    9: [-0.1, 0.3, 0.2, 0.4],
  };
  // z = Σ wᵢ·vᵢ  (the new contextual representation of "it")
  const Z = [0, 0, 0, 0];
  for (let i = 0; i < 10; i++) for (let d = 0; d < 4; d++) Z[d] += W[i] * V[i][d];

  // the worked dot product (q and k_animal chosen to give q·k = 2.70)
  const Q = [1.0, 0.8, 0.5, -0.5];
  const K_ANIMAL = [1.3, 1.0, 0.5, -0.7];

  const SPOTLIGHT = [1, 7, 5]; // animal, it, street — the three we name

  /* ---------- BEATS ---------- */
  const beats = [
    { id: "sentence", label: "The sentence", dur: 3.6,
      caption: "Ten tokens. One question — what does “it” actually refer to? Attention answers it with numbers." },
    { id: "querykeys", label: "Query meets keys", dur: 5.0,
      caption: "“it” emits a query vector. Every token offers a key. The query asks; the keys answer." },
    { id: "score", label: "Score: q·k", dur: 5.4,
      caption: "Similarity is a dot product. Line up the query with each key and multiply — “animal” lines up best." },
    { id: "scale", label: "Scale ÷ √dₖ", dur: 4.0,
      caption: "Divide every score by √dₖ. It keeps the numbers in a sane range so training stays stable." },
    { id: "softmax", label: "Softmax", dur: 5.2,
      caption: "Softmax turns the scores into weights that sum to 1 — a probability over where to look." },
    { id: "blend", label: "Blend the values", dur: 5.2,
      caption: "Each token also carries a value. Mix them by their weights — “animal” pours in the most." },
    { id: "result", label: "A new “it”", dur: 4.4,
      caption: "The blend is the new “it” — a vector that now carries the meaning of an animal, not a street." },
    { id: "why", label: "Why it matters", dur: 5.8,
      caption: "Without attention, “it” is a fixed vector. With it, meaning is relational — the sentence decides." },
  ];

  /* ---------- GEOMETRY ---------- */
  const VW = 1000, VH = 464;
  const COL0 = 86, COLW = 92;            // column i center = COL0 + i*COLW
  const colX = (i) => COL0 + i * COLW;
  const ROW_Y = 34, ROW_H = 34;          // token chip row
  const NUM_Y = 162;                     // resting y for score numbers
  const BASE_Y = 276;                    // bar baseline
  const BAR_SCALE = 148 / MAXW;          // tallest bar ≈ 148px
  const CHIP_W = 80;
  const LT_Y = 302;                      // lower-third hairline
  const ACC = "var(--ex-accent)";
  const ACC2 = "var(--ex-accent2)";
  const INK = "var(--ex-ink)";
  const DIM = "var(--ex-dim)";
  const LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)";

  /* ---------- tiny SVG helpers ---------- */
  const SVGNS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (parent, attrs) => el("g", attrs, parent);
  function setO(node, o) { node.style.opacity = o; }
  // build a horizontal vector strip of `vals`; returns {group, cells:[{rect,text}]}
  function strip(parent, x, y, vals, cw, ch, opts) {
    opts = opts || {};
    const grp = g(parent, { transform: `translate(${x} ${y})` });
    const cells = vals.map((val, i) => {
      const cx = i * (cw + 3);
      el("rect", { x: cx, y: 0, width: cw, height: ch, rx: 4,
        fill: opts.fill || "var(--ex-cell)", stroke: opts.stroke || LINE, "stroke-width": 1 }, grp);
      const text = el("text", { x: cx + cw / 2, y: ch / 2 + 1, "text-anchor": "middle",
        "dominant-baseline": "middle", "font-family": "var(--font-mono)",
        "font-size": opts.fs || 12, fill: opts.ink || INK, text: typeof val === "number" ? val.toFixed(1) : val }, grp);
      return { rect: grp.lastChild, text };
    });
    return { group: grp, cells };
  }
  const fmtPct = (w) => Math.round(w * 100) + "%";

  /* ---------- state refs ---------- */
  const D = {};
  const flags = { math: true };

  /* ---------- BUILD (persistent nodes, once) ---------- */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((b) => (D.beats[b.id] = b));

    const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img",
      "aria-label": "Animated derivation of a self-attention weight" }, stage);
    D.svg = svg;

    // faint baseline axis
    el("line", { x1: 44, y1: BASE_Y, x2: VW - 44, y2: BASE_Y, stroke: LINE, "stroke-width": 1 }, svg);
    // lower-third divider
    D.ltRule = el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    setO(D.ltRule, 0);

    /* layer order: connectors → bars → columns extras → tokens → lower third */
    const lConn = g(svg);
    const lBars = g(svg);
    const lCols = g(svg);
    const lTok = g(svg);
    const lLower = g(svg, { transform: `translate(0 ${LT_Y + 14})` });

    /* connectors: query "it" → each key (arcs that dip below the row) */
    D.conn = TOKENS.map((_, i) => {
      const x0 = colX(FOCUS), x1 = colX(i);
      const dip = ROW_Y + ROW_H + 22 + Math.abs(i - FOCUS) * 3;
      const path = el("path", {
        d: `M ${x0} ${ROW_Y + ROW_H} C ${x0} ${dip} ${x1} ${dip} ${x1} ${ROW_Y + ROW_H + 4}`,
        fill: "none", stroke: ACC, "stroke-width": 1.4, "stroke-linecap": "round" }, lConn);
      setO(path, 0);
      return path;
    });

    /* bars + key pills + score numbers per column */
    D.bars = []; D.keyPills = []; D.nums = []; D.pcts = [];
    TOKENS.forEach((tok, i) => {
      const x = colX(i);
      // key pill (beat 2)
      const kg = g(lCols);
      el("rect", { x: x - 30, y: 96, width: 60, height: 20, rx: 5, fill: PANEL,
        stroke: LINE, "stroke-width": 1 }, kg);
      el("text", { x: x, y: 107, "text-anchor": "middle", "dominant-baseline": "middle",
        "font-family": "var(--font-mono)", "font-size": 11, fill: DIM,
        text: "k" }, kg);
      el("text", { x: x + 8, y: 110, "text-anchor": "middle", "font-family": "var(--font-mono)",
        "font-size": 8, fill: DIM, text: i }, kg);
      setO(kg, 0);
      D.keyPills.push(kg);

      // bar
      const bar = el("rect", { x: x - 23, y: BASE_Y, width: 46, height: 0, rx: 3,
        fill: i === 1 ? ACC : "var(--ex-bar)", stroke: "none" }, lBars);
      D.bars.push(bar);

      // score / percent number (rides above the bar)
      const num = el("text", { x: x, y: NUM_Y, "text-anchor": "middle", "dominant-baseline": "middle",
        "font-family": "var(--font-mono)", "font-size": 14, fill: INK, text: "" }, lCols);
      setO(num, 0);
      D.nums.push(num);
    });

    /* token chips */
    D.tokG = []; D.tokRect = [];
    TOKENS.forEach((tok, i) => {
      const x = colX(i);
      const grp = g(lTok);
      const isFocus = i === FOCUS;
      const rect = el("rect", { x: x - CHIP_W / 2, y: ROW_Y, width: CHIP_W, height: ROW_H, rx: 7,
        fill: isFocus ? "var(--ex-accent-fill)" : PANEL,
        stroke: isFocus ? ACC : LINE, "stroke-width": isFocus ? 1.6 : 1 }, grp);
      el("text", { x: x, y: ROW_Y + ROW_H / 2 + 1, "text-anchor": "middle", "dominant-baseline": "middle",
        "font-family": "var(--font-sans)", "font-weight": isFocus ? 600 : 500, "font-size": 14,
        fill: isFocus ? ACC : INK, text: tok }, grp);
      setO(grp, 0);
      D.tokG.push(grp);
      D.tokRect.push(rect);
    });
    // "query" tag under "it"
    D.qTag = el("text", { x: colX(FOCUS), y: ROW_Y - 12, "text-anchor": "middle",
      "font-family": "var(--font-mono)", "font-size": 10, "letter-spacing": "0.18em",
      fill: ACC, text: "QUERY" }, lTok);
    setO(D.qTag, 0);

    /* ─── LOWER THIRD scenes (each a group, faded by beat) ─── */
    // scene: query/keys/values legend (beat 2)
    D.sQKV = g(lLower); buildQKV(D.sQKV);
    // scene: worked dot product (beats 3–4)
    D.sScore = g(lLower); buildScore(D.sScore);
    // scene: softmax formula (beat 5)
    D.sSoft = g(lLower); buildSoftmax(D.sSoft);
    // scene: value blend → z (beats 6–7)
    D.sBlend = g(lLower); buildBlend(D.sBlend);
    // scene: why it matters (beat 8)
    D.sWhy = g(lLower); buildWhy(D.sWhy);
    [D.sQKV, D.sScore, D.sSoft, D.sBlend, D.sWhy].forEach((s) => setO(s, 0));
  }

  /* ---- lower-third scene builders ---- */
  function lowerEyebrow(parent, x, text) {
    return el("text", { x, y: 4, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.2em", fill: DIM, text }, parent);
  }
  function buildQKV(s) {
    lowerEyebrow(s, 60, "THREE PROJECTIONS OF EVERY TOKEN");
    const items = [
      ["query  q", "what am I looking for?", ACC],
      ["key    k", "what do I offer?", ACC2],
      ["value  v", "what do I pass on?", "var(--ex-support)"],
    ];
    items.forEach((it, i) => {
      const x = 60 + i * 310;
      el("rect", { x, y: 28, width: 280, height: 74, rx: 8, fill: PANEL, stroke: LINE, "stroke-width": 1 }, s);
      el("rect", { x, y: 28, width: 4, height: 74, rx: 2, fill: it[2] }, s);
      el("text", { x: x + 22, y: 56, "font-family": "var(--font-mono)", "font-size": 16,
        "font-weight": 700, fill: it[2], text: it[0] }, s);
      el("text", { x: x + 22, y: 82, "font-family": "var(--font-sans)", "font-size": 14,
        fill: DIM, text: it[1] }, s);
    });
  }
  function buildScore(s) {
    lowerEyebrow(s, 60, "ONE WEIGHT, WORKED IN FULL  ·  q · kₐₙᵢₘₐₗ");
    // q strip + k strip
    D.scoreQ = strip(s, 60, 28, Q, 46, 30, { fill: "var(--ex-accent-fill)", stroke: ACC, ink: ACC, fs: 13 });
    el("text", { x: 60 - 8, y: 47, "text-anchor": "end", "font-family": "var(--font-mono)",
      "font-size": 12, fill: ACC, text: "q" }, s);
    D.scoreK = strip(s, 60, 70, K_ANIMAL.map((v) => v), 46, 30, { fill: PANEL, stroke: ACC2, ink: ACC2, fs: 13 });
    el("text", { x: 60 - 8, y: 89, "text-anchor": "end", "font-family": "var(--font-mono)",
      "font-size": 12, fill: ACC2, text: "k" }, s);
    // the arithmetic
    const dot = Q.map((q, i) => q * K_ANIMAL[i]);
    D.scoreMath = el("text", { x: 290, y: 52, "font-family": "var(--font-mono)", "font-size": 15,
      fill: INK, text: "" }, s);
    D.scoreMath.textContent = `q·k = ${dot.map((d) => d.toFixed(2)).join(" + ").replace(/\+ -/g, "− ")} = 2.70`;
    D.scoreScale = el("text", { x: 290, y: 86, "font-family": "var(--font-mono)", "font-size": 15,
      fill: DIM, text: "÷ √dₖ  =  2.70 / 2  =  1.35" }, s);
  }
  function buildSoftmax(s) {
    lowerEyebrow(s, 60, "SCORES → A PROBABILITY THAT SUMS TO 1");
    el("text", { x: 60, y: 58, "font-family": "var(--font-mono)", "font-size": 17, fill: INK,
      text: "wᵢ = exp(sᵢ) ⁄ Σ exp(sⱼ)" }, s);
    el("text", { x: 60, y: 90, "font-family": "var(--font-sans)", "font-size": 14, fill: DIM,
      text: "Bigger scores win an exponentially larger share of the attention." }, s);
    D.softSum = el("text", { x: VW - 60, y: 58, "text-anchor": "end", "font-family": "var(--font-mono)",
      "font-size": 16, fill: ACC, text: "Σ wᵢ = 1.00" }, s);
  }
  function buildBlend(s) {
    lowerEyebrow(s, 60, "z = Σ wᵢ · vᵢ   ·   THE WEIGHTED VALUE BLEND");
    // top contributors rows
    const order = [...Array(10).keys()].sort((a, b) => W[b] - W[a]).slice(0, 3);
    D.blendRows = order.map((i, r) => {
      const y = 30 + r * 30;
      const grp = g(s);
      el("text", { x: 60, y: y + 16, "font-family": "var(--font-sans)", "font-size": 13,
        fill: i === 1 ? ACC : DIM, "font-weight": i === 1 ? 600 : 400, text: TOKENS[i] }, grp);
      el("text", { x: 150, y: y + 16, "text-anchor": "end", "font-family": "var(--font-mono)",
        "font-size": 13, fill: i === 1 ? ACC : DIM, text: fmtPct(W[i]) }, grp);
      strip(grp, 165, y, V[i], 40, 24, { fill: PANEL, stroke: i === 1 ? ACC : LINE,
        ink: i === 1 ? ACC : DIM, fs: 11 });
      return grp;
    });
    // result z
    el("text", { x: 560, y: 46, "text-anchor": "end", "font-family": "var(--font-mono)",
      "font-size": 14, fill: INK, text: "z_it =" }, s);
    D.zStrip = strip(s, 575, 28, Z, 56, 34, { fill: "var(--ex-accent-fill)", stroke: ACC, ink: ACC, fs: 14 });
    D.blendNote = el("text", { x: 575, y: 96, "font-family": "var(--font-sans)", "font-size": 14,
      fill: DIM, text: `“animal” owns ${fmtPct(W[1])} of the blend — its value dominates.` }, s);
  }
  function buildWhy(s) {
    lowerEyebrow(s, 60, "STATIC EMBEDDING vs. CONTEXTUAL");
    const cols = [
      ["WITHOUT ATTENTION", '“it” is a fixed vector — identical in every sentence. Coreference is impossible.', DIM, LINE, false],
      ["WITH ATTENTION", `“it” ← ${fmtPct(W[1])} animal + ${fmtPct(W[7])} self + … It now points at a living thing.`, ACC, ACC, true],
    ];
    cols.forEach((c, i) => {
      const x = 60 + i * 455;
      const grp = g(s);
      el("rect", { x, y: 24, width: 425, height: 86, rx: 10, fill: c[4] ? "var(--ex-accent-fill)" : PANEL,
        stroke: c[3], "stroke-width": c[4] ? 1.4 : 1 }, grp);
      el("text", { x: x + 22, y: 50, "font-family": "var(--font-mono)", "font-size": 11,
        "letter-spacing": "0.18em", fill: c[2], text: c[0] }, grp);
      const fo = el("foreignObject", { x: x + 20, y: 60, width: 390, height: 46 }, grp);
      const div = document.createElement("div");
      div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      div.style.cssText = `font-family:var(--font-sans);font-size:14px;line-height:1.45;color:${c[4] ? "var(--ex-ink)" : "var(--ex-dim)"}`;
      div.textContent = c[1];
      fo.appendChild(div);
    });
  }

  /* ---------- RENDER (pure function of t) ---------- */
  function render(t) {
    const B = D.beats;
    const inb = (id) => t >= B[id].start - 0.0001;

    /* tokens: stagger in during beat 1, persist after */
    TOKENS.forEach((_, i) => {
      const a = ramp(t, B.sentence.start + 0.15 + i * 0.12, 0.5, ease.defer);
      setO(D.tokG[i], a);
      D.tokG[i].setAttribute("transform", `translate(0 ${(1 - a) * 8})`);
    });
    // "it" query tag + emphasis pulse late in beat 1 → stays through scoring
    const qOn = ramp(t, B.sentence.start + 1.4, 0.6) * (1 - win(t, B.softmax.start, B.softmax.start + 0.6));
    setO(D.qTag, qOn);
    const focusPulse = 1 + 0.0 ; // (chip already styled; keep stable)

    /* connectors / key pills: beat 2, fade out by softmax */
    const connOut = 1 - win(t, B.softmax.start - 0.2, B.softmax.start + 0.4, ease.collect);
    TOKENS.forEach((_, i) => {
      const swing = Math.abs(i - FOCUS) * 0.12;
      const aConn = ramp(t, B.querykeys.start + 0.3 + swing, 0.5) * connOut * (i === FOCUS ? 0 : 1);
      setO(D.conn[i], aConn * 0.8);
      const aKey = ramp(t, B.querykeys.start + 0.5 + swing, 0.5) * connOut;
      setO(D.keyPills[i], aKey);
    });

    /* per-column number: shows scaled score (beat3-4), morphs to % atop bar (beat5+) */
    TOKENS.forEach((_, i) => {
      const showScore = ramp(t, B.score.start + 0.4 + i * 0.04, 0.5);
      const barH = W[i] * BAR_SCALE;
      const barGrow = win(t, B.softmax.start + 0.2 + i * 0.05, B.softmax.start + 1.4, ease.glaser);
      const h = barH * barGrow;
      D.bars[i].setAttribute("height", h);
      D.bars[i].setAttribute("y", BASE_Y - h);
      // bar fade
      setO(D.bars[i], win(t, B.softmax.start, B.softmax.start + 0.5));

      const num = D.nums[i];
      const toPct = win(t, B.softmax.start, B.softmax.start + 1.2, ease.warmIn);
      // scaled-score value, scaling shown during beat 4
      const scaledShown = i === 1 ? "1.35" : SCALED[i].toFixed(2);
      const rawShown = (SCALED[i] * 2).toFixed(2);
      const scaleMix = win(t, B.scale.start + 0.3, B.scale.start + 1.2, ease.warmIn);
      if (toPct < 0.5) {
        num.textContent = scaleMix < 0.5 && t < B.scale.start + 0.6 ? rawShown : scaledShown;
        num.setAttribute("font-size", 14);
        num.setAttribute("fill", i === 1 ? ACC : INK);
      } else {
        num.textContent = fmtPct(W[i]);
        num.setAttribute("font-size", i === 1 ? 16 : 13);
        num.setAttribute("font-weight", i === 1 ? 700 : 400);
        num.setAttribute("fill", i === 1 ? ACC : DIM);
      }
      // y position: scores sit mid (250) then ride up above the bar top
      const yScore = NUM_Y, yBar = BASE_Y - h - 13;
      num.setAttribute("y", lerp(yScore, yBar, toPct));
      const visScore = showScore * (1 - win(t, B.blend.start + 0.4, B.blend.start + 1.0));
      setO(num, Math.max(visScore, 0));
      // de-emphasise non-animal bars during blend
      if (i !== 1) setO(D.bars[i], (D.bars[i].style.opacity || 0) * (1 - 0.45 * win(t, B.blend.start, B.blend.start + 0.8)));
    });

    /* lower-third rule visible from beat 2 on (gated by the worked-math flag) */
    const mathOn = flags.math ? 1 : 0;
    setO(D.ltRule, ramp(t, B.querykeys.start, 0.5) * mathOn);

    /* lower-third scenes — ONE region, so use ex.seg: fades stay inside each
       window and scenes hand off through a brief empty gap. (pulse would leave
       two scenes half-lit at every beat boundary → frozen double-exposure.) */
    setO(D.sQKV, seg(t, B.querykeys.start + 0.4, B.score.start, 0.4) * mathOn);
    setO(D.sScore, seg(t, B.score.start + 0.2, B.scale.end, 0.4) * mathOn);
    setO(D.sSoft, seg(t, B.softmax.start + 0.2, B.softmax.end, 0.4) * mathOn);
    setO(D.sBlend, seg(t, B.blend.start + 0.2, B.result.end, 0.4) * mathOn);
    setO(D.sWhy, seg(t, B.why.start + 0.2, B.why.end + 1, 0.4) * mathOn);

    /* score scene: reveal the arithmetic progressively */
    if (D.scoreMath) {
      setO(D.scoreMath, ramp(t, B.score.start + 1.2, 0.5));
      setO(D.scoreScale, ramp(t, B.scale.start + 0.3, 0.5));
    }
    /* softmax sum ticks in */
    if (D.softSum) setO(D.softSum, ramp(t, B.softmax.start + 1.4, 0.6));

    /* blend scene: rows stagger, z fills, note arrives */
    if (D.blendRows) {
      D.blendRows.forEach((r, k) => setO(r, ramp(t, B.blend.start + 0.6 + k * 0.45, 0.5)));
      const zFill = ramp(t, B.result.start + 0.2, 0.7);
      D.zStrip && setO(D.zStrip.group, zFill);
      D.blendNote && setO(D.blendNote, ramp(t, B.result.start + 0.9, 0.6));
    }

    /* on beat 7, recolor "it" chip text toward "means an animal" — subtle link line */
    const meaning = win(t, B.result.start + 0.3, B.result.start + 1.2);
    D.tokRect[FOCUS].setAttribute("stroke-width", 1.6 + meaning * 1.2);
  }

  /* ---------- MATH INVARIANT (optional but recommended) ----------
     The gate calls window.__AUDIT() and fails if ok===false. Recompute
     every derived on-screen figure from raw inputs and assert it here so a
     sharp viewer can never catch an inconsistency the gate didn't. */
  window.__AUDIT = function () {
    const sum = W.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 1e-6) return { ok: false, msg: `softmax sums to ${sum}` };
    if (W.indexOf(MAXW) !== 1) return { ok: false, msg: "argmax weight is not 'animal'" };
    const dot = Q.reduce((a, q, i) => a + q * K_ANIMAL[i], 0);
    if (Math.abs(dot - 2.70) > 1e-9) return { ok: false, msg: `q·k = ${dot}, expected 2.70` };
    return { ok: true, note: `softmax→1.0000 · animal=${Math.round(W[1] * 100)}% · q·k=2.70→1.35` };
  };

  /* expose the detail-band scene groups so the gate's §15b region sweep can
     prove only one is ever lit (paused-frame == playing-frame). */
  window.__REGIONS = () => ({ detail: [D.sQKV, D.sScore, D.sSoft, D.sBlend, D.sWhy] });
  /* §15d anti-collision: list the top-level blocks that must never overlap. */
  window.__LAYOUT = () => [D.sQKV, D.sScore, D.sSoft, D.sBlend, D.sWhy];

  return {
    meta: {
      id: "self-attention",
      eyebrow: "Transformer Internals",
      title: "Self-Attention",
      lede: "“it” attends to “animal.” Watch one attention weight built from real numbers — query, key, score, softmax, value.",
      tag: "Scaled dot-product attention · 2017",
      synthesis:
        "Attention is learned weighted-averaging by query–key similarity. The model learns the projections Wᵠ, Wᵏ, Wᵛ so the dot products encode the right “asking / offering” relationships for the task. Stack a dozen layers, each with multiple heads, and every token is re-read against the whole sequence at every layer — each pass sharpening what every word means in context. That loop, repeated, is the Transformer.",
    },
    beats,
    build,
    render,
    setMath(on) { flags.math = !!on; },
  };
})();
