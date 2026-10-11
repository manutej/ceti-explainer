# WOW gap audit · A-W5 · six films against the product-demo bar (2026-10-11)

Scope: who-gains, pass-every-time, one-query, noether-symmetry, noether-applied, noether-frontier (all 153 s, feature-long,
material "ink", level manager). Rubric: factory/research/WOW-MOTION.md section 9 (P1–P22, five starred).

## 0. Method (what was measured, how sure)
- Watched: `frames/thumbs/` every 0.5 s (contact sheets at 2 s, then dense crops). Cites use the gate strips:
  strip = floor(t/6)+1, cell = (t mod 6)/0.5, 12 cells per strip (e.g. 40.0 s = strip-07 c8).
- Measured from `export/<film>-1080p.mp4` at 30 fps (4,590 frames each): per-frame mean absolute luma difference on the
  picture band (caption band and top chrome cropped) at 192×108. "Still" = diff < 0.05/255. Hero-move velocity profiles,
  holds, cut spikes and label/caption entrance curves come from this signal (grade B for timing, C for "hero" calls).
- Source: easing identifiers in film.js (grep only), `rig.moves` in film.json, `lib/cam.base.json`, knobs.
- Not measured: anticipation frames (P4) and overshoot (P3) beyond "the source has no spring"; per-object velocity
  ratio (P7) is judged from the strips, not tracked.

## 1. The finding in one paragraph
Every hero move in all six films is a symmetric cubic in-out or a quintic smootherstep (`sm`, `EI`, rig `"ease":"inout"`;
no spring, expo-out or emphasized curve is used anywhere) and every one is slow: the measured hero moves run 4.5–11.2 s
with attack/release ratios of 0.6–1.1 (symmetric). Product demos run hero moves in 0.6–1.5 s with an attack that is
a third of the release, and then hold. Ours glide, then sit still: 58–68 % of all frames are still in five of six
films, with dead holds of 8–12 s, while the captions run too fast to read (Noether films: 7/45, 10/32 and 11/33 captions
meet the hold rule). Words fast, picture slow is the wrong way round. Text appears by a linear 0.25–0.37 s opacity
ramp or pops in a single frame; nothing is masked, staggered or drawn on; no numeral is tabular. Light is flat face
shading on a single-fill background, the post stack is unused (who-gains runs gl-post at `exec` with bloom 0.06, which
is invisible), and there is no AA, so one-query's floor grid shows moiré for 18 s. What is already at the bar is
the *argument* grammar: the same marks, re-plotted, carried through a change of view. The rubric does not score that
strength, and the re-cut must keep it.

## 2. Rubric scores (0 fails, 1 meets, 2 exceeds; "0p" = present but out of band, cheapest to recover)
| # | property | who-gains | pass-every-time | one-query | n-symmetry | n-applied | n-frontier |
|---|---|---|---|---|---|---|---|
| P1★ | easing not plain cubic | 0 | 0 | 0 | 0 | 0 | 0 |
| P2★ | settle 0.4–0.8 s | 0 | 1 | 1 | 1 | 0 | 0 |
| P7★ | one hero move at a time | 1 | 1 | 0 | 1 | 1 | 1 |
| P10★ | text masked/staggered, no pops | 0 | 0 | 0 | 0 | 0 | 0 |
| P19★ | effects restraint | 1 | 1 | 1 | 1 | 1 | 1 |
| P3 | overshoot on objects | 0 | 0 | 0 | 0 | 0 | 0 |
| P4 | anticipation | 0 | 0 | 0 | 0 | 0 | 0 |
| P5 | follow-through of secondary parts | 0 | 0 | 0 | 0 | 0 | 0 |
| P6 | entrance stagger in band | 0p | 0p | 0p | 0p | 0p | 0p |
| P8 | object-carried joins ≥ 70 % | 0 | 0p | 0p | 0p | 0p | 0p |
| P9 | speed ramp on a long process | 0 | 0 | 0p | 0 | 0 | 0 |
| P11 | rhythm bimodal | 1 | 0 | 1 | 0 | 0 | 1 |
| P12 | beat grid | 0 | 0 | 0 | 0 | 0 | 0 |
| P13 | shot-scale variety | 0p | 0p | 0p | 0 | 0 | 0 |
| P14 | number arrival | 0p | 0 | 0p | 0 | 0 | 0 |
| P15 | animated leaders | 0p | 0p | 0p | 0p | 0p | 0 |
| P16 | luminance ladder | 0 | 0p | 1 | 0 | 0 | 0 |
| P17 | soft shadow + rim | 0 | 0 | 0 | 0 | 0 | 0 |
| P18 | grain / banding | 0 | 0 | 0 | 0 | 0 | 0 |
| P20 | lens + ambient drift | 0 | 1 | 0 | 1 | 0 | 0 |
| P21 | blur / fast-move legibility | 0 | 1 | 0 | 1 | 1 | 1 |
| P22 | silent beats + caption holds | 0 | 0 | 0 | 0 | 0 | 0 |
| | **total / 44** (bar ≥ 38, no ★ zero) | **3** | **5** | **4** | **5** | **3** | **4** |

