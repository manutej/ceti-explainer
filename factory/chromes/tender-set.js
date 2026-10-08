/* ════════════════════════════════════════════════════════════════════
   factory/chromes/tender-set.js · "The Tender Set"
   The Opera House drafting sheet, extracted and parameterised: manila diazo
   sheet, trim marks, an eyebrow and a display title, a REVISIONS ledger that
   types itself in, a title block with a stamp slot, a caption band, black
   question cards and the CETI brand card.
   Contract: every function takes `kit` first and reads nothing global. The
   only global write is the registration line at the bottom
   (globalThis.CETI_CHROMES['tender-set']); under CommonJS it exports instead.
   Pure: no randomness, no clock reads; everything derives from t.
   ════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  const mod = factory();
  if (typeof module === 'object' && module.exports) module.exports = mod;
  else (root.CETI_CHROMES = root.CETI_CHROMES || {})[mod.id] = mod;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
'use strict';

const DEFAULTS = {
  palette: { bg: '#E8DCC2', ink: '#1E3A5C', accent: '#C8452E', muted: '#8E887C', line: '#5B6F86', panel: '#0A0D12', chalk: '#F2ECDD' },
  type: { disp: "'Big Shoulders Display', 'BSD', sans-serif", mono: "'IBM Plex Mono', 'Plex Mono', monospace" },
  eyebrow: 'CASE 00 · TENDER SET',
  title: 'Issued for tender',
  ledger: { title: 'REVISIONS', rows: [], cps: 50 },          // rows: [[tTyped, 'REV A · ...'], ...] up to 12
  block: { title: 'PROJECT SAIL', lines: ['SHEET 23 · SCHEDULE', 'ISSUED FOR TENDER'], slotLabel: 'DATE', open: -99 },
  crease: 680,                                                  // the envelope fold between content and ledger column
};
const FACES = [
  { family: 'Big Shoulders Display', weight: 600, style: 'normal', file: 'big-shoulders-display-latin-600-normal.woff2' },
  { family: 'IBM Plex Mono', weight: 400, style: 'normal', file: 'ibm-plex-mono-latin-400-normal.woff2' },
  { family: 'IBM Plex Mono', weight: 500, style: 'normal', file: 'ibm-plex-mono-latin-500-normal.woff2' },
];
// geometry (design units, 960 × 540); matches factory/kit LAYOUT so kit scenes and this chrome agree
const LAYOUT = {
  safe: { x0: 48, y0: 104, x1: 664, y1: 432 },
  ledger: { x: 700, y: 44, w: 230, row: 19 },
  block: { x: 700, y: 336, w: 230, h: 84 },
  slot: { x: 890, y: 384 },
  cap: { x: 48, y: 474, w: 864, size: 28, lh: 34, adv: 0.6 },
};

/* ── local pure helpers (no kit dependency) ── */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sg = (t, a, b) => clamp((t - a) / (b - a));
const typed = (s, t, t0, cps = 40) => String(s).slice(0, Math.max(0, Math.floor((t - t0) * cps)));
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
  const P = cfg.palette, F = cfg.type;
  const self = {
    id: 'tender-set',
    palette: P,
    fonts: ['Big Shoulders Display', 'IBM Plex Mono'],
    faces: FACES,
    type: F,
    layout: LAYOUT,
    config: cfg,
    roles: {
      canvas: 'ground(p, seed) returns a 960 × 540 p5.Graphics (density 2): manila, diazo bloom, roller banding, the crease at cfg.crease.',
      chrome: 'frame(): trim marks, eyebrow, title, REVISIONS ledger, title block, slot stamp.',
      field: 'frame(): the chalk highlight behind a ledger row (opts.ledger.hl), so it sits under the film\'s marks.',
      cap: 'frame(): calls kit.caption(t, style) with this chrome\'s caption geometry and face (opts.caption === false skips it).',
      card: 'card(): black panel, chalk display question, accent sub-line.',
      top: 'brand(): the CETI end card (hold 0.6 s, then panel, wordmark line, takeaway).',
      free: 'marks, labels: left to the film; draw inside layout.safe.',
    },

    /* the paper: deterministic for a given seed. Leaves p.noiseSeed(seed) set; the caller reseeds after. */
    ground(p, seed = 1959) {
      const g = p.createGraphics(960, 540); g.pixelDensity(2);
      const gc = g.drawingContext;
      gc.fillStyle = P.bg; gc.fillRect(0, 0, 960, 540);
      p.noiseSeed(seed);
      const lo = p.createGraphics(240, 135); lo.pixelDensity(1); lo.loadPixels();
      for (let y = 0; y < 135; y++) for (let x = 0; x < 240; x++) {
        const n = p.noise(x * 0.012, y * 0.012);
        const b1 = Math.exp(-(((x - 70) ** 2) / 3000 + ((y - 40) ** 2) / 1400)), b2 = Math.exp(-(((x - 185) ** 2) / 2600 + ((y - 100) ** 2) / 1200));
        const a = (0.55 * (b1 + b2) + 0.45 * n) * 0.05, i = 4 * (y * 240 + x);
        lo.pixels[i] = 120; lo.pixels[i + 1] = 95; lo.pixels[i + 2] = 50; lo.pixels[i + 3] = Math.round(a * 255);
      }
      lo.updatePixels();
      gc.imageSmoothingEnabled = true; gc.drawImage(lo.elt, 0, 0, 960, 540);
      for (let y = 0; y < 540; y += 3) { gc.fillStyle = `rgba(90,70,40,${0.015 * (0.5 + 0.5 * Math.sin(y * 0.21))})`; gc.fillRect(0, y, 960, 1); }
      const cx = cfg.crease, cg = gc.createLinearGradient(cx - 6, 0, cx + 6, 0);
      cg.addColorStop(0, 'rgba(70,50,20,0)'); cg.addColorStop(0.5, 'rgba(70,50,20,0.03)'); cg.addColorStop(0.55, 'rgba(255,250,235,0.05)'); cg.addColorStop(1, 'rgba(70,50,20,0)');
      gc.fillStyle = cg; gc.fillRect(cx - 6, 0, 12, 540);
      if (lo.remove) lo.remove();
      return g;
    },

    /* frame(kit, t, ch, opts)
       ch    {eyebrow, title}                 (falls back to cfg.eyebrow / cfg.title)
       opts  ledger {title, rows: [[t, s]], cps, hl}  | false
             block  {title, lines: [a, b], slotLabel, open} | false
             slot   {label: 'SEALED', op, rim}       the stamp in the title block's slot
             caption false | {style overrides for kit.caption}
             marks  false hides trim marks */
    frame(kit, t, ch, opts = {}) {
      ch = ch || {};
      const ink = P.ink;
      if (opts.marks !== false) [[16, 16, 1, 1], [944, 16, -1, 1], [16, 524, 1, -1], [944, 524, -1, -1]].forEach(([x, y, sx, sy], i) => {
        kit.ln('ts.ma' + i, 'chrome', x, y, x + 12 * sx, y, { op: 0.6, stroke: ink });
        kit.ln('ts.mb' + i, 'chrome', x, y, x, y + 12 * sy, { op: 0.6, stroke: ink });
      });
      const eb = ch.eyebrow != null ? ch.eyebrow : cfg.eyebrow, ti = ch.title != null ? ch.title : cfg.title;
      if (eb) kit.tx('ts.eb', 'chrome', 48, 44, eb, { fam: F.mono, size: 12, ls: '0.2em', op: 0.75, weight: 500, fill: ink });
      if (ti) kit.tx('ts.ti', 'chrome', 47, 82, ti, { fam: F.disp, size: 32, ls: '0.02em', weight: 600, fill: ink });

      // REVISIONS ledger: rows type themselves in at their own times
      const lg = opts.ledger === false ? null : merge(cfg.ledger, opts.ledger), LG = LAYOUT.ledger;
      if (lg) {
        kit.tx('ts.lh', 'chrome', LG.x, LG.y, lg.title, { fam: F.mono, size: 12, ls: '0.2em', op: 0.8, weight: 500, fill: ink });
        kit.ln('ts.lhl', 'chrome', LG.x, LG.y + 7, LG.x + LG.w, LG.y + 7, { w: 0.9, stroke: ink });
        (lg.rows || []).slice(0, 12).forEach(([tr, s], i) => {
          const y = LG.y + 27 + i * LG.row;
          kit.ln('ts.ll' + i, 'chrome', LG.x, y + 6, LG.x + LG.w, y + 6, { op: 0.3, stroke: ink });
          const txt = typed(s, t, tr, lg.cps || 50);
          if (!txt) return;
          const hl = lg.hl === i;
          if (hl) kit.rc('ts.lb' + i, 'field', LG.x - 3, y - 12, LG.w + 6, 17, { fill: P.chalk });
          kit.tx('ts.lt' + i, 'chrome', LG.x, y, txt, { fam: F.mono, size: 12, ls: '0.02em', weight: hl ? 500 : 400, fill: hl ? P.accent : ink });
        });
      }

      // title block 230 × 84, slot on the right
      const bk = opts.block === false ? null : merge(cfg.block, opts.block), B = LAYOUT.block;
      if (bk) {
        const open = bk.open != null ? bk.open : -99;
        kit.rc('ts.bo', 'chrome', B.x, B.y, B.w, B.h, { stroke: ink, w: 1.2 });
        kit.ln('ts.bv', 'chrome', B.x + 150, B.y, B.x + 150, B.y + B.h, { w: 0.75, stroke: ink });
        kit.ln('ts.bh', 'chrome', B.x, B.y + 32, B.x + 150, B.y + 32, { w: 0.75, stroke: ink });
        kit.tx('ts.bt', 'chrome', B.x + 8, B.y + 24, typed(String(bk.title).slice(0, 14), t, open), { fam: F.disp, size: 20, ls: '0.06em', weight: 600, fill: ink });
        // two 12-unit lines in the 150-unit cell: at most 19 characters each, cut rather than run into the slot
        (bk.lines || []).slice(0, 2).forEach((s, i) => kit.tx('ts.bl' + i, 'chrome', B.x + 8, B.y + 52 + i * 18, typed(String(s).slice(0, 19), t, open + 0.5 * (i + 1)), { fam: F.mono, size: 12, fill: ink }));
        kit.tx('ts.bs', 'chrome', B.x + 190, B.y + 14, bk.slotLabel, { fam: F.mono, size: 12, anchor: 'middle', op: 0.7, ls: '0.2em', fill: ink });
      }
      const sl = opts.slot;
      if (sl && bk && (sl.op == null || sl.op > 0)) kit.stamp('ts.st', 'chrome', LAYOUT.slot.x, LAYOUT.slot.y, 0.5, sl.label || 'SEALED',
        { op: sl.op != null ? sl.op : 1, w: 130, h: 50, fs: 28, rim: sl.rim || ink, face: P.chalk, fam: F.disp });

      if (opts.caption !== false && kit.caption) {
        const K = LAYOUT.cap;
        kit.caption(t, Object.assign({ x: K.x, y: K.y, w: K.w * 0.55 / K.adv, size: K.size, lh: K.lh, fam: F.mono, fill: ink }, opts.caption || {}));
      }
    },

    /* card(kit, t, c) · c {t0, t1, q: [lines], sub, subAt, stamp}: the black question card */
    card(kit, t, c) {
      if (!c) return;
      const a = sg(t, c.t0, c.t0 + 0.4), out = 1 - sg(t, c.t1 - 0.35, c.t1);
      kit.rc('tc.bg', 'card', 0, 0, 960, 540, { fill: P.panel, op: a });
      kit.ln('tc.m1', 'card', 22, 22, 38, 22, { op: a, stroke: P.chalk }); kit.ln('tc.m2', 'card', 22, 22, 22, 38, { op: a, stroke: P.chalk });
      kit.ln('tc.m3', 'card', 938, 518, 922, 518, { op: a, stroke: P.chalk }); kit.ln('tc.m4', 'card', 938, 518, 938, 502, { op: a, stroke: P.chalk });
      const qa = sg(t, c.t0 + 0.3, c.t0 + 0.8) * out;
      const lines = c.q || [], lh = 54, y0 = 270 - (lines.length - 1) * lh / 2 + 14;
      lines.forEach((s, i) => kit.tx('tc.q' + i, 'card', 480, y0 + i * lh, s, { fam: F.disp, size: 46, anchor: 'middle', fill: P.chalk, op: qa, ls: '0.02em', weight: 600 }));
      const sa = c.subAt != null ? c.subAt : 0.8;
      if (c.sub) kit.tx('tc.s', 'card', 480, y0 + (lines.length - 1) * lh + 46, c.sub, { fam: F.mono, size: 14, anchor: 'middle', fill: P.accent, op: 0.9 * sg(t, c.t0 + sa, c.t0 + sa + 0.4) * out, ls: '0.18em', weight: 500 });
      if (c.stamp) kit.stamp('tc.st', 'card', 840, 456, 0.6, c.stamp, { op: sg(t, c.t0 + 1.2, c.t0 + 1.6) * out, w: 130, h: 50, fs: 28, rim: P.ink, face: P.chalk, fam: F.disp });
    },

    /* brand(kit, t, t0, takeaway): 3 s. [t0, t0+0.6] the material's last frame holds (nothing drawn);
       then the plain card: CETI wordmark on its line, the one-line takeaway (34 units, ≤ 2 lines). */
    brand(kit, t, t0, takeaway) {
      const a = sg(t, t0 + 0.6, t0 + 1.1), b = sg(t, t0 + 1.0, t0 + 1.5);
      if (a <= 0) return;
      kit.rc('tb.bg', 'top', 0, 0, 960, 540, { fill: P.panel, op: a });
      kit.tx('tb.w', 'top', 480, 214, 'CETI', { fam: F.disp, size: 60, anchor: 'middle', fill: P.chalk, op: a, ls: '0.32em', weight: 600 });
      kit.ln('tb.r', 'top', 444, 240, 516, 240, { stroke: P.accent, w: 2, op: a });
      wrapBal(takeaway || '', 760, 34, 0.46).slice(0, 2).forEach((s, i) =>
        kit.tx('tb.t' + i, 'top', 480, 304 + i * 42, s, { fam: F.disp, size: 34, anchor: 'middle', fill: P.chalk, op: b, ls: '0.02em', weight: 600 }));
    },

    /* film.json fragment so the kit's own helpers (commitBox, dim chips, pencil) use this chrome's colours and faces */
    toKit() { return { palette: { paper: P.bg, ink: P.ink, accent: P.accent, muted: P.muted, chalk: P.chalk, dark: P.panel, soft: '#B9A277' },
      type: { disp: 'Big Shoulders Display', mono: 'IBM Plex Mono', sans: 'IBM Plex Mono' } }; },

    /* a re-parameterised copy: with({palette: {accent: '#...'}, block: {title: 'PROJECT X'}, ledger: {title: 'ISSUES'}}) */
    with(over) { return make(merge(cfg, over)); },
  };
  return self;
}
return make(DEFAULTS);
});
