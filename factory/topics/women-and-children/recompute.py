#!/usr/bin/env python3
"""recompute.py · every number the film `women-and-children` may show, recomputed from data/titanic.json.

    python3 factory/topics/women-and-children/recompute.py            # print every claim: id, value, formula, text
    python3 factory/topics/women-and-children/recompute.py --check    # compare with claims.json (exit 1 on any mismatch)
    python3 factory/topics/women-and-children/recompute.py --emit     # rewrite claims.json from the table below
    python3 factory/topics/women-and-children/recompute.py --value c3ChildRate   # print one value

Deterministic: no randomness, no network. The formulas are written in the subset shared by Python and the gate's JS
sandbox (+ - * / parentheses, round(x) = Math.round half-up), so the gate (G5a) recomputes the same values from the
claim ids. Cell ids: <class><sex><age><survived>, class p1 p2 p3 cr, sex M F, age A (adult) C (child), survived y n.
The 32 cells were transcribed from memory of Dawson (1995); verify against the published table before public use.
"""
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLS = {"1st": "p1", "2nd": "p2", "3rd": "p3", "Crew": "cr"}
CLS_WORD = {"p1": "first-class", "p2": "second-class", "p3": "third-class", "cr": "crew"}
SEX = {"Male": "M", "Female": "F"}
AGE = {"Adult": "A", "Child": "C"}
SURV = {"Yes": "y", "No": "n"}


def round_half_up(x, d=0):
    """The gate's round: Math.round(x * 10**d) / 10**d (half toward +infinity)."""
    return math.floor(x * 10 ** d + 0.5) / 10 ** d


def load_cells():
    doc = json.load(open(os.path.join(HERE, "data", "titanic.json")))
    cells = {}
    for c in doc["cells"]:
        cells[CLS[c["class"]] + SEX[c["sex"]] + AGE[c["age"]] + SURV[c["survived"]]] = int(c["n"])
    assert len(cells) == 32, "expected 32 cells"
    return doc, cells


