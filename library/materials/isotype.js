/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · ISOTYPE — the ledger in motion (Boardroom).
   Kernel: archive/chromes/ledger/ledger.kit.js (vendored verbatim): Arntz-grade pixel-grid pictograms (tear-off slip, item
   rules, the total's double rule, struck-through void, dog-ear = a checker looked, hourglass) drawn once into a
   density-matched atlas; Hungarian (min-sum Euclidean, crossing-free) assignment; ledger typography with tabular
   figures. Credit: D · The Ledger team (ledger/NOTES.md).
   Mark rule: one slip = one job (one run); the ruled line it travels along = its turns (steps); a symbol is one fixed
   quantity and is NEVER scaled by value (all slips in a film share one size); a failed job stops whole on its turn's
   line, struck through in peach (the address); a dog-ear = the check looked and the job was re-done; a clean job
   ends sage; review time = slate hourglasses.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const LGk = () => root.LG;
  const ROLE = { title: ['Newsreader', 600, 30], head: ['Newsreader', 600, 23], text: ['Newsreader', 400, 17], num: ['Newsreader', 600, 18], note: ['IBM Plex Sans Condensed', 400, 12], sketch: ['IBM Plex Sans Condensed', 400, 15] };
  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  function ground(k) {
    const o = AM.canvas('iso-ground', k); if (o.cv.__built) return o;
    const c = o.c, P = LGk().PAL; c.setTransform(k, 0, 0, k, 0, 0); c.fillStyle = P.ground; c.fillRect(0, 0, 960, 540);
    for (let y = 30; y < 540; y += 18) { c.fillStyle = P.ruleLo; c.fillRect(0, y, 960, 1); }                 // the journal's ruling
    c.fillStyle = 'rgba(216,139,92,0.22)'; c.fillRect(44, 0, 1, 540); c.fillRect(47, 0, 1, 540);           // the margin's double rule
    o.cv.__built = true; return o;
  }
  const M = AM.material({
    id: 'isotype', title: 'Isotype — the ledger in motion', source: ['archive/chromes/ledger/ledger.kit.js', 'archive/chromes/ledger/NOTES.md'],
    markRule: { unit: 'one job slip = one run', step: 'one turn along its ruled line', address: 'the slip stops whole on its turn, struck through in peach', save: 'a dog-ear: a checker looked and the job was redone', cost: 'a slate hourglass per redone turn' },
    nouns: { unit: 'job slip', units: 'job slips', step: 'turn', steps: 'turns', edge: 'right-hand edge of the slips', check: 'review' },
    axis: 'x', cell: { along: 1.25, across: 1, maxAcross: 30 }, nRange: [1, 120], ground: '#171B23',
    fonts: [['Newsreader', 'newsreader-latin-400-normal.woff2', 400], ['Newsreader', 'newsreader-latin-600-normal.woff2', 600], ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed-latin-400-normal.woff2', 400], ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed-latin-600-normal.woff2', 600]],
    setup() {},
    begin(p, ctx, t, cam) {
      const k = AM.renderScale(ctx), F = AM.canvas('iso-frame', k), c = F.c, A = LGk().atlas(p, ctx, 2);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.drawImage(ground(k).cv, 0, 0); c.setTransform(k, 0, 0, k, 0, 0);
      return { F, c, k, cam, A, t };
    },
    units(S, items) {
      const c = S.c, A = S.A, P = LGk().PAL;
      for (const it of items) {
        const [sx, sy, sw, sh] = AM.cam.rect(S.cam, it.x, it.y, it.w, it.h); if (sy > 545 || sy + sh < -5) continue;
        const h = Math.max(2.4, Math.min(40, sh * 0.9)), w = h * 0.75, cellW = h * (A.cw / 32), cellH = h * (A.ch / 32);
        if (sh >= 5) { c.globalAlpha = it.alpha * 0.5; c.fillStyle = P.rule; c.fillRect(sx, sy + sh - 1, sw, 1); }
        const failed = it.failAt >= 0, pos = failed ? it.failAt + 0.5 : it.done, x = sx + sw * Math.min(pos, it.k) / it.k - (it.done >= it.k && !failed ? w : w * 0.5);
        // the ruled line the job has travelled (its turns so far): ink to the slip, so the rows' right ends trace the curve
        c.globalAlpha = it.alpha * 0.9; c.fillStyle = failed ? P.peach : it.done >= it.k - 1e-6 ? P.sage : P.copper;
        c.fillRect(sx, sy + sh / 2 - Math.max(0.5, sh * 0.08), Math.max(0, x - sx), Math.max(1, sh * 0.16));
        for (const j of it.caught) { c.fillStyle = P.sage; c.fillRect(sx + sw * (j + 0.5) / it.k - 0.75, sy + sh * 0.2, 1.5, sh * 0.6); }
        const ear = it.caught.length > 0, name = failed ? 'job.fail' : it.done >= it.k - 1e-6 ? (ear ? 'job.clean.ear' : 'job.clean') : ear ? 'job.ear' : 'job';
        const i = A.idx[name]; c.globalAlpha = it.alpha;
        c.drawImage(A.el, i * A.cw * A.d, 0, A.cw * A.d, A.ch * A.d, x, sy + (sh - h) / 2, cellW, cellH);
      }
      c.globalAlpha = 1;
    },
    anchor(rect, j, k) { return AM.stepPoint(rect, 'x', j, k); },
    mark(S, kind, x, y, o = {}) {
      const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, c = S.c, P = LGk().PAL, r = o.r || 7; if (a <= 0.003) return;
      c.save(); c.globalAlpha = a;
      if (kind === 'address') { c.strokeStyle = P.peach; c.lineWidth = 1.5; c.strokeRect(X - r, Y - r * 1.2, r * 2, r * 2.4); }
      else if (kind === 'save') { c.fillStyle = P.sage; c.beginPath(); c.moveTo(X - r * 0.6, Y - r); c.lineTo(X + r * 0.6, Y - r); c.lineTo(X + r * 0.6, Y + r * 0.2); c.closePath(); c.fill(); }
      else if (kind === 'cost') { const A = S.A, i = A.idx['hr.review'], s = o.r ? o.r * 3 : 5; c.drawImage(A.el, i * A.cw * A.d, 0, A.cw * A.d, A.ch * A.d, X - s / 2, Y - s * 0.62, s, s * 1.25); }
      else if (kind === 'guess') { c.strokeStyle = '#B9B4A8'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X, Y - 12); c.lineTo(X, Y + 12); c.stroke(); c.beginPath(); c.moveTo(X - 5, Y - 12); c.lineTo(X + 5, Y - 12); c.stroke(); }
      else if (kind === 'truth' || kind === 'expected' || kind === 'realised') { c.fillStyle = kind === 'realised' ? P.ink : P.copper; const d = o.dir || 1; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + d * 9, Y - 5); c.lineTo(X + d * 9, Y + 5); c.closePath(); c.fill(); }
      else if (kind === 'tick') { c.strokeStyle = '#B9B4A8'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X - 1, Y - 7); c.lineTo(X + 1, Y + 7); c.stroke(); }
      c.restore();
    },
    line(S, pts, role, o = {}) {
      const Q = pts.map(tf(S, o)), a = o.alpha ?? 1, c = S.c, P = LGk().PAL; if (a <= 0.003 || Q.length < 2) return;
      const path = (dx = 0, dy = 0) => { c.beginPath(); Q.forEach((q, i) => (i ? c.lineTo(q[0] + dx, q[1] + dy) : c.moveTo(q[0] + dx, q[1] + dy))); };
      c.save(); c.globalAlpha = a;
      if (role === 'rule') { const v = Math.abs(Q[1][0] - Q[0][0]) < Math.abs(Q[1][1] - Q[0][1]); c.strokeStyle = P.ink; c.lineWidth = 1; path(); c.stroke(); path(v ? 3 : 0, v ? 0 : 3); c.stroke(); }   // the accountant's double rule
      else if (role === 'exact') { c.strokeStyle = P.copper; c.lineWidth = 1.4; c.setLineDash([6, 4]); path(); c.stroke(); }
      else if (role === 'guess') { c.strokeStyle = '#B9B4A8'; c.lineWidth = 1.6; path(); c.stroke(); }
      else if (role === 'gap') { c.strokeStyle = P.peach; c.lineWidth = 2.4; path(); c.stroke(); }
      else if (role === 'ghost') { c.strokeStyle = P.dim; c.lineWidth = 1; c.setLineDash([2, 3]); path(); c.stroke(); }
      else { c.strokeStyle = P.dim; c.lineWidth = 0.8; path(); c.stroke(); }
      c.restore();
    },
    area(S, top, bot, role, o = {}) { const T = tf(S, o), c = S.c; c.save(); c.globalAlpha = (o.alpha ?? 1) * 0.25; c.fillStyle = LGk().PAL.copper; c.beginPath(); top.forEach((q, i) => { const P = T(q); i ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); }); for (let i = bot.length - 1; i >= 0; i--) { const P = T(bot[i]); c.lineTo(P[0], P[1]); } c.closePath(); c.fill(); c.restore(); },
    text(S, str, x, y, o = {}) { set(S, str, x, y, o); },
    num(S, n, x, y, o = {}) { set(S, o.str, x, y, Object.assign({ role: 'num' }, o)); },
    end(p, S) { p.drawingContext.drawImage(S.F.cv, 0, 0, 960, 540); },
    voice: { step: { kind: 'tick', freq: 3000, gain: 0.35 }, fail: { kind: 'clack', freq: 200, gain: 0.5 }, save: { kind: 'click', freq: 1600, gain: 0.5 },
      reveal: { kind: 'tone', freq: 440, gain: 0.4, dur: 0.8 }, commit: { kind: 'click', freq: 1000, gain: 0.4 }, cost: { kind: 'tick', freq: 2000, gain: 0.3 } },
  });
  function set(S, str, x, y, o) {
    if (!str) return; const role = o.role || 'text', [f, w, s] = ROLE[role] || ROLE.text, P = LGk().PAL, [X, Y] = tf(S, o)([x, y]);
    const col = o.color ? (P[o.color] || o.color) : role === 'note' ? P.dim : role === 'sketch' ? P.copper : P.ink;
    LGk().text(S.c, str, X, Y, { f, w: o.weight || w, size: o.size || s, align: o.align || 'left', color: col, alpha: o.alpha ?? 1, ls: role === 'note' ? 0.3 : 0 });
  }
})(typeof window !== 'undefined' ? window : globalThis);
