# Type-safe AI — storyboard (feature cut, 120 s)

One storyboard, one clock, two renderings:
- **SVG cut** (`typesafe.svg.html`) — the classic ceti-explainer long form, SVG only.
- **p5 cut** (`typesafe.p5.html` + `typesafe.mp4`) — the same module plus p5 layers that carry what SVG can't
  (counted mass, thousands of runs, the 128k vocabulary, the whale from marks), plus live interactions.

Sources: `../../../../../typesafe/research/BRIEF.md` (numbers, `[Sn]` tags), `typesafe/design/DESIGN-IDEATION.md`
(switchyard system), `typesafe/ART-DIRECTION.md` (counted-mass law, gates). Shared data and geometry: `data.js`.

## Governing metaphor — the switchyard

The schema compiles to a grammar; a grammar *is* a railroad diagram (Wirth; json.org draws JSON that way). So:
position on the track = automaton state · open points at a junction = tokens allowed next · the model's
probabilities = load (counted marks) queued on each track · sampling = the car takes one track · type = gauge ·
type mismatch = break of gauge at a coupler · validation = an inspection shed on the line.

Never: subway map (coloured lines, station dots, rounded corners), circuit board (single glowing hairlines,
beads), toy train (wheels, smoke, ties, signals), flowchart (arrowheads). A track is always a **pair of rails 3
units apart**, hairline, `--line`/`--dim` at rest, copper when open/chosen. A car is a 10×4 dash between rails.

## Canvas, zones, type

960×540 viewBox (film: 1920×1080, exactly 2×). Head y 30–108 (eyebrow mono 12 / tracking 3.5 at y 50; headline
Fraunces 300 italic 30 at y 92, centred x 480). Body y 124–440. Foot y 456–500 (worked line, mono 12, dim).
Type sizes on stage: 11–13 mono, 14–17 DM Sans, 30 Fraunces (44 for the title and the landing line). Nothing
below 11. Token roles only — no hex in scene code (`C` reads `--ex-*` at build).

Accent rotation: M1 copper · M2 peach (the failures) → sage (the contract) · M3 copper · M4 copper + dim ·
M5 sage + slate · M6 sage | peach, equal weight · M7 copper.

Micro-cadence per scene: eyebrow (+0.4 s) → headline (+0.65 s) → build (stagger 0.12–0.55 s, rise 12–26 px,
glaser, no bounce) → exactly one payoff at ~70 % → settle (last 0.9 s). No stretch > 3 s without new motion.

## Movements

