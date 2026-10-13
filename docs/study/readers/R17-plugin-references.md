# R17 - ceti-p5-studio plugin references (read-only review)

Scope: all 24 files in `up6-references/references/`, plus `up3/modules/OPERAD.md` for the module-operad question.

## 1. doctrine.md (seven rules)
1. Never ask the user for technical values. Infer, state one assumption line, proceed. Ask only at publish, overwrite, spend, or when two readings would yield different artworks.
2. Render or it did not happen. No output adjective without a headless render in the same turn. Claims carry a rung: V0 linted, V1 computed, V2 rendered headless, V3 judged by independent seats, V4 human-confirmed.
3. Too common is a failure. Diverge first with typicality estimates, then choose a low-typicality approach that fits. Judge cliche across the batch.
4. The system is the artwork. Judge the worst seed; record seed and parameters; re-render byte-identically.
5. Evaluator is not builder. Isolated seats rank pairs; disagreement goes to the human, never averaged.
6. Never weaken a gate, never supply a fact. Re-baseline only with a recorded reason. Encoded data is cited or declared invented.
7. It compounds. Every run leaves an atom, tells row, ledger line or twin; uncatalogued capture does not count.
Also: reader copy avoids hype words; measured facts are stated apart from judgements; never imitate a living artist's signature style.

## 2. studio-habits.md (house defaults to avoid)
Machine-read by series.py: H1 cream paper, hairline ink, one vermilion accent (6/8 cream, 4/8 vermilion); H3 CETI-dark #0E1014 as the only dark.
Judged: H2 seed changes one thing, fixed layout (6/8); H4 stacked horizontal rules (3/8); H5 fixed-pixel constants that break `?w=` scaling (6/8); H6 framed object on a large empty page with a hard left margin (5/8).

## 3. anti-patterns.md and tells.md
**Anti-patterns.** A1 rainbow HSB cycle; A2 black ground, thin neon lines; A3 Perlin flow with no composition; A4 centred single object; A5 uniform random() everywhere; A6 no hierarchy; A7 default 400x400 canvas; A8 frame-rate-dependent motion; A9 glow stacking as form; A10 noise-wobbled ring; A11 identical grid cells; A12 low-alpha trails; A13 pure RGB or default colours. B1 1.x API in 2.x; B2 mode collapse to ~5 techniques; B3 unrendered aesthetic claims; B4 no seed control; B5 feature stacking; B6 monolithic draw(); B7 narrating comments; B8 training-default palettes; B9 ignores negative space; B10 single shot; B11 scope shrinks after errors; B12 silent misuse that still renders; B13 empty "interactive" handlers; B14 motion/still mismatch. C1 per-pixel CPU loops; C2 get() readback churn; C3 pixelDensity multiplies work; C4 draw-call ceiling; C5 WebGL beginShape per frame; C6 per-frame text; C7 allocation churn; C8 frameRate is not a clock; C9 createGraphics as texture; C10 unbounded arrays; C11 huge print canvases; C12 FES overhead. D1 no iteration; D2 no seed curation; D3 no constraints; D4 novelty for its own sake; D5 variety without coherence; D6 de-skilling; D7 Hello World read as mature.
**Fingerprints (25).** 1 Perlin uniform coverage; 2 trails on black; 3 rainbow HSB; 4 noise ring; 5 Truchet rotation; 6 touching circle packing; 7 mandala; 8 Lissajous; 9 phyllotaxis; 10 Mondrian splits; 11 boids; 12 Game of Life; 13 Gray-Scott; 14 metaballs; 15 Voronoi; 16 L-system trees; 17 sin(x+y+t) grid; 18 random walk; 19 normalMaterial torus; 20 glitch RGB shift; 21 noise terrain mesh; 22 stipple halftone; 23 neon cyan/magenta; 24 indigo gradient; 25 monospace HUD. Rule: 3+ in one sketch, or the same top two in over 60% of a batch, is common.
**Limits.** About 3.6k shape calls at 60 fps; readback, density and texture-size cliffs; each has an exit (q5.js, Pixi, shaders, three.js, vpype).

