#!/usr/bin/env python3
"""build.py: assemble one 75-second case page from a film folder and the kit.

    python3 factory/kit/build.py <film-dir> [--out build/<id>.html]

The film folder holds film.json (window.FILM), film.js (defines window.FILM_RENDER) and claims.json.
The page is factory/kit/shell.html with these placeholders filled:
    {{FONTS}}    one @font-face per film.json.fonts entry, each looked up in vendor/fonts.lock.json and
                 checked against its sha256 there, embedded as a base64 data URL
    {{PALETTE}}  CSS variables from film.json.palette and film.json.type
    {{TITLE}} {{EYEBROW}} {{LEDE}}   HTML-escaped from film.json
    {{P5}}       vendor/p5-2.3.4.min.js, checked against vendor/SHA256SUMS
    {{FILM}}     window.FILM = <film.json as written>
    {{KIT}} {{FILMJS}} {{PLAYER}}    kit.js, the film's film.js, player.js
Script order: p5, FILM, KIT, FILMJS, PLAYER. No timestamps, no network: the same inputs give the same bytes.
--out defaults to <film-dir>/build/<id>.html (relative --out paths resolve against <film-dir>).
Prints the output path, bytes and sha256.
"""
import base64, hashlib, html, json, os, re, sys

KIT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(KIT, "..", "..", "scripts"))
try:
    from paths import ceti_root  # noqa: E402
    ROOT = ceti_root(KIT)
except Exception:  # pragma: no cover
    ROOT = None
ROOT = ROOT or os.path.abspath(os.path.join(KIT, "..", ".."))
VENDOR = os.path.join(ROOT, "vendor")
P5 = "p5-2.3.4.min.js"
PAL_KEYS = ["paper", "ink", "accent", "muted", "chalk", "dark", "soft"]
PAL_DEFAULT = {"paper": "#E8DCC2", "ink": "#1E3A5C", "accent": "#C8452E", "muted": "#8E887C",
               "chalk": "#F2ECDD", "dark": "#0A0D12", "soft": "#B9A277"}
REQUIRED = ["id", "title", "eyebrow", "lede", "dur", "palette", "fonts", "commit", "chapters", "captions",
            "brand", "sources", "honest"]


def die(msg):
    sys.exit("build.py: " + msg)


def read(p, mode="r"):
    with open(p, mode) as f:
        return f.read()


def sha(b):
    return hashlib.sha256(b).hexdigest()


def p5_script():
    data = read(os.path.join(VENDOR, P5), "rb")
    sums = dict(reversed(l.split(None, 1)) for l in read(os.path.join(VENDOR, "SHA256SUMS")).splitlines() if l.strip())
    want = sums.get(P5)
    if want is None or sha(data) != want:
        die("vendor/%s does not match vendor/SHA256SUMS" % P5)
    return "<script>" + data.decode() + "</script>"


def font_faces(fonts):
    lock = json.loads(read(os.path.join(VENDOR, "fonts.lock.json")))["fonts"]
    out = []
    for f in fonts:
        if isinstance(f, (list, tuple)):
            f = {"family": f[0], "weight": f[1], "style": f[2] if len(f) > 2 else "normal"}
        fam, wt, sty = f["family"], int(f["weight"]), f.get("style", "normal")
        hits = [e for e in lock if e["family"] == fam and int(e["weight"]) == wt and e["style"] == sty]
        hits.sort(key=lambda e: e["format"] != "woff2")  # prefer woff2
        if not hits:
            die("font %s %s %s is not in vendor/fonts.lock.json" % (fam, wt, sty))
        e = hits[0]
        data = read(os.path.join(VENDOR, "fonts", e["file"]), "rb")
        if sha(data) != e["sha256"]:
            die("vendor/fonts/%s does not match its lock sha256" % e["file"])
        mime = "font/woff2" if e["format"] == "woff2" else "font/woff"
        out.append("@font-face { font-family: '%s'; font-weight: %d; font-style: %s; font-display: block; "
                   "src: url(data:%s;base64,%s) format('%s'); }"
                   % (fam, wt, sty, mime, base64.b64encode(data).decode(), e["format"]))
    return "\n".join(out)


