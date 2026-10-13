# Who gains? · film id `who-gains` · brief (Wave AI-STORIES, BRIEF lane, 2026-10-10)

## Subject
- kind: concept with real fixtures. Name: "AI makes everyone faster" and the three studies that split it.
- source material: factory/research/AI-ADOPTION-2026.md §1; factory/WAVE-AI-STORIES.md; sources S1-S5 (sources.md).
- Fixtures (all published, none invented): the NBER/QJE support-agent study (S1), three Copilot field RCTs pooled (S2),
  the METR 2025 RCT and its Feb 2026 follow-up (S3, S4).

## Audience
manager; the room is a team lead or ops head deciding whether to roll an AI assistant out to a whole team.

## Format and look
feature-long, dur 153 (150 s material + 3 s CETI card), level manager, renderer webgl, chrome none, material ink,
brand ceti-neosage-dark, commit none (D11). Windows HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150 · card 150-153.

## Belief (what the room says out loud)
"AI makes everyone faster."

## The gap, two pictures
- Belief picture: one pooled column that rose, +14 % for 5,179 agents and +26 % for 4,867 developers; a tool that lifts
  everybody, and experts at least as much as anyone.
- Counted picture: the same boxes split by skill: the lowest-skill fifth +34 %, the highest-skill fifth about 0; and 16
  experienced developers who forecast 24 % less time, believed afterwards they had saved 20 %, and measured 19 % slower.
  The averages are real; they average a big gain and a flat line (and, for METR, a loss).

## Count (counts before ratios)
| unit | n | lands | note |
|---|---|---|---|
| one box = one support agent | 5,179 | CASE, 22.0 s (claim `agents`) | re-partitioned by skill quintile later; the +14 % lands at 26.0 s |
| one box = one software developer | 4,867 | COUNT, 84.0 s (`devs`) | second count, pooled +26 % at 88.0 s; no true-scale split (see blockers) |
| one dot = one METR developer, one box = one issue | 16 and 246 | COUNT, 102.0 s and 105.0 s | close-up; no per-developer issue counts are claimed |

## Fixture
1. Brynjolfsson, Li & Raymond (S1): a conversational assistant rolled out to 5,179 customer-support agents (NBER version);
   issues resolved per hour +14 % on average, +34 % for novice and low-skilled agents, minimal for experienced and highly
   skilled agents. Quintiles are a pre-AI skill index (tenure is a separate cut); the lowest quintile is about +35 % in
   the text, 0.29 log points = +34 % in the abstract; the film uses 34 only.
2. Cui et al. (S2): three field RCTs (Microsoft, Accenture, a Fortune 100 maker), 4,867 developers, +26.08 % (SE 10.3)
   completed tasks, recent hires and junior developers gain more, longer-tenure and senior gain little or not significantly.
   The SE is wide (about +/-20 points at 95 %); the film says "pooled" and never "proved".
3. METR (S3): 16 experienced open-source developers, 246 real issues, randomised allow/forbid AI. Forecast 24 % less time,
   afterwards believed 20 % less, measured 19 % MORE time (CI +2 to +39). S4 (Feb 2026): METR says speedups now seem
   likely but its follow-up data are "very weak evidence" (30-50 % of developers withheld tasks); not used for any digit.

## Mechanism (what the count draws)
Each worker is one box. Pooled, the boxes stand in one column and the average is the story. Re-partitioned by skill, the
same 5,179 boxes sort into a tall left group (lowest skill), a middle group, and a flat right group (highest skill): the
average was the weighted blend of those three heights. A tagged box (a lowest-skill agent) is followed through the move.
Then the METR developers: seen from above (the belief) every issue box has the same footprint at the forecast level; the
side view (the stopwatch) shows the measured level above the baseline line, not below it.

## Reversal sentence
"The same tool is +34 % for a novice and about 0 for an expert, and experts who believed +20 % measured -19 %; the
pooled averages hide the split."

## Commit
none (D11). `film.json` commit.enabled = false; four beats.

## Monday
- Question: "Before you roll it out: what is the gain for the least experienced person on the team, and for the most?"
- Honest limit (stage text, not only a caption), exactly one: "Three studies, earlier tools, different tasks: a pattern, not a law."
  METR's own 2026 follow-up is a source-chrome note under the METR close-up, not a second limit line.

## Takeaway (card, <= 60 chars)
"Averages hide who gains. Split by experience first." (51)

## Chain
gl-stack-city, gl-camera-rig, gl-labels, track-unit. Look: ceti-neosage-dark, chrome none, material ink, webgl, manager.

## Verification status (read before drafting)
WebFetch and curl were refused (metr.org, nber.org, mit.edu, mitsloan.mit.edu: getaddrinfo ENOTFOUND; proxy CONNECT 403,
organisation policy). Every number was re-read from WebSearch (extended) result text naming the URL; no primary page or
table was opened, so "A" = primary publisher named and number seen in the result text (the research-file definition).
Findings the orchestrator must know:
- F1 5,179 and 14 % are the NBER working-paper figures; the QJE abstract reads 5,172 agents and 15 %. The film cites the NBER
  version (captions and source chrome say "NBER"). Switch both digits together if the QJE version is preferred.
- F2 Per-quintile gains: only the lowest (34, A) and the highest (about 0, B) are sourced. The middle three quintiles were
  not found. The film shows THREE groups (low fifth, middle three fifths, high fifth); the middle height 12 is derived
  from the pooled mean under equal quintile weights (grade B, approximate) and is drawn as height only, with no digit.
  A faithful five-column version needs the QJE figure (rows by skill quintile): blocker for a 5-way split.
- F3 The 4,867 developers cannot be re-partitioned at true scale: group sizes (junior vs senior, per experiment) were not
  found. The junior +27 to +39 % and senior +8 to +13 % ranges came through one secondary summary (S5): grade C, not on screen.
  The film keeps the 4,867 pooled and says "newer hires gained more" in words. Promote the ranges to B only after a re-read.
- F4 METR follow-up numbers (-18, -4 time change) are grade C: secondary coverage disagrees about the sign reading and METR
  itself calls the data unreliable. Not on screen.
- F5 "Experience/tenure quintile" in the wave brief is, in S1, a skill-index quintile; label it "skill", not "tenure".
- F6 The three fixtures use different outcomes (issues per hour; tasks completed; time per issue) and different tools.
  Never put the +34 and the -19 on one axis; the film keeps three separate fields.

## What this film is NOT
- Not "AI makes experts slower": METR is 16 people, 2025 tools, their own repositories; its follow-up says speedups now seem likely.
- Not "AI helps novices more, so hire novices": the support desk is one firm; the developers are task counts.
- Not a leaderboard, not a capability claim, no model names on screen, no BCG/Dell'Acqua second case (758 consultants), no
  Canaries (age) cut: one belief, three fixtures, one split.
- Not a forecast for 2026 tools; no dollar value; no p-values on screen (the SE stays in claims.json).
- No invented per-developer issue counts, no invented middle-quintile gains, no per-experiment sample sizes.


## Director's choices (2026-10-10)
- Keep the NBER working-paper figures on screen (5,179 agents, +14 %); the QJE version (5,172, 15 %) is noted in sources.md and the honest line says the published version rounds differently.
- The split is by the study's skill index (quintiles), captioned as 'skill quintile', never as tenure.
- The 2026 METR follow-up stays off stage (grade C); the single honest-limits line covers it.
