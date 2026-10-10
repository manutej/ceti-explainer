#!/usr/bin/env python3
"""recompute.py · every number of the film `a-bell-from-dice`, regenerated deterministically.

    python3 factory/topics/a-bell-from-dice/recompute.py              print every claim (table)
    python3 factory/topics/a-bell-from-dice/recompute.py --claim ID   print one claim's value (the `expect` form)
    python3 factory/topics/a-bell-from-dice/recompute.py --write      rewrite claims.json and data/*.json

THE GENERATOR (the drafters' JavaScript must be this, bit for bit; it is the arsenal's mulberry32):

    function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

    const rnd = mulberry32(SEED);              // SEED = 1733 (de Moivre's year; any fixed seed would do)
    for (let i = 0; i < 100000; i++)           // roll i, in arrival order (count(t) = k shows rolls 0..k-1)
      for (let j = 0; j < 5; j++)              // die j of roll i; die 0 is "the first die"
        face[i][j] = 1 + Math.floor(rnd() * 6);  // one draw per die, draws consumed in the order 5*i + j
    sum[i] = face[i][0] + ... + face[i][4]

One stream, one seed, 500,000 draws, no re-seeding per roll. Python below mirrors it in uint32 arithmetic
(JS `|0`, `Math.imul`, `>>>` all act on the same 32 bits; `t + imul(..) ^ t` parses as `(t + imul(..)) ^ t`).

THE EXACT DISTRIBUTION: the number of ways five dice make sum s, out of 6^5 = 7,776 equally likely outcomes,
by inclusion-exclusion: ways(s) = sum_k (-1)^k C(5,k) C(s - 6k - 1, 4), k = 0 .. floor((s-5)/6).
Stdlib only; numpy is not needed (and gives the same counts: it is only used if present, as a cross-check).
"""
import json, math, os, sys

SEED, ROLLS, DICE, FACES, CUT = 1733, 100_000, 5, 6, 25
HERE = os.path.dirname(os.path.abspath(__file__))
TOPIC = "a-bell-from-dice"
CMD = "python3 factory/topics/%s/recompute.py --claim " % TOPIC
M = 0xFFFFFFFF


def mulberry32(a):
    a &= M
    def nxt():
        nonlocal a
        a = (a + 0x6D2B79F5) & M
        t = ((a ^ (a >> 15)) * (a | 1)) & M
        t = ((t + (((t ^ (t >> 7)) * (t | 61)) & M)) & M) ^ t
        return ((t ^ (t >> 14)) & M) / 4294967296
    return nxt


def roll_all():
    rnd = mulberry32(SEED)
    first, sums, head = [], [], []
    for i in range(ROLLS):
        f = [1 + int(rnd() * FACES) for _ in range(DICE)]
        first.append(f[0]); sums.append(sum(f))
        if i < 10: head.append(f)
    return first, sums, head


def C(n, k):
    return math.comb(n, k) if 0 <= k <= n else 0


