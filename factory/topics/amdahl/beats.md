# amdahl · beat sheet (75 s = 72 s of material + 3 s CETI brand card)

Stage 960 × 540 design units. Mono face (IBM Plex Mono 500) for every number; display face (Big Shoulders
Display 600) for the hook claim and the Monday question. Paper ground, ink marks, one accent (red pencil)
for the drafting step and the IBM work sliver. Caption band: y 478 to 526, 28 units, centred, never
overlapped by material. Every digit on screen is a claim id in claims.json (named in brackets below).

## The four structures (the whole film uses exactly these)
1. **THE ROW** — 100 hour-marks in one line, left = request in, right = done. HOOK, COMMIT (backdrop),
   COUNT, MONDAY. One retained SVG group of 100 rects + labels.
2. **THE COMMIT BOX** — one input box with a countdown. COMMIT only.
3. **THE IBM STRIP** — 7 working days at true scale with the 90-minute work sliver, and the 4-hour
   after-strip beneath it. CASE only.
4. **THE BRAND CARD** — plain CETI card, 72 to 75 s.

## Geometry of THE ROW (shared by every beat that uses it)
- Hour h maps to x(h) = 60 + 8.4·h (hour 0 at x 60, hour 100 at x 900). Mark i (i = 0..99) is a rect
  x = x(i) + 1.2, width 6.0, y 200 to 290 (height 90), fill ink. No gaps between steps.
- Steps (hours, mark indices): intake 4 [0–3] · queue 12 [4–15] · check 6 [16–21] · queue 10 [22–31] ·
  drafting 30 [32–61] · queue 14 [62–75] · review 6 [76–81] · queue 10 [82–91] · sign-off 3 [92–94] ·
  send 5 [95–99]. Step boundaries: a 1-unit hairline tick above the row, y 188 to 196, at x(4), x(16),
  x(22), x(32), x(62), x(76), x(82), x(92), x(95). Queue steps are drawn at 55 % ink, work steps at 100 %
  ink, so the four queues read as lighter bands without any label.
- Chrome labels (14 units mono, 60 % ink): "REQUEST IN" left-aligned at (60, 312); "DONE" right-aligned at
  (900, 312). No step names except drafting.
- Counter (top right): right-aligned at (900, 168), 28 units mono, e.g. "100 HOURS".

## Beat 1 · HOOK (0.0 to 8.0 s)
- 0.0–0.3 paper only.
- 0.3–1.5 the row draws in left to right: mark i fades in over 0.25 s starting at 0.3 + 0.009·i.
- 0.6 claim line, display 44 units, centred at (480, 110): "“AI will make this 10× faster.”" [claim10x].
  A thin bracket (1 unit) spans x 60 to 900 at y 176 to 182 under the claim: "this" = the whole row.
- 4.0 counter "100 HOURS" [totalHours] fades in; tick hairlines fade in; REQUEST IN / DONE chrome.
- Captions:
  - C1 0.6–3.8 "“AI will make this 10× faster.”" [claim10x]
  - C2 4.0–7.8 "A 10-step process: 100 hours from request to done." [steps, totalHours]

## Beat 2 · COMMIT (8.0 to 16.0 s)
- 8.2–9.0 drafting marks 32–61 turn accent (colour tween 0.8 s). Label under them, 28 units mono, centred
  at x(47) = 454.8, y 330: "DRAFTING · 30 HOURS" [draftHours]. The claim line dims to 40 %.
- 8.6 commit box (structure 2) appears: rect x 270 to 690, y 352 to 462, 1.5-unit ink border, paper fill.
  Line 1 (16 units mono, chrome): "THE WHOLE PROCESS GETS". Line 2 (40 units mono, at y 428):
  "[ ____ ] × FASTER". Countdown at the box's top-right corner (28 units mono): digit = ceil(16.0 − t),
  shown only in film mode, clamped 1..8 [commitHold].
- Live page: the clock pauses at t = 8.6 and page.js runs the 8-second hold (input focused, own
  countdown in the page chrome, not in the renderer). On submit or timeout the clock resumes from 8.6 with
  state.guess = number or null ("no answer"). Nothing derived from the guess is drawn before 54.0 s.
- Film mode: default guess 4 [defaultGuess] types into the box at 14.0 (one character), box border goes
  double at 15.2 ("sealed"); the guess text itself stays visible until 16.0.
