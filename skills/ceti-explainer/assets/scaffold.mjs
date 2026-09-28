/* ════════════════════════════════════════════════════════════════════
   CETI Explainer — scaffold (Node, no deps)
   --------------------------------------------------------------------
   The mechanical half of the functor in META-PROMPT.md §3: copies every
   brief slot that maps 1:1 into a fresh content module. What it cannot do
   (the derivation, the drawing, the motion) it leaves as named, typed TODOs,
   and it wires __AUDIT so the module FAILS the gate until DERIVED exists.

   Usage:  node scaffold.mjs <brief.json> [-o <id>.js]
           (prints to stdout without -o; refuses to overwrite an existing file)
   ──────────────────────────────────────────────────────────────────── */
import fs from "node:fs";

const args = process.argv.slice(2);
const p = args[0];
if (!p) { console.error("usage: node scaffold.mjs <brief.json> [-o out.js]"); process.exit(1); }
const oi = args.indexOf("-o");
const out = oi >= 0 ? args[oi + 1] : null;
const b = JSON.parse(fs.readFileSync(p, "utf8"));
if (b.format && b.format !== "episode") { console.error("scaffold covers the episode format; for a feature cut copy reference/longform/feature-cut-v2.js"); process.exit(1); }
const J = (v) => JSON.stringify(v);
const JJ = (v) => JSON.stringify(v, null, 2).replace(/\n/g, "\n  ");
const esc = (s) => String(s || "").replace(/\*\//g, "* /");

const beatLines = b.beats.map((x) => `    { id: ${J(x.id)}, label: ${J(x.label)}, dur: ${x.dur}, caption: ${J(x.caption)} },`).join("\n");
const beatPlan = b.beats.map((x, i) =>
  `     ${i + 1}. [${x.region.padEnd(7)}] ${x.id.padEnd(14)} idea: ${esc(x.idea)}\n` +
  `        ${"".padEnd(7)}   ${"".padEnd(14)} moves: ${esc(x.focal_motion)}` +
  (x.reuses && x.reuses.length ? `\n        ${"".padEnd(7)}   ${"".padEnd(14)} re-lights: ${x.reuses.join(", ")}` : "")).join("\n");
const claims = (b.conserved.claims || []).map((c) => `     - ${c.id}: ${esc(c.text)}  [ref ${c.ref}: ${esc((b.refs[c.ref] || {}).title)}]`).join("\n");

const src = `/* ════════════════════════════════════════════════════════════════════
   ${esc(b.title)} — CETI Explainer content module
   --------------------------------------------------------------------
   Scaffolded from ${p} by assets/scaffold.mjs. Immutable slots are filled;
   the typed TODOs below are what the author still owes (META-PROMPT.md §4).

   Archetype  : ${b.archetype}     Detail band: ${b.detail_band}
   Anchor     : ${esc(b.anchor.what)}
   Motif      : ${esc(b.conserved.motif)}
   Mechanism  : ${esc(b.mechanism)}

   Beats (idea · focal motion):
${beatPlan}

   Conserved claims (each must be visibly carried by the beats that list it):
${claims}

   Gate       : node assets/gate.mjs <thisfile>   (must PASS before ship)
   Reference  : reference/${{ derivation: "self-attention", process: "oauth", state: "tcp", code: "binary-search" }[b.archetype] || "self-attention"}.js  (closest archetype)
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, pulse, seg, fit } = ex;
  const flags = { math: true };

  /* ── 1) DATA ──────────────────────────────────────────────────────
     INPUTS are the brief's raw values — immutable. EXPECTED are the figures
     the brief promises — asserted by __AUDIT, NEVER displayed. Everything on
     screen reads from DERIVED, which you compute from INPUTS in code.
     Derivation (from the brief): ${esc(b.worked_example.derivation)}${b.worked_example.abstraction_note ? `
     Abstraction note: ${esc(b.worked_example.abstraction_note)}` : ""} */
  const INPUTS = ${JJ(b.worked_example.inputs)};
  const EXPECTED = ${JJ(b.worked_example.expected)};
  // TODO(DERIVED): implement the derivation. Replace null with an object whose
  // keys match EXPECTED. Numbers within 1e-6 (or the tolerance you state).
  const DERIVED = null;

  /* ── 2) BEATS (from the brief; do not retype) ──────────────────── */
  const beats = [
${beatLines}
  ];

  /* ── 3) GEOMETRY ────────────────────────────────────────────────── */
  const VW = 1000, VH = 464;
  const ACC = "var(--ex-accent)", ACC2 = "var(--ex-accent2)", SUP = "var(--ex-support)";
  const INK = "var(--ex-ink)", DIM = "var(--ex-dim)", LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)", CELL = "var(--ex-cell)";
  const ANCHOR_Y = 34, WORK_Y = 130, LT_Y = 302;

  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) k === "text" ? (n.textContent = attrs[k]) : n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (p, a) => el("g", a, p);
  const setO = (n, o) => { n.style.opacity = o; };
  const eyebrow = (p, x, y, text) => el("text", { x, y, "font-family": "var(--font-mono)", "font-size": 10, "letter-spacing": "0.2em", fill: DIM, text }, p);

  const D = {};

  /* ── BUILD: every node once ─────────────────────────────────────── */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((x) => (D.beats[x.id] = x));
    const svg = el("svg", { viewBox: \`0 0 \${VW} \${VH}\`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img", "aria-label": ${J("Animated explainer: " + b.title)} }, stage);
    D.svg = svg;
    D.ltRule = el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    setO(D.ltRule, 0);

    // TODO(anchor): ${esc(b.anchor.what)} — built here, lit in beat 1, never destroyed.
    D.anchor = g(svg, { transform: \`translate(0 \${ANCHOR_Y})\` });
    eyebrow(D.anchor, 44, 0, ${J(String(b.anchor.what).toUpperCase().slice(0, 40))});
    setO(D.anchor, 0);

    // TODO(scenes): one <g> per (beat, region). Working scenes hand off with ex.seg.
    D.working = {};
    D.detail = {};
${b.beats.filter((x) => x.region !== "anchor").map((x) => `    D.${x.region}[${J(x.id)}] = g(svg, { transform: \`translate(0 \${${x.region === "working" ? "WORK_Y" : "LT_Y + 14"}})\` }); setO(D.${x.region}[${J(x.id)}], 0);`).join("\n")}
  }

  /* ── RENDER: pure function of t ─────────────────────────────────── */
  function render(t) {
    const B = D.beats;
    const mathOn = flags.math ? 1 : 0;
    setO(D.anchor, ramp(t, B[${J(b.beats[0].id)}].start + 0.15, 0.5));
    setO(D.ltRule, ramp(t, B[${J((b.beats.find((x) => x.region === "detail") || b.beats[1]).id)}].start, 0.5) * mathOn);
    // TODO(motion): one focal motion per beat. Same-region scenes: seg(t, a, b), never pulse.
${b.beats.filter((x) => x.region !== "anchor").map((x) => `    setO(D.${x.region}[${J(x.id)}], seg(t, B[${J(x.id)}].start + 0.2, B[${J(x.id)}].end, 0.4)${x.region === "detail" ? " * mathOn" : ""});`).join("\n")}
  }

  /* ── AUDIT: the gate calls this; it fails until DERIVED exists ─── */
  window.__AUDIT = function () {
    if (!DERIVED) return { ok: false, msg: "DERIVED is null — implement worked_example.derivation in code (META-PROMPT.md §4 step 3.1)" };
    for (const k of Object.keys(EXPECTED)) {
      const e = EXPECTED[k], d = DERIVED[k];
      if (d === undefined) return { ok: false, msg: \`DERIVED.\${k} missing\` };
      const same = typeof e === "number" ? Math.abs(e - d) < 1e-6 : JSON.stringify(e) === JSON.stringify(d);
      if (!same) return { ok: false, msg: \`\${k}: derived \${JSON.stringify(d)} ≠ expected \${JSON.stringify(e)}\` };
    }
    return { ok: true, note: "DERIVED matches EXPECTED on " + Object.keys(EXPECTED).join(", ") };
  };
  window.__REGIONS = () => ({ working: Object.values(D.working), detail: Object.values(D.detail) });
  window.__LAYOUT = () => [D.anchor, ...Object.values(D.working), ...Object.values(D.detail)];

  return {
    meta: {
      id: ${J(b.id)},
      eyebrow: ${J(b.eyebrow)},
      title: ${J(b.title)},
      lede: ${J(b.lede)},
      synthTitle: ${J(b.synth_title || "What this <em>really</em> is")},
      tag: ${J(b.tag)},
      synthesis: ${J(b.aha)},
    },
    beats, build, render,
    setMath(on) { flags.math = !!on; },
  };
})();
`;

if (out) {
  if (fs.existsSync(out)) { console.error(`refusing to overwrite ${out}`); process.exit(1); }
  fs.writeFileSync(out, src);
  console.log(`✓ scaffolded ${out} from ${p} — next: implement DERIVED, then node assets/gate.mjs ${out}`);
} else {
  process.stdout.write(src);
}
