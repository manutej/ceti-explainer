#!/usr/bin/env python3
"""lib/assemble.py (a-bell-from-dice draft B) · writes two GENERATED files from the verbatim arsenal copies in lib/:
  lib/arsenal.gen.js  four modules, demo blocks cut, comments and indentation stripped; inlined by kit2 through
                      film.json `libs` (page bytes, not G8 film code: the claims file alone is 43.7 KB of the 120 KB);
  ../film.js          lib/film.src.js (the film) behind a generated header.
Modules: gl-instances (the 100,000 marks: chunked model(geom, n), data texture upload, lit-box FRAG; the film adds a
two-home vertex shader, SEATS-GL fix 3), gl-camera-rig (the script, poses, toKnobs/fromKnobs), gl-volume (sorted
transparent cells, the cut, the tail; patched: camera from the rig, cut along x for 2D, no WEBGL-text inset),
gl-labels (the solver only; the film emits K.tx/K.ln itself). Deterministic: run twice, identical bytes."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["gl-instances.js", "gl-camera-rig.js", "gl-volume.js", "gl-labels.js"]   # arsenal/patterns/<id>/pattern.js, verbatim

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

# Each cut: [start regex, end regex (not cut), replacement?]; applied to the assembled copy only (lib/*.js stay verbatim).
CUTS = {
    "gl-instances.js": [
        (r"^  const VERT = `#version 300 es", r"^  const FRAG = `#version 300 es"),                     # the film writes a two-home VERT
        (r"^  // tone map of the density buffer", r"^  const rgb = "),                                    # density route unused
        (r"^  function gauss\(rng\)", r"^  function upload\(p, st\)"),                                    # synth, layout, order, makeTexture
        (r"^  function setPicked", r"^  /\* a box is up to 6"),                                             # pick unused
        (r"^  function facesFor", r"^  /\* the arrival front"),                                             # the module's own camera
        (r"^  const onAt =", r"^  function drawMarks"),                                                     # brush, bindMarks
        (r"^  function hud\(", r"^\}\)\(\);",
         "  A.patterns['gl-instances'] = { id: 'gl-instances', renderer: 'webgl', api: { FRAG, TEXW, STEP, FACE, upload, frontAt, countAt, drawMarks, rgb, norm } };"),
    ],
    "gl-camera-rig.js": [
        (r"^  /\* ═════════════ the demo scene", r"^\}\)\(\);",
         "  A.patterns['gl-camera-rig'] = { id: 'gl-camera-rig', renderer: 'webgl', rig };"),
    ],
    "gl-volume.js": [
        (r"^    const G = st.grid, D = G.D, ax = D === 1 \? 0", r"^    const on = u >= params.cutIn",
         "    const G = st.grid, D = G.D, ax = D === 1 || params.cutX ? 0 : D === 2 ? 1 : 2, nAx = G.n[ax];"),        # [film] 2D cut along x
        (r"^  function drawInset", r"^  A.patterns\['gl-volume'\] = \{", "  function drawInset() {}"),       # [film] the inset is SVG
        (r"^    variants: \[", r"^    setup: async function"),
        (r"^      const cv = cameraAt\(st, params, u\)", r"^      p.setCamera\(cam\); p.noLights\(\);",
         "      const cv = params.camAt ? params.camAt(u) : cameraAt(st, params, u), eye = cv.eye, cam = st.cam;\n"
         "      if (params.camAt) cv.apply(cam); else { cam.camera(eye[0], eye[1], eye[2], cv.c[0], cv.c[1], cv.c[2], 0, 1, 0); cam.perspective(params.fov, W / H, 10, 8000); }"),  # [film] rig camera
        (r"^      const cut = cutAt\(st, params, u\), ax = cut.ax", r"^      const cutW = ",
         "      const cut = cutAt(st, params, u), ax = cut.ax, wAx = D === 1 || params.cutX ? 0 : 2;"),                   # [film] 2D cut along x
        (r"^  // hist-2d-slabs takes its data", r"^\}\)\(\);"),                                                    # demo matrix at load
    ],
    "gl-labels.js": [
        (r"^  /\* ---------- drawing: flat", r"^\}\)\(\);",
         "  A.patterns['gl-labels'] = { id: 'gl-labels', renderer: 'webgl', ROLES, solve, project: (cam, W, H) => projector(cam, W, H) };"),
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
    parts = ["/* a-bell-from-dice draft B · lib/arsenal.gen.js is GENERATED by lib/assemble.py from verbatim copies (sha256 below).\n"
             "   Modules: " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* lib/%s sha256 %s%s */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (cut)" if m in CUTS else "") + strip(body))
    gen = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "arsenal.gen.js"), "w", encoding="utf-8") as f:
        f.write(gen)
    film = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
    fj = "/* a-bell-from-dice draft B · film.js is GENERATED by lib/assemble.py from lib/film.src.js (edit that file). */\n" + film
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(fj)
    print("arsenal.gen.js %d bytes · film.js %d bytes" % (len(gen.encode()), len(fj.encode())))

if __name__ == "__main__":
    main()
