# tweak.py: recipes for client asks, naming, film-local packs, contact-sheet check

`python3 arsenal/tools/tweak.py <base> <transforms...> [--out DIR] [--print] [--force]` derives a pack in OKLCH, repairs
any contrast gate it broke (prints `NUDGED ...` with before and after), runs `brand_check.py`, and writes
`arsenal/brands/derived/<id>.json` only if it passes (`--force` writes a failing pack for inspection; never ship one).
`<base>` is a pack id (searched in `arsenal/brands/`, then `derived/`) or a path. Run from the repo root. Transforms run
left to right: order is meaningful. Use `--out <scratch dir>` for client work so the shared derived/ folder stays clean.
Piping the output to `head` raises BrokenPipe after the file is written; ignore it.

## Transforms
| flag | effect | id token |
|---|---|---|
| `--hue <deg>` | rotate accent, accent2 and the tinted neutrals; L and C kept, so contrast is unchanged. `--hue-accents-only` keeps ground, ink, panel, muted where they are | `hue40`, `huem30` |
| `--dark` / `--light` | perceptual twin (grounds by lightness inversion; foregrounds re-solved to the same WCAG ratio). No-op if already that side; not both | `dark`, `light` |
| `--contrast <n>` | ink/chalk 0.03 L per step, accents 0.04, muted 0.02, away from the ground (+n) or toward it (-n). Negatives: `--contrast=-3` | `c2`, `cm3` |
| `--accent <hex>` | set accent exactly; accent2 = its complement (h + 180) at matched L and C; re-derived again if the accent is nudged | `acc0a7b5c` (hex without `#`) |
| `--mono` | neutrals chroma x 0.15, accent keeps its chroma, accent2 becomes a grey | `mono` |
| `--type d/m/b` | swap faces: `Family[:weight][:italic]`, `_` keeps a role; only faces in the lock | `typejost`, `typejostnewsreader` (first word of each changed family, role order) |
| `--tempo <x>` | beat_s times x, capped at the schema's 10 | `tempo1p5` |
| `--texture <name>` | `paper`, `none`, `grain`, `halftone` | the name |
| `--matrix` | write the opposite-side twin of every pack in `arsenal/brands/` to derived/, plus its README and packs.js | `<id>--dark` / `--light` |
| `--fonts` | list families and weights available for `--type` | none |
Gates repaired by nudging lightness (hue and chroma fixed): ink/bg 4.5, chalk/panel 4.5, accent/bg 3, muted/bg 3.
accent2/bg is not gated, so look at the second voice yourself.

## Naming derived packs
`<base>--<token>-<token>...` in the order the flags were given: `ceti-dark--light-acc2255ff-paper-typenewsreader`. A base
that already contains `--` just gets `-<tokens>` appended, so derived packs chain (`...--light-acc2255ff-hue20`). Provenance
goes in `voice.derived {from, transforms}` and the `name` gains `[...]`. Id rule: lowercase letters, digits, hyphens; the id
must equal the file stem. Collisions: `--hue 20` and `--hue 20 --hue-accents-only` write the same id; the second overwrites
the first, so use `--out` or run one at a time. A client pack gets a client id by editing `id` and `name` in the copy (keep
`voice.derived`), for example `acme-light`; a distinct id also keeps built page names apart.

## Recipes for the common asks
1. Match a hex accent: `tweak.py <closest base> --accent '#RRGGBB'`. Choose the base by ground first (client website dark or
   light?). Read the output: if `NUDGED accent` appears the exact hex failed 3:1 on that ground and was moved in lightness;
   tell the client the final hex, or switch ground (`--light --accent ...`). accent2 is the complement: if the client has a
   second brand colour, edit accent2 by hand in the film-local copy and re-check.
2. Go dark: `tweak.py <light base> --dark` (or take `derived/<base>--dark.json`). Add `--accent` after it to restore a client colour.
3. Go light: `tweak.py <dark base> --light` (or `derived/<base>--light.json`). For a handout, add `--texture paper`.
4. Mono (one colour on screen): `tweak.py <base> --accent '#hex' --mono` (accent set, then everything else greys; accent2
   grey). Reversed order (`--mono --accent`) brings the complement back.
5. Warmer or cooler: rotate by the shortest way toward the target hue. Read the accent's OKLCH hue:
   `python3 -c "import sys;sys.path.insert(0,'arsenal/tools');import tweak;print(tweak.hex_to_lch('#E0B27A'))"` prints
   (L, C, h). Warm = h 30-90 (red to amber), cool = h 200-260 (cyan to blue). Gold at h 71 warmer: `--hue -20`; cooler:
   `--hue 130`. Small moves (10-30 deg) read as a temperature change; large moves are a new brand. `--hue-accents-only` keeps
   the ground for a client who owns the ground.
6. Change tempo: `--tempo 0.6` faster (social cuts), `--tempo 1.5` slower (reflective). Packs with `beat_s` only steer arsenal
   modules; kit2 films are hand-timed, so for film pace use the film's knobs, not the pack.
