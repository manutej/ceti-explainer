/* factory/films/brooks · Brooks' Law in 75 seconds.
   Four structures: the ring (people as dots, every pair a line), the tally and counters,
   the OS/360 ledger, the man-month grid. One clock: everything below is a function of t.
   No RNG at all: the path order is fixed (lexicographic by join order). */
(function () {
'use strict';
const F = window.FILM, P = F.params;

// ── the ring: 20 fixed slots; people join in this order ──
const RING = { cx: 190, cy: 252, r: 138 };
const JOIN = [0, 4, 8, 12, 16, 2, 6, 10, 14, 18, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const slotXY = (k) => { const a = (-90 + 18 * k) * Math.PI / 180; return [RING.cx + RING.r * Math.cos(a), RING.cy + RING.r * Math.sin(a)]; };
// ── the tally: one tick per path ──
const TL = { x: 360, y: 244, per: 25, px: 12, py: 19, w: 2.4, h: 14 };
const COL = { x: 360, xb: 510 };   // right sub-column: PEOPLE at x, PATHS at xb

let PEOPLE = null;  // [{slot, xy, appear}]
let PATHS = null;   // [{i, j, start, dur, phase}]

function build() {
  PEOPLE = JOIN.map((slot, idx) => ({ slot, xy: slotXY(slot), appear: 0 }));
  PATHS = [];
  // phase A (hook): P1..P5 appear 1.0..1.6; their 10 pairs draw from 2.0
  for (let k = 0; k < 5; k++) PEOPLE[k].appear = 1.0 + 0.15 * k;
  let m = 0;
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { PATHS.push({ i, j, start: 2.0 + 0.18 * m, dur: 0.3, ph: 'A' }); m++; }
  // phase B (count): P6..P10; path m (0-based 10..44) starts 37.3 + 0.2 (m - 10)
  for (let j = 5; j < 10; j++) {
    for (let i = 0; i < j; i++) { PATHS.push({ i, j, start: 37.3 + 0.2 * (PATHS.length - 10), dur: 0.35, ph: 'B' }); }
  }
  for (let j = 5; j < 10; j++) PEOPLE[j].appear = PATHS.find(p => p.j === j).start - 0.3;
  // phase C: P11..P20, each with all its paths at once
  for (let j = 10; j < 20; j++) {
    PEOPLE[j].appear = 54.6 + 0.34 * (j - 10);
    for (let i = 0; i < j; i++) PATHS.push({ i, j, start: PEOPLE[j].appear + 0.1, dur: 0.35, ph: 'C' });
  }
}

// text with a legibility role
function T(K, key, layer, x, y, s, o, role) {
  const el = K.tx(key, layer, x, y, s, o || {});
  if (role) el.setAttribute('data-role', role);
  return el;
}

const ringVisible = (t) => t < 16.6 || t >= 36;
function ringAlpha(t, K) {
  if (t < 16.6) return 1 - K.seg(t, 16, 16.6);
  if (t < 62) return K.seg(t, 36, 36.8);
  return 1 - 0.86 * K.seg(t, 62, 62.8);
}

function drawRing(t, s, K, A) {
  const ctx = K.ctx;
  const landed = PATHS.filter(p => t >= p.start + p.dur).length;
  // lines (mass, canvas)
  ctx.lineCap = 'round';
  for (let m = 0; m < PATHS.length; m++) {
    const p = PATHS[m];
    if (t < p.start) continue;
    const u = K.clamp((t - p.start) / p.dur);
    const a = PEOPLE[p.i].xy, b = PEOPLE[p.j].xy;
    const hot = t < p.start + p.dur + 0.6;
    const thin = p.ph === 'C';
    ctx.strokeStyle = hot ? K.rgba('accent', 0.85 * A) : K.rgba('ink', (thin ? 0.42 : 0.8) * A);
    ctx.lineWidth = thin ? 0.6 : 1.0;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(K.lerp(a[0], b[0], u), K.lerp(a[1], b[1], u)); ctx.stroke();
  }
  // ghost seats: P6..P10, from the commit until they arrive
  for (let j = 5; j < 10; j++) {
    const q = PEOPLE[j];
    if (t >= 8.2 && t < q.appear) {
      const g = K.seg(t, 8.2, 8.8) * A;
      ctx.strokeStyle = K.rgba('ink', 0.6 * g); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(q.xy[0], q.xy[1], 7, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  // people (dots)
  let people = 0;
  for (let k = 0; k < 20; k++) {
    const q = PEOPLE[k];
    if (t < q.appear) continue;
    people++;
    const u = K.eout(K.seg(t, q.appear, q.appear + 0.3)), hot = k >= 5 && t < q.appear + 1.5;
    ctx.fillStyle = hot ? K.rgba('accent', A) : K.rgba('ink', A);
    ctx.beginPath(); ctx.arc(q.xy[0], q.xy[1], 7 * u, 0, 2 * Math.PI); ctx.fill();
  }
  return { landed, people };
}

function drawTally(t, s, K, A, landed) {
  const ctx = K.ctx;
  const g = K.answered(s) ? s.answer : null;
  const missWin = t >= 48 && t < 49.5;
  for (let m = 0; m < landed; m++) {
    const r = Math.floor(m / TL.per), c = m % TL.per;
    const red = missWin && g != null && m >= g && m < 45;
    ctx.fillStyle = red ? K.rgba('accent', 0.95 * A) : K.rgba('ink', 0.85 * A);
    ctx.fillRect(TL.x + c * TL.px, TL.y + r * TL.py, TL.w, TL.h);
  }
  // the sealed guess as a red bracket under ticks 1..g (only after the count of 45 is down)
  if (g != null && t >= 48 && t < 55) {
    const a = K.seg(t, 48, 48.4) * (1 - K.seg(t, 54.5, 55)) * A, n = Math.min(g, 45);
    ctx.strokeStyle = K.rgba('accent', a); ctx.lineWidth = 2;
    for (let r = 0; r * TL.per < n; r++) {
      const k = Math.min(TL.per, n - r * TL.per), y = TL.y + r * TL.py + TL.h + 2.5;
      const x0 = TL.x - 2, x1 = TL.x + (k - 1) * TL.px + TL.w + 2;
      ctx.beginPath(); ctx.moveTo(x0, y - 3); ctx.lineTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1, y - 3); ctx.stroke();
    }
  }
}

function drawCounters(t, s, K, A, st) {
  const { C, seg } = K;
  const on = t < 16 ? seg(t, 4.0, 4.4) * A : A;
  if (on <= 0.01) return;
  T(K, 'rg.pl', 'labels', COL.x, 124, 'PEOPLE', { size: 14, weight: 500, ls: '0.14em', op: on }, 'secondary');
  T(K, 'rg.tl', 'labels', COL.xb, 124, 'PATHS', { size: 14, weight: 500, ls: '0.14em', op: on }, 'secondary');
  T(K, 'rg.pv', 'labels', COL.x, 168, K.fmtK(st.people), { fam: 'mono', size: 44, weight: 500, op: on }, 'must-read');
  T(K, 'rg.tv', 'labels', COL.xb, 168, K.fmtK(st.landed), { fam: 'mono', size: 44, weight: 500, op: on, fill: t >= 36 && t < 58.2 ? C.accent : C.ink }, 'must-read');
}

function drawCount(t, s, K, A) {
  const { C, seg } = K;
  // the guess, placed against the 45 (after the seal and after the count is down)
  if (t >= 48 && t < 51) {
    const a = seg(t, 48, 48.4) * (1 - seg(t, 50.7, 51));
    const lab = K.answered(s) ? 'YOUR GUESS ' + s.answer : 'NO GUESS';
    T(K, 'ct.you', 'labels', COL.x, 216, lab, { size: 28, weight: 500, fill: C.accent, op: a }, 'must-read');
  }
  // ratios, only after the counts: each carries its count beneath
  if (t >= 51 && t < 54.5) {
    const a = seg(t, 51, 51.4) * (1 - seg(t, 54.1, 54.5));
    T(K, 'ct.rp', 'labels', COL.x, 210, '×2', { size: 28, weight: 500, op: a }, 'must-read');
    T(K, 'ct.rpn', 'labels', COL.x, 232, '10 ÷ 5', { size: 16, op: a }, 'secondary');
    T(K, 'ct.rt', 'labels', COL.xb, 210, '×4.5', { size: 28, weight: 500, fill: C.accent, op: a }, 'must-read');
    T(K, 'ct.rtn', 'labels', COL.xb, 232, '45 ÷ 10', { size: 16, op: a }, 'secondary');
  }
  // OS/360 at its peak: the same arithmetic
  if (t >= 58.2 && t < 62.8) {
    const a = seg(t, 58.2, 58.7) * (1 - seg(t, 62, 62.8));
    T(K, 'ct.os1', 'labels', COL.x, 196, 'OS/360 PEAK · 1,000 PEOPLE', { size: 16, weight: 500, ls: '0.04em', op: a }, 'secondary');
    T(K, 'ct.os2', 'labels', COL.x, 228, '499,500 PATHS', { size: 28, weight: 500, fill: C.accent, op: a }, 'must-read');
  }
}

function drawCommitPrompt(t, s, K) {
  if (t < 8 || t >= 16.6) return;
  const a = K.seg(t, 8.2, 8.8) * (1 - K.seg(t, 16, 16.6));
  T(K, 'cm.p1', 'labels', COL.x, 236, '10 PEOPLE.', { fam: 'disp', size: 40, op: a }, 'must-read');
  T(K, 'cm.p2', 'labels', COL.x, 280, 'HOW MANY PATHS?', { fam: 'disp', size: 40, op: a, fill: K.C.accent }, 'must-read');
}

// ── CASE a: the OS/360 ledger ──
function drawLedger(t, K) {
  if (t < 16.4 || t >= 23.8) return;
  const { seg, C, ln } = K;
  const out = 1 - seg(t, 23.2, 23.6);
  const a1 = seg(t, 16.4, 16.9) * out, a2 = seg(t, 18.4, 18.9) * out, a3 = seg(t, 20.4, 20.9) * out;
  T(K, 'os.h', 'labels', 48, 150, 'IBM OS/360', { fam: 'disp', size: 44, op: a1 }, 'must-read');
  T(K, 'os.hs', 'labels', 48, 178, 'FRED BROOKS BECOMES ITS MANAGER IN 1964', { size: 16, weight: 500, ls: '0.04em', op: a1 }, 'secondary');
  ln('os.r1', 'marks', 48, 196, 640, 196, { op: a1 * 0.5 });
  T(K, 'os.p', 'labels', 48, 272, '1,000+', { fam: 'disp', size: 72, op: a2 }, 'must-read');
  T(K, 'os.ps', 'labels', 270, 246, 'PEOPLE AT THE PEAK', { size: 18, weight: 500, ls: '0.06em', op: a2 }, 'secondary');
  T(K, 'os.ps2', 'labels', 270, 270, 'PROGRAMMERS TO SECRETARIES', { size: 16, op: a2 * 0.85 }, 'secondary');
  ln('os.r2', 'marks', 48, 292, 640, 292, { op: a2 * 0.5 });
  T(K, 'os.m', 'labels', 48, 368, '5,000', { fam: 'disp', size: 72, op: a3 }, 'must-read');
  T(K, 'os.ms', 'labels', 270, 342, 'MAN-YEARS, 1963–1966', { size: 18, weight: 500, ls: '0.06em', op: a3 }, 'secondary');
  T(K, 'os.ms2', 'labels', 270, 366, 'HIS ESTIMATE: “PROBABLY”', { size: 16, op: a3 * 0.85 }, 'secondary');
}

// ── CASE b: the man-month grid (Brooks's worked example, Ch. 2) ──
const G = { x: 150, y: 140, cw: 96, ch: 30, rp: 36 };
const cellXY = (r, c) => [G.x + c * G.cw + 3, G.y + r * G.rp];
function cell(K, r, c, kind, a) {
  const ctx = K.ctx, [x, y] = cellXY(r, c), w = G.cw - 6, h = G.ch;
  if (a <= 0) return;
  ctx.save();
  if (kind === 'plan') { ctx.fillStyle = K.rgba('ink', 0.12 * a); ctx.fillRect(x, y, w, h); ctx.strokeStyle = K.rgba('ink', 0.7 * a); ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h); }
  if (kind === 'done') { ctx.fillStyle = K.rgba('ink', 0.62 * a); ctx.fillRect(x, y, w, h); }
  if (kind === 'late') { ctx.setLineDash([4, 3]); ctx.strokeStyle = K.rgba('accent', 0.95 * a); ctx.lineWidth = 1.6; ctx.strokeRect(x, y, w, h); ctx.setLineDash([]); ctx.fillStyle = K.rgba('accent', 0.12 * a); ctx.fillRect(x, y, w, h); }
  if (kind === 'train') {
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.strokeStyle = K.rgba('accent', 0.85 * a); ctx.lineWidth = 1.2;
    for (let d = -h; d < w; d += 7) { ctx.beginPath(); ctx.moveTo(x + d, y + h); ctx.lineTo(x + d + h, y); ctx.stroke(); }
    ctx.strokeStyle = K.rgba('accent', a); ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();
}
function drawGrid(t, K) {
  if (t < 23.5 || t >= 36.6) return;
  const { seg, C, ln, stamp } = K, ctx = K.ctx;
  const out = 1 - seg(t, 36, 36.6), a0 = seg(t, 23.6, 24.2) * out;
  const ph = t < 26.8 ? 1 : t < 29.8 ? 2 : t < 33.0 ? 3 : 4;
  // heads
  T(K, 'gr.mh', 'labels', 48, 128, 'MONTH', { size: 14, weight: 500, ls: '0.14em', op: a0 }, 'secondary');
  for (let c = 0; c < 4; c++) T(K, 'gr.h' + c, 'labels', G.x + c * G.cw + G.cw / 2, 128, String(c + 1), { size: 16, weight: 500, anchor: 'middle', op: a0 }, 'secondary');
  const lateA = seg(t, 27.5, 28.0) * out;
  if (lateA > 0) T(K, 'gr.hl', 'labels', G.x + 4 * G.cw + G.cw / 2, 128, 'LATE', { size: 16, weight: 500, anchor: 'middle', fill: C.accent, op: lateA }, 'secondary');
  // people (row marks)
  const rows = ph >= 3 ? 5 : 3;
  for (let r = 0; r < rows; r++) {
    const a = r < 3 ? a0 : seg(t, 29.8, 30.3) * out, y = G.y + r * G.rp + G.ch / 2;
    ctx.fillStyle = r < 3 ? K.rgba('ink', a) : K.rgba('accent', a);
    ctx.beginPath(); ctx.arc(G.x - 22, y, 6, 0, 2 * Math.PI); ctx.fill();
  }
  // cells
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const ai = seg(t, 23.6 + 0.06 * (r * 4 + c), 24.0 + 0.06 * (r * 4 + c)) * out;
    let kind = 'plan';
    if (ph >= 2 && c < 2) kind = 'done';                      // one month's work took two months
    if (ph >= 3 && c === 2 && r === 0) kind = 'train';         // the trainer
    if (ph >= 4 && c === 2 && r > 0) kind = 'done';            // two productive man-months in month 3
    cell(K, r, c, kind, ai);
  }
  if (ph >= 3) for (let r = 3; r < 5; r++) {
    cell(K, r, 2, 'train', seg(t, 29.9, 30.4) * out);
    if (ph >= 4) cell(K, r, 3, 'plan', seg(t, 33.0, 33.4) * out);
  }
  // overflow past month 4 (the 'late' column): 3 at month 2 (9 left, 6 seats), 2+ at month 3 (over 7 left, 5 seats)
  if (ph === 2 || ph === 3) for (let r = 0; r < 3; r++) cell(K, r, 4, 'late', lateA);
  if (ph >= 4) for (let r = 0; r < 2; r++) cell(K, r, 4, 'late', seg(t, 33.2, 33.6) * out);
  // milestone marker: due at the end of month 1, met at the end of month 2
  if (t >= 26.8) {
    const u = K.ease(seg(t, 26.9, 27.7)), x = G.x + G.cw * (1 + u);
    ln('gr.ms', 'marks', x, G.y - 6, x, G.y + 3 * G.rp, { stroke: C.accent, w: 2, op: out });
    ln('gr.md', 'marks', G.x + G.cw, G.y - 6, G.x + G.cw, G.y + 3 * G.rp, { stroke: C.ink, w: 1, dash: '3 3', op: 0.7 * out });
  }
  // the label line (28 units): what the grid says now
  const LBL = { 1: '12 MAN-MONTHS · 3 PEOPLE · 4 MONTHS', 2: 'MILESTONE DUE 1, MET 2 · 9 LEFT', 3: '+2 PEOPLE · TRAINING: 3 MAN-MONTHS', 4: 'OVER 7 LEFT · 5 PEOPLE · 1 MONTH' };
  const t0 = { 1: 23.8, 2: 26.9, 3: 29.9, 4: 33.1 }[ph];
  T(K, 'gr.l', 'labels', 48, 368, K.typed(LBL[ph], t, t0, 60), { size: 28, weight: 500, op: out, fill: ph >= 3 ? C.accent : C.ink }, 'must-read');
  if (t >= 34.0) stamp('gr.st', 'marks', 498, 300, 1.0, 'AS LATE AS ADDING NO ONE', { op: seg(t, 34.0, 34.2) * out, rim: C.accent, rot: -5 });
}

// ── MONDAY ──
function drawMonday(t, K) {
  if (t < 62.4) return;
  const a = K.seg(t, 62.4, 63.0), b = K.seg(t, 66.0, 66.6);
  const q = K.wrap(F.monday.q, 600, 36, 'disp');
  q.forEach((s, i) => T(K, 'mo.q' + i, 'labels', 48, 140 + i * 40, s, { fam: 'disp', size: 36, op: a }, 'must-read'));
  const h = K.wrap(F.monday.honest, 610, 28, 'mono');
  h.forEach((s, i) => T(K, 'mo.h' + i, 'labels', 48, 300 + i * 34, s, { size: 28, op: b * 0.9 }, 'must-read'));
}

window.FILM_RENDER = {
  setup(p, K) {
    build();
    // the kit's stamps (SEALED, the grid verdict) live in the marks layer and are labels, not headline numbers
    const g = K.svg && K.svg.querySelector('g[data-layer="marks"]'); if (g) g.setAttribute('data-role', 'secondary');
  },
  render(t, s, K) {
    const ch = K.chapterAt(t);
    const chap = ch && ch.id === 'case' && t >= F.caseB.t0 ? F.caseB : ch;
    K.chrome(t, chap, {
      ledger: { title: 'REVISIONS', rows: t < 16.5 ? F.ledger.slice(0, 2) : F.ledger,   // at most 4 rows while the commit box shows
                hl: t >= 58.2 ? 5 : t >= 44.5 ? 4 : null },
      block: { title: "BROOKS' LAW", lines: ['CASE · OS/360', 'ISSUED FOR REVIEW'], open: 0.4, slotLabel: 'GUESS', slot: t >= F.commit.at + 4.5 ? 'SEALED' : null },
    });
    K.roll(t, 0, 1.0);
    if (ringVisible(t)) {
      const A = ringAlpha(t, K);
      const st = drawRing(t, s, K, A);
      const A2 = t >= 62 ? 1 - K.seg(t, 62, 62.6) : A;   // MONDAY clears the counters and tally, keeps the ring faint
      drawTally(t, s, K, t < 36 ? 0 : A2, st.landed);   // the tally is the count's: none before 36 s
      drawCounters(t, s, K, A2, st);
      if (t >= 36) drawCount(t, s, K);
    }
    if (t >= 7 && t < 16.5) K.commitBox(t, s, { title: F.commit.title, prompt: 'PATHS FOR 10 PEOPLE', out: 16 });
    drawCommitPrompt(t, s, K);
    drawLedger(t, K);
    drawGrid(t, K);
    drawMonday(t, K);
  },
  tryit(v, s, K) {
    const n = Math.round(v.n), pairs = n * (n - 1) / 2, d = 2 * n, pd = d * (d - 1) / 2;
    return `<div class="ex">THE COUNT</div><div class="big">${n} PEOPLE · ${K.fmtK(pairs)} PATHS</div>` +
      `<div class="ex">Double to ${d}: ${K.fmtK(pd)} paths (${pairs ? (pd / pairs).toFixed(1) : '—'}× as many)</div>` +
      (typeof s.answer === 'number' ? `<p>You sealed ${s.answer} paths for 10 people; the count is 45.</p>` : '');
  },
};
})();
