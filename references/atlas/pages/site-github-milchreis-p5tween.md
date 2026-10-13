---
id: site-github-milchreis-p5tween
title: "GitHub: Milchreis/p5.tween (source site)"
type: Site
aliases: ["github.com/Milchreis/p5.tween (site)"]
sources: [S170]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# GitHub: Milchreis/p5.tween (source site)

## Definition
**GitHub: Milchreis/p5.tween** — a primary source at github.com/Milchreis/p5.tween, credited to Milchreis; the wiki uses it for “p5.tween repo”. [S170]

Kind: **primary**; 1 registered source, 1 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S170]

## What it contributes
- p5.tween's README does not document how tweens update each frame, and it does not mention p5 2.x [S170]
- p5.tween durations are given in milliseconds, so it is a wall-clock (not frame-indexed) tween engine [S170]
- p5.tween offers linear plus In/Out/InOut variants of Quad, Cubic, Quart, Quint, Sin and Elastic easing [S170]

## Pages that cite it

| page (6) | title |
|---|---|
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[gsap]] | GSAP |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[index]] | p5.js Explainer Atlas |
| [[mastery-ladder]] | Mastery ladder |
| [[p5-tween]] | p5.tween |

## Reliability
- Coverage: 1 source (1 rated primary, 0 secondary by the researchers); year range no year recorded, 1 without a recorded date. [S170]
- Noted gap: **No canonical p5 explainer engine found.** Searches for "p5 timeline", "p5 scene manager" and "p5 explainer" turned up only partial tools. p5.teach.js  and Manim.js  are the closest Manim ports. Neither documents seekable playback or audio sync, and I could not confirm recent maintenance (repo dates were blank). A … [S170]
- Noted gap: **p5.tween internals.** Its README does not say whether it registers a draw hook or uses its own timer. Its millisecond model suggests wall-clock time, which would break deterministic export unless the library is patched. This is an inference. [S170]

## Sources
- [S170] — p5.tween repo (primary; undated)
