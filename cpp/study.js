/* Вкладка «🎯 Учиться» (C++): одна кнопка «Начать» — дальше всё само.
   Раунд = рабочий отрезок таймера (по умолчанию 15 мин, первый раунд дня — короткий разгон 7 мин), потом босс из ошибок раунда,
   потом перерыв (5 мин) с тизером следующего вопроса. Внутри: задача сначала → одна кнопка помощи (50/50 → кусочек лекции → ответ+Google),
   интервальное повторение (коробки 1-3-7-14-30 дней), вопрос считается выученным, только если отвечен верно в двух разных видах
   (выбор / верно-неверно / вписать), «слишком быстро» = угадал, ставка ×3 (эффект гиперкоррекции), молния-раунд, комбо, опыт и ранги,
   сундуки со случайной наградой, серия дней с заморозкой, каждый 4-й раунд — контрольная без подсказок. Заметки «как 5-летнему»
   (+опыт, скопированное не засчитывается) всплывают при следующей встрече и собираются в «Мой конспект».
   Прогресс и заметки — localStorage + личный раздел базы артефакта (data/users/<id>/study, заметки — по документу). */
(function(G){
'use strict';
const CPP=G.CPP;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>typeof G.qfmt==='function'?G.qfmt(s):esc(s);
const fmtInline=s=>esc(s).replace(/`([^`\n]+)`/g,'<code>$1</code>');
const hash=s=>{ let h=5381; s=String(s); for(let i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))|0; return (h>>>0).toString(36); };
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pick=a=>a[Math.floor(Math.random()*a.length)];
const DAY=864e5, now=()=>Date.now();
const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dkey(new Date());
const BOX_DAYS=[0,1,3,7,14,30];
const ORDER_8020=['c11','c2','c10','c1','c15','c4','c6','c3','c7','c9','c5','c8','c12','c13','c14'];   // по числу вопросов в тестах
const TOPIC_IDS=Array.from({length:15},(_,i)=>'c'+(i+1));
const DEF_SET={v:2,work:15,rest:5,topics:[],labs:false,examDate:''};

/* ================= хранилище ================= */
const LS='study:v1';
let S=null;   // {items:{key:{b,due,seen,ok,bad,last,help,fm[]}}, notes:{key:{t,ts}}, days:{date:n}, set, xp, freeze, rounds, nx:{key:1}, ts}
function norm(){
  S=Object.assign({items:{},notes:{},days:{},set:{},xp:0,freeze:1,rounds:0,nx:{}},S||{});
  if(S.set.v!==2) S.set=Object.assign({},DEF_SET,{topics:[]});
  S.set=Object.assign({},DEF_SET,S.set);
}
function loadLocal(){ try{ S=JSON.parse(localStorage.getItem(LS)||'null'); }catch(e){ S=null; } norm(); }
function saveLocal(){ try{ localStorage.setItem(LS,JSON.stringify(S)); }catch(e){} }
const Cloud={db:null,uid:null,ref:null,ok:false,t:null,noteT:{},
  async init(){
    try{ if(!(G.claude&&typeof G.claude.use==='function')) return;
      const [db,user]=await Promise.all([G.claude.use('db').catch(()=>null),G.claude.use('user').catch(()=>null)]);
      if(!db||!user) return; const uid=await user.id(); if(!uid) return;
      this.db=db; this.uid=uid; this.ref=db.doc('data/users/'+uid+'/study');
      const timer=new Promise((_,rj)=>setTimeout(()=>rj(new Error('timeout')),10000));
      const [snap,notes]=await Promise.race([Promise.all([this.ref.get(),this.ref.collection('notes').get()]),timer]);
      if(snap.exists){ const d=snap.data()||{}; mergeItems(d.items||{}); for(const k in (d.days||{})) S.days[k]=Math.max(S.days[k]||0,d.days[k]);
        if(d.set&&d.set.v===2&&!(S.ts>d.ts)) S.set=Object.assign({},DEF_SET,d.set);
        S.xp=Math.max(S.xp||0,d.xp||0); S.rounds=Math.max(S.rounds||0,d.rounds||0); if(d.ts>(S.ts||0)) S.freeze=d.freeze??S.freeze; Object.assign(S.nx,d.nx||{}); }
      (notes.docs||[]).forEach(dn=>{ const v=dn.data(); const k=dn.id; if(v&&(!S.notes[k]||(v.ts||0)>(S.notes[k].ts||0))) S.notes[k]={t:String(v.t||''),ts:v.ts||0}; });
      this.ok=true; saveLocal(); this.pushProgress(); UI.refresh&&UI.refresh(); UI.cloudBadge&&UI.cloudBadge();
    }catch(e){ this.ok=false; UI.cloudBadge&&UI.cloudBadge(); }
  },
  pushProgress(){ if(!this.ok) return; clearTimeout(this.t); this.t=setTimeout(()=>{ this.ref.set({items:S.items,days:S.days,set:S.set,xp:S.xp,freeze:S.freeze,rounds:S.rounds,nx:S.nx,ts:now()}).catch(()=>{}); },2500); },
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

/* ================= повторение, опыт, ранги ================= */
const st=k=>S.items[k]||null;
// help: 0 — сам, 1 — 50/50, 2 — лекция, 3 — ответ. fast — ответил подозрительно быстро (похоже на угадывание)
function grade(it,ok,help,o){
  o=o||{}; const s=S.items[it.key]=Object.assign({b:0,due:0,seen:0,ok:0,bad:0},S.items[it.key]||{});
  s.seen++; s.last=now(); s.help=help; s.fm=s.fm||[];
  if(ok&&help===0&&!o.fast){ s.ok++; if(o.fmt&&!s.fm.includes(o.fmt)) s.fm.push(o.fmt);
    let nb=(s.b||0)+1; if(nb>2&&s.fm.length<2&&it.type==='test') nb=2;   // «выучено» — только после верного ответа в двух разных видах
    s.b=Math.min(5,nb); }
  else if(ok){ s.ok++; s.b=Math.max(1,Math.min(s.b||1,2)); }
  else { s.bad++; s.b=1; }
  s.due=now()+BOX_DAYS[s.b]*DAY-3600e3;
  const d=today(); S.days[d]=(S.days[d]||0)+1;
  persist();
}
const mastery=k=>{ const s=st(k); if(!s) return 0; return s.b>=3?1:s.b===2?.6:s.b===1?.25:0; };
const isDue=k=>{ const s=st(k); return !!s&&s.due<=now(); };
function examReady(){ const db=build(); let s=0,n=0; for(const t of Object.values(db.topics)) for(const x of t.items) if(x.type==='test'){ s+=mastery(x.key); n++; } return n?s/n:0; }
function streak(){ let n=0; const d=new Date(); for(let i=0;i<1000;i++){ const k=dkey(d); if(S.days[k]) n++; else if(i>0) break; d.setDate(d.getDate()-1); } return n; }
// пропустил вчера — сгорает заморозка, серия не рвётся (немного «слабины» мотивирует сильнее жёстких правил)
function useFreeze(){ const y=new Date(); y.setDate(y.getDate()-1); const b=new Date(); b.setDate(b.getDate()-2);
  if(!S.days[dkey(y)]&&S.days[dkey(b)]&&S.freeze>0){ S.days[dkey(y)]=-1; S.freeze--; persist(); return true; } return false; }
const RANKS=['Стажёр','Джун','Джун+','Мидл','Мидл+','Сеньор','Тимлид','Архитектор','Гуру C++Builder','Легенда кафедры'];
function level(xp){ let L=1, need=250, acc=0; while(xp>=acc+need){ acc+=need; L++; need=250*L; } return {L,cur:xp-acc,need,rank:RANKS[Math.min(RANKS.length-1,L-1)]}; }

/* ================= очередь ================= */
function scopeTopics(){ const t=S.set.topics; return t&&t.length?ORDER_8020.filter(x=>t.includes(x)):ORDER_8020.slice(); }
function okItem(it){ return it.type==='test'||(S.set.labs&&it.type==='lab'&&(it.t.ref||it.t.vcl||it.t.start)); }
function buildQueue(size){
  const db=build(); const tps=scopeTopics();
  const pool=tps.flatMap(t=>db.topics[t]?db.topics[t].items:[]).filter(okItem);
  const due=shuffle(pool.filter(it=>isDue(it.key))).sort((a,b)=>st(a.key).b-st(b.key).b);
  // новые: две первые незаконченные темы по важности (80/20) идут вперемешку, внутри темы — шаг за шагом
  const per=[]; for(const t of tps){ const T=db.topics[t]; if(!T) continue; const f=T.steps.flatMap(sp=>sp.items).filter(it=>!st(it.key)&&okItem(it)&&it.type==='test'); if(f.length) per.push(f); if(per.length>=2) break; }
  const fresh=[]; for(let i=0;fresh.length<size&&per.some(f=>i<f.length);i++) for(const f of per) if(f[i]) fresh.push(f[i]);
  const labs=S.set.labs?shuffle(pool.filter(it=>it.type==='lab'&&(!st(it.key)||isDue(it.key)))):[];
  const nDue=Math.min(due.length,Math.ceil(size*.4)); const di=due.filter(x=>x.type==='test').slice(0,nDue);
  const q=[]; let a=0,b=0,l=0;
  while(q.length<size&&(a<fresh.length||b<di.length)){
    if(b<di.length) q.push(di[b++]);                     // начинаем с повтора — это легче, разгон
    if(a<fresh.length) q.push(fresh[a++]); if(a<fresh.length) q.push(fresh[a++]);
    if(labs[l]&&q.length%7>=5) q.push(labs[l++]); }
  if(q.length<size){ const rest=pool.filter(it=>it.type==='test'&&st(it.key)&&!q.includes(it)).sort((x,y)=>st(x.key).b-st(y.key).b||st(x.key).due-st(y.key).due); for(const it of rest){ if(q.length>=size) break; q.push(it); } }
  if(q.length<size){ for(const it of shuffle(pool.filter(x=>x.type==='test'&&!q.includes(x)))){ if(q.length>=size) break; q.push(it); } }
  return q;
}
// вид карточки: новое — выбор; дальше — тот вид, в котором ещё не отвечал верно
const plain=s=>String(s).replace(/`/g,'').trim();
function typable(it){ if(it.type!=='test') return false; const a=plain(it.q.a[0]);
  return a.length>=2&&a.length<=22&&a.split(/\s+/).length<=2&&!/^(все|ни |нет|да$|оба|верно|неверно|никак)/i.test(a)&&!/[«»]/.test(a); }