def spec():
    """(id, text, formula, source, where). Formulas reference cell ids and earlier claim ids."""
    S1 = "S1"  # Dawson 1995 table (cells transcribed from memory; unverified)
    rows = []
    # 1. the 32 cells, each its own claim (so the gate scope holds them without film.params)
    for cw, c in CLS.items():
        for sw, s in SEX.items():
            for aw, a in AGE.items():
                for vw, v in SURV.items():
                    rows.append((c + s + a + v, f"{cw} class, {sw.lower()}, {aw.lower()}, survived {vw}: cell count",
                                 None, S1, "data only (gl-stack-city n/hit matrix)"))
    R = rows.append
    # 2. groups per class (adult men, adult women, boys, girls, children, women and children, everyone)
    for c, w in CLS_WORD.items():
        R((c + "MenN", f"{w} men aboard", f"{c}MAy + {c}MAn", "derived", ""))
        R((c + "MenY", f"{w} men who lived", f"{c}MAy", "derived", ""))
        R((c + "MenRate", f"{w} men who lived, %", f"round(100 * {c}MenY / {c}MenN)", "derived", ""))
        R((c + "WomenN", f"{w} women aboard", f"{c}FAy + {c}FAn", "derived", ""))
        R((c + "WomenY", f"{w} women who lived", f"{c}FAy", "derived", ""))
        R((c + "WomenRate", f"{w} women who lived, %", f"round(100 * {c}WomenY / {c}WomenN)", "derived", ""))
        if c != "cr":  # the crew had no children (cells are 0); no rate exists
            R((c + "BoysN", f"{w} boys aboard", f"{c}MCy + {c}MCn", "derived", ""))
            R((c + "BoysY", f"{w} boys who lived", f"{c}MCy", "derived", ""))
            R((c + "BoysRate", f"{w} boys who lived, %", f"round(100 * {c}BoysY / {c}BoysN)", "derived", ""))
            R((c + "GirlsN", f"{w} girls aboard", f"{c}FCy + {c}FCn", "derived", ""))
            R((c + "GirlsY", f"{w} girls who lived", f"{c}FCy", "derived", ""))
            R((c + "GirlsRate", f"{w} girls who lived, %", f"round(100 * {c}GirlsY / {c}GirlsN)", "derived", ""))
        R((c + "ChildN", f"{w} children aboard (boys and girls)", f"{c}MCy + {c}MCn + {c}FCy + {c}FCn", "derived", ""))
        R((c + "ChildY", f"{w} children who lived", f"{c}MCy + {c}FCy", "derived", ""))
        if c != "cr":
            R((c + "ChildRate", f"{w} children who lived, %", f"round(100 * {c}ChildY / {c}ChildN)", "derived", ""))
        R((c + "WcN", f"{w} women and children aboard", f"{c}WomenN + {c}ChildN", "derived", ""))
        R((c + "WcY", f"{w} women and children who lived", f"{c}WomenY + {c}ChildY", "derived", ""))
        R((c + "WcRate", f"{w} women and children who lived, %", f"round(100 * {c}WcY / {c}WcN)", "derived", ""))
        R((c + "N", f"{w} people aboard", f"{c}MenN + {c}WomenN + {c}ChildN", "derived", ""))
        R((c + "Y", f"{w} people who lived", f"{c}MenY + {c}WomenY + {c}ChildY", "derived", ""))
        R((c + "Rate", f"{w} people who lived, %", f"round(100 * {c}Y / {c}N)", "derived", ""))
    # 3. pooled (the belief's view)
    R(("people", "people aboard, one box each", "p1N + p2N + p3N + crN", "derived", ""))
    R(("survived", "people who lived", "p1Y + p2Y + p3Y + crY", "derived", ""))
    R(("lost", "people who did not", "people - survived", "derived", ""))
    R(("survivedRate", "everyone aboard who lived, %", "round(100 * survived / people)", "derived", ""))
    R(("menN", "men aboard (adult males, all classes and crew)", "p1MenN + p2MenN + p3MenN + crMenN", "derived", ""))
    R(("menY", "men who lived", "p1MenY + p2MenY + p3MenY + crMenY", "derived", ""))
    R(("menRate", "men who lived, %", "round(100 * menY / menN)", "derived", ""))
    R(("womenN", "women aboard (adult females)", "p1WomenN + p2WomenN + p3WomenN + crWomenN", "derived", ""))
    R(("womenY", "women who lived", "p1WomenY + p2WomenY + p3WomenY + crWomenY", "derived", ""))
    R(("womenRate", "women who lived, %", "round(100 * womenY / womenN)", "derived", ""))
    R(("childN", "children aboard", "p1ChildN + p2ChildN + p3ChildN + crChildN", "derived", ""))
    R(("childY", "children who lived", "p1ChildY + p2ChildY + p3ChildY + crChildY", "derived", ""))
    R(("childRate", "children who lived, %", "round(100 * childY / childN)", "derived", ""))
    R(("wcN", "women and children aboard", "womenN + childN", "derived", ""))
    R(("wcY", "women and children who lived", "womenY + childY", "derived", ""))
    R(("wcRate", "women and children who lived, %", "round(100 * wcY / wcN)", "derived", ""))
    # 4. the gap
    R(("p12ChildN", "children in first and second class", "p1ChildN + p2ChildN", "derived", ""))
    R(("p12ChildY", "of them, lived", "p1ChildY + p2ChildY", "derived", ""))
    R(("p3ChildLost", "third-class children who did not live", "p3ChildN - p3ChildY", "derived", ""))
    R(("p3ChildPer10", "third-class children who lived, per 10", "round(10 * p3ChildY / p3ChildN)", "derived", ""))
    R(("p1MenPer10", "first-class men who lived, per 10", "round(10 * p1MenY / p1MenN)", "derived", ""))
    R(("crShare", "crew as a share of everyone aboard, %", "round(100 * crN / people)", "derived", ""))
    R(("menP3CrN", "men who were crew or third class", "p3MenN + crMenN", "derived", ""))
    R(("menP3CrShare", "share of all men who were crew or third class, %", "round(100 * menP3CrN / menN)", "derived", ""))
    # 5. furniture
    R(("year", "the sinking, April 1912", "1912", "S2", ""))
    R(("perBox", "one box = one person (k = 1, no batching)", "1", "derived", ""))
    R(("groups", "pooled groups: women, children, men", "3", "derived", ""))
    R(("slabs", "split slabs: 3 groups x 4 classes (crew children: 0 boxes)", "groups * 4", "derived", ""))
    R(("crChildN0", "crew children aboard", "crChildN", "derived", ""))
    R(("perTen", "the natural-frequency base: 'in 10'", "10", "derived", ""))
    return rows


