/* ===================================================================================
   SKATER.JS — 🛹 Mascot SKATER PHỐ (Nam / Nữ) — 2 set, THÂN GIỐNG HỆT NHAU, chỉ khác phần ĐẦU
   • Khai báo ở CUỐI mảng SETS (index.html):
       {k:'skatem', mascot:'skater', skt:'m'}  — Skater (Nam): mũ lưỡi trai xanh navy đội NGƯỢC, tóc đen, tai nghe quàng cổ
       {k:'skatef', mascot:'skater', skt:'f'}  — Skater (Nữ):  tóc nâu buộc đuôi ngựa cao + scrunchie hồng, băng đô trắng
   • Bán ở TIỆM CHÚ HỀ (circus.js, mảng CL_ITEMS) — cùng chỗ bán Ván trượt cam.
   • Thân (dùng chung): hoodie vàng nghệ oversize, mũ trùm đã hạ xuống sau cổ, dây rút trắng đầu đỏ,
     túi kangaroo có đường may, họa tiết ván trượt trước ngực, bo gấu + bo cổ tay sọc,
     tai nghe đen quàng cổ (đệm tai đỏ), vòng tay đỏ, quần jean xanh xắn gấu, giày sneaker trắng – đỏ đế xám.
   • KHÔNG che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   • Khi đứng trên VÁN TRƯỢT, chân do skate.js vẽ (dùng màu pt = quần jean, shoe = giày trắng, sole = đế giày).
   • Khung chuẩn 20x31; mũ / đuôi tóc / tay áo rộng vượt khung nên khai báo wide:1.
   =================================================================================== */
