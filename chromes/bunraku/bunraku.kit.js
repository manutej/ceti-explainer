/* F · BUNRAKU — kit (shared by both films).
   A toy-theatre district rendered as cut-paper planes at true depths under one raking tungsten key per stage.
   One draw call per pass: every stage is ONE instanced mesh (drape, floor, operators, rods, plank, puppet,
   proscenium, chalk board) in painter's order; per-stage pose lives in a raw RGBA32F data texture (exact floats,
   uploaded each frame) and part rects in a static table texture. One GLSL 300 es uber-shader does:
     · per-plane thin-lens depth of field: CoC = K·|d − d_f|/d, sampled from an atlas pyramid blurred ONCE in setup
       (L0 2048² + five pre-blurred levels packed beside it; two levels mixed per fragment);
     · analytic contact shadows: a receiver fragment casts a ray to the key, intersects the puppet and operator
       planes, looks up the silhouette and blurs it by the penumbra R·gap/|P−L| (sharp at the feet, soft on the
       drape); rods shadow as projected capsules;
     · the cut edge catching the key, paper fibre relief, velvet sheen, chalk.
   Falling job slips run the Andersen–Pesavento–Wang (2005) quasi-steady plate ODE, RK4, tabulated in setup.
   Clock law: everything here is a pure function of (t, engine, state). No randomness except U.h. */
