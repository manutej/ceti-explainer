#!/usr/bin/env python3
"""lib/mkfilm.py (noether-frontier draft A) -> ../film.json. The source of truth for knobs, captions, tags, lay words, the panel schedule and the
stage type. Captions are the brief's (beats.md c1-c33), verbatim. Run, then lib/assemble.py, then factory/kit2/build.py."""
import json, os
import sys
if "--overwrite-film-json" not in sys.argv:   # tier-2 guard: film.json is the source since rounds 1-2; this script holds draft A's defaults only
    sys.exit("mkfilm.py: refused. film.json is the source of truth (edited in place by rounds 1-2 and the tier-2 revision); "
             "running this would overwrite it with draft A's defaults. Pass --overwrite-film-json only to start over from draft A.")
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(HERE, "..")
claims = json.load(open(os.path.join(D, "claims.json")))

KB = [  # name, default, lo, hi, step, what
 # --- world scales
 ("sP", 24, 10, 40, 1, "world units per orbit unit: the size of the tangle (where each planet is)"),
 ("sL", 140, 80, 200, 5, "world units per unit of spin: the radius of the six shells"),
 ("sA", 95, 50, 140, 2, "world units per unit of weight size (the training cloud's width and depth)"),
 ("sC", 110, 60, 160, 5, "world units per unit of the sum a^2 - b^2: the gap between the five layers"),
 ("hT", 250, 120, 340, 10, "height of the time axis in the training cloud before it is re-plotted by the sum"),
 # --- dots and light
 ("dotR", 1.1, 0.8, 2, 0.05, "dot radius of the 30,000 recall dots (world units, before the depth size cue)"),
 ("dotRNet", 1.0, 0.8, 2, 0.05, "dot radius of the 24,000 training dots"),
 ("sizeCue", 0.5, 0, 1, 0.05, "how much nearer dots are drawn larger (depth size cue)"),
 ("fog", 0.25, 0, 0.3, 0.05, "fog toward the far side of a cloud (manager level cap 0.3)"),
 ("stag", 0.18, 0, 0.25, 0.01, "stagger of the moves: each orbit or neuron leaves up to this fraction later, its dots together"),
 ("brightFollow", 0.6, 0, 0.6, 0.05, "how much brighter the followed orbit's 100 dots are (brighter, not bigger)"),
 ("ghost", 0.18, 0.05, 0.4, 0.01, "how much of the recall cloud still shows while a published result is quoted (a ghost)"),
 ("dimOthers", 0.4, 0.2, 0.8, 0.05, "how far the other 59 runs sink while one run's neurons are followed"),
 ("cometLen", 8, 3, 16, 1, "length of the comet of light that runs along each neuron's arc, in recorded moments"),
 ("cometDim", 0.25, 0, 0.6, 0.05, "how far dots out of the comet sink while it runs"),
 ("growComet", 1.5, 0, 2.5, 0.1, "how much bigger a dot in the comet (or in the followed run) is drawn"),
 ("recLen", 14, 4, 30, 1, "length of the comet that runs along the followed orbit's 100 dots (one lap = perS seconds)"),
 ("growFollow", 1.6, 0, 2.5, 0.1, "how much bigger the comet head (and, a little, the followed orbit's dots) are drawn"),
 ("fdimRec", 0.3, 0, 0.6, 0.05, "how far the other 29,900 recall dots sink so the followed orbit shows"),
 ("ringOp", 0.9, 0, 1, 0.05, "opacity of the thin outline ring round each shell"),
 ("ringW", 1.3, 0.8, 2.5, 0.1, "line weight of the shell outline rings"),
 ("plateOp", 0.45, 0, 1, 0.05, "opacity of the thin outline of each of the five layers"),
 ("featOrbit", 272, 0, 299, 1, "which of the 300 orbits is followed (its 100 dots a little brighter, one planet slides along its shell)"),
 ("featRun", 11, 0, 59, 1, "which of the 60 training runs is followed (its 8 neurons stay bright, the rest sink)"),
 ("perS", 5, 3, 10, 0.5, "seconds per lap of the followed planet"),
 # --- toy and tree (boxes on a plate)
 ("toyK", 14, 8, 18, 1, "world units per unit of a sub-answer: box length (4, 7, 9 of them)"),
 ("toyGap", 0.8, 0.3, 1.5, 0.1, "gap between the three marks of a row, in units of a sub-answer"),
 ("toyH", 14, 6, 20, 1, "height of a toy mark"),
 ("toyBoxD", 12, 6, 16, 1, "depth of a toy mark"),
 ("toyRow", 1.5, 1.2, 2.4, 0.1, "row pitch in box depths"),
 ("plateW", 320, 280, 460, 10, "width of the plate under the toy"),
 ("plateD", 150, 120, 220, 10, "depth of the plate under the toy"),
 ("rowStep", 0.5, 0.2, 0.8, 0.05, "seconds between one row and the next counting in"),
 ("treeW", 190, 140, 280, 10, "half width of the question tree (x from the data runs -1 to 1)"),
 ("treeD", 70, 50, 100, 5, "distance between the three layers of the tree"),
 ("treeBox", 20, 10, 28, 1, "side of a question box"),
 ("linkW", 1.6, 0.8, 3, 0.2, "width of the thin bars to the parent"),
 ("treeIn", 2.5, 1.5, 3.5, 0.1, "seconds the 19 boxes take to count in"),
 ("swapArc", 36, 0, 60, 2, "how far the two swapping children step out of each other's way (depth)"),
 ("swapSecs", 3, 2, 4, 0.25, "seconds the two children take to swap places"),
 # --- camera
 ("fov", 30, 20, 40, 1, "lens, degrees (never changes inside a move)"),
 ("lensX", 0.44, 0, 0.6, 0.01, "lens shift: the subject sits left of the centre by this fraction of the half width (clear of the panel)"),
 ("lensY", 0.09, -0.2, 0.2, 0.01, "lens shift up (fraction of the half height), clear of the caption band"),
 ("drift", 0.8, 0, 2, 0.1, "ambient drift of the camera in degrees (holds stay within 3)"),
 ("camHookAz", 20, -90, 90, 1, "recall cloud, azimuth of the HOOK frame (the landing of M1 is the same frame)"),
 ("camHookEl", 20, 0, 60, 1, "recall cloud, elevation"),
 ("camHookD", 1350, 900, 1800, 25, "recall cloud, camera distance"),
 ("camM0Az", 50, -90, 90, 1, "M0: how far the camera orbits while the shells un-sort (M1 orbits back the same way)"),
 ("camNetAz", -75, -120, 120, 1, "training cloud, azimuth at the match cut"),
 ("camNetEl", 22, 0, 60, 1, "training cloud, elevation at the match cut"),
 ("camNetD", 950, 700, 1500, 25, "training cloud, camera distance"),
 ("camM2Az", 60, 0, 120, 1, "M2: how far the camera orbits while the dots are re-plotted by the sum"),
 ("camM2El", 15, 0, 40, 1, "M2: elevation at the settle"),
 ("camM3El", 6, 0, 20, 1, "M3: elevation at the end of the bigger steps (low: the layers are seen edge-on)"),
 ("camM3Dolly", 0.12, 0, 0.15, 0.01, "M3: how far the camera pushes in (fraction of the distance)"),
 ("camToyAz", 10, -45, 45, 1, "toy, azimuth"), ("camToyEl", 40, 10, 70, 1, "toy, elevation"), ("camToyD", 800, 600, 1300, 25, "toy, camera distance"), ("camToyZ", 0, -100, 100, 5, "toy, look-at depth"),
 ("camTreeAz", 0, -45, 45, 1, "tree, azimuth"), ("camTreeEl", 50, 20, 80, 1, "tree, elevation"), ("camTreeD", 1000, 600, 1300, 25, "tree, camera distance"), ("camTreeZ", 0, -100, 100, 5, "tree, look-at depth"),
 ("camWideAz", 0, -45, 45, 1, "Monday wide frame, azimuth"), ("camWideEl", 42, 20, 80, 1, "Monday wide frame, elevation"), ("camWideD", 1150, 800, 1600, 25, "Monday wide frame, camera distance"), ("camWideZ", 0, -150, 150, 5, "Monday wide frame, look-at depth (moves the tree up or down the stage)"),
 # --- times (s)
 ("tReveal", 3, 1.5, 5, 0.25, "HOOK: seconds the 30,000 dots take to appear, shell by shell"),
 ("tM0", 12, 10, 14, 0.5, "M0 start: the rule is taken away (the shells un-sort)"), ("tM0e", 20, 18, 22, 0.5, "M0 end"),
 ("tM1", 28, 26, 32, 0.5, "M1 start: a blind search puts the tangle back on the shells"), ("tM1e", 36, 34, 38, 0.5, "M1 end"),
 ("tGhost", 38.5, 36.5, 41, 0.5, "the cloud dims to a ghost; the published result is quoted"),
 ("tNet", 50.5, 49, 53, 0.5, "match cut to the training cloud; the 24,000 dots start to count in"), ("tNetC", 56.5, 54, 60, 0.5, "the last training dot has arrived"),
 ("tM2", 62, 60, 66, 0.5, "M2 start: each dot is re-plotted by the sum"), ("tM2e", 70, 68, 74, 0.5, "M2 end"),
 ("tFollow", 78.5, 76, 82, 0.5, "one run's neurons brighten, the rest sink"),
 ("tComet", 80, 77, 84, 0.5, "the comet starts to run along every arc"), ("tCometE", 88, 85, 91, 0.5, "the comet has run the length of the arcs"),
 ("tM3", 88, 86, 92, 0.5, "M3 start: bigger steps"), ("tM3e", 96, 94, 99, 0.5, "M3 end"),
 ("tToy", 98.5, 97, 101, 0.5, "hard cut to the toy (3 marks)"), ("tRows", 106, 103, 108, 0.5, "the 6 rows start to count in"),
 ("tSame", 109, 107, 111, 0.5, "all rows one colour: the total is the same"), ("tModel", 112, 110, 114, 0.5, "rows recolour: the order-sensitive toy model"),
 ("tChen", 115, 113, 117, 0.5, "rows dim to a ghost; the published result is quoted"),
 ("tTree", 119, 117, 122, 0.5, "hard cut to the tree; the 19 boxes count in"), ("tSwap", 131, 129, 133, 0.5, "the two children of the 2nd question swap places; one node keeps a ring"),
 ("tMon", 135, 133, 137, 0.5, "Monday: the camera eases back to a wide frame"), ("tMonE", 141, 138, 143, 0.5, "end of the ease"), ("tHon", 141.5, 140, 144, 0.5, "the honest line on stage"),
 # --- type
 ("pX", 652, 620, 700, 2, "left edge of the readout panel (the right third of the stage)"),
 ("pinX", 300, 100, 600, 5, "the one pin: left edge of its word"), ("pinY", 112, 100, 150, 2, "the one pin: baseline of its word"),
 ("monY", 372, 330, 410, 2, "baseline of the first Monday line"), ("honY", 436, 400, 450, 2, "baseline of the first line of the honest sentence"),
 ("stageSize", 30, 28, 36, 1, "size of the set type (Monday question, honest sentence)"), ("stageLH", 38, 34, 46, 1, "line height of the set type"),
]
KNOBS = {k[0]: k[1] for k in KB}
DOC = [{"name": k[0], "range": [k[2], k[3]], "step": k[4], "what": k[5]} for k in KB]

