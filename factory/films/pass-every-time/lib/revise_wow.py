#!/usr/bin/env python3
"""lib/revise_wow.py · Wave WOW re-cut (lane B6, 2026-10-11): edits ../film.json IN PLACE on top of r1, r2 and tier 2.
Hero moves on springs / expo-out (0.8-1.6 s) with the freed time given to the hold after landing, every label through K.reveal,
beat 0.5 s with captions merged or lengthened to hold >= 1.3 s + 0.06 s/char, the hero material (manager level), light wipes at
the two scene joins, a macro hook. The story, claims, chapter windows, honest line and card are unchanged.
Idempotent: run twice, same file."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); FJ = os.path.join(HERE, "..", "film.json")
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

# ── the drift: the rig's own (holds only, after a settle), replacing the film's always-on yaw sinusoid
for n in ("driftDeg", "driftPeriod"): drop(n)
setk("camDriftAmp", 0.012, [0.0, 0.02], 0.001, "fraction of the eye distance: ambient dolly drift during holds only (0 while a camera move runs and through its settle)")
setk("driftYaw", 0.8, [0.0, 2.0], 0.1, "degrees: ambient yaw drift about the aim point during holds only (period 13.7 s)")
setk("camHoldSettle", 0.4, [0.0, 1.0], 0.05, "s: true stillness after each camera move before the drift fades in (also rig script.settle)")

# ── HOOK 0-12: one task at macro scale, its four tries drop in by 0.5 s, then the camera pulls back to the plan pose
setk("hookT0", 0.0, [0.0, 1.0], 0.1, "s: the hook task's four cubes start to drop onto its tile, macro shot (a hero move by 0.5 s)")
setk("hookLitT0", 1.5, [0.8, 3.0], 0.1, "s: the hook task's three passing tries light gold (0.2 s apart)")
setk("hookAz", -32, [-70, 70], 1, "degrees: azimuth of the macro hook pose")
setk("hookEl", 30, [15, 60], 1, "degrees: elevation of the macro hook pose")
setk("hookDist", 62, [40, 160], 1, "world units: eye distance of the macro hook pose (the tile fills about half the frame height)")
setk("hookLookX", -22, [-60, 60], 1, "world units: aim offset along x from the hook tile (negative puts the tile right of centre, clear of the hook type)")
setk("hookLookY", 7, [-30, 30], 1, "world units: aim offset along y (positive aims higher, so the tile sits lower on screen)")
setk("hook1In", 1.0, what="s: the belief (set type, masked rise) enters beside the hook task")
setk("hook1Out", 5.0, what="s: the belief exits (0.6x the entrance)")
setk("hook2In", 6.0, what="s: the doubt (\"Does it?\") enters")
setk("hook2Out", 10.0, [9.5, 11.4], 0.1, "s: the doubt exits (before the pull-back)")
setk("hookSize", 52)
setk("pullT0", 10.5, [9.5, 11.0], 0.1, "s: the pull-back starts: the camera rises from the macro pose to the opening plan pose (expo-out)")
setk("pullT1", 12.0, [11.0, 12.5], 0.1, "s: the pull-back lands on the plan pose (CASE starts on it)")

# ── CASE 12-60: count-ins of real counts (the number on screen is the marks landed), then the turn in two moves
setk("tileT0", 12.5, [12.0, 14.0], 0.1, "s: the other 114 task tiles start to drop (count-in: power-out, the last 10 % of the count takes 41 % of the time)")
setk("tileT1", 17.5, [16.0, 21.0], 0.1, "s: the last task tile has landed (the 115 callout lands with its pulse)")
setk("cTasks", 12.5, [12.0, 22.0], 0.1, "s: the task-count callout attaches (dot, leader, label) and counts the tiles landed (the first count; count.at)")
setk("cubeT0", 20.5, [20.0, 25.0], 0.1, "s: the other 456 cubes start to arrive, four per tile (2 x 2 footprint, unlit)")
setk("cubeT1", 25.0, [24.0, 28.4], 0.1, "s: the last cube has arrived (the 460 callout lands)")
setk("cTries", 20.5, [20.0, 29.5], 0.1, "s: the try-count callout attaches and counts the cubes landed")
setk("litT0", 28.5, [28.0, 32.0], 0.1, "s: the other 275 passing tries start to light gold, in a seeded order")
setk("litT1", 31.0, [30.5, 34.0], 0.1, "s: the last passing try is lit (the 278 callout lands)")
setk("cPass", 28.5, [28.0, 35.0], 0.1, "s: the passed-count callout attaches and counts the lit cubes")
setk("cPct", 35.0, [34.0, 38.0], 0.1, "s: the share of tries that pass lands with the pulse (a ratio, never rolled; >= 1.5 s after its count)")
setk("cPctEnd", 38.5, [38.0, 40.0], 0.1, "s: that callout exits before the turn")
setk("m1T0", 40.0, [39.0, 42.0], 0.1, "s: M1a starts: the camera orbits plan to side, the field still flat (expo-out)")
setk("m1T1", 41.5, [40.5, 43.0], 0.1, "s: M1a lands on the side key")
setk("stackT0", 42.0, [41.0, 44.0], 0.1, "s: M1b starts: the same 460 cubes re-stack from 2 x 2 tiles into one column per task (spring, anticipation, stagger 0.25)")
setk("stackT1", 43.5, [42.5, 45.5], 0.1, "s: M1b lands (ring beat on an all-four column); the hold that follows has the freed seconds")
setk("cAll", 46.0, [44.0, 56.0], 0.1, "s: callout on one column lit all the way (words only)")
setk("cAllEnd", 50.5, [46.0, 56.0], 0.1, "s: that callout exits")
setk("cNone", 51.0, [48.0, 58.0], 0.1, "s: callout on a column with no lit cube")
setk("cNoneEnd", 57.0, [53.0, 59.9], 0.1, "s: that callout exits before M2")

# ── COUNT 60-135
setk("m2T0", 60.0, [59.0, 62.0], 0.1, "s: M2 starts: the same columns re-sort by tries passed (spring, anticipation, lifted arc; camera still)")
setk("m2T1", 61.5, [60.5, 63.0], 0.1, "s: M2 lands (ring beat on the full block): full columns left, empty right")
setk("c44", 64.5, [62.0, 69.5], 0.1, "s: callout on the full block (tasks that pass all four tries)")
setk("c44End", 67.5, [65.0, 69.5], 0.1, "s: that callout exits")
setk("c22", 68.0, [66.0, 72.0], 0.1, "s: callout on the empty block (tasks that never pass)")
setk("c22End", 70.0, [69.0, 72.0], 0.1, "s: that callout exits before the cut plane rises")
setk("m3T0", 70.5, [70.0, 75.0], 0.1, "s: M3 starts: the cut plane rises from the floor (expo-out, no overshoot); the dimming follows 0.12 s behind")
setk("m3T1", 71.5, [71.0, 76.0], 0.1, "s: the plane rests at the all-four bar (ring beat and an edge flash)")
setk("c44of", 72.0, [71.5, 79.0], 0.1, "s: callout: the exact count of columns lit all the way, of all tasks")
setk("c44ofEnd", 73.5, [72.5, 79.0], 0.1, "s: that callout exits")
setk("c383", 74.0, [73.5, 81.0], 0.1, "s: callout: the share that passes all four tries (>= 1.5 s after the count; lands with the pulse)")
setk("c383End", 76.5, [75.0, 82.5], 0.1, "s: that callout exits")
setk("lad1", 77.0, [76.0, 83.5], 0.1, "s: the pair opens: the one-try count line (278 of 460), its ratio follows after ladLead; the dim lifts so every lit try shows")
setk("lad4", 80.5, [79.0, 89.5], 0.1, "s: the every-try count line (44 of 115), its ratio (gold) follows after ladLead; the dim returns")
setk("ladLead", 1.0)
setk("ladOut", 88.5, [85.0, 93.0], 0.1, "s: the pair exits")
setk("ladLift", 0.85, [0.0, 1.0], 0.05, "0-1: how far the cut's dimming lifts while the one-try count is on (every lit try, not only full columns)")
setk("legOut", 89.0, [85.0, 94.0], 0.1, "s: the unit legend (top left) exits")
setk("paperIn", 89.5, [88.0, 93.0], 0.1, "s: the plate attributed to the paper's own eight-try run")
setk("paperOut", 94.5, [92.0, 98.0], 0.1, "s: that plate exits")
setk("planeOut", 96.0, [90.0, 99.0], 0.1, "s: the cut plane and its pin fade")
setk("wipeW", 0.6, [0.3, 1.2], 0.05, "s: length of the light wipe that carries each scene join (left to right, emphasized curve)")
setk("wipeBand", 22, [10, 120], 2, "sheet units: half width of the light band at the wipe front")
setk("wipeGain", 0.45, [0.0, 1.5], 0.05, "scene-linear gain of the light band (gold; below the bloom threshold except at its core)")
setk("prCut", 100.0, [99.5, 101.0], 0.1, "s: centre of the light wipe from the tau floor to the sheet of pull requests (new dataset; labels hand over too)")
setk("prT0", 99.5, [99.0, 102.0], 0.1, "s: the first pull request cube arrives (the wipe reveals the sheet as it fills)")
setk("prT1", 103.0, [102.0, 105.5], 0.1, "s: the last pull request cube has arrived (the 296 callout lands)")
setk("cPrs", 100.5, [100.0, 106.0], 0.1, "s: the pull-request callout attaches and counts the cubes landed")
setk("cPrsEnd", 107.0, [105.0, 108.0], 0.1, "s: that callout exits")
setk("cSwe", 107.5, [106.5, 109.0], 0.1, "s: callout on the top SWE-bench Verified score (a different set: tests only; lands with the pulse)")
setk("cSweEnd", 111.0, [109.5, 111.45], 0.05, "s: that callout exits before M4")
setk("m4T0", 111.5, [110.0, 113.0], 0.1, "s: M4 starts: the same cubes re-partition into would merge / would not merge (spring, anticipation; camera still)")
setk("m4T1", 113.0, [112.0, 116.0], 0.1, "s: M4 lands (ring beat on the merged block; two equal blocks, schematic)")
setk("ghost0", 113.5, [113.0, 119.0], 0.1, "s: the not-merged block starts to dim to ghost (follow-through after the landing)")
setk("ghost1", 114.0, [113.5, 119.5], 0.1, "s: the not-merged block is dimmed")
setk("cHalf", 115.5, [114.0, 120.0], 0.1, "s: callout: about half would not be merged (words, no digit)")
setk("cHalfEnd", 119.5, [118.0, 121.5], 0.1, "s: that callout exits")
setk("minCut", 120.5, [119.5, 122.0], 0.1, "s: centre of the light wipe to the horizon: two columns of minutes (new dataset)")
setk("min27T0", 120.5, [119.5, 125.0], 0.1, "s: the first minute cube of the 80 % column arrives (as the wipe passes)")
setk("min27T1", 123.0, [122.0, 126.5], 0.1, "s: the 80 % column is full (the 27 min callout lands)")
setk("cMin27", 121.0, [120.5, 125.0], 0.1, "s: the 80 % horizon callout attaches and counts the minutes landed")
setk("cMin27End", 125.5, [124.0, 127.0], 0.1, "s: that callout exits (the 27 min reference pin takes its place)")
setk("min289T0", 125.5, [125.0, 127.5], 0.1, "s: the 50 % column starts to rise (speed ramp: fast, then easing to x1 at the top)")
setk("min289T1", 128.0, [127.0, 130.0], 0.1, "s: the 50 % column is full (ring beat at its top)")
setk("cMin289", 128.0, [127.5, 130.5], 0.1, "s: callout on the 50 % horizon (lands with the pulse)")
setk("cMin289End", 130.5, [129.5, 131.0], 0.1, "s: that callout exits")
setk("cRatio", 131.0, [130.5, 133.5], 0.1, "s: callout: the ratio of the two horizons (about, nearest ten; lands with the pulse)")
setk("cRatioEnd", 134.5, [134.0, 135.0], 0.1, "s: that callout exits")

# ── MONDAY 135-150: the bookend in two moves (marks, then camera)
setk("bookT0", 135.5, [135.0, 137.0], 0.1, "s: the bookend starts: the cubes return to their tiles, camera still (spring)")
setk("bookT1", 137.0, [136.0, 138.0], 0.1, "s: the cubes have returned (ring beat on the field)")
setk("bookCamT0", 137.5, [137.0, 138.5], 0.1, "s: the camera rises back to the opening plan pose (expo-out)")
setk("bookCamT1", 139.0, [138.0, 141.0], 0.1, "s: the bookend lands: the opening frame, only the tasks that passed all four tries still gold")
setk("dimT0", 135.0)
setk("qIn", 139.5, [137.0, 141.0], 0.1, "s: the Monday question enters (left column, beside the field, line stagger)")
setk("qOut", 149.0, [143.0, 149.4], 0.1, "s: the Monday columns and the bookend legend exit (gone before the card at 150)")
setk("honestIn", 143.5, [141.0, 146.0], 0.1, "s: the one honest-limits line enters (right column; stage type)")

# ── the hero look (material hero, manager level; arsenal/patterns/gl-look through gl-post)
setk("lookBloom", 0.1, [0.0, 0.2], 0.01, "bloom gain (threshold 1.0: only the glowing all-four columns pass it; <= 0.1 by the brief)")
setk("lookGrain", 0.015, [0.0, 0.02], 0.001, "grain sigma (seeded, 15 fps; also the dither of the dark floor ramp)")
setk("lookRim", 0.05, [0.0, 0.1], 0.005, "Fresnel rim on cube edges (0.05 lifts an edge 11-14 % code)")
setk("lookShadow", 0.42, [0.0, 0.7], 0.02, "planar contact shadow strength under the cubes (MIN-blended, never double-darkens)")
setk("lookPool", 560, [200, 1200], 10, "world units: radius of the light pool on the floor under the subject")
setk("platePad", 26, [0, 80], 1, "world units: how far the floor plate (the second ladder step) overhangs the field")
setk("glowHero", 2.2, [1.0, 4.0], 0.1, "emission of the columns lit all the way once the cut lands (> 1 passes the bloom threshold)")
setk("anticip", 0.02, [0.0, 0.04], 0.005, "fraction of travel: the counter-move before a mark hero move (anticipation, about 4 frames)")
setk("anticipU", 0.1, [0.05, 0.2], 0.01, "fraction of a mark's move the anticipation takes")
setk("stagger", 0.25)

# ── captions: 29 (one merged), every one held >= 1.3 s + 0.06 s/char, starts on the 0.5 s beat
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
    [68.0, 70.5, "22 never pass."],
    [70.5, 74.0, "Cut the field at all four tries."],
    [74.0, 77.0, "All four tries pass: 38.3 %."],
    [77.0, 80.5, "Count one try at a time: 60.4 %."],
    [80.5, 84.5, "Count each task by all four tries: 38.3 %."],
    [84.5, 89.0, "Same cubes, two answers. Which one was quoted?"],
    [89.5, 93.5, "The paper's own 8-try run: under 25 %."],
    [93.5, 98.0, "A pass rate averages tries. Every time is per task."],
    [100.0, 104.5, "Passing a benchmark is not the same as shipping."],
    [104.5, 107.5, "296 PRs pass the tests."],
    [107.5, 111.5, "Top SWE-bench Verified score: 80.9 %."],
    [111.5, 115.5, "4 maintainers read them. Would they merge?"],
    [115.5, 119.0, "About half would not be merged."],
    [120.5, 125.0, "Another agent, another yardstick: task length."],
    [125.0, 128.0, "At the 80 % bar: 27 min."],
    [128.0, 131.0, "4 h 49 min at the 50 % bar."],
    [131.0, 135.0, "About 10 times longer than at the 80 % bar."],
    [135.5, 139.5, "On Monday, ask for the every-time number."],
]
for a, b, s in f["captions"]:
    need = 1.3 + 0.06 * len(s)
    assert b - a >= need - 1e-9, (a, b, s, need)
    assert abs(a * 2 - round(a * 2)) < 1e-9, (a, s)

f["count"] = {"at": K["cTasks"]}
f["beat"] = 0.5
f["cuts"] = [K["tauCut"]]   # the one hard cut left (back to the tau floor); the 100 and 120.5 joins are light wipes (continuous picture)
f["libs"] = ["arsenal/patterns/text-reveal/pattern.js", "factory/kit2/text-reveal.js"]
f["look"] = {"brand": f.get("look", {}).get("brand", "midnight-ink"), "chrome": "none", "material": "hero"}

# keep knobs and knobs_doc in the same order as before (new rows at the end)
json.dump(f, open(FJ, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("film.json: %d knobs, %d captions, beat %s, cuts %s" % (len(K), len(f["captions"]), f["beat"], f["cuts"]))
