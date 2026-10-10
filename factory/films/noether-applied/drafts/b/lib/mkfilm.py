#!/usr/bin/env python3
"""lib/mkfilm.py (noether-applied draft B, "the ledger of error") · writes ../film.json (captions, chapters, sources, knobs + knobs_doc) and copies the brief's claims.json.
film.json is generated; edit this file, then run: python3 lib/mkfilm.py && python3 lib/assemble.py (see ../build.sh)."""
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..")
TOPIC = os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "noether-applied")
claims = json.load(open(os.path.join(TOPIC, "claims.json")))
shutil.copyfile(os.path.join(TOPIC, "claims.json"), os.path.join(OUT, "claims.json"))

# (name, value, lo, hi, step, what)
KN = [
 # ledger and type
 ("pX", 676, 640, 720, 2, "x of the fixed ledger panel (sheet units); the panel is the right third"),
 ("pW", 236, 200, 260, 2, "width of the ledger panel's text (sheet units)"),
 ("rowH", 84, 76, 100, 2, "height of one ledger row (label, value, rule)"),
 ("valSize", 30, 28, 36, 1, "type size of a ledger value (never under 28)"),
 ("qSize", 30, 28, 36, 1, "type size of the set-type question"),
 ("honestSize", 20, 18, 26, 1, "type size of the honest line on stage"),
 # moves and scenes (seconds)
 ("tS1", 12.0, 10, 14, 0.5, "second the first act starts (hard cut from the hook)"),
 ("tS2a", 62.0, 58, 66, 0.5, "second the balanced-layers act starts (match cut)"),
 ("tS2b", 89.0, 86, 92, 0.5, "second the spring act starts (match cut)"),
 ("tS3", 110.0, 106, 114, 0.5, "second the weather act starts (match cut)"),
 ("tS4", 122.5, 118, 126, 0.5, "second the chain act starts (match cut)"),
 ("tWide", 135.0, 130, 140, 0.5, "second the wide frame of the four sorted pictures starts"),
 ("tQ0", 6.0, 3, 9, 0.5, "second the question fades in"),
 ("tHon", 141.5, 138, 146, 0.5, "second the honest line is set on stage"),
 ("tCnt1", 14.0, 12, 20, 0.5, "act 1: the 2,000 dots start to arrive (plan view)"),
 ("tCnt1e", 26.0, 20, 30, 0.5, "act 1: the last dot has arrived (the count lands)"),
 ("tCr1", 34.0, 30, 40, 0.5, "act 1: the crane starts (plan to elevation, sheet still flat)"),
 ("tCr1e", 39.0, 34, 44, 0.5, "act 1: the crane ends"),
 ("tRise1", 39.0, 34, 44, 0.5, "act 1: the dots stand up by their error (camera still)"),
 ("tRise1e", 42.0, 37, 47, 0.5, "act 1: the dots have stood up"),
 ("tHi1", 53.5, 50, 58, 0.5, "act 1: the thrown-out dots are lit, the rest dim"),
 ("tHi1e", 56.0, 52, 60, 0.5, "act 1: the thrown-out light ends"),
 ("tSp1", 56.0, 52, 60, 0.5, "act 1: the keeper is lit, the plain dots dim (the spin row)"),
 ("tSp1e", 58.5, 54, 62, 0.5, "act 1: the keeper light ends"),
 ("tBk1", 58.7, 56, 62, 0.5, "act 1: the camera eases back, oblique"),
 ("tBk1e", 61.8, 58, 62, 0.5, "act 1: the ease-back ends"),
 ("tCnt2", 64.0, 62, 70, 0.5, "act 2a: the 10,000 dots start to arrive"),
 ("tCnt2e", 72.0, 66, 76, 0.5, "act 2a: the last dot has arrived"),
 ("tCr2", 74.5, 72, 80, 0.5, "act 2a: the crane starts"),
 ("tCr2e", 78.0, 74, 82, 0.5, "act 2a: the crane ends"),
 ("tRise2", 78.0, 74, 82, 0.5, "act 2a: the dots stand up by the layer gap (three flat sheets)"),
 ("tRise2e", 81.5, 77, 86, 0.5, "act 2a: the dots have stood up"),
 ("tCnt3", 89.4, 89, 94, 0.2, "act 2b: the 400 dots start to arrive"),
 ("tCnt3e", 91.4, 90, 96, 0.2, "act 2b: the last dot has arrived"),
 ("tCr3", 91.6, 90, 96, 0.2, "act 2b: the crane starts"),
 ("tCr3e", 94.6, 92, 98, 0.2, "act 2b: the crane ends"),
 ("tRise3", 94.6, 92, 98, 0.2, "act 2b: the dots stand up by their energy"),
 ("tRise3e", 96.9, 93, 99, 0.2, "act 2b: the dots have stood up (before the first ledger row)"),
 ("tLoop", 112.2, 110, 116, 0.2, "act 3: the loop and its wall fade in"),
 ("tEv", 112.8, 111, 118, 0.2, "act 3: the stirring starts (plan view)"),
 ("tEve", 117.6, 114, 121, 0.2, "act 3: the stirring ends (the loop is stretched and folded)"),
 ("tCr4", 117.8, 114, 121, 0.2, "act 3: the crane starts (wall height reads as constant)"),
 ("tCr4e", 121.0, 117, 122, 0.2, "act 3: the crane ends"),
 ("tCr5", 122.7, 122, 126, 0.1, "act 4: the crane starts (plan to elevation)"),
 ("tCr5e", 124.4, 123, 127, 0.1, "act 4: the crane ends (before the count row)"),
 ("tTurn", 127.5, 125, 131, 0.5, "act 4: the chain starts to turn"),
 ("tTurne", 134.5, 130, 135, 0.5, "act 4: the chain is back in its first pose after one turn"),
 # camera
 ("fov", 30, 20, 45, 1, "vertical field of view, degrees (fixed inside a move)"),
 ("lensX", 0.36, 0, 0.5, 0.01, "lens shift: moves the subject into the left two thirds, clear of the ledger"),
 ("lensY", 0.06, -0.2, 0.2, 0.01, "lens shift: vertical, keeps the subject clear of the tag"),
 ("camDrift", 8, 0, 20, 1, "degrees the plan view is higher at the start of a count-in (it settles as the dots arrive)"),
 ("cHA", 18, -60, 60, 1, "hook: camera azimuth, degrees"), ("cHE", 40, 10, 80, 1, "hook: camera elevation"), ("cHD", 520, 300, 900, 10, "hook: camera distance"),
 ("c1Az", 18, -60, 60, 1, "act 1: azimuth, degrees"), ("c1P", 74, 50, 88, 1, "act 1: plan elevation"), ("c1PD", 620, 500, 1200, 10, "act 1: plan distance"),
 ("c1E", 9, 3, 25, 1, "act 1: elevation after the crane (low, the sheet reads as a line)"), ("c1ED", 660, 500, 1200, 10, "act 1: distance after the crane"), ("c1Y", 52, 0, 120, 2, "act 1: height the camera looks at after the crane"),
 ("c1B", 24, 8, 50, 1, "act 1: oblique elevation after the ease-back"), ("c1BD", 840, 500, 1200, 10, "act 1: distance after the ease-back"),
 ("c2Az", 25, -60, 60, 1, "act 2a: azimuth"), ("c2P", 72, 50, 88, 1, "act 2a: plan elevation"), ("c2PD", 560, 450, 1100, 10, "act 2a: plan distance"),
 ("c2E", 8, 3, 25, 1, "act 2a: elevation after the crane"), ("c2ED", 580, 450, 1100, 10, "act 2a: distance after the crane"), ("c2Y", 0, 0, 120, 2, "act 2a: height the camera looks at after the crane"),
 ("c3Az", 20, -60, 60, 1, "act 2b: azimuth"), ("c3P", 74, 50, 88, 1, "act 2b: plan elevation"), ("c3PD", 520, 400, 1000, 10, "act 2b: plan distance"),
 ("c3E", 8, 3, 25, 1, "act 2b: elevation after the crane"), ("c3ED", 540, 400, 1000, 10, "act 2b: distance after the crane"), ("c3Y", 38, 0, 120, 2, "act 2b: height the camera looks at after the crane"),
 ("c4Az", 20, -60, 60, 1, "act 3: azimuth"), ("c4P", 76, 50, 88, 1, "act 3: plan elevation"), ("c4PD", 520, 400, 1000, 10, "act 3: plan distance"),
 ("c4E", 8, 3, 25, 1, "act 3: elevation after the crane"), ("c4ED", 540, 400, 1000, 10, "act 3: distance after the crane"), ("c4Y", 18, 0, 120, 2, "act 3: height the camera looks at after the crane"),
 ("c5Az", 20, -60, 60, 1, "act 4: azimuth"), ("c5P", 72, 50, 88, 1, "act 4: plan elevation"), ("c5PD", 660, 450, 1200, 10, "act 4: plan distance"),
 ("c5E", 9, 3, 25, 1, "act 4: elevation after the crane"), ("c5ED", 700, 450, 1200, 10, "act 4: distance after the crane"), ("c5Y", 100, 0, 200, 2, "act 4: height the camera looks at after the crane"),
 ("cWAz", 0, -60, 60, 1, "wide frame: azimuth"), ("cWE", 15, 5, 40, 1, "wide frame: elevation"), ("cWD", 2250, 1500, 4000, 50, "wide frame: distance"),
 ("cWX", -90, -400, 400, 10, "wide frame: x the camera looks at"), ("cWY", 20, 0, 120, 2, "wide frame: height the camera looks at"),
 # dots
 ("dotR", 1.1, 0.8, 1.6, 0.05, "dot radius in world units (about 1, with the depth cue)"),
 ("dotRNet", 1.2, 0.7, 1.6, 0.05, "dot radius in the 10,000-dot cloud, the spring and the loop"),
 ("dotRGhost", 0.55, 0.3, 1.0, 0.05, "radius of the ghost dots of the zero sheet (a guide, not data)"),
 ("dotRWide", 2.6, 1.2, 5, 0.1, "dot radius in the wide frame (the clouds are small there)"),
 ("ghostDim", 0.72, 0.4, 0.95, 0.01, "how far the zero sheet is dimmed toward the ground"),
 ("ghostDimWide", 0.8, 0.4, 0.95, 0.01, "same, in the wide frame"),
 ("dimOthers", 0.78, 0.3, 0.95, 0.01, "how far the dots outside a lit set are dimmed"),
 ("sizeCue", 0.5, 0, 1, 0.05, "depth size cue"), ("fog", 0.2, 0, 0.6, 0.02, "fog toward the ground with distance"), ("stag", 0.15, 0, 0.25, 0.01, "stagger of the dots inside a re-stack (at most 0.25)"),
 # act 1
 ("s1In", 22, 10, 50, 1, "act 1: inner radius of the sheet (the first snapshots)"), ("s1Out", 100, 60, 160, 2, "act 1: outer radius (the last snapshots)"),
 ("s1H", 105, 40, 200, 5, "act 1: height of the full error scale (world units)"),
 ("s1Eps", 100, 10, 1000, 10, "act 1: error where the log stretch bends, in millionths (error stretched for the eye, said in words)"),
 ("s1Fly", 0.45, 0, 1, 0.05, "act 1: how far out the thrown-out dots are drawn (a drawing choice)"),
 ("gN", 38, 20, 60, 1, "rings of the ghost lattice of every zero sheet (one lattice, scaled per sheet; more rings = more, finer ghost dots)"),
 # act 2
 ("s2G", 105, 60, 150, 5, "act 2a: radius of the ghost sheets of the three layers"),
 ("bondA", 0.6, 0, 0.8, 0.02, "act 4: brightness of the bond dots between neighbours in the chain"),
 ("s2W", 36, 20, 60, 1, "act 2a: world units per unit of the weight picture"), ("s2H", 90, 40, 140, 2, "act 2a: world units per unit of layer gap (the three sheets' distance)"),
 ("sqQ", 120, 80, 170, 2, "act 2b: world units per unit of position and momentum"), ("sqE", 650, 300, 1200, 10, "act 2b: height per unit of energy (stretched for the eye)"),
 # act 3
 ("slS", 62, 40, 90, 1, "act 3: world units per unit of the loop picture"), ("slWall", 38, 10, 80, 1, "act 3: height of the wall (the swirl number, constant)"),
 ("slG", 118, 60, 160, 2, "act 3: radius of the ghost sheet under the loop"),
 ("slStr", 25, 10, 40, 1, "act 3: strands drawn as trails (every 40th parcel at 25)"), ("wallA", 0.22, 0.05, 0.6, 0.01, "act 3: opacity of the wall"),
 # act 4
 ("scS", 7.5, 5, 12, 0.5, "act 4: world units per bond length of the chain"), ("scLift", 125, 60, 220, 5, "act 4: height of the chain above its sheet"),
 ("scN", 20, 8, 40, 1, "act 4: output arrows drawn (every residue of a regular stride)"), ("scL", 24, 10, 50, 1, "act 4: length of the longest output arrow"),
 # hook
 ("hA", 84, 40, 130, 2, "hook: size of the ellipse"), ("hE", 0.45, 0, 0.8, 0.01, "hook: how stretched the made-up ellipse is"), ("hPer", 5.0, 3, 9, 0.5, "hook: seconds per lap"), ("hDot", 3.0, 1.5, 6, 0.1, "hook: radius of the planet and the sun"),
]
captions = [
 [0.8, 5.8, "Last time: a number that never changes."], [6.2, 11.6, "Where is that used today, outside quantum physics?"],
 [12.4, 19.8, "First: a computer moves a planet in tiny steps."], [20.0, 25.8, "Each dot is a snapshot of that planet."],
 [26.0, 28.4, "1,000 snapshots from each of two ways of stepping."], [28.6, 31.0, "1,000,000,000 tiny steps each."], [31.4, 33.8, "From above, the two look the same."],
 [34.2, 41.8, "Now stand each dot up by how far its number drifted."], [42.2, 44.3, "One stays flat. The other tilts, then tears."],
 [44.5, 46.8, "The energy-keeper never strays more than 0.007 %."], [47.0, 49.3, "The plain way: 1.9 % off after 10,000,000 steps."],
 [51.0, 53.3, "About 270 times more error."], [53.5, 55.8, "Then it is thrown out: by 65 million steps."], [56.0, 58.3, "The spin number stays right to 11 places."],
 [58.7, 61.8, "Astronomers run whole solar systems this way."],
 [62.4, 71.8, "Next: machines that learn. Each dot is one step."], [72.0, 74.4, "10,000 steps from 100 training runs."],
 [74.8, 81.2, "Stand each dot up by the gap between two layers."], [83.0, 85.4, "The weights travelled 0.24."], [86.0, 88.4, "The gap between layers moved 0.00095."],
 [89.4, 96.8, "Teach two networks a swinging spring."], [97.0, 99.4, "Same size: 200 units, 2,000 training steps."],
 [100.0, 102.3, "The plain network, energy error: 170."], [102.5, 104.8, "The energy-keeping network: 0.38."], [106.5, 108.9, "About 450 times lower."],
 [112.2, 116.2, "Weather: tag a loop of air and follow it."], [116.4, 119.2, "The loop stretches and folds."], [119.4, 122.4, "The swirl around it stays the same."],
 [124.5, 126.9, "One dot per residue: 2,180 in one chain."], [127.6, 131.2, "Turn the protein. The answer turns with it."], [131.6, 134.8, "What stays is its shape, not a saved number."],
 [135.3, 140.8, "Monday: what must never change in your system?"],
]
S = claims["sources"]
film = {
 "id": "noether-applied", "title": "Noether applied",
 "eyebrow": "CETI · AI-STORIES · Noether applied · part 2",
 "lede": "Where is a number that never changes used today? Four real systems, each drawn as a cloud whose height is the number that should stay: a planet stepped by a computer, a network learning, a spring taught to two networks, a loop of stirred air, a turning protein-like chain. Flat is kept, tilted is drifting. Part 2 of 3: the ledger of error.",
 "format": "feature-long", "renderer": "webgl", "level": "manager", "dur": 153, "seed": 20261010,
 "look": {"brand": "ceti-coastal-dark", "chrome": "none", "material": "ink"},
 "params": claims["params"], "commit": {"enabled": False}, "count": {"at": 26.0},
 "chapters": [
  {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "NOETHER APPLIED · HOOK", "title": "Where is this used today?"},
  {"id": "case", "beat": "CASE", "t0": 12, "t1": 62, "eyebrow": "NOETHER APPLIED · CASE", "title": "A planet, stepped two ways"},
  {"id": "count", "beat": "COUNT", "t0": 62, "t1": 135, "eyebrow": "NOETHER APPLIED · COUNT", "title": "Networks, air and a chain: the same sort"},
  {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "NOETHER APPLIED · MONDAY", "title": "What must never change in your system?"}],
 "captions": captions,
 "brand": {"takeaway": "Find what stays. Then build so it does."},
 "sources": [[k, v if len(v) < 190 else v[:187] + "…"] for k, v in S.items()],
 "honest": ["Pictures are simulated. Big steps break it. A turn saves no number."],
 "knobs": {k[0]: k[1] for k in KN},
 "knobs_doc": [({"name": k[0], "range": [k[2], k[3]], "step": k[4], "what": k[5]}) for k in KN],
}
json.dump(film, open(os.path.join(OUT, "film.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print("film.json", os.path.getsize(os.path.join(OUT, "film.json")), "bytes;", len(KN), "knobs;", len(captions), "captions")
