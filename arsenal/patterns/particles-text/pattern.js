/* particles-text: words, numerals and shapes assembled from particles. Pure function of t.
   Stages (text via textToPoints / textToContours, or @ring @line @scatter @grid) are sampled to N points in setup;
   each particle follows a quadratic path stage -> stage with an eased arrival and a per-particle delay from a
   stagger field (x | dist | noise | rand). Token roles only. Fonts: shared TTF data URLs from morph-type/fonts/fonts.js. */
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const EASE = {
    linear: u => u, quad: u => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
    cubic: u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
    expo: u => (u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2),
    sine: u => -(Math.cos(Math.PI * u) - 1) / 2,
  };
  const fmtInt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  function fontKey(role) {
    const F = window.MORPH_FONTS || {}, k = role.family + '|' + role.weight;
    if (F[k]) return k;
    const same = Object.keys(F).filter(x => x.split('|')[0] === role.family);
    return same.length ? same[0] : Object.keys(F)[0];
  }

  // ---- stage samplers: each returns { x: Float32Array(N), y: Float32Array(N), r (dot radius), shape: bool } -----
  const pack = (pts, N) => { const x = new Float32Array(N), y = new Float32Array(N); for (let i = 0; i < N; i++) { x[i] = pts[i][0]; y[i] = pts[i][1]; } return { x, y }; };

  function sampleScatter(N, W, H, rnd) {
    const pts = []; for (let i = 0; i < N; i++) pts.push([lerp(40, W - 40, rnd()), lerp(40, H - 40, rnd())]);
    return { ...pack(pts, N), r: 1.6, shape: true };
  }
  function sampleLine(N, W, H, rnd, y0) {
    const pts = []; for (let i = 0; i < N; i++) pts.push([lerp(60, W - 60, (i + 0.5) / N), y0 + (rnd() - 0.5) * 2]);
    return { ...pack(pts, N), r: 1.5, shape: true };
  }
  function sampleGrid(N, W, H) {
    const asp = 1.6, cols = Math.round(Math.sqrt(N * asp)), rows = Math.ceil(N / cols), gw = Math.min(W - 160, 640), cell = gw / cols, gh = cell * rows;
    const pts = []; for (let i = 0; i < N; i++) pts.push([W / 2 - gw / 2 + cell * (0.5 + (i % cols)), H / 2 - gh / 2 + cell * (0.5 + Math.floor(i / cols))]);
    return { ...pack(pts, N), r: clamp(cell * 0.3, 1.1, 3), shape: true };
  }
  function sampleRing(N, W, H, rnd, R, rings, gap) {
    const radii = Array.from({ length: rings }, (_, k) => R - k * gap), tot = radii.reduce((a, b) => a + b, 0), pts = [];
    radii.forEach((r, k) => { const n = k === rings - 1 ? N - pts.length : Math.round(N * r / tot); for (let i = 0; i < n; i++) { const a = (i / n) * 6.2832 + k * 0.4; pts.push([W / 2 + Math.cos(a) * r, H / 2 + Math.sin(a) * r]); } });
    return { ...pack(pts, N), r: 1.9, shape: true };
  }

  // even-odd containment over all contour edges (px basis)
  function insideEO(edges, x, y) {
    let c = false;
    for (let i = 0; i < edges.length; i += 4) {
      const x0 = edges[i], y0 = edges[i + 1], x1 = edges[i + 2], y1 = edges[i + 3];
      if ((y0 > y) !== (y1 > y) && x < ((x1 - x0) * (y - y0)) / (y1 - y0) + x0) c = !c;
    }
    return c;
  }
  // N points filling the glyphs: jittered hex grid kept inside the outline, thinned by even stride to exactly N
  function fillPoints(contours, N, rnd) {
    const edges = []; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const c of contours) for (let i = 0; i < c.length; i++) { const a = c[i], b = c[(i + 1) % c.length]; edges.push(a.x, a.y, b.x, b.y); x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); }
    let s = Math.sqrt(((x1 - x0) * (y1 - y0) * 0.55) / N), pts = [];
    for (let it = 0; it < 12; it++) {
      pts = []; const rh = s * 0.866;
      for (let r = 0, y = y0 + rh / 2; y < y1; y += rh, r++) for (let x = x0 + (r & 1 ? s : s / 2); x < x1; x += s) {
        const px = x + (rnd() - 0.5) * s * 0.4, py = y + (rnd() - 0.5) * s * 0.4;
        if (insideEO(edges, px, py)) pts.push([px, py]);
      }
      if (pts.length >= N && pts.length <= N * 1.1) break;
      s *= Math.sqrt(pts.length / (N * 1.04 || 1)) || 0.9; if (pts.length < N) s *= 0.97;
    }
    while (pts.length < N) pts.push(pts[pts.length % Math.max(1, pts.length)] || [0, 0]);
    const out = []; for (let i = 0; i < N; i++) out.push(pts[Math.floor((i * pts.length) / N)]);
    return { pts: out, spacing: s };
  }
  // N points along the outline from textToPoints, picked by even stride
  function outlinePoints(font, str, N) {
    let sf = 1, pts = [];
    for (let it = 0; it < 7; it++) { pts = font.textToPoints(str, 0, 0, { sampleFactor: sf }); if (pts.length >= N) break; sf *= 1.7; }
    const out = []; for (let i = 0; i < N; i++) { const q = pts[Math.floor((i * pts.length) / N)] || { x: 0, y: 0 }; out.push([q.x, q.y]); }
    return out;
  }

  // ---- seeded value noise for the 'noise' stagger field --------------------------------------------
  function makeNoise(rnd) {
    const n = 32, g = new Float32Array(n * n); for (let i = 0; i < g.length; i++) g[i] = rnd();
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      const h = (a, b) => g[(((b % n) + n) % n) * n + (((a % n) + n) % n)];
      return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v);
    };
  }

  const P = {
    id: 'particles-text', atlas: ['text-to-points', 'seeded-determinism', 'easing-functions', 'text-to-contours', 'load-font', 'pure-function-of-t', 'kinetic-typography'], renderer: 'p2d',
    params: {
      seq: ['@scatter', 'TOKENS', 'VECTORS', 'MEANING'],  // stages: '@scatter' '@line' '@grid' '@ring', '#N' (the count as a numeral), or text
      n: 1400,             // particles (200-3000); cost is linear
      font: 'disp', sample: 'fill',   // 'fill' (points inside glyphs) | 'outline' (textToPoints along the stroke)
      size: 230, maxW: 780, yoff: 0,  // glyph cap-height cap (px), max string width (px), vertical offset (px)
      lead_s: 0.2, move_s: 1.4, hold_s: 1.2,   // wait before the first move, flight window, hold after each arrival
      stagger: 0.5,        // 0-0.85 share of move_s spent in per-particle delay
      field: 'x',          // stagger field: 'x' | 'dist' | 'noise' | 'rand'
      field_inv: false,    // reverse the field (right-to-left, inside-out)
      noise_freq: 3,       // noise cells across the canvas width (1-8)
      match: 'sort',       // particle -> target pairing: 'sort' (x rank, short paths) | 'shuffle' | 'angle' (around centre)
      curl: 0.35,          // 0-1 sideways bow of each path (dispersal swirl)
      spread: 40,          // px of scatter at the path midpoint (the cloud a word breaks into)
      dot: 0,              // dot radius px; 0 = auto from point spacing
      jitter: 0.9,         // px of settled shimmer
      appear_s: 0,         // >0: particles pop in one by one over this many seconds (the counted things)
      ring_r: 175, rings: 3, ring_gap: 14,
      kicker: 'PARTICLES', caption: 'ASSEMBLE, HOLD, DISPERSE', readout: false,
    },
    variants: [
      { name: 'word-chain', params: {} },
      { name: 'count-1000', params: { seq: ['@grid', '#N'], n: 1000, appear_s: 1.3, lead_s: 1.8, move_s: 2.2, hold_s: 3, stagger: 0.6, field: 'dist', field_inv: true, match: 'sort', size: 210, curl: 0.2, spread: 25, kicker: 'ONE PARTICLE PER THING COUNTED', caption: '', readout: true } },
      { name: 'ring-to-headline', params: { seq: ['@ring', 'WHAT MATTERS'], n: 2200, dot: 1.3, lead_s: 1.2, move_s: 2.6, hold_s: 3, stagger: 0.7, field: 'noise', noise_freq: 4, match: 'angle', size: 120, curl: 0.8, spread: 90, kicker: 'A RING, THEN A HEADLINE', caption: 'STAGGER FIELD: SEEDED NOISE' } },
      { name: 'line-outline', params: { seq: ['@line', 'ATTEND', 'RETRIEVE'], sample: 'outline', n: 1100, font: 'mono', size: 150, maxW: 760, lead_s: 0.3, move_s: 1.6, hold_s: 1.1, stagger: 0.55, field: 'dist', field_inv: false, curl: 0.5, spread: 55, kicker: 'OUTLINE VIA textToPoints', caption: 'STAGGER FIELD: DISTANCE FROM CENTRE' } },
    ],

    async setup(p, ctx, params) {
      const tok = ctx.tokens, rnd = mulberry32(ctx.seed >>> 0), W = ctx.W || 960, H = ctx.H || 540, N = Math.round(params.n);
      const fonts = {};
      for (const role of ['disp', 'mono']) fonts[role] = await p.loadFont(window.MORPH_FONTS[fontKey(tok.type[role])]);   // TTF data URL (see card)
      const f = fonts[params.font], S0 = 200;
      p.textFont(f); p.textSize(S0);
      const capH0 = (() => { const c = f.textToContours('H', 0, 0, { sampleFactor: 1 }); let a = 1e9; for (const k of c) for (const q of k) a = Math.min(a, q.y); return -a; })();

      const textStage = (str) => {
        const raw = f.textToContours(str, 0, 0, { sampleFactor: 1 });
        let bx0 = 1e9, bx1 = -1e9; for (const k of raw) for (const q of k) { bx0 = Math.min(bx0, q.x); bx1 = Math.max(bx1, q.x); }
        const s = Math.min(params.size / capH0, params.maxW / (bx1 - bx0)), mx = (bx0 + bx1) / 2, cx = W / 2, cy = H / 2 + params.yoff;
        const tf = (q) => [(q.x - mx) * s + cx, (q.y + capH0 / 2) * s + cy];
        let pts, spacing;
        if (params.sample === 'outline') {
          const o = outlinePoints(f, str, N); pts = o.map(q => tf({ x: q[0], y: q[1] }));
          let len = 0; for (let i = 1; i < N; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); spacing = Math.max(1.5, len / N * 1.4);
        } else {
          const sc = raw.map(k => k.map(q => ({ x: (q.x - mx) * s + cx, y: (q.y + capH0 / 2) * s + cy })));
          const r = fillPoints(sc, N, rnd); pts = r.pts; spacing = r.spacing;
        }
        return { ...pack(pts, N), r: params.dot || clamp(spacing * 0.36, 1.1, 3.2), shape: false, spacing };
      };

      const stages = params.seq.map(tk => {
        if (tk === '@scatter') return sampleScatter(N, W, H, rnd);
        if (tk === '@line') return sampleLine(N, W, H, rnd, H / 2);
        if (tk === '@grid') return sampleGrid(N, W, H);
        if (tk === '@ring') return sampleRing(N, W, H, rnd, params.ring_r, params.rings, params.ring_gap);
        return textStage(tk === '#N' ? fmtInt(N) : tk);
      });
      if (params.dot) stages.forEach(s => { s.r = params.dot; });

      // pair particles with targets stage by stage; particle identity = index in stage 0
      const order = (st) => { const idx = Array.from({ length: N }, (_, i) => i); idx.sort((a, b) => st.x[a] - st.x[b] || st.y[a] - st.y[b]); return idx; };
      const angOrder = (st) => { const idx = Array.from({ length: N }, (_, i) => i), cx = W / 2, cy = H / 2, an = i => Math.atan2(st.y[i] - cy, st.x[i] - cx); idx.sort((a, b) => an(a) - an(b)); return idx; };
      const X = [stages[0].x], Y = [stages[0].y];
      for (let k = 1; k < stages.length; k++) {
        const st = stages[k], px = X[k - 1], py = Y[k - 1], tx = new Float32Array(N), ty = new Float32Array(N);
        let srcOrder, dstOrder;
        if (params.match === 'shuffle') { dstOrder = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [dstOrder[i], dstOrder[j]] = [dstOrder[j], dstOrder[i]]; } srcOrder = Array.from({ length: N }, (_, i) => i); }
        else if (params.match === 'angle') { srcOrder = angOrder({ x: px, y: py }); dstOrder = angOrder(st); }
        else { srcOrder = order({ x: px, y: py }); dstOrder = order(st); }
        for (let r = 0; r < N; r++) { tx[srcOrder[r]] = st.x[dstOrder[r]]; ty[srcOrder[r]] = st.y[dstOrder[r]]; }
        X.push(tx); Y.push(ty);
      }

      // per-transition path control points and stagger delays (all seeded here)
      const noise = makeNoise(rnd), trans = [], inv = params.field_inv;
      for (let k = 0; k < stages.length - 1; k++) {
        const sx = X[k], sy = Y[k], tx = X[k + 1], ty = Y[k + 1], cx = new Float32Array(N), cy = new Float32Array(N), dl = new Float32Array(N);
        let maxd = 1; if (params.field === 'dist') { maxd = 0; for (let i = 0; i < N; i++) maxd = Math.max(maxd, Math.hypot(tx[i] - W / 2, ty[i] - H / 2)); }
        for (let i = 0; i < N; i++) {
          const mx = (sx[i] + tx[i]) / 2, my = (sy[i] + ty[i]) / 2, dx = tx[i] - sx[i], dy = ty[i] - sy[i], L = Math.hypot(dx, dy) || 1;
          const side = (rnd() - 0.5) * 2 * params.curl * L * 0.5, gx = rnd() + rnd() + rnd() - 1.5, gy = rnd() + rnd() + rnd() - 1.5;
          cx[i] = mx - (dy / L) * side + gx * params.spread * 1.3; cy[i] = my + (dx / L) * side + gy * params.spread * 1.3;
          let d;
          if (params.field === 'x') d = clamp((tx[i] - 80) / (W - 160));
          else if (params.field === 'dist') d = Math.hypot(tx[i] - W / 2, ty[i] - H / 2) / maxd;
          else if (params.field === 'noise') d = noise(tx[i] / W * params.noise_freq + 3.1, ty[i] / W * params.noise_freq + 5.7);
          else d = rnd();
          dl[i] = inv ? 1 - d : d;
        }
        trans.push({ sx, sy, tx, ty, cx, cy, dl });
      }
      const ph = new Float32Array(N * 2), spark = new Uint8Array(N); for (let i = 0; i < N; i++) { ph[2 * i] = rnd() * 6.2832; ph[2 * i + 1] = 0.6 + rnd() * 1.4; spark[i] = rnd() < 0.07 ? 1 : 0; }
      return { W, H, N, fonts, stages, X, Y, trans, ph, spark, ease: EASE[tok.tempo && tok.tempo.ease] || EASE.cubic, seqLabels: params.seq };
    },

    draw(p, t, st, params, tokens) {
      const c = tokens.color, W = st.W, H = st.H, N = st.N, g = p.drawingContext, ease = st.ease, K = st.trans.length;
      p.background(c.bg);
      const mono = st.fonts.mono;
      const label = (s, x, y, col, align, size) => { p.push(); p.textFont(mono); p.textSize(size || 12); p.noStroke(); p.fill(col); p.textAlign(align || p.LEFT, p.BASELINE); p.text(s, x, y); p.pop(); };
      label(params.kicker, 48, 52, c.accent);
      const per = params.move_s + params.hold_s;
      let k = Math.floor((t - params.lead_s) / per); k = Math.min(K - 1, k);          // k < 0: before the first move
      const tau = t - params.lead_s - Math.max(k, 0) * per;                          // time since transition k began
      const span = params.move_s * (1 - params.stagger), maxDelay = params.move_s * params.stagger;
      const stage0 = k < 0, tr = stage0 ? null : st.trans[k];
      const stageNow = stage0 ? 0 : (tau >= params.move_s ? k + 1 : -1);             // -1: some particles in flight
      const shapeNow = stageNow >= 0 ? st.stages[stageNow].shape : false;
      const rA = stage0 ? st.stages[0].r : st.stages[k].r, rB = stage0 ? rA : st.stages[k + 1].r;
      const sx = stage0 ? st.X[0] : null;
      const jit = params.jitter, ph = st.ph;
      const birthSpan = params.appear_s, counted = birthSpan > 0 ? clamp(t / birthSpan) * N : N;
      // three buckets: settled (ink or muted), moving (accent), sparks (accent2)
      const buckets = [[], [], []];   // flat x,y,r
      for (let i = 0; i < N; i++) {
        let x, y, r, moving = false;
        if (stage0 || stageNow === 0) { x = sx[i]; y = sy0(st, i, 0); r = rA; }
        else if (stageNow > 0) { x = st.X[stageNow][i]; y = st.Y[stageNow][i]; r = st.stages[stageNow].r; }
        else {
          const lu = clamp((tau - tr.dl[i] * maxDelay) / span), u = ease(lu);
          if (lu <= 0) { x = tr.sx[i]; y = tr.sy[i]; r = rA; }
          else if (lu >= 1) { x = tr.tx[i]; y = tr.ty[i]; r = rB; }
          else {
            const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u;
            x = a * tr.sx[i] + b * tr.cx[i] + d * tr.tx[i]; y = a * tr.sy[i] + b * tr.cy[i] + d * tr.ty[i]; r = lerp(rA, rB, u); moving = true;
          }
        }
        if (!moving) { x += Math.sin(t * ph[2 * i + 1] + ph[2 * i]) * jit; y += Math.cos(t * ph[2 * i + 1] * 0.8 + ph[2 * i]) * jit; }
        if (birthSpan > 0 && stage0) { const born = smooth(0, 1, counted - i); if (born <= 0) continue; r *= born; }
        const b = moving ? 1 : (st.spark[i] ? 2 : 0), arr = buckets[b]; arr.push(x, y, r);
      }
      const dots = (arr, col) => { if (!arr.length) return; g.fillStyle = col; g.beginPath(); for (let j = 0; j < arr.length; j += 3) { g.moveTo(arr[j] + arr[j + 2], arr[j + 1]); g.arc(arr[j], arr[j + 1], arr[j + 2], 0, 6.2832); } g.fill(); };
      g.save();
      dots(buckets[0], shapeNow ? c.muted : c.ink);
      dots(buckets[2], c.accent2);
      dots(buckets[1], c.accent);
      g.restore();

      // readout (count variant): the number of things counted, committed only when the numeral forms
      if (params.readout) {
        const done = !stage0 && stageNow === K;
        const n = Math.floor(counted);
        if (done) label('= ' + fmtInt(N) + ' PARTICLES, ONE PER THING', 48, H - 40, c.ink);
        else label((stage0 ? 'COUNTED  ' + fmtInt(n) : 'N = ' + fmtInt(N)), 48, H - 40, c.muted);
      } else if (params.caption) label(params.caption, 48, H - 40, c.muted);
      label(String(Math.max(0, Math.min(st.stages.length - 1, stageNow >= 0 ? stageNow : (k + (tau / params.move_s > 0.5 ? 1 : 0)))) + 1).padStart(2, '0') + ' / ' + String(st.stages.length).padStart(2, '0'), W - 48, H - 40, c.ink, p.RIGHT);
    },
  };
  function sy0(st, i, s) { return st.Y[s][i]; }
  ARSENAL.patterns['particles-text'] = P;
})();
