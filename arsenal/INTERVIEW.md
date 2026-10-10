# Operadic self-interview · the factory against the atlas · 2026-10-08

Each question asks what composes with what, what varies independently, and where the current
system collapses a variable it should expose. Answers cite the atlas (references/atlas/pages/<slug>.md).

**Q1. What is the factory's unit of composition today?** A film = kit (one chrome, one palette, one
material baked into kit.js) + film.js (render) + claims. Only the render varies. The chrome modules in
factory/chromes are not loaded by the kit; the fifteen films share one look. This is the lock-in the
15-film run exposed: the Opera House style became the only style.

**Q2. What should vary independently?** Seven axes, each a plugin with a contract: BRAND (token pack:
colour roles, type roles, texture, tempo, voice), CHROME (page furniture: sheet, ledger, memo, none),
MATERIAL (how a mark is drawn: ink, pencil, stitch, chalk, halftone, neon, risograph), STRUCTURE (what a
count is made of: wall, grid, ring, columns, rows, timeline, graph), MOTION (reveal grammar: arc-length,
morph, stagger, camera), FORMAT (75-second case, 40-second episode, feature, explorable widget), RENDERER
(SVG+Canvas2D, WEBGL, WebGPU opt-in). A film declares one of each; the gate is axis-independent.

**Q3. Which atlas patterns does the factory not use?** Of the blueprint's 15 patterns we use P1 (clock),
P6 (captions as data), P12 (seeded randomness), P13 (frame-stepped export). Unused: P2/P3 track tween
and timeline builder (films hand-time with seg()/ease() scattered through film.js), P5 scene-local time,
P8 arc-length reveal, P9 morph and kinetic typography (textToContours, textWeight), P10 camera
choreography and log-zoom, P11 derived geometry as a discipline. Beyond the blueprint: layered
compositing and framebuffers, cutout reveal (erase), flow fields and noise loops, probabilistic palettes
and OKLCH ramps, strands and filter shaders, GPU instancing, fixed-timestep physics, WEBGL cameras,
generator scenes, slider-driven explorables.

**Q4. Where is the factory already consistent with the atlas?** Pure function of t with an owned clock
(pure-function-of-t, explainer-clock); randomSeed/noiseSeed fixed and mulberry32 for shuffles
(seeded-determinism); noLoop + redraw stepping for export (frame-stepped-export); captions and chapters
as data (beats-and-captions); p5 pinned at 2.3.4 by hash (cdn-version-pinning); fonts vendored as WOFF2
(load-font, p5-woff2); resolution-independent 960-unit basis (resolution-independence); describe() not
yet set on every canvas (describe) — a gap to close.

**Q5. What does "faithful under a brand switch" require?** Token roles rather than hex values in every
module; a contrast check (color-contrast, WCAG) per brand pack; type roles mapped to vendored faces with
the weights the pack declares (text-weight); texture and tempo as tokens; a snapshot of the same film under
every brand so the seats judge the brand, not the film; gate rows that never read a colour.

**Q6. What is the cheapest proof that the axes are real?** Rebuild two existing films under three brands
and three chromes with zero edits to film.js. If any film.js line must change, the axis is not yet a
plugin.

**Q7. What must not change?** The laws: one clock, counts first, commit before any number, every digit a
claim, silent with captions, honest line, brand card last. Variety is in the look and the motion, never in
the truth.

**Q8. What is the frontier worth one experiment each?** p5.strands materials (beta, churning), WEBGL
text extrusion (textToModel), instances() for mass elements (main, unreleased: fallback required),
WebGPU compute (experimental: opt-in only). Each ships as a pattern with a fallback and a cost measured in
seconds per frame.
