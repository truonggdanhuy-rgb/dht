/* ============================================================
   CANCA.JS — 🎣 CẦN CÂU (map Biển) — thay cho khung câu cũ
   PHẢI nạp SAU fishing.js và sau mọi file có ACCS.push (để cuối danh sách <script>).

   1) Cần câu = phụ kiện cầm tay (ACCS, t:'hold'). Túi › Biển có mục "Cần câu tre": bấm để cầm / bấm lại để cất.
      Cầm cần thì phụ kiện cầm tay khác tự mất (cùng 1 ô), Cánh/Balo giữ nguyên. Cất cần thì món cũ quay lại (nếu còn).
   2) Lên thuyền ra biển -> hiện NÚT TRÒN bên phải: QUĂNG / KÉO (phím E cũng được).
      Quăng: cần vụt ra trước -> phao bay ra nằm trên mặt nước trước mặt thuyền.
      Bóng cá bơi lại -> rỉa phao (nước gợn sóng) -> cắn câu (phao chìm, hiện ❗) -> bấm KÉO NHANH.
      Cá hiếm rỉa nhanh hơn, cửa sổ kéo ngắn hơn (chỉnh ở bảng FT). Kéo sớm quá = thu cần, cá sợ bơi mất.
      Cơ chế còn lại (độ hiếm, vùng nước tối, cần hư, rát da, quà) dùng lại của fishing.js (MQ.core).
   3) Thêm cần mới: thêm 1 dòng vào bảng RODS (màu cần, màu phao). Mỗi cần có phao riêng.
   ============================================================ */
