# Cost of delay · topic brief (film id `cost-of-delay`)

## The exec question
"We'll start with the biggest project; the small ones can wait." What does that waiting actually cost?

## The belief to break
Waiting is free: a feature that is not started yet costs nothing, so order work by size (biggest first,
because it matters most; or cheapest first, to clear the decks). In fact every unshipped feature loses its
value every month it is not live, and the order alone changes the bill. Both size-based instincts cost the
same here, and both lose to "most value per month of work first".

## The one real case (CASE beat)
Maersk Line, the container shipping company, ran a Cost of Delay programme across a portfolio of about
$100 million (Arnold & Yüce 2013). One feature, traced end to end:

| figure | value | source |
|---|---|---|
| hands-on work (development and test) | about 82 hours | Arnold, "Cost of Delay" (S3) |
| idea to launch | 46 weeks | S3 |
| of which waiting in queues | over 38 weeks | S3 |
| its cost of delay | more than $200,000 per week | S3 |
| what the queues cost | "nearly $8m in lost revenue" | S3 |
| on-screen check | 38 × $200k = $7.6M (a floor, since both are "more than") | arithmetic |

Context, chrome only, not a result: before October 2010 it took on average 150 days to get value out of
Maersk Line's pipeline, and 24 % of requirements took over a year (S2, S4). Portfolio ≈ $100M (S2 abstract).

Verification note: the publisher pages (IEEE Xplore, blackswanfarming.com, ResearchGate) are blocked by this
container's egress proxy. Every figure above was confirmed twice through independent search passes that
quoted the primary pages, in matching words (e.g. "the 38 weeks that this opportunity spent waiting in various
queues cost the organisation nearly $8m in lost revenue"; "more than $200,000 per week"). One secondary
article gives 106 hours instead of 82; we use the primary page's 82. The 38 waiting weeks are drawn grouped
in one run; the source does not give their calendar order, and the film must not imply it.

## The teaching object (declared, stated values, not data)
Three features, one team, one at a time; each earns its value only from the month after it ships; a feature
that is still unshipped at the end of a month has lost that month's value.

| feature | value per month (its cost of delay) | months of work | CD3 = value ÷ months |
|---|---:|---:|---:|
| A | £200k | 3 | 66.7, shown 67 |
| B | £100k | 1 | 100 |
| C | £50k | 2 | 25 |

Total delay cost of an order = Σ (value per month × month it ships). All six orders, computed twice
(closed form and by counting marks month by month; both agree):

| order | ships at (months) | total | marks of £50k | marks per month column (m1..m6) |
|---|---|---:|---:|---|
| A C B · **biggest first** (by months of work) | A 3, C 5, B 6 | £1,450k | 29 | 7 7 7 3 3 2 |
| B C A · **cheapest first** | B 1, C 3, A 6 | £1,450k | 29 | 7 5 5 4 4 4 |
| B A C · **CD3 / WSJF** | B 1, A 4, C 6 | **£1,200k** | **24** | 7 5 5 5 1 1 |
| A B C · highest value first | A 3, B 4, C 6 | £1,300k | 26 | 7 7 7 3 1 1 |
| C B A | C 2, B 3, A 6 | £1,600k | 32 | 7 7 6 4 4 4 |
| C A B | C 2, A 5, B 6 | £1,700k | 34 | 7 7 6 6 6 2 |

The film shows only the first three. Both size instincts land on exactly 29 marks; CD3 saves 5 marks =
£250k with the same work and the same team. "Highest value first" (26) is closer but still not best;
it is in the try-it panel, not the film. CD3 order is optimal for one server with linear delay costs
(Smith 1956, S5), which is the case here.

## The count structure
- **What is counted:** marks of £50k of value not yet earned, one per unshipped £50k-per-month of value per
  month. A drops 4 marks per month until it ships, B drops 2, C drops 1. Months are the six columns; the
  features are bars on those columns.
- **How many marks:** 29 for biggest first, 29 for cheapest first, 24 for CD3 order (82 marks drawn in
  all). In the CASE, 38 weekly marks of $200k for Maersk.
- **The viewer's number** (sealed in COMMIT, in £k, for the hook's plan, biggest first) is pinned on the
  tally row at guess ÷ 50 marks, against the 29 counted marks (£1,450k), then against 24 (£1,200k).
  Film-mode default guess: £500k (a stand-in answer, not data).

## The Monday question
"What does one month of delay cost, for each item on our list?" (Then: divide by how long each takes, and
do the highest first.)

## Honest-limits line
"Teaching numbers. Real cost of delay is an estimate, not a fact." (Brief-level detail: real delay costs are
rarely a flat line per month; WSJF is exactly optimal only for one team doing one item at a time with
roughly linear costs; Maersk's $200k a week is the company's own estimate, not audited revenue.)

## Sources
- **S1** Reinertsen, Donald G. *The Principles of Product Development Flow: Second Generation Lean Product
  Development.* Redondo Beach, CA: Celeritas Publishing, 2009. ISBN 978-1-935401-00-1. Ch. 2 "The Economic
  View": "If you only quantify one thing, quantify the cost of delay"; Weighted Shortest Job First,
  cost of delay ÷ duration (pp. 191–198 as cited by secondary sources; chapter number to be checked
  against a printed copy).
- **S2** Arnold, Joshua J., and Özlem Yüce. "Black Swan Farming Using Cost of Delay: Discover, Nurture and
  Speed Up Delivery of Value." *Proceedings of the Agile Conference 2013 (AGILE 2013)*, Nashville, TN,
  IEEE, pp. 101–116. doi:10.1109/AGILE.2013.16. Maersk Line, ~$100M portfolio; CD3 = cost of delay
  divided by duration.
- **S3** Arnold, Joshua J. "Cost of Delay." Black Swan Farming, https://blackswanfarming.com/cost-of-delay/
  (checked 2026-10-08 via search): the Maersk feature, 82 hours, 46 weeks, 38 weeks in queues,
  > $200,000 per week, nearly $8m.
- **S4** Arnold, Joshua J., and Özlem Yüce. "Black Swan Farming using Cost of Delay" (authors' repost),
  https://blackswanfarming.com/black-swan-farming-using-cost-of-delay/ : 150 days average, 24 % over a year.
- **S5** Smith, Wayne E. "Various optimizers for single-stage production." *Naval Research Logistics
  Quarterly* 3, no. 1–2 (1956): 59–66. doi:10.1002/nav.3800030106. Ratio rule: sequencing by weight ÷
  processing time minimises total weighted completion time (the maths under WSJF).

## What this film is NOT
- Not SAFe's WSJF scoring (relative Fibonacci points for business value, time criticality, risk); it uses
  money per month and months, as Reinertsen and Arnold do.
- Not a claim that Maersk's results generalise, nor a report of Maersk's later cycle-time gains (secondary
  sources disagree; we show none).
- Not ROI or NPV: no discounting, no build cost, no capacity planning, no parallel teams.
- Not about urgency profiles (deadlines, decaying windows); every delay cost here is a flat line.
- Not base rates, the planning fallacy, or the AI agent loop.
- Not "always do the small things first": cheapest first costs exactly as much as biggest first here.
