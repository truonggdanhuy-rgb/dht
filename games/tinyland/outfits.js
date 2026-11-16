/* =====================================================================
   TINYLAND — Đồ mới: Hoodie, Áo dài, Bà ba, Tứ thân + Tóc & Khăn & Nón quai thao
   Vẽ pixel theo lưới nhân vật 20x31 (xem drawAv trong index.html).
   File này chỉ chứa phần VẼ. Dữ liệu (tên, màu) nằm ở SETS / HAIRS trong index.html,
   giá nằm ở SHOP trong pho-map.js.
   Hàm vẽ nhận (u, o, K):  u(màu,x,y,w,h) = tô ô vuông;  o = trạng thái;  K = hướng nhìn...
   ===================================================================== */
const SETFX={},HAIRFX={};
const _sw=()=>Math.round(Math.sin(performance.now()/110));            // lắc lư khi đi
// tô ô theo họa tiết caro (khăn rằn)
const CK=(u,x,y,w,h,c1,c2)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)u(((x+i+y+j)&1)?c1:c2,x+i,y+j,1,1)};
// tô các dải ngang [y,x0,x1]
const BANDS=(u,c,L)=>L.forEach(q=>u(c,q[1],q[0],q[2]-q[1]+1,1));

/* ============================== TÓC / MŨ / KHĂN ============================== */

// ---- Tóc Sailor Moon: 2 búi tròn đỏ + 2 đuôi tóc dài + vương miện vàng ----
HAIRFX.sailor=(u,o,K)=>{
 const{side,Rt,back,SK}=K,sw=o.mv?_sw():0,mx=(x,w)=>Rt?x:20-x-w,
 Y='#f6d96b',L='#fff3b0',D='#d9ae3c',R='#e63950',Rd='#a81f3a',G='#ffd23f';
 const bun=(x,y)=>{u(Y,x+1,y,3,1);u(Y,x,y+1,5,3);u(L,x+1,y+1,1,2);u(L,x+2,y,1,1);u(D,x+4,y+2,1,2);u(D,x+3,y+3,1,1);u(R,x,y+4,5,1);u(Rd,x+4,y+4,1,1);u(R,x+2,y-1,1,1)};
 if(!side){
  bun(3,1);bun(12,1);
  if(back){u(Y,5,6,10,8);u(L,8,6,3,1);u(D,5,12,10,2)}
  else{u(Y,5,6,10,2);u(L,8,6,2,1);u(Y,5,8,10,2);u(SK,9,9,2,1);u(L,7,8,1,1);u(L,12,8,1,1);u(Y,5,10,2,3);u(Y,13,10,2,3);
       u(G,7,7,6,1);u('#e63950',9,6,2,2)}
  for(let y=10;y<=28;y++){let x=y<=15?3:y==16?2:1,s=y>=24?2:y>=20?1:0;x=Math.max(0,x+sw*s);const w=y>=28?2:3;
   u(Y,x,y,w,1);u(D,x,y,1,1);if(y%4==0)u(L,x+1,y,1,1);
   u(Y,20-x-w,y,w,1);u(D,19-x,y,1,1);if(y%4==0)u(L,19-x-1,y,1,1)}
 }else{
  bun(mx(6,5),1);
  u(Y,mx(5,9),6,9,3);u(Y,mx(7,5),5,5,1);u(L,mx(8,3),6,3,1);u(Y,mx(10,4),9,4,1);
  u(G,mx(11,2),8,2,1);u(R,mx(12,1),7,1,1);
  for(let y=6;y<=28;y++){const s=o.mv?(y>=24?2:y>=18?1:0):0,x=(y<=14?4:3)-s,w=y>=28?2:3;
   u(Y,mx(x,w),y,w,1);u(D,mx(x,1),y,1,1);if(y%4==2)u(L,mx(x+1,1),y,1,1)}
 }
};

// ---- Tóc 2 chùm (búi kiểu Trung, buộc ruy băng đỏ) ----
HAIRFX.bun2=(u,o,K)=>{
 const{side,Rt,back,SK}=K,mx=(x,w)=>Rt?x:20-x-w,H='#2a2224',L='#52434b',R='#e0364f',Rd='#a3202f';
 const bun=(x,y)=>{u(H,x+1,y,3,1);u(H,x,y+1,5,2);u(L,x+1,y+1,1,2);u(R,x,y+3,5,1);u(Rd,x+4,y+3,1,1);u(H,x+1,y+4,3,1)};
 if(!side){
  bun(3,2);bun(12,2);
  if(back){E(u,H,10,10,4,4);u(H,6,6,8,2);u(L,8,6,2,1);u(H,7,13,6,2)}
  else{u(H,6,6,8,2);u(H,5,7,10,1);u(L,8,6,2,1);u(H,6,8,8,1);u(H,6,9,3,1);u(H,11,9,3,1);u(H,6,10,1,2);u(H,13,10,1,2);u(L,7,9,1,1)}
 }else{
  bun(mx(7,5),2);
  u(H,mx(5,9),6,9,3);u(H,mx(7,5),5,1,1);u(L,mx(8,3),6,3,1);u(H,mx(10,4),9,4,1);u(H,mx(6,3),9,3,4);
 }
};

// ---- Tóc nữ yêu kiều: đen suôn mượt, rủ dài, cài hoa cúc nhỏ ----
HAIRFX.longf=(u,o,K)=>{
 const{side,Rt,back}=K,mx=(x,w)=>Rt?x:20-x-w,H='#201a24',L='#4b4256',W='#ffffff',Yc='#ffc93c',Pk='#ffe3ee';
 const daisy=(cx,cy)=>{u(Pk,cx-1,cy-1,1,1);u(Pk,cx+1,cy-1,1,1);u(Pk,cx-1,cy+1,1,1);u(Pk,cx+1,cy+1,1,1);u(W,cx,cy-1,1,1);u(W,cx-1,cy,1,1);u(W,cx+1,cy,1,1);u(W,cx,cy+1,1,1);u(Yc,cx,cy,1,1)};
 if(!side&&!back){
  SPH(u,5,['......HHHH','.....HHHHH','....HHLLHH','....HHHHH.','....HHHH..','....HH....','....HH....','....HH....'],{H,L});
  for(let y=13;y<=23;y++){const x=y>=22?5:4,w=y>=22?2:3;u(H,x,y,w,1);u(H,20-x-w,y,w,1);if(y%4==2){u(L,5,y,1,1);u(L,14,y,1,1)}}
  daisy(14,8);
 }else if(back){
  E(u,H,10,9,5,4);u(H,5,10,10,13);u(H,6,23,8,1);
  for(let y=7;y<=22;y+=3){u(L,7,y,1,2);u(L,12,y,1,2)}
  daisy(14,8);
 }else{
  u(H,mx(5,9),6,9,3);u(H,mx(7,5),5,5,1);u(L,mx(8,3),6,3,1);u(H,mx(10,3),8,3,2);
  for(let y=9;y<=23;y++){const s=o.mv?(y>=21?2:y>=17?1:0):0,x=4-s;u(H,mx(x,y>=22?5:7-0),y,y>=22?5:7,1)}
  u(L,mx(5,1),12,1,3);u(L,mx(6,1),17,1,3);
  daisy(Rt?10:9,9);
 }
};

// ---- Tóc xinh yêu: bob đen ngang vai, cá tính, mái lệch + kẹp tóc ----
HAIRFX.bobf=(u,o,K)=>{
 const{side,Rt,back}=K,mx=(x,w)=>Rt?x:20-x-w,H='#17151c',L='#3b3650',Pn='#ff6fa5';
 if(!side&&!back){
  SPH(u,5,['......HHHH','.....HHHHH','....HHLLHH','....HHHHHH','....HHH.HH','....HH....','....HH....','....HH....','....HHH...','....HHH...','...HHHH...','...HH.....'],{H,L});
  u(H,15,17,2,3);u(H,14,16,2,1);u(Pn,13,8,2,1);u(Pn,14,9,1,1);
 }else if(back){
  E(u,H,10,9,5,4);u(H,6,5,8,1);u(H,5,11,10,6);u(H,4,16,12,1);u(H,4,17,2,1);u(H,14,17,2,3);
  u(L,8,7,2,1);u(L,7,12,1,3);u(L,12,12,1,3);
 }else{
  u(H,mx(5,9),6,9,3);u(H,mx(7,5),5,5,1);u(L,mx(8,3),6,3,1);u(H,mx(10,4),9,4,1);u(H,mx(10,2),10,2,1);
  u(H,mx(4,6),10,6,6);u(H,mx(3,6),16,6,1);u(H,mx(3,2),17,2,1);u(L,mx(6,1),11,1,3);
  u(Pn,mx(10,2),8,2,1);
 }
};

