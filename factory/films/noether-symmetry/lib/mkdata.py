#!/usr/bin/env python3
"""lib/mkdata.py (noether-symmetry draft A) · reads factory/topics/noether-symmetry/data/{orbit_table,network}.json and writes
lib/data.js (compact strings the film decodes in setup). No randomness. Orbits: spin direction u (3), in-plane angle omega, phase u0,
12 bits each (2 base-64 chars). Network: per run the conserved triple (1/1000) and the 30 weight-space points (1/100, delta coded,
zigzag + 5-bit continuation chars; v2: 100 runs x 100 steps, first point and first difference as vlq, then
second differences, one char per step when all three are in -1..1). Prints the round-trip errors and the claims the rebuilt data must keep (cut 62 / 620)."""
import json, os, sys, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
TOP = os.path.join(HERE, "..", "..", "..", "topics", "noether-symmetry", "data")
AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"
def b64_2(q): return AB[(q >> 6) & 63] + AB[q & 63]
def vlq(n):
    z = (n << 1) ^ (n >> 63) if n < 0 else n << 1
    out = ""
    while True:
        d = z & 31; z >>= 5
        if z: out += AB[32 + d]
        else: out += AB[d]; return out

def rot_from_axis(u, omega):
    z = np.array([0.0, 0.0, 1.0]); v = np.cross(z, u); s = np.linalg.norm(v); c = float(z @ u)
    if s < 1e-12: R = np.eye(3) if c > 0 else np.diag([1, -1, -1.0])
    else:
        vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]]); R = np.eye(3) + vx + vx @ vx * ((1 - c) / s ** 2)
    co, si = np.cos(omega), np.sin(omega)
    return R @ np.array([[co, -si, 0], [si, co, 0], [0, 0, 1.0]])

def main():
    ot = json.load(open(os.path.join(TOP, "orbit_table.json")))
    cols = ot["cols"]; rows = ot["rows"]; ix = {c: i for i, c in enumerate(cols)}
    orb = ""; worst_u = 0; cut = 0; near = 1
    for r in rows:
        R = np.array([[r[ix["R00"]], r[ix["R01"]], r[ix["R02"]]], [r[ix["R10"]], r[ix["R11"]], r[ix["R12"]]], [r[ix["R20"]], r[ix["R21"]], r[ix["R22"]]]])
        u = R[:, 2]
        # omega: R = R0(u) @ Rz(omega) -> Rz(omega) = R0^T R
        R0 = rot_from_axis(u, 0.0); Rz = R0.T @ R; omega = math.atan2(Rz[1, 0], Rz[0, 0]) % (2 * math.pi)
        qs = [round((u[k] + 1) / 2 * 4095) for k in range(3)] + [round(omega / (2 * math.pi) * 4095) % 4096, round(r[ix["u0"]] * 4095)]
        orb += "".join(b64_2(q) for q in qs)
        # round trip
        u2 = np.array([qs[k] / 4095 * 2 - 1 for k in range(3)]); u2 /= np.linalg.norm(u2)
        worst_u = max(worst_u, float(np.linalg.norm(u2 - u)))
        if abs(u2[2]) < 0.2: cut += 1
        near = min(near, abs(abs(u2[2]) - 0.2))
    print("orbits chars", len(orb), "worst |du|", worst_u, "cut orbits (quantised)", cut, "nearest to the band edge", near)
    nt = json.load(open(os.path.join(TOP, "network.json"))); nr = np.array(nt["rows"])
    N = 100; P = len(nr) // N                      # v2: 100 runs x 100 recorded steps
    W = nr[:, 3:6].reshape(N, P, 3); C = nr[:, 6:9].reshape(N, P, 3)
    cm = C.mean(1)
    net = ""; cs = ""; worst = 0; esc = 0
    for r in range(N):
        cs += "".join(vlq(int(round(cm[r, k] * 1000))) for k in range(3))
        q = np.round(W[r] / 0.01).astype(int)
        worst = max(worst, float(np.abs(q * 0.01 - W[r]).max()))
        net += "".join(vlq(int(x)) for x in q[0]) + "".join(vlq(int(x)) for x in q[1] - q[0])
        for s in range(2, P):                     # second differences: one char when all three are in -1..1, else '-' + three vlq
            d = q[s] - 2 * q[s - 1] + q[s - 2]
            if np.abs(d).max() <= 1: net += AB[int((d[0] + 1) * 9 + (d[1] + 1) * 3 + d[2] + 1)]
            else: net += "-" + "".join(vlq(int(x)) for x in d); esc += 1
    print("net states", N * P, "chars", len(net), "escapes", esc, "c chars", len(cs), "worst w err", worst)
    js = "window.NOETHER_DATA={orb:%s,net:%s,netc:%s};\n" % (json.dumps(orb), json.dumps(net), json.dumps(cs))
    open(os.path.join(HERE, "data.js"), "w").write(js)
    print("data.js", len(js), "bytes")

main()
