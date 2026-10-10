# one-query · draft B · "the denominator"

Look: brand ceti-boardwalk-dark, chrome none, material ink, level manager, renderer webgl, format feature-long, dur 153,
commit off (D11), chapters HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150 (+ card).
Build: `python3 lib/assemble.py && python3 <gen film.json> && python3 factory/kit2/build.py factory/films/one-query/drafts/b --brand ceti-boardwalk-dark --chrome none`
(film.json is generated from the `kd(...)` knob lines in lib/film.src.js plus the claims params and rig script; edit film.json knobs directly afterwards if you like.)

## Register
A dark stage where the same marks are shown against a larger base each time, and the camera goes back by a fixed ratio so the
block shrinks against its base; the previous view stays as a dashed frame (nested frames), and the denominator is a word,
top left: per query, per site, per grid, per own grid.
- PER QUERY (12-55): one lit mark (HOOK: still to 8 s, then a push; two true sentences in display type over the same mark),
  a ruler equal to the mark that never changes size, microwave and bulb anchors in plain strokes, the log ladder 1 to 10^5
  (scale-anchor spiral + `level(t)`), each rung a dashed frame inside the next. Ladder moves are retimed to the captions (ladderT0 34.6).
- PER SITE (55-66): second tile tier, film-side: the 10^5-query field (baked once from the same routine) becomes ONE tile and
  the same zoom runs five more decades to 100,000 tiles (1 tile = 100,000 queries = 24 kWh); 2.4 GWh, then 100,000, then 10 billion.
- PER GRID (66-99): hard cut to 3D. 27,667 marks in the module's spiral (415 inked cubes in the centre = 1 TWh each, 27,252 grey,
  3 chunks); 415 count-in, one dolly back (`camBackFactor`, 3.5) to the whole field (1.5 %), then the SAME 415 cubes travel (two homes
  per cube, one vertex shader) into four region stacks (187/104/62/62) under a 30 deg orbit; ghost slots stay where they were.
- PER OWN GRID (99-135): seven mesas (40 x 25 matrix built from the claim params, sum asserted = data/terrain-matrix.json) in plan
  view, rows counting in; the camera tilts up ONLY when the Ireland column is cut (104.5), cut hops to the US column (121), settles on
  an elevation view; results sit in a fixed HUD row (never two close, at most two at once); MONDAY dims the terrain 40 %, the question
  (per query? per site? per grid?) and the honest line ON STAGE naming the assumptions.

## Chain
scale-anchor (spiral table, ladder level; its own draw cut), gl-heightfield (mesh, shader, terrain()), gl-camera-rig (one script in
film.json `rig`, 42 `cam*` knobs from toKnobs), gl-labels (`solve` only; pins emitted as K.tx/K.ln with roles). The world marks are the
film's own geometry (direct p5.Geometry, heightfield technique); gl-instances was not added to the chain.

## Patches (lib/assemble.py, exact-substring or line-range cuts on the generated bundle; lib/*.js are verbatim copies)
- scale-anchor: `draw` and its panel UI cut (stub `draw(){}`); setup/level/spiralIdx kept.
- gl-heightfield: `zs` z-stretch (cellZ) in buildMesh; vertical skirts (the terrain is a solid, not a sheet); `api {terrain}`;
  flat pins/HUD/profile and the demo draw cut.
- gl-camera-rig: demo scene cut, `rig` exported. gl-labels: drawing and demo cut, `{ROLES, solve, project}` exported.
- Bundle goes through film.json `libs` (arsenal.gen.js 42.7 KB); film.js comment-stripped (32 KB).

## Moves (R-E): sentence, invariants
1. re-scale, log zoom (ladder): holds the mark and the anchor; same spiral cells; n = round(10^L) = marks drawn.
2. re-stack against a base, dolly back x3.5 (world field): same 415 cubes, same count, same lens; the grey backdrop is in the scene before the dolly.
3. re-partition by region (orbit 30 deg, r x0.3, el constant): 187+104+62+62 = 415, no fade.
4. slice at Ireland then the US under a tilt/slow swing: seven cells, scale 0..25 fixed, cut snaps to a real column.
Moves start at 34.6 (ladder), 55.4, 74, 83, 104.5, 121: the 74-83 and 83-104.5 gaps are >= 8 s; ladder rungs are 3.9 s apart (one continuous log zoom).

## Gate (final run: VERDICT PASS, G1-G11; G11 clean) and warnings left
See gate.json. WARN: G5c only running counters (the inked-mark count-in 19, 116, 248, 365 at 67-70 s; the ladder values 86 s,
14 min, 240 Wh etc. are computed from gemWh and microW on screen, not separate claims);
G6 phone scroll overflow is the shell's. Page 1.287 MB (13 KB headroom), film code 69.5 KB.
Left open for SELECT: plan view of the terrain is a flat strip (the matrix is ridges across all 25 rows; zs 0.4 only partly squares them);
only some of the seven pins survive in plan view; the 7,663 GWh result lands while the tilt is still moving (HUD is flat and still, so legible);
ruler label "FIRST QUERY, TO SCALE" is tight to the panel; ladder values between claims are computed, not claimed.
Findings from the brief still apply: "all data centres, not AI alone" is said on stage; assumptions are in the honest line.

Final numbers: frames.mjs 307 frames, 0.627 s/frame, purity identical, 0 errors; ready 2.6 s (3-6 s when the host is loaded: G1 failed once at 5.0 s under load 30); 117 knobs (75 film, 42 cam*); sample/sample.mp4 = first 10 s at 30 fps.

## After tier 1 and tier 2 (ship state)
Rounds r1 (7) and r2 (1) applied by factory/tools/apply_findings.py; tier-2 film.js revision in REVISION.md (eight ladder claims,
the +2.1 % growth slab, a true scale bar, flat-topped terrain, pins on their own mesas, 1.5 % on a flat plan, the 415 TWh check
line). film.json is the source of truth. Director seat in seat.json; measures in MEASURES.md.
Data caveat: numbers were read from search snippets (egress blocked); +2.1 % US demand growth 2025 is grade B. Re-verify the
primaries (Google 2025 paper, IEA Energy and AI 2025, IEA Electricity 2026, LBNL 2024, CSO 2025, Ember 2024) before public use.
