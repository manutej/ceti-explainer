#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   core/lint_plan.mjs — METHOD §4 laws L1–L13 over a compiled plan (node; no browser)
   --------------------------------------------------------------------
     node lint_plan.mjs <plan.json | demo.json> [--demo i] [--json]
   A demo file is {"demos":[plan, plan]}; without --demo every plan is linted.
   Exit 1 when any law FAILs. SKIP = the law does not apply to this plan (said why).
   ──────────────────────────────────────────────────────────────────── */
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = resolve(HERE, '..');
const require = createRequire(import.meta.url);
['module.js', 'clock.js', 'layout.js', 'po/po.js', 'po/track.js', 'po/grid.js', 'po/axis.js', 'po/chain.js', 'roles.js', 'wrap.js', 'compile.js'].forEach(f => require(join(HERE, f)));
const { Module, Film, Roles } = globalThis;

export function moduleFile(name) { return join(LIB, 'modules', name, 'module.js'); }
export function loadModules(names) {
  names.forEach(n => {
    if (Module.list().includes(n)) return;
    const f = moduleFile(n);
    if (!existsSync(f)) throw new Error('no module file for "' + n + '" at ' + f);
    require(f);
  });
}

const CPR_TYPES = ['T1', 'T4', 'T5', 'T7', 'T8'];
const CHROME = ['bookend', 'honesty', 'land'];
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1');

/** every module a plan names, including the inners of combinators (any nested object with a "use") */
export function usesOf(plan) {
  const out = [];
  const walk = (sp) => { if (!sp || typeof sp !== 'object') return; if (sp.use && !out.includes(sp.use)) out.push(sp.use);
    Object.keys(sp).forEach(k => { if (k !== 'params' && k !== 'captions' && k !== 'head' && sp[k] && typeof sp[k] === 'object') walk(sp[k]); }); };
  (plan.modules || []).forEach(walk);
  return out;
}

