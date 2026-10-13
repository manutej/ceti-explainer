/* escapement.kit.js — shared machinery for A · THE ESCAPEMENT (concatenated before each film by build.sh).
   Geometry: exact involute profiles, a Graham deadbeat escapement (lock arcs about the pallet arbor, inclined
   impulse faces), 2D section clipping (Sutherland–Hodgman) with hatched cap faces, all extruded once with
   buildGeometry. Kinematics: the escape-wheel angle is SOLVED (supremum allowed by pallet contact), tabulated per
   step type → exact seek. Rendering: one instanced material shader; per-instance angles in a data texture. */
const ESC = (function () {
  'use strict';
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

  /* ── material codes (vertex colour R) ── */
  const M = { PLATE: 1, CUT: 2, BORE: 3, TRAIN: 4, WHEEL: 5, ANCHOR: 6, PAWL: 7, HAND: 8, RING: 9, TICK: 10, HOME: 11, EDGE: 12, BRIDGE: 13, BALL: 14, GLASS: 15, DRUM: 16 };

  /* ── 2D polygon tools ── */
  const circle = (r, n, a0 = 0, cx = 0, cy = 0) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(a0 + TAU * i / n), cy + r * Math.sin(a0 + TAU * i / n)]);
  /** keep the part of a closed polygon where nx·x + ny·y ≤ c; marks new edges as cut (pt[2] = 1 on the edge start) */
  function clipHalf(poly, nx, ny, c) {
    const out = [], n = poly.length, f = q => nx * q[0] + ny * q[1] - c;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n], fa = f(a), fb = f(b);
      if (fa <= 0) out.push(a);
      if ((fa <= 0) !== (fb <= 0)) { const u = fa / (fa - fb); const q = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; if (fa <= 0) q.cut = 1; out.push(q); }
    }
    return out;
  }
  const area = poly => { let s = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };

  /** involute gear outline (star-shaped about its centre), tooth 0 centred on angle 0. */
  function involute(z, m, pa = 20, samples = 7) {
    const a = pa * D2R, r = m * z / 2, rb = r * Math.cos(a), ra = r + m, rf = r - 1.25 * m;
    const inv = x => Math.tan(x) - x, phi0 = Math.PI / (2 * z) + inv(a), ta = Math.sqrt((ra / rb) ** 2 - 1);
    const thInv = t => t - Math.atan(t), pts = [];
    for (let i = 0; i < z; i++) {
      const c = TAU * i / z, P = (rr, ang) => pts.push([rr * Math.cos(ang), rr * Math.sin(ang)]);
      P(rf, c - phi0 - 0.6 * (Math.PI / z - phi0));
      if (rf < rb) P(rf, c - phi0);
      for (let s = 0; s <= samples; s++) { const t = ta * s / samples; P(rb * Math.sqrt(1 + t * t), c - phi0 + thInv(t)); }
      for (let s = samples; s >= 0; s--) { const t = ta * s / samples; P(rb * Math.sqrt(1 + t * t), c + phi0 - thInv(t)); }
      if (rf < rb) P(rf, c + phi0);
      P(rf, c + phi0 + 0.6 * (Math.PI / z - phi0));
    }
    return { pts, r, ra, rf, rb, z, m };
  }
  /** wheel B's angle so that it meshes with A (A turns θA; line of centres A→B at angle λ) */
  const meshAngle = (thA, zA, zB, lambda) => -(zA / zB) * (thA - lambda) + lambda + Math.PI + Math.PI / zB;

  /** Graham escape-wheel outline: N pointed teeth, tips at radius R on angles k·2π/N; wheel turns +θ (clockwise on
   *  screen). Leading face nearly radial (undercut forward 4°), curved back. */
  function escapeTeeth(N, R, h) {
    const pts = [], pitch = TAU / N;
    for (let k = 0; k < N; k++) {
      const a = k * pitch, P = (rr, ang) => pts.push([rr * Math.cos(ang), rr * Math.sin(ang)]);
      for (let s = 0; s <= 6; s++) { const u = s / 6; P(R - h + h * Math.pow(u, 0.55), a - pitch * 0.62 * (1 - u)); } // curved back up to the tip
      P(R - h * 0.97, a + 4 * D2R);                                                                          // leading face down (undercut)
      P(R - h, a + 0.3 * pitch);
    }
    return pts;
  }

  /* ── extrusion into a buildGeometry callback ── */
  /** emit a prism of a closed polygon (z0 back, z1 front). tri: 'fan' (with kernel [x,y]) or array of [i,j,k].
   *  code: {front, back, side, cut} material codes; edges whose start point has .cut use code.cut. */
  function prism(p, poly, z0, z1, code, kernel) {
    const sg = area(poly) < 0 ? -1 : 1;                           // orientation → outward side normals
    const n = poly.length, k = kernel || [poly.reduce((s, q) => s + q[0], 0) / n, poly.reduce((s, q) => s + q[1], 0) / n];
    const F = c => p.fill(c, 0, 0);
    p.beginShape(p.TRIANGLES);
    if (code.front != null) { F(code.front); p.normal(0, 0, 1); for (let i = 0; i < n; i++) { const a = poly[i], b = poly[(i + 1) % n]; p.vertex(k[0], k[1], z1); p.vertex(a[0], a[1], z1); p.vertex(b[0], b[1], z1); } }
    if (code.back != null) { F(code.back); p.normal(0, 0, -1); for (let i = 0; i < n; i++) { const a = poly[i], b = poly[(i + 1) % n]; p.vertex(k[0], k[1], z0); p.vertex(b[0], b[1], z0); p.vertex(a[0], a[1], z0); } }
    if (code.side != null) for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      F(a.cut && code.cut != null ? code.cut : code.side); p.normal(sg * dy / L, -sg * dx / L, 0);
      p.vertex(a[0], a[1], z0); p.vertex(b[0], b[1], z0); p.vertex(b[0], b[1], z1);
      p.vertex(a[0], a[1], z0); p.vertex(b[0], b[1], z1); p.vertex(a[0], a[1], z1);
    }
    p.endShape();
  }
  /** prism of the band between two polylines with equal sample counts (outer, inner), closed or open */
  function band(p, outer, inner, z0, z1, code, closed) {
    const n = outer.length, F = c => p.fill(c, 0, 0), E = closed ? n : n - 1;
    p.beginShape(p.TRIANGLES);
    for (const [z, nz, flip] of [[z1, 1, false], [z0, -1, true]]) {
      if ((nz > 0 ? code.front : code.back) == null) continue;
      F(nz > 0 ? code.front : code.back); p.normal(0, 0, nz);
      for (let i = 0; i < E; i++) {
        const j = (i + 1) % n, A = outer[i], B = outer[j], C = inner[j], Dd = inner[i];
        const tri = (a, b, c) => { if (flip) { p.vertex(a[0], a[1], z); p.vertex(c[0], c[1], z); p.vertex(b[0], b[1], z); } else { p.vertex(a[0], a[1], z); p.vertex(b[0], b[1], z); p.vertex(c[0], c[1], z); } };
        tri(A, B, C); tri(A, C, Dd);
      }
    }
    if (code.side != null) {
      const wall = (a, b, nrm) => { p.normal(nrm[0], nrm[1], 0); p.vertex(a[0], a[1], z0); p.vertex(b[0], b[1], z0); p.vertex(b[0], b[1], z1); p.vertex(a[0], a[1], z0); p.vertex(b[0], b[1], z1); p.vertex(a[0], a[1], z1); };
      F(code.side);
      const nrmOf = (a, b, s) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [s * dy / L, -s * dx / L]; };
      const ref = outer[0], ci = inner[0], sgn = (a, b) => { const nn = nrmOf(a, b, 1); return (nn[0] * (ref[0] - ci[0]) + nn[1] * (ref[1] - ci[1])) >= 0 ? 1 : -1; };
      const so = sgn(outer[0], outer[1 % n]);
      for (let i = 0; i < E; i++) { const j = (i + 1) % n; wall(outer[i], outer[j], nrmOf(outer[i], outer[j], so)); wall(inner[i], inner[j], nrmOf(inner[i], inner[j], -so)); }
      if (!closed) { wall(outer[0], inner[0], nrmOf(outer[0], inner[0], -1)); wall(inner[n - 1], outer[n - 1], nrmOf(inner[n - 1], outer[n - 1], -1)); }
    }
    p.endShape();
  }
  /** star-shaped outline → resample on n equal angles about (cx,cy) (for band strips against a circle) */
  function resampleStar(pts, n, cx = 0, cy = 0) {
    const pol = pts.map(q => [Math.atan2(q[1] - cy, q[0] - cx), Math.hypot(q[0] - cx, q[1] - cy)]);
    let i0 = 0; for (let i = 1; i < pol.length; i++) if (pol[i][0] < pol[i0][0]) i0 = i;
    const ring = []; for (let i = 0; i < pol.length; i++) ring.push(pol[(i0 + i) % pol.length]);
    const out = [];
    for (let s = 0; s < n; s++) {
      const a = -Math.PI + TAU * s / n; let j = 0;
      while (j < ring.length - 1 && ring[j + 1][0] < a) j++;
      const A = ring[j], B = ring[(j + 1) % ring.length]; let a1 = B[0]; if (a1 < A[0]) a1 += TAU;
      let aa = a; if (aa < A[0]) aa += TAU;
      const u = a1 > A[0] ? clamp((aa - A[0]) / (a1 - A[0]), 0, 1) : 0, r = A[1] + (B[1] - A[1]) * u;
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return out;
  }

  /* ── the Graham deadbeat escapement: geometry + solved kinematics ── */
  function escapement(o = {}) {
    const E = Object.assign({ N: 20, R: 20, h: 3.4, beta: 31.5, w: 2.6, lock: 1.5, imp: 3.5, back: 13, A: 6.5, S: 960 }, o);
    const beta = E.beta * D2R, Dd = E.R / Math.cos(beta), L = E.R * Math.tan(beta), P = [0, -Dd];
    const pol = ang => Math.atan2(E.R * Math.sin(ang) - P[1], E.R * Math.cos(ang) - P[0]);
    const psiL = pol(-Math.PI / 2 - beta), psiR = pol(-Math.PI / 2 + beta), ro = L + E.w / 2, ri = L - E.w / 2;
    const arc = (r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => [r, a0 + (a1 - a0) * i / n]);
    const eO = psiL - E.lock * D2R, eI = eO - E.imp * D2R, xI = psiR + E.lock * D2R, xO = xI + E.imp * D2R, bk = E.back * D2R;
    // pallets in anchor-polar coords [r, psi] about P (anchor frame, α = 0)
    const entryPol = [...arc(ro, psiL + bk, eO), ...arc(ri, eI, psiL + bk)];
    const exitPol = [...arc(ri, psiR - bk, xI), ...arc(ro, xO, psiR - bk)];
    const toXY = (pp, al, dy) => pp.map(([r, a]) => [P[0] + r * Math.cos(a + al), P[1] + dy + r * Math.sin(a + al)]);
    function inside(x, y, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if (((a[1] > y) !== (b[1] > y)) && (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) c = !c; } return c; }
    function blocked(th, al, dy) {
      const pe = toXY(entryPol, al, dy), px = toXY(exitPol, al, dy);
      for (let i = 0; i < E.N; i++) { const a = th + i * TAU / E.N, x = E.R * Math.cos(a), y = E.R * Math.sin(a); if (inside(x, y, pe) || inside(x, y, px)) return true; }
      return false;
    }
    /** advance θ as far as contact allows (≤ vmax), pushing out of any penetration first */
    const dθ = 0.015 * D2R;
    function advance(th, al, dy, vmax) {
      let k = 0; while (blocked(th, al, dy) && k < 800) { th += dθ; k++; }
      let m = 0; const lim = Math.floor(vmax / dθ); while (m < lim && !blocked(th + dθ, al, dy)) { th += dθ; m++; }
      return th;
    }
    const S = E.S, alpha = u => E.A * D2R * Math.sin(TAU * u);
    // NORMAL: settle three periods from a lock, keep the last
    let th = -Math.PI / 2 + 4.5 * D2R; const run = [];
    for (let s = 0; s <= 3 * S; s++) { th = advance(th, alpha(s / S), 0, 40 * D2R); run.push(th); }
    const th0 = run[2 * S], normal = new Float64Array(S + 1);
    for (let s = 0; s <= S; s++) normal[s] = run[2 * S + s] - th0;
    const pitch = TAU / E.N, closure = normal[S] - pitch;
    for (let s = 0; s <= S; s++) normal[s] -= closure * s / S;   // < 0.02° numerical closure, spread
    // SLIP: a jolt flicks the entry pallet out as the tooth arrives — the tooth passes under it with no impulse,
    // drops to the exit lock, and the pendulum, never re-impulsed, dies. Solved from contact, not drawn.
    const knock = u => 4.6 * D2R * sstep(0.0, 0.045, u) * (1 - sstep(0.1, 0.22, u));
    const alphaSlip = u => (alpha(u) + knock(u)) * (1 - sstep(0.16, 0.62, u));
    const alphaCaught = u => alpha(u) + knock(u);
    const lift = () => 0;
    const slip = new Float64Array(S + 1), caught = new Float64Array(S + 1), pawl = new Float64Array(S + 1);
    th = th0; for (let s = 0; s <= S; s++) { th = advance(th, alphaSlip(s / S), 0, 0.14 * D2R); slip[s] = th - th0; }
    // CAUGHT: identical slip (same draw), but the sage pawl flicks in, registers it and re-strikes the pendulum:
    // the anchor keeps its swing and the step completes.
    th = th0; for (let s = 0; s <= S; s++) { const u = s / S; th = advance(th, alphaCaught(u), 0, 0.14 * D2R); caught[s] = th - th0; pawl[s] = sstep(0.03, 0.09, u) * (1 - sstep(0.26, 0.38, u)); }
    const cClose = caught[S] - pitch;
    const at = (tab, u) => { const x = clamp(u, 0, 1) * S, i = Math.min(S - 1, Math.floor(x)), f = x - i; return tab[i] + (tab[i + 1] - tab[i]) * f; };
    return {
      E, P, L, ro, ri, psiL, psiR, Dd, th0, pitch, entryPol, exitPol, toXY, normal, slip, caught, pawl, lift, alpha, alphaSlip,
      slipFinal: slip[S], at, closure, cClose, alphaCaught, knock,
      /** phase label for the four quarters of a beat cycle (for the anatomy beat) */
    };
  }

  /** per-run kinematic state at continuous step s for a run with failure f (−1 none) and a caught-step predicate */
  function runState(X, s, f, caughtAt) {
    const k = 20;
    if (s <= 0) return { th: 0, al: X.alpha(0), lift: 0, pawl: 0, done: 0, failed: false, step: 0 };
    if (f >= 0 && s >= f + 1) return { th: f * X.pitch + X.slipFinal, al: 0, lift: 0, pawl: 0, done: f, failed: true, step: f };
    if (s >= k) return { th: k * X.pitch, al: X.alpha(0), lift: 0, pawl: 0, done: k, failed: false, step: k };
    const j = Math.floor(s), u = s - j;
    if (j === f) return { th: j * X.pitch + X.at(X.slip, u), al: X.alphaSlip(u), lift: X.lift(u), pawl: 0, done: j, failed: u > 0.1, step: j, slipping: true };
    if (caughtAt && caughtAt(j)) return { th: j * X.pitch + X.at(X.caught, u), al: X.alphaCaught(u), lift: X.lift(u), pawl: X.at(X.pawl, u), done: j, failed: false, step: j, catching: true };
    return { th: j * X.pitch + X.at(X.normal, u), al: X.alpha(u), lift: 0, pawl: 0, done: j, failed: false, step: j };
  }

  /* ── the movement (a portrait regulator module): escapement above, dial below, joined by an involute train ── */
  const MV = { W: 50, Htop: -66, Hbot: 66, corner: 14, E: [0, -30], H: [0, 30], dial: [25, 33], cutY: -14, pawlPivot: [-30.5, 9.5],
    train: { m: 1.2, zE: 20, zI: 40, zH: 20 } };
  MV.I = [Math.sqrt(36 * 36 - 30 * 30), 0];
  function roundRect(x0, y0, x1, y1, rc, n = 8) {
    const out = [], C = [[x1 - rc, y0 + rc, -Math.PI / 2], [x1 - rc, y1 - rc, 0], [x0 + rc, y1 - rc, Math.PI / 2], [x0 + rc, y0 + rc, Math.PI]];
    for (const [cx, cy, a0] of C) for (let i = 0; i <= n; i++) { const a = a0 + (Math.PI / 2) * i / n; out.push([cx + rc * Math.cos(a), cy + rc * Math.sin(a)]); }
    return out;
  }
  const quad = (c, sn, w, r0, r1, ox = 0, oy = 0) => [[ox + c * r0 - sn * w, oy + sn * r0 + c * w], [ox + c * r1 - sn * w, oy + sn * r1 + c * w], [ox + c * r1 + sn * w, oy + sn * r1 - c * w], [ox + c * r0 + sn * w, oy + sn * r0 - c * w]];
  /** Build every part once. lod 'hi' (the inspected movement: true outlines, walls) or 'lo' (the bank: front faces only,
   *  coarse arcs — a 44-px cell cannot show more, and SwiftShader pays per vertex). No back faces: never seen. */
  function buildMovement(p, X, lod) {
    const HI = lod !== 'lo', G = {}, R = X.E.R, h = X.E.h, E = MV.E, H = MV.H, I = MV.I;
    const pz = (poly, z0, z1, code, k, wall) => prism(p, poly, z0, z1, { front: code.front, back: null, side: HI || wall ? code.side : null, cut: HI || wall ? code.cut : null }, k);
    const bz = (o, i, z0, z1, code, closed) => band(p, o, i, z0, z1, { front: code.front, back: null, side: HI ? code.side : null }, closed);
    const nC = HI ? 24 : 10;
    const plate = roundRect(-MV.W, MV.Htop, MV.W, MV.Hbot, MV.corner, HI ? 8 : 3);
    const pieceA = clipHalf(plate, 1, 0, 0);                                     // x ≤ 0
    const pieceB = clipHalf(clipHalf(plate, -1, 0, 0), 0, 1, MV.cutY);          // x ≥ 0, y ≤ cutY
    const pieceC = clipHalf(clipHalf(plate, -1, 0, 0), 0, -1, -MV.cutY);        // x ≥ 0, y ≥ cutY: the section
    pieceC.forEach(v => (v.cut = 0));
    const bush = (c, r, z0, z1) => pz(circle(r, nC, 0, c[0], c[1]), z0, z1, { front: M.BORE, side: M.BORE });
    const gear = (z, z0, z1, spokes) => {
      const g = involute(z, MV.train.m, 20, HI ? 5 : 1);
      if (!HI) { pz(g.pts, z0, z1, { front: M.TRAIN }, [0, 0]); return; }
      const inner = g.pts.map(q => { const a = Math.atan2(q[1], q[0]); return [(g.rf - 2.0) * Math.cos(a), (g.rf - 2.0) * Math.sin(a)]; });
      bz(g.pts, inner, z0, z1, { front: M.TRAIN, side: M.TRAIN }, true);
      for (let s = 0; s < spokes; s++) { const a = s * TAU / spokes + Math.PI / 4; pz(quad(Math.cos(a), Math.sin(a), 1.5, 2, g.rf - 1.6), z0 + 0.3, z1 - 0.3, { front: M.TRAIN, side: M.TRAIN }); }
      pz(circle(3.2, 24), z0, z1 + 0.3, { front: M.TRAIN, side: M.TRAIN });
    };
    // back plate: full thickness except the section, which is cut to half depth (cap hatched)
    G.back = p.buildGeometry(() => {
      for (const pc of [pieceA, pieceB]) pz(pc, -16, -11, { front: M.PLATE, side: M.EDGE, cut: M.CUT }, undefined, true);
      pz(pieceC, -16, -13.5, { front: M.CUT, side: M.EDGE });
      bush(I, 2.8, -13.5, -13.0); bush(H, 2.4, -13.5, -13.0);
    });
    // front plate: cut away over the section (walls hatched); bushings for the front arbors
    G.front = p.buildGeometry(() => {
      for (const pc of [pieceA, pieceB]) pz(pc, -5, -1, { front: M.PLATE, side: M.EDGE, cut: M.CUT }, undefined, true);
      bush(E, 3.2, -1, -0.4); bush([E[0] + X.P[0], E[1] + X.P[1]], 2.6, -1, -0.4); bush([E[0] + MV.pawlPivot[0], E[1] + MV.pawlPivot[1]], 1.7, -1, 0.9);
      bush(H, 2.0, -12, 3.4);
    });
    // train between the plates: escape-arbor wheel (20) → idler (40) → hand-arbor wheel (20): 1 : 1, same sense
    G.gearE = HI ? p.buildGeometry(() => gear(MV.train.zE, -10, -7.6, 4)) : null;   // fully behind the front plate in the bank
    G.gearI = p.buildGeometry(() => gear(MV.train.zI, -10, -7.6, 5));
    G.gearH = p.buildGeometry(() => gear(MV.train.zH, -10, -7.6, 4));
    // escape wheel: the true tooth outline strip-joined to its rim circle, four crossings, hub
    G.wheel = p.buildGeometry(() => {
      const outer = escapeTeeth(X.E.N, R, h).map(q => q.slice());
      const ri = R - h - 1.7, inner = outer.map(q => { const a = Math.atan2(q[1], q[0]); return [ri * Math.cos(a), ri * Math.sin(a)]; });
      bz(outer, inner, 1, 2.6, { front: M.WHEEL, side: M.WHEEL }, true);
      for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2 + Math.PI / 4; pz(quad(Math.cos(a), Math.sin(a), 1.05, 2.5, R - h - 1.2), 1.2, 2.4, { front: M.WHEEL, side: M.WHEEL }); }
      pz(circle(3.6, HI ? 28 : 10), 1, 3.0, { front: M.WHEEL, side: M.WHEEL });
    });
    // anchor (pallet-arbor frame, origin at its arbor): two pallets, two arms, boss, crutch
    G.anchor = p.buildGeometry(() => {
      const loc = pp => X.toXY(pp, 0, 0).map(q => [q[0] - X.P[0], q[1] - X.P[1]]);
      const n = 24, e = loc(X.entryPol), x = loc(X.exitPol), st = HI ? 1 : 6;
      const thin = arr => arr.filter((_, i) => i % st === 0 || i === arr.length - 1);
      bz(thin(e.slice(0, n + 1)), thin(e.slice(n + 1).reverse()), 1.0, 2.6, { front: M.ANCHOR, side: M.ANCHOR }, false);
      bz(thin(x.slice(0, n + 1)), thin(x.slice(n + 1).reverse()), 1.0, 2.6, { front: M.ANCHOR, side: M.ANCHOR }, false);
      const bk = X.E.back * D2R;
      for (const ang of [X.psiL + bk * 0.9, X.psiR - bk * 0.9]) pz(quad(Math.cos(ang), Math.sin(ang), 1.5, -0.5, X.L + 0.3), 1.2, 2.4, { front: M.ANCHOR, side: M.ANCHOR });
      pz([[-1.0, 0], [-0.8, -9.5], [0.8, -9.5], [1.0, 0]], 1.2, 2.3, { front: M.ANCHOR, side: M.ANCHOR });   // crutch (to the pendulum)
      pz(circle(1.6, nC, 0, 0, -9.5), 1.2, 2.7, { front: M.ANCHOR, side: M.ANCHOR });
      pz(circle(3.2, nC), 0.9, 3.0, { front: M.ANCHOR, side: M.ANCHOR });
      pz(circle(1.2, nC), 3.0, 3.4, { front: M.BORE, side: M.BORE });
    });
    // verifier pawl (pivot frame): lever with a hooked nose that drops into a tooth gap at ~167°
    G.pawl = p.buildGeometry(() => {
      const nose = [-19.2 - MV.pawlPivot[0], 4.4 - MV.pawlPivot[1]], L = Math.hypot(nose[0], nose[1]), a = Math.atan2(nose[1], nose[0]);
      const c = Math.cos(a), sn = Math.sin(a), Pt = (u, v) => [c * u - sn * v, sn * u + c * v];
      pz([Pt(-2.6, -1.7), Pt(L - 1.4, -1.2), Pt(L + 0.6, 0.0), Pt(L - 1.8, 1.8), Pt(-2.6, 1.7)], 1.2, 2.5, { front: M.PAWL, side: M.PAWL });
      pz(circle(2.5, nC), 1.0, 2.9, { front: M.PAWL, side: M.PAWL });
    });
    // hand (hand arbor; points to twelve at rest) and boss
    G.hand = p.buildGeometry(() => {
      const hw = HI ? 1 : 1.8; pz([[-2.0 * hw, 6.5], [-1.6 * hw, -4], [-0.55 * hw, -28.5], [0, -30], [0.55 * hw, -28.5], [1.6 * hw, -4], [2.0 * hw, 6.5]], 5.0, 5.9, { front: M.HAND, side: M.HAND });
      pz(circle(3.1, nC), 4.6, 6.3, { front: M.HAND, side: M.HAND });
    });
    // chapter ring (on the hand arbor's centre) with 20 engraved ticks; tick 0 = home, at twelve
    G.ring = p.buildGeometry(() => {
      const [ri, ro] = MV.dial, nr = HI ? 160 : 60;
      pz(circle(ro, nr, -Math.PI, H[0], H[1]), 3.0, 4.0, { front: M.RING, side: M.EDGE }, H, true);
      for (let k = 0; k < 20; k++) {
        const a = -Math.PI / 2 + k * TAU / 20, home = k === 0, w = home ? 1.0 : (HI ? 0.42 : 0.55), r0 = home ? ri + 0.6 : ri + 2.6, r1 = ro - 1.0;
        pz(quad(Math.cos(a), Math.sin(a), w, r0, r1, H[0], H[1]), 4.0, 4.3, { front: home ? M.HOME : M.TICK, side: home ? M.HOME : M.TICK });
      }
    });
    return G;
  }

  /* ── shader: one material for every part, instanced; per-instance data from a texture ── */
  const GLSL_COMMON = `
    float dec16(vec4 t, int c) { return c == 0 ? (floor(t.r*255.0+0.5)*256.0 + floor(t.g*255.0+0.5))/65535.0 : (floor(t.b*255.0+0.5)*256.0 + floor(t.a*255.0+0.5))/65535.0; }
    vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c*v.x - s*v.y, s*v.x + c*v.y); }`;
  /** One lean custom shader for every part (GLSL 300 es): instanced placement + per-part motion from the data
   *  texture, a key light and a cool fill in view space, Blinn specular, the 45° section hatch. p5's material
   *  shader loops over light arrays per fragment; on SwiftShader that, not geometry, was the cost. */
  const VERT = `#version 300 es
precision highp float;
in vec3 aPosition; in vec3 aNormal; in vec4 aVertexColor;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; uniform mat3 uNormalMatrix;
uniform highp sampler2D uData;
uniform float uPart, uBase, uPass, uCols, uPerBank, uRatio; uniform vec2 uPivot, uPitch, uOff; uniform vec4 uBanks;
out vec3 vN; out vec3 vP; out vec2 vLocal; flat out float vCode; flat out vec4 vI0; flat out float vInst; flat out vec2 vStop;
float dec16(vec4 t, int c) { return c == 0 ? (floor(t.r*255.0+0.5)*256.0 + floor(t.g*255.0+0.5))/65535.0 : (floor(t.b*255.0+0.5)*256.0 + floor(t.a*255.0+0.5))/65535.0; }
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c*v.x - s*v.y, s*v.x + c*v.y); }
void main() {
  int id = gl_InstanceID + int(uBase + 0.5);
  vec4 t0 = texelFetch(uData, ivec2(0, id), 0), t1 = texelFetch(uData, ivec2(1, id), 0), t2 = texelFetch(uData, ivec2(2, id), 0);
  float th = dec16(t0, 0) * 6.2831853, al = (dec16(t1, 0) - 0.5) * 0.6, hand = dec16(t2, 0) * 6.2831853, lift = 0.0;
  float flags = floor(t0.b * 255.0 + 0.5), vis = floor(t1.b * 255.0 + 0.5), pw = t2.b;
  vCode = floor(aVertexColor.r * 255.0 + 0.5); vLocal = aPosition.xy; vI0 = vec4(th, hand, flags, vis); vInst = float(id);
  float ang = 0.0;
  if (uPart > 0.5 && uPart < 1.5) ang = th;
  else if (uPart > 1.5 && uPart < 2.5) ang = al;
  else if (uPart > 2.5 && uPart < 3.5) ang = -0.24 * (1.0 - pw);
  else if (uPart > 3.5 && uPart < 4.5) ang = hand;
  else if (uPart > 4.5 && uPart < 5.5) ang = th + uOff.x;
  else if (uPart > 5.5 && uPart < 6.5) ang = -0.5 * th + uOff.y;
  else if (uPart > 6.5 && uPart < 7.5) ang = th + uRatio;
  vec2 q = rot(aPosition.xy, ang) + uPivot, nq = rot(aNormal.xy, ang);
  if (uPart > 1.5 && uPart < 2.5) q.y -= lift;
  bool hide = (uPart > 2.5 && uPart < 3.5 && mod(vis, 2.0) < 0.5) || (uPass < 0.5 && mod(floor(vis / 2.0), 2.0) > 0.5);
  // placement from the data texture: x, y, z (16-bit over ±5000) and a uniform scale
  vec4 t3 = texelFetch(uData, ivec2(3, id), 0), tx = texelFetch(uData, ivec2(24, id), 0), ty = texelFetch(uData, ivec2(25, id), 0), tz = texelFetch(uData, ivec2(26, id), 0);
  vStop = vec2(floor(t3.r * 255.0 + 0.5) - 1.0, t3.g);
  float sc = max(tx.b * 2.0, 0.001);
  vec2 base = vec2(dec16(tx, 0), dec16(ty, 0)) * 10000.0 - 5000.0; float zo = dec16(tz, 0) * 10000.0 - 5000.0;
  vec4 pos = vec4(q * sc + base, zo + (hide ? -60.0 : aPosition.z) * sc, 1.0);
  if (hide) pos.xy = base;
  vec4 mv = uModelViewMatrix * pos; vP = mv.xyz; vN = normalize(uNormalMatrix * vec3(nq, aNormal.z));
  gl_Position = uProjectionMatrix * mv;
}`;
  const FRAG = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vP; in vec2 vLocal; flat in float vCode; flat in vec4 vI0; flat in float vInst; flat in vec2 vStop;
