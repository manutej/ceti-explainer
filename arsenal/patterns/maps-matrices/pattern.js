/* maps-matrices: two-dimensional fields as explainer structures. Counts first, then colour.
   Atlas: noise, lerp-color, color-spaces-2x, pixels-array.
   Modes: confusion (2x2 / nxn, marks inside cells), heatmap (reveal by value, legend counts bins first),
   territory (seeded noise coastline on hex or square cells, regions light by t, a route walks the cells),
   adjacency (matrix <-> node graph, node positions interpolated).
   Roles only: no colour literal in this file. Ramps are OKLCH built from tokens.color.accent in setup (own maths,
   so no p5 colour objects are created and nothing is lerped per frame). Drawing goes through drawingContext in the
   960-unit basis. noise() is read only in setup, after noiseSeed(seed), so draw is a pure function of t. */
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const EASE = { linear: x => x, quad: x => 1 - (1 - x) * (1 - x), cubic: x => 1 - Math.pow(1 - x, 3), expo: x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)), sine: x => Math.sin(x * Math.PI / 2) };
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* ---- OKLCH, own maths ---- */
  const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)), gam = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  function toLCH(hex) {
    const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(hex.substr(i, 2), 16) / 255));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.hypot(a, bb), (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360];
  }
  function fromLCH(L, C, h) {
    for (let k = 0; k < 24; k++) {
      const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
      const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3), m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3), s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
      const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
      if (rgb.every(v => v > -0.001 && v < 1.001)) return 'rgb(' + rgb.map(v => Math.round(255 * gam(clamp(v, 0, 1)))).join(',') + ')';
      C *= 0.94;
    }
    return 'rgb(128,128,128)';
  }
  /* sequential ramp: panel-ish low end -> accent (u .6) -> a deeper/lighter accent. Hue is held at the accent's. */
  function makeRamp(tk, n) {
    const c = tk.color, acc = toLCH(c.accent), pan = toLCH(c.panel), dark = toLCH(c.bg)[0] < 0.55;
    const s0 = [pan[0] + (dark ? 0.03 : -0.05), acc[1] * 0.14, acc[2]], s1 = acc;
    const s2 = [dark ? Math.min(0.97, acc[0] + 0.2) : Math.max(0.2, acc[0] - 0.3), acc[1] * 0.6, acc[2]];
    return Array.from({ length: n }, (_, i) => {
      const u = i / (n - 1), a = u < 0.6 ? s0 : s1, b = u < 0.6 ? s1 : s2, f = u < 0.6 ? u / 0.6 : (u - 0.6) / 0.4;
      return fromLCH(lerp(a[0], b[0], f), lerp(a[1], b[1], f), acc[2]);
    });
  }

  /* ---- drawing helpers ---- */
  function txt(ctx, tk, role, s, x, y, size, color, align, alpha) {
    const f = tk.type[role]; ctx.font = f.weight + ' ' + size + 'px "' + f.family + '"';
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = color; ctx.fillText(s, x, y); ctx.globalAlpha = 1;
  }
  function frame(st, ctx, tk, t, params, caps) {
    const c = tk.color; ctx.fillStyle = c.bg; ctx.fillRect(0, 0, 960, 540);
    const a = st.ease(seg(t, 0, 0.5));
    txt(ctx, tk, 'mono', params.kicker.toUpperCase(), 48, 36, 11, c.muted, 'left', a);
    txt(ctx, tk, 'disp', params.title, 48, 72, 32, c.ink, 'left', a);
    for (const cp of caps) {
      const f = Math.min(seg(t, cp[0], cp[0] + 0.25), 1 - seg(t, cp[1] - 0.2, cp[1]));
      if (f > 0) txt(ctx, tk, 'body', cp[2], 48, 520, 14, c.ink, 'left', f);
    }
  }
  const tick = (n, u) => Math.round(n * u);
  function poly(ctx, x, y, off) { ctx.beginPath(); ctx.moveTo(x + off[0][0], y + off[0][1]); for (let k = 1; k < off.length; k++) ctx.lineTo(x + off[k][0], y + off[k][1]); ctx.closePath(); }
  function cross(ctx, x, y, h) { ctx.beginPath(); ctx.moveTo(x - h, y - h); ctx.lineTo(x + h, y + h); ctx.moveTo(x + h, y - h); ctx.lineTo(x - h, y + h); ctx.stroke(); }

  /* ================= CONFUSION ================= */
  function setupConf(p, rng, params, tk) {
    const n = params.classes; let M;
    if (n === 2) M = [[38, 22], [12, 128]];
    else { M = []; for (let i = 0; i < n; i++) { M.push([]); for (let j = 0; j < n; j++) M[i].push(i === j ? 22 + Math.floor(rng() * 18) : (rng() < 0.5 ? Math.floor(rng() * 4) : 3 + Math.floor(rng() * 11))); } }
    const W = n === 2 ? 190 : 94, H = n === 2 ? 150 : 78, pm = params.markPitch, cols = Math.floor((W - 16) / pm), rows = Math.floor((H - 38) / pm);
    const mx = Math.max(...M.flat()), k = Math.max(1, Math.ceil(mx / (cols * rows)));
    const tot = M.flat().reduce((a, b) => a + b, 0), tr = M.reduce((a, r, i) => a + r[i], 0);
    return { n, M, W, H, pm, cols, rows, k, tot, tr, colSum: M[0].map((_, j) => M.reduce((a, r) => a + r[j], 0)), rowSum: M.map(r => r.reduce((a, b) => a + b, 0)), names: n === 2 ? ['yes', 'no'] : ['A', 'B', 'C', 'D'], tags: n === 2 ? [['TP', 'FN'], ['FP', 'TN']] : null };
  }
  function drawConf(st, ctx, tk, t, params) {
    const c = tk.color, { n, M, W, H, pm, cols, k, tot, tr } = st, x0 = 190, y0 = 140, nc = n * n;
    const caps = [[0.1, 1.0, 'Every case is one mark. Count them before reading any rate.'], [1.0, 4.3, 'Marks fill each cell: a dot for a right call, a cross for a wrong one.'], [4.3, 6.1, 'Same marks, read two ways: of what was called yes, how many were right; of what was yes, how many were found.']];
    frame(st, ctx, tk, t, params, caps);
    const totU = st.ease(seg(t, 0.15, 0.9));
    txt(ctx, tk, 'disp', String(tick(tot, totU)), 620, 190, 64, c.ink, 'left', st.ease(seg(t, 0.1, 0.4)));
    txt(ctx, tk, 'mono', 'cases · 1 mark = ' + k + (k === 1 ? ' case' : ' cases'), 620, 214, 12, c.muted, 'left', st.ease(seg(t, 0.3, 0.7)));
    const ka = st.ease(seg(t, 0.5, 0.9));
    ctx.globalAlpha = ka; ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(628, 246, 4, 0, 6.283); ctx.fill();
    ctx.strokeStyle = c.accent2; ctx.lineWidth = 1.8; cross(ctx, 628, 270, 3.6); ctx.globalAlpha = 1;
    txt(ctx, tk, 'body', 'right call', 644, 250, 13, c.ink, 'left', ka); txt(ctx, tk, 'body', 'wrong call', 644, 274, 13, c.ink, 'left', ka);
    txt(ctx, tk, 'mono', 'PREDICTED', x0 + n * W / 2, y0 - 34, 11, c.muted, 'center', st.ease(seg(t, 0.2, 0.6)));
    ctx.save(); ctx.translate(x0 - (n === 2 ? 66 : 56), y0 + n * H / 2); ctx.rotate(-Math.PI / 2); txt(ctx, tk, 'mono', 'ACTUAL', 0, 0, 11, c.muted, 'center', st.ease(seg(t, 0.2, 0.6))); ctx.restore();
    for (let i = 0; i < n; i++) {
      txt(ctx, tk, 'disp', st.names[i], x0 + i * W + W / 2, y0 - 10, 18, c.ink, 'center', st.ease(seg(t, 0.2, 0.6)));
      txt(ctx, tk, 'disp', st.names[i], x0 - 12, y0 + i * H + H / 2 + 6, 18, c.ink, 'right', st.ease(seg(t, 0.2, 0.6)));
    }
    const dt = Math.min(0.9, 3.0 / nc * 1.6);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const idx = i * n + j, x = x0 + j * W, y = y0 + i * H, ts = 1.0 + 3.2 * idx / nc, cnt = M[i][j], m = Math.ceil(cnt / k), f = seg(t, ts, ts + dt);
      ctx.fillStyle = c.panel; ctx.fillRect(x + 1, y + 1, W - 2, H - 2); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, W - 1, H - 1);
      const shown = Math.ceil(m * f), right = i === j;
      for (let q = 0; q < shown; q++) {
        const mx = x + 8 + pm * (q % cols) + pm / 2, my = y + 32 + pm * Math.floor(q / cols) + pm / 2;
        if (right) { ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(mx, my, pm * 0.32, 0, 6.283); ctx.fill(); }
        else { ctx.strokeStyle = c.accent2; ctx.lineWidth = 1.6; cross(ctx, mx, my, pm * 0.28); }
      }
      if (f > 0) txt(ctx, tk, 'disp', String(Math.round(cnt * f)), x + 8, y + 24, n === 2 ? 26 : 20, c.ink, 'left', 1);
      if (st.tags && f > 0) txt(ctx, tk, 'mono', st.tags[i][j], x + W - 8, y + 22, 11, c.muted, 'right', 1);
    }
    const hc = st.ease(seg(t, 4.3, 4.8)), hr = st.ease(seg(t, 5.0, 5.5));
    ctx.lineWidth = 2.5; ctx.strokeStyle = c.chalk;
    if (hc > 0) { ctx.globalAlpha = hc; ctx.strokeRect(x0 - 2, y0 - 2, W + 4, n * H + 4); }
    if (hr > 0) { ctx.globalAlpha = hr; ctx.setLineDash([7, 5]); ctx.strokeRect(x0 - 5, y0 - 5, n * W + 10, H + 10); ctx.setLineDash([]); }
    ctx.globalAlpha = 1;
    const pct = (a, b) => Math.round(100 * a / b) + '%';
    const acc = st.ease(seg(t, 3.9, 4.3));
    txt(ctx, tk, 'disp', pct(tr, tot), 620, 330, 36, c.ink, 'left', acc); txt(ctx, tk, 'mono', 'accuracy · ' + tr + ' of ' + tot, 700, 328, 11, c.muted, 'left', acc);
    txt(ctx, tk, 'disp', pct(M[0][0], st.colSum[0]), 620, 380, 36, c.ink, 'left', hc); txt(ctx, tk, 'mono', 'precision · ' + M[0][0] + ' of ' + st.colSum[0] + ' (solid box)', 700, 378, 11, c.muted, 'left', hc);
    txt(ctx, tk, 'disp', pct(M[0][0], st.rowSum[0]), 620, 430, 36, c.ink, 'left', hr); txt(ctx, tk, 'mono', 'recall · ' + M[0][0] + ' of ' + st.rowSum[0] + ' (dashed box)', 700, 428, 11, c.muted, 'left', hr);
  }

  /* ================= HEATMAP ================= */
  function setupHeat(p, rng, params, tk, seed) {
    const n = params.n, N = n * n, K = params.bins;
    p.noiseSeed(seed); p.noiseDetail(3, 0.5);
    const blobs = [0, 1, 2].map(() => ({ x: rng() * n, y: rng() * n, s: n * (0.16 + rng() * 0.16), a: 0.6 + rng() * 0.4 })), v = [];
    const ox = rng() * 100, oy = rng() * 100;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      let s = 0; for (const b of blobs) s += b.a * Math.exp(-((c - b.x) ** 2 + (r - b.y) ** 2) / (2 * b.s * b.s));
      v.push(s + 0.5 * p.noise(c * 0.22 + ox, r * 0.22 + oy));
    }
    const lo = Math.min(...v), hi = Math.max(...v), val = v.map(x => (x - lo) / (hi - lo));
    const bin = val.map(x => Math.min(K - 1, Math.floor(x * K))), counts = new Array(K).fill(0); bin.forEach(b => counts[b]++);
    const order = val.map((x, i) => i).sort((a, b) => val[a] - val[b] || a - b), rank = new Array(N); order.forEach((i, r) => (rank[i] = r));
    return { n, N, K, val, bin, counts, rank, ramp: makeRamp(tk, 64) };
  }
  function drawHeat(st, ctx, tk, t, params) {
    const c = tk.color, { n, N, K, val, bin, counts, rank, ramp } = st, P = Math.floor(380 / n), S = P - 2, x0 = 56, y0 = 104, RS = 1.9, RE = 4.7, mxc = Math.max(...counts);
    frame(st, ctx, tk, t, params, [[0.1, 0.9, 'A ' + n + ' by ' + n + ' grid. Count the cells before any colour.'], [0.9, 1.9, 'Five equal bins. The counts come first, then the colour.'], [1.9, 4.8, 'Cells light in value order, lowest first.'], [4.8, 6.1, 'Now the ramp. Dots mark the top bin: ' + counts[K - 1] + ' of ' + N + ' cells.']]);
    const tally = new Array(K).fill(0);
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
      const i = r * n + q, x = x0 + q * P, y = y0 + r * P, ga = st.ease(seg(t, 0.5 * (r + q) / (2 * n), 0.5 * (r + q) / (2 * n) + 0.3)), tr = RS + (RE - RS) * rank[i] / (N - 1), a = st.ease(seg(t, tr, tr + 0.25));
      ctx.globalAlpha = ga; ctx.fillStyle = c.panel; ctx.fillRect(x, y, S, S); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, S - 1, S - 1);
      if (a > 0) { ctx.globalAlpha = a; ctx.fillStyle = ramp[Math.round(val[i] * 63)]; ctx.fillRect(x, y, S, S); }
      if (t >= tr + 0.1) tally[bin[i]]++;
      const dm = st.ease(seg(t, 5.0, 5.5));
      if (dm > 0 && bin[i] === K - 1) { ctx.globalAlpha = dm; ctx.fillStyle = c.chalk; ctx.beginPath(); ctx.arc(x + S / 2, y + S / 2, S * 0.17, 0, 6.283); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    txt(ctx, tk, 'disp', String(tick(N, st.ease(seg(t, 0.1, 0.9)))), 470, 150, 64, c.ink, 'left', st.ease(seg(t, 0.1, 0.4)));
    txt(ctx, tk, 'mono', 'cells', 470 + 6 + (N >= 100 ? 108 : 70), 150, 12, c.muted, 'left', st.ease(seg(t, 0.3, 0.7)));
    for (let k = 0; k < K; k++) {
      const y = 200 + 46 * k, a = st.ease(seg(t, 0.9 + 0.15 * k, 1.2 + 0.15 * k)), cu = st.ease(seg(t, 0.95 + 0.15 * k, 1.4 + 0.15 * k)), fill = st.ease(seg(t, RS + (tally[k] > 0 ? 0 : 99), RS + 0.3));
      ctx.globalAlpha = a; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; ctx.strokeRect(471, y + 1, 22, 22);
      if (tally[k] > 0) { ctx.fillStyle = ramp[Math.round((k + 0.5) / K * 63)]; ctx.fillRect(471, y + 1, 22, 22); }
      ctx.globalAlpha = 1;
      txt(ctx, tk, 'disp', String(tick(counts[k], cu)), 508, y + 22, 26, c.ink, 'left', a);
      txt(ctx, tk, 'mono', (k / K).toFixed(1) + ' to ' + ((k + 1) / K).toFixed(1), 600, y + 8, 11, c.muted, 'left', a);
      const bw = 260 * counts[k] / mxc;
      ctx.globalAlpha = a; ctx.fillStyle = c.line; ctx.fillRect(600, y + 14, bw, 8); ctx.fillStyle = c.ink; ctx.fillRect(600, y + 14, bw * tally[k] / counts[k], 8); ctx.globalAlpha = 1;
    }
    const ra = st.ease(seg(t, 4.8, 5.3));
    if (ra > 0) { for (let q = 0; q < 64; q++) { ctx.globalAlpha = ra; ctx.fillStyle = ramp[q]; ctx.fillRect(471 + q * 4.2, 450, 4.4, 14); } ctx.globalAlpha = 1; txt(ctx, tk, 'mono', 'low', 471, 484, 11, c.muted, 'left', ra); txt(ctx, tk, 'mono', 'high', 471 + 268, 484, 11, c.muted, 'right', ra); }
  }

  /* ================= TERRITORY ================= */
  const LET = 'ABCDEFGH';
  function setupTerr(p, rng, params, tk, seed) {
    const hex = params.cell === 'hex', S = hex ? 6 : 4, R = hex ? params.size : params.size * 1.2, mx0 = 40, my0 = 104, mw = 600, mh = 396;
    const dx = hex ? Math.sqrt(3) * R : R * 1.7, dy = hex ? 1.5 * R : R * 1.7;
    const cols = Math.floor((mw - (hex ? dx / 2 : 0)) / dx), rows = Math.floor((mh - (hex ? R / 2 : 0)) / dy), N = cols * rows;
    const cx = [], cy = [], cc = [], cr = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { cc.push(c); cr.push(r); cx.push(mx0 + dx * (c + 0.5 + (hex && (r & 1) ? 0.5 : 0))); cy.push(hex ? my0 + R + dy * r : my0 + dy * (r + 0.5)); }
    const CR = hex ? R : R / Math.SQRT2, off = []; for (let k = 0; k < S; k++) { const a = (360 / S * k - 180 / S) * Math.PI / 180; off.push([CR * Math.cos(a), CR * Math.sin(a)]); }
    const dirs = hex ? [(r) => [1, 0], (r) => [r & 1 ? 1 : 0, 1], (r) => [r & 1 ? 0 : -1, 1], (r) => [-1, 0], (r) => [r & 1 ? 0 : -1, -1], (r) => [r & 1 ? 1 : 0, -1]] : [() => [1, 0], () => [0, 1], () => [-1, 0], () => [0, -1]];
    const nb = []; for (let i = 0; i < N; i++) { nb.push(dirs.map(d => { const o = d(cr[i]), c = cc[i] + o[0], r = cr[i] + o[1]; return c < 0 || r < 0 || c >= cols || r >= rows ? -1 : r * cols + c; })); }
    p.noiseSeed(seed); p.noiseDetail(4, 0.5);
    const gx = rng() * 50, gy = rng() * 50, dn = new Array(N), land = new Array(N);
    for (let i = 0; i < N; i++) { const nx = (cx[i] - 340) / 300, ny = (cy[i] - 302) / 198, d = Math.hypot(nx, ny); dn[i] = d; land[i] = p.noise(cx[i] * 0.012 + gx, cy[i] * 0.012 + gy) > params.sea + 0.55 * d * d; }
    /* keep the largest land component */
    const comp = new Array(N).fill(-1); let best = -1, bs = 0, nc = 0;
    for (let i = 0; i < N; i++) if (land[i] && comp[i] < 0) { const q = [i]; comp[i] = nc; let h = 0; while (h < q.length) { const a = q[h++]; for (const b of nb[a]) if (b >= 0 && land[b] && comp[b] < 0) { comp[b] = nc; q.push(b); } } if (q.length > bs) { bs = q.length; best = nc; } nc++; }
    for (let i = 0; i < N; i++) if (comp[i] !== best) land[i] = false;
    const L = []; for (let i = 0; i < N; i++) if (land[i]) L.push(i);
    /* regions: farthest-point sites, then nearest site on a noise-warped distance */
    const K = params.regions, sites = [L[Math.floor(rng() * L.length)]];
    while (sites.length < K) { let bi = -1, bd = -1; for (const i of L) { const d = Math.min(...sites.map(s => Math.hypot(cx[i] - cx[s], cy[i] - cy[s]))) * (0.85 + 0.3 * rng()); if (d > bd) { bd = d; bi = i; } } sites.push(bi); }
    const reg = new Array(N).fill(-1), rd = new Array(N).fill(0);
    for (const i of L) { let bk = 0, bv = 1e9; sites.forEach((s, k) => { const d = Math.hypot(cx[i] - cx[s], cy[i] - cy[s]) + 16 * p.noise(cx[i] * 0.03 + gy, cy[i] * 0.03 + gx); if (d < bv) { bv = d; bk = k; } }); reg[i] = bk; rd[i] = Math.hypot(cx[i] - cx[sites[bk]], cy[i] - cy[sites[bk]]); }
    const rmax = sites.map((s, k) => Math.max(...L.filter(i => reg[i] === k).map(i => rd[i])) || 1), rcount = new Array(K).fill(0); L.forEach(i => rcount[reg[i]]++);
    /* route: Dijkstra between the two farthest sites over land, wiggly cost */
    const A = sites[0], B = sites[1], dist = new Array(N).fill(1e9), prev = new Array(N).fill(-1), done = new Array(N).fill(false); dist[A] = 0;
    const wc = i => 1 + 2.2 * p.noise(cx[i] * 0.05 + 9, cy[i] * 0.05 + 9);
    for (let it = 0; it < L.length; it++) { let u = -1, bv = 1e9; for (const i of L) if (!done[i] && dist[i] < bv) { bv = dist[i]; u = i; } if (u < 0 || u === B) break; done[u] = true; for (const v of nb[u]) if (v >= 0 && land[v] && dist[u] + wc(v) < dist[v]) { dist[v] = dist[u] + wc(v); prev[v] = u; } }
    const route = []; for (let i = B; i >= 0; i = prev[i]) route.push(i); route.reverse();
    /* coast and border edges */
    const coast = [], border = [];
    for (const i of L) nb[i].forEach((j, e) => {
      const a = off[e], b = off[(e + 1) % S], s = [cx[i] + a[0], cy[i] + a[1], cx[i] + b[0], cy[i] + b[1], i, j];
      if (j < 0 || !land[j]) coast.push(s); else if (reg[j] !== reg[i] && j > i) border.push(s);
    });
    const Ns = N - L.length;
    return { hex, S, off, N, cx, cy, land, L, reg, rd, rmax, rcount, sites, route, coast, border, dn, Ns, K, ramp: makeRamp(tk, 64), R, cols, rows };
  }
  function drawTerr(st, ctx, tk, t, params) {
    const c = tk.color, { off, N, cx, cy, land, L, reg, rd, rmax, rcount, sites, route, coast, border, dn, Ns, K, ramp } = st, ease = st.ease;
    const Lr = route.length, R0 = 4.1, R1 = 5.5, mxc = Math.max(...rcount);
    frame(st, ctx, tk, t, params, [[0.1, 1.0, 'The island is ' + L.length + ' land cells and ' + Ns + ' sea cells. Count them first.'], [1.0, 1.8, 'Regions are ' + K + ' groups of cells. The counts are fixed before they light.'], [1.8, 4.1, 'Regions light one by one, outward from each capital.'], [4.1, 6.1, 'The route is ' + Lr + ' cells long. It crosses cells, never the sea.']]);
    const aL = new Array(N).fill(0), aR = new Array(N).fill(0), rs = k => 1.6 + 0.4 * k;
    const seaA = ease(seg(t, 0, 0.6));
    for (let i = 0; i < N; i++) {
      if (!land[i]) { ctx.globalAlpha = seaA * 0.5; ctx.fillStyle = c.line; ctx.beginPath(); ctx.arc(cx[i], cy[i], 1, 0, 6.283); ctx.fill(); continue; }
      const d0 = 0.15 + 0.8 * dn[i], tl = rs(reg[i]) + 0.6 * rd[i] / rmax[reg[i]];
      aL[i] = ease(seg(t, d0, d0 + 0.3)); aR[i] = ease(seg(t, tl, tl + 0.3));
      poly(ctx, cx[i], cy[i], off); ctx.globalAlpha = aL[i]; ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.line; ctx.lineWidth = 0.6; ctx.stroke();
      if (aR[i] > 0) { ctx.globalAlpha = aL[i] * aR[i]; ctx.fillStyle = ramp[Math.round((0.3 + 0.65 * reg[i] / Math.max(1, K - 1)) * 63)]; ctx.fill(); }
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; for (const s of border) { const a = Math.min(aR[s[4]], aR[s[5]]); if (a <= 0) continue; ctx.globalAlpha = a * 0.8; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke(); }
    ctx.lineWidth = 2; for (const s of coast) { const a = aL[s[4]]; if (a <= 0) continue; ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke(); }
    ctx.globalAlpha = 1;
    /* capitals */
    sites.forEach((s, k) => { const a = ease(seg(t, rs(k), rs(k) + 0.3)); if (a <= 0) return; ctx.globalAlpha = a; ctx.fillStyle = c.bg; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx[s], cy[s], 9, 0, 6.283); ctx.fill(); ctx.stroke(); txt(ctx, tk, 'disp', LET[k], cx[s], cy[s] + 5, 14, c.ink, 'center', a); ctx.globalAlpha = 1; });
    /* route */
    const pr = ease(seg(t, R0, R1)) * (Lr - 1);
    ctx.strokeStyle = c.chalk; ctx.lineWidth = 2; ctx.beginPath(); let started = false;
    for (let k = 0; k <= Math.floor(pr); k++) { const i = route[k]; if (!started) { ctx.moveTo(cx[i], cy[i]); started = true; } else ctx.lineTo(cx[i], cy[i]); }
    if (pr > 0 && Math.floor(pr) < Lr - 1) { const k = Math.floor(pr), f = pr - k, a = route[k], b = route[k + 1]; ctx.lineTo(lerp(cx[a], cx[b], f), lerp(cy[a], cy[b], f)); }
    ctx.stroke();
    ctx.fillStyle = c.chalk; for (let k = 1; k < Lr - 1; k++) if (k <= pr) { ctx.beginPath(); ctx.arc(cx[route[k]], cy[route[k]], st.R * 0.22, 0, 6.283); ctx.fill(); }
    if (t >= R0) { const k = Math.min(Lr - 2, Math.floor(pr)), f = Math.min(1, pr - k), a = route[k], b = route[k + 1], hx = lerp(cx[a], cx[b], f), hy = lerp(cy[a], cy[b], f); ctx.fillStyle = c.accent2; ctx.strokeStyle = c.chalk; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hx, hy, 6.5, 0, 6.283); ctx.fill(); ctx.stroke(); }
    /* legend */
    let landShown = 0; for (let i = 0; i < N; i++) if (aL[i] > 0.5) landShown++;
    txt(ctx, tk, 'disp', String(landShown), 672, 150, 64, c.ink, 'left', ease(seg(t, 0.1, 0.4)));
    txt(ctx, tk, 'mono', 'land cells · sea ' + Ns, 672 + (L.length >= 1000 ? 112 : 84), 150, 12, c.muted, 'left', ease(seg(t, 0.3, 0.7)));
    for (let k = 0; k < K; k++) {
      const y = 190 + 40 * k, a = ease(seg(t, 0.9 + 0.12 * k, 1.2 + 0.12 * k)), cu = ease(seg(t, 0.95 + 0.12 * k, 1.4 + 0.12 * k)), lit = ease(seg(t, rs(k), rs(k) + 0.4));
      ctx.globalAlpha = a; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(684, y + 12, 11, 0, 6.283); ctx.stroke();
      if (lit > 0) { ctx.globalAlpha = lit; ctx.fillStyle = ramp[Math.round((0.3 + 0.65 * k / Math.max(1, K - 1)) * 63)]; ctx.fill(); ctx.globalAlpha = a; }
      txt(ctx, tk, 'disp', LET[k], 684, y + 17, 14, c.ink, 'center', a); txt(ctx, tk, 'disp', String(tick(rcount[k], cu)), 708, y + 21, 24, c.ink, 'left', a);
      ctx.globalAlpha = a; ctx.fillStyle = c.line; ctx.fillRect(770, y + 14, 150 * rcount[k] / mxc, 7); ctx.fillStyle = c.ink; ctx.fillRect(770, y + 14, 150 * rcount[k] / mxc * lit, 7); ctx.globalAlpha = 1;
    }
    const y = 190 + 40 * K, ra = ease(seg(t, R0 - 0.2, R0 + 0.2));
    ctx.globalAlpha = ra; ctx.strokeStyle = c.chalk; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(672, y + 12); ctx.lineTo(696, y + 12); ctx.stroke(); ctx.fillStyle = c.chalk; ctx.beginPath(); ctx.arc(684, y + 12, 3, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    txt(ctx, tk, 'disp', String(Math.floor(pr) + 1), 708, y + 21, 24, c.ink, 'left', ra); txt(ctx, tk, 'mono', 'route cells, A to B', 770, y + 18, 11, c.muted, 'left', ra);
  }

  /* ================= ADJACENCY <-> GRAPH ================= */
  function setupAdj(p, rng, params, tk) {
    const n = params.n, com = i => Math.floor(i / (n / 3)), edges = [], deg = new Array(n).fill(0), has = new Set();
    const add = (i, j) => { const k = i < j ? i * n + j : j * n + i; if (i === j || has.has(k)) return; has.add(k); edges.push(i < j ? [i, j] : [j, i]); deg[i]++; deg[j]++; };
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rng() < (com(i) === com(j) ? 0.6 : 0.07)) add(i, j);
    for (let i = 0; i < n; i++) if (!deg[i]) add(i, com(i) * (n / 3) + ((i + 1) % (n / 3)));
    edges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const P = 28, mx = 130, my = 140, gcx = [700, 590, 815], gcy = [255, 395, 395], pos = [], vel = [];
    for (let i = 0; i < n; i++) pos.push([gcx[com(i)] + (rng() - 0.5) * 60, gcy[com(i)] + (rng() - 0.5) * 60]);
    for (let it = 0; it < 160; it++) {
      const f = pos.map(() => [0, 0]);
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1], d2 = Math.max(60, dx * dx + dy * dy), d = Math.sqrt(d2), k = 7000 / d2; f[i][0] += dx / d * k; f[i][1] += dy / d * k; f[j][0] -= dx / d * k; f[j][1] -= dy / d * k; }
      for (const [i, j] of edges) { const dx = pos[j][0] - pos[i][0], dy = pos[j][1] - pos[i][1], d = Math.hypot(dx, dy) || 1, k = 0.05 * (d - 85); f[i][0] += dx / d * k; f[i][1] += dy / d * k; f[j][0] -= dx / d * k; f[j][1] -= dy / d * k; }
      for (let i = 0; i < n; i++) { f[i][0] += (gcx[com(i)] - pos[i][0]) * 0.03; f[i][1] += (gcy[com(i)] - pos[i][1]) * 0.03; pos[i][0] = clamp(pos[i][0] + clamp(f[i][0], -8, 8), 530, 890); pos[i][1] = clamp(pos[i][1] + clamp(f[i][1], -8, 8), 200, 470); }
    }
    let hub = 0; deg.forEach((d, i) => { if (d > deg[hub]) hub = i; });
    return { n, edges, deg, P, mx, my, pos, hub, com, start: Array.from({ length: n }, (_, i) => [mx - 22, my + P * i + P / 2]) };
  }
  function drawAdj(st, ctx, tk, t, params) {
    const c = tk.color, { n, edges, deg, P, mx, my, pos, hub, start } = st, E = edges.length, ease = st.ease, eu = ease(seg(t, 2.9, 4.6)), hl = ease(seg(t, 4.9, 5.4));
    const filled = new Set(); edges.forEach(([i, j]) => { filled.add(i * n + j); filled.add(j * n + i); });
    frame(st, ctx, tk, t, params, [[0.1, 0.9, n + ' nodes, ' + E + ' edges. A symmetric matrix fills ' + 2 * E + ' cells, two per edge.'], [0.9, 2.9, 'The matrix fills row by row. A filled square means those two nodes are linked.'], [2.9, 4.8, 'Same data, second view: each filled cell becomes a line, each row label a node.'], [4.8, 6.1, 'The hub: ' + deg[hub] + ' filled cells in its row, ' + deg[hub] + ' lines at its node.']]);
    /* tally as cells arrive: row i appears at ts(i) */
    const ts = i => 0.9 + 1.6 * i / n;
    let cells = 0; for (const k of filled) { const i = Math.floor(k / n); if (t >= ts(i) + 0.1) cells++; }
    const sa = ease(seg(t, 0.1, 0.5)), stat = [[String(n), 'nodes', 520], [String(E), 'edges', 620], [String(cells), '/ ' + 2 * E + ' cells filled', 720]];
    stat.forEach(([a, b, x]) => { txt(ctx, tk, 'disp', a, x, 128, 34, c.ink, 'left', sa); txt(ctx, tk, 'mono', b, x + (a.length > 1 ? 40 : 22), 126, 11, c.muted, 'left', sa); });
    const ghost = lerp(1, 0.22, eu);
    for (let i = 0; i < n; i++) {
      txt(ctx, tk, 'disp', String.fromCharCode(65 + i), mx + P * i + P / 2, my - 10, 14, c.ink, 'center', ghost * ease(seg(t, 0.2, 0.6)));
      for (let j = 0; j < n; j++) {
        const x = mx + P * j, y = my + P * i, ga = ease(seg(t, 0.3 * (i + j) / (2 * n), 0.3 * (i + j) / (2 * n) + 0.3)) * ghost;
        ctx.globalAlpha = ga; ctx.fillStyle = c.panel; ctx.fillRect(x + 1, y + 1, P - 2, P - 2); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, P - 1, P - 1);
        if (filled.has(i * n + j)) {
          const f = ease(seg(t, ts(i) + 0.05 * j, ts(i) + 0.05 * j + 0.25)), isHub = i === hub, q = isHub ? hl : 0;
          ctx.globalAlpha = f * ghost; ctx.fillStyle = c.accent; ctx.fillRect(x + 4, y + 4, P - 8, P - 8);
          if (q > 0) { ctx.globalAlpha = q; ctx.fillStyle = c.accent2; ctx.fillRect(x + 4, y + 4, P - 8, P - 8); ctx.strokeStyle = c.chalk; ctx.lineWidth = 2; ctx.strokeRect(x + 2, y + 2, P - 4, P - 4); }
        }
      }
    }
    ctx.globalAlpha = 1;
    const np = i => [lerp(start[i][0], pos[i][0], eu), lerp(start[i][1], pos[i][1], eu)];
    for (const [i, j] of edges) {
      const a = np(i), b = np(j), la = seg(eu, 0.25, 0.8), isH = (i === hub || j === hub) && hl > 0;
      if (la > 0) { ctx.globalAlpha = la; ctx.strokeStyle = isH ? c.accent2 : c.ink; ctx.lineWidth = isH ? 1.2 + 2.2 * hl : 1.2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      const f = filled.has(i * n + j) ? ease(seg(t, ts(i) + 0.05 * j, ts(i) + 0.05 * j + 0.25)) : 0;
      if (eu > 0 && eu < 1 && f > 0) { const cxm = mx + P * j + P / 2, cym = my + P * i + P / 2, mxp = (a[0] + b[0]) / 2, myp = (a[1] + b[1]) / 2, s = lerp(P - 8, 4, eu), al = 1 - seg(eu, 0.55, 1); ctx.globalAlpha = al; ctx.fillStyle = c.accent; ctx.fillRect(lerp(cxm, mxp, eu) - s / 2, lerp(cym, myp, eu) - s / 2, s, s); }
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < n; i++) {
      const q = np(i), r = lerp(10, 9 + 1.6 * deg[i], eu), isH = i === hub && hl > 0;
      ctx.fillStyle = isH ? c.accent2 : c.bg; ctx.strokeStyle = isH ? c.chalk : c.ink; ctx.lineWidth = isH ? 2.5 : 1.4; ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, 6.283); ctx.fill(); ctx.stroke();
      txt(ctx, tk, 'disp', String.fromCharCode(65 + i), q[0], q[1] + 5, 14, isH ? c.chalk : c.ink, 'center', ease(seg(t, 0.2, 0.6)));
    }
    if (hl > 0) { const q = pos[hub]; txt(ctx, tk, 'disp', 'degree ' + deg[hub], q[0], q[1] - 24 - 1.6 * deg[hub], 18, c.ink, 'center', hl); }
  }

  /* ================= pattern ================= */
  const base = { mode: 'heatmap', kicker: '', title: '', classes: 2, markPitch: 10, n: 20, bins: 5, cell: 'hex', size: 8.5, sea: 0.3, regions: 5, seedOffset: 0 };
  ARSENAL.patterns['maps-matrices'] = {
    id: 'maps-matrices', atlas: ['noise', 'lerp-color', 'color-spaces-2x', 'pixels-array'], renderer: 'p2d',
    params: base,
    variants: [
      { name: 'confusion-2x2', params: { mode: 'confusion', classes: 2, markPitch: 10, kicker: 'matrix · 2 by 2', title: 'Two kinds of right, two kinds of wrong' } },
      { name: 'confusion-4x4', params: { mode: 'confusion', classes: 4, markPitch: 8, seedOffset: 11, kicker: 'matrix · n by n', title: 'Where four classes get confused' } },
      { name: 'heatmap-20', params: { mode: 'heatmap', n: 20, bins: 5, kicker: 'heatmap · 20 by 20', title: 'Four hundred cells, five bins' } },
      { name: 'territory-hex', params: { mode: 'territory', cell: 'hex', size: 8.5, seedOffset: 3, kicker: 'map · hex cells', title: 'An island of cells, and one route' } },
      { name: 'territory-square', params: { mode: 'territory', cell: 'square', size: 6.2, sea: 0.2, seedOffset: 8, regions: 4, kicker: 'map · square cells', title: 'Same count, square cells' } },
      { name: 'matrix-graph', params: { mode: 'adjacency', n: 12, seedOffset: 5, kicker: 'matrix to graph', title: 'One table, two views' } },
    ],
    setup(p, ctx, params) {
      params = Object.assign({}, base, params);
      const tk = (ctx && ctx.tokens) || (params.brand && ARSENAL.brands[params.brand]) || ARSENAL.brands['ceti-dark'], seed = ((ctx && ctx.seed) | 0) + params.seedOffset, rng = mulberry32(seed + 77);
      const ease = EASE[(tk.tempo && tk.tempo.ease) || 'cubic'] || EASE.cubic;
      const m = params.mode, st = m === 'confusion' ? setupConf(p, rng, params, tk) : m === 'heatmap' ? setupHeat(p, rng, params, tk, seed) : m === 'territory' ? setupTerr(p, rng, params, tk, seed) : setupAdj(p, rng, params, tk);
      st.tk = tk; st.ease = ease; return st;
    },
    draw(p, t, st, params, tokens) {
      params = Object.assign({}, base, params); const ctx = p.drawingContext; ctx.save();
      const m = params.mode, f = m === 'confusion' ? drawConf : m === 'heatmap' ? drawHeat : m === 'territory' ? drawTerr : drawAdj;
      f(st, ctx, st.tk, t, params); ctx.restore();
    },
  };
})();
