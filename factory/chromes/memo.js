/* ════════════════════════════════════════════════════════════════════
   factory/chromes/memo.js · "The Memo"
   A one-page internal memorandum on bone-white bond, folded in thirds: a
   letterhead block (TO / FROM / DATE / FILE in mono, RE: as the title), a wide
   text column where the film draws, a red-pencil margin on the right that
   carries the headline number, and a caption set as the memo's last line.
   No paperclip, no logo, no icons: type, rules and one pencil line.
   Contract: every function takes `kit` first and reads nothing global; the only
   global write is the registration line (globalThis.CETI_CHROMES.memo).
   Pure: no randomness, no clock reads; the pencil wobble is a hash of the seed.
   ════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else (root.CETI_CHROMES = root.CETI_CHROMES || {})[mod.id] = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
'use strict';

const DEFAULTS = {
  palette: { bg: '#F4F1EA', ink: '#2F3A44', accent: '#B8322A', muted: '#7D8790', line: '#C9C4B8', panel: '#2F3A44', chalk: '#FBFAF6' },
  type: { mono: "'Space Mono', monospace", sans: "'DM Sans', sans-serif" },
  eyebrow: 'CASE 00 · PAGE 1 OF 1',
  title: 'The one number',
  head: 'MEMORANDUM',
  fields: { to: 'ALL BUDGET HOLDERS', from: 'CETI CASE DESK', date: '08 OCT 2026', file: 'CASE 00' },
  folds: [180, 360],
};
const FACES = [
  { family: 'Space Mono', weight: 400, style: 'normal', file: 'space-mono-latin-400-normal.woff2' },
  { family: 'Space Mono', weight: 700, style: 'normal', file: 'space-mono-latin-700-normal.woff2' },
  { family: 'DM Sans', weight: 400, style: 'normal', file: 'dm-sans-latin-400-normal.woff2' },
  { family: 'DM Sans', weight: 500, style: 'normal', file: 'dm-sans-latin-500-normal.woff2' },
  { family: 'DM Sans', weight: 600, style: 'normal', file: 'dm-sans-latin-600-normal.woff2' },
];
const LAYOUT = {
  safe: { x0: 48, y0: 176, x1: 680, y1: 436 },          // the text column: the film draws here
  margin: { x: 708, x0: 724, x1: 924, y0: 170, y1: 436 },   // red-pencil margin: pencil rule at x, headline from x0
  cap: { x: 48, y: 506, w: 864, size: 28, lh: 32, adv: 0.48 },   // the memo's last line runs the full measure
};

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sg = (t, a, b) => clamp((t - a) / (b - a));
const f2 = (v) => (+v).toFixed(2);
function wrapN(s, maxW, size, adv) {
  const per = Math.max(4, Math.floor(maxW / (size * adv))), out = []; let cur = '';
  for (const w of String(s).split(/\s+/)) { if (!w) continue; const nx = cur ? cur + ' ' + w : w; if (nx.length > per && cur) { out.push(cur); cur = w; } else cur = nx; }
  if (cur) out.push(cur); return out;
}
function wrapBal(s, maxW, size, adv) {   // as wrapN, but lines balanced (no orphan last word)
  const g = wrapN(s, maxW, size, adv); if (g.length < 2) return g;
  for (let w = Math.ceil(String(s).length / g.length) * size * adv; w < maxW; w += size * adv) { const r = wrapN(s, w, size, adv); if (r.length <= g.length) return r; }
  return g;
}
function merge(a, b) {
  const o = Object.assign({}, a);
  for (const k in (b || {})) o[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') ? merge(a[k], b[k]) : b[k];
  return o;
}
// integer hash → [0, 1); smooth 1-D value noise. Pure and identical on every run.
function hash(n) { n = (n | 0) ^ 0x9E3779B9; n = Math.imul(n ^ (n >>> 16), 0x85EBCA6B); n = Math.imul(n ^ (n >>> 13), 0xC2B2AE35); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, seed) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i * 131 + seed * 7919) * (1 - u) + hash((i + 1) * 131 + seed * 7919) * u; }
// a straightedge pencil stroke as an SVG path: 3-unit overshoot, ±0.6 wobble, drawn to fraction u
function pencilD(x1, y1, x2, y2, u, seed, over = 3) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const ax = x1 - ux * over, ay = y1 - uy * over, L2 = len + 2 * over;
  const n = Math.max(6, Math.round(L2 / 6)), m = Math.max(1, Math.round(n * clamp(u)));
  let d = '';
  for (let i = 0; i <= m; i++) {
    const s = i / n, w = (vnoise(i * 0.35, seed) - 0.5) * 1.2;
    d += (i ? ' L ' : 'M ') + f2(ax + ux * L2 * s - uy * w) + ' ' + f2(ay + uy * L2 * s + ux * w);
  }
  return d;
}

function make(cfg) {
  const P = cfg.palette, F = cfg.type, FD = cfg.fields;
  const pencil = (kit, key, x1, y1, x2, y2, u, seed, o = {}) => {
    if (u <= 0) return;
    kit.E(key, 'path', o.layer || 'chrome', { d: pencilD(x1, y1, x2, y2, u, seed, o.over != null ? o.over : 3), fill: 'none', stroke: P.accent,
      'stroke-width': o.w || 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: o.op != null ? +clamp(o.op).toFixed(3) : 0.85 });
  };
  const self = {
    id: 'memo',
    palette: P,
    fonts: ['Space Mono', 'DM Sans'],
    faces: FACES,
    type: F,
    layout: LAYOUT,
    config: cfg,
    roles: {
      canvas: 'ground(p, seed): bone bond, fine grain, two tri-fold creases at cfg.folds.',
      chrome: 'frame(): MEMORANDUM head, eyebrow, TO/FROM/DATE/FILE, RE: title, double rule, the red-pencil margin rule and headline, the caption rule.',
      cap: 'frame(): calls kit.caption(t, style) in DM Sans as the memo\u2019s last line, full measure under the rule at y 450 (opts.caption === false skips it).',
      card: 'card(): slate panel, left-set bone question under an RE: tag, mono sub-line after an accent bar.',
      top: 'brand(): the CETI end card (hold 0.6 s, then slate panel, mono wordmark on its accent line, takeaway left-set).',
      free: 'field, marks, labels: left to the film; draw inside layout.safe. The headline number is chrome-owned (opts.headline).',
    },

    ground(p, seed = 1010) {
      const g = p.createGraphics(960, 540); g.pixelDensity(2);
      const gc = g.drawingContext;
      gc.fillStyle = P.bg; gc.fillRect(0, 0, 960, 540);
      p.noiseSeed(seed);
      const lo = p.createGraphics(480, 270); lo.pixelDensity(1); lo.loadPixels();
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) {
        const n1 = p.noise(x * 0.01, y * 0.01), n2 = p.noise(500 + x * 0.45, 500 + y * 0.45);
        const a = n1 * 0.022 + n2 * 0.02, i = 4 * (y * 480 + x);
        lo.pixels[i] = 70; lo.pixels[i + 1] = 72; lo.pixels[i + 2] = 70; lo.pixels[i + 3] = Math.round(a * 255);
      }
      lo.updatePixels();
      gc.imageSmoothingEnabled = true; gc.drawImage(lo.elt, 0, 0, 960, 540);
      (cfg.folds || []).forEach((fy) => {                         // tri-fold: a shade above, a highlight on the ridge
        const cg = gc.createLinearGradient(0, fy - 8, 0, fy + 8);
        cg.addColorStop(0, 'rgba(40,44,50,0)'); cg.addColorStop(0.45, 'rgba(40,44,50,0.03)'); cg.addColorStop(0.52, 'rgba(255,255,255,0.08)'); cg.addColorStop(1, 'rgba(40,44,50,0)');
        gc.fillStyle = cg; gc.fillRect(0, fy - 8, 960, 16);
      });
      if (lo.remove) lo.remove();
      return g;
    },

    /* frame(kit, t, ch, opts)
       ch    {eyebrow, title}               title is the RE: line
       opts  fields   {to, from, date, file}
             margin   {t0}                  pencil rule draws on over 0.8 s from t0 (default: drawn)
             headline {value: '3 IN 10', lines: ['300 OF 1,000', 'ON TIME'], t0, size}  the red-pencil number
             caption  false | {style overrides for kit.caption} */
    frame(kit, t, ch, opts = {}) {
      ch = ch || {};
      const ink = P.ink, mu = P.muted, fd = merge(FD, opts.fields);
      const eb = ch.eyebrow != null ? ch.eyebrow : cfg.eyebrow, ti = ch.title != null ? ch.title : cfg.title;
      kit.tx('mm.hd', 'chrome', 48, 40, cfg.head, { fam: F.mono, size: 14, ls: '0.32em', weight: 700, fill: ink });
      if (eb) kit.tx('mm.eb', 'chrome', 912, 40, eb, { fam: F.mono, size: 12, ls: '0.14em', anchor: 'end', fill: mu });
      kit.ln('mm.r0', 'chrome', 48, 52, 912, 52, { stroke: ink, w: 0.75 });
      [['TO:', fd.to, 48, 78], ['FROM:', fd.from, 48, 100], ['DATE:', fd.date, 560, 78], ['FILE:', fd.file, 560, 100]].forEach(([k, v, x, y], i) => {
        kit.tx('mm.fk' + i, 'chrome', x, y, k, { fam: F.mono, size: 12, ls: '0.08em', fill: mu });
        if (v) kit.tx('mm.fv' + i, 'chrome', x + 66, y, v, { fam: F.mono, size: 14, fill: ink });
      });
      kit.tx('mm.rk', 'chrome', 48, 134, 'RE:', { fam: F.mono, size: 12, ls: '0.08em', fill: mu });
      if (ti) kit.tx('mm.re', 'chrome', 113, 135, ti, { fam: F.sans, size: 28, weight: 600, fill: ink });
      kit.ln('mm.r1', 'chrome', 48, 150, 912, 150, { stroke: ink, w: 1.6 });
      kit.ln('mm.r2', 'chrome', 48, 154, 912, 154, { stroke: ink, w: 0.6 });

      // the red-pencil margin
      const M = LAYOUT.margin, mt = opts.margin && opts.margin.t0 != null ? opts.margin.t0 : -99;
      pencil(kit, 'mm.mp', M.x, M.y0, M.x, M.y1, sg(t, mt, mt + 0.8), 11, { w: 1.4, op: 0.7 });
      const hd = opts.headline;
      if (hd && hd.value != null) {
        const h0 = hd.t0 != null ? hd.t0 : -99, a = sg(t, h0, h0 + 0.35), sz = hd.size || 44;
        const vw = Math.min(M.x1 - M.x0, String(hd.value).length * sz * 0.6);
        kit.tx('mm.hv', 'chrome', M.x0, 236, hd.value, { fam: F.mono, size: sz, weight: 700, fill: P.accent, op: a });
        pencil(kit, 'mm.hu1', M.x0, 250, M.x0 + vw, 250, sg(t, h0 + 0.3, h0 + 0.8), 21, { op: 0.85 * a });
        pencil(kit, 'mm.hu2', M.x0 + 6, 255, M.x0 + vw - 8, 255, sg(t, h0 + 0.6, h0 + 1.0), 37, { op: 0.75 * a, w: 1.3 });
        (hd.lines || []).slice(0, 4).forEach((s, i) =>
          kit.tx('mm.hl' + i, 'chrome', M.x0, 282 + i * 22, s, { fam: F.mono, size: 15, fill: P.accent, op: a * sg(t, h0 + 0.5, h0 + 0.9) }));
      }

      kit.ln('mm.cr', 'chrome', 48, 450, 912, 450, { stroke: P.line, w: 0.75 });
      if (opts.caption !== false && kit.caption) {
        const K = LAYOUT.cap;
        kit.caption(t, Object.assign({ x: K.x, y: K.y, w: K.w * 0.55 / K.adv, size: K.size, lh: K.lh, fam: F.sans, fill: ink }, opts.caption || {}));
      }
    },

    /* card(kit, t, c) · c {t0, t1, q: [lines], sub, subAt}: slate panel, left-set bone question */
    card(kit, t, c) {
      if (!c) return;
      const a = sg(t, c.t0, c.t0 + 0.4), out = 1 - sg(t, c.t1 - 0.35, c.t1);
      kit.rc('mc.bg', 'card', 0, 0, 960, 540, { fill: P.panel, op: a });
      const lines = c.q || [], lh = 54, y0 = 270 - (lines.length - 1) * lh / 2 + 14;
      const qa = sg(t, c.t0 + 0.3, c.t0 + 0.8) * out;
      kit.tx('mc.re', 'card', 96, y0 - 62, 'RE:', { fam: F.mono, size: 14, ls: '0.12em', fill: P.chalk, op: qa * 0.6 });
      lines.forEach((s, i) => kit.tx('mc.q' + i, 'card', 96, y0 + i * lh, s, { fam: F.sans, size: 44, fill: P.chalk, op: qa, weight: 600 }));
      const sa = c.subAt != null ? c.subAt : 0.8, sy = y0 + (lines.length - 1) * lh + 50, so = sg(t, c.t0 + sa, c.t0 + sa + 0.4) * out;
      if (c.sub) {
        kit.rc('mc.sb', 'card', 96, sy - 7, 24, 2, { fill: P.accent, op: so });
        kit.tx('mc.s', 'card', 132, sy, c.sub, { fam: F.mono, size: 16, fill: P.chalk, op: 0.8 * so, ls: '0.1em' });
      }
    },

    /* brand(kit, t, t0, takeaway): hold 0.6 s, then the slate card: CETI on its accent line, takeaway left-set */
    brand(kit, t, t0, takeaway) {
      const a = sg(t, t0 + 0.6, t0 + 1.1), b = sg(t, t0 + 1.0, t0 + 1.5);
      if (a <= 0) return;
      kit.rc('mb.bg', 'top', 0, 0, 960, 540, { fill: P.panel, op: a });
      kit.tx('mb.w', 'top', 96, 214, 'CETI', { fam: F.mono, size: 48, fill: P.chalk, op: a, ls: '0.4em', weight: 700 });
      kit.ln('mb.r', 'top', 96, 240, 184, 240, { stroke: P.accent, w: 2.4, op: a });
      wrapBal(takeaway || '', 768, 34, 0.52).slice(0, 2).forEach((s, i) =>
        kit.tx('mb.t' + i, 'top', 96, 304 + i * 44, s, { fam: F.sans, size: 34, fill: P.chalk, op: b, weight: 500 }));
    },

    toKit() { return { palette: { paper: P.bg, ink: P.ink, accent: P.accent, muted: P.muted, chalk: P.chalk, dark: P.panel, soft: P.line },
      type: { disp: 'DM Sans', mono: 'Space Mono', sans: 'DM Sans' } }; },
    with(over) { return make(merge(cfg, over)); },
  };
  return self;
}
return make(DEFAULTS);
});