7. Swap faces inside the vendored set: `--type 'Jost:700/_/Newsreader'` (disp, mono, body). `--type 'Foo/_/_'` prints
   the families. Italic-only faces need `:italic` and their exact weight (`Fraunces:300:italic`, `Cormorant Garamond:500:italic`).
   Check the contact sheet: wider faces are shrunk to the floors and may crowd.
8. Brighter projector or phone in sunlight: `--contrast 3`. Quieter register: `--contrast=-3 --tempo 1.6`.
9. The whole matrix: `tweak.py --matrix` (22 twins + README + packs.js); re-run after changing a base pack.
10. Chain: `tweak.py ceti-dark --light --accent '#2255ff' --texture paper --type '_/_/Newsreader'`, then
    `tweak.py ceti-dark--light-acc2255ff-paper-typenewsreader --hue 20` (accent before hue rotates the accent you set).
After any recipe: `python3 arsenal/tools/brand_check.py <file>` (needs file stem = id), then build and look.

## Where a film-local pack lives, and why
Put a client or hand-edited pack at `factory/films/<film-id>/brand.<pack-id>.json` (precedent: wiring-and-the-whole). Keep the
shared `arsenal/brands/` for the 22 library packs: `sweep.mjs`, packs.js, the palette demo and `--matrix` read every file
there. Reasons it is not referenced by id:
- `build.py --brand X` takes a path when X ends in `.json` (relative to the cwd, so run from the repo root), otherwise it
  loads `arsenal/brands/X.json` only. Derived twins and film-local packs are therefore passed by path. The page name uses the
  pack's internal `id`, not the file name.
- `apply_findings.py` rebuilds with film.json `look.brand`; if none is recorded it falls back to the id in the newest page's
  `<meta name="kit2">`, which then resolves to `arsenal/brands/<id>.json`: a different pack, or none. Record the path:
  `"look": {"brand": "factory/films/<film-id>/brand.<pack-id>.json", "chrome": "none", "material": "ink"}`.
  A `brand` finding can only name a library pack id (or `film`); swapping a film-local pack is an orchestrator decision.
- `brand_check.py` insists the id equals the file stem and `brand.<id>.json` does not match: check a copy named `<id>.json`
  in a scratch dir (or check the tweak output before copying it in). A brand-check pass on the copy is the gate.
Build: `python3 factory/kit2/build.py factory/films/<film-id> --brand factory/films/<film-id>/brand.<pack-id>.json --chrome none`
-> `factory/films/<film-id>/build/<film-id>.<pack-id>.none.html`. Give the pack its own id: the same id as a library pack
overwrites that pack's page. Commit the pack beside the film. To promote a pack to the library instead, follow
`arsenal/brands/README.md` "Add a pack" (file name = id, brand_check, regenerate packs.js, re-run `--matrix`).

## Contact-sheet check
Kit pages bake the brand in at build time (no `?brand=`), so loop build then shoot; the gate reads each build:
    for B in editorial-serif swiss-grid; do
      python3 factory/kit2/build.py factory/films/<id> --brand $B --chrome none
      node arsenal/tools/shoot.mjs factory/films/<id>/build/<id>.$B.none.html --out <scratch>/shots-$B --times 0.04,0.35,0.6,0.72,0.98
    done
`shoot.mjs --times` takes FRACTIONS of the duration, 0..1 (default `0,0.33,0.67,1`), not seconds: 0.4 on a 75 s film is 30 s.
Convert a reveal at 54.5 s to 54.5 / 75 = 0.727. Choose one still per beat: hook (0.04), mid case (0.35), mid count (0.6),
the reveal frame, the brand card (0.98, since the card holds the last 3 s). It writes stills `default-tSS.SS.png`,
`contact.png` (Pillow; one row per variant, half size) and `report.json` (console errors, purity identical or DIFF); exit
1 on any console error. `--query 'brand=<id>'` is appended to the page URL for arsenal demos that read it (a kit page ignores it).
Then gate each page: `node factory/tools/gate.mjs <page> --film factory/films/<id> --quick --kit factory/kit2/kit2.js --kit
factory/kit2/player.js` and for a full strip `node factory/tools/frames.mjs <page> --every 0.5 --out <scratch>`.
`arsenal/tools/sweep.mjs <demo.html> [--brands all|a,b] [--variant v] [--t seconds|mid] [--out dir]` is for arsenal demos, not
kit films: one variant at one time under every library pack (never derived or film-local) -> `sweep.png` (a row per
pack) and `sweep.json` (applied = the frame differs from the ceti-dark render and 2 of 4 corner pixels match the pack's bg).
Read the sheet as a brand judge: ground changed everywhere, accent marks still the point, second voice distinct, no label
lost on the new ground, glow or texture as the pack allows, card readable, no collision from a wider face.
