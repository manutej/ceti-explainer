#!/usr/bin/env python3
"""build.py (kit2): assemble one 75-second case page with an injected brand, chrome and material.

    python3 factory/kit2/build.py <film-dir> [--brand ID] [--chrome ID] [--material ID] [--out PATH]

--brand     arsenal/brands/<ID>.json (or a path to a pack .json). 'film' (the default) synthesises a pack from
            film.json palette/type/fonts, so a film migrates from kit with its own look.
--chrome    factory/kit2/chromes/<ID>.js, else factory/chromes/<ID>.js; 'none' = no furniture. Default tender-set.
--material  an id in ARSENAL.materials from arsenal/materials/drawn/materials.js when that file exists, else from
            factory/kit2/materials/basic.js (ink, pencil). Default ink.
film.json `level`: 'exec' (default) | 'manager' | 'engineer'. It reaches kit2 inside FILM and is published with the
            built axes as window.__film.info.axes (gate row G10 reads it).
--out       default <film-dir>/build/<id>.<brand>.<chrome>.html (+ .<material> when not ink); relative paths
            resolve against <film-dir>.

Fonts: the pack's type roles (disp, mono, body) resolve through vendor/fonts.lock.json; the declared weight must
be in the lock (refused otherwise) and the kit's working weights (disp 600, mono 500/700, body 600) are added when
the lock has them. Every file is checked against its sha256. CSS variables are generated from the pack's roles by
the same resolver as kit2.js. Same inputs, same bytes: no timestamps, JSON dumped with sorted keys.

film.json, optional:
  renderer   '2d' (default) | 'webgl': kit2 creates the film canvas with WEBGL (README "Renderer webgl"). Material
             must be ink (the drawn materials are Canvas2D marks).
  fonts3d    ['Family|weight' | {"key": 'Family|weight', "text": "glyphs to keep"}]: TTF data URLs from
             arsenal/fonts/fonts.js for WEBGL text/textToModel (loaded by kit2 into K.fonts3d). With "text" the face is
             subset with fontTools to those glyphs (plus space), which keeps the page under budget.
  libs       ['path.js', ...]: scripts inlined in order between kit2.js and film.js; resolved against the film dir,
             then the repo root (e.g. a lib/ copy of an arsenal pattern).
  look       {brand, chrome, material}: the defaults for the three flags (recorded by apply_findings.py).
  knobs      {name: value} and knobs_doc [{name, range: [lo, hi] | options: [...], step?, what}]: every knob is
             documented and in range, every documented knob has a value (refused otherwise).
"""
import base64, hashlib, html, json, os, re, sys

KIT2 = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(KIT2, "..", ".."))
VENDOR = os.path.join(ROOT, "vendor")
P5 = "p5-2.3.4.min.js"
DRAWN = os.path.join(ROOT, "arsenal", "materials", "drawn", "materials.js")
RENDERERS = ("2d", "webgl")
FONTS_JS = os.path.join(ROOT, "arsenal", "fonts", "fonts.js")
LEVELS = ("exec", "manager", "engineer")   # film.json "level" (DECISIONS Q6); default exec
EXEC_TEXTURES = ("none", "paper")
REQUIRED = ["id", "title", "eyebrow", "lede", "dur", "commit", "chapters", "captions", "brand", "sources", "honest"]
FILM_PAL = {"paper": "#E8DCC2", "ink": "#1E3A5C", "accent": "#C8452E", "muted": "#8E887C",
            "chalk": "#F2ECDD", "dark": "#0A0D12", "soft": "#B9A277"}


def die(msg):
    sys.exit("kit2/build.py: " + msg)


def read(p, mode="r"):
    with open(p, mode) as f:
        return f.read()


def sha(b):
    return hashlib.sha256(b).hexdigest()


# ── colour roles (mirror of resolveRoles in kit2.js) ──
def parse(s):
    s = str(s).strip()
    m = re.fullmatch(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})", s)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        n = int(h[:6], 16)
        return [n >> 16 & 255, n >> 8 & 255, n & 255, int(h[6:], 16) / 255 if len(h) == 8 else 1.0]
    m = re.fullmatch(r"rgba?\(([^)]+)\)", s, re.I)
    if m:
        p = [float(x) for x in m.group(1).split(",")]
        return [p[0], p[1], p[2], p[3] if len(p) > 3 else 1.0]
    die("colour %r is neither #hex nor rgb()/rgba()" % s)


