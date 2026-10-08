/* ═════ wiring-and-the-whole · film.src.js (the film; lib/assemble.py prepends the arsenal) ═════
   One clock: render(t, s, K) is a pure function of t and s.answer. Motion is timed with
   ARSENAL.core.timeline (one compiled timeline + scene windows); layouts come from ARSENAL.structures
   (scatter → rows → module chips, grids for every count); wires and the depth lines are drawn on with
   ARSENAL.patterns.reveal (arc-length); the zoom into witness/ is ARSENAL.patterns.camera's keyed sampler.
   Seeds: the pile is structures.scatter(seed = FILM.seed); the pile's tilt is mulberry32(FILM.seed). */
(function () {
'use strict';
const F = window.FILM, P = F.params, A = window.ARSENAL;
const TLM = A.core.timeline, S = A.structures, REV = A.patterns.reveal, CAM = A.patterns.camera.api;
const W = 960, H = 540;

/* ── the repo's 469 files, grouped by top folder (facts.json; claims fExperiments … fOther) ── */
const GROUPS = [['experiments', P.fExperiments], ['fixtures', P.fFixtures], ['docs', P.fDocs], ['scripts', P.fScripts],
  ['preview', P.fPreview], ['witness', P.fWitness], ['crates', P.fCrates], ['other', P.files - P.fExperiments - P.fFixtures - P.fDocs - P.fScripts - P.fPreview - P.fWitness - P.fCrates]];
const N = P.files, GW = 5;                                  // GW = index of witness/
const G0 = []; { let k = 0; GROUPS.forEach(([, n]) => { G0.push(k); k += n; }); }
const W0 = G0[GW];                                          // first witness/ mark; its first 16 are the toy bank
/* the toy bank (witness/toybank, git order) placed in its five modules; chip order top-down follows the refs */
const MODS = [
  { id: 'shared', n: P.mShared, files: ['PageDto', 'AuditDto', 'EventTopics', 'AppConfig'] },
  { id: 'accounts', n: P.mAccounts, files: ['Controller', 'Service', 'Repository', 'Money'] },
  { id: 'savings', n: P.mSavings, files: ['Controller', 'Service', 'Repository'] },
  { id: 'loans', n: P.mLoans, files: ['Controller', 'Service', 'Repository', 'Money'] },
  { id: 'report', n: P.mReport, files: ['ReportModule'] },
];
const BX = (m) => 48 + m * 176, BY = 132, BW = 160, CH = 26, CP = 34;      // module boxes and chips
const chipXY = (m, k) => ({ x: BX(m) + BW / 2, y: BY + 40 + k * CP + CH / 2 });
const CHECKS = ['pushout commutes', 'universal property (bounded)', 'fresh names stay inside C', 'no false κ', 'system-map square',
  'ports preserved', 'automorphism · composite iso', 'invariant constant on orbit', 'system maps preserve invariant',
  'κ fires on the Money collision', 'associativity · canonical iso', 'monoidal unit · disjoint union', 'Ex 4.25 squares compose'];

/* ── one timeline for every channel (arsenal/core/timeline.js); beats = film.json chapters ── */
const tl = TLM.timeline().init({ pile: 0, sort: 0, chips: 0, boxes: 0, checks: 0, e2in: 0, e2pay: 0, e2bc: 0, e3a: 0, e3b: 0, e3tok: 0, e3pct: 0, e5ba: 0, nos: 0, fix: 0, q: 0, lim: 0 });
tl.beat('hook')
  .play('pile', 1, 2.6, 'out')                              // 0 → 2.6  the pile rains in
  .wait(6.4).beat('commit')                                 // 9
  .wait(8).beat('case')                                     // 17
  .wait(0.6).play('sort', 1, 3.6, 'inout')                  // 17.6 → 21.2  pile → rows by folder
  .wait(5.6).all((x) => x.play('chips', 1, 2.6, 'inout'),   // 26.8 → 29.4  witness marks fly into module chips
    (x) => x.wait(0.3).play('boxes', 1, 0.9))               // 27.1 → 28.0  while the module boxes open
  .wait(3.6).play('checks', P.checks, 3.4, 'linear')        // 33 → 36.4   one check every 0.26 s
  .wait(3.6).beat('count')                                  // 40
  .wait(0.4).play('e2in', 1, 3.2, 'out')                    // 40.4 → 43.6  three families appear
  .wait(1.6).play('e2pay', 1, 3.6, 'inout')                 // 45.2 → 48.8  the 514 family floods past n* = 5
  .wait(1.4).play('e2bc', 1, 2.6, 'inout')                  // 50.2 → 52.8  169 and 54
  .wait(1.7).play('e3a', 1, 3.2, 'inout')                   // 54.5 → 57.7  arm A answers
  .wait(1.3).play('e3b', 1, 2.4, 'inout')                   // 59 → 61.4    arm B answers
  .play('e3tok', 1, 1.6, 'out')                             // 61.4 → 63
  .play('e3pct', 1, 0.6)                                    // 63 → 63.6    ratios, only after the counts
  .wait(14.4).play('e5ba', 1, 0.6)                          // 78 → 78.6
  .wait(5.7).play('nos', 1, 0.3)                            // 84.3 → 84.6  the memo; stamp at 85.4
  .wait(3.6).play('fix', 1, 0.6)                            // 88.2 → 88.8
  .wait(3.6).beat('monday').play('q', 1, 1.2, 'out')        // 92.4 → 93.6
  .wait(2.4).play('lim', 1, 0.8);                           // 96 → 96.8
const TL = tl.compile();
const v = (k, t) => TL.at(k, t);
/* scene windows (local time + cross-fade alpha) */
const SC = {
  hook: TLM.scene(0, 9.2, null, { fadeIn: 0, fade: 0.5 }), commit: TLM.scene(9, 17.2, null, { fade: 0.5 }),
  repo: TLM.scene(17, 27.0, null, { fade: 0.5 }), wit: TLM.scene(26.6, 40.4, null, { fade: 0.5 }),
  e2: TLM.scene(40, 54.3, null, { fade: 0.5 }), e3: TLM.scene(54, 68.3, null, { fade: 0.5 }),
  e5: TLM.scene(68, 84.3, null, { fade: 0.5 }), nos: TLM.scene(84, 92.3, null, { fade: 0.5 }),
  mon: TLM.scene(92, 100.2, null, { fade: 0.5, fadeOut: 0 }),
};
const on = (k, t) => SC[k].at(t);

/* ── setup-time geometry (structures + reveal + camera), built once ── */
let PILE, ROWS, TILT, REVW, REVD, CAMK, E2, E3, TOK;
const tw = (s, size, fam) => String(s).length * size * (fam === 'disp' ? 0.42 : 0.6);   // rough text width

window.FILM_RENDER = {
  setup(p, K) {
    const C = K.C;
    PILE = S.scatter(N, { x: 48, y: 128, w: 864, h: 268 }, F.seed, { shrink: 0.6 });
    const idx = GROUPS.map((g, k) => Array.from({ length: g[1] }, (_, j) => G0[k] + j));
    ROWS = S.rows(idx, { x: 196, y: 122, w: 716, h: 270 }, { groupGap: 10 });
    const r = S.mulberry32(F.seed); TILT = Array.from({ length: N }, () => (r() - 0.5) * 1.4);
    TOK = { color: { bg: 'rgba(0,0,0,0)', ink: C.ink, accent: C.accent, accent2: C.soft, muted: C.muted, line: C.line, chalk: C.panel, panel: C.panel } };
    /* the witness band, and the camera keys that fly into it (patterns/camera: log-space zoom, cubic) */
    const wb = ROWS.groups[GW], cx = wb.x + (P.fWitness * ROWS.pitch) / 2, cy = wb.y + wb.h / 2;
    const key = (t, x, y, zoom) => ({ t, x, y, zoom, fx: 0, fy: 0, fw: 1, fh: 1, fa: 0, label: '' });
    CAMK = [key(22.2, W / 2, H / 2, 1), key(25.6, cx, cy, 2.5), key(26.8, cx, cy, 2.5)];
    /* wires between chips (patterns/reveal, custom paths): verticals inside a module, then report → both Money types */
    const port = (m, k, side) => { const c = chipXY(m, k); return [c.x + (side > 0 ? BW / 2 - 10 : -(BW / 2 - 10)), c.y]; };
    const vert = (m, k) => { const a = port(m, k, 1), b = port(m, k + 1, 1); return { spec: { kind: 'bezier', pts: [a, [a[0] + 16, a[1]], [b[0] + 16, b[1]], b] }, st: { role: 'ink', w: 1.6, head: 7, alpha: 0.9 } }; };
    const paths = [vert(1, 0), vert(1, 1), vert(2, 0), vert(2, 1), vert(3, 0), vert(3, 1)];
    const rp = chipXY(4, 0), low = BY + 40 + 4 * CP + 18;
    [1, 3].forEach((m, j) => {
      const mo = chipXY(m, 3), a = [rp.x, rp.y + CH / 2], b = [mo.x + 30 * (j ? 1 : -1), mo.y + CH / 2];
      paths.push({ spec: { kind: 'bezier', pts: [a, [a[0], low + 10 + j * 8], [b[0] + 60, low + 10 + j * 8], [b[0] + 30, low + 10 + j * 8], [b[0], low + 10 + j * 8], [b[0], b[1] + 14], b] },
        st: { role: 'accent', w: 2, head: 8, pen: 3.5, alpha: 0.95 } });
    });
    REVW = REV.setup(p, { seed: F.seed }, { paths, stagger: 0.32, dur: 3.2, hold: 0.05, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: true });
    /* E5 depth lines: x by depth D1..D10, y by strict accuracy (E5.1-GRADES.json) */
    const X = (d) => 150 + (d - 1) * 78, Y = (a) => 372 - a * 196;
    const line = (arr, st) => ({ spec: { kind: 'line', pts: arr.map((a, i) => [X(i + 1), Y(a)]) }, st });
    const one = Array(P.e5depths).fill(P.sonnet / 100);
    REVD = REV.setup(p, { seed: F.seed }, { paths: [
      line(one, { role: 'ink', w: 4 }),                                              // sonnet, arm A
      line(one, { role: 'accent', w: 2.2, dash: [12, 8], pen: 4 }),                  // sonnet, arm B
      line([1, 1, 1, 1, 1, 1, 0.417, 1, 1, 1], { role: 'muted', w: 1.4, alpha: 0.7 }),            // haiku A
      line([1, 1, 1, 0.833, 1, 1, 0.417, 0.9, 0.875, 0.667], { role: 'accent2', w: 1.4, alpha: 0.8 }),  // haiku B (v2)
    ], stagger: 0.25, dur: 4.2, hold: 0.05, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: true });
    REVD.X = X; REVD.Y = Y;
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
  },

  render(t, s, K) {
    const { tx, ln, rc, path, stamp, C, rgba, lerp, clamp } = K;
    const ctx = K.ctx;
    const T = (key, x, y, str, o, role) => tx(key, 'labels', x, y, str, Object.assign({}, o, { role: role || ((o && o.size) >= 28 ? 'must-read' : 'secondary') }));
    const eyebrow = (key, str, op) => tx(key, 'chrome', 48, 50, str, { size: 13, ls: '0.2em', fill: C.muted, op, role: 'chrome' });
    const title = (key, str, op, o) => T(key, 48, 92, str, Object.assign({ fam: 'disp', size: 36, op }, o), 'must-read');
    const sq = (x, y, sz, fill, a, rot) => {                  // one canvas mark, centred
      if (a <= 0.004) return;
      ctx.globalAlpha = a; ctx.fillStyle = fill;
      if (rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillRect(-sz / 2, -sz / 2, sz, sz); ctx.restore(); }
      else ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      ctx.globalAlpha = 1;
    };
    const hollow = (x, y, sz, col, a, w) => { if (a <= 0.004) return; ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w || 1.2; ctx.strokeRect(x - sz / 2 + 0.6, y - sz / 2 + 0.6, sz - 1.2, sz - 1.2); ctx.globalAlpha = 1; };
    const reveal = (st, lt, op) => { if (op <= 0) return; const p = K.p; p.push(); ctx.globalAlpha = op; REV.draw(p, lt, st, null, TOK); p.pop(); ctx.globalAlpha = 1; };
    tx('brand.r', 'chrome', 912, 50, 'manutej / wiring-and-the-whole', { size: 13, anchor: 'end', ls: '0.06em', fill: C.muted, op: t < 100 ? 0.9 : 0, role: 'chrome' });

    /* ═════ HOOK 0–9 · the pile ═════ and COMMIT 9–17 · the question ═════ and CASE 17–27 · the sort ═════ */
    const fh = on('hook', t), fc = on('commit', t), fr = on('repo', t), fw = on('wit', t);
    const pileU = v('pile', t), sortU = v('sort', t);
    const cam = t < 22.2 ? null : CAM.sample(CAMK, Math.min(t, 26.8), 'cubic');
    const chipsU = v('chips', t);
    if (t < 30) {
      const L = sortU > 0 ? S.transition(PILE, ROWS, sortU, { stagger: 0.55, by: 'x', arc: 46 }) : PILE;
      const dimA = fc ? 1 - 0.85 * fc.a * (t < 13 ? 1 : 1) : 1;            // the pile recedes under the question
      const base = t >= 9 && t < 17.2 ? 0.15 + 0.85 * (1 - (fc ? fc.a : 0)) : 1;
      for (let i = 0; i < N; i++) {
        const m = L.items[i];
        const drop = clamp((pileU * 1.35) - (i / N) * 0.35, 0, 1);       // rain in by index
        if (drop <= 0) continue;
        let x = m.x, y = m.y - (1 - drop) * 60, sz = m.w, a = drop * dimA * Math.min(1, base);
        const isW = i >= W0 && i < W0 + P.fWitness, isT = i >= W0 && i < W0 + P.toybank;
        let col = C.ink;
        if (cam) {
          const q = CAM.worldToScreen(x, y, cam, W, H); x = q.x; y = q.y; sz *= cam.zoom;
          if (!isW) a *= 1 - clamp((t - 22.4) / 1.6, 0, 1);
          if (isW) col = isT ? C.accent : C.muted;
        } else if (sortU > 0.7 && isW) col = rgba('accent', 1);
        if (isT && chipsU > 0) continue;                                  // handed over to the chips below
        if (isW && !isT && t > 26.8) a *= 1 - clamp((t - 26.8) / 0.8, 0, 1);
        const rot = TILT[i] * (1 - sortU);
        sq(x, y, sz, col, a * (t >= 17 && t < 17.6 ? 1 : 1) * (t > 29 ? 0 : 1), rot);
      }
    }
    if (fh) {
      const a1 = fh.a * clamp((t - 0.6) / 0.6, 0, 1) * (1 - clamp((t - 4.4) / 0.4, 0, 1));
      const a2 = fh.a * clamp((t - 4.8) / 0.6, 0, 1);
      eyebrow('hk.e', 'THE BET', fh.a);
      title('hk.t1', 'A codebase is not a pile of files.', a1);
      title('hk.t2', 'It is a module of systems.', a2, { fill: C.accent });
      T('hk.n', 912, 92, P.files + ' FILES · THIS REPO', { size: 16, anchor: 'end', ls: '0.08em', op: fh.a * clamp((t - 2.6) / 0.5, 0, 1), fill: C.muted });
    }
    if (fc) {
      eyebrow('cm.e', 'YOUR NUMBER', fc.a);
      ['A ' + P.toybank + '-file toy bank,', 'glued at its interfaces.', P.checks + ' gluing checks.'].forEach((q, i) =>
        T('cm.q' + i, 48, 168 + i * 50, q, { fam: 'disp', size: 40, op: fc.a * clamp((t - 9.3 - i * 0.5) / 0.5, 0, 1), fill: i === 2 ? C.accent : C.ink }, 'must-read'));
      for (let k = 0; k < P.checks; k++) hollow(60 + k * 34, 352, 24, C.ink, fc.a * 0.8 * clamp((t - 10.6 - k * 0.05) / 0.4, 0, 1), 1.4);
      T('cm.l', 48, 394, 'THE ' + P.checks + ' CHECKS, NOT YET RUN', { size: 14, ls: '0.1em', op: fc.a * 0.9, fill: C.muted });
      K.commitBox(t, s, { title: F.commit.title, prompt: 'OF ' + P.checks + ' CHECKS', out: 16.6, x: 636, w: 276 });
    }
    if (fr) {
      eyebrow('rp.e', 'THE REPO, SORTED', fr.a);
      title('rp.t', 'Read as a pile, a model pays for every file.', fr.a * clamp((t - 17.4) / 0.6, 0, 1) * (1 - clamp((t - 21.4) / 0.4, 0, 1)));
      title('rp.t2', 'Read as parts, it needs the wiring.', fr.a * clamp((t - 21.8) / 0.6, 0, 1));
      const la = fr.a * clamp((sortU - 0.85) / 0.15, 0, 1) * (1 - clamp((t - 22.4) / 1.2, 0, 1));
      ROWS.groups.forEach((g, k) => {
        const y = g.y + g.h / 2 + 5, wit = k === GW;
        T('rp.n' + k, 48, y, GROUPS[k][0] + '/', { size: 14, op: la, fill: wit ? C.accent : C.ink });
        T('rp.c' + k, 184, y, String(GROUPS[k][1]), { size: 14, anchor: 'end', op: la, fill: wit ? C.accent : C.muted });
      });
      if (cam) {
        const wa = fr.a * clamp((t - 24.6) / 0.6, 0, 1) * (1 - clamp((t - 26.8) / 0.6, 0, 1));
        const q = CAM.worldToScreen(ROWS.groups[GW].x, ROWS.groups[GW].y, cam, W, H);
        T('rp.w', q.x, q.y - 22, 'witness/ · ' + P.fWitness + ' FILES · ' + P.toybank + ' OF THEM THE TOY BANK', { size: 16, ls: '0.06em', op: wa, fill: C.accent });
      }
    }

    /* ═════ CASE 27–40 · five systems, glued at ports; then the 13 checks ═════ */
    if (fw) {
      eyebrow('wt.e', 'E1 · THE WITNESS', fw.a * clamp((t - 27.0) / 0.3, 0, 1));
      title('wt.t', 'Sixteen files, five systems, glued at their ports.', fw.a * clamp((t - 27.1) / 0.6, 0, 1));
      const ba = fw.a * v('boxes', t);
      // module boxes (field) + headers
      MODS.forEach((m, j) => {
        const h = 40 + m.n * CP - 2;
        rc('wt.b' + j, 'field', BX(j), BY, BW, h, { stroke: j === 4 || j === 0 ? C.muted : C.ink, w: 1.1, op: 0.55 * ba, rx: 3, fill: C.panel, fo: 0.35 });
        T('wt.h' + j, BX(j) + 10, BY + 24, m.id + '/ · ' + m.n, { size: 14, ls: '0.04em', op: ba, fill: j === 4 ? C.accent : C.ink });
      });
      // chips: the 16 witness marks (screen position at the end of the zoom) become file chips
      const camEnd = CAM.sample(CAMK, 26.8, 'cubic');
      let fileI = 0;
      const src = [3, 0, 2, 1]; // within a module, git order (Controller, Repository, Service, Money) → chip order
      MODS.forEach((m, j) => {
        for (let k = 0; k < m.n; k++, fileI++) {
          const mi = ROWS.items[W0 + fileI], a0 = CAM.worldToScreen(mi.x, mi.y, camEnd, W, H), s0 = mi.w * camEnd.zoom;
          const c = chipXY(j, k), stg = clamp((chipsU - fileI * 0.03) / (1 - 15 * 0.03), 0, 1), e = stg * stg * (3 - 2 * stg);
          const ew = clamp((e - 0.62) / 0.38, 0, 1), es = ew * ew * (3 - 2 * ew);   // fly as a square, unfold into a chip on landing
          const x = lerp(a0.x, c.x, e), y = lerp(a0.y, c.y, e) - Math.sin(Math.PI * e) * 46, w = lerp(lerp(s0, 14, e), BW - 20, es), h = lerp(lerp(s0, 14, e), CH, es);
          if (chipsU <= 0) continue;
          const money = m.files[k] === 'Money', col = money && t >= 33 ? C.accent : (j === 4 ? C.accent : C.ink);
          ctx.globalAlpha = fw.a; ctx.fillStyle = e < 1 ? col : rgba(money && t >= 33 ? 'accent' : 'ink', 0.12); ctx.fillRect(x - w / 2, y - h / 2, w, h);
          if (e >= 1) { ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.strokeRect(x - w / 2 + 0.6, y - h / 2 + 0.6, w - 1.2, h - 1.2);
            ctx.fillStyle = col; ctx.fillRect(x + w / 2 - 13, y - 3, 6, 6); }                 // the port
          ctx.globalAlpha = 1;
          T('wt.c' + fileI, c.x - BW / 2 + 18, c.y + 5, m.files[k], { size: 14, op: fw.a * clamp((chipsU - 0.9) / 0.1, 0, 1), fill: money && t >= 33 ? C.accent : C.ink });
        }
      });
      void src;
      // wires (reveal)
      reveal(REVW, t - 29.6, fw.a * (t > 29.6 ? 1 : 0));
      // symmetry note: accounts ≅ savings
      const sy = fw.a * clamp((t - 32.4) / 0.5, 0, 1);
      T('wt.sy', BX(1) + BW + 8, BY + 98, '≅', { fam: 'disp', size: 30, anchor: 'middle', op: sy, fill: C.soft }, 'must-read');
      // the 13 checks
      const nOn = v('checks', t), ck = fw.a * clamp((t - 32.6) / 0.4, 0, 1);
      if (ck > 0) {
        for (let k = 0; k < P.checks; k++) {
          const x = 60 + k * 34, y = 366, lit = clamp(nOn - k, 0, 1);
          hollow(x, y, 24, C.ink, ck * 0.7, 1.2);
          const kappa = k === 9;
          if (lit > 0) sq(x, y, 20 * (0.6 + 0.4 * lit), kappa ? C.accent : C.ink, ck * lit);
        }
        const cur = Math.min(P.checks - 1, Math.floor(nOn));
        const nm = nOn >= P.checks ? CHECKS[9] : CHECKS[cur];
        T('wt.cn', 60 - 12, 404, (nOn >= P.checks ? 'including · ' : 'check · ') + nm, { size: 14, ls: '0.06em', op: ck, fill: nOn >= P.checks ? C.accent : C.muted });
        const done = clamp((t - 36.4) / 0.5, 0, 1);
        T('wt.n', 514, 382, P.checksPass + ' OF ' + P.checks, { fam: 'disp', size: 48, op: ck * done }, 'must-read');
        T('wt.p', 740, 360, 'PASS', { size: 16, ls: '0.1em', op: ck * done, fill: C.muted });
        // your number on the same row
        const g = K.answered(s) ? clamp(Math.round(s.answer), 0, P.checks) : null, ya = ck * clamp((t - 37.2) / 0.5, 0, 1);
        if (g != null && g > 0) {
          const x = 60 + (g - 1) * 34;
          path('wt.yp', 'marks', `M${x} 332 l-6 -9 h12 z`, { fill: C.soft, stroke: C.soft, w: 1, op: ya });
          T('wt.y', 740, 382, 'YOU · ' + g, { size: 16, ls: '0.1em', op: ya, fill: C.soft });
        } else if (ya > 0) T('wt.y', 740, 382, 'YOU · NO ANSWER', { size: 16, ls: '0.1em', op: ya, fill: C.soft });
        if (t >= 35.0) stamp('wt.k', 'marks', BX(4) + BW / 2 + 14, BY + 112, 0.9, 'κ FIRES', { op: fw.a * clamp((t - 35) / 0.25, 0, 1), rim: C.accent, rot: -6, fs: 22 });
      }
    }

    /* ═════ COUNT 40–54 · E2 tokens: one mark per family member ═════ */
    const f2 = on('e2', t);
    if (f2) {
      eyebrow('e2.e', 'E2 · TOKENS · ' + P.sites + ' REAL APACHE FINERACT SITES', f2.a);
      title('e2.t', 'Is the wiring cheaper than the whole?', f2.a);
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
        T('e2.s' + j, fam.x, yb, 'EVEN AT ' + fam.star, { size: 16, ls: '0.06em', op: fa, fill: C.accent });
        if (u >= 1) stamp('e2.w' + j, 'marks', fam.x + fam.L.box.w / 2, fam.L.box.y + fam.L.box.h / 2, 1, 'WIN', { op: f2.a * clamp((t - (j ? 52.8 : 48.8)) / 0.25, 0, 1), rim: C.accent, rot: -8, fs: 22 });
      });
      const la = f2.a * clamp((t - 45.4) / 0.5, 0, 1);
      T('e2.k', 112, 166, 'LEGEND ' + P.s3F + ' ONCE · ' + P.s3e + ' → ' + P.s3m + ' TOK EACH', { size: 14, ls: '0.04em', op: la, fill: C.ink });
    }

    /* ═════ COUNT 54–68 · E3: do models read it? one mark per answer ═════ */
    const f3 = on('e3', t);
    if (f3) {
      eyebrow('e3.e', 'E3 · ABLATION · ' + P.e3pool + ' QUESTIONS × ' + P.e3runs + ' RUNS PER ARM', f3.a);
      title('e3.t', 'Can a model read the factored form?', f3.a);
      const arms = [['A', 'EXPLICIT EDGES', E3.A, E3.okA, v('e3a', t), P.e3A, P.tokA], ['B', 'FACTORED PACK', E3.B, E3.okB, v('e3b', t), P.e3B, P.tokB]];
      const tokU = v('e3tok', t), pctU = f3.a * v('e3pct', t), scale = 300 / P.tokA;
      arms.forEach(([id, name, L, ok, u, nOk, tok], j) => {
        const y0 = L.box.y, nAns = P.e3pool * P.e3runs, pct = nOk / nAns * 100;
        T('e3.h' + j, 48, y0 - 12, id + ' · ' + name, { size: 14, ls: '0.08em', op: f3.a, fill: j ? C.accent : C.ink });
        let got = 0;
        for (let i = 0; i < nAns; i++) {
          const m = L.items[i], q = i % P.e3pool, r = Math.floor(i / P.e3pool), right = r < ok[q];
          const a = f3.a * clamp(u * (P.e3pool + 3) - q - r * 0.6, 0, 1);
          hollow(m.x, m.y, m.w, C.ink, f3.a * 0.35, 1);
          if (a <= 0) continue;
          if (right) { sq(m.x, m.y, m.w, j ? C.accent : C.ink, a); if (a >= 1) got++; }
          else hollow(m.x, m.y, m.w, j ? C.accent : C.ink, a, 1.6);
        }
        const ca = f3.a * clamp((u - 0.9) / 0.1, 0, 1);
        T('e3.n' + j, 420, y0 + 46, nOk + ' OF ' + nAns, { fam: 'disp', size: 38, op: ca, fill: j ? C.accent : C.ink }, 'must-read');
        T('e3.p' + j, 420, y0 + 76, pct.toFixed(1) + '%', { size: 20, op: pctU, fill: C.muted });
        // token bar
        const bw = tok * scale * tokU, by = y0 + 30;
        if (tokU > 0) {
          ctx.globalAlpha = f3.a; ctx.fillStyle = j ? C.accent : C.ink; ctx.fillRect(600, by, bw, 18); ctx.globalAlpha = 1;
          T('e3.k' + j, 600, by - 10, tok.toLocaleString('en-US') + ' TOKENS', { size: 16, ls: '0.04em', op: f3.a * clamp(tokU * 2 - 1, 0, 1), fill: j ? C.accent : C.ink });
          if (j) T('e3.r', 600 + P.tokB * scale + 12, by + 15, Math.round(P.tokB / P.tokA * 100) + '% OF A', { size: 20, op: pctU, fill: C.accent });
        }
        void got;
      });
      const qa = f3.a * clamp((t - 61.5) / 0.6, 0, 1), qx = E3.A.items[4].x;
      ln('e3.q', 'marks', qx, 154, qx, 386, { stroke: C.muted, w: 1, dash: '3 4', op: qa });
      T('e3.qn', 48, 404, 'Q5 · THE SAME AMBIGUOUS QUESTION, MISSED IN BOTH ARMS', { size: 14, ls: '0.04em', op: qa, fill: C.muted });
    }

    /* ═════ COUNT 68–84 · E5: depth, a slope that stays flat ═════ */
    const f5 = on('e5', t);
    if (f5) {
      eyebrow('e5.e', 'E5 · DEPTH · ' + P.e5q + ' QUESTIONS · ' + P.e5depths + ' DEPTH LEVELS', f5.a);
      title('e5.t', 'Does the reading hold at depth?', f5.a);
      const X = REVD.X, Y = REVD.Y, ax = f5.a * clamp((t - 68.4) / 0.6, 0, 1);
      ln('e5.ax', 'marks', X(1) - 20, Y(0) + 6, X(10) + 20, Y(0) + 6, { stroke: C.muted, w: 1, op: ax });
      ln('e5.g', 'marks', X(1) - 20, Y(1), X(10) + 20, Y(1), { stroke: C.line, w: 1, op: ax, dash: '2 5' });
      T('e5.y', X(1) - 28, Y(1) + 5, P.sonnet + '%', { size: 14, anchor: 'end', op: ax, fill: C.muted });
      for (let d = 1; d <= P.e5depths; d++) T('e5.d' + d, X(d), Y(0) + 26, 'D' + d, { size: 14, anchor: 'middle', op: ax, fill: C.muted });
      reveal(REVD, t - 68.6, f5.a);
      const sa = f5.a * clamp((t - 73.2) / 0.6, 0, 1);
      T('e5.s', X(1), Y(1) - 16, 'SONNET · BOTH ARMS · ' + P.sonnet + '% AT EVERY DEPTH', { size: 16, ls: '0.04em', op: sa, fill: C.accent });
      T('e5.h', X(7) + 14, Y(0.417) + 4, 'HAIKU · BOTH ARMS DIP', { size: 14, ls: '0.04em', op: sa * 0.95, fill: C.soft });
      const ba = f5.a * v('e5ba', t);
      T('e5.b', 912, 92, 'B − A = ' + P.pooledBA.toFixed(1).replace('-', '−') + ' PTS', { fam: 'disp', size: 36, anchor: 'end', op: ba, fill: C.accent }, 'must-read');
      T('e5.r', 912, 120, 'RULE: WITHIN ' + P.rule + ' PTS · RAW ' + P.rawBA.toFixed(1).replace('-', '−') + ', ~' + P.artifactPct + '% HARNESS ARTIFACT', { size: 14, anchor: 'end', ls: '0.04em', op: ba, fill: C.muted });
    }

    /* ═════ COUNT 84–92 · the review that said no ═════ */
    const fn = on('nos', t);
    if (fn) {
      eyebrow('ns.e', 'INDEPENDENT EVALUATOR · DID NOT WRITE THE CODE', fn.a);
      title('ns.t', 'And the review that said no.', fn.a);
      const ma = fn.a * v('nos', t);
      rc('ns.bg', 'field', 48, 128, 864, 250, { fill: C.panel, op: ma * 0.9, stroke: C.line, w: 1, rx: 4 });
      T('ns.l1', 76, 170, 'SCALE BUILD · S2 + S3 BUNDLE', { size: 14, ls: '0.12em', op: ma, fill: C.muted });
      T('ns.l2', 76, 214, 'WIRING_ENGINE=python make slice-matrix-check', { size: 18, op: ma, fill: C.ink });
      T('ns.l3', 76, 248, '→ exit ' + P.exitCode + ' · the python engine crashes on one shard', { size: 18, op: ma * clamp((t - 85) / 0.4, 0, 1), fill: C.accent });
      const fa = fn.a * v('fix', t);
      ln('ns.r', 'marks', 76, 290, 884, 290, { stroke: C.line, w: 1, op: fa });
      T('ns.l4', 76, 330, 'B1 FIXED · RE-RUN · ' + P.shards + ' OF ' + P.shards + ' SHARDS PASS · THEN SHIP', { size: 18, op: fa, fill: C.ink });
      if (t >= 85.4) stamp('ns.st', 'marks', 730, 188, 1.25, 'NO-SHIP', { op: fn.a * clamp((t - 85.4) / 0.22, 0, 1), rim: C.accent, rot: -7, fs: 30 });
    }

    /* ═════ MONDAY 92–100 ═════ */
    const fm = on('mon', t);
    if (fm) {
      eyebrow('mo.e', 'MONDAY', fm.a);
      // the repo's rows, faint, as the ground for the question
      const ga = fm.a * 0.07 * v('q', t);
      for (let i = 0; i < N; i++) { const m = ROWS.items[i], wit = i >= W0 && i < W0 + P.fWitness; sq(m.x, m.y, m.w, wit ? C.accent : C.ink, ga * (wit ? 2.5 : 1)); }
      const qa = fm.a * v('q', t);
      T('mo.q', 480, 236, 'What is this a module of?', { fam: 'disp', size: 60, anchor: 'middle', op: qa, fill: C.accent }, 'must-read');
      T('mo.s', 480, 284, 'ASK IT BEFORE YOU PASTE THE WHOLE REPO INTO A MODEL', { size: 16, anchor: 'middle', ls: '0.08em', op: qa, fill: C.ink });
      const la = fm.a * v('lim', t);
      T('mo.l', 480, 344, "THE REPO'S OWN REPORTED NUMBERS · ONE AUTHOR · NOT REPLICATED", { size: 16, anchor: 'middle', ls: '0.06em', op: la, fill: C.muted });
    }
  },

  tryit(vals, s, K) {
    const Fv = +vals.F, e = +vals.e, m = +vals.m, n = +vals.n;
    if (!(e > m)) return '<b>No break-even.</b> Each member must cost fewer tokens factored (m) than explicit (e).';
    const star = Math.ceil(Fv / (e - m)), net = n * (e - m) - Fv;
    return `<b>n* = ${star}</b> members to pay back the legend. ` + (n >= star
      ? `A family of ${n.toLocaleString('en-US')} saves ${net.toLocaleString('en-US')} tokens (${n} × ${e - m} − ${Fv}).`
      : `A family of ${n} never pays it back: ${n} × ${e - m} &lt; ${Fv}.`);
  },
};
})();
