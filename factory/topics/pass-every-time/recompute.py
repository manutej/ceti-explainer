#!/usr/bin/env python3
"""pass-every-time · recompute every number the film draws from tau-bench, and build the 8-try model.

Run:  python3 -I factory/topics/pass-every-time/recompute.py [--write]

Stdlib only, deterministic (mulberry32, fixed seed). What it does:

1. MEASURED (attempts 1-4). Reads data/tau_retail_trials.json, the per-task 0/1 rewards of the four published
   trials of tau-bench GPT-4o retail (115 tasks). Recomputes pass^k for k = 1..4 with the unbiased estimator
   pass^k = mean over tasks of C(c,k) / C(4,k), c = passes of that task in 4 tries, and checks
   60.4 / 49.1 / 43.0 / 38.3 within 1 point (it matches to 0.05).
2. MODEL (attempts 5-8). The repository publishes 4 trials per task, not 8. The film extends each task by four more
   tries with a model, and labels it a model on stage:
     per-task success probability p ~ Beta(a, b)           (a, b fitted by least squares to pass^1..pass^4)
     pass^k (model) = E[p^k] = prod_{i<k} (a+i)/(a+b+i)
     attempt m+1 of a task, given s passes in n tries so far:  P(pass) = (a+s)/(a+b+n)   (Polya urn = exact
     posterior predictive of the Beta prior, so the 4 measured tries condition the 4 new ones)
   Uniforms come from mulberry32(SEED). The sampled outcomes are written to data/tau_retail_8.json (--write).
3. REPORTS pass^5..pass^8 of the sampled field and of the analytic model, and the spread over 1000 other seeds.
   It also reports the gap to the paper's own sentence (pass^8 under 25 %): the beta model does NOT reach it.
   That gap is a finding; the film shows the model reading as a model and the paper's figure as the paper's.

Simulation claim, stated as the film states it: "a model of the published curve: each task has its own chance of
passing, spread like a Beta(a, b) fitted to 60.4 / 49.1 / 43.0 / 38.3; tries 5 to 8 are drawn from it, seed 20261010".
"""
import json, math, os, sys
from math import comb

HERE = os.path.dirname(os.path.abspath(__file__))
SEED = 20261010
PUBLISHED = [0.604, 0.491, 0.430, 0.383]   # tau-bench README leaderboard, retail, TC (gpt-4o), pass^1..4
PAPER_PASS8_UPPER = 0.25                   # tau-bench abstract: "less than 25% for pass^8 on tau-retail"


def mulberry32(seed):
    s = [seed & 0xFFFFFFFF]

    def rnd():
        s[0] = (s[0] + 0x6D2B79F5) & 0xFFFFFFFF
        t = s[0]
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xFFFFFFFF
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296.0
    return rnd


def pass_hat(counts, k, n):
    return sum(comb(c, k) / comb(n, k) for c in counts) / len(counts)


def beta_pk(a, b, k):
    r = 1.0
    for i in range(k):
        r *= (a + i) / (a + b + i)
    return r


def fit_beta():
    """Deterministic coarse-to-fine grid search; minimises sum of squared error against PUBLISHED."""
    def err(a, b):
        return sum((beta_pk(a, b, k) - PUBLISHED[k - 1]) ** 2 for k in range(1, 5))
    best = (1e9, 1.0, 1.0)
    lo_a, hi_a, lo_b, hi_b, step = 0.05, 3.0, 0.05, 3.0, 0.05
    for _ in range(6):
        a = lo_a
        while a <= hi_a + 1e-12:
            b = lo_b
            while b <= hi_b + 1e-12:
                e = err(a, b)
                if e < best[0]:
                    best = (e, a, b)
                b += step
            a += step
        _, ba, bb = best
        lo_a, hi_a, lo_b, hi_b = max(0.01, ba - 2 * step), ba + 2 * step, max(0.01, bb - 2 * step), bb + 2 * step
        step /= 5
    return best[1], best[2]


def extend(counts_tries, a, b, rnd, extra=4):
    out = []
    for tries in counts_tries:
        s, n = sum(tries), len(tries)
        new = []
        for _ in range(extra):
            p = (a + s) / (a + b + n)
            hit = 1 if rnd() < p else 0
            new.append(hit)
            s += hit
            n += 1
        out.append(new)
    return out


