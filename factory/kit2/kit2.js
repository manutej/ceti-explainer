/* ════════════════════════════════════════════════════════════════════
   factory/kit2/kit2.js · the 75-second case kit with three injection points.
   Same drawing API as factory/kit/kit.js (a film.js written for kit runs unchanged), plus:
     BRAND    window.KIT2.brand    a token pack (arsenal/brands/<id>.json). Every colour and face the kit
                                   draws comes from a ROLE resolved from the pack (resolveRoles below).
     CHROME   window.KIT2.chrome   an id in globalThis.CETI_CHROMES (factory/chromes interface: frame, card,
                                   brand, ground, with). 'none' is valid: no furniture.
     MATERIAL window.KIT2.material an id in ARSENAL.materials (arsenal/materials/drawn interface:
                                   mark(p, kind, x, y, w, h, state, tokens), texture(p, box, tokens)).
   One clock: every frame is KIT.render(t, state) → FILM_RENDER.render(t, state, KIT).
   No Math.random / Date / performance in here.
   ════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';
const FILM = window.FILM || {};
const CONF = window.KIT2 || {};
const FILM_MODE = /[?&]film=1/.test(location.search);
const W = 960, H = 540;
const DUR = FILM.dur || 75;
const SEED = FILM.seed != null ? FILM.seed : 23;

/* ══════════ colour: parse, composite, contrast (WCAG 2.x) ══════════ */
function parseCol(s) {
  s = String(s).trim();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (m) { let h = m[1]; if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h.slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255, h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1]; }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) { const p = m[1].split(',').map(x => parseFloat(x)); return [p[0], p[1], p[2], p[3] != null ? p[3] : 1]; }
  return [0, 0, 0, 1];
}
const hx2 = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0').toUpperCase();
const toHex = (c) => '#' + hx2(c[0]) + hx2(c[1]) + hx2(c[2]);
function solid(s, over) {   // a role as opaque hex: alpha composited over `over` (the ground)
  const c = parseCol(s); if (c[3] >= 1 || !over) return toHex(c);
  const b = parseCol(over), a = c[3];
  return toHex([c[0] * a + b[0] * (1 - a), c[1] * a + b[1] * (1 - a), c[2] * a + b[2] * (1 - a)]);
}
function lum(s) { const c = parseCol(s).slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const best = (on, cands) => cands.reduce((m, c) => contrast(c, on) > contrast(m, on) ? c : m, cands[0]);
const firstGood = (on, cands, min = 7) => cands.find(c => contrast(c, on) >= min) || best(on, cands);   // first that reads well, in order of preference

/* ══════════ BRAND → ROLES ══════════
   Pack roles (arsenal/brands/schema.json): bg ink accent accent2 muted line panel chalk, where panel is the raised
   surface and chalk the strongest text ON panel. Kit role keys (what film.js sees as K.C):
     paper  = color.bg                 the ground
     ink    = color.ink                marks and type on the ground
     accent = color.accent             the one emphasis;  soft = color.accent2
     muted  = color.muted;  line = color.line (composited over bg);  panel = color.panel
     chalk  = color.panel              the SURFACE ink reads on (stamp face, commit-box wash, ledger highlight)
     dark   = color.card if given; on a light ground the darker of panel/ink; on a dark ground the darker of
              panel/bg (the question-card and brand-card ground)
     onDark = the first of bg/panel/chalk/ink/white at >= 7:1 on dark, else the best (card and brand-card type). */
const PACK_DEFAULT = { id: 'tender-set', color: { bg: '#E8DCC2', ink: '#1E3A5C', accent: '#C8452E', accent2: '#B9A277', muted: '#8E887C', line: 'rgba(30,58,92,0.25)', panel: '#F5EEDF', chalk: '#F2ECDD' },
  type: { disp: { family: 'Big Shoulders Display', weight: 600 }, mono: { family: 'IBM Plex Mono', weight: 400 }, body: { family: 'IBM Plex Mono', weight: 400 } }, texture: 'paper' };
const PACK = CONF.brand || PACK_DEFAULT;
function resolveRoles(pk) {
  const c = pk.color || {}, bg = solid(c.bg || '#FFFFFF');
  const ink = solid(c.ink || '#111111', bg), panel = solid(c.panel || bg, bg);
  const darkGround = lum(bg) < 0.18;
  const dark = c.card ? solid(c.card, bg) : darkGround ? (lum(panel) <= lum(bg) ? panel : bg) : (lum(panel) < lum(ink) ? panel : ink);
  const chalk = solid(c.chalk || ink, bg);
  return {
    paper: bg, ink, accent: solid(c.accent || ink, bg), muted: solid(c.muted || ink, bg), soft: solid(c.accent2 || c.muted || ink, bg),
    line: solid(c.line || ink, bg), panel, dark,
    onDark: firstGood(dark, [bg, panel, chalk, ink, '#FFFFFF']),
    chalk: panel,
  };
}
const C = resolveRoles(PACK);
function hexRgb(h) { const c = parseCol(h); return [c[0], c[1], c[2]]; }
const rgba = (k, a) => { const c = hexRgb(C[k] || k); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };

/* type roles: disp, mono, body (kit's 'sans' = body). Default weights come from the pack. */
const TP = PACK.type || PACK_DEFAULT.type;
const TYPE = { disp: TP.disp.family, mono: TP.mono.family, sans: (TP.body || TP.mono).family };
const TW = { disp: TP.disp.weight || 600, mono: TP.mono.weight || 400, sans: (TP.body || TP.mono).weight || 400 };
const FONT = { mono: `'${TYPE.mono}', monospace`, disp: `'${TYPE.disp}', sans-serif`, sans: `'${TYPE.sans}', sans-serif` };
// average advance per em, by family (for wrapping and chip widths; deterministic, no DOM measuring)
const ADV_FAM = { 'Big Shoulders Display': 0.46, 'Sofia Sans Extra Condensed': 0.4, 'Jost': 0.55, 'DM Sans': 0.52, 'Newsreader': 0.48,
  'IBM Plex Mono': 0.6, 'Space Mono': 0.61, 'Red Hat Mono': 0.6, 'DM Mono': 0.6, 'IBM Plex Sans Condensed': 0.46, 'Barlow': 0.5 };
const ADV = { mono: ADV_FAM[TYPE.mono] || 0.6, disp: ADV_FAM[TYPE.disp] || 0.5, sans: ADV_FAM[TYPE.sans] || 0.55 };
/* metric compensation: film.js positions were set against the display face it was authored with (FILM.type.disp,
   default Big Shoulders Display). When the pack's display face is wider, display text is set smaller by the
   advance ratio, never under the legibility floors (28 for text authored at >= 28, 14 for >= 14, else 12).
   CONF.metrics === false turns it off. */
// measured mean advance per em of the vendored display faces (Chromium canvas measureText on a 100-char sample of
// film text at the display weight, 2026-10-08); used only for this ratio, so it is a constant, not a DOM read.
const MEAS = { 'Big Shoulders Display': 0.332, 'Jost': 0.512, 'Sofia Sans Extra Condensed': 0.314, 'DM Sans': 0.51, 'Newsreader': 0.509,
  'IBM Plex Mono': 0.6, 'Space Mono': 0.612, 'Red Hat Mono': 0.6 };
const REF_ADV = MEAS[(FILM.type && FILM.type.disp) || 'Big Shoulders Display'] || 0.332;
const DISP_K = CONF.metrics === false ? 1 : Math.min(1, REF_ADV / (MEAS[TYPE.disp] || ADV.disp));
const DISP_CSS = `'${TYPE.disp}'`;
function fitSize(fam, size) {
  if (DISP_K >= 1 || !(fam === 'disp' || String(fam).indexOf(DISP_CSS) === 0)) return size;
  const floor = size >= 28 ? 28 : size >= 14 ? 14 : 12;
  return Math.max(Math.min(size, floor), +(size * DISP_K).toFixed(2));
}

/* ── maths ── */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const eout = (u) => 1 - Math.pow(1 - u, 3);
const lerp = (a, b, u) => a + (b - a) * u;
const typed = (s, t, t0, cps = 40) => String(s).slice(0, Math.max(0, Math.floor((t - t0) * cps)));
const fmtK = (k) => Number(k).toLocaleString('en-US');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, seed) { const r = mulberry32(seed), a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function PhiInv(p) {   // Acklam's inverse normal CDF
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425; let q, r;
  if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  q = p - 0.5; r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
function wrap(s, maxW, size, fam = 'mono') {
  const per = Math.max(4, Math.floor(maxW / (size * (ADV[fam] || ADV_FAM[fam] || 0.55))));
  const out = []; let cur = '';
  for (const w of String(s).split(/\s+/)) { if (!w) continue; const nx = cur ? cur + ' ' + w : w; if (nx.length > per && cur) { out.push(cur); cur = w; } else cur = nx; }
  if (cur) out.push(cur);
  return out;
}

/* ── state ── */
const state = { answer: FILM_MODE && FILM.commit ? FILM.commit.default : null };
const answerStr = (s) => { const a = (s || state).answer; return a == null ? '__' : a === 'none' ? '—' : String(a); };
const answered = (s) => typeof (s || state).answer === 'number';

/* ══════════ retained SVG pool (unchanged from kit) ══════════ */
const NS = 'http://www.w3.org/2000/svg';
const LAYERS = ['field', 'marks', 'labels', 'chrome', 'cap', 'card', 'top'];
let svg = null, FR = 0;
const L = {}, POOL = new Map(), SEQ = {};
LAYERS.forEach(k => (SEQ[k] = []));
function E(key, tag, layer, attrs, text) {
  if (!L[layer]) throw new Error('KIT.E: unknown layer ' + layer + ' (use ' + LAYERS.join(', ') + ')');
  let el = POOL.get(key);
  if (!el || el._tag !== tag) { el = document.createElementNS(NS, tag); el._tag = tag; el._a = {}; el._sig = ''; el._t = undefined; POOL.set(key, el); }
  if (el._f !== FR) { el._f = FR; el._layer = layer; SEQ[layer].push(el); }
  let sig = '';
  for (const k in attrs) if (attrs[k] != null) sig += k + '|';
  if (sig !== el._sig) {
    while (el.attributes.length) el.removeAttribute(el.attributes[0].name);
    el._a = {}; el._sig = sig;
    for (const k in attrs) { const v = attrs[k]; if (v != null) { el._a[k] = v; el.setAttribute(k, v); } }
  } else {
    for (const k in attrs) { const v = attrs[k]; if (v != null && el._a[k] !== v) { el._a[k] = v; el.setAttribute(k, v); } }
  }
  if (text !== undefined && el._t !== text) { el._t = text; el.textContent = text; }
  return el;
}
function endFrame() {
  for (const el of POOL.values()) {
    if (el._f !== FR && el._vis) {
      el._vis = false;
      while (el.attributes.length) el.removeAttribute(el.attributes[0].name);
      el._a = {}; el._sig = ''; el._t = undefined; el.textContent = '';
    } else if (el._f === FR) el._vis = true;
  }
  for (const k of LAYERS) {
    const g = L[k], want = SEQ[k], ch = g.childNodes;
    let ok = ch.length === want.length;
    for (let i = 0; ok && i < want.length; i++) if (ch[i] !== want[i]) ok = false;
    if (!ok) g.replaceChildren(...want);
    SEQ[k] = [];
  }
}
const f2 = (v) => (+v).toFixed(2);
const opv = (o) => o.op != null ? +clamp(o.op).toFixed(3) : 1;
const famOf = (fam) => FONT[fam] || fam;
const wOf = (fam) => TW[fam] || (fam === 'disp' ? 600 : 400);
/* tx: o.role ('must-read' | 'secondary' | 'chrome') sets data-role (SHIP defect 1). Film text without a role
   stays untagged, so the gate still classes it by layer and size exactly as before. */
/* off-role text colour guard: a text fill that is not one of the brand's roles (a film-data colour such as
   survivorship's film.json "you") is mixed toward ink until it reads at 4.5:1 on the ground. Role colours pass. */
const ROLE_SET = new Set(Object.values(C)), GUARD = {};
function guardFill(f) {
  if (!f || ROLE_SET.has(f) || CONF.guard === false) return f;
  if (GUARD[f]) return GUARD[f];
  const a = parseCol(f), b = parseCol(C.ink); let out = f;
  for (let k = 0; k <= 10 && contrast(out, C.paper) < 4.5; k++) out = toHex([0, 1, 2].map(i => a[i] + (b[i] - a[i]) * k / 10));
  return (GUARD[f] = out);
}
function filmSize(layer, fam, size) {   // display-face compensation, then the content-box counter-scale (floors kept)
  const fs = fitSize(fam, size);
  if (!MAPPED || MAP.s >= 1 || !FILM_LAYERS.has(layer)) return fs;
  const floor = size >= 28 ? 28 : size >= 14 ? 14 : 12;
  return +(Math.max(Math.min(size, floor), fs * MAP.s) / MAP.s).toFixed(2);
}
function tx(key, layer, x, y, s, o = {}) {
  const fam = o.fam || 'mono';
  const tr = o.rot ? `rotate(${o.rot} ${(+x).toFixed(1)} ${(+y).toFixed(1)})` : (o.tr || null);
  return E(key, 'text', layer, { x: f2(x), y: f2(y), 'font-family': famOf(fam), 'font-size': filmSize(layer, fam, o.size || 14), fill: guardFill(o.fill) || C.ink,
    'text-anchor': o.anchor || 'start', 'letter-spacing': o.ls != null ? o.ls : 0, opacity: opv(o),
    'font-weight': o.weight || wOf(fam), transform: tr, 'data-role': o.role || null, 'data-kit': o.kit || null }, String(s));
}
function ln(key, layer, x1, y1, x2, y2, o = {}) {
  return E(key, 'line', layer, { x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), stroke: o.stroke || C.ink,
    'stroke-width': o.w || 0.75, opacity: opv(o), 'stroke-dasharray': o.dash || null, 'stroke-linecap': o.cap || 'square' });
}
function rc(key, layer, x, y, w, h, o = {}) {
  return E(key, 'rect', layer, { x: f2(x), y: f2(y), width: f2(Math.max(0, w)), height: f2(Math.max(0, h)),
    fill: o.fill || 'none', 'fill-opacity': o.fo != null ? o.fo : 1, stroke: o.stroke || 'none', 'stroke-width': o.w || 0, rx: o.rx || 0,
    opacity: opv(o), 'stroke-dasharray': o.dash || null, transform: o.tr || null });
}
function path(key, layer, d, o = {}) {
  return E(key, 'path', layer, { d, fill: o.fill || 'none', stroke: o.stroke || C.ink, 'stroke-width': o.w || 1, opacity: opv(o),
    'stroke-dasharray': o.dash || null, 'stroke-linecap': o.cap || 'round' });
}
function dim(key, layer, x1, x2, y, label, op = 1, o = {}) {
  if (op <= 0) return;
  const col = o.stroke || C.ink, sz = o.size || 14;
  ln(key + 'l', layer, x1, y, x2, y, { op, stroke: col, w: o.w || 0.75 });
  ln(key + 'a', layer, x1 - 4, y + 4, x1 + 4, y - 4, { op, stroke: col, w: 1.1 });
  ln(key + 'b', layer, x2 - 4, y + 4, x2 + 4, y - 4, { op, stroke: col, w: 1.1 });
  ln(key + 'c', layer, x1, y - 7, x1, y + 7, { op: op * 0.6, stroke: col });
  ln(key + 'd', layer, x2, y - 7, x2, y + 7, { op: op * 0.6, stroke: col });
  if (label) {
    const w = String(label).length * sz * ADV.mono + 10;
    rc(key + 'bg', layer, (x1 + x2) / 2 - w / 2, y - sz * 0.7, w, sz * 1.4, { fill: o.bg || C.paper, op });
    tx(key + 't', layer, (x1 + x2) / 2, y + sz * 0.36, label, { anchor: 'middle', size: sz, op, fill: col, weight: 500, ls: '0.04em', role: o.role });
  }
}
/* stamp: face guard: a face that does not read under the rim (contrast < 3) falls back to the chalk surface.
   The text is a device, not a result: data-role 'secondary' unless o.role says otherwise (SHIP defect 1). */
function stamp(key, layer, cx, cy, s, text, o = {}) {
  const op = o.op != null ? o.op : 1; if (op <= 0) return;
  const fs = Math.max(14, (o.fs || 26) * s);   // stamp text is secondary: never under 14 units (ledger's slot asked for 13)
  const famK = o.fam || 'disp', adv = ADV[famK] || ADV_FAM[String(famK).replace(/^'([^']+)'.*$/, '$1')] || 0.5;
  const w = (o.w || Math.max(120, String(text).length * (o.fs || 26) * adv + 36)) * s, h = (o.h || 44) * s, rot = o.rot != null ? o.rot : -7;
  const tr = `rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`;
  const rim = o.rim || C.ink;
  let face = o.face || C.chalk; if (contrast(face, rim) < 3) face = best(rim, [C.chalk, C.paper, C.dark, C.onDark]);
  rc(key + 'f', layer, cx - w / 2, cy - h / 2, w, h, { fill: face, stroke: rim, w: 2.4 * s, rx: 5 * s, op, tr });
  rc(key + 'i', layer, cx - w / 2 + 4 * s, cy - h / 2 + 4 * s, w - 8 * s, h - 8 * s, { stroke: rim, w: 0.9 * s, rx: 3 * s, op, tr });
  tx(key + 't', layer, cx, cy + fs * 0.36, text, { fam: famK, size: fs, anchor: 'middle', fill: rim, op, ls: '0.08em', tr, role: o.role || 'secondary', weight: o.weight });
}

/* ── film.json lookups ── */
const CH = FILM.chapters || [], CARDS = FILM.cards || [], CAPS = FILM.captions || [];
const chapterAt = (t) => { let c = CH[0] || null; for (const x of CH) if (t >= x.t0) c = x; return c; };
const cardAt = (t) => CARDS.find(c => t >= c.t0 && t < c.t1) || null;
const capAt = (t) => { for (const c of CAPS) if (t >= c[0] && t < c[1]) return c; return null; };
const brandAt = () => FILM.brand ? (FILM.brand.at != null ? FILM.brand.at : DUR - 3) : null;

/* ── layout (the kit's sheet; films written for kit draw against it) ── */
const LAYOUT = {
  W, H,
  content: { x0: 48, y0: 104, x1: 664, y1: 400 },
  ledger: { x: 700, y: 44, w: 230, row: 19 },
  block: { x: 700, y: 312, w: 230, h: 84 },
  slot: { x: 890, y: 356 },
  cap: { x: 48, y: 480, w: 864, size: 28, lh: 34 },
};

/* ══════════ CHROME injection ══════════
   The chrome module is re-parameterised with the brand's roles (chrome.with({palette, type})), then driven
   through a facade kit that (a) tags every text it draws with a data-role by layer (chrome → 'chrome',
   cap → 'must-read', card/top → 'must-read' at ≥ 28 units else 'secondary') and (b) re-roles the chrome's
   highlight wash (a field-layer fill in the card-type colour) to the chalk surface, so it reads on dark brands. */
const CHROMES = (typeof globalThis !== 'undefined' ? globalThis : window).CETI_CHROMES || {};
const CHROME_ID = CONF.chrome || 'tender-set';
const roleFor = (layer, size) => layer === 'chrome' || layer === 'field' ? 'chrome' : layer === 'cap' ? 'must-read'
  : (+size >= 28 ? 'must-read' : 'secondary');
let CHROME = null;
if (CHROME_ID !== 'none') {
  const base = CHROMES[CHROME_ID];
  if (!base) throw new Error('KIT2: chrome ' + CHROME_ID + ' is not registered in CETI_CHROMES');
  const css = (k) => FONT[k];
  CHROME = base.with ? base.with({
    palette: { bg: C.paper, ink: C.ink, accent: C.accent, muted: C.muted, line: C.line, panel: C.dark, chalk: C.onDark },
    type: { disp: css('disp'), mono: css('mono'), serif: css('disp'), sans: css('sans') },
  }) : base;
}
/* the WINDOW: a film written for kit owns LAYOUT.content (plus the default commit box during the COMMIT chapter).
   Chrome furniture in the 'chrome' and 'field' layers is cut out of those boxes: an axis-aligned rule is split
   around them, any other chrome element that would intersect them is not drawn. Pure: depends on t only.
   CONF.window === false turns it off (a film drawn against chrome.layout.safe does not need it). */
const WIN_CONTENT = { x0: 40, y0: 96, x1: 672, y1: 410 }, WIN_COMMIT = { x0: 692, y0: 142, x1: 938, y1: 308 };
/* CONTENT-BOX NEGOTIATION. A kit-authored film owns FILM_BOX (its content box plus the commit column, 960 basis).
   The chrome says where a film may draw: chrome.contentBox(brandPack, 'kit') → {x0, y0, x1, y1, align}. kit2 lays the
   film inside it: one uniform scale s = min(1, box/FILM_BOX) (fit, never crop, never enlarge), placed flush left/top
   (align 'start') or centred. The film's SVG layers 'marks' and 'labels' get transform="translate(ox oy) scale(s)",
   the canvas gets the same matrix for FILM_RENDER.render; captions, cards, roll, brand card and chrome stay on the
   960 sheet. Film text keeps the legibility floors: rendered size = max(min(size, floor), size·s), floor 28/14/12 by
   the authored size (counter-scaled inside the group). The window (chrome furniture cut out) is the mapped boxes.
   A chrome without contentBox, chrome 'none', CONF.window === false or CONF.box === false → identity. */
const FILM_BOX = { x0: 40, y0: 96, x1: 938, y1: 410 };
const CBOX = CHROME && typeof CHROME.contentBox === 'function' && CONF.window !== false && CONF.box !== false ? CHROME.contentBox(PACK, 'kit') : null;
const MAP = (() => {
  if (!CBOX) return { s: 1, ox: 0, oy: 0 };
  const fw = FILM_BOX.x1 - FILM_BOX.x0, fh = FILM_BOX.y1 - FILM_BOX.y0, bw = CBOX.x1 - CBOX.x0, bh = CBOX.y1 - CBOX.y0;
  const s = +Math.min(1, bw / fw, bh / fh).toFixed(4), st = CBOX.align === 'start';
  const left = st ? CBOX.x0 : CBOX.x0 + (bw - fw * s) / 2, top = st ? CBOX.y0 : CBOX.y0 + (bh - fh * s) / 2;
  return { s, ox: +(left - FILM_BOX.x0 * s).toFixed(2), oy: +(top - FILM_BOX.y0 * s).toFixed(2) };
})();
const MAPPED = MAP.s !== 1 || MAP.ox !== 0 || MAP.oy !== 0;
const FILM_LAYERS = new Set(['marks', 'labels']);
const mapBox = (b) => MAPPED ? { x0: b.x0 * MAP.s + MAP.ox, y0: b.y0 * MAP.s + MAP.oy, x1: b.x1 * MAP.s + MAP.ox, y1: b.y1 * MAP.s + MAP.oy } : b;
const WIN_C = mapBox(WIN_CONTENT), WIN_K = mapBox(WIN_COMMIT);
const commitCh = (FILM.chapters || []).find(c => /commit/i.test(String(c.beat || c.id || '')));
let curT = 0;
const winBoxes = () => CONF.window === false ? [] : (commitCh && curT >= commitCh.t0 - 1 && curT < commitCh.t1 + 0.6 ? [WIN_C, WIN_K] : [WIN_C]);
const hits = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const windowed = (layer) => layer === 'chrome' || layer === 'field';
const famAdv = (fam) => ADV[fam] || ADV_FAM[String(fam).replace(/^'([^']+)'.*$/, '$1')] || 0.55;
function txBox(x, y, s, o) {
  const size = o.size || 14, w = String(s).length * size * famAdv(o.fam || 'mono'), a = o.anchor || 'start';
  const x0 = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x;
  return { x0, x1: x0 + w, y0: y - size * 0.8, y1: y + size * 0.2 };
}
function splitSeg(segs, b, horiz) {   // cut [lo, hi] pieces on one axis by box b
  const out = [];
  for (const [lo, hi, k] of segs) {
    const c0 = horiz ? b.x0 : b.y0, c1 = horiz ? b.x1 : b.y1;
    if (hi <= c0 || lo >= c1) { out.push([lo, hi, k]); continue; }
    if (lo < c0) out.push([lo, c0, k + 'a']);
    if (hi > c1) out.push([c1, hi, k + 'b']);
  }
  return out;
}
const facade = {
  ln: (key, layer, x1, y1, x2, y2, o = {}) => {
    if (!windowed(layer)) return ln(key, layer, x1, y1, x2, y2, o);
    const bx = winBoxes(), lb = { x0: Math.min(x1, x2) - 0.5, x1: Math.max(x1, x2) + 0.5, y0: Math.min(y1, y2) - 0.5, y1: Math.max(y1, y2) + 0.5 };
    if (!bx.some(b => hits(lb, b))) return ln(key, layer, x1, y1, x2, y2, o);
    const horiz = y1 === y2, vert = x1 === x2;
    if (!horiz && !vert) return;
    let segs = [[horiz ? Math.min(x1, x2) : Math.min(y1, y2), horiz ? Math.max(x1, x2) : Math.max(y1, y2), '']];
    for (const b of bx) if (hits(lb, b)) segs = splitSeg(segs, b, horiz);
    segs.forEach(([lo, hi, k]) => horiz ? ln(key + k, layer, lo, y1, hi, y1, o) : ln(key + k, layer, x1, lo, x1, hi, o));
  },
  tx: (key, layer, x, y, s, o = {}) => {
    if (windowed(layer) && winBoxes().some(b => hits(txBox(x, y, s, o), b))) return;
    return tx(key, layer, x, y, s, Object.assign({ role: roleFor(layer, o.size || 14) }, o));
  },
  rc: (key, layer, x, y, w, h, o = {}) => {
    if (windowed(layer) && winBoxes().some(b => hits({ x0: x, y0: y, x1: x + w, y1: y + h }, b))) return;
    return rc(key, layer, x, y, w, h, layer === 'field' && o.fill === C.onDark ? Object.assign({}, o, { fill: C.chalk }) : o);
  },
  E: (key, tag, layer, attrs, text) => {
    if (windowed(layer) && tag === 'path' && attrs && attrs.d) {
      const n = String(attrs.d).match(/-?\d+(\.\d+)?/g) || [], xs = n.filter((_, i) => i % 2 === 0).map(Number), ys = n.filter((_, i) => i % 2).map(Number);
      if (xs.length && winBoxes().some(b => hits({ x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }, b))) return;
    }
    return E(key, tag, layer, attrs, text);
  },
  path: (key, layer, d, o = {}) => path(key, layer, d, o),
  stamp: (key, layer, cx, cy, s, text, o = {}) => {
    if (windowed(layer) && winBoxes().some(b => hits({ x0: cx - 80 * s, x1: cx + 80 * s, y0: cy - 30 * s, y1: cy + 30 * s }, b))) return;
    return stamp(key, layer, cx, cy, s, text, Object.assign({ role: 'secondary' }, o));
  },
  caption: () => {},          // kit2 draws the caption itself, in the chrome's style (see capStyle)
};
// caption style from the chrome's layout.cap and its caption face (tender-set: mono; ledger: serif = disp; memo: sans = body)
const CAP_FAM = { 'tender-set': 'mono', ledger: 'disp', memo: 'sans' };
function capStyle() {
  if (!CHROME || !CHROME.layout || !CHROME.layout.cap) return Object.assign({ fam: 'mono' }, LAYOUT.cap);
  const k = CHROME.layout.cap, fam = CHROME.capFam || CAP_FAM[CHROME.id] || 'mono';
  return { x: k.x, y: k.y, w: k.w, size: k.size, lh: k.lh, fam };
}
/* fromKit: the kit's sheet options → this chrome's frame options. A chrome may define its own
   fromKit(kitOpts, t, ch) and that wins; otherwise these adapters, by id, else a pass-through. */
const fitWords = (s, n) => { s = String(s || '').trim(); if (s.length <= n) return s; const c = s.slice(0, n + 1); const i = c.lastIndexOf(' '); return (i > 0 ? c.slice(0, i) : s.slice(0, n)).replace(/[\s·,;:–-]+$/, ''); };
const latestRow = (lg, t) => { const r = (lg && lg.rows || []).filter(x => t >= x[0]); return r.length ? r[r.length - 1][1] : ''; };
const ADAPT = {
  'tender-set': (o) => ({ marks: o.marks, ledger: o.ledger || false, block: o.block || false, slot: o.block && o.block.slot ? { label: o.block.slot } : null }),
  ledger: (o, t) => ({ folio: String(latestRow(o.ledger, t)).slice(0, 40), slot: o.block && o.block.slot ? { label: o.block.slot } : null }),
  memo: (o, t) => {   // fields are cut on a word boundary to the width each field has (TO/FROM 114–548, DATE/FILE 626–912)
    const b = o.block || {}, L = b.lines || [], n = (w) => Math.floor(w / (14 * ADV.mono));
    return { fields: { to: fitWords(L.join(' '), n(434)), from: fitWords(FILM.eyebrow || 'CETI CASE DESK', n(434)),
      file: fitWords(b.title || FILM.title || '', n(286)), date: fitWords(latestRow(o.ledger, t), n(286)) } };
  },
};
function chrome(t, chapter, opts = {}) {
  if (!CHROME) return;
  curT = t;
  const ch = chapter || chapterAt(t) || { eyebrow: '', title: '' };
  const map = CHROME.fromKit || ADAPT[CHROME.id] || ((o) => o);
  CHROME.frame(facade, t, { eyebrow: ch.eyebrow || '', title: ch.title || '' }, Object.assign(map(opts, t, ch), { caption: false }));
}

/* caption(t, o): the FILM.captions entry live at t, accent tick + up to 2 lines at 28 units, 'cap' layer, must-read */
function caption(t, o = {}) {
  const c = capAt(t); if (!c || window.NOCAP) return;
  const K = Object.assign(capStyle(), o);
  const op = seg(t, c[0], c[0] + 0.25) * (1 - seg(t, c[1] - 0.25, c[1]));
  const lines = wrap(c[2], K.w, K.size, K.fam || 'mono').slice(0, K.max || 2);
  const y0 = K.y - (lines.length - 1) * K.lh * (K.up === false ? 0 : 1);
  rc('cp.r', 'cap', K.x, y0 - K.size - 6, 10, 2, { fill: C.accent, op });
  lines.forEach((s, i) => tx('cp.t' + i, 'cap', K.x, y0 + i * K.lh, s, { size: K.size, op, weight: K.fam === 'mono' ? 500 : (K.fam === 'disp' ? TW.disp : 500), fam: K.fam || 'mono', fill: K.fill || C.ink, role: 'must-read' }));
}

/* card(t, c): the chrome's question card, else a plain one on the dark role */
function card(t, c) {
  if (!c) return;
  if (CHROME && CHROME.card) return CHROME.card(facade, t, c);
  const a = seg(t, c.t0, c.t0 + 0.4), out = 1 - seg(t, c.t1 - 0.35, c.t1);
  rc('cd.bg', 'card', 0, 0, W, H, { fill: C.dark, op: a * (c.fadeOut ? out : 1) });
  const qa = seg(t, c.t0 + 0.3, c.t0 + 0.8) * out;
  const lines = c.q || [], lh = 54, y0 = 270 - (lines.length - 1) * lh / 2 + 14;
  lines.forEach((s, i) => tx('cd.q' + i, 'card', 480, y0 + i * lh, s, { fam: 'disp', size: 46, anchor: 'middle', fill: C.onDark, op: qa, ls: '0.02em', role: 'must-read' }));
  if (c.sub) tx('cd.s', 'card', 480, y0 + (lines.length - 1) * lh + 46, c.sub, { size: 14, anchor: 'middle', fill: C.accent, op: 0.9 * seg(t, c.t0 + (c.subAt || 0.8), c.t0 + (c.subAt || 0.8) + 0.4) * out, ls: '0.18em', weight: 500, role: 'secondary' });
}

/* roll: the sheet unrolls from the left over the dark role ('top' layer). Nothing before t0 unless t0 = 0. */
function roll(t, t0, dur = 0.5, key = 'rl') {
  if (t < t0 && t0 > 0) return;
  const u = seg(t, t0, t0 + dur); if (u >= 1) return;
  const x = W * ease(u);
  rc(key + '.bk', 'top', x, 0, W - x + 2, H, { fill: C.dark });
  E(key + '.sh', 'rect', 'top', { x: f2(x - 14), y: 0, width: 14, height: H, fill: 'url(#kit-curl)', opacity: u > 0 ? 1 : 0 });
}

/* brandCard(t, t0, line): the chrome's end card, else a plain one (wordmark = pack voice.end_card) */
function brandCard(t, t0, line) {
  if (t < t0) return;
  const take = line || (FILM.brand && FILM.brand.takeaway) || '';
  if (CHROME && CHROME.brand) return CHROME.brand(facade, t, t0, take);
  const a = ease(seg(t, t0 + 0.6, t0 + 1.1)), b = ease(seg(t, t0 + 1.0, t0 + 1.5));
  if (a <= 0) return;
  const word = (PACK.voice && PACK.voice.end_card) || 'CETI';
  rc('br.bg', 'top', 0, 0, W, H, { fill: C.dark, op: a });
  tx('br.w', 'top', 480 + 0.16 * 60, 214, word, { fam: 'disp', size: 60, anchor: 'middle', fill: C.onDark, op: a, ls: '0.32em', role: 'must-read' });
  ln('br.r', 'top', 448, 238, 512, 238, { stroke: C.accent, w: 2, op: a });
  wrap(take, 760, 34, 'disp').slice(0, 2).forEach((s, i) => tx('br.t' + i, 'top', 480, 300 + i * 42, s, { fam: 'disp', size: 34, anchor: 'middle', fill: C.onDark, op: b, ls: '0.02em', role: 'must-read' }));
}

/* ══════════ the commit box ══════════
   As kit, with: data-role on every text (title/value must-read, prompt secondary, countdown digit chrome:
   SHIP defects 1-2); film mode reveals the default whole (no partial "10" while "100" types: defect 2);
   the drawn geometry is published as K.commitGeom so the player puts the HTML overlay on it (defect 5). */
let commitGeom = null;
function commitBox(t, s, o = {}) {
  const cm = FILM.commit || {}, A = o.at != null ? o.at : cm.at;
  const x = o.x != null ? o.x : 700, y = o.y != null ? o.y : 150, w = o.w || 230, h = o.h || 150;
  const seal = o.seal != null ? o.seal : A + 4.5, out = o.out != null ? o.out : Infinity;
  K.commitGeom = commitGeom = MAPPED ? { x: x * MAP.s + MAP.ox, y: y * MAP.s + MAP.oy, w: w * MAP.s, h: h * MAP.s } : { x, y, w, h };   // screen geometry for the player overlay
  const op = seg(t, A - 1, A - 0.2) * (1 - seg(t, out, out + 0.5));
  if (op <= 0) return { op: 0, sealed: t >= seal };
  rc('cb.o', 'marks', x, y, w, h, { stroke: C.ink, w: 1.4, dash: '6 4', op, fill: C.chalk, fo: 0.45 });
  tx('cb.h', 'labels', x + 14, y + 36, o.title || 'YOUR NUMBER', { fam: 'disp', size: 28, op, ls: '0.05em', role: 'must-read' });
  tx('cb.s', 'labels', x + 14, y + 58, o.prompt || cm.unitLabel || cm.unit || '', { size: 14, op: op * 0.85, ls: '0.06em', role: 'secondary' });
  if (t >= A && t < seal) {
    const ru = seg(t, A, A + 4), cx = x + w - 26, cy = y + 28, R = 14, a = 2 * Math.PI * (1 - ru);
    if (ru < 1) {
      const p1 = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
      path('cb.ring', 'marks', `M ${cx} ${cy - R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${f2(p1[0])} ${f2(p1[1])}`, { stroke: C.ink, w: 1.4, op });
      tx('cb.n', 'labels', cx, cy + 5, String(Math.max(1, 4 - Math.floor(t - A))), { size: 14, anchor: 'middle', op, weight: 500, role: 'chrome', kit: 'countdown' });
    }
  }
  const sv = s || state, ds = answerStr(sv);
  let shown = ds, vop = op * seg(t, A - 0.6, A - 0.2);
  if (FILM_MODE && t < seal) { const u = seg(t, A + 1.2, A + 1.6); shown = u > 0 ? ds : '__'; if (u > 0) vop *= u; }
  if (!FILM_MODE && sv.answer == null) shown = t < seal ? '__' : '?';
  tx('cb.v', 'labels', x + w / 2, y + h - 26, shown, { fam: 'disp', size: 56, anchor: 'middle', op: vop, role: 'must-read', kit: 'answer' });
  if (t >= seal) {
    const k = seg(t, seal, seal + 0.22);
    const lab = sv.answer === 'none' ? 'NO ANSWER' : 'SEALED';
    stamp('cb.st', 'marks', x + w / 2, y + h - 44, lerp(1.4, 0.9, eout(k)), lab, { op: k * op, h: 50, fs: 28, role: 'secondary' });
  }
  return { op, sealed: t >= seal };
}

/* ══════════ MATERIAL injection ══════════
   ARSENAL.materials[id] (arsenal/materials/drawn): mark(p, kind, x, y, w, h, st, tokens), texture(p, box, tokens).
   The film's canvas marks reach the material through K.ctx: for any material but 'ink', K.ctx is a proxy of the
   p5 Canvas2D context whose fillRect → mark('bar') and strokeRect → mark('rect'), with the colour the film set
   passed as the 'ink' role of a per-call token copy and its alpha as st.a, and the seed an integer hash of the
   rounded geometry (so a mark wobbles the same way on every seek). K.pencil → mark('line'). */
const AR = (typeof window !== 'undefined' && window.ARSENAL) || { materials: {} };
const MAT_ID = CONF.material || 'ink';
const MAT = (AR.materials || {})[MAT_ID] || null;
if (!MAT && MAT_ID !== 'ink') throw new Error('KIT2: material ' + MAT_ID + ' is not registered in ARSENAL.materials');
// materials read the pack's own schema roles (chalk = text on panel), not the kit's derived ones
/* LEVEL (DECISIONS Q6): film.json `level` ('exec' default | 'manager' | 'engineer'). At the exec level the brand's
   texture is rendered only when it is 'none' or 'paper'; a 'grain'/'halftone' pack is drawn flat and the drop is
   recorded (axes.texture vs axes.texture_declared; the gate's G10 WARNs on it). The MATERIAL is never overridden:
   it is an explicit build choice, and G10 FAILs an exec film that is not in ink. CONF.levelGuard === false turns the
   texture drop off (then G10 FAILs a grain exec page). */
const LEVEL = FILM.level || CONF.level || 'exec';
const EXEC_TEX = ['none', 'paper'], TEX_DECL = PACK.texture || 'none';
const TEX = LEVEL === 'exec' && CONF.levelGuard !== false && EXEC_TEX.indexOf(TEX_DECL) < 0 ? 'none' : TEX_DECL;
const TOK = { id: PACK.id, color: Object.assign({}, PACK.color || {}, { bg: C.paper, ink: C.ink, accent: C.accent, accent2: C.soft, muted: C.muted, line: C.line, panel: C.panel }),
  type: TP, texture: TEX };
function ghash(a, b, c, d) { let n = (Math.round(a * 4) * 73856093) ^ (Math.round(b * 4) * 19349663) ^ (Math.round(c * 4) * 83492791) ^ (Math.round(d * 4) * 2654435761); n = Math.imul(n ^ (n >>> 15), 0x85EBCA6B); return (n ^ (n >>> 13)) >>> 0; }
const ROLE_OF = {}; [['ink', 'ink'], ['accent', 'accent'], ['soft', 'accent2'], ['muted', 'muted'], ['line', 'line']].forEach(([k, r]) => { if (!ROLE_OF[C[k]]) ROLE_OF[C[k]] = r; });
// the colour the film set → {role, tok, a}: a pack role when it is one (so a material's own role mapping applies),
// else role 'ink' on a token copy whose ink (and chalk, for chalk-polarity materials) is that colour
function styleTok(style) {
  const c = parseCol(typeof style === 'string' ? style : C.ink), col = toHex(c), role = ROLE_OF[col];
  if (role) return { role, tok: TOK, a: c[3] };
  return { role: 'ink', tok: Object.assign({}, TOK, { color: Object.assign({}, TOK.color, { ink: col, chalk: col }) }), a: c[3] };
}
function materialCtx(raw) {
  if (!MAT || MAT_ID === 'ink') return raw;
  const pp = { drawingContext: raw };
  const fns = {
    fillRect(x, y, w, h) { const s = styleTok(raw.fillStyle); MAT.mark(pp, 'bar', x, y, w, h, { seed: ghash(x, y, w, h), i: 0, u: 1, role: s.role, a: s.a * raw.globalAlpha }, s.tok); },
    strokeRect(x, y, w, h) { const s = styleTok(raw.strokeStyle); MAT.mark(pp, 'rect', x, y, w, h, { seed: ghash(x, y, w, h), i: 1, u: 1, role: s.role, a: s.a * raw.globalAlpha }, s.tok); },
  };
  const cache = {};
  return new Proxy(raw, {
    get(tg, k) {
      if (fns[k]) return fns[k];
      const v = tg[k];
      if (typeof v === 'function') return cache[k] || (cache[k] = v.bind(tg));
      return v;
    },
    set(tg, k, v) { tg[k] = v; return true; },
  });
}

/* ══════════ ground: chrome stock, or flat bg + texture ══════════
   brand.texture 'paper' + a chrome with ground() → the chrome's own stock (re-coloured by the brand).
   Otherwise: flat bg; texture 'paper' without a chrome → the kit's paper (blotches, banding, crease);
   then the material's texture(p, box, tokens) (grain speckle, ruling, ...) over the whole sheet. */
function paperBlotch(p, gc, seed) {
  p.noiseSeed(seed);
  const r = mulberry32(seed);
  const bx1 = 40 + 80 * r(), by1 = 20 + 50 * r(), bx2 = 150 + 70 * r(), by2 = 70 + 50 * r();
  const ink = hexRgb(C.ink), dark = lum(C.paper) < 0.18;
  const lo = p.createGraphics(240, 135); lo.pixelDensity(1); lo.loadPixels();
  for (let y = 0; y < 135; y++) for (let x = 0; x < 240; x++) {
    const n = p.noise(x * 0.012, y * 0.012);
    const b1 = Math.exp(-(((x - bx1) ** 2) / 3000 + ((y - by1) ** 2) / 1400)), b2 = Math.exp(-(((x - bx2) ** 2) / 2600 + ((y - by2) ** 2) / 1200));
    const a = (0.55 * (b1 + b2) + 0.45 * n) * 0.05, i = 4 * (y * 240 + x);
    lo.pixels[i] = dark ? 255 : 120; lo.pixels[i + 1] = dark ? 250 : 95; lo.pixels[i + 2] = dark ? 235 : 50; lo.pixels[i + 3] = Math.round(a * 255);
  }
  lo.updatePixels();
  gc.imageSmoothingEnabled = true; gc.drawImage(lo.elt, 0, 0, W, H);
  for (let y = 0; y < H; y += 3) { gc.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${0.012 * (0.5 + 0.5 * Math.sin(y * 0.21))})`; gc.fillRect(0, y, W, 1); }
  if (lo.remove) lo.remove();
}
function makeGround(p, seed = SEED) {
  const tex = TEX;
  let g;
  if (tex === 'paper' && CHROME && CHROME.ground) g = CHROME.ground(p, seed);
  else {
    g = p.createGraphics(W, H); g.pixelDensity(2);
    const gc = g.drawingContext; gc.fillStyle = C.paper; gc.fillRect(0, 0, W, H);
    if (tex === 'paper') paperBlotch(p, gc, seed);
  }
  if (MAT && MAT.texture) MAT.texture({ drawingContext: g.drawingContext }, { x: 0, y: 0, w: W, h: H, seed }, TOK);
  return g;
}
// pencil(x1, y1, x2, y2, u, seed, o): a straightedge stroke on the canvas, drawn to fraction u, through the material
function pencil(x1, y1, x2, y2, u = 1, seed = 0, o = {}) {
  if (u <= 0 || !K.ctx) return;
  const raw = K.p.drawingContext;
  if (MAT && MAT.mark) {
    const s = styleTok(o.col || rgba('accent', o.a != null ? o.a : 0.85));
    MAT.mark({ drawingContext: raw }, 'line', x1, y1, x2 - x1, y2 - y1, { seed: (seed * 7919) | 0, i: 2, u, role: s.role, a: s.a }, s.tok);
    return;
  }
  const ctx = raw, P = K.p;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const ov = o.over != null ? o.over : 3, ax = x1 - ux * ov, ay = y1 - uy * ov, L2 = len + 2 * ov;
  const n = Math.max(6, Math.round(L2 / 6)), m = Math.max(1, Math.round(n * u));
  ctx.save(); ctx.strokeStyle = o.col || rgba('accent', o.a != null ? o.a : 0.85); ctx.lineWidth = o.w || 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= m; i++) {
    const s = i / n, wv = (P.noise(seed * 7.13 + i * 0.35) - 0.5) * 1.2;
    const x = ax + ux * L2 * s - uy * wv, y = ay + uy * L2 * s + ux * wv;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
}

/* ══════════ mount & render ══════════ */
let readyRes; const readyP = new Promise(r => (readyRes = r));
let lastT = 0;
const FR_ = () => window.FILM_RENDER || {};
function mount(stageEl) {
  svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'ex-svg');
  svg.innerHTML = `<defs><linearGradient id="kit-curl" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.7" stop-color="${C.dark}" stop-opacity="0.28"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0.9"/></linearGradient></defs>`;
  LAYERS.forEach(k => { const g = document.createElementNS(NS, 'g'); g.setAttribute('data-layer', k);
    if (MAPPED && FILM_LAYERS.has(k)) g.setAttribute('transform', `translate(${MAP.ox} ${MAP.oy}) scale(${MAP.s})`);
    svg.appendChild(g); L[k] = g; });
  stageEl.appendChild(svg);
  K.svg = svg;
  new p5((p) => {
    p.setup = () => {
      const cnv = p.createCanvas(W, H); p.pixelDensity(2); p.noLoop();
      cnv.elt.classList.add('ex-canvas');
      cnv.parent(stageEl); stageEl.insertBefore(cnv.elt, svg);
      K.p = p; K.ctx = materialCtx(p.drawingContext);
      K.ground = FR_().ground === false ? null : makeGround(p, SEED);
      p.noiseSeed(SEED);
      if (FR_().setup) FR_().setup(p, K);
      p.noiseSeed(SEED);
      readyRes(true);
    };
    p.draw = () => {};
  });
  return readyP;
}
function render(t, s) {
  if (!K.ctx) return;
  t = clamp(t, 0, DUR - 1e-6); lastT = t; FR++;
  const ctx = K.p.drawingContext, d = K.p.pixelDensity();
  ctx.setTransform(d, 0, 0, d, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
  if (K.ground) ctx.drawImage(K.ground.elt, 0, 0, W, H);
  const R = FR_(), bAt = brandAt(), auto = R.brand !== false && bAt != null;
  const tm = auto && t >= bAt ? bAt - 1e-3 : t;
  ctx.save();
  if (MAPPED) ctx.setTransform(d * MAP.s, 0, 0, d * MAP.s, d * MAP.ox, d * MAP.oy);   // the film's canvas in the chrome's content box
  if (R.render) R.render(tm, s || state, K);
  ctx.restore();
  if (R.captions !== false) caption(tm);
  if (auto && t >= bAt) brandCard(t, bAt, FILM.brand.takeaway);
  endFrame();
}

const K = window.KIT = {
  FILM, FILM_MODE, DUR, W, H, SEED, C, FONT, LAYOUT, LAYERS, state,
  clamp, seg, ease, eout, lerp, typed, fmtK, mulberry32, shuffle, PhiInv, wrap, rgba, hexRgb,
  E, endFrame, tx, ln, rc, path, dim, stamp,
  chrome, caption, card, roll, brandCard, commitBox, answerStr, answered,
  makeGround, pencil,
  chapterAt, cardAt, capAt, brandAt,
  mount, render, ready: () => readyP, get t() { return lastT; }, poolSize: () => POOL.size,
  p: null, ctx: null, ground: null, svg: null, commitGeom: null,
  // kit2: what was injected, and the role tools
  KIT2: { brand: PACK.id, chrome: CHROME_ID, material: MAT_ID },
  // the axes this page was built on (player.js publishes them as window.__film.info.axes; gate G10 reads them)
  AXES: { brand: PACK.id, chrome: CHROME_ID, material: MAT_ID, texture: TEX, texture_declared: TEX_DECL, level: LEVEL,
    box: CBOX ? { x0: CBOX.x0, y0: CBOX.y0, x1: CBOX.x1, y1: CBOX.y1, s: MAP.s, ox: MAP.ox, oy: MAP.oy } : null },
  BRAND: PACK, ROLES: C, CHROME, MATERIAL: MAT, contrast, resolveRoles, ADV,
};
})();
