# BLUEPRINT: the CETI master explainer plugin

For Manu Mulaveesala, CETI.AI. Senior advisor's decision document, 2026-10-08. Inputs: C1, C2, C3 (decisive), P0, R1–R17. Where the consults disagree, this document rules and says why. [unverified] marks a claim I could not check in this container.

Checked by me beyond the reports: the vendored p5 sha256 (`bb8b82b9…ce559`); every §6 API name is present in that bundle (string match only); `AgentLoop.exact` (`atelier.js:266-268`) matches the simulator at `:276-288`, so C2's oracle formula is right; the repo's `skills/operadic-interview/scripts/treelint.py` passes the Atelier `INTERVIEW.md` (0 critical, 2 warnings), so C3's "missing treelint" exists; grasp expected values recompute from N=500, k=20 (179.2 ± 21.4, 392.7 ± 18.4 at 2 sd), realised values not verified; `feature/explainer-atelier` sits at `d6a12de`, nothing landed.

---

## 1. Verdict in ten lines

1. The master plugin is one Claude Code plugin (repo root = plugin root): one runtime (Atelier core with `svg`, `p2d`, `webgl` renderers), one toolchain (`cetix`), one law table, one gate, one two-instrument crit (C2 §a,b; C3 §a).
2. It makes films (Glance to Master, with six channel projections) and new art-direction plugins via `cetix new chrome --standalone`, each inheriting the clock, Belief law, gate and crit, so no chrome can be built below the bar (C2 §d).
3. It is a factory with a measuring instrument, not a gallery of eight looks: three flagships (one conditional), four reworks, three films retired with kernels kept (C3 §d2).
4. It is not a second runtime, not a host for harness or sheaf skills (`contrib/`), and not a store of built binaries (films repo on LFS) (C2 §c).
5. Its edge over both experiments is mechanism: compose-time pedagogy laws, sourced Numbers, re-seek purity, independent truth recompute, and gates calibrated on our own known-bad films (C3 §a4).
6. Today's gate cannot discriminate: 160 of 160 rows PASS while 3 of 8 natives are not true (C3 finding 1; R12; R13). Closing that gap comes before any new look.
7. Legibility is measured in phone pixels: today's 14-frame-px floor is 5.8 px on a phone (C3 finding 2).
8. p5 must earn its bytes (COUNT, CONSERVATION or RESPONSE); everything else stays SVG (C3 §b3).
9. The merge lands in two commits (proven sources, then portable build plus CI), then a gated roadmap (§7).
10. **Quality bar: a film ships only when every number on screen is computed and typed, every claim survives an independent recompute, every frame is a pure function of (t, state, seed), must-read text is legible on a 390-px phone, and isolated seats prefer it to the version before, judged by gates that have each first failed a known-bad film.**

---

## 2. The core ideas, isolated

Each of these survived both experiments, was confirmed by a crit or a gate, and costs little to enforce.

