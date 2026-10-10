# ESCAPES — defects found after commit

Every defect discovered downstream of a green gate: a duplicate entity noticed
later, a claim a source doesn't support, a broken promise of a page, a merge
conflict that was silently resolved. Each row is a **proposal for a new conserved
quantity** — REFIT mines this file to draft shadow lenses.

| when | defect | where found | which lens should have caught it | lens proposal (or existing-lens gap) |
|---|---|---|---|---|
| 2026-10-08 | Hub back-link Relations carry a citation unrelated to the clause ("listed in the C4 hub [S47]", "catalogued in ... hub [S404]"); ~152 such lines wiki-wide | audit prov.faithful (sample #26,#38,#47) | prov.coverage counts any [S#] as coverage | new shadow lens `prov.relation-cite`: hub/part_of back-link clauses must either be uncited structural links or cite a source whose branch row names both endpoints |
| 2026-10-08 | Site pages: `Kind:` label disagrees with the kind of every registered source (15/136, e.g. site-github-p5-wrapper-react says primary, S249 is docs) | audit prov.faithful (sample #53) | none (sync lenses check frontmatter, not body facts) | exact lens `site.kind-consistent`: Kind label ∈ {kind of its sources in SOURCES.md} |
| 2026-10-08 | Site-page boilerplate advice cited to a source that does not say it ("prefer the primary p5.js documentation where the two disagree" on 52 pages, even for non-p5 sources) | audit prov.faithful (sample #59) | prov.coverage (citation present, support absent) | treat templated site sentences as uncited structure (exclude from coverage) or move under Unverified; lens `prov.template-cite` flagging identical cited sentences across >5 pages |
| 2026-10-08 | Generator truncation artifacts in site "Noted gap" lines: stripped B-ids leave " ." / " ;" and clipped endings ("rests on their (abridged)") on ~36 lines | audit prov.faithful (sample #50,#55,#56) | none | exact lens `text.cite-strip-residue`: regex `\s[.;,]` / "(abridged)" in body |
| 2026-10-08 | Inference / own advice / proposed (unmerged) PR presented as sourced fact or with **[2.x]** badge (p5-font, explainer-engine-blueprint camera, typescript-types PR #8114, release-2-4 SVG) | audit prov.faithful (6 overstated) | prov.faithful is shadow; no gate on hedge markers | lens `prov.hedge`: branch rows marked inference/my inference/unverified/not confirmed must keep a hedge token in the page sentence citing them |
| 2026-10-08 | Release title vs included-PR title conflated: "Editor v2.22.0 is titled 'Set p5.js v2 to Default'" — live page shows title v2.22.0, the phrase is PR #4232 (branch B21 row itself overstated) | live WebFetch during audit | none (error originates in branch notes) | periodic live-URL spot check for version/date/title claims (`prov.live` judge, 5 per session) |

---
