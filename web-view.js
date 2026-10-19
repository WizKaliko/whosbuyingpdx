(function(){
  const svg=document.getElementById('rweb'); if(!svg||!window.UNI) return;
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  const tx=(p,x,y,s,a)=>{const t=el('text',Object.assign({x,y},a),p);t.textContent=s;return t};
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);
  const MERGE={'DitchMitch':'DitchMitch / fix multCo','fix multCo':'DitchMitch / fix multCo'};
  const OVER={'Kellie Torres':42,'Olivia Clark':35,'Eli Arnold':45,'Julia Brim-Edwards':42,'Steve Novick':26,'Eric Zimmerman':49};
  const SUB={'Kellie Torres':'Council D3','Steve Novick':'Council D3','Olivia Clark':'Council D4','Eli Arnold':'Council D4','Eric Zimmerman':'Council D4','Julia Brim-Edwards':'County Chair',
    'Mitch Green':'Council D4','Jamey Evenstar':'Council D4','Angelita Morillo':'Council D3','Tiffany Koyama Lane':'Council D3','Shannon Singleton':'County Chair','Sharon Meieran':'County Chair, neither slate',
    'Unity PAC':'Chamber-funded PAC','DitchMitch / fix multCo':'Chamber-funded billboards','Go Portland Go':'PAC backing the slate','Portland Alliance PAC':'corporate PAC',
    'Oregon Prosperity Action Fund':'funded by Portland Alliance PAC','goPDX':'Chamber-funded','Coalition for Portland’s Future':'Chamber PAC, 2025'};
  // build payer and firm nodes from UNI (Portland race money only)
  const P={},F=[],E=[];
  window.UNI.forEach(f=>{
    const race=f.pay.filter(p=>'brm'.includes(p[1]));
    if(!race.length) return;
    const fr={n:f.n,full:f.full,note:f.note,agg:f.agg,pay:f.pay,biz:0,prog:0,mid:0,owed:0,tot:f.pay.reduce((s,p)=>s+p[2],0)};
    race.forEach(([nm,tag,v,ow])=>{nm=MERGE[nm]||nm;const p=P[nm]||(P[nm]={n:nm,tag,v:0,edges:[]});p.v+=v;fr.owed+=ow||0;
      const e={p:nm,f:f.n,v,tag,ow:ow||0};E.push(e);p.edges.push(e);if(tag==='b')fr.biz+=v;else if(tag==='r')fr.prog+=v;else fr.mid+=v});
    fr.race=fr.biz+fr.prog+fr.mid;F.push(fr);
  });
  // merge duplicate edges created by MERGE
  const EM={};E.forEach(e=>{const k=e.p+'|'+e.f;if(EM[k]){EM[k].v+=e.v;EM[k].ow+=e.ow}else EM[k]=Object.assign({},e)});const EE=Object.values(EM);
  const W=1360,LX=300,RX=1110,top=64,H0=40;
  const left=Object.values(P).filter(p=>p.tag==='b').sort((a,b)=>b.v-a.v);
  const right=Object.values(P).filter(p=>p.tag!=='b').sort((a,b)=>(a.tag==='m')-(b.tag==='m')||b.v-a.v);
  const pr=v=>Math.max(4,Math.sqrt(v)/16);
  const fr_=v=>Math.max(4,Math.sqrt(v)/17);
  const stack=(arr,gap)=>{let y=top;arr.forEach(p=>{const r=pr(p.v);p.y=y+Math.max(r,16);y+=Math.max(2*r,32)+gap});return y};
  const hL=stack(left,8), hR=stack(right,8);
  // firm x by business share; one-sided firms sit in a column next to their side
  F.forEach(f=>{f.share=(f.biz)/(f.biz+f.prog+f.mid||1);
    f.col=f.agg?'a':f.share>=0.999?'b':f.share<=0.001?'r':'x';
    f.x=f.col==='b'?500:f.col==='r'?930:f.col==='x'?780+(1-f.share)*60:0;
    const ys=EE.filter(e=>e.f===f.n).map(e=>[P[e.p].y,e.v]);f.by=ys.reduce((s,[y,v])=>s+y*v,0)/ys.reduce((s,[,v])=>s+v,0)});
  let H=Math.max(hL,hR)+30;
  const aggs=F.filter(f=>f.col==='a');aggs.forEach((f,i)=>{f.x=440+i*(560/Math.max(1,aggs.length-1));f.y=H+40+fr_(f.race)});
  if(aggs.length){H=Math.max(...aggs.map(f=>f.y+fr_(f.race)))+48;}
  // vertical placement within each column: start at barycenter, then resolve overlaps
  ['b','x','r'].forEach(c=>{const col=F.filter(f=>f.col===c).sort((a,b)=>a.by-b.by);
    col.forEach(f=>f.y=f.by);
    for(let it=0;it<200;it++){for(let i=1;i<col.length;i++){const a=col[i-1],b=col[i],need=fr_(a.race)+fr_(b.race)+(c==='x'?30:22);if(b.y-a.y<need){const d=(need-(b.y-a.y))/2;a.y-=d;b.y+=d}}
      col.forEach(f=>f.y=Math.max(top+fr_(f.race),Math.min(Math.max(hL,hR)-fr_(f.race),f.y)))}
  });
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  tx(svg,LX,22,'BUSINESS-BACKED CAMPAIGNS AND PACS',{class:'r-h','text-anchor':'end'});
  if(aggs.length) tx(svg,(LX+RX)/2,Math.max(hL,hR)+44,'NOT FIRMS: PAID TO STAFF AND AD PLATFORMS DIRECTLY',{class:'r-h','text-anchor':'middle'});
  tx(svg,(LX+RX)/2,22,'FIRMS',{class:'r-h','text-anchor':'middle'});
  tx(svg,RX,22,'PROGRESSIVE CANDIDATES',{class:'r-h'});
  tx(svg,LX,38,'% = donor overlap with Republicans',{class:'r-hs','text-anchor':'end'});
  const gE=el('g',{},svg),gN=el('g',{},svg);
  const FN={};F.forEach(f=>FN[f.n]=f);
  const lines=[];
  EE.forEach(e=>{const p=P[e.p],f=FN[e.f];const side=p.tag==='b'?LX:RX;const x0=side,x1=f.x,mx=(x0+x1)/2;
    const w=Math.max(1,Math.sqrt(e.v)/9);
    const l=el('path',{d:`M${x0},${p.y} C${mx},${p.y} ${mx},${f.y} ${x1},${f.y}`,class:'r-e r-e-'+e.tag,'stroke-width':w},gE);
    l._p=e.p;l._f=e.f;el('title',{},l).textContent=`${e.p} → ${e.f}: $${Math.round(e.v).toLocaleString()} paid`+(e.ow?`, $${Math.round(e.ow).toLocaleString()} more owed`:'');lines.push(l);
    if(e.ow){const off=w/2+Math.sqrt(e.ow)/18+2;const l2=el('path',{d:`M${x0},${p.y+off} C${mx},${p.y+off} ${mx},${f.y+off} ${x1},${f.y+off}`,class:'r-e r-owed','stroke-width':Math.max(1,Math.sqrt(e.ow)/9)},gE);l2._p=e.p;l2._f=e.f;lines.push(l2)}});
  const all=[];
  const payer=(p,x,anchor)=>{const G=el('g',{class:'r-n',tabindex:0},gN);G._p=p.n;all.push(G);
    el('circle',{cx:x,cy:p.y,r:pr(p.v),class:'r-p r-p-'+p.tag},G);
    const lx=anchor==='end'?x-pr(p.v)-8:x+pr(p.v)+8;
    tx(G,lx,p.y-1,p.n,{class:'r-pn','text-anchor':anchor});
    tx(G,lx,p.y+12,K(p.v)+(SUB[p.n]?' · '+SUB[p.n]:''),{class:'r-ps','text-anchor':anchor});
    if(OVER[p.n]){const ox=anchor==='end'?lx-(p.n.length*8.3)-6:lx;tx(G,ox,p.y-1,OVER[p.n]+'%',{class:'r-po','text-anchor':'end'})}};
  left.forEach(p=>payer(p,LX,'end'));right.forEach(p=>payer(p,RX,'start'));
  F.forEach(f=>{const G=el('g',{class:'r-n r-f'+(f.agg?' r-agg':''),tabindex:0,role:'button'},gN);G._f=f.n;all.push(G);
    const r=fr_(f.race);
    if(f.biz&&(f.prog||f.mid)){// split dot: business share in lavender, the rest in white
      el('circle',{cx:f.x,cy:f.y,r,class:'r-fd r-fd-r'},G);
      const a=2*Math.PI*f.share, x2=f.x+r*Math.sin(a), y2=f.y-r*Math.cos(a);
      el('path',{d:`M${f.x},${f.y} L${f.x},${f.y-r} A${r},${r} 0 ${a>Math.PI?1:0} 1 ${x2},${y2} Z`,class:'r-fd r-fd-b'},G);
    } else el('circle',{cx:f.x,cy:f.y,r,class:'r-fd r-fd-'+(f.biz?'b':f.prog?'r':'m')},G);
    if(!f.full) el('circle',{cx:f.x,cy:f.y,r:r+3,class:'r-ring'},G);
    let anchor='start',lx=f.x+r+7,ly=f.y+4;
    
    if(f.col==='x'||f.col==='a'){anchor='middle';lx=f.x;ly=f.y+r+13}
    const mid=f.col==='x'||f.col==='a';const t=tx(G,lx,ly-(mid?0:5),f.n,{class:'r-fn','text-anchor':anchor});
    tx(G,lx,ly+(mid?12:8),K(f.race)+(f.owed?' + '+K(f.owed)+' owed':'')+(f.col==='x'?' · '+Math.round(100*f.share)+'% business side':''),{class:'r-fs','text-anchor':anchor});
    G._x=f.x;G._y=f.y;G._r=r;
  });
  // focus: hover/tap a node to see only its connections and fill the panel
  const panel=document.getElementById('rweb-detail');
  const ORD=['b','r','m','c','p','o'];
  const TAG={b:'Business-backed side, Portland & county races',r:'Progressive side, Portland & county races',m:'Other candidate, county race',c:'Portland conservatives',p:'Democratic, labor, progressive elsewhere in Oregon',o:'Other campaigns and measures'};
  function focus(key,val){
    lines.forEach(l=>l.classList.toggle('fade',!!key&&l['_'+key]!==val));
    const keep=new Set();if(key)lines.forEach(l=>{if(l['_'+key]===val){keep.add('p:'+l._p);keep.add('f:'+l._f)}});
    all.forEach(G=>G.classList.toggle('fade',!!key&&!keep.has(G._p?'p:'+G._p:'f:'+G._f)));
  }
  function panelFirm(f){if(!panel)return;const rows=f.pay.slice().sort((a,b)=>ORD.indexOf(a[1])-ORD.indexOf(b[1])||b[2]-a[2]);
    panel.innerHTML=`<h4>${f.n}<span>${K(f.race)} from Portland city and county races · ${K(f.tot)} from all Oregon committees since Jan 2025</span></h4>
      <ul>${rows.map(p=>`<li class="c-${p[1]}"><i></i><span>${p[0]}<small>${TAG[p[1]]}</small></span><b>${K(p[2])}</b></li>`).join('')}</ul>
      ${f.note?`<p>${f.note}</p>`:''}${f.full?'':'<p class="u-part">Portland race payments are complete. This firm’s other Oregon clients come from saved records through mid-September or haven’t been searched yet.</p>'}`}
  function panelPayer(p){if(!panel)return;const es=p.edges.slice().sort((a,b)=>b.v-a.v);
    panel.innerHTML=`<h4>${p.n}<span>${K(p.v)} paid to the firms shown since Jan 2025${SUB[p.n]?' · '+SUB[p.n]:''}</span></h4>
      <ul>${es.map(e=>`<li class="c-${e.tag}"><i></i><span>${e.f}</span><b>${K(e.v)}</b></li>`).join('')}</ul>`}
  const pop=document.getElementById('rweb-pop');
  function openPop(G){if(!pop)return;const f=FN[G._f];
    const rows=f.pay.slice().sort((a,b)=>ORD.indexOf(a[1])-ORD.indexOf(b[1])||b[2]-a[2]);const mx=Math.max(...rows.map(p=>p[2]+(p[3]||0)));
    pop.innerHTML=`<button type="button" class="pop-x" aria-label="Close">×</button><h4>${f.n}</h4>
      <p class="pop-t"><b>${K(f.race)}</b> from Portland city and county races${f.owed?' (+'+K(f.owed)+' owed)':''}<br>${f.agg?'':`<b>${K(f.tot)}</b> from all Oregon committees since Jan 2025`}</p>
      <ul>${rows.map(p=>`<li class="c-${p[1]}"><span>${p[0]}</span><b>${K(p[2])}${p[3]?' <small>+'+K(p[3])+' owed</small>':''}</b><em><i style="width:${(100*p[2]/mx).toFixed(1)}%"></i>${p[3]?`<i class="ow" style="width:${(100*p[3]/mx).toFixed(1)}%"></i>`:''}</em></li>`).join('')}</ul>
      ${f.note?`<p class="pop-n">${f.note}</p>`:''}${f.full?'':'<p class="pop-n">Partial: other Oregon clients from saved records through mid-September.</p>'}`;
    pop.hidden=false;const box=svg.getBoundingClientRect(),wrap=pop.parentElement.getBoundingClientRect(),s=box.width/W;
    let left=box.left-wrap.left+(G._x+G._r+12)*s, topY=box.top-wrap.top+(G._y-30)*s;
    if(left+330>wrap.width) left=box.left-wrap.left+(G._x-G._r-12)*s-330;
    pop.style.left=Math.max(4,left)+'px';pop.style.top=Math.max(4,topY)+'px';
    pop.querySelector('.pop-x').onclick=()=>{pop.hidden=true;focus(null);sticky=null};}
  let sticky=null;
  const pick=(G,click)=>{if(!G){if(click){pop&&(pop.hidden=true);sticky=null;focus(null)}return}
    if(G._f){focus('f',G._f);panelFirm(FN[G._f]);if(click){sticky=G;openPop(G)}}else{focus('p',G._p);panelPayer(P[G._p]);if(click){sticky=G;pop&&(pop.hidden=true)}}};
  svg.addEventListener('click',e=>pick(e.target.closest('.r-n'),true));
  svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e.target.closest('.r-n'),true)}if(e.key==='Escape'&&pop){pop.hidden=true;sticky=null;focus(null)}});
  svg.addEventListener('pointerover',e=>{if(!sticky&&matchMedia('(hover:hover)').matches)pick(e.target.closest('.r-n'))});
  svg.addEventListener('pointerleave',()=>{if(!sticky)focus(null)});
  panelFirm(FN['Untidy Origins']);
})();
