# R-C · Cinematic rendering for frame-stepped WebGL explainers · 2026-10-10

Scope: offline, frame-stepped export (arsenal/tools/export.mjs: seek(t) -> screenshot -> ffmpeg libx264/yuv420p).
No real-time limit, software GL ok. Baseline from arsenal/WAVE-GL.md: webgl-scene ~0.4 s/frame at 960x540 dsf 2
(1920x1080) on SwiftShader. Cost columns are MULTIPLIERS on that baseline; they are engineering estimates unless
a source is cited. Measure with export.mjs (prints seconds/frame) before committing any of them to a film.
Evidence grades: [S] sourced below, [E] estimate from first principles, to be benchmarked, [U] unverified.

## Why this is cheap for us
Every law already holds: render(t) is pure, so a frame may be drawn many times at sub-instants of t and averaged.
Accumulation (motion blur, AA, DoF, soft shadow) is the one technique family that needs NO new shader maths, only
"render N times with a jitter, add into a float buffer, divide". It is also order-independent, so it re-seeks
identically (export.mjs hash check keeps passing) provided the jitter table is a fixed constant (Halton, not random).

## Ranked: the 8 techniques worth adding to the post stack

### 1. Tone map + colour management as the LAST pass (do first; ~free)
- Buys: highlights roll off instead of clipping; every later effect (bloom, grain) works in linear light; brand
  colours stay recognisable. The single biggest "demo -> film" step.
- Recipe: render scene into RGBA16F (EXT_color_buffer_float or EXT_color_buffer_half_float, both common in WebGL2)
  in LINEAR light; do bloom/grain there; final full-screen pass = exposure * x -> tonemap -> sRGB OETF (or let
  the canvas do it) -> 8-bit. pmndrs/postprocessing does the same: HalfFloatType frame buffers, renderer
  toneMapping = NoToneMapping, ToneMappingEffect last [S: pmndrs README, three.js forum thread].
- Which curve for DATA colours: do not use the Narkowicz ACES fit raw: it is a 5-constant rational
  (2.51,0.03,2.43,0.59,0.14) that oversaturates and shifts hue [S: Narkowicz via glsl-tone-map; Wronski/bruop
  notes]. Use Khronos PBR Neutral (May 2024): channels in 0.08-0.8 pass through exactly, no hue shift, highlight
  compression only above K_s=0.76, K_d=0.15 desaturation [S: Khronos README]. Rule: palette tokens must round-trip
  (|dE| < 2 in Lab at mid-tones) through the curve; test with brand_check.py. Use ACES-like only for
  non-data imagery (glow, background).
- Display P3: gl.drawingBufferColorSpace = "display-p3" exists (Baseline since Oct 2024) [S: MDN]; but H.264/yuv420p
  with a bt709 tag will mis-render P3 pixels [E, inference]. For MP4 social delivery stay sRGB/bt709: tag explicitly,
  `-vf scale=out_color_matrix=bt709:out_range=tv -colorspace bt709 -color_primaries bt709 -color_trc bt709`
  [U: flags from ffmpeg docs, not re-fetched]. Keep P3 for an optional HDR/ProRes master only.
- Cost: ~0.02-0.05x (one fullscreen pass). Float FBO doubles memory only.

### 2. Sub-frame accumulation: motion blur + AA in one loop (biggest quality / cost lever)
- Buys: true film-style motion blur (linear-light averaged), supersampled edge AA and sub-pixel stability (thin
  lines, text-adjacent geometry stop shimmering), identical in static shots (just converges).
