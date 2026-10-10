/* ════════════════════════════════════════════════════════════════════
   core/po/grid.js — a unit-mark grid: N marks, one per counted thing
   --------------------------------------------------------------------
   spec: { kind:'grid', id, n (100–2,000), cols?, pitch?, x0?, y0?, r?, label? }  (core/layout.js re-lays it per aspect)
   Row-major cells; anchors: grid (top-left), cell:i on demand via cell(i).
   block(count, cols, pitch, x0, y0) places a gathered sub-whole elsewhere.
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const PO = root.PO;
  PO.kind('grid', {
    create(spec) {
      const n = spec.n || 1000, cols = spec.cols || 40, pitch = spec.pitch || 9;
      const rows = Math.ceil(n / cols), x0 = spec.x0 != null ? spec.x0 : 76, y0 = spec.y0 != null ? spec.y0 : 168;
      const geom = { n, cols, rows, pitch, x0, y0, x1: x0 + (cols - 1) * pitch, y1: y0 + (rows - 1) * pitch, r: spec.r != null ? spec.r : Math.min(3, pitch * 0.3) };
      return { geom, anchors: { grid: { x: x0, y: y0 }, gridEnd: { x: geom.x1, y: geom.y1 } }, state: { label: spec.label || '' } };
    },
    cell(geom, i, out) { out = out || {}; out.x = geom.x0 + (i % geom.cols) * geom.pitch; out.y = geom.y0 + Math.floor(i / geom.cols) * geom.pitch; return out; },
    block(count, cols, pitch, x0, y0) { const r = []; for (let i = 0; i < count; i++) r.push({ x: x0 + (i % cols) * pitch, y: y0 + Math.floor(i / cols) * pitch }); return r; },
  });
})(typeof window !== 'undefined' ? window : globalThis);
