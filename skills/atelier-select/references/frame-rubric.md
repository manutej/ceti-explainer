# Frame rubric: reading a film from strips and thumbs

You judge a film you cannot run. Your instruments: `frames/strip-NN.png` (12 thumbs per row, 480 x 270, timestamp
burned top-left), `frames/thumbs/t-SSSS.SS.jpg`, `frames/frames.json` (per t: file, strip, cell, caption, chapter;
plus purity and s/frame), `film.json` (chapters, captions, commit, count, knobs_doc), `claims.json`, `gate.json`.
Blind rule: never open film.js, lib/ or NOTES.md before ranking. Quote strip, cell and film seconds for every
observation: "strip-10 cell 1, 54.5 s" (strip NN starts at 6(NN-1) s at `--every 0.5`; cell = (t - start) / 0.5).

## Reading scale
A 480 px thumb is half the 960-unit design canvas: 1 unit = 0.5 px. Must-read text (28 units) is 14 px and legible;
secondary text (14 units) is 7 px: readable only as a shape, so open the full-size frame for labels, never judge them
from the strip alone. Chrome (12 units) is not judged at thumb size. A phone (390 px wide) shows 1 unit = 0.41 px, so
28 units is 11 px: anything below must-read that carries a result fails the phone test. Squint test: blur your eye;
if the one thing the beat is about is not the biggest, brightest or most isolated object, the hierarchy is wrong.
Count states, not frames: a state counts as "held" when two or more consecutive thumbs (>= 1 s) show its final form.

## (a) Per-beat checklist (default windows; take the real ones from frames.json chapter)
| beat | window | must be visible in the strip |
|---|---|---|
| HOOK | 0-8 s | a mark or a headline by the second thumb (a blank frame at 1 s is a defect); the everyday belief stated by the caption; the stop comes from the picture, not only the caption; no figure that belongs to the answer |
| COMMIT (only if film.json enables the commit, D11; otherwise there is no COMMIT chapter, skip this row and HOOK runs 0-10 s, CASE 10-36 s) | 8-16 s | the question and one input affordance (box, bar, ring) held on screen; exactly one countdown device; the default guess shown in film mode; NO digit derived from the answer or the result; case figures already on screen are a flaw (low) |
| CASE | 16-36 s | the real worked fixture: each unit is one mark; quantities appear as marks or counts with a unit label; at least one sourced real figure; the mechanism's first picture; no ratio yet |
| COUNT | 36-62 s | the mechanism drawn as a count (wall, grid, row, stack) BEFORE any percentage or "N in M"; the count settles (final form held >= 1.5 s) before it is relabelled; then (commit on) the committed number placed on the same picture against the truth; the reveal lands as one moment |
| MONDAY | 62-72 s | one question to ask at work (caption + stage); the single honest-limits line, stated on stage and in a caption; a callback to the hook image; no new number |
| CARD | last 3 s | plain card: wordmark, the one-line takeaway, nothing else; the last material frame held before it; the frame at dur - 1 is not blank |

## (b) Law checks that frames can answer
1. Counts before ratios: scan frames and captions in time order. First thumb showing a %, "N in M", "x per y" or a
   rate-like label must be at or after `count.at` (G7) and after the counts that build it. Caption ahead of the picture
   is the usual breach: compare each caption's t0 in film.json to the first thumb that shows what it says.
2. Commit before numbers (only for a film with the commit on, D11; skip it otherwise): thumbs from the COMMIT chapter
   to the seal carry nothing the answer depends on.
3. Every digit is a claim: read the digits on 6-8 thumbs (the headline ones) and find each in claims.json (value or
   `renders`). A digit with no claim is a finding (the fix is usually a caption edit or beyond scope). Running
   counters that tick through intermediate values trip G5c as WARN; log them once, severity low.
4. Silent with captions: every beat has a caption; captions <= 60 chars and one line (a wrapped caption climbs into
   marks); no audio cue implied (waveforms, speaker icons).
