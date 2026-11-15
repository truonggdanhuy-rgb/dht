/* ============================================================
   CÂU QUÁI VẬT (Biển)
   - Phải LÊN THUYỀN ngoài biển rồi bấm mặt nước -> mở khung câu (cầu tàu / bãi cát không câu được)
   - Câu ở VÙNG NƯỚC TỐI: câu trúng quái có tỉ lệ ZB (15%) nhận thêm 1 vé quay hoặc 1 món ăn từ máy chế biến
   - Bấm CÂU -> ~2 giây sau có BÓNG (nhỏ = thường, vừa = hiếm, to = cao cấp)
   - Bóng rỉa mồi vài lần -> cắn câu -> thanh trượt dọc, canh vạch trắng vào vùng sáng
   - Câu được: vào Túi > Biển (ST.qvm = số quái đã câu). Bấm quái vật trong Túi để cầm trên tay (đi là mất)
   - Tiệm câu: nút "Thu mua quái vật" -> bán lấy Xu quái vật (ST.qv)
   - Kem chống nắng (ST.kcn, mua ở Tiệm câu 10 xu quái vật): ngoài biển có tỉ lệ bị RÁT DA (vùng sáng nhỏ lại); thoa kem trong Túi > Biển để tránh. Chỉnh ở khối SUN_* bên dưới
   Muốn chỉnh độ khó / tỉ lệ / giá: sửa bảng RAR và MON ngay bên dưới.
   ============================================================ */
(()=>{
'use strict';
const $=id=>document.getElementById(id);

// ---------- BẢNG CÂN BẰNG ----------
// w = tỉ lệ xuất hiện • zone = bề rộng vùng sáng (0..1) • spd = tốc độ thanh trượt • nib = số lần rỉa mồi
const RAR=[
 {k:'th',n:'Quái thường',   w:.797,zone:.36,spd:.75,nib:2,col:'#7ad0ff'},
 {k:'hi',n:'Quái hiếm',     w:.200,zone:.28,spd:.95,nib:3,col:'#ffd23f'},
 {k:'cc',n:'Quái cao cấp',  w:.003,zone:.22,spd:1.2,nib:4,col:'#ff8ad8'}];
const MON=[
 {id:'chuot',n:'Chuột nước',        r:0,p:20},
 {id:'nhen', n:'Nhện nước',         r:0,p:20},
 {id:'heo',  n:'Cá heo hồng',       r:0,p:20},
 {id:'chim', n:'Cá chim đỏ',        r:1,p:50},
 {id:'tuoc', n:'Bạch tuộc hoàng kim',r:1,p:50},
 {id:'kq',   n:'Kim Quy',           r:2,p:1500}];
const SHN=['bóng nhỏ','bóng vừa','bóng to'];
// ---------- QUÀ VÙNG NƯỚC TỐI ----------
const ZB=.15;   // tỉ lệ nhận thêm quà khi câu trúng quái ở vùng nước tối (muốn 10–20% thì sửa số này)
// chỉ lấy MÓN ĂN từ máy chế biến: xôi, cơm, mì, mứt, đồ hộp, kem, sinh tố, bánh kem, bánh quê, miền Tây, máy ong
const FOODM=[2,3,4,6,7,8,9,10,13,14,17];
function foodPick(){try{const L=[];for(const mi of FOODM){const M=MACHS[mi];if(M&&M.rec)for(const o of M.rec)if(!/^Vắt /.test(o.n))L.push(o)}return L.length?L[Math.floor(Math.random()*L.length)]:null}catch(e){return null}}
function giveBonus(){
 const f=Math.random()<.5?foodPick():null;
 if(f){ST.vp=ST.vp||{};ST.vp[f.id]=(ST.vp[f.id]|0)+1;toast('🎁 Vùng nước tối tặng bạn 1 '+f.e+' '+f.n+'!');return '🎁 Quà vùng nước tối: <b>'+f.e+' '+f.n+'</b> (đã vào Kho)'}
 ST.tk=(ST.tk|0)+1;toast('🎁 Vùng nước tối tặng bạn 1 🎟️ vé quay!');return '🎁 Quà vùng nước tối: <b>+1 🎟️ vé quay</b>'}

// ---------- vẽ quái vật (đơn giản) ----------
const mkS=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 const r=(col,x,y,ww,hh)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),ww,hh)};
 const E=(col,x,y,a,b)=>{a=Math.round(a);b=Math.max(1,Math.round(b));for(let d=-b;d<=b;d++){const ww=Math.round(a*Math.sqrt(Math.max(0,1-d*d/(b*b+.01))));r(col,x-ww,y+d,ww*2,1)}};
 const L=(col,x0,y0,x1,y1,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)r(col,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,t||1,t||1)};
 fn(r,E,L,g);return c};
