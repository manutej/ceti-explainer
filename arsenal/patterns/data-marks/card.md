# data-marks

**What it is for.** Honest animated chart marks for explainers, no chart library (D3 is deliberately not imported; see [[d3]]).
Bars, lines, areas, dots, dumbbells, a slope chart and a waffle, each with `enter(p, u, T)` and `highlight(pred)`.
Counts come first (every label counts up and lands exactly on the claimed number), scales are declared (a drawn,
heavy, labelled zero; a drawn axis break plus the note "axis starts at N, not 0" for any truncated domain), gridlines use
the `line` role, labels are shoved apart by a 1D relaxation and get a leader when moved. Reusable API: `ARSENAL.dataMarks`
= `{ scale, axis, shove, bars, line, dots, dumbbell, slope, waffle, fmtN }`.

**When NOT to use.** Dense or interactive charts (hundreds of series, tooltips, zoom), maps, anything needing pan/brush,
or a bar/area on a truncated axis: `bars()` and `line({area})` THROW if the scale does not start at 0. Use a line or dumbbell
with a drawn break instead.

## Params (pattern.params; every variant overrides `mode`)
| param | range / meaning |
|---|---|
| mode | `race` `line` `waffle` `slope` |
| race | `{years[], max, hlName, data:[{name, v:[per year]}]}`; final gaps should exceed 6 units or rows will not separate |
| n | line points, 2..200 |
| line | `{title, sub, d0, d1 (domain; d0>0 draws a break), unit, name, area, total, claim(A,pk)}` |
| waffle | `{groups:[{label,n}]}` with n summing to 100; axis fixed 0..50 so the count never rescales |
Timing (12 s): enter 0 to ~1.5 s, move 1.5 to ~10 s, highlight at ~10.2 to 10.8 s. Tempo ease comes from `tokens.tempo.ease` (`cubic`, `expo`).

## Variants
- `bar-race`: 8 suppliers x 6 years on a fixed 0..250 axis; bars grow from zero, a soft rank (smoothstep of value gaps) slides rows when values cross; Cedar is highlighted at the end.
- `line-peak`: two monthly series, arc-length reveal with a leading dot, value labels follow the dots and are shoved apart, data points appear as the line passes, the peak is ringed and named; y axis truncated at 40 with the break drawn.
- `waffle-bar-dot`: 100 cells (1 cell = 1 user) travel to three rows, fuse into bars, then each bar contracts to a dot at its value with a stem from zero; the count labels increase as cells land.
- `dumbbell-slope`: the same six before/after values as a dumbbell and as a slope chart (shared 0..100 scale), highlight = gain of 20+ points.
- `area-from-zero`: cumulative signups as an area, zero drawn, lands on 1,240.

## Atlas
[[map-norm-constrain]] (clamped local progress, `seg`, `lerp`, scale `at()`); [[shape-2d-primitives]] (rect, arc, roundRect via the canvas context);
[[text-width]] (labels measured with `measureText`, advance width); [[d3]] (what not to import: only the idea of explicit scales and axes). No S-ids are carried beyond those pages.

## Pitfalls
- Never feed a truncated scale to `bars` or `area`; the throw is intentional.
- `shove` keeps order and guarantees the gap, but a label can drift from its point; leaders are drawn when it moves more than 3 units.
- Line x is an index, not a scale: the variant draws its own x ticks.
- The ease-out makes a bar collapse into a dot look instant in its first frames; lengthen `c` if needed.
- Soft-rank width `w=6` is in value units; rescale it for other domains.
- Fonts are only the brand pack's families; load them before the first seek.

## Cost
About 6.3 ms per frame at 960x540 x2 density (shoot.mjs, 20 frames, headless). Pure of t; seed only in setup (`mulberry32`).

## Renderer / fallback
`p2d` (Canvas 2D context through p5.drawingContext). No beta APIs. `ctx.roundRect` falls back to `rect` where missing.
