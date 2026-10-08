/* ════════════════════════════════════════════════════════════════════
   core/roles.js — variable → role → token. The ONLY place colours resolve (L6).
   --------------------------------------------------------------------
   A film's plan binds each variable to one role ("kept": "machine").
   Modules ask ctx.roles.of('kept') and never name a colour or a role.
   Roles (MODULE-OPERAD §1): machine person allowed error remedy neutral focus,
   plus shape roles "shape:filled" / "shape:hollow" (no hue: ink, by shape).
   Chrome maps roles to CSS tokens:
     dark      machine copper · person slate · allowed/remedy sage · error peach · neutral bone · focus copper
     notebook  machine blue · person amber · allowed/remedy green · error red · neutral ink · focus amber
   Structural tokens (ink, dim, line, line2, ground, panel, cell) come from base().
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const ROLES = ['machine', 'person', 'allowed', 'error', 'remedy', 'neutral', 'focus'];
  const SHAPES = ['filled', 'hollow'];
  const MAP = {
    dark: { machine: '--ex-accent', person: '--ex-support', allowed: '--ex-accent2', remedy: '--ex-accent2', error: '--ex-peach', neutral: '--ex-ink', focus: '--ex-accent' },
    notebook: { machine: '--ex-support', person: '--ex-accent', allowed: '--ex-accent2', remedy: '--ex-accent2', error: '--ex-peach', neutral: '--ex-ink', focus: '--ex-accent' },
  };
  const BASE = { ground: '--ex-ground', ink: '--ex-ink', dim: '--ex-dim', line: '--ex-line', line2: '--ex-line-2', panel: '--ex-panel', cell: '--ex-cell' };

  function parseRole(v) {
    if (typeof v !== 'string') return null;
    if (v.startsWith('shape:')) { const s = v.slice(6); return SHAPES.includes(s) ? { role: 'neutral', shape: s } : null; }
    return ROLES.includes(v) ? { role: v, shape: null } : null;
  }
  /** lint helper: problems with a role table (one role per variable is structural: a map) */
  function check(table) {
    const out = [];
    for (const k in (table || {})) if (!parseRole(table[k])) out.push('variable "' + k + '" → unknown role "' + table[k] + '"');
    return out;
  }

  /** browser: resolve once at build. css → [r,g,b,a] through a 1-px canvas (hex, rgba, oklch alike) */
  function make(table, chrome) {
    chrome = MAP[chrome] ? chrome : 'dark';
    const cache = {};
    let probe = null;
    function rgbOf(cssVar) {
      if (cache[cssVar]) return cache[cssVar];
      const css = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#888';
      probe = probe || document.createElement('canvas').getContext('2d');
      probe.clearRect(0, 0, 1, 1); probe.fillStyle = '#000'; probe.fillStyle = css; probe.fillRect(0, 0, 1, 1);
      const d = probe.getImageData(0, 0, 1, 1).data;
      return (cache[cssVar] = { css, rgb: [d[0], d[1], d[2]], a0: d[3] / 255 });
    }
    function token(cssVar, extra) {
      const c = rgbOf(cssVar);
      return Object.assign({ css: c.css, rgb: c.rgb, a: (al) => 'rgba(' + c.rgb.join(',') + ',' + Math.max(0, Math.min(1, c.a0 * (al == null ? 1 : al))).toFixed(3) + ')' }, extra || {});
    }
    return {
      chrome, table,
      of(variable) {
        const r = parseRole(table[variable]);
        if (!r) throw new Error('roles.of("' + variable + '"): unbound variable — add it to the plan\'s roles table');
        return token(MAP[chrome][r.role], { role: r.role, shape: r.shape, variable });
      },
      base(name) { if (!BASE[name]) throw new Error('roles.base: unknown structural token ' + name); return token(BASE[name], { role: 'base' }); },
    };
  }

  const Roles = { ROLES, SHAPES, MAP, BASE, parseRole, check, make };
  root.Roles = Roles;
  if (typeof module !== 'undefined' && module.exports) module.exports = Roles;
})(typeof window !== 'undefined' ? window : globalThis);
