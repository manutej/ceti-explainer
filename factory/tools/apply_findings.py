#!/usr/bin/env python3
"""apply_findings.py: apply an evaluator's findings to a film inside the pipeline's allowed scope, rebuild, re-gate,
re-strip (factory/PIPELINE.md stage 4).

    python3 factory/tools/apply_findings.py <film-dir> <findings.json> [--dry-run] [--every 0.5] [--no-frames]

findings.json is a list (or {"findings": [...]}) of
    {t, frame, what, severity, why, <target>, proposed_value}
with exactly one target:
    "knob": name             proposed_value: a number inside knobs_doc[name].range, or one of its options
    "caption_index": i       proposed_value: the new caption text (<= 60 chars; every number in it is a claim value in
                             claims.json, or was already in that caption); timing is unchanged
    "chapter_index": i | "chapter": id
                             proposed_value: the chapter's new t0, within 2 s of the old one and strictly between its
                             neighbours' t0; the previous chapter's t1 follows when it equalled the old t0
    "brand": true | "chrome": true
                             proposed_value: a pack id in arsenal/brands/<id>.json ('film' allowed) / a chrome id in
                             factory/kit2/chromes or factory/chromes ('none' allowed); recorded in film.json look
Anything else (film.js, claims.json, beat order, a number on screen) is out of scope and rejected. A second finding on a
target already changed in this run is rejected (conflict).

Writes film.json (allowed edits only, plus film.json look = the brand/chrome/material it builds with: the recorded
look, else the newest build's <meta name="kit2">, else the kit2 defaults), <findings>.report.json (applied / rejected
with reasons), then runs kit2/build.py, gate.mjs (--json <film-dir>/gate.json) and frames.mjs (--out
<film-dir>/frames). Exit 1 if the gate FAILs after applying (or the build fails); 0 otherwise. --dry-run validates and
writes the report only.
"""
import glob, json, os, re, subprocess, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(TOOLS, "..", ".."))
BUILD = os.path.join(ROOT, "factory", "kit2", "build.py")
GATE = os.path.join(TOOLS, "gate.mjs")
FRAMES = os.path.join(TOOLS, "frames.mjs")
CAP_MAX = 60
SHIFT_MAX = 2.0
NUM_RX = re.compile(r"(?<![\w.])[$£€]?\d{1,3}(?:,\d{3})+(?:\.\d+)?|(?<![\w.:])[$£€]?\d+(?:\.\d+)?")


def die(msg, code=2):
    print("apply_findings.py: " + msg, file=sys.stderr)
    sys.exit(code)


def load(p):
    with open(p) as f:
        return json.load(f)


def numbers(s, renders):
    """the gate's G5 reading of a caption: numbers outside claim renders and clock times."""
    for r in renders:
        if r:
            s = s.replace(r, " ")
    s = re.sub(r"\b\d{1,2}:\d{2}\b", " ", s)
    out = []
    for m in NUM_RX.finditer(s):
        raw = m.group(0)
        v = float(re.sub(r"[$£€,]", "", raw))
        dec = len(raw.split(".")[1]) if "." in raw else 0
        out.append((raw, v, dec))
    return out


def covered(n, vals):
    _, v, dec = n
    tol = 0.5 * 10 ** -dec + 1e-9
    return any(abs(v - x) <= tol or abs(v - x * 100) <= tol or abs(v - x / 1e6) <= tol or abs(v - x / 1e3) <= tol
               for x in map(abs, vals))


def cap_text(c):
    return str(c[2]) if isinstance(c, list) else str(c.get("text", c.get("s", "")))


def set_cap_text(c, s):
    if isinstance(c, list):
        c[2] = s
    else:
        c["text" if "text" in c or "s" not in c else "s"] = s


def chrome_exists(cid):
    return cid == "none" or any(os.path.isfile(os.path.join(ROOT, d, cid + ".js")) for d in ("factory/kit2/chromes", "factory/chromes"))