**Tells** (numbers as in file):
1 2.3.4 dies before setup without meta charset. 2 GitHub main docs APIs absent from 2.3.4. 3 RGBHDR/linesMode are RGBP3/strokeMode. 4 strands closures vanish. 5 getFinalColor is (vec4, vec2). 6 p5.sound 0.4 analyze() is 0-1, FFT 32 bins. 7 p5.js-svg throws under 2.x. 8 inlined `</body>` in p5. 9 `</script>` in a comment. 10 lint-clean can be oatmeal. 11 models collapse to ~5 techniques. 12 VLM judges rank better than they score. 13 oatmeal metric is scale-dependent. 14 shared manifest leaked intent to seats. 15 eight gated pieces shared one house look. 16 --intent invariants never checked. 17 sparse art misread as texture. 18 loop never played live. 19 p.push() false positive. 20 export frames used advanced streams. 21 textToContours ignores fontSize. 22 woff2 rejected; use WOFF. 23 WEBGL text shows tofu for U+2007. 24 SwiftShader 2D canvas 3-9 s/frame. 25 baseMaterialShader 25 s/frame vs GLSL 0.6 s. 26 uTint owned by p5; premultiplied alpha loses data. 27 live readout spoils predict-commit-reveal. 28 big shader with early returns 5.5 CPU-s. 29 dFdx after discard non-deterministic; FBO y-flip. 30 raw clip() desyncs stroke state. 31 render.py hung on stalled worker. 32 build.py id from first match. 33 score()/meta() run before setup. 34 no clipPlane in 2.3.4. 35 errors in one run teach 0.05k, not 0.95^k. 36 numbers before commit anchor the guess. 37 lucky seeds invert small-N lessons. 38 eight chromes share a house look. 39 inverse task degenerate when p is uniform.

## 4. technique-atlas.md
The atlas has no p5 API column; API hints are mine. Cost is per still at about 1080 px, CPU unless noted. Cliche 1 (rare) to 5 (default).
- **Low:** 2 Perlin (5), 3 domain warp (4), 5 subdivision (4), 6 Truchet (4), 8 L-system (3), 24 wallpaper (2), 27 image fields (3), 30 polar (4), 31 Schotter grid (5), 32 Lissajous (4), 40 constraint (1), 42 data-driven (3). API: noise()/noiseSeed, rect/arc/line, recursion.
- **Mid:** 1 flow fields (5), 4 packing (4), 7 WFC (3), 9 colonisation (2), 14 boids (4), 16 attractors (3), 17 Voronoi (4), 19 hatching (3), 22 cracks (3), 23 cellular automata (4), 28 dither (3), 29 marching squares (3), 33 typography (3; textToContours), 34 stroke sim (3), 35 string art (3), 36 fracture (3), 39 collage (2).
- **High CPU:** 10 differential growth (3), 12 DLA (3), 15 particles (5), 18 stippling (3), 20 watercolour (4), 21 sand (3), 37 non-circle packing (2).
- **High CPU, low GPU:** 11 Gray-Scott (4), 13 physarum (3); FLOAT framebuffers.
- **GPU:** 25 SDF raymarch (4), 26 feedback (3; ping-pong framebuffers), 15 at 10^6 (compute, WEBGPU, 2.3). **Very high:** 38 genetic search (2). **WebGPU only:** 41 splats (1).
Edge table: common pairings score 4-5; under-explored pairings score 1-2 and still type-check.

