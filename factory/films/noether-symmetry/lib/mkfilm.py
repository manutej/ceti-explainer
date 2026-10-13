#!/usr/bin/env python3
"""lib/mkfilm.py · writes ../film.json and ../claims.json (noether-symmetry draft A, "the observatory"), and lib/cam.base.json.
The camera knobs come from the rig itself (node lib/camknobs.mjs = gl-camera-rig toKnobs over lib/cam.base.json); every other knob is listed
in KNOBS below with its range and what it does. Captions are the beat sheet's (factory/topics/noether-symmetry/beats.md), reworded where the
lay audience needs it, digits only as claim renders. claims.json is copied byte for byte. Deterministic."""
import json, os, subprocess, math, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, ".."))
TOP = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "noether-symmetry"))
claims = json.load(open(os.path.join(TOP, "claims.json")))

# ---------------------------------------------------------------- the camera script (world: orbit cloud at the origin, Earth's fixture at x = -900, the network at x = +700)
def sph(az, el, r):
    az, el = math.radians(az), math.radians(el)
    return [r * math.cos(el) * math.sin(az), -r * math.sin(el), r * math.cos(el) * math.cos(az)]
def pose(c, r, az, el):
    d = sph(az, el, r); return [round(c[i] + d[i]) for i in range(3)], list(c)
C0 = [0, 40, 0]; D0 = 1000
e0, c0 = pose(C0, D0, -28, 24)
eE, cE = pose([-900, -14, 0], 520, -12, 30)
eB, cB = pose(C0, D0, -28 + 22, 27)
eN, cN = pose([700, 40, 0], 860, -30, 26)
eW, cW = pose([350, 20, 0], 1450, -8, 14)
CAM = {"proj": "persp", "dur": 153, "near": 10, "far": 9000, "start": {"eye": e0, "center": c0, "fov": 30},
 "moves": [
  {"id": "orb", "move": "orbit", "t0": 12.0, "t1": 31.0, "az": 22, "el": 27, "r": 1.0, "ease": "inout"},
  {"id": "earth", "move": "key", "t0": 31.0, "t1": 34.0, "eye": eE, "center": cE, "ease": "inout"},
  {"id": "back", "move": "cut", "t0": 56.5, "eye": eB, "center": cB},
  {"id": "m1", "move": "orbit", "t0": 60.0, "t1": 68.0, "az": 70, "el": 20, "r": 1.0, "ease": "inout"},
  {"id": "m3", "move": "orbit", "t0": 78.5, "t1": 83.5, "az": 8, "el": 13, "r": 1.0, "ease": "inout"},
  {"id": "m2", "move": "orbit", "t0": 88.0, "t1": 96.0, "az": 55, "el": 0.5, "r": 0.8, "around": [0, 0, 0], "ease": "inout"},
  {"id": "netcut", "move": "cut", "t0": 102.0, "eye": eN, "center": cN},
  {"id": "drift1", "move": "orbit", "t0": 103.5, "t1": 111.5, "az": 8, "el": 27, "r": 1.0, "ease": "inout"},
  {"id": "m4", "move": "orbit", "t0": 112.0, "t1": 119.0, "az": 60, "el": 20, "r": 1.0, "ease": "inout"},
  {"id": "drift2", "move": "orbit", "t0": 121.0, "t1": 131.0, "az": 8, "el": 20, "r": 1.0, "ease": "inout"},
  {"id": "wide", "move": "cut", "t0": 135.0, "eye": eW, "center": cW}]}
json.dump(CAM, open(os.path.join(HERE, "cam.base.json"), "w"), separators=(",", ":"))