Score notes (the evidence behind the zeros):
- P1: source has only `smooth`, quintic `sm`, cubic `EI` and rig `inout`. pass-every-time's rig table defines `expo` and
  `out`, but no move uses them.
- P2: settle measured as the time over the last 2 % of travel. A cubic in-out of length T spends about 0.17 T there,
  so 4.5–6 s moves pass by accident (0.8–1.0 s) and 8–11 s moves fail (1.5–1.9 s). who-gains 61.5→62.63 s is a
  push-in that *accelerates* to its peak velocity (diff 31.2) and stops in one frame (0.02): zero settle. The label "ONE
  LOW-SKILL AGENT" then pops in one frame (62.8 s).
- P7: one-query 83–88 runs the camera `regroup` orbit and the region partition `uMove` over the same 83–88 window,
  with `stagger` 0.55. That breaks our own grammar R-E T5 (camera OR partition; stagger ≤ 0.25), not only the rubric.
- P10: the "115" label in pass-every-time (21.0 s) goes from 0 to full in one frame. The one-query "0.24 Wh" readout
  (17.2 s, 11 frames) and the frontier panel (21.07 s, 9 frames) are linear opacity ramps. Captions ramp linearly
  over 7–8 frames in and 3 out (this is fine for the caption track, but the curve is still linear).
- P11: inter-motion gaps ≤ 0.3 s / ≥ 1.2 s were 40/35 % (wg), 73/14 (pet), 50/30 (oq), 23/45 (ns), 19/51 (na),
  51/34 (nf). The rubric has no upper bound, so who-gains passes with 8 s silences. The rubric should cap a rest at
  about 3 s (proposal below).
- P19: passes everywhere because nothing is used. Restraint by absence earns no credit; it is not a strength.
- P22 captions meeting `hold ≥ 1.3 s + 0.06 s/char`: wg 21/23, pet 15/30, oq 24/29, ns 7/45, na 10/32, nf 11/33.
  No film has a visual beat at a landing.
- Still-frame share / longest holds: wg 60 % (91.7 s 8.3 s, 141.7 s 8.3 s); pet 30 % (1.4 s 3.9 s); oq 68 %
  (138.6 s 12.1 s, 23.4 s 11.2 s); ns 58 % (142.0 s 7.9 s); na 63 % (62.0 s 10.0 s, 89.0 s 8.1 s); nf 61 % (41.7 s 8.3 s).
- Measured hero moves (active span, attack/release): wg split 34.8–46.0 (5.2/6.0 s); pet turn 40.7–47.0 (2.8/3.5);
  pet sort 59.5–65.7 (3.2/3.0); oq regroup 82.7–87.6 (3.5/1.3); ns spin sort 70.9–80.3; ns turn 41.5–46.0 (2.3/2.2);
  na re-plot 33.9–42.6 (3.7/5.0); nf re-plot 61.9–70.1 (3.2/5.0); nf leak 87.5–96.4 (4.5/4.4).

## 3. Per film: verdict, three closest to the bar, three furthest

### who-gains (3/44): the strongest single idea, the weakest frames
Verdict: the 5,179-box wall that breaks and re-sorts by skill is a real product-demo idea. It is shot like a
spreadsheet: one medium scale, flat grey boxes, an 11 s symmetric tween, then an 8 s stare. The hook and the ending
are the two weakest minutes of the six films.
- Closest 1. 36–42 s, strip-07 c0–c11: the wall bursts into a scatter and lands as five columns. It is object-carried
  and one move at a time; it only needs a curve that is a third as long, with a settle.
