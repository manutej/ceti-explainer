/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   laws.js — the composition laws of the Atelier module operad, as one pure function shared by the composer
   (browser, compose.js) and the lint (node, check.mjs).

     AMLaws.schedule(graph, operad)          → [{id, module, start, end, layer, ...}] (resolves "at" expressions)
     AMLaws.checkGraph(graph, operad, opts)  → {errors, warnings, waived, schedule}
     AMLaws.scanSource(name, src, kind)      → static findings (clock purity; pedagogy/camera never draw)
     AMLaws.LAWS                             → the law table (id, grade, hard, source) — exported into operad.json

   Hard laws throw at build (compose.js) / exit 1 (check.mjs). Soft laws are the PEDAGOGY-MAP's [inf] rules: they
   warn, and a graph may carry a written waiver {law, reason} that turns the warning into a recorded "waived".
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root, factory) {
  const L = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = L;
  root.AMLaws = L;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const LAWS = [
    { id: 'TYPE', hard: true, grade: '—', src: 'studio operad §4.1 (typing)', text: 'every input port is wired to an output port of the same type; required ports are wired' },
    { id: 'SEED', hard: true, grade: 'C', src: 'AD-v1 §0.2; PEDAGOGY-MAP §4.7', text: 'twin worlds and their ensemble come from the same engine node (same seed, common random numbers)' },
    { id: 'P1', hard: true, grade: 'B', src: 'PEDAGOGY-MAP §4.1 (L1-F, CRIT-d9)', text: 'PCR ▷ REVEAL: no number of a committed family is shown before that commit closes' },
    { id: 'P2', hard: true, grade: 'A', src: 'PEDAGOGY-MAP §4.2 (L1-K, L3§3)', text: 'ENS ▷ NF ▷ percentage: counts after an ensemble; a percentage only after its count' },
    { id: 'P3', hard: true, grade: 'B', src: 'PEDAGOGY-MAP §4.3 (L1-C)', text: 'CF: concrete ▷ morph ▷ schematic, never reversed, before the first ensemble' },
    { id: 'P4', hard: true, grade: 'A', src: 'PEDAGOGY-MAP §4.4 (L1-B)', text: 'WE: FULL ▷ GAP1 ▷ TWO-GAPS ▷ INV/RET on the same procedure' },
    { id: 'P7', hard: true, grade: 'C', src: 'PEDAGOGY-MAP §4.7 (CRIT§1)', text: 'TW needs an ENS upstream (same seed) and a COST beat drawn as a mark after it' },
    { id: 'P9', hard: true, grade: 'C', src: 'PEDAGOGY-MAP §4.9', text: 'CAL requires a PCR' },
    { id: 'P10', hard: true, grade: 'B', src: 'PEDAGOGY-MAP §4.10 (L4-I11)', text: 'TRF is the last content beat and its FAR item carries no cue' },
    { id: 'P11', hard: true, grade: 'B', src: 'PEDAGOGY-MAP §4.11 (L1-E)', text: 'PF only at Wield or above' },
    { id: 'P12', hard: false, grade: 'inf', src: 'PEDAGOGY-MAP §4.12 [inf]', text: 'INV after PCR and TW' },
    { id: 'MAX', hard: false, grade: 'inf', src: 'PEDAGOGY-MAP §4 maximums [inf]', text: 'content structures per film: glance ≤2, grasp ≤4, wield ≤3(+1 priming), master ≤5; ≤1 each INV/PF/REF/NAR; PCR ≤2 on distinct quantities' },
    { id: 'CAP', hard: true, grade: '—', src: 'INTERVIEW F7; each kernel\'s legible N', text: 'the ensemble size N lies inside the material\'s nRange' },
    { id: 'INV', hard: true, grade: 'C', src: 'PEDAGOGY-MAP §2 INV; PEDAGOGY-CRIT defect 10', text: 'an inverse task is non-degenerate: per-step p varies and the budget binds' },
    { id: 'CLOCK', hard: true, when: 'static + gate', grade: '—', src: 'runtime README clock law', text: 'module, material and camera code never reads a clock or an impure RNG' },
    { id: 'HOUSE', hard: true, grade: '—', src: 'JUROR §2 batch test; INTERVIEW F2', text: 'pedagogy and camera modules never draw: every mark goes through the film\'s one Material' },
    { id: 'BELIEF', hard: true, when: 'runtime', grade: '—', src: 'AD-v1 §1; runtime README', text: 'every result on screen is a typed Number (engine | marks); other digits are declared given or sketch' },
    { id: 'LEGIBLE', hard: true, when: 'runtime', grade: '—', src: 'PEDAGOGY-CRIT §4; REVISE', text: 'must-read text ≥ 14 px; the smallest type never carries a result or an honesty beat' },
  ];
  const lawOf = id => LAWS.find(l => l.id === id);

  const CONTENT = new Set(['CF', 'PCR', 'ENS', 'TW', 'TRF', 'INV', 'WE', 'PF', 'REF', 'ANA', 'CC', 'NAR', 'RET', 'SE', 'MER', 'CAL', 'NF']);
  const LEVEL_MAX = { glance: 2, grasp: 4, wield: 4, master: 5 };

  /* ── schedule: resolve "at" (number | "id.start+x" | "id.end-x") and durations ── */
  function schedule(graph, operad) {
    const out = [], byId = {};
    let cursor = 0, lastStart = 0;
    for (const n of graph.nodes) {
      const meta = operad.modules[n.module] || operad.cameras[n.module];
      if (!meta) { out.push({ id: n.id, module: n.module, start: 0, end: 0, missing: true }); continue; }
      const layer = n.layer || meta.layer || 'stage';
      const dur = n.dur != null ? n.dur : (typeof meta.dur === 'number' ? meta.dur : meta.durDefault || 0);
      let start;
      if (typeof n.at === 'number') start = n.at;
      else if (typeof n.at === 'string') {
        const m = n.at.match(/^([A-Za-z0-9_-]+)\.(start|end)\s*([+-]\s*[\d.]+)?$/);
        if (!m || !byId[m[1]]) throw new Error(`schedule: node "${n.id}" has an unreadable at "${n.at}" (use "nodeId.start+1.5" or "nodeId.end")`);
        start = byId[m[1]][m[2]] + (m[3] ? parseFloat(m[3].replace(/\s/g, '')) : 0);
      } else start = (layer === 'none') ? 0 : (layer === 'camera' ? lastStart : cursor);
      const rec = { id: n.id, module: n.module, structure: meta.structure, stage: meta.stage, cls: meta.cls, layer, start, end: start + dur, dur, params: n.params || {}, in: n.in || {} };
      out.push(rec); byId[n.id] = rec;
      if (layer === 'stage' || layer === 'overlay') { cursor = Math.max(cursor, rec.end); lastStart = start; }
    }
    return out;
  }

  const fill = (s, P) => s.replace(/\{(\w+)\}/g, (_, k) => (P[k] != null ? P[k] : '?'));

  function checkGraph(graph, operad, opts = {}) {
    const errors = [], warnings = [], waived = [];
    const waivers = graph.waivers || [];
    const err = (law, msg) => errors.push({ law, msg });
    const soft = (law, msg) => { const w = waivers.find(v => v.law === law); if (w) waived.push({ law, msg, reason: w.reason }); else warnings.push({ law, msg }); };
    let S;
    try { S = schedule(graph, operad); } catch (e) { return { errors: [{ law: 'TYPE', msg: e.message }], warnings, waived, schedule: [] }; }
    const byId = Object.fromEntries(S.map(s => [s.id, s]));
    const level = (graph.concept && graph.concept.level) || 'grasp';
    const P = Object.assign({ world: 'off' }, graph.params || {});

    /* TYPE: modules exist; wires typed; required ports wired */
    for (const s of S) {
      if (s.missing) { err('TYPE', `node "${s.id}": unknown module "${s.module}". Known: ${Object.keys(operad.modules).concat(Object.keys(operad.cameras)).join(', ')}`); continue; }
      const meta = operad.modules[s.module] || operad.cameras[s.module];
      for (const [port, tRaw] of Object.entries(meta.in || {})) {
        const t = tRaw.replace('?', ''), opt = tRaw.endsWith('?'), w = s.in[port];
        if (!w) { if (!opt) err('TYPE', `node "${s.id}" (${s.module}): input "${port}: ${t}" is not wired`); continue; }
        const [src, sp] = w.split('.'), sn = byId[src];
        if (!sn) { err('TYPE', `node "${s.id}": input "${port}" wired to unknown node "${src}"`); continue; }
        const smeta = operad.modules[sn.module] || operad.cameras[sn.module], st = smeta && smeta.out && smeta.out[sp];
        if (!st) { err('TYPE', `node "${s.id}": "${src}" has no output port "${sp}" (it offers: ${Object.keys((smeta && smeta.out) || {}).join(', ') || 'none'})`); continue; }
        if (st !== t) err('TYPE', `node "${s.id}": input "${port}" expects ${t} but "${w}" is ${st}`);
        if (sn.start > s.start + 1e-6 && sn.layer !== 'none') err('TYPE', `node "${s.id}" reads "${w}" before "${src}" starts (${sn.start.toFixed(1)}s > ${s.start.toFixed(1)}s)`);
      }
      for (const port of Object.keys(s.in)) if (!(meta.in || {})[port]) err('TYPE', `node "${s.id}" (${s.module}): no input port "${port}" (ports: ${Object.keys(meta.in || {}).join(', ')})`);
    }
    if (errors.length) return { errors, warnings, waived, schedule: S };

    const engineOf = (s, port = 'ens') => { let w = s.in[port], guard = 0; while (w && guard++ < 20) { const [src] = w.split('.'), sn = byId[src]; if (!sn) return null; if (sn.structure === 'ENG') return sn.id; w = sn.in.ens; } return null; };
    const content = S.filter(s => s.cls === 'content');

    /* P1: commit before reveal (per family) */
    const commits = S.filter(s => s.structure === 'PCR' || s.structure === 'TRF').map(s => {
      const meta = operad.modules[s.module];
      return (meta.commits || []).map(q => ({ node: s, q: fill(q, Object.assign({}, P, s.params)), jump: s.end }));
    }).flat();
    for (const s of S) {
      const meta = operad.modules[s.module]; if (!meta || !meta.reveals) continue;
      for (const r of meta.reveals) {
        const [kind, qRaw] = r.split(':'), q = fill(qRaw, Object.assign({}, P, s.params)), fam = q.split('@')[0];
        for (const c of commits) {
          if (c.node.id === s.id) continue;
          const cfam = c.q.split('@')[0];
          if (cfam === fam && s.start < c.jump - 1e-6)
            err('P1', `node "${s.id}" reveals ${kind} "${q}" at ${s.start.toFixed(1)}s, before commit "${c.node.id}" closes at ${c.jump.toFixed(1)}s`);
        }
      }
    }
    /* P2: counts after an ensemble; percentages after their count */
    const ensStarts = S.filter(s => s.structure === 'ENS').map(s => s.start);
    const countsSeen = [];
    for (const s of [...S].sort((a, b) => a.start - b.start)) {
      const meta = operad.modules[s.module]; if (!meta || !meta.reveals) continue;
      for (const r of meta.reveals) {
        const [kind, qRaw] = r.split(':'), q = fill(qRaw, Object.assign({}, P, s.params));
        if (kind === 'count' && !['ENS', 'TRF', 'INV'].includes(s.structure) && !ensStarts.some(t => t <= s.start + 1e-6)) err('P2', `node "${s.id}" shows count "${q}" with no ensemble before it`);
        if (kind === 'percent' && !countsSeen.includes(q)) err('P2', `node "${s.id}" shows percentage "${q}" before its count`);
        if (kind === 'count') countsSeen.push(q);
      }
    }
    /* P3: CF order */
    const cf = S.filter(s => s.structure === 'CF');
    const conc = cf.find(s => s.stage === 'concrete'), morph = cf.find(s => s.stage === 'morph');
    if (morph && !conc) err('P3', `CF morph "${morph.id}" has no concrete stage before it`);
    if (conc && morph && conc.start > morph.start) err('P3', `CF reversed: concrete "${conc.id}" starts after morph "${morph.id}"`);
    if (cf.length && ensStarts.length && Math.min(...ensStarts) < Math.max(...cf.map(s => s.start)) - 1e-6) err('P3', 'CF must reach its schematic stage before the first ensemble starts');
    /* P4: WE order */
    const we = S.filter(s => s.structure === 'WE');
    for (const s of we) {
      const order = ['full', 'gap1', 'twogaps'], st = s.params.stages || order;
      for (let i = 1; i < st.length; i++) if (order.indexOf(st[i]) < order.indexOf(st[i - 1])) err('P4', `WE "${s.id}": stage "${st[i]}" after "${st[i - 1]}"`);
    }
    /* P7 + SEED: TW needs ENS upstream on the same engine, and a COST mark after it */
    for (const s of S.filter(x => x.structure === 'TW' && x.stage !== 'cost')) {
      const eng = engineOf(s), ens = S.filter(x => x.structure === 'ENS' && x.start <= s.start && engineOf(x) === eng);
      if (!eng) err('SEED', `twins "${s.id}" is not fed by an engine node`);
      if (!ens.length) err('P7', `twins "${s.id}" has no ensemble on the same engine before it`);
      const cost = S.find(x => x.structure === 'TW' && x.stage === 'cost' && x.start >= s.start && engineOf(x) === eng);
      if (!cost) err('P7', `twins "${s.id}" has no cost beat (costOfCheck) on the same engine after it`);
    }
    /* P9 */
    if (S.some(s => s.structure === 'CAL') && !S.some(s => s.structure === 'PCR')) err('P9', 'CAL without a PCR');
    /* P10: TRF last; no cue in FAR */
    const trf = S.filter(s => s.structure === 'TRF');
    for (const t of trf) {
      const later = content.filter(s => s.start > t.start + 1e-6 && s.structure !== 'TRF');
      if (later.length) err('P10', `transfer "${t.id}" must be the last content beat; after it: ${later.map(s => s.id).join(', ')}`);
      const far = (t.params.far || '') + ' ' + (t.params.prompt || '');
      if (/\b(agents?|AI|LLM|model|loop|tool call)\b/i.test(far)) err('P10', `transfer "${t.id}" FAR item cues the structure ("${far.trim().slice(0, 60)}…")`);
    }
    /* P11 */
    if (S.some(s => s.structure === 'PF') && !['wield', 'master'].includes(level)) err('P11', `PF at level "${level}"`);
    /* P12 [inf] */
    for (const s of S.filter(x => x.structure === 'INV')) {
      if (!S.some(x => x.structure === 'PCR' && x.start < s.start) || !S.some(x => x.structure === 'TW' && x.start < s.start)) soft('P12', `inverse "${s.id}" comes before a PCR and a TW`);
    }
    /* INV non-degenerate */
    for (const s of S.filter(x => x.structure === 'INV')) {
      const ps = s.params.pSteps || [], budget = s.params.budget ?? 0, k = ps.length;
      if (!ps.length || ps.every(v => Math.abs(v - ps[0]) < 1e-9)) err('INV', `inverse "${s.id}": per-step p is uniform, so placement cannot matter (PEDAGOGY-CRIT defect 10)`);
      if (k && budget >= k) err('INV', `inverse "${s.id}": budget ${budget} buys a check at every one of ${k} steps`);
    }
    /* MAX [inf] */
    const structs = new Set(content.map(s => s.structure));
    const cap = LEVEL_MAX[level] ?? 4;
    if (structs.size > cap) soft('MAX', `${structs.size} content structures (${[...structs].join(', ')}) at "${level}" (≤${cap})`);
    for (const one of ['INV', 'PF', 'REF', 'NAR']) if (content.filter(s => s.structure === one).length > 1) soft('MAX', `more than one ${one}`);
    const pcrQs = commits.map(c => c.q);
    if (pcrQs.length > 2) soft('MAX', `${pcrQs.length} commits (≤2)`);
    if (new Set(pcrQs).size < pcrQs.length) soft('MAX', `two commits on the same quantity (${pcrQs.join(', ')})`);
    /* CAP: material capacity */
    if (opts.material && P.N != null) {
      const [lo, hi] = opts.material.nRange;
      if (P.N < lo || P.N > hi) err('CAP', `material "${opts.material.id}" draws ${lo}–${hi} runs legibly; this graph asks N = ${P.N}. Lower N or choose another material (${opts.alternatives || ''})`);
    }
    return { errors, warnings, waived, schedule: S };
  }

  /* ── static scans ── */
  const strip = js => js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1');
  const CLOCK_RX = [[/\bframe[C]ount\b/, 'frame' + 'Count'], [/\bmillis\s*\(/, 'mil' + 'lis()'], [/\bnew\s+Dat[e]\b|\bDat[e]\s*\.\s*now/, 'Da' + 'te'], [/performance\s*\.\s*no[w]/, 'performance' + '.now'],
    [/Math\s*\.\s*rando[m]/, 'Math' + '.random'], [/\bp\s*\.\s*rando[m]/, 'p.random'], [/\bdelta[T]ime\b/, 'delta' + 'Time']];
  const DRAW_RX = /\.(fillRect|strokeRect|clearRect|arc|ellipse|fillText|strokeText|drawImage|putImageData|lineTo|moveTo|bezierCurveTo|quadraticCurveTo|beginPath)\s*\(|\.(fill|stroke)\s*\(\s*\)|\bp\s*\.\s*(fill|stroke|ellipse|rect|text|line|background|image|circle|point|vertex)\s*\(/;
  function scanSource(name, src, kind) {
    const s = strip(String(src)), out = [];
    for (const [rx, tok] of CLOCK_RX) if (rx.test(s)) out.push({ law: 'CLOCK', msg: `${kind} "${name}" uses ${tok}` });
    if ((kind === 'module' || kind === 'camera') && DRAW_RX.test(s)) {
      const m = s.match(DRAW_RX);
      out.push({ law: 'HOUSE', msg: `${kind} "${name}" draws directly (${m[0].trim()}); hand the mark to the Material (M.units / M.mark / M.line / M.text)` });
    }
    return out;
  }

  return { LAWS, lawOf, schedule, checkGraph, scanSource, CONTENT };
});
