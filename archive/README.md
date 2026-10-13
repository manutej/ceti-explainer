# archive/

These layers were moved here on 2026-10-10, per option (e) of docs/ARCHITECTURE-AUDIT.md (§2 has the evidence, §5 the
plan) and decision D12 in docs/DECISIONS.md. Proofs i–vii (tests/proofs.sh) and scripts/doctor.sh never open anything
here. Nothing was deleted, and the history is kept: `git log --follow <archived path>` shows it. archive/MOVES.md lists
the exact paths for each row.

Classes (audit §2): **DEAD** means nothing points at it, or it cannot run in this repo. **REFERENCED-ONLY** means
documents or metadata point at it, but nothing builds or tests it.

**To restore** an entry, run `git mv archive/<path> <original path>` from the repo root and revert the link fixes that
row lists in MOVES.md (`git show <row commit> -- ':!archive'` shows them). Then run `sh scripts/doctor.sh` and
`sh tests/proofs.sh all`. Code that resolves paths relative to its own folder (the chromes' make.sh, scripts/channels,
films/typesafe) runs only from its original path.

| archived path | original path | class | evidence (audit §2) | date | restore |
|---|---|---|---|---|---|
| archive/skills/p5-concept, p5-forge, p5-ship, p5-studio | skills/p5-concept, skills/p5-forge, skills/p5-ship, skills/p5-studio | DEAD | Nothing points at them. They call `$STUDIO/scripts/{series,lint,render,ship,gate,seat_packets}.py`, which do not exist in this plugin (they live in p5js-explainer-lab). | 2026-10-10 | `git mv archive/skills/<name> skills/<name>`. The skill rejoins the plugin's list, but it stays broken until the scripts exist. |
| archive/skills/p5-crit | skills/p5-crit | DEAD | One reference (references/eval-stack.md, which now points here). Same missing scripts, plus crit/TRIAGE.md and studio/LEDGER.md. | 2026-10-10 | `git mv archive/skills/p5-crit skills/p5-crit`; point references/eval-stack.md back at it. |
| archive/skills/ceti-brand | skills/ceti-brand | REFERENCED-ONLY, broken | Only README and contrib/SKILLS.md point at it. It has 6 dangling paths (milton/*.md, noether-course/…). Brands now live in arsenal/brands. | 2026-10-10 | `git mv archive/skills/ceti-brand skills/ceti-brand`; fix README. |
| archive/chromes/delta, ledger, exposure, margin | chromes/delta, chromes/ledger, chromes/exposure, chromes/margin | REFERENCED-ONLY | Q11: their kernels live in library/materials and do not ship films; "Delta and Margin stay as references". Only operad.json `source` strings point at them, and check.mjs never opens those. The canonical delta kernel is library/materials/kernels/delta.kit.js (the live one). The archived chrome copy is a later PathRiver revision that only its own films use. | 2026-10-10 | `git mv archive/chromes/<id> chromes/<id>`. make.sh assumes chromes/<id>/; operad.json `source` strings and library/materials/*.js headers go back to chromes/<id>. |
| archive/drafts/simpsons-3d, archive/drafts/goodhart | factory/films/simpsons-3d/drafts, factory/films/goodhart/drafts | REFERENCED-ONLY | Cited by PIPELINE.md and PROTOTYPE.md. Proof vi walks only factory/films/*/. 49 files ≈ 5.7 MB; drafts/c/film.js is byte-identical to the shipped film.js. **Pending: the orchestrator moves this row after the current film wave.** .gitignore already has `!archive/**/build/*.html`. | (pending) | `git mv archive/drafts/<film> factory/films/<film>/drafts` |
| archive/contrib | contrib | REFERENCED-ONLY | D4: the noether harness and the sheaf family "are not shipped"; README links COURSE-E0 and EXPERIMENT-E0. D12 records the move: D4 stands, and only the location changes. | 2026-10-10 | `git mv archive/contrib contrib`; README, HANDOFF.md, skills/ceti-explainer/SKILL.md and RUN.md links go back; add a DECISIONS row that reverses D12's location clause. |
| archive/eval (README.md, frame-items.mjs, HANDOFF-JEV-EVAL.md) | eval/, HANDOFF-JEV-EVAL.md | REFERENCED-ONLY | README, RUN.md and contrib/SKILLS.md point at it; nothing runs frame-items.mjs. | 2026-10-10 | `git mv archive/eval eval`, then `git mv eval/HANDOFF-JEV-EVAL.md HANDOFF-JEV-EVAL.md`. eval/README.md's link goes back to `../HANDOFF-JEV-EVAL.md`. |
| archive/notebooks | notebooks | REFERENCED-ONLY | Only README and ART-DIRECTION mention it. The three pages are hand-authored HTML and stay tracked through `.gitignore` `!archive/notebooks/**/*.html`. | 2026-10-10 | `git mv archive/notebooks notebooks`; .gitignore back to `!notebooks/*.html` and `!notebooks/**/*.html`. |
| archive/notes/MERGE-NOTES.md, archive/notes/REQUIREMENTS.md | MERGE-NOTES.md, REQUIREMENTS.md | REFERENCED-ONLY | Cited by the proofs.sh header comment, HANDOFF, README and DECISIONS D3. D3's single 110 KB rule was superseded by the tier table and kit2's 1.3 MB / 120 KB budget. | 2026-10-10 | `git mv archive/notes/<file> <file>`; point tests/proofs.sh line 2, HANDOFF, README and DECISIONS back at it. |
| archive/scripts/channels | scripts/channels | REFERENCED-ONLY | MERGE-NOTES and scripts/requirements.txt name it; nothing runs it. **Q8 names a channels gate (G7: "the brand line counts once in the channels gate"). That gate has no live implementation while this is archived. Restore it before any channel output (reel, carousel, PDF, video, blog, newsletter) ships.** | 2026-10-10 | `git mv archive/scripts/channels scripts/channels`. It resolves library/plan relative to scripts/. Put back the scripts/requirements.txt comment and the library/plan/README.md command. |
| archive/films/typesafe | films/typesafe | REFERENCED-ONLY | 3 library/plan demo.json `sources` cite it (citations only; tests do not open them). It has no build script. Provenance comments in po/track.js, mass-reseat/module.js and p5-explainer/assets/scene-kit.js still name films/typesafe. They are inlined into built pages, so they were left as they are (D10). | 2026-10-10 | `git mv archive/films/typesafe films/typesafe`; put back the `../../../films/typesafe/STORYBOARD.md` citations. |

Relocated, not archived: RUN.md documents skills/ceti-explainer, so it moved to skills/ceti-explainer/RUN.md (README links
there).
