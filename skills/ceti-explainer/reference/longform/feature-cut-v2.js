/* CETI Explainers — "Generative AI, explained simply" · v2 (tighter cut, 110s)
   Changes vs v1: −12s of lulls (reading −3.5s, scale −2.5s, writing −2s, intro −2s,
   prediction −2s), 1×/1.25×/1.5× playback chips, resume-from-last-position.
   Deterministic SVG timeline: every frame is a pure function of t. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const svg = $('#cv');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (RM) $('#rmnote').hidden = false;
const DUR = 110;

/* ---------- utils ---------- */
const clamp = (v,a,b) => v<a?a:(v>b?b:v);
const seg = (t,a,b) => clamp((t-a)/(b-a),0,1);
const eo  = p => 1 - Math.pow(1-p,4);                      /* ~ ease-glaser */
const eio = p => p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;  /* ~ ease-rest  */
const lerp = (a,b,p) => a+(b-a)*p;
let seed = 20260609;
const rng = () => { seed|=0; seed = seed+0x6D2B79F5|0; let z = Math.imul(seed^seed>>>15,1|seed); z = z+Math.imul(z^z>>>7,61|z)^z; return ((z^z>>>14)>>>0)/4294967296; };
function el(tag, attrs, parent){ const e = document.createElementNS(NS, tag); if(attrs) for(const k in attrs) e.setAttribute(k, attrs[k]); if(parent) parent.appendChild(e); return e; }
function txt(parent, str, attrs){ const e = el('text', attrs, parent); e.textContent = str; return e; }

/* CETI marketing tokens (mirrors colors_and_type.css --mk-*) */
const C = {
  bg:'#0F1320', card:'#1A1F2E', well:'#0B0E18',
  ink:'#F5EFE3', fog:'#B8B0A1',
  rule:'#2A3142', rule2:'#3A4458', track:'#232A3C',
  copper:'#A67756', sage:'#7A9171', peach:'#D88B5C',
  slate:'#324555', rust:'#8C4A2E', mist:'#95A8B0'
};

