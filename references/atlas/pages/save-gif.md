---
id: save-gif
title: "saveGif()"
type: Construct
aliases: ["p5 saveGif"]
sources: [S10, S131, S137, S141, S143, S149, S151]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# saveGif()

## Definition

saveGif(filename, duration, [options]) is the p5 built-in that records a stretch of the sketch into an animated GIF; it can be called in setup() or mid-sketch **[2.x]**. [S143]

## Details

- Signature is saveGif(filename, duration, [options]); recognised options are delay, units, silent, notificationDuration and notificationID, but the reference page does not explain what each does. [S143]
- The reference page links v2.3.3 source and states no 2.x-specific behaviour change, so treat it as the current 2.x built-in. **[2.x]** [S143]
- Unlike saveFrames, it pauses the draw loop while recording, so it yields the expected frame count even on slow machines. [S149]
- Release 2.3.3 (7 Sep 2026) added a MAX_GIF_PIXELS guard, default 16,000,000, as a security limit on GIF size. **[2.x]** [S10]
- Black initial frames on p5 2.0+ are the subject of PR #8130, which adds a startLoop option and a 50 ms initial redraw; the page does not show its merge status, and the author frames the delay as a timing workaround rather than a root-cause fix. **[changed in 2.x]** [S151]
- GIF is limited to 256 colours, and the 2026 forum asker who needed 4K high-bitrate output judged saveGif quality poor. [S131][S137]
- The `units` semantics (frames versus seconds) and the effect on the sketch loop are undocumented on the reference page. [S143]

## In explainer work

saveGif is the quickest way to ship a short seamless loop (keep it near 640x360), and because it pauses drawing it is safe for loops that are pure functions of frameCount. [S137][S149] For anything long, high-resolution or colour-critical, move to [[frame-stepped-export]] with [[png-sequence-ffmpeg]]. [S131]

## Relations

- alternative_to [[save-frames]] — saveFrames is the other built-in but runs in real time and drops frames [S149]
- alternative_to [[p5-create-loop]] — createLoop offers progress/theta plus its own gif export [S141]
- related_to [[frame-stepped-export]] — the deterministic route when GIF limits bite [S131]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4) (p5.js maintainers, Jul to 25 Sep (2.3.x))
- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S141] — p5.createLoop (Petey Hayman, README mentions 0.3.0 dated 04/02/2023)
- [S143] — p5.js reference: saveGif() (p5.js docs (page links v2.3.3 source), undated)
- [S149] — p5.js issue #7958 saveFrames doesn't honor frame rate (via goodfirstissue.org) (GitHub issue mirror, 2025-07)
- [S151] — p5.js PR #8130 saveGif black initial frames in 2.0+ (GitHub contributor, undated)
