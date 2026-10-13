# WOW-LIBRARIES · which libraries lift silent, frame-stepped p5 WEBGL films (R-W3, 2026-10-11)

Scope: Wave WOW lane R-W3 (factory/WAVE-WOW.md). Method: WebSearch snippets only (egress blocks WebFetch). Grades: A = an
official page or repo/registry text quoted in a snippet; B = a third-party tracker or blog quoting numbers, or two
snippets that disagree on a detail; C = inferred, or from my own memory of the library and not confirmed by a snippet.
Today is 2026-10-11. Bytes are minified, uncompressed, because kit2 counts the raw page length (build.py:473, budget
1.3 MB page and 120 KB film code) and inlines scripts raw.

## 0. The verdict in six lines

1. The page has roughly 310 KB of headroom (1,300,000 minus p5 at 990,638), and fonts, shell, film code (up to 120 KB)
   and the built data all draw on it. Opera House is 1.127 MB today; two shipped pages (grasp-stitch 1.457 MB, base-rate
   1.49 MB) are already over it. A library is therefore affordable only below about 25 KB, and nothing mainstream is.
2. We already own a pure timeline core (arsenal/core/timeline.js, 15 KB: tracks, `timeline().play/stagger/beat`,
   scene-local time, OKLab colour lerp, binary-search seek) and a camera rig whose moves use eight named eases
   (linear, smooth, in, out, inout, expo, back, step). What we lack is what the product demos are made of: springs with
   settle and overshoot, cubic-bezier easing, per-keyframe bezier handles, anticipation and follow-through, and
   choreographed stagger across many elements. That is about 10 KB of pure maths, not a library.
3. The two things a library could really give p5 WEBGL, in-scene crisp type and a second look at post, are both
   techniques we can write: SDF text from our own vendored fonts, and the post stack that already exists but is unused.
4. Every full 3D engine (three.js 707 KB, Babylon >3 MB) or wasm vector runtime (Rive 707 KB wasm, dotLottie ~500 KB wasm)
   is larger than our entire headroom. They are only conceivable in a render-only tier that ships MP4, not a page.
5. Recommendation: A = nothing now, with anime.js v4 (MIT) as the one pre-approved fallback and a drafted D-row;
   B = a 10 KB "motion kit" (springs, bezier ease, handle keyframes, stagger patterns) plus a 5 KB SDF text pass;
   C = everything else (section 3).
6. What Anthropic ships (section 4) is code-built motion exported to MP4, the same shape as our pipeline. The gap to it is
   craft, not renderer.

## 1. Fit test applied to every library

| Test | Why it matters here |
|---|---|
| Purity | render(t) must give the same pixels for the same t, with no wall clock, no rAF-driven state, no Math.random. The library must expose seek/set-time, or be pure functions. |
| DOM / React | Our canvas is p5 WEBGL; text and chrome are SVG/DOM overlays. React is out (no build step, bytes). |
| Second renderer | A library that owns a canvas or GL context means two contexts in one page; they cannot share textures with p5, and under SwiftShader (CPU GL) each costs frame time. |
| Bytes | Raw minified bytes against about 310 KB headroom. |
| Licence | The vendor law needs a dated D-row and a licence text in vendor/licenses (vendor/LICENSES.md pattern). p5 is LGPL and kept in its own script block; anything GPL/AGPL is out. |
| What p5 lacks | Only count a benefit p5 plus arsenal/core/timeline.js cannot already do. |

SwiftShader note (A): Chromium's docs say automatic WebGL fallback to SwiftShader is being phased out ("WebGL context
creation will fail instead of falling back to SwiftShader"); headless runs need `--use-gl=angle --use-angle=swiftshader`
plus the unsafe opt-in. I did not find any source on WebGPU or Dawn under software rendering (C: assume it falls back to a
WebGL2 backend or fails). Anything WebGPU-first is therefore a risk for our headless exporter. I did not find the flag
set in arsenal/tools/export.mjs by grep, so check that file before adding any second renderer.

## 2. The libraries

### 2.1 Timeline and tween engines

