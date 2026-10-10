#!/usr/bin/env python3
"""lib/data_pack.py (how-a-network-learns draft B) · packs the frozen topic data into film.json `params.data`.
Reads factory/topics/how-a-network-learns/data/{iris.csv, train_log.json, surface.json, network.json} and, for the
final biases only (not in the data files), re-runs recompute.py's own deterministic train() (numpy, seed 0).
Nothing here is drawn as a digit; the film's digits are claims. Deterministic: same inputs, same bytes.
    python3 lib/data_pack.py            # rewrites ../film.json params.data in place"""
import json, os, sys, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, *[".."] * 6))
TOP = os.path.join(ROOT, "factory", "topics", "how-a-network-learns")
D = os.path.join(TOP, "data")
r = lambda v, n: float(round(v, n))

def dump(F):
    """film.json layout: one top-level key per line; list items (captions, chapters, knobs_doc) one per line; compact inside."""
    c = lambda v: json.dumps(v, ensure_ascii=False, separators=(",", ":"))
    out = []
    for k, v in F.items():
        if isinstance(v, list) and v and isinstance(v[0], (list, dict)):
            out.append(" %s: [\n%s\n ]" % (c(k), ",\n".join("  " + c(x) for x in v)))
        elif k == "params":
            out.append(" %s: {\n%s\n }" % (c(k), ",\n".join("  %s: %s" % (c(a), c(b)) for a, b in v.items())))
        else:
            out.append(" %s: %s" % (c(k), c(v)))
    return "{\n" + ",\n".join(out) + "\n}\n"

def main():
    spec = importlib.util.spec_from_file_location("recompute", os.path.join(TOP, "recompute.py"))
    rc = importlib.util.module_from_spec(spec); spec.loader.exec_module(rc)
    head, X, y = rc.load()
    mu, sd = X.mean(0), X.std(0); Xs = (X - mu) / sd
    P, log, snaps, path = rc.train(Xs, y)
    TL = json.load(open(os.path.join(D, "train_log.json")))
    SF = json.load(open(os.path.join(D, "surface.json")))
    NW = json.load(open(os.path.join(D, "network.json")))
    assert [r_["correct"] for r_ in TL["steps"]] == [r_["correct"] for r_ in log], "train() disagrees with train_log.json"
    # per flower: the steps at which its right/wrong flag changes (k = 0 included when right at step 0)
    flips = []
    for i in range(150):
        prev, f = "0", []
        for s in TL["steps"]:
            c = s["flags"][i]
            if c != prev: f.append(s["k"]); prev = c
        flips.append(f)
    # the descent path, in grid units of the slice (col = axis_a, row = axis_b), every step to 40 then every 10th
    A, B = SF["axis_a"], SF["axis_b"]; da = (A[-1] - A[0]) / (len(A) - 1); db = (B[-1] - B[0]) / (len(B) - 1)
    ks = list(range(0, 41)) + list(range(50, 1001, 10))
    pa, pb, pl = SF["path"]["a"], SF["path"]["b"], SF["path"]["loss_true"]
    pathk = [[k, r((pa[k] - A[0]) / da, 3), r((pb[k] - B[0]) / db, 3), r(pl[k], 4)] for k in ks]
    ck = {}
    for k, c in NW["checkpoints"].items():
        ck[k] = {"w1": [[r(a * s, 3) for a, s in zip(ra, rs)] for ra, rs in zip(c["absW1"], c["signW1"])],
                 "w2": [[r(a * s, 3) for a, s in zip(ra, rs)] for ra, rs in zip(c["absW2"], c["signW2"])],
                 "routes": "".join("%d%d%d" % tuple(q) for q in c["routes"])}
    data = {
        "X": [[float(v) for v in row] for row in X.tolist()],
        "mu": [r(v, 6) for v in mu], "sd": [r(v, 6) for v in sd],
        "final": {"W1": [[r(v, 6) for v in row] for row in P["W1"]], "b1": [r(v, 6) for v in P["b1"]],
                  "W2": [[r(v, 6) for v in row] for row in P["W2"]], "b2": [r(v, 6) for v in P["b2"]]},
        "slice": {"a": [r(A[0], 6), r(A[-1], 6)], "b": [r(B[0], 6), r(B[-1], 6)], "ia": [2, 2], "ib": [2, 2],
                  "cols": SF["cols"], "rows": SF["rows"], "start": SF["start_cell"], "final": SF["final_cell"]},
        "path": pathk, "flips": flips, "ck": ck,
    }
    fj = os.path.join(HERE, "..", "film.json"); F = json.load(open(fj))
    F["params"]["data"] = data
    open(fj, "w", encoding="utf-8").write(dump(F))
    print("params.data packed: %d bytes" % len(json.dumps(data, separators=(",", ":"))))

if __name__ == "__main__":
    main()
