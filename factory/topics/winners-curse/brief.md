# The Winner's Curse · brief · film id `winners-curse`

## Exec question (one line)
We won the deal. Does winning mean we got a good price?

## The belief to break
"We won the deal, so we got a good price." Winning feels like proof of good judgement. When many
bidders estimate the same uncertain value, the winner is usually the one whose estimate was highest,
so winning picks out the biggest overestimate. The crowd can be right on average while the winner is
wrong almost every time.

## The one real case, with its numbers
**Capen, Clapp & Campbell (1971), three Atlantic Richfield engineers, named the winner's curse** from
sealed-bid oil lease sales. Numbers used on screen, as Thaler (1988) reports them from that paper:

| what | number | source |
|---|---|---|
| 1969 Alaska North Slope lease sale, winning bids summed | $900M | Thaler 1988, citing CCC 1971 |
| same sale, second-highest bids summed | $370M | Thaler 1988, citing CCC 1971 |
| gap / ratio (computed) | $530M / 2.4× (900 ÷ 370) | computed |
| Gulf of Mexico finding (words only, no digits on screen) | the Gulf "has paid off at something less than the local credit union" | CCC 1971 |

Reserve figures, NOT on screen: Thaler also reports that the winning bid was at least 4× the second bid
on 26 % of tracts and at least 2× on 77 %. Search excerpts did not settle which sale those tract counts
come from, so they stay off screen.

**Classroom replication (the jar):** Bazerman & Samuelson (1983) ran 48 sealed-bid auctions (12 Boston
University MBA classes, 4 auctions each) of jars worth **$8.00** each (pennies, nickels or paper clips).
The **average estimate was $5.13** (low), yet the **average winning bid was $10.01**, an **average loss to
the winner of $2.01**, and winners lost money in more than half the auctions. Correction to the seed
brief: Thaler 1988 describes the jar as a classroom exercise and *predicts* its outcome. The numbers
come from Bazerman & Samuelson, and $5.13 is the mean *estimate*, not the mean bid (some secondary
sources get this wrong).

Verification status: the primary 1971 paper (OnePetro) and the full PDFs were behind egress blocks in this
container. Every figure above was confirmed by two or more independent search excerpts (Thaler 1988
copies, Futility Closet, Kagel & Levin and course notes). The "credit union" wording has only one
excerpt behind it, so it is shown as a paraphrase without digits. The builder should re-read Thaler 1988
pp. 191–193 if network access allows.

## The count structure
- **What is counted:** guesses (estimates) and winners. 40 sealed-bid auctions × 10 bidders = **400 marks**
  on a $7M to $13M ruler around a **$10M** true-value line. Each bidder's estimate is
  `10 × (1 + 0.3 × (2u − 1))`, with u drawn from `mulberry32(1971)`. The highest estimate in each row
  wins and pays its own estimate.
- **The count the viewer sees, in this order:** auction 1 alone (5 of 10 high; the winner guessed
  $13.0M). Then 40 rows land, each winner in red. **198 of 400 guesses were high. 40 of 40 winners were
  high.** The average guess was **$10.0M**. The average winning price was **$12.4M**, or **+$2.4M**
  a deal (24 %, shown last, as 2.4 ÷ 10).
- **Placed against:** the viewer's committed number (an average winning price in $M; film default
  **$10.5M**) is drawn as an ink mark on the same ruler, against the $10M truth line and the $12.4M
  red average-win line.
- Theory check, for the try-it panel: E[winning estimate] = 10·(1 + 0.3·9/11) = $12.5M; the winner is
  above the truth unless all 10 guesses are low, so it is above in **1,023 of 1,024** auctions.
  Every seed we tried gave 40 of 40. The seed is 1971, the year of the paper, and was not chosen for its
  result.

## Monday question
"Before we celebrate the win: what was the second bid, and why were we higher?"

## Honest-limits line
"The 10 bidders here bid their raw guess. Real bidders shade their bids, and later studies of the same
lease sales dispute how badly the winners did."

## Sources
1. Capen, E. C., Clapp, R. V., & Campbell, W. M. (1971). Competitive Bidding in High-Risk Situations.
   *Journal of Petroleum Technology*, 23(6), 641–653. doi:10.2118/2993-PA
2. Thaler, R. H. (1988). Anomalies: The Winner's Curse. *Journal of Economic Perspectives*, 2(1), 191–202.
   doi:10.1257/jep.2.1.191
3. Bazerman, M. H., & Samuelson, W. F. (1983). I Won the Auction But Don't Want the Prize. *Journal of
   Conflict Resolution*, 27(4), 618–634. doi:10.1177/0022002783027004003
4. Hendricks, K., Porter, R. H., & Boudreau, B. (1987). Information, Returns, and Bidding Behavior in OCS
   Auctions: 1954–1969. *Journal of Industrial Economics*, 35(4), 517–542. (the limits line)
5. Kagel, J. H., & Levin, D. (2002). *Common Value Auctions and the Winner's Curse*. Princeton University
   Press. (background: the jar as the first experimental demonstration; common-value framing)

## What this film is NOT
- Not a claim that every winner overpays. It shows a tendency in **common-value** auctions, where the
  item is worth about the same to everyone and nobody knows that value exactly.
- Not about private-value purchases, where the asset really is worth more to us (synergies, a fit only
  we have). That is a different argument, and the film does not make it.
- Not bidding-strategy optimisation (no shading formula, no game theory on screen).
- Not base rates, the planning fallacy or the AI agent loop (already done).
- Not a claim about Capen's company's own results, nor a full audit of the 1950 to 1969 lease returns
  (Hendricks, Porter & Boudreau 1987 find a more mixed picture).
- No M&A statistics from outside these sources. The exec "deal" framing is an analogy, stated as one.
