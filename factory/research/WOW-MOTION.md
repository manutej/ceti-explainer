# WOW-MOTION · what makes product-demo motion stick, and a rubric to measure it · R-W1 · 2026-10-11

Wave WOW, lane R-W1. Extends arsenal/frontier/R-E (moves, holds T1-T8, label rules R1-R10) and R-D (comprehension
evidence); it does not repeat them. R-E asks "what moves keep a viewer oriented in a data picture". This note asks "what
makes motion feel finished, expensive, inevitable", and ends in a rubric (section 9) the gap audit (A-W5) can score frames against.

## 0. Method, honesty, grades
WebSearch only (WebFetch is blocked). Ten searches. They returned third-party snippets, never a primary Apple, Linear,
Stripe, Vercel, Figma, Anthropic or Kurzgesagt page, and no shot-length data for any studio. So most of what follows
about those houses is frame-level craft knowledge from memory. Grades:
- A  seen in a search snippet from an official or primary-looking source, or derivable by maths from one (springs).
- B  seen in several consistent secondary snippets (design-system mirrors, tutorials, packages).
- C  memory or inference; plausible, unverified here. A C number is a PROPOSED bar, to be checked against one reference
  frame strip before it becomes law. Where I name a house technique, it is C unless a grade says otherwise.
Search found nothing on: Apple shot lengths, Anthropic launch-film motion, Raycast/Arc/Family specifics, Jitter/Rive
showreels, sound's percentage share of "wow". Those sections say so.

The honest summary of the gap, before the detail: our films move correctly but do not move *expensively*. The expensive
look is five things stacked: (1) spring-derived or expo-out curves with a real, tiny overshoot and a long quiet tail;
(2) one hero move per beat with everything else lagging it by a fixed lead; (3) text and numbers that arrive as designed
objects (masked, tracked, weighted), never as pops; (4) light that has a direction, a falloff and a floor (soft shadow,
rim, gradient, grain), so flat shapes read as material; (5) camera and cut rhythm on a grid with scale variety. The
wave films currently have none of (1)(3)(4) and half of (5): cubic in-out cameras, flat SVG text, flat ink shading,
hard cuts (WAVE-WOW.md, "What we have").

## 1. Easing and physics

