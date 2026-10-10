# R11: Atelier runtime tooling

Scope: `scratchpad/up4-runtime/runtime/` (README.md, build.py, gate.py, render.py, examples/). atelier.js was only skimmed for `window.__atelier`. `verify-am/runtime/` is byte-identical for all five files.

## 1. README: def contract, rules, wave-1 notes

Def contract (README, near-verbatim):

```
Atelier.film({ id, title, direction, level, duration, size: [960, 540], renderer: 'p2d'|'webgl', fps: 30, seed, ground,
  chapters: [{t, label}], captions: [{t0, t1, text}], state: {…},
  controls: [{key, type: 'toggle'|'range'|'select'|'commit', label, min, max, step, options, jump, countdown}],
  fonts: [{family}], engine: ctx => Atelier.AgentLoop({N, k, seed: ctx.seed}),
  setup(p, ctx) {}, draw(p, t, ctx) {},
  score: ctx => [{t, kind: 'tick'|'clack'|'click'|'tone', gain, freq, dur, pan}],
  meta: ctx => [{label, value, check: {world, k, p, c, N}}] });
```

`ctx` gives state, seed, size, tokens, U, engine, fonts, mode, `layer()`, `caption(t)`, `commit`, `commits`. Draw in design units.

Rules stated in the README:
- **Clock law:** a frame is a pure function of (t, state, seed). No frameCount, millis(), Date, performance.now, Math.random or p.random. Use `U.h` and `U.stateAt`. Violations fail the gate.
- **Build once:** setup builds geometry, textures and atlases; `ctx.layer` caches buffers; draw only renders.
- **Numbers** come from the engine or the marks and are declared in `meta()` with a `check`.
- **Banned defaults and positive tests** are in `../ART-DIRECTION-v1.md` §2 and semantic colours in §3. That relative path is dangling here; the file is uploaded as `7179e1dc-ART-DIRECTION-v1.md`.
- Captions are 90 characters or fewer, with a soft track in the MP4.
- **Commit control:** holds playback at `jump − countdown` until committed. Scrubbing past snaps back. Film mode uses the default value.
- Fonts are embedded as WOFF because p5 2.3.4 rejects woff2.
- Gotchas: p5.Font has no glyph fallback (use `tabular(n,d,{pad:' '})`); WEBGL instance data comes via `texelFetch(…, gl_InstanceID)`.

Notes from wave 1 (quoted near-verbatim):
1. `build.py film.js --kit a.js b.js --fonts ...` inlines shared kits before the film (no more make.sh glue).
2. `score(ctx)` and `meta(ctx)` run BEFORE `setup()`, so anything they need must be computed lazily or purely.
3. Light grounds (OKLCH L > 0.6) get a curated set (`tokensLight`); copper and peach stay distinct. `tokensFor(g, {retune:true})` gives the old behaviour.
4. Render and gate run Chromium with `--disable-accelerated-2d-canvas`, because heavy 2D path work was 3–9 s/frame on SwiftShader. For heavy 2D, draw to an offscreen `willReadFrequently` canvas and blit once.
5. WEBGL on SwiftShader: `baseMaterialShader` costs about 25 s/frame; a custom GLSL 300 es shader about 0.6 s. Avoid the uniform name `uTint` (p5 resets it). p5.Image premultiplies alpha, so keep alpha = 255 in data textures.
6. The live readout hides engine numbers until every commit beat is committed.

README issues: its Speed figures (0.06 s p2d, 0.49 s webgl) do not match the committed render.json files, and gate checks are documented only in gate.py.

## 2. build.py

