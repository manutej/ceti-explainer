# C3: Quality system and p5 frontier for the master plugin

Inputs: R5, R12, R13, R15, R16, R17, R8, R6, R3, R10. R7 did not exist when I read; techniques come from R3, R6, R10, R12. Frames viewed: Bunraku, Run, Escapement, Delta shared sheets; Marbling and Ledger native sheets; grasp-stitch and grasp-plate sheets; margin-native-20.

Three findings that shape everything below:
1. **The gate cannot discriminate.** All 16 gate files PASS (160 rows, 0 FAIL, R12). The critics still found 3 of 8 natives not true (B, E, G), a wrong sd, and a lucky-seed inversion (D). The gate has no truth, cost or real legibility row.
2. **The legibility floor is in the wrong unit.** 14 px is a 960-px frame pixel; on a 400-px phone (scale 0.417) it is 5.8 px. System 1's 28 u = 11.4 CSS px at 390 is correct. Visible in Run 22–32 s labels, Escapement 14–28 s modules, Bunraku 26–34 s wall.
3. **Quality tracks mark scale.** The strongest frames (Bunraku 11.0 s, Run 5.9 s and 32.5 s, Marbling-native 4.6 s and 28.8 s) are physical marks at true scale. The generic ones (Escapement 14.8–25.8 s clock grid, Ledger-native 1.8–11.4 s with an empty lower half, grasp-plate 25 s and 33 s) are small marks plus text.

---

## (a) The quality system as a mechanism

### a1. Doctrine as positive tests (each has an executor and a pass condition)

Positive tests, each with executor: **Mark rule** (gate static + Intent seat: `markRule {unit, step, address, save, cost}` declared, 0 draw ops without a role; unknown mark kinds throw, today they silently draw nothing, R3 §8.4). **Belief** (gate runtime: every digit is an `AM.Number` or tagged given/sketch). **Ruler** (juror: key figure readable with numerals hidden). **Address** (juror, Intent: failure shown where it happened). **Silence** (juror: narratable with captions off). **Impossibility** (juror: one named moment no DOM/SVG tween could make). **Batch** (G9 gate + Cliché seat). **Thumbnail anonymity** (gate renders 320 px; Cliché seat). **Etymology ban** (Intent: mark rule survives without the pun). **One kernel per film** (HOUSE law). 

Banned defaults are a machine list: the 25 fingerprints (R17) plus the house tics the crit found: copper countdown modal (7 of 8 shared films), twin panels, tracked header strip, identical "expected ± sd" footer, framed object on cream (H1/H6), closing slogan, dashboard cone, barcode strips, wallpaper tiles.

### a2. Seats

Seven generative seats (isolated): Cliché hunter, Composition, Colour, Craft, Intent fit, Metric auditor, Wonder (advisory). Two explainer-specific seats: **Festival juror** and **Pedagogy critic**.

| Seat | Packet (and nothing else) | Output |
|---|---|---|
| Cliché hunter | Sheet; sibling sheets; fingerprint list | Nearest trope; REJECT blocks |
| Composition | Sheet; 400-px thumbnails | Pairwise vs previous |
| Colour | Sheet; role-token palette | Pairwise |
| Craft | Sheet; code; gate.json (only seat that sees code) | Defects with line numbers; one change |
| Intent fit | Sheet; mark rule; one witness sentence | Serving intent vs decoration |
| Metric auditor | gate.json; metrics; sheet | KEEP/DISMISS per flag; unflagged problems |
| Wonder | One muted 10-s clip | Advisory only |
| Juror | Sheets only, order randomised, chrome name hidden | Craft, originality, stop (1–5); doctrine checks citing times |
| Pedagogy critic | Sheets, NOTES, .srt, `claims.json`, beat graph, recompute output | TRUTH per claim (PASS/PARTIAL/FALSE); cost score 0–2 on whole runs, rate multiplies, checks cost; phone test |

**Isolation as mechanism.** `seat_packets.py` (missing, R15) writes one directory per seat; each seat is a fresh process that can read only that directory, with no shared manifest (tell 14: a shared manifest leaked intent). The packet hash is recorded in the verdict. The builder never sits; seats never see each other's verdicts. The R13 crit had no randomised order; fix that.

