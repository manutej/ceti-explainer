/* smoke-webgl — WEBGL runtime test (plain on purpose).
   400 instances of ONE buildGeometry box drawn with a single instanced model(g, 400). Per-run AgentLoop results
   live in a 200×1 data texture built once in setup; the vertex hook reads it with texelFetch(gl_InstanceID) and
   the only per-frame input is the uniform uStep. Left block: checks off. Right block: checks on (same draws).
   Column height = steps completed; a peach top = the step where the run failed; sage = a run the check saved. */
Atelier.film({
  id: 'smoke-webgl',
  title: 'Smoke WEBGL — an instanced field driven by AgentLoop',
  direction: 'Runtime test · WEBGL',
  level: 'glance',
  duration: 8,
  size: [960, 540],
  renderer: 'webgl',
  fps: 30,
  seed: 1,
  fonts: [{ family: 'Space Mono' }],
  chapters: [{ t: 0, label: 'Field' }, { t: 1, label: 'Run' }, { t: 7, label: 'Count' }],
  captions: [
    { t0: 0.1, t1: 4, text: 'Each column is one run of 20 steps. Left: no checks. Right: same draws, with checks.' },
    { t0: 4, t1: 8, text: 'Peach tops fail where they slipped; sage columns are runs the check saved.' },
  ],
  state: {},
  controls: [],
  engine: ctx => Atelier.AgentLoop({ N: 200, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

  setup(p, ctx) {
    const A = ctx.engine, T = ctx.tokens, C = hex => ctx.U.color.hex2rgb(hex);
    // data texture: R = fail step off (255 = passed), G = fail step on, B unused
    const img = p.createImage(A.N, 1); img.loadPixels();
    for (let r = 0; r < A.N; r++) {
      img.pixels[r * 4] = A.failStep.off[r] < 0 ? 255 : A.failStep.off[r];
      img.pixels[r * 4 + 1] = A.failStep.on[r] < 0 ? 255 : A.failStep.on[r];
      img.pixels[r * 4 + 2] = 0; img.pixels[r * 4 + 3] = 255;
    }
    img.updatePixels();
    const box = p.buildGeometry(() => { p.translate(0, -0.5, 0); p.box(1, 1, 1); });   // base at y=0, grows up (−y)
    const S = { step: 0 };
    const shader = p.baseMaterialShader().modify({
      uniforms: {
        'sampler2D uData': () => img, 'float uStep': () => S.step,
        'vec3 uCopper': () => C(T.copper), 'vec3 uPeach': () => C(T.peach), 'vec3 uSage': () => C(T.sage),
      },
      vertexDeclarations: 'flat out vec3 vCol;',
      fragmentDeclarations: 'flat in vec3 vCol;',
      'Vertex getWorldInputs': `(Vertex inputs) {
        int id = gl_InstanceID; int world = id / 200; int run = id - world * 200;
        vec4 d = texelFetch(uData, ivec2(run, 0), 0);
        float fOff = floor(d.r * 255.0 + 0.5), fOn = floor(d.g * 255.0 + 0.5);
        float f = world == 0 ? fOff : fOn;
        float done = floor(uStep + 1e-4);
        bool failed = f < 254.5 && done > f;
        float hgt = failed ? f + 1.0 : min(done, 20.0);
        float col = float(run - (run / 25) * 25), row = float(run / 25);
        inputs.position.y *= max(hgt, 0.15) * 7.0;
        inputs.position.x = inputs.position.x * 13.0 + (col - 12.0) * 17.0 + (world == 0 ? -250.0 : 250.0);
        inputs.position.z = inputs.position.z * 13.0 + (row - 3.5) * 17.0;
        bool saved = world == 1 && fOff < 254.5 && fOn > 254.5 && done > fOff;
        vCol = failed ? uPeach : (saved ? uSage : uCopper);
        return inputs; }`,
      'Inputs getPixelInputs': '(Inputs inputs) { inputs.color = vec4(vCol, 1.0); return inputs; }',
    });
    ctx.gl = { box, shader, S };
  },

  draw(p, t, ctx) {
    const { U, tokens: T, engine: A, gl } = ctx;
    const s = 20 * U.seg(t, 1, 7, 'linear');
    gl.S.step = s;
    const yaw = U.lerp(-0.18, 0.12, U.seg(t, 0, 8, 'inOut'));
    p.camera(Math.sin(yaw) * 900, -330, Math.cos(yaw) * 900, 0, -75, 0, 0, 1, 0);
    p.ambientLight(70, 70, 76);
    p.directionalLight(255, 244, 228, -0.45, 0.8, -0.4);
    p.noStroke();
    // floor plates under each block
    p.push(); p.fill(T.panel); p.translate(-250, 1, 0); p.box(440, 2, 150); p.translate(500, 0, 0); p.box(440, 2, 150); p.pop();
    p.shader(gl.shader); p.fill(255); p.model(gl.box, 400); p.resetShader();
    // HUD — counts are computed with the same predicate the shader draws
    const done = Math.floor(s + 1e-4);
    let full = { off: 0, on: 0 };
    for (const w of ['off', 'on']) for (let r = 0; r < A.N; r++) { const f = A.failStep[w][r]; if (done >= 20 && f < 0) full[w]++; }
    p.clearDepth(); p.camera(); p.noLights();
    p.textFont(ctx.fonts['Space Mono']); p.textSize(15); p.fill(T.dim); p.textAlign(p.LEFT, p.BASELINE);
    p.text('checks off', -440, -220); p.text('checks on', 70, -220);
    p.textAlign(p.RIGHT, p.BASELINE); p.text('step ' + U.tabular(done, 2, { pad: ' ' }) + ' / 20', 440, -220);
    if (done >= 20) {
      p.textSize(34); p.textAlign(p.LEFT, p.BASELINE);
      p.fill(T.copper); p.text(String(full.off), -440, -170);
      p.fill(T.sage); p.text(String(full.on), 70, -170);
      p.textSize(13); p.fill(T.dim);
      p.text('of 200 full · expected ' + (200 * A.exact.off[20]).toFixed(1), -380, -172);
      p.text('of 200 full · expected ' + (200 * A.exact.on[20]).toFixed(1), 160, -172);
    }
  },

  score(ctx) {
    const A = ctx.engine, ev = [];
    for (let j = 0; j < 20; j++) {
      const t = 1 + (j + 1) * 0.3;
      ev.push({ t, kind: 'tick', gain: 0.6 });
      const fo = A.failedAt('off', j); if (fo) ev.push({ t: t + 0.01, kind: 'clack', gain: Math.min(1.4, 0.4 + fo / 6), pan: -0.4 });
      const fn = A.failedAt('on', j); if (fn) ev.push({ t: t + 0.02, kind: 'clack', gain: Math.min(1.0, 0.3 + fn / 6), pan: 0.4, freq: 150 });
      let caught = 0; for (let r = 0; r < A.N; r++) if (A.slip(r, j) && A.retryOk(r, j) && A.alive(r, 'on', j)) caught++;
      if (caught) ev.push({ t: t + 0.04, kind: 'click', gain: Math.min(1.2, 0.3 + caught / 8), pan: 0.4 });
    }
    ev.push({ t: 7.05, kind: 'tone', freq: 392, dur: 0.9, gain: 0.8 });
    return ev;
  },

  meta(ctx) {
    const A = ctx.engine;
    return [
      { label: 'Full runs · checks off', value: A.survivors.off[20], check: { world: 'off', k: 20, N: 200 } },
      { label: 'Full runs · checks on', value: A.survivors.on[20], check: { world: 'on', k: 20, N: 200 } },
      { label: 'Saved by the check', value: A.saved.length },
    ];
  },
});
