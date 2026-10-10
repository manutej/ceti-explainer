---
id: revideo
title: "Revideo"
type: Tool
aliases: ["re.video"]
sources: [S228, S230, S311]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Revideo

## Definition

Revideo is a fork of Motion Canvas that keeps the generator flow API and adds a Node.js renderVideo() for headless, server-side video generation. [S311][S228][S230]

## Details

- It shares largely the same animation API as Motion Canvas, so tutorials transfer. [S230]
- Its docs define the flow primitives precisely: sequence starts tasks a fixed delay apart without waiting, chain runs them one after another. [S311]
- A 2026 comparison lists Motion Canvas and Revideo as MIT. [S228]
- Maintenance 2026: no commit dates were retrieved, so activity is unverified; it is not a replacement for Motion Canvas's editor, only for server-side use. [S230][S228]

## In explainer work

Read Revideo's flow page when designing [[timeline-builder]] combinators such as all and stagger. [S311]

## Relations

- related_to [[motion-canvas]] — forked from it [S230]
- alternative_to [[remotion]] — generator model versus React frame function [S228]
- related_to [[generator-scenes]] — keeps the generator flow API [S311]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S228] — Remotion vs Motion Canvas vs Revideo programmatic video 2026 (PkgPulse, 2026 (exact date not seen))
- [S230] — Revideo docs, Designing animations (Revideo, undated)
- [S311] — Revideo 'Animation flow' (Revideo (Motion Canvas fork), undated)
