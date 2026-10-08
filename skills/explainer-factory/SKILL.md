---
name: explainer-factory
description: "Run the CETI explainer factory end to end: turn one management topic into a 75-second exec-room film (the '75-second case': hook, commit, the case, the count, Monday, then the CETI brand card) that passes the gate, in under 30 minutes of agent time. Five steps with fixed files: EXPLORE (factory/topics/<id>/ brief.md, claims.json, beats.md; from a concept or from a repository with factory/tools/repo_topic.py), BUILD (factory/films/<id>/ film.json, film.js, claims.json, NOTES.md; python3 factory/kit2/build.py with a brand and a chrome; ADOPT arsenal modules where they earn their place), GATE (node factory/tools/gate.mjs with --kit factory/kit2, rows G1 to G10, read the stills, fix, repeat to PASS), SEAT (a blinded packet of stills, claims and captions for an evaluator who did not build), SHIP (catalogue entry, baseline hash, what is committed). Use for /explainer-factory, 'make a 75-second case on <topic>', 'factory film about <concept>', 'new exec explainer', 'run the factory', 'scaffold a topic', 'gate this factory film', 'seat / evaluate this film', 'ship to the catalogue'. Not for the 4:29 feature tier (films/opera-house), the 40 s SVG episode (ceti-explainer) or p5 Atelier chromes (p5-explainer)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`. The binding brief is
> `${CLAUDE_PLUGIN_ROOT}/factory/FORMAT.md` (copied from docs/DECISIONS.md, Q1 to Q15 and D9); where this file and
> FORMAT.md disagree, FORMAT.md wins. The gold standard is `films/opera-house/` (read its NOTES.md once).

# explainer-factory: topic → 75-second case → gate → seat → catalogue

All paths below are relative to the plugin root (`${CLAUDE_PLUGIN_ROOT}`; `python3 scripts/paths.py` prints it).

```
factory/FORMAT.md                    the format (binding)
factory/kit/                         shell.html, kit.js, player.js, build.py      API: factory/kit/README.md
factory/kit2/                        the same API with brand, chrome and material injected; the default build (factory/kit2/README.md)
arsenal/                             patterns, structures, core, 22 brand packs, tools (arsenal/README.md); see ADOPT below
factory/tools/new_topic.py           scaffold a topic and a film (this skill's templates, filled)
factory/tools/repo_topic.py          turn a local git repository into a topic whose every number is a claim
factory/tools/gate.mjs               the gate; rows and fields: factory/tools/README.md
factory/tools/catalogue.py           factory/catalogue.json + factory/CATALOGUE.md (schema: factory/catalogue.schema.json)
factory/topics/<id>/                 brief.md, claims.json, beats.md                 (explorer)
factory/films/<id>/                  film.json, film.js, claims.json, NOTES.md, gate.json, seat.json; build/ is gitignored
```

## Routing, budget, order

| step | who | budget | done when |
|------|-----|-------:|-----------|
| 0 scaffold | orchestrator | 1 min | `python3 factory/tools/new_topic.py <id> "<Title>"` wrote 7 files |
| 1 EXPLORE | **Opus** explorer | 8 min | brief, claims and beats filled; every number sourced or derived; ≥ 3 sources |
| 2 BUILD | **Opus** builder | 12 min (ADOPT included) | page builds; the builder has looked at its own stills |
| 3 GATE | the builder | 5 min, ≤ 3 rounds | `VERDICT PASS`; gate.json written |
| 4 SEAT | **Fable** evaluator who did not build | 3 min | seat.json verdict SHIP (or REVISE with ranked fixes) |
| 5 SHIP | **Fable** shipper | 1 min | catalogue rebuilt; sha256 in NOTES.md; file list handed to the orchestrator |

A film costs under 30 minutes of agent time. Opus explores, synthesises and builds; Fable evaluates and ships;
the orchestrator commits (no agent runs git). Each agent writes only in its own folder: explorers in
`factory/topics/<id>/`, builders in `factory/films/<id>/`. Builders use the kit as published: if it lacks
something, write it in your own film.js and say so in NOTES.md; never patch `factory/kit/`, `factory/kit2/` or `arsenal/`.
Over budget? Cut scope, not checks: drop the spare structure, shorten the case beat, keep the gate.

## The never list