- Recipe: for k in 0..N-1: t_k = t + (u_k - 0.5) * shutter / fps, with u_k = (k+0.5)/N (stratified; random jitter
  adds noise); camera projection jittered by a Halton(2,3) offset (dx,dy)/viewport applied to the clip-space xy
  (proj[2][0]+= 2dx/w; proj[2][1]+= 2dy/h); draw into RGBA16F; blend ONE,ONE with weight 1/N (or ping-pong
  accumulate shader). Accumulate in LINEAR light, not sRGB [S: PortOS #9077 averages in a linear-light buffer].
- Shutter: 180 degrees = 0.5 frame (1/48 s at 24 fps, 1/120 at 60 fps; same proportional blur) [S: studiobinder,
  provideocoalition]. For explainers prefer shutter 0.25-0.5; PortOS cites 0.2 as "short, filmic streak" [S].
  Blur only where there is motion: nothing moves in the pauses where the viewer commits a number.
- Samples: PortOS adaptive ladder 4 -> 12 -> 36 -> 108, stop when new average moves < tolerance (1-8 /255) [S];
  4 still shows stepped copies on fast moves [S]. three.js TAARenderPass accumulates 2^sampleLevel jittered samples
  (0..5 = 1..32) for static scenes only, no motion [S: three.js TAA example; fetch failed here, from search summary].
  Our rule: still shots 8 (AA only), slow moves 16, fast camera/morph 32-48, cap 64 [E].
- Cost: linear: N x scene cost (+ tiny blend). 0.4 s x 16 = 6.4 s/frame. A 40 s film at 30 fps = 1200 frames ->
  ~2 h at 16 samples on one core-set [E]. Mitigate: (a) adaptive N per frame from |dcamera|+|dmorph| between
  t and t+1/fps (the film knows its own motion), (b) render sub-frames at 0.5x res for N>16, (c) 4 parallel
  Chromium pages on 4 cores (SwiftShader already threads; test whether it scales) [E].
- Cheaper alternative if budget fails: per-pixel velocity buffer + directional blur (gkjohnson per-object motion
  blur, threejsdemos) [S: search results]. Smears instead of integrates; use only for camera moves.

### 3. Bloom, thresholded and brand-accent only
- Buys: the "lit" look; a glow that draws the eye to ONE claim. Law-compatible only if the glow is meaningful.
- Recipe (Jimenez, CoD:AW 2014): downsample chain 1/2..1/64 with the 13-tap filter (first step Karis-averaged
  to kill fireflies), upsample with a 9-tap tent, add back with strength ~0.04-0.12 [S: iryoku.com, LearnOpenGL
  Phys. Based Bloom, froyok]. Selective: write accent marks with emission > 1.0 into the float buffer, set
  luminance threshold 1.0 so everything inside 0-1 contributes nothing (pmndrs: "bloom is selective by default,
  glow via colours outside 0-1" [S: react-postprocessing docs]). Plain data marks stay <= 0.9 and never glow.
- Pitfall: tone map AFTER bloom, or a red accent turns orange [S: three.js forum thread].
- Cost: 6 downsample + 6 upsample passes on shrinking targets ~ 0.3-0.5x of a 1080p fullscreen pass each, total
  ~0.1x baseline [E]. Cheaper: glsl-fast-gaussian-blur (MIT, 5/9/13 taps, needs LINEAR filtering, separable)
  [S: GitHub] at 1/4 res for a single halo.
- Not accumulated: run once on the averaged frame (it is already stable), saving N x.

### 4. Film grain + vignette that survive H.264
- Buys: breaks 8-bit banding in dark gradients (the real problem, see export pipeline "dark values crushed"),
  unifies flat vector + 3D into one image, hides compression blocking.
- Hard facts: grain is random so it costs bitrate [S: VideoHelp/Doom9]; x264 `--tune grain` over-enhances, `film`
  is often preferred; psy-rd >= 1 retains grain, higher aq-strength (1.8-1.9) reduces banding; 10-bit is the most
  effective anti-banding but not hardware-decodable everywhere [S: VideoHelp threads, 2012-2019 vintage].
- Recipe: grain applied in the FINAL pass, AFTER tone map, in display space: g = (hash(px, frame) - 0.5) *
  amp * (1 - luma)^0.5, amp 0.012-0.02 (about 3-5 /255) so it dithers without shouting. Luma-weighted so the
  brightest regions stay clean; blue-noise or 2-3 px low-passed grain compresses far better than white per-pixel
  noise [E]. Seed from frame index only (pure of t). Vignette: smooth radial -8 to -15 % at the corners,
  multiplicative, very low frequency, costs nothing in bitrate.
- Encode: `-c:v libx264 -preset slow -crf 16 -tune film -x264-params aq-mode=3:aq-strength=1.2:psy-rd=1.0,0.15
  -pix_fmt yuv420p` and compare crf 16 vs 18 sizes [E]. Always do a dither-vs-no-dither A/B on the darkest
  gradient shot. Do not ship grain on exec-ink-clean level (CLAUDE.md: "exec level is ink and clean"): grain
  and vignette are for hero/teaser/social cuts only; default off.
- Cost: ~0.02x, one pass. Bitrate cost +20-60 % at same crf [E].

### 5. Soft shadows + baked AO for static geometry (depth cue without cost)
- Buys: bars/terrain/ribbons sit ON something; contact shading is what makes bar-city scenes read as 3D.
- Static geometry (heightfield, stack-city, bars in their resting place): BAKE. Compute per-vertex AO once in
  setup() by hemisphere ray casts against a coarse height grid (seeded, deterministic) and store in an
  attribute; multiply into the Lambert term. Cost per frame: zero; blur-free; stable across the whole film [E].
- Dynamic or morphing geometry: shadow map (2048^2 depth, RGBA8 or DEPTH_COMPONENT24 + sampler2DShadow with
  hardware PCF) + 12-16 tap Poisson/vogel-disc PCF rotated by a per-pixel hash, radius ~1.5-3 texels; soft
  but noisy, so let the sub-frame accumulation (#2) average the noise away: jitter the LIGHT position by a
  tiny disc per sub-frame instead of widening the kernel = physically soft penumbra for free [E, Haeberli-Akeley
  idea applied to the light; S: Haeberli & Akeley 1990 for the accumulation principle].
- three.js knobs, if ever used: shadow.radius only affects PCF, VSM adds blur samples; PCSS needs custom shader
  [U: from memory, search found nothing citable].
- Cost: shadow depth pass ~0.3x scene + ~0.1x lookup; baked AO 0.

### 6. Depth of field by accumulation (only for hero shots) and cheap fog depth cue
- Buys: focus pulls that direct attention to the claim; separation of the point-cloud foreground from the cloud.
- Accumulation DoF (Haeberli & Akeley 1990): jitter the camera position on the aperture disc while keeping the
  focal plane fixed: eye += aperture * (cos a, sin a) * sqrt(u), shear the frustum so the focal plane stays
  registered. Needs N views; the circle-of-confusion diameter grows linearly but required samples grow with
  its AREA [S: Haeberli/Akeley summary]. Bokeh quality is perfect (real disc, no halo artefacts), no depth buffer
  tricks needed, occluded geometry correct. Reuse the SAME loop as #2 (jitter time AND lens together):
  one N-sample pass gives MB + AA + DoF, so DoF adds ~0 marginal cost if N is already 32.
- Post DoF (single pass, depth-based gather, pmndrs DepthOfFieldEffect, scatter-as-gather bokeh) is far cheaper
  (~0.2x) but leaks sharp foreground over blurred background and its bokeh can bloom [S: pmndrs discussion #294].
  Use post DoF for backgrounds only; use accumulation for the hero frame.
- Keep CoC small (<= 6 px at 1080p) so numbers and labels (flat layer, drawn after) stay crisp: labels never
  go through the 3D post stack (kit2 draws K.flat on top) [E].
- Cost: marginal if sharing the sub-frame loop; else same as #2.

### 7. SSAO / GTAO for dynamic dense geometry (optional)
- Buys: crevice darkening on 10k-100k instanced marks where baking is impossible.
- Recipe: depth + normal prepass (or MRT, two RGBA8 targets), 8-16 hemisphere samples (HBAO/GTAO preferred
  over classic SSAO), half-resolution, bilateral depth-aware blur 5x5 separable, multiply into ambient
  term only (never the data colour) [S: N8AO half-res = 2-4x faster; three.js GTAOPass "can be performance
  intensive"; one engine measured 2.4 ms vs 5.3 ms GTAOPass on a real GPU].
- Libraries: three.js GTAOPass, N8AO (pmndrs), pmndrs SSAOEffect [S]. For us none are vendored; we only have p5
  2.3.4: port as a ~60-line fragment shader.
- Cost on SwiftShader: [E] 0.5-1.0x of a full-res scene pass at half res with 12 samples. Because it is
  screen-space it can be computed ONCE on the t centre frame and reused by all sub-frames only if stable; it
  usually is not under camera moves, so per-sub-frame cost applies. Ranks below baked AO.

### 8. Reframe, title-safe and caption system for social cuts (not a shader; a layout contract)
- 16:9 master: action-safe 93 %, title-safe 90 % of width and height (EBU/SMPTE convention [U]); keep every
  label, caption and the CETI card inside. Render the master at 3840x2160 or 1920x1080 and crop; do NOT
  stretch. For 9:16: re-render, not crop, from a vertical camera (fov/framing keyed by a `?aspect=9x16` query)
  so the 3D composition is built for the frame [E].
- 9:16 canvas 1080x1920; sources disagree and none is official: Reels top 220 / bottom 420 px, sides ~60,
  1010x1280 centre box [S: ignitesocialmedia, reformat.video]; TikTok bottom 320-484, right 120-180 [S]; YouTube
  Shorts bottom ~320, right ~180 [S]. Cross-platform rule: top 380, bottom 420, left 60, right 120 [S:
  reformat.video all-platform]. Verify with a phone test upload.
- Captions (silent film: captions ARE the narration): sans serif, white on solid black box or 70-80 % black
  [S: BBC Subtitle Style Guide via broadcastwriter]; 42 characters per line across the frame, max two lines
  [S: Netflix timed-text guide]; no authoritative px minimum exists. Working numbers [E]: 1080p 16:9 caption cap
  height >= 4.5 % of frame height (~48 px font) ; 9:16 1080 wide: 60-75 px (blogs say 60-100 px [S: opus.pro,
  blitzcut]), still inside the safe box; contrast >= 7:1 against its own box (not against the scene); hold each
  caption >= 1 s + 0.06 s/char; keep captions out of the bloom/grain/DoF stack (draw after post), so H.264
  never smears glyph edges. Test on a 6-inch phone at arm's length: if it needs zoom, it fails.
- Cost: none.
## Not recommended (and why)
- 60 fps / 4K as default: frames x2 (60 fps) and pixels x4 (4K) multiply to ~8x the render. Our content is
  slow; 30 fps with a 0.25-0.5 shutter looks smoother than 60 fps without blur. Do 4K only for the final hero
  master, and prefer 1080p dsf 2 supersample + downscale to 1080p over native 4K. 4K canvas memory limits and
  headless GPU screenshot speed are unmeasured [U].
- HDR delivery: Chromium-only, WebGL HDR canvas behind flags (Chrome 129+), Safari/Firefox none [S: ccameron
  explainer, search table Apr 2025]; ffmpeg HDR10 (x265, bt2020/PQ, mastering metadata) was not researched [U].
  Ranks last; revisit when a client asks.
- Temporal reprojection TAA (velocity + history clamp): built for real time; subframe accumulation is strictly
  better offline. three.js's own reprojecting TRAAPass is an open PR (#34875) [S].
## Software-GL notes (SwiftShader)
- Chromium has deprecated automatic SwiftShader fallback; WebGL then needs `--enable-unsafe-swiftshader`
  [S: blink-dev, search summary]. Check `WEBGL_debug_renderer_info` in export.mjs and log it.
- SwiftShader reported 12.7x slower and 16x more CPU than a real GPU in one devbox issue [S: paddock #964];
  Mesa llvmpipe reportedly cuts CPU ~49 % vs SwiftShader (single vendor blog, treat with care) [S: botbrowser.io].
  Worth one benchmark: `--use-angle=gl` + llvmpipe vs default, using export.mjs per-frame seconds.
- Fillrate scales with pixels: halve the render size for sub-frames beyond 16 and resolve at full size [E].
- 4 cores here (nproc): run up to 3 parallel Chromium workers on disjoint frame ranges; hashes are order-independent.
## Reference implementations to read (not vendor)
- pmndrs/postprocessing: EffectPass merges effects into one shader; HalfFloat buffers; Bloom/DoF/SSAO/Noise/Vignette/
  ToneMapping effects; single-triangle fullscreen draw. https://github.com/pmndrs/postprocessing
- three.js examples: webgl_postprocessing_taa (jitter accumulation), GTAOPass, UnrealBloomPass.
- glsl-fast-gaussian-blur (MIT): https://github.com/Experience-Monks/glsl-fast-gaussian-blur
- glsl-tone-map (dmnsgn): ACES, Reinhard, Uchimura GLSL snippets. https://github.com/dmnsgn/glsl-tone-map
- Khronos PBR Neutral: https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md
- Jimenez CoD:AW bloom: https://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare/
- LearnOpenGL physically based bloom: https://learnopengl.com/Guest-Articles/2022/Phys.-Based-Bloom
- Haeberli & Akeley 1990: https://graphics.stanford.edu/courses/cs248-02/haeberli-akeley-accumulation-buffer-sig90.pdf

## Proposed build order for the post stack
1 float FBO + tone map + sRGB; 2 accumulation loop with Halton table and `shutter`, `samples` knobs;
3 selective bloom; 4 grain/vignette (cut-specific); 5 baked AO + light-jitter shadow; 6 lens-jitter DoF; 7 SSAO;
8 reframe/caption contract. Gate additions: G-check that fixed Halton table keeps export.mjs hashes IDENTICAL;
record samples/frame and s/frame in export.json.

## Sources (all fetched or surfaced by search 2026-10-10; fetches of threejs.org and MDN failed on DNS)
- https://github.com/pmndrs/postprocessing (fetched)
- https://github.com/atomantic/PortOS/issues/9077 (fetched)
- https://github.com/mrdoob/three.js/pull/34875 ; https://threejs.org/examples/webgl_postprocessing_taa.html (search only)
- https://en.wikipedia.org/wiki/Temporal_anti-aliasing ; https://threejsdemos.com/demos/postfx/motion-blur (search only)
- https://react-postprocessing.docs.pmnd.rs/effects/bloom ; https://github.com/pmndrs/postprocessing/discussions/294 ;
  https://discourse.threejs.org/t/pmndrs-post-processing-tone-mapping-guidance/59374 (search only)
- https://github.com/dmnsgn/glsl-tone-map/blob/main/aces.glsl ; https://bruop.github.io/tonemapping/ (search only)
- https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md (fetched)
- https://www.froyok.fr/blog/2021-12-ue4-custom-bloom/ (search only)
- https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawingBufferColorSpace ;
  https://github.com/ccameron-chromium/webgpu-hdr/blob/main/EXPLAINER.md (search only)
- https://forum.videohelp.com/threads/392229-what-are-the-best-x264-settings-to-preserve-grain-in-anime ;
  https://forum.doom9.org/showthread.php?t=171087 ; https://forum.videohelp.com/threads/363908 (search only, 2012-2019)
- https://www.studiobinder.com/blog/what-is-the-180-degree-shutter-rule/ (search only)
- https://www.ignitesocialmedia.com/content-creation/what-are-the-safe-zones-for-tiktoks-and-instagram-reels/ ;
  https://reformat.video/tools/9-16-safe-zone (search only; vendor figures, not platform specs)
- https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977 ; https://broadcastwriter.com/2024/12/12/bbc-subtitle-style-guide-2024/ (search only)
- https://github.com/edspencer/paddock/issues/964 ; https://botbrowser.io/en/blog/mesa-llvmpipe-vs-swiftshader-chromium-linux/ ;
  https://groups.google.com/a/chromium.org/g/blink-dev/c/yhFguWS_3pM (search only)
