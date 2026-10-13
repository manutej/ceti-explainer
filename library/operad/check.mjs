#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   check.mjs — lint a beat graph against the module operad (the same laws.js the composer runs in the browser).

     node check.mjs GRAPH.json [--material ID] [--strict] [--json OUT]   → law table; exit 1 on any hard failure
     node check.mjs --export operad.json                                 → regenerate operad.json from the registry
     node check.mjs --scan                                               → static CLOCK/HOUSE scan of every library file

   It loads runtime/atelier.js, core/, the material adapters, pedagogy/ and camera/ into a Node vm (no DOM needed:
   every definition is declarative at load time), builds the operad view, and runs AMLaws.checkGraph. --strict turns
   the [inf] soft laws into failures (waivers still apply).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const { cetiRoot } = await import('../../scripts/root.mjs').catch(() => ({ cetiRoot: () => null }));  // <root>/scripts/root.mjs

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Merged layout (<root>/library/operad/check.mjs): the runtime is <root>/runtime/dist/atelier.js and the logical
// library paths below map onto library/{operad,materials,modules,cameras}/. The original modules/ layout
// (core/, pedagogy/, camera/ next to this file, runtime at ../runtime/atelier.js) is kept as the fallback.
const ROOT = cetiRoot(HERE);
const OLD = !ROOT || fs.existsSync(path.join(HERE, 'core', 'am.js'));
const RT = OLD ? path.join(HERE, '..', 'runtime', 'atelier.js') : path.join(ROOT, 'runtime', 'dist', 'atelier.js');
const DIRS = OLD ? { core: 'core', materials: 'materials', pedagogy: 'pedagogy', camera: 'camera', '': '' }
  : { core: '../operad', materials: '../materials', pedagogy: '../modules', camera: '../cameras', '': '' };
const libPath = f => { const i = f.indexOf('/'), d = i < 0 ? '' : f.slice(0, i); return path.join(HERE, DIRS[d], i < 0 ? f : f.slice(i + 1)); };
const FILES = ['core/am.js', 'core/laws.js',
  ...fs.readdirSync(libPath('materials/')).filter(f => f.endsWith('.js')).map(f => 'materials/' + f),
  'pedagogy/_shared.js', ...fs.readdirSync(libPath('pedagogy/')).filter(f => f.endsWith('.js') && f !== '_shared.js').map(f => 'pedagogy/' + f),
  ...fs.readdirSync(libPath('camera/')).filter(f => f.endsWith('.js')).map(f => 'camera/' + f), 'compose.js'];

function load() {
  const sandbox = { console, structuredClone, Math, JSON };
  sandbox.globalThis = sandbox; vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(RT, 'utf8'), sandbox, { filename: 'atelier.js' });
  for (const f of FILES) vm.runInContext(fs.readFileSync(libPath(f), 'utf8'), sandbox, { filename: f });
  return sandbox;
}

const args = process.argv.slice(2), flag = n => args.includes(n), val = n => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const G = load(), AM = G.AM, L = G.AMLaws;

if (flag('--scan')) {
  let bad = 0;
  for (const f of FILES) {
    const kind = f.startsWith('pedagogy/') ? 'module' : f.startsWith('camera/') ? 'camera' : f.startsWith('materials/') ? 'material' : 'core';
    if (kind === 'core') continue;
    const r = L.scanSource(f, fs.readFileSync(libPath(f), 'utf8'), kind);
    for (const e of r) { console.log(`FAIL [${e.law}] ${e.msg}`); bad++; }
  }
  console.log(`scan: ${FILES.length} files, ${bad} finding(s)`); process.exit(bad ? 1 : 0);
}

if (val('--export')) {
  const op = AM.operad({ params: { N: 1000, k: 20, p: 0.95, c: 0.8, retry: 1, seed: 1 } });
  const out = {
    name: 'atelier-module-operad', version: op.version, generated: 'node modules/check.mjs --export operad.json (from the registry; do not hand-edit)',
    types: op.types,
    operations: Object.fromEntries(Object.entries(op.modules).map(([id, m]) => [id, { kind: 'pedagogy', structure: m.structure, stage: m.stage || null, class: m.cls, grade: m.grade,
      layer: m.layer, levels: m.levels, in: m.in, out: m.out, arity: Object.keys(m.in || {}).filter(k => !String(m.in[k]).endsWith('?')).length,
      reveals: m.reveals, commits: m.commits, durDefault: m.durDefault, evidence: m.evidence || null, doc: m.doc }]).concat(
      Object.entries(op.cameras).map(([id, c]) => [id, { kind: 'camera', structure: 'CAM', class: 'camera', layer: 'camera', in: c.in, out: c.out, arity: Object.keys(c.in || {}).length, durDefault: c.durDefault, doc: c.doc }]))),
    materials: op.materials,
    materialInterface: {
      required: ['id', 'source', 'axis', 'cell', 'nRange', 'ground', 'begin', 'units', 'mark', 'line', 'area', 'text', 'num', 'anchor', 'end', 'voice'],
      signatures: {
        'begin(p, ctx, t, cam)': '→ surface S (ground drawn; camera {x,y,z})',
        'units(S, items, t)': 'items: [{r, x, y, w, h, k, rows, done, failAt, age, caught[], world, alpha, emph, lost}] — the kernel draws run, steps, address, catches in one batch',
        'mark(S, kind, x, y, o)': "kind ∈ address | save | cost | guess | truth | realised | expected | tick",
        'line(S, pts, role, o)': "role ∈ exact | rule | guess | gap | ghost | link",
        'area(S, top, bot, role, o)': "role ∈ band",
        'text(S, str, x, y, o)': "role ∈ title | head | text | num | note | sketch (guarded: belief + legibility)",
        'num(S, Number, x, y, o)': 'only AM.Number; formatted by the composer ("expected …", never "exact ±")',
        'anchor(rect, j, k)': '→ world point of step j on a unit rect (where address/save/cost marks go)',
        'end(p, S)': 'composite and blit once',
        voice: 'semantic sound events (step, fail, save, reveal, commit, cost) → runtime voices',
      },
    },
    composition: {
      wiring: 'node.in.port = "srcNode.outPort"; types must match exactly (a trailing ? marks an optional port)',
      layers: { stage: 'one owner at a time; keeps drawing its final state until the next stage beat starts; its words fade after its window', overlay: 'drawn only inside its window', camera: 'latest started shot wins; closed form in t', none: 'build-only (engines)' },
      schedule: 'at = number | "node.start+x" | "node.end-x"; default = after the previous stage/overlay beat; cameras default to the previous beat\'s start',
      precedence: L.LAWS.filter(l => /^P\d/.test(l.id)).map(l => ({ id: l.id, text: l.text, grade: l.grade, hard: l.hard, src: l.src })),
      maxima: { glance: 2, grasp: 4, wield: '3 + 1 priming', master: 5, oneEach: ['INV', 'PF', 'REF', 'NAR'], pcr: '≤2 on distinct quantities', grade: 'inf (soft; waiver required)' },
    },
    laws: L.LAWS,
  };
  fs.writeFileSync(path.resolve(val('--export')), JSON.stringify(out, null, 2) + '\n');
  console.log(`operad.json: ${Object.keys(out.operations).length} operations, ${Object.keys(out.materials).length} materials, ${out.laws.length} laws, ${Object.keys(out.types).length} types`);
  process.exit(0);
}

