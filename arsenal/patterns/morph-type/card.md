# morph-type · shape morph and kinetic typography

**What it is for.** Words and digits that turn into other words and digits by morphing their glyph outlines. It uses `font.textToContours` for outlines, pairs contours by area and position, resamples each pair to equal point counts by arc length, rotates the start index to minimise travel, then lerps vertices as a pure function of t. Use it for title cards, a label becoming another label, and a headline number that counts up with every digit morphing. A third mode raises weight and tracking per letter.

**When NOT to use.** Long running text (outlines cost per glyph, and the morph reads at 2 to 8 characters). Anything that needs true OpenType weight or width axes. Text that must stay selectable or accessible: this paints paths, so set `describe()` on the canvas (the demo does).

## Params (arsenal/patterns/morph-type/pattern.js)
- `mode` words | ticker | weight. `font` disp | mono (token role). `render` fill | outline | dots.
- `words` array of 1 to 6 strings, `hold_s` 0.2-3, `morph_s` 0.4-3. `size` 60-300 px cap, `maxW` 300-880 px.
- `step` 2-8 px between resampled points. `stagger` 0-0.8 (left-to-right delay). `lift` 0-30 px arc. `dotEvery` 1-6.
- ticker: `from`, `to` (<= 7 digits), `delay_s`, `count_s`, `label`. Count uses the pack's ease as an ease-out.
- weight: `title`, `t0`, `rise_s`, `letter_s` (stagger), `wFrac` 0-0.1 of size (stroke), `trackFrom`/`trackTo` in em, `rise_px`.
- `kicker`, `caption`, `guides` (baseline rule). Colours, faces and ease come from tokens roles only.

## Variants (6 s, shoot samples t = 0, 2, 4, 6)
1. `word-to-word` Big Shoulders 600, QUERY to KEY to VALUE, filled, accent while moving, contour counts 7, 3, 6.
2. `number-ticker` 0 to 18,432, odometer carry: each digit morphs d to d+1 only in its carry window; a new leading digit grows from a point; commas appear at 10^3 and 10^6.
3. `weight-rise` AMPLIFY rises letter by letter in stroke weight and tracking, with a mono readout.
4. `mono-dots` IBM Plex Mono 400, LOGITS to SOFTMAX to P = 1.0, point cloud over a faint outline.

## Atlas
[[kinetic-typography]] S46 S334 S341 · [[shape-morph]] S341 S334 · [[text-to-contours]] S334 S268 · [[text-to-points]] S32 (not used; contours chosen for per-letter grouping) · [[text-weight]] S34 · [[load-font]] S33 S268 · [[p5-woff2]] S116.

## Fonts and WOFF2 (WARN)
- `loadFont` in p5 2.3.4 rejects WOFF2 ("only TTF, OTF and WOFF"), verified. The p5.woff2 add-on is not vendored.
- Fallback taken: the vendored WOFF2 files were converted with fontTools to TTF into `arsenal/fonts/*.ttf` (six faces covering the four brand packs) and inlined as data URLs in `arsenal/fonts/fonts.js` (shared; moved from this folder). Reason: `fetch` of a file path is blocked on file://, so path loading fails there. Under http a plain `.ttf` path works too.
- No variable font is vendored (no fvar in any of them), so `textWeight` is not used. Weight is simulated with a stroke outset on the fill (a faux-bold, so counters close slightly and the readout says SIMULATED). Swap in `textWeight()` once a variable face is vendored; contours at varied weight is undocumented [[text-weight]].
- `texture` is ignored; the material lane owns it.

## Pitfalls
- Match pairing is greedy by cost: unmatched contours shrink to their own centroid, so QUERY to KEY leaves a short-lived stray Y. Fewer letters changing reads cleaner.
- Resampling rounds sharp corners by under 1.5 px at `step` 3; lower `step` for cleaner corners.
- Draw is synchronous; setup is async (fonts). Await it before the first draw, and set up every variant before seeking.
- Hole contours need even-odd fill; the module uses `drawingContext.fill('evenodd')`.
- Digits are tabular (slot = widest digit); the comma glyph descends below the baseline by design.

## Cost
About 8 ms per frame at 960x540, density 2 (shoot.mjs, 4 variants x 4 times). Setup is longer (contour pairing, fonts decode): well under a second.

## Renderer and fallback
p2d. Needs p5 2.x (`textToContours`, async `loadFont`). On 1.x use `textToPoints` with `preload` and index-modulo resampling; there are no per-letter contours there, so holes in 0, 6, 8, 9, A, Q are lost.