window.BK = (function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

  /* ─────────────── stage geometry (units, y down, z toward the audience) ─────────────── */
  const S = {
    plankHalf: 104, plankZ: 3.5, plankT: 3,
    floorY: 104, drapeZ: -74, drapeX: 120, drapeTop: -130,
    opZ: -38, chkZ: -22, pupZ: 0,
    prosZ: 48, prosOuter: [-134, -164, 134, 126], prosOpen: [-104, -128, 104, 70],
    board: [-94, 78, 94, 117],
    light: [-170, -140, 200], aim: [30, -24, -60], lightR: 9, cos0: Math.cos(0.36), cos1: Math.cos(0.62),
    xStep: j => -52 + 6.2 * j,
  };

  /* ─────────────── slots in a data row (2 texels = 8 floats each) ─────────────── */
  const SL = { stage: 0, bbox: 1, ticks: 2, misc: 3,
    farSleeve: 4, farFore: 5, farLeg: 6, farFoot: 7, torso: 8, head: 9, nearLeg: 10, nearFoot: 11, nearSleeve: 12, nearFore: 13, slip: 14,
    planBody: 16, planArm: 17, actBody: 18, actArm: 19, chkBody: 20, chkArm: 21,
    rodPlan: 22, rodAct: 24, rodChk: 26, threadA: 28, threadB: 30 };
  const NSLOT = 32, ROWW = NSLOT * 2;

  /* part ids (rows of the static table texture) */
  const PID = { torso: 1, head: 2, sleeve: 3, fore: 4, leg: 5, foot: 6, slip: 7, opBody: 8, opArm: 9, opCrouch: 10, pros: 11,
    title: 12, title2: 13, tag0: 14, tag1: 15, tag2: 16, tag3: 17, tag4: 18, tag5: 19, opBare: 22, card0: 23, card1: 24,
    pTorso: 25, pHead: 26, pSleeve: 27, pFore: 28, pLeg: 29, pFoot: 30, boardFace: 31 };
  const NPART = 32;
  /* materials (table texel 2 .y) */
  const MAT = { paper: 0, cloth: 1, copper: 2, stencil: 3, chalk: 4 };

  /* ─────────────── raw GL textures, bound through p5 (patch a p5 texture's handle) ─────────────── */
  function rawTexture(p, w, h, opt) {
    const gl = p._renderer.GL, dummy = p.createImage(2, 2), tex = p._renderer.getTexture(dummy);
    const T = gl.createTexture(), flt = !!opt.float, lin = !!opt.linear;
    gl.bindTexture(gl.TEXTURE_2D, T);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, lin ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, lin ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    if (flt) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, opt.data || new Float32Array(w * h * 4));
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, opt.data || new Uint8Array(w * h * 4));
    gl.bindTexture(gl.TEXTURE_2D, null);
    tex.textureHandle.texture = T; tex.update = () => false;
    return {
      src: dummy, w, h, data: opt.data,
      upload(data) { gl.bindTexture(gl.TEXTURE_2D, T); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RGBA, flt ? gl.FLOAT : gl.UNSIGNED_BYTE, data); gl.bindTexture(gl.TEXTURE_2D, null); },
    };
  }

  /* ─────────────── the atlas: cut paper drawn in canvas 2D, fibre-textured, premultiplied, pyramid ─────────────── */
  const AW = 3072, AH = 2048, L0 = 2048;
  const LV = [[0, 0, 2048], [2048, 0, 1024], [2048, 1024, 512], [2560, 1024, 256], [2816, 1024, 128], [2944, 1024, 64]];

  function paperRGB(kind) {
    return { kozo: [236, 226, 204], kraft: [150, 106, 72], shibu: [118, 74, 48], cloth: [13, 12, 12], hair: [22, 19, 18], copper: null }[kind];
  }
  /** Build every cut-paper part. defs: [{id, rect:[x0,y0,x1,y1] (local units), tpu, mat, draw(g, U)}]. */
  function buildAtlas(p, ctx, defs) {
    const cv = document.createElement('canvas'); cv.width = L0; cv.height = L0;
    const g = cv.getContext('2d', { willReadFrequently: true });
    // shelf pack, 40 px gutters (keeps the coarse levels from bleeding)
    const items = defs.map(d => Object.assign({}, d, { pw: Math.ceil((d.rect[2] - d.rect[0]) * d.tpu), ph: Math.ceil((d.rect[3] - d.rect[1]) * d.tpu) }))
      .sort((a, b) => b.ph - a.ph);
    let x = 40, y = 40, shelf = 0;
    for (const it of items) {
      if (x + it.pw + 40 > L0) { x = 40; y += shelf + 40; shelf = 0; }
      it.px = x; it.py = y; x += it.pw + 40; shelf = Math.max(shelf, it.ph);
      if (y + it.ph + 40 > L0) throw new Error('BK atlas overflow');
    }
    const U = ctx.U;
    for (const it of items) {
      g.save(); g.translate(it.px, it.py); g.scale(it.tpu, it.tpu); g.translate(-it.rect[0], -it.rect[1]);
      g.beginPath(); g.rect(it.rect[0], it.rect[1], it.rect[2] - it.rect[0], it.rect[3] - it.rect[1]); g.clip();
      it.draw(g, U, it);
      g.restore();
      // fibres: long kozo fibres / cloth weave, only where something was cut (source-atop)
      if (it.fibres !== false) fibres(g, it, U);
    }
    const im = g.getImageData(0, 0, L0, L0), s = im.data;
    // premultiply + grain
    for (let i = 0, n = L0 * L0; i < n; i++) {
      const o = i * 4, a = s[o + 3] / 255;
      if (a === 0) { s[o] = s[o + 1] = s[o + 2] = 0; continue; }
      const gr = 1;
      s[o] = Math.min(255, s[o] * gr) * a; s[o + 1] = Math.min(255, s[o + 1] * gr) * a; s[o + 2] = Math.min(255, s[o + 2] * gr) * a;
    }
    // pyramid: L(n+1) = blur121(box2(Ln))
    const out = new Uint8Array(AW * AH * 4);
    const put = (lv, src, sz) => { const [ox, oy] = LV[lv]; for (let yy = 0; yy < sz; yy++) out.set(src.subarray(yy * sz * 4, (yy + 1) * sz * 4), ((oy + yy) * AW + ox) * 4); };
    let cur = new Float32Array(s.length); for (let i = 0; i < s.length; i++) cur[i] = s[i];
    put(0, Uint8Array.from(s), L0);
    let sz = L0;
    for (let lv = 1; lv < LV.length; lv++) {
      const n = sz >> 1, d = new Float32Array(n * n * 4);
      for (let yy = 0; yy < n; yy++) for (let xx = 0; xx < n; xx++) for (let c = 0; c < 4; c++) {
        const a = ((2 * yy) * sz + 2 * xx) * 4 + c, b = a + sz * 4;
        d[(yy * n + xx) * 4 + c] = (cur[a] + cur[a + 4] + cur[b] + cur[b + 4]) * 0.25;
      }
      const tmp = new Float32Array(d.length);
      for (let pass = 0; pass < 2; pass++) {           // separable [1 2 1]
        const src = pass ? tmp : d, dst = pass ? d : tmp;
        for (let yy = 0; yy < n; yy++) for (let xx = 0; xx < n; xx++) for (let c = 0; c < 4; c++) {
          const at = (X, Y) => src[((clamp(Y, 0, n - 1)) * n + clamp(X, 0, n - 1)) * 4 + c];
          dst[(yy * n + xx) * 4 + c] = pass ? (at(xx, yy - 1) + 2 * at(xx, yy) + at(xx, yy + 1)) * 0.25 : (at(xx - 1, yy) + 2 * at(xx, yy) + at(xx + 1, yy)) * 0.25;
        }
      }
      put(lv, Uint8Array.from(d, v => Math.round(v)), n);
      cur = d; sz = n;
    }
    const tex = rawTexture(p, AW, AH, { linear: true, data: out });
    const table = {};
    for (const it of items) table[it.id] = { rect: it.rect, uv: [it.px / L0, it.py / L0, it.pw / L0, it.ph / L0], tpu: it.tpu, mat: it.mat, relief: it.relief ?? 1, sheen: it.sheen ?? 0 };
    return { tex, table, canvas: cv };
  }
  function fibres(g, it, U) {
    g.save(); g.translate(it.px, it.py); g.globalCompositeOperation = 'source-atop';
    const W = it.pw, H = it.ph, cloth = it.mat === MAT.cloth, n = Math.round(W * H / (cloth ? 120 : 260));
    for (let i = 0; i < n; i++) {
      const sx = U.h(it.id, i, 1) * W, sy = U.h(it.id, i, 2) * H, ang = (U.h(it.id, i, 3) - 0.5) * (cloth ? 0.2 : 3.0) + (cloth ? Math.PI / 2 : 0);
      const len = (cloth ? 6 : 10) + U.h(it.id, i, 4) * (cloth ? 20 : 60), bend = (U.h(it.id, i, 5) - 0.5) * 0.9;
      const light = U.h(it.id, i, 6) > (cloth ? 0.5 : 0.35);
      g.strokeStyle = cloth ? (light ? 'rgba(60,58,56,0.14)' : 'rgba(0,0,0,0.3)') : (light ? 'rgba(255,252,240,0.22)' : 'rgba(120,96,64,0.09)');
      g.lineWidth = cloth ? 0.8 : 0.5 + U.h(it.id, i, 7) * 0.9;
      g.beginPath(); g.moveTo(sx, sy);
      const ex = sx + Math.cos(ang) * len, ey = sy + Math.sin(ang) * len;
      g.quadraticCurveTo((sx + ex) / 2 + Math.cos(ang + 1.57) * len * bend, (sy + ey) / 2 + Math.sin(ang + 1.57) * len * bend, ex, ey); g.stroke();
    }
    g.restore();
  }

  /* drawing helpers in local units */
  const poly = (g, pts, fill) => { g.beginPath(); pts.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fillStyle = fill; g.fill(); };
  const rgb = (c, k = 1) => `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;
  const ell = (g, x, y, rx, ry, fill, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, TAU); g.fillStyle = fill; g.fill(); };

  /** The cut-paper parts of a stage. The puppet faces +x (walks right), in profile; no face, no features. */
  function partDefs(ctx, extra) {
    const kozo = paperRGB('kozo'), shibu = paperRGB('shibu'), kraft = paperRGB('kraft'), cloth = paperRGB('cloth'), hair = paperRGB('hair');
    const T = ctx.tokens, cu = ctx.U.color.hex2rgb(T.copper).map(v => v * 255);
    const defs = [
      { id: PID.torso, rect: [-10, -22, 10, 4], tpu: 11, mat: MAT.paper, draw(g) {
        poly(g, [[-1.6, -17.4], [2.4, -17.2], [5.6, -15.2], [6.6, -10], [6.0, -5], [6.4, 0.6], [-6.2, 0.8], [-5.6, -6], [-6.0, -12], [-5.0, -15.6]], rgb(kozo));
        poly(g, [[-6.0, -6.2], [6.1, -6.0], [6.3, -2.2], [-6.1, -2.4]], rgb(kraft));                         // obi
        poly(g, [[0.6, -17.2], [2.6, -17], [4.2, -9.6], [3.2, -9.6]], rgb(kozo, 0.8));                       // collar fold (darker kozo)
        g.strokeStyle = rgb(kozo, 0.72); g.lineWidth = 0.22; g.beginPath(); g.moveTo(-3, -14); g.quadraticCurveTo(-1, -9, -2.6, -6.4); g.stroke();
      } },
      { id: PID.head, rect: [-8, -16, 8, 3], tpu: 11, mat: MAT.paper, draw(g) {
        ell(g, 0.9, -6.2, 4.3, 5.4, rgb(kozo), 0.12);
        poly(g, [[-0.6, -1.6], [1.8, -1.4], [1.6, 0.8], [-0.4, 0.8]], rgb(kozo, 0.92));                      // neck
        g.save(); g.beginPath(); g.ellipse(0.9, -6.2, 4.45, 5.55, 0.12, 0, TAU); g.clip();
        poly(g, [[-5, -14], [5.8, -14], [5.8, -9.4], [2.2, -9.0], [-0.6, -7.4], [-2.4, -4.2], [-5, -2]], rgb(hair)); g.restore();
        ell(g, -3.9, -9.6, 2.5, 2.0, rgb(hair), -0.5);                                                     // knot
        ell(g, -2.6, -11.6, 1.6, 1.1, rgb(hair), -0.2);
      } },
      { id: PID.sleeve, rect: [-7, -4, 7, 17], tpu: 11, mat: MAT.paper, draw(g) {
        poly(g, [[-2.6, -1.4], [2.8, -1.4], [4.4, 7], [5.0, 12.6], [2.0, 14.6], [-3.6, 14.2], [-4.8, 7]], rgb(kozo));
        g.strokeStyle = rgb(kozo, 0.75); g.lineWidth = 0.25; g.beginPath(); g.moveTo(-0.5, 2); g.lineTo(-1.6, 13.5); g.stroke();
      } },
      { id: PID.fore, rect: [-4, -3, 4, 14], tpu: 11, mat: MAT.paper, draw(g) {
        poly(g, [[-1.3, -0.6], [1.3, -0.6], [1.1, 8.4], [-1.1, 8.4]], rgb(kozo, 0.9));
        ell(g, 0.2, 10.2, 1.6, 2.2, rgb(kozo, 0.97));
      } },
      { id: PID.leg, rect: [-8, -3, 8, 20], tpu: 11, mat: MAT.paper, draw(g) {
        poly(g, [[-3.6, -1.2], [3.6, -1.2], [5.4, 17.4], [-5.0, 17.6]], rgb(shibu));
        g.strokeStyle = rgb(shibu, 0.62); g.lineWidth = 0.3;
        for (const k of [-1.6, 0.4, 2.4]) { g.beginPath(); g.moveTo(k * 0.8, 0); g.lineTo(k * 1.25, 17.2); g.stroke(); }
      } },
      { id: PID.foot, rect: [-4, -3, 7, 4], tpu: 11, mat: MAT.paper, draw(g) {
        poly(g, [[-1.4, -1.6], [1.6, -1.2], [4.6, 0.4], [4.9, 1.7], [-1.9, 1.8]], rgb(kozo, 0.98));
      } },
      { id: PID.slip, rect: [-5, -1.6, 5, 10.6], tpu: 11, mat: MAT.copper, relief: 0.6, draw(g) {
        poly(g, [[-3.8, 0], [3.8, 0], [3.8, 9], [-3.8, 9]], rgb(cu));
        g.strokeStyle = rgb(cu, 0.72); g.lineWidth = 0.28;
        for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-2.6, 2.2 + k * 1.7); g.lineTo(k === 3 ? 0.4 : 2.6, 2.2 + k * 1.7); g.stroke(); }
      } },
      { id: PID.opBody, rect: [-30, -184, 30, 4], tpu: 2.6, mat: MAT.cloth, relief: 0.2, sheen: 1, draw(g) {
        // kurogo: hood (a stiff cap with a veil to the chest), shoulders, robe to the floor
        poly(g, [[-9, -170], [-5, -178], [5, -178], [10, -170], [12, -146], [21, -140], [24, -128], [23, -92], [20, -40], [22, 0], [-22, 0], [-20, -40], [-23, -92], [-24, -128], [-21, -140], [-12, -146]], rgb(cloth));
        g.strokeStyle = 'rgba(48,46,44,0.6)'; g.lineWidth = 0.5;
        for (const k of [-10, -2, 7, 14]) { g.beginPath(); g.moveTo(k, -120); g.quadraticCurveTo(k * 1.15, -60, k * 1.3, 0); g.stroke(); }
      } },
      { id: PID.opArm, rect: [-8, -7, 8, 40], tpu: 2.6, mat: MAT.cloth, relief: 0.2, sheen: 1, draw(g) {
        poly(g, [[-5.5, -4], [5.5, -4], [4.6, 26], [3.6, 31], [-3.4, 31], [-4.8, 26]], rgb(cloth));
        ell(g, 0, 33.5, 3.4, 3.8, rgb(cloth));                                                             // gloved fist
      } },
      { id: PID.opCrouch, rect: [-34, -104, 34, 4], tpu: 2.6, mat: MAT.cloth, relief: 0.2, sheen: 1, draw(g) {
        poly(g, [[3, -92], [8, -98], [16, -97], [20, -90], [20, -70], [26, -62], [27, -48], [22, -30], [26, -14], [24, 0], [-26, 0], [-28, -18], [-24, -40], [-14, -60], [-2, -68], [2, -76]], rgb(cloth));
      } },
      { id: PID.pros, rect: [-134, -164, 134, 126], tpu: 2, mat: MAT.paper, relief: 0.7, draw(g) {
        // a kozo frame with a scalloped valance and slotted pilasters; the board sits in the lower panel
        g.beginPath(); g.rect(-134, -164, 268, 290);
        g.moveTo(-104, -128); for (let i = 0; i <= 13; i++) { const x0 = -104 + i * 16; g.lineTo(x0, -128); if (i < 13) g.quadraticCurveTo(x0 + 8, -112, x0 + 16, -128); }
        g.lineTo(104, 70); g.lineTo(-104, 70); g.closePath();
        g.fillStyle = rgb(kozo, 0.96); g.fill('evenodd');
        g.fillStyle = 'rgba(0,0,0,1)'; g.globalCompositeOperation = 'destination-out';
        for (const sx of [-124, -116, 112, 120]) { g.beginPath(); g.rect(sx, -100, 4, 150); g.fill(); }
        for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-80 + i * 20, -146, 3.2, 0, TAU); g.fill(); }
        g.globalCompositeOperation = 'source-over';
        g.strokeStyle = rgb(kozo, 0.78); g.lineWidth = 0.6; g.strokeRect(-128, -158, 256, 278);
      } },
      { id: PID.pTorso, rect: [-10, -22, 10, 4], tpu: 11, mat: MAT.paper, relief: 0.5, draw(g) {
        poly(g, [[-1.8, -17.6], [2.2, -17.4], [5.4, -15.4], [6.0, -9], [5.4, 0.6], [-5.6, 0.8], [-5.2, -8], [-5.2, -15.6]], rgb([34, 31, 30]));
        poly(g, [[-0.6, -17.4], [2.2, -17.2], [1.0, -12.5]], rgb(kozo, 0.85));
      } },
      { id: PID.pHead, rect: [-8, -16, 8, 3], tpu: 11, mat: MAT.paper, draw(g) {
        ell(g, 0.8, -6.4, 4.2, 5.5, rgb(kozo, 0.94), 0.1);
        poly(g, [[-0.6, -1.6], [1.8, -1.4], [1.6, 0.8], [-0.4, 0.8]], rgb(kozo, 0.88));
      } },
      { id: PID.pSleeve, rect: [-7, -4, 7, 17], tpu: 11, mat: MAT.paper, relief: 0.5, draw(g) {
        poly(g, [[-2.4, -1.4], [2.6, -1.4], [2.4, 10], [-2.2, 10]], rgb([30, 28, 27]));
      } },
      { id: PID.pFore, rect: [-4, -3, 4, 14], tpu: 11, mat: MAT.paper, relief: 0.5, draw(g) {
        poly(g, [[-1.3, -0.6], [1.3, -0.6], [1.1, 8.4], [-1.1, 8.4]], rgb([30, 28, 27])); ell(g, 0.2, 10.2, 1.5, 2.0, rgb(kozo, 0.94));
      } },
      { id: PID.pLeg, rect: [-8, -3, 8, 20], tpu: 11, mat: MAT.paper, relief: 0.5, draw(g) {
        poly(g, [[-2.8, -1.2], [2.8, -1.2], [2.6, 17.4], [-2.4, 17.6]], rgb([26, 24, 23]));
      } },
      { id: PID.pFoot, rect: [-4, -3, 7, 4], tpu: 11, mat: MAT.paper, draw(g) {
        poly(g, [[-1.4, -1.4], [1.8, -1.0], [4.6, 0.6], [4.8, 1.8], [-1.9, 1.8]], rgb([20, 18, 17]));
      } },
      { id: PID.opBare, rect: [-30, -184, 30, 4], tpu: 2.6, mat: MAT.cloth, relief: 0.2, sheen: 1, draw(g) {
        // the unhooded master: a person, bare head, no face — black robe like the others
        poly(g, [[-6, -146], [6, -146], [21, -140], [24, -128], [23, -92], [20, -40], [22, 0], [-22, 0], [-20, -40], [-23, -92], [-24, -128], [-21, -140]], rgb([78, 71, 64]));
        g.strokeStyle = 'rgba(40,36,32,0.7)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(0, -144); g.lineTo(1, -60); g.stroke();
        ell(g, 1.5, -160, 9.2, 11.6, rgb(kozo, 0.9), 0.1);
        poly(g, [[-3.5, -151], [5.5, -151], [5, -144], [-3, -144]], rgb(kozo, 0.8));
      } },
    ];
    return defs.concat(extra || []);
  }

  /** Stencil card: a kozo card with the words cut OUT (the key throws them onto the drape). */
  function stencilDef(id, lines, font, wUnits, hUnits, tpu) {
    return { id, rect: [-wUnits / 2, -hUnits / 2, wUnits / 2, hUnits / 2], tpu, mat: MAT.stencil, relief: 0.8, draw(g) {
      g.fillStyle = rgb(paperRGB('kozo'), 0.97); g.fillRect(-wUnits / 2, -hUnits / 2, wUnits, hUnits);
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      let k = 1; lines.forEach(L => { g.font = `${L.weight || 800} ${L.size}px "${font}"`; k = Math.min(k, (wUnits - 14) / g.measureText(L.text).width); });
      lines.forEach(L => { g.font = `${L.weight || 800} ${L.size * k}px "${font}"`; g.fillText(L.text, L.x || 0, L.y); });
      g.globalCompositeOperation = 'source-over';
      g.fillStyle = 'rgba(0,0,0,1)'; g.globalCompositeOperation = 'destination-out';
      for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * (wUnits / 2 - 5), -hUnits / 2 + 4.5, 1.4, 0, TAU); g.fill(); }  // thread holes
      g.globalCompositeOperation = 'source-over';
    } };
  }
  /** The move board's face: numerals 1–20 in chalk, one per cell (the address reads off the cell). */
  function boardDef(font) {
    return { id: PID.boardFace, rect: [S.board[0], S.board[1], S.board[2], S.board[3]], tpu: 4, mat: MAT.chalk, fibres: false, draw(g, U) {
      const w = (S.board[2] - S.board[0]) / 20;
      g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = `400 ${w * 0.62}px "${font}"`;
      for (let i = 0; i < 20; i++) g.fillText(String(i + 1), S.board[0] + (i + 0.5) * w, S.board[1] + 13.5);
      erode(g, U, S.board[0], S.board[1], S.board[2] - S.board[0], S.board[3] - S.board[1], 31, 0.25);
    } };
  }
  /** chalk writing on black cloth: lines [{text, size, y, weight, font}] */
  function chalkDef(id, w, h, lines, tpu = 5) {
    return { id, rect: [-w / 2, -h / 2, w / 2, h / 2], tpu, mat: MAT.chalk, fibres: false, draw(g, U) {
      g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      lines.forEach(L => { g.font = `${L.weight || 400} ${L.size}px "${L.font}"`; g.fillText(L.text, L.x || 0, L.y); });
      if (lines.strokes) { g.strokeStyle = '#ffffff'; g.lineCap = 'round'; g.lineWidth = 2.2; lines.strokes.forEach(([x0, y0, x1, y1]) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }); }
      erode(g, U, -w / 2, -h / 2, w, h, id, 0.6); erode(g, U, -w / 2, -h / 2, w, h, id + 7, 0.35);
    } };
  }
  function erode(g, U, x, y, w, h, seed, amt) {
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
    const n = Math.round(w * h * 1.6);
    for (let i = 0; i < n; i++) { const px = x + U.h(seed, i, 1) * w, py = y + U.h(seed, i, 2) * h; g.globalAlpha = amt * (0.4 + 0.6 * U.h(seed, i, 3)); g.fillRect(px, py, 0.35 + U.h(seed, i, 4) * 0.5, 0.18 + U.h(seed, i, 5) * 0.3); }
    g.restore();
  }
  /** Paper tag on a thread: word in ink + a semantic swatch (the only colour on it). */
  function tagDef(id, word, sub, colHex, font, w = 44, h = 15) {
    return { id, rect: [-w / 2, -h / 2 - 2, w / 2, h / 2 + 1], tpu: 10, mat: MAT.paper, relief: 0.6, draw(g, U) {
      const kozo = paperRGB('kozo'), c = U.color.hex2rgb(colHex).map(v => v * 255);
      poly(g, [[-w / 2, -h / 2], [w / 2 - 3, -h / 2], [w / 2, -h / 2 + 3], [w / 2, h / 2], [-w / 2, h / 2]], rgb(kozo));
      g.fillStyle = rgb(c); g.fillRect(-w / 2, -h / 2, 3.2, h);
      g.fillStyle = '#1b1714'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      g.font = `600 7.2px "${font}"`; g.fillText(word, -w / 2 + 6, -0.6);
      g.font = `400 4.6px "${font}"`; g.fillStyle = '#4a4038'; g.fillText(sub, -w / 2 + 6, 5.4);
      g.fillStyle = 'rgba(0,0,0,1)'; g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, -h / 2 + 1.8, 0.9, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over';
    } };
  }

  /* ─────────────── the stage mesh (one instanced draw) ─────────────── */
  // kinds: 1 drape · 2 floor · 3 plank top · 4 plank front · 5 trestle · 6 proscenium · 7 chalk board · 8 card · 9 rod · 10 thread · 12 flutter card
  function buildGroups(p, table) {
    const quadXY = (k, slot, part, x0, y0, x1, y1, z) => { p.fill(k, slot, part); p.vertex(x0, y0, z, 0, 0); p.vertex(x1, y0, z, 1, 0); p.vertex(x1, y1, z, 1, 1); p.vertex(x0, y0, z, 0, 0); p.vertex(x1, y1, z, 1, 1); p.vertex(x0, y1, z, 0, 1); };
    const quadXZ = (k, x0, z0, x1, z1, y) => { p.fill(k, 0, 0); p.vertex(x0, y, z0, 0, 0); p.vertex(x1, y, z0, 1, 0); p.vertex(x1, y, z1, 1, 1); p.vertex(x0, y, z0, 0, 0); p.vertex(x1, y, z1, 1, 1); p.vertex(x0, y, z1, 0, 1); };
    const card = (slot, part, kind = 8) => { const r = table[part].rect; quadXY(kind, slot, part, r[0], r[1], r[2], r[3], 0); };
    const rod = (slot, kind = 9) => {   // ribbon A→B→C, 6 samples per leg, side ±1 in y
      const n = 6; p.fill(kind, slot, 0);
      for (let leg = 0; leg < 2; leg++) for (let i = 0; i < n; i++) {
        const s0 = leg + i / n, s1 = leg + (i + 1) / n;
        p.vertex(s0, -1, 0, 0, 0); p.vertex(s1, -1, 0, 0, 0); p.vertex(s1, 1, 0, 0, 0); p.vertex(s0, -1, 0, 0, 0); p.vertex(s1, 1, 0, 0, 0); p.vertex(s0, 1, 0, 0, 0);
      }
    };
    p.textureMode(p.NORMAL);
    const G = fn => p.buildGeometry(() => { p.beginShape(p.TRIANGLES); fn(); p.endShape(); });
    // painter's order inside a stage; each group has its own small shader (SwiftShader runs every branch of a shader)
    return [
      ['DRAPE', G(() => quadXY(1, 0, 0, -S.drapeX, S.drapeTop, S.drapeX, S.floorY, S.drapeZ))],
      ['FLOOR', G(() => { quadXZ(2, -S.drapeX, S.drapeZ, S.drapeX, S.prosZ, S.floorY); for (const sx of [-1, 1]) { const x = sx * S.drapeX; p.fill(5, 0, 0); p.vertex(x, S.drapeTop, S.drapeZ, 0, 0); p.vertex(x, S.drapeTop, S.prosZ, 1, 0); p.vertex(x, S.floorY, S.prosZ, 1, 1); p.vertex(x, S.drapeTop, S.drapeZ, 0, 0); p.vertex(x, S.floorY, S.prosZ, 1, 1); p.vertex(x, S.floorY, S.drapeZ, 0, 1); } })],
      ['CLOTH', G(() => { card(SL.planBody, PID.opBody); card(SL.planArm, PID.opArm); card(SL.actBody, PID.opBody); card(SL.actArm, PID.opArm); quadXY(8, SL.chkBody, PID.opCrouch, -34, -184, 34, 4, 0); card(SL.chkArm, PID.opArm); })],
      ['ROD', G(() => rod(SL.rodPlan))],
      ['PLANK', G(() => quadXZ(3, -S.plankHalf, -S.plankZ, S.plankHalf, S.plankZ, 0))],
      ['PAPER', G(() => { card(SL.farLeg, PID.leg); card(SL.farFoot, PID.foot); card(SL.farSleeve, PID.sleeve); card(SL.farFore, PID.fore);
        card(SL.torso, PID.torso); card(SL.head, PID.head); card(SL.nearLeg, PID.leg); card(SL.nearFoot, PID.foot); card(SL.nearSleeve, PID.sleeve); card(SL.nearFore, PID.fore); card(SL.slip, PID.slip, 12); })],
      ['ROD', G(() => { rod(SL.rodAct); rod(SL.rodChk); rod(SL.threadA, 10); rod(SL.threadB, 10); })],
      ['PLANK', G(() => quadXY(4, 0, 0, -S.plankHalf, 0, S.plankHalf, S.plankT, S.plankZ))],
      ['CURTAIN', G(() => quadXY(13, 0, 0, -105, -129, 105, 71, S.prosZ - 3))],
      ['PAPER', G(() => { const z = S.prosZ; quadXY(6, 0, PID.pros, -134, -164, 134, -110, z); quadXY(6, 0, PID.pros, -134, -110, -104, 126, z); quadXY(6, 0, PID.pros, 104, -110, 134, 126, z); quadXY(6, 0, PID.pros, -104, 70, 104, 126, z); })],
      ['BOARD', G(() => { quadXZ(14, -104, S.prosZ, 104, S.prosZ + 12, 70); quadXY(7, 0, PID.boardFace, S.board[0], S.board[1], S.board[2], S.board[3], S.prosZ + 0.4); })],
      ['PAPER', G(() => card(SL.slip + 1, PID.slip, 12))],
    ];
  }
  /** Receivers only (pass 1: the low-res occlusion buffer). */
  function buildReceivers(p) {
    const quadXY = (k, x0, y0, x1, y1, z) => { p.fill(k, 0, 0); p.vertex(x0, y0, z, 0, 0); p.vertex(x1, y0, z, 1, 0); p.vertex(x1, y1, z, 1, 1); p.vertex(x0, y0, z, 0, 0); p.vertex(x1, y1, z, 1, 1); p.vertex(x0, y1, z, 0, 1); };
    const quadXZ = (k, x0, z0, x1, z1, y) => { p.fill(k, 0, 0); p.vertex(x0, y, z0, 0, 0); p.vertex(x1, y, z0, 1, 0); p.vertex(x1, y, z1, 1, 1); p.vertex(x0, y, z0, 0, 0); p.vertex(x1, y, z1, 1, 1); p.vertex(x0, y, z1, 0, 1); };
    p.textureMode(p.NORMAL);
    return p.buildGeometry(() => { p.beginShape(p.TRIANGLES);
      quadXY(1, -S.drapeX, S.drapeTop, S.drapeX, S.floorY, S.drapeZ); quadXZ(2, -S.drapeX, S.drapeZ, S.drapeX, S.prosZ, S.floorY); quadXZ(3, -S.plankHalf, -S.plankZ, S.plankHalf, S.plankZ, 0);
      p.endShape(); });
  }
  /** Props: free cards drawn once (a row of their own): title stencils, tags, threads, extra figures. */
  function buildProps(p, table, list) {
    p.textureMode(p.NORMAL);
    const cards = p.buildGeometry(() => { p.beginShape(p.TRIANGLES);
      for (const it of list) { if (it.rod) continue; const r = table[it.part].rect; p.fill(it.kind || 8, it.slot, it.part);
        p.vertex(r[0], r[1], 0, 0, 0); p.vertex(r[2], r[1], 0, 1, 0); p.vertex(r[2], r[3], 0, 1, 1); p.vertex(r[0], r[1], 0, 0, 0); p.vertex(r[2], r[3], 0, 1, 1); p.vertex(r[0], r[3], 0, 0, 1); }
      p.endShape(); });
    const threads = p.buildGeometry(() => { p.beginShape(p.TRIANGLES);
      for (const it of list) { if (!it.rod) continue; const n = 6; p.fill(it.kind || 10, it.slot, 0); for (let leg = 0; leg < 2; leg++) for (let i = 0; i < n; i++) { const s0 = leg + i / n, s1 = leg + (i + 1) / n; p.vertex(s0, -1, 0, 0, 0); p.vertex(s1, -1, 0, 0, 0); p.vertex(s1, 1, 0, 0, 0); p.vertex(s0, -1, 0, 0, 0); p.vertex(s1, 1, 0, 0, 0); p.vertex(s0, 1, 0, 0, 0); } }
      p.endShape(); });
    return { cards, threads };
  }

  /* ─────────────── shaders ─────────────── */
  const VERT = `#version 300 es
