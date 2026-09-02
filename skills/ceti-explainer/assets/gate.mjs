#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SVG_NS = "http://www.w3.org/2000/svg";

function parseStyle(text) {
  const out = {};
  String(text || "").split(";").forEach((part) => {
    const idx = part.indexOf(":");
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  });
  return out;
}

class Node {
  constructor() {
    this.parentNode = null;
    this.ownerDocument = null;
    this.childNodes = [];
  }
  appendChild(node) {
    node.parentNode = this;
    node.ownerDocument = this.ownerDocument || this;
    this.childNodes.push(node);
    return node;
  }
  get children() {
    return this.childNodes.filter((node) => node instanceof Element);
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
  querySelectorAll(selector) {
    const results = [];
    const match = makeMatcher(selector);
    const walk = (node) => {
      if (node instanceof Element && match(node)) results.push(node);
      node.childNodes.forEach(walk);
    };
    this.childNodes.forEach(walk);
    return results;
  }
}

class Element extends Node {
  constructor(tagName, namespaceURI = null) {
    super();
    this.tagName = tagName.toLowerCase();
    this.namespaceURI = namespaceURI;
    this.attributes = {};
    this.style = {};
    this._text = "";
  }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "style") Object.assign(this.style, parseStyle(value));
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }
  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }
  removeAttribute(name) {
    delete this.attributes[name];
  }
  set textContent(value) {
    this._text = String(value);
    this.childNodes = [];
  }
  get textContent() {
    if (this.childNodes.length) return this.childNodes.map((node) => node.textContent).join("");
    return this._text;
  }
  getComputedTextLength() {
    const size = fontSize(this);
    return this.textContent.length * size * 0.58;
  }
  getBBox() {
    if (this.tagName === "text") {
      const size = fontSize(this);
      const x = num(this.getAttribute("x"));
      const y = num(this.getAttribute("y"));
      const height = size * 1.2;
      return { x, y: y - height * 0.82, width: this.getComputedTextLength(), height };
    }
    if (this.tagName === "rect" || this.tagName === "image") {
      return { x: num(this.getAttribute("x")), y: num(this.getAttribute("y")), width: num(this.getAttribute("width")), height: num(this.getAttribute("height")) };
    }
    if (this.tagName === "circle") {
      const r = num(this.getAttribute("r"));
      const cx = num(this.getAttribute("cx"));
      const cy = num(this.getAttribute("cy"));
      return { x: cx - r, y: cy - r, width: r * 2, height: r * 2 };
    }
    if (this.tagName === "line") {
      const x1 = num(this.getAttribute("x1"));
      const x2 = num(this.getAttribute("x2"));
      const y1 = num(this.getAttribute("y1"));
      const y2 = num(this.getAttribute("y2"));
      return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
    }
    return unionBox(this.children.filter(isVisible).map((child) => child.getBBox()));
  }
}

class Document extends Node {
  constructor() {
    super();
    this.ownerDocument = this;
    this.body = this.createElement("body");
    super.appendChild(this.body);
  }
  createElement(tagName) {
    const node = new Element(tagName, null);
    node.ownerDocument = this;
    return node;
  }
  createElementNS(namespaceURI, tagName) {
    const node = new Element(tagName, namespaceURI);
    node.ownerDocument = this;
    return node;
  }
}

function makeMatcher(selector) {
  selector = selector.trim();
  if (selector.startsWith("[") && selector.endsWith("]")) {
    const attr = selector.slice(1, -1).split("=")[0].trim();
    return (node) => node.hasAttribute(attr);
  }
  const tag = selector.toLowerCase();
  return (node) => node.tagName === tag;
}

function num(value) {
  const n = Number(value == null ? 0 : value);
  return Number.isFinite(n) ? n : 0;
}

function fontSize(node) {
  return num(node.getAttribute("font-size") || node.style["font-size"] || 16) || 16;
}

