# rhythm · visual tempo for silent films

**What it is for.** A silent film has no sound to carry time, so the picture must. This pattern derives a beat grid
from the brand's `tempo.beat_s`, snaps every entrance, hold and exit to beats and half-beats, and supplies three
reusable pieces: named easing curves, an emphasis vocabulary (pulse, settle, tick, flash-then-hold, breathe) where each
is a pure function of (t, beat), and a caption cadence helper that paces captions to the grid and reports words per
second against a 2.5 to 3.5 reading range. Library: `ARSENAL.patterns.rhythm.lib = { snap, grid, EASES, easeFor, EMPH, cadence, planScene }`.

**When NOT to use.** Narrated or scored films (time then belongs to the audio clock, [[beats-and-captions]]);
physics (use patterns/physics); a film whose beats are already authored by timeline.js and need no grid.

## Params
- `mode` 'scene' | 'easing' | 'emphasis'.
- `beat_s` null (brand `tempo.beat_s`) or 0.5..10 s per beat. `dur` 12 s scene length.
- `lo` 2.5, `hi` 3.5 words per second reading range. `ctx.tokens` required in setup.
- Lib: `snap(t, beat, sub=2)`; `grid(beat, dur, sub)`; `cadence(items[{text, at}], {beat_s, grain 0.5, lo, hi, target 3, end})`
  returns `{t, end, words, beats, wps, status: ok|slow|fast, clipped}`; `EMPH[name].fn(t_local, beat)` returns `{s, rot, glow, v}`.

## Variants
1. `tempo-2.5`, `tempo-4`, `tempo-5`: the SAME 12 s scene (ideal-second cues, snapped to half-beats; collisions fan out by
   1/8 beat) under three tempos, with the grid, a Gantt lane per cue (hollow square = ideal time, bar = snapped move),
   caption blocks coloured by reading range, and a live wps readout. Slow tempo means fewer distinct moments.
2. `easing-chart` (beat 3.4 s): quad, cubic, expo, back, anticipate, snap; a mark rides each curve and a block rides
   each lane; the brand's own ease is lit.
3. `emphasis` (beat 1.5 s): five cells, each with its shape, a 4-beat value trace, and a beat stripe.

## Atlas
[[easing-functions]] (S80, S81 formulas; S79 clamp before overshoot), [[oscillation]] (S85 sin from the clock, S70),
[[loop-phase-animation]] (S135, S387 whole cycles, phase from t), [[beats-and-captions]] (S322, 0.3 s fade).

## Pitfalls
- Snapping coarsens at slow tempo: at beat 5 a half-beat is 2.5 s and four cues share three slots. Intended, but audit it.
- Caption wps depends on beat_s: 6-word captions read slow at beats 2.5 and 5 (WARN shown in the demo). Pick word counts per tempo.
- `back`, `anticipate` overshoot: clamp alpha, never positions you want to hold.
- Emphasis uses time local to the cue; pass `t - t0`, not global t, unless the cue is on the grid.
- WARN: sampler notes for flash-then-hold wrap to three lines at 960 px; scene lane labels are 9.5 px mono.

## Cost and renderer
p2d, about 5 ms per frame at 960x540 density 2 (measured 4.7). No beta APIs, no fallback needed.
