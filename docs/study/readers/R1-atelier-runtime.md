# R1 · Atelier runtime 0.1 (p5.js film runtime)

Source: `/tmp/claude-0/atelier-runtime.js` (= HTML lines 6–886 of `2857bd73-bunraku-native.html`). **L-numbers are slice lines; HTML line = L+5.** Colour, AgentLoop, stateAt and ease claims were run in Node; p5 was not. §1 is inferred from code (the header cites a README not in this slice).

## 1. Def contract: `Atelier.film(def)` (L484–877)
- `id` (L493, L507, L632, L861). Storage prefix `atelier-<id>`.
- `size` [w,h], default [960,540] (L488). `duration`, required (L491). `fps`, default 30 (L491). `renderer:'webgl'` (L491, L838).
- `seed`, default 1 (L492). `?seed=` overrides.
- `state` (L495). Commit keys default to `min ?? 0` (L496).
- `controls[]` (L494): `commit` (L709), `toggle` (L688), `range` (L692), `select` (L697; ≤4 options become segments, L700). Fields: `key,label,min,max,step,format,options,hint,jump`. Commit-only: `countdown`, default 3 (L528).
- `captions[{t0,t1,text}]` (L523). `chapters[{t,label}]` (L524, L614, L624).
- `ground` (L508). `engine(ctx)` (L539), `score(ctx)` (L540), `meta(ctx)` (L541–542). All three re-run in `derive()` on boot and on every `setState` (L536–543, L676).
- `fonts[{family,url|base64,weight}]` (L576–582). Fallback: `window.ATELIER_FONTS` (L474–481).
- `setup(p,ctx)`, async (L844), after fonts and the first derive (L842–843).
- `draw(p,t,ctx)` (L564). `title` (L593, L602), `direction`, `level` (L602).

## 2. ctx (L506–525)
- `id, def, mode` ('film' | 'live', L507), `duration, fps, seed, state, size {w,h,rw,rh,k}`, `tokens`, `U`, `fonts`, `engine`, `commit`.
- `layer(name,opt)` (L511–522): cached offscreen. `opt`: `w,h,density,kind` ('p2d' | 'webgl' | 'framebuffer'), `float, nearest, build(g,ctx)`. Rebuilt when render scale `k` changes (L513).
- `caption(t)` (L523): first caption covering t. `chapter(t)` (L524): last chapter with `c.t ≤ t`, or −1.
- `commits[key]` (L529–531): `{value, committed, auto (=FILM), jump, hold = jump − countdown, countdown(t)}`. `countdown(t)` = `jump − t` inside [hold, jump), else null. The runtime draws no countdown; `def.draw` must.

## 3. Clock law and enforcement
- Law (L5–8): frame = f(t, state, seed); use `U.h`, `U.stateAt`; no frameCount, millis, Date, performance, Math.random, p.random.
- `userDraw` (L558–567) wraps `Math.random` and `Date.now` during `def.draw` only. Hits go to `violations[]` (L561–562).
- `guardP5` (L569–571) wraps `p.random`, `p.randomGaussian`, `p.millis`. It records only while `busy` (L550), i.e. during redraw. Setup is not policed.
- Violations are recorded, not thrown. They surface as `api.violations` and in `seek().violations` (L860, L871). The gate must check them.
- **Gaps:** `performance.now`, `new Date()`, `crypto` and `p.frameCount` are unwrapped, though L6 names frameCount and performance. Math.random and Date.now are guarded only during draw. `score`, `meta` and `engine` run unguarded in `derive()`, so a random call there breaks reproducibility across `setState`.

