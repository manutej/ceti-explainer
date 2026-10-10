# factory/tools · the gate

`gate.mjs` checks one built film page against "the 75-second case" (factory/FORMAT.md). It drives the page
through the hook contract of films/opera-house/page.js: `?film=1` gives the bare 1920×1080 stage;
`window.__film {ready, seek, only, info}` and `window.__ctrl {play, pause, seek, setState, state}`.

    node factory/tools/gate.mjs <built-page.html> --film <film-dir> [--json out.json] [--shots dir] [--kit file.js ...] [--quick] [--no-overlap]

- `<built-page.html>` the assembled page (for example factory/films/<id>/build/<id>.html).
- `--film` the film's source folder: film.json, film.js, claims.json are read from here.
- `--json` writes `{film, page, pass, rows:[{id, name, status, evidence, data}]}`.
- `--shots` writes 8 stills at 1920×1080 (from 1 s, about every dur/7.5, plus the last frame) and
  `phone-390.png` (the live page at a 390 px viewport).
- `--kit` adds kit sources to the clock scan (repeatable). Files whose name contains `player` may use
  requestAnimationFrame, Date and performance.now (the play loop and the commit timer); nothing else may.
- `--quick` samples the text timeline (G5c, G11) every 1 s instead of every 0.5 s.
- `--no-overlap` skips G11 (text overlap), which seeks the film every 0.5 s and adds about 10 to 40 s.

Rows sort numerically (G10 and G11 after G9). Prints a table, exits 1 if any row is FAIL. WARN and SKIP never fail the film. A row SKIPs when the film
folder lacks the data it needs (legacy schema), and says why. Runtime: about 10 to 20 s.

## Rows

