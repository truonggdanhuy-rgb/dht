/* ===================================================================================
   PAJAMA.JS — Đồ mới:
   • 🌸 Pijama hồng (Nữ)  — SETS (mascot:'pj', pjv:'f'), 3000 Xu, bán ở Shop Phố xá (tab Set)
       Áo cộc tay + quần lửng hồng hoa đỏ, tóc hồng nhạt DÀI, dép bông thú to.
   • 🧡 Pijama cam (Nam)  — SETS (mascot:'pj', pjv:'m'), 3000 Xu, bán ở Shop Phố xá (tab Set)
       Áo cộc tay + quần lửng cam đốm kem, tóc ngắn UNDERCUT (hai bên cắt sát), dép bông thú to.
   Hai món được khai báo ở CUỐI mảng SETS trong index.html (không làm lệch số thứ tự đồ đã mua).
   Giá: pho-map.js → SHOP.s.pr (2 phần tử cuối). File này chỉ chứa HÀM VẼ.
   Vẽ theo khung chuẩn 20x31 (giống các mascot khác), không che mặt: khuôn mặt, biểu cảm
   và phụ kiện cầm tay vẫn hiện bình thường (tóc bạn chọn sẽ tạm ẩn vì bộ có sẵn tóc riêng).
   =================================================================================== */
