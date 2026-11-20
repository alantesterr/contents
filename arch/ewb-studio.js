/* EWB-студия: свободная сборка схем как в Electronics Workbench 5.12.
   Подключается ПОСЛЕ главного скрипта: использует ewbGeom/ewbDraw/ewbEval, parseExpr, minimize, ewbFromExpr, saveFile, toast, esc.
   Модель: детали {id,type,x,y,rot,p,st,out}, провода {f:'id.pin',t:'id.pin',xm?,ym?,via?}. Провода не направлены: цепь (net) = все
   выводы, соединённые проводами; значение цепи даёт выход-источник. */
(function(){
'use strict';
const W=window, A=W.ARCH=W.ARCH||{};

/* ---------------- новые детали (микросхемы рисуются прямоугольником с подписями выводов) ---------------- */
const CH={
  rs:{t:'RS Flip-Flop',L:['S','R'],R:['Q','Qn'],w:70,tag:'RS'},
  t:{t:'T Flip-Flop',L:['T','C'],R:['Q','Qn'],w:70,tag:'T',clk:'C'},
  mux2:{t:'MUX 2→1',L:['D0','D1'],B:['S'],R:['Y'],w:64,tag:'MUX'},
  mux4:{t:'MUX 4→1',L:['D0','D1','D2','D3'],B:['S1','S0'],R:['Y'],w:70,tag:'MUX'},
  mux8:{t:'MUX 8→1',L:['D0','D1','D2','D3','D4','D5','D6','D7'],B:['S2','S1','S0'],R:['Y'],w:76,tag:'MUX'},
  demux4:{t:'DEMUX 1→4',L:['D'],B:['S1','S0'],R:['Y0','Y1','Y2','Y3'],w:70,tag:'DMX'},
  dec24:{t:'Decoder 2→4',L:['A1','A0','E'],R:['Y0','Y1','Y2','Y3'],w:70,tag:'DC',def:{E:1}},
  dec38:{t:'Decoder 3→8',L:['A2','A1','A0','E'],R:['Y0','Y1','Y2','Y3','Y4','Y5','Y6','Y7'],w:76,tag:'DC',def:{E:1}},
  enc42:{t:'Encoder 4→2',L:['I0','I1','I2','I3'],R:['A1','A0','V'],w:70,tag:'CD'},
  enc83:{t:'Priority Encoder 8→3',L:['I0','I1','I2','I3','I4','I5','I6','I7'],R:['A2','A1','A0','V'],w:76,tag:'CD*'},
  add4:{t:'4-bit Adder (7483)',L:['A3','A2','A1','A0','B3','B2','B1','B0','Ci'],R:['S3','S2','S1','S0','Co'],w:80,tag:'Σ4'},
  cnt4:{t:'4-bit Counter (163)',L:['C','EN','CLR'],R:['Q3','Q2','Q1','Q0','RCO'],w:80,tag:'CT2',clk:'C',def:{EN:1,CLR:1},low:['CLR']},
  cnt10:{t:'Decade Counter (160)',L:['C','EN','CLR'],R:['Q3','Q2','Q1','Q0','RCO'],w:80,tag:'CT10',clk:'C',def:{EN:1,CLR:1},low:['CLR']},
  reg4:{t:'4-bit Register',L:['D3','D2','D1','D0','C'],R:['Q3','Q2','Q1','Q0'],w:80,tag:'RG',clk:'C'},
  cmp1:{t:'Comparator 1-bit',L:['A','B'],R:['GT','EQ','LT'],w:70,tag:'=='}
};
const SP={ // особые детали
  seg7:{t:'Seven-Segment Display'}, txt:{t:'Text (надпись)'}, conn:{t:'Connector (узел)'}
};
const NAME=Object.assign({},typeof EWB_NAME!=='undefined'?EWB_NAME:{},{gate:'Logic gate',conn:'Connector (узел)'}); Object.keys(CH).forEach(k=>NAME[k]=CH[k].t); Object.keys(SP).forEach(k=>NAME[k]=SP[k].t);
const GATE_RU={and:'AND (И)',or:'OR (ИЛИ)',not:'NOT (НЕ)',nand:'NAND (И-НЕ)',nor:'NOR (ИЛИ-НЕ)',xor:'XOR (искл. ИЛИ)',xnor:'XNOR (искл. ИЛИ-НЕ)',buf:'Buffer (повторитель)'};

function chipGeom(c){ const d=CH[c.type], L=d.L, R=d.R, B=d.B||[]; const rows=Math.max(L.length,R.length);
  const hb=rows*16+12, h=hb+(B.length?12:0), w=d.w||76, pins={};
  L.forEach((n,i)=>pins[n]=[0,14+i*16,'in']); R.forEach((n,i)=>pins[n]=[w,14+i*16,'out']);
  B.forEach((n,i)=>pins[n]=[Math.round(w/(B.length+1)*(i+1)),h,'in']); return {w,h,pins,hb}; }
function geom(c){
  if(CH[c.type]) return chipGeom(c);
  if(c.type==='seg7'){ const pins={}; 'abcdefg'.split('').forEach((k,i)=>pins[k]=[6+i*8,74,'in']); return {w:62,h:74,pins}; }
  if(c.type==='txt'){ const t=String((c.p&&c.p.text)||'Текст'); return {w:Math.max(30,t.length*6.4),h:16,pins:{}}; }
  if(c.type==='conn') return {w:8,h:8,pins:{n:[4,4,'io']}};
  const g=ewbGeom(c); if(c.type==='la'){ g.pins=Object.assign({},g.pins); } return g; }
const T=(x,y,s,o='')=>`<text x="${x}" y="${y}"${o}>${s}</text>`, L_=(a,b,c,d)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="ld"/>`;
function chipDraw(c){ const d=CH[c.type], g=chipGeom(c), p=c.p||{}; let s='';
  s+=`<rect class="bd" x="12" y="2" width="${g.w-24}" height="${g.hb-4}"/>`;
  Object.entries(g.pins).forEach(([n,[x,y,dir]])=>{ const low=(d.low||[]).includes(n); const nm=n==='Qn'?"Q'":n;
    if(x===0){ const clk=d.clk===n; const bub=low||(clk&&p.edge==='fall'); s+=L_(0,y,bub?6:12,y)+(bub?`<circle class="bd" cx="9" cy="${y}" r="3"/>`:'');
      if(clk) s+=`<path class="ln" d="M12,${y-5} L19,${y} L12,${y+5}"/>`+T(22,y+3.5,n==='C'?'':nm,' class="pn"'); else s+=T(15,y+3.5,nm,' class="pn"'); }
    else if(x===g.w){ s+=L_(g.w-12,y,g.w,y)+T(g.w-15,y+3.5,nm,' class="pn" text-anchor="end"'); }
    else { s+=L_(x,g.hb-2,x,g.h)+T(x,g.hb-5,nm,' class="sm" text-anchor="middle"'); } });
  s+=T(g.w/2,(g.hb)/2+4,d.tag,' class="sm" text-anchor="middle" style="font-weight:700;font-size:10px;fill:#444"');
  if(c.view&&c.view.bad) s+=T(g.w/2,g.hb+12,'запрет!',' class="sm" text-anchor="middle" style="fill:#c00;font-weight:700"');
  return s; }
const SEGS={a:'M14,8 h26',b:'M42,10 v22',c:'M42,38 v22',d:'M14,62 h26',e:'M12,38 v22',f:'M12,10 v22',g:'M14,35 h26'};
function draw(c){ const p=c.p||{}, g=geom(c); const lbl=p.label?T(g.w/2,-5,esc(p.label),' class="lb" text-anchor="middle"'):'';
  if(CH[c.type]) return lbl+chipDraw(c);
  if(c.type==='seg7'){ const v=c.view||{}; let s=`<rect x="2" y="0" width="52" height="68" fill="#222" stroke="#000"/>`;
    Object.entries(SEGS).forEach(([k,d])=>s+=`<path d="${d}" stroke="${v[k]?'#ff3030':'#4a1010'}" stroke-width="5" stroke-linecap="round" fill="none"/>`);
    'abcdefg'.split('').forEach((k,i)=>s+=L_(6+i*8,68,6+i*8,74)+T(6+i*8,66,k,' style="font-size:6px;fill:#bbb" text-anchor="middle"')); return lbl+s; }
  if(c.type==='txt') return T(0,12,esc(p.text||'Текст'),` style="font-size:12px;fill:${p.col||'#1a1a8a'}"`);
  if(c.type==='lamp'&&p.col&&p.col!=='red'){ const col={green:'#19c519',blue:'#2a6bff',yellow:'#ffd000'}[p.col]||'#ff2a2a'; const on=c.view&&c.view.on;
    return lbl+L_(0,12,12,12)+(on?`<circle cx="20" cy="12" r="13" fill="${col}" opacity=".25"/>`:'')+`<circle class="bd" cx="20" cy="12" r="8" style="fill:${on?col:'#fff'}"/>`; }
  return ewbDraw(c,c.view); }
function evalPart(c,get){ const p=c.p||{}, st=c.st;
  const edge=(pin)=>{ const C=get(pin), fall=p.edge==='fall'; const k='pc_'+pin; const e=st[k]!==undefined&&st[k]!==C&&(fall?C===0:C===1); st[k]=C; return e; };
  const pre=(n)=>{ const cur=get(n), k='pv_'+n, v=st[k]===undefined?cur:st[k]; st[k]=cur; return v; }; // значение входа ДО фронта
  const num=(names)=>names.reduce((s,n)=>s*2+(get(n)?1:0),0);
  switch(c.type){
    case 'rs':{ const S=get('S'),R=get('R'); c.view={bad:S&&R}; if(S&&!R) st.q=1; else if(R&&!S) st.q=0; if(S&&R) return {Q:0,Qn:0}; return {Q:st.q||0,Qn:1-(st.q||0)}; }
    case 't':{ const tv=pre('T'); if(edge('C')&&tv) st.q=1-(st.q||0); return {Q:st.q||0,Qn:1-(st.q||0)}; }
    case 'mux2': return {Y:get(get('S')?'D1':'D0')};
    case 'mux4': return {Y:get('D'+num(['S1','S0']))};
    case 'mux8': return {Y:get('D'+num(['S2','S1','S0']))};
    case 'demux4':{ const i=num(['S1','S0']), d=get('D'), o={}; for(let k=0;k<4;k++) o['Y'+k]=(k===i&&d)?1:0; return o; }
    case 'dec24': case 'dec38':{ const n=c.type==='dec24'?['A1','A0']:['A2','A1','A0'], i=num(n), e=get('E'), o={}; for(let k=0;k<(1<<n.length);k++) o['Y'+k]=(k===i&&e)?1:0; return o; }
    case 'enc42':{ const I=[0,1,2,3].map(k=>get('I'+k)); return {A1:I[2]|I[3],A0:I[1]|I[3],V:(I[0]|I[1]|I[2]|I[3])}; }
    case 'enc83':{ let hi=-1; for(let k=7;k>=0;k--) if(get('I'+k)){ hi=k; break; } const v=Math.max(hi,0); return {A2:(v>>2)&1,A1:(v>>1)&1,A0:v&1,V:hi>=0?1:0}; }
    case 'add4':{ const a=num(['A3','A2','A1','A0']), b=num(['B3','B2','B1','B0']), s=a+b+get('Ci'); return {S3:(s>>3)&1,S2:(s>>2)&1,S1:(s>>1)&1,S0:s&1,Co:(s>>4)&1}; }
    case 'cnt4': case 'cnt10':{ const M=c.type==='cnt4'?16:10; st.q=st.q||0; if(edge('C')&&get('EN')) st.q=(st.q+1)%M; if(get('CLR')===0) st.q=0; const q=st.q;
      return {Q3:(q>>3)&1,Q2:(q>>2)&1,Q1:(q>>1)&1,Q0:q&1,RCO:(q===M-1&&get('EN'))?1:0}; }
    case 'reg4':{ const dv=['D3','D2','D1','D0'].reduce((s,n)=>s*2+(pre(n)?1:0),0); if(edge('C')) st.q=dv; const q=st.q||0; return {Q3:(q>>3)&1,Q2:(q>>2)&1,Q1:(q>>1)&1,Q0:q&1}; }
    case 'cmp1':{ const a=get('A'),b=get('B'); return {GT:a&&!b?1:0,EQ:a===b?1:0,LT:!a&&b?1:0}; }
    case 'seg7':{ const v={}; 'abcdefg'.split('').forEach(k=>v[k]=get(k)); c.view=v; return {}; }
    case 'txt': case 'conn': return {};
  }
  return ewbEval(c,get); }
const isClocked=c=>['jk','d','t','cnt4','cnt10','reg4'].includes(c.type);

/* ---------------- панели деталей (как «Parts Bin» в EWB) ---------------- */
const g2=k=>({type:'gate',p:{k,n:2}});
const BINS=[
  {k:'sources',t:'Sources',items:[{type:'gnd'},{type:'vcc'},{type:'clk',p:{f:'1 Hz',fv:1}}]},
  {k:'basic',t:'Basic',items:[{type:'sw',p:{key:'A',label:'A'}},{type:'conn'},{type:'txt',p:{text:'Текст'}}]},
  {k:'ind',t:'Indicators',items:[{type:'lamp',p:{}},{type:'lamp',p:{col:'green'}},{type:'hex',p:{}},{type:'seg7',p:{}}]},
  {k:'gates',t:'Logic Gates',items:['and','or','not','nand','nor','xor','xnor','buf'].map(k=>k==='not'||k==='buf'?{type:'gate',p:{k}}:g2(k))},
  {k:'digital',t:'Digital',items:[{type:'ha'},{type:'fa'},{type:'add4'},{type:'rs'},{type:'d',p:{edge:'rise'}},{type:'d',p:{edge:'rise',async:1}},{type:'jk',p:{edge:'fall'}},{type:'jk',p:{edge:'fall',async:1}},{type:'t',p:{edge:'rise'}},{type:'cnt4'},{type:'cnt10'},{type:'reg4'}]},
  {k:'coders',t:'Mux / Coders',items:[{type:'mux2'},{type:'mux4'},{type:'mux8'},{type:'demux4'},{type:'dec24'},{type:'dec38'},{type:'enc42'},{type:'enc83'},{type:'cmp1'}]},
  {k:'inst',t:'Instruments',items:[{type:'lc'},{type:'wg',p:{n:8,words:[0,1,2,3,4,5,6,7]}},{type:'la'}]}];
const BIN_ICON={}; (typeof EWB_BINS!=='undefined'?EWB_BINS:[]).forEach(b=>BIN_ICON[b.k]=b.i);
BIN_ICON.coders='<svg viewBox="0 0 26 18"><rect x="6" y="1" width="14" height="16" fill="#fff" stroke="#000"/><text x="8.5" y="12" style="font:bold 7px Arial">DC</text><path d="M0 5h6M0 13h6M20 4h6M20 9h6M20 14h6" stroke="#000"/></svg>';
function itemName(it){ if(it.type==='gate') return GATE_RU[it.p.k]; if(it.type==='lamp') return 'Probe'+(it.p&&it.p.col==='green'?' (зелёный)':' (красный)');
  if(it.type==='d'||it.type==='jk') return NAME[it.type]+(it.p&&it.p.async?' + PR/CLR':''); return NAME[it.type]||it.type; }

/* ---------------- маршрутизация проводов ---------------- */
const snap=v=>Math.round(v/5)*5;
function rot(x,y,cx,cy,r){ for(let i=0;i<r;i++){ const dx=x-cx, dy=y-cy; x=cx-dy; y=cy+dx; } return [x,y]; }
function pinInfo(c,pin){ const g=geom(c); const q=g.pins[pin]||g.pins[pin==='i'?'n':pin]; if(!q) return null; const r=(c.rot||0)%4;
  let [x,y]=q; let d=x<=0?[-1,0]:x>=g.w?[1,0]:y<=0?[0,-1]:y>=g.h?[0,1]:[0,0]; if(c.type==='conn') d=[0,0];
  [x,y]=rot(x,y,g.w/2,g.h/2,r); let [dx,dy]=d; for(let i=0;i<r;i++){ [dx,dy]=[-dy,dx]; }
  const ins=Object.keys(g.pins).filter(n=>g.pins[n][2]==='in'); const k=Math.max(0,ins.indexOf(pin));
  return {x:c.x+x,y:c.y+y,d:[dx,dy],dir:q[2],k}; }
function route(a,b,w){
  if(w.via&&w.via.length) return [[a.x,a.y],...w.via,[b.x,b.y]];
  const S=10, p1=[a.x+a.d[0]*S,a.y+a.d[1]*S], p2=[b.x+b.d[0]*S,b.y+b.d[1]*S];
  const h1=a.d[1]===0, h2=b.d[1]===0; let mid;
  if(w.xm!=null) mid=[[w.xm,p1[1]],[w.xm,p2[1]]];
  else if(w.ym!=null) mid=[[p1[0],w.ym],[p2[0],w.ym]];
  else if(h1&&h2){ const k=b.k||0; const xm=p2[0]>p1[0]+8+k*6? p2[0]-k*6 : snap((p1[0]+p2[0])/2); mid=[[xm,p1[1]],[xm,p2[1]]]; }
  else if(!h1&&!h2){ const ym=snap((p1[1]+p2[1])/2); mid=[[p1[0],ym],[p2[0],ym]]; }
  else if(h1) mid=[[p2[0],p1[1]]]; else mid=[[p1[0],p2[1]]];
  const pts=[[a.x,a.y],p1,...mid,p2,[b.x,b.y]], out=[];
  pts.forEach(p=>{ const l=out[out.length-1]; if(l&&l[0]===p[0]&&l[1]===p[1]) return; const l2=out[out.length-2];
    if(l&&l2&&((l2[0]===l[0]&&l[0]===p[0])||(l2[1]===l[1]&&l[1]===p[1]))) out.pop(); out.push(p); });
  return out; }

/* ---------------- Квайн — Мак-Класки с безразличными наборами ---------------- */
function qm(n,ones,dcs){ const pc=x=>{let c=0;while(x){c+=x&1;x>>=1;}return c;};
  if(!ones.length) return {zero:true,terms:[]}; if(ones.length+dcs.length===(1<<n)) return {one:true,terms:[{v:0,m:(1<<n)-1}]};
  let cur=[...ones,...dcs].map(v=>({v,m:0})), primes=[], seen=new Set();
  while(cur.length){ const next=[], used=new Set(), keys=new Set();
    for(let i=0;i<cur.length;i++) for(let j=i+1;j<cur.length;j++){ const a=cur[i],b=cur[j]; if(a.m!==b.m) continue; const d=a.v^b.v; if(pc(d)!==1) continue;
      used.add(i); used.add(j); const nv={v:a.v&~d,m:a.m|d}, k=nv.v+'/'+nv.m; if(!keys.has(k)){ keys.add(k); next.push(nv); } }
    cur.forEach((x,i)=>{ if(!used.has(i)){ const k=x.v+'/'+x.m; if(!seen.has(k)){ seen.add(k); primes.push(x); } } }); cur=next; }
  const cov=(p,t)=>((t&~p.m)===p.v); let best=null; const lits=s=>s.reduce((a,p)=>a+n-pc(p.m),0);
  (function rec(rest,ch){ if(best&&ch.length>best.length) return; if(!rest.length){ if(!best||ch.length<best.length||(ch.length===best.length&&lits(ch)<lits(best))) best=ch.slice(); return; }
    for(const p of primes.filter(p=>cov(p,rest[0]))){ ch.push(p); rec(rest.filter(x=>!cov(p,x)),ch); ch.pop(); } })(ones.slice(),[]);
  return {terms:best}; }
const termStr=(t,names)=>{ const n=names.length, a=[]; for(let i=0;i<n;i++){ const b=1<<(n-1-i); if(t.m&b) continue; a.push((t.v&b)?names[i]:names[i]+"'"); } return a.join('')||'1'; };
const termExpr=(t,names)=>{ const n=names.length, a=[]; for(let i=0;i<n;i++){ const b=1<<(n-1-i); if(t.m&b) continue; a.push((t.v&b)?names[i]:'!'+names[i]); } return a.join('*')||'1'; };

/* ---------------- стили студии ---------------- */
const css=`
.ews{position:relative;outline:none}
.ews .ewbw{box-shadow:2px 2px 0 #404040}
.ews .e-menu{position:relative;user-select:none}
.ews .e-menu>span{cursor:default;border:1px solid transparent}
.ews .e-menu>span:hover,.ews .e-menu>span.open{border-color:#fff #808080 #808080 #fff}
.ews .mdrop{position:absolute;z-index:30;background:#d4d0c8;border:1px solid;border-color:#fff #404040 #404040 #fff;box-shadow:2px 2px 0 #00000055;min-width:220px;padding:2px 0}
.ews .mdrop div{padding:3px 22px 3px 22px;white-space:nowrap;cursor:default;display:flex;justify-content:space-between;gap:20px}
.ews .mdrop div:hover{background:#0a246a;color:#fff}
.ews .mdrop div.dis{color:#808080}.ews .mdrop div.dis:hover{background:none;color:#808080}
.ews .mdrop hr{border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:3px 2px}
.ews .mdrop .kb{color:inherit;opacity:.8;font-size:11px}
.ews .e-tools .tb{cursor:pointer}.ews .e-tools .tb:hover{border-color:#fff #808080 #808080 #fff}
.ews .e-tools .tb.on{border-color:#808080 #fff #fff #808080;background:#e8e6e0}
.ews .e-tools .pause{cursor:pointer}.ews .e-tools .pause.on{border-color:#808080 #fff #fff #808080;background:#fff3bf}
.ews .e-bins .binb{cursor:pointer}.ews .e-bins .binb.open{border-color:#808080 #fff #fff #808080;background:#e8e6e0}
.ews .pal{display:flex;flex-wrap:wrap;gap:3px;padding:4px;border-bottom:1px solid #808080;background:#c8c4bc}
.ews .pal[hidden]{display:none}
.ews .pit{display:flex;flex-direction:column;align-items:center;gap:1px;width:74px;padding:2px;border:1px solid;border-color:#fff #404040 #404040 #fff;background:#d4d0c8;cursor:grab;font-size:9.5px;text-align:center;line-height:1.1;touch-action:none}
.ews .pit.on{background:#fff3bf;border-color:#a67c00}
.ews .pit svg{width:62px;height:36px}
.ews .e-body{flex-wrap:nowrap}
.ews .e-canvas{position:relative;max-height:none;height:var(--ews-h,560px);touch-action:none;cursor:default}
.ews .e-canvas.placing{cursor:copy}
.ews .e-panels{flex:0 0 300px;max-height:var(--ews-h,560px);overflow:auto}
.ews svg.ewbsvg{max-width:none}
.ews .grid{fill:url(#ewsgrid)}
.ews .pin{fill:transparent;stroke:none;cursor:crosshair}
.ews .pin:hover,.ews.wiring .pin{fill:#1a5fd0;fill-opacity:.35}
.ews .pin.hot{fill:#e8000b;fill-opacity:.6}
.ews .wh{fill:none;stroke:transparent;stroke-width:9;cursor:pointer}
.ews .wire.sel{stroke:#1a5fd0;stroke-width:2.4}
.ews .wire.tmp{stroke:#1a5fd0;stroke-dasharray:5 3}
.ews .cmp{cursor:move}
.ews.run .cmp[data-t=sw]{cursor:pointer}
.ews .selbox{fill:none;stroke:#1a5fd0;stroke-dasharray:4 3;stroke-width:1.2}
.ews .band{fill:#1a5fd022;stroke:#1a5fd0;stroke-dasharray:3 2}
.ews .floating{fill:#ff9800}
.ews .e-win .e-wt{display:flex;align-items:center;gap:6px}.ews .e-win .e-wt span{flex:1}
.ews .e-win .e-wt i{font-style:normal;cursor:pointer;background:#d4d0c8;color:#000;border:1px solid;border-color:#fff #404040 #404040 #fff;font:700 9px Arial;padding:0 4px}
.ews .wbtn{font:11px Tahoma,Arial,sans-serif;background:#d4d0c8;border:1px solid;border-color:#fff #404040 #404040 #fff;padding:2px 6px;cursor:pointer;color:#000}
.ews .wbtn:active,.ews .wbtn.on{border-color:#404040 #fff #fff #404040}
.ews .wbtn:disabled{color:#808080}
.ews .lcg{display:grid;grid-template-columns:auto auto;gap:6px;align-items:start}
.ews .lcvars{display:flex;gap:2px;margin-bottom:4px;flex-wrap:wrap}
.ews .lcvars b{width:16px;text-align:center;border:1px solid #808080;background:#fff;cursor:pointer;font:700 11px Consolas,monospace}
.ews .lcvars b.on{background:#0a246a;color:#fff}
.ews .lct2{font:11px Consolas,monospace;background:#fff;border:1px inset #808080;max-height:230px;overflow:auto;padding:2px 4px}
.ews .lct2 div{display:flex;gap:4px}.ews .lct2 span{width:11px;text-align:center}
.ews .lct2 .o{color:#c00;font-weight:700;cursor:pointer;margin-left:6px;width:14px}
.ews .lct2 .rn{color:#888;width:22px;text-align:right}
.ews .lcb2{display:flex;flex-direction:column;gap:3px}
.ews .lcb2 .wbtn{text-align:left;font-size:10.5px}
.ews .lcin{width:100%;box-sizing:border-box;font:12px Consolas,monospace;border:1px inset #808080;padding:2px 4px;margin-top:4px;background:#fff;color:#000}
.ews .lcres{font:11.5px Consolas,monospace;background:#fff;border:1px inset #808080;padding:3px 5px;margin-top:4px;word-break:break-word;min-height:16px;color:#000}
.ews .wgw textarea{width:100%;box-sizing:border-box;height:62px;font:11px Consolas,monospace;resize:vertical;background:#fff;color:#000}
.ews .wgw .row{display:flex;gap:3px;flex-wrap:wrap;margin-top:4px;align-items:center}
.ews .wgw input[type=number]{width:52px;font:11px Tahoma;background:#fff;color:#000}
.ews .wgw .cur{font:11px Consolas,monospace;margin-top:4px}
.ews .lasvg2{display:block;background:#000}
.ews .lasvg2 text{fill:#ddd;font:9px Consolas,monospace}
.ews .dlg{position:absolute;inset:0;z-index:40;background:#0003;display:flex;align-items:flex-start;justify-content:center;padding-top:70px}
.ews .dlg>div{background:#d4d0c8;border:1px solid;border-color:#fff #404040 #404040 #fff;box-shadow:3px 3px 0 #0006;min-width:300px;max-width:min(520px,92%);font:12px Tahoma,Arial,sans-serif;color:#000}
.ews .dlg .dt{background:linear-gradient(90deg,#0a246a,#a6caf0);color:#fff;font-weight:700;padding:3px 6px;display:flex}
.ews .dlg .dt span{flex:1}
.ews .dlg .db{padding:10px;display:grid;gap:7px;max-height:60vh;overflow:auto}
.ews .dlg label{display:grid;grid-template-columns:130px 1fr;gap:6px;align-items:center}
.ews .dlg input,.ews .dlg select,.ews .dlg textarea{font:12px Tahoma,Arial;background:#fff;color:#000;border:1px inset #808080;padding:2px 3px}
.ews .dlg textarea{min-height:70px;font-family:Consolas,monospace}
.ews .dlg .df{display:flex;justify-content:flex-end;gap:6px;padding:0 10px 10px}
.ews .dlg .help{line-height:1.45;font-size:12.5px}
.ews .dlg .help b{color:#0a246a}
.ews .task{border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:10px 12px;margin-bottom:8px;color:var(--ink)}
.ews .task .tt{font:700 15px var(--f-body);margin-bottom:4px}
.ews .task .tx{font-size:14.5px;line-height:1.5}
.ews .task .tb2{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.ews .task .res{margin-top:8px;font-size:14px;border-radius:8px;padding:8px 10px}
.ews .task .res.ok{background:var(--ok-bg);color:var(--ok)}
.ews .task .res.bad{background:var(--bad-bg);color:var(--bad)}
.ews .task .res table{border-collapse:collapse;margin-top:6px;font:12.5px var(--f-mono,monospace);color:var(--ink)}
.ews .task .res td,.ews .task .res th{border:1px solid var(--line);padding:2px 6px;text-align:center}
.ews .task .res td.x{background:var(--bad-bg);color:var(--bad);font-weight:700}
.ewbt-list,.ewb-go{display:flex;flex-wrap:wrap;gap:6px}.ewb-go{margin:4px 0 16px}.ewbt-h{margin-top:22px}.ewbtab-intro{font-size:15px;line-height:1.5;margin:0 0 10px;max-width:900px}
.ews .ews-foot{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}
.ews .ews-foot .hint{font-size:12.5px;color:var(--muted)}
@media (max-width:760px){.ews .e-body{flex-wrap:wrap}.ews .e-panels{flex:1 1 100%;max-height:none}}
`;
function addCss(){ if(document.getElementById('ews-css')) return; const s=document.createElement('style'); s.id='ews-css'; s.textContent=css; document.head.appendChild(s); }

const ICON=Object.assign({},typeof EWB_ICONS!=='undefined'?EWB_ICONS:{},{
  cut:'<svg viewBox="0 0 24 24"><circle cx="7" cy="18" r="3" fill="none" stroke="#333" stroke-width="2"/><circle cx="17" cy="18" r="3" fill="none" stroke="#333" stroke-width="2"/><path d="M9 16L18 3M15 16L6 3" stroke="#333" stroke-width="2"/></svg>',
  paste:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="14" height="17" fill="#f4c542" stroke="#8a6d00"/><rect x="9" y="9" width="11" height="13" fill="#fff" stroke="#333"/><rect x="8" y="2" width="6" height="4" fill="#ccc" stroke="#333"/></svg>',
  undo:'<svg viewBox="0 0 24 24"><path d="M9 7H16a5 5 0 010 10H8" fill="none" stroke="#333" stroke-width="2.2"/><path d="M10 2L3 7l7 5z" fill="#333"/></svg>',
  del:'<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="#b00" stroke-width="3"/></svg>',
  wire:'<svg viewBox="0 0 24 24"><path d="M3 18h6V6h12" fill="none" stroke="#1a5fd0" stroke-width="2.4"/><circle cx="3" cy="18" r="2.5" fill="#000"/><circle cx="21" cy="6" r="2.5" fill="#000"/></svg>',
  prop:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" fill="#fff" stroke="#333"/><path d="M6 8h12M6 12h12M6 16h8" stroke="#333" stroke-width="1.6"/></svg>'});

/* ---------------- студия ---------------- */
let UID=0;
class Studio{
  constructor(el,opt={}){ addCss(); this.el=el; this.opt=opt; this.key=opt.storageKey||'ewbs:auto'; this.zoom=opt.zoom||1; this.uid=++UID;
    this.comps=[]; this.wires=[]; this.sel=new Set(); this.selW=-1; this.undoS=[]; this.redoS=[]; this.clip=null;
    this.power=false; this.paused=false; this.t=0; this.hist=[]; this.colorLv=true; this.file='Untitled.ewb'; this.panelsOpen={};
    this.build(); let loaded=false;
    if(opt.circuit){ this.loadCirc(opt.circuit); loaded=true; }
    else if(!opt.task){ try{ const s=localStorage.getItem(this.key); if(s){ this.loadCirc(JSON.parse(s),true); loaded=true; } }catch(_){} }
    if(opt.task) this.setTask(opt.task);
    else if(!loaded) this.loadCirc(DEMO());
  }
  /* ---------- DOM ---------- */
  build(){ const o=this.opt;
    this.el.classList.add('ews'); this.el.tabIndex=0; if(o.height) this.el.style.setProperty('--ews-h',o.height+'px');
    this.el.innerHTML=`${o.task?'<div class="task"></div>':''}<div class="ewbw">
      <div class="e-title"><svg viewBox="0 0 16 16" width="16" height="16"><rect x="1" y="3" width="14" height="10" fill="#d33"/><circle cx="5" cy="8" r="2" fill="#fff"/><circle cx="11" cy="8" r="2" fill="#36f"/></svg><span class="ftitle">Electronics Workbench</span><span class="grow"></span><i class="wb">_</i><i class="wb">□</i><i class="wb">×</i></div>
      <div class="e-menu">${['File','Edit','Circuit','Analysis','Window','Help'].map(m=>`<span data-menu="${m}">${m}</span>`).join('')}</div>
      <div class="e-tools">${[['new','Новая схема (Ctrl+N)'],['open','Открыть файл схемы'],['save','Сохранить в файл (Ctrl+S)'],['cut','Вырезать (Ctrl+X)'],['copy','Копировать (Ctrl+C)'],['paste','Вставить (Ctrl+V)'],['undo','Отменить (Ctrl+Z)'],['del','Удалить (Del)'],['rot','Повернуть на 90° (Ctrl+R / клавиша R при выделении)'],['wire','Цвет проводов: показывать 1 красным, 0 синим'],['prop','Свойства детали (двойной щелчок)'],['zout','Уменьшить'],['zin','Увеличить'],['help','Справка']].map(([k,t])=>`<span class="tb" data-tb="${k}" title="${t}" role="button" tabindex="-1">${ICON[k]||''}</span>`).join('')}<span class="grow"></span>
        <div class="e-power" title="Activate — включить моделирование (как O/I в EWB)"><button class="pw" data-a="power" aria-label="Питание"><span>O</span><span>I</span><i></i></button><span class="pause" data-a="pause" role="button" title="Pause (F9)">Pause</span></div></div>
      <div class="e-bins">${BINS.map(b=>`<span class="binb" data-bin="${b.k}" title="${b.t}">${BIN_ICON[b.k]||''}<span>${b.t}</span></span>`).join('')}</div>
      <div class="pal" hidden></div>
      <div class="e-doc"></div>
      <div class="e-body"><div class="e-canvas"></div><div class="e-panels"></div></div>
      <div class="e-status"></div></div>
      <div class="ews-foot"><span class="hint">Перетащи деталь из панели (или щёлкни деталь, потом место на поле) · провод — тяни от вывода к выводу · двойной щелчок — свойства · Del — удалить · питание O/I — моделирование, щелчок по переключателю или его клавиша — переключить.</span></div>
      <input type="file" accept=".ewbs,.json,application/json" hidden>`;
    const $=s=>this.el.querySelector(s);
    this.cv=$('.e-canvas'); this.pan=$('.e-panels'); this.stat=$('.e-status'); this.pal=$('.pal'); this.doc=$('.e-doc'); this.fin=$('input[type=file]'); this.ttl=$('.ftitle'); this.taskBox=$('.task');
    $('.e-menu').addEventListener('click',e=>{ const m=e.target.closest('[data-menu]'); if(m) this.openMenu(m); });
    $('.e-tools').addEventListener('click',e=>{ const b=e.target.closest('[data-tb]'); if(b) this.cmd(b.dataset.tb); const a=e.target.closest('[data-a]'); if(a) this.cmd(a.dataset.a); });
    $('.e-bins').addEventListener('click',e=>{ const b=e.target.closest('[data-bin]'); if(b) this.openBin(b.dataset.bin); });
    this.pal.addEventListener('pointerdown',e=>this.palDown(e));
    this.fin.addEventListener('change',async e=>{ const f=e.target.files[0]; if(!f) return; try{ const j=JSON.parse(await f.text()); this.snapshot(); this.loadCirc(j); this.file=f.name; this.render(); toast('Открыт файл '+f.name); }catch(err){ toast('Это не файл схемы (.ewbs)'); } e.target.value=''; });
    this.cv.addEventListener('pointerdown',e=>this.down(e));
    this.cv.addEventListener('dblclick',e=>{ const g=e.target.closest('[data-id]'); if(g) this.props(this.byId(g.dataset.id)); });
    this.cv.addEventListener('contextmenu',e=>{ const g=e.target.closest('[data-id]'); if(g){ e.preventDefault(); this.sel=new Set([g.dataset.id]); this.selW=-1; this.render(); this.props(this.byId(g.dataset.id)); } });
    this.el.addEventListener('keydown',e=>this.key_(e));
    this.pan.addEventListener('click',e=>this.panClick(e)); this.pan.addEventListener('input',e=>this.panInput(e)); this.pan.addEventListener('change',e=>this.panInput(e,true));
    document.addEventListener('pointerdown',e=>{ if(this.menu&&!e.target.closest('.mdrop')&&!e.target.closest('[data-menu]')) this.closeMenu(); });
    this.timer=setInterval(()=>this.loop(),25);
  }
  byId(id){ return this.comps.find(c=>c.id===id); }
  newId(type){ const base=(type==='gate'?'U':type==='sw'?'S':type==='lamp'?'L':type[0].toUpperCase()); let n=1; const ids=new Set(this.comps.map(c=>c.id)); while(ids.has(base+n)) n++; return base+n; }
  /* ---------- загрузка/сохранение ---------- */
  norm(c){ c=JSON.parse(JSON.stringify(c)); c.p=c.p||{}; c.st=Object.assign({q:0,v:0,word:0,idx:-1},c.st||{}); c.out=c.out||{}; c.rot=c.rot||0; if(c.type==='jk'||c.type==='d') c.p.pre=1;
    if(c.type==='wg'&&c.p.words&&!c.st.word&&c.st.idx<0) c.st.word=c.p.words[0]||0; if(c.type==='clk'&&!c.p.fv){ const m=String(c.p.f||'1').match(/[\d.]+/); c.p.fv=m?+m[0]:1; } return c; }
  loadCirc(j,quiet){ this.comps=(j.comps||[]).map(c=>this.norm(c)); this.wires=(j.wires||[]).map(w=>{ const x=Object.assign({},w); delete x._pts; delete x._lc; if(x.via===null) delete x.via; return x; });
    this.wires.forEach(w=>{ ['f','t'].forEach(k=>{ const [ci,p]=w[k].split('.'); const c=this.byId(ci); if(c&&c.type==='conn') w[k]=ci+'.n'; }); });
    this.file=j.file||this.file||'Untitled.ewb'; this.hist=[]; this.sel=new Set(); this.selW=-1; this.t=0; this.rebuild(); if(this.power) this.settle(); this.render(); if(!quiet) this.autosave(); }
  dump(){ return {file:this.file,comps:this.comps.map(c=>({id:c.id,type:c.type,x:c.x,y:c.y,rot:c.rot||undefined,p:c.p})),wires:this.wires.map(w=>{ const o={f:w.f,t:w.t}; if(w.xm!=null) o.xm=w.xm; if(w.ym!=null) o.ym=w.ym; if(w.via) o.via=w.via; return o; })}; }
  autosave(){ if(this.opt.noSave) return; clearTimeout(this.asT); this.asT=setTimeout(()=>{ try{ localStorage.setItem(this.key,JSON.stringify(this.dump())); }catch(_){} },400); }
  snapshot(){ this.undoS.push(JSON.stringify(this.dump())); if(this.undoS.length>80) this.undoS.shift(); this.redoS=[]; }
  undo(){ if(!this.undoS.length) return toast('Отменять нечего'); this.redoS.push(JSON.stringify(this.dump())); const st=this.keepState(); this.loadCirc(JSON.parse(this.undoS.pop())); this.restoreState(st); }
  redo(){ if(!this.redoS.length) return; this.undoS.push(JSON.stringify(this.dump())); const st=this.keepState(); this.loadCirc(JSON.parse(this.redoS.pop())); this.restoreState(st); }
  keepState(){ const m={}; this.comps.forEach(c=>m[c.id]={st:c.st,out:c.out}); return m; }
  restoreState(m){ this.comps.forEach(c=>{ if(m[c.id]){ c.st=m[c.id].st; c.out=m[c.id].out; } }); if(this.power) this.settle(); this.render(); }
  /* ---------- цепи ---------- */
  rebuild(){ const par={}; const f=k=>{ while(par[k]!==k){ par[k]=par[par[k]]; k=par[k]; } return k; };
    const add=k=>{ if(par[k]===undefined) par[k]=k; }; const uni=(a,b)=>{ add(a); add(b); const ra=f(a), rb=f(b); if(ra!==rb) par[ra]=rb; };
    this.comps.forEach(c=>{ const g=geom(c); Object.keys(g.pins).forEach(p=>add(c.id+'.'+p)); });
    this.wires=this.wires.filter(w=>{ const a=w.f.split('.'), b=w.t.split('.'); const ca=this.byId(a[0]), cb=this.byId(b[0]); return ca&&cb&&pinInfo(ca,a[1])&&pinInfo(cb,b[1]); });
    this.wires.forEach(w=>uni(w.f,w.t));
    const net={}, nets={}; Object.keys(par).forEach(k=>{ const r=f(k); net[k]=r; (nets[r]=nets[r]||{pins:[],drv:[]}).pins.push(k); });
    this.comps.forEach(c=>{ const g=geom(c); Object.entries(g.pins).forEach(([p,q])=>{ if(q[2]==='out'){ const r=net[c.id+'.'+p]; nets[r].drv.push([c,p]); } }); });
    this.net=net; this.nets=nets; this.forced={};
    this.comps.forEach(c=>{ c.in=new Proxy({},{get:(_,p)=>typeof p==="string"&&this.connected(c,p)?1:0}); }); }
  get(c,pin){ const k=c.id+'.'+pin, r=this.net[k]; const n=r&&this.nets[r];
    if(r&&this.forced[r]!==undefined) return this.forced[r];
    if(n&&n.drv.length){ let v=0; for(const [dc,dp] of n.drv){ if(dc.out[dp]) { v=1; break; } } return v; }
    const d=CH[c.type]; if(d&&d.def&&d.def[pin]!==undefined) return d.def[pin];
    if(pin==='PR'||pin==='CLR') return 1; return 0; }
  connected(c,pin){ const r=this.net[c.id+'.'+pin]; return !!(r&&this.nets[r]&&this.nets[r].pins.length>1); }
  settle(){ let ok=false; for(let it=0;it<200;it++){ let ch=false;
      for(const c of this.comps){ const o=evalPart(c,(pin)=>this.get(c,pin)); for(const k in o) if(c.out[k]!==o[k]){ c.out[k]=o[k]; ch=true; } }
      if(!ch){ ok=true; break; } }
    this.unstable=!ok; return ok; }
  netVal(k){ const r=this.net[k]; if(!r) return 0; if(this.forced[r]!==undefined) return this.forced[r]; const n=this.nets[r]; return n.drv.some(([c,p])=>c.out[p])?1:0; }
  /* ---------- время, такт, генератор слов ---------- */
  loop(){ if(!this.power||this.paused) return; const clks=this.comps.filter(c=>c.type==='clk'); const wgs=this.comps.filter(c=>c.type==='wg'&&c.st.run);
    if(!clks.length&&!wgs.length) return; const dt=25; this.t+=dt; let ch=false;
    clks.forEach(c=>{ const f=Math.max(0.05,Math.min(+c.p.fv||1,20)); const v=Math.floor(this.t/1000*f*2)%2; if(c.st.v!==v){ c.st.v=v; ch=true; } });
    wgs.forEach(c=>{ const f=Math.max(0.2,Math.min(+c.p.fv||2,20)); const k=Math.floor(this.t/1000*f); if(c.st.lastK!==k){ c.st.lastK=k; this.wgStep(c,true); ch=true; } });
    if(ch){ this.settle(); this.record(); this.render(true); } }
  wgStep(c,auto){ const w=c.p.words||[0]; c.st.idx=(c.st.idx+1)%w.length; c.st.word=w[c.st.idx]||0;
    if(auto&&c.st.run==='burst'&&c.st.idx===w.length-1) c.st.run=null; }
  record(){ const las=this.comps.filter(c=>c.type==='la'); if(!las.length) return; const row=[]; las.forEach(la=>{ for(let k=0;k<8;k++) row.push(this.connected(la,'c'+k)?this.get(la,'c'+k):null); });
    const last=this.hist[this.hist.length-1]; this.hist.push(row); if(this.hist.length>96) this.hist.shift(); }
  /* ---------- отрисовка ---------- */
  bbox(){ let x2=900,y2=560; this.comps.forEach(c=>{ const g=geom(c); x2=Math.max(x2,c.x+g.w+120); y2=Math.max(y2,c.y+g.h+120); }); return [x2,y2]; }
  render(fast){ const pw=this.power, [W_,H_]=this.bbox(); this.W=W_; this.H=H_;
    let s=`<svg class="ewbsvg" viewBox="0 0 ${W_} ${H_}" width="${W_*this.zoom}" height="${H_*this.zoom}" role="img" aria-label="Схема ${esc(this.file)}">
      <defs><pattern id="ewsgrid${this.uid}" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#c9c9c9"/></pattern></defs>
      <rect x="0" y="0" width="${W_}" height="${H_}" fill="url(#ewsgrid${this.uid})" data-bg="1"/>`;
    this.wires.forEach((w,i)=>{ const [ac,ap]=w.f.split('.'), [bc,bp]=w.t.split('.'); const a=pinInfo(this.byId(ac),ap), b=pinInfo(this.byId(bc),bp); if(!a||!b) return;
      const pts=route(a,b,w); w._pts=pts; const lv=this.netVal(w.f); const P=pts.map(p=>p.join(',')).join(' ');
      s+=`<polyline class="wire${this.colorLv&&pw?(lv?' w1':' w0'):''}${i===this.selW?' sel':''}" points="${P}"/><polyline class="wh" data-w="${i}" points="${P}"/>`; });
    // точки-узлы: где к одному выводу подходит больше двух проводов
    const cnt={}; this.wires.forEach(w=>{ cnt[w.f]=(cnt[w.f]||0)+1; cnt[w.t]=(cnt[w.t]||0)+1; });
    this.comps.forEach(c=>{ if(pw){ if(c.type==='lamp') c.view={on:this.get(c,'i')===1}; if(c.type==='hex'){ const v=[0,1,2,3].map(k=>this.get(c,'b'+k)); c.view={v:v[0]|(v[1]<<1)|(v[2]<<2)|(v[3]<<3)}; } if(c.type==='wg') c.view={word:c.st.word}; }
      else { if(c.type==='lamp') c.view={on:false}; if(c.type==='hex') c.view={v:null}; if(c.type==='seg7') c.view={}; if(c.type==='wg') c.view={word:c.st.word}; }
      const g=geom(c), r=(c.rot||0)%4, sel=this.sel.has(c.id);
      s+=`<g class="cmp" data-id="${c.id}" data-t="${c.type}" transform="translate(${c.x},${c.y})${r?` rotate(${r*90} ${g.w/2} ${g.h/2})`:''}"><rect x="-3" y="-3" width="${g.w+6}" height="${g.h+6}" fill="transparent"/>${draw(c)}${sel?`<rect class="selbox" x="-5" y="-5" width="${g.w+10}" height="${g.h+10}"/>`:''}</g>`; });
    this.comps.forEach(c=>{ const g=geom(c); Object.keys(g.pins).forEach(p=>{ const q=pinInfo(c,p); const k=c.id+'.'+p; const fl=pw&&q.dir==='in'&&!this.connected(c,p)&&['gate','ha','fa','jk','d','lamp'].includes(c.type)&&!(p==='PR'||p==='CLR');
        s+=`${(cnt[k]||0)>=2&&c.type!=='conn'?`<circle cx="${q.x}" cy="${q.y}" r="2.4" fill="#000"/>`:''}<circle class="pin${fl?' floating':''}" data-pin="${k}" cx="${q.x}" cy="${q.y}" r="5"/>`; }); });
    if(this.tmp) s+=this.tmp; s+='</svg>';
    this.cv.innerHTML=s; this.svg=this.cv.firstChild;
    this.el.querySelector('.pw').classList.toggle('on',pw); this.el.querySelector('.pause').classList.toggle('on',this.paused);
    this.el.querySelector('[data-tb=wire]').classList.toggle('on',this.colorLv);
    this.el.classList.toggle('run',pw);
    this.doc.textContent=this.file; this.ttl.textContent='Electronics Workbench — '+this.file;
    const fl=this.comps.some(c=>c.type!=='conn'&&geom(c)&&Object.entries(geom(c).pins).some(([p,q])=>q[2]==='in'&&!this.connected(c,p)&&['gate','jk','d','lamp'].includes(c.type)&&!(p==='PR'||p==='CLR')));
    this.stat.textContent= !pw?'Моделирование выключено. Собери схему и включи питание O/I (Analysis → Activate).':this.unstable?'⚠ Схема не устанавливается: выходы всё время меняются (генерация). Проверь обратные связи.':this.paused?'Pause — моделирование приостановлено (Analysis → Resume).':(this.status||'Моделирование идёт.')+(fl?' Оранжевые выводы ни к чему не подключены (считаются 0).':'');
    if(!fast||!this.panHTMLok) this.renderPanels(); else this.updatePanels(); }
  /* ---------- приборы (окна справа) ---------- */
  renderPanels(){ const ins=this.comps.filter(c=>['lc','wg','la'].includes(c.type)); this.pan.hidden=!ins.length;
    this.pan.innerHTML=ins.map(c=>`<div class="e-win" data-win="${c.id}"><div class="e-wt"><span>${c.type==='lc'?'Logic Converter':c.type==='wg'?'Word Generator':'Logic Analyzer'} — ${esc(c.p.label||c.id)}</span><i data-wc="${c.id}">${this.panelsOpen[c.id]===false?'+':'–'}</i></div>${this.panelsOpen[c.id]===false?'':`<div class="e-wb">${c.type==='lc'?this.lcHTML(c):c.type==='wg'?this.wgHTML(c):this.laHTML(c)}</div>`}</div>`).join('');
    this.panHTMLok=true; }
  updatePanels(){ this.comps.forEach(c=>{ if(this.panelsOpen[c.id]===false) return; const box=this.pan.querySelector(`[data-win="${c.id}"] .e-wb`); if(!box) return;
      if(c.type==='la') box.innerHTML=this.laHTML(c); if(c.type==='wg'){ const cur=box.querySelector('.cur'); if(cur) cur.innerHTML=this.wgCur(c); } }); }
  laHTML(c){ const H=this.hist, la=this.comps.filter(x=>x.type==='la'), li=la.indexOf(c); const ch=[]; for(let k=0;k<8;k++) if(this.connected(c,'c'+k)) ch.push(k);
    if(!ch.length) return '<span class="sm" style="font-size:11px">Подключи провода к входам анализатора (слева 8 выводов) — здесь появятся временные диаграммы.</span>';
    const cw=8, lw=54, rh=20, n=Math.max(40,H.length), Wd=lw+n*cw+4;
    let s=`<svg class="lasvg2" viewBox="0 0 ${Wd} ${ch.length*rh+6}" width="${Wd}" height="${ch.length*rh+6}">`;
    const cols=['#ffd400','#00e5ff','#7cff4f','#ff6ad5','#ff8c1a','#b7a6ff','#ffffff','#ff4d4d'];
    ch.forEach((k,i)=>{ const y0=i*rh+4, hi=y0+3, lo=y0+rh-5; s+=`<text x="2" y="${y0+rh/2+3}">${esc(this.netName(c.id+'.c'+k))}</text>`; let p='';
      H.forEach((row,t)=>{ const v=row[li*8+k]; const y=v?hi:lo; p+=`${p?'L':'M'}${lw+t*cw} ${y} L${lw+(t+1)*cw} ${y} `; }); s+=`<path d="${p}" fill="none" stroke="${cols[k]}" stroke-width="1.4"/>`; });
    s+='</svg>'; return `<div style="overflow:auto;max-width:100%">${s}</div><div class="row" style="margin-top:4px;display:flex;gap:4px"><button class="wbtn" data-la="clear">Очистить</button><span style="font-size:10.5px">Отсчёт: каждый такт/шаг генератора/щелчок.</span></div>`; }
  netName(k){ const r=this.net[k]; const n=r&&this.nets[r]; if(!n) return '—'; const d=n.drv[0]; if(d){ const [c,p]=d; const nm=c.p.label||c.id; return (['sw','clk','gate','lamp','vcc','gnd'].includes(c.type)?nm:nm+'.'+(p==='Qn'?"Q'":p)).slice(0,8); }
    const lamp=n.pins.map(x=>this.byId(x.split('.')[0])).find(c=>c&&c.type==='lamp'); return lamp?(lamp.p.label||lamp.id).slice(0,8):'—'; }
  wgCur(c){ return `Слово ${c.st.idx<0?'—':c.st.idx}: <b>${(c.st.word>>>0).toString(16).toUpperCase().padStart(4,'0')}h</b> = ${(c.st.word>>>0).toString(2).padStart(c.p.n||8,'0').replace(/(.{4})(?=.)/g,'$1 ')}`; }
  wgHTML(c){ const w=c.p.words||[]; return `<div class="wgw"><div style="font-size:10.5px">Слова (hex), по одному или через пробел; бит 0 — правый вывод:</div>
    <textarea data-wg="${c.id}" spellcheck="false">${w.map(x=>(x>>>0).toString(16).toUpperCase().padStart(4,'0')).join(' ')}</textarea>
    <div class="row"><button class="wbtn" data-wgb="step" data-id="${c.id}">Step</button><button class="wbtn${c.st.run==='burst'?' on':''}" data-wgb="burst" data-id="${c.id}">Burst</button><button class="wbtn${c.st.run==='cycle'?' on':''}" data-wgb="cycle" data-id="${c.id}">Cycle</button><button class="wbtn" data-wgb="stop" data-id="${c.id}">Stop</button><button class="wbtn" data-wgb="init" data-id="${c.id}">Initial</button></div>
    <div class="row">Частота, Гц <input type="number" min="0.2" max="20" step="0.5" value="${c.p.fv||2}" data-wgf="${c.id}"> Разрядов <input type="number" min="1" max="16" value="${c.p.n||8}" data-wgn="${c.id}"></div>
    <div class="cur">${this.wgCur(c)}</div></div>`; }
  lcHTML(c){ const st=c.st; if(!st.nv){ let n=0; 'ABCDEFGH'.split('').forEach((k,i)=>{ if(this.connected(c,k)) n=i+1; }); st.nv=Math.max(n,2); }
    const n=st.nv, names='ABCDEFGH'.slice(0,n).split(''); if(!st.tab||st.tab.length!==(1<<n)) st.tab=Array(1<<n).fill('?');
    const rows=st.tab.map((v,r)=>`<div><span class="rn">${r}</span>${r.toString(2).padStart(n,'0').split('').map(x=>`<span>${x}</span>`).join('')}<span class="o" data-lco="${c.id}" data-r="${r}" title="Щёлкни: 0 → 1 → X">${v}</span></div>`).join('');
    return `<div class="lcvars">${'ABCDEFGH'.split('').map((k,i)=>`<b class="${i<n?'on':''}" data-lcv="${c.id}" data-n="${i+1}" title="Число переменных">${k}</b>`).join('')}<span style="font-size:10px;margin-left:4px">← щёлкни букву: сколько переменных</span></div>
      <div class="lcg"><div class="lct2"><div><span class="rn"></span>${names.map(x=>`<span><b>${x}</b></span>`).join('')}<span class="o" style="cursor:default">F</span></div>${rows}</div>
      <div class="lcb2">${[['c2t','Схема → Таблица'],['t2e',"Таблица → A'B (СДНФ)"],['t2s',"Таблица → SIMP A'B"],['e2t',"A'B → Таблица"],['e2c',"A'B → Схема"],['e2n',"A'B → NAND"]].map(([k,t])=>`<button class="wbtn" data-lcb="${k}" data-id="${c.id}">${t}</button>`).join('')}</div></div>
      <input class="lcin" data-lci="${c.id}" value="${esc(st.expr||'')}" placeholder="Выражение: A'B + AC  (или !A*B + A*C)" spellcheck="false">
      <div class="lcres">${st.msg||'Подключи выводы A, B, C… ко входам схемы, а правый вывод Out — к выходу, и нажми «Схема → Таблица».'}</div>`; }
  panClick(e){ const t=e.target;
    const wc=t.closest('[data-wc]'); if(wc){ const id=wc.dataset.wc; this.panelsOpen[id]=this.panelsOpen[id]===false; this.renderPanels(); return; }
    if(t.closest('[data-la]')){ this.hist=[]; this.renderPanels(); return; }
    const wb=t.closest('[data-wgb]'); if(wb){ const c=this.byId(wb.dataset.id), a=wb.dataset.wgb;
      if(a==='step'){ if(!this.power) return toast('Сначала включи питание O/I'); this.wgStep(c); this.settle(); this.record(); }
      if(a==='burst'||a==='cycle'){ if(!this.power) return toast('Сначала включи питание O/I'); c.st.run=a; if(a==='burst'){ c.st.idx=-1; } }
      if(a==='stop') c.st.run=null; if(a==='init'){ c.st.run=null; c.st.idx=-1; c.st.word=(c.p.words||[0])[0]||0; if(this.power) this.settle(); }
      this.render(); return; }
    const lv=t.closest('[data-lcv]'); if(lv){ const c=this.byId(lv.dataset.lcv); c.st.nv=+lv.dataset.n; c.st.tab=null; this.renderPanels(); return; }
    const lo=t.closest('[data-lco]'); if(lo){ const c=this.byId(lo.dataset.lco), r=+lo.dataset.r; const nx={'?':'0','0':'1','1':'X','X':'0'}; c.st.tab[r]=nx[c.st.tab[r]]; this.renderPanels(); return; }
    const lb=t.closest('[data-lcb]'); if(lb){ this.lcCmd(this.byId(lb.dataset.id),lb.dataset.lcb); } }
  panInput(e,final){ const t=e.target;
    if(t.dataset.wg){ const c=this.byId(t.dataset.wg); const w=t.value.split(/[\s,;]+/).filter(Boolean).map(x=>parseInt(x,16)).filter(x=>!isNaN(x)); c.p.words=w.length?w:[0]; if(final) this.autosave(); }
    if(t.dataset.wgf){ this.byId(t.dataset.wgf).p.fv=Math.max(0.2,Math.min(20,+t.value||2)); this.autosave(); }
    if(t.dataset.wgn&&final){ this.snapshot(); this.byId(t.dataset.wgn).p.n=Math.max(1,Math.min(16,+t.value||8)); this.rebuild(); this.render(); this.autosave(); }
    if(t.dataset.lci){ this.byId(t.dataset.lci).st.expr=t.value; } }
  /* ---------- Logic Converter ---------- */
  lcCmd(c,k){ const st=c.st, n=st.nv, names='ABCDEFGH'.slice(0,n).split('');
    const say=m=>{ st.msg=m; this.renderPanels(); };
    if(k==='c2t'){ if(!this.connected(c,'Out')) return say('Вывод Out (справа) не подключён к выходу схемы.');
      const nets=names.map(x=>this.net[c.id+'.'+x]); if(nets.some((r,i)=>!this.connected(c,names[i]))) return say('Не все выводы '+names.join(', ')+' подключены. Подключи их ко входам схемы или уменьши число переменных (буквы сверху).');
      const keep=this.keepState(); const tab=[];
      for(let r=0;r<(1<<n);r++){ this.forced={}; nets.forEach((nr,i)=>this.forced[nr]=(r>>(n-1-i))&1); this.settle(); tab.push(String(this.netVal(c.id+'.Out'))); }
      this.forced={}; this.restoreState(keep); st.tab=tab; return say('Таблица построена по схеме: Logic Converter сам перебрал все '+(1<<n)+' комбинаций входов.'); }
    if(k==='t2e'||k==='t2s'){ if(st.tab.includes('?')) return say('В столбце F есть «?» — заполни таблицу (щелчками) или нажми «Схема → Таблица».');
      const ones=[], dcs=[]; st.tab.forEach((v,r)=>{ if(v==='1') ones.push(r); if(v==='X') dcs.push(r); });
      if(k==='t2e'){ const e=ones.map(r=>names.map((x,i)=>((r>>(n-1-i))&1)?x:x+"'").join('')).join(' + ')||'0'; st.expr=e; return say('СДНФ (сумма минтермов): <b>'+esc(e)+'</b>'); }
      const res=qm(n,ones,dcs); const e=res.zero?'0':res.one?'1':res.terms.map(t=>termStr(t,names)).join(' + '); st.expr=e; return say('Упрощённое (Квайн — Мак-Класки'+(dcs.length?', X — безразличные':'')+'): <b>'+esc(e)+'</b>'); }
    if(k==='e2t'||k==='e2c'||k==='e2n'){ let e; const src=(st.expr||'').trim(); if(!src) return say('Впиши выражение в строку ниже.');
      try{ e=parseExpr(src); }catch(err){ return say('Ошибка в выражении: '+esc(err.message)); }
      const vs=[...exprVars(e)].sort(varSort); if(vs.some(v=>!/^[A-H]$/.test(v))) return say('В Logic Converter переменные — буквы A…H.');
      const nn=Math.max(...vs.map(v=>'ABCDEFGH'.indexOf(v)+1),1); st.nv=nn; const nm='ABCDEFGH'.slice(0,nn).split('');
      st.tab=[]; for(let r=0;r<(1<<nn);r++){ const env={}; nm.forEach((x,i)=>env[x]=(r>>(nn-1-i))&1); st.tab.push(String(evalExpr(e,env))); }
      if(k==='e2t') return say('Таблица построена по выражению.');
      let ex=src; if(k==='e2n'){ const ones=st.tab.map((v,r)=>v==='1'?r:-1).filter(r=>r>=0); const res=qm(nn,ones,[]);
        if(res.zero||res.one) return say('Функция — константа '+(res.one?1:0)+', схема не нужна.');
        const lit=(t)=>{ const a=[]; for(let i=0;i<nn;i++){ const b=1<<(nn-1-i); if(t.m&b) continue; a.push((t.v&b)?nm[i]:`!(${nm[i]}*${nm[i]})`); } return a; };
        const terms=res.terms.map(t=>{ const l=lit(t); return l.length===1&&!l[0].startsWith('!')?`!(${l[0]}*${l[0]})`:`!(${l.join('*')})`; });
        ex= terms.length===1? `!(${terms[0]}*${terms[0]})` : `!(${terms.join('*')})`; }
      const gen=ewbFromExpr(ex,{file:'lc.ewb',out:'F'}); this.importGen(gen); return say(k==='e2n'?'Построена схема только на NAND (И-НЕ): упрощённая ДНФ → закон де Моргана → NAND–NAND.':'Схема построена по выражению и добавлена справа.'); } }
  importGen(gen){ this.snapshot(); const [bx]=this.contentBox(); const ox=Math.max(20,bx+60), oy=20, map={};
    gen.comps.forEach(c=>{ const nid=this.newId(c.type); map[c.id]=nid; const n=this.norm(Object.assign({},c,{id:nid,x:c.x+ox,y:c.y+oy})); delete n._d; this.comps.push(n); });
    gen.wires.forEach(w=>{ const [a,ap]=w.f.split('.'),[b,bp]=w.t.split('.'); if(!map[a]||!map[b]) return; this.wires.push({f:map[a]+'.'+ap,t:map[b]+'.'+bp}); });
    this.rebuild(); if(this.power) this.settle(); this.render(); this.autosave(); }
  contentBox(){ let x2=0,y2=0; this.comps.forEach(c=>{ if(c.type==='lc'||c.type==='la'||c.type==='wg') return; const g=geom(c); x2=Math.max(x2,c.x+g.w); y2=Math.max(y2,c.y+g.h); }); return [x2,y2]; }
  /* ---------- меню ---------- */
  menuItems(m){ const has=this.sel.size>0;
    const EX=()=>A.examples?A.examples():[];
    const M={
      File:[['new','Новая схема','Ctrl+N'],['open','Открыть файл (.ewbs)…'],['save','Сохранить в файл…','Ctrl+S'],'-',['saveb','Сохранить в браузере…'],['openb','Открыть из браузера…'],'-',['examples','Примеры схем из лаб ▸'],'-',['print','Снимок схемы (.svg)']],
      Edit:[['undo','Отменить','Ctrl+Z'],['redo','Повторить','Ctrl+Y'],'-',['cut','Вырезать','Ctrl+X',!has],['copy','Копировать','Ctrl+C',!has],['paste','Вставить','Ctrl+V',!this.clip],['del','Удалить','Del',!has&&this.selW<0],['all','Выделить всё','Ctrl+A']],
      Circuit:[['rot','Повернуть (Rotate)','Ctrl+R',!has],['fliph','Отразить (Flip)','',!has],['prop','Свойства детали…','Dbl-click',this.sel.size!==1],['label','Подпись (Label)…','',this.sel.size!==1],'-',['wire','Показывать уровни на проводах',this.colorLv?'✓':''],['grid','Сетка','✓']],
      Analysis:[['power',this.power?'Stop (выключить)':'Activate (включить)','Ctrl+G'],['pause',this.paused?'Resume':'Pause','F9',!this.power],'-',['reset','Сбросить триггеры и счётчики в 0'],['tick','Один такт всех Clock','',!this.power]],
      Window:[['panels','Показать все приборы'],['zin','Увеличить','+'],['zout','Уменьшить','−'],['z1','Масштаб 100%']],
      Help:[['help','Как пользоваться…'],['about','О программе']]};
    return M[m]; }
  openMenu(span){ this.closeMenu(); span.classList.add('open'); const items=this.menuItems(span.dataset.menu); const d=document.createElement('div'); d.className='mdrop';
    d.innerHTML=items.map(it=>it==='-'?'<hr>':`<div data-mi="${it[0]}" class="${it[3]?'dis':''}"><span>${it[1]}</span><span class="kb">${it[2]||''}</span></div>`).join('');
    const r=span.getBoundingClientRect(), pr=this.el.querySelector('.e-menu').getBoundingClientRect(); d.style.left=(r.left-pr.left)+'px'; d.style.top=(r.bottom-pr.top)+'px';
    this.el.querySelector('.e-menu').appendChild(d); this.menu=d; this.menuSpan=span;
    d.addEventListener('click',e=>{ const it=e.target.closest('[data-mi]'); if(!it||it.classList.contains('dis')) return; this.closeMenu(); this.cmd(it.dataset.mi); }); }
  closeMenu(){ if(this.menu){ this.menu.remove(); this.menu=null; } if(this.menuSpan) this.menuSpan.classList.remove('open'); }
  cmd(k){ const one=this.sel.size===1?this.byId([...this.sel][0]):null;
    switch(k){
      case 'new': this.snapshot(); this.loadCirc({file:'Untitled.ewb',comps:[],wires:[]}); this.status=''; break;
      case 'open': this.fin.click(); break;
      case 'save': saveFile((this.file||'scheme').replace(/\.ewb$/,'')+'.ewbs',JSON.stringify(this.dump(),null,1)); break;
      case 'saveb': this.dialog('Сохранить в браузере',`<label>Имя схемы<input data-f="name" value="${esc(this.file.replace(/\.ewbs?$/,''))}"></label><div style="font-size:11px">Схема сохранится в этом браузере (на другом устройстве её не будет — для этого «Сохранить в файл»).</div>`,v=>{ const nm=(v.name||'scheme').trim(); try{ const all=JSON.parse(localStorage.getItem('ewbs:lib')||'{}'); all[nm]=this.dump(); all[nm].file=nm+'.ewb'; localStorage.setItem('ewbs:lib',JSON.stringify(all)); this.file=nm+'.ewb'; this.render(); toast('Сохранено: '+nm); }catch(_){ toast('Браузер не дал сохранить'); } }); break;
      case 'openb':{ let all={}; try{ all=JSON.parse(localStorage.getItem('ewbs:lib')||'{}'); }catch(_){} const names=Object.keys(all);
        this.dialog('Открыть из браузера',names.length?`<label>Схема<select data-f="name">${names.map(n=>`<option>${esc(n)}</option>`).join('')}</select></label><label>Удалить вместо открытия<input type="checkbox" data-f="del"></label>`:'Сохранённых схем пока нет.',v=>{ if(!names.length) return; if(v.del){ delete all[v.name]; try{ localStorage.setItem('ewbs:lib',JSON.stringify(all)); }catch(_){} toast('Удалено'); return; } this.snapshot(); this.loadCirc(all[v.name]); }); break; }
      case 'examples':{ const ex=A.examples?A.examples():[]; this.dialog('Примеры схем',`<label>Схема<select data-f="k">${ex.map((x,i)=>`<option value="${i}">${esc(x.t)}</option>`).join('')}</select></label><div style="font-size:11px">Схема откроется для правки: можно двигать детали, менять провода и проверять.</div>`,v=>{ const x=ex[+v.k]; if(!x) return; this.snapshot(); const c=x.make(); this.loadCirc(c); this.status=c.status||''; if(!this.power) this.cmd('power'); else this.render(); }); break; }
      case 'print':{ const svg=this.svg.outerHTML.replace(/<circle class="pin[^>]*>/g,'').replace(/<polyline class="wh"[^>]*>/g,''); const st='<style>.ld{stroke:#000;stroke-width:1.2}.bd{fill:#fff;stroke:#000;stroke-width:1.3}.ln{fill:none;stroke:#000;stroke-width:1.3}.lv{stroke:#000;stroke-width:2.2}.wire{fill:none;stroke:#000;stroke-width:1.2}.w1{stroke:#e8000b}.w0{stroke:#1a5fd0}text{font:11px Arial}.lb{fill:#2323c8}.sm{font-size:8.5px}.selbox{display:none}</style>'; saveFile(this.file.replace(/\.ewbs?$/,'')+'.svg',svg.replace('>','>'+st)); break; }
      case 'undo': this.undo(); break; case 'redo': this.redo(); break;
      case 'copy': this.copy(); break; case 'cut': this.copy(); this.delSel(); break; case 'paste': this.paste(); break;
      case 'del': this.delSel(); break;
      case 'all': this.sel=new Set(this.comps.map(c=>c.id)); this.render(); break;
      case 'rot': if(!this.sel.size) return toast('Выдели деталь'); this.snapshot(); this.sel.forEach(id=>{ const c=this.byId(id); c.rot=((c.rot||0)+1)%4; }); this.clearVia(); this.render(); this.autosave(); break;
      case 'fliph': if(!this.sel.size) return; this.snapshot(); this.sel.forEach(id=>{ const c=this.byId(id); c.rot=((c.rot||0)+2)%4; }); this.clearVia(); this.render(); this.autosave(); break;
      case 'prop': if(one) this.props(one); else toast('Выдели одну деталь'); break;
      case 'label': if(one) this.dialog('Label',`<label>Подпись<input data-f="l" value="${esc(one.p.label||'')}"></label>`,v=>{ this.snapshot(); one.p.label=v.l; this.render(); this.autosave(); }); break;
      case 'wire': this.colorLv=!this.colorLv; this.render(); break;
      case 'grid': toast('Сетка всегда включена: детали прилипают к шагу 5'); break;
      case 'power': this.power=!this.power; this.paused=false; if(this.power){ this.settle(); this.record(); } this.render(); break;
      case 'pause': if(!this.power) return; this.paused=!this.paused; this.render(); break;
      case 'reset': this.comps.forEach(c=>{ if(['jk','d','t','rs','cnt4','cnt10','reg4'].includes(c.type)) c.st.q=0; }); this.hist=[]; if(this.power) this.settle(); this.render(); break;
      case 'tick': this.pulseClocks(); break;
      case 'panels': this.panelsOpen={}; this.renderPanels(); break;
      case 'zin': this.zoom=Math.min(2.5,this.zoom*1.2); this.render(); break; case 'zout': this.zoom=Math.max(0.4,this.zoom/1.2); this.render(); break; case 'z1': this.zoom=1; this.render(); break;
      case 'help': this.dialog('Справка',HELP,null,true); break;
      case 'about': this.dialog('О программе','<div class="help">Учебная копия <b>Electronics Workbench 5.12</b> (цифровая часть) для лаб по архитектуре ЭВМ: логические элементы, триггеры, счётчики, шифраторы/дешифраторы, мультиплексоры, сумматоры и приборы Logic Converter, Word Generator, Logic Analyzer. Моделирование логическое (0/1), без напряжений и задержек: на рубежке спрашивают логику, а не аналоговые эффекты.</div>',null,true); break;
    } }
  pulseClocks(){ const cl=this.comps.filter(c=>c.type==='clk'); if(!cl.length) return toast('В схеме нет Clock'); cl.forEach(c=>c.st.v=1); this.settle(); this.record(); cl.forEach(c=>c.st.v=0); this.settle(); this.record(); this.render(true); }
  clearVia(ids){ const S=ids||this.sel; this.wires.forEach(w=>{ if(S.has(w.f.split('.')[0])||S.has(w.t.split('.')[0])){ delete w.via; } }); }
  copy(){ if(!this.sel.size) return; const ids=this.sel; this.clip={comps:this.comps.filter(c=>ids.has(c.id)).map(c=>JSON.parse(JSON.stringify({id:c.id,type:c.type,x:c.x,y:c.y,rot:c.rot,p:c.p}))),wires:this.wires.filter(w=>ids.has(w.f.split('.')[0])&&ids.has(w.t.split('.')[0])).map(w=>({f:w.f,t:w.t}))}; toast('Скопировано деталей: '+this.clip.comps.length); }
  paste(){ if(!this.clip) return; this.snapshot(); const map={}; this.sel=new Set();
    this.clip.comps.forEach(c=>{ const id=this.newId(c.type); map[c.id]=id; const n=this.norm(Object.assign({},c,{id,x:c.x+30,y:c.y+30})); if(n.type==='sw'){ n.p=Object.assign({},n.p); } this.comps.push(n); this.sel.add(id); });
    this.clip.wires.forEach(w=>{ const [a,ap]=w.f.split('.'),[b,bp]=w.t.split('.'); this.wires.push({f:map[a]+'.'+ap,t:map[b]+'.'+bp}); });
    this.clip.comps.forEach(c=>c.x+=30); this.clip.comps.forEach(c=>c.y+=30); this.rebuild(); if(this.power) this.settle(); this.render(); this.autosave(); }
  delSel(){ if(!this.sel.size&&this.selW<0) return; this.snapshot();
    if(this.selW>=0&&!this.sel.size){ this.wires.splice(this.selW,1); this.selW=-1; }
    else { const ids=this.sel; this.comps=this.comps.filter(c=>!ids.has(c.id)||c.locked); this.wires=this.wires.filter(w=>!ids.has(w.f.split('.')[0])&&!ids.has(w.t.split('.')[0])); this.sel=new Set(); }
    this.rebuild(); if(this.power) this.settle(); this.render(); this.autosave(); }
  /* ---------- диалоги ---------- */
  dialog(title,body,onOk,info){ const d=document.createElement('div'); d.className='dlg';
    d.innerHTML=`<div role="dialog" aria-label="${esc(title)}"><div class="dt"><span>${esc(title)}</span><i class="wb" data-d="x">×</i></div><div class="db">${body}</div><div class="df">${info?'<button class="wbtn" data-d="x">OK</button>':'<button class="wbtn" data-d="ok">OK</button><button class="wbtn" data-d="x">Cancel</button>'}</div></div>`;
    this.el.appendChild(d); const f=d.querySelector('input,select,textarea'); if(f) f.focus();
    const close=()=>{ d.remove(); this.el.focus({preventScroll:true}); };
    const ok=()=>{ const v={}; d.querySelectorAll('[data-f]').forEach(x=>v[x.dataset.f]=x.type==='checkbox'?x.checked:x.value); close(); if(onOk) onOk(v); };
    d.addEventListener('click',e=>{ const b=e.target.closest('[data-d]'); if(e.target===d) close(); if(!b) return; if(b.dataset.d==='ok') ok(); else close(); });
    d.addEventListener('keydown',e=>{ e.stopPropagation(); if(e.key==='Escape') close(); if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){ e.preventDefault(); if(info) close(); else ok(); } }); }
  props(c){ if(!c) return; const p=c.p; let b=`<div style="font-size:11px;color:#333">${esc(itemName({type:c.type,p:c.p}))} · id ${esc(c.id)}</div>`;
    if(c.type!=='txt'&&c.type!=='conn') b+=`<label>Label (подпись)<input data-f="label" value="${esc(p.label||'')}"></label>`;
    if(c.type==='sw') b+=`<label>Key (клавиша)<input data-f="key" maxlength="5" value="${esc(p.key||'Space')}"></label><label>Сейчас включён<input type="checkbox" data-f="on"${p.on?' checked':''}></label>`;
    if(c.type==='gate'&&p.k!=='not'&&p.k!=='buf') b+=`<label>Number of inputs<select data-f="n">${[2,3,4,5,6,7,8].map(n=>`<option${(p.n||2)===n?' selected':''}>${n}</option>`).join('')}</select></label><label>Тип элемента<select data-f="k">${['and','or','nand','nor','xor','xnor'].map(k=>`<option value="${k}"${p.k===k?' selected':''}>${GATE_RU[k]}</option>`).join('')}</select></label>`;
    if(c.type==='clk') b+=`<label>Frequency, Hz<input type="number" min="0.1" max="20" step="0.1" data-f="fv" value="${p.fv||1}"></label><div style="font-size:11px">В EWB частота любая; здесь до 20 Гц, чтобы глазом видеть счёт.</div>`;
    if(c.type==='lamp') b+=`<label>Цвет<select data-f="col">${[['red','красный'],['green','зелёный'],['blue','синий'],['yellow','жёлтый']].map(([k,t])=>`<option value="${k}"${(p.col||'red')===k?' selected':''}>${t}</option>`).join('')}</select></label>`;
    if(['jk','d','t','cnt4','cnt10','reg4'].includes(c.type)) b+=`<label>Срабатывание<select data-f="edge"><option value="rise"${p.edge!=='fall'?' selected':''}>по переднему фронту 0→1</option><option value="fall"${p.edge==='fall'?' selected':''}>по заднему фронту 1→0 (кружок)</option></select></label>`;
    if(c.type==='jk'||c.type==='d') b+=`<label>Входы PR/CLR<input type="checkbox" data-f="async"${p.async?' checked':''}></label><label>Начальное Q<select data-f="q"><option${!c.st.q?' selected':''}>0</option><option${c.st.q?' selected':''}>1</option></select></label>`;
    if(c.type==='wg') b+=`<label>Разрядов<input type="number" min="1" max="16" data-f="n" value="${p.n||8}"></label><label>Слова (hex)<textarea data-f="words">${(p.words||[]).map(x=>(x>>>0).toString(16).toUpperCase().padStart(4,'0')).join(' ')}</textarea></label>`;
    if(c.type==='txt') b+=`<label>Текст<input data-f="text" value="${esc(p.text||'')}"></label>`;
    this.dialog(itemName({type:c.type,p:c.p}),b,v=>{ this.snapshot();
      if(v.label!==undefined) p.label=v.label; if(v.key!==undefined){ p.key=v.key.length===1?v.key.toUpperCase():v.key; } if(v.on!==undefined) p.on=v.on?1:0;
      if(v.n!==undefined){ p.n=+v.n; } if(v.k!==undefined) p.k=v.k; if(v.fv!==undefined){ p.fv=Math.max(0.1,Math.min(20,+v.fv||1)); p.f=p.fv+' Hz'; }
      if(v.col!==undefined) p.col=v.col; if(v.edge!==undefined) p.edge=v.edge; if(v.async!==undefined) p.async=v.async?1:0; if(v.q!==undefined) c.st.q=+v.q;
      if(v.words!==undefined){ const w=v.words.split(/[\s,;]+/).filter(Boolean).map(x=>parseInt(x,16)).filter(x=>!isNaN(x)); p.words=w.length?w:[0]; } if(v.text!==undefined) p.text=v.text;
      this.clearVia(new Set([c.id])); this.rebuild(); if(this.power) this.settle(); this.render(); this.autosave(); }); }
  /* ---------- панель деталей ---------- */
  openBin(k){ const open=this.pal.dataset.bin===k&&!this.pal.hidden; this.el.querySelectorAll('.binb').forEach(b=>b.classList.toggle('open',!open&&b.dataset.bin===k));
    if(open){ this.pal.hidden=true; this.placing=null; return; } const bin=BINS.find(b=>b.k===k); this.pal.dataset.bin=k; this.pal.hidden=false;
    this.pal.innerHTML=bin.items.map((it,i)=>{ const c=this.norm(Object.assign({id:'p',x:0,y:0},it)); const g=geom(c); return `<div class="pit" data-i="${i}" title="${esc(itemName(it))} — перетащи на поле или щёлкни, потом щёлкни по полю"><svg class="ewbsvg" viewBox="-6 -14 ${g.w+12} ${g.h+22}">${draw(c)}</svg><span>${esc(itemName(it))}</span></div>`; }).join(''); }
  palDown(e){ const it=e.target.closest('.pit'); if(!it) return; e.preventDefault(); const bin=BINS.find(b=>b.k===this.pal.dataset.bin); const item=bin.items[+it.dataset.i];
    this.pal.querySelectorAll('.pit').forEach(x=>x.classList.toggle('on',x===it)); this.placing=item; this.cv.classList.add('placing');
    const sx=e.clientX, sy=e.clientY; let moved=false;
    const mv=ev=>{ if(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)>6) moved=true; };
    const up=ev=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up);
      if(moved){ const r=this.cv.getBoundingClientRect(); if(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom){ const [x,y]=this.pt(ev); this.place(item,x,y); } } };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); }
  place(item,x,y){ this.snapshot(); const c=this.norm(Object.assign({},item,{id:this.newId(item.type)})); const g=geom(c);
    c.x=snap(x-g.w/2); c.y=snap(y-g.h/2); if(c.type==='sw'){ const used=new Set(this.comps.filter(q=>q.type==='sw').map(q=>q.p.key)); const nx='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(k=>!used.has(k))||'A'; c.p=Object.assign({},c.p,{key:nx,label:nx}); }
    if(c.type==='lamp'&&!c.p.label) c.p.label=''; this.comps.push(c); this.sel=new Set([c.id]); this.selW=-1; this.placing=null; this.cv.classList.remove('placing'); this.pal.querySelectorAll('.pit').forEach(x=>x.classList.remove('on'));
    this.rebuild(); if(this.power) this.settle(); this.render(); this.autosave(); this.el.focus({preventScroll:true}); }
  /* ---------- мышь на поле ---------- */
  pt(e){ const r=this.svg.getBoundingClientRect(); return [(e.clientX-r.left)/this.zoom,(e.clientY-r.top)/this.zoom]; }
  down(e){ if(e.button===2) return; this.el.focus({preventScroll:true}); const [x,y]=this.pt(e);
    if(this.placing){ this.place(this.placing,x,y); return; }
    const pin=e.target.closest('[data-pin]'), cmp=e.target.closest('[data-id]'), wh=e.target.closest('[data-w]');
    if(pin){ e.preventDefault(); return this.startWire(e,pin.dataset.pin); }
    if(this.wireFrom&&!pin){ this.wireFrom=null; this.tmp=null; this.el.classList.remove('wiring'); if(!wh){ this.render(); } }
    if(cmp){ const c=this.byId(cmp.dataset.id); e.preventDefault();
      if(c.type==='sw'&&!e.shiftKey){ let moved=false; const sx=e.clientX, sy=e.clientY; const mv=ev=>{ if(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)>4){ moved=true; window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); this.startDrag(ev,c,x,y,true); } };
        const up=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); if(!moved){ this.toggle(c); this.sel=new Set([c.id]); this.selW=-1; this.render(true); } };
        window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); return; }
      return this.startDrag(e,c,x,y); }
    if(wh){ e.preventDefault(); const i=+wh.dataset.w; this.sel=new Set(); this.selW=i; this.render(); return this.dragWire(e,i); }
    // рамка выделения
    this.sel=new Set(); this.selW=-1; const x0=x,y0=y; let band=null;
    const mv=ev=>{ const [x1,y1]=this.pt(ev); band=[Math.min(x0,x1),Math.min(y0,y1),Math.abs(x1-x0),Math.abs(y1-y0)]; this.tmp=`<rect class="band" x="${band[0]}" y="${band[1]}" width="${band[2]}" height="${band[3]}"/>`; this.render(true); };
    const up=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); this.tmp=null;
      if(band){ this.comps.forEach(c=>{ const g=geom(c); if(c.x+g.w/2>=band[0]&&c.x+g.w/2<=band[0]+band[2]&&c.y+g.h/2>=band[1]&&c.y+g.h/2<=band[1]+band[3]) this.sel.add(c.id); }); } this.render(); };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); }
  startDrag(e,c,x,y,noSel){ if(!this.sel.has(c.id)){ this.sel= e.shiftKey? new Set([...this.sel,c.id]) : new Set([c.id]); } this.selW=-1;
    const start=[...this.sel].map(id=>{ const q=this.byId(id); return [q,q.x,q.y]; }); let moved=false, snapped=false; const [x0,y0]=this.pt(e);
    const mv=ev=>{ const [x1,y1]=this.pt(ev); const dx=x1-x0, dy=y1-y0; if(!moved&&Math.abs(dx)+Math.abs(dy)<3) return; if(!moved){ this.snapshot(); moved=true; this.clearVia(); }
      start.forEach(([q,qx,qy])=>{ q.x=Math.max(0,snap(qx+dx)); q.y=Math.max(0,snap(qy+dy)); }); this.render(true); };
    const up=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); if(moved) this.autosave(); this.render(); };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); this.render(true); }
  dragWire(e,i){ const w=this.wires[i]; const pts=w._pts||[]; const [x0,y0]=this.pt(e);
    // ищем ближайший внутренний отрезок: вертикальный → двигаем по x, горизонтальный → по y
    let best=null, bd=1e9; for(let k=1;k<pts.length-2;k++){ const a=pts[k], b=pts[k+1]; const vert=a[0]===b[0]; const d=vert?Math.abs(x0-a[0]):Math.abs(y0-a[1]); if(d<bd){ bd=d; best={vert}; } }
    if(!best) return; let moved=false;
    const mv=ev=>{ const [x1,y1]=this.pt(ev); if(!moved){ this.snapshot(); moved=true; delete w.via; } if(best.vert){ w.xm=snap(x1); delete w.ym; } else { w.ym=snap(y1); delete w.xm; } this.render(true); };
    const up=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); if(moved) this.autosave(); };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); }
  startWire(e,from){ const [fc,fp]=from.split('.'); const a=pinInfo(this.byId(fc),fp);
    if(this.wireFrom&&this.wireFrom!==from){ const f=this.wireFrom; this.wireFrom=null; this.el.classList.remove('wiring'); this.tmp=null; return this.addWire(f,from); }
    this.el.classList.add('wiring'); let moved=false;
    const mv=ev=>{ const [x,y]=this.pt(ev); moved=true; this.tmp=`<polyline class="wire tmp" points="${a.x},${a.y} ${x},${a.y} ${x},${y}"/>`; this.render(true); };
    const up=ev=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up);
      if(!moved){ this.wireFrom=from; this.tmp=`<circle cx="${a.x}" cy="${a.y}" r="6" fill="none" stroke="#e8000b" stroke-width="2"/>`; this.render(true); this.stat.textContent='Провод начат от '+this.pinName(from)+'. Щёлкни второй вывод (или пустое место — отмена).'; return; }
      this.el.classList.remove('wiring'); this.tmp=null;
      const el=document.elementFromPoint(ev.clientX,ev.clientY); const pin=el&&el.closest&&el.closest('[data-pin]'), wh=el&&el.closest&&el.closest('[data-w]');
      if(pin&&pin.dataset.pin!==from) return this.addWire(from,pin.dataset.pin);
      if(wh){ const [x,y]=this.pt(ev); return this.joinWire(from,+wh.dataset.w,x,y); }
      this.render(); };
    window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); }
  pinName(k){ const [c,p]=k.split('.'); const q=this.byId(c); return (q&&q.p.label?q.p.label:c)+'.'+(p==='Qn'?"Q'":p); }
  addWire(a,b){ if(a===b) return; if(this.wires.some(w=>(w.f===a&&w.t===b)||(w.f===b&&w.t===a))){ this.render(); return toast('Такой провод уже есть'); }
    const ia=this.pinDir(a), ib=this.pinDir(b);
    if(ia==='out'&&ib==='out'&&this.net[a]!==this.net[b]){ toast('Два выхода соединять нельзя — получится конфликт уровней'); this.render(); return; }
    const same=this.net[a]&&this.net[a]===this.net[b]; if(same){ this.render(); return toast('Эти выводы уже в одной цепи'); }
    this.snapshot(); const [f,t]= ib==='out'&&ia!=='out'?[b,a]:[a,b]; this.wires.push({f,t}); this.rebuild(); if(this.power){ this.settle(); this.record(); } this.render(); this.autosave(); }
  pinDir(k){ const [c,p]=k.split('.'); const q=this.byId(c); const g=geom(q); return g.pins[p]?g.pins[p][2]:'in'; }
  joinWire(from,i,x,y){ const w=this.wires[i]; const pts=w._pts; let best=null,bd=1e9;
    for(let k=0;k<pts.length-1;k++){ const [a,b]=[pts[k],pts[k+1]]; let px,py; if(a[0]===b[0]){ px=a[0]; py=Math.max(Math.min(a[1],b[1]),Math.min(Math.max(a[1],b[1]),y)); } else { py=a[1]; px=Math.max(Math.min(a[0],b[0]),Math.min(Math.max(a[0],b[0]),x)); } const d=Math.hypot(px-x,py-y); if(d<bd){ bd=d; best=[px,py]; } }
    this.snapshot(); const id=this.newId('conn'); this.comps.push(this.norm({id,type:'conn',x:best[0]-4,y:best[1]-4}));
    const [f,t]=[w.f,w.t]; this.wires.splice(i,1); this.wires.push({f,t:id+'.n'},{f:id+'.n',t},{f:id+'.n',t:from}); this.fixDir(); this.rebuild(); if(this.power){ this.settle(); this.record(); } this.render(); this.autosave(); }
  fixDir(){ this.wires.forEach(w=>{ if(this.pinDir(w.t)==='out'&&this.pinDir(w.f)!=='out'){ const x=w.f; w.f=w.t; w.t=x; } }); }
  toggle(c){ this.snapshot(); c.p.on=c.p.on?0:1; if(this.power){ this.settle(); this.record(); } this.render(true); this.autosave(); }
  key_(e){ if(e.target.closest('input,textarea,select')) return; const k=e.key, ctrl=e.ctrlKey||e.metaKey;
    if(ctrl&&k.toLowerCase()==='z'){ e.preventDefault(); return this.undo(); } if(ctrl&&k.toLowerCase()==='y'){ e.preventDefault(); return this.redo(); }
    if(ctrl&&k.toLowerCase()==='c'){ e.preventDefault(); return this.copy(); } if(ctrl&&k.toLowerCase()==='x'){ e.preventDefault(); this.copy(); return this.delSel(); }
    if(ctrl&&k.toLowerCase()==='v'){ e.preventDefault(); return this.paste(); } if(ctrl&&k.toLowerCase()==='a'){ e.preventDefault(); return this.cmd('all'); }
    if(ctrl&&k.toLowerCase()==='s'){ e.preventDefault(); return this.cmd('save'); } if(ctrl&&k.toLowerCase()==='r'){ e.preventDefault(); return this.cmd('rot'); }
    if(ctrl&&k.toLowerCase()==='g'){ e.preventDefault(); return this.cmd('power'); } if(ctrl&&k.toLowerCase()==='n'){ e.preventDefault(); return this.cmd('new'); }
    if(k==='F9'){ e.preventDefault(); return this.cmd('pause'); }
    if(k==='Delete'||k==='Backspace'){ e.preventDefault(); return this.delSel(); }
    if(k==='Escape'){ this.placing=null; this.wireFrom=null; this.tmp=null; this.el.classList.remove('wiring'); this.cv.classList.remove('placing'); this.sel=new Set(); this.selW=-1; return this.render(); }
    if(k.startsWith('Arrow')&&this.sel.size){ e.preventDefault(); this.snapshot(); const d=e.shiftKey?20:5; this.sel.forEach(id=>{ const c=this.byId(id); if(k==='ArrowLeft') c.x=Math.max(0,c.x-d); if(k==='ArrowRight') c.x+=d; if(k==='ArrowUp') c.y=Math.max(0,c.y-d); if(k==='ArrowDown') c.y+=d; }); this.clearVia(); this.render(); this.autosave(); return; }
    const key=k===' '?'Space':k.length===1?k.toUpperCase():k; const sws=this.comps.filter(c=>c.type==='sw'&&String(c.p.key||'Space').toUpperCase()===key.toUpperCase());
    if(sws.length&&!ctrl&&!e.altKey){ e.preventDefault(); this.snapshot(); sws.forEach(c=>c.p.on=c.p.on?0:1); if(this.power){ this.settle(); this.record(); } this.render(true); this.autosave(); return; }
    if((k==='r'||k==='R')&&this.sel.size) return this.cmd('rot');
    if(k==='+'||k==='=') return this.cmd('zin'); if(k==='-') return this.cmd('zout'); }
  /* ---------- задания с автопроверкой ---------- */
  setTask(t){ this.task=t; this.key='ewbs:task:'+t.id; let loaded=false;
    try{ const s=localStorage.getItem(this.key); if(s){ this.loadCirc(JSON.parse(s),true); loaded=true; } }catch(_){}
    if(!loaded) this.loadCirc(this.taskStart(t),true); this.renderTask(); }
  taskStart(t){ const comps=[], wires=[]; let y=20; const keys='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    (t.inputs||[]).forEach((nm,i)=>{ comps.push({id:'in_'+nm,type:'sw',x:10,y,p:{label:nm,key:(t.keys&&t.keys[i])||keys[i]}}); y+=50; });
    if(t.clock) comps.push({id:'clk',type:'clk',x:10,y:y+10,p:{label:'Clock',f:'1 Hz',fv:1}});
    (t.outputs||[]).forEach((nm,i)=>comps.push({id:'out_'+nm,type:'lamp',x:t.outX||520,y:20+i*40,p:{label:nm}}));
    if(t.hex) comps.push({id:'hx',type:'hex',x:(t.outX||520)+80,y:20,p:{label:'Display'}});
    (t.extra||[]).forEach(c=>comps.push(c));
    return {file:(t.file||t.id)+'.ewb',comps,wires}; }
  renderTask(){ if(!this.taskBox) return; const t=this.task;
    this.taskBox.innerHTML=`<div class="tt">🛠 ${t.title}</div><div class="tx">${t.text}</div><div class="tb2"><button class="btn pri" data-k="check">✔ Проверить схему</button>${t.solution?'<button class="btn" data-k="sol">Показать решение</button>':''}<button class="btn" data-k="reset">Начать заново</button></div><div class="res" hidden></div>`;
    this.taskBox.onclick=e=>{ const b=e.target.closest('[data-k]'); if(!b) return;
      if(b.dataset.k==='check') this.check(); if(b.dataset.k==='reset'){ if(!b.dataset.sure){ b.dataset.sure=1; b.textContent='Точно? Твоя схема удалится'; return; } this.snapshot(); this.loadCirc(this.taskStart(t)); this.renderTask(); }
      if(b.dataset.k==='sol'){ const c=t.solution(); this.snapshot(); this.loadCirc(c); if(!this.power) this.cmd('power'); toast('Загружено решение — можно Ctrl+Z, чтобы вернуть свою схему'); } }; }
  findIO(){ const t=this.task, by=(type,nm)=>this.comps.find(c=>c.type===type&&String(c.p.label||'').trim().toLowerCase()===nm.toLowerCase());
    const ins=(t.inputs||[]).map(nm=>[nm,by('sw',nm)]), outs=(t.outputs||[]).map(nm=>[nm,by('lamp',nm)]); return {ins,outs}; }
  check(){ const t=this.task, box=this.taskBox.querySelector('.res'); const {ins,outs}=this.findIO();
    const miss=[...ins.filter(x=>!x[1]).map(x=>'переключатель «'+x[0]+'»'),...outs.filter(x=>!x[1]).map(x=>'лампочка «'+x[0]+'»')];
    const show=(ok,html)=>{ box.hidden=false; box.className='res '+(ok?'ok':'bad'); box.innerHTML=html; };
    if(miss.length) return show(false,'Не нашёл: '+miss.join(', ')+'. Подписи (Label) должны совпадать с заданием.');
    if(t.only){ const bad=this.comps.filter(c=>c.type==='gate'&&!t.only.includes(c.p.k)); if(bad.length) return show(false,'По условию можно только '+t.only.map(k=>k.toUpperCase()).join(', ')+'. Лишние элементы: '+bad.map(c=>c.p.k.toUpperCase()+' ('+c.id+')').join(', ')+'.'); }
    if(t.gatesOnly){ const ok=['sw','lamp','gate','conn','txt','vcc','gnd','hex','seg7','la','lc','wg','clk']; const bad=this.comps.filter(c=>!ok.includes(c.type)); if(bad.length) return show(false,'Здесь нужно собрать из вентилей (Logic Gates), без готовых микросхем: '+bad.map(c=>NAME[c.type]||c.type).join(', ')+'.'); }
    const wasPw=this.power, keep=this.keepState(), saved=ins.map(x=>x[1].p.on); this.power=true;
    const read=()=>{ const o={}; outs.forEach(([nm,c])=>o[nm]=this.get(c,'i')); return o; };
    const setIn=v=>ins.forEach(([nm,c])=>c.p.on=v[nm]?1:0);
    let bad=[], rows=0;
    try{
      if(t.kind==='comb'){ const n=ins.length; for(let r=0;r<(1<<n);r++){ const v={}; ins.forEach(([nm],i)=>v[nm]=(r>>(n-1-i))&1); if(t.valid&&!t.valid(v)) continue; setIn(v); this.settle(); const got=read(), exp=t.fn(v); rows++;
          if(outs.some(([nm])=>exp[nm]!==undefined&&got[nm]!==exp[nm])) bad.push({v,got,exp}); } }
      else if(t.kind==='seq'){ // последовательность: шаги {in:{...}, clk:bool, exp:{...}}
        this.comps.forEach(c=>{ if(['jk','d','t','rs','cnt4','cnt10','reg4'].includes(c.type)) c.st.q=0; });
        const clks=this.comps.filter(c=>c.type==='clk'); if(t.clock&&!clks.length){ this.power=wasPw; return show(false,'В схеме нет Clock (Sources → Clock).'); }
        clks.forEach(c=>{ c.st.v=0; }); this.settle();
        const steps=typeof t.steps==='function'?t.steps():t.steps; const rel={};
        for(const s of steps){ if(s.in) setIn(Object.assign({},Object.fromEntries(ins.map(([nm,c])=>[nm,c.p.on])),s.in)); this.settle();
          if(s.clk){ clks.forEach(c=>c.st.v=1); this.settle(); clks.forEach(c=>c.st.v=0); this.settle(); }
          if(s.rel) rel[s.rel]=read()[outs[0][0]];
          if(s.exp){ const got=read(); rows++; if(Object.keys(s.exp).some(k=>got[k]!==s.exp[k])) bad.push({v:s.label||s.in||{},got,exp:s.exp,lbl:s.label}); } }
        if(t.relCheck){ rows=steps.filter(s=>s.rel).length; if(!t.relCheck(rel)){ const seq=steps.filter(s=>s.rel).map(s=>(s.label||'старт')+': Q='+rel[s.rel]).join(' → ');
            this.power=wasPw; setIn(Object.fromEntries(ins.map(([nm],i)=>[nm,saved[i]]))); this.restoreState(keep); this.render();
            return show(false,'<b>Q меняется не так.</b> При T = 1 каждый спад C должен переключать Q, при T = 0 — нет. У тебя: '+esc(seq)); } } }
    } finally { setIn(Object.fromEntries(ins.map(([nm],i)=>[nm,saved[i]]))); this.restoreState(keep); this.power=wasPw; this.render(); }
    if(this.unstable) return show(false,'Схема не устанавливается (генерация) — проверь обратные связи.');
    if(!bad.length){ show(true,`<b>Схема работает верно!</b> Проверено ${rows} ${t.kind==='comb'?'комбинаций входов':'шагов'}. ${t.okText||''}`); try{ localStorage.setItem('ewbs:done:'+t.id,'1'); }catch(_){} return; }
    const on=outs.map(x=>x[0]); const head=t.kind==='comb'?ins.map(x=>x[0]):['шаг'];
    show(false,`<b>Есть ошибки: ${bad.length} из ${rows}.</b> ${t.kind==='comb'?'Строки таблицы, где лампочки горят не так, как надо (слева — входы, справа — «надо / у тебя»):':'Шаги, где выходы не совпали:'}<div style="overflow:auto"><table><tr>${head.map(h=>`<th>${esc(h)}</th>`).join('')}${on.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${bad.slice(0,12).map(b=>`<tr>${t.kind==='comb'?head.map(h=>`<td>${b.v[h]}</td>`).join(''):`<td>${esc(String(b.lbl||''))}</td>`}${on.map(h=>`<td class="${b.exp[h]!==undefined&&b.exp[h]!==b.got[h]?'x':''}">${b.exp[h]===undefined?'—':b.exp[h]} / ${b.got[h]}</td>`).join('')}</tr>`).join('')}</table></div>${bad.length>12?'…и ещё '+(bad.length-12):''}`); }
}
const HELP=`<div class="help">
<b>Детали.</b> Сверху — панели как в EWB: <b>Sources</b> (земля, +5V, Clock), <b>Basic</b> (переключатель, узел, надпись), <b>Indicators</b> (лампочки-пробники, 7-сегментный индикатор), <b>Logic Gates</b>, <b>Digital</b> (сумматоры, триггеры, счётчики, регистр), <b>Mux / Coders</b> (мультиплексоры, дешифраторы, шифраторы), <b>Instruments</b> (Logic Converter, Word Generator, Logic Analyzer). Щёлкни панель → перетащи деталь на поле (или щёлкни деталь, потом место).<br>
<b>Провода.</b> Наведи на вывод (подсветится) → зажми и тяни до другого вывода. Можно и щелчками: вывод → вывод. Отпустишь на середине провода — появится узел (чёрная точка), как в EWB. Провод можно выделить и удалить (Del), его средний отрезок — двигать мышью.<br>
<b>Свойства.</b> Двойной щелчок по детали: подпись (Label), клавиша переключателя (Key), число входов элемента, частота Clock, фронт триггера, слова генератора.<br>
<b>Моделирование.</b> Переключатель <b>O/I</b> справа вверху (или Ctrl+G). Переключатели щёлкаются мышью или своей клавишей (как в EWB: A, B, C…). <b>Pause</b> — пауза. Цвет проводов: красный = 1, синий = 0.<br>
<b>Logic Converter:</b> подключи A, B, C… ко входам, Out — к выходу → «Схема → Таблица», затем «Таблица → SIMP». Или впиши выражение и получи таблицу/схему/схему на NAND.<br>
<b>Word Generator:</b> впиши слова (hex) → Step (по одному), Burst (один проход), Cycle (по кругу). Бит 0 — правый вывод.<br>
<b>Logic Analyzer:</b> подключи до 8 сигналов — увидишь временные диаграммы.<br>
<b>Файлы.</b> File → Сохранить в файл (.ewbs) / Открыть; схема также сама сохраняется в браузере. File → Примеры — все схемы из лаб.<br>
<b>Клавиши:</b> Ctrl+Z/Y — отмена/повтор, Ctrl+C/X/V, Del, стрелки — сдвиг, R — повернуть, +/− — масштаб, Esc — отмена действия.</div>`;
function DEMO(){ return {file:'demo_xor.ewb',comps:[{id:'A',type:'sw',x:20,y:40,p:{label:'A',key:'A'}},{id:'B',type:'sw',x:20,y:120,p:{label:'B',key:'B'}},{id:'U1',type:'gate',x:150,y:60,p:{k:'xor',n:2}},{id:'U2',type:'gate',x:150,y:140,p:{k:'and',n:2}},{id:'L1',type:'lamp',x:280,y:68,p:{label:'S'}},{id:'L2',type:'lamp',x:280,y:148,p:{label:'C'}},{id:'T1',type:'txt',x:20,y:8,p:{text:'Пример: полусумматор. Включи питание O/I и жми клавиши A и B.'}}],
  wires:[{f:'A.o',t:'U1.i0'},{f:'B.o',t:'U1.i1'},{f:'A.o',t:'U2.i0'},{f:'B.o',t:'U2.i1'},{f:'U1.o',t:'L1.i'},{f:'U2.o',t:'L2.i'}]}; }

A.Studio=Studio; A.geom=geom; A.drawPart=draw; A.CHIPS=CH; A.qm=qm;
/* вкладка EWB (t16) и кнопки «Собрать самому» в лабах */
A.openTask=function(id){ const t=A.TASKS&&A.TASKS[id]; if(!t) return; const box=document.getElementById('ewb-task-host'); if(!box) return;
  if(typeof showTopic==='function') showTopic('t16'); A.initTab(); box.hidden=false; box.innerHTML='<div></div>'; A.taskStudio=new Studio(box.firstChild,{task:t,height:520});
  setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'start'}),30); };
A.initTab=function(){ const host=document.getElementById('ewb-main'); if(!host||host.dataset.ok) return; host.dataset.ok=1; A.main=new Studio(host,{height:600});
  const tl=document.getElementById('ewb-tasks'); if(tl&&A.TASKS){ const done=id=>{ try{ return localStorage.getItem('ewbs:done:'+id)==='1'; }catch(_){ return false; } };
    const groups={}; Object.entries(A.TASKS).forEach(([id,t])=>{ (groups[t.group||'Задания']=groups[t.group||'Задания']||[]).push([id,t]); });
    tl.innerHTML=Object.entries(groups).map(([g,list])=>`<h3>${esc(g)}</h3><div class="ewbt-list">${list.map(([id,t])=>`<button class="btn" data-task="${id}">${done(id)?'✅ ':''}${esc(t.title)}</button>`).join('')}</div>`).join('');
    tl.addEventListener('click',e=>{ const b=e.target.closest('[data-task]'); if(b) A.openTask(b.dataset.task); }); } };
document.addEventListener('click',e=>{ const b=e.target.closest('[data-ewbtask]'); if(b){ e.preventDefault(); A.openTask(b.dataset.ewbtask); }
  const o=e.target.closest('[data-ewbopen]'); if(o){ e.preventDefault(); const ex=(A.examples?A.examples():[]).find(x=>x.k===o.dataset.ewbopen); if(!ex) return; if(typeof showTopic==='function') showTopic('t16'); A.initTab(); A.main.snapshot(); const c=ex.make(); A.main.loadCirc(c); A.main.status=c.status||''; if(!A.main.power) A.main.cmd('power'); window.scrollTo({top:0}); } });
})();

(function(){ const s=document.getElementById('t16'); if(s&&!s.hidden&&window.ARCH) ARCH.initTab(); })();
