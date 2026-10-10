# R-A · GPU data visualisation for motion and video · frontier scan · 2026-10-10

Question: what separates frontier GPU-rendered dataviz-for-video from "ordinary 3D charts", and what can we ship from a
browser, WebGL2, headless SwiftShader, frame-stepped, at <= 1.5 s/frame (960x540, 2x)?
## 0. Read this first (evidence quality)
- Web tools: WebSearch worked; WebFetch resolved only github.com (deck.gl, luma.gl, rerun releases); other hosts failed DNS.
  Everything marked [S#] is from a search result or fetched page. Everything marked [PK] is prior knowledge, NOT verified now.
- Not found by search (do not cite as fact): any making-of for Reuters Graphics, The Pudding, NYT, FT or Bloomberg 3D pieces;
  any Kurzgesagt Blender/Houdini data pipeline. Kurzgesagt's own "how we make a video" transcript (c.2019) is Illustrator +
  After Effects, experimenting with Cinema 4D [S20]. "Kurzgesagt-style" is a 2D vector look, not GPU dataviz.
- Local calibration (this repo, measured on headless Chromium + SwiftShader; L1 = references/atlas, L2 = arsenal/WAVE-GL.md,
  L3 = factory notes grep'd): custom GLSL 300 es lit shader ~0.4-0.6 s/frame; p5 baseMaterialShader ~25 s/frame; one big
  branchy shader 5.5 CPU-s/frame (SwiftShader runs every branch); 800^2 feedback+instancing scene 1-1.7 fps; per-frame
  readPixels stalls; MAX_TEXTURE_SIZE 8192; WebGPU does NOT render headless here (mapAsync/present fail; compute buffers too
  large). So: WebGL2, custom small shaders, no readback, no WebGPU, no "everything in one uber-shader".
## 1. The real frontier, in one paragraph
The 2025-26 GPU-dataviz frontier is in two camps. (a) Interactive scale: deck.gl 9.4 ported its layer catalog to WebGPU with
"render parity" [S1], luma.gl is fixing WebGPU picking [S2], regl-scatterplot draws up to ~20M points [S6], deepscatter
streams 1M+ point quadtrees [S7], Rerun renders tens of kHz time series with sub-pixel aggregation and now Gaussian splats [S4][S5].
(b) Cinematic craft for video: DCC tools (Blender geometry nodes, Houdini, Niagara, VFX Graph) with real motion blur, DoF,
OIT, lighting [S12][S13][S17]. The browser-for-video niche (ours) is under-occupied: almost nothing public combines
deterministic frame-stepping with true-scale marks and film-grade camera/post. What reads as "frontier" to a viewer is rarely a
shader; it is (1) every unit visibly present, (2) marks that keep identity across re-partitions, (3) uncertainty that moves,
(4) a camera/focus move that IS the argument. The post effects (bloom, SSAO, PBR) are the garnish, and misused they date the piece.
## 2. Findings by technique
### 2.1 Instanced marks, true-scale counts (one mark per unit), 100k+
- Buys: the viewer sees N, not "a lot". Count before ratio. Texture of a population (clumps, gaps) is evidence a bar cannot give.
- Best: deck.gl layers use instanced attributes (one buffer per accessor, constant attrs materialised on WebGPU) [S1][S3];
  regl-scatterplot to ~20M points with perf mode (flat squares, no blending) [S6]; deepscatter 1M+ points inside Observable [S7];
  Potree for billions of lidar points (LOD octree) [S8]; NYT's one-dot-per-death graphic is the cautionary case: zoom-out makes
  each person a dot and the piece got criticised for it [S19]. Datapointed "Literally Billions" (a dot per human, 2013) is the older precedent.
- Browser/SwiftShader: YES. 100k gl.POINTS or instanced quads, per-instance (x,y,z,class,seed) attributes, size <= 4 px: est. 0.2-0.6 s/frame.
  1M points is borderline (vertex ALU + fill); keep to 250-500k and show the 1:1 count in a caption/counter. Count-in = draw range
  `drawArraysInstanced(..., min(N, floor(t*rate)))`, so the reveal is a pure function of t. Local lane gl-instances targets 10k-100k [L2].
- Trap: zoomed out, each person becomes a smear. Keep one mark readable at the key moment via camera dolly (2.9).
### 2.2 GPU aggregation, density fields, DataFilter
- Buys: raw count to density without CPU binning; filtering/brushing a whole population at 60 fps (time scrub = uniform change).
- Best: deck.gl GPU aggregation (HexagonLayer/GridLayer `gpuAggregation:true`; GPU path supports SUM/MIN/MAX/MEAN) [S1][S3];
  DataFilterExtension does range filters in the vertex shader (1-4 numeric props) [S21]; Kepler.gl moved time-playback filtering to
  GPU for exactly this reason [S21]. Datashader-style density is the Python analogue [PK].
- Browser/SwiftShader: YES for filter-in-shader (a discard/alpha-zero test per instance, zero extra cost) and for additive-splat density
  (render points to a float RT with ONE blend pass, then tone-map; one full-screen pass ~0.05-0.15 s). NO for WebGPU compute aggregation
  headless (documented failure above). Hex/grid bins can be precomputed on CPU deterministically and fed as plain arrays.
- Frontier tell: the aggregation is the *argument* (counts per cell shown as stacked unit marks, not a colour ramp).
### 2.3 GPU picking
- Buys interactively only; for video it is irrelevant (no pointer). Useful as an authoring tool (click a mark, get its id) and as an
  occlusion oracle for labels (see 2.11).
- State: deck.gl picks by colour-id render pass; WebGPU picking was officially unsupported and luma.gl PR #3310 (merged 2026-10-01)
  fixes a vertical-origin bug, validated on software rendering [S2][S1].
- Browser/SwiftShader: feasible but a readPixels per frame stalls; never in the render path. Skip for films.
### 2.4 three.js / regl / luma.gl ecosystem choices
- three.js: OITPassNode exists for weighted-blended OIT (NormalBlending only, no transmission; MSAA only on WebGPU backend) [S9]; GTAO, SSAO,
  Bloom, Bokeh passes ship as addons [S10]; troika-three-text gives on-demand SDF glyphs with PBR/shadow materials [S11].
- regl: minimal state-machine over WebGL, ideal for a vendored single-file film, no scene graph [S6].
- luma.gl/deck.gl: shader-module system, WebGPU backend; layer extensions via shader hooks do not yet port to WGSL (deck 9.4) [S1][S3].
- Our constraint (CLAUDE.md): vendored p5 + fonts only, no runtime fetch. Everything above is reachable via raw GL on p5's context or
  custom shaders; none needs a new dependency. p5 2.4 `instances()` is merged-not-released [L1]; use buildGeometry + model(geom, n) or raw ANGLE_instanced_arrays.
### 2.5 Observable Plot, D3 and "GPU experiments"
- Nothing found: no official WebGL mark in Plot; D3/Vega are explicitly "not well suited" to millions of points [S6]. The practice is
  D3 for scales/layout (CPU, deterministic), regl/deck for pixels. Bokeh's WebGL backend is the contrast: limited glyph set, falls back on log scales [S22].
- Use: D3 scales and force/treemap layouts compute target positions; GPU only draws and interpolates. That split is the right architecture.
### 2.6 Rerun, Kepler, scientific viewers
- Rerun 0.36 (10 Aug 2026): experimental 3D Gaussian splats, EWA splat renderer, SH; 0.38.1 (17 Sep 2026): better time-series interaction, measurements, agent panel [S4].
  Earlier 0.13: kHz time series, query cache 20-50x, sub-pixel aggregation 30-120x plot speedup [S5]. Takeaway: *time is a first-class
  axis in the data model* (everything is a timeline), which is what makes scrubbing deterministic. Our "one clock, render(t, state)" law is the same idea.
- Kepler.gl: time-playback + GPU filters on deck.gl [S21]. Both are interactive tools, not video makers.
### 2.7 Game engines: Niagara, VFX Graph
- Buys: millions of GPU particles with forces, collisions, depth-buffer collision, lit sprites, real motion blur, volumetric fog; rendered offline via
  Movie Render Queue / Recorder = frame-stepped by design [S12][PK for MRQ].
- Best: both are marketed for millions of GPU particles; CPU particles are capped in the thousands [S12]. No studio dataviz case study found. [PK] Public
  data-art in Unreal/Unity exists (e.g. flight/ship traffic, scientific volumes) but I could not source it here.
- Browser: concept yes (GPU particle = state texture + ping-pong), implementation no. We can imitate the *look* with stateless
  positions = f(seed, t) (no ping-pong, so seek is exact), which is also what keeps render(t) pure.
### 2.8 Houdini / Blender geometry nodes (studio route)
- Houdini: used for "cinematic presentation of science" (IEEE VIS 2020 tutorial); CSV import -> lat/lon -> instanced geometry (Entagma flight paths) [S13][S13].
- Blender: geometry nodes can drive data charts (commercial "node charts" add-on) and motion graphics; the dev blog tracks continued GN work (Sept 2026 workshop) [S15][S16].
- Buys: path-traced or EEVEE lighting, real DoF, motion blur, volumetrics, proper glass; slow per frame (seconds to minutes) but offline so irrelevant.
- Studio claims (Reuters, Pudding, NYT, FT, Bloomberg) NOT verified. What IS verified: NYT open-sourced `three-story-controls` (camera rig + scroll
  camera animation editor) [S17], i.e. newsrooms treat the camera as an authored instrument in three.js.
- Browser/SwiftShader: no; but the *look targets* (soft key + AO contact, shallow DoF, motion-blurred streaks) are the benchmark to approximate cheaply (2.14-2.16).
### 2.9 Camera as argument, focus pull
- Buys: attention without arrows; scale reveal (dolly from one mark to the whole field); depth as the variable (z = time or class).
- Best: NYT three-story-controls [S17]; DCC film work [PK]. Lane gl-camera-rig exists in our wave plan [L2].
- Browser: YES, free (uniform matrices). Slerp/ease on t. Focus pull = DoF (2.14), costs one blur pass.
### 2.10 manim-gl, kinetic type in 3D
- ManimGL: OpenGL + GLSL, GPU-accelerated, experimental, 3D surfaces, lighting, camera reorient; ManimCE defaults to Cairo [S23]. Research explainer agents still
  target Manim, with layout/codegen failures reported [L1 frontier-2026]. Manim's strength is *construction semantics* (Transform between mobjects with
  a stable correspondence), not render tech.
- Kinetic 3D type: troika SDF text with real materials [S11]; p5 2.x `textToModel`/`textToContours` for extruded titles [L1]. MSDF atlases need pre-processing [S11].
- Browser/SwiftShader: extruded text = few thousand triangles, cheap; SDF text = cheap fragment. Keep type flat and screen-space for numbers (legibility), 3D only for titles.
### 2.11 Label placement and occlusion in 3D
- Buys: numbers that stay readable and attached while the camera moves; the exec-level rule "every digit is a claim" survives 3D only if labels do.
- Best: force-based, temporally-coherent labelling (Vaaraniemi et al. TUM: repulsion + anti-oscillation) [S24]; Stein & Decoret external labelling as 2D
  energy minimisation [S25]; survey of external labels [S25]; world-space labels give stronger association but occlude [S25].
- Browser/SwiftShader: YES on the CPU: project anchors (worldToScreen), run a deterministic few-iteration relaxation seeded from the previous
  *keyframe-derived* layout, not from the previous rendered frame (frames must seek independently: solve the layout as a pure function of t by
  iterating from a canonical start N times, or tween between per-keyframe solutions). Occlusion test by CPU depth of the anchor vs. scene bounds, no GPU readback.
- Frontier tell: labels never jitter and never cover the mark they name.
### 2.12 "Same marks, new partition" morphs and temporal coherence
- Buys: reversals (pooled vs split, Simpson) are felt as *the same people regrouped*, not two charts. Object constancy is the perceptual mechanism.
- Evidence: Heer & Robertson 2007: animated transitions improve graphical perception, staged transitions preferred, axis rescaling before value change
  and avoid rescaling mid-move, and animation can mislead when it violates data semantics [S27].
- Best: Gapminder/Bostock object-constancy lineage [PK]; Manim `Transform`/`ReplacementTransform` [S23]; deck.gl `transitions` on attributes
  (GPU-interpolated) [PK, deck docs].
- Browser/SwiftShader: YES, cheapest frontier technique. Each mark carries two target buffers (layout A, layout B); vertex shader does `mix(a,b,ease(stage(t)))`
  with stagger by per-mark delay (rank-based, not random-per-frame). Stage it (axes, then split, then regroup) per S27. Cost ~ the cost of 2.1.
- Temporal coherence in general: derive all state from t and a fixed seed; no frame-to-frame accumulation except explicit sub-frame sampling (2.14).
### 2.13 Hypothetical outcome plots (HOPs), uncertainty as motion
- Buys: untrained viewers judge trends and orderings better from sampled frames than from error bars/violins (Hullman 2015; Kale 2018) [S28][S29].
- Extensions: NetHOPs for probabilistic graphs (estimates within ~11% of truth) [S30]; 2025 work on animated uncertainty in node-link diagrams [S28 listing];
  a 2025 arXiv "general approach" to uncertainty in statistical graphics [S31] (abstract not read).
- Best: Hullman/Kay/Kale lineage (UW MU Collective) [S28][S29][PK].
- Browser/SwiftShader: YES, trivial and cheap. Fixed seed table of K draws; frame = draw index(t). Hold each draw >= ~0.4-0.5 s (HOPs are slow by design) [PK]; show
  a ghost trail (accumulate the last 4-6 draws at falling alpha) so the distribution emerges. Frame-stepped: draws are a table, not an RNG stream.
- Frontier tell: the uncertainty is a count of draws (e.g. "40 plausible worlds") that the viewer can see.
### 2.14 Motion blur, DoF, temporal supersampling
- Buys: motion blur on fast mark flights keeps identity readable (no strobing) and sells speed; DoF is the focus-pull primitive and a depth cue for 3D scatter.
- Method: accumulation buffer averaging N sub-frame renders at fixed time/lens offsets (Haeberli & Akeley 1990); one method gives AA, motion blur and DoF together [S32].
  Use fixed offsets (not random) so export is repeatable [S32].
- Browser/SwiftShader: YES but multiplies cost by N. With a 0.4 s base frame and N=4 you are at 1.6 s: over budget. Budget N by scene: cheap
  marks-only scenes (0.1-0.2 s) afford N=6-8; or blur only the moving subset in a second pass. Velocity-buffer blur is cheaper but needs an MRT; WebGL2 supports it. Do per-mark
  analytic streaks instead (stretch the quad along velocity = f(t)); costs nothing and is deterministic.
- DoF: three BokehPass-style single pass blur from depth [S10]; p5 has no built-in DoF, framebuffer tutorial shows the pattern [L1 webgl-mode]. One pass ~0.1-0.3 s.
### 2.15 Order-independent transparency
- Buys: dense overlapping translucent marks (distributions, volumes, 100k points) without sort popping between frames (popping is the temporal-coherence killer).
- Best: Weighted Blended OIT (McGuire & Bavoil 2013), needs only MRT + float RTs, adopted by Cesium [S33][S34]; three.js OITPassNode [S9]; layered variant for depth intervals [S34].
- Browser/SwiftShader: YES for WBOIT (2 RTs, one full-screen composite). Float color buffer needs EXT_color_buffer_float (SwiftShader exposes it per WebGL2 [PK, verify with
  gl.getExtension]). Cheaper alternatives: additive blending with tone-map (order-independent by construction) or screen-door/dithered alpha with the accumulation of 2.14.
  For film, additive + exposure curve is the pragmatic frontier look.
### 2.16 Bloom, SSAO, shadow maps, PBR for data
- Buys: bloom isolates a highlighted subset as light, not outline; AO/contact shadows ground bars and terrain so height reads; PBR/IBL makes a material
  (glass, paper, metal) carry meaning (category = material).
- Best: three.js addon passes (UnrealBloom, SSAO, GTAO, Bokeh) [S10]; DCC renders [S13][S15].
- Browser/SwiftShader: bloom YES (threshold + 2-4 blurs at 1/2 to 1/8 res: ~0.1-0.3 s); one shadow map YES (one extra depth pass); SSAO/GTAO MAYBE (many texture
  taps per pixel at full res: expect 0.3-1 s; run at half res or bake AO per instance from height instead); full PBR/IBL NO on stock materials (p5 baseMaterialShader 25 s [L3]);
  YES with a hand-written Lambert + fresnel + analytic AO in 20 lines (0.4 s [L1/L3]).
- Frontier tell: restraint. Exec level is ink and clean (CLAUDE.md): bloom/grain are off at exec level.
## 3. Feasibility matrix (WebGL2, SwiftShader, <= 1.5 s/frame at 960x540 x2, frame-stepped)
| technique | verdict | est. s/frame | note |
|---|---|---|---|
| instanced marks 100k-500k | YES | 0.2-0.8 | small marks, low overdraw, draw-range count-in |
| two-layout morph (same marks) | YES | ~ instances | attribute mix + rank stagger |
| GPU filter/brush by uniform | YES | ~0 | discard in VS/FS |
| additive density splat + tone map | YES | 0.2-0.5 | float RT |
| HOP / draw table with ghost trail | YES | cheap | seed table |
| WBOIT | YES | +0.1-0.3 | MRT + float RT |
| bloom | YES | +0.1-0.3 | downsample chain |
| DoF single pass | YES | +0.1-0.3 | depth texture |
| accumulation motion blur / AA | PARTIAL | xN | N=4-8 only on cheap scenes |
| SSAO/GTAO | PARTIAL | +0.3-1 | half res, or bake |
| full PBR/IBL stock material | NO | 25 s | hand-roll |
| CPU label relaxation | YES | ~0 | pure of t |
## 4. Ranked: the 10 techniques that most separate frontier from ordinary
1. True-scale unit marks (one mark per unit, 100k+, instanced, count-in by t, a caption stating N). Ordinary charts show a bar; frontier shows the population.
2. Same marks, new partition: GPU attribute morph with stable identity and staged order (Heer & Robertson). The reversal is witnessed, not asserted.
3. Authored camera as the argument: dolly from one mark to the field, focus pull to the claim (NYT three-story-controls lineage).
4. Uncertainty as motion: HOP draw tables with a ghost trail and a visible count of draws.
5. Deterministic temporal craft: everything a pure function of t, per-mark analytic motion streaks, rank-based stagger, fixed sub-frame offsets. No popping, no jitter.
6. Order-independent density: additive/WBOIT with exposure tone-map so 100k overlapping marks read as a distribution without sort artefacts.
7. Temporally coherent labels: screen-space, collision- and occlusion-aware, solved as a function of t (no flicker); numbers in the safe face.
8. DoF as a depth cue and focus device (single-pass, cheap), only when depth carries a variable.
9. Data-aware lighting in few lines: hand-written Lambert + analytic/baked AO + one shadow, material = category. Not stock PBR.
10. GPU aggregation / filtering as the narrative device (cells built from unit marks, brush by uniform). Bloom and SSAO rank below this and are garnish.
Excluded: GPU picking (interactive only), WebGPU (not renderable headless here), Niagara/VFX Graph/Houdini (offline DCC: imitate the look).
## 5. Recommendations for this repo
- Build the gl-instances + gl-stack-city lanes first (techniques 1, 2); add a `hop` pattern (4) and a `labels3d` helper (7); gl-post: bloom + single-pass DoF + additive-tonemap, all off at exec level.
- Measure before claiming: the s/frame numbers in 3 are estimates scaled from local measurements, not benchmarks. A one-hour probe of 100k points + WBOIT + bloom at 960x540x2 settles it.
- Open: (a) EXT_color_buffer_float on our Chromium 141 SwiftShader; (b) Microlink reports Mesa llvmpipe (Xvfb + LIBGL_ALWAYS_SOFTWARE=1) several times faster than SwiftShader on geometry-heavy scenes [S36]; vendor claim, worth a local A/B.
## 6. Sources
[S1] deck.gl WebGPU status: https://deck.gl/docs/developer-guide/webgpu ; What's New: https://deck.gl/docs/whats-new
[S2] luma.gl PR 3310, WebGPU picking (merged 2026-10-01): https://github.com/visgl/luma.gl/pull/3310 ; PR 3403: https://github.com/visgl/luma.gl/pull/3403
[S3] GPU aggregation in deck.gl: https://medium.com/vis-gl/gpu-accelerated-aggregation-in-deck-gl-7e2c7d701fb0 ; v9 release: https://openjsf.org/blog/deckgl-v9 ; deck.gl releases: https://github.com/visgl/deck.gl/releases
[S4] Rerun releases (0.34-0.38.1, 2026): https://github.com/rerun-io/rerun/releases ; 0.24.0: https://github.com/rerun-io/rerun/releases/tag/0.24.0
[S5] Rerun 0.13 fast time series: https://github.com/rerun-io/rerun/releases/tag/0.13.0
[S6] regl-scatterplot: https://github.com/flekschas/regl-scatterplot ; paper: https://github.com/flekschas/regl-scatterplot/blob/main/paper.md
[S7] deepscatter via search listing: https://awesome.ecosyste.ms/projects/github.com%2Fnomic-ai%2Fdeepscatter
[S8] Potree: https://github.com/potree/potree/
[S9] three.js OITPassNode: https://threejs.org/docs/pages/OITPassNode.html
[S10] three.js postprocessing pass overview (secondary): https://www.skills.sh/cloudai-x/threejs-skills/threejs-postprocessing
[S11] troika-three-text: https://cdn.jsdelivr.net/npm/troika-three-text@0.52.4/README.md ; three-text-renderer: https://github.com/horizon-games/three-text-renderer
[S12] Niagara/VFX Graph GPU particle counts (tutorial-grade): https://www.rebelway.net/unity-vs-unreal-engine/ ; https://altheragames.com/en/blog/ue5-niagara-vfx-guide
[S13] IEEE VIS 2020 Houdini scivis: https://content.ieeevis.org/year/2020/event_t-scivishoudini.html ; Entagma flight paths: https://lesterbanks.com/?p=47530
[S15] Blender node charts: https://blenderrenaissance.gumroad.com/l/node-charts-for-blender
[S16] Blender GN workshop Sept 2026: https://code.blender.org/2026/10/geometry-nodes-workshop-september-2026/ ; GN motion graphics: https://whoisryosuke.com/blog/2025/geometry-nodes-for-motion-graphics/
[S17] NYT three-story-controls: https://github.com/nytimes/three-story-controls
[S19] Chez Voila, "500,000 dots is too many": https://chezvoila.com/blog/500k/
[S20] Kurzgesagt workflow transcript (2019): https://www.lingq.com/en/learn-english-online/courses/689474/how-to-make-a-kurzgesagt-video-in-120-4887128/
[S21] DataFilterExtension: https://github.com/uber/deck.gl/blob/master/docs/api-reference/extensions/data-filter-extension.md ; Kepler.gl roadmap: https://github.com/keplergl/kepler.gl/wiki/Kepler.gl-2019-Roadmap/8945b460c921bb2909eaf504be14c5def0f71899
[S22] Bokeh WebGL: https://docs.bokeh.org/en/1.4.0/docs/user_guide/webgl.html
[S23] ManimGL vs CE: https://nibble-app.com/blog/manim ; https://slama.dev/manim/6
[S24] Vaaraniemi, temporally coherent real-time labeling: https://www.cs.cit.tum.de/fileadmin/w00cfj/cg/Research/Publications/2012/Force_Labeling/2012_Vaaraniemi_Temporally_Coherent_Real-Time_Labeling_of_Dynamic_Scenes.pdf
[S25] External labelling survey https://arxiv.org/pdf/1902.01454 ; Enhancing visibility of labels in 3D: https://www.cs.cit.tum.de/fileadmin/w00cfj/cg/Research/Publications/2012/Enhancing_Visibility/2012_Vaaraniemi_Enhancing_the_Visibility_of_Labels_in_3D_Navigation_Maps.pdf
[S27] Heer & Robertson 2007: https://homes.cs.washington.edu/~jheer/files/2007-AnimatedTrans-InfoVis.pdf ; https://idl.uw.edu/papers/animated-transitions
[S28] HOP overview / 2025 listings: https://medium.com/hci-design-at-uw/hypothetical-outcomes-plots-experiencing-the-uncertain-b9ea60d7c740 ; https://arxiv.org/pdf/2411.10482
[S29] Kale et al., HOPs help untrained observers: https://www.researchgate.net/publication/327132239_Hypothetical_Outcome_Plots_Help_Untrained_Observers_Judge_Trends_in_Ambiguous_Data
[S30] NetHOPs: https://arxiv.org/abs/2108.09870
[S31] General approach to uncertainty in statistical graphics: https://arxiv.org/pdf/2508.00937
[S32] Accumulation buffer (Haeberli & Akeley): https://www.microsoft.com/en-us/research/publication/the-accumulation-buffer-hardware-support-for-high-quality-rendering/ ; deterministic weights: https://web.engr.oregonstate.edu/~mjb/cs553/Handouts/Accum/accumbuffer.2pp.pdf
[S33] McGuire & Bavoil WBOIT: https://www.jcgt.org/published/0002/02/09/paper.pdf
[S34] Cesium on WBOIT: https://cesium.com/blog/2014/03/14/weighted-blended-order-independent-transparency/ ; layered WBOIT: https://graphicsinterface.org/wp-content/uploads/gi2021-22.pdf
[S36] Microlink, WebGL without a GPU (vendor claim): https://microlink.io/blog/webgl-without-a-gpu
[L1] /home/user/ceti-explainer/references/atlas/pages/{frontier-2026,gpu-instancing,webgl-mode}.md  [L2] /home/user/ceti-explainer/arsenal/WAVE-GL.md  [L3] SwiftShader measurements in repo notes (grep "SwiftShader")