**Aggregation.**
- Pairwise, both orders, no ties. Self-agreement under 0.8 discards the verdict (re-run once). Findings without evidence are struck.
- Release verdict = **min over seats**: Composition, Colour, Craft, Intent prefer new; Cliché is not REJECT; Juror at least 4/4/3; Pedagogy has no FALSE claim.
- Any two seats more than one step apart are logged as DISAGREEMENT and go to the human unaveraged. Wonder never gates.
- **Rank on the combined instrument.** The craft top pick (Marbling-native, 5/5/5) was partly false. A vetoed film leaves the ranking regardless of craft.

### a3. Gates in order, with veto semantics

Cheap and deterministic first. Seats are not spent on a film failing G1–G9. HARD = stop, return the failing row; SOFT = written waiver in `WAIVERS.md`, which the juror reads.

| # | Gate | Content | Class |
|---|---|---|---|
| G1 | Mechanical load | `LOAD live`/`LOAD film`: 0 console errors, charset, boot at most 5 s, not blank | HARD |
| G2 | PURE-REP / PURE-ORD | 5 times re-seeked identical; A→B == B→A at 5 pairs. The real purity gate: the two actual leaks (`dFdx` after `discard`, smoothed blits outside the source rect) passed the token scan and only this row caught them (F10) | HARD |
| G3 | Clock scan | Static ban of frameCount, millis, Date, performance, Math.random, p.random in draw | HARD |
| G4 | Laws | compose-time: TYPE, SEED, P1–P11, CAP, INV, CLOCK, HOUSE, plus the new laws in a6. MAX and P12 are soft | HARD / SOFT |
| G5 | META | Checked rows against `AgentLoop.exact`. New: at least 1 checked row per film or a declared "no engine numbers" (only 3 of 8 natives have any, R12) | HARD |
| G6 | Legibility at 400 px | New. Render at 400 px. Must-read text at least 11 phone px (26 frame px); results never in the smallest face; count-bearing mark at least 3 phone px (Marbling lanes 3.5 pass; Run 0.44 per column fails). Keep scrollWidth row | HARD |
| G7 | Channels QA | System 1 `qa.py`: dominant element at least 35% of safe area, no repeated state (dHash at most 12), type minimums, brand once | HARD per shipped channel |
| G8 | Seed sweep | N=8 dev, 32 series, 64 release. Per seed: sign of every headline claim holds, realised within 2 sd, checked above unchecked | HARD at the rate in (d) |
| G9 | Cliché fingerprint | 25 tropes: 3 or more fire = fail. Batch: a house tic shared with 50% or more of siblings, or sibling dHash too close = fail | HARD |

Metric corridors (R16 note 05) are priors that feed the Metric auditor; they never veto.

### a4. Calibration fixtures

A gate or seat is not trusted until it has run its fixtures. Re-run on every gate or seat-prompt change.
- **Known-good:** System 1 `base-rate` (L1–L13 PASS, 12 demos PASS, six channels); Run-shared 5.9 s and 32.5 s; Bunraku-shared 11.0 s; Delta-shared 28 s.
- **Known-bad, from our own history, each with its expected failing row:**
  - Ledger-native pre-R1, "kept 400" beside "−6" → SEED and BELIEF.
  - Marbling-native pre-R1, "exact inverse" → TRUTH.
  - Delta-native "36 to 79 of 100" as a percentage on 500-run fans → P2 agreement.
  - Escapement-native caption 6 "buys eight" against code gain 1.5 → TRUTH. Exposure "7 of 10: 70%" before commit → P1. Seven countdown modals → G9.
  - Synthetic: `Math.random` in draw (G3); `dFdx` after `discard` (G2); 6-px result label (G6); uniform-p Wield (INV); hourglass worth 100 h and 20 h (UNITS).
- **Tracked rates** in `calibration.json` per gate and seat: TP, FP, FN, self-agreement. Targets: FN = 0 on HARD fixtures; FP at most 10% on known-good; seat self-agreement at least 0.8.
- **Baseline:** the purity gate caught 2 true leaks, no false positive logged. Truth false negatives: at least 3 of 8 natives, because no truth row existed.

