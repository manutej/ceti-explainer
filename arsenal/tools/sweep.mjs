// sweep.mjs <demo.html> [--brands all|a,b,c] [--variant v] [--t seconds|mid] [--out dir]
// Render ONE variant at ONE time under every brand pack in arsenal/brands/*.json (schema.json excluded).
// Pack injection, in order: (1) addInitScript pre-seeds window.ARSENAL.brands with every pack and shims fetch() for
// ../brands/<id>.json (file:// cannot fetch), (2) the page loads with ?brand=<id>&variant=<v>&t=<t>, (3) if the demo
// exposes __film.setBrand(pack) or __film.brand(pack) it is called. Writes <out>/sweep.png (one row per brand) and
// <out>/sweep.json (per brand: errors, applied, sampled corner pixels vs pack bg, via).
// applied = frame is not byte-identical to the ceti-dark render (a pack-blind demo draws that) AND at least 2 of 4 canvas-corner pixels are within RGB distance 28 of the pack's color.bg (texture tolerant).
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, mkdtempSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const html = resolve(args[0]);
const out = resolve(opt('--out', dirname(html) + '/shots'));
const brandsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../brands');
const allIds = readdirSync(brandsDir).filter(f => f.endsWith('.json') && f !== 'schema.json').map(f => f.slice(0, -5)).sort();
const packs = Object.fromEntries(allIds.map(id => [id, JSON.parse(readFileSync(`${brandsDir}/${id}.json`, 'utf8'))]));
const want = opt('--brands', 'all'); const ids = want === 'all' ? allIds : want.split(',');
const REF = 'ceti-dark'; const refAdded = !ids.includes(REF) && allIds.includes(REF); if (refAdded) ids.unshift(REF); // reference render: a demo that ignores the pack draws this
const tmp = mkdtempSync(tmpdir() + '/sweep-'); mkdirSync(out, { recursive: true });

const init = `(() => {
  const PACKS = ${JSON.stringify(packs)};
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  window.ARSENAL.brands = Object.assign(window.ARSENAL.brands || {}, PACKS);
  window.__sweepFetchHits = 0; const of = window.fetch.bind(window);
  window.fetch = (u, ...r) => { const m = String(u && u.url || u).match(/brands\\/([\\w-]+)\\.json/);
    if (m && PACKS[m[1]]) { window.__sweepFetchHits++; return Promise.resolve(new Response(JSON.stringify(PACKS[m[1]]), { headers: { 'content-type': 'application/json' } })); }
    return of(u, ...r); };
})();`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const result = { html, t: null, variant: null, brands: {} }; const rows = [];
for (const id of ids) {
  const r = { errors: [], applied: false, via: [], ok: false }; result.brands[id] = r;
  const pg = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
  pg.on('console', m => m.type() === 'error' && r.errors.push(m.text())); pg.on('pageerror', e => r.errors.push(String(e)));
  try {
    await pg.addInitScript(init);
    // probe variants/duration on a first plain load of this brand, then reload with the chosen query
    await pg.goto('file://' + html + '?brand=' + id, { waitUntil: 'load' });
    pg.setDefaultTimeout(45000);
    const rd = await Promise.race([pg.evaluate(() => window.__film.ready().then(() => 'ok')), new Promise(r => setTimeout(() => r('timeout'), 40000))]);
    if (rd !== 'ok') throw new Error('__film.ready() timed out (40s)');
    const info = await pg.evaluate(() => window.__film.info || {});
    const vars = info.variants || ['default'];
    // palette-style demos: the variant IS the brand
    const variantIsBrand = vars.includes(id);
    let v = opt('--variant', null) || (variantIsBrand ? id : vars[0]);
    if (variantIsBrand) r.via.push('variant=brand');
    const dur = info.dur || 4; const ts = opt('--t', 'mid');
    const t = ts === 'mid' ? +(dur / 2).toFixed(3) : +ts;
    result.t = t; result.variant = variantIsBrand && !opt('--variant', null) ? '(brand)' : v;
    const sw = await pg.evaluate(async ([pack]) => { const f = window.__film; const fn = f.setBrand || f.brand; if (typeof fn === 'function') { await fn.call(f, pack); return true; } return false; }, [packs[id]]);
    if (sw) r.via.push('__film.setBrand');
    await pg.evaluate(([v, t]) => window.__film.seek(t, v), [v, t]);
    const meta = await pg.evaluate(() => ({ hits: window.__sweepFetchHits, brand: (window.__film.info || {}).brand }));
    if (meta.hits) r.via.push('fetch-shim(' + meta.hits + ')'); else r.via.push('query/inline');
    r.film_brand = meta.brand || null;
    // pick the largest canvas
    const idx = await pg.evaluate(() => { const c = [...document.querySelectorAll('canvas')]; let bi = 0, ba = -1; c.forEach((e, i) => { const a = e.clientWidth * e.clientHeight; if (a > ba) { ba = a; bi = i; } }); return bi; });
    const fn = `${tmp}/${id}.png`; await pg.locator('canvas').nth(idx).screenshot({ path: fn });
    r.file = fn; r.ok = true;
  } catch (e) { r.errors.push('FATAL ' + String(e).slice(0, 300)); }
  await pg.close();
}
await b.close();