caps = [
 (0.8, 5.8, "Last time, a dot could not leave its shell."), (6.2, 11.6, "Each shell is a number that never changes."),
 (12.4, 19.6, "Take the rule away. Plot only where things are."), (20.0, 22.8, "Each dot is one moment of one orbit."),
 (23.0, 27.6, "That is 30,000 moments, tangled, with no rule."), (28.2, 35.8, "A computer hunts for any number that stays put."),
 (36.1, 38.5, "It lands on the same shells, told nothing."), (38.6, 41.4, "In 2021, a team tried this on 5 test systems."),
 (41.6, 44.4, "It found every number that truly never changes."), (44.6, 47.4, "It also flagged numbers that only nearly hold."),
 (47.6, 50.4, "Small, clean systems, and the laws were known."), (50.6, 54.4, "Now something that learns: a small network."),
 (54.6, 58.4, "Each dot: one neuron, one moment of training."), (58.6, 61.9, "24,000 dots, tangled like before."),
 (62.4, 69.6, "Plot each by one sum of its neuron's weights."), (72.6, 75.4, "Each network here has 8 neurons."),
 (75.6, 78.4, "Each neuron keeps one sum fixed: 8 in all."), (78.6, 82.4, "Now let it train. Every dot starts to slide."),
 (82.6, 87.8, "They slide, but never change layer."), (88.2, 95.8, "Bigger steps, and the layers start to leak."),
 (96.1, 98.45, "The fixed sums hold only for tiny steps."), (98.6, 100.8, "Now try it on questions."),
 (101.0, 105.8, "3 questions that don't need each other."), (106.2, 108.9, "They can be asked in 6 orders."),
 (109.2, 111.9, "The total is 20 in every order."), (112.1, 114.95, "A model that minds order contradicts itself."),
 (115.1, 118.9, "Reordering cost more than 30 % in some tests."), (119.2, 121.9, "Our program starts with a tree of questions."),
 (122.2, 124.9, "19 questions, in 3 layers."), (125.2, 127.9, "4 broad, 8 narrower, 7 narrowest."),
 (128.2, 130.9, "Behind it: 9 modules and 22 sources."), (131.2, 134.8, "A claim that survives reordering is a candidate."),
 (135.3, 140.8, "Monday: reorder a question. Same answer?"),
]
TAGS = [[1.0, "RECAP · SIMULATED", "soft"], [12.0, "SIMULATED", "soft"], [28.0, "ILLUSTRATION · SIMULATED", "muted"], [38.5, "PUBLISHED RESULT", "accent"],
        [50.5, "SIMULATED · A TINY NETWORK", "soft"], [98.5, "ILLUSTRATION", "muted"], [115.0, "PUBLISHED RESULT", "accent"], [119.0, "PROGRAM, NOT A THEOREM", "accent"]]
