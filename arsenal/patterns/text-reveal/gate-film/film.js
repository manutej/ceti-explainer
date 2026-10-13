/* arsenal/patterns/text-reveal/gate-film/film.js · a 20 s test film for K.reveal (opt-in adapter). Pure of t: render(t, s, K) draws frame t from t alone.
   The field is 23 x 20 = 460 tries, 278 lit (seeded shuffle); the count-ins land marks at K.reveal.arrivals so every digit is a count of marks. */
(function () {
'use strict';
const F = window.FILM, PR = F.params, K0 = window.KIT, RV = K0.reveal, R = RV.R, GLL = window.ARSENAL.patterns['gl-labels'];
const N = PR.tries, NP = PR.passed, COLS = PR.cols, PITCH = 12, FX = 470, FY = 120;
const rng = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuf = (seed) => { const r = rng(seed), a = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ORDER = shuf(F.seed + 4), LITSET = new Set(shuf(F.seed).slice(0, NP));
const IDX = new Map(ORDER.map((i, k) => [i, k]));
const LORDER = Array.from(LITSET).sort((a, b) => IDX.get(a) - IDX.get(b)), LK = new Map(LORDER.map((i, k) => [i, k]));
const mk = (i) => ({ x: FX + (i % COLS) * PITCH, y: FY + Math.floor(i / COLS) * PITCH });
const O1 = { at: 3.9, to: N, cdur: 1.6, claim: 'tries: one cube each (params.tries)' }, O2 = { at: 5.8, to: NP, cdur: 1.3, claim: 'passed tries (params.passed)' };
const A1 = RV.arrivals(O1.at, O1), A2 = RV.arrivals(O2.at, O2);
let ANC = null, QS = null;
function placements(K) {
  if (QS) return QS;
  const g = document.createElement('canvas').getContext('2d'), meas = (s, z, f) => { g.font = z + 'px ' + K.FONT[f]; return g.measureText(s).width; };
  const w = (i) => { const m = mk(i); return [m.x + 4.5 - 480, m.y + 4.5 - 270, 0]; };
  ANC = [{ id: 'try', i: 0, text: 'TRY 1', role: 'secondary' }, { id: 'pass', i: COLS - 1 + COLS * 8, text: String(NP), sub: 'passed the tests', role: 'result' }, { id: 'last', i: N - 1, text: 'LAST TRY · ' + N, role: 'chrome' }]
    .map((a) => Object.assign(a, { x: w(a.i)[0], y: w(a.i)[1], z: 0, priority: 1 }));
  const cam = { eye: [0, 0, 100], look: [0, 0, 0], up: [0, 1, 0], ortho: 1 };
  QS = new Map(GLL.solve(0, cam, ANC, { occlusion: false, hold: 0, measure: meas, measureKey: 'gate-film', leader: 26 }).placements.map((q) => [q.id, q]));
  return QS;
}
window.FILM_RENDER = {
  render(t, s, K) {
    const C = K.C, g = K.ctx;
    for (let i = 0; i < N; i++) {   // the field: each try lands at its arrival time (2-frame fade), each pass lights at its own
      const a = Math.min(1, Math.max(0, (t - A1[IDX.get(i)]) * 15)); if (a <= 0) continue;
      const m = mk(i); g.globalAlpha = a; g.fillStyle = LITSET.has(i) && t >= A2[LK.get(i)] ? C.accent : C.line; g.fillRect(m.x, m.y, 9, 9);
    }
    g.globalAlpha = 1;
    const Q = placements(K), R_ = K.reveal;
    // hook: a block (eyebrow, title, two lines) in at 0.3, out at 3.2
    R_.tx('h.e', 'labels', 60, 140, 'TEXT REVEAL · GATE FILM', { at: 0.3, out: 3.2, i: 0, n: 4, size: 12, fill: 'muted', role: 'chrome', ls: 2 });
    R_.tx('h.t', 'labels', 60, 196, 'Text rises through a mask', { at: 0.3, out: 3.2, i: 1, n: 4, size: 40, fam: 'disp', fill: 'ink', role: 'must-read' });
    R_.tx('h.a', 'labels', 60, 236, 'One line every three frames.', { at: 0.3, out: 3.2, i: 2, n: 4, size: 16, fill: 'ink', role: 'secondary' });
    R_.tx('h.b', 'labels', 60, 262, 'The wave ends in under a second.', { at: 0.3, out: 3.2, i: 3, n: 4, size: 16, fill: 'ink', role: 'secondary' });
    // counts: the tries, then the passes (tabular mono digits; a weight pulse on landing); the ratio lands, it does not roll
    const y1 = 190, y2 = 280, y3 = 370, OUT = 15.2;
    R_.tx('k1', 'labels', 60, y1 - 62, 'TRIES · ONE CUBE EACH', { at: 3.9, out: OUT, size: 12, fill: 'muted', role: 'chrome', ls: 2 });
    R_.count('n1', 'labels', 60, y1, Object.assign({ out: OUT, size: 56, fill: 'ink', role: 'must-read' }, O1, { arrivals: A1 }));
    R_.tx('k2', 'labels', 60, y2 - 62, 'PASSED · LIT GOLD', { at: 5.8, out: OUT, size: 12, fill: 'muted', role: 'chrome', ls: 2 });
    R_.count('n2', 'labels', 60, y2, Object.assign({ out: OUT, size: 56, fill: 'accent', role: 'must-read' }, O2, { arrivals: A2 }));
    R_.tx('k3', 'labels', 60, y3 - 62, '278 / 460 · SHARE THAT PASSED', { at: 9.8, out: OUT, size: 12, fill: 'muted', role: 'chrome', ls: 2 });
    R_.land('n3', 'labels', 60, y3, '60.4 %', { at: 9.8, out: OUT, size: 56, fill: 'accent', role: 'must-read' });
    // the silent beat: one ring on the last pass at its landing (never over a digit)
    const lm = mk(LORDER[NP - 1]); R_.ring('ring', 'labels', lm.x + 4.5, lm.y + 4.5, { at: A2[NP - 1], stroke: 'accent' });
    // label attach from the gl-labels solver: dot, leader, label; out 0.6x
    [['try', 7.6, 12.4], ['pass', 8.4, 12.8], ['last', 9.2, 13.2]].forEach((r) => { const q = Q.get(r[0]); if (q) R_.label(q, { at: r[1], out: r[2] }); });
    // monday
    R_.block('m', 'labels', 60, 150, ['MONDAY', 'Use K.reveal for labels and panels.', 'Land numbers; never roll a ratio.'], { at: 15.5, out: 16.7, size: 16, fill: 'ink', role: 'secondary', lh: 28 });
  },
};
})();
