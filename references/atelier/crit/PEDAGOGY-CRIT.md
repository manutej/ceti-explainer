# Pedagogy + numbers crit: contact sheets, round 1

All 16 sheets, 8 NOTES files and every .srt were read. Every figure was recomputed (p=.95, c=.8, p′=.988). "Phone" means the 960×540 frame at about 390 px wide.

## 1. Shared film (0–2 each): (a) whole runs pass or fail, (b) the rate multiplies, (c) checks change it and cost something
| | a | b | c | Σ | Which frame fails |
|---|---|---|---|---|---|
| A Escapement | 2 | 1 | 1 | 4 | b: 36 % appears only in the closing line (32.4 s). c: no cost anywhere. The 1-px hands are unreadable on a phone at 26–32 s. |
| B Marbling | 2 | 1 | 1 | 4 | b and c are caption words only. At 28.5 s early strays are combed into thin filaments, so earlier failures look milder. |
| C Delta | 2 | 2 | 2 | **6** | The bank silhouette is 0.95^k (25 s), and the braids cost time. "A little time" has no number. |
| D Ledger | 2 | 1 | 2 | 5 | The −969 h is debited (20.5 s). b: the caption says "multiply to 60 %" beside a realised 68. |
| E Margin | 2 | 2 | 1 | 5 | Best b: two commits and a shrinking gap. c: no cost. |
| F Bunraku | 2 | 1 | 1 | 4 | The featured run slips three times in 20 moves at 9.6–11.4 s (expected: 1), which teaches "errors pile up". The cost is only the fine print "moves made again: 33". |
| G Run | 2 | 1 | 1 | 4 | Superb ruler at 24.8 s, but no curve is ever drawn. Cost and independence are in 7-px type at 30.5 s. |
| H Exposure | 1 | 2 | 2 | 5 | At 18.5 s the fan widens ("height = time against plan"), which reads as drift building inside one run: the 0.05·k trap. |

Five of the eight leave cost as words. Only C, D and H make it a mark.

## 2. Numbers
**Correct:**
- A/E/F 19/41 vs 17.9±3.4 / 39.3±2.9.
- C/G/H 719/1,586 vs 717±21 / 1,571±18, 867 saved.
- B 19/40 vs 17.2/37.7 (N=48).
- D 68/93 vs 59.9/88.6 (k=10). Wield 32.8, P(≥32)=71 %.
- A-native 73.3 % and 79.2 %, 44.0 / 47.5.
- D-native 400 / 681, expected −6 / 484, break-even 18.8 / 13.0 h.
- C-native 841±334.

**Defects:**
1. **The brief is wrong:** "sd ≈ 21 each". At 1,571 the sd is **18.4**. C and G are right. Fix §1.
2. **"exact 717 ± 21"** (G, H) and "exact 17.2 ± 3.3" (B) sit beside "expected" in the other five. "Exact ±" contradicts itself for a lay viewer. Use *expected*.
3. **Two encodings at once.** The screen says "36 % / 79 %" while the caption says "1 in 3 / 4 in 5" (A, F) or "a third / four fifths" (C). Pick one, ideally "36 of 100".
4. **B's 48 trays** produce "19 of 48 / 21 saved" against "19 of 50 / 22 saved" elsewhere. Use 50.
5. **Ledger hourglass** means 100 h in the shared film and 20 h in the native. That breaks Isotype.
6. **Ledger "checks pay above 18.8 h a failure"** is find-and-fix time on top of the 20 h redo, so 38.8 h in total. The label needs to say so.
7. **Ledger native leads with a lucky month.** "Kept 400 without checks" is in big type; the expected −6 is tiny. Swap them.
8. **Escapement native: the closing line says 73 % / 79 %, but the trays show 49/60 and 51/60.** The realised no-check count beats the expected checked count, so the check appears to save 2 jobs. Use N=600, or draw a dashed expected fill.
9. **Exposure: "7 of 10 cleared: 70 %"** (+2.2 sd) comes right before the commit and anchors the guess. Commit first.
10. **The Wield is degenerate** (inherited from PEDAGOGY §3). 12 h pays for a check at all 10 turns, and with a uniform 95 % the product commutes, so placement cannot matter. Vary the per-turn reliabilities (sketch) and set the budget to 5 h.
11. **Minor:**
    - C: "719" overprints its own label.
    - G: the counters at "row 2/20" read about 2 sd low (they update mid-row).
    - B: the "e.g. 34" guess tick is unlabelled.

