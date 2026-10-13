#!/usr/bin/env python3
"""matrix.py: the kit2 proof. Rebuild films under brands × chromes with zero film edits, gate every cell,
shoot two stills per cell (the count beat and the brand card) and write a contact sheet per film.

    python3 factory/kit2/proof/matrix.py [--films a,b] [--brands a,b] [--chromes a,b] [--material ink]
                                         [--no-gate] [--jobs 4]

Outputs (all under factory/kit2/proof/): build/<id>.<brand>.<chrome>.html, stills/, gate/<cell>.json,
<film>-matrix.png, results.json. The film folders are only read (film.js/film.json/claims.json hashes are
recorded before and after so PROOF.md can show they did not move).
"""
import hashlib, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
KIT2 = os.path.dirname(HERE)
ROOT = os.path.abspath(os.path.join(KIT2, "..", ".."))
FILMS = os.path.join(ROOT, "factory", "films")


def opt(k, d):
    a = sys.argv[1:]
    return a[a.index(k) + 1] if k in a else d


films = opt("--films", "survivorship,goodhart").split(",")
brands = opt("--brands", "ceti-dark,tender-set,swiss-grid,neon-lab").split(",")
chromes = opt("--chromes", "tender-set,ledger,memo,none").split(",")
material = opt("--material", "ink")
jobs = int(opt("--jobs", "4"))
gate = "--no-gate" not in sys.argv
for d in ("build", "stills", "gate"):
    os.makedirs(os.path.join(HERE, d), exist_ok=True)


def fhash(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()[:16]


def src_hashes(f):
    return {n: fhash(os.path.join(FILMS, f, n)) for n in ("film.js", "film.json", "claims.json")}


before = {f: src_hashes(f) for f in films}
cells = []
for f in films:
    for b in brands:
        for c in chromes:
            name = "%s.%s.%s%s" % (f, b, c, "" if material == "ink" else "." + material)
            out = os.path.join(HERE, "build", name + ".html")
            r = subprocess.run([sys.executable, os.path.join(KIT2, "build.py"), os.path.join(FILMS, f), "--brand", b,
                                "--chrome", c, "--material", material, "--out", out], capture_output=True, text=True)
            if r.returncode:
                print("BUILD FAIL", name, r.stderr.strip())
                cells.append({"film": f, "brand": b, "chrome": c, "name": name, "build": "FAIL: " + r.stderr.strip()})
                continue
            line = [l for l in r.stdout.splitlines() if "sha256" in l][0]
            cells.append({"film": f, "brand": b, "chrome": c, "name": name, "page": out, "build": "ok",
                          "bytes": int(line.split()[1]), "sha256": line.split("sha256 ")[1][:12],
                          "contrast": [l for l in r.stdout.splitlines() if l.startswith("contrast")][0]})
print("built", sum(1 for c in cells if c["build"] == "ok"), "of", len(cells))

# stills: count beat (count.at + 19) and the brand card (dur - 1)
for f in films:
    fj = json.load(open(os.path.join(FILMS, f, "film.json")))
    tc, tb = fj.get("count", {}).get("at", 36) + 19, fj["dur"] - 1
    pages = [c["page"] for c in cells if c["film"] == f and c["build"] == "ok"]
    r = subprocess.run(["node", os.path.join(HERE, "stills.mjs"), os.path.join(HERE, "stills"), "%g,%g" % (tc, tb)] + pages,
                       capture_output=True, text=True)
    for l in r.stdout.splitlines():
        n, js = l.split(" ", 1)
        for c in cells:
            if c["name"] == n:
                c["stills"] = json.loads(js); c["t_count"], c["t_brand"] = tc, tb
    if r.returncode:
        print(r.stderr[-2000:])

# contact sheet per film: rows = brands, columns = chromes, each cell = count still | brand still
try:
    from PIL import Image, ImageDraw
    CW, CH, PAD, HEAD, LAB = 384, 216, 10, 40, 120
    for f in films:
        Wd = LAB + len(chromes) * (2 * CW + 3 * PAD)
        Ht = HEAD + len(brands) * (CH + 2 * PAD)
        sheet = Image.new("RGB", (Wd, Ht), (40, 40, 40))
        d = ImageDraw.Draw(sheet)
        for j, c in enumerate(chromes):
            d.text((LAB + j * (2 * CW + 3 * PAD) + PAD, 14), "chrome: %s   (count beat | brand card)" % c, fill=(235, 235, 235))
        for i, b in enumerate(brands):
            y = HEAD + i * (CH + 2 * PAD) + PAD
            d.text((8, y + CH // 2 - 6), b, fill=(235, 235, 235))
            for j, c in enumerate(chromes):
                cell = next((x for x in cells if x["film"] == f and x["brand"] == b and x["chrome"] == c), None)
                if not cell or "t_count" not in cell:
                    continue
                for k, t in enumerate((cell["t_count"], cell["t_brand"])):
                    p = os.path.join(HERE, "stills", "%s.t%g.png" % (cell["name"], t))
                    if os.path.isfile(p):
                        im = Image.open(p).convert("RGB").resize((CW, CH), Image.LANCZOS)
                        sheet.paste(im, (LAB + j * (2 * CW + 3 * PAD) + PAD + k * (CW + PAD), y))
        sheet.save(os.path.join(HERE, "%s-matrix.png" % f))
        print("wrote", os.path.join("factory/kit2/proof", "%s-matrix.png" % f))
except ImportError:
    print("Pillow missing: no contact sheet")


def run_gate(c):
    if c["build"] != "ok":
        return c
    js = os.path.join(HERE, "gate", c["name"] + ".json")
    chrome_js = os.path.join(KIT2, "chromes", c["chrome"] + ".js")
    if not os.path.isfile(chrome_js):
        chrome_js = os.path.join(ROOT, "factory", "chromes", c["chrome"] + ".js")
    drawn = os.path.join(ROOT, "arsenal", "materials", "drawn", "materials.js")
    kits = [os.path.join(KIT2, "kit2.js"), os.path.join(KIT2, "player.js"), drawn if os.path.isfile(drawn) else os.path.join(KIT2, "materials", "basic.js")]
    if c["chrome"] != "none":
        kits.append(chrome_js)
    cmd = ["node", os.path.join(ROOT, "factory", "tools", "gate.mjs"), c["page"], "--film", os.path.join(FILMS, c["film"]), "--json", js]
    for k in kits:
        cmd += ["--kit", k]
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        g = json.load(open(js))
        c["gate"] = {"pass": g["pass"], "rows": {x["id"]: x["status"] for x in g["rows"]},
                     "fails": [x["id"] + ": " + x["evidence"][:200] for x in g["rows"] if x["status"] == "FAIL"],
                     "g5c": next((x["evidence"][:160] for x in g["rows"] if x["id"] == "G5c"), "")}
    except Exception as e:
        c["gate"] = {"pass": False, "error": "%s; exit %d; %s" % (e, r.returncode, (r.stderr or r.stdout)[-400:])}
    print("gate", c["name"], "PASS" if c["gate"].get("pass") else "FAIL", c["gate"].get("fails", c["gate"].get("error", "")))
    return c


if gate:
    with ThreadPoolExecutor(jobs) as ex:
        cells = list(ex.map(run_gate, cells))

after = {f: src_hashes(f) for f in films}
res = {"films": films, "brands": brands, "chromes": chromes, "material": material, "sources_before": before,
       "sources_after": after, "sources_unchanged": before == after, "cells": cells}
json.dump(res, open(os.path.join(HERE, "results.json"), "w"), indent=1, sort_keys=True)
print("sources unchanged:", before == after)
