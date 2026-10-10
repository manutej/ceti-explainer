# channels — one plan, six channels

`CHANNELS.md` is the design; this folder is the compiler. A film plan is never edited: every channel reads the
compiled timeline, picks beats by class, re-times them, renders frames of the **same page re-laid at the channel's
aspect**, and sets its own text layers in the brand faces. Numbers come from the film and are checked against it.

```
python3 channels/channels.py films/base-rate/plan.json --channel all --workers 2          # everything (~25 min on 2 CPUs)
python3 channels/channels.py films/base-rate/plan.json --channel reel                      # one channel (others' QA is kept)
python3 channels/channels.py films/base-rate/plan.json --channel all --no-video            # stills, slides, PDF, blog, newsletter (~1 min)
python3 channels/channels.py films/base-rate/plan.json --channel linkedin-video --workers 2   # the 52 s 4:5 cut (~15 min)
python3 core/build_plan.py films/base-rate/plan.json --aspect 9x16 [--bare head,foot,chip]  # any plan at any aspect
node channels/timeline.mjs films/base-rate/plan.json                                       # beats, frame bank, number set
```
Inputs: the plan, the writer's `copy.json` beside it (a skeleton is written on the first run), the module registry.
Output: `<plan dir>/channels/` (default) — renders are cached in `_work/` and invalidated when a page changes.

## Files

