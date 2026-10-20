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
    Object.entries(f.L).forEach(([k,v])=>{const y=ly[k];const e=el('path',{d:`M${cx+14},${y} C${cx+140},${y} ${f.x-140},${f.y} ${f.x},${f.y}`,class:'he he-l','stroke-width':(0.9+5*Math.sqrt(v/maxL)).toFixed(2)},eg);e._l=k;e._v=v;e._f=f.p.n;e.style.setProperty('--d',(0.05+i*0.03).toFixed(2)+'s');edges.push(e)});
    Object.entries(f.R).forEach(([k,v])=>{const y=ry[k];const e=el('path',{d:`M${f.x},${f.y} C${f.x+150},${f.y} ${gx-150},${y} ${gx-14},${y}`,class:'he he-r','stroke-width':(0.9+5*Math.sqrt(Math.min(v,maxL)/maxL)).toFixed(2)},eg);e._r=k;e._v=v;e._f=f.p.n;e.style.setProperty('--d',(0.9+i*0.03).toFixed(2)+'s');edges.push(e)});
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
  const both=firms.filter(f=>f.rt>0);
  const idle=`${both.length} of the ${firms.length} firms paid by the business-backed and conservative side also work for Democrats or progressives this cycle. Tap any name to trace its money.`;
  const nameR=k=>RIGHT.find(r=>r[0]===k)[1];
  const describe=(key,val,vis)=>{
    if(key==='f'){const f=firms.find(x=>x.p.n===val);const ls=Object.entries(f.L).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${K(v)}`).join(', ');
      return `<b>${val}:</b> paid ${K(f.lt)} by ${ls}.`+(f.rt?` Also paid ${K(f.rt)} by ${Object.keys(f.R).map(k=>({DPO:'the Democratic Party',KOT:'Gov. Tina Kotek',PRO:'progressive candidates',LAB:'labor and progressive groups',DEM:'other Democrats'})[k]).join(', ')} this cycle.`:' No Democratic or progressive clients found.')+` <button type="button" class="web-reset" data-open="${val}">Open profile</button>`}
    if(key==='l'){const fs=vis.filter(e=>e._l===val);const tot=fs.reduce((s,e)=>s+e._v,0);const n=new Set(fs.map(e=>e._f));const dem=[...n].filter(x=>firms.find(f=>f.p.n===x).rt>0);
      return `<b>${val}</b> paid ${n.size} firm${n.size===1?'':'s'} ${K(tot)}. ${dem.length?`${dem.length} of them also work for Democrats or progressives: ${dem.join(', ')}.`:'None of them has Democratic or progressive clients this cycle.'}`}
    const fs=vis.filter(e=>e._r===val);const n=[...new Set(fs.map(e=>e._f))];
    return `<b>${nameR(val)}:</b> ${n.length} of these firms also took money from this side this cycle (${K(fs.reduce((s,e)=>s+e._v,0))}): ${n.join(', ')}.`};
  WebFX({svg,edges,nodes,status:document.getElementById('hweb-sum'),idle,describe,keys:['f','l','r'],revKey:'r'});
})();