WHERE = {  # beat-sheet placement (beats.md); the drafter adds its own `where` for every digit it draws
    "year": "caption c3 (12.4 s)",
    "people": "readout + caption c5 (24.0 s, count.at); c9 (48.0 s)",
    "perBox": "readout '1 BOX = 1 PERSON' (12.4 s on)",
    "survived": "readout + caption c6 (30.0 s)", "lost": "caption c6 (30.0 s)",
    "womenY": "pooled pin + caption c7 (36.0 s)", "womenN": "pooled pin + caption c7 (36.0 s)",
    "childY": "pooled pin + caption c7 (36.0 s)", "childN": "pooled pin + caption c7 (36.0 s)",
    "menY": "pooled pin + caption c7 (36.0 s)", "menN": "pooled pin + caption c7 (36.0 s); c18 (102 s)",
    "womenRate": "pooled pin % (37.5 s, ratioDelay 1.5)", "childRate": "pooled pin % (37.5 s)",
    "menRate": "pooled pin % (37.5 s); caption c8 (42.0 s); c18",
    "wcY": "caption c8 (42.0 s)", "wcN": "caption c8 (42.0 s)", "wcRate": "caption c8 (42.0 s)",
    "p12ChildN": "caption c12 (64.0 s)", "p12ChildY": "caption c12 (64.0 s)",
    "p3ChildY": "slab pin (58.4 s); callout + caption c13 (70.0 s)", "p3ChildN": "slab pin; callout + c13 (70.0 s)",
    "p3ChildLost": "caption c13 (70.0 s)",
    "p1MenY": "slab pin; callout + caption c14 (76.0 s)", "p1MenN": "slab pin; callout + c14 (76.0 s)",
    "p3ChildRate": "slab pin % (60 s); reveal result + caption c15 (84.0 s)",
    "p1MenRate": "slab pin % (60 s); reveal result + caption c15 (84.0 s)",
    "p3ChildPer10": "reveal result '3 IN 10' + caption c16 (90.0 s)", "p1MenPer10": "reveal result + c16 (90.0 s)",
    "crN": "callout + caption c17 (96.0 s)", "crY": "callout + caption c17 (96.0 s)", "crShare": "caption c17 (96.0 s)",
    "crWomenY": "slab pin (58.4 s); callout sub (98 s)", "crWomenN": "slab pin; callout sub (98 s)",
    "menP3CrN": "caption c18 (102.0 s)", "perTen": "reveal result '3 IN 10' + caption c16 (90.0 s)",
    "slabs": "none (layout)", "groups": "none (layout)", "crChildN0": "none (empty slab, see NOTES)",
}
SLAB_PINS = ["p1Women", "p1Child", "p1Men", "p2Women", "p2Child", "p2Men", "p3Women", "p3Child", "p3Men", "crWomen", "crMen"]
for g in SLAB_PINS:
    for suf, w in (("N", "slab pin count (58.4 s on)"), ("Y", "slab pin count (58.4 s on)"), ("Rate", "slab pin % (+1.5 s after its count)")):
        WHERE.setdefault(g + suf, w)
for g in ("p1Child", "p2Child"):
    WHERE.setdefault(g + "Y", "slab pin + caption c12 (64.0 s)")


