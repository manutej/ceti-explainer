# how-a-network-learns · SELECT (blind)

Evaluator: Opus, 2026-10-10. Read for each draft: frames/strip-01..21.png and thumbs/ (contact sheets at 1 s, full
thumbs at the key times), frames/frames.json, film.json, claims.json and gate.json. Also read the brief and beats in
factory/topics/how-a-network-learns/. Not read: film.js, lib/, NOTES.md. No browser was run.

Gate: both drafts PASS G1-G10. Purity is identical at 24.6, 61.5 and 98.4 s in both. G5c is WARN in both:
- A: the running step counter (STEP 60 … 960 at 46-55 s), plus "ROW 84" and "ROW 134".
- B: the same counter (STEP 79 … 979), the 3b step clock (STEP 6 … 641 at 89-99 s), plus the two row pins.

The row pins are claim `wrong_rows` ("84, 134"). That claim has no `renders`, so the gate cannot match them. This is
cosmetic claims text, so it is parked, not fixed here.

Commit is off (D11), so the COMMIT row of the rubric does not apply. Cost: A 0.17 s/frame, 1.295 MB; B 0.143 s/frame,
1.294 MB.

Timestamps are film seconds. Strip-NN covers 6(NN-1) to 6(NN-1)+5.5 s, and cell = (t − start)/0.5.

## The one question: is the gap visible with the captions covered?

The gap has three parts: most of the drop comes in the first few dozen steps, the last flowers cost most of the
steps, and the misses sit where the two species overlap.

- **A: yes, by 98 s, on one frame.** The descent shape is in place from 46 s (strip-08 c8): the bead leaves 1.393
  down the wall and lies on the valley floor by the second thumb. The step chart beside the brushed cloud comes next
  (strip-16 c4, 92 s → strip-17 c4, 98 s). Its curve climbs by the 34 tick and then runs flat to 1,000, with
  "143 RIGHT AT STEP 34" and "148 RIGHT AT STEP 231" listed under it. The overlap closes it at 104 s (strip-18 c4):
  both missed rows are pinned inside the shared band on one frame.
- **B: half.** "Fast at first" is shown as a moment: the cloud floods lit between steps 1 and 3 (strip-15 c4-c6,
  86-87 s). "The last few cost the most" is never shown in a picture. The only carrier is a 12-unit step counter,
  clipped at the top edge (strip-16 c4, 92 s), and pins that replace each other. The overlap band is gone in 3b,
  and the two missed rows never share a frame (101-107 s).

## Ranking

### 1. A "the laboratory": the winner
Strengths:
- **CASE carries the overlap before any network** (strip-05 c6-c11, 27-29.5 s). Setosa is an island. The translucent
  band has 4.5 / 5.1 ticks on the petal-length axis, and versicolor and virginica interleave inside it.
- **The heightfield carries the shape of descent** (strip-08/09, 46-57 s): a steep wall, then a long flat floor. The
  START 1.393 and END 0.039 pins land with the step counter (END at 56 s, when the counter reads 1,000). The section
  inset shows the flat floor.
- **The ribbons carry the count** (strip-11 c2, 61 s → strip-14 c8, 82 s):
  - 13 RIGHT lands at count.at.
  - 135 lands in the display face, with "OF 150 · 90 %" 1 s later.
  - The slab readouts are 50 / 39 / 46.
  - Then 144, 146 and 148, with "98.7 %" only after the count (G7 holds).
- **The brushed cloud carries the cost.** The 3b chart is the film's strongest single frame (strip-17 c6, 99 s).
- Every on-screen digit I read is a claim: 150, 1935, 1936, 1.9, 4.5, 5.1, 37, 8, 65, 1,000, 1.393, 0.039, 13, 135,
  50/39/46, 90 %, 144, 146, 148, 49, 98.7 %, 34, 231, 143, the 10/34/231/1,000 ticks and 84/134.
- One honest line (caption 21). The CETI card is last, and the 122.5 s frame is not blank.

