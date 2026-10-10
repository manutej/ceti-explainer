# R-D · the visual moves of the best data explainers, 2024-2026 · and what needs GPU 3D · 2026-10-10

Method and honesty note. Search-only research (WebSearch extended). WebFetch could not resolve any host from this sandbox
(getaddrinfo ENOTFOUND), so no page was opened in full: every claim below rests on search-result text and abstracts. Each
source in section 4 is tagged V (finding seen in result text), S (secondary report only) or U (named from memory, not
verified here). Searches for Reuters Graphics, NYT, FT, Bloomberg, Apple keynote, Stripe and Linear returned NO
piece-level evidence, so those houses appear as U exemplars only, and no technique is attributed to them as fact.

## 0. Bottom line (read this if nothing else)

1. Most of the comprehension evidence supports 2D moves: object-constant re-partition, unit marks, frequency-framed
   uncertainty, term-bound formulas, slow-in/slow-out. None of these need a GPU.
2. Evidence on 3D is split: immersive 3D data stories were rated MORE interesting and persuasive, NOT more understandable
   or trustworthy, and some readers found them disorienting or manipulative (Kim et al. 2024/25 [S1]). Depth cues in bar
   charts cost little accuracy at moderate gaps but distort values next to neighbours [S2]. So GPU 3D earns its place
   only where (a) the mark count is too large for 2D, (b) the claim is about scale or place, or (c) the camera move IS the
   argument. Everything else should stay flat and exec-clean (law: exec level is ink and clean).
3. WAVE-GL is strong on the GPU half and silent on the perception half. The five largest gaps (section 3) are all 2D.

## 1. Moves table

GPU key: 2D = flat canvas is enough; 2D+ = 2D logic but WebGL batching needed above ~50k marks; 3D = perspective camera,
depth or lighting is what makes it land. "Arsenal" = nearest existing module (README rows or WAVE-GL lanes).

