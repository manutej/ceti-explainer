#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   channels/timeline.mjs — the compiled plan as data for the channel compiler (CHANNELS §6.2 stages 1–2, §4.1)
   --------------------------------------------------------------------
     node channels/timeline.mjs <plan.json> [--aspect 9x16]   → JSON on stdout:
       { dur, aspect, vh, meta, aha, misconception, example, honesty[], captions[], chapters[],
         phases[{k, use, id, a, b, beat, payoffT, hold, names}], frames{name: t}, numbers[] }
   Beat classes (CHANNELS §2) are tagged from module + phase id. The frame bank applies the §4.1 time rules
   to the phase markers. numbers[] = every number the film prints in its captions, foot templates, audit
   notes and example record: the reference set for Q6 (numbers agree across channels).
   Phase times do not depend on the aspect (layouts move marks, never the clock).
   ──────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs';
import { loadModules, usesOf } from '../../library/plan/core/lint_plan.mjs';   // was ../core/lint_plan.mjs (library/channels/)

const args = process.argv.slice(2), file = args.find(a => !a.startsWith('--'));
const aspect = args.includes('--aspect') ? args[args.indexOf('--aspect') + 1] : '16x9';
const plan = JSON.parse(readFileSync(file, 'utf8'));
loadModules(usesOf(plan));
const { timeline: TL, FEATURE } = globalThis.Film.compile(plan, { aspect });

/** CHANNELS §2: the beat class of a phase, from its module and (nested) phase id */
function beatOf(use, id, p) {
  const leaf = id.split('.').pop();
  if (p.names.length) return 'name';
  if (use === 'recap-retrieve') return leaf === 'return' ? 'land' : 'recap';
  if (use === 'contrast-split') return 'contrast';
  if (leaf === 'ask') return 'hook';
  if (leaf === 'commit') return 'commit';
  if (leaf === 'steelman' || leaf === 'run-wrong') return 'wrong';
  if (leaf === 'break' || leaf === 'break-hold') return 'break';
  if (leaf === 'gap') return 'gap';
  if (leaf === 'count' || (p.payoff && /count|tally/.test(leaf))) return 'count';
  if (p.hold) return 'hold';
  if (leaf === 'land') return 'land';
  return 'build';
}

const phases = [];
TL.instances.forEach(i => i.phases.forEach(p => phases.push({ k: i.k, use: i.use, id: p.id, a: +p.a.toFixed(3), b: +p.b.toFixed(3),
  beat: beatOf(i.use, p.id, p), payoffT: p.payoffT != null ? +p.payoffT.toFixed(3) : null, hold: p.hold, names: p.names.map(n => n.term), fit: !!i.fit })));
const find = (pred) => phases.find(pred);
const leaf = (p) => p.id.split('.').pop();

/* CHANNELS §4.1 time rules */
const F = {};
const first = TL.instances[0];
const r0 = first && first.phases[0];
if (r0) F['po.first'] = +(r0.b - 0.3).toFixed(2);
const ask = find(p => p.beat === 'hook'); if (ask) F.question = +(ask.b - 0.05).toFixed(2);
const com = find(p => p.beat === 'commit'); if (com) F.commit = +(com.a + 0.5).toFixed(2);
const runw = find(p => leaf(p) === 'run-wrong'); if (runw) F.wrong = +(runw.b - 0.05).toFixed(2);
const brk = find(p => leaf(p) === 'break-hold') || find(p => leaf(p) === 'break'); if (brk) F.break = +(brk.a + 0.5).toFixed(2);
const cnt = find(p => p.beat === 'count'); if (cnt) F.count = +(cnt.b - 0.2).toFixed(2);
const gap = find(p => p.beat === 'gap'); if (gap) F.gap = +(gap.b - 0.1).toFixed(2);
const differ = find(p => p.use === 'contrast-split' && leaf(p) === 'differ'); if (differ) F.contrast = +(differ.b - 0.1).toFixed(2);
const named = find(p => p.beat === 'name' && p.payoffT == null && cnt && p.a > cnt.a); if (named) F.named = +(named.b - 0.1).toFixed(2);
const ans = find(p => p.use === 'recap-retrieve' && leaf(p) === 'answer'); if (ans) F.retrieve = +(ans.b - 0.1).toFixed(2);
const land = find(p => p.beat === 'land'); if (land) F.land = +(land.b - 1.0).toFixed(2);
const fruit = find(p => leaf(p) === 'fruitful'); if (fruit) F.fresh = +(fruit.b - 0.2).toFixed(2);
F.cover = F.gap != null ? F.gap : (['A2', 'A8'].includes(plan.archetype) && F.break != null ? F.break : (F.count != null ? F.count : 0));

/* the film's own numbers (Q6 reference) */
const nums = new Set();
const grab = (s) => String(s || '').replace(/(\d),(\d{3})/g, '$1$2').match(/\d+(\.\d+)?/g)?.forEach(n => nums.add(String(+n)));
FEATURE.captions.forEach(c => grab(c[2]));
TL.audits.forEach(a => { grab(a.note); const m = /card ([\d.]+)[^→]*→ counted ([\d.]+)/.exec(a.note || ''); if (m) nums.add(String(Math.round(Math.abs(+m[1] - +m[2])))); });
JSON.stringify(plan.example).match(/\d+(\.\d+)?/g)?.forEach(n => { nums.add(String(+n)); if (+n < 1) nums.add(String(Math.round(+n * 100))); });
const walk = (o) => { if (!o || typeof o !== 'object') return; for (const k in o) { if (k === 'foot' || k === 'captions' || k === 'returnLines' || k === 'line') grab(JSON.stringify(o[k])); walk(o[k]); } };
plan.modules.forEach(walk);
grab(JSON.stringify((plan.meta || {}).sources || [])); grab(JSON.stringify(plan.modules.map(m => m.params && m.params.filmDefault)));

const honesty = []; TL.instances.forEach(i => i.honesty.forEach(h => { if (!honesty.includes(h) && h !== '(combinator)') honesty.push(h); }));
process.stdout.write(JSON.stringify({
  dur: TL.dur, aspect: TL.aspect, vh: TL.vh, meta: plan.meta, archetype: plan.archetype, type: plan.type, aha: plan.aha, misconception: plan.misconception,
  example: plan.example, honesty, captions: FEATURE.captions, chapters: FEATURE.chapters, phases, frames: F,
  numbers: [...nums].sort((a, b) => +a - +b),
  layouts: Object.fromEntries(globalThis.Layout.ASPECTS.map(a => { const l = globalThis.Layout.make(a); delete l.sub; return [a, l]; })), fit: TL.instances.filter(i => i.fit).map(i => i.use + '#' + i.k),
}, null, 1));
