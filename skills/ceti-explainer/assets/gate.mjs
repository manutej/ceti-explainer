/* ════════════════════════════════════════════════════════════════════
   CETI Explainer — automated quality gate (Node, no browser needed)
   --------------------------------------------------------------------
   Loads engine.js + your episode module under a tiny SVG-DOM shim, then:
     • runs build() once and render(t) across the WHOLE timeline (catches
       crashes, undefined nodes, NaN attributes — the real failure modes),
     • asserts the SPEC §15a contract (8 beats, 35–45s, last beat
       "Why it matters", caption lengths, setMath, tag length, an <svg>),
     • lets the module self-report a math invariant via window.__AUDIT().

   Usage:  node gate.mjs <episode.js>
   Exit 0 = PASS, 1 = FAIL.  Run it before every ship.
   ──────────────────────────────────────────────────────────────────── */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const epPath = process.argv[2];
if (!epPath) { console.error("usage: node gate.mjs <episode.js>"); process.exit(1); }

/* ---- minimal SVG-DOM shim ---- */
let nodeCount = 0, attrSets = 0, badAttr = [];
function makeNode(tag) {
  nodeCount++;
  const n = {
    tagName: tag, _a: {}, children: [], lastChild: null, style: {}, textContent: "",
    setAttribute(k, v) {
      attrSets++;
      if (v === undefined || v === null || (typeof v === "number" && Number.isNaN(v)) ||
          (typeof v === "string" && v.includes("NaN")))
        badAttr.push(`<${tag} ${k}="${v}">`);
      this._a[k] = v;
    },
    getAttribute(k) { return this._a[k]; },
    appendChild(c) { this.children.push(c); this.lastChild = c; return c; },
    setAttributeNS(_ns, k, v) { this.setAttribute(k, v); },
    addEventListener() {}, removeEventListener() {},
    getBoundingClientRect() { return { x:0, y:0, width:100, height:16, top:0, left:0 }; },
    querySelector() { return null; }, querySelectorAll() { return []; },
  };
  return n;
}
const document = {
  createElementNS: (_ns, tag) => makeNode(tag),
  createElement: (tag) => makeNode(tag),
  addEventListener() {}, querySelector() { return null; },
};
globalThis.window = { matchMedia: () => ({ matches: false, addListener(){}, addEventListener(){} }) };
globalThis.document = document;
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

/* ---- load engine + module ---- */
const engineSrc = fs.readFileSync(path.join(HERE, "engine.js"), "utf8");
const epSrc = fs.readFileSync(epPath, "utf8");
const errs = [], warns = [];
try { (0, eval)(engineSrc); } catch (e) { errs.push("engine.js failed to load: " + e.message); }
if (!window.CetiExplainer) errs.push("window.CetiExplainer missing after engine load");
try { (0, eval)(epSrc); } catch (e) { errs.push("episode module threw at load: " + e.message); }

const m = window.EXPLAINER;
if (!m) { errs.push("window.EXPLAINER missing (module must end with window.EXPLAINER = ...)"); fail(); }

/* ---- static contract (SPEC §15a) ---- */
const b = m.beats || [];
const dur = b.reduce((a, x) => a + (x.dur || 0), 0);
if (b.length !== 8) errs.push(`beats=${b.length}, expected 8`);
if (dur < 33 || dur > 46) errs.push(`duration=${dur.toFixed(1)}s, want 35–45`);
if (b.length && (b[b.length-1].label || "").toLowerCase() !== "why it matters")
  errs.push(`last beat is "${b[b.length-1].label}", expected "Why it matters"`);
const capMax = Math.max(0, ...b.map(x => (x.caption||"").length));
if (capMax > 118) errs.push(`longest caption ${capMax} chars (>118 risks overflow)`);
if (b.some(x => (x.label||"").length > 20)) errs.push("a beat label >20 chars (chapter rail)");
if (typeof m.setMath !== "function" && typeof m.setDetail !== "function")
  errs.push("setMath()/setDetail() missing (Detail-band tweak hook)");