const ART={
 chuot:()=>mkS(30,20,(r,E,L)=>{
  L('#e8a9b6',4,15,1,12);L('#e8a9b6',1,12,2,7);
  E('#6f86a3',13,13,9,5);E('#9fb4cc',12,11,7,3);E('#d6e2ee',14,16,6,2);
  E('#6f86a3',21,10,5,4);E('#9fb4cc',21,8,4,2);r('#f08aa0',26,11,2,2);
  E('#6f86a3',19,5,2,2);r('#f2a6b8',19,5,2,2);E('#6f86a3',24,5,2,2);r('#f2a6b8',24,5,2,2);
  r('#1a1a2e',22,9,2,2);r('#fff',22,9,1,1);
  L('#dbe6f0',26,12,29,11);L('#dbe6f0',26,13,29,15);
  r('#e8a9b6',8,18,3,2);r('#e8a9b6',17,18,3,2);
  r('#8fd4ff',5,4,2,2);r('#e0f6ff',5,4,1,1);r('#8fd4ff',13,2,2,2);r('#8fd4ff',27,16,2,2)}),
 nhen:()=>mkS(28,22,(r,E,L)=>{
  const lg='#2b3f7a';
  for(const[y0,x1,y1]of[[9,2,3],[11,0,9],[13,0,15],[15,2,21]]){L(lg,10,y0+1,x1+2,y1,1);L(lg,17,y0+1,25-x1,y1,1)}
  E('#4f7fd8',14,13,6,5);E('#86aef5',12,11,3,2);r('#3a5fb0',14,9,1,8);
  E('#4f7fd8',14,7,4,3);
  r('#fff',11,5,3,3);r('#fff',15,5,3,3);r('#1a1a2e',12,6,2,2);r('#1a1a2e',16,6,2,2);
  r('#ffd0d8',13,10,1,1);r('#ffd0d8',15,10,1,1);
  r('rgba(210,245,255,.55)',11,12,6,1);r('rgba(210,245,255,.55)',10,13,1,3);r('rgba(210,245,255,.55)',17,13,1,3);r('rgba(210,245,255,.55)',11,16,6,1)}),
 heo:()=>mkS(32,22,(r,E,L)=>{
  r('#e66a9c',1,6,3,2);r('#e66a9c',2,8,3,2);r('#e66a9c',1,15,3,2);r('#e66a9c',2,13,3,2);E('#f58fb8',7,12,4,2);
  E('#f58fb8',15,12,10,5);E('#ffd6e6',15,15,9,2);E('#f58fb8',24,12,4,4);r('#f58fb8',27,13,4,2);r('#ffd6e6',29,14,2,1);
  r('#e66a9c',11,2,1,1);r('#e66a9c',11,3,2,1);r('#e66a9c',12,4,3,1);r('#e66a9c',12,5,4,1);r('#e66a9c',13,6,5,1);r('#e66a9c',13,7,6,1);
  r('#e66a9c',18,16,4,2);r('#e66a9c',17,18,3,1);
  r('#ffb3d0',10,9,8,1);r('#1a1a2e',24,10,2,2);r('#fff',24,10,1,1);r('#c94a7a',26,14,2,1);r('#ff6f9c',22,13,2,1);
  r('#bfe8ff',20,3,1,2);r('#bfe8ff',23,1,1,2)}),
 chim:()=>mkS(30,24,(r,E,L)=>{
  L('#e8372a',9,11,1,3,3);L('#e8372a',9,13,1,21,3);L('#ff6a50',9,11,2,5,1);L('#ff6a50',9,13,2,19,1);
  E('#a8c4e0',17,12,10,9);E('#d9e8f5',17,13,9,7);E('#f4faff',16,16,6,3);r('#fff',13,6,8,1);
  r('#e8372a',12,5,11,2);r('#ff6a50',13,4,8,1);r('#e8372a',14,3,5,1);
  r('#e8372a',13,20,9,2);r('#ff6a50',14,21,6,1);
  r('#e8a09a',22,9,1,7);E('#ffd23f',24,10,2,2);r('#1a1a2e',24,10,2,2);r('#fff',24,10,1,1);r('#c94a3a',27,13,2,1);
  r('#ff8a7a',15,11,1,1);r('#ff8a7a',18,14,1,1);r('#ff8a7a',16,17,1,1)}),
 tuoc:()=>mkS(30,28,(r,E,L)=>{
  for(let k=0;k<6;k++){const x0=5+k*4;for(let y=17;y<27;y++){const x=x0+Math.round(Math.sin(y/2+k)*2);r('#f2b01e',x,y,3,1);if(y%3==0)r('#fff0a0',x+1,y,1,1)}}
  E('#f2b01e',15,9,9,8);E('#ffcf3a',15,8,8,7);r('#fff0a0',10,3,4,2);r('#d98a0a',18,3,2,2);r('#d98a0a',12,8,2,2);r('#d98a0a',20,8,1,1);
  E('#fff',11,12,3,3);E('#fff',19,12,3,3);r('#1a1a2e',12,12,2,3);r('#1a1a2e',20,12,2,3);r('#fff',12,12,1,1);r('#fff',20,12,1,1);
  r('#b5650a',14,17,3,1);r('#b5650a',13,16,1,1);r('#b5650a',17,16,1,1);
  r('#fff',2,3,1,3);r('#fff',1,4,3,1);r('#fff',27,7,1,3);r('#fff',26,8,3,1)}),
 kq:()=>mkS(46,34,(r,E,L)=>{
  r('#e8b72e',1,22,6,2);E('#e8b72e',9,28,5,3);r('#c98a0a',5,29,2,1);E('#f2c94a',34,28,5,3);r('#c98a0a',38,29,2,1);
  E('#c98a0a',21,20,17,12);E('#ffcf3a',21,19,16,11);E('#ffe27a',18,14,11,5);
  for(const x of[13,21,29])L('#d9951a',x,10,x+(x<21?-3:x>21?3:0),27,1);
  L('#d9951a',7,17,35,17,1);L('#d9951a',6,23,36,23,1);
  r('#fff3a0',20,15,2,2);r('#fff3a0',14,20,2,1);r('#fff3a0',27,20,2,1);
  r('#a8700a',5,29,32,2);
  E('#f6d56a',38,22,4,4);E('#f6d56a',41,19,4,4);r('#1a1a2e',43,18,2,2);r('#fff',43,18,1,1);r('#c98a0a',45,21,1,1);r('#ff9a6a',41,21,2,1)})};
