#!/usr/bin/env python3
"""evolve_sequence.py · bounded GA over film.json knobs/captions for one clock window.

Pilot companion to docs/GA-STORYBOARD-REWARD.md. Uses existing build + gate; no new deps.

  python3 factory/tools/evolve_sequence.py score <film-dir> [--window t0,t1]
  python3 factory/tools/evolve_sequence.py evolve <film-dir> [--window t0,t1] [--population N]
      [--generations G] [--dry-run] [--evaluate]

Genomes live under <film-dir>/evolve/. Full evaluate rebuilds each individual (slow on WebGL).
"""
from __future__ import annotations

import argparse
import copy
import json
import math
import os
import random
import re
import subprocess
import sys
from typing import Any

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(TOOLS, "..", ".."))
BUILD = os.path.join(ROOT, "factory", "kit2", "build.py")
GATE = os.path.join(TOOLS, "gate.mjs")

TIMING_NAME = re.compile(
    r"(?i)(split|turn|reveal|mix|lit\d|dv\d|hl(Morph|Start)|count|pinRate|T\d*$|T0|T1|Pct|Dur|Step|turn\d|split\d)"
)
EVENT_KNOB = TIMING_NAME
TIME_WORDS = re.compile(r"(?i)\b(time|second|land|reveal|split|turn|mix|orbit|camera|fade|hold|before|after)\b")


def load_json(path: str) -> Any:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: Any) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def cap_times(film: dict) -> list[tuple[float, float, str]]:
    out = []
    for c in film.get("captions") or []:
        if isinstance(c, list):
            out.append((float(c[0]), float(c[1]), str(c[2])))
        else:
            out.append(
                (
                    float(c.get("t0", c.get("t", 0))),
                    float(c.get("t1", c.get("end", 0))),
                    str(c.get("text", c.get("s", ""))),
                )
            )
    return out


def knobs_doc_map(film: dict) -> dict[str, dict]:
    return {d["name"]: d for d in film.get("knobs_doc") or [] if "name" in d}


def findings_knobs(fdir: str) -> set[str]:
    names: set[str] = set()
    for fn in os.listdir(fdir):
        if fn.startswith("findings.r") and fn.endswith(".json"):
            data = load_json(os.path.join(fdir, fn))
            items = data if isinstance(data, list) else data.get("findings", [])
            for f in items:
                if isinstance(f, dict) and "knob" in f:
                    names.add(f["knob"])
    return names


def window_captions(film: dict, t0: float, t1: float) -> list[tuple[int, float, float, str]]:
    caps = []
    for i, (a, b, text) in enumerate(cap_times(film)):
        if b < t0 or a > t1:
            continue
        caps.append((i, a, b, text))
    return caps


def is_numeric_knob(val: Any) -> bool:
    if isinstance(val, bool):
        return False
    if isinstance(val, (int, float)):
        return True
    if isinstance(val, str):
        try:
            float(val)
            return True
        except ValueError:
            return False
    return False


def discover_timing_knobs(film: dict, fdir: str, t0: float, t1: float) -> list[str]:
    doc = knobs_doc_map(film)
    knobs = film.get("knobs") or {}
    priors = findings_knobs(fdir)
    selected: set[str] = set(priors)
    for name, meta in doc.items():
        if name not in knobs or not is_numeric_knob(knobs[name]):
            continue
        what = str(meta.get("what", ""))
        if TIMING_NAME.search(name) or TIME_WORDS.search(what):
            selected.add(name)
    dur = float(film.get("dur") or 120)
    for name, val in knobs.items():
        if not is_numeric_knob(val):
            continue
        v = float(val)
        if v < 0 or v > dur + 1:
            continue
        if t0 - 2 <= v <= t1 + 2 and EVENT_KNOB.search(name):
            selected.add(name)
    return sorted(k for k in selected if k in knobs and is_numeric_knob(knobs[k]))


def clamp_knob(name: str, val: float, doc: dict) -> float:
    meta = doc[name]
    lo, hi = meta["range"][0], meta["range"][1]
    step = meta.get("step")
    v = max(lo, min(hi, float(val)))
    if step and step > 0:
        v = round(round((v - lo) / step) * step + lo, 6)
    return v


