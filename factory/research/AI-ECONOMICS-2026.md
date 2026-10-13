# AI economics 2024-2026: stories that flip when re-partitioned

Research lane, compiled 2026-10-10. Scope: which pooled AI-economics numbers change meaning under a second view.

## Read this first (provenance)
- Egress policy blocked direct fetches of epoch.ai, iea.org, sec.gov, arxiv.org, a16z.com, openrouter.ai, menlovc.com, hai.stanford.edu (HTTP 403 / ENOTFOUND). Every number below was read through WebSearch extractions, not from the primary page. URLs are the primary or best page the search surfaced; open them before any number goes on screen (law: every digit is a claim with a source).
- Grades: A = primary table or filing exists and the figure was returned consistently by more than one extraction; B = reputable secondary or a primary figure seen only once; C = estimate, blog, leak or conflicting sources.
- "(derived)" = my arithmetic from sourced inputs, not a published figure. Product names that appeared only in low-quality aggregators ("GPT-6", "Fable") are left out on purpose.
- Date of the news cycle: Q2 2026 earnings (Jul 2026) are the latest filings used.

---
## S1. Token prices fell ~10x/yr, yet spend and per-task cost rose (Jevons)
**Default assumption:** cheaper intelligence means a smaller AI bill.
**Pooled view (price at fixed capability):**

| Value | Unit | Date | Source |
|---|---|---|---|
| 10x per year cost fall at equal quality; $60 (GPT-3, 2021) to $0.06 (Llama 3.2 3B) | $/M tokens | Nov 2024 | https://a16z.com/llmflation-llm-inference-cost/ |
| >280x fall, GPT-3.5-level: ~$20 to ~$0.07 | $/M tokens | Nov 2022 to Oct 2024 | https://hai.stanford.edu/ai-index/2025-ai-index-report |
| 40x/yr (GPT-4-level on PhD science Qs); range 9x to 900x/yr by benchmark | x/yr | Mar 2025 | https://epoch.ai/data-insights/llm-inference-price-trends |
| 47% fall per quarter = 13x/yr for fixed performance since 2023; new SOTA levels 66%/qtr, two years on 32%/qtr (4.7x/yr) | %/qtr | published 22 Sep 2026 | https://epoch.ai/publications/the-plunging-price-of-thought |
| Enterprise gen-AI spend $1.7B, $11.5B, $37B (3.2x in 2025); apps $19B, infra ~$18B | $B | 2023, 2024, 2025 | https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/ |
| Google tokens/month 480T (May 2025) to 3.2 quadrillion (May 2026), 7x | tokens/mo | I/O 2025, I/O 2026 | https://x.com/Google/status/2056783102085640252 |

**Second view (by model tier and by task, not by token):**

| Value | Unit | Date | Source |
|---|---|---|---|
| GPT-4 8K list $30 in / $60 out | $/M tokens | Mar 2023 | https://pricepertoken.com (listing); OpenAI launch page |
| GPT-4o mini $0.15 / $0.60 (200x / 100x cheaper than GPT-4 list) (derived) | $/M tokens | 18 Jul 2024 | https://openrouter.ai/openai/gpt-4o-mini |
| GPT-5 $1.25 / $10 (24x / 6x cheaper than GPT-4) (derived) | $/M tokens | Aug 2025 | https://openai.com/api/pricing (via aggregators) |
| Top Claude tier $5 / $25 per M | $/M tokens | 2026 | https://www.anthropic.com/pricing |
| Frontier list price 81.3% below Mar 2023 level, Sep 2026 = ~5.3x in 3.5 yr = ~1.6x/yr (derived) | % | Sep 2026 | https://benchlm.ai/stats/llm-pricing |
| One frontier-model run of AA Intelligence Index: ~43,000 output tokens/task, ~37,000 reasoning; $3.69/task | tokens, $ | 2026 | https://www.tomshardware.com/tech-industry/artificial-intelligence/frontier-ai-faces-pricing-reckoning-as-token-volume-explodes-25-fold-mid-tier-models-deliver-90-percent-of-flagship-capability-at-one-sixth-the-cost |
| Reasoning models >50% of OpenRouter tokens by late 2025 (negligible in early 2025) | % tokens | 2025 | https://arxiv.org/html/2601.10088v1 |