const SPR={},get=id=>SPR[id]||(SPR[id]=ART[id]());
const idxOf=id=>MON.findIndex(m=>m.id==id);

// hiệu ứng Kim Quy: hào quang + tia sáng xoay + sao lấp lánh
function star(g,x,y,s,col){g.fillStyle=col||'#fff';g.fillRect(Math.round(x-s),Math.round(y),s*2+1,1);g.fillRect(Math.round(x),Math.round(y-s),1,s*2+1);g.fillStyle='rgba(255,240,170,.7)';g.fillRect(Math.round(x-1),Math.round(y-1),3,3)}
function fxGold(g,cx0,cy0,t,R,rays){
 const gr=g.createRadialGradient(cx0,cy0,1,cx0,cy0,R);gr.addColorStop(0,'rgba(255,244,170,.9)');gr.addColorStop(.5,'rgba(255,205,70,.35)');gr.addColorStop(1,'rgba(255,205,70,0)');
 g.fillStyle=gr;g.beginPath();g.arc(cx0,cy0,R*(1+.06*Math.sin(t*4)),0,6.283);g.fill();
 if(rays){g.save();g.translate(cx0,cy0);g.rotate(t*.6);g.fillStyle='rgba(255,236,150,.2)';for(let i=0;i<10;i++){g.rotate(Math.PI/5);g.beginPath();g.moveTo(0,0);g.lineTo(R*1.5,-R*.12);g.lineTo(R*1.5,R*.12);g.closePath();g.fill()}g.restore()}
 for(let k=0;k<6;k++){const a=t*1.5+k*1.047,rr=R*.8+Math.sin(t*3+k)*R*.1;star(g,cx0+Math.cos(a)*rr,cy0+Math.sin(a)*rr*.7,Math.max(1,Math.round(R/18*((Math.sin(t*5+k*2)+1.4)*.7))))}}

// vẽ quái vào ctx g, giữa (x,y), rộng w (px)
function put(g,id,x,y,w,t,fx){const s=get(id),h=Math.round(w*s.height/s.width),m=MON[idxOf(id)];
 if(m.r==2&&fx!==false)fxGold(g,x,y,t||0,w*.85,fx==='rays');
 const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;g.drawImage(s,Math.round(x-w/2),Math.round(y-h/2),w,h);g.imageSmoothingEnabled=sm}

// ---------- dữ liệu ----------
const bag=()=>{ST.qvm=(ST.qvm&&typeof ST.qvm=='object'&&!Array.isArray(ST.qvm))?ST.qvm:{};return ST.qvm};
const total=()=>Object.values(bag()).reduce((a,b)=>a+(b|0),0);
const MQ=window.MQ={};
MQ.items=()=>{const b=bag();const L=MON.map((m,i)=>({n:m.n,idx:i,r:m.r,c:b[m.id]|0})).filter(x=>x.c>0).sort((a,b)=>b.r-a.r||a.idx-b.idx).map(x=>({n:x.n,idx:x.idx,sm:'x'+x.c+(HOLD===x.idx?' • đang cầm':'')}));
 const k=ST.kcn|0;if(k>0)L.push({n:'Kem chống nắng',idx:SUN_ID,sm:'x'+k+(protLeft()>0?' • đang bảo vệ':'')});return L};
MQ.paint=(g,ix,c)=>{if(ix===SUN_ID){const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;const s=sunSpr(),w=Math.round(c.width*.55),h=Math.round(w*s.height/s.width);g.drawImage(s,Math.round(c.width/2-w/2),Math.round(c.height/2-h/2),w,h);g.imageSmoothingEnabled=sm;return}
 if(ix<0||!MON[ix])return;const t=performance.now()/1000;put(g,MON[ix].id,c.width/2,c.height/2,MON[ix].r==2?34:30,t)};

// ---------- cầm trên tay ----------
let HOLD=null;
MQ.hold=i=>{if(i===SUN_ID)return useSun();if(!MON[i])return;HOLD=i;window.MQH=1;closeUI();toast('🖐️ Bạn đang cầm '+MON[i].n+' trên tay (di chuyển để cất)')};
MQ.clear=()=>{HOLD=null;window.MQH=0};
const HC={};
MQ.drawHold=(X,Y,d)=>{if(HOLD==null)return;const m=MON[HOLD],t=performance.now()/1000,w=m.r==2?22:m.r==1?17:15,
 off=d==2?-11:d==3?11:d==1?-12:12,bx=X+off,by=Y-5+Math.round(Math.sin(t*3)*1);
 const s=get(m.id),h=Math.round(w*s.height/s.width);
 if(m.r==2)fxGold(cx,bx,by-h/2,t,w*.75,false);
 let o=HC[m.id+w];if(!o&&typeof outl=='function'){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(s,0,0,w,h);o=HC[m.id+w]=outl(c)}
 const sm=cx.imageSmoothingEnabled;cx.imageSmoothingEnabled=false;
 if(o)cx.drawImage(o,Math.round(bx-o.width/2),Math.round(by-o.height));else cx.drawImage(s,Math.round(bx-w/2),Math.round(by-h),w,h);
 cx.imageSmoothingEnabled=sm};
setInterval(()=>{if(HOLD==null)return;try{if(Pl.mv||(ST.av&&ST.av.m>=0)||Pl.sit||(typeof ACT!=='undefined'&&ACT))MQ.clear()}catch(e){}},80);

