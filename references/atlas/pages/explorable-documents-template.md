---
id: explorable-documents-template
title: "Explorable Documents template"
type: Work
aliases: ["Interactive sandbox template", "interactivesandbox", "explorable documents with p5"]
sources: [S105, S211]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Explorable Documents template

## Definition
The Explorable Documents template ("interactive sandbox") by Aatish Bhatia is a page template mixing Markdown prose and math with p5 instance-mode interactives driven by sliders and mouse [S105].

## Details
- It recommends writing explorables in instance mode so several canvases coexist on one page [S105].
- Interactives respond to sliders and mouse input inline with the text [S105].

## In explainer work
- For scroll or article explainers, instance mode is the prerequisite for multiple live figures per page (see [[instance-mode]]) [S105].

## Patterns
**Name:** one p5 instance per figure.
**When to use:** an article with several live diagrams [S105].
```js
const fig = (id, draw) => new p5(p => {
  let k;
  p.setup = () => { p.createCanvas(320, 140); k = p.createSlider(1, 9, 3); };
  p.draw = () => { p.background(245); draw(p, k.value()); };
}, document.getElementById(id));
fig('fig1', (p, v) => p.circle(160, 70, v * 12));
```
**Pitfalls:** global mode allows only one sketch per page; each instance needs its own container [S105].

## Relations
- uses [[instance-mode]] — required for multiple canvases [S105]
- uses [[dom-controls]] — sliders [S105]
- related_to [[dynamic-learning]] — iframe-based alternative [S211]
- related_to [[coding-train-episode-package]] — explorable variant [S105]
- related_to [[hub-people-community]] (structural)
## Sources
- [S105] — aatishb.com interactive sandbox
- [S211] — Dynamic Learning
