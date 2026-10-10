/* ════════════════════════════════════════════════════════════════════
   core/wrap.js — the helpers every combinator uses (BUILD-SPEC §2 "Combinators")
   --------------------------------------------------------------------
   A combinator's wrap(inners, P, R) returns an ordinary definition whose phases
   are a SECONDS list mixing the inner's own phases (kept whole, ids prefixed) and
   the wrapper's phases. The inner's clock is derived from that list:
     inner phase  → the inner runs (rate = its seconds ÷ the listed seconds)
     own phase    → the inner is frozen at the time it had reached (Clock.freeze)
   Freezes only ever sit on inner phase BOUNDARIES, so no inner phase is split and
   every mark/label/cue offset keeps its meaning (L4, L8 stay checkable).

     W.secs(def, P)                 → [{…phase, s}]   (seconds, from the fractions)
     W.nest(prefix, list, pace)     → inner phases: ids/own/shows prefixed, inner:true, time scaled by 1/pace
                                      (a declared hold keeps ≥ 2 s: L9 is per owner)
     W.fractions(list)              → phases(P) output (f = s / Σs)
     W.total(list)                  → Σs
     W.clock(list, it0)             → lt ↦ inner lt   (piecewise: run at rate, or freeze; starts at it0)
     W.startOf(list, id) / W.endOf  → seconds
     W.numbers(prefix, nums)        → prefixed number fns (L7 ids of nested phases)
     W.read(nums, spec)             → a scalar read off a module's canonical numbers:
                                      {fn, args?, key?, scale?} or {fn, ratio:{top:[i], of:[i]}, scale?}
     W.union(a, b) / W.inter(a, b)  set helpers for ports and types
     W.step(kid, lt, ctx)           sync a child ctx to the parent before its render
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const W = {};
  const scaleAt = (o, k) => (o == null ? o : Object.assign({}, o, o.at != null ? { at: o.at * k } : {}, o.dur != null ? { dur: o.dur * k } : {}));
  W.secs = (def, P) => { const D = def.duration(P); return def.phases(P).map(p => Object.assign({}, p, { s: p.f * D })); };
  W.nest = (prefix, list, pace) => list.map(p => {
    pace = pace || 1;
    const s = p.hold ? Math.max(2, p.s / pace) : p.s / pace, k = s / p.s;
    const q = Object.assign({}, p, {
      id: prefix + p.id, own: prefix + (p.own || ''), inner: true, rate: p.s / s, s,
      shows: (p.shows || []).map(x => prefix + x),
      marks: (p.marks || []).map(m => scaleAt(typeof m === 'string' ? { term: m } : m, k)),
      labels: (p.labels || []).map(l => scaleAt(l, k)), names: (p.names || []).map(n => scaleAt(n, k)),
      cue: p.cue ? scaleAt(p.cue, k) : undefined,
    });
    if (p.payoffAt != null) q.payoffAt = p.payoffAt * k;
    delete q.f;
    return q;
  });
  W.total = (list) => list.reduce((a, p) => a + p.s, 0);
  W.fractions = (list) => { const D = W.total(list); return list.map(p => { const q = Object.assign({}, p, { f: p.s / D }); delete q.s; return q; }); };
  W.startOf = (list, id) => { let a = 0; for (const p of list) { if (p.id === id) return a; a += p.s; } throw new Error('wrap: no phase ' + id); };
  W.endOf = (list, id) => W.startOf(list, id) + list.find(p => p.id === id).s;
  /** the inner's clock: inner phases advance it (at their rate), own phases freeze it */
  W.clock = (list, it0) => {
    const segs = []; let a = 0, it = it0 || 0;
    list.forEach(p => { segs.push({ a, b: a + p.s, it, rate: p.inner ? (p.rate || 1) : 0 }); a += p.s; if (p.inner) it += p.s * (p.rate || 1); });
    const end = it;
    return (lt) => {
      for (const g of segs) if (lt < g.b) return Math.max(0, g.it + (lt - g.a) * g.rate);
      return end;
    };
  };
  W.numbers = (prefix, nums) => { const o = {}; Object.keys(nums).forEach(k => { o[prefix + k] = nums[k]; }); return o; };
  W.read = (nums, spec) => {
    spec = spec || {};
    const f = nums[spec.fn || 'answer'];
    if (typeof f !== 'function') return { value: NaN, msg: 'no number fn "' + (spec.fn || 'answer') + '"' };
    const sc = spec.scale != null ? spec.scale : 1;
    if (spec.ratio) {
      const sum = (ix) => ix.reduce((a, i) => a + f(i), 0), top = sum(spec.ratio.top), of = sum(spec.ratio.of);
      return { value: of ? sc * top / of : NaN, top, of };
    }
    let v = f.apply(null, spec.args || []);
    if (spec.key) v = v == null ? undefined : v[spec.key];
    return { value: typeof v === 'number' ? v * sc : NaN };
  };
  W.union = (a, b) => [...new Set([].concat(a || [], b || []))];
  W.inter = (a, b) => (a || []).filter(x => (b || []).includes(x));
  W.step = (kid, lt, ctx) => { kid.t = lt; kid.state = ctx.state; kid.rm = ctx.rm; kid.vis = ctx.vis; kid.ex = ctx.ex; kid.E = ctx.E; return kid; };
  /** first payoff phase of a seconds list (index) */
  W.payoffIndex = (list) => list.findIndex(p => p.payoff);
  /** compose controls of an inner: jumpPhase re-pointed at the nested id */
  W.controls = (prefix, def, P) => (def.controls(P) || []).map(c => Object.assign({}, c, { jumpPhase: prefix + c.jumpPhase }));
  root.Wrap = W;
  if (typeof module !== 'undefined' && module.exports) module.exports = W;
})(typeof window !== 'undefined' ? window : globalThis);