function chooseFmt(it){
  if(it.type==='lab') return 'lab';
  const s=st(it.key); if(!s||!s.seen) return 'mcq';
  if(s.b<=1&&s.bad&&s.last>now()-DAY) return 'mcq';
  const all=['mcq','tf'].concat(typable(it)?['type']:[]); const fm=s.fm||[];
  const fresh=all.filter(f=>!fm.includes(f));
  if(s.b>=2&&typable(it)&&Math.random()<.6) return 'type';
  return pick(fresh.length?fresh:all);
}

/* ================= интерфейс ================= */
const UI={};
let SEC=null, SESS=null, TIMER=null, OVER=null;
let phase='idle', T0=0, PLEN=0, TITLE0='', FLASH=null;
const CSS=`
.st-wrap{max-width:780px}
.st-home{text-align:center;padding:18px 0 8px}
.st-hi{display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;margin:8px 0 22px}
.st-ring{--p:0;width:96px;height:96px;border-radius:50%;background:conic-gradient(var(--ok) calc(var(--p)*1%),var(--line) 0);display:grid;place-items:center;flex:none}
.st-ring>div{width:78px;height:78px;border-radius:50%;background:var(--bg);display:grid;place-items:center;line-height:1.05}
.st-ring b{font:700 24px var(--f-display)} .st-ring small{font-size:10.5px;color:var(--muted)}
.st-lv{text-align:left;min-width:220px}
.st-lv b{font-size:17px}
.st-lv small{display:block;color:var(--muted);font-size:13px;margin-top:4px}
.st-bar{height:7px;border-radius:4px;background:var(--line);overflow:hidden;margin-top:6px}
.st-bar i{display:block;height:100%;background:var(--accent);transition:width .4s}
.st-bar.ok i{background:var(--ok)}
.st-start{font:800 26px var(--f-display);letter-spacing:.04em;color:var(--surface);background:var(--accent);border:0;border-radius:18px;padding:22px 64px;cursor:pointer;box-shadow:0 6px 0 color-mix(in srgb,var(--accent) 60%,#000);transition:transform .08s,box-shadow .08s;animation:st-breath 2.6s ease-in-out infinite}
.st-start:active{transform:translateY(5px);box-shadow:0 1px 0 color-mix(in srgb,var(--accent) 60%,#000)}
@keyframes st-breath{50%{transform:scale(1.035)}}
.st-sub{color:var(--muted);font-size:14px;margin:14px 0 6px}
.st-setb{font:600 14px var(--f-body);background:none;border:1px solid var(--line);color:var(--ink);border-radius:10px;padding:8px 16px;cursor:pointer;margin-top:10px}
.st-panel{text-align:left;display:grid;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px;margin:14px 0}
.st-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.st-row>b{min-width:110px;font-size:14px}
.st-row small{color:var(--muted)}
.st-seg{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.st-seg button{font:600 13.5px var(--f-body);border:0;background:var(--surface);color:var(--ink);padding:6px 12px;cursor:pointer}
.st-seg button+button{border-left:1px solid var(--line)}
.st-seg button.on{background:var(--accent);color:var(--surface)}
.st-chips{display:flex;flex-wrap:wrap;gap:4px}
.st-chips button{font:600 12.5px var(--f-body);border:1px solid var(--line);background:var(--surface);color:var(--muted);border-radius:999px;padding:3px 10px;cursor:pointer;min-width:34px}
.st-chips button.on{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
.st-panel input[type=date]{font:14px var(--f-body);padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}
.st-how{text-align:left;margin:22px 0 6px}
.st-top{position:sticky;top:var(--hdrh,64px);z-index:5;background:var(--bg);padding:8px 0;display:flex;gap:8px;align-items:center;border-bottom:1px solid var(--line)}
.st-pill{font:700 14px var(--f-mono);border:1px solid var(--line);border-radius:999px;padding:4px 12px;background:var(--surface);white-space:nowrap}
.st-pill.rest{background:var(--ok-bg);color:var(--ok)}
.st-pill.up{background:var(--fix-bg);color:var(--fix)}
.st-combo{font:800 15px var(--f-body);color:var(--fix);min-width:48px}
.st-combo.hot{animation:st-pop .35s}
.st-xp{font:700 14px var(--f-body);white-space:nowrap}
.st-tlv{flex:1;min-width:90px;font-size:12px;color:var(--muted);text-align:right}
.st-tlv .st-bar{height:5px;margin-top:3px}
.st-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:12px 0;position:relative}
.st-card.boss{border:2px solid var(--bad);box-shadow:0 0 0 4px var(--bad-bg)}
.st-card.light{border:2px solid var(--fix)}
.st-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:var(--muted);margin-bottom:8px}
.st-tag{font:700 11px var(--f-body);letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:2px 9px;background:var(--accent-soft);color:var(--accent)}
.st-tag.rev{background:var(--fix-bg);color:var(--fix)} .st-tag.new{background:var(--ok-bg);color:var(--ok)} .st-tag.boss{background:var(--bad-bg);color:var(--bad)}
.st-hp{font-size:15px;letter-spacing:2px}
.st-q{font-size:17px;font-weight:600;white-space:pre-line;margin:4px 0 12px}
.st-q pre{white-space:pre;font-weight:400}
.st-claim{font-size:16px;background:var(--bg);border:1.5px dashed var(--line);border-radius:9px;padding:10px 12px;margin:0 0 12px}
.st-os{display:grid;gap:7px}
.st-tf{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.st-opt{text-align:left;font:15.5px var(--f-body);background:var(--bg);color:var(--ink);border:1.5px solid var(--line);border-radius:10px;padding:10px 12px;cursor:pointer;display:flex;gap:10px;align-items:baseline}
.st-tf .st-opt{justify-content:center;font-weight:700;font-size:17px}
.st-opt kbd{flex:none}
.st-opt:hover:not(:disabled){border-color:var(--accent)}
.st-opt:disabled{cursor:default}
.st-opt.right{background:var(--ok-bg);border-color:var(--ok)}
.st-opt.wrong{background:var(--bad-bg);border-color:var(--bad);animation:st-shake .3s}
.st-opt.gone{opacity:.25;text-decoration:line-through}
.st-type{display:flex;gap:8px;flex-wrap:wrap}
.st-type input{flex:1;min-width:180px;font:16px var(--f-mono);padding:9px 12px;border:1.5px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)}
.st-type input.right{border-color:var(--ok);background:var(--ok-bg)} .st-type input.wrong{border-color:var(--bad);background:var(--bad-bg)}
.st-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0 2px}
.st-bet{font:700 13.5px var(--f-body);border:1.5px dashed var(--fix);background:none;color:var(--fix);border-radius:9px;padding:6px 12px;cursor:pointer}
.st-bet.on{background:var(--fix);color:var(--surface);border-style:solid}
.st-lt{height:5px;border-radius:3px;background:var(--line);overflow:hidden;margin:-4px 0 10px}
.st-lt i{display:block;height:100%;background:var(--fix);width:100%}
.st-help{border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 8px 8px 0;padding:8px 12px;margin:10px 0;font-size:15px}
.st-help>.h{font:700 11.5px var(--f-body);letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:4px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.st-help>.h button{margin-left:auto;font:600 12px var(--f-body);border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:6px;padding:2px 8px;cursor:pointer}
.st-help>.h button+button{margin-left:0}
.st-help.ans{border-color:var(--ok);background:var(--ok-bg)} .st-help.ans>.h{color:var(--ok)}
.st-help.hc{border-color:var(--fix);background:var(--fix-bg)} .st-help.hc>.h{color:var(--fix)}
.st-res{font-weight:800;font-size:17px;margin:12px 0 4px;animation:st-pop .3s}
.st-res.ok{color:var(--ok)} .st-res.bad{color:var(--bad)}
.st-res small{font-weight:500;font-size:13.5px;color:var(--muted);display:block;margin-top:2px}
.st-note{margin-top:12px;background:var(--fix-bg);border-radius:8px;padding:8px 10px}
.st-note label{display:block;font:600 13.5px var(--f-body);margin-bottom:4px}
.st-note textarea{width:100%;min-height:56px;font:14.5px var(--f-body);border:1px solid var(--line);border-radius:6px;padding:6px 8px;background:var(--surface);color:var(--ink);resize:vertical}
.st-xpb{font:700 12px var(--f-body);color:var(--fix);background:var(--surface);border-radius:999px;padding:1px 8px;margin-left:4px}
.st-old{background:var(--fix-bg);border-radius:8px;padding:6px 10px;margin:0 0 10px;font-size:14.5px}
.st-old summary{cursor:pointer;font-weight:600;color:var(--fix)}
.st-nav{display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:12px}
.st-nav .btn.pri{font-size:15px;padding:9px 18px}
.st-auto{height:3px;background:var(--line);border-radius:2px;overflow:hidden;margin-top:10px}
.st-auto i{display:block;height:100%;background:var(--ok);width:0;animation:st-fill var(--d,1.4s) linear forwards}
@keyframes st-fill{to{width:100%}}
.st-float{position:fixed;z-index:60;font:800 18px var(--f-body);color:var(--fix);pointer-events:none;animation:st-up 1s ease-out forwards}
@keyframes st-up{to{transform:translateY(-46px);opacity:0}}
@keyframes st-pop{0%{transform:scale(.7)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes st-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes st-wob{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}75%{transform:rotate(10deg)}}
.st-over{position:fixed;inset:0;z-index:70;background:color-mix(in srgb,var(--ink) 45%,transparent);display:grid;place-items:center;padding:16px}
.st-over>div{background:var(--surface);color:var(--ink);border-radius:18px;padding:26px 28px;max-width:380px;width:100%;text-align:center;animation:st-pop .35s}
.st-over .em{font-size:64px;line-height:1.1}
.st-over .em.wob{animation:st-wob .5s ease-in-out infinite}
.st-over h2{margin:.3em 0 .2em;font-size:22px}
.st-over p{color:var(--muted);margin:.3em 0 1em}
.st-big{text-align:center;padding:24px 10px}
.st-big .em{font-size:64px}
.st-big h1{margin:.2em 0}
.st-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:14px 0}
.st-stats div{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 6px;text-align:center}
.st-stats b{display:block;font:700 24px var(--f-display)}
.st-stats span{font-size:12.5px;color:var(--muted)}
.st-brk{background:var(--ok-bg);border-radius:14px;padding:16px;margin:14px 0;text-align:center}
.st-brk .t{font:700 44px var(--f-mono);color:var(--ok)}
.st-tease{margin:12px 0;color:var(--muted);font-size:14px}
.st-tease span{filter:blur(4px);user-select:none}
.st-go2{animation:st-breath 1.6s ease-in-out infinite}
.st-kon h3{margin-top:1.4em}
.st-kon .it{border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin:6px 0;background:var(--surface)}
.st-kon .it .q{font-size:13.5px;color:var(--muted);white-space:pre-line}
.st-kon .it .a{font-size:13px;color:var(--ok);margin-top:2px}
.st-kon textarea{width:100%;min-height:52px;font:14.5px var(--f-body);border:1px solid var(--line);border-radius:6px;padding:6px 8px;background:var(--fix-bg);color:var(--ink);margin-top:4px}
.st-cloud{font-size:12.5px;color:var(--muted)}
.st-lab .cppw,.st-lab .vclw{margin:10px 0}
@media (max-width:640px){.st-start{padding:20px 40px;font-size:23px}.st-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.st-tlv{display:none}.st-row>b{min-width:100%}}
`;
function css(){ if(document.getElementById('study-css')) return; const s=document.createElement('style'); s.id='study-css'; s.textContent=CSS; document.head.appendChild(s); }
const scrollTop=()=>{ const hd=document.querySelector('header.top'); const y=SEC.getBoundingClientRect().top+G.scrollY-(hd?hd.offsetHeight:0)-6; if(G.scrollY>y) G.scrollTo({top:Math.max(0,y)}); };
function toast(msg){ const p=document.createElement('div'); p.className='toast'; p.textContent=msg; document.body.appendChild(p); setTimeout(()=>p.remove(),2600); }
const PRAISE=['Чётко!','Красава!','Огонь!','Так держать!','Мозг качается 💪','Без шансов для экзамена','Вот это да','Изи','Ты в потоке','Лучший!'];
const rdToday=()=>(S.rd&&S.rd[today()])||0;