function build(){

/* ---------- defs & background ---------- */
const defs = el('defs', null, svg);
const gN = el('radialGradient', {id:'gN'}, defs);
el('stop', {offset:'0%','stop-color':'#AEC2A5'}, gN);
el('stop', {offset:'100%','stop-color':C.sage}, gN);
const gCu = el('radialGradient', {id:'gCu'}, defs);
el('stop', {offset:'0%','stop-color':'#C99B77'}, gCu);
el('stop', {offset:'100%','stop-color':C.copper}, gCu);
const gBG = el('radialGradient', {id:'gBG', cx:.5, cy:.34, r:.9}, defs);
el('stop', {offset:'0%','stop-color':'#161D31'}, gBG);
el('stop', {offset:'100%','stop-color':C.bg}, gBG);
const mk = el('marker', {id:'arr', viewBox:'0 0 10 10', refX:9, refY:5, markerWidth:7, markerHeight:7, orient:'auto-start-reverse'}, defs);
el('path', {d:'M0 0 L10 5 L0 10 z', fill:C.fog}, mk);

el('rect', {x:0, y:0, width:960, height:540, fill:C.bg}, svg);
el('rect', {x:0, y:0, width:960, height:540, fill:'url(#gBG)'}, svg);

/* ---------- the whale — sampled from whale-logo.svg (viewBox 600×360) ---------- */
const WPATHS = [
  {d:'M88 168 C 96 152, 118 138, 152 138 C 188 138, 220 148, 252 162 C 292 178, 332 192, 376 198 C 418 204, 456 206, 488 198 C 510 192, 524 184, 532 176', n:26},
  {d:'M88 168 C 92 158, 104 150, 124 148 C 156 144, 196 154, 240 168 C 286 184, 336 196, 388 200', n:14},
  {d:'M232 180 C 248 210, 280 232, 322 238 C 308 224, 290 208, 276 192', n:10},
  {d:'M488 198 C 512 198, 532 192, 548 178 C 562 166, 572 148, 572 130 C 558 138, 542 148, 528 158 C 540 152, 556 142, 568 126 C 552 132, 534 142, 518 154', n:16},
  {d:'M532 176 C 548 172, 562 162, 572 150', n:4}
];
const STREAKS = [
  ['M148 78 C 196 92, 250 122, 312 158',  C.copper, 2.2, .85],
  ['M168 86 C 222 102, 282 132, 348 168', C.sage,   1.8, .8 ],
  ['M188 92 C 246 110, 310 142, 380 178', C.peach,  2.4, .85],
  ['M210 98 C 270 116, 336 148, 410 184', C.slate,  1.4, .7 ],
  ['M232 104 C 292 122, 358 152, 434 186',C.copper, 1.2, .6 ],
  ['M256 110 C 314 126, 376 152, 452 184',C.sage,   1.6, .55],
  ['M280 116 C 332 130, 388 150, 462 178',C.mist,   1.0, .45]
];
const TF1 = {s:1.0,  tx:150, ty:28};
const TF7 = {s:0.62, tx:275, ty:245};
const ap = (tf,p) => ({x: p.x*tf.s + tf.tx, y: p.y*tf.s + tf.ty});

const base = [], segPairs = [];
{
  const probe = el('g', null, defs);
  WPATHS.forEach(wp => {
    const p = el('path', {d:wp.d}, probe);
    const L = p.getTotalLength();
    let prev = -1;
    for (let k=0; k<wp.n; k++){
      const pt = p.getPointAtLength(L*k/(wp.n-1));
      const idx = base.length; base.push({x:pt.x, y:pt.y});
      if (prev >= 0) segPairs.push([prev, idx]);
      prev = idx;
    }
  });
  base.push({x:118, y:158});   /* the eye */
  probe.remove();
}
const T1 = base.map(p => ap(TF1,p));
const T7 = base.map(p => ap(TF7,p));

/* ---------- ambient particles + whale constellation ---------- */
const gP = el('g', null, svg);
const gStreak = el('g', {opacity:0}, gP);
const streaks = STREAKS.map((s,i) => {
  const e = el('path', {d:s[0], fill:'none', stroke:s[1], 'stroke-width':s[2], 'stroke-linecap':'round'}, gStreak);
  const L = e.getTotalLength();
  e.setAttribute('stroke-dasharray', L.toFixed(1));
  e.setAttribute('stroke-dashoffset', L.toFixed(1));
  return {e, L, op:s[3], i};
});

const parts = [], plines = [];
for (let i=0; i<base.length; i++){
  const p = { x:rng()*960, y:rng()*540, dx:(rng()-.5)*16, dy:(rng()-.5)*16, r:1.1+rng()*1.6, cx:0, cy:0 };
  p.el = el('circle', {r:p.r, fill:C.ink, opacity:.3}, gP);
  parts.push(p);
}
const NSEG = segPairs.length;
for (let i=0; i<NSEG+64; i++) plines.push(el('line', {stroke:C.fog, 'stroke-width':1, opacity:0}, gP));

function streakT(tf){ return 'translate(' + tf.tx + ' ' + tf.ty + ') scale(' + tf.s + ')'; }

function uParts(t, boost, conv, mode){
  const T = mode === 7 ? T7 : T1;
  const drift = RM ? 0 : t;
  const a = .14 + .4*boost;
  for (let i=0; i<parts.length; i++){
    const p = parts[i];
    let x = (p.x + p.dx*drift) % 960; if (x<0) x += 960;
    let y = (p.y + p.dy*drift) % 540; if (y<0) y += 540;
    x = lerp(x, T[i].x, conv); y = lerp(y, T[i].y, conv);
    p.cx = x; p.cy = y;
    p.el.setAttribute('cx', x.toFixed(1)); p.el.setAttribute('cy', y.toFixed(1));
    p.el.setAttribute('opacity', lerp(a*.9, .92, conv).toFixed(3));
  }
  for (let k=0; k<NSEG; k++){
    const L = plines[k];
    if (conv > .02){
      const [i,j] = segPairs[k];
      L.setAttribute('x1', parts[i].cx.toFixed(1)); L.setAttribute('y1', parts[i].cy.toFixed(1));
      L.setAttribute('x2', parts[j].cx.toFixed(1)); L.setAttribute('y2', parts[j].cy.toFixed(1));
      L.setAttribute('opacity', (conv*.65).toFixed(3));
    } else L.setAttribute('opacity', 0);
  }
  let li = NSEG;
  const amb = a * (1 - conv);
  if (amb > .01){
    for (let i=0; i<parts.length && li<plines.length; i++)
      for (let j=i+1; j<parts.length && li<plines.length; j++){
        const dx = parts[i].cx-parts[j].cx, dy = parts[i].cy-parts[j].cy, d2 = dx*dx+dy*dy;
        if (d2 < 5800){
          const L = plines[li++];
          L.setAttribute('x1', parts[i].cx.toFixed(1)); L.setAttribute('y1', parts[i].cy.toFixed(1));
          L.setAttribute('x2', parts[j].cx.toFixed(1)); L.setAttribute('y2', parts[j].cy.toFixed(1));
          L.setAttribute('opacity', (amb*(1-Math.sqrt(d2)/76)).toFixed(3));
        }
      }
  }
  while (li < plines.length) plines[li++].setAttribute('opacity', 0);
  gStreak.setAttribute('transform', streakT(mode === 7 ? TF7 : TF1));
  gStreak.setAttribute('opacity', conv.toFixed(3));
  const t0 = mode === 7 ? 105.3 : 2.6;
  streaks.forEach(s => {
    const p = eo(seg(t, t0 + s.i*.15, t0 + s.i*.15 + 1.2));
    s.e.setAttribute('stroke-dashoffset', (s.L*(1-p)).toFixed(1));
    s.e.setAttribute('opacity', (s.op*p).toFixed(3));
  });
}

/* ---------- scene scaffolding (v2 windows) ---------- */
const SC = { s1:[0,12], s2:[12,30], s3:[30,48.5], s4:[48.5,66], s5:[66,86], s6:[86,100], s7:[100,111.5] };
function mkG(){ return el('g', {opacity:0}, svg); }
const g1=mkG(), g2=mkG(), g3=mkG(), g4=mkG(), g5=mkG(), g6=mkG(), g7=mkG();
function fade(t,r){ return seg(t, r[0], r[0]+.9) * (1 - seg(t, r[1]-.9, r[1])); }
function setOp(g,o){ g.setAttribute('opacity', o.toFixed(3)); g.setAttribute('visibility', o<=0 ? 'hidden' : 'visible'); }
function sceneHead(g, eyebrow, title){
  const e1 = txt(g, eyebrow, {x:480, y:56, 'text-anchor':'middle', 'font-size':12, 'letter-spacing':3.5, fill:C.fog, 'class':'fm', opacity:0});
  const e2 = txt(g, title, {x:480, y:102, 'text-anchor':'middle', 'font-size':34, fill:C.ink, 'class':'fd', opacity:0});
  return { set(t,a){ e1.setAttribute('opacity', (seg(t,a,a+.6)*.9).toFixed(3)); e2.setAttribute('opacity', seg(t,a+.2,a+.9).toFixed(3)); } };
}

/* ================= SCENE 1 — Intro (0–12) ================= */
const k1 = txt(g1, 'CETI EXPLAINERS \u00B7 TWO MINUTES', {x:480, y:56, 'text-anchor':'middle', 'font-size':12, 'letter-spacing':3.5, fill:C.fog, 'class':'fm', opacity:0});
const title1 = txt(g1, 'Generative AI, explained ', {x:480, y:414, 'text-anchor':'middle', 'font-size':44, fill:C.ink, 'class':'fd', opacity:0});
const tspan1 = el('tspan', {fill:C.copper}, title1);
tspan1.textContent = 'simply.';
const u1line = el('line', {x1:480, y1:440, x2:480, y2:440, stroke:C.copper, 'stroke-width':2, 'stroke-linecap':'round'}, g1);
const sub1 = txt(g1, 'What it is, how it works. No jargon.', {x:480, y:472, 'text-anchor':'middle', 'font-size':19, fill:C.fog, 'class':'fs', opacity:0});

function u1(t){
  const o = fade(t, SC.s1); setOp(g1, o); if (o<=0) return;
  k1.setAttribute('opacity', (seg(t,.3,1)*.9).toFixed(3));
  title1.setAttribute('opacity', seg(t,3.8,4.7).toFixed(3));
  const lw = eo(seg(t, 4.4, 5.4)) * 150;
  u1line.setAttribute('x1', (480-lw).toFixed(1)); u1line.setAttribute('x2', (480+lw).toFixed(1));
  sub1.setAttribute('opacity', seg(t, 5.2, 6).toFixed(3));
}

/* ================= SCENE 2 — Prediction (12–30) ================= */
const h2 = sceneHead(g2, '01 \u2014 PREDICTION', 'At its core: a prediction machine');
const PROMPT_S = 'Charting a course through uncharted ';
const card2 = el('g', {opacity:0}, g2);
el('rect', {x:120, y:140, width:720, height:92, rx:10, fill:C.well, stroke:C.rule, 'stroke-width':1}, card2);
txt(card2, 'PROMPT', {x:150, y:130, 'font-size':10, 'letter-spacing':2.6, fill:C.fog, 'class':'fm'});
const typed2 = txt(card2, '', {x:150, y:196, 'font-size':24, fill:C.ink, 'class':'fm'});
const curs2 = el('rect', {x:150, y:172, width:12, height:30, fill:C.copper, opacity:0}, card2);
let CH2W = 14.4;
const blank2 = el('line', {x1:0, y1:202, x2:0, y2:202, stroke:C.copper, 'stroke-width':3, 'stroke-linecap':'round', opacity:0}, card2);
const fly2 = txt(g2, 'waters', {'font-size':24, fill:C.copper, 'class':'fm', 'font-weight':700, opacity:0});
const pulse2 = el('circle', {r:0, fill:'none', stroke:C.copper, 'stroke-width':2, opacity:0}, g2);

const CAND = [['waters',64],['seas',23],['skies',9],['spreadsheets',1]];
const chips = [];
{
  const w = 176, h = 88, gap = 22;
  const x0 = 480 - (4*w + 3*gap)/2;
  CAND.forEach((c,i) => {
    const x = x0 + i*(w+gap), y = 296;
    const grp = el('g', {opacity:0}, g2);
    const rect = el('rect', {x, y, width:w, height:h, rx:10, fill:C.card, stroke:C.rule, 'stroke-width':1}, grp);
    txt(grp, c[0], {x:x+18, y:y+36, 'font-size':20, 'font-weight':600, fill:C.ink, 'class':'fs'});
    txt(grp, c[1]+'%', {x:x+w-16, y:y+34, 'text-anchor':'end', 'font-size':13, fill:C.fog, 'class':'fm'});
    el('rect', {x:x+18, y:y+58, width:w-36, height:7, rx:3.5, fill:C.track}, grp);
    const fill = el('rect', {x:x+18, y:y+58, width:0, height:7, rx:3.5, fill: i===0 ? C.copper : C.mist, opacity: i===0 ? 1 : .55}, grp);
    chips.push({grp, rect, fill, maxW:w-36, p:c[1]/100, t0:17.6 + i*.28, cx:x+18, cy:y+36});
  });
}

function u2(t){
  const o = fade(t, SC.s2); setOp(g2, o); if (o<=0) return;
  h2.set(t, 12.3);
  card2.setAttribute('opacity', seg(t,13,13.7).toFixed(3));
  const n = Math.floor(seg(t, 13.8, 16.3) * PROMPT_S.length);
  const cur = PROMPT_S.slice(0, n);
  if (typed2.textContent !== cur){
    typed2.textContent = cur;
    if (n === PROMPT_S.length) CH2W = typed2.getComputedTextLength() / PROMPT_S.length;
  }
  curs2.setAttribute('x', (150 + n*CH2W).toFixed(1));
  const blink = RM ? 1 : (Math.sin(t*2*Math.PI*1.1) > 0 ? 1 : .15);
  curs2.setAttribute('opacity', (seg(t,13.3,13.7)*blink * (t<25.4?1:0)).toFixed(2));
  const bx = 150 + PROMPT_S.length*CH2W + 14;
  const bl = eo(seg(t, 16.5, 17.3));
  blank2.setAttribute('x1', bx.toFixed(1));
  blank2.setAttribute('x2', (bx + 108*bl).toFixed(1));
  const ph = (!RM && t < 25) ? (.6 + .4*Math.sin((t-16.6)*3)) : 1;
  blank2.setAttribute('opacity', (bl*.9*ph*(t<26.8?1:.25)).toFixed(3));
  for (const c of chips){
    const p = eo(seg(t, c.t0, c.t0+.55));
    c.grp.setAttribute('opacity', p.toFixed(3));
    c.grp.setAttribute('transform', 'translate(0 ' + ((1-p)*24).toFixed(1) + ')');
    c.fill.setAttribute('width', (c.maxW * c.p * eo(seg(t, c.t0+1.1, c.t0+2.2))).toFixed(1));
  }
  const win = seg(t, 24.4, 25.2);
  chips[0].rect.setAttribute('stroke', win>0 ? C.copper : C.rule);
  chips[0].rect.setAttribute('stroke-width', (1 + win*1.5).toFixed(2));
  const fp = eio(seg(t, 25.4, 26.6));
  if (fp > 0){
    fly2.setAttribute('opacity', 1);
    fly2.setAttribute('x', lerp(chips[0].cx, bx+2, Math.min(fp,1)).toFixed(1));
    fly2.setAttribute('y', (lerp(chips[0].cy, 196, Math.min(fp,1)) - Math.sin(Math.min(fp,1)*Math.PI)*70).toFixed(1));
  } else fly2.setAttribute('opacity', 0);
  const pp = seg(t, 26.6, 27.4);
  pulse2.setAttribute('cx', (bx+50).toFixed(1)); pulse2.setAttribute('cy', 190);
  pulse2.setAttribute('r', (10 + pp*70).toFixed(1));
  pulse2.setAttribute('opacity', pp>0 ? (.55*(1-pp)).toFixed(3) : 0);
}

/* ================= SCENE 3 — Reading (30–48.5) ================= */
const h3 = sceneHead(g3, '02 \u2014 READING', 'It learns by reading \u2014 a lot');
const CL = {x:640, y:300};
const sat3 = [], edge3 = [];
for (let i=0; i<8; i++){
  const a = i*Math.PI/4;
  const x = CL.x + Math.cos(a)*64, y = CL.y + Math.sin(a)*64;
  edge3.push({e: el('line', {x1:CL.x, y1:CL.y, x2:x.toFixed(1), y2:y.toFixed(1), stroke:C.sage, 'stroke-width':1.5, opacity:0}, g3), t0:31.4+i*.11, ph:i});
  sat3.push({e: el('circle', {cx:x.toFixed(1), cy:y.toFixed(1), r:9, fill:C.card, stroke:C.sage, 'stroke-width':1.5, opacity:0}, g3), t0:31.4+i*.11});
}
const core3 = el('circle', {cx:CL.x, cy:CL.y, r:28, fill:'url(#gN)', opacity:0}, g3);
const pages = [];
for (let i=0; i<16; i++){
  const y0 = 150 + rng()*250;
  const grp = el('g', {opacity:0}, g3);
  el('rect', {x:-18, y:-23, width:36, height:46, rx:4, fill:C.card, stroke:C.rule2, 'stroke-width':1}, grp);
  for (let k=0; k<3; k++) el('line', {x1:-10, y1:-10+k*10, x2:10, y2:-10+k*10, stroke:C.fog, 'stroke-width':2, opacity:.6}, grp);
  pages.push({grp, y0, t0:32.6 + i*.82, dur:1.6});
}
const pulse3 = el('circle', {cx:CL.x, cy:CL.y, r:0, fill:'none', stroke:C.sage, 'stroke-width':2, opacity:0}, g3);
const cnt3 = txt(g3, '0.00 trillion', {x:CL.x, y:420, 'text-anchor':'middle', 'font-size':30, 'font-weight':700, fill:C.sage, 'class':'fm'});
txt(g3, 'words read during training', {x:CL.x, y:446, 'text-anchor':'middle', 'font-size':14, fill:C.fog, 'class':'fs'});
const src3 = txt(g3, 'books \u00B7 articles \u00B7 websites', {x:185, y:128, 'text-anchor':'middle', 'font-size':14, fill:C.fog, 'class':'fm', opacity:0});

function qbez(p0,p1,p2,p){ const a = lerp(p0,p1,p), b = lerp(p1,p2,p); return lerp(a,b,p); }
function u3(t){
  const o = fade(t, SC.s3); setOp(g3, o); if (o<=0) return;
  h3.set(t, 30.3);
  src3.setAttribute('opacity', (seg(t,31.9,32.7)*.85).toFixed(3));
  core3.setAttribute('opacity', eo(seg(t,30.9,31.6)).toFixed(3));
  const breathe = RM ? 1 : 1 + .04*Math.sin(t*2.2);
  core3.setAttribute('r', (28*breathe).toFixed(2));
  sat3.forEach(s => s.e.setAttribute('opacity', eo(seg(t, s.t0, s.t0+.5)).toFixed(3)));
  edge3.forEach(ed => {
    const bse = eo(seg(t, ed.t0, ed.t0+.5));
    const gl = RM ? .55 : .38 + .32*Math.sin(t*2.5 + ed.ph);
    ed.e.setAttribute('opacity', (bse*gl).toFixed(3));
  });
  let lastArr = -1;
  for (const pg of pages){
    const p = seg(t, pg.t0, pg.t0 + pg.dur);
    if (p<=0 || p>=1){ pg.grp.setAttribute('opacity', 0); }
    else {
      const pe = eio(p);
      const x = qbez(140, 380, CL.x, pe), y = qbez(pg.y0, pg.y0-150, CL.y, pe);
      const s = lerp(1, .3, pe);
      pg.grp.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + s.toFixed(2) + ')');
      pg.grp.setAttribute('opacity', (p<.1 ? p*10 : (p>.85 ? (1-p)/.15 : 1)).toFixed(2));
    }
    const arr = pg.t0 + pg.dur;
    if (t>=arr && t-arr<.5 && arr>lastArr) lastArr = arr;
  }
  if (lastArr > 0 && !RM){
    const pp = (t-lastArr)/.5;
    pulse3.setAttribute('r', (30 + pp*70).toFixed(1));
    pulse3.setAttribute('opacity', (.45*(1-pp)).toFixed(2));
  } else pulse3.setAttribute('opacity', 0);
  cnt3.textContent = (2*eo(seg(t,32.8,45.5))).toFixed(2) + ' trillion';
}

