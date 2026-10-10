---
name: atelier-variant
description: "Make a VARIANT of a finished factory film with zero film edits: a client-branded version (any of the 22 brand packs or a tweak.py derivative matching a client's hex, dark or light twin, mono, warmer or cooler), a different chrome (tender-set, ledger, memo, none), a material or level change, and the planned cuts (9:16 reel, LinkedIn cut). Builds with kit2, gates, shoots a contact sheet, seats the BRAND not the film, records the look. Use for 'rebrand this film for <client>', 'make a dark version', 'match our accent colour', 'client-branded versions', 'swap the chrome', 'social cut of X', 'portrait reel', 'brand matrix', or the P3 kind of test. Not for changing what the film says (that is atelier-draft on a new brief)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` and the laws in `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md`. The film's
> sources are never edited here; only packs, chromes, materials, levels and cut parameters. No git from this skill.

# atelier-variant · finished film → faithful variant

The category: **the same claims and motion under a different design system or frame, judged on whether the
brand holds, not on whether the film works (it already passed).** Instances differ in pack, chrome, material,
level and cut; the procedure and the checks do not.

## Typed slots

```
Film:      factory/films/<id>/  (gate PASS, look recorded in film.json)
Ask:       {kind: brand|chrome|material|level|cut, spec: str}            // "match #1F6FEB", "dark twin", "ledger chrome", "9:16"
Pack:      PackId | path to a derived pack (arsenal/brands/derived/ or factory/films/<id>/brand.<id>.json)
Transforms: list[tweak.py flags]                                          // references/tweak-recipes.md
Look:      {brand, chrome, material, level, renderer}
Page:      build/<id>.<brand>.<chrome>.html
Checks:    brand_check.py (contrast) → build → gate --quick → contact sheet at 3 beat times → brand seat
Seat:      {pack, bg, roles honoured: list, pins legible: bool, reveal reads: bool, verdict SHIP|REVISE, why}
Record:    factory/films/<id>/variants/<name>/{pack.json?, gate.json, contact.png, report.json, SEAT.md}
```

## Procedure

1. **Resolve the ask to a pack.** An existing id: use it. A client spec: derive with
   `python3 arsenal/tools/tweak.py <base> <transforms> --out <dir>` (recipes in `references/tweak-recipes.md`),
   check it with `python3 arsenal/tools/brand_check.py <pack>` (WCAG and vendored faces). A pack whose display face
   is not vendored non-italic needs a film-local copy with a vendored face (`brand.<id>.json` in the film dir; pass
   its path to build.py).
2. **Build and gate**: `python3 factory/kit2/build.py factory/films/<id> --brand <pack|path> --chrome <chrome>
   [--material m]`; `node factory/tools/gate.mjs <page> --film factory/films/<id> --kit factory/kit2 --quick --json
   <record>/gate.json`. Exec level refuses non-ink materials and textures (G10); do not fight it.
3. **Shoot the contact sheet** at the front view, the reveal and the card:
   `node arsenal/tools/shoot.mjs <page> --out <record> --times <f1,f2,f3>` with times as FRACTIONS of the duration
   (0.4, 0.69, 0.75 on a 75 s case). Keep contact.png and report.json; delete the full stills.
4. **Seat the brand** from the contact sheet: do the box or mark colours follow accent / accent2 / muted, do
   pins and captions stay legible on the new bg, does the reveal read (a glow on dark, plain on paper is by
   design), does the type role (disp / mono / body) carry. Verdict SHIP or REVISE with the role that fails.
5. **Record and hand back** (≤ 120 words): look, page bytes, gate verdict, seat verdict, the pack path, and
   whether the derived pack should be promoted to arsenal/brands/derived/.

## Rules

- Zero edits to film.js, film.json claims, captions or knobs; a variant that needs one is a new draft.
- A derived pack is named `<base>--<transforms>` and carries `voice.derived` (tweak.py does this).
- A 9:16 cut is not available until kit2 has a portrait basis (docs/PROTOTYPES.md P2); say so instead of cropping.

## References (read on demand)

- `references/brand-packs.md` — schema roles and what each drives, the 22 packs, twins, vendored faces, contrast gate.
- `references/tweak-recipes.md` — tweak.py transforms and recipes for the common client asks; shoot/sweep usage.
- `${CLAUDE_PLUGIN_ROOT}/factory/films/simpsons-3d/PROTOTYPE.md` §P3 — a measured brand switch to calibrate against.
