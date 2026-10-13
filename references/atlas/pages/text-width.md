---
id: text-width
title: "textWidth() / fontWidth()"
type: Construct
aliases: ["textWidth", "fontWidth"]
sources: [S11, S32, S35, S44, S115, S116, S120, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# textWidth() / fontWidth()

## Definition
**[changed in 2.x]** In 2.0+, `textWidth()` returns a tight bounding-box width of text in the current font, size and style, ignoring leading and trailing spaces; for multiline text it returns the widest line [S35]. `fontWidth()` is the new Typography entry that keeps advance-width behavior including spaces [S11][S357].

## Details
- PR 8088 proposed `fontWidth()` using browser `measureText`; maintainers asked to limit it to docs, and whether it merged is unverified [S44].
- The 2.1.0 notes mention a `textWidth` fix related to spaces [S120].
- The 2.0 typography tutorial names `fontWidth` as the function for string width including spaces [S116].

> **Conflict:** The compat README is inconsistent on textWidth vs fontWidth leading/trailing-space handling [S115]; the reference says textWidth ignores them [S35].

## In explainer work
For label layout and centered captions, use `fontWidth` when trailing spaces must count (kerned runs, monospace alignment) and `textWidth` for tight visual boxes (inference) [S35][S11].

## Relations
- part_of [[module-typography]] — Typography entries [S357]
- part_of [[hub-language-core]] (structural)
- related_to [[text-to-points]] — measurement vs sampling anchors [S32]
- related_to [[p5js-compatibility]] — README discusses the difference [S115]
- related_to [[load-font]] — measurement depends on the loaded font [S35]

## Sources
- [S11] — p5.js-compatibility add-ons
- [S32] — p5.Font textToPoints() reference
- [S35] — textWidth() reference
- [S44] — PR 8088, fontWidth() and textWidth() docs
- [S115] — p5.js-compatibility README raw (differences list)
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S120] — p5.js v2.1.0 release notes
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
