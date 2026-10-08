# fields

**What it is for.** Ambient, generative motion that stays a pure function of (seed, t): a quiet backdrop or a
signal-propagation visual under an explainer. All four variants share one seeded noise (4D value noise from
mulberry32, no p5 global noise state) and a 6 s period. Noise loops by sampling a circle in two extra dimensions;
grids loop by offsetting one shared phase by position, with whole cycles of t [[noise-loop]] [[grid-offset-loop]].

**When NOT to use.** Do not put it behind small body text at full amplitude (use `breath`, amp <= 1, or drop `amp`).
Not a data plot: positions carry no claim. Not for particle counts above ~600 in `drift` (cost is linear in t x count).

## Params (defaults; range)
- `seed` 7 (any int, via ctx.seed) · `period` 6 s (loop length; keep equal to the beat) · `amp` 1 (0..1.5, global strength)
- streamlines: `fs` 0.0042 (0.002..0.01 field frequency) · `swirl` 1.5 (0.5..3 turn range) · `dsep` 15 (8..30 line spacing) ·
  `step` 3 · `maxLines` 520 · `pulseFrac` 0.4 (0..1) · `pulseLen` 80 (px) · `lineAlpha` 0.9 · `lineW` 1
- gridwave: `spacing` 24 (14..40) · `waveLen` 300 (120..600 px per cycle) · `warp` 0.35 (0..1 noise-loop phase warp) ·
  `lift` 8 (0..16 px) · `dot` 2.4
- drift: `count` 230 (50..600) · `trail` 26 (steps of 1/30 s, 8..60) · `speed` 70 (px/s) · `loopR` 0.9 (circle radius, higher = faster field change) ·
  `driftFs` 0.0024 · `penW` 1.6
- breath: `tick` 19 (px grid) · `jitter` 6 · `tickLen` 9

## Variants
1. `streamlines`: Jobard-style spaced streamlines traced once in setup from the noise angle (Hobbs proportions); each line breathes
   in alpha and an accent pulse travels along it, phase = f(t) only, integer speed multiples so t=6 equals t=0 [[flow-field]].
2. `gridwave`: 6 s seamless loop; row lines lifted by `sin(2pi(t/P - d/waveLen + warp*loopNoise))`, crests in accent [[loop-phase-animation]].
3. `drift`: particles integrate the loop-noise field from t=-trail with a fixed 1/30 s step on every frame (hash-seeded respawns),
   pen-like tapered trails in four alpha tiers, accent heads. The FIELD loops at P; particle positions do not (they carry history).
4. `breath`: jittered tick lattice, angles from loop noise, length and alpha breathing at low amplitude (max alpha 0.42 of `muted`).

## Atlas
[[flow-field]] [[noise-loop]] [[loop-phase-animation]] [[grid-offset-loop]] [[noise]] [[random-seed]] [[seeded-determinism]] [[golan-levin-loop-templates]]
(S-ids as cited on those pages: S84 S88 S366 S133 S141 S135 S142 S186 S387 S65 S72 S128 S374).

## Pitfalls
- Raw value noise clusters mid-range: `loopField` widens it (x2.6) or every field looks nearly straight.
- `drift` field has sinks; high `swirl`/`driftFs` makes particles bunch into spirals. Keep driftFs <= 0.003.
- Respawn points come from `hrand(seed,i,k,j)`, never a shared stream, so any seek order gives the same pixels.
- Uses raw Canvas2D (`p.drawingContext`) for speed; `p.background(bg)` clears. Tokens roles only: bg, line, ink, accent, muted.
- WARN: the single contact-sheet look suggested `drift` is busiest and `breath` very faint on dark packs; light packs (swiss-grid)
  not inspected.

## Cost (960x540, density 2, measured draw ms, setup excluded)
streamlines 1.5 ms · gridwave 4 ms · breath 1.5 ms · drift 43 ms at t=6 (cost grows with t, 230 particles). Harness
ms_per_frame 13 including seeks; all far under 0.5 s. Setup: streamlines is the slowest (tens of ms).

## Renderer / fallback
p2d. No beta or unreleased API; vendored p5 2.3.4 only for canvas and `describe()`.