/* ---------- главный экран: две кнопки ---------- */
function daysToExam(){ if(!S.set.examDate) return null; const d=Math.ceil((new Date(S.set.examDate+'T09:00')-now())/DAY); return d>=0?d:null; }
function nextRoundInfo(){
  const seen=Object.keys(S.items).length;
  if((S.rounds+1)%4===0&&seen>=30) return '🎓 Следующий раунд — контрольная: 15 вопросов как на экзамене, без подсказок';
  const w=!S.days[today()]?Math.min(7,S.set.work):S.set.work;
  return `Раунд ${w} мин${!S.days[today()]?' (разгон дня — коротко)':''} → 👾 босс из твоих ошибок → ☕ перерыв ${S.set.rest} мин`;
}
function home(){
  stopTick(); SESS=null; closeOver(); clearInterval(FLASH); if(TITLE0) document.title=TITLE0;
  useFreeze();
  const ready=Math.round(examReady()*100), lv=level(S.xp||0), db=build();
  const dueN=Object.values(db.items).filter(it=>it.type==='test'&&isDue(it.key)).length;
  const dte=daysToExam();
  let goal='';
  if(dte!=null){ const left=Object.values(db.items).filter(it=>it.type==='test'&&mastery(it.key)<1).length; goal=` · до экзамена <b>${dte} дн.</b> · в день ~${Math.ceil(left/Math.max(1,dte-1))} вопросов`; }
  SEC.innerHTML=`<div class="read st-wrap"><div class="st-home">
    <div class="st-hi">
      <div class="st-ring" style="--p:${ready}"><div><span><b>${ready}%</b><br><small>к экзамену</small></span></div></div>
      <div class="st-lv"><b>Ур. ${lv.L} · ${lv.rank}</b><div class="st-bar"><i style="width:${Math.round(lv.cur/lv.need*100)}%"></i></div>
        <small>⭐ ${lv.cur}/${lv.need} до следующего ранга · 🔥 ${streak()} дн. подряд · ❄ ${S.freeze||0}</small>
        <small>изучено вопросов: ${Object.values(db.items).filter(it=>it.type==='test'&&st(it.key)&&st(it.key).ok).length} из ${db.total} · сегодня раундов: ${rdToday()}${rdToday()?' ✅':''}${dueN?` · ждут повторения: ${dueN}`:''}${goal}</small></div>
    </div>
    <button class="st-start" data-a="go">▶ НАЧАТЬ</button>
    <div class="st-sub">${nextRoundInfo()}</div>
    <button class="st-setb" data-a="set">⚙ Настроить</button>
    <div class="st-panel" hidden></div>
    <p class="st-cloud" data-cloud></p>
    ${howHTML()}
  </div></div>`;
  UI.cloudBadge(); SEC.onclick=onHomeClick;
}
function howHTML(){ return `<details class="st-how lab-orig"><summary>Что внутри и почему так</summary><div class="body"><ul>
  <li><b>Сразу задача</b>, теория — только если застрял (одна кнопка 💡: убрать 2 неверных → кусочек лекции → ответ и Google). Попытка вспомнить даже с ошибкой запоминается сильнее, чем чтение.</li>
  <li><b>Повторение по графику</b>: верно → вернётся через 1, 3, 7, 14, 30 дней; ошибка → через 3 карточки и завтра. Новое из двух самых важных тем (80/20) идёт вперемешку с повторами.</li>
  <li><b>Проверка, что знаешь сам</b>: вопрос засчитан выученным, только когда ответил верно в двух разных видах — выбор, «верно/неверно», вписать ответ руками. Слишком быстрый ответ на новый вопрос = угадывание, проверю ещё раз.</li>
  <li><b>Ставка ×3</b>: если уверен — ставь. Уверенная ошибка запоминается лучше всего (эффект гиперкоррекции), поэтому после неё сразу показываю почему.</li>
  <li><b>Чтобы не надоедало</b>: комбо, опыт и ранги, случайные сундуки, ⚡ молния (5 вопросов по 10 секунд), 👾 босс из ошибок раунда, каждый 4-й раунд — контрольная.</li>
  <li><b>Таймер</b>: 15 минут работы и 5 минут отдыха, первый раунд дня — 7 минут, чтобы легко начать. Серия дней с заморозкой: пропустил день — серия не сгорает.</li>
  <li><b>Как 5-летнему</b>: после ошибки 1 строка своими словами = +15 ⭐ (скопированное не считается). Заметка всплывёт при следующей встрече и попадёт в «Мой конспект».</li>
</ul><p class="st-cloud">Опора: Dunlosky и др., 2013; Weinstein, Madan, Sumeracki, 2018; про пробные вопросы и ошибки — Pan & Carpenter, 2023; про гиперкоррекцию — Butterfield & Metcalfe, 2001; про серии — Silverman & Barasch, 2023.</p></div></details>`; }
function panelHTML(){
  const s=S.set; const seg=(name,opts,cur)=>`<span class="st-seg" data-set="${name}">${opts.map(([v,l])=>`<button data-v="${v}" class="${String(cur)===String(v)?'on':''}">${l}</button>`).join('')}</span>`;
  const all=!s.topics.length;
  return `<div class="st-row"><b>⏱ Таймер</b>${seg('timer',[['10/3','10/3'],['15/5','15/5 ★'],['17/8','17/8'],['25/5','25/5']],s.work+'/'+s.rest)}<small>работа/отдых, мин</small></div>
    <div class="st-row"><b>📚 Темы</b><span class="st-chips"><button data-tp="all" class="${all?'on':''}">все</button>${TOPIC_IDS.map(t=>`<button data-tp="${t}" class="${s.topics.includes(t)?'on':''}">${t.slice(1)}</button>`).join('')}</span></div>
    <div class="st-row"><b>💻 Лабы</b>${seg('labs',[['0','нет — только тесты'],['1','иногда']],s.labs?1:0)}<small>РК2 — 12%, экзаменационные тесты — 40%</small></div>
    <div class="st-row"><b>📅 Экзамен</b><input type="date" data-a="date" value="${esc(s.examDate||'')}"><small>посчитаю, сколько в день</small></div>
    <div class="st-row"><b>📝</b><button class="btn" data-a="konspekt">Мой конспект</button><button class="btn" data-a="close">Готово</button></div>`;
}
UI.cloudBadge=()=>{ const el=SEC&&SEC.querySelector('[data-cloud]'); if(el) el.textContent=Cloud.ok?'☁ прогресс и заметки сохраняются в твоём аккаунте':'💾 прогресс и заметки сохраняются в этом браузере'; };
UI.refresh=()=>{ if(SEC&&!SESS&&SEC.querySelector('.st-home')&&SEC.querySelector('.st-panel[hidden]')) home(); };
function onHomeClick(e){
  const b=e.target.closest('button,input'); if(!b) return;
  const P=SEC.querySelector('.st-panel');
  const seg=b.closest('[data-set]');
  if(seg&&b.dataset.v!=null){ const k=seg.dataset.set, v=b.dataset.v;
    if(k==='timer'){ const [w,r]=v.split('/').map(Number); S.set.work=w; S.set.rest=r; } else if(k==='labs') S.set.labs=v==='1';
    persist(); P.innerHTML=panelHTML(); SEC.querySelector('.st-sub').innerHTML=nextRoundInfo(); return; }
  if(b.dataset.tp){ const t=b.dataset.tp, a=S.set.topics; if(t==='all') a.length=0; else { const i=a.indexOf(t); if(i<0) a.push(t); else a.splice(i,1); if(a.length===15) a.length=0; } persist(); P.innerHTML=panelHTML(); return; }
  switch(b.dataset.a){
    case 'go': startRound(); break;
    case 'set': P.hidden=!P.hidden; if(!P.hidden){ P.innerHTML=panelHTML(); const d=P.querySelector('[data-a="date"]'); } break;
    case 'close': P.hidden=true; home(); break;
    case 'konspekt': konspekt(); break;
  }
}
function onHomeChange(e){ const d=e.target.closest('[data-a="date"]'); if(d&&SEC.querySelector('.st-home')){ S.set.examDate=d.value; persist(); } }

