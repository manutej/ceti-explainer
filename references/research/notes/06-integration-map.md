# 06 — Integration map: how `ceti-p5-studio` composes with the existing skill ecosystem

Status: research input for the ceti-p5-studio plugin design. Read-only survey; nothing outside
`/home/claude/p5studio/research/` was modified. Date: 2026-10-05.

## 0. Path aliases (exact)

```
$SK = /root/.claude/skills/synced/608669ff-56c5-494e-b666-5108a5430083_b74455d7-2da6-4bc4-8fc0-3d1a64a7b574
$PL = /root/.claude/plugins/synced/608669ff-56c5-494e-b666-5108a5430083_b74455d7-2da6-4bc4-8fc0-3d1a64a7b574
```

Every path below is `$SK/...` or `$PL/...` with the alias expanded literally.

**Missing-on-disk references (important for planning — do not assume these exist):**
`moe-eval` and `multi-agent-eval` ship only `SKILL.md` (all 10 `references/*` and `scripts/selfcheck.py`,
`scripts/selfcheck.banned` are absent; `tells.md` does not exist anywhere on disk); `meta-operad`
lacks `references/operadic-theory.md` and `PATCHES.md`; `research-loop` lacks `references/{ARCHITECTURE,GATES,META-PROMPT,PANEL}.md`, `references/instances/*`, `scripts/loop.py`;
synced `icon-systems` lacks its 5 references (the plugin copy has `references/quick-reference.md`);
`ceti-explainer` names `reference/audit-overlaps.js` but the file is at `assets/audit-overlaps.js`;
`op-consist` points at `op-decompose` (not installed); `field-story` depends on `field-notebook-craft`
(not installed). The only on-disk exemplars of the EVALS.md + selfcheck convention are
`$PL/sheaf-suite/EVALS.md`, `$PL/sheaf-suite/scripts/selfcheck.sh`, `$PL/sheaf-suite/scripts/check_plugin.py`.

---

## 1. Skill-by-skill survey

Format per skill: **Essence** · **In → Out (types)** · **Quality gates** · **House conventions** · **Key paths**.

