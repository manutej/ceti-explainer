# one-query · REVISION (stage 4, tier 2) · 2026-10-10

Reviser: Opus. Input: draft b with SELECT rounds 1 and 2 applied. Scope: the law item, then SELECT's tier-2 "Beyond scope"
list in the order the brief gave. Times are film seconds. Duration is unchanged at 153 s, chapters unchanged.
Build: `python3 lib/assemble.py && python3 factory/kit2/build.py factory/films/one-query --brand ceti-boardwalk-dark --chrome none`.
lib/assemble.py writes only lib/arsenal.gen.js and film.js. No lib script writes film.json (checked), so nothing needed patching.
film.json was edited in place and kept compact. Every r1/r2 knob and caption value is preserved.

Final gate: **PASS** G1-G11, and **G11 is clean** (307 samples, 112 texts, no overlap, nothing across the caption band).
G5a: 71 claims, 71 recompute. G8: film code 81.4 KB, page 1.294 MB (6 KB under the 1.3 MB line).
Frames: re-stripped at 0.5 s, purity identical. Before/after: revision/before-after.jpg.

## What changed, item by item

### 0. The law: every per-rung readout now has its own claim (34.6-55.4 s)
- I added 8 claims to claims.json. Each has a formula. The microwave claims name the stated 1,000 W assumption (microW)
  and the on-stage honest line that carries it.
  - `rungQ`: [1, 10, 100, 1,000, 10,000, 100,000] queries.
  - `rung2Wh`: 24 Wh. `rung3Wh`: 240 Wh. `rung4Kwh`: 2.4 kWh.
  - `rung2MicroS`: 86 s. `rung3MicroMin`: 14 min. `rung4MicroH`: 2.4 h. `rung5MicroH`: 24 h.
- I extended the `where` field of the claims that already cover rung 10^1 (dayWh 2.4 Wh, dayMicroS 8.6 s) and rung 10^5
  (tileKwh 24 kWh).
- G5c now passes these by claim. Before, 14 min matched bulbS, 24 h matched hoursDay and 2.4 h matched dayWh.

### 1. "About half of US demand growth" is drawn (128.2-135 s)
- Sourced claim: `usDemGrowth25` = +2.1 %, grade B. It is S3 (IEA Electricity 2026), read through search extractions;
  sources.md lists it as "US demand +2.1 % in 2025 (B)". It is A/B, so it is drawn and not left to the caption.
- What's drawn: a slab of 2025 US new demand stands in front of the US mesa, with the US mesa's own width, on the mesas'
  own scale (% of the US grid). It is labelled flat: "NEW US DEMAND, 2025 / SAME SCALE AS THE MESAS".
- Order, whole before half:
  - 128.2 s: the slab lands grey, with the readout "+2.1 % US DEMAND GROWTH, 2025".
  - 131.4 s (new knob `halfAt`): its lower half inks in accent2, and "about half / OF IT: DATA CENTRES" lands. Results
    stay at 2 or fewer at a time.
- Caption 24 became two captions:
  - 128.2-131.0: "In 2025, US demand grew by about 2.1 %."
  - 131.4-134.8: "Data centres were about half of that growth."
- Knobs `slabGap` and `slabD`. A derived claim `usDcGrowth25` (about 1 point, not printed) covers the inked half.

### 2. The stale ladder ruler (12.4-66 s)
- The tick is now a true scale bar: one mark wide as the marks are drawn now, and it shrinks with the zoom.
- The labels are now "1 MARK = 1 QUERY" with "THE TICK IS ONE MARK WIDE", and from 55.6 s "1 MARK = 1 TILE".
- Both false labels are gone: "SAME SIZE, EVERY RUNG" and "FIRST QUERY, TO SCALE".
- The microwave icon stays the fixed human-scale anchor.

### 3. Flat-topped terrain with vertical steps (99-135 s)
- New mesh: film-side `stepMesh` replaces gl-heightfield's smooth mesh.
  - Every cell is a level top at its value, with a vertical wall wherever two neighbours differ (I4).
  - Same cells, same values, same module shader. The cut band, row reveal and ramp are unchanged.
  - The rounded shoulders are gone, so a section reads as a step profile, and the low mesas read on their walls.
