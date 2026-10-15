/* ARSENAL material: shader-materials. Post and material looks as GLSL filter shaders over a 2D scene.
   Renderer: WEBGL main canvas. Scene = channel-coded coverage in a P2D layer (R = primary ink marks and headline,
   G = secondary marks, B = fine rules and mono caption); each look maps channels to TOKEN ROLES via uniforms.
   Shaders: hand-written GLSL via createFilterShader (not p5.strands; see card.md). Pure function of t. */
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const W = 960, H = 540, DUR = 4;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const ease = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const seg = (t, a, b) => ease((t - a) / (b - a));

  /* ---------- GLSL (ES 1.00 style; constant loop bounds) ---------- */
  const HEAD = `precision highp float;
varying vec2 vTexCoord; uniform sampler2D tex0; uniform vec2 canvasSize;
uniform vec2 uRes;            // logical size 960x540
uniform float uT, uSeed;      // time (s), seed
uniform vec3 uBg, uInk, uAccent, uAccent2, uMuted, uPanel, uChalk; // TOKEN ROLES
uniform float uDark;          // 1 when bg luminance < .5
float lum(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
float hash(vec2 p){ p = fract(p*vec2(443.897,441.423)); p += dot(p, p.yx+19.19); return fract((p.x+p.y)*p.x*p.y*43.758); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
vec3 S(vec2 uv){ return texture2D(tex0, uv).rgb; }          // coverage (r,g,b)
vec2 px(){ return vTexCoord*uRes; }                          // logical pixel coords
`;
  const NEON = HEAD + `
uniform float uRadius, uGain, uCore, uThresh;
void main(){
  vec2 uv = vTexCoord; vec3 c = S(uv);
  vec3 tight = vec3(0.), wide = vec3(0.);
  // two golden-angle spirals: 14 taps each, radius uRadius*0.35 and uRadius
  for(int k=0;k<14;k++){
    float fk = float(k); float a = fk*2.39996; float rr = sqrt((fk+.5)/14.);
    vec2 d = vec2(cos(a),sin(a))*rr/uRes;
    tight += S(uv + d*uRadius*.35); wide += S(uv + d*uRadius);
  }
  tight /= 14.; wide /= 14.;
  vec3 g = max(tight*.9 + wide*1.4 - uThresh, 0.);
  vec3 glowCol = uInk*g.r + uAccent*g.g + uAccent2*g.b;
  vec3 coreCol = uInk*c.r + uAccent*c.g + uAccent2*c.b;
  vec3 hot = mix(coreCol, uChalk*max(max(c.r,c.g),c.b), uCore*pow(max(max(c.r,c.g),c.b),3.));
  vec3 col;
  if(uDark > .5) col = uBg + glowCol*uGain + hot;
  else {          // light ground: glow darkens (multiply) instead of adding
    vec3 tint = mix(vec3(1.), glowCol/(max(max(glowCol.r,glowCol.g),glowCol.b)+1e-4), clamp(length(g)*uGain,0.,1.));
    col = uBg*tint; col = mix(col, coreCol, clamp(max(max(c.r,c.g),c.b),0.,1.));
  }
  gl_FragColor = vec4(col,1.);
}`;
  const HALFTONE = HEAD + `
uniform float uCell, uAngle, uSoft, uOverprint;
vec2 rot(vec2 p, float a){ float s=sin(a), c=cos(a); return vec2(c*p.x - s*p.y, s*p.x + c*p.y); }
float screen(vec2 P, float ang, float tone_ch, int ch){
  vec2 q = rot(P, ang)/uCell; vec2 id = floor(q)+.5; vec2 centre = rot((id*uCell), -ang);
  vec3 s = vec3(0.);
  for(int i=0;i<4;i++){ float fi=float(i); vec2 o = vec2(cos(fi*1.5708+.7),sin(fi*1.5708+.7))*uCell*.35;
    s += S((centre+o)/uRes); }
  s *= .25;
  float tone = (ch==0) ? max(s.r, s.b*.75) : s.g;
  float rad = sqrt(clamp(tone,0.,1.))*uCell*.74;
  float d = length((q-id)*uCell);
  return 1. - smoothstep(rad - uSoft, rad + uSoft, d);
}
void main(){
  vec2 P = px(); vec3 col = uBg;
  float a = uAngle;
  float dA = screen(P, a, 0., 0);              // ink screen
  float dB = screen(P, a + .5236, 0., 1);      // accent screen at +30 deg
  col = mix(col, uInk, dA);
  col = mix(col, uAccent, dB * (1. - uOverprint*dA));
  gl_FragColor = vec4(col,1.);
}`;
  const RISO = HEAD + `
uniform float uReg, uGrain, uGrainPx, uPaper;
float inkCov(float c, vec2 P, float seed){
  float n = hash(floor(P/uGrainPx) + seed);
  return smoothstep(.38,.62, c*1.08 + (n-.5)*uGrain);
}
void main(){
  vec2 uv = vTexCoord; vec2 P = px();
  float fr = floor(uT*12.);                    // grain boils at 12 fps, a pure function of t
  vec2 reg = vec2(uReg,-uReg*.6)/uRes;
  vec3 a = S(uv + reg), b = S(uv - reg);        // two plates, misregistered in opposite directions
  float covA = inkCov(max(a.r, a.b*.8), P, uSeed + fr*1.7);   // plate 1: accent2
  float covB = inkCov(b.g, P, uSeed + 31. + fr*2.3);          // plate 2: accent
  vec3 paper = uChalk * (1. - uPaper*(vnoise(P*.8)*.5 + hash(floor(P)+uSeed)*.5));
  vec3 col = paper * mix(vec3(1.), uAccent2, covA) * mix(vec3(1.), uAccent, covB);
  gl_FragColor = vec4(col,1.);
}`;
  const CHALK = HEAD + `
uniform float uErode, uDust, uWobble;
void main(){
  vec2 uv = vTexCoord; vec2 P = px();
  vec2 w = vec2(vnoise(P*.09 + 3.1), vnoise(P*.09 + 9.7)) - .5;
  uv += w*uWobble/uRes;                           // hand wobble of the edge
  vec3 c = S(uv);
  float n = vnoise(P*.55)*.55 + vnoise(P*1.7+5.)*.3 + hash(floor(P*.9)+uSeed)*.35;   // stick grain
  vec3 cov = smoothstep(.15,.7, c - n*uErode*.55);
  vec3 haze = (S(uv+vec2(3.,2.)/uRes)+S(uv-vec2(4.,1.)/uRes)+S(uv+vec2(-2.,5.)/uRes)+S(uv+vec2(5.,-4.)/uRes))*.25;
  vec3 col = uBg*(1. - .05*vnoise(P*.02)) ;      // board
  col += (uMuted*.5)*lum(haze)*uDust*.5;          // smudged dust
  col = mix(col, uChalk, cov.r*.95);
  col = mix(col, uAccent, cov.g*.92);
  col = mix(col, uMuted+uChalk*.15, cov.b*.9);
  float sp = step(.9965, hash(floor(P/1.0)+uSeed*3.)) * uDust;   // loose specks
  col += uChalk*sp*.5*(.3+lum(haze)*4.);
  gl_FragColor = vec4(col,1.);
}`;
  const SHADERS = { neon: NEON, halftone: HALFTONE, riso: RISO, chalk: CHALK };

  /* ---------- token helpers ---------- */
  function rgb(hex) { const h = String(hex).replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, m => m + m) : h.slice(0, 6), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  function css(hex, a) { const [r, g, b] = rgb(hex); return `rgba(${r * 255 | 0},${g * 255 | 0},${b * 255 | 0},${a == null ? 1 : a})`; }
  const lumOf = c => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

  /* ---------- the test scene: channel-coded coverage (or direct colour for the 2D fallback) ---------- */
  function scene(g, t, S, tk, mode) {
    const col = mode === 'coded'
      ? { R: 'rgb(255,0,0)', G: 'rgb(0,255,0)', B: 'rgb(0,0,255)' }
      : { R: css(tk.color.chalk), G: css(tk.color.accent), B: css(tk.color.muted) };
    const ctx = g.drawingContext;
    g.clear(); ctx.save();
    if (mode === 'coded') { g.background(0); ctx.globalCompositeOperation = 'lighter'; }
    else { g.background(tk.color.bg); }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // rules (B)
    const rule = seg(t, 0, 0.9);
    ctx.strokeStyle = col.B; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(60, 120); ctx.lineTo(60 + 840 * rule, 120); ctx.moveTo(60, 470); ctx.lineTo(60 + 840 * rule, 470); ctx.stroke();
    // headline (R), revealed by a wipe
    const wipe = seg(t, 0.1, 1.5);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 60 + 840 * wipe, H); ctx.clip();
    ctx.fillStyle = col.R; ctx.textBaseline = 'alphabetic';
    ctx.font = `${tk.type.disp.weight} 136px "${tk.type.disp.family}", sans-serif`;
    ctx.fillText('COUNT FIRST', 56, 252); ctx.restore();
    // mono caption (B)
    ctx.fillStyle = col.B; ctx.globalAlpha = seg(t, 1.0, 1.6);
    ctx.font = `${tk.type.mono.weight} 17px "${tk.type.mono.family}", monospace`;
    ctx.fillText('41 of 50 runs held  |  seed ' + S.seed, 62, 150); ctx.globalAlpha = 1;
    // bars (G) rising, staggered
    const bx = 60, bw = 24, gap = 18, base = 450;
    ctx.fillStyle = col.G;
    for (let i = 0; i < S.bars.length; i++) {
      const k = seg(t, 0.6 + i * 0.05, 1.7 + i * 0.05); const h = S.bars[i] * 120 * k;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx + i * (bw + gap), base - h, bw, h, 3) : ctx.rect(bx + i * (bw + gap), base - h, bw, h); ctx.fill();
    }
    // arc-length drawn polyline (R) + dots (G) on the right
    const prog = seg(t, 1.0, 3.0), pts = S.line; let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    ctx.strokeStyle = col.R; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    let left = total * prog, tip = pts[0];
    for (let i = 1; i < pts.length && left > 0; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); const f = Math.min(1, left / d);
      tip = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
      ctx.lineTo(tip[0], tip[1]); left -= d;
    }
    ctx.stroke();
    ctx.fillStyle = col.G; ctx.beginPath(); ctx.arc(tip[0], tip[1], 11 + 3 * Math.sin(t * 6.283), 0, 6.283); ctx.fill();
    ctx.fillStyle = col.R;
    for (let i = 0; i < S.dots.length; i++) { const d = S.dots[i]; const k = seg(t, 1.2 + i * 0.04, 2.0 + i * 0.04); ctx.beginPath(); ctx.arc(d[0], d[1], d[2] * k, 0, 6.283); ctx.fill(); }
    ctx.restore();
  }

  /* ---------- 2D approximation, used if the filter shader fails to compile ---------- */
  function fallback(p, t, S, prm, tk, g) {
    scene(g, t, S, tk, 'color');
    const ctx = p.drawingContext; void ctx;
    const look = prm.look, c2 = g.drawingContext;
    if (look === 'neon') { // glow = shadowBlur redraw
      c2.save(); c2.globalCompositeOperation = 'lighter'; c2.shadowColor = css(tk.color.accent); c2.shadowBlur = prm.radius * 0.6;
      c2.globalAlpha = 0.5 * prm.gain; c2.drawImage(g.elt, 0, 0, W, H); c2.restore();
    } else if (look === 'riso') { // paper + two offset multiplies
      c2.save(); c2.globalCompositeOperation = 'multiply'; c2.globalAlpha = 0.5; c2.drawImage(g.elt, prm.reg, -prm.reg * 0.6, W, H); c2.restore();
    }
  }

  const DEFAULTS = {
    look: 'neon', fallback: false,
    radius: 18, gain: 0.8, core: 0.25, thresh: 0.04,          // neon
    cell: 6, angle: 0.4363, soft: 0.8, overprint: 0.0,        // halftone
    reg: 3.2, grain: 0.55, grainPx: 1.5, paper: 0.08,         // riso
    erode: 0.8, dust: 0.9, wobble: 2.2                        // chalk
  };

  ARSENAL.materials['shader'] = {
    id: 'shader', atlas: ['filter-shaders', 'filter', 'p5-shader', 'webgl-mode', 'shader-hooks', 'p5-strands', 'p5-grain', 'p5-riso'],
    renderer: 'webgl', duration: DUR, shaders: SHADERS,
    params: DEFAULTS,
    variants: [
      { name: 'neon', params: { look: 'neon' } },
      { name: 'halftone', params: { look: 'halftone' } },
      { name: 'riso', params: { look: 'riso' } },
      { name: 'chalk', params: { look: 'chalk' } }
    ],
    setup(p, ctx, params) {
      const prm = Object.assign({}, DEFAULTS, params), rnd = mulberry32(ctx.seed >>> 0);
      const S = { seed: ctx.seed >>> 0, bars: [], dots: [], line: [] };
      for (let i = 0; i < 12; i++) S.bars.push(0.45 + 0.55 * rnd());
      for (let i = 0; i < 9; i++) S.dots.push([560 + 36 * i + 8 * rnd(), 400 + 30 * Math.sin(i * 0.9) + 14 * rnd(), 5 + 8 * rnd()]);
      for (let i = 0; i <= 14; i++) S.line.push([520 + i * 28, 380 - 70 * Math.sin(i * 0.45) - 40 * i / 14 + 22 * (rnd() - 0.5)]);
      const g = p.createGraphics(W, H); g.pixelDensity(2);
      let sh = null, err = null;
      if (!prm.fallback) { try { sh = p.createFilterShader(SHADERS[prm.look]); } catch (e) { err = String(e); } }
      return { S, g, sh, err, prm };
    },
    draw(p, t, st, params, tk) {
      const prm = Object.assign({}, st.prm, params), c = tk.color, g = st.g;
      p.push(); p.resetMatrix && p.resetMatrix();
      if (!st.sh) { fallback(p, t, st.S, prm, tk, g); }
      else scene(g, t, st.S, tk, 'coded');
      p.background(0); p.imageMode(p.CORNER); p.image(g, -p.width / 2, -p.height / 2, p.width, p.height);
      if (st.sh) {
        const u = (k, v) => st.sh.setUniform(k, v);
        u('uRes', [W, H]); u('uT', t); u('uSeed', (st.S.seed % 997) * 0.13);
        u('uBg', rgb(c.bg)); u('uInk', rgb(c.ink)); u('uAccent', rgb(c.accent)); u('uAccent2', rgb(c.accent2));
        u('uMuted', rgb(c.muted)); u('uPanel', rgb(c.panel)); u('uChalk', rgb(c.chalk)); u('uDark', lumOf(rgb(c.bg)) < 0.5 ? 1 : 0);
        const L = prm.look;
        if (L === 'neon') { u('uRadius', prm.radius); u('uGain', prm.gain); u('uCore', prm.core); u('uThresh', prm.thresh); }
        if (L === 'halftone') { u('uCell', prm.cell); u('uAngle', prm.angle); u('uSoft', prm.soft); u('uOverprint', prm.overprint); }
        if (L === 'riso') { u('uReg', prm.reg); u('uGrain', prm.grain); u('uGrainPx', prm.grainPx); u('uPaper', prm.paper); }
        if (L === 'chalk') { u('uErode', prm.erode); u('uDust', prm.dust); u('uWobble', prm.wobble); }
        p.filter(st.sh);
      }
      p.pop();
    }
  };
})();
