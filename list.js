(function(){
  /* Ranked list: who got the most from Portland's city and county races. Each firm row opens its own profile page (firms/<slug>.html). */
  const box=document.getElementById('vlist'); if(!box||!window.PROFILES) return;
  const K=v=>v>=999500?'$'+(v/1e6).toFixed(2).replace(/0$/,'')+'M':v>=1000?'$'+Math.round(v/1000)+'K':'$'+Math.round(v);
  const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  window.firmURL=n=>'firms/'+slug(n)+'.html';
  const rows=window.PROFILES.map(p=>{const s=t=>p.race.filter(r=>t.includes(r[1])).reduce((a,r)=>a+r[2],0);
    const biz=s('bc'),prog=s('r'),owed=p.race.reduce((a,r)=>a+(r[3]||0),0),oth=p.other.reduce((a,r)=>a+r[2],0);
    return {p,biz,prog,owed,all:biz+prog+s('m')+oth}});
  let sortKey='biz';
  const M=Math.max(...rows.map(r=>Math.max(r.biz,r.prog)));
  function render(){
    const list=rows.filter(r=>sortKey==='biz'?r.biz>0:sortKey==='prog'?r.prog>0:true).sort((a,b)=>b[sortKey]-a[sortKey]);
    box.innerHTML=list.map((r,i)=>{const p=r.p;
      const inner=`<span class="vr-rank">${i+1}</span>
        <span class="vr-name"><b>${p.n}</b><small>${[p.what,p.where].filter(Boolean).join(' · ')}</small></span>
        <span class="vr-bars"><span class="vr-bar"><i class="b" style="width:${(100*r.biz/M).toFixed(1)}%"></i>${r.owed?`<i class="ow" style="width:${(100*r.owed/M).toFixed(1)}%"></i>`:''}</span><span class="vr-bar"><i class="r" style="width:${(100*r.prog/M).toFixed(1)}%"></i></span></span>
        <span class="vr-num b">${r.biz?K(r.biz):'—'}${r.owed?`<small>+${K(r.owed)} owed</small>`:''}</span>
        <span class="vr-num r">${r.prog?K(r.prog):'—'}</span>
        <span class="vr-num a">${p.agg?'':K(r.all)}${p.life?`<small>${K(p.life.total)} all years</small>`:''}</span>
        <span class="vr-go" aria-hidden="true">${p.agg?'':'→'}</span>`;
      return p.agg?`<div class="vrow agg" title="${(p.note||'').replace(/"/g,'&quot;')}">${inner}</div>`:`<a class="vrow" href="${firmURL(p.n)}">${inner}</a>`}).join('');
  }
  const tabs=[...document.querySelectorAll('[data-sort]')];
  tabs.forEach(t=>t.addEventListener('click',()=>{sortKey=t.dataset.sort;tabs.forEach(u=>u.setAttribute('aria-pressed',String(u===t)));render()}));
  render();
  window.openProfile=n=>{location.href=firmURL(n)};
})();
