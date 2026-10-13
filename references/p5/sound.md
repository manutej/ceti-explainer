# p5 2.3.4 — Sound

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

### 6.1 p5.sound 0.4.x (the 2.x-era rewrite on Tone.js)

The package describes itself as "a minimal wrapper for Tone.js" (dependency `tone ^15`), and the README says it works with p5 1.x and 2.x. **Smoke-tested against p5 2.3.4** `[TESTED]`: a sawtooth oscillator went into FFT(256) and Amplitude. The AudioContext reported `running`, the spectrum had 256 bins, the waveform 1024 samples, and level was 0.255.

Exports in 0.4.1 `[SOURCE]`:

- `p5.SoundFile`, `loadSound` (await-able)
- Analysis: `p5.Amplitude`, `p5.FFT`, `p5.OnsetDetect`
- Input: `p5.AudioIn`
- Oscillators: `p5.Oscillator`, `p5.SinOsc`, `p5.TriOsc`, `p5.SawOsc`, `p5.SqrOsc`, `p5.Pulse`, `p5.Noise`
- Synths and envelopes: `p5.Envelope`, `p5.MonoSynth`, `p5.PolySynth`, `p5.AudioVoice`
- Filters and effects: `p5.Filter`, `p5.LowPass`, `p5.HighPass`, `p5.BandPass`, `p5.Biquad`, `p5.EQ`, `p5.Delay`, `p5.Reverb`, `p5.Convolver`, `p5.Distortion`, `p5.Compressor`, `p5.PitchShifter`
- Routing: `p5.Gain`, `p5.Panner`, `p5.Panner3D`
- Sequencing: `p5.Phrase`, `p5.Part`, `p5.Score`, `p5.SoundLoop`
- Globals: `userStartAudio`, `userStopAudio`, `getAudioContext`, `setAudioContext`

**Breaking differences from 1.x p5.sound** (all `[SOURCE]` / `[TESTED]`). Models trained on 2015–2023 tutorials get these wrong:

| 1.x habit | 0.4.x reality |
|---|---|
| `fft.getEnergy('bass')`, `getCentroid`, `logAverages`, `linAverages` | **Gone** (0 occurrences). Bin the `analyze()` array yourself. |
| `analyze()` returns 0–255 | Returns **0–1 (normalRange)**. Values are small: a full-scale saw peaked at 0.011, so map from ~0–0.1 like the shipped example does. |
| `new p5.FFT()` default 1024 bins, analyses the master out | Default **32** bins, max **1024**, and it hears **only what you `connect()`** to it. |
| `new p5.Amplitude()` hears everything | Needs `src.connect(amp)` (or `setInput`). `getLevel()` is still present. |
| `preload(){ s = loadSound() }` | `async setup(){ s = await loadSound('a.mp3') }` |
| `isLoaded()`, `reverseBuffer()`, `getPeaks()` | Not present in 0.4.1. |

```js
// [TESTED pattern] audio-reactive with p5.sound 0.4.x
let song, fft, amp, started = false;
async function setup() {
  createCanvas(800, 400);
  song = await loadSound('loop.mp3');
  fft = new p5.FFT(256); amp = new p5.Amplitude(0.8);
  song.connect(fft); song.connect(amp);
  describe('Bars that pulse with the music after a click.');
}
function mousePressed() { if (!started) { userStartAudio(); song.loop(); started = true; } }
function draw() {
  background(12);
  const s = fft.analyze();                    // 0..1, length 256
  const bass = s.slice(0, 8).reduce((a, b) => a + b, 0) / 8;   // DIY getEnergy
  noStroke(); fill(240, 200, 120);
  for (let i = 0; i < s.length; i++) rect(i * width / s.length, height, width / s.length, -s[i] * 10 * height);
  circle(width / 2, height / 2, 40 + amp.getLevel() * 800 + bass * 2000);
}
```

### 6.2 Autoplay and `userStartAudio`

Browsers keep the AudioContext suspended until a user gesture. Call `userStartAudio()` (p5.sound) or `getAudioContext().resume()` inside `mousePressed/keyPressed` or a button handler. For headless tests, launch Chromium with `--autoplay-policy=no-user-gesture-required` `[TESTED]`.

### 6.3 Raw Web Audio (no library): the smallest reliable audio-reactive path

```js
// [UNVERIFIED in this run — standard Web Audio API]
let analyser, bins;
async function startAudio() {                       // call from a click handler
  const ctx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });  // or an <audio> element source
  const src = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.8;
  src.connect(analyser);                             // do NOT connect mic to destination (feedback)
  bins = new Uint8Array(analyser.frequencyBinCount);
}
function draw() { if (analyser) { analyser.getByteFrequencyData(bins); /* 0..255 */ } }
```

Prefer raw Web Audio when you only need analysis. That skips the ~230 KB p5.sound + Tone bundle and the API churn.

### 6.4 Tone.js

Tone 15.1.22 is current. Use it directly for musical structure (Transport, Synths, Sequences): `await Tone.start()` in a gesture, then `const meter = new Tone.Meter(); synth.connect(meter)` and `new Tone.FFT(256)` / `Tone.Waveform` for analysis `[UNVERIFIED-this-run]`. p5.sound bundles its own Tone, so loading Tone separately alongside p5.sound probably creates a second context. Pick one: p5.sound for sketch-style sound, Tone for compositions. `setAudioContext()` exists for sharing a context `[SOURCE]`, but sharing was not tested.

### 6.5 Microphone

`mic = new p5.AudioIn(); mic.start(); mic.connect(amp)` needs https or localhost plus a permission. Headless with `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`, the mic started without error but `getLevel()` read 0 at sample time (the fake device beeps intermittently). Status: **partial / unverified signal** `[TESTED-inconclusive]`.

---
