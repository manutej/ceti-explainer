/* arsenal/patterns/gl-post · a composable, linear-light post stack (ARSENAL.post['gl-post'], renderer webgl)
   The scene renders into st.hdr, a HALF_FLOAT framebuffer in LINEAR light (role colours enter through toScene()).
   Passes, fixed order:  dof -> bloom -> chroma -> TONEMAP (Khronos PBR Neutral + sRGB OETF) -> vignette -> grain
   dof, bloom and chroma run in linear light on float buffers; tone mapping is the colour transform to the display;
   vignette and grain run after it, in display space. Every pass is a GLSL ES 1.00 fragment made with p5 2.3.4
   createFilterShader. Linear passes are drawn by run() (the filter shader on a plane into a float framebuffer,
   because filter()'s internal layer is 8-bit); with fuse (default) chroma + tonemap + vignette + grain are ONE pass.
   A pass whose effective gain is 0 is skipped. Effective gain = gain x ramp(t) x level rule. Pure of (t, params,
   tokens, seed); grain is seeded by frame index floor(t*fps). Colours come from token roles, never hex.
   renderAccumulated(): stratified sub-frame times + Halton(2,3) projection jitter, averaged in linear light. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  A.post = A.post || {};
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const hex3 = (hex) => { const h = String(hex).replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, (m) => m + m) : h.slice(0, 6), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  const s2l = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const l2s = (x) => { x = clamp(x); return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; };
  const linOf = (hex) => hex3(hex).map(s2l);

  /* ---- Khronos PBR Neutral, forward and inverse (JS mirror of the GLSL) ---- */
  const KS = 0.8 - 0.04, KD = 0.15, DD = 1 - KS;
  function neutral(c) {
    c = c.slice(); const x = Math.min(...c), off = x < 0.08 ? x - 6.25 * x * x : 0.04; c = c.map((v) => v - off);
    const pk = Math.max(...c); if (pk < KS) return c;
    const np = 1 - DD * DD / (pk + DD - KS); c = c.map((v) => v * np / pk);
    const g = 1 - 1 / (KD * (pk - np) + 1); return c.map((v) => v + (np - v) * g);
  }
  function neutralInv1(y, cap) {   // exact inverse below the shoulder; above it, the output peak is capped at `cap` (< 1)
    let z = y.slice(), np = Math.max(...z);
    if (np >= KS) {
      np = Math.min(np, cap); const pk = DD * DD / (1 - np) - DD + KS, g = 1 - 1 / (KD * (pk - np) + 1);
      z = z.map((v) => Math.max(0, (Math.min(v, np) - g * np) / (1 - g)) * pk / np);
    }
    const zm = Math.min(...z), xm = zm >= 0.04 ? zm + 0.04 : Math.sqrt(Math.max(0, zm) / 6.25);
    return z.map((v) => v + (xm - zm));
  }
  /* scene-referred linear value that tone-maps to y (linear display target). Saturated roles at full intensity (a channel
     at FF) are outside the curve's gamut (it desaturates highlights), so try a few shoulder caps and keep the closest in Lab. */
  const INV = new Map();
  function neutralInv(y) {
    const key = y.join(','); if (INV.has(key)) return INV.get(key).slice();
    const ref = lab(y); let best = null, bd = 1e9;
    for (const cap of [0.995, 0.98, 0.95, 0.92, 0.88, 0.84, 0.8, 0.77]) {
      const x = neutralInv1(y, cap), d = dE(ref, lab(neutral(x).map(q8).map(s2l)));
      if (d < bd - 1e-9) { bd = d; best = x; }
      if (Math.max(...y) < KS) break;
    }
    INV.set(key, best); return best.slice();
  }
  /* CIE Lab (D65) and dE76, for the role round-trip check */
  function lab(rgbLin) {
    const [r, g, b] = rgbLin; const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
    const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
    return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
  }
  const q8 = (v) => Math.round(l2s(v) * 255) / 255;   // what the 8-bit canvas stores
  const dE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  function roleCheck(tokens) {
    const out = {}; let maxRaw = 0, maxPre = 0;
    for (const [k, v] of Object.entries(tokens.color)) {
      if (!/^#/.test(String(v))) continue;
      const L = linOf(v), ref = lab(L);
      const raw = dE(ref, lab(neutral(L).map(q8).map(s2l))), pre = dE(ref, lab(neutral(neutralInv(L)).map(q8).map(s2l)));
      out[k] = { raw: +raw.toFixed(2), precomp: +pre.toFixed(2) }; maxRaw = Math.max(maxRaw, raw); maxPre = Math.max(maxPre, pre);
    }
    return { roles: out, maxRaw: +maxRaw.toFixed(2), maxPrecomp: +maxPre.toFixed(2), pass: maxPre < 2 };
  }
  const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };

  const ORDER = ['dof', 'bloom', 'chroma', 'tonemap', 'vignette', 'grain'];
  /* level rule (DECISIONS Q6: exec is ink and clean): exec = tone mapping only (it is the colour transform, not a look);
     manager = optical passes, no texture; engineer = all. Grain and vignette are for hero/teaser/social cuts. */
  const LEVELS = { exec: ['tonemap'], manager: ['dof', 'bloom', 'tonemap', 'vignette'], engineer: ORDER.slice() };

  /* ---------------- GLSL ---------------- */
  const HEAD = `precision highp float;
varying vec2 vTexCoord; uniform sampler2D tex0; uniform vec2 canvasSize; uniform vec2 texelSize;
uniform vec2 uRes;      // logical frame size (960x540): radii are in logical px
uniform vec2 uTexel;    // 1 / backing size of tex0
float lum(vec3 c){ return dot(c, vec3(.2126,.7152,.0722)); }
`;
  const F_TONE = `
uniform float uExposure;
vec3 neutral(vec3 c){ float x = min(c.r, min(c.g, c.b)); float off = x < .08 ? x - 6.25*x*x : .04; c -= off;
  float pk = max(c.r, max(c.g, c.b)); if(pk < .76) return c; float d = .24; float np = 1. - d*d/(pk + d - .76);
  c *= np/pk; float g = 1. - 1./(.15*(pk - np) + 1.); return mix(c, vec3(np), g); }
vec3 oetf(vec3 c){ c = clamp(c, 0., 1.); return mix(c*12.92, 1.055*pow(c, vec3(1./2.4)) - .055, step(.0031308, c)); }
vec3 tonemap(vec3 c){ return oetf(neutral(max(c*uExposure, 0.))); }`;
  const F_VIG = `
uniform float uVigGain, uInner;
vec3 vignette(vec3 c, vec2 uv){ float ar = uRes.x/uRes.y; float d = length((uv - .5)*vec2(ar, 1.))/length(vec2(ar*.5, .5));
  return c*(1. - uVigGain*smoothstep(uInner, 1., d)); }`;
  const F_GRAIN = `
uniform float uGrainGain, uPx, uFrame, uSeed;
float hash(vec2 p){ p = fract(p*vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y)*p.x*p.y*43.758); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
vec3 grain(vec3 c, vec2 uv){ vec2 P = uv*uRes/uPx; vec2 s = vec2(uFrame*17.13 + uSeed, uFrame*7.31 - uSeed*.5);
  float n = vn(P + s) + vn(P*1.13 + s.yx + 3.1) - 1.;      // value noise on a uPx lattice: low-passed, survives H.264
  return clamp(c + n*uGrainGain*sqrt(max(1. - lum(c), 0.)), 0., 1.); }`;
  const F_CHROMA = `
uniform float uAmt;
vec2 chromaOff(vec2 uv){ vec2 d = uv - .5; float ar = uRes.x/uRes.y; vec2 n = d*vec2(ar, 1.);
  float r2 = dot(n, n)/dot(vec2(ar*.5, .5), vec2(ar*.5, .5)); return normalize(d + 1e-6)*uAmt*r2/uRes; }`;

  /* bloom down: Jimenez 13-tap; uFirst = 1 adds the Karis average (per 2x2 group, weight 1/(1+luma)) and the soft threshold */
  const DOWN = HEAD + `
uniform float uFirst, uThresh, uKnee;
vec3 T(vec2 o){ return texture2D(tex0, vTexCoord + o*uTexel).rgb; }
float kw(vec3 c){ return 1./(1. + lum(c)); }
void main(){
  vec3 a=T(vec2(-2.,-2.)), b=T(vec2(0.,-2.)), c=T(vec2(2.,-2.)), d=T(vec2(-2.,0.)), e=T(vec2(0.)), f=T(vec2(2.,0.));
  vec3 g=T(vec2(-2.,2.)), h=T(vec2(0.,2.)), i=T(vec2(2.,2.)), j=T(vec2(-1.,-1.)), k=T(vec2(1.,-1.)), l=T(vec2(-1.,1.)), m=T(vec2(1.,1.));
  vec3 g0=(j+k+l+m)*.25, g1=(a+b+d+e)*.25, g2=(b+c+e+f)*.25, g3=(d+e+g+h)*.25, g4=(e+f+h+i)*.25; vec3 o;
  if(uFirst > .5){ float w0=.5*kw(g0), w1=.125*kw(g1), w2=.125*kw(g2), w3=.125*kw(g3), w4=.125*kw(g4);
    o = (g0*w0 + g1*w1 + g2*w2 + g3*w3 + g4*w4)/(w0+w1+w2+w3+w4);
    float br = max(o.r, max(o.g, o.b)); float s = clamp(br - uThresh + uKnee, 0., 2.*uKnee); s = s*s/(4.*uKnee + 1e-4);
    o *= max(s, br - uThresh)/max(br, 1e-4);
  } else o = g0*.5 + (g1 + g2 + g3 + g4)*.125;
  gl_FragColor = vec4(o, 1.);
}`;
  /* bloom up: 9-tap tent of the smaller level, added to this level */
  const UP = HEAD + `
uniform sampler2D uBase;
void main(){ vec2 t = uTexel; vec3 s =
  texture2D(tex0, vTexCoord + vec2(-t.x,-t.y)).rgb + 2.*texture2D(tex0, vTexCoord + vec2(0.,-t.y)).rgb + texture2D(tex0, vTexCoord + vec2(t.x,-t.y)).rgb +
  2.*texture2D(tex0, vTexCoord + vec2(-t.x,0.)).rgb + 4.*texture2D(tex0, vTexCoord).rgb + 2.*texture2D(tex0, vTexCoord + vec2(t.x,0.)).rgb +
  texture2D(tex0, vTexCoord + vec2(-t.x,t.y)).rgb + 2.*texture2D(tex0, vTexCoord + vec2(0.,t.y)).rgb + texture2D(tex0, vTexCoord + vec2(t.x,t.y)).rgb;
  gl_FragColor = vec4(texture2D(uBase, vTexCoord).rgb + s/16., 1.); }`;
  /* depth of field (linear light): 16-tap golden-spiral gather, per-tap CoC (scatter-as-gather); a tap in front of the
     centre spreads by its own CoC, a tap behind by min(own, centre): no sharp-background halo.
     uKind 0 = window depth (a p5.Framebuffer's .depth), 1 = packed linear depth (r = z / far) */
  const DOF = HEAD + `
uniform sampler2D uDepth; uniform float uKind, uOrtho, uNear, uFar, uFocus, uRange, uFalloff, uMaxR;
float linz(vec2 uv){ float d = texture2D(uDepth, uv).r;
  if(uKind > .5) return d*uFar; if(uOrtho > .5) return uNear + d*(uFar - uNear);
  float z = d*2. - 1.; return 2.*uNear*uFar/(uFar + uNear - z*(uFar - uNear)); }
float coc(float z){ return smoothstep(uRange, uRange + uFalloff, abs(z - uFocus)); }
void main(){
  vec2 uv = vTexCoord; vec3 c0 = texture2D(tex0, uv).rgb; float z0 = linz(uv); float r0 = coc(z0)*uMaxR;
  vec3 acc = c0; float ws = 1.;
  for(int k=0;k<16;k++){
    float fk = float(k); float a = fk*2.39996; float rr = sqrt((fk + .5)/16.)*uMaxR;
    vec2 q = uv + vec2(cos(a), sin(a))*rr/uRes;
    float zt = linz(q); float rt = coc(zt)*uMaxR; float reach = zt < z0 ? rt : min(rt, r0);
    float w = clamp(reach - rr + 1., 0., 1.); acc += texture2D(tex0, q).rgb*w; ws += w;
  }
  gl_FragColor = vec4(acc/ws, 1.);
}`;
  /* accumulation: out = prev + w * frame (ping-pong, linear light) */
  const ACCUM = HEAD + `
uniform sampler2D uPrev; uniform float uW, uFirst;
void main(){ vec3 p = uFirst > .5 ? vec3(0.) : texture2D(uPrev, vTexCoord).rgb; gl_FragColor = vec4(p + texture2D(tex0, vTexCoord).rgb*uW, 1.); }`;
  /* separate (fuse:false) passes */
  const COMPOSITE = HEAD + `uniform sampler2D uBloom; uniform float uBloomGain;
void main(){ gl_FragColor = vec4(texture2D(tex0, vTexCoord).rgb + texture2D(uBloom, vTexCoord).rgb*uBloomGain, 1.); }`;
  const CHROMA = HEAD + F_CHROMA + `
void main(){ vec2 o = chromaOff(vTexCoord); gl_FragColor = vec4(texture2D(tex0, vTexCoord + o).r, texture2D(tex0, vTexCoord).g, texture2D(tex0, vTexCoord - o).b, 1.); }`;
  const TONEMAP = HEAD + F_TONE + `
void main(){ gl_FragColor = vec4(tonemap(texture2D(tex0, vTexCoord).rgb), 1.); }`;
  const VIGNETTE = HEAD + F_VIG + `
void main(){ gl_FragColor = vec4(vignette(texture2D(tex0, vTexCoord).rgb, vTexCoord), 1.); }`;
  const GRAIN = HEAD + F_GRAIN + `
void main(){ gl_FragColor = vec4(grain(texture2D(tex0, vTexCoord).rgb, vTexCoord), 1.); }`;
  /* fused output (default): bloom add -> chroma -> tonemap -> vignette -> grain in one pass; same maths as the chain */
  const OUTPUT = HEAD + F_TONE + F_VIG + F_GRAIN + F_CHROMA + `
uniform sampler2D uBloom; uniform float uBloomGain;
vec3 at(vec2 uv){ return texture2D(tex0, uv).rgb + texture2D(uBloom, uv).rgb*uBloomGain; }
void main(){ vec2 uv = vTexCoord; vec3 c;
  if(uAmt > 0.){ vec2 o = chromaOff(uv); c = vec3(at(uv + o).r, at(uv).g, at(uv - o).b); } else c = at(uv);
  c = tonemap(c);
  if(uVigGain > 0.) c = vignette(c, uv);
  if(uGrainGain > 0.) c = grain(c, uv);
  gl_FragColor = vec4(c, 1.); }`;
  const SHADERS = { DOWN, UP, DOF, ACCUM, COMPOSITE, CHROMA, TONEMAP, VIGNETTE, GRAIN, OUTPUT };

  const DEFAULTS = {
    level: 'engineer', fuse: true, exposure: 1,
    bloomGain: 0, bloomThresh: 1.0, bloomKnee: 0.25, bloomLevels: 5,
    dofGain: 0, dofFocus: 600, dofRange: 40, dofFalloff: 220, dofAperture: 6, near: 10, far: 4000, ortho: false, depthKind: 'window', depthTex: null,
    chromaGain: 0, vignetteGain: 0, vignetteInner: 0.35, grainGain: 0, grainPx: 1.25, grainFps: 24,
    ramp: null,      // { pass: [t0, t1] | [t0, t1, t2, t3] }: smoothstep up (and down) on t, multiplies that pass's gain
    accum: null,     // { samples, shutter, fps } for renderAccumulated (the demo reads it)
  };
  const GAIN = { dof: 'dofGain', bloom: 'bloomGain', chroma: 'chromaGain', tonemap: 'exposure', vignette: 'vignetteGain', grain: 'grainGain' };
  function rampAt(r, t) {
    if (!r) return 1;
    if (r.length === 2) return smooth((t - r[0]) / Math.max(1e-6, r[1] - r[0]));
    return smooth((t - r[0]) / Math.max(1e-6, r[1] - r[0])) * (1 - smooth((t - r[2]) / Math.max(1e-6, r[3] - r[2])));
  }
  /* effective gains at t (what a film logs or captions; 0 = skipped). tonemap is never 0: it is the output transform. */
  function gains(params, t) {
    const prm = Object.assign({}, DEFAULTS, params), allow = LEVELS[prm.level] || LEVELS.engineer, out = {};
    for (const k of ORDER) out[k] = allow.includes(k) ? Math.max(0, +prm[GAIN[k]] || 0) * (k === 'tonemap' ? 1 : rampAt(prm.ramp && prm.ramp[k], t)) : 0;
    out.tonemap = Math.max(1e-3, +prm.exposure || 1);
    return out;
  }

  const STATE = new WeakMap();
  /* draw a filter shader on a plane into target (a framebuffer) or, with target null, onto the main canvas */
  function run(p, st, sh, target, src, u) {
    if (target) { target.begin(); p.clear(); } else { p.setCamera(st.cam0); p.clearDepth(); }
    p.push(); p.resetMatrix(); p.noStroke(); p.noLights(); p.shader(sh);
    const sw = src.width * (src.pixelDensity ? src.pixelDensity() : 1), sh_ = src.height * (src.pixelDensity ? src.pixelDensity() : 1);
    sh.setUniform('tex0', src); sh.setUniform('uRes', [st.W, st.H]); sh.setUniform('uTexel', [1 / sw, 1 / sh_]);
    for (const k in u) sh.setUniform(k, u[k]);
    const tw = target ? target.width : p.width, th = target ? target.height : p.height;
    p.plane(tw, th); p.pop(); p.resetShader();
    if (target) target.end();
  }
  function bloomChain(p, st, src, prm) {
    const L = clamp(Math.round(prm.bloomLevels), 2, st.down.length - 1);
    let cur = src;
    for (let k = 1; k <= L; k++) { run(p, st, st.sh.DOWN, st.down[k], cur, { uFirst: k === 1 ? 1 : 0, uThresh: prm.bloomThresh * st.headroom, uKnee: prm.bloomKnee * st.headroom }); cur = st.down[k]; }
    for (let k = L - 1; k >= 1; k--) { run(p, st, st.sh.UP, st.up[k], cur, { uBase: st.down[k] }); cur = st.up[k]; }
    return cur;
  }

  A.post['gl-post'] = {
    id: 'gl-post', renderer: 'webgl', order: ORDER, levels: LEVELS, shaders: SHADERS, params: DEFAULTS, duration: 6,
    atlas: ['filter-shaders', 'filter', 'p5-framebuffer', 'layered-compositing', 'webgl-mode', 'p5-grain', 'p5-strands', 'frontier-2026'],
    variants: (() => {
      const stack = { dofGain: 1, bloomGain: 0.1, chromaGain: 2.5, vignetteGain: 0.12, grainGain: 0.016,
        ramp: { vignette: [0, 1.5], grain: [0, 0.5], dof: [1.6, 3.2], bloom: [3.0, 3.8, 5.0, 6.0], chroma: [3.2, 3.8, 4.4, 5.6] } };
      return [
        { name: 'none', params: {} },                                  // tone map only: the exec frame and the cost floor
        { name: 'dof', params: { dofGain: 1 } },
        { name: 'bloom', params: { bloomGain: 0.1 } },
        { name: 'chroma', params: { chromaGain: 4 } },
        { name: 'vignette', params: { vignetteGain: 0.15 } },
        { name: 'grain', params: { grainGain: 0.02 } },
        { name: 'reveal', params: stack },
        { name: 'reveal-exec', params: Object.assign({}, stack, { level: 'exec' }) },
        { name: 'accum-8', params: Object.assign({}, stack, { accum: { samples: 8, shutter: 0.5, fps: 30 } }) },
        { name: 'accum-16', params: Object.assign({}, stack, { accum: { samples: 16, shutter: 0.5, fps: 30 } }) },
      ];
    })(),
    gains, rampAt, neutral, neutralInv, roleCheck, halton,
    /* setup(p, ctx): shaders, the HDR scene framebuffer (st.hdr, HALF_FLOAT, depth on), ping-pong and bloom-level buffers,
       a default camera. Falls back to UNSIGNED_BYTE with 2 stops of headroom (scene x 0.25) without a float colour buffer. */
    setup(p, ctx) {
      ctx = ctx || {};
      const st = { seed: (ctx.seed == null ? 7 : ctx.seed) >>> 0, err: null, sh: {}, W: ctx.w || p.width, H: ctx.h || p.height, d: p.pixelDensity() };
      const gl = p._renderer && p._renderer.GL, gl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
      st.hdrOK = !ctx.forceLDR && !!gl && (gl2 ? !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float')) : !!gl.getExtension('EXT_color_buffer_half_float'));
      st.format = st.hdrOK ? p.HALF_FLOAT : p.UNSIGNED_BYTE; st.headroom = st.hdrOK ? 1 : 0.25;
      try { for (const k of Object.keys(SHADERS)) st.sh[k] = p.createFilterShader(SHADERS[k]); } catch (e) { st.err = String(e).slice(0, 200); }
      const fb = (o) => p.createFramebuffer(Object.assign({ format: st.format, antialias: false, textureFiltering: p.LINEAR }, o));
      st.hdr = fb({ density: st.d, depth: true });
      st.a = fb({ density: st.d, depth: false }); st.b = fb({ density: st.d, depth: false });
      st.down = [null]; st.up = [null];
      for (let k = 1; k <= 6; k++) {
        const w = Math.max(2, Math.round(st.W * st.d / 2 ** k)), h = Math.max(2, Math.round(st.H * st.d / 2 ** k));
        st.down.push(fb({ width: w, height: h, density: 1, depth: false })); st.up.push(fb({ width: w, height: h, density: 1, depth: false }));
      }
      st.black = fb({ width: 2, height: 2, density: 1, depth: false }); st.black.begin(); p.clear(); p.background(0); st.black.end();
      st.cam0 = p.createCamera(); p.setCamera(st.cam0);
      st.roles = ctx.tokens ? roleCheck(ctx.tokens) : null;
      STATE.set(p, st);
      return st;
    },
    /* role colour -> scene-referred LINEAR value: inverse tone curve (so a fully lit face tone-maps back to the role),
       x headroom, x emission (> 1 makes a mark glow: bloom threshold is 1.0). Returns [r, g, b] for setUniform. */
    toScene(hex, emission, state) { return A.post['gl-post'].toSceneLinear(linOf(hex), emission, state); },
    /* same from a LINEAR display colour: mix roles here (in display-linear), never after toScene (white ground is ~12 in scene units) */
    toSceneLinear(lin, emission, state) { const hr = state ? state.headroom : 1; return neutralInv(lin.map((v) => clamp(v))).map((v) => v * hr * (emission == null ? 1 : emission)); },
    lightGround: (tokens) => { const b = linOf(tokens.color.bg); return 0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2] > 0.5; },
    linear: linOf,
    /* projection jitter for accumulation: (dx, dy) in backing px; call after cam.perspective()/ortho(), before setCamera */
    jitter(cam, dx, dy, st) {
      const m = cam.projMatrix && (cam.projMatrix.mat4 || cam.projMatrix.matrix); if (!m) return false;
      const jx = 2 * dx / (st.W * st.d), jy = 2 * dy / (st.H * st.d);
      if (Math.abs(m[11]) > 1e-6) { m[8] += jx * m[11]; m[9] += jy * m[11]; } else { m[12] += jx; m[13] += jy; }
      return true;
    },
    /* renderAccumulated(p, drawScene, t, {samples, shutter, fps}[, state]): drawScene(p, tk, {dx, dy, k, n}) draws the scene
       while st.hdr is bound (it sets its own camera, calls jitter()). Sub-frame k: tk = t + ((k+.5)/N - .5) * shutter / fps,
       jitter = Halton(2,3)(k+1) - .5 backing px. Averaged in linear light (ping-pong, weight 1/N). Returns
       { color, depth, out } where depth is the LAST sub-frame's depth and out what its drawScene returned. */
    renderAccumulated(p, drawScene, t, opts, state) {
      const st = state || STATE.get(p), o = Object.assign({ samples: 1, shutter: 0.5, fps: 30 }, opts), N = Math.max(1, Math.round(o.samples));
      if (N === 1) { st.hdr.begin(); const out = drawScene(p, t, { dx: 0, dy: 0, k: 0, n: 1 }); st.hdr.end(); return { color: st.hdr, depth: st.hdr.depth, out }; }
      if (!st.acc) st.acc = [0, 1].map(() => p.createFramebuffer({ format: st.format, antialias: false, density: st.d, depth: false, textureFiltering: p.LINEAR }));
      let out = null, cur = null;
      for (let k = 0; k < N; k++) {
        const tk = t + ((k + 0.5) / N - 0.5) * o.shutter / o.fps;
        st.hdr.begin(); out = drawScene(p, tk, { dx: halton(k + 1, 2) - 0.5, dy: halton(k + 1, 3) - 0.5, k, n: N }); st.hdr.end();
        const dst = st.acc[k & 1]; run(p, st, st.sh.ACCUM, dst, st.hdr, { uPrev: cur || st.black, uW: 1 / N, uFirst: k === 0 ? 1 : 0 }); cur = dst;
      }
      return { color: cur, depth: st.hdr.depth, out };
    },
    /* apply(p, src, t, params, tokens[, state]): src = a p5.Framebuffer in linear light (st.hdr; its .depth feeds DoF) or
       renderAccumulated's { color, depth }. Writes the tone-mapped frame to the main canvas (default camera). */
    apply(p, src, t, params, tokens, state) {
      const st = state || STATE.get(p), prm = Object.assign({}, DEFAULTS, params), g = gains(prm, t), ran = [];
      const color = src && src.color ? src.color : src, depth = prm.depthTex || (src && src.color ? src.depth : src && src.depth) || null;
      if (st.err) {   // shaders failed to compile: show the linear frame untouched (colours read darker), report it
        p.push(); p.setCamera(st.cam0); p.resetMatrix(); p.imageMode(p.CORNER); p.image(color, -p.width / 2, -p.height / 2, p.width, p.height); p.pop();
        return { ran: ['fallback:no-shaders'], gains: g, depth: !!depth, hdr: st.hdrOK, err: st.err };
      }
      p.push();
      let cur = color, spare = [st.a, st.b];
      const next = () => (cur === spare[0] ? spare[1] : spare[0]);
      if (g.dof > 0 && depth) {
        const dst = next(); run(p, st, st.sh.DOF, dst, cur, { uDepth: depth, uKind: prm.depthKind === 'linear' ? 1 : 0, uOrtho: prm.ortho ? 1 : 0, uNear: prm.near, uFar: prm.far,
          uFocus: prm.dofFocus, uRange: prm.dofRange, uFalloff: Math.max(1, prm.dofFalloff), uMaxR: prm.dofAperture * g.dof }); cur = dst; ran.push('dof');
      } else if (g.dof > 0) ran.push('dof:no-depth');
      let bloom = st.black;
      if (g.bloom > 0 && A.post['gl-post'].lightGround(tokens)) { g.bloom = 0; ran.push('bloom:light-ground'); }   // glow cannot be brighter than paper
      if (g.bloom > 0) { bloom = bloomChain(p, st, cur, prm); ran.push('bloom'); }
      const seed = (st.seed % 997) * 0.173, frame = Math.floor(t * prm.grainFps + 1e-6);
      const U = { uBloom: bloom, uBloomGain: g.bloom, uAmt: g.chroma, uExposure: g.tonemap / st.headroom, uVigGain: g.vignette, uInner: prm.vignetteInner,
        uGrainGain: g.grain, uPx: prm.grainPx, uFrame: frame, uSeed: seed };
      if (prm.fuse) {
        run(p, st, st.sh.OUTPUT, null, cur, U);
        ran.push('output(' + ['bloom', 'chroma', 'tonemap', 'vignette', 'grain'].filter((k) => g[k] > 0).join('+') + ')');
      } else {
        if (g.bloom > 0) { const dst = next(); run(p, st, st.sh.COMPOSITE, dst, cur, U); cur = dst; }
        if (g.chroma > 0) { const dst = next(); run(p, st, st.sh.CHROMA, dst, cur, U); cur = dst; ran.push('chroma'); }
        run(p, st, st.sh.TONEMAP, null, cur, U); ran.push('tonemap');
        const F = (sh, name) => { for (const k in U) if (k !== 'uBloom') sh.setUniform(k, U[k]); sh.setUniform('uRes', [st.W, st.H]); p.setCamera(st.cam0); p.filter(sh); ran.push(name); };
        if (g.vignette > 0) F(st.sh.VIGNETTE, 'vignette');
        if (g.grain > 0) F(st.sh.GRAIN, 'grain');
      }
      p.pop(); p.setCamera(st.cam0);
      return { ran, gains: g, depth: !!depth, hdr: st.hdrOK };
    },
  };
})();
