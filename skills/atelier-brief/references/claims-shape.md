# claims.json · one shape, read by the gate (G5a recompute, G5b caption digits, G5c on-screen digits)

```
{
  "film": "<id>",
  "params": { "<name>": number, ... },            // raw inputs the formulas use (counts from the table, hold seconds, per-mark factor)
  "claims": [
    { "id": "<kebab-or-camel>", "text": "what it says in words", "value": number|string,
      "formula": "<expression over claim ids, count fields and params>" | null,
      "source": "<source tag S1..>" | "derived" | "input" | "git" | "tree" | "readme" | "manifest",
      "recompute": "<read-only shell command>" (optional; repository subjects), "expect": "<its output>" (optional),
      "where": "caption 3; headline at 36 s; ledger row C" }
  ]
}
```

Rules the gate applies
- Every `formula` is evaluated in a scope of all claim values by id, then the numeric fields of film.json `count`, then
  `params` (params win on a name clash); helpers `sum`, `round`. `value` must equal the recomputed result (rounding to
  the shown precision counts as equal). A claim with neither `formula` nor a `source` tag is unsourced → FAIL.
- G5b: every digit in a caption must be the `value` of a claim or a render of one (`renders`: ["45 %", "45%"] when the
  on-screen form differs from the value).
- G5c: every number visible on the stage (SVG text with a data-role) must be a claim value; chrome furniture and running
  counters that tick through intermediate totals produce WARN only (known kit defect 7).
- Roles: `source: "input"` marks commit-box inputs (unit, min, max, default, hold); they may appear before the commit.
  `derived` claims carry a formula. Repository claims carry `recompute` + `expect` so a reader can re-run them.

The topic package (factory/topics/<id>/claims.json) and the film's claims.json (factory/films/<id>/claims.json) share
this shape; the drafter copies it unchanged and adds `where` for every digit it draws. `python3
factory/tools/repo_topic.py --check factory/topics/<id>/claims.json` re-runs recompute commands; the gate recomputes formulas.
