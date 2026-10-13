# Anti-patterns — how humans and agents fail, and where p5 hits walls

**Lane:** how humans and (especially) AI agents fail at generative art and p5.js, and where p5 itself hits walls.
**Thesis under test:** "too common is a failure pattern" — clichés kill uniqueness.
**Date:** 2026-10-05. **For:** `ceti-p5-studio` plugin design.

The one-sentence version: the dominant failure is not "ugly" but **"indistinguishable"** — Kate Compton's 10,000 bowls of oatmeal, now produced at industrial scale by models that have been RLHF-sharpened toward the statistical median of every p5 sketch on GitHub. Everything below is organized to make that failure **detectable from code or pixels**, not just nameable.

---

**Rule-id crosswalk** (what `scripts/lint.py` and `scripts/metrics.py` emit for each entry):

| Entry | Detector ids |
|---|---|
| A1 | CLI-03-hsbrainbow, MET-rainbow |
| A2 | CLI-A2-voidlines, MET-voidlines |
| A3 | CLI-01-flowfield, MET-uniform-coverage, MET-texture-only |
| A4 | CLI-07-mandala, MET-centered |
| A5 | CRAFT-UNIFORM |
| A6 | MET-no-hierarchy |
| A7 | CLI-A7-defaultcanvas |
| A12 | CLI-02-fadetrails |
| A13 | CLI-A13-primaries |
| B1 | API-* |
| B4 | CON-SEED, CON-MATHRANDOM |
| B6 | CRAFT-MONOLITH |
| B7 | CRAFT-NARRATION |
| B8 | CLI-B8-flatui |
| B9 | MET-no-margin, MET-negative_space |
| B14 | CON-NOLOOP, CON-REDUCED |
| C1 | PERF-READBACK |
| C2 | PERF-READBACK |
| C3 | CON-DENSITY |
| C4 | PERF-PRIMITIVES |
| C5 | PERF-IMMEDIATE3D |
| C7 | PERF-GC |
| C10 | PERF-UNBOUNDED |

## 1. Taxonomy of failure modes
Format per entry: **Name** — symptom · why · **detect** · remedy. Detection signals are chosen so a plugin can check them with a regex over the sketch source (`src:`) or a cheap statistic over a rendered PNG (`img:`).

### Family A — Aesthetic / cliché ("the default generative look")

**A1. Rainbow hue cycle** — colour sweeps the full hue wheel over time or space; everything looks like a 2012 Processing demo. · Why: `colorMode(HSB)` + `frameCount % 360` is the shortest path to "colourful," and it saturates training data. · **detect** `src:` `colorMode\(HSB` within 40 lines of `(frameCount|i|x|y)\s*%\s*(360|255)` or `map\([^)]*,\s*0,\s*360\)` feeding `fill|stroke`; `img:` hue histogram (HSV, 36 bins) with >70% of bins occupied *and* near-uniform mass (entropy > 0.9·log 36). · Remedy: fix a 3–5 swatch palette up front (OKLCH-spaced, ≤2 hue families), map variation to lightness/chroma not hue; reserve hue for one accent.

**A2. Black-background, thin white/neon lines** — the "void with glowing threads" look. · Why: `background(0)` + `stroke(255)` is the zero-effort contrast choice and reads as "techy." · **detect** `src:` `background\(\s*0\s*\)` + `stroke(255|'#fff'|...)` + `strokeWeight\((0\.[0-9]+|1)\)` and no `fill`; `img:` ≥85% pixels with L<0.08 and remaining pixels at L>0.9 (bimodal luminance). · Remedy: choose a paper/ground tone (warm off-white, tinted dark), give lines weight variation (Gaussian, not uniform), add fills or masses so line is not the only vocabulary.

