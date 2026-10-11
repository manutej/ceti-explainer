# motion-curves · closed-form easing tokens for hero moves, staggers and settles (p2d demo; pure math, any renderer)

**For.** Wave WOW gap 1 (WOW-GAP-AUDIT): every move in the six films is a 4.5-11 s cubic in-out, symmetric and tail-less; product-demo motion is a hard attack and a 0.4-0.8 s tail (WOW-MOTION 1.1, rubric P1 P2 P3 P4 P9). Seven tokens, each a pure function of u = elapsed / duration, exactly 0 at u <= 0 and exactly 1 at u >= 1, no integrator state, so seek is safe: `lib.tokens[name](u)`. Also `move(t, t0, dur, ease)` -> `{x, u, settled}` (`settled` = inside 0.1 % of the target for good), stagger helpers, and factories `spring(z, W)`, `bezier(x1,y1,x2,y2)`, `ramp(k, a)`, `rampK(content_s, real_s, a)`, `anticipate(c, a)`. The tokens are also in `ARSENAL.core.timeline.ease` and in the gl-camera-rig EASE table (same code; the demo `check()` proves max difference 0 over 1,001 samples each). pattern.js is 6,126 bytes.

**When NOT to use.** A move that carries a number, text, colour or opacity: use `emph`, `expo-out` or `settle` (overshoot 0). Overshoot (`spring-hero`, `spring-snappy`, `anticipate`) is for marks and objects only; timeline.js clamps colour mixing for any ease flagged `.os`. Tracked mark transitions (existing marks re-partition) never stagger (R-E T5, Chevalier 2014); entrances do. Real physics (collisions, pour): patterns/physics.

## Tokens (measured in the demo: `__film.check()`)
| token | maths | designed dur | overshoot | 2 % band | use |
|---|---|---|---|---|---|
| spring-hero | z 0.72, w 11 rad/s; x = 1 - e^(-zwt)(cos wd t + (zw/wd) sin wd t), wd = w sqrt(1-z^2) | 1.0 s | 3.84 % | 0.54 s | the one hero object per beat landing; a dolly, a card arriving |
| spring-snappy | z 0.85, w 18 | 0.5 s | 0.61 % | 0.23 s | labels, chrome, small marks |
| expo-out | (1 - 2^(-10u)) / (1 - 2^-10) | 0.9 s | 0 | 0.50 s | whip then land: camera dolly, 82 % of travel in the first 25 % |
| emph | cubic-bezier(0.2,0,0,1), Newton on x(s) = u, bisection if it stalls | 0.7 s | 0 | 0.54 s | Material 3 emphasized: numbers, text, opacity, anything that must not overshoot |
| ramp | rate k (6) until a (0.55), then eases to 1: P = integral / total | 2 s+ | 0 | - | time-warp: fast part is k x the end speed; count-ins, long processes; `rampK(10, 2)` = 6.16 gives exactly x1 at the end |
| settle | z 1 (critical), w 12 | 0.8 s | 0 | 0.49 s | arrive and rest with a spring feel but no overshoot: camera, counters |
| anticipate | -2 % dip over 15 % of the move (4 frames at 30 fps, dur 0.9 s), then emph | 0.9 s | dip -2 % | 0.73 s | before the one hero move of a beat; never on camera |
Spring residual: f(1) would be 1 - 0.1 %; a u^3 taper removes it so the end is exact (error vs an RK4 reference of x'' = -2zwx' - w^2(x-1) at 20 seeded times: 4e-4 to 7e-4, that taper). ζ <= 1 only (capped). Using a spring at another duration scales it in time (dur 0.5 on spring-hero is a faster, harder spring, same overshoot).
Stagger: `stagger.linear(n, gap)`, `.centre(n, gap)`, `.grid(rows, cols, gap, {from: 'tl'|'br'|'centre'|[r,c], metric: 'manhattan'|'euclid'|'chebyshev'})` return offsets in seconds (row-major for grid), earliest 0, `.span`, `.gap`; the span is capped at 0.8 s (`cap`) by shrinking the gap. 40-80 ms per item for lists, 2-3 frames chrome.

## Params
`dur` 4 (s), `t0` 0.9 (move start), `tokens` list (a name, a function or `[x1,y1,x2,y2]`; `inout` is the baseline), `mode` lanes | grid, `rows` 6, `cols` 10, `gap` 0.05, `from` 'tl', `metric` 'manhattan'. Pattern `draw` is a stub; the scene is scene.js (demo only, not shipped).

## Variants
springs (inout baseline, spring-hero, spring-snappy, settle) · curves (inout, expo-out, emph, ramp, anticipate) · stagger-grid (linear, centre-out, 5 x 10 grid from the centre, on spring-hero rises with opacity on emph).
Each lane: the same box and travel, a ghost every frame at 30 fps, position vs time with the 2 % band, a moving/settled readout. Sheet: shots/contact.png (ceti-dark), shots/swiss-grid/.

## Camera rig additions (arsenal/patterns/gl-camera-rig)
`script.settle` (s, e.g. 0.4): true stillness after each move; `rig.warnings` lists moves that start inside it. `script.drift = {amp 0.015 (<= 0.02), seed, ramp 0.6, period [7,11]}`: a seeded wander of the eye (dolly 0.7, side 0.5, lift 0.3 of amp x eye distance) during holds only, zero at hold start, through the settle, and at the next move start (so every move starts from its exact key); measured peak 1.18 % of eye distance, 0 while moving. Pose gains `settled` and `drift` (envelope). Knobs `camDriftAmp`, `camHoldSettle`. Variant `spring-hold`. dolly interpolates distance geometrically, so a 3.84 % spring in s reads as 2.1 % in distance. Both default off: existing scripts are byte-identical (all stills of the 9 old variants and the timeline demo match, kit2 builds of pass-every-time and who-gains identical).

## Atlas
[[easing-functions]] S79 S80 S81 S335 (families; clamp before overshoot; the spring and bezier forms are not in the atlas, sourced in WOW-MOTION 1.1: Apple spring response/damping, Material 3 emphasized (B)); [[pure-function-of-t]] S129 S131 S316 (closed form instead of integrating, see [[euler-integration]] S82 S84 for why not); [[seeded-determinism]] S128 S140 S316 (drift phases from mulberry32(seed)).

## Pitfalls
- Springs are not monotone: a value that must not exceed its target (a count, an opacity, a bar length that is a claim) takes `emph` or `settle`.
- Anticipation is in u: the dip lasts a x dur seconds. At dur 0.9 and a 0.15 it is 4 frames at 30 fps; at dur 2 it is 9, too long. Rebuild with `anticipate(c, 0.135/dur)`.
- `move().settled` uses the token's own 0.1 % rest point (spring-hero at u 0.873), so it flips before dur; for a plain function it flips at u = 1.
- ramp ends at a non-zero velocity (that is its point); follow it with a hold or `settle` on the arrival, not a stop.
- Hero moves are 0.8-1.6 s; give the freed seconds to a hold after landing (settle 0.3-0.5 s) and keep the top mover >= 3x the second (P7).
- The 4 frame / 2 % / 3.84 % numbers are targets from the research (grade B/C), not measurements of a viewer.

## Cost / renderer
Token eval ~0.3 us; tag scan at load 4,200 evals. Demo 7.9 ms/frame (shoot harness, 960x540 x2); re-seek identical on all variants, both packs. Renderer p2d for the demo; the maths has no renderer. No beta APIs.
