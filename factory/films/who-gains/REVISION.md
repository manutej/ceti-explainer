# who-gains · tier-2 revision (REVISER, Opus) · 2026-10-10

Input: SELECT.md "Beyond scope, refreshed after round 2" (items 1-9), round-1/2 knobs kept. Edited: lib/film.src.js,
lib/assemble.py (now also strips film.src.js; it writes film.js only, never film.json), film.json knobs + knobs_doc in place
(no caption, honest or claim changed; no new on-screen digit, so claims.json is untouched).
Build: `python3 lib/assemble.py` (deterministic, run twice: same sha256) then
`python3 factory/kit2/build.py factory/films/who-gains --brand ceti-neosage-dark --chrome none --material ink`.
Gate (full): **PASS**, G11 clean (307 samples, 94 texts, no overlap, nothing in the caption band); G5c WARN unchanged (running
counters, 17 numbers). Page 1.294 MB (was 1.299), film code 85.0 KB (film.js 51.5). Frames re-stripped: 0.365 s/frame, purity identical.
Sheet: revision/before-after.jpg (101.6, 113, 126.5, 130, 40, 65 s; before left, after right).

## Per item
1. **METR belief as visible levels** (110.6-135 s). Done. The forecast and believed-after levels are no longer frame lines on the
   block (which read as "the line"): they are two lilac wire boxes beside the block, ground to their arm-mean level. Forecast box
   (76) from 110.6 s, seen in plan beside the block; believed-after box (80) from 128.6 s, outermost. After the tilt (124.0 s on)
   the line for time without AI (ink, frameMix 0.55 -> 1.0) runs on dashed over both boxes, so at 129-135 s one frame shows
   forecast and believed below the line, measured above it (strip-22 cell 10 on). Forecast box carries the word FORECAST (chrome,
   no digit) in the side view from 126 s. Back edges of the boxes fade as the camera drops (no sway parallax at el 4).
   Re-framed: hhM 172 -> 200, new metLookZ 82 (all three side by side, readout and both pins clear).
2. **20 % pin** (129-135 s): anchored just left of the believed-after box top, at its own level, left of the group; 19 % stays top
   right. A reserve over the block face (top to the line) and over the two boxes keeps every pin off the column face and the line.
3. **24 % pin** (111-115.6 s): anchored to the forecast box (left edge), placed left of it; the block's partial row (13 x 18 + 12)
   now sits at the back (top edge in plan, hidden in the side view). Fixed a drawPl bug found here: right-aligned pins now align
   each line on its own width (the sub ran out of its plate).
4. **Gold cap = part above the line** (124-135 s): the gold always began at the baseline in the shader; the "grey band" was the
   forecast line sitting 24 units under a near-invisible grey baseline. With the line in ink and the ghost lines moved off the
   block, the gold starts exactly at the white line (126.5 s).
5. **Tag text during moves**: the accent mark still rides M1 (34-44 s) and M3, the text is hard-cut: on 44.2-46.0 s after the M1
   settle (new knob tagTx0; tag1 44.6 -> 46.0), on 62.8-65.2 s in the close-up hold, off as the pull-back starts
   (tagPin1 67.6 -> 65.2, lookHold 64.0 -> 65.2; pull-back 65.2-68.0 s, eased, still one move).
6. **101.5-102 s blank**: a METR field plate (plateMix 0.03, platePad 16) is on from the cut frame, with header and source tag.
7. **Developers words-only beat** (95.6-101.4 s): left caption-only. Any two-block picture implies group sizes F3 forbids.
8. **Honest line on one line**: left (two rows at 16). The rounding note is a director's choice; shortening it is theirs.
9. **Budget**: paid by stripping film.src.js in assemble.py (-8 KB); page now 1.294 MB with 6 KB headroom.

New knobs (documented in knobs_doc): tagTx0, metLookZ, ghostW 48, ghostGap 14, ghostW8 0.6, dash 7, plateMix, platePad.
Moves unchanged (34, 60, 116 s); every new number still holds >= 2.5 s; at most two results on stage (19, 20).

## Left, seen while checking (not on the list)
- Developers view 77-101 s: the +26 % pin sits over the unlit top of the wall (R8), and a dim agents stub still touches the left edge.
- The 20 % leader points at an anchor dot just off the box corner (the dot must clear the box reserve); reads fine at thumb size.
