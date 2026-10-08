---
id: fxhash
title: "fxhash"
type: Platform
aliases: ["fxrand"]
sources: [S392]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# fxhash

## Definition
fxhash is a generative-art platform with p5 templates in which sketches seed randomness from `fxrand` [S392].

## Details
- fxhash p5 workflows seed p5 `random`/`noise` from `fxrand`, expose `window.$fxhashFeatures`, and add keypress hi-res exports at 2000/4000 px [S392].
- The guide suggests `pixelDensity(1)` so output does not vary by device [S392].

## In explainer work
- The keypress hi-res export plus pinned pixel density is a cheap pattern for rendering explainer stills at print size (see [[hi-res-render]], [[pixel-density]]) [S392].

## Relations
- alternative_to [[art-blocks]] — similar hash-seeded platform [S392]
- uses [[random-seed]] — fxrand seeding [S392]
- related_to [[seeded-determinism]] — deterministic outputs [S392]
- related_to [[hub-people-community]] (structural)
## Sources
- [S392] — fxhash beginner's guide using p5.js
