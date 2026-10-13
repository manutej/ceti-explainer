---
id: open-questions
title: "Open questions and conflicts"
type: Concept
aliases: ["gaps", "disagreements", "Allison Parrish"]
sources: [S4, S6, S10, S11, S26, S30, S32, S42, S44, S46, S47, S62, S64, S72, S74, S75, S112, S114, S115, S117, S119, S120, S121, S126, S128, S129, S131, S137, S138, S143, S144, S145, S146, S153, S156, S158, S159, S178, S180, S186, S188, S189, S191, S193, S198, S199, S201, S204, S226, S228, S229, S236, S238, S239, S240, S244, S255, S257, S258, S267, S271, S274, S276, S278, S280, S281, S282, S284, S285, S286, S287, S298, S300, S304, S312, S316, S321, S324, S325, S328, S332, S357, S359, S362, S363, S367, S373, S374, S379, S380, S387, S396, S403, S404, S406, S407]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---
# Open questions and conflicts

## Definition
This page aggregates every source conflict logged by the four writing clusters (`_meta/conflicts-inbox.md`) and every "Gaps and disagreements" section of research branches B01–B21, sorted into resolved items, live conflicts, unverified claims and unreachable sources [S404][S131].

## Details
### Resolved
- **Did the Web Editor switch to 2.x?** Yes. Editor release v2.22.0 (31 July 2026) includes PR #4232 "Set p5.js v2 to Default"; v2.20.8 had set 1.11.13 as default and v2.21.2 added the announcement banner. This resolves the B03/B06/B14/B16/B17/B19 "unconfirmed" gaps and the July-vs-August conflict (PF blog July [S47], issue #8870 start of August [S114]); see [[editor-default-switch]] [S404].
- **1.x "supported until Aug 2026" vs "no updates after March 2026"** — the two statements likely refer to the Editor default and maintenance releases respectively; 1.x was frozen end of March 2026 [S11][S75][S114].
- **2.3.4 vs reference 2.3.3** — patch-level lag only; a source diff found no public API missing in 2.3.4; see [[p5js-2x]] [S363][S362].

### Live conflicts (sources disagree)
**Versions and naming**
- HDR/P3 constant naming: RGBHDR and P2DHDR in 2.0.0 notes vs RGBP3/P2DP3 in the reference vs "HDR renamed to P3" in 2.3.1; see [[p3-hdr-color]], [[p2dhdr]] [S4][S30][S62][S10].
- 2.3.0 release date: 28 May on GitHub notes vs 22 Jun 2026 PF write-up; see [[release-2-3]] [S121][S274].
- Decorators API dated to 2.2.3 (23 Mar) vs 2.3.0 with an initial guide in 2.3.3; see [[decorators-api]] [S119][S274][S10].
- Add-on Events API (2.1) vs lifecycle hooks via `registerAddon` already in 2.0; see [[addon-events-api]] [S47][S117].
- `textToContours`/`textToModel` (reference) vs `textContours`/`textModel` (Coding Train, 2.0 prose); see [[text-to-contours]] [S32][S46].
- `textToPoints` signature: reference `(str, x, y, options)` vs a capability-map pattern passing font size first; see [[text-to-points]] [S32][S4].
- `textWidth` vs `fontWidth` space handling inconsistent in the compat README; a 2.1.0 textWidth fix; PR 8088 status unknown; see [[text-width]] [S115][S120][S44].
- `linesMode(SIMPLE)` vs `strokeMode()` naming for WebGL stroke simplification in 2.0 notes; see [[shape-attributes]] [S4][S359].
- `createVector()` zero-arg: reference says deprecated with a warning, compat README says explicit dimensions required; see [[p5-vector]] [S74][S11].
- Custom shapes: tutorial says a Bézier shape must start with `vertex()` yet its final example starts with `bezierVertex`; see [[shape-custom-shapes]] [S26][S6].
- TypeScript: bundled types credited to 2.1, yet v2.3.4 fixes missing type declarations; see [[typescript-types]] [S47][S10].
- textToPoints "~350% faster" in 2.0 notes vs no quantified 2.x text-performance data; see [[perf-regressions-2x]] [S4][S267].

