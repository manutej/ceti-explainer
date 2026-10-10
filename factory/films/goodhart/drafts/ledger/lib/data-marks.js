/* data-marks · honest animated chart marks, no chart library. Bars, lines, areas, dots, dumbbells, slope, waffle.
   Every mark: enter(p, u, T) draws it at progress u in 0..1; highlight(pred) returns a copy with hl set.
   Axes declare their scale: a drawn zero, a drawn break when the domain does not start at zero. Bars and areas
   refuse a truncated scale. Labels are shoved apart in 1D, never overlapped. Roles only; pure of t; seed in setup.
   Exposes ARSENAL.dataMarks for reuse. */
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1), lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (u) => u * u * (3 - 2 * u);
  const mulberry32 = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const EZ = { cubic: (u) => 1 - Math.pow(1 - u, 3), expo: (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)) };
  const ez = (T) => (u) => (u <= 0 ? 0 : u >= 1 ? 1 : (EZ[T.tempo && T.tempo.ease] || EZ.cubic)(u));
  const stag = (u, i, n, s) => clamp((u - s * i / Math.max(1, n - 1)) / (1 - s), 0, 1);
  const fmtN = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---------- text ---------- */
  function font(T, role, size) { const f = T.type[role || 'mono']; return f.weight + ' ' + (size || 12) + 'px "' + f.family + '"'; }
  function txt(p, T, s, x, y, o) {
    o = o || {}; const c = p.drawingContext; c.save(); c.font = font(T, o.font, o.size); c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic';
    c.globalAlpha = o.a == null ? 1 : o.a; c.fillStyle = o.fill || T.color.muted; c.fillText(s, x, y); c.restore();
  }
  function tw(p, T, s, size, role) { const c = p.drawingContext; c.save(); c.font = font(T, role, size); const w = c.measureText(s).width; c.restore(); return w; }

  /* ---------- scale: linear, knows whether it starts at zero ---------- */
  function scale(d0, d1, r0, r1) {
    const s = { d0, d1, r0, r1, at: (v) => r0 + (v - d0) / (d1 - d0) * (r1 - r0), truncated: Math.min(d0, d1) > 0 };
    s.ticks = (n) => {
      const lo = Math.min(d0, d1), hi = Math.max(d0, d1), raw = (hi - lo) / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
      const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag, out = [];
      for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
      return out;
    };
    return s;
  }

  /* ---------- shove: 1D relaxation, order kept, nothing closer than gap, inside [lo,hi] ---------- */
  function shove(pos, gap, lo, hi) {
    const idx = pos.map((_, i) => i).sort((a, b) => pos[a] - pos[b] || a - b), y = idx.map((i) => pos[i]);
    for (let it = 0; it < 60; it++) {
      let moved = false;
      for (let k = 1; k < y.length; k++) { const d = y[k] - y[k - 1]; if (d < gap - 1e-6) { const h = (gap - d) / 2; y[k - 1] -= h; y[k] += h; moved = true; } }
      for (let k = 0; k < y.length; k++) y[k] = clamp(y[k], lo + k * 0, hi);
      if (y.length && y[0] < lo) y[0] = lo;
      if (!moved) break;
    }
    for (let k = 1; k < y.length; k++) if (y[k] < y[k - 1] + gap) y[k] = y[k - 1] + gap;      // final guarantee
    const out = new Array(pos.length); idx.forEach((i, k) => { out[i] = y[k]; }); return out;
  }

  /* ---------- axis: declares its scale. Zero drawn heavy and labelled; a truncated domain gets a drawn break and a note ---------- */
  function axis(p, T, sc, o) {
    const a = o.a == null ? 1 : o.a; if (a <= 0) return;
    const c = p.drawingContext, col = T.color, X = o.orient === 'x', fmt = o.fmt || fmtN, size = o.size || 11;
    c.save(); c.lineCap = 'butt';
    sc.ticks(o.n || 5).forEach((v) => {
      const q = sc.at(v), zero = v === 0;
      c.globalAlpha = a * (zero ? 0.85 : 1); c.strokeStyle = zero ? col.ink : col.line; c.lineWidth = zero ? 1.6 : 1;
      if (o.grid !== false || zero) { c.beginPath(); if (X) { c.moveTo(q, o.from); c.lineTo(q, o.to); } else { c.moveTo(o.from, q); c.lineTo(o.to, q); } c.stroke(); }
      if (X) txt(p, T, fmt(v), q, o.to + 16, { align: 'center', size, a, fill: zero ? col.ink : col.muted });
      else txt(p, T, fmt(v), o.from - 9, q + 4, { align: 'right', size, a, fill: zero ? col.ink : col.muted });
    });
    if (sc.truncated) {                                  // the break: an axis line cut by a gap with two slashes, plus the note
      const q0 = sc.at(sc.d0);
      c.globalAlpha = a; c.strokeStyle = col.ink; c.lineWidth = 1.3;
      if (!X) {
        const x = o.from, yb = q0 - 18;
        c.beginPath(); c.moveTo(x, q0); c.lineTo(x, yb + 5); c.moveTo(x, yb - 5); c.lineTo(x, sc.at(sc.d1)); c.stroke();
        c.beginPath(); c.moveTo(x - 7, yb + 8); c.lineTo(x + 7, yb + 2); c.moveTo(x - 7, yb - 2); c.lineTo(x + 7, yb - 8); c.stroke();
        txt(p, T, 'axis starts at ' + fmt(sc.d0) + ', not 0', o.from, q0 + 34, { size, a, fill: col.accent });
      } else {
        const y = o.to, xb = q0 + 18;
        c.beginPath(); c.moveTo(q0, y); c.lineTo(xb - 5, y); c.moveTo(xb + 5, y); c.lineTo(sc.at(sc.d1), y); c.stroke();
        c.beginPath(); c.moveTo(xb - 8, y + 7); c.lineTo(xb - 2, y - 7); c.moveTo(xb + 2, y + 7); c.lineTo(xb + 8, y - 7); c.stroke();
        txt(p, T, 'axis starts at ' + fmt(sc.d0) + ', not 0', q0, y + 34, { size, a, fill: col.accent });
      }
    }
    if (o.title) txt(p, T, o.title, X ? sc.at(sc.d1) : o.from - 9, X ? o.to + 32 : (o.titleY != null ? o.titleY : sc.at(sc.d1) - 12), { align: X ? 'right' : 'right', size, a });
    c.restore();
  }

  const colorOf = (T, d, any) => (d.hl ? T.color.accent : any ? T.color.muted : T.color.ink);
  const anyHl = (items) => items.some((d) => d.hl);

  /* ---------- bars: grow from a true zero; the label counts up and lands on the claim ---------- */
  function bars(spec) {
    const S = Object.assign({ dir: 'h', thick: 26, stagger: 0.35, fmt: fmtN }, spec);
    if (S.sc.d0 !== 0) throw new Error('data-marks: bars need a zero baseline; the scale starts at ' + S.sc.d0);
    return {
      kind: 'bars', spec: S,
      highlight(pred) { return bars(Object.assign({}, S, { items: S.items.map((d, i) => Object.assign({}, d, { hl: !!pred(d, i) })) })); },
      enter(p, u, T) {
        const c = p.drawingContext, e = ez(T), H = S.dir === 'h', z = S.sc.at(0), any = anyHl(S.items), n = S.items.length;
        S.items.forEach((d, i) => {
          const ui = stag(u, i, n, S.stagger), f = e(ui); if (ui <= 0) return;
          const tip = S.sc.at(d.v * f), fill = colorOf(T, d, any), lo = Math.min(z, tip), len = Math.abs(tip - z);
          c.save(); c.fillStyle = fill; c.globalAlpha = d.hl || !any ? 0.95 : 0.7;
          if (H) c.fillRect(lo, d.c - S.thick / 2, len, S.thick); else c.fillRect(d.c - S.thick / 2, lo, S.thick, len);
          c.restore();
          const cur = S.fmt(d.v * f), sz = 12;
          if (H) { txt(p, T, d.label, z - 10, d.c + 4, { align: 'right', size: sz, fill: d.hl ? T.color.accent : T.color.ink }); txt(p, T, cur, tip + 8, d.c + 4, { size: sz, fill: colorOf(T, d, false) }); }
          else { txt(p, T, d.label, d.c, z + 18, { align: 'center', size: sz, fill: d.hl ? T.color.accent : T.color.ink }); txt(p, T, cur, d.c, tip - 8, { align: 'center', size: sz, fill: colorOf(T, d, false) }); }
        });
      },
    };
  }

  /* ---------- line / area: arc-length reveal, a dot that leads, value label counting up, labels shoved apart ---------- */
  function line(spec) {
    const S = Object.assign({ dotR: 4.5, gap: 16, fmt: fmtN, labelPad: 12 }, spec);
    if (S.area && S.sc.truncated) throw new Error('data-marks: an area needs a zero baseline; the scale starts at ' + S.sc.d0);
    const ser = S.series.map((s) => { const cum = [0]; for (let i = 1; i < s.pts.length; i++) cum.push(cum[i - 1] + Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1])); return Object.assign({}, s, { cum, L: cum[cum.length - 1] }); });
    function headOf(s, f) {            // point at arc fraction f
      const d = clamp(f, 0, 1) * s.L; let k = 1; while (k < s.cum.length - 1 && s.cum[k] < d) k++;
      const a = s.cum[k - 1], b = s.cum[k], r = b > a ? (d - a) / (b - a) : 1;
      return { x: lerp(s.pts[k - 1][0], s.pts[k][0], r), y: lerp(s.pts[k - 1][1], s.pts[k][1], r), v: lerp(s.vals[k - 1], s.vals[k], r), k, r };
    }
    return {
      kind: 'line', spec: S, series: ser, head: headOf,
      fracAt: (s, i) => (s.L ? s.cum[i] / s.L : 0),
      highlight(pred) { return line(Object.assign({}, S, { series: S.series.map((s, i) => Object.assign({}, s, { hl: !!pred(s, i) })) })); },
      enter(p, u, T) {
        const c = p.drawingContext, f = smooth(clamp(u, 0, 1)), any = anyHl(ser), heads = [];
        ser.forEach((s) => {
          const h = headOf(s, f), col = colorOf(T, s, any); heads.push(h);
          c.save(); c.beginPath(); c.moveTo(s.pts[0][0], s.pts[0][1]);
          for (let k = 1; k < h.k; k++) c.lineTo(s.pts[k][0], s.pts[k][1]);
          c.lineTo(h.x, h.y);
          if (S.area) { c.save(); c.lineTo(h.x, S.baseY); c.lineTo(s.pts[0][0], S.baseY); c.closePath(); c.globalAlpha = 0.16; c.fillStyle = col; c.fill(); c.restore(); c.beginPath(); c.moveTo(s.pts[0][0], s.pts[0][1]); for (let k = 1; k < h.k; k++) c.lineTo(s.pts[k][0], s.pts[k][1]); c.lineTo(h.x, h.y); }
          c.strokeStyle = col; c.lineWidth = s.hl || !any ? 2.6 : 1.8; c.lineJoin = 'round'; c.lineCap = 'round'; c.globalAlpha = s.hl || !any ? 1 : 0.85; c.stroke(); c.restore();
          if (f > 0) { c.save(); c.fillStyle = col; c.globalAlpha = 0.22 * (1 - f); c.beginPath(); c.arc(h.x, h.y, S.dotR * 2.2, 0, 6.2832); c.fill(); c.globalAlpha = 1; c.beginPath(); c.arc(h.x, h.y, S.dotR, 0, 6.2832); c.fill(); c.restore(); }
        });
        if (S.labels && f > 0) {           // value labels follow the leading dots; shoved apart so they never overlap
          const ys = shove(heads.map((h) => h.y + 4), S.gap, S.top + 8, S.bottom);
          ser.forEach((s, i) => { const h = heads[i]; txt(p, T, (s.label ? s.label + ' ' : '') + S.fmt(h.v), h.x + S.labelPad, ys[i], { size: 12, fill: colorOf(T, s, false) }); if (Math.abs(ys[i] - (h.y + 4)) > 3) { const c2 = p.drawingContext; c2.save(); c2.strokeStyle = T.color.muted; c2.lineWidth = 1; c2.beginPath(); c2.moveTo(h.x + 5, h.y); c2.lineTo(h.x + S.labelPad - 3, ys[i] - 4); c2.stroke(); c2.restore(); } });
        }
        return { f, heads };
      },
    };
  }

  /* ---------- dots: scale in; with t0 they appear when a line's arc fraction passes ---------- */
  function dots(spec) {
    const S = Object.assign({ stagger: 0.5 }, spec);
    return {
      kind: 'dots', spec: S,
      highlight(pred) { return dots(Object.assign({}, S, { items: S.items.map((d, i) => Object.assign({}, d, { hl: !!pred(d, i) })) })); },
      enter(p, u, T) {
        const c = p.drawingContext, e = ez(T), any = anyHl(S.items), n = S.items.length;
        S.items.forEach((d, i) => {
          const ui = d.t0 != null ? seg(u, d.t0, d.t0 + 0.03) : stag(u, i, n, S.stagger); if (ui <= 0) return;
          c.save(); c.fillStyle = colorOf(T, d, any); c.globalAlpha = 0.95; c.beginPath(); c.arc(d.x, d.y, (d.r || 4) * e(ui), 0, 6.2832); c.fill(); c.restore();
          if (d.label && ui >= 1) txt(p, T, d.label, d.x + (d.r || 4) + 6, d.y + 4, { size: 11, fill: T.color.ink });
        });
      },
    };
  }

  /* ---------- dumbbell: ring at the start value, dot travels to the end value, count-up lands on it ---------- */
  function dumbbell(spec) {
    const S = Object.assign({ r: 6, stagger: 0.45, fmt: fmtN }, spec);
    return {
      kind: 'dumbbell', spec: S,
      highlight(pred) { return dumbbell(Object.assign({}, S, { items: S.items.map((d, i) => Object.assign({}, d, { hl: !!pred(d, i) })) })); },
      enter(p, u, T) {
        const c = p.drawingContext, e = ez(T), any = anyHl(S.items), n = S.items.length, X = S.sc.at;
        S.items.forEach((d, i) => {
          const ui = stag(u, i, n, S.stagger); if (ui <= 0) return;
          const col = colorOf(T, d, any), f = e(ui), cur = lerp(d.a, d.b, f), xa = X(d.a), xb = X(cur), dir = d.b >= d.a ? 1 : -1;
          txt(p, T, d.label, S.labelX, d.c + 4, { align: 'right', size: 12, fill: d.hl ? T.color.accent : T.color.ink });
          c.save(); c.strokeStyle = col; c.lineWidth = 3; c.globalAlpha = d.hl || !any ? 0.7 : 0.5; c.beginPath(); c.moveTo(xa, d.c); c.lineTo(xb, d.c); c.stroke();
          c.globalAlpha = 1; c.lineWidth = 2; c.fillStyle = T.color.bg; c.beginPath(); c.arc(xa, d.c, S.r, 0, 6.2832); c.fill(); c.stroke();
          c.fillStyle = col; c.beginPath(); c.arc(xb, d.c, S.r, 0, 6.2832); c.fill(); c.restore();
          txt(p, T, S.fmt(d.a), xa - dir * (S.r + 7), d.c + 4, { align: dir > 0 ? 'right' : 'left', size: 11 });
          txt(p, T, S.fmt(cur), xb + dir * (S.r + 7), d.c + 4, { align: dir > 0 ? 'left' : 'right', size: 11, fill: colorOf(T, d, false) });
        });
      },
    };
  }

  /* ---------- slope: one line per item between two columns; end labels shoved apart, leaders when displaced ---------- */
  function slope(spec) {
    const S = Object.assign({ stagger: 0.4, fmt: fmtN, gap: 15 }, spec);
    return {
      kind: 'slope', spec: S,
      highlight(pred) { return slope(Object.assign({}, S, { items: S.items.map((d, i) => Object.assign({}, d, { hl: !!pred(d, i) })) })); },
      enter(p, u, T) {
        const c = p.drawingContext, e = ez(T), any = anyHl(S.items), n = S.items.length, ya = S.items.map((d) => S.sc.at(d.a)), yb = S.items.map((d) => S.sc.at(d.b));
        const sa = shove(ya, S.gap, S.top, S.bottom), sb = shove(yb, S.gap, S.top, S.bottom);
        const ordered = S.items.map((d, i) => i).sort((i, j) => (S.items[i].hl ? 1 : 0) - (S.items[j].hl ? 1 : 0));
        ordered.forEach((i) => {
          const d = S.items[i], ui = stag(u, i, n, S.stagger); if (ui <= 0) return;
          const f = e(ui), col = colorOf(T, d, any), xe = lerp(S.xL, S.xR, f), ye = lerp(ya[i], yb[i], f);
          c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = d.hl ? 2.6 : 1.8; c.globalAlpha = d.hl || !any ? 1 : 0.75; c.lineCap = 'round';
          c.beginPath(); c.moveTo(S.xL, ya[i]); c.lineTo(xe, ye); c.stroke();
          c.beginPath(); c.arc(S.xL, ya[i], 4, 0, 6.2832); c.fill(); c.beginPath(); c.arc(xe, ye, 4, 0, 6.2832); c.fill();
          c.strokeStyle = T.color.muted; c.lineWidth = 1; c.globalAlpha = 0.7;
          if (Math.abs(sa[i] - 4 - ya[i]) > 3) { c.beginPath(); c.moveTo(S.xL - 5, ya[i]); c.lineTo(S.xL - 12, sa[i] - 4); c.stroke(); }
          if (f >= 1 && Math.abs(sb[i] - 4 - yb[i]) > 3) { c.beginPath(); c.moveTo(S.xR + 5, yb[i]); c.lineTo(S.xR + 12, sb[i] - 4); c.stroke(); }
          c.restore();
          txt(p, T, d.label + ' ' + S.fmt(d.a), S.xL - 16, sa[i], { align: 'right', size: 11, fill: colorOf(T, d, false) });
          txt(p, T, S.fmt(lerp(d.a, d.b, f)) + ' ' + d.label, S.xR + 16, sb[i], { size: 11, a: seg(ui, 0.3, 0.6), fill: colorOf(T, d, false) });
        });
        if (S.heads) { txt(p, T, S.heads[0], S.xL, S.top - 14, { align: 'center', size: 12, fill: T.color.ink }); txt(p, T, S.heads[1], S.xR, S.top - 14, { align: 'center', size: 12, fill: T.color.ink }); }
      },
    };
  }

  /* ---------- waffle: n cells, every cell one count. form() carries the same cells to rows (a), fuses them into bars (f),
     and contracts each bar to a dot at its value (c). The scale stays the same throughout, so the count never changes. ---------- */
  function waffle(spec) {
    const S = Object.assign({ cols: 10, size: 22, pitch: 26, thick: 40, cellH: 16 }, spec);
    const cells = []; let at = 0;
    S.groups.forEach((g, k) => { for (let j = 0; j < g.n; j++, at++) { const col = at % S.cols, row = Math.floor(at / S.cols), rows = Math.ceil(S.n / S.cols); cells.push({ i: at, g: k, j, wx: S.x0 + (col + 0.5) * S.pitch, wy: S.y0 + (rows - row - 0.5) * S.pitch }); } });
    const unit = S.sc.at(1) - S.sc.at(0), z = S.sc.at(0);
    const api = {
      kind: 'waffle', spec: S, cells,
      highlight(pred) { return waffle(Object.assign({}, S, { groups: S.groups.map((g, k) => Object.assign({}, g, { hl: !!pred(g, k) })) })); },
      form(p, T, o) {
        const c = p.drawingContext, e = ez(T), any = anyHl(S.groups), n = cells.length, fe = e(o.f || 0), ce = e(o.c || 0);
        const fillOf = (k) => { const g = S.groups[k]; return g.hl ? T.color.accent : any ? T.color.muted : T.color.ink; };
        const alphaOf = (k) => (S.groups[k].hl ? 1 : any ? 0.55 : [0.92, 0.62, 0.38][k % 3]);
        const landed = S.groups.map(() => 0); let popped = 0;
        c.save();
        if (!(o.c > 0)) {
          cells.forEach((m) => {
            const up = stag(o.pop == null ? 1 : o.pop, m.i, n, 0.6), ua = stag(o.a || 0, m.i, n, 0.6), ea = e(ua), sz = lerp(S.size, 1, 0);
            if (up <= 0) return; if (up >= 1) popped++;
            const tw_ = unit - 2 * (1 - fe) + 0.5 * fe, th_ = lerp(S.cellH, S.thick, fe);
            const rx = z + (m.j + 0.5) * unit, ry = S.rowY[m.g];
            const x = lerp(m.wx, rx, ea), y = lerp(m.wy, ry, ea) - 28 * Math.sin(Math.PI * ea), w = lerp(S.size, tw_, ea) * e(up), h = lerp(S.size, th_, ea) * e(up);
            if (ua >= 1) landed[m.g]++;
            c.globalAlpha = alphaOf(m.g); c.fillStyle = fillOf(m.g); c.fillRect(x - w / 2, y - h / 2, w, h);
          });
        } else {
          S.groups.forEach((g, k) => { landed[k] = g.n; });
          S.groups.forEach((g, k) => {
            const xr0 = z + g.n * unit, xl = lerp(z, xr0 - 8, ce), xr = lerp(xr0, xr0 + 8, ce), h = lerp(S.thick, 16, ce), y = S.rowY[k];
            c.globalAlpha = 0.5 * ce; c.strokeStyle = T.color.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(z, y); c.lineTo(xl, y); c.stroke();     // stem keeps the value readable from the zero
            c.globalAlpha = alphaOf(k); c.fillStyle = fillOf(k);
            c.beginPath(); if (c.roundRect) c.roundRect(xl, y - h / 2, xr - xl, h, lerp(0, 8, ce)); else c.rect(xl, y - h / 2, xr - xl, h); c.fill();
          });
        }
        c.restore();
        if ((o.a || 0) > 0) S.groups.forEach((g, k) => {
          const a = seg(o.a, 0.55, 1), tip = z + (o.c > 0 ? g.n : landed[k]) * unit + (o.c > 0 ? 8 * ce : 0);
          txt(p, T, g.label, z - 12, S.rowY[k] + 4, { align: 'right', size: 12, a, fill: g.hl ? T.color.accent : T.color.ink });
          txt(p, T, fmtN(landed[k]), tip + 10, S.rowY[k] + 4, { size: 13, a: o.a >= 1 || landed[k] > 0 ? 1 : 0, fill: g.hl ? T.color.accent : T.color.ink });
        });
        return { popped, landed };
      },
      enter(p, u, T) { return api.form(p, T, { pop: u }); },
    };
    return api;
  }

  /* ---------- shared furniture ---------- */
  function head(p, T, title, sub, subFill) {
    txt(p, T, title, 60, 58, { font: 'disp', size: 28, fill: T.color.ink });
    txt(p, T, sub, 60, 80, { size: 12, fill: subFill || T.color.muted });
  }
  const note = (p, T, s) => txt(p, T, s, 60, 524, { size: 10 });
  const DUR = 12;

  /* ---------- variant: bar race, 8 items re-sorting ---------- */
  const RACE = { years: [2019, 2020, 2021, 2022, 2023, 2024], max: 250, hlName: 'Cedar', data: [
    { name: 'Alder', v: [120, 130, 140, 142, 145, 148] }, { name: 'Birch', v: [90, 125, 165, 180, 184, 186] }, { name: 'Cedar', v: [40, 70, 110, 160, 205, 238] },
    { name: 'Dunn', v: [100, 105, 98, 92, 85, 80] }, { name: 'Elm', v: [30, 45, 70, 95, 120, 162] }, { name: 'Fir', v: [70, 72, 75, 80, 82, 90] },
    { name: 'Gorse', v: [20, 30, 35, 50, 66, 84] }, { name: 'Hazel', v: [55, 52, 50, 48, 46, 44] } ] };
  function drawRace(p, t, st, P, T) {
    const R = P.race, last = R.years.length - 1, g = seg(t, 0, 1.4), yt = last * seg(t, 1.4, 10.4), k = Math.min(last - 1, Math.floor(yt)), f = yt - k, w = 6;
    const vals = R.data.map((d) => lerp(d.v[k], d.v[k + 1], f));
    const items = R.data.map((d, i) => {
      let rank = 0; vals.forEach((vj, j) => { if (j !== i) rank += smooth(clamp((vj - vals[i]) / (2 * w) + 0.5, 0, 1)); });
      return { label: d.name, v: vals[i], c: 128 + (rank + 0.5) * 44 };
    });
    let m = bars({ items, sc: st.sc, dir: 'h', thick: 32, stagger: 0.3 }); if (t > 10.6) m = m.highlight((d) => d.label === R.hlName);
    const win = t > 10.6;
    head(p, T, 'Weekly orders by supplier', win ? R.hlName + ' went from ' + R.data[2].v[0] + ' to ' + R.data[2].v[last] + ' and finished first' : 'eight suppliers, re-ranked as the year turns', win ? T.color.accent : T.color.muted);
    axis(p, T, st.sc, { orient: 'x', from: 118, to: 484, a: seg(t, 0, 0.8), n: 5, title: 'orders per week, thousands' });
    m.enter(p, g, T);
    txt(p, T, String(R.years[0] + Math.round(yt * (R.years[last] - R.years[0]) / last)), 880, 452, { font: 'disp', size: 84, align: 'right', fill: T.color.line, a: 1 });
    note(p, T, 'illustrative data · bars start at zero on a fixed axis · rank slides when values cross');
  }

  /* ---------- variant: line with a leading dot and an annotated peak (axis truncated, break drawn) ---------- */
  function buildLine(p, ctx, P) {
    const r = mulberry32(ctx.seed || 1), N = P.n, L = P.line, A = [], B = [];
    if (L.area) {            // cumulative signups: monotone, lands on the claim
      const inc = []; let sum = 0; for (let i = 0; i < N; i++) { const v = 20 + 55 * (i / N) * (0.6 + r() * 0.8) + 25 * r(); inc.push(v); sum += v; }
      let run = 0; for (let i = 0; i < N; i++) { run += inc[i] * L.total / sum; A.push(Math.round(run)); } A[N - 1] = L.total;
    } else {
      for (let i = 0; i < N; i++) {
        A.push(Math.round(clamp(52 + 40 * Math.exp(-Math.pow((i - 31) / 8, 2)) + 5 * Math.sin(i / 12 * 6.2832) - 0.18 * Math.max(0, i - 36) * 3 + (r() - 0.5) * 6, 41, 108)));
        B.push(Math.round(clamp(50 + 0.18 * i + 4 * Math.sin((i - 2) / 12 * 6.2832) + (r() - 0.5) * 4, 41, 108)));
      }
      B[N - 1] += (A[N - 1] - 2) - B[N - 1];
    }
    const bx0 = 96, bx1 = 790, top = 128, bot = 440, sc = scale(L.d0, L.d1, bot, top);
    const xs = (i) => bx0 + (bx1 - bx0) * i / (N - 1), mk = (vals) => vals.map((v, i) => [xs(i), sc.at(v)]);
    const series = L.area ? [{ pts: mk(A), vals: A, label: L.name, hl: true }] : [{ pts: mk(B), vals: B, label: 'Industry', hl: false }, { pts: mk(A), vals: A, label: 'Ours', hl: true }];
    let pk = 0; A.forEach((v, i) => { if (v > A[pk]) pk = i; });
    const m = line({ series, sc, baseY: bot, area: !!L.area, labels: true, top, bottom: bot - 4, gap: 16, labelPad: 12 });
    const dts = dots({ items: A.map((v, i) => ({ x: xs(i), y: sc.at(v), r: 2.4, t0: m.fracAt(m.series[series.length - 1], i) })) });
    return { sc, m, dts, A, pk, xs, bx0, bx1, top, bot, N };
  }
  function drawLine(p, t, st, P, T) {
    const L = P.line, u = seg(t, 0.8, 9.6), { sc, m, dts, A, pk, xs, bx0, bx1, top, bot, N } = st, ei = m.series.length - 1;
    const years = (i) => (L.area ? 'month ' + (i + 1) : MON[i % 12] + ' ' + (2021 + Math.floor(i / 12)));
    // x axis: labelled at yearly ticks, drawn by hand because x is an index, not a quantity
    const c = p.drawingContext; c.save(); c.globalAlpha = seg(t, 0, 0.8);
    for (let i = 0; i < N; i += (L.area ? 6 : 12)) { c.strokeStyle = T.color.line; c.lineWidth = 1; c.beginPath(); c.moveTo(xs(i), top); c.lineTo(xs(i), bot); c.stroke(); txt(p, T, L.area ? String(i) : String(2021 + i / 12), xs(i), bot + 16, { align: 'center', size: 11 }); }
    c.restore(); txt(p, T, L.area ? 'months since launch' : 'monthly index', bx1, bot + 32, { align: 'right', size: 11, a: seg(t, 0, 0.8) });
    axis(p, T, sc, { orient: 'y', from: bx0, to: bx1, a: seg(t, 0, 0.8), n: 5, grid: true, title: L.unit, titleY: top - 14 });
    const res = m.enter(p, u, T);
    dts.enter(p, res.f, T);
    const frac = m.fracAt(m.series[ei], pk), a = L.area ? 0 : seg(res.f, frac, frac + 0.035);
    if (a > 0) {
      const x = xs(pk), y = sc.at(A[pk]), tx = x - 70, ty = y - 40;
      c.save(); c.globalAlpha = a; c.strokeStyle = T.color.accent; c.lineWidth = 1.4; c.beginPath(); c.arc(x, y, 8, 0, 6.2832); c.stroke();
      c.beginPath(); c.moveTo(x - 6, y - 6); c.lineTo(tx + 24, ty + 6); c.stroke(); c.restore();
      txt(p, T, 'Peak ' + A[pk], tx + 24, ty, { align: 'right', font: 'disp', size: 20, a, fill: T.color.accent });
      txt(p, T, years(pk), tx + 24, ty + 14, { align: 'right', size: 11, a, fill: T.color.ink });
    }
    const done = t > 9.8;
    head(p, T, L.title, done ? L.claim(A, pk) : L.sub, done ? T.color.accent : T.color.muted);
    note(p, T, 'illustrative data' + (sc.truncated ? ' · the vertical axis is cut and says so' : ' · area starts at the drawn zero'));
  }

  /* ---------- variant: waffle of 100 becomes a bar then a dot ---------- */
  function buildWaffle(p, ctx, P) {
    const W = P.waffle, sc = scale(0, 50, 380, 880), rowY = [200, 290, 380];
    return { sc, rowY, w: waffle({ n: 100, groups: W.groups, x0: 70, y0: 150, sc, rowY, hl: false }) };
  }
  function drawWaffle(p, t, st, P, T) {
    const pop = seg(t, 0, 1.6), a = seg(t, 2.6, 5.4), f = seg(t, 5.6, 6.6), c = seg(t, 8.0, 10.6);
    let w = st.w; if (t > 10.8) w = w.highlight((g) => g.n > 40);
    const sub = t < 2.6 ? '100 users, one cell each' : t < 5.6 ? 'the same 100 cells, counted into three groups' : t < 8.0 ? 'cells fuse: bar length is the count' : t < 10.8 ? 'the end of each bar is its value: one dot' : P.waffle.groups[0].n + ' of 100 open it weekly';
    head(p, T, 'How often users open the app', sub, t > 10.8 ? T.color.accent : T.color.muted);
    axis(p, T, st.sc, { orient: 'x', from: 150, to: 440, a: seg(a, 0, 0.5), n: 5, title: 'users out of 100' });
    const r = w.form(p, T, { pop, a, f, c });
    if (a === 0) txt(p, T, fmtN(100 * pop) + ' users', 70, 440, { size: 13, fill: T.color.ink, a: pop > 0 ? 1 : 0 });
    note(p, T, 'illustrative data · 1 cell = 1 user · the zero stays drawn through every form');
  }

  /* ---------- variant: dumbbell beside a slope chart ---------- */
  const DB = [['North', 34, 58], ['South', 61, 52], ['East', 48, 49], ['West', 22, 47], ['Coast', 70, 66], ['Inland', 15, 31]];
  function buildSlope(p, ctx, P) {
    const sx = scale(0, 100, 170, 450), sy = scale(0, 100, 440, 150);
    const dItems = DB.map((r, i) => ({ label: r[0], a: r[1], b: r[2], c: 150 + i * 50 })), sItems = DB.map((r) => ({ label: r[0], a: r[1], b: r[2] }));
    return { sx, sy, dumb: dumbbell({ items: dItems, sc: sx, labelX: 118, r: 6 }), slope: slope({ items: sItems, sc: sy, xL: 640, xR: 800, top: 150, bottom: 440, gap: 15, heads: ['2020', '2024'] }) };
  }
  function drawSlope(p, t, st, P, T) {
    const u1 = seg(t, 0.4, 5), u2 = seg(t, 5.6, 10); let d = st.dumb, s = st.slope; const hl = (r) => r.b - r.a >= 20;
    if (t > 10.2) { d = d.highlight(hl); s = s.highlight(hl); }
    head(p, T, 'Share of households with the service', t > 10.2 ? 'two regions gained more than 20 points' : 'same six values twice: change as a gap, then as a slope', t > 10.2 ? T.color.accent : T.color.muted);
    axis(p, T, st.sx, { orient: 'x', from: 140, to: 440, a: seg(t, 0, 0.8), n: 4, title: 'percent' });
    axis(p, T, st.sy, { orient: 'y', from: 560, to: 856, a: seg(t, 4.8, 5.6), n: 4, grid: true, size: 11 });
    d.enter(p, u1, T); s.enter(p, u2, T);
    note(p, T, 'illustrative data · both charts share the 0 to 100 scale · end labels are shoved apart, with a leader where they moved');
  }

  /* ---------- registration ---------- */
  const base = {
    mode: 'race', race: RACE, n: 48,
    line: { title: 'Monthly active accounts', sub: 'a leading dot walks the data; the peak is named when it passes', d0: 40, d1: 110, unit: 'index', name: 'Ours', claim: (A, pk) => 'Peak ' + A[pk] + ' in ' + MON[pk % 12] + ' ' + (2021 + Math.floor(pk / 12)) + ', then a slow fall to ' + A[A.length - 1] },
    waffle: { groups: [{ label: 'Weekly', n: 47 }, { label: 'Monthly', n: 31 }, { label: 'Rarely', n: 22 }] },
  };
  ARSENAL.dataMarks = { scale, axis, shove, bars, line, dots, dumbbell, slope, waffle, fmtN, mulberry32 };
  ARSENAL.patterns['data-marks'] = {
    id: 'data-marks', atlas: ['map-norm-constrain', 'shape-2d-primitives', 'text-width', 'd3'], renderer: 'p2d', dur: DUR,
    params: base,
    variants: [
      { name: 'bar-race', params: { mode: 'race' } },
      { name: 'line-peak', params: { mode: 'line' } },
      { name: 'waffle-bar-dot', params: { mode: 'waffle' } },
      { name: 'dumbbell-slope', params: { mode: 'slope' } },
      { name: 'area-from-zero', params: { mode: 'line', n: 24, line: { area: true, title: 'Signups since launch', sub: 'an area is only honest from zero, so the zero is drawn', d0: 0, d1: 1500, unit: 'signups', name: 'Signups', total: 1240, claim: () => '1,240 signups in 24 months' } } },
    ],
    setup(p, ctx, P) {
      P = Object.assign({}, base, P);
      if (P.mode === 'race') return { sc: scale(0, P.race.max, 170, 880) };
      if (P.mode === 'line') return buildLine(p, ctx, P);
      if (P.mode === 'waffle') return buildWaffle(p, ctx, P);
      return buildSlope(p, ctx, P);
    },
    draw(p, t, st, P, T) {
      P = Object.assign({}, base, P); p.background(T.color.bg);
      ({ race: drawRace, line: drawLine, waffle: drawWaffle, slope: drawSlope })[P.mode](p, t, st, P, T);
    },
  };
})();
