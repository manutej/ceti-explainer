#!/usr/bin/env python3
"""lib/make_film_json.py · writes ../film.json for build-the-agent draft B "the staircase". The knob table below is the one source of truth
(name, default, lo, hi, step, what); every KN.<name> used by lib/film.src.js must be here (checked), and no knob carries an on-screen number.
Params = the claims' params + every claim value by id + the recorded data (pass bits, issue codes, calls per build) read from the topic's data copies.
Run: python3 lib/make_film_json.py   (deterministic; run twice, diff)."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "film.json")
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "..", ".."))
TOPIC = os.path.join(REPO, "factory", "topics", "build-the-agent")

K = []
def k(name, v, lo, hi, step, what): K.append((name, v, lo, hi, step, what))
# HOOK
k("moveDur", 1.6, 0.8, 2.0, 0.1, "s: camera and tracked-mark move")
k("springDur", 1.3, 0.8, 2.0, 0.1, "s: slab, plane and question springs")
k("hook1In", 1.0, 0.2, 2.0, 0.1, "s: the belief (set type) rises")
k("hook1Out", 5.0, 4.0, 6.0, 0.1, "s: the belief starts to exit")
k("hook2In", 5.5, 5.0, 7.0, 0.1, "s: the doubt rises")
k("hook2Out", 10.0, 9.0, 11.4, 0.1, "s: the doubt starts to exit")
k("hookSize", 50, 36, 64, 1, "units: hook type (display face)")
# CASE: the field
k("pullT0", 12.0, 12.0, 12.0, 0.5, "s: camera pull-back from the macro to the plan starts")
k("tileT0", 12.5, 12.0, 14.0, 0.5, "s: the first of 320 tiles lands (the first count)")
k("tileT1", 17.0, 15.0, 18.0, 0.5, "s: the last tile has landed")
k("cubeT0", 20.0, 18.0, 22.0, 0.5, "s: six cubes per tile start to land (the second count)")
k("cubeT1", 23.5, 21.5, 24.0, 0.5, "s: the last cube has landed")
k("litT0", 27.5, 25.0, 29.0, 0.5, "s: the passed tries start to light, in data order")
k("litT1", 31.0, 29.0, 33.0, 0.5, "s: the last lit cube")
k("m1T0", 40.0, 38.0, 42.0, 0.5, "s: M1 starts: plan to side, tiles re-stack into columns")
# COUNT: the staircase
k("m2T0", 60.0, 58.0, 62.0, 0.5, "s: M2 starts: the columns sort by lit count, camera still")
k("mDT0", 62.0, 61.6, 64.0, 0.5, "s: camera starts for the dark end")
k("mFT0", 67.0, 65.0, 69.0, 0.5, "s: camera starts to climb along the steps")
k("mLT0", 71.5, 69.0, 73.0, 0.5, "s: camera pulls back to the whole staircase")
k("ghostT0", 73.5, 72.0, 76.0, 0.5, "s: the luck staircase starts to arrive")
k("ghostT1", 75.0, 74.0, 78.0, 0.1, "s: the luck staircase is in")
k("m3T0", 79.0, 77.0, 81.0, 0.5, "s: M3 starts: the cut plane rises to six of six")
k("j1T0", 88.5, 86.0, 90.0, 0.5, "s: J1 starts: telecom columns travel to their plate")
k("m4aT0", 90.5, 89.0, 93.0, 0.5, "s: M4a starts: telecom cubes regroup into six tanks, one per build")
k("m4bT0", 95.5, 94.0, 98.0, 0.5, "s: M4b starts: the same cubes regroup into three tanks by kind")
k("j3T0", 105.5, 103.0, 107.0, 0.5, "s: J3 starts: camera travels to the board")
k("taskT0", 107.5, 106.0, 109.0, 0.5, "s: the first task tile lands (the third count)")
k("taskT1", 110.0, 108.0, 111.5, 0.5, "s: the last task tile has landed")
k("slabT0", 112.5, 111.0, 114.0, 0.5, "s: the four slabs start to rise to the best build's scores")
k("bestT0", 114.0, 112.5, 116.0, 0.5, "s: the best build's plane lands (spring)")
k("expT0", 118.0, 116.0, 120.0, 0.5, "s: the expert's plane and ghost slabs rise")
k("mCT0", 119.5, 118.0, 121.5, 0.5, "s: camera cranes up to the expert plane, the horizon")
k("j4T0", 126.0, 124.0, 127.0, 0.5, "s: J4 starts: camera travels to the call sheet, the planes sink")
k("callT0", 128.0, 127.0, 130.0, 0.5, "s: the first call tile lands (the fourth count)")
k("callT1", 132.0, 130.0, 134.0, 0.5, "s: the last call tile has landed")
k("askT0", 135.0, 133.0, 137.0, 0.5, "s: the questions to the client stand up from the sheet")
k("mMT0", 139.5, 138.0, 141.0, 0.5, "s: camera dips to look across the sheet (Monday)")
# pins, legend, Monday
k("pinAt0", 13.5, 13.0, 15.0, 0.5, "s: the case count callout attaches (camera landed)")
k("wordAt", 13.5, 13.0, 16.0, 0.5, "s: plate names attach")
k("plateAt", 17.0, 16.0, 19.0, 0.5, "s: plate case counts attach")
k("pctAt", 34.5, 33.5, 37.0, 0.5, "s: the share of tries that pass lands (after its counts)")
k("noneAt", 50.0, 46.0, 54.0, 0.5, "s: words on a column nobody solved")
k("allAt", 55.0, 50.0, 58.0, 0.5, "s: words on a column everybody solved")
k("darkAt", 64.5, 64.0, 66.0, 0.5, "s: the dark-columns count lands")
k("fullAt", 69.0, 68.6, 70.5, 0.5, "s: the full-columns count lands")
k("luckAt", 75.0, 74.0, 77.0, 0.5, "s: the two luck pins attach")
k("ofAt", 81.0, 80.8, 83.0, 0.5, "s: the cut readout: lit in all six, of all cases")
k("fullPctAt", 84.5, 83.5, 86.5, 0.5, "s: the share solved by all six lands")
k("loAt", 92.5, 92.1, 94.0, 0.5, "s: pins on the lowest and highest build tanks")
k("kindAt", 97.5, 97.1, 99.0, 0.5, "s: pins on the kind-of-problem tanks")
k("plate2At", 110.0, 109.0, 111.5, 0.5, "s: plate counts of the board attach")
k("rulerAt", 110.5, 109.5, 112.4, 0.5, "s: the 0 to 100 ruler appears")
k("bestAt", 115.5, 115.0, 117.0, 0.5, "s: the best builder's score lands")
k("exp2At", 121.5, 121.0, 123.0, 0.5, "s: the expert's score lands")
k("bankAt", 124.0, 123.0, 125.0, 0.5, "s: the banking pair lands")
k("callPinAt", 128.5, 127.6, 130.0, 0.5, "s: the tool-call count callout attaches")
k("askAt", 137.0, 136.6, 139.0, 0.5, "s: the questions-to-the-client count lands")
k("pcAt", 141.5, 141.1, 144.0, 0.5, "s: the share of all tool calls lands")
k("taskAt", 108.0, 107.1, 110.0, 0.5, "s: the task count callout attaches")
k("qIn", 142.0, 141.1, 144.0, 0.5, "s: the Monday question rises")
k("honestIn", 143.5, 142.0, 146.0, 0.5, "s: the one honest line rises")
k("qOut", 149.0, 147.0, 149.4, 0.5, "s: the Monday type exits before the card")
k("mondaySize", 32, 28, 44, 1, "units: Monday question")
k("honestSize", 21, 14, 28, 1, "units: the honest line (two rows)")
k("calloutSize", 34, 28, 48, 1, "units: result pins")
k("wordSize", 28, 28, 40, 1, "units: word pins")
k("luckSize", 28, 28, 40, 1, "units: the luck pins")
# camera
k("camHAz", -28, -90, 90, 1, "degrees: macro hook azimuth")
k("camHEl", 26, 5, 60, 1, "degrees: macro hook elevation")
k("camHDist", 160, 60, 600, 5, "units: macro hook distance")
k("camPEl", 89, 60, 89, 1, "degrees: plan elevation")
k("camPDist", 1400, 800, 2400, 10, "units: plan distance")
k("camSAz", 18, 0, 60, 1, "degrees: side azimuth swept by M1")
k("camSEl", 30, 10, 60, 1, "degrees: side elevation")
k("camSDist", 1300, 800, 2400, 10, "units: side distance")
k("camDAz", -55, -60, 60, 1, "degrees: dark end azimuth")
k("camDEl", 12, 5, 50, 1, "degrees: dark end elevation")
k("camDDist", 380, 100, 600, 5, "units: dark end distance")
k("camLAz", 55, -60, 60, 1, "degrees: full end azimuth")
k("camLEl", 12, 5, 50, 1, "degrees: full end elevation")
k("camLDist", 380, 100, 600, 5, "units: full end distance")
k("camKAz", 8, -40, 40, 1, "degrees: staircase azimuth")
k("camKEl", 20, 5, 50, 1, "degrees: staircase elevation")
k("camKDist", 1150, 700, 2400, 10, "units: staircase distance")
k("camTAz", 0, -40, 40, 1, "degrees: telecom azimuth")
k("camTEl", 26, 5, 60, 1, "degrees: telecom elevation")
k("camTDist", 740, 300, 1400, 10, "units: telecom distance")
k("camBAz", 0, -40, 40, 1, "degrees: board azimuth")
k("camBEl", 34, 5, 70, 1, "degrees: board elevation")
k("camBDist", 1250, 400, 1600, 10, "units: board distance")
k("camCAz", 8, -40, 40, 1, "degrees: horizon crane azimuth")
k("camCEl", 4, 0, 40, 1, "degrees: horizon crane elevation")
k("camCDist", 900, 400, 1600, 10, "units: horizon crane distance")
k("camWEl", 89, 60, 89, 1, "degrees: sheet plan elevation")
k("camWDist", 1100, 600, 2000, 10, "units: sheet plan distance")
k("camMAz", 0, -40, 40, 1, "degrees: Monday azimuth")
k("camMEl", 30, 10, 70, 1, "degrees: Monday elevation")
k("camMDist", 1250, 600, 2400, 10, "units: Monday distance")
# world
k("tileGap", 0.35, 0.2, 0.6, 0.01, "cube edges: gap between tiles")
k("aisle", 0.9, 0.3, 1.5, 0.1, "tile pitches: aisle between steps of the staircase")
k("tankGap", 6.4, 5.0, 9.0, 0.1, "cube pitches: spacing of the six build tanks")
k("tankGap2", 9.5, 7.0, 13.0, 0.1, "cube pitches: spacing of the three kind tanks")
k("boardH", 150, 100, 220, 5, "world: height of 100 points on the board")
k("callH", 12, 6, 24, 1, "world: height of a question cube")
k("askGlow", 2.0, 1, 4, 0.1, "glow of the question cubes")
# look
k("ghostMix", 0.32, 0.2, 0.9, 0.01, "brightness of unlit cubes in the columns")
k("ghostPlan", 0.55, 0.2, 0.9, 0.01, "brightness of unlit cubes in the plan")
k("cutDim", 0.72, 0.3, 0.95, 0.01, "how far the cut dims columns below it")
k("glowHero", 2.2, 1, 4, 0.1, "glow of columns lit in all six")
k("planeAlpha", 0.025, 0.005, 0.2, 0.005, "plane fill")
k("planeOutAt", 89.5, 88.5, 96.0, 0.5, "s: the cut plane fades")
k("lookBloom", 0.1, 0, 0.2, 0.01, "bloom on lit marks only")
k("lookGrain", 0.012, 0.005, 0.02, 0.001, "grain sigma")
k("lookRim", 0.1, 0.02, 0.2, 0.01, "rim light")
k("lookShadow", 0.42, 0.1, 0.7, 0.01, "contact shadow")
# marks
k("markSprW", 12, 8, 16, 0.5, "spring width of marks (z 0.72)")
k("drop", 60, 20, 120, 1, "world: fall of an arriving mark")
k("stagger", 0.25, 0, 0.5, 0.01, "stagger of M1 (entrances only)")
# labels

CAPS = [
 [0.5, 5.0, "The best builder makes the best agent."], [5.5, 11.5, "Does it? Test it on real customer cases."],
 [12.5, 16.5, "Airline, shop and phone-line customer cases."], [17.0, 20.0, "320 cases. One tile each."],
 [20.0, 23.5, "Six agent builds tried every case."], [24.0, 27.0, "1,920 tries. One cube each."],
 [27.5, 31.0, "A lit cube is a try that passed."], [31.5, 34.0, "968 cubes are lit."],
 [34.5, 38.5, "About half of the tries pass: 50.4 %."], [39.5, 44.5, "Now turn the field. Each case becomes a column."],
 [45.0, 49.0, "A column is one case, tried six ways."], [49.5, 54.0, "Six different builds, not six repeats of one."],
 [54.5, 59.5, "Look for columns that are all dark or all lit."], [60.0, 64.5, "Sort the cases by how many builds solved them."],
 [64.5, 68.0, "44 cases: no build solved them."], [68.0, 71.5, "43 cases: every build solved them."],
 [71.5, 75.0, "Now scatter the same wins at random."], [75.0, 79.0, "Luck would leave 8.8 dark and 8.4 full."],
 [81.0, 84.5, "Cut at six of six: 43 of 320 cases."], [84.5, 88.5, "Only 13.4 % of cases are solved by all six."],
 [89.0, 92.5, "Phone lines, regrouped by build."], [92.5, 96.0, "Six builds: from 26.1 % to 52.1 %."],
 [97.5, 101.5, "By kind of problem: 11.6 % to 67.7 %."], [101.5, 105.5, "So the case matters more than the build."],
 [107.5, 111.5, "Now the score: 53 tasks, four businesses."], [112.5, 116.5, "The best builder scores 23.9 out of 100."],
 [117.5, 121.5, "An expert who knows the test scores 82.2."], [122.5, 126.0, "In banking: 5.9 against 79.8."],
 [128.0, 132.0, "Last: what the builders asked the client."], [132.0, 135.5, "15,885 tool calls. One cube each."],
 [137.0, 140.5, "43 were questions to the client."],
]
HONEST = "One sampled build per task, builders mixed: columns are different builds, not repeats; 23.9 is a mean over 53 tasks scored by simulated customers and an LLM judge."

def main():
    claims = json.load(open(os.path.join(TOPIC, "claims.json")))
    mx = json.load(open(os.path.join(TOPIC, "data", "hyper-tau-matrix.json")))["groups"]
    bd = json.load(open(os.path.join(TOPIC, "data", "hyper-tau-builds.json")))["builds"]
    # --- params: claims' params, every claim value by id, then the recorded data
    params = dict(claims["params"])
    for c in claims["claims"]:
        params[c["id"]] = c["value"]
    params["expert"] = 82.2
    params["telLoLit"] = claims["params"]["telLoLit"]
    params["bits"] = ["".join(mx[i]["rows"]) for i in range(3)]
    kinds = {"mms_issue": 0, "mobile_data_issue": 1, "service_issue": 2}
    params["issueTel"] = "".join(str(kinds[f["issue"]]) for f in mx[2]["facets"])
    params["luckK"] = [8.8, 36.0, 68.8, 85.9, 73.9, 38.1, 8.4]
    params["callsPer"] = [b["calls_logged"] for b in bd]
    params["asksPer"] = [b["client_questions"] for b in bd]
    params["dark"] = params["none"]; params["full"] = params["allsix"]
    kd = {}
    for name, v, lo, hi, step, what in K:
        kd[name] = v
    # --- check: every KN.<name> in film.src.js is a knob and every knob is used
    src = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
    used = set(re.findall(r"KN\.([A-Za-z0-9_]+)", src))
    # dynamic names: KN[id + 'T0'], KN[id + 'T1'] for the moves
    for m in ["pull", "m1", "mD", "mF", "mL", "j1", "j3", "mC", "j4", "mM"]:
        used.add(m + "T0")
    miss = sorted(used - set(kd)); unused = sorted(set(kd) - used)
    if miss: sys.exit("knobs used but missing: " + ", ".join(miss))
    if unused: print("note: knobs not used by the film:", ", ".join(unused), file=sys.stderr)
    doc = []
    for name, v, lo, hi, step, what in K:
        assert lo <= v <= hi, name
        doc.append({"name": name, "range": [lo, hi], "what": what})
    film = {
        "id": "build-the-agent", "title": "The Builder", "eyebrow": "CETI · a data film · the best builder does not make the best agent",
        "lede": "320 customer cases, six agent builds each: 1,920 tries, 968 lit. Sorted by how many builds solved each case, the columns climb a staircase with 44 dark columns at one end and 43 full ones at the other, five times what luck leaves. The case decides more than the build; and an expert scores 82.2 where the best builder scores 23.9.",
        "format": "feature-long", "level": "manager", "renderer": "webgl", "dur": 153, "seed": 20261011,
        "look": {"brand": "ceti-neosage-dark", "chrome": "none", "material": "hero"},
        "commit": {"enabled": False}, "count": {"at": 12.5}, "type": {"disp": "Newsreader"},
        "chapters": [
            {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "HOOK", "title": "The best builder"},
            {"id": "case", "beat": "CASE", "t0": 12, "t1": 60, "eyebrow": "CASE", "title": "The field of cases"},
            {"id": "count", "beat": "COUNT", "t0": 60, "t1": 135, "eyebrow": "COUNT", "title": "The staircase"},
            {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "MONDAY", "title": "Ask the client"}],
        "captions": CAPS,
        "brand": {"takeaway": "Ask the client. Test on the hard cases."},
        "sources": [[sid, s["url"] + " · " + s["what"]] for sid, s in claims["sources"].items()],
        "honest": [HONEST], "beat": 0.5, "cuts": [],
        "libs": ["arsenal/patterns/text-reveal/pattern.js", "factory/kit2/text-reveal.js"],
        "params": params, "knobs": kd, "knobs_doc": doc,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(film, f, ensure_ascii=False, separators=(",", ":"))
    print("film.json %d bytes, %d knobs" % (os.path.getsize(OUT), len(K)))

if __name__ == "__main__":
    main()