def brand_exists(bid):
    return bid == "film" or os.path.isfile(os.path.join(ROOT, "arsenal", "brands", bid + ".json"))


def recorded_look(fdir, film):
    look = dict(film.get("look") or {})
    if not look.get("brand") or not look.get("chrome"):
        pages = sorted(glob.glob(os.path.join(fdir, "build", film["id"] + ".*.html")), key=os.path.getmtime, reverse=True)
        for p in pages:
            with open(p, errors="replace") as f:
                m = re.search(r'<meta\s+name="kit2"\s+content="([^"]*)"', f.read(8192))
            if m:
                kv = dict(x.split("=", 1) for x in m.group(1).split() if "=" in x)
                for k in ("brand", "chrome", "material"):
                    if kv.get(k) and not look.get(k):
                        look[k] = kv[k]
                break
    look.setdefault("brand", "film")
    look.setdefault("chrome", "tender-set")
    look.setdefault("material", "ink")
    return look


def validate(f, film, claims, changed):
    """→ (target key, apply function) or raises ValueError(reason)."""
    if not isinstance(f, dict):
        raise ValueError("not an object")
    targets = [k for k in ("knob", "caption_index", "chapter_index", "chapter", "brand", "chrome") if k in f]
    if len(targets) != 1:
        raise ValueError("needs exactly one target of knob | caption_index | chapter_index | chapter | brand | chrome "
                         "(got %s); film.js, claims.json, beat order and on-screen numbers are out of scope" % (targets or "none"))
    tk = targets[0]
    if "proposed_value" not in f:
        raise ValueError("no proposed_value")
    v = f["proposed_value"]

    if tk == "knob":
        name = f["knob"]
        doc = {d.get("name"): d for d in film.get("knobs_doc") or []}
        if name not in doc:
            raise ValueError("knob %r is not in knobs_doc (%s)" % (name, ", ".join(sorted(doc)) or "film has no knobs"))
        d, key = doc[name], "knob:" + name
        if "range" in d:
            lo, hi = d["range"]
            if not isinstance(v, (int, float)) or isinstance(v, bool):
                raise ValueError("knob %s wants a number in [%s, %s], got %r" % (name, lo, hi, v))
            if not lo <= v <= hi:
                raise ValueError("knob %s = %r is outside its range [%s, %s]" % (name, v, lo, hi))
        elif "options" in d:
            if v not in d["options"]:
                raise ValueError("knob %s = %r is not one of %s" % (name, v, d["options"]))
        else:
            raise ValueError("knobs_doc %s has no range or options" % name)
        old = (film.get("knobs") or {}).get(name)
        return key, old, lambda: film.setdefault("knobs", {}).__setitem__(name, v)

    if tk == "caption_index":
        i = f["caption_index"]
        caps = film.get("captions") or []
        if not isinstance(i, int) or isinstance(i, bool) or not 0 <= i < len(caps):
            raise ValueError("caption_index %r does not exist (0..%d)" % (i, len(caps) - 1))
        if not isinstance(v, str) or not v.strip():
            raise ValueError("caption text must be a non-empty string")
        v = re.sub(r"\s+", " ", v).strip()
        if len(v) > CAP_MAX:
            raise ValueError("caption is %d chars (max %d)" % (len(v), CAP_MAX))
        renders = [r for c in claims for r in ([c.get("render")] if isinstance(c.get("render"), str) else []) + list(c.get("renders") or [])]
        vals = [float(c["value"]) for c in claims if isinstance(c.get("value"), (int, float)) and not isinstance(c.get("value"), bool)]
        old_raw = {n[0] for n in numbers(cap_text(caps[i]), renders)}
        bad = [n[0] for n in numbers(v, renders) if not covered(n, vals) and n[0] not in old_raw]
        if bad:
            raise ValueError("caption introduces number(s) %s that are not claim values in claims.json" % ", ".join(bad))
        old = cap_text(caps[i])
        return "caption:%d" % i, old, lambda: set_cap_text(caps[i], v)

    if tk in ("chapter_index", "chapter"):
        chs = film.get("chapters") or []
        if tk == "chapter":
            idx = next((j for j, c in enumerate(chs) if c.get("id") == f["chapter"]), None)
            if idx is None:
                raise ValueError("no chapter with id %r" % f["chapter"])
        else:
            idx = f["chapter_index"]
            if not isinstance(idx, int) or isinstance(idx, bool) or not 0 <= idx < len(chs):
                raise ValueError("chapter_index %r does not exist (0..%d)" % (idx, len(chs) - 1))
        c = chs[idx]
        old = float(c.get("t0", 0))
        if not isinstance(v, (int, float)) or isinstance(v, bool):
            raise ValueError("chapter proposed_value is the new t0 in seconds, got %r" % (v,))
        if abs(v - old) > SHIFT_MAX + 1e-9:
            raise ValueError("chapter %s shift %+.2f s exceeds %.0f s" % (c.get("id"), v - old, SHIFT_MAX))
        lo = float(chs[idx - 1].get("t0", 0)) if idx > 0 else 0.0
        hi = float(chs[idx + 1].get("t0", 0)) if idx + 1 < len(chs) else float(film.get("dur", 1e9))
        if idx == 0 and v != old:
            raise ValueError("the first chapter starts the film; its t0 does not move")
        if not lo < v < hi:
            raise ValueError("chapter %s t0 %.2f must stay strictly between %.2f and %.2f (beat order)" % (c.get("id"), v, lo, hi))

        def ap():
            if idx > 0 and float(chs[idx - 1].get("t1", -1)) == old:
                chs[idx - 1]["t1"] = v
            c["t0"] = v
        return "chapter:%d" % idx, old, ap

    if tk == "brand":
        if not isinstance(v, str) or not brand_exists(v):
            raise ValueError("brand %r has no pack in arsenal/brands" % (v,))
        return "look:brand", None, lambda: film.setdefault("look", {}).__setitem__("brand", v)
    if tk == "chrome":
        if not isinstance(v, str) or not chrome_exists(v):
            raise ValueError("chrome %r is not in factory/kit2/chromes or factory/chromes" % (v,))
        return "look:chrome", None, lambda: film.setdefault("look", {}).__setitem__("chrome", v)
    raise ValueError("unknown target")