**Reversal (one sentence):** the 13x/yr fall is the price of a fixed capability level, but buyers keep buying the newest tier (frontier list price only ~1.6x/yr cheaper) and each task burns tens of thousands of reasoning tokens, so tokens (7x) and dollars (3.2x) rise together.
**Honest limit:** Menlo's $37B is a US survey (~495 buyers, Nov 2025; Menlo is an investor in Anthropic) and excludes chips, cloud serving and AI embedded in other software; Google's tokens are self-reported, unaudited, include free consumer surfaces; token growth and dollar growth are different series; Epoch warns the fastest declines rest on under a year of data; the 3-18x/yr "cost to run the best model" claim is an unverified commentary.
**Data confidence:** A for the price series (Epoch, Stanford, a16z), B for Menlo and per-task cost, C for the frontier-list index.

---
## S2. Hyperscaler capex vs AI revenue ("$600B question") by company
**Default assumption:** capex is running years ahead of revenue; the gap is a bubble signal.
**Pooled view:**

| Value | Unit | Date | Source |
|---|---|---|---|
| Implied revenue gap ~$200B, then ~$600B (Sequoia, Cahn); later ~$840B reported | $B | Sep 2023, Jun 2024, 2025 | https://sequoiacap.com/article/ais-600b-question/ (not opened; via https://yespress.io/david-cahn) |
| Big-4 broad capex (cash + finance leases) ~154, ~250, ~409 (derived from Epoch quarterly table) | $B | 2023, 2024, 2025 | https://epoch.ai/data-insights/hyperscaler-capex-trend |
| Epoch: combined capex +72%/yr since Q2 2023; Q4 2025 $140.6B (AMZN 40.5, MSFT 36.2, GOOGL 28.5, META 22.5, ORCL 13.0); Q1 2026 $156.1B | $B/qtr | Q2 2023 to Q1 2026 | https://epoch.ai/data-insights/hyperscaler-capex-trend |
| 2026 guidance: AMZN ~$220B; GOOGL $195-205B; META $130-145B; MSFT ~$175-190B (sources conflict) | $B | Jul 2026 | https://www.sec.gov/Archives/edgar/data/0001652044/000165204426000066/googexhibit991q22026.htm |
| Cash capex expected to exceed operating cash flow in Q3 2026 (Epoch) | - | Feb 2026 | https://epoch.ai/data-insights/hyperscaler-capex-vs-cash-flow |

**Second view (by company: sellers of capacity vs users of capacity):**

| Company | Capex | Revenue / backlog evidence | Source |
|---|---|---|---|
| Alphabet | 2025 $91.4B; Q2-26 $44.9B; FCF -$5.9B | Cloud Q2-26 revenue $24.8B (+82%), op. income $8.8B (35.6% margin vs 20.7%), backlog ~$514B | https://www.sec.gov/Archives/edgar/data/0001652044/000165204426000071/goog-20260630.htm |
| Amazon | 2025 ~$128-131B; 2026 ~$220B (+$20B from memory prices); TTM FCF -$7.6B | AWS Q2-26 $42.2B (+36.7%), 39% margin, backlog $496B | https://finance.yahoo.com/markets/stocks/articles/amazon-raised-2026-capex-guide-114017457.html |
| Microsoft | FQ4-26 ~$41B incl. leases (+69%) | AI business >$37B run-rate (+123%, Mar qtr); Azure >$100B FY26 (+41%) | https://www.cnbc.com/2026/07/29/microsoft-msft-q4-earnings-report-2026.html |
| Meta | 2025 $72.2B; Q2-26 $31.1B (~98% of operating cash flow); FCF $0.78B | no cloud line; revenue +28% to $60.8B, EPS miss, stock -9.6% | https://finance.yahoo.com/markets/stocks/articles/meta-platforms-inc-meta-q2-050330313.html |
| Labs | Anthropic run-rate $65B (Jul 2026); OpenAI $40-70B (conflicting); OpenAI projected -$278B cumulative FCF 2026-30 | Anthropic books gross, OpenAI says net is ~$22B | https://www.axios.com/2026/08/17/anthropic-revenue-run-rate-ipo-openai |

**Reversal:** pooled, spend outruns revenue; by company, the three cloud sellers show accelerating revenue and ~$1.0T of combined backlog, while Meta has the same capex with no one to rent it to, so the "gap" belongs to different balance sheets.
**Honest limit:** backlog is a contract, not revenue, and its customer concentration (labs that are also investees: Amazon's ~$53B Anthropic revaluation gain, Microsoft's $3.2B) is undisclosed; capex definitions differ (cash vs finance leases, MSFT fiscal year; "capex" for Amazon includes retail); Alphabet/Amazon figures here come from earnings write-ups, 10-Q not opened; AI revenue is not separated by anyone except Microsoft.
**Data confidence:** A for capex and segment revenue (filings, Epoch), B for backlog, C for lab revenue.