| # | Principle | Mechanical form | Why it survived |
|---|---|---|---|
| 1 | **Clock law and determinism gate** | Frame pure in (t, state, seed); `CLOCK` scan plus `ctx.pure` runtime guards; `PURE-REP`, `PURE-ORD`, `PURE-XPROC` | The two real leaks (`dFdx` after `discard`, blits outside the source rect) passed the scan; only re-seek caught them (C1 CLOCK; R12:125) |
| 2 | **One Material; modules never draw** | Modules and cameras emit only Material verbs; one Arrangement id per film; unknown mark kinds throw | One graph on two Materials (stitch, plate) proved the seam (C1 §d); silent no-op kinds were a real bug (R3 §8.4) |
| 3 | **Typed beat graph, hard laws, sourced tags, written waivers** | Typed data and learner-state ports; each law in `laws.js` has a `src` tag; soft laws need `{law, reason}` | Negatives reproduce their FAILs (P0 §6); the grasp MAX waiver shows the form (`grasp.check.json`) |
| 4 | **Belief law; typed Numbers; "sketch" tag** | Every digit is `ctx.N(q,{expected/realised, sd, N, source})` or tagged given/sketch; guard at the Material boundary; `audit()` | "±21" (true 18.4) and "exact ±" shipped; only a recompute caught them (R13 d1-2) |
| 5 | **Twin worlds on CRN; expected vs realised under the evidence** | Paired conditions share draws (CRN); faint exact curve, √N band, "realised X vs expected Y ± 2 sd" | The viewer sees which runs a check saved; one run teaches linear 0.05k (R5 §3) |
| 6 | **Commit before reveal, page holds** | No reveal or anchor before the commit (P1); defaults never anchor; page holds live, MP4 caption says "pause" | Grade B evidence (R14); Exposure's "70%" before the commit anchored the guess (R13 d9) |
| 7 | **Mark rule: "each mark is one ___"** | `markRule {unit, step, address, save, cost}`; every draw op has a role; cost marks = redone steps | Best frames are physical marks at true scale; 5 of 8 films left cost as words (C3 finding 3; R13 §3) |
| 8 | **Semantic colour fixed across grounds** | Copper #CE9A6A expected, sage #8FA985 saved, peach #D88B5C error/address, slate #6E8CA8 structure; light retune ≤20° hue, copper ≠ peach; ground free | Meaning must survive a chrome change; the runtime contradicted its own "invariant" comment (C2 bug 6; C1 ROLE) |
| 9 | **The levels ladder** | Glance ~30 s, Grasp ~2 min, Wield (acts), Master (explores); caps 2/4/3+1/5; audience matrix derived, never hand-filled | The hand-filled matrix broke its caps and P7/P12 in four cells (C1 §c; R14 §3) |
| 10 | **Channels as projections of one timeline** | Six channels read the compiled timeline; never edit it or invent a number | System 1 shipped six channels from one plan with QA (R8 §6) |
| 11 | **Two-instrument crit with truth veto** | Blinded craft juror on sheets; pedagogy critic on NOTES, .srt, `claims.json`, recompute; FALSE leaves the ranking | The juror's top film (Marbling-native 5/5/5) was partly false (R13 §2-3) |
| 12 | **The interview instrument** | Typed tree, 72 slots, depth 4, nine ★ minimum, `treelint`; collapsed-vs-composed gap is a finding; HARD findings block | F2 (no shared kernel) surfaced only this way (C3 §c); tool verified in the repo |
| 13 | **Defect → rule → law loop** | Record `{id, src, evidence, rule, test, bad fixture, good fixture}`; closed only when bad fails and good passes | `laws.js` did this for P1, INV, P7, LEGIBLE, then the loop stopped (C3 §a5) |
| 14 | **Routing as configuration** | Tiers, seat isolation and revise cap in one YAML (§4) | Routing was prose only; a shared manifest leaked intent to seats (R15; R17 tell 14) |

**Explicitly NOT part of the plugin** (C1 §b "Drop", C3 §d2, R13): the eight chromes as a canon (each is an optional Material); the AgentLoop as the only engine (the plugin defines C1 §b's neutral `Engine` contract: `units, outcome, address, events, truth, pair, cost`; p=.95, c=.8 and the Acme trace are benchmark fixtures, pending Q11); the house tics (copper countdown modal in 7 of 8 shared films, twin panels, header strip, identical footer, closing slogan); hard-coded copy ("4 slips in 5", "14 sign-offs") and the "exact ±" readout; System 1's phase fractions as evidence, its 8 unbuilt PO kinds and chrome-dependent role hues; the 110 KB cap on p5 pages, cream/vermilion as default, 1000×464 outside the episode tier; per-chrome `make.sh`/`build.sh`, the three duplicate gate/render/build tools, the `ce/` copy and the four forked kernels; the bridge's dependency on the `Studio` global; SwiftShader timings as budgets.

---

## 3. Architecture

**Adopted from C2 unchanged:** one runtime (Atelier core plus renderer seam) split into `clock, engine, score, tokens, player, film, renderers/*, adapters/*`; film-def v2 (a superset of v0.1, so all 20 films run unchanged); the `ctx` additions (`host, ex, N, stream, pure, rm`) and `__atelier` v2 hooks (`hash, layout, audit, fonts, snapshot, version`); `cetix` with one `film.json` (`cetix-film/2`) and one gate report (`cetix-gate/1`); vendored p5 and WOFF fonts with `fonts.lock.json`; inline page plus CDN artifact fragment; films repo on LFS with `films.lock.json`; packaging under `${CLAUDE_PLUGIN_ROOT}` (C2 §a-d).

**My changes to C2:**

| # | Change | Why |
|---|---|---|
| Δ1 | `operadic-interview` stays in `skills/`. `noether-harness` and `sheaf-*` move to `contrib/` as C2 says. | The interview is core principle 12, and its `treelint.py` is the only working copy (verified). C2 lists it for `contrib/`, R9 §5 for another repo. |
| Δ2 | Replace C2 §d's frame-px floors (18/16/14/10) with phone floors: must-read ≥28 u at 960-u width (11.4 CSS px at 390, 11.7 at the gate's 400); count mark ≥7 u (~3 px); `am.js:63-72` minimums re-expressed in this unit | C2 copied AM's frame-px minimums (R10 §2), which are 5.8 px on a phone (C3 finding 2). C3's 26 u vs System 1's 28 u (R8 §6): take the stricter |
| Δ3 | Mark-rule slots are engine-neutral: `{unit, step, address, save, cost}` (C3). C2's `{run, step, slip, check, expected}` becomes the AgentLoop binding of those slots. | C1 §b forbids modules from naming "agent", "check" or "retry". |
| Δ4 | The atelier-tier total page cap is C2's 1.7 MB, not C3 §d4's 2 MB. | Observed pages are 1.38–1.60 MB (R2), so the tighter cap holds today. |
| Δ5 | Commit 1 lands in P0's staging layout. The moves to C2's final layout happen in commit 2, protected by goldens (§7). | P0 is the only layout proven to build. Moving files and changing path resolution in the same unguarded commit is the riskiest step. |
| Δ6 | `cetix lint` dispatches to both linters (C2). By the end of M4 the law table is one `laws.js`: once the beat graph carries phase metadata (introduces, labels, cue, hold, payoff), System 1's L3–L5, L8 and L9 port into it, and `lint_plan.mjs` becomes a plan→graph front end. | C1 base decision: AM lacks phase metadata, so those laws cannot yet run on graphs. Two law tables would drift. |
| Δ7 | Add the "ink" Material [prop, unbuilt]. Text and numbers are written as SVG, and mass layers are drawn on canvas on the `svg-layers` renderer. It becomes the default CETI Material for non-chrome films (M7). | C1 §d. It fixes the phone legibility failures that every canvas film showed, without a second runtime. |

