/* core/test_module.mjs — shared module test: both demos lint, audits pass, phase invariants hold. */
import { readFileSync } from 'node:fs';
import { lint } from './lint_plan.mjs';
export function testModule(demoFile) {
  const doc = JSON.parse(readFileSync(demoFile, 'utf8')); let ok = true;
  doc.demos.forEach((plan, i) => {
    const r = lint(plan), tl = r.timeline, fails = r.rows.filter(x => x.status === 'FAIL');
    const inv = [];
    tl.instances.forEach(I => {
      const f = I.phases.reduce((s, p) => s + p.f, 0); if (Math.abs(f - 1) > 1e-6) inv.push('Σf ≠ 1');
      I.phases.forEach((p, k) => { if (k && Math.abs(p.a - I.phases[k - 1].b) > 1e-9) inv.push('phase gap at ' + p.id); });
      if (I.payoffT == null) inv.push('no payoff');
      if (!I.honesty.length) inv.push('no honesty');
    });
    const pass = r.ok && !inv.length; ok = ok && pass;
    console.log((pass ? 'PASS ' : 'FAIL ') + 'demo ' + i + ' ' + plan.meta.id + (fails.length ? ' · ' + fails.map(x => x.law + ' ' + x.msg).join('; ') : '') + (inv.length ? ' · ' + inv.join('; ') : ''));
  });
  process.exitCode = ok ? 0 : 1;
}
