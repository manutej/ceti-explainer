---
id: lottie
title: "Lottie"
type: Library
aliases: ["lottie-web", "Bodymovin"]
sources: [S398, S413]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Lottie

## Definition

Lottie renders After Effects animations exported as JSON via Bodymovin on Android, iOS, Web and Windows. [S413]

## Details

- Remotion's Lottie support seeks frames with lottie-web's goToAndStop and warns expressions may not render deterministically and can flicker. [S398]
- Rendering Lottie as SVG on other renderers is unsupported in Remotion. [S398]
- The Lottie page lists no limitations. [S413]

## In explainer work

A Lottie file is a pre-baked animation: embed it as an asset and seek it by t, but p5 has no documented Lottie bridge. [S398][S413]

## Relations

- alternative_to [[p5js]] — pre-authored After Effects motion versus code-generated motion [S413]
- related_to [[remotion]] — documented seek-by-frame integration [S398]
- related_to [[third-party-timeline-driving]] — must be seeked, not self-played [S398]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S398] — Remotion docs, Lottie (Remotion, undated)
- [S413] — Lottie home (Airbnb, undated)
