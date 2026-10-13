#!/usr/bin/env python3
"""
build_film.py — assemble a p5-explainer episode into ONE self-contained HTML.

    python3 build_film.py <film-dir> [--out path.html] [--p5 inline|cdn] [--preset ceti|owala] [--theme x.css]

<film-dir> holds film.json, the episode module (<id>.js, ceti-explainer contract, unchanged) and
layers/*.js (P5Film.layer(...) definitions). The output is the live explainer: the upstream shell
(engine.js unchanged) plus canvas layers drawn from the same render(t). Open with ?film=1 for the
1920×1080 chrome-less frame the workers render.

Same inlining rules as ceti-explainer/assets/build.py; fonts are embedded (woff2, OFL) so headless
frames and the browser share metrics.
"""
import argparse, base64, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PLUGIN = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(PLUGIN, "scripts"))
try:
    from paths import ceti_root  # <root>/scripts/paths.py: $CETI_ROOT, else walk up to .claude-plugin/plugin.json
except ImportError:
    ceti_root = lambda start=None: None
finally:
    sys.path.pop(0)
PLUGIN = ceti_root(HERE) or PLUGIN
CE = os.path.join(HERE, "ce")
CE_PRESETS = os.path.join(CE, "presets")
if not os.path.isdir(CE):  # the ce/ copy is gone: use the SVG engine skill itself (byte-identical; UPSTREAM.sha256)
    CE = os.path.join(PLUGIN, "skills", "ceti-explainer", "assets")
    CE_PRESETS = os.path.join(PLUGIN, "skills", "ceti-explainer", "presets")
FONT_DIR = os.path.join(HERE, "fonts")
if not os.path.isdir(FONT_DIR):
    FONT_DIR = os.path.join(PLUGIN, "vendor", "fonts")
STUDIO_JS = os.path.join(PLUGIN, "runtime", "studio.js")
if not os.path.exists(STUDIO_JS):
    STUDIO_JS = os.path.join(PLUGIN, "runtime", "src", "studio", "studio.js")
P5_VERSION = "2.3.4"
CDN = f"https://cdn.jsdelivr.net/npm/p5@{P5_VERSION}/lib/p5.min.js"

FONTS = [  # family, weight, style, file
    ("Fraunces", 300, "italic", "fraunces-latin-300-italic.woff2"),
    ("Fraunces", 400, "italic", "fraunces-latin-400-italic.woff2"),
    ("DM Sans", 400, "normal", "dm-sans-latin-400-normal.woff2"),
    ("DM Sans", 500, "normal", "dm-sans-latin-500-normal.woff2"),
    ("DM Sans", 600, "normal", "dm-sans-latin-600-normal.woff2"),
    ("Space Mono", 400, "normal", "space-mono-latin-400-normal.woff2"),
    ("Space Mono", 700, "normal", "space-mono-latin-700-normal.woff2"),
]


def read(p):
    with open(p, "r", encoding="utf-8") as f:
        return f.read()


def safe_js(s):
    return s.replace("</script", "<\\/script")


def fonts_css():
    out = []
    for fam, w, st, fn in FONTS:
        p = os.path.join(FONT_DIR, fn)
        if not os.path.exists(p):
            continue
        b64 = base64.b64encode(open(p, "rb").read()).decode()
        out.append(f'@font-face{{font-family:"{fam}";font-style:{st};font-weight:{w};font-display:block;'
                   f'src:url(data:font/woff2;base64,{b64}) format("woff2");}}')
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("film")
    ap.add_argument("--out")
    ap.add_argument("--p5", choices=["inline", "cdn"], default="inline")
    ap.add_argument("--preset")
    ap.add_argument("--theme")
    ap.add_argument("--brand", default="CETI Explainers")
    a = ap.parse_args()

    fdir = os.path.abspath(a.film)
    man = json.load(open(os.path.join(fdir, "film.json")))
    module = os.path.join(fdir, man["module"])
    layers = [os.path.join(fdir, l["src"]) for l in man.get("layers", []) if l.get("src")]
    title = man.get("title", man["film"])
    out = a.out or os.path.join(fdir, "build", "live", f"{man['film']}.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)

    preset = read(os.path.join(CE_PRESETS, (a.preset or man.get("preset", "ceti")) + ".css"))
    theme = read(a.theme) if a.theme else ""
    if a.p5 == "inline":
        p5js, note = read(os.path.join(PLUGIN, "vendor", f"p5-{P5_VERSION}.min.js")), f"p5 {P5_VERSION}, inlined"
        p5tag = None
    else:
        p5js, note = "/* loaded from CDN below */", f"p5 {P5_VERSION} from jsDelivr"
        p5tag = f'<script src="{CDN}"></script>'

    tokens = read(os.path.join(CE, "ceti-tokens.css"))
    # fonts are embedded; drop the network @import so offline/headless renders never wait on it
    tokens = "\n".join(l for l in tokens.splitlines() if not l.strip().startswith("@import"))

    html = read(os.path.join(HERE, "shell.p5.template.html"))
    rep = {
        "__TITLE__": title, "__BRAND__": a.brand,
        "__PRESET_OVERRIDE__": preset, "__THEME_OVERRIDE__": theme,
        "__TOKENS_CSS__": tokens, "__MOTION_CSS__": read(os.path.join(CE, "ceti-motion.css")),
        "__FONTS_CSS__": fonts_css(),
        "__P5_NOTE__": note,
        "__STUDIO_JS__": safe_js(read(STUDIO_JS)),
        "__BRIDGE_JS__": safe_js(read(os.path.join(HERE, "bridge.js"))),
        "__ENGINE_JS__": safe_js(read(os.path.join(CE, "engine.js"))),
        "__EPISODE_JS__": safe_js(read(module)),
        "__LAYERS_JS__": safe_js("\n;\n".join(read(p) for p in layers)),
    }
    # p5 last: its minified source must not be scanned for placeholders
    for k, v in rep.items():
        html = html.replace(k, v)
    if p5tag:
        html = html.replace("<script>\n/* ───────────── p5.js", p5tag + "\n  <script>\n/* ───────────── p5.js", 1)
    html = html.replace("__P5_JS__", safe_js(p5js), 1)

    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✓ wrote {out} ({len(html.encode()) / 1024:.0f} KB · {note} · {len(layers)} p5 layer(s))")


if __name__ == "__main__":
    main()
