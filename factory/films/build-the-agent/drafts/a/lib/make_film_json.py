#!/usr/bin/env python3
"""lib/make_film_json.py · writes ../film.json for build-the-agent draft A "the four plates".
The knob table below is the one source of truth: name, default, [lo, hi], step, what. Every KN.<name> used by lib/film.src.js must be here
(the script checks), and no knob carries an on-screen number (numbers are film.json params = claim values). The pass bits, the telecom kinds, the calls
per build and the questions per build are READ from factory/topics/build-the-agent/data/*.json (recorded results, nothing simulated).
Run: python3 lib/make_film_json.py   (deterministic; run twice, diff)."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "film.json")
TOPIC = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "build-the-agent"))

# (name, default, lo, hi, step, what)   -- every time is film seconds; every start (…T0) is on the 0.5 s beat grid
KNOBS = [
 # HOOK
 ("hook1In", 1.0, 0.5, 2.0, 0.5, "s: the belief rises"), ("hook1Out", 4.5, 3.5, 5.0, 0.5, "s: the belief leaves"),
 ("hook2In", 5.5, 5.0, 6.5, 0.5, "s: the doubt rises"), ("hook2Out", 9.5, 8.5, 10.0, 0.5, "s: the doubt leaves"),
 ("hookSize", 44, 32, 60, 1, "units: set-type size"), ("hookX", 56, 30, 200, 2, "units: set-type left"), ("hookY", 214, 120, 300, 2, "units: set-type first baseline"),
 ("hookW", 520, 360, 760, 10, "units: set-type column width"),
 ("hookDx", 70, -300, 300, 5, "world: macro aim, x from the retail/telecom seam"), ("hookLookY", 6, 0, 40, 1, "world: macro aim height"),
 ("hookLookZ", 40, -150, 150, 5, "world: macro aim depth"), ("hookAz", -22, -60, 60, 1, "deg: macro azimuth"), ("hookEl", 24, 8, 60, 1, "deg: macro elevation"),
 ("hookDist", 250, 120, 500, 5, "world: macro distance"),
 ("pullT0", 10.5, 9.5, 11.0, 0.5, "s: camera pulls back from the macro to the wide plan"), ("pullT1", 12.1, 11.2, 12.4, 0.1, "s: the pull lands"),
 # CASE
 ("namesAt", 12.0, 11.5, 13.0, 0.5, "s: plate names rise"), ("numsAt", 17.0, 16.0, 19.0, 0.5, "s: case counts rise under the plate names"), ("namesOut", 39.5, 36.0, 39.5, 0.5, "s: plate names leave"),
 ("tileT0", 12.5, 12.0, 14.0, 0.5, "s: scenario tiles start landing"), ("tileT1", 17.0, 15.0, 18.0, 0.5, "s: last tile lands"),
 ("cubeT0", 20.0, 18.0, 22.0, 0.5, "s: build cubes start landing"), ("cubeT1", 23.5, 21.0, 25.0, 0.5, "s: last cube lands"),
 ("litT0", 27.5, 25.0, 29.0, 0.5, "s: passing cubes start to light"), ("litT1", 31.0, 28.0, 33.0, 0.5, "s: last passing cube lit"),
 ("cTilesAt", 12.5, 12.0, 14.0, 0.5, "s: case-count callout enters"), ("cTriesAt", 20.0, 18.0, 22.0, 0.5, "s: tries callout enters"), ("cPassAt", 27.5, 25.0, 29.0, 0.5, "s: passed callout enters"),
 ("cPctAt", 34.5, 33.0, 37.0, 0.5, "s: first ratio lands (after its count)"), ("cPctEnd", 39.0, 36.0, 39.5, 0.5, "s: that callout leaves"),
 ("m1T0", 40.0, 38.0, 42.0, 0.5, "s: M1 starts: re-stack + re-project"), ("m1T1", 41.6, 40.5, 44.0, 0.1, "s: M1 lands"),
 ("cNoneAt", 50.0, 46.0, 52.0, 0.5, "s: words callout on a dark column"), ("cNoneEnd", 53.5, 50.0, 55.0, 0.5, "s: it leaves"),
 ("cAllAt", 55.0, 52.0, 56.0, 0.5, "s: words callout on a full column"), ("cAllEnd", 58.5, 54.0, 59.5, 0.5, "s: it leaves"),
 # COUNT: the skyline
 ("m2T0", 60.0, 58.0, 62.0, 0.5, "s: M2 starts: re-sort by builds that passed"), ("m2T1", 61.6, 60.5, 64.0, 0.1, "s: M2 lands"),
 ("in0T0", 62.5, 61.5, 64.0, 0.5, "s: camera pushes in on the dark band"), ("in0T1", 64.1, 63.0, 65.5, 0.1, "s: push lands"),
 ("cDarkAt", 64.5, 63.5, 66.0, 0.5, "s: dark-band callout enters"), ("cDarkEnd", 67.0, 65.0, 67.0, 0.5, "s: it leaves"),
 ("to6T0", 67.0, 65.5, 68.0, 0.5, "s: camera pans to the full band"), ("to6T1", 68.6, 67.0, 70.0, 0.1, "s: pan lands"),
 ("cFullAt", 69.0, 68.0, 70.5, 0.5, "s: full-band callout enters"), ("cFullEnd", 71.5, 69.5, 71.5, 0.5, "s: it leaves"),
 ("out6T0", 71.5, 70.0, 72.5, 0.5, "s: camera pulls out to the medium skyline"), ("out6T1", 73.1, 71.5, 74.5, 0.1, "s: pull lands"),
 ("ghostT0", 73.5, 72.5, 75.0, 0.5, "s: the luck roofs start to arrive, band by band"), ("roofStep", 0.35, 0.0, 0.6, 0.05, "s: delay between bands"), ("roofOut", 78.5, 77.0, 79.0, 0.5, "s: the roofs leave"),
 ("roofAlpha", 0.1, 0.0, 0.4, 0.01, "luck roof and ghost cap fill"),
 ("luckAt", 76.0, 75.0, 77.5, 0.5, "s: the two luck pins enter"), ("luckEnd", 78.5, 77.0, 79.0, 0.5, "s: they leave"),
 ("m3T0", 79.0, 77.5, 81.0, 0.5, "s: M3 starts: cut plane rises to six of six"), ("m3T1", 80.6, 79.5, 83.0, 0.1, "s: plane at rest"),
 ("cCutAt", 81.0, 80.0, 83.0, 0.5, "s: the 'of' readout enters"), ("cCutEnd", 84.0, 82.0, 84.5, 0.5, "s: it leaves"),
 ("cPctFullAt", 84.5, 83.0, 86.0, 0.5, "s: the share lands (after its count)"), ("cPctFullEnd", 88.0, 85.0, 88.5, 0.5, "s: it leaves"),
 # telecom
 ("j1T0", 88.5, 87.0, 90.0, 0.5, "s: J1 starts: telecom leaves for its plate, camera travels"), ("j1T1", 90.1, 89.0, 92.0, 0.1, "s: J1 lands"),
 ("m4aT0", 90.5, 89.5, 92.0, 0.5, "s: M4a starts: re-stack into six tanks by build"), ("m4aT1", 92.1, 91.0, 94.0, 0.1, "s: M4a lands"),
 ("pinBAt", 92.5, 91.5, 94.0, 0.5, "s: pins on the lowest and highest tank enter"), ("pinBEnd", 95.0, 93.5, 95.5, 0.5, "s: they leave"),
 ("m4bT0", 95.5, 94.5, 97.0, 0.5, "s: M4b starts: re-partition into three tanks by kind"), ("m4bT1", 97.1, 96.0, 99.0, 0.1, "s: M4b lands"),
 ("pinKAt", 97.5, 96.5, 99.0, 0.5, "s: pins on the kind tanks enter"), ("pinKEnd", 100.0, 98.5, 102.0, 0.5, "s: they leave"),
 # board
 ("j3T0", 104.0, 102.0, 106.0, 0.5, "s: J3 starts: camera travels to the board carrying the plane"), ("j3T1", 105.6, 103.5, 107.5, 0.1, "s: J3 lands"),
 ("taskT0", 106.0, 105.0, 108.0, 0.5, "s: task tiles start landing"), ("taskT1", 108.5, 107.0, 110.0, 0.5, "s: last task tile lands"),
 ("c53At", 108.5, 107.5, 110.0, 0.5, "s: task count and plate pins enter"), ("c53End", 111.0, 109.5, 112.0, 0.5, "s: the task callout leaves"), ("pinsBdEnd", 127.5, 120.0, 128.0, 0.5, "s: plate and ruler pins leave"),
 ("slabT0", 111.0, 110.0, 113.0, 0.5, "s: slabs rise to the best build's scores"), ("slabT1", 112.2, 111.0, 114.0, 0.1, "s: slabs at rest"),
 ("bestT0", 112.5, 111.5, 115.0, 0.5, "s: the plane rises from zero to the best build's mean"), ("bestT1", 114.1, 113.0, 116.0, 0.1, "s: it lands"),
 ("cBestAt", 114.5, 113.5, 116.5, 0.5, "s: best-score callout enters"), ("cBestEnd", 117.0, 115.5, 117.5, 0.5, "s: it leaves"),
 ("ghostBT0", 117.0, 116.0, 119.0, 0.5, "s: the expert's ghost slabs rise"), ("ghostBT1", 118.0, 117.0, 120.0, 0.5, "s: ghost slabs at rest"),
 ("expT0", 118.5, 117.5, 121.0, 0.5, "s: the expert's plane starts to descend"), ("expT1", 120.1, 119.0, 122.0, 0.1, "s: it lands"),
 ("cExpAt", 120.5, 119.5, 122.5, 0.5, "s: expert-score callout enters"), ("cExpEnd", 123.0, 121.5, 123.5, 0.5, "s: it leaves"),
 ("pushBT0", 123.0, 121.5, 125.0, 0.5, "s: camera pushes in on the banking slab"), ("pushBT1", 124.6, 123.0, 126.5, 0.1, "s: push lands"),
 ("cBankAt", 125.0, 124.0, 127.0, 0.5, "s: banking pins enter"), ("cBankEnd", 127.5, 126.0, 128.0, 0.5, "s: they leave"),
 # sheet and Monday
 ("j4T0", 128.0, 127.0, 130.0, 0.5, "s: J4 starts: camera travels to the call sheet"), ("j4T1", 129.6, 128.5, 131.5, 0.1, "s: J4 lands"),
 ("callT0", 130.0, 129.0, 132.0, 0.5, "s: call cubes start landing"), ("callT1", 133.5, 131.5, 135.0, 0.5, "s: last tenth lands"),
 ("cCallsAt", 130.0, 129.0, 132.0, 0.5, "s: tool-call callout enters"), ("cCallsEnd", 136.0, 133.5, 137.0, 0.5, "s: it leaves"),
 ("askT0", 136.0, 135.0, 138.0, 0.5, "s: the questions to the client light"), ("askT1", 137.5, 136.0, 139.0, 0.1, "s: they stand"), ("askWind", 0.5, 0.0, 1.0, 0.1, "s: wind-up before they light"),
 ("cAsksAt", 138.0, 137.0, 139.5, 0.5, "s: questions callout enters"), ("cAsksEnd", 140.5, 139.0, 141.0, 0.5, "s: it leaves"),
 ("monT0", 140.5, 139.5, 142.0, 0.5, "s: camera tilts to the Monday view"), ("monT1", 142.1, 141.0, 143.5, 0.1, "s: tilt lands"),
 ("cMonAt", 142.5, 141.5, 144.0, 0.5, "s: share-of-calls callout enters"), ("cMonEnd", 149.5, 146.0, 150.0, 0.5, "s: it leaves"),
 ("qIn", 143.0, 142.0, 145.0, 0.5, "s: the Monday question rises"), ("qOut", 149.5, 146.0, 150.0, 0.5, "s: Monday type leaves"), ("honestIn", 144.5, 143.0, 147.0, 0.5, "s: the one limit rises"),
 ("monY", 98, 70, 140, 2, "units: Monday question first baseline"), ("monW", 560, 360, 880, 10, "units: Monday question width"), ("mondaySize", 30, 28, 44, 1, "units: Monday question size"),
 ("honestY", 182, 140, 260, 2, "units: honest line first baseline"), ("honestSize", 20, 18, 26, 1, "units: honest line size"), ("honestW", 880, 600, 900, 10, "units: honest line width"), ("typeBottom", 226, 160, 300, 2, "units: Monday type zone bottom (labels keep out)"),
 # world layout
 ("cubeEdge", 8, 5, 12, 0.5, "world: cube edge"), ("cubeGap", 0.18, 0.05, 0.5, 0.01, "cube gap, share of edge"), ("tileThick", 1.1, 0.5, 3, 0.1, "world: tile thickness"),
 ("plateThick", 1.4, 0.6, 4, 0.1, "world: plate thickness"), ("tileGap", 0.35, 0.1, 1.0, 0.05, "tile gap, share of edge"), ("plinth", 1.25, 1.0, 2.0, 0.05, "column base, x cube pitch"),
 ("plateRows", 10, 10, 14, 1, "tile rows per plate"), ("colsAir", 7, 7, 12, 1, "tile columns, airline"), ("colsRet", 14, 14, 20, 1, "tile columns, retail"), ("colsTel", 12, 12, 16, 1, "tile columns, telecom"),
 ("plateGap", 22, 6, 60, 1, "world: gap between plates"), ("platePad", 8, 2, 30, 1, "world: plate margin"), ("bankHx", 50, 20, 120, 2, "world: banking plate half width"),
 ("bandCols", 6, 5, 8, 1, "columns across a sorted band"), ("skyPx", 15.5, 11, 24, 0.5, "world: column pitch across"), ("skyPz", 17, 11, 26, 0.5, "world: column pitch deep"),
 ("skyAisle", 28, 10, 60, 1, "world: aisle between bands"), ("skyZ0", 105, 40, 160, 5, "world: front edge of the sorted block"),
 ("tankNx", 3, 3, 4, 1, "cells across a build tank"), ("tankNz", 4, 4, 5, 1, "cells deep in a build tank"), ("tankGap", 14, 6, 40, 1, "world: gap between build tanks"), ("tankGapK", 22, 6, 50, 1, "world: gap between kind tanks"),
 ("stageX", 900, 700, 1200, 10, "world: x of the telecom plate"), ("boardZ", -1400, -1800, -1000, 10, "world: z of the board"), ("sheetZ", -2900, -3600, -2200, 10, "world: z of the call sheet"),
 ("boardTile", 22, 14, 30, 1, "world: task tile pitch"), ("taskFill", 0.92, 0.7, 1.0, 0.01, "task tile fill"), ("scoreScale", 1.15, 0.7, 1.6, 0.05, "world: height per score point"),
 ("boardPad", 8, 2, 20, 1, "world: board plate margin"), ("boardGap", 30, 10, 80, 2, "world: gap between board plates"), ("rulerGap", 30, 10, 80, 2, "world: ruler distance"), ("tickLen", 8, 3, 20, 1, "world: ruler tick"),
 ("sheetCols", 159, 159, 200, 1, "cells across the call sheet"), ("sheetRows", 100, 100, 110, 1, "cells down the call sheet"), ("cellPitch", 6.2, 3, 9, 0.1, "world: call cell pitch"),
 ("cellEdge", 0.4, 0.3, 0.5, 0.01, "call cell half-width (0.5 = no gap)"), ("askEdge", 5, 3, 8, 0.5, "world: question cube edge"), ("askScale", 1.9, 1.0, 3.0, 0.1, "question cube growth"), ("sheetY", -0.8, -2, 0, 0.1, "world: sheet height"),
 ("cellFlash", 0.4, 0.1, 1.0, 0.05, "s: flash of a landed tenth"), ("seedA", 20261011, 1, 99999999, 1, "seed: ambient order"), ("seedAsk", 20261012, 1, 99999999, 1, "seed: cell of a question inside its build's block"),
 # camera
 ("camFov", 28, 18, 40, 1, "deg: lens"), ("camPlanEl", 89, 60, 89, 1, "deg: plan elevation"), ("camPlanDist", 1700, 900, 2200, 10, "world: plan distance"), ("planZ", 55, -100, 120, 5, "world: plan aim depth"),
 ("camSideAz", 16, -40, 40, 1, "deg: side azimuth"), ("camSideEl", 30, 15, 60, 1, "deg: side elevation"), ("camSideDist", 1420, 800, 2200, 10, "world: side distance"), ("sideZ", -10, -150, 100, 5, "world: side aim depth"),
 ("mAz", 18, -40, 40, 1, "deg: macro band azimuth"), ("mEl", 28, 10, 60, 1, "deg: macro band elevation"), ("mDist", 300, 150, 600, 5, "world: macro band distance"),
 ("stAz", 14, -40, 40, 1, "deg: telecom plate azimuth"), ("stEl", 24, 8, 60, 1, "deg: telecom plate elevation"), ("stDist", 680, 250, 900, 10, "world: telecom plate distance"), ("stLookY", 76, 0, 120, 1, "world: telecom aim height"),
 ("bwAz", 12, -40, 40, 1, "deg: board azimuth"), ("bwEl", 26, 8, 60, 1, "deg: board elevation"), ("bwDist", 920, 500, 1600, 10, "world: board distance"), ("bwLookY", 48, 0, 120, 1, "world: board aim height"),
 ("bbDx", 0, -100, 100, 2, "world: banking macro aim x"), ("bbAz", 14, -40, 40, 1, "deg: banking azimuth"), ("bbEl", 22, 8, 60, 1, "deg: banking elevation"), ("bbDist", 660, 200, 900, 10, "world: banking distance"), ("bbLookY", 46, 0, 120, 1, "world: banking aim height"),
 ("swZ", 70, -200, 200, 5, "world: sheet plan aim depth"), ("swDist", 2200, 1000, 2800, 10, "world: sheet plan distance"),
 ("smAz", 0, -30, 30, 1, "deg: Monday azimuth"), ("smEl", 30, 15, 60, 1, "deg: Monday elevation"), ("smDist", 2100, 900, 3000, 10, "world: Monday distance"), ("smZ", -250, -600, 200, 5, "world: Monday aim depth"),
 ("camSprZ", 0.83, 0.5, 1.0, 0.01, "camera spring damping"), ("camSprW", 9, 5, 14, 0.5, "camera spring rate"), ("camSway", 1.6, 0.0, 3.0, 0.1, "deg: landing sway (the visible settle)"), ("swayU", 0.3, 0.0, 0.8, 0.05, "share of a move when the sway starts"),
 ("landU", 0.45, 0.2, 1.0, 0.05, "share of a move at its visual landing (ring beat)"), ("elMax", 89, 80, 89.4, 0.1, "deg: elevation cap"), ("travLift", 220, 0, 600, 10, "world: eye lift mid-travel"),
 ("camDriftAmp", 0.012, 0.0, 0.02, 0.001, "ambient drift on holds"), ("camHoldSettle", 0.4, 0.0, 1.0, 0.1, "s: stillness after a move"), ("driftYaw", 0.8, 0.0, 2.0, 0.1, "deg: drift yaw"),
 # marks and look
 ("dropDur", 0.35, 0.15, 0.8, 0.05, "s: a landing mark's drop"), ("drop", 60, 10, 160, 5, "world: drop height"), ("lift1", 6, 0, 30, 1, "world: M1 arc"), ("lift2", 14, 0, 40, 1, "world: M2/M4 arc"), ("liftJ", 40, 0, 120, 5, "world: J1 arc"),
 ("stagger", 0.25, 0.0, 0.5, 0.05, "M1 stagger (tracked moves have none)"), ("anticip", 0.005, 0.0, 0.03, 0.001, "anticipation dip"), ("anticipU", 0.1, 0.05, 0.3, 0.01, "anticipation share"),
 ("markSprZ", 0.72, 0.5, 1.0, 0.01, "mark spring damping (spring-hero)"), ("markSprW", 11, 6, 14, 0.5, "mark spring rate"), ("sprW2", 8, 5, 14, 0.5, "M2 spring rate"), ("sprW4", 8, 5, 14, 0.5, "J1/M4 spring rate"),
 ("m2Shutter", 0.3, 0.1, 1.0, 0.05, "shutter scale during M2"), ("cutDim", 0.72, 0.3, 0.95, 0.01, "dim of columns below the cut"), ("dimLag", 0.1, 0.0, 0.4, 0.05, "s: dim trails the plane"),
 ("glowHero", 2.2, 1.0, 4.0, 0.1, "glow of full columns"), ("glowAsk", 2.4, 1.0, 4.0, 0.1, "glow of the questions"), ("plateMix", 0.55, 0.2, 1.0, 0.01, "tile base tone"), ("platePanel", 0.3, 0.1, 0.8, 0.01, "plate tone"),
 ("planeAlpha", 0.08, 0.05, 0.5, 0.01, "plane fill"), ("backAlpha", 0.07, 0.05, 0.6, 0.01, "backing plate fill"), ("planeMargin", 16, 4, 40, 1, "world: plane margin"), ("planeFade", 0.8, 0.2, 1.5, 0.1, "s: plane fade"),
 ("expStart", 300, 150, 600, 10, "world: expert plane start height"),
 ("ambScale", 4.5, 2, 8, 0.1, "ambient shadow radius"), ("shLag", 0.1, 0.0, 0.3, 0.05, "s: shadow trails the mark"), ("lookShadow", 0.42, 0.0, 0.7, 0.01, "key shadow"), ("lookAmb", 0.28, 0.0, 0.4, 0.01, "ambient shadow"),
 ("lookRim", 0.1, 0.0, 0.1, 0.005, "Fresnel rim"), ("lineLav", 0.6, 0.2, 1.0, 0.05, "lavender line and plane brightness"), ("lineAmb", 0.9, 0.2, 1.0, 0.05, "amber line and plane brightness"), ("lineInk", 0.8, 0.2, 1.0, 0.05, "ruler brightness"), ("lookBloom", 0.1, 0.0, 0.2, 0.01, "bloom (lit marks only)"), ("lookGrain", 0.012, 0.0, 0.02, 0.001, "grain sigma"), ("lookPool", 560, 200, 900, 10, "world: light pool"),
 ("floorLum", 12, 0, 30, 1, "floor code value (no crushed pixel)"), ("floorSize", 1400, 800, 2400, 50, "world: floor quad"), ("floorPad", 40, 10, 120, 5, "world: lit plate margin"), ("grainFps", 15, 5, 30, 1, "grain refresh"),
 ("gridAlpha", 0.1, 0.0, 0.3, 0.01, "floor grid"), ("gridStep", 2, 1, 6, 1, "grid step, in tiles"),
 # labels and numbers
 ("hold", 8, 0, 15, 1, "frames a label must be pushed before it hides"), ("leader", 20, 12, 40, 2, "leader length"), ("maxShown", 12, 1, 30, 1, "label budget"), ("calloutLeader", 40, 30, 90, 2, "callout leader length"),
 ("calloutSize", 34, 28, 48, 1, "units: callout number"), ("dispAdv", 0.5, 0.35, 0.7, 0.01, "display face advance (label boxes)"), ("subGap", 3, 0, 8, 1, "units: label sub gap"),
 ("plate", 0.78, 0.3, 1.0, 0.01, "label ground"), ("numWt", 2.0, 1.0, 3.0, 0.1, "weight beat on a landed number"), ("numPulse", 0.5, 0.2, 0.8, 0.05, "s: that beat"),
 ("pinStep", 0.1, 0.0, 0.3, 0.05, "s: delay between pins of one set"), ("namesH", 44, 20, 80, 2, "units: plate-name zone (labels keep out)"),
]


# layout and look constants: not tunables (changing one rebuilds the geometry or the grade); they live in film.src.js between the KC markers
CONSTS = set("""hookX hookY hookW hookDx hookLookY hookLookZ planZ sideZ stLookY bwLookY bbDx bbLookY swZ smZ elMax driftYaw drop anticip anticipU dimLag planeMargin planeFade expStart
ambScale shLag lookAmb lookPool floorLum floorSize floorPad grainFps gridAlpha gridStep lineLav lineAmb lineInk leader maxShown calloutLeader dispAdv subGap pinStep namesH
tileThick plateThick tileGap plinth plateRows colsAir colsRet colsTel plateGap platePad bankHx bandCols skyPx skyPz skyAisle skyZ0 tankNx tankNz tankGap tankGapK stageX boardZ sheetZ
boardTile taskFill boardPad boardGap rulerGap tickLen sheetCols sheetRows cellPitch cellEdge askEdge askScale sheetY cellFlash roofStep roofAlpha askWind m2Shutter
monY monW honestY honestW typeBottom""".split())

# the 40 claims are copied unchanged; film.json carries their params (recompute.py reads the same names) plus the recorded bits
def jl(n):
    with open(os.path.join(TOPIC, "data", n)) as f: return json.load(f)

def build():
    claims = json.load(open(os.path.join(HERE, "..", "claims.json")))
    params = dict(claims["params"])
    params["expert"] = 82.2
    M = jl("hyper-tau-matrix.json")["groups"]; B = jl("hyper-tau-builds.json")["builds"]
    mask = lambda s: sum((1 << b) for b, ch in enumerate(s) if ch == "1")
    air = [g for g in M if g["domain"] == "airline_plus"][0]; ret = [g for g in M if g["domain"] == "retail_plus"][0]; tel = [g for g in M if g["domain"] == "telecom"][0]
    params["bitsAir"] = [mask(r) for r in air["rows"]]; params["bitsRet"] = [mask(r) for r in ret["rows"]]; params["bitsTel"] = [mask(r) for r in tel["rows"]]
    kinds = {"mms_issue": 0, "mobile_data_issue": 1, "service_issue": 2}
    params["telKind"] = [kinds[f["issue"]] for f in tel["facets"]]
    params["callsPer"] = [b["calls_logged"] for b in sorted(B, key=lambda b: b["slot"])]
    params["asksPer"] = [b["client_questions"] for b in sorted(B, key=lambda b: b["slot"])]
    params["luckK"] = [8.8, 36.0, 68.8, 85.9, 73.9, 38.1, 8.4]       # recompute.py section 1: 'if luck' columns by builds that passed (geometry of the roofs; only the two ends carry a digit)
    return params

CAPS = [
 (0.5, 5.0, "The best builder makes the best agent."), (5.5, 11.5, "Does it? Test it on real customer cases."),
 (12.5, 17.0, "Airline, shop and phone-line customer cases."), (17.0, 20.0, "320 cases. One tile each."),
 (20.0, 23.5, "Six agent builds tried every case."), (24.0, 27.0, "1,920 tries. One cube each."),
 (27.5, 31.0, "A lit cube is a try that passed."), (31.5, 34.0, "968 cubes are lit."),
 (34.5, 38.5, "About half of the tries pass: 50.4 %."), (39.5, 44.5, "Now turn the field. Each case becomes a column."),
 (45.0, 49.0, "A column is one case, tried six ways."), (49.5, 54.0, "Six different builds, not six repeats of one."),
 (54.5, 59.5, "Look for columns that are all dark or all lit."), (60.0, 64.5, "Sort the cases by how many builds solved them."),
 (64.5, 68.0, "44 cases: no build solved them."), (68.5, 72.0, "43 cases: every build solved them."),
 (72.5, 76.0, "Now scatter the same wins at random."), (76.0, 80.0, "Luck would leave 8.8 dark and 8.4 full."),
 (81.0, 84.5, "Cut at six of six: 43 of 320 cases."), (84.5, 88.5, "Only 13.4 % of cases are solved by all six."),
 (89.0, 92.5, "Phone lines, regrouped by build."), (92.5, 96.0, "Six builds: from 26.1 % to 52.1 %."),
 (97.5, 101.5, "By kind of problem: 11.6 % to 67.7 %."), (102.0, 106.0, "So the case matters more than the build."),
 (106.0, 110.0, "Now the score: 53 tasks, four businesses."), (112.5, 116.5, "The best builder scores 23.9 out of 100."),
 (118.5, 122.5, "An expert who knows the test scores 82.2."), (123.0, 127.0, "In banking: 5.9 against 79.8."),
 (129.5, 133.5, "Last: what the builders asked the client."), (133.5, 137.0, "15,885 tool calls. One cube each."),
 (138.0, 142.0, "43 were questions to the client."),
]

HONEST = "One sampled build per task, builders mixed: columns are different builds, not repeats; 23.9 is a mean over 53 tasks scored by simulated customers and an LLM judge."


COUNTIN = [  # the count-in values the callouts can show: each landed tenth of a count (text-reveal counters show a landed count only); added to claims.json with their formulas (as pass-every-time did)
 ("countTiles", "scenarios", "the scenario-tile count-in: tiles on screen after each tenth landed", "CASE 12.5-17.0 s, callout a.tiles", "S2"),
 ("countTries", "tries", "the try count-in: cubes on screen after each tenth landed", "CASE 20.0-23.5 s, callout a.tries", "S2"),
 ("countLit", "lit", "the pass count-in: lit cubes on screen after each tenth landed", "CASE 27.5-31.0 s, callout a.pass", "S2"),
 ("countCalls", "calls", "the tool-call count-in: cubes on the sheet after each tenth landed", "COUNT 130.0-133.5 s, callout c.calls", "S2"),
]

def write_claims():
    p = os.path.join(HERE, "..", "claims.json")
    c = json.load(open(os.path.join(TOPIC, "claims.json")))               # always start from the brief's 40 claims, unchanged
    vals = {"scenarios": 320, "tries": 1920, "lit": 968, "calls": 15885}
    for cid, var, text, where, src in COUNTIN:
        n = vals[var]; rnd = lambda x: int(x + 0.5)
        c["claims"].append({"id": cid, "text": text, "value": [rnd(n * (b + 1) / 10) for b in range(10)],
                            "formula": "Array.from({length: 10}, (_, b) => Math.round(%s * (b + 1) / 10))" % var, "source": src, "grade": "A", "where": where})
    with open(p, "w", encoding="utf-8") as f: json.dump(c, f, indent=1, ensure_ascii=False)

def main():
    write_claims()
    src = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
    used = set(re.findall(r"KN\.([A-Za-z0-9_]+)", src))
    for mid in ("pull", "m1", "in0", "to6", "out6", "j1", "j3", "pushB", "j4", "mon"): used |= {mid + "T0", mid + "T1"}
    for mid in ("m1", "m2", "m3", "m4a", "m4b", "best", "exp", "ask"): used |= {mid + "T0", mid + "T1"}
    names = [k[0] for k in KNOBS]
    assert len(names) == len(set(names)), "duplicate knob " + str([n for n in names if names.count(n) > 1][:5])
    miss = sorted(used - set(names)); extra = sorted(set(names) - used)
    if miss: sys.exit("knobs used but not in the table: " + " ".join(miss))
    if extra: print("note: knobs in the table but unused:", " ".join(extra))
    docs, knobs, kc = [], {}, {}
    for n, v, lo, hi, st, what in KNOBS:
        assert lo <= v <= hi, (n, v, lo, hi)
        if n in CONSTS: kc[n] = v; continue
        knobs[n] = v; docs.append({"name": n, "range": [lo, hi], "what": what})
    assert CONSTS <= set(names), sorted(CONSTS - set(names))
    block = "/*KC*/const KC = " + json.dumps(kc, separators=(",", ":")) + ";/*KC*/"
    import re as _re
    new_src = _re.sub(r"/\*KC\*/.*?/\*KC\*/", lambda _m: block, src, flags=_re.S)
    if new_src != src: open(os.path.join(HERE, "film.src.js"), "w", encoding="utf-8").write(new_src)
    for c in CAPS:
        need = 1.3 + 0.06 * len(c[2]); assert c[1] - c[0] >= need - 1e-9, ("caption hold", c, need)
        assert abs(c[0] * 2 - round(c[0] * 2)) < 1e-9, ("caption start off the 0.5 s grid", c)
    cl = json.load(open(os.path.join(HERE, "..", "claims.json")))
    sources = [[k, v["what"].split(";")[0] + " · " + v["url"]] for k, v in cl["sources"].items()]
    film = {
        "id": "build-the-agent", "title": "The Builder", "eyebrow": "CETI · a data film · agents that build agents",
        "lede": "Four plates on a dark bench: three customer-service domains as 320 case tiles with six builds each, and banking as the fourth. 968 of 1,920 tries pass, but the cases, not the builders, decide: 44 are solved by no build and 43 by all six. Then the score as a slab board, the expert's plane over it, and 15,885 tool calls with 43 questions to the client.",
        "type": {"disp": "Newsreader", "mono": "Space Mono"}, "format": "feature-long", "level": "manager", "renderer": "webgl", "dur": 153, "seed": 20261011,
        "look": {"brand": "ceti-neosage-dark", "chrome": "none", "material": "hero"},
        "params": build(), "knobs": knobs, "knobs_doc": docs, "commit": {"enabled": False}, "count": {"at": 12.5},
        "chapters": [
            {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "HOOK", "title": "The belief"},
            {"id": "case", "beat": "CASE", "t0": 12, "t1": 60, "eyebrow": "CASE", "title": "Four plates, six builds"},
            {"id": "count", "beat": "COUNT", "t0": 60, "t1": 135, "eyebrow": "COUNT", "title": "Case, build, score"},
            {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "MONDAY", "title": "Ask the client"}],
        "captions": [[a, b, t] for a, b, t in CAPS],
        "brand": {"takeaway": "Ask the client. Test on the hard cases."},
        "sources": sources, "honest": [HONEST], "beat": 0.5, "cuts": [],
        "libs": ["arsenal/patterns/text-reveal/pattern.js", "factory/kit2/text-reveal.js"],
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(film, f, separators=(",", ":"), ensure_ascii=False)
    print("film.json %d bytes, %d knobs, %d captions" % (os.path.getsize(OUT), len(KNOBS), len(CAPS)))

if __name__ == "__main__":
    main()