**A3. Perlin flow field with no composition** — thousands of noise-steered curves evenly covering the canvas, no focal point. · Why: it is "the Hello World of generative art" (González Vivo's "Hello World version" vs "mature"); every tutorial ends here. · **detect** `src:` `noise\(` used to produce an angle (`\*\s*TWO_PI|\*\s*TAU`) + per-particle `x += cos(`/`y += sin(` + loop count ≥ 500; `img:` local orientation coherence high (structure-tensor), spatial coverage of ink near-uniform across a 4×4 grid (coefficient of variation < 0.25). · Remedy: compose the field (masks, regions of silence, a density gradient from Hobbs' Fidenza playbook), vary line width/length by a non-uniform distribution, let the field be *one* layer among two or three.

**A4. Centered single object** — one shape/system at canvas centre, radial symmetry, nothing else. · Why: `translate(width/2, height/2)` is the first line most people (and models) write. · **detect** `src:` `translate\(\s*width\s*/\s*2\s*,\s*height\s*/\s*2\s*\)` with no other translate and no grid loop; `img:` ink centroid within 5% of canvas centre and radial profile monotone. · Remedy: rule-of-thirds or off-axis anchor, asymmetric balance (one large mass vs several small), deliberate negative space.

**A5. Uniform randomness everywhere** — sizes, positions, colours all `random(a, b)`; result is noisy but lifeless ("mechanical"). · Why: `random()` is the only RNG beginners (and models) reach for; see Hobbs and Generative Hut. · **detect** `src:` count of `random\(` vs `randomGaussian\(`/custom distributions; ratio > 10:1 with ≥5 distinct uses; `img:` size histogram of connected components flat (no long tail). · Remedy: Gaussian for "about the same," Pareto for sizes, clumped/Poisson-disc for positions, correlated (neighbour-averaged) jitter.

**A6. No hierarchy / everything equal weight** — hundreds of equally-sized, equally-coloured elements; nothing leads the eye. · Why: loops produce uniform elements; hierarchy is a design decision no loop makes by default. · **detect** `img:` connected-component area distribution: largest component < 3× median; luminance-contrast map has no region > 10% of canvas above 0.5 contrast. · Remedy: 1 dominant, 2–3 secondary, many tertiary (power-law sizing); one high-contrast moment.

**A7. Default 400×400 (or 600×400) canvas, unconsidered aspect** — square, tiny, pixelDensity default. · Why: it is the p5 editor template. · **detect** `src:` `createCanvas\(\s*(400|600)\s*,\s*400\s*\)` or `createCanvas\(windowWidth,\s*windowHeight\)` with no aspect logic. · Remedy: choose a format on purpose (poster 2:3, 1:1 at ≥1080, 16:9 for motion), set `pixelDensity()` deliberately, build the composition in normalized units.

**A8. frameRate-dependent motion** — speed written as `x += 2` per frame; looks fine at 60Hz, doubles on 120Hz, crawls when throttled. · Why: p5 hides time. · **detect** `src:` `draw\(` contains increments of state with numeric literals and no `deltaTime`/`millis()`. · Remedy: `x += v * deltaTime/1000`; or render-time-based `t = millis()/1000`; for recordings use fixed-step offline rendering. (Context in C8.)

**A9. Glow/blur/additive stacking as substitute for form** — `blendMode(ADD)` + alpha trails over black. · Why: cheap "wow." · **detect** `src:` `blendMode\(ADD\)` + `background\(0,\s*\d{1,2}\)` (low-alpha fade). · Remedy: earn luminosity with value structure; use blend modes on one layer, not the whole frame.

**A10. Noise-displaced circle/blob ("the wobbly ring")** — `beginShape` around a circle with `noise()` radius. · Why: first tutorial after flow fields. · **detect** `src:` `for.*angle.*TWO_PI` + `noise\(` modulating a radius + `vertex\(`. · Remedy: give it a job (mask, silhouette, repeated at power-law scales) or drop it.

**A11. Grid of identical cells with random rotation/colour** — Truchet/tile grids with no second idea. · **detect** `src:` nested `for` over `width/step`, `height/step` with `random`/`noise` inside and ≤1 drawing primitive. · Remedy: break the grid (merge cells, vary cell size by rule, introduce a second system that ignores the grid).

