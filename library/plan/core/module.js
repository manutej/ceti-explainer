/* ════════════════════════════════════════════════════════════════════
   core/module.js — Module.define: the registry of explainer modules
   --------------------------------------------------------------------
   BUILD-SPEC §2. Runs in node (lint, compile) and in the page (render).
   A definition is validated once at define time; a bad definition throws
   with the module name, so a typo never reaches a frame.

     Module.define(name, def)   register (throws on an invalid definition)
     Module.get(name)           → def (throws if unknown)
     Module.list()              → [names]
     Module.fill(def, params, example)  → P (defaults, @example refs, schema check)
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const REG = {};
  const KINDS = ['scene', 'combinator', 'chrome'];
  const PO_KINDS = ['track', 'grid', 'stack', 'axis', 'vessel', 'frontier', 'timeline', 'population', 'chain', 'cutaway', 'form', 'field'];
  const REGIONS = ['body', 'left', 'right', 'foot', 'inset', 'full', 'head'];
  const FLAGS = ['gap', 'committed', 'wrong', 'dissatisfied', 'parts', 'instance', 'rule', 'magnitude', 'bounds', 'retrieved'];

  function fail(name, msg) { throw new Error('Module.define(' + name + '): ' + msg); }

  function define(name, def) {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) fail(name, 'name must be kebab-case');
    if (!KINDS.includes(def.kind)) fail(name, 'kind must be one of ' + KINDS.join('|'));
    const p = def.ports || fail(name, 'ports missing');
    ['needs', 'gives', 'consumes'].forEach(k => {
      if (!Array.isArray(p[k])) fail(name, 'ports.' + k + ' must be an array');
      p[k].forEach(f => { if (!FLAGS.includes(f)) fail(name, 'unknown learner flag "' + f + '" in ports.' + k); });
    });
    if (!p.po || !Array.isArray(p.po.in)) fail(name, 'ports.po.in must list PO kinds');
    p.po.in.forEach(k => { if (!PO_KINDS.includes(k)) fail(name, 'unknown PO kind ' + k); });
    (p.regions || []).forEach(r => { if (!REGIONS.includes(r)) fail(name, 'unknown region ' + r); });
    if (typeof def.duration !== 'function') fail(name, 'duration(P) missing');
    if (typeof def.phases !== 'function') fail(name, 'phases(P) missing');
    if (typeof def.numbers !== 'function') fail(name, 'numbers(P) missing (L7: every shown number is a canonical fn)');
    if (typeof def.audit !== 'function') fail(name, 'audit(P) missing');
    if (typeof def.honesty !== 'function') fail(name, 'honesty(P) missing (L10)');
    if (def.kind !== 'combinator' && (typeof def.build !== 'function' || typeof def.render !== 'function')) fail(name, 'build/render missing');
    if (def.p5Layer && !def.p5Layer.means) fail(name, 'p5Layer.means missing ("each mark is one ___")');
    def.name = name;
    def.types = def.types || [];
    def.uses = def.uses || (() => []);
    def.controls = def.controls || (() => []);
    def.out = def.out || ((P, po) => po);
    REG[name] = def;
    return def;
  }

  function get(name) { if (!REG[name]) throw new Error('unknown module "' + name + '" (registered: ' + Object.keys(REG).join(', ') + ')'); return REG[name]; }

  /** resolve '@example.path' strings against the plan's single example record (L7, F14) */
  function deref(v, ex, refs, path) {
    if (typeof v === 'string' && v.startsWith('@example.')) {
      const key = v.slice(9); let cur = ex;
      key.split('.').forEach(k => { cur = cur == null ? undefined : cur[k]; });
      if (cur === undefined) throw new Error('unresolved ' + v + ' at ' + path);
      refs.push({ path, ref: v, value: cur });
      return cur;
    }
    if (Array.isArray(v)) return v.map((x, i) => deref(x, ex, refs, path + '[' + i + ']'));
    if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = deref(v[k], ex, refs, path + '.' + k); return o; }
    return v;
  }

  function fill(def, params, example) {
    const refs = [], P = {}, S = def.params || {}, given = deref(params || {}, example || {}, refs, def.name);
    for (const k in given) if (!S[k]) throw new Error(def.name + ': unknown param "' + k + '"');
    for (const k in S) {
      const s = S[k];
      let v = given[k] !== undefined ? given[k] : (typeof s.default === 'function' ? s.default(given) : s.default);
      if (v === undefined) { if (s.required) throw new Error(def.name + ': param "' + k + '" is required'); continue; }
      if (s.type === 'int' && !Number.isInteger(v)) throw new Error(def.name + ': ' + k + ' must be an int');
      if ((s.type === 'num' || s.type === 'int') && typeof v !== 'number') throw new Error(def.name + ': ' + k + ' must be a number');
      if (s.range && (v < s.range[0] || v > s.range[1])) throw new Error(def.name + ': ' + k + '=' + v + ' outside ' + s.range);
      if (s.type === 'array' && !Array.isArray(v)) throw new Error(def.name + ': ' + k + ' must be an array');
      if (s.type === 'enum' && !s.of.includes(v)) throw new Error(def.name + ': ' + k + ' must be one of ' + s.of);
      if (s.len && (v.length < s.len[0] || v.length > s.len[1])) throw new Error(def.name + ': ' + k + ' needs ' + s.len[0] + '–' + s.len[1] + ' items');
      P[k] = v;
    }
    Object.defineProperty(P, '__refs', { value: refs, enumerable: false });
    return P;
  }

  const Module = { define, get, fill, list: () => Object.keys(REG), PO_KINDS, FLAGS, REGIONS };
  root.Module = Module;
  if (typeof module !== 'undefined' && module.exports) module.exports = Module;
})(typeof window !== 'undefined' ? window : globalThis);
