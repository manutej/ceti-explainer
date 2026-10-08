#!/usr/bin/env python3
"""
build.py — package an Atelier film into two single-file pages.

    python3 build.py <film.js> [--fonts "Family=path.woff2[:weight[:style]]" ...] --out <dir>

  <id>.html           offline: <meta charset="utf-8">, p5 2.3.4 inlined, fonts base64, runtime + film inline.
  <id>.artifact.html  publishable fragment: no doctype/html/head/body; starts with <title> then <style>;
                      p5 from jsDelivr (pinned 2.3.4); everything else inline; `:root{color-scheme:dark}` + body bg.

Fonts: the CETI faces (Fraunces italic 300/400, DM Sans 400/500/600, Space Mono 400/700) are always embedded.
`--fonts` adds any woff2/woff/ttf (e.g. from `npm i @fontsource/<face>`). Every face is converted to WOFF
(p5 2.3.4 `loadFont` rejects woff2 — tell #22) and embedded ONCE as window.ATELIER_FONTS; atelier.js registers the
@font-face rules from it (page + P2D text) and `def.fonts` loads p5.Font objects from it (textToContours, WEBGL text). Needs fontTools (+ brotli for woff2).

Safe inlining (tells #8, #9): inlined code has `</script` and `<!--` escaped; scripts are injected before the
LAST `</body>`.
"""
import argparse, base64, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
try:
    from paths import ceti_root  # <plugin>/scripts/paths.py: $CETI_ROOT, else walk up to .claude-plugin/plugin.json
except ImportError:
    ceti_root = lambda start=None: None
finally:
    sys.path.pop(0)
ROOT = ceti_root(HERE)
if ROOT:  # merged layout: <root>/runtime/tools/build.py, <root>/runtime/dist/atelier.js, <root>/vendor/{p5,fonts}
    STUDIO = ROOT
    RUNTIME_JS = os.path.join(ROOT, "runtime", "dist", "atelier.js")
    FONT_DIR = os.path.join(ROOT, "vendor", "fonts")
else:
    # Original layout: this file lives at <plugin>/atelier/runtime/build.py. (Standalone atelier checkouts next to the
    # plugin, <dir>/atelier + <dir>/ceti-p5-studio, are still found as a fallback.)
    STUDIO = os.path.abspath(os.path.join(HERE, "..", ".."))
    if not os.path.exists(os.path.join(STUDIO, "vendor", "p5-2.3.4.min.js")):
        STUDIO = os.path.abspath(os.path.join(HERE, "..", "..", "ceti-p5-studio"))
    RUNTIME_JS = os.path.join(HERE, "atelier.js")
    FONT_DIR = os.path.join(STUDIO, "skills", "p5-explainer", "assets", "fonts")
P5_PATH = os.path.join(STUDIO, "vendor", "p5-2.3.4.min.js")
P5_CDN = "https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js"
CETI_FONTS = [  # family, file, weight, style
    ("Fraunces", "fraunces-latin-300-italic.woff2", 300, "italic"),
    ("Fraunces", "fraunces-latin-400-italic.woff2", 400, "italic"),
    ("DM Sans", "dm-sans-latin-400-normal.woff2", 400, "normal"),
    ("DM Sans", "dm-sans-latin-500-normal.woff2", 500, "normal"),
    ("DM Sans", "dm-sans-latin-600-normal.woff2", 600, "normal"),
    ("Space Mono", "space-mono-latin-400-normal.woff2", 400, "normal"),
    ("Space Mono", "space-mono-latin-700-normal.woff2", 700, "normal"),
]


def woff_b64(path):
    """Any woff2/woff/ttf/otf → base64 WOFF (what both CSS and p5 2.3.4 loadFont accept)."""
    raw = open(path, "rb").read()
    if raw[:4] == b"wOFF":
        return base64.b64encode(raw).decode()
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        sys.exit("build.py: fontTools is required to convert fonts (pip install fonttools brotli)")
    try:
        f = TTFont(io.BytesIO(raw), recalcTimestamp=False)  # keep head.modified: same input, same bytes
    except Exception as e:  # woff2 without brotli lands here
        sys.exit(f"build.py: cannot read {path}: {e} (woff2 needs: pip install brotli)")
    f.flavor = "woff"
    out = io.BytesIO(); f.save(out)
    return base64.b64encode(out.getvalue()).decode()


