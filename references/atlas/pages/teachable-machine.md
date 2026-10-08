---
id: teachable-machine
title: "Teachable Machine"
type: Tool
aliases: ["TM"]
sources: [S215, S217, S218]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Teachable Machine

## Definition

Teachable Machine is Google's web GUI for training classifiers without code; the paper reported 182,000+ users in 201 countries and 125,000+ models. [S218]

## Details

- Curricula at Stanford d.school, NYU ITP and MIT Media Lab are cited. [S218]
- ITP Camp 2023 taught: train in Teachable Machine, export, run with ml5 in a p5 sketch. [S217]
- ml5 API generations differ, so verify against current docs; not checked here. [S217]

## In explainer work

Good for live classification demos inside explainers about ML, with the model running in a p5 sketch via [[ml5js]]. [S217]

## Relations

- integrates_with [[ml5js]] — exported models run with ml5 [S217]
- related_to [[p5js]] — sketch hosts the demo [S217]
- related_to [[nyu-ml-courses]] — taught in ITP ML courses [S215]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S215] — Machine Learning for the Web (ITP) (Yining Shi, undated)
- [S217] — Teaching the Machine with p5.js and ml5.js (ITP Camp 2023) (NYU ITP, 2023-06-14)
- [S218] — Teachable Machine: Approachable Web-Based Tool for Exploring ML Classification (Howell et al., Google Research, 2020)
