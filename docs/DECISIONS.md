# Decisions

A dated log of the decisions that shape the plugin. Each entry names the decision, the reason it
was taken, and what it changes in the laws, the gates or the roadmap. BLUEPRINT.md and
MERGE-NOTES.md refer to the numbers here. Reverse a decision by adding a new dated entry, not
by editing an old one.

## 2026-10-08 · after the merge of the two explainer systems

The eight defaults the study took (docs/study/BLUEPRINT.md, "Decisions") were confirmed, and the
fifteen open questions were answered by Manu. The answers below are binding for commit two and
milestones M1 to M7.

### Confirmed defaults

| # | Decision | Changes |
|---|----------|---------|
| D1 | One runtime. The SVG episode engine becomes a renderer on the Atelier clock, not a sibling engine. | M1 splits the runtime; M3 ports the four episodes through an adapter with zero source edits. Acceptance: snapshots identical at forty times. |
| D2 | CETI dark on role tokens is the default look; cream, vermillion and ink is a named preset. | Token file carries both presets; the gate checks semantic roles only. |
| D3 | Page size is budgeted per tier: episode 110 KB of code, feature 260 KB, atelier 330 KB of code and 1.7 MB offline. | REQUIREMENTS.md is rewritten to the tier table in commit two; the single 110 KB rule is retired. |
| D4 | The noether harness and the sheaf family live in contrib/ and are not shipped. The operadic interview stays in the plugin. | Already done in commit one. |
| D5 | The truth veto outranks the craft juror. | G4 and the pedagogy seat; a vetoed film leaves the ranking whatever its score. |
| D6 | Three flagships, four reworks, three kernels kept without their films. | See D11. |
| D7 | The shipped seed is the first whose every headline number sits within half a standard deviation of expected, chosen before any frame is seen and logged. | G8 seed sweep; replaces the two contradictory seed rules. |
| D8 | Two repos. This one is the plugin; ceti-explainer-films holds built pages and renders under Git LFS, with a lock file of hashes here. | Commit two adds the lock file and the publish step; built pages stay out of this repo. |

### Answers to the fifteen questions

| # | Question | Decision | Changes |
|---|----------|----------|---------|
| Q1 | Talk over a film, or must it stand alone? | A film stands alone. Captions carry it. | See Q3. |
| Q2 | Which beat drops first when a Grasp exceeds four structures? | The transfer question. | Law: cap handling drops the transfer beat first, then nothing else without a written waiver. The honesty beat and both commits are never dropped automatically. |
| Q3 | Voice, music bed, or material sound? | Silent. Captions carry the film. | The audio gate row is removed from the acceptance bar. The score-to-WAV path stays in the runtime as an optional output, off by default, not gated. The MP4 ships without an audio track. |
| Q4 | Which room is first in line for a Grasp? | Executives who want money. | The first shipped Grasp targets the exec room; the Glance and Grasp levels are hardened before Wield. Natural frequencies are still shown (see Q14). |
| Q5 | Opt-in cohort counters? | Not for now. | No cohort instrumentation in the runtime. Revisit with Q12. |
| Q6 | How much sketch can an exec slide carry? | None. The exec level uses the ink material with no sketch texture. | Law: a film whose level profile is exec renders in ink; chromes with hand-drawn or physical texture are for the manager and engineer rooms. The level profile is a film-def v2 field. |
| Q7 | Which concept after the agent loop? | ROI and cost of delay. | The next film hardens the cost mark, the ledger kernel and the cost beat. It brings its own fixture (Q10). |
| Q8 | Brand card or the material's last image? | The material's final frame holds, then a short CETI brand card. | Every channel ends the same way; the brand line counts once in the channels gate (G7). |
| Q9 | Landscape or portrait basis? | Landscape 960 by 540. | No runtime change. Reel and LinkedIn video are projected from the same timeline through a safe-area layout; the legibility gate (G6) runs at the landscape basis. |
| Q10 | Canonical fixtures? | Each concept brings its own worked case. | The scaffold requires a fresh fixture per concept; the invoice trace and p = 0.95 stay with the agent-loop films. No shared default. |
| Q11 | How many materials ship? | Ink plus three flagships: Bunraku, The Run, and Marbling after its truth re-audit. | Ledger, Escapement and Exposure keep their kernels in library/materials but do not ship films. Delta and Margin stay as references. |
| Q12 | Run the two experiments on a real cohort? | Neither for now. | Milestone X is deferred. The quality bar is a design claim until it runs; the roadmap says so. The static-control row leaves the acceptance bar until then. |
| Q13 | Hold playback until a commit, given the MP4 cannot pause? | Hold on the page; timed guess with a countdown on the MP4 and reel. | One film, two behaviours, both gated: the page gate checks the hold, the render gate checks the countdown. The commit law stays hard. |
| Q14 | Counts before percentages for executives? | Counts first everywhere. | The count-first law stays universal; no level column in the law table. |
| Q15 | Transfer both repos to a CETI GitHub organization? | Open. | No change until the organization exists. |

### What this changes in the roadmap

- Commit two: tier table in REQUIREMENTS.md (D3); films lock file (D8); the audio row removed from
  gate.py and the acceptance bar (Q3); the level profile field in film-def v2 (Q6).
- M2 hardening: the cap-handling rule drops the transfer beat first (Q2); the ink-for-exec rule (Q6).
- M4: the commit hold and the timed countdown as two gated behaviours of one film (Q13); the brand
  card as the last chapter of every channel (Q8).
- M7: ink is the default material and the only one used at the exec level (Q6, Q11).
- F1 to F3 stand as planned (Q11). The first new concept after them is ROI and cost of delay (Q7).
- X is deferred (Q12). Q5 and Q15 stay open.

## 2026-10-08 · the exec-room gold standard

| # | Decision | Changes |
|---|----------|---------|
| D9 | "The Opera House" (Case file 23, the planning fallacy; films/opera-house) is the gold standard for the exec room and the feature tier. It already practises Q3, Q6, Q13 and Q14, its numbers recompute from two fitted parameters and seven sources, and its renderer is a pure function of time and state. | It enters the repo as sources that rebuild byte-identical (proof v). It is the known-good calibration fixture for the exec level: G1 to G5 and G8 must pass it; G6 must flag only its 11 to 12 unit sidebar and honest-limits text; G9 may flag only its between-chapter cards. Its "Tender Set" chrome is the first chrome of the default ink material (M7). The two changes it owes the bar are a CETI brand card after its last image (Q8) and a larger face for the honest-limits lines (G6). The two-minute Grasp cut (plan, commit, wall, where you sit) is the first derivative to build. |
