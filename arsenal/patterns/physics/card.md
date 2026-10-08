# physics: simulated motion that still scrubs

**For.** Motion that is truly simulated (springs, falling marks, steering agents) yet seeks like a pure
function of t. A fixed-step simulator (dt = 1/120) runs once in `setup` and stores a keyframe every 0.5 s
(60 steps). `draw(t)` copies the nearest keyframe, advances at most 60 more steps (hard cap `maxSteps`, 240),
then lerps one extra step. Seek cost is O(1) plus a partial resim, and re-seeking gives identical pixels.
The factory's counts can use the pour: marks fall and settle, and the number rises on first contact.

**Not for.** Rigid-body collisions of arbitrary shapes (use a baked Matter.js run, [[matter-js]]); anything
that must react to live input (state is baked from the seed); durations over ~60 s (keyframe memory and
setup time grow linearly).

## Params
| param | default | range / note |
|---|---|---|
| scene | settle | settle, pour, flock, steer |
| dur | 8 | seconds simulated in setup, 1..60 |
| maxSteps | 240 | per-frame resim cap, >= 60 |
| seed | 7 | any int (ctx.seed wins); all draws through mulberry32 |
| cols, rows, zeta, omega | 8, 5, [.3,.5], [6.5,9] | settle: grid, damping ratio (<1), rad/s |
| n, cols, rate, restitution, spread | 150, 10, .035, .35, 1.9 | pour: marks, bins, s between drops, 0..0.8, column spread 0.5..3 |
| n, maxSpeed, maxForce, arriveR | 60, 150, 260, 110 | flock/steer: px/s, px/s^2, px |
| wSep, wAli, wCoh, wSeek | 1.6, .8, .6, 1 | flock rule weights |

## Variants
- **settle**: 40 labels start scattered and spring into an 8x5 grid, each with its own w, zeta and release time.
  The simulated motion is checked live against the closed form x(t) = x* + e^(-zeta w t)(A cos wd t + zeta w/wd A sin wd t);
  an inset plots both for one label with the max error printed (2.4 px on 800 px travel, 0.3%).
- **pour**: 150 marks drop from a hopper into 10 bins (seeded bell shape), bounce (restitution .35) and rest;
  per-bin and total counts rise on first contact.
- **flock**: 60 agents with separation, alignment, cohesion plus seek that becomes arrive inside a radius;
  target glides along waypoints then holds; counter shows agents inside the arrive radius.
- **steer**: one agent seeks (overshoots and orbits), one arrives (settles), same hopping target. Trails come
  from calling the sim at t - k*0.045, which stays pure.

## Atlas
[[euler-integration]] (S82, S86: semi-implicit Euler, acceleration reset), [[fixed-timestep]] (S86, S138: constant dt
for determinism), [[oscillation]] (S85: Hooke spring, closed form), [[steering-behaviors]] (S84: desired minus
velocity, limit), [[real-time-vs-frame-based]] (S127, S139: injected t, no deltaTime), [[nature-of-code]] (S82),
[[matter-js]] (S396: bake physics into arrays read by t; this module is that bake, built in).

## Pitfalls
- Integrate with the step index, never wall time; compare release times as integers (a float `i*DT >= d` test
  silently skips a step and cost 18 px of error).
- Closed form needs v0 = 0 and constant w; once anything couples (flock, pour stacks), only the sim exists.
- Euler is not the closed form: settle uses 8 substeps per step to hold 0.3%; at 1 substep it was 2.5%.
- Pour reserves a slot on first contact; two marks landing in one frame in one bin can overlap while bouncing.
- Keyframes hold the whole state; n ~ 1e4 agents x 60 s is too much memory, shorten `dur` or the key rate.
- Fonts come from the brand pack's families; the demo vendors them, a host page must load them.

## Cost
~0.001 s (settle, pour, steer) to ~0.007 s (flock) of sim per frame at 960x540 x2; shoot.mjs reports
~22 ms per frame including canvas readback. Setup: ~0.1 s (flock 960 steps x 60 agents). Renderer: p2d.

## Fallback
No beta APIs; Canvas2D `roundRect` is used (evergreen). If absent, swap for `rect`.