def run(cmd):
    print("$ " + " ".join(os.path.relpath(c, ROOT) if os.path.isabs(c) and c.startswith(ROOT) else c for c in cmd), flush=True)
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    sys.stdout.write(r.stdout)
    sys.stderr.write(r.stderr)
    return r


def main():
    args = sys.argv[1:]
    if len(args) < 2 or args[0].startswith("-"):
        die("usage: apply_findings.py <film-dir> <findings.json> [--dry-run] [--every 0.5] [--no-frames]")
    fdir = os.path.abspath(args[0])
    fp = args[1] if os.path.isfile(args[1]) else os.path.join(fdir, args[1])
    if not os.path.isfile(fp):
        die("no findings file %s" % args[1])
    every = args[args.index("--every") + 1] if "--every" in args else "0.5"
    fjp = os.path.join(fdir, "film.json")
    film = load(fjp)
    cr = load(os.path.join(fdir, "claims.json"))
    claims = cr if isinstance(cr, list) else cr.get("claims", [])
    data = load(fp)
    findings = data if isinstance(data, list) else data.get("findings", [])
    look = recorded_look(fdir, film)

    changed, applied, rejected, todo = set(), [], [], []
    for n, f in enumerate(findings):
        try:
            key, old, ap = validate(f, film, claims, changed)
            if key in changed:
                raise ValueError("conflict: %s was already changed by an earlier finding in this file" % key)
            changed.add(key)
            todo.append(ap)
            applied.append({"n": n, "target": key, "old": old, "new": f["proposed_value"], "finding": f})
        except ValueError as e:
            rejected.append({"n": n, "reason": str(e), "finding": f})
    for ap in todo:
        ap()
    look = dict(look, **(film.get("look") or {}))
    film["look"] = {k: look[k] for k in ("brand", "chrome", "material")}

    report = {"film": film.get("id"), "findings": os.path.relpath(fp, ROOT), "applied": applied, "rejected": rejected,
              "look": film["look"], "dry_run": "--dry-run" in args}
    rp = re.sub(r"\.json$", "", fp) + ".report.json"
    print("findings %s: %d applied, %d rejected" % (os.path.basename(fp), len(applied), len(rejected)))
    for a in applied:
        print("  APPLIED  #%d %s: %r -> %r" % (a["n"], a["target"], a["old"], a["new"]))
    for r in rejected:
        print("  REJECTED #%d %s" % (r["n"], r["reason"]))
    if "--dry-run" in args:
        with open(rp, "w") as f:
            json.dump(report, f, indent=1, ensure_ascii=False)
        print("dry run: film.json not written; report " + os.path.relpath(rp, ROOT))
        return 0

    # keep the file's own formatting: a compact film.json (one line, written to fit the G8 budget) stays compact
    compact = os.path.exists(fjp) and open(fjp).read().count("\n") <= 2
    with open(fjp, "w") as f:
        f.write((json.dumps(film, ensure_ascii=False, separators=(",", ":")) if compact
                 else json.dumps(film, indent=1, ensure_ascii=False)) + "\n")
    L = film["look"]
    b = run([sys.executable, BUILD, fdir, "--brand", L["brand"], "--chrome", L["chrome"], "--material", L["material"]])
    page = None
    if b.returncode == 0 and b.stdout.strip():
        # the page is the first token that names a built .html (build.py prints notes before and after it)
        tok = next((w for w in b.stdout.split() if w.endswith(".html")), None)
        page = os.path.join(ROOT, tok) if tok else None
    report["build"] = {"ok": b.returncode == 0, "page": os.path.relpath(page, ROOT) if page else None, "log": (b.stdout + b.stderr).strip()[-2000:]}
    gate_ok = False
    if page:
        kits = [os.path.join(ROOT, "factory", "kit2", "kit2.js"), os.path.join(ROOT, "factory", "kit2", "player.js")]
        for d in ("factory/kit2/chromes", "factory/chromes"):
            cp = os.path.join(ROOT, d, L["chrome"] + ".js")
            if os.path.isfile(cp):
                kits.append(cp)
                break
        g = run(["node", GATE, page, "--film", fdir, "--json", os.path.join(fdir, "gate.json")] + sum([["--kit", k] for k in kits], []))
        gate_ok = g.returncode == 0
        m = re.search(r"VERDICT\s+(\w+)(.*)", g.stdout)
        report["gate"] = {"pass": gate_ok, "verdict": (m.group(1) + m.group(2)).strip() if m else None, "json": os.path.relpath(os.path.join(fdir, "gate.json"), ROOT),
                          "log": (g.stdout + g.stderr).strip()[-1200:]}
        if not m:
            print("gate produced no VERDICT; tail of its output:\n" + (g.stdout + g.stderr).strip()[-600:])
        if "--no-frames" not in args:
            fr = run(["node", FRAMES, page, "--every", every, "--out", os.path.join(fdir, "frames")])
            report["frames"] = {"ok": fr.returncode == 0, "log": fr.stdout.strip()[-500:]}
    with open(rp, "w") as f:
        json.dump(report, f, indent=1, ensure_ascii=False)
    print("report " + os.path.relpath(rp, ROOT) + "; gate " + ("PASS" if gate_ok else "FAIL"))
    return 0 if gate_ok else 1


if __name__ == "__main__":
    sys.exit(main())