precision highp float; precision highp int;
in vec3 aPosition; in vec2 aTexCoord; in vec4 aVertexColor;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform highp sampler2D uData; uniform highp sampler2D uTable;
uniform float uBase; uniform vec3 uCam;
out vec3 vP; out vec3 vW; out vec2 vUV; out vec2 vLoc; out float vDepth; out vec3 vN; out float vAcross;
flat out int vKind; flat out int vRow; flat out int vPart; flat out vec4 vMisc; flat out vec4 vStage; flat out vec4 vStage2;
vec4 D(int row, int t) { return texelFetch(uData, ivec2(t, row), 0); }
vec4 TB(int part, int t) { return texelFetch(uTable, ivec2(t, part), 0); }
void main() {
  int kind = int(aVertexColor.r * 255.0 + 0.5), slot = int(aVertexColor.g * 255.0 + 0.5), part = int(aVertexColor.b * 255.0 + 0.5);
  int row = gl_InstanceID + int(uBase + 0.5);
  vec4 st = D(row, 0), st2 = D(row, 1);
  vec3 O = st.xyz, P = aPosition; vN = vec3(0.0, 0.0, 1.0); vMisc = vec4(1.0, 1.0, 0.0, 0.0); vAcross = 0.0;
  vUV = aTexCoord; vLoc = aPosition.xy;
  if (kind == 8 || kind == 12) {
    vec4 a = D(row, slot * 2), b = D(row, slot * 2 + 1);
    if (b.w > 0.5) part = int(b.w + 0.5);
    float c = cos(a.x), s = sin(a.x);
    vec2 q = aPosition.xy * b.y;
    if (kind == 12) {          // 3D card: x along the chord (in the x–y plane, angle a.x), y along an oblique span (tilt b.z)
      vec3 chord = vec3(c, s, 0.0), span = vec3(-sin(b.z) * s, sin(b.z) * c, cos(b.z));
      P = vec3(a.y, a.z, a.w) + chord * q.x + span * q.y; vN = normalize(cross(chord, span)); if (vN.z < 0.0) vN = -vN;
    } else P = vec3(c * q.x - s * q.y + a.y, s * q.x + c * q.y + a.z, a.w);
    vMisc = b;
    vec4 r0 = TB(part, 0), r1 = TB(part, 1);
    vUV = r1.xy + (aPosition.xy - r0.xy) / r0.zw * r1.zw;
  } else if (kind == 6 || kind == 7) {
    vec4 r0 = TB(part, 0), r1 = TB(part, 1);
    vUV = r1.xy + (aPosition.xy - r0.xy) / r0.zw * r1.zw;
  } else if (kind == 9 || kind == 10) {
    vec4 A = D(row, slot * 2), B = D(row, slot * 2 + 1), C = D(row, slot * 2 + 2), E = D(row, slot * 2 + 3);
    float sv = aPosition.x; vec3 Q, T;
    if (sv <= 1.0) { Q = mix(A.xyz, B.xyz, sv); T = B.xyz - A.xyz; } else { Q = mix(B.xyz, C.xyz, sv - 1.0); T = C.xyz - B.xyz; }
    if (length(T) < 1e-4) T = vec3(1.0, 0.0, 0.0);
    vec3 V = normalize(uCam - (O + Q)), side = normalize(cross(normalize(T), V));
    float w = B.w * (kind == 10 ? 1.0 : (sv > 1.0 ? 0.92 : 1.0 - 0.18 * sv));
    P = Q + side * aPosition.y * w * 0.5;
    vAcross = aPosition.y; vN = normalize(V * sqrt(max(0.0, 1.0 - 0.0)) ); vLoc = vec2(sv, aPosition.y);
    vMisc = vec4(A.w, w, E.x, E.y);     // alpha, width, colour index, spare
    vN = side;                          // the across-axis; the fragment builds a cylinder normal
  }
  vKind = kind; vRow = row; vPart = part; vStage = st; vStage2 = st2;
  vP = P; vW = O + P;
  vec4 mv = uModelViewMatrix * vec4(O + P, 1.0);
  vDepth = -mv.z;
  gl_Position = uProjectionMatrix * mv;
}`;

  const FRAG = `#version 300 es