### 1.1 field-story
**Essence.** Turns one narrative source (a text, a Master's life-work, a myth) into a single-file
interactive "volume" whose plate ORDER is the argument (exposition → rising → hinge/climax →
subsiding finale). 100+ hand-engraved SVG sigils (viewBox 64, `currentColor`, 3–9 children, ≤1 `.acc`
stroke) act as narrative actors (state-bound frieze, inline sigils, pictographic readout, marginalia,
Symbolarium). Each plate has a bespoke instrument under a single-mutator contract
(one `state`, one `compute`, one `render`, N surfaces). Built by a parallel-agent pipeline:
architect → N engravers → CONTRACT.md → skeleton + M plate builders → scripted assemble → Playwright
verify → optional i18n gauntlet → Vercel deploy.
**In → Out.** `Source:text` → `chapters.json` (per plate: slug, movement, roman, title, eyebrow, tier,
concepts[], `instrument_brief`, symbol_families[]), `quotes.json`, `proofs.json`, `lecturas.json`,
`corpus.json`, `symbols/<family>.json` (`{id,name,family,meaning,svg}`), `CONTRACT.md`,
`fragments/<slug>.html` → ONE assembled `.html`.
**Gates.** 16 non-negotiables (one accent/plate; one italic noun/title; plate enacts its principle; three
voices; ≤75ch measure; reduced-motion; counterpoint "WHERE THIS IMAGE FAILS"; one file no build; Atlas
focus mode; single-mutator; symbols are actors; narrative order load-bearing; instrument enacts the beat
and is unique per plate; sacred vs apparatus split; adversarial i18n review to PASS; frieze bound to
state, finale bound to subsidence). Python sigil validator hard-fails spec violations. Browser pass: zero
console errors, per-knob surface-change assertions, screenshots reviewed as images, measured WCAG,
mobile, reduced-motion. 5-question smell test.
**Conventions.** Owala-warm palette (ink-black derived panel `#1C1712`, per-plate `--acc` + `--acc-lite`),
three voices Fraunces / Inter Tight / JetBrains Mono, IntersectionObserver-gated rAF loops, composed
reduced-motion still frame, `<!-- PLATE:slug -->` markers, ids prefixed by plate slug, IIFE namespacing.
**Key paths.** `$SK/field-story/SKILL.md`; `$SK/field-story/references/story-anatomy.md` (plate scaffold,
render() extended); `$SK/field-story/references/symbol-craft.md` (sigil spec + validator);
`$SK/field-story/references/orchestration.md` (contract-first fan-out, verify protocol);
`$SK/field-story/references/i18n-gauntlet.md`; `$SK/field-story/references/deployment.md`.

### 1.2 editorial-dashboard (and its renamed fork `milton` in synced skills)
**Essence.** Single-file editorial HTML "dashboard" about an idea/person/body of work that reads like an
art-directed magazine. Four crafts: the critique lens (what would the *subject* dismantle?), custom inline
SVG with a different visual idiom per concept (16-idiom catalog), hand-drawn humanism (Caveat marginalia,
scribble underline, wobble filter, fleurons), interactive enactment (stripping slider, drawing canvas,
three-axis dial, hover grid, N-axis cycle dial, embodied checklist). v1 → `what-would-[subject]-say.md` →
surgical v2. `--deep` flag in Manu's inbox-ops routine layers this on top for the dashboard.
**In → Out.** `Subject + Sources + Tone` → spine (6–10 ideas) → `[topic]-dashboard.html` +
`what-would-[subject]-say.md` (+ `[topic]-dashboard-[lang].html`).
**Gates.** Tag-balance / anchor-coherence / JS-id regex validator; critique pass mandatory; "fine vs great"
table; 5-step icon audit (color/shape/density/joke variety).
**Conventions.** Palette cream `#F1EBDD`, deep paper `#E8DFC8`, ink `#1A1612`, jewel accents
(red `#D62828` …) — `$SK/editorial-dashboard/SKILL.md:190`; type Fraunces (SOFT/WONK axes) + DM Sans +
JetBrains Mono + Caveat — `:191`; eyebrow pattern "§ One · subtitle" → display title with one italic
word → lede; icon viewBox 100×100 (hero larger); palette-aliasing for non-Western subjects; deliver to
`/mnt/user-data/outputs/`. Note: Step 1 says "confirm three things" (asks) — contrasts with meta-suite doctrine.
**Key paths.** `$SK/editorial-dashboard/SKILL.md`; `references/critique-lens.md`; `references/design-tokens.md`;
`references/svg-icons.md` (16 idioms); `references/svg-generation-process.md` (5-step invent-an-icon,
wobble filter); `references/interactive-patterns.md` (6 enactment patterns incl. **drawing canvas**);
`references/hand-drawn-flourishes.md`; `references/cultural-adaptation.md`; `references/localization.md`;
`assets/starter-template.html`. Synced `milton` = byte-near copy: `$SK/milton/` (same refs).

### 1.3 ceti-explainer
**Essence.** The CETI gold-standard animated technical explainer: one SVG diagram (1000×464) that builds a
concept over ~40 s, 8 beats, on ONE deterministic clock (`render(t)` is a pure function of time), with
a video-like player (scrub, captions, chapter rail, keyboard, Tweaks). Long format: ~110 s, 7 movements,
scene archetypes A1–A7, brand-assembly (whale) bookends, 960×540. The author writes ONE content module;
engine, shell, tokens are inherited.
**In → Out.** Content brief (mechanism, worked example with real numbers, anchor, 8 beats ≤18-char labels
≤118-char captions, aha, refs) → `<ep-id>.js` exporting `window.EXPLAINER = {meta, beats, build, render,
setMath}` + `window.__AUDIT`, `window.__REGIONS`, `window.__LAYOUT` → `python3 assets/build.py <ep>.js
"<Title>" [--preset ceti|owala] [--brand] [--theme x.css]` → one offline `.html`.
**Gates.** `node assets/gate.mjs` must PASS: 8 beats, 35–45 s, last beat "Why it matters", captions ≤118,
labels ≤20, `meta.tag` ≤38 chars (§15a), one scene lit per region (§15b via `ex.seg`), no visible-block
overlap per frame (§15d), `__AUDIT()` math invariant; headless `snapshot.mjs` per beat-middle and the
7→8 boundary; browser overlap auditor. MUST/MUST NOT list: no setTimeout/setInterval/CSS-keyframe
sequencing, no scroll/IO/hover-driven state, build-once/mutate-only, token roles only (no raw hex), SVG
text ≥11 px, no hype words, no emoji.
**Conventions (CETI method).** Design-director method: audience → critique the obvious version →
archetype (Derivation / Process / Code-trace / State machine / Transformation / Comparison) → anchor →
worked example → 8-beat arc → hierarchy. Three y-bands (anchor 34–124, working 130–292, detail 300–456).
One saturated accent per scene (copper default). Voice: warm not cheerful, dry, "you", sentence case, one
italic word per title. Fonts locked: Fraunces 300 italic / DM Sans / Space Mono. `ex` toolkit:
`ease{glaser,warmIn,defer,collect,rest,linear}`, `win`, `ramp`, `pulse`, `seg`, `fit`, `fmt`.
Long-form: speed chips, resume, poster frame, 3 s lull budget, honesty beat (Limits) non-negotiable.
**Key paths.** `$SK/ceti-explainer/SKILL.md`; `LONGFORM.md`; `HANDOFF.md`; `assets/engine.js`;
`assets/gate.mjs`; `assets/snapshot.mjs`; `assets/build.py`; `assets/shell.template.html`;
`assets/ceti-tokens.css`; `assets/ceti-motion.css`; `assets/audit-overlaps.js`; `assets/_episode-template.js`;
`presets/ceti.css`; `presets/owala.css`; `themes/README.md`; `themes/example-helio.css`;
`briefs/BRIEF-rag.md`; `briefs/BRIEF-mcp.md`; `reference/self-attention.js` (the bar);
`reference/{oauth,tcp,binary-search}.js`; `reference/longform/feature-cut-v2.{js,html}`;
`reference/SPEC-original.md`.

### 1.4 algorithmic-art (Anthropic example skill — the only existing p5.js skill)
**Essence.** Two-step: write a 4–6 paragraph "algorithmic philosophy" manifesto (.md), then express it
as a seeded p5.js sketch inside a FIXED viewer template (sidebar: Seed → Parameters → Colors? → Actions).
Embeds a "conceptual seed" as a subtle reference. Art Blocks-style reproducibility (`randomSeed`,
`noiseSeed`), seed prev/next/random/jump, Regenerate/Reset/Download PNG.
**In → Out.** `user prompt:str` → `philosophy.md` + single `.html` (p5 1.7.0 from cdnjs) (+ optional `.js`).
**Gates.** None mechanical. Prose craftsmanship rules ("meticulously crafted" repeated), "same seed →
identical output", template fixed sections must be preserved.
**Conventions.** Anthropic branding locked in the viewer: Poppins + Lora, `--anthropic-dark #141413`,
`--anthropic-light #faf9f5`, `--anthropic-orange #d97757`, `--anthropic-blue #6a9bcc`, `--anthropic-green
#788c5d`, light gradient backdrop, "no dark themes" (`templates/viewer.html:26-36`). Canvas typically
1200×1200 / 800×800. **Conflicts with CETI** (dark editorial, Fraunces/DM Sans/Space Mono) — p5 studio
must not inherit this chrome.
**Key paths.** `$SK/algorithmic-art/SKILL.md`; `$SK/algorithmic-art/templates/viewer.html`;
`$SK/algorithmic-art/templates/generator_template.js`; `$SK/algorithmic-art/LICENSE.txt`.

### 1.5 meta-mvp (synced) and meta-suite:meta-mvp (plugin)
**Essence.** One-liner → full WOW bundle: intake, research, vision, reusable meta-prompt, SPEC layer
(3–6 module specs via concurrent sub-agents, two layers each), typed plan, grounded data model +
`seed_data.json`, two dashboards (Motion editorial tool + Aceternity showcase with an inline ceti
8-beat engine on top), optional categorical appendix. Category theory is the hidden engine.
**In → Out.** `prompt:str` → `00_INTAKE.md … 05_DATA_MODEL.md`, `03b_COMPONENT_SPEC_META_PROMPT.md`,
`SPEC_01..NN_*.md`, `seed_data.json`, `dashboard_tool.html`, `dashboard_showcase.html`,
`APPENDIX_how-we-thought.md`.
**Gates.** Hard completion checklist; `quality-gates.md`: JS parses (node `new Function`), ceti contract,
`dict_color.py audit --threshold 12` ≈100%, mobile markers, anti-slop grep (hype words,
`functor|morphism|colimit|yoneda|adjunction` banned in client files), fact-check, packaging.
**Conventions.** Synced copy says ALWAYS run `AskUserQuestion` intake; the **plugin copy overrides**:
"Meta-Suite doctrine … Never ask the user clarifying questions … state your assumptions in one line"
(`$PL/meta-suite/skills/meta-mvp/SKILL.md` lines 17–22, 61). Numbered artifact files; custom 1.6 px
`currentColor` line icons; dict-color palettes; bertin encoding; viewport meta + ≥2 breakpoints.
**Key paths.** `$SK/meta-mvp/SKILL.md`; `$SK/meta-mvp/references/{pipeline,intake,category-expansion,
meta-prompt-kit,spec-layer,meta-plan-kit,dashboard-playbook,quality-gates,worked-example}.md`;
`$SK/meta-mvp/templates/ceti-engine.md` (inline deterministic 8-beat engine, copy-paste);
`$SK/meta-mvp/templates/dashboard-skeleton.md`; plugin twin `$PL/meta-suite/skills/meta-mvp/`.

### 1.6 meta-operad
**Essence.** The operadic upgrade layer: lift any decomposition into a typed, colored tree of questions
(ToQ), check it re-composes to the root (COMPOSE witness), run partial collapses (Tier 1: total vs. full
decomposition; Tier 2: + one mid-collapse per internal edge; Tier 3: all/≥6 sampled), gate on
operadic consistency (OC); on disagreement compute the inconsistency kernel (the edge that broke).
Re-valuate the same tree in confidence / cost / evidence algebras. Inference-only.
**In → Out.** `Decomposition` → `ToQ{nodes: template(typed blanks), edges: color}` → OC verdict
(consistent → promote; inconsistent → localized defect report, never ship) + optional cost/confidence/
evidence valuations.
**Gates.** Typed edges; compose witness; OC tier declared with cost multiplier before inference;
kernel on failure; single tree for all valuations; plain-language out. v2.1 lessons: defects cluster on
WITNESS / INTERFACE / VERIFICATION edges; type the probes; figures from a model file; regex-scan prose;
pre-register + SHA-256-freeze A/B lanes; lane law at plan time; every run mints atoms + updates INDEX.md.
**Conventions.** Meta-Suite doctrine (never ask; math internal unless asked, then full + cited). Grounded
in arXiv:2606.13634 / 2606.13649.
**Key paths.** `$SK/meta-operad/SKILL.md` (only file on disk; `references/operadic-theory.md`, `PATCHES.md` missing).

### 1.7 moe-eval (and its identical twin multi-agent-eval)
**Essence.** Seat-based adversarial evaluation that ends in PROVEN fixes. FRAME (BRIEF.md with verbatim
promises, findings contract, frozen severities, reward rule, privacy rule) → SEAT (4 core relation-seats:
user, operator, craft, red team; + domain / counterparty / naive / maintainer) launched isolated in one
message → MERGE (strike evidence-less rows, merge on kernel, re-run every P0 repro, Discrimination line,
agreement matrix, contested rows) → FIX (fresh fixer; reproduce first; never weaken a gate; never
supply a fact; proof forms; EVAL-FIXES.md) → LEAVE A SELF-CHECK (EVALS.md + runnable `scripts/selfcheck.*`
that fails on the pre-fix backup per fixed row + one lesson atom appended to `references/tells.md` + version bump).
**In → Out.** `Artifact path` → `<artifact>-eval/{BRIEF.md, prompts/<seat>.txt, <seat>.md, <seat>-scratch/,
TRIAGE.md, EVAL-FIXES.md, backup-<ver>/}` + inside the artifact: `EVALS.md`, `scripts/selfcheck.*`,
tells.md row.
**Gates.** Definition of Done (every seat reported or "partial panel"; every P0 fixed-and-proven in both
halves or signed-off/gated; self-check fails on backup and passes clean; independent verifier); Containment
(clean copy, fake HOME, network off, commands classified by effect: publish/deploy/delete/overwrite/
retrain/spend/other). Measured cost ≈1.2–1.5 M tokens full run. The closing plain sentence is fixed text.
**Conventions.** Builder ≠ coordinator ≠ evaluator ≠ merger ≠ fixer. Sign-off = user's literal words + date.
**Key paths.** `$SK/moe-eval/SKILL.md`, `$SK/multi-agent-eval/SKILL.md` (references and scripts NOT on disk —
see §0). Working exemplar of the output shape: `$PL/sheaf-suite/EVALS.md`, `$PL/sheaf-suite/scripts/selfcheck.sh`.

### 1.8 noether-wiki
**Essence.** Persistent wiki (folder of interlinked markdown pages + `graph/` index) maintained under
conservation-law discipline: every mutation batch runs PROPOSE → MEASURE (deterministic `wikictl.py`) →
DECIDE → REPAIR (≤k=3, strictly shrinking) → COMMIT (LEDGER row) / ESCALATE. Exact vs soft lenses with
named drift units, ε_step / B_task budgets, RE-BASELINE as the only legal law change, REFIT outer loop,
shadow lenses, ESCAPES.md as lens-mining fuel. Modes: EXTRACT / GROW / MERGE / REFIT. Tiers L1–L5.
**In → Out.** `Corpus` → `<wiki>/{wiki.yaml, pages/*.md, graph/{entities,triples}.jsonl,
sources/SOURCES.md, _meta/{LEDGER,RE-BASELINE,ESCAPES}.md}`.
**Gates.** 3–7 gating lenses (link.integrity, entity.unique, sync.index, prov.coverage, …); never relax a
threshold to pass (critic capture); merge never "smooth" with zero conflicts.
**Key paths.** `$SK/noether-wiki/SKILL.md`; `references/LENS-CATALOG.md`; `references/MERGE-PROTOCOL.md`;
`references/THEORY.md`; `scripts/wikictl.py`; `templates/{wiki.yaml,page.md,LEDGER.md,RE-BASELINE.md,
ESCAPES.md,SOURCES.md}`.

### 1.9 category-master (skimmed)
**Essence.** Rigorous category-theory reference (universes/size, functors, naturality, adjunctions,
limits, monoidal, enriched, toposes, higher categories, **operads** §9, coherence, Kan extensions).
Used for internal-register justification only. **Path.** `$SK/category-master/SKILL.md` (single file).

### 1.10 sagmeister
**Essence.** Opinionated, argument-first single-file artifact (reader / single-poster / manifesto-cards /
exhibition-catalogue). Every spread resolves to one declarative, falsifiable claim; type built out of the
subject's material (20 constructed-type strategies); full-bleed monocolor spreads, extreme scale contrast,
no nav; mandatory counterargument spread; time-as-ingredient interactions (long-view toggle,
slider-redistribute, diptych, click-to-reveal, hold-to-decode, scroll-driven decay); critique asks what
*Stefan* would dismantle (15 canonical critiques). Explicit anti-milton.
**In → Out.** `Subject, Sources, Tone, ArtifactType, Position:str` → `[topic]-monograph.html` +
`what-would-sagmeister-say.md`.
**Gates.** One-sentence test (declarative, falsifiable, specific, force verb, subject would sign);
tag-balance validator; two interactive spreads max for a reader; ≤2 constructed-type moments.
**Conventions.** Palette magenta `#FF006E`, cyan `#00F5FF`, chartreuse `#DFFF00`, navy `#050A30` …
(`$SK/sagmeister/SKILL.md:182`); type Bowlby One / Bricolage Grotesque / Big Shoulders Display / Space
Grotesk / Space Mono, "No Fraunces … no handwriting" (`:183`); headlines 14–22 vw, captions 10–11 px.
**Key paths.** `$SK/sagmeister/SKILL.md`; `references/the-one-sentence-test.md`; `references/constructed-type.md`
(material-pile, smoke, mosaic, punch-card/dot-matrix, pixel tile, negative space — all natural p5 targets);
`references/spread-architecture.md`; `references/the-sagmeister-critique.md`; `references/time-as-ingredient.md`;
`references/artifact-type-presets.md`; `references/voice-and-tone.md`; `references/sagmeister-source-material.md`;
`assets/starter-spread.html`.

### 1.11 milton (plugin: skill + agent)
**Essence.** Brand-agnostic Glaser-philosophy design system: "the philosophy is the contract, the look is
a preset". Five unbending rules (warm grounds only — never pure #FFF/#000; drawn for the purpose;
ambiguity engages; just enough is more; web-first). Modes: single-icon, icon-set, showcase-page,
dashboard, full-system, tokens-only, brand-fork. An eight-phase meta-prompt (affection → question +
counter-question → ten variants → pun pass → tough-but-kind critique → refine three → strip until it
breaks → three-responses test (yes/no/WOW) → truth check). A separate read-only **milton agent** audits
12 items (warm grounds, token-based, type roles, accent system, light+dark, system pref, reduced motion,
AA, touch ≥40 px, fluid layout, mobile nav, soul) and ends with ONE "Glaser question".
**In → Out.** brief → single-file HTML / 200×200 SVG icons (`currentColor`, `<title>`+`<desc>`, 2–3
colors, stroke 3–6) / tokens.css; agent: file path → structured review (Verdict, Brand context, What's
working, What needs revision, five-rule check, PASS/WARN/FAIL table, Glaser question).
**Conventions.** Default preset = CETI: `--paper #FAF7F2` / dark `#1C1A15`, `--ink #1A1916`, five actors
vermilion/cobalt/sunflower/forest/plum, Bricolage Grotesque / DM Sans / JetBrains Mono, CETI legacy
palette (olive/slate/sage/cream/camel), `--ease-glaser cubic-bezier(.34,1.56,.64,1)` (**differs** from the
CETI/owala `--ease-glaser (0.22,1,0.36,1)` — a naming collision p5 studio must resolve by role, not name).
Claude/Anthropic preset ships as a fork.
**Key paths.** `$PL/milton/.claude-plugin/plugin.json`; `$PL/milton/agents/milton.md`;
`$PL/milton/skills/milton/{SKILL,PRINCIPLES,WEB,META_PROMPT,BRAND_BOOK,ICONS,MODES}.md`;
`$PL/milton/skills/milton/references/{tokens.css,page-template.html,icon-sprite.svg,icon-template.svg}`;
`$PL/milton/skills/milton/references/presets/{README.md,claude-anthropic.css,claude-anthropic.md}`.

