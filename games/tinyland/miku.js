/* =====================================================================
   miku.js — 🎀 MIKU CÁ TÍNH: Set (1.000 Xu) + Tóc (2.500 Xu), bán ở Shop Phố xá (Tiệm may: tab Set / tab Tóc & mũ)
   • VẼ LẠI HOÀN TOÀN theo đúng kiểu pixel 1 ô của game (giống Đồng phục / Áo dài / Sailor Moon) — KHÔNG còn bộ vẽ 2x riêng.
   • SET = CHỈ đồ mặc: áo khoác ngắn trắng + cà vạt xanh ngọc + váy xếp ly trắng hồng + tất đen dài + giày nâu.
     Set KHÔNG kèm tóc, KHÔNG vẽ đầu/mặt (khuôn mặt, tóc, biểu cảm, phụ kiện là của nhân vật như mọi set thường).
   • TÓC = 2 đuôi dài xanh ngọc tới tận chân, vòng nghe đỏ, kẹp chữ X, mái. Đuôi MẢNH (2–3 điểm ảnh) cho thanh,
     chỉ vượt khung 20 điểm ảnh ở 2 bên (x = -1 và x = 20) để dài & thật hơn. Đội được với mọi set.
   • Giá: sửa xu:1000 / xu:2500 ở 2 dòng push bên dưới. Nạp CUỐI index.html; luôn thêm vào CUỐI mảng SETS / HAIRS
     (cùng vị trí như bản cũ nên đồ đã mua vẫn còn).
   ===================================================================== */