def to_hex(c):
    # JS Math.round rounds .5 up; Python round() is banker's: use floor(x + 0.5)
    return "#" + "".join("%02X" % max(0, min(255, int(v + 0.5))) for v in c[:3])


def solid(s, over=None):
    c = parse(s)
    if c[3] >= 1 or over is None:
        return to_hex(c)
    b, a = parse(over), c[3]
    return to_hex([c[i] * a + b[i] * (1 - a) for i in range(3)])


def lum(s):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    c = parse(s)
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def contrast(a, b):
    x, y = lum(a), lum(b)
    return (max(x, y) + 0.05) / (min(x, y) + 0.05)


def roles(pk):
    c = pk["color"]
    bg = solid(c.get("bg", "#FFFFFF"))
    ink = solid(c.get("ink", "#111111"), bg)
    panel = solid(c.get("panel", bg), bg)
    dg = lum(bg) < 0.18
    if c.get("card"):
        dark = solid(c["card"], bg)
    elif dg:
        dark = panel if lum(panel) <= lum(bg) else bg
    else:
        dark = panel if lum(panel) < lum(ink) else ink
    chalk = solid(c.get("chalk", ink), bg)
    cands = [bg, panel, chalk, ink, "#FFFFFF"]
    good = [x for x in cands if contrast(x, dark) >= 7]
    on_dark = good[0] if good else max(cands, key=lambda x: contrast(x, dark))
    return {"paper": bg, "ink": ink, "accent": solid(c.get("accent", ink), bg), "muted": solid(c.get("muted", ink), bg),
            "soft": solid(c.get("accent2", c.get("muted", ink)), bg), "line": solid(c.get("line", ink), bg),
            "panel": panel, "dark": dark, "onDark": on_dark, "chalk": panel}


def film_pack(film):
    """--brand film: a pack synthesised from film.json (the kit's legacy palette/type keys)."""
    pal = dict(FILM_PAL, **film.get("palette", {}))
    typ = dict({"disp": "Big Shoulders Display", "mono": "IBM Plex Mono"}, **film.get("type", {}))
    ink = parse(pal["ink"])
    return {"id": "film", "name": film["id"] + " (film.json palette)",
            "color": {"bg": pal["paper"], "ink": pal["ink"], "accent": pal["accent"], "accent2": pal["soft"],
                      "muted": pal["muted"], "line": "rgba(%d,%d,%d,0.25)" % tuple(ink[:3]), "panel": pal.get("panel", pal["chalk"]),
                      "chalk": pal["ink"], "card": pal["dark"]},
            "type": {"disp": {"family": typ["disp"], "weight": 600}, "mono": {"family": typ["mono"], "weight": 400},
                     "body": {"family": typ.get("sans", typ["mono"]), "weight": 400}},
            "texture": "paper", "voice": {"end_card": "CETI"}}


def load_pack(arg, film):
    if arg in (None, "film"):
        return film_pack(film)
    p = arg if arg.endswith(".json") else os.path.join(ROOT, "arsenal", "brands", arg + ".json")
    if not os.path.isfile(p):
        die("no brand pack %s" % p)
    pk = json.loads(read(p))
    for k in ("id", "color", "type"):
        if k not in pk:
            die("brand pack %s lacks %s" % (p, k))
    for k in ("bg", "ink", "accent", "muted"):
        if k not in pk["color"]:
            die("brand pack %s lacks color.%s" % (p, k))
    for k in ("disp", "mono"):
        if k not in pk["type"]:
            die("brand pack %s lacks type.%s" % (p, k))
    return pk


# ── fonts ──
def lock():
    return json.loads(read(os.path.join(VENDOR, "fonts.lock.json")))["fonts"]


def face_css(e):
    data = read(os.path.join(VENDOR, "fonts", e["file"]), "rb")
    if sha(data) != e["sha256"]:
        die("vendor/fonts/%s does not match its lock sha256" % e["file"])
    mime = "font/woff2" if e["format"] == "woff2" else "font/woff"
    return ("@font-face { font-family: '%s'; font-weight: %d; font-style: %s; font-display: block; "
            "src: url(data:%s;base64,%s) format('%s'); }"
            % (e["family"], int(e["weight"]), e["style"], mime, base64.b64encode(data).decode(), e["format"]))