| row | checks | fails when |
|-----|--------|------------|
| G1 load | film mode and live mode load; console errors and page errors; `<meta charset="utf-8">`; `__film.ready()` time from navigation; stage pixel s.d. at 0.2, 0.5, 0.8 × dur | any error, no charset, ready ≥ 5 s, a blank stage (luminance s.d. < 2) |
| G2a purity · canvas | `toDataURL` of every stage canvas at 0.1/0.3/0.5/0.7/0.9 × dur, re-seeked after visiting another time; order A→B vs B→A for two pairs | any byte differs |
| G2b purity · SVG | `innerHTML` of the stage SVG, same seeks, nothing normalised | any byte differs (prints the first differing span) |
| G3 clock scan | film.js (+ `--kit` files, + film.json `libs`), comments blanked, line numbers kept: Math.random, Date, performance.now, frameCount, millis(), requestAnimationFrame, deltaTime, p.random | any hit |
| G4a duration | material = dur − brand.dur (else dur − brand.at, else 3) | material outside 60–75 s or total > 78 s (`format: feature` 90–120 / 123; `format: smoke`, infrastructure tests only, 5–20 / 25) |
| G4b beats | chapters mapped to HOOK, COMMIT, CASE, COUNT, MONDAY by `beat`, `id`, `name` or `title`; HOOK → [COMMIT] → CASE → COUNT → MONDAY, COMMIT optional (D11) | wrong order or t0 not ascending (SKIP if no chapter names a beat) |
| G4c commit time | commit off (film.json `commit` absent/null or `commit.enabled: false`, D11): PASS "commit disabled (D11)" when the page's `info.commit` is null or `{enabled: false}`; else `commit.at`, else `T.commit`/`T.ask`, else the COMMIT chapter t0 | off: the page still carries the beat (built before D11); on: outside 8–16 s |
| G4d brand card | `brand.takeaway` non-empty; the frame at dur − 1 is not blank | missing brand, empty takeaway, blank frame |
| G4e honest line | `honest` (or `limits`, `honesty`, `honestLimits`), string or array | empty |
| G4f sources | `sources` | fewer than 3 |
| G5a claims · formulas | every claim with `formula` is evaluated in a node `vm` sandbox; every claim has a `source` or a `formula` | \|result − value\| > tolerance; formula throws; claim unsourced |
| G5b claims · caption digits | every number in `film.json.captions` (clock times like 0:51 and years 1800–2100 ignored; text inside a claim's `renders` strings removed first) matches a claim value at its printed precision (also value × 100 for shares, value ÷ 1e3 / 1e6 for "k"/"M") | any unknown number |
| G5c claims · on-screen digits | the same test over every visible SVG text, sampled every 0.5 s | WARN only (chrome numbers such as axis ticks) |
| G6 legibility | visible SVG `<text>` (display, opacity > 0.3, centre inside 960×540) at 6 times, font size in design units (transforms and viewBox applied); class from the nearest `data-role` (`must-read`, `secondary`, `chrome`), else layer `cap` = must-read, else by size (≥ 22 must-read, ≥ 12.5 secondary, else chrome); phone screenshot at 390 px | must-read < 28, secondary < 14 (WARN: chrome < 12; phone overflow is reported) |
| G7 counts first | first time a percentage, "N in M" or "N out of M" appears in visible SVG text or a caption, vs `count.at` (else the COUNT chapter t0). Counts first binds every film; "nothing from the answer before the seal" binds only a film with the commit on (D11; checked in the beats, not measured here) and the evidence says "commit disabled (D11)" when it is off | a ratio appears before the count (SKIP if neither is declared) |
| G8 size | film.js + film.json + claims.json; the built page | ≥ 120 KB; ≥ 1.3 MB |
| G9 tics | full-screen cards: chapters with `card: true` plus every entry of `film.cards`; countdown ring: `T`/`timings` keys or `device` values matching ring/countdown | more than 2 cards (WARN: a ring outside the COMMIT window) |
| G10 axes | the page's declared axes: `window.__film.info.axes` (kit2 writes `{brand, chrome, material, texture, texture_declared, level, renderer, box}`), else `<meta name="kit2" content="brand=… material=… texture=… level=…">`; level = film.json `level`, else axes.level, else `exec` | level `exec` (DECISIONS Q6) and material ≠ `ink`, or a rendered texture other than `none`/`paper` (WARN: the brand declares grain/halftone and kit2 drew it flat; SKIP: no axes, a factory/kit page) |
| G11 text overlap | visible SVG `<text>` with a `data-role` (opacity > 0.05, non-empty, box inside the 960×540 stage) every 0.5 s (1 s with `--quick`); `getBBox` through the CTM into stage units (12 % of the line box trimmed top and bottom, so tightly stacked lines do not count); layer `cap` texts form the caption band and are not paired with each other. A pair counts when the boxes overlap by more than 4 % of the smaller box; also text leaving the stage, and text crossing the caption band while a caption shows. A page with no `data-role` at all (kit v1) judges every text, classed like G6 | FAIL: both texts must-read, a must-read covered > 25 %, or a must-read across the caption band. WARN: any other overlap, or text off the stage. Evidence lists the worst 8 distinct pairs (t, texts ≤ 40 chars, roles, overlap in u² and %); `data.instances` in the json holds every instance. Canvas-drawn text (p5 / WEBGL) cannot be seen: the row says so. `--no-overlap` skips it (SKIP) |

Help the gate by tagging text with `data-role` on the element or a parent group (the kit's text helpers
should do this): `must-read` for headline numbers, the count, captions and the commit box; `secondary` for
labels; `chrome` for eyebrows, ledgers, axis ticks. Results never go in chrome.

## film.json fields the gate reads

    { "id": "...", "dur": 75,
      "params": { "n": 1000, "mu": 0.2555, "sigma": 0.487, "plan": 12 },     // claims formulas see these
      "chapters": [ { "id": "hook", "beat": "HOOK", "t0": 0, "t1": 8, "card": false }, ... ],
      "commit": { "at": 9, "default": 13 },   // or absent / { "enabled": false }: the commit beat is off (D11)
      "count":  { "at": 38 },          // when the count structure is first drawn
      "brand":  { "takeaway": "Ask how the last thousand went.", "at": 72 },   // or "dur": 3
      "honest": "The wall is a constructed teaching object, not a dataset.",
      "level": "exec",                 // exec (default) | manager | engineer: G10 holds exec to ink, texture none/paper
      "captions": [ [t0, t1, "text"], ... ],           // or {t0, t1, text}
      "sources": [ ["BGR94", "Buehler, Griffin & Ross (1994) ..."], ... ] }

## claims.json

An array, or `{ "film": id, "claims": [...] }`. One entry per number that appears on screen or in a caption.
Formulas see, in rising precedence: every claim's value under its id (when the id is a JS identifier), the
numeric fields of `film.json.count`, and `film.json.params`.

| field | required | meaning |
|-------|----------|---------|
| `id` | yes | short key |
| `text` | yes | the claim in words |
| `value` | yes | the number as the film uses it |
| `formula` | no | JS expression over `film.json.params`; Math functions are globals (`exp`, `log`, `round`, ...), plus `Phi(z)` (normal CDF), `PhiInv(p)` (Acklam), `ln`, `sum(...)`, `round(x, d)` |
| `tolerance` | no | absolute; default 0.5 for integer values, else 0.5 % of the value |
| `source` | yes, unless `formula` | source key from film.json.sources |
| `renders` | no | strings exactly as printed ("3 in 10", "$102M", "12 months"); their digits count as covered |
| `appears_at` / `where` | no | seconds or places where it shows (documentation for the evaluators) |

    [
      { "id": "on-plan", "text": "300 of 1,000 projects finish by the plan",
        "value": 300, "formula": "Math.round(n * Phi(-mu / sigma))", "source": "BGR94",
        "renders": ["300", "1,000", "3 in 10"], "appears_at": 41 },
      { "id": "median", "text": "half are done by month 15.5",
        "value": 15.5, "formula": "plan * exp(mu)", "source": "derived", "appears_at": 48 },
      { "id": "opera-years", "text": "the Opera House took 14 years against 4 planned",
        "value": 14, "source": "SOH", "renders": ["14 years", "1959", "1973"], "appears_at": 22 }
    ]

## Calibration (films/opera-house, the 4:29 feature-tier fixture)

G1, G2a, G3, G8 pass. G2b fails on the known pooled-element hygiene (a hidden element keeps
`style="display: none;"` and stale text). G4a/G4c/G4d fail because it is a 4:29 feature film with no brand
card; G6 fails on the 14.5-unit captions and 11 to 13-unit sidebar; G9 counts its 9 cards. G4b, G4e, G5, G7
skip (no beat-named chapters, honest line, claims.json or count.at in its schema).

## Kit smoke film (factory/kit/smoke, 20 s)

G1, G2a, G2b, G3, G4d to G4f, G5a, G5b, G7, G8, G9 pass; G4a/G4b/G4c fail by design (a 20 s smoke, no CASE
or MONDAY, commit at 5 s); G6 flags the 25-unit SEALED stamp, which the size rule takes for must-read; the
kit should tag text with `data-role` so stamps and chrome are classed by intent, not by size.

## frames.mjs and apply_findings.py (factory/PIPELINE.md stages 2 and 4)

    node factory/tools/frames.mjs <page.html | film-dir> [--every 0.5] [--out dir] [--brand id] [--per-row 12]
    python3 factory/tools/apply_findings.py <film-dir> <findings.json> [--dry-run] [--every 0.5] [--no-frames]

frames.mjs: 480 x 270 thumbnails (thumbs/t-0012.50.jpg, timestamp burned top-left) every --every s, strips of 12
(strip-01.png …), frames.json `{s_per_frame, purity, knobs, axes, frames: [{t, file, strip, cell, caption, chapter}]}`;
exit 1 on a page error or a purity difference at 0.2/0.5/0.8 × dur. apply_findings.py: validates each finding
(knob in knobs_doc and in range; caption_index exists, ≤ 60 chars, no new number that is not a claim value; chapter
t0 shift ≤ 2 s keeping beat order; brand/chrome ids exist), applies the valid ones to film.json (+ `look`), writes
`<findings>.report.json`, rebuilds with kit2, gates (`gate.json`), re-strips (`frames/`); exit 1 if the gate FAILs.