---
## S3. Training vs inference share, and cost per query
**Default assumption:** AI is a training arms race; inference is the cheap part.
**Pooled view:**

| Value | Unit | Date | Source |
|---|---|---|---|
| Inference = 50% of AI compute in 2025, forecast 2/3 in 2026 | % compute | Nov 2025 | Deloitte forecast, via https://www.computerworld.com/article/4114579/ces-2026-ai-compute-sees-a-shift-from-training-to-inference.html |
| Inference spend $23.3B vs training $19B | $B | 2025 | Gartner, via CIO Dive (secondary) |
| OpenAI 2024 compute: ~$2B inference vs ~$5B R&D (training/research) | $B | 2024 | Epoch estimate, via https://optinest.de/ai-infrastructure/inference/token-economics/inference-vs-training-how-the-compute-split-is |
| OpenAI 2025 gross margin 33% (40% in 2024; plan 46%); Anthropic ~40% (plan 50%), inference 23% over plan | % | 2025 | The Information, via https://news.futunn.com/en/post/69235381/both-openai-and-anthropic-missed-their-gross-margin-targets-with |
| Anthropic plans ~$19B training + inference compute in 2026, about equal to revenue | $B | 2026 | https://www.forbes.com/sites/jonmarkman/2026/05/04/anthropics-900b-funding-round-set-to-surpass-openai/ |

**Reversal:** by market-wide spend, inference has overtaken training; by lab and year (OpenAI 2024), training still outweighed inference 2.5:1, and at the unit-economics level inference is what makes gross margin miss its plan.
**Honest limit:** one Deloitte forecast is quoted by every secondary source (not independent measurement); Gartner and Epoch lines are seen only in secondary articles; compute share, energy share (80-90% claimed for inference) and dollar share are different metrics; "cost per query" in dollars has no neutral published series (only per-task figures, see S1).
**Data confidence:** C (forecasts, leaks, single-origin).

---
## S4. Energy: Wh per query vs total data-centre demand vs the grid
**Default assumption:** AI's footprint is either negligible (a query is a few drops of water) or a grid emergency; one number should settle it.
**Per query:**

| Value | Unit | Date | Source |
|---|---|---|---|
| Median Gemini text prompt 0.24 Wh, 0.03 gCO2e, 0.26 mL water; 0.10 Wh counting chips only | per prompt | Aug 2025 | https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference |
| Same prompt, energy -33x and carbon -44x in 12 months | x | 2024-25 | same |
| ChatGPT GPT-4o query ~0.3 Wh (Epoch) vs 3 Wh older estimate (de Vries 2023: 4,000 in / 2,000 out tokens on A100); Altman 0.34 Wh | Wh | Feb / Jun 2025 | https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use |

**System and region:**

| Value | Unit | Date | Source |
|---|---|---|---|
| Global data centres 415 TWh = ~1.5% of world electricity; ~945 TWh (just under 3%) in 2030 base case; shares 2024: US 45%, China 25%, Europe 15% | TWh, % | 2024; 2030 | https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai |
| +530 TWh by 2030 is ~8% of projected global demand growth (Lift-Off case ~12%) | % | 2025 | https://www.carbonbrief.org/ai-five-charts-that-put-data-centre-energy-use-and-emissions-into-context |
| US data centres 176 TWh = 4.4% of US electricity (2023); 6.7-12% in 2028; 11.8% (9.5-15.3%) by 2030 | TWh, % | 2023; 2028; 2030 | https://eta-publications.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report |
| Data centres ~50% of US electricity-demand growth in 2025 vs 17% worldwide | % of growth | 2025 | https://fortune.com/2026/04/20/us-data-center-electricity-demand-public-opinion/ |
| Ireland data centres 5% (2015), 22% (2024, 6,969 GWh), 23% (2025, 7,663 GWh); all other users +2% | % of metered | 2015-2025 | https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/keyfindings/ |

