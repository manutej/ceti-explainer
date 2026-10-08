#!/usr/bin/env python3
"""
Assemble a single, self-contained explainer HTML from a content module.

Usage:
    python3 build.py <episode.js> "<Title>" [output.html]
                     [--preset ceti|owala] [--brand "Acme Labs"] [--theme acme.css]

Inlines ceti-tokens.css, ceti-motion.css, engine.js and your episode module
into shell.template.html — no external JS deps; opens straight from disk.

Re-skin for any brand WITHOUT touching diagram code:
  --preset  a built-in palette system: 'ceti' (deep editorial dark, default) or
            'owala' (warm plum + dusty rose). Colors only; fonts stay locked.
  --brand   sets the wordmark/footer/title text
  --theme   a CSS file with a :root { ... } block overriding the 12 color roles
            (--ex-ground/-ink/-dim/-line/-panel/-cell/-bar/-accent/-accent-fill
             /-accent-glow/-accent2/-support). Injected LAST, so it wins — and it
            can stack on a --preset. (Custom fonts: see the type gotcha in
            SKILL.md — keep the locked fonts unless you re-run layout QA.)
Diagrams reference role tokens only, so swapping preset/theme re-skins everything.
"""
import sys, os, argparse

HERE = os.path.dirname(os.path.abspath(__file__))

def read(p):
    with open(p, "r", encoding="utf-8") as f:
        return f.read()

def safe_js(s):
    return s.replace("</script", "<\\/script")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("title")
    ap.add_argument("output", nargs="?")
    ap.add_argument("--preset", default=None, help="built-in palette: ceti | owala")
    ap.add_argument("--brand", default="CETI Explainers")
    ap.add_argument("--theme", default=None, help="CSS file with a :root override block")
    a = ap.parse_args()

    # default: next to the episode module (RUN.md), not the current directory
    out = a.output or os.path.join(os.path.dirname(os.path.abspath(a.episode)), f"{a.title}.html")
    theme = read(a.theme) if a.theme else ""
    preset = ""
    if a.preset:
        ppath = os.path.join(HERE, "..", "presets", a.preset + ".css")
        if not os.path.exists(ppath):
            sys.exit(f"unknown preset '{a.preset}' (looked for {ppath})")
        preset = read(ppath)

    html = (read(os.path.join(HERE, "shell.template.html"))
        .replace("__TITLE__", a.title)
        .replace("__BRAND__", a.brand)
        .replace("__PRESET_OVERRIDE__", preset)
        .replace("__THEME_OVERRIDE__", theme)
        .replace("__TOKENS_CSS__", read(os.path.join(HERE, "ceti-tokens.css")))
        .replace("__MOTION_CSS__", read(os.path.join(HERE, "ceti-motion.css")))
        .replace("__ENGINE_JS__", safe_js(read(os.path.join(HERE, "engine.js"))))
        .replace("__EPISODE_JS__", safe_js(read(a.episode))))

    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    kb = len(html.encode("utf-8")) / 1024
    tag = f" · brand '{a.brand}'" + (f" · preset {a.preset}" if a.preset else "") + (f" · theme {os.path.basename(a.theme)}" if a.theme else "")
    print(f"✓ wrote {out}  ({kb:.0f} KB, self-contained){tag}")

if __name__ == "__main__":
    main()
