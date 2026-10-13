# Simpson's paradox · `simpsons` · beat sheet (75 s = 72 s material + 3 s brand card)

Stage 960 × 540 units (film mode 1920 × 1080, scale 2). Silent; captions carry it. Every digit is a
claim id in claims.json (in brackets below). Faces: Big Shoulders Display 600 (headlines, stamp),
IBM Plex Mono 400/500 (every number), DM Sans (captions, sentences). Ink on paper; one red pencil
accent (`--pencil`) for "men ahead", the viewer's guess and the strike. No icons.

## The four structures
| # | structure | beats | what it is |
|---|---|---|---|
| S1 | Verdict sheet | HOOK, MONDAY | a typeset review sheet: "New sales process / Converts worse overall." + a KILLED stamp; returns at Monday with the stamp struck |
| S2 | Commit box | COMMIT | seven cells 0–6, a countdown digit, then SEALED; collapses to a chip |
| S3 | Mark field | CASE, COUNT | 4,526 squares, one per applicant, two columns; pooled, sorted, then split into six department bands |
| S4 | Department ledger + guess strip | COUNT | six rows beside the bands (rates, counts beneath, who is higher) and a 0–6 strip placing the guess against 2 |
The brand card is not a structure.

## Timeline
| beat | t (s) | what happens |
|---|---|---|
| HOOK | 0.0–8.0 | S1 sheet. 0.3 eyebrow "SALES REVIEW" (14u). 0.6 "New sales process" (44u). 1.4 "Converts worse overall." (28u). 4.4 KILLED stamp lands (red pencil, −6°, scale 1.15→1 over 0.25 s). No digits. |
| COMMIT | 8.0–16.0 | 8.0–8.6 sheet fades; S2 box rises. Countdown digit 8→1, one per second [hold]. 15.0 cell "5" inks (film default [guess]). 15.4 "SEALED". 16.0–16.8 box collapses to chip "YOUR GUESS · SEALED" (top right, 12u chrome, no number). |
| CASE | 16.0–36.0 | S3. 16.5 column labels. 16.5–23.5 marks arrive; counters tick to 2,691 [menApplied] and 1,835 [womenApplied]. 24.0–25.5 admitted marks ink. 26.0–28.6 admitted sort to the top; counters become "1,198 / 2,691" and "557 / 1,835" [menAdmitted, womenAdmitted]. 31.0–33.0 pencil underline on the women's admitted block. No % in this beat. |
| COUNT | 36.0–62.0 | 36.0 headers become 45 % / 30 % [menRate, womenRate] with "1,198 ÷ 2,691" beneath. 40.0–44.5 SPLIT into bands A–F. 46.0–49.6 S4 ledger rates appear row by row. 52.0 guess strip: YOU 5 vs TRUTH 2 [guess, womenWorse]; C and E rows marked MEN in red pencil. 56.0 mix: A and B bracketed, C–F dimmed; "1,385 / 2,691" and "133 / 1,835" [menAB, womenAB]; 58.5 become 51 % and 7 % [menABpct, womenABpct]. |
| MONDAY | 62.0–72.0 | 62.0–63.0 field fades, S1 sheet returns as it was at 8.0. 63.0 pencil strike through KILLED. 63.6 "Same mix of leads?" (44u). 64.6 "Split by segment. Then compare." (28u). Holds to 72.0. |
| BRAND | 72.0–75.0 | 72.0–72.4 crossfade to plain paper card: "CETI" wordmark line (Big Shoulders 44u, tracking 0.3em, y 250), takeaway (DM Sans 28u, y 304): "Worse overall can be better in every part. Split first." Hold to 75.0. |

