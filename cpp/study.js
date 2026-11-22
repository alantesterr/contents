/* Вкладка «🎯 Учиться» (C++): учёба кусочками по проверенным методам.
   Задача сначала → лесенка помощи (подсказка → кусочек лекции → ответ/эталон → Google) → своя заметка «как 5-летнему».
   Интервальное повторение (коробки Лейтнера 1-3-7-14-30 дней), ошибка возвращается через 3 карточки, чередование тем,
   приоритет 80/20 (темы с наибольшим числом тестовых вопросов), таймер 17/8, «Шерлок» (быстро листать лекции),
   «Мой конспект», «Мои ошибки», «Пробный экзамен». Прогресс и заметки — localStorage + личный раздел базы артефакта
   (data/users/<id>/study, заметки — по документу), чтобы были видны с любого устройства. */
(function(G){
'use strict';
const CPP=G.CPP;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>typeof G.qfmt==='function'?G.qfmt(s):esc(s);
const fmtInline=s=>esc(s).replace(/`([^`\n]+)`/g,'<code>$1</code>');
const hash=s=>{ let h=5381; s=String(s); for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))|0; return (h>>>0).toString(36); };
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const DAY=864e5, now=()=>Date.now();
const today=()=>{ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const BOX_DAYS=[0,1,3,7,14,30];                         // интервалы повторения по коробкам
const ORDER_8020=['c11','c2','c10','c1','c15','c4','c6','c3','c7','c9','c5','c8','c12','c13','c14'];   // по числу вопросов в тестах
const TOPIC_IDS=Array.from({length:15},(_,i)=>'c'+(i+1));

/* ================= хранилище ================= */
const LS='study:v1';
let S=null;                 // {items:{key:{b,due,seen,ok,bad,last,help}}, notes:{key:{t,ts}}, days:{date:n}, set:{}, ts}
function loadLocal(){ try{ S=JSON.parse(localStorage.getItem(LS)||'null'); }catch(e){ S=null; }
  S=Object.assign({items:{},notes:{},days:{},set:{}},S||{}); S.set=Object.assign({kind:'mix',scope:'8020',size:20,work:17,rest:8,topics:[],recall:false},S.set); }
function saveLocal(){ try{ localStorage.setItem(LS,JSON.stringify(S)); }catch(e){} }
const Cloud={db:null,uid:null,ref:null,ok:false,t:null,noteT:{},
  async init(){
    try{ if(!(G.claude&&typeof G.claude.use==='function')) return;
      const [db,user]=await Promise.all([G.claude.use('db').catch(()=>null),G.claude.use('user').catch(()=>null)]);
      if(!db||!user) return; const uid=await user.id(); if(!uid) return;
      this.db=db; this.uid=uid; this.ref=db.doc('data/users/'+uid+'/study');
      const timer=new Promise((_,rj)=>setTimeout(()=>rj(new Error('timeout')),10000));
      const [snap,notes]=await Promise.race([Promise.all([this.ref.get(),this.ref.collection('notes').get()]),timer]);
      if(snap.exists){ const d=snap.data()||{}; mergeItems(d.items||{}); for(const k in (d.days||{})) S.days[k]=Math.max(S.days[k]||0,d.days[k]); if(d.set&&!(S.ts>d.ts)) S.set=Object.assign(S.set,d.set); }
      (notes.docs||[]).forEach(dn=>{ const v=dn.data(); const k=dn.id; if(v&&(!S.notes[k]||(v.ts||0)>(S.notes[k].ts||0))) S.notes[k]={t:String(v.t||''),ts:v.ts||0}; });
      this.ok=true; saveLocal(); this.pushProgress(); UI.refresh&&UI.refresh(); UI.cloudBadge&&UI.cloudBadge();
    }catch(e){ this.ok=false; UI.cloudBadge&&UI.cloudBadge(); }
  },
  pushProgress(){ if(!this.ok) return; clearTimeout(this.t); this.t=setTimeout(()=>{ this.ref.set({items:S.items,days:S.days,set:S.set,ts:now()}).catch(()=>{}); },2500); },
  pushNote(k){ if(!this.ok) return; clearTimeout(this.noteT[k]); this.noteT[k]=setTimeout(()=>{ const n=S.notes[k]; const r=this.ref.collection('notes').doc(k); (n&&n.t.trim()?r.set({t:n.t,ts:n.ts}):r.delete()).catch(()=>{}); },1500); }
};
function mergeItems(o){ for(const k in o){ const a=S.items[k], b=o[k]; if(!a||(b.last||0)>(a.last||0)) S.items[k]=b; } }
function persist(){ S.ts=now(); saveLocal(); Cloud.pushProgress(); }
function setNote(k,t){ S.notes[k]={t,ts:now()}; if(!t.trim()) delete S.notes[k]; saveLocal(); Cloud.pushNote(k); }
const noteOf=k=>S.notes[k]&&S.notes[k].t||'';

/* ================= база: кусочки лекций, вопросы, лабы, шаги ================= */
let DB=null;
const STOP=new Set('the and for with that this which what from into are was were can not has have its use used using only also each when then than other there their them they will would should could about more most some such any all one two may must does did how why who whose where your you our out per via без для что это как или его она они при так все уже ещё еще над под про чем чтобы если когда тоже только можно нужно надо есть был была были быть который которая которые него свой свои свою этот эта эти того тот так же'.split(' '));
function words(s){
  s=String(s).replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ');
  const out=[]; const re=/[A-Za-z_][A-Za-z0-9_]*|[А-Яа-яЁё]+/g; let m;
  while((m=re.exec(s))){ let w=m[0];
    if(/^[A-Z][a-z]+[A-Z0-9]|^T[A-Z]|[0-9]|_/.test(w)){ out.push(w.toLowerCase()); continue; }   // идентификаторы VCL/C++ целиком
    w=w.toLowerCase(); if(w.length<3||STOP.has(w)) continue;
    if(/[а-яё]/.test(w)) w=w.slice(0,Math.min(w.length,6)); else if(w.length>7) w=w.slice(0,7);
    out.push(w); }
  return out;
}
const textOf=html=>{ const d=document.createElement('div'); d.innerHTML=html; return d.textContent.replace(/\s+/g,' ').trim(); };
function lectureChunks(id,d){
  const chunks=[]; if(!d.lecture) return chunks;
  const box=document.createElement('div'); box.innerHTML=d.lecture;
  const root=box.querySelector('.read')||box;
  const MAX=1300;
  const add=(head,html)=>{ const t=textOf(html); if(t.length>30) chunks.push({id:id+'-k'+chunks.length,topic:id,head,html,text:t}); };
  const tlen=el=>(el.textContent||'').length;
  // большой блок режем на части по ~1300 символов; обёртку (aside/ul/таблица) сохраняем, чтобы кусочек выглядел как в лекции
  function walk(container,head,wrap){
    let buf=[], n=0;
    const W=html=>wrap?wrap(html):html;
    const flush=()=>{ if(buf.length){ add(head,W(buf.join(''))); buf=[]; n=0; } };
    for(const el of container.children){
      const tag=el.tagName;
      if(/^H[2-5]$/.test(tag)){ flush(); head=el.textContent.trim(); continue; }
      if(tag==='SPAN'&&el.classList.contains('tag')) continue;
      if(tag==='SUMMARY') continue;
      const L=tlen(el);
      if(L>MAX&&el.children.length>1&&!/^(PRE)$/.test(tag)){
        flush();
        if(tag==='ASIDE'||tag==='DETAILS'){ const tg=el.querySelector(':scope>.tag,:scope>summary'); const h=tg?tg.textContent.trim().replace(/^дополнение · /,''):'';
          const cls=el.className; const nh=h&&!/^о материалах/i.test(h)?head.split(' · ')[0]+' · '+h:head;
          walk(el,nh,x=>`<aside class="${cls||'add'}">${tg&&tag==='ASIDE'?tg.outerHTML:''}${x}</aside>`); continue; }
        if(tag==='UL'||tag==='OL'){ walk(el,head,x=>`<${tag.toLowerCase()}>${x}</${tag.toLowerCase()}>`); continue; }
        const tb=tag==='TABLE'?el:(el.classList&&el.classList.contains('tw')?el.querySelector('table'):null);
        if(tb){ const rows=[...tb.querySelectorAll('tr')]; const hd=rows[0]&&rows[0].querySelector('th')?rows.shift().outerHTML:''; let grp=[], m=0;
          const out=()=>{ if(grp.length){ add(head,W(`<div class="tw"><table>${hd}${grp.join('')}</table></div>`)); grp=[]; m=0; } };
          for(const r of rows){ grp.push(r.outerHTML); m+=tlen(r); if(m>MAX) out(); } out(); continue; }
        walk(el,head,wrap); continue;
      }
      if(tag==='ASIDE'||tag==='DETAILS'){ flush(); const tg=el.querySelector('.tag,summary'); const h=tg?tg.textContent.trim().replace(/^дополнение · /,''):'';
        add(h&&!/^о материалах/i.test(h)?head.split(' · ')[0]+' · '+h:head,W(el.outerHTML)); continue; }
      buf.push(el.outerHTML); n+=L; if(n>MAX) flush();
    }
    flush();
  }
  walk(root,textOf(d.title),null);
  (d.umkd||[]).forEach(([q,a],i)=>chunks.push({id:id+'-u'+i,topic:id,head:'Вопрос УМКД',html:`<p><b>${q}</b> — ${a}</p>`,text:textOf(q+' '+a),umkd:true}));
  return chunks;
}
function build(){
  if(DB) return DB;
  const getT=typeof G.getTests==='function'?G.getTests:(k=>(G.DEFAULT_TESTS||{})[k]);
  const topics={}, items={}, allChunks=[];
  const chunksOf={};
  for(const id of TOPIC_IDS){ const d=CPP.TOPICS[id]; if(d){ chunksOf[id]=lectureChunks(id,d); allChunks.push(...chunksOf[id]); } }
  // idf по всем кусочкам всех лекций: ищем по всем темам, своя тема — с небольшим приоритетом
  const df=new Map(); allChunks.forEach(c=>{ c.w=new Set(words(c.head+' '+c.text)); for(const w of c.w) df.set(w,(df.get(w)||0)+1); });
  const N=allChunks.length||1; const idf=w=>Math.pow(Math.log(1+(N-(df.get(w)||0)+.5)/((df.get(w)||0)+.5)),2);   // квадрат: редкие слова (Hide, identifier) важнее частых
  const avg=allChunks.reduce((a,c)=>a+c.w.size,0)/N;
  // BM25: длинный кусок не выигрывает только за счёт длины
  const best=(topic,txt,ans)=>{ const qw=new Set(words(txt)), aw=new Set(words(ans||''));
    const sc=allChunks.map(c=>{ const norm=2.2/(1+1.2*(.25+.75*c.w.size/avg)); let s=0; for(const w of qw) if(c.w.has(w)) s+=idf(w)*norm; for(const w of aw) if(c.w.has(w)) s+=2*idf(w)*norm; if(c.topic===topic) s*=1.35; if(c.umkd) s*=.85; return {c,s}; }).sort((a,b)=>b.s-a.s);
    return sc.filter(x=>x.s>0).slice(0,3).map(x=>x.c.id); };
  for(const id of TOPIC_IDS){
    const d=CPP.TOPICS[id]; if(!d) continue;
    const chunks=chunksOf[id];
    const T=getT(id)||{base:[],pool:[]}; const its=[];
    [...(T.base||[]),...(T.pool||[])].forEach((q,i)=>{ if(!q||!q.q||!q.a||!q.a.length) return;
      const key='q-'+hash(q.q+'|'+q.a[0]); if(items[key]) return;
      const it={key,type:'test',topic:id,q,idx:i}; it.chunks=best(id,q.q,q.a[0]+' '+(q.e||'')); items[key]=it; its.push(it); });
    const labs=[...(d.labs||[]).map(l=>[l,false]),...(d.dop||[]).map(l=>[l,true])];
    for(const [lab,dop] of labs) for(const t of (lab.tasks||[])){ const key='l-'+t.id; const it={key,type:'lab',topic:id,lab,t,dop}; it.chunks=best(id,textOf(t.text||'')+' '+textOf(lab.title||''),''); items[key]=it; its.push(it); }
    // шаги: вопросы группируются вокруг «своего» кусочка лекции, в порядке лекции
    const pos=new Map(chunks.map((c,i)=>[c.id,i]));
    const own=new Set(chunks.map(c=>c.id));
    for(const it of its){ it.home=it.chunks.find(c=>own.has(c))||best(id,it.type==='test'?it.q.q:textOf(it.t.text||''),it.type==='test'?it.q.a[0]:'').concat(allChunks.filter(c=>c.topic===id).map(c=>c.id)).find(c=>own.has(c))||null; }
    const ordered=its.slice().sort((a,b)=>{ const pa=a.home?pos.get(a.home):1e4, pb=b.home?pos.get(b.home):1e4; return pa-pb||(a.type===b.type?0:a.type==='test'?-1:1); });
    const steps=[]; let curS=null;
    for(const it of ordered){ const c=it.home||'-'; const head=chunks.find(x=>x.id===c);
      if(!curS||curS.items.length>=6||(curS.c!==c&&curS.items.length>=3)){ curS={c,title:head?head.head:'Разное',items:[]}; steps.push(curS); }
      curS.items.push(it); it.step=steps.length-1; }
    topics[id]={id,n:d.n,title:textOf(d.title),chunks,items:its,steps,tests:its.filter(x=>x.type==='test').length};
  }
  const chunkById=new Map(allChunks.map(c=>[c.id,c]));
  DB={topics,items,chunkById,total:Object.values(items).filter(x=>x.type==='test').length};
  return DB;
}

/* ================= интервальное повторение ================= */
const st=k=>S.items[k]||null;
// help: 0 — сам, 1 — подсказка/50-50, 2 — лекция, 3 — ответ/эталон/Google
function grade(it,ok,help,conf){
  const s=S.items[it.key]=Object.assign({b:0,due:0,seen:0,ok:0,bad:0},S.items[it.key]||{});
  s.seen++; s.last=now(); s.help=help;
  if(ok&&help===0&&conf!=='guess'){ s.ok++; s.b=Math.min(5,(s.b||0)+1); }
  else if(ok){ s.ok++; s.b=Math.max(1,Math.min(s.b||1,2)); }
  else { s.bad++; s.b=1; }
  s.due=now()+BOX_DAYS[s.b]*DAY-3600e3;     // чуть раньше, чтобы повтор попал в «сегодня» нужного дня
  const d=today(); S.days[d]=(S.days[d]||0)+1;
  persist();
}
const mastery=k=>{ const s=st(k); if(!s) return 0; return s.b>=3?1:s.b===2?.6:s.b===1?.25:0; };
const isDue=k=>{ const s=st(k); return !!s&&s.due<=now(); };
function topicReady(t){ const ts=t.items.filter(x=>x.type==='test'); if(!ts.length) return 0; return ts.reduce((a,x)=>a+mastery(x.key),0)/ts.length; }
function examReady(){ const db=build(); let s=0,n=0; for(const t of Object.values(db.topics)) for(const x of t.items) if(x.type==='test'){ s+=mastery(x.key); n++; } return n?s/n:0; }
function streak(){ let n=0; const d=new Date(); for(;;){ const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); if(S.days[k]) n++; else if(n||k!==today()) break; d.setDate(d.getDate()-1); if(n>999) break; } return n; }

/* ================= очередь сессии ================= */
function scopeTopics(){ const s=S.set; if(s.scope==='pick'&&s.topics.length) return ORDER_8020.filter(t=>s.topics.includes(t)); if(s.scope==='order') return TOPIC_IDS.slice(); return ORDER_8020.slice(); }
function okKind(it,kind){ return kind==='mix'||(kind==='tests'?it.type==='test':it.type==='lab'); }
function buildQueue(opts){
  const db=build(); const kind=opts.kind||S.set.kind, size=opts.size||S.set.size, tps=opts.topics||scopeTopics();
  if(opts.items) return opts.items.slice(0,size);
  const pool=tps.flatMap(t=>db.topics[t]?db.topics[t].items:[]).filter(it=>okKind(it,kind));
  const due=shuffle(pool.filter(it=>isDue(it.key))).sort((a,b)=>st(a.key).b-st(b.key).b);
  const nDue=Math.min(due.length,Math.ceil(size*(opts.reviewShare||0.4)));
  const fresh=[];
  // новые — по шагам: тема за темой (80/20), внутри темы — шаг за шагом; лабы — примерно 1 на 4 вопроса в смешанном режиме
  for(const t of tps){ const T=db.topics[t]; if(!T) continue;
    for(const sp of T.steps) for(const it of sp.items) if(!st(it.key)&&okKind(it,kind)) fresh.push(it);
    if(fresh.length>=size*3) break; }
  let news=fresh;
  if(kind==='mix'){ const tests=fresh.filter(x=>x.type==='test'), labs=fresh.filter(x=>x.type==='lab'); news=[]; let li=0; tests.forEach((x,i)=>{ news.push(x); if(i%4===3&&labs[li]) news.push(labs[li++]); }); news.push(...labs.slice(li)); }
  const q=[]; const di=due.slice(0,nDue);
  const nn=news.slice(0,size-di.length);
  // чередуем: новое, новое, повтор …
  let a=0,b=0; while(q.length<size&&(a<nn.length||b<di.length)){ if(a<nn.length) q.push(nn[a++]); if(a<nn.length&&q.length<size) q.push(nn[a++]); if(b<di.length&&q.length<size) q.push(di[b++]); }
  if(q.length<size){ const rest=due.slice(nDue).concat(shuffle(pool.filter(it=>st(it.key)&&!isDue(it.key)&&!q.includes(it)).sort((x,y)=>(st(x.key).b-st(y.key).b)))); for(const it of rest){ if(q.length>=size) break; if(!q.includes(it)) q.push(it); } }
  return q;
}

/* ================= интерфейс ================= */
const UI={};
let SEC=null, SESS=null, TIMER=null;
const CSS=`
.st-wrap{max-width:860px}
.st-hero{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0}
.st-kpi{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.st-kpi b{display:block;font:700 26px var(--f-display);line-height:1.1}
.st-kpi span{font-size:13px;color:var(--muted)}
.st-bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin-top:6px}
.st-bar i{display:block;height:100%;background:var(--ok)}
.st-go{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:8px 0 14px}
.st-go .btn.big{font-size:17px;padding:12px 22px}
.st-opts{display:grid;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px;margin:10px 0}
.st-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.st-row>b{min-width:92px;font-size:14px}
.st-seg{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.st-seg button{font:600 13.5px var(--f-body);border:0;background:var(--surface);color:var(--ink);padding:6px 12px;cursor:pointer}
.st-seg button+button{border-left:1px solid var(--line)}
.st-seg button.on{background:var(--accent);color:var(--surface)}
.st-chips{display:flex;flex-wrap:wrap;gap:4px}
.st-chips button{font:600 12.5px var(--f-body);border:1px solid var(--line);background:var(--surface);color:var(--muted);border-radius:999px;padding:3px 10px;cursor:pointer}
.st-chips button.on{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
.st-modes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0}
.st-mode{text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px;cursor:pointer;color:var(--ink);font:14px var(--f-body)}
.st-mode:hover{border-color:var(--accent)}
.st-mode b{display:block;font-size:15px;margin-bottom:2px}
.st-mode small{color:var(--muted)}
.st-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:8px 0}
.st-tp{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:9px 11px;cursor:pointer;text-align:left;color:var(--ink);font:13.5px var(--f-body)}
.st-tp:hover{border-color:var(--accent)}
.st-tp .n{font:700 12px var(--f-body);color:var(--accent);letter-spacing:.06em}
.st-tp .w{float:right;font-size:11.5px;color:var(--muted)}
.st-tp .tt{display:block;font-weight:600;line-height:1.3;margin:2px 0 4px;min-height:2.6em}
.st-tp small{color:var(--muted)}
.st-tp.hot{border-color:color-mix(in srgb,var(--fix) 55%,var(--line))}
.st-how{margin:16px 0}
.st-top{position:sticky;top:var(--hdrh,64px);z-index:5;background:var(--bg);padding:8px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;border-bottom:1px solid var(--line)}
.st-top .pg{flex:1;min-width:140px}
.st-top .pg small{color:var(--muted);font-size:12.5px}
.st-pill{font:700 14px var(--f-mono);border:1px solid var(--line);border-radius:999px;padding:4px 12px;background:var(--surface)}
.st-pill.rest{background:var(--ok-bg);color:var(--ok)}
.st-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:12px 0}
.st-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:var(--muted);margin-bottom:6px}
.st-tag{font:700 11px var(--f-body);letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:2px 9px;background:var(--accent-soft);color:var(--accent)}
.st-tag.rev{background:var(--fix-bg);color:var(--fix)}
.st-tag.new{background:var(--ok-bg);color:var(--ok)}
.st-q{font-size:17px;font-weight:600;white-space:pre-line;margin:4px 0 12px}
.st-q pre{white-space:pre;font-weight:400}
.st-opts2{display:grid;gap:7px}
.st-opt{text-align:left;font:15.5px var(--f-body);background:var(--bg);color:var(--ink);border:1.5px solid var(--line);border-radius:9px;padding:9px 12px;cursor:pointer;display:flex;gap:10px}
.st-opt kbd{flex:none}
.st-opt:hover:not(:disabled){border-color:var(--accent)}
.st-opt:disabled{cursor:default}
.st-opt.right{background:var(--ok-bg);border-color:var(--ok)}
.st-opt.wrong{background:var(--bad-bg);border-color:var(--bad)}
.st-opt.gone{opacity:.25;text-decoration:line-through}
.st-ladder{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 4px}
.st-ladder .btn{font-size:13px;padding:6px 11px}
.st-ladder .btn.used{opacity:.55}
.st-help{border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 8px 8px 0;padding:8px 12px;margin:10px 0;font-size:15px}
.st-help>.h{font:700 11.5px var(--f-body);letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:4px;display:flex;gap:8px;align-items:center}
.st-help>.h button{margin-left:auto;font:600 12px var(--f-body);border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:6px;padding:2px 8px;cursor:pointer}
.st-help aside{margin:.4em 0}
.st-help.ans{border-color:var(--ok);background:var(--ok-bg)}
.st-help.ans>.h{color:var(--ok)}
.st-res{font-weight:700;margin:10px 0 4px}
.st-res.ok{color:var(--ok)} .st-res.bad{color:var(--bad)}
.st-conf{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}
.st-note{margin-top:12px;background:var(--fix-bg);border-radius:8px;padding:8px 10px}
.st-note label{display:block;font:600 13px var(--f-body);margin-bottom:4px}
.st-note label small{font-weight:400;color:var(--muted)}
.st-note textarea{width:100%;min-height:64px;font:14.5px var(--f-body);border:1px solid var(--line);border-radius:6px;padding:6px 8px;background:var(--surface);color:var(--ink);resize:vertical}
.st-note.old{background:color-mix(in srgb,var(--fix-bg) 70%,var(--surface))}
.st-oldnote{background:var(--fix-bg);border-radius:8px;padding:8px 10px;margin:0 0 10px;font-size:14.5px}
.st-oldnote b{color:var(--fix)}
.st-nav{display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:12px}
.st-nav .btn.pri{font-size:15px;padding:9px 18px}
.st-break{text-align:center;padding:30px 16px}
.st-break .big{font:700 56px var(--f-mono);margin:8px 0}
.st-done ul{padding-left:1.2em}
.st-sher{min-height:220px}
.st-sher .h{font:700 13px var(--f-body);color:var(--accent);letter-spacing:.04em;margin-bottom:6px}
.st-sher .bd{max-height:240px;overflow:hidden;position:relative}
.st-sher .bd.open{max-height:none}
.st-sher .bd:not(.open)::after{content:"";position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(transparent,var(--surface))}
.st-kon h3{margin-top:1.4em}
.st-kon .it{border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin:6px 0;background:var(--surface)}
.st-kon .it .q{font-size:13.5px;color:var(--muted);white-space:pre-line}
.st-kon .it .a{font-size:13px;color:var(--ok);margin-top:2px}
.st-kon .it textarea,.st-kon .tn textarea{width:100%;min-height:52px;font:14.5px var(--f-body);border:1px solid var(--line);border-radius:6px;padding:6px 8px;background:var(--fix-bg);color:var(--ink);margin-top:4px}
.st-kon .tn textarea{min-height:90px}
.st-cloud{font-size:12.5px;color:var(--muted)}
.st-lab .cppw,.st-lab .vclw{margin:10px 0}
@media (max-width:700px){.st-hero,.st-modes{grid-template-columns:repeat(2,minmax(0,1fr))}.st-map{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
function css(){ if(document.getElementById('study-css')) return; const s=document.createElement('style'); s.id='study-css'; s.textContent=CSS; document.head.appendChild(s); }
const scrollTop=()=>{ const hd=document.querySelector('header.top'); const y=SEC.getBoundingClientRect().top+G.scrollY-(hd?hd.offsetHeight:0)-6; if(G.scrollY>y) G.scrollTo({top:Math.max(0,y)}); };

/* ---------- главный экран ---------- */
function home(){
  stopTimer(); SESS=null;
  const db=build(), s=S.set, ready=examReady();
  const dueN=Object.values(db.items).filter(it=>isDue(it.key)).length;
  const todayN=S.days[today()]||0, seenN=Object.keys(S.items).filter(k=>db.items[k]).length;
  const seg=(name,opts,cur)=>`<span class="st-seg" data-set="${name}">${opts.map(([v,l])=>`<button data-v="${v}" class="${String(cur)===String(v)?'on':''}">${l}</button>`).join('')}</span>`;
  SEC.innerHTML=`<div class="read st-wrap">
  <div class="topic-head"><div class="eyebrow">C++ · учёба кусочками · подготовка к тестам экзамена</div><h1>🎯 Учиться</h1></div>
  <p>Здесь ты не читаешь лекции подряд, а сразу решаешь вопросы. Если не получается, открываешь помощь по шагам: подсказка → кусочек лекции → ответ → Google. Сайт сам решит, что повторить и когда. Твои заметки сохраняются и всплывут, когда вопрос попадётся снова.</p>
  <div class="st-hero">
    <div class="st-kpi"><b>${Math.round(ready*100)}%</b><span>готовность к тестам экзамена</span><div class="st-bar"><i style="width:${Math.round(ready*100)}%"></i></div></div>
    <div class="st-kpi"><b>${dueN}</b><span>повторить сегодня</span></div>
    <div class="st-kpi"><b>${todayN}</b><span>решено сегодня</span></div>
    <div class="st-kpi"><b>${streak()} 🔥</b><span>дней подряд · пройдено ${seenN} из ${Object.keys(db.items).length}</span></div>
  </div>
  <div class="st-go"><button class="btn pri big" data-a="go">▶ ${seenN?'Продолжить':'Начать'} · ${s.size} задач · ${s.work} мин</button>
    ${dueN?`<button class="btn" data-a="due">🔁 Только повторение (${Math.min(dueN,s.size)})</button>`:''}<span class="st-cloud"></span></div>
  <div class="st-opts">
    <div class="st-row"><b>Что решать</b>${seg('kind',[['tests','✅ Тесты'],['labs','💻 Лабы'],['mix','🔀 Вперемешку']],s.kind)}</div>
    <div class="st-row"><b>Темы</b>${seg('scope',[['8020','⭐ Сначала важные (80/20)'],['order','По порядку 1→15'],['pick','Выбрать сам']],s.scope)}</div>
    ${s.scope==='pick'?`<div class="st-row"><b></b><span class="st-chips">${TOPIC_IDS.map(t=>`<button data-tp="${t}" class="${s.topics.includes(t)?'on':''}">${t.slice(1)}</button>`).join('')}</span></div>`:''}
    <div class="st-row"><b>Порция</b>${seg('size',[[10,'10'],[20,'20'],[30,'30']],s.size)}<b style="min-width:auto;margin-left:10px">Таймер</b>${seg('timer',[['17/8','17/8'],['25/5','25/5'],['50/10','50/10']],s.work+'/'+s.rest)}</div>
    <div class="st-row"><b>Сложнее</b><label style="font-size:14px"><input type="checkbox" data-a="recall"${s.recall?' checked':''}> сначала вспомни ответ сам, потом покажу варианты</label></div>
  </div>
  <div class="st-modes">
    <button class="st-mode" data-a="sherlock"><b>🔍 Шерлок</b><small>быстро листай кусочки лекций, отмечай, что зацепило — по этому сразу будут вопросы</small></button>
    <button class="st-mode" data-a="konspekt"><b>📝 Мой конспект</b><small>все твои заметки «своими словами» по темам и шагам, плюс объяснение каждой темы</small></button>
    <button class="st-mode" data-a="mistakes"><b>❌ Мои ошибки</b><small>вопросы, где ошибался, — прорешать ещё раз</small></button>
    <button class="st-mode" data-a="exam"><b>🎓 Пробный экзамен</b><small>40 вопросов как на экзамене, без подсказок, с разбором по темам</small></button>
  </div>
  <h2>Карта тем</h2>
  <p class="st-cloud">⭐ — темы, где больше всего тестовых вопросов. Нажми на тему, чтобы пройти её по шагам.</p>
  <div class="st-map">${ORDER_8020.concat().sort((a,b)=>+a.slice(1)-+b.slice(1)).map(t=>{ const T=db.topics[t]; if(!T) return ''; const r=topicReady(T); const hot=ORDER_8020.indexOf(t)<7;
    const done=T.steps.filter(sp=>sp.items.every(it=>st(it.key))).length;
    return `<button class="st-tp${hot?' hot':''}" data-topic="${t}"><span class="n">ТЕМА ${T.n}${hot?' ⭐':''}</span><span class="w">${T.tests} тест.</span><span class="tt">${esc(T.title)}</span><small>шаги ${done}/${T.steps.length} · готово ${Math.round(r*100)}%</small><div class="st-bar"><i style="width:${Math.round(r*100)}%"></i></div></button>`; }).join('')}</div>
  <details class="st-how lab-orig"><summary>Как это работает и почему (методы)</summary><div class="body">
    <ul>
      <li><b>Сначала задача, потом теория</b> (retrieval practice): пытаться вспомнить и ошибаться полезнее, чем перечитывать. Перечитывание и выделение маркером — одни из самых слабых способов.</li>
      <li><b>Лесенка помощи</b>: подсказка (убирает 2 неверных варианта) → кусочек лекции именно про этот вопрос → ответ с пояснением → Google. Чем меньше ступенек понадобилось, тем позже вопрос вернётся.</li>
      <li><b>Интервальное повторение</b> (коробки Лейтнера): верно сам → через 1, потом 3, 7, 14, 30 дней. Ошибся → вопрос вернётся через 3 карточки и завтра. Готовность темы считается по коробкам.</li>
      <li><b>«Угадал» ≠ «знал»</b>: если угадал, честно нажми «Угадал» — вопрос вернётся скоро.</li>
      <li><b>Чередование тем</b>: новые вопросы идут вперемешку с повторами из других тем — так тест на экзамене не застанет врасплох.</li>
      <li><b>80/20</b>: 7 тем (11, 2, 10, 1, 15, 4, 6) дают 82% всех вопросов. С них и начинаем.</li>
      <li><b>Шаги</b>: тема поделена на шаги по 3–6 вопросов вокруг одного кусочка лекции. Учишь не тему, а шаг.</li>
      <li><b>Объясни как 5-летнему</b> (метод Фейнмана): после ошибки напиши 1–2 предложения своими словами. Заметка всплывёт при следующей встрече и соберётся в «Мой конспект».</li>
      <li><b>Таймер 17/8</b>: короткие блоки работы и настоящий отдых. После перерыва — снова в бой.</li>
      <li><b>Шерлок</b>: быстро листаешь лекцию и цепляешься за то, что заинтересовало, — любопытство помогает запоминать.</li>
    </ul>
    <p class="st-cloud">Источники: Dunlosky и др., 2013 (обзор 10 техник учёбы); Weinstein, Madan, Sumeracki, 2018, «Teaching the science of learning» (Cognitive Research); мета-анализ про интервальное повторение Latimier и др., 2021.</p>
  </div></details>
  </div>`;
  UI.cloudBadge();
}
UI.cloudBadge=()=>{ const el=SEC&&SEC.querySelector('.st-cloud'); if(el&&!SESS) el.textContent=Cloud.ok?'☁ прогресс и заметки сохраняются в твоём аккаунте':'💾 прогресс и заметки сохраняются в этом браузере'; };
UI.refresh=()=>{ if(SEC&&!SESS&&SEC.querySelector('.st-hero')) home(); };

function onHomeClick(e){
  const b=e.target.closest('button,input'); if(!b) return;
  const seg=b.closest('[data-set]');
  if(seg&&b.dataset.v!=null){ const k=seg.dataset.set, v=b.dataset.v;
    if(k==='size') S.set.size=+v; else if(k==='timer'){ const [w,r]=v.split('/').map(Number); S.set.work=w; S.set.rest=r; } else S.set[k]=v;
    persist(); home(); return; }
  if(b.dataset.tp){ const t=b.dataset.tp, a=S.set.topics; const i=a.indexOf(t); if(i<0) a.push(t); else a.splice(i,1); persist(); home(); return; }
  if(b.dataset.a==='recall'){ S.set.recall=b.checked; persist(); return; }
  const tp=e.target.closest('[data-topic]'); if(tp){ topicPage(tp.dataset.topic); return; }
  switch(b.dataset.a){
    case 'go': startSession({}); break;
    case 'due': { const db=build(); startSession({items:shuffle(Object.values(db.items).filter(it=>isDue(it.key)&&okKind(it,S.set.kind))),title:'Повторение'}); break; }
    case 'sherlock': sherlock(); break;
    case 'konspekt': konspekt(); break;
    case 'mistakes': mistakes(); break;
    case 'exam': exam(); break;
  }
}

/* ---------- страница темы: шаги ---------- */
function topicPage(t){
  stopTimer(); SESS=null; const T=build().topics[t];
  SEC.innerHTML=`<div class="read st-wrap"><div class="st-nav" style="margin-top:14px"><button class="btn" data-a="home">← Назад</button><button class="btn pri" data-a="all">▶ Пройти тему по шагам</button></div>
    <div class="topic-head"><div class="eyebrow">Тема ${T.n} · ${T.tests} тестовых вопросов · готово ${Math.round(topicReady(T)*100)}%</div><h1>${esc(T.title)}</h1></div>
    <p>Тема разбита на шаги. Каждый шаг — 3–6 задач вокруг одного кусочка лекции. Выбери шаг или пройди по порядку.</p>
    <div class="st-tn st-kon"><div class="tn"><label><b>✍ Тема ${T.n} своими словами</b> <small>(как объяснил бы 5-летнему — заполни, когда пройдёшь шаги)</small></label><textarea data-note="topic-${t}" placeholder="Например: «Форма — это окно программы. На неё кладут кнопки…»">${esc(noteOf('topic-'+t))}</textarea></div></div>
    ${T.steps.map((sp,i)=>{ const n=sp.items.length, seen=sp.items.filter(it=>st(it.key)).length, m=sp.items.reduce((a,it)=>a+mastery(it.key),0)/n;
      return `<div class="st-card" style="padding:10px 14px"><div class="st-meta"><span class="st-tag${seen===n?' new':''}">Шаг ${i+1}</span>${sp.items.filter(x=>x.type==='test').length} тест. · ${sp.items.filter(x=>x.type==='lab').length} лаб · пройдено ${seen}/${n}</div>
        <div style="display:flex;gap:10px;align-items:center;justify-content:space-between"><b>${esc(sp.title)}</b><button class="btn" data-step="${i}">${seen===n?'Повторить':'▶ Решать'}</button></div><div class="st-bar"><i style="width:${Math.round(m*100)}%"></i></div></div>`; }).join('')}
  </div>`;
  SEC.onclick=e=>{ const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.a==='home'){ SEC.onclick=onHomeClick; home(); return; }
    if(b.dataset.a==='all'){ const its=T.steps.flatMap(sp=>sp.items).filter(it=>!st(it.key)||isDue(it.key)); startSession({items:its.length?its:T.steps.flatMap(sp=>sp.items),title:'Тема '+T.n,size:S.set.size}); return; }
    if(b.dataset.step!=null){ const sp=T.steps[+b.dataset.step]; startSession({items:sp.items,title:`Тема ${T.n} · шаг ${+b.dataset.step+1}`,size:99}); } };
  bindNotes(SEC); scrollTop();
}

/* ---------- сессия ---------- */
function startSession(o){
  const q=buildQueue(o);
  if(!q.length){ alertBox('Здесь пока нечего решать: всё пройдено и до повторения ещё рано. Выбери другие темы или «Пробный экзамен».'); return; }
  SESS={q,i:0,title:o.title||'Сессия',exam:!!o.exam,log:[],requeued:new Set(),start:now()};
  startTimer(); card();
}
function alertBox(msg){ const p=document.createElement('div'); p.className='toast'; p.textContent=msg; document.body.appendChild(p); setTimeout(()=>p.remove(),3500); }
function topBar(){ const it=SESS.q[SESS.i]; const T=build().topics[it.topic]; const n=SESS.q.length;
  return `<div class="st-top"><button class="btn" data-a="quit" title="Выйти на главный экран">✕</button><div class="pg"><b>${esc(SESS.title)}</b> · ${SESS.i+1} / ${n}<div class="st-bar"><i style="width:${Math.round(SESS.i/n*100)}%"></i></div><small>Тема ${T.n}: ${esc(T.title)}</small></div><span class="st-pill" data-timer>${timerText()}</span></div>`; }
function card(){
  if(!SESS) return;
  if(SESS.i>=SESS.q.length){ finish(); return; }
  const it=SESS.q[SESS.i];
  SESS.cur={it,help:0,used:new Set(),answered:false,chunkIdx:0};
  const s=st(it.key); const tag=!s?'<span class="st-tag new">новое</span>':isDue(it.key)?'<span class="st-tag rev">повтор</span>':'<span class="st-tag">ещё раз</span>';
  const T=build().topics[it.topic]; const sp=T.steps[it.step];
  const old=noteOf(it.key);
  SEC.innerHTML=`<div class="read st-wrap">${topBar()}<div class="st-card">
    <div class="st-meta">${tag}<span>${it.type==='test'?'✅ Тест':'💻 Лаба'} · шаг ${it.step+1}: ${esc(sp?sp.title:'')}</span>${s?`<span>· было: ${s.ok} верно, ${s.bad} ошибок</span>`:''}</div>
    ${old?`<details class="st-oldnote"${SESS.exam?'':''}><summary><b>📌 Твоя заметка с прошлого раза</b> (открой, если нужна)</summary><div style="white-space:pre-wrap;margin-top:4px">${esc(old)}</div></details>`:''}
    <div class="st-body"></div>
    <div class="st-after"></div>
  </div></div>`;
  const body=SEC.querySelector('.st-body');
  if(it.type==='test') testCard(it,body); else labCard(it,body);
  SEC.onclick=onCardClick; scrollTop();
}
function testCard(it,body){
  const q=it.q; const opts=shuffle(q.a.map((a,i)=>({a,ok:i===0})));
  SESS.cur.opts=opts;
  const recall=S.set.recall&&!SESS.exam;
  body.innerHTML=`<div class="st-q">${fmt(q.q)}</div>
    ${recall?`<div class="st-recall"><p class="st-cloud">Сначала попробуй вспомнить ответ сам (можно сказать вслух или записать), потом открой варианты.</p><button class="btn" data-a="showopts">Показать варианты</button></div>`:''}
    <div class="st-opts2"${recall?' hidden':''}>${opts.map((o,i)=>`<button class="st-opt" data-o="${i}"><kbd>${i+1}</kbd><span>${fmtInline(o.a)}</span></button>`).join('')}</div>
    ${SESS.exam?'':`<div class="st-ladder"><button class="btn" data-h="hint">💡 Подсказка</button><button class="btn" data-h="lec">📖 Кусочек лекции</button><button class="btn" data-h="ans">👁 Ответ</button><a class="btn" data-h="google" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent(q.q.replace(/```[\s\S]*?```/g,' ').slice(0,300))}">🔎 Google</a></div>`}
    <div class="st-helps"></div>`;
}
function labCard(it,body){
  const t=it.t, lab=it.lab; const id=t.id;
  let w='';
  if(t.vcl) w=`<div class="vclw" data-id="${esc(id)}" data-title="${esc(t.wtitle||t.name)}"><script type="application/json" data-role="vcl">${JSON.stringify(t.vcl).replace(/</g,'\\u003c')}<\/script></div>`;
  else if(t.ref||t.start){ w=`<div class="cppw" data-id="${esc(id)}" data-cmp="${t.cmp||'exact'}" data-title="${esc(t.wtitle||(t.name+' — напиши программу'))}">`;
    if(t.ref) w+=`<script type="text/x-cpp" data-role="ref">\n${String(t.ref).replace(/^\n+/,'').replace(/\s+$/,'')}\n<\/script>`;
    if(t.start) w+=`<script type="text/x-cpp" data-role="start">\n${String(t.start).replace(/^\n+/,'').replace(/\s+$/,'')}\n<\/script>`;
    for(const [nm,txt] of (t.ins||[])) w+=`<script type="text/plain" data-role="in" data-name="${esc(nm)}">${txt}<\/script>`;
    w+='</div>'; }
  body.innerHTML=`<div class="st-meta"><span>${esc(textOf(lab.title||''))}${it.dop?' · доп. лаба':''}</span></div>
    <div class="lab-task"><span class="tl">${esc(t.name)}</span>${t.text||''}</div>
    <div class="st-lab">${w||'<p class="st-cloud">Это задание делается в настоящем C++Builder — прочитай условие и разбор.</p>'}</div>
    <div class="st-ladder"><button class="btn" data-h="hint">💡 Первый шаг</button><button class="btn" data-h="lec">📖 Кусочек лекции</button>${t.steps?'<button class="btn" data-h="steps">🧩 Разбор по шагам</button>':''}${(t.ref||t.vcl&&t.vcl.ref)?'<button class="btn" data-h="ref">👁 Эталон</button>':''}<a class="btn" target="_blank" rel="noopener" data-h="google" href="https://www.google.com/search?q=${encodeURIComponent('C++ Builder '+textOf(t.text||t.name).slice(0,200))}">🔎 Google</a></div>
    <div class="st-helps"></div>
    <div class="st-conf"><b>Как прошло?</b><button class="btn" data-lab="self">✔ Решил сам</button><button class="btn" data-lab="help">〰 С подсказкой</button><button class="btn" data-lab="no">✖ Не решил</button></div>`;
  CPP.initTasks&&CPP.initTasks(body); CPP.initVcl&&CPP.initVcl(body);
  const wd=body.querySelector('.cppw,.vclw');
  if(wd&&G.MutationObserver){ const mo=new MutationObserver(()=>{ if(wd.classList.contains('solved')&&SESS&&SESS.cur&&SESS.cur.it===it&&!SESS.cur.answered){ mo.disconnect(); labDone(SESS.cur.help?'help':'self',true); } }); mo.observe(wd,{attributes:true,attributeFilter:['class']}); }
}
function addHelp(kind,html,cls){ const h=SEC.querySelector('.st-helps'); const box=document.createElement('div'); box.className='st-help'+(cls?' '+cls:''); box.dataset.kind=kind; box.innerHTML=html; h.appendChild(box); return box; }
function lecChunkHTML(it,idx){
  const db=build(); const ids=it.chunks; if(!ids.length) return '<div class="h">📖 Кусочек лекции</div><p>Подходящего кусочка не нашлось — открой лекцию темы.</p>';
  const c=db.chunkById.get(ids[idx%ids.length]);
  return `<div class="h">📖 Кусочек лекции · ${esc(c.head)}${ids.length>1?`<button data-a="morelec">ещё кусочек (${idx%ids.length+1}/${ids.length})</button>`:''}<button data-a="openlec">вся лекция</button></div><div class="lc">${c.html}</div>`;
}
function useHelp(h){
  const C=SESS.cur, it=C.it; if(h==='google'){ C.help=Math.max(C.help,3); return; }
  if(C.used.has(h)&&h!=='lec') return; C.used.add(h);
  const btn=SEC.querySelector(`[data-h="${h}"]`); if(btn) btn.classList.add('used');
  if(it.type==='test'){
    if(h==='hint'){ C.help=Math.max(C.help,1); const wrong=C.opts.map((o,i)=>o.ok?-1:i).filter(i=>i>=0); shuffle(wrong).slice(0,Math.max(0,wrong.length-1>=2?2:wrong.length-1)).forEach(i=>{ const b=SEC.querySelector(`[data-o="${i}"]`); if(b){ b.classList.add('gone'); b.disabled=true; } });
      addHelp('hint','<div class="h">💡 Подсказка</div><p>Убрал два неверных варианта. Подумай ещё раз.</p>'); }
    if(h==='lec'){ C.help=Math.max(C.help,2); const ex=SEC.querySelector('.st-help[data-kind="lec"]'); if(ex){ ex.scrollIntoView({block:'nearest'}); return; } addHelp('lec',lecChunkHTML(it,0)); }
    if(h==='ans'){ C.help=3; revealTest(-1); }
  } else {
    const t=it.t;
    if(h==='hint'){ C.help=Math.max(C.help,1); const first=t.steps?firstStep(t.steps):''; addHelp('hint',`<div class="h">💡 Первый шаг</div>${first||'<p>Перечитай условие: что дано и что нужно вывести. Начни с объявления переменных и ввода.</p>'}`); }
    if(h==='lec'){ C.help=Math.max(C.help,2); if(!SEC.querySelector('.st-help[data-kind="lec"]')) addHelp('lec',lecChunkHTML(it,0)); }
    if(h==='steps'){ C.help=3; addHelp('steps',`<div class="h">🧩 Разбор по шагам</div><div class="solve">${t.steps}</div>`); }
    if(h==='ref'){ C.help=3; const code=t.ref||(t.vcl&&t.vcl.ref&&(t.vcl.ref.unit||t.vcl.ref.code))||''; addHelp('ref',`<div class="h">👁 Эталон</div><pre class="cpp-code">${CPP.highlight?CPP.highlight(String(code).replace(/^\n+|\s+$/g,'')):esc(code)}</pre>`,'ans'); }
  }
}
function firstStep(html){ const d=document.createElement('div'); d.innerHTML=html; const kids=[...d.children]; const out=[]; let hcount=0;
  for(const k of kids){ if(/^H[2-5]$/.test(k.tagName)){ hcount++; if(hcount>2) break; } out.push(k.outerHTML); if(out.join('').length>900) break; }
  return out.join(''); }
function revealTest(picked){
  const C=SESS.cur; if(C.answered) return; C.answered=true;
  const it=C.it, q=it.q; const ok=picked>=0&&C.opts[picked].ok;
  SEC.querySelectorAll('.st-opt').forEach((b,i)=>{ b.disabled=true; if(C.opts[i].ok) b.classList.add('right'); else if(i===picked) b.classList.add('wrong'); });
  const op=SEC.querySelector('.st-opts2'); if(op) op.hidden=false; SEC.querySelector('.st-recall')?.remove();
  C.ok=ok;
  const after=SEC.querySelector('.st-after');
  let h=`<div class="st-res ${ok?'ok':'bad'}">${picked<0?'Ответ показан':ok?(C.help?'✔ Верно (с помощью)':'✔ Верно!'):'✖ Неверно'}</div>`;
  if(q.e||!SESS.exam) h+=`<div class="st-help ans"><div class="h">✔ Правильный ответ</div><p>${fmtInline(q.a[0])}</p>${q.e?`<p class="st-cloud" style="color:inherit">${fmtInline(q.e)}</p>`:''}</div>`;
  if(!SESS.exam&&!SEC.querySelector('.st-help[data-kind="lec"]')&&(!ok||C.help)) h+=`<div class="st-help" data-kind="lec">${lecChunkHTML(it,0)}</div>`;
  if(ok&&!C.help&&!SESS.exam) h+=`<div class="st-conf"><b>Честно:</b><button class="btn on" data-conf="knew">💪 Знал</button><button class="btn" data-conf="guess">🎲 Угадал</button></div>`;
  if(!SESS.exam) h+=noteBox(it,!ok||C.help>=2);
  h+=`<div class="st-nav"><span class="st-cloud">${ok&&!C.help?'Вернётся через '+BOX_DAYS[Math.min(5,((st(it.key)||{}).b||0)+1)]+' дн.':'Вернётся через 3 карточки и завтра'}</span><button class="btn pri" data-a="next">Дальше → <kbd>Enter</kbd></button></div>`;
  after.innerHTML=h; bindNotes(after);
  C.conf='knew';
  grade(it,ok,C.help,'knew');
  SESS.log.push({it,ok,help:C.help});
  if(!ok||C.help>=2) requeue(it);
}
function noteBox(it,push){ const v=noteOf(it.key);
  return `<div class="st-note${v?' old':''}"><label>✍ ${push?'Объясни себе своими словами, как 5-летнему':'Заметка себе на будущее'} <small>— сохранится и попадёт в «Мой конспект»; при следующей встрече всплывёт</small></label><textarea data-note="${it.key}" placeholder="${push?'Например: «Caption — надпись на кнопке, а Text — то, что человек печатает в Edit»':'Что запомнить, на чём легко ошибиться…'}">${esc(v)}</textarea></div>`; }
function requeue(it){ if(SESS.exam||SESS.requeued.has(it.key)) return; SESS.requeued.add(it.key); SESS.q.splice(Math.min(SESS.q.length,SESS.i+4),0,it); }
function labDone(kind,auto){
  const C=SESS.cur; if(C.answered) return; C.answered=true; const it=C.it;
  const ok=kind!=='no', help=kind==='self'?(C.help?Math.min(C.help,1):0):kind==='help'?Math.max(1,C.help):3;
  grade(it,ok,help,'knew'); SESS.log.push({it,ok,help}); if(!ok||help>=2) requeue(it);
  SEC.querySelectorAll('[data-lab]').forEach(b=>b.disabled=true);
  const after=SEC.querySelector('.st-after');
  after.innerHTML=`<div class="st-res ${ok?'ok':'bad'}">${auto?'✔ Автопроверка пройдена! ':''}${ok?(help?'Решено с помощью — вернётся скоро':'Отлично, решено самостоятельно'):'Не страшно — вернётся через несколько карточек и завтра'}</div>${noteBox(it,!ok||help>=2)}<div class="st-nav"><span></span><button class="btn pri" data-a="next">Дальше →</button></div>`;
  bindNotes(after);
}
function onCardClick(e){
  const b=e.target.closest('button,a'); if(!b||!SESS) return;
  if(b.dataset.a==='quit'){ if(SESS.log.length) finish(); else { SEC.onclick=onHomeClick; home(); } return; }
  if(b.dataset.a==='next'){ SESS.i++; card(); return; }
  if(b.dataset.a==='showopts'){ SEC.querySelector('.st-opts2').hidden=false; SEC.querySelector('.st-recall').remove(); return; }
  if(b.dataset.a==='morelec'){ const box=b.closest('.st-help'); SESS.cur.chunkIdx++; box.innerHTML=lecChunkHTML(SESS.cur.it,SESS.cur.chunkIdx); return; }
  if(b.dataset.a==='openlec'){ const t=SESS.cur.it.topic; const btn=document.querySelector(`.tabs [data-t="${t}"]`); if(btn){ btn.click(); setTimeout(()=>{ const d=document.getElementById(t+'-lecture'); if(d){ d.open=true; d.scrollIntoView({behavior:'smooth'}); } },120); } return; }
  if(b.dataset.o!=null){ if(SESS.cur.answered) return; revealTest(+b.dataset.o); return; }
  if(b.dataset.h){ useHelp(b.dataset.h); return; }
  if(b.dataset.lab){ labDone(b.dataset.lab,false); return; }
  if(b.dataset.conf){ const it=SESS.cur.it; SEC.querySelectorAll('[data-conf]').forEach(x=>x.classList.toggle('on',x===b));
    if(b.dataset.conf!==SESS.cur.conf){ SESS.cur.conf=b.dataset.conf; const s=S.items[it.key];
      if(b.dataset.conf==='guess'){ s.b=1; s.due=now()+DAY-3600e3; requeue(it); } else { s.b=Math.min(5,(s.b||0)+1); s.due=now()+BOX_DAYS[s.b]*DAY-3600e3; } persist(); } }
}
function keys(e){
  if(!SEC||SEC.hidden||!SESS||e.target.closest('input,textarea,select,.cppw,.vclw')) return;
  if(SESS.brk) return;
  const C=SESS.cur; if(!C) return;
  if(/^[1-9]$/.test(e.key)&&C.it.type==='test'&&!C.answered){ const b=SEC.querySelector(`[data-o="${+e.key-1}"]`); if(b&&!b.disabled&&!b.closest('[hidden]')){ e.preventDefault(); b.click(); } return; }
  if(e.key==='Enter'&&C.answered){ e.preventDefault(); SESS.i++; card(); }
}
function bindNotes(root){ root.querySelectorAll('textarea[data-note]').forEach(ta=>ta.addEventListener('input',()=>setNote(ta.dataset.note,ta.value))); }

/* ---------- итог ---------- */
function finish(){
  stopTimer(); const L=SESS.log; const ok=L.filter(x=>x.ok&&!x.help).length, hl=L.filter(x=>x.ok&&x.help).length, bad=L.filter(x=>!x.ok).length;
  const byT={}; L.forEach(x=>{ const k=x.it.topic; byT[k]=byT[k]||{ok:0,n:0}; byT[k].n++; if(x.ok&&!x.help) byT[k].ok++; });
  const mins=Math.max(1,Math.round((now()-SESS.start)/60000));
  const weak=Object.entries(byT).filter(([,v])=>v.ok/v.n<.7).map(([k])=>k);
  const exam=SESS.exam;
  SEC.innerHTML=`<div class="read st-wrap st-done"><div class="topic-head"><div class="eyebrow">${esc(SESS.title)} · ${mins} мин</div><h1>${exam?'Результат экзамена':'Готово! 🎉'}</h1></div>
    <div class="st-hero"><div class="st-kpi"><b>${ok}</b><span>сам и верно</span></div><div class="st-kpi"><b>${hl}</b><span>с помощью</span></div><div class="st-kpi"><b>${bad}</b><span>ошибок</span></div><div class="st-kpi"><b>${Math.round(examReady()*100)}%</b><span>готовность к тестам</span></div></div>
    ${exam?`<p><b>Оценка:</b> ${Math.round(ok/Math.max(1,L.length)*100)}% верных.</p>`:''}
    <div class="tw"><table><tr><th>Тема</th><th>Верно сам</th></tr>${Object.entries(byT).sort((a,b)=>+a[0].slice(1)-+b[0].slice(1)).map(([k,v])=>`<tr><td>${build().topics[k].n}. ${esc(build().topics[k].title)}</td><td>${v.ok} / ${v.n}</td></tr>`).join('')}</table></div>
    ${weak.length?`<p>Слабые места: ${weak.map(k=>'тема '+build().topics[k].n).join(', ')}. Открой их на «Карте тем» и пройди по шагам.</p>`:''}
    ${bad||hl?`<p>Ошибки и вопросы «с помощью» вернутся завтра — это нормально, так и запоминается.</p>`:''}
    <p>Теперь <b>перерыв</b>. Потом можно ещё один круг — или запиши в «Мой конспект», что сегодня понял.</p>
    <div class="st-nav"><button class="btn" data-a="home">На главную</button><button class="btn pri" data-a="go">▶ Ещё круг</button></div></div>`;
  SESS=null; SEC.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; SEC.onclick=onHomeClick; if(b.dataset.a==='go') startSession({}); else home(); };
  scrollTop();
}

/* ---------- таймер 17/8 ---------- */
let T0=0, phase='work';
function startTimer(){ if(TIMER) return; T0=now(); phase='work'; TIMER=setInterval(tick,1000); }
function stopTimer(){ clearInterval(TIMER); TIMER=null; }
function left(){ const len=(phase==='work'?S.set.work:S.set.rest)*60000; return Math.max(0,len-(now()-T0)); }
function timerText(){ const l=left(); const m=Math.floor(l/60000), s=Math.floor(l/1000)%60; return (phase==='work'?'⏱ ':'☕ ')+m+':'+String(s).padStart(2,'0'); }
function tick(){
  const el=SEC&&SEC.querySelector('[data-timer]'); if(el){ el.textContent=timerText(); el.classList.toggle('rest',phase==='rest'); }
  if(left()>0) return;
  if(phase==='work'){ phase='rest'; T0=now(); if(SESS) showBreak(); }
  else { phase='work'; T0=now(); if(SESS&&SESS.brk){ SESS.brk=false; card(); } }
}
function showBreak(){
  SESS.brk=true; const last=SESS.log.slice(-6).filter(x=>x.it.type==='test');
  SEC.innerHTML=`<div class="read st-wrap"><div class="st-card st-break"><div class="eyebrow">Перерыв · ${S.set.rest} минут</div><div class="big" data-timer>${timerText()}</div>
    <p>Встань, пройдись, попей воды, посмотри в окно. Телефон лучше не трогать — мозг в это время раскладывает выученное по полкам.</p>
    ${last.length?`<p class="st-cloud">Пока отдыхаешь, вспомни без подглядывания: о чём был вопрос «${esc(String(last[last.length-1].it.q.q).replace(/```[\s\S]*?```/g,'…').slice(0,110))}…» и какой там ответ?</p>`:''}
    <div class="st-nav" style="justify-content:center"><button class="btn" data-a="skipbrk">Пропустить перерыв</button></div></div></div>`;
  SEC.onclick=e=>{ const b=e.target.closest('[data-a="skipbrk"]'); if(b){ phase='work'; T0=now(); SESS.brk=false; SEC.onclick=onCardClick; card(); } };
}

/* ---------- Шерлок ---------- */
function sherlock(){
  stopTimer(); const db=build(); const tps=scopeTopics();
  let list=shuffle(tps.flatMap(t=>db.topics[t]?db.topics[t].chunks.filter(c=>!c.umkd&&c.text.length>120):[]));
  let i=0; const picked=[];
  const draw=()=>{
    if(i>=list.length) i=0;
    const c=list[i], T=db.topics[c.topic];
    const qn=Object.values(db.items).filter(it=>(it.home===c.id||it.chunks[0]===c.id)).length;
    SEC.innerHTML=`<div class="read st-wrap"><div class="st-top"><button class="btn" data-a="home">✕</button><div class="pg"><b>🔍 Шерлок</b> · ${i+1} / ${list.length}<small> · зацепило: ${picked.length}</small></div><button class="btn pri" data-a="quiz"${picked.length?'':' disabled'}>▶ Решать зацепившее</button></div>
      <p class="st-cloud">Листай быстро. Не читай всё подряд — ищи то, что удивило, непонятно или интересно. Жми «Зацепило», и по этому кусочку будут вопросы.</p>
      <div class="st-card st-sher"><div class="h">Тема ${T.n} · ${esc(c.head)}</div><div class="bd">${c.html}</div></div>
      <div class="st-nav"><button class="btn" data-a="more">Читать полностью</button><span class="st-cloud">${qn?qn+' задач по этому кусочку':'вопросов по кусочку нет'}</span><span style="display:flex;gap:6px"><button class="btn" data-a="hook">🔍 Зацепило</button><button class="btn pri" data-a="nxt">Дальше → <kbd>пробел</kbd></button></span></div></div>`;
  };
  draw(); scrollTop();
  SEC.onclick=e=>{ const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.a==='home'){ SEC.onclick=onHomeClick; sherKeys=null; home(); return; }
    if(b.dataset.a==='nxt'){ i++; draw(); return; }
    if(b.dataset.a==='more'){ SEC.querySelector('.st-sher .bd').classList.add('open'); return; }
    if(b.dataset.a==='hook'){ if(!picked.includes(list[i])) picked.push(list[i]); i++; draw(); return; }
    if(b.dataset.a==='quiz'){ const its=Object.values(db.items).filter(it=>picked.some(c=>it.home===c.id||it.chunks[0]===c.id)&&okKind(it,S.set.kind==='labs'?'labs':'mix')); sherKeys=null; SEC.onclick=null; startSession({items:shuffle(its),title:'Шерлок: зацепившее',size:30}); } };
  sherKeys=e=>{ if(e.key===' '&&!e.target.closest('input,textarea,button')){ e.preventDefault(); i++; draw(); } };
}
let sherKeys=null;

/* ---------- Мой конспект ---------- */
function konspekt(){
  stopTimer(); const db=build(); const q=s=>String(s).replace(/```[\s\S]*?```/g,'[код]');
  let h=`<div class="read st-wrap st-kon"><div class="st-nav" style="margin-top:14px"><button class="btn" data-a="home">← Назад</button><span style="display:flex;gap:6px"><button class="btn" data-a="export">⬇ Скачать конспект (.txt)</button></span></div>
    <div class="topic-head"><div class="eyebrow">все твои объяснения своими словами</div><h1>📝 Мой конспект</h1></div>
    <p>Перед экзаменом читай это, а не лекции: тут то, что ты сам понял и сформулировал. Заметки можно править прямо здесь.</p>
    <input class="st-search" placeholder="Поиск по заметкам…" style="width:100%;font:15px var(--f-body);padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)">`;
  let any=false;
  for(const t of TOPIC_IDS){ const T=db.topics[t]; if(!T) continue;
    const its=T.items.filter(it=>noteOf(it.key)); const tn=noteOf('topic-'+t);
    if(!its.length&&!tn) continue; any=true;
    h+=`<h3>Тема ${T.n}. ${esc(T.title)}</h3><div class="tn"><b>Тема своими словами</b><textarea data-note="topic-${t}" placeholder="Объясни тему целиком, как 5-летнему">${esc(tn)}</textarea></div>`;
    T.steps.forEach((sp,si)=>{ const xs=sp.items.filter(it=>noteOf(it.key)); if(!xs.length) return;
      h+=`<p class="st-cloud" style="margin:.8em 0 .2em"><b>Шаг ${si+1}: ${esc(sp.title)}</b></p>`;
      for(const it of xs) h+=`<div class="it" data-k="${it.key}"><div class="q">${it.type==='test'?esc(q(it.q.q)).slice(0,400):'💻 '+esc(it.t.name)}</div>${it.type==='test'?`<div class="a">✔ ${esc(it.q.a[0])}</div>`:''}<textarea data-note="${it.key}">${esc(noteOf(it.key))}</textarea></div>`; });
  }
  if(!any) h+=`<p><i>Пока пусто. Заметки появляются, когда ты пишешь их на карточках во время учёбы («Объясни своими словами»).</i></p>`;
  h+=`<details class="lab-orig"><summary>Добавить объяснение темы, по которой ещё нет заметок</summary><div class="body">${TOPIC_IDS.filter(t=>db.topics[t]&&!noteOf('topic-'+t)).map(t=>`<div class="tn"><b>Тема ${db.topics[t].n}. ${esc(db.topics[t].title)}</b><textarea data-note="topic-${t}"></textarea></div>`).join('')}</div></details></div>`;
  SEC.innerHTML=h; bindNotes(SEC); scrollTop();
  SEC.querySelector('.st-search').addEventListener('input',e=>{ const v=e.target.value.toLowerCase(); SEC.querySelectorAll('.it').forEach(x=>{ x.hidden=v&&!x.textContent.toLowerCase().includes(v)&&!x.querySelector('textarea').value.toLowerCase().includes(v); }); });
  SEC.onclick=async e=>{ const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.a==='home'){ SEC.onclick=onHomeClick; home(); return; }
    if(b.dataset.a==='export'){ const txt=exportText(); const name='Мой конспект C++.txt';
      try{ const dl=G.claude&&G.claude.use?await G.claude.use('downloads'):null; if(dl){ await dl.save({filename:name,data:txt}); return; } }catch(err){ if(err&&err.code&&err.code!=='unavailable') return; }
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500); } };
}
function exportText(){ const db=build(); const L=['МОЙ КОНСПЕКТ ПО C++',''];
  for(const t of TOPIC_IDS){ const T=db.topics[t]; if(!T) continue; const its=T.items.filter(it=>noteOf(it.key)); const tn=noteOf('topic-'+t); if(!its.length&&!tn) continue;
    L.push('=== Тема '+T.n+'. '+T.title+' ==='); if(tn) L.push('Своими словами: '+tn,'');
    for(const it of its){ if(it.type==='test') L.push('Вопрос: '+String(it.q.q).replace(/```[\s\S]*?```/g,'[код]'),'Ответ: '+it.q.a[0]); else L.push('Лаба: '+it.t.name); L.push('Моя заметка: '+noteOf(it.key),''); } }
  return L.join('\n'); }

/* ---------- ошибки и экзамен ---------- */
function mistakes(){
  const db=build(); const its=Object.values(db.items).filter(it=>{ const s=st(it.key); return s&&(s.bad>0||s.b<=1); }).sort((a,b)=>(st(b.key).bad-st(a.key).bad));
  if(!its.length){ alertBox('Ошибок пока нет — сначала порешай!'); return; }
  startSession({items:its,title:'Мои ошибки',size:Math.min(30,its.length)});
}
function exam(){
  const db=build(); const all=Object.values(db.items).filter(it=>it.type==='test'); const N=40; const out=[];
  for(const T of Object.values(db.topics)){ const ts=T.items.filter(x=>x.type==='test'); const k=Math.round(N*ts.length/all.length); out.push(...shuffle(ts).slice(0,Math.max(k,ts.length?1:0))); }
  startSession({items:shuffle(out).slice(0,N),title:'Пробный экзамен',size:N,exam:true});
}

/* ---------- вход ---------- */
function init(sec){
  SEC=sec; css();
  if(!S){ loadLocal(); Cloud.init(); }
  if(!sec.dataset.ready){ sec.dataset.ready='1'; document.addEventListener('keydown',e=>{ if(SEC.hidden) return; if(sherKeys) sherKeys(e); else keys(e); }); }
  if(!SESS){ SEC.onclick=onHomeClick; home(); }
}
CPP.initStudy=function(sec){ if(sec&&sec.id==='c17') init(sec); };
CPP.STUDY_TEST={build,buildQueue,grade,examReady,state:()=>S};
})(typeof window!=='undefined'?window:globalThis);
