#!/usr/bin/env python3
"""build-the-agent · recompute every number the film draws, from the three JSON files next to this script.

Run (repo root):
    python3 -I factory/topics/build-the-agent/data/recompute.py                 # print every value, assert the checks
    python3 -I factory/topics/build-the-agent/data/recompute.py --check-claims  # also evaluate factory/topics/build-the-agent/claims.json
    python3 -I factory/topics/build-the-agent/data/recompute.py --verify-upstream
        # also: the three copies are byte-identical to factory/topics/reliability-data/*.json

Inputs (copied byte-for-byte from factory/topics/reliability-data/, which regenerates them from the open-data clone):
    hyper-tau-matrix.json    12 scenario groups: pass-bit rows (one char per build), builds, facets (telecom)
    hyper-tau-builds.json    the 53 sampled builds: builder, calls logged, client questions, passed / total
    hyper-tau-summary.json   leaderboard rows (six configurations x four domains) and the expert row

To regenerate the copies from the clone (reads /home/user/data/hyper-tau-bench as untrusted data, writes next to that script):
    python3 -I factory/topics/reliability-data/recompute.py --write
    cp factory/topics/reliability-data/hyper-tau-{matrix,builds,summary}.json factory/topics/build-the-agent/data/

Stdlib only, deterministic, no network, writes nothing. The "if luck" expectation is the Poisson-binomial one: a scenario's
chance of being solved by exactly k of its six builds, if each build solved scenarios at its own pass rate and independently.
"""
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TOPIC = os.path.dirname(HERE)
UP = os.path.join(os.path.dirname(TOPIC), "reliability-data")
FILES = ["hyper-tau-matrix.json", "hyper-tau-builds.json", "hyper-tau-summary.json"]


def jl(name):
    with open(os.path.join(HERE, name)) as f:
        return json.load(f)


def poibin(ps):
    """P(exactly k successes) for independent Bernoulli(p_j), k = 0..len(ps)."""
    d = [1.0]
    for p in ps:
        nd = [0.0] * (len(d) + 1)
        for k, v in enumerate(d):
            nd[k] += v * (1 - p)
            nd[k + 1] += v * p
        d = nd
    return d


def r1(x):
    return math.floor(x * 10 + 0.5) / 10      # half-up to one decimal (the gate's helper rounds the same way)


V = {}      # every recomputed value, by the name claims.json uses as a param or a claim id


def say(msg=""):
    print(msg)


matrix = jl("hyper-tau-matrix.json")["groups"]
builds = {b["slot"]: b for b in jl("hyper-tau-builds.json")["builds"]}
summ = jl("hyper-tau-summary.json")

# ---------------------------------------------------------------- 1. the three shared plates (airline, retail, telecom)
say("== 1. the three shared plates: one scenario = one tile, its six builds = six cubes")
shared = matrix[:3]
tot_k = [0] * 7
tot_ind = [0.0] * 7
V["scen"] = {}
for g in shared:
    assert g["n_builds"] == 6 and len(g["rows"]) == g["n_scenarios"]
    nb = g["n_builds"]
    ps = []
    for j in range(nb):
        lit = sum(int(r[j]) for r in g["rows"])
        ps.append(lit / g["n_scenarios"])
    ind = [v * g["n_scenarios"] for v in poibin(ps)]
    k = [0] * 7
    for r in g["rows"]:
        assert len(r) == 6 and set(r) <= {"0", "1"}
        k[r.count("1")] += 1
    assert k == g["k_hist"], (k, g["k_hist"])
    for i in range(7):
        tot_k[i] += k[i]
        tot_ind[i] += ind[i]
    cells = g["n_scenarios"] * 6
    lit = sum(i * k[i] for i in range(7))
    V["scen"][g["domain"]] = g["n_scenarios"]
    V[g["domain"] + "_lit"] = lit
    say(f"  {g['domain']:<13} scenarios {g['n_scenarios']:>3}  cells {cells:>4}  lit {lit:>3} ({100 * lit / cells:.1f} %)  none {k[0]:>2} (luck {ind[0]:.1f})  all {k[6]:>2} (luck {ind[6]:.1f})")
