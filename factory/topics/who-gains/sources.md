# who-gains · sources and verification log

Egress: WebFetch refused every host (metr.org, www.nber.org, economics.mit.edu, mitsloan.mit.edu: getaddrinfo ENOTFOUND);
curl via the agent proxy: CONNECT 403 (organisation policy), not retried. Method: WebSearch (extended), result text that
names the URL. Date of reading: 2026-10-10. "seen" = the number appeared in result text for that URL; no table opened.

| tag | citation | URL |
|---|---|---|
| S1 | Brynjolfsson, Li & Raymond, Generative AI at Work. NBER WP 31161 (2023); QJE 140(2):889-942 (2025) | https://www.nber.org/papers/w31161 ; https://academic.oup.com/qje/article/140/2/889/7990658 |
| S2 | Cui, Demirer, Jaffe, Musolff, Peng, Salz. The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers. Management Science (2026) | https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535 ; https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf |
| S3 | Becker et al. (METR). Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity, 10 Jul 2025; arXiv 2507.09089 | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ ; https://arxiv.org/abs/2507.09089 |
| S4 | METR. We are Changing our Developer Productivity Experiment Design, 24 Feb 2026 | https://metr.org/blog/2026-02-24-uplift-update/ |
| S5 | MIT Sloan Ideas Made to Matter. How generative AI affects highly skilled workers (secondary) | https://mitsloan.mit.edu/ideas-made-to-matter/how-generative-ai-affects-highly-skilled-workers |

## Grade per claim (A primary publisher named, number seen; B secondary or approximation; C conflicting or unconfirmed)
| claim id | value | grade | what was seen | on screen |
|---|---|---|---|---|
| agents | 5,179 | A | NBER w31161 abstract text; QJE abstract says 5,172 | yes |
| poolAgents | 14 % | A | NBER abstract; QJE says 15 % | yes |
| novice | 34 % | A | NBER abstract "34 % ... novice and low-skilled"; 0.29 log points; earlier version 35 % | yes |
| expertAgents | about 0 | B | "minimal impact on experienced and highly skilled"; "no productivity increase" top quintile (point estimate not read) | yes, as words and 0 |
| nQ, nMid | 1,036 / 3,107 | B | derived from 5,179 with equal quintiles | optional |
| midGain | 12 (height only) | B approx | derived (5*14-34-0)/3; the middle quintiles themselves were not found | no digit |
| devs | 4,867 | A | S2 abstract and Microsoft Research page | yes |
| poolDevs | 26.08 % (SE 10.3) | A | S2 abstract; paper notes each experiment is noisy | yes, as 26 % |
| juniorRange, seniorRange | 27-39 %, 8-13 % | C | only the MIT Sloan summary; not in paper excerpts returned | no |
| metrDevs, metrIssues | 16, 246 | A | arXiv abstract and METR blog | yes |
| forecast, believedAfter | 24 %, 20 % | A | arXiv abstract | yes |
| slower | 19 % (CI +2 to +39) | A (CI B) | arXiv abstract, METR blog; CI from research file and one secondary report | 19 yes, CI no |
| econForecast | 39 %, 38 % shorter | B | METR paper statement relayed by a news summary | no |
| fuReturning, fuNew | -18, -4 (CI -38..+9, -15..+9) | C | secondary coverage disagrees on the sign reading; METR calls the data very weak evidence | no |
| fuWithhold | 30-50 % | B | METR text as quoted by a secondary source | no |

Discrepancies recorded: sample 5,179 (NBER) vs 5,172 (QJE); average 14 % vs 15 %; lowest quintile 34 % vs 35 % vs 36 %
across versions; Feb 2026 METR numbers read with opposite signs in secondary coverage. Re-read the primaries when egress allows
(S1 Fig. by skill quintile; S2 tenure/seniority table and per-experiment n; S4 results table).
