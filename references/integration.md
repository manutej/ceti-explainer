# Integration — how the studio composes with CETI skills and assets

*From research/06 (every claim there carries a file:line into the source skill). This page is the contract
sheet: what crosses each boundary. `→` the studio calls the skill; `←` the skill embeds studio output;
`↔` both.*

## The three host contracts (implement these and every bridge below works)

**1. Tokens in, never hex.** Inside a host page, read colours from the host's role tokens at runtime:
`Studio.palette({css: {ground:'--ex-ground', ink:'--ex-ink', accent:'--ex-accent', sage:'--ex-accent2'}, weights:{ground:0, ink:6, accent:2, sage:1}})` — host tokens mapped to *your* role names; `pal.rgb01('accent')` for shader uniforms; `pal.alpha('ink', 0.12)` for low-contrast layers.
One rebrand = one role map. Fonts are the host's (Fraunces / DM Sans / Space Mono for CETI); load them with
`document.fonts.load()` before `font.textToContours` or text measurement.

**2. Clocked, not free-running.** Hosts (ceti-explainer, motion-media-l2, scroll explainers, video) need
`frame = render(t)` to be pure. Expose:
```js
// inside the sketch (instance mode), at the end of setup — this is the ONE canonical host API:
const api = Studio.host(p, {
  clock,                                   // Studio.clock({mode:'loop'|'sim', …})
  setState: (s) => { state = s; },         // field-story plates: one mutator
  still: () => { showComposedStill = true }, // reduced-motion composed frame
});
// installs window.__sketch = { renderAt(t), setState(s), rate(k), still(), play(), pause() }
// renderAt(t) pauses free-running play and draws exactly time t (pure in t, or sim replayed from 0).
```
Older notes in the bridge table that mention `createSketch(...).renderAt` mean this same API.
Simulations (growth, physarum, particles) keep keyframe checkpoints every N steps so any t can be rebuilt.
`Studio.harness` already installs `window.__renderFrame(i)`; video export and scrubbing use it.

**3. Polite on the page.** Instance mode only (no globals). Pause when off-screen (IntersectionObserver →
`noLoop()`), `pixelDensity(1)` for live layers, `role="img"` + text alternative, reduced-motion composed
still, ≤ 3 flashes per second, one focal motion per beat, and low contrast when behind content
(≤ ~0.15 alpha of the host ink).

## Bridges