uniform highp sampler2D uData; uniform float uHatch, uSheen, uLift;
uniform vec3 cPlate, cPlateHi, cEdge, cCut, cHatch, cBore, cTrain, cWheel, cAnchor, cPawl, cCopper, cPeach, cSage, cRing, cTick, cHome, cKey, cFill, cAmb;
out vec4 outColor;
void main() {
  int code = int(vCode + 0.5); vec3 c = mix(cPlate, cPlateHi, uLift); float sh = 24.0, spec = 0.16;
  if (code == 2) {
    float u = (vLocal.x + vLocal.y) / uHatch, fw = fwidth(u) * 1.2, d = abs(fract(u) - 0.5);
    float ln = smoothstep(0.31 - fw * 0.5, 0.31 + fw * 0.5, d), aa = clamp(1.0 - (fw - 0.3) * 2.0, 0.0, 1.0);
    c = mix(mix(cCut, cHatch, 0.4 * (1.0 - aa)), cHatch, ln * aa); spec = 0.02;
  }
  else if (code == 3) { c = cBore; spec = 0.5; sh = 70.0; }
  else if (code == 4) { c = cTrain; spec = 0.35; sh = 30.0; }
  else if (code == 5) {
    c = cWheel; spec = 0.55; sh = 44.0;
    if (length(vLocal) > 15.6) { float a = atan(vLocal.y, vLocal.x); float k = floor(mod(a / 0.31415927 + 0.62 + 20.0, 20.0));
      float tint = floor(texelFetch(uData, ivec2(4 + int(k), int(vInst + 0.5)), 0).r * 255.0 + 0.5);
      if (tint > 0.5 && tint < 1.5) { c = cPeach; spec = 0.25; } else if (tint > 1.5 && tint < 2.5) { c = cSage; spec = 0.25; } }
  }
  else if (code == 6) { c = cAnchor; spec = 0.6; sh = 56.0; }
  else if (code == 7) { c = cPawl; spec = 0.3; }
  else if (code == 8) { float st = vI0.z; c = (st > 0.5 && st < 1.5) ? cPeach : (st > 1.5 ? cHome : cCopper); spec = 0.5; sh = 40.0; }
  else if (code == 9) { c = cRing; spec = 0.2; }
  else if (code == 10 || code == 11) {
    c = code == 11 ? cHome : cTick; spec = 0.05;
    // the address: the two ticks that bracket the step where this run stopped light peach
    if (vStop.x > -0.5) { float a = atan(vLocal.y - 30.0, vLocal.x); float k = floor(mod((a + 1.5707963) / 0.31415927 + 0.5 + 20.0, 20.0));
      if (abs(k - vStop.x) < 0.5 || abs(k - mod(vStop.x + 1.0, 20.0)) < 0.5) { c = cPeach * 1.25; spec = 0.0; } }
  }
  else if (code == 12) { c = cEdge; spec = 0.3; }
  // a stopped movement goes dark (all but its hand and its address)
  bool keep = code == 8 || ((code == 10 || code == 11) && c.r > cTick.r + 0.05) || (code == 5 && c != cWheel);
  if (!keep) { c *= 1.0 - 0.62 * vStop.y; spec *= 1.0 - 0.7 * vStop.y; }
  vec3 N = normalize(vN);
  vec3 V = normalize(-vP), L1 = normalize(vec3(-0.45, -0.62, 0.64)), L2 = normalize(vec3(0.7, 0.25, 0.45));
  float d1 = max(dot(N, L1), 0.0), d2 = max(dot(N, L2), 0.0);
  float s1 = pow(max(dot(N, normalize(L1 + V)), 0.0), sh);
  vec3 R = reflect(-V, N); float env = smoothstep(-0.2, 0.9, -R.y) * 0.5 + 0.5 * smoothstep(0.2, 1.0, R.x * 0.4 - R.y * 0.6);
  vec3 col = c * (cAmb + cKey * d1 + cFill * d2) + cKey * spec * (s1 + 0.35 * env * uSheen);
  outColor = vec4(col, 1.0);
}`;
  function movementShader(p, ctx, D) {
    const T = ctx.tokens, C = hx => ctx.U.color.hex2rgb(hx), mixc = (a, b, u) => ctx.U.color.mix(a, b, u);
    const pal = {
      cPlate: C(mixc(T.slate, '#0B0F12', 0.68)), cPlateHi: C(mixc(T.slate, '#0B0F12', 0.5)), cEdge: C(mixc(T.slate, '#0B0F12', 0.15)), cCut: C(mixc(T.slate, '#0B0F12', 0.42)), cHatch: C(mixc(T.slate, '#E8EEF2', 0.2)),
      cBore: C('#07090B'), cTrain: C(mixc(T.slate, '#0B0F12', 0.25)), cWheel: C(mixc(T.slate, '#E9EEF2', 0.38)), cAnchor: C(mixc(T.slate, '#0B0F12', 0.25)),
      cPawl: C(T.sage), cCopper: C(T.copper), cPeach: C(T.peach), cSage: C(T.sage), cRing: C('#0C1014'), cTick: C(mixc(T.slate, '#F2F5F7', 0.45)), cHome: C(T.ink),
      cKey: [0.98, 0.96, 0.92], cFill: [0.18, 0.22, 0.28], cAmb: [0.30, 0.32, 0.36],
    };
    const sh = p.createShader(VERT, FRAG);
    sh.__pal = pal; sh.__D = D;
    return sh;
  }
  function setUniforms(sh, D) {
    for (const [k, v] of Object.entries(sh.__pal)) sh.setUniform(k, v);
    sh.setUniform('uData', D.img); sh.setUniform('uHatch', D.hatch); sh.setUniform('uSheen', D.sheen == null ? 1 : D.sheen); sh.setUniform('uLift', D.lift || 0); sh.setUniform('uCols', D.cols); sh.setUniform('uPerBank', D.perBank);
    sh.setUniform('uPitch', D.pitch); sh.setUniform('uBanks', D.banks); sh.setUniform('uRatio', D.ratio); sh.setUniform('uOff', D.off);
  }

  /** per-instance data texture: rows = instances; texel 0 θ|α, 1 pawl|lift, 2 hand|flags|vis, 4..23 tooth tints */
  function dataTexture(p, n) {
    const img = p.createImage(28, n); img.loadPixels();
    for (let i = 0; i < img.pixels.length; i++) img.pixels[i] = 0;
    return img;
  }
  const put16 = (px, o, v) => { const q = Math.round(clamp(v, 0, 1) * 65535); px[o] = q >> 8; px[o + 1] = q & 255; };
  /** st: {th (rad, wheel), al, pawl 0…1, hand (rad), handState 0 run · 1 failed · 2 home, vis bit0 pawl · bit1 hidden in lo}.
   *  RGB only, alpha 255: p5.Image is canvas-backed, so a low alpha byte would premultiply the data away. */
  function writeInstance(img, i, st, tints) {
    const px = img.pixels, o = i * 28 * 4, wrap = a => ((a % TAU) + TAU) % TAU / TAU;
    // stop step (address) + dimming; position (±5000) and scale
    px[o + 12] = st.stop == null || st.stop < 0 ? 0 : st.stop + 1; px[o + 13] = Math.round(clamp(st.dim || 0, 0, 1) * 255); px[o + 15] = 255;
    const P = st.pos || [0, 0, 0];
    put16(px, o + 96, (P[0] + 5000) / 10000); px[o + 98] = Math.round(clamp((st.scale == null ? 1 : st.scale) / 2, 0, 1) * 255); px[o + 99] = 255;
    put16(px, o + 100, (P[1] + 5000) / 10000); px[o + 103] = 255;
    put16(px, o + 104, (P[2] + 5000) / 10000); px[o + 107] = 255;
    put16(px, o, wrap(st.th)); px[o + 2] = st.handState || 0; px[o + 3] = 255;
    put16(px, o + 4, st.al / 0.6 + 0.5); px[o + 6] = st.vis || 0; px[o + 7] = 255;
    put16(px, o + 8, wrap(st.hand)); px[o + 10] = Math.round(clamp(st.pawl || 0, 0, 1) * 255); px[o + 11] = 255;
    for (let k = 0; k < 20; k++) { const q = o + (4 + k) * 4; px[q] = tints ? tints[k] : 0; px[q + 3] = 255; }
  }

  /** draw `n` instanced movements (lo) and, optionally, instance `hi` again in full detail (its lo copy is hidden by
   *  flag bit 1, set by the caller). Front to back, so SwiftShader's depth test rejects what is covered. */
  function drawMovements(p, Glo, Ghi, sh, D, X, n, hi) {
    const tr = MV.train, E = MV.E, H = MV.H, I = MV.I;
    const lEI = Math.atan2(I[1] - E[1], I[0] - E[0]), lIH = Math.atan2(H[1] - I[1], H[0] - I[0]);
    // exact mesh phases: θI = meshAngle(θE), θH = meshAngle(θI); both affine in θE, so pass their offsets
    const thI = thE => meshAngle(thE, tr.zE, tr.zI, lEI), thH = thE => meshAngle(thI(thE), tr.zI, tr.zH, lIH);
    D.off = [0, thI(0)]; D.ratio = thH(0);
    p.noStroke(); p.shader(sh); setUniforms(sh, D);
    const pass = (G, count, base, ps) => {
      sh.setUniform('uBase', base); sh.setUniform('uPass', ps);
      const part = (g, k, pivot) => { if (!g) return; sh.setUniform('uPart', k); sh.setUniform('uPivot', pivot || [0, 0]); p.model(g, count); };
      part(G.hand, 4, H); part(G.ring, 0);
      part(G.pawl, 3, [E[0] + MV.pawlPivot[0], E[1] + MV.pawlPivot[1]]); part(G.anchor, 2, [E[0] + X.P[0], E[1] + X.P[1]]); part(G.wheel, 1, E);
      part(G.front, 0);
      part(G.gearH, 7, H); part(G.gearI, 6, I); part(G.gearE, 5, E);
      part(G.back, 0);
    };
    if (hi != null && hi >= 0 && Ghi) pass(Ghi, 1, hi, 1);
    if (n > 0) pass(Glo, n, 0, 0);
    p.resetShader();
  }

  /* ── a plain part shader (non-instanced; p5 transforms place it): same light, same hatch, a tint override ── */
  const VERT2 = `#version 300 es