| # | move | what it does for understanding | best at it (link) | needs | arsenal today |
|---|---|---|---|---|---|
| M1 | Object constancy: the same marks re-partition (pooled to split, stack to ring) | Viewers track identity through a change; animation improved object tracking and semantic reading of bar/pie/scatter transitions, provided each in-between frame stays a valid graphic (congruence) [S3][S4]. Misuse: morphing into an unrelated object asserts a false relation [S3] | Observable song-dots to beeswarm to stacked area story [S5]; Pudding dot stories [S6]; Simpson/mix-effect comets [S7] | 2D (3D adds nothing; stack-city is a stylistic choice) | structures.js transitions; WAVE-GL gl-stack-city |
| M2 | One mark per unit at true scale (a dot is a person) | Unit marks keep each item's identity and let counting replace estimating; icon arrays help low-numeracy readers read risk [S8][S9]. Evidence is mixed vs bar charts [S10], and irregular shape variability biases proportion [S11] | Pudding "Unlikely Odds of Making It Big" (one dot per band) [S6]; Pew 2025 dots-in-bars [S12] | 2D to ~50k; 2D+ beyond; 3D only for place-bound crowds | patterns/mass; gl-instances |
| M3 | Camera-as-argument: the reveal is a viewpoint change | Story-driven cameras, resolution of scale and anthropocentric view are the four cinematic techniques in a 50-piece analysis [S13]; zoom-in changes topic to one target [S14]; data videos code camera/attention cues [S15] | Ciechanowski Moon (camera lock, orbit sliders) [S16]; NYT pile-zoom example cited in [S13] (S for NYT detail) | 3D for true parallax/orbit; 2D for map/timeline pans | patterns/camera (2D), webgl-scene; gl-camera-rig |
| M4 | Annotate-then-zoom (point, then enter the thing pointed at) | Staging: attention cue first, then viewpoint change keeps the viewer oriented; Rosling labelled quadrants before play, replayed after pause [S17]; Munzner: animation suits transitions between two configurations [S5] | Gapminder 200 Countries [S17]; 3Blue1Brown camera.frame zooms on a formula [S18] | 2D | annotations + camera + transitions zoom-through |
| M5 | Uncertainty as animation (hypothetical outcome plots, HOPs) | Viewers integrate across draws by counting: HOPs gave far more accurate judgments than error bars/violins for 2-3 quantities, and helped untrained observers judge trends [S19][S20]. Fast hard cuts (about 100-400 ms) beat smooth tweens, which hurt probability judgment [S20][S21] | UW IDL/Northwestern MU Collective work [S19][S20]; Pudding/NYT "needle" style (U) | 2D | none (gap) |
| M6 | Frequency-framed uncertainty (quantile dotplot, 20-50 dots) | About 1.15x lower estimation variance than a density plot; better transit decisions [S22][S23] | Kay et al. bus display [S22] | 2D | partly mass/data-marks (no quantile layout) |
| M7 | Part-to-whole morph (waffle to bar to pie, unit to aggregate and back) | Chart-type transitions kept readers oriented when congruent [S3]; unit visualizations preserve identity where aggregation destroys it [S24] | Observable tweening examples [S5]; Atom grammar [S24] | 2D | structures (grid/ring/columns); no chart-type morph |
| M8 | Count then ratio (counts on screen before any percentage) | Natural-frequency framing beats single-event probability; icon arrays remove denominator neglect [S8][S25] | Icon-array risk literature [S8]; CETI law | 2D | law + explorable commit; no numerator/denominator lamp |
| M9 | Kinetic numbers (a ticker slaved to what is drawn) | Ties digit to evidence; a claim is visible being built. Attention cues are one of the coded dimensions in data videos [S15] | 3Blue1Brown, Kurzgesagt, Apple keynote (U) | 2D | morph-type number-ticker; count(t) hooks |
| M10 | Depth separates layers of an argument (evidence plane vs claim plane, focus pull) | Spatial-immersion design patterns (camera, realism, dynamic 2D/3D switch) raise interest and persuasion, not understanding [S1]; depth also adds disorientation risk | Bloomberg/Reuters/NYT 3D stories (U); FT CT-scan 3D models (S: job listing) [S26] | 3D (DoF, parallax are the point) | glyphs-iso floors; gl-post DoF; gl-camera-rig |
| M11 | Resolution of scale: continuous zoom from one unit to the whole, against a human-scale anchor | Kurzgesagt keeps every comparison next to the human body so magnitude survives, unlike Powers of Ten [S27]; "anthropocentric perspective" and "resolution of scale" are named cinematic techniques [S13] | Kurzgesagt size videos [S27]; Veritasium scale-of-universe video [S28] (technique U) | 2D+ (log zoom of a dot field) ; 3D for place scenes | camera + mass; no human-scale anchor |
| M12 | Term-bound formula: symbols keep colour as they travel into the diagram that computes them | Congruence: format of the graphic matches the concept [S29]. manim's TransformMatchingTex/Shapes moves matched glyphs rather than cross-fading [S18] | 3Blue1Brown [S18][S30] | 2D | morph-type word-to-word; particles-text; no term matching |
| M13 | Trails and ghosts (history stays visible) | Gapminder trails show paths of countries; no controlled study found [S31]. Robertson 2008: animation fastest to enjoy, WORSE than small multiples for analysis; so animate to show, then freeze [S32] | Gapminder/Rosling [S17][S31] | 2D | layers freeze layers (partial) |
| M14 | Temporal distortion: slow-in/slow-out, slow the crowded stretch | Slow-in/slow-out beat constant speed for tracking; adaptive slowing best when scene is complex [S33]. Staggering adds little or hurts tracking [S34] | Heer lab Gemini [S4]; Rosling pause-and-replay [S17] | 2D | core easing; rhythm; timeline stagger (see risk) |
| M15 | Foreshadowing: preview where the animation is going | Visual foreshadowing raised engagement in animated rankings (user study) [S35] | Li, Wang, Zhang, Qu VIS 2020 [S35] | 2D | none (minor) |
| M16 | Cutaway / section plane / terrain from a matrix | Reads magnitude as height with a cut that exposes inside structure; 3D surface perception is task-dependent [S2] | NYT/Bloomberg terrain stories (U) | 3D | gl-heightfield, gl-volume |
| M17 | Scrolled or stepped narrative (reader drives the playhead) | Engagement up; comprehension equal to other formats (privacy-policy study, 2026) [S36]; navigation feedback matters, control level may not [S37] | The Pudding, FT scrolly component (S: npm) [S6][S38] | 2D | the scrubbable player already is this; nothing to add |

## 2. Where GPU 3D is truly what makes it land

