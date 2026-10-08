# BUILD-SPEC — implementing the modules on one clock

**Version:** 1.0 (2026-10-08). Implements `MODULE-OPERAD.md` under `METHOD.md`'s laws, without breaking the engine
contract. The contract still holds: one clock; every frame is a pure function of `(t, state)`; build once, mutate
only; SVG carries type and labels; p5 Canvas2D carries mass and fields; the viewBox is 960×540
(`films/typesafe/CONTRACT.md`, `SKILL.md`). The feature engine, bridge, `build_feature.py`, `film_render.py` and
`feature_gate.py` are reused. The library adds a layer that *produces* a `window.FEATURE` from a plan. It closes the
blind run's top gaps: no scaffold, copied helpers, a non-shared brand asset, and an inconsistent colour vocabulary
(BLIND-LOG gaps 1–4).

## 1. File layout

```
library/
  core/
    module.js        Module.define / registry / validation of definitions
    compile.js       Film.compile(plan) → { FEATURE, TS-like data, timeline } (pure, runs in node and browser)
    clock.js         clock maps (sequence, splice-freeze for CPR, split for contrast)
    po/              persistent-object kinds: grid.js track.js chain.js stack.js axis.js vessel.js frontier.js timeline.js population.js form.js
    roles.js         role table → tokens per chrome (dark | notebook); the only place colours are resolved
    scene-kit.js     shared SVG helpers (el, tx, rise, show, measured text, label-on-object) — was copied per film
    brand.js         whale geometry and the samplePath/counts helpers — was copied per film (BL step 3)
    lint_plan.mjs    laws L1–L13 over the compiled timeline (node; no browser)
  chrome/  bookend.js · honesty.js · land.js            (pseudo-modules, same interface)
  modules/<name>/
    module.js        the definition (§2)
    layer.js         optional p5 layer(s) (P5Film.layer contract)
    demo.json        the two instantiations from MODULE-OPERAD (AI, behavioural), each a one-module plan
    README.md        ≤ 60 lines: move + evidence pointer, ports, params, phases, honesty, fails (copied from the operad)
    test.mjs         audit + lint of both demos + phase invariants (node)
  films/<id>/film.plan.json   a film = a plan; STORYBOARD.md is generated from it
```
`build_feature.py` gains `--plan film.plan.json` (emits `scenes.js` = `Film.compile(plan).FEATURE` and the layer
list) and `--module <name> --demo <i>` (the demo page, §6). Hand-written `scenes.js` films keep working.

## 2. The module interface

```js
Module.define('mass-reseat', {
  kind: 'scene',                                   // 'scene' | 'combinator'
  types: ['T1','T2','T5'],
  ports: {
    needs: ['parts', 'instance'], gives: ['rule'], consumes: [],
    po: { in: ['track','grid'], out: 'same' },       // PO kinds accepted / produced ('same' | kind | 'create')
    regions: ['body','foot'],
  },
  params: {                                        // schema: type, default, range, illustrative flag, source tag
    bins:  { type:'array', required:true },
    N:     { type:'int', default:1000, range:[100,2000] },
    keep:  { type:'array', required:true },
    variant: { type:'enum', of:['renormalize','condition'], default:'renormalize' },
  },
  duration: (P) => 18,                             // seconds; may depend on params (rungs, steps, levels)
  phases: (P) => [                                 // fractions of duration; the linter reads these
    { id:'queue',   f:0.20, introduces:['mass'],  labels:[{term:'mass', after:'marks'}] },
    { id:'close',   f:0.10, introduces:['keep'],  cue:{target:'blades', dur:0.8} },
    { id:'reseat',  f:0.30, introduces:[] },
    { id:'count',   f:0.20, introduces:["p'"],    payoff:true },
    { id:'hold',    f:0.10, hold:true },
    { id:'name',    f:0.10, names:[{term:'renormalise', principle:true}] },
  ],
  numbers: (P) => ({ pPrime: (s) => renorm(P.bins, P.keep), seats: (s) => largestRemainder(P, s) }),
  out: (P, inPO) => ({ ...inPO, state: { ...inPO.state, seats: seatsAfter(P) } }),   // PO hand-over, pure
  build(svg, ctx, P) {},                           // create SVG nodes once, under ctx.root(region)
  render(lt, ctx, P) {},                           // lt = local time in [0, dur); pure in (lt, ctx.state)
  p5Layer: { z: 6, means: 'each mark is 1/N of the probability mass',
             setup(p, L, P) {}, draw(p, lt, L, ctx, P) {} },
  controls: (P) => [{ key:'constrain', type:'toggle', default:true, jumpPhase:'close',
                      question:'What happens to the closed tracks’ weight?' }],
  audit: (P) => ({ ok: conserved(P) && ratiosPreserved(P), msg: '…' }),
  honesty: (P) => ['illustrative logits', 'per step only', 'masked (precomputed), not checked'],
  expertise: 'novice',                             // supports that reverse for experts are marked in phases (skip:true)
});
```

