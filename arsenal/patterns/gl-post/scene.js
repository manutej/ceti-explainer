/* arsenal/patterns/gl-post/scene.js · the demo scene for gl-post (not part of the post contract)
   384 boxes (24 x 16) baked in 8 tiers with buildGeometry, drawn with one role-fed Lambert shader (webgl-scene's) in
   LINEAR light into gl-post's HDR framebuffer, whose .depth feeds the DoF pass. The highest-value boxes light up in accent as t runs (count-in);
   the rank-1 box is the focus target (its eye distance is returned as `focus`). Pure of t; seeded in setup. */
(function () {
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN;' +
    'void main(){ vN = aNormal; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }';
  const FRAG = 'precision highp float; varying vec3 vN; uniform vec3 uColor, uAmb, uKey, uRim, uKeyDir, uRimDir;' +
    'void main(){ vec3 n = normalize(vN); vec3 l = uAmb + uKey * max(dot(n, -uKeyDir), 0.0) + uRim * max(dot(n, -uRimDir), 0.0); gl_FragColor = vec4(uColor * l, 1.0); }';
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  const COLS = 24, ROWS = 16, N = COLS * ROWS, LIT = 96, TIER = 48, CELL = 22, GAP = 4, NEAR = 10, FAR = 3000;

  window.GLPOST_SCENE = {
    N, LIT, near: NEAR, far: FAR, glow: 10,
    countAt: (t, dur) => Math.floor(LIT * smooth((clamp(t / dur) - 0.08) / 0.45) + 1e-9),   // the top quarter lights, highest first
    /* fb: the framebuffer the scene will be drawn into (gl-post's st.hdr); its camera must come from it */
    setup(p, seed, fb) {
      const rng = mulberry32(seed >>> 0), ph = [rng() * 6.283, rng() * 6.283];
      const pos = [], val = [], hh = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const u = c / (COLS - 1), v = r / (ROWS - 1), i = r * COLS + c;
        val[i] = clamp(0.5 + 0.3 * Math.sin(u * 4.6 + ph[0]) * Math.cos(v * 3.7 + ph[1]) + (rng() - 0.5) * 0.35, 0.04, 1);
        hh[i] = 8 + val[i] * 120;
        pos[i] = [(c - (COLS - 1) / 2) * CELL, (r - (ROWS - 1) / 2) * CELL];
      }
      const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => val[b] - val[a] || a - b);
      const bw = CELL - GAP, tiers = [];
      for (let j = 0; j < N / TIER; j++) tiers.push(p.buildGeometry(() => {
        p.noStroke(); for (let m = j * TIER; m < (j + 1) * TIER; m++) { const i = order[m]; p.push(); p.translate(pos[i][0], -hh[i] / 2, pos[i][1]); p.box(bw, hh[i], bw); p.pop(); }
      }));
      return { pos, val, hh, order, bw, tiers, cam: fb.createCamera(), sh: p.createShader(VERT, FRAG) };
    },
    /* draw into the BOUND framebuffer at t, in linear light (colours via post.toScene). jit = {dx, dy} backing px.
       Only the rank-1 box is emissive (x glow > 1: the one mark that blooms); data marks stay <= 1. */
    draw(p, t, st, tk, dur, post, ps, jit) {
      const u = clamp(t / dur), a = -0.95 + 0.55 * smooth(u), R = 640;
      const eye = [R * Math.sin(a), -330, R * Math.cos(a)], look = [0, -40, 0];
      st.cam.camera(eye[0], eye[1], eye[2], look[0], look[1], look[2], 0, 1, 0);
      st.cam.perspective(0.78, p.width / p.height, NEAR, FAR);
      if (jit && (jit.dx || jit.dy)) post.jitter(st.cam, jit.dx, jit.dy, ps);
      const k = this.countAt(t, dur), sh = st.sh, L = (hex, e) => post.toScene(hex, e, ps), lin = post.linear;
      const mixL = (h1, h2, u) => post.toSceneLinear(lin(h1).map((x, i) => x + (lin(h2)[i] - x) * u), 1, ps);   // mix in display-linear, then to scene
      const bgS = L(tk.color.bg), glow = post.lightGround(tk) ? 1 : this.glow;
      p.clear(bgS[0], bgS[1], bgS[2], 1); p.setCamera(st.cam); p.noStroke(); p.shader(sh);   // clear(r,g,b,a) is not clamped (background() clamps to 1; a white ground is ~12 in scene units)
      const rim = post.linear(tk.color.accent2).map((x) => x * 0.12);
      sh.setUniform('uAmb', [0.34, 0.34, 0.34]); sh.setUniform('uKey', [0.6, 0.6, 0.6]); sh.setUniform('uRim', rim);
      sh.setUniform('uKeyDir', norm([-0.45, 0.8, -0.4])); sh.setUniform('uRimDir', norm([0.7, 0.3, 0.6]));
      const base = mixL(tk.color.bg, tk.color.muted, 0.75), hi = L(tk.color.accent), top = post.lightGround(tk) ? L(tk.color.chalk) : L(tk.color.accent, glow);   // light ground: no glow, the rank-1 box in chalk
      const one = (i, col, g) => { sh.setUniform('uColor', col); p.push(); p.translate(st.pos[i][0], -st.hh[i] / 2, st.pos[i][1]); p.box(st.bw + g, st.hh[i] + g, st.bw + g); p.pop(); };
      for (let j = 0; j < st.tiers.length; j++) {
        const lo = j * TIER, up = lo + TIER;
        if (up <= k) { sh.setUniform('uColor', hi); p.model(st.tiers[j]); }
        else if (lo >= k) { sh.setUniform('uColor', base); p.model(st.tiers[j]); }
        else for (let m = lo; m < up; m++) one(st.order[m], m < k ? hi : base, 0);
      }
      const i0 = st.order[0];
      if (k > 0) one(i0, top, 1.5);
      sh.setUniform('uColor', mixL(tk.color.bg, tk.color.panel, 0.9)); p.push(); p.translate(0, 1, 0); p.box(1400, 2, 1400); p.pop();
      p.resetShader();
      const P = [st.pos[i0][0], -st.hh[i0], st.pos[i0][1]];
      const pin = p.worldToScreen(p.createVector(P[0], P[1], P[2]));
      pin.y = p.height - pin.y;   // 2.3.4: inside a framebuffer (its camera flips y) worldToScreen returns y measured from the bottom
      const focus = Math.hypot(P[0] - eye[0], P[1] - eye[1], P[2] - eye[2]);
      return { k, focus, pin: { x: pin.x, y: pin.y }, val: st.val[i0], near: NEAR, far: FAR };
    },
  };
})();
