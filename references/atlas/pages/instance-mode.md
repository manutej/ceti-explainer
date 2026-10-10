---
id: instance-mode
title: "Instance mode"
type: Concept
aliases: ["new p5(fn, node)", "p5 instance", "p5 constructor", "Instance-mode embed", "instance cleanup"]
sources: [S96, S100, S101, S105, S249, S250]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Instance mode

## Definition
Instance mode wraps a sketch in a function that receives a p5 object and is passed to `new p5(fn, node)`, giving each sketch its own namespace [S96][S101]. The optional `node` is an element or its id string that sets where the canvas is placed [S96].

## Details
- Avoids global-namespace collisions with other libraries and between sketches on one page; the reference names it as the way to run multiple sketches per page [S96][S101].
- Typical shape: `p.setup`/`p.draw` assigned inside the function, with every API call prefixed by `p.` [S96].
- Wrappers exist: `@p5-wrapper/react` v5 needs p5 2.x and React 19, and `p5i` allows destructuring and deferred mounting with TS types [S249][S250].
- Aatish Bhatia's explorable-documents template recommends writing p5 explorables in instance mode, mixing Markdown, math and sliders [S105].
- Offscreen sketches on a long page can be paused with `noLoop()` and resumed with `loop()` (see [[loop-control]]); the forum advice covers only the noLoop/redraw idea [S100].

## In explainer work
Instance mode is the documented embed path for scrollytelling-style pages and article figures: one `new p5(fig, 'fig1')` per figure keeps sketches isolated [S101][S105]. Evidence for p5 scrollytelling practice is thin; only forum advice on pausing offscreen sketches was found [S100].

## Patterns
**Instance-mode embed.** When: several sketches in one article. Pitfall: stray global setup/draw forces global mode [S96].
```js
const fig = p => {
  p.setup = () => p.createCanvas(300, 200);
  p.draw  = () => p.background(220);
};
new p5(fig, 'fig1');
```

## Relations
- part_of [[hub-language-core]] (structural)
- alternative_to [[global-mode]] — namespaced instead of window-level [S96]
- uses [[explorable-documents-template]] — template written in instance mode [S105]
- integrates_with [[p5-wrapper-react]] — React wrapper hosts instance-mode sketches [S249]
- integrates_with [[p5i]] — instance-mode wrapper library [S250]
- enables [[layered-compositing]] — multiple canvases per page (inference) [S101]

## Sources
- [S96] — p5.js wiki: Global and instance mode
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S101] — p5.js reference: p5() constructor
- [S105] — Aatish Bhatia, Creating Explorable Documents With p5.js (template)
- [S249] — P5-wrapper/react README
- [S250] — antfu/p5i README