| earns GPU | why 2D fails | move |
|---|---|---|
| 10^5 to 10^6 marks that must stay individually addressable while the camera moves | Canvas 2D drops frames; software GL ~0.4 s/frame is the repo's budget | M2, M11 (2D+: instanced sprites; perspective NOT needed) |
| Camera dolly/orbit whose parallax carries the claim ("this pile is taller than the building") | A 2D zoom cannot show occlusion or relative depth | M3, M10 |
| Spatial or physical subject (a place, an object, an orbit) | Flattening loses the fact (Ciechanowski moon phases need the lit sphere) [S16] | M3 |
| Depth-of-field/bloom as a pacing device (the reveal as a moment) | Faked blur in 2D is costly and weak | M10 (exec level: off) |
| Terrain/volume where the third axis is real (distribution tails, cost surfaces) | 2D heatmap loses shape; but readers read values worse in perspective [S2] | M16 |

Does NOT earn GPU: object constancy, HOPs, quantile dots, term-bound formulas, trails, kinetic numbers, annotate-then-zoom,
count-then-ratio. These are where the evidence for understanding sits. Rule of thumb for the factory: if a move cannot be
justified by one of the five rows above, ship it flat.

## 3. Gap list against the arsenal (ranked)

Compared with the eight WAVE-GL lanes (gl-instances, gl-heightfield, gl-ribbons, gl-pointcloud, gl-stack-city,
gl-camera-rig, gl-post, gl-volume) and the 24 README modules (shader, annotations, camera, data-marks, explorable, fields,
generator, glyphs-iso, grid-type, handwriting, layers, maps-matrices, mass, materials-demo, morph-type, palette,
particles-text, physics, reveal, rhythm, structures-demo, timeline, transitions, webgl-scene). On disk today:
gl-instances, gl-heightfield, gl-pointcloud, gl-post exist; gl-ribbons, gl-stack-city, gl-camera-rig, gl-volume do not yet.

Ranking = (strength of understanding evidence) x (fit to the laws) x (nothing in the arsenal does it) / cost.

| rank | missing move | why it ranks here | proposed lane | needs |
|---|---|---|---|---|
| 1 | M5/M6 HOPs plus quantile dotplot | Strongest evidence, perfectly pure: draw k = floor(t*rate) indexes a seeded sample table, so re-seek is identical. Pairs with the "viewer commits a number first" law: show the HOP, THEN ask for the estimate. Hard cuts, not tweens, by evidence | uncertainty-hop (hop + qdots + fading-ensemble variants; count(t) = draws shown) | 2D |
| 2 | M12 term-bound formula morph | Law "every digit is a claim with a formula or source" has no visual carrier: colour-bind each symbol to the mark set it counts, then fly the matched terms. morph-type does word-to-word only | formula-bind (TransformMatchingTex-style; colours from tokens.color roles) | 2D |
| 3 | M1 follow-one-mark and congruence guard | stack-city/structures re-partition, but nothing tags one unit and traces it through pooled to split, nor checks that each in-between frame is a valid chart (Heer and Robertson congruence). This is the Simpson move done honestly | track-unit (tag, comet trace, ghost origin; lint that mid-frames keep area and count) | 2D, reused by stack-city |
| 4 | M11 human-scale anchor plus continuous log zoom | gl-instances gives the crowd; nothing keeps a body, door or car on screen as the scale reference, or zooms 1 dot to 10^5 with LOD. Conlen/Kurzgesagt both rest on this [S13][S27] | scale-anchor (silhouette set, ruler tick, log-zoom with LOD, count(t)) | 2D+ ; 3D optional |
| 5 | M8 numerator/denominator lamp | Count-then-ratio is a law with no module: light the numerator marks inside the full counted grid, then the fraction. Natural frequencies and icon arrays are the evidence [S8][S25] | ratio-lamp (two-stage: count, subset lights, only then the digits) | 2D |
| 6 | M13 trails and freeze-to-compare | Robertson 2008: animation loses to small multiples for analysis; pattern is animate, then leave a ghost trail or snap to facets. layers has freeze layers only [S32] | trails (ghost path, end-state facet split) | 2D |
| 7 | M7 chart-type morph | structures lays out grids and rings; no waffle to bar to pie to line with valid mid-frames | morph-chart | 2D |
| 8 | M14 adaptive pacing | Cheap: slow the crowded frames, drop staggering where tracking matters [S33][S34]. timeline stagger could mislead if used on tracked marks | rhythm variant: slow-where-crowded; doc warning on stagger | 2D |
| 9 | M15 foreshadowing | Small engagement win; ghost the next state for 0.3 s | annotations variant | 2D |
| 10 | M4 world-anchored annotation through a zoom | Likely already covered by world-to-screen pins; verify scale-invariant stroke and label persistence | test in gl-camera-rig | 2D/3D |

