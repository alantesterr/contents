/* Архитектура: раскладка темы как в C++ — переключатель «Лабораторная | Тесты | Лекция» и листалка заданий лабы (← →).
   Подключается ПОСЛЕ главного скрипта: блоки уже получили id правок (initUnits), здесь их только переносим, текст не трогаем. */
(function(){
'use strict';
const ls={get:k=>{ try{ return localStorage.getItem(k); }catch(_){ return null; } },set:(k,v)=>{ try{ localStorage.setItem(k,v); }catch(_){} }};
const barH=sec=>{ const hd=document.querySelector('header.top'), cm=sec.querySelector('.cmode'); return (hd?hd.offsetHeight:0)+(cm?cm.offsetHeight:0)+8; };
const goTo=(el,off)=>{ const y=el.getBoundingClientRect().top+window.scrollY-(off||0); window.scrollTo({top:Math.max(0,y),behavior:'smooth'}); };
(function(){ const hd=document.querySelector('header.top'); if(!hd) return; const set=()=>document.documentElement.style.setProperty('--hdrh',hd.offsetHeight+'px'); set(); if(window.ResizeObserver) new ResizeObserver(set).observe(hd); })();

/* разворачиваем содержимое после лекции в плоский список: [узел, был ли он внутри .read] */
function flatten(nodes){ const out=[]; nodes.forEach(n=>{ if(n.nodeType!==1){ if(n.textContent.trim()) out.push([n,true]); return; }
  if(n.classList.contains('read')) [...n.childNodes].forEach(c=>{ if(c.nodeType===1||c.textContent.trim()) out.push([c,true]); }); else out.push([n,false]); }); return out; }
/* собираем узлы обратно, заворачивая подряд идущие «читательские» в div.read */
function pack(list,into){ let rd=null; list.forEach(([n,inRead])=>{ if(inRead){ if(!rd){ rd=document.createElement('div'); rd.className='read'; into.appendChild(rd); } rd.appendChild(n); } else { rd=null; into.appendChild(n); } }); }
const isEl=(n,sel)=>n.nodeType===1&&n.matches(sel);

function build(sec){
  if(sec.dataset.lay) return; const id=sec.id, lec=sec.querySelector(':scope > details.lec'); const head=sec.querySelector(':scope > .read');
  if(!lec||!head) return; sec.dataset.lay='1';
  const after=[]; let n=lec.nextSibling; while(n){ after.push(n); n=n.nextSibling; }
  const flat=flatten(after);
  const ti=flat.findIndex(([x])=>isEl(x,'h2.testshead'));
  const labPart=ti<0?flat:flat.slice(0,ti), testPart=ti<0?[]:flat.slice(ti);
  // слайды: новый — на каждом h2, и на .lab-task, если в текущем слайде задание уже есть
  const slides=[]; let cur=null;
  const start=()=>{ cur={items:[],hasTask:false,title:''}; slides.push(cur); };
  let pend=[]; // блоки между решением и следующим заданием относятся к следующему заданию
  const flush=()=>{ if(pend.length){ if(!cur) start(); cur.items.push(...pend); pend=[]; } };
  labPart.forEach(it=>{ const [x]=it;
    if(isEl(x,'h2')){ flush(); start(); cur.title=x.textContent.trim(); }
    else if(isEl(x,'.lab-task')){ if(!cur||cur.hasTask) start(); cur.hasTask=true; cur.items.push(...pend); pend=[]; const tl=x.querySelector('.tl'); if(tl&&(!cur.title||cur.items.every(([y])=>!isEl(y,'.lab-task')))) cur.title=(cur.title?cur.title+' · ':'')+tl.textContent.trim(); }
    else { if(!cur) start(); const last=cur.items[cur.items.length-1]; if(cur.hasTask&&(pend.length||(last&&isEl(last[0],'details.sol')))){ pend.push(it); return; } }
    cur.items.push(it); });
  flush();
  // заголовок лабы (h2.labhead) показываем над каждым её слайдом серой строкой
  let labName='';
  slides.forEach(s=>{ const h=s.items.find(([x])=>isEl(x,'h2.labhead')); if(h) labName=h[0].textContent.trim(); s.lab=labName; });
  const nTasks=slides.filter(s=>s.items.some(([x])=>isEl(x,'.lab-task[id*="-z"]'))).length;
  // переключатель
  const cm=document.createElement('div'); cm.className='cmode'; cm.setAttribute('role','tablist'); cm.setAttribute('aria-label','Раздел темы');
  cm.innerHTML=`<div class="cmode-in"><button role="tab" data-mode="labs" aria-selected="true">🔧 Лабораторная <small>${slides.length}</small></button><button role="tab" data-mode="tests" aria-selected="false">✅ Тесты</button><button class="cm-lec" data-lec="1" aria-expanded="false">📖 Лекция</button></div>`;
  head.after(cm); const sn=head.querySelector('.subnav'); if(sn) sn.hidden=true;
  // панели
  const pl=document.createElement('div'); pl.className='cpane'; pl.dataset.pane='labs';
  const pt=document.createElement('div'); pt.className='cpane'; pt.dataset.pane='tests'; pt.hidden=true;
  lec.after(pl); pl.after(pt);
  const car=document.createElement('div'); car.className='lcar'; pl.appendChild(car);
  const dots=slides.map((s,i)=>`<button class="lc-dot${/Дополнительно|Вопросы/.test(s.title)?' dop':''}" data-go="${i}" title="${(s.title||'Слайд '+(i+1)).replace(/"/g,'&quot;')}">${i+1}</button>`).join('');
  const nav=pos=>`<div class="lc-nav lc-${pos}"><button class="btn" data-d="-1">← Назад</button><span class="lc-pos"></span><button class="btn pri" data-d="1">Дальше →</button></div>`;
  const top=document.createElement('div'); top.className='read'; top.innerHTML=`<div class="lc-head"><div class="lc-dots" role="tablist" aria-label="Задания лабы">${dots}</div><div class="lc-ttl"></div>${nav('top')}</div>`; car.appendChild(top);
  const els=slides.map((s,i)=>{ const d=document.createElement('div'); d.className='lslide'; d.dataset.i=i;
    if(s.lab&&!s.items.some(([x])=>isEl(x,'h2'))){ const r=document.createElement('div'); r.className='read'; r.innerHTML=`<div class="lc-labname"></div>`; r.firstChild.textContent=s.lab; d.appendChild(r); }
    pack(s.items,d); car.appendChild(d); return d; });
  const bot=document.createElement('div'); bot.className='read'; bot.innerHTML=nav('bot'); car.appendChild(bot);
  pack(testPart,pt);
  after.forEach(x=>{ if(x.parentNode===sec&&x.nodeType===1&&x.classList.contains('read')&&!x.childNodes.length) x.remove(); });
  sec.querySelectorAll(':scope > .read').forEach(r=>{ if(r!==head&&!r.textContent.trim()&&!r.querySelector('*')) r.remove(); });

  // поведение
  const panes=[pl,pt], tabs=[...cm.querySelectorAll('[data-mode]')], lecBtn=cm.querySelector('[data-lec]');
  const setMode=(m,scroll)=>{ panes.forEach(p=>p.hidden=p.dataset.pane!==m); tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===m?'true':'false')); ls.set('archmode:'+id,m); if(scroll) goTo(m==='labs'?pl:pt,barH(sec)); };
  tabs.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode,true)));
  const upd=()=>lecBtn.setAttribute('aria-expanded',lec.open?'true':'false'); lec.addEventListener('toggle',upd);
  lecBtn.addEventListener('click',()=>{ lec.open=!lec.open; upd(); goTo(lec.open?lec:cm,lec.open?barH(sec):0); });
  let ci=0; const ttl=top.querySelector('.lc-ttl');
  const show=(i,scroll)=>{ ci=Math.min(els.length-1,Math.max(0,i)); ls.set('archlab:'+id,ci);
    els.forEach((s,k)=>s.hidden=k!==ci);
    car.querySelectorAll('.lc-dot').forEach((d,k)=>{ d.classList.toggle('on',k===ci); d.setAttribute('aria-selected',k===ci?'true':'false'); });
    car.querySelectorAll('.lc-pos').forEach(x=>x.textContent=`${ci+1} из ${els.length}`); ttl.textContent=slides[ci].title||'';
    car.querySelectorAll('[data-d="-1"]').forEach(b=>b.disabled=ci===0); car.querySelectorAll('[data-d="1"]').forEach(b=>b.disabled=ci===els.length-1);
    if(scroll) goTo(car,barH(sec)); };
  car.addEventListener('click',e=>{ const b=e.target.closest('[data-d],[data-go]'); if(!b||!car.contains(b)||b.closest('.lslide')) return; show(b.dataset.go!=null?+b.dataset.go:ci+(+b.dataset.d),true); });
  // открыть нужное по ссылке / из старых кнопок subnav
  sec.reveal=(el)=>{ if(!el) return false; if(el===lec||lec.contains(el)){ lec.open=true; upd(); return true; } const s=el.closest('.lslide'); if(s&&car.contains(s)){ setMode('labs'); show(+s.dataset.i); return true; } if(pt.contains(el)){ setMode('tests'); return true; } return false; };
  show(+(ls.get('archlab:'+id)||0)); setMode(ls.get('archmode:'+id)||'labs');
}

const secs=[...document.querySelectorAll('section.topic')].filter(s=>/^t([1-9]|1[0-5])$/.test(s.id));
secs.forEach(s=>{ try{ build(s); }catch(e){ console.error('layout',s.id,e); } });
// ссылки #t5-z3, #t9-test, #t4-lecture и кнопка «Открыть все решения»
function openHash(){ const h=(location.hash||'').slice(1); if(!h) return; const el=document.getElementById(h); if(!el) return; const sec=el.closest('section.topic'); if(sec&&sec.reveal&&sec.reveal(el)) setTimeout(()=>el.scrollIntoView({block:'start'}),60); }
openHash(); window.addEventListener('hashchange',openHash);
document.addEventListener('keydown',e=>{ if(e.target.closest('input,textarea,select,[contenteditable="true"],.ews,.tcar,.sim')) return; if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
  const sec=document.querySelector('section.topic:not([hidden])'); const car=sec&&sec.querySelector('.cpane[data-pane="labs"]:not([hidden]) .lcar'); if(!car) return;
  const b=car.querySelector(`.lc-head [data-d="${e.key==='ArrowRight'?1:-1}"]`); if(b&&!b.disabled){ e.preventDefault(); b.click(); } });
})();
