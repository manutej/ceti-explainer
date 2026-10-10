# Friction log · atelier-brief on `factory-self` (2026-10-10)

Format: file:line, what. Ranked top three first.

## Biggest three
1. skills/atelier-brief/SKILL.md:7 vs :38-40 and subject-kinds.md:8. The skill says "No git from this skill" and the task said no git,
   but step 1 and the repository row of subject-kinds make `repo_topic.py` the extractor, and that tool is git-only (`--rev`, `--days`,
   commits, PRs). A repository subject that cannot run git has no recipe. I hand-wrote non-git `recompute` commands (find, grep,
   sed, python3) for file-tree counts, which repo_topic does not produce at all (it counts history and lines, not layers or folders).
   The harness also said "Is a git repository: false" while `.git` exists; I read the commit from `.git/HEAD` as a file.
2. SKILL.md:24 and :73 vs new_topic.py:179-186 vs topics/simpsons/claims.json vs repo_topic output. The claim shape is stated as
   `{id, what, value, formula|source, where}` but three shapes exist: new_topic uses `{id, text, value, formula, source: "S1"|"derived",
   quote, renders}` (an array), simpsons uses `{id, text, value, formula, source, where}` inside `{film, params, claims}`, repo_topic uses
   `recompute`. gate.mjs recomputes formulas over film.json `params`, not over claim ids, so "formula over other claims" (SKILL.md:25, :67)
   cannot be gated as written. I wrote a superset (`what`, `recompute`, `formula` over claim ids, `inputs`, `renders`, `where`) and
   verified it with my own script; a drafter must still translate it to params. Same area: SKILL.md:51-52 says new_topic.py fills
   "its seven files" but the output contract (:70-75) is three, and running it would also scaffold factory/films/<id>/ (film.json,
   film.js, NOTES.md), which is out of scope for a brief. I did not run it; I read the template headings from new_topic.py:40-100
   because SKILL.md:72 points to "new_topic.py's template order" without listing it.
3. references/formats.md:6 (feature) gives lengths but no windows, no commit.at, no count.at, and says "more than one count" while the
   Count slot (SKILL.md:25) is singular. I took the windows from factory/films/wiring-and-the-whole/film.json (dur 115; HOOK 0-9,
   COMMIT 9-17, CASE 17-55, COUNT 55-104, MONDAY 104-112; commit 10, count 55) and made two counts with one `Count` plus a second
   in the beat table. Also: nothing says what to do when a topic for the same subject already exists
   (factory/topics/ceti-explainer-self, a repo_topic output, 90 s case): the description says "no topic package exists yet" but there is
   no check step; I only found it by `ls factory/topics`.

## Smaller
- SKILL.md:65 "Nothing in HOOK or COMMIT carries a digit from Claims" vs the commit box needing its range and unit (simpsons has
  `depts` = 6 and `hold` = 8 on the COMMIT box). I tagged `commit-range`, `commit-default`, `hold` as `role: input` and wrote "hundred"
  in words in the caption. Say that input claims are exempt.
- SKILL.md:31, :54-55 cite `atelier-draft/references/chain-recipes.md` and `atelier-variant/references/brand-packs.md` without the
  `skills/` prefix. chain-recipes.md is 37 KB with a very wide table; the module ids to put in `Chain` (e.g. `core/timeline`,
  `structures`) are only visible there. The `Look.chrome` ids are not in the skill or brand-packs.md; I took
  `tender-set|ledger|memo|none` from HANDOFF.md section 3 and checked factory/chromes/*.js.
- subject-kinds.md:13 says batch above ~5,000 marks; chain-recipes.md:76 says use `mass` at N >= 3,000. My n = 2,932 sits between
  them with no stated tolerance as the repo grows. I wrote both thresholds into beats.md.
- No pinning rule for "the current commit": HEAD moved from 351c37b to f886f1a while I worked (an orchestrator commit). Without git
  I count the working tree, not the tree of the commit (D10 un-ignores built pages; untracked files count). The skill should say
  which one a repo claim means, and exclude the topic's own folder (I did, in every find).
- The sourced default guess (SKILL.md:44, Commit.default "sourced where a survey exists") has no fallback wording for a subject with no
  survey; I wrote "reasoning, not a survey" and flagged it as open.
- The skill has no slot for money: a manager audience asks cost per film; the repo holds only a 30-minute target (factory/README.md:3,
  a goal) and P1's 55 min / 1.48 M tokens for the heaviest film. Listed as an open item in beats.md and brief.md "Not this".
- README.md:3 still describes the older sheaf/operad course; HANDOFF.md says 24 pattern and material lanes but arsenal/patterns has 23
  folders. Repo issues, not skill issues, noted so the film does not quote either.
