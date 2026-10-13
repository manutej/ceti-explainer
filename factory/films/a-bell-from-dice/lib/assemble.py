#!/usr/bin/env python3
"""lib/assemble.py (a-bell-from-dice draft A) · writes lib/arsenal.gen.js = four arsenal modules (verbatim copies in lib/, comments
and indentation stripped, demo-only blocks cut or replaced in the assembled copy only) and ../film.js = lib/rig-script.js (the camera
script, shared with lib/knobs.mjs) + lib/film.src.js (the film). Deterministic: run twice, diff, identical.
Modules: gl-instances (the 100,000 rolls, one instanced draw; VERT replaced by lib/gl-instances.vert.js = route a, the
three layouts as texels), gl-camera-rig (the script, keys as knobs), gl-volume (the counted cells and the cut; camera
handed in, HUD cut: the film draws its words in SVG), gl-labels (the pin solver)."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["gl-instances.js", "gl-camera-rig.js", "gl-volume.js", "gl-labels.js"]   # arsenal/patterns/<id>/pattern.js

def strip(src):
    out, i, n = [], 0, len(src)
    prev = ""                          # last significant char, to tell a regex literal from a division
    while i < n:
        c = src[i]; d = src[i + 1] if i + 1 < n else ""
        if c in "'\"`":
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == "\\" else 1
            out.append(src[i:j + 1]); prev = c; i = j + 1; continue
        if c == "/" and d == "*":
            j = src.find("*/", i + 2); i = n if j < 0 else j + 2; out.append(" "); continue
        if c == "/" and d == "/":
            j = src.find("\n", i); i = n if j < 0 else j; continue
        if c == "/" and (prev == "" or prev in "(,=:[!&|?{};+-*%<>~^" or re.search(r"\breturn\s*$", "".join(out[-3:]))):
            j, cls = i + 1, False
            while j < n:
                if src[j] == "\\": j += 2; continue
                if src[j] == "[": cls = True
                elif src[j] == "]": cls = False
                elif src[j] == "/" and not cls: break
                j += 1
            j += 1
            while j < n and src[j].isalpha(): j += 1
            out.append(src[i:j]); prev = "/"; i = j; continue
        if c in " \t":
            nxt = src[i + 1] if i + 1 < n else ""
            if (out and out[-1] in (" ", "\t", "\n")) or (out and out[-1] in "{}();,=:?[]<>!&|*%") or nxt in "{}();,=:?[]<>!&|*%":
                i += 1; continue
        out.append(c)
        if not c.isspace(): prev = c
        i += 1
    lines = [l.strip() for l in "".join(out).split("\n")]
    return "\n".join(l for l in lines if l)

VERT_PATCH = open(os.path.join(HERE, "gl-instances.vert.js"), encoding="utf-8").read().rstrip("\n")

# each cut: [start regex, end regex (not cut) or None (one line), replacement?]
CUTS = {
    "gl-instances.js": [
        (r"^  const VERT = `#version 300 es", r"^  const FRAG = `", VERT_PATCH),                       # route a: 4 texels per mark, 3 layouts
        (r"^  /\* ---------- data: a film passes params\.data", r"^  function makeTexture"),          # demo data and layouts (the film lays out)
        (r"^  function hud\(", r"^  A\.patterns\['gl-instances'\] = \{"),                            # demo HUD (the film draws SVG)
        (r"^  A\.patterns\['gl-instances'\] = \{", r"^\}\)\(\);",
         "  A.patterns['gl-instances'] = { id: 'gl-instances', renderer: 'webgl', api: { VERT, FRAG, FACE, TEXW, STEP, MARK, upload, bindMarks, drawMarks, countAt, frontAt } };"),
    ],
    "gl-camera-rig.js": [
        (r"^  /\* \u2550+ the demo scene", r"^\}\)\(\);", "  A.patterns['gl-camera-rig'] = { id: 'gl-camera-rig', renderer: 'webgl', rig };"),
    ],
    "gl-volume.js": [
        (r"^      p\.background\(tk\.color\.bg\);", None),                                               # the film owns the ground (felt)
        (r"^      const cv = cameraAt\(st, params, u\)", r"^      p\.setCamera\(cam\); p\.noLights\(\);",
         "      const cv = params.camAt ? params.camAt(t) : cameraAt(st, params, u), eye = cv.eye, cam = st.cam;\n"
         "      if (params.applyCam) params.applyCam(cam); else { cam.camera(eye[0], eye[1], eye[2], cv.c[0], cv.c[1], cv.c[2], 0, 1, 0); cam.perspective(params.fov, W / H, 10, 8000); }"),
        (r"^      // pins: world points -> screen", r"^      return cnt;", "      const cnt = countAt(st, params, t);"),   # WEBGL-text HUD: the film draws SVG
        (r"^  // hist-2d-slabs takes its data", r"^\}\)\(\);"),                                           # demo matrix
    ],
    "gl-labels.js": [
        (r"^  /\* ---------- the demo scene", r"^\}\)\(\);",
         "  A.patterns['gl-labels'] = { id: 'gl-labels', renderer: 'webgl', ROLES, solve, kit, project: (cam, W, H) => projector(cam, W, H) };"),
    ],
}

def cut(src, rules):
    lines = src.split("\n")
    for rule in rules:
        start, end, rep = (rule + (None,))[:3]
        i = next(k for k, l in enumerate(lines) if re.match(start, l))
        j = i + 1 if end is None else next(k for k, l in enumerate(lines) if k > i and re.match(end, l))
        lines[i:j] = ["/* [cut by lib/assemble.py: %d lines the film never calls] */" % (j - i)] + ([rep] if rep else [])
    return "\n".join(lines)

def main():
    # the arsenal modules -> lib/arsenal.gen.js (inlined through film.json "libs", chain-recipes §3B: lib bytes count toward
    # the page, not the film-code budget); the film's own code -> ../film.js
    parts = ["/* a-bell-from-dice draft A \u00b7 lib/arsenal.gen.js is GENERATED by lib/assemble.py from verbatim copies in lib/.\n"
             "   Modules (comment-stripped, demo blocks cut): " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* \u2500\u2500 lib/%s sha256 %s%s \u2500\u2500 */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (cut)" if m in CUTS else "") + strip(body))
    lib = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "arsenal.gen.js"), "w", encoding="utf-8") as f:
        f.write(lib)
    film = ["/* a-bell-from-dice draft A \u00b7 film.js is GENERATED by lib/assemble.py from lib/rig-script.js + lib/film.src.js; edit those. */"]
    for extra in ["rig-script.js", "film.src.js"]:
        film.append(open(os.path.join(HERE, extra), encoding="utf-8").read())
    out = "\n".join(film) + "\n"
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print("lib/arsenal.gen.js %d bytes, film.js %d bytes" % (len(lib.encode()), len(out.encode())))

if __name__ == "__main__":
    main()
