# women-and-children · SELECT (blind)

Evaluator: Opus, 2026-10-10. Read for drafts a and b: frames/strip-01..21.png, frames/thumbs/ (1 s contact sheets plus
full-size thumbs at 40, 53.5, 61, 82 and 88 s), frames/frames.json, film.json, claims.json, gate.json, and the brief
(factory/topics/women-and-children/brief.md, beats.md). Not read: film.js, lib/, NOTES.md. No browser was run.
Commit beat off (D11), so the COMMIT row of the rubric does not apply. Windows: HOOK 0-12, CASE 12-58, COUNT 58-108,
MONDAY 108-120, card 120-123. Strips are 6 s each at --every 0.5: strip-NN starts at 6(NN-1) s.
Gate: both drafts PASS G1-G10. Each has one G5c WARN for the running ABOARD counter at 13-23 s (a also shows LIVED 65
at 30 s). Purity is identical in both. Cost: a 0.379 s/frame, page 1.283 MB; b 0.941 s/frame, page 1.267 MB. The
20 captions are word-for-word the same in both drafts.

## Can the pictures alone show the gap? (captions covered)
- **a: yes, from 31 s for the pooled view and from 64 s by class.** In the pooled view (strip-06 cell 2, 31 s, and
  strip-07 cell 8, 40 s) the three columns light bottom-up. Women are lit about three quarters, children about half,
  men a thin band. By class (strip-11 cell 2, 61 s, and strip-12 cells 4-11, 64-69 s) the first- and second-class
  children's slabs are fully lit and the third-class children's slab is lit about a third. The reveal (strip-15 cell 8,
  88 s) dims everything except two lit segments, the first-class men's and the third-class children's, and their lit
  tops stand at about the same height.
- **b: only by class, from 70 s.** The pooled view is almost a plan view (strip-07 cell 8, 40 s). The children's
  column is a flat strip whose lit share cannot be read, and moiré on the box faces blurs lit against unlit. The
  deck-level view (strip-12/13, 71-79 s) and the reveal (strip-15 cell 8, 88 s) are clear: two lit segments on one
  baseline, with level tops.

## Ranking

### 1. a "the city" (3/4 view of an iso deck), the winner
- Strengths:
  - The pooled picture carries the belief. Survivors light at 29.8-32 s (strip-05 cell 11 to strip-06 cell 4).
    Count pins come first, 37 s, and the % follows 1.5 s later, 38 s (G7 PASS).
  - The split is one gesture (strip-09/10, 48.5-56 s): the boxes fly to their class berths while the camera turns.
    Caption 9 says no box is added or removed, and the ledger 2,201 / 711 / 1,490 stays in the corner.
  - The callout hard-cuts carry COUNT A: 30 OF 30 with a bracket over two slabs (64 s), then 27 OF 79 (70 s), then
    57 OF 175 (76 s), all at 34 units. Each holds 6 s.
  - The reveal is a moment (strip-15 cells 2-6, 85-87 s). The city dims and bloom appears only on the 57 lit first-class
    men and the 27 lit third-class children. 33 % and 34 % appear at about 40 units, then "3 in 10 · 3 in 10" at 90 s.
    Bloom falls at 96-98 s.
  - All three WebGL lanes each carry a beat:
    - stack-city carries the arrival and the split.
    - gl-labels carries the slab pins and callouts.
    - gl-post carries the reveal. lib/gl-post.js appears in the G3 scan.
  - In MONDAY the two revealed slabs keep a faint glow as a callback (strip-19/20). The CETI card is last, at 121-122 s.