### 1.12 dict-color
**Essence.** Palette intelligence grounded in Sanzo Wada's *Dictionary of Color Combinations* (159 colors,
348 combinations) and JIS Z 8102 (139 traditional colors). CLI verbs: `audit` (extract hex/rgb from any
text file, map to dictionary by CIEDE2000, coherence %), `generate` (size 2–4, mood, family, `--near`
seed hex, `--count`, `--seed-n`, `--out`), `export` (css / tailwind / json / design-system on a 100–900
scale keyed by role), `export_print.py` (450-DPI swatch sheets). Roles dominant/supporting/accent/detail
at ~60/30/10/trace.
**In → Out.** `mood|seed hex|file` → `pal.json` (named colors + roles) → tokens (`--color-wada-500` …);
audit → `{coherence_pct, per-color nearest+ΔE}`.
**Gates.** Audit threshold ΔE (default 10; meta-mvp uses 12). **Limitation for p5:** `colorkit.extract_colors`
only matches `#hex` and `rgb()/rgba()` (`$SK/dict-color/scripts/colorkit.py` HEX_RE/RGB_RE) — it misses
p5 calls like `fill(217,102,41)`, `color('hsb', …)`, `colorMode(HSB)`, arrays `[217,102,41]`, and
runtime-generated colors (lerpColor, noise-mapped hue). p5 studio needs a runtime palette sampler.
**Key paths.** `$SK/dict-color/SKILL.md`; `references/{wada-philosophy,flags,claude-design-bridge,
jis-traditional,print-export}.md`; `scripts/{dict_color.py,colorkit.py,export_print.py}`;
`assets/{wada-colors.json,wada-combinations.json,jis-traditional.json,ATTRIBUTION.md}`.