**Misleading metaphors (beyond H's fan and B's filaments):**
- A: "the pendulum dies".
- F: a human-like puppet falling suggests "the agent is careless".

## 3. Native films: is the concept taught truthfully?
| | Verdict | Biggest risk → fix |
|---|---|---|
| A Handoffs | True | Noise at N=60 hides the check (defect 8). |
| B Un-combing | **Partly false** | "Exact inverse… the tulip comes back exactly" (14.7 s). Real noising destroys the picture, and the generator guesses it back. The memorable impossibility teaches the wrong thing. → Add an irreversible random sprinkle so un-combing lands on a *different* plausible tulip. Cut the 10⁻¹⁴ readout. |
| C Correlated | True. ρ=0.8 needs a **sketch** label. | "Checks cannot catch a shared cause" over-generalises. → "Checks that read the same source." The key result (42 %, ±334) is in about 6-px footer text, so draw the band on the deltas. |
| D ROI | Arithmetic true | Defects 6 and 7. |
| E Confidence | **Inverts the point** | The shaky "Thimphu" teaches that AI shows its doubt. Really the fair copy looks identical either way. "You did it too" is said to a viewer who never guessed. → Close on all three answers in identical clean type. Make the mirror conditional: "if you guessed above 36 %". |
| F Roles | True as sketch | The "before" human has no p, so reads as perfect. Only the extremes are shown. → Give the human a p, and add one checker per 3 stages. |
| G Context | **Partly false** | "Quality fades toward the far end" contradicts lost-in-the-middle (U-shaped). FIFO sliding is an app policy, but it's shown as the model's behaviour. → Loosen the middle stitches, and label "an app that drops the oldest text". |
| H Embeddings | True | 31 *hand-named* features imply that real dimensions are readable. → "Real dimensions are learned and unnamed; context moves a word." |

## 4. Text load and redundancy
**Fails on a phone:**
- D: tool-call labels, and the ~6-px realised/expected lines.
- C: the legend, and the native result footer.
- H: densitometer and trust-scale captions, the neighbour list, the γ formula.
- E-native, 23–30 s: about 12 cursive lines.
- G-native: the BPE readouts.
- A: bank headers.
- B: tray sub-labels.

F is cleanest. **Rule:** the smallest type must never carry the result or an honesty beat. C-native, G at 30.5 s and H at 29.8 s all break it.

**Redundancy.** The audio is SFX only, so the .srt is the verbal channel. Yet A, B, C, D and F repeat the takeaway on screen, often in a different format (defect 3), and E captions its own handwriting. Choose one approach:
- VO, with on-screen text limited to labels at their marks (modality and contiguity principles).
- Captions only, cutting on-screen sentences except the commit question.

## 5. Which two for which room
- **C-suite:** **D Ledger**, which uses their currency and debits the cost, after defects 6, 7 and 10 are fixed. Pair it with **C Delta**, where the shape plus the correlated-failure native film is the strategic risk.
- **Non-technical all-hands:** **E Margin** (prediction, generation effect, best b; it needs the native fix). Pair it with **F Bunraku** (roles, lightest text; it needs cost as a mark and the 3-slip run replaced).
- **Engineers:** **H Exposure** (√N, realised vs expected, cost as geometry). Pair it with **C Delta native** (correlation, ±334). Fix G's U-curve before engineers see G.
