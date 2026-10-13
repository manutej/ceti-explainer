# PROBE: headless GL backend (SwiftShader vs Mesa llvmpipe)

Question (Research A section 5): is Mesa llvmpipe materially faster than Chromium's SwiftShader for the heavy WebGL patterns?
Answer: **No. Do not adopt.** Keep the current launch args (default SwiftShader).

## Setup
- Box: 4 vCPU, Ubuntu 24.04, Mesa 25.2.8, llvmpipe (LLVM 20.1.2). Chromium 1194 via Playwright.
- Probe = a copy of `arsenal/tools/shoot.mjs` (tools untouched) with `headless` and `args` taken from env, 960x540 @2x, 4 seeks per variant. ms_per_frame = mean seek time as printed by shoot.mjs (screenshot time excluded).
- Demos: `webgl-scene/demo.html` variant `fly-through`, `gl-ribbons/demo.html?only=sankey-multistage`.
- 3 interleaved repetitions per cell. CAVEAT: the machine was shared with other running agent renders (load average 11-15 on 4 cores the whole time), so absolute ms are inflated and noisy (the same default config ranged 66-185 ms and 298-367 ms). Read min and median as order of magnitude only.
- Install facts: `Xvfb`, `libgl1-mesa-dri`, `libglx-mesa0` were already present. `apt-get update` and install work through the proxy (no network issue). `libEGL.so.1` / `libegl-mesa0` were missing and were added (`apt-get install libegl1 libegl-mesa0 libgles2`); without libEGL, `--use-angle=gl` reports "NO GL". This is a system change on this box only.

## Which renderer each arg set really selects (WEBGL_debug_renderer_info)
| args | env | renderer |
|---|---|---|
| (none, current) | | SwiftShader (Vulkan, Subzero) |
| `--use-gl=egl --use-angle=swiftshader` | | SwiftShader |
| `--enable-unsafe-swiftshader` | | SwiftShader |
| `--ignore-gpu-blocklist --enable-gpu-rasterization` | | SwiftShader |
| `--use-angle=gl` (alone) | Xvfb, LIBGL_ALWAYS_SOFTWARE=1 | NO GL (blocklisted) |
| `--use-angle=gl --ignore-gpu-blocklist` | Xvfb :77 1280x720x24, LIBGL_ALWAYS_SOFTWARE=1 | llvmpipe (OpenGL 4.5) |
| `--use-angle=gl-egl --ignore-gpu-blocklist` | no X needed, LIBGL_ALWAYS_SOFTWARE=1 | llvmpipe (OpenGL ES 3.2) |
| `--use-angle=gles`, `--use-gl=egl` (+blocklist flag) | | SwiftShader (silent fallback) |

## Results
ms/frame as min / median of 3. Pixel diff = t=1/3 still vs default, Pillow mean abs diff (0-255 per channel), with the share of channel values off by more than 32 in brackets. Left value is webgl-scene, right value is gl-ribbons.

| backend | webgl-scene fly-through | gl-ribbons sankey-multistage | purity (re-seek) | pixel diff vs baseline |
|---|---|---|---|---|
| A default (baseline) | 66 / 69 | 298 / 337 | identical (both) | reference; run-to-run diff 0.000 |
| B `--use-gl=egl --use-angle=swiftshader` | 71 / 83 | 222 / 241 | identical | 0.000 / 0.000 |
| C `--enable-unsafe-swiftshader` | 52 / 68 | 236 / 267 | identical | 0.000 / 0.000 |
| D `--ignore-gpu-blocklist --enable-gpu-rasterization` | 67 / 74 | 238 / 316 | identical | 0.000 / 0.000 |
| E llvmpipe `--use-angle=gl --ignore-gpu-blocklist` (Xvfb) | 77 / 181 | 245 / 270 | identical | 0.085 (0.002%) / 0.071 (0.056%) |
| F llvmpipe `--use-angle=gl-egl --ignore-gpu-blocklist` (headless) | 369 / 377 | 374 / 462 | identical | 0.086 / 0.071 |
| G F + `--enable-gpu-rasterization` | 273 / 312 | 365 / 443 | identical | 0.086 / 0.071 |

Every run: 0 console errors, purity "identical" in 42 of 42 reports.

## Reading
- SwiftShader variants (A-D) are pixel-identical to each other; B/C/D change nothing measurable beyond noise.
- llvmpipe is NOT several times faster here. E (Xvfb) ties the baseline on gl-ribbons (245 vs 298 min, inside noise) and is no better on webgl-scene (77 min, 181 median). The headless gl-egl path (F, G) is 4-5x slower on webgl-scene and about 1.3x slower on gl-ribbons. A plausible cause is that llvmpipe spawns 4 rasteriser threads that suffer most on a shared box; I could not test on an idle machine, so a speed-up there is not excluded, but there is no evidence for one.
- llvmpipe output differs slightly from SwiftShader (MAD about 0.07-0.09, a few edge pixels over 32). Fine for visual checks but not byte-identical, so adopting it would invalidate stored baseline stills/hashes and mix two renderers across the catalogue.
- Adopting it also needs Xvfb (E) or extra system packages libegl1/libegl-mesa0 (F): new environment dependencies for no gain.

## Recommendation
Do **not** change `arsenal/tools/shoot.mjs`, `factory/tools/gate.mjs` or `factory/tools/frames.mjs` (`arsenal/tools/sweep.mjs` already passes `--use-gl=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`). The lever for render time is fewer or cheaper frames, not the backend. If revisited on an idle machine, rerun with:

```
# E (needs Xvfb :77 -screen 0 1280x720x24)
DISPLAY=:77 LIBGL_ALWAYS_SOFTWARE=1  args: ['--use-angle=gl','--ignore-gpu-blocklist']
# F (no X; needs libegl1 + libegl-mesa0)
LIBGL_ALWAYS_SOFTWARE=1              args: ['--use-angle=gl-egl','--ignore-gpu-blocklist']
```

Probe scripts (outside the repo): `/tmp/claude-0/-home-user/6930f3f9-c0aa-53bb-b023-bfc602f4df5e/scratchpad/glprobe/` (shoot-probe.mjs, bench.sh, results.txt).
