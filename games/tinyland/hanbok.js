/* ===================================================================================
   HANBOK.JS — 🧧 Mascot HANBOK TẾT RẮN (Nam / Nữ) — 2 set, THÂN GIỐNG HỆT NHAU, chỉ khác phần ĐẦU
   • Khai báo ở CUỐI mảng SETS (index.html):
       {k:'hanbokm', mascot:'hanbok', hb:'m'}  — Hanbok (Nam):  NÓN GAT CAO màu đen, viền dưới nón đỏ, dây nón đỏ có tua ngũ sắc
       {k:'hanbokf', mascot:'hanbok', hb:'f'}  — Hanbok (Nữ):   tóc BÚI CỦ HÀNH có TRÂM cài vàng, băng đô đỏ + nút thắt ngũ sắc
   • Bán ở TIỆM CHÚ HỀ (circus.js): cần ĐỦ 3 thứ mới mua được — 5000 Xu + 500 Xu quái vật + 2 Kim cương (mỗi set)
   • Thân (dùng chung): áo gi-lê đỏ cổ vuông viền vàng, tay áo trắng viền cổ tay ngũ sắc (xanh – vàng – đỏ),
     đai dây trắng thắt nơ, váy đỏ xòe thêu RẮN VÀNG, viền gấu xanh ngọc + vàng, dây tua norigae vàng,
     tất trắng + giày đỏ nút thắt màu.
   • KHÔNG che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   • File này chỉ chứa HÀM VẼ. Khung chuẩn 20x31; nón / búi tóc / trâm vượt khung nên khai báo wide:1.
   =================================================================================== */
