/* Сборка тем C++ из данных (cpp/topics/cN.js). Порядок в теме:
   заголовок → свёрнутая лекция → лабы (2–3 задания, остальные по кнопке) → доп. лабы → тесты → вопросы УМКД с ответами.
   Тема: CPP.topic('c3', {n, title, lecture:html, labs:[lab], dop:[lab], umkd:[[вопрос, ответ]], srs:html, foot:html})
   Лаба: {id, title, orig:html, note:html, show:3, tasks:[task]}
   Задание: {id, name, text:html, ref:код, start:код, ins:[[имя, ввод]], cmp:'exact|nums|approx|none', steps:html, vcl:{…}} */
(function(G){
'use strict';
const CPP=G.CPP; CPP.TOPICS=CPP.TOPICS||{};
CPP.topic=(id,d)=>{ CPP.TOPICS[id]=d; };
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const code=s=>String(s).replace(/^\n+/,'').replace(/\s+$/,'')+'\n';

function taskHTML(t){
  const id=t.id;
  let h=`<div class="titem"><div class="read"><div class="lab-task" id="${id}"><span class="tl">${t.name}</span>${t.text||''}</div>${t.note||''}</div>`;
  if(t.vcl){ h+=`<div class="vclw" data-id="${id}" data-title="${esc(t.wtitle||t.name)}"><script type="application/json" data-role="vcl">${JSON.stringify(t.vcl).replace(/</g,'\\u003c')}</script></div>`; }
  else if(t.ref||t.start){
    h+=`<div class="cppw" data-id="${id}" data-cmp="${t.cmp||'exact'}" data-title="${esc(t.wtitle||(t.name+' — напиши программу'))}">`;
    if(t.ref) h+=`<script type="text/x-cpp" data-role="ref">\n${code(t.ref)}</script>`;
    if(t.start) h+=`<script type="text/x-cpp" data-role="start">\n${code(t.start)}</script>`;
    for(const [nm,txt] of (t.ins||[])) h+=`<script type="text/plain" data-role="in" data-name="${esc(nm)}">${txt}</script>`;
    h+=`</div>`;
  }
  h+=`<div class="read">`;
  if(t.steps) h+=`<details class="sol"><summary>${t.solName||'Разбор по шагам'}</summary><div class="solve">${t.steps}</div></details>`;
  if(t.ref&&!t.vcl) h+=`<details class="sol"><summary>Эталонный код</summary><div class="solve ref" data-ref-for="${id}"></div></details>`;
  h+=`</div></div>`;
  return h;
}
function labHTML(lab){
  let h=`<div class="read"><h2 class="labhead" id="${lab.id}">${lab.title}</h2>${lab.orig||''}${lab.note||''}</div>`;
  if(lab.html) h+=lab.html;
  if(lab.tasks&&lab.tasks.length) h+=`<div class="tgroup" data-show="${lab.show||3}">${lab.tasks.map(taskHTML).join('')}</div>`;
  return h;
}
function render(id){
  const d=CPP.TOPICS[id], sec=document.getElementById(id);
  if(!d||!sec) return;
  const links=[];
  (d.labs||[]).forEach(l=>links.push(`<a href="#${l.id}">${l.short||'Лаба'}</a>`));
  (d.dop||[]).forEach(l=>links.push(`<a href="#${l.id}">${l.short||'Доп. лаба'}</a>`));
  links.push(`<a href="#${id}-test">Тесты</a>`);
  if(d.umkd) links.push(`<a href="#${id}-q">Вопросы УМКД</a>`);
  if(d.lecture) links.push(`<a href="#${id}-lecture">Лекция</a>`);
  let h=`<div class="read"><div class="topic-head"><div class="eyebrow">C++ · Тема ${d.n} · ${d.eyebrow||'лекция, лабы с онлайн-проверкой, тесты'}</div><h1>${d.title}</h1></div>
    <nav class="subnav">${links.join('')}</nav>${d.intro||''}</div>`;
  if(d.lecture) h+=`<details class="lec" id="${id}-lecture"><summary><span class="ic">📖</span><span class="tx"><b>Лекция по теме</b><span>${d.lecSub||'Теория по УМКД: оригинал + мои дополнения. Открой, если в задании что-то непонятно.'}</span></span><span class="ar"></span></summary><div class="lecbody">${d.lecture}</div></details>`;
  (d.labs||[]).forEach(l=>h+=labHTML(l));
  (d.dop||[]).forEach(l=>h+=labHTML(l));
  h+=`<div class="read"><h2 class="testshead" id="${id}-test">Тесты темы ${d.n}</h2><p class="tc-help">Сначала идут вопросы из базы (190 вопросов группы), потом дополнительные по УМКД. Листай стрелками ← → (или клавишами на клавиатуре), отвечай кликом или цифрой 1–5.</p><div id="tests-${id}"></div></div>`;
  if(d.qa) h+=`<div class="read">${d.qa}</div>`;
  if(d.umkd) h+=`<div class="read"><h2 id="${id}-q">Вопросы УМКД к теме ${d.n} — с ответами</h2><p>Вопросы к рубежному контролю и экзамену из УМКД. Ответы короткие — их удобно учить.</p><aside class="add"><span class="tag">ответы · вопросы УМКД</span><ol>${d.umkd.map(([q,a])=>`<li><b>${q}</b> — ${a}</li>`).join('')}</ol></aside>${d.srs||''}</div>`;
  if(d.foot) h+=`<div class="read"><p class="foot">${d.foot}</p></div>`;
  sec.innerHTML=h;
}
CPP.renderTopics=function(){ for(const id in CPP.TOPICS) render(id); };

/* «Показать ещё задание» */
CPP.initGroups=function(root){
  (root||document).querySelectorAll('.tgroup:not([data-gi])').forEach(g=>{
    g.dataset.gi='1';
    const items=[...g.children].filter(x=>x.classList.contains('titem'));
    const n=+g.dataset.show||3;
    if(items.length<=n) return;
    items.slice(n).forEach(x=>x.classList.add('th'));
    const bar=document.createElement('div'); bar.className='tmore';
    bar.innerHTML=`<button class="btn pri" data-m="1">Показать ещё задание</button><button class="btn" data-m="all">Показать все</button><span></span>`;
    const upd=()=>{ const left=items.filter(x=>x.classList.contains('th')).length; bar.querySelector('span').textContent=left?`Скрыто ещё ${left} из ${items.length}`:''; bar.hidden=!left; };
    bar.addEventListener('click',e=>{ const b=e.target.closest('[data-m]'); if(!b) return;
      const hid=items.filter(x=>x.classList.contains('th'));
      const open=b.dataset.m==='all'?hid:hid.slice(0,1);
      open.forEach(x=>x.classList.remove('th'));
      if(open[0]) open[0].scrollIntoView({behavior:'smooth',block:'start'});
      upd(); });
    g.after(bar); upd();
  });
};
})(typeof window!=='undefined'?window:globalThis);