if (!m.meta) errs.push("meta missing");
else {
  // §15a: tag must not ellipsize. Char count alone missed it before; also
  // estimate rendered width (mono 11px, ~0.12em tracking ≈ 7.9px/char).
  const tagLen = (m.meta.tag||"").length;
  const tagPx = tagLen * 7.9;
  if (tagLen > 48) errs.push(`tag ${tagLen} chars — will ellipsize; keep ≤ ~38`);
  else if (tagLen > 38) warns.push(`tag ${tagLen} chars (~${Math.round(tagPx)}px) — aim ≤ 38 to be safe on small screens`);
  if (!m.meta.id) errs.push("meta.id missing (storageKey + filename stem)");
  else if (!/^[a-z0-9-]+$/.test(m.meta.id)) errs.push(`meta.id "${m.meta.id}" not kebab-case`);
  if (!m.meta.title) errs.push("meta.title missing");
  if (!m.meta.synthesis || m.meta.synthesis.length < 40) errs.push("meta.synthesis missing/too short");
}

/* ---- exercise build() + render() across the timeline ---- */
if (typeof m.build !== "function") errs.push("build() missing or not a function");
if (typeof m.render !== "function") errs.push("render() missing or not a function");
if (typeof m.build === "function" && typeof m.render === "function" && b.length === 8) {
  let cursor = 0;
  const beats = b.map((x, i) => { const start = cursor; cursor += x.dur; return { ...x, index: i, start, end: cursor }; });
  const ex = window.CetiExplainer;
  const stage = makeNode("div");
  try { m.build(stage, { beats, duration: dur, ex }); }
  catch (e) { errs.push("build() threw: " + e.message); }
  const hasSvg = stage.children.some(c => c.tagName === "svg");
  if (!hasSvg) errs.push("no <svg> mounted on the stage");
  const ai = (t) => { for (let i = beats.length-1; i>=0; i--) if (t >= beats[i].start - 1e-4) return i; return 0; };
  try {
    for (let t = 0; t <= dur + 0.001; t += 0.2)
      m.render(t, { t, duration: dur, beats, activeBeat: ai(t), ex });
    m.render(dur, { t: dur, duration: dur, beats, activeBeat: 7, ex });
  } catch (e) { errs.push("render() threw during timeline sweep: " + e.message); }
  if (badAttr.length) errs.push(`NaN/undefined attribute(s) set, e.g. ${badAttr.slice(0,3).join(", ")}`);

  /* §15b — paused-frame == playing-frame. Sweep the whole timeline and assert
     at most ONE scene is lit per shared region at any instant. Two half-lit
     scenes in the same region = scrubbable "double-exposure" mush. Requires the
     module to expose its scene groups: window.__REGIONS = () => ({ region:[g,…] }). */
  if (typeof window.__REGIONS === "function") {
    let regions;
    try { regions = window.__REGIONS(); } catch (e) { errs.push("__REGIONS() threw: " + e.message); regions = null; }
    const LIT = 0.15; // anything ≥ this reads as "on screen"
    const worst = {};
    if (regions) for (let t = 0; t <= dur + 0.001; t += 0.1) {
      m.render(t, { t, duration: dur, beats, activeBeat: ai(t), ex });
      for (const name in regions) {
        const lit = regions[name].filter(g => g && +(g.style.opacity ?? 1) >= LIT);
        if (lit.length > (worst[name]?.n || 0)) worst[name] = { n: lit.length, t: t.toFixed(1) };
      }
    }
    for (const name in worst) if (worst[name].n > 1)
      errs.push(`region "${name}": ${worst[name].n} scenes lit at t=${worst[name].t}s — use ex.seg (not pulse) so same-region scenes hand off through an empty gap`);
  } else {
    warns.push("no window.__REGIONS() — per-region overlap (paused-frame mush) not auto-checked; expose scene groups to enable §15b");
  }

  /* §15d — NO TWO VISIBLE BLOCKS OVERLAP (the general anti-collision gate).
     The module lists its top-level "blocks" (panels, scenes, anchor items, the
     traveling packet, …) via window.__LAYOUT = () => [node, …]. Each frame we
     compute every block's REAL absolute bbox (walking <g> translates) and its
     effective opacity, then fail if two VISIBLE blocks overlap. Catches the whole
     class: anchor-over-panel, mover-over-box, a scene spilling into another. */
  if (typeof window.__LAYOUT === "function") {
    const svg = stage.children.find(c => c.tagName === "svg");
    let blocks = [];
    try { blocks = (window.__LAYOUT() || []).filter(Boolean); }
    catch (e) { errs.push("__LAYOUT() threw: " + e.message); }
    const set = new Set(blocks);
    const pT = (s) => { if (!s) return [0, 0]; const m = /translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)?/.exec(s); return m ? [+m[1], +(m[2] || 0)] : [0, 0]; };
    const tw = (n) => { const fs = parseFloat(n._a["font-size"]) || 12; const len = (n.textContent || "").length; const mono = (n._a["font-family"] || "").includes("mono"); return len * fs * (mono ? 0.62 : 0.55); };
    function frame() {
      const vis = new Map(), box = new Map();
      (function dfs(node, tx, ty, op, active) {
        const [dx, dy] = pT(node._a && node._a.transform); tx += dx; ty += dy;
        const so = node.style && node.style.opacity; const o = (so === undefined || so === "") ? 1 : +so; op *= Number.isNaN(o) ? 1 : o;
        if (set.has(node)) { vis.set(node, op); active = active.concat([node]); if (!box.has(node)) box.set(node, [1e9, 1e9, -1e9, -1e9]); }
        if (active.length && op >= 0.3) {
          const ex2 = (x0, y0, x1, y1) => { for (const b of active) { const r = box.get(b); r[0] = Math.min(r[0], x0); r[1] = Math.min(r[1], y0); r[2] = Math.max(r[2], x1); r[3] = Math.max(r[3], y1); } };
          if (node.tagName === "rect") { const x = +node._a.x + tx, y = +node._a.y + ty, w = +node._a.width || 0, h = +node._a.height || 0; if (!Number.isNaN(x) && !Number.isNaN(y)) ex2(x, y, x + w, y + h); }
          else if (node.tagName === "text" || node.tagName === "line") {
            if (node.tagName === "text") { const fx = +node._a.x + tx, fy = +node._a.y + ty, w = tw(node), fs = parseFloat(node._a["font-size"]) || 12; const a = node._a["text-anchor"]; let x0 = fx; if (a === "middle") x0 = fx - w / 2; else if (a === "end") x0 = fx - w; if (!Number.isNaN(fx) && !Number.isNaN(fy) && node.textContent) ex2(x0, fy - fs, x0 + w, fy + fs * 0.35); }
          }
        }
        (node.children || []).forEach(c => dfs(c, tx, ty, op, active));
      })(svg, 0, 0, 1, []);
      return { vis, box };
    }
    const VIS = 0.5, TOLX = 6, TOLY = 5; let worst = null;
    for (let t = 0; t <= dur + 0.001; t += 0.1) {
      m.render(t, { t, duration: dur, beats, activeBeat: ai(t), ex });
      const { vis, box } = frame();
      for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
        if ((vis.get(blocks[i]) || 0) < VIS || (vis.get(blocks[j]) || 0) < VIS) continue;
        const ra = box.get(blocks[i]), rb = box.get(blocks[j]);
        if (!ra || !rb || ra[2] <= ra[0] || rb[2] <= rb[0]) continue;
        const ox = Math.min(ra[2], rb[2]) - Math.max(ra[0], rb[0]);
        const oy = Math.min(ra[3], rb[3]) - Math.max(ra[1], rb[1]);
        if (ox > TOLX && oy > TOLY) { const area = ox * oy; if (!worst || area > worst.area) worst = { area, t: t.toFixed(1), a: i, b: j, ox: Math.round(ox), oy: Math.round(oy) }; }
      }
    }
    if (worst) errs.push(`blocks #${worst.a} & #${worst.b} OVERLAP ${worst.ox}×${worst.oy}px at t=${worst.t}s — visible blocks must not collide (re-place it, fade one out, or move it to another zone). See SKILL "Preventing overlaps".`);
  } else {
    warns.push("no window.__LAYOUT() — block overlap not auto-checked (§15d); list top-level blocks to enable the anti-collision gate");
  }
}

/* ---- optional math invariant the module can expose ---- */
if (typeof window.__AUDIT === "function") {
  try {
    const r = window.__AUDIT();
    if (r && r.ok === false) errs.push("__AUDIT() math invariant failed: " + (r.msg || "see module"));
    else if (r && r.note) warns.push("__AUDIT: " + r.note);
  } catch (e) { errs.push("__AUDIT() threw: " + e.message); }
} else {
  warns.push("no window.__AUDIT() — math invariant not auto-checked (verify worked numbers by hand)");
}

function fail() {
  console.log("FAIL:\n- " + errs.join("\n- "));
  if (warns.length) console.log("warnings:\n- " + warns.join("\n- "));
  process.exit(1);
}
if (nodeCount === 0) errs.push("no nodes drawn");
if (errs.length) fail();
console.log(`PASS · ${dur.toFixed(1)}s · 8 beats · ${nodeCount} nodes · ${attrSets} attr-sets`);
if (warns.length) console.log("warnings:\n- " + warns.join("\n- "));
process.exit(0);
