#!/usr/bin/env python3
"""recompute.py · how-a-network-learns · every number the film uses, regenerated deterministically.

    python3 factory/topics/how-a-network-learns/recompute.py          # prints the claims, writes data/*.json
    python3 factory/topics/how-a-network-learns/recompute.py --get correct_10   # one value, as claims.json expects
    python3 factory/topics/how-a-network-learns/recompute.py --check  # also exits 1 if claims.json disagrees

numpy only. Fixed seed. No other dependency, no network.

The model (declared; brief.md "The model"):
  inputs   the 4 measurements of data/iris.csv, z-scored per column (population SD), species -> 0,1,2
  network  4 -> 8 (tanh) -> 3 (softmax); 4*8 + 8 + 8*3 + 3 = 67 weights and biases
  init     numpy default_rng(SEED): W1 ~ N(0, 1/4), W2 ~ N(0, 1/8) (std 1/sqrt(fan_in)); biases 0
  loss     mean softmax cross-entropy over all 150 flowers (natural log)
  training full-batch plain gradient descent, fixed learning rate LR, STEPS steps, no momentum,
           no regularisation, no train/test split (the film is about learning, not generalising)
  "right"  argmax of the softmax equals the species
Outputs (written to data/ for the drafters):
  train_log.json  per step k = 0..STEPS: loss, correct (count of 150), flags (150-char string, '1' = right)
  surface.json    loss over a 120 x 80 grid of two chosen weights, the other 65 held at their final values,
                  with the descent path projected onto it
  network.json    |weights| at the checkpoint steps (ribbon widths), predictions and confusion matrices
  claims_out.json the printed claims as one flat dict
"""
import json, os, sys
import numpy as np

SEED, LR, STEPS = 0, 0.5, 1000
CHECK = [0, 10, 50, 100, STEPS]
GRID_COLS, GRID_ROWS = 120, 80
SPECIES = ["setosa", "versicolor", "virginica"]
CLOUD_AXES = ["petal_length", "petal_width", "sepal_length"]   # the 3 measured dimensions in the point cloud
HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")


def load():
    rows = [l.strip().split(",") for l in open(os.path.join(DATA, "iris.csv")) if l.strip()]
    head, rows = rows[0], rows[1:]
    X = np.array([[float(v) for v in r[:4]] for r in rows])
    y = np.array([SPECIES.index(r[4]) for r in rows])
    return head, X, y


def init(seed):
    r = np.random.default_rng(seed)
    return {"W1": r.normal(0, 1 / np.sqrt(4), (4, 8)), "b1": np.zeros(8),
            "W2": r.normal(0, 1 / np.sqrt(8), (8, 3)), "b2": np.zeros(3)}


def forward(P, Xs):
    h = np.tanh(Xs @ P["W1"] + P["b1"])
    z = h @ P["W2"] + P["b2"]
    z = z - z.max(1, keepdims=True)
    p = np.exp(z); p /= p.sum(1, keepdims=True)
    return h, p


def loss_of(p, y):
    return float(-np.log(p[np.arange(len(y)), y]).mean())


def train(Xs, y, seed=SEED, lr=LR, steps=STEPS, keep=True):
    P = init(seed); Y = np.eye(3)[y]; n = len(y)
    log, snaps, path = [], {}, []
    for k in range(steps + 1):
        h, p = forward(P, Xs)
        pred = p.argmax(1)
        log.append({"k": k, "loss": loss_of(p, y), "correct": int((pred == y).sum()),
                    "flags": "".join("1" if a == b else "0" for a, b in zip(pred, y))} if keep else
                   {"k": k, "loss": loss_of(p, y), "correct": int((pred == y).sum())})
        if keep:
            path.append({kk: v.copy() for kk, v in P.items()})
            if k in CHECK:
                snaps[k] = {"P": {kk: v.copy() for kk, v in P.items()}, "pred": pred.copy()}
        if k == steps:
            break
        g = (p - Y) / n
        gW2 = h.T @ g; gb2 = g.sum(0)
        gh = (g @ P["W2"].T) * (1 - h * h)
        gW1 = Xs.T @ gh; gb1 = gh.sum(0)
        P["W1"] -= lr * gW1; P["b1"] -= lr * gb1; P["W2"] -= lr * gW2; P["b2"] -= lr * gb2
    return P, log, snaps, path


def flat_names():
    out = []
    for i in range(4):
        for j in range(8): out.append(("W1", (i, j), f"W1[{i},{j}]"))
    for j in range(8): out.append(("b1", (j,), f"b1[{j}]"))
    for j in range(8):
        for c in range(3): out.append(("W2", (j, c), f"W2[{j},{c}]"))
    for c in range(3): out.append(("b2", (c,), f"b2[{c}]"))
    return out


