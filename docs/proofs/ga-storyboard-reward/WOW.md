# WOW · GA storyboard reward (goodhart ledger)

The simpsons-3d pilot exported **byte-identical** baseline and “evolved” MP4s because the GA elite never beat shipped knobs. The credible demo is the **2D goodhart ledger COUNT window** (36–58 s): same film, two genomes, **two different MP4s**.

## Watch these clips (proof VM)

| Clip | Path |
|------|------|
| **Before** (mis-timed knobs) | `/opt/cursor/artifacts/ga-wow-goodhart-before.mp4` |
| **After** (GA best genome) | `/opt/cursor/artifacts/ga-wow-goodhart-after.mp4` |

Still at film time **t ≈ 45 s** (9 s into the window clip; use `-ss 9` on the MP4):

| | Path |
|---|------|
| Before | `/opt/cursor/artifacts/screenshots/ga-wow-before.png` |
| After | `/opt/cursor/artifacts/screenshots/ga-wow-after.png` |

Rebuild from committed genomes: [`wow-demo/BUILD.md`](wow-demo/BUILD.md).

## What was broken in “before”

Captions in the COUNT beat are fixed in `film.json`; only **timing knobs** move the ruler scan, red-flag reveal, gather, and guess outline.

In the degraded genome, motion lands **after** (or fights) the caption that describes it:

- **t ≈ 41–44 s** — Caption: *“The metric counted every one as a product sold.”* **Before:** the ruler scan starts late (`scanT0` 40.6 s) and runs slowly (`scanDur` 2.6 s), so the grid is still empty or mid-scan while the caption already claims counting.
- **t ≈ 44–49 s** — Caption: *“The review flagged 21…”* **Before:** red flags start at `flagT0` 44.6 s with a wide `flagStep` 0.3 s, so almost no flags are visible when that line is on screen; **after:** flags begin at 44.0 s with 0.2 s steps — the red marks match the “21 flagged” story.
- **t ≈ 51 s** — Caption: *“Your guess, outlined…”* **Before:** gather is late (`gatherT0` 49.0 s) while the guess outline starts early (`guessT0` 50.8 s); **after:** gather at 48.6 s, guess at 51 s — outline lands on the caption beat.

Both builds **gate PASS** (G11/G12 WARN only, same as the live `--evaluate` path).

## What GA optimized

The pilot’s `--evaluate` run on `factory/films/goodhart/drafts/ledger` held the **shipped timing elite** (`best.genome.goodhart-ledger.json`). The large fitness jump in the proof is mostly **re-gating with G11/G12** on a fresh build, not a new knob vector discovered by mutation:

| Stage | Fitness | Notes |
|-------|--------:|-------|
| Shipped score vs **committed** `gate.json` (no G11/G12) | **106.50** | `evolve_sequence.py score` |
| Best after **`--evaluate`** (live gate, G11/G12) | **123.00** | `best.genome.goodhart-ledger.json` |
| **WOW before** (degraded, live gate) | **122.92** | `wow-demo/before/genome.degraded.json` |
| **WOW after** (best, live gate) | **123.00** | `wow-demo/after/genome.best.json` |
| Delta (WOW before → after, live gate) | **+0.08** | Anchor penalty on mis-set knobs |

**Knob deltas (before → after):**

| Knob | Before | After | Role |
|------|-------:|------:|------|
| `scanT0` | 40.6 | 40.2 | Ruler scan start |
| `scanDur` | 2.6 | 2.0 | Scan length |
| `flagT0` | 44.6 | 44.0 | First red flag |
| `flagStep` | 0.3 | 0.2 | Flag stagger |
| `gatherT0` | 49.0 | 48.6 | Gather into slots |
| `gatherDur` | 2.0 | 1.6 | Gather travel |
| `guessT0` | 50.8 | 51.0 | Guess outline start |
| `guessDur` | 2.6 | 2.0 | Outline draw time |

The **visible WOW** is sync you can see in the MP4s; the **106.50 → 123.00** headline is the GA loop proving live gate + fitness on 2D (~**26 s** wall for 8 individuals vs simpsons **~110 s** WebGL).

## Wall time: why 2D leads

| Film | `--evaluate` (pop 4 × gen 2) | Per-individual (typical) |
|------|---------------------------:|-------------------------:|
| goodhart ledger 2D | **~26 s** | ~3 s build+gate |
| simpsons-3d WebGL | **~110 s** | ~14 s build+gate |

Use goodhart for iteration; use WebGL to show the same machinery scales.

## Machinery shipped on this branch (merge-worthy)

| Piece | What it does |
|-------|----------------|
| `factory/tools/evolve_sequence.py` | Offline GA over timing knobs: seed → mutate → kit2 + gate → fitness. |
| `docs/GA-STORYBOARD-REWARD.md` | Design for bounded sequences and reward terms. |
| `gate_extra_flags()` | `--evaluate` on legacy films (`--overlap-warn`, `--quick`). |

**Not implemented:** caption/chapter genes, neural reward, module-chain evolution.

## Honest limits

- **Tier-1 knobs only** — captions and claims are not mutated by this pilot.
- **GA did not beat shipped knobs** on goodhart in this seed run; the elite matches authored timing.
- **Not replacing Opus select** — this automates timing alignment inside a passing gate, not brief-to-film authoring.
- **simpsons MP4s** — baseline and “evolved” exports were the same file; do not use them as a before/after story.
