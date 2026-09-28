/* ════════════════════════════════════════════════════════════════════
   CETI Explainer — brief gate (Node, no deps)
   --------------------------------------------------------------------
   Checks a typed brief (briefs/brief.schema.json) BEFORE any code exists.
   This is the Propose-stage gate of META-PROMPT.md: every binding rule that
   can be decided from the brief alone is decided here, and the sheaf-glue Φ
   (motif ∧ claims ∧ duration) is printed as a ledger.

   Usage:  node brief-gate.mjs <brief.json>
   Exit 0 = PASS, 1 = FAIL.
   ──────────────────────────────────────────────────────────────────── */
import fs from "node:fs";

const p = process.argv[2];
if (!p) { console.error("usage: node brief-gate.mjs <brief.json>"); process.exit(1); }
let b;
try { b = JSON.parse(fs.readFileSync(p, "utf8")); }
catch (e) { console.log("FAIL:\n- brief is not valid JSON: " + e.message); process.exit(1); }

const errs = [], warns = [];
const E = (m) => errs.push(m), W = (m) => warns.push(m);
const isStr = (v, min = 1) => typeof v === "string" && v.trim().length >= min;
const kebab = /^[a-z0-9-]+$/;
const HYPE = ["unlock", "supercharge", "revolutioni", "powerful", "seamless", "game-changing", "unleash", "cutting-edge", "magic"];
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}]/u;
const sentences = (s) => (s.match(/[^.!?]+[.!?]+/g) || []).length;

/* ---- top level ---- */
const REQ = ["format", "id", "title", "eyebrow", "tag", "audience", "archetype", "critique_of_obvious", "mechanism", "anchor", "worked_example", "detail_band", "aha", "lede", "refs", "conserved"];
for (const k of REQ) if (b[k] === undefined) E(`missing slot "${k}"`);
if (b.format && !["episode", "feature"].includes(b.format)) E(`format "${b.format}" must be episode | feature`);
if (b.id !== undefined && !kebab.test(b.id)) E(`id "${b.id}" not kebab-case`);
if (b.title !== undefined && !isStr(b.title, 3)) E("title missing / too short");
if (b.tag !== undefined) {
  if (b.tag.length > 48) E(`tag ${b.tag.length} chars — will ellipsize (≤ 38)`);
  else if (b.tag.length > 38) W(`tag ${b.tag.length} chars — aim ≤ 38`);
}
if (b.audience) {
  if (!isStr(b.audience.who)) E("audience.who missing");
  if (!isStr(b.audience.leaves_knowing)) E("audience.leaves_knowing missing — this is beat 8");
}
const ARCH = ["derivation", "process", "code", "state", "transformation", "comparison"];
if (b.archetype !== undefined && !ARCH.includes(b.archetype)) E(`archetype "${b.archetype}" not in ${ARCH.join("|")}`);
const BAND = ["worked_math", "payload", "trace", "count", "terms"];
if (b.detail_band !== undefined && !BAND.includes(b.detail_band)) E(`detail_band "${b.detail_band}" not in ${BAND.join("|")}`);
if (b.mechanism !== undefined) {
  if (!isStr(b.mechanism, 40)) E("mechanism missing / too short");
  else { const n = sentences(b.mechanism); if (n < 2 || n > 5) W(`mechanism is ${n} sentence(s); aim 2–4`); }
}
if (b.critique_of_obvious !== undefined && !isStr(b.critique_of_obvious, 20)) E("critique_of_obvious missing — say why the static diagram fails");
if (b.aha !== undefined && !isStr(b.aha, 40)) E("aha missing / < 40 chars (it becomes meta.synthesis)");
if (b.lede !== undefined) {
  if (!isStr(b.lede, 10)) E("lede missing");
  else if ((b.lede.match(/<em>/g) || []).length !== 1) W("lede should carry exactly one <em> word");
}

