# VIZGEN-METHODS-2026 · what the 2026 viz-generation papers mean for our pipeline (lane R-R2, Wave RELIABILITY, 2026-10-11)

Question: DataMagic, PlotCraft, VIS-GEN, FigTree, Sci-VBench and Co-Director each generate charts, figures or videos with
models. Which of their ideas belong in a pipeline whose laws are a pure render(t, state), seeded, silent, every digit a
claim? Short answer: the idea worth taking is a declarative scene spec that sits between the brief and film.js, checked by
scripts. The model critic loops are not worth taking. Our knobs are about a third of a spec; the other two thirds are in
beats.md prose and in film.js.

Grades. A = opened or run here (cloned repo files, our own files). B = quoted from search-result text that reproduces an
arXiv abstract or page (WebFetch and curl to arxiv.org are blocked by egress; I read no full PDF). C = one aggregator.
No number below is better than B unless marked A. Quotes are search snippets, not the papers' own typesetting.

## 1. The papers, one paragraph each

**DataMagic** (HKUST(GZ) and China Unicom; arXiv 2609.33403, "Authoring Data Videos through Declarative Multi-Agent
Orchestration", accepted IEEE VIS 2026 per the repo page, B; a VLDB 2026 demo version is arXiv 2606.20388, "Transforming
Tabular Data into Data Insight Video"). Core object: DVSpec, "a declarative specification that unifies charts, narration,
and animations with data-bound references and declarative synchronization, ensuring data provenance and automatic
audio-visual alignment" (B). It is "rendering-library agnostic"; the system renders charts with D3 and videos with Remotion
(B). Generation is "Generate-then-Orchestrate": candidate scenes are made in parallel, then a global pass orders them for
coherence (B). Roles on the project page: Story Planner, Data Manager, Visual Designer, Narration Director, Animation
Coordinator, Rendering Engine (B). Numbers: "even the most advanced LLM (e.g., GPT-5) achieves only 2.13/5 with execution
success rates between 48.62% and 86.24%; DataMagic improves quality to 3.89 (+83%) with success rates above 95%" (B;
3.89 / 2.13 = 1.83 checks). The 109 real-world samples are attributed to the demo paper 2606.20388 (B); I could not confirm
the long paper uses the same set. The score is a model-judged 1-5 quality scale; the abstract snippet gives no ablation.
Our wave note ("3.89/5 vs 2.13") is confirmed at B. Repo: github.com/HKUSTDial/DataMagic (A, see below).

**PlotCraft / PlotCraftor / SynthVis-30K** (Zhang et al., Qwen team and universities; arXiv 2511.00010, v1 Oct 2025, v2
Jan 2026; ICML 2026 poster, B). A benchmark of about 1k tasks ("982 tasks, 48 chart types, 8 domains" in the README, A;
"seven high-level visualization tasks" in the abstract, B) that tests single-turn generation and multi-turn refinement;
23 LLMs evaluated (B). SynthVis-30K is 20,000 single-turn plus 10,000 multi-turn instances made by a "collaborative agent
framework" (appendix per snippet, B). PlotCraftor is a code model trained on it, built on Qwen3-Coder-30B-A3B (a Figure 1
caption per snippet, B), "comparable" to leading proprietary models on VisEval, PandasPlotBench and PlotCraft, with a
reported gain above 50 % on hard tasks (B). A first search also gave "6.16 among open-source models, nearly identical to
Claude-4-Sonnet (6.20)" from the appendix (C: a second search could not confirm it, and it did not confirm "7B"). It is
data-to-static-plot code. Nothing in it animates. Repo: Speakn0w/PlotCraft-Benchmark holds a README and two images (A); the
data and scripts live in QwenLM/Qwen3-Coder (not cloned).

