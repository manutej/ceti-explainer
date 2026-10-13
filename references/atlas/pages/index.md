---
id: index
title: "p5.js Explainer Atlas"
type: Concept
aliases: ["atlas home", "home"]
sources: [S1, S4, S8, S9, S10, S11, S18, S46, S47, S48, S62, S114, S127, S131, S143, S144, S170, S180, S188, S229, S233, S274, S275, S283, S285, S325, S328, S334, S345, S357, S362, S367, S374, S386, S404]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# p5.js Explainer Atlas

## Definition
The p5.js Explainer Atlas is a persistent, cited wiki on using p5.js 2.x to build explainer animations and videos: the language and API, motion and rendering, production pipelines and alternatives, and the people, works and community around it. It is current to 8 October 2026, when p5.js 2.3.4 (25 Sep 2026) was npm `latest` and 2.4 was in development on `main` [S362][S10].

## Details
### What it covers
- **Language and core API** — the sketch model, 15 reference modules, 2.x constructs and migration [S1][S4][S357].
- **Motion, timing and rendering** — clocks, determinism, easing, WebGL/WebGPU, strands, performance [S127][S47][S48].
- **Explainer production** — engine architecture, frame-accurate export, libraries, tooling and alternative engines such as Manim and Remotion [S131][S170][S229].
- **People, works and community** — practitioners, books, courses, generative works, institutions, releases [S180][S345].
- Every substantive line cites a source id; version facts carry badges such as **[2.x]**, **[changed in 2.x]** and **[main / unreleased]** [S4][S11].

### How to navigate
- Start at a cluster hub: [[hub-language-core]] (language and API), [[hub-motion-rendering]] (motion, timing, rendering), [[hub-explainer-production]] (production and tools), [[hub-people-community]] (people, works, community), [[hub-sites]] (source sites).
- Synthesis pages: [[capability-map]] (what p5 2.x can do, by module), [[mastery-ladder]] (novice→expert path), [[explainer-engine-blueprint]] (target architecture), [[video-export-pipeline]] (frame-accurate export), [[version-2x-migration]] (1.x→2.x), [[frontier-2026]] (new vs hype), [[open-questions]] (conflicts and gaps).
- Reference modules: [[module-structure]], [[module-environment]], [[module-rendering]], [[module-shape]], [[module-color]], [[module-typography]], [[module-image]], [[module-transform]], [[module-3d]], [[module-math]], [[module-io]], [[module-events]], [[module-dom]], [[module-data]], [[module-constants]].
- Key entry points: [[p5js]], [[p5js-2x]], [[pure-function-of-t]], [[frame-stepped-export]], [[p5-strands]], [[coding-train-episode-package]].

### Ten findings that matter for explainer video
1. **There is no built-in frame-accurate video export.** `saveGif` is GIF-only, `saveFrames` is real-time and capped (15 s, ~22 fps), so serious export means stepping frames offline and encoding — see [[video-export-pipeline]] [S143][S144][S131].
2. **Make every frame a pure function of time.** `frameRate()` only sets a target and `millis()`/`deltaTime` read wall time, so reproducible output needs an owned clock driving `renderAt(t)` with `noLoop()` + `redraw()` stepping — see [[pure-function-of-t]] [S18][S127][S9].
3. **No mature p5 explainer engine exists.** Tween helpers, scene routers, loop helpers and recorders are scattered; Manim.js and p5.teach are the closest ports — see [[explainer-engine-blueprint]] [S170][S328][S325].
4. **2.x is now the default everywhere.** 2.0.0 shipped 17 Apr 2025, 1.x froze end of March 2026, npm `latest` is 2.3.4 and the Web Editor switched on 31 Jul 2026 — see [[editor-default-switch]] [S4][S114][S362][S404].
5. **2.x breaks common explainer code.** `preload()` gave way to async setup, `curveVertex` to `splineVertex`, and v2.3.1 renamed HDR to P3; LLM-generated code skews toward 1.x idioms, so pin versions — see [[version-2x-migration]] [S11][S62][S283].
6. **2.x typography is explainer-grade.** Variable-font `textWeight`, `textToContours` and `textToModel` enable kinetic titles and glyph morphs — see [[kinetic-typography]] [S46][S334][S4].
7. **The GPU path is the frontier.** p5.strands writes shaders in JS, WebGPU (experimental, 2.2) gained compute in 2.3, and `instances()` for thousands of elements is merged for 2.4 — see [[frontier-2026]] [S47][S274][S275].
8. **Export is the community's top recurring pain.** Screen recording drops frames; maintainers recommend p5.record.js manual mode or Electron + FFmpeg PNG sequences — see [[community-export-pain]] [S131][S233].
9. **Determinism discipline already exists in generative art.** Art Blocks forbids `Math.random()`/`Date.now()`, requires hash seeding and relative geometry; Fidenza scales against a 2000-unit reference width — see [[seeded-determinism]] [S374][S367].
10. **Distribution beats animation polish.** The Coding Train pairs each video with chapters, a runnable editor sketch and a remix showcase, while no mainstream post-produced explainer channel was verified as p5-animated; research LLM explainer agents target Manim, not p5 — see [[coding-train-episode-package]], [[llm-explainer-agents]] [S386][S188][S285].

## Relations
- related_to [[hub-language-core]] (structural)
- related_to [[hub-motion-rendering]] (structural)
- related_to [[hub-explainer-production]] (structural)
- related_to [[hub-people-community]] (structural)
- related_to [[mastery-ladder]] — learning path [S8]
- related_to [[open-questions]] — conflicts and gaps [S404]

## Sources
- [S1] — p5.js reference index (v2)
- [S4] — v2.0.0 release notes
- [S8], [S9], [S18], [S127] — lifecycle, redraw, frameRate, deltaTime references
- [S10], [S362] — GitHub releases; npm registry
- [S11], [S62] — compatibility README; v2.3.1 notes
- [S46], [S334] — 2.0 typography track; textToContours reference
- [S47], [S48], [S274], [S275] — strands, WebGPU, 2.3.0, instancing
- [S114], [S404] — switch plan; Web Editor releases
- [S131], [S233] — 2026 export thread; p5.record.js
- [S143], [S144] — saveGif, saveFrames
- [S170], [S325], [S328] — engine survey, p5.teach, Manim.js
- [S180], [S345] — Coding Train; PF history
- [S188], [S285], [S386] — Bees and Bombs; TheoremExplainAgent; challenge pages
- [S229] — code-to-video comparison
- [S283] — hermes-agent p5js skill
- [S357] — reference survey
- [S367], [S374] — Fidenza review; Art Blocks docs
