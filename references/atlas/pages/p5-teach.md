---
id: p5-teach
title: "p5.teach.js"
type: Library
aliases: ["Aditya Siddheshwar", "two-ticks"]
sources: [S156, S325, S326, S327, S328]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# p5.teach.js

## Definition

p5.teach.js is a Manim- and reanimate-inspired p5 add-on from GSoC 2021 for animating text, TeX and graphs, with a Scene, timeline and play/pause controls. [S325][S326]

## Details

- TeX converts to SVG with MathJax, is added via p5.DOM and animates with anime.js. [S325]
- createControls() gives play, pause and restart; named effects include write, fadeIn, fadeOut, waveIn, waveOut and createFill. [S325][S326]
- A 2019 GSoC proposal aimed to render KaTeX in p5 and animate expression transitions, split into two accepted projects. [S327]
- It is listed on p5js.org as a beginner math-animation library. [S156]
- Maintenance 2026 and 2.x: repo dates were blank, so status is unverified. [S325]

## In explainer work

Its MathJax-through-DOM design shows the usual way to get formulas into a p5 explainer, at the cost of a second animation engine (anime.js). [S325]

## Relations

- alternative_to [[manim]] — p5-hosted Manim-style API [S325]
- related_to [[manim-js]] — sibling p5 Manim port [S325][S328]
- related_to [[p5js-libraries-directory]] — listed there [S156]
- related_to [[dom-controls]] — uses p5.DOM and createControls [S325]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S325] — 'p5.teach: Teaching Math through Animations and Simulations' (Aditya Siddheshwar / Processing Foundation, 2021-09-22)
- [S326] — 'Animating maths in p5.js' (two.ticks (Processing Forum), 2021-08-05)
- [S327] — 'P5 Math in Motion – GSoC Proposal' (Processing Forum, 2019-04-08)
- [S328] — Manim.js README (Jazon Jiao, undated)
