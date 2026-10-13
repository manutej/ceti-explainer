/* ════════════════════════════════════════════════════════════════════
   core/po/po.js — persistent-object registry (L2: one PO per film)
   --------------------------------------------------------------------
     PO.kind(name, { create(spec) → {geom, anchors, state}, ...helpers })
     PO.create(spec)  → frozen { kind, id, geom, anchors, state }  (pure; node + page)
     PO.with(po, statePatch) → a new frozen PO with the same id (module out())
   Geometry is in viewBox units (960 × 540 at 16:9; 960 × H at the other aspects — core/layout.js).
     PO.refit(po, specPatch) → the same object re-laid (contrast halves at a portrait aspect). Renderers (SVG helpers) live on
   the kind object and are only called from a module's build/render.
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const KINDS = {};
  const deepFreeze = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); Object.values(o).forEach(deepFreeze); } return o; };
  function kind(name, def) { KINDS[name] = def; return def; }
  function get(name) { if (!KINDS[name]) throw new Error('PO kind "' + name + '" is not implemented (have: ' + Object.keys(KINDS).join(', ') + ')'); return KINDS[name]; }
  function create(spec) {
    if (!spec || !spec.kind || !spec.id) throw new Error('plan.po needs {kind, id}');
    const k = get(spec.kind), made = k.create(spec);
    return deepFreeze({ kind: spec.kind, id: spec.id, spec, geom: made.geom || {}, anchors: made.anchors || {}, state: made.state || {} });
  }
  function withState(po, patch) { return deepFreeze(Object.assign({}, po, { state: Object.assign({}, po.state, patch) })); }
  /** the same object (same id, same state) laid out again: a spec patch → new geom + anchors (CHANNELS §3.3: "the anchors move") */
  function refit(po, specPatch) {
    const spec = Object.assign({}, po.spec, specPatch), made = get(po.kind).create(spec);
    return deepFreeze({ kind: po.kind, id: po.id, spec, geom: made.geom || {}, anchors: made.anchors || {}, state: po.state });
  }
  const PO = { kind, get, create, with: withState, refit, KINDS };
  root.PO = PO;
  if (typeof module !== 'undefined' && module.exports) module.exports = PO;
})(typeof window !== 'undefined' ? window : globalThis);
