# SWARM-DESIGN · cheaper, deterministic, replicable film production with small workers (lane R-M2, 2026-10-11)

Question from the owner: do we use the most token-efficient, deterministic, replicable methods, and how would we
run this work with swarms of smaller agents? Short answer, with numbers below: no. Today every check that could be a
script is done by a model reading frames, every agent re-reads 70-90 k tokens of context before it writes a line, and
the expensive model (Opus) writes code. The plan below keeps the selection idea and moves the rest to scripts and small
workers. Honest headline: tokens per film fall about 17 % (950 k to 2.0 M range, point 1.6 M against 1.95 M), Opus
tokens fall 59 %, the wall time falls about 45 %. It is not a 10x saving, and one experiment (E1) can still
reverse the token result.

Evidence: the pipeline, wave, atelier, gate and rubric files, pass-every-time MEASURES, REVISION-wow2, WOW-SCORE and
findings.r1/r2, and the Workflow tool's reference (no skills/workflow-authoring folder exists in the repo). Figures
marked (est.) are my estimates; the rest is quoted from those files or counted with wc.

## 1. Where the tokens go today, and why

Session baseline: 161 subagents, 34.1 M tokens (mean 212 k per agent).

| lane | tokens | share | per unit | note |
|---|---|---|---|---|
| drafts | 8.6 M | 25.2 % | 350-530 k, 35-105 min per 153 s film | 2 of 3 drafts are discarded by design |
| build lanes | 6.7 M | 19.6 % | not itemised | arsenal lanes B1-B7 etc. |
| select + findings rounds | 3.8 M | 11.1 % | r1 216 k, r2 94 k (pass-every-time) | |
| Opus revisions and re-cuts | 2.3 M | 6.7 % | 490-530 k per re-cut, 5-8 h wall | wall is accumulation export |
| research | 2.2 M | 6.5 % | 100-250 k per lane | |
| briefs | 1.6 M | 4.7 % | 154 k | |
| judges and audits | 0.9 M | 2.6 % | blind rubric judge 220-290 k | |
| not itemised in the baseline | 8.0 M | 23.5 % | | owner to confirm what these were |

One film (pass-every-time, MEASURES.md): research 277 k + brief 154 k + draft a 455 k + draft b 526 k + select r1 216 k
+ r2 94 k + final revision 228 k = 1,950 k; Opus 538 k (28 %), Sonnet 1,412 k (72 %); tool rounds 0 tokens, 4 min each.
The losing draft alone is 526 k = 27 % of the film.

Why, mechanism by mechanism (the first three are inferences from file sizes; E0 in section 6 measures them):