**Repo tree** (`feature/explainer-atelier` after commit 2; C2 §c with Δ1):

```
.claude-plugin/plugin.json
skills/            atelier (router) · explainer-plan · explainer-film · chrome-forge · p5-studio · p5-concept
                   p5-forge · p5-crit · p5-ship · ceti-explainer · ceti-brand · ceti-research · operadic-interview
runtime/src/       clock.js engine.js score.js tokens.js player.js film.js renderers/{p5,svg,svg-layers}.js
                   adapters/{episode,feature}.js studio/ (recovered sketch-line runtime)
runtime/dist/      atelier.js atelier.sha256        (committed, rebuilt and diffed in CI)
runtime/tools/     gate.mjs snapshot.mjs audit-overlaps.js
library/operad/    am.js laws.js compose.js check.mjs operad.json registry.json
library/modules/   one registry: 14 AM beats + System 1 modules
library/plan/      module.js compile.js lint_plan.mjs po/ roles.js layout.js
library/materials/ stitch plate pen isotype maps sediment gear (+ ink, M7)
library/cameras/   cameras.js
chromes/<id>/      NOTES.md README.md chrome.json <id>.kit.js shared.film.js native.film.js film.json×2 gate.config.json
films/             svg/{self-attention,oauth,tcp,binary-search} base-rate/ typesafe/ grasp/
scripts/           cetix/ (package) cetix (entry) channels/ requirements.txt
references/        doctrine tells anti-patterns technique-atlas operad eval-stack p5/ tokens/ method/ atelier/ research/
templates/         sketch.html chrome/ material/ film/ plan/ calibration/
vendor/            p5-2.3.4.min.js SHA256SUMS fonts/*.woff fonts.lock.json licenses/
tests/             node/ py/ calibration/<id>/ baselines/ fixtures/ defects/ (defect records, §5)
eval/ notebooks/ docs/ contrib/ .github/workflows/ci.yml
```