(function(){
"use strict";
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined')return;

// ---------- 1) khai báo dữ liệu ----------
if(!SETS.some(s=>s.k=='miku'))SETS.push({n:'Miku cá tính',k:'miku',fx:'miku',xu:1000,
 ds:'Áo khoác ngắn trắng, cà vạt xanh ngọc, váy xếp ly trắng hồng, tất đen dài, giày nâu. Chỉ có đồ mặc, không kèm tóc — hợp với Tóc Miku cá tính. Không che mặt.',
 sh:'#ffffff',shl:'#ffffff',shd:'#dcd2d9',scarf:'#ffffff',belt:'#f6bcd3',pt:'#f1c08a',rpt:'#fbeef3',shoe:'#5a3a30'});
if(!HAIRS.some(h=>h.k=='miku'))HAIRS.push({n:'Tóc Miku cá tính',k:'miku',c:'#35d0c4',xu:2500});

// ---------- 2) bảng màu ----------
const W='#ffffff',
 TIE='#1fb9b0',TIEL='#7df0e6',TIED='#0f7f84',BTN='#26222c',CUFF='#2e2833',
 SKB='#fff4f8',SKL='#ffffff',SKS='#f1d3e0',SKD='#dfa9c2',HEM='#f6bcd3',HEMD='#d98aae',     // váy trắng hồng + gấu hồng
 SOCK='#2d2733',SOCKL='#4a4256',SOCKD='#1a161e',                                        // tất đen dài
 TL='#35d0c4',TH='#8ff0e6',TS='#22a9a8',TD='#157d85',                                   // tóc xanh ngọc
 RC='#e63946',RH='#ff8a92',RD='#9c1a2a';                                                // vòng nghe đỏ

// độ nhún khi đi (để vẽ đè lên chân đúng chỗ) — giống pajama.js
const bobOf=(o,K)=>o.nobob?0:o.mv?(K.lg?-1:0):((o.acc>=0&&!K.rd&&!K.sit&&typeof ACCS!=='undefined'&&ACCS[o.acc]&&ACCS[o.acc].k=='guitar'&&typeof gtBob=='function')?gtBob():0);

// ---------- 3) BỘ ĐỒ MIKU (chỉ áo + váy + tất) ----------
SETFX.miku=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK}=K,bob=bobOf(o,K);
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);        // nhìn ngang: tự lật khi quay trái
 const Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);               // vẽ đè lên phần chân (chân không nhún)

 // ----- áo khoác ngắn: cổ + cà vạt xanh + gấu áo -----
 if(!side){
  if(!back){
   u(S.sh,9,17,2,4);                                  // xoá đường giữa + khuy vàng mặc định
   u(W,7,15,2,1);u(W,11,15,2,1);u(W,7,16,1,1);u(W,12,16,1,1);u(S.shd,8,16,1,1);u(S.shd,11,16,1,1);   // cổ áo 2 cánh
   u(TIEL,9,16,1,1);u(TIE,10,16,1,1);                // nút cà vạt
   u(TIEL,9,17,1,3);u(TIE,10,17,1,3);u(TIED,10,19,1,1);u(TIED,9,19,1,1);   // thân cà vạt (rộng 2)
   u(S.shd,6,20,3,1);u(S.shd,11,20,3,1);u(S.shd,9,20,1,1);u(BTN,10,20,1,1);   // gấu áo + 1 khuy đen
  }else{
   u(W,6,15,8,1);u(S.shd,6,16,1,1);u(S.shd,13,16,1,1);u(S.shd,5,20,10,1);
  }
 }else{
  u(W,8,15,1,1);u(W,11,15,1,1);
  M(TIE,12,16,2,1);M(TIEL,12,17,1,3);M(TIE,13,17,1,3);M(TIED,12,19,2,1);      // cà vạt nhìn nghiêng
  u(S.shd,7,20,7,1);
 }

 // ----- váy xếp ly trắng hồng (xòe dần, hơi vượt khung ở gấu) -----
 if(!rd){
  const rows=side?[[21,7],[22,6],[23,5],[24,4],[25,3]]:[[21,6],[22,5],[23,4],[24,3],[25,2]];
  rows.forEach(([y,a],k)=>{for(let x=a;x<=19-a;x++){
   let c=x%3==0?SKL:x%3==1?SKB:SKS;
   if(x==a)c=SKS;if(x==19-a)c=SKD;
   if(y==21)c=x%3==0?SKB:SKS;
   if(y==25)c=x%3==2?HEMD:HEM;                        // gấu váy hồng
   u(c,x,y,1,1)}});
 }

 // ----- cổ tay áo (viền đen + trắng) + bàn tay: vẽ SAU váy để váy không đè lên tay -----
 if(!o.aup&&!o.noarm){
  const hand=(x,ay)=>{u(CUFF,x,20+ay,3,1);u(W,x,21+ay,3,1);u(SK,x,22+ay,3,2)};
  if(!side){hand(2,lg);hand(15,-lg)}
  else{hand(9-sx,0)}
 }

 // ----- tất đen dài + giày nâu (vẽ đè lên chân) -----
 if(!rd){
  let L;
  if(sit){const sw=Math.round(Math.sin(performance.now()/260)*1.5);L=[[6,sw>0?1:0,1],[11,-sw>0?1:0,1]]}
  else if(!side){L=lg>0?[[11,0],[6,1]]:lg<0?[[6,0],[11,1]]:[[6,0],[11,0]]}
  else{const x1=8+sx,x2=10-sx;L=lg>0?[[x2,0],[x1,1]]:lg<0?[[x1,0],[x2,1]]:[[x1,0],[x2,0]]}
  for(const[x,l,st]of L){
   if(st){                                            // đang ngồi: chân duỗi
    Q(SOCK,x,28+l,3,2);Q(SOCKL,x,28+l,3,1);Q(S.shoe,x,30+l,3,1);Q(shade(S.shoe,.3),x,30+l,1,1);continue}
   Q(SOCK,x,27,3,2-l);Q(SOCKL,x,27,3,1);if(!l)Q(SOCKD,x+2,28,1,1);
   Q(shade(S.shoe,.3),x,29-l,1,1);Q(shade(S.shoe,-.25),x+2,29-l,1,1);
   if(side)Q(S.shoe,Rt?x+3:x-1,29-l,1,1);              // mũi giày nhô ra phía trước
  }
 }
};

// ---------- 4) TÓC MIKU: 2 đuôi dài mảnh tới chân + vòng nghe đỏ + kẹp X ----------
// hàng y = 9..29: vị trí trái (xl) và bề rộng (w) của mỗi đuôi — mảnh ở trên, đầy ở giữa, thon dần ở ngọn
const XL=[2,2,2,2,2,2,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0];
const TW=[3,3,2,2,2,2,2,2,3,3,3,3,3,3,3,2,2,2,2,1,1];
const XS=[5,4,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,3];      // nhìn ngang: đuôi rủ sau gáy

