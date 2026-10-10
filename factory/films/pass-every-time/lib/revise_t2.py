#!/usr/bin/env python3
"""lib/revise_t2.py · tier-2 revision (2026-10-10): edits ../film.json IN PLACE (knobs, knobs_doc, captions) on top of rounds 1-2.
Idempotent: run twice, same file. Never regenerates film.json (lib/make_film_json.py is retired for this reason)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); FJ = os.path.join(HERE, "..", "film.json")
f = json.load(open(FJ, encoding="utf-8"))
K, DOC = f["knobs"], f["knobs_doc"]
idx = {d["name"]: d for d in DOC}
def setk(name, val, rng=None, step=None, what=None):
    K[name] = val
    d = idx.get(name)
    if d is None:
        d = {"name": name, "range": rng, "step": step, "what": what}; DOC.append(d); idx[name] = d
    if rng is not None: d["range"] = rng
    if step is not None: d["step"] = step
    if what is not None: d["what"] = what
def drop(name):
    K.pop(name, None)
    if name in idx: DOC.remove(idx.pop(name))
# Beyond scope 1: the four-result ladder becomes a pair (one try / every try), each count line before its ratio
for n in ("lad2", "lad3"): drop(n)
setk("lad1", 82.6, what="s: the pair opens: the one-try count line (278 of 460), its ratio follows after ladLead")
setk("lad4", 85.6, [84.5, 89.5], what="s: the every-try count line (44 of 115), its ratio (gold) follows after ladLead")
setk("ladLead", 0.8, [0.3, 1.5], 0.1, "s: a count line leads the ratio above it (counts before ratios, on stage)")
setk("ladXL", 370, [250, 450], 1, "sheet units: centre of the one-try half of the pair")
setk("ladXR", 630, [510, 710], 1, "sheet units: centre of the every-try half of the pair")
setk("ladOut", 91.0, what="s: the pair starts to fade")
# Beyond scope 3: re-sort into bands by tries passed
setk("sortRows", 11, [8, 14], 1, "columns per band slice front to back after M2 (11: the 44 full columns are one 4 x 11 block)")
setk("sortAisle", 0.7, [0.0, 1.5], 0.05, "tile pitches: aisle between the bands (4, 3, 2, 1, 0 tries passed) after M2")
# Beyond scope 4: the bookend lands on the opening plan pose; Monday type in the side columns, no global dim
for n in ("bookDist", "bookLookZ"): drop(n)
setk("bookT0", 135.4, what="s: the bookend starts: the camera rises back to the opening plan pose and the cubes return to their tiles")
setk("bookT1", 139.4, what="s: the bookend lands: the opening frame, only the tasks that passed all four tries still gold")
setk("mondayDim", 0.0, what="0-1: how far the floor is mixed toward the ground under the Monday type (0: the type sits beside the field)")
setk("qIn", 139.6, [137.0, 141.0], what="s: the Monday question fades in (left column, beside the field)")
setk("qOut", 149.3, [143.0, 149.4], what="s: the Monday columns and the bookend legend start to fade (gone before the card at 150; the card type crosses the right column)")
setk("honestIn", 143.6, [141.0, 146.0], what="s: the one honest-limits line fades in (right column; stage type; no caption shows after 139.4)")
setk("mondaySize", 28)
setk("honestSize", 28)
setk("colPad", 16, [8, 40], 1, "sheet units: air between the opening field box and the Monday columns")
setk("monY", 186, [140, 240], 1, "sheet units: first baseline of the Monday columns")
# Beyond scope 5: the 27 min reference pin beside about 10x in the display face
setk("refPinSize", 24, [14, 34], 1, "sheet units: the 27 min reference pin (display face, gold) beside the 289 column")
# Beyond scope 6: the first marks of the next scene arrive at the cut
setk("prT0", 99.8, [99.5, 102.0], what="s: the first pull request cube arrives (0.2 s before the cut, so the cut lands on the first row)")
setk("min27T0", 120.8, [120.5, 125.0], what="s: the first minute cube of the 80 % column arrives (0.2 s before the cut, so the cut lands on it)")
# captions 14-16 (ratio pair) and 29 (Monday, ends as the bookend lands)
C = f["captions"]
def cap(t0, t1, text):
    for c in C:
        if abs(c[0] - t0) < 1e-6: c[1] = t1; c[2] = text; return
    raise SystemExit("no caption at %s" % t0)
cap(82.6, 85.4, "Count one try at a time: 60.4 %.")
cap(85.6, 88.0, "Count each task by all four tries: 38.3 %.")
cap(88.2, 91.0, "Same cubes, two answers. Which one was quoted?")
cap(135.3, 139.3, "On Monday, ask for the every-time number.")
with open(FJ, "w", encoding="utf-8") as o:
    json.dump(f, o, ensure_ascii=False, separators=(",", ":")); o.write("\n")
print("film.json: %d knobs, %d captions" % (len(K), len(C)))
