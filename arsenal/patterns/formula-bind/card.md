# formula-bind · the formula whose terms fly into the marks they count

**What it is for.** The visual carrier of the law "every digit on screen is a claim with a formula or a source". A
formula is given as terms `[{id, text, role}]`, set as a line of type in the pack's mono or display face; the marks are
given as sets keyed by term id (`{count}`, `{count, of}` or `{values}`). Five moves on t: **set** (formula in muted,
result slot `?`, marks faint), **bind** (in `order`, each term lights in its role and the marks it counts light in the
same role, its count numeral ticking with the lit marks), **fly** (every matched term travels by id into its mark set as
a label, glyphs kept whole on an arc with a per-glyph lag; operators, the bar and `?` fade, they never travel),
**compute** (the count numerals fly into the term slots, operators return, the result assembles as a kinetic number
computed from the sets, never typed, while its marks fill: share rule, cells or total rule), **return** (numerals go back
to the marks first, then the words land in their slots; the result stays). Matching is by id, never a cross-fade [S18].

**When NOT to use.** Formulas with more than four terms or nested structure (no TeX parser: forms are ratio, product,
sum). Values that are not counts or additive sums. Before the viewer has committed a number: the film puts the commit
between bind and compute (the result slot shows `?` until `beats.compute`), never after.

## Params (defaults in pattern.js)
- `form` ratio | product | sum. ratio: terms[0] over terms[1], numerator `{count, of:'<den id>'}` = a seeded subset of the
  denominator's dots. product: two counts -> rows x cols grid, row heads and column heads bind, cells are the result.
  sum: 2-4 sets of `values` (or counts) -> one stacked bar, a segment per value, total rule is the result.
- `terms` [{id, text, role}] role in tokens.color keys (accent, accent2, ink, chalk); `order` bind order (ids) or null.
- `marks` {id: {count} | {values:[..]} | {count, of}}. `result` {role, fmt}; `valueFmt`, `fmt` = {scale, dp, prefix, suffix, group}.
- `face` mono | disp. `size` 30-64 px. `land` 0.3-0.8 (term scale at its marks). `numSize` 20-40 px. `fy` 120-220 px.
- `lift` 0-120 px arc (0 = straight, exec). `lag` 0-0.5 per-glyph lag. `dur` s 12; `beats` {set, bind, fly, compute, ret} [t0, t1] s.
- `kicker`, `caption` (the provenance / honest-limits line).
- API: `count(t, st, params)` -> {phase, shown, lit, perSet, result, resultText}; `draw` returns it too (`__film.count(t, v)`).

knobs_doc rows a film would expose: `{name:"fbLift",range:[0,120],step:10,what:"arc of a flying term, px (0 = straight)"}`,
`{name:"fbLag",range:[0,0.5],step:0.05,what:"per-glyph lag inside a term flight"}`, `{name:"fbLand",range:[0.3,0.8],step:0.02,what:"term scale at its marks"}`,
`{name:"fbBindS",range:[2,6],step:0.2,what:"seconds of the bind beat"}`, `{name:"fbComputeS",range:[1.4,4],step:0.2,what:"seconds of the compute beat"}`,
`{name:"fbFace",options:["mono","disp"],what:"pack face of the formula"}`. Terms, marks and the result are claims, never knobs.

## Variants (12 s; shots at t = 2.4, 5.4, 7.4, 10.3, 12)
1. `ratio` FLAGGED / REVIEWED = 30.8 %: 120 dots, 37 a seeded subset; binds REVIEWED first (the whole), then FLAGGED; share rule fills to 0.308.
2. `product` GPUS x HOURS = 112 (display face): 8 row heads, 14 column heads, 112 cells fill row-major with the kinetic number (number = lit cells).
3. `sum` COMPUTE + STORAGE + EGRESS = $24.8K (mono): three sets of three monthly values in one stacked bar; total rule grows with the number.

## Atlas and research
[[text-to-contours]] S334 S32 (outlines per contour; contours clustered into rigid glyphs by x-extent) ·
[[text-to-points]] S32 (not used: flat points lose glyph grouping) · [[load-font]] S33 S268 and [[p5-woff2]] S116
(TTF data URLs from arsenal/fonts/fonts.js in async setup) · [[kinetic-typography]] S46 S341 · [[shape-morph]] S334
S341 (contrast: nothing morphs here, glyphs move rigidly) · [[text-width]] S35 (slots and numeral centring) ·
[[derived-geometry]] S314 (slots, anchors, grids derived from measured widths in setup) · [[manim]] S323 (rate_func,
lag_ratio). R-D (arsenal/frontier/R-D-moves.md) M12 and gap row 2: S18 (manim TransformMatchingTex/Shapes moves matched
parts, no cross-fade), S29 (Tversky et al. 2002, congruence: product as area, sum as concatenated length, ratio as a
subset of the whole), S30 (3Blue1Brown colour-bound terms), S3 (Heer and Robertson: object constancy through a change).

## Pitfalls
- p5 `textSize` must be the sampling size when calling `textToContours`; sampling after a size change shrinks glyphs (fixed once).
- Mid-flight at lag > 0.2 a word strings out along its arc and is briefly unreadable; keep 0.1-0.15, or 0 at exec level.
- Numerals cross the term labels in transit (compute, return); they never rest on each other. In `sum` they cross the bar.
- WARN: packs carry two hue roles (accent, accent2); a third term takes `ink` and the sum result `chalk`, which in ceti-dark
  is nearly ink. ceti-dark accent2 (#B8322A) under 0.55 alpha is low contrast for the denominator dots; swiss-grid reads cleanly.
- Kerned pairs whose outlines overlap in x (AV, TY) fly as one rigid group. Numerals use `fillText` in the formula face.
- The ratio subset is seeded (mulberry32(seed)); its placement is illustrative, not a claim about which items were flagged.

## Cost
3.5-5 ms/frame at 960x540 x2 (shoot.mjs, 15 frames per brand, all three variants similar); purity identical in all three,
ceti-dark and swiss-grid. Setup (two TTF decodes, outlines) well under a second per variant.

## Renderer and fallback
p2d, Canvas2D paths with even-odd fill. Needs p5 2.x (`textToContours`, async `loadFont`). A pack face missing from
arsenal/fonts/fonts.js falls back to another weight of the family, else IBM Plex Mono (visible; `st.fontInfo.*.fallback`).
