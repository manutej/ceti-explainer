#!/usr/bin/env python3
"""gallery.py: write factory/gallery.html, the index of published films and the documentation behind them.

    python3 factory/tools/gallery.py            # writes factory/gallery.html
    python3 factory/tools/gallery.py --check    # exit 1 if the file on disk differs from a fresh render

Inputs: factory/catalogue.json (id, title, eyebrow, dur, takeaway, gate verdict) and factory/ARTIFACTS.md
(id → artifact link; the "## Arsenal gallery" and "## Showcase film" sections). The page is static, fetches
nothing, and is published as the film gallery artifact (ARTIFACTS.md "Gallery:" line). Films without a link in
ARTIFACTS.md are listed without a card link so the gap is visible.
"""
import argparse, json, re, sys, html, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CAT = ROOT / 'factory' / 'catalogue.json'
ART = ROOT / 'factory' / 'ARTIFACTS.md'
OUT = ROOT / 'factory' / 'gallery.html'

DOCS = [
    ('p5.js 2.x documentation (the atlas)', 'references/atlas/pages/index.md', '300 cited pages, five hubs; reader at references/atlas/atlas.html'),
    ('need → page → module index', 'skills/atelier-draft/references/p5-index.md', 'two hops from a visual need to the atlas page and the arsenal module'),
    ('the arsenal', 'arsenal/README.md', '24 lanes with cards, demos, contact sheets; chain recipes in skills/atelier-draft/references/chain-recipes.md'),
    ('the kit', 'factory/kit2/README.md', 'film.json, the K API, WebGL, knobs, libs'),
    ('the format and the laws', 'factory/FORMAT.md', 'with CLAUDE.md and docs/DECISIONS.md'),
    ('the pipeline', 'factory/PIPELINE.md', 'draft ×3 → select → fix ×2 → ship; skills under skills/atelier-*'),
    ('the skills', 'skills/ATELIER.md', 'brief, draft, select, pipeline, variant'),
]


def links_from_artifacts(text):
    rows = {}
    for m in re.finditer(r'^\|\s*([a-z0-9-]+)[^|]*\|\s*([^|]*?)\s*\|\s*(https://claude\.ai/artifact/\S+)\s*\|', text, re.M):
        rows[m.group(1)] = (m.group(2).strip(), m.group(3).strip())
    extra = {}
    for key, pat in (('arsenal', r'## Arsenal gallery\s*\n+.*?(https://claude\.ai/artifact/\S+)'),
                     ('showcase', r'## Showcase film\s*\n+.*?(https://claude\.ai/artifact/\S+)'),
                     ('gallery', r'^Gallery:\s*(https://claude\.ai/artifact/\S+)')):
        m = re.search(pat, text, re.S | re.M)
        if m: extra[key] = m.group(1)
    return rows, extra