def palette_css(film):
    pal = dict(PAL_DEFAULT, **film.get("palette", {}))
    for k, v in pal.items():
        if not re.fullmatch(r"#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?", str(v)):
            die("palette.%s = %r is not a hex colour" % (k, v))
    typ = dict({"disp": "Big Shoulders Display", "mono": "IBM Plex Mono"}, **film.get("type", {}))
    fams = {f["family"] if isinstance(f, dict) else f[0] for f in film["fonts"]}
    for role in ("disp", "mono"):
        if typ[role] not in fams:
            die("type.%s = %r is not among film.json.fonts" % (role, typ[role]))
    v = ["--%s:%s;" % (k, pal[k]) for k in PAL_KEYS]
    v += ["--page:%s;" % pal.get("page", pal["paper"]), "--panel:%s;" % pal.get("panel", pal["chalk"]),
          "--muted-p:%s;" % pal.get("pageMuted", pal["muted"]),
          "--f-disp:'%s';" % typ["disp"], "--f-mono:'%s';" % typ["mono"]]
    return " ".join(v)


def script(src):
    if "</script" in src.lower():
        die("a script contains '</script'; escape it")
    return "<script>" + src + "</script>"


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("-"):
        die("usage: build.py <film-dir> [--out build/<id>.html]")
    fdir = os.path.abspath(args[0])
    out = None
    if "--out" in args:
        out = args[args.index("--out") + 1]
    raw = read(os.path.join(fdir, "film.json")).rstrip("\n")
    film = json.loads(raw)
    miss = [k for k in REQUIRED if k not in film]
    if miss:
        die("film.json lacks %s" % ", ".join(miss))
    for k in ("at", "prompt", "default"):
        if k not in film["commit"]:
            die("film.json commit lacks %s" % k)
    if "takeaway" not in film["brand"]:
        die("film.json brand lacks takeaway")
    if not os.path.isfile(os.path.join(fdir, "claims.json")):
        die("%s/claims.json is missing" % fdir)
    json.loads(read(os.path.join(fdir, "claims.json")))
    shell = read(os.path.join(KIT, "shell.html"))
    film_js = read(os.path.join(fdir, "film.js"))
    rep = {
        "{{FONTS}}": font_faces(film["fonts"]),
        "{{PALETTE}}": palette_css(film),
        "{{TITLE}}": html.escape(film["title"]),
        "{{EYEBROW}}": html.escape(film["eyebrow"]),
        "{{LEDE}}": html.escape(film["lede"]),
        "{{P5}}": p5_script(),
        "{{FILM}}": "<script>window.FILM = " + raw.replace("</", "<\\/") + ";</script>",
        "{{KIT}}": script(read(os.path.join(KIT, "kit.js"))),
        "{{FILMJS}}": script(film_js),
        "{{PLAYER}}": script(read(os.path.join(KIT, "player.js"))),
    }
    found = set(re.findall(r"\{\{[A-Z0-9]+\}\}", shell))
    if found != set(rep):
        die("shell.html placeholders %s differ from %s" % (sorted(found), sorted(rep)))
    # one pass, so text inside an inserted file can never be mistaken for a placeholder
    page = re.sub(r"\{\{[A-Z0-9]+\}\}", lambda m: rep[m.group(0)], shell)
    if out is None:
        out = os.path.join(fdir, "build", film["id"] + ".html")
    elif not os.path.isabs(out):
        out = os.path.join(fdir, out)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    data = page.encode()
    with open(out, "wb") as f:
        f.write(data)
    code = len(film_js.encode()) + len(raw.encode())
    print("%s  %d bytes  sha256 %s  (film code %d bytes)" % (os.path.relpath(out, ROOT), len(data), sha(data), code))
    if len(data) > 1300000:
        print("WARNING: page over the 1.3 MB budget")
    if code > 120000:
        print("WARNING: film code over the 120 KB budget")


if __name__ == "__main__":
    main()
