# WOW-ACCUM-PROOF · accumulation export on one-query, 66–84 s · lane B5 · 2026-10-11

Test case (WOW-GAP-AUDIT gap 5): one-query's world floor at 66–84 s, which the audit scored as moiré with no AA and no sub-frames.
one-query uses material ink and does not call gl-post, so this is the **exporter-level** path: no film change.
Page: factory/films/one-query/build/one-query.ceti-boardwalk-dark.none.html, 1920 x 1080, 30 fps, window 66–84 s = 540 frames.
Cuts: `66` (passed, `--cuts 66`: the cutB knob is not in film.json `cuts`) plus 82.8 and 99 (derived from the rig's `cut` moves).

```
export.mjs <page> --sel '#stage' --query '?film=1' --viewport 1920x1080 --dsf 1 --from 66 --to 84 --gif-seconds 0 --cuts 66 \
           --samples 1 --shards 2                    # A: today's export
           --samples 8 --shutter 0.35 --shards 4     # B: 8 sub-frames, shutter 0.35 (126 deg)
           --samples 1 --ssaa 2 --from 70 --to 70.0334   # C: one frame, 2x2 spatial supersample (4K canvas, box-filtered in linear light)
```

## Stills (factory/research/wow-accum/)
| t | samples 1 | samples 8, shutter 0.35 | note |
|---|---|---|---|
| 75.50 s (back orbit, zoom-out) | t75.50-samples1.png | t75.50-samples8.png | crop-t75.50.png (3x nearest): left 1, right 8. The 1-sample floor is a hard-edged grid that steps; the 8-sample floor is streaked along the move and the box edges carry a soft trail. |
| 70.00 s (hold) | t70.00-samples1.png | t70.00-samples8.png | identical to 0.03/255 mean: a hold has no time to average. |
| 70.00 s (hold) | | t70.00-ssaa2.png | crop-t70.00.png: left 1, middle 8, right ssaa 2. Only spatial supersampling touches a hold. Floor high-frequency energy (mean abs Laplacian, G channel) 11.5 -> 8.6. |
| 82.80 s (the oblique cut) | t82.80-samples1.png | t82.80-samples8.png | the shutter window [82.794, 82.806] straddles the cut; mean abs diff 8 vs 1 is 0.006/255, so no double exposure: the clamp holds every sub-time on the new side. |

## Measurements
| quantity | samples 1 | samples 8 |
|---|---|---|
| s/frame (sum of per-frame wall / 540) | 0.54 (2 shards) | 7.69 (4 shards) |
| renders (seek + screenshot) | 540 | 4,314 (540 x 8, minus 6 repeated sub-times at the 66.0 cut, reused) |
| run wall, 540 frames incl. MP4 | 202 s | 1,113 s |
| mp4 tags | bt709 / bt709 / bt709 / tv | bt709 / bt709 / bt709 / tv |
| floor temporal flicker, 74.0–77.0 s (mean abs second difference of floor luminance, top-right 900 x 500 px) | 24.9 | 20.0 (-20 %) |
| mean abs first difference, same region | 13.6 | 11.3 |
| auto mode, 30 frames at 74.5–75.5 s (separate run, 1 shard) | n/a | probe D = 2.1–3.8 px per shutter -> N 8 then 32 (full-field change rule, since relaxed to 16): 16.5 s/frame |

Cost model: per frame ~ a + b·N. Unloaded kit film at 1080p: render + PNG screenshot ~0.4 s, averaging 0.16 s (PNG decode 85 ms +
linear accumulate 70 ms), so b ~ 0.55 s and a ~ 0 (a hold costs two probe renders in auto mode, one in fixed N = 1). Measured here under
load average 12–24 (other lanes on 4 cores) the sub-frame cost was ~0.9 s: 7.69 s at N = 8, 16.5 s at N = 32 in the auto run (b ~ 0.5 s there,
load ~10). Two shards gave 0.27 s/frame overall at N = 1 (1.45x); four shards at N = 8: 2.06 s/frame overall (vs ~4.4 s single-process, estimated from b ~ 0.55 s). Treat
all of these as upper bounds. A full 153 s one-query at N = 8: 4,590 frames x ~2.1 s = ~2.7 h on 4 shards loaded; plan ~1 h idle.
gl-post films pay the in-page ~0.3 s per sub-frame instead (gl-post card), no PNG round trips.

## Purity (identical re-seek)
Every run re-renders up to four frames after seeking elsewhere and compares the SHA-256 of the final averaged PNG with the exported one:
samples 1: frames 2250, 1980, 2251, 1981 IDENTICAL; samples 8: 2248–2251 and 1980–1983 (first frames after the cut) IDENTICAL;
auto (N = 8 and 32 frames): IDENTICAL; ssaa 2 frame: IDENTICAL; gl-post demo in page mode (`reveal`, N = 8, 1.8–2.0 s): IDENTICAL.
The sub-time grid is a pure function of t (stratified, centred, cut-clamped) and the PNG encoder is deterministic, so a frame is a pure function of t.

## What the proof shows, and what it does not
- Motion blur and temporal AA now exist for a film that never touched gl-post: the 66–84 s floor streaks along the orbit and zoom, and
  its frame-to-frame flicker drops 20 % at N = 8 (shutter 0.35). The drop is smaller than the eye expects because the grid period is ~10 px
  and the zoom is fast: auto asks for 16–32 there. Use `--samples auto` for the hero cuts.
- **Exporter-level temporal averaging cannot fix moiré on a hold** (66–72 s, 99–150 s): nothing moves, so all sub-frames are the same. For
  holds use `--ssaa 2` (4x pixels, ~1.5 s/frame at 1080p) or let the film run gl-post accumulation (Halton jitter, which is spatial AA at N >= 8).
  A cheap default for the re-cut: `--ssaa 2 --samples auto --shutter 0.35`.
- Undeclared hard cuts blend 50/50 in exporter mode (there is no camera to ask). Declare every cut in film.json `cuts` or `--cuts`.
- Probe D underestimates jumps larger than an edge width (brightness-constancy saturation); `changed > 0.25` floors N at 16. Tiers
  were not tuned against viewer judgement; check the first auto export by eye on the ghost spacing (P21: <= 1.5 px).
- Colour: ffprobe shows bt709/tv tags; the decoded MP4's mean RGB at 70 s is within 1.7/255 of the source PNG (H.264 loss, tv range). The
  old untagged line was not re-encoded for a before/after.

## Files touched
arsenal/tools/export.mjs (rewritten: flags, codec, shards, window, tags; exports renderFrame for frames.mjs), arsenal/patterns/gl-post/pattern.js
(cutClamp, tier, speedFromProbe, samplesFor, `__EXPORT` override, ldr cap) and card.md, factory/tools/frames.mjs (`--shutter/--samples/--cuts/--fps`),
arsenal/tools/README.md (flag docs).
