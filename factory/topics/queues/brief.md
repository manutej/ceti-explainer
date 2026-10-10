# queues · Utilisation and waiting

Film id `queues`. Explorer brief, 2026-10-08. Numbers here are all in `claims.json` (29 claims, formulas
recomputed with node vm, 0 mismatches; the simulation recomputed a second time by an independent Python port).

## The exec question (one line)
"Everyone on my team is 90 % busy. Why is everything still late?"

## The belief to break
"Everyone is fully utilised, so we are efficient." The intuition is linear: 90 % busy should mean a bit
less than twice the wait of 50 % busy. It is not. For one desk with random arrivals and random job sizes
(M/M/1), the mean wait in the queue is ρ/(1−ρ) job-lengths:

| busy (ρ) | 50 % | 80 % | 90 % | 95 % |
|---|---:|---:|---:|---:|
| wait, in job-lengths | 1 | 4 | 9 | 19 |

The same number is the average count of jobs an arriving job finds ahead of it (in the system, by PASTA),
which is what lets the film show it as a count.

## The one real case
**The hospital that runs full.** Bagust, Place and Posnett (BMJ 1999) built a stochastic simulation of
emergency admissions in an English acute hospital. Abstract: risks become discernible when average bed
occupancy exceeds about **85 %**; at **90 %** or more an acute hospital can expect **regular bed shortages and
periodic bed crises**. Their conclusion: spare capacity is essential, not waste. The 85 % figure became the
planning benchmark quoted by the royal colleges and the NAO.
Then the real world: NHS England's KH03 return puts average occupancy of general and acute beds open
overnight at **92.0 % in Quarter 3 2022/23** (October to December 2022; revised figure, as quoted in the
Q3 2023/24 statistical press notice). Shown on screen as natural frequencies: 85, 90 and 92 of 100 beds full.

## The count
- **What is counted:** jobs found ahead. 100 arrivals come to each of two desks, in the same film-time
  rhythm (common random numbers, seed 3). Desk A is busy 5 hours in 10, desk B 9 in 10. When a job arrives,
  the jobs already at that desk (waiting or in service) are stacked above its column as marks.
- **How many marks:** desk A 99 marks in 100 columns (tallest 4, 42 arrivals walk straight in); desk B 837
  marks (tallest 19, only 4 walk straight in). Counters tick up live; the division (99 ÷ 100 ≈ 1;
  837 ÷ 100 = 8.4) appears only after both counts are complete (Q14).
- **What the viewer's number is placed against:** the viewer committed "how many job-lengths does a job
  wait at 90 % busy?" (anchor given: about 1 at 50 %). Their number is drawn as a horizontal line across desk
  B's 100 columns at that height, against this run's 8.4 (dotted) and the long-run 9; then the ladder
  1 / 4 / 9 / 19 lights on the same axis. Film-mode default guess: 2 (the linear intuition).
- The run is one seeded sample. Single runs at 90 % vary wildly (seeds 1 to 60 give totals from 137 to
  4,076); seed 3 is the first seed from 1 whose two totals both land within 10 % of the long run (100 and
  900). That selection rule is stated in claims.json and on the live page's honest-limits panel.

## The Monday question
"Which step in our work runs above 85 % busy, and how many jobs are waiting in front of it right now?"

## Honest-limits line
"Limit: one desk, random work. Steadier work waits less." (Kingman: the ρ/(1−ρ) factor is scaled by
arrival and job-size variability; perfectly regular jobs at 90 % wait 4.5 job-lengths, half of 9, and
the curve keeps its shape. Many parallel servers, like a ward of beds, push the cliff later but do not
remove it.)

## Sources (full citations)
1. Bagust A, Place M, Posnett JW. Dynamics of bed use in accommodating emergency admissions: stochastic
   simulation model. *BMJ* 1999;319(7203):155–158. doi:10.1136/bmj.319.7203.155. (85 %, 90 %, 1999.)
2. NHS England. Bed Availability and Occupancy Data – Overnight (KH03). Quarter 3 2023-24 Statistical
   Press Notice, February 2024: G&A overnight occupancy 91.6 % in Q3 2023/24 against 92.0 % in Q3 2022/23.
3. Kleinrock L. *Queueing Systems, Volume 1: Theory.* New York: Wiley, 1975. (M/M/1: Wq = ρ/(1−ρ)·S; mean
   number in system ρ/(1−ρ); arrivals see time averages.)
4. Kingman JFC. The single server queue in heavy traffic. *Proceedings of the Cambridge Philosophical
   Society* 1961;57:902–904. (Heavy-traffic wait ≈ ρ/(1−ρ) × (cₐ² + cₛ²)/2 × S.)
5. Reinertsen DG. *The Principles of Product Development Flow: Second Generation Lean Product Development.*
   Redondo Beach: Celeritas, 2009. Ch. 3 "Managing Queues" (from p. 53): queue size against capacity
   utilisation; reports product-development managers loading their processes above 98 %. (Context for the
   live page; no number from it is on the stage.)

Verification notes: Bagust's numbers and citation confirmed against two independent search readings of the
abstract (primary sites bmj.com, PubMed and PMC are blocked from this container; the abstract wording is
quoted from search extracts). The 92.0 % figure confirmed in two separate searches of the KH03 notice.
Kingman's DOI is not quoted because it could not be confirmed here.

## What this film is NOT
- Not a bed-planning model. Bagust is a many-bed simulation; the count is one desk. The case shows that
  the cliff is real in a famous system; the count shows why.
- Not "never run above 85 %". The right level depends on variability, the number of servers and the cost
  of delay; the film asks the question, it does not set the target.
- Not a claim that this run of 100 is typical of every run: one run at 90 % can land anywhere from about
  1 to 40 a job; the long-run average is 9.
- Not about people working harder or slacking: the jobs, the desk and its speed are identical in kind; only
  the share of busy time changes.
- Not the planning fallacy, base rates or the agent loop (already done), and not cost of delay (Q7's film),
  though it sets it up.
