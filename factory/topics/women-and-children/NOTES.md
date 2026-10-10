# women-and-children · brief-lane NOTES (2026-10-10)

## Could not source (must resolve before any public use)
1. **The 32 cells are transcribed from memory** of Dawson (1995) / R `datasets::Titanic`; the brief lane had no network.
   After writing them, the lane found a secondary copy (Rdatasets `csv/datasets/Titanic.csv` inside a pydataset 0.2.0
   bundle in a local scratch folder from an earlier session, sha256 d7f30b1777b83cf4104ddb7aff900a3c7d1608d0699c7460b6447dbe0a9fc089):
   32 of 32 cells agree. That copy is untrusted and is not the published table. Verify every cell against Dawson (1995),
   JSE 3(3), then set `verified_against_published_table: true` in data/titanic.json and `"verified": true` in claims.json
   (`python3 recompute.py --emit` rewrites claims.json; edit the flag in recompute.py).
2. Citations S1, S2, S3 and S5 (Simonoff 1997, JSE 5(1)) are from memory: volume, issue and reprint details to be checked.
3. The S3 year (2024) is a placeholder for "the current R documentation"; replace with the R version actually consulted.
4. The day of the sinking (15 April 1912) is in brief.md only; on screen the film says "April 1912" (claim `year`, S2).

## Findings for the coordinator
- **The wave brief's gap sentence is wrong for this table.** "Third-class children fared worse than first-class men":
  27/79 = 34.2 % vs 57/175 = 32.6 % (adult men) or 62/180 = 34.4 % (with first-class boys). The film says "as often as".
  Third-class boys alone (13 of 48, 27 %) did fare worse, but that needs a sex split of the children the film does not draw.
- Within every class women outlived men, and within third class children (34 %) still outlived men (16 %): the rule did
  not reverse inside a class; it was unequal across classes. Captions avoid "the rule failed in third class".

## Risks for the drafters
- **Empty cell.** The crew-children slab has n = 0. The stack-city card does not say whether a 0-box slab lays out cleanly
  (`round(n/k)` min 1 applies only for n > 0). If it breaks, drop the slab from the layout (cats stay 4, n stays 0) or
  draw CREW with two groups; do not add a phantom box. No anchor or pin for it.
- **No film has hosted these lanes together.** stack-city's role-lit shader must emit linear colours through
  `post.toScene` into `st.hdr`, with emission > 1 only on the lit boxes of `CHILDREN/3RD` and `MEN/1ST` during 84–98 s;
  labels after `apply`. gl-labels `kit()` is untested in a film (card S3); `sticky: 'window'` recommended at 123 s.
- **Cost unmeasured as a composite.** Heaviest frame estimate 0.8–1.0 s (city 2,201 boxes + 11 pins + bloom); DoF would add
  ~0.5 s, so `dofGain` defaults to 0.
- Stack-city's own pooled pins (CASE, 36 s) must keep counts first and % after `ratioDelay` ≥ 1.5 s (seat fix); set
  `labels: none` for the split so gl-labels owns every slab pin, and `checkLine: false` (card WARN).
- new_topic.py was not run: it scaffolds a 75 s case with a commit beat; the film skeleton is the drafters' (feature, D11).
