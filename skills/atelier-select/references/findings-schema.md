# findings.rN.json: the exact contract of factory/tools/apply_findings.py

The evaluator's only levers are film.json knobs, caption texts, chapter start times, and the brand / chrome ids.
film.js, claims.json, beat order and any number on screen are out of scope: a finding that names them is rejected.

## File
`factory/films/<id>/findings.r1.json`, `findings.r2.json`: a JSON array of findings, or `{"findings": [ ... ]}`.
Each finding is an object with these fields:
| field | rule |
|---|---|
| t | film seconds of the observation (for the report; not validated) |
| frame | where you saw it, e.g. `strip-10.png cell 1 (thumbs/t-0054.50.jpg)` (not validated) |
| what | the observation, one or two sentences |
| severity | `block` / `major` / `minor` (not validated; keep to these) |
| why | the reason this value fixes it |
| ONE target | exactly one of `knob`, `caption_index`, `chapter_index`, `chapter`, `brand`, `chrome` |
| proposed_value | required; type depends on the target |
Zero targets, two targets, or a missing proposed_value is rejected.

## Targets and constraints
| target | value of the target key | proposed_value | rejected when |
|---|---|---|---|
| `knob` | a name in film.json `knobs_doc` | a number inside `range [lo, hi]` (booleans refused), or one of `options` | name not in knobs_doc; out of range; not an option. `step` is advisory, not enforced |
| `caption_index` | integer 0..n-1 into film.json `captions` | the new caption text (string) | not an existing index; empty; > 60 characters after whitespace is collapsed; introduces a number (below). Timing is unchanged |
| `chapter_index` or `chapter` | integer index, or the chapter `id` | the chapter's new `t0` in seconds | id or index missing; moved more than 2.0 s; not strictly between the neighbours' `t0` (the last chapter is bounded by `dur`); first chapter moved |
| `brand` | `true` | a pack id that exists as `arsenal/brands/<id>.json`, or `film` | no such file. Derived twins (`arsenal/brands/derived/`) and film-local packs are NOT accepted by id here |
| `chrome` | `true` | `none`, or an id in `factory/kit2/chromes/` or `factory/chromes/` (`<id>.js`) | no such chrome |
Notes:
- Caption digits: every number in the new text (clock times such as 0:51 are ignored; text inside a claim's `render` /
  `renders` strings is removed first) must equal a claim `value` at its printed precision (also value x 100, value / 1e3,
  value / 1e6), or already be present in that caption's old text. A year is not exempt here, unlike the gate's G5b: keep
  it only if it was already in the caption. Counts-first rewording is the common legal move: use claim counts, not ratios.
- Chapter shift: when the previous chapter's `t1` equalled the old `t0`, it follows the new value.
- Conflict: a second finding on the same target in one file is rejected (`knob:<name>`, `caption:<i>`, `chapter:<i>`,
  `look:brand`, `look:chrome`). Put both wishes into one value, or defer one to the next round.
- `brand` / `chrome` are recorded in film.json `look` {brand, chrome, material}; the film is rebuilt with them.

## Commands (repo root)
    python3 factory/tools/apply_findings.py factory/films/<id> findings.r1.json --dry-run     # validate, write report only
    python3 factory/tools/apply_findings.py factory/films/<id> findings.r1.json               # apply, rebuild, gate, strips
Options: `--every 0.5` (strip spacing), `--no-frames` (skip the strips). The findings path may be absolute, relative to
the cwd, or relative to the film dir. A real run applies every valid finding even if others are rejected, so always dry-run
first, repair the rejects (edit the value, or move the idea to the NOTES list), dry-run again, then apply.
Exit codes: 0 applied and gate not FAIL; 1 build failed or the gate FAILs after applying; 2 usage error.
After a real run, film.json holds the new values; `build/`, `gate.json` and `frames/` are regenerated (the next round
reads the new strips).

