---
id: seeded-determinism
title: "Seeded determinism"
type: Pattern
aliases: ["Deterministic seeding", "Deterministic randomness", "Deterministic render", "seeded reproducibility", "Seeded reproducibility for generative frames"]
sources: [S72, S77, S128, S140, S316, S321, S367, S374, S392]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Seeded determinism

## Definition
Seeded determinism means all randomness comes from seeded generators, so the same seed yields identical output on any machine; Art Blocks and fxhash enforce it by making the token hash the only randomness source [S374][S392].

## Details
- Art Blocks scripts must use `tokenData.hash` as their only randomness source and must not use `Math.random()` or `Date.now()` [S374].
- Fidenza's shipped JS uses a custom LCG-like PRNG seeded via hash32, renders in one pass with `noLoop()` and takes about 1.2 s [S367].
- fxhash p5 workflows seed p5 `random`/`noise` from `fxrand`, expose features, and add keypress hi-res exports at 2000/4000 px [S392].
- In p5, call `randomSeed` and `noiseSeed` separately; calls inside a draw loop with variable counts desync under scrubbing, so derive per-entity values from an index hash or pre-generate in `setup()` (inference) [S72][S77].
- Motion Canvas `useRandom` and Remotion's ban on unseeded randomness follow the same discipline [S316][S321].
- canvas-sketch suggests recording a git commit hash or seed in export filenames [S140].

## In explainer work
Re-renders, hi-res stills and matching narration takes need identical frames; re-seed per frame inside the frame function [S321][S374].

## Patterns
```js
const SEED = 42;
function setup() { createCanvas(windowWidth, windowHeight); randomSeed(SEED); noiseSeed(SEED); noLoop(); }
function draw() { /* never call Math.random() or Date.now() */ }
```
Pitfalls: traits computed after async work violate Art Blocks' synchronous `$features` rule; `Math.random()` anywhere breaks reproducibility [S374].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[random-seed]] — p5 seed functions [S128]
- enables [[pure-function-of-t]] — randomness as a function of t [S321]
- related_to [[art-blocks]] — strict platform rules [S374]
- related_to [[fxhash]] — fxrand seeding [S392]
- related_to [[resolution-independence]] — paired reproducibility discipline [S374]
- related_to [[fidenza]] — case study [S367]

## Sources
- [S72] — noiseSeed() reference
- [S77] — src/math/random.js (main branch)
- [S128] — randomSeed()
- [S140] — canvas-sketch: Exporting Artwork
- [S316] — Motion Canvas tutorial part 1
- [S321] — Remotion `useGsapTimeline()`
- [S367] — Code Review: Fidenza by Tyler Hobbs
- [S374] — Building Your Project (artist docs)
- [S392] — Beginner's guide to fxhash using p5.js
