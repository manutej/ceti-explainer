#!/usr/bin/env python3
"""lib/assemble.py (one-query draft B, "the denominator") · writes two GENERATED files from the verbatim arsenal copies in lib/:
  lib/arsenal.gen.js  four modules, patched and stripped, inlined by kit2 through film.json `libs` (page bytes, not G8 film code);
  ../film.js          lib/film.src.js (the film) behind a generated header.
Modules (arsenal/patterns/<id>/pattern.js, verbatim in lib/): scale-anchor (spiral table, ladder level(t), spiralIdx; its own draw is
cut because the film draws the field, the nested frames and the second tile tier itself), gl-heightfield (mesh, shader, terrain();
patched: z-stretch `zs`, `api {terrain}`, demo draw cut), gl-camera-rig (script, poses, toKnobs/fromKnobs; demo cut), gl-labels (solver
only; drawing and demo cut). Every patch is an exact-substring replacement that must match once, or a line-range cut; the film
prints them in NOTES.md. Deterministic: run twice, identical bytes."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["scale-anchor.js", "gl-heightfield.js", "gl-camera-rig.js", "gl-labels.js"]

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

# ("cut", start_regex, end_regex, replacement|None): lines [start, end) replaced (end line kept); ("sub", old, new): exactly one occurrence.
PATCHES = {
    "scale-anchor.js": [
        ("cut", r"^  // ---------- text ----------", r"^  const BASE = \{", "  function draw() {}"),                          # the film draws the field (lib/film.src.js)
    ],
    "gl-heightfield.js": [
        ("sub", "cell = XW / (cols - 1), ZD = cell * (rows - 1);", "cell = XW / (cols - 1), cellZ = cell * (params.zs || 1), ZD = cellZ * (rows - 1);"),   # [film] z-stretch
        ("sub", "/ (cell * ((r > 0 && r < rows - 1) ? 2 : 1));", "/ (cellZ * ((r > 0 && r < rows - 1) ? 2 : 1));"),
        ("sub", "g.vertices.push(new p5.Vector(x0 + c * cell, -hgt[i], z0 + r * cell));", "g.vertices.push(new p5.Vector(x0 + c * cell, -hgt[i], z0 + r * cellZ));"),
        ("sub", "Object.assign(st, { g, rows, cols, N: rows * cols, cell, XW,", "Object.assign(st, { g, rows, cols, N: rows * cols, cell, cellZ, XW,"),
        ("sub", "    count(t, st, params) {", "    api: { terrain },\n    count(t, st, params) {"),                               # [film] export terrain()
        ("sub", "    let imax = 0;", """    const skirt = (a, b, n) => { const base = g.vertices.length;
      for (const i of [a, b]) { const v = g.vertices[i], cv = clamp((C[Math.floor(i / cols)][i % cols] - cmin) / cspan);
        g.vertices.push(new p5.Vector(v.x, v.y, v.z), new p5.Vector(v.x, 0, v.z)); for (let q = 0; q < 2; q++) { g.vertexNormals.push(new p5.Vector(n[0], n[1], n[2])); g.vertexColors.push(cv, 0, 0, 1); } }
      g.faces.push([base, base + 1, base + 3], [base, base + 3, base + 2]); };
    for (let c = 0; c < cols - 1; c++) { skirt((rows - 1) * cols + c, (rows - 1) * cols + c + 1, [0, 0, 1]); skirt(c, c + 1, [0, 0, -1]); }
    for (let r = 0; r < rows - 1; r++) { skirt(r * cols, (r + 1) * cols, [-1, 0, 0]); skirt(r * cols + cols - 1, (r + 1) * cols + cols - 1, [1, 0, 0]); }
    let imax = 0;"""),                                                                                                                 # [film] vertical skirts: the terrain is a solid, not a sheet
        ("cut", r"^  /\* ---- flat layer: pins, the count", r"^  A\.patterns\['gl-heightfield'\] = \{"),                          # flat pins/HUD/profile: the film uses SVG
        ("cut", r"^    draw\(p, t, st, params, tk\) \{", r"^  \};$"),                                                     # the demo draw
    ],
    "gl-camera-rig.js": [
        ("cut", r"^  /\* ═════════════ the demo scene", r"^\}\)\(\);", "  A.patterns['gl-camera-rig'] = { id: 'gl-camera-rig', renderer: 'webgl', rig };"),
    ],
    "gl-labels.js": [
        ("cut", r"^  /\* ---------- drawing: flat", r"^\}\)\(\);", "  A.patterns['gl-labels'] = { id: 'gl-labels', renderer: 'webgl', ROLES, solve, project: (cam, W, H) => projector(cam, W, H) };"),
    ],
}

def patch(src, rules, name):
    for r in rules:
        if r[0] == "sub":
            if src.count(r[1]) != 1:
                raise SystemExit("%s: patch text found %d times: %r" % (name, src.count(r[1]), r[1][:60]))
            src = src.replace(r[1], r[2])
        else:
            lines = src.split("\n")
            start, end, rep = r[1], r[2], (r[3] if len(r) > 3 else None)
            i = next(k for k, l in enumerate(lines) if re.match(start, l))
            j = next(k for k, l in enumerate(lines) if k > i and re.match(end, l))
            lines[i:j] = ["/* [cut by lib/assemble.py: %d lines the film never calls] */" % (j - i)] + ([rep] if rep else [])
            src = "\n".join(lines)
    return src

def main():
    parts = ["/* one-query draft B · lib/arsenal.gen.js is GENERATED by lib/assemble.py from verbatim copies (sha256 below).\n"
             "   Modules: " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = patch(src, PATCHES[m], m) if m in PATCHES else src
        parts.append("/* lib/%s sha256 %s%s */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (patched)" if m in PATCHES else "") + strip(body))
    gen = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "arsenal.gen.js"), "w", encoding="utf-8") as f:
        f.write(gen)
    film = strip(open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read())
    fj = "/* one-query draft B · film.js is GENERATED by lib/assemble.py from lib/film.src.js (edit that file). */\n" + film
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(fj)
    print("arsenal.gen.js %d bytes · film.js %d bytes" % (len(gen.encode()), len(fj.encode())))

if __name__ == "__main__":
    main()