/* ---- anchor + worked example ---- */
if (b.anchor) {
  if (!isStr(b.anchor.what)) E("anchor.what missing — the one element that persists");
  if (!isStr(b.anchor.motif)) E("anchor.motif missing");
}
const we = b.worked_example;
if (we) {
  const obj = (v) => v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0;
  if (!obj(we.inputs)) E("worked_example.inputs must be a non-empty object of raw values");
  if (!isStr(we.derivation, 20)) E("worked_example.derivation missing — the rule the code implements");
  if (!obj(we.expected)) E("worked_example.expected must be a non-empty object of figures __AUDIT asserts");
  else for (const [k, v] of Object.entries(we.expected))
    if (typeof v === "string" && /todo|tbd|\?\?/i.test(v)) E(`worked_example.expected.${k} is a placeholder ("${v}")`);
}

/* ---- refs + conserved ---- */
const refs = Array.isArray(b.refs) ? b.refs : [];
if (b.refs !== undefined && (!refs.length || refs.some((r) => !isStr(r && r.title)))) E("refs must list ≥ 1 real source with a title");
const claims = (b.conserved && Array.isArray(b.conserved.claims)) ? b.conserved.claims : [];
const claimIds = new Set();
if (b.conserved) {
  if (!isStr(b.conserved.motif)) E("conserved.motif missing");
  if (!claims.length) E("conserved.claims must list ≥ 1 claim");
  claims.forEach((c, i) => {
    if (!c || !kebab.test(c.id || "")) E(`conserved.claims[${i}].id not kebab-case`);
    else if (claimIds.has(c.id)) E(`duplicate claim id "${c.id}"`); else claimIds.add(c.id);
    if (!isStr(c && c.text, 10)) E(`conserved.claims[${i}].text missing`);
    if (!Number.isInteger(c && c.ref) || c.ref < 0 || c.ref >= refs.length) E(`conserved.claims[${i}].ref must index refs (0–${refs.length - 1})`);
  });
  if (typeof b.conserved.duration_s !== "number") E("conserved.duration_s missing");
}

/* ---- beats (episode) / movements (feature) ---- */
let dur = 0;
const carried = new Set();
if (b.format === "episode" || b.format === undefined) {
  const beats = Array.isArray(b.beats) ? b.beats : [];
  if (!Array.isArray(b.beats)) E("beats missing");
  if (beats.length !== 8) E(`beats=${beats.length}, expected 8`);
  const ids = new Set();
  beats.forEach((x, i) => {
    const n = i + 1;
    if (!x || !kebab.test(x.id || "")) E(`beat ${n}: id not kebab-case`);
    else if (ids.has(x.id)) E(`beat ${n}: duplicate id "${x.id}"`); else ids.add(x.id);
    if (!isStr(x && x.label)) E(`beat ${n}: label missing`);
    else if (x.label.length > 20) E(`beat ${n}: label "${x.label}" > 20 chars`);
    else if (x.label.length > 18) W(`beat ${n}: label "${x.label}" > 18 chars (tight on the chapter rail)`);
    if (typeof (x && x.dur) !== "number" || x.dur < 2 || x.dur > 8) E(`beat ${n}: dur must be 2–8 s`); else dur += x.dur;
    if (!isStr(x && x.caption)) E(`beat ${n}: caption missing`);
    else {
      if (x.caption.length > 118) E(`beat ${n}: caption ${x.caption.length} chars (> 118)`);
      if (sentences(x.caption) > 2) W(`beat ${n}: caption has ${sentences(x.caption)} sentences — it is one spoken idea`);
    }
    if (!isStr(x && x.idea)) E(`beat ${n}: idea missing (exactly one idea per beat)`);
    else if (sentences(x.idea) > 1) E(`beat ${n}: idea has ${sentences(x.idea)} sentences — one idea, one sentence`);
    if (!isStr(x && x.focal_motion)) E(`beat ${n}: focal_motion missing (the ONE thing that moves)`);
    if (!["anchor", "working", "detail"].includes(x && x.region)) E(`beat ${n}: region must be anchor | working | detail`);
    (x && x.claims || []).forEach((c) => { if (!claimIds.has(c)) E(`beat ${n}: carries unknown claim "${c}"`); carried.add(c); });
  });
  if (beats.length) {
    if (beats[0].region !== "anchor") E(`beat 1 must introduce the anchor (region "anchor"), got "${beats[0].region}"`);
    const last = beats[beats.length - 1];
    if ((last.label || "") !== "Why it matters") E(`last beat label is "${last.label}", expected exactly "Why it matters"`);
    const reuses = Array.isArray(last.reuses) ? last.reuses : [];
    if (!reuses.length) E("beat 8 must list `reuses` — it re-lights earlier beats, it does not invent layout");
    reuses.forEach((r) => { if (!ids.has(r) || r === last.id) E(`beat 8 reuses unknown beat "${r}"`); });
  }
  if (beats.length === 8 && (dur < 35 || dur > 45)) E(`duration=${dur.toFixed(1)}s, want 35–45`);
} else {
  const mv = Array.isArray(b.movements) ? b.movements : [];
  if (mv.length !== 7) E(`movements=${mv.length}, expected 7 (LONGFORM.md)`);
  mv.forEach((m, i) => {
    if (!m || !/^A[1-9]$/.test(m.archetype || "")) E(`movement ${i + 1}: archetype must be A1–A9`);
    if (!Array.isArray(m && m.window) || m.window.length !== 2) E(`movement ${i + 1}: window [start,end] missing`);
    if (!isStr(m && m.payoff)) E(`movement ${i + 1}: exactly one payoff, name it`);
    (m && m.claims || []).forEach((c) => { if (!claimIds.has(c)) E(`movement ${i + 1}: unknown claim "${c}"`); carried.add(c); });
  });
  if (mv.length === 7) dur = mv[6].window[1];
  if (mv.length === 7 && (dur < 100 || dur > 140)) E(`feature duration=${dur}s, want 100–140`);
  const caps = Array.isArray(b.captions) ? b.captions : [];
  if (caps.length < 15 || caps.length > 20) E(`captions=${caps.length}, want 15–20 lines`);
  caps.forEach((c, i) => { if (c.length > 90) E(`caption ${i + 1} is ${c.length} chars (> 90)`); });
  if (mv.length === 7 && mv[5].archetype !== "A6") W("movement 6 should be the Limits beat (A6 paired cards) — non-negotiable in LONGFORM.md");
}

