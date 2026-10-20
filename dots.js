(function(){
  /* Firms paid by the PACs selling the anti-DSA / crime-and-disorder message AND by candidates whose donors overlap with Republican donors.
     PAC side: the Chamber's PAC network, Community Safety Coalition, and Kevin Looper's committees. All years, from ORESTAR via Ballast.
     Candidate side: 2026 business-backed candidates (share of donors over $100 who also gave to Republicans or Portland conservatives, from The donors page), Meieran, and Portland conservative candidates. */
  const svg=document.getElementById('dweb'); if(!svg) return;
  const PACS=[
    ['UFP','Chamber PAC','United for Portland Action Fund'],
    ['CPF','Coalition for Portland’s Future','Chamber PAC for the 2024 council slate'],
    ['PAL','Portland Alliance PAC','Chamber-run; Amazon, Intel, Nike money'],
    ['OPA','Oregon Prosperity Action Fund','Chamber-run'],
    ['GOP','goPDX','Funds the DitchMitch billboards'],
    ['CSC','Community Safety Coalition','Measure to move climate money to police'],
    ['PAP','Portland Accountability PAC','Looper; backed Gonzalez, 2022'],
    ['FMC','Fixing Multnomah County','Pays Looper’s firm, Wheelhouse']];
  const CANDS=[['ZIM','Eric Zimmerman','49% GOP-linked donors'],['ARN','Eli Arnold','45%'],['TOR','Kellie Torres','42%'],['BRI','Julia Brim-Edwards','42%'],['CLA','Olivia Clark','35%'],['NOV','Steve Novick','26% of new donors'],['MEI','Sharon Meieran','not measured'],['CON','Portland conservatives','Gonzalez, Vasquez, Treece, Mozyrsky']];
  // firm: [name, who runs it, pac edges [key, $, yrs], candidate edges [key, $, yrs]]
  const F=[
    ['Swift Public Affairs','Run by Amy Ruiz, ex-chief of staff to Mayor Sam Adams, and Jennifer Williamson, former Democratic House Majority Leader',[['CPF',173784,'2024'],['PAL',10000,'2025']],[['BRI',26000,'2026'],['CON',54709,'2024 (Mozyrsky)']]],
    ['Morel Ink','Union print shop (PPPWU District Council 2)',[['CPF',116825,'2024'],['CSC',7933,'2026']],[['TOR',11362,'2026'],['BRI',8782,'2026'],['ARN',7663,'2026'],['NOV',3212,'2026'],['CLA',2832,'2026'],['CON',102163,'2024–26 (Treece, Mozyrsky)']]],
    ['The Rally Point','The Portland Mercury says it is run by Annie Ellison, who led Emerge Oregon until 2024. An Oct 6 email from a Rally Point address rallied Go Portland Go’s block captains for Kellie Torres (screenshot posted on Bluesky); Go Portland Go reports no payment to the firm',[['OPA',20100,'2026'],['GOP',6000,'2026'],['PAL',2705,'2026']],[['ARN',2000,'2024'],['ZIM',500,'2024']]],
    ['Springwater Partners','Owner Paige Richardson sits on the Emerge Oregon board',[['CSC',10000,'2026']],[['CLA',217177,'2024–26'],['TOR',98816,'2026']]],
    ['CN4 Partners','Founder Dean Nielsen (Clinton ’92, Progressive Majority); files as Cerillion N4',[['CSC',11000,'2022']],[['ZIM',69243,'2024–26'],['CON',1773967,'2022–24 (Vasquez, Gonzalez, Mozyrsky)']]],
    ['Wheelhouse Northwest','Kevin Looper, co-founder of People for Portland',[['PAP',99500,'2022–24'],['FMC',24500,'2025–26'],['PAL',4117,'2022']],[['MEI',30000,'2020–26']]],
    ['Polity Staffing','Campaign payroll',[['FMC',31292,'2025–26']],[['MEI',33271,'2026'],['BRI',16622,'2026']]],
    ['Purple State Strategies','Texting, ads and voter data, Vancouver WA',[['FMC',375,'2026']],[['ARN',27903,'2024–26'],['ZIM',10093,'2024–26'],['BRI',4500,'2026'],['MEI',3900,'2022'],['CON',137503,'2022–25 (Gonzalez, Mozyrsky, Vasquez)']]],
    ['Elevated Campaigns','Mail, ads and polling, Chicago',[['CPF',739202,'2024'],['UFP',566866,'2020, 2024'],['PAL',19700,'2026']],[['CON',2500,'2026 (Treece)']]]];
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  const tx=(p,x,y,s,a)=>{const t=el('text',Object.assign({x,y},a),p);t.textContent=s;return t};
  const W=1240,H=640,lx=300,mx=600,rx=900;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const py={};PACS.forEach((p,i)=>py[p[0]]=50+i*(540/(PACS.length-1)));
  const cy={};CANDS.forEach((c,i)=>cy[c[0]]=50+i*(540/(CANDS.length-1)));
  F.forEach((f,i)=>{f.y=60+i*(520/(F.length-1))});
  const w=v=>(1+6*Math.sqrt(Math.min(v,300000)/300000)).toFixed(2);
  const eg=el('g',{fill:'none'},svg),ng=el('g',{},svg),edges=[],nodes=[];
  F.forEach(f=>{
    f[2].forEach(([k,v,y])=>{const e=el('path',{d:`M${lx+14},${py[k]} C${lx+150},${py[k]} ${mx-150},${f.y} ${mx-8},${f.y}`,class:'de de-l','stroke-width':w(v)},eg);e._a=k;e._v=v;e._f=f[0];e.style.setProperty('--d',(0.05+F.indexOf(f)*0.05).toFixed(2)+'s');el('title',{},e).textContent=`${PACS.find(p=>p[0]===k)[1]} → ${f[0]}: ${K(v)} (${y})`;edges.push(e)});
    f[3].forEach(([k,v,y])=>{const e=el('path',{d:`M${mx+8},${f.y} C${mx+150},${f.y} ${rx-150},${cy[k]} ${rx-14},${cy[k]}`,class:'de de-r','stroke-width':w(v)},eg);e._b=k;e._v=v;e._f=f[0];e.style.setProperty('--d',(0.8+F.indexOf(f)*0.05).toFixed(2)+'s');el('title',{},e).textContent=`${CANDS.find(c=>c[0]===k)[1]} → ${f[0]}: ${K(v)} (${y})`;edges.push(e)});
  });
  tx(svg,lx,20,'PACS SELLING THE MESSAGE',{class:'h-hd','text-anchor':'end'});
  tx(svg,mx,20,'FIRMS',{class:'h-hd','text-anchor':'middle'});
  tx(svg,rx,20,'CANDIDATES, WITH GOP-LINKED DONOR SHARE',{class:'h-hd'});
  PACS.forEach(([k,n,s])=>{const g=el('g',{class:'h-c',tabindex:0,role:'button'},ng);el('circle',{cx:lx,cy:py[k],r:11,class:'d-pac'},g);tx(g,lx-20,py[k]+2,n,{class:'h-n','text-anchor':'end'});tx(g,lx-20,py[k]+18,s,{class:'h-s','text-anchor':'end'});g._a=k;nodes.push(g)});
  CANDS.forEach(([k,n,s])=>{const g=el('g',{class:'h-c',tabindex:0,role:'button'},ng);el('circle',{cx:rx,cy:cy[k],r:11,class:'h-cl'},g);tx(g,rx+20,cy[k]+2,n,{class:'h-n'});tx(g,rx+20,cy[k]+18,s,{class:'h-s'});g._b=k;nodes.push(g)});
  F.forEach(f=>{const g=el('g',{class:'h-f',tabindex:0,role:'button'},ng);el('circle',{cx:mx,cy:f.y,r:8,class:'d-firm'},g);el('rect',{x:mx-60,y:f.y-12,width:120,height:24,fill:'transparent'},g);tx(g,mx,f.y-13,f[0],{class:'h-fn','text-anchor':'middle'});g._f=f[0];nodes.push(g)});
  const pn=k=>PACS.find(p=>p[0]===k)[1],cn=k=>CANDS.find(c=>c[0]===k)[1];
  const describe=(key,val,vis)=>{
    if(key==='f'){const f=F.find(x=>x[0]===val);const a=f[2].reduce((s,x)=>s+x[1],0),b=f[3].reduce((s,x)=>s+x[1],0);
      return `<b>${val}:</b> ${K(a)} from ${f[2].map(x=>pn(x[0])).join(', ')}; ${K(b)} from ${f[3].map(x=>cn(x[0])).join(', ')}. <button type="button" class="web-reset" data-open="${val}">Open profile</button>`}
    if(key==='a'){const fs=vis.filter(e=>e._a===val);return `<b>${pn(val)}</b> paid ${fs.length} of these firms ${K(fs.reduce((s,e)=>s+e._v,0))}: ${fs.map(e=>e._f).join(', ')}.`}
    const fs=vis.filter(e=>e._b===val);return `<b>${cn(val)}</b> paid ${fs.length} of these firms ${K(fs.reduce((s,e)=>s+e._v,0))}: ${fs.map(e=>e._f).join(', ')}.`};
  window.DOTSFX=WebFX({svg,edges,nodes,status:document.getElementById('dweb-sum'),idle:'Tap a PAC, a firm or a candidate to trace the money.',describe,keys:['f','a','b'],revKey:'b'});
  // plain-language list under the graphic
  const box=document.getElementById('dlist');
  if(box){const pn=k=>PACS.find(p=>p[0]===k)[1],cn=k=>{const c=CANDS.find(c=>c[0]===k);return c[1]+(/%/.test(c[2])?` (${c[2].replace(' GOP-linked donors','')})`:'')};
    box.innerHTML=F.map(f=>`<div class="dcard"><h4>${f[0]}</h4><p class="dc-who">${f[1]}</p>
      <p><span class="dc-l">Paid by the PACs</span>${f[2].map(([k,v,y])=>`${pn(k)} ${K(v)} <small>${y}</small>`).join(' · ')}</p>
      <p><span class="dc-r">Paid by the candidates</span>${f[3].map(([k,v,y])=>`${cn(k)} ${K(v)} <small>${y}</small>`).join(' · ')}</p></div>`).join('')}
})();
/* tabs in the top section */
(function(){const tabs=[...document.querySelectorAll('.vtabs [role=tab]')];if(!tabs.length)return;
  const show=t=>{tabs.forEach(u=>{const on=u===t;u.setAttribute('aria-selected',on);u.tabIndex=on?0:-1;document.getElementById(u.getAttribute('aria-controls')).hidden=!on});
    if(t.id==='t-dots'&&window.DOTSFX)window.DOTSFX.replayAll()};
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>show(t));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];show(n);n.focus()}})})})();
