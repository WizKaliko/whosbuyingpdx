(function(){
  /* Ranked list: who got the most from Portland's city and county races, with a Ballast-style profile behind each row. */
  const box=document.getElementById('vlist'); if(!box||!window.PROFILES) return;
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);
  const TAG={b:'Business-backed side',r:'Progressive side',m:'County candidate, neither slate',c:'Portland conservative',p:'Democratic, labor, progressive',o:'Other'};
  const rows=window.PROFILES.map(p=>{const s=t=>p.race.filter(r=>t.includes(r[1])).reduce((a,r)=>a+r[2],0);
    const biz=s('b'),prog=s('rm'),owed=p.race.reduce((a,r)=>a+(r[3]||0),0),oth=p.other.reduce((a,r)=>a+r[2],0);
    return {p,biz,prog,owed,all:biz+prog+oth}});
  let sortKey='biz';
  const max=()=>Math.max(...rows.map(r=>Math.max(r.biz,r.prog)));
  function render(){
    const list=rows.filter(r=>sortKey==='biz'?r.biz>0:sortKey==='prog'?r.prog>0:true).sort((a,b)=>b[sortKey]-a[sortKey]);
    const M=max();
    box.innerHTML=list.map((r,i)=>{const p=r.p;const id='v-'+p.n.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      const race=p.race.slice().sort((a,b)=>'bmr'.indexOf(a[1])-'bmr'.indexOf(b[1])||b[2]-a[2]);
      const other=p.other.slice().sort((a,b)=>b[2]-a[2]);
      return `<details class="vrow${p.agg?' agg':''}" id="${id}"><summary>
        <span class="vr-rank">${i+1}</span>
        <span class="vr-name"><b>${p.n}</b><small>${[p.what,p.where].filter(Boolean).join(' · ')}</small></span>
        <span class="vr-bars"><span class="vr-bar"><i class="b" style="width:${(100*r.biz/M).toFixed(1)}%"></i>${r.owed?`<i class="ow" style="width:${(100*r.owed/M).toFixed(1)}%"></i>`:''}</span><span class="vr-bar"><i class="r" style="width:${(100*r.prog/M).toFixed(1)}%"></i></span></span>
        <span class="vr-num b">${r.biz?K(r.biz):'—'}${r.owed?`<small>+${K(r.owed)} owed</small>`:''}</span>
        <span class="vr-num r">${r.prog?K(r.prog):'—'}</span>
        <span class="vr-num a">${p.agg?'':K(r.all)}${p.life?`<small>${K(p.life.total)} all years</small>`:''}</span>
      </summary>
      <div class="vp">
        ${p.people?`<p class="vp-who">${p.people}</p>`:''}
        <div class="vp-cols">
          <div><h5>Paid by Portland city and county races</h5><ul>${race.map(x=>`<li class="c-${x[1]}"><span>${x[0]}<small>${TAG[x[1]]}</small></span><b>${K(x[2])}${x[3]?`<small>+${K(x[3])} owed</small>`:''}</b></li>`).join('')}</ul></div>
          ${p.agg?'':`<div><h5>Who else paid them, Jan 2025 &ndash; Oct 2026</h5>${other.length?`<ul>${other.map(x=>`<li class="c-${x[1]}"><span>${x[0]}<small>${TAG[x[1]]}</small></span><b>${K(x[2])}${x[3]?`<small>+${K(x[3])} owed</small>`:''}</b></li>`).join('')}</ul>`:`<p class="vp-none">${p.full?'No other Oregon committee paid this firm since January 2025.':'Not yet searched statewide.'}</p>`}</div>`}
        </div>
        ${p.life?`<div class="vp-life"><h5>Every Oregon committee, all years</h5><p class="vp-life-sum"><b>${K(p.life.total)}</b> from <b>${p.life.n}</b> committee${p.life.n===1?'':'s'}${p.life.since?` since ${p.life.since}`:''}${p.life.trunc?' <small>(at least: the search caps out on firms this busy)</small>':''}</p><ol>${p.life.top.map(x=>`<li><span>${x[0]}<small>${x[2]}</small></span><b>${K(x[1])}</b></li>`).join('')}</ol></div>`:''}
        ${p.extra?`<p>${p.extra}</p>`:''}${p.note?`<p>${p.note}</p>`:''}${p.earlier?`<p class="vp-early">${p.earlier}</p>`:''}
        <p class="vp-src">${p.agg?'Source: the campaigns’ own ORESTAR filings, Oct 19, 2026.':'Sources: Portland race payments from the campaigns’ ORESTAR filings; other clients and all-years history from a Ballast vendor search of every Oregon committee in ORESTAR; both Oct 19, 2026.'}${p.src.length?' Also: '+p.src.filter(s=>s[1]).map(s=>`<a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a>`).join(', ')+'.':''}</p>
      </div></details>`}).join('');
  }
  const tabs=[...document.querySelectorAll('[data-sort]')];
  tabs.forEach(t=>t.addEventListener('click',()=>{sortKey=t.dataset.sort;tabs.forEach(u=>u.setAttribute('aria-pressed',String(u===t)));render()}));
  render();
  window.openProfile=n=>{if(sortKey!=='biz'){sortKey='biz';tabs.forEach(u=>u.setAttribute('aria-pressed',String(u.dataset.sort==='biz')));render()}
    const d=document.getElementById('v-'+n.toLowerCase().replace(/[^a-z0-9]+/g,'-'));if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'})}};
})();