def main():
    head, X, y = load()
    assert X.shape == (150, 4) and np.bincount(y).tolist() == [50, 50, 50], "iris.csv must hold 150 rows, 50 per species"
    mu, sd = X.mean(0), X.std(0)
    Xs = (X - mu) / sd
    P, log, snaps, path = train(Xs, y)
    L = np.array([r["loss"] for r in log]); C = np.array([r["correct"] for r in log])
    drop = L[0] - L; total = L[0] - L[-1]
    s50 = int(np.argmax(drop >= 0.50 * total))
    s90 = int(np.argmax(drop >= 0.90 * total)); s99 = int(np.argmax(drop >= 0.99 * total))
    best = int(C.max()); first_best = int(np.argmax(C >= best))
    reach = {m: (int(np.argmax(C >= m)) if (C >= m).any() else None) for m in (100, 120, 140, 145, 146, 147, 148)}
    # per flower: the step after which it is right at every later step ("learned for good"; None = never)
    F = np.array([[c == "1" for c in r["flags"]] for r in log])        # (STEPS+1, 150)
    learned = []
    for i in range(150):
        col = F[:, i]
        if not col[-1]: learned.append(None); continue
        wrong = np.where(~col)[0]
        learned.append(int(wrong[-1] + 1) if len(wrong) else 0)
    final_pred = snaps[STEPS]["pred"]
    conf = {k: np.zeros((3, 3), int) for k in CHECK}
    for k in CHECK:
        for a, b in zip(y, snaps[k]["pred"]): conf[k][a, b] += 1
    wrong_final = [int(i) for i in np.where(final_pred != y)[0]]
    pairs = {}
    for i in wrong_final:
        key = tuple(sorted((SPECIES[y[i]], SPECIES[final_pred[i]]))); pairs[key] = pairs.get(key, 0) + 1
    confused = max(pairs, key=pairs.get) if pairs else None
    # overlap in the raw measurements: versicolor and virginica petal-length ranges overlap, setosa's does not
    pl = X[:, 2]
    rng = {s: (float(pl[y == i].min()), float(pl[y == i].max())) for i, s in enumerate(SPECIES)}
    overlap_vv = int(((y == 1) & (pl >= rng["virginica"][0])).sum() + ((y == 2) & (pl <= rng["versicolor"][1])).sum())
    # step budget: steps spent before vs after the network first gets 140 right
    after140 = STEPS - reach[140]

    # robustness: the same recipe over seeds 0..19 (only the seed changes)
    rob = []
    for s in range(20):
        _, lg, _, _ = train(Xs, y, seed=s, keep=False)
        Ls = np.array([r["loss"] for r in lg]); Cs = np.array([r["correct"] for r in lg])
        rob.append({"seed": s, "c0": int(Cs[0]), "c10": int(Cs[10]), "cfinal": int(Cs[-1]),
                    "s90": int(np.argmax(Ls[0] - Ls >= 0.9 * (Ls[0] - Ls[-1])))})
    c10s = [r["c10"] for r in rob]; s90s = [r["s90"] for r in rob]; cfin = [r["cfinal"] for r in rob]

    # loss surface over two weights: the two parameters that travel furthest from init to final
    names = [nm for nm in flat_names() if nm[0] in ("W1", "W2")]   # weights only, no biases
    P0 = path[0]
    travel = [abs(P[g][ix] - P0[g][ix]) for g, ix, _ in names]
    order = np.argsort(travel)[::-1]
    (ga, ia, na), (gb, ib, nb) = names[order[0]], names[order[1]]
    pa = np.array([q[ga][ia] for q in path]); pb = np.array([q[gb][ib] for q in path])
    def span(v):
        lo, hi = float(v.min()), float(v.max()); pad = 0.35 * (hi - lo) + 0.5
        return lo - pad, hi + pad
    ax_a = np.linspace(*span(pa), GRID_COLS); ax_b = np.linspace(*span(pb), GRID_ROWS)
    Z = np.zeros((GRID_ROWS, GRID_COLS))
    Q = {kk: v.copy() for kk, v in P.items()}
    for r_, vb in enumerate(ax_b):
        for c_, va in enumerate(ax_a):
            Q[ga][ia] = va; Q[gb][ib] = vb
            Z[r_, c_] = loss_of(forward(Q, Xs)[1], y)
    on_slice = []
    for k in range(STEPS + 1):
        Q[ga][ia] = pa[k]; Q[gb][ib] = pb[k]
        on_slice.append(loss_of(forward(Q, Xs)[1], y))
    Q[ga][ia] = P[ga][ia]; Q[gb][ib] = P[gb][ib]
    zmin_rc = np.unravel_index(np.argmin(Z), Z.shape)

    # ----- write data for the drafters
    os.makedirs(DATA, exist_ok=True)
    r6 = lambda v: round(float(v), 6)
    json.dump({"model": {"seed": SEED, "lr": LR, "steps": STEPS, "layers": [4, 8, 3], "act": "tanh",
                         "loss": "mean softmax cross-entropy", "inputs_zscored_mean": [r6(v) for v in mu],
                         "inputs_zscored_sd": [r6(v) for v in sd]},
               "species": SPECIES, "y": y.tolist(),
               "cloud_axes": CLOUD_AXES,
               "cloud": [[float(X[i, head.index(a)]) for a in CLOUD_AXES] for i in range(150)],
               "learned_for_good_at": learned,
               "steps": [{"k": r["k"], "loss": r6(r["loss"]), "correct": r["correct"], "flags": r["flags"]} for r in log]},
              open(os.path.join(DATA, "train_log.json"), "w"), separators=(",", ":"))
    json.dump({"weights": [na, nb], "cols": GRID_COLS, "rows": GRID_ROWS,
               "axis_a": [r6(v) for v in ax_a], "axis_b": [r6(v) for v in ax_b],
               "values": [[round(float(v), 5) for v in row] for row in Z],
               "vmin": r6(Z.min()), "vmax": r6(Z.max()),
               "grid_min": {"row": int(zmin_rc[0]), "col": int(zmin_rc[1]), "loss": r6(Z.min())},
               "final_cell": {"col": int(np.argmin(abs(ax_a - pa[-1]))), "row": int(np.argmin(abs(ax_b - pb[-1])))},
               "start_cell": {"col": int(np.argmin(abs(ax_a - pa[0]))), "row": int(np.argmin(abs(ax_b - pb[0])))},
               "note": "rows = axis_b, cols = axis_a; the other 65 parameters are held at their final values (step %d); "
                       "path.loss_on_slice is the surface value under the path, path.loss_true the real loss at that "
                       "step (all 67 moving); they agree only at the final step" % STEPS,
               "path": {"a": [r6(v) for v in pa], "b": [r6(v) for v in pb],
                        "loss_on_slice": [r6(v) for v in on_slice], "loss_true": [r6(v) for v in L]}},
              open(os.path.join(DATA, "surface.json"), "w"), separators=(",", ":"))
    # ribbon routes: each flower rides input i* -> hidden j* -> predicted species, where j* is the hidden unit with the
    # largest contribution h_j * W2[j, pred] to the predicted logit and i* the input with the largest |x_i * W1[i, j*]|
    routes = {}
    for k in CHECK:
        Pk = snaps[k]["P"]; hk = np.tanh(Xs @ Pk["W1"] + Pk["b1"]); pr = snaps[k]["pred"]
        rr = []
        for n_ in range(150):
            j = int(np.argmax(hk[n_] * Pk["W2"][:, pr[n_]])); i = int(np.argmax(np.abs(Xs[n_] * Pk["W1"][:, j])))
            rr.append([i, j, int(pr[n_])])
        routes[k] = rr
    json.dump({"layers": [["sepal_length", "sepal_width", "petal_length", "petal_width"],
                          ["h%d" % j for j in range(8)], SPECIES],
               "checkpoints": {str(k): {"absW1": [[r6(abs(v)) for v in row] for row in snaps[k]["P"]["W1"]],
                                        "absW2": [[r6(abs(v)) for v in row] for row in snaps[k]["P"]["W2"]],
                                        "signW1": np.sign(snaps[k]["P"]["W1"]).astype(int).tolist(),
                                        "signW2": np.sign(snaps[k]["P"]["W2"]).astype(int).tolist(),
                                        "pred": snaps[k]["pred"].tolist(),
                                        "confusion": conf[k].tolist(),
                                        "routes": routes[k],
                                        "correct": int((snaps[k]["pred"] == y).sum())} for k in CHECK},
               "note": "confusion[true][predicted]; ribbons input->hidden width = |W1|, hidden->output width = |W2|; "
                       "marks = the 150 flowers; routes[n] = [input i, hidden j, predicted species] (largest-contribution path, see recompute.py); "
                       "a mark is right when predicted species == y[n]"},
              open(os.path.join(DATA, "network.json"), "w"), separators=(",", ":"))

    out = {
        "n_flowers": 150, "n_species": 3, "per_species": 50, "n_measurements": 4,
        "n_params": int(sum(v.size for v in P.values())), "hidden": 8,
        "seed": SEED, "lr": LR, "steps": STEPS,
        **{f"loss_{k}": round(float(L[k]), 3) for k in CHECK[:-1]}, "loss_final": round(float(L[-1]), 3),
        **{f"correct_{k}": int(C[k]) for k in CHECK[:-1]}, "correct_final": int(C[-1]),
        **{f"acc_{k}_pct": round(100 * C[k] / 150, 1) for k in CHECK[:-1]}, "acc_final_pct": round(100 * C[-1] / 150, 1),
        "wrong_final": int(150 - C[-1]),
        "chance_correct": 50, "best_correct": best, "first_step_best": first_best,
        "step_50pct_drop": s50, "step_90pct_drop": s90, "step_99pct_drop": s99,
        **{f"step_reach_{m}": v for m, v in reach.items()},
        "steps_after_140": after140,
        "correct_at_s90": int(C[s90]), "correct_at_s99": int(C[s99]),
        "steps_13_to_140": reach[140], "steps_140_to_148": reach[148] - reach[140],
        "steps_after_best": STEPS - first_best, "loss_at_best": round(float(L[first_best]), 3),
        "flowers_gained_first_10": int(C[10] - C[0]),
        "drop_pct_by_10": round(float(100 * (L[0] - L[10]) / total)), "drop_pct_by_50": round(float(100 * (L[0] - L[50]) / total)), "flowers_gained_last_900": int(C[-1] - C[100]),
        "confused_pair": list(confused) if confused else None,
        "wrong_final_rows_1based": [i + 1 for i in wrong_final],
        "wrong_final_true": [SPECIES[y[i]] for i in wrong_final], "wrong_final_pred": [SPECIES[final_pred[i]] for i in wrong_final],
        "setosa_right_final": int(conf[STEPS][0, 0]), "versicolor_right_final": int(conf[STEPS][1, 1]),
        "virginica_right_final": int(conf[STEPS][2, 2]),
        "setosa_right_10": int(conf[10][0, 0]), "versicolor_right_10": int(conf[10][1, 1]), "virginica_right_10": int(conf[10][2, 2]),
        "petal_length_range": {s: list(v) for s, v in rng.items()}, "petal_overlap_flowers": overlap_vv,
        "learned_never": sum(v is None for v in learned),
        "learned_by_10": sum(v is not None and v <= 10 for v in learned),
        "learned_by_100": sum(v is not None and v <= 100 for v in learned),
        "last_learned_step": max(v for v in learned if v is not None),
        "surface_weights": [na, nb], "surface_cells": GRID_COLS * GRID_ROWS,
        "surface_min_loss": round(float(Z.min()), 3), "surface_max_loss": round(float(Z.max()), 3),
        "surface_start_loss_on_slice": round(float(on_slice[0]), 3),
        "surface_weight_a_init_final": [round(float(pa[0]), 2), round(float(pa[-1]), 2)],
        "surface_weight_b_init_final": [round(float(pb[0]), 2), round(float(pb[-1]), 2)],
        "robust_seeds": 20, "robust_c10_min": min(c10s), "robust_c10_max": max(c10s),
        "robust_s90_min": min(s90s), "robust_s90_max": max(s90s),
        "robust_cfinal_min": min(cfin), "robust_cfinal_max": max(cfin),
    }
    json.dump(out, open(os.path.join(DATA, "claims_out.json"), "w"), indent=1)
    if "--get" in sys.argv:
        v = out[sys.argv[sys.argv.index("--get") + 1]]
        print(", ".join(map(str, v)) if isinstance(v, list) else v); return
    for k, v in out.items(): print(f"{k:28s} {v}")

    if "--check" in sys.argv:
        cj = json.load(open(os.path.join(HERE, "claims.json")))
        bad = n = 0
        for c in cj["claims"]:
            cmd = c.get("recompute", "")
            if "--get " not in cmd: continue
            key = cmd.split("--get ")[1].split()[0]; v = out[key]; n += 1
            got = ", ".join(map(str, v)) if isinstance(v, list) else str(v)
            if got != str(c.get("expect")) or str(c["value"]) != got:
                print("MISMATCH", c["id"], repr(c["value"]), repr(c.get("expect")), "!=", repr(got)); bad += 1
        print(f"check: {n} recomputed claims,", "OK" if not bad else f"{bad} mismatches"); sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
