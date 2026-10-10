# gl-camera-rig · a keyframed camera instrument for p5 WEBGL

**For.** Making the camera move the argument: a rig is a *script* (a start pose and timed moves) that compiles to keys
`{t, eye, center, up, fov | ortho zoom, focus, aperture}` and is read back as a pose by `rig.at(rig, t)`, pure of t.
Moves: **orbit** (spherical round the centre, any angle, elevation and radius eased), **dolly** (along the view axis,
distance geometric; `vertigo` = dolly zoom, fov holds the subject's width), **crane** (eye and aim on straight lines,
`follow` how much the aim rises), **lookat** (aim at a data point by index or `'max'|'min'|'median'`; `dist` pushes in,
0 pans from the eye), **focus** (focus-pull to a data point's depth or a distance), **key** and **cut** (raw poses).
Every move eases with the curves of arsenal/core/timeline.js [[easing-functions]]. Key-to-key moves use
`p5.Camera.slerp`'s own rule (pivot point on the eye-centre line, rotation slerp, geometric distance), written out in
plain maths so poses exist without p5 [[camera-slerp]] [[p5-camera]]. `toKnobs()` / `fromKnobs()` turn a script into
kit2 `knobs` + `knobs_doc` rows and back, so an evaluator retunes a move with no code. `rig.worldToScreen(pose, pt, W, H)`
pins labels for the same camera [[world-to-screen]]. Demo: 300 baked boxes; each move a variant; the path drawn flat.

**Not for.** Free exploration (`orbitControl` is live input, not film) [[p5-camera]]; 2D canvases (use `camera`, the
p2d lane [[camera-choreography]]); a real depth-of-field blur (that is gl-post's; this lane hands it `rig.dof(pose, rig)`
and draws a cheap focus cue); paths along splines through many waypoints (chain `key` moves, or add a spline scheme).

## API (`ARSENAL.patterns['gl-camera-rig'].rig`)
`compile(script, scene)` (scene = `{points: [[x,y,z]], order}` for data targets) · `at(rig, t)` -> pose (+ `move, id, u, s`)
· `apply(p, cam, pose, rig)` (camera + perspective/ortho on a `p5.Camera`) · `worldToScreen(pose, pt, W, H)` -> `{x, y, depth, on}`
· `pxPerUnit(pose, depth, H)` · `dof(pose, rig)` -> `{focus, aperture, near, far, focusDepth01}` · `sample(rig, n)` ·
`toKnobs(script, scene, {prefix})` -> `{knobs, knobs_doc}` · `fromKnobs(script, knobs | K.knob, scene)` (clamped to rows).
A film: `const script = RIG.fromKnobs(BASE, K.knob, scene), rig = RIG.compile(script, scene)`; each frame
`RIG.apply(p, cam, RIG.at(rig, t), rig); p.setCamera(cam)`. Pattern `count(t, st)` = boxes whose top is in frame.

## Params
| param | default | range / values |
|---|---|---|
| rig | 'orbit' | a key of `.scripts` (orbit, dolly, dolly-zoom, crane, look-at, focus-pull, ortho-orbit, sequence) |
| script | null | a script object (overrides `rig`); `proj` persp \| ortho, `near` 10, `far` 9000, `start`, `moves` |
| knobs | null | `{name: value}` applied through `fromKnobs` (demo: `?knobs={json}`) |
| data | null | values array or matrix (rows); null = 300 seeded values; one box per datum |
| cols x rows, cell, gap | 20 x 15, 34, 6 | grid of the demo field; hmin 10, hmax 170 (height from value) |
| focusCue | 1 | 0..1, depth fade toward bg off the focus plane (× pose aperture) |
| overlay, ground, engine | true, 40, 'rig' | plan/strip/readout on or off; pad margin (0 = none); 'p5' slerps with p5.Camera |
Move fields: `id, move, t0, t1, ease` (linear smooth in out inout expo back step), `fov` (deg), `zoom`, `aperture`,
`focus` ('center' default: rack to the new centre, 'hold', number, or a target). Knob ranges: t0/t1 [0, dur]; az
[-720, 720] deg; el [-10, 89]; r [0.2, 5]; dist [0, 6000]; rise [-3000, 3000]; follow, aperture [0, 1]; target [0, N-1];
fov [5, 120]; zoom [0.1, 10]; eye/center xyz [-6000, 6000]. Names `cam<Id><Param>`; a film exposes t0/t1 + the shape knob.

## Variants
orbit (240 deg, rising to 46 deg, radius ×0.8) · dolly (push to 400, ease back to 860) · dolly-zoom (1,300 -> 330,
fov 18 -> 64 deg) · crane (street level up 980, aim follows 12 %) · look-at (push to the highest box, then pan to the
lowest) · focus-pull (rack front row -> back row -> middle, aperture 1) · ortho-orbit (orthographic swing 90 deg, then aim
and zoom ×2.2 on the highest box) · sequence (crane, orbit, look-at, focus pull: 26 knobs) · orbit-lite (the cheap
variant: no overlay, no pad, no focus cue).

## Verified (demo `__film.check()`, all variants, t every 0.25 s)
rig.worldToScreen vs p5 `worldToScreen` under the rig's camera: max 0.009 px. Rig slerp vs `p5.Camera.slerp` on the same
keys: max 0.0001 world units (eye and centre). toKnobs -> fromKnobs compiles to identical keys; retuning one knob moves
the path. shoot.mjs purity identical on every variant, ceti-dark and swiss-grid.

## Atlas
[[p5-camera]] S54 S357; [[camera-slerp]] S54 S335; [[camera-choreography]] S302 S335; [[easing-functions]] S80 S81;
[[world-to-screen]] S4 S357; [[build-geometry]] S262 S256; [[webgl-mode]] S54 S61 (no built-in DoF); [[frontier-2026]] S275.

## Pitfalls
- p5 slerp needs cameras of one projection and does not interpolate a perspective fov; the rig interpolates tan(fov/2),
  zoom and focus geometrically itself. Slerp is limited to < 180 deg per key; use `orbit` for wide sweeps.
- A slerp crane arcs round the centre; `crane` is a straight track on purpose. Up stays (0,1,0) (p5's y-down world).
  Camera moves rack focus to their new centre unless `focus:'hold'`; a focus target behind the eye clamps to 1.
- lookat with `dist` near the field can put the eye among the boxes (look-at hold frame); keep dist above hmax.
- Pins ignore occlusion (skipped under the plan inset). Text needs a TTF from arsenal/fonts/fonts.js (pack disp + mono, else Big Shoulders / Plex Mono).
- Full-screen fills are the cost on software GL: a 3,000-unit ground plane doubled s/frame; the demo uses a pad.
- No instancing (none needed): 300 boxes are 5 `buildGeometry` tiers = 5 `model()` calls + one per target.

## Cost (s/frame, 960x540 ×2, SwiftShader, seek incl. 1-px readPixels sync; machine shared with 7 lanes, load ~9 on 4 cores)
| variant | median | max of 9 | | variant | median | max of 9 |
|---|---|---|---|---|---|---|
| orbit | 0.53 | 1.18 | | focus-pull | 0.83 | 1.18 |
| dolly | 0.65 | 1.66 | | ortho-orbit | 0.93 | 1.54 |
| dolly-zoom | 0.89 | 1.52 | | sequence | 0.43 | 0.89 |
| crane | 0.37 | 0.53 | | orbit-lite | 0.32 | 0.37 |
| look-at | 0.44 | 0.66 | | shoot.mjs mean, both packs | 0.59-0.61 | |
At load ~9 (earlier run) orbit-lite was 0.21-0.25 and orbit 0.51. WARN: the heaviest frames (dolly close-up, dolly-zoom and ortho
zoom-in, boxes filling the screen) touch 1.5-1.7 s under this load; on an idle machine expect about half. Real GPU not measured. Overlay text ~0.2 s; focus cue free.

## Renderer / fallback
`webgl`. No beta APIs (no `instances()`, no strands). If ARSENAL.core.timeline is absent a verbatim copy of its eases is used.
