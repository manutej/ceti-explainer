#!/usr/bin/env python3
"""ds_bundle.py: build arsenal/ds-bundle/, a Claude Design design-system bundle of the arsenal.
One preview page per brand pack (roles, OKLCH-free hex ramps, type roles, a sample count), one page per
pattern lane (its contact sheet), one for materials and chromes, plus tokens as JSON and CSS. Each preview's
first line carries the @dsCard marker the Design System pane indexes."""
import json, glob, os, re, shutil, html
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'arsenal', 'ds-bundle'); shutil.rmtree(OUT, ignore_errors=True)
for d in ('preview', 'tokens', 'img'): os.makedirs(os.path.join(OUT, d), exist_ok=True)
packs = []
for p in sorted(glob.glob(os.path.join(ROOT, 'arsenal/brands/*.json'))):
    if p.endswith('schema.json'): continue
    packs.append(json.load(open(p)))
def hexlerp(a, b, t):
    a = a.lstrip('#'); b = b.lstrip('#')
    if len(a) != 6 or len(b) != 6: return a
    ra, ga, ba = int(a[:2], 16), int(a[2:4], 16), int(a[4:], 16); rb, gb, bb = int(b[:2], 16), int(b[2:4], 16), int(b[4:], 16)
    return '#%02x%02x%02x' % (round(ra + (rb - ra) * t), round(ga + (gb - ga) * t), round(ba + (bb - ba) * t))
css_all = []
for pk in packs:
    c = pk['color']; ty = pk['type']; pid = pk['id']
    css = ':root[data-brand="%s"]{%s}' % (pid, ';'.join(f'--{k}:{v}' for k, v in c.items()))
    css_all.append(css)
    json.dump(pk, open(os.path.join(OUT, 'tokens', pid + '.json'), 'w'), indent=1)
    ramp = ''.join(f'<i style="background:{hexlerp(c["bg"], c["ink"], i/8)}"></i>' for i in range(9))
    ramp2 = ''.join(f'<i style="background:{hexlerp(c["bg"], c["accent"], i/8)}"></i>' for i in range(9))
    marks = ''.join(f'<b style="background:{c["accent"] if i < 38 else c["muted"]}"></b>' for i in range(100))
    page = f'''<!-- @dsCard group="Brands" name="{html.escape(pk.get("name", pid))}" -->
<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(pk.get("name", pid))}</title>
<style>body{{margin:0;background:{c["bg"]};color:{c["ink"]};font-family:"{ty["body"]["family"]}",system-ui,sans-serif;padding:28px 32px}}
.eb{{font-family:"{ty["mono"]["family"]}",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:{c["muted"]}}}
h1{{font-family:"{ty["disp"]["family"]}",serif;font-weight:{ty["disp"]["weight"]};font-size:40px;margin:4px 0 14px;line-height:1.05}}
.roles{{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin:10px 0 18px}}.roles div{{height:54px;border:1px solid {c["line"]};border-radius:4px;display:flex;align-items:flex-end;padding:4px 6px;font-family:"{ty["mono"]["family"]}",monospace;font-size:10px}}
.ramp{{display:flex;height:22px;margin:6px 0 14px}}.ramp i{{flex:1}}.marks{{display:grid;grid-template-columns:repeat(25,1fr);gap:3px;width:420px;margin:8px 0}}.marks b{{height:10px;display:block;border-radius:1px}}
.big{{font-family:"{ty["disp"]["family"]}";font-weight:{ty["disp"]["weight"]};font-size:72px;line-height:1}}.mono{{font-family:"{ty["mono"]["family"]}",monospace}}
.panel{{background:{c["panel"]};border:1px solid {c["line"]};border-radius:6px;padding:12px 14px;margin-top:14px;color:{c["chalk"]}}}</style></head><body>
<div class="eb">brand pack · {pid} · texture {pk.get("texture")} · tempo {pk.get("tempo", {}).get("ease")} {pk.get("tempo", {}).get("beat_s")} s</div>
<h1>{html.escape(pk.get("name", pid))}</h1>
<div class="roles">{''.join(f'<div style="background:{v};color:{c["ink"] if k in ("bg","panel","line") else c["bg"]}">{k}</div>' for k, v in c.items())}</div>
<div class="eb">ramp bg → ink</div><div class="ramp">{ramp}</div><div class="eb">ramp bg → accent</div><div class="ramp">{ramp2}</div>
<div class="eb">a count: 38 of 100</div><div class="marks">{marks}</div>
<div class="big">38 <span class="mono" style="font-size:22px;color:{c["muted"]}">÷ 100</span></div>
<div class="panel"><span class="eb">panel · chalk text</span><br>Display {ty["disp"]["family"]} {ty["disp"]["weight"]} · Mono {ty["mono"]["family"]} · Body {ty["body"]["family"]}</div>
</body></html>'''
    open(os.path.join(OUT, 'preview', f'brand-{pid}.html'), 'w').write(page)