precision highp float; precision highp int;
in vec3 vP; in vec3 vW; in vec2 vUV; in vec2 vLoc; in float vDepth; in vec3 vN; in float vAcross;
flat in int vKind; flat in int vRow; flat in int vPart; flat in vec4 vMisc; flat in vec4 vStage; flat in vec4 vStage2;
uniform highp sampler2D uData; uniform highp sampler2D uTable; uniform highp sampler2D uAtlas;
uniform vec3 uCam; uniform float uFocus, uDofK, uPxPerUnit, uHouse, uWarm, uRimK;
uniform vec3 uL, uLdir; uniform float uLcos0, uLcos1, uLR, uLI;
uniform vec3 cCopper, cSage, cPeach, cSlate, cChalk, cDrape, cFloor, cPlank;
uniform vec4 uTitle; uniform vec4 uTitle2; uniform float uTitleRow;
uniform float uPass; uniform highp sampler2D uOcc; uniform vec2 uRes;
out vec4 outColor;
vec4 D(int row, int t) { return texelFetch(uData, ivec2(t, row), 0); }
vec4 TB(int part, int t) { return texelFetch(uTable, ivec2(t, part), 0); }
float hh(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 q) { vec2 i = floor(q), f = fract(q); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + vec2(1, 1)), f.x), f.y); }
vec4 lvl(vec2 uv, int L) {
  vec2 o; float s;
  if (L <= 0) { o = vec2(0.0); s = 2048.0; } else if (L == 1) { o = vec2(2048.0, 0.0); s = 1024.0; }
  else if (L == 2) { o = vec2(2048.0, 1024.0); s = 512.0; } else if (L == 3) { o = vec2(2560.0, 1024.0); s = 256.0; }
  else if (L == 4) { o = vec2(2816.0, 1024.0); s = 128.0; } else { o = vec2(2944.0, 1024.0); s = 64.0; }
  return texture(uAtlas, (o + uv * s) / vec2(3072.0, 2048.0));
}
vec4 atl(vec2 uv, float lod) { lod = clamp(lod, 0.0, 5.0); int l0 = int(floor(lod)); float f = lod - float(l0);
  vec4 a = lvl(uv, l0); if (f < 0.02 || l0 >= 5) return a; return mix(a, lvl(uv, l0 + 1), f); }
vec3 keyCol(float lt) { // tungsten that reddens as it dims (filament cooling)
  float on = clamp(lt, 0.0, 1.4);
  vec3 hot = vec3(1.0, 0.86, 0.70), cool = vec3(0.95, 0.30, 0.08);
  return mix(cool, hot, smoothstep(0.05, 0.75, on)) * pow(on, 1.25) * 1.55;
}
float spot(vec3 P) { vec3 d = normalize(P - uL); return smoothstep(uLcos1, uLcos0, dot(d, uLdir)) / (1.0 + 0.0000025 * dot(P - uL, P - uL)); }
float coc(float d) { return uDofK * abs(d - uFocus) / max(d, 1.0); }
/* occlusion of the key at receiver P by the cards of one plane (z = zc), slots [s0, s1) */
float planeOcc(vec3 P, float zc, int s0, int s1, vec4 bb, float extraBlur) {
  vec3 dir = uL - P; if (dir.z <= 0.001 || P.z >= zc - 0.05) return 0.0;
  float t = (zc - P.z) / dir.z; if (t >= 1.0) return 0.0;
  vec3 X = P + dir * t; float Ld = length(dir), gap = t * Ld;
  float blurU = uLR * gap / Ld + extraBlur * (1.0 - t);
  if (X.x < bb.x - blurU || X.x > bb.z + blurU || X.y < bb.y - blurU || X.y > bb.w + blurU) return 0.0;
  float occ = 0.0;
  for (int s = s0; s < s1; s++) {
    vec4 a = D(vRow, s * 2), b = D(vRow, s * 2 + 1);
    if (b.x < 0.02) continue;
    int part = int(b.w + 0.5); if (part <= 0) continue;
    vec4 r0 = TB(part, 0), r1 = TB(part, 1), r2 = TB(part, 2);
    float c = cos(a.x), sn = sin(a.x);
    vec2 d = X.xy - a.yz; vec2 q = vec2(c * d.x + sn * d.y, -sn * d.x + c * d.y) / max(b.y, 1e-3);
    vec2 u = (q - r0.xy) / r0.zw; if (u.x < -0.05 || u.y < -0.05 || u.x > 1.05 || u.y > 1.05) continue;
    float lod = log2(max(1.0, 0.5 * blurU * r2.x / max(b.y, 1e-3)));
    float al = atl(r1.xy + u * r1.zw, lod).a * b.x;
    occ = max(occ, al);
  }
  return occ;
}
/* a rod's shadow on the receiver plane through P with normal n: project A,B,C from the key */
float segD(vec3 p, vec3 a, vec3 b) { vec3 ab = b - a; float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0); return length(p - a - ab * h); }
float rodOcc(vec3 P, vec3 n, int slot) {
  vec4 A = D(vRow, slot * 2), B = D(vRow, slot * 2 + 1), C = D(vRow, slot * 2 + 2);
  if (A.w < 0.02) return 0.0;
  float den;
  vec3 pr[3]; vec3 src[3]; src[0] = A.xyz; src[1] = B.xyz; src[2] = C.xyz; float gapM = 0.0, mag = 1.0;
  for (int i = 0; i < 3; i++) { vec3 v = src[i] - uL; den = dot(n, v); if (abs(den) < 1e-4) return 0.0;
    float s = dot(n, P - uL) / den; if (s < 1.0) return 0.0; pr[i] = uL + v * s; gapM += length(pr[i] - src[i]) / 3.0; mag = s; }
  float d = min(segD(P, pr[0], pr[1]), segD(P, pr[1], pr[2]));
  float hw = 0.5 * B.w * mag, pen = uLR * gapM / length(P - uL) + 0.4;
  return (1.0 - smoothstep(hw - pen, hw + pen, d)) * A.w * clamp(hw / (hw + pen), 0.25, 1.0) * 1.2;
}
float occAt() { vec2 q = gl_FragCoord.xy / uRes; return texture(uOcc, vec2(q.x, 1.0 - q.y)).r; }
float shade(vec3 P, vec3 n, float dofU) {
  vec4 bb = D(vRow, 2), ob = D(vRow, 3);
  float o = planeOcc(P, 0.0, 4, 15, bb, dofU);
  o = max(o, planeOcc(P, -22.0, 20, 22, ob, dofU));
  o = max(o, planeOcc(P, -38.0, 16, 20, ob, dofU));
  o = max(o, rodOcc(P, n, 22)); o = max(o, rodOcc(P, n, 24)); o = max(o, rodOcc(P, n, 26));
  if (abs(float(vRow) - uTitleRow) < 0.5 || uTitleRow < -0.5) {
    for (int k = 0; k < 2; k++) {
      vec4 tt = k == 0 ? uTitle : uTitle2; if (tt.x <= 0.0) continue;
      int tp = int(tt.x + 0.5); vec4 r0 = TB(tp, 0), r1 = TB(tp, 1), r2 = TB(tp, 2);
      vec3 dir = uL - P; if (dir.z <= 0.0 || P.z >= tt.w) continue;
      float t = (tt.w - P.z) / dir.z; vec3 X = P + dir * t; float gap = t * length(dir);
      vec2 u = (X.xy - tt.yz - r0.xy) / r0.zw;
      if (u.x < 0.0 || u.y < 0.0 || u.x > 1.0 || u.y > 1.0) continue;
      float lod = log2(max(1.0, 0.5 * (uLR * gap / length(dir) + dofU) * r2.x));
      float e = min(min(u.x, 1.0 - u.x), min(u.y, 1.0 - u.y));
      o = max(o, smoothstep(0.0, 0.03 + 0.05 * clamp(lod * 0.3, 0.0, 1.0), e));
    }
  }
  return o;
}
void main() {
  vec3 P = vP; float lt = vStage.w;
  vec3 K = keyCol(lt) * uLI, Ldir = normalize(uL - P);
  float cp = coc(vDepth);
  float dofU = cp / max(uPxPerUnit * (uFocus / max(vDepth, 1.0)), 1e-3);
  vec3 amb = vec3(0.020, 0.016, 0.014) + uHouse * vec3(0.10, 0.075, 0.05);
  vec3 col = vec3(0.0); float alpha = 1.0;
#if defined(OCC)
  vec3 n = vKind == 1 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, -1.0, 0.0);
  float o = (lt > 0.02 && spot(P) > 0.002) ? shade(P, n, dofU) : 0.0;
  outColor = vec4(o, o, o, 1.0); return;
