# timeline · one scene, three timelines

**What it is for.** Showing and testing the authoring core (arsenal/core/timeline.js): the SAME scene function
(`sceneA`, `sceneB`) is re-timed by three authored timelines, with zero scene-code change: slow pedagogic (13.4 s),
fast reel (3.8 s), stagger-heavy centre-out ripples (8.8 s). Scene windows and captions come from the timeline's own
beats, so retiming the beats retimes the scenes and the cross-fade. A chart of the tracks is drawn below the scene
(playhead, beats, scene bands, one lane per channel, a colour strip for the oklab highlight track).

**When NOT to use.** As a motion look on its own: it is an authoring pattern, not a visual one. Do not use for
physics or anything that integrates state; tracks are lookups.

## Params
- `rhythm` 'slow' | 'fast' | 'stagger' : which recipe authors the tracks (variants set this).
- `dots` 16 (2..32), `bars` 8 (2..12) : counts in the scene; every recipe keys off them.
- `fade` 0.45 (0..1.5 s) : scene cross-fade length.
- `axisT` 14 (s) : shared time axis of the chart so the three rhythms compare at scale.
- `chart` true : draw the track chart. `ctx.tokens` (brand pack) is required in setup; ctx.seed seeds the bar data.

## Variants
1. `slow-pedagogic`: waits between beats, 0.2 s dot gap, 0.36 s bar gap, long highlight tween.
2. `fast-reel`: no waits, 35 ms gaps, springy `back`/`expo` moves; most of the 14 s axis is hold.
3. `stagger-heavy`: heavy overlap (1.4 s moves on 90 ms gaps), `order:'center'` ripples, `inout` counter.

## Atlas
[[track-tween]] (S323 alpha model, S339 colorMode before lerpColor), [[timeline-builder]] (S322, S311 stagger ends at
the latest end), [[scene-local-time]] (S319, S137 fade at boundaries), [[beats-and-captions]] (S322),
[[generator-scenes]] (recipes are compiled once, not replayed), [[explainer-clock]] (S317 pure of t).

## Pitfalls
- Ease on a keyframe governs the segment leaving it; the last keyframe's ease is unused.
- Overlapping plays on one key: latest-started wins, and its start value is the live value, so motion stays continuous.
- Colour mode is per track and fixed at compile time; mixing rgb and oklab ends needs two tracks.
- Draw captions after the scene host restores alpha, or they inherit the scene fade.
- `back` overshoots 1: clamp when a value is used as alpha (the scene does).

## Cost
0.023 s/frame at 960x540 x2 density (shoot harness, 12 frames, chart paths sampled once in setup).

## Renderer / fallback
p2d. Pure JS core, no beta APIs. `p.textWeight` is used when present; otherwise the face's default weight.

## Verification
shoot: 0 errors, re-seek purity identical for all three variants. Core check in node: track() reproduces the kit's
`seg()`, `ease(seg())` and the fade-in/out product to 1e-9.

## WARN
The contact sheet shows the chart small at 960 wide: lane labels are 10 px mono and the fast variant is mostly hold
at the 14 s axis. No polish round was spent on either.