### a5. Defect → rule → law loop

Record: `{id, source tag, evidence (film, t), class, rule, test form (static|runtime|seat), bad fixture, good fixture, grade}`. **A defect is closed only when a bad fixture fails and a good fixture passes.** The law goes into `laws.js` with its `src` tag; soft laws carry the waiver rule. laws.js already does this for P1 (CRIT-d9), INV (d10), P7 (CRIT§1), LEGIBLE (CRIT§4); the loop stopped there.

### a6. What the experiments missed, and how to add it

| Gap | Add |
|---|---|
| **Truth veto on native films** | `claims.json`: every caption claim has a tag in {engine, theorem, literature (cited), sketch}. `recompute.mjs` recomputes every number (the "±21" error was caught only this way). Row TRUTH: any FALSE = veto; PARTIAL without a visible "sketch" = veto; any .srt digit not matching a typed Number = veto; flag "exact", "always" beside a ±. Apply first to the craft winner (Marbling-native: "learned from training" over hand-written combs) |
| **Cost as a mark everywhere** | Promote `markRule.cost` from documentation to a check (R3 §8.4). Law P7b: any film with a check draws one cost mark per redone step; runtime assert cost marks drawn == `AgentLoop` redone steps (e.g. 357). Only Delta scored 6/6; five of eight left cost as words |
| **Seed selection rule** | The AD ("never cherry-pick") and juror ("within 0.5 sd") contradict. Fix a rule before viewing frames: shipped seed = first seed with \|z\| at most 0.5 on every headline number, logged in `SEED.json`. "Lucky" claims need a Number ("ran lucky" was hard-coded in D) |
| **Unit-per-glyph** | `units.json`: glyph → quantity and value (hourglass = 20 h). Law UNITS: one glyph, one value per film, legend required (Ledger: 100 h and 20 h) |
| Also | percentage–count agreement (P2 checks order only); sample size against effect (N=60 showed no-check above checked expectation: require effect over 3 sd or draw the dashed expected fill); NOTES-SYNC (durations disagreed across NOTES, README and gate audio in 4 films) |

---

## (b) The p5 capability ladder for explainers

### b1. Proven techniques, ordered by cost per frame

Cost = per frame, headless, no GPU (R3 smoke logs, N=48, k=20; R12 for WebGL). No film recorded ms per frame (R10), so this is an ordering, not a budget; re-measure on a real GPU.

| # | Technique | Cost | What it buys pedagogically |
|---|---|---|---|
| 1 | Hungarian repacking (Kuhn–Munkres, crossing-free) | one-off per beat; isotype frame 0.07 s | Conservation: the same 100 identities move to where they belong; failure is visible, not claimed |
| 2 | Involute kinematics (rack = involute of infinite radius) | closed form; gear frame 0.09 s | Exact meshing: tooth count is the step count |
| 3 | Plate ODE (Andersen–Pesavento–Wang falling paper, RK4, tabulated) | table lookup per frame | Failure as physics, not a cue (caution: a tipping puppet read as carelessness) |
| 4 | CPU float plate with H&D tone curve | 0.13 s | Frequency as exposure: more runs sharpen, never brighten; convergence under the exact field |
| 5 | Jaffer–Lu closed-form inverse maps | 0.20 s, scales with pixels × ops | Exact seek on a deformable medium; honest non-invertibility where noise was not recorded |
| 6 | Dynadraw pen (spring-mass nib, baked rows) | 0.24 s; boot cost if unbaked (43 s once) | A human trace of countable strokes; commit by pencil |
| 7 | Stitch atlas with sub-pixel splatter, rip-mapped | 0.27 s, area-bound not N-bound | 40,000 units as one cloth with macro-to-micro zoom (Run 5.9 s versus 32.5 s) |
| 8 | Instanced WebGL via 8-bit data textures (`p.model(geo, n)`, `texelFetch`) | about 0.6 s on SwiftShader; ms on a GPU | 100+ moving 3D parts with per-unit state in one draw |
| 9 | Analytic contact shadows + thin-lens DOF from a blurred atlas pyramid | 0.5–0.9 s (9 `#define` variants) | Focus as attention (rack focus to the failed stage); one hero beat only |

