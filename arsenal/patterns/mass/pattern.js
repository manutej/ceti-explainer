// ARSENAL pattern: mass · thousands of marks as a count structure, under one second per frame.
// One API, three implementations: 'canvas2d' (batched paths), 'webgl' (buildGeometry baked once, motion on the GPU),
// 'instances' (p.instances() when this p5 build has it, else it resolves to 'webgl' and records why).
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const W = 960, H = 540, OVH = 96, FIELD = { x: 60, y: 96, w: 840, h: 392 };
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const mix = (a, b, k) => a + (b - a) * k;
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function parseColor(s) {
    s = String(s).trim();
    if (s[0] === '#') { if (s.length === 4) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]; return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]; }
    const m = s.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]];
  }
  const mixRGB = (a, b, k) => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
  const css = c => 'rgb(' + c.map(v => Math.round(v)).join(',') + ')';
  const easeK = tok => ({ cubic: 3, quint: 5, sine: 2, quad: 2 }[tok && tok.tempo && tok.tempo.ease] || 3);
  const E = (x, k) => { x = clamp(x, 0, 1); return x < 0.5 ? 0.5 * Math.pow(2 * x, k) : 1 - 0.5 * Math.pow(2 - 2 * x, k); };
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const WIN = 0.35;   // each mark's own movement lasts this fraction of its phase; the rest is stagger

  // ---------- structures: where a mark sits unsorted (A) and sorted (B) ----------
  function gridSlots(N) {
    const cols = Math.max(1, Math.round(Math.sqrt(N * FIELD.w / FIELD.h))), rows = Math.ceil(N / cols);
    const cell = Math.min(FIELD.w / cols, FIELD.h / rows);
    const ox = FIELD.x + (FIELD.w - cols * cell) / 2, oy = FIELD.y + (FIELD.h - rows * cell) / 2;
    return { cols, rows, cell, ox, oy, xy(k, o, off) { o[off] = ox + (k % cols + 0.5) * cell; o[off + 1] = oy + (Math.floor(k / cols) + 0.5) * cell; } };
  }
  const STRUCT = {
    grid(N, cat, K, counts, rng) {
      const g = gridSlots(N), A = new Float32Array(2 * N), B = new Float32Array(2 * N), next = new Int32Array(K);
      let acc = 0; const base = []; for (let k = 0; k < K; k++) { base.push(acc); acc += counts[k]; }
      for (let i = 0; i < N; i++) { g.xy(i, A, 2 * i); g.xy(base[cat[i]] + next[cat[i]]++, B, 2 * i); }
      const sz = g.cell * 0.76;
      return { A, B, szA: sz, szB: sz, grid: g, guess(gc) { // stepped outline around the first gc slots in sorted order
        const full = Math.floor(gc / g.cols), rem = gc % g.cols, x1 = g.ox + g.cols * g.cell, y = g.oy + full * g.cell;
        const pts = [[g.ox, g.oy], [x1, g.oy], [x1, y]]; if (rem > 0) pts.push([g.ox + rem * g.cell, y], [g.ox + rem * g.cell, y + g.cell], [g.ox, y + g.cell]); else pts.push([g.ox, y]);
        return { poly: pts, at: [x1, y + (rem > 0 ? g.cell : 0)] }; } };
    },
    scatter(N, cat, K, counts, rng, hlIdx) {
      const A = new Float32Array(2 * N), B = new Float32Array(2 * N), sz = clamp(Math.sqrt(FIELD.w * FIELD.h / N) * 0.5, 1.3, 7);
      const sig = Math.min(FIELD.w / K, FIELD.h) * 0.19, cx = [], cy = [];
      for (let k = 0; k < K; k++) { cx.push(FIELD.x + FIELD.w * (k + 0.5) / K); cy.push(FIELD.y + FIELD.h / 2 + (k % 2 ? -1 : 1) * FIELD.h * 0.12); }
      const gauss = () => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
      for (let i = 0; i < N; i++) {
        A[2 * i] = FIELD.x + sz + rng() * (FIELD.w - 2 * sz); A[2 * i + 1] = FIELD.y + sz + rng() * (FIELD.h - 2 * sz);
        B[2 * i] = clamp(cx[cat[i]] + gauss() * sig, FIELD.x + sz, FIELD.x + FIELD.w - sz); B[2 * i + 1] = clamp(cy[cat[i]] + gauss() * sig * 0.9, FIELD.y + sz, FIELD.y + FIELD.h - sz);
      }
      return { A, B, szA: sz, szB: sz, guess(gc, sorted) { // ring that would hold gc marks at the local density around the highlighted subset
        let mx = 0, my = 0, n = hlIdx.length; const P = sorted ? B : A;
        if (!n) { mx = FIELD.x + FIELD.w / 2; my = FIELD.y + FIELD.h / 2; } else { for (const i of hlIdx) { mx += P[2 * i]; my += P[2 * i + 1]; } mx /= n; my /= n; }
        const R0 = 70; let c = 0; for (let i = 0; i < N; i++) { const dx = P[2 * i] - mx, dy = P[2 * i + 1] - my; if (dx * dx + dy * dy < R0 * R0) c++; }
        const rho = Math.max(c, 1) / (Math.PI * R0 * R0); return { ring: [mx, my, Math.sqrt(gc / (Math.PI * rho))], at: [mx, my] }; } };
    },
    bars(N, cat, K, counts, rng) {
      const g = gridSlots(N), A = new Float32Array(2 * N), B = new Float32Array(2 * N), maxC = Math.max(...counts);
      const bw = FIELD.w / K * 0.78, gap = FIELD.w / K * 0.22, base = FIELD.y + FIELD.h;
      let c = Math.min(bw / 3, 14), cols = 1; for (; c > 0.9; c -= 0.05) { cols = Math.floor(bw / c); if (Math.ceil(maxC / cols) * c <= FIELD.h) break; }
      const next = new Int32Array(K), bx = k => FIELD.x + gap / 2 + k * (bw + gap) + (bw - cols * c) / 2;
      for (let i = 0; i < N; i++) {
        g.xy(i, A, 2 * i); const k = cat[i], s = next[k]++;
        B[2 * i] = bx(k) + (s % cols + 0.5) * c; B[2 * i + 1] = base - (Math.floor(s / cols) + 0.5) * c;
      }
      return { A, B, szA: g.cell * 0.76, szB: c * 0.8, bars: { cols, c, base }, guess(gc) { const y = base - Math.ceil(gc / cols) * c; return { poly: [[FIELD.x, y], [FIELD.x + FIELD.w, y]], at: [FIELD.x + FIELD.w, y] }; } };
    },
  };

  // ---------- GLSL: mark motion evaluated on the GPU from uniforms ----------
  const VS = `precision highp float;
attribute vec3 aPosition; attribute vec2 aS; attribute vec2 aA; attribute vec2 aB; attribute vec3 aD;
uniform vec3 uCol[8]; uniform vec4 uPh; uniform vec4 uK; uniform vec2 uHl;
varying vec3 vC;
float E(float x){ x=clamp(x,0.,1.); return x<.5 ? .5*pow(2.*x,uK.y) : 1.-.5*pow(2.-2.*x,uK.y); }
void main(){
  float w1=${WIN}*(uPh.y-uPh.x); float s1=uPh.x+aD.x*(uPh.y-uPh.x-w1); float ea=E((uK.x-s1)/w1);
  float w2=${WIN}*(uPh.w-uPh.z); float s2=uPh.z+aD.y*(uPh.w-uPh.z-w2); float es=E((uK.x-s2)/w2);
  vec2 P=aS+(aA-aS)*ea+(aB-aA)*es;
  float boost=aD.z>uHl.y ? 1.+0.6*uHl.x : 1.;
  float sz=mix(uK.z,uK.w,es)*ea*boost;
  vec2 q=P+aPosition.xy*sz;
  gl_Position=vec4(q.x/${W / 2}.-1.,1.-q.y/${H / 2}.,0.,1.);
  vC=uCol[int(aD.z+0.5)];
}`;
  const FS = `precision highp float; varying vec3 vC; void main(){ gl_FragColor=vec4(vC,1.); }`;

  // ---------- implementation resolution ----------
  function resolveImpl(p, want) {
    if (want === 'instances') {
      if (typeof p.instances === 'function') return { impl: 'webgl', note: 'p.instances() exists on this build, but per-instance state needs a strands hook not wired here; using the baked path' };
      return { impl: 'webgl', note: 'p.instances() absent (unreleased on 2.3.4); fell back to the baked buildGeometry path' };
    }
    return { impl: want === 'webgl' ? 'webgl' : 'canvas2d', note: '' };
  }

  const pattern = {
    id: 'mass', atlas: ['gpu-instancing', 'performance-profiling', 'pixels-array', 'build-geometry', 'webgl-mode', 'p5-framebuffer', 'perf-regressions-2x'],
    renderer: 'p2d',
    rendererFor(params) { return params.impl === 'canvas2d' || params.impl === 'shape' ? 'p2d' : 'webgl'; },
    params: {
      N: 1000, structure: 'grid', impl: 'canvas2d', dur: 8, mix: [0.4, 0.35, 0.25], labels: ['A', 'B', 'C'],
      sort: true, hlFrac: 0, guess: 0.3, phase: { arrive: [0.02, 0.32], sort: [0.4, 0.62], hl: [0.66, 0.76], guess: [0.8, 0.9] },
    },
    variants: [
      { name: 'grid-1000', params: { N: 1000, structure: 'grid', impl: 'canvas2d', mix: [0.4, 0.35, 0.25], sort: true, hlFrac: 0, guess: 300 } },
      { name: 'scatter-10000', params: { N: 10000, structure: 'scatter', impl: 'canvas2d', mix: [0.45, 0.3, 0.25], sort: true, hlFrac: 0.04, guess: 600, phase: { arrive: [0.02, 0.28], sort: [0.34, 0.56], hl: [0.6, 0.72], guess: [0.78, 0.9] } } },
      { name: 'bars-50000', params: { N: 50000, structure: 'bars', impl: 'webgl', mix: [0.5, 0.3, 0.2], sort: true, hlFrac: 0, guess: 17500 } },
    ],

    setup(p, ctx, params) {
      params = Object.assign({}, pattern.params, params); const N = params.N, K = params.mix.length, rng = mulberry32(ctx.seed >>> 0);
      const counts = params.mix.map(m => Math.round(N * m)); counts[K - 1] += N - counts.reduce((a, b) => a + b, 0);
      const cat = new Uint8Array(N); { let i = 0; for (let k = 0; k < K; k++) for (let c = 0; c < counts[k]; c++) cat[i++] = k;
        for (let i = N - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)), t = cat[i]; cat[i] = cat[j]; cat[j] = t; } }
      const hlN = Math.round(N * params.hlFrac), hlIdx = [], hlFlag = new Uint8Array(N);
      if (hlN) { const pick = new Int32Array(N); for (let i = 0; i < N; i++) pick[i] = i; for (let i = 0; i < hlN; i++) { const j = i + Math.floor(rng() * (N - i)), t = pick[i]; pick[i] = pick[j]; pick[j] = t; hlIdx.push(pick[i]); hlFlag[pick[i]] = 1; } }
      const S = STRUCT[params.structure](N, cat, K, counts, rng, hlIdx);
      if (!params.sort) S.B = S.A;
      const Sx = new Float32Array(2 * N), D = new Float32Array(3 * N), group = new Uint8Array(N);
      for (let i = 0; i < N; i++) { Sx[2 * i] = S.A[2 * i]; Sx[2 * i + 1] = -12 - rng() * 140; D[3 * i] = rng(); D[3 * i + 1] = rng(); group[i] = cat[i] + (hlFlag[i] ? K : 0); D[3 * i + 2] = group[i]; }
      const lists = []; for (let g = 0; g < 2 * K; g++) lists.push([]); for (let i = 0; i < N; i++) lists[group[i]].push(i);
      const r = resolveImpl(p, params.impl), st = { N, K, counts, cat, hlIdx, hlN, S, Sx, D, group, lists: lists.map(a => Int32Array.from(a)), impl: r.impl, asked: params.impl, note: r.note, params, seed: ctx.seed };
      const t0 = performance.now();
      if (r.impl === 'webgl') {
        st.shader = p.createShader(VS, FS);
        // p5 2.3.4 overflows the stack spreading large face arrays (about 20k+ marks per build), so bake in chunks
        st.geoms = []; const CH = window.__CH || 4000, cs = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
        for (let i0 = 0; i0 < N; i0 += CH) st.geoms.push(p.buildGeometry(() => {
          p.noStroke(); p.beginShape(p.QUADS);
          for (let i = i0; i < Math.min(N, i0 + CH); i++) for (let c = 0; c < 4; c++) {
            p.vertexProperty('aS', [Sx[2 * i], Sx[2 * i + 1]]); p.vertexProperty('aA', [S.A[2 * i], S.A[2 * i + 1]]);
            p.vertexProperty('aB', [S.B[2 * i], S.B[2 * i + 1]]); p.vertexProperty('aD', [D[3 * i], D[3 * i + 1], D[3 * i + 2]]);
            p.vertex(cs[c][0], cs[c][1]);
          }
          p.endShape();
        }));
        st.over = p.createGraphics(W, OVH); st.over.pixelDensity(2);
      }
      st.setup_ms = performance.now() - t0;
      return st;
    },

    draw(p, t, st, params, tokens) {
      params = Object.assign({}, pattern.params, st.params, params || {}); const ph = params.phase, tn = clamp(t / params.dur, 0, 1), k = easeK(tokens), K = st.K;
      const C = tokens.color, bg = parseColor(C.bg), accent = parseColor(C.accent);
      const catRoles = ['ink', 'muted', 'accent2', 'chalk'], catCol = []; for (let i = 0; i < K; i++) catCol.push(parseColor(C[catRoles[i]]));
      const hlk = st.hlN ? E((tn - ph.hl[0]) / (ph.hl[1] - ph.hl[0]), k) : 0, cols = [];
      for (let g = 0; g < K; g++) cols.push(mixRGB(catCol[g], bg, 0.76 * hlk));
      for (let g = 0; g < K; g++) cols.push(mixRGB(catCol[g], accent, hlk));
      const sortPh = params.sort ? ph.sort : [3, 4], S = st.S;
      p.push(); p.background(C.bg);
      if (st.impl === 'webgl') {
        p.noStroke(); p.shader(st.shader);
        const flat = []; for (let g = 0; g < 8; g++) { const c = cols[g] || [0, 0, 0]; flat.push(c[0] / 255, c[1] / 255, c[2] / 255); }
        st.shader.setUniform('uCol', flat); st.shader.setUniform('uPh', [ph.arrive[0], ph.arrive[1], sortPh[0], sortPh[1]]);
        st.shader.setUniform('uK', [tn, k, S.szA, S.szB]); st.shader.setUniform('uHl', [hlk, K - 0.5]);
        for (const gm of st.geoms) p.model(gm); p.resetShader();
      } else {
        const ctx = p.drawingContext, a0 = ph.arrive[0], a1 = ph.arrive[1], s0 = sortPh[0], s1 = sortPh[1], wa = WIN * (a1 - a0), ws = WIN * (s1 - s0);
        const shape = params.impl === 'shape';
        for (let g = 0; g < 2 * K; g++) {
          const L = st.lists[g]; if (!L.length) continue; const boost = g >= K ? 1 + 0.6 * hlk : 1;
          if (shape) { p.noStroke(); p.fill(css(cols[g])); p.beginShape(p.QUADS); } else { ctx.fillStyle = css(cols[g]); ctx.beginPath(); }
          for (let j = 0; j < L.length; j++) {
            const i = L[j], d = st.D[3 * i], e = st.D[3 * i + 1];
            const ea = E((tn - (a0 + d * (a1 - a0 - wa))) / wa, k); if (ea <= 0) continue;
            const es = E((tn - (s0 + e * (s1 - s0 - ws))) / ws, k);
            const x = st.Sx[2 * i] + (S.A[2 * i] - st.Sx[2 * i]) * ea + (S.B[2 * i] - S.A[2 * i]) * es;
            const y = st.Sx[2 * i + 1] + (S.A[2 * i + 1] - st.Sx[2 * i + 1]) * ea + (S.B[2 * i + 1] - S.A[2 * i + 1]) * es;
            const s = mix(S.szA, S.szB, es) * ea * boost, h = s / 2;
            if (shape) { p.vertex(x - h, y - h); p.vertex(x + h, y - h); p.vertex(x + h, y + h); p.vertex(x - h, y + h); } else ctx.rect(x - h, y - h, s, s);
          }
          if (shape) p.endShape(); else ctx.fill();
        }
      }
      p.pop();
      if (st.impl === 'webgl') {
        st.over.clear(); pattern.overlay(st.over, tn, st, params, tokens); p.push(); p.image(st.over, -W / 2, -H / 2, W, OVH); p.translate(-W / 2, -H / 2); pattern.annotate(p, tn, st, params, tokens); p.pop();
      } else { pattern.overlay(p, tn, st, params, tokens); pattern.annotate(p, tn, st, params, tokens); }
    },

    // text lives in the top band (the only region a WEBGL canvas needs as a 2D overlay texture: uploading a full-canvas
    // texture every frame cost ~0.8 s/frame in headless software GL)
    overlay(g, tn, st, params, tokens) {
      const C = tokens.color, T = tokens.type, ph = params.phase, K = st.K, k = easeK(tokens);
      g.push(); g.noStroke(); g.fill(C.ink); g.textFont(T.disp.family); g.textSize(30); g.textAlign(g.LEFT, g.BASELINE); g.text(fmt(st.N) + ' marks', FIELD.x - 8, 54);
      const gk = E((tn - ph.guess[0]) / (ph.guess[1] - ph.guess[0]), k), settled = tn >= (params.sort ? ph.sort[1] : ph.arrive[1]);
      const cap = tn < ph.arrive[1] ? 'arriving' : (params.sort && tn < ph.sort[1] ? 'sorting' : (st.hlN && tn < ph.hl[1] + 0.02 ? 'highlight' : (gk > 0 ? 'your guess' : 'in place')));
      g.fill(C.muted); g.textFont(T.mono.family); g.textSize(12); g.text(params.structure + ' \u00b7 ' + cap, FIELD.x - 8, 76);
      g.textAlign(g.LEFT, g.BASELINE);
      if (settled) { // category legend at fixed columns (counts appear once the structure has settled)
        const roles = ['ink', 'muted', 'accent2', 'chalk'];
        for (let i = 0; i < K; i++) { const x = 330 + i * 120; g.fill(C[roles[i]]); g.rect(x, 67, 9, 9); g.fill(C.muted); g.text(params.labels[i] + ' ' + fmt(st.counts[i]), x + 15, 76); }
      }
      if (gk > 0 && params.guess) {
        g.fill(C.chalk); g.textSize(14); g.text('your guess ' + fmt(params.guess), 740, 40);
        if (tn > ph.guess[1]) { g.fill(C.accent); g.text('actual ' + fmt(st.hlN ? st.hlN : st.counts[0]), 740, 58); }
      }
      g.pop();
    },
    // strokes (frame, guess marker): plain p5 calls with alpha in the stroke colour, origin at the canvas top-left
    annotate(g, tn, st, params, tokens) {
      const C = tokens.color, ph = params.phase, k = easeK(tokens), gk = E((tn - ph.guess[0]) / (ph.guess[1] - ph.guess[0]), k);
      g.push(); g.noFill(); g.stroke(C.line); g.strokeWeight(1); g.rect(FIELD.x - 8, FIELD.y - 8, FIELD.w + 16, FIELD.h + 16);
      if (gk > 0 && params.guess) {
        const o = st.S.guess(params.guess, params.sort), c = parseColor(C.chalk); g.stroke(c[0], c[1], c[2], 255 * gk); g.strokeWeight(1.5);
        if (o.poly) { g.beginShape(); for (const q of o.poly) g.vertex(q[0], q[1]); if (params.structure === 'grid') g.endShape(g.CLOSE); else g.endShape(); }
        if (o.ring) g.circle(o.ring[0], o.ring[1], o.ring[2] * 2);
      }
      g.pop();
    },
  };
  ARSENAL.patterns.mass = pattern;
})();