**A12. Trails via low-alpha background** — `background(0, 10)` ghosting; every particle system looks the same. · **detect** `src:` `background\(\s*[\d,\s]*,\s*([1-9]|[1-4]\d)\s*\)`. · Remedy: draw history explicitly (store points, vary width/alpha by age) or use a dedicated graphics layer.

**A13. Pure RGB primaries / default p5 colours** — `fill(255,0,0)`, `stroke(0,255,0)`, or the library default grey fill + black stroke never overridden. · **detect** `src:` any `fill|stroke\(\s*(255,\s*0,\s*0|0,\s*255,\s*0|0,\s*0,\s*255)`; absence of any `fill(`/`noStroke(` in a sketch that draws shapes. · Remedy: named palette, tinted neutrals, chroma ≤ 0.2 in OKLCH for 80% of the surface.

### Family B — Agent / LLM-specific

**B1. 1.x API hallucination in a 2.x world** — `preload()` silently never runs; `curveVertex`, `quadraticVertex`, `keyCode`, `mouseButton === RIGHT` misbehave. · Why: training corpus is overwhelmingly 1.x; 2.0 (2025) removed/renamed these ([release notes](https://github.com/processing/p5.js/releases/tag/v2.0.0), [v2 transition guide](https://p5js.org/tutorials/v2_transition/)). · **detect** `src:` `function preload\(` without the preload compat addon; `curveVertex\(|quadraticVertex\(|curvePoint\(|curveTangent\(`; `keyCode\b`; `mouseButton\s*===\s*(LEFT|RIGHT|CENTER)`; also the inverse: `splineVertex|bezierOrder|textToContours|async function setup` against a 1.x CDN tag. · Remedy: pin the version in the HTML, run a version-gated lint, prefer `async setup()` + `await loadX()`; for 1.x, forbid 2.x names. Load the three compat addons only as a conscious choice.

**B2. Mode collapse to ~5 techniques** — flow field, particle system with trails, noise blob, Truchet grid, circle packing — regardless of prompt. · Why: typicality bias from RLHF (Verbalized Sampling); population-level homogeneity (PNAS Nexus); Jen Lowe's "maybe ten different types of algorithm that people tend to be remixing." · **detect** across a batch: technique classifier (regex bundle from Section 2) — if > 60% of N≥5 generated sketches share the same top-2 fingerprints, collapse. · Remedy: *distribution-level prompting* ("propose 5 structurally different approaches with probabilities, then pick the least typical that still fits"); a technique-exclusion list per session; seed the brief with a concrete reference lineage (artist, medium, era) rather than "beautiful."

**B3. Unverifiable aesthetic claims** — "This creates a beautiful, mesmerizing effect" with nothing rendered. · Why: models "lack awareness of visual rendering quality despite functional correctness" (Code Aesthetics paper). · **detect** process: any adjective about the output with no screenshot artifact in the turn. · Remedy: mandatory headless render (Puppeteer/Playwright) of ≥3 seeds → image stats + vision-model critique before any prose; score, don't describe.

**B4. No seed control / non-reproducible** — no `randomSeed`/`noiseSeed`; "the good one" can't be recovered; curation impossible. · **detect** `src:` `random\(|noise\(` present but no `randomSeed\(|noiseSeed\(` and no hash-based PRNG. · Remedy: single `seed` constant (or URL param/hash), both seeds set, seed printed in the filename of every export.

**B5. Overcomplexity / feature stacking** — eight systems in one sketch, 400 lines, none resolved. · Why: models equate "more" with "stunning"; Hobbs: "simply jamming in new elements can make the entire collection less coherent." · **detect** `src:` ≥4 of the Section-2 fingerprints present simultaneously; draw() > 120 lines; > 6 global tunables with no grouping. · Remedy: one idea executed to the end; the "remove any component and it gets worse" test.

**B6. Giant monolithic `draw()`** — everything inline, no functions, state mutated ad hoc. · **detect** `src:` draw body length / number of top-level functions; cyclomatic complexity > 25. · Remedy: `setup → buildScene(seed)` producing data; `draw` only renders; pure helpers.

**B7. Over-commenting / narration in code** — a comment on every line ("// set the fill color"); README-style preamble inside the sketch. · **detect** `src:` comment-line ratio > 0.4; comments that restate the next token. · Remedy: comments only for *why*; keep the artistic intent in a header block of ≤6 lines.

**B8. Palette from training-set defaults** — `#FF6B6B/#4ECDC4/#45B7D1` "flat UI" set, indigo→purple, or neon cyan/magenta on black. · Why: the Tailwind-indigo feedback loop described for UIs applies to sketches. · **detect** `src:` match against a blocklist of the ~40 most common hex strings in public p5 sketches (build it from a GitHub corpus scrape); `img:` dominant hue in 260–290° with S>0.6. · Remedy: derive palettes from a named source (pigment sets, photographs, era/print references) and quantize to ≤5 OKLCH swatches.

**B9. Ignoring composition / negative space** — fills the canvas edge to edge. · **detect** `img:` whitespace ratio (pixels within ΔE<4 of the background) < 15% or > 90%; ink touching all four borders. · Remedy: margins as a parameter (≥8% of min dimension), a rule for where emptiness lives.

**B10. Premature completeness / single-shot** — the first output is treated as final; no alternatives explored. · Why: "Path of Least Resistance" (less ideation, fewer aha moments); p5 study T1 condition "prone to stagnation." · **detect** process: 1 generation per brief; no seed sweep. · Remedy: decomposed pipeline (concept → structure → palette → render → critique) with ≥3 candidates at the structure step; the p5 study showed decomposition more than doubled reflective iteration.

**B11. Goal simplification under error** — after a runtime error the model silently downgrades the idea ("let's make it simpler"). · Why: observed verbatim in the p5 co-creation study. · **detect** diff: feature count decreases after an error turn. · Remedy: fix the error in isolation, keep the brief fixed; log any scope change as an explicit decision.

**B12. Silent API misuse that renders *something*** — `bezierOrder()` out of range "fail differently and silently" in 2D vs WebGL ([issue #9079](https://github.com/processing/p5.js/issues/9079)); `splineVertex` infinite loops ([#9026](https://github.com/processing/p5.js/issues/9026)); text drawn before font loads. · **detect** render log: console warnings/errors captured in headless run; FES messages. · Remedy: treat console warnings as failures in the render gate.

**B13. "Interactive" claims with no interaction** — `mousePressed` stubs that do nothing; `mouseX` used but output is static. · **detect** `src:` event handlers with empty bodies. · Remedy: either design the interaction or remove the handler.

**B14. Describing motion in a still** — animation written when a static piece was asked, or vice versa; `noLoop()` missing for stills (burning CPU, non-reproducible export). · **detect** `src:` brief says "poster/print" and no `noLoop()`; brief says "animation" and `noLoop()` present. · Remedy: a `MODE` constant; stills call `noLoop()` and `save()` with seed in name.

### Family C — Technical / performance (numbers from sources)

**C1. CPU per-pixel loops** — `loadPixels()` + nested loop + `noise()` per pixel: **3 fps at 400×400** reported ([forum](https://discourse.processing.org/t/pixel-arrays-and-performance-issues-in-p5-and-processing/24891)); `noise()` is the hot spot; x-outer/y-inner loop order thrashes the array. · **detect** `src:` `loadPixels\(` inside `draw`, `noise\(` inside the inner loop, `for\s*\(\s*(let|var)\s+x` as outer loop. · Remedy: y-outer loop, compute at 1/4 res and scale, split work across frames, or move to a fragment shader (`createFilterShader` in 2.x / `p5.strands`).

**C2. `get()` / `getImageData` readback churn** — fps drops from 60 to ~14 after exactly 100 frames in Chrome (`willReadFrequently` heuristic) ([forum](https://discourse.processing.org/t/why-does-framerate-go-slow-after-exactly-100-get-calls/43055)); `get()` in draw climbed to ~1 GB and crashed tabs at 600×600 ([#1485](https://github.com/processing/p5.js/issues/1485)). · **detect** `src:` `\.get\(|get\(` or `loadPixels` inside `draw`. · Remedy: sample from the source image, draw to a `createGraphics` layer and `image()` it, or set `willReadFrequently` on the context.

**C3. `pixelDensity` quadrupling work** — retina = 4 pixels per CSS pixel; `pixels` length is `width*height*d*d*4` ([optimizing-webgl tutorial](https://p5js.org/tutorials/optimizing-webgl-sketches/), [#452](https://github.com/processing/p5.js/issues/452)). Mobile cliff: iPhone 6 ~30 fps at 1020×700 but <10 fps at 1030×700 (1024px texture limit suspected), <5 fps on older devices until the viewport meta tag was added ([#570](https://github.com/processing/p5.js/issues/570)). · **detect** `src:` no `pixelDensity(` call in a full-window or pixel-manipulating sketch. · Remedy: `pixelDensity(1)` for pixel work/animation, `pixelDensity(2+)` only for the final still export.

**C4. Draw-call ceiling of the shape API** — q5.js benchmark: p5 holds **~3,600 circles at 60 fps** vs 87,840 for q5 WebGPU, 19,440 for Pixi; p5 computes vertex positions on the CPU each frame ([q5 benchmark](https://q5js.substack.com/p/is-q5js-the-fastest-2d-graphics-library)). p5 2.0 beta regressed further: 10,000 rects 30–40 fps (1.11) → ~5 fps (2.0 beta); 1,000 WebGL particles 60 → ~20 fps; partially fixed by state-diffing, still ~38 fps WebGL ([#7539](https://github.com/processing/p5.js/issues/7539)). · **detect** `src:` loop bound ≥ 2,000 around `ellipse|circle|rect|line|point` inside draw. · Remedy: batch into one `beginShape(POINTS/LINES)`, draw once to an offscreen layer and blit, `buildGeometry()` in WebGL, or leave p5 (see Section 3).

**C5. WebGL `beginShape` per frame** — historically 10–15 triangles → 20 fps ([#1727](https://github.com/processing/p5.js/issues/1727), since fixed) because geometry was re-tessellated and re-uploaded every frame; still the wrong pattern for static meshes. · **detect** `src:` `WEBGL` + `beginShape` in draw with no `buildGeometry|freeGeometry`. · Remedy: `buildGeometry()` once, `model()` per frame; `linesMode(SIMPLE)` (2.x) for cheap strokes.

**C6. Text rendering** — custom .ttf via opentype.js: **~40 fps → 6 fps** ([#3435](https://github.com/processing/p5.js/issues/3435)); `_handleAlignment` costlier than path generation; 2.0 moved to native FontFace (and `textToPoints` ~350% faster). · **detect** `src:` `text\(` inside draw with `loadFont` and per-frame `textWidth`/`textBounds`. · Remedy: cache glyph layouts, render text once to a graphics buffer, or `textToPoints` once in setup.

**C7. Vector / object allocation churn** — `createVector`, `p5.Vector.add/sub` returning new objects per particle per frame; GC pauses show as periodic stutter ("5 fps drops alternating with 30–40 fps" pattern in the pixel thread is the same signature). · **detect** `src:` `createVector\(|p5\.Vector\.(add|sub|mult)` inside the inner loop of draw. · Remedy: typed arrays (`Float32Array` x/y/vx/vy), in-place `.add()`, object pools.

**C8. Frame-rate is not a clock** — `frameRate(45)` yields 30, `frameRate(24)` yields 20; on 100 Hz monitors min 1.10 / max 84.75 fps measured ([#5354](https://github.com/processing/p5.js/issues/5354)); background tabs throttle rAF ([#4839](https://github.com/processing/p5.js/issues/4839)). · Remedy: `deltaTime`-based motion; fixed-step accumulators for sims; offline frame-by-frame render for video.

**C9. `createGraphics` as texture in WebGL** — each frame re-uploads the whole buffer; use `p5.Framebuffer` (stays on GPU) or convert static buffers to `p5.Image` via `.get()` ([tutorial](https://p5js.org/tutorials/optimizing-webgl-sketches/)). · **detect** `src:` `WEBGL` + `createGraphics` used as `texture(`. 

**C10. Memory from unbounded arrays** — particle/trail arrays that only `push`. · **detect** `src:` `\.push\(` in draw with no `splice|shift|length =` nearby. · Remedy: ring buffers, lifetime culling.

**C11. Huge canvases for print** — `createCanvas(7200, 10800)` in-browser exhausts GPU/texture limits (mobile ~1024–4096 px; desktop ~16k but memory 4·w·h·d² bytes). · Remedy: render tiles, or use node-canvas / `canvas-sketch` export, or vector output (SVG via p5.js-svg / plotter workflows).

**C12. FES overhead** — the Friendly Error System was "the main source" of 2.0's canvas slowdown ([#7539](https://github.com/processing/p5.js/issues/7539)). · Remedy: `p5.disableFriendlyErrors = true` (1.x) / use the `p5.min.js` build in production.

### Family D — Process / human

**D1. No iteration** — ship the first render. Hobbs: "When I physically make myself sit down and do something, new work comes out." · **detect** process: one render per brief. · Remedy: a minimum of three structurally different candidates before any polish.

**D2. No curation across seeds** — judged on one lucky seed; long-form standard is "bad results are extremely rare." · **detect** process: no seed sweep; no contact sheet. · Remedy: 3×3 or 4×4 contact sheet of consecutive seeds; fix the *worst* cell, not the best.

**D3. No constraints** — "make something beautiful" briefs produce the median. Compton: content that "fails to be interesting" is the primary failure; interest needs context. · Remedy: brief = subject + lineage reference + palette source + format + one rule to break.

**D4. Chasing novelty for its own sake** — technique tourism; Hobbs: coding mastery "doesn't help with the art problems." · Remedy: ask what the piece is *about*; the system "is where the heart of the artwork lies" (DesLauriers).

**D5. Variety vs coherence not managed** — adding features for variety reduces coherence (Hobbs). · **detect** across seeds: pairwise image-embedding distance either < 0.1 (oatmeal) or > 0.6 (incoherent collection). · Remedy: fixed invariants (palette, margin, stroke vocabulary) + 2–3 flexing dimensions.

**D6. Over-reliance / de-skilling** — delegating the idea to the model: fewer aha moments, lower maintainability, convergent solutions (Path of Least Resistance study). · Remedy: human writes the one-paragraph intent and the constraints; the agent proposes alternatives, renders, measures; the human curates.

**D7. Reading the "Hello World" as mature** — mistaking a technique's first-tutorial form for a finished work (González Vivo). · Remedy: for any technique, name its canonical form and require ≥2 departures from it.

---

## 2. Cliché fingerprint list — 25 most overused tropes (2026)

Each: **trope** · detection heuristic (`src:` regex over sketch, `img:` stat over render) · push-past move.

1. **Perlin flow field, uniform coverage** · `src:` `noise\(.*\)\s*\*\s*(TWO_PI|TAU)` + `cos\(|sin\(` + loop ≥500 · Mask it to a shape or gradient; vary line weight Pareto; leave 30% silence.
2. **Particle trails on fading black** · `src:` `background\(0,\s*\d{1,2}\)` + `blendMode\(ADD\)` · Store paths, draw with age-based width; light ground.
3. **Rainbow HSB cycle** · `src:` `colorMode\(HSB` + `frameCount\s*%\s*360`; `img:` hue-bin occupancy >70% · One hue family + one accent; map data to lightness.
4. **Noise-displaced blob / wobbly ring** · `src:` radius `= r + noise(` inside `for.*TWO_PI` · Use as mask or silhouette for something else; repeat at 3 scales.
5. **Truchet / tile grid with random rotation** · `src:` nested `for` + `rotate\(.*HALF_PI.*random` · Variable cell merging; a second system that crosses tiles.
6. **Circle packing, everything touching** · `src:` `dist\(` collision loop + `circle\(` growth · Pack non-circles; pack into a letterform or photo-derived mask; leave gaps.
7. **Centered rotating mandala / radial symmetry** · `src:` `translate(width/2,height/2)` + `for.*rotate\(TWO_PI/` · Break one spoke; off-centre; asymmetric count.
8. **Lissajous / harmonograph curves** · `src:` `sin\(a\*t.*\)` + `cos\(b\*t` · Modulate parameters with a slow envelope; cut and recompose segments.
9. **Phyllotaxis / sunflower spiral** · `src:` `137\.5|GOLDEN_ANGLE|2\.399` · Perturb the angle locally; grow along a path, not a point.
10. **Recursive subdivision rectangles (Mondrian)** · `src:` recursive `rect` split with `random\(` depth · Non-axis-aligned splits; subdivide a non-rectangle.
11. **Boids / flocking** · `src:` `align|cohesion|separation` identifiers · Make the trace the artwork; flock on a surface.
12. **Game of Life / cellular automata grid** · `src:` `neighbors|rule30|rule110` · Non-square lattices; continuous CA; render states as texture not cells.
13. **Reaction-diffusion (Gray–Scott)** · `src:` `feed|kill|laplacian` · Mask the feed rate with an image; use it as a displacement map.
14. **Metaballs / marching squares blobs** · `src:` `threshold` + sum of `1/dist` · Use for typography or negative space.
15. **Voronoi / Delaunay tessellation** · `src:` `voronoi|delaunay` · Lloyd-relax toward an image; render only edges that cross a tone boundary.
16. **L-system / fractal trees** · `src:` `axiom|rules\[|'F'` · Trees that respond to a wind field; prune by light.
17. **Sine-wave grid of circles ("sin(x+y+t)")** · `src:` `sin\(.*x.*\+.*y.*\+.*frameCount` sizing an ellipse · Two incommensurate frequencies; sample an image for amplitude.
18. **Random walk / drunkard lines** · `src:` `x += random\(-1, 1\)` · Lévy flights; walks that avoid each other.
19. **3D rotating torus/box with `normalMaterial()`** · `src:` `normalMaterial\(|rotateX\(frameCount` · Custom lighting, deliberate camera, textures from a palette.
20. **Glitch / RGB-shift / scanlines** · `src:` channel offset `pixels[i+` loops, `copy\(` with random offsets · Glitch one region once; glitch the type not the image.
21. **"Terrain" wireframe mesh (noise heightmap)** · `src:` `TRIANGLE_STRIP` + `noise\(` z · Data-driven height; render as contours or hatching.
22. **Dot stipple halftone of an image** · `src:` `loadImage` + `brightness\(` → `circle` size · Rotate screens per channel; variable shapes; moiré on purpose.
23. **Neon cyan/magenta on black** · `src:` `#0ff|#f0f|#00ffff|#ff00ff|'cyan'|'magenta'`; `img:` two hues at 180°/300° with S>0.8 on L<0.1 ground · Analogous palette with one desaturated accent.
24. **Indigo→purple gradient ground** · `src:` `lerpColor\(` between hex in 230–290° hue; `img:` dominant hue 260–290°, S>0.6 · Earth/paper grounds; gradients in lightness not hue.
25. **Monospace "data viz" labels and crosshairs as decoration** · `src:` `textFont\('monospace'\)` + `line\(0, y, width, y\)` HUD lines with no data · Typeset one real line of text or none.

Batch rule: if ≥3 of 25 fire in one sketch or the same top-2 fire in >60% of a batch, the output is "common" and fails the uniqueness gate regardless of how pretty it is.

---

## 3. p5.js limits and escape hatches

| Limit | Threshold / symptom (source) | Mitigation inside p5 | When to leave p5 → where |
|---|---|---|---|
| 2D stroke count (static still) | ~10k+ strokes per still are fine once; per frame they are not | batch through one `p.drawingContext` `Path2D` per colour (tested ~13k vertices/frame ≈ 0.25 s headless) | — |
| 2D shape call count | ~3,600 circles @60 fps ([q5 bench](https://q5js.substack.com/p/is-q5js-the-fastest-2d-graphics-library)); 10k rects ~30–40 fps in 1.11, ~5 fps 2.0-beta ([#7539](https://github.com/processing/p5.js/issues/7539)) | Offscreen `createGraphics` + blit; `beginShape(POINTS)` batching; disable FES; `pixelDensity(1)` | >10k live primitives → **q5.js** (API-compatible, WebGPU), **Pixi.js**, or **regl/raw WebGL** instancing |
| Per-pixel CPU loops | 3 fps @400×400 with `noise()` per pixel ([forum](https://discourse.processing.org/t/pixel-arrays-and-performance-issues-in-p5-and-processing/24891)) | Low-res buffer scaled up; y-outer loops; split across frames | Any full-res per-pixel effect → **fragment shader** (`createFilterShader`/`p5.strands` in 2.x), or **glsl-canvas / regl / WebGPU** |
| Canvas readback | 60→~14 fps after 100 `get()` calls (Chrome); 1 GB + crash with `get()` in draw ([forum](https://discourse.processing.org/t/why-does-framerate-go-slow-after-exactly-100-get-calls/43055), [#1485](https://github.com/processing/p5.js/issues/1485)) | Read from source image; separate layer; `willReadFrequently` | Feedback systems (video-in → pixels → out) → **shaders/FBO ping-pong** in p5 WebGL, or **TouchDesigner** for live |
| Pixel density / canvas size | 4× work on retina; mobile cliff at ~1024 px ([#570](https://github.com/processing/p5.js/issues/570)); memory 4·w·h·d² bytes | `pixelDensity(1)` for motion, 2+ only at export; viewport meta | Print >6k px → tile render, **node-canvas / canvas-sketch** headless, or **SVG/plotter** output (p5.js-svg) |
| WebGL geometry | `beginShape` per frame re-tessellates ([#1727](https://github.com/processing/p5.js/issues/1727)); strokes are expensive; no instancing API | `buildGeometry()` + `model()`; `linesMode(SIMPLE)`; `p5.Framebuffer` not `createGraphics` | Scenes >50k vertices, PBR, shadows, post-processing chains → **three.js** (InstancedMesh, EffectComposer) or **Babylon** |
| Text | Custom TTF 40→6 fps in 1.x ([#3435](https://github.com/processing/p5.js/issues/3435)); 2.x native fonts faster | Cache to buffer; `textToPoints` once; system fonts | Heavy typography / variable fonts / kerning control → **HTML/SVG + CSS**, **opentype.js** direct, **Paper.js** |
| Timing | `frameRate(45)`→30; 100 Hz monitor min 1.1 / max 84.8 fps ([#5354](https://github.com/processing/p5.js/issues/5354)) | `deltaTime`; fixed-step sims; `noLoop()` for stills | Frame-exact video → offline render loop (**canvas-sketch** `--stream`, **Puppeteer** frame capture, **ffmpeg**) |
| API drift 1.x↔2.x | `preload`, `curveVertex`, `keyCode`, `mouseButton` consts removed/changed ([v2.0.0](https://github.com/processing/p5.js/releases/tag/v2.0.0)); new silent failure surfaces ([#9079](https://github.com/processing/p5.js/issues/9079), [#9026](https://github.com/processing/p5.js/issues/9026)) | Pin version; compat addons; version-gated lint | Long-lived archival pieces → **vanilla Canvas2D** with no dependency (DEAFBEEF's "agency" argument) |
| Audio-reactive / live performance | p5.sound is a separate lib; no scheduler precision | `p5.sound` + `deltaTime` | Live sets, MIDI/OSC, GPU feedback → **TouchDesigner**, **Hydra**, **Max/Jitter** |
| 2D vector output / plotting | Canvas is raster | `p5.js-svg` addon (1.x only, as of writing) | Plotter / laser / print vector → **canvas-sketch + penplot**, **Paper.js**, **vsketch** (Python) |
| Determinism across machines | `noise()` implementation and float differences; `random()` fine with seed | `randomSeed`+`noiseSeed`; avoid `millis()` in structure | Long-form / on-chain (fxhash, Art Blocks) → their injected PRNG (`fxrand`, `tokenData.hash`); write seed-pure code |

---
