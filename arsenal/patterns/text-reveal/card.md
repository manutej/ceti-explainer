# text-reveal · text arrives, labels attach, numbers land (Wave WOW lane B2)

**What it is for.** Text that never pops. `pattern.js` (8.2 KB, pure in t, no state) returns plain prims for: a masked rise with a per-line stagger (a clip band, 3-frame step, a whole wave <= 0.8 s, exit at 0.6x in reverse order); label attach (dot, then a leader that draws on in 9 frames, then the label, using a gl-labels placement as given); counters (tabular digits, a count-in of REAL counts, a weight pulse on landing; a ratio or percent is `land()` and never rolls); and one silent beat per landing (a 3-frame ring). Films call it through `K.reveal` (factory/kit2/text-reveal.js, opt-in): the same `K.tx/K.ln/K.rc` and `data-role` as every kit text, so G5/G6/G11 read it as before. Rubric: P6, P10, P14, P15, P22 (WOW-MOTION 4.1-4.3; WOW-GAP-AUDIT gaps 2 and 7).

**When NOT to use.** Tracked marks (R-E T5: no stagger on tracked marks). Captions (hard cuts are the caption rule). A ratio that must be computed on screen (formula-bind). Text inside a mark in world space. A film that must rebuild byte-identical to its hash: add the libs only when you want the effect.

## Use in a film (opt-in)
film.json `"libs": ["arsenal/patterns/text-reveal/pattern.js", "factory/kit2/text-reveal.js"]` (add `arsenal/patterns/gl-labels/pattern.js` first when you attach solver labels). A film without them is unchanged: factory/films/pass-every-time rebuilds to sha256 b9407025... before and after this lane (cmp identical).
```js
K.reveal.block('h', 'labels', 60, 150, ['A', 'B', 'C'], {at: 0.3, out: 3.2, size: 16, fill: 'ink', role: 'secondary', lh: 28});  // one wave
K.reveal.tx(key, layer, x, y, s, {at, out, i, n, size, fam, fill, role, anchor, dir, travel});   // one line; i/n place it in a longer stagger
K.reveal.label(q, {at, out, layer});                 // q = GLL.solve(...).placements[k]: dot at q.ax/ay, leader q.lead, label q.tx/ty (+ sub)
const A = K.reveal.arrivals(t0, {to: 460, cdur: 1.6, claim: '...'});   // land mark i at A[i]; then
K.reveal.count(key, layer, x, y, {at: t0, to: 460, cdur: 1.6, claim: '...', arrivals: A, out, size: 56, fam: 'mono'});  // value = marks landed
K.reveal.land(key, layer, x, y, '60.4 %', {at, out, size: 56});     // ratio / percent: rise, then the weight pulse
const nudge = K.reveal.ring(key, layer, x, y, {at: A[A.length - 1]});   // one 3-frame ring on the mark; nudge = 1..1.05 scale for the mark
```
Time is `o.t` else `K.t`. `o.out` is the exit start. Pure: the DOM holds no history (clipPaths are drawn through K.E, G2b identical).