Frontier GPU moves NOT in WAVE-GL, and why that is fine: none found with comprehension evidence. Candidates seen (mesh
morph of real objects, CT-scan models in FT work [S26], photogrammetry) need assets and break "no runtime fetches" and the
exec-clean law; skip.

Risks the research raises for the planned lanes:
- gl-post and gl-camera-rig produce persuasion, not understanding [S1]. Keep exec level off by default (matches WAVE-GL).
- gl-heightfield and gl-stack-city invite value reading in perspective; keep the count and a flat top view captioned [S2].
- timeline stagger is a default in the arsenal; staggered transitions showed negligible or negative tracking effect [S34].
- Smooth tweening between HOP frames reduces probability judgment [S20][S21]; do not run uncertainty through the tween engine.

## 4. Sources

V = result text seen; S = secondary report only; U = from memory, unverified here.
S1  V  Kim, Lee et al., "Understanding the Impact of Spatial Immersion in Web Data Stories" (KAIST/Adobe), arXiv 2411.18049: https://arxiv.org/abs/2411.18049
S2  V  Digital 2024 "Interpreting Bar Charts: Effects of 3D Depth Cues on Gaze and Understanding": https://doi.org/10.3390/digital4040046 ; MeasuringU 2D vs 3D bars: https://measuringu.com/comparing-3d-2d-bar-graphs/ ; Just Noticeable Differences in 2D/3D bars: https://www.researchgate.net/publication/389498337_Just_Noticeable_Differences_in_2D_and_3D_Bar_Charts_A_Psychophysical_Analysis_of_Chart_Readability
S3  V  Heer and Robertson, "Animated Transitions in Statistical Data Graphics", TVCG 2007: https://dl.acm.org/doi/10.1109/TVCG.2007.70539 (PDF https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/InfoVis2007-DynaVis.pdf)
S4  V  Gemini: grammar/recommender for animated transitions: https://arxiv.org/pdf/2009.01429
S5  V  Observable, "Five ways to effectively use animation in data visualization": https://observablehq.com/blog/effective-animation
S6  S  The Pudding: https://pudding.cool/ ; "Unlikely Odds of Making It Big" breakdown: https://scrollytell.ing/the-pudding-series-the-unlikely-odds-of-making-it-big/ (date and WebGL use not confirmed)
S7  V  Armstrong and Wattenberg, mix effects and Simpson's paradox, comet charts: https://research.google.com/pubs/archive/42901.pdf
S8  V  Galesic, Garcia-Retamero, Gigerenzer 2009, icon arrays and low numeracy: https://pure.mpg.de/rest/items/item_2099767_4/component/file_2562291/content
S9  V  Icon arrays vs bar charts for risk (2025): https://arxiv.org/pdf/2509.16465
S10 V  Icon array vs bar graph randomized study, PLOS ONE 2021: https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0253644
S11 V  Markant 2026, shape variability biases icon-array proportions: https://onlinelibrary.wiley.com/doi/10.1111/cogs.70227
S12 V  Pew Research, favourite visualizations of 2025: https://www.pewresearch.org/short-reads/2025/12/15/our-favorite-data-visualizations-of-2025/
S13 V  Conlen, Heer, Mushkin, Davidoff, "Cinematic Techniques in Narrative Visualization" (50 examples, four techniques): https://arxiv.org/abs/2301.03109 ; site https://cinematic-visualization.github.io/
S14 V  GeoCamera, camera movements in geographic stories: https://dl.acm.org/doi/10.1145/3544548.3581470
S15 V  Amini, Riche, Lee, Hurter, Irani, "Understanding Data Videos" CHI 2015 (50 videos, attention cues): https://dl.acm.org/doi/10.1145/2702123.2702431
S16 V  Ciechanowski, Moon (17 Dec 2024): https://ciechanow.ski/moon/ ; coverage https://flowingdata.com/2025/01/10/phases-of-the-moon-visually-explained/ ; rendering stack not confirmed
S17 S  Gapminder "200 Countries, 200 Years" analysis: https://chezvoila.com/blog/rosling2/ ; https://www.statlit.org/Video1.htm
S18 V  manim (3b1b) what's new: CameraFrame replaces ReconfigurableScene; TransformMatchingShapes/Tex: https://3b1b.github.io/manim/getting_started/whatsnew.html
S19 V  Hullman, Resnick, Adar, PLOS ONE 2015, HOPs: https://idl.cs.washington.edu/files/2015-HOPs-PLOS.pdf
S20 V  Kale, Nguyen, Kay, Hullman, TVCG 2018 HOPs for trends: https://dl.acm.org/doi/abs/10.1109/TVCG.2018.2864909
S21 S  Padilla, Kay, Hullman, Uncertainty Visualization (frames under 500 ms; smooth transitions harm): http://space.ucmerced.edu/Downloads/publications/Uncertainty_Visualization_Padilla_Kay_Hullman_2022.pdf
S22 V  Kay, Kola, Hullman, Munson, "When (ish) is My Bus?" CHI 2016: https://mucollective.northwestern.edu/project/when-ish-is-my-bus
S23 V  Fernandes et al., quantile dotplots improve transit decisions, CHI 2018: https://dl.acm.org/doi/10.1145/3173574.3173718
S24 V  Park, Drucker, Fernandez, Elmqvist, "Atom: A Grammar for Unit Visualizations": https://www.microsoft.com/en-us/research/publication/atom-a-grammar-for-unit-visualizations/
S25 S  Gigerenzer natural frequencies (named in [S8]); direct source not retrieved
S26 S  FT visual storytelling team: https://pressgazette.co.uk/publishers/nationals/financial-times-ft-visual-storytelling-team-investigations/ ; job listing citing CT-scan 3D models (not a piece link)
S27 V  FlowingData on Kurzgesagt human-scale comparison: https://flowingdata.com/2023/12/21/scale-of-all-the-things-compared-to-you/
S28 V  Veritasium, "Do People Understand the Scale of the Universe?": https://www.veritasium.com/videos/2024/1/15/do-people-understand-the-scale-of-the-universe (page only; technique not read)
S29 V  Tversky, Morrison, Betrancourt 2002, "Animation: can it facilitate?" (congruence, apprehension): https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf
S30 V  3Blue1Brown lessons 2024-25: https://www.3blue1brown.com/lessons/mini-llm/ , https://www.3blue1brown.com/lessons/gpt/ ; "How I animate" (Oct 2024) https://3blue1brown.substack.com/p/how-i-animate-3blue1brown (listed, not opened)
S31 S  Gapminder trails: https://www.researchgate.net/publication/249646893_Health_advocacy_with_Gapminder_animated_statistics
S32 V  Robertson, Fernandez, Fisher, Lee, Stasko, "Effectiveness of Animation in Trend Visualization", TVCG 2008: https://dl.acm.org/doi/10.1109/TVCG.2008.125 ; mobile replication https://arxiv.org/pdf/1907.03919
S33 V  Dragicevic et al., "Temporal Distortion for Animated Transitions", CHI 2011: https://dl.acm.org/doi/10.1145/1978942.1979233
S34 V  Chevalier, Dragicevic, Franconeri, "The Not-so-Staggering Effect of Staggered Animated Transitions", TVCG 2014: https://visualthinking.psych.northwestern.edu/publications/ChevalierDragicevicFranconeri2014.pdf
S35 V  Li, Wang, Zhang, Qu, "Improving Engagement of Animated Visualization with Visual Foreshadowing", VIS 2020: https://arxiv.org/pdf/2009.03784
S36 V  Scrollytelling for privacy policies (2026): https://arxiv.org/html/2603.04367 ; long-form journalism study https://dl.acm.org/doi/fullHtml/10.1145/3605655.3605683
S37 V  McKenna, Riche, Lee, Boy, Meyer, "Visual Narrative Flow", EuroVis 2017: https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.13195
S38 S  FT scrollytelling component: https://www.npmjs.com/package/@financial-times/n-scrollytelling-image
Reuters Graphics (https://www.reuters.com/graphics/), NYT Graphics, Bloomberg Graphics 2025 roundup (https://www.bloomberg.com/graphics/2025-in-graphics/),
Apple keynote data animations, Stripe and Linear launch films, Vox, OWID: U. Search found no verifiable technique
descriptions; revisit with a working fetch before citing any of them for a specific move.
