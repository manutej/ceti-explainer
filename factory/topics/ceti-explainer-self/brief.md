# ceti-explainer · brief (repo reader)

id: `ceti-explainer-self` · room: exec · format: the case, 90-second cut (beats.md; the factory gate's 75 s mapping is in it)
explorer: factory/tools/repo_topic.py (machine-read; an explorer reviews before building) · pinned commit
`88a28046260c2bc6715bd710359699d9a2b4af9b` (2026-10-08T15:34:32+00:00) · window 2026-10-02 to 2026-10-08 UTC (7 days, until 2026-10-08T15:34:55+00:00)

## The exec question
"Why is this repo valuable?"

## The belief
"You cannot tell what a codebase is worth without reading the code." The repo answers in counts instead: what it
says it is, how big it is, how alive it is, what it tests and what it leans on, all read from its history and tree
without running a line of it.

## The everyday situation (HOOK)
Someone hands you a repo link before a budget meeting: fund it, freeze it or fold it? You have ninety seconds and no
time to read code. The README's first line is all most people ever see: "Short-course explainers for sheaves, operads, and cohomology — for people who do not live in journals."

## The mechanism
A repo's history is a ledger that nobody edits: every commit has a time, an author and the lines it moved. Counted,
the ledger shows whether the thing is alive (86 commits on 3 of 7 days),
what the work was about this week (the most-touched files), and how large and how tested it is (files, lines,
test files). THE COUNT draws those counts as marks before any ratio.

## The fixture: the repo itself
- **What it is**: "Short-course explainers for sheaves, operads, and cohomology — for people who do not live in journals." (README.md, line 3).
- **How big**: 1,346 tracked files, 163,803 text lines; without vendored or generated paths
  1,266 files and 130,539 lines. Languages (own lines): Markdown 47,483, JavaScript 37,428, JSON 35,571, Python 5,491, HTML 2,845.
- **How alive**: 98 commits since 2026-08-24 (45 days); in the window
  86 commits on 3 of 7 days by 2 author(s), +163,780 / -2,244 lines.
  Largest change: `6c71a20` "Keep every built standalone page in the repo (D10)", 29,938 lines in 24 files.
- **What the week was about** (most-touched files): `.gitignore` (6 commits); `tests/baselines/builds.json` (4 commits); `tests/proofs.sh` (4 commits).
- **What it tests**: 10 test files; 4 test functions found by reading them
  (javascript 4); 8 test files hold no
  `def test` / `test(` / `it(` / `func Test` / `#[test]` the static reader recognises (helpers, harness calls, shell
  proofs), so the function count is a floor. Runners: node --test (2 test files import node:test (e.g. tests/node/am-cam-mix.test.mjs)). Nothing was run.
- **What it depends on**: scripts/requirements.txt declares 4 (playwright>=1.45,<2, fonttools>=4.50, brotli>=1.1, Pillow>=10). **What depends on it**: not knowable from a local clone (who imports or vendors this repo lives outside it).
- **Docs**: README present (141 lines, 15 headings); 702 doc files; top level: HANDOFF-JEV-EVAL.md, HANDOFF.md, MERGE-NOTES.md, README.md, REQUIREMENTS.md, RUN.md.

## The numbers
Every number has an entry in `claims.json`: a `recompute` command (read-only git and text tools, pinned to
`88a2804` and the window's two timestamps) or a `formula` over `params`. Check them all with
`python3 factory/tools/repo_topic.py --check factory/topics/ceti-explainer-self/claims.json`.

| claim id | what | value | source or formula |
|----------|------|------:|-------------------|
| window-days | the window: 7 UTC calendar days, 2026-10-02 to 2026-10-08 (until 2026-10-08T15:34:55+00:00) | 7 | `git` (recompute in claims.json) |
| commits-window | commits in the window (merges included) | 86 | `git` (recompute in claims.json) |
| days-active | days in the window with at least one commit | 3 | `git` (recompute in claims.json) |
| timeline | commits per UTC day in the window (zeros are days with none) | see claims.json | `git` (recompute in claims.json) |
| busiest-day | the busiest day in the window: 2026-10-08 | 83 | `git` (recompute in claims.json) |
| authors-window | distinct authors (name and email) in the window | 2 | `git` (recompute in claims.json) |
| ins-window | lines inserted in the window (merges excluded) | 163,780 | `git` (recompute in claims.json) |
| del-window | lines deleted in the window (merges excluded) | 2,244 | `git` (recompute in claims.json) |
| net-window | net lines added in the window | 161,536 | ins_window - del_window |
| largest-window | the largest commit in the window, 6c71a20 "Keep every built standalone page in the repo (D10)": lines changed (inserted + deleted) | 29,938 | `git` (recompute in claims.json) |
| top-files | the most-touched files in the window (commits touching each, merges excluded) | see claims.json | `git` (recompute in claims.json) |
| top-file-commits | commits that touched the most-touched file, .gitignore | 6 | `git` (recompute in claims.json) |
| commits-all | commits reachable from 88a2804 (all time) | 98 | `git` (recompute in claims.json) |
| authors-all | distinct authors, all time | 4 | `git` (recompute in claims.json) |
| first-day | the first commit's UTC date | 2026-08-24 | `git` (recompute in claims.json) |
| first-ts | the first commit's time (unix seconds) | 1,787,554,153 | `git` (recompute in claims.json) |
| head-ts | the pinned commit's time (unix seconds), 2026-10-08T15:34:32+00:00 | 1,791,473,672 | `git` (recompute in claims.json) |
| age-days | days from the first commit to the pinned commit | 45 | Math.floor((head_ts - first_ts) / 86400) |
| days-with-commits | distinct UTC days with a commit, all time | 6 | `git` (recompute in claims.json) |
| ins-all | lines inserted, all time (merges excluded) | 166,159 | `git` (recompute in claims.json) |
| del-all | lines deleted, all time (merges excluded) | 2,356 | `git` (recompute in claims.json) |
| files | files tracked at 88a2804 (all, incl. vendored and generated) | 1,346 | `tree` (recompute in claims.json) |
| files-own | files tracked, without vendored or generated paths | 1,266 | `tree` (recompute in claims.json) |
| lines | text lines in tracked files (all) | 163,803 | `tree` (recompute in claims.json) |
| lines-own | text lines without vendored or generated paths | 130,539 | `tree` (recompute in claims.json) |
| wall-scale | lines per mark on the wall (smallest 1-2-5 step that keeps the wall at or under 1,000 marks) | 200 | wall_scale |
| wall-marks | marks on the wall | 653 | Math.round(lines_own / wall_scale) |
| top-dirs | top-level folders (and root) holding own files | 22 | `tree` (recompute in claims.json) |
| code-languages | programming languages with own files (by extension) | 5 | `tree` (recompute in claims.json) |
| lang-top-lines | own lines in JavaScript, the largest programming language | 37,428 | `tree` (recompute in claims.json) |
| test-files | test files by path (code files under tests/, test_*.py, *.test.js and the like) | 10 | `tree` (recompute in claims.json) |
| test-fns-javascript | javascript test functions found by reading the test files (not run) | 4 | `tree` (recompute in claims.json) |
| test-fns | test functions found by reading, all languages (none executed) | 4 | test_fns_javascript |
| doc-files | documentation files (md, rst, adoc, txt) without vendored paths | 702 | `tree` (recompute in claims.json) |
| readme-quote | what it is, in the README's own words (15 words; README.md lines 3 to 3) | Short-course explainers for sheaves, operads, and cohomology — for people who do not live in journals. | `readme` (recompute in claims.json) |
| readme-headings | headings in README.md | 15 | `readme` (recompute in claims.json) |
| deps-2 | direct runtime dependencies declared in scripts/requirements.txt | 4 | `manifest` (recompute in claims.json) |
| deps-total | direct runtime dependencies across manifests | 4 | deps_2 |
| commit-default | the film-mode guess (commit.default): one commit a day; the viewer's number, not a fact | 7 | window_days |

## The count (proposals; pick at most three structures)
1. **The commit timeline as marks.** One mark per commit, stacked in 7 day columns, 2026-10-02 to
   2026-10-08: n = 86 marks; tallest column 83
   (2026-10-08). The count lands at 86 before "3 of 7 days" appears.
2. **The file tree as a structure.** One cell per own file (1,266), grouped under its 22
   top-level folders (largest: references/ 494, arsenal/ 226, factory/ 211, chromes/ 86); test files and the
   most-touched files picked out in the accent.
3. **The lines as a wall.** 130,539 own lines at 200 lines per mark = 653 marks;
   the window's +163,780 inserted lines as the marks laid this week (819 at the same scale).

## The commit
Question: "How many commits landed in this repo in the last 7 days?" Unit: commits · range 0 to
1000 · film-mode default 7 (one a day, the guess people make for a
side project; the viewer's number, not a fact, claim `commit-default`). Nothing from the timeline shows before the seal.

## Monday
The one question to ask at work: "Show me the last 7 days as a count: commits, the files they touched,
and the tests beside them."
Honest limit: commits count activity, not value; test functions were counted by reading, not by running them; who
depends on this repo is not in the repo.

## Takeaway (brand card)
Read the ledger before you judge the code.

## Sources
- [S1] git history of /home/user/ceti-explainer at `88a28046260c2bc6715bd710359699d9a2b4af9b` (`git log`, `git rev-list`), window 2026-10-02T00:00:00+00:00 to 2026-10-08T15:34:55+00:00.
- [S2] the tree at `88a2804` (`git ls-tree`, `git grep -c`), vendored and generated paths excluded by `(^|/)(vendor|node_modules|dist|build|third_party)/|(^|/)[^/]*\.egg-info/|\.min\.(js|css)$|(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock|Gemfile\.lock|composer\.lock)$`.
- [S3] README.md at `88a2804`; manifests: .claude-plugin/plugin.json, scripts/requirements.txt.

## Not this
- Not a code review or a quality score: counts of activity and size, not judgements of design.
- Not a test result: no runner was started; "tests" are files and functions read from the tree.
- Not a popularity claim: stars, downloads and dependents live outside the clone.
- Not uncommitted work: only what is committed at `88a2804` is counted.
