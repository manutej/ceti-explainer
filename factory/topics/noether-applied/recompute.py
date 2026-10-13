#!/usr/bin/env python3
"""noether-applied · recompute every number the film draws, and write the point clouds.

Run:   python3 -I factory/topics/noether-applied/recompute.py            # fast: read the cached runs in data/, recompute every claim value
       python3 -I factory/topics/noether-applied/recompute.py --run      # slow (about 4 min): rebuild the caches (gcc + numpy), then recompute
       python3 -I factory/topics/noether-applied/recompute.py --check    # also compare against claims.json (value of every claim with a "key")

numpy only, fixed seed (SEED = 20261010), no network. Five parts, one per system plus the shared counts.

A. SYMPLECTIC INTEGRATORS (system 1). Runs verlet_vs_rk4.c (A-grade DERIVED, already in this folder; args e steps_per_orbit orbits mode)
   and data/trace.c (same physics, prints 1,000 log-spaced snapshots). Earth-shaped orbit e = 0.0167, G*M = 1, 100 steps per orbit,
   1,000,000,000 steps = 10,000,000 orbits. mode 0 velocity Verlet (keeps the energy-like number in a bounded band, spin to rounding),
   mode 1 classical RK4 ("the plain stepper"). Cache: data/c_runs.json, data/trace_verlet.csv, data/trace_rk4.csv.
   A snapshot k is one dot. Cloud for the film: x, y = position, z = log10(step); a = semi-major axis / start value = radius of the shell
   (a cylinder of constant a); the film stretches the radial error for the eye and says so in words, never in a digit.
B. MACHINE LEARNING (system 2). B1 balanced layers: read part 1's network run (../noether-symmetry/data/recompute_out.json, network.json:
   100 runs x 100 steps = 10,000 dots, 16 hidden units) and reuse its three numbers. B2 Hamiltonian vs plain network: the PUBLISHED pair
   (Greydanus, Dzamba, Yosinski 2019, Table 1: 170 vs 0.38, units 1e-3) are inputs; we also train our OWN toy pair (numpy, 1 hidden layer of
   200 tanh units, 2,000 Adam steps, ideal spring) and integrate both 300 periods. Our toy's ratio is NOT the paper's and is never on screen;
   it only supplies the 200 dots per network (phase plane x time). Cache: data/ml_traces.csv, data/ml_out.json.
C. WEATHER AND FLUIDS (system 3). Three point vortices stir a closed loop of 2,000 tagged parcels (RK4, dt 0.005). Kelvin: the circulation
   around the moving loop stays equal to the strength of the vortex it encloses. Off-screen numbers only (the film shows no digit here):
   max relative change of the discrete circulation, and how far the loop is stretched. Cache: data/kelvin_loop.csv (30 frames), data/kelvin_out.json.
D. EQUIVARIANCE (system 4). A seeded stand-in chain of 2,180 points (the COUNT is the residue count of CASP14 target T1044, Jumper et al.
   2021 Fig. 1d, PDB 6VR4; the coordinates are NOT the real fold) and one equivariant layer (sum of distance-weighted neighbour vectors).
   Turn the input by a random rotation: the output turns with it (error ~1e-15); the table of distances does not change. A plain layer
   (fixed matrix) fails the same test. Off-screen numbers only.
E. DERIVED CLAIM VALUES (value of every claim with a "key" in claims.json).
"""
import json, os, sys, csv, subprocess, tempfile, math
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
P1 = os.path.join(HERE, "..", "noether-symmetry", "data")
SEED = 20261010
RUN = "--run" in sys.argv
CHECK = "--check" in sys.argv

# ------------------------------------------------------------------ parameters (also in claims.json "params")
ECC = 0.0167            # Earth's eccentricity, NASA fact sheet (S1, same as part 1)
SPO = 100               # steps per orbit
ORBITS_BIG = 10_000_000
STEPS = SPO * ORBITS_BIG
SNAPS = 1000            # snapshots (dots) per stepper
HNN_PAPER_BASE, HNN_PAPER_HNN = 170, 0.38     # Greydanus 2019 Table 1 (units 1e-3)
HNN_HIDDEN, HNN_STEPS = 200, 2000
T1044_RESIDUES = 2180   # Jumper et al. 2021, Nature 596, Fig. 1d caption
KELVIN_PARCELS = 2000


def sh(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw).stdout


