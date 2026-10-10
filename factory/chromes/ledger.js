/* ════════════════════════════════════════════════════════════════════
   factory/chromes/ledger.js · "The Ledger"
   An accountant's ledger page: cream stock with a bound gutter, blue-grey
   ruling every 30 units, an oxblood double head rule, a left margin column
   (double oxblood rule) where a running tally is entered row by row, a
   PARTICULARS field of ten ruled rows where the film's count is set, an AUDIT
   column with a stamp slot, and a caption written on the last two rules.
   The count belongs in the ruled rows: layout.rows gives their baselines.
   Contract: every function takes `kit` first and reads nothing global; the only
   global write is the registration line (globalThis.CETI_CHROMES.ledger).
   Pure: no randomness, no clock reads; everything derives from t.
   ════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else (root.CETI_CHROMES = root.CETI_CHROMES || {})[mod.id] = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
'use strict';

const DEFAULTS = {
  palette: { bg: '#F1E8D2', ink: '#2A2420', accent: '#7A1F1F', muted: '#9C8F78', line: '#8FA3A8', panel: '#3B1416', chalk: '#F6EFDF' },
  type: { serif: "'Newsreader', Georgia, serif", mono: "'Red Hat Mono', monospace" },
  eyebrow: 'CASE 00 · LEDGER',
  title: 'Brought forward',
  folio: 'FOLIO 12',
  heads: { tally: 'TALLY', body: 'PARTICULARS', audit: 'AUDIT' },
  slotLabel: 'AUDITED',
};
const FACES = [
  { family: 'Newsreader', weight: 400, style: 'normal', file: 'newsreader-latin-400-normal.woff2' },
  { family: 'Newsreader', weight: 600, style: 'normal', file: 'newsreader-latin-600-normal.woff2' },
  { family: 'Red Hat Mono', weight: 400, style: 'normal', file: 'red-hat-mono-latin-400-normal.woff2' },
  { family: 'Red Hat Mono', weight: 500, style: 'normal', file: 'red-hat-mono-latin-500-normal.woff2' },
];
// rule i sits at y = RULE0 + i * PITCH. Rows 0–9 are PARTICULARS (the count); rules 11–12 carry the caption.
const RULE0 = 150, PITCH = 30, NRULES = 13;
const LAYOUT = {
  safe: { x0: 120, y0: 124, x1: 824, y1: 450 },
  rows: { x0: 120, x1: 824, y0: RULE0, pitch: PITCH, n: 10, baseline: (i) => RULE0 + i * PITCH - 5 },   // set the count ON these rules
  margin: { x0: 24, x1: 104, numX: 96 },          // running tally, right-aligned at numX
  audit: { x0: 840, x1: 936 },
  slot: { x: 888, y: 444, w: 80, h: 50 },
  cap: { x: 120, y: 505, w: 704, size: 28, lh: 30, adv: 0.46 },
};

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sg = (t, a, b) => clamp((t - a) / (b - a));
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

function make(cfg) {
  const P = cfg.palette, F = cfg.type, H = cfg.heads;
  const self = {
    id: 'ledger',
    palette: P,
    fonts: ['Newsreader', 'Red Hat Mono'],
    faces: FACES,
    type: F,
    layout: LAYOUT,
    config: cfg,
    roles: {
      canvas: 'ground(p, seed): cream stock, fibre mottle, foxed edges, the bound gutter shadow on the left.',
      chrome: 'frame(): head, folio, oxblood double rules, blue-grey ruling, column heads, margin tally, AUDIT slot and stamp.',
      field: 'frame(): the faint wash behind the latest tally entry.',
      cap: 'frame(): calls kit.caption(t, style) to write the caption on rules 11–12 in Newsreader (opts.caption === false skips it).',
      card: 'card(): oxblood panel, cream serif question between two double rules, mono sub-line.',
      top: 'brand(): the CETI end card (hold 0.6 s, then oxblood panel, serif wordmark between rules, takeaway).',
      free: 'marks, labels: the film sets its count on layout.rows (baseline(i)), inside layout.safe.',
    },

    /* contentBox(tokens, mode): where this chrome lets a film draw (960 basis). mode 'kit' (a film authored on kit's
       sheet): the PARTICULARS field between the TALLY and AUDIT columns, under the column heads (124) and above the
       caption rules (475): heads, margin tally and AUDIT slot stay whole. mode 'native': layout.safe. tokens unused. */
    contentBox(tokens, mode) { return mode === 'native' ? Object.assign({}, LAYOUT.safe) : { x0: 120, y0: 128, x1: 824, y1: 448, align: 'center' }; },

    ground(p, seed = 1494) {
      const g = p.createGraphics(960, 540); g.pixelDensity(2);
      const gc = g.drawingContext;
      gc.fillStyle = P.bg; gc.fillRect(0, 0, 960, 540);
      p.noiseSeed(seed);
      const lo = p.createGraphics(320, 180); lo.pixelDensity(1); lo.loadPixels();
      for (let y = 0; y < 180; y++) for (let x = 0; x < 320; x++) {
        const n1 = p.noise(x * 0.018, y * 0.018), n2 = p.noise(100 + x * 0.16, 100 + y * 0.16);
        const ex = Math.min(x, 319 - x) / 320, ey = Math.min(y, 179 - y) / 180;
        const edge = Math.exp(-Math.min(ex * 3.2, ey * 2.2) * 9);          // foxing creeps in from the edges
        const a = (0.6 * n1 + 0.4 * n2) * 0.045 + edge * 0.06 * n1;
        const i = 4 * (y * 320 + x);
        lo.pixels[i] = 120; lo.pixels[i + 1] = 84; lo.pixels[i + 2] = 44; lo.pixels[i + 3] = Math.round(a * 255);
      }
      lo.updatePixels();
      gc.imageSmoothingEnabled = true; gc.drawImage(lo.elt, 0, 0, 960, 540);
      const gg = gc.createLinearGradient(0, 0, 30, 0);              // the binding
      gg.addColorStop(0, 'rgba(60,36,20,0.16)'); gg.addColorStop(0.45, 'rgba(60,36,20,0.05)'); gg.addColorStop(1, 'rgba(60,36,20,0)');
      gc.fillStyle = gg; gc.fillRect(0, 0, 30, 540);
      if (lo.remove) lo.remove();
      return g;
    },

    /* frame(kit, t, ch, opts)
       ch    {eyebrow, title}
       opts  tally   [[t0, '120'], ...]  running totals, entry i on rule i; the latest is inked in oxblood
             folio   'FOLIO 12'
             slot    {label, op}        the AUDIT stamp
             caption false | {style overrides for kit.caption}
             ruling  0..1 (draw-on of the ruled lines, default 1) */
    frame(kit, t, ch, opts = {}) {
      ch = ch || {};
      const ink = P.ink, acc = P.accent, ru = opts.ruling != null ? opts.ruling : 1;
      const eb = ch.eyebrow != null ? ch.eyebrow : cfg.eyebrow, ti = ch.title != null ? ch.title : cfg.title;
      if (eb) kit.tx('lg.eb', 'chrome', 40, 38, eb, { fam: F.mono, size: 12, ls: '0.2em', op: 0.75, weight: 500, fill: ink });
      if (ti) kit.tx('lg.ti', 'chrome', 39, 76, ti, { fam: F.serif, size: 32, weight: 600, fill: ink });
      const fo = opts.folio != null ? opts.folio : cfg.folio;
      if (fo) kit.tx('lg.fo', 'chrome', 920, 38, fo, { fam: F.mono, size: 12, ls: '0.2em', op: 0.75, weight: 500, fill: acc, anchor: 'end' });

      // head: oxblood double rule, column heads, single rule
      kit.ln('lg.h1', 'chrome', 24, 92, 936, 92, { stroke: acc, w: 1.4 });
      kit.ln('lg.h2', 'chrome', 24, 96, 936, 96, { stroke: acc, w: 0.7 });
      const M = LAYOUT.margin, A = LAYOUT.audit;
      kit.tx('lg.ct', 'chrome', (M.x0 + M.x1) / 2, 114, H.tally, { fam: F.mono, size: 12, ls: '0.16em', anchor: 'middle', fill: acc, weight: 500 });
      kit.tx('lg.cb', 'chrome', 120, 114, H.body, { fam: F.mono, size: 12, ls: '0.16em', fill: acc, weight: 500 });
      kit.tx('lg.ca', 'chrome', (A.x0 + A.x1) / 2, 114, H.audit, { fam: F.mono, size: 12, ls: '0.16em', anchor: 'middle', fill: acc, weight: 500 });
      kit.ln('lg.h3', 'chrome', 24, 124, 936, 124, { stroke: acc, w: 0.7, op: 0.8 });

      // the ruling (blue-grey), drawn left to right by ru
      for (let i = 0; i < NRULES; i++) {
        const y = RULE0 + i * PITCH, u = clamp(ru * 1.4 - i * 0.03);
        if (u > 0) kit.ln('lg.r' + i, 'chrome', 24, y, 24 + 912 * u, y, { stroke: P.line, w: 0.6, op: 0.9 });
      }
      // verticals: the margin double rule, the audit double rule
      kit.ln('lg.v1', 'chrome', M.x1, 92, M.x1, 524, { stroke: acc, w: 0.9 });
      kit.ln('lg.v2', 'chrome', M.x1 + 4, 92, M.x1 + 4, 524, { stroke: acc, w: 0.9 });
      kit.ln('lg.v3', 'chrome', A.x0 - 4, 92, A.x0 - 4, 524, { stroke: acc, w: 0.9 });
      kit.ln('lg.v4', 'chrome', A.x0, 92, A.x0, 524, { stroke: acc, w: 0.9 });

      // running tally in the margin, entry i on rule i
      const tl = (opts.tally || []).slice(0, LAYOUT.rows.n);
      let last = -1; tl.forEach(([t0], i) => { if (t >= t0) last = i; });
      tl.forEach(([t0, s], i) => {
        const a = sg(t, t0, t0 + 0.3); if (a <= 0) return;
        const y = LAYOUT.rows.baseline(i), cur = i === last;
        if (cur) kit.rc('lg.tw', 'field', M.x0 + 4, y - 19, M.x1 - M.x0 - 8, 26, { fill: acc, fo: 0.08 });
        kit.tx('lg.t' + i, 'chrome', M.numX, y, s, { fam: F.mono, size: 16, anchor: 'end', weight: 500, fill: cur ? acc : ink, op: a * (cur ? 1 : 0.55) });
      });
      // the figure carried forward is ruled under (book-keeper's single rule, the figure's width)
      if (last > 0) { const yb = LAYOUT.rows.baseline(last) + 4, wn = String(tl[last][1]).length * 16 * 0.6;
        kit.ln('lg.tu', 'chrome', M.numX - wn, yb, M.numX, yb, { stroke: acc, w: 1 }); }

      // AUDIT slot: dashed box, label, stamp
      const S = LAYOUT.slot;
      kit.rc('lg.so', 'chrome', S.x - S.w / 2, S.y - S.h / 2, S.w, S.h, { stroke: acc, w: 0.8, dash: '3 3', op: 0.7 });
      const sl = opts.slot;
      if (sl && (sl.op == null || sl.op > 0)) kit.stamp('lg.st', 'chrome', S.x, S.y, 0.5, sl.label || cfg.slotLabel,
        { op: sl.op != null ? sl.op : 1, w: 150, h: 50, fs: 26, rim: acc, face: P.chalk, fam: F.serif, rot: -6 });

      if (opts.caption !== false && kit.caption) {
        const K = LAYOUT.cap;
        kit.caption(t, Object.assign({ x: K.x, y: K.y, w: K.w * 0.55 / K.adv, size: K.size, lh: K.lh, fam: F.serif, fill: ink }, opts.caption || {}));
      }
    },

    /* card(kit, t, c) · c {t0, t1, q: [lines], sub, subAt}: oxblood panel, cream serif between double rules */
    card(kit, t, c) {
      if (!c) return;
      const a = sg(t, c.t0, c.t0 + 0.4), out = 1 - sg(t, c.t1 - 0.35, c.t1);
      kit.rc('lc.bg', 'card', 0, 0, 960, 540, { fill: P.panel, op: a });
      const lines = c.q || [], lh = 56, y0 = 270 - (lines.length - 1) * lh / 2 + 14;
      const top = y0 - 74, bot = y0 + (lines.length - 1) * lh + 40;
      [[top, 1.4], [top + 4, 0.7], [bot, 0.7], [bot + 4, 1.4]].forEach(([y, w], i) => kit.ln('lc.r' + i, 'card', 160, y, 800, y, { stroke: P.chalk, w, op: a * 0.6 }));
      const qa = sg(t, c.t0 + 0.3, c.t0 + 0.8) * out;
      lines.forEach((s, i) => kit.tx('lc.q' + i, 'card', 480, y0 + i * lh, s, { fam: F.serif, size: 46, anchor: 'middle', fill: P.chalk, op: qa, weight: 600 }));
      const sa = c.subAt != null ? c.subAt : 0.8;
      if (c.sub) kit.tx('lc.s', 'card', 480, bot + 40, c.sub, { fam: F.mono, size: 16, anchor: 'middle', fill: P.chalk, op: 0.8 * sg(t, c.t0 + sa, c.t0 + sa + 0.4) * out, ls: '0.16em', weight: 500 });
    },

    /* brand(kit, t, t0, takeaway): hold 0.6 s, then the oxblood card: CETI between two rules, takeaway in serif */
    brand(kit, t, t0, takeaway) {
      const a = sg(t, t0 + 0.6, t0 + 1.1), b = sg(t, t0 + 1.0, t0 + 1.5);
      if (a <= 0) return;
      kit.rc('lb.bg', 'top', 0, 0, 960, 540, { fill: P.panel, op: a });
      kit.ln('lb.r1', 'top', 400, 168, 560, 168, { stroke: P.chalk, w: 0.8, op: a * 0.7 });
      kit.tx('lb.w', 'top', 480, 222, 'CETI', { fam: F.serif, size: 56, anchor: 'middle', fill: P.chalk, op: a, ls: '0.3em', weight: 600 });
      kit.ln('lb.r2', 'top', 400, 244, 560, 244, { stroke: P.chalk, w: 1.4, op: a * 0.7 });
      kit.ln('lb.r3', 'top', 400, 248, 560, 248, { stroke: P.chalk, w: 0.7, op: a * 0.7 });
      wrapBal(takeaway || '', 760, 34, 0.46).slice(0, 2).forEach((s, i) =>
        kit.tx('lb.t' + i, 'top', 480, 310 + i * 44, s, { fam: F.serif, size: 34, anchor: 'middle', fill: P.chalk, op: b }));
    },

    toKit() { return { palette: { paper: P.bg, ink: P.ink, accent: P.accent, muted: P.muted, chalk: P.chalk, dark: P.panel, soft: P.line },
      type: { disp: 'Newsreader', mono: 'Red Hat Mono', sans: 'Newsreader' } }; },
    with(over) { return make(merge(cfg, over)); },
  };
  return self;
}
return make(DEFAULTS);
});
