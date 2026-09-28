/* ════════════════════════════════════════════════════════════════════
   Local truths, global maps — CETI Explainer content module
   --------------------------------------------------------------------
   Instance of skills/ceti-explainer/META-PROMPT.md, scaffolded from
   skills/ceti-explainer/briefs/sheaf-glue.brief.json and then authored.
   Every on-screen number is read from DERIVED, which is computed from the
   brief's INPUTS in code; EXPECTED is asserted by __AUDIT and never drawn.

   Archetype  : transformation     Detail band: worked_math
   Anchor     : one loop road unrolled across the top; map patches A, B, C
   Motif      : cartographer's table

   Gate       : node skills/ceti-explainer/assets/gate.mjs episodes/01-local-truths.js
   Build      : python3 skills/ceti-explainer/assets/build.py episodes/01-local-truths.js \
                  "Local truths, global maps" episodes/01-local-truths.html --preset ceti-course
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, seg, fit } = ex;
  const flags = { math: true };

  /* ── 1) DATA ──────────────────────────────────────────────────────
     INPUTS: the brief's raw values (immutable). EXPECTED: what the brief
     promises (asserted, never displayed). DERIVED: computed here. */
  const INPUTS = {
    corners: ["r", "p", "q"],
    true_elevation_m: { r: 9, p: 12, q: 20 },
    datum_offset_m: { A: 0, B: 3, C: 5 },
    readings_m: {
      A: { r: 9, p: 12 },
      B: { p: 15, q: 23 },
      C: { q: 25, r: 14 },
    },
    misread: { map: "A", corner: "r", reading_m: 10 },
  };
  const EXPECTED = {
    g_AB: -3, g_BC: -2, g_CA: 5,
    cocycle_sum: 0,
    shifts: { A: 0, B: -3, C: -5 },
    glued_m: { r: 9, p: 12, q: 20 },
    broken_g_CA: 4,
    broken_sum: -1,
    leftover_m: 1,
  };
  const R = INPUTS.readings_m;
  const DERIVED = (function () {
    const g_AB = R.A.p - R.B.p;                 // offset on A∩B, measured at p
    const g_BC = R.B.q - R.C.q;                 // offset on B∩C, measured at q
    const g_CA = R.C.r - R.A.r;                 // offset on C∩A, measured at r
    const cocycle_sum = g_AB + g_BC + g_CA;
    const shifts = { A: 0, B: g_AB, C: g_AB + g_BC };
    const glued_m = { r: R.A.r + shifts.A, p: R.B.p + shifts.B, q: R.C.q + shifts.C };
    const broken_g_CA = R.C.r - INPUTS.misread.reading_m;
    const broken_sum = g_AB + g_BC + broken_g_CA;
    return { g_AB, g_BC, g_CA, cocycle_sum, shifts, glued_m, broken_g_CA, broken_sum, leftover_m: Math.abs(broken_sum) };
  })();
  const sgn = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v);   // "+5", "−3", "0"
  const m1 = (v) => (Math.round(v * 10) / 10).toString().replace("-", "−") + " m";

  /* ── 2) BEATS (from the brief) ────────────────────────────────────── */
  const beats = [
    { id: "city", label: "One road, 3 maps", dur: 4.0, caption: "One road loops around a city. Three surveyors each map their own arc of it, and nobody maps the whole loop." },
    { id: "local", label: "Local truths", dur: 4.8, caption: "Each map is honest on its own arc: A reads corner p at 12 m, B reads the same corner at 15 m." },
    { id: "overlaps", label: "Overlaps", dur: 4.6, caption: "Where two maps cover the same street they can be compared. That shared stretch is the overlap." },
    { id: "restrict", label: "Restriction", dur: 5.0, caption: "Restrict both maps to the overlap and the disagreement is a constant: B sits exactly 3 m above A." },
    { id: "loop", label: "Around the loop", dur: 5.2, caption: "Walk the offsets around the loop and add them up: −3, −2, +5. The total is zero." },
    { id: "glue", label: "Glue", dur: 5.4, caption: "Zero means the maps glue. Shift B down 3 and C down 5 and one elevation map covers the whole loop." },
    { id: "leftover", label: "The leftover", dur: 5.6, caption: "Misread one corner by a metre and the total is −1. No choice of datums removes it: that leftover is the obstruction." },
    { id: "why", label: "Why it matters", dur: 5.6, caption: "An agent's retrieve, edit, test and commit are patches on one codebase. They glue, or the harness fails at the seam." },
  ];

  /* ── 3) GEOMETRY ────────────────────────────────────────────────── */
  const VW = 1000, VH = 464;
  const ACC = "var(--ex-accent)", ACC2 = "var(--ex-accent2)", SUP = "var(--ex-support)";
  const INK = "var(--ex-ink)", DIM = "var(--ex-dim)", LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)", CELL = "var(--ex-cell)", BAR = "var(--ex-bar)";
  const AFILL = "var(--ex-accent-fill)";
  const LT_Y = 302;
  // the road: loop parameter u ∈ [0,1] → x. Corners r(0) p(⅓) q(⅔) r(1).
  const X0 = 60, X1 = 940;
  const ux = (u) => X0 + (X1 - X0) * u;
  const U = { r: 0, p: 1 / 3, q: 2 / 3, r2: 1 };
  const RANGE = { A: [0, 0.42], B: [0.25, 0.75], C: [0.58, 1] };
  const COLOR = { A: ACC, B: ACC2, C: SUP };
  // anchor band
  const ROAD_Y = 77, PATCH_Y = 58, PATCH_H = 38;
  // working band: elevation e (m) → y
  const BASE_Y = 286, PX_PER_M = 6.5, E_MIN = 6;
  const ey = (e) => BASE_Y - (e - E_MIN) * PX_PER_M;
  // smooth periodic profile through the three true elevations (drawn, not data)
  const T = INPUTS.true_elevation_m;
  const KNOTS = [[0, T.r], [1 / 3, T.p], [2 / 3, T.q], [1, T.r]];
  function E(u) {
    u = clamp(u);
    for (let i = 0; i < 3; i++) {
      const [u0, e0] = KNOTS[i], [u1, e1] = KNOTS[i + 1];
      if (u <= u1) { const s = (u - u0) / (u1 - u0); return e0 + (e1 - e0) * (1 - Math.cos(Math.PI * s)) / 2; }
    }
    return T.r;
  }
  const N = 48;
  function profilePath(map, datum, wedge) {
    const [a, b] = RANGE[map];
    let d = "";
    for (let i = 0; i <= N; i++) {
      const u = a + (b - a) * i / N;
      let e = E(u) + datum;
      if (wedge) e += wedge * clamp(1 - u / b);     // A only: lift the r end by `wedge` metres
      d += (i ? " L " : "M ") + ux(u).toFixed(1) + " " + ey(e).toFixed(1);
    }
    return d;
  }

  /* ── SVG helpers ─────────────────────────────────────────────────── */
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) k === "text" ? (n.textContent = attrs[k]) : n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (p, a) => el("g", a, p);
  const setO = (n, o) => { n.style.opacity = o; };
  const mono = (p, x, y, text, extra) => el("text", Object.assign({ x, y, "font-family": "var(--font-mono)", "font-size": 11, fill: INK, text }, extra || {}), p);
  const sans = (p, x, y, text, extra) => el("text", Object.assign({ x, y, "font-family": "var(--font-sans)", "font-size": 14, fill: DIM, text }, extra || {}), p);
  const eyebrow = (p, x, y, text, extra) => mono(p, x, y, text, Object.assign({ "letter-spacing": "0.2em", fill: DIM }, extra || {}));

  const D = {};

  /* ── BUILD: every node once ─────────────────────────────────────── */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((x) => (D.beats[x.id] = x));
    const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img",
      "aria-label": "Three surveyors' maps of one loop road glue into a single elevation map, then fail to by one metre" }, stage);
    D.svg = svg;
    D.ltRule = el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    setO(D.ltRule, 0);

    /* ─── ANCHOR: the road and the three map patches ─── */
    const A = g(svg); D.anchor = A;
    D.anchorEyebrow = eyebrow(A, 44, 44, "ONE ROAD · THREE SURVEYORS · CORNERS r p q");
    D.loopHint = eyebrow(A, VW - 44, 44, "THE ROAD IS A LOOP · BOTH ENDS ARE CORNER r", { "text-anchor": "end" });
    D.road = el("rect", { x: X0, y: ROAD_Y - 4, width: 0, height: 8, rx: 4, fill: BAR }, A);
    D.patch = {}; D.patchLabel = {}; D.patchAgent = {};
    const AGENT = { A: "RETRIEVE", B: "EDIT", C: "TEST" };
    ["A", "B", "C"].forEach((mp) => {
      const [a, b] = RANGE[mp];
      const grp = g(A);
      el("rect", { x: ux(a), y: PATCH_Y, width: ux(b) - ux(a), height: PATCH_H, rx: 6, fill: PANEL, "fill-opacity": 0.55, stroke: COLOR[mp], "stroke-width": 1.4 }, grp);
      const lx = mp === "C" ? ux(b) - 10 : ux(a) + 10;
      const anchor = mp === "C" ? "end" : "start";
      D.patchLabel[mp] = mono(grp, lx, PATCH_Y + 15, "MAP " + mp, { fill: COLOR[mp], "font-weight": 700, "text-anchor": anchor, "letter-spacing": "0.12em" });
      D.patchAgent[mp] = mono(grp, lx, PATCH_Y + 15, AGENT[mp], { fill: COLOR[mp], "font-weight": 700, "text-anchor": anchor, "letter-spacing": "0.12em" });
      setO(D.patchAgent[mp], 0);
      setO(grp, 0);
      D.patch[mp] = grp;
    });
    // overlap highlights on the road (A∩B, B∩C, and the corner r at both ends)
    D.ovRoad = [
      [RANGE.B[0], RANGE.A[1]], [RANGE.C[0], RANGE.B[1]], [0, 0.045], [0.955, 1],
    ].map(([a, b]) => { const r = el("rect", { x: ux(a), y: PATCH_Y - 2, width: ux(b) - ux(a), height: PATCH_H + 4, rx: 5, fill: AFILL, stroke: ACC, "stroke-width": 1, "stroke-dasharray": "3 3" }, A); setO(r, 0); return r; });
    // corner ticks + labels
    D.corner = {};
    [["r", U.r], ["p", U.p], ["q", U.q], ["r", U.r2]].forEach(([c, u], i) => {
      const grp = g(A);
      el("circle", { cx: ux(u), cy: ROAD_Y, r: 4, fill: INK }, grp);
      mono(grp, ux(u), PATCH_Y + PATCH_H + 16, c, { "text-anchor": "middle", "font-weight": 700 });
      setO(grp, 0);
      D.corner[i] = grp;
    });
    // the vermillion thread that walks the loop (beat 5)
    D.thread = el("line", { x1: X0, y1: ROAD_Y, x2: X1, y2: ROAD_Y, stroke: ACC, "stroke-width": 3, "stroke-linecap": "round", "stroke-dasharray": `${X1 - X0} ${X1 - X0}`, "stroke-dashoffset": X1 - X0 }, A);
    setO(D.thread, 0);

    /* ─── WORKING: the elevation profile chart ─── */
    const W = g(svg); D.chart = W; setO(W, 0);
    D.chartEyebrow = eyebrow(W, 44, 140, "ELEVATION ALONG THE ROAD · EACH MAP AT ITS OWN DATUM");
    D.chartEyebrow2 = eyebrow(W, 44, 140, "ELEVATION ALONG THE ROAD · ONE DATUM · ONE MAP");
    setO(D.chartEyebrow2, 0);
    el("line", { x1: X0, y1: BASE_Y, x2: X1, y2: BASE_Y, stroke: LINE, "stroke-width": 1 }, W);
    // overlap columns in the chart
    D.ovChart = [
      [RANGE.B[0], RANGE.A[1]], [RANGE.C[0], RANGE.B[1]], [0, 0.045], [0.955, 1],
    ].map(([a, b]) => { const r = el("rect", { x: ux(a), y: 150, width: ux(b) - ux(a), height: BASE_Y - 150, fill: AFILL }, W); setO(r, 0); return r; });
    // dashed guide + bracket for the leftover (beat 7)
    D.guide = el("line", { x1: X0, y1: ey(INPUTS.misread.reading_m), x2: X1, y2: ey(INPUTS.misread.reading_m), stroke: ACC, "stroke-width": 1, "stroke-dasharray": "4 4" }, W);
    setO(D.guide, 0);
    const gapTop = ey(INPUTS.misread.reading_m), gapBot = ey(DERIVED.glued_m.r);
    D.gap = g(W);
    el("path", { d: `M ${X1 + 6} ${gapTop} h 6 V ${gapBot} h -6`, fill: "none", stroke: ACC, "stroke-width": 1.6 }, D.gap);
    mono(D.gap, X1 + 18, (gapTop + gapBot) / 2 + 4, m1(DERIVED.leftover_m), { fill: ACC, "font-weight": 700 });
    setO(D.gap, 0);
    // map profiles: each is a group with a path + its corner dots + labels
    D.prof = {}; D.dot = {}; D.lab = {};
    const DOTS = { A: [["r", U.r, "above"], ["p", U.p, "below"]], B: [["p", U.p, "above"], ["q", U.q, "below"]], C: [["q", U.q, "above"], ["r", U.r2, "above"]] };
    ["A", "B", "C"].forEach((mp) => {
      const grp = g(W);
      const path = el("path", { d: profilePath(mp, INPUTS.datum_offset_m[mp], 0), fill: "none", stroke: COLOR[mp], "stroke-width": 2.4, "stroke-linecap": "round" }, grp);
      D.prof[mp] = path;
      D.dot[mp] = {}; D.lab[mp] = {};
      DOTS[mp].forEach(([c, u, pos]) => {
        const key = c === "r" && u === U.r2 ? "r2" : c;
        const e = R[mp][c];
        const dot = el("circle", { cx: ux(u), cy: ey(e), r: 4.5, fill: "var(--ex-ground)", stroke: COLOR[mp], "stroke-width": 2 }, grp);
        const lab = mono(grp, ux(u), pos === "above" ? ey(e) - 9 : ey(e) + 20, m1(e), { "text-anchor": "middle", fill: INK, "font-weight": 700 });
        D.dot[mp][key] = dot; D.lab[mp][key] = lab;
        lab._pos = pos; lab._u = u;
      });
      setO(grp, 0);
      D.profG = D.profG || {}; D.profG[mp] = grp;
    });
    // restriction brackets: the constant offset on each overlap (beat 4)
    D.brk = [];
    [[U.p, R.A.p, R.B.p, -DERIVED.g_AB], [U.q, R.B.q, R.C.q, -DERIVED.g_BC], [U.r2, R.A.r, R.C.r, DERIVED.g_CA]].forEach(([u, lo, hi, off]) => {
      const grp = g(W);
      const x = ux(u) - 9;
      el("path", { d: `M ${x + 5} ${ey(lo)} h -5 V ${ey(hi)} h 5`, fill: "none", stroke: ACC, "stroke-width": 1.4 }, grp);
      mono(grp, x - 5, (ey(lo) + ey(hi)) / 2 + 4, m1(off), { "text-anchor": "end", fill: ACC, "font-weight": 700 });
      if (u === U.r2) { // the loop's other end: A's reading of r, as a ghost dot
        el("circle", { cx: ux(u), cy: ey(lo), r: 4.5, fill: "none", stroke: COLOR.A, "stroke-width": 1.6, "stroke-dasharray": "2 2" }, grp);
        mono(grp, ux(u) + 9, ey(lo) + 4, "A " + m1(lo), { fill: COLOR.A });
      }
      setO(grp, 0);
      D.brk.push(grp);
    });

    /* ─── DETAIL: the worked arithmetic ─── */
    const L = g(svg, { transform: `translate(0 ${LT_Y + 14})` });
    D.dRead = g(L); buildRead(D.dRead);
    D.dOff = g(L); buildOff(D.dOff);
    D.dSum = g(L); buildSum(D.dSum);
    D.dGlue = g(L); buildGlue(D.dGlue);
    D.dLeft = g(L); buildLeft(D.dLeft);
    D.dWhy = g(L); buildWhy(D.dWhy);
    [D.dRead, D.dOff, D.dSum, D.dGlue, D.dLeft, D.dWhy].forEach((s) => setO(s, 0));
  }

  function panel(s, x, w, color) {
    el("rect", { x, y: 28, width: w, height: 74, rx: 8, fill: PANEL, stroke: LINE, "stroke-width": 1 }, s);
    el("rect", { x, y: 28, width: 4, height: 74, rx: 2, fill: color }, s);
  }
  function buildRead(s) {
    eyebrow(s, 60, 4, "READINGS · METRES ABOVE EACH MAP'S OWN BENCHMARK");
    D.readRow = ["A", "B", "C"].map((mp, i) => {
      const x = 60 + i * 300;
      const grp = g(s);
      panel(grp, x, 270, COLOR[mp]);
      mono(grp, x + 22, 54, "MAP " + mp, { fill: COLOR[mp], "font-weight": 700, "font-size": 14, "letter-spacing": "0.12em" });
      const cs = Object.keys(R[mp]);
      mono(grp, x + 22, 84, cs.map((c) => `${c} = ${m1(R[mp][c])}`).join("   ·   "), { "font-size": 14 });
      return grp;
    });
  }
  function buildOff(s) {
    eyebrow(s, 60, 4, "RESTRICT BOTH MAPS TO THE OVERLAP · OFFSET g = LEFT MAP − RIGHT MAP");
    const rows = [
      ["A∩B at p", `g_AB = A(p) − B(p) = ${R.A.p} − ${R.B.p} = ${sgn(DERIVED.g_AB)}`],
      ["B∩C at q", `g_BC = B(q) − C(q) = ${R.B.q} − ${R.C.q} = ${sgn(DERIVED.g_BC)}`],
      ["C∩A at r", `g_CA = C(r) − A(r) = ${R.C.r} − ${R.A.r} = ${sgn(DERIVED.g_CA)}`],
    ];
    D.offRow = rows.map(([lab, txt], i) => {
      const grp = g(s);
      const y = 40 + i * 30;
      mono(grp, 60, y, lab, { fill: DIM });
      mono(grp, 200, y, txt, { "font-size": 15 });
      return grp;
    });
  }
  function buildSum(s) {
    eyebrow(s, 60, 4, "AROUND THE LOOP · THE COCYCLE SUM g_AB + g_BC + g_CA");
    D.sumTerm = [DERIVED.g_AB, DERIVED.g_BC, DERIVED.g_CA].map((v, i) => {
      const t = mono(s, 60 + i * 120, 62, (i ? (v < 0 ? "− " : "+ ") : (v < 0 ? "−" : "")) + Math.abs(v), { "font-size": 26, "font-weight": 700 });
      setO(t, 0); return t;
    });
    D.sumEq = mono(s, 60 + 3 * 120, 62, "= " + DERIVED.cocycle_sum, { "font-size": 26, "font-weight": 700, fill: ACC });
    setO(D.sumEq, 0);
    D.sumNote = sans(s, 60, 94, "Zero: every offset can be paid for by re-choosing benchmarks. The maps can agree.");
    fit(D.sumNote, 860);
    setO(D.sumNote, 0);
  }
  function buildGlue(s) {
    eyebrow(s, 60, 4, "SHIFTS · s_A = 0 · s_B = g_AB · s_C = g_AB + g_BC · reading + shift = one elevation");
    const S = DERIVED.shifts, G = DERIVED.glued_m;
    const rows = [
      ["A", `${sgn(S.A) || "+0"}`, `r ${m1(R.A.r + S.A)} · p ${m1(R.A.p + S.A)}`],
      ["B", `${sgn(S.B)}`, `p ${m1(R.B.p + S.B)} · q ${m1(R.B.q + S.B)}`],
      ["C", `${sgn(S.C)}`, `q ${m1(R.C.q + S.C)} · r ${m1(R.C.r + S.C)}`],
    ];
    D.glueRow = rows.map(([mp, sh, out], i) => {
      const grp = g(s);
      const x = 60 + i * 300;
      panel(grp, x, 270, COLOR[mp]);
      mono(grp, x + 22, 54, `MAP ${mp}  ${sh} m`, { fill: COLOR[mp], "font-weight": 700, "font-size": 14 });
      mono(grp, x + 22, 84, out, { "font-size": 14 });
      setO(grp, 0);
      return grp;
    });
    D.glueNote = sans(s, 60, 122, `One number per corner: r ${m1(G.r)} · p ${m1(G.p)} · q ${m1(G.q)}. That is the global section.`, { fill: INK });
    fit(D.glueNote, 860);
    setO(D.glueNote, 0);
  }
  function buildLeft(s) {
    eyebrow(s, 60, 4, `MISREAD · A(r) = ${INPUTS.misread.reading_m} INSTEAD OF ${R.A.r} · RECOMPUTE`);
    D.leftRow = [
      `g_CA = C(r) − A(r) = ${R.C.r} − ${INPUTS.misread.reading_m} = ${sgn(DERIVED.broken_g_CA)}`,
      `${sgn(DERIVED.g_AB)} ${DERIVED.g_BC < 0 ? "−" : "+"} ${Math.abs(DERIVED.g_BC)} ${DERIVED.broken_g_CA < 0 ? "−" : "+"} ${Math.abs(DERIVED.broken_g_CA)} = ${sgn(DERIVED.broken_sum)}   ≠ 0`,
    ].map((txt, i) => { const t = mono(s, 60, 44 + i * 30, txt, { "font-size": 16, "font-weight": i ? 700 : 400, fill: i ? ACC : INK }); setO(t, 0); return t; });
    D.leftNote = sans(s, 60, 106, "Re-choosing benchmarks adds three shifts whose loop sum is zero. The −1 survives every choice. That class is H¹.");
    fit(D.leftNote, 860);
    setO(D.leftNote, 0);
  }
  function buildWhy(s) {
    eyebrow(s, 60, 4, "THE SAME TEST, FOR AN AGENT");
    const cols = [
      ["AGREE ON EVERY OVERLAP", "Retrieve, edit, test, commit each hold on their own patch and match on the shared files. They glue: one global state.", ACC2, false],
      ["DISAGREE ON ONE", "The edit passes on its file, the test passes on its file, and they contradict on the seam. The harness fails there, not in the neighbourhood.", ACC, true],
    ];
    cols.forEach((c, i) => {
      const x = 60 + i * 455;
      const grp = g(s);
      el("rect", { x, y: 24, width: 425, height: 96, rx: 10, fill: c[3] ? AFILL : PANEL, stroke: c[3] ? ACC : LINE, "stroke-width": c[3] ? 1.4 : 1 }, grp);
      mono(grp, x + 22, 48, c[0], { fill: c[2], "letter-spacing": "0.18em" });
      const fo = el("foreignObject", { x: x + 20, y: 58, width: 390, height: 58 }, grp);
      const div = document.createElement("div");
      div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      div.style.cssText = "font-family:var(--font-sans);font-size:13.5px;line-height:1.4;color:var(--ex-ink)";
      div.textContent = c[1];
      fo.appendChild(div);
    });
  }

  /* ── RENDER: pure function of t ─────────────────────────────────── */
  function render(t) {
    const B = D.beats;
    const mathOn = flags.math ? 1 : 0;

    /* anchor — beat 1: road draws, patches land, corners tick in */
    setO(D.anchor, ramp(t, B.city.start, 0.3));
    const roadP = ramp(t, B.city.start + 0.2, 1.2, ease.glaser);
    D.road.setAttribute("width", (X1 - X0) * roadP);
    ["A", "B", "C"].forEach((mp, i) => {
      const a = ramp(t, B.city.start + 1.3 + i * 0.5, 0.55);
      setO(D.patch[mp], a);
      D.patch[mp].setAttribute("transform", `translate(0 ${(1 - a) * -8})`);
      // beat 8: the patches take their agent-step names
      const swap = win(t, B.why.start + 0.6 + i * 0.25, B.why.start + 1.3 + i * 0.25, ease.warmIn);
      setO(D.patchLabel[mp], 1 - swap);
      setO(D.patchAgent[mp], swap);
    });
    [0, 1, 2, 3].forEach((i) => setO(D.corner[i], ramp(t, B.city.start + 0.4 + i * 0.3, 0.4)));
    setO(D.loopHint, ramp(t, B.city.start + 2.2, 0.6));
    // overlap highlights: beat 3 on the road, then fade out by the loop beat
    const ovOut = 1 - win(t, B.loop.start - 0.3, B.loop.start + 0.3, ease.collect);
    D.ovRoad.forEach((r, i) => setO(r, ramp(t, B.overlaps.start + 0.3 + Math.min(i, 2) * 0.9, 0.5) * ovOut));
    // beat 5: the thread walks the loop
    const walk = win(t, B.loop.start + 0.3, B.loop.start + 3.2, ease.warmIn);
    D.thread.setAttribute("stroke-dashoffset", (X1 - X0) * (1 - walk));
    setO(D.thread, ramp(t, B.loop.start + 0.2, 0.3) * (1 - win(t, B.glue.start + 0.4, B.glue.start + 1.0)));

    /* working — the chart persists from beat 2 */
    setO(D.chart, ramp(t, B.local.start, 0.5));
    D.ovChart.forEach((r, i) => setO(r, ramp(t, B.overlaps.start + 0.3 + Math.min(i, 2) * 0.9, 0.5) * ovOut));
    // glue: B and C slide onto A's datum during beat 6; the wedge lifts A's r end in beat 7, relaxes in beat 8
    const glueP = win(t, B.glue.start + 0.5, B.glue.start + 2.4, ease.glaser);
    const wedgeP = win(t, B.leftover.start + 0.5, B.leftover.start + 1.6, ease.glaser) * (1 - win(t, B.why.start + 0.2, B.why.start + 1.2, ease.warmIn));
    const wedge = DERIVED.leftover_m * wedgeP;
    ["A", "B", "C"].forEach((mp, i) => {
      const grp = D.profG[mp];
      const draw = ramp(t, B.local.start + 0.3 + i * 0.8, 0.9, ease.glaser);
      setO(grp, draw);
      const shift = DERIVED.shifts[mp] * glueP;          // metres added to this map's readings
      if (mp === "A") D.prof.A.setAttribute("d", profilePath("A", 0, wedge));
      else grp.setAttribute("transform", `translate(0 ${-shift * PX_PER_M})`);
      for (const key in D.lab[mp]) {
        const lab = D.lab[mp][key];
        const c = key === "r2" ? "r" : key;
        let shown = R[mp][c] + shift;
        if (mp === "A" && key === "r") { shown += wedge; D.dot.A.r.setAttribute("cy", ey(shown)); lab.setAttribute("y", ey(shown) - 9); }
        if (mp === "A" && key === "p") lab.setAttribute("y", lerp(ey(shown) + 20, ey(shown) - 9, win(t, B.glue.start + 2.6, B.glue.start + 3.2, ease.warmIn)));
        lab.textContent = m1(shown);
        // once glued, the duplicate label at a shared corner steps aside
        const dup = (mp === "B" && key === "p") || (mp === "C" && key === "q");
        setO(lab, dup ? 1 - win(t, B.glue.start + 2.2, B.glue.start + 2.8) : 1);
      }
    });
    setO(D.chartEyebrow, 1 - glueP);
    setO(D.chartEyebrow2, glueP);
    // restriction brackets (beat 4), gone by the glue beat
    D.brk.forEach((b, i) => setO(b, ramp(t, B.restrict.start + 0.4 + i * 1.0, 0.5) * (1 - win(t, B.glue.start, B.glue.start + 0.5))));
    // leftover guide + gap bracket (beat 7), relaxing in beat 8
    setO(D.guide, ramp(t, B.leftover.start + 1.6, 0.5) * wedgeP);
    setO(D.gap, ramp(t, B.leftover.start + 2.0, 0.5) * wedgeP);

    /* detail band — one region, ex.seg hand-offs */
    setO(D.ltRule, ramp(t, B.local.start, 0.5) * mathOn);
    setO(D.dRead, seg(t, B.local.start + 0.3, B.restrict.start, 0.4) * mathOn);
    setO(D.dOff, seg(t, B.restrict.start + 0.2, B.loop.start, 0.4) * mathOn);
    setO(D.dSum, seg(t, B.loop.start + 0.2, B.glue.start, 0.4) * mathOn);
    setO(D.dGlue, seg(t, B.glue.start + 0.2, B.leftover.start, 0.4) * mathOn);
    setO(D.dLeft, seg(t, B.leftover.start + 0.2, B.why.start, 0.4) * mathOn);
    setO(D.dWhy, seg(t, B.why.start + 0.2, B.why.end + 1, 0.4) * mathOn);
    // inner reveals
    D.readRow.forEach((r, i) => setO(r, ramp(t, B.local.start + 0.6 + i * 0.5, 0.5)));
    D.offRow.forEach((r, i) => setO(r, ramp(t, B.restrict.start + 0.5 + i * 1.0, 0.5)));
    D.sumTerm.forEach((r, i) => setO(r, ramp(t, B.loop.start + 0.6 + i * 0.9, 0.4)));
    setO(D.sumEq, ramp(t, B.loop.start + 3.4, 0.5));
    setO(D.sumNote, ramp(t, B.loop.start + 3.9, 0.5));
    D.glueRow.forEach((r, i) => setO(r, ramp(t, B.glue.start + 0.6 + i * 0.5, 0.5)));
    setO(D.glueNote, ramp(t, B.glue.start + 2.8, 0.5));
    D.leftRow.forEach((r, i) => setO(r, ramp(t, B.leftover.start + 0.5 + i * 1.1, 0.5)));
    setO(D.leftNote, ramp(t, B.leftover.start + 3.0, 0.5));
  }

  /* ── AUDIT: recompute everything the screen shows from INPUTS ───── */
  window.__AUDIT = function () {
    // inputs must be self-consistent: reading = true elevation + datum offset
    for (const mp in R) for (const c in R[mp])
      if (R[mp][c] !== INPUTS.true_elevation_m[c] + INPUTS.datum_offset_m[mp])
        return { ok: false, msg: `reading ${mp}(${c})=${R[mp][c]} ≠ true ${INPUTS.true_elevation_m[c]} + datum ${INPUTS.datum_offset_m[mp]}` };
    const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => typeof v === "object" ? flat(v, p + k + ".") : [[p + k, v]]);
    const d = Object.fromEntries(flat(DERIVED));
    for (const [k, v] of flat(EXPECTED))
      if (Math.abs(d[k] - v) > 1e-9) return { ok: false, msg: `${k}: derived ${d[k]} ≠ expected ${v}` };
    // the glued corners must agree from both maps that cover them
    const S = DERIVED.shifts;
    if (R.A.p + S.A !== R.B.p + S.B || R.B.q + S.B !== R.C.q + S.C || R.C.r + S.C !== R.A.r + S.A)
      return { ok: false, msg: "glued readings disagree on an overlap" };
    return { ok: true, note: `g=(${DERIVED.g_AB},${DERIVED.g_BC},${DERIVED.g_CA}) Σ=${DERIVED.cocycle_sum} · shifts B ${S.B} C ${S.C} · glued r ${DERIVED.glued_m.r} p ${DERIVED.glued_m.p} q ${DERIVED.glued_m.q} · misread Σ=${DERIVED.broken_sum} → leftover ${DERIVED.leftover_m} m` };
  };
  window.__REGIONS = () => ({ working: [D.chart], detail: [D.dRead, D.dOff, D.dSum, D.dGlue, D.dLeft, D.dWhy] });
  window.__LAYOUT = () => [D.anchor, D.chart, D.dRead, D.dOff, D.dSum, D.dGlue, D.dLeft, D.dWhy];

  return {
    meta: {
      id: "local-truths",
      eyebrow: "CETI Course · 01",
      title: "Local truths, global maps",
      lede: "Three honest maps of one road. Watch them <em>glue</em> into a single map, and watch one metre of disagreement refuse to.",
      synthTitle: "What a sheaf <em>really</em> is",
      tag: "Sheaf gluing · Čech H¹ · 3 patches",
      synthesis: "A sheaf is a rule for what counts as true on a patch, plus a promise: local truths that agree wherever they overlap glue into one global truth, uniquely. When they do not, the disagreement is not noise. It is a number with a name, and it tells you where the seam is. Agents, maps, and codebases all live under that rule.",
    },
    beats, build, render,
    setMath(on) { flags.math = !!on; },
  };
})();
