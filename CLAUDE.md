# ceti-explainer · instructions for Claude sessions

Start with HANDOFF.md (cold start, layers, pipeline) and docs/DECISIONS.md (binding decisions D1–D11, Q1–Q15).
Run `sh scripts/doctor.sh` before building anything; `sh tests/proofs.sh all` before pushing.

Laws (change only with a dated row in docs/DECISIONS.md): one clock, render(t, state) pure, seeds fixed; counts before
ratios; in a film that enables the commit beat (off by default, D11), the viewer commits a number before any number is
shown; every digit on screen is a claim with a formula or a source; silent with captions; one honest-limits line; the
CETI card last; exec level is ink and clean; vendored p5 and fonts only, no runtime fetches, no Google Fonts.

Build films with factory/kit2 (`--brand`, `--chrome`, `--material`), gate with factory/tools/gate.mjs (G1–G10), ship
with factory/tools/catalogue.py; commit the sources and the built page. Brands are token packs under arsenal/brands;
patterns under arsenal/patterns (see arsenal/README.md). The factory skill is skills/explainer-factory/SKILL.md
(one author); at scale the atelier family skills/atelier-{brief,draft,select,pipeline,variant} (index skills/ATELIER.md).

Agents: one brief per wave, one contract per module, one gate run plus at most two fix rounds, ship with the warnings
written in NOTES.md or card.md. Commit per lane as it lands. Never run git from a subagent.