// ---------- KEM CHỐNG NẮNG + RÁT DA ----------
// Ngoài biển thỉnh thoảng bị nắng làm rát da (vùng sáng khi kéo cá nhỏ lại). Kem chống nắng (Túi › Biển) thoa xong được bảo vệ SUN_PROT ms và hết rát ngay.
const SUN_ID=100,SUN_PROT=3*60000,SUN_BURN=45000,SUN_CHK=20000,SUN_P=.3;   // chỉnh ở đây: thời gian bảo vệ / thời gian rát / chu kỳ kiểm tra / tỉ lệ bị rát
let burnUntil=0,nextChk=0,sunEl=null;
const protLeft=()=>Math.max(0,(+ST.kcnU||0)-Date.now());
const burning=()=>burnUntil>Date.now();
const atSea=()=>{try{return !!(window.CV&&CV.boat&&typeof MAP!=='undefined'&&MAP=='bn')}catch(e){return false}};
let _sun=null;const sunSpr=()=>_sun||(_sun=mkS(20,26,(r,E)=>{
 r('#fff',7,1,6,3);r('#c9d3de',7,3,6,1);r('#e8eef4',6,4,8,1);
 r('#ff9f2e',5,5,10,19);r('#ffc266',5,5,2,19);r('#d9741a',13,5,2,19);r('#c4620f',5,23,10,1);
 r('#fff6d8',6,10,8,9);r('#f0dca8',6,18,8,1);
 E('#ffb300',10,14,2,2);for(const[x,y]of[[10,10],[10,18],[7,14],[13,14],[8,11],[12,11],[8,17],[12,17]])r('#ffb300',x,y,1,1);r('#ff7a00',10,14,1,1)}));
function useSun(){
 if(!(ST.kcn>0))return;
 if(!atSea())return toast('☀️ Ra biển rồi hãy thoa kem nhé');
 if(protLeft()>30000)return toast('🧴 Bạn vẫn đang được bảo vệ khỏi nắng');
 ST.kcn=(ST.kcn|0)-1;ST.kcnU=Date.now()+SUN_PROT;burnUntil=0;sunHud();try{save()}catch(e){}closeUI();toast('🧴 Đã thoa kem chống nắng!')}
function sunHud(){
 if(!sunEl){sunEl=document.createElement('div');
  sunEl.style.cssText='position:fixed;inset:0;z-index:24;pointer-events:none;display:none;background:radial-gradient(ellipse at center,rgba(255,80,40,0) 55%,rgba(255,70,30,.32) 100%)';
  sunEl.innerHTML='<div style="position:absolute;left:50%;top:54px;transform:translateX(-50%);padding:5px 12px;font:800 13px Nunito,\'Segoe UI\',Arial,sans-serif;background:#ffe3d6;border:2px solid #c4382e;border-radius:8px;color:#8a2218;box-shadow:0 2px 0 #c4382e">🔥 Rát da</div>';
  document.body.appendChild(sunEl)}
 sunEl.style.display=burning()?'block':'none'}
setInterval(()=>{const n=Date.now();
 if(burnUntil&&n>=burnUntil){burnUntil=0;toast('😌 Da đã hết rát')}
 if(!atSea()){nextChk=0;sunHud();return}
 if(!nextChk)nextChk=n+SUN_CHK;
 if(n>=nextChk){nextChk=n+SUN_CHK;
  if(!burnUntil&&protLeft()<=0&&Math.random()<SUN_P){burnUntil=n+SUN_BURN;toast('☀️ Nắng làm rát da!'+((ST.kcn|0)>0?'\n🧴 Dùng kem trong Túi › Biển':''))}}
 sunHud()},1000);

// ---------- CSS ----------
{const s=document.createElement('style');s.textContent='#mqb{position:relative;width:30px;flex:none;background:#d9c28a;border:2px solid #7a4a26;opacity:.4}#mqb.on{opacity:1}#mqz{position:absolute;left:0;right:0;background:#5fe36a;box-shadow:0 0 10px #c8ff8a inset,0 0 8px #8dff7a;display:none}#mqk{position:absolute;left:-5px;right:-5px;height:6px;margin-top:-3px;background:#fff;border:1px solid #333;display:none}.mqr{display:flex;align-items:center;gap:8px}.mqr canvas{width:54px;height:44px;image-rendering:pixelated;background:#cfeeff;border:1px solid #c9a06a;flex:none}.mqr .t{flex:1;min-width:0;font-size:12px;line-height:1.3}.mqr .bt{display:flex;flex-direction:column;gap:3px}';document.head.appendChild(s)}

// ============================================================
//  KHUNG CÂU
// ============================================================
let F=null,raf=0,last=0;
const HX=66,SY=16,KEY=e=>(e.key==' '||e.key=='e'||e.key=='E');
const rr=(a,b)=>a+Math.random()*(b-a);
const ease=u=>1-Math.pow(1-Math.min(1,Math.max(0,u)),3);
MQ.open=(ctx)=>{
 const onBoat=window.CV&&CV.boat&&CV.cur=='bn'&&typeof MAP!=='undefined'&&MAP=='bn';
 if(!onBoat)return toast('🚣 Phải lên thuyền ra biển mới câu được! Ra cuối cầu tàu, bấm RA BIỂN nhé');
 const bk=(ctx&&ctx.boat)||CV.bk||2;
 openUI(head('🎣 Câu quái vật')+
  '<div class="mut" id="mqs" style="text-align:center;min-height:32px"></div>'+
  '<div style="display:flex;gap:8px;justify-content:center;align-items:stretch">'+
  '<canvas id="mqc" width="120" height="90" style="width:240px;max-width:calc(100% - 44px);height:auto;aspect-ratio:4/3;image-rendering:pixelated;border:2px solid #7a4a26;background:#5fd0d8;touch-action:manipulation"></canvas>'+
  '<div id="mqb" onpointerdown="event.preventDefault();MQ.btn()"><div id="mqz"></div><div id="mqk"></div></div></div>'+
  '<button class="b w" id="mqg" style="font-size:15px;padding:10px" onpointerdown="event.preventDefault();MQ.btn()">🎣 CÂU</button>'+
  '<div class="mut" id="mqn"></div>'+
  '<button class="b w" onclick="MQ.bag()">🎒 Xem quái đã câu (Túi › Biển)</button>');
 F={ph:'idle',t:0,rip:[],parts:[],cast:0,bk:bk};MQ.stat();cnt();if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}};