/* ---------- раунд ---------- */
function examPick(N){ const db=build(); const tps=scopeTopics(); const all=tps.flatMap(t=>db.topics[t]?db.topics[t].items.filter(x=>x.type==='test'):[]); const out=[];
  for(const t of tps){ const T=db.topics[t]; if(!T) continue; const ts=T.items.filter(x=>x.type==='test'); const k=Math.round(N*ts.length/Math.max(1,all.length)); out.push(...shuffle(ts).slice(0,k)); }
  return shuffle(out).slice(0,N); }
function startRound(){
  useFreeze(); closeOver(); clearInterval(FLASH); if(TITLE0) document.title=TITLE0;
  const seen=Object.keys(S.items).length, first=!S.days[today()];
  const exam=(S.rounds+1)%4===0&&seen>=30;
  const mins=first?Math.min(7,S.set.work):S.set.work;
  SESS={n:S.rounds+1,exam,mins,q:exam?examPick(15):buildQueue(40),qi:0,cards:0,ok:0,bad:0,xp:0,log:[],errs:[],combo:0,best:0,dbl:0,since:0,
        light:null,lightDone:false,boss:null,timeUp:false,start:now(),ready0:examReady(),lv0:level(S.xp||0).L,queue:[]};
  if(!SESS.q.length){ toast('В выбранных темах нет вопросов — проверь «Настроить»'); SESS=null; return; }
  phase='work'; T0=now(); PLEN=exam?36e5:mins*60000; startTick();
  next();
}
function next(){
  if(!SESS) return; const C=SESS.cur; if(C){ clearTimeout(C.auto); clearInterval(C.lt); noteXP(C); }
  if(SESS.queue.length){ const f=SESS.queue.shift(); return f(); }      // уровень, сундук
  if(SESS.boss) return bossNext();
  if(SESS.exam){ if(SESS.qi>=SESS.q.length) return roundEnd(); const it=SESS.q[SESS.qi++]; return card(it,'mcq','exam'); }
  if(SESS.timeUp&&!SESS.light) return startBoss();
  if(!SESS.lightDone&&SESS.cards>=6&&!SESS.light){ SESS.lightDone=true;
    const pool=Object.values(build().items).filter(it=>it.type==='test'&&st(it.key)&&scopeTopics().includes(it.topic));
    if(pool.length>=5){ SESS.light={list:shuffle(pool).slice(0,5),i:0,ok:0}; return lightIntro(); } }
  if(SESS.light){ const L=SESS.light; if(L.i<L.list.length) return card(L.list[L.i++],'tf','light');
    SESS.light=null; const bonus=L.ok===5?40:L.ok*5; if(bonus) addXP(bonus); toast(`⚡ Молния: ${L.ok}/5${L.ok===5?' — идеально! +40 ⭐':bonus?' · +'+bonus+' ⭐':''}`);
    if(SESS.timeUp) return startBoss(); }
  if(SESS.qi>=SESS.q.length){ const rest=new Set(SESS.q.slice(SESS.qi)); SESS.q=SESS.q.concat(buildQueue(30).filter(x=>!rest.has(x))); }
  const it=SESS.q[SESS.qi++]; if(!it) return startBoss();
  card(it,chooseFmt(it),'normal');
}
function requeue(it){ if(!SESS||SESS.exam||SESS.boss) return; if(SESS.q.slice(SESS.qi,SESS.qi+6).includes(it)) return; SESS.q.splice(Math.min(SESS.q.length,SESS.qi+3),0,it); }
function topBar(){
  const lv=level(S.xp||0);
  return `<div class="st-top"><button class="btn" data-a="quit" title="Закончить раунд">✕</button><span class="st-pill${SESS.timeUp?' up':''}" data-timer>${timerText()}</span>
    <span class="st-combo" data-combo>${SESS.combo>=2?'🔥×'+SESS.combo:''}</span><span class="st-xp" data-xp>⭐ +${SESS.xp}</span>
    <div class="st-tlv">ур. ${lv.L} · ${lv.rank}<div class="st-bar"><i data-lvbar style="width:${Math.round(lv.cur/lv.need*100)}%"></i></div></div></div>`; }
function helpSteps(it,fm){ if(it.type==='lab') return ['first','lec'].concat(it.t.steps?['steps']:[]).concat((it.t.ref||it.t.vcl&&it.t.vcl.ref)?['ref']:[]);
  return fm==='mcq'?['half','lec','ans']:fm==='type'?['opts','lec','ans']:['lec','ans']; }
