/* Сборка тем C++ из данных (cpp/topics/cN.js). Вид темы:
   заголовок → панель-переключатель (липкая): «Лабораторные | Тесты | Лекция» → свёрнутая лекция (в конце — вопросы УМКД с ответами)
   → раздел «Лабораторные»: задания листаются по одному (← →), сначала лабы, потом доп. лабы
   → раздел «Тесты»: тесты-листалка.
   Тема: CPP.topic('c3', {n, title, lecture:html, labs:[lab], dop:[lab], umkd:[[вопрос, ответ]], qa:html, srs:html, foot:html})
   Лаба: {id, title, orig:html, note:html, html:html, tasks:[task]}
   Задание: {id, name, text:html, ref:код, start:код, ins:[[имя, ввод]], cmp:'exact|nums|approx|none', steps:html, note:html, vcl:{…}} */
(function(G){
'use strict';
const CPP=G.CPP; CPP.TOPICS=CPP.TOPICS||{};
CPP.topic=(id,d)=>{ CPP.TOPICS[id]=d; };
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const code=s=>String(s).replace(/^\n+/,'').replace(/\s+$/,'')+'\n';
const store={ get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} } };

// задание: что сделать → окно с кодом → подсказки/поправки → разбор по шагам и эталон
function taskHTML(t){
  const id=t.id;
  let h=`<div class="titem"><div class="read"><div class="lab-task" id="${id}"><span class="tl">${t.name}</span>${t.text||''}</div></div>`;
  if(t.vcl){ h+=`<div class="vclw" data-id="${id}" data-title="${esc(t.wtitle||t.name)}"><script type="application/json" data-role="vcl">${JSON.stringify(t.vcl).replace(/</g,'\\u003c')}</script></div>`; }
  else if(t.ref||t.start){
    h+=`<div class="cppw" data-id="${id}" data-cmp="${t.cmp||'exact'}" data-title="${esc(t.wtitle||(t.name+' — напиши программу'))}">`;
    if(t.ref) h+=`<script type="text/x-cpp" data-role="ref">\n${code(t.ref)}</script>`;
    if(t.start) h+=`<script type="text/x-cpp" data-role="start">\n${code(t.start)}</script>`;
    for(const [nm,txt] of (t.ins||[])) h+=`<script type="text/plain" data-role="in" data-name="${esc(nm)}">${txt}</script>`;
    h+=`</div>`;
  }
  h+=`<div class="read">${t.note||''}`;
  if(t.steps) h+=`<details class="sol"><summary>${t.solName||'Разбор по шагам'}</summary><div class="solve">${t.steps}</div></details>`;
  if(t.ref&&!t.vcl) h+=`<details class="sol"><summary>Эталонный код</summary><div class="solve ref" data-ref-for="${id}"></div></details>`;
  h+=`</div></div>`;
  return h;
}
// описание лабы (цель, оригинал, пример, поправки) — в первом слайде лабы, свёрнуто
function labInfo(lab){
  const body=(lab.orig||'')+(lab.html||'')+(lab.note||'');
  return `<div class="read"><h2 class="labhead" id="${lab.id}">${lab.title}</h2>${body?`<details class="labinfo"><summary>Описание лабы: цель, оригинал, пример</summary>${body}</details>`:''}</div>`;
}
function labsHTML(d){
  const slides=[];
  const add=(lab,kind)=>(lab.tasks||[]).forEach((t,i)=>slides.push({lab,kind,t,first:i===0}));
  (d.labs||[]).forEach(l=>add(l,'Лаба')); (d.dop||[]).forEach(l=>add(l,'Доп. лаба'));
  if(!slides.length) return '<div class="read"><p>Лабораторных к этой теме нет.</p></div>';
  const dots=slides.map((s,i)=>`<button class="lc-dot${s.kind!=='Лаба'?' dop':''}" data-go="${i}" title="${esc((s.kind)+': '+s.t.name)}">${i+1}</button>`).join('');
  const nav=pos=>`<div class="lc-nav lc-${pos}"><button class="btn" data-d="-1">← Назад</button><span class="lc-pos"></span><button class="btn pri" data-d="1">Дальше →</button></div>`;
  return `<div class="lcar"><div class="read"><div class="lc-head"><div class="lc-dots" role="tablist" aria-label="Задания">${dots}</div>${nav('top')}</div></div>`+
    slides.map((s,i)=>`<div class="lslide" data-i="${i}" data-kind="${s.kind}" data-lab="${esc(s.lab.title)}">${s.first?labInfo(s.lab):`<div class="read"><div class="lc-labname">${s.kind} · ${s.lab.title}</div></div>`}${taskHTML(s.t)}</div>`).join('')+
    `<div class="read">${nav('bot')}</div></div>`;
}
function render(id){
  const d=CPP.TOPICS[id], sec=document.getElementById(id);
  if(!d||!sec) return;
  const nTasks=[...(d.labs||[]),...(d.dop||[])].reduce((s,l)=>s+(l.tasks||[]).length,0);
  let h=`<div class="read"><div class="topic-head"><div class="eyebrow">C++ · Тема ${d.n} · ${d.eyebrow||'лекция, лабы с онлайн-проверкой, тесты'}</div><h1>${d.title}</h1></div>${d.intro||''}</div>`;
  h+=`<div class="cmode" role="tablist" aria-label="Раздел темы"><div class="cmode-in">
    <button role="tab" data-mode="labs" aria-selected="true">💻 Лабораторные <small>${nTasks}</small></button>
    <button role="tab" data-mode="tests" aria-selected="false">✅ Тесты</button>
    ${d.lecture?`<button class="cm-lec" data-lec="1" aria-expanded="false">📖 Лекция</button>`:''}</div></div>`;
  if(d.lecture){
    let extra='';
    if(d.qa) extra+=`<div class="read">${d.qa}</div>`;
    if(d.umkd) extra+=`<div class="read"><h2 id="${id}-q">Вопросы УМКД к теме ${d.n} — с ответами</h2><p>Вопросы к рубежному контролю и экзамену из УМКД. Ответы короткие — их удобно учить.</p><aside class="add"><span class="tag">ответы · вопросы УМКД</span><ol>${d.umkd.map(([q,a])=>`<li><b>${q}</b> — ${a}</li>`).join('')}</ol></aside>${d.srs||''}</div>`;
    h+=`<details class="lec" id="${id}-lecture"><summary><span class="ic">📖</span><span class="tx"><b>Лекция по теме</b><span>${d.lecSub||'Теория по УМКД: оригинал + мои дополнения. Открой, если в задании что-то непонятно.'} В конце — вопросы УМКД с ответами.</span></span><span class="ar"></span></summary><div class="lecbody">${d.lecture}${extra}<div class="read"><button class="btn lec-close">Свернуть лекцию ▲</button></div></div></details>`;
  }
  h+=`<div class="cpane" data-pane="labs">${labsHTML(d)}</div>`;
  h+=`<div class="cpane" data-pane="tests" hidden><div class="read"><h2 class="testshead" id="${id}-test">Тесты темы ${d.n}</h2><p class="tc-help">Сначала идут вопросы из базы (190 вопросов группы), потом дополнительные по УМКД. Листай стрелками ← → (или клавишами на клавиатуре), отвечай кликом или цифрой 1–5.</p><div id="tests-${id}"></div></div></div>`;
  if(d.foot) h+=`<div class="read"><p class="foot">${d.foot}</p></div>`;
  sec.innerHTML=h;
}
CPP.renderTopics=function(){ for(const id in CPP.TOPICS) render(id); };

