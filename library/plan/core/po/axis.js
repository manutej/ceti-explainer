/* ════════════════════════════════════════════════════════════════════
   core/po/axis.js — a measured plane (x and y) or a number line (x only)
   --------------------------------------------------------------------
   spec: { kind:'axis', id, x:{min,max,label,unit?,ticks?}, y?:{min,max,label}, box?:{x0,x1,y0,y1} }
   sx(v) / sy(v) map data → viewBox; anchors: origin (x=0 or min, y=0).
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const PO = root.PO;
  PO.kind('axis', {
    create(spec) {
      const box = Object.assign({ x0: 300, x1: 880, y0: 150, y1: 420 }, spec.box || {});
      const X = spec.x, Y = spec.y || null;
      const zx = X.min <= 0 && X.max >= 0 ? 0 : X.min;
      const sx = (v) => box.x0 + (v - X.min) / (X.max - X.min) * (box.x1 - box.x0);
      const sy = Y ? (v) => box.y1 - (v - Y.min) / (Y.max - Y.min) * (box.y1 - box.y0) : () => box.y1;
      const zy = Y ? (Y.min <= 0 && Y.max >= 0 ? 0 : Y.min) : 0;
      const geom = { box, x: X, y: Y, origin: { x: sx(zx), y: Y ? sy(zy) : box.y1 } };
      return { geom, anchors: { origin: geom.origin }, state: {} };
    },
    /** mappers are functions, so they are rebuilt from geom (a PO is plain data) */
    map(geom) {
      const b = geom.box, X = geom.x, Y = geom.y;
      return { sx: (v) => b.x0 + (v - X.min) / (X.max - X.min) * (b.x1 - b.x0),
               sy: Y ? (v) => b.y1 - (v - Y.min) / (Y.max - Y.min) * (b.y1 - b.y0) : () => b.y1 };
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