const HELP_LBL={half:'убрать 2 неверных',lec:'кусочек лекции',ans:'показать ответ',opts:'показать варианты',first:'первый шаг',steps:'разбор по шагам',ref:'эталон'};
function helpBtn(){ const C=SESS.cur; const hs=C.hs; if(C.hi>=hs.length) return ''; return `💡 Помощь: ${HELP_LBL[hs[C.hi]]} <small>(${C.hi+1}/${hs.length})</small>`; }
function card(it,fm,ctx){
  SESS.cur={it,fm,ctx,help:0,hi:0,hs:helpSteps(it,fm),answered:false,t0:now(),bet:false,chunkIdx:0};
  if(ctx==='normal'||ctx==='exam') SESS.cards++;
  const C=SESS.cur, s=st(it.key), T=build().topics[it.topic];
  C.canBet=ctx==='normal'&&fm==='mcq'&&!!s&&SESS.cards%5===3;
  const FM={mcq:'выбери ответ',tf:'верно или нет?',type:'впиши сам',lab:'лаба'};
  let tag;
  if(ctx==='boss') tag=`<span class="st-tag boss">👾 Босс</span><span class="st-hp">${'❤'.repeat(SESS.boss.q.length)}${'🖤'.repeat(SESS.boss.max-SESS.boss.q.length)}</span>`;
  else if(ctx==='light') tag=`<span class="st-tag rev">⚡ Молния ${SESS.light.i}/5</span>`;
  else if(ctx==='exam') tag=`<span class="st-tag">🎓 Контрольная ${SESS.qi}/${SESS.q.length}</span>`;
  else tag=!s?'<span class="st-tag new">новое</span>':isDue(it.key)?'<span class="st-tag rev">повтор</span>':'<span class="st-tag">ещё раз</span>';
  const old=ctx!=='exam'&&ctx!=='light'?noteOf(it.key):'';
  SEC.innerHTML=`<div class="read st-wrap">${topBar()}<div class="st-card ${ctx}">
    <div class="st-meta">${tag}<span>${FM[fm]} · тема ${T.n}</span>${C.canBet?'<span class="st-tag rev">🎰 можно ставку</span>':''}</div>
    ${old?`<details class="st-old"><summary>📌 Твоя заметка с прошлого раза</summary><div style="white-space:pre-wrap;margin-top:4px">${esc(old)}</div></details>`:''}
    <div class="st-body"></div><div class="st-helps"></div><div class="st-after"></div></div></div>`;
  const body=SEC.querySelector('.st-body');
  if(fm==='lab') labBody(it,body); else if(fm==='tf') tfBody(it,body); else if(fm==='type') typeBody(it,body); else mcqBody(it,body);
  SEC.onclick=onCardClick; scrollTop();
  if(ctx==='light'){ const bar=SEC.querySelector('.st-lt i'); const L=10000, t0=now(); C.lt=setInterval(()=>{ const p=1-(now()-t0)/L; if(bar) bar.style.width=Math.max(0,p*100)+'%'; if(p<=0){ clearInterval(C.lt); answer(false,{timeout:true}); } },100); }
  if(fm==='type') setTimeout(()=>{ const i=SEC.querySelector('.st-type input'); if(i) i.focus({preventScroll:true}); },30);
}
function tools(){ const C=SESS.cur; if(C.ctx==='exam'||C.ctx==='light') return '';
  return `<div class="st-tools">${C.canBet?'<button class="st-bet" data-a="bet">🎰 Ставлю ×3 — уверен! <small>(ошибка −20)</small></button>':''}<button class="btn" data-a="help">${helpBtn()}</button></div>`; }
function mcqBody(it,body){ const q=it.q; const C=SESS.cur; C.opts=shuffle(q.a.map((a,i)=>({a,ok:i===0})));
  body.innerHTML=`<div class="st-q">${fmt(q.q)}</div><div class="st-os">${C.opts.map((o,i)=>`<button class="st-opt" data-o="${i}"><kbd>${i+1}</kbd><span>${fmtInline(o.a)}</span></button>`).join('')}</div>${tools()}`; }
function tfBody(it,body){ const q=it.q, C=SESS.cur; const t=q.a.length<2||Math.random()<.5; C.tfTrue=t; C.claim=t?q.a[0]:pick(q.a.slice(1));
  body.innerHTML=`<div class="st-q">${fmt(q.q)}</div>${C.ctx==='light'?'<div class="st-lt"><i></i></div>':''}<div class="st-claim">Ответ: <b>${fmtInline(C.claim)}</b></div>
    <div class="st-tf"><button class="st-opt" data-tf="1"><kbd>1</kbd>✔ Верно</button><button class="st-opt" data-tf="0"><kbd>2</kbd>✖ Неверно</button></div>${tools()}`; }
function typeBody(it,body){ const q=it.q;
  body.innerHTML=`<div class="st-q">${fmt(q.q)}</div><div class="st-type"><input autocomplete="off" spellcheck="false" placeholder="впиши ответ (${plain(q.a[0]).length} симв.)"><button class="btn pri" data-a="check">Проверить ↵</button></div>${tools()}`;
  body.querySelector('input').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); checkType(); } }); }