// высота шапки сайта — чтобы панель «Лабораторные | Тесты» прилипала прямо под ней
function trackHeader(){
  const hd=document.querySelector('header.top'); if(!hd||trackHeader.on) return; trackHeader.on=true;
  const set=()=>document.documentElement.style.setProperty('--hdrh',hd.offsetHeight+'px');
  set(); if(G.ResizeObserver) new ResizeObserver(set).observe(hd); else G.addEventListener('resize',set);
}
const scrollTo=(el,off)=>{ const y=el.getBoundingClientRect().top+G.scrollY-(off||0); G.scrollTo({top:Math.max(0,y),behavior:'smooth'}); };
const barH=sec=>{ const hd=document.querySelector('header.top'), cm=sec.querySelector('.cmode'); return (hd?hd.offsetHeight:0)+(cm?cm.offsetHeight:0)+8; };

/* Переключатель разделов и листалка заданий (имя оставлено прежним — его вызывает showTopic) */
CPP.initGroups=function(sec){
  if(!sec||sec.dataset.cmi) return; sec.dataset.cmi='1'; trackHeader();
  const id=sec.id, key='cppmode:'+id;
  const panes=[...sec.querySelectorAll('.cpane')], tabs=[...sec.querySelectorAll('.cmode [data-mode]')];
  const lec=sec.querySelector('details.lec'), lecBtn=sec.querySelector('.cmode [data-lec]');
  const setMode=(m,scroll)=>{
    panes.forEach(p=>p.hidden=p.dataset.pane!==m);
    tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===m?'true':'false'));
    store.set(key,m);
    if(scroll){ const p=panes.find(x=>x.dataset.pane===m); if(p) scrollTo(p,barH(sec)); }
  };
  tabs.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode,true)));
  if(lec&&lecBtn){
    const upd=()=>lecBtn.setAttribute('aria-expanded',lec.open?'true':'false');
    lec.addEventListener('toggle',upd);
    lecBtn.addEventListener('click',()=>{ lec.open=!lec.open; upd(); scrollTo(lec.open?lec:sec.querySelector('.cmode'),lec.open?barH(sec):0); });
    const cl=lec.querySelector('.lec-close'); if(cl) cl.addEventListener('click',()=>{ lec.open=false; upd(); scrollTo(sec.querySelector('.cmode'),0); });
  }
  // листалка заданий
  const car=sec.querySelector('.lcar');
  if(car){
    const slides=[...car.querySelectorAll('.lslide')], dots=[...car.querySelectorAll('.lc-dot')], ck='cpplab:'+id;
    let cur=Math.min(slides.length-1,Math.max(0,+(store.get(ck)||0)));
    const mark=()=>dots.forEach((d,i)=>d.classList.toggle('ok',!!slides[i].querySelector('.cppw.solved,.vclw.solved')));
    const show=(i,scroll)=>{
      cur=Math.min(slides.length-1,Math.max(0,i)); store.set(ck,cur);
      slides.forEach((s,k)=>s.hidden=k!==cur);
      dots.forEach((d,k)=>{ d.classList.toggle('on',k===cur); d.setAttribute('aria-selected',k===cur?'true':'false'); });
      const s=slides[cur], txt=`Задание ${cur+1} из ${slides.length}`;
      car.querySelectorAll('.lc-pos').forEach(x=>x.textContent=txt);
      car.querySelectorAll('[data-d="-1"]').forEach(b=>b.disabled=cur===0);
      car.querySelectorAll('[data-d="1"]').forEach(b=>b.disabled=cur===slides.length-1);
      mark();
      if(scroll) scrollTo(car,barH(sec));
    };
    car.addEventListener('click',e=>{ const b=e.target.closest('[data-d],[data-go]'); if(!b) return;
      show(b.dataset.go!=null?+b.dataset.go:cur+(+b.dataset.d),true); });
    car.addEventListener('click',()=>setTimeout(mark,50));   // после «Проверить» отметить решённое
    // ссылка на конкретное задание (#c3-l2-z1) — открыть его слайд
    const h=(location.hash||'').slice(1); const el=h&&car.querySelector('[id="'+h.replace(/"/g,'')+'"]');
    if(el){ const s=el.closest('.lslide'); if(s) cur=+s.dataset.i; }
    show(cur,false);
  }
  const h=(location.hash||'').slice(1);
  setMode(/-test$/.test(h)?'tests':(store.get(key)||'labs'),false);
  if(/-q$|-lecture$/.test(h)&&lec){ lec.open=true; if(lecBtn) lecBtn.setAttribute('aria-expanded','true'); }
};
})(typeof window!=='undefined'?window:globalThis);
