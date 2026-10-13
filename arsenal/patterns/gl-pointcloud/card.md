# gl-pointcloud · a 3D scatter with depth cues, a brush that arrives on t, and pins

**What it is for.** Selection and correlated risk: thousands of rows as one point cloud in a data cube. Depth reads through
perspective plus an extra size-by-depth cue and fog toward the pack bg. A brushed subset (box, group or flag) lights up on t,
nearest the brush centre first, while the rest dims, so the caption can say "1,219 of 6,000" and mean it. Named rows carry
pins projected with `worldToScreen` and drawn flat in the pack's faces. An optional depth-of-field post runs in its own
framebuffer, off by default. Pure of t, seeded in setup, no fetch.

**When NOT to use.** 2D scatters (a third axis only earns its place when the depth relation is the point); counts under ~200
(use data-marks); labels that must respect occlusion (pins ignore it); exec level (DoF and fog are looks: keep `dof: null`, `fog <= 0.3`).

## Data and API
- `data`: `[{x, y, z, group, label?, size?, brushed?}]` (group number or string; first 4 distinct map to `groupRoles`; `size` 0-1).
  Empty → seeded synthetic `gen: {kind: 'clusters'|'roll', n, groups, names: [{rank|i, label}]}`.
- `count(t, st, params)` → `{shown, brushed, total, inBrush}`; `draw` returns the same plus `pins: [{label, x, y, op}]`
  (sheet px), so a kit2 film can set pins with `K.tx` and turn `readout`/`pins` off.
- How it draws: ONE `p5.Geometry` (4 corners per point, 2 tris; 20k → 80k verts, Uint32 indices chosen by p5), ONE `model()`
  under a custom billboard shader. Per-point data rides in stock attributes (aNormal = corner.xy, group + size fraction;
  aTexCoord = brush rank, reveal order). No 2.4 `instances()`, no raw GL / ANGLE_instanced_arrays.

## Params (defaults; ranges) · knobs a film would expose as knobs_doc rows marked ★
- `dur` 12 s; `size` 380 (cube edge, world units); `domain` [[0,1]x3] or null (fit with 4% pad)
- `r` 3.2 (point radius, 1-6; 1.9 at 20k) ★`pointR`; `sizeCue` 0.6 (0-1.2, extra size by view depth) ★`sizeCue`
- `fog` 0 (0-1) ★`fog`; `fogStart` 0.2 (0-0.8, fraction of the cube depth where fog begins)
- `reveal` [0.02, 0.22] (fractions of dur; null = all shown) ★`revealAt`; `revealBy` 'random' (seeded) | 'index'
- `brush` null | `{box: [[x0,x1],[y0,y1],[z0,z1]]}` | `{group}` | `{field}`; `brushAt` [0.35, 0.7] ★`brushAt`;
  `dim` 0.55 (0-1, others toward bg) ★`dim`; `grow` 0.5 (0-1); `ramp` 0.08 (fraction of the subset that fades in at once)
- `pins` true; `pinsAt` 0.74 ★`pinsAt`; `pinField` 'z' or ['x','y','z']; `pinDigits` 2
- `cam` `{yaw: [a0, a1] rad, pitch: [p0, p1], dist: [d0, d1], fov 0.72, follow 0-1}` (follow moves the look-at to the brush
  centre and the dolly on the brush clock) ★`camSwing` (= yaw span), ★`dolly` (= d1)
- `groupRoles` ['muted','accent2','ink','chalk']; `hiRole` 'accent'; `pinRole` 'accent' (roles, never hex)
- `dof` null | `{focus: 'brush'|'pin'|'centre', range 0.3-2 (x size), maxR 2-14 px, density 1-2}` ★`dofMaxR` (0 = off)
- `frame` true; `axes` ['X','Y','Z'] | null; `readout` true; `title`, `brushCaption` strings

## Variants (seed 7)
1. `two-groups-2k`: 2,000 points, diffuse group vs a tight correlated group along x=y=z; count-in, slow orbit. Cheap.
2. `fog-20k`: 20,000 points on a noisy roll in four bands, fog 0.85 and sizeCue 0.9: the far wall fades into bg.
3. `brushed-pins`: 6,000 points, three groups; box brush arrives 4.2-8.4 s (1,219 inside), camera follows and dollies;
   three pins on the highest x+y+z rows with their x, y, z.
4. `brushed-dof`: variant 3 with the DoF post focused on the brush centre; one pin.

## Atlas
[[webgl-mode]] S58 S61 (DoF not built in; framebuffer focal blur); [[build-geometry]] S262 S256; [[gpu-instancing]] S275 S10
(instances() unreleased on 2.3.4) S49; [[p5-shader]]; [[p5-framebuffer]] S53 S257 S61 (depth texture, y flip);
[[world-to-screen]] S4 S335; [[filter-shaders]] S256 (whole-canvas caveat: DoF uses a plane, not filter()); [[frontier-2026]] S275.

## Cost (s/frame, 960x540 x2, SwiftShader, seek + 1x1 readPixels sync)
| variant | shoot.mjs `?only=` (4 frames incl. first upload) | steady median (7 seeks) |
|---|---|---|
| two-groups-2k | 0.16-0.25 | 0.07 |
| fog-20k | 0.30-0.61 | 0.22 |
| brushed-pins | 0.23-0.37 | 0.16 (0.04 with readout/pins/frame off) |
| brushed-dof | 1.15-1.45 | 0.40-0.93 |
DoF adds 0.3-0.8 s (12 colour + 13 depth taps/px plus the framebuffer pass); `density: 1` was not cheaper here (0.74-0.93 vs
0.40-0.74), so default 2. WEBGL `text()` costs about 0.1 s/frame on software GL: in a film draw pins as SVG.
Numbers vary ±40% run to run on this shared host.

## Pitfalls and WARNs
- Draw the cloud with `fill()` set: after `noFill()` (the frame box) `model()` silently draws nothing.
- Points are hard-edged discs (discard, opaque, depth-tested): no sorting, no alpha. Soft edges would need sorting.
- Framebuffer texture sampled on a `plane()` is NOT flipped (vUv = aTexCoord); a 1-y flip renders the scene upside down.
- Fog and DoF linearise depth with the same near/far the camera uses (near = dist - 2.2·R); change one, change both.
- WARN pins: no occlusion and no plate behind the label; the leader and text can cross the cube frame (brushed-pins t=12).
  The y-sweep stacks labels per side 50 px apart; more than ~5 pins on one side runs off the canvas.
- Fonts: the pack's disp/mono from arsenal/fonts/fonts.js; a family not there (DM Sans, Fraunces) falls back to Big Shoulders
  Display 600 / IBM Plex Mono 400 (`stats().fallback`). Count is in disp at 64 px, captions in mono 12 px.
- p5's hidden 1x1 WEBGL text canvas is parked in `#junk` (as webgl-scene) so shoot.mjs reads the film canvas.

## Renderer / fallback
`webgl` only. If `createFramebuffer` or the depth texture fails, set `dof: null` (plain path). If `instances()` lands in 2.4,
the billboard shader can move to it; the attribute packing is the 2.3.4 emulation.