- Closest 2. 24.6–26.0 s, strip-05 c1–c4: the wall lights bottom-up to the average. It is a natural landing beat.
- Closest 3. 62–66 s, strip-11 c4 – strip-12 c0: the push to one agent and her arc. It is the only macro shot in the
  six films that pays off.
- Furthest 1. 0–11.5 s, strip-01 c0 – strip-02 c11: one cube about 3 % of frame height on a void, and a wire box
  that grows. Nothing in the first 3 s would make anyone stay.
- Furthest 2. 76.0 s cut to an empty frame, then 76–83 s, strip-13 c8 – strip-14 c10: developers rain in at a
  measured constant velocity for 7 s (linear: no ramp, no rhythm). Same at 101.5 s, strip-17 c11: a cut to an empty
  grey panel.
- Furthest 3. 135–150 s, strip-23 c6 – strip-26: the pooled wall again, still for 14 s, with the honest line popping
  under it.

### pass-every-time (5/44): closest to the bar, the proof candidate
Verdict: the only film whose hero moves are mostly carried by the same objects (tiles → cubes → columns → sorted →
cut plane), whose still share is 30 %, and whose cubes would take light well. It loses on type (pops), on a 22 s
plane hold, and on section joins that cut to void.
- Closest 1. 40–47 s, strip-07 c8 – strip-08 c10: the field turns and each task stands as a column. This is the best
  single move in the six films.
- Closest 2. 60–66 s, strip-11 c0 – strip-12 c0: the columns sort by tries passed, carried, readable mid-move.
- Closest 3. 126–130 s, strip-22 c0–c8: the 4 h 49 min tower rises beside the 27 min stack. It is a true scale reveal.
- Furthest 1. 0–12 s, strip-01 – strip-02: a type-only hook. Serif headlines appear on empty navy (1.4–5.3 s still).
- Furthest 2. 74–98 s, strip-13 c4 – strip-17 c4: the translucent cut plane is held for about 22 s while only labels
  swap (60.4 %, 38.3 %, under 25 %). Five numbers land with no visual beat.
- Furthest 3. 100.0 s and 121.0 s, strip-17 c8 and strip-21 c2: hard cuts to a near-empty void, then a tile in the
  middle of nothing (122 s, strip-21 c4). Also the "115" label pop at 21.0 s, strip-04 c6.

### one-query (4/44): the best structure, the most static picture
Verdict: the powers-of-ten ladder and the per-own-grid bars are the right devices. The first 34 s barely move, the
world floor aliases, and the regroup breaks T5.
- Closest 1. 83–88 s, strip-14 c10 – strip-15 c8: the oblique view and the marks regrouping by region. This is the
  film's only spatial hero move. Fix it by splitting the camera move from the partition.
- Closest 2. 36–58 s, strip-07 c0 – strip-10 c8: each decade nests in the last with a dashed frame. It wants a speed
  ramp (P9), not equal dwell and move steps.
- Closest 3. 104.5–109 s, strip-18 c5 – strip-19 c2: the Ireland cut plane with a perspective tilt. Real depth and a
  clean leader.
- Furthest 1. 12–34 s, strip-03 c0 – strip-06 c8: the disc does not move for 22 s (measured still 23.4–34.6 s) while
  three readouts fade in beside it.
- Furthest 2. 66–84 s, strip-12 c0 – strip-15 c0: moiré on the floor grid (no AA, no sub-frames), plus cuts at 66.0,
  82.8 and 99.0 s.
- Furthest 3. 138.6–150.7 s, strip-24 c1 – strip-26: 12 s still on a dimmed scene with text blocks.

### noether-symmetry (5/44): the most beautiful mechanism, the smallest subject
Verdict: 30,000 dots sorting into shells is a genuine "wow" structure, but it fills about 30 % of the frame height
and moves in 9–10 s tweens. Its six shells pop in one frame each.
- Closest 1. 70–80 s, strip-12 c8 – strip-14 c4: the tangle sorts into six spin shells.
- Closest 2. 90–98 s, strip-16 c0 – strip-17 c4: the same dots sort into five energy layers. A strong A/B with
  closest 1.
