---
id: coding-challenge-24
title: "Coding Challenge 24: Perlin noise flow field"
type: Work
aliases: ["Perlin Noise Flow Field"]
sources: [S87, S88]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Coding Challenge 24: Perlin noise flow field

## Definition
Coding Challenge 24 builds a Perlin-noise flow field in p5.js: a grid of noise-derived angles that particles follow, drawn as trails [S88].

## Details
- It builds a noise-angle field, particles that draw lines from their previous position, and adds a z offset (`zoff`) so the field animates through 3D noise [S88].
- Field lookup indexes by floor(position / resolution), constrained to bounds [S88].
- The companion I.2 tutorial contrasts `random()` with `noise()` and explains interpolation and octaves [S87].
- The episode predates p5 2.x; its code targets 1.x-era APIs (inference from undated page) [S88].

## In explainer work
- Flow fields are a stock visual for "wind", gradients or data streams; animating `zoff` from frame index keeps the field deterministic for export (see [[flow-field]], [[noise-loop]]) [S88].

## Relations
- part_of [[coding-challenges]] — challenge #24 [S88]
- demonstrates [[flow-field]] — noise-driven field [S88]
- uses [[noise]] — Perlin angles [S87]
- authored_by [[daniel-shiffman]] — presenter [S88]
- related_to [[hub-people-community]] (structural)
## Sources
- [S88] — Coding Challenge 24 page
- [S87] — I.2 Perlin noise tutorial