// ---- Khăn rằn (xanh lá - trắng, thắt nút, đuôi khăn rủ) ----
HAIRFX.krang=(u,o,K)=>{
 const{side,Rt,back,HC}=K,sw=o.mv?_sw():0,mx=(x,w)=>Rt?x:20-x-w,G='#2f8f5b',W='#f7f7ef',Dg='#1c6a41';
 const dome=(L)=>L.forEach(q=>CK(u,q[1],q[0],q[2]-q[1]+1,1,G,W));
 if(!side){
  dome([[4,7,12],[5,6,13],[6,5,14],[7,5,14],[8,5,14],[9,6,13]]);
  u(Dg,6,9,8,1);
  if(!back){u(HC,6,10,1,2);u(HC,13,10,1,2);
   CK(u,14,8,3,3,G,W);u(Dg,15,9,1,1);CK(u,14,11,2,4,G,W);CK(u,16+(sw>0?1:0),11,2,3,G,W)}
  else{CK(u,9,8,2,2,G,W);u(Dg,9,10,2,1);CK(u,7+sw,10,3,5,G,W);CK(u,10+sw,10,3,4,G,W)}
 }else{
  [[4,7,5],[5,6,7],[6,5,9],[7,5,9],[8,5,9],[9,6,7]].forEach(q=>CK(u,mx(q[1],q[2]),q[0],q[2],1,G,W));
  CK(u,mx(5,9),6,9,2,G,W);CK(u,mx(5,9),8,9,2,G,W);u(Dg,mx(6,8),9,8,1);
  CK(u,mx(3,3),8,3,3,G,W);u(Dg,mx(4,1),9,1,1);
  const s=o.mv?1:0;CK(u,mx(2-s,2),11,2,5,G,W);CK(u,mx(4-s,2),11,2,4,G,W);
 }
};

// ---- Khăn mấn (khăn vấn): turban đen quấn nhiều lớp, viền chỉ vàng ----
HAIRFX.kman=(u,o,K)=>{
 const{side,Rt,back}=K,mx=(x,w)=>Rt?x:20-x-w,T='#2a2536',L='#4d4766',Gd='#e0b64a';
 if(!side){
  const R=[[3,7,12],[4,6,13],[5,5,14],[6,4,15],[7,4,15],[8,5,14],[9,6,13]];
  R.forEach(q=>u(T,q[1],q[0],q[2]-q[1]+1,1));
  const ok=(x,y)=>R.some(q=>q[0]==y&&x>=q[1]&&x<=q[2]);
  for(let i=0;i<5;i++){if(ok(5+i,8-i))u(L,5+i,8-i,1,1);if(ok(9+i,8-i))u(L,9+i,8-i,1,1);if(ok(8+i,3+i+1)&&i<2)u(L,8+i,4+i,1,1)}
  u(L,7,3,3,1);u(Gd,6,9,8,1);if(!back)u('#e63950',9,8,2,1);
 }else{
  const R=[[3,6,11],[4,5,12],[5,4,13],[6,4,13],[7,4,13],[8,4,13],[9,5,12]];
  R.forEach(q=>u(T,mx(q[1],q[2]-q[1]+1),q[0],q[2]-q[1]+1,1));
  for(let i=0;i<6;i++){const x=4+i,y=8-i;if(y>=4)u(L,mx(x,1),y,1,1)}
  u(L,mx(7,3),3,3,1);u(L,mx(9,3),6,3,1);u(Gd,mx(5,8),9,8,1);
 }
};

// ---- Nón quai thao: vành rộng phẳng + quai thao (ruy băng) rủ xuống có tua ----
HAIRFX.qthao=(u,o,K)=>{
 const{side,Rt,back,HC}=K,sw=o.mv?_sw():0,mx=(x,w)=>Rt?x:20-x-w,
 RIM='#b88a4a',RD='#8f6a36',TOP='#3a2a22',HL='#5b4535',CR='#2c211a',RB='#c93a63',RBD='#9c2848',TS='#f2c94c';
 E(u,RIM,10,6,9,2);E(u,TOP,10,5,8,2);E(u,HL,10,5,6,1);u(RD,3,8,14,1);
 E(u,CR,10,3,4,2);u(HL,8,2,3,1);u(RB,9,1,2,1);
 if(!back){u(HC,6,9,8,1);u(HC,6,10,1,2);u(HC,13,10,1,2)}
 const rib=(x,h)=>{u(RB,x,8,2,h);u(RBD,x,8,1,h);u(TS,x+sw,8+h,2,3);u(RD,x+sw,8+h+2,2,1)};
 if(!side){rib(4,9);rib(14,9)}
 else{const bx=Rt?7:11,s=o.mv?(Rt?-1:1):0;u(RB,bx,8,2,9);u(RBD,bx,8,1,9);u(TS,bx+s,17,2,3);u(RD,bx+s,19,2,1)}
};

/* ================================ SET ÁO ================================ */

// ---- Hoodie form rộng: mũ trùm, túi kangaroo, dây rút, tay áo dài rộng ----
SETFX.hoodie=(u,o,S,K)=>{
 const{side,Rt,back,lg,sx,SK}=K,C=S.sh,CL=S.shl,CD=S.shd,HS=S.hs,P=shade(C,.1),aL=lg,aR=-lg,mx=(x,w)=>Rt?x:20-x-w;
 if(!side){
  u(C,5,16,10,1);u(C,4,17,12,8);u(CD,5,25,10,1);u(CD,4,24,1,1);u(CD,15,24,1,1);u(CL,6,18,1,2);
  if(!back){
   u(CD,6,15,8,1);u(C,5,14,2,3);u(C,13,14,2,3);u(CL,5,14,1,2);u(CD,7,16,6,1);u(CL,6,16,1,1);u(CL,13,16,1,1);u(SK,9,15,2,2);
   u(P,6,20,8,4);u(CD,7,20,6,1);u(CD,6,21,1,3);u(CD,13,21,1,3);u(CD,6,24,8,1);
   u(HS,8,17,1,4);u(HS,11,17,1,4);u('#b9b9c2',8,21,1,1);u('#b9b9c2',11,21,1,1);
  }else{
   u(CD,5,14,10,2);u(shade(C,-.12),5,16,10,5);u(CD,5,21,10,1);u(CL,7,17,1,3);u(CD,9,16,2,5);
  }
  u(C,1,17+aL,4,5);u(CL,1,17+aL,1,5);u(CD,4,17+aL,1,5);u(CD,1,22+aL,4,1);u(SK,2,23+aL,3,1);
  u(C,15,17+aR,4,5);u(CL,15,17+aR,1,5);u(CD,18,17+aR,1,5);u(CD,15,22+aR,4,1);u(SK,15,23+aR,3,1);
 }else{
  u(C,7,16,7,1);u(C,6,17,9,8);u(CD,6,25,9,1);u(CD,mx(13,2),17,2,8);u(CL,mx(7,1),18,1,3);
  u(CD,mx(4,5),14,5,3);u(C,mx(5,4),15,4,5);u(CL,mx(5,1),15,1,3);u(SK,9,15,2,1);
  u(HS,mx(12,1),17,1,4);
  if(!o.noarm){const ax=9-sx;u(C,ax-1,17,4,5);u(CL,ax-1,17,1,5);u(CD,ax+2,17,1,5);u(CD,ax-1,22,4,1);u(SK,ax,23,3,1)}
 }
};

// ---- Set giữ nhiệt: áo len form rộng + khăn len dày che cổ (đổi bằng Huy hiệu tuyết) ----
SETFX.warm=(u,o,S,K)=>{
 const{side,Rt,back,lg,sx,SK}=K,C=S.sh,CL=S.shl,CD=S.shd,SC=S.scarf,SC2=S.trim,SCD='#8a1f1c',aL=lg,aR=-lg,mx=(x,w)=>Rt?x:20-x-w,RIB='rgba(130,90,50,.20)';
 if(!side){
  u(C,5,16,10,1);u(C,3,17,14,8);u(CD,3,25,14,1);u(CD,3,24,14,1);
  for(let x=4;x<=15;x+=2)u(RIB,x,18,1,6);u(CL,4,17,1,6);u(CD,16,17,1,7);
  if(!back){u(S.hs,7,21,6,1);u(S.hs,6,22,8,1);for(let x=7;x<13;x+=2)u(CL,x,21,1,1)}   // họa tiết sọc ngang
  u(C,0,17+aL,4,6);u(CL,0,17+aL,1,6);u(CD,3,17+aL,1,6);u(CD,0,22+aL,4,1);u(SK,1,23+aL,2,1);
  u(C,16,17+aR,4,6);u(CL,16,17+aR,1,6);u(CD,19,17+aR,1,6);u(CD,16,22+aR,4,1);u(SK,17,23+aR,2,1);
  // khăn len dày 4 lớp + đuôi khăn rủ xuống
  u(SC,6,15,8,1);u(SC2,5,16,10,1);u(SC,5,17,10,1);u(SC2,5,18,10,1);u(SCD,5,18,10,1-1);
  u(SCD,5,19,10,1);u(CL,6,15,1,1);u(CL,6,17,1,1);
  if(!back){u(SC,11,19,3,2);u(SC2,11,21,3,1);u(SC,11,22,3,2);u(SC2,11,24,3,1);u(SCD,13,19,1,5);u(SC,11,25,1,1);u(SC,13,25,1,1)}
  else{u(SC,6,19,8,1)}
 }else{
  u(C,7,16,7,1);u(C,5,17,10,8);u(CD,5,25,10,1);u(CD,5,24,10,1);u(CD,mx(13,2),17,2,8);u(CL,mx(5,1),18,1,5);
  for(let x=7;x<=13;x+=2)u(RIB,mx(x,1),18,1,6);
  if(!o.noarm){const ax=8-sx;u(C,ax-1,17,5,6);u(CL,ax-1,17,1,6);u(CD,ax+3,17,1,6);u(CD,ax-1,22,5,1);u(SK,ax,23,3,1)}
  u(SC,7,15,6,1);u(SC2,6,16,8,1);u(SC,6,17,8,1);u(SC2,6,18,8,1);u(SCD,6,19,8,1);
  u(SC,mx(7,3),19,3,2);u(SC2,mx(7,3),21,3,1);u(SC,mx(7,3),22,3,2);u(SC,mx(7,1),24,1,1);u(SC,mx(9,1),24,1,1);
 }
};

