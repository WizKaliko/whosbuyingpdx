
(function(){
  const NS='http://www.w3.org/2000/svg';
  const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
  const css=v=>`var(--${v})`;
  const txt=(p,x,y,s,o)=>{const t=el('text',Object.assign({x,y},o),p);t.textContent=s;return t};

  /* ---------- HERO WEB ---------- */
  // Individual donors to the six candidates whose own gifts to Republican campaigns (2006–2026) match their address, or ZIP+employer.
  // Deduplicated into households (last name + street), and one person at two addresses (home/office, typo, move) counted once. PO boxes match like street addresses. c = candidates; g = $ by target: D Drazan, K Buehler, U Dudley, X other Republicans, O other Portland conservatives (Gonzalez, Vasquez, Mozyrsky, Adams, Treece, 2022 pro-Gonzalez PAC). Amounts deduplicated by transaction ID and rounded (to $250 under $1,000, else to $1,000) so no single donor is identifiable.
  const D=[["ABCNZ",{"O":111000,"K":15000}],["BCT",{"X":65000,"O":25000}],["AN",{"K":41000,"U":24000,"O":2000,"D":1000,"X":250}],["B",{"X":31000,"U":20000,"K":10000,"O":3000}],["NZ",{"O":51000,"X":12000}],["B",{"K":25000,"O":25000,"D":10000}],["B",{"U":16000,"K":12000,"X":12000,"D":11000,"O":6000}],["BC",{"O":26000,"K":25000}],["B",{"O":21000,"X":16000,"D":8000}],["A",{"K":34000,"X":2000,"O":1000,"D":500}],["BNTZ",{"O":17000,"U":10000,"D":5000,"X":4000}],["TZ",{"D":30000,"U":3000,"K":2000,"X":1000}],["BNTZ",{"K":20000,"O":3000,"X":2000}],["T",{"D":7000,"O":6000,"X":5000,"K":2000,"U":2000}],["B",{"D":15000,"O":2000,"X":1000}],["T",{"D":10000,"O":5000}],["T",{"K":15000}],["B",{"K":12000,"O":2000}],["BCN",{"K":7000,"O":6000}],["AZ",{"X":6000,"D":3000,"O":2000,"K":2000}],["B",{"K":12000,"O":1000}],["ABCZ",{"O":7000,"D":4000,"K":500}],["B",{"U":10000,"O":750}],["B",{"U":10000}],["ABZ",{"K":8000,"O":1000,"X":500}],["BCTZ",{"O":4000,"D":2000,"X":2000,"K":1000}],["N",{"O":8000,"K":1000}],["ABCT",{"O":4000,"X":2000,"K":2000}],["Z",{"X":8000}],["AB",{"U":5000,"O":3000}],["B",{"O":3000,"K":3000,"X":2000}],["BCZ",{"U":5000,"O":2000,"D":750}],["AB",{"O":7000,"D":500}],["T",{"K":5000,"O":2000}],["B",{"D":5000,"O":2000}],["B",{"O":6000,"K":1000}],["BCNTZ",{"X":3000,"O":2000,"K":1000,"D":250}],["B",{"K":5000,"O":1000,"X":250}],["NT",{"O":3000,"K":2000,"X":1000}],["C",{"U":6000}],["BT",{"O":5000,"D":250}],["BNTZ",{"K":5000}],["T",{"U":5000}],["ABNTZ",{"O":3000,"X":2000}],["BCZ",{"O":4000,"K":1000}],["BZ",{"X":2000,"O":2000,"K":750}],["BC",{"O":4000,"X":250}],["BCNTZ",{"O":3000,"K":1000}],["ABCNTZ",{"K":3000,"O":1000}],["BTZ",{"O":3000,"K":1000}],["BT",{"K":2000,"O":2000}],["CZ",{"K":2000,"D":1000,"X":1000}],["AB",{"O":3000,"K":1000}],["ABCNTZ",{"O":3000,"X":250}],["B",{"K":1000,"D":1000,"X":750,"U":250,"O":250}],["BTZ",{"X":3000}],["BCTZ",{"K":2000,"O":1000}],["BCNTZ",{"O":2000,"U":1000}],["N",{"X":3000}],["B",{"K":3000}],["B",{"U":2000,"O":1000}],["CNTZ",{"X":1000,"K":1000,"O":750}],["C",{"D":2000,"X":500}],["CZ",{"K":2000,"O":500}],["B",{"O":2000,"K":500}],["B",{"O":2000,"D":500}],["N",{"K":1000,"O":1000,"X":250}],["BC",{"O":1000,"U":500,"K":500,"D":250}],["N",{"K":2000}],["C",{"D":2000}],["C",{"K":2000}],["A",{"O":1000,"X":1000}],["B",{"U":2000}],["B",{"X":1000,"O":1000}],["A",{"X":1000,"O":500,"D":250}],["A",{"K":750,"O":500,"D":250,"X":250}],["A",{"O":1000,"X":500}],["A",{"O":500,"X":500,"D":250,"K":250}],["A",{"O":1000,"K":500}],["B",{"O":1000,"D":500}],["BCT",{"O":750,"X":500}],["A",{"X":1000,"O":250}],["B",{"O":750,"X":500}],["BT",{"K":500,"O":500}],["TZ",{"U":1000}],["AC",{"O":750,"D":250}],["AZ",{"O":750,"K":250}],["A",{"O":750,"X":250}],["B",{"D":1000}],["B",{"X":1000}],["B",{"K":500,"X":500}],["T",{"K":500,"O":250}],["ABCN",{"O":500,"X":250}],["ACZ",{"O":500,"D":250}],["ABZ",{"O":500,"X":250}],["A",{"O":500,"K":250}],["A",{"X":500,"O":250}],["B",{"K":500,"O":250}],["B",{"D":500,"O":250}],["NTZ",{"X":500}],["BCNTZ",{"O":250,"X":250}],["ABCNTZ",{"O":250,"X":250}],["C",{"O":250,"K":250}],["C",{"X":500}],["C",{"O":250,"X":250}],["BC",{"K":500}],["C",{"X":250,"O":250}],["Z",{"O":250,"K":250}],["A",{"X":250,"D":250}],["A",{"U":500}],["A",{"X":500}],["B",{"O":250,"X":250}],["B",{"D":250,"O":250}],["BCTZ",{"K":250}],["N",{"X":250}],["BN",{"D":250}],["ACZ",{"D":250}],["Z",{"K":250}],["A",{"D":250}],["A",{"D":250}],["A",{"D":250}],["B",{"X":250}],["B",{"D":250}],["B",{"D":250}],["B",{"X":250}]];
  const svg=document.getElementById('web');
  if(svg){
  const C={T:['Kellie Torres','Council D3'],N:['Steve Novick','Council D3'],B:['Julia Brim-Edwards','County Chair'],Z:['Eric Zimmerman','Council D4'],C:['Olivia Clark','Council D4'],A:['Eli Arnold','Council D4']};
  const corder=['T','N','B','Z','C','A'];corder.forEach((k,i)=>C[k].y=70+i*92);
  const G={D:{label:'Christine Drazan',sub:'2018–2026 races',y:70,col:'gop'},K:{label:'Knute Buehler',sub:'2011–2018 races',y:175,col:'gop'},U:{label:'Chris Dudley',sub:'governor 2010, 2026',y:280,col:'gop'},X:{label:'Other Republicans',sub:'statewide, legislature, party',y:385,col:'gop'},O:{label:'Other Portland conservatives',sub:'Gonzalez, Adams, Mozyrsky and more',y:510,col:'lean'}};
  const cx=260,gx=790,mx=520;const MOB=matchMedia('(max-width:700px)').matches;const SL={T:['Torres'],N:['Novick'],B:['Brim-Edwards'],Z:['Zimmerman'],C:['Clark'],A:['Arnold'],D:['Drazan'],K:['Buehler'],U:['Dudley'],X:['Other','Republicans'],O:['Portland','conservatives']};
  // order donors by average y of their candidates so lines stay tidy
  const pts=D.map(d=>{const ys=[...d[0]].map(k=>C[k].y);return {d,avg:ys.reduce((a,b)=>a+b,0)/ys.length}}).sort((a,b)=>a.avg-b.avg);
  pts.forEach((p,i)=>{const col=i%4,row=Math.floor(i/4),rows=Math.ceil(pts.length/4);p.y=40+row*(520/(rows-1));p.x=mx-48+col*32});
  const maxA=Math.max(...D.map(d=>Math.max(...Object.values(d[1]))));
  const eg=el('g',{fill:'none'},svg),ng=el('g',{},svg);
  const NAMES={T:'Torres',N:'Novick',B:'Brim-Edwards',Z:'Zimmerman',C:'Clark',A:'Arnold'};
  const TN={D:'Christine Drazan',K:'Knute Buehler',U:'Chris Dudley',X:'other Republicans',O:'other Portland conservatives'};
  const byCand={};corder.forEach(k=>byCand[k]=[]);
  pts.forEach((p,i)=>{
    p.edges=[];
    [...p.d[0]].forEach(k=>{const c=C[k];byCand[k].push(p);
      const e=el('path',{d:`M${cx+14},${c.y} C${cx+140},${c.y} ${p.x-140},${p.y} ${p.x},${p.y}`,class:'e ein',pathLength:1,stroke:css('slate'),'stroke-width':1.3,'stroke-opacity':.5},eg);
      e.dataset.d0=(0.05+i*0.012).toFixed(3)+'s';e.style.setProperty('--d',e.dataset.d0);e.dataset.c=k;p.edges.push(e);});
    Object.entries(p.d[1]).forEach(([k,a])=>{const t=G[k];const w=0.9+5*Math.sqrt(a/maxA);
      const e=el('path',{d:`M${p.x},${p.y} C${p.x+150},${p.y} ${gx-150},${t.y} ${gx-14},${t.y}`,class:'e eout',pathLength:1,stroke:css(t.col),'stroke-width':w.toFixed(2),'stroke-opacity':.6},eg);
      e.dataset.d0=(0.9+i*0.012).toFixed(3)+'s';e.style.setProperty('--d',e.dataset.d0);p.edges.push(e);});
  });
  pts.forEach(p=>{const tot=Object.values(p.d[1]).reduce((s,v)=>s+v,0);p.tot=tot;
    p.dot=el('circle',{cx:p.x,cy:p.y,r:(3.5+6*Math.sqrt(tot/maxA)).toFixed(1),class:'dn',fill:p.d[0].length>1?css('ink'):css('ink-2'),stroke:css('paper'),'stroke-width':1.5,tabindex:0},ng);
    const hit=el('circle',{cx:p.x,cy:p.y,r:11,fill:'transparent',class:'hit'},ng);
    const show=ev=>tip(p,ev);hit.addEventListener('mouseenter',show);hit.addEventListener('click',ev=>{ev.stopPropagation();show(ev)});hit.addEventListener('mouseleave',hideTip);});
  corder.forEach(k=>{const c=C[k];const g=el('g',{class:'cand',tabindex:0,role:'button','aria-label':'Trace donors of '+c[0]},ng);
    el('rect',{x:cx-230,y:c.y-24,width:260,height:52,fill:'transparent'},g);
    el('circle',{cx,cy:c.y,r:12,fill:css('slate')},g);
    if(MOB){txt(g,cx-24,c.y+10,SL[k][0],{'text-anchor':'end','font-family':'var(--f-display)','font-weight':700,'font-size':32,fill:css('ink')})}else{
    txt(g,cx-22,c.y+2,c[0],{'text-anchor':'end','font-family':'var(--f-display)','font-weight':700,'font-size':20,fill:css('ink')});
    txt(g,cx-22,c.y+19,c[1],{'text-anchor':'end','font-family':'var(--f-data)','font-size':12,fill:css('ink-2')});}
    const go=ev=>{ev.stopPropagation();focus(k)};g.addEventListener('click',go);g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go(ev)}});
    C[k].g=g;});
  Object.entries(G).forEach(([tk,t])=>{const g=el('g',{class:'cand tgt',tabindex:0,role:'button','aria-label':'Trace donors of '+t.label},ng);
    el('rect',{x:gx-24,y:t.y-24,width:290,height:52,fill:'transparent'},g);
    el('circle',{cx:gx,cy:t.y,r:14,fill:css(t.col)},g);
    if(MOB){const s=SL[tk];txt(g,gx+26,t.y+(s.length>1?-4:10),s[0],{'font-family':'var(--f-display)','font-weight':700,'font-size':32,fill:css('ink')});if(s[1])txt(g,gx+26,t.y+28,s[1],{'font-family':'var(--f-display)','font-weight':700,'font-size':32,fill:css('ink')})}else{
    txt(g,gx+26,t.y+2,t.label,{'font-family':'var(--f-display)','font-weight':700,'font-size':20,fill:css('ink')});
    txt(g,gx+26,t.y+20,t.sub,{'font-family':'var(--f-data)','font-size':12,fill:css('ink-2')});}
    const go=ev=>{ev.stopPropagation();focusT(tk)};g.addEventListener('click',go);g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go(ev)}});
    t.g=g;});
  // tag outgoing edges with their target
  pts.forEach(p=>{let i=0;p.edges.forEach(e=>{if(e.classList.contains('eout')){e.dataset.t=Object.keys(p.d[1])[i++]}})});
  // animation + focus
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const restore=()=>allE.forEach(e=>{e.style.setProperty('--d',e.dataset.d0);e.classList.remove('rev')});
  const replay=els=>{if(reduce)return;els.forEach(e=>{e.classList.remove('draw');void e.getBoundingClientRect();e.classList.add('draw')})};
  const status=document.getElementById('web-status');let cur=null;
  const allE=[...svg.querySelectorAll('path.e')];
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){replay(allE);io.disconnect()}},{threshold:.25});io.observe(svg);
  function focus(k){
    if(cur===k){reset();return}
    cur=k;svg.classList.add('focus');
    allE.forEach(e=>e.classList.remove('on'));pts.forEach(p=>p.dot.classList.remove('on'));corder.forEach(j=>C[j].g.classList.toggle('on',j===k));Object.values(G).forEach(t=>t.g.classList.remove('on'));
    const ps=byCand[k],on=[];
    ps.forEach(p=>{p.dot.classList.add('on');p.edges.forEach(e=>{if(!e.classList.contains('ein')||e.dataset.c===k){e.classList.add('on');on.push(e)}})});
    restore();replay(on);
    const RN={"T":[33,219,7],"N":[25,334,3],"B":[77,489,23],"Z":[38,288,9],"C":[38,320,11],"A":[37,239,15]}[k];
    status.innerHTML=`<b>${C[k][0]}:</b> ${RN[0]} of ${RN[1]} individual donors also gave to Republican campaigns, ${RN[2]} of them to Christine Drazan. Highlighted dots are donor households. <button type="button" class="web-reset">Show all six</button>`;
    status.querySelector('button').onclick=reset;
  }
  function focusT(tk){
    const key='t:'+tk;if(cur===key){reset();return}
    cur=key;svg.classList.add('focus');
    allE.forEach(e=>e.classList.remove('on'));pts.forEach(p=>p.dot.classList.remove('on'));
    corder.forEach(j=>C[j].g.classList.remove('on'));Object.entries(G).forEach(([j,t])=>t.g.classList.toggle('on',j===tk));
    const ps=pts.filter(p=>tk in p.d[1]),on=[],per={};
    ps.forEach(p=>{p.dot.classList.add('on');[...p.d[0]].forEach(c=>{per[c]=(per[c]||0)+1;C[c].g.classList.add('on')});
      p.edges.forEach(e=>{if(e.classList.contains('ein')||e.dataset.t===tk){e.classList.add('on');on.push(e)}})});
    on.forEach(e=>{e.classList.add('rev');e.style.setProperty('--d',e.classList.contains('eout')?'0s':'0.7s')});
    replay(on);
    const PT={"D":{"T":7,"N":3,"B":23,"Z":9,"C":11,"A":15},"K":{"T":17,"N":12,"B":35,"Z":20,"C":18,"A":13},"U":{"T":6,"N":3,"B":12,"Z":5,"C":3,"A":2},"X":{"T":17,"N":15,"B":34,"Z":20,"C":17,"A":20},"O":{"T":83,"N":81,"B":189,"Z":131,"C":101,"A":99}}[tk];
    const br=corder.slice().sort((a,b)=>PT[b]-PT[a]).map(c=>`${NAMES[c]} ${PT[c]}`).join(' · ');
    status.innerHTML=`<b>${G[tk].label}:</b> ${ps.length} of the ${D.length} donor households shown also gave here. Individual donors who did, by candidate: ${br}. <button type="button" class="web-reset">Show all</button>`;
    status.querySelector('button').onclick=reset;
  }
  function reset(){cur=null;svg.classList.remove('focus');allE.forEach(e=>e.classList.remove('on'));pts.forEach(p=>p.dot.classList.remove('on'));corder.forEach(j=>C[j].g.classList.remove('on'));Object.values(G).forEach(t=>t.g.classList.remove('on'));restore();
    status.innerHTML='Tap any name on either side to trace the donors. Hover or tap a dot for what that donor gave.';replay(allE);}
  svg.addEventListener('click',()=>{if(cur)reset();hideTip()});
  // tooltip (no names)
  const tipEl=document.getElementById('web-tip');
  function money(v){return v>=1000?'$'+Math.round(v/1000).toLocaleString()+'K':'$'+v}
  function tip(p,ev){
    const cands=[...p.d[0]].map(k=>NAMES[k]).join(', ');
    const tg=Object.entries(p.d[1]).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${TN[k]} (${money(v)})`).join(', ');
    tipEl.innerHTML=`<span class="tt-h">One donor or household</span><span><b>Gave to:</b> ${cands}</span><span><b>Also gave to:</b> ${tg}</span><small>Amounts rounded. Names withheld.</small>`;
    const box=svg.getBoundingClientRect(),wb=svg.parentElement.getBoundingClientRect();
    const sx=box.width/1120,x=box.left-wb.left+p.x*sx,y=box.top-wb.top+p.y*sx;
    tipEl.style.left=Math.min(Math.max(8,x-140),wb.width-288)+'px';tipEl.style.top=(y+14)+'px';tipEl.hidden=false;}
  function hideTip(){tipEl.hidden=true}
  txt(ng,mx,22,D.length+' HOUSEHOLDS',{'text-anchor':'middle','font-family':'var(--f-data)','font-size':13,'font-weight':600,fill:css('ink-2'),'letter-spacing':'2'});

  }
  /* ---------- CURRENT GOP BARS ---------- */
  const gb=document.getElementById('gopbars');
  if(gb){
  const cnt={D:0,K:0,U:0,X:0,O:0};D.forEach(d=>Object.keys(d[1]).forEach(k=>cnt[k]++));
  const rows=[['K','Knute Buehler','2011–2018 races'],['X','Other Republicans','statewide, legislature, party'],['D','Christine Drazan','2018–2026 races'],['U','Chris Dudley','governor, 2010 and 2026'],['O','Other Portland conservatives','Gonzalez, Adams, Mozyrsky and more']];
  const mxv=Math.max(...Object.values(cnt)),bx=210,bw=260;
  rows.forEach((r,i)=>{const y=14+i*50,w=bw*cnt[r[0]]/mxv;
    txt(gb,0,y+12,r[1],{'font-size':14,'font-weight':600,fill:css('ink')});
    txt(gb,0,y+28,r[2],{'font-family':'var(--f-data)','font-size':11,fill:css('ink-2')});
    el('rect',{x:bx,y,width:w.toFixed(1),height:24,fill:css(r[0]==='O'?'lean':'gop')},gb);
    txt(gb,bx+w+8,y+17,cnt[r[0]],{'font-family':'var(--f-data)','font-size':14,'font-weight':600,fill:css('ink')});
  });

  }
  /* ---------- CHAMBER ---------- */
  const ch=document.getElementById('chamber');
  if(ch){
  const yes=['Pirtle-Guiney','Ryan','Novick','Clark','Zimmerman','Smith'];
  const no=['Morillo','Koyama Lane','Green','Avalos','Kanal','Dunphy'];
  const onBallot=new Set(['Novick','Clark','Zimmerman','Morillo','Koyama Lane','Green']);
  const seats=[...no,...yes],R=180,ccx=260,ccy=250;
  seats.forEach((n,i)=>{const a=Math.PI-(i+0.5)*Math.PI/12,x=ccx+R*Math.cos(a),y=ccy-R*Math.sin(a),isYes=i>=6;
    el('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:17,fill:isYes?css('slate'):css('peacock'),stroke:onBallot.has(n)?css('ink'):'none','stroke-width':3.5},ch);
    const lx=ccx+(R+30)*Math.cos(a),ly=ccy-(R+30)*Math.sin(a);
    txt(ch,lx.toFixed(1),(ly+4).toFixed(1),n,{'text-anchor':Math.cos(a)>0.02?'start':'end','class':'nm'});
  });
  txt(ch,ccx-95,ccy+28,'6 NO',{'text-anchor':'middle','font-family':'var(--f-display)','font-weight':800,'font-size':30,fill:css('peacock')});
  if(matchMedia('(max-width:640px)').matches){ch.setAttribute('viewBox','55 40 410 250');}
  txt(ch,ccx+95,ccy+28,'6 YES',{'text-anchor':'middle','font-family':'var(--f-display)','font-weight':800,'font-size':30,fill:css('slate')});

  }
  /* ---------- SHARE ---------- */
  const b=document.getElementById('share'),m=document.getElementById('share-msg');
  if(b){
  b.addEventListener('click',()=>{const u='https://whosbuyingpdx.com';navigator.clipboard.writeText(u).then(()=>{m.textContent='Link copied.'}).catch(()=>{m.textContent=u})});
}
})();