**VIS-GEN** (arXiv 2609.26208, "Beyond Static Charts: Can Language and Vision-Language Models Generate Interactive Data
Visualization Interfaces?"; B). A benchmark for generating interactive visualization interfaces from a query plus dataset
metadata; 14 open and closed LLMs/VLMs tested (B). Size "3,042 samples" from an aggregator (C), built from 400
expert-written seed queries plus about 2,700 LLM-expanded candidates (B). Its proposed framework, per the abstract:
intent extraction, an intermediate interface representation, candidate interface synthesis, constraint-aware critique, and
validation-driven self-refinement. Gain: final pass rate +25.1 points for GPT-4o and +15.9 points for Claude-4.5-Opus (B).
So the owner's "+16" is the stronger model's figure; the weaker model gained more. "Pass" is an executable-interface check,
not a taste score. Repo github.com/vis-nlp/VIS-GEN exists but holds a LICENSE and a 9-byte README (A): nothing to read.

**FigTree** (Song, Ci, Zhang, Bu, Liu; UCSB, CUHK Show Lab, NUS; arXiv 2609.01006, "Figures as Programs: Recursive
Generation of Editable Scientific Figures"; B). It turns a paper into a vector figure: ground the content in the paper,
split the figure into a hierarchy of nested regions, write each region as a short SVG program, assemble the fragments. A
critic looks at the rendered image and the program together, so a visual defect is traced to a statement and repaired there.
On PaperBananaBench it is best on all four reference-based dimensions, +9.59 overall over Crafter (the strongest baseline)
and +23.63 over PaperBanana; against Crafter the gains are faithfulness +8.56, conciseness +8.90, readability +2.74,
aesthetics +1.37 (B, from a search summary of the arXiv HTML). Editing claim: better efficiency than raster methods at the
same number of rounds (B). I found no public code (B). The domain is a static methodology figure from a paper.

**Sci-VBench** (Zhejiang, UCAS, Tongji, Yale; arXiv 2608.09873; B). 1,253 expert-annotated examples, 60 subjects, four
disciplines; 16 proprietary and open models scored on text-to-video; "perceptual-quality scores bunch together, while
scientific correctness varies widely" (B); one aggregator gives 1.63 (best open) to 3.34 (top proprietary) on Scientific
and Causal Correctness (C). It scores generated video, not authored data video, so it is a measurement paper for us. Its
code (sci-vbench/sci-vbench, A, cloned) is the useful part: four dimensions (Prompt Grounding, Scientific and Causal
Correctness, Spatiotemporal Consistency, Low-level Perceptual Fidelity); the judge scores ONE dimension per request against
that dimension's five anchored 1-5 levels "so evidence for one dimension cannot bleed into another"; chain of thought on,
a justification before the score, `--num_rounds 3` and the mean reported; perceptual fidelity is also computed by script
(the mean of six VBench metrics) and compared with the judge's own LPF score.

**Co-Director** (Google; arXiv 2604.24842; COLM 2026; B). Generative video storytelling as global optimisation: an
Orchestrator over pre-production (brief, storyline, storyboard), production (keyframes, clips, audio) and post-production
agents; a multi-armed bandit explores a factored creative action space; an MLLM judge scores the final video and its
factored reward goes back to the bandit; local self-refinement loops inside agents; evaluated on GenAD-Bench, 400 scenarios
(B). Built on Gemini and Veo. It targets "semantic drift and cascading failures in chained agentic pipelines" (B), which is
the same failure we call seams (SWARM-DESIGN R1).

### 1.1 Repo reading (A): what is and is not public
- DataMagic: the public repo is docs plus a coding-agent skill. "Full production source code", prompts and templates are
  "not yet public" (docs/release-status.md). The real content is `skills/datamagic/rules/dvspec.md` (296 lines, the
  schema as prose and JSON), `scene-planning.md` (five narrative patterns), `self-review.md` (a six-section checklist).
  So there is no DVSpec validator to run, and the orchestration that earned 3.89 is closed. We can copy the shape, not code.
- Process note: I cloned DataMagic without checking its size first (423 MB, over the 200 MB limit; the weight was
  `cards/` 159 MB, `assets/` 64 MB and `.git` 198 MB). I deleted those three; /home/user/data/DataMagic is 3.2 MB (docs,
  skills, README). /home/user/data/PlotCraft-Benchmark (5 MB) and /home/user/data/sci-vbench (0.2 MB) are intact, .git removed.

## 2. DVSpec beside film.json + claims.json (the pass-every-time film is the specimen)

DVSpec as published in `dvspec.md` (A): `{meta{title,fps,width,height,language,mode}, scenes[]}`; a scene is a 5-tuple
`{id, type, content, narration[], animation[]}` with type in opening | chart | stat_cards | narrative_card | closing;
`content.data_binding {x,y,color,size,label}` names source columns (validated: x a dimension, y a measure, color <= 8
values), plus `filters`, `sort`, `highlight`; `narration` is an ordered list of sentences whose times come from TTS;
`animation[]` is `{type: enter|emphasis|exit, target_data: {column: value}, trigger: <narration index | null>, style}`.
Duration is derived from audio. Two ideas carry it: semantic referencing (`target_data` finds the marks for a data record,
so it survives a chart-type switch) and narration-indexed timing (`trigger: 1` means "when the second sentence plays").

Ours, pass-every-time (A, from the files): film.json has 4 chapters, 29 captions `[t0,t1,text]`, `count.at`, `cuts`
(empty), `beat` 0.5, `look`, `libs`, and 216 knobs with a `knobs_doc` row each (`range|options`, `step`, `what`); the
knob table is written by lib/make_film_json.py, the one source of truth, and build.py refuses an undocumented knob.
claims.json has 30 claims, all with `formula` and `source` (grade A/B/C and a url), 17 with `renders`. film.js is 1,201
lines / 74.8 KB, reads knobs once (`const KN`), and has one assertion that the trial table matches the claims (line 580).

| axis | DVSpec | film.json + claims.json + film.js | what ours lacks |
|---|---|---|---|
| unit of structure | `scenes[]` with id, type, content | `chapters[]` (4 windows) only; structures S1-S4 and moves M1-M4 are prose in topics/<id>/beats.md and code in film.js | scene objects with ids; nothing machine-readable says which scene a claim, caption or knob belongs to |
| data to marks | `data_binding` names columns; `filters`, `sort`; validated against the table | `params` numbers + a data file read in film.js; marks placed by code; cubes chosen by seeded id sets | a declarative binding; the data-to-mark rule is only readable by reading code |
| addressing a mark by data key | `target_data {category: "Software"}` | none; ids are stable (invariant I1) but addressed in code | semantic reference; so no way to say "pulse task 17" outside film.js |
| narration to data | free sentences; digits not bound (their own example prints "exceeded 50 %" and "25 % growth" as text) | captions are silent text; G5b matches every caption digit to some claim `value` at printed precision | match is by value, not by id: a caption cannot say which claim it carries; a coincidental value passes |
| animation | `animation[]` as data: type, target, trigger, style | motion-curves tokens in code; timings are knobs; G12 finds "move starts" by knob NAME pattern (`…T0`, `t<Upper>…`) | no animation layer as data; the schedule is 216 numbers plus a naming convention the gate parses |
| sync | `trigger` = narration index; times derived from audio | absolute seconds on a 0.5 s beat grid; checked after the fact (G12: >= 80 % of starts within +-2 frames; caption hold >= 1.3 s + 0.06 s/char) | sync is verified, never derived: moving one caption does not move the animation it introduces |
| provenance | "data grounding" via field refs; provenance-based Q&A in the UI (B) | per number: `id,text,value,formula,source`; G5a runs the formula in a vm and compares to `value`; sources graded A/B/C with url | per mark: `where` is free text on 30 of 30 claims, `appears_at` is set on 0 of 30; G5c sees digits on screen but not which claim a mark shows |
| coverage | none stated | G5b/G5c check digits on screen are claims; nothing checks every claim IS on screen | the converse check: claims never shown pass silently |
| validation | prose checklist (columns exist, <= 8 colours, narration fits duration); no code in the public repo | executable: build.py refusals, gate G1-G12, frames purity at three times | ours is stronger here |
| edit surface | spec is shared state for canvas edits, script edits and NL commands (B) | knobs and captions only, through apply_findings.py (<= 60 chars, no new digit, chapter shift <= 2 s) | narrower by law; keep it |
| renderer / look | rendering-library agnostic | kit2 injects brand, chrome, material (32 of 32 cells PASS) | we decouple the look, not the structure |

Reading the table: our claims layer is stricter than theirs (a formula is executed, a source is graded). Their spec layer
is thinner than ours in rules but exists as data; we have no data form of "what is in each scene and when". The honest
status of our knobs as a spec: they are the parameter layer (timings, sizes, camera poses, mixes: 216 here; about 91 are
timing knobs by a name test I ran, approximate) and none of them chooses a module, a data column or a mark. Structure is in
the prose of beats.md ("chain: gl-instances `field` -> `stack`, gl-camera-rig, gl-volume cut plane, gl-labels") and then
re-expressed by a drafter in film.js. The callout table around film.js 1003-1013 already has the DVSpec shape:
`[KN.cPass, 'a.pass', '' + P.passed, 'PASSED · A LIT CUBE', 'count', cnt(P.passed, 3, ARR.lit, 'countLit (claims.json)…')]`
is time, key, value, label, kind and a claim reference, written as a code literal. Lifting that table out is the
cheapest first step. lib/assemble.py and lib/make_film_json.py in the film show we already generate film.json from a table.

## 3. What to adopt, with the cost

### 3.1 A scene spec that drafters fill (`scenes.json`), staged
Not a copy of DVSpec: it must carry our things (windows on a beat grid, structures from the arsenal, camera keys, claims).
Sketch of v0 (one scene, enough to be checkable):

    { "scenes": [ { "id": "s3-count", "chapter": "count", "window": ["m2T0", "c22End"],
        "structure": { "module": "gl-instances", "layout": "stack", "data": "data/tau_retail_trials.json",
                       "bind": { "unit": "task_id", "cube": "trial", "lit": "reward==1" }, "pick": "lit" },
        "camera": { "from": "side", "to": "side", "ease": "hold" },
        "callouts": [ { "at": "c44", "end": "c44End", "claim": "all4", "label": "PASSED ALL FOUR", "kind": "count" } ],
        "captions": [ 17, 18 ],                       // indexes into film.json captions
        "says": { "17": ["all4"], "18": ["none4"] },   // caption index -> claim ids
        "events": [ { "id": "m2", "kind": "re-sort", "t0": "m2T0", "t1": "m2T1", "invariants": ["I1","I2","I3","I4"] } ],
        "after": [ { "event": "m2", "dt": 0.5, "start": "c44" } ] } ] }   // optional: knob default derived from an event

Every time field is a knob name, so the spec stays inside the knob table and apply_findings.py still works unchanged. The
`after` form is DVSpec's narration-indexed trigger in our terms: a knob default may be written relative to an event and
resolved to absolute seconds at build time, so render(t) never sees it and the beat grid still binds.

How far are we? Three steps, with cost (my estimates, not measured):
1. Check-only (about 1 day): extract scenes.json from film.json, the callout table and beats.md for pass-every-time;
   `spec_check.py` verifies caption -> claim ids, callout -> claim ids, every time field is an in-range knob, every claim's
   `where` resolves to a scene id, scene windows tile the chapters, events do not overlap beyond the one-hero rule. No film
   byte changes. This is experiment E1 and is the go/no-go for the rest.
2. Generate the tables (about 3 days): lib/make_film_json.py and a new `emit_tables.py` write chapters, captions and the
   callout table from scenes.json; film.js keeps the drawing code. A drafter's brief becomes "fill scenes.json, write only
   the scene functions". The existing `film.src.js` + `assemble.py` split in the film is the seam.
3. Compile a chain (2 weeks, not recommended until 1 and 2 show value): gl-instances / gl-camera-rig / gl-labels scene
   functions emitted from `structure`. This is DataMagic's "premium templates" step; they kept theirs closed, which is a
   hint at the cost. Skip it for now: the arsenal modules already are the templates.
Where it pays: drafters stop re-deriving the structure from prose (the draft lane is 8.6 M tokens, 25 % of the session,
two of three drafts discarded by design: SWARM-DESIGN §1), select reads a spec and a gate table instead of strips, and
swarm task cards (SWARM-DESIGN §3) get a typed contract for free: a scene card's contract IS a scenes.json entry.

### 3.2 A render-critic loop driven by scripts (rubric.mjs, gate.mjs), not a model
FigTree's useful property is not the model critic. It is that a defect is traced to a statement, so the repair is local.
We already have the same property with a tighter surface: a finding names a knob or a caption index (apply_findings.py),
never code. What is missing is the front half, a detector that writes the finding. Loop:
build (kit2) -> gate.mjs (G1-G12) + frames.mjs + rubric.mjs (not in factory/tools yet; SWARM-DESIGN §4a plans measure.mjs,
G13 and `tune.py`) -> detectors emit findings.rN.json with the measure that raised each -> apply_findings.py -> rebuild;
at most two rounds (CLAUDE.md), a step is kept only if its target measure improves and no other measure falls past its
tolerance, stop at a fixed point. The model is called for three things only: a caption shortened to the rule, a choice
between two knobs when `drives` is missing, and the blind rank. The rendered-image-plus-code reading FigTree does maps to
frames + `__film.trace(t)` + `knobs_doc.drives` (SWARM-DESIGN §2). Co-Director's bandit over a factored action space maps to
`tune.py` over knob groups, with rubric.mjs as the reward instead of an MLLM judge (zero model tokens, replayable).
Cost: the detectors and tune.py are already priced in SWARM-DESIGN (about 700 + 350 lines); the glue (findings emitter, step
acceptance rule) is about half a day. Evidence to date is only SWARM-DESIGN's estimate that 17 of 17 pass-every-time
findings are scriptable (not yet run). E2 below is the smoke test.
From Sci-VBench, for the one reader pass that stays: score one rubric property per request against its anchored levels,
take the mean of three rounds, and put the script measure next to the judge's (they did this for LPF). Their finding that
perceptual scores bunch while correctness spreads matches ours: G12 hit 100 % on a cut the judge scored 13/44, so scripts
bound the floor and the reader owns the ceiling.

### 3.3 VIS-GEN's candidate - critique - refine as our two-draft blind select
Mapping (the stages are the same; the order differs):

| VIS-GEN | ours today | change |
|---|---|---|
| intent extraction | brief.md, claims.json, beats.md | none |
| intermediate representation | none (prose beats) | scenes.json (3.1) |
| multiple candidates | 2 drafts (WAVE) or 3 (PIPELINE.md); different look and motion | none |
| constraint-aware critique, per candidate | gate.json per draft (G1-G12), then Opus reads strips | run gate + rubric + the coverage check on EVERY draft first; the constraints come from the intent (claims.json) |
| validation-driven self-refinement | apply_findings r1/r2 on the winner only | keep: refining both drafts doubles tool cost for little |
Two concrete adoptions. (a) Pre-filter: a draft with a FAIL row, or that misses a claim, is not shown to Opus; if both
survive, Opus ranks. Zero model tokens. E3 tests whether script ranking would have agreed with the past Opus picks. (b) Add
the one critique constraint we lack, from their "constraint derived from intent": G14 claims coverage, i.e. every claim
with `renders` must appear in the visible text at some t inside its scene window (about 100 lines on the sampling G5c
already does). Today 0 of 30 claims have `appears_at`, so a dropped callout passes the gate.
Caution on the evidence: VIS-GEN's +25.1 / +15.9 points are pass-rate gains on executable interfaces, larger for the weaker
model. Ours is a best-of-2 on taste plus gate, and we have no measured gain of two drafts over one (SWARM-DESIGN E1 would
measure it). Do not quote their number as ours.

### 3.4 FigTree's hierarchy as scene cards
Our film is already a depth-2 tree: film -> chapter -> scene. FigTree adds one rule worth stealing: the PARENT owns the
connections. In card terms (SWARM-DESIGN §3): the contract/spine owns camera poses at joins, `cuts[]`, carried state and
the beat grid; a scene card may only draw inside its window and must start and end at the pose the parent declares
(`enter`/`exit`). Defects are then reported by scene id (`scene_check.mjs` = G1/G2/G3/G11 on one module), so a repair is
local, which is FigTree's point. Cost: nothing beyond the 600 lines of card tooling in SWARM-DESIGN §4a; FigTree adds the
justification, not work. Weight the evidence low: it is static figures, one benchmark, B-grade, no code.

### 3.5 Small, cheap, now
- Per-property judge calls with anchored levels (Sci-VBench judge design): prompt change only.
- G14 claims coverage (above): about 100 lines.
- `says` and `where` made machine-readable (caption index -> claim ids; claim -> scene id): a schema change in claims.json
  that the current gate ignores; G5b keeps working on values.

## 4. What not to adopt, and why

| idea | source | why not | what we keep instead |
|---|---|---|---|
| duration and triggers derived from TTS audio | DataMagic | the film is silent; time is the one clock; durations are caption holds (1.3 s + 0.06 s per char) | event-relative knob defaults resolved at build (`after`), not at render |
| free-text narration containing numbers | DataMagic | their own example prints "exceeded 50 %" and "25 % growth" with no binding; breaks "every digit is a claim" | G5b by value, plus `says` ids |
| a model critic inside the loop | VIS-GEN critique, FigTree vision critic, Co-Director MLLM judge | not replayable (SWARM-DESIGN levels L0/L1 need scripts to replay byte for byte); Goodhart risk; Sci-VBench itself needs 3 rounds to average judge noise | scripts decide, a blind Opus pass ranks and owns taste |
| bandit over whole-video rollouts | Co-Director | each arm is a full render (0.5-1.7 s/frame, 153 s film) and an MLLM reward; we have 2 drafts | coordinate search over knobs with rubric.mjs reward (tune.py) |
| view-time generation: Q&A that inserts a new scene, NL edits in the viewer | DataMagic UI | breaks no runtime fetch, fixed seeds, pure render(t), one honest line | edits only by apply_findings at build |
| Remotion, D3, a hosted renderer, premium closed templates | DataMagic | vendored p5 and fonts only; byte-reproducible builds (catalogue hash) | kit2 + arsenal |
| a chart-type menu (bar, line, pie, radar, sankey) as the scene vocabulary | DVSpec `chart_type` | our scenes are arsenal chains with a camera argument (R-E perspective shifts), not a chart gallery | `structure.module` + `layout` |
| unbounded recursive decomposition, model-written SVG for geometry | FigTree | depth 2 is enough (film, chapter, scene); model-written geometry is not pure of t by construction | scene modules <= 9 KB against a contract |
| fine-tuning a code model, 30K synthetic instances | PlotCraft / PlotCraftor | no training infrastructure; the task there is static plot code; our constraint is the arsenal API | from PlotCraft keep only the habit of reporting single-turn vs multi-turn: first-gate pass and pass after r2 per draft |
| scoring on a model-judged 1-5 "quality" as the ship test | DataMagic, Sci-VBench judge | no threshold, noisy; our ship test is gate PASS + rubric floor + blind seat | judge for ranking only |

Law check for what we do adopt: scenes.json compiles to the same pure render(t, state) (the spec is build input, the page
is unchanged: a film without a spec rebuilds byte-identical, as `beat` already does); seeds stay in film.json; the spec
strengthens "every digit a claim" (`says`, coverage); captions stay in film.json and the page stays silent; no runtime
fetch; the exec level (ink) is untouched; the CETI card stays last because the chapter windows must tile to `dur`.

## 5. Three experiments (each <= 1 day, no model tokens unless stated, pass conditions fixed in advance)

**E1 · Spec lift (is the spec extractable from what exists?).** Input: factory/films/pass-every-time (film.json, claims.json,
the callout table in film.js, topics/pass-every-time/beats.md). Build `extract_spec.py` (scenes.json) and `spec_check.py`.
Pass conditions, all of: (1) the extractor fills >= 90 % of the 30 claims' scene ids and every one of the 29 captions'
claim ids without manual edits (the remainder listed, not patched); (2) spec_check run on 6 injected faults (a caption digit
changed, a claim id renamed, a callout knob moved outside its range, a callout placed before its count, a `says` id that
does not exist, a scene window leaving a chapter gap) catches 6 of 6 and reports 0 findings on the unmodified film or lists
each as a real defect with the film second; (3) the built page sha256 is unchanged (spec is not yet an input to the
build). Fail reading: if (1) is under 70 %, structure is not recoverable from prose and code, so the spec must be authored
by the drafter first and the stage 2 estimate (3 days) is too low. Then stop at G14.

**E2 · Script-only critic loop on injected defects (does build -> detect -> apply -> rebuild close without a model?).** Take
a copy of pass-every-time and perturb six knobs/captions to create known defects: a number held < 2.5 s, a caption over 51
characters, a label knob earlier than the landing it labels, a callout deleted (claim never shown), a text knob over a moving
field, a chapter boundary moved 3 s. Detectors: G12 plus a dwell rule, the caption-length rule, label-vs-landing from
knob order, and the G14 coverage check; fixer: apply_findings.py with a `tune.py` stub (shift a knob along its documented
range). Pass conditions, all of: >= 5 of 6 detected and >= 5 of 6 repaired in <= 2 rounds; gate PASS at the end; no knob
outside `knobs_doc`; no repaired measure makes another fall past its tolerance; running the loop twice gives identical
film.json bytes. The deleted-callout defect is the one that no current row catches; it must be flagged by G14. If the loop
repairs <= 3, the detectors need `drives` metadata first and SWARM-DESIGN E2 comes before any further work here.

**E3 · Prefilter-then-select against the Opus record (could a script have made the pick?).** Ten films already have two
drafts, a gate.json per draft and a SELECT.md (a-bell-from-dice, how-a-network-learns, noether-applied, noether-frontier,
noether-symmetry, one-query, pass-every-time, simpsons-3d, who-gains, women-and-children; simpsons-3d has three drafts).
Script a rank from the recorded files only: FAIL count, WARN count, G12 share, G11 instances, bytes, s/frame (from
frames.json). Parse each SELECT.md for the winner. Pass conditions: (1) the script rank equals the Opus winner on >= 7 of
10; (2) a draft with a gate FAIL won the Opus pick in at most 1 of 10 (else the prefilter would have removed a winner; list
which row, and note G1 failures that were host load, as in pass-every-time draft b); (3) on the disagreements, a one-line
reason from SELECT.md that no script row can see (picture quality, claim legibility), so we know the share that needs the
reader. If (1) and (2) hold, the pipeline may skip the Opus pick when exactly one draft is clean and send Opus only the
close calls (saving one select call, about 216 k tokens in the pass-every-time record, per decided film). If (1) fails,
keep Opus select and use the script table as its input only. Caveat: the picks and the gates are not independent
(Opus saw gate.json); this measures agreement, not correctness.

## 6. Order, and what I could not settle

Order: E1 (gates the spec work), E3 (free, informs the select stage now), E2 (needs the G14 detector from E1's checker).
Stage 1 of 3.1 and G14 are worth doing even if E2 fails: they close a hole the gate has today (a claim never shown passes).

Not settled: all paper numbers are from search snippets (no PDF read); DataMagic's 109-sample set belongs to the demo paper
as far as I can tell; the PlotCraftor 6.16 / 6.20 figure is C and the "7B" in the brief is wrong or at least unconfirmed
(Qwen3-Coder-30B-A3B per a figure caption, B); VIS-GEN's 3,042 is C; FigTree and Sci-VBench numbers are B and C
respectively; the DataMagic score is a model-judged quality scale with no stated ablation in what I read. My knob counts
(216, about 91 timing by name) and line counts are from our files (A) but the timing split is a regex, not a schema. No
code from any of these papers was run. Artifact and git: none (research file only, no commit).

Sources (search results, B/C unless marked): arxiv.org/abs/2609.33403 and /html/2609.33403v1 (DataMagic), arxiv.org/abs/2606.20388
(DataMagic demo), datamagic-home.github.io, github.com/HKUSTDial/DataMagic (A, cloned), arxiv.org/abs/2511.00010 and
icml.cc/virtual/2026/poster/64044 (PlotCraft), github.com/Speakn0w/PlotCraft-Benchmark (A), arxiv.org/abs/2609.26208
(VIS-GEN), github.com/vis-nlp/VIS-GEN (A, empty), arxiv.org/abs/2609.01006 (FigTree), arxiv.org/abs/2608.09873 and
github.com/sci-vbench/sci-vbench (A) (Sci-VBench), arxiv.org/abs/2604.24842 (Co-Director).
