# WOW-CINEMATIC · recipes that give data pictures the look of a product film · R-W4 · 2026-10-11

Extends (does not repeat): arsenal/frontier/R-C-cinematic.md (accumulation principle, bloom, grain, baked AO idea, safe
zones), arsenal/patterns/gl-post (card.md, pattern.js: fused OUTPUT pass, `renderAccumulated`, `jitter`), gl-camera-rig
(moves, `rig.dof`), arsenal/tools/export.mjs. Every recipe below is pure of t, uses fixed tables (Halton, Vogel disc,
mulberry32) and runs headless on SwiftShader. Nothing here is vendored; GLSL ES 1.00/3.00 snippets are inline-size.

Evidence grades: **A** primary spec/paper/vendor doc seen in a result snippet; **B** several consistent secondary
sources; **C** one weak source or my engineering inference (E = estimate to benchmark before shipping; U = from
memory, not verified). WebFetch is blocked: all "sources" are WebSearch snippets of 2026-10-11, quoted briefly.
Cost = s/frame at 1920x1080 (960x540 x dsf 2), SwiftShader, machine under load ~9-11 on 4 cores (so upper bounds);
"idle" = unloaded first run in gl-post/card.md. Real GPU never measured.

## 0. What the product-film look is made of (the short list)
In order of what it buys a viewer per second of render: (1) a real tone curve and a restrained luminance ladder (done:
gl-post), (2) motion blur on every move (built, unused by the six films), (3) a long lens and a slow, damped camera,
(4) contact: AO + a soft shadow + a faint floor reflection so objects sit ON something, (5) edge light (Fresnel rim)
and one emissive hero, (6) shallow focus used as a pointer, (7) transitions that carry an object, (8) a tiny grade,
grain and vignette on the hero cut only. Lighting rigs and DoF without motion blur look like a 3D demo; motion blur
without contact looks like a screen recording of a 3D demo. The set is the point.

---
## 1. Motion blur by temporal supersampling (the frame-stepped export)

**Model.** Shutter angle a (deg) exposes a/360 of the frame interval: 180 deg = 0.5 frame = 1/60 s at 30 fps [A:
Pixar RenderMan docs "180 degree ... default ... higher angles = blurrier"; Bevy docs tie 180 deg to 24 fps/1/48 s and
warn that holding the look at 60 fps needs ~1.25 and "produces stretching artifacts"]. gl-post's `shutter` is exactly
this fraction (0.5 = 180 deg). Sub-frame times are stratified-centred: tk = t + ((k+.5)/N - .5)*shutter/fps.

**Parameters (explainer defaults, 30 fps).**
| situation | shutter (deg) | N | why |
|---|---|---|---|
| holds, commit/reading pauses | any | 8 | nothing moves; N=8 is Halton AA only, so edges and 1-px lines are stable |
| slow dolly/orbit (<= 40 px/frame at 1080p) | 0.35 (126) | 16 | filmic streak, no stepping |
| fast camera or morph (40-150 px/frame) | 0.5 (180) | 32-48 | step spacing stays <= 2 px |
| transition wipe/dissolve | 0.75 (270) | 32 | the smear hides the swap |
| never | > 1.0 | | streaks longer than the frame read as a bug |

**Choosing N from the film's own motion (pure, no feedback).** Let V = max screen-space speed in backing px per frame
of any tracked point (project 8-16 probe points of the hero set with `rig.worldToScreen` at t and t+1/fps; add data
marks' own speed from the morph). Streak length L = V*shutter. Stepping is invisible when L/N <= ~2 px [C, E]:
N = clamp(ceil(V*shutter/2), 8, 48) snapped up to {8, 16, 32, 48} so neighbouring frames do not flicker in AA quality.
RenderMan's own advice agrees in shape ("faster motion and wider shutters need more levels ... higher counts raise
render time substantially"; "rendering enough subsamples to avoid visible stepping in fast motion") [A/B: Maxon, RenderMan,
irpr glossary]; none gives a number, so the 2-px rule is mine and must be checked on the accum-16 shots.

**Halton.** Projection jitter (dx,dy) = (H2(k+1), H3(k+1)) - .5 backing px is a box filter over the pixel = true
pixel-area average (SSAA-equivalent edge quality at N=16). Keep the table fixed: a static shot then converges to the
SAME image every frame (no shimmer, identical hashes). Optional softness: scale jitter by 1.4 (a 1.4-px box) for a
slightly filmic reconstruction; do not exceed 1.6 or hairlines blur [C, E]. Do NOT pair time and jitter by the same
low-discrepancy index when N changes between frames (it re-orders the pattern); the stratified time + Halton(k) pairing
is already decorrelated enough.

**Three gotchas the current renderAccumulated does not handle (add to the lane before the proof film):**
1. *Cuts inside the shutter.* A hard cut at tc within [t - s/2, t + s/2] blends two shots 50/50 on that frame
   (visible double exposure). Fix: the film declares `cuts: [tc...]`; sub-frame times clamp to the side of the cut that
   t is on: tk = clamp(tk, prevCut, nextCut - 1e-6). Same clamp to [0, dur]. Pure.
2. *Centred shutter starts blur half a shutter early* at a move onset (the first blurred frame precedes the motion
   by 1/120 s: invisible) but pre-blur at t=0 for an intro; clamp handles it.
3. *LDR fallback.* If `res.hdr` is false (UNSIGNED_BYTE, 2 stops headroom) a 1/N running mean quantises to 255/N
   levels per step and bands dark ramps. Rule: accumulation requires HDR (half float); otherwise cap N at 8 and warn
   `accum:ldr`. Report it in export.json.

