# CHANNELS — one structure, many channels

**Version:** 1.0 (2026-10-08). Sits beside `METHOD.md` (laws), `MODULE-OPERAD.md` (catalogue) and `BUILD-SPEC.md`
(engine). A film is a plan of module instances on one clock, drawn at 960×540 in CETI dark or Field Notebook chrome.
This file says how *that same plan* ships as an Instagram reel, an Instagram carousel, a LinkedIn document
carousel, a LinkedIn feed video, a blog post and a newsletter, each at the right frame, duration and hook, and each
showing the visualization at the quality that sells the training and consulting.

Platform numbers are marked `[verify]` where `research/CHANNEL-SPECS.md` did not exist at writing time; check them
against the platform's current help pages before a client build. Everything in viewBox units ("u") is at the
960-wide basis unless stated; export multiplies by 1.125 for 1080-px-wide deliverables and 2.0 for 1920-px film.

---

## 1. The core idea: the structure is invariant, the channel is a functor on it

The plan (`film.plan.json`) is the structure. A channel never edits it; it *reads* it and emits a channel plan.

| Invariant (lives in `film.plan.json`) | Varies per channel (lives in `channels/<id>.json`, applied by the compiler) |
|---|---|
| `aha` (one line), `misconception` {text, runnable} | **aspect** and canvas (9:16 · 4:5 · 1:1 · 16:9 · 600-px email) |
| `type` {primary, secondary}, `archetype` | **duration** budget and the beat *filter* and *order* (hook position) |
| the module chain and each module's phases, `payoff`, `numbers`, `honesty` | **text density**: words per frame, caption on/off, label size floor |
| the persistent object `po` and its anchors; the role table `roles` | **caption handling**: burned · sidecar `.srt` · none · prose |
| the single `example` record and every canonical number fn (L7) | **interaction → static substitute** (a slider becomes a 3-row strip, a commit becomes a sticker/poll) |
| the brand bookends, the colophon and the sources `[Sn]` | **CTA** (what the last frame asks: follow · swipe · save · comment · read · book) |
| the honesty items (every channel must carry at least the top item) | **hook formula** (which beat opens and in what words) |

Three consequences:
1. **Every number on every channel is the same number**, because every channel calls the same `numbers` fns on the
   same `example` record. A carousel slide that says 41 % and a reel that says 41 % cannot drift (L7 extends across
   channels).
2. **Every channel keeps the persistent object.** A viewer who sees the carousel on Monday and the reel on Thursday
   sees the same 1,000 cab dots. Recognition across channels is the brand.
3. **Every channel is a *projection* of the plan, not a new design.** If a channel needs a beat the plan lacks, the
   plan is wrong, not the channel. Fix the plan; every channel inherits the fix.

