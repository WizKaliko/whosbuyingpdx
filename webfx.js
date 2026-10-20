/* Homepage-style motion for the vendor webs: lines draw in when the web scrolls into view; clicking a node
   focuses its lines and replays them flowing from what you clicked; a status line explains the selection with a
   "Show all" button; clicking the same node again resets. Hover previews without replaying. Respects reduced motion. */
window.WebFX=function(o){
  const {svg,edges,nodes,status,idle,describe,keys,revKey}=o;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  edges.forEach(e=>{e.setAttribute('pathLength',1);e.dataset.d0=e.style.getPropertyValue('--d')||'0s'});
  const restore=()=>edges.forEach(e=>{e.style.setProperty('--d',e.dataset.d0);e.classList.remove('rev')});
  const replay=els=>{if(reduce)return;els.forEach(e=>{e.classList.remove('draw');void e.getBoundingClientRect();e.classList.add('draw')})};
  const keyOf=g=>{for(const k of keys)if(g['_'+k]!==undefined)return [k,g['_'+k]];return null};
  let cur=null;
  function visible(key,val){
    const fs=new Set();edges.forEach(e=>{if(e['_'+key]===val)fs.add(e._f)});
    const vis=edges.filter(e=>fs.has(e._f)&&(e['_'+key]===undefined||e['_'+key]===val));
    const on=new Set();vis.forEach(e=>keys.forEach(k=>{if(e['_'+k]!==undefined)on.add(k+':'+e['_'+k])}));
    return {vis,on};
  }
  function paint(key,val){
    svg.classList.add('focus');
    const {vis,on}=visible(key,val);
    edges.forEach(e=>e.classList.toggle('on',vis.includes(e)));
    nodes.forEach(n=>{const k=keyOf(n);n.classList.toggle('on',!!k&&on.has(k[0]+':'+k[1]))});
    return vis;
  }
  function clear(){svg.classList.remove('focus');edges.forEach(e=>e.classList.remove('on'));nodes.forEach(n=>n.classList.remove('on'))}
  function focus(key,val){
    if(cur===key+':'+val){reset();return}
    cur=key+':'+val;
    const vis=paint(key,val);
    restore();
    if(key===revKey){vis.forEach(e=>{e.classList.add('rev');e.style.setProperty('--d',e['_'+revKey]!==undefined?'0s':'0.7s')})}
    else if(key!=='f'){vis.forEach(e=>e.style.setProperty('--d',e['_'+key]!==undefined?'0s':'0.7s'))}
    else{vis.forEach(e=>e.style.setProperty('--d',e['_'+revKey]!==undefined?'0.5s':'0s'))}
    replay(vis);
    if(status){status.innerHTML=describe(key,val,vis)+' <button type="button" class="web-reset">Show all</button>';status.querySelector('.web-reset').onclick=reset;
      status.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>window.openProfile&&window.openProfile(b.dataset.open))}
  }
  function reset(){cur=null;clear();restore();if(status)status.innerHTML=idle;replay(edges)}
  if(status)status.innerHTML=idle;
  svg.addEventListener('click',e=>{const g=e.target.closest('.h-f,.h-c');if(g){const k=keyOf(g);if(k)focus(...k)}else if(cur)reset()});
  svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('.h-f,.h-c');if(g){e.preventDefault();const k=keyOf(g);if(k)focus(...k)}}});
  svg.addEventListener('pointerover',e=>{if(cur||!matchMedia('(hover:hover)').matches)return;const g=e.target.closest('.h-f,.h-c');if(g){const k=keyOf(g);if(k)paint(...k)}});
  svg.addEventListener('pointerleave',()=>{if(!cur)clear()});
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){replay(edges);io.disconnect()}})},{threshold:.2});io.observe(svg);
  return {replayAll:()=>{if(!cur)replay(edges)},reset};
};
