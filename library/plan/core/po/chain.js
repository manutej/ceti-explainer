/* ════════════════════════════════════════════════════════════════════
   core/po/chain.js — steps or nodes joined by one path
   --------------------------------------------------------------------
   layout 'line': k junctions on one horizontal line (compound-chain, recap).
     spec: { kind:'chain', id, layout:'line', k, x0?, x1?, y? }   anchors: start, j:1..k, end
   layout 'loop': named nodes on a cycle (an agent loop, a feedback loop).
     spec: { kind:'chain', id, layout:'loop', nodes:[{id, x, y}] }  anchors: node ids
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const PO = root.PO;
  PO.kind('chain', {
    create(spec) {
      if ((spec.layout || 'line') === 'loop') {
        const anchors = {}; (spec.nodes || []).forEach(n => { anchors[n.id] = { x: n.x, y: n.y }; });
        return { geom: { layout: 'loop', nodes: spec.nodes || [] }, anchors, state: {} };
      }
      const k = spec.k || 10, x0 = spec.x0 != null ? spec.x0 : 110, x1 = spec.x1 != null ? spec.x1 : 850, y = spec.y != null ? spec.y : 300;
      const xs = Array.from({ length: k }, (_, i) => x0 + (x1 - x0) * (i + 1) / (k + 1));
      const anchors = { start: { x: x0, y }, end: { x: x1, y } };
      xs.forEach((x, i) => { anchors['j:' + (i + 1)] = { x, y }; });
      return { geom: { layout: 'line', k, x0, x1, y, xs }, anchors, state: {} };
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
