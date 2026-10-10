# 05 — Evaluating generative visual work (ceti-p5-studio eval lane)

Date: 2026-10-05. Scope: how to judge a p5.js sketch — computationally, by seed-sweep, by cliché-distance, and by independent model judges — so the studio can push each piece toward *stunning and original* rather than *competent and common*.

The one-sentence thesis from the literature: **no computed metric predicts "good"; computed metrics are cheap, reliable gates for "broken" and "generic", ranking is far more trustworthy than scoring (for both humans and VLMs), and disagreement between judges is signal, not noise to be averaged away.**

---

## 1. Proposed EVAL STACK for a single sketch

Six layers, run in order. Each layer can veto or annotate; nothing below layer (a) can be skipped because the layer above passed.

### (a) Mechanical gates (hard pass/fail — run first, cost ≈ 0)

| Gate | Check | How |
|---|---|---|
| Runs | Sketch loads in headless Chromium (Playwright/Puppeteer), `setup()` + ≥120 frames of `draw()` complete | page.evaluate on `frameCount` |
| No console errors | zero `error` level console events; warnings logged | page.on('console') |
| Deterministic under seed | `randomSeed(s); noiseSeed(s)` → two renders at same seed are pixel-identical (or PSNR > 50 dB if float-blending); different seeds are not identical | compare PNGs with numpy |
| No wall-clock leakage | `Date.now`/`millis()` must not feed geometry unless the sketch is declared "live" | static grep + render twice with 2s gap |
| FPS budget | median frame time ≤ 16.7 ms (60fps) or declared budget; p95 ≤ 2× median; no monotonic frame-time growth over 600 frames (leak) | `performance.now()` per frame |
| Canvas sanity | not blank (std of luminance > 2/255), not saturated (<1% pure black AND <1% pure white unless declared), no NaN pixels | numpy |
| Resolution independence | render at 1× and 2× `pixelDensity`; structural similarity (SSIM on downsampled 2×) > 0.9 | scikit-image `structural_similarity` |
| Size/ethics | no external network calls; no fonts/images loaded from unknown origins | network log |

A failure here ends evaluation with a repair ticket. Determinism is non-negotiable because every later layer samples seeds.

### (b) Computed image metrics (from PNG renders; numpy / PIL / scikit-image)