- Closest 3. 41.5–46 s, strip-07 c11 – strip-08 c8: the whole picture turns and nothing changes. 4.5 s, the only
  hero move whose settle is in band.
- Furthest 1. 0–12 s, strip-01 – strip-02: a small orbit in the left third and three bars at the right edge. Busy
  caption track (2.0–2.4 s captions), static picture.
- Furthest 2. 78.4–80.7 s, strip-14 c0–c5: the six shells appear by single-frame pops every 0.45 s (diff spikes
  9.6, 1.5, 2.1, 2.6, 3.2, 4.0).
- Furthest 3. 106.0 s, strip-18 c8: a cut to an empty frame, then 106–119 s a sparse net cloud of about 2 % ink
  coverage (strip-18 c8 – strip-20 c11). The end is two small spheres still for 7.9 s (142 s, strip-24 c8).

### noether-applied (3/44): four good ideas, four small pictures
Verdict: the keeper tube against the plain funnel is a superb picture of drift. The film then cuts to black and
shows tiny, near-still subjects for a third of its length.
- Closest 1. 34–44 s, strip-06 c8 – strip-08 c4: the re-plot splits into a tight tube and a flared funnel.
- Closest 2. 14–22 s, strip-03 c4 – strip-04 c8: the orbit lifts into a 3D stack of snapshots. Object-carried.
- Closest 3. 112–120 s, strip-19 c8 – strip-21 c0: the air loop stretches and folds into a translucent ribbon. This
  is the one place material would sing (rim plus soft shadow).
- Furthest 1. 62.0 s, strip-11 c4: a cut to black, then 10 s near-still (62.0–72.0 s) of sparse network ticks.
- Furthest 2. 89–97 s, strip-15 c10 – strip-17 c2: 8.1 s still on wire rings.
- Furthest 3. 135–150 s, strip-23 c6 – strip-26: four thumbnails at about 15 % of frame height each, still for 15 s.

### noether-frontier (4/44): the best reveal of the trilogy, buried after 60 s of re-runs
Verdict: the layers that leak under bigger steps are a real story beat. Its first 36 s reuse part 1's sphere,
42–50 s is a text slide, and its last 30 s are a static flat tree.
- Closest 1. 62–70 s, strip-11 c4 – strip-12 c8: the 24,000-dot column re-plots into eight weight-sum planes.
- Closest 2. 88–96 s, strip-15 c8 – strip-17 c0: the followed neurons leave their planes as the step grows.
- Closest 3. 106–110 s, strip-18 c8 – strip-19 c4: 3 questions become 6 orders; the total of 20 arrives as a column.
- Furthest 1. 0–36 s, strip-01 – strip-06: one small sphere, tangled and untangled, for 36 s.
- Furthest 2. 41.7–50 s, strip-07 c11 – strip-09 c4: dots faded to near black under a citation panel, 8.3 s still.
- Furthest 3. 120–150 s, strip-21 c0 – strip-26: a flat-shaded tree on a slab, almost static for 30 s. A candidate
  ring is its only motion.

## 4. Ten gaps, ranked by rubric points recovered per unit of work
Work units: S = knob or film.json only (≤ 1 h per film); M = one arsenal lane or kit change (≤ 1 day, shared by all
films); L = a per-film film.js re-cut (≤ 1 day per film). Points = the maximum recoverable across six films (of 264).

