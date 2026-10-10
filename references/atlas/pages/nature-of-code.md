---
id: nature-of-code
title: "The Nature of Code"
type: Work
aliases: ["NOC", "Nature of Code 2024", "Magicbook", "The Nature of Code (2024)"]
sources: [S82, S177, S178, S179, S220, S383, S384]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# The Nature of Code

## Definition
The Nature of Code is Daniel Shiffman's book on simulating natural systems; the 2024 edition (No Starch) was rewritten from Processing to p5.js and is free to read online [S384][S177][S179].

## Details
- The first edition (2012) used Processing and was self-published; the 2024 edition is illustrated by Zannah Marsh [S384].
- It covers randomness, vectors and forces, trigonometry, cellular automata, fractals, genetic algorithms and neural networks [S220].
- Examples appear as p5.js code beside screenshots of the sketch in motion [S179].
- Source lives in a private Notion database exported to HTML by a GitHub action, then built to PDF with Magicbook and to the web with Gatsby [S383].
- Exercise sketches standardise on `createCanvas(640, 240)` and are re-saved under a Nature of Code web-editor account [S383].
- natureofcode.com is funded through GitHub Sponsors and direct print sales [S179].
- The vectors chapter frames motion as position += velocity, velocity += acceleration, with acceleration as the thing to compute [S82].
- Whether its examples target p5 1.x or 2.x was not verified; the edition predates 2.0 [S178].

## In explainer work
- It is the canonical source for simulation-driven explainer motion — [[euler-integration]], [[steering-behaviors]], [[oscillation]] — with runnable sketches for each [S82][S220].
- Its build pipeline (single source → web + print, standard canvas size) is a model for explainer series with many sketches [S383].

## Relations
- authored_by [[daniel-shiffman]] — author [S384]
- uses [[p5js]] — 2024 edition rewritten in p5 [S177]
- teaches [[euler-integration]] — motion algorithm [S82]
- teaches [[steering-behaviors]] — autonomous agents [S220]
- related_to [[coding-train]] — companion video series [S179]
- related_to [[hub-people-community]] (structural)
## Sources
- [S384] — Wikipedia: publication facts
- [S177] — Waxy on the 2024 update
- [S178] — FlowingData on the refresh
- [S179] — natureofcode.com
- [S220] — CreativeApplications listing
- [S383] — noc-book-2 repo
- [S82] — vectors chapter