export function lint(plan) {
  const used = usesOf(plan);
  loadModules(used);
  const rows = [];
  const add = (law, status, where, msg) => rows.push({ law, status, where, msg });
  let tl;
  try { tl = Film.compile(plan).timeline; }
  catch (e) { add('compile', 'FAIL', '-', e.message); return { rows, ok: false, timeline: null }; }
  const I = tl.instances, demo = !!(plan.meta && plan.meta.demo), type = tl.type || {};
  const W = (i, ph) => i.use + '#' + i.k + (ph ? '.' + ph.id : '');

  /* L1 typing */
  { const flags = new Set(tl.given.flags || []); let bad = 0;
    I.forEach(i => {
      const miss = i.needs.filter(f => !flags.has(f));
      if (miss.length) { bad++; add('L1', 'FAIL', W(i), 'needs ' + miss.join(', ') + ' (have: ' + ([...flags].join(', ') || '∅') + ')'); }
      if (!i.poAccepts.includes(i.poIn.kind)) { bad++; add('L1', 'FAIL', W(i), 'PO kind ' + i.poIn.kind + ' not in ' + i.poAccepts.join('|')); }
      if (type.primary && !i.types.includes(type.primary) && !i.types.includes(type.secondary)) { bad++; add('L1', 'FAIL', W(i), 'film type ' + type.primary + ' ∉ ' + i.types.join(' ')); }
      i.consumes.forEach(f => flags.delete(f)); i.gives.forEach(f => flags.add(f));
    });
    if (!bad) add('L1', 'PASS', 'chain', 'ports type-check; out flags: ' + [...flags].join(', ')); }

  /* L2 one object */
  { const bad = I.filter((i, n) => i.poIn.id !== tl.po.id || i.poOut.id !== tl.po.id || (n > 0 && i.poOutMode === 'create'));
    add('L2', bad.length ? 'FAIL' : 'PASS', bad.length ? bad.map(i => W(i)).join(' ') : 'chain', bad.length ? 'PO id changes or a second create' : 'one PO "' + tl.po.id + '" (' + tl.po.kind + ') through ' + I.length + ' module(s)'); }

  /* L3 one new thing per beat */
  { let bad = 0;
    I.forEach(i => i.phases.forEach(p => { if (p.introduces.length > 1) { bad++; add('L3', 'FAIL', W(i, p), 'introduces ' + p.introduces.join(', ')); } }));
    const starts = I.filter(i => !CHROME.includes(i.use)).map(i => i.t0);
    for (let n = 1; n < starts.length; n++) if (starts[n] - starts[n - 1] < 10) { bad++; add('L3', 'FAIL', 'starts', 'two module starts within 10 s at ' + starts[n].toFixed(1)); }
    if (!bad) add('L3', 'PASS', 'all phases', '≤ 1 new term per phase; module starts ≥ 10 s apart'); }

  /* L4 picture first, words after */
  { let bad = 0, n = 0; const marks = I.flatMap(i => i.phases.flatMap(p => p.marks));
    I.forEach(i => i.phases.forEach(p => p.labels.forEach(l => { n++;
      const m = marks.filter(x => x.term === l.term).sort((a, b) => a.t - b.t)[0];
      if (!m) { bad++; add('L4', 'FAIL', W(i, p), 'label "' + l.term + '" has no mark (a word with no picture)'); }
      else if (l.t < m.t + 0.3 - 1e-9) { bad++; add('L4', 'FAIL', W(i, p), 'label "' + l.term + '" at ' + l.t.toFixed(2) + ' < mark ' + m.t.toFixed(2) + ' + 0.3'); }
    })));
    if (!bad) add('L4', 'PASS', n + ' labels', 'every label lands ≥ 0.3 s after its mark'); }

  /* L5 name it last */
  { let bad = 0, n = 0;
    I.forEach(i => i.phases.forEach(p => p.names.filter(x => x.principle).forEach(x => { n++;
      if (i.payoffT == null || x.t < i.payoffT - 1e-9) { bad++; add('L5', 'FAIL', W(i, p), '"' + x.term + '" named at ' + x.t.toFixed(2) + ' before the payoff ' + (i.payoffT == null ? '(none)' : i.payoffT.toFixed(2))); } })));
    if (!bad) add('L5', 'PASS', n + ' principle(s)', 'named at or after the payoff'); }

  /* L6 colour = variable */
  { const probs = Roles.check(tl.roles); let bad = probs.length; probs.forEach(m => add('L6', 'FAIL', 'roles', m));
    I.forEach(i => i.uses.forEach(v => { if (!(v in tl.roles)) { bad++; add('L6', 'FAIL', W(i), 'variable "' + v + '" has no role in the plan'); } }));
    used.forEach(u => {
      const src = stripComments(readFileSync(moduleFile(u), 'utf8'));
      const hex = src.match(/['"`]#[0-9a-fA-F]{3,8}\b/g), lit = src.match(/['"](machine|person|allowed|error|remedy|neutral|focus|accent2?|peach|sage|copper|support|slate)['"]|--ex-/g);
      if (hex || lit) { bad++; add('L6', 'FAIL', u + '/module.js', 'colour literal in module code: ' + [...(hex || []), ...(lit || [])].slice(0, 4).join(' ')); }
    });
    if (!bad) add('L6', 'PASS', Object.keys(tl.roles).length + ' variables', 'one role each; no hex or role literal in module code'); }

  /* L7 counted, not claimed */
  { let bad = 0;
    I.forEach(i => i.phases.forEach(p => p.shows.forEach(id => { if (!i.numbers.includes(id)) { bad++; add('L7', 'FAIL', W(i, p), 'shows "' + id + '" with no canonical fn'); } })));
    tl.audits.forEach(a => { if (!a.ok) { bad++; add('L7', 'FAIL', a.use + (a.k >= 0 ? '#' + a.k : ''), 'audit: ' + a.msg); } });
    I.forEach(i => (i.refs || []).forEach(r => { let cur = tl.example; r.ref.slice(9).split('.').forEach(k => { cur = cur == null ? undefined : cur[k]; });
      if (JSON.stringify(cur) !== JSON.stringify(r.value)) { bad++; add('L7', 'FAIL', W(i), r.ref + ' ≠ record'); } }));
    const nr = I.reduce((s, i) => s + (i.refs || []).length, 0);
    if (!bad) add('L7', 'PASS', I.map(i => i.numbers.length).reduce((a, b) => a + b, 0) + ' number fns', 'audits pass; ' + nr + ' @example ref(s) equal the record; ' + tl.audits.map(a => a.note).filter(Boolean).join(' · ')); }

  /* L8 cue budget */
  { const cues = I.flatMap(i => i.phases.filter(p => p.cue).map(p => ({ w: W(i, p), ...p.cue }))).sort((a, b) => a.a - b.a); let bad = 0;
    cues.forEach((c, n) => {
      if (c.b - c.a > 1.5 + 1e-9) { bad++; add('L8', 'FAIL', c.w, 'cue ' + (c.b - c.a).toFixed(2) + ' s > 1.5 s'); }
      if (n && cues[n - 1].b > c.a + 1e-9) { bad++; add('L8', 'FAIL', c.w, 'overlaps cue ' + cues[n - 1].w); }
    });
    if (!bad) add('L8', 'PASS', cues.length + ' cue(s)', 'never overlapping, each ≤ 1.5 s'); }

  /* L9 holds are declared */
  { let bad = 0;
    I.forEach(i => {
      const owners = {}; i.phases.filter(p => p.hold).forEach(p => { owners[p.own] = (owners[p.own] || 0) + 1; });   // one hold per module, nested modules included
      Object.keys(owners).forEach(o => { if (owners[o] > 1) { bad++; add('L9', 'FAIL', W(i) + (o ? '/' + o : ''), owners[o] + ' holds (max 1 per module)'); } });
      i.phases.forEach(p => {
        const len = p.b - p.a;
        if (p.still && !p.hold && len > 3) { bad++; add('L9', 'FAIL', W(i, p), 'undeclared stillness ' + len.toFixed(2) + ' s'); }
        if (p.hold) {
          const pay = i.phases.filter(q => q.payoffT != null && q.payoffT <= p.a + 1e-9).map(q => q.payoffT).pop();
          if (pay == null || p.a - pay > 0.5 + 1e-9) { bad++; add('L9', 'FAIL', W(i, p), 'hold does not start ≤ 0.5 s after a payoff'); }
          if (len < 2 - 1e-9 || len > 4 + 1e-9) { bad++; add('L9', 'FAIL', W(i, p), 'hold ' + len.toFixed(2) + ' s outside 2–4 s'); }
        }
      });
    });
    if (!bad) add('L9', 'PASS', I.reduce((s, i) => s + i.phases.filter(p => p.hold).length, 0) + ' hold(s)', 'each 2–4 s, ≤ 0.5 s after a payoff; no undeclared stillness'); }

  /* L10 honesty */
  { const bad = I.filter(i => !i.honesty.length);
    bad.forEach(i => add('L10', 'FAIL', W(i), 'empty honesty'));
    const cpr = I.some(i => i.use === 'commit-predict-reveal');
    I.filter(i => i.use === 'commit-predict-reveal').forEach(i => {
      const caps = ((plan.modules || [])[i.k] || {}).captions || {}, txt = (caps.ask || '') + ' ' + (caps.commit || '');
      if (!/pause/i.test(txt)) { bad.push(i); add('L10', 'FAIL', W(i), 'the CPR ask/commit caption must say "pause" (the MP4 cannot wait)'); }
    });
    if (!bad.length) add('L10', 'PASS', I.reduce((s, i) => s + i.honesty.length, 0) + ' item(s)', 'every module carries honesty; the page lists the union' + (cpr ? '; CPR captions say "pause"' : '; no CPR, so no MP4 "pause" caption needed')); }

  /* L11 prediction coverage */
  { const need = CPR_TYPES.includes(type.primary), have = I.filter(i => i.use === 'commit-predict-reveal').length;
    if (demo) add('L11', 'SKIP', 'demo', 'a one-module demo; the CPR wrapper is a film-level law (primary ' + (type.primary || '?') + ')');
    else if (need && !have) add('L11', 'FAIL', 'chain', 'primary ' + type.primary + ' needs ≥ 1 commit-predict-reveal');
    else if (have > Math.max(2, Math.ceil(tl.dur / 60))) add('L11', 'FAIL', 'chain', have + ' CPRs (≤ 2 per 2 min)');
    else add('L11', 'PASS', 'chain', need ? have + ' CPR(s)' : 'primary ' + (type.primary || '?') + ' needs none'); }

  /* L12 verbal channel */
  { const burned = new Set(I.flatMap(i => i.phases.flatMap(p => p.labels.map(l => l.term)))), miss = [];
    I.forEach(i => i.phases.forEach(p => p.introduces.forEach(t => { if (!burned.has(t)) miss.push(W(i, p) + ':' + t); })));
    if (tl.meta.vo) add('L12', 'PASS', 'vo', 'narration track declared');
    else if (miss.length) add('L12', 'FAIL', miss.slice(0, 3).join(' '), 'introduced term(s) with no burned label and no VO');
    else add('L12', 'PASS', burned.size + ' burned label(s)', 'every introduced term is labelled on its object'); }

  /* L13 return */
  { const teach = I.filter(i => !CHROME.includes(i.use)), lastT = teach[teach.length - 1];
    if (!lastT) add('L13', 'FAIL', 'chain', 'no teaching module');
    else if (lastT.use !== 'recap-retrieve' && demo) add('L13', 'SKIP', 'demo', 'a one-module demo of ' + lastT.use + '; the return law is film-level');
    else if (lastT.use !== 'recap-retrieve') add('L13', 'FAIL', W(lastT), 'the last teaching module is not recap-retrieve');
    else {
      const ask = lastT.phases.find(p => p.id === 'ask'), q = lastT.question || {};
      let src = q.contentT;
      if (src == null && tl.given.contentAt != null) src = tl.given.contentAt;
      if (src == null) add('L13', 'FAIL', W(lastT), 'the retrieval question does not say when its content was shown');
      else if (ask.a - src < 30) add('L13', 'FAIL', W(lastT), 'question content only ' + (ask.a - src).toFixed(1) + ' s before the ask (< 30 s)');
      else add('L13', 'PASS', W(lastT), 'returns to the opening instance; content ' + (ask.a - src).toFixed(1) + ' s before the ask' + (demo ? ' (given.contentAt)' : ''));
    } }

  /* p5 budget (BUILD-SPEC §5) */
  { const over = I.filter(i => I.filter(j => j.t0 < i.t1 && i.t0 < j.t1).reduce((s, j) => s + j.costMs, 0) > 12);
    add('P5', over.length ? 'FAIL' : 'PASS', over.length ? over.map(i => W(i)).join(' ') : 'windows', over.length ? 'live p5 layers > 12 ms/frame' : 'declared p5 cost ≤ 12 ms/frame in every window'); }

  return { rows, ok: rows.every(r => r.status !== 'FAIL'), timeline: tl };
}

function table(res, title) {
  const out = ['', '── lint_plan · ' + title + ' ──', 'LAW   STATUS  WHERE                         NOTE'];
  res.rows.forEach(r => out.push(r.law.padEnd(5) + ' ' + r.status.padEnd(6) + '  ' + String(r.where).slice(0, 28).padEnd(29) + ' ' + r.msg));
  out.push(res.ok ? 'RESULT: PASS' : 'RESULT: FAIL');
  return out.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), file = args.find(a => !a.startsWith('--') && !/^\d+$/.test(a));
  const di = args.indexOf('--demo'), asJson = args.includes('--json');
  if (!file) { console.error('usage: lint_plan.mjs <plan.json|demo.json> [--demo i] [--json]'); process.exit(2); }
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const plans = doc.demos ? (di >= 0 ? [doc.demos[+args[di + 1]]] : doc.demos) : [doc];
  const results = plans.map(p => { const r = lint(p); return { id: p.meta && p.meta.id, ok: r.ok, rows: r.rows }; });
  if (asJson) process.stdout.write(JSON.stringify(results.length === 1 ? results[0] : results));
  else results.forEach((r, n) => console.log(table(r, r.id || ('plan ' + n))));
  process.exit(results.every(r => r.ok) ? 0 : 1);
}
