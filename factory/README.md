# The explainer factory

A topic goes in; a 75-second exec-room film that passes a gate comes out, in under 30 minutes of agent time.
The binding brief is `factory/FORMAT.md`; the skill that runs it is `skills/explainer-factory/SKILL.md`; the
gold standard it was derived from is `films/opera-house/`.

## The format · "the 75-second case"

- Stage 960 × 540 design units, rendered at 1920 × 1080 in film mode (`?film=1`); the live page wraps it in a
  player (play, scrub, CC, chapters), a try-it panel, a transcript, sources and honest limits. Silent: captions
  carry it.
- 60 to 75 s of material plus a 3 s CETI brand card (the last frame holds under the card, then the takeaway).
- Five beats, at most four visual structures: **HOOK** 0–8 s (the everyday situation and the belief) ·
  **COMMIT** 8–16 s (ask for one number; the page pauses 8 s, film mode types a default) · **THE CASE** 16–36 s
  (one real worked example, real sourced numbers) · **THE COUNT** 36–62 s (the mechanism as a count, drawn before
  any percentage; the viewer's number placed against the truth) · **MONDAY** 62–72 s (the one question to ask at
  work, one honest-limits line).
- Exec clean: mono numerals, paper and pencil at most, no icons, no dashboards. Must-read text ≥ 28 units,
  everything else ≥ 14, chrome ≥ 12 and never carrying a result.
- Truth: every digit on screen comes from `claims.json` (value, formula or source); the gate recomputes formulas.
  At least 3 sources.
- Purity: `render(t, state)` is pure; re-seeking to t gives identical pixels and identical SVG.
- Size: film code under 120 KB; built page under 1.3 MB.

## Folder layout

    factory/FORMAT.md                 the brief every agent reads first
    factory/kit/                      shell.html, kit.js, player.js, build.py, probe.mjs, smoke/   (kit builder only)
    factory/kit2/                     the same API with brand, chrome and material injected; the build path (kit2/README.md)
    factory/tools/gate.mjs            the gate                                                     (gate builder only)
    factory/tools/new_topic.py        scaffold a topic and a film from the skill's templates
    factory/tools/repo_topic.py       turn a local git repository into a topic whose every number is a claim
    factory/tools/catalogue.py        factory/catalogue.json + factory/CATALOGUE.md (schema factory/catalogue.schema.json)
    factory/topics/<id>/              brief.md, claims.json, beats.md                                (explorer)
    factory/films/<id>/               film.json, film.js, claims.json, NOTES.md, gate.json, seat.json  (builder, seat)
    factory/films/<id>/build/         the page, gitignored; rebuilt from sources by build.py
    factory/SHIP.md                   the ship log: what was verified, what was held, defects for the next kit

## The build path: kit2

    python3 factory/kit2/build.py factory/films/<id> [--brand ID|film] [--chrome ID|none] [--material ID]

