# gl-look · the manager-level hero look as one host (ARSENAL.patterns['gl-look'], renderer webgl)

**For.** Making a data picture look made: a luminance ladder instead of one flat ground, a key/fill/rim rig, a Fresnel edge, baked
ambient occlusion and a planar contact shadow on a lit floor, seeded grain that also dithers the dark ramp, the PBR Neutral tone map and
a restrained bloom, all through gl-post (linear light). One host, `look.setup(p, tokens, opts)` / `look.begin()` / `look.end()`; the mark
modules (gl-instances: boxes, bars, dots) take `params.look = look.attach(st)`. Decision rows D14 (hero look, manager level) at ship.
**Level rule (DECISIONS Q6, exec = ink only).** `level: 'exec'` makes the whole module do nothing: `attach()` is `null`, `begin/end` are
no-ops, the film draws its stock ink picture. Proof: gl-instances' 24 stills (6 variants x 4 times) are pixel-identical before and after
this lane's shader edit (shots/identity.json); kit2 rebuilds of factory/films/pass-every-time and who-gains are byte-identical (sha256 in
shots/identity.json); `build.py --material hero` dies at any level but `manager`. `manager` and `engineer` run the look.
**Not for.** Type (draw it flat after `end()`: never tone mapped or grained); exec films; density renders (additive, no lighting);
films that need the 1.3 MB page budget to the byte (+35 KB: gl-post 24 KB + this 10 KB).