Best return per cost: rungs 4–7. The two WebGL films first cost 13–25 s per frame and retreated to variants.

### b2. Frontier the notes recommend and no film used

| Capability | Where it raises quality | Determinism and headless risk | One-line purity test |
|---|---|---|---|
| **p5.strands hooks** (`buildFilterShader`, `buildMaterialShader`) | Grain, bleed and plate tone-map as GPU passes instead of CPU blits | Closures vanish (`new Function`; pass scope); wrong `getFinalColor` signature hangs setup; p5's light loop was Escapement's cost; SwiftShader runs every branch | `hash(renderAt(7.3))` before and after `renderAt(2.0)` equal, and the scope holds only t and seed uniforms |
| **Framebuffer ping-pong (FLOAT, NEAREST)** | Diffusion, review cost as a field, GPU plate exposure | State on the GPU is pure in t only by replay from a fixed-dt checkpoint (as `U.stateAt`). Float bits may differ across renderers | Seek to t by replay from 0 and from the checkpoint: max pixel diff 0 on the same renderer, at most 1/255 across renderers |
| **Compute / WebGPU with fallback** | 10^5–10^6 runs instead of 2,000 | Experimental; SwiftShader fails at `mapAsync`. The WEBGL/CPU path is the film of record; WebGPU is live-only | Integer counts from the GPU path equal the CPU path exactly at 5 t (same hashed PRNG, no float reductions) |
| **textToPoints / textToModel** | Titles and labels made of their units (Run's stitched title at 2.4 s as the first ensemble) | Variable .ttf falls back to FontFace and fails; `textToContours` ignores `fontSize` | Point array length and hash identical at two seeds and two sizes, computed in setup only |
| **splineVertex** | Survival curves and rivers instead of hand-rolled Béziers | Low (renamed from `curveVertex`) | Vertex array hash invariant across re-seeks (geometry-first) |
| **describe()** | Per-beat text alternative generated from the numbers table | Write on beat change, never per frame | Every Number on screen at t appears in `describeText(t)`, and the text is identical across re-seeks |
| **saveGif** | Newsletter channel (GIF at most 1 MB target, 1.5 MB hard) from the same timeline | Needs fixed-dt stepping; size grows fast (1 s at 200² = 56 KB) | Decoded GIF frames match `renderAt` frames at the sample times after palette quantisation |
| **Sound** (p5.sound 0.4.1 or raw Web Audio) | Offline semantic voices per material exist; live adds a toggle | Live audio needs a gesture and is impure; sound is the weakest-graded subtree (Q7) | Score events 0..T identical across two runs and the offline WAV hash equal; sound never carries information absent from the picture |

Adoption order: splineVertex and describe(), saveGif, textToPoints, strands, ping-pong; compute last, only behind the fallback gate.

### b3. What p5 must earn, and the mark rule

**A p5 layer is admitted only if it earns at least one of three.** Otherwise SVG, which meets the 110 KB short-tier cap.
- **COUNT:** marks are countable units whose count is the number (one mark = one run). Test: `units()` returns drawn count == `items.length`. SVG cannot reach 2,000–80,000.
- **CONSERVATION:** identities persist through every transformation; nothing is created or destroyed except by the model. Test: the id set at the end of a beat equals the id set at its start, minus model-declared exits.
- **RESPONSE:** viewer input moves marks and the engine recomputes the Number. Test: `setState(x)` changes at least one Number and at least one pixel region.

Each layer header names which it earns and "each mark is one ___" (the typesafe CONTRACT does this).

**Mark rule.** `markRule {unit, step, address, save, cost}`; every draw op has a role; nothing on screen outside the five. Colour carries meaning, not scenery: copper #CE9A6A probability or expected, sage #8FA985 verified or cost-of-save, peach #D88B5C error or address, slate #6E8CA8 structure. Ground free.

---

## (c) Process and model routing as configuration

```yaml
routing:
  haiku:  [read, inventory, grep-numbers, contact-sheet-build, claims-extract, fixture-run]
  sonnet: [consult, research-lanes, interview-draft, seats: [colour, intent, metric-auditor, wonder]]
  opus:   [build, revise, module-code, advise]   # never a seat on its own build
  fable:  [art-direction, juror, pedagogy-critic, seats: [cliche, composition, craft]]
  rule:   any seat with self-agreement < 0.8 on its fixtures moves up one tier
  isolation: seat packets by directory; builder session never reused as a seat
revise: {max_passes: 3, named_edits_only: true, re_seat: pairwise_swap, after_3: human_decides}
notes_first: {file: NOTES.md, max_words: 700, sections: [mark_rule, doctrine_answers, beats, heroes, iteration_log], sync_gate: NOTES-SYNC}
```

**Interview instrument.** Run per film family and after each wave, not per film.
72 slots, depth 4, nine ★ questions as the minimum interview. Each node holds a **collapsed** valuation (what the studio claims) and **composed** children rolled up by a stated rule, evidence-tagged `path:line`. The gap is a FINDING; blanks count as data; findings go back to the respondent as numbered questions (Q-M1–M8). A HARD finding (F2 no shared kernel, F3 "exact ±" live, F4 seed picking, F6 no cost model) blocks the next build until closed or accepted by the human. F2 surfaced only this way. Ship the `treelint` the file cites but omits.

**Juror loop.** Render 8–10 stills on a fixed time list including title, hero (impossibility), commit, payoff and last frame. The juror judges against the doctrine and logs `{round, what I saw, verdict per test, named fix}`; at least two rounds before any MP4; the pedagogy critic runs in parallel on its own packet. Cap: three revise passes, each a named edit (SwapTechnique, Reweight, Subtract, Retime), re-gated and re-seated pairwise against the previous version. After pass three, the human chooses ship, cut or rework.

**NOTES-first.** NOTES.md (at most 700 words) before any code: mark rule, doctrine answers, beats, heroes; updated each pass. 7 of 8 NOTES files described superseded layouts after R1; NOTES-SYNC fails on a beat-time mismatch above 1 s.

---

## (d) Product acceptance

### d1. Levels ladder × six-channel kit

| Level | Film requirement | Channels projected from it |
|---|---|---|
| Glance, ~30 s | Built for 16 films | Reel 9:16 at most 24 s; carousel 7 slides; newsletter GIF |
| Grasp, ~2 min | Module demo only (stitch, plate) | LinkedIn video 45–75 s; LinkedIn PDF 8–12 pages with sources; blog embed |
| Wield | Built: Ledger-shared, Bunraku, Margin | Blog embed (live only) |
| Master | Specified only | Blog embed |

Only System 1's `base-rate` has all six channels. Atelier films are `Atelier.film` defs, not plans, so the channel compiler cannot read them. **Dependency:** project the compiled AM beat graph into `timeline.mjs`; channels never edit the timeline or invent a number.

### d2. Chromes: flagship, rework, retire (truth veto applied)

| Chrome | Evidence | Verdict |
|---|---|---|
| **F Bunraku** | Shared 4/5/5, best frame (11.0 s), cleanest text, native true, Wield built. Weak: ~50-theatre wall hides which move failed; cost is words | **Flagship.** Fix wall and cost mark |
| **G Run** (shared) | 5/4/4, true; macro and hem frames strongest. Weak: barcode strips 16–20 s, 7-px labels, 0.44 px per column | **Flagship** after G6 fix and a skein-meter cost mark |
| G Run (native) | Physical context window, but partly false (U-curve contradicts "quality fades"; FIFO is app policy) | **Vetoed** until claims are re-tagged |
| **B Marbling** (native) | 5/5/5, 4.6 s and 28.8 s are the best images; R1 now says "the way back is a guess", ghost combs labelled sketch | **Flagship, conditional** on the TRUTH re-audit |
| B Marbling (shared) | 12 tiles read as wallpaper | **Rework** (R1 one tray) |
| C Delta | Only 6/6 on cost; survey map reads (28 s); ruler failed (equal cones); native true | **Rework** to second wave. It is the model for cost-as-mark |
| D Ledger | 3/2/2 and 3/2/1; lower half empty to 11.4 s, reads as a spreadsheet | **Retire as a film.** Keep the re-pack as a module, the ROI table as one PDF page |
| E Margin | Shared 3/3/2; native "you did it too" said to a viewer who never guessed (R1 added a pencil-tap commit, 20 s) | **Rework**; native vetoed until re-audited. Keep pen kernel as a Wield |
| A Escapement | 3/3/3 and 2/2/2; ~12-px modules, icon grid from 14.2 s | **Retire the films, keep the kernel** (involute, instanced data texture) |
| H Exposure | 3/3/3; cone encodes nothing; native reads as an embedding plot | **Retire the films, keep the plate** as a convergence beat |

Net: 3 flagships (one conditional), 4 reworks, 3 retired films with kernels kept.

### d3. First three films the merged system ships

1. **The Run, "What an AI agent actually does", Glance + Grasp.** The 120-s grasp-stitch graph exists with checked numbers (181 vs 179.2 ± 21; 390 vs 392.7 ± 18; 357 steps twice). Needs the legibility fix, a cost mark, six channels. The reference film.
2. **Marbling, "Un-combing", Glance to Grasp,** after the TRUTH re-audit. New concept and audience; shows the gate ships the juror's favourite only once it is true.
3. **Bunraku, "What an AI agent actually does" with the check-placement Wield.** The WebGL tier and the only built Wield; exercises the gate on the 0.5–0.9 s renderer and the seed sweep on a Wield.

Keep `base-rate` as regression and calibration film.

### d4. "Higher quality than before": acceptance criteria

All must hold, per shipped film.

| Criterion | Bar | Baseline today |
|---|---|---|
| Gate rows | Existing 10 (LOAD live, LAYOUT 400, PURE-REP, PURE-ORD, CLOCK, META, ENGINE, CAPTIONS, AUDIO, LOAD film) plus 7 new (LEGIB400, TRUTH, COST, SEED-SWEEP, FINGERPRINT, UNITS, NOTES-SYNC): **17 of 17 PASS**, 0 unwaived soft | 160 of 160 PASS, yet 3 of 8 natives not true |
| Legibility | Must-read text at least 11 phone px (26 frame px); count mark at least 3 phone px; 320-px thumbnail passes anonymity | 14 frame px = 5.8 phone px |
| Seats | Composition, Colour, Craft, Intent prefer new in both orders; Cliché not REJECT; Juror at least 4/4/3; Pedagogy 0 FALSE, cost at least 5/6; beats the repo's current reference episode on the same concept for 2 of 3 non-builder seats | Craft at least 4: 3 of 16 films; cost 6/6: 1 of 8 |
| Seed sweep | N=32 (64 release): at most 2% of seeds break a claim sign; realised within 2 sd in at least 95%; checked above unchecked in 100%; shipped seed \|z\| at most 0.5, logged | not run |
| Evidence rows | 100% of digits typed; every caption claim in `claims.json` with a tag; 0 FALSE; 0 untagged PARTIAL; critic recompute matches | "±21" wrong (18.4); "exact ±" on 3 films |
| Static-equivalent | Equal-information static SVG vs Grasp, n at least 40 per arm (CETI cohorts, opt-in, Q-M5), pre-registered; outcomes: guess error on the compounding quantity and transfer (14 sign-offs at 97%, about 65 of 100). Film beats static by d at least 0.3 on transfer, CI above 0, no recall loss (literature d = 0.37, Höffler & Leutner; advantage vanishes when equated, Tversky). d under 0.2 demotes the film to a channel asset. Run System 1's CPR on/off in the same study | never run |
| Cost | At most 1 s per frame headless; boot at most 5 s; page at most 2 MB | 0.07–0.9 s; 1.4–1.5 MB |

Precondition: a4 fixtures show FN = 0 on HARD gates; a gate that has not caught a known-bad film cannot certify a good one.