// ---- Áo dài (nữ trắng / nam gấm / cách tân hồng): cổ đứng, vạt dài xẻ tà ----
SETFX.adai=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK}=K,C=S.sh,CL=S.shl,CD=S.shd,T=S.trim,CO=S.col||T,P=S.pants,FL=rd?3:(S.fl||5),aL=lg,aR=-lg,
 mx=(x,w)=>Rt?x:20-x-w,sw=o.mv?_sw():0,lfL=lg>0?1:0,lfR=lg<0?1:0;
 if(!side){
  // cổ đứng
  u(CO,8,15,1,2);u(CO,11,15,1,2);u(CO,8,16,4,1);u(SK,9,15,2,1);
  // tay dài
  u(C,2,21+aL,3,2);u(T,2,22+aL,3,1);u(C,15,21+aR,3,2);u(T,15,22+aR,3,1);
  if(!back){
   [[10,16],[9,17],[8,18],[7,19],[6,20]].forEach(q=>u(T,q[0],q[1],1,1));u(T,6,21,1,2);u('#fff6d8',8,18,1,1);u('#fff6d8',6,20,1,1);
   u(CD,12,17,2,5);
  }
  if(S.dots){for(let y=18;y<22+FL;y+=2)for(let x=(y%4==0?7:8);x<13;x+=3)u(S.dots,x,y,1,1)}
  if(S.bowc&&!back){u(S.bowc,7,22,2,2);u(S.bowc,11,22,2,2);u(shade(S.bowc,-.25),9,22,2,2)}
  // vạt áo
  u(C,7,23,6,FL-1);u(CL,7,23,1,FL-1);u(CD,12,23,1,FL-1);u(CD,9,24,1,FL-2);
  const hx=7+(o.mv?sw:0);u(S.hem?T:C,hx,22+FL,6,1);
  if(S.hem){u(T,7,22+FL-1,6,1)}
  // ống quần
  if(!sit&&!rd){u(P,5,27,4,2-lfL);u(P,11,27,4,2-lfR);u(shade(P,-.15),8,27,1,2-lfL);u(shade(P,-.15),11,27,1,2-lfR)}
 }else{
  u(CO,Rt?9:8,15,3,2);u(SK,9,15,2,1);
  if(!o.noarm){const ax=9-sx;u(C,ax,21,3,2);u(T,ax,22,3,1)}
  u(C,7,23,7,FL-1);u(CL,mx(12,1),23,1,FL-1);u(S.hem?T:C,7,22+FL,7,1);
  const bx=mx(5,2),s=o.mv?(Rt?-1:1)*(sw>0?1:0):0,BK=shade(C,-.08);u(BK,bx,23,2,FL-1);u(BK,bx+s,22+FL-1,2,1);
  if(S.dots)for(let y=24;y<22+FL;y+=2)u(S.dots,9,y,1,1);
  if(!sit&&!rd){const x1=8+sx,x2=10-sx,l1=lg>0?1:0,l2=lg<0?1:0;u(P,x1,27,3,2-l1);u(P,x2,27,3,2-l2)}
 }
};

// ---- Áo bà ba (nữ) / áo bà ba nâu (nam): áo rộng cài nút giữa + quần lụa đen ống rộng ----
SETFX.baba=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK}=K,C=S.sh,CL=S.shl,CD=S.shd,P=S.pants,PL=shade(P,.22),PD=shade(P,-.25),aL=lg,aR=-lg,
 mx=(x,w)=>Rt?x:20-x-w,lfL=lg>0?1:0,lfR=lg<0?1:0;
 if(!side){
  if(!sit&&!rd){u(P,5,24,4,5-lfL);u(PL,5,24,1,5-lfL);u(P,11,24,4,5-lfR);u(PD,14,24,1,5-lfR)}
  u(C,5,16,10,1);u(C,4,17,12,7);u(CD,4,24,12,1);u(CD,4,23,1,1);u(CD,15,23,1,1);u(CL,5,17,1,5);
  u(CD,8,15,1,2);u(CD,11,15,1,2);u(CD,8,16,4,1);u(SK,9,15,2,1);
  if(!back){
   u(CD,10,17,1,7);for(const y of[18,20,22])u(S.btn||'#f7f1e1',9,y,1,1);
   if(S.pk){u(CD,5,20,4,3);u(C,6,21,2,1);u(CD,11,20,4,3);u(C,12,21,2,1)}
  }else u(CD,9,17,2,7);
  if(S.dots){[[6,18],[13,19],[7,22],[12,22],[10,20],[5,21]].forEach(q=>u(S.dots,q[0],q[1],1,1))}
  u(C,1,17+aL,4,5);u(CL,1,17+aL,1,5);u(CD,4,17+aL,1,5);u(CL,1,22+aL,4,1);u(SK,2,23+aL,3,1);
  u(C,15,17+aR,4,5);u(CL,15,17+aR,1,5);u(CD,18,17+aR,1,5);u(CL,15,22+aR,4,1);u(SK,15,23+aR,3,1);
 }else{
  if(!sit&&!rd){const x1=8+sx,x2=10-sx,l1=lg>0?1:0,l2=lg<0?1:0;u(P,x1-1,24,4,5-l1);u(PL,x1-1,24,1,5-l1);u(P,x2,24,4,5-l2);u(PD,x2+3,24,1,5-l2)}
  u(C,7,16,7,1);u(C,6,17,9,7);u(CD,6,24,9,1);u(CD,mx(13,2),17,2,7);
  u(CD,Rt?9:8,15,3,2);u(SK,9,15,2,1);u(CD,mx(12,1),17,1,7);
  if(S.pk){u(CD,mx(10,3),20,3,3);u(C,mx(10,2),21,2,1)}
  if(!o.noarm){const ax=9-sx;u(C,ax-1,17,4,5);u(CL,ax-1,17,1,5);u(CD,ax+2,17,1,5);u(CL,ax-1,22,4,1);u(SK,ax,23,3,1)}
 }
};