const nrm=s=>plain(s).toLowerCase().replace(/[\s();.,'"«»:;!]/g,'').replace(/ё/g,'е');
function lev(a,b){ const m=a.length,n=b.length; if(Math.abs(m-n)>1) return 9; const d=Array.from({length:m+1},(_,i)=>[i]); for(let j=1;j<=n;j++) d[0][j]=j;
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); return d[m][n]; }
function checkType(){ const C=SESS.cur; if(C.answered) return; const inp=SEC.querySelector('.st-type input'); const v=nrm(inp.value), a=nrm(C.it.q.a[0]);
  if(!v){ inp.focus(); return; }
  const ok=v===a||(a.length>=6&&lev(v,a)<=1); inp.disabled=true; inp.classList.add(ok?'right':'wrong'); answer(ok,{typed:inp.value}); }
function labBody(it,body){
  const t=it.t, lab=it.lab, id=t.id; let w='';
  if(t.vcl) w=`<div class="vclw" data-id="${esc(id)}" data-title="${esc(t.wtitle||t.name)}"><script type="application/json" data-role="vcl">${JSON.stringify(t.vcl).replace(/</g,'\\u003c')}<\/script></div>`;
  else if(t.ref||t.start){ w=`<div class="cppw" data-id="${esc(id)}" data-cmp="${t.cmp||'exact'}" data-title="${esc(t.wtitle||(t.name+' — напиши программу'))}">`;
    if(t.ref) w+=`<script type="text/x-cpp" data-role="ref">\n${String(t.ref).replace(/^\n+/,'').replace(/\s+$/,'')}\n<\/script>`;
    if(t.start) w+=`<script type="text/x-cpp" data-role="start">\n${String(t.start).replace(/^\n+/,'').replace(/\s+$/,'')}\n<\/script>`;
    for(const [nm,txt] of (t.ins||[])) w+=`<script type="text/plain" data-role="in" data-name="${esc(nm)}">${txt}<\/script>`;
    w+='</div>'; }
  body.innerHTML=`<div class="st-meta"><span>${esc(textOf(lab.title||''))}${it.dop?' · доп. лаба':''}</span></div>
    <div class="lab-task"><span class="tl">${esc(t.name)}</span>${t.text||''}</div><div class="st-lab">${w}</div>${tools()}
    <div class="st-nav"><button class="btn" data-lab="no">Пропустить</button><button class="btn" data-lab="self">✔ Сделал</button></div>`;
  CPP.initTasks&&CPP.initTasks(body); CPP.initVcl&&CPP.initVcl(body);
  const wd=body.querySelector('.cppw,.vclw');
  if(wd&&G.MutationObserver){ const mo=new MutationObserver(()=>{ if(wd.classList.contains('solved')&&SESS&&SESS.cur&&SESS.cur.it===it&&!SESS.cur.answered){ mo.disconnect(); answer(true,{auto:true}); } }); mo.observe(wd,{attributes:true,attributeFilter:['class']}); }
}
function addHelp(kind,html,cls){ const h=SEC.querySelector('.st-helps'); const box=document.createElement('div'); box.className='st-help'+(cls?' '+cls:''); box.dataset.kind=kind; box.innerHTML=html; h.appendChild(box); return box; }
const gq=it=>it.type==='test'?it.q.q.replace(/```[\s\S]*?```/g,' ').slice(0,300):'C++ Builder '+textOf(it.t.text||it.t.name).slice(0,200);
const googleA=it=>`<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent(gq(it))}">🔎 Google</a>`;
function lecChunkHTML(it,idx){
  const db=build(); const ids=it.chunks; if(!ids.length) return '<div class="h">📖 Кусочек лекции</div><p>Подходящего кусочка не нашлось.</p>';
  const c=db.chunkById.get(ids[idx%ids.length]);
  return `<div class="h">📖 Лекция · ${esc(c.head)}${ids.length>1?`<button data-a="morelec">ещё (${idx%ids.length+1}/${ids.length})</button>`:''}<button data-a="openlec">вся лекция</button></div><div class="lc">${c.html}</div>`; }
function useHelp(){
  const C=SESS.cur, it=C.it; if(C.answered||C.hi>=C.hs.length) return; const h=C.hs[C.hi++];
  if(h==='half'){ C.help=Math.max(C.help,1); const wrong=C.opts.map((o,i)=>o.ok?-1:i).filter(i=>i>=0); shuffle(wrong).slice(0,Math.min(2,wrong.length-1)).forEach(i=>{ const b=SEC.querySelector(`[data-o="${i}"]`); if(b){ b.classList.add('gone'); b.disabled=true; } }); }
  if(h==='opts'){ C.help=Math.max(C.help,1); C.fm='mcq'; C.hs=['lec','ans']; C.hi=0; const body=SEC.querySelector('.st-body'); mcqBody(it,body); C.t0=now(); return; }
  if(h==='lec'){ C.help=Math.max(C.help,2); addHelp('lec',lecChunkHTML(it,0)); }
  if(h==='ans'){ C.help=3; answer(false,{shown:true}); return; }
  if(h==='first'){ C.help=Math.max(C.help,1); addHelp('hint',`<div class="h">💡 Первый шаг</div>${it.t.steps?firstStep(it.t.steps):'<p>Что дано и что нужно вывести? Начни с переменных и ввода.</p>'}`); }
  if(h==='steps'){ C.help=3; addHelp('steps',`<div class="h">🧩 Разбор по шагам</div><div class="solve">${it.t.steps}</div>`); }
  if(h==='ref'){ C.help=3; const code=it.t.ref||(it.t.vcl&&it.t.vcl.ref&&(it.t.vcl.ref.unit||it.t.vcl.ref.code))||''; addHelp('ref',`<div class="h">👁 Эталон ${googleA(it)}</div><pre class="cpp-code">${CPP.highlight?CPP.highlight(String(code).replace(/^\n+|\s+$/g,'')):esc(code)}</pre>`,'ans'); }
  const b=SEC.querySelector('[data-a="help"]'); if(b){ const t=helpBtn(); if(t) b.innerHTML=t; else b.remove(); }
}
function firstStep(html){ const d=document.createElement('div'); d.innerHTML=html; const out=[]; let hc=0;
  for(const k of [...d.children]){ if(/^H[2-5]$/.test(k.tagName)){ hc++; if(hc>2) break; } out.push(k.outerHTML); if(out.join('').length>900) break; } return out.join(''); }
// подозрительно быстро для нового вопроса — человек не мог успеть прочитать
function fastLimit(C){ const it=C.it; let t=it.q.q; if(C.fm==='mcq') t+=it.q.a.join(' '); else if(C.fm==='tf') t+=C.claim; return Math.min(3500,700+t.replace(/```[\s\S]*?```/g,m=>m.slice(0,80)).length*12); }

function answer(ok,info){
  info=info||{}; const C=SESS.cur; if(!C||C.answered) return; C.answered=true; clearInterval(C.lt);
  const it=C.it, dt=now()-C.t0, s0=st(it.key);
  const fast=ok&&C.help===0&&C.ctx!=='light'&&C.fm!=='type'&&C.fm!=='lab'&&(!s0||(s0.b||0)<2)&&dt<fastLimit(C);
  const help=C.fm==='lab'?(ok?(info.auto?Math.min(C.help,1):Math.max(1,Math.min(C.help,2))):3):C.help;
  grade(it,ok,help,{fmt:C.fm,fast});
  let xp=0;
  if(ok&&help===0){ SESS.combo++; SESS.best=Math.max(SESS.best,SESS.combo); xp=10+Math.min(SESS.combo,10)+(C.fm==='type'?10:0)+(C.ctx==='boss'?5:0)+(C.fm==='lab'?30:0); if(C.bet) xp*=3; if(SESS.dbl>0){ xp*=2; SESS.dbl--; } if(fast) xp=Math.round(xp/2); }
  else if(ok){ SESS.combo=0; xp=C.fm==='lab'?10:4; }
  else { SESS.combo=0; xp=C.bet?-20:1; }
  addXP(xp);
  SESS.log.push({it,ok,help,ctx:C.ctx}); if(ok&&!help) SESS.ok++; else if(!ok) SESS.bad++;
  if(C.ctx==='light'&&ok) SESS.light.ok++;
  if(C.ctx==='boss'){ const B=SESS.boss; B.q.shift(); if(!ok){ if(!B.retry.has(it.key)){ B.retry.add(it.key); B.q.push(it); } else B.lost++; } }
  else if(!ok||help>=2){ if(C.ctx!=='exam'&&!SESS.errs.includes(it)) SESS.errs.push(it); requeue(it); }
  // разметка
  if(C.opts) SEC.querySelectorAll('[data-o]').forEach((b,i)=>{ b.disabled=true; if(C.opts[i].ok) b.classList.add('right'); else if(i===info.picked) b.classList.add('wrong'); });
  if(C.fm==='tf') SEC.querySelectorAll('[data-tf]').forEach(b=>{ b.disabled=true; const v=b.dataset.tf==='1'; if(v===C.tfTrue) b.classList.add('right'); else if(info.tf!=null&&v===info.tf) b.classList.add('wrong'); });
  SEC.querySelectorAll('[data-lab],[data-a="bet"]').forEach(b=>b.disabled=true);
  const hb=SEC.querySelector('[data-a="help"]'); if(hb) hb.remove();
  const after=SEC.querySelector('.st-after'); let h='';
  const comboEl=SEC.querySelector('[data-combo]'); if(comboEl){ comboEl.textContent=SESS.combo>=2?'🔥×'+SESS.combo:''; if(SESS.combo>=2){ comboEl.classList.remove('hot'); void comboEl.offsetWidth; comboEl.classList.add('hot'); } }
  const lab=C.fm==='lab';
  if(ok){ h+=`<div class="st-res ok">✔ ${C.bet?'🎰 Ставка сыграла! ':''}${info.auto?'Автопроверка пройдена! ':''}${pick(PRAISE)} <span style="color:var(--fix)">+${xp} ⭐</span>${help?'<small>с подсказкой — вернётся скоро</small>':''}${fast?'<small>⚡ Слишком быстро для нового вопроса — засчитал наполовину и проверю ещё раз в другом виде</small>':''}${C.fm==='type'?'<small>✍ вписал сам — это самая честная проверка</small>':''}</div>`; }
  else h+=`<div class="st-res bad">${info.shown?'👁 Ответ показан':info.timeout?'⏰ Время вышло':lab?'Пропущено':'✖ Мимо'}${C.bet?' · −20 ⭐':''}<small>${C.ctx==='boss'?'Босс отбился — этот вопрос ещё вернётся в бою':C.ctx==='exam'?'':'Вернётся через 3 карточки и завтра — так и запоминается'}</small></div>`;
  if(C.bet&&!ok) h+=`<div class="st-help hc"><div class="h">🎯 Ты был уверен — это ловушка</div><p>Уверенные ошибки исправляются и запоминаются лучше всего, если прямо сейчас понять почему. Прочитай ответ ниже.</p></div>`;
  if(!lab&&(!ok||C.fm==='tf'&&!C.tfTrue||info.typed!=null||it.q.e)&&C.ctx!=='light'){
    h+=`<div class="st-help ans"><div class="h">✔ Правильный ответ</div><p>${fmtInline(it.q.a[0])}</p>${it.q.e?`<p class="st-cloud" style="color:inherit">${fmtInline(it.q.e)}</p>`:''}</div>`; }
  else if(C.ctx==='light'&&!ok) h+=`<div class="st-help ans"><div class="h">✔ Ответ</div><p>${fmtInline(it.q.a[0])}</p></div>`;
  const stay=!ok||help>=2;
  if(stay&&C.ctx!=='exam'&&C.ctx!=='light'){
    if(!lab&&!SEC.querySelector('.st-help[data-kind="lec"]')) h+=`<div class="st-help" data-kind="lec">${lecChunkHTML(it,0)}</div>`;
    h+=`<div class="st-tools">${googleA(it)}</div>`;
    const v=noteOf(it.key);
    h+=`<div class="st-note"><label>✍ Объясни себе как 5-летнему — одна строка ${S.nx[it.key]?'':'<span class="st-xpb">+15 ⭐</span>'}</label><textarea data-note="${it.key}" placeholder="Например: «Caption — надпись на кнопке, а Text — то, что печатают в Edit»">${esc(v)}</textarea></div>`;
  }
  const auto=!stay||C.ctx==='light'||C.ctx==='exam';
  const ms=C.ctx==='light'?(ok?700:1800):C.ctx==='exam'?(ok?700:1600):(it.q&&it.q.e||info.typed!=null||fast?2600:1300);
  h+=`<div class="st-nav"><span class="st-cloud">${auto?'нажми на карточку, чтобы задержаться':''}</span><button class="btn pri" data-a="next">Дальше → <kbd>Enter</kbd></button></div>${auto?`<div class="st-auto" style="--d:${ms}ms"><i></i></div>`:''}`;
  after.innerHTML=h; bindNotes(after);
  if(auto) C.auto=setTimeout(next,ms);
  if(ok&&help===0&&C.ctx!=='exam') maybeChest();
}
function holdAuto(){ const C=SESS&&SESS.cur; if(C&&C.auto){ clearTimeout(C.auto); C.auto=null; const a=SEC.querySelector('.st-auto'); if(a) a.remove(); const s=SEC.querySelector('.st-nav .st-cloud'); if(s) s.textContent=''; } }
function noteXP(C){ if(!C||!C.answered||C.noted) return; C.noted=true; const ta=SEC&&SEC.querySelector(`textarea[data-note="${C.it.key}"]`); if(!ta) return; const v=ta.value.trim().toLowerCase(); if(v.length<12||S.nx[C.it.key]) return;
  const ans=C.it.type==='test'?(plain(C.it.q.a[0])+' '+(C.it.q.e||'')).toLowerCase():'';
  if(ta.dataset.pasted||(ans&&ans.includes(v))){ toast('Скопированное не засчитываю — своими словами 😉'); return; }
  S.nx[C.it.key]=1; addXP(15); toast('✍ +15 ⭐ за заметку своими словами'); }
function bindNotes(root){ root.querySelectorAll('textarea[data-note]').forEach(ta=>{ ta.addEventListener('input',()=>setNote(ta.dataset.note,ta.value)); ta.addEventListener('paste',()=>{ ta.dataset.pasted='1'; }); ta.addEventListener('focus',holdAuto); }); }

/* ---------- опыт, сундуки, уровень ---------- */
function addXP(n){ if(!n) return; const L0=level(S.xp||0).L; S.xp=Math.max(0,(S.xp||0)+n); if(SESS) SESS.xp+=n; persist();
  const x=SEC&&SEC.querySelector('[data-xp]'); if(x){ x.textContent='⭐ +'+SESS.xp; const r=x.getBoundingClientRect(); const f=document.createElement('div'); f.className='st-float'; f.textContent=(n>0?'+':'')+n; f.style.left=r.left+'px'; f.style.top=(r.top+4)+'px'; if(n<0) f.style.color='var(--bad)'; document.body.appendChild(f); setTimeout(()=>f.remove(),1000); }
  const lv=level(S.xp); const bar=SEC&&SEC.querySelector('[data-lvbar]'); if(bar) bar.style.width=Math.round(lv.cur/lv.need*100)+'%';
  if(lv.L>L0&&SESS) SESS.queue.push(()=>over('🏆',`Уровень ${lv.L}!`,`Новый ранг: <b>${lv.rank}</b>. ${lv.L%3===0?'Бонус: ❄ заморозка серии.':''}`,'Дальше →',()=>{ if(lv.L%3===0) S.freeze=Math.min(3,(S.freeze||0)+1); persist(); next(); })); }
function maybeChest(){ SESS.since++; const p=.07+Math.min(SESS.combo,10)*.012; if(Math.random()<p||SESS.since>=12){ SESS.since=0; SESS.queue.push(chest); } }
function chest(){
  over('🎁','Сундук!','Случайная награда за правильные ответы подряд','Открыть',()=>{
    const r=Math.random(); let em,t,d;
    if(r<.45){ const n=20+Math.floor(Math.random()*41); addXP(n); em='⭐'; t=`+${n} опыта`; d='Неплохо!'; }
    else if(r<.7){ SESS.dbl+=5; em='✖2'; t='Двойной опыт'; d='на следующие 5 верных ответов'; }
    else if(r<.88&&(S.freeze||0)<3){ S.freeze=(S.freeze||0)+1; persist(); em='❄'; t='Заморозка серии'; d='пропустишь день — серия не сгорит'; }
    else { addXP(150); em='💎'; t='ДЖЕКПОТ +150'; d='Вот это удача!'; }
    over(em,t,d,'Забрать →',next);
  },true);
}
function over(em,title,txt,btn,fn,wob){ closeOver(); const o=document.createElement('div'); o.className='st-over';
  o.innerHTML=`<div><div class="em${wob?' wob':''}">${em}</div><h2>${title}</h2><p>${txt}</p><button class="btn pri" style="font-size:16px;padding:10px 26px">${btn} <kbd>Enter</kbd></button></div>`;
  o.querySelector('button').onclick=()=>{ closeOver(); fn(); }; document.body.appendChild(o); OVER=o; setTimeout(()=>o.querySelector('button').focus({preventScroll:true}),50); }
function closeOver(){ if(OVER){ OVER.remove(); OVER=null; } }

/* ---------- молния и босс ---------- */
function lightIntro(){ over('⚡','Молния!','5 вопросов «верно или нет», по 10 секунд на каждый. Все 5 верно — +40 ⭐','Погнали',next); }
function startBoss(){
  const errs=SESS.errs.filter(x=>x.type==='test').slice(-5);
  if(!errs.length||SESS.exam){ if(!SESS.exam) addXP(30); return roundEnd(); }
  SESS.boss={q:shuffle(errs),max:errs.length,retry:new Set(),lost:0};
  over('👾','Босс раунда!',`Баг-монстр собран из твоих ошибок за раунд: ${errs.length} ❤. Ответь на каждый правильно — и он повержен (+50 ⭐).`,'В бой',next,true);
}
function bossNext(){ const B=SESS.boss; if(B.q.length) return card(B.q[0],B.retry.has(B.q[0].key)?'mcq':chooseFmt(B.q[0])==='type'?'type':'mcq','boss');
  const win=!B.lost; SESS.boss=null; SESS.bossWin=win; if(win) addXP(50); roundEnd(); }

/* ---------- конец раунда и перерыв ---------- */
function roundEnd(quit){
  const R=SESS; stopTick(); closeOver();
  if(R.cur){ clearTimeout(R.cur.auto); clearInterval(R.cur.lt); noteXP(R.cur); }
  const counted=R.log.length>=3;
  if(counted){ S.rounds++; S.rd=S.rd||{}; S.rd[today()]=(S.rd[today()]||0)+1; persist(); }
  const n=R.log.filter(x=>x.ctx!=='boss'&&x.ctx!=='light').length, ok=R.ok, bad=R.bad;
  const ready=Math.round(examReady()*100), d=ready-Math.round(R.ready0*100);
  const lv=level(S.xp||0);
  const examRes=R.exam?Math.round(R.log.filter(x=>x.ok&&!x.help).length/Math.max(1,R.log.length)*100):null;
  const head=R.exam?(examRes>=85?['🏆','Контрольная: '+examRes+'%','Отличный результат — на экзамене так же!']:examRes>=60?['💪','Контрольная: '+examRes+'%','Хорошо. Ошибки вернутся в следующих раундах.']:['🧱','Контрольная: '+examRes+'%','Нормально для начала — каждый раунд закрывает дыры.'])
    :quit&&!counted?['👋','Раунд прерван','Ничего страшного — продолжим, когда захочешь.']
    :R.bossWin===true?['🏆','Раунд '+R.n+' пройден! Босс повержен','Все ошибки раунда исправлены.']
    :R.bossWin===false?['🛡','Раунд '+R.n+' пройден','Босс ушёл, но его вопросы вернутся завтра.']
    :['🌟','Раунд '+R.n+' — без ошибок!','Босса нет: ты чистый. +30 ⭐'];
  const recall=R.log.filter(x=>x.it.type==='test'&&x.ok).slice(-1)[0];
  const teaseQ=buildQueue(1)[0];
  SESSEND={teaseQ};
  SEC.innerHTML=`<div class="read st-wrap"><div class="st-big"><div class="em">${head[0]}</div><h1>${head[1]}</h1><p>${head[2]}</p></div>
    <div class="st-stats"><div><b>${ok}</b><span>сам и верно</span></div><div><b>${bad}</b><span>ошибок</span></div><div><b>🔥${R.best}</b><span>лучшее комбо</span></div><div><b>+${R.xp}</b><span>⭐ опыта</span></div></div>
    <p style="text-align:center">Готовность к экзамену: <b>${ready}%</b>${d>0?` <span style="color:var(--ok)">(+${d}%)</span>`:''} · ур. ${lv.L} ${lv.rank} · 🔥 ${streak()} дн.</p>
    ${counted&&!quit?`<div class="st-brk"><div class="eyebrow">☕ Перерыв</div><div class="t" data-timer>${fmtLeft(S.set.rest*60000)}</div>
      <p>Встань, пройдись, попей воды. Телефон не трогай — мозг сейчас раскладывает выученное по полкам.</p>
      ${recall?`<p class="st-cloud">По желанию: вспомни без подглядывания ответ на «${esc(String(recall.it.q.q).replace(/```[\s\S]*?```/g,'…').slice(0,100))}…»</p>`:''}</div>`:''}
    ${teaseQ&&teaseQ.type==='test'?`<p class="st-tease">Следующий вопрос уже ждёт: <span>${esc(String(teaseQ.q.q).replace(/```[\s\S]*?```/g,'…').slice(0,70))}</span></p>`:''}
    <div class="st-nav"><button class="btn" data-a="home">Хватит на сегодня</button><button class="btn pri" data-a="go">▶ ${counted&&!quit?'Следующий раунд':'Продолжить'}</button></div></div>`;
  SESS=null;
  SEC.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.a==='go'){ document.title=TITLE0||document.title; startRound(); } else if(b.dataset.a==='home') home(); };
  if(counted&&!quit){ phase='rest'; T0=now(); PLEN=S.set.rest*60000; startTick(); }
  scrollTop();
}
let SESSEND=null;