(function(){
const rnd=Math.round;
function drawPJ(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,fem=S.pjv=='f';
 const SK='#f1c08a',SKS='#d99e6a';
 // ---- bảng màu ----
 const C=fem?{
  sh:'#ffc2d0',shl:'#ffdbe5',shd:'#ea9db4',pat:'#e63f66',pc:'#ffe27a',lf:'#7cc472',col:'#fff6f8',cold:'#f3cfda',
  f:'#fff3f7',fl:'#ffffff',fd:'#f0c3d2',ac:'#ff8fb0',ey:'#5a2e40',
  hc:'#ffd5e4',hl:'#fff1f7',hd:'#f2a9c4',hs:'#f2a9c4'
 }:{
  sh:'#ffa648',shl:'#ffc47c',shd:'#e48226',pat:'#fff4e0',pc:'#ffdcae',lf:'#fff4e0',col:'#ffe3bf',cold:'#e9b983',
  f:'#ffb25a',fl:'#ffd196',fd:'#e48a2e',ac:'#fff1da',ey:'#5a3416',
  hc:'#f4effb',hl:'#ffffff',hd:'#cdc4e2',hs:'#d9d1ea'
 };
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);       // vẽ hướng phải, tự lật khi quay trái
 const sx=side?lg*(Rt?2:-2):0;

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- dép bông thú (to, có tai + mặt) ----------
 const slipF=(x0,lift)=>{            // nhìn trước/sau: rộng 6, cao 3 (y27..29)
  const y=28-lift;
  r(C.f,x0,y,6,2);r(C.f,x0+1,y-1,4,1);r(C.fl,x0+1,y-1,2,1);
  r(C.f,x0,y-1,1,1);r(C.f,x0+5,y-1,1,1);                 // tai
  r(C.ac,x0,y-1,1,1);r(C.ac,x0+5,y-1,1,1);
  r(C.fd,x0,y+1,6,1);                                    // đế
  if(!back){r(C.ey,x0+1,y,1,1);r(C.ey,x0+4,y,1,1);r(C.ac,x0+2,y,2,1);r(C.ey,x0+2,y+1,2,1);r(C.ac,x0+2,y+1,2,1)}
  else{r(C.fl,x0+1,y,2,1);r(C.fd,x0+3,y,2,1)}
 };
 const slipS=(x,lift)=>{             // nhìn ngang: rộng 7, mũi hướng theo mặt
  const y=28-lift,P=(c,dx,yy,w,h)=>u(c,Rt?x-1+dx:x+5-dx-w,yy,w,h);
  P(C.f,0,y,7,2);P(C.f,1,y-1,5,1);P(C.fl,1,y-1,3,1);
  P(C.f,5,y-1,1,1);P(C.ac,5,y-1,1,1);                     // tai
  P(C.fd,0,y+1,7,1);
  P(C.ey,5,y,1,1);P(C.ac,6,y,1,1);P(C.ey,6,y+1,1,1);       // mắt + mũi
  P(C.fl,1,y,2,1);
 };
 const leg=(x,lift)=>{
  if(!side){
   r(C.sh,x,24,4,3-lift);r(C.shd,x+3,24,1,3-lift);r(C.shl,x,24,1,3-lift);
   r(C.pat,x+1,25,1,1);
   slipF(x-1,lift);
  }else{
   r(C.sh,x,24,4,3-lift);r(C.shd,Rt?x:x+3,24,1,3-lift);
   r(C.pat,x+1,25,1,1);
   slipS(x,lift);
  }
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- hoa văn ----------
 const flower=(cx,cy)=>{u(C.pat,cx-1,cy,3,1);u(C.pat,cx,cy-1,1,3);u(C.pc,cx,cy,1,1)};
 const blob=(x,y)=>{u(C.pat,x,y,2,2);u(C.pat,x,y-1,1,1);u(C.pc,x+1,y+1,1,1)};
 const motif=(pts)=>pts.forEach(p=>fem?flower(p[0],p[1]):blob(p[0],p[1]));

 // ---------- thân áo ----------
 if(!side){
  u(C.sh,6,16,8,1);u(C.sh,5,17,10,4);u(C.sh,6,21,8,3);u(C.shl,5,17,2,4);u(C.shd,13,17,2,4);u(C.shd,12,21,2,3);
  u(C.shd,5,23,10,1);                                    // gấu áo
  if(back){
   motif(fem?[[7,19],[12,19],[9,22],[13,22]]:[[6,18],[11,18],[8,21],[12,21]]);
   u(C.col,6,15,8,1);u(C.cold,6,16,8,1);
  }else{
   u(C.shd,9,17,1,6);                                    // đường cài nút
   u(C.bt||'#ffffff',10,18,1,1);u('#ffffff',10,20,1,1);u('#ffffff',10,22,1,1);
   motif(fem?[[7,19],[12,19],[7,22],[13,22]]:[[6,19],[12,19],[6,22],[12,22]]);
   // cổ bẻ
   u(C.col,6,15,3,1);u(C.col,11,15,3,1);u(C.col,7,16,2,1);u(C.col,11,16,2,1);u(C.cold,8,16,1,1);u(C.cold,11,16,1,1);
   u(SK,9,15,2,1);u(SK,9,16,2,1);
   // túi áo
   u(C.shd,6,21,3,1);u(C.shd,6,21,1,2);u(C.shl,7,22,2,1);
  }
  // tay áo cộc + tay
  const arm=(x,ay)=>{u(C.sh,x,17+ay,3,3);u(C.shl,x,17+ay,1,3);u(C.shd,x,19+ay,3,1);u(SK,x,20+ay,3,4);u(SKS,x+2,20+ay,1,4)};
  if(o.aup){
   const up=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u('rgba(0,0,0,.12)',x+ox,ty+2,3,1);u(C.sh,x,ty+3,3,3);u(C.shl,x,ty+3,1,3);u(C.shd,x+2,ty+3,1,3)};
   o.aup[0]!=null?up(2,o.aup[0],-1):arm(2,lg);up(15,o.aup[1],1);
  }else{arm(2,lg);arm(15,-lg)}
 }else{
  u(C.sh,8,16,6,1);u(C.sh,7,17,7,4);u(C.sh,8,21,6,3);u(C.shd,Rt?7:12,17,2,4);u(C.shd,7,23,7,1);
  u(C.col,Rt?9:8,15,4,1);u(C.cold,Rt?9:8,16,4,1);
  if(Rt){u(C.pat,9,18,1,1);u(C.pat,11,20,1,1)}else{u(C.pat,10,18,1,1);u(C.pat,8,20,1,1)}
  if(fem){u(C.pc,Rt?10:9,19,1,1)}
  u('#ffffff',Rt?13:7,19,1,1);
  const ax=9-sx;
  if(!o.noarm){u(C.sh,ax,17,3,3);u(C.shl,ax,17,3,1);u(C.shd,ax,19,3,1);u(SK,ax,20,3,4);u(SKS,ax+1,23,2,1)}
 }
 u(SK,9,15,2,1);

 // ---------- đầu + mặt ----------
 if(back){E(u,C.hc,10,11,4,4)}
 else if(!side){
  E(u,SK,10,11,4,4);u('rgba(70,35,15,.28)',7,8,6,1);
  if(o.e>0)faceFx(u,o.e,0,0);else faceDef(u,0,0);
 }else{
  E(u,C.hc,Rt?8:12,11,3,4);E(u,SK,Rt?11:9,11,3,4);u('rgba(70,35,15,.28)',Rt?8:6,8,6,1);
  u(SKS,Rt?14:5,11,1,1);
  if(o.e>0)faceFx(u,o.e,1,Rt);else faceDef(u,1,Rt);
 }

 // ---------- tóc ----------
 if(fem){   // hồng nhạt DÀI, mái bay
  if(!side&&!back){
   u(C.hc,7,5,6,1);u(C.hc,6,6,8,1);u(C.hc,5,7,10,2);u(C.hl,8,5,3,1);u(C.hl,7,6,2,1);
   u(C.hc,7,9,2,1);u(C.hc,11,9,2,1);u(C.hc,9,9,2,1);u(C.hd,10,9,1,1);              // mái thưa
   u(C.hc,4,8,3,14);u(C.hd,4,10,1,11);u(C.hl,6,10,1,9);u(C.hd,4,21,3,1);u(C.hs,5,22,2,1);   // lọn trái dài
   u(C.hc,13,8,3,14);u(C.hd,15,10,1,11);u(C.hl,13,10,1,9);u(C.hd,13,21,3,1);u(C.hs,13,22,2,1); // lọn phải dài
  }else if(back){
   u(C.hc,6,5,8,1);u(C.hc,5,6,10,2);u(C.hc,4,8,12,14);u(C.hl,7,6,3,1);
   u(C.hd,4,9,1,12);u(C.hd,15,9,1,12);u(C.hd,9,10,2,11);u(C.hl,6,9,1,11);u(C.hl,13,9,1,10);
   u(C.hd,4,21,12,1);u(C.hs,5,22,10,1);
  }else{
   M(C.hc,6,5,7,1);M(C.hc,5,6,9,2);M(C.hc,9,8,5,1);M(C.hl,7,5,3,1);M(C.hl,6,6,2,1);
   M(C.hc,9,9,1,1);M(C.hc,12,9,1,1);
   M(C.hc,4,8,6,3);M(C.hc,3,10,6,12);M(C.hd,3,11,1,10);M(C.hl,6,11,1,8);M(C.hd,3,21,6,1);M(C.hs,4,22,4,1);
  }
 }else{     // tóc ngắn UNDERCUT: trên dày vuốt, hai bên cắt sát
  if(!side&&!back){
   u(C.hc,7,3,6,1);u(C.hc,6,4,8,2);u(C.hc,6,6,8,1);u(C.hl,8,3,3,1);u(C.hl,7,4,2,1);
   u(C.hc,6,7,7,1);u(C.hc,6,8,4,1);u(C.hc,11,8,2,1);                                // mái vuốt lệch
   u(C.hs,6,7,1,4);u(C.hs,13,7,1,4);u(C.hd,6,9,1,1);u(C.hd,13,9,1,1);              // hai bên cạo sát
  }else if(back){
   u(C.hc,7,3,6,1);u(C.hc,6,4,8,3);u(C.hc,6,7,8,1);u(C.hl,8,4,3,1);
   u(C.hs,6,8,8,3);u(C.hd,6,10,8,1);u(C.hs,9,11,2,1);                               // gáy cạo sát
  }else{
   M(C.hc,7,3,6,1);M(C.hc,6,4,8,2);M(C.hc,6,6,8,1);M(C.hl,8,3,3,1);M(C.hl,7,4,2,1);
   M(C.hc,9,7,5,1);M(C.hc,11,8,3,1);
   M(C.hs,6,7,3,3);M(C.hs,5,9,3,4);M(C.hd,5,12,3,1);                                // thái dương + gáy cạo sát
  }
 }
}
window.drawMascotPJ=drawPJ;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.pj=drawPJ;
})();