/* ================= SCENE 4 — Scale (48.5–66) ================= */
const h4 = sceneHead(g4, '03 \u2014 SCALE', 'The \u201Clarge\u201D in large language model');
const cnt4 = txt(g4, '0 connections', {x:480, y:132, 'text-anchor':'middle', 'font-size':20, 'font-weight':700, fill:C.copper, 'class':'fm'});
const NET = {x:480, y:330};
const gE4 = el('g', null, g4), gN4 = el('g', null, g4);
const rings = [
  {n:1,  r:0,   nr:16, t0:49.5, st:0},
  {n:6,  r:64,  nr:9,  t0:50.2, st:.16},
  {n:12, r:124, nr:7,  t0:51.6, st:.13},
  {n:18, r:184, nr:5,  t0:53.3, st:.11}
];
const nodes4 = [], edges4 = [];
let prevRing = [];
rings.forEach((rg, ri) => {
  const cur = [];
  const strokes = [null, C.copper, C.sage, C.mist];
  for (let i=0; i<rg.n; i++){
    const a = ri*.4 + i*2*Math.PI/rg.n;
    const x = NET.x + Math.cos(a)*rg.r, y = NET.y + Math.sin(a)*rg.r;
    const t0 = rg.t0 + i*rg.st;
    if (ri > 0){
      const par = prevRing[i % prevRing.length];
      edges4.push({e: el('line', {x1:par.x.toFixed(1), y1:par.y.toFixed(1), x2:x.toFixed(1), y2:y.toFixed(1), stroke:'#2E3850', 'stroke-width':1.2, opacity:0}, gE4), t0, ax1:par.x, ay1:par.y, ax2:x, ay2:y});
    }
    const e = ri === 0
      ? el('circle', {cx:x.toFixed(1), cy:y.toFixed(1), r:0, fill:'url(#gCu)', opacity:0}, gN4)
      : el('circle', {cx:x.toFixed(1), cy:y.toFixed(1), r:0, fill:C.card, stroke:strokes[ri], 'stroke-width':1.5, opacity:0}, gN4);
    nodes4.push({e, t0, r:rg.nr});
    cur.push({x, y});
  }
  prevRing = cur;
});
const sigs4 = [];
for (let i=0; i<14; i++){
  sigs4.push({ dot: el('circle', {r:3, fill:C.peach, opacity:0}, gN4), off:(i*.37)%1, ei:(i*5)%36 });
}
function tag4(s, x, y, col, t0){
  const grp = el('g', {opacity:0}, g4);
  const w = s.length*9.5 + 30;
  el('rect', {x:x-w/2, y:y-19, width:w, height:36, rx:18, fill:C.card, stroke:col, 'stroke-width':1}, grp);
  txt(grp, s, {x, y:y+6, 'text-anchor':'middle', 'font-size':16, fill:col, 'font-weight':600, 'class':'fs'}, grp);
  return {g:grp, t0};
}
const tags4 = [ tag4('grammar',170,250,C.sage,56.5), tag4('facts',790,250,C.copper,57.2), tag4('style',790,430,C.peach,57.9) ];