**How export.mjs should drive it (zero change to the capture loop; ~30 lines around it).** Accumulation lives inside
`__film.seek(t)`: seek runs `POST.renderAccumulated(p, drawScene, t, {samples:samplesAt(t), shutter, fps}, PS)` then
`POST.apply`. The exporter already SETS t per frame, so the Halton table + stratified times make every frame a pure
function of t (its out-of-order SHA-256 re-render check keeps working; it is the proof). Changes:
- pass `fps` into the film (`&fps=30`) so shutter/fps is not guessed; read `samples`, `shutter` from `--query`
  (`?samples=16&shutter=0.35`) or let the film choose `samplesAt(t)`;
- `pg.setDefaultTimeout(0)`: a 48-sample frame at 4K can pass 30 s and Playwright's screenshot timeout is 30 s;
- `--shard i/n --frames a-b` so 3 Chromium workers render disjoint ranges (4 cores; SwiftShader already threads, so
  measure scaling with 1 vs 3 workers before trusting it [E]) and a final `ffmpeg -f concat` joins them;
- record `__film.last().samples` and ms per frame into export.json (the pattern already returns `samples`);
- add the verify pick "first frame after a cut" and "frame in the heaviest move" (N differs) to the hash check;
- encode with colour tags (finding: the current ffmpeg line is untagged, and swscale's RGB->YUV default is the bt601
  matrix, so players that assume bt709 for HD shift reds and greens slightly [B, known ffmpeg behaviour; U here]):
  `-vf scale=1920:1080:flags=lanczos:out_color_matrix=bt709:out_range=tv -colorspace bt709 -color_primaries bt709
  -color_trc bt709 -pix_fmt yuv420p -crf 16 -preset slow -tune film`.
  Compare one frame's mean RGB before/after to confirm.

**Cost (SwiftShader, from gl-post shots/cost.json).** Per frame ~ a + b*N: idle a = 0.8 s (scene setup + the one
post chain), b = 0.16 s/sub-frame; loaded a = 1.7, b = 0.27. N=8: 2.1 idle / 3.9 loaded; N=16: 3.4 / 6.0 (measured);
N=32: ~5.9 / 10.3; N=48: ~8.5 / 14.6 (extrapolated, E). A 40-s film = 1200 frames: N=16 flat = 68 min idle / 2 h
loaded; adaptive (mean N~11: holds 8, moves 16-32) ~ 50 min idle. 4K (dsf 4) multiplies fill-bound terms by ~3.5 (E):
see section 9. Reference frames: arsenal/patterns/gl-post/shots/accum-16-t1.98.png vs none-t1.98.png (count-in motion).

---
## 2. Depth of field and rack focus as a storytelling move