What the compiler is allowed to do to a beat: keep · drop · reorder · compress (shorten a phase, never below the
module's declared minimum) · freeze (take one frame as a still) · substitute (interaction → static) · re-lay out
(§3). What it may never do: invent a number, name the principle before the payoff (L5 holds in every cut, including
a 20 s reel), show the wrong model as the last image (trap law), or drop the honesty item that the plan stages as a run.

---

## 2. Channel adapters

Common vocabulary for the beat filter. Every module phase is tagged by the compiler with one **beat class** from its
phase ids: `hook` (bookend question, trap `steelman`, CPR `ask`) · `commit` (CPR `commit`) · `wrong` (trap
`run-wrong`) · `break` (trap `break`) · `build` (ladder rungs, worked ex1, structure phases) · `count` (payoff phases
of mass-reseat, population-sim, compound-chain, feedback-loop) · `contrast` (contrast-split) · `name` (every `name`
phase) · `honesty` · `recap` · `land`. Adapters are written over beat classes, so one adapter works for every
archetype.

### 2.1 Canvas and safe-zone table

| Channel | Aspect | Export px | viewBox (u) | Platform safe zone (keep all type and payoff marks inside) | Notes |
|---|---|---|---|---|---|
| IG reel | 9:16 | 1080×1920 | 960×1707 | top 222 u (username, audio), bottom 338 u (caption, CTA), right 98 u (like/comment/share rail), left 32 u `[verify]` | cover frame is also shown 4:5 in feed and ~3:4 in the profile grid `[verify]`: the payoff must sit in the central 960×1200 |
| IG carousel | 4:5 | 1080×1350 | 960×1200 | 48 u all sides; bottom 96 u for the dot indicator `[verify]` | up to 20 slides `[verify]`; slide 1 is also cropped 1:1 / 3:4 in grids: centre 960×960 carries the hook |
| LinkedIn document | 4:5 PDF (1:1 also fine) | 1080×1350 per page | 960×1200 | 64 u all sides; the viewer shows pages small in feed, so the type floor is the 4:5 phone floor (§3.4) | PDF ≤ 100 MB, ≤ 300 pages `[verify]`; links in the PDF are not clickable in the feed viewer `[verify]`: the CTA is in the post text |
| LinkedIn feed video | 1:1 or 4:5 | 1080×1080 / 1080×1350 | 960×960 / 960×1200 | 48 u all sides; bottom 120 u for the player scrubber on hover `[verify]` | autoplays muted; 3 s – 10 min, we target 45–75 s `[verify]`; `.srt` sidecar supported, burn captions anyway |
| Blog | 16:9 | 1920×1080 stills + the live page | 960×540 | none; the page is the film | the interactive embed is the hero; stills are the index |
| Newsletter | 16:9 (stills) or 1:1 (GIF) | 1200×675 stills, 600×600 GIF | 960×540 / 960×960 | email width 600 CSS px; GIF ≤ 1.5 MB, ≤ 6 s loop, ≤ 12 fps `[verify]` | images are blocked by default in some clients: alt text carries the number |

### 2.2 Beat survival and order per channel

`●` keep · `◐` compress · `○` drop · `■` still (freeze a frame) · `↑` moved to the open.

| Beat class | IG reel (20–35 s) | IG carousel (6–10 slides) | LinkedIn doc (8–12 pages) | LinkedIn video (45–75 s) | Blog (full) | Newsletter |
|---|---|---|---|---|---|---|
| `hook` | ◐ 1.5 s, after the cold open | ■ slide 1 | ■ page 1 (cover) + page 2 (the setup) | ● 3 s, text-first | ● | ● first line |
| the PO (its first full frame) | ● 2 s | ■ slide 2 | ■ page 3 | ● | ■ hero still | ■ still 1 |
| `commit` | ◐ 2 s "guess" card, no countdown | ■ slide 3 asks; the answer is behind the swipe | ■ page 4, same | ◐ 3 s "pause and guess" | ● live input | ○ (ask in prose, answer after a line break) |
| `wrong` | ◐ 3 s | ■ slide 4 (ghost, role `error`) | ■ page 5 | ◐ 5 s | ● | ○ |
| `break` | **↑ cold open 0–1.5 s**, then ● 3 s in place | ■ slide 5 | ■ page 6 | ● 5 s | ● | ■ still 2 (the before/after pair as one image) |
| `count` | ● 6–9 s, the longest beat | ■ slide 6, the counted frame with the number large | ■ page 7 + a page of the arithmetic | ● 10–14 s | ● | ■ still 3 or the GIF |
| `contrast` | ○ (or ◐ 4 s if it *is* the aha) | ■ one slide, both halves stacked | ■ one page | ◐ 8 s | ● | ○ |
| `name` | ● 2 s, last teaching frame | ■ on the aha slide | ■ on the aha page | ● 3 s | ● | ● the bold line |
| `honesty` | ◐ one burned line under the aha | ■ one line on the aha slide | ■ its own page | ◐ one burned line | ● | ◐ one sentence |
| `recap` | ○ | ○ (the swipe-back *is* the recap) | ■ optional "the three frames" page | ○ | ● | ○ |
| `land` + CTA | ● 3 s | ■ last slide | ■ last page | ● 4 s | ● | ● the link |

**The ordering rule.** Film order is *gap → commit → wrong → break → right → name*. The reel and the LinkedIn video
move the *break* (or the counted payoff) to t = 0, then rewind to the question. Carousels keep film order because the
swipe is the commit: the viewer cannot see slide 5 without passing slide 3. Blog and newsletter keep film order
because text can afford a setup. L5 (name it last) survives the reorder: the cold open shows the *break* (the
counted number, the gap bracket), never the principle's name.

### 2.3 Per-channel timing and text rules

**IG reel.** 20–35 s target; 45 s hard cap for a compressed film; 60–90 s only for a "full reel" of a film whose
archetype is A8 (the viewer is the subject). 0–1.5 s: cold open on the break frame, no chrome, no eyebrow. 1.5–4 s:
the question (one line, ≤ 9 words). Then the film's own order, compressed by the phase minimums
(cue ≥ 0.4 s, morph ≥ 0.9 s, hold ≥ 1.0 s, count ≥ 3 s). Burned captions always (muted autoplay). One number per 3 s
at most. The CTA is one word on the last frame plus the caption text of the post. Brand bookend ≤ 1 s at the end,
never at the start (the start is the hook).

**IG carousel.** 6–10 slides. One beat per slide, one new thing per slide (L3 at slide granularity). Slide text ≤ 25
words; the figure takes ≥ 60 % of the slide. Slide 1: question or claim in the hook formula; slide 2: the PO alone
with its count label; slides 3–7: the beats; the last-but-one: the aha named + the honesty line; last: CTA (save ·
share · the link in bio) with the PO small as a signature. A "swipe" chevron on slides 1–3 only. The number that pays
off is set at the 4:5 display size (§3.4) and never split across slides.

**LinkedIn document carousel.** Same slide map as the IG carousel with these changes: a cover page (title + the
question + "CETI Explainers" eyebrow), text ≤ 45 words per page, one page for the arithmetic (the `numbers` fn shown
as the foot line it already is), one page for honesty, a sources page with the `[Sn]` list, and the last page as CTA
with the URL *spelled out* (not a link). 8–12 pages. Page 1 must read when 320 px wide: the headline at ≥ 72 u.

**LinkedIn feed video.** 45–75 s, 1:1 by default (4:5 when the PO is tall: grids, stacks, vertical timelines). Opens
text-first: the claim as a burned headline over the PO for 3 s, then the question. Keeps `wrong → break → count → name`
in full; compresses the rest. "Pause and guess" is a 3 s card (no countdown ring; muted viewers cannot hear a tick).
Burned captions at the 1:1 floor. End card 4 s: the aha line, the honesty line small, the URL.

**Blog.** The full film page embedded (the interactive cut with its controls), above a written narrative of 900–1,400
words that follows the plan's beat order: the question · the misconception, credited · the break · the count · the
contrast · the limits · the retrieval question (as a question to the reader, answer below a fold) · the land line. Four
to six stills from the frame bank sit at the beat they illustrate, each with the caption skeleton's line as its
caption. The honesty slot becomes a "Where this stops" section. The sources list is the colophon.

**Newsletter.** 300 words (± 50). Still 1 (the PO) under the headline; the question; the misconception in one line;
still 2 (the before/after pair) or the 6 s GIF of the count; the number in bold; the aha line; one honesty sentence;
the link to the blog/interactive ("try the slider yourself"). Alt text on every image states the number.

### 2.4 Burned-caption style

| | CETI dark | Field Notebook |
|---|---|---|
| Face and size | DM Sans 500, 36 u at 9:16 / 32 u at 4:5 and 1:1 (≈ 13–15 CSS px on a 390-px phone) | same face and size; **not** the handwriting face (captions are for reading at speed; the hand is for the question card only) |
| Plate | ink at 72 % alpha, 12 u radius, 16 u padding | paper at 88 % alpha, hairline rule above, no radius |
| Colour | bone text; the one live role token for a key term, never more | ink text; amber for the viewer's judgement term, blue for the counted term |
| Lines | ≤ 2 lines, ≤ 32 characters per line; a caption never covers a payoff mark | same |
| Position | the caption-safe band of the aspect (§3.1), never inside the platform's bottom zone | same |
| Timing | on at the phase's `labels` t0 (L4 still applies: the word after the mark), off at the phase end | same |

Captions carry the film's caption skeleton compressed to ≤ 7 words per line for 9:16; the verbal channel law (L12)
is satisfied on muted channels by burned key-term labels *on the object*, so the caption may be off during a count.

### 2.5 Hook formulas, with examples

Each channel has a hook slot. Formulas, then the two worked topics.

| Formula | Shape | Best on |
|---|---|---|
| H1 **Wrong-answer poll** | "Most people say X. It's Y." | reel cold open; LinkedIn video text-first |
| H2 **Counted number** | "N of M made it." / "41 %." (the number alone, then the question) | reel cold open when the count is the aha; newsletter subject |
| H3 **The question with a tempting answer** | "A witness is 80 % reliable. How sure are you?" | carousel slide 1; LinkedIn page 1 |
| H4 **Claim that sounds wrong** | "Valid does not mean correct." / "The witness doesn't decide." | LinkedIn video; blog title |
| H5 **The viewer's own case** | "Your agent passed three demos. How many of 50 will pass?" | A8 / T8 topics; reels for practitioners |
| H6 **Before/after** | the pair, one word each: "hoped" → "constrained" | carousel slide 1 when the PO is visual enough to carry it |

**"Type-safe AI"** (T2/T1, dark chrome, the switchyard, numbers from `data.js`):
- Reel cold open (H2 + the break frame): the siding count lands on **1,197 / 2,000** over the ten-junction
  mainline. Caption: "Ten steps. 95 % each. 60 % arrive." Then (1.5–4 s): "Why 'mostly right' is the problem."
- Carousel slide 1 (H4): headline "Mostly right is the problem." Sub: "A model returns `"$1,200.00"`. Four things
  break. One breaks silently." Figure: the raw JSON with the silent-fail stamp in peach.
- LinkedIn video text-first (H4 → H3): "Valid ≠ correct." over the schema track, then "Where does the model's
  guess *go* when the grammar closes a track?"
- LinkedIn document cover (H3): "What happens to the 38 % the schema forbids?" Figure: the 8-track fan with 4 blades
  closed, the mass mid-reseat.
- Blog title (H4): "Types don't make the model right. They make it checkable."
- Newsletter subject (H2): "1,197 of 2,000" · preheader: "what ten 95 % steps actually cost".

**"Base-rate neglect"** (T5/T8, notebook chrome, the 1,000-cab grid, `ppv(base, rel)`):
- Reel cold open (H1 + the break frame): the amber meter at 80 % with the red gap bracket down to the blue block at
  **41 %**. Caption: "Most people say 80 %. It's 41 %." Then: "A witness says the cab was Blue…"
- Carousel slide 1 (H3): "A witness is 80 % reliable. The cab was Blue — how sure are you?" with the handwritten
  question card and a blank commit ring. Slide 2: the 1,000 dots (850 hollow, 150 filled), count written after.
- LinkedIn video text-first (H4): "The witness doesn't decide. The city does." over the grid.
- LinkedIn document cover (H5): "You'd say 80 %. Here's the 1,000-cab count." Page 2 the question in full.
- Blog title (H4): "The denominator decides: why an 80 % reliable witness gets you to 41 %."
- Newsletter subject (H2): "41 %" · preheader: "the cab problem, counted on 1,000 dots".

### 2.6 Interaction → static substitutes

| Page control | Reel / video | Carousel / PDF | Newsletter |
|---|---|---|---|
| CPR number input | "pause and guess" card, `filmDefault` shown as "a common answer" | the question slide; the answer on the next slide; an IG poll sticker or a LinkedIn poll in the post carries the real commit | the question, a line break, the answer |
| slider over one parameter (`blueShare`, `r`) | a **ghost sweep**: the film plays the sweep once (3 s), the two extremes stay as ghosts | a **3-row strip**: the PO at three parameter values (5 % · 15 % · 50 %), the same canonical fn, one slide | the strip as one still |
| rule toggle A | B | the toggle played as a before/after cut (same seeds) | a stacked pair on one slide | the pair |
| case picker (3 cases) | the second case only, as the `fresh` beat | one slide, three mini-cases in a row, the "wrong model happens to be right" case marked honestly | ○ |
| rung scrubber (concreteness-fade) | the morph played through | one slide per rung, anchors drawn as faint ties across the swipe | ○ |

---

## 3. Re-layout rules: the same modules at 9:16, 4:5, 1:1, 16:9

Letterboxing is forbidden. A portrait frame is a composition, not a cropped landscape frame. The engine already
separates *regions* from *modules* (`V.regions`, MODULE-OPERAD §1), so re-layout is a change of the region table and
the PO renderer's orientation, not a change to any module's `render`.

### 3.1 Region tables per aspect (viewBox units, 960-wide basis)

`head` (eyebrow + headline) · `figure` (the body; the PO lives here) · `foot` (the worked line / arithmetic) ·
`caption` (burned-caption band) · `inset` (commit card, 180×64 u at 16:9; scaled per aspect) · `cta` (last frame only).

| Region | 16:9 (960×540) | 1:1 (960×960) | 4:5 (960×1200) | 9:16 (960×1707) |
|---|---|---|---|---|
| platform-safe box | full | x 48–912, y 48–840 | x 48–912, y 48–1104 | x 32–862, y 222–1369 |
| `head` | y 30–108, centred x 480 | y 72–200 | y 88–240 | y 260–460 |
| `figure` | x 40–920, y 124–440 (880×316) | x 48–912, y 220–720 (864×500) | x 48–912, y 270–900 (864×630) | x 48–860, y 490–1130 (812×640) |
| `foot` | y 456–500 | y 740–800 | y 920–990 | y 1150–1210 |
| `caption` | (sidecar only; blog never burns) | y 820–900 | y 1010–1100 | y 1230–1340 |
| `inset` | 180×64 at top-right of figure | 260×92, top-right of figure | 280×100, top-right | 320×112, top-right, below `head` |
| `left` / `right` (contrast-split) | x 40–470 / x 490–920 | **stacked**: y 220–460 / y 480–720 | stacked: y 270–570 / y 600–900 | stacked: y 490–800 / y 820–1130 |
| `cta` (land frame) | foot | y 740–900 | y 920–1100 | y 1150–1340 |

Rules of the table: the figure is always the largest region (≥ 45 % of the safe box's area); `head` never exceeds
15 % of the safe height; the caption band is outside the figure, so a caption never covers a payoff mark (L8's
"most salient thing at that second" is kept). The gap between regions is ≥ 24 u on portrait, so the frame breathes
even at 390 px.

### 3.2 How SVG labels reflow

Labels are placed by `scene-kit.label(term, anchor)`, which already resolves against the PO's anchors. Reflow adds
one rule per anchor: a **placement preference list** `['right', 'below', 'above', 'left']` evaluated against the
aspect's figure region and the other labels' boxes (measured with `getComputedTextLength()`, never `chars × px`). On
portrait, `below` is preferred over `right` because width is the scarce dimension. Collisions are resolved by moving
to the next preference, then by a leader line (hairline, ≤ 40 u), never by shrinking below the type floor. Headlines
wrap at the `head` width with a balance rule (no last line shorter than 40 % of the first). Numbers never wrap and
never sit in two sizes in one frame. The role table is unchanged (L6).

### 3.3 How p5 figures and POs re-flow: scale vs re-flow per PO kind

The PO renderer (`core/po/<kind>.js`) gains two parameters set by the channel compiler, never by modules:
`orient: 'h' | 'v'` and `fold: n`. A module's `render` is unchanged; it reads anchors from the PO, and the anchors
move. The p5 layer reads the same anchors, so marks follow.

| PO kind | 16:9 (design basis) | 1:1 | 4:5 | 9:16 | Never |
|---|---|---|---|---|---|
| `grid` (1,000 dots, 40×25) | 40×25 | 32×32 (fill to 1,024 cells, 24 blank at the end, labelled) | 30×34 | **25×40** (same dots, re-aspected; counts and outlines re-seat) | scale the dots below 6 u; crop the grid |
| `track` (schema stations, 4 along x) | horizontal | horizontal, stations closer | **vertical**, stations top→bottom, labels right | vertical | rotate the station labels |
| the 8-track fan (mass-reseat junction) | fan to the right | fan down-right | **rotate 90°**: the car enters from the top, tracks fan downward, token labels upright to the right of each track | same, longer tracks | mirror the fan (the car always enters top or left) |
| `chain` (10 junctions on a mainline) | one row | **fold 2** (serpentine: 5 + 5, sidings alternate down/up) | fold 2 | **vertical**: the mainline runs top→bottom, sidings to the right, the counter at the bottom-left | scale a 10-junction row to fit 812 u (junctions < 80 u apart hide the staircase) |
| `stack` (the bookmarked manual) | side-by-side with the meter | stack above, meter below | same | same, meter in `foot` | shrink the pages below 8 u |
| `axis` (loss-aversion curve), `frontier` | keep aspect, scale to width | scale to width | scale to width; readouts move to `foot` | scale to width; readouts under the plane | stretch the plane (a frontier's slope is data) |
| `vessel` + trace (feedback-loop) | left/right | vessel above, trace below (the trace keeps its time axis horizontal) | same | same | put the trace on a vertical time axis |
| `timeline` | horizontal | horizontal, events wrap | **vertical** (years down the left; the artefact inset at the top) | vertical | hue for era (unchanged rule) |
| `population` (Poisson cast) | cast over 880×316 | re-cast over the new figure box with the **same seed** (same count, same readouts) | same | same | re-seed per channel (numbers would differ) |
| `form` (worked-fade stations) | stations left→right | stations top→bottom | same | same | two stations per row |

The general principle: **a one-dimensional PO rotates; a two-dimensional PO re-aspects; a plane scales uniformly.**
Rotation is for geometry only; type is never rotated. The camera (`zoom-journey`'s shared transform) is used for
crop-and-pan only on the 9:16 *video* and only when the PO is a `field`; it is never used to rescue a still.

**contrast-split at 9:16: stack.** `left` becomes the top half and `right` the bottom half (table 3.1). The clone
morph is vertical. Alignment ties run vertically between matching anchors. The shared axis or caption sits in the
24 u gutter between halves. Each half must still be ≥ 300 u tall; if the PO is taller than that at 9:16 (a 25×40
grid), the split shows **the same PO once with a toggle wipe** (A fades to B over 0.9 s with the varied-parameter
tag swapping) instead of two copies, and the still-image channels show the pair side by side on a 4:5 slide
instead. Equivariance holds either way: no derived number changes.

**Wide fans and rails (the switchyard, the mainline).** Decision order: (1) rotate the geometry to vertical if the
PO is one-dimensional (the fan, the chain); (2) fold it (`fold: 2`) if rotation would make it too long for the
figure box (> 640 u); (3) crop + camera on the 9:16 video only, with the counter pinned outside the camera so the
number never leaves the frame. Stills never use (3).

### 3.4 Type scale per aspect at phone viewing size

A 1080-px-wide export displays at ≈ 390 CSS px on a phone, so **1 u ≈ 0.41 CSS px** for 9:16, 4:5 and 1:1 (all are
960 u wide). The desktop film shows 960 u at ≈ 720–960 CSS px (1 u ≈ 0.75–1.0 CSS px). Floors are set so the smallest
text is ≥ 11 CSS px where it is viewed.

| Role | 16:9 (film/blog) | 1:1 and 4:5 (phone) | 9:16 (phone) | Face |
|---|---|---|---|---|
| hook / cold-open line | 44 u | 72 u | 80 u | Fraunces 300 italic (dark) · the hand (notebook, question card only) |
| headline | 30 u | 56 u | 60 u | Fraunces 300 italic |
| eyebrow / chapter number | 12 u mono, tracking 3.5 | 26 u mono, tracking 2 | 28 u | mono |
| body / sub | 14–17 u | 32 u | 34 u | DM Sans |
| label on the object | 11–13 u | **28 u floor** (≈ 11.5 CSS px) | 28 u floor | mono for tokens and numbers, DM Sans for words |
| the payoff number | 15–17 u mono | 64–96 u mono (the number is the figure's focal point on carousels) | 72–96 u | mono |
| foot / arithmetic | 12 u mono | 26 u mono | 28 u | mono |
| burned caption | — | 32 u | 36 u | DM Sans 500 |
| honesty line | 12 u | 26 u | 28 u | DM Sans, dim |

≤ 3 sizes per frame plus the headline (the film rule holds). Hairlines stay 1 u at every aspect (≈ 1 px at 1080;
rails, ties and brackets must not vanish: at 9:16 the gauge of a track pair widens from 3 u to 5 u, and the
one-pixel rule in the contract is checked at the export size, not the viewBox).

---

## 4. The frame bank

A still is a frame of the film at a time the compiler can compute from the plan. The frame bank is the set of
such times, named by the phase marker that produces them, rendered at every aspect by `film_render.py --stills`.

### 4.1 Which frames, from which phase markers

| Frame name | Phase marker | Time rule | Used by |
|---|---|---|---|
| `po.first` | the first phase whose `introduces` includes the PO (ladder-build `rung0`, population-sim `cast`) | phase end − 0.3 s (the PO fully drawn, before the first label) | carousel slide 2; newsletter still 1; blog hero; the reel's second frame |
| `question` | bookend question card, or CPR `ask` | phase end | carousel slide 1 (behind the hook text), PDF page 2 |
| `commit` | CPR `commit` | commit start + 0.5 s (the ring full, digits "4") | carousel slide 3 |
| `wrong` | trap `run-wrong` | phase end (the wrong model's confident answer landed, ghost style) | carousel slide 4; the "before" of the pair |
| `break` | trap `break` | hold start + 0.5 s (the gap bracket drawn) | **the reel cold open**; carousel slide 5; the "after" of the pair |
| `count` | any phase with `payoff:true` whose number is a `numbers` fn | payoff t + the count-up duration (the number has landed, the marks are still) | carousel slide 6; GIF end frame; newsletter still 3; LinkedIn page 7 |
| `pair` | `wrong` + `break` composed | the two frames side by side (16:9, newsletter) or stacked (4:5) | newsletter still 2; blog |
| `contrast` | contrast-split `differ` | phase end (the one difference cued) | carousel slide 7 |
| `named` | the module's `name` phase | phase end (the principle chip visible) | the aha slide; LinkedIn page 9; blog |
| `honesty.top` | chrome `honesty`, the staged run | its payoff | honesty page/slide |
| `land` | `land` | the quotable line fully risen, ≥ 1 s before the end | last slide; end card; blog closing image |
| `cover` | computed: the `break` frame if the archetype is A2/A8, else the `count` frame | as above | reel cover; carousel slide 1 background; PDF cover; blog social card |

Automatic selection: the compiler walks the compiled timeline, finds each marker by its phase id and flags
(`payoff`, `hold`, `names`), applies the time rule, and emits `frames.json` = `[{name, t, aspect, path}]`. A plan
with no trap has no `wrong`/`break`/`pair` frames; the carousel adapter then uses `commit` + `count` as the pair and
the slide count drops by one. Every still is rendered from the same purity-checked `render(t)`, so a still is a
frame of the film, never a re-drawing.

### 4.2 GIF and clips

`count.gif` = the window [`count` payoff − 2 s, `count` + 2 s], 10 fps, 600×600 (1:1) or 600×338, ≤ 1.5 MB; the
last frame holds 1 s. `break.mp4` (3 s, 9:16, no audio) is the reel cold open, cut from the re-laid 9:16 render,
not from the 16:9 master.

### 4.3 Carousel text layers (per slide, designed for the slide, not for the film)

Each slide = a frame-bank still at the slide's aspect + a **text layer** drawn by the carousel renderer in the
`head`, `foot` and `cta` regions, never over the figure:

| Layer | Content | Size (4:5) | Rule |
|---|---|---|---|
| kicker | ≤ 5 words, mono, the beat class in plain words ("THE COMMON ANSWER", "COUNTED") | 26 u | optional on slides 2 and 6 |
| headline | ≤ 9 words, one idea; the aha slide's headline is the plan's `aha` line verbatim | 56 u | L5: the principle's name appears on the aha slide only |
| body | ≤ 25 words (IG) / ≤ 45 (LinkedIn), from the caption skeleton of that phase, rewritten in the second person | 32 u | one sentence may be the honesty line, dim |
| number callout | the payoff number with its unit and the fraction it came from ("120 / 290 = 41 %") | 64–96 u | only on `count` and `break` slides; the same fn as the film |
| source tag | `[Sn]` in the foot | 26 u | required where the number is sourced; "illustrative" where it is not |
| swipe cue | a chevron and "swipe" | 26 u | slides 1–3 only |
| counter | "3 / 8" | 26 u | every slide, foot right |

The writer fills `body` from the caption skeleton; the compiler fills everything else from the plan.

---

## 5. Channel QA rubric

Run on every channel output before it ships. Each test is pass/fail; a fail blocks the post, not the film.

| # | Test | How | Pass condition |
|---|---|---|---|
| Q1 | **Thumb-stop** | show the first frame (reel: frame at 0.3 s; carousel: slide 1; LinkedIn: the cover) to three people for 1 s on a phone | ≥ 2 of 3 can say what the question or the number is |
| Q2 | **1-second read** | every frame-bank still at its export size on a phone for 1 s | the headline or the number is read; nothing else competes (one focal point, L8) |
| Q3 | **Safe-zone** | overlay the platform's zone mask (§2.1) on every frame | no type, no payoff mark, no number inside the masked zones; the cover's payoff sits inside the 4:5 and 1:1 crops |
| Q4 | **Muted comprehension** | watch the reel and the LinkedIn video with the sound off, once | the cold-root check (METHOD §5) gives the plan's `aha`; every introduced term has a burned label on the object (L12) |
| Q5 | **Swipe-through logic** | read the carousel/PDF without the post text | each slide adds one thing; the question on slide 1 is answered by the number on the count slide; the aha slide names the principle last (L5); the last slide asks one thing (CTA) |
| Q6 | **Numbers agree** | diff every number on every channel against `numbers` on the `example` record | zero differences; the same source tags |
| Q7 | **Brand consistency** | role table, chrome, type faces, hairline weight across outputs | one role per variable on every channel (L6); dark and notebook never mixed in one piece; the PO is recognisable at 160 px |
| Q8 | **Type floor** | measure the smallest text at the export size | ≥ 11 CSS px at phone size (§3.4); ≤ 3 sizes + headline per frame |
| Q9 | **Composition, not letterbox** | look at every portrait frame | the figure fills ≥ 45 % of the safe box; no empty bands; nothing cropped mid-gesture; no rotated text |
| Q10 | **Honesty survives** | search each output for the top honesty item | present as a run (video) or a line (stills); the wrong model is never the last image |
| Q11 | **Platform limits** | file size, duration, page count, GIF weight | inside §2.1; `[verify]` items checked against the platform's current page |

A still that fails Q2 or Q9 is re-laid (§3), not re-drawn by hand. A reel that fails Q4 gets its labels moved onto
the object, not a voice-over added.

---

## 6. Build plan for the `channels` compiler

### 6.1 Inputs and outputs

```
python3 core/build_channels.py films/<id>/film.plan.json --channel <id> [--all] [--out films/<id>/channels/]
```
Inputs: `film.plan.json` (the structure), `channels/<id>.json` (the adapter: aspect, duration budget, beat filter
and order, text density, caption mode, CTA, hook formula), the writer's `copy.json` (hook lines per channel, slide
bodies, blog and newsletter prose; the compiler emits a skeleton for it on the first run), and the registry.

| Channel id | Outputs |
|---|---|
| `ig-reel` | `reel.9x16.mp4` (1080×1920, burned captions, 20–35 s), `reel.cover.png` (the `cover` frame), `reel.srt`, `post.txt` (caption + hashtags + the honesty line), `frames.json` |
| `ig-carousel` | `slide-01.png … slide-NN.png` (1080×1350), `post.txt`, `frames.json` |
| `li-document` | `document.pdf` (1080×1350 pages, ≤ 12), `post.txt` (with the spelled-out URL), `pages/*.png` |
| `li-video` | `video.1x1.mp4` or `video.4x5.mp4` (45–75 s, burned captions), `video.srt`, `cover.png`, `post.txt` |
| `blog` | `post.md` (prose + still placements + the embed snippet), `stills/*.png` at 1920×1080, `social-card.png` (1200×630, the `cover` frame), `embed.html` (the film page with `?chrome=` and controls) |
| `newsletter` | `email.html` (600 px, inline styles), `stills/*.png` at 1200×675, `count.gif`, `copy.md` (300 words), `subject.txt` (H2 + preheader) |

Every channel also writes `qa.json` (Q3, Q6, Q8, Q11 computed; Q1/Q2/Q4/Q5/Q7/Q9/Q10 as a checklist with the
frames to look at).

### 6.2 Stages (each pure over its inputs; each a module of `build_channels.py`)

1. **Compile the film.** `Film.compile(plan)` → timeline, `T`, phases, `numbers`, PO states. Unchanged.
2. **Tag beats.** Map every phase to a beat class (§2) from its module and phase id. Emit `beats.json`.
3. **Adapt.** Apply the channel's filter and order to the beat list; compress phases to the channel's budget by
   scaling each kept phase's duration toward its declared minimum (the minimums live in the module definitions:
   `phases[].min`, a new optional field, defaulting to the §2.3 floors). Re-window → a **channel timeline** with its
   own `T`. Insert the substitutes (§2.6) as pseudo-modules (`guess-card`, `ghost-sweep`, `strip-3`, `pair`).
   Run `lint_plan` on the channel timeline: L3, L4, L5, L8, L9, L10 must still pass; L11 and L13 are waived on
   reels and videos (logged as waived, never silently).
4. **Lay out.** Select the aspect's region table (§3.1) and set the PO renderer's `orient`/`fold` from the §3.3
   table. Build the page with `?aspect=9x16|4x5|1x1|16x9` (the feature template gains the aspect query and the
   region table; the viewBox becomes `960×H`). Label reflow (§3.2) runs in `scene-kit.label` under the aspect's
   figure box.
5. **Render.** `film_render.py` over the channel page: `--stills` at the frame-bank times for stills; `--frames` at
   30 fps for video; `ffmpeg` assembles MP4 (H.264, yuv420p, CRF 18) and GIF (palette pass, 10 fps). Captions are
   burned by the page itself (a caption layer in the `caption` region reads the channel timeline), so the still and
   the video agree; `.srt` is emitted from the same data.
6. **Assemble.** Carousel: stills + text layers → PNGs; PDF via `img2pdf` (lossless) with a sources page; blog:
   `post.md` from the beat order + `copy.json`; newsletter: `email.html` from a fixed 600-px template.
7. **QA.** Safe-zone masks over every frame (pixel test for type and payoff marks inside masked zones), number diff
   across outputs, type-floor measurement from the SVG (font sizes × export scale), file limits. Write `qa.json`.

### 6.3 Engine changes required (small, and all additive)

- `feature.template.html`: `?aspect=` → viewBox height and the region table; a `caption` layer; the `cta` region.
- `core/po/*.js`: `orient` and `fold` parameters; anchors recomputed; the p5 layers already read anchors.
- `scene-kit.label`: the placement preference list and collision step (§3.2).
- `module.js`: optional `phases[].min` (seconds) and `phases[].beat` override.
- `compile.js`: accept a channel timeline (the same shape as the film timeline) so `render(t)` needs no change.
- `lint_plan.mjs`: a `--channel` mode that waives L11/L13 and reports them as waived.
- `film_render.py`: `--aspect` passthrough; `--frames` at a fps; nothing else.

### 6.4 The minimal set to prove it on one topic

Topic: **"Base-rate neglect"** (composition 4b): it is the first film the module build order makes buildable, it
has a trap (so the full frame bank exists), its PO is a grid (the cleanest re-aspect case), and it has a
contrast-split (the stack case). Prove, in this order:

1. **Frame bank at 16:9** from the compiled plan: `po.first`, `question`, `commit`, `wrong`, `break`, `count`,
   `contrast`, `named`, `land`. Look at every still. Gate: each matches its time rule (§4.1).
2. **One portrait re-layout, 4:5**: the grid at 30×34, the stacked split, labels reflowed, type at the phone floor.
   Gate: Q2, Q8, Q9 on all nine stills.
3. **IG carousel** (8 slides) with text layers from `copy.json`. Gate: Q5, Q6, Q3.
4. **LinkedIn document** from the same slides + cover + arithmetic + honesty + sources. Gate: Q11, page 1 at 320 px.
5. **IG reel** (≈ 28 s): cold open on `break`, 9:16 re-layout with the 25×40 grid, burned captions, the guess card.
   Gate: Q1, Q3, Q4, lint with waivers logged.
6. **Blog** (embed + 5 stills + prose) and **newsletter** (3 stills + `count.gif` + 300 words). Gate: Q6, Q10.
7. **Second topic, no new code**: "Type-safe AI" through the same compiler (the fan rotates, the chain folds and
   goes vertical). If a channel needs a hand edit, the adapter or the PO renderer is incomplete, not the film.

Done when: all six channel outputs for base-rates pass Q1–Q11, the number diff across the six is empty, and a seat
that did not build them runs the thumb-stop and the muted-comprehension tests on a phone.
