#!/usr/bin/env python3
"""
build_feature.py — build a feature-cut film into self-contained HTML, in two variants from ONE module.

    python3 build_feature.py <film-dir> [--variant svg|p5|both] [--p5 inline|cdn] [--preset ceti|owala]

<film-dir>/film.json names: data (shared DATA/geometry), scenes (window.FEATURE, SVG), layers (P5Film.layer files).
  svg → build/<id>.svg.html   the classic ceti-explainer feature cut (no p5 on the page at all)
  p5  → build/<id>.p5.html    same scenes + p5 layers + bridge on the same clock (+ ?film=1 for the frame workers)
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_film import fonts_css, read, safe_js, PLUGIN, CE, CE_PRESETS, STUDIO_JS, P5_VERSION, CDN  # noqa: E402


def build(fdir, man, variant, p5mode, preset_name):
    files = lambda key: [os.path.join(fdir, f) for f in (man.get(key) if isinstance(man.get(key), list) else [man.get(key)]) if f]
    tokens = "\n".join(l for l in read(os.path.join(CE, "ceti-tokens.css")).splitlines() if not l.strip().startswith("@import"))
    preset = read(os.path.join(CE_PRESETS, preset_name + ".css"))
    if variant == "p5":
        if p5mode == "inline":
            p5 = "<script>\n/* p5 %s */\n%s\n</script>" % (P5_VERSION, safe_js(read(os.path.join(PLUGIN, "vendor", f"p5-{P5_VERSION}.min.js"))))
        else:
            p5 = f'<script src="{CDN}"></script>'
        block = (p5 + "\n<script>\n/* ceti-p5-studio runtime */\n" + safe_js(read(STUDIO_JS))
                 + "\n</script>\n<script>\n/* P5Film bridge */\n" + safe_js(read(os.path.join(HERE, "bridge.js"))) + "\n</script>")
        layers = "\n;\n".join(read(p) for p in files("layers"))
        label, footer = "p5 cut · interactive", "p5.js %s layers on the explainer clock" % P5_VERSION
    else:
        block, layers = "", "/* SVG cut: no p5 layers */"
        label, footer = "SVG cut", "ceti-explainer feature cut"
    rep = {
        "__TITLE__": man.get("title", man["film"]), "__DESCRIPTION__": man.get("description", ""),
        "__VARIANT__": variant, "__VARIANT_LABEL__": label, "__FOOTER__": footer,
        "__FONTS_CSS__": fonts_css(), "__TOKENS_CSS__": tokens, "__PRESET__": preset,
        "__ENGINE_JS__": safe_js(read(os.path.join(HERE, "feature-engine.js"))),
        "__DATA_JS__": safe_js("\n;\n".join(read(p) for p in files("data"))),
        "__SCENES_JS__": safe_js("\n;\n".join(read(p) for p in files("scenes"))),
        "__LAYERS_JS__": safe_js(layers),
    }
    html = read(os.path.join(HERE, "feature.template.html"))
    for k, v in rep.items():
        html = html.replace(k, v)
    html = html.replace("__P5_BLOCK__", block, 1)  # last: p5 source must not be scanned
    out = os.path.join(fdir, "build", f"{man['film']}.{variant}.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(html)
    print(f"✓ {out}  ({len(html.encode())/1024:.0f} KB)")
    # artifact body: the publish skeleton supplies doctype/html/head/body — drop ours (whole lines only;
    # the inlined p5 source contains '</body>' inside strings, so never a global replace)
    drop = {"<!doctype html>", '<html lang="en">', "<head>", "</head>", "<body>", "</body>", "</html>",
            '<meta charset="utf-8" />', '<meta name="viewport" content="width=device-width, initial-scale=1" />'}
    art = "\n".join(l for l in html.split("\n") if l.strip() not in drop)
    name = (man.get("artifactTitles") or {}).get(variant)   # a gallery name per cut, e.g. "Type-safe AI Classic Cut"
    if name:
        import re as _re
        art = _re.sub(r"<title>.*?</title>", "<title>%s</title>" % name, art, count=1)
    aout = out.replace(".html", ".artifact.html")
    open(aout, "w", encoding="utf-8").write(art)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("film")
    ap.add_argument("--variant", choices=["svg", "p5", "both"], default="both")
    ap.add_argument("--p5", choices=["inline", "cdn"], default="inline")
    ap.add_argument("--preset", default="ceti")
    a = ap.parse_args()
    fdir = os.path.abspath(a.film)
    man = json.load(open(os.path.join(fdir, "film.json")))
    for v in (["svg", "p5"] if a.variant == "both" else [a.variant]):
        build(fdir, man, v, a.p5, a.preset)


if __name__ == "__main__":
    main()
