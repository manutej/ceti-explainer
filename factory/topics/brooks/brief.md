# Brooks' Law · topic brief · film id `brooks`

## The exec question (one line)
"We're behind, so we doubled the team." Why does that so often make the date worse, not better?

## The belief to break
People and months trade evenly: twice the team, about half the remaining time. Hidden inside it is a
second belief the film actually breaks: that the work of keeping a team in step grows in line with the
headcount. It does not. Every pair of people is a path that has to be kept in sync, and pairs grow as
n(n−1)/2: double 5 people to 10 and the paths go from 10 to 45, more than four times as many.

## The one real case, with its numbers and where they come from
Fred Brooks's own account of IBM's OS/360, in *The Mythical Man-Month* (1975), plus the worked
arithmetic he gives in the same book. Everything below is checked against quoted passages of the book
(search-verified excerpts, 2026-10-08; this container could not open a full text, so page numbers are
not given; chapters are).

| on screen | figure | where in the book |
|---|---|---|
| 1964 | "When in 1964 I became manager of Operating System/360" | Preface to the first edition |
| 1,000+ | "At the peak over 1000 people were working on it" (programmers, writers, operators, clerks, secretaries, managers, support groups) | Ch. 3, The Surgical Team |
| 5,000 / 1963–1966 | "From 1963 through 1966 probably 5000 man-years went into its design, construction, and documentation" | Ch. 3 |
| n(n−1)/2 | "If each part of the task must be separately coordinated with each other part, the effort increases as n(n−1)/2" | Ch. 2, The Mythical Man-Month |
| the law | "Oversimplifying outrageously, we state Brooks's Law: Adding manpower to a late software project makes it later." | Ch. 2 |
| 12 / 3 / 4 | a task "estimated at 12 man-months and assigned to three men for four months", mileposts at the end of each month | Ch. 2 (Fig. 2.5) |
| month 2 | "the first milepost is not reached until two months have elapsed" | Ch. 2 (Fig. 2.6) |
| 9, 4½, +2 | "9 man-months of effort remain, and two months, so 4½ men will be needed. Add 2 men to the 3 assigned." | Ch. 2 |
| 3 man-months | two new men trained by one experienced man for a month: "3 man-months will have been devoted to work not in the original estimate" | Ch. 2 (Fig. 2.8) |
| 7, 5, 1 | "at the end of the third month, substantially more than 7 man-months of effort remain, and 5 trained people and one month are available" | Ch. 2 |
| verdict | "the product is just as late as if no one had been added" | Ch. 2 |

Honesty about the case (binding on the builder):
- The OS/360 figures are Brooks's scale figures; "probably 5000" is his estimate. Show "about 5,000"
  and "over 1,000", never bare round numbers as measurements.
- The 12-man-month example is Brooks's own worked arithmetic ("Let us consider an example"), not
  measured OS/360 data. Label it on screen as his worked example from Ch. 2.
- The popular story that "Brooks added programmers to OS/360 and it slipped further" is a secondary
  retelling (Wikipedia and blogs). No quoted passage of the book gives OS/360 headcount-added and
  months-slipped figures. The film must not state or imply them.
- 499,500 (pairs among 1,000 people) is our arithmetic on Brooks's peak figure, shown as possible
  pairs at 1,000, not as a measured communication load.

## The count structure
- What is counted: communication paths, one line between every pair of people. People are marks
  (filled dots) on a fixed ring of 20 slots; paths are straight lines between marks; a tally of short
  vertical ticks beside the ring adds one tick per path as each line lands.
- How many marks: 5 people and 10 paths in the hook; 10 people and 45 paths at the count's heart
  (35 new lines drawn one at a time); then 20 people and 190 paths (145 more, drawn person by person).
- The committed number is placed on the tally against the truth: the viewer guessed how many paths
  10 people have. A red-pencil bracket spans ticks 1..guess on the 45-tick tally; the default film
  guess is 20 (the "double it" answer), so 25 ticks sit beyond the bracket, which the viewer sees
  without being told a percentage. Counts first: "×2 people, ×4.5 paths" appears only after the
  45 ticks are down, with "10 ÷ 5" and "45 ÷ 10" beneath.

## The Monday question
"Before you add people: who trains them, and how does the work split again?"
(Brooks's three costs of a late add: training, repartitioning, and the new paths. The count makes the
third visible; the case shows the first.)

## Honest-limits line
"Paths count possible pairs, not meetings. Early, splittable work can take more people."
(Brooks himself: "oversimplifying outrageously"; 1995: still "the best zeroth-order approximation to the
truth". Abdel-Hamid and Madnick's simulations and McConnell 1999 find the law bites hardest late in a
project with tightly coupled work; added people early, or on cleanly partitioned work, can shorten it.)

## Sources (full citations)
1. Brooks, Frederick P., Jr. *The Mythical Man-Month: Essays on Software Engineering.* Reading, MA:
   Addison-Wesley, 1975. ISBN 0-201-00650-2. Preface (OS/360, 1964; 1964–65 design period); Ch. 2
   "The Mythical Man-Month" (n(n−1)/2; Brooks's Law; the 12-man-month example, Figs. 2.5–2.8); Ch. 3
   "The Surgical Team" (OS/360: over 1,000 people at peak; about 5,000 man-years 1963–1966).
2. Brooks, Frederick P., Jr. *The Mythical Man-Month: Essays on Software Engineering, Anniversary
   Edition.* Reading, MA: Addison-Wesley, 1995. ISBN 0-201-83595-9. Ch. 19 "The Mythical Man-Month
   after 20 Years" (Brooks's Law as "the best zeroth-order approximation to the truth"; on the
   Abdel-Hamid and Madnick model and repartitioning).
3. Abdel-Hamid, Tarek K., and Stuart E. Madnick. *Software Project Dynamics: An Integrated Approach.*
   Englewood Cliffs, NJ: Prentice Hall, 1991. ISBN 0-13-822040-9. (Simulation of when added staff
   lengthens or shortens a project.)
4. McConnell, Steve. "Brooks' Law Repealed?" *IEEE Software* 16, no. 6 (November/December 1999).
   (Argues the law holds mainly for projects already late and near the end.)

## What this film is NOT
- Not a claim that adding people always makes a project later (Brooks: "oversimplifying
  outrageously").
- Not a measured OS/360 slip: no "added N people, slipped M months" for OS/360 appears on screen.
- Not a model of real meeting load: paths are possible pairs; real teams have structure (Brooks's own
  remedy in Ch. 3 is the small "surgical team").
- Not about the planning fallacy, base rates or the AI agent loop (other films' fixtures).
- Not a headcount or hiring-cost calculator; no money figures, no percentages before the count.
- Not a team-size recommendation (no "keep teams under N").
