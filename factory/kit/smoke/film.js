/* kit smoke film: 20 s that touch every kit helper. */
(function () {
'use strict';
const F = window.FILM;
let ORDER = null;   // arrival order of the 100 marks (seeded shuffle, computed once in setup)

window.FILM_RENDER = {
  setup(p, K) {
    ORDER = K.shuffle([...Array(F.count.n).keys()], 11);
    // mulberry32 directly, to prove it is exported
    const r = K.mulberry32(5); K.__smokeDraw = r();
  },
  render(t, s, K) {
    const { tx, ln, rc, dim, stamp, seg, ease, eout, lerp, typed, fmtK, C } = K;
    const ch = K.chapterAt(t), cd = K.cardAt(t);
    const sealed = t >= F.commit.at + 4.5;
    K.chrome(t, ch, {
      ledger: { title: 'REVISIONS', rows: F.ledger, hl: t >= 12.4 ? 2 : null },
      block: { title: 'KIT SMOKE', lines: ['SHEET 1 · 20 S', 'ISSUED FOR TEST'], open: 0.4, slotLabel: 'SEAL', slot: sealed ? 'SEALED' : null },
    });
    const B = K.LAYOUT.content;

    // HOOK: a plan bar with a dimension line, a pencil stroke
    if (t < 12) {
      const u = ease(seg(t, 0.8, 2.2)), x0 = B.x0 + 20, x1 = lerp(x0, x0 + 480, u);
      rc('plan', 'marks', x0, 200, x1 - x0, 28, { fill: C.ink, op: 0.9 });
      tx('plan.l', 'labels', x0, 186, 'THE PLAN', { size: 14, weight: 500, ls: '0.1em' });
      dim('pd', 'labels', x0, x0 + 480, 262, '12 MO', seg(t, 2.0, 2.6), { size: 16 });
      tx('hook.h', 'labels', x0, 330, typed('Everyone signed it.', t, 2.6, 22), { fam: 'disp', size: 40 });
      K.pencil(x0, 244, x0 + 480, 244, seg(t, 3.0, 4.2), 3);
    }
    // COMMIT
    if (t >= 4 && t < 12) K.commitBox(t, s, { title: F.commit.title, prompt: F.commit.unit.toUpperCase() });
    // CARD + roll after it
    if (cd) K.card(t, cd);
    K.roll(t, 0, 1.0);
    K.roll(t, 11.6, 0.5);

    // COUNT: 10 × 10 marks; red ones counted in seeded arrival order, counts before the ratio
    if (t >= 11.6) {
      const n = F.count.n, red = s.tryOn && s.try ? s.try.red : F.count.red;
      const cell = 26, gx = B.x0 + 10, gy = B.y0 + 14;
      const k = Math.round(red * seg(t, 12.6, 15.0));
      const ctx = K.ctx;
      // the marks are mass: canvas
      const isRed = new Set(ORDER.slice(0, red)), shown = new Set(ORDER.slice(0, k));
      for (let i = 0; i < n; i++) {
        const cx = gx + (i % 10) * cell, cy = gy + Math.floor(i / 10) * cell;
        ctx.fillStyle = shown.has(i) && isRed.has(i) ? K.rgba('accent', 0.92) : K.rgba('ink', 0.78);
        ctx.fillRect(cx, cy, cell - 6, cell - 6);
      }
      tx('ct.n', 'labels', gx + 290, gy + 60, fmtK(k), { fam: 'disp', size: 72, fill: C.accent });
      tx('ct.of', 'labels', gx + 290, gy + 88, 'RED OF ' + fmtK(n) + ' MARKS', { size: 16, weight: 500, ls: '0.08em' });
      const ru = seg(t, 15.2, 15.7);
      if (ru > 0) {
        tx('ct.r', 'labels', gx + 290, gy + 140, `${red} ÷ ${n}`, { fam: 'disp', size: 40, op: ru });
        tx('ct.z', 'labels', gx + 290, gy + 164, 'z = ' + K.PhiInv(red / n).toFixed(2).replace('-', '−'), { size: 16, op: ru });
      }
      // the sealed answer, placed against the truth
      if (K.answered(s)) {
        const a = seg(t, 15.8, 16.3);
        tx('ct.you', 'labels', gx + 290, gy + 214, `YOU SAID ${s.answer}`, { size: 28, weight: 500, op: a });
      }
      stamp('ct.st', 'marks', gx + 480, gy + 36, 0.7, 'COUNTED', { op: seg(t, 15.0, 15.2), rim: C.accent });
      ln('ct.u', 'marks', gx, gy + 10 * cell + 4, gx + 10 * cell - 6, gy + 10 * cell + 4, { stroke: C.accent, w: 1.5, op: eout(seg(t, 12.0, 12.6)) });
    }
  },
  tryit(v, s, K) {
    const red = v.red, z = K.PhiInv(Math.min(0.999, Math.max(0.001, red / 100)));
    return `<div class="ex">THE COUNT</div><div class="big">${red} OF 100</div><div class="ex">${red} ÷ 100 · z = ${z.toFixed(2)}</div>` +
      (typeof s.answer === 'number' ? `<p>You sealed ${s.answer}.</p>` : '');
  },
};
})();