5. Legibility 28 / 14 / 12: headline numbers, counts, captions and the commit box at 28+ units; everything else 14+;
   results never in the smallest face. Read `gate.json` G6, then confirm by eye on the closing frame of COUNT.
6. One honest-limits line: exactly one, on stage in MONDAY. A constructed model or teaching set presented as real data
   with no on-stage label is high severity (a truth defect, not a style one).
7. Brand card last: nothing after it; no second card; <= 2 full-screen cards in the film (G9); <= 4 visual structures.
8. Exec level is ink and clean: no icons, dashboards, chart junk, glow or texture beyond paper unless film.json
   declares a higher level (`axes.level`); log axes, gridlines and legends count as chart apparatus (med).
9. Purity: `frames.json purity` is "identical"; "DIFFERS" is block.

## (c) Craft checks
- Composition: one focal object per beat; margins respected; nothing cut by the canvas edge; empty space intended.
- Hierarchy: the answer is the largest and most contrasting element on its frame; labels subordinate; the viewer's
  committed number visible and distinguishable from the truth and from neighbouring labels (a marker that sits on top
  of another mark or label fails).
- Hold length >= reading time: a caption needs about 0.7 s + 0.25 s per word; a result label >= 1.5 s; a state change
  that is the point (a split, a turn, a stack) >= 2 s of final form. Morphs shorter than 0.4 s between steps read as
  flicker; two steps that overlap show half-formed states in half the thumbs.
- Occlusion: in any depth or overlap view, ask what hides what; a near object hiding the next one in a sequence breaks
  the comparison. Compare like with like side by side, on one frame, not across a cut.
- Overlap of captions with marks: the caption line (bottom band) must be clear of marks, rings, letters and pins in
  every thumb of the beat; list the timestamps where it is not.
- Reveal as a moment: the result arrives once, on the same beat as its caption (within ~0.5 s), with a short build and a
  clear-down; not a wash over every mark, not told before it is seen, not repeated.
- Label legibility at thumb size: big labels are readable at 14 px; if a label that carries the comparison is not,
  the fix is size or spacing, not "squint harder".
- Stale or reused labels: a headline or column header must never contradict the picture under it; a header that changes
  measure in the same position needs a caption naming the new measure.
- Transitions: a cross-fade or overlap lasting <= 0.5 s is a transition; do not file it. Filing it wastes a fix round.

