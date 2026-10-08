# grid-type

**What it is for.** Layout and type as modules: a 12-column grid with gutters on the 960x540 basis and a 12 px baseline
(39 rows), named regions (`hero`, `side`, `ledger`, `caption`), a modular type scale with a ratio param, three layout
templates as data, and `fit(text, box)`. Roles come from the brand pack: body = step 0 (28), mono label = step -3
(floor 14), chrome = floor 12, disp = any step with a 28 floor. Everything is reported in CSS px at 390
(size x 390/960). A chrome can take `ARSENAL.gridtype.contentBox(template)` (hero union ledger) as its content box.
The demo sets one headline, a 1,000-mark count (38 accented, seeded) and a caption in each template; the grid
overlay (column bands, baseline rows, region outlines with `size u = css px` labels, muted/accent roles) shows for the
first half of the 8 s, then fades.

**When NOT to use.** Not a responsive layout engine: it is the 960 basis, scaled by the page. Not a text shaper:
no hyphenation, no kerning pairs beyond the browser, words are never broken.

## API (window.ARSENAL.gridtype)
`grid(o)` -> `{x(c), y(r), box(c0,n,r0,nr), colW, rows}`. `scale({base, ratio})` -> `{size(step, role), sizes(role, hi),
table}`. `fit(text, box, {family, weight, sizes | max,min, lh, B, wrap})` -> `{lines, size, lead, off, overflow}`;
shrinks along `sizes` (on-scale) or by 1 unit, wraps on spaces, leading and first baseline snap to B, truncates with
an ellipsis and sets `overflow` only at the floor. `markGrid(n, box)` packs n marks square. `layout(params, tokens)`.

## Params
| param | default | range |
|---|---|---|
| template | editorial | editorial, poster, sheet |
| ratio | 1.25 | 1.1..1.618 |
| base | 28 | 20..40 (step 0 = body floor) |
| gutter | 16 | 8..32 |
| margin, baseline | 48, 12 | 24..72, 8..16 |
| count, flagged | 1000, 38 | 1..5000, 0..count |
| overlay | auto | auto (first half of dur), on, off (`?overlay=`) |
| dur | 8 | seconds |
| headline, caption | text | any |

## Variants
- `editorial` (ratio 1.333, gutter 16): headline over the count in 8 columns, side column with the number and legend, rule in column 9.
- `poster` (ratio 1.5, gutter 24): one number, fitted continuously to 9 columns; headline small in the side; count as a full-width band.
- `sheet` (ratio 1.2, gutter 12): the factory layout: title, content box at left, ledger table and title block at right.

## Atlas
[[resolution-independence]] (all geometry on the 960 basis, scaled by the page) [[text-width]] (measured with canvas
`measureText`, the advance width incl. spaces; p5's `textWidth` is the tight box and is not used) [[text-weight]]
(weights come from the pack and are set in the font string; no variable-font axis used).

## Pitfalls
Fonts must be loaded before `setup` (measurement uses the loaded face; the demo awaits `document.fonts`). The numeral
box keeps 3 rows clear for the comma's descender. At 390 px the 28 caption is 11.4 px and chrome 12 is 4.9 px: the
floors are 960-basis floors, not phone floors. Labels in the overlay sit in the gap row under each region.
`fit` ignores ink bounds (side bearings, descenders) beyond the 0.78 em first-baseline rule.

## Cost
4 to 7 ms/frame at 960x540 x2 (shoot.mjs, 12 frames, 1,000 arcs batched in two paths). Renderer p2d. No beta API.
Re-seek purity: identical for all three variants.
