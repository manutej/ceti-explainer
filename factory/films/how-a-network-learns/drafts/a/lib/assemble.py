#!/usr/bin/env python3
"""lib/assemble.py (how-a-network-learns draft A) · writes ../film.js = lib/data.js (packed by lib/prep.py) + four
arsenal modules (verbatim copies in lib/, comments and indentation stripped, demo-only blocks cut or replaced in the
assembled copy only) + lib/film.src.js (the film). Deterministic: run it twice, diff film.js.
Modules: gl-pointcloud (the flower cloud; brush shader replaced: lit = right at step k from per-flower flip steps),
gl-heightfield (the loss slice; cut column given by the film), gl-ribbons (shader, splines, slabs as an api),
gl-labels (the pin solver). Every replacement is listed in CUTS and in NOTES.md."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["gl-pointcloud.js", "gl-heightfield.js", "gl-ribbons.js", "gl-labels.js"]

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


PC_VERT = r"""  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uShown, uFog, uKs, uBs, uRs, uDs, uGs;
uniform vec2 uFogZ; uniform vec3 uG0, uG1, uG2, uG3, uBg;
varying vec3 vCol; varying vec2 vC; varying float vFog;
float hs(float ti){ return clamp((uKs - ti) / uRs + 1.0, 0.0, 1.0); }
void main(){
  vec4 mv = uModelViewMatrix * vec4(aPosition, 1.0);
  float z = max(-mv.z, 1.0);
  float g = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  vec3 c = g < 0.5 ? uG0 : (g < 1.5 ? uG1 : (g < 2.5 ? uG2 : uG3));
  float t2 = floor(aTexCoord.x / 2048.0); float t1 = aTexCoord.x - t2 * 2048.0;
  float hi = floor(aTexCoord.y / 256.0); float ord = aTexCoord.y - hi * 256.0;
  float s0 = floor(hi / 2048.0); float t3 = hi - s0 * 2048.0;
  float a = s0 + (1.0 - 2.0 * s0) * (hs(t1) - hs(t2) + hs(t3));
  c = mix(c, uBg, uDs * uBs * (1.0 - a));
  float vis = ord < uShown ? 1.0 : 0.0;
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue) * (1.0 + uGs * uBs * a);
  mv.xy += aNormal.xy * r;
  vFog = uFog * smoothstep(uFogZ.x, uFogZ.y, z);
  vCol = c; vC = aNormal.xy;
  gl_Position = uProjectionMatrix * mv;
}`;"""

# [start regex, end regex | None (replace the one matching line), replacement?]: the block from the first matching
# line up to, not including, the end anchor. lib/*.js stay verbatim (their sha256 is printed in film.js).
CUTS = {
    "gl-pointcloud.js": [
        (r"^  const VERT = `", r"^  const FRAG = `", PC_VERT),                                   # brush = right at step k
        (r"^  const DOF_VERT", r"^  const rgb = "),                                               # DoF off (budget, exec look)
        (r"^  /\* ---------- fonts:", r"^  /\* ---------- data -> world",
         "  const face = async () => ({ font: null, key: null, fallback: true }); function synth() { return []; }"),
        (r"^      for \(const c of C\) \{ g\.vertices\.push", None,
         "      for (const c of C) { g.vertices.push(p.createVector(x, y, z)); g.vertexNormals.push(p.createVector(c[0], c[1], d.grp[i] + sz)); g.uvs.push(rows[i].u != null ? rows[i].u : d.brank[i], rows[i].v != null ? rows[i].v : d.order[i]); }"),
        (r"^    const f = \(c\.follow \|\| 0\) \* s, tg = ", None, "    const tg = c.look || [0, 0, 0];"),
        (r"^    p\.model\(st\.geom\);", None, "    if (params.uniforms) for (const k in params.uniforms) sh.setUniform(k, params.uniforms[k]); p.model(st.geom);"),
        (r"^  function dofPass", r"^  A\.patterns\['gl-pointcloud'\]",
         "  function dofPass() { return null; }\n  function hud() { return []; }"),                  # pins and readout are SVG (K.tx)
        (r"^    variants: \[", r"^    async load"),
    ],
    "gl-heightfield.js": [
        (r"^  function synth\(", r"^  /\* ---- the mesh", "  function synth() { return null; }"),
        (r"^  /\* ---- faces:", r"^  /\* ---- time -> state",
         "  async function faces() { return { disp: null, mono: null, note: 'all text is SVG (K.tx)' }; }"),
        (r"^  function cutAt\(", r"^  function keyed\(",                                          # the film names the column
         "  function cutAt(u, st, params) {\n    if (params.cutCol == null || params.cutMode === 'off') return null;\n"
         "    const col = Math.max(0, Math.min(st.cols - 1, Math.round(params.cutCol))), prof = []; let pk = 0;\n"
         "    for (let r = 0; r < st.rows; r++) { prof.push(st.M[r][col]); if (st.M[r][col] > st.M[pk][col]) pk = r; }\n"
         "    return { col, x: st.x0 + col * st.cell, prof, pk };\n  }"),
        (r"^  /\* ---- flat layer", r"^  A\.patterns\['gl-heightfield'\]", "  function flat() {}"),   # no depth clear: the film draws the bead after
        (r"^    variants: \[", r"^    setup: "),
    ],
    "gl-ribbons.js": [
        (r"^  /\* ---------- data: \{ nodes", r"^  /\* ---------- a link's spline"),
        (r"^  function bakeRibbon\(", r"^  /\* ---------- drawing"),
        (r"^  function drawMarks\(", r"^\}\)\(\);",
         "  A.patterns['gl-ribbons'] = { id: 'gl-ribbons', renderer: 'webgl', api: { VERT, FRAG, splineOf, frameAt, depthOf, useShader, slab, rgb, add } };"),
    ],
    "gl-labels.js": [
        (r"^  /\* ---------- drawing: flat", r"^  /\* kit2: placements"),
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
    parts = ["/* how-a-network-learns draft A · film.js is GENERATED by lib/assemble.py; edit lib/film.src.js (and lib/prep.py for data).\n"
             "   Arsenal modules inlined (comment-stripped, cut copies of lib/*.js): " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* -- lib/%s sha256 %s%s -- */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (cut)" if m in CUTS else "") + strip(body))
    fs = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
    parts.append("/* -- lib/data.js + lib/film.src.js sha256 %s (stripped) -- */\n(function () { 'use strict';\n" % hashlib.sha256(fs.encode()).hexdigest()[:16]
                 + open(os.path.join(HERE, "data.js"), encoding="utf-8").read() + strip(fs) + "\n})();")
    out = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print("film.js %d bytes" % len(out.encode()))

if __name__ == "__main__":
    main()
