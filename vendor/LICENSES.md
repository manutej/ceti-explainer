# Third-party files in vendor/

Everything here is copied byte-for-byte from upstream releases and pinned by `SHA256SUMS`
(check with `cd vendor && sha256sum -c SHA256SUMS`). Do not edit these files; replace them with a new pinned release.

| Path | What | Licence | Upstream |
|---|---|---|---|
| `p5-2.3.4.min.js` | p5.js 2.3.4, minified (990,638 bytes, sha256 `bb8b82b9…ce559`) | GNU LGPL 2.1, text in `licenses/p5-LGPL-2.1.txt` | npm `p5@2.3.4/lib/p5.min.js` (jsDelivr: `https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js`) |
| `fonts/*.woff2`, `fonts/*.woff` | Latin subsets of 15 families (see `fonts.lock.json`) | SIL Open Font License 1.1, one `fonts/OFL-<family>.txt` per family | Fontsource packages (`@fontsource/<family>`), which repackage Google Fonts releases |

## p5.js and the LGPL

p5.js is distributed under the LGPL 2.1. Built film pages inline this exact, unmodified file (or load it from jsDelivr
in the `.artifact.html` fragment). A page therefore contains the library in a form the recipient can replace: it sits in
its own `<script data-atelier="p5">` block (Atelier pages) or its own `<script>` block (feature and plan pages), separate
from our code. Keep it that way: do not minify, bundle or patch p5 together with our sources.

## Fonts

`fonts.lock.json` lists, for every file: the CSS family the builds declare, file, weight, style, format, sha256, and the
`usWeightClass` and italic bit read from the file itself (so a declared weight can be checked against the file).
The three OFL texts that came with the sources (Fraunces, Barlow, IBM Plex Mono) are kept verbatim; the others carry the
copyright line from the font's own name table (nameID 0) followed by the standard OFL 1.1 text.

Sources of the files: the seven CETI faces (Fraunces italic 300/400, DM Sans 400/500/600, Space Mono 400/700) from the
`p5-explainer` skill assets; 19 material faces from the Atelier module library (`modules/fonts/`); the eight Escapement
WOFF files (Barlow, Barlow Semi Condensed, IBM Plex Mono) from `chromes/escapement/fonts/`.
