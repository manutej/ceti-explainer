# Wave GL · WebGL data-visualisation lanes · 2026-10-10

One brief for every lane in this wave. Read first: arsenal/BRIEF.md (the module contract, demos, fonts, verification,
card), arsenal/patterns/webgl-scene/{card.md,pattern.js} (the proven WEBGL baseline on the pure clock: keyed cameras,
buildGeometry, worldToScreen pins, textToModel, the custom Lambert shader that keeps software GL at ~0.4 s/frame),
arsenal/materials/shader/card.md (post pass), factory/kit2/README.md "Renderer webgl" (how a film hosts you: K.world,
K.flat, fonts3d, framebuffers, filter cost), and the atlas pages your lane cites (references/atlas/pages/<slug>.md;
start from frontier-2026, capability-map, webgl-mode, p5-strands, build-geometry, gpu-instancing, framebuffer,
filter-shader, world-to-screen, camera-slerp; index at references/atlas/pages/index.md). Cite pages as [[slug]] with
their S-ids in your card.

## Why this wave
The factory makes exec-room films whose evidence is a COUNT drawn at true scale, then a second view that reverses a
belief. Its WebGL capability today is one module (webgl-scene: 1,000 baked boxes) and one post (neon). The frontier
the films need: tens of thousands of marks as one draw, data as terrain and ribbons, 3D scatter with depth, a camera
rig that is a first-class, knob-driven instrument, and a composable post stack, all pure of t and brand-faithful.

## Constraints (laws; CLAUDE.md)
Vendored p5 2.3.4 only (no 2.4 `instances()`: emulate instancing with a custom shader and per-instance attributes,
or raw GL on `p._renderer.GL` with ANGLE_instanced_arrays, and say which in the card); render pure of t; seeds in
setup; no fetch; roles never hex (tokens.color.*); software GL budget: ≤ 1.5 s/frame at 960×540 ×2 for the heaviest
variant, measured; every variant re-seeks identical (shoot.mjs purity). Labels are pinned through worldToScreen and
drawn flat with the pack's faces; results never in the smallest face. Count before ratio where a count exists.

## Deliverables per lane (nothing outside your folder)
arsenal/patterns/<id>/{pattern.js, demo.html, card.md, shots/contact.png, shots/report.json} (+ swiss-grid shots);
≥ 3 variants showing the range; params documented with ranges and which ones a film would expose as knobs (name
them as the kit's knobs_doc rows); `data` param: every module takes its data as a plain array or matrix so a film
feeds claims into it; a `count(t)` or equivalent that reports how many marks are shown so a film can caption it;
cost table (s/frame per variant, headless); pitfalls; fallbacks. Demo loads ../../brands/packs.js and honours
?brand=<id>. Hand back ≤ 150 words: path, variants, s/frame, what failed. No git.

## Lanes
| id | job | the frontier it opens |
|---|---|---|
| gl-instances | 10k–100k marks (boxes, dots, bars) as one or few draws; per-mark colour/size/alpha from data; count-in by t | the population at true scale |
| gl-heightfield | a matrix as a lit terrain mesh with contour lines and a travelling section cut; data → height; shading in strands or GLSL | heatmaps that read in 3D |
| gl-ribbons | flows as 3D ribbons/tubes along splines between nodes, width = quantity, animated travel; a sankey in depth | queues, cost of delay, funnels |
| gl-pointcloud | 3D scatter with depth cue (size, fog, depth-of-field post), brushed subset highlight, pins on named points | selection, correlated risk |
| gl-stack-city | stacked bars / treemap as a city with slice-by-category morph (pooled → split), LOD, the simpsons move generalised | reversals (same marks, new partition) |
| gl-camera-rig | keyframed camera instrument: orbit, dolly, crane, focus-pull (with gl-post DoF), look-at a data point, eased on t, serialisable to knobs | the move is the argument |
| gl-post | a composable post stack: bloom, depth-of-field, vignette, grain, chromatic, each a filter shader with gain knobs; cost table; exec-level off | the reveal as a moment |
| gl-volume | a distribution as a 3D histogram cloud / slabs with transparency sorting; counts in cells; a cut plane that travels | distributions and tails |

Every lane records the ms/frame of the heaviest variant and keeps a cheap variant under 0.3 s/frame.