## 5. operad.md
- **Objects (13):** Canvas, Stream, Palette, Field, Regions, Points, Paths, Glyphs, Signal, Layer, Frame, Time, Index.
- **Operations (17):** Enumerate, Select, Judge, Frame, Ground, Field, Partition, Typeset, Place, Grow, Mark, Mask, Listen, Post, Compose, Animate, Export. A sketch is a tree rooted at Export ∘ Animate ∘ Compose(...), declared as `Units:`.
- **Laws:** (1) typing: f ∘ᵢ g needs matching colours; (2) sequential associativity: a refactor must keep the frame hash; (3) disjoint slots commute, so disjoint lanes build in parallel; (4) stream independence: changing colour never moves a point; (5) downstream immutability: resolved slots change only by named edit.
- **Algebras:** Render, Typicality (1-5, pair co-occurrence), Cost (summed ms), Determinism (weakest link), Evidence (union), Accessibility (max risk).
- **Typicality rule:** at least one load-bearing edge at most 2; the mean of the top three at most 3.5.
- **Edits (11):** SwapTechnique, Reweight, Silence, Graft, Reframe, Revalue, Subtract, Repose, Retime, Reallocate and others. Precedence: accessibility, brief, originality, preference. OC check: total collapse versus decomposition; calibration, not truth.
- **Module operads:** not described here. `up3/modules/OPERAD.md` says it extends this operad and keeps its laws. Colours become pedagogical (Number, Commit, Ensemble, Material); operations become teaching beats; each film draws through one Material, which plays the Mark ∘ Compose role. It adds 18 composition laws (TYPE, SEED, P1-P12, MAX, CAP, INV, CLOCK, HOUSE, BELIEF, LEGIBLE). Hard laws throw; soft laws need a written waiver.

## 6. lineage.md, eval-stack.md, integration.md
**Lineage.** From Galanter's "cession of control" (2003) and LeWitt (1967) through Schotter (1968) and Molnar's "1% disorder", to Processing (2001), p5 (2013), Hobbs (2014-21), Compton's oatmeal essay (2016), Art Blocks (Nov 2020), Fidenza (June 2021, 999 editions) and *The Goose* ($6.2M, June 2023). Three postures (perturbed order, exhaustive rule, encoded judgment) are the menu.

**Eval stack.** Six layers, each can veto: mechanical, lint, metrics, seed sweep (8 dev, 32 series, 64+ release), series HOUSE-LOOK, seats, human. gate.py returns FAIL, COMMON or CANDIDATE. Seven seats (Composition, Colour, Craft, adversarial Cliche hunter, Intent fit, advisory Wonder, Metric auditor); minimum panel is Cliche, Composition, Colour. Seats are isolated and judge pairwise with swap; aggregate by minimum, log disagreement. Metric bands are priors (fractal D 1.3-1.5); re-fit after about 200 renders.

**Integration.** Three host contracts: tokens in, never hex; `Studio.host(p, {clock, setState, still})` exposing `window.__sketch.renderAt(t)`, pure in t; polite pages (pause off-screen, pixelDensity(1), reduced-motion still, at most 3 flashes/s, low contrast). Bridges to ceti-explainer, motion-media-l2, field-story, silver-hero-engine and others. Conflict: CETI ease (0.22, 1, 0.36, 1) versus milton/Glaser (0.34, 1.56, 0.64, 1).

## 7. meta-prompt.xml
Root `<meta_prompt name="p5-studio" version="0.1.0">` with five blocks. **system:** a studio, not a code generator; doctrine.md overrides. **slots:** INTAKE (Prompt, Purpose, Medium, Surface, Format, Audience, Brand, Constraints); CONCEPT (Intent; Posture, one of three; Divergence, five approaches with probabilities; Choice; UnitTree; Streams; Palette; Invariants; Flex; Lineage); FORGE; GATE/CRIT; SHIP/CAPTURE. **procedure:** nine phases, INTAKE to CAPTURE, with WITNESS requiring the tree to restate the Intent and REVISE capped at three passes. **rules** (six), **output_contract** and **self_check**. It produces sketch-level concepts, not the Atelier art directions.

## 8. tokens/presets.js
Four presets on `window.STUDIO_PRESETS`, all hex:
- **ceti-dark:** ground #0E1014; ink #F5EFE3, dim #A39A89, copper #CE9A6A, sage #8FA985, support #6E8CA8.
- **ceti-paper:** ground #F5EFE3; deep-sea #1A1F2E, copper #A67756, sage #7A9171, rust #8C4A2E, slate #324555.
- **ceti-silver:** ground #1C1720; ink #F2EBE0, gold #d4a84b (single light), dim #6b6170.
- **glaser-paper:** ground #FAF7F2; ink #1A1916, vermilion #D1422A, cobalt #2D5BA9, sunflower #E8B53C, forest #3B6E47.

