---
id: event-driven-redraw
title: "Event-driven redraw"
type: Pattern
aliases: ["on-demand rendering", "GoToLoop", "noLoop/redraw", "Pause offscreen sketches"]
sources: [S9, S90, S92, S100, S101, S111, S113]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Event-driven redraw

## Definition
Event-driven redraw halts the draw loop and repaints only when input arrives, using `noLoop()` plus `redraw()` inside callbacks; forum advice from GoToLoop recommends it for static or input-driven sketches [S100].

## Details
- Create controls once in `setup()` and attach `s.input(redraw)` so a slider repaints the figure [S90][S100].
- Whether `input()` versus `changed()` differs for sliders was not documented on the fetched pages; test it [S92][S111].
- `p5.Element` methods can be disabled by passing `false` [S92].
- Pausing offscreen sketches uses `noLoop()` when not visible and `loop()` when visible; the `IntersectionObserver` technique is a suggestion, not found in sources [S100].
- Scrollytelling with p5 has no dedicated practitioner source; the forum thread only mentions ScrollTrigger as an unconfirmed idea [S113].
- Instance mode lets several sketches share a page, each independently paused [S101].

## In explainer work
Static explainer figures that change on a slider or click save power and avoid frame drift; interactive pages benefit from pausing offscreen figures [S100][S101].

## Patterns
```js
let s;
function setup() { createCanvas(400, 300); noLoop(); s = createSlider(0, 10, 3, 0.1); s.input(redraw); }
function draw() { background(240); circle(200, 150, s.value() * 20); }
```
Pitfalls: `redraw` runs `draw` once per call; avoid creating controls inside `draw()` [S90][S9].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[loop-control]] — `noLoop` and `loop` [S100]
- uses [[redraw]] — repaint on input [S100]
- uses [[dom-controls]] — slider input [S90]
- related_to [[instance-mode]] — multiple figures per page [S101]
- related_to [[p5-element]] — input and changed callbacks [S92]

## Sources
- [S9] — redraw() reference
- [S90] — p5.js reference: createSlider()
- [S92] — p5.js reference: p5.Element
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S101] — p5.js reference: p5() constructor
- [S111] — p5.js reference: changed()
- [S113] — Discourse: How to trigger p5js sketch with scroll