Faults:
- The ribbon marks are texture-sized. The 2 lavender misses cannot be found at 82 s (strip-14 c8) [major, markSize].
- The ribbons are near-black, so "weights keep growing" is told, not seen (strip-13, 72-78 s) [major, ribbonMix].
- "37 FLOWERS IN THE SHARED BAND" is in the 16-unit pin face (strip-05 c8, 28 s) [major, pinSize].
- The row pins land 1.6 s after caption 19 (strip-17 c10 → strip-18 c1) [major, rowPinsAt].
- The loss slice sits under the caption band at 31-39 s and 40-50 s (strip-06, strip-08) [minor, camDist0 and camDist1].
- Six captions wrap to two lines and climb into marks (45-107 s) [minor, captions].
- The 3a legend at top left overprints itself ("…SI[Z]E OF THE WEIGHT…", 59-83 s) [scope].
- The 3b chart title "FLOWERS RIGHT BY STEP · LOG STEP CLOCK" is dim and clipped at the top edge [scope].
- The "1.9" tick overprints "PETAL LENGTH" (strip-15 c4, 86 s) [scope].
- The box and band dive into the caption band during the dolly (strip-18 c4-c11, 104-108 s). The dolly knob is
  already near its 800 ceiling [scope, or round 2].
- Caption 6 describes the network over a picture of the loss surface (31-35 s) [scope, beat content].

### 2. B "the night garden"
Strengths:
- The species pins come up early (strip-03 c4, 14 s).
- The display-face pins "1.9 CM" and "37 FLOWERS" carry the CASE results (strip-04 c10, 23 s; strip-05 c8, 28 s).
- The ribbons are bright and wide, with countable mark stacks (strip-12 c2, 67 s, the best 3a frame of the two).
- The lit flood at 86 s is a real moment.

Faults:
- **claim-told-not-shown (block for the tier).** The cost of the last flowers is told by captions and the clipped
  step counter only (strip-16/17, 90-100 s).
- **reversal-hidden.** ROW 84 and ROW 134 are pinned one at a time and never share a frame, and there is no band in
  3b (strip-17 c10 → strip-18 c6).
- The END pin "LOSS 0.039 · AFTER 1,000 STEPS" is up from 51 s while the counter reads 579 (strip-09 c6) [major].
- Every checkpoint blanks and regrows the ribbons. Output slabs are empty at 63, 73, 76 and 79 s (strip-11 c6,
  strip-13 c2, strip-13 c8, strip-14 c2), and the headline dims to a stale "135" over the step-50 ride (73-74 s).
- The warm "dawn" gradient floods the ground in 3b (strip-17/18). This is texture beyond ink at the manager level.
- The box crosses the caption band in CASE, and the footnote overprints the caption's first letter at 48-57 s.
- Its faults that matter are film.js behaviour (pin persistence, the regrowth, clipping), not knobs.

## Verdicts
- **A**: the pictures alone carry all three parts of the gap. Its faults are mostly sizes and colours that knobs and
  captions can fix.
- **B**: the handsomer network and the clearer flood moment, but "the last few cost the most" lives only in words.

## Winner
A is copied unedited to factory/films/how-a-network-learns/: film.json, film.js, claims.json, lib/, build/ and
gate.json. Its film.json already carries `id: "how-a-network-learns"` and `look: {brand: ceti-neosage-dark, chrome:
none, material: ink}`, so no edit was needed. There is no draft-local brand file, because the pack lives in
arsenal/brands. The eyebrow still says "draft A, the laboratory": the catalogue stage should drop that suffix (scope:
it is not a findings target).

## Borrowed from B (knob level)
- markSize 3.4 → 4.4 (B used 4.2 and its stacks read at 67 s).
- ribbonMix 0.55 → 0.85, which lifts A's bands toward B's brightness. The knob semantics differ, so the value is A's.
- pinSize 16 → 20, toward B's display-face "37 FLOWERS". B's face itself would need film.js.

## Round 1
findings.r1.json holds 12 findings: 0 block, 4 major, 8 minor. The dry run accepted all 12 (0 rejected).
- Knobs: markSize, ribbonMix, pinSize, rowPinsAt, camDist0, camDist1.
- Captions 9, 10, 14, 16, 17 and 19 are shortened to one line (≤ 46 chars), with the same claims.