## Rules (each one is checked: demo `__film.check()`)
1. **Wave.** n lines: rise 0.32 s, stagger 0.1 s (3 frames); the wave is capped at `wave` 0.8 s (n=8 gives 0.8 s at 2 frames; beyond ~9 lines split the panel). Expo-out (k 6), no overshoot on text.
2. **Mask.** Travel is 1.05 em inside a band [y - 0.95 size, y + 0.3 size]. G11 reads getBBox (the clip is invisible to it): keep the travel (1.05 em below the slot, or `dir:'above'`) clear of other text and of the caption band. Opacity is 0 at p = 0, so a not-yet-started line is not judged.
3. **Exit = 0.6x** the entrance, reversed order, ease-in (attach: label, leader, dot at 0.6x: 0.78 s in, 0.468 s out).
4. **Attach.** Dot 0.18 s, leader 0.30 s (9 frames, >= 6 required), label 0.30 s; the label starts when the leader ends. Anchor stays in the solver for `span(o).out` after your exit time. Start at the solver's first-visible time (hold 8 delays entry 0.27 s; use `hold: 0` for a static camera). Sub text drops `subGap` 3 so it clears the main line in the G11 box.
5. **Counters.** `count` throws unless `from`/`to` are integers and `claim` (formula or source of `to`) is given: every shown value is a landed count. Rate = 1 - (1-u)^2.6: the last 10 % of the count takes 41 % of the time (>= 40), speed 0 at the landing. Pass `arrivals` (your marks' landing times) and the value is exactly the marks on screen. Weight pulse = a stroke of 0.045 em in the text colour for 0.35 s (a smooth faux weight on any face; no layout shift). Ratios, percents, finals: `land()`; `count` refuses them (`ratioRollRefused`).
6. **Tabular digits.** The adapter sets `font-variant-numeric: tabular-nums` and defaults counters to the pack's mono (digit widths measured by the demo: IBM Plex Mono 24 px at 40 px, spread 0). Big Shoulders digits are proportional and have no `tnum` (8.7 to 16.7 px spread); Jost has `tnum`, Newsreader is tabular. For a count in a proportional face, anchor `start` or `end` and check the spread.
7. **Beat.** One ring per landing, 3 frames (`frames`), centred on the mark, never on a digit; `nudge` (<= 1.05) for the mark itself. At most one strong beat per film (rubric P22 caveat).

## Variants (demo.html: ?brand=<id>&variant=<name>; dark ceti-dark, light swiss-grid)
`rise-stagger` (5-line panel in 0.4/out 4.4, a drop-from-above panel, an 8-line wave at the cap) · `attach-leader` (three gl-labels placements on the 460-try field: dot, leader, label, out at 0.6x) · `counter-land` (460 tries land as a count, 278 pass, the last pass rings, 278 / 460 = 60.4 % lands with the pulse).

## Evidence
shoot.mjs: 3 variants x 2 packs, purity identical, 0 errors; sheets `shots/contact.png`, `shots/swiss-grid/contact.png` (times 0.07-1.0 of 7 s; the first six columns are inside the first second). Gate film `gate-film/` (kit2 build, ceti-dark and swiss-grid, exec): G1 to G12 all PASS (G2b SVG purity identical, G11 no overlap, nothing in the caption band); shots in `gate-film/shots/*-sheet.png`. Cost: demo 6-12 ms/frame (p2d); the gate film seeks at 1.2 ms/frame with 460 marks.

## Params (`D`; knob candidates)
`dur` 0.2-0.5 · `step` 0.067-0.133 · `wave` 0.6-0.8 · `travel` 0.6-1.2 em · `exit` 0.6 (fixed by the rubric) · `dot/lead/lab` (lead >= 0.2) · `k` 3-8 · `r` 2-6 · `pulse` 0.2-0.5 · `wt` 0.02-0.07 em · `subGap` 0-6 · `ease` (a fn u -> 0..1 to swap in motion-curves' expo-out) · counter `cdur`, `ck` 2.2-3.5 (>= 2.5 keeps the 40 % rule), `dec`, `group`, `unit`.

## Atlas
[[kinetic-typography]] S46 S334 (type motion; textWeight is the variable-font route, not used: static faces, so a stroke pulse) · [[easing-functions]] (expo-out) · [[beats-and-captions]] (caption band, holds) · [[explainer-clock]] (one clock, pure t). Research: WOW-MOTION 4.1 (mask), 4.2 (numbers), 4.3 (labels).

## Pitfalls and WARNs
- WARN G5c: running-counter values (71, 324 ...) print as "not in claims" (WARN only; factory/kit2/README defect 7 is the gate-side fix). Each is a count of landed marks.
- The canvas painter (scenes.js) is demo-only; films use SVG. Canvas has no `fontVariantNumeric`, so the demo's counters use the mono face.
- `pattern.js` is 8,163 of the 8,192 bytes the lane allows: no room to grow; put new scenes in scenes.js or the film.
- `K.reveal` text keeps kit2's floors and display-face compensation (K.tx): a clip band uses the authored size.
- The gate cannot see canvas text; keep revealed text in SVG (`K.reveal`), not in WEBGL `text()`.
- No overshoot on text (rubric P3); springs belong to marks (motion-curves, lane B1): hand `o.ease` in when it lands.
