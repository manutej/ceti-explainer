/* ════════════════════════════════════════════════════════════════════
   Type-safe AI — shared DATA, derived numbers and geometry
   --------------------------------------------------------------------
   The single source of truth for BOTH renderings (SVG scenes and p5 layers).
   Pure: no DOM, no randomness, no clock. Every printed number is derived here.
   Sources: typesafe/research/BRIEF.md ([Sn] tags → SOURCES.md).
   ──────────────────────────────────────────────────────────────────── */
window.TS = (function () {
  'use strict';
  const W = 960, H = 540, DUR = 120;

  /* ---------- timeline ---------- */
  const SC = { s1: [0, 12], s2: [12, 32], s3: [32, 56], s4: [56, 75], s5: [75, 96], s6: [96, 110], s7: [110, 120] };
  const CHAPTERS = [[0, 'Intro'], [12, 'The contract'], [32, 'The mask'], [56, 'Compounding'], [75, 'Enforcement'], [96, 'Limits'], [110, 'Land']];
  const CAPTIONS = [
    [0.6, 6.0, 'Two minutes on type-safe AI: how a model is made to keep its promises.'],
    [6.0, 12.0, 'It starts with an ordinary request: read this, give me data back.'],
    [12.0, 18.5, 'Ask a model to read an invoice and return JSON. It mostly does.'],
    [18.5, 25.0, 'Mostly is the problem: four small slips, and one of them fails silently.'],
    [25.0, 32.0, 'A type is a contract for the shape. Type-safe AI holds the model to it as it writes.'],
    [32.0, 36.0, 'The schema compiles to a grammar: a track with a junction at every choice.'],
    [36.0, 39.5, 'At “currency”, the model’s own odds: “USD” 0.42, “$” 0.18, “dollars” 0.12…'],
    [39.5, 44.0, 'The grammar closes every track the schema can’t accept. Their weight moves over.'],
    [44.0, 46.5, 'Ratios survive — 0.42 becomes 0.677 — and the car takes “USD”.'],
    [46.5, 50.0, 'Had it taken “US”, only “D” could follow. Tokens aren’t letters; the grammar knows.'],
    [50.0, 56.0, 'Every step, the mask covers the whole vocabulary — 128k tokens — in microseconds.'],
    [56.0, 63.0, 'Why it matters: real systems chain steps, and errors multiply.'],
    [63.0, 69.0, 'Ten steps at 95% each: 1,197 of 2,000 runs make it through. About 60%.'],
    [69.0, 75.0, 'Hold every step to its shape, and all 2,000 arrive well-formed. Shape, not truth.'],
    [75.0, 82.0, 'Three ways to get a type: hope, check and retry, or constrain while it writes.'],
    [82.0, 89.0, 'Retrying gets there on the second try. Constraining gets there on the first.'],
    [89.0, 96.0, 'Typed steps snap together. A mismatch stops at the joint, not in production.'],
    [96.0, 103.0, 'A type checks shape, not facts. A wrong value in the right slot still passes.'],
    [103.0, 110.0, 'A bad schema can crowd out reasoning. Put the thinking field before the answer.'],
    [110.0, 118.5, 'Types don’t make it right. They make it checkable.'],
  ];


  /* ---------- key moments (seconds) — BOTH renderings read these; never hard-code a time elsewhere ---------- */
  const T = {
    m1: { conv: [0.8, 4.6], title: [3.8, 4.7], eye: 5.2, sub: [5.2, 6.0], disperse: [9.8, 11.5] },
    m2: { head: 12.3, well: 13.0, type: [14.0, 17.5], stamps: [18.6, 19.6, 20.6, 21.8], silentRing: [21.0, 21.8],
          collapse: [24.0, 24.9], track: [25.0, 26.4], stationLabel0: 26.0, car: [27.2, 30.2] },
    m3: { head: 32.3, tokens: [32.8, 35.2], car: [33.0, 35.4], state: 34.4, fan: [35.0, 36.2], queue: [36.0, 37.6], probs: [36.4, 37.6], oddsLabel: 37.0,
          close: 39.5, closeStagger: 0.12, closeDur: 0.3, reseat: [39.9, 41.3], pprime: [40.0, 41.4], foot: 41.4,
          take: [44.2, 44.8], pulse: [44.8, 45.6], ghost: [46.4, 49.8], fold: [50.0, 50.9], comb: [50.6, 52.0], lit: 52.4, sweep: [52.0, 54.4], counter: [52.0, 54.4], step2: 54.8 },
    m4: { head: 56.3, line: [56.8, 58.0], release: [58.5, 64.0], travel: 4.0, counter: [60.0, 68.0],
          typed: 69.0, release2: [69.6, 72.0], travel2: 1.2, counter2: [70.8, 73.2] },
    m5: { head: 75.3, lanes: [75.8, 76.6], lane1: [76.5, 78.6], fail1: 78.7, lane2: [78.0, 79.6], note: [79.8, 81.2], loop: [81.2, 82.2],
          lane2b: [82.2, 83.6], ok2: 83.7, lane3: [79.0, 80.5], ok3: 80.6, lanesOut: [86.5, 87.4],
          blocks: [87.8, 88.8], couplers: 89.2, typedRun: [89.6, 92.4], pay: 92.8, ring: [92.8, 93.6], untypedRun: [89.8, 92.2], untypedFail: 92.4 },
    m6: { head: 96.3, strip: [97.0, 98.0], manifest: 98.0, cardL: 99.5, cardR: 100.1, items: 100.6, itemStagger: 0.5, filled: 106.0 },
    m7: { setup: 110.6, line: [111.6, 112.6], conv: [111.0, 115.0], ring: [115.5, 116.5], end: 116.8, push: [114.0, 120.0] },
  };

  /* ---------- the worked example (BRIEF §2) ---------- */
  const INPUT = 'Invoice #4471 from Marisol Ortega. Please pay $1,200.00 US dollars by the 15th of November 2026.';
  const RAW = [
    'Sure! Here is the extracted invoice:',
    '{ "customer": "Marisol Ortega",',
    '  "amount": "$1,200.00",',
    '  "currency": "dollars",',
    '  "due": "15 Nov 2026" }',
    'Let me know if you need anything else.',
  ];
  const FAILURES = [
    { code: 'JSON.parse(reply)', result: 'throws — leading prose', silent: false },
    { code: 'amount × 1.16', result: 'NaN', silent: false },
    { code: 'currency === "USD"', result: 'false — falls through', silent: true },
    { code: 'new Date(due)', result: 'depends on the runtime', silent: false },
  ];
  const FIELDS = [
    { key: 'customer', type: 'string', value: '"Marisol Ortega"' },
    { key: 'amount', type: 'number', value: '1200.00' },
    { key: 'currency', type: 'USD│EUR│MXN', value: '"USD"' },
    { key: 'due', type: 'date', value: '"2026-11-15"' },
  ];
  const PREFIX_TOKENS = ['{"', 'customer', '":', ' "', 'Mar', 'isol', ' Ort', 'ega', '",', ' "', 'amount', '":', ' 1200', '.00', ',', ' "', 'currency', '":', ' "'];
  /* M6: well-typed and wrong. The input says the 15th; the model writes the 5th — a valid date, the wrong day. */
  const WRONG = { field: 'due', written: '"2026-11-05"', source: 'by the 15th of November 2026', right: '"2026-11-15"' };

  /* the junction after  "currency": "   — top-8 before masking (illustrative logits, Σ = 1) */
  const CANDS = [
    { tok: 'USD', p: 0.42 }, { tok: '$', p: 0.18 }, { tok: 'dollars', p: 0.12 }, { tok: 'US', p: 0.09 },
    { tok: 'EUR', p: 0.07 }, { tok: 'usd', p: 0.05 }, { tok: 'MXN', p: 0.04 }, { tok: '"', p: 0.03 },
  ];
  const ENUM = ['USD', 'EUR', 'MXN'];
  /** a token is allowed iff it is a prefix of some enum value (case-sensitive) */
  const allowedTok = (tok) => ENUM.some(v => v.startsWith(tok) && tok.length > 0);
  const U = 0.55;          // the fixed sample draw used by both renderings
  const MARKS = 1000;      // counted mass

  /** renormalise: p′ = p/Σallowed for allowed, 0 otherwise. weights optional (interaction). */
  function renorm(constrain = true, weights) {
    const ps = CANDS.map((c, i) => (weights ? weights[i] : c.p));
    const tot = ps.reduce((a, b) => a + b, 0);
    const base = ps.map(p => p / tot);
    const allow = CANDS.map(c => !constrain || allowedTok(c.tok));
    const mass = base.reduce((a, p, i) => a + (allow[i] ? p : 0), 0);
    const pp = base.map((p, i) => (allow[i] ? p / mass : 0));
    return { p: base, allow, mass, pp };
  }
  /** largest-remainder integer split of n by probabilities */
  function counts(ps, n = MARKS) {
    const raw = ps.map(p => p * n), fl = raw.map(Math.floor);
    let left = n - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return fl;
  }
  function sample(ps, u = U) { let c = 0; for (let i = 0; i < ps.length; i++) { c += ps[i]; if (u < c) return i; } return ps.length - 1; }

  /* ---------- compounding (M4) ---------- */
  const RUNS = 2000;
  function arrivals(rate = 0.95, steps = 10) {
    const a = [RUNS]; for (let k = 1; k <= 10; k++) a.push(k <= steps ? Math.round(RUNS * Math.pow(rate, k)) : a[k - 1]);
    return a; // a[k] = runs still on the mainline after junction k
  }
  const pow = (r, k) => Math.pow(r, k);
  /** canonical arrivals counter for M4 — BOTH renderings show exactly this number at time t (pass 1 then pass 2).
   *  Survivors are spread evenly through the release order, so the count rises linearly from the first to the last arrival. */
  function runsArrived(t, state = STATE) {
    const m4 = T.m4, a = arrivals(state.stepRate, state.steps), surv = a[10];
    if (t < m4.typed) return { pass: 1, arrived: Math.round(surv * Math.min(1, Math.max(0, (t - m4.release[0] - m4.travel) / (m4.release[1] - m4.release[0])))), of: RUNS, survivors: surv };
    return { pass: 2, arrived: Math.round(RUNS * Math.min(1, Math.max(0, (t - m4.release2[0] - m4.travel2) / (m4.release2[1] - m4.release2[0])))), of: RUNS, survivors: surv };
  }

  /* ---------- the vocabulary (M3d) ---------- */
  const VOCAB = 128256;     // Llama-3 tokenizer size, the XGrammar setting [S3]
  const ALLOWED_AT_STEP = 4;

  /* ---------- geometry (960 × 540 viewBox) ---------- */
  const G = {
    W, H,
    head: { eyebrowY: 44, titleY: 84, cx: 480, titleSize: 40 },   // v2: 1.3× scale — headline 40, mono 15, sans 18; nothing below 13
    body: { y0: 116, y1: 446 },
    foot: { y: 486 },
    gauge: 3,                         // rail pair spacing
    /* M2 */
    well: { x: 60, y: 132, w: 470, h: 250 },
    fails: { x: 566, y0: 168, dy: 56 },
    schemaTrack: { x0: 80, x1: 880, y: 300, stations: [200, 400, 600, 780] },
    /* M3 */
    lockup: { x: 60, y: 126 },
    entry: { x0: 60, x1: 250, y: 296 },
    J: { x: 250, y: 296 },
    fan: { xBend: 400, x1: 900, ys: [162, 200, 238, 276, 314, 352, 390, 428] },   // track i ends at ys[i]
    queue: { x0: 470, x1: 860, rows: 6, pitch: 3.6, mark: 2.6 },                   // a ribbon ON the track: 6 rows, 3.6 pitch
    labels: { tokX: 416, probX: 872 },
    ghost: { J2: { x: 560, y: 276 } },                                             // the 'US' → 'D' junction
    comb: { x0: 60, y0: 158, x1: 900, y1: 430 },
    /* M4 */
    main: { x0: 60, x1: 850, y: 220 },
    junctions: Array.from({ length: 10 }, (_, k) => ({ x: 110 + 76 * k, y: 220 })),
    siding: { dx: 34, y: 420 },       // junction k → (x+dx, siding.y): piles stand at the foot as a 0.95^k staircase
    pen: { x0: 860, y0: 170, x1: 920, y1: 270 },   // survivors collect ON the line end
    counter: { x: 60, y: 470, anchor: 'start' },
    /* M5 */
    lanes: { ys: [170, 270, 370], x0: 260, x1: 860, labelX: 60, shedX: 620, shedW: 60, shedH: 28 },
    blocks: [
      { id: 'extract', sig: 'Email → Invoice', in: 'Email', out: 'Invoice', x: 80, y: 190, w: 220, h: 60 },
      { id: 'approve', sig: 'Invoice → ApprovedInvoice', in: 'Invoice', out: 'ApprovedInvoice', x: 370, y: 190, w: 250, h: 60 },
      { id: 'pay', sig: 'pay(ApprovedInvoice)', in: 'ApprovedInvoice', out: 'Receipt', x: 690, y: 190, w: 210, h: 60, tool: true },
    ],
    untypedY: 340,
    /* M6 */
    cards: { y: 196, h: 250, left: { x: 60, w: 410 }, right: { x: 490, w: 410 } },
    strip: { y: 132 },
    moire: { x0: 60, x1: 900, y0: 166, y1: 188, pitch: 12, pitch2: 12.12, shift: 6 },
    /* M1 / M7 — whale (from ceti-explainer feature-cut-v2, 600×360 source space) */
    WPATHS: [
      { d: 'M88 168 C 96 152, 118 138, 152 138 C 188 138, 220 148, 252 162 C 292 178, 332 192, 376 198 C 418 204, 456 206, 488 198 C 510 192, 524 184, 532 176', n: 26 },
      { d: 'M88 168 C 92 158, 104 150, 124 148 C 156 144, 196 154, 240 168 C 286 184, 336 196, 388 200', n: 14 },
      { d: 'M232 180 C 248 210, 280 232, 322 238 C 308 224, 290 208, 276 192', n: 10 },
      { d: 'M488 198 C 512 198, 532 192, 548 178 C 562 166, 572 148, 572 130 C 558 138, 542 148, 528 158 C 540 152, 556 142, 568 126 C 552 132, 534 142, 518 154', n: 16 },
      { d: 'M532 176 C 548 172, 562 162, 572 150', n: 4 },
    ],
    EYE: { x: 150, y: 160 },          // source-space eye position
    TF1: { s: 1.6, tx: -51, ty: -82 },  // hero (M1): whale spans x 90–864, y 120–300
    TF7: { s: 1.0, tx: 152, ty: 196 }, // under the landing line: x 240–724, y 322–434
  };

  /** quick parser for the whale's 'M x y C …' paths → array of cubic segments [[p0,p1,p2,p3],…] */
  function cubics(d) {
    const n = d.replace(/[MC,]/g, ' ').trim().split(/\s+/).map(Number);
    const segs = []; let p = [n[0], n[1]];
    for (let i = 2; i + 5 < n.length + 0; i += 6) { const s = [p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]]; segs.push(s); p = s[3]; }
    return segs;
  }
  /** points evenly spaced by arc length along a whale path (plain JS, no DOM) */
  function samplePath(d, count) {
    const segs = cubics(d), pts = [];
    const at = (s, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * s[0][k] + 3 * v * v * u * s[1][k] + 3 * v * u * u * s[2][k] + u * u * u * s[3][k]); };
    const dense = []; segs.forEach(s => { for (let i = 0; i <= 64; i++) dense.push(at(s, i / 64)); });
    const L = [0]; for (let i = 1; i < dense.length; i++) L.push(L[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
    const tot = L[L.length - 1]; let j = 0;
    for (let k = 0; k < count; k++) {
      const target = (k / Math.max(1, count - 1)) * tot; while (j < L.length - 2 && L[j + 1] < target) j++;
      const f = (target - L[j]) / Math.max(1e-9, L[j + 1] - L[j]);
      pts.push({ x: dense[j][0] + (dense[j + 1][0] - dense[j][0]) * f, y: dense[j][1] + (dense[j + 1][1] - dense[j][1]) * f });
    }
    return pts;
  }
  const tf = (T, p) => ({ x: p.x * T.s + T.tx, y: p.y * T.s + T.ty });

  /* ---------- interaction state ---------- */
  const STATE = { constrain: true, u: U, stepRate: 0.95, steps: 10, inject: 'ok' };

  /* ---------- audit ---------- */
  function audit(state = STATE) {
    const msgs = [];
    const ok = (c, m) => { if (!c) msgs.push(m); };
    const sum = CANDS.reduce((a, c) => a + c.p, 0);
    ok(Math.abs(sum - 1) < 1e-9, 'Σp ≠ 1: ' + sum);
    const r = renorm(true);
    ok(Math.abs(r.mass - 0.62) < 1e-9, 'allowed mass ≠ 0.62: ' + r.mass);
    ok(Math.abs(r.pp.reduce((a, b) => a + b, 0) - 1) < 1e-9, 'Σp′ ≠ 1');
    ok(r.allow.filter(Boolean).length === 4, 'expected 4 allowed tokens');
    ok(Math.abs(r.pp[0] / r.pp[4] - CANDS[0].p / CANDS[4].p) < 1e-9, 'ratio USD:EUR not preserved');
    ok(['0.677', '0.145', '0.113', '0.065'].join() === [0, 3, 4, 6].map(i => r.pp[i].toFixed(3)).join(), 'printed p′ mismatch');
    const before = counts(r.p), after = counts(r.pp);
    ok(before.reduce((a, b) => a + b, 0) === MARKS && after.reduce((a, b) => a + b, 0) === MARKS, 'marks not conserved');
    ok(CANDS[sample(r.pp)].tok === 'USD', 'constrained sample is not USD');
    ok(CANDS[sample(renorm(false).pp)].tok === '$', 'free sample is not $');
    const a = arrivals(0.95, 10);
    ok(a[10] === 1197, 'arrivals[10] ≠ 1197: ' + a[10]);
    const derailed = a.slice(1).reduce((s, v, k) => s + (a[k] - v), 0);
    ok(derailed + a[10] === RUNS, 'derailed + arrived ≠ 2000');
    ok(pow(0.95, 10).toFixed(3) === '0.599' && pow(0.99, 10).toFixed(3) === '0.904' && pow(0.999, 10).toFixed(3) === '0.990', 'compounding text mismatch');
    ok(G.blocks.every((b, i) => i === 0 || G.blocks[i - 1].out === b.in), 'a typed coupler joins different types');
    ok(CAPTIONS.every(c => c[2].length <= 90), 'caption > 90 chars');
    return { ok: msgs.length === 0, msg: msgs.join('; '), note: `p′ ${[0, 3, 4, 6].map(i => r.pp[i].toFixed(3)).join(' ')} · counts ${after.join(',')} · arrivals ${a.join(',')}` };
  }

  return {
    W, H, DUR, SC, T, CHAPTERS, CAPTIONS, INPUT, RAW, FAILURES, FIELDS, PREFIX_TOKENS, WRONG,
    CANDS, ENUM, allowedTok, U, MARKS, renorm, counts, sample, RUNS, arrivals, runsArrived, pow, VOCAB, ALLOWED_AT_STEP,
    G, samplePath, tf, STATE, audit,
  };
})();