### 1.1 Springs: the numbers
Apple (SwiftUI spring API). `spring(response:dampingFraction:blendDuration:)`: response is the time of one oscillation
(period), dampingFraction 1 = no bounce, 0 = never stops [A: Apple doc snippet, createwithswift snippet]. The default
Animation is response 0.55, dampingFraction 1.0, blendDuration 0 [A: developer.apple.com/documentation/swiftui/animation/default].
iOS 17 added `spring(duration:bounce:)` and presets: `.smooth` = duration 0.5, bounce 0 ; `.snappy` = 0.3, bounce 0.15 ;
`.bouncy` = 0.5, bounce 0.3 [B: three developer-guide mirrors agree; not Apple's page]. bounce is roughly 1 - dampingFraction
for b >= 0 (derived; C on the exact mapping, but consistent with the presets' behaviour described in the snippets).

Derived table (damping ratio zeta, overshoot = exp(-pi zeta / sqrt(1 - zeta^2)), computed here; A as maths):
| zeta | overshoot | Apple-ish name | use |
|---|---|---|---|
| 1.00 | 0 % | default / .smooth | layout changes, camera, anything carrying a number |
| 0.85 | 0.6 % | .snappy (bounce 0.15) | UI-scale objects arriving, labels, cards |
| 0.80 | 1.5 % | | hero object landing, quiet |
| 0.75 | 2.8 % | | a hero reveal with a hint of life |
| 0.70 | 4.6 % | .bouncy (bounce 0.3) | playful; one per scene at most |
| 0.60 | 9.5 % | | toy; Kurzgesagt-style pops, never near a number |
Settle (2 % band, computed): critically damped, response 0.55 s -> 0.51 s; response 0.50 -> 0.46 s; response 0.30 -> 0.28 s;
zeta 0.7 with period 0.5 s -> 0.46 s; zeta 0.85 with period 0.3 s -> 0.23 s. So a product-demo hero move is a 0.45-0.8 s
settle; "snappy" UI is 0.2-0.3 s. Our current 3 s cubic in-out camera moves are 4-6x slower on the arrival and have no
tail, which is the single most visible difference in a frame strip (a cubic in-out has a mirror-symmetric ramp; a spring
or expo-out has a hard attack and a long asymptotic tail).

Material 3 (Google). Emphasized easing `cubic-bezier(0.2, 0, 0, 1)`; emphasized-decelerate `cubic-bezier(0.05, 0.7, 0.1, 1)`
(enter, about 400 ms); long2 duration 500 ms [B: several mirrors agree; one third-party page says (0.3, 0, 0, 1)].
Material 3 Expressive moved spatial motion to springs: community package tokens give default spatial stiffness 380,
damping 0.73; effects springs damping 1.0 with stiffness 800 / 1600 / 3800 (slow / default / fast); older Android fast
spatial 1400 / 0.9 [B for effects, C for spatial: packages disagree; official m3.material.io not reached]. Useful shape fact:
expressive spatial = ζ about 0.73-0.9 (0.4-3.5 % overshoot); effects (colour, opacity, blur) = ζ 1, never overshoot.
That split is the rule we want: **spatial properties may overshoot; opacity, colour, blur and any number never do.**

Cubic-bezier emphasized `(0.2,0,0,1)` is a fast-attack expo-like curve: about 50 % of the distance by 20 % of the time
(computed from the control points, C). It is the cheap approximation of a critically damped spring when a sampler needs
a closed form. In render(t) a real spring is also closed form (analytic step response), so purity is kept: for ζ < 1,
x(t) = 1 - e^(-ζωt) (cos ωd t + (ζω/ωd) sin ωd t), ωd = ω sqrt(1 - ζ²). No integrator state, seek-safe.

### 1.2 Anticipation, overshoot, follow-through (Disney 1981, translated)
Thomas and Johnston, The Illusion of Life (1981), twelve principles [A: snippets]. UI-guide translations seen [B, single
source, "starting points, test them"]: anticipation = 4-8 px counter-move before a dismiss; arrival squash/overshoot
= scale 102 % -> 100 %; press = scale 0.96 over 80 ms ease-out; stagger 40-80 ms per list item, 100-150 ms between
sections. The same guide keeps six principles for UI and drops timing/exaggeration. My working translation for a film (C):
- Anticipation: the hero object backs off 1-3 % of its travel (or scales 0.97) for 3-5 frames at 30 fps (0.1-0.17 s),
  then goes. It signals "something is about to happen" and is worth it only before the one hero move of a beat.
- Overshoot: 1-4 % of travel, rotation 1-3 deg; never on text position, never on a counter value.
- Follow-through / overlap: parts of one object arrive with a fixed lag (leader 0, follower +2-4 frames each, i.e. 70-130 ms),
  and secondary parts (shadow, label leader, glow) settle after the body. Heavier = later and slower.
- Settle: after the last visible motion, a hold of 0.3-0.5 s of true stillness, then the next beat begins. R-E T3 asks
  1.5 s after a *camera* move before a new number; the product-demo bar is about the object-level settle (0.4 s) and the
  film-level pause (R-E T3) stacked.
- Slow-in/out evidence (R-E T4: Dragicevic 2011, SI/SO 38 % correct vs constant 31 %, fast-in/out 15 %) says never linear.
  Product demos go further: asymmetric, fast-in with long out-tail on arrivals; the reverse (slow start, fast exit) on
  departures. Ease-out for entering, ease-in for leaving is the standard UI rule (C).

### 1.3 What 3Blue1Brown/Manim do, honestly
Manim Community: default `lag_ratio` for LaggedStart is 0.05 [A: docs snippet]; `there_and_back` goes up then reverses
under the smooth curve [A]; the default rate function is `smooth` (a sigmoid-polynomial) [B: ManimGL wiki snippet, CE not confirmed];
`run_time` default 1 s [C, not found]. Grant Sanderson's look is slow-in/slow-out smooth + `rush_into`/`rush_from`
for enter/exit, LaggedStart(0.05-0.2) for lists, Create/Write for strokes, and above all *one transform at a time*
with the voice carrying the rhythm. Because his films are narrated, the pauses are voice breaths (C). Our silent films
must put those breaths into the picture (section 7). Manim never overshoots; its "life" comes from the colour and
FadeIn(shift=...) offsets (a 0.2-0.5 unit drift while fading). That drift-while-fading is cheap, readable, and absent from
pop-in. Kurzgesagt (After Effects, 60 fps per its Skillshare course snippet [B]; "expressions, wiggle, time remapping, rigging"
in the same listing) is the other pole: bouncy ζ 0.5-0.7 overshoots, squash, wiggle loops, everything alive at all times.
That register is wrong for an ink/exec film; take its *layered ambient loops* (slow 1-2 px drift on background layers), not its bounce.

## 2. Choreography

### 2.1 Stagger
Seen: 40-80 ms between items, 100-150 ms between sections [B, single UI guide]; Manim LaggedStart lag_ratio 0.05 default [A].
What the houses do (C): lists and grids arrive in reading order, per-item offset 30-70 ms (1-2 frames at 30 fps is too
little to see; 4-8 frames is a visible wave), total wave no longer than about 0.6-0.8 s, each item on the same spring
(so the wave is an offset of one curve, not different curves). Stagger by distance from an origin (the click, the
hero) rather than by DOM order gives the "ripple" Linear and Stripe sites use. Cap: total stagger span <= 0.8 s or the
last item arrives after the first has settled and the beat feels slow.
Conflict with evidence, resolved: Chevalier/Dragicevic/Franconeri 2014 found staggering does not help *tracking* of
marks that change [R-E E14]. So: stagger **entrances** (new things appear), never **tracked transitions** (existing marks
re-partition). R-E T5 caps stagger at 0.25 in stack-city; keep that for data marks, and use stagger freely on chrome,
labels, legends, list rows.

### 2.2 One hero move at a time
Every product film has a beat structure of: hero move (largest, fastest attack, most travel) + 1-2 lagging supporting
moves (smaller, 60-120 ms later, shorter travel) + everything else at rest or in slow ambient. Count simultaneous
moving *objects at full speed*: 1. This is the single most transferable rule; our wave films often move camera, marks,
labels and caption simultaneously (R-E T5 already forbids it for data, but chrome is not counted). Measure: at any
frame, rank on-screen velocities; the top mover should be >= 3x the second (rubric P7).

### 2.3 Object-carried transitions (match on action) instead of cuts
Apple Keynote Magic Move: shared objects move between slides and the rest fades; not applicable to charts [A: Apple help
snippet, R-E E20]. The pro-demo equivalent is a *shared-element transition*: the thing the viewer is looking at
becomes the next scene's anchor (a card grows into the full screen; a number flies into the formula; a dot becomes the
pile). Rules (C): the shared element keeps its screen position through the cut frame; the camera or layout moves *around*
it; motion direction continues across the join (a rightward exit meets a rightward entry; the 180-degree rule, R-E E10);
speed at the join is non-zero (cut during peak velocity hides the cut; cut at rest announces it). R-E P13 says
"cut only if the anchor keeps its screen place"; this adds "cut on motion". A hard cut at rest is acceptable at chapter
boundaries (once per 20 s at most).

### 2.4 Speed ramps
Film-edit technique: a move runs fast then decelerates hard into the hold ("whip then land"), or time-remaps a long
process to ×8 and eases back to ×1 at the point of interest. The camera version is an expo-out dolly: 70 % of distance in the
first 25 % of time. It reads as confidence. For data pictures: speed-up through the boring middle of a count-in
(100,000 dots at ×4) then ease to real speed for the last 1-2 % so the final count lands legibly. Needs a time-warp
function t' = w(t) feeding render; pure, seek-safe (C).

### 2.5 Hierarchy of attention in a frame
Peak contrast + size + motion are the attention budget; spend all three on one thing. Everything else gets one: dimmed
(luminance -30 to -50 %), blurred (DoF), or still. R-E P9 already has `dim` and rack focus; the product-demo habit is to
dim *by default* and light the subject (a spotlight falloff radial gradient in the background layer behind the hero).

## 3. Rhythm

### 3.1 Beats on a grid
Product films are cut and animated to a musical grid (C: Apple, Linear, Vercel film edits sit on 90-128 bpm
beats). Silent films have no track, but the grid still works as a *clock for the eye*: choose a beat period b
(0.5 s = 120 bpm, or 0.667 s = 90 bpm), and snap all motion starts to multiples of b (or of b/2), all holds to
integer beats. The viewer perceives regularity and reads it as design. Measure: histogram of motion-start times
modulo b; > 80 % within +/- 2 frames of a grid line (rubric P12). Compatible with our one clock (law).
Bar-level structure: 4 beats = one idea, 8 = a section; a new scale or camera setup every 2 bars.

### 3.2 Hold lengths
Seen nothing primary. Working numbers (C), consistent with R-E T1/T3: a headline claim holds 2.5-3.5 s; a supporting
detail 1.2-2 s; a transition between ideas has no hold (the move itself is the beat); the very last frame holds 2+ s.
Apple-keynote-style product reveals use *long* quiet holds (1.5-3 s on a single object on a plain field) after a dense
sequence: the rhythm is dense-dense-dense-silence-dense. The silence IS the beat; a film that is uniformly busy has no
rhythm. Measure: variance of inter-motion gaps; target a bimodal mix (gaps <= 0.3 s inside sequences and >= 1.2 s between),
not a flat 2 s metronome (rubric P11).

### 3.3 Shot-scale variety
Macro (one glyph, one dot, one UI control fills 40 %+ of the frame), medium (the object plus context, the default),
wide (the whole system, many objects at small size). Product films alternate: wide establishes, medium explains,
macro rewards (the detail you could not see before), wide closes. >= 3 scales per minute and never the same scale in
three consecutive beats (C). This is Conlen/Heer "resolution of scale" [A, R-E E7] in practical form. Scale of a
shot = fraction of frame height occupied by the primary subject: macro > 0.5, medium 0.2-0.5, wide < 0.2.

### 3.4 Reveal cadence
Reveal order per beat (C): context at rest (0.3-0.5 s) -> the thing enters (hero move, 0.5-0.8 s) -> the label attaches
(+0.2-0.3 s lag, own leader animation) -> hold (1.5-3 s) -> the next thing's anticipation overlaps the last 0.2 s of
hold (the "pre-lap": the next move begins before the previous has fully gone still, sub-perceptibly, so the film
has momentum). Our laws say a number appears only after its count and with a formula or source; that is compatible:
the pre-lap is for chrome and camera, not for digits.

## 4. Type in motion

### 4.1 Entrances
House look (C): text never pops. Three families, in ascending cost:
1. Mask reveal: each line sits inside an overflow-hidden clip; the line translates up from 100 % to 0 with expo-out
   (0.5-0.7 s), lines staggered 60-100 ms. Also the "slide out of a slot" for numbers. Linear, Vercel, Apple use this (C).
2. Per-word or per-glyph stagger: opacity 0 -> 1 with translateY 8-16 px and blur 6 -> 0 px (blur-in), 25-40 ms per glyph
   (word: 60-120 ms), total <= 0.7 s per line. Anthropic's product pieces lean on soft, slow word-level fades with
   very slight vertical drift (C, from memory of their launch films; ungraded).
3. Variable-font weight/width sweep: weight 300 -> 600 over 0.6 s on arrival so the word "lands" with mass. Only if the
   vendored font is variable; we vendor fonts (law) so this is a font-choice item for R-W3.
Never: letter-by-letter typewriter at constant rate in a hero line (reads as a terminal, and slow); scale-pop from 0;
elastic bounce on body copy; cross-fade of two different numbers (R-E R5 already forbids).

### 4.2 Numbers with weight
Counters: digits roll (each place a vertical strip, odometer) or count with ease-out so the last 10 % takes 40 % of the time;
tabular numerals (fixed advance) so the layout does not shimmer; the digit that matters gets weight (+100 weight or
+10 % size) for 0.3 s at arrival, then relaxes. Law check: counts before ratios; every digit a claim. The counter's
intermediate values are *not* claims unless they are real counts (a count-in of real units is fine; an ease-out count
to a target of a ratio is decoration and must be marked as such). Measure: digit width constant over the roll (tabular);
final value reached with velocity -> 0.

### 4.3 Labels that attach
A label is an object: a dot appears on the target (scale 0 -> 1, ζ 0.85, 0.2 s), a leader line draws from the dot to the
label anchor (stroke-dashoffset or trim-path, 0.25-0.4 s, expo-out), the label mask-reveals at the end of the leader
(own 0.3 s), and on removal the sequence plays in reverse at 0.6 x duration. Leaders are 1 px at 960 wide (1.5 px at 4K
preserved by pixelDensity), end in a dot or a short tick, never an arrowhead at hero level. Compare current: gl-labels
solver places boxes (R-E R1-R10) but hard-cuts them. Add a *draw-on* between cuts: lines cost almost nothing.

### 4.4 Tracking and size discipline
Apple and Stripe type pairs (C): display type at tight tracking (-1 % to -3 % at 48+ px), body at 0 to +1 %, micro
labels all-caps with +6 to +12 % tracking at 9-11 px. Size ratios step by ≥ 1.5x between hierarchy levels (display 64 / title 32
/ body 18 / label 11 at sheet scale), never 1.1-1.2x steps. Max 3 sizes on screen at once. Line length for captions
<= 42 characters; leading 1.2 display, 1.45 body. Measure from the source: set of distinct font sizes per beat <= 3;
ratio of adjacent sizes ≥ 1.4 (rubric P10).

## 5. Light and material
What flat-shaded ink lacks, in order of cost to add (and what a pure shader or pure 2D layer can do):

| property | house look (C unless graded) | our reach |
|---|---|---|
| Soft shadow | two-layer: tight contact (blur 2-4 px, alpha 0.25) + wide ambient (blur 24-48 px, alpha 0.08-0.15), offset down 8-20 px, tinted by the surface colour not pure black | cheap in 2D (SVG filter or canvas shadowBlur), a blurred quad in WebGL |
| Rim / edge light | 1 px inner stroke at 8-16 % white on the top and leading edge of dark panels; Linear/Raycast/Vercel cards all have it | 2D stroke with gradient; in GL, fresnel term |
| Glass / blur | backdrop blur 16-32 px, saturation +20-60 %, white fill 4-10 % over dark, 1 px rim; Apple "liquid glass" adds refraction at the rim | gl-post blur needs a backdrop copy; one extra pass; bloat-free |
| Gradient | big, low-contrast radial/mesh blobs behind the hero, hue shift ≤ 40 deg across, animated at ≤ 1 deg/s (Stripe, Linear glows) | trivially pure: gradient position = f(t) |
| Bloom | restraint: threshold high (only emissive/hero), strength 0.15-0.35, radius small; used on one element per shot. Overbloom is the most common amateur tell | gl-post has bloom |
| Grain | 1-3 % luminance noise, monochrome, re-seeded every frame (24 fps cadence even on 60 fps), blends away banding on gradients | gl-post has grain; seed = frame index (pure) |
| Vignette | 10-25 % darkening at corners, smooth; subtle | gl-post |
| DoF / rack focus | f/2-2.8 look, background circle of confusion 4-12 px at 1080p; focus pull 0.5-0.8 s with ease; the subject stays sharp; also hides low-detail backdrops | gl-post has depth DoF |
| Colour grade | single global curve: lifted blacks (≈ #0A0A0C not #000), slight teal in shadows / warm in highlights, saturation -5 to -10 %, tone-mapped highlights (PBR Neutral already in gl-post) | gl-post |
| Chroma aberration | 0.5-1 px at the corners only, or absent. Heavy = cheap | gl-post |

### 5.1 Dark-mode luminance ladders (the "layered dark UI" look)
Dark product UI is built from 5-6 steps of near-black, never one: page #08090A-#0B0C0E (L 3-5), panel +3-4 L, raised panel
+7-8 L, hairline border +12-15 L, secondary text L 55-65, primary text L 92-96 (not 100). Contrast between *adjacent*
steps is small (ΔL 3-5), so depth reads by light edges (rim) and shadows rather than by fill. Pure #000 and #FFF
are the amateur tell. Measure from frame strips: count distinct background luminance bands (≥ 4), check max luminance of
text <= 96 % and the darkest pixel ≥ 2 % (rubric P16). Our "ink" material is paper-ish light-mode; the exec-level law
keeps ink and clean; this ladder applies to the dark brand packs only, and ink needs the same discipline inverted: paper
steps (#FAF8F4 page, #F2EFE8 panel, #FFF raised) with warm shadows.

### 5.2 Restraint law
Each effect appears once per shot and with the *lowest visible* strength. Test: remove it; if no viewer notices in a
blink, it was right at zero and wrong to add. R-D already: bloom, DoF persuade rather than explain; off at exec level.
So: in exec films use soft shadow, rim, gradient, grain, vignette (all pure and quiet); reserve bloom/DoF for
hero reveals in non-exec films.

## 6. Camera
- Dolly: push-ins are expo-out with 3-8 % travel in "ambient" shots (a 1-2 % scale drift over a 6 s hold is the
  Ken Burns of product films: the picture is never dead). Real moves are 15-40 % scale changes in 0.8-1.4 s, expo-out, with a
  0.3 s overshoot-free settle. R-E T2 allows 6-8 moves per 150 s; product films do one hero camera move per 4-6 s.
- Parallax layers: 3-5 layers (background gradient, far texture, mid objects, hero, foreground blur/particles) moving at
  ratios 0.2 / 0.5 / 1.0 / 1.3 relative to the camera. Parallax is what makes a 2D UI feel 3D; it needs no geometry.
  Depth-of-field on the foreground layer (blur 6-12 px, alpha 0.5) sells it. Worth an arsenal lane (2D parallax stack).
- Orbit: ≤ 30 deg on product renders (Apple hardware films orbit 15-45 deg around the object while it rotates slowly);
  ease with the same expo-out/in-out hybrid; keep eye level. R-E's rig covers orbit to 90 deg for data; the lesson here is
  the *continuous slow orbit* under every hold (R-E P12 ambient ≤ 3 deg), which we have.
- Rack focus: pair with a text change; the focal plane moves 0.4-0.7 s; reserve for one per 20 s.
- Lens: product/UI film uses a long-ish lens (fov 18-35 deg, 70-120 mm equivalent) for flattering, low-distortion
  compression; wide (fov 60+) only for the dolly-zoom or a scale-shock. R-E P3 already says fov ≤ 35 for marginal pairs.
  Measure the fov in film.json; > 45 deg on a hero shot is a flag.
- Handheld/shake: Jitter and Raycast-style showreels sometimes add 0.2-0.5 px noise-drift (1/f, 0.1-0.3 Hz) to the virtual camera so
  held shots breathe. Pure: sum of 2-3 sines with irrational frequency ratios, f(t).

## 7. Sound's share, and what a silent film loses
No study found that gives a percentage for sound's share of the "wow" in motion graphics (the search says so explicitly).
Adjacent evidence [A as snippets]: visual dominates overall audio-visual quality in mixed content, but for certain
distortions audio mattered more; a 120-participant study showed sound effects with abrupt onsets change perceived
rendering quality; a sound source attracts visual attention; room-acoustic rendering matched a five-fold resolution gain on
VR immersion. Honest estimate (C): in a product demo, music + UI sounds carry the *rhythm lock* (the beat grid), the
*weight* of arrivals (a low thud on a hero landing makes 0.5 s of motion feel 2x heavier), the *punctuation* of cuts, and
the *emotion*; I would put 30-50 % of felt polish on audio in the Apple/Linear/Vercel launch films, which is a guess, not a measurement. A silent
film loses: (a) weight cues, (b) cut hiding (sound bridges hide discontinuities), (c) beat lock, (d) emotional pacing, (e)
attention direction (a tick tells you where to look). It keeps: everything visual, captions, and law-compliant accessibility.

What substitutes, all visual and all pure:
1. **Visual beats**: a 2-4 frame impulse on arrival: 1-2 % camera nudge or scale kick (impact frame), a 0.15 s white flash at 4-8 %,
   a ring pulse (stroke expanding 1x -> 2x while fading in 0.4 s) on the point of landing. This is the "thud".
2. **Settle tails**: the long spring tail replaces the reverb; stillness replaces the music break.
3. **Grid**: the beat period (3.1) gives the viewer a clock without a speaker.
4. **Transient emphasis in time**: an element's *attack* is faster than its *release* (attack 1-3 frames, release 10-20) so
   it "hits", like an amplitude envelope.
5. **Caption timing** acts as the voice-over: captions enter on the beat, 0.1-0.2 s after the visual, hold ≥ 1.3 s +
   0.06 s per character (c. 17 cps cap, C).
6. **Haptic-like screen shake** only for a single impact per film, ≤ 2 px, 0.2 s, decaying sine. Optional and loud; a
   caution against persuasion over explanation.
Expected recovery: with 1-5 done well we recover most of (a)(c)(e) and little of (b)(d). Do not promise equivalence with a
scored launch film; promise equivalence with the *best silent* motion (e.g. Linear's looping feature clips, Stripe's
hero animations, which are silent and carry the effect on curve + light + type alone).

## 8. Frame rate, motion blur, resolution
- Frame rate. Product films deliver 24/25/30 (Apple event films 24 or 30 cinema-ish for hardware, 60 for UI captures; C);
  web hero loops 60 fps; Kurzgesagt's course snippet says 60 fps [B]. Rule: motion below 30 fps reads as stutter for
  fast moves (> 0.25 frame-heights per second); our export does 30 fps (kit default?) so every fast move needs motion blur
  or must be slower than 300 px/s at 1080 line. 60 fps doubles cost (0.4 s/frame at 4K -> 2x film time) and is worth it
  only on hero-move-dense films; for narrow-view embeds 30 + blur is the compromise.
- Motion blur. Film rule: 180 degree shutter = exposure of half the frame time (1/48 s at 24 fps, 1/60 s at 30, 1/120 s
  at 60 fps) [A: shutter snippets; "fast motion needs more frames, not the rule"]. Pure-render version: `renderAccumulated`
  with N sub-frames spread over a shutter window of 0.5 frame period. N >= 8 for hero moves (smooth streaks), 4 is the
  visible-ghosting floor (C: ghost spacing in pixels = velocity × shutter / N; keep it ≤ 1.5 px). Per-property: blur only
  what moves; the camera moves blur the whole frame, which is why text should be in a layer that can opt out when it is
  the hero. Measure: ghost spacing; reference-strip streak length ≈ speed × 0.5 / fps.
- Resolution. Export 3840×2160 (pixelDensity 2 of 960×540 gives 1920×1080 only; 4K needs density 4) so hairlines (1 px at sheet scale)
  stay ≥ 1 device px at 1080 downscale. Supersample 2x then downscale for AA; temporal AA from the sub-frame accumulation is
  free if N ≥ 4. Banding is the dark-gradient failure at 8-bit: add 1-3 % grain or dither (section 5).
- Strobing check: any element moving > 15 px/frame with no blur and high contrast edges is a stutter risk. Measure from
  frame diff.

## 9. MEASURABLE RUBRIC (22 properties)
Scoring: each property scores 0 (fails the bar), 1 (meets), 2 (exceeds). Product-demo bar = ≥ 85 % of the max (≥ 38 / 44) with
no zeros on the five marked ★ (those five alone separate "decent" from "WOW"). "Source" = measure from film.json /
the render function; "Strip" = measure from frames at 30 fps (extract with arsenal/tools/export.mjs; a contact sheet every 0.5 s
and a dense 8-frame strip around each move). Grades say how sure I am the bar is what the houses do (A/B/C as in section 0).

| # | property | how to measure | the bar | grade |
|---|---|---|---|---|
| P1 ★ | Hero-move easing is never linear or plain cubic | Source: list the ease name of every move with travel > 5 % of frame; Strip: plot position vs frame for a hero move, check asymmetric attack | 0 linear, 0 plain cubic in-out on hero moves; spring, expo-out, or Material emphasized `(0.2,0,0,1)` | B |
| P2 ★ | Settle time of a hero move (time from 98 % of travel to the last visible motion) | Strip: frames from "within 2 % of target" to "pixel diff < 0.2 %" | 0.4-0.8 s (≥ 0.4 s) | A (spring maths) |
| P3 | Overshoot on spatial hero moves | Strip: max excursion past the target / travel | 0.5-4 % on objects; 0 % on text, colour, opacity, numbers; ≤ 1 overshoot cycle | A (maths) / B |
| P4 | Anticipation present before hero moves | Strip: frames before the move start show a 1-3 % counter-move over 3-5 frames | on ≥ 50 % of hero moves; absent is fine for camera moves | C |
| P5 | Follow-through / overlap | Strip: onset lag of secondary parts (shadow, leader, glow) relative to the body | secondary parts lag 2-4 frames and settle after the body on ≥ 80 % of hero objects | C |
| P6 | Stagger on entrances | Source: per-item offsets; Strip: first and last item arrival | 2-3 frames per item for chrome and 4-8 for text blocks (about 70-270 ms at 30 fps, 40-80 ms being the sourced list value), total wave ≤ 0.8 s; none on tracked mark transitions (R-E T5) | B |
| P7 ★ | One hero move at a time | Strip: per-frame velocity of each moving object; ratio top / second | top ≥ 3× second in ≥ 90 % of moving frames | C |
| P8 | Shared-element / object-carried transitions | Source: count scene joins; Strip: the cut frame ±3 | ≥ 70 % of joins carry an anchor with the same screen position, and cut at non-zero velocity; ≤ 1 hard cut per 20 s | C (cut count), B |
| P9 | Speed ramp on at least one long process | Source: time-warp use; Strip: velocity curve | ≥ 1 per film with ≥ 4× fast part and ease to ×1 at the point of interest | C |
| P10 ★ | Text enters masked, staggered or blurred-in; never pops | Strip: the 6 frames after any text appears; Source: entrance ops | 100 % of text objects; 0 single-frame appearances except in the captions track; ≤ 3 distinct sizes per beat, adjacent ratio ≥ 1.4 | C |
| P11 | Rhythm: dense runs separated by silences | Strip: inter-motion-gap histogram | bimodal: ≥ 40 % of gaps ≤ 0.3 s and ≥ 15 % ≥ 1.2 s; no flat metronome | C |
| P12 | Beat grid | Source: motion start times modulo beat b | ≥ 80 % of starts within ±2 frames of a grid line | C |
| P13 | Shot-scale variety | Strip: fraction of frame height of the primary subject, classed macro > 0.5 / medium 0.2-0.5 / wide < 0.2 | ≥ 3 scales per minute; no scale 3 beats in a row | C |
| P14 | Number arrival | Source: counter implementation; Strip: digit-width variance; value timeline | tabular digits (0 px width change), ease-out last 10 % takes ≥ 40 % of the time, weight emphasis on arrival, and every value a real claim (CETI law) | C |
| P15 | Labels attach with animated leaders | Strip: label frames; Source: leader draw | 100 % of labels have a draw-on leader or dot (≥ 6 frames), label after leader; removal at 0.6× | C |
| P16 | Luminance ladder / material depth | Strip: histogram of the background; count distinct fills; text luminance | ≥ 4 distinct near-neutral surface steps; text ≤ 96 % luminance; darkest pixel ≥ 2 % in dark brands; ≥ 1 of shadow / rim light on every card | C |
| P17 | Soft shadow and rim on raised objects | Strip: shadow blur radius and alpha | two-layer shadow (tight + ambient), rim at 8-16 % white | C |
| P18 | Grain and banding control | Strip: variance in a flat gradient region across consecutive frames | luminance noise σ 1-3 %, changes per frame; no visible 8-bit bands in gradients | C |
| P19 ★ | Effects restraint: bloom / DoF / chroma used once per shot, below visible threshold when removed | Source: gl-post params per shot; Strip: A/B with effect off | bloom strength ≤ 0.35; ≤ 1 DoF rack per 20 s; chroma ≤ 1 px; 0 on exec level | B |
| P20 | Camera: lens and parallax | Source: fov, layer count and ratios | hero fov 18-35 deg; ≥ 3 parallax layers in non-data films; ambient drift 1-2 % over holds | C |
| P21 | Motion blur or fast-move legibility | Source: shutter and sub-frame N; Strip: ghost spacing | moves > 300 px/s at 1080 are blurred with N ≥ 4 (8 for hero), shutter 0.5 frame period; ghost spacing ≤ 1.5 px | A (rule) / C |
| P22 | Silent-film substitutes | Strip: impact frames at hero landings | ≥ 1 visual beat (nudge, ring pulse or flash) per landing of a hero object; captions enter on the beat and hold ≥ 1.3 s + 0.06 s per char | C |

★ properties: P1, P2, P7, P10, P19 (easing, settle, hierarchy, type entrance, restraint) are the ones whose absence is
visible in the first 10 seconds, even to a lay viewer. The gap audit should score these first.

Conflict notes against our laws (resolve in A-W5, do not silently relax a law): P6 stagger vs R-E T5/E14 (stagger entrances,
not tracked marks); P14 ease-out counters vs "every digit is a claim" (a count-in of real counts passes; a faked
ratio roll does not); P19 bloom/DoF vs "exec level is ink and clean" (off); P22 screen-shake and flashes vs "silent with captions"
and persuasion-over-explanation (keep ≤ 1 per film, never over a number); P16 dark ladders vs the ink paper brand (invert the ladder).

## 10. What a pure render(t) in p5 can reach (pointers for R-W2..R-W4, not a plan)
Reachable now with no new library: springs and expo-out (closed-form functions), masked text (clipping rect in the 2D
overlay or a clip-path), stagger, draw-on leaders, grid-snapped starts, two-layer shadows, gradients as f(t), grain
seeded by frame index, vignette/bloom/DoF/grade/PBR Neutral tone map (gl-post), temporal sub-frame motion blur (renderAccumulated).
Needs a small new lane each: a motion-curve module (spring / expo / emphasized / ramp), a text-reveal module (mask, glyph
stagger, tabular odometer), a label-attach module (dot + leader + label), a glass/blur panel (backdrop copy), a parallax-stack
layer set. Sound is not available; section 7 substitutes are pure. The expensive thing is not code but *discipline*:
the same six curves everywhere (a token set: `spring-hero`, `spring-snappy`, `expo-out`, `emph`, `ramp`, `settle`), a beat
grid in film.json, and the rubric as a gate (G12). Costs: text and curve modules ≈ few KB; sub-frame blur multiplies
frame time by N (8 sub-frames at 0.4 s/frame at 4K = 3.2 s/frame; film of 60 s at 30 fps = 1,800 frames = about 96 min
single-threaded: budget it for hero shots only, N = 4 elsewhere).

## 11. Sources
Seen in search snippets (query date 2026-10-11). Only these are cited; none was opened in full.
- Apple SwiftUI Animation.default (response 0.55, damping 1.0, blend 0): https://developer.apple.com/documentation/swiftui/animation/default.md [A]
- createwithswift, "Understanding Spring Animations in SwiftUI" (response = single oscillation; damping 0/1): https://www.createwithswift.com/understanding-spring-animations-in-swiftui/ [B]
- iOS 17 presets (smooth 0.5/0; snappy 0.3/0.15; bouncy 0.5/0.3), mirrored guides: https://tessl.io/registry/dpearson2699/swift-ios-skills/3.6.1/files/skills/swiftui-animation/SKILL.md ; https://nilcoalescing.com/blog/AnimationTimingInSwiftUI [B]
- Material components Android Motion.md (mirror and raw): https://raw.githubusercontent.com/material-components/material-components-android/master/docs/theming/Motion.md ; https://gitea.com/784622644/material-components-android/src/branch/master/docs/theming/Motion.md [B]
- Material Expressive tokens in Flutter packages: https://pub.dev/documentation/material_expressive/0.7.0/ ; https://pub.dev/documentation/m3e_slider/0.0.2/common_m3e_common/M3EMotion-class.html [B/C]
- Emphasized and decelerate curves, duration tokens (mirrors): https://davaux.codeberg.page/ui-docs/motion ; https://atlassian.design/foundations/motion/applying-motion ; https://slack.unless.com/en/design/foundations/motion/ [B]
- UI-translated Disney principles, anticipation 4-8 px, stagger 40-80 / 100-150 ms: https://playbooks.com/skills/dylantarre/animation-principles/motion-designer ; https://uxcel.com/blog/12-principles-of-animation-a-guide-to-motion-design-133 [B, single-source numbers]
- Manim Community LaggedStart (lag_ratio 0.05), rate_functions: https://docs.manim.community/en/stable/reference/manim.animation.composition.LaggedStart.html ; https://docs.manim.community/en/stable/reference/manim.utils.rate_functions.html [A]
- Kurzgesagt Skillshare course listing (After Effects, 60 fps, expressions, rigging, wiggle): https://www.skillshare.com/en/classes/Motion-Graphics-with-Kurzgesagt-%E2%80%93-Part-1/631970755 [B]
- 180-degree shutter rule and its limits at 60 fps: https://provideocoalition.com/the-180-shutter-angle-rule-is-broken ; https://www.diyphotography.net/?p=309010 [A/B]
- Audio-visual quality and sound effects on perceived rendering: https://doaj.org/article/ca8a211a6c24409a8a995d14062297c3 ; https://www.frontiersin.org/journals/signal-processing/articles/10.3389/frsip.2022.904866/text [B]
- "Linear style" dark UI commentary (trend piece; no Linear-site measurements): https://bootcamp.uxdesign.cc/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646 [C]
- Shot-length background (general, no Apple data): https://tools.wbez.org/average-shot-length ; https://widescreenjournal.org/wp-content/uploads/2022/08/formatted-cutting-rates.pdf [B]
- Local: arsenal/frontier/R-E-perspective-shift.md (E1-E20, T1-T8, R1-R10); arsenal/frontier/R-D-moves.md (S1-S36); factory/WAVE-WOW.md.
Not found, so not claimed: any primary page of Apple, Linear, Stripe, Vercel, Figma Config, Anthropic, Raycast, Arc, Family,
Jitter or Rive; Apple/Anthropic shot-length statistics; a quantified sound share. Every per-house statement above is C.
Next step that would turn C into B/A: pull 6-10 reference clips the owner already likes, extract a dense strip around each
hero move with ffmpeg on the owner's machine, and fit the curve (settle, overshoot, stagger offset, scale classes)
to replace the proposed bars in section 9.
