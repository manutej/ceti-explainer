#!/usr/bin/env python3
"""lib/mkdata.py (noether-frontier draft B, "the laboratory bench") · reads factory/topics/noether-frontier/data/neurons.json and
factory/topics/noether-symmetry/data/orbit_table.json and writes lib/data.js (compact strings; film.json "libs" inlines it, so the data
does not count as film code). No randomness. Checks the round trip and prints what the film will see.
 orbits : spin direction u (3), in-plane angle omega, phase u0 at 12 bits each (2 chars each; Part 1's coding); shell/level from the index.
 neurons: per unit (id = run*8+i) three int streams: A  small-step a   (x100), B  big-step a (x100), D  big-step c - c0 (x50),
          each: vlq(first), vlq(first difference), then second differences in groups of 4 (one char when all four are -1..0..1,
          else an escape symbol + four vlq). The small-step sum is stored as exactly its starting layer (displayed to 0.01; its
          real drift is at most 0.0072, median 0.0005, claims driftSmallMedian). b is derived: b = sqrt(max(a^2 - c, 0)).
 alphabet: 89 printable characters (35..126 without < \\ `): symbols 0..80 = four ternary digits, 81 = escape, vlq digit = 4 bits + continue."""
import json, os, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
TOP = os.path.join(HERE, "..", "..", "..", "..", "..", "topics")
AL = "".join(chr(c) for c in range(35, 127) if chr(c) not in "<\\`")
assert len(AL) == 89
AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"
RA, RB, RD = 0.01, 0.01, 0.02

def b64_2(q): return AB[(q >> 6) & 63] + AB[q & 63]

def vlq(n):
    z = (n << 1) ^ (n >> 63) if n < 0 else n << 1
    out = ""
    while True:
        d = z & 15; z >>= 4
        if z: out += AL[16 | d]
        else: out += AL[d]; return out

def rot_from_axis(u, omega):
    z = np.array([0.0, 0.0, 1.0]); v = np.cross(z, u); s = np.linalg.norm(v); c = float(z @ u)
    if s < 1e-12: R = np.eye(3) if c > 0 else np.diag([1, -1, -1.0])
    else:
        vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]]); R = np.eye(3) + vx + vx @ vx * ((1 - c) / s ** 2)
    co, si = np.cos(omega), np.sin(omega)
    return R @ np.array([[co, -si, 0], [si, co, 0], [0, 0, 1.0]])

def orbits():
    ot = json.load(open(os.path.join(TOP, "noether-symmetry", "data", "orbit_table.json")))
    ix = {c: i for i, c in enumerate(ot["cols"])}; s = ""; worst = 0
    for k, r in enumerate(ot["rows"]):
        assert r[ix["Lshell"]] == k // 50 and r[ix["Elevel"]] == (k % 50) // 10, k
        R = np.array([[r[ix["R%d%d" % (i, j)]] for j in range(3)] for i in range(3)]); u = R[:, 2]
        Rz = rot_from_axis(u, 0.0).T @ R; om = math.atan2(Rz[1, 0], Rz[0, 0]) % (2 * math.pi)
        qs = [round((u[j] + 1) / 2 * 4095) for j in range(3)] + [round(om / (2 * math.pi) * 4095) % 4096, round(r[ix["u0"]] * 4095)]
        s += "".join(b64_2(q) for q in qs)
        u2 = np.array([qs[j] / 4095 * 2 - 1 for j in range(3)]); u2 /= np.linalg.norm(u2); worst = max(worst, float(np.linalg.norm(u2 - u)))
    print("orbits: %d chars, worst |du| %.4f" % (len(s), worst)); return s

def enc(Q):   # Q (480, 50) ints -> string
    out = []; esc = 0
    for row in Q:
        row = [int(x) for x in row]; out.append(vlq(row[0])); out.append(vlq(row[1] - row[0]))
        d2 = [row[j] - 2 * row[j - 1] + row[j - 2] for j in range(2, 50)]
        for g in range(0, 48, 4):
            d = d2[g:g + 4]
            if max(abs(x) for x in d) <= 1: out.append(AL[sum((d[i] + 1) * 3 ** i for i in range(4))])
            else: out.append(AL[81]); esc += 1; out.extend(vlq(x) for x in d)
    return "".join(out), esc