**Export and tooling**
- CCapture.js: forum poster says unmaintained ~8 years and working only with p5 0.9.0 vs README describing WebCodecs mp4/webm and a p5 recipe; p5.webm-capture builds on ccapture.js 2.0.0; see [[ccapture]] [S131][S138][S240].
- p5.capture README gives no versions or releases while npm shows 1.6.1 published 2026-04-15; 2.x status unstated; see [[p5-capture]] [S145][S159].
- Motion Canvas reported unmaintained with its site offline vs docs fetchable on 2026-10-08; see [[motion-canvas]] [S316][S324][S312].
- GSAP plain-object tweening: docs fetched show only selector examples; Remotion's hook restricts to elements; see [[third-party-timeline-driving]] [S332][S321].
- Code-to-video comparison posts are aggregator-grade, undated and disagree in emphasis on Motion Canvas rendering [S228][S229].

**People and works**
- Fidenza authoring: shipped artifact uses p5-style calls; reviewer says "Quill" (likely Quil); Hobbs says Clojure; declared p5 version unconfirmed; see [[fidenza]], [[collision-curve-packing]] [S367][S373].
- Kjetil Golid's p5 use comes from a crypto news site while the Art Blocks interview mentions only Processing; see [[kjetil-golid]], [[archetype]] [S380][S379].
- Khan Academy terminology: Processing.js vs "Processing API"; no source confirms any p5 migration; see [[khan-academy-live-editor]] [S199][S201].
- q5.js author's critique of preload removal should be read as a competitor's view; see [[q5js]] [S239].

### Unverified (claims or behaviours not confirmed)
- 2.x compatibility of nearly every add-on: p5.capture, p5.webm-capture, p5.record.js, p5.tween, p5.scribble, p5.grain, p5.riso, p5.sound; the libraries directory marks none as v2-compatible [S300][S244][S240].
- Whether `frameCount` is writable (the Electron sample writes it) and what the first draw sees; see [[frame-count]] [S129][S131].
- Bit-identical `random()`/`noise()` across 1.x vs 2.x and browsers; see [[seeded-determinism]] [S128][S72].
- `saveGif` `units` semantics and MAX_GIF_PIXELS behaviour beyond the 2.3.3 note; `saveFrames` 15 s / 22 fps cap rests partly on a forum poster; see [[save-gif]], [[save-frames]] [S143][S144][S131].
- p5.capture determinism: captures after draw but does not control `millis()`/`deltaTime` [S244][S146].
- WebGL1 vs WebGL2 default context and GLSL ES 3.00 acceptance; compute-shader limits; see [[webgl-mode]], [[webgpu-compute]] [S64][S62][S274].
- Pointer-event details (pressure, pointerType) in 2.x; async `createCapture`/`createVideo`; see [[pointer-events]] [S126][S112].
- `p5.Framebuffer` introduction version (believed 1.7.0); framebuffer antialias defaults across browsers [S257][S258].
- No built-in easing in core (inference from reference and library directory); see [[easing-functions]] [S357][S156].
- No quantitative benchmarks for pixelDensity, Framebuffer vs Graphics, 4K canvases or text cost; see [[performance-profiling]] [S255][S271].
- Nature of Code 2024 examples' target version (predates 2.0); see [[nature-of-code]] [S178].
- p5 in Node (jsdom/node-canvas) under 2.x — only 2021-era sources; see [[p5-node]] [S153].
- 2.4 release date; strands `instanceIndex` value-vs-function shape; see [[release-2-4]] [S10][S278].
- Funding amounts for Riot, Mark Cuban, Jerome and Tezos; 2026 Fellowship call status; see [[pf-fellowships]] [S280][S281][S298].
- ml5 v1.4.0 year (inferred 2026); agent-skill install counts from aggregators; genart-mcp inactive; see [[ml5js]], [[ai-assisted-p5]] [S276][S282][S284].
- Processing p5.js Mode 2.x failures are single-thread reports; its bundled p5 version is unofficial; see [[processing-p5-mode]] [S238].
- No canonical p5 explainer engine; p5.teach and Manim.js maintenance unknown; see [[explainer-engine-blueprint]] [S325][S328][S304].
- No sourced p5 hybrid inside Remotion, GSAP, Theatre.js or Motion Canvas — all such patterns are inference; see [[third-party-timeline-driving]] [S396][S403].
- Colour-mode default ranges for HWB/LAB/LCH/OKLAB/OKLCH and lerpColor hue paths are undocumented; see [[color-mode]] [S30][S42].
- p5.sound changelog lives in an inaccessible spreadsheet; see [[p5-sound]] [S158].

