---
id: fidenza
title: "Fidenza"
type: Work
aliases: ["Fidenza by Tyler Hobbs"]
sources: [S365, S367, S368, S369, S373, S378]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Fidenza

## Definition
Fidenza is Tyler Hobbs's Art Blocks Curated project of 999 outputs (released 11 June 2021), built on collision-aware flow-field curves; it ships as p5-style JS but was authored in Clojure/Quil (reported) [S369][S365][S367].

## Details
- It is based on a flow-field algorithm Hobbs had used since 2016; curves avoid overlap by default, with "Relaxed" and "Anything Goes" variants [S365].
- It has 14 probabilistic palettes (Luxe most common) and seven scale settings; Sharp Angles quantises angles to multiples of 0.2π [S365].
- A code review of the shipped minified JS found p5 functions (setup, draw, noLoop, vertex, strokeWeight), ~680 beautified lines, a hash-seeded LCG-like PRNG and weighted palette choice with Luxe at 55% [S367].
- It renders in one pass with `noLoop()`, keeps a 1.2 height-to-width ratio, scales geometry against a 2000-unit reference width, and executes in about 1.2 s [S367].
- Hobbs aimed for 99% of outputs to meet his quality standard [S368].
- Fidenza #313 sold for 1,000 ETH (about $3.3M) on 23 August 2021 [S378].

> **Conflict:** "Fidenza is p5" — shipped artifact uses p5-style calls [S367] vs Hobbs authoring in Clojure/Quil [S373]; the exact declared p5 version was not confirmed.

## In explainer work
- It is the clearest worked example of hash-seeded determinism, resolution-relative geometry and weighted features — the same discipline a re-renderable explainer needs (see [[seeded-determinism]], [[resolution-independence]]) [S367].

## Relations
- authored_by [[tyler-hobbs]] — author [S369]
- uses [[flow-field]] — core algorithm [S365]
- uses [[collision-curve-packing]] — non-overlapping curves [S365][S367]
- uses [[probabilistic-palette]] — weighted palettes [S367]
- part_of [[art-blocks]] — Curated release [S369]
- related_to [[hub-people-community]] (structural)
## Sources
- [S365] — Hobbs, Fidenza essay
- [S367] — Lostpixels code review
- [S368] — Art Blocks interview
- [S369] — project page
- [S373] — LACMA interview
- [S378] — Decrypt sale report