def compute():
    doc, cells = load_cells()
    scope = {"round": round_half_up}
    scope.update(cells)
    out = []
    for cid, text, formula, source, where in spec():
        if formula is None:
            val = cells[cid]
        else:
            val = eval(formula, {"__builtins__": {}}, scope)
            if isinstance(val, float) and val.is_integer():
                val = int(val)
        scope[cid] = val
        out.append({"id": cid, "text": text, "value": val, "formula": formula, "source": source,
                    "recompute": f"python3 factory/topics/women-and-children/recompute.py --value {cid}",
                    "expect": str(val), "where": WHERE.get(cid, where or "not on screen (available)")})
    return doc, cells, out


PARAMS_NOTE = ("cells are claims (source S1); formulas use claim ids only, so the gate scope needs no film.params; "
               "rates are round(100*y/n) half-up as the gate's round()")


def main(argv):
    doc, cells, claims = compute()
    path = os.path.join(HERE, "claims.json")
    if "--value" in argv:
        cid = argv[argv.index("--value") + 1]
        print(next(c["value"] for c in claims if c["id"] == cid))
        return 0
    if "--emit" in argv:
        body = {"film": "women-and-children",
                "data": "factory/topics/women-and-children/data/titanic.json",
                "verified": False,
                "warning": "The 32 cells were transcribed from memory of Dawson (1995); verify against the published table before any public use.",
                "rounding": PARAMS_NOTE,
                "params": {},
                "sources": SOURCES,
                "claims": claims}
        json.dump(body, open(path, "w"), indent=1, ensure_ascii=False)
        print(f"wrote {path}: {len(claims)} claims")
        return 0
    if "--check" in argv:
        have = {c["id"]: c["value"] for c in json.load(open(path))["claims"]}
        bad = [(c["id"], have.get(c["id"]), c["value"]) for c in claims if have.get(c["id"]) != c["value"]]
        for b in bad:
            print("MISMATCH", *b)
        print(f"{len(claims) - len(bad)} of {len(claims)} claims agree with claims.json")
        return 1 if bad else 0
    print(f"# {doc['title']}\n# provenance: {doc['provenance']}\n")
    print(f"{'id':<16} {'value':>6}  formula / text")
    for c in claims:
        if c["formula"] is None:
            continue
        print(f"{c['id']:<16} {c['value']:>6}  {c['formula']}  ·  {c['text']}")
    print(f"\n{len(claims)} claims ({sum(1 for c in claims if c['formula'] is None)} table cells, total {sum(cells.values())} people)")
    return 0


SOURCES = [
    {"tag": "S1", "author": "Dawson, Robert J. MacG.", "title": "The 'Unusual Episode' Data Revisited", "year": 1995,
     "where": "Journal of Statistics Education 3(3); cells transcribed from memory, NOT verified against the published table"},
    {"tag": "S2", "author": "British Board of Trade (Wreck Commissioner's inquiry, Lord Mersey)", "title": "Report on the Loss of the 'Titanic' (S.S.)", "year": 1912,
     "where": "London: HMSO; reprinted 1990, Gloucester: Allan Sutton. The counts Dawson's table is based on."},
    {"tag": "S3", "author": "R Core Team", "title": "Titanic: Survival of passengers on the Titanic (datasets package)", "year": 2024,
     "where": "R documentation ?Titanic: 4-d table of 2,201 observations, source Dawson (1995); notes primary sources disagree on exact numbers"},
    {"tag": "S4", "author": "Arel-Bundock, V. (Rdatasets) via pydataset 0.2.0", "title": "csv/datasets/Titanic.csv", "year": 2016,
     "where": "a secondary copy found in a local scratch folder; 32 of 32 cells agree with S1-from-memory; untrusted, not a substitute for S1"},
    {"tag": "S5", "author": "Simonoff, Jeffrey S.", "title": "The 'Unusual Episode' and a Second Statistics Course", "year": 1997,
     "where": "Journal of Statistics Education 5(1); analyses the same table (citation from memory, verify)"},
]

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