function u4(t){
  const o = fade(t, SC.s4); setOp(g4, o); if (o<=0) return;
  h4.set(t, 48.8);
  nodes4.forEach(n => {
    const p = eo(seg(t, n.t0, n.t0+.5));
    n.e.setAttribute('r', (n.r*p).toFixed(2));
    n.e.setAttribute('opacity', p.toFixed(3));
  });
  edges4.forEach(ed => ed.e.setAttribute('opacity', (.6*eo(seg(t, ed.t0, ed.t0+.6))).toFixed(3)));
  const n = Math.floor(eo(seg(t, 50, 62)) * 175e9);
  cnt4.textContent = n.toLocaleString('en-US') + ' connections';
  tags4.forEach(tg => {
    const p = eo(seg(t, tg.t0, tg.t0+.7));
    tg.g.setAttribute('opacity', p.toFixed(3));
    tg.g.setAttribute('transform', 'translate(0 ' + ((1-p)*14).toFixed(1) + ')');
  });
  if (!RM){
    const win = seg(t, 56.5, 57.5) * (1 - seg(t, 64, 65));
    sigs4.forEach(s => {
      const ed = edges4[s.ei];
      const p = (((t-56.5)*.8 + s.off) % 1 + 1) % 1;
      s.dot.setAttribute('cx', lerp(ed.ax1, ed.ax2, p).toFixed(1));
      s.dot.setAttribute('cy', lerp(ed.ay1, ed.ay2, p).toFixed(1));
      s.dot.setAttribute('opacity', (win * Math.sin(Math.PI*p) * .9).toFixed(3));
    });
  }
}

