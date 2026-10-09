# HANDOFF · ceti-explainer · branch feature/explainer-atelier · 2026-10-08

Read this first on a cold start. Ten minutes gets you from a fresh clone to a built, gated film.

## 1. Cold start (five commands)

```sh
git clone https://github.com/manutej/ceti-explainer && cd ceti-explainer && git checkout feature/explainer-atelier
pip install -r scripts/requirements.txt          # playwright==1.56.0 (Chromium 1194), fontTools, brotli, Pillow
sh scripts/doctor.sh                              # tools, vendor hashes, kit and kit2 builds, brand packs
sh tests/proofs.sh all                            # seven proofs: every film and demo rebuilds and gates (≈10 min)
python3 factory/kit2/build.py factory/films/goodhart --brand ceti-marketing --chrome memo && node factory/tools/gate.mjs factory/films/goodhart/build/goodhart.ceti-marketing.memo.html --film factory/films/goodhart --kit factory/kit2
```
Needs Node 18+, Python 3.10+, ffmpeg, and a Playwright Chromium. The repo's tools import Playwright from
/opt/node-tools/node_modules/playwright (edit the import line in factory/tools/*.mjs and arsenal/tools/*.mjs if yours lives elsewhere).
Everything is vendored: p5 2.3.4 by hash, 36 font files, no runtime fetches, no Google Fonts.

## 2. What this repo is

A Claude Code plugin (root is the plugin root; see .claude-plugin/plugin.json) that turns a topic into a short,
true, silent, captioned explainer film on a pure clock, and ships it as a standalone HTML page. Three layers:

| layer | where | what |
|---|---|---|
| the factory | factory/ | FORMAT.md (the 75-second case), kit and kit2 (build), tools (gate, catalogue, new_topic, repo_topic), topics/ and films/ (15 shipped films + the showcase), chromes/, README, SHIP.md, SEATS.md, CATALOGUE.md |
| the arsenal | arsenal/ | 24 pattern and material lanes, the timeline and generator cores, structures, 22 brand packs with a contrast checker and a tweak tool, the shoot/sweep/export tools, the design-system bundle |
| the record | docs/ | DECISIONS.md (D1–D10, Q1–Q15: binding), study/ (readers, consults, BLUEPRINT.md, phase-zero proof) |

Older material kept and still building: the Atelier runtime and eight chromes under runtime/ and chromes/, the
System 1 plan library under library/, the SVG episode engine under skills/ceti-explainer, films/opera-house (the
exec-room gold standard, D9), references/ (doctrine, tells, atlas, research), contrib/ (not shipped).

## 3. How a film is made (the pipeline)

1. EXPLORE: `python3 factory/tools/new_topic.py <id> "<title>"`, or from a repository
   `python3 factory/tools/repo_topic.py <path> --id <id>` (every number a verifiable claim). Fill brief.md, claims.json,
   beats.md under factory/topics/<id>/.
2. BUILD: write factory/films/<id>/{film.json, film.js, claims.json}. film.js exposes
   `window.FILM_RENDER = { setup(p, kit), render(t, state, kit) }`; the kit owns captions, the sealed commit, the brand card
   and the hooks. Build with kit2: `python3 factory/kit2/build.py factory/films/<id> --brand <pack> --chrome <tender-set|ledger|memo|none> [--material ink|pencil|chalk|…]`.
   Time with arsenal/core/timeline.js, lay counts out with arsenal/structures, reveal with arsenal/patterns/reveal, etc.
   (copy a lane's pattern.js into the film's lib/; the kit does not load the arsenal yet).
3. GATE: `node factory/tools/gate.mjs <page> --film factory/films/<id> --kit factory/kit2 --json factory/films/<id>/gate.json --shots <dir>`.
   Rows G1–G10: load, purity, clock scan, format, claims, legibility, counts-first, size, tics, axes (exec level = ink only).
   Look at the eight stills once. Two fix rounds at most, then ship with the warnings written in NOTES.md.
4. SEAT: a blind evaluator reads stills, captions and claims (never the code) and writes seat.json (SHIP / REVISE / VETO).
5. SHIP: `python3 factory/tools/catalogue.py`, add the page hash to tests/baselines/builds.json, commit the sources AND the
   built page (D10), publish the page as an artifact.

At scale (factory/PIPELINE.md, proven on factory/films/simpsons-3d, measurements in its PROTOTYPE.md): three Sonnet
drafts from one brief, each with every tunable as a knob (`film.json.knobs` + `knobs_doc`, read via `window.KIT.knob`);
`node factory/tools/frames.mjs <page> --every 0.5 --out <dir>` makes timestamped contact strips; an Opus selector reads
the strips blind, writes SELECT.md and findings.r1.json; `python3 factory/tools/apply_findings.py <film-dir> <findings>`
applies knob, caption, chapter, brand and chrome findings to film.json only, then rebuilds, gates and re-strips; two
rounds, then ship. `film.json.renderer: "webgl"` gives a WEBGL canvas (kit2 README "WebGL"). Films with a `look`
recorded in film.json are kit2 films; tests/proofs.sh vi builds them with kit2.

## 4. Brands and design systems

- A brand is a token pack (arsenal/brands/<id>.json; schema in schema.json): colour roles (bg, ink, accent, accent2,
  muted, line, panel, chalk), type roles (disp, mono, body → vendored faces), texture, tempo, voice. Modules read roles,
  never hex. `python3 arsenal/tools/brand_check.py <pack>` enforces WCAG contrast and vendored faces.
- 22 packs ship: four originals, eight generic registers, ten derived from the CETI design system (marketing, four
  academy palettes light and dark, owala soft). Derive more: `python3 arsenal/tools/tweak.py <pack> --hue 30 --dark …`
  (recipes in arsenal/tools/TWEAKS.md; 22 twins in arsenal/brands/derived).
- Proof the axes are real: factory/kit2/PROOF.md rebuilds two films under four brands × four chromes with zero film
  edits, 32 of 32 gates passing.
- The Claude Design project "CETI Explainer Arsenal" holds the bundle (brand cards, lane cards, chromes, proof matrices,
  tokens). Regenerate with `python3 arsenal/tools/ds_bundle.py`; sync from a session with design access.

## 5. The laws (do not change without a dated row in docs/DECISIONS.md)

One clock: every frame is render(t, state), seeds fixed, no Math.random/Date/frameCount in a renderer. Counts before
ratios. The viewer commits a number before any number is shown. Every digit on screen is a claim with a formula or a
source. Silent, captions carry it. One honest-limits line. The CETI card is the last frame. Exec level is ink and clean.

## 6. Where things are published

factory/ARTIFACTS.md: the fifteen films, the showcase, simpsons-3d (P1), the Opera House, the film gallery, the arsenal gallery. The Design canvas with
the blueprint: https://claude.ai/artifact/B1gL55RNtMpo9fp44gWyZG. All private until shared.

## 7. Open issues (honest list)

- The kit does not load arsenal modules; films copy pattern.js into lib/. Next: a loader and a film.json `uses` list.
- Film text is still positioned in absolute 960-basis coordinates tuned to a condensed display face; brand switches
  stay legible by scaling, not by reflow (factory/kit2/PROOF.md lists the bindings).
- Four Atelier chromes (bunraku, delta, ledger, marbling) need fontsource faces to rebuild; the studio scripts named
  in skills/p5-explainer are not written (factory/SHIP.md, MERGE-NOTES.md).
- Arsenal lanes were mostly shot under one pack; arsenal/SWEEP.md records which lanes truly read token roles.
- The two cohort experiments (film versus static, commit on versus off) are deferred (Q12): the quality bar is a
  design claim until they run.
- Two stray files written by an agent at the container root (/results.prev.json, /x/) could not be removed by the
  orchestrator's safety check; they are scratch and safe to delete.

## 8. Routing that worked

Haiku reads and catalogues; Sonnet explores, consults and builds pattern lanes cheaply; Opus builds films, kits and
tools; Fable directs, evaluates blind and ships. One brief per wave, one contract per module, one gate run plus at
most two fix rounds, ship with warnings written down. Commit per lane as it lands.