precision highp float;
in vec3 aPosition; in vec3 aNormal; in vec4 aVertexColor;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; uniform mat3 uNormalMatrix;
out vec3 vN; out vec3 vP; out vec2 vLocal; flat out float vCode;
void main() { vCode = floor(aVertexColor.r * 255.0 + 0.5); vLocal = aPosition.xy; vec4 mv = uModelViewMatrix * vec4(aPosition, 1.0); vP = mv.xyz;
  vN = normalize(uNormalMatrix * aNormal); gl_Position = uProjectionMatrix * mv; }`;
  const FRAG2 = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vP; in vec2 vLocal; flat in float vCode;
uniform float uHatch, uUseTint; uniform vec3 uJobTint;
uniform vec3 cPlate, cEdge, cCut, cHatch, cBore, cTrain, cWheel, cAnchor, cPawl, cCopper, cRing, cTick, cHome, cKey, cFill, cAmb;
out vec4 outColor;
void main() {
  int code = int(vCode + 0.5); vec3 c = cPlate; float sh = 24.0, spec = 0.16;
  if (code == 2) { float u = (vLocal.x + vLocal.y) / uHatch, fw = fwidth(u) * 1.2, d = abs(fract(u) - 0.5);
    float ln = smoothstep(0.31 - fw * 0.5, 0.31 + fw * 0.5, d), aa = clamp(1.0 - (fw - 0.3) * 2.0, 0.0, 1.0); c = mix(mix(cCut, cHatch, 0.4 * (1.0 - aa)), cHatch, ln * aa); spec = 0.02; }
  else if (code == 3) { c = cBore; spec = 0.5; sh = 70.0; }
  else if (code == 4) { c = cTrain; spec = 0.35; sh = 30.0; }
  else if (code == 5) { c = cWheel; spec = 0.5; sh = 44.0; }
  else if (code == 6) { c = cAnchor; spec = 0.6; sh = 56.0; }
  else if (code == 7) { c = cPawl; spec = 0.3; }
  else if (code == 9) { c = cRing; spec = 0.2; }
  else if (code == 10) { c = cTick; spec = 0.05; }
  else if (code == 11) { c = cHome; spec = 0.05; }
  else if (code == 12) { c = cEdge; spec = 0.3; }
  else if (code == 14) { c = cCopper; spec = 0.9; sh = 60.0; }
  if (uUseTint > 0.5) { c = uJobTint * 0.86; spec = 0.32; sh = 50.0; }
  vec3 N = normalize(vN), V = normalize(-vP), L1 = normalize(vec3(-0.45, -0.62, 0.64)), L2 = normalize(vec3(0.7, 0.25, 0.45));
  float d1 = max(dot(N, L1), 0.0), d2 = max(dot(N, L2), 0.0), s1 = pow(max(dot(N, normalize(L1 + V)), 0.0), sh);
  vec3 R = reflect(-V, N); float env = smoothstep(-0.2, 0.9, -R.y) * 0.5 + 0.5 * smoothstep(0.2, 1.0, R.x * 0.4 - R.y * 0.6);
  outColor = vec4(c * (cAmb + cKey * d1 + cFill * d2) + cKey * spec * (s1 + 0.35 * env), 1.0);
}`;
  function partShader(p, ctx) {
    const T = ctx.tokens, C = hx => ctx.U.color.hex2rgb(hx), mixc = (a, b, u) => ctx.U.color.mix(a, b, u);
    const sh = p.createShader(VERT2, FRAG2);
    sh.__pal = { cPlate: C(mixc(T.slate, '#0B0F12', 0.66)), cEdge: C(mixc(T.slate, '#0B0F12', 0.2)), cCut: C(mixc(T.slate, '#0B0F12', 0.48)), cHatch: C(mixc(T.slate, '#E8EEF2', 0.2)),
      cBore: C('#06080A'), cTrain: C(mixc(T.slate, '#0B0F12', 0.3)), cWheel: C(mixc(T.slate, '#E9EEF2', 0.3)), cAnchor: C(mixc(T.slate, '#0B0F12', 0.15)),
      cPawl: C(T.sage), cCopper: C(T.copper), cRing: C('#0C1014'), cTick: C(mixc(T.slate, '#F2F5F7', 0.45)), cHome: C(T.ink),
      cKey: [0.98, 0.96, 0.92], cFill: [0.18, 0.22, 0.28], cAmb: [0.30, 0.32, 0.36] };
    return sh;
  }
  function usePart(p, sh, hatch) { p.shader(sh); for (const [k, v] of Object.entries(sh.__pal)) sh.setUniform(k, v); sh.setUniform('uHatch', hatch || 3); sh.setUniform('uUseTint', 0); }
  function tint(sh, rgb) { if (rgb) { sh.setUniform('uUseTint', 1); sh.setUniform('uJobTint', rgb); } else sh.setUniform('uUseTint', 0); }

  return { TAU, D2R, M, MV, clamp, sstep, circle, clipHalf, involute, meshAngle, escapeTeeth, prism, band, resampleStar, escapement, runState,
    buildMovement, movementShader, setUniforms, partShader, usePart, tint, gearSolidHi: null, roundRect, quad, dataTexture, writeInstance, drawMovements, GLSL_COMMON };
})();
