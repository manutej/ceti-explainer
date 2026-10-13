/* goodhart · "Eight Is Great" · Goodhart's law as a count of 1,000 accounts.
   One clock: render(t, s, K) is a pure function of t and s.answer. Seed rule: the 21 red marks are
   the first 21 of K.shuffle([0..999], grid.seed = 2017); nothing else is random. */
(function () {
'use strict';
const F = window.FILM, G = F.grid, P = F.params;
const N = G.cols * G.rows, NRED = G.flagged;
let FL = null, RED = null, DEST = null, STAG = null;   // flagged reveal order, red set, gather destination, stagger

const pos = (i) => [G.x0 + (i % G.cols) * G.pitch, G.y0 + Math.floor(i / G.cols) * G.pitch];

window.FILM_RENDER = {
  setup(p, K) {
    FL = K.shuffle([...Array(N).keys()], G.seed).slice(0, NRED);         // reveal order
    RED = new Set(FL);
    const R = FL.slice().sort((a, b) => a - b);                           // red squares, ascending
    const D = [], V = [];
    for (let i = 0; i < NRED; i++) if (!RED.has(i)) D.push(i);            // ink squares displaced from slots 0..20
    for (const i of R) if (i >= NRED) V.push(i);                          // slots vacated by red squares
    DEST = new Int32Array(N); STAG = new Float32Array(N);
    for (let i = 0; i < N; i++) DEST[i] = i;
    R.forEach((i, j) => { DEST[i] = j; STAG[i] = 0.02 * j; });
    D.forEach((i, m) => { DEST[i] = V[m]; STAG[i] = 0.02 * m; });
  },

  render(t, s, K) {
    const { tx, ln, rc, path, stamp, seg, ease, eout, lerp, typed, C } = K;
    const role = (el, r) => { if (el) el.setAttribute('data-role', r); return el; };
    const T = (key, x, y, str, o, r) => role(tx(key, 'labels', x, y, str, o), r || ((o && o.size) >= 28 ? 'must-read' : 'secondary'));
    const A = F.commit.at, SEAL = A + 4.5;
    // stamps live in the marks layer: class them as secondary for the legibility gate (idempotent)
    const mk = K.svg && K.svg.querySelector('g[data-layer=marks]');
    if (mk && mk.getAttribute('data-role') !== 'secondary') mk.setAttribute('data-role', 'secondary');
    const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    K.chrome(t, null, {
      ledger: { title: 'CASE LOG', rows: F.ledger, hl: t >= 62.4 ? 4 : t >= 36.2 ? 3 : t >= 16.5 ? 2 : null },
      block: { title: 'GOODHART', lines: ['WHEN A MEASURE', 'BECOMES A TARGET'], open: 0.4, slotLabel: 'GUESS', slot: t >= SEAL ? (s.answer === 'none' ? 'NONE' : 'SEALED') : null },
    });
    K.roll(t, 0, 1.0);

    /* ── S1 · the household row (HOOK 0–8, faint during COMMIT, CASE 16–25.4) ── */
    const SW = 52, SP = 64, RX = 56;
    const rowOn = t < 8.6 || (t >= 16 && t < 25.8);
    if (rowOn) {
      const caseRow = t >= 16;
      const op = caseRow ? seg(t, 16.0, 16.5) * (1 - seg(t, 25.2, 25.8)) : (1 - seg(t, 8.0, 8.6));
      const RY = caseRow ? 150 : 160;
      T('hr.l', RX, RY - 16, caseRow ? 'PRODUCTS PER HOUSEHOLD · WELLS FARGO' : 'PRODUCTS PER CUSTOMER · YOUR TEAM', { size: 14, weight: 500, ls: '0.08em', op });
      let fill;
      if (!caseRow) fill = 8 * ease(seg(t, 0.8, 4.4));
      else fill = P.crossSellFeb2015 * ease(seg(t, 20.6, 22.6));
      for (let k = 0; k < 8; k++) {
        const x = RX + k * SP, f = Math.max(0, Math.min(1, fill - k));
        rc('hr.s' + k, 'marks', x, RY, SW, SW, { stroke: C.ink, w: 1.4, op, dash: caseRow && k === 7 ? '4 3' : null });
        if (f > 0) rc('hr.f' + k, 'marks', x, RY, SW * f, SW, { fill: C.ink, op: op * 0.92 });
      }
      if (!caseRow) {
        const u = seg(t, 4.4, 4.8);
        if (u > 0) {
          T('hr.c', RX, RY + 118, '8 OF 8', { fam: 'disp', size: 56, op: u * op });
          stamp('hr.st', 'marks', RX + 330, RY + 98, 1, 'ON TARGET', { op: seg(t, 5.0, 5.2) * op, rim: C.ink });
        }
      } else {
        T('hr.tg', RX + 7 * SP + SW, RY + SW + 34, 'TARGET 8', { size: 28, weight: 500, anchor: 'end', op: op * seg(t, 16.6, 17.2) });
        const u = seg(t, 22.4, 22.9) * op;
        if (u > 0) {
          T('hr.v', RX, RY + SW + 92, '6.13', { fam: 'disp', size: 64, op: u });
          T('hr.vl', RX + 120, RY + SW + 70, 'AVERAGE · FEB 2015', { size: 14, weight: 500, ls: '0.08em', op: u });
          T('hr.vq', RX + 120, RY + SW + 92, 'ONE IN FOUR HOUSEHOLDS HAD 8+', { size: 14, ls: '0.06em', op: seg(t, 23.0, 23.4) * op });
        }
      }
    }

    /* ── S2 · the commit (8–16) ── */
    if (t >= 8 && t < 17) {
      const qo = seg(t, 8.6, 9.2) * (1 - seg(t, 15.8, 16.3));
      const Q = ['Of every 1,000 accounts', 'opened, how many did', 'customers never authorise?'];
      Q.forEach((q, i) => T('cq.' + i, RX, 196 + i * 50, q, { fam: 'disp', size: 42, op: qo }, 'must-read'));
      K.commitBox(t, s, { title: F.commit.title, prompt: 'OF 1,000 ACCOUNTS', out: 15.9 });
    }

    /* ── S1 ledger · the case in numbers (25.4–36) ── */
    if (t >= 25.4 && t < 36.2) {
      const lo = 1 - seg(t, 35.6, 36.1);
      const L = [
        [25.6, '2016', '2.1 M accounts flagged'],
        [26.6, '', '5,300 staff fired'],
        [27.6, '', '$185 M in fines'],
        [30.8, '2017', '3.5 M after full review'],
        [32.8, '2020', '$3 B to settle'],
      ];
      L.forEach(([t0, y, txt], i) => {
        const yy = 150 + i * 48;
        if (t < t0) return;
        if (y) T('lg.y' + i, RX, yy, y, { fam: 'disp', size: 34, op: lo * seg(t, t0, t0 + 0.3), fill: C.muted }, 'must-read');
        T('lg.t' + i, RX + 100, yy, typed(txt, t, t0, 40), { size: 28, weight: 500, op: lo }, 'must-read');
        if (i === 0 || i === 3 || i === 4) ln('lg.r' + i, 'marks', RX, yy - 36, RX + 560, yy - 36, { op: 0.25 * lo });
      });
    }

    /* ── S3 · the 1,000-mark grid (36–62, faint under MONDAY) ── */
    if (t >= 36) {
      const ctx = K.ctx, gOp = 1 - 0.9 * seg(t, 62.0, 62.6);
      const dim = 1 - 0.65 * seg(t, 57.0, 58.0);                  // ink marks dim in the floor phase
      for (let i = 0; i < N; i++) {
        const r = Math.floor(i / G.cols), tr = 36.0 + 0.16 * r;
        const a = seg(t, tr, tr + 0.12);
        if (a <= 0) continue;
        let [x, y] = pos(i);
        if (t >= 48.6) {
          const d = DEST[i];
          if (d !== i) {
            const u = ease(seg(t, 48.6 + STAG[i], 48.6 + STAG[i] + 1.6));
            const [x2, y2] = pos(d); x = lerp(x, x2, u); y = lerp(y, y2, u);
          }
        }
        const k = RED.has(i) ? FL.indexOf(i) : -1;
        const red = k >= 0 && t >= 44.0 + 0.2 * k;
        let sz = G.size;
        if (red) { const pu = seg(t, 44.0 + 0.2 * k, 44.1 + 0.2 * k); sz = G.size * (1 + 0.3 * Math.sin(Math.PI * pu)); }
        ctx.fillStyle = red ? K.rgba('accent', a * gOp) : K.rgba('ink', 0.86 * a * gOp * dim);
        ctx.fillRect(x + (G.size - sz) / 2, y + (G.size - sz) / 2, sz, sz);
      }
      const CX = 482, cO = 1 - seg(t, 62.0, 62.6);
      if (cO > 0) {
        // the metric's scan
        const su = seg(t, 40.2, 42.2);
        if (su > 0 && su < 1) ln('gr.scan', 'marks', G.x0 - 6, G.y0 - 3 + 254 * ease(su), G.x0 + 397 + 6, G.y0 - 3 + 254 * ease(su), { stroke: C.muted, w: 1 });
        const rows = Math.min(G.rows, Math.max(0, Math.floor((t - 36.0) / 0.16) + 1));
        T('gr.ol', CX, 132, t >= 42.2 ? 'COUNTED AS SOLD' : 'ACCOUNTS OPENED', { size: 14, weight: 500, ls: '0.08em', op: cO });
        T('gr.ov', CX, 172, fmt(rows * G.cols), { fam: 'disp', size: 40, op: cO }, 'must-read');
        if (t >= 44.0) {
          const nr = Math.min(NRED, Math.floor((t - 44.0) / 0.2) + 1);
          T('gr.fl', CX, 204, 'FLAGGED BY REVIEW', { size: 14, weight: 500, ls: '0.08em', op: cO, fill: C.accent });
          T('gr.fv', CX, 244, fmt(nr), { fam: 'disp', size: 40, op: cO, fill: C.accent }, 'must-read');
        }
        if (t >= 51.0) {
          const go = seg(t, 51.0, 51.5) * cO;
          T('gr.gl', CX, 276, 'YOUR GUESS', { size: 14, weight: 500, ls: '0.08em', op: go, fill: C.muted });
          const g = K.answered(s) ? Math.max(0, Math.min(N, Math.round(s.answer))) : null;
          T('gr.gv', CX, 316, g == null ? 'NONE' : fmt(g), { fam: 'disp', size: 40, op: go, fill: C.muted }, 'must-read');
          if (g != null && g > 0) {
            const o = 2, p = G.pitch, sq = G.size, full = Math.floor(g / G.cols), rem = g % G.cols;
            const x0 = G.x0 - o, top = G.y0 - o, xR = G.x0 + (G.cols - 1) * p + sq + o;
            let d;
            if (full === 0) d = `M${x0} ${top}H${G.x0 + (rem - 1) * p + sq + o}V${G.y0 + sq + o}H${x0}Z`;
            else if (rem === 0) d = `M${x0} ${top}H${xR}V${G.y0 + (full - 1) * p + sq + o}H${x0}Z`;
            else d = `M${x0} ${top}H${xR}V${G.y0 + (full - 1) * p + sq + o}H${G.x0 + (rem - 1) * p + sq + o}V${G.y0 + full * p + sq + o}H${x0}Z`;
            path('gr.go', 'marks', d, { stroke: C.muted, w: 2, op: seg(t, 51.0, 52.6) * cO, cap: 'square' });
          }
        }
        const ru = seg(t, 54.0, 54.4) * cO;
        if (ru > 0) {
          T('gr.r1', CX, 352, '21 ÷ 1,000', { fam: 'disp', size: 34, op: ru }, 'must-read');
          T('gr.r2', CX, 388, '≈ 2 IN 100', { size: 28, weight: 500, op: ru }, 'must-read');
        }
        const fo = seg(t, 57.4, 57.9) * cO;
        if (fo > 0) T('gr.nt', G.x0, 392, 'UNUSED PRODUCTS: COUNTED, NOT FLAGGED', { size: 14, weight: 500, ls: '0.04em', op: fo });
      }
    }

    /* ── S4 · the Monday card (62–72) ── */
    if (t >= 62.2) {
      const mo = seg(t, 62.4, 63.0);
      T('mo.1', RX, 196, 'What could move this number', { fam: 'disp', size: 44, op: mo }, 'must-read');
      T('mo.2', RX, 248, 'with nothing real behind it?', { fam: 'disp', size: 44, op: mo }, 'must-read');
      T('mo.3', RX, 292, 'AND WHO WOULD NOTICE?', { size: 16, weight: 500, ls: '0.14em', op: seg(t, 63.4, 63.9), fill: C.accent });
    }
  },
};
})();
