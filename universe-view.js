(function(){
  const svg=document.getElementById('uni'); if(!svg||!window.UNI) return;
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);
  const UNIT=2500, ORDER=['b','r','m','c','p','o'];
  const W=1180, L=150, R=1030, MID=0;
  const firms=window.UNI.map(f=>{
    const by={b:0,r:0,m:0,c:0,p:0,o:0};f.pay.forEach(p=>by[p[1]]+=p[2]);
    const tot=Object.values(by).reduce((a,b)=>a+b,0);
    const right=by.b+by.c, left=by.r+by.p, frac=(right+left)?right/(right+left):.5;
    // dots: one per $2,500, apportioned by category (largest remainder), at least one
    const n=Math.max(1,Math.round(tot/UNIT));const raw=ORDER.map(k=>by[k]/tot*n);let cnt=raw.map(Math.floor);
    let left2=n-cnt.reduce((a,b)=>a+b,0);raw.map((v,i)=>[v-Math.floor(v),i]).sort((a,b)=>b[0]-a[0]).slice(0,left2).forEach(([,i])=>cnt[i]++);
    ORDER.forEach((k,i)=>{if(by[k]>0&&cnt[i]===0&&(k==='b'||k==='r'||k==='m')){cnt[i]=1}});
    const dots=[];ORDER.forEach((k,i)=>{for(let j=0;j<cnt[i];j++)dots.push(k)});
    const race=f.pay.filter(p=>'brm'.includes(p[1]));
    return Object.assign({},f,{by,tot,frac,dots,r:3.25*Math.sqrt(dots.length)+5,race});
  });
  // layout: x by client mix, then relax vertically so clusters and their labels don't collide
  firms.forEach((f,i)=>{f.x=L+f.frac*(R-L);f.y=(i%2?1:-1)*(10+i*3)});
  const raceTxt=f=>f.race.slice().sort((a,b)=>b[2]-a[2]).slice(0,3).map(p=>/PAC|Portland|Fund|Coalition|multCo|DitchMitch|goPDX|Go Portland/.test(p[0])?p[0]:p[0].split(' ').slice(-1)[0]).join(' · ')+(f.race.length>3?' +'+(f.race.length-3):'');
  firms.forEach(f=>f.bw=Math.max(f.r*2,(f.n.length+6)*7.1,raceTxt(f).length*6.4));
  const box=f=>({w:f.bw,top:f.r,bot:f.r+18+(f.race.length?14:0)});
  for(let it=0;it<1200;it++){
    for(let i=0;i<firms.length;i++)for(let j=i+1;j<firms.length;j++){
      const a=firms[i],b=firms[j],ba=box(a),bb=box(b);
      const dx=b.x-a.x, minx=(ba.w+bb.w)/2+8; if(Math.abs(dx)>=minx) continue;
      const dy=b.y-a.y; const need=dy>=0?(ba.bot+bb.top+14):(bb.bot+ba.top+14);
      if(Math.abs(dy)<need){const push=(need-Math.abs(dy))/2*(dy>=0?1:-1)||(i%2?1:-1);a.y-=push*.5;b.y+=push*.5;
        const px=(minx-Math.abs(dx))*.12*(dx>=0?1:-1);a.x-=px;b.x+=px}
    }
    firms.forEach(f=>{f.x+=(L+f.frac*(R-L)-f.x)*.02;f.y*=.99;f.x=Math.max(f.bw/2+4,Math.min(W-f.bw/2-4,f.x))});
  }
  const minY=Math.min(...firms.map(f=>f.y-f.r)), maxY=Math.max(...firms.map(f=>f.y+box(f).bot));
  const off=60-minY, H=maxY+off+70;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  // spectrum axis
  const ay=H-34;
  el('line',{x1:L,x2:R,y1:ay,y2:ay,class:'u-axis'},svg);
  [[L,'start','Clients mostly Democratic, labor and progressive'],[R,'end','Clients mostly Portland’s business-backed side'],[(L+R)/2,'middle','Even split']].forEach(([x,a,t])=>{const tt=el('text',{x,y:ay+18,'text-anchor':a,class:'u-ax'},svg);tt.textContent=t});
  el('line',{x1:(L+R)/2,x2:(L+R)/2,y1:30,y2:ay,class:'u-mid'},svg);
  const g=el('g',{},svg);
  firms.forEach(f=>{
    const G=el('g',{class:'u-firm'+(f.full?'':' partial'),tabindex:0,role:'button','aria-label':`${f.n}: ${K(f.tot)} from Oregon committees since 2025. Portland race payers: ${f.race.map(p=>p[0]+' '+K(p[2])).join(', ')}`},g);
    const cx=f.x, cy=f.y+off;
    if(!f.full) el('circle',{cx,cy,r:f.r+3,class:'u-ring'},G);
    // sunflower: earliest dots (Portland race money) sit at the center
    const ga=Math.PI*(3-Math.sqrt(5));
    f.dots.forEach((k,i)=>{const rr=3.25*Math.sqrt(i+.5),th=i*ga;el('circle',{cx:cx+rr*Math.cos(th),cy:cy+rr*Math.sin(th),r:1.75,class:'u-d d-'+k},G)});
    const t1=el('text',{x:cx,y:cy+f.r+14,'text-anchor':'middle',class:'u-n'},G);t1.textContent=f.n+'  ';
    const ts=el('tspan',{class:'u-t'},t1);ts.textContent=K(f.tot);
    if(f.race.length){const t2=el('text',{x:cx,y:cy+f.r+28,'text-anchor':'middle',class:'u-p'},G);
      const names=f.race.slice().sort((a,b)=>b[2]-a[2]);
      names.slice(0,3).forEach((p,i)=>{const s=el('tspan',{class:'p-'+p[1]},t2);const nm=/PAC|Portland|Fund|Coalition|multCo|DitchMitch|goPDX|Go Portland/.test(p[0])?p[0]:p[0].split(' ').slice(-1)[0];s.textContent=(i?' · ':'')+nm});
      if(names.length>3){const s=el('tspan',{},t2);s.textContent=' +'+(names.length-3)}}
    G._f=f;
  });
  // detail panel
  const panel=document.getElementById('uni-detail');
  const TAG={b:'Business-backed side, Portland & county races',r:'Progressive side, Portland & county races',m:'Other candidate, county race',c:'Portland conservatives',p:'Democratic, labor, progressive (elsewhere in Oregon)',o:'Other campaigns and measures'};
  function show(f,quiet){
    if(!panel) return;
    const rows=f.pay.slice().sort((a,b)=>ORDER.indexOf(a[1])-ORDER.indexOf(b[1])||b[2]-a[2]);
    panel.innerHTML=`<h4>${f.n} <span>${K(f.tot)} since Jan 2025</span></h4>
      <ul>${rows.map(p=>`<li class="c-${p[1]}"><i></i><span>${p[0]}<small>${TAG[p[1]]}</small></span><b>${K(p[2])}</b></li>`).join('')}</ul>
      ${f.note?`<p>${f.note}</p>`:''}${f.full?'':'<p class="u-part">Partial: Portland race payments are complete; this firm’s other Oregon clients come from saved records through mid-September or haven’t been searched yet.</p>'}`;
    if(!quiet)[...svg.querySelectorAll('.u-firm')].forEach(n=>n.classList.toggle('dim',n._f!==f));
  }
  svg.addEventListener('click',e=>{const G=e.target.closest('.u-firm');if(G)show(G._f)});
  svg.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target._f){e.preventDefault();show(e.target._f)}});
  svg.addEventListener('pointerover',e=>{const G=e.target.closest('.u-firm');if(G&&matchMedia('(hover:hover)').matches)show(G._f)});
  show(firms.find(f=>f.n==='Untidy Origins'),true);
  svg.addEventListener('pointerleave',()=>[...svg.querySelectorAll('.u-firm')].forEach(n=>n.classList.remove('dim')));
  const sum=document.getElementById('uni-sum');
  if(sum){const tot=firms.reduce((s,f)=>s+f.tot,0),race=firms.reduce((s,f)=>s+f.by.b+f.by.r+f.by.m,0);
    sum.textContent=`${firms.length} firms. ${K(tot)} paid to them by Oregon campaigns and PACs since January 2025, ${K(race)} of it from Portland’s city and county races.`}
})();
