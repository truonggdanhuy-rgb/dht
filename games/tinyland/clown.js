/* ===================================================================================
   CLOWN.JS — 🤡 Mascot HỀ QUÁI ĐẢN (1 set chung, không phân nam/nữ)
   • Khai báo ở CUỐI mảng SETS (index.html): {k:'clown', mascot:'clown'}
   • Bán ở TIỆM CHÚ HỀ (circus.js): cần ĐỦ 3 thứ mới mua được — 1500 Xu + 500 Xu quái vật + 5 Kim cương
   • Hình: nón hề CAO 2 màu (sừng xanh + sừng trắng cong, sao hồng, viền hồng, 2 quả bông hồng),
     tóc xanh đậm, mặt trắng má hồng, nơ cổ sọc xanh-trắng, áo khoác xanh tay phồng viền hồng,
     ngực caro xanh-trắng, tất sọc xanh-trắng, giày xanh viền hồng, găng tay trắng.
   • File này chỉ chứa HÀM VẼ (không hiệu ứng). KHÔNG che mặt.
   =================================================================================== */
(function(){
const rnd=Math.round;
// bảng màu
const CB='#3b32d6',CBL='#6a62f2',CBD='#241d9a',            // xanh áo / nón
      WH='#ffffff',WS='#d9d3ef',                            // trắng / bóng trắng
      PK='#ff6fc1',PKL='#ffb3e0',PKD='#c2418f',              // hồng
      HC='#2a2392',HL='#4a42d4',HD='#171172',                // tóc xanh đậm
      FW='#fff5f2',FD='#ead6e2',CHK='#ff8ccf',               // mặt trắng, má hồng
      SHB='#2c24b0',SHD='#1b1580',BL='#3b32d6';

function drawClown(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,mv=!!o.mv;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);                // nhìn ngang (tự lật khi quay trái)
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const sx=side?lg*(Rt?2:-2):0;
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân: tất sọc xanh-trắng + giày xanh viền hồng ----------
 const leg=(x,lift)=>{
  for(let y=24;y<27-lift;y++)r(y%2?WH:CB,x,y,4,1);
  u(WS,x+3,24,1,3-lift);
  u(PK,x,27-lift,4,1);u(PKL,x,27-lift,1,1);                // viền hồng cổ giày
  u(SHB,x,28-lift,4,1);u(SHD,x,29-lift,4,1);u(CBL,x,28-lift,1,1);
  if(!side){u(SHB,x,28-lift,4,1)}
  else{const tx=Rt?x+4:x-1;u(SHB,tx,28-lift,1,2);u(PK,tx+(Rt?1:-1),28-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 // tay: vai phồng xanh + cổ tay + găng trắng
 const arm=(x,ay)=>{
  const lx=x<8?x-1:x;                                        // vai phồng rộng 4
  u(CB,lx,15+ay,4,4);u(CBL,lx,15+ay,1,4);u(CBD,lx+3,15+ay,1,4);u(CBL,lx+1,15+ay,1,1);
  u(CB,x,19+ay,3,1);u(CBD,x+2,19+ay,1,1);
  u(PK,x,20+ay,3,1);                                         // cổ tay hồng
  u(WH,x,21+ay,3,3);u(WS,x+2,21+ay,1,3);u(WS,x,23+ay,3,1);
 };
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(WH,x+ox,ty,3,3);u(WS,x+ox+2,ty,1,3);u(PK,x,ty+3,3,1);
  u(CB,x,ty+4,3,3);u(CBL,x,ty+4,1,3);u(CBD,x+2,ty+4,1,3)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 if(!side){
  // áo khoác xanh
  u(CB,4,15,12,7);u(CBL,4,15,2,6);u(CBD,14,15,2,7);
  u(CB,3,22,14,2);u(CB,2,24,16,1);u(CBL,3,22,2,2);u(CBD,15,22,2,2);
  u(PK,2,24,16,1);for(const x of[4,8,12,15])u(WH,x,24,1,1);   // viền hồng gấu áo + sao trắng nhỏ
  if(back){
   u(CB,6,14,8,1);
   // sao hồng sau lưng (3x3)
   u(PK,10,17,1,3);u(PK,9,18,3,1);u(PKL,10,17,1,1);
   u(PK,4,21,12,1);                                          // đai hồng
   u(WH,6,14,8,2);for(let x=6;x<14;x+=2)u(CB,x,14,1,2);     // cổ xếp sau
  }else{
   // ngực caro xanh-trắng (ô 2x2)
   for(let rr=0;rr<4;rr++)for(let cc=0;cc<3;cc++)u((rr+cc)%2?WH:CB,7+cc*2,16+rr*2,2,2);
   u(PK,6,16,1,8);u(PK,13,16,1,8);                           // viền hồng 2 bên
   // nơ cổ sọc xanh-trắng
   u(WH,5,14,10,2);u(WS,5,15,10,1);
   for(const x of[6,8,11,13])u(CB,x,14,1,2);
   u(CB,9,14,2,2);u(CBL,9,14,1,1);
   for(const x of[6,8,11,13])u(WH,x,16,1,1);                // răng cưa ruffle
  }
  arms();
 }else{
  u(CB,7,16,7,6);u(CBD,Rt?7:12,16,2,6);u(CB,8,14,6,2);
  M(CB,5,22,10,2);M(CB,4,24,12,1);M(PK,4,24,12,1);M(CBD,5,23,10,1);M(WH,6,24,1,1);M(WH,10,24,1,1);M(WH,13,24,1,1);
  // ngực caro (nhìn ngang): 3 ô
  M(PK,12,16,1,7);
  for(let rr=0;rr<3;rr++)M(rr%2?WH:CB,10,16+rr*2,2,2);
  for(let rr=0;rr<3;rr++)M(rr%2?CB:WH,8,16+rr*2,2,2);
  // nơ cổ
  M(WH,8,14,6,2);M(CB,9,14,1,2);M(CB,11,14,1,2);M(CB,13,14,1,2);
  const ax=9-sx;
  if(!o.noarm){
   u(CB,ax-1,15,5,4);u(CBL,ax-1,15,1,4);u(CBD,ax+3,15,1,4);
   u(CB,ax,19,3,1);u(PK,ax,20,3,1);
   u(WH,ax,21,3,3);u(WS,ax+1,23,2,1)}
 }
 u(FW,9,14,2,1);

 // ---------- đầu: mặt trắng ----------
 if(back)fillRows(HC,MSTD.HF);
 else if(!side){fillRows(FW,MSTD.HF);u(FD,15,9,2,4);u(FD,6,13,8,1)}
 else{fillRows(FW,MSTD.HS,1);M(FD,13,9,2,4);M(FD,6,13,8,1)}

 // ---------- tóc xanh đậm (bob xoăn đuôi) ----------
 if(back){
  u(HC,4,6,12,9);u(HC,3,11,14,4);u(HL,6,7,3,1);u(HL,7,9,1,5);u(HL,13,9,1,5);u(HD,4,8,1,6);u(HD,15,8,1,6);u(HD,10,9,1,5);
  u(HC,2,13,2,2);u(HC,16,13,2,2);                            // đuôi tóc xoăn
  for(let x=3;x<17;x+=2)u(HD,x,14,1,1);
 }else if(!side){
  u(HC,4,7,12,1);u(HL,7,7,3,1);u(HL,11,7,2,1);u(HC,4,8,2,2);u(HC,14,8,2,2);u(HC,7,8,1,1);u(HC,9,8,2,1);u(HC,12,8,1,1);u(HD,10,8,1,1);
  for(let y=9;y<=13;y++){u(HC,3,y,2,1);u(HC,15,y,2,1);if(y%2){u(HL,3,y,1,1);u(HL,16,y,1,1)}u(HD,4,y,1,1);u(HD,15,y,1,1)}
  u(HC,2,12,2,2);u(HC,16,12,2,2);u(HL,2,12,1,1);u(HL,17,12,1,1);u(HD,3,13,1,1);u(HD,16,13,1,1);   // đuôi tóc xoăn
 }else{
  M(HC,4,7,10,1);M(HL,6,7,3,1);M(HC,4,8,3,1);M(HC,11,8,3,1);
  M(HC,2,8,7,7);M(HC,1,12,3,3);M(HL,4,9,1,5);M(HD,2,10,1,5);M(HD,7,11,1,3);M(HC,1,13,2,2);
  M(HC,8,10,2,3);
 }

 // ---------- mặt: má hồng + giọt xanh (vẽ trước, biểu cảm vẽ đè lên) ----------
 if(!back){
  if(!side){
   u(CHK,5,11,2,2);u(CHK,13,11,2,2);u(PKL,5,11,1,1);u(PKL,13,11,1,1);
   u(BL,14,9,1,2);u(CBL,14,9,1,1);                          // giọt/kim cương xanh cạnh mắt
   u(CB,9,12,2,1);                                          // mũi xanh
  }else{
   M(CHK,8,11,2,2);M(PKL,8,11,1,1);
   M(BL,12,9,1,2);
  }
 }

 // ---------- NÓN HỀ CAO 2 MÀU ----------
 // rows: [y, x0, x1(không gồm)]
 const BLUE=[[4,4,10],[3,4,10],[2,4,10],[1,4,9],[0,4,9],[-1,4,9],[-2,3,8],[-3,3,7],[-4,2,6],[-5,1,5],[-6,0,3]];
 const WHT=[[4,10,16],[3,10,16],[2,10,16],[1,10,16],[0,10,16],[-1,10,16],[-2,10,15],[-3,11,15],[-4,11,15],[-5,11,14],[-6,12,15],[-7,12,16],[-8,13,17],[-9,14,18],[-10,15,19],[-11,16,19]];
 const SBLUE=[[4,4,10],[3,4,10],[2,4,10],[1,4,9],[0,4,9],[-1,3,8],[-2,3,7],[-3,2,6],[-4,1,5],[-5,0,3]];
 const SWHT=[[4,8,14],[3,8,14],[2,8,14],[1,8,14],[0,8,14],[-1,8,13],[-2,8,13],[-3,9,13],[-4,9,13],[-5,10,13],[-6,10,14],[-7,11,15],[-8,12,16],[-9,13,17],[-10,14,18],[-11,15,18]];
 const horn=(P,main,lt,dk,Pf)=>P.forEach(q=>{Pf(main,q[1],q[0],q[2]-q[1],1);Pf(lt,q[1],q[0],1,1);Pf(dk,q[2]-1,q[0],1,1)});
 const pom=(Pf,x,y)=>{Pf(PK,x,y,2,2);Pf(PKL,x,y,1,1);Pf(PKD,x+1,y+1,1,1)};
 const star=(Pf,x,y)=>{Pf(PK,x,y-1,1,3);Pf(PK,x-1,y,3,1);Pf(PKL,x,y-1,1,1)};
 const band=(Pf,x0,x1)=>{
  Pf(PKL,x0,5,x1-x0,1);Pf(PK,x0,6,x1-x0,1);
  for(let x=x0+1;x<x1-1;x+=3){Pf(PKD,x,6,1,1);Pf(PKL,x+1,5,1,1)}   // chấm bi trên viền
 };
 if(!side){
  const F=back?((c,x,y,w,h)=>u(c,20-x-w,y,w,h)):u;          // nhìn sau: đảo trái-phải
  horn(WHT,WH,WH,WS,F);
  horn(BLUE,CB,CBL,CBD,F);
  star(F,6,2);star(F,5,-2);
  pom(F,0,-5);pom(F,18,-9);
  band(u,3,17);
 }else{
  const Fm=(c,x,y,w,h)=>M(c,x,y,w,h);
  horn(SBLUE,CB,CBL,CBD,Fm);
  horn(SWHT,WH,WH,WS,Fm);
  star(Fm,5,2);star(Fm,4,-2);
  pom(Fm,0,-4);pom(Fm,17,-9);
  band(Fm,2,16);
 }

 // ---------- mặt: không che biểu cảm ----------
 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
 }
}
window.drawMascotClown=drawClown;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.clown=drawClown;
})();
