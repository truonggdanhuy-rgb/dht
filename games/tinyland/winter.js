/* ===================================================================================
   WINTER.JS — Đồ mới:
   • 🧝 Mascot Chú bé mùa đông (Nam) — SETS (mascot:'wint', wn:'m'), ❄️ 3 Huy hiệu tuyết, đổi ở Ông già Noel (Làng tuyết)
   • 🧝‍♀️ Mascot Cô bé mùa đông (Nữ) — SETS (mascot:'wint', wn:'f'), ❄️ 3 Huy hiệu tuyết, đổi ở Ông già Noel (Làng tuyết)
       Hai bộ GIỐNG HỆT nhau, chỉ khác tóc: Nam tóc đen ngắn • Nữ tóc hồng nhạt dài ngang cổ.
       Mũ yêu tinh xanh – đỏ có 5 chùm chuông vàng + đuôi mũ rủ xuống có chuông, tai nhọn, khăn đỏ,
       áo xanh lá thắt đai đen khóa vàng, váy xòe, tất sọc đỏ trắng, giày xanh mũi cong.
       Chuông vàng đung đưa & lấp lánh. KHÔNG che mặt (khuôn mặt, biểu cảm, phụ kiện cầm tay vẫn hiện).
   Khai báo ở CUỐI mảng SETS (index.html) + thêm 2 dòng vào SBSHOP (snow-village.js).
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: sửa bd:3 trong index.html.
   =================================================================================== */
