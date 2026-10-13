---
id: site-lostpixels
title: "Lostpixels (source site)"
type: Site
aliases: ["lostpixels.io (site)"]
sources: [S367]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
---
# Lostpixels (source site)

## Definition
**Lostpixels** — a community source at lostpixels.io, credited to James Merrill (Lostpixels); the wiki uses it for “Code Review: Fidenza by Tyler Hobbs”. [S367]

Kind: **community**; 1 registered source, 0 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S367]

## What it contributes
- The reviewer states that Fidenza's original source is in "Quill" (presumably Quil, the Clojure Processing wrapper), not hand-written p5. [S367]
- The same review reports that Fidenza renders in one pass with noLoop(), keeps a 1.2 height-to-width ratio, scales geometry against a 2000-unit reference width, and executes in about 1.2 s. [S367]
- A 2021 code review of Fidenza's shipped minified JS found p5 functions (setup, draw, noLoop, vertex, strokeWeight), about 680 beautified lines, a custom LCG-like PRNG seeded via hash32, and weighted palette selection with luxe at 55%. [S367]

## Pages that cite it

| page (12) | title |
|---|---|
| [[collision-curve-packing]] | Collision-checked curve packing |
| [[fidenza]] | Fidenza |
| [[hub-motion-rendering]] | Hub: Motion, timing and rendering |
| [[hub-people-community]] | Hub: People, works and community |
| [[index]] | p5.js Explainer Atlas |
| [[loop-control]] | noLoop(), loop(), isLooping() |
| [[mastery-ladder]] | Mastery ladder |
| [[open-questions]] | Open questions and conflicts |
| [[probabilistic-palette]] | Probabilistic palette |
| [[resolution-independence]] | Resolution independence |
| [[seeded-determinism]] | Seeded determinism |
| [[tyler-hobbs]] | Tyler Hobbs |

## Reliability
- Coverage: 1 source (0 rated primary, 1 secondary by the researchers); year range 2021–2021, 0 without a recorded date. [S367]
- Noted gap: **Fidenza's toolchain is contested in detail.** The shipped artifact uses p5-style calls per the Lostpixels review, which also says the original source is in "Quill" (likely Quil). Hobbs confirms Clojure. I could not confirm from a primary source which p5 version Fidenza's Art Blocks script type declares; a … [S367]
- Editorial: secondary, community-grade evidence.

## Sources
- [S367] — Code Review: Fidenza by Tyler Hobbs (community; 2021-12-15)
