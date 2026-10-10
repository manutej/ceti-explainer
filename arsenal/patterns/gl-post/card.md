# gl-post · a linear-light post stack (ARSENAL.post['gl-post'], renderer webgl)

**For.** The reveal as a moment: one glow on the one claim, a focus pull to a data point, a finish for hero/social cuts.
The scene renders in LINEAR light into `st.hdr` (HALF_FLOAT, depth on); `apply()` runs, in this fixed order,
**dof -> bloom -> chroma -> TONEMAP (Khronos PBR Neutral + sRGB OETF) -> vignette -> grain** and writes the canvas.
Every pass is a GLSL ES 1.00 `createFilterShader` source. Linear passes are drawn by `run()` (the filter shader on a
plane into a float framebuffer: `filter()`'s own layer is 8-bit). With `fuse` (default) bloom-add + chroma + tonemap +
vignette + grain are one pass (vs the separate chain: mean |diff| 0.25/255, max 5, from 8-bit rounding). Gain 0 skips.
**Not for.** Type (draw labels after `apply`, flat, in display colours: never blurred, split, tone mapped or grained);
light grounds wanting a glow (bloom is skipped there, see below); anything at the exec level beyond tone mapping.

## Host contract
`st = post.setup(p, {seed, w, h, tokens})`; scene colours via `post.toScene(hex, emission, st)` (inverse tone curve, so a
fully lit face tone-maps back to its role; mix roles in display-linear with `toSceneLinear`, never after); draw inside
`st.hdr.begin()/end()` (camera from `st.hdr.createCamera()`; clear with `p.clear(r,g,b,1)`, `background()` clamps to 1),
or `post.renderAccumulated(p, drawScene, t, {samples, shutter, fps}, st)`; then `post.apply(p, src, t, params, tokens, st)`.
`post.gains(params, t)` returns the effective gains (log or caption them). **Depth for DoF:** a p5.Framebuffer's `.depth`
(window depth; set `near`/`far`/`ortho` to the scene camera's), or a second framebuffer with packed linear depth
(r = z / far) passed as `depthTex` with `depthKind: 'linear'`. No depth: DoF is skipped, reported `dof:no-depth`.
**Accumulation:** sub-frame k at tk = t + ((k+.5)/N - .5)·shutter/fps, Halton(2,3)(k+1) - .5 backing-px projection jitter
(`post.jitter(cam, dx, dy, st)`, after `perspective()`), averaged in linear light (ping-pong, weight 1/N); DoF, bloom and
grain run once on the average. DoF then reads the LAST sub-frame's depth (small mismatch under motion; WARN).

## Params (knobs_doc rows a film exposes)
`{name:"postLevel", options:["exec","manager","engineer"], what:"exec = tone map only; manager = dof, bloom, vignette"}`
`{name:"bloomGain", range:[0,0.2], step:0.01, what:"bloom strength (Jimenez add-back; 0.04-0.12 typical)"}`
`{name:"dofGain", range:[0,1], step:0.05, what:"depth of field; x dofAperture px max CoC"}` · `{name:"dofFocus", range:[near,far], what:"focus distance (world)"}`
`{name:"vignetteGain", range:[0,0.15], step:0.01, what:"corner darkening, multiplicative (-8..-15 %)"}`
`{name:"grainGain", range:[0,0.02], step:0.002, what:"film grain amplitude after tone map (0.012-0.02)"}`
`{name:"chromaGain", range:[0,6], step:0.5, what:"R/B split at the corner, logical px"}` · `{name:"exposure", range:[0.5,2], step:0.05, what:"pre-tonemap"}`
Internal: bloomThresh 1.0 (only emission > 1 glows), bloomKnee 0.25, bloomLevels 2-6 (5), dofRange 0-200, dofFalloff 20-600,
dofAperture 2-12 px (keep <= 6 at 1080p near type), vignetteInner 0.2-0.6, grainPx 1-1.5 (value-noise lattice: 2-3 backing px,
low-passed so H.264 keeps it), grainFps 24 (seed = frame index floor(t·fps)), `ramp: {pass: [t0,t1] | [t0,t1,t2,t3]}`, `fuse`.
**Level rule** (DECISIONS Q6): exec = tonemap only (it is the output colour transform, not a look); manager = dof, bloom,
tonemap, vignette; engineer = all. Grain and vignette are for hero/teaser/social cuts; default off.

## Variants (demo: 384 baked boxes, top 96 count in, rank-1 box emissive x10, focus on it)
none (tone map only = the exec frame), dof, bloom, chroma, vignette, grain (each pass alone), **reveal** (vignette and grain
ease in, focus pull 1.6-3.2 s, bloom 3.0-3.8 up / 5-6 down, chroma pulse), reveal-exec (same params, level exec: identical
to none), accum-8, accum-16 (reveal + 8/16 sub-frames, shutter 0.5 at 30 fps: AA edges, count-in motion blur).

## Cost (SwiftShader, 960x540 x2, seek + 1-px readPixels sync, median of 5 at t = 4.02; shots/cost.json)
Measured with load average ~11 on 4 cores (other lanes running): treat as upper bounds; min in parentheses.
| variant | s/frame | pass cost over none |
|---|---|---|
| none (scene + tonemap pass) | 0.24 (0.20) | floor |
| dof (16-tap gather, 2 fetches/tap, full res) | 0.77 (0.74) | +0.53, the heavy pass |
| bloom (5 down 13-tap + 4 up tent, from half res) | 0.41 (0.37) | +0.17 |
| chroma / vignette / grain (fused) | 0.29 / 0.23 / 0.22 | +0.05 / ~0 / ~0 |
| reveal (all, N = 1) | 0.97 (0.82) | heaviest single-pass variant, under 1.5 |
| reveal-exec | 0.29 (0.24) | |
| accum-8 / accum-16 | 3.85 (3.65) / 6.0 (4.6) | ~0.3 per sub-frame: offline only, WARN over the 1.5 s budget |
Unloaded first run: none 0.24, reveal 1.20, accum-8 2.1, accum-16 3.4. Old 8-bit filter() chain (one filter per pass): reveal 3.9.

## Tone map check (shots/roles.json, every pack in arsenal/brands)
Raw PBR Neutral is NOT pass-through for data colours: its toe subtracts 0.04 from every channel (dE up to 17, ceti-dark
accent2 13). `toScene` pre-compensates (exact inverse below the shoulder; best of 8 shoulder caps above): dE 0 for 18 packs.
WARN: saturated full-intensity roles are outside the curve's gamut (it desaturates highlights): neon-lab accent2 3.7,
blueprint accent2 2.6, terminal accent/accent2 5.3/9.0, high-vis 8.0/6.4. Those packs fail the dE < 2 rule.

## Atlas
[[filter-shaders]] S38 S64 S256 · [[filter]] S38 S274 · [[p5-framebuffer]] S53 S61 S257 · [[layered-compositing]] S61 S64 ·
[[webgl-mode]] S58 S61 (DoF not built in) · [[p5-grain]] S166 (seeded grain) · [[p5-strands]] S47 S62 · [[frontier-2026]] S274.
Recipes: arsenal/frontier/R-C-cinematic.md ranks 1-4 and 6.

## Pitfalls and WARNs
- No float colour buffer (no EXT_color_buffer_float / _half_float): UNSIGNED_BYTE with 2 stops headroom (scene x 0.25,
  exposure x 4, threshold x 0.25); dark roles band and shift (ceti-dark bg renders ~#111111). Force with `?ldr=1`.
- Light grounds: white is ~12 scene units, so bloom would light the paper: skipped and reported `bloom:light-ground`; the
  demo draws the rank-1 box in chalk instead. Vignette on white reads as grey corners.
- 2.3.4: `worldToScreen` inside a framebuffer returns y from the bottom (its camera flips y): use `h - y`.
- Bloom is post-DoF (out-of-focus highlights glow as discs). Post DoF can leak foreground onto background edges; use
  accumulation lens jitter for a hero frame (not built: needs a sheared frustum per sub-frame).
- WARN: the demo's status line clips at the left edge in reveal/accum at t = 4. shoot.mjs ms_per_frame does not wait for the GPU.

## Not possible on 2.3.4 / not done
`filter()` cannot keep HDR (its internal layer is RGBA8), hence `run()`; no MRT, so packed depth needs a second scene draw;
no `instances()`; p5.strands not used (beta, hook names moved 2.1-2.3.1); accumulation DoF (lens) not implemented; display-P3
canvas not used (H.264 bt709 delivery). Renderer: webgl. Fallback: shaders fail to compile -> `st.err` set, apply shows the linear frame untouched (darker) and reports `fallback:no-shaders`.
