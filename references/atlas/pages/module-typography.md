---
id: module-typography
title: "Typography module"
type: Module
aliases: ["Typography", "text and fonts"]
sources: [S1, S4, S32, S33, S34, S35, S45, S46, S116, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Typography module

## Definition
Typography is the text-and-fonts module; in 2.x it has 21 entries and no submodules, up from 12 entries in 1.x (which were split across Attributes and Loading & Displaying) [S357][S358]. The 2.0 typography system was refactored to be smaller, with variable-font support and more precise measurement **[changed in 2.x]** [S4].

## Details
- Entries: fontAscent, fontBounds, fontDescent, fontWidth, loadFont, p5.Font, text, textAlign, textAscent, textBounds, textDescent, textDirection, textFont, textLeading, textProperties, textProperty, textSize, textStyle, textWeight, textWidth, textWrap; 9 are new pages [S357].
- Loading: [[load-font]] accepts font files, CSS links such as Google Fonts, or @font-face strings; WOFF2 needs [[p5-woff2]] [S33][S116].
- Variable fonts: [[text-weight]] [S34].
- Text to geometry via [[p5-font]]: [[text-to-points]], [[text-to-contours]], textToPaths, [[text-to-model]] [S32][S4].
- Measurement: [[text-width]] returns a tight bounding box in 2.x [S35].
- Several 1.x-era add-ons such as p5.variableFont are superseded by native support, though no source says so explicitly [S45].

## In explainer work
Rated **High**: labels and captions; text outlines let letters morph or draw on; `textWeight` animates variable fonts [S357][S4]. Practitioner evidence on explainer typography systems (caption placement, kinetic type libraries) is thin in the sources [S46].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[load-font]] — async font loading [S33]
- uses [[p5-font]] — font object with geometry methods [S32]
- uses [[text-weight]] — variable fonts [S34]
- uses [[text-width]] — measurement [S35]
- related_to [[kinetic-typography]] — downstream technique [S4]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S32] — p5.Font textToPoints() reference
- [S33] — loadFont() reference
- [S34] — textWeight() reference
- [S35] — textWidth() reference
- [S45] — p5.variableFont
- [S46] — Coding Train p5.js 2.0 typography
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