MQ.bag=()=>{F=null;bagUI('b')};
const cnt=()=>{const e=$('mqn');if(e)e.innerHTML='🎒 Trong Túi › Biển: <b>'+total()+'</b> quái vật • <img src="'+QVI+'" style="width:14px;height:14px;vertical-align:-2px;image-rendering:pixelated"> <b>'+fmtXu(ST.qv|0)+'</b> Xu quái vật'+(window.seaZoneHere&&seaZoneHere()?'<br>🌑 <b>Đang ở vùng nước tối</b> — câu trúng quái có '+Math.round(ZB*100)+'% nhận quà!':'')};
const say=(s,col)=>{const e=$('mqs');if(e){e.innerHTML=s;e.style.color=col||''}};
MQ.stat=()=>{if(!F)return;const b=$('mqg');if(!b)return;const p=F.ph;
 if(p=='idle'){b.textContent='🎣 CÂU';b.classList.remove('z');say('Bấm <b>CÂU</b> để thả mồi từ thuyền xuống biển')}
 else if(p=='cast'){b.textContent='Đang thả mồi...';b.classList.add('z');say('🌊 Đang thả mồi... chờ bóng quái vật')}
 else if(p=='shadow'){b.textContent='Chờ bóng...';b.classList.add('z');say('👀 Có <b>'+SHN[F.rar]+'</b> đang bơi lại gần!')}
 else if(p=='nibble'){b.textContent='Nó đang rỉa mồi...';b.classList.add('z');say('🫧 Bóng đang rỉa mồi... <b>đừng kéo vội!</b>')}
 else if(p=='bite'){b.textContent='⚡ KÉO!';b.classList.remove('z');say('❗ <b>Cắn câu rồi!</b> Bấm KÉO khi vạch trắng nằm trong vùng xanh!','#c4382e')}
 else if(p=='win'){b.textContent='🎣 CÂU TIẾP';b.classList.remove('z')}
 else if(p=='lose'){b.textContent='🎣 CÂU LẠI';b.classList.remove('z')}};
MQ.btn=()=>{if(!F)return;const p=F.ph;
 if(p=='idle'||((p=='win'||p=='lose')&&F.t>.8))return startCast();
 if(p=='bite')return pull()};
addEventListener('keydown',e=>{if(!F||e.repeat||!KEY(e))return;MQ.btn()});

function startCast(){F.ph='cast';F.t=0;F.wait=rr(1.8,2.3);F.rip=[];F.parts=[];F.dip=0;F.sh=null;F.mon=null;const z=$('mqz'),k=$('mqk'),b=$('mqb');if(z)z.style.display='none';if(k)k.style.display='none';if(b)b.classList.remove('on');MQ.stat()}
function rollMon(){if(MQ.force!=null&&MON[MQ.force])return MON[MQ.force];let u=Math.random(),rar=0;for(let i=0;i<RAR.length;i++){if(u<RAR[i].w){rar=i;break}u-=RAR[i].w;rar=i}
 const L=MON.filter(m=>m.r==rar);return L[Math.floor(Math.random()*L.length)]}
function spawnShadow(){const m=rollMon();F.mon=m;F.rar=m.r;const from=Math.random()<.5?-14:134,y=rr(52,72);F.sh={x:from,y,dir:from<0?1:-1,a:0,fx:from,fy:y,mode:0};F.ph='shadow';F.t=0;MQ.stat()}
function startBite(){F.ph='bite';F.t=0;const R=RAR[F.rar];F.zone=R.zone*(burning()?.82:1);F.zx=rr(.06,.94-F.zone);F.spd=R.spd;F.p0=Math.random()*2;
 const z=$('mqz'),k=$('mqk'),b=$('mqb');if(z){z.style.display='block';z.style.top=F.zx*100+'%';z.style.height=F.zone*100+'%'}if(k)k.style.display='block';if(b)b.classList.add('on');MQ.stat()}
const markPos=()=>Math.abs(((F.t*F.spd+F.p0)%2)-1);
function hideBar(){const z=$('mqz'),k=$('mqk'),b=$('mqb');if(z)z.style.display='none';if(k)k.style.display='none';if(b)b.classList.remove('on')}
function pull(){const p=markPos(),ok=p>=F.zx-.015&&p<=F.zx+F.zone+.015;
 if(ok){const m=F.mon,b=bag();b[m.id]=(b[m.id]|0)+1;let bonus='';try{const zn=window.seaZoneHere&&seaZoneHere();if(zn&&Math.random()<ZB)bonus=giveBonus()}catch(e){}try{save()}catch(e){}
  F.ph='win';F.t=0;F.parts=[];for(let i=0;i<(m.r==2?46:m.r==1?18:9);i++)F.parts.push({a:rr(0,6.283),v:rr(20,m.r==2?70:46),l:rr(.5,1.3),t:0,c:m.r==2?['#fff','#ffe27a','#ffcf3a','#ffb0e8'][i%4]:m.r==1?'#ffe27a':'#bfe8ff'});
  F.rip.push({x:HX,t:0});hideBar();
  say('🎉 Câu được <b style="color:'+RAR[m.r].col+';text-shadow:0 0 1px #000">'+m.n+'</b> ('+RAR[m.r].n.toLowerCase()+')!<br><small>Đã vào Túi › Biển • bán ở Tiệm câu: '+m.p+' xu quái vật</small>'+(bonus?'<br>'+bonus:''),'#2a7a2a');
  const bt=$('mqg');if(bt)bt.textContent='🎣 CÂU TIẾP';cnt();
  if(m.r==2)toast('✨🐢 WOW! Bạn câu được KIM QUY huyền thoại!')}
 else{F.ph='lose';F.t=0;say('💨 Hụt rồi! Quái vật tuột câu và bơi mất. Thử lại nhé!','#c4382e');F.sh.mode=9;MQ.stat();hideBar()}}