- 15.8–16.0 box and row fade out (opacity to 0 over 0.2 s; row is retained, not destroyed).
- Commit prompt (box + captions): "Drafting is 30 of the 100 hours. AI makes it 10× faster. How much
  faster is the whole process?" Default: **4×**. Truth: **1.37×**.
- Captions:
  - C3 8.2–11.8 "AI takes drafting: 30 of the 100 hours, made 10× faster." [draftHours, totalHours, claim10x]
  - C4 12.0–15.8 "How much faster is the whole process? Type a number." (no digits)

## Beat 3 · THE CASE (16.0 to 36.0 s) · IBM Credit
- Scale: 840 units = 7 working days × 8 hours = 56 h, so 15 units per hour (declared conservative scale).
- 16.3–17.4 strip draws: 7 day-blocks, each x 60 + 120·d to 60 + 120·(d+1) − 2, y 220 to 290, filled with
  a 45° pencil hatch at 30 % ink (canvas texture), drawn in order d = 0..6, 0.15 s apart. End label
  right-aligned at (900, 206), 28 units mono: "7 DAYS" [ibmDays]. Chrome under the strip at (60, 312),
  14 units: "ONE FINANCING REQUEST · 5 DESKS" [ibmDesks].
- Source chrome, 14 units mono, 60 % ink, at (60, 456): "HAMMER & CHAMPY 1993 · DAVENPORT & NOHRIA 1994"
  [hcYear, dnYear]. Holds to 36.0.
- 22.0–22.8 work sliver: accent rect x 60 to 82.5 (22.5 units [ibmSliverUnits]), y 220 to 290, drawn
  over the hatch, grows from width 0. Label 28 units mono, left-aligned at (60, 206): "90 MINUTES OF
  WORK" [ibmWork] (the "7 DAYS" label sits right, so no collision). The sliver is all the work added up,
  gathered at the start; say so in the transcript, not on stage.
- 28.0 label centred over the hatch at (491, 262), 28 units mono, paper-backed: "WAITING BETWEEN DESKS".
- 29.5–30.5 "instant work": the sliver shrinks to width 0 and the strip's right end slides left by 22.5
  units (to x 877.5). Label at (877.5, 330), right-aligned, 28 units: "−90 MIN" [ibmInstantSaving]. The
  "7 DAYS" label does not change.
- 32.0–33.0 after-strip: solid ink rect x 60 to 120 (60 units [ibmAfterUnits]), y 360 to 400, grows from
  0. Label right of it at (132, 390), 28 units mono: "4 HOURS · ONE PERSON, NO HANDOFFS" [ibmAfter].
- 35.6–36.0 strip structure fades out.
- Captions:
  - C5 16.3–21.8 "IBM Credit: a financing quote took 7 days, across 5 desks." [ibmDays, ibmDesks]
  - C6 22.0–27.8 "Two managers walked one through. The work took 90 minutes." [ibmWork]
  - C7 28.0–31.8 "The rest was waiting. Instant work would save 90 minutes." [ibmInstantSaving]
  - C8 32.0–35.8 "IBM cut the handoffs instead: 7 days became 4 hours." [ibmDays, ibmAfter]

## Beat 4 · THE COUNT (36.0 to 62.0 s) · frame by frame
State per frame is a pure function of t and state.guess. Easing: easeInOutCubic for slides; linear for
tallies. Every counter value is floor() of a linear ramp, so re-seeking gives identical digits.

1. **36.0–37.0 row returns.** Row group opacity 0 → 1. All 100 marks at 25 % ink (untallied), drafting
   marks already accent at 25 % strength. Counter reads "0 HOURS".
2. **37.4–41.4 the tally.** n(t) = floor(100 · clamp((t − 37.4) / 4.0, 0, 1)). Marks 0..n−1 are at full
   ink (queues 55 %, work 100 %, drafting accent). Counter "n HOURS" [totalHours, running]. A 1-unit
   vertical pencil line at x(n), y 192 to 298, visible only while 0 < n < 100. At 41.4: "100 HOURS".
3. **42.0–43.0 drafting lifts.** Drafting marks 32–61 pulse once (stroke 1 unit accent, 0.4 s on, off).
   Label "30 → 3" [draftHours, draftAfter], 28 units mono, centred at x(47), y 330.