open(os.path.join(OUT, 'tokens', 'brands.css'), 'w').write('\n'.join(css_all) + '\n')
# pattern lanes and materials: contact sheets as cards
try:
    from PIL import Image
    for sheet in sorted(glob.glob(os.path.join(ROOT, 'arsenal/patterns/*/shots/contact.png')) + glob.glob(os.path.join(ROOT, 'arsenal/materials/*/shots/contact.png'))):
        lane = sheet.split('/')[-3]; kind = 'Materials' if '/materials/' in sheet else 'Patterns'
        im = Image.open(sheet).convert('RGB'); w, h = im.size; nw = 1200; im = im.resize((nw, int(h * nw / w))); im.save(os.path.join(OUT, 'img', lane + '.jpg'), quality=70)
        card = os.path.join(os.path.dirname(os.path.dirname(sheet)), 'card.md'); title = lane; desc = ''
        if os.path.exists(card):
            t = open(card).read(); m = re.search(r'^#\s*(.+)$', t, re.M); title = m.group(1) if m else lane
            para = [l for l in t.split('\n') if l.strip() and not l.startswith(('#', '|', '-', '`'))]; desc = para[0][:300] if para else ''
        open(os.path.join(OUT, 'preview', f'{kind.lower()}-{lane}.html'), 'w').write(f'''<!-- @dsCard group="{kind}" name="{html.escape(title)}" -->
<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(title)}</title><style>body{{margin:0;background:#15161A;color:#EDE8DF;font-family:system-ui,sans-serif;padding:20px}}img{{width:100%;height:auto;border-radius:4px}}p{{color:#A39A89;font-size:14px;max-width:80ch}}.eb{{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#A39A89}}</style></head><body>
<div class="eb">arsenal · {kind.lower()} · {lane}</div><h2 style="margin:4px 0 8px">{html.escape(title)}</h2><p>{html.escape(desc)}</p><img src="../img/{lane}.jpg" alt="{html.escape(title)} contact sheet"></body></html>''')
    for m in glob.glob(os.path.join(ROOT, 'factory/kit2/proof/*-matrix.png')):
        name = os.path.basename(m).replace('-matrix.png', '')
        im = Image.open(m).convert('RGB'); w, h = im.size; nw = 1400; im = im.resize((nw, int(h * nw / w))); im.save(os.path.join(OUT, 'img', f'{name}-matrix.jpg'), quality=70)
        open(os.path.join(OUT, 'preview', f'proof-{name}-matrix.html'), 'w').write(f'''<!-- @dsCard group="Brand switch proof" name="{name} under 4 brands × 4 chromes" -->
<!doctype html><html><head><meta charset="utf-8"><title>{name} matrix</title><style>body{{margin:0;background:#15161A;color:#EDE8DF;font-family:system-ui;padding:20px}}img{{width:100%}}</style></head><body><h2>{name}: the same film under four brands and four chromes, zero film edits</h2><img src="../img/{name}-matrix.jpg"></body></html>''')
except Exception as e:
    print('sheet cards skipped:', e)
if os.path.exists(os.path.join(ROOT, 'factory/chromes/preview.png')):
    shutil.copy(os.path.join(ROOT, 'factory/chromes/preview.png'), os.path.join(OUT, 'img', 'chromes.png'))
    open(os.path.join(OUT, 'preview', 'chromes.html'), 'w').write('''<!-- @dsCard group="Chromes" name="Tender set, ledger, memo" -->
<!doctype html><html><head><meta charset="utf-8"><title>Chromes</title><style>body{margin:0;background:#15161A;color:#EDE8DF;font-family:system-ui;padding:20px}img{width:100%}</style></head><body><h2>Three exec-clean chromes: tender set, ledger, memo</h2><img src="../img/chromes.png"></body></html>''')
open(os.path.join(OUT, 'README.md'), 'w').write(f'''# CETI Explainer Arsenal · design-system bundle

Generated by arsenal/tools/ds_bundle.py from the plugin repo (manutej/ceti-explainer, branch feature/explainer-atelier).
{len(packs)} brand packs (tokens/*.json, tokens/brands.css), one preview card per pack, one card per arsenal pattern and
material lane (contact sheets), the chromes, and the kit2 brand-switch proof matrices. Every pack passed
arsenal/tools/brand_check.py (WCAG contrast; faces vendored). Regenerate: `python3 arsenal/tools/ds_bundle.py`.
''')
print('bundle:', OUT, '|', len(packs), 'packs |', len(glob.glob(os.path.join(OUT, 'preview', '*.html'))), 'previews')