### 1.13 bertin
**Essence.** Correct-before-pretty data graphics per Bertin's *Semiology of Graphics*: classify data
levels (≠ nominal / O ordered / Q quantitative), match visual variables by perceptual ceiling (position &
size quantitative; value & texture ordered; hue/shape/orientation nominal only), design for "the image"
(answer in one glance), choose chart as output of encoding. Two build tracks (Babel-standalone prototype;
Magic UI / shadcn production).
**Gates.** Critique playbook table; 60-second encoding audit; anti-patterns (hue for order, pie for
comparison, dual dissociative encodings, >7 categories, decoration with perceptual cost).
**Key rule for p5.** "Looping ambient motion behind a chart, pulsing data marks, particles — pure perceptual
cost" (`references/code-patterns.md` §4) — a direct constraint on p5 backgrounds behind data.
**Key paths.** `$SK/bertin/SKILL.md`; `references/{bertin-foundations,encoding-matrix,image-theory,
chart-selection,code-patterns}.md`; `assets/{babel-standalone-prototype.html,magicui-data-panel.tsx}`;
`examples/worked-example-survey.md`.

### 1.14 motion-stack
**Essence.** Twelve named anime.js v4 motion patterns + five chrome patterns for single-file editorial
decks/readers (cursor spotlight, word-by-word claim rise, SVG draw-on stagger, lamp-glow fill after
outlines, NumberTicker, orbital labels, stack assembly, per-clause reveal, highlight wipe, marginalia
drop, signature reveal, constructed-type letter draw-on; scroll-snap deck, progress bar, counter +
overview, play-once IO, theme tokens). Extracted verbatim from the CETI SILVER v3 decks.
**Gates.** Global `REDUCED/HOVER/MOBILE` booleans gate every pattern; performance budget (≤35 KB gz deck,
≤2 simultaneous animations, ≤80 ms main-thread per slide enter); validator (tag balance, SVG ≥ slides,
one h1).
**Conventions.** Motion tokens `--ease-spring (0.22,1,0.36,1)`, `--ease-out (0.16,1,0.3,1)`,
`--ease-in-out (0.65,0,0.35,1)`, durations 120/220/400/700/900/1100/2400 ms, staggers 35/80/200 ms; themes
Midnight (`--bg #0d1320`, `--accent #f5c84b`), Letterpress (`--accent #c83c2a`), Field Notes
(`--accent #a35c2e`); Fraunces / DM Sans / Caveat / JetBrains Mono.
**Key path.** `$SK/motion-stack/SKILL.md` (single file).

### 1.15 motion-media-l2
**Essence.** Level-2 schema layer for images and video-like animations: derive → execute → audit →
refine, governed by seven laws: L₀ SkillBinding (bind every slot to a named resolver skill first),
L₁ RoleTyping (tokens are Role→Value; one role-map rebrands), L₂ NarrativeSlots (Hook / Mechanism /
Stakes / Takeaway; takeaway = audience agency), L₃ ImportGate (foreign components audited + provenance),
L₄ MachineEdits (σ = exact-match `(old,new,count)` triples, atomic), L₅ VerificationLadder (V0 static <
V1 computed < V2 headless render < V3 human; claims state their level), L₆ DeterminismLaw (every frame
a pure function of the clock). **Static-image morphism:** `AdaptMedium(animation→still) := {Clock ↦ ∅;
DeterminismLaw ↦ ReproducibleSeed (generative/seeded art must record its seed)}`.
**In → Out.** brief → derived schema with slot→resolver bindings → role-token map with contrast matrix →
artifact → σ-scripts + proposed new laws (L₇…).
**Key paths.** `$SK/motion-media-l2/SKILL.md`; `references/meta-prompt-v2.xml` (the operating contract);
`references/derivation.md` (provenance of each law).

### 1.16 icon-systems (synced) / shadcn-animations:icon-systems (plugin)
**Essence.** Library selection + install + animation for Shadcn/React icons (Lucide default, Tabler,
Phosphor, Heroicons, Hugeicons, AnimateIcons, pqoqubbw, SVGL brand logos, Iconify). Explicitly refuses
"build an icon system from scratch". Plugin copy adds aesthetic anti-patterns (Lucide-everything = tell #13;
"introduce ONE deliberate custom illustration per page").
**Key paths.** `$SK/icon-systems/SKILL.md` (its 5 references missing); `$PL/shadcn-animations/skills/icon-systems/SKILL.md`;
`$PL/shadcn-animations/skills/icon-systems/references/quick-reference.md`.