## Captions (14; DM Sans 28u, centred, baseline y 506, max width 900)
| # | t0 | t1 | text |
|---|---|---|---|
| 1 | 0.6 | 4.2 | Our new sales process converts worse overall. |
| 2 | 4.4 | 7.8 | So we killed it. Case closed? |
| 3 | 8.2 | 11.8 | Berkeley, 1973: women got in less often overall. |
| 4 | 12.0 | 15.8 | In how many of 6 departments did women do worse? |
| 5 | 16.4 | 24.6 | Fall 1973, six departments: 4,526 applicants. |
| 6 | 24.8 | 29.8 | Admitted: 1,198 of 2,691 men, 557 of 1,835 women. |
| 7 | 30.0 | 35.8 | Fewer women got in. The headline writes itself. |
| 8 | 36.2 | 39.6 | Overall: 45 % of men admitted, 30 % of women. |
| 9 | 39.8 | 45.6 | Now split the same marks by department. |
| 10 | 45.8 | 51.8 | Same marks, same rules. Compare each department. |
| 11 | 52.0 | 55.8 | You said 5. Women did worse in 2, by 3 and 4 points. |
| 12 | 56.0 | 61.8 | 51 % of men applied to A or B, the easy two. 7 % of women. |
| 13 | 62.2 | 66.6 | Monday: did the new process get the same mix of leads? |
| 14 | 66.8 | 71.6 | Splitting explains this gap. It does not prove fairness. |

Caption 11 is templated from state.guess: "You said {g}." (film: 5 [guess]); if no answer on the live page,
"No answer sealed. Women did worse in 2, by 3 and 4 points." (58 chars). Claims: 3 and 4 are [gapC, gapE];
"the easy two": A and B admit 64 % and 63 % of all applicants [aRate, bRate] (transcript).

## Commit prompt and default
Prompt (caption 3 + 4, and inside the box, 28u): "Women got in less often overall. In how many of
the 6 departments did they do worse?" Answer cells 0 1 2 3 4 5 6 (Plex Mono 44u, 72u wide each).
Live page: playback pauses at t = 8.6, an 8-second real-time countdown runs (keys 0–6 or click; Enter or
a click seals); on seal or timeout set state.guess (number or null) and seek to 15.0. Film mode:
state.guess = film.json `defaultGuess: 5` (a typical "most of them" guess), countdown digit =
8 − floor(t − 8.0) for 8.0 ≤ t < 16.0. Nothing from the answer appears until 52.0.

## The COUNT structure, frame by frame (S3 + S4)

### Geometry (design units)
- Mark pitch P = 4.5; mark = filled square 3.4 × 3.4 at offset 0.55 inside its cell; 50 marks per row,
  so a column is 225 wide. MEN column x0 = 96 (to 321); WOMEN column x0 = 360 (to 585). Field top y0 = 120.
- Admitted mark: ink `--ink` fill. Rejected mark: no fill, 0.8u stroke `--graphite` at 55 % opacity.
  Before 24.0 every mark is drawn as rejected style (unknown outcome).
- Header per column (x = column x0): line 1 baseline y 74 (Plex Mono 500, 28u; 44u when it holds a %),
  line 2 baseline y 100 (Plex Mono 400, 14u). Eyebrow chrome y 26 (12u): "CASE · SIMPSON'S PARADOX".
- Pooled grid: slot k → (x0 + P·(k mod 50), y0 + P·floor(k / 50)). Men 54 rows (to y 363), women 37 rows.
- Bands: rows per department R = [17, 12, 12, 9, 8, 8] (= max of ceil(men/50), ceil(women/50) for A–F),
  gap 5 between bands. Band tops: A 120, B 201.5, C 260.5, D 319.5, E 365, F 406; bottom of F 442.
  Band slot j of department d → (x0 + P·(j mod 50), top_d + P·floor(j / 50)). Band letter (Big Shoulders
  20u) at x 72, centred on the band.
- Ledger (S4) to the right, x 615–935. Header y 100 (14u): "MEN" at 630, "WOMEN" at 720, "HIGHER" at 820.
  Row d centred on band d: rate at baseline centre+2 (Plex Mono 500, 20u), counts beneath at centre+16
  (14u, "512 ÷ 825"). HIGHER column: "WOMEN" in ink or "MEN" in red pencil (16u).

### Mark identity (deterministic)
For each sex, build the list department by department (A..F), admitted first then rejected:
men A: 512 admitted, 313 rejected; B 353/207; C 120/205; D 138/279; E 53/138; F 22/351.
women A: 89/19; B 17/8; C 202/391; D 131/244; E 94/299; F 24/317 (params in claims.json).
Pooled slot: seeded permutation by mulberry32 (seed 1973 for men, 1975 for women; Fisher–Yates over the
index list). Sorted slot: admitted marks keep their pooled order and take slots 0..A−1, rejected take
A..N−1. Band slot j: index within its department (admitted first), so each band fills with ink from its
top-left, and the inked area reads as that department's rate.

