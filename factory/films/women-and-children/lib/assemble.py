#!/usr/bin/env python3
"""lib/assemble.py (women-and-children draft A, "the manifest") · writes ../film.js = lib/gl-stack-city.js (verbatim copy of
arsenal/patterns/gl-stack-city/pattern.js; demo-only blocks cut and three lines replaced IN THE ASSEMBLED COPY ONLY, see CUTS)
+ lib/gl-labels.js (verbatim copy; demo block cut, no line changed) + lib/film.src.js (the film). lib/gl-post.js needs no
cut and rides film.json `libs` verbatim, so it counts toward the page (< 1.3 MB) and not toward the 120 KB film code, of which
claims.json alone is 44 KB. Deterministic: run twice, diff."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["gl-stack-city.js", "gl-labels.js"]   # gl-post rides film.json libs verbatim (film code budget: claims.json is 44 KB)

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

# [start regex, end regex | None, replacement?]: the block from the first matching line up to, not including, the end anchor
# (end None = that one line). lib/gl-stack-city.js stays verbatim (its sha256 is printed in film.js).
POOL_RATE = ("        const pfp = (n) => { const Fl = Math.max(1, Math.ceil(n / params.poolLayers)), b = Math.min(params.poolDepth, Fl); return [Math.ceil(Fl / b), b]; };\n"
             "        const PF = gTot.map((n) => (params.poolLayers ? pfp(n) : params.foot)); let px = -(sum(PF.map((f) => f[0] * P)) + (G - 1) * gx) / 2;\n"
             "        for (let g = 0; g < G; g++) { pooled[g] = slabFrom(P, px + PF[g][0] * P / 2, 0, PF[g][0], PF[g][1], gTot[g]); px += PF[g][0] * P + gx; }")
ARR_SLAB = ("    byG.forEach((l, g) => { l.sort(sorters[params.pooledSort] || sorters['hit-cat']); let hr = 0; l.forEach((b, s) => { b.from = slot(st.pooled[g], s); "
            "b.ar = (s + 0.5) / (params.arriveBy === 'slab' ? l.length : maxPool); b.ls = b.hit ? (hr++ + 0.5) / Math.max(1, hitTot[g]) : 2; }); });")
STUB = "  const VERT = 'precision highp float; attribute vec3 aPosition; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; void main(){ gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }', FRAG = 'precision highp float; void main(){ gl_FragColor = vec4(1.0); }';"
CUTS = {
    "gl-stack-city.js": [
        (r"^  /\* Berkeley 1973", r"^  function resolveData"),                          # demo data + synth (the film feeds its matrix)
        (r"^  /\* squarified treemap", r"^  /\* ── the two partitions"),                  # treemap layout (the film is bars)
        (r"^        for \(let g = 0; g < G; g\+\+\) pooled\[g\] = slabFrom\(P, \(g - \(G - 1\) / 2\) \* \(pw \+ gx\)", None, POOL_RATE),   # PATCH 1: pooled columns in rate form
        (r"^    byG\.forEach\(\(l, g\) => \{ l\.sort", None, ARR_SLAB),                  # PATCH 2: arrivalBy 'slab' (every column rises over the whole window)
        (r"^  /\* ── shader: positions", r"^  /\* ── fonts", STUB),                              # module shader + palette (the film owns a linear-light shader)
        (r"^  /\* ── camera: orbit", r"^  /\* ── state from t"),                           # module camera (the film owns its orbit)
        (r"^  function drawGround", r"^  const PAT = \{"),                                # ground, boxes, pins, hud (film draws; labels are gl-labels')
        (r"^    variants: \[", r"^    check\(t, st, params\)"),                          # demo variants
        (r"^    count\(t, st, params\) \{", r"^    async setup"),                           # count() (needs the cut ratioOps)
        (r"^    draw\(p, t, st, params, tk\) \{", r"^  \};", "    api: { phase, boxAt, check, drawTags },"),   # PATCH 3: export the internals the film drives
    ],
    "gl-labels.js": [   # demo scene, field, cameras and the demo registration; the solver, drawGL, kit and project stay
        (r"^  /\* ---------- the demo scene", r"^\}\)\(\);",
         "  A.patterns['gl-labels'] = { id: 'gl-labels', renderer: 'webgl', ROLES, solve, drawGL, kit, project: (cam, W, H) => projector(cam, W, H) };"),
    ],
    "gl-post.js": [     # demo variants (the film passes its own params)
        (r"^    variants: \(\(\) => \{", r"^    gains, rampAt"),
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
    parts = ["/* women-and-children draft A · film.js is GENERATED by lib/assemble.py; edit lib/film.src.js.\n"
             "   Arsenal modules inlined (comment-stripped, cut copies of lib/gl-stack-city.js, lib/gl-labels.js; lib/gl-post.js rides film.json libs). */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core','post'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* ── lib/%s sha256 %s%s ── */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], (" (cut, 3 lines replaced)" if m == "gl-stack-city.js" else " (cut)") if m in CUTS else "") + strip(body))
    parts.append(open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read())
    out = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print("film.js %d bytes" % len(out.encode()))

if __name__ == "__main__":
    main()
