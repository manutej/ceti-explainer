/* ════════════════════════════════════════════════════════════════════
   core/compile.js — Film.compile(plan) → { FEATURE, timeline }
   --------------------------------------------------------------------
   BUILD-SPEC §3. Pure and deterministic; runs in node (lint, gate) and in the
   page (where FEATURE.build/render are used by the feature engine unchanged).
     1 resolve   registry lookup, defaults, schema, @example refs
     2 window    t0[k+1] = t1[k] + XF (0.9 s cross-fade), phases → absolute times
     3 hand-over po_{k+1} = def_k.out(P_k, po_k)   (static; ctx.po is frozen)
     4 clock     per-instance clock map (seq | freeze)
     5 emit      FEATURE = { meta, chapters, captions, state, controls, build, render }
   Aspect (CHANNELS §3): Film.compile(plan, { aspect }) — '16x9' (default, the design basis, unchanged) ·
   '1x1' · '4x5' · '9x16'. The viewBox becomes 960 × lay.vh, the PO is re-laid (Layout.poSpec), every ctx
   carries ctx.lay (core/layout.js) and a LibKit for that layout. A module that declares aspects(P, po) → true
   composes itself in lay's regions; any other module is FIT: its 16:9 content box is scaled uniformly into
   lay.F (never letterboxed into the frame; its head is still laid out by the core) and the timeline marks it.
   Module windows fade in over 0.9 s; every module but the last fades out over
   0.9 s after its window. p5 layers register as P5Film.layer('<use>#<k>', …).
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const Module = root.Module, PO = root.PO, Clock = root.Clock;
  const XF = 0.9;
  const prog = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  function phaseTable(def, P, t0, dur) {
    const ph = def.phases(P), tot = ph.reduce((s, p) => s + p.f, 0);
    if (Math.abs(tot - 1) > 1e-6) throw new Error(def.name + ': phase fractions sum to ' + tot.toFixed(4) + ', not 1');
    let acc = 0;
    return ph.map(p => {
      const a = t0 + acc * dur; acc += p.f; const b = t0 + acc * dur, at = (x) => a + (x || 0);
      return {
        id: p.id, f: p.f, a, b, la: a - t0, lb: b - t0,
        introduces: p.introduces || [], still: !!(p.still || p.hold), hold: !!p.hold, payoff: !!p.payoff, skip: !!p.skip,
        marks: (p.marks || []).map(m => ({ term: m.term || m, t: at(m.at) })),
        labels: (p.labels || []).map(l => ({ term: l.term, t: at(l.at) })),
        cue: p.cue ? { target: p.cue.target, a: at(p.cue.at), b: at(p.cue.at) + (p.cue.dur || 0.8) } : null,
        names: (p.names || []).map(n => ({ term: n.term, principle: !!n.principle, t: at(n.at) })),
        shows: p.shows || [], own: p.own || '',
        payoffT: p.payoff ? a + (p.payoffAt != null ? p.payoffAt : b - a) : null,
      };
    });
  }

  /** resolve a module spec; combinators are expanded bottom-up into ordinary definitions (BUILD-SPEC §3.2) */
  function resolve(spec, example, path) {
    const def0 = Module.get(spec.use);
    const P = Module.fill(def0, spec.params, example);
    let refs = (P.__refs || []).slice();
    if (def0.kind !== 'combinator') return { def: def0, P, spec, refs };
    const slots = def0.slots || ['inner'];
    const inners = slots.map(sl => {
      if (!spec[sl] || !spec[sl].use) throw new Error(spec.use + ' (' + path + ') needs a module in "' + sl + '"');
      const r = resolve(spec[sl], example, path + '.' + sl); refs = refs.concat(r.refs); return r;
    });
    const R = { resolve: (sp, pth) => { const r = resolve(sp, example, path + '.' + (pth || 'x')); refs = refs.concat(r.refs); return r; } };
    const w = def0.wrap(inners, P, R);
    const def = Object.assign({ kind: 'wrapped', expertise: def0.expertise || 'novice', evidence: def0.evidence || '',
      controls: () => [], uses: () => [], out: (P2, po) => po }, w, { name: def0.name, combinator: def0.name, inners });
    ['duration', 'phases', 'numbers', 'audit', 'honesty', 'build', 'render'].forEach(k => { if (typeof def[k] !== 'function') throw new Error(def0.name + '.wrap() returned no ' + k + '()'); });
    return { def, P, spec, refs };
  }

  function compile(plan, opts) {
    opts = opts || {};
    const meta = plan.meta || {};
    const Layout = root.Layout, lay = Layout.make(opts.aspect || plan.__aspect || '16x9'), lay16 = lay.wide ? lay : Layout.make('16x9');
    let t = plan.lead != null ? plan.lead : 0.5;
    let po = PO.create(Layout.poSpec(plan.po, lay));
    const insts = [];
    (plan.modules || []).forEach((m, k) => {
      const res = resolve(m, plan.example, m.use + '#' + k), def = res.def, P = res.P;
      const base = def.duration(P), dur = base + Clock.extra(m.clock);
      const t0 = m.at != null ? Math.max(t, m.at) : t;
      const phases = phaseTable(def, P, t0, base);
      const numbers = def.numbers(P);
      const inst = { k, use: m.use, def, P, t0, dur, t1: t0 + dur, phases, head: m.head || null, captions: m.captions || {},
        poIn: po, clock: Clock.fromSpec(m.clock), numbers, refs: res.refs };
      inst.fit = !lay.wide && !(def.aspects && def.aspects(P, po));
      inst.poOut = def.out(P, po);
      po = inst.poOut;
      insts.push(inst);
      t = inst.t1 + XF;
    });
    const last = insts[insts.length - 1];
    const dur = +((last ? last.t1 : 0) + (plan.tail != null ? plan.tail : 1.0)).toFixed(3);

    /* captions: one slot per captioned phase, until the next one or the window's end */
    const captions = [];
    insts.forEach(inst => {
      const slots = inst.phases.filter(p => inst.captions[p.id]);
      slots.forEach((p, i) => captions.push([+p.a.toFixed(2), +(i + 1 < slots.length ? slots[i + 1].a : inst.t1).toFixed(2), inst.captions[p.id]]));
    });
    const chapters = insts.map((i, n) => [i.t0, (i.head && i.head.chapter) || (i.head && i.head.title) || i.use, String(n + 1).padStart(2, '0')]);

    /* controls, namespaced k.key, each jumping to its phase */
    const state = {}, controls = [];
    insts.forEach(inst => (inst.def.controls(inst.P) || []).forEach(c => {
      const key = inst.k + '.' + c.key, ph = inst.phases.find(p => p.id === c.jumpPhase) || inst.phases[0];
      state[key] = c.default;
      controls.push(Object.assign({}, c, { key, label: c.label, hint: c.question, jump: +(ph.a + 0.05).toFixed(2),
        result: c.result ? (st) => c.result(st[key], st) : undefined }));
    }));

    /* page gates (BUILD-SPEC §3.7): a combinator may ask the page to wait for a commit */
    const gates = [];
    insts.forEach(inst => (inst.def.gates ? inst.def.gates(inst.P) : []).forEach(g => {
      const ph = inst.phases.find(p => p.id === g.phase); if (!ph) throw new Error(inst.use + ': gate on unknown phase ' + g.phase);
      gates.push(Object.assign({}, g, { t: +(ph.a + (g.at || 0.05)).toFixed(2), key: inst.k + '.' + g.key }));
    }));

    /* audits */
    const audits = insts.map(inst => { const a = inst.def.audit(inst.P) || { ok: false, msg: 'no audit result' }; return { k: inst.k, use: inst.use, ok: !!a.ok, msg: a.msg || '', note: a.note || '' }; });
    captions.forEach((c, i) => { if (c[2].length > 90) audits.push({ k: -1, use: 'captions', ok: false, msg: 'caption ' + i + ' is ' + c[2].length + ' chars > 90' }); });

    const firstPay = insts.flatMap(i => i.phases).find(p => p.payoffT != null);
    /* fit (a module without a composition for this aspect): its 16:9 content box y 96–510 scaled into lay.F */
    const FIT = (() => { const F = lay.F, s = Math.min(F.w / 960, F.h / 414); return { s, tx: F.x0 + (F.w - 960 * s) / 2, ty: F.y0 + (F.h - 414 * s) / 2 - 96 * s }; })();
    const timeline = {
      dur, xf: XF, meta, aspect: lay.id, vh: lay.vh, type: plan.type || {}, roles: plan.roles || {}, example: plan.example || {}, given: plan.given || {},
      po: { id: plan.po.id, kind: plan.po.kind },
      instances: insts.map(inst => ({
        k: inst.k, use: inst.use, kind: inst.def.kind, t0: inst.t0, t1: inst.t1, dur: inst.dur, types: inst.def.types,
        needs: inst.def.ports.needs, gives: inst.def.ports.gives, consumes: inst.def.ports.consumes,
        poAccepts: inst.def.ports.po.in, poOutMode: inst.def.ports.po.out || 'same',
        poIn: { id: inst.poIn.id, kind: inst.poIn.kind }, poOut: { id: inst.poOut.id, kind: inst.poOut.kind },
        phases: inst.phases, payoffT: (inst.phases.find(p => p.payoffT != null) || {}).payoffT,
        honesty: inst.def.honesty(inst.P) || [], numbers: Object.keys(inst.numbers), uses: inst.def.uses(inst.P) || [],
        refs: inst.refs, combinator: inst.def.combinator || null, fit: inst.fit, expertise: inst.def.expertise || 'novice', costMs: (inst.def.p5Layer && inst.def.p5Layer.costMs) || 0,
        question: inst.def.question ? inst.def.question(inst.P) : null,
        evidence: inst.def.evidence || '',
      })),
      audits,
    };

    const FEATURE = {
      meta: Object.assign({ vw: 960, vh: 540 }, meta, { vw: 960, vh: lay.vh, aspect: lay.id, id: meta.id || 'plan', title: meta.title || 'Untitled', dur,
        poster: meta.poster != null ? meta.poster : (firstPay ? +(firstPay.payoffT + 0.4).toFixed(2) : 0) }),
      chapters, captions, state, controls, timeline, gates,
      build(svg, ectx) {
        const chrome = (root.document && document.documentElement.dataset.chrome) || meta.chrome || 'dark';
        const K = root.LibKit.create(chrome, lay); K.bind(ectx); K.readTokens(); K.installStyle(svg);
        const K16 = lay.wide ? K : root.LibKit.create(chrome, lay16); if (K16 !== K) { K16.bind(ectx); K16.readTokens(); }
        const roles = root.Roles.make(plan.roles || {}, chrome);
        FEATURE.__K = K; FEATURE.__K16 = K16;
        /** a module context: one per instance, and one per child of a combinator (ctx.sub) */
        function makeCtx(o) {
          const regions = {}, ph = {}; o.phases.forEach(p => { ph[p.id] = [p.la, p.lb]; });
          const KK = o.fit ? K16 : (o.K || K), LL = o.fit ? lay16 : (o.lay || lay);
          let fitG = null;   // FIT modules draw every region but the head under one uniform transform into lay.F
          const host = (region) => { if (!o.fit || region === 'head') return o.g; if (!fitG) fitG = KK.el('g', { 'data-fit': lay.id, transform: 'translate(' + FIT.tx.toFixed(2) + ' ' + FIT.ty.toFixed(2) + ') scale(' + FIT.s.toFixed(4) + ')' }, o.g); return fitG; };
          const termT = (list) => { const r = {}; o.phases.forEach(p => p[list].forEach(x => { if (r[x.term] == null) r[x.term] = x.t - o.t0; })); return r; };
          const labelT = termT('labels'), markT = termT('marks'), nameT = termT('names');
          const cues = o.phases.filter(p => p.cue).map(p => ({ target: p.cue.target, a: p.cue.a - o.t0, b: p.cue.b - o.t0 }));
          const ctx = {
            k: o.k, name: o.name, P: o.P, po: o.po, K: KK, lay: LL, fit: !!o.fit, roles, chrome, ex: ectx.ex, E: ectx.ex.ease, rm: ectx.rm,
            hasP5: !!root.P5Film, T: ph, dur: o.def.duration(o.P), numbers: o.numbers, state: ectx.state, t: 0, vis: 0, g: o.g,
            role: (v) => roles.of(v), base: (n) => roles.base(n),
            ctl(key, dflt) { const v = this.state[o.k + '.' + key]; return v === undefined ? dflt : v; },
            /** progress through phase id (0..1) at the current local time */
            p(id) { const w = ph[id]; if (!w) throw new Error(o.name + ': no phase ' + id); return prog(this.t, w[0], w[1]); },
            /** eased progress over local [a, a+d]; reduced motion → a step at the end */
            go(a, d, e) { if (this.rm) return this.t >= a + d ? 1 : 0; return (this.E[e || 'glaser'])(prog(this.t, a, a + d)); },
            label: (term) => { if (labelT[term] == null) throw new Error(o.name + ': label "' + term + '" is not declared in phases()'); return labelT[term]; },
            mark: (term) => { if (markT[term] == null) throw new Error(o.name + ': mark "' + term + '" is not declared'); return markT[term]; },
            named: (term) => { if (nameT[term] == null) throw new Error(o.name + ': name "' + term + '" is not declared'); return nameT[term]; },
            cue: (target) => cues.find(c => c.target === target) || null,
            root(region) { if (!regions[region]) regions[region] = KK.el('g', { 'data-region': region }, host(region)); return regions[region]; },
            rng: (name) => root.SceneKit.mulberry(hash((meta.id || 'plan') + ':' + o.k + ':' + (o.seed || '') + name)),
            /** a child context for an inner module of a combinator: own group, own phase table (local), own numbers.
                opts: { parent (svg g), po (a PO patch of the same id), seed (children with one seed draw identical marks),
                        lay (a sub-layout: contrast halves at a portrait aspect) } */
            sub(key, inner, opts) {
              opts = opts || {};
              const g2 = KK.el('g', { 'data-sub': o.name + '/' + key }, opts.parent || (o.fit ? host('body') : o.g));
              const D = inner.def.duration(inner.P);
              return makeCtx({ k: o.k, name: o.name + '/' + key, def: inner.def, P: inner.P, po: opts.po || o.po, g: g2, K: KK, lay: opts.lay || LL, fit: false,
                phases: phaseTable(inner.def, inner.P, 0, D), t0: 0, numbers: inner.def.numbers(inner.P), seed: (o.seed || '') + (opts.seed != null ? opts.seed : key) + '/' });
            },
          };
          return ctx;
        }
        insts.forEach(inst => {
          const g = K.el('g', { 'data-module': inst.use + '#' + inst.k, opacity: 0 }, svg);
          inst.g = g;
          const ctx = inst.ctx = makeCtx({ k: inst.k, name: inst.use, def: inst.def, P: inst.P, po: inst.poIn, g, phases: inst.phases, t0: inst.t0, numbers: inst.numbers, seed: '', fit: inst.fit });
          if (inst.head) inst.headObj = K.head(ctx.root('head'), inst.head.eyebrow || '', inst.head.title || '');
          inst.def.build(svg, ctx, inst.P);
        });
        if (root.Gates) root.Gates.install(FEATURE);
      },
      render(t, ectx) {
        const K = FEATURE.__K; K.bind(ectx); if (FEATURE.__K16 !== K) FEATURE.__K16.bind(ectx);
        insts.forEach((inst, i) => {
          const vis = visOf(inst, i, t);
          K.show(inst.g, vis);
          const ctx = inst.ctx; ctx.vis = vis; ctx.state = ectx.state; ctx.rm = ectx.rm;
          if (vis <= 0) return;
          ctx.t = inst.clock(Math.max(0, Math.min(inst.dur, t - inst.t0)));
          if (inst.headObj) inst.headObj.set(ctx.t, 0.1);
          inst.def.render(ctx.t, ctx, inst.P);
        });
      },
    };
    function visOf(inst, i, t) {
      if (t < inst.t0) return 0;
      const fin = prog(t, inst.t0, inst.t0 + XF);
      return i === insts.length - 1 ? fin : fin * (1 - prog(t, inst.t1, inst.t1 + XF));
    }

    /* p5 layers: one per instance, on the same clock, drawn in local time */
    if (root.P5Film) insts.forEach((inst, i) => {
      const L5 = inst.def.p5Layer; if (!L5) return;
      root.P5Film.layer(inst.use + '#' + inst.k, {
        z: L5.z != null ? L5.z : 6,
        setup(p, L) { return L5.setup ? L5.setup(p, L, inst.ctx, inst.P) : null; },
        draw(p, t, L) {
          root.SceneKit.touch(L.ctx);
          const vis = visOf(inst, i, t); if (vis <= 0 || !inst.ctx) return;
          const lt = inst.clock(Math.max(0, Math.min(inst.dur, t - inst.t0)));
          L.ctx.globalAlpha = vis;
          if (inst.fit) { L.ctx.save(); L.ctx.translate(FIT.tx, FIT.ty); L.ctx.scale(FIT.s, FIT.s); }
          L5.draw(p, lt, L, inst.ctx, inst.P);
          if (inst.fit) L.ctx.restore();
          L.ctx.globalAlpha = 1;
        },
      });
    });

    root.__AUDIT = { ok: audits.every(a => a.ok), msg: audits.filter(a => !a.ok).map(a => a.use + ': ' + a.msg).join('; '), note: audits.map(a => a.note).filter(Boolean).join(' · ') };
    return { FEATURE, timeline };
  }

  const Film = { compile, XF };
  root.Film = Film;
  if (typeof module !== 'undefined' && module.exports) module.exports = Film;
})(typeof window !== 'undefined' ? window : globalThis);