SPIN, PLACE, SAME = "PLOTTED BY SPIN · COLOUR: ENERGY", "PLOTTED BY WHERE IT IS", "SAME DOTS, RE-PLOTTED"
LAY = [[1, 12, SPIN], [12, 20, SAME], [20, 28, PLACE], [28, 36, SAME], [36, 38.5, SPIN], [38.5, 50.5, "OUR DOTS, FADED · THE RESULT IS THEIRS"],
       [50.5, 62, "PLOTTED BY WEIGHTS · TIME"], [62, 70, SAME], [70, 88, "PLOTTED BY WEIGHTS · THE SUM"], [88, 96, "SAME DOTS, BIGGER STEPS"], [96, 98.5, "BIGGER STEPS, SAME TRAINING TIME"]]
Y1, Y2, Y3 = 172, 222, 124
PANEL = [  # t0, t1, kind (lab 14 mono | num display), text, baseline y, colour role, size, x offset
 [21.0, 28.0, "lab", "MOMENTS", Y3, "muted"], [21.0, 28.0, "num", "30,000", 176, "ink", 44], [21.0, 28.0, "lab", "ONE DOT = ONE MOMENT", 200, "muted"], [21.0, 28.0, "lab", "OF ONE ORBIT", 220, "muted"],
 [38.5, 50.5, "lab", "LIU AND TEGMARK · 2021", Y3, "accent"], [38.5, 50.5, "num", "5 test systems", Y1, "ink", 36], [38.5, 50.5, "num", "every exact law found", 214, "ink", 28], [38.5, 50.5, "lab", "PHYSICAL REVIEW LETTERS", 240, "muted"],
 [58.5, 72.5, "lab", "TRAINING MOMENTS", Y3, "muted"], [58.5, 72.5, "num", "24,000", 176, "ink", 44], [58.5, 72.5, "lab", "ONE DOT = ONE NEURON", 200, "muted"], [58.5, 72.5, "lab", "AT ONE MOMENT", 220, "muted"],
 [72.5, 98.5, "lab", "IN EACH TINY NETWORK", Y3, "muted"], [72.5, 98.5, "num", "8 neurons", Y1, "ink", 36],
 [75.5, 98.5, "num", "8 fixed sums", Y2, "accent", 36], [75.5, 98.5, "lab", "KUNIN ET AL. · MARCOTTE ET AL.", 248, "muted"],
 [96.0, 98.5, "num", "exact only for", 310, "ink", 28], [96.0, 98.5, "num", "tiny steps", 346, "ink", 28],
 [101.0, 109.0, "num", "3 questions", Y1, "ink", 36], [106.0, 109.0, "num", "6 orders", Y2, "ink", 36], [106.0, 109.0, "lab", "ONE ROW PER ORDER", 248, "muted"],
 [109.0, 115.0, "num", "4 + 7 + 9 = 20", Y1, "accent", 36], [109.0, 115.0, "num", "in every order", 214, "ink", 28],
 [115.0, 119.0, "lab", "CHEN ET AL. · ICML 2024", Y3, "accent"], [115.0, 119.0, "num", "more than 30 %", Y1, "ink", 36], [115.0, 119.0, "num", "worse, in some tests", 214, "ink", 28],
 [122.0, 131.0, "lab", "COUNTS OF WHAT EXISTS", Y3, "muted"], [122.0, 128.0, "num", "19 questions", Y1, "ink", 36],
 [125.0, 128.0, "num", "4", Y2, "accent", 36, 0], [125.0, 128.0, "num", "·", Y2, "muted", 36, 34], [125.0, 128.0, "num", "8", Y2, "soft", 36, 60], [125.0, 128.0, "num", "·", Y2, "muted", 36, 94], [125.0, 128.0, "num", "7", Y2, "sand", 36, 120],
 [125.0, 128.0, "lab", "BY LAYER, TOP TO BOTTOM", 248, "muted"],
 [128.0, 131.0, "num", "9 modules", Y1, "ink", 36], [128.0, 131.0, "num", "22 sources", Y2, "ink", 36],
]
MONDAY = ["Ask your AI the same question with its parts", "in another order. Does the answer stay?"]
HONEST = "Nobody has proved a Noether theorem for questions; this is a program, not a result."

