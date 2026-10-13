/* arsenal/patterns/gl-look · the manager-level hero look, one host (webgl). st = look.setup(p, tokens, opts); per frame: look.begin(p, t, st);
   marks with params.look = look.attach(st); look.end(p, t, st), or look.render(p, t, st, drawFn, {samples, shutter, fps}). Blocks: floor (luminance
   ladder), rig, rim (Fresnel, in the instance shader), ao (baked), shadow (planar), grain (seeded, also the dither), bloom. Through gl-post
   (linear light, PBR Neutral). Exec level = nothing: attach() is null, begin/end no-ops, the stock ink picture byte-identical. Pure in t; no fetches. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const D2R = Math.PI / 180, Y = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const s2l = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const l2s = (x) => { x = clamp(x); return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; };
    const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* floorCol(xz): the ladder floor in scene units, shared by the floor draw and gl-instances' shadow fragment (MIN-blended: floor * (1 - a)). */
  const GLSL = `uniform vec3 uFC; uniform vec4 uFH; uniform vec3 uFBg, uFPool, uFBgS, uFPoolS; uniform float uFHr, uFLight;
vec3 invT(vec3 d){ float m = min(d.r, min(d.g, d.b)); float x = m < 0.04 ? sqrt(m / 6.25) : m + 0.04; return d + (x - m); }
vec3 floorCol(vec2 xz){
  float r = length(xz - uFC.xy) / uFC.z; vec2 q = abs(xz - uFC.xy) - uFH.xy;
  float g = max(0.55 * (1.0 - smoothstep(0.0, 1.0, r)), 1.0 - smoothstep(0.0, uFH.z, max(q.x, q.y)));
  return uFLight > 0.5 ? mix(uFBgS, uFPoolS, g) : invT(mix(uFBg, uFPool, g)) * uFHr; }`;
  const FV = `#version 300 es
precision highp float; in vec3 aPosition; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; uniform float uFY, uFS; out vec3 vW;
void main(){ vW = vec3(aPosition.x * uFS, uFY, aPosition.y * uFS); gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vW, 1.0); }`;
  const FF = `#version 300 es
precision highp float; in vec3 vW; ` + GLSL + `
out vec4 o; void main(){ o = vec4(floorCol(vW.xz), 1.0); }`;

  const DEF = {
    level: 'manager', seed: 7, w: 960, h: 540, post: null, forceLDR: false,
    blocks: { floor: 1, rig: 1, rim: 1, ao: 1, shadow: 1, grain: 1, bloom: 1 },
    floorY: 0, plate: [0, 0, 360, 120], plateSoft: 28, pool: 420,
    key: [-35, 48, 0.62], fill: [40, 10, 0.14], rimAz: [150, 25], sky: 0.34, gnd: 0.22, rim: 0.05,
    shadowA: 0.42, litMax: 0.55, hero: 4,
    bloomGain: 0.12, vignetteGain: 0, grainSigma: 0.015, grainFps: 15, ramp: null,
  };
  const GRAIN_K = 0.30; // sigma per unit gl-post grainGain (card.md)

  A.patterns['gl-look'] = {
    id: 'gl-look', atlas: ['filter-shaders', 'p5-framebuffer', 'gpu-instancing', 'lights-and-materials', 'p5-grain', 'frontier-2026'],
    renderer: 'webgl', params: DEF, glsl: GLSL,
    variants: [{ name: 'ink-exec', params: { level: 'exec' } }, { name: 'hero', params: {} }, { name: 'bare', params: { blocks: { floor: 0, rig: 0, rim: 0, ao: 0, shadow: 0, grain: 0, bloom: 0 } } }],
    setup(p, tokens, opts) {
      const o = Object.assign({}, DEF, opts), B = Object.assign({}, DEF.blocks, opts && opts.blocks), on = o.level !== 'exec';
      const st = { o, B, tk: tokens, level: o.level, on, t: tokens.color };
      if (!on) { st.attach = () => null; return st; }
      const post = (st.postApi = o.post || A.post['gl-post']);
      st.post = post.setup(p, { seed: o.seed, w: o.w, h: o.h, tokens, forceLDR: o.forceLDR });
      st.hdr = st.post.hdr; st.hr = st.post.headroom; st.fsh = p.createShader(FV, FF);
      const lin = (r) => post.linear(st.t[r]), sc = (l) => post.toSceneLinear(l, 1, st.post);
      st.light = post.lightGround(tokens);
      const kd = (s) => Math.max(0, (s + 0.25) / 1.25), up = Math.sin(o.key[1] * D2R), fu = Math.sin(o.fill[1] * D2R);
      st.LT = o.sky + o.key[2] * kd(up) + o.fill[2] * kd(fu);
      const bg = lin('bg'), bgC = l2s(Y(bg)), poolC = st.light ? bgC - 0.05 : clamp(bgC + 0.03, 0.08, 0.10);
      st.bgL = bg; st.poolL = bg.map((x) => x * (s2l(poolC) / Math.max(Y(bg), 1e-6)));
      st.bgS = sc(bg); st.poolS = sc(st.poolL);
      st.ladder = { bg: +(bgC * 100).toFixed(1), pool: +(poolC * 100).toFixed(1), marks: st.light ? [55, 75] : [15, 30], hero: st.light ? [5, 15] : [80, 100], LT: +st.LT.toFixed(3) };
      return st;
    },
    attach(st) { return st.on ? this.host(st) : null; },
    /* what a mark module takes as params.look (gl-instances): floorCol source, HDR framebuffer, bind / floor / shadowDir hooks */
    host(st) {
      if (st.host) return st.host;
      const o = st.o, B = st.B, post = st.postApi, tk = st.t, LT = st.LT;
      const tierL = (role, kind) => {
        let l = post.linear(tk[role] || tk.muted), c = l2s(Y(l)), to = kind === 'mark' ? (st.light ? 0.55 + 0.2 * c : 0.18 + 0.13 * c) : Math.min(c, o.litMax); // marks 18-31 % code (light 55-75); lit capped
        return l.map((x) => x * (s2l(to) / Math.max(Y(l), 1e-6)));
      };
      const tier = (role, kind) => post.toSceneLinear(tierL(role, kind), 1, st.post).map((x) => x / LT);
      const kindOf = (r) => (/^accent/.test(r) ? 'lit' : 'mark');
      const dirs = (eye, look) => { // camera-relative rig; y is down: up = (0,-1,0)
        const upw = [0, -1, 0], f = nrm(look.map((x, i) => x - eye[i]));
        let fh = f.map((x, i) => x - upw[i] * dot(f, upw)); fh = Math.hypot(...fh) < 1e-4 ? [0, 0, -1] : nrm(fh);
        const r = cross(upw, fh), to = (az, el) => nrm([0, 1, 2].map((i) => Math.cos(el * D2R) * (Math.sin(az * D2R) * r[i] - Math.cos(az * D2R) * fh[i]) + Math.sin(el * D2R) * upw[i]));
        return { key: to(o.key[0], o.key[1]).map((x) => -x), fill: to(o.fill[0], o.fill[1]).map((x) => -x), rim: to(o.rimAz[0], o.rimAz[1]).map((x) => -x) };
      };
      const flo = (sh) => {
        const pl = o.plate, f = B.floor;
        sh.setUniform('uFC', [pl[0], pl[1], o.pool]); sh.setUniform('uFH', [pl[2], pl[3], f ? o.plateSoft : 1, 0]);
        sh.setUniform('uFBg', st.bgL); sh.setUniform('uFPool', f ? st.poolL : st.bgL); sh.setUniform('uFBgS', st.bgS); sh.setUniform('uFPoolS', f ? st.poolS : st.bgS);
        sh.setUniform('uFHr', st.hr); sh.setUniform('uFLight', st.light ? 1 : 0);
      };
      const lk = (st.host = {
        glsl: GLSL, hdr: st.hdr, shadow: !!B.shadow, floorY: o.floorY, jit: null,
        bind(sh, pose, q) {
          const d = dirs(pose.eye, pose.look), hr = st.hr, one = (v) => [v, v, v], hero = q.hero >= 0;
          const pal = []; for (let i = 0; i < 6; i++) pal.push(...tier(q.roles[i] || q.roles[0], kindOf(q.roles[i] || q.roles[0])));
          sh.setUniform('uLook', 1); sh.setUniform('uPal', pal); sh.setUniform('uBg', st.bgS.map((x) => x / LT)); sh.setUniform('uHot', tier('chalk', 'mark'));
          sh.setUniform('uDim', post.toSceneLinear(tierL('muted', 'mark').map((x, i) => st.bgL[i] + (x - st.bgL[i]) * q.dim), 1, st.post).map((x) => x / LT));
          const rig = B.rig;
          sh.setUniform('uSky', one(rig ? o.sky : LT)); sh.setUniform('uGnd', one(rig ? o.gnd : LT));
          sh.setUniform('uKey', one(rig ? o.key[2] : 0)); sh.setUniform('uFill', one(rig ? o.fill[2] : 0));
          sh.setUniform('uKeyDir', d.key); sh.setUniform('uFillDir', d.fill); sh.setUniform('uRimDir', d.rim);
          sh.setUniform('uRimC', one(hr)); sh.setUniform('uRimK', B.rim && !st.light ? o.rim : 0); sh.setUniform('uEye', pose.eye);
          sh.setUniform('uAOk', B.ao ? q.ao || 0 : 0);
          if (hero) { sh.setUniform('uHero', q.hero); sh.setUniform('uHeroCol', post.toSceneLinear(post.linear(tk[st.light ? 'ink' : 'accent']), st.light ? 1 : o.hero, st.post)); }
          flo(sh); sh.setUniform('uShadowA', o.shadowA); sh.setUniform('uFloorY', o.floorY);
        },
        shadowDir(pose) { const k = dirs(pose.eye, pose.look).key; return [k[0], k[1], k[2], 1]; },
        floor(p) {
          if (!B.floor) return;
          p.push(); p.noStroke(); p.shader(st.fsh); flo(st.fsh); st.fsh.setUniform('uFY', o.floorY + 0.3); st.fsh.setUniform('uFS', 7000); p.plane(1, 1); p.pop(); p.resetShader();
        },
        jitter(cam) { if (this.jit) post.jitter(cam, this.jit.dx, this.jit.dy, st.post); },
      });
      return lk;
    },
    /* gl-post params. Grain is engineer-only in gl-post's level table: a grain look runs at 'engineer' with dof and chroma 0; grain off = 'manager'. */
    postParams(st) {
      const o = st.o, B = st.B, grain = B.grain ? o.grainSigma / GRAIN_K : 0;
      return { level: grain > 0 ? 'engineer' : 'manager', exposure: 1, bloomGain: B.bloom ? Math.min(o.bloomGain, 0.2) : 0, bloomThresh: 1, bloomKnee: 0.25,
        vignetteGain: o.vignetteGain, grainGain: grain, grainFps: o.grainFps, grainPx: 1.5, dofGain: 0, chromaGain: 0, ramp: o.ramp };
    },
    clear(p, st) { p.clear(st.bgS[0], st.bgS[1], st.bgS[2], 1); },
    begin(p, t, st) { if (st.on) { st.hdr.begin(); this.clear(p, st); } },
    end(p, t, st) { if (!st.on) return null; st.hdr.end(); return st.postApi.apply(p, st.hdr, t, this.postParams(st), st.tk, st.post); },
    /* sub-frames (gl-post renderAccumulated); the Halton jitter reaches the camera through look.jitter */
    render(p, t, st, drawFn, acc) {
      if (!st.on) return drawFn(p, t);
      const lk = this.host(st), src = st.postApi.renderAccumulated(p, (pp, tk, jit) => { lk.jit = jit && (jit.dx || jit.dy) ? jit : null; this.clear(pp, st); return drawFn(pp, tk); }, t, acc || { samples: 1 }, st.post);
      lk.jit = null; const res = st.postApi.apply(p, src, t, this.postParams(st), st.tk, st.post); res.out = src.out; return res;
    },
  };
})();
