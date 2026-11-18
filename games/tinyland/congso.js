/* =====================================================================
   TINYLAND — CÔNG SỞ NAM / CÔNG SỞ NỮ (vẽ lại) — bán ở Shop Phố xá
   Vẽ pixel trên lưới nhân vật 20x31, móc vào SETFX (outfits.js) như Vua đầu bếp / Lính Việt.
   Khai báo 2 set trong SETS (index.html, fx:'officeM' / fx:'officeF'). Giá: SHOP.s.pr trong pho-map.js (không đổi).
   File này PHẢI nằm SAU outfits.js trong index.html. Chỉ chứa hàm vẽ phần cổ áo / cà vạt / túi / thắt lưng / váy.

   NAM  : sơ mi trắng vai vuông, cổ bẻ, cà vạt ĐEN (có kẹp cà vạt bạc), túi ngực có bút, thắt lưng đen khóa bạc,
          đồng hồ ở cổ tay trái, quần tây đen, giày da đen.
   NỮ   : sơ mi trắng cổ nhỏ, CÀ VẠT NGẮN, túi ngực cài HOA NHÍ HỒNG (có lá), cúc ngọc trai,
          váy xếp ly xanh than có cạp váy + cúc vàng.
   Muốn đổi màu: sửa bảng màu ngay dưới đây (viết đủ 6 ký tự #rrggbb).
   ===================================================================== */
(function(){
const W='#f7f8fb',WL='#ffffff',WS='#d6d9e4';                 // áo trắng: vừa / sáng / bóng đổ
const SILV='#d9dde6',SILVD='#8d93a1';                         // bạc
const SKN='#f1c08a';

/* ---------------------------- NAM ---------------------------- */
const TM='#14141a',TML='#4b4d5c',TMD='#08080b';               // cà vạt đen
SETFX.officeM=(u,o,S,K)=>{
 const{side,Rt,back,lg}=K;
 if(!side){
  u(W,5,16,10,1);u(WL,5,16,2,1);                               // vai vuông (men)
  if(!back){
   u(WL,7,15,2,1);u(W,7,16,1,1);u(WS,8,16,1,1);               // cổ bẻ trái
   u(W,11,15,2,1);u(WS,12,16,1,1);u(WS,11,16,1,1);             // cổ bẻ phải
   u(SKN,9,15,2,1);u(WS,9,16,2,1);
   u(TM,9,16,2,1);u(TMD,10,16,1,1);                            // nút thắt
   u(TM,9,17,2,4);u(TML,9,17,1,3);u(TMD,10,18,1,3);           // thân cà vạt
   u(SILV,9,19,2,1);u(SILVD,10,19,1,1);                        // kẹp cà vạt
   u(TM,9,21,2,1);                                              // đuôi cà vạt
   u(WS,12,18,2,2);u(W,12,19,2,1);u('#2b4fa0',13,17,1,2);      // túi ngực + bút
   u(SILV,9,22,2,1);u(SILVD,10,22,1,1);                        // khóa thắt lưng
   if(!o.aup){u('#2a2d38',15,21-lg,3,1);u(SILV,16,21-lg,1,1)}  // đồng hồ cổ tay
  }else{
   u(W,7,15,6,1);u(WS,7,16,6,1);u(WS,6,18,8,1)                 // cổ sau + đường may lưng áo
  }
 }else{
  u(W,8,15,5,1);u(WL,Rt?9:8,15,2,1);
  const fx=Rt?12:8;
  u(TM,fx,16,1,5);u(TML,fx,16,1,2);                            // cà vạt nhìn ngang
  u(SILV,fx,22,1,1);                                           // khóa thắt lưng
 }
};

/* ---------------------------- NỮ ---------------------------- */
const TF='#2b3560',TFL='#5a68a8',TFD='#171d3c';               // cà vạt ngắn xanh than
const PK='#ff7fae',PKL='#ffc4da',PKD='#e24f86',YL='#ffd84a',LF='#4fa56a';   // hoa nhí hồng
SETFX.officeF=(u,o,S,K)=>{
 const{side,Rt,back,lg}=K,sk=S.skirt,sd=shade(sk,-.35),sl=shade(sk,.28);
 if(!side){
  if(!back){
   u(WL,7,15,2,1);u(WS,8,16,1,1);                              // cổ nhỏ trái
   u(W,11,15,2,1);u(WS,11,16,1,1);                             // cổ nhỏ phải
   u(SKN,9,15,2,1);u(WS,9,16,2,1);
   u(TF,9,16,2,1);u(TFD,10,16,1,1);                            // nút thắt
   u(TF,9,17,2,3);u(TFL,9,17,1,2);u(TFD,10,18,1,2);           // cà vạt NGẮN (3 ô)
   u(TF,9,20,2,1);                                              // đuôi cà vạt
   u('#f3eadd',10,21,1,1);                                      // cúc ngọc trai
   // túi ngực cài hoa nhí hồng
   u(WS,6,18,3,3);u(W,7,19,1,1);
   u(PK,7,18,1,1);u(PK,6,19,1,1);u(PK,8,19,1,1);u(PK,7,20,1,1);u(PKL,7,18,1,1);u(PKD,8,19,1,1);u(YL,7,19,1,1);u(LF,8,20,1,1);
  }else{
   u(W,7,15,6,1);u(WS,7,16,6,1)
  }
  // váy xếp ly
  u(shade(sk,.14),6,22,8,1);u('#e8c860',10,22,1,1);             // cạp váy + cúc vàng
  if(!back)for(const x of[6,9,12])u(sd,x,23,1,4);else for(const x of[6,9,12])u(sd,x,23,1,4);
  for(const x of[7,10,13])u(sl,x,24,1,2);
  u(shade(sk,.12),4,26,12,1);                                  // viền gấu váy
 }else{
  u(W,8,15,5,1);u(WL,Rt?9:8,15,2,1);
  const fx=Rt?12:8;
  u(TF,fx,16,1,3);u(TFL,fx,16,1,1);                            // cà vạt ngắn nhìn ngang
  u(shade(sk,.14),7,22,7,1);
  for(const x of[8,11])u(sd,x,23,1,4);
  u(sl,Rt?12:9,24,1,2);
  u(shade(sk,.12),5,26,11,1);
 }
};
})();
