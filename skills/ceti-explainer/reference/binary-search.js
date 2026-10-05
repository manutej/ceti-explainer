/* ════════════════════════════════════════════════════════════════════
   Binary Search — CETI Explainer content module  (archetype: code / trace)
   --------------------------------------------------------------------
   Search a SORTED array by repeatedly halving the live range. Track lo,
   hi, mid; compare arr[mid] to the target; move the bound that can't hold
   the answer. The REAL algorithm runs in build() — every mid, comparison,
   and the found index are computed in code, then replayed against the clock.

   Worked example: arr = [2,5,8,12,16,23,38,56,72,91], target = 23.
     step1  lo0 hi9 mid4  arr[4]=16 < 23 → lo = 5
     step2  lo5 hi9 mid7  arr[7]=56 > 23 → hi = 6
     step3  lo5 hi6 mid5  arr[5]=23 ==   → found at index 5

   Exposes the CetiExplainer contract: { meta, beats, build, render }.
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, pulse, seg, fit } = ex;

  /* ---------- DATA — run the REAL algorithm, record the trace ---------- */
  const ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]; // sorted, n = 10
  const N = ARR.length;
  const TARGET = 23;

  // Drive the actual binary search; capture one row per comparison.
  function runSearch(arr, target) {
    const trace = [];
    let lo = 0, hi = arr.length - 1, found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;          // floor((lo+hi)/2)
      const v = arr[mid];
      let action, loNext = lo, hiNext = hi;
      if (v === target) { action = "=="; found = mid; }
      else if (v < target) { action = "<"; loNext = mid + 1; }
      else { action = ">"; hiNext = mid - 1; }
      trace.push({ lo, hi, mid, v, action, target, loNext, hiNext, found: found === mid });
      if (v === target) break;
      lo = loNext; hi = hiNext;
    }
    return { trace, found };
  }
  const { trace: TRACE, found: FOUND } = runSearch(ARR, TARGET);
  const STEPS = TRACE.length;               // 3
  const LOG2N = Math.ceil(Math.log2(N));    // ⌈log2 10⌉ = 4  (worst case bound)
  const LINEAR_WORST = N;                    // up to 10 for a linear scan

  // The 6-line function shown in the working zone (active line per step).
  const CODE = [
    "lo = 0,  hi = n - 1",
    "while lo <= hi:",
    "  mid = (lo + hi) // 2",
    "  if arr[mid] == target: return mid",
    "  elif arr[mid] < target: lo = mid + 1",
    "  else: hi = mid - 1",
  ];
  // which code line each trace step lands on (the deciding branch)
  const LINE_FOR_ACTION = { "==": 3, "<": 4, ">": 5 };

  /* ---------- BEATS (8; ~40s) ---------- */
  const beats = [
    { id: "array", label: "Sorted array", dur: 4.2,
      caption: "Ten values, already sorted. Find the target 23 — and find it without scanning every cell." },
    { id: "idea", label: "Halve each time", dur: 4.6,
      caption: "Track a live range with lo and hi. Look at the middle, then throw away the half that can't hold it." },
    { id: "step1", label: "Step 1", dur: 5.6,
      caption: "mid = 4, arr[4] = 16. That's below 23, so 23 must be to the right — move lo past mid." },
    { id: "step2", label: "Step 2", dur: 5.4,
      caption: "mid = 7, arr[7] = 56. Too high — 23 is to the left, so pull hi down below mid." },
    { id: "step3", label: "Step 3", dur: 5.4,
      caption: "mid = 5, arr[5] = 23. Match. Three comparisons, found at index 5." },
    { id: "sorted", label: "Why sorted", dur: 4.6,
      caption: "Sorted order is the whole trick: one comparison tells you which half to keep. Unsorted, it falls apart." },
    { id: "logn", label: "log n vs n", dur: 5.2,
      caption: "Each look halves what's left — about 3 steps here, where scanning one by one could take all 10." },
    { id: "why", label: "Why it matters", dur: 5.4,
      caption: "Halving beats scanning by an enormous margin: a million sorted items take about 20 looks, not a million." },
  ];

  /* ---------- GEOMETRY ---------- */
  const VW = 1000, VH = 464;
  const CELL_W = 72, CELL_H = 44, CELL_GAP = 12;
  const ROW_X = (VW - (N * CELL_W + (N - 1) * CELL_GAP)) / 2; // centered row
  const ROW_Y = 46;
  const cellX = (i) => ROW_X + i * (CELL_W + CELL_GAP);       // left edge of cell i
  const cellCx = (i) => cellX(i) + CELL_W / 2;                // center x of cell i
  const PTR_Y = ROW_Y + CELL_H + 12;                          // pointer track baseline
  const LT_Y = 302;

  const ACC = "var(--ex-accent)";       // copper — the active / mid actor
  const ACC2 = "var(--ex-accent2)";     // sage — lo
  const SUP = "var(--ex-support)";      // slate — hi
  const PEACH = "var(--ex-peach)";      // found highlight
  const INK = "var(--ex-ink)";
  const DIM = "var(--ex-dim)";
  const LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)";
  const CELL = "var(--ex-cell)";

  /* ---------- tiny SVG helpers ---------- */
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) k === "text" ? (n.textContent = attrs[k]) : n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (p, a) => el("g", a, p);
  const setO = (n, o) => { n.style.opacity = o; };

  /* ---------- state refs ---------- */
  const D = {};
  const flags = { math: true };

  /* ---------- BUILD (persistent nodes, once) ---------- */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((b) => (D.beats[b.id] = b));

    const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img",
      "aria-label": "Animated trace of binary search over a sorted array" }, stage);
    D.svg = svg;

    // lower-third divider
    D.ltRule = el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    setO(D.ltRule, 0);

    /* ── ANCHOR: the sorted array row + range highlight + index labels ── */
    const lAnchor = g(svg);

    // live-range highlight pad (sits BEHIND the cells, spans lo..hi)
    D.rangePad = el("rect", { x: cellX(0) - 7, y: ROW_Y - 7, width: 0, height: CELL_H + 14, rx: 10,
      fill: "var(--ex-accent-fill)", stroke: ACC, "stroke-width": 1.2 }, lAnchor);
    setO(D.rangePad, 0);

    // the cells
    D.cellRect = []; D.cellTxt = []; D.idxTxt = [];
    ARR.forEach((v, i) => {
      const x = cellX(i);
      const rect = el("rect", { x, y: ROW_Y, width: CELL_W, height: CELL_H, rx: 8,
        fill: CELL, stroke: LINE, "stroke-width": 1 }, lAnchor);
      const txt = el("text", { x: x + CELL_W / 2, y: ROW_Y + CELL_H / 2 + 1, "text-anchor": "middle",
        "dominant-baseline": "middle", "font-family": "var(--font-mono)", "font-size": 18,
        fill: INK, text: String(v) }, lAnchor);
      // index under the cell (mono, dim)
      const idx = el("text", { x: x + CELL_W / 2, y: ROW_Y - 12, "text-anchor": "middle",
        "font-family": "var(--font-mono)", "font-size": 11, fill: DIM, text: String(i) }, lAnchor);
      D.cellRect.push(rect); D.cellTxt.push(txt); D.idxTxt.push(idx);
    });

    // "sorted ↑" + "target = 23" tags in the anchor band
    D.sortedTag = el("text", { x: ROW_X, y: ROW_Y - 30, "font-family": "var(--font-mono)",
      "font-size": 11, "letter-spacing": "0.16em", fill: DIM, text: "SORTED  ·  n = " + N }, lAnchor);
    setO(D.sortedTag, 0);
    D.targetTag = el("text", { x: cellX(N - 1) + CELL_W, y: ROW_Y - 30, "text-anchor": "end",
      "font-family": "var(--font-mono)", "font-size": 13, fill: ACC, text: "target = " + TARGET }, lAnchor);
    setO(D.targetTag, 0);

    /* ── pointers under the row: lo (sage), hi (slate), mid (copper) ── */
    function ptr(color, label) {
      const grp = g(lAnchor);
      // little triangle marker
      el("path", { d: "M -6 0 L 6 0 L 0 9 Z", fill: color }, grp);
      const lab = el("text", { x: 0, y: 26, "text-anchor": "middle", "font-family": "var(--font-mono)",
        "font-size": 12, "font-weight": 700, fill: color, text: label }, grp);
      setO(grp, 0);
      return { grp, lab };
    }
    D.ptrLo = ptr(ACC2, "lo");
    D.ptrHi = ptr(SUP, "hi");
    D.ptrMid = ptr(ACC, "mid");

    /* ── WORKING ZONE: the 6-line code block (active line highlights) ── */
    const codeX = 150, codeY = 158, codeW = 470, lineH = 22;
    D.codeBlockG = g(svg);
    // panel
    el("rect", { x: codeX - 18, y: codeY - 16, width: codeW, height: CODE.length * lineH + 26, rx: 12,
      fill: PANEL, stroke: LINE, "stroke-width": 1 }, D.codeBlockG);
    // active-line highlight bar (moves)
    D.codeHi = el("rect", { x: codeX - 12, y: codeY - 4, width: codeW - 12, height: lineH, rx: 6,
      fill: "var(--ex-accent-fill)" }, D.codeBlockG);
    setO(D.codeHi, 0);
    D.codeY = codeY; D.codeLineH = lineH; D.codeX = codeX;
    D.codeLines = CODE.map((line, i) => {
      const tx = el("text", { x: codeX, y: codeY + i * lineH + 11, "font-family": "var(--font-mono)",
        "font-size": 14, fill: DIM, text: line }, D.codeBlockG);
      return tx;
    });
    setO(D.codeBlockG, 0);

    /* ── WORKING ZONE: per-step "decision" card (right of the code) ── */
    const decX = 648, decW = 282, decY = 150;
    D.decG = g(svg);
    el("rect", { x: decX, y: decY, width: decW, height: 120, rx: 12, fill: PANEL, stroke: LINE, "stroke-width": 1 }, D.decG);
    el("rect", { x: decX, y: decY, width: 4, height: 120, rx: 2, fill: ACC }, D.decG);
    D.decEyebrow = el("text", { x: decX + 22, y: decY + 26, "font-family": "var(--font-mono)",
      "font-size": 11, "letter-spacing": "0.16em", fill: DIM, text: "THIS COMPARISON" }, D.decG);
    // big "arr[mid] = v" line
    D.decMid = el("text", { x: decX + 22, y: decY + 58, "font-family": "var(--font-mono)",
      "font-size": 20, fill: ACC, text: "" }, D.decG);
    // verdict line ("< target → keep right half")
    D.decVerdict = el("text", { x: decX + 22, y: decY + 88, "font-family": "var(--font-sans)",
      "font-size": 14, fill: INK, text: "" }, D.decG);
    fit(D.decVerdict, decW - 40);
    // the move line ("lo = mid+1")
    D.decMove = el("text", { x: decX + 22, y: decY + 110, "font-family": "var(--font-mono)",
      "font-size": 13, fill: ACC2, text: "" }, D.decG);
    D.decX = decX; D.decW = decW; D.decY = decY;
    setO(D.decG, 0);

    /* ── WORKING ZONE: "sorted matters" mini-scene (beat 6) ── */
    D.sortedSceneG = g(svg);
    buildSortedScene(D.sortedSceneG);
    setO(D.sortedSceneG, 0);

    /* ── WORKING ZONE: log n vs n bars (beat 7) ── */
    D.compareSceneG = g(svg);
    buildCompareScene(D.compareSceneG);
    setO(D.compareSceneG, 0);

    /* ── LOWER-THIRD scenes (one region; use seg) ── */
    D.sIdea = g(svg, { transform: `translate(0 ${LT_Y + 14})` });
    buildIdeaBand(D.sIdea);
    D.sTrace = g(svg, { transform: `translate(0 ${LT_Y + 14})` });
    buildTraceTable(D.sTrace);
    D.sScale = g(svg, { transform: `translate(0 ${LT_Y + 14})` });
    buildScaleBand(D.sScale);
    D.sWhy = g(svg, { transform: `translate(0 ${LT_Y + 14})` });
    buildWhyBand(D.sWhy);
    [D.sIdea, D.sTrace, D.sScale, D.sWhy].forEach((s) => setO(s, 0));
  }

  /* ---- lower-third helpers ---- */
  function lowerEyebrow(parent, x, text) {
    return el("text", { x, y: 4, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.2em", fill: DIM, text }, parent);
  }

  /* idea band (beat 2): plain statement of the loop invariant */
  function buildIdeaBand(s) {
    lowerEyebrow(s, 60, "THE RULE EACH STEP");
    const t1 = el("text", { x: 60, y: 40, "font-family": "var(--font-mono)", "font-size": 16, fill: INK,
      text: "mid = (lo + hi) // 2" }, s);
    fit(t1, 360);
    const t2 = el("text", { x: 60, y: 72, "font-family": "var(--font-sans)", "font-size": 14, fill: DIM,
      text: "If arr[mid] is too small, the answer is in the right half — so move lo. Too big — move hi." }, s);
    fit(t2, 880);
    const t3 = el("text", { x: 60, y: 98, "font-family": "var(--font-sans)", "font-size": 14, fill: DIM,
      text: "Either way, half the range is gone. The target, if present, is always still inside [lo, hi]." }, s);
    fit(t3, 880);
  }

  /* trace table (beats 3–5): one row per real step, filled progressively */
  function buildTraceTable(s) {
    lowerEyebrow(s, 60, "THE TRACE  ·  arr[mid] vs target = " + TARGET);
    const cols = [
      ["step", 70], ["lo", 150], ["hi", 220], ["mid", 290], ["arr[mid]", 390], ["action", 540],
    ];
    // header
    cols.forEach(([name, x]) => {
      el("text", { x, y: 30, "font-family": "var(--font-mono)", "font-size": 11,
        "letter-spacing": "0.12em", fill: DIM, text: name }, s);
    });
    el("line", { x1: 60, y1: 38, x2: 800, y2: 38, stroke: LINE, "stroke-width": 1 }, s);
    D.traceRows = TRACE.map((r, i) => {
      const y = 60 + i * 28;
      const grp = g(s);
      const isFound = r.found;
      const accent = isFound ? PEACH : ACC;
      const mk = (x, txt, opts) => el("text", Object.assign({ x, y, "font-family": "var(--font-mono)",
        "font-size": 14, fill: (opts && opts.fill) || INK, text: txt }, opts || {}), grp);
      mk(70, String(i + 1), { fill: DIM });
      mk(150, String(r.lo), { fill: ACC2 });
      mk(220, String(r.hi), { fill: SUP });
      mk(290, String(r.mid), { fill: accent });
      mk(390, String(r.v), { fill: accent, "font-weight": 700 });
      // action text, e.g. "16 < 23  →  lo = 5"
      let act;
      if (r.action === "==") act = `${r.v} == ${TARGET}  →  found @ ${r.mid}`;
      else if (r.action === "<") act = `${r.v} < ${TARGET}  →  lo = ${r.loNext}`;
      else act = `${r.v} > ${TARGET}  →  hi = ${r.hiNext}`;
      const at = mk(540, act, { fill: isFound ? PEACH : INK });
      fit(at, 260);
      return grp;
    });
  }

  /* sorted-matters working scene (beat 6): one compare = one half discarded */
  function buildSortedScene(s) {
    el("text", { x: VW / 2, y: 168, "text-anchor": "middle", "font-family": "var(--font-mono)",
      "font-size": 11, "letter-spacing": "0.16em", fill: DIM, text: "ONE COMPARISON, HALF THE WORK GONE" }, s);
    // left/right half brackets that "discard"
    const y = 196, w = 360, h = 54, gap = 24, cx = VW / 2;
    // kept half (copper)
    const keep = el("rect", { x: cx - w - gap / 2, y, width: w, height: h, rx: 10,
      fill: "var(--ex-accent-fill)", stroke: ACC, "stroke-width": 1.4 }, s);
    el("text", { x: cx - w / 2 - gap / 2, y: y + h / 2 + 1, "text-anchor": "middle",
      "dominant-baseline": "middle", "font-family": "var(--font-sans)", "font-size": 15, fill: ACC,
      text: "keep this half" }, s);
    // discarded half (dim, struck)
    el("rect", { x: cx + gap / 2, y, width: w, height: h, rx: 10,
      fill: PANEL, stroke: LINE, "stroke-width": 1 }, s);
    el("text", { x: cx + w / 2 + gap / 2, y: y + h / 2 + 1, "text-anchor": "middle",
      "dominant-baseline": "middle", "font-family": "var(--font-sans)", "font-size": 15, fill: DIM,
      text: "can't hold the target — drop it" }, s);
    el("line", { x1: cx + gap / 2 + 20, y1: y + h / 2, x2: cx + gap / 2 + w - 20, y2: y + h / 2,
      stroke: DIM, "stroke-width": 1 }, s);
    void keep;
  }

  /* log n vs n bars (beat 7) */
  function buildCompareScene(s) {
    el("text", { x: VW / 2, y: 150, "text-anchor": "middle", "font-family": "var(--font-mono)",
      "font-size": 11, "letter-spacing": "0.16em", fill: DIM, text: "STEPS TO FIND  ·  n = " + N }, s);
    const baseY = 264, maxBarW = 360, x0 = 300;
    const rows = [
      ["linear scan", LINEAR_WORST, SUP, "up to " + LINEAR_WORST],
      ["binary search", STEPS, ACC, STEPS + " here  ·  ≤ " + LOG2N],
    ];
    const unit = maxBarW / LINEAR_WORST;
    rows.forEach(([label, val, color, note], i) => {
      const y = 176 + i * 46;
      el("text", { x: x0 - 14, y: y + 16, "text-anchor": "end", "font-family": "var(--font-sans)",
        "font-size": 14, fill: color, text: label }, s);
      // track
      el("rect", { x: x0, y, width: maxBarW, height: 22, rx: 6, fill: PANEL, stroke: LINE, "stroke-width": 1 }, s);
      // value bar
      el("rect", { x: x0, y, width: Math.max(8, val * unit), height: 22, rx: 6, fill: color, opacity: 0.85 }, s);
      el("text", { x: x0 + maxBarW + 14, y: y + 16, "font-family": "var(--font-mono)",
        "font-size": 13, fill: color, text: note }, s);
    });
    void baseY;
  }

  /* scale band (beat 7): the doubling argument, derived */
  function buildScaleBand(s) {
    lowerEyebrow(s, 60, "WHY log n  ·  EACH STEP HALVES THE RANGE");
    const t1 = el("text", { x: 60, y: 44, "font-family": "var(--font-mono)", "font-size": 15, fill: INK,
      text: `n = ${N}  →  ${N} → 5 → 2 → 1   (≤ ${LOG2N} halvings)` }, s);
    fit(t1, 520);
    const t2 = el("text", { x: 60, y: 78, "font-family": "var(--font-sans)", "font-size": 14, fill: DIM,
      text: "Double the data and you add just one step. That's log n — not n." }, s);
    fit(t2, 880);
    // the headline number on the right
    el("text", { x: VW - 60, y: 44, "text-anchor": "end", "font-family": "var(--font-mono)",
      "font-size": 14, fill: ACC, text: STEPS + " steps, not " + LINEAR_WORST }, s);
  }

  /* why-it-matters band (beat 8): the million-item payoff, derived */
  function buildWhyBand(s) {
    lowerEyebrow(s, 60, "THE PAYOFF AT SCALE");
    const million = 1_000_000;
    const looks = Math.ceil(Math.log2(million)); // ⌈log2 1e6⌉ = 20
    const cols = [
      ["LINEAR SCAN", `1,000,000 items → up to 1,000,000 comparisons`, DIM, LINE, false],
      ["BINARY SEARCH", `1,000,000 items → about ${looks} comparisons — because it's sorted`, ACC, ACC, true],
    ];
    cols.forEach((c, i) => {
      const x = 60 + i * 455;
      const grp = g(s);
      el("rect", { x, y: 22, width: 425, height: 84, rx: 10, fill: c[4] ? "var(--ex-accent-fill)" : PANEL,
        stroke: c[3], "stroke-width": c[4] ? 1.4 : 1 }, grp);
      el("text", { x: x + 22, y: 48, "font-family": "var(--font-mono)", "font-size": 11,
        "letter-spacing": "0.18em", fill: c[2], text: c[0] }, grp);
      const body = el("text", { x: x + 22, y: 80, "font-family": "var(--font-sans)", "font-size": 14,
        fill: c[4] ? INK : DIM, text: c[1] }, grp);
      fit(body, 390);
    });
    D._whyLooks = looks;
  }

  /* ---------- RENDER (pure function of t) ---------- */
  function render(t) {
    const B = D.beats;
    const mathOn = flags.math ? 1 : 0;

    /* ── ANCHOR: cells stagger in during beat 1, persist after ── */
    ARR.forEach((_, i) => {
      const a = ramp(t, B.array.start + 0.2 + i * 0.07, 0.45, ease.defer);
      setO(D.cellRect[i], a);
      setO(D.cellTxt[i], a);
      setO(D.idxTxt[i], a * 0.9);
    });
    setO(D.sortedTag, ramp(t, B.array.start + 0.4, 0.5));
    setO(D.targetTag, ramp(t, B.array.start + 1.0, 0.6));

    // highlight the target cell (index 5) subtly once it's introduced as the goal
    // (kept faint until found, then it blooms).

    /* ── determine the current trace step for anchor pointers/range ──
       Map beat → step index. Steps live in beats step1/step2/step3. Before
       step1 we show the full range (lo=0,hi=9) settling in during "idea". */
    let lo, hi, mid, showMid, stepIdx;
    const stepBeats = ["step1", "step2", "step3"];
    // default to the idea/full-range view
    lo = 0; hi = N - 1; mid = null; showMid = 0; stepIdx = -1;

    // during step beats, interpolate pointer positions for smooth motion
    for (let k = 0; k < STEPS; k++) {
      const sb = B[stepBeats[k]];
      if (t >= sb.start - 1e-4) { stepIdx = k; }
    }
    // also keep range from idea beat onward
    const rangeOn = ramp(t, B.idea.start + 0.2, 0.6);

    if (stepIdx >= 0) {
      const r = TRACE[stepIdx];
      lo = r.lo; hi = r.hi; mid = r.mid;
      // mid appears partway into the step; the move to next lo/hi happens late
      const sb = B[stepBeats[stepIdx]];
      showMid = ramp(t, sb.start + 0.5, 0.4);
    }

    // pointers/range belong to the trace (beats 2–5). Fade them out as the
    // "sorted matters" beat takes over so they don't linger over later scenes.
    const traceLive = 1 - ramp(t, B.sorted.start - 0.2, 0.5);
    // when lo and mid land on the SAME cell (the final found step), the two
    // markers would stack — lift mid's label up and drop lo's so both read.
    const loMidClash = mid != null && lo === mid;
    const hiMidClash = mid != null && hi === mid;

    const showPtrs = Math.max(rangeOn, stepIdx >= 0 ? 1 : 0) * traceLive;
    // lo pointer (nudged left + label dropped if it clashes with mid's cell)
    placePtr(D.ptrLo, lo, showPtrs, loMidClash ? -22 : 0, loMidClash ? 17 : 0);
    // hi pointer (nudged right + label dropped if it clashes with mid's cell)
    placePtr(D.ptrHi, hi, showPtrs, hiMidClash ? 22 : 0, hiMidClash ? 17 : 0);
    // mid pointer (only during steps, after the compare reveals)
    if (mid != null) {
      placePtr(D.ptrMid, mid, showMid * traceLive, (loMidClash ? 22 : 0) + (hiMidClash ? -22 : 0), 0);
    } else {
      setO(D.ptrMid.grp, 0);
    }

    // live-range highlight pad spans lo..hi
    const padX = cellX(lo) - 7;
    const padW = (cellX(hi) + CELL_W) - cellX(lo) + 14;
    D.rangePad.setAttribute("x", padX);
    D.rangePad.setAttribute("width", Math.max(0, padW));
    setO(D.rangePad, showPtrs * 0.9);

    // highlight the mid cell + recolor: copper while comparing, peach when found
    ARR.forEach((_, i) => {
      let stroke = LINE, sw = 1, fill = CELL;
      if (mid != null && i === mid && showMid > 0.3 && traceLive > 0.5) {
        const isFoundCell = stepIdx >= 0 && TRACE[stepIdx].found;
        stroke = isFoundCell ? PEACH : ACC;
        sw = 1.8;
        fill = isFoundCell ? "var(--ex-accent-fill)" : "var(--ex-accent-fill)";
      } else if (mid != null && (i < lo || i > hi) && showPtrs > 0.5) {
        // discarded cells dim out
        fill = CELL;
      }
      D.cellRect[i].setAttribute("stroke", stroke);
      D.cellRect[i].setAttribute("stroke-width", sw);
      D.cellRect[i].setAttribute("fill", fill);
      // dim cells outside the live range only while the trace is live
      const outOfRange = (i < lo || i > hi) && showPtrs > 0.5 && traceLive > 0.5;
      const baseA = ramp(t, B.array.start + 0.2 + i * 0.07, 0.45, ease.defer);
      setO(D.cellRect[i], baseA * (outOfRange ? 0.32 : 1));
      setO(D.cellTxt[i], baseA * (outOfRange ? 0.4 : 1));
    });

    /* ── WORKING ZONE: code block (beats 2–5) ── */
    // code visible from "idea" through step3; fades for beats 6–8
    const codeOn = ramp(t, B.idea.start + 0.2, 0.5) *
      (1 - ramp(t, B.sorted.start - 0.3, 0.5));
    setO(D.codeBlockG, codeOn);

    // active code line highlight
    let activeLine = -1;
    if (stepIdx >= 0 && showMid > 0.4) {
      activeLine = LINE_FOR_ACTION[TRACE[stepIdx].action];
    } else if (t >= B.idea.start && stepIdx < 0) {
      activeLine = 2; // "mid = (lo+hi)//2" while introducing the idea
    } else if (stepIdx >= 0) {
      activeLine = 2; // computing mid, before the compare reveals
    }
    if (activeLine >= 0 && codeOn > 0.2) {
      D.codeHi.setAttribute("y", D.codeY + activeLine * D.codeLineH - 4);
      setO(D.codeHi, codeOn);
      D.codeLines.forEach((ln, i) => ln.setAttribute("fill", i === activeLine ? INK : DIM));
    } else {
      setO(D.codeHi, 0);
      D.codeLines.forEach((ln) => ln.setAttribute("fill", DIM));
    }

    /* ── WORKING ZONE: decision card (beats 3–5) ── */
    let decOn = 0;
    if (stepIdx >= 0) {
      const sb = B[stepBeats[stepIdx]];
      // each step owns the card during its beat
      decOn = seg(t, sb.start + 0.4, sb.end, 0.35);
      const r = TRACE[stepIdx];
      const accent = r.found ? PEACH : ACC;
      D.decMid.textContent = `arr[${r.mid}] = ${r.v}`;
      D.decMid.setAttribute("fill", accent);
      if (r.action === "==") {
        D.decVerdict.textContent = `equals the target — done`;
        D.decMove.textContent = `return ${r.mid}`;
        D.decMove.setAttribute("fill", PEACH);
      } else if (r.action === "<") {
        D.decVerdict.textContent = `below 23 → keep the right half`;
        D.decMove.textContent = `lo = mid + 1 = ${r.loNext}`;
        D.decMove.setAttribute("fill", ACC2);
      } else {
        D.decVerdict.textContent = `above 23 → keep the left half`;
        D.decMove.textContent = `hi = mid − 1 = ${r.hiNext}`;
        D.decMove.setAttribute("fill", SUP);
      }
    }
    setO(D.decG, decOn);

    /* ── WORKING ZONE: sorted scene (beat 6) ── */
    setO(D.sortedSceneG, seg(t, B.sorted.start + 0.3, B.sorted.end, 0.4));

    /* ── WORKING ZONE: compare bars (beats 7–8) ── */
    setO(D.compareSceneG, seg(t, B.logn.start + 0.3, B.why.end + 1, 0.5));

    /* ── LOWER-THIRD: one region, seg cross-fades ── */
    setO(D.ltRule, ramp(t, B.idea.start, 0.5) * mathOn);
    setO(D.sIdea, seg(t, B.idea.start + 0.3, B.step1.start, 0.4) * mathOn);
    setO(D.sTrace, seg(t, B.step1.start + 0.2, B.sorted.start, 0.4) * mathOn);
    setO(D.sScale, seg(t, B.sorted.start + 0.2, B.logn.end, 0.4) * mathOn);
    setO(D.sWhy, seg(t, B.why.start + 0.2, B.why.end + 1, 0.4) * mathOn);

    /* trace rows reveal progressively — one per step beat */
    if (D.traceRows) {
      D.traceRows.forEach((row, k) => {
        const sb = B[stepBeats[k]];
        setO(row, ramp(t, sb.start + 0.7, 0.5));
      });
    }
  }

  /* place a pointer group under cell index i. dx nudges x (to separate
     coincident markers); dyLab drops the label so two labels don't collide. */
  function placePtr(ptr, i, o, dx, dyLab) {
    const x = cellCx(i) + (dx || 0);
    ptr.grp.setAttribute("transform", `translate(${x} ${PTR_Y})`);
    ptr.lab.setAttribute("y", 26 + (dyLab || 0));
    setO(ptr.grp, o);
  }

  /* ---------- MATH INVARIANT (the gate calls this) ---------- */
  window.__AUDIT = function () {
    const { trace, found } = runSearch(ARR, TARGET);
    // assert found index
    if (found !== 5) return { ok: false, msg: `found index ${found}, expected 5` };
    if (ARR[found] !== TARGET) return { ok: false, msg: `arr[${found}] != target` };
    // assert step count and the log2 bound
    if (trace.length !== 3) return { ok: false, msg: `step count ${trace.length}, expected 3` };
    if (trace.length > LOG2N) return { ok: false, msg: `steps ${trace.length} exceed ⌈log2 n⌉=${LOG2N}` };
    // assert each mid = floor((lo+hi)/2) and the expected sequence
    const expect = [
      { lo: 0, hi: 9, mid: 4, v: 16, action: "<" },
      { lo: 5, hi: 9, mid: 7, v: 56, action: ">" },
      { lo: 5, hi: 6, mid: 5, v: 23, action: "==" },
    ];
    for (let k = 0; k < expect.length; k++) {
      const r = trace[k], e = expect[k];
      if (((r.lo + r.hi) >> 1) !== r.mid) return { ok: false, msg: `step ${k + 1}: mid != floor((lo+hi)/2)` };
      if (r.lo !== e.lo || r.hi !== e.hi || r.mid !== e.mid || r.v !== e.v || r.action !== e.action)
        return { ok: false, msg: `step ${k + 1} trace mismatch` };
    }
    return { ok: true, note: `found @ ${found} in ${trace.length} steps (≤ ⌈log2 ${N}⌉=${LOG2N}); mids 4,7,5 verified` };
  };

  /* expose detail-band scene groups for the gate's §15b region sweep */
  window.__REGIONS = () => ({
    detail: [D.sIdea, D.sTrace, D.sScale, D.sWhy],
    working: [D.codeBlockG, D.sortedSceneG, D.compareSceneG],
  });
  /* §15d anti-collision: top-level blocks that must never overlap. */
  window.__LAYOUT = () => [D.sIdea, D.sTrace, D.sScale, D.sWhy, D.codeBlockG, D.sortedSceneG, D.compareSceneG];

  return {
    meta: {
      id: "binary-search",
      eyebrow: "Algorithms · 01",
      title: "Binary Search",
      lede: "Find 23 in a sorted array without scanning it. Each look <em>halves</em> what's left — watch lo, hi and mid close in.",
      synthTitle: "What binary search <em>really</em> is",
      tag: "Binary search · O(log n), sorted data",
      synthesis:
        "Binary search throws away half of what's left with every comparison — but only because the data is sorted, so one look at the middle tells you which half to keep. That halving is the whole gain: a sorted array of a million items takes about 20 looks, not a million. The cost moves up front, into keeping the data ordered; the search itself becomes nearly free.",
    },
    beats,
    build,
    render,
    setMath(on) { flags.math = !!on; },
  };
})();
