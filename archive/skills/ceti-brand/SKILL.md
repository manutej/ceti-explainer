---
name: ceti-brand
description: >
  Canonical CETI brand system shared by noether-course, milton, editorial-dashboard,
  client-briefing-dashboard, lattice-ops, acos, and client forks (e.g. Hormel). Use whenever
  building or restyling any CETI dashboard, course shell, briefing, lattice, or when the user
  mentions CETI brand, CETI tokens, unify dashboards, brand alignment, or Milton × CETI.
---

# CETI Brand — Shared Design DNA

One studio. Many surfaces. **Milton Glaser's philosophy is the contract; CETI is the default preset.**

## Source of truth

| Asset | Path |
|-------|------|
| Tokens | `milton/references/tokens.css` |
| Philosophy | `milton/PRINCIPLES.md` |
| Brand values | `milton/BRAND_BOOK.md` |
| Web bar | `milton/WEB.md` |
| Process | `milton/META_PROMPT.md` |
| Modes | `milton/MODES.md` |
| Course lock | `noether-course/assets/style-card.md` + `lesson-shell.html` |

## Surfaces

| Surface skill | `data-mode` / fork |
|---------------|-------------------|
| noether-course | `course` |
| editorial-dashboard | `editorial` |
| client-briefing-dashboard | `briefing` |
| lattice-ops, acos | `lattice` |
| editorial-dashboard-hormel-genai | Hormel green preset (process stays CETI) |

## Non-negotiables

1. Warm grounds only.
2. Token **names** frozen; values only via mode or documented fork.
3. Type stacks per mode (see BRAND_BOOK) — no random fonts.
4. Original SVG marks for concept heroes; no emoji-as-icon.
5. AA contrast; reduced motion; keyboard.
6. Zero hype copy.

## Agent workflow

1. Identify surface → set `data-mode`.
2. Load tokens (canonical or fork).
3. Build structure from the **surface skill** (sections, research, gates).
4. Audit against Milton five rules + surface quality checklist.
5. If multiple surfaces ship together, verify sibling rhythm (spacing, eyebrow mono, actor restraint).

## Unification checklist (run across all dashboards)

- [ ] No pure `#fff` / `#000` grounds
- [ ] No purple-pink AI gradients
- [ ] Display face present on titles
- [ ] Mono eyebrows on sections
- [ ] Shared ease curve language
- [ ] Dark mode or explicit dark-first (lattice) documented
- [ ] Cross-links to `milton` + this skill in SKILL.md