# ---------------------------------------------------------------- knobs: (name, value, lo, hi, step, what)
def T(name, v, lo, hi, what): return (name, v, lo, hi, 0.1, "s: " + what)
KNOBS = [
 # scale and look
 ("sP", 24, 10, 40, 1, "world units per orbit unit: size of the position-space tangle"),
 ("sL", 140, 80, 200, 5, "world units per unit of spin length: the radius of the six shells"),
 ("sW", 58, 30, 90, 2, "world units per unit of the weight-space picture (the network, before the move)"),
 ("sC", 140, 80, 200, 5, "world units per unit of the network's fixed sums: the radius of its three shells"),
 ("layerGap", 38, 20, 60, 2, "world units between the five energy layers"),
 ("dotR", 2.6, 1, 5, 0.1, "dot radius of the orbit cloud, world units (bigger reads closer)"),
 ("dotRNet", 2.6, 1, 5, 0.1, "dot radius of the training cloud, world units"),
 ("speckGrow", 0.4, 0, 1, 0.05, "how much larger the dots grow once they sit on their specks (ten dots share one speck)"),
 ("hiGrow", 0.6, 0, 1.5, 0.1, "how much a lit dot (featured orbit, cut set) swells beyond its size"),
 ("sizeCue", 0.5, 0, 1, 0.05, "depth cue: nearer dots are larger (0 = none)"),
 ("fog", 0.25, 0, 0.3, 0.05, "fog toward the sky for the far side of a cloud (manager level cap 0.3)"),
 ("featDim", 0.62, 0, 0.9, 0.02, "how far the rest of the cloud sinks while the followed orbit or run is lit"),
 ("stag", 0.18, 0, 0.25, 0.01, "delay between orbits as the dots travel (0 = all at once; cap 0.25)"),
 ("dimEarth", 0.9, 0.5, 0.98, 0.02, "how far the orbit cloud sinks into the sky while Earth's fixture is on stage"),
 ("dimGhost", 0.82, 0.5, 0.95, 0.02, "how far the orbit cloud sinks while the network is on stage"),
 ("starN", 420, 0, 900, 20, "number of faint stars in the sky"),
 ("starR", 7, 3, 14, 0.5, "star radius, world units (they sit 3,000 away)"),
 ("starDim", 0.45, 0, 0.9, 0.05, "star brightness: 0 = full muted, higher sinks them into the sky"),
 ("wireR", 1.1, 0.5, 2.5, 0.1, "radius of the dotted guide rings and ellipses"),
 ("wireDim", 0.45, 0.2, 0.9, 0.05, "how faint the dotted guides are (higher = fainter)"),
 ("plate", 0.8, 0.4, 1, 0.05, "opacity of the ground plate behind pins and set type"),
 ("swayDeg", 2, 0, 4, 0.25, "degrees: calm sway of the camera about its aim point (0 = still between moves)"),
 ("swayPeriod", 44, 20, 90, 2, "s: period of the sway"),
 # labels
 ("hold", 4, 0, 15, 1, "frames a pin must be pushed before it hides (gl-labels)"),
 ("leader", 22, 12, 40, 2, "length of a pin's leader, sheet units"),
 ("pinHold", 2.5, 2.5, 4, 0.1, "s: how long a new number stays still (floor 2.5)"),
 ("pinFade", 0.2, 0.1, 0.5, 0.05, "s: fade of a pin in and out"),
 ("dispAdv", 0.5, 0.4, 0.6, 0.02, "width of one display-face character in ems, for placing pins"),
 ("honestSize", 26, 22, 32, 1, "size of the honest line on stage, sheet units"),
 # data choices
 ("featOrbit", 248, 0, 299, 1, "which of the 300 orbits is followed (its ten dots, its ellipse, its spin arrow)"),
 ("featRun", 4, 0, 99, 1, "which of the 100 training runs is followed"),
 ("cutBandPct", 20, 10, 30, 1, "percent: the cut keeps orbits whose spin points within this share of the equator plane (changes the lit count)"),
 ("cutTop", 230, 150, 320, 10, "world units: height the cut plane starts from"),
 # Earth
 ("earthTheta", 35, 0, 360, 5, "degrees: where on the page the closest point sits"),
 ("arrowK", 2.0, 1, 3, 0.1, "world units of arrow per km/s (both arrows share it, so their lengths stay in true proportion)"),
 ("earthDot", 4.5, 3, 9, 0.5, "radius of Earth's two dots and the Sun, world units"),
 ("fbY0", 96, 80, 110, 2, "sheet y of the first formula line"),
 ("fbY1", 150, 130, 170, 2, "sheet y of the second formula line"),
 ("fbSize", 60, 56, 80, 2, "size of the formula type, sheet units"),
 ("fbBind", 0.5, 0.3, 1, 0.05, "s after a run starts: the terms take their colours"),
 ("fbFly", 1.0, 0.8, 1.6, 0.05, "s after a run starts: the first word flies to its mark"),
 ("fbFlyS", 0.5, 0.3, 0.9, 0.05, "s: length of a word's flight"),
 ("fbComp", 2.1, 1.8, 2.8, 0.05, "s after a run starts: the first number flies back into the formula"),
 ("fbCompS", 0.5, 0.3, 0.9, 0.05, "s: length of a number's flight"),
 ("fbGap", 0.5, 0.3, 0.8, 0.05, "s between the first and the second flight (words and numbers never cross)"),
 ("fbRes", 3.1, 2.6, 3.6, 0.05, "s after a run starts: the product starts to count up"),
 ("fbResS", 0.5, 0.3, 1, 0.05, "s: length of the count-up"),
 ("fbLift", 28, 0, 60, 2, "sheet units: arc of a flying term (0 = straight)"),
 # smoke ring
 ("ringR", 120, 70, 170, 5, "world units: radius of the smoke ring"),
 ("ringTube", 38, 20, 60, 2, "world units: radius of the ring's tube"),
 ("ringW", 1.1, 0.3, 2.5, 0.1, "radians per second the air circles round the tube"),
 ("ringV", 9, 0, 20, 1, "world units per second the ring travels"),
 # timeline
 T("tReveal0", 14.0, 13.5, 16, "the first orbit's dots count in"),
 T("tReveal1", 26.0, 23, 26, "the 3,000th dot is in (the count lands; keep <= 26.0)"),
 T("tFeat0", 20.5, 18, 22, "the followed orbit's ten dots start to light, one by one"),
 T("tFeat1", 25.2, 23, 25.8, "the tenth dot is lit"),
 T("tPFeat", 22.5, 21, 25, "the pin 'ONE ORBIT' appears"),
 T("tPCount", 26.0, 26, 27, "the first count lands: '3,000 moments, 300 orbits' (never before 26.0)"),
 T("tPRp", 34.0, 33, 36, "the closest distance lands (hold 2.5)"),
 T("tPVp", 36.5, 35, 38.5, "the speed there lands"),
 T("tPRa", 39.0, 38, 41, "the farthest distance lands"),
 T("tPVa", 41.5, 40, 43.5, "the speed there lands"),
 T("tRun1", 44.0, 43.5, 46, "the formula runs for the closest point (set, bind, fly, compute)"),
 T("tRun2", 49.0, 47.5, 51, "the formula runs again for the farthest point"),
 T("tCall", 53.5, 53.5, 55, "'only 0.011 % apart' lands (a ratio, after both products)"),
 T("tSpin", 58.5, 57.6, 59.5, "the spin arrow of the followed orbit and its pin appear"),
 T("tPSame", 68.2, 68, 69.5, "pin 'the same dots' lands"),
 T("tPSpecks", 70.5, 69.5, 72, "pin '300 specks' lands"),
 T("tPShells", 73.0, 72, 75, "pin '6 shells' lands"),
 T("tPTrill", 75.5, 74.5, 77, "the callout 'under 1 in a trillion' lands"),
 T("tPCut", 85.0, 84, 86, "the lit count lands: '62 orbits lit'"),
 T("tPLay", 97.5, 96.5, 99, "pin '5 layers' lands"),
 T("tTable", 100.0, 99.5, 101, "the table (turn: spin, shells; day: energy, layers) appears"),
 T("tNet0", 103.5, 102.5, 104.5, "the first training step counts in"),
 T("tNet1", 108.5, 106, 108.5, "the 3,000th training dot is in"),
 T("tFRun0", 104.6, 103.6, 106, "the followed run's thirty dots start to light, one by one"),
 T("tPFRun", 105.0, 104, 106.5, "the pin 'ONE RUN' appears"),
 T("tPNet", 108.5, 108.5, 109.5, "the second count lands: '3,000 steps, 100 runs'"),
 T("tPlateNet", 111.0, 110.5, 112, "the plate with the sum that should not change appears"),
 T("tPN3", 121.0, 120, 122.5, "pin '3 shells' lands"),
 T("tPW", 123.5, 122.5, 125, "pin 'the weights travelled' lands"),
 T("tPC", 126.0, 125, 127.5, "pin 'the fixed sum moved' lands"),
 T("tPRatio", 128.5, 128, 129.5, "the callout 'about 250 times less' lands"),
 T("tRing0", 131.5, 131, 132.5, "the wordless smoke-ring plate starts"),
 T("tSwap", 133.3, 132.2, 134.5, "the two airs swap colours (the swirl stays)"),
 T("tQ", 136.2, 135.5, 138, "the question for Monday appears"),
 T("tHonest", 141.6, 141.5, 143, "the honest line appears on stage"),
]
CAPS = [
 (0.8, 5.8, "Everything moves. A few things never change."),
 (6.2, 11.6, "A rule handed down, or something that follows?"),
 (12.4, 19.8, "In 1918, Emmy Noether found where such rules come from."),
 (20.0, 25.8, "Each dot is one moment of one orbit."),
 (26.0, 28.4, "3,000 dots: ten moments of each of 300 orbits."),
 (28.6, 30.8, "Simulated orbits: tangled, no pattern."),
 (31.2, 33.8, "Now one real orbit: Earth around the Sun."),
 (34.0, 36.4, "Closest to the Sun: 147.095 million km."),
 (36.6, 38.9, "Speed there: 30.29 km/s."),
 (39.1, 41.4, "Farthest: 152.100 million km."),
 (41.6, 43.9, "Speed there: 29.29 km/s."),
 (44.1, 47.2, "Multiply distance by speed."),
 (47.5, 48.9, "Closest: 4,455.5."),
 (49.1, 50.4, "Now the same at the farthest point."),
 (50.6, 52.9, "Farthest: 4,455.0."),
 (53.6, 56.4, "Only 0.011 % apart."),
 (56.8, 59.8, "Why? Each orbit has a spin: how much it swirls."),
 (60.4, 67.6, "Re-plot each orbit by its spin, not its place."),
 (68.2, 70.4, "Same 3,000 dots."),
 (70.6, 72.9, "300 orbits, 300 specks."),
 (73.2, 75.4, "The specks sit on 6 shells."),
 (75.6, 78.4, "Spin and energy: under 1 in a trillion apart."),
 (78.8, 83.4, "Slice through the shells. Each cut shows rings."),
 (85.0, 87.4, "The cut keeps the orbits near the equator lit."),
 (88.2, 95.8, "Regroup the same dots by energy."),
 (97.6, 99.9, "Energy sorts them into 5 layers."),
 (100.2, 101.9, "Rotation gives shells. Time gives layers."),
 (102.2, 104.0, "Now no planets: a tiny network learning."),
 (104.2, 108.4, "Each dot is one step of training."),
 (108.6, 110.9, "3,000 steps from 100 runs."),
 (111.1, 113.8, "Known since 2018: some sums stay fixed."),
 (114.0, 118.8, "Re-plot each run by the sum that should not change."),
 (121.0, 123.4, "The same picture: 3 shells."),
 (123.6, 125.9, "The weights travel 0.24."),
 (126.1, 128.4, "The fixed sum moves 0.00095."),
 (128.6, 131.4, "About 250 times less."),
 (131.6, 134.8, "Smoke rings too: swap the air, the swirl stays."),
 (135.3, 140.8, "Monday: what stays fixed in your data while it moves?"),
]
HONEST = "Simulated orbits, a toy network, ideal laws: real systems drift a little."
CH = [("hook", "HOOK", 0, 12, "NOETHER · HOOK", "Handed down, or following?"), ("case", "CASE", 12, 60, "NOETHER · CASE", "Two cases: made-up orbits, and Earth"),
      ("count", "COUNT", 60, 135, "NOETHER · COUNT", "Re-plot by what stays"), ("monday", "MONDAY", 135, 150, "NOETHER · MONDAY", "What stays fixed in your data?")]