params = dict(claims["params"])
for c in claims["claims"]: params[c["id"]] = c["value"]
film = {
 "id": "noether-frontier", "title": "Noether at the frontier", "eyebrow": "CETI · AI-STORIES · Noether at the frontier · part 3",
 "lede": "Machines that find the number that never changes, the numbers hidden inside a network that learns, and the open question of whether anything like it holds for knowledge: 30,000 recall dots, 24,000 training dots, a toy of 3 questions and a tree of 19. Part 3 of 3.",
 "format": "feature-long", "renderer": "webgl", "level": "manager", "dur": 153, "seed": claims["params"]["seed"],
 "look": {"brand": "ceti-coastal-dark", "chrome": "none", "material": "ink"}, "params": params, "commit": {"enabled": False}, "count": {"at": 21.0},
 "chapters": [
  {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "NOETHER · HOOK", "title": "A dot cannot leave its shell"},
  {"id": "case", "beat": "CASE", "t0": 12, "t1": 62, "eyebrow": "NOETHER · CASE", "title": "Take the rule away"},
  {"id": "count", "beat": "COUNT", "t0": 62, "t1": 135, "eyebrow": "NOETHER · COUNT", "title": "Training, questions and a tree"},
  {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "NOETHER · MONDAY", "title": "Reorder the parts of a question"}],
 "captions": [[a, b, c] for a, b, c in caps], "brand": {"takeaway": "Ask what stays when the order changes."},
 "sources": [[k, v] for k, v in claims["sources"].items()], "honest": [HONEST],
 "tags": TAGS, "lay": LAY, "panel": PANEL, "monday": MONDAY, "knobs": KNOBS, "knobs_doc": DOC,
}
json.dump(film, open(os.path.join(D, "film.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print("film.json", os.path.getsize(os.path.join(D, "film.json")), "bytes;", len(KNOBS), "knobs")
