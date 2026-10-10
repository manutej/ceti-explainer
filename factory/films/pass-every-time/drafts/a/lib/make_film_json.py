#!/usr/bin/env python3
"""lib/make_film_json.py · writes ../film.json for pass-every-time draft A "the test floor".
The knob table below is the one source of truth: name, default, [lo, hi], step, what. Every KN.<name> used by lib/film.src.js
must be here (the script checks), and no knob carries an on-screen number (numbers are film.json params = claim values).
Run: python3 lib/make_film_json.py   (deterministic; run twice, diff)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "film.json")
TOPIC = os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "pass-every-time")

# (name, default, lo, hi, step, what)
KNOBS = [
 # HOOK
 ("hook1In", 0.8, 0.2, 2.0, 0.1, "s: the belief (set type) fades in over the empty floor"),
 ("hook1Out", 5.2, 4.0, 6.0, 0.1, "s: the belief starts to fade (gone 0.5 s later)"),
 ("hook2In", 6.2, 5.8, 7.0, 0.1, "s: the doubt (\"Does it?\") fades in"),
 ("hook2Out", 11.2, 10.0, 11.4, 0.1, "s: the doubt starts to fade (gone before CASE at 12)"),
 ("hookSize", 52, 36, 72, 1, "sheet units: the belief, display face (must-read)"),
 # CASE
 ("tileT0", 13.0, 12.0, 14.0, 0.1, "s: the first task tile drops onto the floor"),
 ("tileT1", 20.6, 19.0, 21.0, 0.1, "s: the last task tile has landed (before the count callout)"),
 ("cTasks", 21.0, 20.5, 22.0, 0.1, "s: callout on the task count (the first count; count.at)"),
 ("cubeT0", 23.5, 22.5, 25.0, 0.1, "s: four cubes per tile start to arrive (2 x 2 footprint, unlit ghosts)"),
 ("cubeT1", 28.2, 27.0, 28.4, 0.1, "s: the last cube has arrived"),
 ("cTries", 28.5, 28.0, 29.5, 0.1, "s: callout on the try count"),
 ("litT0", 31.0, 30.0, 32.0, 0.1, "s: the passing tries start to light gold, in a seeded order"),
 ("litT1", 33.6, 32.5, 34.0, 0.1, "s: the last passing try is lit"),
 ("cPass", 34.0, 33.6, 35.0, 0.1, "s: callout on the passed count"),
 ("cPct", 36.5, 36.0, 38.0, 0.1, "s: callout on the share of tries that pass (a ratio, 1.5 s or more after its count)"),
 ("cPctEnd", 39.9, 39.0, 40.0, 0.1, "s: that callout ends before the first move"),
 # M1
 ("m1T0", 40.0, 39.0, 42.0, 0.1, "s: M1 starts: plan to side (the field re-stacks into columns under an orbit)"),
 ("m1T1", 47.0, 44.0, 50.0, 0.1, "s: M1 lands on the side key (hold, T8)"),
 ("cAll", 52.0, 48.0, 56.0, 0.1, "s: callout on one column lit all the way (words only)"),
 ("cNone", 55.6, 52.0, 58.0, 0.1, "s: the callout hard-cuts to a column with no lit cube"),
 ("cNoneEnd", 59.6, 56.0, 59.9, 0.1, "s: that callout ends before M2"),
 # M2
 ("m2T0", 60.0, 59.0, 62.0, 0.1, "s: M2 starts: the same columns re-sort by tries passed (camera still)"),
 ("m2T1", 66.0, 63.0, 68.0, 0.1, "s: M2 lands (skyline: full columns left, empty right)"),
 ("c44", 68.0, 66.5, 69.5, 0.1, "s: callout on the full block (tasks that pass all four tries)"),
 ("c22", 70.5, 69.0, 72.0, 0.1, "s: the callout hard-cuts to the empty block (tasks that never pass)"),
 ("c22End", 72.9, 71.5, 73.0, 0.1, "s: that callout ends before the cut plane rises"),
 # M3
 ("m3T0", 73.0, 71.0, 75.0, 0.1, "s: M3 starts: the cut plane rises from the floor (columns below it dim, none removed)"),
 ("m3T1", 77.0, 75.0, 79.0, 0.1, "s: the plane rests at the all-four bar"),
 ("c44of", 77.5, 76.0, 79.0, 0.1, "s: callout: the exact count of columns lit all the way, of all tasks"),
 ("c383", 79.5, 78.5, 81.0, 0.1, "s: callout: the share that passes all four tries (>= 1.5 s after the count)"),
 ("c383End", 82.4, 81.0, 82.5, 0.1, "s: that callout ends"),
 ("lad1", 82.6, 82.0, 83.5, 0.1, "s: the ratio row opens with one try"),
 ("lad2", 82.9, 82.5, 84.0, 0.1, "s: both of two tries"),
 ("lad3", 85.6, 84.5, 87.0, 0.1, "s: all of three tries"),
 ("lad4", 88.2, 87.0, 89.5, 0.1, "s: all four tries (gold)"),
 ("ladOut", 91.0, 89.5, 93.0, 0.1, "s: the ratio row starts to fade"),
 ("legOut", 90.8, 88.0, 94.0, 0.1, "s: the unit legend (top left) fades before the ratio row and the plate need that corner"),
 ("paperIn", 91.4, 90.0, 93.0, 0.1, "s: the plate attributed to the paper's own eight-try run"),
 ("paperOut", 97.0, 94.0, 98.0, 0.1, "s: that plate starts to fade"),
 ("planeOut", 96.0, 90.0, 99.0, 0.1, "s: the cut plane and its pin fade"),
 # PR
 ("prCut", 100.0, 99.5, 101.0, 0.1, "s: hard cut from the tau floor to the sheet of pull requests (new dataset; labels cut too)"),
 ("prT0", 101.0, 100.0, 102.0, 0.1, "s: the first pull request cube arrives"),
 ("prT1", 104.6, 103.0, 105.5, 0.1, "s: the last pull request cube has arrived"),
 ("cPrs", 105.0, 104.5, 106.0, 0.1, "s: callout on the pull-request count"),
 ("cSwe", 107.5, 106.5, 109.0, 0.1, "s: callout on the top SWE-bench Verified score (a different set: tests only)"),
 ("cSweEnd", 110.3, 109.5, 110.45, 0.05, "s: that callout ends before M4"),
 ("m4T0", 110.5, 109.5, 112.0, 0.1, "s: M4 starts: the same cubes re-partition into would merge / would not merge (camera still)"),
 ("m4T1", 117.5, 115.0, 119.0, 0.1, "s: M4 lands (two equal blocks, schematic)"),
 ("ghost0", 117.5, 116.0, 119.0, 0.1, "s: the not-merged block starts to dim to ghost"),
 ("ghost1", 118.3, 117.0, 119.5, 0.1, "s: the not-merged block is dimmed"),
 ("cHalf", 118.4, 117.8, 120.0, 0.1, "s: callout: about half would not be merged (words, no digit)"),
 ("cHalfEnd", 121.0, 120.0, 121.5, 0.1, "s: that callout ends"),
 # MINUTES
 ("minCut", 121.0, 120.5, 122.0, 0.1, "s: hard cut to the horizon: two columns of minutes (new dataset)"),
 ("min27T0", 124.0, 123.0, 125.0, 0.1, "s: the first minute cube of the 80 % column arrives"),
 ("min27T1", 126.0, 125.0, 126.5, 0.1, "s: the 80 % column is full"),
 ("cMin27", 124.0, 123.5, 125.0, 0.1, "s: callout on the 80 % horizon"),
 ("cMin27End", 126.5, 125.5, 127.0, 0.1, "s: that callout ends"),
 ("min289T0", 126.6, 126.0, 127.5, 0.1, "s: the first minute cube of the 50 % column arrives"),
 ("min289T1", 129.4, 128.0, 130.0, 0.1, "s: the 50 % column is full"),
 ("cMin289", 129.6, 129.0, 130.5, 0.1, "s: callout on the 50 % horizon"),
 ("cRatio", 132.0, 131.5, 133.5, 0.1, "s: callout hard-cuts to the ratio of the two horizons (about, nearest ten)"),
 ("cRatioEnd", 135.0, 134.0, 135.0, 0.1, "s: that callout ends"),
 # MONDAY
 ("tauCut", 135.0, 134.5, 136.0, 0.1, "s: hard cut back to the tau floor (the bookend)"),
 ("bookT0", 135.4, 135.0, 137.0, 0.1, "s: the camera rises back to the plan pose of the opening"),
 ("bookT1", 139.6, 137.0, 141.0, 0.1, "s: the camera is back in plan"),
 ("dimT0", 135.4, 134.5, 137.0, 0.1, "s: the floor dims so the Monday type reads"),
 ("qIn", 135.6, 135.0, 137.0, 0.1, "s: the Monday question fades in"),
 ("qOut", 141.0, 139.5, 141.4, 0.1, "s: the question starts to fade"),
 ("honestIn", 141.5, 141.2, 143.0, 0.1, "s: the one honest-limits line fades in (stage type; no caption shows after 141)"),
 ("mondaySize", 36, 28, 48, 1, "sheet units: the Monday question"),
 ("honestSize", 32, 28, 44, 1, "sheet units: the honest-limits line"),
 ("mondayDim", 0.5, 0, 0.8, 0.05, "0-1: how far the floor is mixed toward the ground under the Monday type"),
 # camera
 ("camFov", 28, 20, 45, 1, "degrees: vertical field of view, fixed for the whole film (I5 same lens)"),
 ("camPlanEl", 89, 75, 89, 1, "degrees: elevation of the plan pose (89 = straight down)"),
 ("camPlanDist", 720, 400, 1200, 10, "world units: eye distance in the plan pose of the tau floor"),
 ("camLookZ", 16, -60, 60, 1, "world units: aim point along z in the tau poses (positive lifts the field on screen)"),
 ("camSideAz", 18, 0, 60, 1, "degrees: azimuth swept by M1 (the side key)"),
 ("camSideEl", 30, 15, 50, 1, "degrees: elevation of the side key (lower hides back rows, higher flattens the columns)"),
 ("camSideLookZ", -17, -80, 60, 1, "world units: aim point along z in the side key (lower puts the field lower on screen, clear of the type above)"),
 ("camSideR", 0.9, 0.5, 1.4, 0.05, "factor: eye distance of the side key relative to the plan pose"),
 ("camPrDist", 500, 300, 900, 10, "world units: eye distance over the sheet of pull requests (plan)"),
 ("camPrLookZ", 0, -50, 50, 1, "world units: aim point along z over the pull-request sheet"),
 ("camMinAz", 0, -30, 30, 1, "degrees: azimuth of the horizon view"),
 ("camMinEl", 8, 0, 30, 1, "degrees: elevation of the horizon view"),
 ("camMinDist", 1050, 500, 1400, 10, "world units: eye distance of the horizon view"),
 ("camMinLookY", 125, 50, 250, 5, "world units: height the horizon view aims at"),
 ("bookDist", 1000, 600, 1500, 10, "world units: eye distance of the bookend plan pose (farther than the opening so the top band is free for type)"),
 ("bookLookZ", -35, -200, 100, 1, "world units: aim point along z in the bookend (negative lowers the field on screen)"),
 ("driftDeg", 1.0, 0, 3, 0.1, "degrees: amplitude of the ambient yaw drift (R-E P12; at most 3)"),
 ("driftPeriod", 50, 20, 200, 5, "s: period of the ambient yaw drift"),
 # world
 ("cubeEdge", 8, 5, 12, 0.5, "world units: edge of one cube (never changes inside a move, I3)"),
 ("cubeGap", 0.18, 0.05, 0.4, 0.01, "fraction of an edge: seam between cubes"),
 ("tileGap", 0.35, 0.2, 1.0, 0.05, "edges: aisle between task tiles"),
 ("gridCols", 12, 10, 23, 1, "task tiles per row on the floor (rows follow from the task count)"),
 ("prCols", 37, 20, 50, 1, "pull-request cubes per row in the sheet (rows follow from the count)"),
 ("prGap", 4.0, 1.5, 6.0, 0.1, "rows: aisle between the merged and not-merged blocks"),
 ("barCols", 9, 5, 12, 1, "minute cubes per row in a horizon column"),
 ("barGap", 4, 2, 8, 0.5, "cubes: aisle between the two horizon columns"),
 ("prZ", 2400, 1500, 3500, 100, "world units: where the pull-request floor sits (far from the tau floor so it never enters its frame)"),
 ("minX", 4200, 3500, 6000, 100, "world units: where the horizon floor sits"),
 ("seedLit", 7, 1, 99999, 1, "seed: the order the passing tries light in (a permutation made once in setup)"),
 ("seedMerge", 20261010, 1, 2000000000, 1, "seed: which pull requests land in which block (schematic, exactly half and half)"),
 # look
 ("shadeFront", 0.80, 0.4, 1.0, 0.02, "face light: front (+z)"),
 ("shadeBack", 0.50, 0.3, 1.0, 0.02, "face light: back (-z)"),
 ("shadeRight", 0.66, 0.3, 1.0, 0.02, "face light: right (+x)"),
 ("shadeLeft", 0.58, 0.3, 1.0, 0.02, "face light: left (-x)"),
 ("ghostMix", 0.30, 0.1, 0.5, 0.01, "0-1: an unlit cube, ground toward muted"),
 ("plateMix", 0.16, 0.05, 0.4, 0.01, "0-1: a task tile's plate, ground toward muted"),
 ("floorMix", 0.55, 0.0, 1.0, 0.05, "0-1: the floor, ground toward panel"),
 ("gridAlpha", 0.10, 0, 0.4, 0.01, "0-1: opacity of the faint floor grid"),
 ("gridStep", 2, 1, 6, 1, "tile pitches between grid lines"),
 ("floorSize", 1400, 800, 3000, 100, "world units: edge of the floor square"),
 ("cutDim", 0.72, 0.3, 0.95, 0.01, "0-1: how far a column below the plane is mixed toward the ground (dims, never removes)"),
 ("planeAlpha", 0.20, 0, 0.5, 0.01, "0-1: fill opacity of the cut plane"),
 ("planeMargin", 16, 0, 60, 2, "world units: how far the plane overhangs the field"),
 # motion
 ("arrW", 0.04, 0.01, 0.1, 0.01, "fraction of a count-in window one mark takes to drop and grow into place"),
 ("drop", 60, 0, 100, 5, "world units: height a mark falls from as it arrives"),
 ("lift1", 6, 0, 30, 1, "world units: arc height of a cube leaving its tile cell in M1"),
 ("lift2", 14, 0, 40, 1, "world units: arc height of a column crossing the floor in M2"),
 ("stagger", 0.25, 0, 0.6, 0.05, "0-1: how spread out in time the marks of one move leave (each keeps its own path)"),
 # labels
 ("hold", 8, 0, 15, 1, "frames a label must be pushed before it hides (gl-labels hysteresis)"),
 ("leader", 20, 12, 40, 2, "sheet units: leader length of an ordinary pin"),
 ("maxShown", 12, 1, 14, 1, "label budget per frame for ordinary pins"),
 ("calloutLeader", 40, 40, 90, 2, "sheet units: leader length of the callout"),
 ("calloutSize", 34, 28, 56, 1, "sheet units: callout type (result, display face)"),
 ("dispAdv", 0.5, 0.4, 0.62, 0.01, "em: average advance of the display face, for label boxes"),
 ("subGap", 3, 0, 8, 1, "sheet units: extra air between a label's number and the line under it (keeps descenders off the second line)"),
 ("plate", 0.78, 0, 1, 0.02, "0-1: opacity of the ground-coloured plate behind a label"),
 ("ladSize", 34, 28, 48, 1, "sheet units: the ratio row"),
 ("plateSize", 44, 28, 64, 1, "sheet units: the paper's eight-try sentence"),
]

PARAMS_EXTRA = {"tries": 460, "passed": 278, "h50": 289, "pass1": 60.4, "pass2": 49.1, "pass3": 43.0, "pass4": 38.3, "horizonRatio": 10}

CAPTIONS = [
 [0.8, 5.8, "An agent that is usually right does most of the work."],
 [6.2, 11.6, "Or does it? Count every try, task by task."],
 [12.4, 20.6, "A customer-service test: GPT-4o on tau-bench retail."],
 [21.0, 28.0, "115 tasks. One tile each."],
 [28.5, 33.5, "Four tries per task: 460 cubes."],
 [34.0, 36.4, "278 passed. A lit cube is a pass."],
 [36.8, 39.8, "Tries that pass: 60.4 %."],
 [40.2, 46.8, "Now turn the field. Each task becomes a column."],
 [47.5, 59.5, "Judge a task by all its tries, not by one."],
 [60.4, 66.5, "Sort the same columns by how many tries passed."],
 [68.0, 70.4, "44 tasks pass all four tries."],
 [70.6, 72.9, "22 never pass."],
 [73.2, 79.3, "Cut the field at all four tries."],
 [79.6, 82.4, "All four tries pass: 38.3 %."],
 [82.6, 85.4, "One try: 60.4 %. Both of two must pass: 49.1 %."],
 [85.6, 88.0, "All of three must pass: 43.0 %."],
 [88.2, 91.0, "All four: 38.3 %. Each extra try lowers it."],
 [91.4, 96.8, "The paper's own 8-try run: under 25 %."],
 [97.2, 99.8, "A pass rate averages tries. Every time is per task."],
 [100.2, 104.8, "Passing a benchmark is not the same as shipping."],
 [105.0, 107.3, "296 PRs pass the tests."],
 [107.5, 110.3, "Top SWE-bench Verified score: 80.9 %."],
 [110.6, 117.8, "4 maintainers read them. Would they merge?"],
 [118.4, 120.9, "About half would not be merged."],
 [121.2, 123.9, "Another agent, another yardstick: task length."],
 [124.0, 126.4, "One cube is one minute. At the 80 % bar: 27 minutes."],
 [126.6, 129.4, "At the 50 % bar, the agent reaches much further."],
 [129.6, 131.9, "4 h 49 min at the 50 % bar."],
 [132.1, 134.8, "About 10 times longer than at the 80 % bar."],
 [135.3, 140.8, "Monday: how often does it pass when it must every time?"],
]

SOURCES = [
 ["S1", "tau-bench README leaderboard, retail, function calling (gpt-4o): Pass^1..4 = 0.604 / 0.491 / 0.430 / 0.383. https://github.com/sierra-research/tau-bench"],
 ["S2", "tau-bench historical_trajectories/gpt-4o-retail.json: 460 rows = 115 tasks x 4 trials, per-task reward 0/1 (downloaded and recomputed 2026-10-10). https://raw.githubusercontent.com/sierra-research/tau-bench/main/historical_trajectories/gpt-4o-retail.json"],
 ["S3", "Yao, Shinn, Razavi, Narasimhan (2024), tau-bench, abstract: pass^8 'as low as ~25 %' on retail (PDF blocked; abstract read through search results; grade B). https://arxiv.org/abs/2406.12045"],
 ["S4", "METR note 2026-03-10: 296 SWE-bench-passing PRs, 4 active maintainers, roughly half would not be merged (grade B, read through quoted coverage). https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/"],
 ["S5", "METR time horizon of Claude Opus 4.5, Dec 2025: 50 % horizon about 4 h 49 min, 80 % horizon 27 min (grade B; via Techmeme and The Decoder)."],
 ["S6", "Anthropic, Claude Opus 4.5 announcement 2025-11-24: 80.9 % on SWE-bench Verified (vendor-reported; grade B). https://www.anthropic.com/news/claude-opus-4-5"],
 ["S7", "factory/topics/pass-every-time/recompute.py: recomputes 60.4 / 49.1 / 43.0 / 38.3 and 22 / 18 / 9 / 22 / 44 from the per-task outcomes."],
]

def main():
    claims = json.load(open(os.path.join(HERE, "..", "claims.json")))
    trials = json.load(open(os.path.join(TOPIC, "data", "tau_retail_trials.json")))["tasks"]
    params = dict(claims["params"]); params.update(PARAMS_EXTRA)
    params["trial"] = [sum(b << i for i, b in enumerate(t["tries"])) for t in trials]
    names = [k[0] for k in KNOBS]
    assert len(names) == len(set(names)), "duplicate knob"
    src = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
    used = set(re.findall(r"KN\.([A-Za-z0-9_]+)", src))
    missing = sorted(used - set(names)); unused = sorted(set(names) - used)
    assert not missing, "knobs used but not defined: %s" % missing
    if unused: print("WARN knobs defined but unused:", unused)
    knobs, doc = {}, []
    for n, d, lo, hi, step, what in KNOBS:
        assert lo <= d <= hi, n
        knobs[n] = d; doc.append({"name": n, "range": [lo, hi], "step": step, "what": what})
    film = {
      "id": "pass-every-time", "title": "Pass every time",
      "eyebrow": "CETI · a data film · agents, one try versus every try",
      "lede": "A field of 460 cubes, one per try, lit about 60 percent: the picture of an agent that is usually right. Turn the field and the same cubes stand as 115 columns, one per task: only 44 are lit all the way. Then the same move on 296 pull requests that pass the tests, and on the length of task an agent can do reliably.",
      "format": "feature-long", "level": "manager", "renderer": "webgl", "dur": 153, "seed": 20261010,
      "look": {"brand": "midnight-ink", "chrome": "none", "material": "ink"},
      "type": {"disp": "Newsreader", "mono": "DM Mono"},
      "params": params, "knobs": knobs, "knobs_doc": doc,
      "commit": {"enabled": False}, "count": {"at": 21.0},
      "chapters": [
        {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "HOOK", "title": "Usually right"},
        {"id": "case", "beat": "CASE", "t0": 12, "t1": 60, "eyebrow": "CASE", "title": "The field, then the columns"},
        {"id": "count", "beat": "COUNT", "t0": 60, "t1": 135, "eyebrow": "COUNT", "title": "Cut at every time"},
        {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "MONDAY", "title": "Who checks the merge?"}],
      "captions": CAPTIONS,
      "brand": {"takeaway": "A pass is not a pass every time."},
      "sources": SOURCES,
      "honest": ["One 2024 model, and agents that could not revise: newer ones may do better."],
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(film, f, ensure_ascii=False, separators=(",", ":"))
    print("film.json %d bytes, %d knobs, %d captions" % (os.path.getsize(OUT), len(knobs), len(CAPTIONS)))

if __name__ == "__main__":
    main()
