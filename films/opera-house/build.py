#!/usr/bin/env python3
"""build.py: assemble films/opera-house/build/opera-house.html from the sources next to this file.

    python3 films/opera-house/build.py [--check]

shell.html holds the page with four placeholders; film.json is window.FILM; film.js is the chrome and the
renderer (one clock: render(t, state)); page.js is the player, the sealed commit, the try-it panel and the
film-mode hooks (window.__film, window.__ctrl). p5 and the three font faces come from vendor/ by hash, so the
build is byte-reproducible: --check compares the result with the sha256 recorded in NOTES.md (the page as
uploaded) and exits 1 on a mismatch.
"""
import base64, hashlib, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
from paths import ceti_root  # noqa: E402

ROOT = ceti_root(HERE)
P5 = os.path.join(ROOT, "vendor", "p5-2.3.4.min.js")
FONTS = [  # css family, weight, style, vendored file
    ("BSD", "600", "normal", "big-shoulders-display-latin-600-normal.woff2"),
    ("Plex Mono", "400", "normal", "ibm-plex-mono-latin-400-normal.woff2"),
    ("Plex Mono", "500", "normal", "ibm-plex-mono-latin-500-normal.woff2"),
]


def read(p, mode="r"):
    with open(p, mode) as f:
        return f.read()


def main():
    shell = read(os.path.join(HERE, "shell.html"))
    mine = set(re.findall(r"\{\{(?:FONT:[^}]+|P5|FILM|FILMJS|PAGEJS)\}\}", shell))
    want = {"{{FONT:%s:%s:%s}}" % f[:3] for f in FONTS} | {"{{P5}}", "{{FILM}}", "{{FILMJS}}", "{{PAGEJS}}"}
    if mine != want:
        sys.exit("shell.html placeholders %s differ from the build table %s" % (sorted(mine), sorted(want)))
    for fam, wt, sty, fn in FONTS:
        b64 = base64.b64encode(read(os.path.join(ROOT, "vendor", "fonts", fn), "rb")).decode()
        face = ("@font-face { font-family: '%s'; font-weight: %s; font-style: %s; font-display: block; "
                "src: url(data:font/woff2;base64,%s) format('woff2'); }" % (fam, wt, sty, b64))
        shell = shell.replace("{{FONT:%s:%s:%s}}" % (fam, wt, sty), face)
    shell = shell.replace("{{P5}}", "<script>" + read(P5) + "</script>")
    shell = shell.replace("{{FILM}}", "<script>window.FILM = " + read(os.path.join(HERE, "film.json")).rstrip("\n") + ";</script>")
    shell = shell.replace("{{FILMJS}}", "<script>" + read(os.path.join(HERE, "film.js")) + "</script>")
    shell = shell.replace("{{PAGEJS}}", "<script>" + read(os.path.join(HERE, "page.js")) + "</script>")
    out = os.path.join(HERE, "build", "opera-house.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        f.write(shell)
    sha = hashlib.sha256(shell.encode()).hexdigest()
    print("%s  %d bytes  sha256 %s" % (os.path.relpath(out, ROOT), len(shell.encode()), sha))
    if "--check" in sys.argv:
        want = re.search(r"sha256 `([0-9a-f]{64})`", read(os.path.join(HERE, "NOTES.md"))).group(1)
        if sha != want:
            sys.exit("MISMATCH: NOTES.md records %s" % want)
        print("identical to the page as uploaded")


if __name__ == "__main__":
    main()