def faces_for(pack, film, brand_arg):
    L = lock()

    def hit(fam, wt, style="normal"):
        h = [e for e in L if e["family"] == fam and int(e["weight"]) == int(wt) and e["style"] == style]
        h.sort(key=lambda e: e["format"] != "woff2")
        return h[0] if h else None

    want = []
    if brand_arg in (None, "film"):            # legacy: exactly film.json.fonts
        for f in film.get("fonts", []):
            if isinstance(f, (list, tuple)):
                f = {"family": f[0], "weight": f[1]}
            want.append((f["family"], int(f["weight"]), True, f.get("style", "normal")))
    else:
        extra = {"disp": [600], "mono": [500, 700], "body": [600]}
        for role in ("disp", "mono", "body"):
            r = pack["type"].get(role)
            if not r:
                continue
            st = r.get("style", "normal")   # a pack face may be italic only (ceti-boardwalk: Fraunces 300 italic)
            want.append((r["family"], int(r.get("weight", 400)), True, st))
            want += [(r["family"], w, False, st) for w in extra[role]]
    out, seen = [], set()
    for fam, wt, required, st in want:
        if (fam, wt) in seen:
            continue
        e = hit(fam, wt, st)
        if not e:
            if required:
                die("font %s %s %s is not in vendor/fonts.lock.json" % (fam, wt, st))
            continue
        seen.add((fam, wt))
        out.append(face_css(e))
    return "\n".join(out), sorted(seen)


def palette_css(R, pack):
    t = pack["type"]
    on_acc = "#FFFFFF" if contrast("#FFFFFF", R["accent"]) >= contrast("#111111", R["accent"]) else "#111111"
    v = ["--%s:%s;" % (k, R[k]) for k in ("paper", "ink", "accent", "muted", "chalk", "dark", "soft", "line", "panel")]
    v += ["--on-dark:%s;" % R["onDark"], "--on-accent:%s;" % on_acc, "--page:%s;" % R["paper"], "--muted-p:%s;" % R["muted"],
          "--f-disp:'%s';" % t["disp"]["family"], "--f-mono:'%s';" % t["mono"]["family"],
          "--f-body:'%s';" % (t.get("body") or t["mono"])["family"]]
    return " ".join(v)


def script(src):
    if "</script" in src.lower():
        die("a script contains '</script'; escape it")
    return "<script>" + src + "</script>"


def p5_script():
    data = read(os.path.join(VENDOR, P5), "rb")
    sums = dict(reversed(l.split(None, 1)) for l in read(os.path.join(VENDOR, "SHA256SUMS")).splitlines() if l.strip())
    if sums.get(P5) is None or sha(data) != sums[P5]:
        die("vendor/%s does not match vendor/SHA256SUMS" % P5)
    return "<script>" + data.decode() + "</script>"


def chrome_src(cid):
    if cid == "none":
        return ""
    for d in (os.path.join(KIT2, "chromes"), os.path.join(ROOT, "factory", "chromes")):
        p = os.path.join(d, cid + ".js")
        if os.path.isfile(p):
            return read(p)
    die("no chrome %s in factory/kit2/chromes or factory/chromes" % cid)


def material_src(mid):
    p = DRAWN if os.path.isfile(DRAWN) else os.path.join(KIT2, "materials", "basic.js")
    src = read(p)
    if not re.search(r"materials(\.%s\b|\[['\"]%s['\"]\])" % (re.escape(mid), re.escape(mid)), src):
        die("material %s is not registered in %s" % (mid, os.path.relpath(p, ROOT)))
    return src, p


def fonts3d(film):
    """film.json fonts3d → {key: data URL} (TTF from arsenal/fonts/fonts.js; optional fontTools subset)."""
    want = film.get("fonts3d") or []
    if not want:
        return {}
    src = read(FONTS_JS)
    have = dict(re.findall(r"'([^'|]+\|\d+)':'(data:font/ttf;base64,[A-Za-z0-9+/=]+)'", src))
    out = {}
    for w in want:
        key, text = (w, None) if isinstance(w, str) else (w.get("key"), w.get("text"))
        if key not in have:
            die("fonts3d %r is not in arsenal/fonts/fonts.js (have %s)" % (key, ", ".join(sorted(have))))
        url = have[key]
        if text:
            try:
                import io
                from fontTools import subset
                from fontTools.ttLib import TTFont
            except ImportError:
                die("fonts3d %r asks for a subset but fontTools is not installed" % key)
            f = TTFont(io.BytesIO(base64.b64decode(url.split(",", 1)[1])), recalcTimestamp=False)   # same bytes every build
            opts = subset.Options()
            opts.layout_features = ["kern"]
            opts.name_IDs = ["*"]
            opts.notdef_outline = True
            sub = subset.Subsetter(opts)
            sub.populate(text="".join(sorted(set(str(text) + " "))))
            sub.subset(f)
            buf = io.BytesIO()
            f.save(buf)
            url = "data:font/ttf;base64," + base64.b64encode(buf.getvalue()).decode()
        out[key] = url
    return out