function effectiveOpacity(node) {
  let value = 1;
  let current = node;
  while (current && current instanceof Element) {
    const own = current.getAttribute("opacity") ?? current.style.opacity;
    if (own != null && own !== "") value *= Number(own);
    current = current.parentNode;
  }
  return Number.isFinite(value) ? value : 0;
}

function isVisible(node) {
  if (!(node instanceof Element)) return false;
  const visibility = node.getAttribute("visibility") || node.style.visibility;
  const display = node.getAttribute("display") || node.style.display;
  return visibility !== "hidden" && display !== "none" && effectiveOpacity(node) > 0.001;
}

function unionBox(boxes) {
  const valid = boxes.filter((box) => box && box.width >= 0 && box.height >= 0);
  if (!valid.length) return { x: 0, y: 0, width: 0, height: 0 };
  const x1 = Math.min(...valid.map((box) => box.x));
  const y1 = Math.min(...valid.map((box) => box.y));
  const x2 = Math.max(...valid.map((box) => box.x + box.width));
  const y2 = Math.max(...valid.map((box) => box.y + box.height));
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

function overlap(a, b) {
  const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return ox > 1 && oy > 1 ? { ox, oy } : null;
}

function loadEpisode(episodePath) {
  const document = new Document();
  const window = {
    document,
    console,
    Math,
    Number,
    String,
    Object,
    Array,
    JSON,
    Date,
    parseFloat,
    parseInt,
    isNaN,
    SVGElement: Element,
    Element,
    Node,
    getComputedStyle(node) {
      return {
        opacity: String(node.getAttribute("opacity") ?? node.style.opacity ?? 1),
        visibility: node.getAttribute("visibility") || node.style.visibility || "visible",
        display: node.getAttribute("display") || node.style.display || "inline",
        fontSize: String(fontSize(node))
      };
    }
  };
  window.window = window;
  window.globalThis = window;
  document.defaultView = window;
  const assetsDir = path.dirname(fileURLToPath(import.meta.url));
  const enginePath = path.join(assetsDir, "engine.js");
  const source = `${fs.readFileSync(enginePath, "utf8")}
${fs.readFileSync(episodePath, "utf8")}`;
  const evaluator = new Function("window", "document", "getComputedStyle", "console", source);
  evaluator(window, document, window.getComputedStyle, console);
  return { window, document };
}

function checkNaN(node, failures, trail = node.tagName || "root") {
  if (node instanceof Element) {
    for (const [name, value] of Object.entries(node.attributes)) {
      if (String(value).includes("NaN")) failures.push(`${trail} has NaN in ${name}`);
    }
    for (const [name, value] of Object.entries(node.style)) {
      if (String(value).includes("NaN")) failures.push(`${trail} has NaN in style ${name}`);
    }
  }
  node.childNodes.forEach((child, index) => checkNaN(child, failures, `${trail}/${child.tagName || index}`));
}

function failWith(messages, warnings) {
  console.log("FAIL");
  messages.forEach((message) => console.log(`- ${message}`));
  warnings.forEach((warning) => console.log(`! ${warning}`));
  process.exit(1);
}

const episodeArg = process.argv[2];
if (!episodeArg) {
  console.error(`Usage: node ${path.basename(process.argv[1])} <episode.js>`);
  process.exit(1);
}

const episodePath = path.resolve(process.cwd(), episodeArg);
const failures = [];
const warnings = [];

try {
  const { window, document } = loadEpisode(episodePath);
  const episode = window.EXPLAINER;
  if (!episode) failures.push("window.EXPLAINER is missing");
  if (failures.length) failWith(failures, warnings);

  const meta = episode.meta || {};
  const beats = Array.isArray(episode.beats) ? episode.beats.map((beat, index) => {
    const start = index === 0 ? 0 : episode.beats.slice(0, index).reduce((sum, item) => sum + item.dur, 0);
    return { ...beat, index, start, end: start + beat.dur };
  }) : [];
  const duration = beats.reduce((sum, beat) => sum + beat.dur, 0);

  if (beats.length !== 8) failures.push(`expected exactly 8 beats, got ${beats.length}`);
  if (duration < 33 || duration > 46) failures.push(`duration ${duration.toFixed(1)}s is outside 33–46s`);
  if (!beats.length || beats[beats.length - 1].label !== "Why it matters") failures.push('last beat label must be "Why it matters"');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.id || "")) failures.push(`meta.id must be kebab-case, got ${meta.id || "<missing>"}`);
  if (!meta.synthesis || !String(meta.synthesis).trim()) failures.push("meta.synthesis must be present");
  if (typeof episode.setMath !== "function" && typeof episode.setDetail !== "function") failures.push("episode must expose setMath or setDetail");
  beats.forEach((beat, index) => {
    if ((beat.label || "").length > 20) failures.push(`beat ${index + 1} label exceeds 20 chars: ${beat.label}`);
    if ((beat.caption || "").length > 118) failures.push(`beat ${index + 1} caption exceeds 118 chars`);
  });
  if ((meta.tag || "").length > 38) warnings.push(`meta.tag is ${meta.tag.length} chars and may ellipsize`);

  const stage = document.createElement("div");
  document.body.appendChild(stage);
  episode.build(stage, { beats, duration, ex: window.CetiExplainer });
  if (typeof episode.setMath === "function") episode.setMath(true);
  if (typeof episode.setDetail === "function") episode.setDetail(true);

  const samples = new Set([0, duration]);
  for (let i = 0; i <= 160; i += 1) samples.add((duration * i) / 160);
  beats.forEach((beat) => {
    samples.add(beat.start);
    samples.add((beat.start + beat.end) / 2);
    samples.add(Math.max(0, beat.end - 1e-4));
  });

  const svg = stage.querySelector("svg");
  if (!svg) failures.push("build() must create an SVG");

  const layoutNodes = typeof window.__LAYOUT === "function" ? window.__LAYOUT() : null;

  [...samples].sort((a, b) => a - b).forEach((t) => {
    try {
      episode.render(t, { t, duration, beats, activeBeat: beats.find((beat) => t >= beat.start && t <= beat.end) || beats[beats.length - 1], flags: { math: true }, ex: window.CetiExplainer });
    } catch (error) {
      failures.push(`render(${t.toFixed(2)}) threw: ${error.message}`);
      return;
    }

    checkNaN(stage, failures);

    if (typeof window.__REGIONS === "function") {
      const regions = window.__REGIONS() || {};
      Object.entries(regions).forEach(([name, nodes]) => {
        const lit = (nodes || []).filter((node) => isVisible(node) && effectiveOpacity(node) > 0.55);
        if (lit.length > 1) failures.push(`region ${name} has ${lit.length} scenes lit at t=${t.toFixed(2)}s`);
      });
    }

    if (layoutNodes) {
      const visible = layoutNodes
        .map((node, index) => ({ index, node, box: node.getBBox(), opacity: effectiveOpacity(node) }))
        .filter((item) => item.opacity > 0.55 && item.box.width > 0 && item.box.height > 0);
      for (let i = 0; i < visible.length; i += 1) {
        for (let j = i + 1; j < visible.length; j += 1) {
          const ov = overlap(visible[i].box, visible[j].box);
          if (ov) failures.push(`blocks #${visible[i].index} & #${visible[j].index} overlap ${Math.round(ov.ox)}×${Math.round(ov.oy)} at t=${t.toFixed(2)}s`);
        }
      }
    }
  });

  if (typeof window.__AUDIT === "function") {
    const audit = window.__AUDIT();
    if (!audit || audit.ok !== true) failures.push(`__AUDIT failed${audit && audit.msg ? `: ${audit.msg}` : ""}`);
  }

  if (failures.length) failWith(failures, warnings);
  console.log("PASS");
  warnings.forEach((warning) => console.log(`! ${warning}`));
  if (process.env.DEBUG_GATE) console.log(pathToFileURL(episodePath).href);
} catch (error) {
  failWith([error.stack || error.message], warnings);
}
