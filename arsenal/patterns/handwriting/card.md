# handwriting · single-stroke glyphs written by a hand

**What it is for.** Writing as a hand would, pure of t. Digits 0-9, + − × ÷ = % ≈ . , and letters i n o x t are each
one or more strokes in writing order (Catmull-Rom splines via `splinePoint`, polylines for corners). Each stroke gets
a speed profile (slow at ends and corners, fast mid-stroke) and its width follows speed (slow = thick), so pressure
falls out of the timing. A pen-tip dot (halo, dot, chalk centre) rides the live stroke and lifts off as it ends.
`text` ops compose numbers with side bearings and kerning pairs; ops run line by line at a hand pace, with breath
between lines scaled by `tokens.tempo.beat_s`. Emphasis ops: `underline` (double), `circle` (1.13 turns, overshoot),
`arrow`. Every glyph instance carries a seeded wobble (rotation, scale, shear, baseline, two-axis path tremor), so
re-seek is identical. Use for worked arithmetic ("21 ÷ 1,000 ≈ 2 in 100"), marginalia over a typeset headline,
a glyph specimen.

**When NOT to use.** Prose (only 25 glyphs; no letters beyond i n o x t), text that must be searchable or crisp at
body size (use typeset + `describe()`), dense tables, anything where a hand-made look reads as unserious.

## Params (defaults in pattern.js)
- `layout` 'glyph-sheet' | 'arithmetic' | 'annotation'; or `ops: [...]` (below)
- `dur` s (8); `hold` 0..0.3 trailing fraction; `lead` s before first stroke; `fit` bool: scale writing to fill
  `dur` (true) or use absolute `speed` / tempo (false); `speed` 200..900 px/s pen speed
- `pen` 2..5 px base width at size 70; `slant` 0..0.3 shear; `wobble` 0 (ruled) .. 2 (shaky)
- `penTip` bool; `order` bool stroke-order numerals; `guides` bool baseline + cap line for ops with `guide`
- ops: `{op:'text', id, s, x, y, size, align, role, pause, pen, wob, vb, guide}`; `{op:'type', id, s, x, y, size, font}`
  (typeset foil, measured for refs); `{op:'underline'|'circle', ref, i0, i1, gap|pad, role}`;
  `{op:'arrow', from, to, bend}` where from/to are `[x,y]` or `{ref, i0, i1, at:'left|right|top|bottom|center', dx, dy}`.
  Roles are token roles only. `ctx.tokens` supplies tempo and type; `ARSENAL.patterns.handwriting.GLYPHS` is the set.

## Variants
1. **glyph-sheet**: 24 ruled cells (digits, signs, letters) writing themselves in order with stroke numerals and a
   stroke counter; wobble 0.6.
2. **arithmetic**: `21 ÷ 1,000 = 0.021`, `0.021 × 100 = 2.1 %`, `≈ 2 in 100` line by line; circle on the 2 and a
   double underline in accent2. Honest line: the last step rounds 2.1 to 2.
3. **annotation**: typeset "2 in 100" (Big Shoulders) with a handwritten note, a curved arrow, a circle, an underline
   and a result written over it; wobble 1.5, slant 0.2.

## Atlas
[[arc-length-reveal]] (cumulative length table, here a cumulative TIME table so speed varies along the stroke),
[[spline-vertex]] / [[shape-curves]] (`splinePoint` sampling, corners as polylines), [[p5-scribble]] (seeded
bowing/roughness lineage, no library code), [[text-to-contours]] (the typeset foil is measured with `textWidth`
prefixes; real outlines are not needed for a single-stroke set), [[seeded-determinism]] (mulberry32 per op).

## Pitfalls
- Spline glyphs closed by overlap (0, 8, o) show a small cusp where the pen returns; intended, as a pen does.
- `type` ops need the font loaded before `setup` (the demo awaits `document.fonts.load`).
- Char boxes for refs use cap height 0.7 em for typeset text; adjust `dy`/`pad` for other faces.
- Time is fitted: adding ops makes every stroke faster unless `fit:false`.
- Letters other than i n o x t draw nothing and read as a space; add to `GLYPHS` (strokes in writing order).
- Dots (i, ÷, .) are 1.5-unit strokes; they land thick by design (slow = thick).

## Cost
~6 ms/frame at 960x540 x2 density (Canvas2D, per-segment variable width); 38 strokes in the sheet.

## Renderer
p2d. No beta APIs: `splinePoint` is 2.x stable. No fallback needed.
