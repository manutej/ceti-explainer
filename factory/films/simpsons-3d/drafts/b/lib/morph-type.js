/* morph-type: shape morph and kinetic typography from glyph contours (p5 2.x textToContours).
   Pure function of t. Token roles only. Fonts arrive as data URLs (arsenal/fonts/fonts.js) so loadFont works on file://. */
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  // ---- small helpers -------------------------------------------------------------------------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  const EASE_IO = {
    linear: u => u,
    quad: u => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
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

  // token colours -> [r,g,b,a]; mix() returns a CSS rgba string
  function parseCol(s) {
    s = String(s).trim();
    if (s[0] === '#') { let h = s.slice(1); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]; }
    const m = s.match(/rgba?\(([^)]+)\)/); if (m) { const v = m[1].split(',').map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; }
    return [255, 255, 255, 1];
  }
  const css = c => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${+c[3].toFixed(3)})`;
  function mix(a, b, k) { const A = parseCol(a), B = parseCol(b); return css(A.map((v, i) => lerp(v, B[i], k))); }

  // ---- contour geometry ----------------------------------------------------------------------
  function describe(pts) {
    let a2 = 0, cx = 0, cy = 0, per = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      a2 += p[0] * q[1] - q[0] * p[1]; per += Math.hypot(q[0] - p[0], q[1] - p[1]);
      cx += p[0]; cy += p[1]; x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
    }
    return { sgn: a2 < 0 ? -1 : 1, area: Math.abs(a2) / 2, cx: cx / pts.length, cy: cy / pts.length, perim: per, x0, x1, y0, y1 };
  }
  // a Shape is { cs: [{pts, area, cx, cy, perim, hole}], x0, x1 } in px at the size it was sampled
  function makeShape(contours) {
    const cs = [];
    for (const raw of contours) {
      let pts = raw.map(q => [q.x, q.y]);
      if (pts.length > 1) { const a = pts[0], b = pts[pts.length - 1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) pts.pop(); }
      if (pts.length < 3) continue;
      let d = describe(pts); const sgn = d.sgn;
      if (sgn < 0) { pts = pts.reverse(); d = describe(pts); }          // one winding for every contour
      cs.push({ pts, sgn, area: d.area, cx: d.cx, cy: d.cy, perim: d.perim, x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1, hole: false });
    }
    if (cs.length) { const ref = cs.reduce((m, c) => (c.area > m.area ? c : m), cs[0]); cs.forEach(c => { c.hole = c.sgn !== ref.sgn; }); }
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const c of cs) { x0 = Math.min(x0, c.x0); x1 = Math.max(x1, c.x1); y0 = Math.min(y0, c.y0); y1 = Math.max(y1, c.y1); }
    if (!cs.length) { x0 = x1 = y0 = y1 = 0; }
    return { cs, x0, x1, y0, y1 };
  }
  function xform(sh, s, dx, dy) {
    const cs = sh.cs.map(c => {
      const pts = c.pts.map(q => [q[0] * s + dx, q[1] * s + (dy || 0)]);
      return { pts, area: c.area * s * s, cx: c.cx * s + dx, cy: c.cy * s + (dy || 0), perim: c.perim * s, hole: c.hole, x0: c.x0 * s + dx, x1: c.x1 * s + dx, y0: c.y0 * s + (dy || 0), y1: c.y1 * s + (dy || 0) };
    });
    return { cs, x0: sh.x0 * s + dx, x1: sh.x1 * s + dx, y0: sh.y0 * s + (dy || 0), y1: sh.y1 * s + (dy || 0) };
  }
  // closed polyline -> n points equally spaced by arc length
  function resample(pts, n) {
    const m = pts.length, cum = new Float64Array(m + 1);
    for (let i = 0; i < m; i++) { const p = pts[i], q = pts[(i + 1) % m]; cum[i + 1] = cum[i] + Math.hypot(q[0] - p[0], q[1] - p[1]); }
    const L = cum[m], out = []; let j = 0;
    for (let k = 0; k < n; k++) {
      const d = (L * k) / n; while (j < m - 1 && cum[j + 1] < d) j++;
      const p = pts[j], q = pts[(j + 1) % m], seg = cum[j + 1] - cum[j] || 1, u = (d - cum[j]) / seg;
      out.push([lerp(p[0], q[0], u), lerp(p[1], q[1], u)]);
    }
    return out;
  }

  // ---- pairing: contours by area and position, equal counts, start index rotated to minimise travel ----
  function buildPlan(SA, SB, step, ref) {
    const A = SA.cs, B = SB.cs, tiny = ref * ref * 0.002, cand = [];
    for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) {
      const dpos = Math.hypot(A[i].cx - B[j].cx, A[i].cy - B[j].cy) / ref;
      const dar = Math.abs(Math.log((A[i].area + tiny) / (B[j].area + tiny)));
      cand.push({ i, j, c: dpos * 2.2 + dar * 0.5 + (A[i].hole !== B[j].hole ? 3 : 0) });
    }
    cand.sort((p, q) => p.c - q.c);
    const ua = new Set(), ub = new Set(), pr = [];
    for (const k of cand) if (!ua.has(k.i) && !ub.has(k.j)) { ua.add(k.i); ub.add(k.j); pr.push([A[k.i], B[k.j]]); }
    A.forEach((c, i) => { if (!ua.has(i)) pr.push([c, null]); });      // shrinks to a point
    B.forEach((c, j) => { if (!ub.has(j)) pr.push([null, c]); });      // grows from a point
    const pairs = pr.map(([a, b]) => {
      const n = clamp(Math.round(Math.max(a ? a.perim : 0, b ? b.perim : 0) / step), 24, 240);
      const pa = a ? resample(a.pts, n) : Array.from({ length: n }, () => [b.cx, b.cy]);
      let pb = b ? resample(b.pts, n) : Array.from({ length: n }, () => [a.cx, a.cy]);
      if (a && b) {                                                    // rotate start index of B to minimise travel
        let best = 0, bs = 1e30;
        for (let s = 0; s < n; s++) { let acc = 0; for (let k = 0; k < n; k++) { const q = pb[(k + s) % n], p = pa[k]; acc += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (acc >= bs) break; } if (acc < bs) { bs = acc; best = s; } }
        pb = pb.map((_, k) => pb[(k + best) % n]);
      }
      const buf = new Float32Array(n * 4);
      for (let k = 0; k < n; k++) { buf[4 * k] = pa[k][0]; buf[4 * k + 1] = pa[k][1]; buf[4 * k + 2] = pb[k][0]; buf[4 * k + 3] = pb[k][1]; }
      return { n, buf, grow: !a, shrink: !b, x: ((a ? a.cx : b.cx) + (b ? b.cx : a.cx)) / 2, d: 0 };
    });
    const xs = pairs.map(p => p.x), lo = Math.min(...xs, 0), hi = Math.max(...xs, 1);
    pairs.forEach(p => { p.d = hi > lo ? (p.x - lo) / (hi - lo) : 0; });  // left-to-right stagger rank
    return { pairs };
  }

  // trace every pair of a plan at progress u into the current path; returns [dots...] when asked
  function trace(c2, plan, u, ox, oy, o, dots) {
    const st = o.stagger;
    for (const pr of plan.pairs) {
      const lu = clamp(u * (1 + st) - pr.d * st), e = easeIO(o.ease, lu);
      if (pr.grow && e < 0.004) continue;
      if (pr.shrink && e > 0.996) continue;
      const lift = -Math.sin(Math.PI * lu) * o.lift, b = pr.buf;
      for (let k = 0; k < pr.n; k++) {
        const x = ox + lerp(b[4 * k], b[4 * k + 2], e), y = oy + lift + lerp(b[4 * k + 1], b[4 * k + 3], e);
        if (k === 0) c2.moveTo(x, y); else c2.lineTo(x, y);
        if (dots && k % o.dotEvery === 0) dots.push(x, y);
      }
      c2.closePath();
    }
  }
  function paint(c2, plan, u, ox, oy, o, col, accent, motion) {
    const dots = o.render === 'dots' ? [] : null;
    c2.beginPath(); trace(c2, plan, u, ox, oy, o, dots);
    if (o.render === 'fill') { c2.fillStyle = col; c2.fill('evenodd'); }
    else {
      c2.lineJoin = 'round'; c2.lineWidth = o.render === 'dots' ? 1.1 : 1.8;
      c2.strokeStyle = o.render === 'dots' ? o.lineCol : col; c2.stroke();
      if (dots) { c2.fillStyle = mix(o.ink, accent, motion); for (let i = 0; i < dots.length; i += 2) { c2.beginPath(); c2.arc(dots[i], dots[i + 1], 2.1, 0, 6.2832); c2.fill(); } }
    }
  }

  // ---- fonts -----------------------------------------------------------------------------------
  function fontKey(role) {
    const F = window.MORPH_FONTS || {}, k = role.family + '|' + role.weight;
    if (F[k]) return k;
    const same = Object.keys(F).filter(x => x.split('|')[0] === role.family);
    return same.length ? same[0] : Object.keys(F)[0];
  }

  // ---- the pattern -----------------------------------------------------------------------------
  const P = {
    id: 'morph-type', atlas: ['kinetic-typography', 'shape-morph', 'text-to-contours', 'text-to-points', 'text-weight', 'load-font', 'p5-woff2'], renderer: 'p2d',
    params: {
      mode: 'words',          // 'words' | 'ticker' | 'weight'
      font: 'disp',           // type role used for the big glyphs: 'disp' | 'mono'
      render: 'fill',         // 'fill' | 'outline' | 'dots'
      words: ['QUERY', 'KEY', 'VALUE'], hold_s: 1.1, morph_s: 1.3,
      size: 230, maxW: 780,   // px cap on glyph size, px max string width (960 basis)
      step: 3,                // px between resampled contour points
      stagger: 0.45,          // 0..1 left-to-right delay spread inside a morph
      lift: 14,               // px arc each contour rises while moving
      dotEvery: 3,            // dots render: every Nth resampled point
      from: 0, to: 18432, delay_s: 0.35, count_s: 4.4, label: 'CONTEXT TOKENS',
      title: 'AMPLIFY', t0: 0.3, rise_s: 1.8, letter_s: 0.22, wFrac: 0.05, trackFrom: 0.01, trackTo: 0.16, rise_px: 46,
      kicker: 'SHAPE MORPH', caption: 'QUERY / KEY / VALUE', guides: true,
    },
    variants: [
      { name: 'word-to-word', params: {} },
      { name: 'number-ticker', params: { mode: 'ticker', kicker: 'GLYPH MORPH TICKER', caption: 'EVERY DIGIT MORPHS BETWEEN OUTLINES', size: 190 } },
      { name: 'weight-rise', params: { mode: 'weight', kicker: 'WEIGHT AND TRACKING', caption: 'SIMULATED WEIGHT: NO VARIABLE FONT VENDORED', size: 170 } },
      { name: 'mono-dots', params: { font: 'mono', render: 'dots', words: ['LOGITS', 'SOFTMAX', 'P = 1.0'], size: 170, step: 5, dotEvery: 2, stagger: 0.6, kicker: 'POINT CLOUD MORPH', caption: 'ONE CONTOUR PAIR PER GLYPH PART' } },
    ],

    async setup(p, ctx, params) {
      const tok = ctx.tokens, rnd = mulberry32(ctx.seed >>> 0);
      const W = ctx.W || 960, H = ctx.H || 540;
      const fonts = {};
      for (const role of ['disp', 'mono']) fonts[role] = await p.loadFont(window.MORPH_FONTS[fontKey(tok.type[role])]);   // TTF data URL: no WOFF2 add-on needed
      const f = fonts[params.font], S0 = 200;
      p.textFont(f); p.textSize(S0);
      const shapeOf = (str) => makeShape(f.textToContours(str, 0, 0, { sampleFactor: 1 }));
      const capH0 = -shapeOf('H').y0;
      const st = { W, H, fonts, tok, mode: params.mode, jit: rnd() };
      st.ease = (tok.tempo && tok.tempo.ease) || 'cubic';
      const fit = (wmax) => Math.min(params.size, S0 * params.maxW / Math.max(wmax, 1), 300);

      if (params.mode === 'words') {
        const raw = params.words.map(shapeOf), wmax = Math.max(...raw.map(s => s.x1 - s.x0)), S = fit(wmax), k = S / S0;
        const shapes = raw.map(s => xform(s, k, -((s.x0 + s.x1) / 2) * k, 0));
        st.S = S; st.capH = capH0 * k; st.shapes = shapes;
        st.plans = []; for (let i = 0; i < shapes.length - 1; i++) st.plans.push(buildPlan(shapes[i], shapes[i + 1], params.step, S));
        if (shapes.length === 1) st.plans.push(buildPlan(shapes[0], shapes[0], params.step, S));
      } else if (params.mode === 'ticker') {
        const digs = '0123456789'.split('').map(shapeOf), adv0 = Math.max(...digs.map(s => s.x1 - s.x0));
        const nd = String(Math.floor(params.to)).length, comma = shapeOf(',');
        const rawW = nd * (adv0 + 0.16 * S0) + Math.floor((nd - 1) / 3) * (0.3 * S0), S = Math.min(params.size, S0 * params.maxW / rawW), k = S / S0;
        const adv = (adv0 + 0.16 * S0) * k, cw = 0.3 * S0 * k;
        const dig = digs.map(s => xform(s, k, -((s.x0 + s.x1) / 2) * k, 0));
        st.S = S; st.capH = capH0 * k; st.adv = adv; st.nd = nd;
        st.step = []; for (let d = 0; d < 10; d++) st.step.push(buildPlan(dig[d], dig[(d + 1) % 10], params.step, S));
        st.blank = buildPlan({ cs: [] }, dig[1], params.step, S);
        st.comma = xform(comma, k, -((comma.x0 + comma.x1) / 2) * k, 0);
        st.commaPlan = buildPlan(st.comma, st.comma, params.step, S);
        const total = nd * adv + Math.floor((nd - 1) / 3) * cw; let right = total / 2; st.slots = [];
        for (let i = 0; i < nd; i++) {
          if (i > 0 && i % 3 === 0) { st.slots.push({ comma: true, vis: Math.pow(10, i), x: right - cw / 2 }); right -= cw; }
          st.slots.push({ i, x: right - adv / 2 }); right -= adv;
        }
        st.total = total;
      } else {
        const chars = params.title.split(''), letters = [];
        let wmax = 0;
        for (const ch of chars) {
          if (ch === ' ') { letters.push({ sp: true, adv: p.textWidth(' ') }); continue; }
          const sh = shapeOf(ch); letters.push({ sh, adv: p.textWidth(ch) });
        }
        wmax = letters.reduce((a, l) => a + l.adv, 0) * (1 + params.trackTo * (chars.length - 1) / chars.length) + params.wFrac * S0 * chars.length;
        const S = Math.min(params.size, S0 * params.maxW / wmax), k = S / S0;
        st.S = S; st.k = k; st.capH = capH0 * k;
        st.letters = letters.map(l => (l.sp ? { sp: true, adv: l.adv * k } : { sh: xform(l.sh, k, 0, 0), adv: l.adv * k }));
      }
      return st;
    },

    draw(p, t, st, params, tokens) {
      const c = tokens.color, W = st.W, H = st.H, ctx = p.drawingContext, ease = st.ease;
      p.background(c.bg);
      const o = { stagger: params.stagger, lift: params.lift, ease, render: params.render, dotEvery: params.dotEvery, ink: c.ink, lineCol: c.muted };
      const mono = st.fonts.mono, cx = W / 2, base = H / 2 + st.capH / 2 + 6;
      const label = (s, x, y, col, align, size) => { p.push(); p.textFont(mono); p.textSize(size || 12); p.noStroke(); p.fill(col); p.textAlign(align || p.LEFT, p.BASELINE); p.text(s, x, y); p.pop(); };
      label(params.kicker, 48, 52, c.accent);
      label(params.caption, 48, H - 40, c.muted);
      ctx.save();
      if (params.guides) { ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(48, base + 0.5); ctx.lineTo(W - 48, base + 0.5); ctx.stroke(); }

      if (st.mode === 'words') {
        const K = st.shapes.length, h = params.hold_s, m = params.morph_s; let i = K - 2, u = 1, tt = Math.max(0, t), done = true;
        if (K === 1) { i = 0; u = 0; }
        else for (let s = 0; s < K - 1; s++) {
          if (tt < h) { i = s; u = 0; done = false; break; } tt -= h;
          if (tt < m) { i = s; u = tt / m; done = false; break; } tt -= m;
        }
        void done;
        const motion = Math.sin(Math.PI * u), col = mix(c.ink, c.accent, motion * 0.9);
        paint(ctx, st.plans[i], u, cx, base, o, col, c.accent, motion);
        const idx = (u > 0.5 ? i + 1 : i) + 1;
        label(String(idx).padStart(2, '0') + ' / ' + String(K).padStart(2, '0'), W - 48, H - 40, c.ink, p.RIGHT);
      } else if (st.mode === 'ticker') {
        const u0 = clamp((t - params.delay_s) / params.count_s), v = params.from + (params.to - params.from) * easeOut(ease, u0);
        const nowMorph = [];
        for (const sl of st.slots) {
          if (sl.comma) { if (v >= sl.vis) paint(ctx, st.commaPlan, 0, cx + sl.x, base, { ...o, lift: 0 }, c.muted, c.accent, 0); continue; }
          const pw = Math.pow(10, sl.i), x = v / pw, fl = Math.floor(x), fr = x - fl, win = sl.i === 0 ? 0.5 : 0.1, g = smooth(1 - win, 1, fr);
          const dgt = fl % 10; nowMorph.push(g);
          if (sl.i > 0 && fl === 0) { if (g > 0.001) paint(ctx, st.blank, g, cx + sl.x, base, { ...o, stagger: 0, lift: 0 }, mix(c.ink, c.accent, Math.sin(Math.PI * g)), c.accent, g); continue; }
          paint(ctx, st.step[dgt], g, cx + sl.x, base, { ...o, stagger: 0.25, lift: params.lift * 0.6 }, mix(c.ink, c.accent, Math.sin(Math.PI * g) * 0.95), c.accent, g);
        }
        // label + progress rule under the number
        const ry = base + 34, x0 = cx - st.total / 2, x1 = cx + st.total / 2;
        ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, ry); ctx.lineTo(x1, ry); ctx.stroke();
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, ry); ctx.lineTo(lerp(x0, x1, v / params.to), ry); ctx.stroke();
        label(params.label, x0, ry + 22, c.muted);
        label(String(Math.floor(v)).padStart(String(params.to).length, '0'), x1, ry + 22, c.ink, p.RIGHT);
      } else {
        const L = st.letters, n = L.length, S = st.S, k = st.k;
        const gT = easeIO(ease, (t - params.t0) / (params.rise_s + params.letter_s * (n - 1)));
        const track = lerp(params.trackFrom, params.trackTo, gT) * S, wMax = params.wFrac * S;
        const q = L.map((l, i) => easeIO(ease, (t - params.t0 - i * params.letter_s) / params.rise_s));
        let total = 0; L.forEach((l, i) => { total += l.adv + wMax * q[i] + (i < n - 1 ? track : 0); });
        let pen = cx - total / 2;
        ctx.lineJoin = 'miter'; ctx.miterLimit = 3;
        L.forEach((l, i) => {
          const w = wMax * q[i];
          if (!l.sp) {
            ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * q[i];
            ctx.beginPath();
            for (const cc of l.sh.cs) { cc.pts.forEach((pt, j) => { const x = pen + w / 2 + pt[0], y = base + (1 - q[i]) * params.rise_px + pt[1]; if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.closePath(); }
            ctx.fillStyle = mix(c.ink, c.accent, (1 - q[i]) * 0.9); ctx.fill('evenodd');
            if (w > 0.05) { ctx.lineWidth = w; ctx.strokeStyle = ctx.fillStyle; ctx.stroke(); }
            ctx.restore();
          }
          pen += l.adv + w + track;
        });
        void k;
        const w0 = wMax * q[0];
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - total / 2, base + 34); ctx.lineTo(cx - total / 2 + total * gT, base + 34); ctx.stroke();
        label('WGHT ' + (600 + Math.round(gT * 300)) + '  STROKE +' + (w0 / (S / 100)).toFixed(1) + ' / 100 EM', cx - 300, base + 56, c.muted);
        label('TRACKING ' + (track / S >= 0 ? '+' : '') + Math.round(track / S * 1000) + ' / 1000', cx + 300, base + 56, c.ink, p.RIGHT);
      }
      ctx.restore();
    },
  };
  P.kit = { makeShape, xform, buildPlan, paint, trace, mix, easeIO, easeOut, clamp, lerp };   // [simpsons-3d/b] the ONLY edit to this copy: export the pure contour-morph kernel the film drives from its own p2d layer
  window.ARSENAL.patterns['morph-type'] = P;
})();