(function(){
const HY='#f4b63a',HL='#ffd873',HK='#c98a1a',HX='#9c6510',HM='#e9a52a',      // hoodie vàng nghệ: chính / sáng / tối / rất tối / túi
      RB='#3b2f2f',RBL='#5a4a48',                                              // bo gấu / cổ tay (nâu đen sọc)
      WH='#ffffff',WS='#d9dde8',RD='#e23a3a',RDL='#ff7a6e',RDK='#a8201f',     // trắng / đỏ
      BK='#24242d',BKL='#4a4a58',                                              // tai nghe đen
      JN='#3b5b9c',JL='#5f86cf',JK='#27427a',JC='#9dbcf0',JCK='#6f93d4',        // jean + gấu xắn
      SN='#f7f7fb',SNK='#cfd3e0',SO='#8d93a6',                                 // sneaker trắng + đế xám
      SK='#f6d0a6',SKD='#e0a878',
      NV='#26346b',NVL='#3f56a8',NVK='#161f45',                                // mũ navy
      HC='#17141c',HLc='#463e54',HD='#0a080d',                                 // tóc đen
      BR='#5a3322',BRL='#8a5a3c',BRK='#35190e',                                // tóc nâu
      PK='#ff6fa5',PKL='#ffa6c8',PKK='#c93e78';                                // scrunchie hồng

function drawSkater(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,fem=S.skt=='f',mv=!!o.mv,T=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const sx=side?lg*(Rt?2:-2):0;
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân: jean xắn gấu + sneaker trắng đỏ đế xám ----------
 const leg=(x,lift)=>{
  u(JN,x,25,4,2-lift);u(JL,x,25,1,2-lift);u(JK,x+3,25,1,2-lift);
  u(JC,x,27-lift,4,1);u(JCK,x+3,27-lift,1,1);u(WH,x,27-lift,1,1);                     // gấu quần xắn
  u(SN,x,28-lift,4,1);u(SNK,x+3,28-lift,1,1);u(RD,x,28-lift,1,1);                    // thân giày
  u(SO,x,29-lift,4,1);u(SNK,x+1,29-lift,1,0);
  if(side){const tx=Rt?x+4:x-1;u(SN,tx,28-lift,1,1);u(RD,tx,28-lift,1,1);u(SO,tx,29-lift,1,1)}   // mũi giày
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- tay: tay áo hoodie rộng, bo cổ tay sọc, vòng đỏ, bàn tay ----------
 const arm=(x,ay,L)=>{
  const lx=L?x-1:x;
  u(HY,lx,15+ay,4,5);u(HL,lx,15+ay,1,5);u(HK,lx+3,15+ay,1,5);u(HL,lx+1,15+ay,1,1);
  u(HK,lx,19+ay,4,1);                                                                     // nếp tay áo
  u(RB,x,20+ay,3,1);u(RBL,x,20+ay,1,1);u(RBL,x+2,20+ay,1,1);                              // bo cổ tay
  u(SK,x,21+ay,3,2);u(SKD,x+2,21+ay,1,2);
  if(L)u(RD,x,21+ay,3,1)};                                                                // vòng tay đỏ (tay trái)
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(SK,x+ox,ty,3,3);u(SKD,x+ox+2,ty,1,3);u(RB,x,ty+3,3,1);u(HY,x-1,ty+4,4,4);u(HL,x-1,ty+4,1,4);u(HK,x+2,ty+4,1,4)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg,1);armUp(15,o.aup[1],1)}else{arm(2,lg,1);arm(15,-lg,0)}};

 // ---------- thân ----------
 if(!side){
  // mũ trùm hạ xuống sau cổ (vòng dày quanh cổ)
  u(HX,5,13,10,1);u(HK,4,14,12,1);u(HM,6,13,8,1);
  // thân hoodie oversize
  u(HY,6,14,8,1);u(HY,4,15,12,9);u(HL,4,15,2,9);u(HK,14,15,2,9);u(HL,6,15,1,1);
  // bo gấu (sọc nâu đen)
  u(RB,5,24,10,2);u(RBL,5,24,10,1);for(let x=5;x<15;x+=2)u(RB,x,24,1,2);u(HX,5,25,10,0);
  if(back){
   // lưng: mũ trùm rủ + đường may sống lưng + tai nghe vòng sau cổ
   u(HX,6,15,8,3);u(HK,7,18,6,1);u(HM,8,15,4,2);u(HK,10,15,1,9);
   u(BK,4,13,12,1);u(BKL,5,13,2,1);
   // họa tiết lưng: ván trượt lớn
   u(WH,6,19,8,1);u(SNK,6,20,8,1);u(RD,7,21,2,1);u(RD,11,21,2,1);
  }else{
   // cổ chữ V trong mũ trùm + bo cổ
   u(HK,8,15,4,1);u(HX,9,16,2,1);
   // dây rút trắng + đầu đỏ
   u(WH,7,15,1,4);u(WH,12,15,1,4);u(WS,7,18,1,1);u(WS,12,18,1,1);u(RD,7,19,1,1);u(RD,12,19,1,1);u(RDK,7,19,1,0);
   // họa tiết ván trượt trước ngực
   u(WH,8,17,4,1);u(RD,8,18,1,1);u(RD,11,18,1,1);u(SNK,9,18,2,0);
   // túi kangaroo
   u(HM,6,20,8,3);u(HK,6,20,8,1);u(HX,5,21,1,2);u(HX,14,21,1,2);u(HK,10,21,1,2);u(HL,6,21,1,2);
   // tai nghe quàng cổ: 2 đệm tai đen đỏ nằm trên vai
   u(BK,3,14,3,5);u(BKL,3,14,1,5);u(RD,4,15,1,3);u(BK,14,14,3,5);u(BKL,16,14,1,5);u(RD,15,15,1,3);
   u(BK,5,13,2,1);u(BK,13,13,2,1);
  }
  arms();
 }else{
  // nhìn ngang
  M(HX,4,13,6,3);M(HK,3,14,3,3);M(HM,5,13,4,1);                                           // mũ trùm bĩu ra sau gáy
  M(HY,6,14,8,1);M(HY,5,15,10,9);M(HK,5,15,2,9);M(HL,13,15,2,9);M(HL,7,15,1,1);
  M(RB,5,24,10,2);M(RBL,5,24,10,1);for(let x=5;x<15;x+=2)M(RB,x,24,1,2);
  M(HM,8,20,6,3);M(HK,8,20,6,1);M(HX,13,21,1,2);M(HL,8,21,1,2);                          // túi
  M(WH,10,16,1,4);M(RD,10,19,1,1);M(WS,10,18,1,1);                                        // dây rút
  M(WH,11,17,3,1);M(RD,11,18,1,1);M(RD,13,18,1,1);                                        // họa tiết
  M(BK,8,14,4,5);M(BKL,8,14,1,5);M(RD,9,15,2,3);M(BK,6,13,4,1);                           // tai nghe
  const ax=9-sx;
  if(!o.noarm){
   u(HY,ax-1,15,5,5);u(HL,ax-1,15,1,5);u(HK,ax+3,15,1,5);u(HK,ax,19,4,1);
   u(RB,ax,20,3,1);u(RBL,ax,20,1,1);u(SK,ax,21,3,2);u(SKD,ax+1,22,2,1);u(RD,ax,21,3,1)}
 }
 u(SK,9,14,2,1);

 // ---------- đầu: mặt ----------
 if(back)fillRows(HC,MSTD.HF);
 else if(!side){fillRows(SK,MSTD.HF);u(SKD,15,8,1,4);u(SKD,6,13,8,1)}
 else{fillRows(SK,MSTD.HS,1);M(SKD,13,9,2,4);M(SKD,6,13,6,1)}

 if(!fem)boyHead();else girlHead();

 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
 }

 /* =============== ĐẦU NAM: tóc đen + MŨ LƯỠI TRAI navy ĐỘI NGƯỢC =============== */
 function boyHead(){
  if(back){
   u(HC,3,5,14,9);u(HLc,6,7,2,1);u(HD,3,9,1,5);u(HD,16,9,1,5);u(HD,9,11,2,3);
   // phía sau: thấy LƯỠI mũ + khóa chỉnh
   u(NV,3,1,14,5);u(NVL,4,1,3,1);u(NVK,3,5,14,1);u(RD,3,6,14,2);u(RDK,3,7,14,1);u(RDL,4,6,3,1);
   u(NVL,9,2,2,3);u(WH,9,3,2,1);u(RD,9,0,2,1);
  }else if(!side){
   // tóc mái + tóc mai
   u(HC,4,6,12,2);u(HLc,6,6,3,1);u(HD,8,7,1,1);u(HD,12,7,1,1);u(HC,4,8,2,1);u(HC,14,8,2,1);
   for(let y=6;y<=10;y++){u(HC,3,y,1,1);u(HC,16,y,1,1)}u(HD,3,9,1,2);u(HD,16,9,1,2);
   // mũ: chỏm tròn + 6 múi + nút đỏ
   u(NV,7,0,6,1);u(NV,5,1,10,1);u(NV,4,2,12,1);u(NV,3,3,14,3);
   u(NVL,6,1,3,1);u(NVL,5,2,2,1);u(NVL,4,3,2,2);
   u(NVK,14,2,2,1);u(NVK,15,3,2,3);u(NVK,3,5,14,1);
   u(NVL,9,1,1,4);u(NVK,10,1,1,4);                                                         // đường may giữa
   u(RD,9,-1,2,1);u(RDL,9,-1,1,1);                                                         // nút đỉnh
   u(WH,7,3,2,2);u(RD,8,4,1,1);                                                            // logo thêu
   u(RD,3,6,14,1);u(RDK,3,6,1,1);u(RDK,16,6,1,1);                                          // đai mũ đỏ sát trán
   u(WH,16,4,1,1);u(WH,3,4,1,1);                                                           // lỗ xỏ
  }else{
   M(HC,4,6,9,2);M(HLc,6,6,3,1);M(HC,11,7,2,2);M(HD,11,7,1,1);
   M(HC,2,6,6,7);M(HLc,3,7,1,3);M(HD,2,11,1,2);M(HD,7,10,1,3);
   // mũ đội ngược: chỏm + đai + LƯỠI TRAI chìa ra phía SAU gáy
   M(NV,6,0,6,1);M(NV,4,1,9,1);M(NV,3,2,11,3);M(NVL,5,1,3,1);M(NVL,4,2,2,2);M(NVK,12,2,2,3);
   M(NVK,3,5,11,1);M(RD,3,5,11,1);M(RDK,12,5,2,1);
   M(NVL,8,1,1,4);M(RD,8,-1,2,1);M(WH,9,2,2,2);M(RD,10,3,1,1);
   M(RD,-1,4,5,1);M(RDL,-1,4,2,1);M(RD,-2,5,6,1);M(RDK,0,5,4,1);   // lưỡi mũ
  }
 }

 /* =============== ĐẦU NỮ: tóc nâu ĐUÔI NGỰA CAO + scrunchie hồng + băng đô trắng =============== */
 function girlHead(){
  const sw=Math.round(Math.sin(T*3+(mv?1:0))*(mv?2:1));                                    // đuôi tóc đung đưa
  if(back){
   u(BR,3,4,14,11);u(BRL,6,6,2,1);u(BRL,12,8,1,3);u(BRK,3,9,1,6);u(BRK,16,9,1,6);u(BRK,9,10,2,5);
   u(WH,3,5,14,1);u(WS,3,6,14,0);
  }else if(!side){
   u(BR,4,4,12,2);u(BRL,6,4,3,1);u(BRL,11,5,2,1);u(BR,4,6,12,2);u(BRK,8,6,1,2);u(BRK,12,6,1,2);u(BRL,5,6,2,1);
   u(BR,4,8,2,1);u(BR,14,8,2,1);
   for(let y=6;y<=13;y++){u(BR,3,y,2,1);u(BR,15,y,2,1)}
   u(BRK,3,9,1,4);u(BRK,16,9,1,4);u(BRL,3,7,1,2);u(BRL,16,7,1,2);
   u(BR,2,11,2,3);u(BR,16,11,2,3);u(BRK,2,13,1,1);u(BRK,17,13,1,1);
   u(WH,3,5,14,1);u(WS,3,6,14,1);u(WH,3,5,2,2);u(PK,9,4,2,2);u(PKL,9,4,1,1);u(PKK,10,5,1,1);   // băng đô + nơ nhỏ
  }else{
   M(BR,4,4,9,2);M(BRL,6,4,3,1);M(BR,4,6,10,2);M(BR,11,8,2,1);
   M(BR,2,6,8,9);M(BRL,3,8,1,4);M(BRK,2,12,1,3);M(BRK,8,11,1,3);
   M(WH,3,5,11,1);M(WS,3,6,10,1);M(PK,9,4,2,2);
  }
  if(!side){u(BR,6,2,8,2);u(BRL,7,2,2,1);u(BR,4,3,12,1)}else{M(BR,5,2,8,2);M(BRL,6,2,2,1);M(BR,4,3,9,1)}   // đỉnh đầu nối với đuôi ngựa
  // đuôi ngựa cao: buộc scrunchie ở đỉnh đầu, đuôi rủ xuống sau lưng
  const pony=(Fm,flip)=>{
   Fm(BR,8,-1,4,2);Fm(BRL,8,-1,1,1);Fm(PK,7,0,6,2);Fm(PKL,7,0,6,1);Fm(PKK,7,1,6,1);Fm(PKK,12,0,1,2);   // scrunchie
   Fm(BR,12+sw,2,3,2);Fm(BR,13+sw,4,3,3);Fm(BR,14+sw,7,3,3);Fm(BR,14+sw,10,2,3);Fm(BRK,15+sw,12,1,2);   // đuôi tóc
   Fm(BRL,12+sw,2,1,2);Fm(BRL,13+sw,4,1,3);Fm(BRK,16+sw,5,1,5);
  };
  if(!side)pony(u);else pony((c,x,y,w,h)=>M(c,x-6,y,w,h));
 }
}
window.drawMascotSkater=drawSkater;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.skater=drawSkater;
})();