## 4. AgentLoop and AgentLoop.exact (L265–345)
- **Inputs** (L280): `{N=2000, k=20, p=.95, c=.8, retry=1, seed=1}`.
- **exact** (L267–273): `p' = p + (1−p)·c·(1−(1−p)^retry)`; `off[j]=p^j`, `on[j]=p'^j`. Exposed as `Atelier.exact` (L879).
- **Outputs** (L303–326): `flags` (Uint8Array N·k; bit0 slip, bit1 caught, bit2 retryOk); `failStep {off,on}` (−1 = never); `survivors`, `expected`, `sd`, `exact`, `pPrime`; `saved` (fails off, passes on); `lost`. Methods: `slip/caught/retryOk(r,j)`, `alive(r,w,j)`, `passed(r,w)`, `events(r,w)`, `failedAt(w,j)`, `table()`.
- **Twin-world CRN** (L279–294): draws are `h(seed,r,j,·)`. Slip iff u0 > p (L286). Caught iff u1 < c (L287). Retry q ok iff u(2+q) < p (L288). World `off` dies at the first slip (L291). World `on` dies at the first slip not caught-and-retried-ok (L292). Both worlds share draws, so `lost` must be 0.
- **selfTest** (L330–345): seeds [1,2,3], ks [5,10,20,40], N=2000. Passes if every step of both worlds is within 4 sd of exact, and the twin invariant holds.
- **Checked in Node:** pass = true; worst z = 2.39 / 0.92 / 1.85 for seeds 1 / 2 / 3. At k=20, p' = 0.988. Seed 1: off 719 vs 717.0 expected, on 1586 vs 1571.0, saved 867, lost 0.
- **Caveat:** per seed, flags are prefix-identical across k (checked j<5). The four k values re-test the same draws, so the k-sweep is not independent evidence.

## 5. Commit controls, hold and countdown
- **Page:** `gate(from,to)` (L657–662) returns the first uncommitted commit whose `hold` lies in (from,to]. Playback clamps to `hold`, pauses, sets `heldOn` and focuses the slider (L786–788). Scrub is clamped (L663–667).
- Hold pill "Your call first — commit a guess to continue →" (L607, L795) shows under class `at-held` (L652). The commit box pulses (L653).
- **Commit** (L717) sets `key$committed` and resumes play if held. **"skip — just show me"** (L718) runs the same function, so it still records the current slider value as the guess.
- **re-guess** (L719) un-commits and seeks to `hold`. The readout stays hidden until all commits are made (L737).
- **?film=1** (L487): no DOM (L595–598), `gate` returns null (L658), no rAF loop (L848), no audio. `commits[key].auto` is true (L529). Only `seek` drives frames; `api.play()` sets a flag and nothing advances (L873).

## 6. Score and audio (L347–404, L754–778)
- Events `{t, kind, gain, freq, dur, pan, attack}`. `kind` picks one of four voices (L365–377): `tick` (bandpassed noise + sine), `clack` (downswept triangle + noise), `click` (sine pair at f and 1.5f), `tone` (sine + 2nd harmonic).
- `normaliseScore` (L379–384) drops unknown kinds and events outside [0,DUR]. Same-kind events within 12 ms merge, adding 0.25 gain each, capped at 2.
- Meaning lives in the film's `def.score`; the runtime only maps kind to timbre.
- **Live:** `audio.tick` (L767–777) schedules a 0.25 s × speed lookahead. AudioContext starts on first gesture (L756–761, L801–802). Seek, pause and speed reset it (L763–766).
- **Offline:** `renderScore` (L400–404) gives a 48 kHz stereo 16-bit base64 WAV; `__atelier.audio()`.

## 7. window.__atelier (L856–875)
- `ready` resolves after the first frame (L848). `seek(t)` pauses, renders exactly t, returns `{t, errors, violations}` (L860).
- `info()` (L861–863): `size` [rw,rh] vs `design`, renderer, seed, controls, event count.
- `meta()` attaches `result` to checked rows (L866; checkMeta L747–751). Counts must be within `sds` (default 4) × sd. Probabilities must be within `tol` (5e-4).
- Also `setState`, `state`, `score`, `audio`, `capture(fmt,q)`, `errors`, `violations`, `play`, `pause` (L864–873).
- **Gate outputs:** `errors.length`, `violations.length`, each `meta[].result.ok`, `info().size` vs `design`.