function upd(dt){F.t+=dt;F.rip.forEach(q=>q.t+=dt);F.rip=F.rip.filter(q=>q.t<1.1);F.parts.forEach(q=>q.t+=dt);
 const s=F.sh,p=F.ph;
 if(p=='cast'){if(F.t>=F.wait)spawnShadow()}
 else if(p=='shadow'){const u=ease(F.t/1.7),tx=HX+(s.dir>0?-1:1)*(10+(F.rar+1)*5),ty=44;s.a=Math.min(1,F.t*2.5);
  s.x=s.fx+(tx-s.fx)*u;s.y=s.fy+(ty-s.fy)*u+Math.sin(F.t*5)*1.2;
  if(F.t>=1.7){F.ph='nibble';F.t=0;F.nb=0;s.mode=1;MQ.stat()}}
 else if(p=='nibble'){const N=RAR[F.rar].nib,per=1.0,u=F.t/per,idx=Math.floor(u),ss=u-idx,rx=[7,12,19][F.rar];
  const far=rx+12,near=rx+3,d=far-(far-near)*Math.pow(Math.sin(Math.PI*Math.min(1,ss)),.7);
  s.x=HX+(s.dir>0?-1:1)*d;s.y=44+Math.sin(F.t*4)*1.5;
  const tch=ss>.42&&ss<.62;F.dip=tch?2.5:Math.max(0,F.dip-dt*8);
  if(tch&&F.nb<=idx){F.nb=idx+1;F.rip.push({x:HX,t:0})}
  if(idx>=N)startBite()}
 else if(p=='bite'){F.dip=Math.min(9,F.dip+dt*30);s.x=HX+(s.dir>0?-1:1)*(RAR[F.rar]?[7,12,19][F.rar]+2:10)+Math.sin(F.t*30)*1.2;s.y=44+Math.sin(F.t*22)*1.2;
  const k=$('mqk');if(k)k.style.top=markPos()*100+'%';
  if(F.t>7){F.ph='lose';F.t=0;say('💨 Chờ lâu quá, quái vật nhả mồi bơi mất. Thử lại nhé!','#c4382e');s.mode=9;MQ.stat();hideBar()}}
 else if(p=='lose'){s.x+=s.dir*-1*90*dt;s.a=Math.max(0,s.a-dt*1.2);F.dip=Math.max(0,F.dip-dt*14)}
 else if(p=='win'){F.dip=Math.max(0,F.dip-dt*14)}}

// ---------- vẽ cảnh ----------
const BANDS=['#6fd9d6','#5cc8d4','#4cb4d0','#3ea0c8','#318abc','#2874ae','#1f609c','#194f88'];
function shadow(g,x,y,rar,dir,a,t){g.save();g.globalAlpha=.55*a;g.translate(Math.round(x),Math.round(y));g.scale(dir,1);
 const C='#0a2450',w=Math.sin(t*9)*1.4;
 if(rar==0){g.fillStyle=C;g.beginPath();g.ellipse(0,0,7,3.4,0,0,6.283);g.fill();g.beginPath();g.moveTo(-6,0);g.lineTo(-11,-3+w);g.lineTo(-11,3+w);g.fill()}
 else if(rar==1){g.fillStyle=C;g.beginPath();g.ellipse(0,0,12,5.2,0,0,6.283);g.fill();g.beginPath();g.moveTo(-10,0);g.lineTo(-17,-5+w);g.lineTo(-17,5+w);g.fill();g.beginPath();g.moveTo(-3,-4);g.lineTo(2,-9);g.lineTo(5,-4);g.fill();g.beginPath();g.moveTo(0,4);g.lineTo(-3,8);g.lineTo(4,4);g.fill()}
 else{g.fillStyle=C;g.beginPath();g.ellipse(0,0,17,10,0,0,6.283);g.fill();g.beginPath();g.ellipse(18,-1,5,3.6,0,0,6.283);g.fill();g.beginPath();g.ellipse(-5,-10+w*.4,7,3,-.5,0,6.283);g.fill();g.beginPath();g.ellipse(9,10-w*.4,7,3,.5,0,6.283);g.fill();g.beginPath();g.ellipse(-5,10-w*.4,6,3,.5,0,6.283);g.fill();g.beginPath();g.moveTo(-16,0);g.lineTo(-22,1+w*.4);g.lineTo(-16,3);g.fill();
  g.globalAlpha=.3*a+.1*Math.sin(t*4);g.strokeStyle='#ffd23f';g.lineWidth=1;g.beginPath();g.ellipse(0,0,19,12,0,0,6.283);g.stroke()}
 g.restore()}
