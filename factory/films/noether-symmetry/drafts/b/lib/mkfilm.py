#!/usr/bin/env python3
"""lib/mkfilm.py (noether-symmetry draft B) · writes ../film.json. Knobs are read from the KB table in lib/film.src.js (one source of
truth); params = claims.json params + the display values the film prints (each equals its claim value). Run after editing KB."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "..")
claims = json.load(open(os.path.join(ROOT, "claims.json")))
params = dict(claims["params"])
params.update({"noetherYear": 1918, "rvPeri": 4455.5, "rvAph": 4455.0, "rvDiffPct": 0.011, "netStates": 3000, "netRatio": 250, "cutMarks": 620,
               "wMoveShown": 0.24, "cMoveShown": 0.00095})
src = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
kb = src[src.index("const KB = ["):src.index("];\nconst Z = {}")]
knobs, doc = {}, []
for line in kb.split("\n"):
    m = re.match(r"^\['(\w+)', (-?[\d.]+), (-?[\d.]+), (-?[\d.]+), (-?[\d.]+), '(.*)'\],$", line)
    if not m: continue
    n, d, lo, hi, st, what = m.groups()
    num = lambda x: json.loads(x)
    knobs[n] = num(d); doc.append({"name": n, "range": [num(lo), num(hi)], "step": num(st), "what": what})
assert len(knobs) == kb.count("\n['") + (1 if kb.startswith("['") else 0), "a KB line did not parse"
CAP = [
 (0.8, 5.8, "Everything moves. A few things never change."),
 (6.2, 11.6, "A rule handed down? Or something that follows?"),
 (12.4, 19.8, "In 1918, Emmy Noether found where such rules come from."),
 (20.0, 25.8, "Each dot is one moment of one orbit."),
 (26.0, 28.4, "3,000 dots: ten moments of each of 300 orbits."),
 (28.6, 30.8, "Simulated orbits: tangled, no pattern."),
 (31.2, 33.8, "Now one real orbit: Earth around the Sun."),
 (34.0, 36.4, "Closest to the Sun: 147.095 million km."),
 (36.6, 38.9, "Speed there: 30.29 km/s."),
 (39.1, 41.4, "Farthest: 152.100 million km."),
 (41.6, 43.9, "Speed there: 29.29 km/s."),
 (44.1, 47.3, "Multiply distance by speed."),
 (47.5, 49.9, "Closest: 4,455.5."),
 (51.1, 53.3, "Farthest: 4,455.0."),
 (53.5, 55.9, "Only 0.011 % apart."),
 (56.3, 59.8, "Why does it stay? Back to the 3,000 dots."),
 (60.4, 67.6, "New axes: each orbit's spin, not its place."),
 (68.2, 70.4, "Same 3,000 dots."),
 (70.6, 72.9, "300 orbits, 300 specks."),
 (73.2, 75.4, "The specks sit on 6 shells."),
 (75.6, 78.4, "Inside one orbit: under 1 in a trillion of change."),
 (78.8, 83.4, "A slice through the shells. Each cut shows rings."),
 (85.0, 87.4, "62 orbits lit: ten dots on each of them."),
 (88.2, 95.8, "New axes again: energy up, size of spin outward."),
 (97.5, 99.9, "Energy sorts them into 5 layers."),
 (100.2, 101.9, "Turning gives shells. Waiting gives layers."),
 (102.2, 104.0, "Now no planets: a tiny network learning."),
 (104.2, 108.4, "Each dot is one step of training."),
 (108.6, 110.9, "3,000 steps from 100 runs."),
 (111.0, 113.9, "Known since 2018: some sums stay fixed."),
 (114.0, 118.9, "New axes: the sum that should not change."),
 (121.0, 123.4, "The same picture: 3 shells."),
 (123.6, 125.9, "The weights travel 0.24."),
 (126.1, 128.4, "The fixed sum moves 0.00095."),
 (128.6, 131.4, "About 250 times less."),
 (131.6, 134.8, "Smoke rings too: swap the air, the swirl stays."),
 (135.3, 140.8, "Monday: ask it of your own data."),
]
srcs = [[k, v.split(" : ")[0] if False else v] for k, v in claims["sources"].items()]
film = {
 "id": "noether-symmetry", "title": "Noether's symmetry",
 "eyebrow": "CETI · every symmetry hides something that stays",
 "lede": "3,000 orbit states sit in a measured glass cube as a tangle; the cube's axes re-label and the same dots slide onto shells; one real orbit, Earth, shows distance times speed equal at both ends; a tiny network repeats the move in a second glass box.",
 "format": "feature-long", "level": "manager", "renderer": "webgl",
 "look": {"brand": "ceti-coastal-dark", "chrome": "none", "material": "ink"},
 "dur": 153, "seed": 20261010, "params": params, "commit": {"enabled": False}, "count": {"at": 26.0},
 "chapters": [
  {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "HOOK", "title": "A rule handed down?"},
  {"id": "case", "beat": "CASE", "t0": 12, "t1": 60, "eyebrow": "CASE", "title": "The glass box"},
  {"id": "count", "beat": "COUNT", "t0": 60, "t1": 135, "eyebrow": "COUNT", "title": "New axes, same dots"},
  {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "MONDAY", "title": "What stays fixed"}],
 "captions": [[a, b, c] for a, b, c in CAP],
 "brand": {"takeaway": "Every symmetry hides something that stays.", "at": 150},
 "sources": srcs,
 "honest": "Simulated orbits, a toy network, ideal laws: real systems drift a little.",
 "knobs": knobs, "knobs_doc": doc, "libs": ["lib/data.js", "lib/arsenal.gen.js"],
}
open(os.path.join(ROOT, "film.json"), "w", encoding="utf-8").write(json.dumps(film, separators=(",", ":"), ensure_ascii=False) + "\n")
print("film.json: %d knobs, %d captions" % (len(knobs), len(CAP)))
