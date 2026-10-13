#!/usr/bin/env python3
"""noether-symmetry · recompute every number the film draws, and write the two point clouds.

Run:  python3 -I factory/topics/noether-symmetry/recompute.py [--write]

numpy only, fixed seed (SEED = 20261010), no network. Three parts.

A. ORBITS. 300 two-body orbits (G*M = 1, the reduced two-body problem = one body in an inverse-square field),
   6 angular-momentum levels |L| x 5 energy levels E x 10 orientations; 100 states per orbit = 30,000 states (v2; was 10 and 3,000).
   States come from the exact Kepler solution (mean anomaly -> eccentric anomaly -> position, velocity), with a random
   phase offset per orbit and a random orientation in 3-D (so L is a vector (Lx, Ly, Lz) and its length is |L|).
   Independent check: every orbit is also integrated numerically (velocity-Verlet, dt = T/20000) and compared.
   Per state: x y z (position space), vx vy vz and speed v, E = v^2/2 - 1/r, L = r x v, |L|, mean-anomaly phase.
   Two views of the SAME 3,000 marks:
     position space  P = (x, y, z)            -> looks like noise: 60 overlapping ellipses of every size and tilt
     conserved space C = (Lx, Ly, Lz)         -> each orbit is ONE point (10 marks on top of each other); the 50 orbits
                                                  with the same |L| lie on a sphere (6 shells), colour = E level (5 levels)
   A cut plane Lz = 0 with a band |Lz| < 0.2 |L| lights the orbits near the equator of every shell.
   Printed claims: spread (standard deviation) of x, y, z, v over all states versus the spread of L and E inside each orbit.

B. EARTH FIXTURE. NASA Earth Fact Sheet perihelion / aphelion distance (A), speeds at both (Wikipedia "Earth's orbit",
   30.29 / 29.29 km/s, B) and the same speeds from the vis-viva equation with NASA's distances and GM_sun (A, derived).
   Prints r*v at both ends and the fractional difference, for both speed sources.

C. NETWORK. A 2-layer ReLU net f(x) = sum_i w2_i * relu(w1_i . x), no biases, 2 inputs, 16 hidden units, trained by
   full-batch gradient descent on 128 seeded points (teacher: 3 ReLU units) with lr = 0.01. Scale symmetry
   (w1_i, w2_i) -> (a*w1_i, w2_i/a) leaves f unchanged, so for every hidden unit i
       c_i = |w1_i|^2 - w2_i^2
   is conserved by gradient flow (Du, Hu & Lee 2018; Kunin et al. 2021). 100 runs x 100 recorded steps (v2; steps
   round(linspace(0, 986, 100))) = 10,000 states. Init is built so the first three c_i (c0, c1, c2) of a run sit at a chosen radius rho from the
   origin: 3 shells (rho = 0.4, 0.8, 1.2), 33-34 runs per shell, random direction on the shell.
   Two views of the same 3,000 marks:
     weight space   W = top-3 PCA of the 48 weights over all states (deterministic SVD)  -> streaks, looks like noise
     conserved space C = (c0, c1, c2)                                                      -> each run is one point, on a sphere
   The conservation is exact in gradient FLOW; gradient DESCENT with a finite step drifts by O(lr^2); the script
   prints the drift. Printed claims: weight-space spread vs the per-run spread of c.
"""
import json, os, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SEED = 20261010
WRITE = "--write" in sys.argv

# ---------------------------------------------------------------- A. orbits
GM = 1.0
L_LEVELS = [0.55, 0.70, 0.85, 1.00, 1.15, 1.30]          # |L| shells
A_LEVELS = [1.8, 2.3, 2.9, 3.5, 4.2]                      # semi-major axes -> E = -GM/(2a)
ORIENT = 10
PER_ORBIT = 100                                          # v2 (2026-10-10): 10 -> 100 moments per orbit (30,000 states)


