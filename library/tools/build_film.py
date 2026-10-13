#!/usr/bin/env python3
"""
build_film.py — compose a film from the module library and package it with the runtime's build.py.

    python3 tools/build_film.py GRAPH.json MATERIAL --id ID --title TITLE --out DIR [--check]

1. runs check.mjs on the graph (+ material) first and stops on a hard-law failure (--check, default on);
2. writes DIR/src/ID.film.js = {id, title} + the graph JSON + AM.compose(graph, MATERIAL, film);
3. calls runtime/build.py with --kit (core, laws, the material's vendored kernel + adapter, pedagogy, cameras,
   compose) and --fonts (parsed from the material's `fonts:` table; files live in modules/fonts/).
Nothing under chromes/ or runtime/ is modified.
"""
import argparse, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MOD = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
try:
    from paths import ceti_root  # <root>/scripts/paths.py: $CETI_ROOT, else walk up to .claude-plugin/plugin.json
except ImportError:
    ceti_root = lambda start=None: None
finally:
    sys.path.pop(0)
ROOT = ceti_root(HERE)
if ROOT and not os.path.exists(os.path.join(MOD, "core", "am.js")):
    # merged layout: <root>/library/{operad,materials,modules,cameras,tools}, runtime tools in <root>/runtime/tools,
    # fonts in <root>/vendor/fonts. Logical paths (core/, pedagogy/, camera/, compose.js) map onto it.
    RT = os.path.join(ROOT, "runtime", "tools")
    FONTS = os.path.join(ROOT, "vendor", "fonts")
    _MAP = {"core/": "operad/", "pedagogy/": "modules/", "camera/": "cameras/", "compose.js": "operad/compose.js",
            "check.mjs": "operad/check.mjs"}
else:  # original layout: <atelier>/modules/tools/build_film.py, runtime at <atelier>/runtime, fonts in modules/fonts
    RT = os.path.abspath(os.path.join(MOD, "..", "runtime"))
    FONTS = os.path.join(MOD, "fonts")
    _MAP = {}


def lib(p):
    """Logical library path (as in the original modules/ layout) → file on disk."""
    for a, b in _MAP.items():
        if p == a or (a.endswith("/") and p.startswith(a)):
            return os.path.join(MOD, b + p[len(a):])
    return os.path.join(MOD, p)


KERNEL = {"stitch": "run.kit.js", "plate": "exposure.kit.js", "isotype": "ledger.kit.js", "maps": "marbling.kit.js",
          "sediment": "delta.kit.js", "pen": None, "gear": None}
CORE = ["core/am.js", "core/laws.js"]
TAIL = ["pedagogy/_shared.js", "pedagogy/core-beats.js", "pedagogy/evidence-beats.js", "pedagogy/transfer-beats.js",
        "camera/cameras.js", "compose.js"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("graph"); ap.add_argument("material")
    ap.add_argument("--id", required=True); ap.add_argument("--title", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--no-check", action="store_true")
    a = ap.parse_args()
    graph = json.load(open(a.graph))
    if not a.no_check:
        r = subprocess.run(["node", lib("check.mjs"), a.graph, "--material", a.material])
        if r.returncode != 0:
            sys.exit("build_film: check.mjs refused the graph (see above)")
    os.makedirs(os.path.join(a.out, "src"), exist_ok=True)
    src = os.path.join(a.out, "src", a.id + ".film.js")
    with open(src, "w", encoding="utf-8") as f:
        f.write("/* Composed purely from the Atelier module library (modules/). Graph: %s · material: %s */\n" % (os.path.basename(a.graph), a.material))
        assert "'" not in a.title and '"' not in a.title and "'" not in a.id, "build_film: id/title may not contain quotes"
        f.write("(function () {\n  const FILM = { id: '%s', title: '%s' };\n" % (a.id, a.title))
        f.write("  const GRAPH = %s;\n" % json.dumps(graph, ensure_ascii=False))
        f.write("  AM.compose(GRAPH, %s, FILM);\n})();\n" % json.dumps(a.material))
    mat_js = os.path.join(MOD, "materials", a.material + ".js")
    kit = [lib(p) for p in CORE]
    k = KERNEL.get(a.material)
    if k: kit.append(os.path.join(MOD, "materials", "kernels", k))
    for extra in re.findall(r"@kernel\s+(\S+)", open(mat_js, encoding="utf-8").read()):   # extra vendored files a material names
        kit.append(os.path.join(MOD, "materials", "kernels", extra))
    kit.append(mat_js)
    kit += [lib(p) for p in TAIL]
    fonts = []
    # rows ['Family', 'file.woff2', weight] or ['Family', 'file.woff2', weight, 'italic'] (the style is passed on)
    for fam, fn, w, st in re.findall(r"\['([^']+)', '([^']+\.woff2?)', (\d+)(?:, '(normal|italic)')?\]", open(mat_js, encoding="utf-8").read()):
        fonts.append(f"{fam}={os.path.join(FONTS, fn)}:{w}" + (f":{st}" if st else ""))
    cmd = ["python3", os.path.join(RT, "build.py"), src, "--out", a.out, "--kit", *kit]
    if fonts: cmd += ["--fonts", *fonts]
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(r.stdout[-600:]); print(r.stderr[-2000:], file=sys.stderr)
    sys.exit(r.returncode)


if __name__ == "__main__":
    main()
