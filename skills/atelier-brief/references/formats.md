# Formats the factory builds (film.json `format`)

| format | material length | total | beats and windows | gate row | when |
|---|---|---|---|---|---|
| case | 60–75 s | + 3 s brand card, ≤ 78 s | default (no commit, D11): HOOK 0–10 · CASE 10–36 · COUNT 36–62 · MONDAY 62–72; with a commit: HOOK 0–8 · COMMIT 8–16 · CASE 16–36 · COUNT 36–62 · MONDAY 62–72 | G4a wants 60–75 | the default; one belief, one fixture |
| feature | 90–120 s | ≤ 123 s | default (no commit, D11): HOOK 0–12 · CASE 12–58 · COUNT 58–108 · MONDAY 108–120; with a commit: HOOK 0–9 · COMMIT 9–17 · CASE 17–55 · COUNT 55–104 · MONDAY 104–112 (at 115 s total; scale linearly); a theory beat may sit inside CASE; a second count may land inside COUNT after the first | G4a wants 90–120 | a repo or product showcase with more than one count |
| smoke | ≤ 15 s | | no beats required | G4 relaxed | kit proofs only; never shipped |
| reel (planned) | 30–45 s | 9:16 | HOOK · [COMMIT] · COUNT · card | not yet gated | social cuts; needs a portrait basis in kit2 (docs/PROTOTYPES.md P2) |

Fixed across formats: silent with captions; the brand card is last; the honest line is one line; every digit a claim;
count.at is the first count's landing time and precedes every ratio. The commit is optional and off by default (D11,
film.json `"commit": {"enabled": false}`, no COMMIT chapter): the film plays straight through. With a commit
(`"enabled": true`), it holds 8 s on the page and uses `commit.default` in film mode, and commit.at sits inside COMMIT
(8–16 s case, 9–17 s feature). Chapter boundaries may move ± 2 s in
evaluation rounds (atelier-select), never the beat order.
