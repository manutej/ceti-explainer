#!/usr/bin/env python3
"""lib/mkdata.py (noether-applied draft B, "the ledger of error") · reads factory/topics/noether-applied/data/*.csv and part 1's lib/data.js and writes lib/data.js
(compact strings the film decodes in setup). No randomness.
  s1k, s1p : 1,000 snapshots per stepper (keeper = velocity Verlet, plain = RK4), 3 base-64 chars each: 9 bits of the planet's angle, 9 bits of log10 |energy error|
             (range -10..3). The radial place of a dot is its snapshot index (log-spaced steps), so the steps are not stored. ub = first snapshot at which the plain planet is unbound.
  hq       : the toy spring pair, 200 + 200 snapshots, q and p at 12 bits each (E = (q^2 + p^2) / 2, the E_true column to 1e-9).
  kel      : the point-vortex loop, 1,000 of the 2,000 tagged parcels (every 2nd), 16 of the 30 frames (every 2nd and the last), positions at 0.01,
             second differences along the loop, one char for both axes when each is in -2..2 (else '-' + two vlq).
  net, netc: part 1's network states (100 runs x 100 steps) and the runs' fixed triples, copied verbatim.
"""
import csv, json, math, os, re
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
TOP = os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "noether-applied", "data")
P1 = os.path.join(HERE, "..", "..", "..", "..", "..", "films", "noether-symmetry", "lib", "data.js")
AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"
def b64(q, n): return "".join(AB[(q >> (6 * (n - 1 - i))) & 63] for i in range(n))
def vlq(n):
    z = (n << 1) ^ (n >> 63) if n < 0 else n << 1
    out = ""
    while True:
        d = z & 31; z >>= 5
        if z: out += AB[32 + d]
        else: out += AB[d]; return out

def s1():
    res = {}
    for key, nm in (("s1k", "verlet"), ("s1p", "rk4")):
        rows = list(csv.DictReader(open(os.path.join(TOP, "trace_%s.csv" % nm))))
        s = ""; ub = None
        for k, r in enumerate(rows):
            x, y, de = float(r["x"]), float(r["y"]), float(r["dE_rel"])
            th = math.atan2(y, x) % (2 * math.pi)
            lg = math.log10(max(abs(de), 1e-10))
            tq = int(round(th / (2 * math.pi) * 512)) % 512
            lq = int(round((min(max(lg, -10), 3) + 10) / 13 * 511))
            s += b64((tq << 9) | lq, 3)
            if nm == "rk4" and de < 0 and ub is None: ub = k
        res[key] = s
        if ub is not None: res["ub"] = ub
        print(nm, len(rows), "chars", len(s))
    # the plain stepper stays unbound after ub?
    rows = list(csv.DictReader(open(os.path.join(TOP, "trace_rk4.csv"))))
    assert all(float(r["dE_rel"]) < 0 for r in rows[res["ub"]:]), "unbound set not contiguous"
    print("ub", res["ub"], "of", len(rows))
    return res

def hq():
    rows = list(csv.DictReader(open(os.path.join(TOP, "ml_traces.csv"))))
    s = ""
    for m in ("plain", "hamiltonian"):
        for r in [r for r in rows if r["model"] == m]:
            for v in (float(r["q"]), float(r["p"])):
                assert abs(v) < 1
                s += b64(int(round((v + 1) / 2 * 4095)), 2)
    print("hq chars", len(s)); return s

def kel():
    a = np.array(list(csv.reader(open(os.path.join(TOP, "kelvin_loop.csv")))) [1:], dtype=float)
    X = a[:, 2].reshape(30, 2000)[:, ::2]; Y = a[:, 3].reshape(30, 2000)[:, ::2]
    frames = list(range(0, 30, 2)) + [29]; q = 0.01; s = ""; esc = 0; worst = 0
    for f in frames:
        x = np.round(X[f] / q).astype(int); y = np.round(Y[f] / q).astype(int)
        worst = max(worst, float(np.abs(x * q - X[f]).max()), float(np.abs(y * q - Y[f]).max()))
        s += vlq(int(x[0])) + vlq(int(y[0])) + vlq(int(x[1] - x[0])) + vlq(int(y[1] - y[0]))
        dx, dy = x[1] - x[0], y[1] - y[0]
        for i in range(2, len(x)):
            ddx, ddy = (x[i] - x[i - 1]) - dx, (y[i] - y[i - 1]) - dy
            if abs(ddx) <= 2 and abs(ddy) <= 2: s += AB[(ddx + 2) * 5 + (ddy + 2)]
            else: s += "-" + vlq(int(ddx)) + vlq(int(ddy)); esc += 1
            dx, dy = x[i] - x[i - 1], y[i] - y[i - 1]
    print("kel chars", len(s), "escapes", esc, "worst quant err", worst, "frames", len(frames))
    return s

def main():
    p1 = open(P1).read()
    net = re.search(r'net:"([^"]*)"', p1).group(1); netc = re.search(r'netc:"([^"]*)"', p1).group(1)
    d = s1(); d["hq"] = hq(); d["kel"] = kel(); d["net"] = net; d["netc"] = netc
    js = "window.NA_DATA=%s;\n" % json.dumps(d, separators=(",", ":"))
    open(os.path.join(HERE, "data.js"), "w").write(js)
    print("data.js", len(js), "bytes")
main()