def ways(s):
    return sum((-1) ** k * C(DICE, k) * C(s - FACES * k - 1, DICE - 1) for k in range((s - DICE) // FACES + 1))


def ways_formula(s):
    """the same inclusion-exclusion as a plain arithmetic string (valid JS and Python), C(n,4) = n(n-1)(n-2)(n-3)/24"""
    terms = []
    for k in range((s - DICE) // FACES + 1):
        n = s - FACES * k - 1
        if n < 4:
            continue
        c5k = C(DICE, k)
        body = "%d*%d*%d*%d/24" % (n, n - 1, n - 2, n - 3)
        terms.append(("-" if k % 2 else "+") + ("%d*" % c5k if c5k != 1 else "") + body)
    f = "".join(terms)
    return f[1:] if f.startswith("+") else f


def build():
    first, sums, head = roll_all()
    S = list(range(DICE, DICE * FACES + 1))                       # 5 .. 30
    W = {s: ways(s) for s in S}
    O = FACES ** DICE
    assert sum(W.values()) == O
    sim = {s: 0 for s in S}
    for s in sums: sim[s] += 1
    fd = {d: first.count(d) for d in range(1, FACES + 1)}
    mat = [[0] * len(S) for _ in range(FACES)]                    # rows first die 1..6, cols sum 5..30
    for d, s in zip(first, sums): mat[d - 1][s - DICE] += 1
    tail = [s for s in S if s > CUT]
    mid = [s for s in S if 14 <= s <= 21]
    gaps = {s: abs(sim[s] / ROLLS - W[s] / O) for s in S}
    gmax_s = max(S, key=lambda s: (gaps[s], -s))
    mean_sim = sum(sums) / ROLLS
    sd_sim = math.sqrt(sum((x - mean_sim) ** 2 for x in sums) / ROLLS)
    # cross-check with numpy if present (same counts by construction)
    try:
        import numpy as np
        a = np.array(sums); assert int((a > CUT).sum()) == sum(sim[s] for s in tail)
    except ImportError:
        pass
    return dict(S=S, W=W, O=O, sim=sim, fd=fd, mat=mat, tail=tail, mid=mid, gaps=gaps, gmax_s=gmax_s,
                mean_sim=mean_sim, sd_sim=sd_sim, first=first, sums=sums, head=head)


def claims_doc(B):
    S, W, O, sim, fd, tail, mid = B["S"], B["W"], B["O"], B["sim"], B["fd"], B["tail"], B["mid"]
    P = {"rolls": ROLLS, "dice": DICE, "faces": FACES, "seed": SEED, "tailCut": CUT}
    for s in S: P["ways%d" % s] = W[s]
    for s in S: P["sim%d" % s] = sim[s]
    for d in range(1, FACES + 1): P["first%d" % d] = fd[d]
    for d in range(1, FACES + 1): P["tailFirst%d" % d] = sum(B["mat"][d - 1][s - DICE] for s in tail)
    P["simMean"] = B["mean_sim"]; P["simSd"] = B["sd_sim"]
    cl = []

    def add(cid, text, value, formula, source, where, recompute=False, renders=None, **kw):
        c = {"id": cid, "text": text, "value": value, "formula": formula, "source": source, "where": where}
        if recompute:
            c["recompute"] = CMD + cid
            c["expect"] = fmt(value)
        if renders: c["renders"] = renders
        c.update(kw)
        cl.append(c)

    tsum = lambda pre, ss: "+".join("%s%d" % (pre, s) for s in ss)
    # --- design inputs
    add("rolls", "100,000 rolls of five dice, one mark each", ROLLS, "rolls", "input", "CASE count-in; every caption that names the total", renders=["100,000"])
    add("dice", "five dice per roll", DICE, "dice", "input", "HOOK / CASE caption (word or digit)")
    add("faces", "six faces per die, 1 to 6", FACES, "faces", "input", "CASE first-die partition: six columns")
    add("tailCut", "the tail: sums above 25 (26 to 30)", CUT, "tailCut", "input", "HOOK question; COUNT tail, cut line")
    add("seed", "mulberry32 seed of the one stream (not on screen)", SEED, "seed", "S5", "recompute.py docstring; film lib")
    # --- exact combinatorics
    add("outcomes", "6 x 6 x 6 x 6 x 6 = 7,776 equally likely outcomes of five dice", O, "faces**dice", "derived", "COUNT exact caption", renders=["7,776"])
    add("sumMin", "lowest sum (all ones)", DICE, "dice", "derived", "axis left end")
    add("sumMax", "highest sum (all sixes)", DICE * FACES, "dice*faces", "derived", "axis right end")
    add("nSums", "26 possible sums, 5 to 30", len(S), "dice*faces-dice+1", "derived", "CASE sum partition: 26 columns")
    for s in S:
        add("ways%d" % s, "ways five dice make %d (of 7,776)" % s, W[s], ways_formula(s), "derived", "data/sums.json; COUNT exact bell", note="inclusion-exclusion, S3")
    add("waysTotal", "the ways add back to 7,776", O, tsum("ways", S), "derived", "check")
    add("waysTail", "ways to roll above 25: 70+35+15+5+1", sum(W[s] for s in tail), tsum("ways", tail), "derived", "COUNT exact caption")
    add("waysMode", "the middle sums 17 and 18: 780 ways each", W[17], "ways17", "derived", "COUNT exact bell peak")
    add("modeLo", "the likeliest sums are 17 and 18 (lower)", 17, "dice*(faces+1)/2-0.5", "derived", "COUNT bell peak label")
    add("modeHi", "the likeliest sums are 17 and 18 (upper)", 18, "dice*(faces+1)/2+0.5", "derived", "COUNT bell peak label")
    add("midLo", "middle band starts at 14 (mean minus one sd, rounded up)", 14, "Math.ceil(dice*(faces+1)/2-(dice*(faces*faces-1)/12)**0.5)", "derived", "MONDAY / COUNT middle band")
    add("midHi", "middle band ends at 21 (mean plus one sd, rounded down)", 21, "Math.floor(dice*(faces+1)/2+(dice*(faces*faces-1)/12)**0.5)", "derived", "MONDAY / COUNT middle band")
    add("waysMid", "ways to roll 14 to 21 (the middle eight sums)", sum(W[s] for s in mid), tsum("ways", mid), "derived", "MONDAY / COUNT middle band")
    for s in S:
        add("pExact%d" % s, "exact probability of sum %d" % s, W[s] / O, "ways%d/(faces**dice)" % s, "derived", "data/sums.json")
    for s in S:
        add("expect%d" % s, "expected rolls with sum %d out of 100,000" % s, ROLLS * W[s] / O, "rolls*ways%d/(faces**dice)" % s, "derived", "COUNT: the exact bell drawn flat over the cut")
    pt = sum(W[s] for s in tail) / O
    add("pTailExact", "exact chance of a sum above 25: 126 / 7,776", pt, "(%s)/(faces**dice)" % tsum("ways", tail), "derived", "COUNT")
    add("expTail", "expected tail rolls of 100,000 (exact)", ROLLS * pt, "rolls*(%s)/(faces**dice)" % tsum("ways", tail), "derived", "COUNT")
    add("expTailRound", "about 1,620 expected above 25", round(ROLLS * pt), "Math.round(rolls*(%s)/(faces**dice))" % tsum("ways", tail), "derived", "COUNT exact caption", renders=["1,620"])
    add("tailPctExact", "1.6 % exact", round(1000 * pt) / 10, "Math.round(1000*(%s)/(faces**dice))/10" % tsum("ways", tail), "derived", "COUNT ratio (after the count)", renders=["1.6 %", "1.6%"])
    add("pModePct", "the likeliest sum (17 or 18): 10.0 % each", round(1000 * W[17] / O) / 10, "Math.round(1000*ways17/(faces**dice))/10", "derived", "COUNT bell peak", renders=["10.0 %", "10 %"])
    add("pEdgePct", "sum 5 or sum 30: 0.013 % each (1 way)", round(100000 * W[5] / O) / 1000, "Math.round(100000*ways5/(faces**dice))/1000", "derived", "COUNT bell edge", renders=["0.013 %"])
    add("meanExact", "exact mean of the sum: 5 x 3.5", DICE * (FACES + 1) / 2, "dice*(faces+1)/2", "derived", "COUNT centre line")
    add("varExact", "exact variance: 5 x 35/12", DICE * (FACES ** 2 - 1) / 12, "dice*(faces*faces-1)/12", "derived", "formula line")
    add("sdExact", "exact standard deviation sqrt(5 x 35/12)", math.sqrt(DICE * (FACES ** 2 - 1) / 12), "(dice*(faces*faces-1)/12)**0.5", "derived", "COUNT width bracket", renders=["3.82", "3.8"])
    # --- uniform belief picture
    ub = ROLLS * len(tail) / len(S)
    add("beliefTail", "if every sum were equally likely: 5 of 26 sums, 19,231 rolls above 25", round(ub), "Math.round(rolls*5/(dice*faces-dice+1))", "derived", "HOOK/CASE belief picture; COUNT comparison", renders=["19,231"])
    add("beliefEach", "if every sum were equally likely: 3,846 rolls per sum", round(ROLLS / len(S)), "Math.round(rolls/(dice*faces-dice+1))", "derived", "CASE flat line over the sum columns", renders=["3,846"])
    add("beliefGuess", "the belief's round number: about 20,000", 20000, "Math.round(rolls*5/(dice*faces-dice+1)/10000)*10000", "derived", "HOOK question / COUNT comparison", renders=["20,000"])
    # --- simulation (recompute)
    for d in range(1, FACES + 1):
        add("first%d" % d, "rolls whose first die shows %d" % d, fd[d], "first%d" % d, "S5", "CASE first-die column %d" % d, recompute=True)
    add("firstMin", "smallest first-die pile", min(fd.values()), "Math.min(%s)" % ",".join("first%d" % d for d in range(1, 7)), "derived", "CASE flat caption")
    add("firstMax", "largest first-die pile", max(fd.values()), "Math.max(%s)" % ",".join("first%d" % d for d in range(1, 7)), "derived", "CASE flat caption")
    add("firstExpect", "a sixth of 100,000 (exact share per face)", ROLLS / FACES, "rolls/faces", "derived", "CASE flat line", renders=["16,667"])
    for s in S:
        add("sim%d" % s, "simulated rolls with sum %d" % s, sim[s], "sim%d" % s, "S5", "CASE sum column; COUNT cells", recompute=True)
    add("simTotal", "the simulated sums add back to 100,000", ROLLS, tsum("sim", S), "derived", "check")
    st = sum(sim[s] for s in tail)
    add("simTail", "rolls above 25 in the 100,000 (the count that lands)", st, tsum("sim", tail), "derived", "COUNT tail count (display face), before any ratio", recompute=True)
    add("tailPctSim", "simulated share above 25, 1 decimal", round(1000 * st / ROLLS) / 10, "Math.round(1000*(%s)/rolls)/10" % tsum("sim", tail), "derived", "COUNT ratio (after the count)", renders=["1.6 %", "1.6%"])
    add("tailGap", "simulated tail minus exact expectation (rolls)", st - round(ROLLS * pt), "(%s)-Math.round(rolls*(%s)/(faces**dice))" % (tsum("sim", tail), tsum("ways", tail)), "derived", "COUNT agreement caption")
    add("beliefTimes", "the belief over-counts the tail about this many times", round(ub / st), "Math.round(Math.round(rolls*5/(dice*faces-dice+1))/(%s))" % tsum("sim", tail), "derived", "COUNT comparison caption")
    sm = sum(sim[s] for s in mid)
    add("simMid", "simulated rolls with sums 14 to 21", sm, tsum("sim", mid), "derived", "MONDAY / COUNT middle band")
    add("midPctExact", "exact share of sums 14 to 21, 1 decimal", round(1000 * sum(W[s] for s in mid) / O) / 10, "Math.round(1000*(%s)/(faces**dice))/10" % tsum("ways", mid), "derived", "COUNT middle band", renders=["%.1f %%" % (round(1000 * sum(W[s] for s in mid) / O) / 10)])
    add("simMidPct", "simulated share of sums 14 to 21, 1 decimal", round(1000 * sm / ROLLS) / 10, "Math.round(1000*(%s)/rolls)/10" % tsum("sim", mid), "derived", "COUNT middle band", renders=["%.1f %%" % (round(1000 * sm / ROLLS) / 10)])
    P["roll0Sum"] = B["sums"][0]
    add("roll0Sum", "the first roll of the stream: faces %s, sum %d" % ("-".join(map(str, B["head"][0])), B["sums"][0]), B["sums"][0], "roll0Sum", "S5", "HOOK: the one roll on screen (pips) and its sum", recompute=True, faces=B["head"][0])
    for d in range(1, FACES + 1):
        add("tailFirst%d" % d, "rolls above 25 whose first die shows %d" % d, P["tailFirst%d" % d], "tailFirst%d" % d, "S5", "COUNT (draft b: 2D volume rows)", recompute=True)
    add("simMean", "simulated mean of the 100,000 sums", B["mean_sim"], "simMean", "S5", "COUNT centre line (sim)", recompute=True, renders=["%.2f" % B["mean_sim"]])
    add("simSd", "simulated standard deviation (population, /N)", B["sd_sim"], "simSd", "S5", "COUNT width bracket (sim)", recompute=True, renders=["%.2f" % B["sd_sim"]])
    g = B["gmax_s"]
    add("maxGapSum", "the sum where simulated and exact frequencies differ most", g, "%d" % g, "S5", "COUNT agreement caption", recompute=True)
    add("maxGap", "largest |simulated - exact| frequency over the 26 sums", B["gaps"][g], "Math.abs(sim%d/rolls-ways%d/(faces**dice))" % (g, g), "derived", "COUNT agreement caption")
    add("maxGapPts", "largest gap in percentage points, 2 decimals", round(10000 * B["gaps"][g]) / 100, "Math.round(10000*Math.abs(sim%d/rolls-ways%d/(faces**dice)))/100" % (g, g), "derived", "COUNT agreement caption", renders=["%.2f" % (round(10000 * B["gaps"][g]) / 100)])
    add("maxGapRolls", "the same gap in rolls (simulated minus expected, absolute, rounded)", round(abs(sim[g] - ROLLS * W[g] / O)), "Math.round(Math.abs(sim%d-rolls*ways%d/(faces**dice)))" % (g, g), "derived", "COUNT agreement caption")
    for c in cl:  # mark the simulated ones that carry an expect
        if c["source"] == "S5" and "recompute" not in c and c["id"] != "seed":
            c["recompute"] = CMD + c["id"]; c["expect"] = fmt(c["value"])
    return {"film": TOPIC, "params": P,
            "note": ("exact claims: `formula` over params (JS and Python alike; ** is power). Simulated claims: source S5 = "
                     "this package's recompute.py (mulberry32, seed 1733, one stream, 5 draws per roll, face = 1 + floor(u*6)); "
                     "run `recompute` and compare to `expect`, or `python3 factory/tools/repo_topic.py --check "
                     "factory/topics/a-bell-from-dice/claims.json`. Display claims round with Math.round to the shown precision; "
                     "the unrounded value is its own claim."),
            "sources": SOURCES, "claims": cl}


SOURCES = [
    {"tag": "S1", "author": "Abraham de Moivre", "title": "The Doctrine of Chances (2nd ed., with the 1733 approximation of the binomial by the normal curve)", "year": 1738, "where": "London: Woodfall"},
    {"tag": "S2", "author": "Pierre-Simon Laplace", "title": "Theorie analytique des probabilites (sums of many independent errors tend to the normal law)", "year": 1812, "where": "Paris: Courcier"},
    {"tag": "S3", "author": "Charles M. Grinstead, J. Laurie Snell", "title": "Introduction to Probability, 2nd rev. ed.: ch. 7 (sums of independent random variables, convolution of dice), ch. 9 (central limit theorem)", "year": 1997, "where": "American Mathematical Society; free PDF (GNU FDL)"},
    {"tag": "S4", "author": "Tommy Ettinger", "title": "Mulberry32, a 32-bit state PRNG (public domain)", "year": 2017, "where": "gist by tommyettinger; the arsenal's copy in arsenal/patterns/*/pattern.js"},
    {"tag": "S5", "author": "this package", "title": "factory/topics/a-bell-from-dice/recompute.py (the simulation; seed 1733)", "year": 2026, "where": "python3 factory/topics/a-bell-from-dice/recompute.py"},
]


def fmt(v):
    if isinstance(v, float) and not v.is_integer():
        return repr(v)
    return str(int(v))


def write(B, doc):
    with open(os.path.join(HERE, "claims.json"), "w") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False); f.write("\n")
    S, W, O, sim = B["S"], B["W"], B["O"], B["sim"]
    rows = [{"sum": s, "ways": W[s], "p_exact": W[s] / O, "expected": ROLLS * W[s] / O, "simulated": sim[s],
             "f_sim": sim[s] / ROLLS, "gap": sim[s] / ROLLS - W[s] / O, "tail": s > CUT} for s in S]
    meta = {"rolls": ROLLS, "dice": DICE, "faces": FACES, "seed": SEED, "generator": "mulberry32 (S4), one stream, draw 5*i+j is die j of roll i, face = 1 + floor(u*6)",
            "outcomes": O, "tail": "sum > %d" % CUT, "recompute": "python3 factory/topics/a-bell-from-dice/recompute.py --write"}
    with open(os.path.join(HERE, "data", "sums.json"), "w") as f:
        json.dump({"meta": meta, "rows": rows}, f, indent=1); f.write("\n")
    with open(os.path.join(HERE, "data", "first-die.json"), "w") as f:
        json.dump({"meta": meta, "rows": [{"first": d, "simulated": B["fd"][d], "expected": ROLLS / FACES} for d in range(1, FACES + 1)]}, f, indent=1); f.write("\n")
    with open(os.path.join(HERE, "data", "first-by-sum.json"), "w") as f:
        json.dump({"meta": dict(meta, rows="first die 1..6", cols="sum 5..30", use="gl-volume data (dataKind counts), hist-2d-slabs"),
                   "sums": S, "counts": B["mat"]}, f); f.write("\n")
    # a check list for the drafters' JS: cumulative counts at round k (count(t) = k rolls shown)
    ck = {}
    for k in (1, 10, 100, 1000, 10000, 50000, 100000):
        ss = B["sums"][:k]; fs = B["first"][:k]
        ck[str(k)] = {"tail": sum(1 for x in ss if x > CUT), "first6": fs.count(6), "sumOfSums": sum(ss)}
    with open(os.path.join(HERE, "data", "checkpoints.json"), "w") as f:
        json.dump({"meta": dict(meta, what="after the first k rolls: tail count, first die = 6 count, sum of sums; and the first 10 rolls"),
                   "at": ck, "first10": [{"faces": B["head"][i], "first": B["first"][i], "sum": B["sums"][i]} for i in range(10)]}, f, indent=1); f.write("\n")


def main():
    B = build(); doc = claims_doc(B)
    a = sys.argv[1:]
    if a[:1] == ["--claim"]:
        c = next((c for c in doc["claims"] if c["id"] == a[1]), None)
        if c is None: sys.exit("no claim " + a[1])
        print(fmt(c["value"])); return
    if a[:1] == ["--write"]:
        write(B, doc); print("wrote claims.json (%d claims) and data/{sums,first-die,first-by-sum,checkpoints}.json" % len(doc["claims"])); return
    S, W, O, sim = B["S"], B["W"], B["O"], B["sim"]
    print("a-bell-from-dice · %d rolls of %d dice · mulberry32 seed %d · tail = sum > %d" % (ROLLS, DICE, SEED, CUT))
    print("\nsum  ways/7776   p_exact     expected   simulated  f_sim     gap")
    for s in S:
        print("%3d  %5d      %.6f  %9.2f  %9d  %.6f  %+.6f%s" % (s, W[s], W[s] / O, ROLLS * W[s] / O, sim[s], sim[s] / ROLLS, sim[s] / ROLLS - W[s] / O, "  tail" if s > CUT else ""))
    print("\nfirst die: " + "  ".join("%d:%d" % (d, B["fd"][d]) for d in range(1, 7)) + "   (exact %.2f each)" % (ROLLS / 6))
    st = sum(sim[s] for s in B["tail"]); wt = sum(W[s] for s in B["tail"])
    print("tail > %d: simulated %d · exact %d/%d = %.6f -> expected %.2f" % (CUT, st, wt, O, wt / O, ROLLS * wt / O))
    print("mean: exact %.4f · simulated %.4f    sd: exact sqrt(5*35/12) = %.6f · simulated %.6f" % (17.5, B["mean_sim"], math.sqrt(175 / 12), B["sd_sim"]))
    g = B["gmax_s"]
    print("largest |f_sim - p_exact|: %.6f at sum %d (%.2f points; %d rolls)" % (B["gaps"][g], g, 100 * B["gaps"][g], round(abs(sim[g] - ROLLS * W[g] / O))))
    print("\nclaims (%d):" % len(doc["claims"]))
    for c in doc["claims"]:
        print("  %-14s %-22s %s" % (c["id"], fmt(c["value"]), c["text"]))


if __name__ == "__main__":
    main()
