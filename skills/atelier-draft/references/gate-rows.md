# gate-rows · G1-G10, what each checks, why it fails, the fix that keeps the laws

Sources: factory/tools/gate.mjs, factory/tools/README.md, factory/SHIP.md, factory/kit2/README.md.
Run: `node factory/tools/gate.mjs <page.html> --film <film-dir> --kit factory/kit2/kit2.js --kit factory/kit2/player.js
[--json f] [--shots dir] [--quick]`. FAIL exits 1; WARN and SKIP never fail. A `--kit` directory is accepted (scans *.js).
Rows sort G1..G10. Stage is driven by `__film.seek`; text is read from the SVG only (canvas digits are invisible to G5c/G6/G7).
Plan: one gate run, then at most two fix rounds; ship with every remaining WARN written in NOTES.md.

| row | checks | threshold |
|---|---|---|
| G1 load | film mode + live mode boot; console/page errors; `<meta charset=utf-8>` in the first 2 KB; `ready()` time; stage luminance s.d. at 0.2/0.5/0.8 x dur | 0 errors; ready < 5 s; s.d. >= 2 |
| G2a purity canvas | `toDataURL` of every stage canvas at 0.1/0.3/0.5/0.7/0.9 x dur, re-seeked after visiting another time; A->B vs B->A on two pairs | byte-identical |
| G2b purity SVG | `innerHTML` of the stage SVG, same seeks | byte-identical (first diff printed) |
| G3 clock scan | film.js + film.json `libs` + `--kit` files, comments blanked: Math.random, Date, performance.now, frameCount, millis(), requestAnimationFrame, deltaTime, p.random | 0 hits (player files may use rAF/Date/perf) |
| G4a duration | material = dur - brand.dur (else dur - brand.at, else 3) | case 60-75 s, total <= 78; feature 90-120 / 123; smoke 5-20 / 25 |
| G4b five beats | chapters mapped by `beat`, `id`, `name`, `title` | HOOK, COMMIT, CASE, COUNT, MONDAY in order, t0 ascending; SKIP if no chapter names a beat |
| G4c commit time | `commit.at`, else `T.commit`/`T.ask`, else COMMIT t0 | 8-16 s |
| G4d brand card | `brand.takeaway` non-empty; frame at dur-1 not blank | s.d. >= 2 |
| G4e honest line | `honest` / `limits` / `honesty` / `honestLimits` | non-empty (string or array) |
| G4f sources | `sources` | >= 3 |
| G5a claims formulas | each `formula` evaluated in a node vm; each claim needs `source` or `formula` | `abs(result - value) <= tolerance` (default 0.5 for integer values, else 0.5 % of value); vm timeout 200 ms |
| G5b caption digits | every number in `film.captions` vs claim values (and x100, /1e3, /1e6) at the printed precision | none unknown; clock times (0:51), years 1800-2100 and text inside claim `renders` ignored |
| G5c on-screen digits | same test over every visible SVG text sampled every 0.5 s (1 s with --quick) | WARN only |
| G6 legibility | visible SVG text (opacity > 0.3, centre inside the sheet) at 6 times, size in design units, class from nearest `data-role`, else layer `cap` = must-read, else size (>= 22 must-read, >= 12.5 secondary, else chrome); phone shot at 390 px | must-read >= 28, secondary >= 14 (FAIL); chrome < 12 WARN; phone scroll overflow reported |
| G7 counts first | first `%`, "N in M", "N out of M", "N:M odds", "per cent" in SVG text or caption vs `count.at` (else COUNT chapter t0) | no ratio before the count; SKIP if neither declared |
| G8 size | film.js + film.json + claims.json; built page | code < 120 KB; page < 1.3 MB |
| G9 tics | full-screen cards = chapters `card:true` + `film.cards`; countdown ring from `T`/`timings` keys or `device` values matching ring/countdown | cards <= 2 (FAIL); ring outside the COMMIT window WARN |
| G10 axes | `__film.info.axes` (else meta kit2); level = film.json `level`, else axes.level, else exec | exec needs material ink and rendered texture none/paper (FAIL); WARN when a grain/halftone pack was drawn flat; SKIP with no axes |

## Per row: usual cause and the fix that does not break a law

**G1.** Cause: a thrown error in `setup`/`render` (undefined knob, shader compile error, missing `fonts3d` key at
runtime), a missing font face, a blank canvas at 0.2 dur (the film draws nothing until late), webgl `ready` slow from
heavy `buildGeometry` / `createShader`. Fix: read `window.__error` and the printed first two errors; bake geometry once
in `setup`; give every beat something drawn (idle platter, ground, headline); wrap an optional post shader in try/catch
and fall back to no post (the simpsons film keeps `st.neonErr`). Never add a runtime fetch.