- **No Google Fonts, no runtime fetch.** Faces come from `vendor/fonts` through `film.json.fonts` (the kit's
  build.py checks each against vendor/fonts.lock.json); no `fetch`, XHR, `import()`, CDN, `<link>` to the network.
- **No Math.random in render.** Nor Date, performance, frameCount, millis(), deltaTime, p.random,
  requestAnimationFrame in film.js (gate G3). Seeded orders are made once in `setup` with `K.shuffle(arr, seed)`
  or `K.mulberry32(seed)`; p5 noise is seeded by the kit.
- **No ratio before its count.** Draw the count (marks, a wall, a grid) and land it as "N of M" first; a
  percentage, "x in y" or ratio appears only after `count.at` (G7) and after the count has finished, with
  "N ÷ M" beneath it (Q14).
- **No number before the commit.** Nothing that gives the answer away, and nothing derived from the viewer's
  answer, appears before the seal (`commit.at` + 4.5 s in the kit's commit box).
- **No icons, dashboards, clip-art, hand-drawn figures, chart-junk, emoji** (Q6). Typeset numbers in the mono
  face, marks at true scale, paper and pencil texture at most, few words.
- No digit on screen or in a caption without a claim (G5); no claim without a source or a formula.
- No base rates, planning fallacy or AI agent loop as the fixture (done); each concept brings its own case (Q10).
- No audio (Q3). No more than four visual structures, no more than two full-screen cards (G9).
- Must-read text (headline numbers, the count, captions, the commit box) ≥ 28 units; other text ≥ 14; chrome
  (eyebrows, ledgers) may be 12 but never carries a result (G6).

## 0 · Scaffold

```
python3 factory/tools/new_topic.py <id> "<Title>"      # kebab-case id; --force to overwrite
python3 factory/kit2/build.py factory/films/<id>       # the scaffold builds and passes the gate as is
```

The scaffold film is a valid 75-second page with TODO text: the sheet, the commit box at 9 s, a placeholder
per beat, the kit's captions and brand card. Replace, do not start over.

## 1 · EXPLORE (Opus) → factory/topics/<id>/

Find the one real case and its numbers before anything is drawn. Two sources of a topic:

- **From a concept**: read primary sources; compute every derived number yourself and write the formula.
  Templates below (the scaffold writes them with these headings).
- **From a repository**: `python3 factory/tools/repo_topic.py <path-to-local-git-repo> --id <id> [--days 7]
  [--rev HEAD] [--until now|head|<ISO 8601>] [--force]` reads one pinned commit (git log, ls-tree, cat-file, grep;
  it never runs repository code or a git write) and writes `factory/topics/<id>/` `facts.json`, `claims.json`
  (every number a claim with a `recompute` command and `expect`, or a `formula`), `brief.md` and `beats.md`
  (a 90-second draft). It re-checks every claim after writing; `repo_topic.py --check
  factory/topics/<id>/claims.json [--only <claim-id>]` repeats that. The repo is the case. Then edit the brief and
  beats to the 75-second format (cut to five beats and at most four structures) and keep only claims the film
  uses; the repo-topic claims file is `{topic, repo, head, window, params, claims}`, so copy the `claims` array
  into the film's `claims.json`.

Templates:

**brief.md**
```
# <Title> · brief
id: `<id>` · room: exec · format: the 75-second case · explorer: <agent>
## The belief                 one sentence a manager says out loud
## The everyday situation     HOOK 0 to 8 s, plain words, no numbers
## The mechanism              one paragraph; what THE COUNT draws
## The fixture                THE CASE 16 to 36 s: one real example, name, place, year, real numbers
## The numbers                | claim id | what | value | source or formula |
## The count                  each mark is one ___; n = ___; lands at ___ of n before any ratio
## The commit                 question?; unit; min, max; film-mode default guess and why (sourced if possible)
## Monday                     the one question to ask at work; the honest limit (what the case is not)
## Takeaway                   one line, ≤ ~60 characters (the brand card)
## Sources (at least 3)       [S1] author, title, year, where in it
## Not this                   the tempting versions we are not making, and why
```

**claims.json**: an array, the schema the gate reads (factory/tools/README.md):
```json
[
 { "id": "built-years", "text": "it took 14 years", "value": 14, "source": "S1",
   "quote": "the sentence or table row it comes from", "renders": ["14 years"] },
 { "id": "overrun", "text": "3.5 times the plan", "value": 3.5, "formula": "actual / planned",
   "source": "derived", "renders": ["3.5×"] }
]
```
`formula` is a JS expression over `film.json.params` (Math names, `Phi`, `ln`, `sum`, `round(x, d)` in scope);
`source` is a key of `sources` or `"derived"`; `renders` lists the exact printed strings; `tolerance` is
optional (default 0.5 for integers, 0.5 % otherwise). `quote` is for the seat, the gate ignores it.

**beats.md**
```
# <Title> · beats
id · dur 75 s = material 0 to 72 s + CETI brand card 72 to 75 s · commit.at 9 s · count.at 38 s
## Structures (at most 4; the brand card is not one)     S-A sheet · S-B case · S-C count · (spare)
## Beat table   | # | beat | window | on screen (structure) | focal motion | claims used |
   1 HOOK 0–8 · 2 COMMIT 8–16 · 3 CASE 16–36 · 4 COUNT 36–62 · 5 MONDAY 62–72
## Captions     | t0 | t1 | text |   28 units, ≤ 2 lines of ~50 characters, no digit without a claim
## Checks before building   digits ↔ claims · no ratio before count.at · nothing from the answer before the seal ·
                            ≤ 4 structures, ≤ 2 cards
```

Explorer's exit test: could a sceptical CFO check every number from the brief alone? If not, keep reading.

## 2 · BUILD (Opus) → factory/films/<id>/

Copy the topic's numbers into `film.json.params` and `claims.json` (add `appears_at`), write film.js, build.
The default build is kit2: the same drawing API as `factory/kit`, with brand, chrome and material injected.

**film.json** (window.FILM; the kit's build.py refuses a file missing any of id, title, eyebrow, lede, dur,
palette, fonts, commit, chapters, captions, brand, sources, honest):

| field | shape | notes |
|-------|-------|-------|
| id, title, eyebrow, lede | strings | eyebrow and lede are page text; keep digits out of chapter eyebrows |
| level | "exec" \| "manager" \| "engineer" | optional, default `exec`. At `exec` the material must be `ink` and the texture `none` or `paper` (G10, DECISIONS Q6); build.py refuses any other value |
| dur | 75 | material 60 to 75 s plus 3 s brand card; total ≤ 78 (G4a) |
| seed | int | the kit's seed for ground and noise |
| palette | {paper, ink, accent, muted, chalk, dark, soft} | hex; role keys fixed by the kit |
| type, fonts | {disp, mono}; [{family, weight, style}] | families as in vendor/fonts.lock.json |
| commit | {at, title, prompt, unit, default, min, max} | at in 8 to 16 s (G4c); page holds 8 s; film mode types `default` |
| chapters | [{id, beat, name, t0, t1, eyebrow, title, card?}] | beat ∈ HOOK, COMMIT, CASE, COUNT, MONDAY in order (G4b) |
| cards | [{id, t0, t1, q: [lines], sub, subAt}] | optional; with `card: true` chapters, ≤ 2 in all (G9) |
| captions | [[t0, t1, text]] | the film is silent: captions carry it (kit draws them) |
| count | {at} | when the count structure is first drawn; no ratio before it (G7) |
| brand | {takeaway, at} | at = dur − 3; the kit draws the CETI card and holds the last material frame |
| sources | [[key, text]] | ≥ 3 (G4f) |
| honest | [lines] | what the case is not; shown on the page and, as the Monday line, on the stage |
| params | {name: number} | the inputs claims' formulas read |
| tryit | {title, note, seek, inputs: [...]} | optional try-it panel; pair with FILM_RENDER.tryit |

**film.js**, the kit contract (factory/FORMAT.md; helper names and signatures: factory/kit/README.md and the
header of factory/kit/kit.js):
```js
(function () {
'use strict';
const F = window.FILM;
let ORDER = null;                                  // precomputed in setup, read in render
window.FILM_RENDER = {
  setup(p, K) { ORDER = K.shuffle([...Array(F.params.n).keys()], F.seed); },   // once; K === window.KIT
  render(t, s, K) {                                // pure in (t, s): same t, same pixels, same SVG
    const { tx, rc, ln, seg, ease, C, LAYOUT } = K;
    K.chrome(t, K.chapterAt(t), { ledger: false, block: { ... } });
    if (t >= F.commit.at - 1 && t < 16) K.commitBox(t, s, { title: F.commit.title, prompt: F.commit.unit });
    // structures: SVG type and lines through the pool (layers field, marks, labels, chrome, cap, card, top);
    // mass (the count's marks) on K.ctx, Canvas2D in 960 × 540 design units
  },
  tryit(values, s, K) { return '<div>...</div>'; },   // optional
};
})();
```
The kit owns the clock, the ground, captions (`FILM_RENDER.captions = false` to opt out), the brand card
(`FILM_RENDER.brand = false`), the player, the commit hold, `?film=1`, and the hooks `window.__film {ready,
seek, only, info}` and `window.__ctrl {play, pause, seek, setState, state}`. The viewer's sealed number is
`s.answer` (a number, `'none'`, or null); place it on the count against the truth only after the seal.

Craft: one focal motion at a time; the count is the hero (marks at true scale, counted in a seeded order);
the case shows real units (years, dollars, people), not indices; captions say what the picture shows.

```
python3 factory/kit2/build.py factory/films/<id> --brand <id> --chrome <id> [--material <id>]
```
Output: `factory/films/<id>/build/<id>.<brand>.<chrome>[.<material>].html`; it prints bytes, sha256, faces and role
contrast. `--brand` is an `arsenal/brands/<id>.json` pack or `film` (the default: a pack made from film.json
`palette/type/fonts`, so the film keeps its own look); `--chrome` is a module in `factory/kit2/chromes/` or
`factory/chromes/`, or `none`; `--material` is an id in `arsenal/materials/drawn` (ink, pencil, stitch, chalk,
marker, blueprint). Without flags the build is `<id>.film.tender-set.html`. Pick a pack the film's mood fits and a
chrome whose content box holds the film (details and what still binds a film to a look: factory/kit2/README.md).
The legacy `python3 factory/kit/build.py factory/films/<id>` (output `build/<id>.html`) still works; the 15 shipped
films' baseline hashes are for it.
Budgets: film code (film.js + film.json + claims.json) < 120 KB; page < 1.3 MB (G8).

**NOTES.md** (the scaffold's stub): what it is (two sentences), the timings table with the structure per
beat, kit helpers used and anything added locally, the gate history (rounds, what each fixed, which WARN rows
stand and why), the seat verdict, the page sha256 (the shipper fills it), honest limits of the build.

## ADOPT · reach for the arsenal (optional, inside BUILD)

`arsenal/` holds pure, seeded, brand-token modules with a card each (`arsenal/<lane>/card.md`; index and "what to
use for what": `arsenal/README.md`). Adopt one only where the beat needs it; the laws do not change. Reach for:

| need in the film | module |
|---|---|
| timing without hand-tuned `seg()` tables: tracks, play/wait/all/stagger, scenes with local time | `arsenal/core/timeline.js` (+ `generator.js`; `arsenal/core/MIGRATION.md`) |
| the count's layout: grid, wall, ring, columns, rows, timeline, tree, scatter, with transitions | `arsenal/structures/structures.js` |
| drawing a diagram, signature or network on (arc-length draw-on) | `arsenal/patterns/reveal` |
| a number or word that changes into another (ticker, word-to-word) | `arsenal/patterns/morph-type` |
| moving the view across a large structure | `arsenal/patterns/camera` |
| pointing: callouts, bars, hand marks, spotlight | `arsenal/patterns/annotations` |
| marks that carry data (rows, scatter, bars) | `arsenal/patterns/data-marks` |
| cutting between scenes (cut, match-cut, zoom-through) | `arsenal/patterns/transitions` |

How: read the module's `card.md` (params, when not to use, pitfalls) and `pattern.js`. The kit does not load the
arsenal's patterns yet (kit2 loads only the brand, chrome and drawn materials), so copy the `pattern.js` (and
`core/timeline.js` or `structures.js` if used) into `factory/films/<id>/lib/` and inline it from film.js; say so in
NOTES.md. A module's `draw(p, t, state, params, tokens)` takes the brand pack (`KIT2.brand`) and reads roles, never
hex. Keep the film's size budget (G8) and exec level (no shader post, no non-ink material).

**Brand workflow.** (1) Pick a pack: `arsenal/brands/README.md` lists 22 (register, ground, ink, accent, faces),
and `arsenal/patterns/palette` renders them all. (2) Or derive one: `python3 arsenal/tools/tweak.py <base> --dark`
(also `--hue <deg>`, `--accent <hex>`, `--contrast <n>`, `--mono`, `--type d/m/b`, `--tempo <x>`, `--texture <name>`;
recipes: `arsenal/tools/TWEAKS.md`); it runs the contrast check and writes `arsenal/brands/derived/<id>.json` only if
it passes. (3) Check any pack: `python3 arsenal/tools/brand_check.py arsenal/brands/<id>.json` (WCAG: ink/bg 4.5,
chalk/panel 4.5, accent/bg 3, muted/bg 3; faces only from `vendor/fonts.lock.json`). (4) Build with
`--brand <id>`; a derived pack is passed by path (`--brand arsenal/brands/derived/<id>.json`).

## 3 · GATE (the builder), loop to PASS

```
node factory/tools/gate.mjs factory/films/<id>/build/<page>.html --film factory/films/<id> --kit factory/kit2 \
     --json factory/films/<id>/gate.json --shots <scratchpad>/factory/<id>/shots
```
`<page>` is the file build.py printed (`<id>.<brand>.<chrome>[.<material>]`). Add `--kit` files for the clock scan
(a legacy factory/kit page needs none). Run it from the plugin root with relative paths (gate.json records them). It prints one row per check and
`VERDICT PASS|FAIL`, exits 1 on any FAIL, and writes 8 stills at 1920 × 1080 (`still-N-TTT.Ts.png`) plus
`phone-390.png`. **Read every still** (Read tool) before deciding you are done: the gate cannot see a
caption over a mark, a count that lands off-screen, or a beat that reads as a dashboard.

| row fails | usual fix |
|-----------|-----------|
| G2a/G2b purity | state leaking across frames: move the computation into setup or make it a function of t; never keep "last frame" variables |
| G3 clock scan | replace Math.random / Date with `K.mulberry32(seed)` in setup |
| G4a to G4f format | fix film.json (durations, beat names, commit.at, brand, honest, sources) |
| G5a formulas | fix the value or the formula, then re-check the source; never tune a formula to fit |
| G5b caption digits | add the claim (or its `renders`) or take the number out of the caption |
| G6 legibility | raise to 28 (must-read) / 14; tag with `data-role` where the class is wrong |
| G7 counts first | move the ratio after the count lands, or move `count.at` to when the count is really drawn |
| G8 size | cut film code; the page budget is mostly the kit, p5 and fonts |
| G9 tics | fewer full-screen cards; let structures carry the turn |
| G10 axes | exec level wants material `ink` and texture `none`/`paper`: rebuild without `--material`, or set `level` to `manager` or `engineer` in film.json if the film is not for the exec room; WARN means kit2 drew a pack's grain/halftone flat |

Between gate runs, the kit's probe is quicker for the live commit (pause, seal, 8 s "no answer") and purity
(`factory/kit2/probe.mjs` for a kit2 page):
`node factory/kit/probe.mjs $PWD/factory/films/<id>/build/<id>.html <abs-shots-dir> 5,20,45,73`.

WARN rows (G5c chrome digits, phone overflow) do not fail but go into NOTES.md with a reason. Three rounds
without PASS: stop, write what fails into NOTES.md, hand back.

## 4 · SEAT (Fable, blinded)

The evaluator gets a packet with no code, no NOTES.md, no gate output and no builder name: the stills, the
claims, the captions, sources and honest lines. Assemble it in the scratchpad (never in the repo):
```
P=<scratchpad>/factory/<id>/seat && mkdir -p $P && cp <scratchpad>/factory/<id>/shots/*.png $P/
python3 - factory/films/<id> $P <<'EOF'
import json, sys, os
d, out = sys.argv[1], sys.argv[2]
f = json.load(open(os.path.join(d, "film.json"))); c = json.load(open(os.path.join(d, "claims.json")))
L = ["# Seat packet", "", "Title: " + f["title"], "Lede: " + f["lede"], "Commit: %s (%s), film-mode guess %s"
     % (f["commit"]["prompt"], f["commit"]["unit"], f["commit"]["default"]), "", "## Captions"]
L += ["- %5.1f to %5.1f  %s" % tuple(x) for x in f["captions"]]
L += ["", "## Claims"] + ["- [%s] %s = %s · %s%s" % (x["id"], x["text"], x["value"], x.get("source", "?"),
      " · formula " + x["formula"] if x.get("formula") else "") for x in c]
L += ["", "## Params"] + ["- %s = %s" % kv for kv in sorted(f.get("params", {}).items())]
L += ["", "## Sources"] + ["- [%s] %s" % tuple(s) for s in f["sources"]]
L += ["", "## Honest limits"] + ["- " + s for s in ([f["honest"]] if isinstance(f["honest"], str) else f["honest"])]
L += ["", "## Stills"] + ["- " + n for n in sorted(os.listdir(out)) if n.endswith(".png")]
open(os.path.join(out, "packet.md"), "w").write("\n".join(L) + "\n")
EOF
```
Seat prompt (give it the packet folder and nothing else): *"You are an exec-room evaluator who did not build
this. From these stills, claims and captions only: (1) re-check every claim against its source or formula;
(2) is the hook an everyday situation, is the commit asked before anything gives it away, is the count drawn
before any ratio, are there at most four structures, is every result readable on the stills, is it exec
clean (no icons, dashboards, clip-art), does Monday give one askable question and one honest line?
(3) give ranked fixes, each tied to a still. A wrong or unsourced claim is a VETO whatever the craft (D5)."*

Verdict, written by the seat to `factory/films/<id>/seat.json`:
```json
{ "film": "<id>", "seat": "fable-exec", "packet": "<sha256 of packet.md>",
  "verdict": "SHIP | REVISE | VETO",
  "truth": [ { "claim": "overrun", "status": "ok | wrong | unsourced", "note": "" } ],
  "checks": { "hook_everyday": true, "commit_before_readout": true, "count_before_ratio": true,
              "structures": 3, "legible": true, "exec_clean": true, "monday_question": true, "honest_line": true },
  "fixes": [ { "rank": 1, "still": "still-5-040.5s.png", "what": "", "why": "" } ],
  "one_line": "the film in one sentence, as the seat understood it" }
```
REVISE goes back to BUILD (fixes in rank order, gate again, one more seat at most). VETO goes back to
EXPLORE for the claim, then BUILD.

## 5 · SHIP (Fable)

1. Rebuild from clean sources and gate once more: the same `build.py` command as BUILD, then the
   gate command above; it must PASS and gate.json must be fresh.
2. `python3 factory/tools/catalogue.py`: rewrites `factory/catalogue.json` (id, title, dur, counts of
   chapters, captions, sources and claims, takeaway, gate verdict, page path, bytes and **sha256**) and
   `factory/CATALOGUE.md` (id, title, duration, gate verdict, sha256). The sha256 is the baseline: write it
   into NOTES.md as `page sha256 \`<hex>\``; `python3 factory/tools/catalogue.py --check` exits 1 if a
   rebuild moves it (builds are byte-reproducible: same inputs, same bytes).
3. Hand the orchestrator the file list. **Committed:** `factory/topics/<id>/{brief.md, claims.json,
   beats.md}`, `factory/films/<id>/{film.json, film.js, claims.json, NOTES.md, gate.json, seat.json}`,
   `factory/catalogue.json`, `factory/CATALOGUE.md`. **Never committed:** `factory/films/<id>/build/` (the
   page; gitignored, rebuilt from sources, and per D8 built pages live in the films repo), stills, contact
   sheets, seat packets, MP4s and anything else in the scratchpad.

## References

| file | when |
|------|------|
| `factory/FORMAT.md` | always; the binding format |
| `factory/kit/README.md`, `factory/kit/kit.js` header | before writing film.js: helper names, layers, layout |
| `factory/kit2/README.md`, `factory/kit2/PROOF.md` | the build path: brand, chrome, material, level; what still binds a film to a look |
| `arsenal/README.md`, `arsenal/<lane>/card.md`, `arsenal/brands/README.md`, `arsenal/tools/TWEAKS.md` | ADOPT: which module, which pack, how to derive one |
| `factory/tools/repo_topic.py` (docstring, `--help`) | EXPLORE from a repository |
| `factory/kit/smoke/` | a 20 s film that touches every kit helper; copy its patterns (its claims.json predates the gate's array form: write yours as an array) |
| `factory/tools/README.md` | the gate rows, the film.json and claims.json fields it reads |
| `films/opera-house/NOTES.md`, `film.js` | the gold standard: the wall, the sealed commit, counts first |
| `docs/DECISIONS.md` | why: Q3 silent, Q6 exec clean, Q8 brand card, Q10 fixtures, Q13 commit, Q14 counts first, D5 truth veto |
