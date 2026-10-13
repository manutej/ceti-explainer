#!/usr/bin/env python3
"""lib/prep.py (how-a-network-learns draft A) · packs the frozen topic data into lib/data.js (const D = {...}).
Reads factory/topics/how-a-network-learns/data/{train_log,surface,network}.json; never re-runs training.
Deterministic: same inputs, same bytes. Encodings (decoded once in film.src.js setup):
  cloud  150 x [petal_length, petal_width, sepal_length] in mm (cm x 10, integers)
  y      150-char species string (0 setosa, 1 versicolor, 2 virginica)
  f0     150-char flag string at step 0 ('1' = right); tg = [[flower, step, step...], ...] the steps where a flag flips
  pk     path steps kept (0..50 every step, then every 10) ; pa, pb = grid col/row of the path (2 dp); pl = real loss (4 dp)
  sf     the 120 x 80 slice, row-major (rows = W1[2,2], cols = W2[2,2]), uint8 of value / 1.4, base64
  nw     per checkpoint: w1 4x8 |W1|, w2 8x3 |W2| (2 dp), r = 150 x 'i j p' digits
"""
import base64, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
TOP = os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "how-a-network-learns", "data")
L = json.load(open(os.path.join(TOP, "train_log.json")))
S = json.load(open(os.path.join(TOP, "surface.json")))
N = json.load(open(os.path.join(TOP, "network.json")))

fl = [s["flags"] for s in L["steps"]]
tg = []
for i in range(150):
    t = [k for k in range(1, len(fl)) if fl[k][i] != fl[k - 1][i]]
    if t: tg.append([i] + t)
keep = list(range(0, 51)) + list(range(60, 1001, 10))
aa, bb = S["axis_a"], S["axis_b"]
da, db = aa[1] - aa[0], bb[1] - bb[0]
P = S["path"]
VMAX = 1.4
q = bytes(max(0, min(255, round(v / VMAX * 255))) for row in S["values"] for v in row)
nw = {}
for k, c in N["checkpoints"].items():
    nw[k] = {
        "w1": [round(x, 2) for r in c["absW1"] for x in r], "w2": [round(x, 2) for r in c["absW2"] for x in r],
        "r": "".join("%d%d%d" % tuple(r) for r in c["routes"]),
    }
D = {
    "cloud": [[round(v * 10) for v in row] for row in L["cloud"]],
    "y": "".join(str(v) for v in L["y"]),
    "f0": fl[0], "tg": tg,
    "pa": [round((P["a"][k] - aa[0]) / da, 2) for k in keep], "pb": [round((P["b"][k] - bb[0]) / db, 2) for k in keep],
    "pl": [round(P["loss_true"][k], 4) for k in keep],
    "cols": S["cols"], "rows": S["rows"], "vmax": VMAX, "sf": base64.b64encode(q).decode(),
    "nw": nw,
}
out = "const D = " + json.dumps(D, separators=(",", ":"), sort_keys=True) + ";\n"
open(os.path.join(HERE, "data.js"), "w").write(out)
print("lib/data.js %d bytes" % len(out))
