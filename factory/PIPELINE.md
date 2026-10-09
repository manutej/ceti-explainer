# The production pipeline · draft, select, fix, gate, ship

Roles: Sonnet drafts and fixes; Opus selects and evaluates frame by frame; Fable directs and ships; the orchestrator
commits. One brief per film; one contract per module; the laws never move (CLAUDE.md).

## Stages and commands

1. BRIEF: factory/topics/<id>/{brief.md, claims.json, beats.md} (new_topic.py or repo_topic.py). The beat sheet names
   the chain of arsenal modules and the brand, chrome, material, level, renderer and format.
2. DRAFT ×3 (Sonnet, parallel): factory/films/<id>/drafts/<a|b|c>/{film.json, film.js, claims.json, lib/, NOTES.md}.
   Same brief, same claims, different look and motion. Every number that an evaluator may tune is a KNOB:
   film.json.knobs = { name: value } with a `knobs_doc` table (name, range, what it moves); film.js reads
   `K = window.FILM.knobs` with defaults and never hard-codes a tunable. Captions live only in film.json.
   Build: `python3 factory/kit2/build.py <draft-dir> --brand <id> --chrome <id>`; gate; frame strip:
   `node factory/tools/frames.mjs <page> --every 0.5 --out <draft-dir>/frames` (contact strips with timestamps).
3. SELECT (Opus, blind): reads the three frame strips, captions and claims; never film.js. Writes
   factory/films/<id>/SELECT.md (ranking with reasons) and copies the winner to factory/films/<id>/ as the working
   film. Then FINDINGS round 1: factory/films/<id>/findings.r1.json
   [{t, frame, what, severity, knob | caption_index, proposed_value, why}] — only knobs and captions.
4. FIX (Sonnet): `python3 factory/tools/apply_findings.py factory/films/<id> findings.r1.json` applies the knob and
   caption edits (film.json only), rebuilds, gates, re-strips. Opus writes findings.r2.json; Sonnet applies. Stop
   after round 2 whatever remains; remaining findings go to NOTES.md.
5. SHIP: gate PASS, catalogue.py, baselines, seat.json from a blind Fable seat, artifact publish, commit sources and
   the built page.

## What the evaluator may and may not do
May: change any knob within its documented range; rewrite a caption (≤ 60 chars, no new digits that are not
claims); shift a chapter boundary by ≤ 2 s; change the brand pack or chrome. May not: edit film.js, claims.json,
the beat order, or any number on screen.

## Scale rules
A film is 3 drafts + 2 fix rounds, no more. Parallelism: drafts of different films run at once; selection is one Opus
call per film. Record per film: wall time, tokens, findings per round, gate rows, s/frame, bytes, verdict.