- Faults:
  - **Caption ahead of the picture.** The crew caption starts at 96 s, but the reveal stays up until about 100 s and
    the crew callout appears at 101 s (strip-17 cells 2-10). Fixed by knobs.
  - **Pooled pin overprint.** The women's plate covers the children's and men's columns from 37 to 47.5 s
    (strip-07 cell 8). Fixed by a knob.
  - **Slab pins in the 14-unit floor.** They are set there at 58.4-64 s and 101-108 s (strip-11 cell 2), and they
    overprint neighbouring slabs. Fixed by a knob.
  - **Tag cut at the frame edge.** The tag "ONE MAN · FIRST CLASS" is cut by the left edge at 53-58 s, and its trail
    hangs into the caption band (strip-10). Fixed by a knob.
  - **Six captions over 60 characters.** Captions 6, 9, 14, 15, 17 and 18 run 62-80 characters, and every caption over
    about 50 characters wraps to two lines. Five are fixed by caption edits; caption 6 is left (see Round 1).
  - **Honest line only in the caption.** It is not on stage in MONDAY: the stage shows only "Which group does it leave
    out?" (strip-20, 114-120 s). This is beyond scope.
  - **Reversed sub-label.** The sub-label under "3 in 10 · 3 in 10" reads THIRD-CLASS CHILDREN · FIRST-CLASS MEN, while
    the stage shows the men on the left and the children on the right (strip-16 cell 2, 91 s). Beyond scope.

### 2. b "the plan" (top-down plan, then deck level)
- Strengths:
  - The deck-level reveal is the cleanest single frame of either draft (strip-15 cell 8, 88 s). The two lit segments
    stand on one baseline, 33 % and 34 % are large, and the tops are level.
  - The class names FIRST / SECOND / THIRD / CREW are on the floor.
  - The honest line is on stage in MONDAY as well as in the caption (strip-20, 115 s).