**G2a / G2b.** Cause: state carried between frames (accumulators, "last t" closures, framebuffer feedback), `p.noise`
without the fixed seed, a shuffle not seeded from `K.SEED`, lazy `setup` inside `render`, a camera not set from t,
GL filter state left bound. SVG: keys not stable, text left on a hidden element, element attributes dependent on call
order. Fix: recompute everything from `(t, state, K.knobs)`; `K.shuffle(arr, seed)` or `K.mulberry32(seed)`; set
`p.noiseSeed` only through the kit; use `K.tx/ln/rc` keys (endFrame clears hidden elements). The pooled-element
hygiene failure of films/opera-house (hidden element keeps `style="display:none"` and stale text) does not occur in kit2.

**G3.** Cause: any banned token, including inside a string literal (comments are blanked, strings are not): a label
"Date (UTC)" trips `Date(`; `p.randomSeed` is fine, `p.random(` is not. Libs and arsenal patterns are scanned too.
Fix: replace by `K.mulberry32`; reword the label; for a vendored lib, copy and strip the clock use into `lib/`.

**G4a.** Cause: dur 75 with `brand.at` 70 makes material 70 (ok) but dur 80 or brand.dur 2 puts material over 75.
Fix: dur = material + 3 where material is 60-75; set `brand.at = dur - 3`. Chapters end at `brand.at`.

**G4b.** Cause: chapter `beat` strings missing or out of order; a sixth beat; MONDAY before COUNT. SKIP is silent: always
set `beat`. Fix: five chapters named exactly HOOK COMMIT CASE COUNT MONDAY, `t0` ascending, `t1` of one = `t0` of next.

**G4c.** Cause: `commit.at` < 8 or > 16 (the live pause arrives before the viewer understands the question, or too late).
Fix: `at` 10-12; HOOK ends before it; no number from the answer is shown earlier. Keep `commit.default` set (film mode).

**G4d.** Cause: empty `takeaway`, or the card frame blank because `brand:false` and the film draws no card. Fix: leave
`brand` auto; `takeaway` is the one-line takeaway, <= ~60 chars so it wraps to <= 2 lines at 34 units.

**G4e / G4f.** Cause: `honest` empty or absent; fewer than 3 `sources`. Fix: one honest line (what the case is not);
>= 3 `[key, citation]` pairs, every claim `source` key present there (or `derived`/formula).

**G5a.** Cause: formula uses a name not in `params`/count numbers/claim ids (ReferenceError shows as "formula throws");
value rounded differently from the formula (integer values tolerate 0.5, decimals 0.5 %; set `tolerance`); a claim with
no `source` and no `formula`; vm 200 ms timeout when several gates run in parallel (README: known, 1 s would be safer;
re-run alone). Fix: put every datum in `params`, write the formula over them, add `tolerance` for rounded display
values, cite a source key. Do not weaken a formula to match a wrong figure; fix the figure.

**G5b.** Cause: a caption carries a number no claim holds ("2 of 6", "3 points", "44 %"). A claim `value: 0.51` covers
"51" (x100); `value: 1385` covers "1,385" and "1.4" (/1e3 at 1 decimal). Fix: add the claim (with formula or source),
list the printed strings in `renders` (their digits are then covered even if the number is not a value), or reword
without digits. Captions with the clock or a year need nothing. Counts before ratios also holds in the caption text:
the evaluator moved a "51 % ... 7 %" caption to "1,385 of 2,691 men ..." (simpsons findings r1/r2).

**G5c (WARN).** Cause: running counters (rows landing, tallies, "N of M" as marks arrive), axis ticks, the commit
box's countdown digit (3, 2, 1) and typed default. kit2 tags the countdown `data-role="chrome" data-kit="countdown"` but
gate.mjs does not yet skip chrome-role text or accept a number strictly between 0 and a claimed value (kit2 README
defect 7, open), so a counting film shows 12-46 WARNs (simpsons-3d: 21). Fix: none required; list the cause in
NOTES.md ("counts in progress, final values are claims"). To shorten the list: tick values as chrome-role text, avoid
intermediate readouts when a jump-cut works. Never "fix" it with a fake claim.

