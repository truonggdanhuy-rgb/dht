/* ===================================================================================
   NEWITEMS3.JS — Đồ mới:
   • 🍄 Mascot Nấm pháp sư (Nam / Nữ) — SETS (mascot:'mush', bn:'m'|'f'), bán ở TIỆM CHÚ HỀ (circus.js → CL_ITEMS):
       cần ĐỦ 1000 Xu + 800 Xu quái vật + 5 Kim cương.  (v2: vẽ lại — mũ pháp sư cao cong, quả cầu cam phát sáng ở chóp,
       nấm nhỏ bay lên quanh đầu, KHÔNG che mặt nên dùng được biểu cảm.)
   • 🪄 Gậy Nấm pháp sư — ACCS (t:'hold', k:'mushstaff'), 💎5, bán ở Shop kim cương (mục Phụ kiện)
   Set được thêm vào CUỐI mảng SETS bằng registerMushSets() (gọi ở cuối index.html).  File này chỉ chứa HÀM VẼ + khai báo set.
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,abs=Math.abs,rnd=Math.round,flr=Math.floor;

// ---------- tiện ích ----------
function star(R,x,y,a,rgb,big){
 x=rnd(x);y=rnd(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.75){R(c(a*.6),x-2,y,1,1);R(c(a*.6),x+2,y,1,1);R(c(a*.6),x,y-2,1,1);R(c(a*.6),x,y+2,1,1);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y,1,1)}}

// ===================================================================================
//  🍄 MASCOT NẤM PHÁP SƯ (v2) — vẽ lại: mũ PHÁP SƯ cao cong mềm, đỉnh có QUẢ CẦU CAM PHÁT SÁNG,
//  nấm nhỏ bay lên quanh đầu. KHÔNG che mặt (mắt/miệng/biểu cảm do game vẽ: faceDef/faceFx).
//  • Mũ & viền được dựng bằng công thức đường cong (không còn tam giác): thân nón thon cong ra sau, vành elip,
//    viền tối tự bao quanh hình, đốm nấm kem rải theo đường cong. Mũ cao vượt khung 20x31 → khai báo wide:1.
//  • Bảng màu ngay bên dưới (PAL). Chỉnh độ cao mũ: HAT_TOP; độ cong: BEND.
// ===================================================================================
const HAT_TOP=-9,BEND=3.4;                       // HAT_TOP = hàng của chóp nón (quả cầu nằm ngay trên đó)
const OL='#6e1d14',RD='#e24e33',RDL='#f77c58',RDH='#ffaa84',RDD='#b8382a',
 BRM='#f7b062',BRD='#d9772e',
 SP='#fff0b8',SPL='#fffbe0',SPD='#f2c35e',
 HR='#f4f4fb',HRS='#cfd0e6',HRD='#a9abd0',
 SK='#f1c08a',SKS='#d99e6a',
 CRM='#fff3d6',CRMH='#fffbea',CRMD='#e8cf9c',CRMX='#c9a96a',
 GOLD='#ffd45a',GOLDL='#fff0a0',GOLDD='#d99a2b',
 BRN='#8a5a34',BRND='#5e3a20',
 ORG='#ff8a1f',ORGL='#ffc44a',ORGW='#fff2a8',ORGD='#e0630f';
const rg=(h,a)=>{const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a.toFixed(2)+')'};

// ---- dựng mũ: trả về {cells:Map, outline:Set, orbX, orbY}  (hệ toạ độ "nhìn sang phải"; view: f=trước, b=sau, s=ngang) ----
function buildHat(view,sway){
 const G=new Map(),P=(x,y,c)=>G.set(x+'|'+y,c),side=view=='s',back=view=='b';
 const BX=side?9:10,BY=4,yb=BY-1,yt=HAT_TOP,H=yb-yt;
 const dirn=side||back?-1:1;
 const bend=s=>dirn*(BEND*Math.pow(s,2.1)+(s>.72?2.4*Math.pow((s-.72)/.28,2):0))+(sway||0)*s*s;
 // --- vành: elip 4 hàng (mặt trên đỏ sáng → đáy cam có răng cưa) ---
 const rx=side?7:8.6;
 for(let dy=-1;dy<=1;dy++){
  const yy=dy/1.9,hw=rx*Math.sqrt(Math.max(0,1-yy*yy)),x0=Math.round(BX-hw),x1=Math.round(BX+hw);
  for(let x=x0;x<x1;x++){
   let c=dy<0?RDL:dy==0?RD:BRM;
   if(dy==1&&((x-x0)&1))c=BRD;
   if(dy==0&&x>=x1-2)c=RDD;
   P(x,BY+dy,c)}}
 // --- thân nón: nửa rộng thu dần theo đường cong lõm, tâm cong ra sau ---
 const wb=side?4.8:5.6,wt=.95,cone=[];
 for(let y=yt;y<=yb;y++){
  const s=(yb-y)/H,hw=wt+(wb-wt)*Math.pow(1-s,1.45),cxx=BX+bend(s),x0=Math.round(cxx-hw),x1=Math.round(cxx+hw),w=x1-x0;
  cone.push({y,s,hw,cxx,x0,x1});
  for(let x=x0;x<x1;x++){
   const dl=x-x0,dr=x1-1-x;let c=RD;
   if(dl==0&&w>2)c=RDL;
      if(dr<=1&&w>4)c=RDD;
   if(dr==0&&w>2)c=RDD;
   P(x,y,c)}}
 // --- bóng của nón đổ xuống vành ---
 {const b=cone[cone.length-1];for(let x=b.x0+1;x<b.x1-1;x++)P(x,BY,RDD)}
 // --- đốm nấm kem rải theo đường cong ---
 const spots=side?[[.16,-.2,1.8,1.2],[.4,.3,1.5,1.1],[.64,-.1,1.1,.9]]
                 :[[.14,-.4,1.9,1.3],[.38,.35,2.0,1.4],[.62,-.15,1.3,1.1],[.82,.1,.8,.8]];
 const sp=new Set();
 spots.forEach(([s,f,a,b])=>{const row=cone[Math.round((1-s)*H)];if(!row)return;const cx=row.cxx+f*row.hw,cy=row.y;
  for(let y=Math.floor(cy-b);y<=Math.ceil(cy+b);y++){const rw=cone[y-yt];if(!rw)continue;
   for(let x=Math.floor(cx-a);x<=Math.ceil(cx+a);x++){
    if(((x-cx)/a)**2+((y-cy)/b)**2>1.05)continue;if(x<rw.x0+1||x>=rw.x1-1)continue;sp.add(x+'|'+y)}}});
 sp.forEach(k=>{const[x,y]=k.split('|').map(Number);P(x,y,!sp.has(x+'|'+(y-1))?SPL:!sp.has(x+'|'+(y+1))?SPD:SP)});
 // --- dải băng kem + khoá vàng quanh chân nón ---
 for(let y=yb-1;y<=yb;y++){const rw=cone[y-yt];for(let x=rw.x0;x<rw.x1;x++)P(x,y,y==yb-1?CRM:CRMD);P(rw.x0,y,CRMD);}
 {const rw=cone[yb-yt];P(rw.x0+1,yb-1,CRMH);
  if(!back){const bx=side?BX+4:BX;P(bx-1,yb-1,GOLD);P(bx,yb-1,GOLDL);P(bx+1,yb-1,GOLD);P(bx-1,yb,GOLDD);P(bx,yb,GOLDD);P(bx+1,yb,GOLDD)}}
 // --- đế vàng nhỏ đỡ quả cầu ---
 const top=cone[0];P(top.x0,yt,GOLD);P(top.x1-1,yt,GOLDD);
 // --- viền tối bao quanh toàn bộ hình ---
 const out=new Set();
 G.forEach((c,k)=>{const[x,y]=k.split('|').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const q=(x+dx)+'|'+(y+dy);if(!G.has(q))out.add(q)})});
 return{cells:G,outline:out,orbX:Math.round(top.cxx),orbY:yt-2};
}
const hatDraw=(Fm,Hh)=>{Hh.outline.forEach(k=>{const[x,y]=k.split('|').map(Number);Fm(OL,x,y,1,1)});
 Hh.cells.forEach((c,k)=>{const[x,y]=k.split('|').map(Number);Fm(c,x,y,1,1)})};

function drawMush(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000,fem=S.bn=='f',mv=!!o.mv;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sx=side?lg*(Rt?2:-2):0;
 const sway=mv?Math.round(sin(t*9)*1):Math.round(sin(t*1.8)*.8);
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---- chân: quần nâu + bốt nâu gập mép kem ----
 const leg=(x,lift)=>{r(S.pt,x,24,4,3-lift);r(BRND,x+3,24,1,3-lift);
  r(CRM,x,27-lift,4,1);r(CRMD,x+3,27-lift,1,1);r(S.shoe,x,28-lift,4,1);r(BRND,x,29-lift,4,1);r('#a8703a',x,28-lift,1,1);
  if(side){const tx=Rt?x+4:x-1;r(S.shoe,tx,28-lift,1,2);r(BRND,tx,29-lift,1,1)}};
 if(rd){}
 else if(sit)leg(5,0),leg(11,0);
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 const mantleRows=[[14,4,16],[15,3,17],[16,3,17],[17,4,16]];
 if(!side){
  // ---------- thân: áo choàng kem + khăn choàng vai đỏ có đốm ----------
  u(CRM,5,15,10,9);u(CRMH,5,16,1,7);u(CRMD,13,15,2,9);u(CRMX,14,17,1,6);
  if(fem){
   u(CRM,5,22,10,1);u(CRM,4,23,12,1);u(CRM,3,24,14,2);u(CRMH,3,24,1,2);u(CRMD,14,23,1,1);u(CRMD,15,24,2,2);
   u(RD,3,26,14,1);u(RDD,14,26,3,1);u(RDL,3,26,1,1);for(let x=5;x<16;x+=3)u(SP,x,26,1,1);
  }else{u(RD,5,23,10,1);u(RDD,13,23,2,1);u(RDL,5,23,1,1);for(let x=7;x<14;x+=3)u(SP,x,23,1,1)}
  u(BRN,5,21,10,1);u(BRND,5,22,10,1);
  if(!back){u(GOLD,9,21,2,2);u(GOLDL,9,21,1,1);u(GOLDD,10,22,1,1)}
  mantleRows.forEach(([y,a,b])=>{u(RD,a,y,b-a,1);u(RDL,a,y,1,1);u(RDD,b-1,y,1,1)});
  u(RDD,4,17,12,1);u(RDL,4,17,1,1);for(let x=5;x<15;x+=2)u(RDD,x,18,1,1);
  if(!back){u(CRM,8,14,4,1);u(CRMD,8,15,4,1);u(GOLD,9,16,2,1);u(GOLDL,9,16,1,1);u(GOLDD,9,17,2,1);
   [[5,15],[14,15],[6,16],[13,16],[4,16]].forEach(d=>u(SP,d[0],d[1],1,1));u(SPD,15,16,1,1)}
  else{[[6,15],[13,15],[9,16],[5,16],[15,16]].forEach(d=>u(SP,d[0],d[1],1,1))}
  // ---------- tay áo đỏ, cổ tay kem ----------
  const arm=(x,ay)=>{u(RD,x,15+ay,3,6);u(RDL,x,15+ay,1,6);u(RDD,x+2,15+ay,1,6);u(SP,x+1,17+ay,1,1);u(CRM,x-1,21+ay,5,1);u(CRMD,x+3,21+ay,1,1);u(SK,x,22+ay,3,2);u(SKS,x+2,22+ay,1,2)};
  arm(1,lg);arm(16,-lg);
  // ---------- đầu + tóc trắng ----------
  if(back){
   // khối tóc phía sau: tròn ở đầu, thu dần xuống gáy (nữ dài hơn, đuôi tóc lượn)
   const BH=[[6,3,17],[7,3,17],[8,3,17],[9,3,17],[10,3,17],[11,4,16],[12,4,16],[13,5,15],[14,6,14]];
   const BF=[[14,4,16],[15,4,16],[16,4,16],[17,5,15],[18,5,15],[19,6,14],[20,7,13]];
   (fem?BH.slice(0,7).concat(BF):BH).forEach(([y,a,b],i)=>{u(HR,a,y,b-a,1);u(HRD,a,y,1,1);u(HRD,b-1,y,1,1);if(i%4==2){u(HRS,a+3,y,1,2);u(HRS,b-4,y,1,2)}});
   {const l=fem?BF[BF.length-1]:BH[BH.length-1];u(HRD,l[1],l[0],l[2]-l[1],1)}
   u(HRS,10,9,1,fem?9:4);
  }else{
   fillRows(SK,MSTD.HF);u(SKS,6,13,8,1);u(SKS,15,11,1,2);
   // mái tóc rẽ ngôi: cong ôm hai bên trán (không tam giác)
   u(HR,4,6,12,2);u(HRS,6,6,3,1);u(HRS,11,6,2,1);u(HRD,4,7,12,1);
   u(HR,4,8,5,1);u(HR,11,8,5,1);u(HR,4,9,3,1);u(HR,13,9,3,1);u(HR,4,10,2,1);u(HR,14,10,2,1);
   u(HRS,5,8,2,1);u(HRS,12,8,2,1);u(HRD,8,8,1,1);u(HRD,11,8,1,1);
   // tóc mai hai bên má
   const L=fem?10:4;
   for(let i=0;i<L;i++){const fl=fem&&i>=3?1:0,w=i>=L-1?1:2+fl,y=10+i;
    u(i%3==1?HRS:HR,4-fl-(i<1?0:0),y,w,1);u(i%3==1?HRS:HR,16-w+fl,y,w,1)}
   u(HRD,3,10+L-2,1,1);u(HRD,16,10+L-2,1,1);
   if(fem){u(GOLD,5,8,1,1);u(GOLDD,5,9,1,1)}
   if(o.e>0)faceFx(u,o.e,0,0);else faceDef(u,0,0);
  }
  const Hh=buildHat(back?'b':'f',sway);hatDraw(u,Hh);orbFx(u,Hh);
 }else{
  // ---------- nhìn ngang (hướng phải) ----------
  M(CRM,6,15,8,9);M(CRMH,6,16,1,7);M(CRMD,12,15,2,9);
  if(fem){M(CRM,5,22,8,1);M(CRM,4,23,10,1);M(CRM,4,24,10,2);M(CRMD,12,24,2,2);M(RD,4,26,10,1);M(RDD,12,26,2,1);for(let x=6;x<13;x+=3)M(SP,x,26,1,1)}
  else{M(RD,6,23,8,1);M(RDD,12,23,2,1)}
  M(BRN,6,21,8,1);M(BRND,6,22,8,1);M(GOLD,12,21,2,2);M(GOLDD,13,22,1,1);
  [[14,5,14],[15,4,15],[16,4,15],[17,5,14]].forEach(([y,a,b])=>{M(RD,a,y,b-a,1);M(RDL,a,y,1,1);M(RDD,b-1,y,1,1)});
  M(RDD,5,17,9,1);for(let x=6;x<13;x+=2)M(RDD,x,18,1,1);
  [[5,15],[8,16],[11,15],[6,17]].forEach(d=>M(SP,d[0],d[1],1,1));
  M(CRM,10,14,2,1);M(CRMD,10,15,2,1);
  // mặt trước, rồi khối tóc phía sau (đung đưa) đè lên phần sau đầu
  fillRows(SK,MSTD.HS,1);M(SKS,6,13,6,1);M(SKS,14,11,1,2);
  const SB=[[6,2,12],[7,2,12],[8,2,10],[9,2,9],[10,2,8],[11,2,8],[12,3,8],[13,3,7]],SF=[[14,3,8],[15,3,8],[16,3,8],[17,4,8],[18,4,7],[19,5,7]];
  (fem?SB.concat(SF):SB).forEach(([y,a,b],i)=>{const sh=y>=10?Math.round(sin(t*(mv?6:1.7)+i*.35)*(mv?1.4:.6)):0;
   M(i%3==1?HRS:HR,a+sh,y,b-a,1);M(HRD,a+sh,y,1,1)});
  // mái tóc ôm trán
  M(HR,3,6,10,2);M(HRS,5,6,3,1);M(HRD,3,7,10,1);M(HR,3,8,7,1);M(HRS,4,8,2,1);M(HR,3,9,5,1);
  if(fem){M(GOLD,7,8,1,1)}
  if(o.e>0)faceFx(u,o.e,1,Rt);else faceDef(u,1,Rt);
  // tay áo
  const am=Math.round(lg);M(RD,8+am,15,3,6);M(RDL,8+am,15,1,6);M(RDD,10+am,15,1,6);M(SP,9+am,17,1,1);M(CRM,7+am,21,5,1);M(SK,8+am,22,3,2);M(SKS,10+am,22,1,2);
  const Hh=buildHat('s',sway);hatDraw(M,Hh);orbFx(M,Hh);
 }
 flyMush(u,t);
}

// ---- quả cầu cam phát sáng ở chóp mũ (nhấp nháy) + vài sao nhỏ ----
function orbFx(Fm,Hh){
 const t=performance.now()/1000,pul=.5+.5*sin(t*3.1),ox=Hh.orbX,oy=Hh.orbY;
 [[5,.06],[4,.1],[3,.18]].forEach(([rr,a])=>{for(let dy=-rr;dy<=rr;dy++){const hw=Math.round(Math.sqrt(Math.max(0,rr*rr-dy*dy)));if(hw>0)Fm(rg(ORG,a*(.65+.7*pul)).replace('rgba(255,138,31','rgba(255,150,40'),ox-hw,oy+dy,hw*2+1,1)}});
 Fm(OL,ox-2,oy-1,1,3);Fm(OL,ox+2,oy-1,1,3);Fm(OL,ox-1,oy+2,3,1);   // viền mảnh hai bên + dưới cầu (đỉnh để trống cho khỏi chạm dòng tên)
 Fm(ORG,ox-1,oy-1,3,3);Fm(ORGL,ox-1,oy-1,2,2);Fm(ORGW,ox-1,oy-1,1,1);Fm(ORGD,ox+1,oy+1,1,1);
 const a=sin(t*3.4);if(a>.3)star(Fm,ox+3,oy-3,a,'255,226,150',true);
 const b=sin(t*2.6+2);if(b>.35)star(Fm,ox-4,oy+3,b*.9,'255,214,130',false);
}
// ---- nấm nhỏ bay lên quanh đầu ----
function flyMush(u,t){
 const mush=(x,y,a,big)=>{if(a<=.05)return;const A=Math.min(1,a),c=h=>rg(h,A);
  if(big){u(c(OL),x+1,y,3,1);u(c(OL),x,y+1,1,1);u(c(OL),x+4,y+1,1,1);u(c(RD),x+1,y+1,3,1);u(c(RDL),x+1,y+1,1,1);u(c(SP),x+2,y+1,1,1);u(c(RDD),x+3,y+1,1,1);
   u(c(BRD),x,y+2,1,1);u(c(BRM),x+1,y+2,3,1);u(c(BRD),x+4,y+2,1,1);u(c(CRM),x+2,y+3,1,1);u(c(CRMD),x+2,y+4,1,1)}
  else{u(c(RD),x+1,y,1,1);u(c(RD),x,y+1,3,1);u(c(SP),x+1,y+1,1,1);u(c(CRM),x+1,y+2,1,1);u(c(CRMD),x+1,y+3,1,1)}};
 for(let i=0;i<5;i++){
  const L=3.6,ph=(t/L+i/5)%1,a=sin(ph*PI);if(a<.14)continue;
  const dir=i%2?1:-1,x=rnd(9.5+dir*(9.2+ph*2.4+(i>>1)*.7)+sin(ph*6+i*1.7)*1.3),y=rnd(3-ph*16-(i>>1)*.6);
  mush(x,y,Math.min(1,a*1.5),i%2==0);
 }
}
window.drawMascotMush=drawMush;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.mush=drawMush;

// ---- khai báo 2 set vào CUỐI mảng SETS (gọi ở cuối index.html, sau mọi file khác → không làm lệch số thứ tự đồ đã mua) ----
window.registerMushSets=()=>{
 if(typeof SETS==='undefined')return;
 const base={mascot:'mush',wide:1,ach:1,sh:'#e24e33',pt:'#7a4a2c',rpt:'#7a4a2c',shoe:'#6a3f22',scarf:'#fff3d6'};
 if(!SETS.some(s=>s.k=='mushm'))SETS.push(Object.assign({n:'Nấm pháp sư (Nam)',k:'mushm',bn:'m',ds:'Mũ pháp sư nấm đỏ đốm kem, đỉnh có quả cầu cam phát sáng; nấm nhỏ bay quanh đầu. Tóc trắng ngắn, áo choàng kem, khăn choàng đỏ. Không che mặt.'},base));
 if(!SETS.some(s=>s.k=='mushf'))SETS.push(Object.assign({n:'Nấm pháp sư (Nữ)',k:'mushf',bn:'f',ds:'Mũ pháp sư nấm đỏ đốm kem, đỉnh có quả cầu cam phát sáng; nấm nhỏ bay quanh đầu. Tóc trắng dài, váy kem viền đỏ, khăn choàng đỏ. Không che mặt.'},base));
};


// ===================================================================================
//  🪄 GẬY NẤM PHÁP SƯ — gậy gỗ dài, mảnh (1px + bóng), hơi nghiêng, vặn xoắn nhẹ;
//  đầu gậy UỐN CONG thành móc, treo 1 vầng sáng lấp lánh (ánh sáng đập nhịp + sao nhỏ).
//  (t:'hold' trong ACCS — art(P): P.R(màu,dx,y,w,h) vẽ tương đối bàn tay; P.hy = y bàn tay)
// ===================================================================================
function accMushStaff(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy;
 const W1='#a8703a',W2='#6e4420',WL='#d09a5e',WK='#4a2c14';
 const top=hy-27,bot=hy+8;
 // cán gậy: vặn xoắn nhẹ (cứ 4px đổi bên sáng/tối), vài mấu gỗ
 for(let y=bot;y>=top;y--){const i=bot-y,tw=(i>>2)%2;
  R(tw?W2:W1,0,y,1,1);R(tw?W1:W2,1,y,1,1);
  if(i%11==5){R(WK,-1,y,1,1)}}
 R(WL,0,top+3,1,1);R(WL,0,top+12,1,1);R(WK,0,bot+1,2,1);
 // đầu gậy uốn cong thành móc sang bên phải rồi rủ xuống
 const hook=[[0,top-1],[0,top-2],[1,top-3],[2,top-4],[3,top-4],[4,top-3],[5,top-2],[5,top-1]];
 hook.forEach(([x,y],i)=>{R(W1,x,y,1,1);if(i>0&&i<6)R(WL,x,y,1,1);R(W2,x+(i<2?1:0),y+(i>=2&&i<=5?1:0),1,1)});
 R('#d9a441',5,top,1,1);R('#ffe08a',5,top,1,1);R('#fff3b0',5,top-1,1,1);   // chấm vàng cuối móc
 // sợi xích mảnh + vầng sáng treo
 const sw=rnd(sin(t*2.2)*.8),lx=5+sw,ly=top+2;
 R('#e8dcc0',5,top+1,1,1);R('#d9c9a0',lx,ly,1,1);
 // quầng sáng đập nhịp (nhiều lớp mờ dần ra ngoài)
 const pul=.5+.5*sin(t*3.1),gx=lx,gy=ly+4;
 for(let rr=5;rr>=1;rr--){const a=(.05+.05*(6-rr)+.08*pul)*(rr==1?1.6:1);
  for(let dy=-rr;dy<=rr;dy++){const hw=rnd(Math.sqrt(Math.max(0,rr*rr-dy*dy)));if(hw>0)R('rgba(255,236,140,'+Math.min(.55,a).toFixed(2)+')',gx-hw,gy+dy,hw*2+1,1)}}
 // lõi sáng (viên ngọc nhỏ)
 R('#ffd94a',gx-1,gy-1,3,3);R('#fff6c0',gx,gy-1,1,2);R('#ffffff',gx,gy-1,1,1);R('#f2b82a',gx-1,gy+1,3,1);
 R('#ffe9a0',gx-2,gy,1,1);R('#ffe9a0',gx+2,gy,1,1);R('#ffe9a0',gx,gy-2,1,1);R('#ffe9a0',gx,gy+2,1,1);
 // sao lấp lánh quanh vầng sáng
 [[-4,-3,0],[4,-2,1.7],[-3,4,3.1],[5,3,4.4],[0,-5,2.3],[-6,0,5.2]].forEach(s=>{
  const a=sin(t*3.4+s[2]);if(a>.3)star(R,gx+s[0],gy+s[1],a,'255,246,190',true)});
 // vài hạt sáng rơi chậm xuống
 for(let i=0;i<3;i++){const p=(t*.6+i/3)%1,a=sin(p*PI);if(a>.3)R('rgba(255,240,170,'+(a*.8).toFixed(2)+')',gx-3+i*3+rnd(sin(t*2+i)*1),gy+3+rnd(p*8),1,1)}
}
window.accMushStaff=accMushStaff;
})();