def libs_src(film, fdir):
    out = []
    for rel in film.get("libs") or []:
        hit = next((p for p in (os.path.join(fdir, rel), os.path.join(ROOT, rel)) if os.path.isfile(p)), None)
        if not hit:
            die("libs entry %s not found in %s or the repo root" % (rel, fdir))
        out.append((rel, read(hit)))
    return out


def check_knobs(film):
    knobs, doc = film.get("knobs"), film.get("knobs_doc")
    if knobs is None and doc is None:
        return 0
    if not isinstance(knobs, dict) or not isinstance(doc, list):
        die("film.json knobs must be an object and knobs_doc a list of {name, range|options, what}")
    names = set()
    for d in doc:
        n = d.get("name") if isinstance(d, dict) else None
        if not n:
            die("knobs_doc entry without a name: %r" % (d,))
        if n in names:
            die("knobs_doc names %s twice" % n)
        names.add(n)
        if not d.get("what"):
            die("knobs_doc %s lacks 'what' (what it moves)" % n)
        if n not in knobs:
            die("knobs_doc %s has no value in film.json knobs" % n)
        v, rg, op = knobs[n], d.get("range"), d.get("options")
        if rg is not None:
            if not (isinstance(rg, list) and len(rg) == 2 and all(isinstance(x, (int, float)) for x in rg) and rg[0] <= rg[1]):
                die("knobs_doc %s range must be [lo, hi]" % n)
            if not isinstance(v, (int, float)) or isinstance(v, bool) or not rg[0] <= v <= rg[1]:
                die("knob %s = %r is outside its range %s" % (n, v, rg))
        elif op is not None:
            if v not in op:
                die("knob %s = %r is not one of %s" % (n, v, op))
        else:
            die("knobs_doc %s needs range [lo, hi] or options [...]" % n)
    extra = sorted(set(knobs) - names)
    if extra:
        die("knobs without a knobs_doc entry: %s" % ", ".join(extra))
    return len(names)


