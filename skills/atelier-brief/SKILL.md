---
name: atelier-brief
description: "Turn ANY subject into a verifiable topic package for the explainer factory: a concept, a management bias, a product feature, a repository or codebase, a CETI academy lesson, a client case, a metric. Writes factory/topics/<id>/{brief.md, claims.json, beats.md} where every number is a claim with a source or a formula, the count is named before any ratio, the viewer's commit question is fixed, and the beat sheet names the arsenal chain, format, level, renderer and look the drafters will build. Use this whenever someone wants a film, reel, explainer, showcase or case study ABOUT something and no topic package exists yet: 'make a film about X', 'explain X to execs', 'showcase my repo', 'a reel on our new feature', 'academy explainer on X', 'turn this doc into a case', 'brief the drafters'. Not for building the film (atelier-draft) or for a film that already has a topic package."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` and the laws in `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md`. The binding
> format is `factory/FORMAT.md`; where this file and FORMAT.md disagree, FORMAT.md wins. No git writes from this skill
> (no add, commit, push); read-only git inside `repo_topic.py` (log, ls-tree, grep at a pinned `--rev`) is how a
> repository is measured and is allowed even when the harness says the folder is not a repository.

# atelier-brief · subject → topic package

The category this skill serves: **a subject that a short silent film must make true for a viewer who commits a
number first**. The instance varies in kind (concept, repository, product, lesson, client case), in audience
(exec, manager, engineer) and in format (case, feature, reel). The structure never varies: one belief, one
fixture with real numbers, one count, one commit, one Monday question, one honest limit, one chain of modules.

## Typed slots (fill every one; a slot you cannot fill is a finding, not a blank)

```
Subject:        {kind: concept|repo|product|lesson|case|metric, name: str, source_material: list[path|url]}
Audience:       {level: exec|manager|engineer, room: str}                 // who sits in the room, in one line
Format:         case (60–75 s) | feature (90–120 s) | reel (planned)        // factory/FORMAT.md
Belief:         str                      // the sentence a person in that room says out loud before the film
Fixture:        {name, place, year, numbers: list[ClaimId]}               // one real example; never a made-up one
Claims:         list[Claim]  (shape in references/claims-shape.md)        // every digit that will ever be on screen;
                                                                          // role input (commit range, unit, hold) is exempt from the commit law
Count:          list[{unit: str, n: int, lands_at: ClaimId}]  (≥ 1)      // "one mark is one ___"; the first lands before any ratio;
                                                                          // a feature may carry a second count after the first has landed
Commit:         {question: str, unit, min, max, default_guess, why_default: source|"reasoning, no survey"}
Mechanism:      str                      // one paragraph: what THE COUNT draws and why the belief breaks
Monday:         {question: str, honest_limit: str}                        // the one question to ask at work; what the case is not
Cost:           {per_film: measured|target, value, source}  (optional)   // only when the room will ask; measured beats target
Takeaway:       str (≤ 60 chars)         // the brand card line
Sources:        list[{tag, author, title, year, where}]  (≥ 3)
Chain:          list[ModuleId]           // ids from the module table in skills/atelier-draft/references/chain-recipes.md §1
Look:           {brand: PackId, chrome: tender-set|ledger|memo|none, material: ink|…, renderer: 2d|webgl, level}
NotThis:        list[str]                // the tempting versions we are not making, and why
```

## Procedure

0. **Check for an existing package** (`ls factory/topics/`): a topic on the same subject is extended or forked with a
   new id and a note, never duplicated unknowingly.
1. **Name the category of the subject, then its free variables.** A repository's numbers are counts of files,
   lines, tests, commits, branches, pull requests and measured timings at one pinned commit
   (`python3 factory/tools/repo_topic.py <path> --id <id> --rev <sha>`; tree counts exclude the topic's own folder;
   a working-tree count is a different claim and says so); a concept's numbers come from one published fixture; a
   product's from its own telemetry or a documented benchmark; a lesson's from the canonical worked example. Read
   `references/subject-kinds.md` for where each kind's numbers come from and what its count is.
2. **Find the reversal or the gap.** A film earns its minute only if the picture after the count differs from
   the picture the belief predicts. State both pictures in one sentence each. If there is no gap, say so and stop:
   the subject is not a film.
3. **Fix the count before anything else.** Choose the unit so that `n` is drawable at true scale (hundreds to about
   3,000 marks; above that, batch by a documented factor that is itself a claim, or name the `mass` module in the
   chain). The count's landing value is a claim; every ratio that follows is a formula over claims.
4. **Write the commit question** so a wrong guess is the belief's guess. The default guess (film mode) is the
   belief's number, sourced where a survey exists.
5. **Write claims.json first, then the prose.** `python3 factory/tools/new_topic.py <id> "<Title>"` scaffolds the
   topic (brief.md, claims.json, beats.md) and a film skeleton under factory/films/<id>/; fill the three topic files
   and leave the skeleton to the drafters. The gate recomputes every `formula` over claim ids, `count` fields and
   `params` (`references/claims-shape.md`), so prefer formulas to pasted percentages.
6. **Choose the chain and the look** with `skills/atelier-draft/references/chain-recipes.md` §2 (by visual job, not
   by taste; ids from §1) and `skills/atelier-variant/references/brand-packs.md`. Exec level means ink only and no
   texture; manager level may use webgl and a material. Write format, level, renderer, look and chain into beats.md's
   header so every drafter starts from the same list; windows per format are in `references/formats.md`.
7. **Write the beat table** (window, structure, focal motion, claims used) and the captions (≤ 2 lines of ~50
   characters, 28 units, no digit without a claim). Run the checks at the foot of beats.md.

## Rules that bind the slots

- A claim resolved here is immutable downstream: drafters and evaluators may not change a number; they may only
  move it in time or re-caption it with the same digits.
- `Count[0].lands_at` must precede every ratio in the beat table (law: counts before ratios).
- Nothing in HOOK or COMMIT carries a digit from `Claims` except role `input` claims (the commit box's unit, range,
  default and hold), which the kit draws (law: the viewer commits before any number is shown).
- One `Monday.honest_limit`, exactly one, and it names what the fixture does not prove.
- `Sources` ≥ 3 and each `Claims[i].source` is one of them or a formula over other claims.

## Output contract

```
factory/topics/<id>/brief.md     the slots above as headed sections (new_topic.py's template order)
factory/topics/<id>/claims.json  the shape in references/claims-shape.md, recomputable
factory/topics/<id>/beats.md     header: format, level, renderer, look, chain; beat table; captions; checks
```
Hand back ≤ 150 words: id, the belief, the gap in one sentence, n and its unit, the chain, and any slot you could
not fill with a sourced value (that is a finding the user must resolve before drafting).

## References (read on demand)

- `references/subject-kinds.md` — where each subject kind's numbers and count come from; the repo extractor.
- `references/formats.md` — case, feature, reel, smoke: windows, lengths, what the gate expects of each.
- `references/claims-shape.md` — the one claims.json shape the gate recomputes; roles; what the drafter converts.
- `${CLAUDE_PLUGIN_ROOT}/factory/FORMAT.md` — binding format; `factory/topics/simpsons/` is a filled package to
  pattern-match the shape (not the content).

## Documentation and artifacts

The family index `skills/ATELIER.md` §Index names where p5.js 2.x documentation (the atlas under `references/atlas/`,
mapped by `skills/atelier-draft/references/p5-index.md`), the arsenal cards, the kit contract and every published
artifact live. Cite the atlas page when you write a card; publish what you ship and record it in `factory/ARTIFACTS.md`.
