/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   compose.js — AM.compose(graph, materialId, meta) → Atelier.film(def)

   A beat graph is JSON: { id, concept:{claim, audience, level}, params:{N,k,p,c,retry,seed}, waivers:[{law,reason}],
   nodes:[{id, module, params?, in?:{port:"node.port"}, at?: number | "node.start+x" | "node.end", dur?}] }.
   The composer (1) instantiates the operad view of the registry, (2) checks the graph with laws.js — hard laws
   throw a readable Error before any frame exists, soft [inf] laws warn unless waived, (3) scans every module,
   camera and material function for clock reads (CLOCK) and pedagogy/camera code for raw drawing (HOUSE),
   (4) wires typed ports lazily and per seed (score/meta run before setup), (5) installs the belief + legibility
   guards around the one Material, and (6) emits a film whose draw is: camera → Material.begin → the current
   stage beat → live overlays → Material.end.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM, LAWS = root.AMLaws;

  /** the operad view of the registry: what laws.js needs, nothing executable */
  AM.operad = function (graph) {
    const P = (graph && graph.params) || {};
    const mods = {}, cams = {}, mats = {};
    for (const [id, m] of Object.entries(AM.modules)) mods[id] = { structure: m.structure, stage: m.stage, cls: m.cls, grade: m.grade, layer: m.layer, levels: m.levels, in: m.in, out: m.out, reveals: m.reveals || [], commits: m.commits || [], chapter: m.chapter, durDefault: typeof m.dur === 'function' ? m.dur(P) : m.dur, doc: m.doc, evidence: m.evidence };
    for (const [id, c] of Object.entries(AM.cameras)) cams[id] = { structure: 'CAM', cls: 'camera', layer: 'camera', in: c.in, out: c.out, durDefault: typeof c.dur === 'function' ? c.dur({}) : c.dur, doc: c.doc };
    for (const [id, m] of Object.entries(AM.materials)) mats[id] = { title: m.title, source: m.source, axis: m.axis, cell: m.cell, nRange: m.nRange, ground: m.ground, markRule: m.markRule, nouns: m.nouns };
    return { version: AM.VERSION, types: AM.TYPES, modules: mods, cameras: cams, materials: mats, laws: LAWS.LAWS };
  };

  /** static scans (CLOCK everywhere; HOUSE on pedagogy, helpers and cameras) */
  function scanAll(usedModules, usedCameras, M) {
    const out = [], src = o => Object.values(o).filter(v => typeof v === 'function').map(f => f.toString()).join('\n');
    for (const id of usedModules) out.push(...LAWS.scanSource(id, src(AM.modules[id]), 'module'));
    out.push(...LAWS.scanSource('AM.P (pedagogy helpers)', src(AM.P), 'module'));
    for (const id of usedCameras) out.push(...LAWS.scanSource(id, src(AM.cameras[id]), 'camera'));
    out.push(...LAWS.scanSource(M.id, src(M), 'material'));
    return out;
  }

  /** format a typed Number for the screen: "expected", never "exact ±" (PEDAGOGY-CRIT defect 2) */
  function formatNumber(n, o) {
    const show = o.show || 'realised', d = o.decimals || 0;
    let s;
    if (show === 'expected') s = `expected ${AM.fmt(n.exact, Math.abs(n.exact % 1) > 1e-9 ? 1 : 0)}` + (n.sd ? ` ± ${AM.fmt(2 * n.sd)}` : '');
    else {
      const v = show === 'exact' ? n.exact : n.realised, base = AM.fmt(v, d);
      s = o.format ? o.format(base) : n.N && show === 'realised' ? `${base} of ${AM.fmt(n.N)}` : base;
    }
    return n.source === 'sketch' ? s + ' (sketch)' : s;
  }

  /** the one Material, wrapped in the belief + legibility guards */
  function guard(M) {
    const G = Object.create(M);
    G.text = (S, str, x, y, o = {}) => { AM.guardText(str, o, M.id); return M.text(S, str, x, y, o); };
    G.num = (S, n, x, y, o = {}) => {
      if (!AM.isNumber(n)) throw new Error(`belief law (${M.id}): M.num() was given ${typeof n} — results must be AM.Number({q, realised|exact, source})`);
      const str = formatNumber(n, o), oo = Object.assign({ role: 'num' }, o, { str, fromNumber: true });
      AM.guardText(str, oo, M.id); return M.num(S, n, x, y, oo);
    };
    return G;
  }

  AM.compose = function (graph, materialId, meta = {}) {
    const M = AM.materials[materialId];
    if (!M) throw new Error(`compose: unknown material "${materialId}". Known: ${Object.keys(AM.materials).join(', ')}`);
    const P0 = Object.assign({ N: 1000, k: 20, p: 0.95, c: 0.8, retry: 1, seed: 1 }, graph.params || {});
    const g = JSON.parse(JSON.stringify(graph)); g.params = P0;
    // durations from the modules (node params override)
    for (const n of g.nodes) {
      const def = AM.modules[n.module] || AM.cameras[n.module]; if (!def || n.dur != null) continue;
      const P = Object.assign({}, P0, n.params || {}); n.dur = typeof def.dur === 'function' ? def.dur(P) : def.dur;
    }
    const op = AM.operad(g);
    const alts = Object.values(AM.materials).filter(m => P0.N >= m.nRange[0] && P0.N <= m.nRange[1]).map(m => m.id).join(', ');
    const R = LAWS.checkGraph(g, op, { material: M, alternatives: alts ? 'fits: ' + alts : '' });
    const usedM = [...new Set(g.nodes.filter(n => AM.modules[n.module]).map(n => n.module))], usedC = [...new Set(g.nodes.filter(n => AM.cameras[n.module]).map(n => n.module))];
    const scan = scanAll(usedM, usedC, M);
    const hard = R.errors.concat(scan);
    if (hard.length) throw new Error('compose: the beat graph breaks ' + hard.length + ' law(s):\n' + hard.map(e => `  [${e.law}] ${e.msg}`).join('\n'));
    for (const w of R.warnings) console.warn(`[compose] soft law ${w.law}: ${w.msg}`);
    const S = R.schedule, byId = Object.fromEntries(S.map(s => [s.id, s])), nodeOf = Object.fromEntries(g.nodes.map(n => [n.id, n]));
    const duration = Math.max(...S.map(s => s.end)) + (g.tail ?? 1.2);
    const Mg = guard(M);

    /* lazy, per-seed build: wires typed ports in schedule order */
    const cache = new Map();
    function ensure(ctx) {
      let B = cache.get(ctx.seed); if (B) return B;
      B = { outs: {}, self: {} };
      for (const s of S) {
        const n = nodeOf[s.id], def = AM.modules[n.module] || AM.cameras[n.module], ins = {};
        for (const [port, wire] of Object.entries(n.in || {})) { const [src, sp] = wire.split('.'); ins[port] = B.outs[src][sp]; }
        const P = Object.assign({}, P0, n.params || {}, { dur: s.dur });
        const r = def.build ? def.build(P, ins, ctx, Mg, g) : { out: {}, self: {} };
        B.outs[s.id] = r.out || {}; B.self[s.id] = r.self || {}; B.self[s.id].__P = P;
      }
      cache.set(ctx.seed, B); return B;
    }
    const nodes = S.map(s => ({ s, n: nodeOf[s.id], def: AM.modules[nodeOf[s.id].module] || AM.cameras[nodeOf[s.id].module] }));
    const stages = nodes.filter(x => x.s.layer === 'stage'), overlays = nodes.filter(x => x.s.layer === 'overlay'), cams = nodes.filter(x => x.s.layer === 'camera');

    function camAt(t, B) {
      let cur = null; for (const c of cams) if (c.s.start <= t) cur = c;
      if (!cur) return AM.cam.I;
      return cur.def.shot(Math.min(t - cur.s.start, cur.s.dur), B.self[cur.s.id], cur.s.dur);
    }
    function mixAt(t, B) { let m = null; for (const c of cams) if (c.def.mix && c.s.start <= t) m = c; return m ? m.def.mix(Math.min(t - m.s.start, m.s.dur), B.self[m.s.id], m.s.dur) : 0; }

    /* controls + state defaults (commit beats hold the live page; the film uses the labelled sample) */
    const controls = [], state = {};
    const tmpCtx = { seed: P0.seed, engine: null, mode: 'film', size: { k: 1 } };
    const B0 = ensure(Object.assign(tmpCtx, { engine: root.Atelier.AgentLoop({ N: P0.N, k: P0.k, p: P0.p, c: P0.c, retry: P0.retry, seed: P0.seed }) }));
    cache.clear();
    for (const x of nodes) if (x.def.controls) for (const c of x.def.controls(B0.self[x.s.id], B0.self[x.s.id].__P, x.s.start, x.s.end)) {
      const cc = Object.assign({}, c); if (cc.default !== undefined) { state[cc.key] = cc.default; delete cc.default; } controls.push(cc);
    }
    /* captions: clipped to their node, ordered, overlaps trimmed */
    let caps = [];
    for (const x of nodes) if (x.def.captions) for (const c of x.def.captions(B0.self[x.s.id], B0.self[x.s.id].__P)) caps.push({ t0: x.s.start + c.t0, t1: Math.min(x.s.start + c.t1, x.s.layer === 'stage' ? duration : x.s.end), text: c.text });
    caps = caps.filter(c => c.t1 > c.t0).sort((a, b) => a.t0 - b.t0);
    for (let i = 0; i < caps.length - 1; i++) caps[i].t1 = Math.min(caps[i].t1, caps[i + 1].t0);
    caps = caps.filter(c => c.t1 - c.t0 > 0.3);
    for (const c of caps) if (c.text.length > 90) throw new Error(`compose: caption over 90 characters (${c.text.length}): "${c.text}"`);
    const chapters = nodes.filter(x => (x.s.layer === 'stage' || x.s.layer === 'overlay') && x.def.chapter).map(x => ({ t: +x.s.start.toFixed(2), label: x.def.chapter }));

    const def = {
      id: meta.id || `${g.id}-${M.id}`, title: meta.title || g.id, direction: `Module library · ${M.title}`, level: (g.concept && g.concept.level) || 'grasp',
      duration: +duration.toFixed(2), size: [960, 540], renderer: 'p2d', fps: 30, seed: P0.seed, ground: M.ground,
      chapters, captions: caps, state, controls, fonts: [],
      engine: ctx => root.Atelier.AgentLoop({ N: P0.N, k: P0.k, p: P0.p, c: P0.c, retry: P0.retry, seed: ctx.seed }),
      setup(p, ctx) { if (M.setup) M.setup(p, ctx); ensure(ctx); },
      draw(p, t, ctx) {
        const B = ensure(ctx), cam = camAt(t, B), mix = mixAt(t, B), Sx = M.begin(p, ctx, t, cam);
        let st = null; for (const x of stages) if (x.s.start <= t) st = x;
        const run = x => x.def.draw({ M: Mg, S: Sx, ctx, t, u: t - x.s.start, dur: x.s.dur, self: B.self[x.s.id], P: B.self[x.s.id].__P, cam, mix, node: x.s });
        if (st) run(st);
        for (const x of overlays) if (x.s.start <= t && t < x.s.end + (x.n.linger ?? 0)) run(x);
        M.end(p, Sx);
      },
      score(ctx) {
        const B = ensure(ctx), ev = [];
        for (const x of nodes) if (x.def.score) for (const e of x.def.score(B.self[x.s.id], B.self[x.s.id].__P)) { const v = AM.voice(M, Object.assign({}, e, { t: x.s.start + e.t })); if (v && v.t <= duration) ev.push(v); }
        return ev;
      },
      meta(ctx) {
        const B = ensure(ctx), rows = [];
        for (const x of nodes) if (x.def.meta) rows.push(...x.def.meta(B.self[x.s.id], B.self[x.s.id].__P));
        return rows;
      },
    };
    const api = root.Atelier.film(def);
    /* evidence rows (PEDAGOGY-MAP §5): derived from state + engine, on device, nothing stored or sent */
    api.evidence = () => {
      const ctxSeed = (api.info && api.info().seed) || P0.seed, st = api.state(), rows = [];
      const B = cache.get(ctxSeed); if (!B) return rows;
      for (const x of nodes) {
        if (!x.def.evidence) continue;
        const self = B.self[x.s.id], out = B.outs[x.s.id], key = out.commit && out.commit.key;
        const truthNode = nodes.find(y => B.outs[y.s.id] && B.outs[y.s.id].n && out.commit && B.outs[y.s.id].n.q === out.commit.q) || x;
        const n = B.outs[truthNode.s.id] && B.outs[truthNode.s.id].n;
        const value = key != null ? st[key] : null, truth = n ? (n.realised ?? n.exact) : null;
        rows.push({ film_id: def.id, build_hash: AM.VERSION, seed: ctxSeed, level: def.level, structure_id: x.def.evidence.structure_id, item_id: x.s.id, claim_id: (g.concept && g.concept.claimId) || g.id,
          t_commit: x.s.end, value, conf: null, truth, expected: n ? n.exact : null, signed_error: value != null && truth != null ? value - truth : null, committed: key != null ? !!st[key + '$committed'] : null,
          lever: st[(key || '') + 'Lever'] ?? null, model_consistent: x.def.structure === 'TRF' ? (st[(key || '') + 'Lever'] != null) : null, skipped: null });
      }
      return rows;
    };
    root.__atelierEvidence = api.evidence;
    api.laws = { warnings: R.warnings, waived: R.waived, schedule: S.map(s => ({ id: s.id, module: s.module, start: +s.start.toFixed(2), end: +s.end.toFixed(2), layer: s.layer })) };
    return api;
  };
})(typeof window !== 'undefined' ? window : globalThis);