def arg(args, k, default=None):
    if k in args:
        i = args.index(k)
        if i + 1 >= len(args):
            die("%s needs a value" % k)
        return args[i + 1]
    return default


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("-"):
        die("usage: build.py <film-dir> [--brand ID|film] [--chrome ID|none] [--material ID] [--out PATH]")
    fdir = os.path.abspath(args[0])
    raw = read(os.path.join(fdir, "film.json")).rstrip("\n")
    film = json.loads(raw)
    look = film.get("look") or {}   # the recorded look (apply_findings.py writes it); flags win
    brand_arg, cid, mid, out = (arg(args, "--brand", look.get("brand", "film")), arg(args, "--chrome", look.get("chrome", "tender-set")),
                                arg(args, "--material", look.get("material", "ink")), arg(args, "--out"))
    miss = [k for k in REQUIRED if k not in film]
    if miss:
        die("film.json lacks %s" % ", ".join(miss))
    for k in ("at", "prompt", "default"):
        if k not in film["commit"]:
            die("film.json commit lacks %s" % k)
    if "takeaway" not in film["brand"]:
        die("film.json brand lacks takeaway")
    cp = os.path.join(fdir, "claims.json")
    if not os.path.isfile(cp):
        die("%s/claims.json is missing" % fdir)
    claims = json.loads(read(cp))
    if isinstance(claims, dict):   # SHIP defect 3: one shape. The array is canonical; the object form is accepted.
        print("note: claims.json is the object form {film, claims}; the canonical shape is a bare array")
    level = film.get("level", "exec")
    if level not in LEVELS:
        die("film.json level %r is not one of %s" % (level, ", ".join(LEVELS)))
    renderer = str(film.get("renderer", "2d")).lower()
    if renderer not in RENDERERS:
        die("film.json renderer %r is not one of %s" % (renderer, ", ".join(RENDERERS)))
    if renderer == "webgl" and mid != "ink":
        die("renderer webgl draws its own marks: material must be ink (got %s)" % mid)
    nknobs = check_knobs(film)
    f3d = fonts3d(film)
    libs = libs_src(film, fdir)
    pack = load_pack(brand_arg, film)
    R = roles(pack)
    fonts, faces = faces_for(pack, film, brand_arg)
    msrc, mpath = material_src(mid)
    conf = {"brand": pack, "chrome": cid, "material": mid}
    kit2_scripts = [script("window.KIT2 = " + json.dumps(conf, sort_keys=True, separators=(",", ":")).replace("</", "<\\/") + ";")]
    if cid != "none":
        kit2_scripts.append(script(chrome_src(cid)))
    kit2_scripts.append(script(msrc))
    if f3d:
        kit2_scripts.append(script("window.KIT2_FONTS3D = " + json.dumps(f3d, sort_keys=True, separators=(",", ":")) + ";"))
    shell = read(os.path.join(KIT2, "shell.html"))
    film_js = read(os.path.join(fdir, "film.js"))
    bid = pack["id"]
    rep = {
        "{{FONTS}}": fonts,
        "{{PALETTE}}": palette_css(R, pack),
        "{{TITLE}}": html.escape(film["title"]),
        "{{EYEBROW}}": html.escape(film["eyebrow"]),
        "{{LEDE}}": html.escape(film["lede"]),
        "{{LOOK}}": "brand=%s chrome=%s material=%s texture=%s level=%s renderer=%s" % (bid, cid, mid, pack.get("texture", "none"), level, renderer),
        "{{P5}}": p5_script(),
        "{{FILM}}": "<script>window.FILM = " + raw.replace("</", "<\\/") + ";</script>",
        "{{KIT2}}": "\n".join(kit2_scripts),
        "{{KIT}}": script(read(os.path.join(KIT2, "kit2.js"))),
        "{{FILMJS}}": "\n".join([script("/* lib: %s */\n" % rel + src) for rel, src in libs] + [script(film_js)]),
        "{{PLAYER}}": script(read(os.path.join(KIT2, "player.js"))),
    }
    found = set(re.findall(r"\{\{[A-Z0-9]+\}\}", shell))
    if found != set(rep):
        die("shell.html placeholders %s differ from %s" % (sorted(found), sorted(rep)))
    page = re.sub(r"\{\{[A-Z0-9]+\}\}", lambda m: rep[m.group(0)], shell)
    if out is None:
        name = "%s.%s.%s%s.html" % (film["id"], bid, cid, "" if mid == "ink" else "." + mid)
        out = os.path.join(fdir, "build", name)
    elif not os.path.isabs(out):
        out = os.path.join(fdir, out)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    data = page.encode()
    with open(out, "wb") as f:
        f.write(data)
    code = len(film_js.encode()) + len(raw.encode())
    low = [k for k in ("ink", "muted", "accent") if contrast(R[k], R["paper"]) < 4.5]
    print("%s  %d bytes  sha256 %s  (film code %d bytes; brand %s, chrome %s, material %s from %s; faces %s)"
          % (os.path.relpath(out, ROOT), len(data), sha(data), code, bid, cid, mid, os.path.relpath(mpath, ROOT),
             ", ".join("%s %d" % f for f in faces)))
    print("contrast on paper: ink %.1f  muted %.1f  accent %.1f  onDark/dark %.1f%s" % (
        contrast(R["ink"], R["paper"]), contrast(R["muted"], R["paper"]), contrast(R["accent"], R["paper"]),
        contrast(R["onDark"], R["dark"]), ("  WARN under 4.5: " + ", ".join(low)) if low else ""))
    if renderer != "2d" or nknobs or f3d or libs:
        print("renderer %s; knobs %d; fonts3d %s; libs %s" % (renderer, nknobs,
              ", ".join("%s %d B" % (k, len(v)) for k, v in sorted(f3d.items())) or "none", ", ".join(r for r, _ in libs) or "none"))
    if level == "exec" and mid != "ink":
        print("note: level exec with material %s: gate G10 will FAIL (DECISIONS Q6: exec renders in ink)" % mid)
    if level == "exec" and pack.get("texture", "none") not in EXEC_TEXTURES:
        print("note: level exec: the pack's texture %s is not drawn (kit2 draws it flat; G10 WARNs)" % pack.get("texture"))
    if len(data) > 1300000:
        print("WARNING: page over the 1.3 MB budget")
    if code > 120000:
        print("WARNING: film code over the 120 KB budget")


if __name__ == "__main__":
    main()