kit2 is the default build. It keeps kit's drawing API (a film.js written for kit runs unchanged) and injects the
look: `--brand` an `arsenal/brands/` pack (default `film`: the film's own palette and faces), `--chrome` a
`factory/chromes` module or `none`, `--material` an `arsenal/materials/drawn` id. Output
`build/<id>.<brand>.<chrome>[.<material>].html`; byte-reproducible. film.json may carry `level` (`exec` default,
`manager`, `engineer`); at `exec` the material is `ink` and the texture `none` or `paper` (gate row G10). The 15 shipped
films and their baseline hashes below are built with factory/kit (`python3 factory/kit/build.py`) and still build.
Proof: factory/kit2/PROOF.md (2 films x 4 brands x 4 chromes, 32 of 32 gates PASS, zero film edits).

## The kit contract (`factory/kit/README.md`)

A builder writes three files. `film.json` is `window.FILM`: id, title, eyebrow, lede, dur, palette, fonts (from
`vendor/fonts.lock.json`, by hash), commit {at, prompt, default, min, max, unit}, chapters, captions
[[t0, t1, text]], brand {takeaway, at}, sources (≥ 3), honest, optional cards, tryit, params, count {at}.
`film.js` sets `window.FILM_RENDER = { setup(p, K), render(t, state, K), tryit?, captions?, brand?, ground? }`;
`render` is pure. `claims.json` is an array of {id, text, value, formula | source, renders, appears_at}.

`python3 factory/kit/build.py factory/films/<id>` assembles `build/<id>.html` from `shell.html` with the fonts
and p5 embedded by hash; same inputs, same bytes; it prints bytes and sha256. The kit (`window.KIT`) gives a
retained SVG pool (`E`, `tx`, `ln`, `rc`, `path`, `dim`, `stamp`), the sheet chrome, `caption`, `card`, `roll`,
`commitBox`, `brandCard`, a seeded paper ground, pencil strokes and maths (`seg ease lerp typed fmtK mulberry32
shuffle Phi`). The page exposes `window.__film {ready, seek, only, info}` and `window.__ctrl {play, pause, seek,
setState, state}` for the probe and the gate. Builders use the kit as published: anything missing goes into
their own film.js and is noted in NOTES.md; nobody patches the kit mid-batch.

## The gate (`factory/tools/README.md`)

    node factory/tools/gate.mjs factory/films/<id>/build/<id>.html --film factory/films/<id> \
      --kit factory/kit/kit.js --kit factory/kit/player.js --json factory/films/<id>/gate.json [--shots dir]
    # a kit2 page: --kit factory/kit2 (kit2.js, player.js), plus the chrome and material files you want scanned

| row | what it holds the film to |
|-----|---------------------------|
| G1 load | film and live modes load with no console or page errors, charset, ready < 5 s, no blank stage |
| G2a / G2b purity | canvas bytes and SVG innerHTML identical however t is reached |
| G3 clock scan | no Math.random, Date, performance.now, frameCount, millis, rAF in film.js or kit.js |
| G4a–f format | material 60–75 s; five beats in order; commit at 8–16 s; brand card; honest line; ≥ 3 sources |
| G5a / G5b / G5c truth | formulas recompute to the claimed value; every caption digit is a claim; on-screen digits (WARN) |
| G6 legibility | must-read ≥ 28, secondary ≥ 14, chrome ≥ 12 by `data-role`, else by layer, else by size; phone 390 |
| G7 counts first | no percentage or "N in M" before `count.at` |
| G8 size | film code < 120 KB, page < 1.3 MB |
| G9 tics | at most 2 full-screen cards; a countdown ring only in the COMMIT window |
| G10 axes | the page's declared axes (`__film.info.axes` or `<meta name="kit2">`): at level `exec`, material `ink` and texture `none`/`paper`; SKIP on a factory/kit page |

WARN and SKIP never fail a film; any FAIL does. The builder runs the gate up to three rounds, reading the
stills each time, until `VERDICT PASS`, and keeps the last `gate.json`.

## The seat

A Fable evaluator who did not build the film reads a blinded packet (stills, captions, claims) and writes
`seat.json`: verdict SHIP, REVISE (ranked fixes, back to BUILD, one more seat at most) or VETO (a wrong or
unsourced claim: back to EXPLORE). The seat checks what the gate cannot: the hook is an everyday situation,
nothing numeric leaks before the commit seals, the count is drawn before the ratio, the structures are at most
four, the Monday question is askable, the honest line is honest.

## The ship step

The shipper rebuilds every film from clean sources and confirms the bytes and sha256 against NOTES.md, re-runs
the gate and confirms it agrees with the film's gate.json, then runs `python3 factory/tools/catalogue.py` so
`factory/catalogue.json` and `factory/CATALOGUE.md` carry every film's title, duration, verdict, bytes and
sha256. `python3 factory/tools/catalogue.py --check` exits 1 if a rebuild moves a hash; `sh tests/proofs.sh vi`
builds and gates every film and runs that check; `tests/baselines/builds.json` carries the same hashes. A film
whose rebuild or gate differs is held, with the reason, in `factory/SHIP.md`. Committed per film:
`factory/topics/<id>/*`, `factory/films/<id>/{film.json, film.js, claims.json, NOTES.md, gate.json, seat.json}`;
never `build/`, stills or packets.

## Adding a topic

    python3 factory/tools/new_topic.py <id> "<Title>"
    python3 factory/tools/repo_topic.py <path-to-local-git-repo> --id <id> [--days 7] [--rev HEAD]   # a repository as the source

writes the explorer's `brief.md`, `claims.json`, `beats.md` and the builder's `film.json`, `film.js` (a titled
sheet, the commit box, a placeholder per beat), `claims.json`, `NOTES.md`, so the page builds and gates at once.
Every placeholder reads TODO; nothing in it is a fact. Then EXPLORE, BUILD, GATE, SEAT, SHIP as in the skill.
Each concept brings its own fixture: never base rates, the planning fallacy or the AI agent loop.

The repo source reads one pinned commit with read-only git (log, ls-tree, cat-file, grep), never runs repository
code, and writes `facts.json`, `claims.json` (every number a claim with a `recompute` command and `expect`, or a
`formula`), `brief.md` and a 90-second `beats.md` to cut down to the 75-second format. It re-runs every claim after
writing; `repo_topic.py --check factory/topics/<id>/claims.json` repeats it.

## The routing rule

Opus agents explore, synthesise and build. Two Fable agents evaluate (blinded, on stills and claims) and
ship. The orchestrator commits; no agent runs git. Each agent writes only in its own folder: explorers in
`factory/topics/<id>/`, builders in `factory/films/<id>/`; only the kit builder touches `factory/kit/` and
`FORMAT.md`, only the gate builder `factory/tools/gate.mjs`. Over budget: cut scope, never checks.

## Shipped films

| id | title | seconds | sha256 | seat |
|----|-------|--------:|--------|------|
| amdahl | Ten Times Faster | 75 | `d400603042ad` | no seat.json |
| brooks | Brooks' Law | 75 | `be95e7066035` | no seat.json |
| correlated-risk | Ten Bets, One Bet | 75 | `de70c74503bf` | no seat.json |
| cost-of-delay | The Cost of Waiting | 75 | `85b9c679a37b` | no seat.json |
| goodhart | Eight Is Great | 75 | `7280596d4b90` | SHIP |
| queues | Busy is not fast | 75 | `4743e73dcfc4` | no seat.json |
| regression | The Flight Instructors | 75 | `254338240ea5` | no seat.json |
| sample-size | Thirty Customers | 75 | `836da6218b26` | no seat.json |
| selection | Who chose it | 75 | `83db587cf037` | no seat.json |
| simpsons | Worse Overall | 75 | `47c5b15a2766` | no seat.json |
| streaks | Three bad months | 75 | `7d00abd4032b` | no seat.json |
| sunk-cost | The Season Ticket | 75 | `8552cc4056be` | SHIP |
| survivorship | The Missing Planes | 75 | `484bccb63f75` | no seat.json |
| volatility-drag | The average is not your outcome | 75 | `0f1f544b53a4` | no seat.json |
| winners-curse | The Winner's Curse | 75 | `a4fc5a1a5374` | no seat.json |

Fifteen films, all gate PASS on rebuild (G5c on-screen-digit WARNs are chrome numbers: axis ticks, counters mid-animation). Verification log: `factory/SHIP.md`.