(function(){
'use strict';
if(window.RODX||typeof ACCS==='undefined'||!window.MQ||!MQ.core||typeof SETS==='undefined')return;
const C=MQ.core,RAR=C.RAR;
window.RODX={};                       // sea-map.js thấy RODX thì bỏ cần cắm trang trí bên mạn thuyền
const $=id=>document.getElementById(id);

// ---------- BẢNG CẦN CÂU (mỗi cần có phao riêng) ----------
const ROD_ID=200;                     // idx trong Túi › Biển: 200 + số thứ tự cần
const RODS=[
 {k:'rod_tre',n:'Cần câu tre',len:29,fl:{a:'#2fae6a',b:'#4fd488',c:'#9ff0c0'}}   // phao xanh lá
];
// ---------- ĐỘ KHÓ THEO ĐỘ HIẾM (th / hi / cc): per = giây giữa 2 lần rỉa • win = giây được phép kéo sau khi cắn ----------
const FT=[{per:1.0,win:1.25},{per:.78,win:.85},{per:.58,win:.6}];
const DIST=[60,50,40];                // khoảng cách phao quăng ra trước thuyền (thử lần lượt nếu vướng bờ)
const TH_FRONT=.28,TH_SIDE=.5;        // độ nghiêng cần khi cầm: nhìn trước/sau (rad) • nhìn ngang (chỉa ra trước)

for(const r of RODS)if(!ACCS.some(a=>a.k===r.k))ACCS.push({n:r.n,k:r.k,t:'hold',rod:RODS.indexOf(r),art:P=>landArt(P,RODS.indexOf(r))});
const rodOf=ix=>(ix>=0&&ACCS[ix]&&ACCS[ix].rod!=null)?ACCS[ix].rod:-1;
const rodIx=i=>ACCS.findIndex(a=>a.k===RODS[i].k);
const eq=()=>{const a=ST.av&&ST.av.a;return rodOf(a)};      // cần đang cầm (-1 = không)
const rr=(a,b)=>a+Math.random()*(b-a),ease=u=>1-Math.pow(1-Math.min(1,Math.max(0,u)),3);

// ============================================================
//  VẼ CẦN: to ở cán, mỏng dần về ngọn, đốt tre. R(màu,dx,y,w,h) tính từ bàn tay; hy = độ cao bàn tay
//  th = góc nghiêng (rad, + = chỉa ra ngoài/ra trước) • bd = độ cong ngọn (px, + = võng xuống)
//  trả về vị trí ngọn [dx,y] theo hệ R
// ============================================================
function rodDraw(R,hy,o){
 const L=RODS[o.i||0].len,th=o.th,sn=Math.sin(th),cs=Math.cos(th),bd=o.bd||0;
 const pos=k=>{const u=Math.max(0,k)/L,b=bd*u*u;return[sn*k+b*cs,-cs*k+b*sn]};
 for(let k=-5;k<=L;k+=.5){
  const[x,y]=pos(k),xi=Math.round(x),yy=hy+Math.round(y);
  if(k<0){R('#6b4423',xi,yy,1,1);R('#4e3016',xi+1,yy,1,1)}                                   // đuôi cán
  else if(k<9){const w=Math.floor(k/2)%2;R(w?'#b07a40':'#8f5e2e',xi,yy,1,1);R(w?'#7a4e24':'#5e3a1a',xi+1,yy,1,1)}   // cán quấn dây
  else if(Math.abs(k-13)<.3||Math.abs(k-20)<.3||Math.abs(k-26)<.3){R('#7a5a22',xi,yy,k<19?2:1,1)}   // đốt tre
  else if(k<19){R('#ecd98a',xi,yy,1,1);R('#c9a84a',xi+1,yy,1,1)}                              // thân tre (2px)
  else R(k>L-5?'#b8943c':'#dcc468',xi,yy,1,1)                                                  // ngọn mảnh (1px)
 }
 const[hx,hh]=pos(2);const X=Math.round(hx)-1,Y=hy+Math.round(hh)-1;                           // bàn tay nắm cán
 R('#f1c08a',X,Y,3,2);R('#d99e6a',X,Y+2,3,1);
 const[tx,ty]=pos(L);R('#8a6a2a',Math.round(tx),hy+Math.round(ty)-1,1,1);
 return[Math.round(tx),hy+Math.round(ty)]}
// cầm khi đi bộ ngoài đất liền (hàm art của ACCS) — cần chỉa nhẹ ra ngoài, không che mặt/tóc
function landArt(P,i){
 const side=P.side,R=side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R;
 rodDraw(R,P.hy,{i,th:side?TH_SIDE:TH_FRONT,bd:.6*Math.sin(P.t*1.8)})}

// ============================================================
//  PHAO + DÂY + SÓNG (vẽ trực tiếp lên cx, toạ độ thế giới)
// ============================================================
const FROWS=[[-7,0,1,'t'],[-6,0,1,'t'],[-5,-1,3,'a'],[-4,-2,5,'b'],[-3,-2,5,'a'],[-2,-2,5,'w'],[-1,-1,3,'g'],[0,0,1,'g']];
function drawFloat(g,i,x,y,dip,air){   // y = mặt nước; dip = phao chìm xuống (px); air = đang bay trên không
 const f=RODS[i].fl,X=Math.round(x),W=Math.round(y),fy=Math.round(y-(air||0)+dip);
 if(!air){g.fillStyle='rgba(15,70,110,.22)';g.fillRect(X-3,W,7,1);g.fillStyle='rgba(15,70,110,.14)';g.fillRect(X-2,W+1,5,1)}
 for(const[dy,xo,w,c]of FROWS){const row=fy+dy;if(!air&&row>W)continue;
  g.fillStyle=c=='t'?'#fff3c0':c=='a'?f.a:c=='b'?f.b:c=='w'?'#ffffff':'#d8e8e4';g.fillRect(X+xo,row,w,1)}
 g.fillStyle=f.c;g.fillRect(X-1,fy-4,1,1)}
const ring=(x,y,r,a)=>{cx.strokeStyle='rgba(255,255,255,'+Math.max(0,a).toFixed(2)+')';cx.lineWidth=1;cx.beginPath();cx.ellipse(Math.round(x),Math.round(y),r,Math.max(1,r*.38),0,0,6.283);cx.stroke()};
function thinLine(x0,y0,x1,y1,sag){cx.fillStyle='rgba(255,255,255,.82)';
 const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1)|0;
 for(let i=0;i<=n;i++){const u=i/n;cx.fillRect(Math.round(x0+(x1-x0)*u),Math.round(y0+(y1-y0)*u+sag*Math.sin(Math.PI*u)),1,1)}}

// ============================================================
//  TRẠNG THÁI CÂU
//  idle -> cast (vụt cần, phao bay) -> wait -> shadow (bóng cá lại gần) -> nib (rỉa) -> bite (cắn! bấm KÉO) -> reel -> idle
// ============================================================
const S={ph:'idle',t:0,fx:0,fy:0,dir:1,mon:null,rar:0,sh:null,dip:0,rip:[],nb:0,wait:0,tip:null,rel:null,rx:0,ry:0,res:null,last:performance.now(),rt:0};
const reset=()=>{S.ph='idle';S.t=0;S.sh=null;S.rip=[];S.dip=0;S.res=null;S.tip=null};
const tipNow=()=>S.tip||{x:Pl.x+S.dir*16,y:Pl.y-30};
function floatPos(){   // [x,y,air]
 const p=S.ph,tp=tipNow();
 if(p=='cast'){
  if(S.t<.26)return[tp.x,tp.y,0,1];
  const u=Math.min(1,(S.t-.26)/.5),e=ease(u),r=S.rel||tp;
  return[r.x+(S.fx-r.x)*e,r.y+(S.fy-r.y)*e,Math.sin(Math.PI*u)*20*(1-u*.3),0]}
 if(p=='reel'){const u=Math.min(1,S.t/.45),e=ease(u);return[S.rx+(tp.x-S.rx)*e,S.ry+(tp.y-S.ry)*e,0,1]}
 return[S.fx,S.fy,0,0]}
function hint(force){const n=performance.now();if(!force&&n-S.rt<4000)return;S.rt=n;toast('🎣 Vào Túi › Biển, bấm "Cần câu tre" để cầm cần rồi mới câu được nhé')}

function pose(){   // góc vung cần + độ cong ngọn (chỉ nhân vật của mình)
 let dth=0,bd=.5*Math.sin(performance.now()/550);const p=S.ph,t=S.t;
 if(p=='cast'){
  if(t<.14)dth=-.75*(t/.14);
  else if(t<.28){const u=(t-.14)/.14;dth=-.75+2*u;bd=-2.5*Math.sin(Math.PI*u)}   // vụt về phía trước
  else if(t<.42)dth=1.25;
  else dth=1.25*(1-ease((t-.42)/.34))}                                           // rồi trở về tư thế cầm
 else if(p=='nib')bd=.8+S.dip*.6;
 else if(p=='bite')bd=3.2+Math.sin(performance.now()/25)*.9;
 else if(p=='reel')bd=-2*(1-Math.min(1,S.t/.45));
 return{dth,bd}}

// vẽ cần cho nhân vật ngồi / đứng trên thuyền (drawAv không vẽ phụ kiện cầm tay khi ngồi) + ghi lại vị trí ngọn
function seaDraw(rx,ry,dir,stand,i){
 const fl=dir<0,ox=rx-10,oy=ry-(stand?32:31),h0=10;
 const R=(c,dx,y,w,h)=>{cx.fillStyle=c;cx.fillRect(fl?ox+h0-(dx+2)-w+1:ox+h0+dx+2,oy+y,w,h)};
 const p=pose(),tp=rodDraw(R,22,{i,th:TH_SIDE+p.dth,bd:p.bd});
 S.tip={x:fl?ox+h0-(tp[0]+2):ox+h0+tp[0]+2,y:oy+tp[1]}}
{const br0=window.cvBoatRider;
 if(typeof br0==='function')window.cvBoatRider=function(set,hair,e,acc,dir,stand){
  const f=br0.apply(this,arguments),i=rodOf(acc);if(i<0)return f;
  return(rx,ry)=>{f(rx,ry);seaDraw(rx,ry,dir>0?1:-1,stand,i)}}}

// ============================================================
//  HÀNH ĐỘNG
// ============================================================
function cast(){
 if(C.burning())return toast('☀️ Da đang rát, chưa câu được');
 if(Pl.mv||(typeof goal!=='undefined'&&goal))return toast('⛵ Dừng thuyền lại rồi hãy quăng cần nhé');
 const dir=CV.bdir||1,sol=window.cvBoatSolid;let fx=0,fy=0,ok=false;
 for(const d of DIST){const x=Pl.x+dir*d,y=Pl.y+5;if(!(sol&&(sol(x,y)||sol(x+dir*10,y)))){fx=x;fy=y;ok=true;break}}
 if(!ok)return toast('🏝️ Phía trước sát bờ rồi, lái ra chỗ nước thoáng rồi quăng nhé');
 S.ph='cast';S.t=0;S.fx=fx;S.fy=fy;S.dir=dir;S.sh=null;S.mon=null;S.dip=0;S.rip=[];S.rel=null}
function startReel(msg){
 if(msg)toast(msg);
 const f=floatPos();S.rx=f[0];S.ry=f[1];S.ph='reel';S.t=0;S.dip=0;if(S.sh)S.sh.flee=1}
function pullOK(){
 const m=S.mon;if(!m)return startReel();
 const r=C.award(m),RA=RAR[m.r],ic=m.r==2?'🌟 ':m.r==1?'✨ ':'';
 S.res={mon:m,t:0,x0:S.fx,y0:S.fy};S.sh=null;
 toast('🎉 Câu được '+ic+m.n+' ('+RA.n.toLowerCase()+')!\nĐã vào Túi › Biển • bán '+m.p+' xu quái vật'+(r.bonus?'\n🎁 Quà vùng nước tối đã vào Kho/Túi':'')+(r.broke?'\n🔧 Cần câu bị hư! Sửa tốn '+C.ROD_FIX+' xu quái vật':''));
 startReel();S.rx=S.fx;S.ry=S.fy}
function act(){
 if(!C.atSea())return;
 if(eq()<0)return hint(true);
 const p=S.ph;
 if(C.rodBroken()&&(p=='idle'||p=='reel'))return MQ.repair();
 if(p=='idle'||(p=='reel'&&S.t>.3))return cast();
 if(p=='bite')return pullOK();
 if(p=='wait'||p=='shadow'||p=='nib')return startReel(p=='wait'?'':'💨 Kéo sớm quá, cá sợ bơi mất!')}
RODX.act=act;RODX.S=S;
addEventListener('keydown',e=>{if(e.repeat||!(e.key=='e'||e.key=='E'))return;if(typeof UI!=='undefined'&&UI)return;const t=e.target&&e.target.tagName;if(t=='INPUT'||t=='TEXTAREA')return;act()});

// ============================================================
//  CẬP NHẬT (mỗi khung hình khi đang vẽ thuyền ngoài biển)
// ============================================================
function step(dt){
 S.t+=dt;S.rip.forEach(q=>q.t+=dt);S.rip=S.rip.filter(q=>q.t<1.1);S.dip=Math.max(0,S.dip-dt*14);
 const s=S.sh;
 if(s&&s.flee){s.x-=s.dir*90*dt;s.a=Math.max(0,s.a-dt*1.4);if(s.a<=0)S.sh=null}
 if(S.res){S.res.t+=dt;if(S.res.t>2.4)S.res=null}
 const p=S.ph;
 if(p=='cast'){
  if(S.t>=.26&&!S.rel){S.rel={x:tipNow().x,y:tipNow().y}}
  if(S.t>=.76){S.ph='wait';S.t=0;S.wait=rr(1.2,2);S.rip.push({x:S.fx,y:S.fy,t:0})}}
 else if(p=='wait'){if(S.t>=S.wait)spawn()}
 else if(p=='shadow'&&s){
  const u=ease(S.t/1.5),tx=S.fx-s.dir*(10+(S.rar+1)*5),ty=S.fy+3;s.a=Math.min(1,S.t*2.2);
  s.x=s.fx+(tx-s.fx)*u;s.y=s.fy+(ty-s.fy)*u+Math.sin(S.t*5)*1.2;
  if(S.t>=1.5){S.ph='nib';S.t=0;S.nb=0}}
 else if(p=='nib'&&s){
  const N=RAR[S.rar].nib,per=FT[S.rar].per,u=S.t/per,idx=Math.floor(u),ss=u-idx,rx=[7,12,19][S.rar];
  const far=rx+12,near=rx+3,d=far-(far-near)*Math.pow(Math.sin(Math.PI*Math.min(1,ss)),.7);
  s.x=S.fx-s.dir*d;s.y=S.fy+3+Math.sin(S.t*4)*1.5;
  const tch=ss>.42&&ss<.62;if(tch&&S.nb<=idx){S.nb=idx+1;S.dip=2.5;S.rip.push({x:S.fx,y:S.fy,t:0})}
  if(idx>=N){S.ph='bite';S.t=0;S.dip=3;S.bt=0;try{navigator.vibrate&&navigator.vibrate(35)}catch(e){}}}
 else if(p=='bite'&&s){
  S.dip=Math.min(8,S.dip+dt*30);s.x=S.fx-s.dir*([7,12,19][S.rar]+2)+Math.sin(S.t*30)*1.2;s.y=S.fy+3+Math.sin(S.t*22)*1.2;
  S.bt=(S.bt||0)+dt;if(S.bt>.16){S.bt=0;S.rip.push({x:S.fx,y:S.fy,t:.3})}
  if(S.t>FT[S.rar].win){toast('💨 Chậm quá, cá nhả mồi bơi mất. Quăng lại nhé!');startReel()}}
 else if(p=='reel'&&S.t>=.45){S.ph='idle';S.t=0}}
function spawn(){
 const m=C.rollMon();S.mon=m;S.rar=m.r;const side=Math.random()<.5?-1:1,sx=S.fx+side*56,sy=S.fy+rr(-10,12);
 S.sh={x:sx,y:sy,fx:sx,fy:sy,a:0,dir:-side};S.ph='shadow';S.t=0}

// ============================================================
//  VẼ TRONG THẾ GIỚI (sau khi thuyền + nhân vật đã vẽ)
// ============================================================
function draw(tm){
 const i=Math.max(0,eq()),p=S.ph,s=S.sh;
 if(s&&p!='idle'||s&&s.flee)C.shadow(cx,s.x,s.y,S.rar,s.dir,s.a,tm);          // bóng cá dưới nước
 if(p!='idle'){
  // sóng gợn quanh phao khi có cá lại gần
  if(p=='shadow'||p=='nib'||p=='bite'){const k=p=='bite'?1.5:1;
   ring(S.fx,S.fy,(5+2*Math.sin(tm*5))*k,.34);ring(S.fx,S.fy,(8+3*Math.sin(tm*4+1))*k,.2)}
  for(const q of S.rip)ring(q.x,q.y,2+q.t*14,.8*(1-q.t/1.1));
  // dây (mỏng) + phao
  const f=floatPos(),tp=tipNow(),fy=f[1]-f[2]+(p=='cast'||p=='reel'?0:S.dip);
  const sag=p=='bite'?1.5:p=='cast'||p=='reel'?5:4;
  if(!f[3])thinLine(tp.x,tp.y,f[0],fy-7,sag);
  if(!f[3])drawFloat(cx,i,f[0],f[1],p=='cast'||p=='reel'?0:S.dip,(p=='cast'||p=='reel')?(f[2]||.01):0);
  if(p=='bite'){const bx=Math.round(S.fx+8),by=Math.round(S.fy-20-Math.abs(Math.sin(tm*14))*2);   // ❗ cắn câu
   cx.fillStyle='#fff';cx.fillRect(bx-1,by-1,4,7);cx.fillRect(bx-1,by+7,4,4);cx.fillStyle='#e8402a';cx.fillRect(bx,by,2,5);cx.fillRect(bx,by+8,2,2)}}
 const r=S.res;
 if(r){const m=r.mon,u=Math.min(1,r.t/.8),e=ease(u),tx=Pl.x,ty=Pl.y-36,w=m.r==2?38:m.r==1?30:24,
   x=r.x0+(tx-r.x0)*e,y=r.y0+(ty-r.y0)*e-Math.sin(Math.PI*u)*22+(u>=1?Math.sin(tm*3)*2:0);
  cx.save();if(r.t>2)cx.globalAlpha=Math.max(0,1-(r.t-2)/.4);
  C.put(cx,m.id,x,y,w,tm);
  if(u>=1){cx.font='bold 10px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';cx.lineJoin='round';cx.lineWidth=3;cx.strokeStyle='#14233a';
   const ly=Math.round(y-w*.4-8);cx.strokeText(m.n,Math.round(x),ly);cx.fillStyle=RAR[m.r].col;cx.fillText(m.n,Math.round(x),ly)}
  cx.restore()}}
function world(){
 const n=performance.now();let dt=Math.min(.05,(n-S.last)/1000||0);S.last=n;
 if(typeof UI!=='undefined'&&UI)dt=0;                                           // mở Túi/Shop thì tạm dừng
 if(S.ph=='idle'&&!S.sh&&!S.res)return;
 step(dt);draw(n/1000)}
{const bm0=window.cvBoatMe;
 if(typeof bm0==='function')window.cvBoatMe=function(){S.tip=null;const r=bm0.apply(this,arguments);try{if(typeof MAP!=='undefined'&&MAP=='bn'&&CV.boat)world()}catch(e){console.warn('canca',e)}return r}}

// bấm mặt nước không còn mở khung câu nữa (chỉ nhắc nếu chưa cầm cần)
MQ.open=()=>{if(eq()<0)hint()};

// ============================================================
//  TÚI › BIỂN: mục Cần câu
// ============================================================
function paintRod(g,c,i){
 g.clearRect(0,0,c.width,c.height);
 rodDraw((col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(Math.round(c.width*.24)+x,y,w,h)},Math.round(c.height*.9),{i,th:.85,bd:.6});
 g.fillStyle='rgba(60,150,210,.45)';g.fillRect(Math.round(c.width*.62),Math.round(c.height*.84),Math.round(c.width*.3),2);
 drawFloat(g,i,c.width*.78,c.height*.84,0,0)}
{const it0=MQ.items,pt0=MQ.paint,hd0=MQ.hold;
 MQ.items=()=>{const L=it0();RODS.forEach((r,i)=>L.unshift({n:r.n,idx:ROD_ID+i,sm:eq()==i?'✓ Đang cầm • bấm để cất':'Bấm để cầm'}));return L};
 MQ.paint=(g,ix,c)=>{if(ix>=ROD_ID&&ix<ROD_ID+RODS.length)return paintRod(g,c,ix-ROD_ID);return pt0(g,ix,c)};
 MQ.hold=ix=>{
  if(!(ix>=ROD_ID&&ix<ROD_ID+RODS.length))return hd0(ix);
  const i=ix-ROD_ID,A=ST.av,ai=rodIx(i);if(ai<0)return;
  if(A.a===ai){const pv=ST.rodPrev;A.a=(pv>=0&&pv!==ai&&ST.own&&ST.own.a&&ST.own.a.includes(pv))?pv:-1;ST.rodPrev=-1;toast('🎒 Đã cất '+RODS[i].n)}
  else{ST.rodPrev=A.a;A.a=ai;try{MQ.clear()}catch(e){}toast('🎣 Đang cầm '+RODS[i].n+'\nLên thuyền ra biển, bấm nút tròn bên phải để quăng cần'+(A.m>=0?'\n(Xuống khỏi thú cưỡi thì cần mới hiện)':''))}
  try{save()}catch(e){}try{bagUI()}catch(e){}}}

// ============================================================
//  NÚT TRÒN QUĂNG / KÉO (bên phải màn hình, chỉ hiện khi đang trên thuyền ngoài biển)
// ============================================================
{const st=document.createElement('style');
 st.textContent='#rodbtn{position:fixed;right:max(14px,env(safe-area-inset-right));top:50%;transform:translateY(-50%);width:80px;height:80px;border-radius:50%;z-index:25;display:none;flex-direction:column;align-items:center;justify-content:center;padding:0;font:900 13px Nunito,"Segoe UI",Arial,sans-serif;color:#3a2412;background:radial-gradient(circle at 35% 28%,#fff7cc,#ffd75a 72%);border:3px solid #7a4a26;box-shadow:0 4px 0 #7a4a26,0 7px 12px rgba(0,0,0,.28);touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer;-webkit-tap-highlight-color:transparent}'+
 '#rodbtn .ic{font-size:27px;line-height:1}#rodbtn .tx{margin-top:1px;line-height:1.1;text-align:center}'+
 '#rodbtn:active{margin-top:3px;box-shadow:0 1px 0 #7a4a26}'+
 '#rodbtn.w{background:radial-gradient(circle at 35% 28%,#f0f8ff,#9fd0f0 72%)}'+
 '#rodbtn.b{background:radial-gradient(circle at 35% 28%,#ffd6cc,#ff5a3c 72%);color:#fff;text-shadow:0 1px 0 #8a2010;animation:rodp .26s infinite alternate}'+
 '#rodbtn.off{filter:grayscale(.85);opacity:.72}'+
 '@keyframes rodp{from{transform:translateY(-50%) scale(1)}to{transform:translateY(-50%) scale(1.13)}}';
 document.head.appendChild(st);
 const B=document.createElement('button');B.id='rodbtn';B.type='button';B.innerHTML='<span class="ic">🎣</span><span class="tx">QUĂNG</span>';
 B.onpointerdown=e=>{e.preventDefault();e.stopPropagation();act();upd()};document.body.appendChild(B);
 let lk='',hinted=0;
 function upd(){
  const sea=C.atSea(),show=sea&&!(typeof UI!=='undefined'&&UI);
  if(!sea){if(S.ph!='idle'||S.sh||S.res)reset();hinted=0}
  else{
   if(S.ph!='idle'&&eq()<0){reset();toast('🎒 Bạn đã cất cần câu')}
   else if(S.ph!='idle'&&S.ph!='reel'&&Pl.mv)startReel('⛵ Thuyền di chuyển nên cần được thu về')
   if(!hinted&&eq()<0){hinted=1;hint(true)}}
  B.style.display=show?'flex':'none';if(!show)return;
  const p=S.ph;let cls='',ic='🎣',tx='QUĂNG';
  if(eq()<0){cls='off';tx='Chưa có cần'}
  else if(C.rodBroken()&&(p=='idle'||p=='reel')){ic='🔧';tx='SỬA<br>'+C.ROD_FIX}
  else if(p=='idle'||(p=='reel'&&S.t>.3)){}
  else if(p=='cast'||p=='reel'){cls='w off';tx='...'}
  else if(p=='bite'){cls='b';ic='⚡';tx='KÉO!'}
  else{cls='w';tx='KÉO'}
  const key=cls+ic+tx;if(key!==lk){lk=key;B.className=cls;B.innerHTML='<span class="ic">'+ic+'</span><span class="tx">'+tx+'</span>'}}
 setInterval(upd,90)}
})();