## (d) Defect vocabulary
Severity default: block = a law broken or the claim not carried (gate FAIL, purity, a number with no claim, a model
posing as data); major = the picture does not carry the point or a reading error is likely; minor = polish.
The seat.json scale is high / med / low = block / major / minor. "Knob" means a documented film.json knob; "cap" a
caption edit (<= 60 chars, no new digits); "ch" a chapter shift <= 2 s; "scope" = film.js, beyond the evaluator.
| kind | recognise it in a strip | default | usual fix |
|---|---|---|---|
| claim-told-not-shown | the point lives in a caption or banner; the picture alone does not show it | block | rank down; borrow the clearer view via camera/layout knobs, else scope |
| caption-ahead | caption states a result while the picture still shows the previous state or a half-built count | major | move the picture earlier (timing knob) or rewrite the caption to what is on screen |
| ratio-before-count | first % / "N in M" before the counts exist, in picture or caption | major | caption to counts; timing knob for the relabel |
| stale-label | headline or header from the previous step stays over new evidence (seconds) | major | the step-timing knob that advances the label; ch if a beat boundary |
| header-meaning-shift | same slot and face switch from one measure to another with no cue | major | cap naming the measure; else scope |
| reversal-hidden | the comparison items never share a frame (occluded, behind, off-axis) | major | camera elevation / zoom / gap knobs; else scope |
| result-in-small-face | results set at footnote size or 20-unit floor; answer not the largest | major | size knob (pin/label), else scope |
| crowded-closing-frame | 5+ text items or 3 structures in one band; answer lost | major | spacing / zoom / label knobs; else scope |
| marks-too-small | count reads as texture or dots under ~2 px at thumb; vanishes at phone width | major | mark size / grid density knob; else scope |
| mid-tick-counter | counters show intermediate numbers while a caption already states the result | minor | arrival-speed knob or cap; G5c WARN, record it |
| hold-too-short | steps shorter than ~0.5 s final form; half-formed marks in many thumbs | major | morph duration down, step interval up |
| caption-wraps | two-line caption rising into marks or letters | minor | cap shorter (aim <= 48 chars) |
| caption-collides | ring, pin, letter, arc crossing the caption band | minor | zoom / elevation / radius knob (one at a time); else scope |
| label-overprint | stamp, tag or headline overprinting another glyph (a full stop, a label) | minor | offset knob if documented; else scope |
| pin-crossfade | outgoing and incoming call-outs overlap into a garbled word | minor | step / dwell knob; else scope |
| residue | ghost marks, empty rings or labels left from an earlier beat behind a later one | minor | scope (fade-out logic) |
| number-before-seal | a case figure on screen during the commit window (commit on only) | minor | cap; else scope |
| hook-blank | thumb at 1 s empty except caption / chrome | minor | none; note (arrival time is film.js) |
| chrome-typeon | partial words from chrome type-on at 1 s | minor | `chrome` finding (none) or ignore |
| honest-line-stage-only | limits on stage, absent from captions | minor | cap for the MONDAY caption if room |
| model-as-data | invented / constructed set shown as measured, no on-stage label | block | cap that labels it, plus honest line; else scope |
| marker-moves | a pin or marker keeps its label but changes the quantity it measures | major | scope or timing knob; always note |
| marker-lost | the committed-number marker nearly invisible next to another mark or label | major | marker / label knobs; else scope |
| chart-apparatus | log axes, gridlines, legend ticks on an exec stage | major | scope; note for the next draft |
| fixture-anecdotal | CASE has no real sourced figure | major | scope; note |
| reveal-flat | result arrives with no build, or as a full-screen wash, or twice | major | reveal-time / glow-gain knobs |
| shuffle-glitch | a rearrangement reads as a jumble before it settles | minor | morph / settle knobs |

## (e) Ranking N drafts and writing SELECT.md
Rank in this order and stop at the first discriminating tier.
1. Picture carries the claim: cover the captions in your mind; can a manager get the claim (the comparison, the turn,
   the answer vs the committed guess) from the marks alone, on one frame at thumb size? Name that frame. A draft that
   only tells it by caption or banner ranks below one that shows it, however handsome.
2. Laws: gate rows (all drafts normally PASS), then counts-first, commit-first (commit on only, D11), honest line, claims on screen.
   A draft with a block-severity law breach cannot win.
3. Craft: hierarchy, holds, occlusion, caption clearance, reveal moment, legibility.
4. Tie-break by fixability: faults that are knobs or captions beat faults that need film.js. Count both; the winner's
   faults should be mostly fixable.
Never rank on novelty, polish of one frame, or how hard the draft tried.

SELECT.md layout (keep it short; timestamps in film seconds, strip and cell cited):
1. Header: evaluator, date, what you read, what you did not read, gate state of each draft, strip timing.
2. Ranking: per draft, ordered strengths then faults, each with t and strip. Winner first.
3. Verdicts: one line per draft.
4. Winner: where it was copied (working film dir), film.json changes (id without draft suffix; add `look`).
5. Borrowed beats: only at knob or caption level, from a losing draft, with the knob and the values.
6. Round 1: findings.r1.json counts by severity, dry-run result, what to check in round 2.
7. Beyond scope: each item with t, why it is film.js, and who should take it.
8. Round 2 (after apply): what each round-1 change did in the picture (worked / half / overshot / did nothing),
   findings.r2.json counts, convergence, still beyond scope.
Lessons to carry: change the knob that acts on the problem (an adjacent knob often does nothing); one camera knob per
finding and say what to check next round; a size-up can overshoot into the caption band; a caption cap of 60 chars can
still wrap at 57; accept transitions; do not touch claims.json, even to fix cosmetic text.