# ------------------------------------------------------------------ A. integrators
def run_c():
    tmp = tempfile.mkdtemp(prefix="noether_applied_")
    exe1, exe2 = os.path.join(tmp, "vr"), os.path.join(tmp, "trace")
    sh(["gcc", "-O2", os.path.join(HERE, "verlet_vs_rk4.c"), "-lm", "-o", exe1])
    sh(["gcc", "-O2", os.path.join(DATA, "trace.c"), "-lm", "-o", exe2])
    runs = {}
    # (mode, orbits): the cases the film quotes
    for name, mode, orbits in (("verlet_1e9", 0, ORBITS_BIG), ("verlet_1e7", 0, 100_000), ("rk4_1e6", 1, 10_000), ("rk4_1e7", 1, 100_000)):
        out = sh([exe1, str(ECC), str(SPO), str(orbits), str(mode)])
        last = out.strip().splitlines()
        runs[name] = dict(mode=mode, orbits=orbits, steps=orbits * SPO, lines=last)
    json.dump(runs, open(os.path.join(DATA, "c_runs.json"), "w"), indent=1)
    for mode, fn in ((0, "trace_verlet.csv"), (1, "trace_rk4.csv")):
        out = sh([exe2, str(ECC), str(SPO), str(STEPS), str(SNAPS), str(mode)])
        open(os.path.join(DATA, fn), "w").write(out)


def parse_run(lines):
    """last two lines of verlet_vs_rk4.c: final checkpoint and the max line."""
    fin = [l for l in lines if l.startswith("steps=")][-1]
    mx = [l for l in lines if l.startswith("max|dE/E|")][-1]
    g = lambda s, key: float(s.split(key + "=")[1].split()[0])
    return dict(dE_final=g(fin, "dE/E"), dL_final=g(fin, "dL/L"), maxdE=g(mx, "checkpoints"), maxdL=g(mx, "max|dL/L|"))


def part_a():
    runs = json.load(open(os.path.join(DATA, "c_runs.json")))
    R = {k: parse_run(v["lines"]) for k, v in runs.items()}
    tr = {}
    for name in ("verlet", "rk4"):
        rows = list(csv.DictReader(open(os.path.join(DATA, f"trace_{name}.csv"))))
        tr[name] = {k: np.array([float(r[k]) for r in rows]) for k in rows[0].keys()}
    v, k = tr["verlet"], tr["rk4"]
    out = dict(R=R)
    out["snaps"] = int(len(v["step"]))
    out["verlet_maxE_snap"] = float(np.abs(v["dE_rel"]).max())          # over the 1,000 snapshots
    out["verlet_maxL_snap"] = float(np.abs(v["dL_rel"]).max())
    out["verlet_a_min"], out["verlet_a_max"] = float(v["a_ratio"].min()), float(v["a_ratio"].max())
    unb = np.where(k["dE_rel"] < -1)[0]            # E > 0 : the planet is no longer bound
    out["rk4_first_unbound_step"] = int(k["step"][unb[0]])
    out["rk4_last_bound_step"] = int(k["step"][unb[0] - 1])
    out["rk4_a_min_before"] = float(np.nanmin(k["a_ratio"][: unb[0]]))
    out["rk4_unbound_after_snaps"] = int(len(k["step"]) - unb[0])
    out["rk4_final_dE"] = float(k["dE_rel"][-1])
    # RK4 snapshot energy error near 1e7 steps (the first snapshot at or after 1e7)
    i7 = int(np.searchsorted(k["step"], 1e7))
    out["rk4_snap_1e7"] = dict(step=int(k["step"][i7]), dE=float(k["dE_rel"][i7]))
    j7 = int(np.searchsorted(v["step"], 1e7))
    out["verlet_snap_1e7"] = dict(step=int(v["step"][j7]), dE=float(v["dE_rel"][j7]))
    return out, tr


# ------------------------------------------------------------------ B. machine learning
def adam_init(ps):
    return [np.zeros_like(p) for p in ps], [np.zeros_like(p) for p in ps]


def adam(ps, gs, m, v, t, lr=3e-3, b1=0.9, b2=0.999):
    for i, (p, g) in enumerate(zip(ps, gs)):
        m[i] = b1 * m[i] + (1 - b1) * g
        v[i] = b2 * v[i] + (1 - b2) * g * g
        p -= lr * (m[i] / (1 - b1 ** t)) / (np.sqrt(v[i] / (1 - b2 ** t)) + 1e-8)


