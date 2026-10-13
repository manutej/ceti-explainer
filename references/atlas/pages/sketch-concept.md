---
id: sketch-concept
title: "Sketch (sketching with code)"
type: Concept
aliases: ["Sketch", "sketching with code"]
sources: [S8, S96, S342, S344]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Sketch (sketching with code)

## Definition
In Processing and p5.js a program is called a sketch because the solution emerges while writing rather than being planned first [S344]. p5.js states the same aim as making sketching with code as intuitive as sketching in a notebook [S342].

## Details
- The metaphor descends from Processing, begun by Reas and Fry in sketchbook notes in spring 2001, and from Maeda's Design By Numbers, whose 100x100 grey canvas shaped Processing's minimalism [S344].
- A sketch in p5.js has a lifecycle of [[setup]] run once and [[draw]] looped at about 60 frames per second by default [S8].
- The sketch is the unit that [[instance-mode]] wraps in a function so several can coexist on one page [S96].
- p5.js community values include treating everyone as a learner and not assuming prior knowledge, which is why sketches favour short, forgiving code [S342].

## In explainer work
An explainer is a sketch whose output is meant to be watched or scrubbed rather than only played with. The sketching mindset (iterate on a running picture) fits explainer authoring, while production concerns such as a deterministic clock are layered on top (inference) [S344][S8].

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[p5js]] — the library in which sketches run [S342]
- related_to [[immediate-mode]] — sketches redraw the picture each frame [S8]
- uses [[setup]] — one-time initialisation phase [S8]
- uses [[draw]] — repeating phase [S8]
- related_to [[processing]] — origin of the sketch term [S344]

## Sources
- [S8] — draw() reference
- [S96] — p5.js wiki: Global and instance mode
- [S342] — p5.js About
- [S344] — A Modern Prometheus (Processing history)