def main():
    write = "--write" in sys.argv
    d = json.load(open(os.path.join(HERE, "data", "tau_retail_trials.json")))
    tasks = d["tasks"]
    tries = [t["tries"] for t in tasks]
    N = len(tasks)
    counts = [sum(t) for t in tries]
    dist = {c: counts.count(c) for c in range(5)}
    print(f"tasks {N}; tries {N*4}; passed {sum(counts)}; tasks by passes-of-4 {dist}")

    measured = [pass_hat(counts, k, 4) for k in range(1, 5)]
    print("measured pass^1..4 :", [round(100 * x, 1) for x in measured], " published:", [round(100 * x, 1) for x in PUBLISHED])
    assert all(abs(m - p) < 0.01 for m, p in zip(measured, PUBLISHED)), "measured series is not within 1 point of published"
    # task-count formulas the claims use
    assert dist[4] == 44 and sum(counts) == 278 and N == 115

    a, b = fit_beta()
    model = [beta_pk(a, b, k) for k in range(1, 9)]
    print(f"beta fit a={a:.3f} b={b:.3f} mean={a/(a+b):.3f}")
    print("model pass^1..8    :", [round(100 * x, 1) for x in model])
    assert all(abs(model[k] - PUBLISHED[k]) < 0.01 for k in range(4)), "beta fit is not within 1 point of the published series"

    rnd = mulberry32(SEED)
    new = extend(tries, a, b, rnd)
    full = [tries[i] + new[i] for i in range(N)]
    fc = [sum(x) for x in full]
    samp = {k: sum(1 for x in full if all(x[:k])) for k in range(1, 9)}
    print("sampled field: columns fully lit among first k tries :", samp)
    print("sampled field pass^k (all-k share) for k=5..8 :", {k: round(100 * samp[k] / N, 1) for k in range(5, 9)})
    assert samp[4] == dist[4]

    # analytic expectation of the same urn model, given the measured counts: E[#all-8] = sum over c=4 tasks of E[p^4 | Beta(a+4, b)]
    post = beta_pk(a + 4, b, 4)
    exp8 = dist[4] * post
    print(f"analytic expected all-8 columns {exp8:.1f} of {N} = {100*exp8/N:.1f} %  (model pass^8 from the series alone {100*model[7]:.1f} %)")

    spread = []
    for sd in range(1, 1001):
        r = mulberry32(sd)
        nw = extend(tries, a, b, r)
        spread.append(sum(1 for i in range(N) if all(tries[i]) and all(nw[i])))
    spread.sort()
    print(f"1000 other seeds, all-8 columns: min {spread[0]} p5 {spread[50]} median {spread[500]} p95 {spread[950]} max {spread[-1]}")
    print(f"paper says pass^8 under {int(PAPER_PASS8_UPPER*100)} % (= under {math.floor(PAPER_PASS8_UPPER*N)+1} of {N} columns); the model gives {100*samp[8]/N:.1f} %: GAP (finding, see brief.md)")

    out = {
        "film": "pass-every-time", "seed": SEED, "rng": "mulberry32", "tasks": N,
        "beta": {"a": round(a, 4), "b": round(b, 4), "fit": "least squares to pass^1..4 = 60.4 / 49.1 / 43.0 / 38.3"},
        "label": "attempts 1-4 measured (tau-bench published trajectories); attempts 5-8 MODEL, drawn here, seed %d" % SEED,
        "model_pass_pct_k1_8": [round(100 * x, 1) for x in model],
        "sampled_columns_fully_lit_k1_8": [samp[k] for k in range(1, 9)],
        "sampled_all8_columns": samp[8], "sampled_all8_pct": round(100 * samp[8] / N, 1),
        "analytic_expected_all8_columns": round(exp8, 2),
        "seed_spread_all8": {"min": spread[0], "p5": spread[50], "median": spread[500], "p95": spread[950], "max": spread[-1]},
        "passes_of_8_histogram": {str(c): fc.count(c) for c in range(9)},
        "tasks_rows": [{"task": tasks[i]["task"], "measured": tries[i], "model": new[i]} for i in range(N)],
    }
    if write:
        with open(os.path.join(HERE, "data", "tau_retail_8.json"), "w") as f:
            json.dump(out, f, separators=(",", ":"))
        with open(os.path.join(HERE, "data", "recompute_out.json"), "w") as f:
            json.dump({k: v for k, v in out.items() if k != "tasks_rows"}, f, indent=1)
        print("wrote data/tau_retail_8.json, data/recompute_out.json")


if __name__ == "__main__":
    main()