Check in round 2:
- Mark stacks do not overflow the slab readouts.
- The 20-unit pins stay clear of the top edge and of each other at 18-30 s.
- The slice clears the caption at 31-50 s and the descent is still the focal object.
- The ROW pins land with caption 19 while the dolly moves.
- Caption 16 (46 chars) stays on one line.

## Beyond scope (film.js; for the drafter or the round-2 NOTES)
- **The honest line and the MONDAY question are captions only** (strip-19/20, 108-119.6 s): there is no on-stage
  text. The law asks for the honest line on stage in MONDAY. The same gap is in both drafts; G4e passes on the page
  text. [major; drafter]
- **The log step chart in 3b** (85-108 s) is chart apparatus, with log ticks and an "ALL 150" reference. On a log axis
  the early climb looks gentler than it is. Keep it, because it carries the gap, but label the axis plainly ("steps,
  log scale"), or draw it linear with the 34 / 231 ticks. [major; drafter]
- The 3a legend overprints itself at the top left (59-83 s). [minor; drafter]
- The 3b chart title is clipped at the top edge (85-108 s). [minor; drafter]
- The "1.9" tick overprints the "PETAL LENGTH" axis label (23-108 s). [minor; drafter]
- The box and band enter the caption band during the dolly (104-108 s). `dolly` is near its ceiling, so the fix needs
  a look-at offset for the dolly. [minor; drafter]
- Caption 6 (the network) plays over the loss surface (30.4-35 s). Moving or renaming the beat is a brief or film.js
  change. [minor; brief]
- The G5c WARN for "ROW 84 / ROW 134" needs a `renders` on claim `wrong_rows`. That is cosmetic claims.json text.
  [minor; brief owner]
- The running step counter (46-55 s) is a G5c WARN, as expected; it ships with the warning. [minor; NOTES]
- The eyebrow says "draft A, the laboratory". [minor; catalogue]
- The DATA WARNING in the brief stands: iris.csv must be verified against UCI before public use. [block for public
  release; brief owner]

## Round 2
Read: the regenerated frames/ (strips, and the thumbs compared with drafts/a at 20, 28, 31-35, 46, 52, 73, 82, 87, 92 and
101-107 s), film.json and gate.json. Gate: PASS. G5c is WARN, the same as before (the step counter, ROW 84/134).
G8 is 116.0 KB. Purity is identical.

What each round-1 change did:
- markSize 4.4: **half.** The slab stacks now read as grids of countable marks (strip-14 c8, 82 s). The 2 lavender
  misses are still not findable, because that is colour against neighbours, not size. Parked.
- ribbonMix 0.85: **half.** The bands are lighter at 82 s, but at 66-81 s they are still hairlines (strip-13 c2, 73 s).
  The width knob is the one that acts on the problem → r2 widthGain.
- pinSize 20: **did little.** The "37 FLOWERS IN THE SHARED BAND" pin is bigger, but it is still in the mono pin
  face, and it now runs to about 935 units, near the right edge (strip-05 c8). The knob is at its ceiling. A display
  face for result pins is film.js → beyond scope.
- rowPinsAt 101.4: **worked.** The pins land at 102.0 s, about 0.5 s after caption 19 fades in at 101.5 (strip-18 c0).
- camDist0 1.7: **half.** The slice sits higher, but the two-line caption 6 still touches its lower edge
  (strip-06 c2, 31 s) → r2 caption 6.
- camDist1 1.56: **worked**, together with the one-line caption 9. The corner of the slice clears the caption at
  46 s (strip-08 c8), and the descent is still the focal object.
- Captions 9, 10, 14, 16, 17 and 19: **worked.** All six are one line, and none touches marks (46, 52, 73, 87, 92 and
  104 s). Caption 19 now names the band that is on screen.

findings.r2.json: 8 findings, 0 block, 1 major, 7 minor. The dry run accepted all 8.
- widthGain 6 → 7.5 (B's value).
- Seven wrapped captions (1, 2, 3, 5, 6, 7 and 20) are cut to one line. Each is shorter than before (−5 to −13
  chars), so film.json shrinks, and they carry the same claims.

Convergence: 12 → 8, no block, and no knob reversed. This is the last round. Whatever remains goes to NOTES.md:
- The 2 misses at 82 s.
- The result face for the band pin.
- Everything in "Beyond scope" above.
- The G5c WARNs.
