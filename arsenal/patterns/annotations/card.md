# annotations · the vocabulary of pointing

**What it is for.** Marks that say "look here" and then leave: callouts with elbow, curved or straight leaders that
route around the thing they point at; curly and square brackets spanning a range; dimension lines with extension
lines and oblique ticks; hand-drawn circles and underlines (spline with seeded tremor, tapered, pen tip); numbered
pins; a spotlight label that dims everything else through a contour hole. Every mark is anchored in world space,
draws on by arc length, holds, and retracts by the same length table in reverse (label first, then line). Labels are
always >= 14 units, carry a token role (`must-read` = ink, `secondary` = muted) and sit on a panel pill. A layout
audit counts label/label and label/target overlaps and leader crossings.

**When NOT to use.** Marks that must follow a moving target (anchors are static; derive them per frame yourself and
rebuild the cache), long prose labels (use captions), dense scatter plots where leaders cannot find clear air.

## Params (defaults in pattern.js)
- `scene` 'diagram' | 'bars' | 'text'; or `annos` (list below) + `underlay(p,T)` + `obstacles:[{x,y,w,h}]`
- `dur` s 8; `lead` s .35; `inEnd` .3..0.9 of dur (last mark arrived); `inDur` s .4..2; `outStart` .6..0.95; `outEnd`; `outDur` s
- `ease` cubic|expo|back, `easeMode` inOut|out; `lineW` 1..5; `wobble` 0..2; `gap` 4..14 px stand-off; `dim` 0..1; `pen` bool
- annotation: `{kind, t0?, t1?, text, role:'must-read'|'secondary', lineRole, size>=14}` plus per kind:
  `callout` target {x,y[,w,h]}, at [x,y] (label centre), side top|bottom|left|right, frac 0..1, shape elbow|curve|straight, end dot|arrow;
  `bracket` from, to, style curly|square, side +1|-1, depth, tip; `dim` a, b, offset, side, labelAt mid|side;
  `circle` box, pad; `underline` box, style hand|wave, double, drop; `pin` n, at, off, text; `spot` box, pad, at.

## Variants
1. **callouts**: pipeline of six nodes, six callouts in a stagger (two elbow, two curved, two straight), top and bottom.
2. **bars**: bar chart with a square bracket under the axis, a curly bracket over the ramp, a dimension line to the goal
   (label derived from the data: "gap 23", "ramp +18"), one straight callout; expo ease.
3. **handmarks**: a paragraph with circled words, single, wave and double underlines, one curved callout; wobble 1.3.
4. **spotlight**: dimmed diagram with one lit node and a label, then three numbered pins; back-out ease (pins pop).

## Atlas
[[arc-length-reveal]] (length table, slice between two arc positions: S309); [[shape-custom-shapes]] and
[[bezier-vertex]] (bezierOrder 3 chains for the curly brace, `beginContour` hole for the spotlight, S6 S357);
[[text-width]] (label pills and word boxes from `textWidth`, S35); [[derived-geometry]] (anchors, leader routes and
labels computed from the target rect, never stored per t, S314).

## Pitfalls
- Text metrics need the brand font loaded before first draw (the demo awaits `document.fonts.load`); layout is cached per `tokens.id`.
- Leaders stop `gap` short of the target and approach perpendicular; an elbow tries five mid-run positions and logs a crossing if none is clear (`audit.leaderCrossings`).
- Labels are clamped inside the 960x540 frame; the audit still flags overlaps, so move `at` rather than shrink text.
- `back` ease overshoots: paths clamp, only pin badges use the overshoot.
- Pin number ink is chosen between bg and chalk by contrast against the pin role.
- Spotlight hole depends on `beginContour` winding (outer clockwise, hole reversed); verified in Chromium.

## Cost
About 6 ms/frame at 960x540 x2 (shoot.mjs, 16 frames, repeat-seek purity identical in all four variants). Renderer p2d.
Fallback: none needed; if `beginContour` is unavailable, draw four rects around the hole instead.