| | GSAP | anime.js v4 | Theatre.js | Motion (ex Framer Motion) + Motion One | popmotion |
|---|---|---|---|---|---|
| What | Industry timeline engine: tweens, timelines, stagger, eases, plus formerly paid plugins (SplitText, MorphSVG, DrawSVG, Flip, CustomEase, MotionPath, ScrollTrigger) | Modular ES-module animation engine: `animate`, `createTimeline`, `createSpring`, `stagger`, `waapi` | Keyframe sequencer with a visual studio; core plays JSON state | JS and WAAPI animation; `animate()` mini and hybrid builds; springs; React components | Low-level animation functions, origin of Framer Motion's engine |
| Version, date | 3.13 (the free-all-plugins release, 2025; GSAP's blog is titled "3-13"; a Tumult forum thread calls it "3.14 is now free"). Check npm. Grade B (snippets disagree on 3.13 vs 3.14) | v4.0.0 mid-2025 (C), later 4.x: versio.io page dated 2026-09-16 lists 4.5.0; one skills page says 4.3.5 (B, conflicting) | @theatre/core and @theatre/studio 0.7 quickstart (B); the unscoped `theatre` package is 0.2.3 and stale (A) | Motion: Framer Motion became independent as "Motion" on 2024-11-12 (A, motion.dev blog); current 12.x (C) | 11.0.5, last published 2022 (B). Effectively frozen |
| Licence | "Webflow makes GSAP 100% free" including all bonus plugins, standard licence widened to commercial use (A, webflow.com + gsap.com/blog/3-13). It is still the GSAP Standard Licence, not OSI open source. A forum commenter reads a prohibited use for tools that compete with Webflow's visual builders (B, unconfirmed). We are not such a tool, but redistribution of GSAP inside our shipped HTML needs the licence text read in full (C: not checked) | MIT (C: not in the snippets; this is my memory) | core Apache-2.0, studio AGPL-3.0 (A). Studio can never ship in a page; it is authoring only | MIT (C) | MIT (C) |
| Minified size | gsap core about 70 KB raw (C); Motion's own comparison lists GSAP core at 23 KB and Motion hybrid at 18 KB, mini 2.3-2.6 KB, which are compressed figures (A for the claim, compressed) | "10 KB full, 3 KB WAAPI-only" per third-party skill pages (B, probably gzip); tree-shaken timeline plus spring plus stagger is plausibly 15-25 KB raw (C, must measure) | not measured; core carries a reactive runtime and is reported in the hundreds of KB (C) | mini 2.3 KB / hybrid 17-18 KB compressed (A); raw hybrid is about 50 KB (C) | about 15 KB raw for the functions we would use (C) |
| Pure of wall clock? | Yes if driven as a paused timeline and sought: Remotion's own GSAP page says its package "builds a paused GSAP timeline and seeks it to the current frame, so previews, scrubbing and renders are deterministic" (A). Avoid `gsap.ticker`, lagSmoothing and `gsap.utils.random` (Math.random) (C) | Yes through `timeline.seek(ms)`: "updates the currentTime of the timeline to a specific time" (A, animejs.com). Default main loop uses rAF, so it must be disabled and driven by hand (C: I recall `engine.useDefaultMainLoop`) | `sequence.position` setter drives it by hand (C; snippets did not confirm). Values arrive by callback or getter (C). Without Studio the project loads a saved state object (A) | `animate()` defaults to WAAPI/rAF, which is wall-clock; the JS engine has a settable time (C). Not a natural fit | Pure function generators (`spring`, `inertia`, `keyframes`) take elapsed time (C) |
| DOM / React | No (tweens any object) | No | No for core | Vanilla yes; React optional | No |
| Buys what p5 + core/timeline.js lacks | CustomEase, rich eases (elastic, bounce, steps), stagger grids with `from:"center"`, labels and relative position strings (`"<+=0.2"`), Flip (layout morph), SplitText mask reveals. Most of it is DOM- or SVG-oriented | `createSpring` (duration+bounce or stiffness/damping), `stagger` with grid and `from`, timeline offsets, per-property easing, easing functions including `cubicBezier` and `linear()` (C) | The one worth studying: a Bezier-handle keyframe editor with curves per segment, authored visually and saved as JSON. For us the authoring GUI is irrelevant because Claude writes the keyframes | Spring physics with the `duration`+`bounce` parametrisation designers understand | Spring/inertia maths, tiny |
| Honest cost | 70 KB raw is 23 percent of headroom for a feature set we mostly can write; licence is proprietary-free, not open; plugins are mostly DOM | The best of the vendor options: small, ESM, MIT, seekable. Cost is a measured 15-25 KB and a purity proof that nothing inside calls `performance.now` during seek | Core bytes unknown and likely too big; AGPL studio is poison; project maintenance looks slow (C) | Wrong model (declarative, wall-clock) | Unmaintained since 2022; copy the maths instead |

Remotion (C for internals, A for licence) is a model rather than a dependency. It needs React and a headless Chromium
renderer; it is not vendorable into one HTML page. Its licence (A, remotion.dev/license): free for individuals,
for-profit organisations with up to 3 employees, and non-profits; a Company License otherwise (the pricing page lists
Creators at $25/month per seat and Enterprise from $500/month, B), and "In Remotion 5.0, the license will slightly
change." Version in registry: 4.0.529 (jsDelivr path, A). Its model is the one we already follow: each frame is a pure
function of `useCurrentFrame()` ("Frame 30 might be rendered before frame 10", A), so CSS animations and `setTimeout`
are forbidden and `random(seed)` replaces `Math.random`. Techniques worth stealing: `interpolate(frame, in, out,
{easing, extrapolateLeft/Right})`, `spring({frame, fps, config})` as a pure function, `<Sequence from>` as shifted local
time (we have `scene(t0,t1,fn)`), and `<Series>`. Do not adopt: licence tier, React.

### 2.2 3D and WebGL

| | three.js | pmndrs/postprocessing | Babylon.js | regl / twgl / ogl |
|---|---|---|---|---|
| What | The standard WebGL/WebGPU scene graph; TSL (Three Shading Language) compiles to WGSL or GLSL | Post stack that merges effects into one pass (bloom, DoF, SSAO, SMAA, tone map, LUT) on top of three | Full engine with its own inspector, node materials, WGSL shaders | Lean WebGL wrappers: regl (functional), ogl (mini three), twgl (helpers over raw GL) |
| Version, date | npm `three` 0.184.0, tracker updated 2026-04-16 (B); r183 shipped 2026-02-18 and renamed PostProcessing to RenderPipeline (B, cinevva). r176 (2025-05) note: WebGLRenderer can be faster than WebGPURenderer (B) | 6.39.1 and 6.39.4 are the recent npm READMEs (A); needs `three` as a peer (A) | 8.0 released 2025-03-27, WGSL shaders, "2x smaller when targeting WebGPU" (A, Microsoft blog) | regl 2.1.1; ogl 1.0.11; twgl no figure found (B/C) |
| Licence | MIT (C) | Zlib (C) | Apache-2.0 (C; snippets did not state) | MIT each (C) |
| Minified size | 707.2 KB min, 177.7 KB gzip (B, depscope, package level). Alone it is 71 percent of p5's size | not measured; effect code only is a few hundred lines per effect (C); needs three, so adds on top of 707 KB | "just under 3MB without gzip" on a tree-shaken basic playground (B, forum) | regl 114.7 KB min / 36.8 KB gz (B); ogl 128.3 KB min / 33.4 KB gz in the tracker, README says 20 KB gz total (B, disagree); twgl about 40 KB (C) |
| Pure of wall clock? | Yes: you call `render()` yourself with a time you set; nothing needs rAF. TSL `time` nodes read a clock, so use a uniform you set (C) | Yes, frame-driven by `composer.render(delta)`, but several effects keep temporal state (C), so the exporter must replay sequentially, which it does | Yes if you call `scene.render()` manually and keep the engine's render loop off (C) | regl/twgl/ogl: yes, you call draw yourself |
| DOM / React | No | No | No | No |
| Buys | Real PBR, shadow maps, GLTF, instancing, cameras, a huge ecosystem of examples; WebGPU compute | Higher-quality bokeh DoF, SMAA, SSAO, god-rays, LUT grade, TRAA, all vetted | Everything, including GUI | Smaller state-management code than raw GL, little else over p5 |
| Honest cost | Second renderer: 707 KB alone exceeds the whole headroom (990 + 707 = 1.70 MB); would replace p5 rather than join it. Second context under SwiftShader doubles per-frame cost. WebGPU renderer risk on headless (C) | Requires three, so it inherits the whole cost | 3 MB+ | p5 already exposes `createShader`, `createFramebuffer`, `filter` shaders and our gl-post runs the passes; twgl can attach to p5's own `drawingContext` (C), but state-clobber risk and tiny benefit |

### 2.3 Vector and designer-authored motion

| | Rive runtime | Lottie (lottie-web) and dotLottie | Spline runtime | Jitter |
|---|---|---|---|---|
| What | State-machine vector animation authored in the Rive editor; `.riv` file | After Effects JSON via Bodymovin; dotLottie is a zipped, wasm-rendered variant | 3D scenes authored in Spline; `.splinecode` | Web motion-design tool with MP4/GIF/Lottie export (no snippet found for this lane; C) |
| Version, date | Runtime sizes page dated Jan 2026 (A) | dotLottie web with a ~500 KB compressed wasm engine fetched from a CDN (A, docs.lottiefiles.com) | runtime 1.10.x on unpkg (A) | not researched beyond a failed search |
| Licence | runtime MIT (C), editor is a free/paid SaaS | MIT (C) | runtime MIT (C), editor SaaS | SaaS |
| Size | `@rive-app/canvas-lite` wasm 707 KB raw / 222 KB brotli; `canvas` 1,728 KB / 567 KB; `webgl2` 2,179 KB / 648 KB (A, rive.app/docs/runtimes/runtime-sizes). JS wrapper 160.9 KB min (B). Inline wasm is base64, +33 percent | JS player 35 KB gz (B, LottieFiles table); wasm about 500 KB compressed (A); classic lottie-web player is "less than 50KB compressed" (B), raw 150-250 KB (C) | "~500KB+" (C, third-party) | n/a |
| Pure? | The low-level API lets you "manually manage when Rive updates its state and draws" (B); deterministic given fixed dt (C), but state machines are stateful so seeking backward is not free | `goToAndStop(frame)` is deterministic (C) | Runtime has its own rAF loop and fetches the scene at runtime, unless self-hosted ("download the .splinecode file and self-host it", A) | n/a |
| DOM / React | Needs a canvas it owns (second renderer) | Canvas or SVG it owns | Own WebGL canvas | n/a |
| Buys | Character-grade easing and blend states authored by a designer | After Effects micro-interactions | Designer-made 3D | Designer-made 2D |
| Honest cost | wasm alone is 2-7x our headroom, plus an editor outside our stack | 500 KB wasm alone is 160 percent of headroom; no AE authoring in this repo | 500 KB plus a second WebGL context | The authoring is not code, and Claude cannot drive it here |

### 2.4 Type

| | troika-three-text | MSDF pipeline (msdfgen / msdf-atlas-gen, three-msdf-text-utils) | d3-ease, d3-interpolate | Manim (approach) |
|---|---|---|---|---|
| What | SDF text for three.js: reads .ttf/.otf/.woff with Typr, builds the SDF atlas on the fly, anti-aliases with standard derivatives, kerning, ligatures, RTL (A, README) | Multi-channel signed distance fields preserve sharp corners at large magnification; atlas baked at build time | Pure easing and interpolation functions (ease: cubic, elastic, back, bounce, poly; interpolate: number, colour, Lab/HCL, string, transform) | Python maths-video engine (Manim Community v0.19.2 on 2026-01-17, v0.20.x exist, B). Technique, not a dependency |
| Licence | MIT, v0.52.4 (A, npm) | msdf-atlas-gen MIT (C) | d3-ease BSD-3-Clause; d3-interpolate and d3-timer ISC, all 3.0.1 (B, licenses.dev) | MIT (C) |
| Size | about 122 KB min / 43 KB gz (C, third-party estimate), plus worker | atlas PNG for a Latin subset of one face, roughly 30-80 KB (C); shader about 20 lines | each a few KB raw (C: no snippet gave sizes) | n/a |
| Pure? | Layout in a web worker with async results: not pure unless pre-awaited; needs three | Yes, a sampler in a shader | Yes, pure functions | Yes: each Animation is `interpolate(alpha)` with `rate_func` (C) |
| Buys | Crisp 3D text that takes DoF, bloom, and motion blur like any mesh | The same, sharp corners | Easing library to copy from | The technique list in section 3, B3 |
| Honest cost | Requires three. Worker, async atlas build | Build tool outside the offline loop; adds binary assets | The functions are 1-2 KB each; copy them, do not vendor | n/a |

## 3. Recommendations

### A. Vendor as a module (justify a D-row): nothing today; anime.js v4 only as the pre-approved fallback

I do not recommend vendoring anything for this wave. The reason is arithmetic: roughly 310 KB headroom, of which fonts and film
code take most, and the only library with seek, springs, stagger and MIT terms (anime.js v4) is a 15-25 KB addition
(unmeasured, C) that duplicates what section B builds in 10 KB. If the B kit slips or Claude-authored scripts keep
reaching for GSAP-style relative position strings, the fallback is below. Draft D-row (do not add until measured):

> | D14 (date) | Vendor anime.js v4 (MIT), a tree-shaken ESM build of `createTimeline`, `createSpring`, `stagger` and the easing helpers only, as `vendor/anime-4.x.min.js` (target at most 25 KB raw, sha256 in SHA256SUMS, licence in vendor/licenses). It is driven only through `timeline.seek(ms)` with the default main loop disabled and no `animate()` autoplay; `render(t)` stays pure. A proof (new tests/proofs.sh row) renders frames 0, 1, N, 1, 0 and requires byte-identical pixels for equal t, and a source grep forbids rAF, performance.now and Date.now inside the vendored file's called paths. | Narrows the "vendored p5 and fonts only" law to "p5, fonts, and listed modules". Gate G8 budget stays 1.3 MB. |

Why anime.js and not GSAP: MIT versus a bespoke licence we have not read in full (C); smaller; ESM tree-shaking; official
`seek`. Why not Theatre: AGPL studio, unknown core bytes. Keep the licence check as step zero, because I could confirm
none of the MIT claims from snippets (C).

### B. Borrow the technique and write it ourselves (each at most 10 KB, all pure, all in arsenal/core)

B1 Motion kit, extending arsenal/core/timeline.js (target 6-8 KB raw added, one file, no state):
- `spring({stiffness, damping, mass})` and the designer form `spring({duration, bounce})` (Motion's parametrisation, B).
  Closed form for under-, critically- and over-damped cases, so x(t) is analytic and pure. Provide `settle()` to report
  the time at which |x-1| < 0.001 so the sequencer can lay out holds.
- `bezier(x1,y1,x2,y2)` with Newton plus bisection solve (the CSS/Motion model, about 30 lines), and named curves
  (`apple` 0.25,0.1,0.25,1; `expoOut`; `anticipate` that dips below 0 before launching; `overshoot` back 1.4; `settle`).
  Today we have eight eases and one of them overshoots; product demos use springs and long expo-out tails almost
  everywhere (C, inferred from the R-W1 lane; do not take the claim from me, test it against the rubric).
- Per-keyframe bezier handles in `track()` (the Theatre idea, A for the product concept): each key may carry
  `{in:[x,y], out:[x,y]}`, with the segment a cubic Hermite/bezier in value-time space. This allows ease-in on a camera
  push and ease-out on a card without a new named ease. Serialises to JSON so Claude can author and diff it.
- Velocity carry-over: when two moves chain, the second spring starts with the first's end velocity. Implement as
  deterministic pre-integration at a fixed substep (for example 1/240 s) over the script, memoised, so `at(t)` stays a lookup.
- `stagger.grid`, `from:'center'|'edges'|'random(seed)'`, `ease` on the offset curve, applied to instance index. This
  mirrors anime.js and GSAP; the existing `stagger` builder only does linear offsets (C, I read it only by grep). Feed it
  to gl-instances so a field of 4,000 bars lands in a wave rather than together.
- Overshoot-safe clamps and settle-to-rest hold so nothing creeps after the last key.
- Test: a proof that `at(t)` equals a numerical reference simulation at 20 random t, and equal for `at(1)` after `at(9)`.

B2 SDF text for p5 WEBGL, about 5 KB code and no new binary (target):
- Rasterise each glyph at 96 px with the already vendored woff2 into a 2D canvas, then run a Felzenszwalb exact
  Euclidean distance transform (about 60 lines) to a single-channel SDF atlas; sample with `smoothstep` over `fwidth`
  (the technique troika uses, A). Draw glyph quads as instances in one draw call.
- What it buys: the labels live in the scene, so they take camera motion, depth of field, bloom, vignette and the
  temporal sub-frames of `renderAccumulated` (the wave films' text is flat SVG on top and untouched by all of them, per
  WAVE-WOW.md). It also gives tracking, per-glyph stagger and variable weight morph in the shader.
- Caveat: single-channel SDF rounds sharp corners at a small atlas and 4K magnification; MSDF fixes that but needs
  msdfgen at build time (an outside binary and a PNG of tens of KB, C). Start single-channel at 96 px with 8 px spread; judge
  at 4K against the SVG text; escalate to a baked MSDF only if corners fail the eye test. Keep SVG for dense small text
  (G11 overlap checks already work on SVG boxes), SDF for display type only.
- Determinism: the atlas is built on load from fixed fonts; no Math.random; same pixels each run.

B3 Techniques to lift, no library needed (each is under 100 lines):
- Manim (B for existence, C for details): `lag_ratio` stagger over a group, `rate_func` easing, "draw on" by path
  proportion (Create/Write), `TransformMatchingShapes` as a keyed morph between two layouts, `Indicate`/`Flash` attention
  beats, `ValueTracker` plus updaters (our render(t,state) already is this model), and `always_redraw` for derived marks.
- GSAP (B): Flip (record old layout, change, animate delta) for layout hand-offs; relative position strings on timelines
  (`"<+=0.2"`) for authoring; SplitText mask reveals for headlines done as three.js-free instanced glyph quads in B2.
- Remotion (A/B): `interpolate` with clamped extrapolation; `Sequence` shifted time; seeded `random(seed)`.
- pmndrs/postprocessing (A for the single-pass merge): fuse our post effects into one pass where the order permits to cut
  fill cost under SwiftShader; port its TRAA/bokeh ideas only after R-W4 says what is missing in gl-post.
- Theatre (A): the separation of authoring (visual) from runtime (tiny core plus JSON) is the right shape for our
  "sequence.json" if the rig and the timeline unify later.

### C. Do not (and the reason)

| Library | Why not |
|---|---|
| three.js, pmndrs/postprocessing, troika-three-text, Babylon.js | Whole-page size (707 KB to 3 MB against 310 KB headroom), second renderer, WebGPU risk on headless SwiftShader. Revisit only for a render-only tier (below). |
| Rive, Lottie, dotLottie, Spline | Wasm of 500 KB to 2 MB and an authoring editor outside the repo; each owns a canvas. Spline fetches at runtime (self-hosting needed). |
| GSAP | Free now, but 70 KB raw, DOM-centred plugins, proprietary licence we have not read. The anime.js fallback in A is smaller; B covers the stagger, ease and sequencing. |
| Theatre.js | AGPL studio; core bytes unknown; our authors are scripts, not a GUI. Copy the handle-keyframe idea (B1). |
| Motion / Motion One / popmotion | Declarative wall-clock model; popmotion unmaintained since 2022. Copy the spring parametrisation (B1). |
| Remotion | React, headless-renderer, paid tier if the organisation exceeds 3 employees (the licence says it will change in 5.0). Copy the pure-function model, which we already follow. |
| regl / twgl / ogl | 40-130 KB for little over p5's `createShader`/`createFramebuffer` plus our gl-post. |
| d3-ease / d3-interpolate | Pure and tiny, but our core/timeline.js has OKLab lerp already; port the missing curves (elastic, bounce) into B1 and skip the licence line. |
| Jitter, any no-code motion tool | Cannot be authored by an agent in this repo; breaks "commit the sources". |

Structural option, not recommended yet: a render-only tier. Because the frame-stepped exporter writes MP4 (the page
budget does not apply to an MP4), a film built on three.js plus pmndrs/postprocessing could ship as video alongside a
lighter p5 page. That is a real architecture and would need its own D-row, and it breaks the principle that the page
is the film (D10). I mention it only because Claude Motion itself ships MP4 (section 4); I judge the craft gap, not the
engine, to be the cause of the WOW gap, so there is no case for it until B1 and B2 are in and the rubric still says no.

## 4. What Anthropic's own product videos appear to be made with

| Finding | Evidence and grade |
|---|---|
| Claude Motion launched in beta on 2026-10-08 on Team and Enterprise plans. | A: Reuters via WTVBAM ("Anthropic launches dashboard, animation tools for Claude", 2026-10-08); The Decoder; support.claude.com article 17454997. |
| It does not use a video model. Quote from @claudeai: "Claude Motion turns reports, charts, or product walkthroughs into short animations. Claude writes each one as code, with no video model involved, so you can change any word, number, or timing, then export an MP4." | A: x.com/claudeai/status/2108271558170976743. |
| Start from "a Motion template" in the Artifacts tab or `/motion`; adjust in an editor or by asking; export MP4; "Because each animation is code, you can change one detail, like a word, a number, or the timing, and the rest stays as it was." | A: support.claude.com snippet. |
| Export paths to Adobe, Descript, HeyGen, Higgsfield, invideo, Luma AI and Runway; Canva and Captions coming soon. | B: aggregator quoting Anthropic; Runway posted "runway-claude-motion" (A that the post exists). |
| The engine inside Claude Motion is not named in anything I retrieved. Third parties say Claude "generally writes HTML/JavaScript or canvas, and renders it with Playwright and ffmpeg", sometimes Remotion, Manim or three.js. | C: generic blog claims, not specific to Claude Motion or Anthropic's own videos. Inference only. |
| Anthropic's own launch video for Motion is on its YouTube channel and "was made with the Claude tools themselves." | C: single eesel.ai blog, unconfirmed against Anthropic. |
| The 2025 "Keep Thinking" campaign was live action: directed by Daniel Wolfe via Love Song Films, agency Mother London, 90 seconds; no motion studio credited. | B: Campaign, The Drum, Axios (2025-09-18), B&T, Shots. Not animated, so it says nothing about product-demo motion. |
| A claim that Anthropic's Claude Code marketing team builds its daily video with Remotion plus an agent. | C: one blog admits it "could not point to a published Anthropic case study". Treat as rumour. |
| I found no source on what makes Anthropic's product-demo reels (UI screen captures with animated overlays) in After Effects, Figma, Rive or elsewhere. | Not found; anything I said would be C. |

Reading this for us: the bar the owner points at ("Claude motion natively ships in product demos") is most plausibly the
Claude Motion output and the launch material around it. Its stated architecture is code-driven animation rendered
frame by frame to MP4, the same loop as our `arsenal/tools/export.mjs`. If so the differences are not the renderer or a library. They are what the code
does inside the frames (easing, springs, stagger, type, light), which is lane R-W1's rubric and the B1/B2 work here.
This is inference (C) and the A-W5 gap audit should confirm it with frames.

## 5. What to do next, in order, with the cost of being wrong

1. Build B1 (springs, bezier ease, handle keyframes, grid/centre stagger) into arsenal/core/timeline.js, rewire
   gl-camera-rig to use `spring` and `anticipate` for its moves, and re-cut one wave film with them. Cost 1 lane, pure
   maths, proofs are numeric. If WOW does not move, the library question is closed.
2. Build B2 (SDF display type in gl-labels or a new gl-text), and put one headline through gl-post DoF and bloom. Cost 1
   lane, about 5 KB, reuses vendored fonts.
3. Only if both fall short of the R-W1 rubric, measure the tree-shaken anime.js v4 and draft D14 for approval.
4. Before any of this, read arsenal/tools/export.mjs for the Chromium flags and confirm it passes `--use-angle=swiftshader`
   style opt-ins that Chromium now requires (A).

## 6. Claims I could not verify (do not rely on them)

- Exact current versions of GSAP (3.13 vs 3.14), anime.js (4.3.5 vs 4.5.0), motion, @theatre/core, three (0.184.0 as of
  2026-04-16; r185+ may exist), pmndrs/postprocessing (6.39.4 seen), regl, ogl, twgl.
- All licence identifiers marked C (MIT, Apache-2.0, Zlib), and the full text of the GSAP Standard Licence.
- Raw minified sizes for GSAP, anime.js tree-shaken, Theatre core, Motion hybrid, popmotion, twgl, d3-ease/interpolate,
  postprocessing, lottie-web and Spline runtime.
- Whether three's WebGPURenderer or Rive's WebGL2 runtime run under our SwiftShader exporter.
- Which tools Anthropic uses for any product video; all engine claims are inference.

## Sources (WebSearch results, 2026-10-11)

- GSAP free: webflow.com/blog/gsap-becomes-free ; gsap.com/blog/3-13/ ; forums.tumult.com/t/gsap-3-14-is-now-free/24779 ; cdn.jsdelivr.net/npm/gsap-trial@3.13.0/README.md
- Theatre.js: npmjs.com/package/@theatre/studio ; theatrejs.com/docs/0.5/api/core ; theatrejs.com/docs/latest/getting-started/with-html-svg ; snyk.io/advisor/npm-package/theatre
- anime.js: animejs.com/documentation/timeline/timeline-methods/seek ; versio.io anime.js EOL page ; newreleases.io/project/npm/animejs
- Motion: motion.dev/docs/gsap-vs-motion ; motion.dev/docs/animate ; motion.dev/docs/react-reduce-bundle-size ; motion.dev/blog/framer-motion-is-now-independent-introducing-motion ; classic.yarnpkg.com/en/package/popmotion
- Remotion: remotion.dev/docs/gsap ; remotion.dev/docs/pricing ; remotion.dev/license ; cdn.jsdelivr.net/npm/remotion@4.0.529/LICENSE.md ; convert.remotion.dev/docs/troubleshooting/css-animations
- Rive: rive.app/docs/runtimes/runtime-sizes.md ; rive.app/docs/runtimes/web/low-level-api-usage.md ; rive.app/docs/runtimes/web/faq
- Lottie: docs.lottiefiles.com/en/runtimes ; github.com/lottiefiles/dotlottie-web ; lottielab.com/blog/how-we-make-lotties-10x-smaller
- three.js: depscope.dev/pkg/npm/three ; threejs.org/manual/en/webgpurenderer ; app.cinevva.com/news/2026-03-18-threejs-r183-render-pipeline
- postprocessing: cdn.jsdelivr.net/npm/postprocessing@6.39.4/README.md ; github.com/pmndrs/postprocessing
- Babylon: blogs.windows.com/blog/2025/03/27/announcing-babylon-js-8-0/ ; forum.babylonjs.com bundle-size threads
- regl/ogl: mcp.depscope.dev/pkg/npm/regl ; depscope.dev/pkg/npm/ogl ; github.com/manspaniel/ogl
- Text: cdn.jsdelivr.net/npm/troika-three-text@0.52.4/README.md ; npmjs.com/package/troika-three-text
- d3: licenses.dev/npm/d3-transition/3.0.1
- Spline: docs.spline.design/exporting-your-scene/web/exporting-as-code.md ; unpkg.com/@splinetool/runtime README
- Manim: zenodo.org/records/18278418 ; docs.manim.community changelogs
- SwiftShader: chromium.googlesource.com docs/gpu/swiftshader.md
- Anthropic: x.com/claudeai/status/2108271558170976743 ; support.claude.com/en/articles/17454997-get-started-with-claude-motion ; claude.com/resources/articles/dashboards-and-motion ; the-decoder.com (Claude dashboards and animated explainers) ; wtvbam.com/2026/10/08/anthropic-launches-dashboard-animation-tools-for-claude/ ; eesel.ai/blog/claude-motion ; runway.com/news/company-news/runway-claude-motion ; campaignlive.com, thedrum.com, axios.com/2025/09/18/anthropic-brand-campaign-claude (Keep Thinking)