def train_pair():
    rng = np.random.default_rng(SEED)
    N, H = 1000, HNN_HIDDEN
    r = rng.uniform(0.2, 1.0, N)
    th = rng.uniform(0, 2 * np.pi, N)
    X = np.stack([r * np.cos(th), r * np.sin(th)], 1)
    Y = np.stack([X[:, 1], -X[:, 0]], 1)                       # ideal spring: dq = p, dp = -q ; energy (q^2+p^2)/2
    W1 = rng.normal(0, .5, (H, 2)); b1 = np.zeros(H); W2 = rng.normal(0, 1 / np.sqrt(H), (2, H)); b2 = np.zeros(2)
    ps = [W1, b1, W2, b2]; m, v = adam_init(ps)
    for t in range(1, HNN_STEPS + 1):
        a = np.tanh(X @ W1.T + b1); f = a @ W2.T + b2; d = 2 * (f - Y) / N
        gW2 = d.T @ a; gb2 = d.sum(0); da = d @ W2; dz = da * (1 - a * a)
        adam(ps, [dz.T @ X, dz.sum(0), gW2, gb2], m, v, t)
    V1 = rng.normal(0, .5, (H, 2)); c1 = np.zeros(H); w2 = rng.normal(0, 1 / np.sqrt(H), H)
    qs = [V1, c1, w2]; m2, v2 = adam_init(qs)
    for t in range(1, HNN_STEPS + 1):
        a = np.tanh(X @ V1.T + c1); s = 1 - a * a; u = s * w2; g = u @ V1
        f = np.stack([g[:, 1], -g[:, 0]], 1); df = 2 * (f - Y) / N
        dg = np.stack([-df[:, 1], df[:, 0]], 1)
        du = dg @ V1.T; gV1 = u.T @ dg; ds = du * w2; gw2 = (du * s).sum(0)
        dz = s * (-2 * a * ds)
        adam(qs, [gV1 + dz.T @ X, dz.sum(0), gw2], m2, v2, t)
    base = lambda x: np.tanh(x @ W1.T + b1) @ W2.T + b2
    def hnn(x):
        a = np.tanh(x @ V1.T + c1); g = ((1 - a * a) * w2) @ V1
        return np.stack([g[:, 1], -g[:, 0]], 1)
    return base, hnn


def rk4_path(f, x, dt, n, every):
    out = [x.copy()]
    for i in range(1, n + 1):
        k1 = f(x[None])[0]; k2 = f((x + .5 * dt * k1)[None])[0]; k3 = f((x + .5 * dt * k2)[None])[0]; k4 = f((x + dt * k3)[None])[0]
        x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        if i % every == 0:
            out.append(x.copy())
    return np.array(out)


def run_ml():
    base, hnn = train_pair()
    periods, dt = 300, 0.02
    n = int(round(periods * 2 * np.pi / dt)); every = n // 200
    x0 = np.array([0.7, 0.0])
    rows, summ = [], {}
    for name, f in (("plain", base), ("hamiltonian", hnn)):
        tr = rk4_path(f, x0, dt, n, every)[1:201]
        E = 0.5 * (tr ** 2).sum(1)
        summ[name] = dict(E0=0.245, E_min=float(E.min()), E_max=float(E.max()), E_last=float(E[-1]),
                          mse=float(np.mean((E - 0.245) ** 2)))
        for i, (q, p) in enumerate(tr):
            rows.append([name, i, (i + 1) * every * dt, float(q), float(p), float(E[i])])
    with open(os.path.join(DATA, "ml_traces.csv"), "w") as fh:
        fh.write("model,k,t,q,p,E_true\n")
        for r in rows:
            fh.write("%s,%d,%.6f,%.9f,%.9f,%.9f\n" % tuple(r))
    summ["toy_mse_ratio"] = summ["plain"]["mse"] / summ["hamiltonian"]["mse"]
    summ["periods"] = periods
    json.dump(summ, open(os.path.join(DATA, "ml_out.json"), "w"), indent=1)


def part_b():
    out = json.load(open(os.path.join(DATA, "ml_out.json")))
    p1 = json.load(open(os.path.join(P1, "recompute_out.json")))["C"]
    out["balanced"] = dict(runs=p1["runs"], states=p1["N"], w_move=p1["w_move_median"], c_move=p1["c_move_median"], ratio=p1["ratio_median"])
    return out


# ------------------------------------------------------------------ C. fluids (Kelvin)
VORT = np.array([[0.0, 0.0, 1.0], [1.2, 0.0, 1.0], [0.6, 1.1, -0.6]])    # x, y, strength


def vortex_vel(pts, vor):
    u = np.zeros_like(pts)
    for (vx, vy, G) in vor:
        d = pts - np.array([vx, vy]); r2 = (d ** 2).sum(1) + 1e-12
        u += G / (2 * np.pi) * np.stack([-d[:, 1], d[:, 0]], 1) / r2[:, None]
    return u