## Report: `findings.rN.report.json` (written beside the findings, also on dry run)
    { "film": id, "findings": path, "dry_run": bool, "look": {brand, chrome, material},
      "applied":  [ { "n": index, "target": "knob:<name>" | "caption:<i>" | "chapter:<i>" | "look:brand" | "look:chrome",
                      "old": ..., "new": ..., "finding": {...} } ],
      "rejected": [ { "n": index, "reason": "...", "finding": {...} } ],
      "build": {ok, page, log}, "gate": {pass, verdict, json}, "frames": {ok, log} }   // not present on dry run
Console: `findings <file>: N applied, M rejected`, then `APPLIED #n target: old -> new` / `REJECTED #n reason` lines.
Quote counts in SELECT.md as "N findings: a block, b major, c minor; dry run accepted k".

## Six well-formed abstract findings
    [
     {"t": 31.0, "frame": "strip-06.png cell 2 (thumbs/t-0031.00.jpg)", "severity": "major",
      "what": "<stale label> still over the new evidence for 1.5 s after the change lands.",
      "why": "Advance the label the moment the change lands so it never contradicts the picture.",
      "knob": "<labelStepKnob>", "proposed_value": 45.5},
     {"t": 20.0, "frame": "strip-04.png cells 6-9", "severity": "minor",
      "what": "<ring> crosses the caption band in every thumb 18-41 s.",
      "why": "A smaller overview zoom clears the band; the next round checks the close view does not shrink.",
      "knob": "<cameraKnob>", "proposed_value": 0.60},
     {"t": 12.0, "frame": "strip-03.png cell 4", "severity": "minor",
      "what": "<style option> reads as clutter at thumb size.",
      "why": "Option knobs take one of their listed values.",
      "knob": "<optionKnob>", "proposed_value": "<one of knobs_doc options>"},
     {"t": 59.0, "frame": "strip-10.png cell 10", "severity": "major",
      "what": "Caption 11 gives a ratio 2 s before the counts it rests on appear.",
      "why": "Counts first: the caption now names the counts on screen; every number is a claim value.",
      "caption_index": 11, "proposed_value": "<count A> of <count B> <unit>; <count C> of <count D>."},
     {"t": 62.0, "frame": "strip-11.png cell 0", "severity": "minor",
      "what": "MONDAY begins 1.4 s after the count has settled; the settled picture is held too long.",
      "why": "Moving the chapter start earlier by 1.4 s (within 2 s, after the previous t0) tightens the hold.",
      "chapter": "monday", "proposed_value": 60.6},
     {"t": 5.0, "frame": "strip-01.png cells 6-11", "severity": "minor",
      "what": "Chrome furniture crowds the hook and types on partial words.",
      "why": "The plain chrome leaves the stage to the picture; recorded in film.json look.",
      "chrome": true, "proposed_value": "none"}
    ]
A `brand` finding has the same shape: `"brand": true, "proposed_value": "<pack id in arsenal/brands>"`. Prefer a
`brand` finding only when the brief asked for a look change; a look change is not a craft fix.

## Rounds and stop rules
1. Round 1 (after selection): findings.r1.json, dry run, apply. Aim at majors first; blocks must be fixed or the
   film cannot ship; minors only when they cost nothing. One finding per cause.
2. Round 2 (after reading the regenerated strips): findings.r2.json. Re-check every round-1 change in the picture
   (worked / half / overshot / did nothing) and fix only what is still wrong or newly broken.
3. Stop after round 2 whatever remains. Never a round 3 inside this pipeline.
4. Convergence: round 2 should hold fewer findings than round 1 (for example 11 then 5) and no block. If a round-2
   finding reverses a round-1 value on the same knob, say so: the cause is not that knob (it is film.js or the
   brief); stop adjusting it and park it.
5. A gate FAIL after applying (exit 1) spends the round on the corrective finding (usually undoing the offender).
6. Park, with timestamps, in NOTES.md (or card.md for a catalogue entry): everything beyond scope (film.js
   behaviour, stamps, labels, fade-outs, new marks, new timing logic), rejected findings with their reasons,
   findings left after round 2, cosmetic claims.json text, and the warnings that ship (e.g. G5c WARN counters).