Targets below are *bands that flag trouble*, not scores to maximize. Evidence (see §2) says these measures correlate with preference only weakly and dataset-dependently; the studio uses them as **plausibility corridors and regression detectors**, never as a fitness function (McCormack & Gambardella's explicit warning — see fetch log).

| Metric | Implementation sketch | Suggested band | What it catches | Caveat |
|---|---|---|---|---|
| **Compression ratio** (Kolmogorov proxy; Machado-Cardoso `C_mc`) | `len(png_bytes)/(w*h*3)` and JPEG-q75 ratio; also `RMS error × compressed size` per Machado-Cardoso | PNG ratio 0.05–0.45; JPEG q75 ratio 0.01–0.12 | Flat/empty (too low) vs. noise-storm (too high) | Dataset-dependent; strongest correlate on morphogenetic imagery (r≈0.87) but not line drawings. Lossy (JPEG) orders images differently from lossless (PNG) — Rigau et al. |
| **Birkhoff-style order ratio** `M_K = (N·H_rgb − K)/(N·H_rgb)` | H_rgb = Shannon entropy of color histogram; K = compressed byte length × 8 | 0.3–0.8 | Pure randomness (→0) and dead flatness (→1) | Birkhoff's O/C is historically validated only on the extremes (Mondrian high, Pollock low). Treat as a 1-D "where on the order–chaos axis" coordinate, not quality. |
| **Shannon entropy** of luminance histogram (and of 8×8 blocks' mean, for spatial entropy) | `skimage.measure.shannon_entropy` | 4.0–7.5 bits (8-bit lum) | Posterised or washed images | Entropy is palette-invariant to arrangement; pair with spatial measures. |
| **Edge density** | Canny (σ=1.5) edge pixels / total | 0.02–0.20 | Blur mush (low), scribble noise (high) | Scale-dependent; fix render size (e.g., 1024²). |
| **Fractal dimension** (box-count on Canny edges) | `np.log(N(L))` vs `np.log(1/L)` slope over L ∈ {2..128} | 1.3–1.6 flagged "likely pleasant"; <1.15 or >1.8 flagged for review | Over-regular or over-busy structure | Spehar/Taylor preference peak 1.3–1.5 (n=220, natural/math/Pollock). McCormack et al. found fractal measures the *worst* predictors for computer-generated art. Use as a prior for edge-rich work only. |
| **Colorfulness** (Hasler & Süsstrunk) | `rg=R−G; yb=(R+G)/2−B; M = sqrt(σ_rg²+σ_yb²) + 0.3·sqrt(μ_rg²+μ_yb²)` | 15–110 (0–255 scale); ≤15 is near-mono (fine if declared) | Garish or muddy palettes | Calibrated on photos; abstract work legitimately exceeds the band. Combine with chroma stats in OKLCH. |
| **OKLCH palette stats** | Convert sRGB→OKLab (Björn Ottosson matrices, ~20 lines numpy); k-means k=6 in OKLab; report hue circular spread, chroma mean/max, lightness range | L range ≥ 0.35; ≤ 2 hue clusters within 15° of each other unless monochrome; max chroma ≤ 0.30 unless declared neon | Palette with no value contrast; accidental near-duplicate hues; sRGB-clipped neon | OKLab is designed for perceptual uniformity; "harmony" rules (complementary/triadic) are heuristics, not laws. Report, don't score. |
| **Contrast / value structure** | RMS contrast of L; 5-bin L histogram (Albers-style "value map") | RMS ≥ 0.12; no single L bin > 85% unless declared | Mid-grey soup | Low-contrast minimalism is a valid intent → declared-intent overrides. |
| **Visual clutter** (Rosenholtz) | Subband Entropy: Laplacian-pyramid/wavelet subbands → entropy of coefficient histograms, summed; Feature Congestion: local covariance of color (Lab), orientation, contrast | SE 2.0–4.0 for "readable"; higher only for declared maximalism | Over-dense compositions the eye can't enter | Predicts search time / clutter perception, not beauty. Python ports exist (numpy/scipy). |
| **Symmetry score** | normalised correlation between image and its H-flip, V-flip, 180° rotation (on blurred L) | report; flag > 0.97 as "mirror cliché" and < 0.05 as "no structural axis" | Cheap mirror symmetry (a classic p5 cliché) | Symmetry can be the intent (mandalas). |
| **Visual balance / weight centroid** | saliency ≈ |∇L| + chroma; centroid (cx, cy); distance to nearest of Arnheim's 9 hotspots (center, thirds grid) | centroid within 0.12·diag of a hotspot; also report moment of inertia (spread) | Lopsided or dead-centre compositions | Jahanian et al. found center + thirds hotspots in real designs; it's a prior, not a rule. Rule of thirds has weak empirical support (Amirshahi et al.). |
| **Negative space ratio** | share of pixels within ±0.04 L and ±0.02 chroma of the dominant background cluster | 0.25–0.75 for most work | Wall-to-wall fill (a p5 "fill the canvas" tell) | Depends on background detection; expose the cluster for review. |
| **Dominant-frequency signature** | radial power spectrum slope (log-log) | −2.0 … −3.5 (natural-image-like) | Pure-noise texture (flat spectrum), pure-flat (steep) | Mostly a sanity probe. |

Implementation note: render at fixed 1024×1024 (and 2048 for print checks), sRGB PNG, no alpha. All metrics in one `metrics.py` returning a flat dict; store with seed and sketch hash. Bands are **initial priors to be re-fit** from the studio's own "stunning" vs "rejected" set after ~200 labelled renders.

### (c) Seed-sweep distribution metrics (the long-form standard)

Hobbs' standard for long-form generative art: *no hand-curation, bad outputs must be extremely rare, every output must have something new, and the set must read as one body of work.* Operationalise:

- Sample **N = 64 seeds** (minimum 32; 256 for release). Compute all (b) metrics per seed.
- **Failure rate**: fraction failing (a) or falling outside (b) bands → target **< 2%** at release (Hobbs' "extremely rare").
- **Dispersion** (variety): per-metric coefficient of variation, plus mean pairwise distance in DINOv2 (or CLIP-ViT-L) embedding space. Flag **mode collapse** if mean pairwise cosine similarity > 0.92 or effective dimension of the seed-embedding cloud < 8 (the homogenization study found collapsed generators use ~10 of 768 dims).
- **Coherence** (unity): mean embedding cosine to the sweep centroid > 0.70 and no seed further than 3 MAD from the centroid (an "alien" output breaks the series). Report the two farthest-from-centroid seeds for human eyes.
- **Worst-k gallery**: the 5 lowest-ranked seeds (by judge seat, §e) are shown first. The series is as good as its worst non-rare output.
- **Trait coverage** (if the sketch has declared traits): each trait value appears in ≥ 3 seeds; no trait combination exceeds 40% of outputs.
- **Boredom test**: contact sheet of 16 random seeds judged pairwise against a contact sheet of 16 other seeds of the *same* sketch; if the judge cannot tell them apart (> 45% "same") variety is insufficient.

### (d) Cliché-distance / novelty

Two complementary distances, both against a **curated cliché corpus** the studio maintains (≈300–1000 renders: flow fields with Perlin noise, mirrored mandalas, circle-packing on cream, rainbow HSB sweeps, random-walk dots, Lissajous, "generative blob" gradients, Truchet tiles, the Coding Train canon, top-of-OpenProcessing defaults, plus the studio's own past outputs):

- **Embedding novelty**: `d_nov = mean distance to k=5 nearest neighbours` in DINOv2-base (structure) and CLIP-ViT-L/14 (semantics/style) space. This is Lehman & Stanley's novelty-search sparseness measure applied in embedding space. Report both; flag if either kNN distance is in the lowest 20th percentile of corpus self-distances ("this is a known move").
- **Perceptual hash**: pHash/dHash (imagehash) Hamming distance to corpus — catches near-copies and template reuse cheaply; flag < 12 bits.
- **Code-level cliché lint** (p5-specific, free): regex/AST for `noise(x*0.01, y*0.01)` flow fields, `colorMode(HSB)` + `frameCount%360` hue cycling, `translate(width/2,height/2)` + rotational symmetry loops, `random(255)` fills, default `strokeWeight(1)` black on white, `background(220)` left in. Each hit is a flag with the cliché name, not a score.
- **Quality-diversity bookkeeping**: keep a MAP-Elites style archive keyed by 2–3 descriptors (e.g., edge density × colorfulness × negative space, binned 8×8×4). A new sketch earns "novelty credit" only if it lands in an empty or low-fitness cell. This is how the studio *illuminates* its own design space rather than refining one basin (McCormack's QD finding: the archive found more diverse and higher-quality phenotypes than the artist's manual search).
- **Novelty is necessary, not sufficient.** A sketch that is far from everything may be far because it is broken; novelty only counts after (a) and (b) pass.

### (e) Independent VLM judge seats (rubrics)

Design principles distilled from the 2025–2026 judge literature:

1. **Pairwise forced-choice, never Likert alone.** VLMs rank well and score badly (compression toward the middle; +1.7 to +2.0 over-scoring of bad items, −0.7 to −1.0 under-scoring of excellent ones). GenArena: pairwise lifted accuracy +20 pts and Krippendorff's α from 0.52 to 0.86 with no fine-tuning; pointwise tied 40% of the time where humans saw clear winners.
2. **Position-swap every pair**; accept a verdict only when both orders agree (GenArena "bidirectional consistency"). Position bias scales with the quality gap being small, so disagreement after swap is itself a "near-tie" signal.
3. **No ties allowed** (removes laziness bias). If the judge must tie, it writes which single attribute would break the tie.
4. **Independence**: judges never see other judges' outputs, never see the generator's reasoning or prompt, never see the code (except the Craft seat), never see computed metrics (except the Auditor seat). Blind the sketch title. Use at least two model families where possible (self-preference bias).
5. **Concrete-cue dimensions are reliable; emotional dimensions are not.** "MLLM as a UI Judge" found MLLMs track hierarchy/clarity/trust reasonably (±1 accuracy > 75%) but systematically underestimate "Interesting" and collapse to chance on subtle differences. So: the *Wonder* seat exists, but its verdict is weighted as advisory and must be confirmed by a human when it decides a release.
6. **Describe before judging** (Lerman step 1): every seat first writes 3 "statements of meaning" (what is striking), then answers. This reduces shortcut bias and produces usable critique text.
7. **Adversarial seat** whose job is to find the reason to reject; its silence is informative.

Seats (each is a separate call; each gets the same two PNGs A/B, or one PNG for the absolute seats, plus the declared intent line):

**Seat 1 — Composition & Form (Gestalt / Arnheim / Bertin)**
> You are a composition critic. Do not comment on colour or concept. First write three one-line statements of what is visually striking in each image. Then compare A and B on: (1) figure–ground clarity and where the eye enters; (2) hierarchy — is there a primary, secondary, tertiary read, or does everything shout equally; (3) use of negative space as an active element; (4) rhythm and interval — proximity, similarity, continuity, closure (Gestalt) used deliberately; (5) balance — visual weight distribution, and whether any symmetry is earned or merely mirrored; (6) edge handling — does the composition acknowledge the frame. Output: for each criterion, "A" or "B" plus ≤20 words of evidence visible in the pixels. Then one overall winner. No ties.

**Seat 2 — Colour (Albers / Itten / OKLCH)**
> You are a colour critic in the Albers tradition: colour is relational, judged by interaction, not by swatches. Describe each image's palette in words (hue families, value range, chroma). Then compare on: (1) value structure — are there distinct light/mid/dark masses, or a mid-tone soup; (2) one dominant + one accent, or an undifferentiated rainbow; (3) which Itten contrast is doing the work (hue, light–dark, cold–warm, complementary, simultaneous, saturation, extension) and whether it is handled; (4) does the palette look chosen by a person with taste or by `random()`; (5) is there any sRGB clipping / neon that reads as cheap. Output per criterion "A"/"B" + evidence; overall winner; no ties.

**Seat 3 — Craft & Technique (reads code + render)**
> You are a senior creative coder reviewing a p5.js sketch and its render. List the technical moves in the code (noise fields, packing, agents, shaders, typography, etc.). Judge: (1) is the technique executed with control — line quality, anti-aliasing, overlap handling, consistent stroke logic; (2) does the code show a *system* with parameters that interact, or a single trick; (3) is randomness shaped (distributions, constraints, rejection) or raw; (4) resolution/print readiness; (5) anything that reads as a tutorial artifact. Output: a list of specific defects with line numbers where possible, a craft grade 1–5 with one sentence of justification, and the single most valuable technical change.

**Seat 4 — Originality / Cliché Hunter (adversarial)**
> You are a jaded generative-art curator who has seen ten thousand Processing sketches. Your job is to find the reason this is *common*. Name the nearest well-known template or trope this resembles (flow field, mandala, circle packing, Truchet, Lissajous, random walk, blob gradient, "generative poster", "AI-wallpaper", etc.) and estimate how close it is (identical / variation / distant cousin / genuinely unfamiliar). Name any specific artist or widely circulated piece it recalls. Then state what, if anything, is a move you have *not* seen. Output: trope name, closeness, 2–3 sentences of evidence, and a verdict: REJECT-AS-CLICHÉ / BORDERLINE / PASSES. Be harsh; a PASS from you should be rare.

**Seat 5 — Wonder / Affect (advisory; human-confirmed)**
> You are an informed viewer with no technical knowledge. Look for 10 seconds, then write what you felt and what you kept looking at. Then answer: would you stop scrolling for this; would you put it on a wall; does it reward a second look (something discovered on return); does it have a mood or is it merely pleasant. Compare A vs B: which would you rather live with. No ties. Note: you are asked to be candid, not kind.

**Seat 6 — Intent Fit (Rams / Tufte / concept)**
> Here is the stated intent of the piece: «…». Judge only whether the image *achieves* that intent, in the Rams sense (as little design as possible; nothing that does not serve) and the Tufte sense (no chart-junk equivalents — ornament that adds no information or feeling). List elements that serve the intent and elements that are decoration. Compare A and B on fit; no ties.

**Seat 7 — Metric Auditor (sees computed metrics + render)**
> Here are computed image metrics for this render and their suggested bands: «json». Look at the image and state for each flagged metric whether the flag is a real problem or a false alarm given what you see (e.g., low colorfulness is fine for a declared monochrome). Output: for each flag, KEEP / DISMISS with one sentence.

Cross-checks baked in: the Cliché Hunter never sees Seat 4's kNN novelty number (so model and metric are independent witnesses to "common"); the Wonder seat never sees the code; all seats are called twice with A/B swapped.

### (f) Aggregation rules (do not average away disagreement)

- **Gates are vetoes.** Any (a) failure, a seed-sweep failure rate > 2%, or Cliché-Hunter REJECT (confirmed by kNN novelty in bottom quintile) blocks release regardless of other seats.
- **Pairwise verdicts → Bradley-Terry.** Keep a per-sketch Elo/BT rating per seat against the studio's reference ladder (10–20 anchor pieces spanning "tutorial default" to "exhibition-grade"). Report the **vector** of seat ratings, not a single mean.
- **Minimum over seats, not mean.** Release threshold is `min(seat ratings) ≥ anchor_"good"` for Seats 1–3 and 6, plus Seat 4 ≠ REJECT. A piece with brilliant colour and broken composition is not "average"; it is broken.
- **Disagreement is a finding.** If two seats differ by more than one anchor step, emit a `DISAGREEMENT` record naming both seats' evidence; this goes to the human (CritiqueCrew's coordinator "surfaces conflicts & trade-offs" rather than resolving them; multi-perspective found 20% more issues than a unified expert).
- **Swap-inconsistent pairs are near-ties**, not coin flips: record as 0.5 but flag "undecidable by model — human".
- **Wonder is advisory.** It can raise a piece to "candidate-stunning" but cannot on its own pass or fail; a human confirms any release where Wonder is the deciding seat.
- **Repeat for variance.** Run every seat 3× (temperature > 0); if self-agreement (repetition stability) < 0.8, the seat's verdict on that pair is discarded.
- **Never let the generator grade itself.** The model that wrote the sketch may be *one* seat (Craft), with a different model family in Seats 4 and 5 where possible; self-preference bias is documented.
- **Log everything with seed + code hash** so a repair can be measured as a delta, and so bands can be re-fit from the studio's own labelled history.

Minimum viable loop (cheap): (a) → (b) → 32-seed sweep → pHash/code-lint cliché check → Seats 4 + 1 + 2 pairwise against two anchors → human sees worst-5 seeds + disagreements.

---

## 2. Evidence table

| Metric / method | Source | What it predicts | Reliability caveat |
|---|---|---|---|
| Birkhoff M = O/C, informational variants M_H, M_K, M_S | Rigau, Feixas & Sbert 2007/2008 (Eurographics CAe) | Position on order↔randomness axis; separated Mondrian (M_S 0.53–0.74) from Pollock (−0.04–0.54) and van Gogh (≈0.01–0.05) | Validated only as style discriminators on a handful of paintings; no preference data; lossy vs lossless compressor changes ordering |
| Compression-based complexity (Machado-Cardoso C_mc; JPEG ratio × RMS error) | Machado & Cardoso 1998 "Computing Aesthetics"; Romero et al. 2012 | Strongest correlate with artist ratings on morphogenetic forms (r=0.873) | Dataset-dependent (0.565 on line drawings); 201-person survey found *no* significant link between perceived complexity and aesthetic value — McCormack & Gambardella 2022 |
| Fractal dimension D (box-count) | Spehar, Clifford, Newell & Taylor 2003 "Universal aesthetic of fractals"; Taylor et al. 2011 (PMC) | Preference peak D ≈ 1.3–1.5 across natural, mathematical, and Pollock stimuli; n=220 | Small per-condition n (12–16); fractal measures were the *worst* predictors of aesthetic value on computer-generated art in McCormack 2022; only D studied (not lacunarity) |
| Colorfulness M | Hasler & Süsstrunk 2003 (SPIE) | ~95% agreement with human colourfulness ranking on photos | Measures *amount* of colour, not quality; calibrated on natural photos |
| Visual clutter: Feature Congestion, Subband Entropy | Rosenholtz, Li & Nakano 2007 (J. Vision) | Visual search time / perceived clutter; SE grew from the observation that JPEG size tracks FC | Predicts attentional load, not beauty; MATLAB original, numpy ports exist |
| Visual balance / hotspots | Jahanian et al. 2015 (EI) | Saliency centroids of real designs cluster at Arnheim's 9 hotspots (centre dominant) | Descriptive prior from existing designs, not a scoring function; rule-of-thirds effect is weak in Amirshahi et al. 2014 |
| Novelty search (sparseness = mean kNN distance in behaviour space) | Lehman & Stanley 2011 "Abandoning Objectives" | Avoids deception/convergence; finds diverse solutions objectives miss | Needs a meaningful behaviour space; novelty alone can reward broken outputs |
| MAP-Elites / QD for art | McCormack & Gambardella 2022 "Quality-Diversity for Aesthetic Evolution" | Found more diverse *and* higher-quality phenotypes than the artist's manual search | Quality measure was artist-specific; CNN features reduced to 2-D descriptors |
| Embedding-space diversity (effective dimension, support radius) | "Measuring Aesthetic Homogenization in T2I" (Zenodo 2026) | Diversity collapse: within-prompt outputs use ~10/768 effective dims; cross-model cosine 0.86 vs 0.64 baseline | Measured on T2I models with CLIP/DINOv2; transfer to p5 renders is plausible but untested |
| LAION-Aesthetics predictor | "The Algorithmic Gaze" audit (CSCW/arXiv 2026) | Favors photoreal landscapes/portraits; abstract expressionism median 4.96 vs threshold 6.5; Western/Japanese bias; 60% of training from 2002–2012 photo contests | **Do not use as a judge of abstract generative work** — it is structurally biased against it |
| LAION-Aes, PickScore, HPSv2, ImageReward | "Fidelity Preference, Not Demographic Preference" (arXiv 2608.23593) | Scorers are inverted-U sensitive to any pixel perturbation (hue, blur, warp): they reward training-distribution modes and penalise long-tail appearances | Synthetic-only audits mislead (sign flips); real-image validation needed; useful at most as a "looks like a popular image" cliché signal |
| VLM absolute scoring vs ranking | "VLM Judges Can Rank but Cannot Score" (arXiv 2604.25235) | Judges rank well but compress scores to the middle; aesthetic tasks have tighter intervals (2.08) than infographics (3.50) | Use conformal prediction/±1 tolerance if scores are required; annotation quality dominates |
| Pairwise + swap + Bradley-Terry | GenArena (arXiv 2602.06013); GenAI Arena (NeurIPS 2024) | Pairwise: +20 pts accuracy, α 0.52→0.86, human corr 0.36→0.86; ties collapsed from 40% | Image editing/generation domain; judge choice matters (Qwen3-VL-32B best there) |
| Position bias | "Judging the Judges" (IJCNLP 2025) | Bias is real, judge- and task-specific, driven mainly by small quality gaps | Metrics: repetition stability, position consistency, preference fairness — adopt all three |
| MLLM UI judging | "MLLM as a UI Judge" (arXiv 2510.08783) | Claude 3.5/GPT-4o: 38% exact, >75% ±1; 90%+ pairwise when human gap is large, ~chance when subtle; "Interesting" systematically underestimated | Emotional dimensions need human validation |
| Multi-persona critique | CritiqueCrew (arXiv 2602.01796) | 9.58 vs 7.96 issues found; solution quality 5.22 vs 4.30/7; surfacing conflicts beat a unified expert | n=48 designers, UI domain |
| Critical Response Process | Lerman (one-pager, 2020) | Statements of meaning → artist questions → neutral questions → permissioned opinions | A human protocol; borrowed here as judge-prompt structure |
| Long-form standard | Hobbs 2021 "The Rise of Long-Form Generative Art" | No curation; bad outputs "extremely rare"; variety + collective unity; ~2 months QA on Fidenza | Practitioner doctrine, not a study |
| Jury values | Prix Ars Electronica jury statements 2026 | Juries prize concept, risk, "refuses to be decorative", material intelligence, social position | Juries judge concept + context, not pixels — a reminder that the stack above measures only the pixel-side |

---

## 3. Fetch log

| URL | What | Credibility |
|---|---|---|
| https://imae.udg.edu/~rigau/Publications/Rigau07B.pdf | Rigau/Feixas/Sbert "Informational Aesthetics Measures" — formulas M_H, M_K, M_S, painting values | High (peer-reviewed CAe; author site) |
| https://www.algorithmic-worlds.net/blog/20090819-UnivAestFrac.pdf | Spehar et al. 2003 "Universal aesthetic of fractals" — D 1.3–1.5, n=220, box counting | High (journal PDF mirror) |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC3124832/ | Taylor et al. 2011 Pollock fractals — **blocked by reCAPTCHA, not read** | — |
| https://link.springer.com/article/10.1007/s10710-022-09429-9 | McCormack & Gambardella 2022 complexity vs aesthetics; ten measures; no universal predictor | High (GPEM journal) |
| https://link.springer.com/chapter/10.1007/978-3-031-03789-4_24 | QD for Aesthetic Evolution (MAP-Elites on line-drawing agents) | High (EvoMUSART) |
| https://persci.mit.edu/research/clutter/ | Rosenholtz clutter measures overview | High (lab page) |
| https://people.csail.mit.edu/jahanian/papers/AliJahanian_VisualBalance_EI2015.pdf | Visual balance via saliency GMM + Arnheim hotspots | High (EI 2015) |
| https://arxiv.org/html/2604.25235v1 | VLM judges rank but cannot score; conformal intervals | Medium-high (preprint, under review) |
| https://arxiv.org/pdf/2602.06013 | GenArena pairwise vs pointwise numbers | Medium-high (preprint) |
| https://aclanthology.org/2025.ijcnlp-long.18/ | Position bias systematic study | High (ACL venue) |
| https://arxiv.org/pdf/2510.08783 | MLLM as a UI Judge | Medium-high (preprint) |
| https://arxiv.org/html/2602.01796v1 | CritiqueCrew multi-perspective critique | Medium-high (preprint, CHI-style study) |
| https://arxiv.org/html/2601.09896v4 | LAION-Aesthetics audit "Algorithmic Gaze" (also ACM DOI 10.1145/3805689.3806462) | High (ACM-published) |
| https://arxiv.org/html/2608.23593 | Fidelity-preference audit of LAION/PickScore/HPSv2/ImageReward | Medium (preprint) |
| https://arxiv.org/html/2610.01243 | VLM-guided image selection audit — **proxy rate-limited (429), not read** | — |
| https://zenodo.org/records/21385707 | Aesthetic homogenization in DALL-E 3 / Imagen 4 — effective-dimension collapse | Medium (Zenodo preprint; code released) |
| https://www.cell.com/patterns/fulltext/S2666-3899(25)00299-5 | Language-image loops converge to generic motifs — **403, not read**; title/abstract only from search | — |
| https://www.tylerxhobbs.com/words/the-rise-of-long-form-generative-art | Hobbs long-form doctrine | High for practitioner norms |
| https://ars.electronica.art/prix/en/jurystatements/statements2026/ | Prix Ars Electronica 2026 jury statements | High (primary) |
| https://lizlerman.com/…/Critical-Response-Process-in-Brief…pdf | CRP roles and four steps | High (primary) |
| Search-only (not fetched): Hasler & Süsstrunk 2003 (EPFL infoscience), Lehman & Stanley 2011 (gwern mirror), Machado & Cardoso 1998, Amirshahi "Evaluating the Rule of Thirds", GenAI Arena NeurIPS 2024, Björn Ottosson Oklab post, visual-attention-audit GitHub (numpy FC/SE port) | Background; known to me and consistent with the fetched material | High (canonical) |

## 4. Experience notes

- The strongest recurring result across 2024–2026 judge papers is the *same* one from the 1990s complexity literature: evaluators (human or model) are reliable at **ordering** and unreliable at **absolute scoring**. Every part of the stack should therefore be built as comparisons against anchors, with computed metrics as corridors.
- Off-the-shelf aesthetic scorers (LAION-Aes, PickScore, ImageReward, HPSv2) are the *wrong tool* for this studio: they are trained toward photoreal, popular-mode images and penalise long-tail appearance — i.e., they penalise exactly the originality the studio wants. They are usable only inverted, as a "this looks like a popular image" cliché signal.
- Fractal-dimension bands are the most over-cited and least robust of the metrics; keep them as a flag for edge-rich work only.
- Two sources could not be read (PMC Taylor 2011; arXiv 2610.01243; Cell Patterns loops paper 403). The Taylor numbers were corroborated from the 2003 Spehar paper; the other two are cited at abstract level only.
- The jury statements remind that pixel-side evaluation is at most half the job; concept, risk and context are what juries actually reward. The Intent-Fit and Cliché seats are the only places that touch this.

## 5. Open questions

1. Which model families give the lowest self-preference when the generator is Claude? Needs a small in-house swap experiment (same 20 pairs, Claude vs Gemini vs Qwen3-VL judges, measure agreement with 3 human raters).
2. Do the (b) bands transfer from photos/paintings to p5 renders? Re-fit after 200 labelled studio renders; expect edge-density and negative-space bands to move most.
3. How large must the cliché corpus be before kNN novelty is stable? Test rank stability at 100/300/1000.
4. Does "describe before judge" measurably reduce position bias in VLMs, as it does for shortcut bias in text judges?
5. Motion: everything above is still-frame. For animated sketches, add temporal metrics (optical-flow magnitude distribution, loop seamlessness, frame-to-frame novelty decay) — untreated here.
6. How to judge *intent* without a human: the Intent-Fit seat depends on a good one-line intent; a bad intent line makes a fit score meaningless.

## 6. Knowledge atoms

1. **Rank, don't score.** Both humans and VLMs produce stable pairwise orderings and unstable absolute numbers (VLM scores compress toward the middle by ~1–2 points; pairwise with position-swap raised judge–human correlation from 0.36 to 0.86 in GenArena). Build every evaluation as a comparison against fixed anchors and aggregate with Bradley-Terry.
2. **Computed aesthetics are corridors, not objectives.** Compression ratio, entropy, fractal D (1.3–1.5), colorfulness, clutter and balance each separate *broken* from *plausible* but none predicts preference across datasets (McCormack 2022: no universal measure; perceived complexity uncorrelated with liking in 5,341 comparisons). Use them to veto and to detect regressions; never optimise toward them.
3. **Originality must be measured against a cliché corpus, with the min over independent seats.** Novelty = kNN distance in DINOv2/CLIP space to a curated trope set + code-pattern lint + an adversarial "Cliché Hunter" seat that never sees the metric; release requires the *minimum* seat to clear the anchor and any seat-disagreement to go to a human, because averaging hides the one failing dimension that makes a piece common.