**Reversal:** per query the cost fell ~10-33x and globally data centres are ~1.5% of power, but the same sector is half of US demand growth and 23% of Ireland's grid, so "small" and "huge" are both true depending on whether you divide by the query, the world or the local substation.
**Honest limit:** 0.24 Wh is a median text prompt (excludes image, video, long-context, agent runs; Google's market-based carbon is ~3x lower than location-based); IEA 945 TWh is all data centres, not AI alone; training energy is outside per-query numbers; Epoch's 0.3 Wh is an estimate, OpenAI has not published method.
**Data confidence:** A (Google paper, IEA, LBNL, CSO), B for Epoch/Altman per-query.

---
## S5. Who gets used: provider share, open vs closed, Chinese open models
**Default assumption:** the US closed labs own usage; open weights are a hobby tier.
**Three scoreboards for the same year:**

| Value | Unit | Date | Source |
|---|---|---|---|
| OpenRouter+a16z, >100T tokens: open-weight ~1/3 of tokens; Chinese open models 1.2% (late 2024) to ~30% peak weekly, ~13% average; roleplay >50% of open-weight tokens | % tokens | Nov 2024 - Nov 2025 | https://arxiv.org/html/2601.10088v1 |
| Menlo enterprise LLM API spend: Anthropic 40%, OpenAI 27%, Google 21% (OpenAI 50% and Anthropic 12% in 2023) | % of $ | Nov 2025 | https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/ |
| Menlo coding workloads: Anthropic 54%, OpenAI 21%; open-weight 11% of enterprise usage (19% a year earlier) | % | late 2025 | https://www.usecarly.com/blog/llm-market-share/ (secondary; unverified in Menlo) |
| Hugging Face downloads: Chinese developers 17.1% vs US 15.8% | % downloads | 2025 | https://hai.stanford.edu/assets/files/hai-digichina-issue-brief-beyond-deepseek-chinas-diverse-open-weight-ai-ecosystem-policy-implications.pdf |
| Chinese fine-tunes/derivatives 63% of new HF derivatives (Sep 2025); Qwen >40% of new derivatives vs Llama ~15% (Aug 2025) | % | 2025 | https://www.technologyreview.com/2026/02/12/1132811/whats-next-for-chinese-open-source-ai/ |
| Qwen ~2.05B HF downloads in 2026 vs Google ~418M, Meta ~227M | downloads | 2026 | https://www.chinadaily.com.cn/a/202608/16/WS6a8159d4a31073853ec5389c.html |

**Reversal:** on tokens, open models are about a third and China is surging; on enterprise dollars, open is about a tenth and a US closed lab leads; on downloads, China leads - one market, three different winners depending on whether you count tokens, dollars or files.
**Honest limit:** OpenRouter is a developer router, not the enterprise; Menlo is a survey and its author invests in Anthropic; downloads count CI pulls and derivatives, not users; Chinese-share peak vs average differ 2x; the Menlo open-share line is secondary.
**Data confidence:** B (published studies, read through secondaries).

---
## S6. GPU supply: Nvidia volume vs rental price
**Default assumption:** chips follow the electronics curve: more supply, lower price, so compute gets cheaper every year.
**Pooled view:** Nvidia Data Center revenue FY2026 $193.7B (+68%; implies ~$115B in FY2025) of $215.9B total, fiscal year to 25 Jan 2026 (https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm); Q4 FY26 DC $62.3B (+75%); Q1 FY27 DC $75.2B (+92%); Q2 FY27 DC $89.0B (quarter to 26 Jul 2026) (https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000075/nvda-20260726.htm).
**Second view (rental price by year and contract type):**

| Value | Unit | Date | Source |
|---|---|---|---|
| H100 cloud ~$8/hr peak (2023), $1.50-3.00 by late 2025 | $/GPU-hr | 2023 to late 2025 | https://www.silicondata.com/blog/h100-price-spike ; https://coloprice.com/guides/h100-rental-prices/ |
| SemiAnalysis 1-yr H100 contract index low $1.70 (Oct 2025), $2.35 (Mar 2026), $2.10-2.70 (Apr 2026): +~40% off the trough | $/GPU-hr | 2025-26 | https://coloprice.com/guides/h100-rental-prices/ (quoting SemiAnalysis) |
| Spot $2.00 to $2.20 in four weeks | $/GPU-hr | Dec 2025 - Jan 2026 | https://www.silicondata.com/blog/h100-price-spike |
| BofA spot $2.77-2.80; cross-provider medians $2.99-3.38 | $/GPU-hr | Aug-Sep 2026 | https://akash.network/the-bid/h100-rental-price-2026-cost-per-hour/ |
| B200 $3.70-6.00 on neoclouds (median ~$6.11 in one index); ~$9.36 AWS capacity blocks | $/GPU-hr | 2026 | https://shattered.io/h100-h200-b200-cloud-gpu-pricing-2026/ |
| Epoch: hyperscaler capex +72%/yr, Amazon cites memory cost for +$20B | - | 2026 | https://epoch.ai/data-insights/hyperscaler-capex-trend |

**Reversal:** the price of an H100-hour fell ~75-80% from 2023 to the Oct 2025 trough and then rose ~40%, so "compute gets cheaper" holds per token (S1) but not per GPU-hour once demand (and memory prices) caught up.
**Honest limit:** the series mix spot, on-demand and 1-year contracts and neocloud vs hyperscaler prices; the $8 peak and the SemiAnalysis index values are secondary (index itself paywalled); B200 data are thin and conflicting; no public unit-shipment table was found, only Nvidia revenue.
**Data confidence:** A for Nvidia revenue (10-K), B/C for rental series.

---
## S7a. AI is 4% of GDP but 92% of growth (until you net out imports)
**Default assumption:** the US economy grew on AI investment alone.

| Value | Unit | Date | Source |
|---|---|---|---|
| Information-processing equipment and software = ~4% of GDP, ~92% of H1-2025 GDP growth; GDP excluding it +0.1% annualised | %, % | H1 2025 (posted 27 Sep 2025) | https://x.com/jasonfurman/status/1971995367202775284 |
| Tedeschi: net of imports, ~0.24 pp of the 1.6% annualised growth = ~15% (derived) | pp | Oct 2025 | https://www.techmeme.com/251008/p13 |

**Reversal:** gross of imports it is 92% of growth, net of imports ~15%, because much of the hardware is built abroad.
**Honest limit:** Furman says 0.1% is not a counterfactual (lower rates and power prices would have lifted other sectors); the category includes non-AI software and equipment; two quarters only.
**Data confidence:** B (BEA data, economist arithmetic, social-media origin).

## S7b. Revenue ranking flips with the accounting
**Default assumption:** a run-rate is a run-rate.

| Value | Unit | Date | Source |
|---|---|---|---|
| Anthropic run-rate $65B end Jul 2026, ~$25B above OpenAI; Q2-26 revenue >$11.5B | $B | Aug 2026 | https://www.axios.com/2026/08/17/anthropic-revenue-run-rate-ipo-openai |
| OpenAI says Anthropic books gross end-customer spend through AWS/Google/Azure and expenses the partner share; net would be ~$22B | $B | 2026 | https://finance.yahoo.com/technology/ai/articles/anthropic-run-rate-hits-65-032555081.html |
| OpenAI ARR: $40B (Aug), ~$70B (Sep, unconfirmed), $50B (Oct, Axios) | $B | 2026 | https://valueaddvc.com/blog/openai-revenue-2026-20b-arr-4b-month-path-to-profitability |

**Reversal:** the lab ranking depends on gross vs net revenue and on run-rate vs recognised revenue. **Limit:** no audited figure; one party is disputing the other. **Confidence:** C. Present both labs neutrally.

## S7c. "Everyone uses AI" vs one firm in five
**Default assumption:** AI is mainstream across business.

| Value | Unit | Date | Source |
|---|---|---|---|
| Firms using AI ~18% (end 2025), 19.8% (early May 2026); 20-23% expect to within six months | % firms | 2025-26 | https://www.census.gov/library/stories/2026/05/ai-use-businesses.html |
| Firms with 250+ employees 37% vs under 20% for 1-4 employees; 50-60% of very large firms in information, professional services, finance (60-70% employment-weighted) | % | May 2026 | same; https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf |

**Reversal:** by firm count AI use is one in five; by employees in large finance and information firms it is 60-70%. **Limit:** Nov 2025 question wording broadened, so the 2025-to-2026 rise is not like-for-like. **Confidence:** A (Census BTOS).

---
## Ranked shortlist (most verifiable numbers x sharpest reversal)
1. **S1 Price down, spend up** - three primary price series (Epoch, Stanford, a16z) plus Menlo dollars; reversal is by tier and per task. Best for "counts before ratios": tokens first, then price, then tier.
2. **S4 Energy per query vs grid** - Google paper, IEA, LBNL, Irish CSO are all primary; the reversal is by region (1.5% world, ~50% of US growth, 23% Ireland).
3. **S2 Capex vs revenue by company** - filings and Epoch's table; reversal by company (cloud sellers with backlog vs Meta) and by cash flow (FCF turned negative at Alphabet, Amazon).
4. **S5 Open vs closed, three scoreboards** - tokens (OpenRouter), dollars (Menlo), downloads (HF/ATOM); sharpest "same market, different winner", but B-grade and needs the Menlo/OpenRouter sample limits on screen.
Alternates: S7a Furman (92% to ~15%, clean arithmetic, macro rather than business), S6 GPU rental (+40% off trough, series conflict).