**G6.** Cause: SVG text under 28 (must-read: captions, headline numbers, the count, the commit box, results) or under
14 (secondary labels); text untagged and large enough to be classed must-read by size 22-27.9 (an untagged 24-unit
label FAILs); display-face compensation shrinking text (floors 28/14/12 hold); content-box scaling in a ledger/memo
chrome; stamp text under 14. Chrome text < 12 only WARNs. Fix: raise the size knob (range minimum = the floor);
pass `role: 'secondary'` for labels of 14-27 units and `'chrome'` for eyebrows/ticks (never a result); wrap with
`K.wrap` or cut words rather than shrink; give crowded groups more air (gap knob) instead of smaller type. Phone: the
live page uses 390 px width; scrollWidth > clientWidth is reported, fix with the shell not the film.

**G7.** Cause: a percentage or "N in M" on screen or in a caption before `count.at`. `count.at` defaults to the COUNT
chapter t0, so declare it as the second the counted structure is first drawn (before ratios, usually inside CASE).
Fix: show counts ("1,198 of 2,691") then the ratio; move the ratio text later, or `count.at` earlier only if the
count structure truly is drawn then. A gate PASS is not enough: ratios inside the COUNT beat must still follow the
counts they come from.

**G8.** Cause: webgl film with a full 3D font (43 KB), many libs, big inline data. Page over 1.3 MB (simpsons-3d 1.270
MB, the margin is thin). Fix: `fonts3d` with `text` subset; drop unused libs; compute data from `params` instead of
tables; film code over 120 KB: trim comments, share helpers.

**G9.** Cause: more than 2 full-screen cards (chapters `card:true` + `cards`), a countdown device outside the COMMIT
window. Fix: keep question cards to one or two; ring only in the commit chapter.

**G10.** Cause: exec level with material pencil/chalk/marker/stitch/blueprint, or an exec film with a texture other than
none/paper rendered (`levelGuard:false`). WARN: the brand declares grain/halftone and kit2 drew it flat (fine to
ship, note it). Fix: `--material ink` or set `level` to manager/engineer in film.json (a 3D/neon film may be manager,
the drafts and simpsons-3d are); pick a brand whose texture is none/paper. Exec level is ink and clean (law).

## Known kit and gate defects that show as WARN or confusing output

- SHIP 1 (fixed in kit2): kit stamps read as must-read at 25 units. Use `K.tx` with `role`; kit2 tags its own text.
- SHIP 2 (fixed): countdown digit and the typed default were untagged G5c WARNs; the default now shows whole after
  A + 1.2 s. Tagged `chrome`; still listed by G5c because the gate does not read roles there.
- SHIP 3: claims.json object form accepted, build.py prints a note; write the bare array.
- SHIP 4 (fixed): probe.mjs no longer throws without `#tryOut`.
- SHIP 5 (fixed): commit overlay follows `K.commitGeom`; a film that moves the box passes x/y/w/h to `K.commitBox`.
- SHIP 6 (fixed in gate): `--kit` accepts a directory. SHIP 7 (open): G5c running counters. SHIP 8 (fixed): thousands
  groups in the number regex ("2,376,523"). SHIP 9 (open): the gate exits 1 without a JSON when it throws before `finish`.
- G5a 200 ms vm timeout can flag a formula under parallel runs; re-run serially before changing the formula.
- Chrome text hard-codes the CETI wordmark; `voice.end_card` reaches only the plain brand card (chrome none).
- Colours in film data (a hex such as survivorship `you: #2D5DA8`) bypass roles: text is lifted to 4.5:1, canvas
  squares keep the hex (2.9:1 on a dark brand). Use roles.
- Material reach: only canvas `fillRect`/`strokeRect` and `K.pencil` pass through a material; paths and every SVG mark stay ink.
- Content-box scaling (memo 0.885, ledger 0.784) makes floor-sized labels relatively larger; collisions possible. A
  film cannot use the memo margin headline or the ledger rows unless authored against `K.CHROME.layout`.
- Texture `halftone` is never drawn; `grain` only from the material; `tempo.ease/beat_s` not read.

## Order of fixes for a first run

1. G1/G2/G3 (code is wrong, nothing else is meaningful). 2. G5a/G5b/G4f/G4e (data). 3. G6 (sizes, roles, gaps via
knobs). 4. G7 (ratio order). 5. G4a-c, G9, G10 (film.json). 6. G8 (fonts, libs). WARNs go to NOTES.md or card.md.

## Claims with array values (G5a)
A claim whose `value` is a list (a year range, a pair) is compared element-wise against its recomputed formula since the
2026-10-10 gate patch; before it, such claims read NaN and failed G5a. If a topic's claims.json carries lists and G5a still
reports NaN, the gate in use predates the patch: run `node factory/tools/gate.mjs --version` or read the row's evidence.
