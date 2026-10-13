# webgl-scene · a 3D explainer scene on the pure clock

**What it is for.** A WEBGL scene where one count (1,000 boxes) is shown as a structure, a journey and a headline.
Keyed `p5.Camera`s are slerped on t (same projection, ortho or perspective), 1,000 boxes are baked with
`buildGeometry` (20 tiers of 50, ranked by value) and lit up by t, with an exact counter. Labels are pinned to 3D
points with `worldToScreen`, then drawn after `resetMatrix()` and a released camera so they stay flat and legible.
A headline number is extruded with `textToModel`. Pure of t; seed in setup (mulberry32); no fetch.

**When NOT to use.** Flat diagrams (use p2d); anything that must run in under ~0.1 s/frame on software GL; more than a few
hundred draws that cannot be baked; labels that must be occlusion-aware (pins ignore occlusion).

## Params (defaults; ranges)
- `mode` iso | fly | headline; `proj` ortho | persp (ortho keys use `zoom`, perspective keys `fov`)
- `dur` 12 s (all variants share it); `cols` x `rows` 40 x 25 (= 1,000; `tier` must divide it); `cell` 10-24; `gap` 1-5
- `street` 0-60 (cross streets); `hmin` 4-20, `hmax` 40-160 (box height from value)
- `sweep` [0.10, 0.84] fractions of dur over which the highlight runs 0 to 1,000
- `headline` string; `extrude` 10-60; `sampleFactor` 0.1-0.5; `headW` px; `headY`; `forceOutline` bool; `p5lights` bool
- ctx: `{seed, fonts}`; `fonts = await ARSENAL.patterns['webgl-scene'].load(p)` (vendored Barlow Semi Condensed 600 + IBM Plex Mono 400, data URIs in font.js)

## Variants
1. `iso-sorted`: orthographic, slerp between two keyed cameras, highest-value boxes light first; pin on the frontier box.
2. `iso-perspective`: same path in perspective (shows the projection difference); same label machinery.
3. `fly-through`: perspective, 5 keyed cameras (overview, dive into the street, along it, rise); pins on the top-3 and the median box, fading by depth.
4. `headline-extrude`: `textToModel("1,000")` turning 360 deg under real p5 lights (ambient, directional, point from roles); field lights up below.
5. `headline-outline`: the fallback (`forceOutline`): textToContours loops stacked in z with spars.

## Atlas
[[webgl-mode]] S13 S58 S349; [[p5-camera]] S54; [[camera-slerp]] S54 S335; [[text-to-model]] S268 S4; [[lights-and-materials]] S357;
[[shape-3d-primitives]] S256 S357; [[build-geometry]] S262 S256; [[world-to-screen]] S4 S335.

## Pitfalls and WARNs
- `textToModel` WORKS on 2.3.4 headless (1,600 vertices for "1,000"); no texture coords, so no `texture()`. Fallback kept and rendered.
- `loadFont` cannot fetch `file://`: fonts are base64 data URIs. woff2 is rejected ("only TTF, OTF and WOFF"), so the token display face
  (Big Shoulders, woff2) is replaced by Barlow Semi Condensed 600 woff. Text in WEBGL needs the loaded font; token families are not used.
- p5's lit shader is 10-50x slower per fragment on software GL (5-30 s/frame at 1920x1080 for the field). The field therefore uses one
  custom Lambert shader fed from roles (ambient muted/bg, key chalk, rim accent2); real p5 lights are used only on the headline.
- `buildGeometry` bakes per-tier geometry; colour is set per `model()` via a uniform, so bake without fill.
- `text()` wraps at spaces in WEBGL unless given a maxWidth: pass one (2000). The "->" glyph is missing in the mono face.
- p5 2.x WEBGL text inserts a hidden 1x1 canvas ahead of the real one; the demo parks it so `querySelector('canvas')` and shoot.mjs work.
  (shoot.mjs would be safer with `canvas.p5Canvas`.)
- `instances()` is unreleased (undefined on 2.3.4); not used: 1,000 baked boxes cost 20 `model()` calls.
- WARN fly-through: mid-flight (t ~ 8 s) the camera brushes a building wall on the street; retime or widen `street` before use.
- Slerp only moves position and orientation; projection (zoom/fov) is re-applied by hand after each slerp.
- `p.redraw()` is async in 2.x; the demo calls draw directly after `resetMatrix()`.

## Cost
Seconds per frame at 960x540 x2 density, SwiftShader (software GL), synced with readPixels: about 0.5-0.7 s (0.2 s at t=12 fly).
With p5 lights on the field: 5-30 s. Real GPU not measured. shoot.mjs `ms_per_frame` (~41 ms) under-reports: it does not wait for the GPU.

## Renderer / fallback
`webgl`. `textToModel` fails: flat `textToContours` outlines in 3D (built-in). `instances()` absent: baked tiers.
