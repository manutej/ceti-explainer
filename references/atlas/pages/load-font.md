---
id: load-font
title: "loadFont()"
type: Construct
aliases: ["loadFont (async)", "loadFont (CSS / Google Fonts)", "Google Fonts loading"]
sources: [S33, S34, S116, S268, S334, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# loadFont()

## Definition
**[changed in 2.x]** `loadFont()` is the async font loader returning `Promise<p5.Font>`; the docs advise awaiting it in [[async-setup]] [S33]. It loads `.otf`/`.ttf` files and, in 2D mode, a CSS file path such as a Google Fonts stylesheet or a CSS @font-face string [S33].

## Details
- Optional `name` alias for use with `textFont()` and an options argument for font-face descriptors [S33].
- Google Fonts URLs need the [[p5-woff2]] add-on; WOFF2 loading is not built in [S116][S268].
- Remote font URLs may be blocked by CORS [S33].
- In 1.x the loader was used inside `preload()`; in 2.x it is awaited, a **[changed in 2.x]** replacement noted as `replaced-in-2x` [S268].
- Fonts used for text morphs must be loaded before sampling points (see [[text-to-points]]) [S334].

## In explainer work
Load the display and body fonts in `setup`, then call `textFont(f)`; for variable fonts pair with [[text-weight]] [S33][S34].

## Patterns
**Awaited font boot.** When: any custom typography. Pitfall: Google Fonts links need the woff2 add-on.
```js
let f;
async function setup() {
  createCanvas(960, 540);
  f = await loadFont('Inter.ttf');
  textFont(f);
}
```

## Relations
- part_of [[module-typography]] — Typography entry [S357]
- part_of [[hub-language-core]] (structural)
- depends_on [[async-setup]] — awaited in setup [S33]
- enables [[p5-font]] — returns the font object [S33]
- depends_on [[p5-woff2]] — needed for Google Fonts / WOFF2 [S116]
- replaced_in_2x [[preload]] — loader no longer used there [S268]

## Sources
- [S33] — loadFont() reference
- [S34] — textWeight() reference
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S334] — p5.Font `textToContours()` reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
