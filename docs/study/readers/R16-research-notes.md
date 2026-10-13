# R16: Digest of the six research notes

Items marked [checked] come from my grep of the 20 Atelier film HTML files (lines 887 to end) and the shared runtime (lines 6 to 886).

## 1. p5 2.3.4 checklist (note 01, with 04)

What changed from 1.x:
- [ ] No `preload()`. Use `async function setup(){ img = await loadImage(f) }`, with try/catch (a 404 rejects). Never make `draw()` async.
- [ ] Curves: `curveVertex` is `splineVertex`; `curve`, `curvePoint`, `curveTightness` are `spline`, `splinePoint`, `splineProperty('tightness')`. `bezierVertex(x,y)` takes one point per call, with `bezierOrder(2|3)`. `quadraticVertex`, `bezierDetail`, `beginGeometry/endGeometry` are gone; use `buildGeometry(cb)`.
- [ ] Color: `colorMode` adds LAB, LCH, OKLAB, OKLCH, RGBP3. OKLCH chroma runs 0 to 150 and maps to CSS 0 to 0.4. New: `paletteLerp`, `color.contrast(c,'WCAG21'|'APCA')`, `P2DP3`.
- [ ] Type: `textToPoints`, `textToContours`, `textToPaths`, `textToModel` are methods on `p5.Font`. `textWidth` is tight (spaces ignored); `fontWidth` is the loose old measure. A variable .ttf can fall back to FontFace, where `textToPoints` fails.
- [ ] Input: `mouseButton.left`; `key`/`code`; constants are strings (`UP_ARROW === 'ArrowUp'`); no touchStarted/Moved/Ended.
- [ ] Other: `shader()` always applies to fills; `createCamera()` needs `setCamera`; `createVector` needs explicit dimensions; `append`, `sort`, `subset` are removed; p5.sound 1.x does not work (use 0.4.1).

Instance mode and strands:
- [ ] Use `new p5(sketch, node)`. Inside `build*Shader` callbacks, prefix p5 calls (`p.sin`, `p.noise`, `p.millis`, `p.uniformFloat`, `p.getTexture`) and pass `{ p }`. Hook objects stay bare.
- [ ] Callbacks are recompiled with `new Function`, so closures over locals are lost. Pass locals through the scope argument.
- [ ] Hook blocks: `hook.begin(); ...; hook.end()` on `worldInputs`, `pixelInputs`, `combineColors`, `finalColor`, `filterColor`. Loop bounds must be constant; branch sides must match type.
- [ ] GLSL hook strings take `getFinalColor(vec4, vec2)`. The one-argument form fails to compile and hangs setup. Paste `inspectHooks()` output into prompts.
- [ ] `redraw()` is async.

Framebuffers and WebGPU:
- [ ] `createFramebuffer({format: FLOAT, textureFiltering: NEAREST, density})` with `fb.begin/end/draw`. Ping-pong feedback was tested. A `p5.Graphics` used as a texture re-uploads each frame.
- [ ] WebGPU is experimental (2.2+): `await createCanvas(w,h,WEBGPU)` plus `p5.webgpu.js`; `createStorage`, `buildComputeShader`, `compute` (2.3). Compute was not verified: headless SwiftShader fails at `mapAsync`. Ship a WEBGL fallback.

Must-haves: `<meta charset="utf-8">`. The bundle has Greek identifiers; without the charset p5 dies before setup with "Missing initializer in const declaration". Also `pixelDensity(1)`, `randomSeed`, `noiseSeed`, `window.__done`, and http rather than file://.

Not in 2.3.4: preload; curveVertex, curve, curvePoint, curveTightness; quadraticVertex; bezierDetail; beginGeometry/endGeometry; RGBHDR, P2DHDR; linesMode; instances(); transform2D/3D and p5.svg (both exist only on `main`, whose docs mislead). p5.js-svg 1.6.0 throws at `createCanvas(..., SVG)`.

Contradictions to settle against the build: (a) `instanceID()` vs `instanceIndex`: 01 and 04 disagree on which is the function. (b) p5.sound 0.4.1 removed classes (MonoSynth, PolySynth, EQ, Filter, Part, Phrase, Score, SoundLoop, OnsetDetect): 01 says removed, 04 says exported. (c) Note 03 recommends `linesMode(SIMPLE)`, which 01 and 04 say is undefined (use `strokeMode`).