1. **Contexts re-read per agent.** A drafter is told to read its skill and references. Sizes (wc -c): atelier-draft
   SKILL 8 KB + references 154 KB (chain-recipes 60, p5-index 48, kit2-contract 19, gate-rows 15, knob-catalogue 11) +
   kit2 README 20 KB + four arsenal cards 30 KB + the topic package 45 KB + HANDOFF and DECISIONS 25 KB = about 280 KB,
   roughly 70 k tokens (4 B/token, est.) before the first line of film.js, per agent, and carried through every turn.
   Three drafters pay it three times (about 210 k) and a drafter needs a fraction of it (its own chain's 2-3 cards).
2. **Whole-film rewrites.** Each draft writes the whole film: film.js 74 KB (about 19 k output tokens) plus 130-216
   knobs. The Opus final revision rewrote the render path of lib/film.src.js (59 KB) and edited film.json with a
   series of revise_wow*.py scripts (15, 15, 3 KB). A one-clause change (settle of one move) costs a re-read of 59 KB.
3. **Judges doing instrument work by hand.** The blind judge's method (WOW-SCORE, "Method") is: decode MP4 to 320x180
   grey, per-frame mean |diff|, "visible motion" = share of pixels changing > 12/255 at >= 0.2 %, gold-pixel mask centroid
   traces for overshoot, anticipation and settle, 40x40 patch sigma for grain, diff spikes for cuts. grep finds no
   script for it in the repo (no file contains "320x180"); each judge and each re-cut director (REVISION-wow2 "Measured
   like the judge") rebuilds it in its own turns. That is most of the 220-290 k.
4. **Findings that a rule could have raised.** The 17 findings of two Opus rounds on pass-every-time (310 k tokens) fall
   in five kinds: new-number dwell under the 2.5 s floor (4: m3T1, c44of, c22End, cRatio), a label shown before its
   target has landed (5: min27T0/T1, cMin27, cMin27End, prT0), caption wraps to two lines (4: cap0, cap2, cap25, cap29),
   low mark-to-floor contrast (2: ghostMix, plateMix), text over a moving field (2: qIn, bookT1). Every one is a
   knob or caption edit, which is all apply_findings.py accepts.
5. **Self-assessment drift.** REVISION-wow2 self-scored 22/44; the blind judge gave the previous cut 13/44 (wow2 unscored).
6. **Research re-fetching.** WebFetch is blocked; lanes use WebSearch snippets and re-run similar queries (100-250 k per
   lane, no shared cache; AI-ECONOMICS-2026 and AI-ADOPTION-2026 were produced by one 277 k lane pair).
7. **Wall time is machine time, not agent time.** Round 1 and 2 re-cuts: 5 and 8 h in accumulation exports (12.9 s/frame
   with mean 6.75 sub-frames; 4590 frames; 3 shards on a 4-core box). A strip of 307 frames at samples 8 is 5.7-10.4
   s/frame, i.e. 29-53 min. The preview rule (samples 2, about 1 s/frame) is right and must be in the DAG, not in prose.
8. **Load couples to correctness.** Draft b "gate FAIL G1 under load only". Eight parallel browsers on 4 cores will
   produce this again unless renders take a lock (section 4).

## 2. The deterministic-first rule

Rule: if a check can be written as a function of files (film.json, claims.json, frames, export.json, DOM at seeked
times) it is a script with a number and a threshold; a model is called only for what has no threshold. A model may
propose, a script decides. Scripts live in factory/tools/ and write JSON next to the film (measures.json).

Two hooks make most of the rest scriptable:
- `window.__film.trace(t)` (kit2, read-only, a pure function of t): `{cam:{pos,aim,fov}, objects:[{id, xy, h_frac,
  speed_px_s, target_fill}], text:[{id, opacity, bbox, layer}], post:{bloom, dof, chroma}, events:[{id, kind, t}]}`.
  It also lets G6/G11 see canvas-drawn text, which they cannot today. Cost: about 1 day (est.).
- knobs_doc gains `drives: ["P18.sigma"]` and `chain: [knobA, knobB]` so a knob is tied to the measure it moves
  and pairs move together (m3T1 with c44of). Without it a model must guess the knob; with it `tune.py` needs none.

### 2.1 The 22 rubric properties (WOW-MOTION section 9)

Class A = data exists today, script ~50-150 lines. B = scriptable after the trace hook. C = needs a reader.

| P | measure by script | class | script (new unless noted) |
|---|---|---|---|
| P1 easing | ease name of every move > 5 % travel; velocity asymmetry from trace | B | `ease_audit` in measure.mjs |
| P2 settle | 98 % of travel to last pixel diff ≥ 0.2 % (judge metric) | A | `motion.py` (windows from film.json moves/knobs) |
| P3 overshoot | closed form exp(-pi z / sqrt(1-z^2)): z .72 gives 3.8 %, z .83 gives 0.94 % (matches the films' 3.9 % and 1 %); plus trace | A | `spring_check` |
| P4 anticipation | counter-move share before start, trace position | B | `motion.py` |
| P5 follow-through | lag of shadow/dim/glow vs body in frames, from lag knobs (shLag, dimLag) and trace | B | `motion.py` |
| P6 stagger | per-line offsets and wave length from DOM opacity at 30 fps | B | `text_trace` |
| P7 one hero | top / second speed per moving frame (>= 3x in 90 %) | B | `motion.py` on trace speeds |
| P8 joins | hard cuts: frame-diff spike at join times (A); anchor carried at the same screen position (C) | A / C | `cuts.py`; reader for anchor |
| P9 speed ramp | declared ramp ratio; pixel speed of column top before/after | B | `motion.py` |
| P10 text entrance | frames from opacity 0 to > 0.9 per text item, captions excluded | B | `text_trace` |
| P11 rhythm | gap histogram: >= 40 % of gaps <= 0.3 s, >= 15 % >= 1.2 s | A | `rhythm.py` over events (like G12) |
| P12 beat grid | starts within +-2 frames of grid | A | G12 exists |
| P13 shot scale | subject h_frac per shot, macro/medium/wide classes | B | `shots.py` (needs declared `subject`) |
| P14 number arrival | tabular (computed style + width variance), last 10 % >= 40 % of time, values in claims | A | `counters.py`; G5c exists |
| P15 leaders | dot then stroke draw >= 6 frames then label | B | `text_trace` |
| P16 ladder | luma max <= 96 %, 0.1st percentile >= 2 %, >= 4 histogram steps | A | `luma.py` on 6 PNGs |
| P17 shadow + rim | params from knobs (two layers, rim 8-16 %) | B | `knob_audit` |
| P18 grain | temporal sigma of 40x40 flat patches 1-3 %, changes each frame | A | `grain.py` |
| P19 restraint | bloom <= 0.35, DoF <= 1/20 s, chroma <= 1 px; A/B render with effect at 0, diff below threshold | A | `knob_audit` + `ab_diff` |
| P20 lens + drift | fov 18-35, drift on holds 1-2 % | B | `knob_audit` |
| P21 blur | shutter and N from export.json; ghost spacing <= 1.5 px | A | `export_audit` |
| P22 silent beats | caption hold >= 1.3 s + 0.06 s/char (G12b); flash/ring at landing times | A | G12 + `rhythm.py` |

Count: A 10 (P2, P3, P11, P12, P14, P16, P18, P19, P21, P22), B 11 (P1, P4-P7, P9, P10, P13, P15, P17, P20), C 1
(P8, whose hard-cut half is class A and whose anchor-identity half needs a reader). So 21 of 22 are scriptable after about 1 day of hook work, and
the judge's 220-290 k becomes `measure.mjs` (0 tokens, est. 3-5 min at samples 1) plus one Opus read of a 2 KB table.

What still needs a reader (and why Opus, blind): (a) P8 anchor identity; (b) ranking between drafts or cuts; (c) "does a
lay viewer see the claim" (truth legibility, seat.json `truth[]`); (d) taste and originality (seat). The risk that a
script passes a flat film is real (G12 100 % on a cut the judge scored 13/44): scripts bound the floor, the reader
owns the ceiling, so the Opus pass stays (section 4).

### 2.2 Gate rows G1-G12

All twelve are already scripts (gate.mjs, 10-20 s). Gaps:

| gap | fix | cost |
|---|---|---|
| G6/G11 cannot see canvas-drawn text (the row says so) | read `trace().text` | in the trace hook |
| G12 is WARN-only (D16) and has no dwell rule | add (d): a new number holds >= 2.5 s before the next one replaces it (the "T1 floor" that 4 findings cited); add (e): caption renders on one line (<= 51 chars or DOM line count 1; 4 findings) | 40 lines |
| no row for the rubric | G13 "rubric": runs measure.mjs, WARN first, FAIL on a starred property at 0 (P1, P2, P7, P10, P19) by a dated D-row | 60 lines + 1 decision row |
| gate runs only on the assembled page | `scene_check.mjs` runs G1/G2/G3/G11 on one scene module alone | 120 lines |

### 2.3 Findings (apply_findings.py targets)

| kind (n of 17) | script that raises it | script that fixes it |
|---|---|---|
| dwell < 2.5 s (4) | G12(d) | `tune.py`: shift the later knob up to its documented range, along `chain` |
| label before landing (5) | trace: label t vs `target_fill` < 0.5 | `tune.py`: move label knob to the t where fill >= 0.5 |
| caption wraps (4) | G12(e) | `rebalance_captions.py`: if t1 allows, split; else a Haiku card shortens to <= 51 chars, no new digit |
| contrast (2) | `luma.py`: mark-floor delta-L vs a per-brand threshold the reader sets once | `tune.py` bisection on the `drives` knob |
| text over moving field (2) | trace: text bbox vs object bbox overlap during a move | `tune.py` delays text knob to the settle time |

Needs a model: caption shortening (language), choosing among two knobs when `drives` is missing, anything that is a
structural change (a new join, a re-sorted scene). Model-free path covers all 17 findings of pass-every-time if the
hooks exist (8 with the G12 rules alone, 9 with the trace); I have not run it (E2 does).

## 3. Worker taxonomy and the task card

Rule that binds everything: **a worker never reads more than its card**. The card lists every input with a hash;
the orchestrator stages exactly those files (copy into work/<card>/in/) and the prompt carries the contract inline.
After the run `audit_reads.py` checks the worker's transcript (Workflow keeps agent-<id>.jsonl) and fails the card on
any Read/Grep/Bash path outside inputs + outputs. CLAUDE.md is injected anyway (1.4 KB, 400 tokens): not a budget item.

| tier | does | does not | input cap | turn cap | token cap (est.) |
|---|---|---|---|---|---|
| script | every measurement, build, gate, assembly, hash, diff, bisection, claim series, caption arithmetic | judge anything with no threshold | n/a | n/a | 0 |
| Haiku | residual of a script: caption shortening to the rule; pick a knob when two `drives` the same measure; write a claims.json entry from a printed number and its formula site; repair a recompute.py that throws; summarise a measures diff into findings JSON | design, code a scene, read film.js | 8 KB (2 k tokens) | 12 | 20 k |
| Sonnet | one scene or one module against a typed contract (9 KB output cap); brief; research digest; the shared "spine" | read other scenes, read the whole kit docs, change the contract | 40 KB (10 k tokens) | 25 | 85 k |
| Opus | the contract (plan); the blind pass over strips + measures.json; the final seat; directives (not code) for structural revision | write film code, run measurements | 120 KB | 15 | 70-110 k |

The owner's Haiku list, corrected against section 2: knob sweeps against a measured target, frame measurement, data
regeneration and the caption arithmetic are scripts; Haiku is only the residual. Claim registration is half and half: a
series of count-in values is a script (revise_wow2 already did it with a script: countTiles 1-115, countTries 4-460 ...);
a claim with a source text is Haiku.

### Card format (card.json, validated by `card.py`; the prompt is generated from it, never hand-written)

```
{ "id": "scene-s3-count", "model": "sonnet", "stage": "scene",
  "inputs": [ {"path": "run/contract/scenes/s3.json", "sha256": "..", "bytes": 2100},
              {"path": "run/excerpts/gl-instances.api.md", "sha256": "..", "bytes": 6400} ],   // total <= 40960
  "contract": "run/contract/scenes/s3.json",      // window, enter/exit pose + state, knob prefix, claims, captions, modules
  "writes": ["lib/scenes/s3.js", "run/knobs/s3.json"],
  "limits": {"turns": 25, "tokens": 110000, "out_bytes": 9216, "wall_min": 30},
  "check": "node factory/tools/scene_check.mjs lib/scenes/s3.js --contract run/contract/scenes/s3.json --json run/checks/s3.json",
  "pass": "run/checks/s3.json: pass == true",
  "fix_rounds": 2,
  "handback": "schemas/handback.json" }
```
Hand-back (enforced through the Workflow `schema` option, so the model retries on a mismatch):
`{card, status: "done|blocked|failed", outputs: [{path, sha256}], check: {cmd, exit, json}, rounds: 0..2,
blockers: [str <= 120 chars], note: str <= 300 chars}`. The orchestrator re-runs `check` itself; the worker's word
about passing is not used. A card that fails after 2 fix rounds is not retried: it is escalated one tier (Haiku to
Sonnet, Sonnet to Opus directive) once, then written to NOTES.md as a warning (the existing stop rule).

Put the constant preamble first, then inputs, then the task line, in case the platform caches a shared prefix (unverified).

## 4. The pipeline as a DAG of cards (one film: 153 s, WebGL, 4 chapters)

```
research ─► brief ─► PLAN(opus) ─► contract_check(script) ─┬─► spine ──────────────┐
 (cache)   (claims                  windows tile [0,dur],  ├─► scene s1 ... s8 ────┼─► assemble ─► build ─► gate G1-G12 + measure
            via script)             poses join, claims     │   (parallel, each     │   (script)   (script)         │
                                    placed once            │    scene_check)       │                               ▼
                                                           └───────────────────────┘                tune r1 (script, Haiku residual)
                                                                                                       │ rebuild, gate, measure (script)
                                                                                                       ▼
 preview export (script, 1080p samples 2) ◄── seat (opus, blind) ◄── regate ◄── scene rewrites (sonnet, <= 2) ◄── OPUS PASS (strips + measures.json)
 master export (script, samples auto, off the critical path)
```

Scene split for pass-every-time: s1 hook 0-12; s2 field 12-40; s3 side view 40-60; s4 re-sort and cut 60-77; s5 ladder
and plane 77-99; s6 PR sheet 99-121; s7 27-minute column and ramp 121-136.5; s8 Monday and card 136.5-153. Code budget: G8 caps film.js + film.json + claims.json at 120 KB and the
shipped film is at 115.1 KB, page 1,299,575 of 1,300,000 B. So the spine holds all shared code (about 20 KB) and a scene
gets <= 9 KB; a scene that needs more must say so in `blockers`, not grow.

Contract (written by Opus, validated by `contract_check.py`, 0 tokens) per scene: `window [t0,t1]`; `enter`/`exit`
`{cam pose, carried objects, state ids}` (exit of s_k equals enter of s_k+1 within epsilon: this is what makes P8
carried joins buildable by different workers); `knobs` prefix (`s3_`; a scene may only add knobs under its prefix; the
assembler rejects collisions); claim ids and caption ids placed in the window; modules and the API excerpt each may call
(excerpts are cut from card.md by `excerpt.py`, so a scene reads 6-8 KB, not 280 KB); `draw(t_local, ctx)` pure in t,
no clock, seeds from `ctx.seed + scene id`.

Orchestration with the Workflow tool (plain JS, no filesystem: scripts run in the session or in the card's `check`):

```
phase 'Scenes': pipeline(cards, c => agent(prompt(c), {model:'sonnet', schema:HANDBACK, label:c.id, phase:'Scenes'}))
   one pipeline, no barrier: a scene that passes goes to the next stage without waiting for the slowest
phase 'Tune':   parallel(residualCards.map(c => () => agent(prompt(c), {model:'haiku', effort:'low', schema:HANDBACK})))
   a barrier is correct here: tune needs all measures from one build
```
Concurrency cap is min(16, CPUs - 2): on this 4-core box that is 2 agents at a time, so 8 scenes cost 4 waves unless
the cap is raised; the estimate below assumes 4 concurrent (box with 8 cores). Prompts must be pure functions of the
card files (no Date, no Math.random in scripts), so Workflow's resume (same script + args = 100 % cache hit, only the
edited call and later ones re-run) also serves as the replay in section 5. Renders take `flock factory/.render.lock`
(one browser at a time for gate, strips and exports; scene_check uses a 2-slot lock) so G1 "under load only" cannot recur.

### Budget per card (est. = from output size: today about 6 k tokens per KB of film code including bootstrap)

| # | card | model | in KB | tokens k (range) | wall min |
|---|---|---|---|---|---|
| 1 | research digest (source cache first) | Sonnet | 25 | 200 (150-277) | 8 |
| 2 | brief (claims via recompute.py script) | Sonnet | 30 | 120 (100-154) | 7 |
| 3 | PLAN: contract for 8 scenes + spine API | Opus | 50 | 70 (50-100) | 8 |
| 4 | contract_check | script | | 0 | 0.1 |
| 5 | spine (shared code, stub scenes) | Sonnet | 40 | 90 (60-120) | 12 (parallel with 6) |
| 6 | scenes s1-s8, parallel | Sonnet x8 | 40 each | 680 (480-880) | 25 (4 at a time) |
| 7 | assemble, build, gate, measure.mjs (strip --every 1 at samples 1) | script | | 0 | 6 |
| 8 | tune r1+r2: tune.py, then Haiku residual (about 6 cards) | script + Haiku | 8 each | 120 (60-180) | 15 (2 x (3 + 5)) |
| 9 | OPUS PASS: reads 26 strips + measures.json + contract, writes findings + <= 2 directives | Opus | 120 | 110 (80-150) | 10 |
| 10 | scene rewrites from directives (0-2) | Sonnet | 40 | 180 (0-200) | 12 |
| 11 | regate, measure, tune r3 if red | script | | 0 | 6 |
| 12 | seat (blind, strips + measures + gate.json) | Opus | 60 | 40 (30-60) | 5 |
| | **total** | | | **1,610 (950-2,000)** | **about 100** |
| | preview export 1080p samples 2 (off the Opus path) | script | | 0 | +26 |
| | master export samples auto | script | | 0 | 4.6 h, async |

Versus today (pass-every-time): 1,950 k and about 3 h (drafts 99 and 97 min in parallel dominate; exports excluded).

| | today | plan | change |
|---|---|---|---|
| tokens, point | 1,950 k | 1,610 k | -17 % |
| tokens, range | | 950-2,000 k | high end +3 % |
| Opus tokens | 538 k | 220 k | -59 % |
| Haiku tokens | 0 | 120 k | |
| model-weighted (ASSUMED Opus 5 : Sonnet 1 : Haiku 0.33, check claude-api pricing) | 4,100 | 2,410 | -41 % |
| wall to a reviewable preview | 180 min | 126 min | -30 % |
| wall to a gated film | 180 min | 100 min | -44 % |
| judge/measurement tokens | 220-290 k per judged cut | 0 + a 2 KB table in the Opus pass | |

Where the 340 k comes from (ledger of changes against the 1,950 k): no second draft -526 k; Opus select/r1/r2 310 k
replaced by an Opus pass of 110 k that reads measures.json instead of re-deriving them -200 k; final revision 228 k
(Opus, code) replaced by 180 k of Sonnet from Opus directives -48 k; research cache -77 k and brief -34 k (the least
certain rows: the cache pays only on a second film from the same sources). Added: scenes 680 k + spine 90 k against one
draft of 455 k +315 k, plan +70 k, tune +120 k, seat +40 k. Net -340 k. The plan gives up three registers per film;
variety survives at one scene if wanted (E1 arm C).

Levers: skip card 10 when measures are green and the Opus pass has no structural finding (-180 k); research as a cache
hit (-200 k); reuse s1/s8 from a scene library (films 2+, not in the estimate; -170 k). 
### 4a. What has to be built first (est. effort; none exists yet)

| item | lines (est.) | unblocks |
|---|---|---|
| `__film.trace(t)` in kit2 + `drives`/`chain` in knobs_doc | 150 + schema | class B, tune.py, G6/G11 on canvas text |
| `measure.mjs` + `luma.py`, `grain.py`, `motion.py`, `rhythm.py`, `cuts.py`, `counters.py` | 700 | judge replacement, G13 |
| `tune.py`, `rebalance_captions.py`, `claims_from_series.py` | 350 | Haiku residual only |
| `card.py`, `excerpt.py`, `contract_check.py`, `scene_check.mjs`, `audit_reads.py` | 600 | the DAG |
| `ledger.py`, `compare_runs.py` | 200 | section 5 |
| G12(d)(e), G13, one D-row | 100 + decision | gate coverage |

About 2,100 lines of scripts, a day or two of Sonnet lanes (est. 1.0 M tokens once), paid back in about 2-3 films.

## 5. Replication guarantees

Goal: a run can be re-executed and compared. Models are not deterministic, so the guarantee is layered: scripts replay
byte for byte, stored model outputs replay exactly, and a fresh model run is accepted by the same checks, not by
equality.

1. **Seeds fixed** (law): film.json `seed`; scene seed = hash(seed, scene id); the accumulation sub-times are declared and
   seeded (D15); grain re-seeds from frame index at 15 Hz.
2. **Hashes everywhere.** card.json lists sha256 of every input and output; the assembled film.js, film.json,
   claims.json, the built page (catalogue.py already records the page hash and tests/proofs.sh rebuilds against it, D10),
   frames.json (per-frame file hash at samples 1; accumulated frames carry export.json N and are hashed from the
   verified determinism pass, "IDENTICAL on every verified frame"), gate.json, measures.json.
3. **Measurements as files.** gate.json (rows with data), measures.json (every P with value, threshold, pass, the frames or
   times used), tune.report.json, findings.rN.json with the measure each finding cites. No claim about a film exists only
   in a hand-back or a REVISION.md sentence.
4. **Run ledger** `runs/<run-id>/ledger.jsonl`, one line per card: card id, model, prompt sha, input shas, output shas,
   check json sha, turns, wall, tokens (input, cache read, cache write, output as the platform reports them), read-audit
   result. The pipeline skill already says "record every lane's tokens the moment its notification arrives; it is not
   persisted elsewhere": `ledger.py` makes that a file.
5. **Three replay levels** (`compare_runs.py runs/A runs/B` prints a diff table with tolerances):
   - L0 scripts only, same stored outputs: every hash equal, gate.json rows equal, measures within 0 (frames from samples 1) or
     within the recorded accumulation tolerance. Pass = all equal. This is the proof that nothing depends on the session.
   - L1 Workflow resume of the same script and args: cached agent results replay, so L0 follows; an edited card re-runs only
     itself and what follows.
   - L2 fresh model run of the same cards: not equal by construction; accepted when every check passes and measures.json is
     within the card's declared tolerance. Variation between L2 runs is itself a measure (E1 uses it).
6. **No hand edits between rounds** (existing rule): film.json changes only by apply_findings.py, tune.py or an idempotent
   lib/revise_*.py (run twice, same bytes; a test asserts it).

## 6. Risks and the two experiments

| risk | evidence it matters | mitigation |
|---|---|---|
| R1 splitting costs quality: seams, drift of ease/ink between scenes, shared state (camera, ladder, plane carried across joins) | rubric P8 (4 of 4 carried joins in wow2) and P7 depend on cross-scene continuity | contract `enter`/`exit`, seam check (pose and frame-diff at each join +-3 frames), spine owns look and camera, Opus pass sees the whole film |
| R2 coordination overhead eats the saving | bootstrap x8, contract 70 k, spine 90 k; high end of the range is 2.0 M against 1.95 M today | measure the per-card fixed cost first (E0), split only to the number of scenes where it wins |
| R3 code size: G8 120 KB, film at 115.1 KB | 8 scenes duplicating helpers would break G8 | spine owns helpers; scene cap 9 KB; `contract_check` sums caps |
| R4 scripts pass a flat film (Goodhart) | G12 100 % on a cut scored 13/44 | G13 only floors; the Opus pass and seat remain; thresholds set by a reader once per brand and written down |
| R5 Haiku tune loops oscillate or trade one measure for another | knobs interact (paired findings) | tune.py accepts a step only if the target improves and no other measure drops past tolerance; 2 rounds; then a warning in NOTES.md |
| R6 concurrency vs 4 cores | G1 failed "under load only" | locks; a 2-slot scene_check lock; count the lock waits in the ledger |
| R7 accounting unknown | the 34.1 M may mix cached and uncached input | E0: log usage fields per agent for one pass-through; all estimates above are rescaled by the result |

**E0 (precondition, 1 day, no film).** Run one existing drafter card and one selector card with transcripts kept; extract
per-turn input, cache read, cache write, output, turn count, files read. Output: the fixed bootstrap `a` and the marginal
cost `b` per KB of output, per model. Pass condition: a scene-card estimate with +-25 % error against its actual run.
If 8 x (scene bootstrap) exceeds the single-draft bootstrap, split into 3-4 larger scenes instead of 8.

**E1 · does splitting hold quality and save tokens?** Film: one 75 s case film with 4 beats (cheaper than the 153 s one),
a fresh topic with a package. Arms, each run twice (6 runs): A = today's single Sonnet draft + select/r1/r2 by Opus; B = this
DAG with 4 scenes; C = B with scene s2 drafted by 2 Sonnet workers in two registers and picked by the Opus pass (variety
kept at one scene). Measures, all from files: ledger tokens (total, Opus share), wall to gated, gate result and fix rounds
used, measures.json total score /44 and starred zeros, seam defects (pose delta above epsilon or a frame-diff spike above the
film's own median + 5 sigma at a join), G11 instances, and a blind Opus ranking of the six final strips with arm labels
removed. Pass condition, all of: (1) B median tokens <= 0.80 x A; (2) B wall to gated <= 0.60 x A; (3) B auto-score >=
A - 2 and no starred property at 0 in B; (4) 0 seam defects in 4 of 4 B runs; (5) gate PASS within the 2 fix rounds in 4 of 4
B runs; (6) in the blind ranking B is not ranked below A in more than 1 of the 2 pairings (n is small; it can only veto).
Decision: all six pass, adopt B for new films; (1) fails but (2)-(6) pass, adopt B only where wall matters; (3), (4) or (6)
fails, keep A and use the scripts (sections 2 and 3) on A, which still removes the judge and the Opus code reading.

**E2 · can scripts and Haiku do the findings?** Replay set: the 17 findings of pass-every-time (r1 12, r2 5) on the film
as it stood before r1 (git history of film.json; the repo has the build and frames). Build the five detectors (G12 d, e,
trace label-vs-fill, luma contrast, text-vs-field) and `tune.py`; run: detectors, then tune.py, then Haiku cards for what
is left, two rounds, no Opus. Measures: detection recall (how many of the 17 findings' targets the detectors flag at the
same time +-1 s), false positives (flags not in the 17: each reviewed once by a reader and counted as real or noise),
fix rate (flagged targets in bar after 2 rounds), regressions (any other measure worse than its tolerance), tokens,
gate verdict. Pass condition, all of: recall >= 14 of 17 (82 %); false positives <= 5 and >= half judged real; fix rate
>= 80 % of flagged; 0 regressions; gate PASS; total tokens <= 120 k (the Opus rounds cost 310 k). If recall passes but the fix
rate fails, keep detectors and let Sonnet apply; if recall fails, the rubric's reader-only share is larger than section 2.1
claims and the table is corrected.

Order: E0, the half of 4a that E2 needs, E2, the rest of 4a, E1. E2 is cheap (est. under 400 k tokens with the scripts)
and removes the largest certain cost (judges, Opus reading code) even if E1 says no.

## 7. Owner decisions needed

Confirm the 8.0 M not itemised and whether the 34.1 M counts cached input; approve a D-row for G13 (WARN-first) and the
read-only `__film.trace` hook; decide the concurrency (cap is 2 agents on this 4-core box); approve E0 and E2 now, E1 after.
