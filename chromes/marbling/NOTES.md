# B · MARBLING — builder notes

**Mark rule.** Tray = one agent run. Comb pass = one step. Peach stray drop = the slip that failed the run, landing
at its pass. Sage skimmer = the check (lifts the drop the pass it lands: catch 80 %, pass redone, can slip again).
The pattern (copper, ink, wash, chalk on size-water) = the work. Zinc-slate = trays, rails, comb (structure).

**Material/type.** Ebru on a cool grey-green ground (#D2D4CA — not cream; no hairlines: rims are 2–4.5 px zinc).
Type: IM Fell English (bookbinder's endpaper label), Alegreya Sans (labels), DM Mono (counts).

**Kernel (one).** Pixel pull-back through exact inverse maps (Jaffer/Lu), no simulation. Drop: x' = c + (x−c)·√(1+r²/|x−c|²);
comb: x' = x + z·φ(q)·M, q invariant (φ = exact sum of tine kernels, LUT); wave likewise. A pass in progress is a
travelling comb a' = a + F(q)·g((front−a)/w), monotone ⇒ 1-D Newton inverse; a finite needle stroke adds a start
window. Landing = r√s; lifting = the drop map run backwards (exact restore). Battal baked once, sampled at the
pre-image; trays painted into one CPU frame, blitted once; pristine trays (identical by construction) rendered once.

## SHARED (33 s)
Hero (t≈28.5): two walls side by side, 6×8 trays each. Rejected trays (peach rims, `p.07` address plates) on top,
ordered by the pass that spoiled them — filaments at the top-left, fat blobs just above the edition; pristine,
identical prints settle at the bottom. Two vertical rails: sage fill level = count read from the trays (19 / 40),
copper band = exact ± sd (17.2 ± 3.3 / 37.7 ± 2.8), ink tick = the guess. Beats: 0–3 title, battal laid in twin
macro trays · 3.1–8.7 passes 1–4 macro; stray lands at pass 2 in both; skimmer lifts it on the right; a 20-cell step
strip records it · 8.75–10.75 each half dollies out (log zoom) to its wall · 10.8–13.8 commit + countdown ·
13.8–22.8 passes 5–20 on 96 trays · 23–25.2 sort · 25.3–30 count, exact, saved · 30–33 the line.

## NATIVE (30 s)
Hero (t≈28.8): three portrait trays that began as ONE noise hold a tulip, a carnation, a wave on the same pale
battal. 0–4.6 tulip from drops + needle strokes · 4.8–9.8 combed 10 passes (fine first, coarse last) · 10.6–14.6
passes run backwards, tulip back exactly; measured undo error printed · 14.8–17.6 training (sketch): four pictures
combed into noise · 17.7–20 one noise ×3 (identical by construction: motif ops at progress 0) · 20–27.4 op order
stones → motif → combs: the prompt's drops grow beneath the combing while passes come off, coarse first ·
27.4–30 three pictures. Control: noise draw 1–6 re-runs every tray (noise picks the variant, prompt the picture).

## Doctrine
Impossibility: a marble rewound exactly; a drop lifted without trace. Ruler: the fill level carries the fraction.
Address: how combed the peach is = its pass. Etymology: no ink-diffusion — combing is a rearrangement.
**Never:** glow, particles, flow fields, Voronoi, nodes, typewriter.

## Iteration log
**Pattern (node prototypes, looked at):** v1 crossing fine combs scrambled to brown mush by pass 16 → passes
re-ordered (gel-git → chevron → one-way nonpareil → bouquet waves), each refining instead of scrambling; stones
packed denser. Early strays vanished at thumbnail size → stray r 0.09 → 0.12. Comb LUT edge bug (u−⌊u⌋ rounding to 1)
gave NaN pixels on exact tine lines — fixed.
**Shared v1:** worked first pass, 0.3 s/frame; macro left a dead bottom third; type 9–13 px; pristine vs spoiled
indistinct after sorting; readouts collided with the takeaway; ground read cream. **v2:** step strip + sentences
under macro trays; type +30 %; spoiled rims turn peach + pass plates; sage tally ticks; count as a sage bar; ground
cooled to grey-green; comb gets a visible back. **v3:** the pull-back was two trays crossing paths with walls
popping in → walls side by side, each half a true log-zoom dolly from its tray, neighbours fading in; sort makes
pristine settle at the bottom so the walls read as two fill levels on vertical rails. Fixed raw ctx.save/clip
desyncing p5's stroke cache (rims went black) by clipping inside p.push/p.pop.
**Native v1:** motif emerged only at the very end (coarse passes were undone last) → passes reordered fine→coarse
so un-combing is coarse-to-fine. **v2:** title/ledger crossfade collided; right column top-heavy (H6 risk) → column
centred on the tray; training row centred; caption trimmed to ≤90.

## Revision 1 (after JUROR + PEDAGOGY-CRIT)
**Shared — new form.** The 96 stamp tiles read as wallpaper and the stray's pass was unreadable. Now: ONE full-bleed
tray, 50 lanes (N = 50, matching the set: 19 / 41 vs expected 17.9 / 39.3, 22 saved), ruled into 20 step columns.
Each lane's needle is the agent and draws a nonpareil as it goes (vertical gel-git ground, then one 50-tine comb along
the lanes). A stray lands in its step's column; the needle runs through it and carries its ink to the end of the
lane — head = address, thread = propagation (an early slip is now the LONGEST mark, fixing "earlier failures look
milder"). Cut and stacked by where the stray fell, the heads step down the column ruler and the expected curve
50·(1−0.95^j) runs through them (ruler + truth in the image). Twin world without panels: the same tray is rewound and
replayed with the same strays and a check at every step — needles pause to inspect, a sage paper strip peels a caught
stray away, the needle backs up and redoes the step; checked needles visibly lag a no-check pace marker, and each
lane's checking time is laid out beside it (sage = inspections, zinc = redone steps; sketch costs). Restacked: failed
lanes on top, the saved band carries sage rings at the step each was caught — the rings sit on the dashed no-check
curve — and the clean block below; the rail shows 19 → +22 → 41. Commit beat is set in the margin (question + three
pins), no modal; no header strip; ending is the tray itself. The macro is now a camera into the same tray.
New kit op: DRAG (exact closed-form inverse) prototyped and rejected for the ground (scan-line look); the needle's
thread is drawn as ink carried on the needle (area-conserving maps make a carried drop sub-pixel).
**Seen:** v1 of the form had the stacked staircase drowned by the marbling → the sheet is veiled as it is stacked
(pigment kept at full strength), curves get a pale halo; rail labels collided → guess fades at the replay, "+22 saved"
sits on the rail band. Still weak: the macro is busy (raw gel-git ahead of the needle dominates), the replay's raw
region reads as blocky stripes, lanes are 8.6 px (≈3.5 px on a phone; the threads carry the read).
**Native — protected; lesson fixed.** PEDAGOGY-CRIT: "exact inverse … comes back exactly" taught the wrong thing.
Now each comb pass also sprinkles four unrecorded drops of noise; run back, a tulip appears but not the same one —
the original's outline is dashed over the guess ("The way back is a guess. The noise left no record to undo.").
The 10⁻¹⁷ readout is cut. Act 1 tray is full-bleed with words on an endpaper label (H6 fixed). Act 3: each prompt
has its own copper ghost comb (horizontal / diagonal / vertical) that sweeps through and out while the passes come
off (honesty clash with "exact inverse" resolved). Training text: "learns to guess one step back".
