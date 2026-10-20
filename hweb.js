(function(){
  /* Same layout as the homepage donor web: the business-backed side on the left, what they share in the middle, the other side on the right.
     Homepage: their donors also fund Republicans. Here: their consultants also work for Democrats and progressives. */
  const svg=document.getElementById('hweb'); if(!svg||!window.PROFILES) return;
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  const tx=(p,x,y,s,a)=>{const t=el('text',Object.assign({x,y},a),p);t.textContent=s;return t};
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);
  const PAC=new Set(['Unity PAC','DitchMitch','fix multCo','Go Portland Go','Portland Alliance PAC','Oregon Prosperity Action Fund','goPDX','Coalition for Portland’s Future']);
  const LEFT=[['Kellie Torres','Council D3'],['Steve Novick','Council D3'],['Julia Brim-Edwards','County Chair'],['Eric Zimmerman','Council D4'],['Olivia Clark','Council D4'],['Eli Arnold','Council D4'],['Sharon Meieran','County Chair'],['Their PACs','Unity, goPDX, Go Portland Go…']];
  const RIGHT=[['DPO','Democratic Party','state and county parties'],['KOT','Gov. Tina Kotek','2026 campaign'],['PRO','Progressive candidates','Green, Morillo, Koyama Lane, Singleton'],['LAB','Labor and progressive groups','OEA, Working Families, teachers'],['DEM','Other Democrats','legislators, statewide, caucuses']];
  const tgt=n=>/^Democratic Party of/.test(n)?'DPO':/Kotek/.test(n)?'KOT':/OEA|Working Families|Teachers PAC|labor\)|Nurses/.test(n)?'LAB':/^Rep\.|Nafisa|Tobias Read|Rayfield|House Democrats|Senate Democrat|Friends of Hoa|Ricki|House and Senate Democrats|Democratic and labor/.test(n)?'DEM':null;
  const firms=window.PROFILES.filter(p=>!p.agg&&p.race.some(r=>'bc'.includes(r[1]))).map(p=>{
    const L={};p.race.filter(r=>'bc'.includes(r[1])).forEach(([n,,v])=>{const k=PAC.has(n)?'Their PACs':n;L[k]=(L[k]||0)+v});
    const R={};p.race.filter(r=>r[1]==='r').forEach(([,,v])=>R.PRO=(R.PRO||0)+v);
    p.other.forEach(([n,t,v])=>{const k=t==='p'?(tgt(n)||'DEM'):null;if(k)R[k]=(R[k]||0)+v});
    return {p,L,R,lt:Object.values(L).reduce((a,b)=>a+b,0),rt:Object.values(R).reduce((a,b)=>a+b,0)};
  });
  const W=1240,H=720,cx=250,gx=930,mx=560;
  const ly={};LEFT.forEach((c,i)=>ly[c[0]]=70+i*(580/(LEFT.length-1)));
  const ry={};RIGHT.forEach((t,i)=>ry[t[0]]=90+i*135);
  firms.forEach(f=>{const ys=Object.entries(f.L).map(([k,v])=>[ly[k],v]);f.avg=ys.reduce((s,[y,v])=>s+y*v,0)/f.lt});
  firms.sort((a,b)=>a.avg-b.avg);
  firms.forEach((f,i)=>{f.x=mx;f.y=52+i*(620/Math.max(1,firms.length-1))});
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const maxL=Math.max(...firms.map(f=>f.lt));
  const eg=el('g',{fill:'none'},svg),ng=el('g',{},svg);
  const edges=[];
  firms.forEach((f,i)=>{
    Object.entries(f.L).forEach(([k,v])=>{const y=ly[k];const e=el('path',{d:`M${cx+14},${y} C${cx+140},${y} ${f.x-140},${f.y} ${f.x},${f.y}`,class:'he he-l','stroke-width':(0.9+5*Math.sqrt(v/maxL)).toFixed(2)},eg);e._l=k;e._f=f.p.n;e.style.setProperty('--d',(0.05+i*0.03).toFixed(2)+'s');edges.push(e)});
    Object.entries(f.R).forEach(([k,v])=>{const y=ry[k];const e=el('path',{d:`M${f.x},${f.y} C${f.x+150},${f.y} ${gx-150},${y} ${gx-14},${y}`,class:'he he-r','stroke-width':(0.9+5*Math.sqrt(Math.min(v,maxL)/maxL)).toFixed(2)},eg);e._r=k;e._f=f.p.n;e.style.setProperty('--d',(0.9+i*0.03).toFixed(2)+'s');edges.push(e)});
  });
  tx(svg,mx,20,firms.length+' FIRMS',{class:'h-hd','text-anchor':'middle'});
  const nodes=[];
  firms.forEach(f=>{const g=el('g',{class:'h-f',tabindex:0,role:'button','aria-label':`${f.p.n}: ${K(f.lt)} from the business-backed and conservative side`+(f.rt?`, ${K(f.rt)} from Democrats and progressives`:'')},ng);
    el('circle',{cx:f.x,cy:f.y,r:(3.5+7*Math.sqrt(f.lt/maxL)).toFixed(1),class:f.rt?'h-dot both':'h-dot'},g);
    el('rect',{x:f.x-14,y:f.y-14,width:190,height:28,fill:'transparent'},g);
    tx(g,f.x+16,f.y+4,f.p.n,{class:'h-fn'});
    el('title',{},g).textContent=`${f.p.n}: ${K(f.lt)} from the business-backed and conservative side`+(f.rt?`, ${K(f.rt)} from Democrats and progressives`:', no Democratic or progressive clients found');
    g._f=f.p.n;nodes.push(g)});
  LEFT.forEach(([n,s])=>{const g=el('g',{class:'h-c',tabindex:0,role:'button'},ng);const y=ly[n];
    el('circle',{cx,cy:y,r:12,class:'h-cl'},g);tx(g,cx-22,y+2,n,{class:'h-n','text-anchor':'end'});tx(g,cx-22,y+19,s,{class:'h-s','text-anchor':'end'});g._l=n;nodes.push(g)});
  RIGHT.forEach(([k,n,s])=>{const g=el('g',{class:'h-c',tabindex:0,role:'button'},ng);const y=ry[k];
    el('circle',{cx:gx,cy:y,r:14,class:'h-cr'},g);tx(g,gx+26,y+2,n,{class:'h-n'});tx(g,gx+26,y+20,s,{class:'h-s'});g._r=k;nodes.push(g)});
  const focus=(key,val)=>{
    if(!key){edges.forEach(e=>e.classList.remove('fade'));nodes.forEach(n=>n.classList.remove('fade'));return}
    const fs=new Set();edges.forEach(e=>{if(e['_'+key]===val)fs.add(e._f)});
    const on=new Set();
    edges.forEach(e=>{const vis=fs.has(e._f)&&(e['_'+key]===undefined||e['_'+key]===val);e.classList.toggle('fade',!vis);if(vis){on.add('f'+e._f);if(e._l)on.add('l'+e._l);if(e._r)on.add('r'+e._r)}});
    nodes.forEach(n=>n.classList.toggle('fade',!on.has(n._f?'f'+n._f:n._l?'l'+n._l:'r'+n._r)))};
  const pick=g=>{if(!g)return;if(g._f){focus('f',g._f);window.openProfile&&window.openProfile(g._f)}else if(g._l)focus('l',g._l);else focus('r',g._r)};
  svg.addEventListener('click',e=>pick(e.target.closest('.h-f,.h-c')));
  svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e.target.closest('.h-f,.h-c'))}});
  svg.addEventListener('pointerover',e=>{const g=e.target.closest('.h-f,.h-c');if(g&&matchMedia('(hover:hover)').matches){if(g._f)focus('f',g._f);else if(g._l)focus('l',g._l);else focus('r',g._r)}});
  svg.addEventListener('pointerleave',()=>focus(null));
  const s=document.getElementById('hweb-sum');
  if(s){const both=firms.filter(f=>f.rt>0);s.textContent=`${both.length} of the ${firms.length} firms paid by the business-backed and conservative side also work for Democrats or progressives this cycle. Click a firm for its profile.`}
  // draw-in like the homepage, unless reduced motion
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){svg.classList.add('anim');const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){svg.classList.add('go');io.disconnect()}})},{threshold:.25});io.observe(svg)}
})();