// ---- Áo tứ thân: yếm + áo nâu/hồng mở vạt + váy + thắt lưng buông giữa ----
SETFX.tuthan=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK}=K,C=S.sh,CL=S.shl,CD=S.shd,T=S.trim,Y=S.yem,YD=S.yd,V=S.vay,VD=shade(V,-.28),VL=shade(V,.2),SA=S.sash,
 aL=lg,aR=-lg,mx=(x,w)=>Rt?x:20-x-w,sw=o.mv?_sw():0;
 const lotus=(cx,cy)=>{u('#f06fa0',cx,cy,2,1);u('#f06fa0',cx-1,cy+1,1,1);u('#f06fa0',cx+2,cy+1,1,1);u('#ffffff',cx,cy+1,2,1);u('#f06fa0',cx-1,cy+2,4,1);u('#3d9a63',cx,cy+3,2,1)};
 // váy
 if(!side){
  u(V,5,22,10,4);u(V,4,26,12,2);u(V,3+(o.mv?sw:0),28,14,1);
  u(VD,7,23,1,5);u(VD,12,23,1,5);u(VL,9,24,1,4);u(VL,5,26,1,2);u(VL,14,26,1,2);u(VD,10,23,1,5);
  if(S.lotus){for(let x=3;x<17;x+=2)u(S.lotus,x+(o.mv?sw:0),28,1,1);for(const[x,y]of[[8,25],[11,27],[6,27],[13,26]])u(VL,x,y,2,1)}
  else u(S.hemc,3+(o.mv?sw:0),28,14,1);
  if(!back){
   // yếm
   u(Y,9,16,2,1);u(Y,8,17,4,1);u(Y,7,18,6,2);u(Y,8,20,4,2);u(shade(Y,-.12),12,18,1,2);u(YD,8,15,1,1);u(YD,11,15,1,1);u(YD,8,16,1,1);u(YD,11,16,1,1);
   if(S.lotus)lotus(9,18);
   // vạt áo hai bên (mở ra, để lộ yếm + váy)
   u(C,4,22,3,4);u(CL,4,22,1,4);u(CD,6,22,1,4);u(C,13,22,3,4);u(CD,15,22,1,4);u(CL,13,22,1,4);u(T,4,25,3,1);u(T,13,25,3,1);
   // thắt lưng buông giữa
   u(SA,5,22,10,1);u(shade(SA,-.2),5,22,1,1);u(shade(SA,-.2),14,22,1,1);u(SA,9,23,2,4);u(shade(SA,-.2),10,23,1,4);u(shade(SA,.3),9,23,1,1);u(T,9,27,2,1);
  }else{
   u(C,5,16,10,9);u(CD,9,17,2,8);u(CL,5,17,1,7);u(CD,14,17,1,7);u(T,5,24,10,1);
   u(SA,7,21,6,2);u(SA,9,22,2,1);u(shade(SA,-.2),12,21,1,2);u(SA,8,23,1,4);u(SA,11,23,1,4);
  }
  // tay áo rộng
  u(C,1,17+aL,4,5);u(CL,1,17+aL,1,5);u(CD,4,17+aL,1,5);u(T,1,22+aL,4,1);u(SK,2,23+aL,3,1);
  u(C,15,17+aR,4,5);u(CL,15,17+aR,1,5);u(CD,18,17+aR,1,5);u(T,15,22+aR,4,1);u(SK,15,23+aR,3,1);
 }else{
  u(V,6,22,9,4);u(V,5,26,11,2);u(V,4+(o.mv?sw:0),28,12,1);u(VD,mx(10,1),23,1,5);u(VL,mx(8,1),24,1,3);
  if(S.lotus)for(let x=4;x<16;x+=2)u(S.lotus,x+(o.mv?sw:0),28,1,1);else u(S.hemc,4+(o.mv?sw:0),28,12,1);
  u(Y,mx(11,3),17,3,5);u(shade(Y,-.12),mx(11,1),17,1,5);u(YD,Rt?11:8,15,1,2);
  if(S.lotus)u('#f06fa0',mx(12,1),19,1,2);
  u(C,7,22,7,3);u(CL,mx(12,1),22,1,3);u(CD,mx(7,1),22,1,3);u(T,7,24,7,1);
  u(SA,7,22,7,1);u(SA,mx(4,3),22,3,1);u(SA,mx(4,2)+(Rt?-(sw>0?1:0):(sw>0?1:0)),23,2,3);u(T,mx(4,2)+(Rt?-(sw>0?1:0):(sw>0?1:0)),26,2,1);
  if(!o.noarm){const ax=9-sx;u(C,ax-1,17,4,5);u(CL,ax-1,17,1,5);u(CD,ax+2,17,1,5);u(T,ax-1,22,4,1);u(SK,ax,23,3,1)}
 }
};

/* --- sprite đối xứng: mỗi dòng 10 ký tự (nửa trái x0..9), tự lật sang nửa phải --- */
function SPH(u,y0,rows,pal){rows.forEach((s,j)=>{let i=0;while(i<s.length){const ch=s[i];if(ch=='.'||ch==' '){i++;continue}let k=i;while(k<s.length&&s[k]==ch)k++;const c=pal[ch];if(c){u(c,i,y0+j,k-i,1);u(c,20-k,y0+j,k-i,1)}i=k}})}

/* ============ TÓC MÀU MỚI (nam / nữ) — dùng bảng màu HS.p trong HAIRS ============
   p = mảng màu. lwave/twt/pony: màu đổi dần từ trên xuống. spike: HS.m=='r' => mỗi gai 1 màu (cầu vồng), còn lại gốc p[0] – ngọn p[1]. */
const _gy=(p,t)=>p[Math.max(0,Math.min(p.length-1,Math.floor(t*p.length)))];
const _hs=K=>K.HS||{p:['#888']};
const _sh=(c,k)=>(typeof shade=='function'?shade(c,k):c);

// ---- Tóc dài gợn sóng (nữ) ----
HAIRFX.lwave=(u,o,K)=>{
 const{side,Rt,back}=K,p=_hs(K).p,mx=(x,w)=>Rt?x:20-x-w,sw=o.mv?_sw():0,
 cy=y=>_gy(p,(y-5)/22),W=y=>Math.round(Math.sin(y/2.3)),
 row=(x,y,w)=>{const c=cy(y);u(c,x,y,w,1);u(_sh(c,.35),x+(w>2?1:0),y,1,1);u(_sh(c,-.25),x+w-1,y,1,1)},
 cap=(x0,w,y)=>{const c=cy(y);u(c,x0,y,w,1)};
 if(!side&&!back){
  cap(7,6,5);cap(6,8,6);cap(5,10,7);cap(5,10,8);
  u(_sh(cy(6),.4),8,6,3,1);u(_sh(cy(6),.4),7,7,1,1);
  u(cy(8),5,9,2,3);u(cy(8),13,9,2,3);u(cy(9),9,9,2,1);u(cy(9),7,9,1,1);u(cy(9),12,9,1,1);
  for(let y=12;y<=27;y++){const s=y>=22?Math.min(2,sw):0,d=W(y);row(Math.max(0,3+d+s),y,3);row(14-d-s,y,3)}
 }else if(back){
  cap(7,6,5);cap(6,8,6);
  for(let y=7;y<=27;y++){const d=W(y);row(4+d,y,12-2*d>12?12:12);}
  for(let y=9;y<=27;y+=3){u(_sh(cy(y),.35),8,y,1,2);u(_sh(cy(y),.35),12,y,1,2)}
 }else{
  u(cy(5),mx(7,6),5,6,1);u(cy(6),mx(5,9),6,9,1);u(cy(7),mx(5,9),7,9,2);
  u(_sh(cy(6),.4),mx(8,3),6,3,1);u(cy(9),mx(10,3),9,3,1);
  for(let y=9;y<=27;y++){const d=W(y),s=o.mv?(y>=22?2:y>=16?1:0):0;row(mx(3+d-s,7),y,7)}
 }
 // bông hoa cài đầu (trắng / vàng) cho đỡ giống đầu trọc
 {const Y=_hs(K).fl=='y',P=Y?'#ffe45c':'#ffffff',S=Y?'#f2b81e':'#dfe6f2',C=Y?'#ff8a1e':'#ffc83d',
  fx=back?11:side?mx(6,5):5,fy=3;
  [[2,0],[1,1],[2,1],[3,1],[0,2],[1,2],[3,2],[4,2],[1,3],[2,3],[3,3],[2,4]].forEach(([a,b])=>u(b>2?S:P,fx+a,fy+b,1,1));
  if(!back)u(C,fx+2,fy+2,1,1)}
};

// ---- Hai chùm đuôi dài buộc nơ (nữ) ----
HAIRFX.twt=(u,o,K)=>{
 const{side,Rt,back}=K,p=_hs(K).p,mx=(x,w)=>Rt?x:20-x-w,sw=o.mv?_sw():0,B=_hs(K).b||'#ff4f93',
 cy=y=>_gy(p,(y-5)/20),
 tail=(x,y0,y1,dr)=>{for(let y=y0;y<=y1;y++){const t=(y-y0)/(y1-y0),w=t>.85?2:3,d=Math.round(dr*t*1.5);const c=cy(y);u(c,x+d,y,w,1);u(_sh(c,.35),x+d,y,1,1)}};
 if(!side){
  u(cy(5),7,5,6,1);u(cy(6),6,6,8,1);u(cy(7),5,7,10,2);u(_sh(cy(6),.4),8,6,3,1);
  if(!back){u(cy(9),5,9,2,3);u(cy(9),13,9,2,3);u(cy(9),9,9,2,1);u(cy(9),7,9,1,1);u(cy(9),12,9,1,1)}
  else{u(cy(9),5,9,10,5)}
  tail(2,8,23,sw);tail(15,8,23,-sw);
  u(B,2,8,3,2);u(B,15,8,3,2);u(_sh(B,.4),3,8,1,1);u(_sh(B,.4),16,8,1,1);
 }else{
  u(cy(5),mx(7,6),5,6,1);u(cy(6),mx(5,9),6,9,3);u(_sh(cy(6),.4),mx(8,3),6,3,1);u(cy(9),mx(10,3),9,3,1);u(cy(9),mx(6,5),9,4,1);
  tail(mx(2,3),8,24,o.mv?-sw:0);u(B,mx(2,3),8,3,2);u(_sh(B,.4),mx(3,1),8,1,1);
 }
};