/* ---- voice ---- */
const prose = [b.title, b.lede, b.mechanism, b.aha, ...(b.beats || []).map((x) => x && x.caption), ...(b.beats || []).map((x) => x && x.label), ...(b.captions || [])].filter(Boolean).join("\n");
for (const h of HYPE) if (prose.toLowerCase().includes(h)) E(`hype word "${h}" — cut it`);
if (EMOJI.test(prose)) E("emoji in copy — remove it");

/* ---- Φ: motif ∧ claims ∧ duration ---- */
const phi = { motif: null, claims: null, duration: null };
if (b.anchor && b.conserved) {
  phi.motif = b.anchor.motif === b.conserved.motif;
  if (!phi.motif) E(`Φ motif: anchor.motif "${b.anchor.motif}" ≠ conserved.motif "${b.conserved.motif}" — one motif family`);
}
if (claims.length) {
  const missing = [...claimIds].filter((c) => !carried.has(c));
  phi.claims = missing.length === 0;
  if (!phi.claims) E(`Φ claims: no beat carries ${missing.map((m) => `"${m}"`).join(", ")} — a claim nothing shows does not glue`);
}
if (b.conserved && typeof b.conserved.duration_s === "number" && dur) {
  phi.duration = Math.abs(b.conserved.duration_s - dur) < 0.5;
  if (!phi.duration) E(`Φ duration: conserved.duration_s=${b.conserved.duration_s} but beats sum to ${dur.toFixed(1)}`);
}

const mark = (v) => (v === null ? "·" : v ? "✓" : "✗");
const ledger = `Φ  motif ${mark(phi.motif)}  claims ${carried.size}/${claimIds.size} ${mark(phi.claims)}  duration ${dur.toFixed(1)}s ${mark(phi.duration)}`;
if (errs.length) {
  console.log("FAIL:\n- " + errs.join("\n- "));
  console.log(ledger);
  if (warns.length) console.log("warnings:\n- " + warns.join("\n- "));
  process.exit(1);
}
console.log(`PASS · ${b.format || "episode"} · ${b.archetype} · ${b.id}`);
console.log(ledger);
if (warns.length) console.log("warnings:\n- " + warns.join("\n- "));
process.exit(0);