/* ================= SCENE 5 — Writing (66–86) ================= */
const h5 = sceneHead(g5, '04 \u2014 WRITING', 'It writes one word at a time');
const PILLS = [['READ SO FAR',250],['GUESS NEXT',480],['ADD WORD',710]];
const pills5 = PILLS.map(p => {
  const grp = el('g', null, g5);
  const r = el('rect', {x:p[1]-84, y:122, width:168, height:44, rx:22, fill:C.card, stroke:C.rule, 'stroke-width':1}, grp);
  txt(grp, p[0], {x:p[1], y:150, 'text-anchor':'middle', 'font-size':12, 'letter-spacing':1.6, 'font-weight':700, fill:C.ink, 'class':'fm'});
  return r;
});
el('line', {x1:340, y1:144, x2:386, y2:144, stroke:C.fog, 'stroke-width':1.5, 'marker-end':'url(#arr)'}, g5);
el('line', {x1:570, y1:144, x2:616, y2:144, stroke:C.fog, 'stroke-width':1.5, 'marker-end':'url(#arr)'}, g5);
el('path', {d:'M 710 172 C 710 216 250 216 250 174', fill:'none', stroke:C.fog, 'stroke-width':1.5, 'stroke-dasharray':'4 6', 'marker-end':'url(#arr)'}, g5);
const prompt5 = txt(g5, '> write one line about a whale', {x:480, y:218, 'text-anchor':'middle', 'font-size':14, fill:C.fog, 'class':'fm', opacity:0});