def genome_from_film(fdir: str, window: tuple[float, float], label: str) -> dict:
    film = load_json(os.path.join(fdir, "film.json"))
    t0, t1 = window
    keys = discover_timing_knobs(film, fdir, t0, t1)
    knobs = film.get("knobs") or {}
    return {
        "schema": "ceti.sequence_genome/v0",
        "film": film.get("id", os.path.basename(fdir)),
        "window": [t0, t1],
        "seed": film.get("seed"),
        "baseline": os.path.relpath(os.path.join(fdir, "film.json"), ROOT),
        "genes": {"knobs": {k: knobs[k] for k in keys if k in knobs}, "captions": {}, "chapters": {}},
        "meta": {"parents": [label], "generation": 0},
    }


def row_score(status: str) -> float:
    if status == "PASS":
        return 1.0
    if status == "WARN":
        return 0.5
    return -math.inf


def fitness_from_gate(
    gate_path: str,
    genome: dict,
    baseline_knobs: dict[str, float],
    fdir: str,
    anchor_lambda: float = 0.05,
) -> tuple[float, dict]:
    detail: dict[str, Any] = {"gate": gate_path, "terms": {}}
    if not os.path.isfile(gate_path):
        detail["error"] = "missing gate.json"
        return -1e9, detail
    gate = load_json(gate_path)
    if not gate.get("pass", False):
        detail["terms"]["hard_fail"] = "gate.pass false"
        return -1e9, detail
    rows = gate.get("rows") or []
    g_sum = 0.0
    weights = {
        "G1": 5,
        "G2a": 10,
        "G2b": 10,
        "G2": 20,
        "G3": 15,
        "G4": 25,
        "G5": 35,
        "G6": 12,
        "G7": 20,
        "G11": 25,
        "G12": 8,
    }
    for r in rows:
        rid = r.get("id", "")
        st = r.get("status", "FAIL")
        sc = row_score(st)
        if sc == -math.inf:
            detail["terms"]["fail_row"] = rid
            return -1e9, detail
        w = weights.get(rid, 3)
        if rid.startswith("G2"):
            w = weights.get("G2a", 10)
        g_sum += w * sc
    detail["terms"]["gate_weighted"] = g_sum

    # anchor
    gk = genome.get("genes", {}).get("knobs") or {}
    anchor = 0.0
    for k in gk:
        if not is_numeric_knob(gk.get(k)) or not is_numeric_knob(baseline_knobs.get(k)):
            continue
        anchor += (float(gk[k]) - float(baseline_knobs[k])) ** 2
    detail["terms"]["anchor_penalty"] = anchor_lambda * anchor

    # findings alignment (soft): each finding once — knob landing vs its caption beat
    align = 0.0
    t0, t1 = genome["window"]
    film = load_json(os.path.join(fdir, "film.json"))
    all_caps = cap_times(film)
    tau = 0.35
    for fn in sorted(os.listdir(fdir)):
        if not (fn.startswith("findings.r") and fn.endswith(".json")):
            continue
        items = load_json(os.path.join(fdir, fn))
        if not isinstance(items, list):
            items = items.get("findings", [])
        for f in items:
            if not isinstance(f, dict) or "knob" not in f:
                continue
            k = f["knob"]
            if k not in gk or not is_numeric_knob(gk[k]) or not EVENT_KNOB.search(k):
                continue
            kt = float(gk[k])
            ft = float(f.get("t", kt))
            dur = float(film.get("dur") or 120)
            if not (t0 <= ft <= t1):
                continue
            # Only sync knobs whose value is a clock time near the cited moment (not sizes, rates, zoom).
            if not (0 <= kt <= dur and abs(kt - ft) <= 3.0):
                continue
            if "caption_index" in f:
                ci = int(f["caption_index"])
                if 0 <= ci < len(all_caps):
                    ct0 = all_caps[ci][0]
                else:
                    continue
            else:
                # caption whose start is closest to the finding time
                ct0 = min(all_caps, key=lambda c: abs(c[0] - ft))[0] if all_caps else ft
            slack = max(0.0, abs(ct0 - kt) - tau)
            align += slack * slack
    detail["terms"]["alignment_penalty"] = align

    seat_path = os.path.join(fdir, "seat.json")
    seat_term = 0.0
    if os.path.isfile(seat_path):
        seat = load_json(seat_path)
        craft = float(seat.get("craft") or 0)
        truth = seat.get("truth") or []
        ok = sum(1 for t in truth if isinstance(t, dict) and t.get("status") == "ok")
        defects = seat.get("defects") or []
        major = sum(1 for d in defects if isinstance(d, dict) and d.get("severity") == "major")
        seat_term = 2 * craft + ok - 3 * major
        detail["terms"]["seat"] = seat_term

    total = g_sum - detail["terms"]["anchor_penalty"] - 0.5 * align + 0.2 * seat_term
    detail["total"] = total
    return total, detail


