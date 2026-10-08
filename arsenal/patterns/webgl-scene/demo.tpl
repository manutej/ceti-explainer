<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>webgl-scene</title>
<style>html,body{margin:0;background:#0F1115}canvas{display:block}</style>
<script src="../../../vendor/p5-2.3.4.min.js"></script>
<script src="./font.js"></script>
<script src="./pattern.js"></script></head><body><main></main><div id="junk" hidden></div>
<script>
const BRANDS=__BRANDS__;
const Q=new URLSearchParams(location.search), PAT=ARSENAL.patterns['webgl-scene'], TK=BRANDS[Q.get('brand')||'ceti-dark'];
const NAMES=PAT.variants.map(v=>v.name), cache={}; let cur=null, curT=0, fonts=null, P=null, last=null;
const paramsOf=n=>Object.assign({},PAT.params,PAT.variants.find(v=>v.name===n).params,Q.get('p')?JSON.parse(Q.get('p')):{});
let resolveReady; const readyP=new Promise(r=>resolveReady=r);
new p5(p=>{
  P=p;
  p.setup=async()=>{ if(Q.get('aa')==='0')p.setAttributes('antialias',false); await p.createCanvas(960,540,p.WEBGL); p.pixelDensity(2); p.noLoop();
    fonts=await PAT.load(p); resolveReady(); };
  p.draw=()=>{};
},document.querySelector('main'));
/* p5 2.x WEBGL text inserts a hidden 1x1 canvas ahead of the real one; park it so querySelector('canvas') stays the film canvas */
function tidy(){ document.querySelectorAll('canvas:not(.p5Canvas)').forEach(c=>document.getElementById('junk').appendChild(c)); }
function seek(t,v){ v=v||Q.get('variant')||NAMES[0]; if(!cache[v]){ const params=paramsOf(v); cache[v]={params,st:PAT.setup(P,{seed:7,fonts},params)}; }
  cur=v; curT=t; P.resetMatrix(); last=PAT.draw(P,t,cache[v].st,cache[v].params,TK); tidy(); return last; }
window.__film={ ready:()=>readyP.then(()=>{ if(Q.has('t')) seek(+Q.get('t')); }), seek, info:{variants:NAMES,dur:PAT.params.dur,brand:TK.id} };
window.__film.stats=()=>{const s=cache[cur]&&cache[cur].st;return {head:s&&s.head&&s.head.kind,verts:s&&s.head&&s.head.verts,err:s&&(s.headError||s.headError2)}};
</script></body></html>
