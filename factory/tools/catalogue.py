#!/usr/bin/env python3
"""catalogue.py: the factory's catalogue of films, rebuilt from what is on disk.

    python3 factory/tools/catalogue.py [--check] [--root DIR]

Scans factory/films/*/film.json, each film's gate verdict (factory/films/<id>/gate.json, written by
`node factory/tools/gate.mjs ... --json factory/films/<id>/gate.json`) and, when the film has been built, its page
(factory/films/<id>/build/<id>.html, else the only .html in build/). Writes:

    factory/catalogue.json   schema factory-catalogue/1 (factory/catalogue.schema.json); sorted by id, no timestamps,
                             so it changes only when a film, a verdict or a page changes
    factory/CATALOGUE.md     the same as a table: id, title, duration, gate verdict, sha256 of the built page

--check writes nothing: it exits 1 when a rebuilt page's sha256 differs from the one recorded in catalogue.json
(the baseline), or when a recorded film is missing. Films with no build/ on disk are skipped, not failed.
"""
import argparse, glob, hashlib, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
try:
    from paths import ceti_root  # noqa: E402
except ImportError:  # pragma: no cover
    ceti_root = None

SCHEMA = "factory-catalogue/1"


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def verdict_of(gate):
    """The gate's verdict as PASS / FAIL / a string the gate chose; None when there is no gate JSON.
    The exact gate.json fields are the gate builder's (factory/tools/gate.mjs); several spellings are read."""
    if gate is None:
        return None
    if not isinstance(gate, dict):
        return "UNREADABLE"
    for k in ("verdict", "status", "result"):
        v = gate.get(k)
        if isinstance(v, str) and v:
            return v.upper()
    for k in ("pass", "ok", "passed"):
        if isinstance(gate.get(k), bool):
            return "PASS" if gate[k] else "FAIL"
    return "UNKNOWN"


def gate_counts(gate):
    """(failed, total) rows when the gate reports a list of checks; else None."""
    if not isinstance(gate, dict):
        return None
    rows = gate.get("checks") or gate.get("rows") or gate.get("results")
    if isinstance(rows, dict):
        rows = list(rows.values())
    if not isinstance(rows, list) or not rows:
        return None
    def failed(r):
        if not isinstance(r, dict):
            return False
        v = r.get("verdict", r.get("status", r.get("pass", r.get("ok"))))
        return v is False or (isinstance(v, str) and v.upper() in ("FAIL", "FAILED", "VETO"))
    return [sum(1 for r in rows if failed(r)), len(rows)]


def page_of(film_dir, fid):
    b = os.path.join(film_dir, "build")
    if not os.path.isdir(b):
        return None
    p = os.path.join(b, fid + ".html")
    if not os.path.isfile(p):
        cands = sorted(glob.glob(os.path.join(b, "*.html")))
        if len(cands) != 1:
            return None
        p = cands[0]
    with open(p, "rb") as f:
        data = f.read()
    return p, len(data), hashlib.sha256(data).hexdigest()


def count_claims(path):
    c = load(path)
    if isinstance(c, dict) and isinstance(c.get("claims"), list):
        return len(c["claims"])
    if isinstance(c, list):
        return len(c)
    return None


def scan(root):
    films = []
    for fj in sorted(glob.glob(os.path.join(root, "factory", "films", "*", "film.json"))):
        d = os.path.dirname(fj)
        fid_dir = os.path.basename(d)
        film = load(fj)
        if not isinstance(film, dict):
            films.append({"id": fid_dir, "title": None, "error": "film.json unreadable"})
            continue
        fid = film.get("id") or fid_dir
        gpath = os.path.join(d, "gate.json")
        gate = load(gpath) if os.path.isfile(gpath) else None
        page = page_of(d, fid)
        brand = film.get("brand") if isinstance(film.get("brand"), dict) else {}
        e = {
            "id": fid,
            "title": film.get("title"),
            "eyebrow": film.get("eyebrow"),
            "dur": film.get("dur"),
            "chapters": len(film.get("chapters") or []),
            "captions": len(film.get("captions") or []),
            "sources": len(film.get("sources") or []),
            "claims": count_claims(os.path.join(d, "claims.json")),
            "takeaway": brand.get("takeaway"),
            "folder": os.path.relpath(d, root),
            "gate": None if gate is None else {"verdict": verdict_of(gate), "file": os.path.relpath(gpath, root),
                                                "failed_of_total": gate_counts(gate)},
            "page": None if page is None else {"path": os.path.relpath(page[0], root), "bytes": page[1], "sha256": page[2]},
        }
        if fid != fid_dir:
            e["warning"] = "film.json id %r differs from its folder %r" % (fid, fid_dir)
        films.append(e)
    return {"schema": SCHEMA, "generated_by": "factory/tools/catalogue.py", "films": films}


