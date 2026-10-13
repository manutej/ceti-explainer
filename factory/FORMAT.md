# The explainer factory · shared brief for every agent

Date 2026-10-08. Repo: /home/user/ceti-explainer, branch feature/explainer-atelier (do NOT run any git
command; the orchestrator commits). Scratchpad for your own notes/screenshots:
/tmp/claude-0/-home-user-ceti-explainer/6930f3f9-c0aa-53bb-b023-bfc602f4df5e/scratchpad/factory/<your-id>/

## What we are building
A factory that turns a topic into a short, exec-room explainer film that passes a gate, in minutes.
Everything lives under `factory/` in the repo:

    factory/README.md            how the factory works (the shipper writes it last)
    factory/FORMAT.md            the 75-second case format (this brief's "Format" section, copied)
    factory/kit/                 the reusable kit: shell.html, kit.js, player.js, build.py (kit builder)
    factory/tools/gate.mjs       the gate (gate builder)
    factory/topics/<id>/         brief.md, claims.json, beats.md   (explorers)
    factory/films/<id>/          film.json, film.js, claims.json, NOTES.md; build/ is gitignored (builders)

## The gold standard you are deriving from
films/opera-house/ (read NOTES.md first, then film.js and page.js, then shell.html). It is a 4:29 feature
film; ours are 75 seconds. Reuse its mechanics exactly: retained SVG pool (E/tx/ln/rc/dim/stamp/caption/
card/roll), p5 2.3.4 Canvas2D for texture and mass, one clock `render(t, state)`, film mode `?film=1`,
hooks `window.__film {ready, seek, only, info}` and `window.__ctrl {play, pause, seek, setState, state}`,
vendored fonts and p5 from vendor/ by hash (see films/opera-house/build.py for how a page is assembled).

## Format · "the 75-second case"  (binding; from docs/DECISIONS.md)
- Canvas 960 by 540 design units, rendered at 1920 by 1080 in film mode; the live page wraps the stage
  with a player (play, scrub, CC, chapters), a try-it panel, a transcript, sources and honest limits.
- Length 60 to 75 s plus a 3 s CETI brand card at the very end (decision Q8): the material's last frame
  holds, then a plain card: "CETI" wordmark line, the film's one-line takeaway. Silent (Q3): captions carry
  it; no audio at all.
- Five beats, in this order, at most four visual structures in the whole film. The COMMIT beat is optional and
  off by default (D11, film.json `commit.enabled`): without it the film is four beats and plays straight through,
  and the commit law below binds only films that enable it; counts first, the honest line and the card still bind.
  1. HOOK (0 to 8 s): the everyday situation a manager actually faces, with the thing people believe.
  2. COMMIT (optional, D11; 8 to 16 s): ask the viewer for one number. The live page pauses and holds for 8 s
     (an input box; "no answer" after the timer); film mode uses a default guess from film.json (Q13).
     Nothing numeric from the answer is shown before the commit.
  3. THE CASE (16 to 36 s): one real worked example with real, sourced numbers. Each concept brings its
     own fixture (Q10); never base rates, the planning fallacy, or the AI agent loop (already done).
  4. THE COUNT (36 to 62 s): the mechanism shown as a count, drawn before any percentage or ratio
     appears (counts first, Q14): a wall, a grid, a row of marks, whatever the concept is made of; then
     (commit on) the viewer's committed number placed on it against the truth.
  5. MONDAY (62 to 72 s): the one question to ask at work; one honest-limits line (what the case is not).
- Exec clean (Q6): typeset numbers in a mono face, paper and pencil texture at most, no hand-drawn
  figures, no icons, no dashboards, no chart-junk. Big marks at true scale; few words.
- Truth: every digit on screen comes from claims.json (value, formula or source, and where it appears).
  The gate recomputes formulas; a false or unsourced claim fails the film. At least 3 sources.
- Legibility: must-read text (headline numbers, the count, captions, the commit box) at least 28 units;
  everything else at least 14 units; results never in the smallest face. Chrome text (eyebrows, ledgers)
  may be 12 units but must not carry a result.
- Purity: `render(t, state)` is a pure function; no Math.random/Date/performance/frameCount/millis in the
  renderer (seeded mulberry32 for any shuffle; p5 noiseSeed fixed). Re-seeking to t must give identical
  canvas pixels and identical SVG (clear style="" and text when an element is hidden).
- Size: film code (film.js + film.json + page) under 120 KB; the built page under 1.3 MB.

## Routing
Opus agents explore, synthesise and build. Two Fable agents evaluate (blinded, on stills and claims) and
ship. The orchestrator commits. Nobody edits files outside their assigned folder except the kit builder
(factory/kit, factory/FORMAT.md) and the gate builder (factory/tools). Builders use the kit as published;
if the kit lacks something, add it to your own film.js and say so in NOTES.md, do not patch the kit.

## Tooling in this container
Node 18+ with Playwright at /opt/node-tools/node_modules/playwright/index.mjs
(import { chromium } from that path; launch with executablePath '/opt/pw-browsers/chromium-1194/chrome-linux/chrome').
Python 3 with playwright 1.56.0, fontTools, Pillow. scripts/paths.py finds the plugin root.
Vendored: vendor/p5-2.3.4.min.js; vendor/fonts/*.woff2 (Big Shoulders Display 600, IBM Plex Mono 400/500,
DM Sans, Space Mono, Fraunces, Jost, Newsreader, Red Hat Mono, Sofia Sans Extra Condensed, ...; see
vendor/fonts.lock.json). Never link Google Fonts; never fetch anything at runtime.

## How to report
Write your deliverables to disk in your folder. End with a short handback: what you wrote (paths), what
passed, what you could not do and why. Keep it under 300 words.
