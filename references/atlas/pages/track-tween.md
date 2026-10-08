---
id: track-tween
title: "Track tween (alpha model)"
type: Pattern
aliases: ["Track = pure tween", "Animation (alpha interpolation)", "interpolate(alpha)"]
sources: [S317, S322, S323, S339]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Track tween (alpha model)

## Definition

A track tween is the pattern of modelling every animated number or colour as a pure, clamped function of t with a start, duration, endpoints and an easing, copying Manim's alpha model. [S323][S317]

## Details

- Manim's Animation calls interpolate(alpha) every frame with alpha from 0 to 1; run_time defaults to 1.0 s and rate_func to smooth. [S323]
- Remotion's interpolate maps a frame range to a value range with optional clamping, the same shape as a track. [S317]
- lerpColor clamps amt to 0 to 1 and interpolates in the active colorMode, so choose RGB or HSB deliberately before sampling. [S339]
- With several segments on one property, the latest-started track wins. [S323]
- Manim's lag_ratio staggers sub-animations without changing the total run time. [S323]

## In explainer work

Tracks are what the [[timeline-builder]] compiles to, and because each is pure in t, scrubbing backwards and exporting are free. [S323][S317] Easing choices live in [[easing-functions]]. [S323]

## Patterns

### Pattern: pure track
When to use: every animated property. [S323]
```js
const ease = { linear: u => u, smooth: u => u * u * (3 - 2 * u), out: u => 1 - (1 - u) ** 3 };
const track = (start, dur, from, to, fn = 'smooth') => ({ start, dur, from, to, fn });
function sample(tr, t) {
  const a = ease[tr.fn](constrain((t - tr.start) / tr.dur, 0, 1));
  return typeof tr.from === 'number' ? lerp(tr.from, tr.to, a) : lerpColor(tr.from, tr.to, a);
}
```
Pitfalls: clamp both ends or values extrapolate; set colorMode before sampling colours. [S339]

## Relations

- part_of [[explainer-engine-blueprint]] — pattern P2 of the engine [S323]
- uses [[lerp-color]] — colour tracks call lerpColor [S339]
- related_to [[easing-functions]] — rate_func equivalents [S323]
- related_to [[normalized-time]] — alpha is a normalised local time [S323]
- related_to [[timeline-builder]] — the authoring layer that emits tracks [S322]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S322] — Manim Community `Scene` reference (Manim Community, undated)
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
- [S339] — `lerpColor()` reference (p5.js, undated)