## 2. Lineage and frontier (note 02)

Lineage: Galanter (2003) defines generative art by ceded control. Three postures recur: perturbed order (Molnár; Nees's *Schotter*, 1968), exhaustive rule (Mohr; LeWitt, 1967), encoded judgment (Cohen's AARON). Then tools: Processing (2001), p5.js (2013). Then craft turns to distributions: Hobbs (2014 to 20), Compton's "oatmeal" (2016). Then economics: Art Blocks (2020), *Fidenza* (2021), Cherniak's *The Goose* ($6.2M, 2023). Then p5 2.x: strands (2.0), loops (2.1), WebGPU (2.2), compute (2.3).

Frontier as defined: four currents (GPU-native p5; AI as material; a return to plotters and constraint; live systemic work). The centre of gravity moves from output to system quality: a system that holds a thousand seeds, a wall print, a plotter, 60 fps on a phone, and still "surprises on seed 998". Next-level markers: compute-native sketches, WebGPU as default, LLM-assisted parameter-space curation, and constraint as the authorship signal. The acceptance test is Compton's differentiation versus uniqueness, judged on a seed grid. 

## 3. Failure modes (note 03): symptom, then fix

Aesthetic
- A1 full hue cycle: 3 to 5 OKLCH swatches, two hue families at most.
- A2 black ground, thin neon lines: warm or tinted ground; varied weight; fills.
- A3 Perlin field, even coverage: masks, silence zones, density gradient.
- A4 one centred object: off-axis anchor; asymmetry.
- A5 `random()` everywhere: Gaussian, Pareto sizes, Poisson-disc, correlated jitter.
- A6 no hierarchy: one dominant, power-law sizes.
- A7 default 400x400 canvas: choose the format; normalized units.
- A8 `x += 2` per frame: `deltaTime` or clock `t`.
- A9 ADD-blend glow: value structure; blend one layer.
- A10 noise-wobbled ring: give it a job, or drop it.
- A11 identical grid, random rotation: break the grid; add a second system.
- A12 `background(0,10)` trails: store paths; age-based width.
- A13 pure RGB or default grey: named palette; chroma at most 0.2 on 80% of the surface.