## Host contract
`st = look.setup(p, tokens, opts)` once after `createCanvas(WEBGL)`; per frame `look.begin(p, t, st)` (binds gl-post's HDR frame, clears it
to the ladder's bg) -> `INST.draw(p, t, is, {...params, look: look.attach(st)}, tokens)` -> `look.end(p, t, st)` (tone map etc. to the
canvas; returns `{ran, gains, hdr}`) -> flat labels on `st.post.cam0`. With sub-frames: `look.render(p, t, st, drawFn, {samples, shutter, fps})`
(gl-post `renderAccumulated`; the Halton jitter reaches the camera through `look.jitter`; a cut clamp is B5's). The BRIEF's
`setup(p, ctx, params)/draw` contract is not used: this is a host, not a draw module. Colours come from token roles; a mark module
asks `look.bind(shader, {eye, look}, {roles, dim, hero, ao})` for every uniform (palette, rig, floor), so a new mark module needs one call.
Opts (defaults): `level 'manager'`, `blocks {floor, rig, rim, ao, shadow, grain, bloom: 1}`, `plate [0,0,360,120]` (centre x z, half extents),
`plateSoft 28`, `pool 420`, `floorY 0`, `key [-35,48,.62]`, `fill [40,10,.14]`, `rimAz [150,25]`, `sky .34`, `gnd .22`, `rim .05`, `shadowA .42`,
`litMax .55`, `hero 4` (emission 3-8), `bloomGain .12` (clamped <= 0.2), `vignetteGain 0`, `grainSigma .015` (0.01-0.02), `grainFps 15`, `ramp`.
gl-instances params added (all off by default): `look`, `ao` (0-1; stack, field), `hero` (`'top'` = the highest mark, last to arrive, or a data id), `hud` (false under a look).

## The ladder (measured, ceti-dark, 1920x1080; arsenal/patterns/gl-look/ladder.py, % of sRGB code, luma)
| step | rule | planned | measured (boxes-30k, t 9.0) | cloud-4k |
|---|---|---|---|---|
| background | brand bg 3-6 % | 6.6 (the pack's #0F1115) | corner median 6.6 | 6.6 |
| light pool | 8-10 % under the subject | 9.6 | floor-only frame, 61-px mean peak 9.4 | 9.4 |
| marks | 15-30 % | top face 18-31 | P10 10.2, P50 15.2, P90 26.9 (shaded sides below, tops at 23) | P50 11.7, P90 26.6 |
| lit marks | accent role, capped | <= 55 | P50 45.5 (4.2 % of the frame) | P50 51.8 |
| ONE hero | 80-100 % | emission 4 | max 88.2 (106 px, 0.006 %) | max 88.8 (704 px) |
Frame: P50 7.8 %, P99 49.9 %, 0.01 % of pixels above 70 % (research G12: P50 <= 10, <= 3 % above 70). Light packs invert (swiss-grid): paper 99.6,
pool 95, marks 55-75 (P50 54.9), hero = ink (min 2 %), accent stays the one hue; bloom is skipped there (gl-post `bloom:light-ground`) and so is the rim.
Mark albedo = target / LT with LT = top-face light factor (`sky + key*wrap + fill*wrap` = 0.88), so the lit top face tone-maps back to its ladder step.
**Rim** (Fresnel, `pow(1 - N.V, 3)` x back-light mask): replaying the tone curve, `rim .05` lifts the edge +11 % code on a top face, +12 % on the
key side, +14 % on the shadow side at the silhouette peak, inside the 8-16 % rubric band (P17). **Grain**: gl-post grain measured on a flat patch,
sigma = 0.30 x grainGain (gain 0.033 = 1.0 %, 0.05 = 1.5 %, 0.067 = 2.0 %; the card range of gl-post, 0-0.02, is only 0.6 %); sigma 1.5 % is 3.8 LSB, so
the dark ramp dithers (no band). Static (`grainFps`) so H.264 spends little on it.

## Blocks, and what each costs
| block | what | where |
|---|---|---|
| floor | ladder: pool radial 0.55 + plate (soft box) on the plane, mixed in display-linear, exact tone-toe inverse | `look.floor()`, GLSL `floorCol` shared with the shadow |
| rig | key -35/+48 wrap .25 (0.62), fill +40/+10 (0.14), hemisphere sky .34 / gnd .22; camera-relative | instance fragment |
| rim | Fresnel x back-light (150/+25), +11-14 % code | instance fragment, `uRimK` |
| ao | baked: wall gradient (0.55 -> 1 over 0.6 min(w, h)) x neighbour term (stack: 4-neighbours + covered; field: 8-direction horizon, 6 steps); ambient and fill only | 3rd data texel, vertex |
| shadow | the same draw flattened along the key onto the floor, MIN-blended (`blendMode(DARKEST)`) as floor x (1 - 0.42): overlaps never double-darken; hard (soft by accumulation) | second draw |
| grain | seeded by frame, sigma 1-2 %, also the dither | gl-post fused output pass |
| bloom | threshold 1.0 so only emission > 1 (the hero) glows, gain <= 0.2 | gl-post |

## Cost (1920x1080 = 960x540 x dsf 2, SwiftShader, seek incl. a 1-px readPixels sync; shots/cost-*.json; `node measure.mjs --variant <v>`)
Wall s/frame is median (min) of 5 (bars: 2) with the host shared with other lanes (load 8-14 on 4 cores): treat as upper bounds. CPU-s is the browser tree's user+system time per frame from /proc, which does not inflate under load (idle wall is about CPU / 2-3).
| configuration | boxes-30k wall (min) · CPU | cloud-4k wall (min) · CPU | bars-40k wall (min) · CPU |
|---|---|---|---|
| ink (exec, stock picture) | 1.41 (0.98) · 2.33 | 0.11 (0.10) · 0.23 | 3.74 (3.45) · 9.42 |
| bare look (HDR + tone map) | 1.25 (1.14) · 2.27 | 0.29 (0.27) · 0.67 | 2.38 (2.30) · 6.34 |
| + floor only | 1.16 (1.11) · 2.32 | 0.33 (0.29) · 0.80 | 2.47 (2.35) · 6.48 |
| + rig only | 1.03 (0.86) · 2.22 | 0.29 (0.26) · 0.66 | 2.60 (2.50) · 6.62 |
| + rim only | 0.95 (0.90) · 2.05 | 0.28 (0.25) · 0.65 | 3.33 (2.96) · 6.92 |
| + ao only | 0.99 (0.92) · 2.10 | 0.28 (0.25) · 0.66 | 3.42 (2.95) · 6.71 |
| + shadow only | 1.66 (1.32) · 3.13 | 0.34 (0.32) · 0.79 | 5.79 (5.49) · 12.12 |
| + grain only | 1.29 (1.13) · 2.27 | 0.32 (0.29) · 0.64 | 2.93 (2.73) · 6.64 |
| + bloom only | 1.44 (1.41) · 2.82 | 0.56 (0.54) · 1.30 | 3.90 (3.36) · 7.28 |
| full look | 1.59 (1.48) · 4.15 | 0.70 (0.64) · 1.57 | 5.78 (5.16) · 12.41 |
| full - floor | 1.51 (1.43) · 3.95 | 0.62 (0.58) · 1.47 | 5.06 (4.85) · 12.87 |
| full - rig | 1.59 (1.47) · 4.11 | 0.69 (0.66) · 1.62 | 4.90 (4.55) · 12.66 |
| full - rim | 1.62 (1.53) · 4.21 | 0.72 (0.67) · 1.60 | 4.85 (4.65) · 12.66 |
| full - ao | 1.66 (1.55) · 4.01 | 0.66 (0.58) · 1.57 | 5.45 (4.95) · 12.57 |
| full - shadow | 1.26 (1.20) · 3.01 | 0.65 (0.62) · 1.46 | 3.09 (3.01) · 7.58 |
| full - grain | 1.60 (1.44) · 4.11 | 0.79 (0.72) · 1.55 | 5.48 (5.46) · 12.72 |
| full - bloom | 1.33 (1.25) · 3.42 | 0.41 (0.38) · 0.93 | 5.30 (4.94) · 12.10 |
Reading it (CPU-s, noise about +-0.2): floor, rig, rim, ao and grain are free (fragment terms, one more data texel, one fused pass). The bare look (half-float frame, no MSAA, tone-map pass) is
+0.2 s over ink on a light scene (cloud) and cheaper than ink on the fill-bound bar field (MSAA off). **Shadow** is the second draw: +0.9 (boxes), +0.1 (cloud), +5.8 (bars, fill-bound; use
`blocks.shadow:0` or fewer bars when the budget is 1.5 s). **Bloom** is gl-post's chain: +0.5 to +0.9. Full look at 1920x1080 (wall, loaded host): boxes-30k 1.6 s, cloud-4k 0.7 s, bars-40k
5.8 s (ink 1.4 / 0.11 / 3.7). Offline export only for bars; boxes and cloud are inside the 1.5 s frame budget even loaded. Setup: 0.1-0.25 s (AO bake of 40k bars about 40 ms). bars-ink here is the same 40k scene as bars-hero.

## Variants (demo.html; `?variant=` `?brand=` `?t=` `?blocks=floor:0,shadow:0` `?p={json look opts}`)
`boxes-ink` / `bars-ink` / `cloud-ink` (level exec: the stock picture), `boxes-hero` (30k cubes, ortho orbit, ao, hero on top of the accent
column), `bars-hero` (40k bars, perspective dolly, ao), `cloud-hero` (4,000 sphere impostors with Fresnel rim and blob shadows, one larger hero point). Sheets: shots/ (ceti-dark), shots/swiss-grid.

## Atlas
[[lights-and-materials]] S47 S49 S52 S357 S358 · [[blend-mode]] S36 (DARKEST = MIN in WEBGL) · [[p5-framebuffer]] S53 S61 S257 · [[filter-shaders]] S38 S64 S256 ·
[[gpu-instancing]] S49 S275 S278 · [[p5-grain]] S166 · [[p5-shader]] S49 S58 S64 · [[frontier-2026]] S274 S275. Research: factory/research/WOW-CINEMATIC.md sections 3, 4, 5, 8,
10 (rig, AO, planar shadow, ladder, bloom and grain rules, the hero preset); WOW-P5-FRONTIER.md T1, T3, T9 (rim and planar shadow ranked; strands not used: plain GLSL 300 es);
WOW-MOTION.md P16-P19; WOW-GAP-AUDIT.md gap 4.

## Pitfalls and WARNs
- Grain is engineer-only in gl-post's level table and gl-post is B5's: with grain on, the look calls gl-post at `engineer` with dof and chroma 0; with grain off it is a true `manager` call. One word in `LEVELS.manager` would move it.
- gl-post's grain has a small negative mean (measured: mean code 6.9 -> 6.4 % at sigma 1.5 %): dark frames lose ~0.5 % code. Not fixed here (B5 owns the file).
- No float colour buffer: gl-post falls back to LDR with 2 stops of headroom (`?ldr=1`): dark roles band and shift; the look still runs.
- Planar shadow: floor must be a plane at `floorY`; the shadow is hard (one light direction). Soft penumbra needs accumulation with a jittered light (not built). Shadows fall behind the marks from a camera-left key: little is visible from the front; raise `key[0]` to move them.
- The rim is in scene units and tuned for dark marks (0.05); on a light ground it is off (white edge on white). AO bake assumes the FINAL state of a stack (not during the count-in).
- `hud:false` is required under a look (the stock labels would be tone mapped); `worldToScreen` inside a framebuffer returns y from the bottom (gl-post card).
- Page: +35 KB; who-gains (1,293,935 B) crosses the 1.3 MB WARN with `--material hero`.
- WARN: lit marks (accent roles) occupy 3-4 % of this frame at 45-52 %; a film with a large lit share will break the research rule "<= 3 % above 70 %" only if it raises `litMax`.

## Renderer / fallback
webgl, WebGL2 (GLSL 300 es; same as gl-instances). Fallback: gl-post compile failure -> its `fallback:no-shaders` (linear frame, darker); no WebGL2 -> the stock ink picture (exec).
