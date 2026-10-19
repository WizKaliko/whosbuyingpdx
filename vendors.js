(function(){
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  const tx=(p,x,y,s,a)=>{const t=el('text',Object.assign({x,y},a),p);t.textContent=s;return t};
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);

  /* ---------- the money chain: two linked diagrams ---------- */
  const CAND={'Kellie Torres':42,'Olivia Clark':35,'Eli Arnold':45,'Julia Brim-Edwards':42,'Steve Novick':26,'Eric Zimmerman':49};
  const RACE={'Kellie Torres':'Council D3','Steve Novick':'Council D3','Olivia Clark':'Council D4','Eli Arnold':'Council D4','Eric Zimmerman':'Council D4','Julia Brim-Edwards':'County Chair'};
  const SUB={'United for Portland':'the Chamber’s political arm','Chamber PAC':'United for Portland Action Fund','Unity PAC':'business + public-safety unions','goPDX':'Chamber-funded','Portland Alliance PAC':'corporate PAC',
    'DitchMitch / fix multCo':'billboard committees','Coalition for Portland’s Future':'Chamber-funded','Go Portland Go':'backs the council slate',
    'Positivity PAC':'Jessie Burke','Oregon Prosperity Action Fund':'','Hamburger Group Creative':'Washington, DC','Affiliated Media':'billboards','Springwater Partners':'general consultant',
    'Mission Control':'mail, Connecticut','Untidy Origins':'digital and TV ads','Leverenz & Associates':'public relations','Patinkin Research':'polling','Winning Mark':'consultant',
    'Clean Sweep Campaigns':'mail, California','Swift Public Affairs':'consultant','Purple State Strategies':'texting, ads, data','The Rally Point':'campaign management',
    'Elevated Campaigns':'mail, ads, polls, Chicago','Bottled Lightning Collective':'mail and digital','CN4 Partners':'mail, Seattle','Berlin Rosen':'ads, New York',
    'Other vendors and staff':'staff, small vendors, fees','Newspaper ads':'local papers','Pam Treece and Rene Gonzalez':'direct gifts','Partnership for Progress':'not a registered committee',
    'Hopkins + Sachs':'mail, Seattle','Eckrosh Marketing':'online ads','We Are PDX':'ads and web','Meta (Facebook ads)':'','Square Cap Media':'video','City Wins':'campaign management','Morel Ink':'printing'};
  function sankey(svg,E,o){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    E=E.filter(e=>e[2]>0).map(e=>e.slice());
    const N={};const node=n=>N[n]||(N[n]={n,in:0,out:0,ins:[],outs:[]});
    E.forEach(e=>{const a=node(e[0]),b=node(e[1]);a.out+=e[2];b.in+=e[2];a.outs.push(e);b.ins.push(e)});
    const nodes=Object.values(N);nodes.forEach(x=>{x.v=Math.max(x.in,x.out);x.d=0});
    for(let i=0;i<8;i++)E.forEach(([a,b])=>{if(N[b].d<N[a].d+1)N[b].d=N[a].d+1});
    const maxD=Math.max(...nodes.map(x=>x.d));nodes.forEach(x=>{if(!x.outs.length)x.d=maxD});
    const cols=[];nodes.forEach(x=>(cols[x.d]=cols[x.d]||[]).push(x));
    const {W,X0,X1,scale,SLOT}=o, nw=11, top=34, gap=8;
    const xAt=d=>X0+d*(X1-X0)/maxD;
    const h=x=>Math.max(2,x.v*scale);
    const place=c=>{let y=top;c.forEach(x=>{const s=Math.max(h(x),SLOT);x.y=y+(s-h(x))/2;x.h=h(x);x.oi=0;x.oo=0;y+=s+gap});return y};
    const bc=x=>x.ins.reduce((s,e)=>s+(N[e[0]].y+N[e[0]].h/2)*e[2],0)/Math.max(1,x.in);
    let H=0;
    cols.forEach((c,d)=>{if(!c)return;
      if(d===0) c.sort(o.order0||((a,b)=>b.v-a.v));
      else c.sort((a,b)=>(a.n==='Other vendors and staff')-(b.n==='Other vendors and staff')||bc(a)-bc(b));
      H=Math.max(H,place(c))});
    svg.setAttribute('viewBox',`0 0 ${W} ${H+8}`);
    (o.heads||[]).forEach(([d,t,anc])=>tx(svg,d===0?xAt(0)-8+(o.labelShift||0):xAt(d)+(anc==='end'?nw:0),14,t,{class:'vw-h','text-anchor':anc||'start'}));
    nodes.forEach(x=>{x.outs.sort((a,b)=>N[a[1]].y-N[b[1]].y);x.ins.sort((a,b)=>N[a[0]].y-N[b[0]].y)});
    nodes.forEach(a=>a.outs.forEach(e=>{e._ha=a.h*e[2]/a.v;e._y0=a.y+a.oo;a.oo+=e._ha}));
    nodes.forEach(b=>b.ins.forEach(e=>{e._hb=b.h*e[2]/b.v;e._y1=b.y+b.oi;b.oi+=e._hb}));
    const g=el('g',{},svg),ribs=[];
    nodes.forEach(a=>a.outs.forEach(e=>{const b=N[e[1]];const x0=xAt(a.d)+nw,x1=xAt(b.d),mx=(x0+x1)/2;
      const p=el('path',{d:`M${x0},${e._y0} C${mx},${e._y0} ${mx},${e._y1} ${x1},${e._y1} L${x1},${e._y1+e._hb} C${mx},${e._y1+e._hb} ${mx},${e._y0+e._ha} ${x0},${e._y0+e._ha} Z`,
        class:'rib'+(b.n==='Other vendors and staff'?' rib-oth':'')+(a.d===0&&o.srcClass?' rib-src':'')},g);
      p._a=a.n;p._b=b.n;el('title',{},p).textContent=`${a.n} → ${b.n}: $${e[2].toLocaleString()}`;ribs.push(p)}));
    nodes.forEach(x=>{const X=xAt(x.d),cy=x.y+x.h/2;
      const kind=x.d===maxD?(x.n==='Other vendors and staff'?'n-oth':'n-firm'):(x.d===0&&o.srcClass?'n-src':'n-cmte');
      const r=el('rect',{x:X,y:x.y,width:nw,height:x.h,class:kind},svg);r._n=x.n;
      const left=x.d===0, anchor=left?'end':'start', lx=left?X-8:X+nw+7;
      const owed=(o.owed||{})[x.n];
      const lines=[[x.n,'vw-n'+(x.n==='Other vendors and staff'?' dim':'')+(x.d>0&&x.d<maxD?' sm':'')]];
      let sub=K(x.d===maxD?x.in:x.v);
      if(owed) sub=K(x.in)+' + '+K(owed)+' owed';
      const mid=x.d>0&&x.d<maxD;const extra=RACE[x.n]||(mid?'':SUB[x.n]); if(extra) sub+=' · '+extra;
      if(mid&&x.n.length>22){const w=x.n.split(' '),m=Math.ceil(w.length/2);lines.splice(0,1,[w.slice(0,m).join(' '),lines[0][1]],[w.slice(m).join(' '),lines[0][1]])}
      lines.push([sub,'vw-s']);
      const y0=cy-((lines.length-1)*13)/2+4;
      lines.forEach((l,i)=>{const t=tx(svg,lx,y0+i*13,l[0],{class:l[1]+(x.d>0&&x.d<maxD?' halo':''),'text-anchor':anchor});t._n=x.n});
      if(o.donorBars&&x.n in CAND){const bx=6;el('rect',{x:bx,y:cy-5,width:60,height:10,class:'d-bg'},svg);el('rect',{x:bx,y:cy-5,width:60*CAND[x.n]/100,height:10,class:'d-fg'},svg);tx(svg,bx+66,cy+4,CAND[x.n]+'%',{class:'vw-p'})}
    });
    const focus=n=>ribs.forEach(r=>r.classList.toggle('fade',!!n&&r._a!==n&&r._b!==n));
    svg.onpointerover=e=>{const t=e.target;if(t._n)focus(t._n);else if(t.classList&&t.classList.contains('rib'))ribs.forEach(r=>r.classList.toggle('fade',r!==t))};
    svg.onpointerleave=()=>focus(null);
    return nodes.filter(x=>x.d===maxD&&x.n!=='Other vendors and staff').reduce((s,x)=>s+x.in,0);
  }
  const svgP=document.getElementById('vweb'), svgC=document.getElementById('cweb');
  function draw(key){
    if(!window.NET) return;
    const Y=window.NET[key];
    const isCand=e=>(e[0] in CAND)||e[0]==='Candidates’ donors';
    const pac=Y.edges.filter(e=>!isCand(e)), cand=Y.edges.filter(e=>(e[0] in CAND));
    const k=0.00052;
    const a=svgP?sankey(svgP,pac,{W:1240,X0:250,X1:1000,scale:k,SLOT:30,srcClass:true,owed:Y.owed,
      heads:[[0,'WHERE THE MONEY STARTS','end']]}):0;
    const b=svgC?sankey(svgC,cand,{W:1240,X0:330,X1:1000,scale:k,SLOT:34,donorBars:true,owed:Y.owed,
      order0:(x,y)=>y.v-x.v, heads:[[0,'CANDIDATE','end']]}):0;
    if(svgC){tx(svgC,6,14,'DONOR OVERLAP',{class:'vw-h'})}
    [svgP,svgC].forEach(s=>s&&tx(s,1000,14,'WHO GETS PAID',{class:'vw-h'}));
    const owedTot=Object.values(Y.owed||{}).reduce((s,v)=>s+v,0);
    const note=document.getElementById('vw-note');
    if(note) note.textContent=`Both diagrams use the same scale. Named firms received ${K(a+b)} ${key==='y26'?'so far this cycle':'in 2024'}${owedTot?', plus '+K(owedTot)+' in bills reported but not yet paid':''}. Hover or tap a name to follow its money.`;
  }
  const tabs=[...document.querySelectorAll('[data-yr]')];
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(u=>u.setAttribute('aria-pressed',String(u===t)));draw(t.dataset.yr)}));
  draw('y26');

  /* ---------- firm cards: who paid each firm this cycle, across every committee ---------- */
  const TAGN={b:'Business-backed side, 2026',c:'Portland conservatives',p:'Democratic, labor, progressive',o:'Other campaigns and measures'};
  const fl=document.getElementById('firm-list');
  if(fl&&window.FIRMS){
    const sideOf=f=>f.pay.filter(p=>p[1]==='b').reduce((s,p)=>s+p[2],0);
    [...window.FIRMS].sort((a,b)=>sideOf(b)-sideOf(a)).forEach(f=>{
      const tot=f.pay.reduce((s,p)=>s+p[2],0)||1;
      const by={b:0,c:0,p:0,o:0};f.pay.forEach(p=>by[p[1]]+=p[2]);
      const ord={b:0,c:1,p:2,o:3};
      const rows=[...f.pay].sort((a,b)=>ord[a[1]]-ord[b[1]]||b[2]-a[2]);
      const d=document.createElement('article');d.className='firm';
      d.innerHTML=`<header><h3>${f.n}</h3><span class="race">${f.what}</span></header>
        <p class="fm-tot"><b>${K(tot)}</b> from Oregon campaigns and PACs since Jan 2025<br><span class="fm-b">${Math.round(100*by.b/tot)}% from Portland’s business-backed side</span></p>
        <div class="fm-bar" role="img" aria-label="${['b','c','p','o'].filter(t=>by[t]).map(t=>TAGN[t]+' '+K(by[t])).join(', ')}">${['b','c','p','o'].filter(t=>by[t]).map(t=>`<i class="t-${t}" style="width:${(100*by[t]/tot).toFixed(1)}%"></i>`).join('')}</div>
        <ul class="fm-cl">${rows.map(p=>`<li class="c-${p[1]}"><span>${p[0]}</span><b>${p[2]?K(p[2]):'—'}${p[3]?`<small>+${K(p[3])} owed</small>`:''}</b></li>`).join('')}</ul>
        ${f.note?`<p class="fm-note">${f.note}</p>`:''}${f.earlier?`<p class="fm-life">${f.earlier}</p>`:''}`;
      fl.appendChild(d);
    });
  }
  const todo=document.getElementById('todo');
  if(todo){
    ['Every city and county candidate committee, so firms that work across many campaigns show up as hubs.',
     'Go Portland Go’s own donors, run through the same Republican-overlap test as the candidates.',
     'Bills reported as owed (about $375K, mostly to Hamburger Group Creative and Affiliated Media) once they’re paid.',
     'Partnership for Progress, Go Portland Go’s biggest funder, isn’t a registered Oregon committee, so ORESTAR doesn’t show its donors.']
     .forEach(s=>{const li=document.createElement('li');li.textContent=s;todo.appendChild(li)});
  }
})();
