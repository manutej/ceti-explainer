/* ════════════════════════════════════════════════════════════════════
   CETI Explainer — headless frame snapshot (Node, no browser)
   --------------------------------------------------------------------
   Loads engine.js + an episode under a DOM shim, runs build()+render(t),
   then serializes the live <svg> tree to a standalone .svg with the
   --ex-* design tokens resolved to concrete colors and a dark ground.
   Lets you eyeball any beat's layout without a browser.

   Usage:  node snapshot.mjs <episode.js> <t-seconds> <out.svg>
           node snapshot.mjs rag.js 30 /tmp/rag-30.svg
   ──────────────────────────────────────────────────────────────────── */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [, , epPath, tArg, outPath] = process.argv;
if (!epPath || tArg === undefined || !outPath) {
  console.error("usage: node snapshot.mjs <episode.js> <t-seconds> <out.svg>"); process.exit(1);
}

/* ---- token → concrete value map (mirror of ceti-tokens / shell) ---- */
const VARS = {
  "--ex-ground": "#0E1014", "--ex-panel": "#171B23", "--ex-cell": "#1C212B",
  "--ex-ink": "#F5EFE3", "--ex-dim": "#A39A89", "--ex-line": "rgba(245,239,227,0.13)",
  "--ex-bar": "rgba(245,239,227,0.22)",
  "--ex-accent": "#CE9A6A", "--ex-accent-fill": "rgba(206,154,106,0.15)",
  "--ex-accent-glow": "rgba(206,154,106,0.35)", "--ex-accent2": "#8FA985",
  "--ex-support": "#6E8CA8", "--ex-peach": "#D88B5C",
  "--font-mono": "'DejaVu Sans Mono', monospace",
  "--font-sans": "'DejaVu Sans', sans-serif",
  "--font-display": "'DejaVu Serif', serif",
};
const resolve = (v) => {
  if (typeof v !== "string") return v;
  return v.replace(/var\((--[a-z0-9-]+)\)/gi, (_, n) => VARS[n] ?? "#888");
};

/* ---- DOM shim that keeps a serializable tree ---- */
function makeNode(tag) {
  return {
    tagName: tag, _a: {}, children: [], lastChild: null, style: {}, _text: "",
    set textContent(v) { this._text = v; }, get textContent() { return this._text; },
    setAttribute(k, v) { this._a[k] = v; },
    getAttribute(k) { return this._a[k]; },
    setAttributeNS(_n, k, v) { this._a[k] = v; },
    appendChild(c) { this.children.push(c); this.lastChild = c; return c; },
    addEventListener() {}, getBoundingClientRect() { return { width: 100, height: 16 }; },
    querySelector() { return null; }, querySelectorAll() { return []; },
  };
}
const document = { createElementNS: (_n, t) => makeNode(t), createElement: (t) => makeNode(t), addEventListener() {}, querySelector: () => null };
globalThis.window = { matchMedia: () => ({ matches: false }) };
globalThis.document = document;
globalThis.requestAnimationFrame = () => 0; globalThis.cancelAnimationFrame = () => {};
globalThis.localStorage = { getItem: () => null, setItem() {} };

(0, eval)(fs.readFileSync(path.join(HERE, "engine.js"), "utf8"));
(0, eval)(fs.readFileSync(epPath, "utf8"));
const m = window.EXPLAINER;

let cur = 0;
const beats = m.beats.map((b, i) => { const start = cur; cur += b.dur; return { ...b, index: i, start, end: cur }; });
const dur = cur;
const ex = window.CetiExplainer;
const stage = makeNode("div");
m.build(stage, { beats, duration: dur, ex });
const t = Math.max(0, Math.min(dur, parseFloat(tArg)));
const ai = (() => { for (let i = beats.length - 1; i >= 0; i--) if (t >= beats[i].start - 1e-4) return i; return 0; })();
m.render(t, { t, duration: dur, beats, activeBeat: ai, ex });

/* ---- serialize ---- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// effective opacity = own style.opacity (default 1) — used to PRUNE invisible
// subtrees, because many rasterizers ignore opacity on <g>. This gives a
// faithful single-frame view of what's actually on screen at time t.
function ser(n, depth, parentOpacity) {
  const own = (n.style.opacity === undefined || n.style.opacity === "") ? 1 : +n.style.opacity;
  const eff = parentOpacity * (Number.isNaN(own) ? 1 : own);
  if (eff < 0.04) return ""; // effectively invisible — drop it
  if (n.tagName === "foreignObject") {
    // resvg/convert won't render xhtml; emit the inner text as a plain <text>
    const div = n.children[0];
    const txt = div ? div._text : "";
    const x = +(n._a.x || 0) + 2, y = +(n._a.y || 0) + 14;
    return `<text x="${x}" y="${y}" font-family="${VARS["--font-sans"]}" font-size="12" fill="#A39A89">${esc(txt).slice(0,80)}</text>`;
  }
  const a = Object.entries(n._a).map(([k, v]) => `${k}="${esc(resolve(v))}"`).join(" ");
  const opAttr = (own < 0.999) ? ` opacity="${own.toFixed(3)}"` : "";
  const kids = n.children.map((c) => ser(c, depth + 1, eff)).join("");
  const text = n._text ? esc(n._text) : "";
  return `<${n.tagName} ${a}${opAttr}>${text}${kids}</${n.tagName}>`;
}
const svgNode = stage.children.find((c) => c.tagName === "svg");
const inner = svgNode.children.map((c) => ser(c, 0, 1)).join("\n");
const vb = svgNode._a.viewBox || "0 0 1000 464";
const [, , w, h] = vb.split(" ");
const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" font-family="${VARS["--font-sans"]}">
<rect x="0" y="0" width="${w}" height="${h}" fill="#0E1014"/>
${inner}
</svg>`;
fs.writeFileSync(outPath, out);
console.log(`wrote ${outPath} · t=${t.toFixed(1)}s · beat ${ai + 1} "${beats[ai].label}"`);
