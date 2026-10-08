/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · SEDIMENT — the delta survey sheet (Living Systems).
   Kernel: chromes/delta/delta.kit.js (vendored verbatim): heightfield terrain → hypsometric tint × hillshade with
   marching-squares contours (DK.terrain), sprite-batched sediment bodies (rim, body, three grain tones; DK.sediment),
   cartographic lettering with knock-out halos, a CPU surface blitted once. Credit: C · Sediment Delta team.
   The adapter adds the kernel's deposition rule at screen scale: a failed grain settles on the bank at its weir and
   stacks; a grain entering an occupied cell rolls to a lower neighbour (angle of repose), sequential in item order,
   so the pile is prefix-consistent and the frame stays a pure function of t.
   Mark rule: a grain = one run, carried down its own runnel; a weir = one step; a failed run settles on the bank at
   the weir where it failed (the address) and the bank's piles trace the survival curve; a braid round a weir = a
   check (sage); grains that reach the mouth build the delta (copper).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const DKk = () => (typeof DK !== 'undefined' ? DK : root.DK);   // the kernel declares a script-level const
  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  const ROLE = { title: ['serif', 600, 32, false], head: ['serif', 600, 25, false], text: ['caps', 500, 16, false], num: ['mono', 500, 16, false], note: ['caps', 400, 12, false], sketch: ['serif', 600, 18, false] };
  const M = AM.material({
    id: 'sediment', title: 'Sediment — the delta survey sheet', source: ['chromes/delta/delta.kit.js', 'chromes/delta/NOTES.md'],
    markRule: { unit: 'one grain carried down its own runnel = one run', step: 'one weir = one step', address: 'the grain settles on the bank at the weir where it failed', save: 'a sage braid round the weir', cost: 'a sage grain per weir crossed twice' },
    nouns: { unit: 'runnel', units: 'runnels', step: 'weir', steps: 'weirs', edge: 'bank of settled grains', check: 'braid' },
    axis: 'x', cell: { along: 1, across: 0.16, maxAcross: 16 }, nRange: [1, 4000], ground: '#3A2D21',
    // rows [family, file, weight, style?] declare what the file IS (vendor/fonts.lock.json). The 600 Plex Sans Condensed
    // file still stands in for the 500 the kit asks for: vendor ibm-plex-sans-condensed-latin-500-normal and fix the row.
    fonts: [['Cormorant Garamond', 'cormorant-garamond-latin-500-italic.woff2', 500, 'italic'], ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed-latin-400-normal.woff2', 400], ['IBM Plex Sans Condensed', 'ibm-plex-sans-condensed-latin-600-normal.woff2', 500], ['IBM Plex Mono', 'ibm-plex-mono-latin-400-normal.woff2', 400]],
    setup() {},
    begin(p, ctx, t, cam) {
      const DK = DKk(), k = AM.renderScale(ctx), cpu = DK.cpu(k), c = cpu.c;
      const T = DK.terrain('am-sediment', 960, 540, { seed: 7, rivers: [], coast: () => 1400 });
      c.drawImage(T, 0, 0, 960, 540); c.fillStyle = 'rgba(20,14,9,0.28)'; c.fillRect(0, 0, 960, 540);   // a darker survey wash so marks carry
      return { cpu, c, k, cam, q: [], t };
    },
    units(S, items) {
      const DK = DKk(), c = S.c, P = DK.PAL, piles = new Map(), peach = [], copper = [], moving = [];
      c.save(); c.lineCap = 'round';
      for (const it of items) {
        const [sx, sy, sw, sh] = AM.cam.rect(S.cam, it.x, it.y, it.w, it.h); if (sy > 545 || sy + sh < -5) continue;
        const yc = sy + sh / 2, f = it.failAt, reach = f >= 0 ? (f + 0.5) / it.k : Math.min(1, it.done / it.k), xe = sx + sw * reach;
        c.globalAlpha = it.alpha * (sh < 1.5 ? 0.55 : 0.85); c.strokeStyle = sh < 1.5 ? P.waterDeep : P.water; c.lineWidth = Math.max(0.5, Math.min(sh * 0.55, 6));
        c.beginPath(); c.moveTo(sx, yc); c.lineTo(xe, yc); c.stroke();
        for (const j of it.caught) { const xb = sx + sw * (j + 0.5) / it.k, rr = Math.max(1.6, Math.min(sw / it.k * 0.45, 9)); c.strokeStyle = P.sageLine; c.lineWidth = 1; c.beginPath(); c.ellipse(xb, yc, rr, Math.max(1, sh * 0.42), 0, 0, 6.2832); c.stroke(); }
        const gr = Math.max(0.7, Math.min(sh * 0.42, 5));
        if (f >= 0) {   // settle on the bank at the weir; roll to a lower neighbour cell while the cell is full (angle of repose)
          const cw = Math.max(1.4, gr * 1.6); let cx = Math.round(xe / cw), key = cx + '|' + Math.round(yc / (gr * 2.4)), h = piles.get(key) || 0;
          for (const d of [-1, 1]) { const k2 = (cx + d) + '|' + Math.round(yc / (gr * 2.4)), h2 = piles.get(k2) || 0; if (h2 < h - 1) { cx += d; key = k2; h = h2; break; } }
          piles.set(key, h + 1);
          peach.push({ x: cx * cw, y: yc - h * gr * 0.9, layer: h > 0 ? 1 : 0, tone: (it.r * 0.618) % 1, r: gr });
        } else if (it.done >= it.k - 1e-6) copper.push({ x: xe + gr, y: yc, layer: 0, tone: (it.r * 0.618) % 1, r: gr });
        else if (it.done > 0) moving.push({ x: xe, y: yc, layer: 1, tone: 0.5, r: gr });
      }
      c.globalAlpha = 1;
      const byR = (list, tone) => { const groups = new Map(); for (const q of list) { const rk = Math.round(q.r * 4) / 4; (groups.get(rk) || groups.set(rk, []).get(rk)).push(q); } for (const [r, pts] of groups) DK.sediment(c, pts, tone, { r: r * 0.62, grainR: 1 }); };
      byR(peach, DK.TONES.peach); byR(copper, DK.TONES.copper); byR(moving, DK.TONES.copper);
      c.restore();
    },
    anchor(rect, j, k) { return AM.stepPoint(rect, 'x', j, k); },
    mark(S, kind, x, y, o = {}) {
      S.q.push(c => {
        const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, P = DKk().PAL, r = o.r || 7; if (a <= 0.003) return; c.globalAlpha = a;
        if (kind === 'address') { c.strokeStyle = P.peachHi; c.lineWidth = 1.6; c.beginPath(); c.arc(X, Y, r, 0, 6.2832); c.stroke(); }
        else if (kind === 'save') { c.strokeStyle = P.sageLine; c.lineWidth = 2; c.beginPath(); c.ellipse(X, Y, r * 1.2, r * 0.6, 0, 0, 6.2832); c.stroke(); }
        else if (kind === 'cost') { c.fillStyle = P.sage; c.beginPath(); c.arc(X, Y - 1.5, o.r || 1.2, 0, 6.2832); c.fill(); }
        else if (kind === 'guess') { c.strokeStyle = P.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(X, Y + 8); c.lineTo(X, Y - 12); c.stroke(); c.fillStyle = P.ink; c.beginPath(); c.moveTo(X, Y - 12); c.lineTo(X + 9, Y - 8); c.lineTo(X, Y - 4); c.fill(); }   // a survey stake
        else if (kind === 'truth' || kind === 'expected' || kind === 'realised') { c.fillStyle = kind === 'realised' ? P.ink : P.copper; const d = o.dir || 1; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + d * 9, Y - 5); c.lineTo(X + d * 9, Y + 5); c.closePath(); c.fill(); }
        else if (kind === 'tick') { c.fillStyle = P.ink; c.beginPath(); c.arc(X, Y, 2.4, 0, 6.2832); c.fill(); }
      });
    },
    line(S, pts, role, o = {}) {
      S.q.push(c => {
        const Q = pts.map(tf(S, o)), a = o.alpha ?? 1, P = DKk().PAL; if (a <= 0.003 || Q.length < 2) return; c.globalAlpha = a;
        const dash = role === 'exact' ? [6, 4] : role === 'ghost' ? [2, 3] : [];
        DKk().polyline(c, Q, role === 'exact' ? P.copper : role === 'rule' ? P.weir : role === 'guess' ? P.ink : role === 'gap' ? P.peachHi : role === 'ghost' ? P.faint : P.dim, role === 'rule' ? 1.4 : role === 'gap' ? 2.6 : role === 'exact' ? 1.8 : 1, dash);
      });
    },
    area(S, top, bot, role, o = {}) { S.q.push(c => { const T = tf(S, o); c.globalAlpha = (o.alpha ?? 1) * 0.3; c.fillStyle = DKk().PAL.copper; c.beginPath(); top.forEach((q, i) => { const P = T(q); i ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); }); for (let i = bot.length - 1; i >= 0; i--) { const P = T(bot[i]); c.lineTo(P[0], P[1]); } c.closePath(); c.fill(); }); },
    text(S, str, x, y, o = {}) { S.q.push(c => set(c, S, str, x, y, o)); },
    num(S, n, x, y, o = {}) { S.q.push(c => set(c, S, o.str, x, y, Object.assign({ role: 'num' }, o))); },
    end(p, S) { const c = S.c; for (const f of S.q) { c.save(); f(c); c.restore(); } p.drawingContext.drawImage(S.cpu.cv, 0, 0, 960, 540); },
    voice: { step: { kind: 'tick', freq: 1500, gain: 0.25 }, fail: { kind: 'clack', freq: 120, gain: 0.45 }, save: { kind: 'click', freq: 1100, gain: 0.45 },
      reveal: { kind: 'tone', freq: 220, gain: 0.5, dur: 1.4 }, commit: { kind: 'click', freq: 660, gain: 0.4 }, cost: { kind: 'tick', freq: 1200, gain: 0.25 } },
  });
  function set(c, S, str, x, y, o) {
    if (!str) return; const DK = DKk(), role = o.role || 'text', [f, w, s, it] = ROLE[role] || ROLE.text, [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1; if (a <= 0.003) return;
    DK.font(c, f, o.size || s, o.weight || w, it); DK.txt(c, str, X, Y, o.align || 'left', o.color ? (DK.PAL[o.color] || o.color) : role === 'note' ? DK.PAL.dim : role === 'sketch' ? DK.PAL.copper : DK.PAL.ink, a, 'rgba(20,13,8,0.6)');
  }
})(typeof window !== 'undefined' ? window : globalThis);
