# particles-text · text and shapes assembled from particles

**What it is for.** N particles that are the pixels of a word, a numeral or a shape. Each stage (text, `@ring`, `@line`, `@scatter`, `@grid`) is sampled to exactly N points in setup; each particle then flies stage to stage on a quadratic path (a per-particle bow plus a midpoint cloud, so a word breaks apart before it re-forms) with an eased arrival and a per-particle delay read from a stagger field. Pure of t. Use it for title beats, a headline arriving out of a structure, and the count variant: N particles are the N things counted and they assemble into the numeral N, which is committed only when the numeral forms.

**When NOT to use.** Long text (readability fails past about 12 characters at N 2000). Anything needing exact glyph shape (use morph-type). Light/thin faces at small size.

## Params (arsenal/patterns/particles-text/pattern.js)
- `seq` stages: `@scatter` `@line` `@grid` `@ring`, `#N` (the count as a numeral, commas), or any string. Start with a word to begin "on the previous word".
- `n` 200-3000 particles. `font` disp|mono. `sample` fill (hex grid inside the contours) | outline (`textToPoints` along the stroke).
- `size` 60-260 cap height px, `maxW` 300-880, `yoff` px. `lead_s` 0-2, `move_s` 0.6-3, `hold_s` 0.3-4.
- `stagger` 0-0.85 (share of move_s that is delay). `field` x|dist|noise|rand, `field_inv`, `noise_freq` 1-8.
- `match` sort (x rank, short paths) | shuffle | angle (around centre). `curl` 0-1, `spread` 0-120 px, `dot` px (0 = auto), `jitter` 0-2 px.
- `appear_s` pop-in over N counted things; `readout` shows COUNTED n, then the total. `ring_r`, `rings`, `ring_gap`. `kicker`, `caption`.

## Variants (8 s; shoot samples t = 0, 2.67, 5.33, 8)
1. `word-chain` scatter to TOKENS to VECTORS to MEANING, 1,400 particles, stagger by x.
2. `count-1000` a 1,000-dot grid counted in one by one, then assembling into "1,000" outside-in (stagger by distance).
3. `ring-to-headline` three concentric rings disperse in a curling cloud into "WHAT MATTERS" (2,200 particles, stagger by seeded noise, angle match).
4. `line-outline` a line to ATTEND to RETRIEVE in mono, outline sampling via textToPoints.

## Atlas
[[text-to-points]] S32 S357 · [[seeded-determinism]] S72 S128 S374 · [[easing-functions]] S80 S81 · [[text-to-contours]] S334 · [[load-font]] S33 · [[kinetic-typography]] S46.

## Fonts (WARN)
Reuses `arsenal/fonts/fonts.js` (shared; loaded as `../../fonts/fonts.js`) (TTF data URLs; p5 2.3.4 `loadFont` rejects WOFF2). The demo loads it by relative path, so the pattern depends on that folder. Setup is async (fonts); await it before seeking.

## Pitfalls
- Fill sampling is a jittered hex grid thinned by stride: letters with thin strokes look lacy below about 1,500 particles; raise `n` or use `sample: 'outline'`.
- Pairing is by rank, so identity is not preserved across `match` modes; sort+x field gives the cleanest flow.
- `textToPoints` returns fewer points than N for short strings at low `sampleFactor`; setup raises it automatically.
- Settled shimmer (`jitter`) keeps holds alive; set 0 for stills. Texture token ignored.
- The count readout is a claim: it reads N only after the numeral has formed; keep N honest.

## Cost
4.4 to 5.1 ms per frame at 960x540, density 2 (shoot.mjs, 16 frames; 1,000 to 2,200 particles). Setup under about 1 s per variant.

## Renderer and fallback
p2d. Needs p5 2.x (`textToContours`, async `loadFont`). On 1.x use `textToPoints` with `preload` and drop the fill sampler.
