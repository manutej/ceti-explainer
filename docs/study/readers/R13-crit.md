# R13: crit round (JUROR, PACKET, PEDAGOGY-CRIT)

Sources: `.../up4-crit/crit/{PACKET,JUROR,PEDAGOGY-CRIT}.md`, law table `.../up3/modules/core/laws.js`.

## 1. PACKET

- Eight directions in table order A to H (Escapement, Marbling, Delta, Ledger, Margin, Bunraku, Run, Exposure). Each row gives a shared sheet, a native sheet, and a NOTES.md. Each sheet is 8 to 10 timed 960x540 stills. Shared comes before native within a row. No blinding or randomised order is recorded, and JUROR does not record viewing order.
- PACKET.md states no question. The implied question is JUROR's rubric: craft, originality and scroll-stop, each 1 to 5. PEDAGOGY-CRIT asked a different question: is each concept taught truthfully, and are the numbers honest?
- D and H sheets are named `sheet-shared.jpg`, not `*.sheet.jpg` like the others.
- The two critics had different evidence. JUROR saw sheets only. PEDAGOGY-CRIT read the sheets, all 8 NOTES files and every .srt, and recomputed every figure.

## 2. JUROR

**Method.** A batch test for family resemblance (section 2 of JUROR.md). Per-frame checks for belief, mark rule, address, ruler, thumbnail, silence and impossibility, and banned defaults (section 3). Each check cites a time. Scores are craft, originality and scroll-stop, each 1 to 5.

**Scores (craft/originality/stop, rank).**
- Shared: F 4/5/5 (1), G 5/4/4 (2), B 4/4/3 (3), C 4/3/3 (4), H 3/3/3, A 3/3/3, E 3/3/2, D 3/2/2.
- Native: B 5/5/5 (1), G 4/5/4 (2), E 3/4/3 (3), F 4/4/3 (4), C 3/3/2, H 3/2/3, A 2/2/2, D 3/2/1.

**Defects by chrome (time cited).**
- **A:** 12.0 s bank promises 3D, then flat icon grids take over 14.2 to 32.4 s. Tiles from 14.2 s are icons, not movements. Slip tooth is lost in shared. Native gears do not mesh. The 1-px hands are unreadable on a phone at 26 to 32 s. 36 % appears only in the closing line.
- **B:** 12 framed tiles read as wallpaper (12.3 to 31.5 s). Banned default H1 appears in shared (cream, slate hairlines, red strays). The stray's pass is unreadable at tile size. At 14.7 s the film says "exact inverse", and at 19.2 s "one noise, three pictures" contradicts it. Native (28.8 s) is the best teaching image, but see section 3.
- **C:** A diagram is pasted onto a hillshade. Deposit cones look equal in height at 22 to 31.5 s, so the ruler fails. Native has eight identical stripes, and the landslide is tiny and in the wrong place.
- **D:** "A DOM tween could make it." Shared shows 68 clean against 59.9 expected (+1.65 sd). Native at 19.6 s shows "kept 400" beside "−6 expected", so the seed invents a positive ROI. About 30 text items fail silence. There is no impossibility moment.
- **E:** Reads as a cursive font plus a pen shadow. The 26.0 s run strips are too small to be the hero. About 12 cursive lines at 23 to 30 s are unreadable on a phone.
- **F:** The 11.4 s fall with operator shadows is the best frame. The 24.6 to 34.6 s wall of about 50 miniatures does not show which move failed. The 1.8 s sign reads "W hat" and "Al", with a ghost duplicate. The red velvet should be black stage cloth.
- **G:** At 24.8 s the bars are not stitches, so it is a bar chart and not a cloth. At 18 to 21.2 s there are five barcode strips instead of one swatch. The 2.6 s knitted "AI" reads as "AT". The 5.80 s macro stockinette is the edge frame. Native "Context window" (fabric sliding off the needle with ACME on it) is the concept made physical.
- **H:** The vertical axis is "time against plan (sketch)", so the cone encodes nothing. The fan at 18.5 s reads as drift. Native reads as an "embedding plot" (thumbnail test).

**Cross-cutting.**
- House look. A copper-"2" countdown modal appears in seven shared films, at 6.4 to 16.5 s. E-shared is not on the list, though the text says "every shared film". Twin panels, tracked header strips and an identical "expected ± sd" footer recur. Only B-, G- and E-native escape the family.
- The juror gives no keep, cut or merge verdict. Derived from its fixes and PEDAGOGY section 5, not stated by JUROR:
  - Flagship candidates: F (shared, cleanest text) and G (best material). B-native only after its truth fix.
  - Rework or cut candidates: A (3/3/3 and 2/2/2, and the "stay in 3D" rewrite is a rebuild). D's craft is weak, but PEDAGOGY picks it for the C-suite after fixes, so that conflict needs a decision.
  - Merge: none proposed. C-shared and H-shared share a channel with 20 gates; diversify them rather than merge.

## 3. PEDAGOGY-CRIT

