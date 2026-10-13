---
id: async-setup
title: "async setup()"
type: Construct
aliases: ["await in setup", "async/await loading", "await loading", "await loadImage", "Awaited asset boot", "2.x asset loading"]
sources: [S2, S4, S10, S14, S27, S32, S33, S40, S112, S115, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# async setup()

## Definition
**[2.x]** Declaring `setup` as `async` and awaiting `load*` calls is the 2.x replacement for [[preload]]; every loader returns a promise [S4][S115]. The call to `createCanvas()` also moves inside setup [S4][S27].

## Details
- `loadImage()` returns a Promise of `p5.Image` and `loadFont()` a `Promise<p5.Font>`; both are meant to be awaited in setup [S40][S33].
- Library loaders should return promises rather than using the removed preload counters [S112].
- WebGPU: `await createCanvas(w, h, WEBGPU)` is required because initialization is asynchronous [S14][S10].
- v2.3.2 shows a loading animation when setup runs long; `loading` is a core hook not shown in the reference index [S10][S357].
- Remote assets may be blocked by CORS [S40][S33].
- Compatibility: dual-version tutorials either rewrite to async or use `preload.js` [S112][S27].

## In explainer work
Boot pattern: `async function setup(){ createCanvas(960,540); img = await loadImage('a.png'); f = await loadFont('Inter.ttf'); textFont(f); }` [S33][S40]. A pitfall is drawing before assets resolve; guard with a ready flag (inference) [S4]. The 2.x timeline builds on this: precompute text points in setup (see [[text-to-points]]) [S32].

## Patterns
**Awaited asset boot.** When: any explainer using images or fonts. Pitfall: `preload()` now only produces a friendly error [S10].
```js
let font;
async function setup() {
  createCanvas(800, 450);
  font = await loadFont('Inter.ttf');
  textFont(font);
}
```

## Relations
- part_of [[hub-language-core]] (structural)
- supersedes [[preload]] — replaces the 1.x hook [S4]
- depends_on [[setup]] — it is a form of setup [S2]
- enables [[load-font]] — awaited font loading [S33]
- enables [[webgpu-renderer]] — awaited WEBGPU canvas [S14]
- related_to [[version-2x-migration]] — headline migration change [S4]

## Sources
- [S2] — setup() reference
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S14] — createCanvas() reference
- [S27] — Teachers' Guide to p5.js v2
- [S32] — p5.Font textToPoints() reference
- [S33] — loadFont() reference
- [S40] — loadImage() reference
- [S112] — Asynchronous p5.js 2.0
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
