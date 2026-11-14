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