def run_kelvin():
    th = np.linspace(0, 2 * np.pi, KELVIN_PARCELS, endpoint=False)
    X = np.stack([0.25 + 0.5 * np.cos(th), 0.5 * np.sin(th)], 1)
    vor = VORT.copy()
    dt, T, nframes = 0.005, 6.0, 30
    n = int(T / dt); every = n // (nframes - 1)

    def rhs(X, vor):
        dv = np.zeros((3, 2))
        for j in range(3):
            others = np.delete(vor, j, 0)
            dv[j] = vortex_vel(vor[j:j + 1, :2], others)[0]
        return vortex_vel(X, vor), dv

    def circ(X, vor):
        u = vortex_vel(X, vor); Xn = np.roll(X, -1, 0); un = np.roll(u, -1, 0)
        return float((0.5 * (u + un) * (Xn - X)).sum()), float(np.linalg.norm(Xn - X, axis=1).sum())
    frames = []
    Gs, Ls = [], []
    for i in range(n + 1):
        if i % every == 0:
            g, L = circ(X, vor); Gs.append(g); Ls.append(L)
            frames.append(X.copy())
        # RK4 for parcels and vortices together
        k1x, k1v = rhs(X, vor)
        v2 = vor.copy(); v2[:, :2] += 0.5 * dt * k1v
        k2x, k2v = rhs(X + 0.5 * dt * k1x, v2)
        v3 = vor.copy(); v3[:, :2] += 0.5 * dt * k2v
        k3x, k3v = rhs(X + 0.5 * dt * k2x, v3)
        v4 = vor.copy(); v4[:, :2] += dt * k3v
        k4x, k4v = rhs(X + dt * k3x, v4)
        X = X + dt / 6 * (k1x + 2 * k2x + 2 * k3x + k4x)
        vor[:, :2] += dt / 6 * (k1v + 2 * k2v + 2 * k3v + k4v)
    Gs, Ls = np.array(Gs), np.array(Ls)
    with open(os.path.join(DATA, "kelvin_loop.csv"), "w") as fh:
        fh.write("frame,parcel,x,y\n")
        for f, Fr in enumerate(frames[:nframes]):
            for j in range(0, KELVIN_PARCELS):
                fh.write("%d,%d,%.5f,%.5f\n" % (f, j, Fr[j, 0], Fr[j, 1]))
    out = dict(frames=len(frames[:nframes]), parcels=KELVIN_PARCELS, circ_first=float(Gs[0]), circ_max_rel_change=float(np.abs(Gs / Gs[0] - 1).max()),
               length_first=float(Ls[0]), length_last=float(Ls[-1]), stretch=float(Ls[-1] / Ls[0]), vortex_strength_enclosed=float(VORT[0, 2]))
    json.dump(out, open(os.path.join(DATA, "kelvin_out.json"), "w"), indent=1)


def part_c():
    return json.load(open(os.path.join(DATA, "kelvin_out.json")))


# ------------------------------------------------------------------ D. equivariance
def part_d():
    rng = np.random.default_rng(SEED)
    n = T1044_RESIDUES
    # seeded stand-in chain: persistent random walk with unit bonds, folded back toward the centre (NOT a real fold)
    d = rng.normal(size=3); d /= np.linalg.norm(d)
    X = np.zeros((n, 3))
    for i in range(1, n):
        kick = rng.normal(size=3) * 0.8 - 0.04 * X[i - 1]
        d = d + kick; d /= np.linalg.norm(d)
        X[i] = X[i - 1] + d
    X -= X.mean(0)

    def layer(X):
        D = np.linalg.norm(X[:, None, :] - X[None, :, :], axis=2)
        Wt = np.exp(-(D / 3.0) ** 2) * (D > 0)
        return np.einsum("ij,ijk->ik", Wt, X[None, :, :] - X[:, None, :])
    A = rng.normal(size=(3, 3))
    plain = lambda X: X @ A                                    # not equivariant to rotation
    Q, _ = np.linalg.qr(rng.normal(size=(3, 3)))
    if np.linalg.det(Q) < 0:
        Q[:, 0] *= -1
    t = rng.normal(size=3) * 5
    Xr = X @ Q.T + t
    e_eq = float(np.abs(layer(Xr) - layer(X) @ Q.T).max() / np.abs(layer(X)).max())
    e_pl = float(np.abs(plain(Xr) - plain(X) @ Q.T).max() / np.abs(plain(X)).max())
    D0 = np.linalg.norm(X[:, None] - X[None], axis=2); D1 = np.linalg.norm(Xr[:, None] - Xr[None], axis=2)
    e_dist = float(np.abs(D1 - D0).max() / D0.max())
    return dict(residues=n, equivariant_rel_err=e_eq, plain_rel_err=e_pl, dist_rel_err=e_dist, chain_extent=float(np.abs(X).max()))