| # | Window | Eyebrow / headline | Picture | Payoff |
|---|---|---|---|---|
| M1 Hook | 0–12 | `CETI EXPLAINERS · TWO MINUTES` / title *Type-safe **AI*** + sub "How a model is made to keep its promises." | Whale assembles (SVG: ~70 sampled circles + streaks; p5: 1,200 marks, each "one run through the yard"). Title rises y 414. | eye lands as title completes (t≈6); hold. |
| M2 Core idea | 12–32 | `01 — THE CONTRACT` / *Mostly right is the problem* | 12–24: left well: the input line, then the raw answer types out (prose + JSON with `"$1,200.00"`, `"dollars"`, `"15 Nov 2026"`). Right column: four failures stamp in (`JSON.parse` throws · `amount × 1.16` → NaN · `currency === "USD"` → false **silent** · `new Date(…)` → runtime-dependent). 24–32: well + list collapse; the **schema as a track** draws across the Body (y 300): four stations `customer · string` · `amount · number` · `currency · USD│EUR│MXN` · `due · date`; a car runs it; values seat above stations (`"Marisol Ortega"`, `1200.00`, `"USD"`, `"2026-11-15"`). | the **silent** stamp (t≈21.5, peach ring); then stations light sage in turn as the car passes (t≈29). |
| M3 Mechanism | 32–56 | `02 — THE MASK` / *Only the open tracks* | 32–36: lockup at y 150 (mono 15) `{"customer":"Marisol Ortega","amount":1200.00,"currency":"` builds token by token (accelerating), the car riding the entry rail to junction J. 36–46: **the junction**: 8 tracks fan from J with tokens `USD $ dollars US EUR usd MXN "` and p `.42 .18 .12 .09 .07 .05 .04 .03`. Load = **1,000 marks** queued per track ∝ p (SVG cut: bars). At 39.5 the grammar throws 4 points closed (blades, 0.3 s, `rest`): `$ dollars usd "` dim; their marks re-seat onto the 4 open tracks keeping ratios (glaser 1.4 s) → 677 · 145 · 113 · 65. Numbers count to `0.677 0.145 0.113 0.065`. Foot: `allowed mass 0.62 · p′ = p ÷ 0.62 · illustrative logits`. 44.2: the car takes `USD` (fixed u = 0.55 against cumulative p′), lockup gains `USD"`. 46–50: ghost branch: had it taken `US`, the next junction has one open track, `D` (tokenizer twist). 50–56: **the vocabulary**: the yard folds into a comb of ≈128,000 stubs (p5: one per token, baked; SVG: 1,280 cells "each = 100 tokens"), 4 lit copper; counter `128,256 checked · 4 allowed`; foot `XGrammar: < 40 µs per token [S3]`. | marks re-seat (t≈41) and the numbers land; the car into `USD` (t≈44.6, pulse). |
| M4 Scale | 56–75 | `03 — COMPOUNDING` / *Ninety-five percent, ten times* | Mainline across Body (y 290) with 10 junctions at x = 120 + 80k. Each has a siding curving down-right to y 400. **2,000 runs** released 58.5–64 (p5: marks; SVG: 40 representative cars + counter). Free points: at junction k exactly `arrivals[k-1] − arrivals[k]` runs derail into its siding, `arrivals[k] = round(2000·0.95^k)` → 1,900 · 1,805 · 1,715 · 1,629 · 1,548 · 1,470 · 1,397 · 1,327 · 1,260 · **1,197**. Counter sweeps 60–68 to `1,197 / 2,000 · 59.9 %`. 69.5–74: points held to type (all sidings closed, blades turn sage), replay → `2,000 / 2,000`. Foot: `0.95¹⁰ = 0.599 · 0.99¹⁰ = 0.904 · 0.999¹⁰ = 0.990` and `OpenAI: < 40 % → 100 % schema adherence [S1]`. | counter lands on 1,197 as the last siding fills (t≈68); then 2,000 (t≈73.5). |
| M5 Process | 75–96 | `04 — ENFORCEMENT` / *Hope, check, or constrain* | 75–89: three lanes at y 175 / 265 / 355, labels left (`Hope` · `Check & retry` · `Constrain`), each a track x 250→860 to a result stamp. Lane 1 (76.5): car runs to the end → peach ✗ `JSON.parse: unexpected token S`. Lane 2 (78): car enters the inspection shed at x 640 → peach note `3 errors: amount · currency · due` → car loops back (attempt 2, 81.5) → sage ✓ `attempt 2`. Lane 3 (79): car runs straight → sage ✓ `first try`. Foot: `Instructor · PydanticAI · TypeChat retry with the error [S9][S10][S12]` / `strict: true — OpenAI, Anthropic [S5][S6]`. 89–96: composition: blocks `extract  Email → Invoice` · `approve  Invoice → Decision` · `pay(invoice: Invoice)` (slate tool) on one line, joined by couplers where gauges match (sage). Under it an untyped row: `"amount": "$1,200.00"` sails through `extract` and `approve` and fails at `pay` (peach, `NaN`). | lane 3's ✓ (t≈80.6) — then the typed `pay` fires sage, one ring (t≈94). |
| M6 Limits | 96–110 | `05 — THE LIMITS` / *Shape, not truth* | A6 paired cards, equal weight, slide in from opposite sides. Left (sage ✓): `Valid by construction — no parse errors` · `No retries for shape` · `Mismatches caught at the joint`. Right (peach !): `Valid ≠ true: 1,200.00 passes; the invoice said 12,000` · `A bad schema can squeeze out reasoning: GSM8K 86.5 → 23.4 (Claude 3 Haiku, JSON-only) [S4]` — sub-line `reasoning-first schema: 0.77 → 0.78 [S19]` · `Not every keyword is enforced: minimum, maxLength… [S6]`. Above the cards a strip: the typed invoice with a sage ✓ and a peach manifest mark beside `1200.00` vs source `12,000`. | both cards filled, no winner (t≈106). |
| M7 Land | 110–120 | — | Setup line (DM Sans 17, dim): "A type is a promise the model can't break." Quotable (Fraunces 44 italic): *Types don't make it right. They make it **checkable**.* Whale reforms small and low (TF7); ring pulse at the eye; end card `cetiai.co`. Camera push ≤1.04 over the last 6 s (p5 cut only). | ring as the eye lands (t≈115.5), ≥2 s before the end. |