Agent behaviour
- B1 1.x API in 2.x: pin version; version-gated lint.
- B2 about five techniques: ask for five approaches with probabilities; pick the least typical; exclusion list.
- B3 adjectives without a render: headless render at 3+ seeds; critique after the stats.
- B4 no seed: one seed constant in both calls; seed in filenames.
- B5 eight systems: one idea taken to the end; remove-one test.
- B6 monolithic `draw()`: build data in setup; draw only renders.
- B7 comment on every line: comment on why; six-line intent header.
- B8 training-default palette (#FF6B6B, indigo to purple, neon): named source; at most five swatches; hex blocklist.
- B9 ink to every edge: 8% margin; whitespace 15% to 90%.
- B10 single shot: three or more candidates.
- B11 scope shrinks after an error: fix in isolation; log scope changes.
- B12 silent misuse (bezierOrder out of range, text before font load): console warnings fail the gate.
- B13 empty handlers: design it or delete it.
- B14 motion and still mixed: a MODE constant; stills call `noLoop()`.

Performance
- C1 per-pixel `noise()` (3 fps at 400 squared): low-res buffer or shader.
- C2 `get()` or `loadPixels` in draw (60 to 14 fps; 1 GB crash): sample the source.
- C3 retina 4x work: `pixelDensity(1)` for motion.
- C4 over about 3,600 shapes: batch into POINTS or LINES; above 10k, leave p5.
- C5 WebGL `beginShape` per frame: `buildGeometry` once, then `model()`.
- C6 TTF text per frame (40 to 6 fps): `textToPoints` once, cached.
- C7 vector allocation churn: typed arrays; in-place operations.
- C8 `frameRate` as a clock (45 gives 30): `deltaTime`; offline stepping for video.
- C9 `createGraphics` as a WebGL texture: use a framebuffer.
- C10 push-only arrays: ring buffers.
- C11 huge print canvases: tile, or output vector.
- C12 FES overhead (up to 10x): ship `p5.min.js`.

Process
- D1 one render: three or more structurally different candidates.
- D2 one lucky seed: 3x3 contact sheet; fix the worst cell.
- D3 no constraints: brief with subject, lineage, palette source, format, one rule to break.
- D4 novelty for its own sake: state what the piece is about.
- D5 variety without coherence: fixed invariants; two or three flexing dimensions.
- D6 idea delegated to the model: human writes intent; agent proposes and measures.
- D7 "Hello World" read as mature: require two departures from the canonical form.

Note 03 section 2 adds 25 cliché tropes with regex detectors; three or more firing in one sketch fails it.

## 4. Advanced surfaces (note 04) and film usage

Catalogue (API; cost; films [checked]):
- Framebuffers and feedback: `createFramebuffer`, `filter(shader)`; GPU memory; FLOAT for trails. Films: one occupancy buffer in Bunraku; no feedback loop.
- p5.strands shaders: `buildMaterialShader`, `buildFilterShader`; compiled once in setup. Films: none.
- Raw GLSL: `createShader`, `setUniform`. Films: Escapement.
- Instancing: `buildGeometry` plus `model(g, n)`; 24 instances tested. Films: Escapement, Bunraku, Run, Margin, Marbling shared.
- Compute and WebGPU: `createStorage`, `compute`; GPU-only. Films: none.
- Text geometry: `textToContours`, `textToPoints`, `textToModel`. Films: `textToContours` in the shared runtime; the others none.
- Splines: `splineVertex`, one-point `bezierVertex`. Films: none.
- Audio: p5.sound 0.4.1 (32 FFT bins; spectrum 0 to 1; needs `connect`) or raw Web Audio; needs a gesture. Films: none.
- Camera and ML: `createCapture`, ml5 (models download at runtime). Films: none.
- Export: `saveCanvas`, `saveGif` (1 s at 200 squared: 55.9 KB), p5.capture, frame stepping (60 frames in 3.5 s). Films: none.
- Accessibility: `describe(text, LABEL)`. Films: none.
- Instance mode: `new p5(sketch, node)`. Films: all, through the runtime's `p.` prefix.

Headless recipe (Chromium 141): flags `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` ran 17.7 s against 28 s without them. Set `window.__done`; screenshot the canvas.

Recommended by the notes but unused in all 20 films [checked]: strands shaders; compute and WebGPU; `textToPoints` and `textToModel`; `splineVertex` and `bezierOrder`; `strokeMode(SIMPLE)`; `describe()`; `saveGif`; `createCapture`; `loadSound`; framebuffer ping-pong.

## 5. Evaluation (note 05)

Nothing is measured in this note. Every number is a literature value or a proposed constant.
- (a) Mechanical gates, which veto: 120+ frames load; zero console errors; identical pixels for one seed; no wall-clock input; p95 frame time at most 2x median; not blank; SSIM above 0.9 between 1x and 2x density.
- (b) Computed metrics as corridors, at 1024 squared: PNG compression 0.05 to 0.45; Birkhoff M_K 0.3 to 0.8; luminance entropy 4.0 to 7.5 bits; edge density 0.02 to 0.20; fractal D 1.3 to 1.5 (flag only); colourfulness 15 to 110; OKLab L range at least 0.35; RMS contrast at least 0.12.
- (c) Seed sweep of N=64 (32 minimum, 256 for release): failure under 2%; mode collapse if mean pairwise cosine exceeds 0.92; boredom test over 45% "same" fails.
- (d) Cliché distance: kNN (k=5) in DINOv2 and CLIP space against 300 to 1,000 corpus renders; pHash distance under 12 flags a copy.
- (e) Seven VLM seats (Composition, Colour, Craft, Cliché Hunter, Wonder, Intent, Metric Auditor): pairwise, both orders, no ties; self-agreement under 0.8 discards the verdict.
- (f) Aggregation: gates veto; minimum over seats; disagreements go to a human; Wonder is advisory.

Literature numbers cited: GenArena pairwise adds 20 points of accuracy (alpha 0.52 to 0.86); judge-human correlation 0.36 to 0.86; PNAS Nexus population AUT 0.459 vs 0.699 (d=1.8); Spehar fractal D 1.3 to 1.5 (n=220); CritiqueCrew 9.58 vs 7.96 issues (n=48).

Caveats: bands are priors to re-fit after about 200 labelled renders; seats run twice in (e) but three times in (f).

## 6. Integration map (note 06)

Aliases: `$SK` = `/root/.claude/skills/synced/608669ff-56c5-494e-b666-5108a5430083_b74455d7-2da6-4bc4-8fc0-3d1a64a7b574`; `$PL` = `/root/.claude/plugins/synced/` plus the same suffix.

Composition. ceti-p5-studio calls resolvers and critics: dict-color (palettes; needs a runtime sampler, since its regex misses `fill(217,102,41)`), owala and wcag tokens, bertin for data-bearing sketches, milton and sagmeister as critic seats, moe-eval, tell-apart, meta-review, artifact-chain, meta-design. It is called by ceti-explainer (background layer; must not break gate.mjs), field-story (plate instruments), silver-hero-engine, motion-stack, scroll-driven-explainers, frontend-design and generative-ui (backgrounds), animated-component-galleries (replacing Particles and Sparkles), svg-animation-techniques (p5-to-SVG bridge). The shared constraint is determinism: every still records its seed.

Gaps (06 section 3), most important first: instance-mode sketches; a deterministic clock for stateful simulations; seed provenance; headless render with metrics; generative-art seat prompts (none on disk); p5-to-SVG bridge; runtime palette sampler; canvas accessibility; performance budgets (p5 is about 1 MB against a 35 KB deck budget).

Broken references: moe-eval and multi-agent-eval ship SKILL.md only; meta-operad lacks `operadic-theory.md`; research-loop lacks its references and scripts; ceti-explainer names `reference/audit-overlaps.js` (the file is in `assets/`); op-consist points to `op-decompose` and field-story to `field-notebook-craft` (neither installed).

Conflicts: `--ease-glaser` is (0.22, 1, 0.36, 1) in CETI and owala but (0.34, 1.56, 0.64, 1) in milton, so resolve by role. algorithmic-art's Anthropic chrome must not reach CETI dark. Synced meta-mvp says always ask; the plugin copy says never ask.

## Core ideas that should survive into a master plugin
- Determinism contract: each frame a pure function of (seed, t); record seed and version; `__done` harness; frame-hash tests; no `millis()` or `Math.random` in geometry.
- Verify against the shipped package; pin and lint for version drift; UTF-8 rule.
- Instance mode only; strands closures passed through scope.
- Judge distributions over seed grids; treat randomness as a parameter.
- Cliché lint and batch fingerprint gate; novelty against a corpus.
- Rank, don't score; metrics as corridors; minimum over seats; disagreement to a human.
- Decompose generation (concept, structure, palette, render, critique); three or more candidates.
- Expensive-inside-draw lint; cache text and geometry; pixelDensity policy.
- Accessibility: `describe()`, composed reduced-motion still, at most 3 flashes per second, token-only colour.
- Geometry-first output: one polyline model feeds canvas and SVG.
- Role tokens, not raw hex; state the verification level per claim.

## Experiment-specific choices
- The eight directions (Escapement to Exposure), the shared "What an AI agent does" film, 30 to 35 s length, Atelier runtime 0.1.
- Palettes and fonts: CETI tokens, owala cast, Silver gold, Anthropic chrome.
- Thresholds: 64 seeds, 2%, 0.92, 1024 squared, pHash 12, the seven-seat roster, the 2026 trope list.
- Judge model families; p5.sound 0.4, ml5, dict-color's Wada names, Tone.js.
- Pinning 2.3.4 itself (pin and verify is core; the version is not).

## Recommended 2.x capabilities that no film used
Strands shaders; compute and WebGPU; `textToPoints` and `textToModel`; `splineVertex` and `bezierOrder`; `strokeMode(SIMPLE)`; `describe()`; `saveGif`; `createCapture`; p5.sound; framebuffer ping-pong. The films did use instance mode, framebuffers, instancing, raw GLSL and `textToContours`.