def rot_from_axis(u, omega):
    """Rotation taking the orbit plane (z-axis normal) to normal u, then spinning the periapsis by omega in-plane."""
    z = np.array([0.0, 0.0, 1.0])
    v = np.cross(z, u); s = np.linalg.norm(v); c = float(z @ u)
    if s < 1e-12:
        R = np.eye(3) if c > 0 else np.diag([1, -1, -1.0])
    else:
        vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
        R = np.eye(3) + vx + vx @ vx * ((1 - c) / s ** 2)
    co, si = np.cos(omega), np.sin(omega)
    Rz = np.array([[co, -si, 0], [si, co, 0], [0, 0, 1.0]])
    return R @ Rz


def kepler_states(a, e, M):
    """Planar orbit in its own frame (periapsis on +x, counter-clockwise). Returns pos (n,3), vel (n,3)."""
    E = M.copy()
    for _ in range(60):                                   # Newton on E - e sin E = M
        E = E - (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
    x = a * (np.cos(E) - e); y = a * np.sqrt(1 - e * e) * np.sin(E)
    r = a * (1 - e * np.cos(E)); n = np.sqrt(GM / a ** 3)
    vx = -a * n * np.sin(E) / (1 - e * np.cos(E)); vy = a * n * np.sqrt(1 - e * e) * np.cos(E) / (1 - e * np.cos(E))
    z0 = np.zeros_like(x)
    return np.stack([x, y, z0], 1), np.stack([vx, vy, z0], 1), r


def verlet_check(pos0, vel0, T, steps=100000):
    dt = T / steps; r = pos0.copy(); v = vel0.copy()
    acc = lambda p: -GM * p / np.linalg.norm(p, axis=1, keepdims=True) ** 3
    L0 = np.cross(r, v); E0 = 0.5 * (v ** 2).sum(1) - GM / np.linalg.norm(r, axis=1)
    dL = np.zeros(len(r)); dE = np.zeros(len(r))
    a_ = acc(r)
    for _ in range(steps):
        v += 0.5 * dt * a_; r += dt * v; a_ = acc(r); v += 0.5 * dt * a_
        L = np.cross(r, v); E = 0.5 * (v ** 2).sum(1) - GM / np.linalg.norm(r, axis=1)
        dL = np.maximum(dL, np.linalg.norm(L - L0, axis=1) / np.linalg.norm(L0, axis=1))
        dE = np.maximum(dE, np.abs(E - E0) / np.abs(E0))
    return r, v, dL, dE


def part_a():
    rng = np.random.default_rng(SEED)
    rows, orbits = [], []
    oid = 0
    for li, Lm in enumerate(L_LEVELS):
        for ai, a in enumerate(A_LEVELS):
            e = np.sqrt(1 - Lm ** 2 / (GM * a))           # needs Lm^2 < GM a (checked by the level choice)
            for k in range(ORIENT):
                u = rng.normal(size=3); u /= np.linalg.norm(u)
                om = rng.uniform(0, 2 * np.pi)
                R = rot_from_axis(u, om)
                u0 = float(rng.uniform(0, 1))
                M = (np.arange(PER_ORBIT) + u0) / PER_ORBIT * 2 * np.pi
                p, v, r = kepler_states(a, e, M)
                p, v = p @ R.T, v @ R.T
                T = 2 * np.pi * np.sqrt(a ** 3 / GM)
                orbits.append(dict(id=oid, lvl=li, elvl=ai, a=a, e=float(e), T=T, pos0=p[0], vel0=v[0], R=R, u0=u0))
                for j in range(PER_ORBIT):
                    L = np.cross(p[j], v[j]); sp = np.linalg.norm(v[j])
                    E = 0.5 * sp * sp - GM / np.linalg.norm(p[j])
                    rows.append([oid, li, ai, j, *p[j], *v[j], sp, E, *L, np.linalg.norm(L), M[j]])
                oid += 1
    S = np.array(rows)
    cols = ["orbit", "Lshell", "Elevel", "j", "x", "y", "z", "vx", "vy", "vz", "v", "E", "Lx", "Ly", "Lz", "Lmag", "M"]
    return S, cols, orbits


# ---------------------------------------------------------------- B. Earth
EARTH = dict(
    rp=147.095, ra=152.100,           # 10^6 km, NASA NSSDC Earth Fact Sheet (A)
    vp=30.29, va=29.29,               # km/s, Wikipedia "Earth's orbit" (B, secondary)
    vavg=29.78,                       # km/s, NASA Earth Fact Sheet (A)
    e=0.0167,                         # NASA Earth Fact Sheet (A)
    GMsun=1.32712440018e11,           # km^3/s^2, IAU 2015 Resolution B3 nominal solar mass parameter (A)
)


def part_b():
    E_ = EARTH
    a = (E_["rp"] + E_["ra"]) / 2 * 1e6                   # km
    vv = lambda r: np.sqrt(E_["GMsun"] * (2 / (r * 1e6) - 1 / a))   # vis-viva, km/s
    vp_vv, va_vv = vv(E_["rp"]), vv(E_["ra"])
    out = dict(
        a_Mkm=a / 1e6,
        rv_p_pub=E_["rp"] * E_["vp"], rv_a_pub=E_["ra"] * E_["va"],
        rv_p_vv=E_["rp"] * vp_vv, rv_a_vv=E_["ra"] * va_vv,
        vp_vv=vp_vv, va_vv=va_vv,
        ratio_r=E_["ra"] / E_["rp"], ratio_v_pub=E_["vp"] / E_["va"], ratio_v_vv=vp_vv / va_vv,
    )
    out["diff_pub_pct"] = 100 * (out["rv_p_pub"] - out["rv_a_pub"]) / out["rv_a_pub"]
    out["diff_vv_pct"] = 100 * (out["rv_p_vv"] - out["rv_a_vv"]) / out["rv_a_vv"]
    out["speed_swing_pct"] = 100 * (E_["vp"] - E_["va"]) / E_["va"]
    out["dist_swing_pct"] = 100 * (E_["ra"] - E_["rp"]) / E_["rp"]
    return out


# ---------------------------------------------------------------- C. network
H, D, NDATA = 16, 2, 128
LR, NREC, RUNS = 0.01, 100, 100
STEPS = 986                            # v2: the same 986 training steps; 100 states recorded per run (was 30, every 34th)
REC = [int(x) for x in np.round(np.linspace(0, STEPS, NREC))]   # steps 0, 10, 20, ..., 986 (spacing 9-10)
RECI = {s: i for i, s in enumerate(REC)}
RHOS = [0.4, 0.8, 1.2]


def part_c():
    rng = np.random.default_rng(SEED + 1)
    X = rng.normal(size=(NDATA, D))
    T1 = rng.normal(size=(3, D)); t2 = np.array([1.0, -0.8, 0.6])
    y = np.maximum(X @ T1.T, 0) @ t2                      # teacher: 3 ReLU units
    runs, states = [], []
    for r in range(RUNS):
        shell = r % 3
        u = rng.normal(size=3); u /= np.linalg.norm(u)
        c_target = RHOS[shell] * u                        # c0..c2 of this run
        c_all = np.concatenate([c_target, rng.uniform(-0.3, 0.3, H - 3)])
        W1 = np.zeros((H, D)); w2 = np.zeros(H)
        for i in range(H):
            m = 0.5 + max(-c_all[i], 0.0)
            n1 = np.sqrt(m + c_all[i]); d = rng.normal(size=D); d /= np.linalg.norm(d)
            W1[i] = n1 * d; w2[i] = np.sign(rng.normal()) * np.sqrt(m)
        c_hist, loss_hist = [], []
        for s in range(STEPS + 1):
            Z = X @ W1.T; A = np.maximum(Z, 0); pred = A @ w2; err = pred - y
            if s in RECI:
                c = (W1 ** 2).sum(1) - w2 ** 2
                states.append((r, shell, RECI[s], np.concatenate([W1.ravel(), w2]), c, float(0.5 * np.mean(err ** 2))))
            gw2 = A.T @ err / NDATA
            gW1 = ((err[:, None] * (Z > 0)) * w2[None, :]).T @ X / NDATA
            W1 = W1 - LR * gW1; w2 = w2 - LR * gw2
        runs.append(shell)
    return states, X, y


def main():
    np.set_printoptions(precision=6, suppress=False)
    out = {}
    # ---- A
    S, cols, orbits = part_a()
    N = len(S); ix = {c: i for i, c in enumerate(cols)}
    print(f"A. states: {N}  orbits: {len(orbits)}  states per orbit: {PER_ORBIT}  L shells: {len(L_LEVELS)}  E levels: {len(A_LEVELS)}")
    sp = {k: float(S[:, ix[k]].std()) for k in ["x", "y", "z", "v"]}
    print("   spread over all states (sd): " + "  ".join(f"{k} {v:.3f}" for k, v in sp.items()))
    rng_ = {k: float(S[:, ix[k]].max() - S[:, ix[k]].min()) for k in ["x", "y", "z", "v"]}
    print("   range over all states:       " + "  ".join(f"{k} {v:.3f}" for k, v in rng_.items()))
    # within-orbit spread of L (vector) and E, relative to the orbit's own size
    worstL = worstE = 0.0
    for o in range(len(orbits)):
        m = S[:, ix["orbit"]] == o
        L = S[m][:, [ix["Lx"], ix["Ly"], ix["Lz"]]]
        Lm = np.linalg.norm(L.mean(0))
        worstL = max(worstL, float(np.linalg.norm(L - L.mean(0), axis=1).max() / Lm))
        E = S[m, ix["E"]]
        worstE = max(worstE, float(np.abs(E - E.mean()).max() / abs(E.mean())))
    print(f"   inside one orbit, worst relative spread: L {worstL:.2e}   E {worstE:.2e}   (round-off of the Kepler solution)")
    # relative spread inside one orbit = sd / rms, median and worst over the 60 orbits, for every quantity
    rel = {}
    for k in ["x", "y", "z", "v", "E", "Lmag"]:
        vals = []
        for o in range(len(orbits)):
            col = S[S[:, ix["orbit"]] == o, ix[k]]
            vals.append(col.std() / np.sqrt(np.mean(col ** 2)))
        rel[k] = (float(np.median(vals)), float(np.max(vals)), float(np.min(vals)))
    print(f"   relative spread inside one orbit (sd/rms), median [min .. max] over {len(orbits)} orbits:")
    for k, (md, mx, mn) in rel.items():
        print(f"      {k:5s} {md:.3e} [{mn:.2e} .. {mx:.2e}]")
    out_rel = rel
    # cut plane Lz = 0, band |Lz| < 0.2 |L|
    band = np.abs(S[:, ix["Lz"]]) < 0.2 * S[:, ix["Lmag"]]
    cut_orbits = len(set(S[band, ix["orbit"]].astype(int)))
    print(f"   cut plane Lz=0, band |Lz| < 0.2|L|: {cut_orbits} orbits, {int(band.sum())} marks lit of {N}; per shell " +
          str([len(set(S[band & (S[:, ix['Lshell']] == li), ix['orbit']].astype(int))) for li in range(len(L_LEVELS))]))
    out_cut = dict(orbits=cut_orbits, marks=int(band.sum()))
    # position/speed spread inside one orbit (to show these DO vary)
    m0 = S[:, ix["orbit"]] == 0
    print(f"   inside orbit 0 the position moves: x range {np.ptp(S[m0, ix['x']]):.3f}, speed range {np.ptp(S[m0, ix['v']]):.3f}")
    # shell check: |L| per shell
    for li, Lm in enumerate(L_LEVELS):
        mm = S[:, ix["Lshell"]] == li
        print(f"   shell {li}: |L| target {Lm:.2f}  mean {S[mm, ix['Lmag']].mean():.9f}  sd {S[mm, ix['Lmag']].std():.1e}  states {int(mm.sum())}")
    for ai, a in enumerate(A_LEVELS):
        mm = S[:, ix["Elevel"]] == ai
        print(f"   E level {ai}: a {a}  E target {-0.5 / a:.6f}  mean {S[mm, ix['E']].mean():.9f}  sd {S[mm, ix['E']].std():.1e}")
    # independent numeric check
    P0 = np.array([o["pos0"] for o in orbits]); V0 = np.array([o["vel0"] for o in orbits])
    Tall = np.array([o["T"] for o in orbits])
    dLmax = dEmax = 0.0; perr = 0.0
    for T_ in sorted(set(Tall)):
        sel = np.where(Tall == T_)[0]
        r_, v_, dL, dE = verlet_check(P0[sel].copy(), V0[sel].copy(), T_ * 1.0)
        dLmax = max(dLmax, float(dL.max())); dEmax = max(dEmax, float(dE.max()))
        # after exactly one period the numeric state must be back at the start
        perr = max(perr, float(np.linalg.norm(r_ - P0[sel], axis=1).max()))
    print(f"   velocity-Verlet check over one period (dt=T/100000): max relative drift of |L| {dLmax:.2e}, of E {dEmax:.2e}; "
          f"position error after one period {perr:.2e}")
    out["A"] = dict(cut=out_cut, rel=out_rel, N=N, orbits=len(orbits), sd=sp, rng=rng_, worstL=worstL, worstE=worstE, verletL=dLmax, verletE=dEmax)

    # ---- B
    B = part_b()
    print("B. Earth fixture (distances NASA A; speeds Wikipedia B; vis-viva from NASA a and GM_sun, derived A)")
    print(f"   perihelion {EARTH['rp']} Mkm, aphelion {EARTH['ra']} Mkm, a = {B['a_Mkm']:.4f} Mkm")
    print(f"   published speeds: {EARTH['vp']} / {EARTH['va']} km/s   vis-viva speeds: {B['vp_vv']:.4f} / {B['va_vv']:.4f} km/s")
    print(f"   r*v perihelion (published) {B['rv_p_pub']:.3f}  aphelion {B['rv_a_pub']:.3f}  difference {B['diff_pub_pct']:+.4f} %")
    print(f"   r*v perihelion (vis-viva)  {B['rv_p_vv']:.3f}  aphelion {B['rv_a_vv']:.3f}  difference {B['diff_vv_pct']:+.5f} %")
    print(f"   distance changes by {B['dist_swing_pct']:.2f} %, speed by {B['speed_swing_pct']:.2f} % (published) -- opposite ways; product ratio r_a/r_p = {B['ratio_r']:.5f}, v_p/v_a = {B['ratio_v_pub']:.5f} (published) / {B['ratio_v_vv']:.5f} (vis-viva)")
    print(f"   rounding floor of the published speeds: +/-0.005 km/s = +/-{100*0.005/EARTH['vp']:.3f} % on v_p, +/-{100*0.005/EARTH['va']:.3f} % on v_a")
    out["B"] = B

    # ---- C
    states, X, y = part_c()
    nC = len(states)
    Wall = np.array([s[3] for s in states]); C = np.array([s[4][:3] for s in states]); runs = np.array([s[0] for s in states])
    shell = np.array([s[1] for s in states]); step = np.array([s[2] for s in states]); loss = np.array([s[5] for s in states])
    Wc = Wall - Wall.mean(0)
    U, Sv, Vt = np.linalg.svd(Wc, full_matrices=False)
    W3 = Wc @ Vt[:3].T
    print(f"C. network states: {nC}  runs: {RUNS}  states per run: {nC // RUNS}  hidden units: {H}  params: {Wall.shape[1]}  lr {LR}  steps {STEPS}")
    print(f"   weight space (top-3 PCA, {100*(Sv[:3]**2).sum()/(Sv**2).sum():.1f} % of variance): sd " + "  ".join(f"{W3[:, k].std():.3f}" for k in range(3)))
    wsp = float(np.mean([W3[:, k].std() for k in range(3)]))
    # per-run spread of c versus per-run spread of weights
    cs = []; ws = []
    for r in range(RUNS):
        m = runs == r
        cs.append(float(np.linalg.norm(C[m] - C[m][0], axis=1).max())); ws.append(float(np.linalg.norm(W3[m] - W3[m][0], axis=1).max()))
    print(f"   inside one run: max movement of (c0,c1,c2) {max(cs):.2e} (median {np.median(cs):.2e});  of the weights (PCA coords) median {np.median(ws):.3f}, max {max(ws):.3f}")
    allc = np.array([s[4] for s in states]); drift = []
    for r in range(RUNS):
        m = runs == r
        drift.append(np.abs(allc[m] - allc[m][0]).max())
    print(f"   all 16 c_i, worst absolute drift in any run over {STEPS} steps: {max(drift):.2e}  (|c| scale 0.4 to 1.2)")
    print(f"   total |W1|^2 - |W2|^2: drift {max(np.abs((allc[runs==r].sum(1) - allc[runs==r][0].sum())).max() for r in range(RUNS)):.2e}")
    for k, rho in enumerate(RHOS):
        m = shell == k
        rr = np.linalg.norm(C[m], axis=1)
        print(f"   shell {k}: radius target {rho}  mean {rr.mean():.6f}  sd {rr.std():.2e}  states {int(m.sum())}")
    print(f"   median movement: weights {np.median(ws):.3f}, c {np.median(cs):.2e}, ratio {np.median(ws)/np.median(cs):.0f}")
    print(f"   loss: first {loss[step==0].mean():.4f} -> last {loss[step==NREC-1].mean():.4f} (mean over runs); training does something while c stays put")
    out["C"] = dict(N=nC, runs=RUNS, c_move_max=max(cs), c_move_median=float(np.median(cs)), w_move_median=float(np.median(ws)),
                    ratio_median=float(np.median(ws) / np.median(cs)), drift=float(max(drift)),
                    loss_first=float(loss[step == 0].mean()), loss_last=float(loss[step == NREC - 1].mean()))

    if WRITE:
        os.makedirs(os.path.join(HERE, "data"), exist_ok=True)
        r6 = lambda a: np.round(a, 6).tolist()
        # compact orbit table: the film rebuilds all 3,000 states from it with the Kepler solution (pure, no storage of states)
        tab = dict(seed=SEED, units="G*M = 1", per_orbit=PER_ORBIT, L_levels=L_LEVELS, a_levels=A_LEVELS,
                   cols=["orbit", "Lshell", "Elevel", "u0", "R00", "R01", "R02", "R10", "R11", "R12", "R20", "R21", "R22"],
                   note="state j of an orbit: M = (j + u0) / per_orbit * 2*pi; e = sqrt(1 - L^2/(GM a)); Kepler solve; planar (x,y,0) then R @ (x,y,0)",
                   rows=[[o["id"], o["lvl"], o["elvl"], round(o["u0"], 6)] + [round(float(v), 6) for v in o["R"].ravel()] for o in orbits])
        json.dump(tab, open(os.path.join(HERE, "data/orbit_table.json"), "w"), separators=(",", ":"))
        orb = dict(seed=SEED, units="G*M = 1", cols=cols,
                   rows=[[int(r[0]), int(r[1]), int(r[2]), int(r[3])] + [round(float(v), 5) for v in r[4:]] for r in S])
        json.dump(orb, open(os.path.join(HERE, "data/orbits.json"), "w"), separators=(",", ":"))
        net = dict(seed=SEED + 1, cols=["run", "shell", "step", "w0", "w1", "w2", "c0", "c1", "c2", "loss"], radii=RHOS,
                   rows=[[int(runs[i]), int(shell[i]), int(step[i]), *[round(float(v), 4) for v in W3[i]],
                          *[round(float(v), 5) for v in C[i]], round(float(loss[i]), 5)] for i in range(nC)])
        json.dump(net, open(os.path.join(HERE, "data/network.json"), "w"), separators=(",", ":"))
        summ = json.loads(json.dumps(out, default=float))
        json.dump(summ, open(os.path.join(HERE, "data/recompute_out.json"), "w"), indent=1)
        print("wrote data/orbits.json, data/network.json, data/recompute_out.json")


if __name__ == "__main__":
    main()