### Evidence gaps (absence of evidence, not proof of absence)
- No verified viral or mainstream YouTube explainer animated in p5; Coding Train is a live-coding show, Bees and Bombs uses Processing [S188][S180].
- No rigorous learning-outcome study comparing p5 explainers with video or text; see [[p5-education-research]] [S204].
- No verified newsroom use (ProPublica "P5" is a pair-programming project) and no verified museum explainer use [S226].
- No arXiv benchmark evaluating LLM-generated p5 for explainers; see [[llm-explainer-agents]] [S285][S286][S287].
- No published end-to-end 4K/60 benchmark; audio is never captured by recorder paths, only muxed later; see [[audio-post-mux]] [S137][S138].
- No p5 2.x on Art Blocks (registry tops out at 1.11.11); see [[art-blocks]] [S374].
- Practitioner coverage thin: Barney Codes, Patt Vira, Tim Rodenbröker read at About level only; Kazuki Umeda unreadable; see [[hub-people-community]] [S193][S189][S191][S198].

### Unreachable sources (fetch failures during research)
- Reddit (blocked), Hacker News (HTTP 419 on the one relevant thread), X/Mastodon, OpenProcessing popularity data [S131][S236].
- Anthropic's skills repository (robots.txt) — algorithmic-art description relies on an aggregator [S282].
- Theatre.js docs (robots), Remotion `/docs/canvas/` (404), youngju.dev 2026 comparison (certificate) [S403][S396].
- jsDelivr and cdnjs raw APIs (proxy 403); Web Editor `p5Versions.js` not found at the tried path [S406][S407][S404].
- Etienne Jacob's first tutorial (404); Kazuki Umeda's site (robots); a CMU page on Golan Levin's loop templates (declined) [S186][S198][S387].
- Allison Parrish's site (blocked) — see Unverified below.
- arXiv 2608.05174 ("Art in Humanity's Code") PDF had no extractable text [S285].

## Unverified
- Allison Parrish: no source retrieved for any p5.js explainer output; nothing is claimed about her practice.
- Others named only on the p5.js education list (Xin Xin, Carrie Sijia Wang, Computational Mama, Kevin Workman) and not researched further; Sighack was not researched.

## Relations
- related_to [[editor-default-switch]] — resolved item [S404]
- related_to [[community-export-pain]] — export conflicts [S131]
- related_to [[version-2x-migration]] — version conflicts [S11]
- related_to [[frontier-2026]] — frontier unknowns [S10]
- related_to [[capability-map]] — reference-level gaps [S357]
- related_to [[index]] — atlas entry point [S404]

## Sources
- [S404] — Web Editor releases (resolution of the default switch)
- [S47], [S114], [S75], [S11] — switch-date and 1.x-support statements
- [S4], [S10], [S30], [S62], [S119], [S121], [S274], [S117] — release and naming conflicts
- [S6], [S26], [S32], [S44], [S46], [S74], [S115], [S120], [S267], [S359] — API-level conflicts
- [S131], [S137], [S138], [S144], [S145], [S146], [S153], [S159], [S240], [S244] — export evidence
- [S228], [S229], [S312], [S316], [S321], [S324], [S332], [S396], [S403] — alternative-tool evidence
- [S367], [S373], [S374], [S379], [S380] — generative-art cases
- [S199], [S201], [S204], [S226], [S239] — education and community
- [S64], [S72], [S112], [S126], [S128], [S129], [S143], [S156], [S255], [S257], [S258], [S271], [S357] — API behaviour gaps
- [S178], [S180], [S186], [S188], [S189], [S191], [S193], [S198], [S236], [S238], [S387] — practitioner gaps
- [S276], [S278], [S280], [S281], [S282], [S284], [S285], [S286], [S287], [S298], [S300], [S304], [S325], [S328] — frontier gaps
- [S30], [S42], [S158], [S362], [S363], [S406], [S407] — colour, sound, versions