#elif defined(DRAPE)
  float x = P.x;
  float ph = x * 0.115 + 1.3 * vn(vec2(x * 0.02, 3.0)) + 0.25 * sin(P.y * 0.02 + x * 0.01);
  float fw = fwidth(x), fade = 1.0 - smoothstep(0.6, 2.2, fw);
  float dfd = (cos(ph) * 0.115 + 0.04 * cos(x * 0.31 + 1.7) * (1.0 - smoothstep(0.2, 0.8, fw))) * fade;
  vec3 n = normalize(vec3(-dfd * 5.0, 0.0, 1.0));
  float sp = spot(P), occ = occAt();
  float dif = max(dot(n, Ldir), 0.0);
  vec3 V = normalize(uCam - vW); float sheen = pow(1.0 - max(dot(n, V), 0.0), 2.0) * 0.6 + 0.4;
  vec3 base = cDrape * (0.9 + 0.2 * vn(vec2(x * 0.6, P.y * 0.03)));
  col = base * (amb * 2.0 + K * sp * dif * (1.0 - occ * 0.94) * (0.75 + 0.6 * sheen));
#elif defined(FLOOR)
  if (vKind == 5) { outColor = vec4(vec3(0.010, 0.009, 0.008) + K * spot(P) * 0.010, 1.0); return; }
  float bd = floor((P.z + 200.0) / 9.0), seam = smoothstep(0.0, 0.5, abs(fract((P.z + 200.0) / 9.0) - 0.5) * 9.0 - 3.9);
  vec3 base = cFloor * (0.8 + 0.35 * hh(vec2(bd, 1.0))) * (0.85 + 0.15 * vn(vec2(P.x * 0.08, bd)));
  base *= mix(0.4, 1.0, 1.0 - seam);
  float sp = spot(P), occ = occAt();
  float dif = max(dot(vec3(0.0, -1.0, 0.0), Ldir), 0.0);
  col = base * (amb + K * sp * dif * (1.0 - occ * 0.92));
#elif defined(PLANK)
  vec3 n = vKind == 3 ? vec3(0.0, -1.0, 0.0) : vec3(0.0, 0.0, 1.0);
  float fib = 0.93 + 0.07 * vn(vec2(P.x * 0.9, P.z * 2.5 + P.y * 2.5));
  float sp = spot(P), occ = vKind == 3 ? occAt() : 0.0;
  float dif = max(dot(n, Ldir), 0.0) * (vKind == 3 ? 1.0 : 0.8);
  col = cPlank * fib * (amb * 1.5 + K * sp * (0.2 + dif) * (1.0 - occ * 0.9));
  if (vKind == 4) col *= 0.62;
#elif defined(PAPER) || defined(CLOTH)
  vec4 r2 = TB(vPart, 2), rr = TB(vPart, 0);
  bool outside = vKind != 12 && (vLoc.x < rr.x || vLoc.y < rr.y || vLoc.x > rr.x + rr.z || vLoc.y > rr.y + rr.w);
  float fp = max(length(dFdx(vUV)), length(dFdy(vUV))) * 2048.0;
  float lod = log2(max(1.0, fp * max(1.0, cp * 0.85)));
  vec4 tx = atl(vUV, lod);
  if (outside) tx = vec4(0.0);
  vec2 ga = vec2(dFdx(tx.a), -dFdy(tx.a));     // derivatives before any discard (helper lanes stay defined)
  alpha = tx.a * vMisc.x;
  if (alpha < 0.004) discard;
  vec3 alb = tx.rgb / max(tx.a, 1e-4);
  float sp = spot(P);
  vec2 lw = normalize((uL - P).xy + vec2(0.0001));
  float gl = length(ga), edge = gl > 1e-4 ? dot(-ga / gl, lw) : 0.0;
  float edgeK = clamp(gl * 1.2, 0.0, 1.0);
#if defined(CLOTH)
  col = alb * (amb + K * sp * mix(0.6, 1.15, smoothstep(0.3, 0.7, alb.r))) + K * sp * vec3(0.06, 0.055, 0.05) * edgeK * max(edge, 0.0) * 3.0
      + vec3(0.16, 0.17, 0.20) * uRimK * edgeK * max(dot(-ga / max(gl, 1e-4), normalize(vec2(-0.5, 0.85))), 0.0) * 3.0 * (0.35 + 0.65 * lt);
  col += alb * smoothstep(0.3, 0.7, alb.r) * (0.12 + uHouse * 0.9) + vec3(0.10, 0.10, 0.11) * edgeK * uHouse * 2.0;
#else
  vec3 n = vN;
  if (vKind != 6) { vec2 q = vLoc * vec2(0.9, 0.35); float e = 0.5;
    float h0 = vn(q), hx = vn(q + vec2(e, 0.0)), hy = vn(q + vec2(0.0, e));
    n = normalize(vN + vec3(-(hx - h0), -(hy - h0), 0.0) * 0.35 * r2.z); }
  float dif = max(dot(n, Ldir), 0.0);
  int mat = int(r2.y + 0.5);
  vec3 light = amb + K * sp * (0.25 + 0.95 * dif);
  if (vKind == 6) light = amb * 1.2 + uHouse * vec3(0.26, 0.21, 0.15) + keyCol(lt) * uHouse * 0.32 * smoothstep(-40.0, 30.0, -abs(P.x) + 104.0 + 12.0 * (1.0 - smoothstep(-128.0, -100.0, P.y)));
  col = alb * light;
  col += alb * K * sp * edgeK * max(edge, 0.0) * 0.55;
  col *= 1.0 - 0.45 * edgeK * max(-edge, 0.0);
  if (mat == 3) col = alb * (amb * 3.0 + K * sp * (0.35 + 0.8 * dif)) + alb * uWarm * 0.12;
  if (mat == 4) col = alb * (0.42 + uHouse * 0.5 + K * sp * 0.35);
#endif
#elif defined(BOARD)
  if (vKind == 14) {                  // the apron ledge in front of the board (where a dropped slip comes to rest)
    float g0 = 0.85 + 0.3 * vn(P.xz * 0.6);
    col = vec3(0.028, 0.024, 0.021) * g0 * (amb * 4.0 + uHouse * 0.6) + K * spot(P) * 0.03;
  } else {
  vec2 u = vec2((P.x + 94.0) / 188.0, (P.y - 78.0) / 39.0);
  vec3 base = vec3(0.022, 0.020, 0.019) * (0.85 + 0.3 * vn(P.xy * 0.5));
  col = base * (amb * 4.0 + uHouse * 0.4);
  vec4 tk = D(vRow, 4), tk2 = D(vRow, 5);
  float cf = u.x * 20.0; int i = int(clamp(floor(cf), 0.0, 19.0)); float fx = fract(cf) - 0.5, yy = u.y - 0.47;
  float pk = i < 7 ? tk.x : (i < 14 ? tk.y : tk.z); int shf = (i < 7 ? i : (i < 14 ? i - 7 : i - 14)) * 3;
  int stt = (int(pk + 0.5) >> shf) & 7;
  float grain = 0.6 + 0.4 * smoothstep(0.25, 0.75, vn(P.xy * vec2(2.4, 1.6) + float(vRow) * 7.0));
  float box = (1.0 - smoothstep(0.34, 0.44, abs(fx))) * (1.0 - smoothstep(0.30, 0.40, abs(yy))) * grain;
  vec3 chalkC = cChalk * (0.55 + 0.35 * uHouse + 0.25);
  vec3 wash = stt == 2 ? cPeach * 1.05 : chalkC * 0.62;
  col = mix(col, wash, box * (stt > 0 ? 0.88 : 0.0));
  float ring = (1.0 - smoothstep(0.035, 0.075, abs(length(vec2(fx, yy * 0.9)) - 0.34))) * grain;
  float ang = atan(yy, fx); ring *= stt == 4 ? step(ang, tk2.x * 6.2831 - 3.1416) : 1.0;
  col = mix(col, cSage * 1.15, ring * ((stt == 3 || stt == 4) ? 1.0 : 0.0));
  float redo = (1.0 - smoothstep(0.05, 0.1, abs(fx + 0.18))) * (1.0 - smoothstep(0.06, 0.1, abs(yy + 0.5))) * (stt == 3 ? 1.0 : 0.0);
  col = mix(col, cSage * 1.15, redo);
  vec4 nm = atl(vUV, log2(max(1.0, max(length(dFdx(vUV)), length(dFdy(vUV))) * 2048.0)));
  col = mix(col, stt > 0 ? base * 0.4 : chalkC * 0.55, nm.a * 0.9);
  float ul = (1.0 - smoothstep(0.03, 0.06, abs(u.y - 0.94))) * grain;
  col = mix(col, cSage * 1.15, ul * vStage2.y);
  col = mix(col, cChalk, ul * vStage2.z);
  float cur = tk.w; float dxc = abs(cf - 0.5 - cur), edge = max(abs(fx), abs(yy) * 0.9);
  float car = (1.0 - smoothstep(0.03, 0.07, abs(edge - 0.43))) * (1.0 - step(0.5, dxc)) * (cur >= 0.0 ? 1.0 : 0.0);
  col = mix(col, cChalk * 0.8, car * 0.8);
  }
#elif defined(CURTAIN)
  float cl = vStage2.w; if (cl < 0.003) discard;
  float halfw = 105.0 * cl, sway = 2.5 * sin(P.y * 0.045 + float(vRow)) * cl * (1.0 - cl) * 4.0;
  float d = min(P.x + 105.0, 105.0 - P.x) - halfw - sway;
  alpha = 1.0 - smoothstep(-0.9, 0.9, d); if (alpha < 0.004) discard;
  float fold = cos(P.x * 0.42 + 1.3 * sin(P.y * 0.01)) * 0.5 + 0.5;
  vec3 n = normalize(vec3(-sin(P.x * 0.42) * 0.5, 0.0, 1.0));
  float dif = max(dot(n, Ldir), 0.0);
  col = vec3(0.016, 0.014, 0.013) * (0.7 + 0.6 * fold) * (amb * 3.0 + uHouse * 0.55 + K * spot(P) * 0.25 * dif);
#elif defined(ROD)
  float a = vMisc.x; if (a < 0.01) discard;
  float s = vAcross; float cz = sqrt(max(0.0, 1.0 - s * s));
  vec3 V = normalize(uCam - vW); vec3 n = normalize(V * cz + vN * s);
  int ci = int(vMisc.z + 0.5);
  vec3 base = ci == 0 ? cCopper : (ci == 1 ? cSlate : (ci == 2 ? cSage : vec3(0.80, 0.76, 0.68)));
  float sp = spot(P), dif = max(dot(n, Ldir), 0.0);
  vec3 H = normalize(Ldir + V); float spec = pow(max(dot(n, H), 0.0), 60.0);
  if (vKind == 10) { col = base * (amb * 4.0 + K * sp * 0.5) * 0.8; alpha = a * (1.0 - smoothstep(0.4, 1.0, abs(s))) * 0.9; }
  else { col = base * (amb * 3.5 + K * sp * (0.25 + 0.9 * dif)) + K * sp * spec * 0.9 + base * 0.04; alpha = a * (1.0 - smoothstep(0.82, 1.0, abs(s))); }