/* ---------- таймер ---------- */
function startTick(){ stopTick(); TIMER=setInterval(tick,500); }
function stopTick(){ clearInterval(TIMER); TIMER=null; }
const left=()=>Math.max(0,PLEN-(now()-T0));
const fmtLeft=l=>Math.floor(l/60000)+':'+String(Math.floor(l/1000)%60).padStart(2,'0');
function timerText(){ if(!SESS) return ''; if(SESS.exam) return '🎓 '+SESS.qi+'/'+SESS.q.length; if(SESS.boss) return '👾 босс'; if(SESS.timeUp) return '⏰ последний'; return '⏱ '+fmtLeft(left()); }
function tick(){
  const el=SEC&&SEC.querySelector('[data-timer]');
  if(phase==='work'&&SESS){ if(!SESS.exam&&!SESS.timeUp&&left()<=0){ SESS.timeUp=true; if(el) el.classList.add('up'); } if(el) el.textContent=timerText(); return; }
  if(phase==='rest'){ if(el) el.textContent=fmtLeft(left());
    if(left()<=0){ phase='idle'; stopTick(); if(el) el.textContent='✅ Пора!'; const g=SEC.querySelector('[data-a="go"]'); if(g) g.classList.add('st-go2');
      if(!TITLE0) TITLE0=document.title; let k=0; clearInterval(FLASH); const fl=FLASH=setInterval(()=>{ document.title=k++%2?'⏰ Перерыв окончен!':TITLE0; if(k>12||SESS){ clearInterval(fl); document.title=TITLE0; } },1000); } }
}