### 1.17 generative-ui
**Essence.** Build an interactive self-contained HTML interface instead of a wall of text (Google
Research "Generative UI", arXiv:2604.09577). Seven-step internal procedure (interpret, concept, content,
data/image needs, search, brainstorm ~12 features, filter & integrate); no placeholders/mock data; facts
verified by search; Tailwind Play CDN; canvas/SVG for visualization.
**Gates.** Self-audit: renders and runs, no placeholders, facts cited, images load, responsive, accessible.
**Key paths.** `$SK/generative-ui/SKILL.md`; `references/build-and-tools.md`; `references/paper-and-evaluation.md`.

### 1.18 frontend-design
**Essence.** Commit to a bold, specific aesthetic direction (purpose, tone, constraints, differentiation)
and execute it precisely; avoid generic AI aesthetics (Inter/Roboto/Arial, purple gradients on white,
cookie-cutter layouts); backgrounds as atmosphere (gradient meshes, noise textures, geometric patterns,
grain) — the natural slot where a p5 texture layer plugs in.
**Key path.** `$SK/frontend-design/SKILL.md` (single file).

### 1.19 silver-hero-engine
**Essence.** Meta-design layer for the CETI Silver pencil-line hero family: cozy hand-drawn SVG vignettes
(640×400, `meet`), exactly one gold light source, motion that "starts lively, settles into rest" via two
host engines (CSS stroke draw-on; SMIL decelerator clock 1.15× → 0.06× over 4.8 s). Self-registering
Babel-standalone JSX modules discovered through window registries.
**In → Out.** meta-prompt `<brief>` → one `.jsx` module pushing an entry into `HERO_REGISTRY` /
`SCENE_REGISTRY` / `PART_REGISTRY` / `ANIM_REGISTRY` (`{key,label,…,Comp}`) → catalog page.
**Gates.** `<verify>`: Babel-compiles, one gold, every mover in `g.anim`, no opacity-0→1 on load-bearing
content, 640×400 meet + safe region, unique kebab key, reduced-motion safe, banned-word scan, title anchored
to persona. Seven laws incl. "modules write normal-speed SMIL; the HOST decelerates".
**Conventions.** North star: "help individuals SLOW DOWN and filter the noise." Tokens only
(`--ink`, `--ceti-gold #d4a84b`, `--bg`, surfaces); body classes `palette-boardwalk mode-dark tier-silver`;
personas Maya/Sarah/Marcus/Linda/Sam (identity by setting, never faces); band + plate layout.
**Key paths.** `$SK/silver-hero-engine/SKILL.md`; `references/{meta-prompt,motion-spec,registry-contract,
design-language,meta-plan}.md`; `templates/{shell.html,colors_and_type.css,decelerator-engine.jsx,module-template.jsx}`.

### 1.20 artifact-chain
**Essence.** Long template-bound deliverables as a decomposed chain of one-decision atoms with typed ports,
mechanical gates, snapshot-before-ledger checkpoints and a five-rung QA ladder (text extraction → file
integrity → structural invariants → thumbnail render → human). Authoring layer (stochastic: sample,
review) vs production layer (deterministic: invariants, no voting).
**Key paths.** `$SK/artifact-chain/SKILL.md`; `references/{template-archaeology,rule-compilation,atomization,
qa-ladder,adversarial-review}.md`; `scripts/{chain.py,evaluate.py,layout_catalog.py,extract_assets.py}`;
`assets/rules.example.json`.

### 1.21 op-consist
**Essence.** The executable OC gate: evaluate ≥2 partial collapses of a ToQ in fresh contexts (depth-2
default = direct vs decomposed, 3 calls), compare under a DECLARED equivalence (token-F1 / number / bool /
semantic judge with rubric / **behavioral test-vector identity for code**), ACCEPT / REFUSE /
UNFACTORABLE, localize the failing edge, write `.toq/<slug>/consist-report.yaml`. Blame order:
tree → edge → agent. "oc_signal", never "verified".
**Key paths.** `$SK/op-consist/SKILL.md`; `references/{evidence-and-empirics,equivalence-rubrics,
failure-modes,deep-tiers}.md`.

### 1.22 tell-apart
**Essence.** Audits whether a representation (metric, test, rubric, schema, tool schema) can distinguish
what its consuming decision needs. Witness triple (A, B, D) with output shown on both; closure check;
moves HUNT-COLLAPSE / HUNT-NOISE / REPAIR (red + green certificate) / ECONOMIZE / ALIGN / TRIAGE;
verdicts REPAIR | ECONOMIZE | ALIGN | ACCEPT | STRATEGIC-COLLAPSE | TRIAGE; render layer for humans.
**Key paths.** `$SK/tell-apart/SKILL.md`; `references/{moves,theory,domains,render,worked-example}.md`;
`assets/notebook-render.html`.

### 1.23 research-loop
**Essence.** `/loop` — Karpathy-style continuous research pipeline (yt / ws / arxiv adapters): BUDGET →
WATCH → INGEST → DISTILL (one query/source, six atom types) → GATE (G0 injection lint, G1 grounding, G4
novelty, G5 medium validation, G2 external falsifier, G3 OC) → MINT (wiki + INDEX in the same transaction;
skill/plugin mints are A0 = human-merge forever) → SERVE (`/loop ask`, demand ledger, hit-rate is the one
number) → REFRESH. State lives in a git repo.
**Key path.** `$SK/research-loop/SKILL.md` (its references/scripts are not on disk).

