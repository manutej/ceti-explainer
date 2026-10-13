#!/usr/bin/env python3
"""lib/assemble.py (how-a-network-learns draft B) · writes ../film.js = four arsenal GL modules (verbatim copies in lib/,
comments and indentation stripped, demo-only blocks cut or replaced in the assembled copy only) + lib/film.src.js.
Deterministic: run it twice, diff nothing. Modules: gl-pointcloud, gl-heightfield, gl-ribbons, gl-labels.
CUT replacements (each one documented in NOTES.md): pointcloud gets an exact per-flower brush (uLit/uExact uniforms) and a
lit colour that keeps the species (uHiMix); its hud and the heightfield's flat layer become no-ops so the depth buffer
survives for the film's overlays; ribbons export frameAt/depthOf; labels keep solve/kit/project only."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["gl-pointcloud.js", "gl-heightfield.js", "gl-ribbons.js", "gl-labels.js"]   # arsenal/patterns/<id>/pattern.js

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

# [start regex, end regex | None (one line), replacement?]: the block from the first matching line up to, not including, the end anchor.
CUTS = {
    "gl-pointcloud.js": [
        (r"^uniform vec2 uFogZ;", None, "uniform vec2 uFogZ; uniform vec3 uG0, uG1, uG2, uG3, uHi, uBg; uniform float uExact, uHiMix; uniform vec4 uLit[38];"),
        (r"^  float a = rank >= 0\.0", None, "  float a = rank >= 0.0 ? clamp((uK - rank) / uRamp, 0.0, 1.0) : 0.0;\n"
         "  if (uExact > 0.5) { float q = floor(rank / 4.0 + 0.01); vec4 lv = uLit[int(q)]; float j = rank - 4.0 * q; a = j < 0.5 ? lv.x : (j < 1.5 ? lv.y : (j < 2.5 ? lv.z : lv.w)); }"),
        (r"^  c = mix\(mix\(c, uBg, uDim \* uS\), uHi, a\);", None, "  c = mix(mix(c, uBg, uDim * uS), mix(c, uHi, uHiMix), a);"),
        (r"^  const DOF_VERT", r"^  const rgb = ", "  const DOF_VERT = '', DOF_FRAG = '';"),
        (r"^  function synth\(", r"^  function rankBy", "  function synth() { return []; }"),
        (r"^  function dofPass", r"^  /\* ---------- pins and HUD", "  function dofPass() { return null; }"),
        (r"^  function hud\(", r"^  A\.patterns\['gl-pointcloud'\]", "  function hud() { return []; }"),
        (r"^    variants: \[", r"^    async load\(", "    variants: [],"),
    ],
    "gl-heightfield.js": [
        (r"^  function synth\(", r"^  /\* ---- the mesh", "  function synth() { return [[0, 0], [0, 0]]; }"),
        (r"^  /\* ---- flat layer", r"^  A\.patterns\['gl-heightfield'\]", "  function flat() {}"),
        (r"^    variants: \[", r"^    setup: async function", "    variants: [],"),
    ],
    "gl-ribbons.js": [
        (r"^  /\* ---------- timing: queue model", r"^  const nBefore", "  function buildQueue() { return null; }"),
        (r"^  function labels\(", r"^  A\.patterns\['gl-ribbons'\]", "  function labels() { return { pins: [], readout: null }; }"),
        (r"^    variants: \[", r"^    count,", "    variants: [],"),
        (r"^    count,", None, "    count, frameAt, depthOf,"),
    ],
    "gl-labels.js": [
        (r"^  /\* ---------- drawing: flat", r"^  /\* kit2: placements"),
        (r"^  /\* ---------- the demo scene", r"^\}\)\(\);", "  A.patterns['gl-labels'] = { id: 'gl-labels', renderer: 'webgl', ROLES, solve, kit, project: (cam, W, H) => projector(cam, W, H) };"),
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
    parts = ["/* how-a-network-learns draft B · film.js is GENERATED by lib/assemble.py; edit lib/film.src.js.\n"
             "   Arsenal modules inlined (comment-stripped, cut copies of lib/*.js): " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* ── lib/%s sha256 %s%s ── */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (cut)" if m in CUTS else "") + strip(body))
    src = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()
    parts.append("/* ── lib/film.src.js sha256 %s (stripped) ── */\n" % hashlib.sha256(src.encode()).hexdigest()[:16] + strip(src))
    out = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print("film.js %d bytes" % len(out.encode()))

if __name__ == "__main__":
    main()
