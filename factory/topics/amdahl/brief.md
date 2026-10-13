# amdahl · brief

Film id `amdahl` · concept: Amdahl's law (speeding up part of a process) · format: the 75-second case
(factory/FORMAT.md). Exec room. Silent; captions carry it.

## The exec question (one line)
"AI will make this 10× faster." Faster than what: the step, or the whole process the customer waits for?

## The belief to break
Speeding up a step N times speeds up the work about N times. It does not: the whole process gets faster
only by 1 ÷ ((1 − p) + p ÷ s), where p is the step's share of the elapsed time and s is the step's speed-up.
The hours you do not touch set a ceiling of 1 ÷ (1 − p), however fast the step gets.
- p = 0.5 (half the hours): never more than 2×, even at infinite speed.
- p = 0.8, s = 10: 1 ÷ (0.2 + 0.08) = 3.57×.
- The film's commit, p = 0.3 (30 of 100 hours), s = 10: 1 ÷ (0.7 + 0.03) = 100 ÷ 73 = 1.37×; ceiling 100 ÷ 70 = 1.43×.

## The one real case: IBM Credit (Hammer & Champy 1993)
IBM Credit Corporation financed the computers, software and services IBM sold. A request for financing
went through five steps in five departments (log the call; credit check; business practices modifies the
loan covenant; pricer sets the rate; a clerical group writes the quote letter).
- The book: the process "consumed six days on average, although it sometimes took as long as two weeks".
  A control desk added later made it longer: the remainder "now more than seven days on average".
  Davenport & Nohria (1994) give the same case as five business functions and seven days on average.
- Two senior managers walked one request through every desk, asking each to do it at once: the actual
  work took 90 minutes in total. The rest was "consumed by handing the form off from one department to the
  next".
- IBM did not speed up the 90 minutes. It replaced the specialists with one generalist "deal structurer"
  who handled a request end to end; turnaround fell from seven days to four hours (as widely reproduced
  from the book; see the verification note).
- Amdahl reading: make the 90 minutes instant and the request still takes 7 days less 90 minutes. Drawn at
  true scale against 7 working days of 8 hours (56 h, the conservative reading; on the calendar it is
  thinner still), the work is a 22.5-unit sliver of an 840-unit strip (2.7 %). The fix that worked attacked
  the other 97 %.

Source of the law: Amdahl (1967), AFIPS Spring Joint Computer Conference. The paper has no formula; it argues
in prose that "data management housekeeping", about 40 % of executed instructions in production runs, caps
what parallel hardware can deliver, so effort on parallel speed is "wasted unless it is accompanied by
achievements in sequential processing rates of very nearly the same magnitude". The algebra was written
down later. On screen the film credits "AMDAHL, 1967" at the ceiling, and nothing else from the paper.

Verification note (read before building): web fetch of primary texts was blocked in this container.
Confirmed through search snippets of the book's text (reproduced on course pages): six days average,
two weeks worst, two senior managers, 90 minutes of actual work, "now more than seven days on average",
handoffs consumed the rest. Confirmed from the SMR abstract: five business functions, seven days average.
The "four hours" result is consistent across secondary summaries ("7 days to 4 hours", 90 % cycle-time
reduction, hundredfold productivity) but the exact sentence was not seen in a primary scan; the book's
wording, as remembered, is "IBM Credit slashed its seven-day turnaround to four hours". The shipper should
spot-check p. 36 to 39 of the book if a copy is at hand. Vaughan (2020) is a critical reappraisal; it is why
the honest-limits line says the IBM numbers are the authors' account, not an audit.

## The count structure
- What is counted: hours of elapsed time in a constructed 10-step process (a teaching object, declared on
  the page), one mark per hour, 100 marks in one row, left (request in) to right (done).
- Steps (hours): intake 4 · queue 12 · check 6 · queue 10 · drafting 30 · queue 14 · review 6 · queue 10 ·
  sign-off 3 · send 5 = 100. Drafting (marks 32 to 61) is the step AI takes over. Four of the ten steps
  are queues, echoing the IBM case.
- The count: all 100 marks are tallied; drafting's 30 collapse to 3 (27 marks lift out, the rest of the row
  closes up); the 70 untouched marks are tallied again and stay; the row now ends at hour 73. Only then
  does the ratio appear: 100 ÷ 73 = 1.37×. Then drafting goes to zero: the row ends at hour 70,
  100 ÷ 70 = 1.43×, the ceiling.
- The committed number is placed on the same row as an hour: a viewer who said g× expects to be done at
  hour 100 ÷ g (default g = 4, hour 25). It is pinned against the promise (10×, hour 10) and the truth
  (1.37×, hour 73). Everything is on one axis of hours, so the gap is seen as distance, not as a percentage.

## The commit
"Drafting is 30 of the 100 hours. AI makes it 10× faster. How much faster is the whole process?"
Answer: 1.37× (100 ÷ 73). Film-mode default guess: 4×. Counts form (30 of 100), never "30 %", per Q14.

## The Monday question
"Of every 100 hours this process takes, how many does the AI actually touch?" (Then: the rest sets the limit;
if it touches half, never more than 2×.)

## The honest-limits line
"A teaching model, not IBM's numbers. Faster work can also shift the queues." (Amdahl holds the untouched
hours fixed; in real processes a faster step can shrink a queue, or just pile work up at the next desk.)

## Sources (full citations)
1. Amdahl, G. M. (1967). Validity of the single processor approach to achieving large scale computing
   capabilities. In AFIPS Conference Proceedings, Vol. 30, Spring Joint Computer Conference, Atlantic City,
   NJ, 18 to 20 April 1967, pp. 483 to 485. Washington, DC: Thompson Books. doi:10.1145/1465482.1465560.
2. Hammer, M., & Champy, J. (1993). Reengineering the Corporation: A Manifesto for Business Revolution.
   New York: HarperBusiness. Chapter 3, the IBM Credit Corporation case (pp. 36 to 39 in the first edition;
   page range to be spot-checked).
3. Davenport, T. H., & Nohria, N. (1994). Case management and the integration of labor. Sloan Management
   Review, 35(2), 11 to 23. (IBM Credit: five business functions, seven days on average.)
4. Hammer, M. (1990). Reengineering work: don't automate, obliterate. Harvard Business Review, 68(4),
   104 to 112. (Same pattern: an insurer's application spent 22 days in process and was worked on for
   17 minutes; Mutual Benefit Life's 30 steps, 5 departments, 19 people. Background only; not on screen.)
5. Gustafson, J. L. (1988). Reevaluating Amdahl's law. Communications of the ACM, 31(5), 532 to 533.
   doi:10.1145/42411.42415. (The counterpoint: if the work grows to fill the faster step, the limit moves.
   Background for the honest limits; not on screen.)
6. Vaughan, T. S. (2020). IBM Credit revisited. Journal of Applied Business and Economics (North American
   Business Press), articlegateway.com/index.php/JABE/article/view/3072. (Critical reappraisal; volume and
   pages not verified.)

## What this film is NOT
- Not about computer chips, cores or parallel programming; Amdahl is credited, not taught.
- Not anti-AI and not a forecast of any AI tool's speed-up; the 10× is the room's own claim, granted in full.
- Not a claim that your process looks like the 100-hour model or like IBM's; the model is a teaching object.
- Not queueing theory (utilisation and waits), not the Theory of Constraints, not Gustafson's scaled
  speed-up; those are the honest limits, not the lesson.
- Not base rates, the planning fallacy or the AI agent loop (done elsewhere, Q10).
- Not a cost or ROI film: it counts hours of elapsed time, not money or effort.