def mutate_genome(genome: dict, film: dict, rng: random.Random) -> dict:
    out = copy.deepcopy(genome)
    doc = knobs_doc_map(film)
    knobs = out["genes"]["knobs"]
    if not knobs:
        return out
    key = rng.choice(list(knobs.keys()))
    meta = doc.get(key)
    if not meta:
        return out
    lo, hi = meta["range"][0], meta["range"][1]
    span = hi - lo
    step = meta.get("step") or max(0.1, span * 0.02)
    delta = rng.gauss(0, 1) * step
    knobs[key] = clamp_knob(key, knobs[key] + delta, doc)
    out["meta"]["generation"] = out["meta"].get("generation", 0) + 1
    out["meta"]["parents"] = [genome["meta"].get("parents", ["?"])[0], "mutate"]
    return out


def crossover(a: dict, b: dict, rng: random.Random) -> dict:
    out = copy.deepcopy(a)
    kb = b["genes"]["knobs"]
    for k, v in kb.items():
        if k in out["genes"]["knobs"] and rng.random() < 0.5:
            out["genes"]["knobs"][k] = v
    out["meta"]["generation"] = max(a["meta"].get("generation", 0), b["meta"].get("generation", 0)) + 1
    out["meta"]["parents"] = [
        a["meta"].get("parents", ["a"])[0],
        b["meta"].get("parents", ["b"])[0],
    ]
    return out


def apply_genome_to_film(film: dict, genome: dict) -> dict:
    film = copy.deepcopy(film)
    for k, v in (genome.get("genes", {}).get("knobs") or {}).items():
        if "knobs" in film:
            film["knobs"][k] = v
    return film


def gate_extra_flags(fdir: str, *, quick: bool = False) -> list[str]:
    """Match shipped gate era: legacy films without G11 need --overlap-warn to pass re-gate."""
    flags: list[str] = []
    gate_path = os.path.join(fdir, "gate.json")
    if os.path.isfile(gate_path):
        gate = load_json(gate_path)
        row_ids = {r.get("id") for r in gate.get("rows") or []}
        if "G11" not in row_ids:
            flags.append("--overlap-warn")
    if quick:
        flags.append("--quick")
    return flags


def recorded_look(fdir: str, film: dict) -> dict[str, str]:
    look = dict(film.get("look") or {})
    look.setdefault("brand", "film")
    look.setdefault("chrome", "tender-set")
    look.setdefault("material", "ink")
    pages = []
    import glob

    pages = sorted(
        glob.glob(os.path.join(fdir, "build", film["id"] + ".*.html")),
        key=os.path.getmtime,
        reverse=True,
    )
    for p in pages:
        with open(p, errors="replace", encoding="utf-8") as f:
            m = re.search(r'<meta\s+name="kit2"\s+content="([^"]*)"', f.read(8192))
        if m:
            kv = dict(x.split("=", 1) for x in m.group(1).split() if "=" in x)
            for key in ("brand", "chrome", "material"):
                if kv.get(key):
                    look[key] = kv[key]
            break
    return look  # type: ignore[return-value]


