#!/usr/bin/env python3
"""lib/mkdata.py (noether-frontier draft A, "the observatory, continued") -> lib/data.js. No randomness.
Reads factory/topics/noether-symmetry/data/orbit_table.json (Part 1's 300 orbits: spin direction u (3), in-plane angle omega, phase u0, 12 bits
each = 2 base-64 chars, 3.0 KB; the film rebuilds the 30,000 states with the Kepler solution) and factory/topics/noether-frontier/data/
{neurons,question_tree,toy}.json.
neurons: 480 units x 4 series (smallA, smallB, bigA, bigB) x 50 moments, quantised to Q = 0.01, first value + first difference + second
differences as zigzag varints, then raw DEFLATE (zlib wbits -15), base 64; the film inflates it in setup with DecompressionStream.
tree: level, parent index, x*100 per node (titles are never drawn). toy: the six orders (digits of 4/7/9 by index) and the toy model's six
answers x10 (colours only)."""
import json, os, math, zlib, base64
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "..", ".."))
P1 = os.path.join(ROOT, "factory", "topics", "noether-symmetry", "data", "orbit_table.json")
TOP = os.path.join(ROOT, "factory", "topics", "noether-frontier", "data")
AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"
def b64_2(q): return AB[(q >> 6) & 63] + AB[q & 63]

def rot_from_axis(u, omega):
    z = np.array([0.0, 0.0, 1.0]); v = np.cross(z, u); s = np.linalg.norm(v); c = float(z @ u)
    if s < 1e-12: R = np.eye(3) if c > 0 else np.diag([1, -1, -1.0])
    else:
        vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]]); R = np.eye(3) + vx + vx @ vx * ((1 - c) / s ** 2)
    co, si = np.cos(omega), np.sin(omega)
    return R @ np.array([[co, -si, 0], [si, co, 0], [0, 0, 1.0]])

def orbits():
    ot = json.load(open(P1)); cols = ot["cols"]; rows = ot["rows"]; ix = {c: i for i, c in enumerate(cols)}
    assert len(rows) == 300 and int(ot["per_orbit"]) == 100
    orb = ""; worst = 0
    for r in rows:
        R = np.array([[r[ix["R%d%d" % (i, j)]] for j in range(3)] for i in range(3)]); u = R[:, 2]
        R0 = rot_from_axis(u, 0.0); Rz = R0.T @ R; omega = math.atan2(Rz[1, 0], Rz[0, 0]) % (2 * math.pi)
        qs = [round((u[k] + 1) / 2 * 4095) for k in range(3)] + [round(omega / (2 * math.pi) * 4095) % 4096, round(r[ix["u0"]] * 4095)]
        orb += "".join(b64_2(q) for q in qs)
        u2 = np.array([qs[k] / 4095 * 2 - 1 for k in range(3)]); u2 /= np.linalg.norm(u2); worst = max(worst, float(np.linalg.norm(u2 - u)))
    print("orbits chars", len(orb), "worst |du|", worst); return orb

def zz(v):
    z = (v << 1) ^ (v >> 63) if v < 0 else v << 1; out = bytearray()
    while z >= 128: out.append(128 | (z & 127)); z >>= 7
    out.append(z); return out

def neurons(Q=10):
    d = json.load(open(os.path.join(TOP, "neurons.json"))); buf = bytearray(); worst = 0
    for u in range(480):
        for k in ("smallA", "smallB", "bigA", "bigB"):
            v = np.cumsum(np.array(d[k][u])); q = np.round(v / Q).astype(int); worst = max(worst, float(np.abs(q * Q - v).max()))
            buf += zz(int(q[0])) + zz(int(q[1] - q[0]))
            for s in range(2, 50): buf += zz(int(q[s] - 2 * q[s - 1] + q[s - 2]))
    co = zlib.compressobj(9, zlib.DEFLATED, -15); z = co.compress(bytes(buf)) + co.flush(); b = base64.b64encode(z).decode()
    print("neurons raw", len(buf), "deflate", len(z), "b64", len(b), "worst quantisation (x1000)", worst); return b

def tree():
    t = json.load(open(os.path.join(TOP, "question_tree.json")))["nodes"]; ids = [n["id"] for n in t]
    return {"l": [n["level"] for n in t], "p": [ids.index(n["parent"]) if n["parent"] else -1 for n in t], "x": [int(round(n["x"] * 100)) for n in t]}

def toy():
    t = json.load(open(os.path.join(TOP, "toy.json"))); sub = [t["a"], t["b"], t["c"]]
    return {"o": "".join("".join(str(sub.index(v)) for v in o) for o in t["orderList"]), "v": [int(round(v * 10)) for v in t["toyModelValues"]]}

js = "window.NOETHER_DATA=%s;\n" % json.dumps({"orb": orbits(), "net": neurons(), "tree": tree(), "toy": toy()}, separators=(",", ":"))
open(os.path.join(HERE, "data.js"), "w").write(js); print("data.js", len(js), "bytes")
