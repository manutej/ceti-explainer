---
name: atelier-select
description: "Evaluate factory film drafts BLIND from their frame strips, captions, claims and gate reports (never the code): rank N drafts of one brief, write SELECT.md, promote the winner, and write findings.r<N>.json that factory/tools/apply_findings.py can apply (knobs within range, captions ≤ 60 chars with no new digits, chapter shifts ≤ 2 s, brand or chrome). Use this for 'pick the best draft', 'evaluate these drafts', 'frame-by-frame review', 'write findings', 'round 2 findings', 'seat this film', 'does the picture carry the claim', or as the SELECT and FINDINGS stages of atelier-pipeline. Not for building (atelier-draft) or for applying the findings (the pipeline runs the tool)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`: evaluator ≠ builder. You read pictures and text; you never
> open film.js, lib/ or NOTES.md of a draft, and you never run a browser. No git from this skill.

# atelier-select · N drafts → ranking, winner, findings

The category: **judging whether a silent film makes its claim visible, from evidence an executive would also see
(frames at thumb size and captions), and turning every objection into an edit the tool can apply without a
programmer.** Instances differ in subject and chain; the rubric and the findings grammar do not.

## Typed slots

```
Drafts:      list[{id, frames/strip-*.png, frames/thumbs/, frames/frames.json, film.json, claims.json, gate.json}]
Brief:       factory/topics/<id>/{brief.md, beats.md}                  // the belief, the gap, the count, the chain
Laws:        CLAUDE.md + factory/FORMAT.md                             // counts first, commit first, every digit a claim …
Rubric:      references/frame-rubric.md                                // per-beat checklist, craft checks, defect vocabulary
Observation: {t: s, frame: path, what: str, law|craft: str}            // every judgement cites a timestamp and a frame
Ranking:     list[{draft, rank, verdict: str, reasons: list[Observation]}]
Winner:      DraftId  (copied to factory/films/<id>/ as the working film: film.json, film.js, claims.json, lib/, build/, gate.json)
Findings:    findings.r<N>.json [{t, frame, what, severity: block|major|minor, target, proposed_value, why}]
BeyondScope: list[Observation]                                         // needs film.js; goes to SELECT.md, never to findings
```

## Procedure

1. **Read the brief first**, then the strips of each draft in time order. Before judging craft, answer the one
   question per draft: *can a viewer get the gap from the pictures alone, with the captions covered?* Write that
   answer with the timestamp where it becomes true, or "never".
2. **Run the per-beat checklist** (`references/frame-rubric.md` §a) and the law checks (§b) on each draft; a law
   failure outranks any craft merit.
3. **Then craft** (§c): hierarchy, hold length versus reading time, occlusion of the evidence, captions over marks,
   the reveal as a moment not a wash, label legibility at 480×270.
4. **Rank**: picture-carries-the-claim first, laws second, craft third; ties go to the cheaper film (s/frame,
   bytes). Write SELECT.md: ranking with reasons tied to strips and timestamps, a one-line verdict per draft, the
   winner, and which beat of a loser is worth borrowing as a knob or caption change.
5. **Promote the winner** (cp -r, no edits): film.json (set `id` to the film id, record `look`), film.js, claims.json,
   lib/, build/, gate.json.
6. **Write findings** with `references/findings-schema.md`: 5–12 per round, ordered by severity, every one a knob
   inside its documented range, a caption, a chapter shift ≤ 2 s, or a brand/chrome id. Validate:
   `python3 factory/tools/apply_findings.py factory/films/<id> findings.r<N>.json --dry-run` until all accept.
   What cannot be expressed that way goes to SELECT.md "Beyond scope".
7. **Round 2** (after the pipeline applied round 1): re-read the new strips; for each round-1 finding say worked,
   backfired, or did little, with the frame; write findings.r2.json for what remains; append "Round 2" to
   SELECT.md. Round 2 is the last: what remains after it goes to NOTES.md by the pipeline.

## Rules that bind the slots

- Every reason is an Observation with t and a frame path; a judgement without a frame is not evidence.
- Findings never change a number on screen, a claim, the beat order, or film.js.
- A caption finding keeps the digits of the claims it carries and stays ≤ 60 characters.
- Severity: block = a law broken or the gap invisible; major = the gap is harder to see than it should be;
  minor = craft.
- Blindness: film.js, lib/ and the drafters' NOTES.md stay unread; say so in SELECT.md's header.

## Output contract

```
factory/films/<id>/SELECT.md           ranking, verdicts, winner, borrowings, Beyond scope, Round 2 section later
factory/films/<id>/findings.r1.json    validated by --dry-run; findings.r2.json after round 1 is applied
factory/films/<id>/{film.json, film.js, claims.json, lib/, build/, gate.json}   the promoted winner, unedited
```
Hand back ≤ 150 words: winner, the two-line why, findings per severity, and the beyond-scope list.

## References (read on demand)

- `references/frame-rubric.md` — per-beat checklist, law checks from frames, craft checks, defect vocabulary, how to rank.
- `references/findings-schema.md` — the JSON apply_findings.py accepts, constraints, dry run, stop rules.
- `factory/films/simpsons-3d/SELECT.md` — a filled SELECT.md to pattern-match shape, not content.

## Documentation and artifacts

The family index `skills/ATELIER.md` §Index names where p5.js 2.x documentation (the atlas under `references/atlas/`,
mapped by `skills/atelier-draft/references/p5-index.md`), the arsenal cards, the kit contract and every published
artifact live. Cite the atlas page when you write a card; publish what you ship and record it in `factory/ARTIFACTS.md`.