(function(){
const sin=Math.sin,rnd=Math.round,flr=Math.floor;
const SK='#f6cfa8',SKL='#ffe3c8',SKD='#d9a37c';
const GR='#2fa04a',GRL='#55cc6c',GRD='#1f7a38',RD='#d8232a',RDL='#f2554d',RDD='#9c1620',
 GD='#ffd23a',GDL='#fff3a8',GDD='#d9960f',BK='#1c1a22',WH='#ffffff',WS='#e9d9d9',ST='#e23a3a',SH='#3fae4e',SHL='#78dc80',SHD='#24803a';

function bell(Rf,x,y,t,i){            // chuông vàng 2x2, thỉnh thoảng lóe sáng
 Rf(GD,x,y,2,2);Rf(GDD,x,y+1,2,1);Rf(GDL,x,y,1,1);
 if(sin(t*3+i*1.9)>.8)Rf('#ffffff',x+1,y-1,1,1);
}

function drawWinter(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,fem=S.wn=='f',t=performance.now()/1000,mv=!!o.mv;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const sx=side?lg*(Rt?2:-2):0;
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const HC=fem?'#f7bfd6':'#1e1a26',HL=fem?'#ffe0ec':'#413b58',HD=fem?'#df8fb2':'#0e0b14',HS=fem?'#ffd1e3':'#2e2940';
 const sw=rnd(sin(t*2)*.7)+(mv?1:0);   // đuôi mũ đung đưa

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân: tất sọc đỏ trắng + giày xanh mũi cong ----------
 const leg=(x,lift)=>{
  for(let y=24;y<27-lift;y++)r(y%2?WH:ST,x,y,4,1);
  r(WS,x+3,24,1,3-lift);
  r(SH,x,27-lift,4,2);r(SHL,x,27-lift,2,1);r(SHD,x,29-lift,4,1);
  if(!side){r(SH,x,26-lift,1,1);r(SH,x+3,26-lift,1,1);r(GD,x+1,28-lift,1,1)}
  else{const tx=Rt?x+4:x-1;r(SH,tx,28-lift,1,1);r(SH,tx+(Rt?1:-1),27-lift,1,1);r(GD,tx+(Rt?1:-1),26-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 const arm=(x,ay)=>{u(GR,x,16+ay,3,5);u(GRL,x,16+ay,1,5);u(GRD,x+2,16+ay,1,5);u(RD,x,20+ay,3,1);u(SK,x,21+ay,3,3);u(SKD,x+2,21+ay,1,3)};
 const armUp=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u('rgba(0,0,0,.12)',x+ox,ty+2,3,1);u(RD,x,ty+3,3,1);u(GR,x,ty+4,3,3);u(GRL,x,ty+4,1,3);u(GRD,x+2,ty+4,1,3)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};
 if(!side){
  u(GR,4,15,12,7);u(GRL,4,15,2,6);u(GRD,14,15,2,7);u(GR,6,14,8,1);
  // váy xòe
  u(GR,3,22,14,2);u(GR,2,24,16,1);u(GRL,3,22,2,2);u(GRD,15,22,2,2);u(GRD,2,24,16,1);
  for(let x=3;x<17;x+=3)u(GRD,x,23,1,1);
  if(back){u(BK,4,21,12,1);u(RD,5,14,10,2);u(RDD,5,15,10,1)}
  else{
   u(BK,4,21,12,1);u(GD,9,21,2,1);u(GDD,9,21,1,1);u(BK,9,20,2,1);u(BK,9,22,2,1);u(GD,9,20,2,1);u(BK,10,20,1,1);   // khóa vàng
   u(GD,10,17,1,1);u(GD,10,19,1,1);u(GDL,10,17,1,1);
   // khăn đỏ xếp nếp
   u(RD,6,14,8,2);u(RDL,6,14,2,1);u(RDD,6,15,8,1);u(RD,5,15,1,1);u(RD,14,15,1,1);u(RDL,9,16,2,1);u(RDD,8,16,1,1);u(RDD,11,16,1,1);
  }
  arms();
 }else{
  u(GR,7,16,7,6);u(GRD,Rt?7:12,16,2,6);u(GR,8,14,6,2);
  M(GR,5,22,10,2);M(GR,4,24,12,1);M(GRD,4,24,12,1);M(BK,6,21,8,1);M(GD,11,21,2,1);M(GD,12,17,1,1);M(GD,12,19,1,1);
  M(RD,8,14,6,2);M(RDD,8,15,6,1);M(RDL,8,14,2,1);
  const ax=9-sx;
  if(!o.noarm){u(GR,ax,16,3,4);u(GRL,ax,16,3,1);u(GRD,ax,19,3,1);u(RD,ax,20,3,1);u(SK,ax,21,3,3);u(SKD,ax+1,23,2,1)}
 }
 u(SK,9,14,2,1);

 // ---------- đầu ----------
 if(back)fill(HC,MSTD.HF);
 else if(!side){fill(SK,MSTD.HF);u(SKL,5,8,3,3);u(SKD,15,9,2,4);u(SKD,6,13,8,1)}
 else{fill(SK,MSTD.HS,1);M(SKL,9,8,3,3);M(SKD,13,9,2,4);M(SKD,6,13,8,1)}

 // ---------- tóc (khác nhau duy nhất giữa Nam / Nữ) ----------
 if(fem){   // hồng nhạt dài ngang cổ, đuôi tóc xòe ra
  const fl=y=>(y>=12?1:0);
  if(back){
   u(HC,4,6,12,9);u(HC,3,11,14,4);u(HL,6,7,3,1);u(HL,7,9,1,5);u(HL,13,9,1,5);u(HD,4,8,1,6);u(HD,15,8,1,6);u(HD,10,9,1,5);
   for(let x=3;x<17;x+=2)u(HD,x,14,1,1);
  }else if(!side){
   u(HC,4,7,12,2);u(HL,7,7,3,1);u(HL,11,7,2,1);u(HC,4,9,2,1);u(HC,14,9,2,1);u(HC,8,9,1,1);u(HC,11,9,1,1);u(HC,9,9,2,1);u(HD,10,9,1,1);
   for(let y=9;y<=14;y++){const w=fl(y);u(HC,3-w,y,3+w,1);u(HC,14,y,3+w,1);if(y%2)u(HL,4,y,1,1);u(HD,3-w,y,1,1);u(HD,16+w,y,1,1)}
   u(HS,2,14,2,1);u(HS,16,14,2,1);
  }else{
   M(HC,4,7,10,2);M(HL,6,7,3,1);M(HC,11,9,3,1);
   M(HC,2,8,7,7);M(HC,1,12,3,3);M(HL,4,9,1,5);M(HD,2,10,1,5);M(HD,7,11,1,3);M(HS,1,14,2,1);
   M(HC,8,10,2,3);
  }
 }else{     // đen ngắn, rối
  if(back){
   u(HC,4,6,12,6);u(HC,5,12,10,1);u(HL,6,7,3,1);u(HL,12,8,2,1);u(HD,4,9,1,3);u(HD,15,9,1,3);u(HD,9,9,2,3);
   for(let x=5;x<15;x+=2)u(HD,x,12,1,1);
  }else if(!side){
   u(HC,4,7,12,2);u(HC,3,8,2,3);u(HC,15,8,2,3);
   u(HC,5,9,3,1);u(HC,12,9,3,1);u(HC,8,9,1,1);u(HC,10,9,2,1);u(HL,6,7,3,1);u(HL,12,7,2,1);u(HD,3,10,1,1);u(HD,16,10,1,1);
   u(HC,4,6,1,1);u(HC,15,6,1,1);u(HS,9,8,1,1);
  }else{
   M(HC,4,7,10,2);M(HC,2,7,6,6);M(HC,10,9,4,1);M(HC,11,9,2,1);M(HL,6,7,3,1);M(HD,2,11,1,2);M(HD,6,10,1,2);
  }
 }

 // ---------- tai yêu tinh nhọn ----------
 if(!back){
  if(!side){SY(SK,2,10,2,1);SY(SK,1,9,2,1);SY(SK,1,8,1,1);SY(SKD,3,10,1,1)}
  else{M(SK,2,10,2,1);M(SK,1,9,2,1);M(SK,1,8,1,1);M(SKD,3,10,1,1)}
 }

 // ---------- mũ yêu tinh: viền xanh + vương miện đỏ 5 chuông + đuôi mũ rủ ----------
 const crown=(Rf,x0,x1,spikes,tailX)=>{
  Rf(GR,x0+1,5,x1-x0-2,1);Rf(GRL,x0+1,5,x1-x0-2,1);Rf(GR,x0,6,x1-x0,1);Rf(GRD,x0,6,x1-x0,1);Rf(GRL,x0+1,5,3,1);       // viền xanh
  Rf(RD,x0,2,x1-x0,3);Rf(RDL,x0,2,x1-x0,1);Rf(RDD,x0,4,x1-x0,1);
  spikes.forEach((c,i)=>{const cx=c[0],h=c[1];
   Rf(RD,cx-1,1,3,1);Rf(RDL,cx-1,1,1,1);
   for(let j=2;j<=h;j++){Rf(RD,cx,2-j,1,1);Rf(RDL,cx,2-j,1,1)}
   bell(Rf,cx-(i%2?1:0),2-h-2,t,i)});
  // đuôi mũ rủ xuống, có chuông ở cuối
  const tx=tailX,d=sw;
  Rf(GR,tx,4,2,3);Rf(GR,tx+1+(d>0?0:0),7,2,3);Rf(GR,tx+1+d,10,2,2);Rf(GRD,tx+1,7,1,3);Rf(GRD,tx+1+d,10,1,2);
  bell(Rf,tx+d,12,t,9);
 };
 if(!side){
  const ox=back?-0:0;
  crown(u,3,17,[[4,2],[7,3],[10,3],[13,3],[16,2]],back?1:17);
 }else{
  crown((c,x,y,w,h)=>M(c,x,y,w,h),2,15,[[3,2],[6,3],[9,3],[12,2]],0);
 }

 // ---------- mặt: không che biểu cảm ----------
 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
 }
}
window.drawMascotWinter=drawWinter;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.wint=drawWinter;
})();