def font_entries(extra):
    ents = [(fam, os.path.join(FONT_DIR, fn), w, st) for fam, fn, w, st in CETI_FONTS]
    for spec in extra or []:
        fam, _, rest = spec.partition("=")
        parts = rest.split(":")
        path, w, st = parts[0], int(parts[1]) if len(parts) > 1 and parts[1] else 400, parts[2] if len(parts) > 2 else "normal"
        if not os.path.exists(path):
            sys.exit(f"build.py: font file not found: {path}")
        ents.append((fam.strip(), path, w, st))
    out = []
    for fam, path, w, st in ents:
        out.append({"family": fam, "weight": w, "style": st, "data": woff_b64(path)})
    return out


def esc_js(code):
    """Make code safe inside an inline <script>: no premature end tag, no HTML comment-open state."""
    return re.sub(r"</(script)", r"<\\/\1", code, flags=re.I).replace("<!--", "<\\!--")


def inject_before_last_body(html, snippet):
    i = html.rfind("</body>")
    if i < 0:
        return html + snippet
    return html[:i] + snippet + html[i:]


def film_id(src, path):
    m = re.search(r"""\bid\s*:\s*['"]([A-Za-z0-9_.-]+)['"]""", src)
    return m.group(1) if m else os.path.splitext(os.path.basename(path))[0].replace(".film", "")


def film_title(src, fid):
    m = re.search(r"""\btitle\s*:\s*['"]([^'"]+)['"]""", src)
    return m.group(1) if m else fid


def build(film_path, out_dir, extra_fonts=None, runtime=None, id_src=None):
    src = open(film_path, encoding="utf-8").read()
    rt = open(runtime or RUNTIME_JS, encoding="utf-8").read()
    fid, title = None, None
    isrc = open(id_src, encoding='utf-8').read() if id_src else src   # with --kit, id/title come from the film file itself
    fid = film_id(isrc, id_src or film_path); title = film_title(isrc, fid)
    fonts = font_entries(extra_fonts)
    face_css = ""  # @font-face rules are registered by atelier.js from window.ATELIER_FONTS (one embedded copy)
    font_map = {f"{f['family']} {f['weight']}{'' if f['style'] == 'normal' else ' ' + f['style']}": f for f in fonts}
    fonts_js = "window.ATELIER_FONTS=" + json.dumps(font_map, separators=(",", ":")) + ";"
    base_css = ":root{color-scheme:dark}html,body{background:#0E1014;margin:0}"
    scripts = (f'<script data-atelier="fonts">{esc_js(fonts_js)}</script>\n'
               f'<script data-atelier="runtime">{esc_js(rt)}</script>\n'
               f'<script data-atelier="film">{esc_js(src)}</script>\n')
    os.makedirs(out_dir, exist_ok=True)
    t_html = title.replace("&", "&amp;").replace("<", "&lt;")

    # offline page: p5 inlined; inject the rest before the LAST </body> (p5 itself contains the string).
    p5 = open(P5_PATH, encoding="utf-8").read()
    page = ("<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">"
            "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
            f"<title>{t_html}</title><style>{base_css}{face_css}</style></head><body>\n"
            f"<script data-atelier=\"p5\">{esc_js(p5)}</script>\n</body></html>\n")
    page = inject_before_last_body(page, scripts)
    off = os.path.join(out_dir, f"{fid}.html")
    open(off, "w", encoding="utf-8").write(page)

    # artifact fragment: title first, then style; p5 from the pinned CDN.
    frag = (f"<title>{t_html}</title>\n<style>{base_css}{face_css}</style>\n"
            f"<script src=\"{P5_CDN}\"></script>\n" + scripts)
    art = os.path.join(out_dir, f"{fid}.artifact.html")
    open(art, "w", encoding="utf-8").write(frag)
    return {"id": fid, "html": off, "artifact": art, "html_kb": round(len(page.encode()) / 1024), "artifact_kb": round(len(frag.encode()) / 1024),
            "fonts": [f"{f['family']} {f['weight']} {f['style']}" for f in fonts]}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("film")
    ap.add_argument("--out", required=True)
    ap.add_argument("--fonts", nargs="*", default=[], help='"Family=path.woff2[:weight[:style]]" (repeatable)')
    ap.add_argument("--kit", nargs="*", default=[], help="extra JS files inlined BEFORE the film (shared kits, glyph tables)")
    a = ap.parse_args()
    film = a.film
    if a.kit:
        import tempfile
        tmp = os.path.join(tempfile.mkdtemp(prefix="atelier-"), os.path.basename(a.film))
        with open(tmp, "w", encoding="utf-8") as fo:
            for k in a.kit + [a.film]:
                fo.write(open(k, encoding="utf-8").read() + "\n;\n")
        film = tmp
    print(json.dumps(build(film, a.out, a.fonts, id_src=a.film if a.kit else None), indent=2))


if __name__ == "__main__":
    main()
