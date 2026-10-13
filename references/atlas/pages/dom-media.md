---
id: dom-media
title: "DOM media (createVideo, createAudio, createCapture)"
type: Capability
aliases: ["createVideo", "createAudio", "createCapture", "webcam capture"]
sources: [S93, S98, S103, S104, S112, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# DOM media (createVideo, createAudio, createCapture)

## Definition
`createVideo`, `createAudio` and `createCapture` create media elements returned as [[p5-media-element]] [S98][S104][S93].

## Details
- `createVideo(path | formats[], ready)`: the video is shown by default; call `hide()` then draw it with `image()` [S98].
- `createAudio` makes a hidden `<audio>` element; an array of sources aids cross-browser playback [S104].
- `createCapture(VIDEO | AUDIO | constraints, flipped, callback)` captures webcam or mic; works only locally or over HTTPS [S93].
- Whether these became promise-based in 2.x, and autoplay-policy handling, are undocumented in the retrieved pages [S112][S98].

## In explainer work
Embed a recorded clip as a scrubbable layer (slider calls `v.time(t)`), or capture the webcam for live demos; reverse playback is browser-dependent [S103][S98].

## Relations
- part_of [[module-dom]] — DOM creators [S357]
- part_of [[hub-language-core]] (structural)
- uses [[p5-media-element]] — returned class [S103]
- related_to [[p5-sound]] — audio add-on [S103]
- related_to [[ml5js]] — webcam input to ML models (inference) [S93]

## Sources
- [S93] — p5.js reference: createCapture()
- [S98] — p5.js reference: createVideo()
- [S103] — p5.js reference: p5.MediaElement
- [S104] — p5.js reference: createAudio()
- [S112] — Asynchronous p5.js 2.0
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