**Method.** Section 1 scores each shared film 0 to 2 on three criteria: (a) whole runs pass or fail, (b) the rate multiplies, (c) checks cost something. Section 3 gives a truth verdict per native. Section 4 is a phone test at about 390 px. All figures were recomputed (p=.95, c=.8, p'=.988).

**Cost scores (a+b+c of 6).** C 6, D 5, E 5, H 5, A 4, B 4, F 4, G 4. Only C, D and H make cost a mark; five of eight leave it as words.

**Numbered defects.**
1. The brief's "sd ≈ 21" is wrong. At 1,571 the sd is 18.4. A check: a binomial with n≈1,586 has sd at most √(n/4)≈19.9, so "±21" is impossible. It appears in G and H.
2. "Exact ± " (G and H: "exact 717 ± 21"; B: "exact 17.2 ± 3.3"). Use "expected".
3. Two encodings at once: "36 %" on screen with "1 in 3" or "a third" in captions. Pick one, ideally "36 of 100".
4. B has 48 trays, but other films use 50. Use 50.
5. Ledger hourglass is 100 h in shared and 20 h in native. One glyph must mean one unit.
6. Ledger break-even "18.8 h" excludes the 20 h redo, so the real total is 38.8 h. The label must state what it includes.
7. Ledger native leads with a lucky seed ("kept 400") in large type, and the expected −6 is tiny. Headline the expectation.
8. Escapement native closes on 73 % and 79 %, but the trays show 49/60 and 51/60. The realised no-check count beats the expected checked count, so N=60 is too noisy. Use N=600 or a dashed expected fill.
9. Exposure "7 of 10 cleared: 70 %" comes just before the commit and anchors the guess. Commit first.
10. The Wield is degenerate. With uniform p=95 %, the product commutes, and a 12 h budget buys a check at all 10 turns. Vary p per turn and use a 5 h budget.
11. Minor: C "719" overprints its label. G's "row 2/20" counters read about 2 sd low. B's "e.g. 34" guess tick is unlabelled.

Misleading metaphors: A "the pendulum dies"; F a falling puppet reads as carelessness; B's filaments make early failures look milder; H's fan reads as drift.

**Truth verdicts (native).** A True. B Partly false ("exact inverse" at 14.7 s; real noising destroys the picture and the generator guesses it back). C True, with a ρ=0.8 sketch label needed and "checks cannot catch a shared cause" over-generalised. D Arithmetic true, but see defects 6 and 7. E Inverts the point ("you did it too" is said to a viewer who never guessed). F True as a sketch, but the human has no p. G Partly false (the U-curve contradicts "quality fades"; FIFO is an app policy shown as model behaviour). H True, but 31 hand-named features overclaim.

**Legibility.** Fails on a phone: D's tool labels and ~6 px lines, C's legend and footer, H's captions at 29.8 s, E-native at 23 to 30 s, G at 30.5 s (7 px), and G-native BPE readouts. F is cleanest. Rule: the smallest type never carries a result or an honesty beat. The crit mixes phone pixels and frame pixels, so the unit must be declared.

**Redundancy.** Audio is SFX only, so the .srt is the verbal channel. A, B, C, D and F repeat the takeaway on screen. Choose voice-over with labels, or captions only.

**Commits, natural frequencies, expected vs realised.** Commit order is defect 9; E's two commits with a shrinking gap is the best b. Natural frequencies are defects 3 and 4. Expected vs realised is defects 2, 6, 7 and 8.

## 4. Mapping to laws.js

- **P1** (commit before reveal): from defect 9. Its source string cites CRIT-d9. Enforced only if the reveal is annotated.
- **P2** (count before percentage): not sourced in these docs. It checks order only, not agreement, so defect 8 passes it.
- **P3, P4, P9, P10, P11, P12:** no source in these docs.
- **P7** (cost beat as a mark): from section 1 (c), which the source string cites as CRIT§1. It applies only to TW structures, so five of eight shared films would pass with cost as words.
- **MAX:** not in these docs. E's two commits is the only instance.
- **LEGIBLE:** from section 4. Its source string cites it. The 14 px threshold needs a declared unit.
- **BELIEF:** from JUROR section 3 (D's "kept 400" beside "−6"; 68 vs 59.9) and defect 2. The law covers typed numbers and sketch labels, not the word "exact" or the choice of seed.
- **INV:** from defect 10. Its source string cites it. Hard, grade C.
- **HOUSE:** from JUROR section 2. It checks only for draw calls in code. It does not catch the visual sameness the batch test found.
- **SEED:** the seed-picking rule ("within 0.5 sd, or headline the expectation") is not enforced. SEED covers common random numbers only.
- **CAP:** defect 8's N choice is only partly covered. CAP checks the range of N, not whether a check is visible at that N.
- **CLOCK, TYPE:** no source.

**Gaps (crit rules that did not become laws):** cost as a mark for every shared film; "exact" beside a ±; seed selection; one unit per glyph across films; break-even cost basis; sample size against effect size; percentage-count agreement; the mark rule (every element maps to a model quantity); address; silence and impossibility; one channel per takeaway; a truth gate on native films.

## Core ideas that should survive into a master plugin

1. Two instruments. A craft juror (sheets only) and a pedagogy critic (sheets, notes, captions, recomputed numbers). The craft top pick (B-native) was partly false, so the two must be combined.
2. A per-frame doctrine checklist that cites times: batch, belief, mark rule, address, ruler, thumbnail, silence, impossibility, banned defaults.
3. Cost-as-mark scored 0 to 2 on three criteria.
4. Recompute every figure before a number is accepted.
5. A phone-width text test, with the unit declared.
6. Each defect becomes a rule, then a law. Every law carries a source tag (CRIT-dN, CRIT§n), a hard or soft grade, and a written waiver for soft laws. laws.js does this already.
7. A truth veto: the pedagogy verdict gates native rankings.
8. The batch test detects house tics, such as repeated modals or identical footers.

## Experiment-specific choices

- The eight directions and their concepts (handoffs, un-combing, correlated failure, ROI, roles, context, embeddings, confidence).
- The specific numbers: p=.95, c=.8, 36 %/79 %, N=60 and 600, the 12 h and 5 h Wield budgets, 50 trays, the ρ=0.8 sketch.
- The craft and originality scores and the ranks.
- The house-look tics (copper countdown, twin panels, header strip).
- The audience pairings: C-suite D+C, all-hands E+F, engineers H+C-native.
- Specific fixes: involute train, the 12-tray marbling layout, the √N band, the cloth bar chart.
