/* formula-bind: a formula whose terms keep a role colour and fly, whole, into the marks they count (TransformMatchingTex-
   style matching by term id, never a cross-fade); the counts fly back into the formula and the result assembles as a
   kinetic number; then everything returns. The visual carrier of "every digit is a claim with a formula".
   Moves on t: set -> bind -> fly -> compute -> return. Pure of t. Seeded in setup. Token roles only.
   Glyph outlines from p5 2.x font.textToContours; fonts from arsenal/fonts/fonts.js (TTF data URLs) in async setup. */
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  // ---- helpers ---------------------------------------------------------------------------------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const EASE_IO = {
    linear: u => u, quad: u => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
    cubic: u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
    expo: u => (u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2),
    sine: u => -(Math.cos(Math.PI * u) - 1) / 2,
  };
  const EASE_OUT = {
    linear: u => u, quad: u => 1 - (1 - u) * (1 - u), cubic: u => 1 - Math.pow(1 - u, 3),
    expo: u => (u >= 1 ? 1 : (1 - Math.pow(2, -10 * u)) / (1 - Math.pow(2, -10))), sine: u => Math.sin(u * Math.PI / 2),
  };
  const easeIO = (n, u) => (EASE_IO[n] || EASE_IO.cubic)(clamp(u));
  const easeOut = (n, u) => (EASE_OUT[n] || EASE_OUT.cubic)(clamp(u));
  function parseCol(s) {
    s = String(s).trim();
    if (s[0] === '#') { let h = s.slice(1); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]; }
    const m = s.match(/rgba?\(([^)]+)\)/); if (m) { const v = m[1].split(',').map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; }
    return [128, 128, 128, 1];
  }
  const css = c => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${+clamp(c[3]).toFixed(3)})`;
  const mix = (a, b, k) => { const A = parseCol(a), B = parseCol(b); return css(A.map((v, i) => lerp(v, B[i], clamp(k)))); };
  const alpha = (c, a) => { const A = parseCol(c); A[3] *= a; return css(A); };
  const qb = (a, c, b, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * c + u * u * b;   // quadratic bezier, one axis
  function fmtNum(v, f) {
    f = f || {}; const dp = f.dp || 0, x = v * (f.scale || 1);
    let s = (Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp);
    if (f.group !== false) { const [i, d] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : ''); }
    return (f.prefix || '') + s + (f.suffix || '');
  }
  function fontKey(role) {
    const F = window.ARSENAL_FONTS || window.MORPH_FONTS || {}, k = role.family + '|' + role.weight;
    if (F[k]) return { key: k, fallback: false };
    const same = Object.keys(F).filter(x => x.split('|')[0] === role.family);
    return { key: same.length ? same[0] : (F['IBM Plex Mono|400'] ? 'IBM Plex Mono|400' : Object.keys(F)[0]), fallback: !same.length };
  }

  // ---- glyph outlines: one rigid group per glyph (contours clustered by overlapping x-extent) ------------
  const S0 = 120;                                    // sampling size, px
  function termShape(font, str) {
    const raw = font.textToContours(str, 0, 0, { sampleFactor: 0.5 });
    const cs = [];
    for (const c of raw) {
      if (!c || c.length < 3) continue;
      const pts = new Float32Array(c.length * 2); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      c.forEach((q, i) => { pts[2 * i] = q.x; pts[2 * i + 1] = q.y; x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); });
      cs.push({ pts, x0, x1, y0, y1 });
    }
    cs.sort((a, b) => a.x0 - b.x0);
    const glyphs = [];
    for (const c of cs) {
      const g = glyphs[glyphs.length - 1];
      if (g && c.x0 < g.x1 - 0.5) { g.cs.push(c); g.x1 = Math.max(g.x1, c.x1); }
      else glyphs.push({ cs: [c], x0: c.x0, x1: c.x1 });
    }
    const minX = glyphs.length ? glyphs[0].x0 : 0;
    let y0 = 0, y1 = 0, maxX = minX;
    for (const g of glyphs) { for (const c of g.cs) { for (let i = 0; i < c.pts.length; i += 2) c.pts[i] -= minX; y0 = Math.min(y0, c.y0); y1 = Math.max(y1, c.y1); } g.x0 -= minX; g.x1 -= minX; maxX = Math.max(maxX, g.x1 + minX); }
    return { glyphs, w: maxX - minX, y0, y1, text: str };
  }
  // trace one glyph with its own origin at (ox, oy), scale sc
  function glyphPath(c2, g, ox, oy, sc) {
    for (const c of g.cs) {
      const P = c.pts;
      for (let i = 0; i < P.length; i += 2) { const x = ox + (P[i] - g.x0) * sc, y = oy + P[i + 1] * sc; if (i === 0) c2.moveTo(x, y); else c2.lineTo(x, y); }
      c2.closePath();
    }
  }
  function drawShape(c2, sh, x, y, sc, col) {   // whole term in place
    c2.beginPath(); for (const g of sh.glyphs) glyphPath(c2, g, x + g.x0 * sc, y, sc);
    c2.fillStyle = col; c2.fill('evenodd');
  }

  // ---- the pattern -----------------------------------------------------------------------------
  const P = {
    id: 'formula-bind',
    atlas: ['text-to-contours', 'text-to-points', 'load-font', 'p5-woff2', 'kinetic-typography', 'shape-morph', 'text-width', 'derived-geometry', 'manim'],
    renderer: 'p2d',
    params: {
      form: 'ratio',                 // 'ratio' (terms[0] over terms[1]) | 'product' (two counts -> grid) | 'sum' (2-4 sets -> stacked bar)
      face: 'mono',                  // 'mono' | 'disp': the pack face the formula and its numbers are set in
      terms: [{ id: 'flagged', text: 'FLAGGED', role: 'accent' }, { id: 'reviewed', text: 'REVIEWED', role: 'accent2' }],
      order: null,                   // bind order (ids); null = terms order
      marks: { reviewed: { count: 120 }, flagged: { count: 37, of: 'reviewed' } },
      result: { role: 'ink', fmt: { scale: 100, dp: 1, suffix: '%' } },
      size: 44,                      // px formula type size (30-64)
      land: 0.46,                    // scale of a term when it lands at its marks (0.3-0.8)
      numSize: 28,                   // px count numerals at the marks (>= 20: counts are evidence)
      fy: 168,                       // px formula baseline
      lift: 50,                      // px arc of a flying term (0 = straight, exec)
      lag: 0.12,                     // 0-0.5 per-glyph lag inside a term flight (glyphs stay whole)
      dur: 12,
      beats: { set: [0, 0.9], bind: [1.0, 4.4], fly: [4.8, 6.4], compute: [6.8, 9.2], ret: [9.6, 11.2] },
      kicker: 'FORMULA BIND · RATIO', caption: 'ILLUSTRATIVE DATA · ONE DOT = ONE REVIEWED ITEM',
    },
    variants: [
      { name: 'ratio', params: { order: ['reviewed', 'flagged'] } },
      { name: 'product', params: {
        form: 'product', face: 'disp', size: 56, land: 0.42,
        terms: [{ id: 'gpus', text: 'GPUS', role: 'accent' }, { id: 'hours', text: 'HOURS', role: 'accent2' }],
        marks: { gpus: { count: 8 }, hours: { count: 14 } },
        result: { role: 'ink', fmt: { dp: 0 } },
        kicker: 'FORMULA BIND · PRODUCT', caption: 'ILLUSTRATIVE DATA · ONE CELL = ONE GPU-HOUR' } },
      { name: 'sum', params: {
        form: 'sum', face: 'mono', size: 40, land: 0.5,
        terms: [{ id: 'compute', text: 'COMPUTE', role: 'accent' }, { id: 'storage', text: 'STORAGE', role: 'accent2' }, { id: 'egress', text: 'EGRESS', role: 'ink' }],
        marks: { compute: { values: [4.2, 4.6, 5.0] }, storage: { values: [1.9, 2.0, 2.1] }, egress: { values: [1.1, 1.6, 2.3] } },
        valueFmt: { prefix: '$', suffix: 'K', dp: 1 },
        result: { role: 'chalk', fmt: { prefix: '$', suffix: 'K', dp: 1 } },
        kicker: 'FORMULA BIND · SUM OF THREE', caption: 'ILLUSTRATIVE DATA · ONE SEGMENT = ONE MONTH, $K' } },
    ],

    async setup(p, ctx, params) {
      const tok = ctx.tokens, rnd = mulberry32(ctx.seed >>> 0), W = ctx.w || ctx.W || 960, H = ctx.h || ctx.H || 540;
      const fonts = {}, fontInfo = {};
      for (const role of ['disp', 'mono']) {
        const fk = fontKey(tok.type[role]); fontInfo[role] = fk;
        fonts[role] = await p.loadFont((window.ARSENAL_FONTS || window.MORPH_FONTS)[fk.key]);
      }
      const face = fonts[params.face] || fonts.mono;
      p.textFont(face); p.textSize(S0);
      const shapeOf = s => termShape(face, s);
      const capH0 = -shapeOf('H').y0;
      const s = params.size / S0, capH = capH0 * s, ls = params.land, ease = (tok.tempo && tok.tempo.ease) || 'cubic';
      const terms = params.terms.map(T => ({ ...T, sh: shapeOf(T.text) }));
      const byId = Object.fromEntries(terms.map(T => [T.id, T]));
      const order = (params.order || terms.map(T => T.id)).filter(id => byId[id]);

      // sets: n marks, cumulative values (a count is a set of ones)
      const sets = {};
      for (const T of terms) {
        const m = params.marks[T.id] || { count: 0 };
        const vals = m.values ? m.values.slice() : Array.from({ length: m.count | 0 }, () => 1);
        const cum = [0]; vals.forEach(v => cum.push(cum[cum.length - 1] + v));
        sets[T.id] = { id: T.id, n: vals.length, vals, cum, total: cum[cum.length - 1], of: m.of || null, isValues: !!m.values, fmt: m.values ? (m.fmt || params.valueFmt || { dp: 1 }) : { dp: 0 } };
      }
      // the claim: the result is computed from the sets, never typed
      const tv = terms.map(T => sets[T.id].total);
      const value = params.form === 'ratio' ? (tv[1] ? tv[0] / tv[1] : 0) : params.form === 'product' ? tv.reduce((a, b) => a * b, 1) : tv.reduce((a, b) => a + b, 0);
      const op = { ratio: null, product: '×', sum: '+' }[params.form];
      const opSh = op ? shapeOf(op) : null, eqSh = shapeOf('='), qSh = shapeOf('?'), gap = 0.34 * params.size;   // sampled at S0
      p.textSize(params.size); const resW = p.textWidth(fmtNum(value, params.result.fmt));

      // ---- formula layout (derived from measured widths) ----
      const fy = params.fy, slots = {}, ops = [];
      let bar = null, resX;
      if (params.form === 'ratio') {
        const [A, B] = terms, wn = A.sh.w * s, wd = B.sh.w * s, fw = Math.max(wn, wd) + 0.3 * params.size;
        const total = fw + gap + eqSh.w * s + gap + Math.max(resW, qSh.w * s), x0 = W / 2 - total / 2, barY = fy - capH / 2;
        slots[A.id] = { x: x0 + (fw - wn) / 2, y: barY - 0.3 * params.size, w: wn };
        slots[B.id] = { x: x0 + (fw - wd) / 2, y: barY + 0.3 * params.size + capH, w: wd };
        bar = { x0, x1: x0 + fw, y: barY };
        ops.push({ sh: eqSh, x: x0 + fw + gap, y: fy }); resX = x0 + fw + gap + eqSh.w * s + gap;
      } else {
        let total = 0; terms.forEach((T, i) => { total += T.sh.w * s + (i < terms.length - 1 ? 2 * gap + opSh.w * s : 0); });
        total += 2 * gap + eqSh.w * s + Math.max(resW, qSh.w * s);
        let x = W / 2 - total / 2;
        terms.forEach((T, i) => { slots[T.id] = { x, y: fy, w: T.sh.w * s }; x += T.sh.w * s; if (i < terms.length - 1) { x += gap; ops.push({ sh: opSh, x, y: fy }); x += opSh.w * s + gap; } });
        x += gap; ops.push({ sh: eqSh, x, y: fy }); x += eqSh.w * s + gap; resX = x;
      }

      // ---- marks layout per form; anchors where a term lands and where its count sits ----
      const anchors = {}, M = { form: params.form };
      const wl = id => byId[id].sh.w * s * ls;
      if (params.form === 'ratio') {
        const [A, B] = terms, n = sets[B.id].n, cols = Math.min(24, Math.max(4, Math.ceil(Math.sqrt(n * 3)))), rows = Math.ceil(n / cols);
        const sp = Math.min(22, 460 / cols, 170 / rows), gw = cols * sp, gh = rows * sp, gx = W / 2 - gw / 2 + 70, gy = 300;
        M.dots = Array.from({ length: n }, (_, i) => ({ x: gx + sp * (i % cols + 0.5), y: gy + sp * (Math.floor(i / cols) + 0.5) }));
        M.r = sp * 0.3;
        const idx = Array.from({ length: n }, (_, i) => i);                     // seeded subset: which dots the numerator counts
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        const k = Math.min(sets[A.id].n, n), sub = idx.slice(0, k).sort((a, b) => a - b);
        M.rank = new Int32Array(n).fill(-1); sub.forEach((d, r) => { M.rank[d] = r; });
        M.share = { x0: gx, x1: gx + gw, y: gy + gh + 30 };
        const lx = gx - 30, aY = gy + 16, bY = Math.max(gy + gh - 34, aY + params.numSize + 52);
        anchors[A.id] = { wx: lx - wl(A.id), wy: aY, nx: lx, ny: aY + params.numSize + 6, na: 'right' };
        anchors[B.id] = { wx: lx - wl(B.id), wy: bY, nx: lx, ny: bY + params.numSize + 6, na: 'right' };
      } else if (params.form === 'product') {
        const [A, B] = terms, rows = sets[A.id].n, cols = sets[B.id].n;
        const sp = Math.min(24, 380 / cols, 180 / rows), gw = cols * sp, gh = rows * sp, gx = W / 2 - gw / 2 + 40, gy = 296;
        M.rowsHead = Array.from({ length: rows }, (_, i) => ({ x: gx - 20, y: gy + sp * (i + 0.5) }));
        M.colsHead = Array.from({ length: cols }, (_, j) => ({ x: gx + sp * (j + 0.5), y: gy - 16 }));
        M.cells = []; for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) M.cells.push({ x: gx + sp * (j + 0.5), y: gy + sp * (i + 0.5) });
        M.sp = sp; M.r = sp * 0.3;
        const ay = gy + gh / 2 - 4;
        anchors[A.id] = { wx: gx - 44 - wl(A.id), wy: ay, nx: gx - 44, ny: ay + params.numSize + 6, na: 'right' };
        anchors[B.id] = { wx: gx, wy: gy - 38, nx: gx + wl(B.id) + 16, ny: gy - 38, na: 'left' };
      } else {
        const x0 = 120, x1 = W - 120, by = 330, bh = 50, T = terms.reduce((a, T) => a + sets[T.id].total, 0) || 1, unit = (x1 - x0) / T;
        let x = x0; M.segs = {};
        for (const Tm of terms) {
          const S = sets[Tm.id], segs = [], sx = x;
          S.vals.forEach(v => { segs.push({ x, w: v * unit }); x += v * unit; });
          M.segs[Tm.id] = segs;
          anchors[Tm.id] = { wx: sx + 2, wy: by - 16, nx: sx + 2, ny: by + bh + 36, na: 'left' };
        }
        M.bar = { x0, x1, y: by, h: bh }; M.total = { x0, x1, y: by + bh + 66, T };
      }

      return { W, H, fonts, fontInfo, face, s, ls, capH, ease, terms, byId, order, sets, value, slots, ops, bar, qSh, resX, anchors, M, form: params.form };
    },

    // everything time-dependent, as a pure function of t (draw and count share it)
    frame(t, st, prm) {
      const B = prm.beats, E = st.ease, K = st.order.length, F = { t, sets: {}, terms: {} };
      F.appear = smooth(B.set[0], B.set[1], t);
      const bw = (B.bind[1] - B.bind[0]) / Math.max(K, 1);
      st.order.forEach((id, k) => {
        const u = clamp((t - B.bind[0] - k * bw) / bw), S = st.sets[id], m = easeIO(E, (u - 0.15) / 0.7);
        const lit = Math.min(S.n, Math.floor(S.n * m + 1e-9));
        F.sets[id] = { u, light: smooth(0, 0.3, u), lit, val: S.cum[lit], labelA: smooth(0.1, 0.25, u) };
      });
      const N = st.terms.length, flyD = B.fly[1] - B.fly[0], retD = B.ret[1] - B.ret[0], cD = B.compute[1] - B.compute[0];
      const stag = (d) => (N > 1 ? 0.18 * d / (N - 1) : 0), run = (d) => d - stag(d) * (N - 1);
      st.terms.forEach((T, k) => {
        const uf = clamp((t - B.fly[0] - k * stag(flyD)) / run(flyD)), ur = clamp((t - B.ret[0] - k * stag(retD)) / run(retD));
        const qn = clamp((t - B.compute[0] - k * 0.1 * cD) / (0.4 * cD));
        F.terms[T.id] = { uf, ur, away: Math.max(uf, 0) - ur, numOut: easeIO(E, qn), numBack: easeIO(E, ur * 1.7) };   // numerals leave the slot before the word lands
      });
      F.opsA = F.appear * (t < B.compute[0] ? 1 - smooth(B.fly[0], B.fly[0] + 0.3 * flyD, t) : smooth(B.compute[0], B.compute[0] + 0.25 * cD, t));
      F.qA = F.appear * (1 - smooth(B.fly[0], B.fly[0] + 0.3 * flyD, t));
      const rs = B.compute[0] + 0.45 * cD; F.ru = clamp((t - rs) / (B.compute[1] - rs)); F.rk = easeOut(E, F.ru);
      F.rv = st.value * F.rk;
      if (st.form === 'product') { F.cellsLit = Math.floor(F.rv + 1e-9); F.rv = F.cellsLit; }
      F.phase = t < B.bind[0] ? 'set' : t < B.fly[0] ? 'bind' : t < B.compute[0] ? 'fly' : t < B.ret[0] ? 'compute' : t < B.ret[1] ? 'return' : 'hold';
      return F;
    },

    // how many marks are on screen and lit at t, so a film can caption it
    count(t, st, prm) {
      const F = P.frame(t, st, prm), lit = {};
      let shown = 0, litN = 0;
      for (const id of Object.keys(F.sets)) lit[id] = F.sets[id].lit;
      if (st.form === 'ratio') { shown = st.M.dots.length; litN = F.sets[st.terms[1].id].lit; }
      else if (st.form === 'product') { shown = st.M.rowsHead.length + st.M.colsHead.length + st.M.cells.length; litN = lit[st.terms[0].id] + lit[st.terms[1].id] + F.cellsLit; lit.result = F.cellsLit; }
      else { for (const T of st.terms) { shown += st.sets[T.id].n; litN += lit[T.id]; } }
      return { phase: F.phase, shown: F.appear > 0 ? shown : 0, lit: litN, perSet: lit, result: F.ru > 0 ? F.rv : null, resultText: F.ru > 0 ? fmtNum(F.rv, prm.result.fmt) : '?' };
    },

    draw(p, t, st, prm, tokens) {
      const c = tokens.color, c2 = p.drawingContext, F = P.frame(t, st, prm), s = st.s, ls = st.ls, E = st.ease;
      const role = r => c[r] || c.ink;
      p.background(c.bg);
      const txt = (font, str, x, y, size, col, align) => { p.push(); p.textFont(font); p.textSize(size); p.noStroke(); p.fill(col); p.textAlign(align === 'right' ? p.RIGHT : align === 'center' ? p.CENTER : p.LEFT, p.BASELINE); p.text(str, x, y); p.pop(); };
      const tw = (font, str, size) => { p.push(); p.textFont(font); p.textSize(size); const w = p.textWidth(str); p.pop(); return w; };
      txt(st.fonts.mono, prm.kicker, 48, 52, 12, c.muted);
      txt(st.fonts.mono, prm.caption, 48, st.H - 34, 13, c.muted);
      c2.save();

      // ---- marks ----
      const M = st.M, A = F.appear, termCol = id => role(st.byId[id].role);
      const dot = (x, y, r, col) => { c2.fillStyle = col; c2.beginPath(); c2.arc(x, y, r, 0, 6.2832); c2.fill(); };
      if (st.form === 'ratio') {
        const [Ta, Tb] = st.terms, la = F.sets[Ta.id].lit, lb = F.sets[Tb.id].lit;
        M.dots.forEach((d, i) => {
          let col = alpha(c.line, A), r = M.r;
          if (i < lb) col = alpha(termCol(Tb.id), 0.55 * A);
          if (M.rank[i] >= 0 && M.rank[i] < la) { col = termCol(Ta.id); r = M.r * 1.12; }
          dot(d.x, d.y, r, col);
        });
        const sh = M.share; c2.lineWidth = 2; c2.strokeStyle = alpha(c.line, A); c2.beginPath(); c2.moveTo(sh.x0, sh.y); c2.lineTo(sh.x1, sh.y); c2.stroke();
        if (F.ru > 0) { const xe = lerp(sh.x0, sh.x1, F.rv); c2.lineWidth = 4; c2.strokeStyle = role(prm.result.role); c2.beginPath(); c2.moveTo(sh.x0, sh.y); c2.lineTo(xe, sh.y); c2.stroke(); c2.fillRect(xe - 1, sh.y - 8, 2, 16); }
      } else if (st.form === 'product') {
        const [Ta, Tb] = st.terms, la = F.sets[Ta.id].lit, lb = F.sets[Tb.id].lit, hw = M.sp * 0.62;
        M.rowsHead.forEach((d, i) => { c2.fillStyle = i < la ? termCol(Ta.id) : alpha(c.line, A); c2.fillRect(d.x - 6, d.y - hw / 2, 12, hw); });
        M.colsHead.forEach((d, j) => { c2.fillStyle = j < lb ? termCol(Tb.id) : alpha(c.line, A); c2.fillRect(d.x - hw / 2, d.y - 6, hw, 12); });
        M.cells.forEach((d, k) => dot(d.x, d.y, M.r, k < F.cellsLit ? role(prm.result.role) : alpha(c.line, A)));
      } else {
        const b = M.bar;
        for (const T of st.terms) {
          const lit = F.sets[T.id].lit;
          M.segs[T.id].forEach((g, j) => { c2.fillStyle = j < lit ? termCol(T.id) : alpha(c.line, A); c2.fillRect(g.x + 1, b.y, Math.max(1, g.w - 3), b.h); });
        }
        const tt = M.total; c2.lineWidth = 2; c2.strokeStyle = alpha(c.line, A); c2.beginPath(); c2.moveTo(tt.x0, tt.y); c2.lineTo(tt.x1, tt.y); c2.stroke();
        if (F.ru > 0) { const xe = lerp(tt.x0, tt.x1, F.rv / tt.T); c2.lineWidth = 4; c2.strokeStyle = role(prm.result.role); c2.fillStyle = c2.strokeStyle; c2.beginPath(); c2.moveTo(tt.x0, tt.y); c2.lineTo(xe, tt.y); c2.stroke(); c2.fillRect(tt.x0 - 1, tt.y - 8, 2, 16); c2.fillRect(xe - 1, tt.y - 8, 2, 16); }
      }

      // ---- operators, fraction bar, the "?" (unmatched: fade, never travel) ----
      const opCol = alpha(c.muted, F.opsA);
      if (F.opsA > 0.002) {
        for (const o of st.ops) drawShape(c2, o.sh, o.x, o.y, s, opCol);
        if (st.bar) { c2.fillStyle = opCol; c2.fillRect(st.bar.x0, st.bar.y - 1.5, st.bar.x1 - st.bar.x0, 3); }
      }
      if (F.qA > 0.002) drawShape(c2, st.qSh, st.resX, prm.fy, s, alpha(c.muted, F.qA));

      // ---- terms: in their slot, or flying whole (per-glyph lag) to their anchor ----
      for (const T of st.terms) {
        const sl = st.slots[T.id], an = st.anchors[T.id], ft = F.terms[T.id], sd = F.sets[T.id];
        const light = sd ? sd.light : 0, col = mix(c.muted, role(T.role), light), a0 = F.appear;
        if (ft.away > 0.002 && ft.away < 0.998) {                     // socket: where it returns
          c2.fillStyle = alpha(role(T.role), 0.5 * a0); c2.fillRect(sl.x, sl.y + 8, sl.w, 2);
        }
        const G = T.sh.glyphs, n = G.length;
        c2.beginPath();
        G.forEach((g, gi) => {
          const lagK = n > 1 ? gi / (n - 1) : 0, L = prm.lag;
          const ug = clamp(ft.uf * (1 + L) - L * lagK), ur = clamp(ft.ur * (1 + L) - L * lagK);
          const e = easeIO(E, ug) - easeIO(E, ur);
          const x0 = sl.x + g.x0 * s, y0 = sl.y + (1 - a0) * 14, x1 = an.wx + g.x0 * s * ls, y1 = an.wy;
          const cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - prm.lift;
          const x = qb(x0, cx, x1, e), y = qb(y0, cy, y1, e), sc = lerp(s, s * ls, e);
          glyphPath(c2, g, x, y, sc);
        });
        c2.fillStyle = alpha(col, a0); c2.fill('evenodd');

        // the count numeral: at the marks, then into the term's slot (compute), then back (return)
        if (sd && sd.labelA > 0.002) {
          const S = st.sets[T.id], str = fmtNum(sd.val, S.fmt), slotSize = prm.size * 0.92;
          const wA = tw(st.face, str, prm.numSize), ax = an.na === 'right' ? an.nx - wA / 2 : an.nx + wA / 2, ay = an.ny;
          const bx = sl.x + sl.w / 2, by = sl.y;
          const e = ft.numOut - ft.numBack, mx = (ax + bx) / 2 + 90, my = (ay + by) / 2;
          const x = qb(ax, mx, bx, e), y = qb(ay, my, by, e), size = lerp(prm.numSize, slotSize, e);
          txt(st.face, str, x, y, size, alpha(role(T.role), sd.labelA), 'center');
        }
      }

      // ---- the result: assembles from the counts as a kinetic number ----
      if (F.ru > 0) {
        const str = fmtNum(F.rv, prm.result.fmt), lift = (1 - smooth(0, 0.3, F.ru)) * 10;
        txt(st.face, str, st.resX, prm.fy + lift, prm.size, alpha(role(prm.result.role), smooth(0, 0.15, F.ru)), 'left');
      }
      c2.restore();
      return P.count(t, st, prm);
    },
  };
  window.ARSENAL.patterns['formula-bind'] = P;
})();
