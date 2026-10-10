# Agent brief templates (fill the ⟨slots⟩; never add a solved example)

Each brief is one message. Keep "no git", the target directory and the hand-back limit in every one.

## Drafter (Sonnet, one per draft, spawned together)

```
You are DRAFTER ⟨x⟩ for ⟨film id⟩. ⟨N⟩ drafters work in parallel from the same brief; yours is distinct:
your register is "⟨register: one line of look and motion⟩".
Use the skill at skills/atelier-draft/SKILL.md (read it and its references as it directs).
Brief: factory/topics/⟨id⟩/{brief.md, claims.json, beats.md}. Target: factory/films/⟨id⟩/drafts/⟨x⟩/.
Look: brand ⟨pack⟩, chrome ⟨chrome⟩, level ⟨level⟩, renderer ⟨2d|webgl⟩, format ⟨case|feature⟩. Chain: ⟨modules⟩.
Build, gate, strip, look at your stills once, at most one fix round. No git.
Hand back ≤ 150 words: gate verdict and WARN rows, s/frame, bytes, knob count, what you patched, what you left.
```

Registers that have produced distinct drafts (pick N that differ in viewpoint and in what moves):
the architectural model (calm orbit, city of marks) · the exhibit (dark room, side light, dolly) · the instrument
(isometric readout, turntable, pinned labels) · the ledger (paper, columns, a ruler that travels) · the broadsheet
(one big chart, type-led) · the field (particles settle into counts).

## Selector (Opus, after all drafts landed)

```
You are the SELECTOR and EVALUATOR for ⟨film id⟩. Use skills/atelier-select/SKILL.md and its references.
Drafts: factory/films/⟨id⟩/drafts/{⟨a⟩,⟨b⟩,…}. Read only frames/, film.json, claims.json, gate.json of each, and
factory/topics/⟨id⟩/. Do not read film.js, lib/ or NOTES.md; do not run a browser.
Deliver SELECT.md, the promoted winner in factory/films/⟨id⟩/ (set id to ⟨id⟩, record look {brand, chrome,
material}), and findings.r1.json validated with apply_findings.py --dry-run. No git.
Hand back ≤ 200 words: winner, why in two lines, findings per severity, beyond-scope list.
```

## Round 2 (message to the same selector agent after round 1 is applied)

```
Round 1 is applied (⟨applied⟩ accepted, ⟨rejected⟩ rejected; gate ⟨verdict⟩; frames regenerated at
factory/films/⟨id⟩/frames/). Do round 2 per atelier-select §7: re-read the strips, say per round-1 finding whether it
worked, backfired or did little (with the frame), write findings.r2.json (validated), append "Round 2" to SELECT.md.
Hand back ≤ 120 words.
```

## Brief writer (only when a film has no topic package)

```
Use skills/atelier-brief/SKILL.md to write factory/topics/⟨id⟩/ for: ⟨subject kind⟩ "⟨name⟩", audience ⟨level⟩,
format ⟨format⟩, source material ⟨paths|urls⟩. Hand back ≤ 150 words with any slot you could not source.
```