// ---- Tóc đuôi ngựa buộc cao + hoa (nữ) ----
HAIRFX.pony=(u,o,K)=>{
 const{side,Rt,back}=K,H=_hs(K),p=H.p,mx=(x,w)=>Rt?x:20-x-w,sw=o.mv?_sw():0,F=H.b||'#fff3a8',
 cy=y=>_gy(p,(y-4)/20),
 tail=(x,y0,y1,dr)=>{for(let y=y0;y<=y1;y++){const t=(y-y0)/(y1-y0),w=t<.15?3:t>.85?2:4,d=Math.round(dr*t*2);const c=cy(y);u(c,x+d,y,w,1);u(_sh(c,.35),x+d,y,1,1);u(_sh(c,-.25),x+d+w-1,y,1,1)}},
 flower=(x,y)=>{u('#ffffff',x,y-1,1,1);u('#ffffff',x-1,y,1,1);u('#ffffff',x+1,y,1,1);u('#ffffff',x,y+1,1,1);u(F,x,y,1,1)};
 if(!side&&!back){
  u(cy(5),7,5,6,1);u(cy(6),6,6,8,1);u(cy(7),5,7,10,2);u(_sh(cy(6),.4),8,6,3,1);
  u(cy(9),5,9,2,3);u(cy(9),13,9,2,3);u(cy(9),9,9,2,1);u(cy(9),7,9,1,1);u(cy(9),12,9,1,1);
  u(cy(5),13,4,3,2);u(cy(6),15,6,2,5);u(_sh(cy(6),-.2),16,9,1,2);flower(14,6);
 }else if(back){
  u(cy(5),7,5,6,1);u(cy(6),6,6,8,1);u(cy(7),5,7,10,7);
  u(cy(4),8,3,4,2);tail(8,5,23,sw);u(_sh(cy(4),.4),9,3,1,1);flower(10,5);
 }else{
  u(cy(5),mx(7,6),5,6,1);u(cy(6),mx(5,9),6,9,3);u(_sh(cy(6),.4),mx(8,3),6,3,1);u(cy(9),mx(10,3),9,3,1);u(cy(9),mx(6,5),9,4,1);
  u(cy(4),mx(3,3),4,3,2);tail(mx(1,4),6,22,o.mv?-sw:0);flower(mx(4,1),6);
 }
};

// ---- Tóc gai nhiều màu (nam) ----
HAIRFX.spike=(u,o,K)=>{
 const{side,Rt,back}=K,H=_hs(K),p=H.p,mx=(x,w)=>Rt?x:20-x-w,rb=H.m=='r',
 base=i=>rb?p[i%p.length]:p[0],tip=i=>rb?p[i%p.length]:p[1]||p[0],
 sp=(cx,top,bot,i)=>{u(tip(i),cx,top,1,1);u(tip(i),cx-1,top+1,3,1);for(let y=top+2;y<=bot;y++)u(y<=top+3||rb?tip(i):base(i),cx-1,y,3,1);u(_sh(tip(i),.45),cx,top+1,1,1)};
 if(!side){
  u(base(0),6,6,8,3);u(base(2),5,7,10,2);
  [[6,2,6],[9,0,6],[12,1,6],[15,3,7],[4,3,7]].forEach(([cx,t,b],i)=>sp(cx,t+1,b+1,i+(rb?0:0)));
  sp(10,0,5,2);
  if(!back){u(base(1),6,9,2,2);u(base(1),12,9,2,2);u(base(1),9,9,2,1);u(_sh(base(1),.3),7,9,1,1);u(base(0),5,9,1,3);u(base(0),14,9,1,3);u(base(0),6,11,1,1);u(base(0),13,11,1,1)}
  else{u(base(1),5,9,10,4);u(_sh(base(1),-.25),6,12,8,1)}
 }else{
  u(base(0),mx(5,9),6,9,3);
  sp(mx(6,1)+(Rt?0:0),2,6,1);sp(mx(9,1),0,5,3);sp(mx(12,1),2,6,2);sp(mx(4,1)+(Rt?-1:1),5,8,0);
  u(base(1),mx(10,3),9,3,1);u(base(0),mx(6,4),9,4,3);
 }
};

// ---- Mũ giữ nhiệt: mũ lông trắng xù, có hai tai che kín tai (đổi bằng Huy hiệu tuyết) ----
HAIRFX.earfur=(u,o,K)=>{
 const{side,Rt,back}=K,mx=(x,w)=>Rt?x:20-x-w,
 W='#fbfbfd',L='#ffffff',D='#e2e7f1',DD='#c5cddd',LG='#9aa7bf',LG2='#d8dfec';
 const ro=(c,x0,x1,y)=>u(c,mx(x0,x1-x0+1),y,x1-x0+1,1);      // tô 1 hàng (tự lật theo hướng nhìn)
 const fluff=(x0,x1,y)=>{for(let x=x0;x<=x1;x++)if((x*3+y*5)%7==0)ro(D,x,x,y)};  // đốm lông xù
 if(!side){
  const R=[[2,8,11],[3,6,13],[4,5,14],[5,4,15],[6,4,15],[7,4,15],[8,4,15],[9,4,15]];
  R.forEach(q=>u(W,q[1],q[0],q[2]-q[1]+1,1));
  u(L,8,2,2,1);u(L,6,3,2,1);u(L,5,4,2,1);u(L,5,5,1,2);u(L,9,3,3,1);           // ánh sáng góc trên trái
  u(D,12,3,2,1);u(D,14,4,1,1);u(D,15,5,1,5);u(D,13,7,2,1);                     // bóng bên phải
  for(let y=4;y<=7;y++)for(let x=5;x<=14;x++)if((x*3+y*5)%7==0)u(D,x,y,1,1);
  u(DD,4,8,12,1);for(let x=4;x<=15;x+=2)u(W,x,8,1,1);                            // đường gờ viền mũ
  for(let x=5;x<=15;x+=2)u(D,x,9,1,1);                                           // viền lông nhấp nhô
  if(!back){u(LG,9,8,2,2);u(LG2,9,8,1,1);u(LG2,10,9,1,1)}                        // logo thêu nhỏ trước trán
  // hai tai che kín tai
  for(const fx of[4,13]){const lt=fx==4;
   u(W,fx,10,3,4);u(W,fx+(lt?1:0),14,2,1);u(W,fx+(lt?1:0),15,2,1);
   u(L,fx+(lt?0:2),10,1,3);u(D,fx+(lt?2:0),11,1,3);u(D,fx+(lt?1:0),15,2,1);u(DD,fx+(lt?1:0),16,2,1)}
  u(D,4,13,1,1);u(D,15,12,1,1);
 }else{
  const R=[[2,7,11],[3,5,12],[4,4,13],[5,4,14],[6,4,14],[7,4,14],[8,4,14],[9,4,14]];
  R.forEach(q=>ro(W,q[1],q[2],q[0]));
  ro(L,8,10,2);ro(L,6,8,3);ro(L,5,6,4);ro(L,5,5,5);ro(L,5,5,6);ro(L,9,11,3);
  ro(D,12,12,3);ro(D,13,13,4);ro(D,14,14,5);ro(D,14,14,6);ro(D,13,14,7);
  for(let y=4;y<=7;y++)fluff(5,13,y);
  ro(DD,4,14,8);for(let x=4;x<=14;x+=2)ro(W,x,x,8);
  for(let x=5;x<=14;x+=2)ro(D,x,x,9);
  // tai che bên mặt
  ro(W,7,10,10);ro(W,7,10,11);ro(W,7,10,12);ro(W,7,10,13);ro(W,8,10,14);ro(W,8,9,15);
  ro(L,7,7,10);ro(L,7,7,11);ro(L,7,7,12);ro(D,10,10,11);ro(D,10,10,12);ro(D,10,10,13);ro(D,8,10,14);ro(D,8,9,15);ro(DD,8,9,16);
 }
};


/* ============================== HAWAII (mua ở Tiệm câu Quái vật, bằng Xu quái vật) ============================== */