#endif
  outColor = vec4(col * alpha, alpha);
}`;

  const VARIANTS = ['OCC', 'DRAPE', 'FLOOR', 'PLANK', 'PAPER', 'CLOTH', 'BOARD', 'ROD', 'CURTAIN'];
  function makeShaders(p) {
    const head = FRAG.slice(0, FRAG.indexOf('\n') + 1), body = FRAG.slice(FRAG.indexOf('\n') + 1);
    const out = {};
    for (const v of VARIANTS) out[v] = p.createShader(VERT, head + '#define ' + v + '\n' + body);
    return out;
  }

  /* ─────────────── data rows ─────────────── */
  function makeData(p, rows) {
    const data = new Float32Array(ROWW * rows * 4);
    const tex = rawTexture(p, ROWW, rows, { float: true, data });
    const W = (row, slot, i, vals) => { const o = ((row * ROWW) + slot * 2 + i) * 4; data[o] = vals[0]; data[o + 1] = vals[1]; data[o + 2] = vals[2]; data[o + 3] = vals[3]; };
    return {
      tex, data, rows,
      clearRow(row) { data.fill(0, row * ROWW * 4, (row + 1) * ROWW * 4); },
      stage(row, ox, oy, oz, light, x1 = 0, x2 = 0, x3 = 0, x4 = 0) { W(row, 0, 0, [ox, oy, oz, light]); W(row, 0, 1, [x1, x2, x3, x4]); },
      /** card slot: angle, position, alpha, scale, span tilt (flutter cards), part override */
      card(row, slot, ang, x, y, z, alpha = 1, scale = 1, tilt = 0, part = 0) { W(row, slot, 0, [ang, x, y, z]); W(row, slot, 1, [alpha, scale, tilt, part]); },
      rod(row, slot, A, B, C, alpha, width, colIdx) { W(row, slot, 0, [A[0], A[1], A[2], alpha]); W(row, slot, 1, [B[0], B[1], B[2], width]); W(row, slot + 1, 0, [C[0], C[1], C[2], 0]); W(row, slot + 1, 1, [colIdx, 0, 0, 0]); },
      raw(row, slot, i, vals) { W(row, slot, i, vals); },
      upload() { tex.upload(data); },
    };
  }
  function makeTable(p, table) {
    const data = new Float32Array(4 * NPART * 4);
    for (const [id, e] of Object.entries(table)) {
      const o = (+id) * 16;
      data.set([e.rect[0], e.rect[1], e.rect[2] - e.rect[0], e.rect[3] - e.rect[1]], o);
      data.set(e.uv, o + 4);
      data.set([e.tpu, e.mat, e.relief, e.sheen], o + 8);
    }
    return rawTexture(p, 4, NPART, { float: true, data });
  }

  /* ─────────────── the falling paper (Andersen, Pesavento & Wang 2005), RK4, chord = 1, g = 1 ─────────────── */
  function fallingPaper(Istar, th0, opt = {}) {
    const m = Istar, mp = Istar, m11 = 0, m22 = Math.PI / 4, I = Istar / 12, Ia = Math.PI / 128;
    const CT = 1.2, CR = Math.PI, A = 1.4, B = 1.0, mu1 = 0.2, mu2 = 0.2;
    const f = s => {
      const [u, v, w, th] = s, V = Math.hypot(u, v) + 1e-9;
      const G = -0.5 * CT * u * v / V + 0.5 * CR * w;
      const k = 0.5 * (A - B * (u * u - v * v) / (V * V)) * V;
      const du = ((m + m22) * v * w - G * v - mp * Math.sin(th) - k * u) / (m + m11);
      const dv = (-(m + m11) * u * w + G * u - mp * Math.cos(th) - k * v) / (m + m22);
      const dw = ((m11 - m22) * u * v - (Math.PI / 32) * (mu1 + mu2 * Math.abs(w)) * w) / (I + Ia);
      return [du, dv, dw, w, u * Math.cos(th) - v * Math.sin(th), u * Math.sin(th) + v * Math.cos(th)];
    };
    let s = [0, 0, opt.w0 || 0, th0, 0, 0];
    const dt = 0.004, every = 10, out = [];
    for (let i = 0; i < 40000; i++) {
      if (i % every === 0) out.push([s[4], s[5], s[3]]);
      if (s[5] < -(opt.depth || 14)) break;
      const k1 = f(s), s2 = s.map((v, j) => v + 0.5 * dt * k1[j]), k2 = f(s2), s3 = s.map((v, j) => v + 0.5 * dt * k2[j]), k3 = f(s3), s4 = s.map((v, j) => v + dt * k3[j]), k4 = f(s4);
      s = s.map((v, j) => v + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    }
    return { dt: dt * every, pts: out };   // x right, y UP, θ from horizontal (nondimensional time)
  }
  let _falls = null;
  function falls() {
    if (_falls) return _falls;
    const specs = [[0.25, 0.3], [0.35, -0.4], [0.18, 0.8], [0.30, 1.2], [0.45, 0.15], [0.22, -0.9], [0.6, 0.5], [0.28, -0.15]];
    _falls = specs.map(([I, th]) => fallingPaper(I, th, { depth: 14 }));
    return _falls;
  }
  /** sample a tabulated fall at nondimensional time τ: {x, y (down, chords), th} */
  function fallAt(k, tau) {
    const F = falls()[k % 8], i = clamp(tau / F.dt, 0, F.pts.length - 1), i0 = Math.floor(i), i1 = Math.min(F.pts.length - 1, i0 + 1), u = i - i0;
    const a = F.pts[i0], b = F.pts[i1];
    return { x: lerp(a[0], b[0], u), y: -lerp(a[1], b[1], u), th: lerp(a[2], b[2], u), end: i0 >= F.pts.length - 1 };
  }

  /* ─────────────── the puppet: forward kinematics of a jointed cut-paper figure ─────────────── */
  const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  /** pose → world transforms (stage-local). pose: {x, y (hip), body (torso abs angle), head, sArmN, fArmN, sArmF, fArmF, legN, legF, footN, footF} */
  function puppetFK(pz) {
    const T = {}, hip = [pz.x, pz.y];
    T.torso = [pz.body, hip[0], hip[1]];
    const neck = add(hip, rot(0, -17, pz.body)); T.head = [pz.body + pz.head, neck[0], neck[1]];
    const shN = add(hip, rot(0.6, -14.6, pz.body)), shF = add(hip, rot(-0.8, -14.8, pz.body));
    T.nearSleeve = [pz.sArmN, shN[0], shN[1]]; T.farSleeve = [pz.sArmF, shF[0], shF[1]];
    const elN = add(shN, rot(0.4, 9, pz.sArmN)), elF = add(shF, rot(0.4, 9, pz.sArmF));
    T.nearFore = [pz.fArmN, elN[0], elN[1]]; T.farFore = [pz.fArmF, elF[0], elF[1]];
    T.handN = add(elN, rot(0.2, 10.4, pz.fArmN)); T.handF = add(elF, rot(0.2, 10.4, pz.fArmF));
    const hpN = add(hip, rot(0.9, -0.4, pz.body)), hpF = add(hip, rot(-0.9, -0.4, pz.body));
    T.nearLeg = [pz.legN, hpN[0], hpN[1]]; T.farLeg = [pz.legF, hpF[0], hpF[1]];
    const anN = add(hpN, rot(0, 17, pz.legN)), anF = add(hpF, rot(0, 17, pz.legF));
    T.nearFoot = [pz.footN, anN[0], anN[1]]; T.farFoot = [pz.footF, anF[0], anF[1]];
    T.back = add(hip, rot(-4.6, -12, pz.body)); T.armpit = add(hip, rot(3.4, -12.5, pz.body)); T.waist = add(hip, rot(2, -4, pz.body));
    T.anN = anN; T.anF = anF;
    return T;
  }
  /** walking pose at continuous move m (one stride per move), standing on the plank at x */
  function walkPose(x, m, amp = 1) {
    const ph = Math.PI * m, sw = 0.34 * Math.cos(ph) * amp;
    const legN = sw, legF = -sw, lift = 17 * (1 - Math.cos(Math.abs(sw))) ;
    const hipY = -(17 + 1.7) + lift * 0.9 - 0.5 * Math.abs(Math.sin(ph)) * amp;
    return { x, y: hipY, body: 0.06 + 0.02 * Math.sin(2 * ph) * amp, head: -0.05 + 0.03 * Math.sin(2 * ph + 0.6) * amp,
      sArmN: -0.42 * sw + 0.08, fArmN: -0.42 * sw - 0.55, sArmF: 0.4 * sw + 0.05, fArmF: 0.4 * sw - 0.25,
      legN, legF, footN: -legN * 0.85, footF: -legF * 0.85 };
  }
  /** rotate a whole pose rigidly about point c by angle b (the tip over the plank edge) */
  function tipPose(pz, c, b) {
    const d = rot(pz.x - c[0], pz.y - c[1], b);
    return Object.assign({}, pz, { x: c[0] + d[0], y: c[1] + d[1], body: pz.body + b, sArmN: pz.sArmN + b, fArmN: pz.fArmN + b, sArmF: pz.sArmF + b, fArmF: pz.fArmF + b,
      legN: pz.legN + b, legF: pz.legF + b, footN: pz.footN + b, footF: pz.footF + b });
  }
  function mixPose(a, b, u) { const o = {}; for (const k in a) o[k] = lerp(a[k], b[k], u); return o; }
  /** hanging limp from the plan rod: attach point (back) at B, swinging (closed-form damped pendulum) */
  function hangPose(B, ts, seedK) {
    const th = 0.85 + 0.55 * Math.exp(-1.6 * ts) * Math.cos(5.2 * ts + seedK);
    const body = th, hip = add(B, rot(4.6, 12, body));
    const sway = 0.25 * Math.exp(-1.2 * ts) * Math.sin(4.0 * ts + seedK);
    return { x: hip[0], y: hip[1], body, head: 0.55, sArmN: 0.15 + sway, fArmN: 0.1 + sway * 1.4, sArmF: 0.05 - sway, fArmF: 0.0 - sway,
      legN: 0.12 + sway * 0.8, legF: -0.05 + sway * 0.5, footN: 0.3, footF: 0.25 };
  }

  /* ─────────────── one stage at one moment ─────────────── */
  /**
   * Write a stage's row. o: {row, origin:[x,y,z], m (continuous move 0…20), sec (film seconds per move now), tOf(m)→film t,
   *   t (film time), ev: [{step, kind:'catch'|'fall'|'restore', gate}], light override, opA, chkA, threads…}
   */
  function writeStage(D, o) {
    const row = o.row, m = clamp(o.m, 0, 20), j = Math.min(19, Math.floor(m)), f = m - Math.floor(m);
    const evAt = s => o.ev.find(e => e.step === s);
    const fall = o.ev.find(e => e.kind === 'fall');
    const restore = o.ev.find(e => e.kind === 'restore');
    const dead = fall && m >= fall.step + 0.5 && !(restore && m >= restore.gate - 0.05);
    // ---- puppet pose
    let x, pz, T, slip = null, chkTarget = null, chkK = 0, light = 1, planDrop = 0, curt = 0;
    const xAt = mm => { const jj = Math.min(20, Math.floor(mm)), ff = mm - jj; return jj >= 20 ? S.xStep(20) : lerp(S.xStep(jj), S.xStep(jj + 1), sstep(0.08, 0.92, ff)); };
    const mEff = o.walk === false ? 0 : m;
    if (fall && m >= fall.step + 0.35 && !(restore && m >= restore.gate - 0.05)) {
      const fs = fall.step, xf = xAt(fs + 0.35), base = walkPose(xf, fs + 0.35, 1);
      const foot = [xf + 4, 0];
      const tsec = o.t - o.tOf(fs + 0.35);
      const uTip = clamp(tsec / 0.32);
      const tipped = tipPose(base, foot, 1.25 * uTip * uTip);
      const Bdrop = 14 + 0 * fs;
      const T0 = puppetFK(tipped);
      const Bend = [xf + 6, Bdrop];
      const uh = sstep(0.0, 0.35, tsec - 0.28);
      const Bnow = [lerp(T0.back[0], Bend[0], uh), lerp(T0.back[1], Bend[1], uh)];
      pz = uh > 0 ? mixPose(tipped, hangPose(Bnow, Math.max(0, tsec - 0.28), row * 1.7), uh) : tipped;
      x = xf; planDrop = uh;
      slip = { t0: o.tOf(fs + 0.35) + 0.12, k: (row * 3 + fs) % 8, step: fs, hand: puppetFK(base).handN };
      curt = sstep(1.3, 2.0, tsec);
      light = 1 - 0.93 * sstep(0.25, 0.95, tsec);
    } else {
      x = xAt(m);
      pz = walkPose(x, mEff, o.walk === false ? 0.0 : 1);
      if (restore && m >= restore.gate - 0.05) {        // a gate re-staged the run: lifted back with a sage flash
        const ts = o.t - o.tOf(restore.gate - 0.05); light = sstep(0, 0.35, ts) * (1 + 0.15 * Math.exp(-3 * ts));
      }
      const e = evAt(j);
      if (e && e.kind === 'catch' && m < 20) {        // the caught move takes twice as long: slip, crook, lifted back, made again
        const x0 = S.xStep(j), x1 = S.xStep(j + 1), xm = lerp(x0, x1, 0.45);
        if (f < 0.58) {
          const prog = sstep(0, 0.3, f) * 0.45; x = lerp(x0, x1, prog); pz = walkPose(x, j + prog, 1);
          const uu = clamp((f - 0.14) / 0.44);
          const b = uu < 0.5 ? 0.62 * Math.pow(uu / 0.5, 1.6) : 0.62 * Math.exp(-7 * (uu - 0.5)) * Math.cos(8 * (uu - 0.5));
          pz = tipPose(pz, [x + 4, 0], b);
          chkK = sstep(0.24, 0.36, f);
        } else if (f < 0.7) {
          const g = sstep(0.58, 0.7, f); x = lerp(xm, x0, g); pz = walkPose(x, j, 0.3);
          pz = Object.assign({}, pz, { y: pz.y - 3.5 * Math.sin(Math.PI * g) });
          chkK = 1 - sstep(0.64, 0.7, f) * 0.0;
        } else {
          const prog = sstep(0.7, 1, f); x = lerp(x0, x1, prog); pz = walkPose(x, j + prog, 1);
          chkK = 1 - sstep(0.7, 0.8, f);
        }
      }
      if (o.bow) { const bw = o.bow; pz = Object.assign({}, pz, { body: pz.body + 0.85 * bw, head: pz.head + 0.35 * bw, sArmN: pz.sArmN + 0.9 * bw, fArmN: pz.fArmN + 1.0 * bw, sArmF: pz.sArmF + 0.8 * bw, fArmF: pz.fArmF + 0.9 * bw, y: pz.y + 2.0 * bw }); }
    }
    if (o.fly) pz = Object.assign({}, pz, { y: pz.y - o.fly });
    T = puppetFK(pz);
    chkTarget = T.armpit;
    const pa = o.pupA ?? 1, z = S.pupZ, SK = o.skin === 'person' ? { [PID.torso]: PID.pTorso, [PID.head]: PID.pHead, [PID.sleeve]: PID.pSleeve, [PID.fore]: PID.pFore, [PID.leg]: PID.pLeg, [PID.foot]: PID.pFoot } : {};
    const C = (slot, tr, dz = 0, part = 0) => D.card(row, slot, tr[0], tr[1], tr[2], z + dz, pa, 1, 0, SK[part] || part);
    C(SL.farSleeve, T.farSleeve, -0.6, PID.sleeve); C(SL.farFore, T.farFore, -0.6, PID.fore); C(SL.farLeg, T.farLeg, -0.5, PID.leg); C(SL.farFoot, T.farFoot, -0.5, PID.foot);
    C(SL.torso, T.torso, 0, PID.torso); C(SL.head, T.head, 0, PID.head); C(SL.nearLeg, T.nearLeg, 0.3, PID.leg); C(SL.nearFoot, T.nearFoot, 0.3, PID.foot);
    C(SL.nearSleeve, T.nearSleeve, 0.6, PID.sleeve); C(SL.nearFore, T.nearFore, 0.7, PID.fore);
    // the job slip: in hand, or fluttering down (APW plate, chord 7.6 units)
    const sa = (o.slipA ?? 1) * pa;
    D.card(row, SL.slip + 1, 0, 0, 0, 0, 0, 1, 0, PID.slip);
    if (slip && o.t > slip.t0) {
      D.card(row, SL.slip, 0, 0, 0, 0, 0, 1, 0, PID.slip);
      const tau = (o.t - slip.t0) / 0.1, F = fallAt(slip.k, tau), ch = 7.6;
      const hx = slip.hand[0], hy = slip.hand[1], ly = 69.3, colX = S.board[0] + (S.board[2] - S.board[0]) * (slip.step + 0.5) / 20;
      const fy = Math.min(ly, hy + F.y * ch), pr = clamp((fy - hy) / (ly - hy));
      const fx = lerp(hx + F.x * ch * 0.8, colX, pr * pr), fz = lerp(1, S.prosZ + 6, Math.pow(pr, 1.4));
      if (fy >= ly - 0.05) D.card(row, SL.slip + 1, 0.12, colX, ly, S.prosZ + 6, sa, 1, 0.02, PID.slip);
      else D.card(row, SL.slip + 1, -F.th, fx, fy, fz, sa, 1, 0.95, PID.slip);
    } else D.card(row, SL.slip, T.nearFore[0] * 0.3, T.handN[0] - 0.2, T.handN[1] + 1.4, z + 1.2, sa, 1, Math.PI / 2, PID.slip);
    // ---- operators follow the puppet (with a little lag), arms aim at the rod ends
    const opA = o.opA ?? 1, chkA = o.chkA ?? 1, px = x;
    const ox = (dx, lagK) => px + dx;
    const planX = ox(-46), actX = ox(-4), chkX = ox(o.chkStand ? 46 : -27), oS = 1.0;
    D.card(row, SL.planBody, 0, planX, S.floorY, S.opZ, opA, oS, 0, PID.opBody);
    D.card(row, SL.actBody, 0, actX, S.floorY, S.opZ, opA, oS, 0, PID.opBody);
    D.card(row, SL.chkBody, 0, chkX, S.floorY, S.chkZ, opA * chkA * (o.chkBodyA ?? 1), oS, 0, o.chkPart || PID.opCrouch);
    const aim = (sh, tgt, len) => { const a = Math.atan2(tgt[1] - sh[1], tgt[0] - sh[0]) - Math.PI / 2; const fist = add(sh, rot(0, len, a)); return { a, fist }; };
    const planSh = [planX + 14 * oS, S.floorY - 132 * oS], actSh = [actX + 14 * oS, S.floorY - 132 * oS], chkSh = [chkX + (o.chkStand ? -12 : 12) * oS, S.floorY - (o.chkStand ? 132 : 60) * oS];
    const Bp = T.back, Ba = T.handN;
    const planAim = aim(planSh, [Bp[0] - 34, Bp[1] - 14 + planDrop * 30], 33.5 * oS);
    const actAim = aim(actSh, [Ba[0] + 14, Ba[1] - 28], 33.5 * oS);
    const rest = [px - 2, -2], crook = [lerp(rest[0], chkTarget[0] - 1.5, chkK), lerp(rest[1], chkTarget[1] + 2.2, chkK)];
    const chkAim = aim(chkSh, o.chkStand ? [crook[0] + 28, crook[1] - 30] : [crook[0] - 10, crook[1] + 18], (o.chkStand ? 26 : 33.5) * oS);
    D.card(row, SL.planArm, planAim.a, planSh[0], planSh[1], S.opZ + 0.5, opA, oS, 0, PID.opArm);
    D.card(row, SL.actArm, actAim.a, actSh[0], actSh[1], S.opZ + 0.5, opA, oS, 0, PID.opArm);
    D.card(row, SL.chkArm, chkAim.a, chkSh[0], chkSh[1], S.chkZ + 0.5, opA * chkA * (o.chkBodyA ?? 1), oS, 0, PID.opArm);
    const rodA = o.rodA ?? 1;
    D.rod(row, SL.rodPlan, [planAim.fist[0], planAim.fist[1], S.opZ + 1], [Bp[0], Bp[1], -0.8], [Bp[0] + 0.01, Bp[1], -0.8], opA * rodA, 1.5, 0);
    D.rod(row, SL.rodAct, [actAim.fist[0], actAim.fist[1], S.opZ + 1], [Ba[0] + 0.6, Ba[1] - 0.4, 1.4], [Ba[0] + 0.61, Ba[1] - 0.4, 1.4], opA * rodA, 1.5, 1);
    const hookA = Math.atan2(crook[1] - chkAim.fist[1], crook[0] - chkAim.fist[0]);
    const hook = [crook[0] + Math.cos(hookA + 2.2) * 4.6, crook[1] + Math.sin(hookA + 2.2) * 4.6];
    const chkFrom = o.chkFrom || [chkAim.fist[0], chkAim.fist[1], S.chkZ + 1];
    D.rod(row, SL.rodChk, chkFrom, [crook[0], crook[1], 1.6], [hook[0], hook[1], 1.6], opA * chkA * rodA, o.chkW || 1.6, 2);
    // threads (props may override)
    D.rod(row, SL.threadA, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0.3, 3); D.rod(row, SL.threadB, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0.3, 3);
    // ---- bboxes for the shadow lookups (puppet plane; operator plane)
    let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
    for (const k of ['torso', 'head', 'nearLeg', 'farLeg', 'nearFore', 'farFore', 'nearSleeve', 'farSleeve', 'nearFoot', 'farFoot']) { bx0 = Math.min(bx0, T[k][1]); bx1 = Math.max(bx1, T[k][1]); by0 = Math.min(by0, T[k][2]); by1 = Math.max(by1, T[k][2]); }
    bx0 -= 22; bx1 += 22; by0 -= 22; by1 += 22;
    D.raw(row, SL.bbox, 0, [bx0, by0, bx1, by1]);
    D.raw(row, SL.bbox, 1, opA > 0.02 ? [Math.min(planX, chkX) - 40, -150, Math.max(actX, chkX) + 40, S.floorY + 2] : [1e5, 1e5, 1e5, 1e5]);
    // ---- chalk ticks on the board
    const packs = [0, 0, 0];
    let ringP = 1, cur = -1;
    for (let i = 0; i < 20; i++) {
      let s = 0;
      const e = evAt(i);
      if (fall && i > fall.step && !(restore && i >= restore.gate)) s = 0;
      else if (i < Math.floor(m) || (i === Math.floor(m) && f > 0.8)) s = 1;
      if (e && e.kind === 'fall' && m >= i + 0.6) s = 2;
      if (e && e.kind === 'catch' && m >= i + 0.3) { s = 4; ringP = i < Math.floor(m) ? 1 : sstep(0.3, 0.6, f); if (i < Math.floor(m)) s = 3; }
      const k = i < 7 ? 0 : (i < 14 ? 1 : 2), sh = (i - k * 7) * 3; packs[k] += s * Math.pow(2, sh);
    }
    if (!dead && m < 20) cur = Math.floor(m);
    if (o.caret === false) cur = -1;
    D.raw(row, SL.ticks, 0, [packs[0], packs[1], packs[2], cur]);
    D.raw(row, SL.ticks, 1, [ringP, 0, 0, 0]);
    // ---- stage + light
    const L = (o.light ?? 1) * light;
    D.stage(row, o.origin[0], o.origin[1], o.origin[2], L, 0, o.saved || 0, o.flash || 0, o.curtain ?? curt);
    return { x, T, dead, light: L };
  }

  /* ─────────────── the district: staggered rows of little theatres, instance order far → near ─────────────── */
  function district(N, hero, sizes = [8, 9, 8, 9, 8, 8], dx = 300, dz = 340, dy = 175) {
    const cells = [], ranges = []; let c0 = 0;
    sizes.forEach((n, row) => { ranges.push([c0, n]); c0 += n; for (let i = 0; i < n; i++) cells.push({ row, i, x: (i - (n - 1) / 2) * dx, y: -(sizes.length - 1 - row) * dy, z: -(sizes.length - 1 - row) * dz }); });
    const last = sizes.length - 1, heroCell = cells.findIndex(c => c.row === last && c.i === Math.floor(sizes[last] / 2));
    const cellOf = new Array(N); cellOf[hero] = heroCell; let k = 0;
    for (let r = 0; r < N; r++) { if (r === hero) continue; if (k === heroCell) k++; cellOf[r] = k++; }
    return { cells, ranges, rowOf: cellOf, origin: r => [cells[cellOf[r]].x, cells[cellOf[r]].y, cells[cellOf[r]].z], hero, N };
  }

  /* ─────────────── worlds: engine on/off, gate placement (common random numbers) ─────────────── */
  /** Events per run for the engine worlds: 'off' (no check) and 'on' (check every step). */
  function engineEvents(A, r, w) {
    const ev = [];
    for (const e of A.events(r, w)) ev.push({ step: e.step, kind: e.fail ? 'fall' : 'catch' });
    return ev;
  }
  /** Gate placement world on the engine's own draws. gates: list of g (check after g moves). Segment caught at its gate
   *  with h(seed,r,g−1,1) < c; the segment is re-performed (retry draws h(seed,r,i,2) < p for every i in it).
   *  Returns {fail: step|-1, ev, redo (moves re-performed), caught}. For gates = 1…20 this equals the engine's 'on'. */
  function gateRun(U, P, r, gates) {
    const { seed, p, c, k } = P, ev = []; let s = 0, redo = 0;
    for (const g of gates) {
      let j0 = -1; for (let j = s; j < g; j++) if (U.h(seed, r, j, 0) > p) { j0 = j; break; }
      if (j0 < 0) { s = g; continue; }
      const caught = U.h(seed, r, g - 1, 1) < c;
      if (caught) {
        redo += g - s; let ok = true; for (let i = s; i < g; i++) if (!(U.h(seed, r, i, 2) < p)) { ok = false; break; }
        if (ok) { if (g - s === 1) ev.push({ step: j0, kind: 'catch' }); else { ev.push({ step: j0, kind: 'fall' }); ev.push({ step: j0, kind: 'restore', gate: g }); } s = g; continue; }
      }
      ev.push({ step: j0, kind: 'fall' }); return { fail: j0, ev, redo, caught };
    }
    for (let j = s; j < k; j++) if (U.h(seed, r, j, 0) > p) { ev.push({ step: j, kind: 'fall' }); return { fail: j, ev, redo }; }
    return { fail: -1, ev, redo };
  }
  /** exact survival of a gate plan: Π_segments [p^L + (1 − p^L)·c·p^L] · p^tail */
  function gateExact(P, gates) {
    const { p, c, k } = P; let s = 0, q = 1;
    for (const g of gates) { const L = g - s, pl = Math.pow(p, L); q *= pl + (1 - pl) * c * pl; s = g; }
    return q * Math.pow(p, k - s);
  }
  const PLANS = {
    every: { label: 'every step', gates: Array.from({ length: 20 }, (_, i) => i + 1) },
    mid: { label: 'midway + end', gates: [10, 20] },
    end: { label: 'end only', gates: [20] },
    none: { label: 'no check', gates: [] },
  };

  /* ─────────────── chalk (HUD, 2D) ─────────────── */
  let _grain = null;
  function grain(U) {
    if (_grain) return _grain;
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const im = g.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const x = i % 256, y = (i / 256) | 0; const n = U.h(9, x, y), m2 = U.noise2(5, x * 0.08, y * 0.25); const a = (n > 0.62 - 0.25 * m2 ? 255 : 0); im.data[i * 4 + 3] = a; }
    g.putImageData(im, 0, 0); _grain = c; return c;
  }
  /** Draw chalk text/marks into a p5.Graphics: content drawn by fn(g2d), then eroded by a grain pattern. */
  function chalk(H, U, fn, opt = {}) {
    const g = H.drawingContext, cv = H._chalkCv || (H._chalkCv = document.createElement('canvas'));
    const W = H.width * H.pixelDensity(), Hh = H.height * H.pixelDensity();
    if (cv.width !== W || cv.height !== Hh) { cv.width = W; cv.height = Hh; }
    const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, Hh);
    c.setTransform(H.pixelDensity(), 0, 0, H.pixelDensity(), 0, 0); fn(c);
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'destination-out';
    c.globalAlpha = opt.erode ?? 0.55; c.fillStyle = c.createPattern(grain(U), 'repeat'); c.fillRect(0, 0, W, Hh);
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = opt.alpha ?? 1; g.drawImage(cv, 0, 0); g.restore();
  }
  /** tally strokes in gates of five; strokes[i] = colour; returns width */
  function tally(c, U, x, y, n, colOf, h = 22, k = 0, prog = 1) {
    let cx = x;
    for (let i = 0; i < n; i++) {
      const g5 = Math.floor(i / 5), r = i % 5, a = clamp(prog * n - i);
      if (a <= 0) break;
      c.strokeStyle = colOf(i); c.lineWidth = 2.6; c.lineCap = 'round';
      const jx = (U.h(31 + k, i, 1) - 0.5) * 1.6, jy = (U.h(31 + k, i, 2) - 0.5) * 2;
      c.beginPath();
      if (r < 4) { const xx = cx + r * 7 + jx; c.moveTo(xx, y + jy); c.lineTo(xx + 1.2, y + jy + (h) * a); }
      else { c.moveTo(cx - 3, y + h * 0.75); c.lineTo(cx - 3 + 31 * a, y + h * 0.2); }
      c.stroke();
      if (r === 4) cx += 40;
    }
    return cx - x;
  }

  /* ─────────────── render: pass 1 (receiver occlusion, third resolution) + pass 2 (everything) ─────────────── */
  function initRender(p, G) {
    G.occ = p.createFramebuffer({ width: 320, height: 180, density: 1, depth: false, textureFiltering: p.LINEAR });
    G.recv = buildReceivers(p);
    G.groups = buildGroups(p, G.atlas.table);
    G.sh = makeShaders(p);
  }
  /** v: {eye, tgt, fov, K, house, rim, light:{pos, aim, R, cos0, cos1}, title:[part,x,y,z], title2, titleRow,
   *      ranges: [[base, count], …] far → near, propsRow, props:{cards, threads}, drape} */
  function render(p, ctx, G, v) {
    const U = ctx.U, T = ctx.tokens, gl = p._renderer.GL, rgb = hx => U.color.hex2rgb(hx);
    const focus = Math.hypot(v.tgt[0] - v.eye[0], v.tgt[1] - v.eye[1], v.tgt[2] - v.eye[2]);
    const Lp = v.light.pos, Ld0 = [v.light.aim[0] - Lp[0], v.light.aim[1] - Lp[1], v.light.aim[2] - Lp[2]], ll = Math.hypot(...Ld0);
    const ready = new Set();
    const use = (name, pass) => {
      const sh = G.sh[name]; p.shader(sh);
      if (ready.has(name)) return sh;
      ready.add(name);
      sh.setUniform('uData', G.D.tex.src); sh.setUniform('uTable', G.table.src); sh.setUniform('uAtlas', G.atlas.tex.src);
      sh.setUniform('uCam', v.eye); sh.setUniform('uFocus', focus); sh.setUniform('uDofK', v.K);
      sh.setUniform('uPxPerUnit', 270 / (Math.tan(v.fov * Math.PI / 360) * focus));
      sh.setUniform('uHouse', v.house); sh.setUniform('uWarm', 0.4); sh.setUniform('uRimK', v.rim ?? 1);
      sh.setUniform('uL', Lp); sh.setUniform('uLdir', Ld0.map(q => q / ll)); sh.setUniform('uLcos0', v.light.cos0 ?? S.cos0); sh.setUniform('uLcos1', v.light.cos1 ?? S.cos1); sh.setUniform('uLR', v.light.R ?? S.lightR); sh.setUniform('uLI', v.light.I ?? 1);
      sh.setUniform('cCopper', rgb(T.copper)); sh.setUniform('cSage', rgb(T.sage)); sh.setUniform('cPeach', rgb(T.peach)); sh.setUniform('cSlate', rgb(T.slate));
      sh.setUniform('cChalk', [0.93, 0.91, 0.86]); sh.setUniform('cDrape', v.drape || [0.105, 0.092, 0.082]); sh.setUniform('cFloor', [0.10, 0.075, 0.055]); sh.setUniform('cPlank', [0.90, 0.85, 0.74]);
      sh.setUniform('uTitle', v.title || [0, 0, 0, 0]); sh.setUniform('uTitle2', v.title2 || [0, 0, 0, 0]); sh.setUniform('uTitleRow', v.titleRow ?? -1);
      sh.setUniform('uPass', pass); sh.setUniform('uRes', [gl.drawingBufferWidth, gl.drawingBufferHeight]);
      if (name !== 'OCC') sh.setUniform('uOcc', G.occ);
      sh.setUniform('uBase', 0);
      return sh;
    };
    const cam = () => { p.perspective(v.fov * Math.PI / 180, 16 / 9, 20, 14000); p.camera(v.eye[0], v.eye[1], v.eye[2], v.tgt[0], v.tgt[1], v.tgt[2], 0, 1, 0); };
    p.noStroke();
    // pass 1: receiver occlusion at a third of the resolution (all stages in one call: instance order is far → near)
    G.occ.begin(); p.clear(); cam(); p.noStroke();
    gl.disable(gl.DEPTH_TEST);
    for (const [base, n] of v.ranges) { const sh = use('OCC', 1); sh.setUniform('uBase', base); p.model(G.recv, n); }
    gl.enable(gl.DEPTH_TEST); p.resetShader(); G.occ.end();
    ready.clear();
    // pass 2: rows far → near, groups in painter's order
    cam(); p.noStroke(); gl.disable(gl.DEPTH_TEST);
    for (const [base, n] of v.ranges) for (const [name, geo] of G.groups) { const sh = use(name, 0); sh.setUniform('uBase', base); p.model(geo, n); }
    if (v.props) {
      let sh = use('PAPER', 0); sh.setUniform('uBase', v.propsRow); p.model(v.props.cards, 1);
      sh = use('ROD', 0); sh.setUniform('uBase', v.propsRow); p.model(v.props.threads, 1);
      if (v.props2) { sh = use('CLOTH', 0); sh.setUniform('uBase', v.propsRow + 1); p.model(v.props2.cards, 1); }
    }
    gl.enable(gl.DEPTH_TEST);
    p.resetShader();
    if (G.dbgOcc) { p.push(); p.camera(); p.perspective(); p.clearDepth(); p.imageMode(p.CORNER); p.image(G.occ, -480, -270, 480, 270); p.pop(); }
  }
  return { S, SL, PID, MAT, NSLOT, ROWW, clamp, lerp, sstep, rot, add, partDefs, stencilDef, tagDef, boardDef, chalkDef, buildAtlas, buildGroups, buildReceivers, buildProps, initRender, render, makeShaders, makeData, makeTable,
    rawTexture, fallingPaper, falls, fallAt, puppetFK, walkPose, tipPose, mixPose, hangPose, writeStage, district, engineEvents, gateRun, gateExact, PLANS, chalk, tally, grain, paperRGB };
})();
