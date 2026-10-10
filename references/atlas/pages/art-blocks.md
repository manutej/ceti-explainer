---
id: art-blocks
title: "Art Blocks"
type: Platform
aliases: ["AB", "Art Blocks Dependency Registry", "tokenData.hash", "window.$features", "Hash-seeded deterministic render", "Ringers", "Ringers #29"]
sources: [S369, S374, S375, S376, S377, S382, S392]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---
# Art Blocks

## Definition
Art Blocks is an on-chain generative-art platform that mints outputs of an artist's script from a token hash; its approved p5.js versions are 1.0.0, 1.9.0 and 1.11.11 — no 2.x [S375][S374][S377].

## Details
- Scripts must use `tokenData.hash` (32-byte hex) as their only randomness source and must not use `Math.random()` or `Date.now()` [S374].
- Traits go in `window.$features`, assigned synchronously and deterministic per hash [S374].
- Output must fill any viewport with relative coordinates and redraw on resize [S374].
- Projects are a single JS file plus one approved dependency from the on-chain Dependency Registry, ~5–20 KB of artist script; artists should test 20–40 hashes across Chrome, Firefox and Safari [S374].
- Previews render in headless Chromium with CPU SwiftShader, so GPU-heavy work renders slowly [S374].
- The Generator assembles one HTML page from on-chain dependencies, library, tokenData, canvas and script [S375].
- Founded by Snowfro, who sold 34 CryptoPunks to fund it [S377].
- Ringers #29 (Dmitri Cherniak) was estimated at £1.1M–1.3M by Phillips in July 2022; Ringers' library is unverified [S382].
- fxhash follows a similar model with fxrand seeding [S392].

## In explainer work
- Its rules are a ready-made determinism checklist for explainer renders: one seed source, no wall clock, relative geometry, headless-renderable (see [[seeded-determinism]], [[resolution-independence]]) [S374].
- 2.x-only explainer features (async `loadFont`, `textToContours`) cannot run there [S374].

## Relations
- depends_on [[p5js-1x]] — registry tops out at 1.11.11 [S374]
- related_to [[fidenza]] — Curated project [S369]
- related_to [[chromie-squiggle]] — project 0 [S376]
- alternative_to [[fxhash]] — similar hash-seeded platform [S392]
- related_to [[snowfro]] — founder [S377]
- related_to [[hub-people-community]] (structural)
## Sources
- [S374] — artist docs
- [S375] — Generator docs
- [S376] — npm package
- [S377] — nft now
- [S382] — Phillips Ringers lot
- [S369] — Fidenza page
- [S392] — fxhash guide