def evaluate_genome(
    fdir: str,
    genome: dict,
    run_dir: str,
    *,
    gate_quick: bool = True,
) -> tuple[float, dict]:
    """Build + gate a genome in run_dir (film.json copy)."""
    os.makedirs(run_dir, exist_ok=True)
    src_film = load_json(os.path.join(fdir, "film.json"))
    film = apply_genome_to_film(src_film, genome)
    film_path = os.path.join(run_dir, "film.json")
    save_json(film_path, film)
    for fn in ("film.js", "claims.json"):
        src = os.path.join(fdir, fn)
        if os.path.isfile(src):
            subprocess.run(["cp", src, os.path.join(run_dir, fn)], check=False)
    lib = os.path.join(fdir, "lib")
    if os.path.isdir(lib):
        subprocess.run(["cp", "-r", lib, run_dir], check=False)

    look = recorded_look(fdir, src_film)
    b = subprocess.run(
        [sys.executable, BUILD, run_dir, "--brand", look["brand"], "--chrome", look["chrome"], "--material", look["material"]],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    page = next((w for w in (b.stdout + b.stderr).split() if w.endswith(".html")), None)
    if not page or b.returncode != 0:
        return -1e9, {"error": "build failed", "log": (b.stdout + b.stderr)[-800:]}
    page_abs = page if os.path.isabs(page) else os.path.join(ROOT, page)
    gate_json = os.path.join(run_dir, "gate.json")
    kits = [
        os.path.join(ROOT, "factory", "kit2", "kit2.js"),
        os.path.join(ROOT, "factory", "kit2", "player.js"),
    ]
    gate_argv = (
        ["node", GATE, page_abs, "--film", run_dir, "--json", gate_json]
        + sum([["--kit", k] for k in kits], [])
        + gate_extra_flags(fdir, quick=gate_quick)
    )
    g = subprocess.run(
        gate_argv,
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    detail_gate_log = (g.stdout + g.stderr)[-1200:]
    baseline_knobs = (src_film.get("knobs") or {})
    score, detail = fitness_from_gate(gate_json, genome, baseline_knobs, fdir)
    detail["build_ok"] = b.returncode == 0
    detail["gate_exit"] = g.returncode
    detail["gate_argv"] = gate_argv
    if g.returncode != 0 and score <= -1e8:
        detail["gate_log_tail"] = detail_gate_log
    return score, detail


def seed_population(fdir: str, window: tuple[float, float]) -> list[dict]:
    pop: list[dict] = [genome_from_film(fdir, window, "shipped")]
    drafts = os.path.join(fdir, "drafts")
    for letter in ("a", "b", "c"):
        d = os.path.join(drafts, letter)
        if os.path.isfile(os.path.join(d, "film.json")):
            g = genome_from_film(d, window, f"draft-{letter}")
            g["film"] = load_json(os.path.join(fdir, "film.json")).get("id", g["film"])
            pop.append(g)
    priors = findings_knobs(fdir)
    if priors:
        shipped = copy.deepcopy(pop[0])
        film = load_json(os.path.join(fdir, "film.json"))
        for fn in sorted(os.listdir(fdir)):
            if not (fn.startswith("findings.r") and fn.endswith(".json")):
                continue
            items = load_json(os.path.join(fdir, fn))
            if not isinstance(items, list):
                items = items.get("findings", [])
            for f in items:
                if isinstance(f, dict) and "knob" in f and "proposed_value" in f:
                    k = f["knob"]
                    if k in shipped["genes"]["knobs"]:
                        try:
                            shipped["genes"]["knobs"][k] = float(f["proposed_value"])
                        except (TypeError, ValueError):
                            pass
        shipped["meta"]["parents"] = ["findings-aggregate"]
        pop.append(shipped)
    return pop


def cmd_score(args: argparse.Namespace) -> int:
    fdir = os.path.abspath(args.film_dir)
    t0, t1 = parse_window(args.window)
    genome = genome_from_film(fdir, (t0, t1), "shipped")
    gate_path = os.path.join(fdir, "gate.json")
    film = load_json(os.path.join(fdir, "film.json"))
    baseline = film.get("knobs") or {}
    score, detail = fitness_from_gate(gate_path, genome, baseline, fdir)
    out_dir = os.path.join(fdir, "evolve")
    save_json(os.path.join(out_dir, "score.json"), {"genome": genome, "fitness": score, "detail": detail})
    print("fitness %.2f  (gate %s)" % (score, gate_path))
    print(json.dumps(detail["terms"], indent=2))
    keys = genome["genes"]["knobs"]
    print("timing genes (%d): %s" % (len(keys), ", ".join(keys)))
    return 0


def cmd_evolve(args: argparse.Namespace) -> int:
    fdir = os.path.abspath(args.film_dir)
    t0, t1 = parse_window(args.window)
    rng = random.Random(args.seed)
    pop = seed_population(fdir, (t0, t1))
    if len(pop) > args.population:
        pop = pop[: args.population]
    film = load_json(os.path.join(fdir, "film.json"))
    baseline_knobs = film.get("knobs") or {}
    out_dir = os.path.join(fdir, "evolve")
    os.makedirs(out_dir, exist_ok=True)
    save_json(os.path.join(out_dir, "population.seed.json"), pop)

    best = pop[0]
    best_score = -1e9
    history = []

    gate_quick = not args.gate_full

    for gen in range(args.generations):
        scored: list[tuple[float, dict]] = []
        for i, g in enumerate(pop):
            if args.evaluate and not args.dry_run:
                run_dir = os.path.join(out_dir, "run-g%d-i%d" % (gen, i))
                sc, det = evaluate_genome(fdir, g, run_dir, gate_quick=gate_quick)
            else:
                sc, det = fitness_from_gate(os.path.join(fdir, "gate.json"), g, baseline_knobs, fdir)
            scored.append((sc, g))
            history.append({"gen": gen, "i": i, "fitness": sc, "detail": det, "genome": g})

        scored.sort(key=lambda x: x[0], reverse=True)
        if scored[0][0] > best_score:
            best_score, best = scored[0][0], copy.deepcopy(scored[0][1])

        if gen + 1 >= args.generations:
            break
        # next generation
        elite = [copy.deepcopy(scored[0][1])]
        children: list[dict] = []
        while len(elite) + len(children) < args.population:
            if len(scored) >= 2 and rng.random() < 0.4:
                pa, pb = rng.sample(scored[: max(2, len(scored))], 2)
                child = crossover(pa[1], pb[1], rng)
            else:
                child = mutate_genome(rng.choice(scored[: max(1, len(scored))])[1], film, rng)
            children.append(child)
        pop = elite + children

    save_json(os.path.join(out_dir, "history.json"), history)
    save_json(os.path.join(out_dir, "best.genome.json"), best)
    recipe = {
        "film": best["film"],
        "window": best["window"],
        "fitness": best_score,
        "knob_deltas": {
            k: best["genes"]["knobs"][k] - baseline_knobs.get(k, 0)
            for k in best["genes"]["knobs"]
        },
    }
    save_json(os.path.join(out_dir, "recipe.json"), recipe)
    print("best fitness %.2f  genes %d  wrote %s" % (best_score, len(best["genes"]["knobs"]), out_dir))
    if args.dry_run:
        print("(dry-run: fitness used shipped gate.json; no builds)")
    return 0


def parse_window(s: str) -> tuple[float, float]:
    a, b = s.split(",")
    return float(a.strip()), float(b.strip())


def main() -> int:
    p = argparse.ArgumentParser(description="Bounded GA pilot for storyboard sequences")
    sub = p.add_subparsers(dest="cmd", required=True)

    ps = sub.add_parser("score", help="score shipped film gate for a window")
    ps.add_argument("film_dir")
    ps.add_argument("--window", default="36,58")

    pe = sub.add_parser("evolve", help="run a small GA")
    pe.add_argument("film_dir")
    pe.add_argument("--window", default="36,58")
    pe.add_argument("--population", type=int, default=6)
    pe.add_argument("--generations", type=int, default=2)
    pe.add_argument("--seed", type=int, default=1973)
    pe.add_argument("--dry-run", action="store_true", help="mutate only; score against existing gate.json")
    pe.add_argument("--evaluate", action="store_true", help="build+gate each individual (slow)")
    pe.add_argument(
        "--gate-full",
        action="store_true",
        help="gate with full overlap sampling (default: --quick during --evaluate)",
    )

    args = p.parse_args()
    if args.cmd == "score":
        return cmd_score(args)
    return cmd_evolve(args)


if __name__ == "__main__":
    sys.exit(main())
