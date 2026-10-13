#!/usr/bin/env python3
"""lib/revise_wow2.py · Wave WOW re-cut round 2 (lane B6b, 2026-10-11): edits ../film.json IN PLACE on top of revise_wow.py, and adds the
count-in tenths to ../claims.json (countTiles, countTries, countLit, countPrs: every value a count-in can show, with its formula).
Springs with tails on every camera / plane / mark landing; M2 1.6 s with no stagger; count-ins in tenths ending on the claim; 27 min lands;
two-layer shadow trailing 3 frames; rim 0.10; grain 1.2 % at 15 Hz over a floor; the three joins carried by camera travels (the plane, a minute
cube, the plane); macro / wide / medium every minute; a x8 -> x1 ramp on the 289 column; no hard cut. Idempotent: run twice, same files."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); FJ = os.path.join(HERE, "..", "film.json"); CJ = os.path.join(HERE, "..", "claims.json")
f = json.load(open(FJ, encoding="utf-8"))
K, DOC = f["knobs"], f["knobs_doc"]
idx = {d["name"]: d for d in DOC}
def setk(name, val, rng=None, step=None, what=None):
    K[name] = val
    d = idx.get(name)
    if d is None:
        d = {"name": name, "range": rng, "step": step if step is not None else 0.1, "what": what}; DOC.append(d); idx[name] = d
    if rng is not None: d["range"] = rng
    if step is not None: d["step"] = step
    if what is not None: d["what"] = what
    lo, hi = d["range"]
    assert lo <= val <= hi, (name, val, d["range"])
def drop(name):
    K.pop(name, None)
    if name in idx: DOC.remove(idx.pop(name))

for n in ("wipeW", "wipeBand", "wipeGain", "arrW"): drop(n)
T = [0, 153]
# ── world: the PR sheet and the minute floor share the floor, out of every tau view (each join is one camera travel)
setk("prZ", 1400, [600, 3000], 10, "world z of the PR sheet and the minute floor (behind every tau camera)")
setk("minX", 1500, [800, 5000], 10, "world x of the minute floor (beside the PR sheet, out of its view)")
# ── camera: springs, poses, moves
setk("camSprZ", 0.72, [0.6, 1.0], 0.01, "camera and plane spring damping (0.76: about 2.5 % overshoot, a 0.5-0.7 s tail)")
setk("camSprW", 9, [6, 16], 0.5, "camera and plane spring stiffness, per move duration")
setk("camSway", 1.6, [0.0, 3.0], 0.1, "deg: damped yaw sway of each camera landing (the visible settle)")
setk("landU", 0.45, [0.2, 1.0], 0.05, "share of a spring move at its visual landing: the ring beat")
setk("swayU", 0.3, [0.0, 0.8], 0.05, "share of a camera move when the landing sway starts")
setk("sprW2", 8, [5, 12], 0.5, "mark spring stiffness on M2 (main travel over about 1 s, tail inside the 1.6 s)")
setk("camWideDist", 2400, [1200, 4000], 10, "eye distance of the wide plan (the field under 0.2 of the frame height)")
setk("camWideEl", 34, [15, 60], 1, "elevation of the wide side pose (ladder, return)")
setk("camWideSideDist", 1500, [800, 3000], 10, "eye distance of the wide side pose")
setk("m44Az", -60, [-80, 80], 1, "azimuth of the macro on the 44 full columns")
setk("m44El", 28, [8, 60], 1, "elevation of that macro")
setk("m44Dist", 320, [150, 700], 5, "eye distance of that macro (the block fills over half the frame height)")
setk("m44X", 0, [-200, 200], 1, "aim offset x of that macro (room for its callout)")
setk("m44Z", -60, [-200, 200], 1, "aim offset z of that macro")
setk("m27El", 22, [4, 50], 1, "elevation of the macro on the 27-minute column")
setk("m27Dist", 175, [60, 400], 5, "eye distance of that macro")
setk("travLift", 220, [0, 600], 10, "world units the eye lifts in the middle of a join travel")
setk("carryLift", 30, [0, 200], 5, "world units the carried minute cube arcs up on the second travel")
moves = [("pull", 10.5, 12.1, "the pull-back from the macro hook to the wide plan"), ("push", 18.5, 20.1, "the push from the wide plan to the medium plan"),
         ("m1", 40.0, 41.6, "M1a, plan to side"), ("in44", 62.5, 64.1, "the push to the macro on the 44 full columns"),
         ("out44", 67.5, 69.1, "back to the medium side"), ("wide", 77.5, 79.1, "out to the wide side for the ladder"),
         ("trav1", 99.0, 100.8, "join 1: travel to the PR sheet (the plane rides it)"), ("trav2", 119.5, 121.1, "join 2: travel to the 27-minute macro (a minute cube rides it)"),
         ("out27", 126.5, 128.1, "out to the wide minute floor"), ("trav3", 136.5, 138.1, "join 3: travel back to the wide side (the plane rides it)"),
         ("bookCam", 140.5, 142.1, "the bookend rise to the plan pose")]
for n, a, b, w in moves:
    setk(n + "T0", a, T, 0.1, "s: camera move starts (spring): " + w)
    setk(n + "T1", b, T, 0.1, "s: that camera move is still (its tail inside)")
# ── HOOK / CASE
setk("tileT0", 12.5, T, 0.1, "s: the other 114 tiles start to land, a tenth at a time (power-out: the last tenth takes 41 % of the time)")
setk("tileT1", 17.0, T, 0.1, "s: the last tenth of the tiles lands (the 115 count lands on the claim)")
setk("cTasks", 12.5, T, 0.1, "s: the task count attaches (wide plan; count.at)")
setk("tasksEnd", 18.0, T, 0.1, "s: the task count exits before the push")
setk("cubeT0", 21.0, T, 0.1, "s: the other 456 cubes start to land, a tenth at a time")
setk("cubeT1", 25.0, T, 0.1, "s: the last tenth of the cubes lands (460)")
setk("cTries", 21.0, T, 0.1, "s: the try count attaches")
setk("litT1", 31.0, T, 0.1, "s: the last tenth of the passes lights (278)")
setk("stackT0", 42.0, T, 0.1, "s: M1b starts: the same 460 cubes re-stack into one column per task (spring)")
setk("stackT1", 43.5, T, 0.1, "s: M1b lands (ring beat)")
# ── COUNT
setk("m2T0", 60.0, T, 0.1, "s: M2 starts: the same columns re-sort by tries passed, one clock, no stagger (spring)")
setk("m2T1", 61.6, T, 0.1, "s: M2 lands (ring beat)")
setk("m2Shutter", 0.4, [0.1, 1.0], 0.05, "shutter scale during M2 (a lighter blur so every column can be followed)")
setk("c44", 64.5, T, 0.1, "s: the 44 callout lands in the macro")
setk("c44End", 67.0, T, 0.1, "s: that callout exits before the camera moves")
setk("c22", 69.5, T, 0.1, "s: callout on the empty block")
setk("c22End", 71.0, T, 0.1, "s: that callout exits before the plane rises")
setk("m3T0", 71.5, T, 0.1, "s: M3 starts: the plane rises to the all-four bar (spring); the dimming trails it by dimLag")
setk("m3T1", 72.7, T, 0.1, "s: the plane is still at the bar (ring beat, edge flash)")
setk("dimLag", 0.1, [0.0, 0.3], 0.01, "s: how far the dimming trails the plane (3 frames)")
setk("c44of", 73.0, T, 0.1, "s: callout: 44 of 115")
setk("c44ofEnd", 75.0, T, 0.1, "s: that callout exits")
setk("c383", 75.5, T, 0.1, "s: callout: 38.3 % (after the count)")
setk("c383End", 77.0, T, 0.1, "s: that callout exits before the camera moves")
setk("lad1", 79.5, T, 0.1, "s: the pair opens (the one-try count line, its ratio after ladLead)")
setk("lad4", 83.0, T, 0.1, "s: the every-try count line, its ratio after ladLead")
setk("ladOut", 91.0, T, 0.1, "s: the pair exits")
setk("legOut", 91.0, T, 0.1, "s: the unit legend exits")
setk("paperIn", 92.0, T, 0.1, "s: the plate of the paper's own eight-try run")
setk("paperOut", 96.0, T, 0.1, "s: that plate exits")
setk("planeOut", 97.0, T, 0.1, "s: the glow of the 44 fades before the travel")
setk("prCut", 99.9, T, 0.1, "s: scene switch tau to PR, in the middle of trav1 (no cut)")
setk("prT0", 101.0, T, 0.1, "s: the PR cubes start to land, a tenth at a time")
setk("prT1", 104.0, T, 0.1, "s: the last tenth of the PRs lands (296)")
setk("cPrs", 101.0, T, 0.1, "s: the PR count attaches")
setk("cPrsEnd", 107.0, T, 0.1, "s: that callout exits")
setk("prPlaneOut", 104.5, T, 0.1, "s: the carried plane fades under the full sheet")
setk("cSwe", 107.5, T, 0.1, "s: callout on the top SWE-bench Verified score (lands with the pulse)")
setk("cSweEnd", 111.0, T, 0.1, "s: that callout exits before M4")
setk("sprW4", 8, [5, 12], 0.5, "mark spring stiffness on M4 and the bookend (a longer tail)")
setk("ghost0", 113.1, T, 0.1, "s: the not-merged block starts to dim (3 frames after the landing: follow-through)")
setk("ghost1", 113.7, T, 0.1, "s: the not-merged block is dimmed")
setk("cHalf", 115.5, T, 0.1, "s: callout: about half would not be merged (words)")
setk("cHalfEnd", 119.0, T, 0.1, "s: that callout exits before the travel")
setk("minCut", 120.3, T, 0.1, "s: scene switch PR to minutes, in the middle of trav2 (no cut)")
setk("min27T0", 121.5, T, 0.1, "s: the other 26 minute cubes of the 80 % column start to land")
setk("min27T1", 123.5, T, 0.1, "s: the 80 % column is full")
setk("cMin27", 124.0, T, 0.1, "s: the 27 min callout lands with the pulse (never rolled)")
setk("cMin27End", 126.0, T, 0.1, "s: that callout exits before the camera moves")
setk("min289T0", 128.5, T, 0.1, "s: the 50 % column starts to rise (speed ramp x8, easing to x1 at the top)")
setk("min289T1", 131.5, T, 0.1, "s: the 50 % column is full (ring beat)")
setk("rampK", 8, [4, 12], 0.5, "speed ramp: the fast rate as a multiple of the end rate")
setk("rampA", 0.45, [0.2, 0.7], 0.01, "speed ramp: share of the time at the fast rate")
setk("rampB", 0.68, [0.4, 0.9], 0.01, "speed ramp: share of the time when the rate is back to x1")
setk("w4", 0.02, [0.005, 0.1], 0.005, "rank width of a 289-column cube's drop (it slows with the ramp)")
setk("cMin289", 131.5, T, 0.1, "s: the 4 h 49 min callout lands")
setk("cMin289End", 133.5, T, 0.1, "s: that callout exits")
setk("cRatio", 134.0, T, 0.1, "s: the ratio callout lands")
setk("cRatioEnd", 136.0, T, 0.1, "s: that callout exits before the travel")
setk("minPlaneIn", 134.5, T, 0.1, "s: the plane fades in on the minute floor (it carries join 3)")
setk("tauCut", 137.3, T, 0.1, "s: scene switch minutes to tau, in the middle of trav3 (no cut)")
setk("bookT0", 138.5, T, 0.1, "s: the bookend: the cubes return to their tiles (spring); the plane fades")
setk("bookT1", 140.0, T, 0.1, "s: the cubes have returned (ring beat)")
setk("dimT0", 138.5, T)
setk("qIn", 142.5, T, 0.1, "s: the Monday question")
setk("honestIn", 144.5, T, 0.1, "s: the one honest-limits line")
setk("qOut", 149.0, T, 0.1, "s: the Monday columns exit (before the card)")
# ── numbers, shadows, look
setk("dropDur", 0.35, [0.15, 0.8], 0.05, "s: a landing mark's drop (count-ins count it when it lands)")
setk("numWt", 2.0, [1.0, 3.0], 0.1, "weight beat on a landed number, x the text-reveal stroke")
setk("numPulse", 0.5, [0.2, 0.8], 0.05, "s: length of that weight beat")
setk("shLag", 0.1, [0.0, 0.2], 0.01, "s: the shadows trail the marks (3 frames) and settle after them")
setk("lookAmb", 0.18, [0.0, 0.3], 0.01, "ambient shadow layer strength (soft disc, MIN-blended)")
setk("ambScale", 3.5, [1.2, 14.0], 0.1, "ambient shadow radius x a tile half width (marks off tiles: x1.4 of a cube)")
setk("lookRim", 0.1, [0.0, 0.1], 0.005, "Fresnel rim on cube edges (0.10 lifts an edge 8-16 % white)")
setk("lookGrain", 0.012, [0.0, 0.02], 0.001, "grain sigma (seeded per frame index at grainFps)")
setk("grainFps", 15, [12, 30], 1, "grain re-seeds per second")
setk("floorLum", 12, [0, 20], 1, "darkest code value after the grain (a MAX floor: no pixel crushes to black)")

# trim long docs (page budget): one clause each, the time prefix kept
for d in DOC:
    w = d.get("what") or ""
    if len(w) > 64:
        cut = re.split(r"\s\(|;\s|:\s(?=[a-z])", w)[0] if not w.startswith("s:") else "s:" + re.split(r"\s\(|;\s", w[2:])[0]
        d["what"] = cut if len(cut) <= 64 else cut[:64].rsplit(" ", 1)[0]

f["captions"] = [
    [0.5, 5.0, "A usually-right agent does most of the work."],
    [6.0, 10.5, "Or does it? Count every try, task by task."],
    [12.5, 17.0, "Customer service: GPT-4o on tau-bench retail."],
    [17.5, 21.0, "115 tasks. One tile each."],
    [25.0, 28.5, "Four tries per task: 460 cubes."],
    [31.0, 34.5, "278 passed. A lit cube is a pass."],
    [35.0, 38.0, "Tries that pass: 60.4 %."],
    [40.0, 44.5, "Now turn the field. Each task becomes a column."],
    [45.5, 59.5, "Judge a task by all its tries, not by one."],
    [60.0, 64.5, "Sort the same columns by how many tries passed."],
    [64.5, 68.0, "44 tasks pass all four tries."],
    [69.0, 71.5, "22 never pass."],
    [71.5, 75.5, "Cut the field at all four tries."],
    [75.5, 79.0, "All four tries pass: 38.3 %."],
    [79.5, 83.0, "Count one try at a time: 60.4 %."],
    [83.0, 87.0, "Count each task by all four tries: 38.3 %."],
    [87.0, 91.5, "Same cubes, two answers. Which one was quoted?"],
    [91.5, 95.5, "The paper's own 8-try run: under 25 %."],
    [95.5, 100.0, "A pass rate averages tries. Every time is per task."],
    [100.0, 104.5, "Passing a benchmark is not the same as shipping."],
    [104.5, 107.5, "296 PRs pass the tests."],
    [107.5, 111.5, "Top SWE-bench Verified score: 80.9 %."],
    [111.5, 115.5, "4 maintainers read them. Would they merge?"],
    [115.5, 119.0, "About half would not be merged."],
    [120.5, 125.0, "Another agent, another yardstick: task length."],
    [125.0, 128.0, "At the 80 % bar: 27 min."],
    [131.5, 134.5, "4 h 49 min at the 50 % bar."],
    [134.5, 138.5, "About 10 times longer than at the 80 % bar."],
    [138.5, 142.5, "On Monday, ask for the every-time number."],
]
for a, b, s in f["captions"]:
    assert b - a >= 1.3 + 0.06 * len(s) - 1e-9, (a, b, s)
    assert abs(a * 2 - round(a * 2)) < 1e-9, (a, s)
for c in f["chapters"]:
    if c["id"] == "count": c["t1"] = 136.5
    if c["id"] == "monday": c["t0"] = 136.5
f["count"] = {"at": K["cTasks"]}
f["cuts"] = []          # no hard cut left: the three joins are camera travels (one continuous picture)
json.dump(f, open(FJ, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# ── claims: the count-in tenths (JS Math.round = floor(x + 0.5) for these positive values)
cl = json.load(open(CJ, encoding="utf-8")); C = cl["claims"] if isinstance(cl, dict) else cl
P = {c["id"]: c["value"] for c in C}
rnd = lambda x: int(x + 0.5)
def tenths(base, n): return [base + rnd(n * b / 10) for b in range(11)]
add = [
    ("countTiles", tenths(1, P["tasks"] - 1), "Array.from({length: 11}, (_, b) => 1 + Math.round((tasks - 1) * b / 10))", "the task count-in: the hook tile, then the other 114 tiles in tenths (each value is the tiles on screen)", "CASE 12.5-17.0 s, callout a.tasks"),
    ("countTries", tenths(4, P["tries"] - 4), "Array.from({length: 11}, (_, b) => 4 + Math.round((tries - 4) * b / 10))", "the try count-in: the hook task's four cubes, then the other 456 in tenths (cubes on screen)", "CASE 21.0-25.0 s, callout a.tries"),
    ("countLit", tenths(3, P["passed"] - 3), "Array.from({length: 11}, (_, b) => 3 + Math.round((passed - 3) * b / 10))", "the pass count-in: the hook task's three passes, then the other 275 in tenths (lit cubes on screen)", "CASE 28.5-31.0 s, callout a.pass"),
    ("countPrs", tenths(0, P["prs"]), "Array.from({length: 11}, (_, b) => Math.round(prs * b / 10))", "the PR count-in: the 296 PR cubes in tenths (cubes on screen)", "COUNT 101.0-104.0 s, callout r.prs"),
]
have = {c["id"]: c for c in C}
for i, v, fo, tx, wh in add:
    row = {"id": i, "value": v, "formula": fo, "grade": "A", "source": "S2" if i != "countPrs" else "S4", "text": tx, "where": wh}
    if i in have: have[i].clear(); have[i].update(row)
    else: C.append(row)
json.dump(cl, open(CJ, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("film.json: %d knobs, %d captions; claims %d; tenths %s" % (len(K), len(f["captions"]), len(C), [a[1] for a in add]))