(function(){
// ---------- bảng màu ----------
const RD='#d92a31',RL='#f2565c',RK='#a3171f',              // đỏ: chính / sáng / tối
      GD='#ffd23a',GDK='#d99a14',                          // vàng
      WH='#ffffff',WS='#dcd5ec',                           // trắng / bóng trắng
      TL='#33c4bd',TLD='#1f948f',                          // xanh ngọc
      BR='#6b3a30',                                        // nâu cổ áo trong
      SK='#f6d0a6',SKD='#e0a878',                          // da
      HC='#1c1518',HL='#4a3d4a',HD='#0b080a',              // tóc đen
      HT='#18131c',HTL='#4a4256';                          // nón gat đen

function drawHanbok(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,fem=S.hb=='f',mv=!!o.mv;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);               // nhìn ngang (tự lật khi quay trái)
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};    // đối xứng 2 bên
 const sx=side?lg*(Rt?2:-2):0;
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân: tất trắng + giày đỏ nút thắt màu ----------
 const leg=(x,lift)=>{
  u(WH,x,27-lift,4,1);u(WS,x+3,27-lift,1,1);
  u(RD,x,28-lift,4,1);u(RL,x,28-lift,1,1);u(RK,x,29-lift,4,1);
  u(GD,x+1,28-lift,1,1);u(TL,x+2,28-lift,1,1);
  if(side){const tx=Rt?x+4:x-1;u(RD,tx,28-lift,1,2);u(RL,tx,28-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 // tay áo trắng rộng, cổ tay viền ngũ sắc (xanh ngọc – vàng – đỏ), bàn tay
 const arm=(x,ay)=>{
  const lx=x<8?x-1:x;
  u(WH,lx,15+ay,4,4);u(WS,lx+3,15+ay,1,4);u(WH,lx,15+ay,1,1);
  u(TL,x,19+ay,3,1);u(GD,x,20+ay,3,1);u(RD,x,21+ay,3,1);
  u(SK,x,22+ay,3,2);u(SKD,x+2,22+ay,1,2)};
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(SK,x+ox,ty,3,3);u(SKD,x+ox+2,ty,1,3);u(RD,x,ty+3,3,1);u(GD,x,ty+4,3,1);u(TL,x,ty+5,3,1);
  u(WH,x,ty+6,3,2);u(WS,x+2,ty+6,1,2)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 if(!side){
  // váy đỏ xòe (từ dưới đai) + viền gấu xanh ngọc / vàng
  u(RD,5,20,10,1);u(RD,4,21,12,2);u(RD,3,23,14,2);
  u(RL,4,21,2,4);u(RK,14,21,2,2);u(RK,15,23,2,2);
  u(TL,2,25,16,1);u(TLD,15,25,3,1);u(GD,3,26,14,1);u(GDK,15,26,2,1);
  // áo gi-lê đỏ
  u(RD,5,14,10,5);u(RL,5,15,1,3);u(RK,14,15,1,3);
  // đai dây trắng
  u(WH,4,19,12,1);for(let x=5;x<16;x+=2)u(WS,x,19,1,1);
  if(back){
   u(WH,8,14,4,1);                                           // cổ trắng sau gáy
   // nơ sau lưng
   u(RL,6,18,3,2);u(RL,11,18,3,2);u(RK,6,19,3,1);u(RK,11,19,3,1);u(GD,9,18,2,2);
   u(WH,8,20,1,4);u(WH,11,20,1,4);u(WS,8,23,1,1);u(WS,11,23,1,1);
   u(GD,6,22,1,1);u(GD,13,22,1,1);u(GD,9,24,2,1);
  }else{
   // cổ vuông viền vàng, bên trong nâu + cổ trắng
   u(GD,7,14,6,1);u(GD,7,15,1,3);u(GD,12,15,1,3);u(GD,7,17,6,1);u(GDK,12,15,1,3);
   u(BR,8,15,4,2);u(WH,9,15,2,1);u(WH,8,14,4,1);
   // nơ đai + tua dây trắng
   u(RL,8,18,3,2);u(RK,8,20,1,1);u(WH,8,20,1,4);u(WH,9,20,1,3);u(WS,8,24,1,1);u(WS,9,23,1,1);
   // norigae vàng (bên trái) + tua
   u(GD,5,20,2,2);u(GDK,5,21,2,1);u(RL,5,22,1,1);u(GD,5,23,1,2);u(TL,6,23,1,1);u(RD,6,24,1,1);
   // RẮN VÀNG thêu trên váy
   // chữ S: đầu rắn ở trên (có mắt), thân uốn 2 khúc
   u(GD,11,20,3,1);u(RK,13,20,1,1);u(GD,11,21,1,1);u(GD,11,22,3,1);u(GD,13,23,1,1);u(GD,11,24,3,1);u(GDK,11,24,1,1);
  }
  arms();
 }else{
  // nhìn ngang
  M(RD,6,20,8,1);M(RD,5,21,10,2);M(RD,4,23,12,2);
  M(RK,5,21,2,4);M(RL,13,22,2,2);
  M(TL,3,25,14,1);M(TLD,3,25,2,1);M(GD,4,26,12,1);
  M(RD,7,14,6,5);M(RK,7,15,2,3);
  M(WH,6,19,8,1);M(WS,6,19,1,1);
  M(GD,10,14,2,4);M(BR,11,15,1,2);                           // cổ vuông nhìn nghiêng
  M(RL,9,18,2,2);M(WH,9,19,1,5);M(WS,9,23,1,1);
  M(GD,11,20,2,1);M(GD,11,21,1,1);M(GD,11,22,2,1);M(GD,12,23,1,1);M(GD,11,24,2,1);   // rắn vàng
  M(GD,13,20,2,2);M(GDK,13,21,2,1);M(GD,13,23,1,2);M(TL,14,23,1,1);   // norigae
  const ax=9-sx;
  if(!o.noarm){
   u(WH,ax-1,15,5,4);u(WS,ax+3,15,1,4);u(WH,ax-1,15,1,1);
   u(TL,ax,19,3,1);u(GD,ax,20,3,1);u(RD,ax,21,3,1);
   u(SK,ax,22,3,2);u(SKD,ax+1,23,2,1)}
 }
 // cổ (da) dưới cằm
 u(SK,9,14,2,1);

 // ---------- đầu: mặt (da) ----------
 if(back)fillRows(HC,MSTD.HF);
 else if(!side){fillRows(SK,MSTD.HF);u(SKD,15,8,1,4);u(SKD,6,13,8,1)}
 else{fillRows(SK,MSTD.HS,1);M(SKD,13,9,2,4);M(SKD,6,13,6,1)}

 if(!fem)boyHead(); else girlHead();

 // ---------- biểu cảm (không che mặt) ----------
 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
 }

 /* =============== ĐẦU NAM: tóc đen + NÓN GAT CAO viền dưới đỏ =============== */
 function boyHead(){
  // --- tóc ---
  if(back){
   u(HC,3,5,14,9);u(HC,4,14,12,1);u(HL,6,7,2,1);u(HL,12,9,1,3);u(HD,3,9,1,5);u(HD,16,9,1,5);u(HD,9,10,2,4);
  }else if(!side){
   u(HC,4,5,12,2);u(HL,6,5,3,1);u(HL,11,6,2,1);
   u(HC,4,7,5,1);u(HC,11,7,5,1);u(HC,4,8,2,1);u(HC,14,8,2,1);u(HD,8,7,1,1);u(HD,11,7,1,1);
   for(let y=6;y<=11;y++){u(HC,3,y,2,1);u(HC,15,y,2,1)}
   u(HD,4,9,1,3);u(HD,15,9,1,3);u(HL,3,7,1,2);u(HL,16,7,1,2);
  }else{
   M(HC,3,5,9,3);M(HL,5,5,3,1);M(HC,10,7,3,1);M(HD,11,7,1,1);
   M(HC,2,7,6,7);M(HC,3,14,4,1);M(HL,3,8,1,4);M(HD,2,11,1,3);M(HD,7,10,1,3);
   M(HC,8,7,2,4);
  }
  // --- dây nón đỏ + tua ngũ sắc ---
  if(!back){
   if(!side){
    u(RD,4,5,1,8);u(RD,15,5,1,8);u(RK,4,12,1,1);u(RK,15,12,1,1);
    u(RD,5,13,1,1);u(RD,14,13,1,1);
    u(WH,3,5,1,1);u(WH,16,5,1,1);
    u(TL,15,13,1,1);u(GD,15,14,1,1);u(RD,15,15,1,1);u(RL,16,15,1,1);u(TL,16,14,1,1);
   }else{
    M(RD,8,5,1,8);M(RK,8,12,1,1);M(WH,7,5,1,1);
    M(TL,8,13,1,1);M(GD,8,14,1,1);M(RD,8,15,1,1);
   }
  }
  // --- NÓN GAT: chóp cao + dải đỏ dưới chóp + vành rộng viền dưới đỏ ---
  const hat=(Fm,front)=>{
   // chóp (hình trụ hơi thon lên)
   Fm(HT,6,-9,8,1);Fm(HT,5,-8,10,9);
   Fm(HTL,6,-8,1,8);Fm(HTL,7,-9,2,1);Fm(HC,14,-8,1,9);
   Fm(HTL,8,-3,4,1);                                          // ánh sáng ngang chóp
   // dải đỏ ôm chân chóp
   Fm(RD,5,0,10,2);Fm(RL,5,0,10,1);Fm(RK,5,1,10,1);Fm(GD,9,0,2,2);
   // vành nón rộng
   Fm(HT,3,2,14,1);Fm(HTL,4,2,3,1);
   Fm(HT,-1,3,22,1);Fm(HTL,0,3,5,1);Fm(HC,19,3,2,1);
   Fm(RD,1,4,18,1);Fm(RK,1,4,2,1);Fm(RK,17,4,2,1);            // VIỀN DƯỚI ĐỎ
   if(front){Fm(WH,-1,3,1,1);Fm(WH,20,3,1,1)}                 // hạt trai 2 đầu vành
  };
  if(!side)hat(u,!back);
  else hat((c,x,y,w,h)=>M(c,x-2,y,w,h),true);
 }

 /* =============== ĐẦU NỮ: tóc đen búi CỦ HÀNH + TRÂM vàng + băng đô đỏ =============== */
 function girlHead(){
  // --- tóc ---
  if(back){
   u(HC,3,5,14,10);u(HC,4,15,12,1);u(HL,6,7,2,1);u(HL,12,9,1,4);u(HD,3,9,1,6);u(HD,16,9,1,6);u(HD,9,10,2,5);
   u(RD,4,5,12,1);
  }else if(!side){
   // mái bằng + tóc mai dài 2 bên
   u(HC,4,4,12,1);u(HC,4,5,12,1);u(RD,4,5,12,1);u(RL,4,5,12,0);
   u(HC,4,6,12,2);u(HL,6,6,3,1);u(HL,11,7,2,1);u(HD,9,6,2,1);
   u(HC,4,8,3,1);u(HC,13,8,3,1);
   for(let y=6;y<=15;y++){u(HC,3,y,2,1);u(HC,15,y,2,1)}
   u(HL,3,7,1,3);u(HL,16,7,1,3);u(HD,4,10,1,5);u(HD,15,10,1,5);
   u(HC,2,12,2,3);u(HC,16,12,2,3);u(HD,2,14,1,1);u(HD,17,14,1,1);
  }else{
   M(HC,4,4,9,1);M(HC,4,5,10,1);M(RD,4,5,9,1);
   M(HC,4,6,10,2);M(HL,6,6,3,1);M(HC,11,8,2,1);
   M(HC,2,6,8,10);M(HL,3,8,1,5);M(HD,2,12,1,4);M(HD,8,11,1,4);
   M(HC,3,15,5,1);
  }
  // --- BÚI CỦ HÀNH (chóp nhọn + thân tròn) + dây buộc ---
  const bun=(Fm)=>{
   Fm(HC,9,-4,2,2);Fm(HC,8,-2,4,1);Fm(HC,6,-1,8,1);Fm(HC,5,0,10,2);Fm(HC,6,2,8,1);Fm(HC,7,3,6,1);
   Fm(HL,9,-4,1,2);Fm(HL,8,-2,1,1);Fm(HL,6,-1,1,1);Fm(HL,5,0,1,2);Fm(HL,7,0,2,1);Fm(HD,10,-4,1,2);Fm(HD,11,-2,1,1);Fm(HD,13,-1,1,1);Fm(HD,14,0,1,2);Fm(HD,13,2,1,1);Fm(HD,12,3,1,1);
   Fm(RD,7,4,6,1);Fm(GD,9,4,2,1);                            // dây buộc đỏ + nút vàng
  };
  if(!side)bun(u);else bun((c,x,y,w,h)=>M(c,x-1,y,w,h));
  // --- TRÂM CÀI vàng xuyên búi + hoa trang trí + chuỗi tua ---
  if(!side){
   u(GD,4,1,12,1);u(GDK,4,2,1,0);u(GDK,3,1,1,1);u(TL,3,2,1,1);       // thân trâm xuyên búi + đầu trâm trái
   u(RL,15,0,3,3);u(RK,17,1,1,2);u(RK,16,2,1,1);u(GD,16,1,1,1);u(WH,15,0,1,1);   // đầu trâm phải: bông hoa đỏ
   u(GD,17,3,1,3);u(TL,17,6,1,1);u(GD,16,3,1,2);u(RL,16,5,1,1);       // chuỗi tua rủ
   if(!back){
    // nút thắt ngũ sắc giữa băng đô
    u(TL,9,4,2,1);u(GD,8,5,1,1);u(GD,11,5,1,1);u(RL,9,5,2,1);u(WH,9,5,1,0);u(TLD,8,6,1,1);u(TLD,11,6,1,1);
   }
  }else{
   M(GD,3,1,11,1);M(GD,13,1,2,1);M(RL,13,0,3,3);M(GD,14,1,1,1);M(WH,13,0,1,1);
   M(GD,14,3,1,3);M(TL,14,6,1,1);
   M(TL,8,4,2,1);M(GD,8,5,1,1);M(RL,9,5,1,1);
  }
 }
}
window.drawMascotHanbok=drawHanbok;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.hanbok=drawHanbok;
})();
