---
id: processing
title: "Processing"
type: Platform
aliases: ["Processing (Java)", "Proce55ing", "PDE", "Design By Numbers", "DBN", "Aesthetics and Computation Group", "ACG"]
sources: [S131, S185, S186, S188, S200, S221, S238, S344, S346, S412]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Processing

## Definition
Processing is the Java-based sketching language and IDE begun by Casey Reas and Ben Fry in 2001; p5.js reinterprets its sketch model in JavaScript for the browser [S344][S346][S412].

## Details
- It emerged from John Maeda's Aesthetics and Computation Group (MIT Media Lab, founded 1996) and was shaped by Maeda's 1999 Design By Numbers, a minimal teaching language with a 100×100 grey canvas [S344].
- The first site went live on 20 October 2001 as Proce55ing; Processing Alpha shipped 2 February 2004 under the current name [S344].
- Programs are called sketches because the solution emerges while writing [S344].
- p5.js began in 2013 as a Processing Foundation fellowship to bring that model to the web [S346].
- Processing.org presents itself as the Foundation's sketchbook and language and links to p5.js as a related project [S412].
- Loop artists Etienne Jacob and Dave Whyte use Processing (Java), not p5.js, for their GIF work [S185][S188].
- The Processing editor has an Electron-based p5.js mode, whose experimental 2.x version had platform problems in 2026 (see [[processing-p5-mode]]) [S131][S238].

## In explainer work
- Much loop-and-GIF craft that explainer makers borrow (phase loops, grid offsets) was published in Processing; it ports directly to p5 (see [[loop-phase-animation]], [[grid-offset-loop]]) [S186][S188].
- Coding Challenge 130 publishes original Processing source next to p5 sketches — a common dual-language pattern [S221].

## Relations
- authored_by [[casey-reas]] — co-founder [S344]
- authored_by [[ben-fry]] — co-founder [S344]
- maintained_by [[processing-foundation]] — steward [S412]
- related_to [[p5js]] — p5 reinterprets Processing in JS [S346]
- alternative_to [[processingjs]] — JS port lineage vs p5's reinterpretation [S200]
- related_to [[processing-p5-mode]] — editor mode for p5 [S131]
- related_to [[hub-people-community]] (structural)
## Sources
- [S344] — Processing history
- [S346] — p5.js fellowship origin
- [S412] — Processing.org home
- [S185], [S188], [S186] — Processing-based loop artists
- [S131], [S238] — p5.js mode in Processing editor
- [S221] — Coding Challenge 130
- [S200] — Khan ProcessingJS support page
