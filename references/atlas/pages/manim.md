---
id: manim
title: "Manim"
type: Tool
aliases: ["Manim Community", "manim CE", "manimgl", "3b1b manim", "Manim (3b1b / ManimGL)", "run_time", "rate_func", "lag_ratio", "Updater", "next_section", "Scene", "manim-web", "maloyan/manim-web"]
sources: [S229, S231, S232, S234, S285, S286, S287, S322, S323, S324, S325, S328, S389]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Manim

## Definition

Manim is the Python math-animation engine built on Scene.construct with play() and wait(), and Animation.interpolate(alpha) with run_time and rate_func; it is the dominant render target in LLM explainer-video research. [S322][S323][S285]

## Details

- Two projects exist: 3b1b/manim (installs as manimgl, Python 3.10+, MIT) and Manim Community, forked in 2020 for stability; the 3b1b README says the community edition is more active for contributions. [S232]
- A Scene.render() runs setup(), construct(), then tear_down(); wait() is a no-op animation; updaters receive elapsed time each frame; play() takes subcaption arguments. [S322]
- run_time defaults to 1.0 s, rate_func to smooth, and lag_ratio staggers sub-animations inside run_time. [S323]
- Manim Community documents an OpenGL renderer via --renderer=opengl. [S234]
- manim-web (maloyan) mirrors the Python API on Canvas/WebGL with MathJax/KaTeX, but its author said the code was entirely agent-generated and users reported flicker and fuzzy text. [S324]
- LLM research targets Manim: TheoremExplainAgent reached 93.8% video success on 240 theorems, PhysicsSolutionAgent 100% completion, and LLM2Manim beat slides 83.4 vs 78.1 (n=100). [S285][S286][S287]
- A comparison article calls Manim unmatched for equation morphing and says Manim video can be imported into Remotion. [S229]
- p5 ports are niche: Manim.js and p5.teach.js; a 2021 forum thread sought p5 for 3Blue1Brown-style videos because Manim is hard to reuse in web widgets. [S328][S325][S389]

## In explainer work

Manim supplies the vocabulary the blueprint borrows: play/wait, alpha with run_time and rate_func, lag_ratio and subcaptions ([[timeline-builder]], [[track-tween]], [[beats-and-captions]]). [S322][S323] Use Manim itself for formula morphs and p5 for custom generative visuals (inference). [S229][S231]

## Relations

- alternative_to [[p5js-2x]] — LLM explainer research uses Manim, not p5, as its output target [S285][S287]
- related_to [[manim-js]] — p5 instance-mode recreation of its look [S328]
- related_to [[p5-teach]] — GSoC p5 add-on inspired by Manim [S325]
- related_to [[track-tween]] — alpha model is the source of the pattern [S323]
- related_to [[timeline-builder]] — play/wait authoring is the source [S322]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S229] — Remotion vs Motion Canvas vs Manim: Best Code-to-Video Tool 2026 (beginnersinai.org, 2026)
- [S231] — Motion Canvas docs, LaTeX (Motion Canvas, undated)
- [S232] — 3b1b/manim README (Grant Sanderson / contributors, undated)
- [S234] — Manim Community FAQ index (Manim Community, undated)
- [S285] — TheoremExplainAgent (Ku, Chong, Leung, Shah, Yu, Chen, 2025-02-26 (v2 2025-05-25))
- [S286] — PhysicsSolutionAgent (Thole, Agrawal, Ramamoorthy, Kumar, 2026-01-19)
- [S287] — LLM2Manim: Pedagogy-Aware AI Generation of STEM Animations (Joshi, Ke, Gajjar, Christian, Wang, Chen (SDSU), 2026-04-07)
- [S322] — Manim Community `Scene` reference (Manim Community, undated)
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
- [S324] — 'Show HN: I ported Manim to TypeScript' (manim-web, github.com/maloyan/manim-web) (maloyan + HN commenters, c. early 2026 ("7 months ago"))
- [S325] — 'p5.teach: Teaching Math through Animations and Simulations' (Aditya Siddheshwar / Processing Foundation, 2021-09-22)
- [S328] — Manim.js README (Jazon Jiao, undated)
- [S389] — 3Blue1Brown like videos using P5JS (Processing Discourse, 2021-01-13)
