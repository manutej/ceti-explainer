# The feature cut — long-format episodes (~1:50–2:15)

The second format this skill produces. The **short episode** (SKILL.md: 8 beats, ~40s, anchor + working zone + detail band) teaches one mechanism tightly. The **feature cut** teaches a whole concept as a paced, video-like arc: seven movements, scene archetypes, brand bookends, speed chips. Choose it when the brief says *video*, *2 minutes*, a lay audience, or a topic too broad for one anchor (e.g. "What is generative AI," "What is an agent," "Why AI hallucinates").

Gold-standard reference: `reference/longform/feature-cut-v2.js` (engine + scenes for "Generative AI, explained simply," 110s) and the shipped artifact in `ceti-video-lab/`. Read the reference top to bottom before building — it is the bar for this format.

The deterministic contract is **identical** to the short format: one clock, every frame a pure function of `t`, build-once/mutate-only, `seg`-not-`pulse` for shared regions, paused == playing, token roles only, no hype. What changes is scale and choreography.

---

## Form

- **~110–135s** (110 is the proven cut), **960×540** SVG, 16:9, in a player card on the page ground.
- Full-page artifact: masthead (whale mark, mono eyebrow, Fraunces italic H1, lede), player, caption band below the canvas (never burned in), chapter chips, transcript `<details>`, footer.
- Player chrome additions over the short format: **speed chips 1×/1.25×/1.5×** (mono, `aria-pressed`, persisted), **resume-from-last-position** (localStorage, ignore saved t within 1s of either end), **poster frame** (while idle, render a mid-intro t so the still reads as whale + title), end-of-play caption ("That's the tour — press ⟲ to watch again.").
- Surface: marketing tokens (`--mk-*`) — bathysphere canvas `#0F1320` on deep-sea ground `#1A1F2E`, paper ink `#F5EFE3`, fog `#B8B0A1`. Mirror the palette into a JS const for SVG attrs. Fonts via Google Fonts link + `document.fonts.load` race (2.5s timeout) before `build()` — layout measures text, so wait, then degrade gracefully.

## The cadence — seven movements, one arc

The emotional spine is fixed; durations flex ±20%, the order never does:

| # | Movement | Window (110s cut) | Job | Payoff beat |
|---|---|---|---|---|
| 1 | Hook | 0–12 | Brand assembly + promise ("no jargon") | streaks finish as title lands |
| 2 | Core idea | 12–30 | One-sentence mental model + scored demo | winner flies into the blank |
| 3 | Mechanism | 30–48.5 | Where the ability comes from; accumulation | counter hits its headline number |
| 4 | Scale | 48.5–66 | Why size matters; structure grows | signals travel the finished structure |
| 5 | Process | 66–86 | Step-by-step loop drives a live demo | the demo completes a sentence/result |
| 6 | Limits | 86–100 | Honesty beat — strengths and caveats, equal weight. **Non-negotiable.** | both cards filled, no winner declared |
| 7 | Land | 100–110 | One quotable Fraunces line; whale reforms | ring pulse, end card |

**Micro-cadence inside every scene** (this is what makes episodes feel like siblings): eyebrow (+0.4s, mono uppercase, numbered `01 — PREDICTION`) → headline (+0.65s, Fraunces 300 italic) → build (stagger 0.12–0.55s, rise 12–26px, ease-glaser, never bounce) → **exactly one payoff** ~70% through (a counter, a flight, or a pulse ring — never two) → settle (last 0.9s, whole group fades, nothing exits mid-gesture).

**Captions:** 17–18 lines, one every 6–8s, <90 chars, dry, no hype, one deadpan joke allowed (canonically the last terminal candidate, e.g. `spreadsheets 1%`). Script gate: reads aloud under 2:05.

**Pacing discipline (the v1→v2 lesson):** no stretch may go >3s without new motion or information. Lulls to hunt: intro hold after the title (cap ~3.5s), post-bars dead air before a winner highlight, counter sweeps past their narration line, constant-rate word generation (ramp it instead — first 3 words deliberate, then accelerate to match "Repeat — very fast"), structure-done-signals-just-looping tails. Counters sweep 12–16s so the number is still moving while narration explains it.

## Scene archetypes — the component library

Seven parameterized scenes; *slots* change per topic, *fixed* parts carry the brand. A new episode is mostly filling slots:

| | Archetype | Slots (per topic) | Fixed (brand) |
|---|---|---|---|
| A1 | **Brand assembly** — particles converge into the logomark; streaks draw on; title rises | title + promise line | whale geometry, streak choreography, drift field |
| A2 | **Terminal demo** — prompt types itself; scored candidates rise; winner flies into the blank | prompt, 4 candidates + scores (last = the joke) | terminal well, typing cadence, copper winner, pulse on landing |
| A3 | **Accumulator** — items arc into a breathing core; counter sweeps | item glyph, source labels, number + unit | quad-bezier flight paths, sage core, pulse-on-arrival |
| A4 | **Radial build** — rings of nodes/edges assemble outward; tags name what it captures | ring counts, 3 tag labels, counter | copper center, edge-lit nodes, peach traveling signals |
| A5 | **Loop + live demo** — three pills cycle while output builds beneath, ghost candidates flickering | pill labels, generated output + per-step alternatives | loop geometry, peach active state, ghost treatment |
| A6 | **Paired cards** — strengths vs caveats slide in from opposite sides, equal weight | 3 + 3 items | card geometry, sage checks / peach cautions, no emoji |
| A7 | **Landing** — setup line, quotable line large in Fraunces italic, logomark reforms small | the two lines | whale bookend, ring pulse, type treatment |

**A8+ rule:** a topic that doesn't fit gets a new archetype designed once, audited once, then added here for reuse. Every new archetype must obey the micro-cadence and the token contract.

**Accent plan:** one saturated accent per scene, rotating copper → sage → copper/peach → peach → sage+peach → copper. Never two saturated accents competing in one scene.

**The bookend rule:** the brand mark opens AND closes every episode. The same particle set serves both: sample N points along the logomark paths once in `build()` (via an offscreen probe path + `getPointAtLength`), keep two transforms (large/hero for the intro, small/low for the landing), and lerp each ambient particle between its drift position and its target by a convergence factor. Ambient proximity-lines fade out as constellation segment-lines fade in.

## Engine deltas vs the short format

Same toolkit (`seg/eo/eio/lerp`, seeded rng, build-once). Additions:

- **Scene groups `g1…g7`**, each gated by `fade(t, [start,end])` = 0.9s in / 0.9s out, with `visibility:hidden` when 0 (don't pay layout for invisible scenes).
- **`sceneHead(g, eyebrow, title)`** helper — every scene 2–6 gets the numbered eyebrow + italic headline on the same offsets.
- **Speed** multiplies `dt` in the tick (`t += dt*speed`) — exact at any rate, nothing to pitch-shift. Persist choice; default 1× (defaulting faster punishes first-time viewers).
- **Resume**: save `t` (throttled ~0.8s) under an episode-specific key; restore on load if `1 < t < DUR−1`.
- **Poster frame**: while `!started && t===0`, render a fixed mid-intro instant (e.g. `t=5.6`) and show the "Press ▶" caption.
- **Reduced motion**: kill drift, blink, breathing, traveling signals; keep opacity steps so chapters/scrub step cleanly; show the rm-note.
- **Text layout at build time**: measure with `getComputedTextLength()` to wrap/center generated sentences; never `chars × px`.

## Pipeline & gates

1. **Script** — 17–18 caption lines in CETI voice. *Gate: <2:05 aloud, zero hype words, <90 chars/line.*
2. **Storyboard** — cast all seven movements to archetypes + slot values. *Gate: one concept per scene; ≤7 new elements per view; exactly one payoff each. T1 if every movement names an archetype; every unnamed movement adds half a tier (T2 = 1–2 new archetypes; T3 = new brand set piece — series openers only).*
3. **Build** — copy the reference; replace scenes + captions + chapters; the engine carries over untouched (~60% of the build). Tokens only.
4. **Audit** — contrast ≥4.5:1 (3:1 large) computed, not estimated · targets ≥44px · reduced-motion fallback · no flashing >3/s · **scrub-exact at any t** (jump to 10 random t; every frame complete) · last beat lands before DUR · poster frame reads as a still · resume + speed chips persist across reload.
5. **Ship** — one self-contained `.html` + in-page transcript.

## Failure modes specific to long format

| Symptom | Guardrail |
|---|---|
| Mid-video drag ("it feels slow") | the 3s-lull budget; ramp constant-rate sequences; trim holds after payoffs land |
| Scenes feel unrelated | micro-cadence + `sceneHead` on every scene; accent rotation, not accent anarchy |
| Trite demo copy ("the cat sat on the mat") | demo slots must be brand-voiced and topic-specific; the last candidate carries the joke |
| Brand only at the intro | the bookend rule — the mark must reform in the landing |
| Saved-position confusion | ignore resume within 1s of either end; restart button always hard-zeroes |
| Speed chip breaks sync | speed multiplies the clock only; never duration constants |
