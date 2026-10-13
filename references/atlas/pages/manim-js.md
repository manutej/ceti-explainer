---
id: manim-js
title: "Manim.js"
type: Library
aliases: ["JazonJiao Manim.js"]
sources: [S324, S325, S328]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Manim.js

## Definition

Manim.js (JazonJiao) is a p5 instance-mode recreation of 3Blue1Brown-style animations focused on linear algebra and graph algorithms, with objects scheduled by a start frame. [S328]

## Details

- Each class's show() is called from draw(), and the setup2D helper fixes 30 fps on a 1200x675 canvas. [S328]
- The repo holds its author's YouTube animation sources. [S328]
- Maintenance 2026 and 2.x: unknown, and it documents no seekable playback or audio sync. [S328]
- It does not use the browser-first Manim port manim-web, which is not p5-based. [S324]

## In explainer work

Treat it as a niche proof that p5 can host Manim-like explainers, not as a maintained dependency. [S328]

## Relations

- depends_on [[instance-mode]] — built on p5 instance mode [S328]
- alternative_to [[manim]] — p5 recreation of the Python original [S328]
- authored_by [[jazon-jiao]] — author [S328]
- alternative_to [[p5-teach]] — other p5 Manim-inspired add-on [S325][S328]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S324] — 'Show HN: I ported Manim to TypeScript' (manim-web, github.com/maloyan/manim-web) (maloyan + HN commenters, c. early 2026 ("7 months ago"))
- [S325] — 'p5.teach: Teaching Math through Animations and Simulations' (Aditya Siddheshwar / Processing Foundation, 2021-09-22)
- [S328] — Manim.js README (Jazon Jiao, undated)
