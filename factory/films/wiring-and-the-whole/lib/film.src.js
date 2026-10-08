/* ═════ wiring-and-the-whole · film.src.js (the film; lib/assemble.py prepends the arsenal) ═════
   One clock: render(t, s, K) is a pure function of t and s.answer. Motion is timed with ARSENAL.core.timeline
   (one compiled timeline + scene windows); layouts come from ARSENAL.structures (scatter → rows → chips, grids for
   every count); wires and the depth lines are drawn on with ARSENAL.patterns.reveal; the zoom into witness/ is
   ARSENAL.patterns.camera's keyed sampler; the theory picture is ARSENAL.glyphs (document glyphs) pointed at by
   ARSENAL.patterns.annotations (callouts, bracket). Seeds: the pile is structures.scatter(seed = FILM.seed); the
   pile's tilt is mulberry32(FILM.seed). */
(function () {
'use strict';
const F = window.FILM, P = F.params, A = window.ARSENAL;
const TLM = A.core.timeline, S = A.structures, REV = A.patterns.reveal, CAM = A.patterns.camera.api, GL = A.glyphs, ANN = A.patterns.annotations;
const W = 960, H = 540;

/* ── the repo's 469 files, grouped by top folder (facts.json; claims fExperiments … fOther) ── */
const GROUPS = [['experiments', P.fExperiments], ['fixtures', P.fFixtures], ['docs', P.fDocs], ['scripts', P.fScripts],
  ['preview', P.fPreview], ['witness', P.fWitness], ['crates', P.fCrates], ['other', P.files - P.fExperiments - P.fFixtures - P.fDocs - P.fScripts - P.fPreview - P.fWitness - P.fCrates]];
const N = P.files, GW = 5;                                  // GW = index of witness/
const G0 = []; { let k = 0; GROUPS.forEach(([, n]) => { G0.push(k); k += n; }); }
const W0 = G0[GW];                                          // first witness/ mark; its first 16 are the toy bank
const MODS = [
  { id: 'shared', n: P.mShared, files: ['PageDto', 'AuditDto', 'EventTopics', 'AppConfig'] },
  { id: 'accounts', n: P.mAccounts, files: ['Controller', 'Service', 'Repository', 'Money'] },
  { id: 'savings', n: P.mSavings, files: ['Controller', 'Service', 'Repository'] },
  { id: 'loans', n: P.mLoans, files: ['Controller', 'Service', 'Repository', 'Money'] },
  { id: 'report', n: P.mReport, files: ['ReportModule'] },
];
const BX = (m) => 48 + m * 176, BY = 132, BW = 160, CH = 26, CP = 34;      // module boxes and chips
const chipXY = (m, k) => ({ x: BX(m) + BW / 2, y: BY + 40 + k * CP + CH / 2 });
/* the 13 checks of witness/WITNESS.json, in plain words (the JSON keys are in claims.json / NOTES.md) */
const CHECKS = ['the join holds together', 'the join is the smallest one', 'new names stay inside', 'no false alarm', 'a rename keeps the square',
  'plugs are kept', 'swap two systems: same shape', 'the measure survives the swap', 'maps keep the measure',
  'the alarm fires on the Money clash', 'join order does not matter', 'an empty join changes nothing', 'squares chain up'];
/* the theory picture: 12 files in 3 clusters; plugs; wires that only join matching plugs */
const TC = [[190, 250], [480, 250], [770, 250]], TD = [[-48, -48], [48, -48], [-48, 48], [48, 48]];
const plugAt = (c, d, side) => { const [cx, cy] = TC[c], [dx, dy] = TD[d]; return side === 'r' ? [cx + dx + 20, cy + dy] : side === 'l' ? [cx + dx - 20, cy + dy] : [cx + dx, cy + dy + 30]; };
const PLUGS = [];                                            // {c, d, side, kind} kind 0 round accent, 1 square accent2
[0, 1, 2].forEach((c) => { PLUGS.push({ c, d: 0, side: 'r', kind: 0 }, { c, d: 1, side: 'l', kind: 0 }, { c, d: 2, side: 'r', kind: 0 }, { c, d: 3, side: 'l', kind: 0 }); });
PLUGS.push({ c: 0, d: 1, side: 'r', kind: 0 }, { c: 1, d: 0, side: 'l', kind: 0 }, { c: 1, d: 1, side: 'r', kind: 0 }, { c: 2, d: 0, side: 'l', kind: 0 },
  { c: 2, d: 3, side: 'b', kind: 1 }, { c: 0, d: 3, side: 'b', kind: 1 });

/* ── one timeline for every channel (arsenal/core/timeline.js); beats = film.json chapters ── */
const tl = TLM.timeline().init({ pile: 0, sort: 0, chips: 0, boxes: 0, checks: 0, rungs: 0, tokbars: 0, e2in: 0, e2pay: 0, e2bc: 0, e3a: 0, e3b: 0, e3tok: 0, e3pct: 0, cols: 0, e5ba: 0, nos: 0, fix: 0, q: 0, lim: 0 });
tl.beat('hook')
  .play('pile', 1, 2.6, 'out')                              // 0 → 2.6  the pile rains in
  .wait(6.4).beat('commit')                                 // 9
  .wait(8).beat('case')                                     // 17   (theory 17–29 runs on scene-local time)
  .wait(12.6).play('sort', 1, 3.2, 'inout')                 // 29.6 → 32.8  pile → rows by folder
  .wait(3.4).all((x) => x.play('chips', 1, 2.4, 'inout'),   // 36.2 → 38.6  the 16 marks fly as dots into module chips
    (x) => x.wait(0.3).play('boxes', 1, 0.9))               // 36.5 → 37.4  while the module boxes open
  .wait(2.4).play('checks', P.checks, 3.0, 'linear')        // 41 → 44      one check every 0.23 s
  .wait(4.4).play('rungs', 3, 3.0, 'linear')                // 48.4 → 51.4  the ladder's three rungs
  .wait(0.6).play('tokbars', 1, 1.6, 'out')                 // 52 → 53.6    1,923 vs 947
  .wait(1.4).beat('count')                                  // 55
  .wait(0.4).play('e2in', 1, 3.2, 'out')                    // 55.4 → 58.6  three families appear
  .wait(1.6).play('e2pay', 1, 3.6, 'inout')                 // 60.2 → 63.8  the 514 family floods past n* = 5
  .wait(1.4).play('e2bc', 1, 2.6, 'inout')                  // 65.2 → 67.8  169 and 54
  .wait(1.7).play('e3a', 1, 3.2, 'inout')                   // 69.5 → 72.7  arm A answers
  .wait(1.3).play('e3b', 1, 2.4, 'inout')                   // 74 → 76.4    arm B answers
  .play('e3tok', 1, 1.6, 'out')                             // 76.4 → 78
  .play('e3pct', 1, 0.6)                                    // 78 → 78.6    ratios, only after the counts
  .wait(3.0).play('cols', P.e5depths, 3.0, 'linear')        // 81.6 → 84.6  ten depth columns arrive
  .wait(1.0).play('e5line', 1, 2.6, 'inout')                // 85.6 → 88.2  the flat line, drawn last
  .wait(2.0).play('e5ba', 1, 0.6)                           // 90.2 → 90.8
  .wait(4.5).play('nos', 1, 0.3)                            // 95.3 → 95.6  the memo; stamp at 96.4
  .wait(3.9).play('fix', 1, 0.6)                            // 99.5 → 100.1
  .wait(3.9).beat('monday').play('q', 1, 1.2, 'out')        // 104 → 105.2
  .wait(3.0).play('lim', 1, 0.8);                           // 108.2 → 109
const TL = tl.compile();
const v = (k, t) => TL.at(k, t);
const SC = {
  hook: TLM.scene(0, 9.2, null, { fadeIn: 0, fade: 0.5 }), commit: TLM.scene(9, 17.2, null, { fade: 0.5 }),
  th: TLM.scene(17, 29.3, null, { fade: 0.5 }), repo: TLM.scene(29, 36.2, null, { fade: 0.5 }), wit: TLM.scene(36, 48.3, null, { fade: 0.5 }),
  lad: TLM.scene(48, 55.3, null, { fade: 0.5 }), e2: TLM.scene(55, 68.3, null, { fade: 0.5 }), e3: TLM.scene(68, 81.3, null, { fade: 0.5 }),
  e5: TLM.scene(81, 95.3, null, { fade: 0.5 }), nos: TLM.scene(95, 104.3, null, { fade: 0.5 }), mon: TLM.scene(104, 112.2, null, { fade: 0.5, fadeOut: 0 }),
};
const on = (k, t) => SC[k].at(t);

let PILE, ROWS, TILT, REVW, REVD, CAMK, E2, E3, TOK, TOKA, LAND, CHIPS, REVT, REVX, ANNS, RUNGS;

window.FILM_RENDER = {
  setup(p, K) {
    const C = K.C, fam = (k) => ({ family: K.FONT[k].replace(/^'([^']+)'.*$/, '$1'), weight: k === 'disp' ? 600 : 400 });
    PILE = S.scatter(N, { x: 48, y: 128, w: 864, h: 268 }, F.seed, { shrink: 0.6 });
    const idx = GROUPS.map((g, k) => Array.from({ length: g[1] }, (_, j) => G0[k] + j));
    ROWS = S.rows(idx, { x: 196, y: 122, w: 716, h: 270 }, { groupGap: 10 });
    const r = S.mulberry32(F.seed); TILT = Array.from({ length: N }, () => (r() - 0.5) * 1.4);
    const col = { bg: 'rgba(0,0,0,0)', ink: C.ink, accent: C.accent, accent2: C.soft, muted: C.muted, line: C.line, chalk: C.ink, panel: C.panel };
    TOK = { id: 'wiring', color: col, type: { disp: fam('disp'), mono: fam('mono'), body: fam('sans') } };
    TOKA = Object.assign({}, TOK, { color: Object.assign({}, col, { chalk: C.paper }) });   // pins/pills read on panel
    /* the witness band, and the camera keys that fly into it (patterns/camera: log-space zoom, cubic) */
    const wb = ROWS.groups[GW], cx = wb.x + (P.fWitness * ROWS.pitch) / 2, cy = wb.y + wb.h / 2;
    const key = (t, x, y, zoom) => ({ t, x, y, zoom, fx: 0, fy: 0, fw: 1, fh: 1, fa: 0, label: '' });
    CAMK = [key(33.2, W / 2, H / 2, 1), key(35.4, cx, cy, 2.5), key(36.2, cx, cy, 2.5)];
    /* the 16 toybank marks: where the zoom leaves them (LAND) and the chip they fly into (CHIPS); structures.transition */
    const camEnd = CAM.sample(CAMK, 36.2, 'cubic'), li = [], ci = [];
    let fi = 0;
    MODS.forEach((m, j) => { for (let k = 0; k < m.n; k++, fi++) {
      const mi = ROWS.items[W0 + fi], q = CAM.worldToScreen(mi.x, mi.y, camEnd, W, H), c = chipXY(j, k);
      li.push({ i: fi, x: q.x, y: q.y, w: 9, h: 9, g: j, a: 1, hl: false }); ci.push({ i: fi, x: c.x, y: c.y, w: 9, h: 9, g: j, a: 1, hl: false });
    } });
    LAND = { kind: 'land', n: 16, box: { x: 0, y: 0, w: W, h: H }, size: 9, legible: true, items: li };
    CHIPS = { kind: 'chips', n: 16, box: { x: 0, y: 0, w: W, h: H }, size: 9, legible: true, items: ci };
    /* wires between chips (patterns/reveal, custom paths): verticals inside a module, then report → both Money types */
    const port = (m, k) => { const c = chipXY(m, k); return [c.x + BW / 2 - 10, c.y]; };
    const vert = (m, k) => { const a = port(m, k), b = port(m, k + 1); return { spec: { kind: 'bezier', pts: [a, [a[0] + 16, a[1]], [b[0] + 16, b[1]], b] }, st: { role: 'ink', w: 1.6, head: 7, alpha: 0.9 } }; };
    const paths = [vert(1, 0), vert(1, 1), vert(2, 0), vert(2, 1), vert(3, 0), vert(3, 1)];
    const rp = chipXY(4, 0), low = BY + 40 + 4 * CP + 18;
    [1, 3].forEach((m, j) => {
      const mo = chipXY(m, 3), a = [rp.x, rp.y + CH / 2], b = [mo.x + 30 * (j ? 1 : -1), mo.y + CH / 2];
      paths.push({ spec: { kind: 'bezier', pts: [a, [a[0], low + 10 + j * 8], [b[0] + 60, low + 10 + j * 8], [b[0] + 30, low + 10 + j * 8], [b[0], low + 10 + j * 8], [b[0], b[1] + 14], b] },
        st: { role: 'accent', w: 2, head: 8, pen: 3.5, alpha: 0.95 } });
    });
    REVW = REV.setup(p, { seed: F.seed }, { paths, stagger: 0.32, dur: 3.2, hold: 0.05, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: true });
    /* the theory wires: six inside the clusters (fade with the files), three between them (stay) */
    const ln2 = (a, b, st) => ({ spec: { kind: 'line', pts: [a, b] }, st });
    const inW = [], xW = [];
    [0, 1, 2].forEach((c) => { inW.push(ln2(plugAt(c, 0, 'r'), plugAt(c, 1, 'l'), { role: 'ink', w: 1.8, head: 6 }), ln2(plugAt(c, 2, 'r'), plugAt(c, 3, 'l'), { role: 'ink', w: 1.8, head: 6 })); });
    const bez = (a, b, dy) => ({ spec: { kind: 'bezier', pts: [a, [a[0] + dy, a[1]], [b[0] - dy, b[1]], b] }, st: { role: 'accent', w: 2.2, head: 7, pen: 3.5 } });
    xW.push(bez(plugAt(0, 1, 'r'), plugAt(1, 0, 'l'), 60), bez(plugAt(2, 3, 'b'), plugAt(0, 3, 'b'), 0), bez(plugAt(1, 1, 'r'), plugAt(2, 0, 'l'), 60));
    const a3 = plugAt(2, 3, 'b'), b3 = plugAt(0, 3, 'b');
    xW[1] = { spec: { kind: 'bezier', pts: [a3, [a3[0], 332], [b3[0], 332], b3] }, st: { role: 'soft', w: 2.2, head: 7, pen: 3.5 } };
    REVT = REV.setup(p, { seed: F.seed }, { paths: inW, stagger: 0.3, dur: 2.4, hold: 0.05, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: false });
    REVX = REV.setup(p, { seed: F.seed }, { paths: xW, stagger: 0.3, dur: 2.2, hold: 0.05, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: true });
    TOK.color.soft = C.soft;
    /* annotations over the theory picture: two callouts, then a bracket under the three systems (times are scene-local) */
    const obstacles = [];
    TC.forEach(([cx0, cy0]) => TD.forEach(([dx, dy]) => obstacles.push({ x: cx0 + dx - 20, y: cy0 + dy - 30, w: 40, h: 60 })));
    const pl = plugAt(0, 0, 'r'), wm = [335, 206];
    ANNS = ANN.setup(p, { seed: F.seed }, { annos: [
      { kind: 'callout', target: { x: pl[0] - 5, y: pl[1] - 5, w: 10, h: 10 }, at: [140, 150], side: 'top', shape: 'elbow', end: 'dot', text: 'a plug', role: 'must-read', size: 15, t0: 3.0, t1: 6.6 },
      { kind: 'callout', target: { x: wm[0] - 6, y: wm[1] - 6, w: 12, h: 12 }, at: [430, 150], side: 'top', shape: 'curve', end: 'arrow', text: 'a wire fits a matching plug', role: 'must-read', size: 15, t0: 4.8, t1: 6.6 },
      { kind: 'bracket', from: [100, 346], to: [860, 346], style: 'square', side: -1, depth: 10, text: P.thSystems + ' systems · ' + P.thWires + ' wires between them', role: 'must-read', size: 15, t0: 7.6, t1: 12.4 },
    ], underlay: () => {}, obstacles, dur: 12.4, inDur: 0.7, outDur: 0.45, ease: 'cubic', easeMode: 'inOut', lineW: 1.6, gap: 5, dim: 0, pen: true });
    /* E5 depth lines: x by depth D1..D10, y by strict accuracy (E5.1-GRADES.json); only the two Sonnet lines, drawn last */
    const X = (d) => 150 + (d - 1) * 78, Y = (a) => 372 - a * 140;
    const line = (arr, st) => ({ spec: { kind: 'line', pts: arr.map((a, i) => [X(i + 1), Y(a)]) }, st });
    const one = Array(P.e5depths).fill(P.sonnet / 100);
    REVD = REV.setup(p, { seed: F.seed }, { paths: [line(one, { role: 'ink', w: 4 }), line(one, { role: 'accent', w: 2.2, dash: [12, 8], pen: 4 })],
      stagger: 0.3, dur: 2.6, hold: 0.05, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: true });
    REVD.X = X; REVD.Y = Y;
    REVD.cols = [[1, 1], [1, 1], [1, 1], [1, 0.917], [1, 1], [1, 1], [0.708, 0.708], [1, 0.95], [1, 0.938], [1, 0.833]];   // claims d1A..d10B
    /* E2: one mark per family member at one pitch, so the three families compare at true scale */
    const pc = 12.4, gridAt = (n, cols, x, y) => S.grid(n, cols, { x, y, w: cols * pc, h: Math.ceil(n / cols) * pc }, { gap: 0.22 });
    E2 = [
      { n: P.s3n, star: Math.ceil(P.s3F / (P.s3e - P.s3m)), L: gridAt(P.s3n, 33, 48, 178), name: '@CommandType HANDLERS', x: 48 },
      { n: P.s1n, star: Math.ceil(P.s1F / (P.s1e - P.s1m)), L: gridAt(P.s1n, 15, 500, 178), name: 'API RESOURCES', x: 500 },
      { n: P.s2n, star: Math.ceil(P.s2F / (P.s2e - P.s2m)), L: gridAt(P.s2n, 14, 726, 178), name: 'REPO WRAPPERS', x: 726 },
    ];
    /* E3: 16 questions × 4 runs per arm, one mark per answer; per-question correct counts from E3-GRADES.json */
    const perQA = [4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], perQB = [4, 4, 4, 4, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
    const g16 = (y) => S.grid(P.e3pool * P.e3runs, P.e3pool, { x: 48, y, w: P.e3pool * 22, h: P.e3runs * 22 }, { gap: 0.2 });
    E3 = { A: g16(166), B: g16(292), okA: perQA, okB: perQB };
    /* the ladder: one tick per 25 lines, at true scale across the three rungs */
    RUNGS = [
      { name: 'TOY BANK', files: P.toybank, lines: P.tbLines, y: 148 },
      { name: 'CHARTER 1K · REAL BANK CODE', files: P.c1kFiles, lines: P.c1kLoc, y: 202 },
      { name: 'CHARTER 10K · REAL BANK CODE', files: P.c10kFiles, lines: P.c10kLoc, y: 256 },
    ].map((r) => Object.assign(r, { ticks: Math.round(r.lines / P.tick) }));
  },

  render(t, s, K) {
    const { tx, ln, rc, path, stamp, C, rgba, lerp, clamp } = K;
    const ctx = K.ctx;
    const T = (key, x, y, str, o, role) => tx(key, 'labels', x, y, str, Object.assign({}, o, { role: role || ((o && o.size) >= 28 ? 'must-read' : 'secondary') }));
    const eyebrow = (key, str, op) => tx(key, 'chrome', 48, 50, str, { size: 13, ls: '0.2em', fill: C.muted, op, role: 'chrome' });
    const title = (key, str, op, o) => T(key, 48, 92, str, Object.assign({ fam: 'disp', size: 36, op }, o), 'must-read');
    const sq = (x, y, sz, fill, a, rot) => {
      if (a <= 0.004) return;
      ctx.globalAlpha = a; ctx.fillStyle = fill;
      if (rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillRect(-sz / 2, -sz / 2, sz, sz); ctx.restore(); }
      else ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      ctx.globalAlpha = 1;
    };
    const hollow = (x, y, sz, col, a, w) => { if (a <= 0.004) return; ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w || 1.2; ctx.strokeRect(x - sz / 2 + 0.6, y - sz / 2 + 0.6, sz - 1.2, sz - 1.2); ctx.globalAlpha = 1; };
    const dot = (x, y, r, col, a) => { if (a <= 0.004) return; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1; };
    const reveal = (st, lt, op) => { if (op <= 0) return; const p = K.p; p.push(); ctx.globalAlpha = op; REV.draw(p, lt, st, null, TOK); p.pop(); ctx.globalAlpha = 1; };
    tx('brand.r', 'chrome', 912, 50, 'manutej / wiring-and-the-whole', { size: 13, anchor: 'end', ls: '0.06em', fill: C.muted, op: t < 112 ? 0.9 : 0, role: 'chrome' });

    /* ═════ HOOK 0–9 · the pile ═════ COMMIT 9–17 · the question ═════ CASE 29–36 · the sort ═════ */
    const fh = on('hook', t), fc = on('commit', t), fr = on('repo', t), fw = on('wit', t), ft = on('th', t);
    const pileU = v('pile', t), sortU = v('sort', t), chipsU = v('chips', t);
    const cam = t < 33.2 ? null : CAM.sample(CAMK, Math.min(t, 36.2), 'cubic');
    if (t < 9.4 || (t >= 28.6 && t < 39)) {
      const L = sortU > 0 ? S.transition(PILE, ROWS, sortU, { stagger: 0.55, by: 'x', arc: 46 }) : PILE;
      const base = fc ? 1 - 0.85 * fc.a : 1, thIn = t >= 28.6 ? clamp((t - 28.8) / 0.6, 0, 1) : 1;
      for (let i = 0; i < N; i++) {
        const m = L.items[i];
        const drop = clamp((pileU * 1.35) - (i / N) * 0.35, 0, 1);
        if (drop <= 0) continue;
        let x = m.x, y = m.y - (1 - drop) * 60, sz = m.w, a = drop * base * thIn;
        const isW = i >= W0 && i < W0 + P.fWitness, isT = i >= W0 && i < W0 + P.toybank;
        let col = C.ink;
        if (cam) {
          const q = CAM.worldToScreen(x, y, cam, W, H); x = q.x; y = q.y; sz *= cam.zoom;
          if (!isW) a *= 1 - clamp((t - 33.4) / 1.6, 0, 1);
          if (isW) col = isT ? C.accent : C.muted;
        } else if (sortU > 0.7 && isW) col = rgba('accent', 1);
        if (isT && chipsU > 0) continue;                                  // handed over to the dots below
        if (isW && !isT && t > 36.2) a *= 1 - clamp((t - 36.2) / 0.8, 0, 1);
        sq(x, y, sz, col, a, TILT[i] * (1 - sortU));
      }
    }
    if (fh) {
      const a1 = fh.a * clamp((t - 0.6) / 0.6, 0, 1) * (1 - clamp((t - 4.4) / 0.4, 0, 1)), a2 = fh.a * clamp((t - 4.8) / 0.6, 0, 1);
      eyebrow('hk.e', 'THE BET', fh.a);
      title('hk.t1', 'A codebase is not a pile of files.', a1);
      title('hk.t2', 'It is a few systems that touch at their plugs.', a2, { fill: C.accent });
      T('hk.n', 912, 92, P.files + ' FILES · THIS REPO', { size: 16, anchor: 'end', ls: '0.08em', op: fh.a * clamp((t - 2.6) / 0.5, 0, 1), fill: C.muted });
    }
    if (fc) {
      eyebrow('cm.e', 'YOUR NUMBER', fc.a);
      ['A ' + P.toybank + '-file toy bank,', 'wired at its plugs.', P.checks + ' wiring checks.'].forEach((q, i) =>
        T('cm.q' + i, 48, 168 + i * 50, q, { fam: 'disp', size: 40, op: fc.a * clamp((t - 9.3 - i * 0.5) / 0.5, 0, 1), fill: i === 2 ? C.accent : C.ink }, 'must-read'));
      for (let k = 0; k < P.checks; k++) hollow(60 + k * 34, 352, 24, C.ink, fc.a * 0.8 * clamp((t - 10.6 - k * 0.05) / 0.4, 0, 1), 1.4);
      T('cm.l', 48, 394, 'THE ' + P.checks + ' CHECKS, NOT YET RUN', { size: 14, ls: '0.1em', op: fc.a * 0.9, fill: C.muted });
      K.commitBox(t, s, { title: F.commit.title, prompt: 'OF ' + P.checks + ' CHECKS', out: 16.6, x: 636, w: 276 });
    }

    /* ═════ CASE 17–29 · how it works, in theory: files → plugs → wires → three systems ═════ */
    if (ft) {
      const lt = t - 17, p = K.p;
      eyebrow('th.e', 'HOW IT WORKS, IN THEORY', ft.a);
      const t1 = ft.a * clamp(lt / 0.6, 0, 1) * (1 - clamp((lt - 8.4) / 0.4, 0, 1)), t2 = ft.a * clamp((lt - 8.8) / 0.6, 0, 1) * (1 - clamp((lt - 10.4) / 0.3, 0, 1)), t3 = ft.a * clamp((lt - 10.6) / 0.6, 0, 1);
      title('th.t1', P.thFiles + ' files. A plug or two each. Wires that only fit.', t1);
      title('th.t2', 'The wiring is small. The whole is big.', t2);
      title('th.t3', 'Ship the wiring, not the whole.', t3, { fill: C.accent });
      const fade = clamp((lt - 6.8) / 1.4, 0, 1), docA = ft.a * (1 - 0.86 * fade);
      p.push();
      TC.forEach(([cx, cy], c) => TD.forEach(([dx, dy], d) => {
        const k = c * 4 + d, u = clamp((lt - k * 0.14) / 1.0, 0, 1);
        GL.draw(p, TOK, 'document', cx + dx, cy + dy, 80, u, 0, { lineW: 2, role: 'ink', alpha: docA, glyphStagger: 0.3 });
      }));
      p.pop();
      PLUGS.forEach((q, i) => {
        const [x, y] = plugAt(q.c, q.d, q.side), u = clamp((lt - 2.3 - i * 0.07) / 0.35, 0, 1), a = ft.a * u * (1 - 0.86 * fade);
        if (q.kind) sq(x, y, 8 * u, C.soft, a); else { dot(x, y, 5 * u, C.accent, a); dot(x, y, 2 * u, C.paper, a); }
      });
      reveal(REVT, lt - 3.4, ft.a * (1 - fade));
      reveal(REVX, lt - 5.0, ft.a);
      const ba = ft.a * clamp((lt - 6.8) / 0.8, 0, 1);
      ['A', 'B', 'C'].forEach((nm, c) => {
        const [cx, cy] = TC[c];
        rc('th.b' + c, 'field', cx - 90, cy - 92, 180, 184, { stroke: C.ink, w: 1.4, op: ba, rx: 4, fill: C.panel, fo: 0.35 });
        T('th.bl' + c, cx - 78, cy - 74, 'SYSTEM ' + nm, { size: 14, ls: '0.1em', op: ba, fill: C.ink });
      });
      p.push(); ctx.globalAlpha = ft.a; ANN.draw(p, lt, ANNS, null, TOKA); p.pop(); ctx.globalAlpha = 1;
    }

    /* ═════ CASE 29–36 · the repo sorted, the zoom ═════ */
    if (fr) {
      eyebrow('rp.e', 'THE REPO, SORTED', fr.a);
      title('rp.t', 'Read as a pile, a model pays for every file.', fr.a * clamp((t - 29.4) / 0.6, 0, 1) * (1 - clamp((t - 32.6) / 0.4, 0, 1)));
      title('rp.t2', 'Read as parts, it needs the wiring.', fr.a * clamp((t - 33.0) / 0.6, 0, 1));
      const la = fr.a * clamp((sortU - 0.85) / 0.15, 0, 1) * (1 - clamp((t - 33.4) / 1.2, 0, 1));
      ROWS.groups.forEach((g, k) => {
        const y = g.y + g.h / 2 + 5, wit = k === GW;
        T('rp.n' + k, 48, y, GROUPS[k][0] + '/', { size: 14, op: la, fill: wit ? C.accent : C.ink });
        T('rp.c' + k, 184, y, String(GROUPS[k][1]), { size: 14, anchor: 'end', op: la, fill: wit ? C.accent : C.muted });
      });
      if (cam) {
        const wa = fr.a * clamp((t - 35.0) / 0.5, 0, 1) * (1 - clamp((t - 36.2) / 0.5, 0, 1));
        const q = CAM.worldToScreen(ROWS.groups[GW].x, ROWS.groups[GW].y, cam, W, H);
        T('rp.w', q.x, q.y - 22, 'witness/ · ' + P.fWitness + ' FILES · ' + P.toybank + ' OF THEM THE TOY BANK', { size: 16, ls: '0.06em', op: wa, fill: C.accent });
      }
    }

    /* ═════ CASE 36–48 · five systems, wired plug to plug; then the 13 checks ═════ */
    if (fw) {
      eyebrow('wt.e', 'E1 · THE TOY BANK', fw.a * clamp((t - 36.0) / 0.3, 0, 1));
      title('wt.t', 'Sixteen files, five systems, wired plug to plug.', fw.a * clamp((t - 36.4) / 0.6, 0, 1));
      const ba = fw.a * v('boxes', t);
      MODS.forEach((m, j) => {
        const h = 40 + m.n * CP - 2;
        rc('wt.b' + j, 'field', BX(j), BY, BW, h, { stroke: j === 4 || j === 0 ? C.muted : C.ink, w: 1.1, op: 0.55 * ba, rx: 3, fill: C.panel, fo: 0.35 });
        T('wt.h' + j, BX(j) + 10, BY + 24, m.id + '/ · ' + m.n, { size: 14, ls: '0.04em', op: ba, fill: j === 4 ? C.accent : C.ink });
      });
      /* the 16 marks fly as dots (structures.transition, stagger by index) and unfold into chips only once landed */
      if (chipsU > 0) {
        const ST = 0.6, TR = S.transition(LAND, CHIPS, chipsU, { stagger: ST, by: 'index', arc: 40 });
        let fileI = 0;
        MODS.forEach((m, j) => { for (let k = 0; k < m.n; k++, fileI++) {
          const it = TR.items[fileI], d = ST * (fileI / 15), e = clamp((chipsU - d) / (1 - ST), 0, 1);
          const c = chipXY(j, k), money = m.files[k] === 'Money', hot = money && t >= 41, col = hot ? C.accent : (j === 4 ? C.accent : C.ink);
          const land = clamp((e - 0.96) / 0.04, 0, 1);
          if (land < 1) dot(it.x, it.y, 4.5, col, fw.a * (1 - land));
          if (land > 0) {
            ctx.globalAlpha = fw.a * land; ctx.fillStyle = rgba(hot ? 'accent' : 'ink', 0.12); ctx.fillRect(c.x - (BW - 20) / 2, c.y - CH / 2, BW - 20, CH);
            ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.strokeRect(c.x - (BW - 20) / 2 + 0.6, c.y - CH / 2 + 0.6, BW - 21.2, CH - 1.2);
            ctx.fillStyle = col; ctx.fillRect(c.x + (BW - 20) / 2 - 13, c.y - 3, 6, 6);         // the plug
            ctx.globalAlpha = 1;
          }
          T('wt.c' + fileI, c.x - BW / 2 + 18, c.y + 5, m.files[k], { size: 14, op: fw.a * land, fill: hot ? C.accent : C.ink });
        } });
      }
      reveal(REVW, t - 38.7, fw.a * (t > 38.7 ? 1 : 0));
      const sy = fw.a * clamp((t - 40.6) / 0.5, 0, 1);
      T('wt.sy', BX(1) + BW + 8, BY + 98, '≅', { fam: 'disp', size: 30, anchor: 'middle', op: sy, fill: C.soft }, 'must-read');
      const nOn = v('checks', t), ck = fw.a * clamp((t - 40.6) / 0.4, 0, 1);
      if (ck > 0) {
        for (let k = 0; k < P.checks; k++) {
          const x = 60 + k * 34, y = 366, lit = clamp(nOn - k, 0, 1);
          hollow(x, y, 24, C.ink, ck * 0.7, 1.2);
          if (lit > 0) sq(x, y, 20 * (0.6 + 0.4 * lit), k === 9 ? C.accent : C.ink, ck * lit);
        }
        const cur = Math.min(P.checks - 1, Math.floor(nOn)), nm = nOn >= P.checks ? CHECKS[9] : CHECKS[cur];
        T('wt.cn', 48, 404, (nOn >= P.checks ? 'including · ' : 'check · ') + nm, { size: 14, ls: '0.06em', op: ck, fill: nOn >= P.checks ? C.accent : C.muted });
        const done = clamp((t - 44.4) / 0.5, 0, 1);
        T('wt.n', 514, 382, P.checksPass + ' OF ' + P.checks, { fam: 'disp', size: 48, op: ck * done }, 'must-read');
        T('wt.p', 740, 360, 'PASS', { size: 16, ls: '0.1em', op: ck * done, fill: C.muted });
        const g = K.answered(s) ? clamp(Math.round(s.answer), 0, P.checks) : null, ya = ck * clamp((t - 45.2) / 0.5, 0, 1);
        if (g != null && g > 0) {
          const x = 60 + (g - 1) * 34;
          path('wt.yp', 'marks', `M${x} 332 l-6 -9 h12 z`, { fill: C.soft, stroke: C.soft, w: 1, op: ya });
          T('wt.y', 740, 382, 'YOU · ' + g, { size: 16, ls: '0.1em', op: ya, fill: C.soft });
        } else if (ya > 0) T('wt.y', 740, 382, 'YOU · NO ANSWER', { size: 16, ls: '0.1em', op: ya, fill: C.soft });
        if (t >= 43.2) stamp('wt.k', 'marks', BX(4) + BW / 2 + 14, BY + 112, 0.9, 'CLASH CAUGHT', { op: fw.a * clamp((t - 43.2) / 0.25, 0, 1), rim: C.accent, rot: -6, fs: 22 });
      }
    }

    /* ═════ CASE 48–55 · the ladder: toy → real bank code, at true scale; the packed wiring at about half ═════ */
    const fl = on('lad', t);
    if (fl) {
      eyebrow('ld.e', 'THE LADDER · PR ' + P.pr46 + ' SCALE REPORT', fl.a);
      title('ld.t', 'Toy bank, then real bank code, in three rungs.', fl.a * clamp((t - 48.2) / 0.6, 0, 1));
      const ru = v('rungs', t), px = 2.0;
      RUNGS.forEach((r, j) => {
        const u = clamp(ru - j, 0, 1), a = fl.a * clamp(u * 4, 0, 1);
        T('ld.n' + j, 48, r.y - 10, r.name + ' · ' + r.files + ' FILES · ' + r.lines.toLocaleString('en-US') + ' LINES', { size: 14, ls: '0.06em', op: a, fill: j === 2 ? C.accent : C.ink });
        const n = Math.round(r.ticks * u);
        ctx.globalAlpha = fl.a * 0.9; ctx.fillStyle = j === 2 ? C.accent : C.ink;
        for (let i = 0; i < n; i++) ctx.fillRect(48 + i * px, r.y, 1, 16);
        ctx.globalAlpha = 1;
      });
      const na = fl.a * clamp((ru - 2.6) / 0.4, 0, 1);
      ln('ld.nx', 'marks', 48, 326, 870, 326, { stroke: C.muted, w: 1, dash: '4 5', op: na });
      T('ld.nxl', 48, 318, 'NEXT · AN OUTSIDE REPO · THE 10K RUNG IS NOT A FULL FINERACT CLONE YET', { size: 14, ls: '0.06em', op: na, fill: C.muted });
      T('ld.sl', 48, 296, P.slices + ' SLICES · ' + P.bodies + ' JAVA BODIES · ' + P.matrixLoc.toLocaleString('en-US') + ' LINES · A SLICE IN ~' + Math.round(P.rustMsRaw) + ' MS (RUST)', { size: 14, ls: '0.04em', op: na, fill: C.muted });
      const tb = v('tokbars', t), sc = 0.33;
      if (tb > 0) {
        const y1 = 358, y2 = 378;
        ctx.globalAlpha = fl.a; ctx.fillStyle = C.ink; ctx.fillRect(48, y1, P.hExplicit * sc * Math.min(1, tb * 1.4), 12);
        ctx.fillStyle = C.accent; ctx.fillRect(48, y2, P.hFactored * sc * clamp((tb - 0.3) / 0.7, 0, 1), 12); ctx.globalAlpha = 1;
        T('ld.t1', 48 + P.hExplicit * sc + 10, y1 + 11, P.hExplicit.toLocaleString('en-US') + ' TOKENS · SPELLED OUT', { size: 14, op: fl.a * clamp((tb - 0.7) / 0.3, 0, 1), fill: C.ink });
        T('ld.t2', 48 + P.hFactored * sc + 10, y2 + 11, P.hFactored + ' TOKENS · PACKED · ABOUT HALF', { size: 16, op: fl.a * clamp((tb - 0.9) / 0.1, 0, 1), fill: C.accent });
        T('ld.t0', 48, y1 - 6, 'WIRING FOR ' + P.s3n + ' HANDLERS', { size: 14, ls: '0.06em', op: fl.a * clamp(tb * 3, 0, 1), fill: C.muted });
      }
      T('ld.br', 912, 410, 'ON THE BRANCHES · ' + P.openPRs + ' OPEN PRS · ' + P.pr46 + ' SCALE REPORT · ' + P.pr47 + ' SHEAF EXPORT, ' + P.sheafLines.toLocaleString('en-US') + ' LINES · ' + P.pr48 + ' MIT LICENCE',
        { size: 14, anchor: 'end', ls: '0.04em', op: fl.a * clamp((t - 53.6) / 0.5, 0, 1), fill: C.muted });
    }

    /* ═════ COUNT 55–68 · E2 tokens: one mark per family member ═════ */
    const f2 = on('e2', t);
    if (f2) {
      eyebrow('e2.e', 'E2 · TOKENS · ' + P.sites + ' REAL APACHE FINERACT SITES', f2.a);
      title('e2.t', 'Is packed wiring cheaper than spelled-out wiring?', f2.a);
      const inU = v('e2in', t), payU = v('e2pay', t), bcU = v('e2bc', t);
      E2.forEach((fam, j) => {
        const u = j === 0 ? payU : bcU, items = fam.L.items, n = fam.n;
        T('e2.h' + j, fam.x, 134, fam.name, { size: 14, ls: '0.08em', op: f2.a * inU, fill: C.muted });
        T('e2.n' + j, fam.x, 166, String(n), { fam: 'disp', size: 36, op: f2.a * inU }, 'must-read');
        for (let i = 0; i < n; i++) {
          const m = items[i], a = f2.a * clamp(inU * 1.4 - (i / n) * 0.4, 0, 1);
          if (a <= 0) continue;
          const paid = i < fam.star, sweep = clamp(u * (n + 8) - i, 0, 1);
          if (paid && u > 0) { sq(m.x, m.y, m.w, C.muted, a * 0.9); hollow(m.x, m.y, m.w + 3, C.ink, a * clamp(u * 6, 0, 1), 1.4); }
          else if (sweep > 0) sq(m.x, m.y, m.w, C.accent, a * (0.35 + 0.65 * sweep));
          else hollow(m.x, m.y, m.w, C.ink, a * 0.55, 1);
        }
        const fa = f2.a * clamp(u * 3, 0, 1), yb = fam.L.box.y + fam.L.box.h + 22;
        T('e2.s' + j, fam.x, yb, 'PAYS OFF AT ' + fam.star, { size: 16, ls: '0.06em', op: fa, fill: C.accent });
        if (u >= 1) stamp('e2.w' + j, 'marks', fam.x + fam.L.box.w / 2, fam.L.box.y + fam.L.box.h / 2, 1, 'WIN', { op: f2.a * clamp((t - (j ? 67.8 : 63.8)) / 0.25, 0, 1), rim: C.accent, rot: -8, fs: 22 });
      });
      T('e2.k', 130, 166, 'LEGEND ' + P.s3F + ' ONCE · ' + P.s3e + ' → ' + P.s3m + ' TOK EACH', { size: 14, ls: '0.04em', op: f2.a * clamp((t - 60.4) / 0.5, 0, 1), fill: C.ink });
    }

    /* ═════ COUNT 68–81 · E3: can a model read it? one mark per answer ═════ */
    const f3 = on('e3', t);
    if (f3) {
      eyebrow('e3.e', 'E3 · READING TEST · ' + P.e3pool + ' QUESTIONS × ' + P.e3runs + ' RUNS PER ARM', f3.a);
      title('e3.t', 'Can a model read the packed wiring?', f3.a);
      const arms = [['A', 'SPELLED-OUT WIRES', E3.A, E3.okA, v('e3a', t), P.e3A, P.tokA], ['B', 'PACKED WIRES', E3.B, E3.okB, v('e3b', t), P.e3B, P.tokB]];
      const tokU = v('e3tok', t), pctU = f3.a * v('e3pct', t), scale = 300 / P.tokA;
      arms.forEach(([id, name, L, ok, u, nOk, tok], j) => {
        const y0 = L.box.y, nAns = P.e3pool * P.e3runs, pct = nOk / nAns * 100;
        T('e3.h' + j, 48, y0 - 12, id + ' · ' + name, { size: 14, ls: '0.08em', op: f3.a, fill: j ? C.accent : C.ink });
        for (let i = 0; i < nAns; i++) {
          const m = L.items[i], q = i % P.e3pool, r = Math.floor(i / P.e3pool), right = r < ok[q];
          const a = f3.a * clamp(u * (P.e3pool + 3) - q - r * 0.6, 0, 1);
          hollow(m.x, m.y, m.w, C.ink, f3.a * 0.35, 1);
          if (a <= 0) continue;
          if (right) sq(m.x, m.y, m.w, j ? C.accent : C.ink, a); else hollow(m.x, m.y, m.w, j ? C.accent : C.ink, a, 1.6);
        }
        const ca = f3.a * clamp((u - 0.9) / 0.1, 0, 1);
        T('e3.n' + j, 420, y0 + 46, nOk + ' OF ' + nAns, { fam: 'disp', size: 38, op: ca, fill: j ? C.accent : C.ink }, 'must-read');
        T('e3.p' + j, 420, y0 + 76, pct.toFixed(1) + '%', { size: 20, op: pctU, fill: C.muted });
        const bw = tok * scale * tokU, by = y0 + 30;
        if (tokU > 0) {
          ctx.globalAlpha = f3.a; ctx.fillStyle = j ? C.accent : C.ink; ctx.fillRect(600, by, bw, 18); ctx.globalAlpha = 1;
          T('e3.k' + j, 600, by - 10, tok.toLocaleString('en-US') + ' TOKENS', { size: 16, ls: '0.04em', op: f3.a * clamp(tokU * 2 - 1, 0, 1), fill: j ? C.accent : C.ink });
          if (j) T('e3.r', 600 + P.tokB * scale + 12, by + 15, Math.round(P.tokB / P.tokA * 100) + '% OF A', { size: 20, op: pctU, fill: C.accent });
        }
      });
      const qa = f3.a * clamp((t - 76.5) / 0.6, 0, 1), qx = E3.A.items[4].x;
      ln('e3.q', 'marks', qx, 154, qx, 386, { stroke: C.muted, w: 1, dash: '3 4', op: qa });
      T('e3.qn', 48, 404, 'Q5 · THE SAME UNCLEAR QUESTION, MISSED IN BOTH ARMS', { size: 14, ls: '0.04em', op: qa, fill: C.muted });
    }

    /* ═════ COUNT 81–95 · E5: ten depth columns of marks, then the flat line ═════ */
    const f5 = on('e5', t);
    if (f5) {
      eyebrow('e5.e', 'E5 · DEPTH · ' + P.e5q + ' QUESTIONS · ' + P.e5depths + ' DEPTH LEVELS', f5.a);
      title('e5.t', 'Does it hold when questions go deep?', f5.a);
      const X = REVD.X, Y = REVD.Y, ax = f5.a * clamp((t - 81.2) / 0.5, 0, 1), cu = v('cols', t);
      ln('e5.ax', 'marks', X(1) - 24, Y(0) + 8, X(10) + 24, Y(0) + 8, { stroke: C.muted, w: 1, op: ax });
      ln('e5.g', 'marks', X(1) - 24, Y(1), X(10) + 24, Y(1), { stroke: C.line, w: 1, op: ax, dash: '2 5' });
      T('e5.y', X(1) - 32, Y(1) + 5, P.sonnet + '%', { size: 14, anchor: 'end', op: ax, fill: C.muted });
      sq(60, 130, 8, C.ink, ax); T('e5.la', 72, 134, 'A · SPELLED OUT', { size: 14, ls: '0.06em', op: ax, fill: C.ink });
      sq(236, 130, 8, C.accent, ax); T('e5.lb', 248, 134, 'B · PACKED', { size: 14, ls: '0.06em', op: ax, fill: C.accent });
      T('e5.lc', 420, 134, 'ONE MARK PER 5 % · POOLED OVER BOTH MODELS', { size: 14, ls: '0.06em', op: ax, fill: C.muted });
      const NM = 20, pitch = 7;
      for (let d = 1; d <= P.e5depths; d++) {
        const u = clamp(cu - (d - 1), 0, 1);
        T('e5.d' + d, X(d), Y(0) + 28, 'D' + d, { size: 14, anchor: 'middle', op: ax, fill: C.muted });
        [0, 1].forEach((arm) => {
          const acc = REVD.cols[d - 1][arm], fill = Math.round(acc * NM), x = X(d) + (arm ? 8 : -8);
          for (let k = 0; k < NM; k++) {
            const y = Y(0) - k * pitch - 3, a = f5.a * clamp(u * (NM + 4) - k, 0, 1);
            if (k < fill) sq(x, y, 5, arm ? C.accent : C.ink, a); else hollow(x, y, 5, arm ? C.accent : C.ink, a * 0.5, 1);
          }
        });
      }
      reveal(REVD, t - 85.6, f5.a);
      const sa = f5.a * clamp((t - 86.2) / 0.6, 0, 1);
      T('e5.s', X(1), Y(1) - 16, 'SONNET · BOTH FORMS · ' + P.sonnet + '% AT EVERY DEPTH', { size: 16, ls: '0.04em', op: sa, fill: C.accent });
      const ba = f5.a * v('e5ba', t);
      T('e5.b', 912, 92, 'B − A = ' + P.pooledBA.toFixed(1).replace('-', '−') + ' PTS', { fam: 'disp', size: 36, anchor: 'end', op: ba, fill: C.accent }, 'must-read');
      T('e5.r', 912, 120, 'RULE: WITHIN ' + P.rule + ' PTS · RAW ' + P.rawBA.toFixed(1).replace('-', '−') + ', ~' + P.artifactPct + '% HARNESS BUG', { size: 14, anchor: 'end', ls: '0.04em', op: ba, fill: C.muted });
    }

    /* ═════ COUNT 95–104 · the review that said no ═════ */
    const fn = on('nos', t);
    if (fn) {
      eyebrow('ns.e', 'AN OUTSIDE REVIEWER · DID NOT WRITE THE CODE', fn.a);
      title('ns.t', 'And the review that said no.', fn.a);
      const ma = fn.a * v('nos', t);
      rc('ns.bg', 'field', 48, 128, 864, 250, { fill: C.panel, op: ma * 0.9, stroke: C.line, w: 1, rx: 4 });
      T('ns.l1', 76, 170, 'SCALE BUILD · S2 + S3 BUNDLE', { size: 14, ls: '0.12em', op: ma, fill: C.muted });
      T('ns.l2', 76, 214, 'WIRING_ENGINE=python make slice-matrix-check', { size: 18, op: ma, fill: C.ink });
      T('ns.l3', 76, 248, '→ exit ' + P.exitCode + ' · the python engine crashes on one shard', { size: 18, op: ma * clamp((t - 96) / 0.4, 0, 1), fill: C.accent });
      const fa = fn.a * v('fix', t);
      ln('ns.r', 'marks', 76, 290, 884, 290, { stroke: C.line, w: 1, op: fa });
      T('ns.l4', 76, 330, 'B1 FIXED · RE-RUN · ' + P.shards + ' OF ' + P.shards + ' SHARDS PASS · THEN SHIP', { size: 18, op: fa, fill: C.ink });
      if (t >= 96.4) stamp('ns.st', 'marks', 730, 188, 1.25, 'NO-SHIP', { op: fn.a * clamp((t - 96.4) / 0.22, 0, 1), rim: C.accent, rot: -7, fs: 30 });
    }

    /* ═════ MONDAY 104–112 ═════ */
    const fm = on('mon', t);
    if (fm) {
      eyebrow('mo.e', 'MONDAY', fm.a);
      const ga = fm.a * 0.07 * v('q', t);
      for (let i = 0; i < N; i++) { const m = ROWS.items[i], wit = i >= W0 && i < W0 + P.fWitness; sq(m.x, m.y, m.w, wit ? C.accent : C.ink, ga * (wit ? 2.5 : 1)); }
      const qa = fm.a * v('q', t);
      T('mo.q1', 480, 214, 'What are the parts,', { fam: 'disp', size: 54, anchor: 'middle', op: qa, fill: C.accent }, 'must-read');
      T('mo.q2', 480, 272, 'and where do they plug in?', { fam: 'disp', size: 54, anchor: 'middle', op: qa, fill: C.accent }, 'must-read');
      T('mo.s', 480, 316, 'ASK IT BEFORE YOU PASTE A WHOLE REPO INTO A MODEL', { size: 16, anchor: 'middle', ls: '0.08em', op: qa, fill: C.ink });
      const la = fm.a * v('lim', t);
      T('mo.l', 480, 364, "THE REPO'S OWN NUMBERS · ONE AUTHOR · NOT REPLICATED", { size: 16, anchor: 'middle', ls: '0.06em', op: la, fill: C.muted });
    }
  },

  tryit(vals, s, K) {
    const Fv = +vals.F, e = +vals.e, m = +vals.m, n = +vals.n;
    if (!(e > m)) return '<b>No break-even.</b> Each member must cost fewer tokens packed (m) than spelled out (e).';
    const star = Math.ceil(Fv / (e - m)), net = n * (e - m) - Fv;
    return `<b>n* = ${star}</b> members to pay back the legend. ` + (n >= star
      ? `A family of ${n.toLocaleString('en-US')} saves ${net.toLocaleString('en-US')} tokens (${n} × ${e - m} − ${Fv}).`
      : `A family of ${n} never pays it back: ${n} × ${e - m} &lt; ${Fv}.`);
  },
};
})();