// ---- Nón rộng vành Hawaii: cói vàng, dải xanh ngọc, cài hoa dâm bụt ----
HAIRFX.hawaii=(u,o,K)=>{
 const{side,Rt,back,HC}=K,mx=(x,w)=>Rt?x:20-x-w,
 S1='#f3d684',S2='#e2b95a',S3='#c99a3a',SL='#fff0b8',BD='#1fa6b4',BDd='#12808a',FR='#ff4d6d',FY='#ffd23f',LF='#3fae5a';
 const weave=(x,y,w,h)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(((x+i+y+j)&1)==0)u(SL,x+i,y+j,1,1)};
 // tóc lòi dưới vành
 if(!side){if(!back){u(HC,6,8,1,3);u(HC,13,8,1,3)}}else u(HC,mx(5,2),8,2,3);
 // chỏm + dải + vành
 u(S1,7,1,6,1);u(S1,6,2,8,3);weave(6,2,8,3);u(S2,6,4,8,1);u(S3,13,2,1,3);
 u(BD,6,5,8,1);u(BDd,13,5,1,1);
 u(S1,3,6,14,1);weave(3,6,14,1);u(S2,2,7,16,1);u(S3,16,7,2,1);u(S3,2,7,1,1);
 // hoa trang trí trên dải
 if(!back){u(FR,7,5,1,1);u(FY,10,5,1,1);u(FR,12,5,1,1)}
 // đóa dâm bụt to bên mặt nón
 if(!back){const fx=side?mx(14,3):14;u(FR,fx+1,4,1,1);u(FR,fx,5,3,1);u(FR,fx+1,6,1,1);u(FY,fx+1,5,1,1);u(LF,side?mx(16,2):16,6,2,1)}
};

// ---- Set Hawaii (nam / nữ): họa tiết hoa + vòng hoa lei ở cổ ----
SETFX.hawaii=(u,o,S,K)=>{
 const{side,Rt,back,rd}=K,mx=(x,w)=>Rt?x:20-x-w,fa=S.fa,fb=S.fb,Y='#ffd23f',
 LEI=['#ff5d8f','#ffd23f','#ff8a3c','#fff1f5','#ff4d4d','#ffd23f'];
 const fl=(x,y,c)=>{u(c,x,y,2,2);u(Y,x,y,1,1)};
 // hoa trên áo
 const T=side?[[8,17,fa],[11,18,fb],[9,20,fb],[12,20,fa]]:[[6,17,fa],[11,18,fb],[7,20,fb],[12,20,fa]];
 T.forEach(q=>fl(q[0],q[1],q[2]));
 // hoa trên váy (bản nữ)
 if(S.hw=='f'&&!rd){const V=side?[[8,24],[11,25],[13,24],[9,26],[14,26]]:[[6,24],[10,25],[13,24],[8,26],[12,26]];V.forEach((q,i)=>u(i%2?S.fa:S.fb,q[0],q[1],1,1))}
 // vòng hoa lei
 if(!side){
  for(let i=0;i<8;i++)u(LEI[i%6],6+i,15,1,1);
  if(!back){[7,8,11,12].forEach((x,i)=>u(LEI[(i+2)%6],x,16,1,1));u(LEI[1],8,17,1,1);u(LEI[3],11,17,1,1);u(LEI[0],9,18,1,1);u(LEI[2],10,18,1,1)}
  else for(let i=0;i<6;i++)u(LEI[i%6],7+i,16,1,1)}
 else{for(let i=0;i<6;i++)u(LEI[i],mx(7,6)+i,15,1,1);for(let i=0;i<4;i++)u(LEI[i+2],mx(8,4)+i,16,1,1)}
};

// ---- Mũ rơm (kiểu thuyền trưởng hải tặc): to hơn nón rộng vành một chút, dải đỏ ----
HAIRFX.luffy=(u,o,K)=>{
 const{side,Rt,back,HC}=K,mx=(x,w)=>Rt?x:20-x-w,
 S1='#f4d36e',S2='#dcae45',S3='#b98a2c',SL='#fff0b0',RB='#d8232a',RBd='#9c1219';
 const weave=(x,y,w,h)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(((x+i+y+j)&1)==0)u(SL,x+i,y+j,1,1)};
 if(!side){if(!back){u(HC,6,8,1,3);u(HC,13,8,1,3)}}else u(HC,mx(5,2),8,2,3);
 // chỏm cao + dải đỏ
 u(S1,6,0,8,1);u(S1,5,1,10,4);weave(5,1,10,4);u(S2,5,4,10,1);u(S3,14,1,1,4);u(S3,6,0,1,1);
 u(RB,5,5,10,2);u(RBd,5,6,10,1);u(RBd,14,5,1,2);
 // vành rộng
 u(S1,2,7,16,1);weave(2,7,16,1);u(S2,1,8,18,1);u(S3,17,8,2,1);u(S3,1,8,1,1);
};

// ---- Set Phao bơi vịt (nam / nữ): nam cởi trần, nữ áo tắm hồng; phao vịt vàng quanh hông che luôn tay & thân dưới ----
SETFX.duckfloat=(u,o,S,K)=>{
 const{side,Rt,back,lg,sx,SK,SKS}=K,fm=S.dk=='f',mx=(x,w)=>Rt?x:20-x-w,PK=S.sh,
 YH='#fff6b0',Y1='#ffe04a',Y2='#ffcf2e',Y3='#f0b11c',Y4='#d4930f',OR='#ff9a2a',ORD='#e8680f',EYc='#2b1d12',WH='#ffffff',SKL='#f8d3a8';
 // 1) tay để trần (che hẳn lớp tay áo mặc định)
 const arm=(x,ay)=>{u(SK,x,17+ay,3,7);u(SKL,x,17+ay,1,5);u(SKS,x+2,17+ay,1,5)};
 if(!side){
  if(o.aup){[[2,o.aup[0]],[15,o.aup[1]]].forEach(([x,h])=>{const ty=17-h;u(SK,x,ty+3,3,4);u(SKL,x,ty+3,1,4);u(SKS,x+2,ty+3,1,4)})}
  else{arm(2,lg);arm(15,-lg)}
 }else if(!o.noarm){const ax=9-sx;u(SK,ax,17,3,6);u(SKL,ax,17,1,4);u(SKS,ax+2,17,1,4)}
 // 2) thân trên: nam cởi trần / nữ áo tắm hồng
 if(!side){
  if(!fm){ // nam
   if(!back){u(SK,9,17,2,4);u(SKS,6,19,2,1);u(SKS,12,19,2,1);u(SKS,9,19,2,1)}
  }else{ // nữ
   if(!back){
    u(PK,9,17,2,4);
    u(SK,6,16,8,1);u(PK,7,16,1,1);u(PK,12,16,1,1);u(SK,8,17,4,1);
    u(WH,9,18,2,1);
    [[6,18],[13,18],[6,20],[13,20]].forEach(q=>u(WH,q[0],q[1],1,1));
   }else{
    u(PK,10,17,1,5);
    u(SK,6,16,8,1);u(PK,7,16,1,1);u(PK,12,16,1,1);u(SK,8,17,4,1);
    u(WH,9,18,2,1);
   }
  }
 }else if(fm){u(SK,mx(8,6),16,6,1);u(WH,mx(7,1),19,1,1)}
 else u(SK,Rt?7:12,17,2,4);
 // 3) phao vịt vàng quanh hông
 const RG=side?[[21,5,14,YH],[22,4,15,Y1],[23,3,16,Y1],[24,3,16,Y2],[25,4,15,Y3],[26,5,14,Y4]]
              :[[21,4,15,YH],[22,3,16,Y1],[23,2,17,Y1],[24,2,17,Y2],[25,3,16,Y3],[26,4,15,Y4]];
 RG.forEach(q=>u(q[3],q[1],q[0],q[2]-q[1]+1,1));
 u(YH,side?5:4,22,3,1);u(YH,side?4:3,23,1,1);          // ánh sáng bóng loáng
 u(Y3,side?15:16,23,1,2);u(Y4,side?15:17,24,1,1);       // phần tối bên kia
 u(Y3,5,22,1,4);u(Y3,14,22,1,4);                         // đường nối phao
 // 4) đầu vịt phía trước / đuôi vịt phía sau
 if(!side){
  if(!back){
   u(YH,8,19,2,1);u(Y1,10,19,2,1);
   u(Y1,7,20,6,1);u(EYc,8,20,1,1);u(EYc,11,20,1,1);
   u(Y2,7,21,6,1);u('#ff9db4',7,21,1,1);u('#ff9db4',12,21,1,1);
   u(Y3,7,22,1,1);u(Y3,12,22,1,1);u(OR,8,22,4,1);u(ORD,9,23,2,1);
  }else{
   u(YH,11,18,1,1);u(Y1,10,19,2,1);u(Y1,9,20,3,1);u(Y2,8,21,4,1);
  }
 }else{
  u(YH,mx(13,3),18,3,1);u(Y1,mx(12,5),19,5,1);u(Y1,mx(12,5),20,5,1);u(Y2,mx(12,5),21,5,1);
  u(EYc,mx(15,1),19,1,1);u('#ff9db4',mx(13,1),20,1,1);
  u(OR,mx(17,3),20,3,1);u(ORD,mx(17,2),21,2,1);
  u(YH,mx(2,1),18,1,1);u(Y1,mx(2,2),19,2,1);u(Y1,mx(2,3),20,3,1);u(Y2,mx(3,3),21,3,1);
 }
};