const SENT = [
  ['The','A','One'],['whale','sailor','captain'],['kept','drew','sang'],['a','the','its'],
  ['map','log','chart'],['of','for','with'],['every','each','one'],['song','tide','star'],
  ['it','she','they'],['had','once','ever'],['ever','never','just'],['heard.','sung.','known.']
];
const GEN0 = 69.5, STEP = 1.2;
const s5words = [];
{
  const fs = 32, gap = 13, maxW = 720, lh = 56;
  const els = SENT.map(w => txt(g5, w[0], {'font-size':fs, 'font-weight':600, fill:C.ink, 'class':'fs', opacity:0}));
  const ws = els.map(e => e.getComputedTextLength());
  const linesArr = []; let cur = [], curW = 0;
  ws.forEach((w,i) => {
    if (curW + w > maxW && cur.length){ linesArr.push(cur); cur = []; curW = 0; }
    cur.push(i); curW += w + gap;
  });
  if (cur.length) linesArr.push(cur);
  let y = 330;
  linesArr.forEach(line => {
    const tw = line.reduce((a,i)=>a+ws[i],0) + gap*(line.length-1);
    let x = 480 - tw/2;
    line.forEach(i => {
      els[i].setAttribute('x', x.toFixed(1)); els[i].setAttribute('y', y);
      s5words.push({e:els[i], x, y, w:ws[i], t0: GEN0 + i*STEP});
      x += ws[i] + gap;
    });
    y += lh;
  });
  s5words.sort((a,b)=>a.t0-b.t0);
}
const cur5 = el('rect', {width:4, height:38, fill:C.peach, opacity:0, rx:2}, g5);
const ghost5 = txt(g5, '', {'font-size':21, fill:C.fog, 'text-anchor':'middle', 'class':'fd', opacity:0});
g5.appendChild(ghost5);

function u5(t){
  const o = fade(t, SC.s5); setOp(g5, o); if (o<=0) return;
  h5.set(t, 66.3);
  prompt5.setAttribute('opacity', (seg(t,67.2,68)*.85).toFixed(3));
  let active = -1;
  if (t > GEN0-1 && t < GEN0 + SENT.length*STEP){
    const ph = ((t-GEN0) % STEP) / STEP;
    active = ph < .34 ? 0 : (ph < .63 ? 1 : 2);
  }
  pills5.forEach((r,i) => {
    const on = i === active;
    r.setAttribute('stroke', on ? C.peach : C.rule);
    r.setAttribute('stroke-width', on ? 2 : 1);
  });
  s5words.forEach(w => {
    const p = eo(seg(t, w.t0+.75, w.t0+1.05));
    w.e.setAttribute('opacity', p.toFixed(3));
    w.e.setAttribute('y', (w.y - (1-p)*14).toFixed(1));
  });
  let nxt = null, nxtI = -1;
  for (let i=0; i<s5words.length; i++){ if (t < s5words[i].t0 + .75){ nxt = s5words[i]; nxtI = i; break; } }
  let cx, cy;
  if (nxt){ cx = nxt.x - 8; cy = nxt.y; }
  else { const lw = s5words[s5words.length-1]; cx = lw.x + lw.w + 8; cy = lw.y; }
  cur5.setAttribute('x', cx.toFixed(1)); cur5.setAttribute('y', (cy-30).toFixed(1));
  const blink = RM ? 1 : (Math.sin(t*2*Math.PI) > 0 ? 1 : .15);
  cur5.setAttribute('opacity', t > 68.2 ? (blink*.9).toFixed(2) : 0);
  if (nxt){
    const lt = t - nxt.t0;
    if (lt > 0 && lt < .75){
      const k = Math.min(Math.floor(lt/.26), 2);
      const opts = [SENT[nxtI][1], SENT[nxtI][2], SENT[nxtI][0]];
      ghost5.textContent = opts[k] + ' ?';
      ghost5.setAttribute('x', clamp(nxt.x + nxt.w/2, 130, 830).toFixed(1));
      ghost5.setAttribute('y', 268);
      ghost5.setAttribute('opacity', .85);
    } else ghost5.setAttribute('opacity', 0);
  } else ghost5.setAttribute('opacity', 0);
}