# ------------------------------------------------------------------ E. claim values
def values(A, B, C, D):
    V = {}
    V["steps"] = STEPS
    V["stepsPerOrbit"] = SPO
    V["orbits"] = STEPS // SPO
    V["snapshots"] = A["snaps"]
    V["snapshotsBoth"] = 2 * A["snaps"]
    V["verletEPct"] = round(A["verlet_maxE_snap"] * 100, 4)                 # percent, max over the 1,000 snapshots
    V["verletLPlaces"] = int(math.floor(-math.log10(A["R"]["verlet_1e9"]["maxdL"])))
    V["verletLerr"] = A["R"]["verlet_1e9"]["maxdL"]
    V["rk4StepsGone"] = int(round(A["rk4_first_unbound_step"] / 1e6))      # millions of steps: first snapshot where the planet is unbound
    V["rk4EPct1e7"] = round(A["R"]["rk4_1e7"]["maxdE"] * 100, 1)             # percent at 1e7 steps
    V["verletE1e7"] = A["R"]["verlet_1e7"]["maxdE"]
    V["integratorRatio"] = round(A["R"]["rk4_1e7"]["maxdE"] / A["R"]["verlet_1e7"]["maxdE"])   # same 10 million steps
    V["hnnBase"] = HNN_PAPER_BASE
    V["hnnHam"] = HNN_PAPER_HNN
    V["hnnRatio"] = round(HNN_PAPER_BASE / HNN_PAPER_HNN)                     # 447
    V["hnnRatioWords"] = 450                                                  # "about 450 times"
    V["hnnHidden"] = HNN_HIDDEN
    V["hnnTrainSteps"] = HNN_STEPS
    V["netRuns"] = B["balanced"]["runs"]
    V["netStates"] = B["balanced"]["states"]
    V["wMove"] = round(B["balanced"]["w_move"], 2)
    V["cMove"] = round(B["balanced"]["c_move"], 5)
    V["residues"] = D["residues"]
    V["kelvinParcels"] = C["parcels"]
    return V


def main():
    if RUN:
        run_c(); run_ml(); run_kelvin()
    A, tr = part_a(); B = part_b(); C = part_c(); D = part_d()
    V = values(A, B, C, D)
    out = dict(A=A, B=B, C=C, D=D, V=V, seed=SEED)
    json.dump(out, open(os.path.join(DATA, "recompute_out.json"), "w"), indent=1, default=float)
    print("A integrators")
    for k, v in A["R"].items():
        print("  %-11s max|dE/E| %.3e  max|dL/L| %.3e  (final dE %.3e)" % (k, v["maxdE"], v["maxdL"], v["dE_final"]))
    print("  Verlet, 1,000 snapshots: max|dE/E| %.3e  max|dL/L| %.3e  a/a0 in [%.6f, %.6f]" % (A["verlet_maxE_snap"], A["verlet_maxL_snap"], A["verlet_a_min"], A["verlet_a_max"]))
    print("  RK4: last bound snapshot at step %d, first unbound at %d; smallest a/a0 before: %.3f; final dE/E %.1f" % (A["rk4_last_bound_step"], A["rk4_first_unbound_step"], A["rk4_a_min_before"], A["rk4_final_dE"]))
    print("B ML  balanced:", B["balanced"]); print("  toy pair (not shown):", {k: B[k] for k in ("plain", "hamiltonian", "toy_mse_ratio", "periods")})
    print("  paper pair: %s vs %s -> %.1f x (about 450)" % (HNN_PAPER_BASE, HNN_PAPER_HNN, HNN_PAPER_BASE / HNN_PAPER_HNN))
    print("C Kelvin", C); print("D equivariance", D)
    print("claim values:", json.dumps(V))
    if CHECK:
        cl = json.load(open(os.path.join(HERE, "claims.json")))
        bad = 0
        for c in cl["claims"]:
            k = c.get("key")
            if k and k in V and abs(float(c["value"]) - float(V[k])) > 1e-9 * max(1, abs(float(V[k]))):
                print("MISMATCH", c["id"], c["value"], V[k]); bad += 1
        print("check:", "OK" if not bad else "%d mismatches" % bad)
        sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