/* =====================================================================
   ĐỒ MỚI (Shop Phố xá): Vua đầu bếp • Lính Việt • Song kiếm • iPad • Muôi đầu bếp • Giáo lính Việt
   - Set  : SETFX.chef / SETFX.linh   (dữ liệu màu + giá nằm ở SETS trong index.html, SHOP.s.pr trong pho-map.js)
   - Mũ   : HAIRFX.chef / HAIRFX.linh (SHOP.h.pr)
   - Cầm tay: loại t:'hold' trong ACCS — hàm vẽ art(P) bên dưới (SHOP.a.pr). Xem drawAcc trong index.html.
   ===================================================================== */

// ---- Mũ Vua đầu bếp: mũ trắng cao, xếp nếp ----
HAIRFX.chef=(u,o,K)=>{
 const{side,Rt,back,HC}=K,W='#f8f8fb',WL='#ffffff',WS='#dde3ec',WD='#b9c2d0';
 if(!side){if(!back){u(HC,6,9,1,2);u(HC,13,9,1,2)}}else u(HC,Rt?6:12,9,2,2);
 // thân mũ phồng cao (y0..6) + dải quấn đầu (y7..8)
 u(W,7,0,6,1);u(W,5,1,10,1);u(W,4,2,12,4);u(W,5,6,10,1);
 u(WL,5,1,2,1);u(WL,4,2,2,3);u(WS,14,2,2,4);u(WS,13,1,2,1);u(WS,12,0,1,1);
 for(const x of[7,10,13])u(WS,x,3,1,3);                 // nếp gấp
 u(WS,5,6,10,1);
 u(W,5,7,10,2);u(WL,5,7,10,1);u(WD,5,8,10,1);u(WS,13,7,2,1);
};

// ---- Mũ lính Việt: nón chóp tam giác đỏ cam, viền & chóp vàng, quai ----
HAIRFX.linh=(u,o,K)=>{
 const{side,Rt}=K,RO='#e0561f',ROL='#f58a4a',ROD='#b23c10',GO='#f6cf4a',GOD='#c9961a',QU='#8a2a10';
 const rows=[[9,2],[8,4],[7,6],[6,8],[5,10],[4,12],[3,14]];
 rows.forEach(([a,w],i)=>{u(RO,a,i,w,1);u(ROL,a,i,1,1);u(ROD,a+w-2,i,2,1);
  if(i==0)u(GO,a,i,w,1);if(i==3||i==5){u(GO,a+1,i,w-2,1);u(GOD,a+w-3,i,2,1)}});
 u(GO,2,7,16,1);u(GOD,11,7,7,1);u(GO,2,7,2,1);       // vành viền vàng
 u(ROD,3,8,14,1);                                      // bóng dưới vành
 u(GO,9,-1,2,1);                                       // chóp nhọn vàng
 // quai nón + tua đỏ
 if(!side){u(QU,5,9,1,5);u(QU,14,9,1,5)}else u(QU,Rt?9:10,9,1,5);
};

// ---- Set Vua đầu bếp (nam/nữ đều mặc): áo trắng cài 2 hàng cúc vàng + khăn đỏ, không chữ ----
SETFX.chef=(u,o,S,K)=>{
 const{side,Rt,back}=K,W='#f8f8fb',WL='#ffffff',WS='#dde3ec',GOLD='#f2c94c',RED='#d8232a',REDD='#9c1219';
 if(!side){
  if(!back){
   u(W,7,15,6,1);u(WL,7,15,2,1);u('#f1c08a',9,15,2,1);                     // cổ áo
   u(WS,9,17,2,6);u(W,10,17,1,6);u(WL,6,17,3,6);                          // vạt áo chéo
   u(RED,8,15,4,1);u(RED,9,16,2,1);u(REDD,9,17,2,1);                        // khăn đỏ
   for(const y of[18,20,22]){u(GOLD,7,y,1,1);u(GOLD,12,y,1,1)}             // 2 hàng cúc vàng
  }else{u(W,7,15,6,1);u(WS,9,17,2,6)}
 }else{
  u(W,8,15,5,1);u(RED,8,15,5,1);u(REDD,Rt?8:11,16,2,1);
  const fx=Rt?12:8;for(const y of[18,20,22])u(GOLD,fx,y,1,1);
 }
};

// ---- Set Lính Việt: áo đỏ cam viền vàng ----
SETFX.linh=(u,o,S,K)=>{
 const{side,Rt,back,lg,sx}=K,GO='#f6cf4a',GOD='#c9961a';
 if(!side){
  u(GO,7,15,2,1);u(GO,11,15,2,1);u(GO,8,16,1,1);u(GO,11,16,1,1);          // cổ áo
  if(!back){u(GO,9,16,2,7);u(GOD,10,16,1,7);for(const y of[18,20])u('#b23c10',9,y,2,1)}   // nẹp giữa
  u(GO,6,23,8,1);                                                         // viền gấu áo
  u(GO,2,17+lg,3,1);u(GO,15,17-lg,3,1);                                    // vai
  u(GO,2,21+lg,3,1);u(GO,15,21-lg,3,1);                                    // cổ tay
  if(!back)u(GO,9,22,2,1);                                                // khóa thắt lưng
 }else{
  u(GO,8,15,5,1);u(GO,Rt?13:7,17,1,6);u(GO,7,23,7,1);
  if(!o.noarm){const ax=9-sx;u(GO,ax,17,3,1);u(GO,ax,21,3,1)}
  u(GO,Rt?11:8,22,2,1);
 }
};

/* ---------------------- PHỤ KIỆN CẦM TAY (t:'hold') ----------------------
   art(P): P.R(màu,dx,y,w,h) vẽ tương đối bàn tay (dx>0 = hướng nhân vật nhìn); P.hy = y bàn tay phải,
   P.hyL = y bàn tay trái; P.lx = dx bàn tay trái (chỉ khi nhìn thẳng/sau); P.side / P.back; P.t = giây. */

// Song kiếm: 2 thanh kiếm, tay trái + tay phải (nhìn nghiêng: bắt chéo trong 1 tay)
function accSword(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t;
 const sword=(dx,hy,out,dark)=>{
  const B1=dark?'#8d98a8':'#f4f8fc',B2=dark?'#68727f':'#aab6c6',G='#e7b93a',GR='#6a3a1c';
  R(GR,dx,hy,2,3);R(G,dx,hy+3,2,1);R(G,dx-2,hy-1,6,1);R('#b8871c',dx-2,hy-1,1,1);R('#b8871c',dx+3,hy-1,1,1);
  for(let k=0;k<15;k++){const x=dx+Math.round(out*k*.22),y=hy-2-k,w=k==14?1:2;R(B1,x,y,1,1);if(w==2)R(B2,x+1,y,1,1)}
  if(!dark){const k=Math.floor((t*9)%22);if(k<15)R('#ffffff',dx+Math.round(out*k*.22),hy-2-k,1,1)}};
 if(P.side){sword(0,P.hy,-1,1);sword(0,P.hy,1,0)}
 else{sword(P.lx,P.hyL,-1,0);sword(0,P.hy,1,0)}
}

// iPad: cầm trước ngực, màn hình đổi màu + vệt sáng chạy
function accIpad(P){
 const R=P.R,t=P.t,SK='#f1c08a',hy=P.hy;
 if(P.side){
  R('#2b2f3a',1,hy-8,2,10);const j=Math.floor(t*6)%8;
  for(let i=0;i<8;i++)R('hsl('+((t*70+i*28)%360|0)+',75%,62%)',1,hy-7+i,1,1);
  R('#ffffff',1,hy-7+j,1,1);R(SK,-1,hy,3,2);return}
 if(P.back){R('#c9ced6',2,hy-8,1,9);return}
 R('#2b2f3a',-5,hy-9,8,11);R('#454b5a',-5,hy-9,8,1);R('#8a92a3',-2,hy-9,2,1);       // viền + camera
 for(let j=0;j<8;j++)R('hsl('+((t*70+j*26)%360|0)+',78%,60%)',-4,hy-8+j,6,1);         // màn hình
 const b=Math.floor((t*7)%12)-2;if(b>=0&&b<8){R('rgba(255,255,255,.55)',-4,hy-8+b,6,1)}
 R('rgba(255,255,255,.7)',-3,hy-8,1,1);                                              // chấm sáng
 for(const [x,y] of [[-3,hy-6],[0,hy-5],[-2,hy-3]])R('rgba(255,255,255,.9)',x,y,1,1); // icon nhỏ
 R(SK,-1,hy,3,2)                                                                      // bàn tay đỡ
}