## Captions (≤ 90 chars, one every 6–7 s, never burned in; the film carries them as subtitles)

```
[0.6, 6.0]    Two minutes on type-safe AI: how a model is made to keep its promises.
[6.0, 12.0]   It starts with a request companies make millions of times a day.
[12.0, 18.5]  Ask a model to read an invoice and return JSON. It mostly does.
[18.5, 25.0]  Mostly is the problem: four small slips, and one of them fails silently.
[25.0, 32.0]  A type is a contract for the shape. Type-safe AI holds the model to it as it writes.
[32.0, 38.0]  The schema compiles into track. The model can only run where track exists.
[38.0, 44.0]  It wants “USD”, “$”, “dollars”… The grammar closes every track that can’t fit.
[44.0, 50.0]  The closed tracks’ weight moves to the open ones. Ratios survive: 0.42 becomes 0.677.
[50.0, 56.0]  It checks the whole vocabulary — about 128,000 tokens — every step, in microseconds.
[56.0, 63.0]  Why it matters: real systems chain steps, and errors multiply.
[63.0, 69.5]  Ten steps at 95% each: 1,197 of 2,000 runs make it through. About 60%.
[69.5, 75.0]  Hold every step to its type, and all 2,000 arrive well-formed.
[75.0, 82.0]  Three ways to get a type: hope, check and retry, or constrain while it writes.
[82.0, 89.0]  Retrying gets there on the second try. Constraining gets there on the first.
[89.0, 96.0]  Typed steps snap together. A mismatch stops at the joint, not in production.
[96.0, 103.0] A type checks shape, not facts: 1,200.00 is valid. The invoice said 12,000.
[103.0,110.0] And a bad schema can squeeze out the reasoning. Put the thinking before the answer.
[110.0,118.5] Types don’t make it right. They make it checkable.
```

Chapters: `0 Intro · 12 The contract · 32 The mask · 56 Compounding · 75 Enforcement · 96 Limits · 110 Land`.

## Interactions (live page only; video = defaults)

One `state` object; `render(t, state)` stays pure; the panel writes state and re-renders (paused frames update).

| key | default | control | where | effect |
|---|---|---|---|---|
| `constrain` | `true` | toggle | M3 | off: no points close; marks stay on all 8 tracks; the car (same u = 0.55 on raw cumulative p) takes `$`; lockup `"currency":"$` + peach `valid JSON · invalid against the schema` |
| `stepRate` | `0.95` | slider 0.80–0.999 | M4 | arrivals recomputed `round(2000·r^k)`; counter, sidings, foot arithmetic follow |
| `steps` | `10` | slider 2–10 | M4 | number of live junctions (the rest go dim) |
| `inject` | `"ok"` | `ok` · `string amount` · `missing due` | M5 composition | where the bad value stops: typed row at the first coupler, untyped row at `pay` |
| `amount` | `1200` | number input | M6 | type check passes for every number; `matches source (12,000)?` sage only at 12000 |

## Audit (`data.js` → `TS.audit()`, called by `__AUDIT`)

Σp = 1; allowed mass = 0.62; p′ sums to 1 and preserves every ratio; marks conserved (1,000 before = 1,000
after, per-track counts by largest remainder); sampled token for u = 0.55 is `USD` constrained and `$` free;
`arrivals[10] = 1197`, derailed + arrived = 2,000; `0.95¹⁰` printed = computed; 0.99¹⁰, 0.999¹⁰ likewise;
every coupler in M5 has A.out === B.in in the typed row.
