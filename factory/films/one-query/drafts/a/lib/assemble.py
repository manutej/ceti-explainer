#!/usr/bin/env python3
"""lib/assemble.py (one-query draft A, "the kitchen to the grid") · writes lib/arsenal.gen.js = four arsenal modules (verbatim
copies in lib/, comments and indentation stripped, demo-only blocks cut or replaced in the ASSEMBLED copy only) and ../film.js =
lib/rig-script.js (the camera scripts, shared with mkfilm.mjs) + lib/film.src.js (the film). The modules ride film.json `libs` (chain-recipes 3B: lib bytes count toward the page, not toward the
120 KB film code). Deterministic: run twice, diff, identical.
Modules and what the film takes from each:
  scale-anchor   the square-spiral table, timeline/level/lodAlpha/countOf/spiralIdx (the log zoom 10^0..10^5). Its demo draw (panel,
                 readouts, silhouettes) is CUT: the film draws the field itself (draw code in film.src.js, with the second tile tier).
  gl-heightfield VERT/FRAG, buildMesh, terrain (the lit mesh with contours, the section clip), section3d (the cut face), toMatrix.
                 Its camera, pins, HUD and profile are CUT: the rig moves the camera and the film writes SVG.
  gl-camera-rig  the rig (compile/at/apply/toKnobs/fromKnobs); demo scene CUT.
  gl-labels      the solver; demo scene CUT."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["scale-anchor.js", "gl-heightfield.js", "gl-camera-rig.js", "gl-labels.js"]   # arsenal/patterns/<id>/pattern.js

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


# each cut: [start regex, end regex (not cut) or None (one line), replacement?]
CUTS = {
    "scale-anchor.js": [
        (r"^  // ---------- text ----------", r"^  const BASE = \{"),                                            # fontOf/txt/SIL/draw: the film draws the field
        (r"^  A\.patterns\['scale-anchor'\] = \{", r"^\}\)\(\);",
         "  A.patterns['scale-anchor'] = { id: 'scale-anchor', renderer: 'p2d', params: BASE, setup, EASE, timeline, level, countOf, lodAlpha, spiralIdx, NMAX, api: { timeline, level, countOf, lodAlpha, spiralIdx, EASE, setup } };"),
    ],
    "gl-heightfield.js": [
        (r"^  function synth\(", r"^  /\* ---- the mesh"),                                                   # seeded synthetic terrain: the film has data
        (r"^  /\* ---- faces: pack face", r"^  function terrain\("),                                           # fonts, count-in rows, cut, camera keys
        (r"^  /\* ---- flat layer", r"^\}\)\(\);",
         "  A.patterns['gl-heightfield'] = { id: 'gl-heightfield', renderer: 'webgl', api: { VERT, FRAG, buildMesh, terrain, section3d, toMatrix, rgb, mixC } };"),
    ],
    "gl-camera-rig.js": [
        (r"^  /\* \u2550+ the demo scene", r"^\}\)\(\);", "  A.patterns['gl-camera-rig'] = { id: 'gl-camera-rig', renderer: 'webgl', rig };"),
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
    parts = ["/* one-query draft A \u00b7 lib/arsenal.gen.js is GENERATED by lib/assemble.py from verbatim copies in lib/.\n"
             "   Modules (comment-stripped, demo blocks cut): " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* \u2500\u2500 lib/%s sha256 %s%s \u2500\u2500 */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (cut)" if m in CUTS else "") + strip(body))
    lib = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "arsenal.gen.js"), "w", encoding="utf-8") as f:
        f.write(lib)
    film = ["/* one-query draft A \u00b7 film.js is GENERATED by lib/assemble.py from lib/film.src.js; edit that. */",
            open(os.path.join(HERE, "rig-script.js"), encoding="utf-8").read(), open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()]
    out = "\n".join(film) + "\n"
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print("lib/arsenal.gen.js %d bytes, film.js %d bytes" % (len(lib.encode()), len(out.encode())))

if __name__ == "__main__":
    main()