// sample corners + build contact sheet in one Pillow pass
const spec = { out, tmp, demo: basename(dirname(html)), t: result.t, variant: result.variant, brands: ids.map(id => ({ id, file: result.brands[id].file || null, bg: packs[id].color.bg, errors: result.brands[id].errors.length, via: result.brands[id].via.join(' + ') })) };
const py = `
import json,sys
from PIL import Image, ImageDraw, ImageFont
S=json.load(open(sys.argv[1]))
def hx(h):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
try: F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',13); FB=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',16)
except Exception: F=FB=ImageFont.load_default()
res={}; rows=[]
for b in S['brands']:
    r={'samples':[],'applied':False,'dist':None}
    if b['file']:
        im=Image.open(b['file']).convert('RGB'); w,h=im.size; m=6
        pts=[(m,m),(w-1-m,m),(m,h-1-m),(w-1-m,h-1-m)]
        bg=hx(b['bg']); ds=[]
        for p in pts:
            px=im.getpixel(p); d=sum((px[i]-bg[i])**2 for i in range(3))**.5; ds.append(d); r['samples'].append({'px':'#%02X%02X%02X'%px,'dist':round(d,1)})
        r['dist']=round(sorted(ds)[1],1); r['bgmatch']=sum(1 for d in ds if d<=28)>=2
        import hashlib; r['hash']=hashlib.sha1(im.tobytes()).hexdigest()
        r['sample']=r['samples'][0]['px']
    res[b['id']]=r; rows.append((b,r))
ref=res.get('ceti-dark',{}).get('hash')
for b,r in rows:
    r['same_as_ceti']=bool(ref and r.get('hash')==ref and b['id']!='ceti-dark')
    r['applied']=bool(r.get('bgmatch')) and not r['same_as_ceti']
cw=480; LW=230; ch=270
sheet=Image.new('RGB',(LW+cw,ch*len(rows)),(255,255,255)); d=ImageDraw.Draw(sheet)
for i,(b,r) in enumerate(rows):
    y=i*ch; d.rectangle([0,y,LW,y+ch],fill=(24,24,24))
    d.text((12,y+12),b['id'],font=FB,fill=(255,255,255))
    st='APPLIED' if r['applied'] else ('ERROR' if (b['errors'] or not b['file']) else 'NOT APPLIED')
    col={'APPLIED':(120,220,140),'NOT APPLIED':(255,170,80),'ERROR':(255,100,100)}[st]
    d.text((12,y+38),st,font=FB,fill=col)
    d.text((12,y+68),'pack bg '+b['bg'],font=F,fill=(200,200,200))
    d.text((12,y+88),'sample  '+(r.get('sample') or '-'),font=F,fill=(200,200,200))
    d.text((12,y+108),'dist    '+str(r['dist']),font=F,fill=(200,200,200))
    d.text((12,y+128),'errors  '+str(b['errors']),font=F,fill=(200,200,200))
    d.rectangle([12,y+156,12+90,y+156+40],fill=hx(b['bg']),outline=(120,120,120)); d.text((12,y+200),'pack bg',font=F,fill=(150,150,150))
    if r.get('sample'): d.rectangle([118,y+156,118+90,y+156+40],fill=hx(r['sample']),outline=(120,120,120)); d.text((118,y+200),'sampled',font=F,fill=(150,150,150))
    d.text((12,y+226),(b['via'] or '')[:34],font=F,fill=(140,140,140))
    if b['file']:
        im=Image.open(b['file']).convert('RGB'); im.thumbnail((cw,ch)); sheet.paste(im,(LW,y))
sheet.save(S['out']+'/sweep.png')
json.dump(res,open(sys.argv[1]+'.res','w'))
`;
writeFileSync(`${tmp}/spec.json`, JSON.stringify(spec)); writeFileSync(`${tmp}/sheet.py`, py);
execFileSync('python3', ['-I', `${tmp}/sheet.py`, `${tmp}/spec.json`]);
const res = JSON.parse(readFileSync(`${tmp}/spec.json.res`, 'utf8'));
let n = 0;
for (const id of ids) {
  const r = result.brands[id]; Object.assign(r, { applied: res[id].applied, bg_match: res[id].bgmatch, same_as_ceti_dark: res[id].same_as_ceti, bg_dist: res[id].dist, samples: res[id].samples, pack_bg: packs[id].color.bg });
  delete r.file;
  r.status = r.errors.length ? (r.ok ? 'error' : 'error') : (r.applied ? 'applied' : 'not applied');
  if (r.errors.length && r.ok) r.status = 'error'; if (r.status === 'error') n++;
}
result.sheet = `${out}/sweep.png`;
writeFileSync(`${out}/sweep.json`, JSON.stringify(result, null, 1));
console.log(JSON.stringify({ demo: spec.demo, t: result.t, variant: result.variant, brands: Object.fromEntries(ids.map(i => [i, result.brands[i].status + (result.brands[i].via.some(x => x.startsWith('fetch-shim')) ? ' (shim)' : '')])) }));
process.exit(n ? 1 : 0);
