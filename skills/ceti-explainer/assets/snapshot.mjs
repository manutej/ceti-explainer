#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
    const tag = selector.toLowerCase();
    const walk = (node) => {
      if (node instanceof Element && node.tagName === tag) results.push(node);
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
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }
  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }
  set textContent(value) {
    this._text = String(value);
    this.childNodes = [];
  }
  get textContent() {
    if (this.childNodes.length) return this.childNodes.map((node) => node.textContent).join("");
    return this._text;
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
    window: null,
    globalThis: null,
    getComputedStyle() {
      return { opacity: "1", visibility: "visible", display: "inline", fontSize: "16" };
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

function escapeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serialize(node) {
  if (!(node instanceof Element)) return escapeText(node.textContent || "");
  const attrs = Object.entries(node.attributes).map(([name, value]) => ` ${name}="${String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`).join("");
  const style = Object.entries(node.style).length
    ? ` style="${Object.entries(node.style).map(([name, value]) => `${name}:${value}`).join(";")}"`
    : "";
  const content = node.childNodes.length ? node.childNodes.map(serialize).join("") : escapeText(node.textContent || "");
  return `<${node.tagName}${attrs}${style}>${content}</${node.tagName}>`;
}

const [episodeArg, timeArg, outArg] = process.argv.slice(2);
if (!episodeArg || !timeArg || !outArg) {
  console.error(`Usage: node ${path.basename(process.argv[1])} <episode.js> <t-seconds> out.svg`);
  process.exit(1);
}

const episodePath = path.resolve(process.cwd(), episodeArg);
const t = Number(timeArg);
if (!Number.isFinite(t)) {
  console.error(`Invalid time: ${timeArg}`);
  process.exit(1);
}

const { window, document } = loadEpisode(episodePath);
const episode = window.EXPLAINER;
if (!episode) {
  console.error("window.EXPLAINER is missing");
  process.exit(1);
}

const beats = episode.beats.map((beat, index) => {
  const start = index === 0 ? 0 : episode.beats.slice(0, index).reduce((sum, item) => sum + item.dur, 0);
  return { ...beat, index, start, end: start + beat.dur };
});
const duration = beats.reduce((sum, beat) => sum + beat.dur, 0);
const stage = document.createElement("div");
document.body.appendChild(stage);
episode.build(stage, { beats, duration, ex: window.CetiExplainer });
if (typeof episode.setMath === "function") episode.setMath(true);
if (typeof episode.setDetail === "function") episode.setDetail(true);
episode.render(t, { t, duration, beats, activeBeat: beats.find((beat) => t >= beat.start && t <= beat.end) || beats[beats.length - 1], flags: { math: true }, ex: window.CetiExplainer });
const svg = stage.querySelector("svg");
if (!svg) {
  console.error("build() did not create an SVG");
  process.exit(1);
}
fs.writeFileSync(path.resolve(process.cwd(), outArg), serialize(svg) + "\n", "utf8");
