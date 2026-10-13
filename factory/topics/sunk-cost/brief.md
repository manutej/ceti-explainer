# sunk-cost · The Sunk Cost Fallacy · brief

Film id `sunk-cost`. Format: the 75-second case (factory/FORMAT.md). Explorer: Opus, 2026-10-08.

## The exec question (one line)
"We've already spent $4M on this; we can't stop now." Should the money already spent decide whether we spend the next dollar?

## The belief to break
"What we have already paid does not change how we behave; we carry on because the thing is worth it."
In the one real test with real money, people who had paid more used more of what they paid for, with the
plays, the theatre and the dates held identical. The price paid, which was gone either way, moved behaviour.

## The one real case
Arkes & Blumer (1985), the season-ticket field experiment, Ohio University Theater, 1982 to 1983 season.

- The first 60 people to come to the box office for a season ticket were each sold, in an order randomised
  beforehand, one of three tickets: full price $15, $2 off ($13) or $7 off ($8). 20 per group by design
  (Friedman et al. 2007 describe it as 20 / 20 / 20; Arkes & Ayton 1999 as about one third each).
- The season was split into two halves of five plays each. The authors counted the tickets each holder used.
- Six buyers who bought as couples were set aside: 2 full price, 1 at $2 off, 3 at $7 off. Analysed: 54.
- First half (plays 1 to 5), mean tickets used per person: **$15: 4.11 · $13: 3.32 · $8: 3.29**. The full-price
  group used significantly more than both discount groups (t = 1.79 and 1.83, p < .05, one-tailed).
- Second half (plays 6 to 10): 2.28 · 1.54 · 2.18, no significant difference. The effect faded.

**Counts we put on screen, and why they are exact.** The paper reports means, not totals. Group sizes after
the couples are removed are 20 − 2 = 18, 20 − 1 = 19, 20 − 3 = 17. For each group exactly one integer total
rounds to the reported two-decimal mean (checked by brute force over every total from 0 to 5n):

| ticket | people | tickets (×5) | used | unused | used ÷ people |
|-------|------:|------:|-----:|------:|------:|
| $15 (full) | 18 | 90 | 74 | 16 | 4.111 → 4.11 |
| $13 ($2 off) | 19 | 95 | 63 | 32 | 3.316 → 3.32 |
| $8 ($7 off) | 17 | 85 | 56 | 29 | 3.294 → 3.29 |

Double check: a search over every n from 10 to 30 finds that 4.11 (first half) and 2.28 (second half) are
jointly consistent only with n = 18, and 3.29 with 2.18 only with n = 17 (or 28): an independent confirmation
of the 2 and 3 couples removed. The $2 group's second-half 1.54 is not reachable with n = 19 (29/19 = 1.53);
it is a likely rounding slip in the paper and is never shown on screen.

**Concorde: left out.** The brief allowed it only if its figures could be sourced. The cost figures could not be
verified from a primary source in this container (egress to the paper hosts is blocked), so the film does not
name Concorde. Arkes & Ayton (1999) stays in the sources for the ticket prices only.

## The count structure
- **What is counted:** tickets. One square = one holder's ticket for one of the first five plays. Each holder is
  a row of five squares; each price is a column of rows: 18, 19 and 17 rows (90, 95, 85 squares, 270 in all).
  A used ticket is filled with ink; an unused one stays an empty outline.
- **How the count builds:** columns fill play by play (five sweeps), a counter beside each ticks the used total;
  then the squares sort, used to the top and unused to the bottom in full rows of five, so the empties read as
  16 (3 rows + 1) for $15 against 29 (5 rows + 4) for $8, with one fewer person in the $8 column.
- **The committed number:** "17 people got $7 off: 85 tickets. How many went unused?" (0 to 85). The guess is
  laid on the $8 column as a red pencil bracket over that many squares, counted up from the bottom, against
  the true bracket of 29. Film-mode default: 17 (one missed play each, the natural lay guess).
- **Only after the counts:** the per-person ratios 4.11, 3.32 and 3.29 of 5, each with "74 ÷ 18" beneath (Q14).
- **Which seats were empty is not reported.** The empty squares are placed by a seeded shuffle (mulberry32,
  seeds 15, 13, 8); the arrangement is illustrative, the totals are the paper's. Said in honest limits.

## The Monday question
"If the $4M were not already spent, would we fund the rest today?"

## Honest-limits line
"One theatre, 54 people; by plays 6–10 the gap had faded." (On the page, the longer form: one season, one
campus theatre, $2 and $7 discounts on $15 tickets, not a $4M project; the effect was gone in the second half,
and lab studies such as Friedman et al. 2007 find the sunk-cost effect small and erratic. It is a nudge, not a law.)

## Sources (full citations)
1. Arkes, H. R., & Blumer, C. (1985). The psychology of sunk cost. *Organizational Behavior and Human Decision
   Processes*, 35(1), 124–140. https://doi.org/10.1016/0749-5978(85)90049-4 — the season-ticket field
   experiment: 60 buyers, $15 / $13 / $8, two halves of five plays, six couples removed (2 / 1 / 3), means 4.11,
   3.32, 3.29 (first half) and 2.28, 1.54, 2.18 (second half), t = 1.79, 1.83.
2. Arkes, H. R., & Ayton, P. (1999). The sunk cost and Concorde effects: Are humans less rational than lower
   animals? *Psychological Bulletin*, 125(5), 591–600. https://doi.org/10.1037/0033-2909.125.5.591 — restates
   the design: about one third each at $15, $13 and $8; discounted buyers attended fewer plays.
3. Friedman, D., Pommerenke, K., Lukose, R., Milam, G., & Huberman, B. A. (2007). Searching for the sunk cost
   fallacy. *Experimental Economics*, 10(1), 79–104. https://doi.org/10.1007/s10683-006-9134-0 — describes the
   20 / 20 / 20 design and the couples exclusion; finds the effect small and erratic in the lab (limits line).
4. Staw, B. M. (1976). Knee-deep in the big muddy: A study of escalating commitment to a chosen course of
   action. *Organizational Behavior and Human Performance*, 16(1), 27–44.
   https://doi.org/10.1016/0030-5073(76)90005-2 — the management form of the same error (escalation of
   commitment); background for the hook, no number on screen.
5. Thaler, R. (1980). Toward a positive theory of consumer choice. *Journal of Economic Behavior &
   Organization*, 1(1), 39–60. https://doi.org/10.1016/0167-2681(80)90051-7 — names the sunk-cost effect in
   consumer choice; background, no number on screen.

Verification note: the primary PDF hosts are blocked by this container's egress policy. Every case number
above was confirmed twice through independent search excerpts of the paper's own text (results paragraph;
method and exclusions paragraph) and cross-checked arithmetically (the n reconstruction). The $4M in the hook
is an illustrative quote, not data, and is marked so in claims.json.

## What this film is NOT
- Not Concorde, not a megaproject post-mortem, not animals (no figures we could source).
- Not "never continue a project": continuing is right when the remaining spend buys enough; the film only
  says the spent part must not be the reason.
- Not escalation-of-commitment research (Staw) or personal-responsibility effects; one case only.
- Not a claim the effect is large or universal: one theatre, 54 people, first half of a season only.
- Not individual attendance data: which seats were empty is illustrative; the totals are real.
- Not opportunity cost, base rates, the planning fallacy or the agent loop (Q10).
- No percentages before the counts; no "21 % more" or "25 % more" figures from secondary write-ups (they
  disagree with each other and with the paper's means).