### Frames
- **16.5–23.5 arrival.** Both columns fill at the same rate, 2,691 / 7 = 384.4 marks per second, in slot
  order. Mark at slot k appears at t = 16.5 + k / 384.4 (fade 0.15 s). Women finish at 21.27, men at 23.5;
  the men's column is visibly taller. Line 1 counters tick with the number visible: "2,691" and "1,835".
  Line 2 "MEN · APPLIED", "WOMEN · APPLIED".
- **24.0–25.5 ink.** Admitted marks switch to ink in pooled-slot order over 1.5 s (each 0.12 s fade).
  The field now shows scattered ink, denser on the left.
- **26.0–28.6 sort.** Each mark moves from pooled slot to sorted slot, easeInOutCubic, duration 2.0 s,
  start delayed by 0.6·(sorted slot / N). Line 1 becomes "1,198 / 2,691" and "557 / 1,835"; line 2
  "ADMITTED / APPLIED". Men's ink block: 23 full rows + 48; women's: 11 rows + 7.
- **31.0–33.0** red-pencil underline (1.5u) draws under the women's ink block (y = 120 + 4.5·12 + 2).
- **36.0–36.6** line 1 crossfades to "45 %" and "30 %" (44u); line 2 "1,198 ÷ 2,691", "557 ÷ 1,835".
- **39.6–40.0** headers dim to 40 % opacity (they stay as the reference). Band letters A–F fade in at 39.6.
- **40.0–44.5 split.** Department d (0 = A) starts at 40.0 + 0.5·d; each of its marks moves from sorted
  slot to band slot, easeInOutCubic, 2.0 s, plus a per-mark delay 0.3·(j / n_d). F ends at 44.5. The
  viewer sees men's marks pour into A and B (tall ink bands), women's into C–F (wide pale bands), women's
  A and B rows short (3 rows, 1 row).
- **46.0–49.6 ledger.** Row d fades in at 46.0 + 0.6·d (0.4 s): rates "62 %  82 %", "63 %  68 %",
  "37 %  34 %", "33 %  35 %", "28 %  24 %", "6 %  7 %", counts beneath. HIGHER column stays empty.
- **52.0–53.2 guess strip.** Ledger header fades; at y 40–108 over x 615–935: numerals 0..6 at
  x = 640 + 46·k, baseline y 100 (16u); headline "WORSE IN 2 OF 6" (Plex Mono 500, 28u, y 62). TRUTH:
  ink bar 3 × 22 above numeral 2 with "TRUTH" (14u). YOU: red-pencil ring (r 13) round numeral g with
  "YOU" (14u) above; if g = 2 the ring and bar share the numeral; if null, "NO ANSWER" (14u) at x 640.
  The chip at top right opens to "YOUR GUESS · 5".
- **52.6–54.4 HIGHER column** fills row by row (0.3 s apart): WOMEN, WOMEN, MEN, WOMEN, MEN, WOMEN; the
  C and E ledger rows get a red-pencil underline.
- **56.0–56.6 mix.** A pencil bracket (1.5u) at x 86 from y 120 to 255.5 spans bands A and B; marks in
  bands C–F dim to 45 % opacity. Headers return to full opacity: line 1 "1,385 / 2,691", "133 / 1,835";
  line 2 "APPLIED TO A OR B".
- **58.5–59.1** line 1 crossfades to "51 %" and "7 %" (44u); line 2 "1,385 ÷ 2,691", "133 ÷ 1,835".
- **59.1–62.0** hold (this is the picture to remember: half the men in the easy bands, almost no women).

### Purity
render(t, state) recomputes every mark position from t (no stored tweens). Inputs: t, state.guess.
Seeded permutations computed once at load (pure). No Math.random/Date/performance in the renderer.
Hidden pooled SVG elements clear `style` and text.

## Live-page extras (not on stage)
Transcript = the 14 captions. Honest limits block (≥ 16px): six departments of one year; campus-wide the
gap was 44 % vs 35 % of 8,442 men and 4,321 women [campus*]; the split explains this gap and does not
prove fairness. Try-it (optional): "women at the men's mix" slider ending at 52 % vs 45 % [stdWomen].