## 9. p5/*.md checklist (p5 2.3.4)
- **Contract:** meta charset first; pin p5@2.3.4; studio.js after it; instance mode; Studio.begin, streams, Studio.harness in setup; Studio.frameDone at end of draw; scene built as data in setup; motion pure in t or fixed-dt; no millis()/frameCount in exports; OKLCH chroma on 0-150.
- **Async:** `async setup()` with await; never preload(); never async draw. Removed: createStringDict, append, sort, splice, subset and similar.
- **Shapes and text:** curveVertex to splineVertex; bezierVertex one point per call; bezierOrder(2); buildGeometry replaces beginGeometry; mouseButton.left; UP_ARROW is a string; touch handlers gone; textWidth is tight (fontWidth for layout); font methods on p5.Font; createVector(0, 0) explicit; strokeMode, RGBP3, P2DP3.
- **Strands:** callbacks recompiled with new Function, so closures are lost; pass a scope; prefix p.* and pass {p} in instance mode; getFinalColor takes (vec4, vec2); call inspectHooks(); build in setup only.
- **Framebuffers:** createFramebuffer; FLOAT plus NEAREST for data; ping-pong through a mutable holder; WEBGL origin is centre; glow by screen composite, not blendMode(ADD).
- **Sound:** p5.sound 0.4.1 on Tone; analyze() is small 0-1; FFT is 32 bins and hears only connected input; userStartAudio on a gesture; raw Web Audio is lighter.
- **Export:** saveCanvas tested; raise pixelDensity for print; tile past 8192 px (SwiftShader); p5.js-svg is broken, use geometry-first SVG; video is deterministic stepping plus ffmpeg.
- **Performance and embedding:** pixelDensity(1) for work; FES can slow sketches about 10x, so ship p5.min.js; WEBGPU does not render headless; buildGeometry plus model(g, N); @p5-wrapper/react 5 needs p5 at least 2 and React at least 19; a throwing setup leaves the spinner, so screenshot only after window.__done.
- **Compatibility:** p5.js-svg 1.6.0 is broken; p5.sound, saveGif and p5.capture work.

## Core ideas that should survive into a master plugin
- Doctrine rules 1-7, the V0-V4 ladder, and counted-versus-judged reporting.
- Diverge before converging: typicality, batch-level cliche judgement, the fingerprints and the 3-hit rule.
- The operad: typed ports, the five laws, named edits and their precedence.
- Eval: gates veto, minimum over seats, isolated seats, disagreement as a finding, metric bands as priors.
- The host contract: pure render(t), instance mode, roles from tokens. The p5 2.3.4 gotcha list.
- The compounding ledger and numbered tells; the posture trichotomy.
- Module-operad principles: one Material per film, the Belief law, hard versus soft laws.

## Experiment-specific choices
- CETI palettes, Silver gold, the ease-curve conflict, and the presets file.
- Studio-habit rows H1-H6 (gallery-v1 evidence).
- The 42-technique cliche scores and edge table, a learned prior for this studio.
- Run-specific numbers: seed counts, 200-render re-fit, 3.6k primitives, SwiftShader timings (tells 24-28).
- Atelier pedagogy laws (MAX, INV, P1-P12) and the eight art directions.

## Duplicated by Atelier docs (keep one copy on merge)
- tells rows 22, 33, 35, 36, 38, 39 restate Atelier lessons from runtime README "Notes from wave 1", ART-DIRECTION-v1 section 0.1, modules check.mjs (P1, INV) and REVISE.md. Keep the tells row and link to it.
- operad.md versus `atelier/modules/OPERAD.md`: the module file is a documented extension. Keep operad.md as base.
- tokens/presets.js versus Studio.presets in runtime/studio.js, which has the OKLCH values. Keep the OKLCH copy.
- Likely overlaps, unchecked here: doctrine's banned-defaults material versus atelier.md; eval-stack seats versus Atelier consult and crit seats.
- Outside Atelier: p5/*.md restates research uploads 01 and 04; lineage, anti-patterns, eval-stack and integration restate uploads 02, 03, 05 and 06.

## Flags
- Edge limit: operad.md says at most 2; meta-prompt says at most 2.5. "Typicality" is a probability in meta-prompt and a 1-5 score elsewhere.
- presets.js header claims OKLCH values; every value is hex.