**Which DoF.** Two builds, one rule: post gather DoF (gl-post `dof`, +0.53 s loaded) for the background plate and any
shot with N=1; accumulation (lens) DoF for the hero frame, because it has no foreground leak and true bokeh discs
(post DoF "leaks sharp foreground over blurred background", R-C #6; Haeberli-Akeley: jitter the eye on the aperture
disc, keep the focal plane fixed [A: SIGGRAPH 90 abstract; redbook dof.c: "the viewing volume is jittered, except at
the focal point, where it is at the same position each time"]). Lens accumulation shares the motion-blur loop: N views
give MB + AA + DoF at the cost of N views; marginal DoF cost ~0 when N is already >= 16. NOT built in gl-post
(card: "accumulation DoF not implemented"). Recipe to build:
- Vogel disc, deterministic: for sub-frame k of N, r = R*sqrt((k+.5)/N), th = k*2.39996323 (+ film seed). Lens offset
  o = r*(cos th * right + sin th * up) in world units, R = lens radius.
- Eye' = eye + o. Keep the focal plane registered with a frustum shear, not a re-aim: after `cam.perspective()`,
  add to the projection's x/y shear terms (the same m[8], m[9] slots `post.jitter` already writes)
  `m[8] += (o.x)/(s*tanHalfFovX)`, `m[9] += (o.y)/(s*tanHalfFovY)` where s = focus distance, so a point on the focal
  plane lands on the same pixel in every sub-frame (unit test: worldToScreen of a focal-plane point, spread < 0.05 px).
- Samples to hide the discrete discs: need ~ 0.2*C^2 views for CoC diameter C px (spacing <= ~2 px across the disc)
  [E]: C=6 -> 8, C=8 -> 13, C=12 -> 29, C=16 -> 51. Cap CoC at 12 px for N=32, 16 px only at N=48.
- When lens accumulation is on, set `dofGain 0` (gl-post otherwise reads the LAST sub-frame's depth, its WARN).

**CoC sizes (thin lens, so rack focus reads as optics, not as a filter).** Blur disc on the sensor
c = A*f/(s-f) * |d-s|/d with A = f/Nf (aperture diameter), focus distance s, object distance d. In screen px:
CoC(d) = Cmax*|d-s|/d, Cmax = A*f/(s-f) * (H_px/sensor_h). Far side saturates at Cmax; near side grows without bound
(clamp). Virtual 24-mm-high sensor, fov_v 25 deg -> f = 12/tan(12.5 deg) = 54 mm; f/2.8 -> A = 19 mm; subject at
2 m: Cmax = 19*54/1946*45 px/mm = 24 px at 1080p [C, computed]. That is a real macro/product look and is far too
blurry for data: gl-post's own rule is <= 6 px near type [card]. Working budget at 1080p (double at 4K):
| layer | CoC | use |
|---|---|---|
| focus plane | 0 | the claim; its label is flat and sharp anyway |
| adjacent depth layer (+-1 row) | 1.5-3 px | reads as "soft", still legible as data |
| rest of field | 4-8 px | clearly out of focus; no text on it |
| foreground plate | 8-14 px | pure atmosphere, parallax carrier (section 6) |
| defocus transition peak | 20-30 px | hides a swap (section 7) |
Below ~1.5 px blur is imperceptible in motion video [C, E]; use Cmax in {6, 8, 12}; map to aperture via
`dofAperture = Cmax` (gl-post) or R = Cmax*s/(f_px) for the lens (f_px = H/(2 tan(fov/2))).

**Rack focus as a pointer.** Cinematographers use it to "redirect viewer attention, transfer narrative emphasis between
subjects, and reveal elements that were previously kept soft"; it needs a visible sharp/soft contrast to read as intent
[B: morphic glossary, NFI article; no duration source found]. For us: (1) one pull per beat, never two; (2) open the
aperture only when it matters: aperture 0 -> 1 over 0.6 s at the first pull, closing back to ~0.25 in the pause where
a number is read (labels are crisp regardless); (3) pull duration 0.8-1.2 s, ease in-out, geometric in focus distance
(1/s is closer to how a lens moves than s) [C, E; no source]; (4) start the pull 0.2 s BEFORE the target's label or
count appears so the eye arrives with the focus; land >= 0.6 s before the digit changes; (5) the pull direction should
carry the narrative (front row -> back row = "and behind it"); (6) never rack and dolly with equal weight (rule of
section 7). gl-camera-rig already compiles `focus` moves and `rig.dof(pose, rig)`: feed `focus` and `aperture` to
gl-post/lens each frame; add `focus:'hold'` for beats where the camera moves but the pointer does not.
**Cost.** Post DoF +0.53 s loaded (measured); lens DoF ~0 over the section-1 loop, +0 memory.

---
## 3. Lighting rigs for dots, boxes and terrain (no shadow maps)

gl-instances already shades boxes with `uAmb + uKey*max(dot(n,-keyDir),0) + uRim*max(dot(n,-rimDir),0)` (flat
Lambert, no spec, no Fresnel, no AO, no shadow). All additions below are fragment-shader terms or extra draws; all in
LINEAR scene units (use `post.toScene`), tone-mapped once at the end.

**Rig (three lights + hemisphere).** Camera-relative so every cut keeps the look:
| light | direction (camera az / el) | intensity (key = 1) | colour | notes |
|---|---|---|---|---|
| key | -35 deg / +42 deg | 1.0 | neutral-warm (brand ink) | soft: Lambert wrap w = 0.25: (N.L + w)/(1+w) |
| fill | +40 deg / +10 deg | 0.20-0.25 (2 stops under) | cool, brand-bg tint | no spec; keeps the shadow side off pure bg |
| rim / kicker | +150 deg / +25 deg (behind, high) | 0.8-1.2 | neutral | applied ONLY through the Fresnel term |
| hemisphere | sky = 0.12, ground = 0.03 | | | ambient = mix(ground, sky, n.y*.5+.5) |
Key:fill ~ 4:1 (2 stops) is the classic product ratio [C; the Manfrotto/premiumbeat product-lighting snippets say "rim
and fill lighting, perfect black background" without numbers]. For axis-aligned boxes a *face-tone ladder* is the
isometric cheat that always reads: top 1.0, key-side 0.70, other side 0.48 of albedo, plus AO; use it when the camera
orbits less than 60 deg and you want zero shading noise.

**Emissive hero.** Exactly one mark carries `emission` 3-8 in `toScene(hex, emission)` (gl-post: bloom threshold 1.0,
so only it glows); its lit face tone-maps to the brand accent, its glow does the pointing. Everything else <= 0.9.

**Fresnel edge.** Schlick: F = F0 + (1-F0)(1 - N.V)^5 [A: Schlick 1994 via LYGIA; GameDev.net shader demo adds "a
separate directional rim term with an adjustable power"]. Two terms, tuned apart: specular Fresnel F0 = 0.04
(dielectric ink) * env; and the rim glow `rimGain * pow(1 - N.V, 3) * smoothstep(-0.2, 0.6, dot(n, -rimDir))`.
rimGain: 0.25-0.35 of display white on data marks (an edge, not a neon outline), 0.6 on the hero. Add after lighting,
before tone map; keep < 1.0 on non-hero (no bloom). Do not put rim on 1-px dots/slashes (aliases); on discs use the
disc's normal sphere trick: n = (q.x, q.y, sqrt(1 - r^2)) gives a lit sphere impostor for free, no geometry.

**Ambient occlusion, ranked.**
1. *Baked vertex AO (zero per-frame cost; heightfield, stack-city, instances in a grid).* On the CPU in setup:
   horizon AO per cell: for 8 directions and S = 6 steps, slope_dir = max_s (h[i+s*d] - h)/(s*cell); ao = 1 -
   (1/8)*sum atan(max(slope_dir,0))/(pi/2). Box side walls: gradient with height, ao(y) = mix(0.55, 1, smoothstep(0,
   0.6*min(w, h), y)), times the neighbour term at the base. Store in an instance attribute, multiply into ambient
   AND fill only (never the key, never the emissive). Seeded, deterministic, stable across the film.
2. *Analytic ground occlusion for spheres/boxes standing on the plane:* ground factor = 1 - k * r^2/(r^2 + (a*d)^2)
   under each footprint (d distance from the footprint, a ~ 1.5): this is the contact darkening ring, 1 draw (below).
3. *SSAO/GTAO:* ranks last. GTAO reaches a ray-traced reference "in about half a millisecond ... 1080p" on a console
   at half res [A: Jimenez et al. ATVI-TR-16-01, snippet]; Intel XeGTAO is MIT but stopped [A, GitHub]. On SwiftShader
   a 12-tap half-res pass is my estimate +0.3-0.6 s [E]; only for dynamic dense geometry; skip.

**Contact shadows and a shadow plane without shadow maps.**
- *Projected planar shadow (boxes, terrain walls, anything on a known plane).* Draw the same geometry flattened onto
  the ground along the key direction with the shadow matrix S (y -> 0, x,z sheared by -y*L.xz/L.y), flat dark colour,
  alpha 0.35-0.5, depth-offset 0.5-1 unit above the plane (or draw ground first, shadows with depth test, no write).
  Self-shadowing is not needed: AO covers it.
- *Soft penumbra for free:* inside the accumulation loop jitter the LIGHT direction over a small disc (Vogel, angular
  radius 3-6 deg) per sub-frame, so the shadow is hard at contact and wide far from it (physically correct contact
  hardening). Penumbra width ~ h*tan(alpha): a 170-unit box at 5 deg -> ~15 units. Needs N >= 16; at N=8 widen alpha
  to <= 3 deg or the copies show. This is R-C #5's light-jitter idea made concrete; cost = +1 flat-colour geometry draw
  per sub-frame (~0.3x scene, E).
- *Blob decals for dots/spheres:* an elliptic quad under each with alpha = a0 * r^2/(r^2 + (k*h)^2) (h height above
  ground, k 0.6, a0 0.5), multiply-ish dark; 1 instanced quad draw. Needle's and the game-engine "blob shadow" are this
  [B: Needle docs, Unity/PlayCanvas forums: soft gradient texture on a quad, "very cheap", "won't be enough on uneven
  terrain"]. For terrain use projected shadows or bake into vertex colour.
- *Dark-ground rule (important):* a shadow cannot be darker than a 3-6 % background, so on a dark ground it is
  invisible [A: Material dark theme: "shadows fade on dark backgrounds ... grey surfaces make shadows visible"].
  Therefore light the ground: a radial "pool of light" on the plane, ground luminance 8-10 % under the hero falling
  to 3 % at the edges (multiplied by the same key falloff); shadows and reflections then subtract from something.

**Ground reflections without SSR.** Mirror pass: draw the hero set again with y -> -y (flip cull), BEFORE a ground
plane drawn with alpha = 1 - R(N.V), R = Schlick with F0 0.06-0.10 [E], and a fade of the mirrored colour with
distance from the plane: refl(h) = R0 * max(0, 1 - h/Hfade) (Hfade ~ 0.6 of the box height). Glossy (not mirror)
for free: jitter the mirrored copy's y by +-1.5 % per sub-frame so the accumulation averages a vertical streak, the
anisotropic smear of a satin floor. Planar is exact but doubles geometry; SSR "misses off-screen objects and suffers
temporal instability" [A: Vulkan planar-reflections tutorial; Unity SSR docs: Fresnel fade and fade distance] so we do
not use SSR. Mirror only the hero and rank <= 12. Cost +1x those draws.

**Total lighting cost** (300 boxes): fragment terms ~0; AO 0 (baked); projected shadows +0.1 s/sub-frame; mirror pass
+0.1 s/sub-frame (E). Reference frame to beat: arsenal/patterns/gl-post/shots/contact.png (flat shading, no contact).

---
## 4. Materials, luminance ladder and tone mapping

**Glass / frosted layers (manager level only; never behind digits).** A pane = blurred copy of what is behind + tint +
edge. Reuse gl-post's bloom down-chain (level 2-3 = 1/4-1/8 res, 13-tap): sample the half-float frame at a blurred
level inside a rounded rect (SDF mask), `colour = mix(blurred*1.2 saturation, white, 0.06-0.10) + 1px inner highlight
at 16-20 % + 0.04 shadow`; blur radius 24-40 px at 1080p. Apple's UI glass is exactly "blur + saturate + low tint +
hairline" [C, U; no source]. Cost: the chain exists (+0.17 loaded) and the pane is one fused-pass branch. Draw
the pane in the OUTPUT pass, before labels; text on glass is drawn flat afterwards with >= 7:1 against the pane
(R-C #8 caption rule).

**Glossy ink.** Material stays "ink" (matte face colour = role). Add a *short, sharp* Blinn-Phong highlight on the top
face only: spec = 0.25 * pow(max(dot(n, h), 0), 80) * key, tinted white, F0 0.04 gating. Looks like lacquer on a
dark ground, not plastic, because the diffuse is unchanged. Hero only; data marks stay matte so "ink and clean" keeps
meaning.

**Metallic accent (one per frame).** Metal = no diffuse, F0 = accent colour, reflection from a PROCEDURAL studio
environment (no cubemap, no fetch): env(R) = base_gradient(R.y) + 2 softboxes: B_i * smoothstep(w+soft, w, angle(R, dir_i)),
roughness widens `soft`. Value: base 0.02-0.06, softboxes 1.5-4 (they must exceed 1 to bloom a hair at the hero rim).
Two softboxes at key and rim directions give the "Apple titanium" edge streak. One metal object per frame or it turns
into a render test.

**Gradients in linear light.** Mix colours in display-linear, THEN convert (`toSceneLinear`, gl-post card: "mix roles in
display-linear, never after"); mixing in sRGB makes grey mid-bands. Banding is the dark-mode killer: 8-bit dark ramps
step every ~0.3 % luminance. Use a **static** triangular dither (+-1 LSB, blue-noise or hashed, NOT re-seeded per
frame) at ALL levels, including exec: it is output quantisation hygiene, not a look, and a frozen pattern costs ~no
bitrate in H.264 (skip blocks) where moving grain costs 20-60 % (R-C #4). Proposed as a D-row (section 10).

**Dark-mode luminance ladder (measurable).** Percent = sRGB code value / 255 (what a designer calls it); in brackets
linear Y.
| tier | sRGB % | (Y) | pixel share | rule |
|---|---|---|---|---|
| background | 3-6 | 0.2-0.4 % | 80-92 % | never pure black: Material uses #121212 (7 %) for the same reason [A] |
| mid / data marks | 15-30 | 2-7 % | 6-15 % | the whole dataset lives here; neighbours differ by >= 2x in Y |
| hero | 80-100 | 60-100 % | <= 2 % | ONE mark, plus its emission halo |
| accent | one hue | | | exactly one chroma hue besides the neutral ramp |
Elevation = lighter, not shadowed [A: Material "elevated surfaces lighter"; overlay percentages in the sources disagree
(5-11 % at 1-5 dp, 9 % at 4 dp), so we use our own steps]. Gate proposal G12 (frame statistics on exported frames):
P50 luma <= 10 %, P99 >= 80 %, <= 3 % of pixels above 70 %, one chroma mode in the hue histogram (pixels with chroma
> 0.06). Light-ground exec inverts it (paper 94-98, mid 55-75, hero ink 5-15) and stays untouched.

**Tone mapping: keep PBR Neutral; AgX/ACES are variants for non-data pixels only.**
- ACES (Narkowicz fit) "produces serious hue shifts and extreme desaturation, making bright yellow and cyan
  unattainable" [B: model-viewer docs, Unreal posts]. No.
- AgX (Blender 4 default): "less hue shifting than ACES but the same drawback of significant desaturation" [B:
  model-viewer, three.js thread: "less saturated than ACES Filmic out of the box"; "Punchy" look closer to ACES]. Pretty
  highlights, but it breaks brand round-trip.
- Khronos PBR Neutral: "base colors without saturation loss, hue skews, or visual artifacts"; its author: AgX "is better
  [for filmic look] but severely desaturates colors; Neutral is in no way a competitor to AgX or other filmic tone
  mappers" [A/B: Blender PR #118936 snippet]. Our check (gl-post roles.json) gives dE 0 for 18 packs after the
  `toScene` inverse. Decision: Neutral for everything; ship an optional `tone: 'agx-punchy'` ONLY for the bloom/glow
  term and non-brand imagery if a hero cut wants a filmic shoulder (AgX's cost is one fused-pass function, ~0 s). Known
  weak spots stay as gl-post WARNs: saturated roles outside the Neutral gamut (neon-lab, terminal, high-vis).
- Exposure is the creative control, not the curve: +-0.3 EV across a beat is the "breathing" of product films.

---
## 5. Bloom and glow restraint, grain, vignette

Bloom exists (Jimenez 13-tap, tone map after). Rules to make it read as light, not as a filter:
- **Source.** Threshold on emission only (`bloomThresh 1.0` in scene units); soft knee 0.25 (quadratic knee: rq =
  clamp(br - thresh + knee, 0, 2*knee); rq = rq^2/(4*knee + 1e-4); contribution = max(rq, br - thresh)/max(br, 1e-4)).
- **Gain.** `bloomGain` 0.04-0.10 (the Jimenez add-back); the energy added outside the hero core must stay <= 0.1 of
  display white at any pixel (G12 check: P99.9 luma outside the hero bbox <= 0.55).
- **Count and time.** <= 1 glowing object on screen; area < 2 % of the frame; ramp 0 -> gain over 0.4 s, hold, decay over
  1.0 s (`ramp` param exists); a constant bloom is a screen filter. Bloom BEFORE DoF is wrong (out-of-focus highlights
  should bloom as discs): gl-post already does post-DoF bloom.
- **Radius.** 5 levels = ~32-px halo at half res; keep the halo < 1/8 of frame height or it fogs the labels.
- **Never on light grounds** (already skipped, `bloom:light-ground`).

**Grain.** Amplitude 0.012-0.02 after tone map, luma-weighted (1 - luma)^0.5, hashed in 2-3 backing-px lattice,
low-passed. Seed by frame index (pure). Grain cadence: set `grainFps` = export fps/2 (15 at 30 fps: every 2nd frame
new) so H.264 spends less on it; 24-on-30 gives uneven cadence [C, E]. Bitrate +20-60 % at same crf (R-C). **Vignette**
-8 to -15 % at the corners, inner 0.4; multiplicative; ~0 bitrate. Both only in the hero/teaser cut (`postLevel:
manager` + `hero:true`), default off. Static dither (section 4) is the only always-on dither.
Cost: fused, +0.00-0.05 s.

---
## 6. Camera language

**Lens.** Product looks are long lenses: 85-200 mm equiv = vertical fov 10-25 deg on a 24-mm sensor height; for a
bar-city or dot field use fov_v 20-30 deg (p5: `perspective(fovRad, aspect, near, far)`). Distance to frame height H:
d = (H/2)/tan(fov/2): fov 25 -> 2.26 H, fov 45 (our default?) -> 1.21 H. Long lens = flatter perspective, less
keystone on box edges, background plane compresses toward the subject, bokeh larger at the same f-number. Cost: none;
risk: near/far plane resolution (set `near` = 0.3 d, `far` = 3 d for depth precision with DoF). Dolly-zoom (`vertigo`) is a
horror/thriller tell; keep it for one explicit "reveal of scale" beat, never as the default.

**Moves** (gl-camera-rig names). *Dolly-in + rack:* d -> 0.82-0.9 d over 3-5 s, geometric, focus pull in the last 40 %
of the move (the subject gets sharp as you arrive). *Orbit:* <= 25-40 deg per shot, <= 8 deg/s so parallax reads and
N=16 suffices [E]; elevation drifts +-6 deg while orbiting (never a flat turntable). *Crane/lift:* 8-12 % of frame
height. *Hold:* 0.8-1.2 s absolutely still at the claim (the held frame is what is remembered), N=8.
Product-film tradition: slow reveal "is Apple's trademark", the product on a track or "curved slider, which keeps the
camera at a fixed radius", macro + shallow DoF [B: Manfrotto "how to shoot cinematic tech videos like Apple" snippet];
no source describes Apple's or the Blender/Houdini data shorts' rigs, so no claim is made about them beyond: they
move slowly, on one axis at a time, with damped starts and stops (U).

**Spring easing, closed form (pure of t, no integrator).** A keyed move is a sum of steps; a critically damped
second-order follower responds to a step of size D at t_i with D*(1 - (1 + w*tau)*exp(-w*tau)), tau = t - t_i, w = 2/T
(T = lag when tracking constant velocity: Unreal's `CriticallyDampedSmoothing` "InSmoothingTime is the time lag when
tracking constant motion"; Unity's SmoothDamp is the same spring [A: Epic and Unity docs snippets]). So pose(t) = pose0
+ sum_i D_i*g(t - t_i), g(tau) = 1 - (1 + w*tau)*e^(-w*tau); for a ramp use the integral (also closed form). T_eye
0.45-0.6 s, T_aim 0.30-0.4 s: the aim settles BEFORE the eye ("the frame finds the subject, then the camera drifts to
its place"), which is the lead/lag people read as "operator". Underdamped (zeta = 0.7) overshoots 4.6 %, zeta = 0.8
overshoots 1.5 %: use zeta 0.8 on orbit end-stops only if you want the "settle"; default critically damped (0 %).
Look-ahead: aim at target(t + T_aim) for moving targets so the lag cancels.

**Parallax with a foreground plate.** One large plate between camera and data at 0.25-0.4 D: a frosted pane edge, a
dim out-of-focus grid or "dust" of unit marks. Screen motion under lateral dolly scales as 1/depth, so a plate at 0.3 D
moves ~3.3x the data; data ~1x; a background grid at 3 D ~0.33x. A shot needs >= 6 % of frame width of relative
parallax to register as depth [E]. Plate at CoC 8-14 px (no text); one plate per shot; it is the DoF's raison d'etre.

---
## 7. Transitions

*Rule: one hero move at a time.* At any t at most one of {camera move, focus pull, bloom pulse, data morph/count,
transition} runs above 25 % of its peak amplitude; the others hold. Handoffs may overlap <= 0.3 s (like a J-cut: next
move starts as the last settles). Mechanism: the film declares `hero_moves: [{id, kind, t0, t1}]` in film.json; a gate
(G13) fails overlaps > 0.3 s. The six wave films fail this today if they dolly while counting (A-W5 will say).

**Object-carried match cut.** Pick the hero H of shot A; solve shot B's camera so H' (same object or the object it
becomes) lands at the same pixel and screen size: aim = H'; distance d_B = d_A * (size_A/size_B); verify with
`rig.worldToScreen` (< 1 px). Cut (or 0.5-s dissolve) at the instant of maximum velocity of the carried object, with
shutter 0.75 so the carried streak bridges; keep the SAME 3D instances and re-target them (object constancy, R-D M1)
when the data allows: then there is no cut at all, the camera continues. [B: School of Motion "match cut ... cut at the
fastest movement"; morphic: a visual/motion similarity between last and first frame].

**Wipe by light.** A soft emissive band sweeping across: mask m = smoothstep(w, -w, dot(uv - c, dirN) - s(t)); s(t) eased;
inside the band, scene B; outside, A; band luminance = 2.5-4 scene units (bloom picks it up, so the edge glows), width
w ~ 0.12 of the frame. Implement in the OUTPUT pass with two sources (render A and B only during the 0.6-0.9 s wipe,
2x scene cost for ~20 frames). Luma-matte mechanics are standard [B: Shotstack, School of Motion].

**Dissolve through blur (cheapest, hides swaps).** The transition IS a rack focus: focus distance -> camera (CoC to 20-30
px) over 0.35 s, swap scenes at peak blur (no cross-fade needed; at 25 px the identities are gone), focus out over
0.5 s. Cost = DoF only, no second scene. Best default between beats of one film.

**Dissolve through exposure.** exposure *= 2^ev(t), ev: 0 -> +2.5 (0.3 s, ease-in), swap at peak, ev -> 0 (0.5 s). The
Neutral shoulder compresses it to a near-white flash; use ONLY at chapter changes and only at manager level (flashes
violate the dark ladder). Cost 0.

Gotchas: sub-frame shutter must be clamped at the swap instant (section 1 gotcha 1); labels cross-fade with their own
opacity, not through the blur (flat layer rule); never wipe over a number being read.

---
## 8. Colour grading in the final pass

Order inside the fused OUTPUT pass: bloom add -> chroma -> **tone map (Neutral) -> grade -> vignette -> grain ->
dither**. Grading after the tone map keeps the scene-referred maths and the brand round-trip intact except by the
grade's own (small, declared) amount.
- **Lift/gamma/gain (3 vec3 + sat)**: c = pow(max(gain*c + lift*(1 - c), 0), 1/gamma); then luma-preserving
  saturation. Safe ranges: lift +-0.02 (cool the shadows by +0.004 in B), gamma 0.92-1.08, gain 0.95-1.05, sat 0.9-1.1.
- **ASC CDL** (slope, offset, power, sat): out = (in*slope + offset)^power; same capability, interchange with Resolve.
  (Search could not return the CDL spec [gap]; formula from memory, U.)
- **LUT as a 2D texture.** A 3D LUT of size S unrolled into an (S*S) x S strip: Unity's user-LUT is "strip format, e.g.
  256x16" for 16^3, "simpler ... does not require the advanced texture formats" [A: Unity docs]. Use S = 32 (1024x32) or
  33 for dark-region precision; 16^3 bands in dark mode. Shader: b = c.b*(S-1); slices floor/ceil(b); u = (slice*S + c.r*(S-1) + .5)/(S*S),
  v = (c.g*(S-1) + .5)/S; two fetches, mix by fract(b); LINEAR filtering, CLAMP; set via `setUniform('uLut', img)`.
  Bake it at BUILD time from the LGG/CDL numbers (deterministic Python, 32^3 = 32,768 entries) or from a .cube, embed
  as a PNG data URI (~3-10 KB; no runtime fetch). Verify identity LUT = identity (max err <= 1/255).
- **Law check.** The brand pack declares `grade: {lift, gamma, gain, sat, lut?}`; default null. dE budget: exec 0 (no
  grade at all), manager <= 4 on every role (brand_check.py computes it after the grade), hero cut <= 6. Cost +0.01 s.

---
## 9. Resolution and anti-aliasing

| method | what it fixes | cost | verdict |
|---|---|---|---|
| Halton jitter accumulation (N >= 8) | every edge, thin lines, texture shimmer, specular; also MB/DoF/shadow | already paid in section 1 | **default AA; N=8 floor** |
| supersample then downscale (dsf 4 -> 1080p lanczos) | same as 4x4 SSAA, no code | 3.5x fill | use for stills/hero only |
| MSAA on framebuffers | geometry edges only; not shader edges/alpha-tested cutouts | cheap on GPU; on SwiftShader costs memory x4 and half float MSAA needs `EXT_color_buffer_float` | skip: accumulation already beats it; p5 framebuffers in gl-post set `antialias:false` |
| FXAA / post AA | cheap smoothing of the finished frame | ~0.05 s | softens the whole image; only as fallback for N=1 live preview, never on labels [B: AA forum consensus: "softens the whole image ... can blur text/UI"] |
SSAA is "highest quality but by far the slowest", MSAA cheaper "comparable quality" but "sucks at smoothing moving and
thin objects", FXAA softens [B: forum snippets only; no benchmark]. For WebGL, MSAA via `antialias:true` is not
available on render-to-texture [U, my knowledge; verify]. **Recommendation:** master at 1920x1080 (dsf 2) with N >= 8
Halton; that is 8-16x supersampling of every edge. Native 4K (dsf 4) only for the hero cut of <= 12 s (360 frames):
4x pixels; per-frame ~ 0.4 s plain (given in WAVE-WOW), full hero look N=16 at 4K = (0.8 + 0.16*16)*3.5 = ~12 s idle,
~20 s loaded (E) -> 360 frames = 1.2-2 h; with 3 shards ~0.5-1 h. Then downscale a 1080p proxy from the 4K frames with
lanczos for the standard deliverable. Canvas 4K memory and screenshot speed headless: unmeasured (R-C). Delivery
stays sRGB/bt709 (section 1 tags); display-P3 only for an optional ProRes master.

---
## 10. Proposed default "hero look" (manager level; exec stays ink and clean)

Selected by `postLevel: manager` + `hero: true` in film.json (kit2 `--chrome` pack key `look: "hero"`); exec and
engineer paths are unchanged (exec = tone map only, no bloom/vignette/grain/shadow/reflection/glass, matte ink).
| block | setting |
|---|---|
| ground / ladder | brand bg 3-6 %, pool of light to 8-10 % under the subject, marks 15-30 %, ONE hero 80-100 %, one accent |
| lens | fov_v 26 deg, near = 0.3 d, far = 3 d |
| camera | spring T_eye 0.5 s, T_aim 0.35 s, dolly 0.88 d over 4 s, orbit <= 30 deg, elevation drift +-6 deg, 0.8-s holds |
| lights | key -35/+42 (1.0, wrap .25), fill +40/+10 (0.22), rim via Fresnel (0.3 data, 0.6 hero), hemisphere 0.12/0.03 |
| contact | baked AO 0.6 on ambient+fill; planar shadow alpha 0.4 with light jitter 4 deg; mirror pass hero + rank <= 12, R0 0.08, fade 0.6 h |
| materials | data = matte ink; hero = emissive 3-5 + spec 0.25 (shininess 80); optional ONE metal accent; no glass unless a plate is needed |
| shutter / samples | 0.35 (126 deg) at 30 fps; N = 8 hold / 16 slow / 32 fast, snapped; cuts clamp |
| DoF | lens accumulation, Cmax 8 px (1080p); ONE rack to the hero 1.0 s, aperture 0 -> 1 -> 0.25; foreground plate 10 px |
| bloom | thresh 1.0, knee .25, gain 0.06, ramp 0.4 in / 1.0 out, only the hero |
| finish | tone map Neutral; grade: lift B +0.004, gain 0.98/1/1.02 (brand-dependent), sat 1.0; vignette 0.10; grain 0.012 @ 15 Hz **only** `teaser:true`; static dither on |
| transition | defocus dissolve between beats; light wipe at the chapter change; one hero move at a time |
| text | flat SVG after post, never blurred/graded/grained; digits stay claims with formula or source |
**Cost per frame** (1920x1080, SwiftShader): holds 2.1 s idle (N=8) / 3.9 loaded; slow 3.4 / 6.0; fast (N=32) 5.9 / 10.3;
40-s film ~ 50 min idle, ~1.5 h loaded, plus ~+0.2 s/sub-frame for shadow+mirror passes (E, doubles geometry draws).
**Laws.** One clock, render(t,state) pure (Halton/Vogel/hash tables fixed; cuts and N declared in film.json); counts
before ratios unchanged; the glow is an emission claim (the hero is the claim); captions silent; the CETI card last
and flat; no runtime fetches (LUT and any env are data URIs / procedural); p5 + fonts vendored.

**Proposed D-rows (for DECISIONS.md, dated 2026-10-11 when ratified):** D12 hero look = manager-level preset, exec
unaffected; D13 export is accumulation-aware (shutter, samples, cuts, colour tags, shards, `samples` in export.json);
D14 static dither at all levels; D15 ladder + hero-move overlap gates G12/G13 (frame statistics; declared hero moves).
**Build order by buy-per-effort:** (1) export colour tags + cut clamp + adaptive N + shards; (2) ladder + dither
+ baked AO in gl-instances/heightfield; (3) closed-form spring camera in gl-camera-rig; (4) lens DoF in the same loop;
(5) planar shadow + mirror pass; (6) defocus dissolve and light wipe; (7) LUT + grade; (8) glass plate.

## Sources (WebSearch snippets, 2026-10-11)
- RenderMan shutter/motion samples: https://rmanwiki.pixar.com/x/144NB ; https://github.com/prman-pixar/RenderManForBlender/wiki/Motion-Blur-21 [A]
- Bevy motion blur (180 deg = 1/48 s; 60 fps stretching): https://dev-docs.bevyengine.org/bevy/core_pipeline/motion_blur/struct.MotionBlur.html [A]
- Maxon motion blur levels: https://help.maxon.net/rg/en-us/Content/html/Particles-and-3D/Form/rendering-motion-blur.html [B]
- Haeberli and Akeley accumulation buffer: https://www.microsoft.com/en-us/research/publication/the-accumulation-buffer-hardware-support-for-high-quality-rendering/ ; https://developer.nvidia.com/gpugems/gpugems/part-iv-image-processing/chapter-23-depth-field-survey-techniques ; redbook dof.c https://courses.cs.washington.edu/courses/csep557/99au/info/OpenGL/dof.c [A]
- Circle of confusion / DoF scaling: https://en.wikipedia.org/wiki/Depth_of_field ; https://www.cambridgeincolour.com/tutorials/depth-of-field [A]
- Rack focus: https://morphic.com/ai-glossary/Rack-Focus ; https://ftp.nfi.edu/?p=6435 [C, no durations found]
- Tone maps: https://modelviewer.dev/examples/lightingandenv/ ; https://projects.blender.org/blender/blender/pulls/118936 ; https://discourse.threejs.org/t/tone-mapping-overview/75204 [B]
- Contact shadows: https://engine.needle.tools/docs/how-to-guides/components/contact-shadows ; https://github.com/keijiro/ContactShadows ; https://threepipe.org/plugin/SSContactShadowsPlugin.html [B]
- GTAO: https://research.activision.com/publications/archives/atvi-tr-16-01practical-realtime-strategies-for-accurate-indirect-occlusion ; https://github.com/GameTechDev/XeGTAO [A]
- Planar vs SSR: https://docs.vulkan.org/tutorial/latest/Building_a_Simple_Engine/Advanced_Topics/Planar_Reflections.html ; Unity SSR manual [A/B]
- Fresnel/Schlick: https://gamedev.net/shaderlab/61-fresnel-and-rim-lighting/ ; LYGIA schlick.glsl [A]
- Dark theme: https://m2.material.io/design/color/dark-theme [A]
- Critically damped spring: https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/FMath/CriticallyDampedSmoothing ; https://docs.unity.com/en-us/engine/6000.7/script-reference/unityengine/vector3/smoothdamp [A]
- LUT strip: https://docs.unity3d.com/2018.1/Manual/PostProcessing-UserLut.html [A]
- Transitions: https://schoolofmotion.com/blog/six-essential-motion-design-transitions-tutorial ; https://shotstack.io/learn/luma-matte-transitions/ [B]
- Apple-style product video: https://www.manfrotto.com/global-en/stories/how-to-shoot-cinematic-tech-videos-like-apple/ [C]
- AA comparison (forum threads only): https://forum.level1techs.com/t/csaa-v-s-msaa-v-s-fxaa/45853 [C]
- No source found for: Apple/Blender/Houdini data-short camera rigs, rack-focus durations, ASC CDL spec, WebGL MSAA-to-texture. These are marked E/U above.