def main():
    cam = json.loads(subprocess.check_output(["node", os.path.join(HERE, "camknobs.mjs")]))
    knobs, doc = {}, []
    for n, v, lo, hi, st, what in KNOBS:
        assert lo <= v <= hi, (n, v, lo, hi)
        knobs[n] = v; doc.append({"name": n, "range": [lo, hi], "step": st, "what": what})
    for d in cam["knobs_doc"]:
        if d["name"].endswith("Ease"): continue
        d = dict(d); d["what"] = d["what"].replace("camera rig · ", "cam ").replace(" (orbit)", "").replace(" (cut)", "").replace(" (key)", "").replace("degrees swept round the centre", "degrees swept round the aim point").replace("start (s)", "s: start").replace("end (s)", "s: end")
        knobs[d["name"]] = cam["knobs"][d["name"]]; doc.append(d)
    params = dict(claims["params"]); params.update({"states": 3000, "orbits": 300, "netStates": 3000, "rvPeri": 4455.5, "rvAph": 4455.0})
    src = [[k, v[:170].rstrip() + ("…" if len(v) > 170 else "")] for k, v in claims["sources"].items()]
    src.append(["derived", "computed in this film from the cited numbers (factory/topics/noether-symmetry/recompute.py)"])
    film = {"id": "noether-symmetry", "title": "Noether's symmetry", "eyebrow": "CETI · AI-STORIES · draft A, the observatory",
        "lede": "Every continuous symmetry hides a quantity that does not change. Earth's two measured moments, 3,000 simulated orbit states and 3,000 training states of a tiny network, re-plotted by what stays: the tangles collapse onto thin shells.",
        "format": "feature-long", "renderer": "webgl", "level": "manager", "dur": 153, "seed": 20261010,
        "look": {"brand": "ceti-coastal-dark", "chrome": "none", "material": "ink"}, "params": params, "commit": {"enabled": False}, "count": {"at": 26.0},
        "chapters": [{"id": i, "beat": b, "t0": a, "t1": z, "eyebrow": e, "title": t} for i, b, a, z, e, t in CH],
        "captions": [[a, b, t] for a, b, t in CAPS], "brand": {"takeaway": "Every symmetry hides something that stays."},
        "sources": src, "honest": [HONEST], "knobs": knobs, "knobs_doc": doc}
    json.dump(film, open(os.path.join(OUT, "film.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    shutil.copyfile(os.path.join(TOP, "claims.json"), os.path.join(OUT, "claims.json"))
    print("film.json", os.path.getsize(os.path.join(OUT, "film.json")), "bytes;", len(knobs), "knobs (", len(cam["knobs"]), "camera )")
main()