**Rules for module authors.**
- `render` and `draw` take **local** time `lt` and read `ctx.state`, `ctx.po`, `ctx.roles` and `ctx.numbers`. There is no `Math.random`, `Date`, accumulated state, CSS animation or timer. Randomness comes from `ctx.rng(name)` (SVG, created in `build`) or `L.stream(name)` (p5, in `setup`).
- Colours come only through `ctx.roles.of(variable)` → a token (L6). A hex or role literal in module code fails lint.
- Every displayed number is `ctx.numbers.<id>(state)`, and the p5 layer reads the same fn (L7). A number missing from `numbers` fails lint.
- A module never builds a second root object. It receives `ctx.po` (geometry + anchors + in-state), draws it from the
  shared PO renderer (`core/po/<kind>.js`), and declares its out-state in `out()`.
- Labels go through `scene-kit.label(term, anchor)`, which records `{term, t0}` for the L4/L5 checks.
- Reduced motion (`ctx.rm`) gives steps instead of drift. Every phase still reaches its end state.

**Combinators** declare `kind:'combinator'`, `arity`, and `wrap(inners, P) → definition`. The returned definition
is an ordinary module whose `duration`, `phases`, `numbers`, `controls`, `honesty` and `audit` are composed from the
inners. Its `render` dispatches to the inners through a clock map (§3). Examples:
- `commit-predict-reveal.wrap([inner], P)` splices `ask` and `commit` into the inner's clock at `payoff − 0.3 s`.
- `contrast-split.wrap([A, B], P)` asserts that `diff(A.params, B.params)` has exactly one key, clones the PO into
  `left` and `right`, and runs both on one local clock. The p5 layer draws A and B from one mark table with a translate.
- `trap-and-correct.wrap([wrong, right], P)` runs the ghost wrong model, then `right` on the same PO anchors.

## 3. The timeline compiler

`Film.compile(plan)` is pure, deterministic and runs in node (so the gate and the linter run without a browser):

1. **Resolve.** Look up each `use` in the registry, fill defaults, validate params against the schema, and resolve
   `@example.*` references against the plan's single `example` record (L7, F14).
2. **Expand combinators** bottom-up into ordinary definitions (§2).
3. **Window.** `t0[0] = 0` and `t0[k+1] = t0[k] + duration_k`. An optional `at` pins a module's start (the gap is
   filled with `hold`). `dur = Σ` (+ chrome). Phases become absolute: `T['<module#k>.<phase>'] = t0 + Σf·dur`.
   `payoff` phases become the film's key moments. Chapters are the module starts with labels from the plan. Captions
   are a skeleton, one slot per phase, ≤ 90 chars, filled by the writer.
