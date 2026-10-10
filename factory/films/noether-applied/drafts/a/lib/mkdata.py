#!/usr/bin/env python3
"""lib/mkdata.py (noether-applied draft A, "two planets") -> lib/data.js = window.NA_DATA.
Reads the topic's cached runs (factory/topics/noether-applied/data/*.csv) and part 1's network strings (../noether-symmetry/lib/data.js),
quantises, and writes fixed-length base-64 strings (no digits are stored as text on screen; every value is a drawing coordinate).
  k, p : the 1,000 snapshots of the energy-keeping and the plain stepper: angle (2 chars, 12 bit turn), log10 r (3 chars, 18 bit over -0.5..9.5),
         log10 |dE/E| (2 chars, 12 bit over -12..4)
  h    : the toy pair, 200 snapshots each, (q, p) 3 chars each over -1..1 (plain first, then the energy-keeping one)
  net, netc : part 1's 100 runs x 100 steps (weights, fixed sum), copied unchanged."""
import csv, math, os, re, json
HERE = os.path.dirname(os.path.abspath(__file__))
TOP = os.path.join(HERE, "..", "..", "..", "..", "..", "topics", "noether-applied", "data")
P1 = os.path.join(HERE, "..", "..", "..", "..", "noether-symmetry", "lib", "data.js")
AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"
def enc(v, n):
    v = max(0, min(64 ** n - 1, int(round(v))))
    return "".join(AB[(v >> (6 * (n - 1 - i))) & 63] for i in range(n))
def snaps(name):
    out = []
    for r in csv.DictReader(open(os.path.join(TOP, "trace_%s.csv" % name))):
        x, y, dE = float(r["x"]), float(r["y"]), float(r["dE_rel"])
        a = (math.atan2(y, x) / (2 * math.pi)) % 1.0
        lr = math.log10(math.hypot(x, y))
        le = math.log10(max(abs(dE), 1e-12))
        out.append(enc(a * 4096, 2) + enc((lr + 0.5) / 10 * 262143, 3) + enc((le + 12) / 16 * 4095, 2))
    return "".join(out)
def hnn():
    rows = list(csv.DictReader(open(os.path.join(TOP, "ml_traces.csv"))))
    s = ""
    for m in ("plain", "hamiltonian"):
        for r in rows:
            if r["model"] == m:
                s += enc((float(r["q"]) + 1) / 2 * 262143, 3) + enc((float(r["p"]) + 1) / 2 * 262143, 3)
    return s
p1 = open(P1, encoding="utf-8").read()
net = re.search(r'net:"([^"]*)"', p1).group(1); netc = re.search(r'netc:"([^"]*)"', p1).group(1)
out = 'window.NA_DATA={k:"%s",p:"%s",h:"%s",net:"%s",netc:"%s"};\n' % (snaps("verlet"), snaps("rk4"), hnn(), net, netc)
open(os.path.join(HERE, "data.js"), "w").write(out)
print("data.js %d bytes" % len(out))