HAIRFX.miku=(u,o,K)=>{
 const{side,Rt,back}=K,mv=!!o.mv,sw=mv?Math.round(Math.sin(performance.now()/110)):0,
  mx=(x,w)=>Rt?x:20-x-w,M=(c,x,y,w,h)=>u(c,mx(x,w),y,w,h);
 const swayOf=y=>mv?(y>=26?2:y>=20?1:0):0;
 // một hàng của đuôi tóc: sáng ở mép ngoài, tối ở mép trong, vệt sáng lệch, ngọn tối
 const row=(x,w,y,i,outerLeft)=>{
  u(TL,x,y,w,1);
  const ox=outerLeft?x:x+w-1,ix=outerLeft?x+w-1:x;
  if(i%4==1)u(TH,ox,y,1,1);
  if(w>1)u(TS,ix,y,1,1);
  if(w==3&&i%6==3)u(TH,x+1,y,1,1);
  if(i>=19)u(TS,x,y,w,1)};
 const cup=(x)=>{u(RC,x,6,3,3);u(RH,x,6,2,1);u(RD,x,8,3,1);u(RD,x+2,7,1,1)};

 if(!side){
  // 2 đuôi tóc (vẽ trước để mái & vòng nghe nằm trên)
  for(let i=0;i<21;i++){const y=9+i,s=swayOf(y)*sw,x=XL[i]+s,w=TW[i];row(x,w,y,i,true);row(20-x-w,w,y,i,false)}
  if(!back){
   // chỏm đầu + mái
   u(TL,8,4,4,1);u(TL,7,5,6,1);u(TL,6,6,8,1);u(TL,5,7,10,3);
   u(TH,8,5,2,1);u(TH,7,6,2,1);u(TH,6,7,1,2);
   u(TS,12,5,1,1);u(TS,13,6,1,1);u(TS,13,7,2,3);
   // mái xéo + lọn mái rủ
   u(TL,7,10,1,1);u(TL,9,10,2,1);u(TL,12,10,1,1);u(TS,10,10,1,1);u(TS,12,10,1,1);
   // tóc mai 2 bên mặt
   u(TL,4,10,2,3);u(TH,4,11,1,1);u(TS,5,12,1,1);
   u(TL,14,10,2,3);u(TS,15,10,1,3);
   // kẹp tóc chữ X trắng
   u(W,6,7,1,1);u(W,8,7,1,1);u(TIEL,7,8,1,1);u(W,6,9,1,1);u(W,8,9,1,1);
  }else{
   u(TL,8,4,4,1);u(TL,7,5,6,1);u(TL,6,6,8,1);u(TL,5,7,10,7);u(TL,6,14,8,1);u(TL,7,15,6,1);
   u(TH,8,5,2,1);u(TH,7,6,2,1);u(TH,6,7,1,5);
   u(TS,13,7,2,7);u(TS,6,14,8,1);u(TS,7,15,6,1);
   for(const x of[8,12])u(TS,x,8,1,5);u(TH,10,9,1,3);
  }
  cup(2);cup(15);
 }else{
  // nhìn ngang: đuôi xa (tối) rồi đuôi gần rủ sau gáy
  for(let i=0;i<21;i++){const y=9+i,s=swayOf(y),w=TW[i];u(TS,mx(XS[i]-s+1,w),y,w,1)}
  for(let i=0;i<21;i++){const y=9+i,s=swayOf(y),w=TW[i],x=XS[i]-s,px=mx(x,w);
   u(TL,px,y,w,1);
   const ox=Rt?px:px+w-1,ix=Rt?px+w-1:px;
   if(i%4==1)u(TH,ox,y,1,1);if(w>1)u(TS,ix,y,1,1);if(i>=19)u(TS,px,y,w,1)}
  // chỏm đầu + mái trước
  M(TL,5,6,9,3);M(TL,7,5,5,1);M(TL,8,4,3,1);M(TH,8,6,3,1);M(TH,8,5,2,1);M(TS,12,7,2,2);
  M(TL,10,8,3,2);M(TS,12,9,1,1);
  M(TL,4,9,5,6);M(TS,4,9,1,6);M(TH,6,10,1,3);M(TS,5,14,4,1);   // gáy
  // kẹp chữ X
  M(W,10,6,1,1);M(W,12,6,1,1);M(TIEL,11,7,1,1);M(W,10,8,1,1);M(W,12,8,1,1);
  // vòng nghe đỏ
  M(RC,6,6,3,3);M(RH,6,6,2,1);M(RD,6,8,3,1);M(RD,8,7,1,1);
 }
};
})();