/* ---------- клики и клавиши в карточке ---------- */
function onCardClick(e){
  if(!SESS) return; const b=e.target.closest('button,a');
  if(!b){ if(e.target.closest('.st-card')) holdAuto(); return; }
  const C=SESS.cur;
  if(b.dataset.a==='quit'){ roundEnd(true); return; }
  if(b.dataset.a==='next'){ next(); return; }
  if(b.dataset.a==='help'){ useHelp(); return; }
  if(b.dataset.a==='check'){ checkType(); return; }
  if(b.dataset.a==='bet'){ if(C.answered) return; C.bet=!C.bet; b.classList.toggle('on',C.bet); return; }
  if(b.dataset.a==='morelec'){ const box=b.closest('.st-help'); C.chunkIdx++; box.innerHTML=lecChunkHTML(C.it,C.chunkIdx); holdAuto(); return; }
  if(b.dataset.a==='openlec'){ const t=C.it.topic; const btn=document.querySelector(`.tabs [data-t="${t}"]`); holdAuto(); if(btn){ btn.click(); setTimeout(()=>{ const d=document.getElementById(t+'-lecture'); if(d){ d.open=true; d.scrollIntoView({behavior:'smooth'}); } },120); } return; }
  if(b.dataset.o!=null){ if(C.answered) return; const i=+b.dataset.o; answer(C.opts[i].ok,{picked:i}); return; }
  if(b.dataset.tf!=null){ if(C.answered) return; const v=b.dataset.tf==='1'; answer(v===C.tfTrue,{tf:v}); return; }
  if(b.dataset.lab){ if(b.dataset.lab==='self') answer(true,{}); else answer(false,{}); return; }
  if(b.closest('.st-help,.st-tools')) holdAuto();
}
function keys(e){
  if(!SEC||SEC.hidden) return;
  if(OVER){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); OVER.querySelector('button').click(); } return; }
  if(e.target.closest('input,textarea,select,.cppw,.vclw')) return;
  if(!SESS){ if(e.key==='Enter'){ const g=SEC.querySelector('[data-a="go"]'); if(g&&(SEC.querySelector('.st-big')||document.activeElement===document.body)){ e.preventDefault(); g.click(); } } return; }
  const C=SESS.cur; if(!C) return;
  if(!C.answered){
    if(C.fm==='tf'){ if(e.key==='1'||e.key==='ArrowLeft'){ e.preventDefault(); SEC.querySelector('[data-tf="1"]').click(); } else if(e.key==='2'||e.key==='ArrowRight'){ e.preventDefault(); SEC.querySelector('[data-tf="0"]').click(); } }
    else if(/^[1-9]$/.test(e.key)&&C.opts){ const b=SEC.querySelector(`[data-o="${+e.key-1}"]`); if(b&&!b.disabled){ e.preventDefault(); b.click(); } }
    if(e.key==='h'||e.key==='р'){ useHelp(); }
    return; }
  if(e.key==='Enter'){ e.preventDefault(); next(); }
}

/* ---------- Мой конспект ---------- */
function konspekt(){
  stopTick(); const db=build(); const q=s=>String(s).replace(/```[\s\S]*?```/g,'[код]');
  let h=`<div class="read st-wrap st-kon"><div class="st-nav" style="margin-top:14px"><button class="btn" data-a="home">← Назад</button><button class="btn" data-a="export">⬇ Скачать (.txt)</button></div>
    <div class="topic-head"><div class="eyebrow">всё, что ты объяснил своими словами</div><h1>📝 Мой конспект</h1></div>
    <p>Перед экзаменом читай это, а не лекции. Заметки можно править прямо здесь.</p>
    <input class="st-search" placeholder="Поиск по заметкам…" style="width:100%;font:15px var(--f-body);padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)">`;
  let any=false;
  for(const t of TOPIC_IDS){ const T=db.topics[t]; if(!T) continue; const its=T.items.filter(it=>noteOf(it.key)); if(!its.length) continue; any=true;
    h+=`<h3>Тема ${T.n}. ${esc(T.title)}</h3>`;
    for(const it of its) h+=`<div class="it"><div class="q">${it.type==='test'?esc(q(it.q.q)).slice(0,400):'💻 '+esc(it.t.name)}</div>${it.type==='test'?`<div class="a">✔ ${esc(it.q.a[0])}</div>`:''}<textarea data-note="${it.key}">${esc(noteOf(it.key))}</textarea></div>`; }
  if(!any) h+=`<p><i>Пока пусто. Заметки появляются, когда после ошибки пишешь строчку «как 5-летнему».</i></p>`;
  h+='</div>'; SEC.innerHTML=h; bindNotes(SEC); scrollTop();
  SEC.querySelector('.st-search').addEventListener('input',e=>{ const v=e.target.value.toLowerCase(); SEC.querySelectorAll('.it').forEach(x=>{ x.hidden=v&&!x.textContent.toLowerCase().includes(v)&&!x.querySelector('textarea').value.toLowerCase().includes(v); }); });
  SEC.onclick=async e=>{ const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.a==='home'){ home(); return; }
    if(b.dataset.a==='export'){ const txt=exportText(); const name='Мой конспект C++.txt';
      try{ const dl=G.claude&&G.claude.use?await G.claude.use('downloads'):null; if(dl){ await dl.save({filename:name,data:txt}); return; } }catch(err){ if(err&&err.code&&err.code!=='unavailable') return; }
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500); } };
}
function exportText(){ const db=build(); const L=['МОЙ КОНСПЕКТ ПО C++',''];
  for(const t of TOPIC_IDS){ const T=db.topics[t]; if(!T) continue; const its=T.items.filter(it=>noteOf(it.key)); if(!its.length) continue;
    L.push('=== Тема '+T.n+'. '+T.title+' ===');
    for(const it of its){ if(it.type==='test') L.push('Вопрос: '+String(it.q.q).replace(/```[\s\S]*?```/g,'[код]'),'Ответ: '+it.q.a[0]); else L.push('Лаба: '+it.t.name); L.push('Моя заметка: '+noteOf(it.key),''); } }
  return L.join('\n'); }

/* ---------- вход ---------- */
function init(sec){
  SEC=sec; css(); if(!TITLE0) TITLE0=document.title;
  if(!S){ loadLocal(); Cloud.init(); }
  if(!sec.dataset.ready){ sec.dataset.ready='1'; document.addEventListener('keydown',keys); sec.addEventListener('change',onHomeChange); }
  if(!SESS&&phase!=='rest') home();
}
CPP.initStudy=function(sec){ if(sec&&sec.id==='c17') init(sec); };
CPP.STUDY_TEST={build,buildQueue,grade,examReady,level,chooseFmt,typable,state:()=>S,sess:()=>SESS};
})(typeof window!=='undefined'?window:globalThis);
