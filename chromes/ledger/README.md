# D · The Ledger in Motion — Boardroom

**What it is.** An Isotype ledger for executives on the CETI panel ground. One pictogram is one fixed quantity: a
slip is a job of 40 invoices, an hourglass is a block of hours. Never scaled; jobs move whole, keeping identity
through optimal (crossing-free) Euclidean re-packing. The twin
worlds are one book kept twice: posted, then corrected. Every figure is counted from units. Type: Newsreader
and IBM Plex Sans Condensed, both with tabular figures.

**Files.** Films `shared.film.js` and `native.film.js`; shared code `ledger.kit.js`; `make.sh <shared|native>` builds into
`build/`; gates, sheets and MP4s are in `out/`.

## The ladder (revision 1)

**Glance (built).**
- *Shared, 35 s.* One ledger page of 100 2× job slips, 10 steps. Posted without checks: failures drop whole onto
  their step's line (68 clean; expected 60 dashed over the block). Then corrected with a check at every turn:
  rescued jobs are reversed back (93; expected 88.6), and each line's review cost is debited as hourglasses in the
  margin (969 h). The guess is pencilled on the block first.
- *Native, 28 s.* An average month, kept exactly: the 2,000 h claim leaves −6 h without checks; re-kept with
  checks (one simultaneous re-pack of all 100 units) it keeps 484 h. Then twelve real months scatter around those
  expectations. Break-even: 33 h per failure in all. One control: find-and-fix hours.

**Grasp (spec, about 2 min).** Opens with THE TRACE: one slip opened like a ledger entry, one labelled-sketch run
(`fetch_purchase_orders` … step 7 "Acme Corp" ≠ "ACME Corporation", the check folds the corner, retry by tax ID,
pass); it rejoins the 100. Honesty beats: correlated failure (one bad vendor file voids a column), review cost.

**Wield (built, shared live page).** One job opens into 40 invoices. Per-step reliabilities differ (sketch); the
outlines show where exceptions are expected. 5 checks of budget (10 toggles; extras ignored). Predict, one run,
then the stamps move to the riskiest five and every invoice re-packs at once. Expected 29.0 → 33.1; chance of 32+
19 % → 75 %.

**Master (spec).** Sliders for p, c, steps, a per-step reliability editor; correlated-failure switch; ROI page
seeded with the viewer's own hours; transfer: 10 steps at 99 % (0.904) or 20 at 97 % (0.544)?

## Known weaknesses

- **Native units are 1×** (the page shares the frame with the year strip); the shared film is 2×.
- **The Wield run at seed 1 is an unlucky draw** (22 → 24); the lesson rides on the expected line crossing the target.
- **Ten toggles** make the live panel long.
- **Hours are sketch;** the native verdict hinges on the fix cost.