### 1.24 meta-suite plugin (9 skills)
Plugin manifest `$PL/meta-suite/.claude-plugin/plugin.json`; README `$PL/meta-suite/README.md` states the
four design promises: **Self-contained · Never asks you questions · Clear over clever · It compounds.**
Each skill: SKILL.md + `references/internal-model.md` (the typed/categorical model, explicitly "do NOT
surface to the user unless they ask") + one substance file.

| Skill | Essence | In → Out | Key paths |
|---|---|---|---|
| meta-prompting | task → example-agnostic meta-prompt (category, typed slots, procedure, bound rules, XML/JSON schema); RMP loop 3–5 passes to empty edit script | task → `<system>`+`<syntax>` meta-prompt | `$PL/meta-suite/skills/meta-prompting/SKILL.md`; `references/meta-meta-prompt.md` (incl. the **design-artifact synthesis meta-prompt**: typed tokens, `[Decision]→[Sketch]→[Render]→[Audit]→[Resolved]`); `references/theory.md` |
| meta-planning | TASK → L2 meta-plan (domain map + closure check, typed WorkUnits, dependency graph with 5 parallel criteria, ContextPackets, gates, kaizen loop); spawned fresh-agent probe; OPUS→FABLE→MERCURIO tri-audit, tiers 1–3, thrash rule | task → `generated_meta_plan` + `gap_report` | `.../meta-planning/SKILL.md`; `references/{meta-meta-planning-prompt,domain-mapping,execution-handoff,anti-patterns,audit-protocol,auditor-meta-prompts,examples,edit-history}.md` |
| meta-design | brief → medium-specific DESIGN SCHEMA; Proposer → Executor → Auditor; named schema-preserving edits (`AdaptMedium(web→slides)`); composite briefs compose (`dashboard = data-viz ∘ layout ∘ tokens`); 7 typed acceptance predicates (contrast, targets, motion ≤3 flashes/s, hierarchy, rhythm 45–75ch, responsive, pedagogy ≤7 new elements/view); precedence a11y ⊐ brief ⊐ aesthetics; ≤3 refinement passes | brief+content+brand_inputs → design system (Palette: list[OKLCH], TypeScale, SpacingRhythm, MotionCurve, Breakpoints) + generator code + artifact + audit table | `.../meta-design/SKILL.md`; `references/meta-meta-design-prompt.xml` |
| meta-mvp | see §1.5 | | `.../meta-mvp/` |
| meta-compound | compounding map: Frame→Do→Review→**Capture**→Repeat; 11 pillars (encode judgment into artifacts, atoms, close the discoverability loop, maintain against rot) | project → loop, anchors, top-3 leverage investments, capture/retrieval/refresh policy, first move | `.../meta-compound/SKILL.md`; `references/{pillars,internal-model}.md` |
| meta-craft | craft constitution (5–8 of 13 rules), slop-vs-craft table, evidence-based Definition of Done | work → constitution + DoD | `.../meta-craft/SKILL.md`; `references/{principles,internal-model}.md` |
| meta-review | 3–6 independent lenses (always Adversarial + Clarity), blind-spot probes, P1/P2/P3, precedence Correctness/Safety ⊐ Scope ⊐ Coherence ⊐ Clarity, one **lesson atom** | artifact → findings + fix list + lesson atom | `.../meta-review/SKILL.md`; `references/{lens-catalog,internal-model}.md` |
| meta-research | decompose → fan out → triage → cross-verify → synthesize → capture 1–3 **knowledge atoms** (frontmatter: type, tags, confidence, date, source) in `knowledge/` | question → cited brief with confidence + atoms | `.../meta-research/SKILL.md`; `references/{method,internal-model}.md` |
| meta-context | substrate / load / compression / persistence-handoff policies + discoverability index; starter `CONTEXT.md` + `knowledge/_template.md` | project → context plan + scaffold | `.../meta-context/SKILL.md`; `references/{policies,internal-model}.md` |

### 1.25 shadcn-animations plugin (5 skills + plugin-root WOW kit)
Manifest `$PL/shadcn-animations/.claude-plugin/plugin.json`; README `$PL/shadcn-animations/README.md`.
Plugin-root references (taste layer, linked from every skill as `../../references/…`):
`$PL/shadcn-animations/references/critique-pass.md` (three voices: Glaser "the page's one indelible
mark?", Sagmeister "what did it refuse?", Push Pin "where is the wit?" — required final step, written as an
HTML comment block), `references/ai-page-tells.md` (14 slop tells incl. #14 Sparkles-as-AI, meta-tell
"designed-by-an-LLM rhythm"), `references/palettes.md` (12 named OKLCH palettes incl. "Anthropic
parchment", "Push Pin Studios", "PLACEHOLDER MAGENTA (refuse)"), `references/type-pairings.md`,
`references/page-types.md`.

| Skill | Essence | p5 relevance | Paths |
|---|---|---|---|
| svg-animation-techniques | three techniques: path draw (anime.js v4 `svg.createDrawable`, Motion `pathLength`, GSAP DrawSVG), morph (`svg.morphTo`, MorphSVG), motion path; reduced-motion mandatory; anti-patterns (rainbow strokes, morphs between unrelated shapes, diagrams with no real data flow) | the SVG side of the p5↔SVG bridge: p5-generated paths (flow-field polylines, packed circles) exported as SVG become draw-on targets | `$PL/shadcn-animations/skills/svg-animation-techniques/SKILL.md`; `templates/{animated-check.tsx,multi-path-logo-reveal.tsx}` |
| engine-selection | decision tree across Motion / GSAP / anime.js v4 / Lottie | **has no generative-canvas branch** (only "Confetti/particles → Motion + canvas or Magic UI Particles" in `references/decision-tree.md:126`) — p5 studio should add the branch | `.../engine-selection/SKILL.md`; `references/{decision-tree,library-comparison-matrix}.md` |
| scroll-driven-explainers | 5 patterns: progress bar, fade reveal, word-by-word scroll reveal, sticky stack, multi-row parallax hero | p5 sketches can take `t := scrollProgress` (motion-media-l2 says the determinism law still holds) | `.../scroll-driven-explainers/SKILL.md`; `templates/{scroll-progress,sticky-stack}.tsx` |
| animated-component-galleries | Magic UI (trust), Aceternity (spectacle), Motion Primitives, SmoothUI; ≤2 libraries, ≤1 hero-tier effect, critique pass required | Magic UI `Particles`/`Meteors`, Aceternity Sparkles are the generic substitutes p5 studio must beat | `.../animated-component-galleries/SKILL.md`; `references/quick-reference.md`; `templates/*.tsx` |
| icon-systems | §1.16 | | |

### 1.26 owala-design plugin (6 skills)
Manifest `$PL/owala-design/.claude-plugin/plugin.json`; essay `$PL/owala-design/PHILOSOPHY.md`
(define → encode → adapt → verify → animate → compose; "tokens are the contract"; frontmatter recall
pattern: one-sentence what, 4–6 trigger phrases, domain anchors, no buzzwords).

| Skill | Essence | Key paths |
|---|---|---|
| owala-colors | 22 named soft colorways; pastels are surfaces only; five-actor reduction `--actor-1 #7A2E4A` Bold Berry … `--actor-5 #A8C088` Dreamy Field (SKILL.md:46–50); ground `#FAF7F2`, ink `#1A1612`; hexes are photo approximations | `$PL/owala-design/skills/owala-colors/{SKILL,PALETTE,PSYCHOLOGY}.md`; `references/owala-soft.{css,json}` |
| design-tokens | raw + semantic two-layer `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--z-*`, `--ease-*`; kebab-case; no hex outside `:root` | `.../design-tokens/{SKILL,SCALES}.md`; `references/tokens-template.css` |
| motion-curves | `--ease-glaser (0.22,1,0.36,1)`, warm-in, defer, collect, rest; 180/280/480/720 ms; no bounce; transforms only >720 px | `.../motion-curves/{SKILL,CURVES}.md`; `references/motion.css` |
| layout-rhythm | 10-step spacing, containers 42/64/80 rem, breakpoints 640/960/1280 | `.../layout-rhythm/{SKILL,RHYTHM}.md`; `references/layout.css` |
| dark-mode-pairing | OKLCH: L_dark = 100−L, C×0.85, hold H | `.../dark-mode-pairing/{SKILL,ALGORITHM}.md`; `references/dark-pair.example.css` |
| wcag-contrast | pair matrix, WCAG 2.2 AA floor, APCA supplementary, named OKLCH fixes | `.../wcag-contrast/{SKILL,METHOD}.md`; `references/matrix-template.html` |

### 1.27 design plugin (Anthropic, 7 skills)
`$PL/design/skills/{accessibility-review,design-critique,design-handoff,design-system,ux-copy,
research-synthesis,user-research}/SKILL.md`. Template-driven review/output formats: WCAG 2.1 AA audit
tables (incl. 2.5.5 targets ≥44 px, 1.4.11 non-text contrast ≥3:1), design-critique (first impression /
usability / hierarchy / consistency / a11y, severity emoji), handoff spec (tokens, states, motion
table with duration + easing), design-system audit/document/extend. Connector-aware (`CONNECTORS.md`).
These are useful as **generic critic seats** and for the handoff of a p5 piece into a product team.

---

## 2. Composition table — how ceti-p5-studio calls / is called by each

Direction legend: **→** p5 studio calls the skill (resolver/critic); **←** the skill calls p5 studio
(p5 studio is a provider/layer); **↔** bidirectional bridge.

| Skill | Dir | Integration contract (what crosses the boundary) |
|---|---|---|
| ceti-explainer | ← | **p5 generative background/texture layer under a ceti episode.** Constraint: the explainer's DeterminismLaw (render(t) pure, scrubbable, paused == playing). p5 studio must expose a **clocked sketch mode**: `createSketch({seed, tokens}).renderAt(t)` that is a pure function of `(seed, t)` — either closed-form in t (noise(x,y,t), parametric curves) or simulation re-run from frame 0 with a fixed dt and cached keyframes. Mount as a sibling `<canvas>` behind the 1000×464 SVG (or `noLoop()` + `redraw()` driven from the engine's `render(t)`). Colors only from `--ex-*` role tokens read via `getComputedStyle`. Must pass gate.mjs §15b/§15d unaffected (canvas is not in `__LAYOUT`); must sit at low contrast (≤ ~0.15 alpha of `--ex-ink`) so §15 overlap/legibility and "one focal animation per beat" hold. Long-format A1 brand assembly (particles converge into the whale) is the obvious first archetype p5 can implement with real physics. |
| motion-media-l2 | → | p5 studio binds to it as the schema layer: L₀ (palette slot → dict-color/owala; contrast → wcag-contrast; SVG → svg-animation-techniques), L₁ role tokens, L₂ narrative slots for animated sketches (a still poster also has a Takeaway), L₄ machine edits for parameter refinement, L₅ verification ladder (p5 must report V2 = headless render reached), L₆ determinism, and `AdaptMedium(animation→still)` ⇒ **every still must record its seed**. |
| field-story | ← | **p5 hero visuals and per-plate instruments.** Each plate's `instrument_brief` already asks for "particle fields that clench and release", "a restless field resolves to one still luminous surface" — these are p5 sketches. Contract: the sketch is driven by the plate's single `state` (one mutator → `sketch.setState(state)`), IntersectionObserver-gated, composed reduced-motion still frame, scoped to `#plate-<slug>`, ids prefixed; must use the plate's `--acc`/`--acc-lite`. The hinge plate = a p5 "turn" instrument; the finale = a "subsidence" sketch whose energy decays to stillness. Also: p5 can render the **sigil library** into material/textured variants (ink bleed, engraving hatch) while preserving the SVG spec as source of truth. |
| editorial-dashboard / milton (skill) | ← | p5 provides (a) the **drawing-canvas enactment** pattern upgraded (generative brush that responds to the principle), (b) **`--deep` generative icon/texture system**: per-concept procedural glyphs where each icon uses a *different generative idiom* (flow field, packing, L-system, reaction–diffusion, dot-matrix) — the editorial variety rule applied to algorithms; (c) paper grain / wobble textures rendered once to PNG/data-URI at load. Must respect cream-paper palette and Caveat-marginalia register; critique file `what-would-[subject]-say.md` gets a "what would [subject] dismantle in the sketch" section. |
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

---

## 3. Gaps — what no existing skill covers (p5 studio must provide)

1. **p5.js engineering itself under CETI conventions.** The only p5 skill (algorithmic-art) has no gates,
   no determinism contract, Anthropic-locked chrome, and no performance discipline. Missing: instance-mode
   sketches (no globals — required to coexist inside explainers/plates/React), `pixelDensity` policy,
   HiDPI canvas sizing, resize handling, teardown (`remove()`), multiple sketches per page.
2. **A deterministic clock for stateful simulations.** Every animation skill (ceti-explainer, motion-media-l2
   L₆, meta-mvp ceti-engine) requires `render(t)` pure; p5's idiom is accumulating `draw()` state. Needed:
   (a) closed-form-in-t sketches; (b) fixed-dt simulation with seeded RNG and keyframe checkpointing so any
   t can be reconstructed (scrub), (c) a "replay from 0 is identical" proof (frame hash at sampled t).
3. **Seed + parameter provenance as an artifact.** Record `{sketch_id, p5 version, seed, params, palette
   source, canvas size, frame t}` with every still/export (motion-media-l2 demands it; nothing implements it).
   Shareable URL state (`?seed=&p=`), seed gallery/contact sheet, reproducible re-render.
4. **Headless render + perceptual metrics (V2 on the ladder).** No skill renders canvases headlessly and
   measures them. Needed: Playwright/Chromium render at fixed seeds/times → PNG + frame hash; metrics:
   palette coverage vs roles (60/30/10), ΔE to dictionary, luminance/contrast map, density/whitespace %,
   edge energy, symmetry, focal point, motion energy and flash frequency over time (≤3 Hz check), FPS and
   memory under a CPU throttle, particle-count ceilings.
5. **Per-sketch adversarial critique specialized to generative art.** moe-eval gives the panel shape;
   nobody supplies generative-art seat prompts, a calibration twin (planted defects: flashing, off-palette
   hue, unseeded `Math.random`, runaway particles, text-on-canvas below AA), or tells for this genre
   ("noise wallpaper", "rainbow HSB sweep", "Perlin flow field #4,000", "bloom on everything",
   "particles behind a chart"). The moe-eval references and selfcheck are not even on disk.
6. **p5 ↔ SVG bridge.** No skill exports p5 geometry as clean, draw-on-ready SVG or imports SVG paths
   (sigils, logomark, icons) as particle targets / masks.
7. **Runtime palette conformance.** dict-color audits only static hex/rgb text; needs a pixel/runtime sampler
   and p5 `colorMode`-aware extraction.
8. **Constructed / generative typography from real glyph outlines.** sagmeister describes it as SVG
   approximations; motion-stack draws hand paths. Nothing uses `font.textToPoints`/opentype outlines with
   the locked CETI fonts (and their load timing) to build material type.
9. **Accessibility for canvas art.** Not covered anywhere specifically: canvas fallback content /
   `aria-label` + `role="img"`, a text alternative describing the piece and its seed, pause/stop control for
   motion > 5 s (WCAG 2.2.2), reduced-motion composed still (not a frozen mid-frame), no color-only meaning,
   flash safety.
10. **Performance budgets for canvas.** motion-stack budgets DOM/anime.js decks; nothing budgets p5 (FPS
    floor, particles cap, offscreen pause via IntersectionObserver, `noLoop()` when hidden, battery/mobile
    degrade path, bundle: p5 ~1 MB min vs a 35 KB deck budget — needs a "render to image" fallback or
    p5 lite/q5 option).
11. **Operadic composition of sketches themselves.** meta-operad composes questions; no skill defines
    sketches as composable operations (layers with typed ports: `Field → Particles → Trails → Post`),
    an operad of layers with associativity laws (same output whether layers are grouped A∘(B∘C) or (A∘B)∘C)
    and a behavioral equivalence for OC on images.
12. **Export pipeline.** PNG at print DPI (dict-color has the 450-DPI canvas recipe for swatches only),
    SVG, GIF/MP4/WebM capture from the deterministic clock (CCapture-style frame stepping), poster frame,
    and handoff into HyperFrames/agentopus if video is wanted.
13. **Licensing/attribution of algorithms and styles.** algorithmic-art warns against copying living
    artists; no skill records algorithm provenance (e.g., "Bridson Poisson-disk", "Tyler Hobbs flow-field
    essay") as citations in the colophon.
14. **A technique library with typed metadata** (what each generative idiom is good for, its parameters,
    perf cost, reduced-motion still strategy, determinism class) — the generative analogue of
    editorial-dashboard's 16 SVG idioms and sagmeister's 20 constructed-type strategies.

---

## 4. Conventions p5 studio must adopt to feel native

**Doctrine lines (copy the shape of `$PL/sheaf-suite/references/doctrine.md` and the meta-suite banner):**
- *Never ask the user clarifying questions* — infer, default sensibly, state assumptions in one line
  (meta-suite README "Never asks you questions"; banner in `$PL/meta-suite/skills/meta-prompting/SKILL.md`).
  Confirm only at real decision points (publish/deploy/anything leaving the folder), mirroring sheaf-suite.
  Never ask the user to pick a seed, noise octave or particle count — choose, state in one plain sentence,
  log the technical value internally.
- *Plain language out; mathematics/algorithms internal* — keep `internal-model.md` per skill (meta-suite
  pattern) and surface the operadic/categorical machinery fully, with citations, only when asked. Client
  artifacts must pass the meta-mvp regex ban (`functor|morphism|colimit|yoneda|adjunction`).
- *Clear over clever; self-contained* — install alone and work; optional composition with sibling skills
  degrades gracefully (meta-design pattern: "optionally compose … never depends on them").
- *It compounds* — every run leaves a reusable thing (technique atom, tells row, seed registry row).
- *Counted vs judged* (sheaf-suite rule 2): measured figures bare ("frame hash identical at 5 sampled t"),
  model judgements flagged ("I looked at 6 renders and judged …").
- *Never weaken a gate; never supply a fact; evaluator ≠ builder* (moe-eval doctrine).
- *Verification ladder level stated on every claim* (motion-media-l2 L₅): V0 lint, V1 computed, V2
  headless render, V3 human.

**Plugin and file layout (match meta-suite / shadcn-animations / sheaf-suite):**
```
ceti-p5-studio/
├── .claude-plugin/plugin.json        # name, version, description, author "Manu Mulaveesala / CETI.AI",
│                                     # homepage, license MIT, keywords, metadata.selfcheck, metadata.evaluated
├── README.md                          # skills table (Invoke | What it emits), design promises, install
├── references/                        # plugin-root shared kit (shadcn pattern: skills link ../../references/)
│   ├── doctrine.md                    # the registers + five rules every skill inherits
│   ├── plain-language.md              # translation table for reader-facing words
│   ├── tokens/ceti.css owala.css anthropic.css   # role-token presets (colors only; fonts locked)
│   ├── tells.md                       # lesson atoms (one row per eval run) — "Attack these first"
│   └── critique-pass.md               # Glaser / Sagmeister / Push Pin voices adapted to sketches
├── skills/<skill>/SKILL.md + references/ + templates/ + scripts/
├── scripts/selfcheck.sh (or .py)      # plugin end-to-end test; step rows with wall time; non-zero exit
├── scripts/check_plugin.py            # frontmatter/name/description/path-resolution lint
├── EVALS.md                           # adversarial evaluation record + final plain sentence
└── docs/ landing/ _archive/           # optional (meta-suite pattern; _archive prunable)
```
- **SKILL.md frontmatter style:** `name` = folder name (kebab); `description` ≤ 1024 chars, starts with
  what it emits, carries `"/<name>"` and 4–6 natural trigger phrases, domain anchor words, a "Do NOT use
  for …" clause naming the sibling to use instead (sheaf-suite/`check_plugin.py` enforces ≤1024 + trigger;
  owala PHILOSOPHY gives the recall pattern). Optional `metadata: {version, tier}` (sheaf-suite) or
  `license:` (algorithmic-art/dict-color). Body opens with the doctrine banner blockquote.
- **references/ layout:** "only load the references you need for the current step" index at the bottom of
  SKILL.md with one line per file saying when to read it (editorial-dashboard, sagmeister, bertin pattern);
  a `worked-example*.md` as calibration ("copy its level, not its content" — meta-mvp, tell-apart);
  `internal-model.md` hidden typed model (meta-suite); templates are literal starting points, never
  rebuilt from scratch (algorithmic-art, ceti-explainer "do not reimplement").
- **Self-check scripts:** `scripts/selfcheck.*` takes the directory under test, runs from a clean copy, prints
  one row per step with timing, exits non-zero on first failure (sheaf-suite `selfcheck.sh` is the model).
  For p5: lint (instance mode, no unseeded `Math.random`, no `setTimeout` driving frames), headless render
  at fixed seeds → frame-hash determinism, palette audit, flash-rate check, FPS floor, reduced-motion still
  exists, a11y fallback present, file self-contained (only allowed CDNs: cdnjs p5 + Google Fonts).
  Every fixed eval row maps to one named step that fails on the pre-fix backup.
- **EVALS.md** in the contract shape: provenance line; counts (found / struck / not-reproduced / fixed /
  structurally-checked / re-baselined / open); Discrimination line; triage table `id | lane(s) | sev | fix |
  status`; sign-offs quoted with date; both self-check runs; headline paragraph; last line the plain
  sentence "We found N problems: M would block release …".
- **tells.md lesson atoms:** one row per eval run = the class of the sharpest P0 + the attack that found it;
  read at FRAME under "Attack these first". Seed it with the generative-art tells from §3.5.
- **Knowledge atoms** (meta-research/meta-compound/mint-atoms): small markdown files with frontmatter
  `type (fact|pattern|caveat|technique), tags, confidence, date, source`, phrased around the future question;
  every capture updates an INDEX in the same transaction ("capture without retrieval does not compound").
- **Ledgers:** append-only `LEDGER.md`/`ledger.jsonl` for sketches (noether-wiki row format: when, step,
  touched, fires, drift, budget left) and `RE-BASELINE.md` for any intentional law/threshold change.
- **Critique-file deliverable:** `what-would-<critic>-say.md` saved next to the artifact (editorial-dashboard,
  sagmeister); for p5 the default critic is Glaser for warm editorial pieces, Sagmeister for argumentative
  posters; the three-voice critique block as an HTML comment in the file (shadcn critique-pass).
- **Build discipline:** contract-first parallel agents (field-story CONTRACT.md: tokens defined once,
  fragments read never redefine; lanes with disjoint write targets — meta-operad lane law); author writes
  one content module, engine inherited (ceti-explainer); one file, no build step, works offline except
  declared CDNs; deliver to `/mnt/user-data/outputs/` (editorial-dashboard/sagmeister) and publish only on
  explicit yes (meta-mvp, sheaf-suite).
- **Voice:** CETI voice — warm not cheerful, dry, "you", sentence case, one italic word per title, no
  emoji, banned hype list ("unlock, supercharge, revolutionize, powerful, seamless, game-changing").
- **Motion:** reduced-motion is non-negotiable and yields a *composed* still (field-story, ceti, motion-stack);
  ≤3 flashes/s (meta-design predicate); IO-gated loops; one focal motion per beat.
- **Tokens:** role tokens only, never raw hex inside the sketch (ceti-explainer, milton rule "no hex outside
  :root"); read colors at runtime via `getComputedStyle(document.documentElement).getPropertyValue('--ex-accent')`
  so presets re-skin without code changes; one rebrand = one role-map (motion-media-l2 L₁).

---

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
