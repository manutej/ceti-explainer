/* ════════════════════════════════════════════════════════════════════
   core/layout.js — the region table per aspect (CHANNELS §3), reconciled with
   research/CHANNEL-SPECS.md (see channels/README.md "Reconciled numbers").
   --------------------------------------------------------------------
   Layout.make(aspect)  → lay = {
       id, wide, vw, vh, px:[w,h], k (export px per u),
       safe {x0,y0,x1,y1}, mask [[x0,y0,x1,y1]…] (platform zones: no type, no payoff),
       head {x0,x1, eyebrowY|null, titleY}, F (figure box), foot {x0,x1,y}, caption {x0,x1,y0,y1}|null,
       fs {eyebrow,title,label,body,cardQ,big,foot,chip,small,cap}  (u; the phone floor is 28 u ≈ 11.4 CSS px),
       sub(patch) → a child layout (contrast-split halves: a smaller F, mode 'side') }
   Layout.gridPlan(n, F)  → the portrait composition of a unit-mark grid PO:
       { cols, rows, pitch, x0, y0, x1, y1, r, LC (left column), RC (right column), ctxY, top, legendY }
   Layout.gridSide(n, box) → a grid fitted into a wide, short box (a stacked contrast half)
   16:9 is the design basis: lay.wide === true and every module keeps its own 960×540 constants,
   so the film is frame-identical to the pre-layout build. Other aspects are re-composed, never letterboxed.
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const box = (x0, y0, x1, y1) => ({ x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 });
  const FLOOR = 28;   // u: 28 u × 1.125 px/u × 390/1080 = 11.4 CSS px on a 390-px phone (Q8 ≥ 11)
  const FS_PHONE = { eyebrow: FLOOR, title: 56, label: FLOOR, body: 32, cardQ: 34, big: 84, foot: FLOOR, chip: FLOOR, small: FLOOR, cap: 32 };
  const T = {
    '16x9': { vw: 960, vh: 540, px: [1920, 1080], safe: box(0, 0, 960, 540), mask: [],
      head: { x0: 60, x1: 900, eyebrowY: 44, titleY: 88 }, F: box(40, 100, 930, 505), foot: { x0: 40, x1: 920, y: 486 }, caption: null,
      fs: { eyebrow: 13, title: 40, label: 13, body: 15, cardQ: 19, big: 44, foot: 13, chip: 15, small: 13, cap: 0 } },
    '1x1': { vw: 960, vh: 960, px: [1080, 1080], safe: box(48, 48, 912, 912),
      mask: [[0, 0, 960, 48], [0, 912, 960, 960], [0, 0, 48, 960], [912, 0, 960, 960]],
      head: { x0: 48, x1: 912, eyebrowY: null, titleY: 116 }, F: box(48, 150, 912, 740), foot: { x0: 48, x1: 912, y: 778 },
      caption: box(96, 800, 864, 908), fs: Object.assign({}, FS_PHONE) },
    '4x5': { vw: 960, vh: 1200, px: [1080, 1350], safe: box(48, 48, 912, 1104),
      mask: [[0, 0, 960, 48], [0, 1104, 960, 1200], [0, 0, 48, 1200], [912, 0, 960, 1200]],
      head: { x0: 48, x1: 912, eyebrowY: 104, titleY: 176 }, F: box(48, 240, 912, 936), foot: { x0: 48, x1: 912, y: 976 },
      caption: box(96, 994, 864, 1102), fs: Object.assign({}, FS_PHONE) },
    '9x16': { vw: 960, vh: 1920 / 1.125, px: [1080, 1920], safe: box(58, 240, 902, 1111),
      // CHANNEL-SPECS (Meta-derived): top 14 % (270 px), bottom 35 % (670 px), sides 6 % (65 px), right rail 230 px in the
      // bottom-right 40 % (y ≥ 1152 px): in u (÷1.125) top 240, bottom from 1111, sides 58, rail x > 756 for y > 1024
      mask: [[0, 0, 960, 240], [0, 1111, 960, 1707], [0, 0, 58, 1707], [902, 0, 960, 1707], [756, 1024, 960, 1707]],
      head: { x0: 58, x1: 902, eyebrowY: null, titleY: 318 }, F: box(58, 350, 902, 930), foot: { x0: 58, x1: 902, y: 976 },
      caption: box(204, 998, 756, 1106), fs: Object.assign({}, FS_PHONE, { title: 60, body: 34, cap: 36 }) },
  };
  const ALIAS = { '16:9': '16x9', '1:1': '1x1', '4:5': '4x5', '9:16': '9x16', wide: '16x9', square: '1x1', portrait: '4x5', reel: '9x16' };

  function make(aspect, patch) {
    const id = ALIAS[aspect] || aspect || '16x9';
    const t = T[id];
    if (!t) throw new Error('Layout.make: unknown aspect "' + aspect + '" (have 16x9, 1x1, 4x5, 9x16)');
    const lay = Object.assign({ id, wide: id === '16x9', k: t.px[0] / t.vw, mode: id === '16x9' ? 'wide' : 'column', reserve: 0 }, JSON.parse(JSON.stringify(t)), patch || {});
    lay.sub = (p) => make(id, Object.assign({}, patch || {}, p));
    return lay;
  }

  /** portrait composition of a unit-mark grid (the PO at every non-16:9 aspect): a ladder lane, the grid, its legend
      on the left; a right column (RC) ≥ 420 u for the module's furniture (cards, the counted block, the meter) */
  function gridPlan(n, F) {
    const lane = 40, gut = 48, ctxH = 56, legendH = 84, top = F.y0 + ctxH, H = F.y1 - top - legendH - 8;
    let best = null;
    [25, 30, 32, 40].forEach(cols => {
      const rows = Math.ceil(n / cols), p = Math.min(14, H / (rows - 1)), w = (cols - 1) * p, rc = F.w - lane - w - gut;
      const ok = rc >= 420 && p >= 6;
      if (ok && (!best || p > best.pitch + 1e-9)) best = { cols, rows, pitch: p };
    });
    if (!best) { const rows = Math.ceil(n / 25); best = { cols: 25, rows, pitch: Math.max(6, H / (rows - 1)) }; }
    const p = +best.pitch.toFixed(3), x0 = F.x0 + lane, y0 = top + 8, x1 = x0 + (best.cols - 1) * p, y1 = y0 + (best.rows - 1) * p;
    return { cols: best.cols, rows: best.rows, pitch: p, x0, y0, x1, y1, r: +(p * 0.32).toFixed(2), lane: { x: F.x0 + 6 },
      ctxY: F.y0 + 34, top, legendY: y1 + 42,
      LC: box(F.x0, top, x1 + 8, F.y1), RC: box(x1 + gut, top, F.x1, F.y1) };
  }

  /** a grid in a wide, short box (one stacked half of a contrast at a portrait aspect): rows of 40, pitch ≤ 9 */
  function gridSide(n, B, maxW) {
    const cols = 40, rows = Math.ceil(n / cols);
    const p = +Math.max(5, Math.min(9, (B.h) / (rows - 1), (maxW || B.w * 0.36) / (cols - 1))).toFixed(3);
    const x0 = B.x0 + 4, y0 = B.y0 + 4;
    return { cols, rows, pitch: p, x0, y0, x1: x0 + (cols - 1) * p, y1: y0 + (rows - 1) * p, r: +(p * 0.32).toFixed(2) };
  }

  /** where a unit-mark grid PO sits at this layout (16:9: the plan's own spec) */
  function poSpec(spec, lay) {
    if (lay.wide || spec.kind !== 'grid') return spec;
    const g = gridPlan(spec.n || 1000, lay.F);
    return Object.assign({}, spec, { cols: g.cols, pitch: g.pitch, x0: g.x0, y0: g.y0, r: +(g.pitch * 0.32).toFixed(2) });
  }

  /** is the rect [x0,y0,x1,y1] clear of every mask zone? (QA Q3) */
  function clear(lay, r) { return lay.mask.every(m => r[2] <= m[0] || r[0] >= m[2] || r[3] <= m[1] || r[1] >= m[3]); }

  const Layout = { make, gridPlan, gridSide, poSpec, clear, FLOOR, TABLE: T, ASPECTS: Object.keys(T) };
  root.Layout = Layout;
  if (typeof module !== 'undefined' && module.exports) module.exports = Layout;
})(typeof window !== 'undefined' ? window : globalThis);