def fmt_dur(s):
    if not isinstance(s, (int, float)):
        return "?"
    return "%d:%02d" % (int(s) // 60, int(round(s)) % 60)


def markdown(cat):
    lines = ["# Catalogue", "",
             "Generated by `python3 factory/tools/catalogue.py` from factory/films/*/film.json, each film's gate.json and,",
             "when built, its page. Do not edit by hand. The sha256 is the baseline a rebuild must match",
             "(`python3 factory/tools/catalogue.py --check`).", "",
             "| id | title | duration | gate verdict | page sha256 |",
             "|----|-------|---------:|--------------|-------------|"]
    for f in cat["films"]:
        g = f.get("gate") or {}
        v = g.get("verdict") or "not gated"
        if g.get("failed_of_total") and g["failed_of_total"][0]:
            v += " (%d of %d rows flagged)" % tuple(g["failed_of_total"])
        p = f.get("page")
        sha = "`%s` (%s bytes)" % (p["sha256"], format(p["bytes"], ",")) if p else "not built"
        title = (f.get("title") or "?").replace("|", "\\|")
        lines.append("| %s | %s | %s | %s | %s |" % (f["id"], title, fmt_dur(f.get("dur")), v, sha))
    if not cat["films"]:
        lines.append("| | no films yet | | | |")
    return "\n".join(lines) + "\n"


def check(root, cat):
    old = load(os.path.join(root, "factory", "catalogue.json"))
    if not isinstance(old, dict):
        print("no factory/catalogue.json to check against")
        return 1
    now = {f["id"]: f for f in cat["films"]}
    bad = 0
    for f in old.get("films", []):
        n = now.get(f["id"])
        if n is None:
            print("MISSING  %s (recorded, no film.json now)" % f["id"]); bad += 1; continue
        if not f.get("page"):
            continue
        if not n.get("page"):
            print("SKIP     %s (recorded page, not built here)" % f["id"]); continue
        if n["page"]["sha256"] != f["page"]["sha256"]:
            print("MOVED    %s  recorded %s  rebuilt %s" % (f["id"], f["page"]["sha256"][:16], n["page"]["sha256"][:16])); bad += 1
        else:
            print("SAME     %s  %s" % (f["id"], f["page"]["sha256"][:16]))
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser(description="Write factory/catalogue.json and factory/CATALOGUE.md from factory/films/.")
    ap.add_argument("--check", action="store_true", help="compare rebuilt pages with the recorded sha256; write nothing")
    ap.add_argument("--root", help="plugin root (default: found from this file)")
    a = ap.parse_args()
    root = os.path.abspath(a.root) if a.root else ((ceti_root and ceti_root(HERE)) or os.path.abspath(os.path.join(HERE, "..", "..")))
    cat = scan(root)
    if a.check:
        sys.exit(check(root, cat))
    out = os.path.join(root, "factory")
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "catalogue.json"), "w") as f:
        f.write(json.dumps(cat, indent=1, ensure_ascii=False) + "\n")
    with open(os.path.join(out, "CATALOGUE.md"), "w") as f:
        f.write(markdown(cat))
    print("catalogue: %d film(s) -> factory/catalogue.json, factory/CATALOGUE.md" % len(cat["films"]))
    for e in cat["films"]:
        print("  %-24s %-6s %-10s %s" % (e["id"], fmt_dur(e.get("dur")), (e.get("gate") or {}).get("verdict") or "-",
                                         (e.get("page") or {}).get("sha256", "not built")[:16]))


if __name__ == "__main__":
    main()
