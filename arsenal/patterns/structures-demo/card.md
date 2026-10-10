# structures-demo

**For.** Showing that a count is a *thing that can change shape*: the same marks carried through grid, wall, ring and
columns; a 60-node tidy tree; a 24-event timeline with a ken-burns pan; a seeded scatter settling into rows then cells.
Layout comes from `arsenal/structures/structures.js`; this page only draws squares and thin rules.

**Not for.** Counts under about 20 (use plain type), or counts where a mark below 7 units on the 960 basis is unavoidable
(`fit().group` says how many to fold into one symbol).

## Params (defaults)
- `mode` thousand | tree | timeline | scatter
- `n` marks (1000 / 60 / 24 / 500; legible range 20 to ~1,800 in an 840x360 box)
- `groups` counts for columns/rows (sum = n), `names` labels, `world` timeline world width (1700; 1200 to 3000)
- seed from ctx (2017 in the demo)

## Variants
1. `thousand`: 1,000 marks, grid 0-2 s, wall, ring, columns; the flagged 40 turn accent2 in the last hold. Stagger and arc per move.
2. `tree60`: 60 grid cells fly into a tidy tree by depth, edges fade in, a root-to-leaf path is traced in accent2.
3. `timeline24`: 24 events on a 1,700-unit axis; the camera pans left to right while easing from 1.3x to 1.0x. Events appear as the sweep reaches them.
4. `scatter-rows`: 500 marks, blue-noise scatter to four labelled bands to a grid with the 60-mark band highlighted.

## Atlas
[[derived-geometry]] (all geometry derived from t, nothing stored), [[resolution-independence]] (960 basis, 7-unit floor),
[[shape-2d-primitives]] (marks are rects, stems are lines), [[triangle-subdivision]] (contour-tidy recursion cousin; cited for its fixed-depth, seeded discipline).

## Pitfalls
Wall and ring change size per layout, so a transition lerps `w,h` too. Columns are bottom-anchored; labels sit under the baseline.
Tokens only: colours via `ink, accent2, line, accent, muted, bg`; type via `type.mono`. Works unchanged with `?brand=neon-lab|swiss-grid|tender-set`.

## Cost
About 15 ms/frame at 960x540 x2 density (1,000 marks; setup rebuilds layouts each seek, included).

## Renderer / fallback
p2d (Canvas2D via drawingContext fillRect); no beta APIs.

## WARN
Scatter may overlap 1-2 pairs at default shrink. Timeline pan shows the end state only at t = 12; the contact sheet's last frame is the right end of the axis.
