// arsenal/patterns/scale-anchor/pattern.js · continuous log zoom (1 -> 10^5 units) against a constant-size anchor (renderer p2d)
// Atlas: camera-choreography, world-to-screen, easing-functions, derived-geometry, pure-function-of-t, seeded-determinism, gpu-instancing (LOD, not used).
// R-D move M11 (resolution of scale + anthropocentric anchor) [S13][S27]. Pure of t; seeds in setup; roles only (tokens).
//
// MODEL.  n(t) = round(10^L(t)) units exist on screen: the first n cells of a square spiral (cell 0 at the centre), so a
// unit never moves as the crowd grows.  The camera frames the crowd: world panel side P, pitch p(L) = P / (10^(L/2) + 2)
// px per cell (the zoom, log in n).  count(t) = n = marks drawn (individual) or the sum of tile counts (batched): exact.
// The ANCHOR (ruler tick or silhouette set) is drawn at a CONSTANT size, equal to one mark at L = 0, so the world visibly
// shrinks against it.  LOD: individual marks while n <= budget; past it, s x s tiles (batch factor f = s^2, printed),
// cross-faded over swapW decades of n.  Pause ladder: the zoom holds at 10^0 .. 10^top for `dwell` s each.
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = u => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
  const EASE = {
    linear: u => u,
    quad: u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2,
    cubic: u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2,
    sine: u => (1 - Math.cos(Math.PI * u)) / 2,
    expo: u => u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2
  };
  const NMAX = 100000;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const fmtV = v => v >= 100 ? fmt(v) : v >= 10 ? v.toFixed(1) : v.toFixed(2);

  // ---------- the square spiral: cell index <-> (i, j), closed form ----------
  // ring r = max(|i|,|j|) holds 8r cells after (2r-1)^2 inner ones; order: right side up, top leftwards, left downwards, bottom rightwards.
  function spiralIdx(i, j) {
    const r = Math.max(Math.abs(i), Math.abs(j)); if (r === 0) return 0;
    const base = (2 * r - 1) * (2 * r - 1); let k;
    if (i === r && j > -r) k = j + r - 1;
    else if (j === r) k = 2 * r + (r - 1 - i);
    else if (i === -r) k = 4 * r + (r - 1 - j);
    else k = 6 * r + (i + r - 1);
    return base + k;
  }

  // ---------- timeline: the pause ladder ----------
  // rung k holds for dwell s at L = k, then moves to k+1 over `move` s. dur = (top+1)*dwell + top*move.
  function timeline(P) {
    const top = P.top, seg = P.dwell + P.move, rungs = [];
    for (let k = 0; k <= top; k++) rungs.push({ k, n: Math.pow(10, k), t0: k * seg, t1: k * seg + P.dwell });
    return { top, dur: (top + 1) * P.dwell + top * P.move, rungs };
  }
  function level(t, P, T) {
    const top = P.top, seg = P.dwell + P.move; if (t <= 0) return 0; if (t >= (top + 1) * P.dwell + top * P.move) return top;
    const k = Math.min(top, Math.floor(t / seg)), r = t - k * seg;
    if (r <= P.dwell || k >= top) return k;
    const e = EASE[P.ease || (T && T.tempo && T.tempo.ease) || 'cubic'] || EASE.cubic;
    return k + e(clamp((r - P.dwell) / P.move, 0, 1));
  }
  const countOf = L => Math.max(1, Math.min(NMAX, Math.round(Math.pow(10, L))));
  // LOD blend at level L: ta = tile alpha (0 marks only .. 1 tiles only)
  function lodAlpha(L, P) {
    if (P.lod === 'marks') return 0; if (P.lod === 'tiles') return 1;
    const Ls = Math.log10(P.budget), w = P.swapW; return smooth((L - (Ls - w / 2)) / w);
  }

  // ---------- setup: the spiral table and the seeded flags ----------
  function setup(p, ctx, P) {
    const rnd = mulberry32((ctx && ctx.seed) | 0), cx = new Int16Array(NMAX), cy = new Int16Array(NMAX), flags = new Uint8Array(NMAX);
    let n = 1; cx[0] = 0; cy[0] = 0;
    for (let r = 1; n < NMAX; r++) {
      for (let j = -r + 1; j <= r && n < NMAX; j++) { cx[n] = r; cy[n++] = j; }
      for (let i = r - 1; i >= -r && n < NMAX; i--) { cx[n] = i; cy[n++] = r; }
      for (let j = r - 1; j >= -r && n < NMAX; j--) { cx[n] = -r; cy[n++] = j; }
      for (let i = -r + 1; i <= r && n < NMAX; i++) { cx[n] = i; cy[n++] = -r; }
    }
    const data = P && P.data;
    for (let k = 0; k < NMAX; k++) { const u = rnd(); flags[k] = data && k < data.length ? (data[k] ? 1 : 0) : (u < (P && P.flagFrac || 0) ? 1 : 0); }
    flags[0] = 0;                                   // the opening mark is plain by construction (documented)
    const pre = new Uint32Array(NMAX + 1); for (let k = 0; k < NMAX; k++) pre[k + 1] = pre[k] + flags[k];
    return { cx, cy, flags, pre, last: null, tl: timeline(P) };
  }

  // ---------- text ----------
  const fontOf = (T, role, size, w) => `${w || T.type[role].weight} ${size}px "${T.type[role].family}", sans-serif`;
  function txt(ctx, T, s, x, y, o) {
    o = o || {}; ctx.font = fontOf(T, o.role || 'mono', Math.max(o.size || 12, 11)); ctx.fillStyle = o.color || T.color.ink;
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic'; ctx.globalAlpha = o.a == null ? 1 : o.a; ctx.fillText(s, x, y); ctx.globalAlpha = 1;
  }
  function fitTxt(ctx, T, s, x, y, role, size, maxW, color, align) {
    ctx.font = fontOf(T, role, size); let w = ctx.measureText(s).width; if (w > maxW) size = Math.max(11, Math.floor(size * maxW / w));
    txt(ctx, T, s, x, y, { role, size, color, align });
  }

  // ---------- anchor silhouettes: simple geometric strokes, baseline yb, k px per metre ----------
  const SIL = {
    person: { name: 'person', m: 1.7, draw(c, x, yb, k) { const H = 1.7 * k; c.beginPath(); c.arc(x, yb - H + .085 * H, .085 * H, 0, 6.2832); c.moveTo(x - .11 * H, yb - .62 * H); c.lineTo(x + .11 * H, yb - .62 * H); c.lineTo(x + .11 * H, yb - .31 * H); c.lineTo(x - .11 * H, yb - .31 * H); c.closePath(); c.moveTo(x - .05 * H, yb - .31 * H); c.lineTo(x - .05 * H, yb); c.moveTo(x + .05 * H, yb - .31 * H); c.lineTo(x + .05 * H, yb); c.stroke(); } },
    door: { name: 'door', m: 2.0, draw(c, x, yb, k) { c.beginPath(); c.rect(x, yb - 2.0 * k, .9 * k, 2.0 * k); c.stroke(); c.beginPath(); c.arc(x + .75 * k, yb - 1.0 * k, Math.max(1.6, .06 * k), 0, 6.2832); c.stroke(); } },
    car: { name: 'car', m: 4.5, draw(c, x, yb, k) { c.beginPath(); c.moveTo(x, yb - .35 * k); c.lineTo(x, yb - .8 * k); c.lineTo(x + .9 * k, yb - .85 * k); c.lineTo(x + 1.3 * k, yb - 1.4 * k); c.lineTo(x + 3.1 * k, yb - 1.4 * k); c.lineTo(x + 3.7 * k, yb - .85 * k); c.lineTo(x + 4.5 * k, yb - .8 * k); c.lineTo(x + 4.5 * k, yb - .35 * k); c.closePath(); c.stroke(); for (const wx of [.95, 3.55]) { c.beginPath(); c.arc(x + wx * k, yb - .32 * k, .32 * k, 0, 6.2832); c.stroke(); } } },
    bus: { name: 'bus', m: 12, draw(c, x, yb, k) { c.beginPath(); c.roundRect(x, yb - 3.2 * k, 12 * k, 2.7 * k, .3 * k); c.stroke(); for (let q = 0; q < 8; q++) { c.beginPath(); c.rect(x + (.6 + q * 1.38) * k, yb - 2.75 * k, 1.05 * k, .85 * k); c.stroke(); } for (const wx of [2.2, 9.8]) { c.beginPath(); c.arc(x + wx * k, yb - .5 * k, .5 * k, 0, 6.2832); c.stroke(); } } }
  };

  // ---------- draw ----------
  function draw(p, t, S, P, T) {
    P = Object.assign({}, A.patterns['scale-anchor'].params, P);
    const ctx = p.drawingContext, W = p.width, H = p.height, ks = W / 960, C = T.color;
    const tl = S.tl = timeline(P), L = level(t, P, T), n = countOf(L), ta = lodAlpha(L, P), ma = 1 - ta;
    const PS = 408, PX = 252, PY = 66, ox = PX + PS / 2, oy = PY + PS / 2;
    const pitch = PS / (Math.pow(10, L / 2) + 2), s = Math.max(2, P.tile | 0), f = s * s;
    ctx.save(); ctx.scale(ks, ks);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, 960, H / ks);

    // world panel
    ctx.fillStyle = C.panel; ctx.fillRect(PX, PY, PS, PS);
    const bump = P.showSwap ? 4 * ta * (1 - ta) : 0;
    ctx.strokeStyle = bump > .05 ? C.accent : C.line; ctx.lineWidth = bump > .05 ? 1 + 2 * bump : 1; ctx.strokeRect(PX + .5, PY + .5, PS - 1, PS - 1);
    ctx.save(); ctx.beginPath(); ctx.rect(PX, PY, PS, PS); ctx.clip();
    const cxA = S.cx, cyA = S.cy, fl = S.flags;
    let nTiles = 0, tileSum = 0, tileFl = 0;
    const mk = P.mark;
    // marks layer
    if (ma > 0.001) {
      ctx.globalAlpha = ma;
      const pInk = new Path2D(), pAcc = new Path2D(), pInkP = new Path2D(), pAccP = new Path2D();
      const dotMode = pitch >= 3.5, personA = mk === 'person' ? smooth((pitch - 7) / 5) : 0;
      for (let k = 0; k < n; k++) {
        const x = ox + cxA[k] * pitch, y = oy + cyA[k] * pitch, a = fl[k] ? pAcc : pInk, ap = fl[k] ? pAccP : pInkP;
        if (mk === 'square' || !dotMode) { const h = (mk === 'square' ? .4 : .35) * pitch; a.rect(x - h, y - h, 2 * h, 2 * h); }
        else {
          const r = .31 * pitch; if (personA < 1) { a.moveTo(x + r, y); a.arc(x, y, r, 0, 6.2832); }
          if (personA > 0) { ap.moveTo(x + .085 * pitch, y - .22 * pitch); ap.arc(x, y - .22 * pitch, .085 * pitch, 0, 6.2832); ap.roundRect(x - .13 * pitch, y - .11 * pitch, .26 * pitch, .4 * pitch, .07 * pitch); }
        }
      }
      ctx.globalAlpha = ma * (1 - personA); ctx.fillStyle = C.ink; ctx.fill(pInk); ctx.fillStyle = C.accent; ctx.fill(pAcc);
      if (personA > 0) { ctx.globalAlpha = ma * personA; ctx.fillStyle = C.ink; ctx.fill(pInkP); ctx.fillStyle = C.accent; ctx.fill(pAccP); }
      ctx.globalAlpha = 1;
    }
    // tile layer
    if (ta > 0.001) {
      const ho = s >> 1, r = Math.ceil((Math.sqrt(n) - 1) / 2), a0 = Math.floor((-r + ho) / s), a1 = Math.floor((r + ho) / s);
      const pFull = new Path2D(), pBar = new Path2D(), pCellI = new Path2D(), pCellA = new Path2D(), pOut = new Path2D();
      const g = clamp(.08 * pitch * s, .35, 1.6), tw = s * pitch;
      for (let b = a0; b <= a1; b++) for (let a = a0; a <= a1; a++) {
        const i0 = a * s - ho, j0 = b * s - ho; let cnt = 0, nf = 0;
        for (let dj = 0; dj < s; dj++) for (let di = 0; di < s; di++) { const id = spiralIdx(i0 + di, j0 + dj); if (id < n) { cnt++; nf += fl[id]; } }
        if (!cnt) continue; nTiles++; tileSum += cnt; tileFl += nf;
        const x = ox + (i0 - .5) * pitch, y = oy + (j0 - .5) * pitch;
        if (cnt === f) {
          pFull.rect(x + g, y + g, tw - 2 * g, tw - 2 * g);
          if (nf) { const hh = (tw - 2 * g) * nf / f; pBar.rect(x + g, y + tw - g - hh, tw - 2 * g, hh); }
          if (P.tileStroke) pOut.rect(x + .5, y + .5, tw - 1, tw - 1);
        } else {
          for (let dj = 0; dj < s; dj++) for (let di = 0; di < s; di++) { const id = spiralIdx(i0 + di, j0 + dj); if (id < n) { const q = fl[id] ? pCellA : pCellI; q.rect(x + di * pitch + g, y + dj * pitch + g, pitch - 2 * g, pitch - 2 * g); } }
        }
      }
      ctx.globalAlpha = ta * .62; ctx.fillStyle = C.ink; ctx.fill(pFull); ctx.globalAlpha = ta * .9; ctx.fillStyle = C.accent; ctx.fill(pBar);
      ctx.globalAlpha = ta; ctx.fillStyle = C.ink; ctx.fill(pCellI); ctx.fillStyle = C.accent; ctx.fill(pCellA);
      if (P.tileStroke) { ctx.globalAlpha = ta; ctx.strokeStyle = C.line; ctx.lineWidth = .6; ctx.stroke(pOut); }
      ctx.globalAlpha = 1;
    }
    ctx.restore();   // end clip
    const nFlag = S.pre[n];
    const drawn = ta < .001 ? `${fmt(n)} marks` : ma < .001 ? `${fmt(nTiles)} tiles` : `${fmt(n)} marks + ${fmt(nTiles)} tiles`;
    const tilesOnly = ta > .999;

    // ---------- right column: readouts ----------
    const RX = 684, RW = 176;
    txt(ctx, T, 'UNITS VISIBLE', RX, 92, { size: 11, color: C.muted });
    fitTxt(ctx, T, fmt(n), RX, 150, 'disp', 58, RW, C.ink);
    txt(ctx, T, `n = 10^L = 10^${L.toFixed(2)}`, RX, 172, { size: 12, color: C.muted });
    txt(ctx, T, ta < .5 ? 'LOD  individual marks' : `LOD  tiles x${f}`, RX, 206, { size: 12, color: C.ink });
    const dl = ta < .001 ? [`drawn  ${fmt(n)} marks`] : ma < .001 ? [`drawn  ${fmt(nTiles)} tiles`] : [`drawn  ${fmt(n)} marks`, `+ ${fmt(nTiles)} tiles`];
    dl.forEach((q, i) => txt(ctx, T, q, RX, 226 + 16 * i, { size: 12, color: C.ink }));
    txt(ctx, T, `1 tile = ${f} marks`, RX, 258, { size: 11, color: C.muted });
    txt(ctx, T, ta < .5 ? `swap past n = ${fmt(P.budget)}` : `batch factor x${f}`, RX, 274, { size: 11, color: C.muted });
    if (P.flagFrac > 0 || P.data) txt(ctx, T, `${P.flagLabel}  ${fmt(nFlag)}`, RX, 296, { size: 12, color: C.accent });
    const frameCells = Math.pow(10, L / 2) + 2;
    if (P.anchor === 'ruler') {
      txt(ctx, T, `1 mark = ${fmtV(pitch)} px`, RX, 322, { size: 12, color: C.ink });
      txt(ctx, T, `frame ${fmtV(frameCells)} marks wide`, RX, 340, { size: 12, color: C.muted });
    } else {
      const pm = Math.sqrt(P.m2PerPerson), fm = frameCells * pm;
      txt(ctx, T, `1 mark = ${fmtV(pm)} m`, RX, 322, { size: 12, color: C.ink });
      txt(ctx, T, `(${fmtV(P.m2PerPerson)} m2 per person)`, RX, 338, { size: 11, color: C.muted });
      txt(ctx, T, `frame ${fmtV(fm)} m wide`, RX, 356, { size: 12, color: C.ink });
    }
    // loupe: one tile and the s x s marks it stands for
    if (P.loupe) {
      const lx = RX, ly = 376, q = 44, la = .35 + .65 * ta;
      ctx.globalAlpha = la; ctx.fillStyle = C.ink; ctx.globalAlpha = la * .62; ctx.fillRect(lx, ly, q, q); ctx.globalAlpha = la;
      ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx + q + 8, ly + q / 2); ctx.lineTo(lx + q + 30, ly + q / 2); ctx.lineTo(lx + q + 25, ly + q / 2 - 4); ctx.moveTo(lx + q + 30, ly + q / 2); ctx.lineTo(lx + q + 25, ly + q / 2 + 4); ctx.stroke();
      const gx = lx + q + 40, cs = q / s; ctx.fillStyle = C.ink; ctx.beginPath(); for (let dj = 0; dj < s; dj++) for (let di = 0; di < s; di++) { ctx.moveTo(gx + (di + .5) * cs + cs * .3, ly + (dj + .5) * cs); ctx.arc(gx + (di + .5) * cs, ly + (dj + .5) * cs, cs * .3, 0, 6.2832); } ctx.fill(); ctx.globalAlpha = 1;
      txt(ctx, T, `1 tile = ${f} marks`, lx, ly + q + 18, { size: 12, color: C.ink, a: la });
    }

    // ---------- far right: the ladder ----------
    const ax = 922, ay0 = 456, ay1 = 92, yOf = v => ay0 + (ay1 - ay0) * v / P.top;
    ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay0); ctx.lineTo(ax, ay1); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay0); ctx.lineTo(ax, yOf(L)); ctx.stroke();
    for (const rg of tl.rungs) {
      const y = yOf(rg.k), reached = L >= rg.k - 1e-6;
      ctx.fillStyle = reached ? C.accent : C.bg; ctx.strokeStyle = reached ? C.accent : C.muted; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(ax, y, 4, 0, 6.2832); ctx.fill(); ctx.stroke();
      txt(ctx, T, fmt(rg.n), ax - 12, y + 4, { size: 11, align: 'right', color: Math.abs(L - rg.k) < .02 ? C.ink : C.muted });
    }
    if (P.lod !== 'marks') {
      const ys = yOf(Math.log10(P.budget)); ctx.strokeStyle = C.accent2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax - 9, ys); ctx.lineTo(ax + 9, ys); ctx.stroke();
      txt(ctx, T, 'LOD swap', ax - 12, ys + 4, { size: 11, align: 'right', color: C.accent2 });
    }
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(ax + 11, yOf(L)); ctx.lineTo(ax + 5, yOf(L) - 4); ctx.lineTo(ax + 5, yOf(L) + 4); ctx.fill();

    // ---------- left column: the anchor (constant size) ----------
    const lx0 = 28, T0 = PS / 3;   // ruler length = one mark at L = 0
    txt(ctx, T, 'ANCHOR', lx0, 92, { size: 11, color: C.muted });
    if (P.anchor === 'ruler') {
      txt(ctx, T, '1 unit', lx0, 132, { role: 'disp', size: 34, color: C.accent2 });
      const ry = 168; ctx.strokeStyle = C.accent2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx0, ry); ctx.lineTo(lx0 + T0, ry); ctx.moveTo(lx0, ry - 9); ctx.lineTo(lx0, ry + 9); ctx.moveTo(lx0 + T0, ry - 9); ctx.lineTo(lx0 + T0, ry + 9);
      ctx.lineWidth = 1; for (let q = 1; q < 8; q++) { const xx = lx0 + T0 * q / 8; ctx.moveTo(xx, ry); ctx.lineTo(xx, ry + (q === 4 ? 8 : 5)); } ctx.stroke();
      txt(ctx, T, '= 1 mark at n = 1', lx0, 196, { size: 12, color: C.ink });
      txt(ctx, T, 'this ruler now spans', lx0, 246, { size: 11, color: C.muted });
      fitTxt(ctx, T, `${fmtV(T0 / pitch)} marks`, lx0, 282, 'disp', 34, 190, C.ink);
      const gy = 316; ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx0, gy); ctx.lineTo(lx0 + Math.max(pitch, 1.5), gy); ctx.stroke();
      txt(ctx, T, `1 mark now = ${fmtV(pitch)} px`, lx0, gy + 22, { size: 12, color: C.ink });
    } else {
      const kpm = 15, order = ['person', 'door', 'car', 'bus'], pm = Math.sqrt(P.m2PerPerson), fm = frameCells * pm;
      let unit = SIL.person; for (const nm of order) if (SIL[nm].m <= fm) unit = SIL[nm];
      ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
      const pos = { person: [lx0 + 6, 232], door: [lx0 + 56, 232], car: [lx0 + 108, 232], bus: [lx0, 322] };
      for (const nm of order) {
        const on = SIL[nm] === unit; ctx.strokeStyle = C.accent2; ctx.globalAlpha = on ? 1 : .42;
        SIL[nm].draw(ctx, pos[nm][0], pos[nm][1], kpm); ctx.globalAlpha = 1;
        const lx = nm === 'bus' ? lx0 : pos[nm][0] - 2; txt(ctx, T, nm === 'person' ? '1.7m' : nm === 'door' ? '2m' : nm === 'car' ? '4.5m' : 'bus 12 m', lx, pos[nm][1] + 16, { size: 11, color: on ? C.ink : C.muted });
      }
      ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx0 - 4, 232); ctx.lineTo(lx0 + 190, 232); ctx.moveTo(lx0 - 4, 322); ctx.lineTo(lx0 + 190, 322); ctx.stroke();
      txt(ctx, T, `anchor ${kpm} px = 1 m`, lx0, 364, { size: 12, color: C.ink });
      txt(ctx, T, `world now ${fmtV(pitch / pm)} px = 1 m`, lx0, 384, { size: 12, color: C.ink });
      txt(ctx, T, `frame = ${fmtV(fm / unit.m)} x ${unit.name === 'person' ? 'person' : unit.name}`, lx0, 404, { size: 12, color: C.accent2 });
    }
    // the anchor's own count
    const by = 446;
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(lx0 + 9, by - 6, 7, 0, 6.2832); ctx.fill();
    txt(ctx, T, 'one mark = one person', lx0 + 26, by - 2, { size: 12, color: C.ink });
    txt(ctx, T, `frame holds ${fmt(n)} ${n === 1 ? 'anchor' : 'anchors'}`, lx0, by + 18, { size: 11, color: C.muted });

    if (P.note) txt(ctx, T, P.note, PX, PY + PS + 24, { size: 11, color: C.muted });
    ctx.restore();
    const out = { t, L, count: n, flagged: nFlag, pitch, lod: ta, tiles: nTiles, tileSum: nTiles ? tileSum : null, tileFlagged: nTiles ? tileFl : null, batch: f, drawn, tilesOnly };
    S.last = out; return out;
  }

  const BASE = {
    anchor: 'ruler', mark: 'dot', dwell: 1.2, move: 1.3, ease: '', top: 5,
    budget: 2500, tile: 4, swapW: .2, lod: 'auto', showSwap: false, loupe: false, tileStroke: false,
    flagFrac: .125, flagLabel: 'flagged', data: null, m2PerPerson: 1,
    note: 'Marks are shrunk, never resampled; past the budget each tile counts its marks.'
  };
  A.patterns['scale-anchor'] = {
    id: 'scale-anchor', atlas: ['camera-choreography', 'world-to-screen', 'easing-functions', 'derived-geometry', 'pure-function-of-t', 'seeded-determinism', 'gpu-instancing'],
    renderer: 'p2d', rendererFor() { return 'p2d'; },
    params: BASE,
    variants: [
      { name: 'dots-ruler', params: { anchor: 'ruler', mark: 'dot', budget: 2500, tile: 4 } },
      { name: 'people-ladder', params: { anchor: 'silhouettes', mark: 'person', budget: 2500, tile: 4, flagFrac: 0, m2PerPerson: 1, note: 'Assumption: one person per square metre, set m2PerPerson to your data.' } },
      { name: 'tiles-lod', params: { anchor: 'ruler', mark: 'square', budget: 400, tile: 5, swapW: .3, showSwap: true, loupe: true, tileStroke: true, note: 'Marks are shrunk, never resampled; the swap is shown and every tile counts its marks.' } }
    ],
    setup, draw, EASE,
    // helpers for films: captions land on rung windows; count(t) is what the frame shows
    timeline, level, countOf, lodAlpha, spiralIdx,
    count(t, params) { const P = Object.assign({}, BASE, params); return countOf(level(t, P)); },
    api: { timeline, level, countOf, lodAlpha, spiralIdx }
  };
})();