4. **43.0–45.2 27 marks leave.** Marks k = 35..61 (the last 27 of drafting) each animate over 0.8 s
   starting at 43.0 + 0.05·(k − 35): translate y 0 → −40 and opacity 1 → 0. Marks 32, 33, 34 stay. Removed
   count r(t) = number of k with t ≥ 43.0 + 0.05·(k − 35) + 0.4. Counter "(100 − r) HOURS" (ends "73
   HOURS" [newTotal] at about 44.7). Removed marks are hidden at the end (style and text cleared).
5. **45.2–46.6 the row closes up.** Marks 62–99 translate x by −226.8 units (27 × 8.4), eased. "DONE"
   chrome slides with mark 99 to right edge x(73) = 673.2. The "30 → 3" label slides to centre x(33.5) =
   341.4. A dashed outline rect (0.75 unit, 35 % ink) stays at x 673.2 to 900, y 200 to 290, labelled
   at (900, 312), right-aligned, 14 units: "WAS 100" [totalHours].
6. **48.0–48.4 untouched brackets.** Two 1-unit brackets under the row at y 296: x(0) to x(32) and x(35)
   to x(73) (post-shift positions).
7. **48.4–51.4 second tally, untouched only.** u(t) = floor(70 · clamp((t − 48.4) / 3.0, 0, 1)). Walk the
   post-shift positions 0..72 skipping 32, 33, 34; the first u of them get a 1-unit paper-white top notch
   (y 200 to 204) as they are counted. Label at (480, 352), 28 units mono: "UNTOUCHED u" [untouched,
   running]; ends "UNTOUCHED 70".
8. **52.0 done rule.** Vertical 1.5-unit ink rule at x(73) = 673.2, y 180 to 300. Label above at (673.2,
   168), centred... the counter already says "73 HOURS"; move the counter to sit on this rule: counter
   text becomes "DONE · HOUR 73" [newTotal], 28 units, right-aligned at (900, 168) → keep at (900, 168) to
   avoid collision with the ratio; the rule itself carries no text.
9. **54.0–55.0 the commit placed (pins on the same row).** Pins are 1-unit vertical lines y 180 to 380 with
   a label below at y 404 (28 units mono) and a 14-unit chrome word above the label at y 382:
   - PROMISE pin at x(10) = 144 [promiseHour]: chrome "PROMISE", label "10× · HOUR 10" [claim10x].
   - YOU pin at x(clamp(100 ÷ g, 1, 100)) with g = state.guess (film default 4 → x(25) = 270 [guessHour,
     defaultGuess]): chrome "YOU", label "g× · HOUR round(100 ÷ g)". Accent ink.
   - TRUTH: the done rule at x(73) gets chrome "TRUE" and label "1.37× · HOUR 73" [speedup, newTotal].
   - Collision rule: if |x_you − x_promise| < 120 or |x_you − x_true| < 120, drop the YOU label to y 440
     and its chrome to y 420 (the pin extends to y 418). If g ≤ 1, pin at x(100) with label "g× · NO
     GAIN". If guess is null, draw no YOU pin and set chrome "NO ANSWER" at (60, 382).
   - If |g − 1.37| ≤ 0.05, the YOU label adds "· ON IT" (no extra digits).
10. **55.0 the ratio (first ratio in the film).** Centred at (480, 110), 40 units mono:
    "100 ÷ 73 = 1.37×" [totalHours, newTotal, speedup]. The UNTOUCHED label fades to 50 %.
11. **58.2–59.0 instant drafting.** Marks 32, 33, 34 lift and fade like step 4 (0.05 s stagger). Counter
    becomes "DONE · HOUR 70" [untouched] when the last is half gone.
12. **59.0–59.8 close up again.** Post-shift marks 35–72 translate x by a further −25.2 (3 × 8.4). The done
    rule and the TRUE pin slide to x(70) = 648; TRUE label becomes "1.43× · HOUR 70" [ceiling, untouched].
    The "30 → 3" label becomes "30 → 0" (no new digit claim needed beyond draftHours; the 0 is the
    infinite case) — builder may instead fade the label out to avoid an unclaimed "0".
13. **59.8 ceiling ratio.** Ratio text cross-fades (0.3 s) to "100 ÷ 70 = 1.43×" [ceiling]; chrome under
    it, 14 units, centred at (480, 134): "THE CEILING · AMDAHL, 1967" [amdahlYear].
14. **61.8–62.0 hold.**
- Captions:
  - C9  36.3–41.8 "Back to our process: 100 hours, one mark per hour." [totalHours]
  - C10 42.0–47.8 "AI makes drafting 10× faster: 30 hours become 3." [claim10x, draftHours, draftAfter]
  - C11 48.0–53.8 "70 hours untouched. The whole process now takes 73." [untouched, newTotal]
  - C12 54.0–57.8 "100 ÷ 73 = 1.37× faster. Not 10×." [speedup, claim10x]
  - C13 58.0–61.8 "Even instant drafting caps it at 100 ÷ 70 = 1.43×." [ceiling, untouched]

## Beat 5 · MONDAY (62.0 to 72.0 s)
- 62.0–62.6 the ratio, pins and labels fade out; the row (ceiling state, 70 marks) dims to 35 % and stays
  as the ground. Counter fades.
- 62.3 Monday question, display 36 units, two lines centred at (480, 92) and (480, 134):
  "Of every 100 hours it takes," / "how many does the AI touch?" [totalHours].
- 64.0 line, 28 units mono, centred at (480, 350): "Half the hours? Never more than 2×." [half, halfCap]
- 67.0 honest-limits lines, 28 units mono (must-read size), centred at (480, 400) and (480, 436):
  "A teaching model, not IBM's numbers." / "Faster work can also shift the queues."
- 72.0 last frame of material holds as the card fades up.
- Captions:
  - C14 62.3–71.8 "Monday: of every 100 hours, how many does AI touch?" [totalHours]

## Brand card (72.0 to 75.0 s)
- 72.0–72.4 plain paper card fades over everything (structure 4). "CETI" wordmark line, Big Shoulders 600,
  48 units, centred at (480, 236). Takeaway, 28 units mono, centred at (480, 300):
  "The hours you don't speed up set the limit." No digits, no caption.

## Caption list (14, each ≤ 60 characters)
| # | in–out (s) | text | chars |
|---|------------|------|------:|
| 1 | 0.6–3.8 | “AI will make this 10× faster.” | 31 |
| 2 | 4.0–7.8 | A 10-step process: 100 hours from request to done. | 50 |
| 3 | 8.2–11.8 | AI takes drafting: 30 of the 100 hours, made 10× faster. | 56 |
| 4 | 12.0–15.8 | How much faster is the whole process? Type a number. | 52 |
| 5 | 16.3–21.8 | IBM Credit: a financing quote took 7 days, across 5 desks. | 58 |
| 6 | 22.0–27.8 | Two managers walked one through. The work took 90 minutes. | 58 |
| 7 | 28.0–31.8 | The rest was waiting. Instant work would save 90 minutes. | 57 |
| 8 | 32.0–35.8 | IBM cut the handoffs instead: 7 days became 4 hours. | 52 |
| 9 | 36.3–41.8 | Back to our process: 100 hours, one mark per hour. | 50 |
| 10 | 42.0–47.8 | AI makes drafting 10× faster: 30 hours become 3. | 48 |
| 11 | 48.0–53.8 | 70 hours untouched. The whole process now takes 73. | 51 |
| 12 | 54.0–57.8 | 100 ÷ 73 = 1.37× faster. Not 10×. | 33 |
| 13 | 58.0–61.8 | Even instant drafting caps it at 100 ÷ 70 = 1.43×. | 50 |
| 14 | 62.3–71.8 | Monday: of every 100 hours, how many does AI touch? | 51 |

## Live page extras (not in the film)
- Try-it panel: two sliders, "hours the AI touches (of 100)" 0–100 and "how much faster" 1–100 plus
  "instant"; shows the row with the same shrink and "100 ÷ new total = speed-up". Presets: 30 at 10×
  (1.37×), 50 at instant (2×) [halfCap], 80 at 10× (28 hours, 3.57×) [p80hours, p80total, p80s10]. The
  viewer's sealed guess is shown beside the 30-at-10× preset.
- Transcript, sources (all six from brief.md), honest-limits block (model is constructed; IBM figures are
  the authors' account; the work sliver is drawn on 8-hour days; Gustafson's counterpoint).
