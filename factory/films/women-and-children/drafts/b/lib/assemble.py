#!/usr/bin/env python3
"""lib/assemble.py (women-and-children draft B) · writes ../film.js = three arsenal modules (verbatim copies in lib/, comments
and indentation stripped, demo-only blocks cut from the assembled copy) + lib/film.src.js (the film). kit2 inlines only
film.js, so this concatenation is how the arsenal reaches the page. Deterministic (run twice: identical bytes).
Modules: gl-stack-city (2,201 boxes, two homes per box), gl-labels (the slab pins and the hard-cut callout), gl-post (the
linear-light stack: tone map always, bloom on the counted group in the reveal). The lib/*.js copies are verbatim; every
change is a CUT below, written against a line of the copy (shape: factory/films/simpsons-3d/lib/assemble.py)."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__))
MODS = ["gl-stack-city.js", "gl-labels.js", "gl-post.js"]   # arsenal/patterns/gl-stack-city, gl-labels, gl-post (pattern.js each)

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

# Each cut is (start regex, end regex | None, replacement?): the block from the first matching line up to, not including,
# the end anchor (None = the one line). Cuts change only the assembled copy.
CUTS = {
    "gl-stack-city.js": [
        # [draft b] the ONLY behavioural edit: rows of a slab fill from +z instead of -z (mirror inside each slab), so the pooled
        # one-layer carpets grow from the near edge in the plan view (a baseline at the bottom of the frame, lit bottom-up).
        (r"^    return \[sl\.cx \+ \(ix \+ 0\.5 - sl\.a / 2\) \* P", None,
         "    return [sl.cx + (ix + 0.5 - sl.a / 2) * P, -(layer + 0.5) * P, sl.cz - (iz + 0.5 - sl.b / 2) * P];"),
        (r"^  /\* ── shader: positions", r"^  /\* ── state from t"),            # module shader, palette, faces, camera (the film owns them)
        (r"^  /\* tagged units: accent box", r"^  const PAT = \{"),            # module drawing: tags, ground, boxes, pins, hud (canvas text)
        (r"^  const PAT = \{", r"^\}\)\(\);",                                # export: setup (data + bake only) and the pure helpers
         "  A.patterns[ID] = { id: ID, renderer: 'webgl', api: { phase, boxAt, check },\n"
         "    async setup(p, ctx, params) { const st = { seed: ctx.seed == null ? 7 : ctx.seed }; st.data = resolveData(params.data, st.seed); buildBoxes(p, st, params); return st; } };"),
    ],
    "gl-labels.js": [
        # [draft b] a secondary label's sub line is secondary (14 mono), not chrome (12): the slab % is a result (never the smallest face)
        (r"^    secondary: \{ size: 14", None,
         "    secondary: { size: 14, fam: 'mono', color: 'ink',    data: 'secondary', sub: 'secondary' },"),
        (r"^  /\* ---------- drawing: flat", r"^\}\)\(\);",                    # demo drawing, scene and export -> solver-only export
         "  A.patterns['gl-labels'] = { id: 'gl-labels', renderer: 'webgl', ROLES, solve, project: (cam, W, H) => projector(cam, W, H) };"),
    ],
    "gl-post.js": [
        (r"^    variants: \(\(\) => \{", r"^    gains, rampAt,"),                 # demo variants
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
    parts = ["/* women-and-children draft B · film.js is GENERATED by lib/assemble.py; edit lib/film.src.js.\n"
             "   Arsenal modules inlined (comment-stripped, cut copies of lib/*.js): " + ", ".join(MODS) + " */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core','post'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS:
        src = open(os.path.join(HERE, m), encoding="utf-8").read()
        body = cut(src, CUTS[m]) if m in CUTS else src
        parts.append("/* ── lib/%s sha256 %s%s ── */\n" % (m, hashlib.sha256(src.encode()).hexdigest()[:16], " (cut)" if m in CUTS else "") + strip(body))
    fsrc = open(os.path.join(HERE, "film.src.js"), encoding="utf-8").read()   # stripped too (G8: film code < 120 KB with a 44 KB claims.json)
    parts.append("/* ── lib/film.src.js sha256 %s (stripped) ── */\n" % hashlib.sha256(fsrc.encode()).hexdigest()[:16] + strip(fsrc))
    out = "\n".join(parts) + "\n"
    with open(os.path.join(HERE, "..", "film.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print("film.js %d bytes" % len(out.encode()))

if __name__ == "__main__":
    main()
