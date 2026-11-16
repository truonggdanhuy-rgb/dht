/* ===================================================================================
   NEWITEMS3.JS — Đồ mới:
   • 🍄 Mascot Nấm pháp sư (Nam / Nữ) — SETS (mascot:'mush', bn:'m'|'f'), 💎8 / set, bán ở Shop kim cương
       Mũ nấm đỏ khổng lồ có đốm kem, chóp mũ cong, mũ LẤP LÁNH + icon nấm nhỏ bay lên.
       Nam: mắt xanh, tóc trắng ngắn.  Nữ: mắt hồng, tóc trắng dài hơn hai bên.
   • 🪄 Gậy Nấm pháp sư — ACCS (t:'hold', k:'mushstaff'), 💎5, bán ở Shop kim cương (mục Phụ kiện)
       Gậy gỗ dài, mảnh, mỏng; đầu gậy uốn cong, treo 1 vầng sáng lấp lánh.
   Các món được khai báo ở CUỐI mảng SETS / ACCS trong index.html (không làm lệch số thứ tự đồ đã mua).
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: sửa dia:... trong index.html.
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
//  🍄 MASCOT NẤM PHÁP SƯ — khung chuẩn MSTD 20x31 (mũ nấm vượt khung nên khai báo wide:1 trong SETS)
// ===================================================================================
function drawMush(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000,fem=S.bn=='f',mv=!!o.mv;
 const RD='#e24e33',RDL='#f4704f',RDD='#bd3a26',OL='#8f2a1c',RDX='#d0452f',
  BRM='#f7a452',BRL='#ffc27a',BRD='#d9772e',
  SP='#fff0b8',SPL='#fffbe0',SPD='#f2c35e',
  HR='#f4f4fb',HRS='#cfd0e6',HRD='#b0b2d4',
  SK='#d9a07a',SKL='#ecbb98',SKD='#b87e5a',
  JK='#e4573a',JKL='#f67a5c',JKD='#b83a28',
  DR='#ffd45a',DRL='#ffe88a',DRD='#e0a92e',CRM='#fff6e0',
  DK='#4a2438',
  EYC=fem?'#ff6fb5':'#3fc0f0',EYL=fem?'#ffb0da':'#9fe6ff',EYD=fem?'#b02a7a':'#1f86b8';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const sway=mv?rnd(sin(t*9)*1):rnd(sin(t*1.8)*.6);      // chóp mũ đung đưa
 if(!sit&&!rd)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---- chân: quần đỏ cam + bốt đỏ ----
 const leg=(x,lift)=>{r(S.pt,x,24,4,3-lift);r(JKD,x+3,24,1,3-lift);r(S.shoe,x,27-lift,4,3);r(RDX,x,27-lift,4,1);r(SPD,x,27-lift,1,1);r('#5e1a10',x,29-lift,4,1)};
 if(rd){}
 else if(sit)leg(5,0),leg(11,0);
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---- hình học mũ nấm: nón nghiêng, chóp cong ----
 // nhìn thẳng: tâm cx(y), nửa rộng hw(y);  nhìn ngang: nón ngả ra sau (trái)
 const hwF=y=>y>=8?11:y>=6?10.5:y>=4?10:y>=2?9:y>=0?8:y>=-2?6.5:y>=-4?4.5:y>=-6?3:1.8;
 const cxF=y=>10-(8-Math.min(y,8))*.28;
 const hwS=y=>(y>=8?10:y>=6?9.6:y>=4?9:y>=2?8.2:y>=0?7.2:y>=-2?5.8:y>=-4?4.2:y>=-6?2.8:1.8);
 const cxS=y=>8-(8-Math.min(y,8))*.33;
 const hat=(Rf,hw,cx,flat)=>{
  const bound=y=>{const o2=y<-3?sway:0,c=cx(y)+o2,w=hw(y);return[rnd(c-w),rnd(c+w)]};
  for(let y=-7;y<=8;y++){
   const[x0,x1]=bound(y),W=x1-x0;if(W<=0)continue;
   if(y>=7){ // vành nón: sáng ở trên, đậm ở dưới, mép lượn sóng
    Rf(OL,x0-1,y,1,1);Rf(OL,x1,y,1,1);
    Rf(y==7?BRL:BRM,x0,y,W,1);
    if(y==8){Rf(BRD,x0,y,W,1);for(let x=x0+1;x<x1-1;x+=3)Rf(BRM,x,y,2,1)}
    continue}
   Rf(OL,x0-1,y,1,1);Rf(OL,x1,y,1,1);
   Rf(RD,x0,y,W,1);
   if(y>-5&&W>3){Rf(RDL,x0,y,2,1);Rf(RDD,x1-2,y,2,1)}
   else if(W>2){Rf(RDL,x0,y,1,1);Rf(RDD,x1-1,y,1,1)}
   if(y==-7)Rf(OL,x0,y-1,W,1)}
  // vành: viền đen mép dưới
  {const[x0,x1]=bound(8);Rf(OL,x0-1,9,x1-x0+2,1)}
  // chóp cong có vòng xoắn (phía trái-trên)
  const o2=sway,top=bound(-7);
  Rf(RD,top[0]-1+o2,-8,3,1);Rf(RDL,top[0]-1+o2,-8,1,1);
  Rf(OL,top[0]+o2,-9,3,1);Rf(OL,top[0]-2+o2,-8,1,1);
  Rf(RD,top[0]-2+o2,-7,2,2);Rf(OL,top[0]-3+o2,-7,1,3);
  Rf(RD,top[0]-1+o2,-5,2,1);Rf(OL,top[0]-1+o2,-4,3,1);
  Rf(SP,top[0]-1+o2,-6,1,1);                       // lõi vòng xoắn
  // đốm nấm kem (vị trí theo kiểu nhìn)
  const spot=(x,y,w,h)=>{
   const px=(c,xx,yy,ww)=>Rf(c,xx,yy,ww,1);
   if(h==1){px(SP,x,y,w);return}
   if(h==2){px(SP,x+(w>2?1:0),y,w-(w>2?2:0));px(SP,x,y+1,w);px(SPD,x+w-1,y+1,1);px(SPL,x+(w>2?1:0),y,1);return}
   px(SP,x+1,y,w-2);for(let i=1;i<h-1;i++)px(SP,x,y+i,w);px(SP,x+1,y+h-1,w-2);px(SPL,x+1,y,1);px(SPD,x+w-1,y+h-2,1)};
  const dots=flat?[[3,5,3,2],[11,4,3,3],[7,1,2,2],[15,5,2,2],[6,-2,2,2],[9,6,2,1]]:[[3,5,3,2],[10,3,3,3],[6,0,2,2],[13,6,2,2],[4,-2,2,2]];
  dots.forEach(d=>{const yy=d[1],c=cx(yy)+(yy<-3?sway:0);spot(d[0],d[1],d[2],d[3])});
  // chấm nhỏ đậm tạo chiều sâu
  [[8,4],[14,2],[2,3],[11,-1]].forEach(d=>{if(flat||d[0]<14)Rf(RDX,d[0],d[1],1,1)});
  return bound};

 // ---- lấp lánh trên mũ ----
 const glitter=(Rf,bound,spots)=>{
  // vệt sáng quét chéo qua mũ mỗi ~2.8 giây
  const ph=(t%2.8)/2.8,xs=-6+ph*34;
  for(let y=-6;y<=7;y++){const[x0,x1]=bound(y),bx=rnd(xs+(8-y)*.7);
   if(bx>=x0+1&&bx<x1-1){Rf('rgba(255,255,255,.38)',bx,y,2,1);if(bx+2<x1-1)Rf('rgba(255,250,200,.2)',bx+2,y,1,1)}}
  // sao lấp lánh
  spots.forEach((s,i)=>{const a=sin(t*3.2+s[2]);if(a>.25)star(Rf,s[0]+(s[1]<-3?sway:0),s[1],a,'255,246,190',true)});
  // vài tia sáng bay quanh mép mũ
  for(let i=0;i<3;i++){const p=(t*.7+i/3)%1,a=sin(p*PI);if(a>.35){const gx=2+i*8+sin(t*2+i*2)*2,gy=8-p*16;star(Rf,gx,gy,a*.9,'255,236,150',false)}}};

 // ---- icon nấm nhỏ bay lên từ mũ ----
 const fly=()=>{
  for(let i=0;i<3;i++){
   const L=2.8,ph=(t/L+i/3)%1,a=sin(ph*PI);if(a<.18)continue;
   const x=rnd(8+i*4+sin(ph*5+i*2.1)*2.2),y=rnd(-6-ph*10),al=Math.min(1,a*1.3).toFixed(2);
   const c1='rgba(232,72,48,'+al+')',c2='rgba(255,243,200,'+al+')',c3='rgba(255,226,170,'+al+')',c4='rgba(160,40,24,'+al+')';
   u(c4,x+1,y-1,3,1);u(c1,x+1,y,3,1);u(c1,x,y+1,5,1);u(c2,x+1,y,1,1);u(c2,x+3,y+1,1,1);u(c4,x,y+2,5,1);u(c3,x+2,y+3,1,2)}};

 if(!side){
  // ================= nhìn thẳng / sau =================
  // thân: áo khoác đỏ + yếm vàng họa tiết nấm
  u(JK,4,14,12,2);u(JKL,4,14,3,1);u(JKD,13,14,3,2);
  u(JK,5,16,10,9);u(JKL,5,16,1,8);u(JKD,14,16,1,9);
  if(!back){
   u(DR,6,16,8,9);u(DRL,6,16,2,8);u(DRD,12,16,2,9);
   u(JK,9,15,2,2);u(JKD,9,16,2,1);                      // nơ/cổ áo đỏ
   [[7,18],[11,19],[8,22],[12,23],[9,20]].forEach((d,i)=>{u(i%2?JK:CRM,d[0],d[1],1,1);if(i%2==0)u(JK,d[0]+1,d[1],1,1)});
   u(JKD,6,21,8,1);u(SPD,9,21,2,1);                      // thắt lưng
  }else{
   u(JKD,5,16,10,1);u(DR,7,18,6,5);u(DRD,7,22,6,1);u(CRM,9,19,1,1);u(JK,11,20,1,1)}
  if(fem){u(JK,4,24,12,2);u(JKD,4,25,12,1);for(let x=5;x<16;x+=2)u(DR,x,25,1,1)}   // váy xòe
  else{u(JKD,5,24,10,1)}
  // tay áo đỏ + bàn tay
  const arm=(x,ay)=>{u(JK,x,16+ay,3,6);u(JKL,x,16+ay,1,6);u(JKD,x+2,16+ay,1,6);u(CRM,x,21+ay,3,1);u(SK,x,22+ay,3,1)};
  arm(1,lg);arm(16,-lg);
  // tóc trắng hai bên
  if(back){
   u(HR,3,9,14,9+(fem?3:0));u(HRS,4,12,12,1);u(HRD,3,17+(fem?3:0),14,1);u(HRS,6,10,2,3);u(HRS,12,13,2,4)
  }else{
   // mặt
   u(SK,5,9,10,5);u(SKL,6,9,2,3);u(SKD,13,10,1,3);u(SKD,6,13,8,1);
   // tóc mái trắng dưới vành nón + tóc hai bên
   u(HR,4,9,3,2);u(HR,13,9,3,2);u(HRS,7,9,2,1);u(HRS,11,9,2,1);u(HR,9,9,2,1);
   u(HR,3,9,2,5+(fem?5:0));u(HR,15,9,2,5+(fem?5:0));
   u(HRS,4,11,1,2+(fem?5:0));u(HRS,15,11,1,2+(fem?5:0));
   u(HRD,3,13+(fem?5:0),2,1);u(HRD,15,13+(fem?5:0),2,1);
   // mắt to
   SY(DK,6,10,3,1);SY(EYC,6,11,3,2);SY(EYD,6,12,3,1);SY(EYL,6,11,1,1);u('#2a1020',7,11,1,2);u('#2a1020',12,11,1,2);
   SY('#ffffff',8,11,1,1);
   if(fem){SY(DK,5,10,1,1);SY(DK,5,11,1,1)}
   // má hồng + miệng
   SY('rgba(240,110,110,.65)',5,12,2,1);u('#9a3a3a',9,13,2,1);u('#c4685a',9,13,1,1);
  }
  const b=hat(u,hwF,cxF,true);
  glitter(u,b,[[4,5,0],[12,4,1.3],[8,1,2.1],[16,6,3.4],[6,-3,4.2],[10,-1,5],[1,8,2.6],[19,8,.7]]);
  fly();
 }else{
  // ================= nhìn ngang (hướng phải) =================
  M(JK,4,14,11,2);M(JKL,4,14,3,1);
  fill_side:{
   const bs=[[14,6,13],[15,5,15,10],[25,6,14]];
   bs.forEach(q=>{const h=q[3]||1;M(JK,q[1],q[0],q[2]-q[1],h)});
  }
  M(JKL,6,16,1,8);M(JKD,13,16,2,9);
  M(DR,7,16,6,9);M(DRL,7,16,1,8);M(DRD,11,16,2,9);
  [[8,18],[10,20],[8,22],[11,23]].forEach((d,i)=>{M(i%2?JK:CRM,d[0],d[1],1,1)});
  M(JKD,7,21,6,1);M(SPD,10,21,2,1);M(JK,10,15,2,2);
  if(fem){M(JK,4,24,10,2);M(JKD,4,25,10,1);for(let x=5;x<14;x+=2)M(DR,x,25,1,1)}
  // tóc trắng phía sau (dài hơn cho nữ), đung đưa nhẹ
  for(let y=9;y<=(fem?20:15);y++){const i=y-9,sh=rnd(sin(t*(mv?6:1.7)+i*.35)*(i>3?(mv?1.6:.6):.2));
   M(i%3==2?HRS:HR,2+sh-(i>3?1:0),y,6+(i>3?1:0),1);M(HRD,2+sh-(i>3?1:0),y,1,1)}
  // mặt
  M(SK,10,9,5,5);M(SKL,10,9,1,3);M(SKD,10,13,5,1);M(SKD,14,11,1,2);
  M(HR,8,9,3,2);M(HR,8,9,2,6);M(HRS,9,11,1,3);
  M(DK,12,10,3,1);M(EYC,12,11,2,2);M(EYD,12,12,2,1);M(EYL,12,11,1,1);M('#2a1020',13,11,1,2);M('#ffffff',13,11,1,1);
  if(fem)M(DK,14,10,1,1);
  M('rgba(240,110,110,.65)',10,12,2,1);M('#9a3a3a',13,13,2,1);M(SKD,15,11,1,1);
  const am=rnd(lg);M(JK,8+am,16,3,6);M(JKL,8+am,16,1,6);M(JKD,10+am,16,1,6);M(CRM,8+am,21,3,1);M(SK,8+am,22,3,1);
  const b=hat(M,hwS,cxS,false);
  const mm=(x)=>Rt?x:20-x;                       // sao vẽ theo tọa độ màn hình đã lật
  glitter((c,x,y,w,h)=>M(c,x,y,w,h),b,[[4,5,0],[11,4,1.3],[7,0,2.1],[2,7,3.4],[5,-3,4.2],[13,7,5]]);
  fly();
 }
}
window.drawMascotMush=drawMush;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.mush=drawMush;

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
