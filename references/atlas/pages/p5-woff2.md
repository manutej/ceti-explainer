---
id: p5-woff2
title: "p5.woff2 add-on"
type: Library
aliases: ["woff2 addon"]
sources: [S4, S33, S116, S117, S156, S268]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.woff2 add-on

## Definition
`p5.woff2` is the add-on required to load WOFF2 fonts, and therefore Google Fonts URLs, through `loadFont` in 2.x [S116][S4].

## Details
- Stated in the 2.0 typography tutorial and release notes; `loadFont` otherwise accepts `.otf`/`.ttf`, CSS links and @font-face strings [S116][S33].
- The deep-case notes repeat that Google Fonts URLs need this add-on [S268].
- Add-on status for other versions, repository location and API are not documented in the notes [S116].

## In explainer work
Self-host `.ttf`/`.otf` files to avoid this dependency, or include the add-on when a design system relies on Google Fonts stylesheets (inference) [S116].

## Relations
- part_of [[hub-language-core]] (structural)
- enables [[load-font]] — WOFF2 / Google Fonts loading [S116]
- related_to [[register-addon]] — add-ons use the 2.x add-on API (inference) [S117]
- related_to [[module-typography]] — typography loading [S116]
- related_to [[p5js-libraries-directory]] — add-on catalogue [S156]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S33] — loadFont() reference
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S117] — Designing an addon library system for p5.js 2.0
- [S156] — p5.js Libraries page
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