def dec(s):   # the JS decoder, mirrored
    pos = [0]; idx = {c: i for i, c in enumerate(AL)}
    def v():
        z = 0; sh = 0
        while True:
            d = idx[s[pos[0]]]; pos[0] += 1; z += (d & 15) << sh; sh += 4
            if not d & 16: break
        return -(z + 1) // 2 if z & 1 else z // 2
    out = []
    for _ in range(480):
        q0 = v(); q1 = q0 + v(); row = [q0, q1]; d = q1 - q0
        for g in range(12):
            sym = idx[s[pos[0]]]; pos[0] += 1
            if sym == 81: dd = [v() for _ in range(4)]
            else: dd = [(sym // 3 ** i) % 3 - 1 for i in range(4)]
            for x in dd: d += x; row.append(row[-1] + d)
        out.append(row)
    assert pos[0] == len(s)
    return np.array(out)

def main():
    n = json.load(open(os.path.join(TOP, "noether-frontier", "data", "neurons.json")))
    dc = lambda k: np.cumsum(np.array(n[k]), axis=1) / 1000.0
    sa, sb, ba, bb = dc("smallA"), dc("smallB"), dc("bigA"), dc("bigB")
    lev = np.array(n["levels"]); c0 = np.array(n["c0"]); assert np.allclose(c0, lev[np.arange(480) % 5]), "c0 is the round-robin level"
    cB = ba ** 2 - bb ** 2 - c0[:, None]
    QA = np.round(sa / RA).astype(int); QB = np.round(ba / RB).astype(int); QD = np.round(cB / RD).astype(int)
    sA, e1 = enc(QA); sB, e2 = enc(QB); sD, e3 = enc(QD)
    for q, s in ((QA, sA), (QB, sB), (QD, sD)): assert (dec(s) == q).all()
    A1 = QA * RA; C1 = c0[:, None] + 0 * A1; B1 = np.sqrt(np.maximum(A1 ** 2 - C1, 0))
    A2 = QB * RB; C2 = c0[:, None] + QD * RD; B2 = np.sqrt(np.maximum(A2 ** 2 - C2, 0))
    print("small: |a err| max %.4f, |b err| max %.3f p99 %.3f med %.4f" % (np.abs(A1 - sa).max(), np.abs(B1 - sb).max(), np.percentile(np.abs(B1 - sb), 99), np.median(np.abs(B1 - sb))))
    print("big  : |a err| max %.4f, |b err| max %.3f p99 %.3f med %.4f" % (np.abs(A2 - ba).max(), np.abs(B2 - bb).max(), np.percentile(np.abs(B2 - bb), 99), np.median(np.abs(B2 - bb))))
    print("big sum drift seen by the film: median %.4f (claim 0.1004)" % np.median(np.abs(C2[:, -1] - c0)))
    print("small sum drift true: median %.5f max %.4f" % (np.median(np.abs((sa**2-sb**2)[:, -1]-c0)), np.abs((sa**2-sb**2)-c0[:, None]).max()))
    print("ranges a %.2f..%.2f b %.2f..%.2f | big a %.2f..%.2f b %.2f..%.2f c %.2f..%.2f" % (A1.min(), A1.max(), B1.min(), B1.max(), A2.min(), A2.max(), B2.min(), B2.max(), C2.min(), C2.max()))
    print("chars A %d (esc %d) B %d (esc %d) D %d (esc %d), total %d" % (len(sA), e1, len(sB), e2, len(sD), e3, len(sA) + len(sB) + len(sD)))
    qt = json.load(open(os.path.join(TOP, "noether-frontier", "data", "question_tree.json")))["nodes"]   # titles are never drawn: id, level, parent, x
    tree = [[x["id"], x["level"], x["parent"] or "", x["x"]] for x in qt]
    js = "window.NF_DATA=" + json.dumps({"orb": orbits(), "A": sA, "B": sB, "D": sD, "follow": int(n["follow"]), "tree": tree}, separators=(",", ":")) + ";\n"
    open(os.path.join(HERE, "data.js"), "w").write(js); print("data.js", len(js), "bytes")

if __name__ == "__main__":
    main()