/* ===================================================================================
   ĐỒNG PHỤC TIỂU HỌC (Nam / Nữ) + TÓC ĐỒNG PHỤC (mũ vàng viền xanh, cọng cỏ + hoa cúc)
   • Bán ở Shop Phố xá: mỗi bộ 1000 Xu (tab Set) • Tóc đồng phục 1000 Xu (tab Tóc & mũ)
   • Dữ liệu được đẩy vào CUỐI mảng SETS / HAIRS và giá vào SHOP.s.pr / SHOP.h.pr ngay tại đây
     (file này nạp SAU index.html + pho-map.js nên không cần sửa 2 file đó).
   • Hình vẽ: SETFX.school (áo thủy thủ xanh nhạt, cổ trắng, nơ vàng; Nam = quần đùi xanh, Nữ = váy xếp ly vàng,
     tất trắng, giày cam) và HAIRFX.school (tóc cam gọn unisex + mũ bucket vàng, viền xanh).
   • Không có hiệu ứng động — chỉ pixel tĩnh. Không che mặt, biểu cảm & phụ kiện vẫn hiện.
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần) ----------
if(!SETS.some(s=>s.k=='schm')){
 const base={fx:'school',sh:'#8fd2f4',shl:'#bce8fc',shd:'#62b3e2',scarf:'#ffffff',belt:'#ffffff',trim:'#cfeefd',shoe:'#f0a030'};
 const iM=SETS.push(Object.assign({n:'Đồng phục tiểu học (Nam)',k:'schm',sc:'m',pt:'#3f86d6',rpt:'#3f86d6',
   ds:'Áo thủy thủ xanh nhạt cổ trắng viền xanh, nơ vàng, quần đùi xanh, tất trắng, giày cam. Hợp với Tóc đồng phục.'},base))-1;
 const iF=SETS.push(Object.assign({n:'Đồng phục tiểu học (Nữ)',k:'schf',sc:'f',pt:'#e8a216',rpt:'#e8a216',
   ds:'Áo thủy thủ xanh nhạt cổ trắng viền xanh, nơ vàng, váy xếp ly vàng, tất trắng, giày cam. Hợp với Tóc đồng phục.'},base))-1;
 if(typeof SHOP!=='undefined'){SHOP.s.pr[iM]=1000;SHOP.s.pr[iF]=1000}
}
if(!HAIRS.some(h=>h.k=='school')){
 const iH=HAIRS.push({n:'Tóc đồng phục',k:'school',c:'#f2922c'})-1;
 if(typeof SHOP!=='undefined')SHOP.h.pr[iH]=1000;
}

// ---------- 2) bảng màu ----------
const W='#ffffff',WS='#dcecf8',SB='#2f9be6',SBL='#74c8f8',                       // trắng / xanh viền
      YB='#ffc83a',YBL='#ffe680',YBD='#e8a216',YBK='#c47d0c',                    // vàng (nơ, váy, mũ)
      BD='#1a6bb4',G1='#3d9c3a',G2='#6bcd58',CY='#f4ae0a',                       // xanh đậm / cỏ / nhụy hoa
      HL='#ffb860',HD='#c4701c';                                                 // tóc cam sáng / tối

// bob (độ nhún khi đi) — để vẽ đè lên chân đúng chỗ (chân vẽ không có bob, thân có bob)
const bobOf=(o,K)=>o.nobob?0:o.mv?(K.lg?-1:0):((o.acc>=0&&!K.rd&&!K.sit&&typeof ACCS!=='undefined'&&ACCS[o.acc]&&ACCS[o.acc].k=='guitar'&&typeof gtBob=='function')?gtBob():0);

// ---------- 3) BỘ ĐỒNG PHỤC ----------
SETFX.school=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK}=K,fem=S.sc=='f',bob=bobOf(o,K);
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);          // nhìn ngang (tự lật khi quay trái)
 const Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);                 // vẽ đè lên phần chân/váy (không nhún)
 const S2=(c,a,y,h)=>u(c,a,y,20-2*a,h||1);              // đối xứng 2 bên

 // ----- váy xếp ly (Nữ) -----
 if(fem&&!rd){
  const rows=side?[[23,7],[24,6],[25,5],[26,5]]:[[23,6],[24,5],[25,4],[26,4]];
  rows.forEach(([y,a])=>{for(let x=a;x<20-a;x++){
   const hem=y==26;
   u(hem?YBD:(x%3==0?YBD:x%3==1?YBL:YB),x,y,1,1)}});
  u(YBK,rows[3][1],26,20-2*rows[3][1],1);                // viền gấu tối
  S2(W,rows[0][1],22,1);                                 // cạp áo trắng
 }
 // ----- tất trắng + giày cam (vẽ đè lên chân) -----
 if(!rd){
  let L;
  if(sit){const sw=Math.round(Math.sin(performance.now()/260)*1.5);L=[[6,sw>0?1:0,1],[11,-sw>0?1:0,1]]}
  else if(!side){L=lg>0?[[11,0],[6,1]]:lg<0?[[6,0],[11,1]]:[[6,0],[11,0]]}
  else{const x1=8+sx,x2=10-sx;L=lg>0?[[x2,0],[x1,1]]:lg<0?[[x1,0],[x2,1]]:[[x1,0],[x2,0]]}
  for(const[x,l,st]of L){
   if(st){                                               // đang ngồi: chân duỗi
    Q(W,x,28+l,3,2);Q(SBL,x,28+l,3,1);Q(WS,x+2,29+l,1,1);Q(S.shoe,x,30+l,3,1);Q(shade(S.shoe,.3),x,30+l,1,1);continue}
   if(!fem){Q('#8fc4f4',x,26,3,1);Q('#2f6fb8',x+2,25,1,1)}  // gấu quần đùi
   Q(W,x,27,3,2-l);Q(SBL,x,27,3,1);Q(WS,x+2,28,1,1-l);      // tất: viền xanh + trắng
   Q(S.shoe,x,29-l,3,1);Q(shade(S.shoe,.3),x,29-l,1,1);Q(shade(S.shoe,-.25),x+2,29-l,1,1);
   if(side)Q(S.shoe,Rt?x+3:x-1,29-l,1,1);                // mũi giày nhô ra phía trước
  }
 }
 // ----- cổ áo thủy thủ + nơ vàng -----
 if(!side){
  if(!back){
   u(W,6,15,3,1);u(W,11,15,3,1);                         // cổ trắng 2 cánh
   u(W,7,16,2,1);u(W,11,16,2,1);u(SB,6,16,1,1);u(SB,13,16,1,1);
   u(SB,7,17,2,1);u(SB,11,17,2,1);                       // viền xanh dưới cổ
   u(SK,9,15,2,2);                                       // hở cổ chữ V
   u(YB,8,17,1,2);u(YB,11,17,1,2);u(YBD,8,18,1,1);u(YBD,11,18,1,1);   // 2 cánh nơ
   u(YBL,9,17,2,1);u(YBD,9,18,2,1);                      // nút nơ
  }else{
   u(W,6,15,8,2);u(WS,6,16,8,1);u(SB,6,16,1,1);u(SB,13,16,1,1);
   u(SB,7,17,6,1);u(SB,9,18,2,1);                        // cổ vuông sau lưng
  }
  // vệt trắng ngang ngực (cả nhìn trước/sau)
  S2(W,5,20,1);
  // cổ tay áo: viền xanh + trắng
  if(!o.aup){
   const cuff=(x,ay)=>{u(SBL,x,19+ay,3,1);u(W,x,20+ay,3,1)};
   cuff(2,lg);cuff(15,-lg);
  }
 }else{
  M(W,8,15,5,1);M(W,8,16,4,1);M(SB,8,17,4,1);M(SB,12,16,1,1);
  M(W,8,20,6,1);                                         // vệt trắng ngang
  M(YB,12,17,2,2);M(YBD,13,18,1,1);M(YBL,12,17,1,1);      // nơ nhìn nghiêng
  if(!o.noarm){const ax=9-sx;u(SBL,ax,19,3,1);u(W,ax,20,3,1)}
 }
};

// ---------- 4) TÓC ĐỒNG PHỤC + MŨ BUCKET VÀNG ----------
HAIRFX.school=(u,o,K)=>{
 const{side,Rt,back,HC}=K,M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h),S2=(c,a,y,h)=>u(c,a,y,20-2*a,h||1);

 // ---- tóc cam gọn (tóc bob ngắn, mái ngang) ----
 if(!side&&!back){
  S2(HC,5,9,1);u(HL,7,9,2,1);                            // mái
  u(HC,5,10,2,1);u(HC,9,10,2,1);u(HC,13,10,2,1);u(HD,6,10,1,1);u(HD,13,10,1,1);
  u(HC,4,10,2,4);u(HC,14,10,2,4);u(HD,4,10,1,4);u(HD,15,10,1,4);u(HL,5,11,1,2);u(HL,14,11,1,2);
  u(HC,4,14,3,1);u(HC,13,14,3,1);u(HD,4,14,1,1);u(HD,15,14,1,1);
 }else if(back){
  u(HC,5,9,10,5);u(HC,6,14,8,1);S2(HD,5,13,1);u(HD,5,9,1,4);u(HD,14,9,1,4);
  u(HL,7,10,1,3);u(HL,12,10,1,2);u(HD,6,14,8,1);u(HD,9,10,2,1);
 }else{
  M(HC,4,9,5,5);M(HD,4,9,1,5);M(HL,6,10,1,3);M(HC,4,14,4,1);M(HD,4,14,4,1);   // phía sau
  M(HC,9,9,5,1);M(HL,10,9,2,1);M(HC,12,10,2,1);M(HD,13,10,1,1);                // mái trước
 }

 // ---- mũ bucket vàng, viền xanh + cọng cỏ & hoa cúc ----
 if(!side){
  // hoa cúc (cánh trắng, nhụy vàng) + cọng cỏ xanh
  u(W,10,0,1,1);u(W,9,1,1,1);u(CY,10,1,1,1);u(W,11,1,1,1);u(W,10,2,1,1);
  u(WS,9,0,1,1);u(WS,11,0,1,1);u(WS,9,2,1,1);u(WS,11,2,1,1);
  u(G1,10,3,1,1);u(G2,11,3,1,1);
  // thân mũ (bucket: đỉnh phẳng, thân hơi loe xuống)
  u(YB,7,4,6,1);u(YBL,7,4,2,1);u(YBD,11,4,2,1);
  u(YB,6,5,8,1);u(YBL,6,5,3,1);u(YBD,12,5,2,1);
  u(YB,6,6,8,1);u(YBL,6,6,3,1);u(YBD,12,6,2,1);
  // dải viền xanh
  u(SB,5,7,10,1);u(SBL,5,7,3,1);u(BD,12,7,3,1);
  // vành mũ
  u(YB,3,8,14,1);u(YBL,3,8,6,1);u(YBD,13,8,4,1);
  u(YBD,3,9,2,1);u(YBK,15,9,2,1);
 }else{
  // nhìn nghiêng: tâm mũ ở x=9 (khung hướng phải), vành dài hơn về phía trước
  M(W,9,0,1,1);M(W,8,1,1,1);M(CY,9,1,1,1);M(W,10,1,1,1);M(W,9,2,1,1);
  M(WS,8,0,1,1);M(WS,10,0,1,1);M(WS,8,2,1,1);M(WS,10,2,1,1);
  M(G1,9,3,1,1);M(G2,10,3,1,1);
  M(YB,6,4,7,1);M(YBL,6,4,2,1);M(YBD,11,4,2,1);
  M(YB,5,5,9,1);M(YBL,5,5,3,1);M(YBD,12,5,2,1);
  M(YB,5,6,9,1);M(YBL,5,6,3,1);M(YBD,12,6,2,1);
  M(SB,4,7,11,1);M(SBL,4,7,3,1);M(BD,12,7,3,1);
  M(YB,3,8,14,1);M(YBL,3,8,5,1);M(YBD,12,8,5,1);
  M(YBD,3,9,2,1);M(YBK,15,9,2,1);
 }
};
})();
