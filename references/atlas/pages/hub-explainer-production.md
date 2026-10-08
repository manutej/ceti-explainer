---
id: hub-explainer-production
title: "Hub: Explainer production"
type: Concept
aliases: ["C3 hub"]
sources: [S1, S9, S11, S46, S47, S75, S94, S95, S99, S114, S131, S134, S137, S138, S141, S143, S144, S145, S146, S147, S148, S152, S153, S155, S156, S157, S158, S159, S160, S161, S162, S163, S165, S166, S167, S168, S169, S170, S171, S175, S218, S219, S228, S233, S238, S239, S245, S247, S248, S249, S250, S252, S254, S274, S276, S282, S283, S284, S285, S287, S295, S300, S301, S302, S303, S305, S306, S308, S309, S310, S311, S312, S313, S314, S317, S318, S319, S320, S321, S322, S323, S325, S326, S328, S329, S330, S332, S333, S334, S362, S396, S399, S400, S401, S403, S404, S405, S409, S410, S411, S413, S414]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Hub: Explainer production

## Definition

This hub indexes every page about producing p5.js explainer videos and animations: engine architecture, export pipelines, tools, libraries, alternatives, developer tooling and AI authoring, drawn from branches on video export, the add-on ecosystem, alternatives, tooling, explainer architecture and gap-closing research. [S131][S156][S317]

## Details

### State of the field (2026-10-08)
- p5.js 2.x is current: 2.0 on 2025-04-17, latest 2.3.4 on 2026-09-25, with 2.4 on main; the Web Editor made 2.x its default on 2026-07-31 and 1.x was frozen at the end of March 2026. **[2.x]** [S75][S362][S404][S114]
- There is no built-in timeline and no built-in frame-accurate video export; practitioners drive p5 with noLoop/redraw plus a capture library, or an Electron or server renderer, then stitch with ffmpeg. [S131][S233]
- The architecture ideas come from Remotion, Motion Canvas/Revideo and Manim, not from p5 libraries; no mature p5 explainer engine exists. [S317][S311][S322][S170]
- The only documented hybrid is canvas-sketch hosting p5 with a playhead; p5-in-Remotion, GSAP-driven p5 and Theatre.js-with-p5 are undocumented inferences. [S401][S396][S403]
- Add-on ecosystem: the libraries directory lists 54 libraries and marks none of the animation or export ones as v2-compatible; p5.brush, p5.sound and p5.tree are the clearest 2.x-ready examples. [S156][S300][S159]
- AI authoring is practitioner tooling with no rigorous evaluation, and explainer-video research uses Manim. [S283][S285][S287]
### Where to start
- Build the engine: [[explainer-engine-blueprint]]. [S317]
- Ship the video: [[video-export-pipeline]]. [S131]
- Pin versions first: [[cdn-version-pinning]]. [S405]

## Pages: Concept (3)