// Muôi đầu bếp: muôi bạc to
function accLadle(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy,H1='#e6ebf2',H2='#8f99a6';
 for(let y=hy+3;y>=hy-13;y--){R(H1,0,y,1,1);R(H2,1,y,1,1)}                // cán
 R('#c9d1dc',-1,hy+4,3,1);                                                // đầu cán
 const top=hy-18;
 R(H1,-3,top,8,1);R('#c9d1dc',-3,top+1,8,1);R('#7d8896',-2,top+1,6,1);          // miệng muôi (lòng sâu)
 R(H1,-3,top+2,8,1);R('#9aa5b3',-2,top+2,6,1);R(H2,4,top+2,1,1);
 R(H1,-2,top+3,6,1);R('#aab4c1',-1,top+3,4,1);R(H2,3,top+3,1,1);
 R(H1,-1,top+4,4,1);R(H2,2,top+4,1,1);
 R(H2,0,top+5,2,1);
 R('#ffffff',-2,top,1,1);
 if(Math.sin(t*4)>.7)R('#ffffff',3,top,1,1);
}

// Giáo lính Việt: cán gỗ dài, mũi giáo thép, tua rua đỏ
function accSpear(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy;
 for(let y=hy-17;y<=hy+6;y++){R('#a8703a',0,y,1,1);R('#6e4420',1,y,1,1)}
 R('#4a2c14',0,hy+7,2,1);
 const ty=hy-27;                                                            // mũi giáo
 [[0,0,2],[1,0,2],[2,-1,4],[3,-1,4],[4,-1,4],[5,0,2],[6,0,2]].forEach(([i,x,w],k)=>{R('#f4f8fc',x,ty+i,1,1);for(let q=1;q<w;q++)R(q==w-1?'#8d98a8':'#d4dce6',x+q,ty+i,1,1)});
 R('#f6cf4a',-1,ty+7,4,1);R('#c9961a',-1,ty+8,4,1);                          // đai vàng
 R('#c8201a',0,ty+9,2,2);R('#8a1010',1,ty+9,1,2);                             // nút tua
 [-1,0,1,2].forEach((x,i)=>{for(let k=0;k<4;k++){const sw=k<2?0:Math.round(Math.sin(t*5+i*1.3+k*.5)*(k-1)*.5);R(k%2?'#e23a2a':'#c8201a',x+sw,ty+11+k,1,1)}});
}

/* ---------------------- ĐÀN GUITAR (t:'hold') — bán ở Shop Phố xá: 3000 Xu ----------------------
   Đàn to, đeo nghiêng trước người; nhún nhảy theo nhịp (thân nhân vật nhún cùng nhịp trong drawAv/drawAcc),
   tay trái bấm cần đàn, tay phải gảy, nốt nhạc ♪ ♫ bay lên. Hình thân đàn được "rasterize" 1 lần rồi cache lại. */
const GT_CACHE={};
function gtBuild(mode,deg){
 const key=mode+deg;if(GT_CACHE[key])return GT_CACHE[key];
 // mode: front (nhìn thẳng) | side (nhìn nghiêng, thu nhỏ nhẹ) | back (chỉ lộ cần đàn + đầu đàn)
 const cx=mode=='side'?1.2:8.6,cy=mode=='side'?21:21.4,sc=mode=='side'?.95:1.1,th=deg*Math.PI/180,ax=Math.sin(th),ay=-Math.cos(th),px=Math.cos(th),py=Math.sin(th);
 const q=(x,y)=>{const vx=x+.5-cx,vy=y+.5-cy,s=(vx*ax+vy*ay)/sc,n=(vx*px+vy*py)/sc;
  const body=mode!='back'&&(((s+1.8)/6)**2+(n/5.4)**2<=1||((s-3.6)/4)**2+(n/4.2)**2<=1);
  const neck=s>=6&&s<=13.4&&Math.abs(n)<=1.3,head=s>13.4&&s<=16.4&&Math.abs(n)<=1.8;
  return{s,n,body,neck,head,any:body||neck||head}};
 const out=[];
 for(let y=-8;y<34;y++)for(let x=-6;x<26;x++){const k=q(x,y);if(!k.any)continue;
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!q(x+a,y+b).any);let c;
  if(k.head)c=edge?'#2a160a':'#4a2a14';
  else if(k.neck&&!k.body)c=edge?'#4a2a14':(Math.floor(k.s)%2?'#8a5a2c':'#a8743a');
  else if(edge)c='#6b3414';
  else if(Math.hypot(k.s+.2,k.n)<=1.7)c='#2a1408';                       // lỗ thoát âm
  else if(Math.abs(k.s+4.4)<.8&&Math.abs(k.n)<=2.2)c='#3a1d0c';          // ngựa đàn
  else if(k.n<-2.2)c='#f2b872';else if(k.n>2.6||k.s<-4.5)c='#c47a38';else c='#e0944a';
  out.push([x,y,c])}
 return GT_CACHE[key]={out,cx,cy,sc,ax,ay,px,py}}
function gtHexA(h,a){const n=parseInt(h.slice(1),16);return'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+Math.max(0,Math.min(1,a)).toFixed(2)+')'}
function accGuitar(P){
 const R=P.R,t=P.t,SK='#f1c08a',SKD='#d99e6a',beat=Math.floor(t/.21)%2,mode=P.side?'side':P.back?'back':'front',
  G=gtBuild(mode,(P.side?50:42)+(beat?-3:0)),off=P.side?0:-16;                  // front/back: x tuyệt đối -> dx so với bàn tay
 for(const[x,y,c]of G.out)R(c,x+off,y,1,1);
 const at=(s,n)=>[G.cx+G.ax*s*G.sc+G.px*n*G.sc+off,G.cy+G.ay*s*G.sc+G.py*n*G.sc];
 // dây đàn: 1 đường sáng dọc cần
 if(mode!='back'){for(let s=-3;s<=13;s+=1){const[x,y]=at(s,0);R(s>=6?'#f4ead0':'rgba(244,234,208,.55)',Math.round(x-.5),Math.round(y-.5),1,1)}}
 // đầu đàn: các khóa chỉnh dây
 for(const n of[-1,1]){const[x,y]=at(14.6,n);R('#e6e6ee',Math.round(x-.5),Math.round(y-.5),1,1)}
 if(mode!='back'){
  const[hx,hy]=at(8.4,0),[sx,sy]=at(-3.4+Math.sin(t*(beat?14:12))*1.9,.4);       // tay bấm + tay gảy
  R(SK,Math.round(hx-1),Math.round(hy-1),3,2);R(SKD,Math.round(hx-1),Math.round(hy+1),3,1);
  R(SK,Math.round(sx-1),Math.round(sy-1),3,2);R(SKD,Math.round(sx-1),Math.round(sy+1),3,1)}
 // nốt nhạc bay lên (♪ ♫): bắt đầu ở thân đàn, bay chếch về phía sau-trái người, nhỏ dần rồi tan
 const NC=['#ff7aa8','#4aa8ff','#ffc21f','#5fd06a'],nx=P.side?-8:-19;
 for(let k=0;k<4;k++){const p=(t*.5+k/4)%1,al=p<.12?p/.12:p>.7?(1-p)/.3:1,x=Math.round(nx-p*(P.side?5:7)+Math.sin(p*7+k*2.1)*2),y=Math.round(20-p*24);
  const d=(c,ox,oy)=>{R(c,x+ox,y+4+oy,2,2);R(c,x+2+ox,y+oy,1,5);if(k%2){R(c,x+4+ox,y+4+oy,2,2);R(c,x+6+ox,y+oy,1,5);R(c,x+2+ox,y+oy,5,1)}else{R(c,x+3+ox,y+oy,1,1);R(c,x+4+ox,y+1+oy,1,1)}};
  d('rgba(255,255,255,'+(al*.55).toFixed(2)+')',1,1);d(gtHexA(NC[k],al),0,0)}
 const[tx,ty]=at(15.5,0);if(Math.sin(t*5)>.55){const X=Math.round(tx),Y=Math.round(ty);for(const[a,b]of[[0,-2],[0,2],[-2,0],[2,0]])R('rgba(255,255,255,.9)',X+a,Y+b,1,1);R('#ffffff',X,Y,1,1)}
}

/* ---------------------- GUITAR ĐIỆN (t:'hold') — bán ở Shop Phố xá: 4000 Xu ----------------------
   Dùng lại dáng + động tác của Đàn guitar, đổi sang thân hồng cánh sen, cần đàn đen, có lấp lánh. Giá: SHOP.a.pr (số 15) trong pho-map.js */
const EGT_MAP={'#f2b872':'#ff9ad0','#e0944a':'#e8409a','#c47a38':'#b02270','#6b3414':'#4a0f33','#2a1408':'#c9d2dc','#3a1d0c':'#8a96a4','#4a2a14':'#22222c','#2a160a':'#101018','#8a5a2c':'#2e2e3a','#a8743a':'#3c3c4a'};
function accEGuitar(P){const R0=P.R;accGuitar(Object.assign({},P,{R:(c,x,y,w,h)=>R0(EGT_MAP[c]||c,x,y,w,h)}))}
