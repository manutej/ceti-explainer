# Explainer Atelier — client brief (read first; every agent)

> Paths: `$STUDIO` = the ceti-p5-studio plugin root; `$ATELIER` = `$STUDIO/atelier`. The typesafe-docs folder is outside the plugin.

Client: Manu Mulaveesala, CETI.AI (enterprise AI educator: 5,000+ professionals, Fortune 500, 20+ countries;
audiences range from C-suite to non-technical staff to engineers). This is an EXPLORATORY, creative exercise —
think outside the box. "Good but not WOW" has been his verdict on safe work before.

## The problem
Our explainer system (`ceti-explainer` + its p5 tier `p5-explainer`) has ONE look: dark CETI chrome (#0E1014 ground,
Fraunces/DM Sans/Space Mono, copper/sage/peach), SVG-first, 960x540 beats, captions. The client finds it too
restrictive. He wants an **Explainer Atelier**: an emulated art department for EDUCATIONAL animation that can produce
highly differentiated, distinct **chromes** (house grammars: look + motion + mark vocabulary + camera + sound + how it
teaches), each exploiting what p5.js can really do (p5 2.3.4: Canvas2D, WEBGL, shaders/strands, 3D, typography as
geometry via textToPoints/textToContours, physics/simulation, noise fields, pixel manipulation, sound), for:
business/exec audiences, non-technical AI literacy, technical AI, and other explanatory content.

Plus a **levels-of-understanding ladder** built into every chrome:
Glance (~30 s, intuition) → Grasp (~2 min, mechanism) → Wield (try-it: the viewer acts) → Master (explorable).

## Fixed decisions (client chose)
- **Keep the clock, free the look.** One deterministic clock: every frame is a pure function of `(t, state, seed)`;
  paused == playing; the live page and the MP4 are the same film. Everything visual is open (WEBGL, shaders, 3D,
  physics *if deterministic* — precompute or fixed-step from t=0 with memo — sound-reactive via the score's own timeline).
- First slate includes **Boardroom** (business/execs), **Field Notebook** (non-technical; paper, wobbly ink,
  predict-commit-reveal), **Living Systems** (generative/organic emergence), **Little Worlds** (general public;
  illustrated dioramas, metaphor characters) — **plus new ones we haven't thought of that are stunning, beautiful,
  unique.**
- Proof = **both**: (1) ONE shared concept rendered in every chrome so differences are obvious side by side, and
  (2) one **native** concept per chrome (the topic that chrome is best at).
- Shared concept: **"What an AI agent actually does"** — a goal; the loop plan → act (call a tool) → observe →
  check → repeat or stop; why per-step reliability compounds (0.95^k: 10 steps ≈ 60 %, 20 steps ≈ 36 %); why
  checks/verification and a human at the right gate change the outcome. Numbers must be computed, not invented;
  anything illustrative is labelled "sketch".
- Model routing: Fable 5.1 for art direction, design, crit (short, single-pass); Opus for building. The main
  session coordinates.

## Constraints of this machine
2 CPUs, 7 GB RAM, headless Chromium with SwiftShader (WEBGL works but slow: plan ≤720p for WEBGL renders; Canvas2D
~0.5–1 s per 1080p frame per core). No GPU. Network: npm/pip/GitHub only (no CDN fetches from the shell);
p5 2.3.4 is at `$STUDIO/vendor/p5-2.3.4.min.js`. Published pages load p5 from
`https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js`. Fonts: embed as base64 (npm @fontsource packages work).
IP: no known characters, logos, or imitations of a specific studio's signature work; channel *principles* are fine.

## Existing material (read only what your task needs)
- Plugin: `$STUDIO/` — README.md, references/doctrine.md, references/studio-habits.md
  (house habits to AVOID: cream paper + hairline ink + one vermilion; CETI-dark as the only dark; framed object on an
  empty page), references/anti-patterns.md, references/tells.md, references/technique-atlas.md, references/p5/*.md
  (p5 2.x contract, webgl-strands, performance, sound, export).
- p5-explainer skill: `ceti-p5-studio/skills/p5-explainer/SKILL.md`, assets/feature-engine.js (long-form player,
  window.FEATURE module), assets/bridge.js (P5Film.layer), films/typesafe/ (worked example).
- Prior art direction for "Type-safe AI": `/home/claude/p5studio/typesafe-docs/typesafe/` (ART-DIRECTION.md,
  CRIT-ART.md, CRIT-PEDAGOGY.md, research/BRIEF.md with the 0.95^k reliability arithmetic and sources).

## Output root
`$ATELIER/` — docs at top level; one folder per chrome under `chromes/<id>/`.