- Faults:
  - **The pooled gap is not visible** (strip-07 cell 8, 40 s). The children's column is a flat strip in plan view, and
    moiré on the faces blurs lit against unlit.
  - **Busy ground and legend.** A cross-hair grid covers the stage for the whole film, and a legend sits top-right in the
    chrome face. Both count as chart apparatus at manager level.
  - **The camera keeps moving:**
    - The swing to deck level at 70-71 s.
    - A pan at 76-83 s that crops the crew slab off the right edge (strip-13 cell 8 to strip-14 cell 10).
    - A flash of every pin at 82 s.
    - A tilting stage in MONDAY at 109-111 s.
  - **Trail and bars in the caption band.** The tag trail crosses the caption band at 54-59 s, and the bars sit in the
    band at 13-15 s.
  - **Cost.** b is 2.5x a's cost per frame.
  - **No gl-post lane in the scan.** b declares no gl-post lib (it is absent from G3's scan list).

## Verdicts
- **a**: wins. It is the only draft whose pictures show both halves of the claim, the pooled gap and the class split,
  and its faults are timing, size and caption knobs.
- **b**: second. Its reveal frame is better, but the pooled belief is unreadable in plan view, the stage carries a grid
  and legend, and the camera wanders and crops the crew.

## Winner
Copied from drafts/a with cp -r, with no edits: film.json, film.js, claims.json, lib/, build/, gate.json, into
factory/films/women-and-children/. film.json already has `id` "women-and-children" and `look` {brand
ceti-boardwalk-dark, chrome none, material ink}, so nothing changed. Its gate.json `page` and `filmDir` still point
at drafts/a until the pipeline rebuilds.

## Borrowed beats (knob level, not in round 1)
- b's deck-level reveal camera (elevation about 6°, one baseline). In a, the matching knob is `elev1`, range 6-40,
  value 24. It was held back because lowering it crowds the slab pins, and round 1 enlarges those. If round 2 finds the
  lit tops at 88 s hard to compare, try elev1 18 alone.

## Round 1
findings.r1.json holds 12 findings: 0 block, 7 major, 5 minor. The dry run accepted 12 and rejected 0
(findings.r1.report.json).

| # | Target | Change | Fault it fixes |
|---|---|---|---|
| 1 | crewAt | 100 → 99 | caption ahead of the crew picture |
| 2 | revealEnd1 | 100.5 → 98.5 | same cause |
| 3 | revealEnd0 | 99 → 97 | same cause |
| 4 | groupGap | 56 → 76 | pooled pin overprint |
| 5 | pinSize | 14 → 18 | slab pins in the smallest face |
| 6 | chromeDim | 0.4 → 0.25 | crew-beat clutter |
| 7 | tag1 | 58 → 56 | tag cut at the edge |
| 8 | captions 9, 14, 15, 17, 18 | rewritten to ≤ 51 characters, same digits | captions over 60 characters |

Check in round 2:
- crew callout up by 99.5 s.
- 61 s and 104 s for pin overprint at 18 units.
- 40 s for the men's column staying in frame with the wider gaps.
- every rewritten caption on one line.

Left for round 2: caption 6 (62 characters, three counts). A safe ≤ 60 wording needs care; it is a candidate.

## Beyond scope (film.js; for the next draft or the pipeline's NOTES.md)
- 114-120 s (strip-20): the honest-limits line is not on stage in MONDAY, only in caption 19. The type sheet needs a
  second line under the question, as b does. This is a law item (rubric §b6): a's drafter.
- 91 s (strip-16 cell 2): the "3 in 10 · 3 in 10" sub-label order (children · men) is the reverse of the stage order
  (men left, children right). It is label text in film.js.
- 13-23 s and 30 s: G5c WARN for the running counters ABOARD 123…2,166 and LIVED 65. This ships as a warning
  (NOTES.md).
- 48 s (strip-09 cell 0): the pooled pins ghost for about 0.5 s over the start of the move. This is a transition and
  is not filed.
- Data: claims.json `verified: false`. The 32 Dawson cells were transcribed from memory and must be checked against
  the published table before any public use (brief). No on-stage label says so: the brief lane and the coordinator.

## Round 2 (after round 1 was applied, 2026-10-10)
Read the regenerated frames/ (strips, 1 s contact sheets, full-size thumbs at 40, 61, 99.5 and 104 s) and gate.json.
- The gate passes; the only WARN is G5c for the running counters.
- Purity is identical.
- Cost fell to 0.229 s/frame.

Each round-1 change, as it reads in the picture:

| # | Change | Result | Evidence |
|---|---|---|---|
| 1-3 | crewAt 99, revealEnd0 97, revealEnd1 98.5 | Half | The reveal is gone by 98 s (strip-17 cell 4). The 192 OF 862 callout is up at 100 s, not 101 (strip-17 cell 8). The crew caption still starts at 96 s, so it runs about 4 s ahead (it was 5). Every knob is at its documented limit; caption timing is beyond scope. |
| 4 | groupGap 76 | Half | The columns stand wider apart (strip-07 cell 8, 40 s). The women's plate now covers only the unlit top of the children's column, not its lit share. |
| 5 | pinSize 18 | Worked | The slab pins read at full size (strip-11 cell 2, 61 s). Overprint is no worse: "6 OF 6" still sits on the second-class slabs, as before. |
| 6 | chromeDim 0.25 | Worked | 192 OF 862 is the one bright label at 100-108 s (strip-17/18). |
| 7 | tag1 56 | Worked | The edge-cut "…FIRST CLASS · LIVED" tag is gone by 57 s. Half: its trail still dips into the caption band at 52-56 s. |
| 8 | captions 9, 14, 15, 17, 18 | Worked | Each is now one line (54 s, 86 s, 91 s, 103 s, 109 s). |

Nothing backfired and no knob was reversed.

findings.r2.json holds 6 findings: 0 block, 0 major, 6 minor. The dry run accepted 6 and rejected 0. All six are
one-line caption edits that keep their digits:
- caption 6, which brings the last caption over 60 characters under the limit;
- captions 0, 2, 10, 12 and 16, which wrapped at 52-57 characters.

Convergence: 12 findings in round 1, then 6, with no block. This is the last round.

Still beyond scope, to park in NOTES.md:
- Everything in "Beyond scope" above. That includes the honest line, which is still absent from the MONDAY stage, and
  the reversed order of the "3 in 10" sub-label.
- The crew caption leads its picture by about 4 s. It needs caption timing or a crew beat in film.js.
- The women's pooled plate overlaps the children's column. It needs label placement in film.js.
- The tag trail sits in the caption band at 52-56 s.
- Captions 7, 8 and 19 are 60 characters. They meet the law but still wrap.