const gp = args.find(a => a.endsWith('.json') && a !== val('--json'));
if (!gp) { console.error('usage: node check.mjs GRAPH.json [--material ID] [--strict] [--json OUT] | --export operad.json | --scan'); process.exit(2); }
const graph = JSON.parse(fs.readFileSync(gp, 'utf8'));
const P = Object.assign({ N: 1000, k: 20, p: 0.95, c: 0.8, retry: 1, seed: 1 }, graph.params || {});
graph.params = P;
for (const n of graph.nodes) { const d = AM.modules[n.module] || AM.cameras[n.module]; if (d && n.dur == null) n.dur = typeof d.dur === 'function' ? d.dur(Object.assign({}, P, n.params || {})) : d.dur; }
const op = AM.operad(graph), matId = val('--material'), mat = matId ? AM.materials[matId] : null;
if (matId && !mat) { console.error(`unknown material ${matId}; known: ${Object.keys(AM.materials).join(', ')}`); process.exit(2); }
const R = L.checkGraph(graph, op, { material: mat, alternatives: 'fits: ' + Object.values(AM.materials).filter(m => P.N >= m.nRange[0] && P.N <= m.nRange[1]).map(m => m.id).join(', ') });
// static scans of the modules this graph uses
const used = [...new Set(graph.nodes.map(n => n.module))], src = o => Object.values(o).filter(v => typeof v === 'function').map(f => f.toString()).join('\n');
const scan = [];
for (const id of used) { if (AM.modules[id]) scan.push(...L.scanSource(id, src(AM.modules[id]), 'module')); if (AM.cameras[id]) scan.push(...L.scanSource(id, src(AM.cameras[id]), 'camera')); }
if (mat) scan.push(...L.scanSource(mat.id, src(mat), 'material'));
const strict = flag('--strict');
const errors = R.errors.concat(scan).concat(strict ? R.warnings : []);
console.log(`\nCHECK ${graph.id}  (${path.basename(gp)}${mat ? ' · material ' + mat.id : ''}${strict ? ' · strict' : ''})`);
const rows = L.LAWS.map(l => {
  const e = errors.filter(x => x.law === l.id), w = R.warnings.filter(x => x.law === l.id), v = R.waived.filter(x => x.law === l.id);
  const res = e.length ? 'FAIL' : w.length ? 'WARN' : v.length ? 'WAIVED' : l.when === 'runtime' ? 'RUNTIME' : 'PASS';
  return [l.id, res, l.grade, (e[0] || w[0] || v[0] || {}).msg || l.text, v[0] ? v[0].reason : ''];
});
for (const [id, res, grade, msg, why] of rows) console.log(`  ${id.padEnd(7)} ${res.padEnd(7)} ${String(grade).padEnd(3)}  ${msg}${why ? `\n                      waiver: ${why.slice(0, 140)}${why.length > 140 ? '…' : ''}` : ''}`);
const shown = new Set(L.LAWS.map(l => errors.find(x => x.law === l.id)).filter(Boolean));
for (const e of errors) if (!shown.has(e)) console.log(`  ${e.law.padEnd(7)} FAIL        ${e.msg}`);
const dur = Math.max(...R.schedule.map(s => s.end));
console.log(`  schedule: ${R.schedule.filter(s => s.layer !== 'none').map(s => `${s.id}@${s.start.toFixed(1)}`).join(' · ')}  → ${dur.toFixed(1)} s`);
const ok = errors.length === 0;
console.log(`  VERDICT  ${ok ? 'PASS' : 'FAIL'} (${errors.length} hard, ${R.warnings.length} soft, ${R.waived.length} waived)\n`);
if (val('--json')) fs.writeFileSync(val('--json'), JSON.stringify({ graph: graph.id, material: matId, pass: ok, errors, warnings: R.warnings, waived: R.waived, schedule: R.schedule.map(s => ({ id: s.id, module: s.module, start: s.start, end: s.end, layer: s.layer })) }, null, 2));
process.exit(ok ? 0 : 1);
