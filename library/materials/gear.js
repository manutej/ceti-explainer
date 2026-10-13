/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · GEAR — the escapement plate (mechanism as cause), drawn as a 2D section plate.
   @kernel escapement-geometry.js
   Kernel: chromes/escapement/escapement.kit.js → materials/kernels/escapement-geometry.js (verbatim extract of the
   exact involute gear outline and mesh-phase rule; the WEBGL extrusion, Graham escapement solve and shaders stay in
   the direction). Credit: A · The Escapement team (escapement/NOTES.md).
   Mark rule: one involute RACK = one run; one tooth = one step (a rack is the involute of infinite radius, so its
   teeth are exact straight-flanked trapezoids at the 20° pressure angle); the rack advances tooth by tooth; a slip is
   a tooth cut short in peach — the rack stops there (the address); a check = a sage pawl that re-engaged the tooth.
   At macro scale a pinion (exact involute profile) rolls along the rack without slip: rack travel = r·θ.
   Plain machined parts in slate metal on dark glass; section hatching where material is cut. No brass, no rivets.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const G = () => (typeof ESCG !== 'undefined' ? ESCG : root.ESCG);
  const PAL = { ground: '#12161C', metal: '#6E8CA8', metalHi: '#B8C9D8', metalLo: '#33465A', hatch: 'rgba(184,201,216,0.35)', ink: '#E8EEF2', dim: '#8C9AA6', copper: '#D9A066', sage: '#94BF86', peach: '#E5865A' };
  const ROLE = { title: ['"DM Sans"', 600, 30], head: ['"DM Sans"', 500, 23], text: ['"DM Sans"', 400, 16], num: ['"Space Mono"', 400, 16], note: ['"Space Mono"', 400, 12], sketch: ['"DM Sans"', 500, 15] };
  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  const TAN20 = Math.tan(20 * Math.PI / 180);
  function ground(k) {
    const o = AM.canvas('gear-ground', k); if (o.cv.__built) return o;
    const c = o.c; c.setTransform(k, 0, 0, k, 0, 0);
    const g = c.createRadialGradient(480, 250, 60, 480, 270, 620); g.addColorStop(0, '#1A2028'); g.addColorStop(1, PAL.ground); c.fillStyle = g; c.fillRect(0, 0, 960, 540);
    c.strokeStyle = 'rgba(184,201,216,0.05)'; c.lineWidth = 1; for (let x = 0; x < 960; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 540); c.stroke(); }   // the plate's faint scribed grid
    o.cv.__built = true; return o;
  }
  /** a rack with n teeth over length L (pitch p = L/k), tooth height = 0.75 of the body; returns teeth polygons */
  function rackPath(c, x, y, pitch, h, nFull, partial, failAt) {
    const m = pitch / Math.PI, add = Math.min(h * 0.45, m), ded = add * 1.25, body = Math.max(1, h - add - ded * 0.2);
    c.beginPath(); c.rect(x, y + add, pitch * (nFull + partial), body);
    for (let j = 0; j < nFull + (partial > 0 ? 1 : 0); j++) {
      if (j === failAt) continue;
      const x0 = x + j * pitch, half = pitch * 0.25, tw = Math.max(0.2, half - add * TAN20), u = j < nFull ? 1 : partial;
      c.moveTo(x0 + pitch / 2 - half, y + add); c.lineTo(x0 + pitch / 2 - tw, y + add * (1 - u)); c.lineTo(x0 + pitch / 2 + tw, y + add * (1 - u)); c.lineTo(x0 + pitch / 2 + half, y + add); c.closePath();
    }
    return { add, body };
  }
  const M = AM.material({
    id: 'gear', title: 'Gear — the escapement plate', source: ['chromes/escapement/escapement.kit.js', 'chromes/escapement/NOTES.md'],
    markRule: { unit: 'one involute rack = one run', step: 'one tooth = one step', address: 'a tooth cut short in peach; the rack stops there', save: 'a sage pawl re-engaged the tooth', cost: 'a sage pawl mark per tooth cut twice' },
    nouns: { unit: 'rack', units: 'racks', step: 'tooth', steps: 'teeth', edge: 'stepped ends of the racks', check: 'pawl' },
    axis: 'x', cell: { along: 1, across: 0.55, maxAcross: 26 }, nRange: [1, 300], ground: PAL.ground, fonts: [],
    setup() {},
    begin(p, ctx, t, cam) { const k = AM.renderScale(ctx), F = AM.canvas('gear-frame', k), c = F.c; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.drawImage(ground(k).cv, 0, 0); c.setTransform(k, 0, 0, k, 0, 0); return { F, c, k, cam, t }; },
    units(S, items) {
      const c = S.c;
      for (const it of items) {
        const [sx, sy, sw, sh] = AM.cam.rect(S.cam, it.x, it.y, it.w, it.h); if (sy > 545 || sy + sh < -5) continue;
        const pitch = sw / it.k, f = it.failAt, nFull = f >= 0 ? f : Math.floor(it.done), partial = f >= 0 ? 0.5 : it.done - nFull;
        c.globalAlpha = it.alpha;
        if (sh < 2.2) { c.fillStyle = PAL.metal; c.fillRect(sx, sy, pitch * (nFull + partial), Math.max(0.6, sh * 0.8)); if (f >= 0) { c.fillStyle = PAL.peach; c.fillRect(sx + pitch * f, sy - 0.2, Math.max(1, pitch * 0.6), Math.max(0.9, sh)); } continue; }
        const gr = c.createLinearGradient(0, sy, 0, sy + sh); gr.addColorStop(0, PAL.metalHi); gr.addColorStop(0.35, PAL.metal); gr.addColorStop(1, PAL.metalLo);
        const { add, body } = rackPath(c, sx, sy, pitch, sh, nFull, partial, f); c.fillStyle = gr; c.fill('nonzero');
        if (sh >= 12) {   // section hatching on the cut face of the rack body
          c.save(); c.beginPath(); c.rect(sx, sy + add, pitch * (nFull + partial), body); c.clip(); c.strokeStyle = PAL.hatch; c.lineWidth = 0.7;
          for (let x = sx - body; x < sx + pitch * (nFull + partial); x += 4) { c.beginPath(); c.moveTo(x, sy + add + body); c.lineTo(x + body, sy + add); c.stroke(); } c.restore();
        }
        if (f >= 0) { c.fillStyle = PAL.peach; const x0 = sx + f * pitch; c.beginPath(); c.moveTo(x0 + pitch * 0.25, sy + add); c.lineTo(x0 + pitch * 0.4, sy + add * 0.55); c.lineTo(x0 + pitch * 0.6, sy + add * 0.55); c.lineTo(x0 + pitch * 0.75, sy + add); c.closePath(); c.fill(); c.fillRect(x0, sy + add, pitch * 0.5, body); }
        for (const j of it.caught) { const x0 = sx + (j + 0.5) * pitch; c.fillStyle = PAL.sage; c.beginPath(); c.moveTo(x0, sy - 1); c.lineTo(x0 - Math.min(5, pitch * 0.4), sy - Math.min(7, sh * 0.5)); c.lineTo(x0 + Math.min(5, pitch * 0.4), sy - Math.min(7, sh * 0.5)); c.closePath(); c.fill(); }
        if (sh >= 14 && it.emph === 'focus' && f < 0 && it.done > 0 && it.done < it.k) {   // the pinion rolling along the rack (rack travel = r·θ)
          const z = 12, m = pitch / Math.PI, g = G().involute(z, m, 20, 5), r = g.r, cx = sx + it.done * pitch, cy = sy - r + add * 0.1, th = -(it.done * pitch) / r;
          c.save(); c.translate(cx, cy); c.rotate(th); c.beginPath(); g.pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath();
          c.fillStyle = PAL.metal; c.fill(); c.strokeStyle = PAL.metalHi; c.lineWidth = 0.8; c.stroke(); c.beginPath(); c.arc(0, 0, r * 0.25, 0, 6.2832); c.fillStyle = PAL.ground; c.fill(); c.restore();
        }
      }
      c.globalAlpha = 1;
    },
    anchor(rect, j, k) { return [rect.x + rect.w * (j + 0.5) / k, rect.y + rect.h * 0.3]; },
    mark(S, kind, x, y, o = {}) {
      const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, c = S.c, r = o.r || 7; if (a <= 0.003) return;
      c.save(); c.globalAlpha = a;
      if (kind === 'address') { c.strokeStyle = PAL.peach; c.lineWidth = 1.6; c.beginPath(); c.arc(X, Y, r, 0, 6.2832); c.stroke(); }
      else if (kind === 'save' || kind === 'cost') { const s = kind === 'cost' ? 2.2 : r * 0.7; c.fillStyle = PAL.sage; c.beginPath(); c.moveTo(X, Y); c.lineTo(X - s, Y - s * 1.4); c.lineTo(X + s, Y - s * 1.4); c.closePath(); c.fill(); }
      else if (kind === 'guess') { c.strokeStyle = PAL.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(X - 7, Y - 7); c.lineTo(X + 7, Y + 7); c.moveTo(X + 7, Y - 7); c.lineTo(X - 7, Y + 7); c.stroke(); }
      else if (kind === 'truth' || kind === 'expected' || kind === 'realised') { c.fillStyle = kind === 'realised' ? PAL.ink : PAL.copper; const d = o.dir || 1; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + d * 9, Y - 5); c.lineTo(X + d * 9, Y + 5); c.closePath(); c.fill(); }
      else if (kind === 'tick') { c.strokeStyle = PAL.metalHi; c.lineWidth = 2; c.beginPath(); c.moveTo(X - 4, Y + 5); c.lineTo(X, Y - 5); c.lineTo(X + 4, Y + 5); c.stroke(); }   // one escapement beat
      c.restore();
    },
    line(S, pts, role, o = {}) {
      const Q = pts.map(tf(S, o)), a = o.alpha ?? 1, c = S.c; if (a <= 0.003 || Q.length < 2) return;
      c.save(); c.globalAlpha = a; c.beginPath(); Q.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])));
      c.strokeStyle = role === 'exact' ? PAL.copper : role === 'rule' ? PAL.metal : role === 'guess' ? PAL.ink : role === 'gap' ? PAL.peach : PAL.dim;
      c.lineWidth = role === 'rule' ? 2 : role === 'gap' ? 2.6 : role === 'exact' ? 1.6 : 1; if (role === 'exact') c.setLineDash([6, 4]); if (role === 'ghost') c.setLineDash([2, 3]);
      c.stroke(); c.restore();
    },
    area(S, top, bot, role, o = {}) { const T = tf(S, o), c = S.c; c.save(); c.globalAlpha = (o.alpha ?? 1) * 0.25; c.fillStyle = PAL.copper; c.beginPath(); top.forEach((q, i) => { const P = T(q); i ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); }); for (let i = bot.length - 1; i >= 0; i--) { const P = T(bot[i]); c.lineTo(P[0], P[1]); } c.closePath(); c.fill(); c.restore(); },
    text(S, str, x, y, o = {}) { set(S.c, S, str, x, y, o); },
    num(S, n, x, y, o = {}) { set(S.c, S, o.str, x, y, Object.assign({ role: 'num' }, o)); },
    end(p, S) { p.drawingContext.drawImage(S.F.cv, 0, 0, 960, 540); },
    voice: { step: { kind: 'tick', freq: 3400, gain: 0.45 }, fail: { kind: 'clack', freq: 190, gain: 0.55 }, save: { kind: 'click', freq: 1760, gain: 0.55 },
      reveal: { kind: 'tone', freq: 392, gain: 0.45, dur: 0.9 }, commit: { kind: 'click', freq: 880, gain: 0.45 }, cost: { kind: 'tick', freq: 2600, gain: 0.3 } },
  });
  function set(c, S, str, x, y, o) {
    if (!str) return; const role = o.role || 'text', [f, w, s] = ROLE[role] || ROLE.text, [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1; if (a <= 0.003) return;
    c.save(); c.globalAlpha = a; c.font = `${o.weight || w} ${o.size || s}px ${f}, sans-serif`; c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic';
    c.fillStyle = o.color ? (PAL[o.color] || o.color) : role === 'note' ? PAL.dim : role === 'sketch' ? PAL.copper : PAL.ink; c.fillText(str, X, Y); c.restore();
  }
})(typeof window !== 'undefined' ? window : globalThis);
