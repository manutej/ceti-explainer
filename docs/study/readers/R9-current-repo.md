# R9 — Current repo audit: ceti-explainer

> Note (2026-10-10): this study describes the repo as it stood when it was written. Several paths it names (contrib/,
> eval/, notebooks/, REQUIREMENTS.md, MERGE-NOTES.md, HANDOFF-JEV-EVAL.md, RUN.md, films/typesafe, skills/ceti-brand, the p5
> studio skills, four chromes) have since moved to archive/ or, for RUN.md, to skills/ceti-explainer/RUN.md. See
> archive/README.md.

Branch `claude/hopeful-keller-2cal0b`, HEAD `d6a12de`, clean. Engine files live under `skills/ceti-explainer/` (`E/`).

**Gate run** (`cd E && node assets/gate.mjs reference/self-attention.js`): exit 0.
`PASS · 38.6s · 8 beats · 214 nodes · 65349 attr-sets`; warning `__AUDIT: softmax→1.0000 · animal=34% · q·k=2.70→1.35`. Other three references PASS. Build 77 KB. `frame-items.mjs` yields 8 items.

## 1. Promise vs. present

Present and working: clone → gate → build with no npm; all seven assets in RUN.md exist; four references PASS; the eval tool runs.

Promised but absent or contradicted:
- **Palette.** README, REQUIREMENTS and RUN lock cream `#FAF7F2` / vermillion `#D94F30` / ink `#2C2A28`. The engine default (`shell.template.html:16–21`, `presets/ceti.css`) renders dark: ground `#0E1014`, accent copper `#CE9A6A`. Cream appears only in `presets/owala.css` (as text ink) and `notebooks/*.html`.
- **"Works offline, no network."** `HANDOFF.md:6` says so, but `assets/ceti-tokens.css:24` `@import`s Google Fonts. Offline falls back to system fonts, changing text widths, which the gate does not model.
- **"Writes Title.html next to the module"** (RUN.md:14). `build.py:44` writes to the CWD.
- **Stale root HANDOFF.md:29** says engine assets are absent. HANDOFF-JEV-EVAL §0 is correct: they are present.
- **"2-minute lecture committed."** No film, lookbook or stills atlas is in the repo; only `notebooks/episode-01.html` (5.8 KB) and `e0-occupancy.html`.
- **Dangling references:** `ceti-brand` → `milton/`, `noether-course/`; `noether-harness/SKILL.md:19` → `assets/meta-meta-prompt.txt`; `LONGFORM.md:5` → `ceti-video-lab/`; `E/HANDOFF.md:28,79` → a "rag-style" reference and `gallery/`.

## 2. Tier-one engine contract

`assets/engine.js` (361 lines, "do not edit"):
- Export `window.CetiExplainer` (line 20); API object at 359: `create, ease, clamp, lerp, win, ramp, pulse, seg, fmt, fit, cubicBezier`.
- Easings 43–50; `win` 55; `ramp` 61; `pulse` 65 (fades spill outside window); `seg` 74 (fades contained); `fit` 92 (shrinks SVG text to width, min 9). `ex.fit` is a convention only; the gate never checks it.
- Clock: beats 113–119; `build` once at 138; rAF loop 234–251, `dt` clamped to 0.05 s (237).
- Keys 321–335; autoplay unless reduced motion (354).
- `localStorage` at 174, 256, 263 with no try/catch.

`shell.template.html`: `create({…, storageKey: m.id})` at 297; Tweaks `setMath` toggle 318; caption-band toggle 319. `__AUDIT`, `__REGIONS` and `__LAYOUT` are module-side hooks read only by the gate.

`assets/gate.mjs` (201 lines):
- **§15a static** 66–90: exactly 8 beats (69); duration 33–46 s (70); last label "why it matters" (71–72); caption ≤118 chars (73–74); label ≤20 (75); `setMath`/`setDetail` present (76–77); `meta.tag` >48 fails, >38 warns (82–85); kebab `meta.id` (86–87); synthesis ≥40 chars (89).
- Sweep 93–108: `build` (98), `render` every 0.2 s, NaN attributes fail (108).
- **§15b** 110–130: `__REGIONS` swept every 0.1 s; more than one scene at opacity ≥0.15 in a region fails (126–127). Absent hook is only a warning (129).
- **§15d** 132–179: `__LAYOUT` blocks; real bounding boxes with translate walk (146–162); visible = opacity ≥0.5; fails when overlap exceeds 6 px in x and 5 px in y (163–176). Text width is estimated at 0.55em (0.62em mono) (145), not font-accurate. `audit-overlaps.js` is the font-accurate check.
- `__AUDIT` 182–191: `ok:false` fails.

