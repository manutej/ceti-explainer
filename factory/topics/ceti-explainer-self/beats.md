# ceti-explainer · beats (repo reader, 90-second cut)

id: `ceti-explainer-self` · dur 90 s = material 0 to 87 s + CETI brand card 87 to 90 s · commit.at 11 s · count.at 46 s
Pinned `88a2804` · window 2026-10-02 to 2026-10-08 UTC. Every digit below is a claim in claims.json.

**Gate note.** factory/FORMAT.md binds factory films to 60 to 75 s of material (gate G4a fails 87 s). To ship
through the factory gate, use the 75 s mapping column (each time × 72/87, brand card 72 to 75 s) and drop caption 8
and caption 12 first; the 90 s cut is for the repo-reader channel.

## Structures (at most 4; the brand card is not one)
1. S-A the sheet: the README quote (HOOK) and the commit box (COMMIT)
2. S-B the timeline: 7 day columns, one mark per commit (86 marks), CASE and COUNT
3. S-C the tree: one cell per own file (1,266) under 22 top-level folders; test files and the
   most-touched files in the accent
4. S-D the wall: 130,539 lines at 200 per mark = 653 marks

## Beat table

| # | beat | window (90 s) | 75 s mapping | on screen (structure) | focal motion | claims used |
|---|------|---------------|--------------|-----------------------|--------------|-------------|
| 1 | HOOK | 0 to 10 s | 0 to 8.3 s | S-A: the repo name, then the README quote set in the display face | the quote types on, word by word | readme-quote |
| 2 | COMMIT | 10 to 20 s | 8.3 to 16.6 s | S-A: the commit box; the timeline's empty columns ghosted, no marks | the box seals at commit.at + 4.5 s | window-days, commit-default |
| 3 | CASE | 20 to 44 s | 16.6 to 36.4 s | S-C: the tree; the most-touched files and the test files light up; the largest commit's lines as a bar at true scale | each file lights as its caption lands | top-files, top-file-commits, test-files, test-fns, largest-window |
| 4 | COUNT | 44 to 78 s | 36.4 to 64.6 s | S-B: marks drop into day columns (10-02:0 10-03:0 10-04:0 10-05:2 10-06:1 10-07:0 10-08:83); the guess as a graphite line at height g; then S-D: the wall builds | marks counted in commit order; the wall row by row | commits-window, timeline, busiest-day, files-own, lines-own, wall-scale, wall-marks, days-active |
| 5 | MONDAY | 78 to 87 s | 64.6 to 72 s | the Monday question over the faded wall; the honest line as the caption | none (hold) | window-days |

## Captions (28 units, at most two lines of ~50 characters; no digit without a claim)

| # | t0 | t1 | beat | text | chars |
|---|---:|---:|------|------|------:|
| 1 | 0.5 | 4.8 | HOOK | ceti-explainer, in its own README: | 34 |
| 2 | 5.0 | 7.3 | HOOK | “Short-course explainers for sheaves, operads, and | 50 |
| 3 | 7.4 | 9.6 | HOOK | cohomology — for people who do not live in journals.” | 53 |
| 4 | 10.4 | 15.0 | COMMIT | Is it alive? Your guess first. | 30 |
| 5 | 15.2 | 19.6 | COMMIT | How many commits in the last 7 days? | 36 |
| 6 | 20.4 | 26.0 | CASE | What it claims, shown by what it did this week: | 47 |
| 7 | 26.2 | 32.0 | CASE | Most touched: .gitignore, 6 commits. | 36 |
| 8 | 32.2 | 38.0 | CASE | 10 test files, 4 tests read, none run. | 38 |
| 9 | 38.2 | 43.8 | CASE | Largest change: 29,938 lines in one commit. | 43 |
| 10 | 44.4 | 50.0 | COUNT | One mark per commit, one column per day. | 40 |
| 11 | 50.2 | 56.0 | COUNT | 86 commits. You guessed {g}. | 28 |
| 12 | 56.2 | 62.0 | COUNT | 1,266 own files in the tree. | 28 |
| 13 | 62.2 | 70.0 | COUNT | 130,539 lines; one mark is 200 lines. | 37 |
| 14 | 70.2 | 77.6 | COUNT | 3 of 7 days had a commit. | 25 |
| 15 | 78.4 | 83.0 | MONDAY | Monday: ask for the last 7 days as a count. | 43 |
| 16 | 83.2 | 86.8 | MONDAY | Limits: activity, not value. Tests read, not run. | 49 |

`{g}` is the viewer's sealed number (film mode: commit-default = 7); no answer reads "No guess. 86 commits."
Caption 13 is the only ratio and comes after the timeline has landed (counts first, Q14).

## Brand card (87 to 90 s)
"CETI" wordmark line, then the takeaway: "Read the ledger before you judge the code."

## Checks before building
- [ ] Re-run `python3 factory/tools/repo_topic.py --check factory/topics/ceti-explainer-self/claims.json` (PASS) before copying params.
- [ ] Every digit in a caption or on the stage has a claim (value or `renders`); file names in captions are basenames.
- [ ] No ratio, percentage or "N of M" before count.at (46 s), and none before the timeline has landed.
- [ ] Nothing from the timeline or the answer before the seal (commit.at 11 s + 4.5 s).
- [ ] At most four structures; at most two full-screen cards.
