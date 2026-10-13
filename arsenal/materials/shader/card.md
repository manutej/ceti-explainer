# shader-materials (ARSENAL.materials.shader)

**Renderer:** webgl (WEBGL main canvas, 960x540, pixelDensity 2). **Atlas:** [[filter-shaders]] [[filter]] [[p5-shader]] [[webgl-mode]] [[shader-hooks]] [[p5-strands]] [[p5-grain]] [[p5-riso]].

## What it is for
Material and post looks as one full-frame filter over a 2D scene, so the same film.js can be neon, printed, risographed or chalked by swapping a variant and a brand pack. The scene is drawn once into a P2D layer as channel-coded coverage (R = primary ink: headline, main line; G = secondary marks; B = fine rules and mono caption). Each look is a GLSL fragment string run through `createFilterShader` and maps the channels to TOKEN ROLES passed as uniforms (uBg, uInk, uAccent, uAccent2, uMuted, uPanel, uChalk, uDark). No hex lives in a shader.

## When NOT to use
Many layers needing different looks (a filter always covers the whole canvas [[filter-shaders]]; isolate layers first). Text that must stay crisp and legible at small size (halftone, chalk, neon all degrade it). Light brands for neon (it falls back to a darkening glow, a weaker look).

## Params (variant overrides; defaults in pattern.js)
- look: neon | halftone | riso | chalk. fallback: true forces the Canvas2D path.
- neon: radius 6..40 px (glow reach), gain 0..2, core 0..1 (white-hot centre), thresh 0..0.2.
- halftone: cell 4..14 px, angle 0..1.57 rad (second screen at +30 deg), soft 0.3..2, overprint 0..1.
- riso: reg 0..8 px (plate misregistration, opposite directions), grain 0..1, grainPx 1..3, paper 0..0.2.
- chalk: erode 0..1.5 (stick grain), dust 0..1.5, wobble 0..5 px.

## Variants
neon (additive spiral bloom, tight + wide, tinted per role; hot core). halftone (two rotated dot screens: ink and accent). riso (paper = chalk role, two multiply plates accent2 and accent, misregistered, thresholded grain that boils at 12 fps as a pure function of t). chalk (board = bg, wobbled eroded strokes, smudge haze, dust specks).

## Shaders used
Hand-written GLSL ES 1.00 via `createFilterShader` ([[p5-shader]], [[filter-shaders]]). p5.strands (`buildFilterShader`) was NOT used: it is beta and its hook names have moved between 2.1, 2.2.1 and 2.3.1 [[p5-strands]]; raw GLSL is the stable base. Loops have constant bounds [[p5-shader]].

## Cost (SwiftShader software GL, 1920x1080 backing store)
See table below; real GPUs are 2 to 3 orders of magnitude cheaper. Taps per pixel: neon 28 (+scene), halftone 8, riso 2 + hash, chalk 5 + noise. Scene redraw in P2D is about 5 ms. Harness `ms_per_frame` (seek only, GPU work queued) was 22 ms.

| look | s/frame, scene + filter + GPU sync (SwiftShader, incl. readback) | taps/px |
|---|---|---|
| neon | 2.48 | 28 |
| halftone | 1.87 | 8 |
| riso | 1.87 | 2 |
| chalk | 2.17 | 5 |
| 2D fallback (any look) | 0.9 | n/a |

The floor (about 1.8 s) is the software rasteriser's texture upload and readback of the 1920x1080 layer, not the shader; looks differ by 0.1 to 0.6 s. A strands `buildFilterShader` probe in headless was inconclusive (my hook body referenced `canvasContent` outside the hook argument and threw), so it was not pursued.

## Pitfalls
- Canvas is WEBGL, so p5 `text()` needs a loaded font; this module draws text in the P2D layer with CSS-loaded faces, so the page must load the brand fonts before seek (demo awaits document.fonts).
- Filter shader uniforms must be set before each `filter()` (done in draw).
- uRes is the logical 960x540, not the device size; blur radii are in logical px.
- Grain is hash of pixel and floor(t*12), never Math.random.
- Riso and halftone assume the bg/chalk roles contrast with ink/accent; check with the brand's contrast pass.

## Fallback
If `createFilterShader` throws, `setup` returns `sh = null` and draw uses a Canvas2D approximation (scene in token colours; neon = shadowBlur redraw, riso = offset multiply; halftone and chalk degrade to the plain scene). Force it with `params.fallback = true` or `?fallback=1` in the demo.
