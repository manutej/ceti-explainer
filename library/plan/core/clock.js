/* ════════════════════════════════════════════════════════════════════
   core/clock.js — clock maps (BUILD-SPEC §3.5). Pure functions lt → lt'.
   --------------------------------------------------------------------
     seq()            identity inside a window
     freeze(a, F)     hold local time at a for F seconds (CPR splice):
                      lt' = lt < a ? lt : (lt < a+F ? a : lt − F)
     parallel()       both halves of a split read the same lt (identity)
     compose(f, g)    (f ∘ g)(lt) = f(g(lt)) — associative, so regrouping a chain never changes a frame
     fromSpec(spec)   {freeze:[a,F]} | [{freeze:…}, …] | null → map
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const seq = () => (lt) => lt;
  const parallel = seq;
  const freeze = (a, F) => (lt) => (lt < a ? lt : (lt < a + F ? a : lt - F));
  const compose = (f, g) => (lt) => f(g(lt));
  function fromSpec(spec) {
    if (!spec) return seq();
    const list = Array.isArray(spec) ? spec : [spec];
    return list.map(s => (s.freeze ? freeze(s.freeze[0], s.freeze[1]) : seq())).reduce((acc, m) => compose(m, acc), seq());
  }
  /** extra seconds a spec adds to a module's window */
  const extra = (spec) => (!spec ? 0 : (Array.isArray(spec) ? spec : [spec]).reduce((s, x) => s + (x.freeze ? x.freeze[1] : 0), 0));
  const Clock = { seq, parallel, freeze, compose, fromSpec, extra };
  root.Clock = Clock;
  if (typeof module !== 'undefined' && module.exports) module.exports = Clock;
})(typeof window !== 'undefined' ? window : globalThis);