| rank | gap | points | work | pts/unit | kind |
|---|---|---|---|---|---|
| 1 | Motion-curve tokens, and hero moves cut to 0.8–1.6 s | ★P1+★P2+P3+P4: up to +30 | M + S | ~15 | new arsenal lane + knobs |
| 2 | Text-reveal and label-attach (mask, rise, stagger, draw-on leader, tabular count-in) | ★P10+P14+P15+P6: up to +26 | M | ~13 | kit/arsenal lane (gl-labels, kit2 overlay) |
| 3 | Beat grid, and captions rebalanced against the picture | P11+P12+P22 caption half: up to +14 | S | ~7 per film-hour | film.json + kit (beat field), gate G12 |
| 4 | Light and material at manager level (contact shadow, AO, rim, grain, luminance ladder) | P16+P17+P18: up to +16 | M | ~8 | knob (`--material`, postLevel) + instance shader lane |
| 5 | Temporal AA and motion blur on export (renderAccumulated) | P21 (+P18 shimmer): up to +6 | S code, export ×4–8 time | ~6 | kit/export change |
| 6 | Ambient drift on every hold, capped rests | P20+P11: up to +8 | S | ~6 | camera-rig knobs |
| 7 | Silent visual beats at landings | P22 beat half +P5: up to +8 | M | ~4 | new small arsenal lane |
| 8 | Object-carried section joins (no cuts to void) | P8: up to +6 (+P13) | L ×6 | ~1 per film | film.js |
| 9 | Hook rebuilt to show a hero move by 0.5 s at macro scale | P13 + first-10-s ★ read: up to +6 | L | ~1 | film.js + shot list |
| 10 | Endings as a carried lock-up instead of a 12–15 s still | P8+P11+P20: up to +6 | L | ~1 | film.js |

1. **Motion curves, durations cut.** Ship `arsenal/patterns/motion-curves` as six closed-form, pure-in-t tokens:
   `spring-hero` (ζ about 0.7, about 2 % overshoot), `spring-snappy`, `expo-out`, `emph (0.2,0,0,1)`, `ramp`
   (time-warp) and `settle`. Add them to the camera-rig EASE table (pass-every-time already has `expo` and `out`
   there). Then the knobs: hero spans of 5–11 s (m1T0/m1T1, moveT0/moveT1, split windows) become 0.8–1.6 s, with
   the freed seconds given to the hold *after* landing. *Buys the viewer:* moves read as decisions, not tweens. The
   first 10 s stop feeling like a slideshow, and the eye arrives before the caption does. Affects all six. Overshoot on
   marks only, never on numbers or text (rubric P3). Law: pure, seeded, no runtime fetch.
2. **Text reveal and label attach.** One kit2/gl-labels module: masked rise (clip rect) or 2–3-frame per-line
   stagger on every label and panel; dot, then a draw-on leader (≥ 6 frames), then the label; removal at 0.6×;
   `font-variant-numeric: tabular-nums` on every readout. No film uses it today. Counters may count in only real
   counts (who-gains 937 → 5,179 tracks landed boxes, one-query 116 → 365 → 415 tracks marks). A ratio or percent
   lands with a weight pulse, never rolled. This resolves the P14 conflict with "every digit is a claim". *Buys:*
   the eye is led to each number in order. Kills the one-frame pops (pet 21.0 s, wg 62.8 s, ns shells 78.4 s).
   Affects all six.