- The plan ribbon (99-104.5 s): depth is no longer data-coupled.
  - The plan view draws at `zPlan` 0.35 cell depth, so the seven equal footprints read.
  - Depth squashes to `zStretch` 0.2 only through the tilt, 104.5-109 s.
  - The `zStretch` knob floor is lowered to 0.05 for later tuning.
- All seven pins, with years, now sit above the strip in plan.

### 4. The Netherlands pin no longer covers Ireland (110-135 s)
- The Ireland mesa's projected body (below its own pin) is passed to gl-labels as a reserve rect. From 122.4 s the US
  mesa's body is too.
- The Netherlands pin now sits above its own mesa. No plate lands on the hero mesa or on the cut mesa.

### 5. 1.5 % lands flat, with the grey legend on stage (74-83 s)
- The "back" move is now one dolly-and-crane (an orbit to el 89, r 5.9, aim panned so the field clears the HUD), 74-77 s.
  It lands on a plan view of the whole field: 415 inked cells in 27,667, an undistorted square. There is no trapezoid.
- The legend "GREY = THE REST OF THE WORLD'S GRID" is on stage from 77.0 s (`legendAt`). 1.5 % lands at 77.4 s, as before.
- At 82.8 s a cut (P13, 41 deg) returns to exactly the old oblique pose, so the regroup from 83 s is unchanged.

### 6. The "= 415" check line and staggered shares (88-99 s)
- The three-share plate that covered the China stack is gone.
- The counts land as before: 187 at 88.4 s, 104 at 92.0, 62 at 93.8.
- The check line "187 + 104 + 62 + 62 = 415 TWh · SAME MARKS" lands at 94.6 s (`checkAt`), on a reserved band above the
  caption.
- Each share then lands on its own stack's pin, one at a time: US 45 % at 95.8 s, China 25 % at 96.6, Europe 15 % at 97.4
  (`shareStep` 0.8).

### Also
- I stripped the eyebrow's "· draft B (the denominator)" suffix, as SELECT asked for tier 2.

## What I left, and why
- **Regroup staging** (item 7: colour in flight, push to r 0.3 while the marks fly). It is outside the brief's list.
  The plan landing deliberately returns to the old pose, so the regroup is untouched.
- **Settle before 7,663 GWh** (item 8). It still lands at 105 s while the tilt runs, and the depth squash now shares that
  tilt. Moving it needs ieAt and the tilt retimed against the row count-in, which round 2 already ruled out.
- **"Not independently verified"** on the honest line (item 10) and the **MONDAY callback** (item 11). Not in the list.
  The honest line on stage is unchanged and still single.
- **Phone 390 overflow** (scrollWidth 604/390). This is the kit/shell's, not the film's.
- **factory/topics/one-query/claims.json** was not synced. The film's claims.json is the one that gates.

## Warnings to ship with
1. **G5c WARN: the count-in counters 19, 116, 248, 365 at 67-70 s.** These are running counts of inked marks (1 to 415,
   marks drawn = number shown). They are not claims by design. This was carried from the draft, and SELECT asked for it
   to be recorded.
2. **US growth slab, grade B.** +2.1 % is S3 read through search extractions, not opened. Open the IEA Electricity 2026
   demand page before ship (sources.md lists the lines). The slab is 2025 and the mesa beside it is 2023; both years are
   printed on stage.
3. **A cut 0.2 s before a move** (82.8 s cut, 83.0 s regroup). The cut returns to the pose viewers already saw at 74 s.
   It reads as a return, but there is no settle between the cut and the move.
4. **Depth squash inside the tilt** (104.5-109 s). The cell depth changes during a camera move (T5: one change at a time).
   Depth is not data and the cells are unchanged. 7,663 GWh still lands mid-tilt (pre-existing).
5. **Page 1.294 MB**: 6 KB under the cap. Any further film.js or film.json growth must be paid for.
6. **The low mesas still carry a thin top face at el 14.** The ratio is now read on the walls (flat tops, vertical
   steps), but the silhouettes still slightly understate Ireland/World (true 15x).
7. G11 cannot see canvas. The terrain, slab and field clearance from the caption band was checked by eye on the thumbs.