## 8. tokens, tokensFor, retune (L151–180)
- `tokens` (L152–158, frozen): copper `#CE9A6A` (mass, flow, probability); sage `#8FA985` (verified, pass); peach `#D88B5C` (error, cost); slate `#6E8CA8` (structure); ink, dim, ground `#0E1014`, panel `#171B23`.
- `retune` (L161–166) keeps hue and keeps the token's lightness distance from the ground (×contrast). Dark ground: L = g + d, clamped to [0.3, 0.97]. Light ground: L = g − 0.85d, clamped to [0.12, 0.72]. Chroma is scaled and gamut-mapped.
- `tokensFor` (L171–180): CETI ground returns a copy. L > 0.6 returns the curated `tokensLight` (L170). L in 0.3–0.6 keeps CETI values. Otherwise all six are retuned.
- **Invariance (Node):** `retune` keeps hue within ~0.5°. Curated `tokensLight` does not: peach 51.4°→33.7°, copper 63.4°→69.6°, sage 137.1°→147.5°, slate −113.1°→−109.7°.
- **Contradiction:** L151 says "meaning is invariant; L/C may be retuned", but L168–169 says hues were deliberately pulled apart. On light grounds, meaning is kept by token name, not by hue.

## 9. U utilities (L258–263)
- Noise and hash: `h` (L33), `mix32`, `gauss`, `noise1/2/3`, `fbm` (L26–71). Shaping: `clamp, lerp, map, smoothstep` (L47–50), `seg` (L122).
- **Ease names** (L110–119): `linear`, `enter`, `exit`, `inOut`, `settle` (spring 1.9 Hz, ζ .55), `mechanical` (trapezoid), `hand` (min-jerk). `settle` peaks at 1.124 near u≈0.32; the L115 comment says ~10%.
- **stateAt** (L190–210): fixed-step, checkpoint every 32 steps, LRU of 128. Returns a live read-only cursor (L188). `derive()` clears every store on each call (L538). Checked: forward and backward seeks agree.
- Text and geometry: `drawOn` (L216), `textContours` (L232), `tabular` (L242), `fitText` (L250), `fmtTime` (L256). `color` (L261) holds OKLab/OKLCh helpers.

## 10. Player DOM and UI (live only)
- **Layout:** stage with caption and hold pill (L606–607). Transport: play, time, scrub, chapter and commit ticks (L612–615), speed chips 0.5/1/1.5/2× (L618), CC and sound (L619–621). Chapter chips (L624). Side panel: "Try it" controls and Readout (L627–629).
- **Keys:** Space (L806), ←/→ ±1 s or ±5 s with Shift (L807–808), `.` `,` frame step (L809–810), Home/End, `c`, `m` (L811–814).
- **localStorage** (try/catch, L472): `atelier-<id>-speed`, `-cc`, `-snd` (L638, L798–800). Nothing else.
- **Resolution:** stage width × DPR, clamped 160–1920 px (L821), refit on resize (L816–827).
- Query params: `?t=` (L505), `?w=` (film only, L489), `?seed=` (L492).

## Core ideas that should survive into a master plugin (invariants)
1. Frame = pure f(t, state, seed). Impure calls are recorded and the gate requires zero. Close the §3 gaps.
2. One render queue, exact-t seek. Live page and `?film=1` share one code path.
3. Commit beats: playback holds at the prediction, the readout stays hidden until a guess is committed, and the reveal happens at `jump`.
4. Twin worlds on common random numbers. Check realised counts against exact DP (4 sd) and show the check on each meta row.
5. Semantic colour tokens keyed by role, retuned per ground while keeping hue. A hand-curated light set must be declared as a hue change.
6. Score as an event list whose kind selects a voice. The same voices render live and offline.
7. Fixed-step memoised state (`stateAt`) for seekable simulation, reset on state change.
8. Headless hooks (seek, info, meta with result, error and violation counts) make the gate machine-checkable.

## Experiment-specific choices (this run only)
- AgentLoop defaults N=2000, k=20, p=.95, c=.8, retry=1 (L280).
- CETI palette and the light-ground set (L152–158, L170); ground `#0E1014`.
- 960×540 design size, 30 fps, seed 1, speed chips, 12 ms merge window, 4-sd and 5e-4 tolerances.
- Voice design (L365–377), the settle spring and bezier curves (L112–115).
- UI copy ("Your call first", "Try it", "Readout", "skip — just show me") and the `atelier-` storage prefix.
