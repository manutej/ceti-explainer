# women-and-children · draft B · "the deck plan" · NOTES (2026-10-10)

Look (beats.md header): brand `ceti-boardwalk-dark`, chrome `none`, material `ink`, level `manager`, renderer `webgl`,
format `feature`, dur 123 (120 s material + CETI card). Commit off (D11, `"commit": {"enabled": false}`); chapters
HOOK 0–12 · CASE 12–58 · COUNT 58–108 · MONDAY 108–120. count.at 24.0.

## Register
A top-down PLAN first: the 2,201 boxes land as three one-layer carpets (women, children, men) on a gridded deck, so each
count is an area and the survivors light bottom-up as rows (a bar chart read from above). The plan tilts into 3D only when
the split happens (48.5–56 s): the boxes rise into twelve rate slabs (22 layers each, lit height = rate) while the camera
turns 78°. One hard key light from one side (`keyAz`, `keyEl`, `ambGain`). For the third-class children the camera drops
to deck level (el 3°), pans along the deck to the first-class men, then pulls back for the reveal: everything but the
two counted slabs dims, and only the lit 27 and the lit 57 are emissive (bloom through gl-post; tone map every frame).
"Deck plan" is a camera register only: no ship geometry, no decks, no lifeboats (brief: "no deck plans" as a why-claim).

## Chain (three structures + the kit's type sheet)
gl-stack-city (CASE: arrive, lit, pooled pins, split, tags) → gl-labels (COUNT A/C: 11 slab pins + hard-cut callout
6 OF 6 → 24 OF 24 → 27 OF 79 → 57 OF 175, later 192 OF 862) → gl-post (COUNT B reveal + MONDAY glow; tone map always).
Modules are lib/ copies; lib/assemble.py writes film.js (run twice: byte-identical). film.src.js is stripped too (G8).

## What I patched (CUTS in assemble.py; lib/*.js are verbatim)
- gl-stack-city: `slot()` mirrors rows inside a slab (fill from +z), so pooled carpets grow from the near edge in plan.
  Module shader/camera/hud/pins cut; exported `api {phase, boxAt, check}` and a setup that only resolves data and bakes.
  The film's own vertex shader keeps the module's motion formula, adds linear-light colours (`toScene`), a per-cell
  mask and emission. Empty CREW/CHILDREN cell (n = 0): lays out as a 1-cell gap, 0 boxes, no anchor, no pin; `check(t)`
  OK on 61 samples, unitsResidual 0, k = 1 (2,201 boxes).
- gl-labels: a secondary label's sub line is secondary 14, not chrome 12 (the slab % is a result). Demo drawing cut;
  the film emits SVG itself (plates, per-line opacity: each % lands `ratioDelay` 1.5 s after its count).
- gl-post: demo variants cut. `ARSENAL.post` added to the assemble header.

## Gate, cost, size
Gate PASS (G1–G10). WARN G5c: 11 running values of the arrival counter (279 … 2,020, 12.4–23.6 s): counts in progress,
the final 2,201 is the claim. s/frame 0.677 mean (frames.mjs, every 0.5 s), 0.941 on the re-run after the fix round (shared host, the MP4 export running beside it); probe reveal frames ≈ 0.9–1.0 s.
Page 1,266,790 B; film code 116.2 KB of 120 (claims.json is 43 KB, so knob `what`s are short). 124 knobs.
Sample: sample/sample.mp4 (10 s, 30 fps; the GIF step errors by design, removed).

## Left open
- The 32 cells are unverified (brief NOTES): every on-screen number inherits that.
- Captions c15, c18 run past 60 characters (brief wording, two lines); the Monday type sheet repeats c19/c20 by design.
- Dimmed slab pins during the callouts sit at 0.35 opacity; at deck level some pins crowd out (solver `crowded`).
- `dofGain` 0 (cost); `grainGain`/`chromaGain` 0 (engineer level only).
- Fraunces has no ADV entry in kit2: label widths use a 0.5 em estimate.
