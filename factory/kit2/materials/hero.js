/* factory/kit2/materials/hero.js · material "hero": the manager-level hero look (arsenal/patterns/gl-look). Same material interface as
   arsenal/materials/drawn (mark, texture), plus `look`, the defaults a film hands to ARSENAL.patterns['gl-look'].setup.
   Manager level ONLY (DECISIONS Q6, D14): kit2/build.py refuses it at any other level, and hero.setup() returns the exec state
   (gl-look does nothing; the film draws its stock ink picture) whenever the level is not 'manager'. Marks are not drawn here: a
   webgl film draws its own, with params.look = the object hero.setup() returns through look.attach(). build.py inlines gl-post and
   gl-look for this material, so a film only has to call:
       const L = ARSENAL.materials.hero.setup(p, K.PACK, FILM.level, knobs);   // once, after createCanvas (WEBGL)
       ARSENAL.patterns['gl-look'].begin(p, t, L); ...marks with look: ARSENAL.patterns['gl-look'].attach(L)...; .end(p, t, L); */
(function (root) {
  'use strict';
  const A = root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  const col = (tk, role) => tk.color[role || 'ink'] || tk.color.ink;
  A.materials.hero = {
    id: 'hero', level: 'manager',
    look: { blocks: { floor: true, rig: true, rim: true, ao: true, shadow: true, grain: true, bloom: true }, bloomGain: 0.12, grainSigma: 0.015, grainFps: 15, vignetteGain: 0 },
    setup(p, tokens, level, opts) {
      const L = A.patterns['gl-look'];
      if (!L) throw new Error('hero material: arsenal/patterns/gl-look is not inlined (build.py adds it for --material hero)');
      return L.setup(p, tokens, Object.assign({}, this.look, opts, { level: level === 'manager' ? 'manager' : 'exec' }));
    },
    mark(p, kind, x, y, w, h, st, tk) {   // Canvas2D fallback (a 2D page): the ink mark
      st = st || {}; const u = st.u == null ? 1 : st.u; if (u <= 0) return;
      const c = p.drawingContext; c.save(); c.globalAlpha = st.a == null ? 1 : st.a; c.fillStyle = c.strokeStyle = col(tk, st.role);
      if (kind === 'bar') c.fillRect(x, y, w * u, h); else if (kind === 'rect') c.strokeRect(x, y, w, h);
      else if (kind === 'dot') { c.beginPath(); c.arc(x, y, w / 2 * u, 0, 2 * Math.PI); c.fill(); } else { c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * u, y + h * u); c.stroke(); }
      c.restore();
    },
    texture() {},
  };
})(typeof window !== 'undefined' ? window : globalThis);