| file | does |
|---|---|
| `channels.py` | the compiler: pages per aspect, frame bank, EDLs, assembly, QA, `frames.json`, `qa.json` |
| `timeline.mjs` | `Film.compile` in node → phases tagged with beat classes (CHANNELS §2), frame-bank times (§4.1), the film's number set (Q6), the layout tables |
| `compose.py` | text layers in Fraunces / DM Sans / Space Mono (the film's own woff2) rendered by Chromium: caption plate, hook, end card, slide, document page, OG card, cover; every type box is measured for QA |
| `qa.py` | in-page probe of every visible SVG `<text>` (box + rendered size) → Q3 safe zones, Q8 type floor; Q6 numbers, Q10 honesty |
| `../core/layout.js` | the region tables per aspect (§3.1, reconciled below) and the portrait grid plan; every module reads `ctx.lay` |

## What each adapter does

| channel | aspect | frames | text | output |
|---|---|---|---|---|
| **reel** | 9:16 1080×1920 | EDL over film time: cold open = the counted gap (frozen, no chrome) → the city → the question → the common answer → wrong model (×1.4) → break → the count (compressed to ~6.6 s, the longest beat) → the gap → the name → the land (×1.3) → 1 s end card. Contrast and recap dropped (§2.2). 4-frame dissolves at cuts. | one-line hook in the head band; burned captions (DM Sans 500, 36 u, paper plate + hairline) in the caption band x 204–756 u, y 998–1106 u; end card with the aha, the honesty line, one CTA | `reel.9x16.mp4` (H.264 CRF 18, yuv420p, faststart, silent AAC), `reel.cover.png` (hook + claim, survives the 3:4 and 1:1 crops), `reel.srt`, `post.txt` (hook line + caption + honesty + 5 hashtags), `stills/` |
| **carousel** | 4:5 1080×1350 | frame-bank stills of the **bare** page (module heads, foot lines and chips hidden): question · po.first · wrong · break · count · gap · contrast · named · land | kicker (mono 28 u) + headline (Fraunces 50 u, ≤ 9 words) in the head zone; body (DM Sans 32 u, ≤ 25 words), source tag, swipe cue (slides 1–3), counter in the foot zone; aha slide carries the honesty line; last slide = CTA + the mark | `slide-01…09.png`, `post.txt` |
| **linkedin-pdf** | 4:5 pages | cover (headline 84 u + the counted gap) · the setup · 7 beat pages (bodies ≤ 45 words) · the arithmetic · where this stops · sources + URL spelled out | same faces; text-only pages for setup/arithmetic/honesty/sources | `document.pdf` (12 pages, img2pdf), `pages/`, `post.txt` (2-line hook < 140 chars) |
| **linkedin-video** | 4:5 (the PO is a tall grid, §2.3) | text-first claim (H4) 3 s → city → witness → question + pause → wrong model → break → count → gap → name → contrast (compressed ×1.85) → 4 s end card | burned captions at the 4:5 band + `.srt` | `video.4x5.mp4` (~52 s), `video.srt`, `cover.png`, `post.txt` |
| **blog** | 16:9 1920×1080 | 6 stills at the beats they illustrate | `post.md` from `copy.json` in the plan's beat order (≈ 970 words), "Where this stops", the retrieval question with the answer folded, sources | `post.md`, `stills/`, `embed.html` (the interactive film), `og.png` 1200×630 |
| **newsletter** | 600 px email | two 4:5 figure crops (2×), the count GIF from the 1:1 page | ≈ 255 words, the number in bold, one honesty sentence, the link; alt text states the number | `email.html` (inline styles, no JS, no `<style>`, no pure white/black, < 102 KB), `email.txt`, `subject.txt`, `count.gif` (600×600, 10 fps, ≤ 6 s, frame 1 = the landed count), `email.screenshot.png` |

Every run writes `frames.json` (the frame bank: name, t, aspect, variant, path) and `qa.json`.

## Round 2: designed scenes from figure states (`scenes.py`)

The reel, the carousel and the LinkedIn PDF are no longer re-cropped film frames. Each scene sets a **figure
state**, a crop of the film rendered at 2–3 px/u with no paper grid (`build_plan.py --scale --nogrid --bare`) and
darkened onto the scene's own paper, at full size inside the channel's safe box, with designed type around it:
- **reel** (23.6 s, 9 beats, each a different state): cold open on the reveal numeral, the city, the witness tests,
  the trusted 80 %, the ignored city, the ringed 290, the count (with a 250-px 41%), the two stacked cities, then
  the end card. Reel safe box x 48–880, y 120–1150 px; the headline is at y≈140 (80–92 px serif).
- **carousel** (7 slides): the reveal (a 330-px 41% + its axis), the city, the common answer plus what it
  ignored, the count (the 290 block set large over a 30 % ghost of the city), one "Blue" with two sources (the
  denominator), the two cities, and the CTA with the brand.
- **linkedin-pdf** (10 pages): the same scenes with longer bodies, plus the setup, arithmetic, honesty and
  sources/CTA pages. **newsletter**: three different figures (the city, the count GIF, the two cities).

Compiler rules (`qa.py`, enforced on every topic; a violation fails the channel):
(a) each frame's declared dominant element covers ≥ 35 % of the SAFE area · (b) no repeated figure state in a
sequence (dHash 16×16 of the figure region, Hamming ≤ 12/256) · (c) type minimums at native px: headline ≥ 72,
body ≥ 36, labels ≥ 28 (film labels inside crops are measured after scaling), key numeral ≥ 200 · (d) the brand
line "CETI.AI · enterprise AI training" appears once per carousel / PDF / reel. All posts lead with the gap.

## Aspect re-layout (CHANNELS §3) — what changed in the engine

- `core/layout.js`: region tables for 16:9 · 1:1 · 4:5 · 9:16; `gridPlan` re-aspects the unit-mark grid to 25×40
  in a left column and gives modules a right column (RC ≥ 420 u); `gridSide` fits a grid in a stacked half.
- `compile.js`: `Film.compile(plan, {aspect})`; viewBox 960 × vh; the PO is re-laid; every ctx carries `ctx.lay`
  and a LibKit for it. A module that declares `aspects(P, po)` composes itself; any other is **fit** (its 16:9
  content box scaled uniformly into the figure region, head still laid out by the core) and listed in `qa.json`.
- `scene-kit.js`: head / foot / chip / rings per layout; `K.fitLine` (mono → sans → two lines, never below the floor).
- Modules: mass-reseat (condition: wide / column / side modes), trap-and-correct (card top of RC, meter at its
  foot, ring on the PO's bounds), commit-predict-reveal (card in RC, two label rows), contrast-split (halves
  **stack**; each inner laid out natively in its half via a sub-layout and `PO.refit`, so no label is scaled below
  the floor), ladder-build and recap-retrieve (grid figures).
- `build_plan.py --aspect --bare`; `?aspect=` and `?bare=` work on any built page. **16:9 is frame-identical** to
  the pre-layout build (13 stills compared pixel for pixel).

## Reconciled numbers (CHANNELS.md `[verify]` → research/CHANNEL-SPECS.md)

| item | CHANNELS.md | now | why |
|---|---|---|---|
| Reel safe zone | top 222 u, bottom 338 u, right 98 u, left 32 u | top 240 u (270 px), bottom from y 1111 u (35 %, 670 px), sides 58 u (65 px), right rail x > 756 u for y > 1024 u | CHANNEL-SPECS §2 (Meta-derived px); its derived rule "all essential text + CTA inside y 270–1250 px" |
| 9:16 regions | head 260–460, figure 490–1130, caption 1230–1340 | head 248–350, figure 350–930, foot 976, caption 998–1106 (x 204–756) | the caption band of the old table sat in the new bottom zone |
| Reel cover crop | 4:5 / ~3:4 | profile grid is 3:4 (since Jan 2025): cover payoff inside y 213–1493 u; 1:1 crop y 373–1333 u | CHANNEL-SPECS §2 |
| Carousel max | 20 slides | 20 slides, 30 MB/image | confirmed [S] |
| LinkedIn document | 100 MB, 300 pages | same; 8–12 pages target; hook < 140 chars before "see more" | CHANNEL-SPECS §3 |
| LinkedIn video | 45–75 s, 1:1 or 4:5 | same window (30–90 s best per Kapwing [S]); 3 s – 10 min, 75 KB – 5 GB | CHANNEL-SPECS §3 |
| Email GIF | ≤ 1.5 MB, ≤ 6 s, ≤ 12 fps | target ≤ 1 MB, hard 1.5 MB; 600 px; frame 1 complete (Outlook); HTML < 102 KB | CHANNEL-SPECS §4 (Litmus / Gmail clip) |
| Newsletter stills | 1200×675 16:9 | 4:5 figure crops at 2× (1072 px) | 16:9 type renders at ~5 CSS px in a 600-px email; the 4:5 re-layout reads |
| Type floor | 26 u eyebrow/foot at 1:1–4:5 | **28 u everywhere** (= 11.4 CSS px on a 390-px phone) | Q8's own rule (≥ 11 CSS px): 26 u is 10.6 px |
| 4:5 head | y 88–240 | eyebrow 104, title 176, figure from 240 | two-line slide headlines need the room |
| LinkedIn link preview | — | OG 1200×630, text in the centre, survives 1200×627 | CHANNEL-SPECS §5 |

Still to re-verify before a client launch (CHANNEL-SPECS §7): Meta first-party Reels safe zones, LinkedIn's
newsletter cover size, 3:4 carousel uploads, the reel length cap for the account.

## Not done / known limits

- Portrait compositions exist for the **grid** figures (the base-rate film). The track (mass-reseat renormalize),
  axis and chain figures (ladder-build, recap-retrieve demos) are **fit** at portrait: correct but their labels
  scale below the floor — `qa.json` lists fit modules. The second topic ("Type-safe AI": rotate the fan, fold the
  chain) is the next proof (CHANNELS §6.4 step 7).
- Interaction substitutes (§2.6: ghost sweep, 3-row strip) are not generated; the contrast pair carries the slider's point.
- Label reflow uses per-module placements, not the general placement-preference/collision solver of §3.2.
- Q1/Q2/Q4/Q5/Q7/Q9 need people and phones: `qa.json → eyes_on_checklist`.
- Hosted URLs: `embed.html` and the email images are local files; upload them and point `copy.json → url` at the host.