3. **Beat grid, captions rebalanced.** Add `beat` (e.g. 0.5 s) to film.json and snap move and caption starts to it
   (today's knobs land on 12.4, 21.6, 46.6…). Merge captions in the three Noether films until each meets
   1.3 s + 0.06 s/char (today 7/45, 10/32, 11/33). Take the time from the dead holds, not from the moves.
   *Buys:* the film breathes on a pulse a viewer can feel without sound, and nobody has to read faster than the
   picture moves. Knob/json only. G12 should check it.
4. **Light and material.** gl-post and the instance lanes exist but are off ("ink" everywhere). At *manager* level,
   enable the PBR Neutral tone map, a contact shadow plus ambient occlusion under instanced boxes, an 8–16 % rim on
   cube edges, seeded grain at σ 1–2 %, a floor gradient and plate for a 4-step luminance ladder, and bloom ≤ 0.2
   only on lit marks. who-gains already loads gl-post at `exec` with bloom 0.06, so it is a knob change there. The
   rest need a small rim/AO addition to the instance shader. *Buys:* depth and "made object" quality; the lit cubes
   in pass-every-time and who-gains would read as gold rather than tan. Affects wg, pet, oq, nf most (boxes) and the
   Noether ribbons and tubes. Law: exec level stays ink and clean. The ink paper brand inverts the ladder; do not
   relax either.
5. **AA and blur on export.** Run `renderAccumulated` with N = 4 by default and N = 8 on hero moves. It removes the
   one-query floor moiré (66–84 s), the twinkle in the 30,000-dot clouds and the smear-free crash push at who-gains
   62.6 s. Export cost ×4–8 (0.4 s → 1.6–3.2 s per 4K frame), so budget N = 8 for hero windows only. *Buys:* the
   cheapest "expensive-looking" signal there is. Kit/export flag; purity is unchanged (sub-frames are f(t)).
6. **Drift on holds, capped rests.** Every hold over 2 s gets a 1–2 % dolly or orbit drift from the rig. Rests are
   capped at about 3 s except the final lock-up. Today there are 14–22 holds of 2 s or more per film, up to 12.1 s.
   *Buys:* the frame never dies, and a rest still reads as a rest. Rig knobs only. Proposed rubric amendment: P11
   gains an upper bound (no still over 3 s, bar the card); without it who-gains passes P11 with 8 s silences.
7. **Silent beats at landings.** A ring pulse or 2-frame lift on the hero mark when it lands (wg lit wall 26.0 s,
   pet 38.3 % plane 79.6 s, oq Ireland 23 % 110.8 s, ns "never leaves" 87 s, na funnel 42.2 s, nf leak 88.2 s). At
   most one strong beat per film, never over a digit. That honours "silent with captions" and the persuasion caveat
   in rubric §9. *Buys:* the substitute for the sound hit, so the eye knows "this is the number".
8. **Object-carried joins.** Each film has 5–15 cut spikes, and too many land on a void (wg 76.0, 101.5; pet 100.0,
   121.0; oq 66.0, 82.8, 99.0; ns 12.0, 106.0; na 62.0). Carry an anchor across each join: the last hero mark becomes
   the first mark of the next scene, or the camera flies through. pass-every-time already carries 5 of its 10 joins.
   *Buys:* continuity, the single most "Apple" property, and the reason a viewer never re-orients. Per-film film.js
   work, so it ranks low on points per unit even though it is high on what it buys.
9. **Hooks.** Today's hooks are a 3 % cube (wg), type on void (pet), a still disc (oq), a small orbit (ns, na) and
   part 1's sphere (nf). Each needs a hero move by 0.5 s, at macro scale, then a pull back to the medium shot that the
   case lives in. *Buys:* retention. This is where the owner's "not WOW" verdict is formed. film.js plus shot list.
10. **Endings.** All six Monday chapters are 12–15 s stills. Make them a final carried lock-up: the hero object
   resolves into the takeaway line, with the honest line entering masked after it and the CETI card last (law).
   *Buys:* an end that lands rather than fades.

Not ranked but logged: who-gains and the Noether films set micro-labels at about 9 px at 1080 (wg "ONE BOX = ONE
AGENT"). At phone width they are unreadable, and the type steps (eyebrow : label : number) are below the 1.4 ratio.
This folds into gap 2.

## 5. The one film to re-cut first: pass-every-time
- It starts nearest the bar (5/44, joint top with noether-symmetry). It already has the best carried chain (tiles →
  cubes → columns → sorted → cut plane, 21–98 s), the lowest still share (30 %), the shortest hero moves
  (6–7 s), and a camera rig whose EASE table already holds `expo` and `out`. So gap 1 is a table entry plus knob
  spans, not a rewrite.
- It is the film that best shows gaps 1–5 together: 460 instanced cubes take rim, contact shadow and AO better than
  dots do (gap 4). Its five landed numbers on the 74–98 s plane are the clearest test of type reveal, count-in and
  landing beats (gaps 2 and 7). Its two void cuts (100.0, 121.0 s) are the cleanest test of carried joins (gap 8).
  Its type-only hook is the easiest to replace with a hero move (the field dropping in at macro scale).
- Target after the re-cut, if gaps 1–7 land: P1 2, P2 2, P3 1, P6 1, P7 1, P8 1, P10 1, P11 1, P12 1, P14 1, P15 1,
  P16 1, P17 1, P18 1, P19 1, P20 1, P21 2, P22 1 ≈ 22/44 with no starred zero. That is not yet 38, but it is enough
  to judge the rubric against the owner's eye. Runner-up: who-gains, which has the bigger idea and already loads
  gl-post, but needs gaps 8–10 (L work) before it is fair to judge.
- Hold the laws: no commit beat (D11 off), counts before ratios, every digit sourced, CETI card last, vendored p5
  only, and stagger on tracked marks ≤ 0.25 (R-E T5; one-query's 0.55 is a standing violation to fix in its own
  pass).