/* ================= SCENE 6 — Limits (86–100) ================= */
const h6 = sceneHead(g6, '05 \u2014 LIMITS', 'Powerful \u2014 with a catch');
function card6(x, title, col, items, t0){
  const grp = el('g', {opacity:0}, g6);
  el('rect', {x, y:138, width:400, height:322, rx:14, fill:C.card, stroke:C.rule, 'stroke-width':1}, grp);
  txt(grp, title, {x:x+32, y:188, 'font-size':13, 'letter-spacing':2.6, 'font-weight':700, fill:col, 'class':'fm'});
  const its = items.map((s,i) => {
    const ig = el('g', {opacity:0}, grp);
    const yy = 244 + i*66;
    if (col === C.sage){
      el('circle', {cx:x+46, cy:yy-6, r:13, fill:'none', stroke:col, 'stroke-width':1.75}, ig);
      el('path', {d:'M '+(x+40)+' '+(yy-6)+' l 4 5 l 8 -10', fill:'none', stroke:col, 'stroke-width':2.2, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, ig);
    } else {
      el('path', {d:'M '+(x+46)+' '+(yy-20)+' l 13 24 h -26 z', fill:'none', stroke:col, 'stroke-width':1.75, 'stroke-linejoin':'round'}, ig);
      el('line', {x1:x+46, y1:yy-13, x2:x+46, y2:yy-6, stroke:col, 'stroke-width':2.2, 'stroke-linecap':'round'}, ig);
      el('circle', {cx:x+46, cy:yy-1, r:1.6, fill:col}, ig);
    }
    txt(ig, s, {x:x+74, y:yy, 'font-size':18, fill:C.ink, 'class':'fs'});
    return {ig, t0: t0 + .9 + i*.42};
  });
  return {grp, its, t0};
}
const cardL = card6(70, 'GREAT AT', C.sage,
  ['First drafts, fast','Summaries of long documents','Plain-language explanations'], 86.7);
const cardR = card6(490, 'KEEP IN MIND', C.peach,
  ['Sounds sure \u2014 even when wrong','Can invent details (\u201Challucinate\u201D)','You check facts that matter'], 88.2);

function slideIn(c, t, dir){
  const p = eo(seg(t, c.t0, c.t0+.8));
  c.grp.setAttribute('opacity', p.toFixed(3));
  c.grp.setAttribute('transform', 'translate(' + ((1-p)*40*dir).toFixed(1) + ' 0)');
  c.its.forEach(it => {
    const q = eo(seg(t, it.t0, it.t0+.5));
    it.ig.setAttribute('opacity', q.toFixed(3));
    it.ig.setAttribute('transform', 'translate(0 ' + ((1-q)*12).toFixed(1) + ')');
  });
}
function u6(t){
  const o = fade(t, SC.s6); setOp(g6, o); if (o<=0) return;
  h6.set(t, 86.2);
  slideIn(cardL, t, -1); slideIn(cardR, t, 1);
}

/* ================= SCENE 7 — Takeaway (100–110) ================= */
const L1 = 'It doesn\u2019t think the way we do.'.split(' ');
const w7 = [];
{
  const fs = 27, gap = 11;
  const els = L1.map(w => txt(g7, w, {'font-size':fs, fill:C.fog, 'class':'fs', opacity:0}));
  const ws = els.map(e => e.getComputedTextLength());
  const tot = ws.reduce((a,b)=>a+b,0) + gap*(ws.length-1);
  let x = 480 - tot/2;
  els.forEach((e,i) => {
    e.setAttribute('x', x.toFixed(1)); e.setAttribute('y', 152);
    w7.push({e, t0: 100.8 + i*.15});
    x += ws[i] + gap;
  });
}
const big7 = txt(g7, 'It predicts.', {x:480, y:228, 'text-anchor':'middle', 'font-size':62, fill:C.ink, 'class':'fd', opacity:0});
const sub7 = txt(g7, '\u2014 and prediction, at this scale, is surprisingly powerful.', {x:480, y:270, 'text-anchor':'middle', 'font-size':20, fill:C.fog, 'class':'fs', opacity:0});
const ring7 = el('circle', {cx:480, cy:300, r:0, fill:'none', stroke:C.copper, 'stroke-width':1.5, opacity:0}, g7);

function u7(t){
  const o = fade(t, SC.s7); setOp(g7, o); if (o<=0) return;
  w7.forEach(w => {
    const p = eo(seg(t, w.t0, w.t0+.5));
    w.e.setAttribute('opacity', (p*.95).toFixed(3));
    w.e.setAttribute('y', (152 + (1-p)*14).toFixed(1));
  });
  const bp = eo(seg(t, 103.2, 104.1));
  big7.setAttribute('opacity', bp.toFixed(3));
  big7.setAttribute('transform', 'translate(480 228) scale(' + (0.94 + .06*bp).toFixed(3) + ') translate(-480 -228)');
  sub7.setAttribute('opacity', (seg(t, 105, 105.8)*.95).toFixed(3));
  if (!RM){
    const rp = seg(t, 107.6, 109.4);
    ring7.setAttribute('r', (rp*300).toFixed(1));
    ring7.setAttribute('opacity', rp>0 ? (.4*(1-rp)).toFixed(3) : 0);
  }
}

/* ---------- captions & chapters (v2 timing) ---------- */
const CAPS = [
  [0.5,5.2, 'In the next two minutes: what generative AI actually is. No jargon.'],
  [5.2,11,  'Chatbots, image makers, coding assistants \u2014 all share one idea at their core.'],
  [12,18.5, 'A language model is a prediction machine.'],
  [18.5,24, 'Give it words, and it guesses the next one. Autocomplete \u2014 with far better guesses.'],
  [24,29.5, 'Every candidate gets a score. The likeliest word usually wins.'],
  [30,36.5, 'How does it get good at guessing? By reading. A lot.'],
  [36.5,43, 'Training means reading trillions of words \u2014 books, articles, websites.'],
  [43,47.8, 'It isn\u2019t memorizing pages. It\u2019s learning the patterns in how we write.'],
  [48.5,54.5,'The \u201Clarge\u201D part: billions of tiny adjustable connections inside.'],
  [54.5,60.5,'Each one nudges the next guess. Together they hold grammar, facts, and style.'],
  [60.5,65.5,'Imagine a library the size of a harbor city \u2014 one that has read every book it holds.'],
  [66,72,   'Ask it something, and it writes the answer one word at a time.'],
  [72,79,   'Read what\u2019s there. Guess the next word. Add it. Repeat \u2014 very fast.'],
  [79,85.5, 'String enough good guesses together and you get letters, summaries, even code.'],
  [86,92,   'Brilliant at drafts, summaries, and ideas on demand.'],
  [92,99.5, 'It can sound confident and still be wrong. For anything that matters, you\u2019re the editor.'],
  [100,105, 'It doesn\u2019t think the way we do. It predicts.'],
  [105,110, 'And prediction, at this scale, is surprisingly powerful.']
];
const CHAP = [[0,'Intro'],[12,'Prediction'],[30,'Reading'],[48.5,'Scale'],[66,'Writing'],[86,'Limits'],[100,'Takeaway']];

const capEl = $('#cap'), timeEl = $('#time'), scrub = $('#scrub'), playBtn = $('#play');
const chapWrap = $('#chaps');
let t = 0, playing = false, started = false, seeking = false, lastCap = null;

/* resume from last position */
{
  const saved = parseFloat(localStorage.getItem('ceti-explainer-v2-t'));
  if (!isNaN(saved) && saved > 1 && saved < DUR - 1){ t = saved; started = true; }
}
let lastSaved = t;

const chapBtns = CHAP.map(ch => {
  const b = document.createElement('button');
  b.className = 'chip'; b.type = 'button'; b.textContent = ch[1];
  b.addEventListener('click', () => { t = ch[0]; started = true; if (!playing && !RM){ playing = true; syncPlay(); } });
  chapWrap.appendChild(b);
  return b;
});

/* playback speed chips */
let speed = parseFloat(localStorage.getItem('ceti-explainer-v2-speed')) || 1;
if (![1,1.25,1.5].includes(speed)) speed = 1;
const spdWrap = $('#speeds');
const spdBtns = [1,1.25,1.5].map(s => {
  const b = document.createElement('button');
  b.className = 'chip speed'; b.type = 'button';
  b.textContent = s + '\u00D7';
  b.setAttribute('aria-label', 'Playback speed ' + s + 'x');
  b.addEventListener('click', () => {
    speed = s; localStorage.setItem('ceti-explainer-v2-speed', s); syncSpeed();
  });
  spdWrap.appendChild(b);
  return {b, s};
});
function syncSpeed(){ spdBtns.forEach(o => o.b.setAttribute('aria-pressed', o.s === speed ? 'true' : 'false')); }
syncSpeed();

function fmt(s){ s = Math.floor(s); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
function syncPlay(){
  playBtn.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
  playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
playBtn.addEventListener('click', () => { if (t >= DUR) t = 0; playing = !playing; started = true; syncPlay(); });
$('#restart').addEventListener('click', () => { t = 0; started = true; playing = true; syncPlay(); });
scrub.addEventListener('input', () => { seeking = true; t = parseFloat(scrub.value); started = true; });
scrub.addEventListener('change', () => { seeking = false; });
addEventListener('keydown', e => {
  const tag = e.target.tagName;
  if (e.code === 'Space' && tag !== 'BUTTON' && tag !== 'INPUT' && tag !== 'SUMMARY'){ e.preventDefault(); playBtn.click(); }
  else if (e.key === 'ArrowRight' && tag !== 'INPUT'){ t = Math.min(DUR, t+5); started = true; }
  else if (e.key === 'ArrowLeft' && tag !== 'INPUT'){ t = Math.max(0, t-5); started = true; }
});

/* ---------- render loop ---------- */
function render(){
  const rt = (!started && t === 0) ? 5.6 : t;   /* poster frame while idle */
  const o1 = fade(rt, SC.s1), o7 = fade(rt, SC.s7);
  let conv, mode;
  if (rt < 55){ mode = 1; conv = eo(seg(rt, .8, 2.8)) * (1 - seg(rt, 9.8, 11.5)); }
  else        { mode = 7; conv = eo(seg(rt, 104.3, 106.3)); }
  uParts(rt, Math.max(o1, o7), conv, mode);
  u1(rt); u2(rt); u3(rt); u4(rt); u5(rt); u6(rt); u7(rt);
  let c = '';
  if (!started && t === 0) c = 'Press \u25B6 to start \u2014 1:50 at 1\u00D7.';
  else if (t >= DUR - .05) c = 'That\u2019s the tour \u2014 press \u27F2 to watch again.';
  else for (const k of CAPS){ if (t >= k[0] && t < k[1]){ c = k[2]; break; } }
  if (c !== lastCap){ capEl.textContent = c; lastCap = c; }
  if (!seeking) scrub.value = t;
  timeEl.textContent = fmt(t) + ' / ' + fmt(DUR);
  let ai = 0;
  CHAP.forEach((ch,i) => { if (t >= ch[0] - .01) ai = i; });
  chapBtns.forEach((b,i) => b.setAttribute('aria-current', i === ai ? 'true' : 'false'));
  if (started && Math.abs(t - lastSaved) > .8){
    lastSaved = t;
    try { localStorage.setItem('ceti-explainer-v2-t', t.toFixed(1)); } catch(e){}
  }
}
let last = performance.now();
function tick(ts){
  const dt = Math.min(.05, (ts-last)/1000); last = ts;
  if (playing){
    t = Math.min(DUR, t + dt*speed);
    if (t >= DUR){ playing = false; syncPlay(); }
  }
  render();
  requestAnimationFrame(tick);
}
render();
requestAnimationFrame(tick);
}

/* Wait for the brand faces before measuring text layout. */
(async () => {
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('300 italic 34px Fraunces'),
        document.fonts.load('600 32px "DM Sans"'),
        document.fonts.load('400 24px "Space Mono"'),
        document.fonts.load('700 24px "Space Mono"')
      ]),
      new Promise(r => setTimeout(r, 2500))
    ]);
  } catch(e){}
  build();
})();
})();