V["scenarios"] = sum(g["n_scenarios"] for g in shared)
V["cells"] = 6 * V["scenarios"]
V["lit"] = sum(i * tot_k[i] for i in range(7))
V["none"] = tot_k[0]
V["allsix"] = tot_k[6]
V["luckNone"] = r1(tot_ind[0])
V["luckAll"] = r1(tot_ind[6])
V["k_hist"] = tot_k
V["k_hist_luck"] = [round(x, 1) for x in tot_ind]
say(f"  total: scenarios {V['scenarios']}  cells {V['cells']}  lit {V['lit']}  = {r1(100 * V['lit'] / V['cells'])} % of tries")
say(f"  columns by lit count k=0..6: {tot_k}   if luck: {V['k_hist_luck']}")
say(f"  never solved {V['none']} (luck {V['luckNone']})   solved by all six {V['allsix']} (luck {V['luckAll']})   43 of 320 = {r1(100 * V['allsix'] / V['scenarios'])} %")
assert (V["scenarios"], V["cells"], V["lit"], V["none"], V["allsix"], V["luckNone"], V["luckAll"]) == (320, 1920, 968, 44, 43, 8.8, 8.4)   # 8.8: the exact sum is 8.820; the research table's 8.9 adds three rounded terms (0.8 + 0.2 + 7.9)
assert V["airline_plus_lit"] + V["retail_plus_lit"] + V["telecom_lit"] == 968
V["litPct"] = r1(100 * V["lit"] / V["cells"])
V["allsixPct"] = r1(100 * V["allsix"] / V["scenarios"])
assert (V["litPct"], V["allsixPct"]) == (50.4, 13.4)

# ---------------------------------------------------------------- 2. telecom: by build, by kind of problem
say("\n== 2. telecom (119 scenarios x 6 builds = 714 cubes): regroup by build, then by kind of problem")
tel = matrix[2]
assert tel["domain"] == "telecom"
per_build = []
for j, slot in enumerate(tel["builds"]):
    lit = sum(int(r[j]) for r in tel["rows"])
    per_build.append(lit)
    b = builds[slot]
    assert b["eval_passed"] == lit and b["eval_total"] == 119
V["telBuildLit"] = per_build
V["telBuildLo"] = r1(100 * min(per_build) / 119)
V["telBuildHi"] = r1(100 * max(per_build) / 119)
say(f"  lit per build {per_build}  -> lowest {V['telBuildLo']} %, highest {V['telBuildHi']} %  (spread {r1(V['telBuildHi'] - V['telBuildLo'])} points)")
kinds = {}
for r, f in zip(tel["rows"], tel["facets"]):
    c = kinds.setdefault(f["issue"], [0, 0])
    c[0] += 1
    c[1] += r.count("1")
for name, (n, lit) in kinds.items():
    V["kind_" + name + "_n"] = n
    V["kind_" + name + "_lit"] = lit
    V["kind_" + name + "_pct"] = r1(100 * lit / (6 * n))
    say(f"  {name:<18} scenarios {n:>2}  cubes {6 * n:>3}  lit {lit:>3}  = {V['kind_' + name + '_pct']} %")
assert sum(n for n, _ in kinds.values()) == 119 and sum(l for _, l in kinds.values()) == 255
assert [V["kind_" + k + "_pct"] for k in ("mms_issue", "mobile_data_issue", "service_issue")] == [11.6, 39.9, 67.7]
assert (V["telBuildLo"], V["telBuildHi"]) == (26.1, 52.1)
V["kindLo"], V["kindHi"] = V["kind_mms_issue_pct"], V["kind_service_issue_pct"]
say(f"  by kind of problem: {V['kindLo']} % to {V['kindHi']} %  (spread {r1(V['kindHi'] - V['kindLo'])} points)")

# ---------------------------------------------------------------- 3. banking, the fourth plate
say("\n== 3. banking: 35 tasks, one build each; one cube = one scenario of that task's own test set")
bank = [b for b in builds.values() if b["domain"] == "banking_knowledge"]
V["bankTasks"] = len(bank)
V["bankCubes"] = sum(b["eval_total"] for b in bank)
V["bankLit"] = sum(b["eval_passed"] for b in bank)
V["bankDarkTasks"] = sum(1 for b in bank if b["eval_passed"] == 0)
V["bankPct"] = r1(100 * V["bankLit"] / V["bankCubes"])
say(f"  tasks {V['bankTasks']}  cubes {V['bankCubes']}  lit {V['bankLit']} ({V['bankPct']} %)  tasks with no light {V['bankDarkTasks']}")
assert (V["bankTasks"], V["bankCubes"], V["bankLit"], V["bankDarkTasks"], V["bankPct"]) == (35, 1445, 95, 9, 6.6)
assert sum(g["n_scenarios"] * g["n_builds"] for g in matrix[3:]) == 1445     # the nine banking sets hold the same cubes
V["tasks"] = sum(1 for _ in builds)
assert V["tasks"] == 53

