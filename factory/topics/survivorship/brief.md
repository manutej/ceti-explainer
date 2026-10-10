# survivorship · brief

Film id `survivorship`. Working title: **The Missing Planes**. Format: the 75-second case (factory/FORMAT.md).

## The exec question, in one line
"We studied our best customers (our surviving projects) and copied what they did. What is wrong with that?"

## The belief to break
"The ones that made it show us what works, and their scars show us where the risk is." Data that only
contains survivors cannot show what killed the others; the missing cases are not a random gap, they are
exactly the ones that answer the question.

## The one real case
Abraham Wald, Statistical Research Group (SRG), Columbia University, 1943, working for the Applied
Mathematics Panel of the NDRC. His eight memoranda, *A Method of Estimating Plane Vulnerability Based on
Damage of Survivors*, ask: given hit counts on the planes that came back, and nothing on the planes that did
not, how likely is a hit to down a plane? Part I works a numerical example. Those are the film's numbers.

| quantity | value | how known |
|---|---:|---|
| planes that flew (N) | 400 | memo example |
| came home | 380 (share 0.95) | memo example |
| never came home | 20 (share L = 0.05) | 400 - 380 |
| came home, no hits (a0 = .800) | 320 | memo example |
| came home, 1 hit (a1 = .080) | 32 | memo example |
| came home, 2 hits (a2 = .050) | 20 | memo example |
| came home, 3 to 5 hits | 8 | 60 - 32 - 20; memo caps hits at n = 5 |
| of which 3 / 4 / 5 hits (a3, a4, a5 = .010, .005, .005) | 4 / 2 / 2 | reconstructed, see below |
| per-hit survival q (memo's root, Birge-Vieta) | 0.851; p = 0.149 | memo; recomputed |

Derived, model-light: in Wald's model a plane with no hit always returns (Q0 = 1), so every lost plane was a hit
plane. Hence planes hit = 400 - 320 = **80**, of which 60 came home and **20 did not: 1 in 4**. The
survivors' own data shows **0 of 60** hit planes lost, because every hit plane you can inspect came home.

Verification (done twice): node vm over claims.json and an independent Python Newton solve both give
q = 0.85102 and p = 0.14898 from a = (.800, .080, .050, .010, .005, .005), matching the memo's printed
q = .851, p = .149; 400 x 0.95 = 380; 400 - 320 = 80; 20 / 80 = 0.25. The 400 / 380 / 20 / 320 / 32 / 20
figures and n = 5 are confirmed in two independent secondary readings of the memo (the CNA reprint text and
Casselman 2016). The 4 / 2 / 2 split is reconstructed from garbled fragments of the memo's quintic
(".200q^5 ... -.010q^2 -.005q ... .005") and is the split that reproduces q = .851; it is drawn only as
hole dots inside cells, never as a digit. Caveat for the builder: the primary PDF (DTIC AD-A091073) was not
reachable from this container (egress blocked); a human check of Part I, Table 1 is advised before ship.

Not used on screen: Ellenberg's per-square-foot table (engine 1.11, fuselage 1.73, fuel system 1.55, rest
1.8 in the book, quoted as 1.85 by some reviewers). Its provenance to SRG data is undocumented (Casselman
2016 finds "very little evidence for the best bits" of the legend), so it fails the truth bar. The armour
lesson is carried in words, not digits.

## The count structure
- **What is counted:** planes, one cell per plane, 400 cells on a 20 by 20 grid in the memo's own groups:
  rows 1-16 = 320 came home unhit (pale ink), rows 17-19 = 60 came home holed (ink, with 1 to 5 paper-coloured
  hole dots per the memo's 32 / 20 / 4 / 2 / 2), row 20 = 20 never came home (empty red-pencil outlines).
- **How many marks:** 400 (exact; no sampling, no shuffle needed; the order is reading order).
- **Against what the commit is placed:** the commit asks "Out of 100 planes hit, how many never came home?"
  The 80 hit planes (rows 17-20) are bracketed. The viewer's guess g becomes round(g x 80 / 100) cells,
  filled from the start of row 20 rightward (overflowing upward into row 19 if g > 25). Truth is all 20 cells
  of row 20. Read-out, in order: "YOU 8 of 80" / "TRUE 20 of 80", then "1 in 4" with "20 ÷ 80" beneath,
  then "YOU 10 in 100 · TRUE 25 in 100". Film default g = 10 (declared teaching default).

## The Monday question
"Before we copy our winners: who did the same thing and is not in this data?"
(Operationally: pull the churned customers / cancelled projects that did X, and count them next to the ones
that survived.)

## Honest-limits line
"Wald's 400 is a worked example in his memo, not a combat log; 'armour where the holes aren't' is the retelling."
Long form for the page: the numbers are the memo's illustrative example; the model assumes an unhit plane
always returns and every hit is equally dangerous; the engine-armour moral is Ellenberg's (2014) retelling,
with thin documentary evidence (Casselman 2016); the business mapping is an analogy, not data.

## Sources
1. Wald, A. (1943). *A Method of Estimating Plane Vulnerability Based on Damage of Survivors.* Statistical
   Research Group, Columbia University, for the Applied Mathematics Panel, NDRC. Reprinted as CRC 432, Center
   for Naval Analyses, Alexandria VA, July 1980 (DTIC AD-A091073). Part I, numerical example.
2. Mangel, M. and Samaniego, F. J. (1984). Abraham Wald's Work on Aircraft Survivability. *Journal of the
   American Statistical Association* 79(386), 259-267. doi:10.2307/2288257.
3. Ellenberg, J. (2014). *How Not to Be Wrong: The Power of Mathematical Thinking.* New York: Penguin Press.
   Introduction, "When Am I Going to Use This?".
4. Wallis, W. A. (1980). The Statistical Research Group, 1942-1945. *Journal of the American Statistical
   Association* 75(370), 320-330. doi:10.2307/2287451.
5. Casselman, B. (2016). The Legend of Abraham Wald. AMS Feature Column, June 2016.
   https://www.ams.org/publicoutreach/feature-column/fc-2016-06

## What this film is NOT
- Not a claim that Wald's 400 planes were a real mission, or that Wald drew a plane diagram.
- Not the per-square-foot hole table (engine vs fuselage); no digits from it appear.
- Not a claim about where the 20 lost planes were hit; we have no data on them, which is the point.
- Not base rates, the planning fallacy, or the AI agent loop (taken), and not regression to the mean.
- Not "never study winners": study them next to the losers that did the same thing.
- Not a statistics lecture: no q, no polynomial, no percentages before the 400 cells are counted.
- No plane silhouettes, icons, bullet-hole illustrations or hand-drawn figures (exec ink, Q6).