The gate hard-codes the 8-beat episode. Any other shape (LONGFORM's seven movements, 110 s) cannot pass it.

## 3. Gold-standard episode: `reference/self-attention.js` (434 lines)

- **DATA** 14–41: tokens; `SCALED` (hand-typed inputs); softmax `W` (19–23); value blend `Z` (34–35); worked `Q·K_animal` (38–39).
- **BEATS** 43–61: 8 beats, 38.6 s, last "Why it matters".
- **GEOMETRY** 63–78: 1000×464; columns at 86 + 92·i; bar scale 148/MAXW; lower third at y 302.
- **BUILD** 114–210: layers connectors → bars → column extras → tokens → lower third. Connectors are cubic arcs whose dip grows with distance (137–146). Bars, key pills and numbers (148–174); token chips (176–191); five lower-third scene groups (198–209).
- **RENDER** 305–398: pure in `t`. Token stagger (311); bar growth by `ease.glaser` over 1.2 s (334); numbers morph score→percent via `lerp` (342–359); `seg` hand-offs for the five scenes (373–377).
- **Audit / hooks / export:** `__AUDIT` 404–411; `__REGIONS` 415; `__LAYOUT` 417; export 419–433.

Techniques: derive every figure in code; one focal motion per beat; `seg` not `pulse`; transitions ≤1.2 s; numbers morph in place; wrapped text via `foreignObject` (295–300).

Gaps:
- Derived figures are literals: `"= 2.70"` (247), `"÷ √dₖ = 2.70 / 2 = 1.35"` (249), `"1.35"` (344). `__AUDIT` (409) checks the dot product but not that `SCALED[1] = dot/√dₖ`.
- Dead code: `focusPulse` (318); unused imports.
- `render` reads its own prior style (363). It is safe only because 339 writes first.
- Overlap and region gates cover only the five detail scenes (415, 417). The anchor and working zone are unchecked. No `ex.fit` use (oauth, tcp and binary-search use it).
- `_episode-template.js`: line 41 and 97 recommend `ex.pulse` (SKILL forbids it); line 121 says tag ≤58 (gate says ≤38); the `__AUDIT` stub (109–112) always returns `ok:true`.

## 4. archive/notes/REQUIREMENTS.md constraints a p5 film tier would hit

- **Palette (L26, L30).** Locked cream/vermillion/ink, but the engine ships dark (§1). Already unenforced; a film tier should bind colors through the same tokens. Negotiable only by an owner decision.
- **Animation ≤1.2 s per transition (L28).** Episodes comply. `LONGFORM.md:36` has 12–16 s counter sweeps, so the sister format already breaks it. A p5 tier with continuous generative motion violates it unless "transition" is defined as a state change. Negotiable by definition.
- **Single-file ≤80 KB, hard max 110 KB (L30).** Built self-attention 77 KB; `feature-cut-v2.html` 47 KB. Inlined p5 alone is ~990 KB (CONTEXT notes), and the Atelier films are ~1.4 MB. That is 10–15× over. Negotiable only by scoping the cap to notebooks and writing a film-tier cap.
- **SKILL.md:36 "no external JS", "works offline".** p5 must be inlined.
- **Canvas 1000×464 (SKILL.md:88)** versus LONGFORM's 960×540. Pick one. Negotiable.
- **Pure `render(t)` (SKILL.md:79).** p5's draw loop reads `frameCount`/`millis`. A film tier must drive p5 from the engine's `t` (`noLoop` plus `redraw(t)`) or paused ≠ playing.
- **Mobile (L29).** Fixed-size p5 canvases need rescaling.
- **Length.** REQUIREMENTS commits to a 2-minute film; SKILL and the gate specify 35–45 s episodes.

## 5. Sheaf, noether and operadic-interview

- **noether-harness** (168 lines): generates conservation-constrained coding-agent harnesses via a μ→λ meta-prompt chain, run as a propose→tailor→commit→reflect loop with zero weight updates. Its asset is absent. Belongs in an agent-harness repo.
- **sheaf-*** (kernel, localize, preserve, glue, repair, harness): a capability-sheaf family for agent-harness repair. Exact CSP Φ decides; H¹ is diagnostic. In this repo it appears only as prose gates in `COURSE-E0.md` and `EXPERIMENT-E0.md`. Nothing executes Φ. Move.
- **operadic-interview** (114 lines): N-level typed question-tree interview instrument with `scripts/treelint.py`. The eval lane uses it for rubric elicitation (HANDOFF-JEV-EVAL §4.1, §8.8). Belongs in an interview repo; keep a pointer.

None is imported by `assets/`, `reference/` or `eval/`.

## 6. Eval lane: `eval/frame-items.mjs` (50 lines)

- Beats come from a regex over the module source (21–29), not the engine's computed beats. A layout change can misparse silently.
- Sampling: one frame per beat midpoint, `t = start + (k+0.5)·dur/perBeat` (39). Default 1 gives 8 items; 3 gives 24.
- Each frame spawns `assets/snapshot.mjs` (40), which prunes faded nodes. Item text is every `<text>` string (32–33), including `foreignObject` text (checked: beat 8's panel text is present).
- Output `{id, state:{t, beatIndex, beatLabel, caption, visibleText}}` (42–46). Self-attention yields t = 1.8 … 35.7 (8 beat midpoints).
- Policy (`eval/README.md`, HANDOFF-JEV-EVAL §2.1): overlap, region, type size and palette go to code (the gate). Literal and semantic questions go to Jev. Aesthetics go to neither. Jev reads text only.
- Not in repo: `JEV-works` (`kit/run.ts`) and the 30 CCAF source modules (HANDOFF-JEV-EVAL §9.3).

## 7. ceti-brand contract (`archive/skills/ceti-brand/SKILL.md`, 61 lines; archived 2026-10-10)

- Source of truth (tokens, principles, brand book) lives in `milton/` and `noether-course/`, neither in this repo.
- Non-negotiables: warm grounds only; frozen token names; per-mode type stacks; original SVG marks, no emoji icons; AA; reduced motion; keyboard; zero hype.
- Checklist: no pure `#fff`/`#000`; no purple-pink gradients; display face on titles; mono eyebrows; documented dark mode.
- Conflict: "warm grounds only" versus the dark-first CETI preset. `ceti-tokens.css:1–20` describes another system (cetiai.co navy/copper). Fonts match the engine.

## What must survive into the master plugin

- Engine contract: `window.EXPLAINER` `{meta, beats[8], build, render, setMath}`; pure `render(t)`; build-once; one clock; the `ex` toolkit.
- Gate: static contract; §15b region check; §15d layout check; `__AUDIT`. Extend to cover the working zone, `ex.fit` use and the viewBox.
- Build pipeline (`build.py`, shell, tokens); `self-attention.js` as the bar; derive-in-code.
- `frame-items.mjs` and `snapshot.mjs`.
- Token-role-only diagrams, no raw hex; the three-font type system.
- REQUIREMENTS honesty rules.

## What should be retired or moved

- **Retire:** root `HANDOFF.md:29`'s "assets absent" claim; `_episode-template.js` pulse comment, tag ≤58 and always-OK `__AUDIT` stub; `ceti-motion.css` IntersectionObserver comment; `focusPulse`; "works offline" unless fonts are vendored; RUN.md "next to the module".
- **Move out:** `noether-harness`, `sheaf-*`, `operadic-interview`, the `/sheaf-run` command, the occupancy language in `COURSE-E0.md` and `EXPERIMENT-E0.md`, and the `SKILLS.md` `~/.grok` mirror. These belong in the harness/meta repo.
- **Resolve:** the palette (cream versus dark) and make the engine default match the decision. `LONGFORM.md` cites a missing directory and is not gate-compatible; gate it or move it to the film tier. `ceti-brand`'s dangling `milton/` and `noether-course/` references. Two HANDOFF files with drifting claims. `notebooks/` is a separate lookbook surface, sized but not audited.