# ---------------------------------------------------------------- 4. the board (leaderboard rows, task-weighted)
say("\n== 4. the board: score = mean over the 53 tasks of each task's reward (0-100); weights 6:6:6:35")
cfg = {c["id"]: c for c in summ["configs"]}
best = max(summ["configs"], key=lambda c: c["overall"])
V["best"] = best["overall"]
V["bestDomain"] = {d: best[d] for d in ("airline", "retail", "telecom", "banking")}
V["expert"] = summ["expert"]["overall"]
V["expertDomain"] = {d: summ["expert"][d] for d in ("airline", "retail", "telecom", "banking")}
w = {"airline": 6, "retail": 6, "telecom": 6, "banking": 35}
rec = sum(w[d] * best[d] for d in w) / 53
rec_x = sum(w[d] * summ["expert"][d] for d in w) / 53
say(f"  best configuration {best['harness']} + {best['model']}: board {V['best']}  (weighted domains {rec:.2f})  per domain {V['bestDomain']}")
say(f"  expert: board {V['expert']}  (weighted domains {rec_x:.2f}; the printed row is 0.06 higher)  per domain {V['expertDomain']}")
assert V["best"] == 23.9 and abs(rec - 23.9) < 0.06 and V["expert"] == 82.2 and abs(rec_x - 82.2) < 0.07
assert V["bestDomain"]["banking"] == 5.9 and V["expertDomain"]["banking"] == 79.8
V["ceilingRatio"] = r1(V["expert"] / V["best"])
V["gapPoints"] = r1(V["expert"] - V["best"])
say(f"  expert / best = {V['ceilingRatio']} times ; gap {V['gapPoints']} points")
assert (V["ceilingRatio"], V["gapPoints"]) == (3.4, 58.3)
say(f"  banking is {w['banking']} of 53 tasks = {r1(100 * 35 / 53)} % of the weight")

# ---------------------------------------------------------------- 5. the client
say("\n== 5. the Client: messages from the builder to the simulated customer, over all logged tool calls")
V["calls"] = sum(b["calls_logged"] for b in builds.values())
V["asks"] = sum(b["client_questions"] for b in builds.values())
V["asksPct"] = round(100 * V["asks"] / V["calls"], 2)
say(f"  tool calls logged {V['calls']}  client messages {V['asks']}  = {V['asksPct']} % of calls  ({V['calls'] / V['asks']:.0f} calls per message)")
assert (V["calls"], V["asks"], V["asksPct"]) == (15885, 43, 0.27)
assert summ["client"]["logged_calls"] == 15885 and summ["client"]["questions"] == 43
wc = [b for b in builds.values() if b["has_client"]]
V["callsWithClient"] = sum(b["calls_logged"] for b in wc)
assert sum(b["client_questions"] for b in wc) == 43 and sum(b["client_questions"] for b in builds.values() if not b["has_client"]) == 0
say(f"  FINDING: {len(builds) - len(wc)} of the 53 builds had no simulated Client to ask; counting only the {len(wc)} that did: "
    f"43 in {V['callsWithClient']} calls = {round(100 * 43 / V['callsWithClient'], 2)} %  (the film uses the all-calls figure and says 'of all tool calls')")
assert (len(wc), V["callsWithClient"], round(100 * 43 / V["callsWithClient"], 2)) == (25, 7497, 0.57)

# ---------------------------------------------------------------- 6. claims.json
if "--check-claims" in sys.argv:
    say("\n== 6. claims.json: every formula evaluated, every value compared")
    with open(os.path.join(TOPIC, "claims.json")) as f:
        cj = json.load(f)
    scope = dict(cj["params"])
    scope.update(round=lambda x, n=0: (math.floor(x * 10 ** n + 0.5) / 10 ** n) if n else int(math.floor(x + 0.5)), sum=sum)
    bad = 0
    for c in cj["claims"]:
        if c.get("formula"):
            got = eval(c["formula"], {"__builtins__": {}}, scope)
            ok = abs(got - c["value"]) < 1e-9
        else:
            got, ok = c["value"], True
        scope[c["id"]] = c["value"]
        if not ok:
            bad += 1
        say(f"  {'ok ' if ok else 'BAD'} {c['id']:<16} {c['value']!s:>8}  {c.get('formula') or '(' + c['source'] + ')'}" + ("" if ok else f"  got {got}"))
    # the params must agree with the recomputation above
    chk = {"scenarios": V["scenarios"], "cells": V["cells"], "lit": V["lit"], "none": V["none"], "allsix": V["allsix"],
           "luckNone": V["luckNone"], "luckAll": V["luckAll"], "calls": V["calls"], "asks": V["asks"],
           "bankTasks": V["bankTasks"], "bankCubes": V["bankCubes"], "bankLit": V["bankLit"], "bankDarkTasks": V["bankDarkTasks"],
           "telLoLit": min(V["telBuildLit"]), "telHiLit": max(V["telBuildLit"])}
    for k, v in chk.items():
        if k in cj["params"] and cj["params"][k] != v:
            bad += 1
            say(f"  BAD param {k}: claims.json {cj['params'][k]} vs recomputed {v}")
    say(f"  {len(cj['claims'])} claims, {bad} problems")
    if bad:
        sys.exit(1)

# ---------------------------------------------------------------- 7. upstream copies
if "--verify-upstream" in sys.argv:
    say("\n== 7. copies against factory/topics/reliability-data/")
    for fn in FILES:
        a = open(os.path.join(HERE, fn), "rb").read()
        b = open(os.path.join(UP, fn), "rb").read()
        say(f"  {fn:<24} {'identical' if a == b else 'DIFFERENT'} ({len(a)} bytes)")
        assert a == b, fn
say("\nall asserts passed")
