/* grid-type: a 12-column grid with named regions, a modular type scale, a baseline grid, three layout templates as
   data, and fit(text, box). Pure function of t. Token roles only. Text is set with Canvas2D (drawingContext) so the
   measuring and the drawing use the same font string; fonts must be loaded before setup (the demo awaits them). */
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  const REF_W = 960, REF_H = 540, CSS_W = 390;
  const FLOOR = { disp: 28, body: 28, mono: 14, chrome: 12 };       // legibility floors, in 960-basis units
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  const easeOut = u => 1 - Math.pow(1 - clamp(u), 3);
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const css390 = u => Math.round(u * CSS_W / REF_W * 10) / 10;

  // ---- 1. the grid: columns, gutters, baseline rows, on the 960x540 basis --------------------------
  function grid(o) {
    o = Object.assign({ cols: 12, margin: 48, gutter: 16, top: 36, bottom: 36, baseline: 12 }, o);
    const colW = (REF_W - 2 * o.margin - (o.cols - 1) * o.gutter) / o.cols;
    const rows = Math.floor((REF_H - o.top - o.bottom) / o.baseline);
    const g = { W: REF_W, H: REF_H, cols: o.cols, colW, gutter: o.gutter, margin: o.margin, top: o.top, B: o.baseline, rows };
    g.x = c => o.margin + c * (colW + o.gutter);
    g.y = r => o.top + r * o.baseline;
    g.box = (c0, n, r0, nr) => ({ x: g.x(c0), y: g.y(r0), w: n * colW + (n - 1) * o.gutter, h: nr * o.baseline });
    return g;
  }

  // ---- 2. the modular scale: step -> size, role floors, CSS px at 390 ------------------------------
  function scale(o) {
    o = Object.assign({ base: 28, ratio: 1.25 }, o);
    const raw = s => o.base * Math.pow(o.ratio, s);
    const size = (s, role) => Math.max(FLOOR[role || 'body'], Math.round(raw(s)));
    const stepOf = u => Math.round(Math.log(u / o.base) / Math.log(o.ratio) * 10) / 10;
    // descending on-scale sizes for a role, from step `hi` down to the floor (deduplicated)
    const sizes = (role, hi) => { const out = []; for (let s = hi; s >= -8; s--) { const v = size(s, role); if (!out.length || v < out[out.length - 1]) out.push(v); if (v <= FLOOR[role]) break; } return out; };
    // the brand's roles on the scale: body = step 0 (the caption floor), mono label = step -3 (floor 14), chrome = floor 12
    const roles = { caption: { face: 'body', step: 0 }, label: { face: 'mono', step: -3 }, chrome: { face: 'mono', step: -8 } };
    const table = Object.keys(roles).map(k => { const r = roles[k], role = k === 'caption' ? 'body' : k === 'label' ? 'mono' : 'chrome'; const u = size(r.step, role); return { role: k, face: r.face, step: r.step, size: u, css390: css390(u), floor: FLOOR[role] }; });
    return { base: o.base, ratio: o.ratio, size, sizes, stepOf, raw, table };
  }

  // ---- 3. fit(text, box): shrink along the scale, wrap on spaces, snap leading to the baseline ----
  let _mc = null;
  const mctx = () => _mc || (_mc = document.createElement('canvas').getContext('2d'));
  const fontStr = (weight, size, family) => `${weight} ${size}px "${family}", sans-serif`;
  const widthOf = (str, weight, size, family) => { const c = mctx(); c.font = fontStr(weight, size, family); return c.measureText(str).width; };
  function wrapLines(text, maxW, wf) {
    const words = String(text).split(/\s+/).filter(Boolean), lines = []; let cur = '';
    for (const w of words) { const test = cur ? cur + ' ' + w : w; if (!cur || wf(test) <= maxW) cur = test; else { lines.push(cur); cur = w; } }
    if (cur) lines.push(cur); return lines;
  }
  // o: { family, weight, sizes:[desc on-scale] | max,min (continuous, 1-unit steps), lh, B, wrap (default true) }
  // returns { lines, size, lead, off, overflow, w, h } ; off = first baseline offset from box top, a multiple of B
  function fit(text, box, o) {
    o = Object.assign({ family: 'sans-serif', weight: 400, lh: 1.15, B: 12, wrap: true, max: 200, min: 12 }, o);
    const cand = o.sizes ? o.sizes.slice() : (() => { const a = []; for (let s = Math.round(o.max); s >= o.min; s--) a.push(s); return a; })();
    const geom = size => ({ lead: Math.ceil(size * o.lh / o.B) * o.B, off: Math.ceil(0.78 * size / o.B) * o.B });
    for (const size of cand) {
      const wf = s => widthOf(s, o.weight, size, o.family), g = geom(size);
      const lines = o.wrap ? wrapLines(text, box.w, wf) : [String(text)];
      const widest = Math.max(...lines.map(wf));
      if (widest <= box.w + 0.01 && g.off + (lines.length - 1) * g.lead <= box.h + 0.01) return { lines, size, lead: g.lead, off: g.off, overflow: false, w: widest, h: g.off + (lines.length - 1) * g.lead };
    }
    const size = cand[cand.length - 1], g = geom(size), wf = s => widthOf(s, o.weight, size, o.family);
    let lines = o.wrap ? wrapLines(text, box.w, wf) : [String(text)];
    const nmax = Math.max(1, Math.floor((box.h - g.off) / g.lead) + 1);
    if (lines.length > nmax) lines = lines.slice(0, nmax);
    let last = lines[lines.length - 1]; while (last.length > 1 && wf(last + '…') > box.w) last = last.slice(0, -1);
    lines[lines.length - 1] = last + '…';
    return { lines, size, lead: g.lead, off: g.off, overflow: true, w: Math.max(...lines.map(wf)), h: g.off + (lines.length - 1) * g.lead };
  }

  // ---- 4. the count: n marks packed square into a box --------------------------------------------
  function markGrid(n, box) {
    let cols = Math.max(1, Math.ceil(Math.sqrt(n * box.w / box.h))), rows = Math.ceil(n / cols);
    // widen until the rows fit; pick the cols that maximises the cell
    let best = null;
    for (let c = Math.max(1, cols - 8); c <= cols + 8; c++) { const r = Math.ceil(n / c), cell = Math.min(box.w / c, box.h / r); if (!best || cell > best.cell) best = { cols: c, rows: r, cell }; }
    return { cols: best.cols, rows: best.rows, cell: best.cell, x0: box.x, y0: box.y, r: best.cell * 0.31 };
  }

  // ---- 5. three templates as data: named regions on the 12-column grid ----------------------------
  // region: { name, cols:[c0,n], rows:[r0,n] (baseline rows), kind | parts:[{kind, rel:[r0,n], ...}] }
  const TEMPLATES = {
    editorial: {   // big headline, the count beneath it, a side column that carries the number
      regions: [
        { name: 'hero', cols: [0, 8], rows: [1, 12], kind: 'headline', step: 8 },
        { name: 'ledger', cols: [0, 8], rows: [14, 18], kind: 'marks' },
        { name: 'side', cols: [9, 3], rows: [1, 31], parts: [{ kind: 'numeral', rel: [0, 15], color: 'ink', label: 'CASES' }, { kind: 'legend', rel: [17, 8] }] },
        { name: 'caption', cols: [0, 12], rows: [34, 5], kind: 'caption' }],
      rules: [{ col: 8, rows: [1, 31] }],
    },
    poster: {      // one number
      regions: [
        { name: 'hero', cols: [0, 9], rows: [1, 22], kind: 'numeral', color: 'accent', label: 'CASES' },
        { name: 'side', cols: [9, 3], rows: [1, 22], kind: 'headline', step: 5 },
        { name: 'ledger', cols: [0, 12], rows: [25, 8], kind: 'marks' },
        { name: 'caption', cols: [0, 12], rows: [34, 5], kind: 'caption' }],
      rules: [],
    },
    sheet: {       // the factory's layout: title, content box at left, ledger column and title block at right
      regions: [
        { name: 'hero', cols: [0, 9], rows: [1, 5], kind: 'headline', step: 5 },
        { name: 'ledger', cols: [0, 9], rows: [7, 25], kind: 'marks' },
        { name: 'side', cols: [9, 3], rows: [1, 31], parts: [{ kind: 'rows', rel: [0, 15] }, { kind: 'block', rel: [17, 14] }] },
        { name: 'caption', cols: [0, 12], rows: [34, 5], kind: 'caption' }],
      rules: [{ row: 33, cols: [0, 12] }],
    },
  };

  // ---- 6. layout(params, tokens): everything fitted, as drawable items with appear times ----------
  function layout(prm, tk) {
    const T = TEMPLATES[prm.template] || TEMPLATES.editorial, G = grid({ gutter: prm.gutter, margin: prm.margin, baseline: prm.baseline }), S = scale({ base: prm.base, ratio: prm.ratio });
    const ty = tk.type, B = G.B, items = [], regions = {}, report = [];
    const count = prm.count, flagged = prm.flagged, nStr = count.toLocaleString('en-US');
    const face = r => ty[r === 'disp' ? 'disp' : r === 'mono' ? 'mono' : 'body'];
    function text(where, str, box, faceRole, floorRole, o) {
      const f = face(faceRole);
      const r = fit(str, box, Object.assign({ family: f.family, weight: f.weight, B }, o));
      const align = o.align || 'left', x = align === 'right' ? box.x + box.w : box.x;
      items.push({ k: 'text', lines: r.lines, x, y: box.y + r.off, lead: r.lead, size: r.size, family: f.family, weight: f.weight, color: o.color || 'ink', align, t0: o.t0 || 0, ghost: o.ghost });
      report.push({ where, face: faceRole, size: r.size, step: S.stepOf(r.size), css390: css390(r.size), lines: r.lines.length, overflow: r.overflow, floor: FLOOR[floorRole] });
      return r;
    }
    const labelSz = S.size(-3, 'mono'), chromeSz = S.size(-8, 'chrome'), capSz = S.size(0, 'body');
    function build(kind, box, reg, part) {
      const o = part || reg;
      if (kind === 'headline') {
        const step = o.step, sizes = S.sizes('disp', step);
        text(reg.name, prm.headline, box, 'disp', 'disp', { sizes, lh: 1.08, color: 'ink', t0: 0.1 });
      } else if (kind === 'numeral') {
        text(reg.name + ' label', o.label, { x: box.x, y: box.y, w: box.w, h: 12 }, 'mono', 'mono', { sizes: [labelSz], lh: 1, color: 'muted', t0: 0.2 });
        const nb = { x: box.x, y: box.y + 24, w: box.w, h: box.h - 24 - 36 };   // 3 rows kept clear for the comma's descender
        text(reg.name, nStr, nb, 'disp', 'disp', { max: 420, min: FLOOR.disp, lh: 1.0, wrap: false, color: o.color || 'ink', t0: 0.3 });
      } else if (kind === 'legend') {
        const rows = [['accent', `${flagged.toLocaleString('en-US')} flagged`], ['ink', `${(count - flagged).toLocaleString('en-US')} clear`]];
        rows.forEach((rw, i) => {
          const y0 = box.y + i * 24;
          items.push({ k: 'dot', x: box.x + 5, y: y0 + 7, r: 4.5, color: rw[0], t0: 0.9 + i * 0.15 });
          text(reg.name + ' legend', rw[1], { x: box.x + 20, y: y0, w: box.w - 20, h: 24 }, 'mono', 'mono', { sizes: [labelSz], lh: 1, color: 'ink', t0: 0.9 + i * 0.15 });
        });
      } else if (kind === 'rows') {
        text(reg.name + ' head', 'COUNT LEDGER', { x: box.x, y: box.y, w: box.w, h: 12 }, 'mono', 'chrome', { sizes: [chromeSz], lh: 1, color: 'muted', t0: 0.2 });
        [['CASES', nStr], ['FLAGGED', String(flagged)], ['CLEAR', String(count - flagged)]].forEach((rw, i) => {
          const y0 = box.y + 24 + i * 36;
          items.push({ k: 'rule', x1: box.x, x2: box.x + box.w, y1: y0, y2: y0, color: 'line', t0: 0.3 + i * 0.1 });
          text(reg.name + ' row', rw[0], { x: box.x, y: y0 + 4, w: box.w * 0.5, h: 24 }, 'mono', 'mono', { sizes: [labelSz], lh: 1, color: 'muted', t0: 0.4 + i * 0.1 });
          text(reg.name + ' value', rw[1], { x: box.x + box.w * 0.4, y: y0 + 4, w: box.w * 0.6, h: 30 }, 'mono', 'mono', { sizes: S.sizes('mono', -1), lh: 1, color: i === 1 ? 'accent' : 'ink', align: 'right', t0: 0.4 + i * 0.1 });
        });
        items.push({ k: 'rule', x1: box.x, x2: box.x + box.w, y1: box.y + 24 + 3 * 36, y2: box.y + 24 + 3 * 36, color: 'line', t0: 0.6 });
      } else if (kind === 'block') {
        items.push({ k: 'frame', x: box.x, y: box.y, w: box.w, h: box.h, color: 'line', t0: 0.5 });
        text(reg.name + ' block', 'TITLE BLOCK', { x: box.x + 12, y: box.y + 8, w: box.w - 24, h: 12 }, 'mono', 'chrome', { sizes: [chromeSz], lh: 1, color: 'muted', t0: 0.6 });
        text(reg.name + ' block', nStr, { x: box.x + 12, y: box.y + 36, w: box.w - 24, h: 64 }, 'mono', 'mono', { max: 64, min: FLOOR.mono, lh: 1, wrap: false, color: 'ink', t0: 0.7 });
        text(reg.name + ' block', '1 MARK = 1 CASE', { x: box.x + 12, y: box.y + box.h - 28, w: box.w - 24, h: 20 }, 'mono', 'chrome', { sizes: [chromeSz], lh: 1, color: 'muted', t0: 0.8 });
      } else if (kind === 'marks') {
        const mg = markGrid(count, box);
        items.push({ k: 'marks', mg, t0: 0.4, span: 2.5 });
        report.push({ where: reg.name + ' marks', face: 'marks', size: Math.round(mg.cell * 10) / 10, step: null, css390: css390(mg.cell), lines: mg.rows, overflow: false, floor: null, note: `${mg.cols}x${mg.rows} cells of ${mg.cell.toFixed(1)}u` });
      } else if (kind === 'caption') {
        text(reg.name, prm.caption, box, 'body', 'body', { sizes: [capSz], lh: 1.2, color: 'ink', t0: 1.2 });
      }
    }
    for (const reg of T.regions) {
      const box = G.box(reg.cols[0], reg.cols[1], reg.rows[0], reg.rows[1]);
      regions[reg.name] = { name: reg.name, box, cols: reg.cols, rows: reg.rows };
      if (reg.parts) for (const part of reg.parts) { const b = { x: box.x, y: box.y + part.rel[0] * B, w: box.w, h: part.rel[1] * B }; build(part.kind, b, reg, part); }
      else build(reg.kind, box, reg);
    }
    for (const r of T.rules || []) {
      if (r.col != null) { const b = G.box(r.col, 1, r.rows[0], r.rows[1]); items.push({ k: 'rule', x1: b.x + b.w / 2, x2: b.x + b.w / 2, y1: b.y, y2: b.y + b.h, color: 'line', t0: 0.3 }); }
      else { const b = G.box(r.cols[0], r.cols[1], r.row, 1); items.push({ k: 'rule', x1: b.x, x2: b.x + b.w, y1: b.y, y2: b.y, color: 'line', t0: 0.3 }); }
    }
    return { G, S, T, items, regions, report, brand: tk.id, scaleTable: S.table };
  }

  // the box a chrome can expose as its content box: the union of hero and ledger
  function contentBox(name, params) {
    const prm = Object.assign({}, PARAMS, params || {}, { template: name });
    const L = layout(prm, ARSENAL.brands['ceti-dark'] || { id: 'x', type: { disp: {}, mono: {}, body: {} } });
    const a = L.regions.hero.box, b = L.regions.ledger.box, x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y), x1 = Math.max(a.x + a.w, b.x + b.w), y1 = Math.max(a.y + a.h, b.y + b.h);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  // ---- 7. draw -------------------------------------------------------------------------------------
  const PARAMS = {
    template: 'editorial',                 // editorial | poster | sheet
    ratio: 1.25,                           // modular scale ratio, 1.1..1.618
    base: 28,                              // step 0 = the body floor, 20..40
    gutter: 16,                            // column gutter, 8..32
    margin: 48, baseline: 12,              // side margin, baseline row height (the top/bottom margins are 36)
    count: 1000, flagged: 38,              // the count and how many are accented
    overlay: 'auto',                       // auto (first half of dur) | on | off
    dur: 8,
    headline: 'A thousand cases, counted one by one',
    caption: 'Each mark is one case. The accented marks are the 38 flagged.',
  };

  function setup(p, ctx, params) {
    const tk = (ctx && ctx.tokens) || ARSENAL.brands['ceti-dark'];
    const prm = Object.assign({}, PARAMS, params), rnd = mulberry32((ctx && ctx.seed) || 1);
    const idx = Array.from({ length: prm.count }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    const flag = new Uint8Array(prm.count); for (let i = 0; i < prm.flagged; i++) flag[idx[i]] = 1;
    return { L: layout(prm, tk), flag, prm };
  }

  function draw(p, t, state, params, tk) {
    const prm = Object.assign({}, PARAMS, params);
    if (state.L.brand !== tk.id) state.L = layout(prm, tk);
    const L = state.L, G = L.G, ctx = p.drawingContext, col = tk.color;
    p.push();
    p.background(col.bg);
    const ov = prm.overlay === 'on' ? 1 : prm.overlay === 'off' ? 0 : 1 - smooth(prm.dur / 2 - 0.4, prm.dur / 2, t);
    const font = (w, s, f) => { ctx.font = fontStr(w, s, f); };

    // overlay pass A: column bands under the content
    if (ov > 0.001) {
      ctx.save(); ctx.globalAlpha = ov; ctx.fillStyle = col.muted;
      ctx.globalAlpha = ov * 0.12; for (let c = 0; c < G.cols; c++) ctx.fillRect(G.x(c), G.y(0), G.colW, G.rows * G.B);
      ctx.restore();
    }
    // content
    for (const it of L.items) {
      const a = easeOut((t - it.t0) / 0.5); if (a <= 0 && it.k !== 'marks') continue;
      ctx.save(); ctx.globalAlpha = a;
      if (it.k === 'text') {
        font(it.weight, it.size, it.family); ctx.fillStyle = col[it.color]; ctx.textAlign = it.align; ctx.textBaseline = 'alphabetic';
        it.lines.forEach((ln, i) => ctx.fillText(ln, it.x, it.y + i * it.lead + 6 * (1 - a)));
      } else if (it.k === 'rule') {
        ctx.strokeStyle = col[it.color]; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(it.x1, it.y1); ctx.lineTo(it.x2, it.y2); ctx.stroke();
      } else if (it.k === 'frame') {
        ctx.strokeStyle = col[it.color]; ctx.lineWidth = 1; ctx.strokeRect(it.x, it.y, it.w, it.h);
      } else if (it.k === 'dot') {
        ctx.fillStyle = col[it.color]; ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2); ctx.fill();
      } else if (it.k === 'marks') {
        ctx.globalAlpha = 1; const mg = it.mg, n = state.prm.count;
        for (let pass = 0; pass < 2; pass++) {
          ctx.fillStyle = pass ? col.accent : col.ink; ctx.beginPath();
          for (let i = 0; i < n; i++) {
            if ((state.flag[i] ? 1 : 0) !== pass) continue;
            const k = easeOut((t - (it.t0 + i / n * it.span)) / 0.25); if (k <= 0) continue;
            const cx = mg.x0 + (i % mg.cols + 0.5) * mg.cell, cy = mg.y0 + (Math.floor(i / mg.cols) + 0.5) * mg.cell, r = mg.r * k * (pass ? 1.18 : 1);
            ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
      ctx.restore();
    }
    // overlay pass B: baseline rows, column numbers, region outlines and their labels, in the muted / accent roles
    if (ov > 0.001) {
      ctx.save();
      ctx.strokeStyle = col.muted; ctx.lineWidth = 0.5;
      for (let r = 0; r <= G.rows; r++) { ctx.globalAlpha = ov * (r % 4 === 0 ? 0.42 : 0.18); const y = G.y(r); ctx.beginPath(); ctx.moveTo(G.margin, y); ctx.lineTo(G.W - G.margin, y); ctx.stroke(); }
      const mono = tk.type.mono; font(mono.weight, FLOOR.chrome, mono.family); ctx.textAlign = 'center'; ctx.fillStyle = col.muted; ctx.globalAlpha = ov;
      for (let c = 0; c < G.cols; c++) ctx.fillText(String(c + 1), G.x(c) + G.colW / 2, G.y(0) - 10);
      ctx.textAlign = 'left'; ctx.strokeStyle = col.accent; ctx.fillStyle = col.accent; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      for (const k of Object.keys(L.regions)) {
        const rg = L.regions[k], b = rg.box, hit = L.report.find(r => r.where === k && r.face !== 'marks');
        ctx.globalAlpha = ov * 0.85; ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
        const lab = `${k} c${rg.cols[0] + 1}-${rg.cols[0] + rg.cols[1]} r${rg.rows[0] + 1}-${rg.rows[0] + rg.rows[1]}` + (hit ? ` ${hit.size}u=${hit.css390}px` : '');
        ctx.setLineDash([]); ctx.globalAlpha = ov; ctx.fillText(lab, b.x, b.y + b.h + 11); ctx.setLineDash([4, 3]);
      }
      ctx.restore();
    }
    p.pop();
  }

  ARSENAL.gridtype = { grid, scale, fit, markGrid, layout, contentBox, templates: TEMPLATES, floors: FLOOR, css390 };

  ARSENAL.patterns['grid-type'] = {
    id: 'grid-type', atlas: ['resolution-independence', 'text-width', 'text-weight'], renderer: 'p2d',
    params: PARAMS,
    variants: [
      { name: 'editorial', params: { template: 'editorial', ratio: 1.333, gutter: 16 } },
      { name: 'poster', params: { template: 'poster', ratio: 1.5, gutter: 24 } },
      { name: 'sheet', params: { template: 'sheet', ratio: 1.2, gutter: 12 } },
    ],
    setup, draw,
  };
})();