| Skill | Dir | Integration contract (what crosses the boundary) |
|---|---|---|
| ceti-explainer | ← | **p5 generative background/texture layer under a ceti episode.** Constraint: the explainer's DeterminismLaw (render(t) pure, scrubbable, paused == playing). p5 studio must expose a **clocked sketch mode**: `window.__sketch.renderAt(t)` (via `Studio.host`) that is a pure function of `(seed, t)` — either closed-form in t (noise(x,y,t), parametric curves) or simulation re-run from frame 0 with a fixed dt and cached keyframes. Mount as a sibling `<canvas>` behind the 1000×464 SVG (or `noLoop()` + `redraw()` driven from the engine's `render(t)`). Colors only from `--ex-*` role tokens read via `getComputedStyle`. Must pass gate.mjs §15b/§15d unaffected (canvas is not in `__LAYOUT`); must sit at low contrast (≤ ~0.15 alpha of `--ex-ink`) so §15 overlap/legibility and "one focal animation per beat" hold. Long-format A1 brand assembly (particles converge into the whale) is the obvious first archetype p5 can implement with real physics. |
| motion-media-l2 | → | p5 studio binds to it as the schema layer: L₀ (palette slot → dict-color/owala; contrast → wcag-contrast; SVG → svg-animation-techniques), L₁ role tokens, L₂ narrative slots for animated sketches (a still poster also has a Takeaway), L₄ machine edits for parameter refinement, L₅ verification ladder (p5 must report V2 = headless render reached), L₆ determinism, and `AdaptMedium(animation→still)` ⇒ **every still must record its seed**. |
| field-story | ← | **p5 hero visuals and per-plate instruments.** Each plate's `instrument_brief` already asks for "particle fields that clench and release", "a restless field resolves to one still luminous surface" — these are p5 sketches. Contract: the sketch is driven by the plate's single `state` (one mutator → `sketch.setState(state)`), IntersectionObserver-gated, composed reduced-motion still frame, scoped to `#plate-<slug>`, ids prefixed; must use the plate's `--acc`/`--acc-lite`. The hinge plate = a p5 "turn" instrument; the finale = a "subsidence" sketch whose energy decays to stillness. Also: p5 can render the **sigil library** into material/textured variants (ink bleed, engraving hatch) while preserving the SVG spec as source of truth. |
| editorial-dashboard / milton (skill) | ← | p5 provides (a) the **drawing-canvas enactment** pattern upgraded (generative brush that responds to the principle), (b) **`--deep` generative icon/texture system**: per-concept procedural glyphs where each icon uses a *different generative idiom* — pick low-typicality idioms from the atlas (cliché ≤ 3), not the famous ones (flow field, packing, L-system, reaction–diffusion are all cliché 4–5) — the editorial variety rule applied to algorithms; (c) paper grain / wobble textures rendered once to PNG/data-URI at load. Must respect cream-paper palette and Caveat-marginalia register; critique file `what-would-[subject]-say.md` gets a "what would [subject] dismantle in the sketch" section. |
| sagmeister | ← / → | ← p5 is the natural engine for **constructed type**: material-pile (bananas/coins as physics bodies filling glyph outlines from `textToPoints`), smoke/vapor, punch-card/dot-matrix, pixel mosaic, negative space, scroll-driven decay, sun-bleaching over time ("time as ingredient"). → Sagmeister as a **critic seat** ("what's the one sentence the sketch argues?", "what did it refuse?", one dominant + one accent). |
| milton plugin (agent) | → | The milton agent is a ready **critic seat** for any p5 artifact page (12-item audit + one Glaser question). p5 studio passes `{file, fork_notes}`; the agent audits philosophy not palette. Also reuse milton's **eight-phase meta-prompt** for the concept stage: ten variants → pun pass → three finalists → strip → yes/no/WOW → truth check maps cleanly onto "N seeded variants → pick 3 → strip parameters until it breaks". |
| algorithmic-art | ↔ (supersede) | Keep its two good ideas (philosophy manifesto before code; Art-Blocks seed discipline with prev/next/random/jump + gallery of seeds). Replace its Anthropic-locked viewer with a CETI-token viewer (and an `anthropic` preset to stay compatible). p5 studio should be the default for "generative art in p5" requests where CETI context exists; algorithmic-art remains the generic fallback. |
| dict-color | → | Palette resolver: `generate --near <brand hex> --size 3|4 --mood … --seed-n <sketch seed> --out pal.json` → p5 palette array with roles (dominant 60 / supporting 30 / accent 10 / detail trace) used as **weighted color sampling** in the sketch. Audit: run `dict_color.py audit` on a **runtime color sample** (render N frames headless, histogram pixels, emit a CSS of the top-k hexes, then audit that file) because the static extractor misses p5 numeric color calls. Name colors (Wada names) in the sketch's caption/colophon. |
| owala-design (colors, tokens, dark-mode, wcag, motion-curves) | → | Token resolvers: `--actor-1..5` → p5 palette roles; `dark-mode-pairing` for the dark twin of a sketch; `wcag-contrast` for any text drawn on/over the canvas; `motion-curves` easings ported to p5 as JS easing functions with the same names (resolve the `--ease-glaser` collision by role: CETI/owala = (0.22,1,0.36,1), milton = (0.34,1.56,0.64,1)). |
| ceti-explainer presets / tokens | → | Brand source of truth for dark CETI: `--ex-*` (episode) and `--mk-*` (marketing) roles; fonts Fraunces/DM Sans/Space Mono loaded via `document.fonts.load` before `textToPoints`/`textWidth` (layout measures text). |
| silver-hero-engine | ← | p5 sketches as **registered ANIM/SCENE components** in the Silver library: obey "one gold light source" (`--ceti-gold #d4a84b`), "start lively, settle into rest" (sketch accepts a host-supplied `rate(t)` from the decelerator: 1.15× → 0.06× over 4.8 s; module runs at normal speed, host decelerates), no opacity-0→1 entrance on load-bearing content, pencil-line register (p5 `stroke` only, jittered hand line). Register via `window.ANIM_REGISTRY.push({key,label,subject,useFor,technique:'p5',intensity,Comp})`. |
| motion-stack | ← | p5 slots into pattern 1 (cursor spotlight → p5 field that reacts to pointer with the same 0.12 lerp), pattern 3/4 (draw-on then lamp-glow → p5 glow particles arriving after outlines), pattern 16 (play-once IO). Must honor `REDUCED/HOVER/MOBILE` booleans and the ≤2 simultaneous animations budget (p5 `noLoop()` off-screen). |
| svg-animation-techniques | ↔ | **p5 ↔ SVG export bridge.** p5 → SVG: emit geometry (polylines/paths) as SVG via a recording renderer (p5.js-svg or own path recorder) with `stroke="currentColor"`, `class="line"` so anime.js `createDrawable` can draw it on; optionally simplify (RDP) to keep path count ≤ budget. SVG → p5: read sigils / hand-drawn paths (`getPointAtLength` sampling) as attractors/targets for particle systems (field-story sigils, the CETI whale logomark, milton icons). |
| scroll-driven-explainers | ← | sketches accept `t := scrollProgress` (sticky stack panes, scrubbed pinned section); determinism holds per motion-media-l2. |
| engine-selection | ← (extend) | add the missing branch: "procedural/generative canvas, particles, fields, emergent systems, constructed type from data → p5 (ceti-p5-studio); designer-made → Lottie; DOM/state → Motion". p5 studio's own docs should state when NOT to use p5 (UI state, a11y-critical text, simple draw-on). |
| animated-component-galleries | ← (replace generic) | where a page would reach for Magic UI `Particles`/`Meteors`/Aceternity Sparkles, offer a p5 piece with a *concept* instead (ai-page-tells #6/#14). Provide a React wrapper (`<P5Sketch sketch={…} seed tokens />`, `"use client"`, `dynamic(..., {ssr:false})`). |
| frontend-design / generative-ui | ← | "Backgrounds & visual details: gradient meshes, noise textures, geometric patterns, grain" → p5 texture generator (render once to an offscreen buffer → CSS `background-image` data URI, or live canvas behind content). generative-ui's "simulations / fractal explorers / ant colonies" are p5 sketches; its no-placeholder + fact-verification rules apply to any data a sketch encodes. |
| bertin | → (critic) | Gate for any p5 piece that **encodes data**: classify data levels, enforce variable matching (hue never for order), "one image", and the rule that ambient particles behind a chart are perceptual cost. p5 studio's eval should route data-bearing sketches through a bertin seat. |
| meta-design | → (outer schema) | p5 studio is a medium: `AdaptMedium(web → generative-canvas)` := {Breakpoints ↦ canvas resize policy; MotionCurve ↦ p5 easing table; add slots `Seed`, `ParamSpace`, `Determinism`, `PerfBudget`}. Its 7 predicates become p5 predicates (contrast on any drawn text, ≤3 flashes/s, reduced-motion still frame, responsive canvas, pedagogy ≤7 new elements/view). Precedence a11y ⊐ brief ⊐ aesthetics resolves σ conflicts. |
| meta-prompting | → | p5 studio's "prompt → sketch" front end IS a meta-prompt: typed slots (`Concept:str`, `Philosophy:md`, `Palette:list[OKLCH]`, `ParamSpace:dict[name→range]`, `Seed:int`, `Clock: free|t-pure|scroll`, `Canvas: w×h`), procedure, output contract; RMP edit scripts for parameter refinement. |
| meta-operad / op-consist | → (verification of the design decomposition) | Lift a sketch design into a ToQ: root "a sketch that expresses concept C" ← {palette node : color, composition node : layout, motion node : clock, typography node : glyphs} ← param leaves. Edge colors are the typed ports above. **OC check (Tier 1):** generate the sketch *directly* from the brief (total collapse) and *via the decomposition* (palette → composition → motion → code); compare under a declared **behavioral equivalence** — not code diff: same seed rendered headless → compare perceptual features (palette histogram ΔE, density map, motion energy curve, symmetry, focal-point location) against tolerances. Disagreement localizes the failing edge (e.g., palette node and composition node disagree on dominant color share). Report as `oc_signal`, never "verified". Also apply the **lane law** when fanning out per-module sketch agents (disjoint write targets only). |
| moe-eval / multi-agent-eval | → (adversarial eval) | Per-sketch / per-release panel. Seats mapped to p5: **user** (does a non-expert get the promised feeling/meaning from the canvas? reduced-motion still frame legible?), **operator** (runs from a clean copy, same seed → byte/pixel-identical frame hash, no console errors, FPS ≥ budget on a mid device, no network beyond the p5 CDN), **craft** (genre bar: generative-art craft + CETI brand + milton/sagmeister/push-pin voices), **red team** (flashing >3 Hz, seizure risk, runaway memory/particle counts, unbounded loops, color-only meaning, licensing of borrowed algorithms/"in the style of" living artists), + **domain** when the sketch encodes data (bertin seat), **naive** for inferred promises. Fixer proves with a check that fails on the old sketch (e.g., frame-hash or perf assertion). Leaves `EVALS.md` + `scripts/selfcheck.*` + a `tells.md` lesson atom. Note: the skill's own references/scripts are missing on disk — p5 studio must carry its own seat prompts and selfcheck rather than depend on them. |
| meta-review | → | cheap single-reviewer critique per iteration (always Adversarial + Clarity; add Accessibility + Performance lenses); emits a lesson atom. Use before escalating to moe-eval. |
| tell-apart | → | Audit p5 studio's **own eval rubric**: does the critic score tell apart a WOW sketch from a competent-but-generic one (green-during-the-outage risk: "renders, no errors, on-palette" passes slop)? Required witness triple: two sketches with identical rubric output but different design decisions. Use to keep the rubric from collapsing "noise wallpaper" and "concept-bearing field". |
| artifact-chain | → | For **long generative series** (a 30-card manifesto deck with one sketch per card, a per-lesson hero set, 100 seed prints): atomize per sketch (one decision per atom), typed ports, snapshot-before-ledger, QA ladder rung 4 = contact sheet of rendered thumbnails, never repair a flagged output (re-derive with a new seed). Authoring layer (concept, palette choice) samples; production layer (render seed N at size S) is deterministic — no voting. |
| noether-wiki / research-loop / meta-research | ← / → | Persist the studio's learned knowledge as a wiki: technique pages (flow fields, packing, reaction–diffusion…) with sources, a **seed/sketch registry** (sketch id, concept, seed, params, palette, eval verdict) as `graph/entities.jsonl`, lenses like `sketch.seed-recorded` (exact), `prov.coverage` for borrowed algorithms (credit original authors). research-loop/meta-research can feed new generative techniques as atoms. |
| meta-compound / meta-context / meta-craft | → | meta-compound: the Capture step = mint a technique atom + a tells row each run; meta-context: the studio's `CONTEXT.md`/INDEX router; meta-craft: the DoD ("I rendered seed N headless; frame hash H; FPS F") — evidence, not assertion. |
| generative-ui / design plugin (accessibility-review, design-critique, design-handoff) | → | accessibility-review as the a11y seat (2.3.1 three-flashes, 1.4.11 non-text contrast for meaningful marks, pause/stop/hide 2.2.2 for auto-moving content > 5 s); design-handoff to spec a sketch for engineers (params, tokens, states: playing/paused/reduced/static, perf budget). |
| category-master | → (internal only) | justification for the operadic architecture (operads §9, coherence) — never surfaced unless asked. |
| icon-systems | ← (limited) | p5 is not an icon library; it can generate ONE custom mark per page (the "introduce one deliberate custom illustration" escape hatch from tell #13). |

## p5 → SVG and SVG → p5 (svg-animation-techniques, field-story sigils, milton icons)

- **Out:** record geometry while drawing with `Studio.svg.path(points, {stroke, width, layer})`; export
  `Studio.svg.toString({plotter:true})`. Paths carry `class="line"` so anime.js `createDrawable` can
  draw them on. Keep path count within the host's budget (simplify before export).
- **In:** sample an SVG path with `getPointAtLength` into `Points` / `Paths` — the CETI whale mark, a sigil,
  a hand-drawn line — and use them as attractors, masks or growth seeds.

## Brand tokens (verbatim, with sources)

## 5. CETI brand tokens found verbatim (file:line)

**CETI marketing palette (cetiai.co) — `$SK/ceti-explainer/assets/ceti-tokens.css`**
- `:101` `--mk-deep-sea: #1A1F2E;` (page ground) · `:102` `--mk-night-tide: #262721;` · `:103` `--mk-bathysphere: #0F1320;` (terminal/canvas surface)
- `:104` `--mk-paper: #F5EFE3;` · `:105` `--mk-paper-soft: #E8DFCB;` · `:106` `--mk-fog: #B8B0A1;` · `:107` `--mk-rule: #2A3142;`
- `:110` `--mk-copper: #A67756;` (lead) · `:111` `--mk-sage: #7A9171;` · `:112` `--mk-peach: #D88B5C;` · `:113` `--mk-slate: #324555;` · `:114` `--mk-rust: #8C4A2E;`
- `:117` `--mk-mist: #95A8B0;` · `:118` `--mk-driftwood: #5C5447;`
- Fonts `:24` Google Fonts import (Fraunces ital/opsz, DM Sans, Space Mono); `:30` `--font-display: "Fraunces", "Cormorant Garamond", Georgia, serif;` `:31` `--font-sans: "DM Sans", "Inter", system-ui, sans-serif;` `:32` `--font-mono: "Space Mono", "JetBrains Mono", ui-monospace, monospace;`
- Motion `:85` `--ease-glaser: cubic-bezier(0.22, 1, 0.36, 1);` (house ease); academy palettes Boardwalk/Coastal/Greenhouse/Neo Sage (HSL triples) from `:136` on; default = boardwalk dark (`:163-164`).

**CETI explainer episode roles — `$SK/ceti-explainer/assets/shell.template.html`**
- `:16` `--ex-ground:#0E1014; --ex-ground-2:#0B0D11; --ex-ground-hi:#14181F;` · `:17` panels `#12161D/#0F1217`
- `:18` `--ex-ink:#F5EFE3; --ex-dim:#A39A89;` · `:19` `--ex-line:rgba(245,239,227,0.13)` · `:20` `--ex-panel:#171B23; --ex-cell:#1C212B;`
- `:21` `--ex-accent:#CE9A6A;` (copper) + fill/glow alphas · `:22` `--ex-accent2:#8FA985; --ex-support:#6E8CA8; --ex-peach:#D88B5C;`
- Same values restated in `$SK/ceti-explainer/presets/ceti.css:5-11`; Owala alternative `$SK/ceti-explainer/presets/owala.css` (`--ex-accent #E79AAE`, ground `#1E1426`).

**CETI Silver — `$SK/silver-hero-engine/templates/colors_and_type.css`**
- `:336` `--ceti-gold: #d4a84b;` · `:337` `--ceti-gold-hover: #e0b85c;` · `:338` `--ceti-gold-dim: rgba(212, 168, 75, 0.18);` · `:339` `--ceti-gold-ink: #15110a;`
- `:326` `--font-display: "Fraunces", "Georgia", serif;` (italic 300 signature) · `:327` `--font-sans: "DM Sans", "Inter", …` · `:328` `--font-mono: "Space Mono", "JetBrains Mono", …`
- Light boardwalk `:35` `--bg #F5EDD6`, `:38` `--ink #2A2018`; dark `:69` `--bg #1C1720`, `:72` `--ink #F2EBE0`.

**CETI × Glaser default preset (milton) — `$PL/milton/skills/milton/references/tokens.css`**
- `:4` "This is the DEFAULT PRESET (CETI brand)." · `:43` "Core CETI palette (from CLAUDE.md)"
- CETI legacy: `:44` `--olive: #262721;` `:45` `--slate: #324555;` `:46` `--sage: #C7D8B9;` `:47` `--cream: #E7E1D7;` `:48` `--camel: #A67756;`
- Grounds `:51` `--paper: #FAF7F2;` `:52` `--ink: #1A1916;`; dark `:165` `--paper: #1C1A15;` `:166` `--ink: #F0EBDD;`
- Actors `:64` `--actor-1: #D1422A;` (vermilion) `:65` `#2D5BA9` (cobalt) `:66` `#E8B53C` (sunflower) `:67` `#3B6E47` (forest) `:68` `#6B3F6E` (plum); dark lifts `:173-177`
- Fonts `:83` `--font-display: 'Bricolage Grotesque', …` `:84` `--font-body: 'DM Sans', …` `:85` `--font-mono: 'JetBrains Mono', …`
- `:137` `--ease-glaser: cubic-bezier(0.34, 1.56, 0.64, 1);` (also `$PL/milton/skills/milton/BRAND_BOOK.md:96`) — **conflicts** with CETI/owala `(0.22,1,0.36,1)`.
- Plugin manifest author: "CETI.AI · Manu Mulaveesala", homepage https://cetiai.co (`$PL/milton/.claude-plugin/plugin.json`).

**Related house palettes (not CETI-branded, but in CETI artifacts)**
- Owala five-actor cast `$PL/owala-design/skills/owala-colors/SKILL.md:46-50` (`#7A2E4A`, `#4FB3A4`, `#F2C14E`, `#4A3A5C`, `#A8C088`); owala `--ease-glaser (0.22,1,0.36,1)` at `$PL/owala-design/skills/motion-curves/references/motion.css:8`.
- SILVER deck "Midnight" theme (CETI SILVER pitch decks) in `$SK/motion-stack/SKILL.md` Pattern 17: `--bg #0d1320`, `--accent #f5c84b`, `--jade #4ec9a4`, Letterpress `--accent #c83c2a`, Field Notes `--accent #a35c2e`.
- editorial-dashboard defaults `$SK/editorial-dashboard/SKILL.md:190-191`; sagmeister defaults `$SK/sagmeister/SKILL.md:182-183`.
- Anthropic chrome in the p5 viewer `$SK/algorithmic-art/templates/viewer.html:26-36` (`#141413`, `#faf9f5`, `#d97757`, `#6a9bcc`, `#788c5d`, Poppins/Lora); Claude preset for milton `$PL/milton/skills/milton/references/presets/claude-anthropic.css:19-45`.

**Recommendation for p5 studio's default preset:** dark CETI = `--ex-*` roles (canvas `--mk-bathysphere #0F1320` on `--mk-deep-sea #1A1F2E` for long-form), light CETI = milton `--paper #FAF7F2` + five actors, Silver = `--ceti-gold` as the single light; fonts locked to Fraunces 300 italic / DM Sans / Space Mono for explainer-adjacent work (Bricolage/JetBrains Mono when composing under milton).