4. **Hand over the PO.** `po_0 = PO.create(plan.po)`, and `po_{k+1} = module_k.out(P_k, po_k)` is computed statically.
   At runtime, `ctx.po` for module k is `po_k` (frozen). The in-module state at `lt` is the module's own pure function.
   Transitions of kind (Table 5 of METHOD) require the next module to be a morph-capable module
   (`concreteness-fade`, a combinator's clone/merge) or an explicit `morph` phase (≥ 0.9 s, anchors matched by id).
5. **Clock maps.** `seq` (identity inside a window). `freeze(a, F)`: local `lt' = lt < a ? lt : (lt < a+F ? a : lt − F)`
   (CPR). `parallel` (split: both halves on the same `lt`). The maps compose by function composition, which is
   associative, so regrouping a chain never changes a frame (METHOD §4).
6. **Emit.** `FEATURE = { meta, chapters, captions, state, controls, build(svg, ctx), render(t, ctx) }`.
   `render(t)` finds the active module by binary search over windows and calls
   `render(clockMap(t − t0), ctx)`. Modules outside their window are hidden by `fade(t, [t0, t1])` (0.9 s, per
   CONTRACT). Controls are the union of module controls, namespaced `k.key`, each with `jump = T[k.jumpPhase]`.
   `__AUDIT` = the AND of every module `audit()` plus `lint_plan`.
7. **Page gates.** A CPR in page mode emits `FEATURE.gates = [{t: T[k.commit], key: 'k.guess', timeout: 8}]`. The
   engine (one small addition to `feature-engine.js`) pauses playback at a gate until the key is set or the timeout
   passes. In video mode gates are ignored and the card shows `filmDefault`. `render` never waits; purity is kept.

**The plan format** (`film.plan.json`):
```json
{ "meta": {"id":"base-rates","title":"Base-rate neglect","chrome":"notebook","level":"novice","vo":true},
  "type": {"primary":"T5","secondary":"T8"}, "archetype":"A2",
  "aha":"the denominator decides", "misconception":{"text":"80 % reliable means 80 %","runnable":true},
  "roles": {"blueCab":"shape:filled","greenCab":"shape:hollow","judgement":"person","counted":"machine","error":"error","remedy":"remedy"},
  "po": {"kind":"grid","id":"city","n":1000},
  "example": {"blue":150,"green":850,"reliability":0.8},
  "modules": [
    {"use":"bookend","params":{"question":"A cab hit someone at night. A witness says it was Blue."}},
    {"use":"ladder-build","params":{"rungs":["@city","@witness-test"]}},
    {"use":"commit-predict-reveal","params":{"question":"Chance the cab was Blue?","answerKind":"number","range":[0,100],
       "filmDefault":{"value":80,"label":"the most common answer","src":"Kahneman ch. 16"}},
     "inner":{"use":"trap-and-correct","params":{"wrong":"@trust-witness"},
              "right":{"use":"mass-reseat","params":{"variant":"condition","keep":["saysBlue"]}}}},
    {"use":"contrast-split","params":{"vary":{"param":"framing","a":"statistical","b":"causal"}}},
    {"use":"honesty"}, {"use":"recap-retrieve","params":{"question":"Only 5 % Blue: above or below 41 %?"}}, {"use":"land"} ] }
```

## 4. `lint_plan` (laws as code)

It runs on the compiled timeline. A module's demo, a film, and every gate run all call it. The checks map one to one
to METHOD §4: L1 set inclusion of `needs` over accumulated `gives − consumes` and PO-kind legality · L2 PO id constant,
no second `create` · L3 `introduces.length ≤ 1` per phase and ≤ 1 module start per 10 s window · L4 every
`labels[].term` has a mark `t0` ≤ label `t0 − 0.3` · L5 `names[principle].t0 ≥` its module's payoff · L6 one role per
variable, plus a source grep for hex/role literals · L7 every rendered number id ∈ `numbers`, and the `@example`
values equal the record · L8 cue intervals never overlap, each ≤ 1.5 s · L9 motion-free windows > 3 s match a `hold`
that begins ≤ 0.5 s after a payoff · L10 non-empty `honesty`, the chrome slot covers the union, and the MP4 CPR caption
contains "pause" · L11 a CPR is present when the primary ∈ {T1, T4, T5, T7, T8} · L12 `meta.vo` or a burned label for
every introduced term · L13 the last module before `land` is `recap-retrieve` (or a trap with `fresh` = the opening
case), and its question's source phase ends ≥ 30 s earlier. Output: a PASS/FAIL table with the module, phase and
law. "Motion-free" is computed from the phases' declared `still` flags, so the check stays data-only.

`feature_gate.py` adds G-PLAN (runs `lint_plan`) and G-MOD (runs every used module's `test.mjs`). It also fixes the
blind-run gaps: it gates the SVG cut by default and derives the G4 purity sample times from `dur` instead of fixed
seconds.

## 5. p5 layers in modules

Each module's `layer.js` registers `P5Film.layer(\`${name}#${k}\`, {z, setup, draw})` through `Module.layer(...)`,
so two instances of one module never collide. `setup(p, L, P)` builds every per-mark table (seats, paths,
itineraries, pre-simulated trajectories) from `L.stream(name + k)`. `draw(p, lt, L, ctx, P)` only interpolates, and
returns early outside its window. The budget is ≤ 12 ms per frame at 1080p for all live layers combined. The compiler
sums each module's declared `costMs` and fails a window that is over budget. Each layer header states
`means: "each mark is one ___"`. The undocumented `touch()` repaint hack (BL step 4) moves into the bridge as a
documented `L.markDirty()`.

## 6. Demo-page contract (one per module)

`build_feature.py --module <name> --demo 0|1` produces `modules/<name>/build/demo-<i>.html`. It contains:
- the standard feature player (clock, scrubber, speed, captions, `window.__ctrl`, `window.__film`), so
  `film_render.py` and `feature_gate.py` work unchanged;
- the module alone on a neutral PO stub, both instantiations selectable, and a chrome toggle (dark | notebook);
- a **phase strip** under the scrubber that marks each phase, with `introduces`, cue, hold and payoff glyphs, and
  the L-law results inline;
- the Try-it panel with the module's single control and its guiding question;
- badges for audit, the honesty list, evidence pointers, and the expertise flag.

A module is **done** when: both demos pass `feature_gate.py` (+ G-PLAN, G-MOD); stills at every phase boundary are
looked at; it renders in both chromes; a seat that did not build it has run the METHOD §5 rubric; and its README
matches the operad entry.

## 7. Build order

0. **Core first** (it is not a module): `module.js`, `compile.js`, `clock.js`, `roles.js`, `scene-kit.js`,
   `brand.js`, `lint_plan.mjs`, `po/grid.js`, `po/track.js`, and the three chrome pseudo-modules. Gate: the typesafe
   M3 window re-expressed as a one-module plan renders frame-identical to the hand-written cut (frame hash).

**The first six modules** together make composition 4b ("Base-rate neglect") buildable end to end. They also allow
the first experiment (the same film with CPR on and off), and they include all three combinators:

| # | Module | Why now |
|---|---|---|
| 1 | `mass-reseat` | a port of the proven typesafe throat; it exercises PO hand-over, p5 marks and the canonical-number law |
| 2 | `ladder-build` | the general scene opener; it exercises L3/L4 (picture → cue → label) on the shared scene-kit |
| 3 | `commit-predict-reveal` | the strongest evidence among the new moves; the clock splice and page gate; it enables the first A/B |
| 4 | `trap-and-correct` | turns limits from cards into runs (F5); it is in all three compositions |
| 5 | `contrast-split` | the equivariance check and the counterfactual mode; it is in all three compositions |
| 6 | `recap-retrieve` | L13 (return plus retrieval) is required by every film; it is cheap |

Then: 7 `compound-chain` (a port of typesafe M4; it completes 4a) → 8 `worked-fade` (completes 4c) →
9 `population-sim` → 10 `concreteness-fade` → 11 `zoom-journey` → 12 `feedback-loop` → 13 `tradeoff-frontier` →
14 `timeline-scars`. Modules in disjoint subtrees are built by parallel lanes (Opus execution). The seats and the
design of each module's demo pair go to Fable, per the house routing.