function boatScene(g,k,t,y){
 g.fillStyle='rgba(20,60,100,.35)';g.fillRect(0,SY+3,36,5);
 if(k==3){g.fillStyle='#cfe0ea';g.fillRect(0,y+3,34,8);g.fillStyle='#fff';g.fillRect(0,y,34,6);g.fillStyle='#ff8fb5';g.fillRect(0,y+7,32,1);g.fillStyle='#ffc2d8';g.fillRect(4,y-1,24,2);
  g.fillStyle='#fff';g.fillRect(0,y-9,5,11);g.fillRect(2,y-13,6,6);g.fillStyle='#ffa733';g.fillRect(8,y-11,4,2);g.fillStyle='#222';g.fillRect(5,y-11,1,2)}
 else{g.fillStyle='#7a4e28';g.fillRect(0,y+4,34,6);g.fillStyle='#b8764a';g.fillRect(0,y+1,34,6);g.fillStyle='#c98a5a';g.fillRect(0,y,34,3);g.fillStyle='#f6dc9c';g.fillRect(0,y,34,1);g.fillStyle='#e0584a';g.fillRect(0,y+3,34,1);g.fillStyle='#8a5a30';g.fillRect(3,y+8,28,1)}
 g.fillStyle='#f2c9a0';g.fillRect(12,y-9,6,6);g.fillStyle='#5a3a22';g.fillRect(11,y-11,8,3);g.fillStyle='#3a6fb0';g.fillRect(11,y-3,8,4)}
function draw(c){const g=c.getContext('2d');g.imageSmoothingEnabled=false;const t=performance.now()/1000,W=120,H=90;
 // trời + nước
 g.fillStyle='#cfeeff';g.fillRect(0,0,W,SY);g.fillStyle='#fff';g.fillRect(84,3,14,3);g.fillRect(88,1,8,2);g.fillRect(12,5,10,2);
 for(let i=0;i<BANDS.length;i++){g.fillStyle=BANDS[i];g.fillRect(0,SY+Math.floor(i*(H-SY)/BANDS.length),W,Math.ceil((H-SY)/BANDS.length)+1)}
 g.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<4;i++){const x=40+i*22+Math.sin(t*.6+i)*4;g.beginPath();g.moveTo(x,SY);g.lineTo(x+10,SY);g.lineTo(x+30,H);g.lineTo(x+14,H);g.fill()}
 g.fillStyle='rgba(255,255,255,.55)';for(let x=0;x<W;x+=7)g.fillRect(x+Math.round(Math.sin(t*2+x)*1.5),SY,4,1);
 // thuyền (mini / thiên nga) + cần câu cắm bên mạn thuyền
 const by0=F.bk?10+Math.round(Math.sin(t*2.2)):9;
 if(F.bk)boatScene(g,F.bk,t,by0);
 else{g.fillStyle='#5e3f20';g.fillRect(5,18,3,26);g.fillRect(20,18,3,22);g.fillStyle='rgba(20,60,100,.35)';g.fillRect(0,SY+2,28,6);
  g.fillStyle='#b8864e';g.fillRect(0,10,28,7);g.fillStyle='#d6a66a';g.fillRect(0,10,28,2);g.fillStyle='#8a5f33';g.fillRect(0,16,28,1)}
 const tipX=46,tipY=1,rx0=F.bk?24:18,RL=44-rx0;g.fillStyle='#6b4220';for(let i=0;i<=RL;i++)g.fillRect(rx0+i,by0-Math.round(i*(by0-1)/RL),2,2);g.fillStyle='#d9a441';g.fillRect(tipX,tipY,2,2);
 // phao + dây
 let fy=SY-2+(F.dip||0);
 if(F.ph=='cast'&&F.t<.45){fy=-6+(SY-2+6)*ease(F.t/.45)*1;if(F.t>=.4&&!F.spl){F.spl=1;F.rip.push({x:HX,t:0})}}else F.spl=F.ph=='cast'?F.spl:0;
 g.fillStyle='rgba(255,255,255,.8)';{const n=40;for(let i=0;i<=n;i++){const u=i/n;g.fillRect(Math.round(tipX+(HX-tipX)*u),Math.round(tipY+(fy-tipY)*u+Math.sin(u*Math.PI)*5),1,1)}}
 const hy=Math.round(fy+20);
 if(fy>SY-4){g.fillStyle='rgba(255,255,255,.65)';g.fillRect(HX,Math.round(fy+3),1,hy-Math.round(fy+3));g.fillStyle='#c8c8d0';g.fillRect(HX-1,hy,3,1);g.fillRect(HX-1,hy-1,1,1);g.fillStyle='#ff9ab8';g.fillRect(HX-2,hy-3,2,2)}
 g.fillStyle='#e8402a';g.fillRect(HX-1,Math.round(fy)-3,3,3);g.fillStyle='#fff';g.fillRect(HX-1,Math.round(fy),3,2);
 // gợn sóng
 for(const q of F.rip){const a=1-q.t/1.1;g.strokeStyle='rgba(255,255,255,'+(.8*a).toFixed(2)+')';g.lineWidth=1;g.beginPath();g.ellipse(q.x,SY+1,2+q.t*16,1+q.t*3,0,0,6.283);g.stroke()}
 // bóng
 if(F.sh&&F.ph!='win')shadow(g,F.sh.x,F.sh.y,F.rar,F.sh.dir,F.sh.a,t);
 if(F.ph=='bite'){for(let i=0;i<3;i++){g.fillStyle='rgba(255,255,255,.7)';g.fillRect(HX-6+((i*7+Math.floor(t*10))%12),SY-2-((t*30+i*5)%9|0),1,1)}
  g.fillStyle='#fff';g.fillRect(HX+6,SY-14,2,5);g.fillRect(HX+6,SY-7,2,2);g.fillStyle='#e8402a';g.fillRect(HX+5,SY-15,2,5);g.fillRect(HX+5,SY-8,2,2)}
 // quái vật nhảy lên
 if(F.ph=='win'&&F.mon){const m=F.mon,u=Math.min(1,F.t/.7),x=HX+(60-HX)*ease(u),y=hy-(hy-40)*ease(u)-Math.sin(Math.PI*u)*18,w=m.r==2?50:m.r==1?38:34;
  if(m.r==2)fxGold(g,60,44,t,48,'rays');
  put(g,m.id,x,y+(u>=1?Math.sin(t*3)*2:0),w,t,false);
  for(const q of F.parts){if(q.t>q.l)continue;const a=1-q.t/q.l;g.globalAlpha=a;g.fillStyle=q.c;const px=60+Math.cos(q.a)*q.v*q.t,py=44+Math.sin(q.a)*q.v*q.t+q.t*q.t*14;g.fillRect(Math.round(px),Math.round(py),2,2);if(m.r==2)star(g,px,py,1,q.c);g.globalAlpha=1}}}
