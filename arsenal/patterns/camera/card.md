# camera · keyed 2D camera choreography

**For.** Moving a viewpoint over a fixed 2D world on Canvas2D: zoom-ins on parts of a diagram, a constant-speed pan,
a zoom into one of many cells. The camera is three tracks `cam.x`, `cam.y`, `cam.zoom` (plus a focus rect and
focus alpha) keyed on the same timeline as everything else; scene objects are never mutated [[camera-choreography]].
Zoom tweens in log space (`exp(lerp(log z0, log z1, u))`) so deep zooms do not accelerate [[easing-functions]].
A **move** tweens between keys; a **cut** (`cut:true`, or `mode:'cut'`) holds key i until key j.t, then jumps.
Ken-burns is a slow drift added on top of the sampled camera, a function of t only [[derived-geometry]].
Legibility rule: all text is drawn in screen space after `resetMatrix()`, at a constant pixel size >= `labelMin`,
anchored with `worldToScreen(x,y)` [[world-to-screen]]; strokes and dots use `px/zoom` so they stay screen-constant.

**Not for.** WEBGL scenes (use `p5.Camera.slerp`, [[camera-slerp]]; this module is 2D only); parallax with
depth; worlds that need text to scale with the artwork (maps with street names); camera paths along curves.

## Params
| param | default | range / values |
|---|---|---|
| scene | 'map' | 'map' \| 'timeline' \| 'grid' |
| mode | 'move' | 'move' \| 'cut' (every move becomes a cut at mid-window) |
| dur | 12 | seconds, >0; scripts are authored on 12 s and keyed to `dur` at the end |
| kenburns | 1 | 0..2, drift strength (0 = none) |
| focus | true | dim everything outside the keyed focus rect |
| ease | '' | '' = tokens.tempo.ease; linear, quad, cubic, sine, expo |
| labelMin | 11 | px, floor for any pinned text |

API on `ARSENAL.patterns.camera.api`: `sample(keys,t,ease)`, `worldToScreen(x,y,cam,W,H)`,
`screenToWorld(...)`, `toCuts(keys)`; after a draw, `state.worldToScreen(x,y)` and `state.cam` are the live values.

## Variants
- **map**: 1920x1080 world, three clusters; zoom into each (x1.5, focus mask on the cluster ring), then pull back; ken-burns on holds.
- **map-cuts**: same script and keys, `mode:'cut'`: the three zoom-ins and the pull-back become hard cuts.
- **timeline**: 5400 px timeline, linear ease, constant 370 px/s; event labels and decade years pinned and clamped to the screen edge with a leader; year readout pinned.
- **grid**: 100 cells; focus fades in, zoom to x4.6 on one cell, drift while holding, hard cut back to the full grid.

## Atlas
[[camera-choreography]] S54 S302 S335; [[camera-slerp]] S54 S335 (WEBGL cousin, not used); [[world-to-screen]] S4 S357
(the atlas page is the 3D p5 2.x function; here the 2D equivalent is written out); [[easing-functions]] S80 S81 S335;
[[derived-geometry]] S314 (labels, focus box and zoom readout derived each frame, never stored).

## Pitfalls
- Apply the camera before the scene, `resetMatrix()` before text; never `text()` inside the world transform.
- Lerp zoom linearly and a deep zoom visibly accelerates; keep it in log space. x/y lerp linearly with the same u.
- A focus rect keyed in world units rides the camera; key it at the same times as the move or it will slide.
- Ken-burns uses absolute t, so a cut inside a drifting scene keeps the offset; the grid scopes it with a `t0..t1` window.
- Per-cell text is culled by projected box and by size (< 40 px cells get no label): culling keeps 100 cells cheap.
- Brand-switch: label colours come from roles; light packs dim with their own bg, so check contrast per pack.

## Cost
~10-13 ms/frame at 960x540 x2 density (shoot harness, 4 variants x 4 frames, headless Chromium). Renderer p2d.

## Fallback / status
No beta APIs. Uses `ctx.roundRect` (Chromium 99+, Safari 16+, Firefox 112+). WARN: the map title can touch a node
label when a cluster fills the frame (seen at x1.5 on SERVE); labels are not collision-avoided.