- **Inputs:** `film.js`; `--out DIR` (required); `--fonts "Family=path[:weight[:style]]"` (repeatable); `--kit a.js …` (prepended to the film, and id/title are read from the film file).
- **Flags:** there is no `--p5` switch. p5 is always inlined in `<id>.html` and always loaded from jsDelivr in `<id>.artifact.html` (`cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js`).
- **Sources:** `STUDIO = ../..`, fallback `../../ceti-p5-studio`; needs `STUDIO/vendor/p5-2.3.4.min.js` and `STUDIO/skills/p5-explainer/assets/fonts/`. Seven CETI woff2 faces are always embedded (Fraunces, DM Sans, Space Mono), so fontTools and brotli are needed for every build.
- **`<id>.html` (offline):** doctype, head with charset, viewport, title and base CSS (`color-scheme:dark`, background #0E1014). Body: `<script data-atelier="p5">` (p5 inline). Injected before the last `</body>`: `data-atelier="fonts"` (`window.ATELIER_FONTS`, base64 WOFF keyed "Family weight [style]"), `data-atelier="runtime"` (atelier.js), `data-atelier="film"` (kit plus film). `</script` and `<!--` are escaped.
- **`<id>.artifact.html`:** a publishable fragment with no doctype, html, head or body. It has `<title>`, `<style>`, the jsDelivr `<script src>`, then the same three data-atelier blocks. About 275 KB against 1.27 MB offline. It is dark-only, with no charset meta, although the runtime contains non-ASCII text.
- **Fragility:** `film_id` and `film_title` are regexes over the first `id:` and `title:`. An apostrophe in a title truncates it.

## 3. gate.py

- **Driver:** Python Playwright sync API, Playwright's managed Chromium, FLAGS forcing SwiftShader WebGL and CPU 2D canvas. Serial, one browser.
- **Usage:** `gate.py film.html [--w N] [--json out]`. Prints PASS/FAIL, exits 1 on any FAIL.
- **Checks (docstring lists 9, code prints 10):**
  - **LOAD live:** 1280×900 page; waits for `window.__atelier` (60 s timeout), then `ready`, then seeks to 60 %. Any pageerror or console.error fails it.
  - **LAYOUT 400px:** resizes to 400×800; `scrollWidth <= clientWidth`. Absent from the docstring.
  - **PURE-REP:** at 7, 29, 51, 73 and 94 % of duration: seek t, seek dur−t, seek t. The sha1 (12 hex) of the canvas PNG must match.
  - **PURE-ORD:** pairs (ts[i], ts[i+2 mod 5]). A→B hashes must equal B→A hashes.
  - **CLOCK:** regex scan of the film script (comments stripped) for the banned APIs, plus any runtime violations recorded during draws.
  - **META:** each row with `check` must pass `checkMeta`: counts within 4 sd of N·q (binomial), probabilities within 5e-4 of `AgentLoop.exact`.
  - **ENGINE:** `AgentLoop.selfTest` passes; worst |z| is reported.
  - **CAPTIONS:** ≤ 90 characters, 0 ≤ t0 < t1 ≤ duration, ordered.
  - **AUDIO:** `audio()` is a WAV at least as long as the film, with events > 0 and peak > 0.01.
  - **LOAD film:** 960×540 `?film=1`, zero console errors.
- **Timeouts:** 60 s on the two boot waits only.
- **Weaknesses:**
  - The probability META rows are tautological. `checkMeta` computes the expected value with `exact(k,p,c,retry)`, and the row's value is `A.exact` from the same function, so it cannot fail. smoke-2d's "P(full run) · off" row is one example.
  - PURE tests use five fixed times in one page. They do not test determinism across processes.
  - CLOCK scans the film script only; the runtime is covered only dynamically.
  - The gate never inspects the MP4 or render outputs.
- **Dependencies:** `playwright` (Python) and `playwright install chromium`. `import playwright` fails in this environment.

## 4. render.py

- **Frames:** each worker is a `multiprocessing.Process` with its own Chromium; per frame it calls `seek(t)` then `capture(fmt, 0.93)`. Frames are sharded `times[wi::k]`. Time is set, never observed.
- **Stills:** `--stills t1,t2` writes `t_SS.dd.png`; `--sheet` makes a contact sheet (only with `--stills`). **Sequences:** `--from`, `--to`, `--fps` (30); frames are `f%05d.jpg`.
- **MP4 (`--mp4`):** ffmpeg `libx264 -pix_fmt yuv420p -crf 18 -preset medium +faststart`. Audio is `__atelier.audio()` (offline WebAudio render of the score), saved as `<base>.wav`, seeked with `-ss from`, encoded AAC 160k. Captions are written to `<base>.srt` and muxed as `mov_text` (`language=eng`); `--burn` hard-subs them with DejaVu Sans 18. `--upscale W` applies Lanczos. With `--stills` and `--mp4` together the MP4 is silently skipped.
- **Watchdog:** 2 workers by default. Collection budget is `120 + 30·(frames per worker + 1)` s, then up to two rescue passes, each with `120 + 30·missing` s. Missing frames are detected by file existence.
- **Gap:** after rescue, still-missing frames are not reported. Only worker-reported errors count, so the run can exit 0 with gaps. ffmpeg stops at the first gap, so the MP4 is silently truncated.
- **Exit code:** 1 on any pageerror, console error, clock-law violation or ffmpeg failure.
- **render.json:** `wall_s` (includes rescue, excludes muxing), `render_s` (max worker render time, no boot), `s_per_frame_wall` (render_s / frames), `s_per_frame_per_worker` (sum of worker times / frames, so it is average per-frame cost and mis-named), `boot_s[]`, `errors[]`, and mp4, audio, captions and sheet when produced. ffmpeg time is not recorded.
- **Sample timings:** smoke-2d stills, 6 frames, 2 workers: render_s 1.09, wall 2.3 s, boot 1.2–1.35 s. smoke-webgl stills, 4 frames: render_s 5.61, boot about 3.2 s.
- **Stale outputs:** `examples/out/*.mp4` are 4.000 s excerpts (`--to 4`), which is right for that command. Their SRTs do not match the current films. smoke-2d.srt has one entry (the 4.5–10.5 s caption text) at 0–4 s, but the film's 0–4 s captions are the 0.2–1.5 s and 1.5–4.5 s lines. smoke-webgl.srt has 0–3 s and 3–4 s, but the film has 0.1–4 s and 4–8 s. Re-render before using these as evidence.

## 5. The two smoke films

`smoke-2d.film.js` is 112 lines, so it is quoted in full below. (The quoted code is about 1,000 words and is excluded from the word count.)

`smoke-webgl.film.js` (117 lines): 8 s, `renderer:'webgl'`, 400 instances of one `buildGeometry` box via `model(g, 400)`. A 200×1 data texture, built once in setup, holds both fail steps. A custom `getWorldInputs` hook reads it with `texelFetch(uData, ivec2(run,0), 0)`; the only per-frame input is `uStep`. Two captions, a tick/clack/click score, two checked meta rows. Its gate shows 61 events and an 8.30 s WAV.

```js
/* smoke-2d — Canvas2D runtime test (plain on purpose).
   Twin worlds, 2 × 200 run columns × 20 steps. A column grows one cell per step; a failed run stops at its step
   (peach cell = the address of the failure). The 'on' world shares every random draw; a sage cell marks a slip
   the check caught and retried. Counters are read from the marks. One commit control (predict → commit → reveal). */
Atelier.film({
  id: 'smoke-2d',
  title: 'Smoke 2D — twin worlds, counted from the marks',
  direction: 'Runtime test · Canvas2D',
  level: 'glance',
  duration: 12,
  size: [960, 540],
  renderer: 'p2d',
  fps: 30,
  seed: 1,
  chapters: [{ t: 0, label: 'Setup' }, { t: 1.5, label: 'Your guess' }, { t: 4.5, label: 'Run' }, { t: 10.5, label: 'Count' }],
  captions: [
    { t0: 0.2, t1: 1.5, text: '200 agent runs, 20 steps each, every step right 95 % of the time.' },
    { t0: 1.5, t1: 4.5, text: 'Before it runs: how many of the 200 finish all 20 steps without checks?' },
    { t0: 4.5, t1: 10.5, text: 'Same random draws in both worlds. Below, a check catches 80 % of slips and retries once.' },
    { t0: 10.5, t1: 12, text: 'Count the full columns: the check saved the runs that end in sage.' },
  ],
  state: { guess: 100 },
  controls: [
    { key: 'guess', type: 'commit', label: 'Full runs, checks off (of 200)', min: 0, max: 200, step: 1, jump: 4.5, countdown: 3,
      hint: 'Commit before the run plays.', format: v => Math.round(v) },
  ],
  engine: ctx => Atelier.AgentLoop({ N: 200, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

  setup(p, ctx) {
    p.textFont('DM Sans');
    const N = 200, k = 20, x0 = 60, x1 = 900, cw = (x1 - x0) / N, ch = 7.6;
    ctx.L = { N, k, x0, cw, ch, top: { y: 128, w: 'off' }, bot: { y: 338, w: 'on' } };
  },

  draw(p, t, ctx) {
    const { U, tokens: T, engine: A, L } = ctx;
    const s = 20 * U.seg(t, 4.5, 10.5, 'linear');          // steps completed (continuous)
    const sFull = Math.floor(s + 1e-9);
    const count = { off: 0, on: 0 };
    for (const P of [L.top, L.bot]) {
      p.noStroke(); p.fill(T.panel); p.rect(L.x0 - 8, P.y - 8, L.N * L.cw + 16, L.k * L.ch + 16, 4);
      for (let r = 0; r < L.N; r++) {
        const f = A.failStep[P.w][r], x = L.x0 + r * L.cw;
        const grown = f < 0 ? sFull : Math.min(sFull, f);   // healthy cells drawn
        p.fill(T.copper);
        if (grown > 0) p.rect(x, P.y, L.cw - 1, grown * L.ch - 1);
        if (P.w === 'on') for (let j = 0; j < grown; j++) if (A.slip(r, j)) { p.fill(T.sage); p.rect(x, P.y + j * L.ch, L.cw - 1, L.ch - 1); }
        if (f >= 0 && sFull > f) { p.fill(T.peach); p.rect(x, P.y + f * L.ch, L.cw - 1, L.ch - 1); }
        if (grown >= L.k) count[P.w]++;                      // the counter is read from the marks
      }
    }
    // labels + counters
    p.fill(T.ink); p.textSize(15); p.textAlign(p.LEFT, p.BASELINE);
    p.text('Checks off', L.x0, L.top.y - 16); p.text('Checks on · catch 80 %, retry once', L.x0, L.bot.y - 16);
    p.textFont('Space Mono'); p.textSize(13); p.textAlign(p.RIGHT, p.BASELINE); p.fill(T.dim);
    p.text('step ' + U.tabular(sFull, 2) + ' / 20', 900, L.top.y - 16);
    p.textAlign(p.LEFT, p.CENTER); p.textSize(22);
    if (s > 0) {
      p.fill(T.copper); p.text(U.tabular(count.off, 3), 912, L.top.y + 76);
      p.fill(T.sage); p.text(U.tabular(count.on, 3), 912, L.bot.y + 76);
    }
    // the commit beat (countdown drawn by the film itself) and the guess
    const C = ctx.commit, cd = C.countdown(t);
    p.textFont('DM Sans'); p.textAlign(p.CENTER, p.CENTER);
    if (cd !== null) {
      p.fill(T.ink); p.textSize(26); p.text('How many of 200 finish all 20 steps, checks off?', 480, 52);
      p.fill(T.dim); p.textSize(14);
      p.text(C.auto ? 'Pause and guess — revealing in' : (C.committed ? 'Committed — revealing in' : 'Commit a guess in the panel'), 480, 84);
      if (C.auto || C.committed) { p.textFont('Space Mono'); p.fill(T.copper); p.textSize(30); p.text(Math.ceil(cd), 690, 82); }
    } else if (t < 1.5) {
      p.fill(T.ink); p.textSize(26); p.text('Per-step reliability compounds over whole runs', 480, 60);
    } else if (sFull >= 20) {
      p.fill(T.dim); p.textSize(14);
      p.text('realised ' + count.off + ' · exact ' + (200 * A.exact.off[20]).toFixed(1) + ' ± ' + A.sd.off[20].toFixed(1) + '  (sd)', 480, 60);
    }
    if (t >= 1.5) {
      const gx = L.x0 + C.value / 200 * (L.N * L.cw);
      p.stroke(T.ink); p.strokeWeight(1.5); p.line(gx, L.top.y - 4, gx, L.top.y + L.k * L.ch + 4); p.noStroke();
      p.fill(T.ink); p.textFont('Space Mono'); p.textSize(11); p.textAlign(p.CENTER, p.TOP);
      p.text((C.auto ? 'default ' : 'guess ') + Math.round(C.value), gx, L.top.y + L.k * L.ch + 10);
    }
    if (t >= 10.5) {
      p.fill(T.ink); p.textFont('DM Sans'); p.textSize(16); p.textAlign(p.CENTER, p.BASELINE);
      p.text(A.saved.length + ' runs saved by the check (failed above, full below)', 480, 528);
    }
  },

  score(ctx) {
    const A = ctx.engine, ev = [];
    for (let i = 0; i < 3; i++) ev.push({ t: 1.5 + i, kind: 'tone', freq: 660, dur: 0.18, gain: 0.5 });
    for (let j = 0; j < 20; j++) {
      const t = 4.5 + (j + 1) * 0.3;
      ev.push({ t, kind: 'tick', gain: 0.7 });
      const fo = A.failedAt('off', j);
      if (fo) ev.push({ t: t + 0.01, kind: 'clack', gain: Math.min(1.4, 0.4 + fo / 6), pan: -0.3 });
      let caught = 0; for (let r = 0; r < A.N; r++) if (A.slip(r, j) && A.retryOk(r, j) && A.alive(r, 'on', j)) caught++;
      if (caught) ev.push({ t: t + 0.03, kind: 'click', gain: Math.min(1.2, 0.3 + caught / 8), pan: 0.3 });
    }
    ev.push({ t: 10.6, kind: 'tone', freq: 392, dur: 1.2, gain: 0.8 });
    return ev;
  },

  meta(ctx) {
    const A = ctx.engine;
    return [
      { label: 'Full runs · checks off', value: A.survivors.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8, N: 200 } },
      { label: 'Full runs · checks on', value: A.survivors.on[20], check: { world: 'on', k: 20, p: 0.95, c: 0.8, N: 200 } },
      { label: 'P(full run) · off', value: A.exact.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8 } },
      { label: 'Saved by the check', value: A.saved.length },
    ];
  },
});
```

## 6. External dependencies and portability

- **Python:** fontTools and brotli (build.py), playwright (gate.py, render.py), Pillow (`--sheet`). No requirements file. Here playwright, fontTools and brotli are missing; Pillow is present. Node is not used. ffmpeg is on PATH (`/usr/bin/ffmpeg`). Chromium has no path override.
- **Font paths:** `/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf` (render.py, with fallback) and the family "DejaVu Sans" (burn-in).
- **$STUDIO:** `find / -name p5-2.3.4.min.js` returns nothing, so no p5 vendor file exists on this machine. From this location STUDIO resolves to `scratchpad/`, which has no `vendor/`, so build.py fails. The fonts are at `scratchpad/up5-skills/skills/p5-explainer/assets/fonts/`. The examples/build HTML was built elsewhere, where the vendor file existed.
- **Target repo:** `/home/user/ceti-explainer` on `feature/explainer-atelier` has no atelier, vendor or p5-explainer files. It has `skills/ceti-explainer/assets/build.py` and `gate.mjs` for the SVG pipeline.

## Core ideas that should survive into a master plugin

- The clock law, enforced by a runtime violation log and a source scan.
- The determinism gate (PURE-REP, PURE-ORD) and `window.__atelier` as the contract between player, gate and renderer.
- AgentLoop with twin worlds on shared draws, the exact formula p' = p + (1−p)·c·p, and binomial META checks.
- One score event list driving live WebAudio and the offline WAV; the commit control.
- Two build outputs (offline with inline p5, and a CDN fragment), with fonts embedded once as WOFF.
- Captions as one source for on-screen text, SRT and mov_text.
- Frame sharding with a watchdog and rescue passes (fix the gap in section 4).

## Experiment-specific choices

- Dark-only ground (#0E1014), the CETI tokens and `tokensLight`, and the three-font set.
- The p5 2.3.4 pin, the 960×540 size, and the smoke films' copy and geometry.
- SwiftShader workarounds and their timings, which depend on this sandbox.
- DejaVu font paths and the scratch-folder STUDIO/FONT_DIR layout.

## Path assumptions to fix for a merge into /home/user/ceti-explainer

1. build.py `STUDIO` (`../..` with fallback `../../ceti-p5-studio`). Placed at `skills/atelier/runtime/`, it resolves to `skills/`, not the repo root. Use an explicit `--studio` flag, env var or repo-root constant.
2. Provide `vendor/p5-2.3.4.min.js` (or a documented download). Nothing in the repo supplies it.
3. `FONT_DIR`: copy the fonts from `up5-skills/skills/p5-explainer/assets/fonts/` into the repo, or point at existing brand assets. Drop the fallback.
4. Fix the README's `../ART-DIRECTION-v1.md` link and move the document into the repo.
5. Make the DejaVu font paths configurable or bundle a font.
6. Add a requirements file (playwright, fonttools, brotli, Pillow) and document `playwright install chromium`.
7. Keep the Atelier tools in their own directory so they do not collide with `skills/ceti-explainer/assets/build.py` and `gate.mjs`.
8. Re-render `examples/out` before merging; the SRTs and MP4s are stale.
9. Fix the render.py frame-gap issue (fail if any frame file is missing before muxing) and replace the tautological probability META rows with a real test.
10. Check the artifact fragment against the artifact contract: charset, and light-mode tokens if required.
