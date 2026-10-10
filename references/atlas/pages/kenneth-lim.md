---
id: kenneth-lim
title: "Kenneth Lim"
type: Practitioner
aliases: ["limzykenneth"]
sources: [S50, S62, S112, S117, S131, S233, S295]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# Kenneth Lim

## Definition
Kenneth Lim (limzykenneth) is a p5.js steward who wrote the developer explainers for async loading and the add-on system in 2.0, and authored the custom-build server and p5.record.js [S112][S117][S295][S233].

## Details
- He explained that removing `preload()` was a clean break in 2.0 because removing it in a minor release would violate semantic versioning **[changed in 2.x]** [S112].
- He wrote up the design of the 2.0 add-on library system (lifecycle hooks) [S117].
- He drove the custom-build effort in issue #8003; its proof-of-concept server is alpha, and commenters cite the ~1 MB minified build as heavy [S295].
- v2.3.1 renamed the HDR colour constant to P3 — a breaking change associated with his stewardship per the frontier branch [S62].
- p5.record.js, hosted under his account, records to WebM or zipped image sequences and has a manual per-frame mode [S233].
- He was a speaker in the LGM 2026 strands talk [S50].

## In explainer work
- p5.record.js manual mode — one recorded frame per `redraw()` — is the recommended route for slow explainer renders that must not drop frames; see [[p5-record]] [S233][S131].
- His async-setup write-up is the clearest rationale for the 2.x loading model explainer code must adopt; see [[async-setup]] [S112].

## Relations
- authored_by [[p5-record]] — inverse: author [S233]
- authored_by [[custom-build-server]] — inverse: author [S295]
- related_to [[async-setup]] — wrote the 2.0 explainer [S112]
- related_to [[register-addon]] — designed the add-on system [S117]
- related_to [[p3-hdr-color]] — HDR→P3 rename [S62]
- part_of [[p5js-governance]] — steward [S50]
- related_to [[hub-people-community]] (structural)
## Sources
- [S112] — "Asynchronous p5.js 2.0"
- [S117] — add-on system design post
- [S295] — issue #8003 custom builds
- [S62] — v2.3.1 release notes
- [S233] — p5.record.js repo
- [S131] — export thread recommending p5.record.js
- [S50] — LGM 2026 talk
