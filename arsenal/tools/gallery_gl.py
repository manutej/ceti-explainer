#!/usr/bin/env python3
"""gallery_gl.py: write arsenal/gallery-gl.html, the contact-sheet gallery of Wave GL (13 lanes).

    python3 arsenal/tools/gallery_gl.py            # writes arsenal/gallery-gl.html (images referenced as shots/<id>.png)

Publish with the Artifact tool, mapping shots/<id>.png to arsenal/patterns/<id>/shots/contact.png. Reads each lane's
card.md first line (title) and its "s/frame" lines for the cost column; nothing is fetched at runtime.
"""
import re, html, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LANES = ['gl-instances', 'gl-stack-city', 'track-unit', 'gl-camera-rig', 'gl-labels', 'gl-post', 'uncertainty-hop',
         'formula-bind', 'scale-anchor', 'gl-heightfield', 'gl-volume', 'gl-ribbons', 'gl-pointcloud']
GROUP = {'gl-instances': 'the population at true scale', 'gl-stack-city': 'the reversal, same marks new partition',
         'track-unit': 'the reversal, flat and evidence-first', 'gl-camera-rig': 'the move is the argument',
         'gl-labels': 'labels that hold still', 'gl-post': 'the reveal as a moment', 'uncertainty-hop': 'uncertainty before the commit',
         'formula-bind': 'the formula computes on screen', 'scale-anchor': 'one unit to 100,000', 'gl-heightfield': 'a matrix as terrain',
         'gl-volume': 'a distribution with a cut', 'gl-ribbons': 'a flow in depth', 'gl-pointcloud': 'a scatter with depth'}


def lane(id_):
    card = (ROOT / 'arsenal' / 'patterns' / id_ / 'card.md').read_text().splitlines()
    title = re.sub(r'^#\s*', '', card[0]).strip()
    cost = next((l.strip('- ').strip() for l in card if re.search(r's/frame|ms/frame', l) and len(l) < 160), '')
    return title, cost


def render():
    e = html.escape
    cards = []
    for id_ in LANES:
        title, cost = lane(id_)
        cards.append(f'''<section class="lane"><div class="eb">{e(GROUP[id_])}</div><h2>{e(title)}</h2>
<a href="shots/{id_}.png" target="_blank" rel="noopener"><img src="shots/{id_}.png" alt="{e(id_)} contact sheet" loading="lazy"></a>
<p class="meta">card: arsenal/patterns/{id_}/card.md · seat: arsenal/SEATS-GL.md</p></section>''')
    today = datetime.date.today().isoformat()
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave GL Gallery</title>
<style>
:root{{--bg:#F6F3EC;--ink:#1B1B1F;--muted:#5E5B55;--accent:#9A5214;--panel:#FBF9F4;--line:rgba(27,27,31,.15)}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#15161A;--ink:#EDE8DF;--muted:#A39A89;--accent:#E0B27A;--panel:#1E1F25;--line:rgba(237,232,223,.18)}}}}
:root[data-theme="dark"]{{--bg:#15161A;--ink:#EDE8DF;--muted:#A39A89;--accent:#E0B27A;--panel:#1E1F25;--line:rgba(237,232,223,.18)}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.45}}
.wrap{{max-width:1240px;margin:0 auto;padding:40px 16px 64px}}
.eb{{font-family:ui-monospace,Menlo,monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}}
h1{{font-family:Georgia,serif;font-style:italic;font-weight:300;font-size:clamp(30px,5vw,46px);margin:6px 0 10px;line-height:1.08}}
.lede{{max-width:78ch;color:var(--muted);margin:0 0 28px}}
.lane{{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:16px 18px;margin:0 0 18px}}
.lane h2{{font-family:Georgia,serif;font-weight:400;font-size:21px;margin:4px 0 10px;color:var(--accent)}}
.lane img{{width:100%;height:auto;display:block;border-radius:3px;background:#111}}
.meta{{margin:8px 0 0;font-size:13px;color:var(--muted);font-family:ui-monospace,Menlo,monospace}}
.foot{{margin-top:32px;font-size:13px;color:var(--muted);max-width:80ch}}
</style></head><body><div class="wrap">
<div class="eb">CETI · the arsenal · Wave GL · {today}</div>
<h1>Thirteen lanes that move the films to the frontier</h1>
<p class="lede">Each sheet is one lane's variants at four times on the pure clock, rendered headless and checked for identical re-seek. Eight are WebGL lanes (instanced marks at 100k, terrain, ribbons, point clouds, the stack city, a camera rig, a post stack, volumes, a label solver); four are the flat moves the comprehension evidence favours (uncertainty as motion, formula binding, following one unit, the human-scale anchor). The research behind the choice is in arsenal/frontier/; the seats in arsenal/SEATS-GL.md.</p>
{''.join(cards)}
<p class="foot">Built by arsenal/tools/gallery_gl.py from manutej/ceti-explainer, branch feature/explainer-atelier. Every lane is a pure module (arsenal/BRIEF.md) with a card citing the p5.js atlas; brand colours come from token roles, so every sheet also exists under a light pack (shots/swiss-grid/).</p>
</div></body></html>
'''


if __name__ == '__main__':
    out = ROOT / 'arsenal' / 'gallery-gl.html'; out.write_text(render()); print(f'wrote {out.relative_to(ROOT)} ({out.stat().st_size} bytes)')