function loop(ts){raf=0;if(!F)return;const c=$('mqc');if(!c||!UI){F=null;return}
 const dt=Math.min(.05,(ts-last)/1000||0);last=ts;upd(dt);draw(c);raf=requestAnimationFrame(loop)}

// ============================================================
//  THU MUA QUÁI VẬT (trong Tiệm câu)
// ============================================================
let SC=null,SCT=0;
MQ.sellUI=()=>{F=null;const b=bag(),L=MON.map((m,i)=>({m,i,c:b[m.id]|0})).filter(x=>x.c>0).sort((a,c)=>c.m.r-a.m.r||a.i-c.i);
 let sum=0;for(const x of L)sum+=x.c*x.m.p;
 let h=head('💰 Thu mua quái vật')+'<div class="mut" style="text-align:center">🐙 <i>"Quái vật tươi roi rói! Bán đây tôi thu mua hết nè~"</i></div>'+
  '<div class="mut" style="text-align:center">Bạn có <img src="'+QVI+'" style="width:15px;height:15px;vertical-align:-3px;image-rendering:pixelated"> <b>'+fmtXu(ST.qv|0)+'</b> Xu quái vật</div>';
 if(!L.length)h+='<div class="mut" style="text-align:center">Bạn chưa câu được quái vật nào. Lên thuyền ra biển để câu nhé! 🎣</div>';
 else{h+='<div class="g1">'+L.map(x=>{const sure=SC==x.m.id&&performance.now()<SCT;
   return '<div class="it mqr"><canvas class="mqs" data-id="'+x.m.id+'" width="54" height="44"></canvas><div class="t"><b>'+x.m.n+'</b> <small>('+RAR[x.m.r].n+')</small><br><small>'+x.m.p+' xu/con • đang có <b>x'+x.c+'</b></small></div>'+
   '<div class="bt"><button class="b" onclick="MQ.sell(\''+x.m.id+'\',0)">'+(sure?'⚠️ Chắc chưa?':'Bán 1 (+'+x.m.p+')')+'</button>'+(x.c>1?'<button class="b" onclick="MQ.sell(\''+x.m.id+'\',1)">Bán hết (+'+x.c*x.m.p+')</button>':'')+'</div></div>'}).join('')+'</div>';
  h+='<button class="b w" onclick="MQ.sellAll()">💰 Bán tất cả (+'+fmtXu(sum)+' Xu quái vật)</button>'}
 h+='<button class="b w" onclick="MQ.shop()">⬅ Về tiệm</button>';
 openUI(h);document.querySelectorAll('canvas.mqs').forEach(c=>{const g=c.getContext('2d');put(g,c.dataset.id,27,22,MON[idxOf(c.dataset.id)].r==2?42:34,0,false)})};
MQ.sell=(id,all)=>{const m=MON[idxOf(id)],b=bag(),c=b[id]|0;if(!m||c<1)return MQ.sellUI();
 if(m.r==2&&!(SC==id&&performance.now()<SCT)){SC=id;SCT=performance.now()+4000;toast('⚠️ Kim Quy rất hiếm! Bấm lần nữa để chắc chắn bán');return MQ.sellUI()}
 const n=all?c:1;b[id]=c-n;ST.qv=(ST.qv|0)+n*m.p;SC=null;try{xuUp()}catch(e){}try{save()}catch(e){}toast('💰 Đã bán '+n+' '+m.n+' → +'+fmtXu(n*m.p)+' Xu quái vật');MQ.sellUI()};
MQ.sellAll=()=>{const b=bag();let sum=0,n=0;for(const m of MON){const c=b[m.id]|0;if(c>0){sum+=c*m.p;n+=c}}
 if(!n)return toast('Bạn chưa có quái vật nào để bán');
 if((b.kq|0)>0&&!(SC=='all'&&performance.now()<SCT)){SC='all';SCT=performance.now()+4000;toast('⚠️ Trong túi có Kim Quy! Bấm lần nữa để bán tất cả');return}
 for(const m of MON)b[m.id]=0;ST.qv=(ST.qv|0)+sum;SC=null;try{xuUp()}catch(e){}try{save()}catch(e){}toast('💰 Bán '+n+' quái vật → +'+fmtXu(sum)+' Xu quái vật');MQ.sellUI()};
MQ.shop=()=>{if(window.bnShop)window.bnShop();else closeUI()};
})();
