---
id: dynamic-learning
title: "Dynamic Learning"
type: Work
aliases: ["GSoC 2018 STEM lesson app", "Jithin KS"]
sources: [S105, S211, S222]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Dynamic Learning

## Definition
Dynamic Learning is a GSoC 2018 web app by Jithin KS for slide-based STEM lessons that embed p5 simulations alongside text [S211].

## Details
- Lessons are slides containing p5 simulations and text, with simulations imported by iframe from the p5 editor [S211].
- The author observed existing simulations are scattered online and rarely expose source, and shifted the plan toward teacher–coder collaboration [S211].
- It produced a basic app foundation only; no learning-outcome data was reported [S211].

## In explainer work
- Embedding each simulation as an editor iframe and saving state as a JS object is a lightweight way to drop interactive beats into slide-style explainers (see [[coding-train-episode-package]]) [S211].

## Relations
- uses [[p5js-web-editor]] — simulations via iframe [S211]
- related_to [[siena-physics-demos]] — sibling STEM simulations [S222]
- related_to [[explorable-documents-template]] — alternative embedding approach [S105]
- related_to [[hub-people-community]] (structural)
## Sources
- [S211] — PF blog: Improving Science and Math Education Using p5.js
- [S222] — Siena demos
- [S105] — explorable template
