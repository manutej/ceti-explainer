# Archive moves · running list (2026-10-10)

Executes docs/ARCHITECTURE-AUDIT.md §5 row by row. The moves were made with plain `mv`, not `git mv`, because CLAUDE.md
says "Never run git from a subagent". Git records history the same way: stage each row with
`git add -A -- <every path listed in the row>` and the commit shows them as renames (`git log --follow` keeps working).
One commit per row. Paths are relative to the repo root.

## Row 1 · p5 studio skills → archive/skills/

Moves:
- skills/p5-concept → archive/skills/p5-concept
- skills/p5-forge → archive/skills/p5-forge
- skills/p5-ship → archive/skills/p5-ship
- skills/p5-studio → archive/skills/p5-studio
- skills/p5-crit → archive/skills/p5-crit

Link fixes: references/eval-stack.md, references/INDEX.md, README.md, skills/p5-explainer/SKILL.md (description)

Commit note: the plugin's skill list shrinks by five (p5-concept, p5-forge, p5-ship, p5-studio, p5-crit); skills are
discovered in skills/, so they stop loading.

## Row 2 · skills/ceti-brand → archive/skills/ceti-brand

Moves:
- skills/ceti-brand → archive/skills/ceti-brand

Link fixes: README.md (repo layout and Layout skill list), contrib/SKILLS.md (moves again in row 5),
docs/study/readers/R9-current-repo.md

Commit note: one more skill leaves the plugin's skill list (ceti-brand).

## Row 3 · chromes/delta, ledger, exposure, margin → archive/chromes/

Moves:
- chromes/delta → archive/chromes/delta
- chromes/ledger → archive/chromes/ledger
- chromes/exposure → archive/chromes/exposure
- chromes/margin → archive/chromes/margin

Canonical delta kernel: library/materials/kernels/delta.kit.js (the live copy; sediment.js runs it). The archived
chrome copy is a later revision (PathRiver, 385 vs 316 lines) used only by the archived delta films. The run and
marbling drift stays live under Q11.

Link fixes (text only): library/operad/operad.json (`source` strings), library/materials/{plate,isotype,pen,sediment}.js
(header comments and `source` strings), library/operad/README.md, references/atelier/crit/PACKET.md, README.md (chrome
list), HANDOFF.md, MERGE-NOTES.md (moves in row 8)

## Row 5 · contrib/ → archive/contrib/

(Row 4, factory/films/{simpsons-3d,goodhart}/drafts, is left to the orchestrator after the film wave.)

Moves:
- contrib → archive/contrib

Link fixes: README.md (COURSE-E0, EXPERIMENT-E0, repo layout), HANDOFF.md, RUN.md (relocated in row 11),
skills/ceti-explainer/SKILL.md, HANDOFF-JEV-EVAL.md (moves in row 6), MERGE-NOTES.md (moves in row 8)

Decision: docs/DECISIONS.md gains the dated section "2026-10-10 · dead and referenced-only layers move to archive/" with
row D12 (D4 names contrib/; D4 itself is not edited, per the DECISIONS rule). Commit it with this row.

## Row 6 · eval/, HANDOFF-JEV-EVAL.md → archive/eval/

Moves:
- eval → archive/eval (README.md, frame-items.mjs)
- HANDOFF-JEV-EVAL.md → archive/eval/HANDOFF-JEV-EVAL.md

Link fixes: README.md (Layout), RUN.md (relocated in row 11), archive/contrib/SKILLS.md, archive/eval/README.md and
archive/eval/HANDOFF-JEV-EVAL.md (now siblings)

## Row 7 · notebooks/ → archive/notebooks/

Moves:
- notebooks → archive/notebooks (e0-occupancy.html, episode-01.html, hierarchical.html)

.gitignore: `!notebooks/*.html` and `!notebooks/**/*.html` replaced by `!archive/notebooks/**/*.html` (stage .gitignore
with this row or the pages turn untracked); `!archive/**/build/*.html` added after `!**/build/*.html`, ready for row 4.

Link fixes: README.md (repo layout, Layout, the built-pages line). ART-DIRECTION v0/v1 mention lab notebooks in prose
only, no path to fix.

## Row 8 · MERGE-NOTES.md, REQUIREMENTS.md → archive/notes/

Moves:
- MERGE-NOTES.md → archive/notes/MERGE-NOTES.md
- REQUIREMENTS.md → archive/notes/REQUIREMENTS.md

Link fixes: tests/proofs.sh (line 2 comment), HANDOFF.md, README.md, docs/DECISIONS.md (header line, D3 and the
roadmap line: path only, the decisions are unchanged), docs/study/readers/R9-current-repo.md,
archive/contrib/SKILLS.md, archive/eval/HANDOFF-JEV-EVAL.md

## Row 9 · scripts/channels → archive/scripts/channels

Moves:
- scripts/channels → archive/scripts/channels (channels.py, compose.py, scenes.py, qa.py, timeline.mjs, README.md)

Link fixes: scripts/requirements.txt (comment), README.md (Layout), library/plan/README.md. Q8's "channels gate (G7)"
has no live implementation while this is archived (noted in archive/README.md and D12). library/plan/CHANNELS.md
`channels/<id>.json` names the compiler's adapter files, not this folder; left as is. The code resolves the plan
library relative to scripts/, so it runs only after a restore.

## Row 10 · films/typesafe → archive/films/typesafe

Moves:
- films/typesafe → archive/films/typesafe

Link fixes: library/plan/modules/{commit-predict-reveal,contrast-split,mass-reseat,recap-retrieve}/demo.json (`sources`
citations: label and `../../../archive/films/typesafe/STORYBOARD.md`; tests do not open them),
library/plan/modules/mass-reseat/README.md, library/plan/QUESTION-TREE.md, library/plan/BUILD-SPEC.md,
references/atelier/BRIEF.md, skills/p5-explainer/SKILL.md, README.md (Layout)

Not edited, on purpose: the provenance comments in library/plan/core/po/track.js, library/plan/modules/mass-reseat/module.js
and skills/p5-explainer/assets/scene-kit.js ("Generalised from films/typesafe …"). Those files are inlined into built
pages (films/base-rate/build/base-rate.p5.html carries the comment verbatim), so editing them changes committed page
bytes (D10).

## Row 11 · RUN.md → skills/ceti-explainer/RUN.md (relocated, not archived)

Moves:
- RUN.md → skills/ceti-explainer/RUN.md

Link fixes: README.md (cold-start link and repo layout), skills/ceti-explainer/assets/build.py (comment only),
archive/eval/HANDOFF-JEV-EVAL.md

## After the rows

- archive/README.md (the index: class, evidence, date, restore) is new; commit it with row 1 or as its own commit.
- docs/ARCHITECTURE-AUDIT.md: an "Executed 2026-10-10" note under §5; its tables keep the pre-move paths as the record.