def render():
    cat = json.loads(CAT.read_text())
    rows, extra = links_from_artifacts(ART.read_text())
    films = sorted(cat['films'], key=lambda f: f['id'])
    e = html.escape
    cards = []
    for f in films:
        link = rows.get(f['id'], (None, None))[1]
        verdict = (f.get('gate') or {}).get('verdict', '?')
        head = f'<div class="eb">{e(f["id"])} · {int(f["dur"])} s · gate {e(verdict)}</div><h2>{e(f["title"])}</h2><p>{e(f.get("takeaway") or f.get("eyebrow") or "")}</p>'
        if link:
            cards.append(f'<a class="card" href="{e(link)}" target="_blank" rel="noopener">{head}</a>')
        else:
            cards.append(f'<div class="card unlinked">{head}<p class="note">not yet published</p></div>')
    extras = []
    if 'showcase' in extra:
        extras.append(f'<a class="card" href="{e(extra["showcase"])}" target="_blank" rel="noopener"><div class="eb">showcase · feature</div><h2>The Wiring and the Whole</h2><p>Why one repository is worth funding, shown not told.</p></a>')
    if 'opera-house' in rows:
        extras.append(f'<a class="card" href="{e(rows["opera-house"][1])}" target="_blank" rel="noopener"><div class="eb">gold standard · 269 s</div><h2>The Opera House</h2><p>Case file 23, the planning fallacy. The exec-room film every case is derived from.</p></a>')
    if 'arsenal' in extra:
        extras.append(f'<a class="card" href="{e(extra["arsenal"])}" target="_blank" rel="noopener"><div class="eb">arsenal</div><h2>Pattern and material gallery</h2><p>Contact sheets of every lane and the kit2 brand-by-chrome matrices.</p></a>')
    docs = ''.join(f'<tr><td>{e(a)}</td><td><code>{e(b)}</code></td><td>{e(c)}</td></tr>' for a, b, c in DOCS)
    n = len(films)
    today = datetime.date.today().isoformat()
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Explainer Factory Films</title>
<style>
:root{{--bg:#F6F3EC;--ink:#1B1B1F;--muted:#5E5B55;--accent:#9A5214;--panel:#FBF9F4;--line:rgba(27,27,31,.15)}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#15161A;--ink:#EDE8DF;--muted:#A39A89;--accent:#E0B27A;--panel:#1E1F25;--line:rgba(237,232,223,.18)}}}}
:root[data-theme="dark"]{{--bg:#15161A;--ink:#EDE8DF;--muted:#A39A89;--accent:#E0B27A;--panel:#1E1F25;--line:rgba(237,232,223,.18)}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.45}}
.wrap{{max-width:1120px;margin:0 auto;padding:40px 16px 64px}}
.eb{{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font-family:Georgia,serif;font-style:italic;font-weight:300;font-size:clamp(30px,5vw,46px);margin:6px 0 10px;line-height:1.08}}
h3{{font-family:Georgia,serif;font-weight:400;font-size:22px;margin:36px 0 12px}}
.lede{{max-width:70ch;color:var(--muted);margin:0 0 28px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}}
.card{{display:block;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:16px 18px;color:inherit;text-decoration:none}}
a.card:hover{{border-color:var(--accent)}}
.card h2{{font-family:Georgia,serif;font-weight:400;font-size:21px;margin:6px 0 8px;color:var(--accent)}}
.card p{{margin:0;font-size:13.5px;color:var(--muted)}}
.card.unlinked{{opacity:.7}} .note{{margin-top:8px!important;font-style:italic}}
table{{border-collapse:collapse;width:100%;font-size:14px}} td{{padding:8px 10px;border-top:1px solid var(--line);vertical-align:top}} code{{font-family:ui-monospace,Menlo,monospace;font-size:12.5px}}
.foot{{margin-top:32px;font-size:13px;color:var(--muted);max-width:80ch}}
</style></head><body><div class="wrap">
<div class="eb">CETI · the explainer factory · {today}</div>
<h1>{n} films, the showcase, and the one they were built from</h1>
<p class="lede">Each film: a hook, a sealed guess, one real case with sourced numbers, the mechanism counted as marks before any ratio appears, a Monday question, a CETI card. Silent; captions carry it. Every digit on screen is a claim the gate recomputes. Click a card to open the film; press play, seal a number when asked.</p>
<div class="grid">{''.join(cards)}</div>
<h3>Longer forms and the arsenal</h3>
<div class="grid">{''.join(extras)}</div>
<h3>Documentation behind the films (in the repository)</h3>
<table>{docs}</table>
<p class="foot">Built by factory/tools/gallery.py from manutej/ceti-explainer, branch feature/explainer-atelier (factory/catalogue.json and factory/ARTIFACTS.md). Each film page is standalone: p5 2.3.4 and the fonts are embedded, nothing is fetched. These artifacts are private until shared.</p>
</div></body></html>
'''


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--check', action='store_true'); a = ap.parse_args()
    page = render()
    if a.check:
        same = OUT.exists() and OUT.read_text() == page
        print('gallery.html', 'SAME' if same else 'DIFFERS'); sys.exit(0 if same else 1)
    OUT.write_text(page); print(f'wrote {OUT.relative_to(ROOT)} ({len(page)} bytes, {len(json.loads(CAT.read_text())["films"])} films)')


if __name__ == '__main__':
    main()