Git ignores `build/`, `out/`, `_npm/`, mp4, wav, srt, `*.artifact.html` and built `<id>.html` (each chrome's `build/` is 3.3-4.2 MB). The films repo `ceti-explainer-films` (LFS) holds built pages, stills, sheets, MP4s and channel outputs; the main repo keeps `films.lock.json` (id, tier, page sha256, LFS path, gate-report hash) and baselines. `cetix publish` writes both.

**Size budgets per tier** (C2 §b, `SIZE` row):

| Tier | Code bytes | Total offline | Artifact fragment |
|---|---|---|---|
| episode (svg) | ≤110 KB (128 KB by written decision if the core pushes it over; C2 estimate +10 KB [unverified]) | ≤320 KB | ≤320 KB |
| feature (svg ± layers) | ≤260 KB | ≤520 KB | same |
| atelier (p5) | ≤330 KB | ≤1.7 MB | ≤700 KB |

---

## 4. The generation pipeline

End to end, for a new chrome plugin or a new explainer; no stage starts until the previous exit test passes.

| # | Stage | Produces | Executor | Exit test |
|---|---|---|---|---|
| 0 | **Interview** (per film family, then after each wave) | Answered tree; numbered findings Q-M… | sonnet drafts, human answers | `treelint` PASS, the nine ★ answered, no open HARD finding (C3 §c) |
| 1 | **Art direction card** | One page: material, `markRule` five slots, ground, hue deltas against role tokens, type pair with licences, the impossibility moment, Never list, nearest tropes, perf budget. Five candidate approaches; the lowest-typicality one that serves the intent is chosen (p5-concept, R15) | Fable | The card names a mark rule true for every element and one moment no DOM or SVG tween could make (AD v1 §2) |
| 2 | **NOTES-first** | `NOTES.md` ≤700 words: mark rule, doctrine answers, beat sheets, heroes, iteration log | Fable writes, opus reads | Word cap; beat sheet compiles to `chapters` (NOTES-SYNC within 1 s) |
| 3 | **Scaffold** `cetix new chrome <id> --renderer p2d\|webgl [--standalone]` | The eight items of C2 §d: NOTES, kit, two films, `chrome.json`, `film.json`×2 plus gate config, Material adapter, registry entry, calibration fixtures | script | The scaffold passes `cetix lint` and G1–G3 as an empty film |
| 4 | **Forge** | Kernel, Material verbs, beat graph by the C1 §c selection procedure, films | opus | `cetix lint` 0 hard; self-render of 8 stills reviewed by the builder |
| 5 | **Gate** G1–G9 (§5) | `cetix-gate/1` JSON | scripts; haiku runs fixtures and extracts claims | All HARD rows PASS; soft rows waived in writing |
| 6 | **Seats** | One packet per seat, isolated by directory; verdicts with packet hash | Fable and sonnet per routing | Release = min over seats (§5) |
| 7 | **Revise** ≤3 | Each pass is one named edit (SwapTechnique, Reweight, Subtract, Retime), re-gated and re-seated pairwise against the previous version | opus | After pass 3 the human chooses ship, cut or rework |
| 8 | **Ship** | Inline `<id>.html`, artifact fragment, channels, and, with `--standalone`, `ceti-chrome-<id>/` with its own `plugin.json` and `skills/<id>-chrome/SKILL.md` | script | `SIZE`, `ARTIFACT` and G7 pass; `cetix doctor` passes inside the standalone plugin |
| 9 | **Capture** | `cetix publish` to the films repo and lock; LEDGER and tells updated; each defect found → a record in `tests/defects/` | haiku | Every new defect has a bad fixture |
| 10 | **Calibration** | `calibration.json` TP/FP/FN and self-agreement per gate and seat | `cetix calibrate` | FN = 0 on HARD fixtures, FP ≤10% on known-good, seat self-agreement ≥0.8; re-run on any gate or seat-prompt change |

**Routing config** (ships as `references/routing.yaml`; tier names, not pinned model IDs, which are pinned at install [unverified which IDs]):

```yaml
routing:
  haiku:  [read, inventory, grep-numbers, contact-sheet-build, claims-extract, fixture-run, capture]
  sonnet: [consult, research-lanes, interview-draft,
           seats: [colour, intent, metric-auditor, wonder]]
  opus:   [build, forge, revise, module-code, advise]      # never a seat on its own build
  fable:  [art-direction, notes, juror, pedagogy-critic,
           seats: [cliche, composition, craft]]
  escalate: any seat with self-agreement < 0.8 on its fixtures moves up one tier
  isolation: {packets: by-directory, shared_manifest: false, builder_as_seat: false, order: randomised}
revise:    {max_passes: 3, named_edits_only: true, re_seat: pairwise_swap, after_3: human_decides}
notes_first: {file: NOTES.md, max_words: 700, sync_gate: NOTES-SYNC, tolerance_s: 1.0}
interview: {when: [per-family, after-wave], min: nine-star, lint: treelint, hard_finding_blocks: true}
stills:    {count: 8-10, must_include: [title, impossibility, commit, payoff, last], juror_rounds_before_mp4: 2}
```

One change to C3's routing: `notes` moves to Fable. NOTES is the art direction in writing, so the one who wants the look is not the one who builds it, the same separation the seats rely on.

---

## 5. The quality system

C3 §a is adopted. The gates run in order from cheap to expensive. Seats are never spent on a film that fails G1–G9.

| Gate | Rows (C2 names, plus C3 additions) | Class |
|---|---|---|
| G1 Mechanical | LOAD live, LOAD film, CAPTIONS (≤90 chars), AUDIO, SIZE, ARTIFACT | HARD |
| G2 Purity | PURE-REP (5 t), PURE-ORD (5 pairs), PURE-XPROC (`hash(t)` vs baselines) | HARD |
| G3 Clock | CLOCK source scan over film, kits and kernels; runtime guards around draw, setup, engine, score and meta | HARD |
| G4 Laws | The unified hard laws (below), plus COST (cost marks = redone steps), UNITS, SEED-PICK and NOTES-SYNC; MAX and P12 soft | HARD / SOFT |
| G5 Numbers | META with an independent oracle; META-COVERAGE (≥1 checked row, or "no engine numbers" declared); ENGINE; TRUTH-recompute over `claims.json` (each claim tagged engine, theorem, literature or sketch) | HARD |
| G6 Legibility | LEGIB400 at 28 u (Δ2); LAYOUT-400; REGIONS/OVERLAP; FONTS (declared weight and style equal the file's); 320-px thumbnail render | HARD |
| G7 Channels | `qa.py`: dominant element ≥35% of safe area, dHash ≤12/256, type minima, brand once | HARD per shipped channel |
| G8 Seed sweep | N = 8 dev, 32 series, 64 release; claim signs hold, realised within 2 sd, checked above unchecked | HARD at d4 rates |
| G9 Fingerprint | 25 tropes (3 or more fire = fail); batch house-tic and sibling dHash | **SOFT until calibrated, then HARD** |

Two rulings. **G9:** C3 makes it HARD, C1 soft (the dHash batch is a proposal). It is promoted to HARD only when `cetix calibrate` shows it fails the seven-countdown-modal fixture with FP ≤10% on known-good; the same probation applies to every new row. **Seeds:** C1 SEED-PICK and C3's "first seed with |z| ≤0.5, logged in `SEED.json`" agree; the rule is fixed before any frame is viewed and also applies to the twin difference.

**Headline laws.** The full unified table is in C1 §a and is not reproduced here.

| Law | Rule | H/S |
|---|---|---|
| CLOCK, CRN | Pure frames; paired conditions share draws | H |
| NO-DRAW, ONE-OBJECT | Only Material verbs; one Arrangement id | H |
| BELIEF, EXPECTED-WORD | Typed Numbers; never "exact" beside ±; write "expected x ± 2 sd" | H |
| SEED-PICK, VISIBLE-N | No outcome-chosen seeds; expected gap ≥2 sd at the film's N | H |
| P1 COMMIT-FIRST, REQ-PRED | No anchor before commit; ≥1 PCR at Grasp+ for T1/T4/T5/T7/T8 | H (soft at Glance) |
| P2 COUNT-FIRST | Count before percent (executives exempt) | H |
| P7 COST-MARK | Every intervention's cost is a mark | H |
| ONE-ENCODING, UNITS | One encoding per quantity; one glyph, one value | H |
| ROLE, LEGIBLE | Semantic hues fixed; must-read ≥28 u, measured at 400 px | H |
| TRUTH-VETO | A FALSE claim blocks ranking | H |
| MAX | Caps 2 / 4 / 3+1 / 5 | S |
| CHANNEL | Projection only; cannot invent a number | H |

**Seats** (C3 §a2): seven generative seats (Cliché, Composition, Colour, Craft, Intent, Metric auditor, Wonder) plus the Festival juror and the Pedagogy critic; packets isolated by directory with the hash recorded; pairwise in both orders; self-agreement under 0.8 discards the verdict. Release = min over seats: Cliché not REJECT, Juror ≥4/4/3, Pedagogy 0 FALSE and cost ≥5/6, Composition/Colour/Craft/Intent prefer the new version. Wonder never gates; seats more than one step apart go to the human unaveraged.

**Calibration fixtures** (C3 §a4). Each one must produce its expected row.

| Fixture | Kind | Must trip |
|---|---|---|
| base-rate; Run-shared 5.9 s and 32.5 s; Bunraku-shared 11.0 s; Delta-shared 28 s | good | nothing (FP ≤10%) |
| Ledger-native pre-R1, "kept 400" beside "−6" | bad | SEED-PICK, BELIEF |
| Marbling-native pre-R1, "exact inverse" | bad | TRUTH |
| Delta-native "36 to 79 of 100" on 500-run fans | bad | ONE-ENCODING / P2 agreement |
| Escapement caption "buys eight" vs code gain 1.5 | bad | TRUTH |
| Exposure "70%" before the commit | bad | P1 |
| Seven countdown modals | bad | G9 |
| `Math.random` in draw; `dFdx` after `discard`; a 6-px result; a uniform-p Wield; an hourglass worth 100 h and 20 h; a META mutation fixture | synthetic bad | G3; G2; G6; INV; UNITS; G5 |

**Acceptance bar per shipped film** (C3 §d4, with Δ2 and Δ4 applied):

| Criterion | Bar | Today |
|---|---|---|
| Gate | Every HARD row in the profile PASSes; 0 unwaived soft rows | 160/160 PASS, yet 3 of 8 natives not true |
| Legibility | Must-read ≥28 u (11.7 px at 400); count mark ≥7 u; the 320-px thumbnail passes anonymity | 14 frame px = 5.8 phone px |
| Seats | Min-over-seats release; beats the repo's reference episode on the same concept for 2 of 3 non-builder seats | Craft ≥4 in 3 of 16 films; cost 6/6 in 1 of 8 |
| Seed sweep | N=32 (64 release): ≤2% of seeds break a claim sign; ≥95% realised within 2 sd; 100% checked above unchecked; shipped seed \|z\| ≤0.5 | Never run |
| Evidence | 100% of digits typed; every claim tagged; 0 FALSE; 0 untagged PARTIAL | "±21" wrong; "exact ±" in 3 films |
| Cost | ≤1 s/frame headless; boot ≤5 s; page within the §3 tier budget | 0.07–0.9 s; 1.4–1.5 MB |

---

## 6. p5 next level

**Proven ladder** (C3 §b1; SwiftShader headless cost, an ordering not a budget, since no film recorded ms/frame, R10):

| Rung | Technique | Cost/frame | Teaches |
|---|---|---|---|
| 1 | Hungarian repacking | one-off; 0.07 s | Conservation of identities |
| 2 | Involute kinematics | 0.09 s | Tooth count = step count |
| 3 | Falling-paper ODE, tabulated | lookup | Failure as physics |
| 4 | CPU float plate + H&D curve | 0.13 s | More runs sharpen, never brighten |
| 5 | Closed-form inverse maps | 0.20 s | Exact seek on a deformable medium |
| 6 | Dynadraw pen, baked | 0.24 s | Countable human strokes |
| 7 | Stitch atlas, rip-mapped | 0.27 s | 40,000 units as one cloth, macro to micro |
| 8 | Instanced WebGL via data textures | ~0.6 s | 100+ parts, per-unit state, one draw |
| 9 | Analytic shadows + thin-lens DOF | 0.5–0.9 s | Focus as attention; one hero beat |

Best return per cost: rungs 4-7; rungs 8-9 for one hero beat at most (the WebGL films first cost 13-25 s/frame, R12).

**Admission rule** (C3 §b3): a p5 layer earns COUNT (drawn units = `items.length`), CONSERVATION (end id set = start set minus model-declared exits) or RESPONSE (`setState` changes a Number and a pixel region), and its header names which and completes "each mark is one ___". Otherwise it is SVG.

**Frontier adoption order.** Each item ships only after its purity test is a gate row with a bad fixture. All API names are present in the vendored 2.3.4 bundle (my grep); their behaviour in 2.3.4 is [unverified]. R17 tell 2 warns that GitHub-main docs list APIs absent from 2.3.4.

| Order | Capability | Use | Purity test (gate row) | Phase |
|---|---|---|---|---|
| 1 | `splineVertex` | Survival curves and rivers instead of hand-rolled Béziers | Vertex-array hash invariant across re-seeks | M7 |
| 1 | `describe()` | Per-beat text alternative generated from the Numbers table | Every on-screen Number at t appears in `describeText(t)`; identical across re-seeks; written on beat change only | M7 |
| 2 | `saveGif` | Newsletter channel (≤1 MB target, 1.5 MB hard) | Decoded frames match `renderAt` at the sample times after quantisation; fixed-dt stepping | M7 |
| 3 | `textToPoints` / `textToModel` | Titles made of their own units (Run's stitched title as the first ensemble) | Point count and hash identical at two seeds and two sizes; computed in setup only; WOFF static faces only | F1 |
| 4 | p5.strands: `buildFilterShader` first, `buildMaterialShader` only if s/frame fits budget | Grain, bleed and tone-map as GPU passes | `hash(renderAt(7.3))` equal before and after `renderAt(2.0)`; scope holds only t and seed uniforms. (`baseMaterialShader` measured 25 s/frame vs 0.6 s for raw GLSL, R17 tell 25.) | F3 |
| 5 | Framebuffer ping-pong (FLOAT, NEAREST) | Diffusion, cost fields, GPU plate | Replay from 0 and from a fixed-dt checkpoint: max diff 0 on the same renderer, ≤1/255 across renderers | after F3 |
| 6 | Compute / WebGPU with fallback | 10^5–10^6 runs | Integer counts from GPU equal CPU at 5 t (same hashed PRNG, no float reductions). WEBGL/CPU is the film of record; WebGPU is live-only (SwiftShader fails at `mapAsync`, R16) | last, live-only |

Sound stays off the frontier: score events identical across runs, stable WAV hash, and never information absent from the picture.

---

## 7. Merge plan for `feature/explainer-atelier`

**Commit 1: sources in, builds from the repo, Phase 0 proven.**
- *Contents:* P0's staging layout at the repo root (Δ5): `vendor/p5-2.3.4.min.js`, `runtime/{studio,scene-kit}.js`, `skills/p5-explainer/{assets,library}`, `atelier/{runtime,modules,chromes}`, the five sketch-line skills and `references/` (up5, up6), and BRIEF, BUILDER, ART-DIRECTION v0/v1, crit and research notes under `references/`. Measured on the staging tree: about 232 source files, 4.4 MB, of which p5 is 0.97 MB. No `build/`, `out/`, `_npm/`, mp4, wav or built html; `.gitignore` as in §3.
- *Acceptance:* from a clean clone, P0's six results reproduce (escapement build equal to the shipped page modulo `exact`→`expected`, gate 10/10; grasp `check.mjs` PASS with 1 waived MAX; grasp-stitch build; `build_plan` lint PASS; module tests PASS; negatives FAIL). The four episodes still pass `gate.mjs`. Goldens for all 20 films (page sha256, gate JSON, check and lint output) and stills at 5 times via `render.py --stills` go to `tests/baselines/` (P0 has not run `render.py` yet [unverified]).

**Commit 2: `cetix` doctor, vendor and paths; CI.**
- *Contents:* `paths.py` and `tools/root.mjs` (walk up to `plugin.json`; `CETI_ROOT`/`CLAUDE_PLUGIN_ROOT` override); the move to the C2 §c layout with path fixes 1-12 in order (13-14 wait for M5); `cetix doctor` and `cetix vendor verify|fetch|fonts`; `requirements.txt` pinning `playwright==1.56.0` (matches the container's Chromium 1194, P0); `.claude-plugin/plugin.json`; harness and sheaf skills to `contrib/` (Δ1); REQUIREMENTS L26/L30 rewritten to CETI-dark plus the tier table, subject to D2-D3; CI `static` and `gate-smoke` jobs (C2 §c).
- *Acceptance:* every commit-1 golden reproduces from the new layout; `cetix doctor` exits 0; CI green; `cetix vendor fetch` reproduces the p5 sha256, or the build stops for investigation.

**Roadmap after commit 2.** Each phase has a gate. Q runs in parallel with M3–M5.

| Phase | Scope | Gate to exit |
|---|---|---|
| M1 Runtime split | `runtime/src` modules; `cetix build-runtime` | `dist/atelier.js` byte-identical (sha256 prefix `cd580e362d4a`); 5 frame hashes per film match goldens for all 20 |
| M2 Hardening | C2 §e fix-first 1–12: render rescue recount, independent META oracle, `cam.mix` pan, plate scale, sediment fonts, hue comment, `ctx.pure` guards, kernel forks to one source, "exact ±" scan, ledger, escapement and exposure truth defects | Each fix ships with a bad fixture that FAILs before and PASSes after; META mutation fixture FAILs |
| M3 Episode adapter | `Atelier.episode(EXPLAINER)`, profile `episode-8` | `snapshot.mjs` identical at 40 times for all four episodes; code ≤110 KB (or 128 KB by decision) |
| M4 Feature, plan, one law table, channels | Feature adapter; `Film.compile(PLAN)` through it; phase metadata in the graph; L3–L5, L8, L9 into `laws.js` (Δ6); AM beat graph projected into `timeline.mjs` | base-rate reproduces all six channels with G7 PASS; the grasp graph emits channels; one `laws.js` passes all negatives |
| M5 Cleanup | Delete `ce/`, the old shell, and the duplicate gate, render and build tools; path fixes 13–14 | `cetix` matches all 20 goldens; no file outside `cetix` builds a film |
| Q Quality instrument | New rows (LEGIB400, TRUTH, COST, UNITS, SEED-SWEEP, FINGERPRINT, NOTES-SYNC, PURE-XPROC, FONTS); `seat_packets.py`; `claims.json` + `recompute.mjs`; `cetix calibrate`; `tests/defects/` | FN = 0 on every HARD fixture in §5; FP ≤10% on known-good; seat self-agreement ≥0.8 |
| M6 Generator | `cetix new chrome|material` (+ `--standalone`); `chrome-forge` and `atelier` router skills | A scratch chrome scaffolds, lints and passes G1–G3 empty; the standalone plugin passes `cetix doctor` |
| F1 The Run (Glance + Grasp) | From the 120-s grasp-stitch graph; legibility fix, skein-meter cost mark, six channels | Full §5 acceptance bar; becomes the reference film |
| F2 Marbling "Un-combing" | After the TRUTH re-audit; Glance → Grasp | Pedagogy critic 0 FALSE before any seat runs |
| F3 Bunraku with check-placement Wield | WebGL tier; wall and cost-mark fixes; first strands filter trial | G8 seed sweep on a Wield; ≤1 s/frame |
| M7 Ink Material and frontier 1–2 | Δ7; `splineVertex`, `describe`, `saveGif` | Ink re-renders base-rate at 28 u with G6 PASS |
| X Static-equivalent experiment | Equal-information static SVG vs the Run Grasp, n ≥40 per arm, pre-registered, CETI cohorts opt-in; System 1 PCR on/off in the same study | Film beats static by d ≥0.3 on transfer (CI above 0, no recall loss); d <0.2 demotes animated films to channel assets (C3 §d4) |

---

## 8. Decisions for Manu

**Owner-veto decisions** (made by the consults, adopted here, yours to overturn):

| # | Decision | Default | Source |
|---|---|---|---|
| D1 | One player and one runtime for all tiers (SVG episodes become a renderer) | Yes | C2 §a |
| D2 | CETI-dark `#0E1014` is the default. Cream/vermilion becomes the `glaser-paper` preset. Chromes own their grounds, so CETI-dark is never the only dark (BRIEF house habit) | Yes | C2 §c item 15; R5 §1 |
| D3 | Size budgets per tier (§3 table) replace the 110 KB global cap | Yes | C2 §b |
| D4 | Harness and sheaf skills move to `contrib/`, not deleted; operadic-interview stays (Δ1) | Yes | C2 §c; this doc |
| D5 | Chromes: flagship Run-shared, Bunraku, Marbling-native (conditional); rework Marbling-shared, Delta, Margin, Run-native; retire the Ledger, Escapement and Exposure films, keep their kernels (the critic's C-suite pick of Ledger, R13 §2, survives as the re-pack module and ROI page) | Yes | C3 §d2 |
| D6 | The truth veto outranks the juror: a FALSE claim leaves the ranking whatever the craft score | Yes | C3 §a2; C1 TRUTH-VETO |

**Open questions** (C1 §e, one line each):

1. Q-M1: do you talk over the film, or must it stand alone with captions? This sets VERBAL and the audio gate.
2. Q-M2: when Grasp must drop a beat, which goes first: transfer, the second commit, or honesty? The default drops transfer; honesty is never dropped.
3. Q-M3: voice, a music bed, or only the sound of the material?
4. Q-M4: which room comes first: executives, managers or engineers? This sets the level and whether natural frequencies are used.
5. Q-M5: will you opt in to cohort counters of guesses against the truth? This sets EVIDENCE and enables experiment X.
6. Q-M6: how much "sketch" can a slide carry before a CFO distrusts the numbers?
7. Q-M7: what is the next concept after the agent loop: tokens, embeddings, correlated risk or ROI?
8. Q-M8: may a film end on a brand card, or must it end on its material's own last image?
9. May the truth veto always outrank the juror (D6)?
10. Is landscape 960×540 the basis, or phone portrait first?
11. Are the Acme invoice trace and p=.95 the canonical CETI fixtures, or does each concept bring its own?
12. How many Materials ship: ink plus the three flagships (my default), or more?
13. Will you run the untested experiments (static vs animated, PCR on/off) on a real cohort?
14. Is a page-gated commit acceptable live when the MP4 cannot pause?
15. Should executives still get natural frequencies, given the evidence shows no benefit for them?