- [[explainer-engine-blueprint]] — The explainer engine blueprint is a layered design for a seekable, scrubbable, exportable p5.js explainer-video engine: Clock, then Timeline (tracks… [S317][S318]
- [[video-export-pipeline]] — The video export pipeline is the end-to-end route from a deterministic p5 sketch to a finished MP4 or GIF: pre-flight, frame driver, frame sink… [S131][S144]
- [[ai-assisted-p5]] — AI-assisted p5.js authoring covers LLM code generation, agent skills and research tools; evidence is mostly practitioner tooling with no rigorous… [S252][S283]

## Pages: Pattern (10)

- [[audio-post-mux]] — Audio post-muxing is the pattern of rendering a silent video first and adding the voiceover afterwards with ffmpeg, because stepped and virtual-clock… [S137][S138]
- [[explainer-clock]] — One clock, three modes is the explainer-engine pattern in which all scene code reads a single clock.t, which is live wall time, an audio-derived… [S146][S308]
- [[track-tween]] — A track tween is the pattern of modelling every animated number or colour as a pure, clamped function of t with a start, duration, endpoints and an… [S323][S317]
- [[timeline-builder]] — A timeline builder is the authoring pattern that offers play, wait, all and stagger like Manim's play()/wait() or Motion Canvas's all/sequence, but… [S322][S311]
- [[scene-local-time]] — Scene-local time shifts t per scene so each scene sees its own zero, as Remotion's Sequence does with its from offset and nested offsets adding up [S319]
- [[beats-and-captions]] — Beats and captions derive both the narrative structure and the on-screen subtitles from the same timeline, as Manim attaches subcaptions to play()… [S322]
- [[audio-master-clock]] — The audio master clock pattern uses the voiceover's playback time as t and stores named voiceover markers as data, the p5 analogue of Motion Canvas… [S313]
- [[derived-geometry]] — Derived geometry (signals-lite) computes dependent sizes, endpoints and labels inside render(t) from tracked primitives and never stores them… [S314]
- [[third-party-timeline-driving]] — Driving third-party timelines from p5 means treating GSAP or Theatre.js as value stores that p5 seeks each frame, never as clocks that tick… [S321][S320]
- [[cdn-version-pinning]] — CDN version pinning means loading an exact p5 version (and matching add-on versions) from a CDN rather than a floating tag, because unpinned tags… [S238][S405]

## Pages: Technique (7)

- [[frame-stepped-export]] — Frame-stepped export is the technique of stopping p5's own loop and advancing time by exactly 1/fps per captured frame, so output is identical… [S146][S308]
- [[png-sequence-ffmpeg]] — PNG sequence plus ffmpeg is the technique of rendering numbered frames offline and encoding them with ffmpeg (libx264, yuv420p), the route the 2026… [S131][S137]
- [[electron-ffmpeg-export]] — Electron plus ffmpeg export is davepagurek's client-work setup: run the sketch in Electron, save each canvas frame as a PNG through Node, then run… [S131]
- [[puppeteer-capture]] — Puppeteer headless capture runs the sketch in headless Chrome, calls redraw() per frame and screenshots the canvas, then assembles the frames with… [S137]
- [[virtual-clock-capture]] — Virtual-clock capture hooks the browser's time APIs so a sketch that already reads millis() or Date advances one fixed step per captured frame… [S138]
- [[generator-scenes]] — Generator scenes write a scene as a function* whose yields mark frames and whose yield* delegates to tweens, the style of Motion Canvas and Revideo [S311][S312]
- [[kinetic-typography]] — Kinetic typography in p5 2.x animates text through variable-font textWeight(), glyph outlines from textToContours(), and extruded 3D text from… [S46][S334]

## Pages: Capability (1)

- [[typescript-types]] — p5.js ships bundled TypeScript types generated from its docs, a single p5.d.ts plus global.d.ts, credited to release 2.1; the old @types/p5 package… [S47][S245]

## Pages: Construct (3)

- [[save-gif]] — saveGif(filename, duration, [options]) is the p5 built-in that records a stretch of the sketch into an animated GIF; it can be called in setup() or… [S143]
- [[save-frames]] — saveFrames(filename, extension, duration, framerate, [callback]) is the p5 built-in that captures PNG or JPG frames, downloading each file or handing… [S144]
- [[save-canvas]] — saveCanvas() is the p5 built-in that exports a single canvas frame as an image file; stepped exporters call it once per frame [S131]

## Pages: Tool (16)

- [[ffmpeg]] — ffmpeg is the command-line encoder used in nearly every p5 export pipeline for PNG-sequence assembly, audio muxing, palette GIFs and concatenation [S137][S131]
- [[canvas-sketch]] — canvas-sketch is Matt DesLauriers' framework that owns the frame loop, sizing and export and makes no assumptions about the drawing library; it has… [S399][S400]
- [[remotion]] — Remotion is a React framework that treats a video as a function of the current frame: useCurrentFrame() is the only input to animation logic, and… [S317][S318]
- [[motion-canvas]] — Motion Canvas is an open-source TypeScript animation tool with generator-based imperative timelines, a browser editor, signals and drag-to-align time… [S312][S313]
- [[revideo]] — Revideo is a fork of Motion Canvas that keeps the generator flow API and adds a Node.js renderVideo() for headless, server-side video generation [S311][S228]
- [[manim]] — Manim is the Python math-animation engine built on Scene.construct with play() and wait(), and Animation.interpolate(alpha) with run_time and… [S322][S323]
- [[touchdesigner]] — TouchDesigner is Derivative's visual development platform for realtime projects; the retrieved product page was thin, with no node, platform or… [S414]
- [[openframeworks]] — openFrameworks is an MIT-licensed C++ creative-coding toolkit for Windows, macOS, Linux, iOS and Android with 1,500+ community addons, wrapping… [S411]
- [[vscode-live-server]] — The VS Code workflow for p5 uses plain editing plus Live Server (or the P5 Server extension, or a 2.0 project-generator extension) with one HTML file… [S254][S156]
- [[vite]] — Vite is the dev server and bundler used in community p5 plus TypeScript projects; known 2.x pitfalls are preload() errors and global-mode typing [S247][S248]
- [[processing-p5-mode]] — Processing p5.js Mode is the Electron-based Processing editor mode for p5 sketches; it can call Node and ffmpeg, but its experimental 2.x version had… [S131][S238]
- [[custom-build-server]] — The custom build server is an alpha on-demand service that builds p5 with selected modules via ?modules=, discussed in issue #8003 and shipped as a… [S295][S274]
- [[teachable-machine]] — Teachable Machine is Google's web GUI for training classifiers without code; the paper reported 182,000+ users in 201 countries and 125,000+ models [S218]
- [[algorithmic-art-skill]] — The algorithmic-art skill is Anthropic's Claude agent skill that writes a philosophy statement and then produces seeded p5.js generative art; it… [S282]
- [[hermes-agent-p5js-skill]] — The hermes-agent p5js skill (Nous Research) is an agent skill pipeline for p5 sketches with headless HTML, PNG, SVG, MP4 and GIF export, first seen… [S283]
- [[genart-mcp]] — genart-mcp (@genart-dev/mcp-server) is an MCP server that lets agents create, fork, screenshot and export sketches across p5, Three.js, GLSL… [S284]

## Pages: Platform (4)

- [[webcodecs]] — WebCodecs is the browser API (VideoEncoder) that lets CCapture's mp4/webm modes, and per a search listing canvas-record, encode frames without ffmpeg [S138][S155]
- [[butter]] — Butter for Developers is a video editor where p5 sketches are components, rendered frame by frame on a server; as of March 2026 it was capped at 2K… [S131]
- [[p5js-libraries-directory]] — The p5.js libraries directory on p5js.org lists 54 contributed libraries across 19 categories as of 2026-10-08, and only two entries explicitly… [S156]
- [[p5js-web-editor]] — The p5.js Web Editor is the browser IDE (editor.p5js.org) that made p5.js 2.x its default on 2026-07-31 (editor v2.22.0), keeping a version picker… [S404][S114]

## Pages: Library (42)

- [[mediabunny]] — Mediabunny is a JavaScript media toolkit that supersedes the deprecated mp4-muxer and includes CanvasSource for encoding a canvas straight to video… [S147][S148]
- [[ccapture]] — CCapture.js is a virtual-clock canvas recorder (TimeWarp plus FrameWrap) that renders at machine speed while time advances one fixed step per… [S138]
- [[p5-capture]] — p5.capture (tapioca24) is a GUI plus P5Capture API recorder that hooks p5's draw and records each rendered frame as WebM, GIF, MP4, or zipped… [S145][S146]
- [[p5-record]] — p5.record.js (limzykenneth) is a community p5 add-on that records sketches to WebM or image-sequence ZIPs and has a manual per-frame mode tied to… [S233]
- [[p5-save-frames]] — p5.save-frames is an npm p5 add-on that saves frames without the built-in 15 s cap, in a sync mode that follows the render rate or an async mode with… [S134]
- [[canvas-capture]] — canvas-capture (amandaghassaei/canvas-capture) is a generic canvas recorder that outputs MP4, GIF, PNG or JPEG sequences and is not p5-specific [S152]
- [[p5-videorecorder]] — p5.videorecorder (Caleb Foss) is a real-time MediaRecorder canvas recorder that includes p5.sound output by default [S310]
- [[p5-create-loop]] — p5.createLoop (Petey Hayman) adds createLoop() to p5, exposing a seamless-loop clock as progress (0 to 1) and theta (0 to TWO_PI), looping noise and… [S141]
- [[p5-node]] — p5-node (andithemudkip) is an npm package that runs p5 under JSDOM in Node; a 2021 thread found it works for static images but pulls roughly 100 MB… [S153]
- [[manim-js]] — Manim.js (JazonJiao) is a p5 instance-mode recreation of 3Blue1Brown-style animations focused on linear algebra and graph algorithms, with objects… [S328]
- [[p5-teach]] — p5.teach.js is a Manim- and reanimate-inspired p5 add-on from GSoC 2021 for animating text, TeX and graphs, with a Scene, timeline and play/pause… [S325][S326]
- [[gsap]] — GSAP is the JavaScript tweening and timeline engine whose timelines support seek(seconds) and progress(0..1), and which Webflow made free for… [S332][S333]
- [[theatre-js]] — Theatre.js is a visual sequencing toolkit of projects, sheets, objects and sequences with a seekable playhead, a studio editor and audio attachment [S329][S330]
- [[timeplate]] — JS timeline micro-libraries (timeplate, mattdesl/keyframes, Timeliner) are small non-p5 helpers for millisecond timelines, unitless keyframe lists… [S305][S306]
- [[p5-tween]] — p5.tween (Milchreis) is a p5 add-on for chained property tweens with named easings and loop/end callbacks, timed in milliseconds [S170]
- [[p5-scenemanager]] — p5.SceneManager (mveteanu / CodeGuppy) is a router that forwards p5 events (setup, draw, mousePressed) to the active scene class and switches with… [S301]
- [[p5-animation-framework]] — p5_animationFramework (pirelaurent) is a class hierarchy plus scenario/journey scheduler for p5 3D animations, built for the cyber-opera Terres Rares… [S302][S303]
- [[p5-anims]] — p5.animS (wixette) animates p5 shapes by replaying how they are drawn over a given number of frames, keeping per-shape state through a unique ID [S309]
- [[d3]] — D3 is a low-level data-visualisation toolkit of about 30 modules that targets SVG and Canvas and has no concept of charts and no default presentation [S409]
- [[three-js]] — three.js is a 3D library with scenes, lights, shadows, materials and textures layered over WebGL; its manual's basic loop updates rotations from the… [S410]
- [[lottie]] — Lottie renders After Effects animations exported as JSON via Bodymovin on Android, iOS, Web and Windows [S413]
- [[p5-sound]] — p5.sound.js is the official audio add-on, rebuilt from scratch on Tone.js (announced 2024-12-16) as a minimal abstraction that works with both p5 1… [S158][S165]
- [[tone-js]] — Tone.js is the Web Audio framework (by Yotam Mann) that the rebuilt p5.sound.js wraps; npm 15.1.22 was published 2025-04-27 and the package was… [S158][S159]
- [[p5-brush]] — p5.brush (Alejandro Campos Uribe) provides custom brushes, natural fills, hatching and vector-field strokes for p5, and is the clearest 2.x-native… [S157]
- [[p5-scribble]] — p5.scribble.js (generative-light) gives hand-drawn, sketchy 2D primitives (scribbleLine, Curve, Rect, RoundedRect, Ellipse, Filling) as a port of… [S167]
- [[rough-js]] — rough.js is a roughly 9 kB framework-agnostic library for sketchy drawing on canvas and SVG, with hachure, solid, zigzag, cross-hatch, dots and… [S163]
- [[p5-grain]] — p5.grain (meezwhite) adds film grain and texture overlays to p5 sketches with deterministic randomness; API: applyMonochromaticGrain… [S166]
- [[p5-fillgradient]] — p5.fillGradient (alterebro) provides linear, radial and conic gradient fills via fillGradient(type, props, ctx) [S168]
- [[p5js-svg]] — p5.js-svg (Zeno Zeng) adds an SVG canvas mode via createCanvas(w, h, SVG) using svgcanvas, and its README claims compatibility with p5.js 1.11.x only [S161]
- [[p5-riso]] — p5.riso (Sam Lavigne and Tega Brain) generates files for Risograph printing; the libraries page lists it, but its repo and API were not read [S156]
- [[p5-polar]] — p5.Polar is a polar-coordinate and geometric-pattern library; only search-result titles (a WPI thesis and the npm package @liz-peng/p5.polar) were… [S175]
- [[p5-collide2d]] — p5.collide2D (Ben Moren) provides 2D boolean collision-detection functions with Vector variants such as collidePointPoly and collideCircleCircle [S162]
- [[matter-js]] — Matter.js is a 2D rigid-body physics engine commonly drawn with p5, taught in The Coding Train's physics-libraries track [S171]
- [[p5play]] — p5play is a game engine on p5 or q5 graphics with Box2D (planck) physics, whose author said in June 2025 that p5.js v2 support was subpar [S169][S160]
- [[q5js]] — q5.js is Quinton Ashley's lightweight p5-compatible renderer that keeps preload by default and positions itself as more backward compatible than p5… [S239][S169]
- [[p5-tree]] — p5.tree is listed in the libraries directory as a render pipeline for p5 v2, covering camera, visibility and post-processing [S156]
- [[tweakpane]] — Tweakpane is a dependency-free parameter pane with input bindings (Number, String, Boolean, Color, Point), monitors including graphs, folders… [S94]
- [[lil-gui]] — lil-gui is a small (about 29.8 kB minified) GUI library by George Michael Brower that builds controllers from property types via add(), addColor()… [S95]
- [[p5-gui]] — p5.gui (bitcraftlab) auto-generates a GUI from sketch variables using QuickSettings, supports instance mode via p.createGui(this), and uses… [S99]
- [[p5-wrapper-react]] — @p5-wrapper/react v5 is the React wrapper that requires p5 >= 2.0.0 and React >= 19, works in instance mode and ships its own types; Next.js users… [S249]
- [[p5i]] — p5i (Anthony Fu) is an instance-mode wrapper that allows destructuring and deferred mounting, with TypeScript types [S250]
- [[ml5js]] — ml5.js is the friendly browser ML library from NYU ITP/IMA built on TensorFlow.js; ml5-next-gen reached v1.4.0 (7 Aug, 2026 inferred) and its… [S219][S276]

## Gaps across this cluster

- CCapture.js maintenance is disputed between a March 2026 forum post and its README. [S131][S138]
- p5 2.x compatibility is undocumented for most animation, export and aesthetic add-ons; only npm metadata and dates are known. [S300][S159]
- Hybrid p5 workflows with Remotion, GSAP, Theatre.js and Motion Canvas have no sourced examples. [S396][S403]
- The Editor default date differs between sources (July versus August 2026) although the editor log shows 31 July. [S47][S11][S404]
- Comparison pages for D3, three.js, Lottie and TouchDesigner give scope descriptions only. [S409][S410][S413][S414]

## Relations

- related_to [[explainer-engine-blueprint]] — scene and timing architecture [S317]
- related_to [[video-export-pipeline]] — export end-to-end [S131]
- related_to [[hub-language-core]] (structural)
- related_to [[hub-motion-rendering]] (structural)
- related_to [[hub-people-community]] (structural)
- related_to [[p5js-libraries-directory]] — official library discovery [S156]

## Sources

- [S1] — Reference index (v2) (Processing Foundation / p5.js, undated (v2.3.x))
- [S9] — redraw() reference (p5.js, undated)
- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S46] — Coding Train p5.js 2.0 typography (The Coding Train, undated)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU (Processing Foundation, 2026-03-09)
- [S75] — [dev updates] p5.js 2.0: You Are Here (Processing Foundation Discourse, 2025 (exact date not captured))
- [S94] — Tweakpane docs home (Tweakpane (cocopon), undated, shows 4.0.5)
- [S95] — lil-gui docs (George Michael Brower, undated)
- [S99] — p5.gui README (bitcraftlab, undated)
- [S114] — Issue #8870 plan to make 2.x the Editor default (processing/p5.js, 2026)
- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S134] — p5.save-frames (npm package page, undated)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S141] — p5.createLoop (Petey Hayman, README mentions 0.3.0 dated 04/02/2023)
- [S143] — p5.js reference: saveGif() (p5.js docs (page links v2.3.3 source), undated)
- [S144] — p5.js reference: saveFrames() (p5.js docs, undated)
- [S145] — tapioca24/p5.capture README (tapioca24, undated)
- [S146] — 'I wrote a new library for recording p5.js sketches' (tapioca24, 2022-03-27)
- [S147] — Vanilagy/mp4-muxer README (Vanilagy, undated)
- [S148] — Mediabunny CanvasSource API (Mediabunny docs, undated)
- [S152] — amandaghassaei/canvas-capture README (Amanda Ghassaei, undated (footer 2026))
- [S153] — Discourse: server-side render using node-canvas (DCsan, micuat, 2021-04-05)
- [S155] — Search listing only (not opened): canvas-record WebCodecsEncoder, Mediabunny quick-start/writing-media-files, p5.save-frames on npm, abachman/p5.webm-capture, p5.createLoop on npm (URLs in search results of 2026-10-08, kind: community (unverified))
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S157] — p5.brush repo (Alejandro Campos Uribe, undated)
- [S158] — p5.sound.js repo (Processing Foundation, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S160] — p5play progress June 2025 (q5js/p5play author newsletter, June 2025)
- [S161] — p5.js-svg repo (Zeno Zeng, undated)
- [S162] — p5.collide2D repo (Ben Moren, undated)
- [S163] — rough.js repo (Preet Shihn / rough-stuff, undated)
- [S165] — Announcing the new p5.sound.js library (Processing Foundation, 2024-12-16)
- [S166] — p5.grain repo (meezwhite / Joseph Miclaus, undated)
- [S167] — p5.scribble.js repo (generative-light, undated)
- [S168] — p5.fillGradient repo (Jorge Moreno (alterebro), undated)
- [S169] — p5play README (v3.35.3) (Quinton Ashley, 2026)
- [S170] — p5.tween repo (Milchreis, undated)
- [S171] — Coding Train 6.1 Matter.js Introduction (The Coding Train (Daniel Shiffman), undated)
- [S175] — Search result: p5.Polar (WPI thesis 'p5.Polar - Programming For Geometric Patterns') (undated, kind: academic (title only, not fetched))
- [S218] — Teachable Machine: Approachable Web-Based Tool for Exploring ML Classification (Howell et al., Google Research, 2020)
- [S219] — ml5.js About (ml5.js project, undated)
- [S228] — Remotion vs Motion Canvas vs Revideo programmatic video 2026 (PkgPulse, 2026 (exact date not seen))
- [S233] — p5.record.js (limzykenneth, undated)
- [S238] — How to manually modify the P5js plugin (stable version) to use the 2.0 version? (Processing Discourse (EricRogerGarcia, glv, quark), 2026-05-14 to 2026-06-01)
- [S239] — p5.js preload system removed from v2 (Quinton Ashley (q5.js author), Substack, 2025-01-20 (modified 2025-11-19))
- [S245] — PR #8114 TypeScript type generation refactor (p5.js contributors, undated)
- [S247] — Discourse: preload() with Vite + TypeScript error (Processing Community Forum, undated)
- [S248] — p5.js issue #8302 (TS + `import p5/global`, v2.1.1) (p5.js contributors, undated)
- [S249] — P5-wrapper/react README (P5 Wrapper authors, undated)
- [S250] — antfu/p5i README (Anthony Fu, undated)
- [S252] — Chatting with/about Code (Ciston, Martinez, Atairu) (p5js.org, undated (refs 2024))
- [S254] — Oliver Steele, VS Code for p5.js (Oliver Steele, undated)
- [S274] — What's New in p5.js 2.3.0! (Processing Foundation, 2026-06-22)
- [S276] — ml5-next-gen releases (ml5.js team, v1.4.0 dated 07 Aug (2026 inferred; see Gaps))
- [S282] — Anthropic algorithmic-art skill listing (vibeindex (aggregator of anthropics/skills), updated 2026-06-09)
- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
- [S284] — genart-mcp (@genart-dev/mcp-server) (glama.ai MCP directory, undated)
- [S285] — TheoremExplainAgent (Ku, Chong, Leung, Shah, Yu, Chen, 2025-02-26 (v2 2025-05-25))
- [S287] — LLM2Manim: Pedagogy-Aware AI Generation of STEM Animations (Joshi, Ke, Gajjar, Christian, Wang, Chen (SDSU), 2026-04-07)
- [S295] — Issue #8003: Distributing custom builds (p5.js 2.0) (processing/p5.js (limzykenneth et al.), undated)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
- [S301] — p5.SceneManager README (mveteanu / CodeGuppy, undated)
- [S302] — p5_animationFramework README (pirelaurent, undated)
- [S303] — 'Free productive animation framework for p5.js' (pirela (Processing Forum), 2022-04-07)
- [S305] — timeplate README (ScarletsFiction/StefansArya, undated)
- [S306] — keyframes README (Matt DesLauriers, undated)
- [S308] — 'How to save canvas animations with CCapture' (Ibby EL-Serafy, 2019-03-22)
- [S309] — p5.animS README (wixette, undated)
- [S310] — p5.videorecorder README (Caleb Foss, undated)
- [S311] — Revideo 'Animation flow' (Revideo (Motion Canvas fork), undated)
- [S312] — Motion Canvas Quickstart (Motion Canvas, undated)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
- [S314] — Motion Canvas Signals (Motion Canvas, undated)
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S318] — Remotion 'The fundamentals' (Remotion, undated)
- [S319] — Remotion `<Sequence>` (Remotion, undated)
- [S320] — Remotion `<ThreeCanvas>` (Remotion, undated)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
- [S322] — Manim Community `Scene` reference (Manim Community, undated)
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
- [S325] — 'p5.teach: Teaching Math through Animations and Simulations' (Aditya Siddheshwar / Processing Foundation, 2021-09-22)
- [S326] — 'Animating maths in p5.js' (two.ticks (Processing Forum), 2021-08-05)
- [S328] — Manim.js README (Jazon Jiao, undated)
- [S329] — Theatre.js @theatre/core API (Theatre.js, undated)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S332] — GSAP core docs (GSAP (Webflow), undated)
- [S333] — 'Webflow makes GSAP 100% free' (Webflow, 2025 (last updated 2026-06-16))
- [S334] — p5.Font `textToContours()` reference (p5.js (v2.3.3), undated)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17) (npm, accessed 2026-10-08)
- [S396] — Remotion docs, Third-party libraries (Remotion, undated)
- [S399] — canvas-sketch docs README (Matt DesLauriers, undated)
- [S400] — canvas-sketch docs, WebGL/Three.js/P5.js section (Matt DesLauriers, undated)
- [S401] — canvas-sketch example animated-p5.js (Matt DesLauriers, undated)
- [S403] — Theatre.js docs, Sheet Objects (Theatre.js, undated)
- [S404] — p5.js Web Editor GitHub Releases (Processing Foundation, day/month only (year not shown))
- [S405] — p5.js Download page (p5.js team, undated)
- [S409] — D3 docs, What is D3? (Observable / D3, undated)
- [S410] — three.js manual, Fundamentals (three.js, undated)
- [S411] — openFrameworks, About (openFrameworks, undated)
- [S413] — Lottie home (Airbnb, undated)
- [S414] — Derivative product page (Derivative, undated)
