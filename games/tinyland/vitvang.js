/* ===================================================================================
   VITVANG.JS — 🦆 SET VỊT VÀNG (nam/nữ đều mặc, 1 set chung) + MŨ VỊT VÀNG (bản Nam tóc ngắn / bản Nữ tóc dài)
   • Bán ở SHOP QUÁI VẬT (Biển) bằng Xu quái vật:  Set Vịt vàng 1.000  •  Mũ vịt vàng 800 (mỗi bản)
     → giá nằm ở mảng QSHOP trong sea-map.js (sửa số p để đổi giá).
   • File này nạp SAU pajama.js, tự đẩy dữ liệu vào CUỐI mảng SETS / HAIRS (không làm lệch số thứ tự đồ đã mua).
   • Set: áo thun trắng kem có chú vịt đội nón đỏ trước ngực + khăn tắm vàng sọc vắt hai vai,
          quần đùi vàng có dây rút, in vịt nhỏ & hoa trắng / hoa cam.
   • Mũ : mũ vịt vàng có mắt, mỏ cam, má hồng, chỏm lông trên đỉnh và HAI CÁNH hai bên.
          Bản Nam = tóc đen ngắn • bản Nữ = tóc đen dài ngang vai (tóc lòi ra dưới mũ).
   • Không che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện.
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần) ----------
if(!SETS.some(s=>s.k=='vitvang')){
 SETS.push({n:'Set Vịt vàng',k:'vitvang',fx:'vitvang',ach:1,
  ds:'Áo thun trắng kem in chú vịt đội nón đỏ, khăn tắm vàng sọc vắt hai vai, quần đùi vàng in vịt & hoa. Nam nữ đều mặc. Hợp với Mũ vịt vàng.',
  sh:'#fffdf0',shl:'#ffffff',shd:'#efe6c4',scarf:'#ffd84a',belt:'#ffffff',trim:'#ffe58a',pt:'#ffd23a',rpt:'#ffd23a',shoe:'#fff4cf'});
}
if(!HAIRS.some(h=>h.k=='duckhat'&&h.dh=='m'))HAIRS.push({n:'Mũ vịt vàng (Nam)',k:'duckhat',dh:'m',c:'#1b1519',ach:1});
if(!HAIRS.some(h=>h.k=='duckhat'&&h.dh=='f'))HAIRS.push({n:'Mũ vịt vàng (Nữ)',k:'duckhat',dh:'f',c:'#1b1519',ach:1});

// ---------- 2) bảng màu ----------
const Y1='#ffe04a',YL='#fff6a8',YD='#f2b81c',YDD='#d9980f',        // vàng: chính / sáng / tối / rất tối
      TW='#ffd23a',TWL='#fff0a0',TWD='#f0a818',                     // khăn tắm vàng sọc
      OR='#ff9a2a',ORD='#e8680f',PK='#ff9db4',EY='#2b1d12',WH='#ffffff',
      RD='#e8412c',RDL='#ff7a5c',RDD='#b92a1a',                     // nón đỏ của chú vịt
      DK='#fff4a8',                                                 // mặt vịt nhỏ trên quần
      HLc='#4a3d4a',HDc='#0b080a';                                  // tóc: bóng sáng / tối

// ---------- 3) SET VỊT VÀNG ----------
SETFX.vitvang=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx}=K,M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 // dải khăn tắm: nền vàng, sọc sáng cách 3 hàng, mép tối bên ngoài
 const band=(x,y,w,h)=>{u(TW,x,y,w,h);for(let j=1;j<h;j+=3)u(TWL,x,y+j,w,1);u(TWD,x,y,1,h);u(TWD,x,y+h-1,w,1)};
 const bandM=(x,y,w,h)=>{const X=Rt?x:20-x-w;u(TW,X,y,w,h);for(let j=1;j<h;j+=3)u(TWL,X,y+j,w,1);u(TWD,Rt?X:X+w-1,y,1,h);u(TWD,X,y+h-1,w,1)};
 if(!side){
  // ----- khăn tắm: quanh cổ + hai dải thả trước ngực (nhìn sau: vắt ngang lưng) -----
  u(TW,6,16,8,1);u(TWL,6,16,8,1);u(TWD,6,16,1,1);u(TWD,13,16,1,1);
  band(5,17,2,6);band(13,17,2,6);
  if(back){u(TW,7,17,6,3);for(const y of[18])u(TWL,7,y,6,1);u(TWD,7,19,6,1)}
  // ----- chú vịt đội nón đỏ trước ngực -----
  if(!back){
   u(RDL,8,17,1,1);u(RD,9,17,3,1);                 // đỉnh nón
   u(RD,7,18,6,1);u(RDD,7,18,1,1);u(RDD,12,18,1,1);u(RDL,8,18,1,1);   // vành nón
   u(Y1,7,19,6,1);u(YL,7,19,1,1);u(EY,8,19,1,1);u(EY,11,19,1,1);       // đầu + mắt
   u(Y1,7,20,6,1);u(PK,7,20,1,1);u(PK,12,20,1,1);u(OR,8,20,4,1);        // má + mỏ
   u(YD,8,21,4,1);u(ORD,9,21,2,1);
  }
  // ----- cổ tay áo viền vàng -----
  if(!o.aup){u(TW,2,20+lg,3,1);u(TW,15,20-lg,3,1)}
  // ----- dây rút quần -----
  if(!back){u(WH,9,22,2,1);u(WH,8,22,1,1);u(WH,11,22,1,1);u('#e8dfae',9,23,1,1);u('#e8dfae',10,23,1,1)}
  // ----- quần đùi: vịt nhỏ + hoa (chân trái x6-8, chân phải x11-13, y24-26) -----
  if(!rd&&!sit){
   if(!back){
    // vịt nhỏ đội nón trắng sọc cam ở mỗi ống
    u(WH,6,24,2,1);u(OR,6,24,1,1);u(DK,6,25,2,1);u(EY,6,25,1,1);u(OR,8,25,1,1);u(YD,6,26,2,1);
    u(WH,12,24,2,1);u(OR,13,24,1,1);u(DK,12,25,2,1);u(EY,13,25,1,1);u(OR,11,25,1,1);u(YD,12,26,2,1);
    // hoa trắng + hoa cam
    u(WH,8,24,1,1);u(OR,8,26,1,1);u(WH,11,26,1,1);u(OR,11,24,1,1);
    // viền gấu
    u(YD,6,26,3,1);u(YD,11,26,3,1);
   }else{
    u(WH,7,24,1,1);u(OR,8,25,1,1);u(WH,12,25,1,1);u(OR,12,24,1,1);u(YD,6,26,3,1);u(YD,11,26,3,1);
    u(WH,6,26,1,1);u(WH,13,26,1,1);
   }
  }
 }else{
  // ----- nhìn ngang -----
  bandM(7,16,6,1);                                  // khăn quanh cổ
  bandM(7,17,2,5);                                  // dải sau lưng
  bandM(12,17,2,6);                                 // dải thả phía trước ngực
  if(!o.noarm&&!o.aup){const ax=9-sx;u(TW,ax,20,3,1)}
  M(WH,10,22,1,1);M(WH,12,22,1,1);
  if(!rd&&!sit){
   const x1=8+sx,x2=10-sx;
   u(WH,x1+1,25,1,1);u(OR,x1,24,1,1);u(WH,x2+2,24,1,1);u(OR,x2+1,26,1,1);u(YD,x1,26,3,1);u(YD,x2,26,3,1);
   // vịt nhỏ thấp thoáng ở ống trước
   const fx=Rt?Math.max(x1,x2):Math.min(x1,x2),fx2=Rt?fx+1:fx;
   u(WH,fx2,24,1,1);u(DK,fx2,25,1,1);u(EY,Rt?fx2:fx2,25,1,1);
  }
 }
};
// ---------- 4) MŨ VỊT VÀNG (Nam tóc ngắn / Nữ tóc dài) ----------
HAIRFX.duckhat=(u,o,K)=>{
 const{side,Rt,back,HC,HS}=K,fem=!!(HS&&HS.dh=='f'),mx=(x,w)=>Rt?x:20-x-w,M=(c,x,y,w,h)=>u(c,mx(x,w),y,w,h);

 // ---- tóc dưới mũ (vẽ trước, mũ đè lên) ----
 if(!side&&!back){
  u(HC,6,7,8,2);u(HC,7,6,6,1);u(HLc,8,7,3,1);u(HC,6,9,1,3);u(HC,13,9,1,3);   // mái + tóc mai
  if(fem){u(HC,5,8,2,10);u(HC,13,8,2,10);u(HLc,5,9,1,7);u(HLc,13,9,1,6);u(HDc,6,17,1,1);u(HDc,13,17,1,1);u(HDc,5,17,1,1);u(HDc,14,17,1,1)}
  else{u(HDc,6,10,1,2);u(HDc,13,10,1,2)}
 }else if(back){
  if(fem){u(HC,5,7,10,12);u(HLc,7,8,2,9);u(HLc,12,8,1,8);u(HDc,5,18,10,1);u(HDc,9,8,2,10)}
  else{u(HC,6,7,8,5);u(HLc,8,8,3,1);u(HDc,6,11,8,1)}
 }else{
  M(HC,7,7,7,2);M(HLc,9,7,3,1);M(HC,10,9,1,2);                              // mái + tóc mai phía trước tai
  if(fem){M(HC,3,8,5,10);M(HLc,4,9,1,7);M(HDc,3,17,5,1);M(HC,5,16,3,2)}
  else M(HC,5,8,3,3)
 }


 // hai cánh gà hai bên mũ: lá dựng xiên lên, tách khỏi vòm bằng đường tối
 const WING=(face)=>{
  [[1,2,0],[18,17,1]].forEach(([tip,x0,m])=>{
   const L=(c,a,y,w)=>u(c,m?a:a,y,w,1);
   if(!m){u(YD,1,1,1,1);u(Y1,1,2,2,1);u(YD,1,2,1,1);u(Y1,1,3,3,1);u(YL,2,3,1,1);u(YD,1,3,1,1);u(Y1,1,4,3,1);u(YD,1,4,1,1);u(YDD,2,4,1,1);u(Y1,2,5,2,1);u(YD,2,6,2,1);u(YD,4,3,1,3)}
   else{u(YD,18,1,1,1);u(Y1,17,2,2,1);u(YD,18,2,1,1);u(Y1,16,3,3,1);u(YL,16,3,1,1);u(YD,18,3,1,1);u(Y1,16,4,3,1);u(YD,18,4,1,1);u(YDD,17,4,1,1);u(Y1,16,5,2,1);u(YD,17,6,2,1);u(YD,15,3,1,3)}
  })};
 // ---- mũ vịt ----
 if(!side&&!back){
  // chỏm lông trên đỉnh
  u(Y1,9,-1,2,1);u(YL,9,-1,1,1);u(Y1,8,0,4,1);u(YL,8,0,1,1);
  // thân mũ (vòm)
  u(Y1,7,1,6,1);u(YL,7,1,2,1);
  u(Y1,6,2,8,1);u(YL,6,2,1,1);
  u(Y1,5,3,10,3);u(YL,5,3,1,2);u(YD,14,3,1,3);u(YD,13,2,1,1);
  // hai cánh hai bên (cánh gà): lá dựng xiên ra ngoài, mép ngoài tối
  WING(true);
  // mắt to có điểm sáng
  u(EY,6,3,2,2);u(WH,6,3,1,1);u(EY,12,3,2,2);u(WH,12,3,1,1);
  // mỏ cam to giữa mũ + má hồng
  u(OR,8,4,4,1);u(OR,8,5,4,1);u(ORD,9,5,2,1);u('#ffb85a',8,4,1,1);
  u(PK,5,5,1,1);u(PK,14,5,1,1);u(PK,6,5,1,1);u(PK,13,5,1,1);
  // viền mũ + đường may cam
  u(YD,5,6,10,1);u(YDD,6,6,1,1);u(YDD,8,6,1,1);u(YDD,10,6,1,1);u(YDD,12,6,1,1);
  u('#ffb02e',7,1,1,1);u('#ffb02e',5,2,1,1);
 }else if(back){
  u(Y1,9,-1,2,1);u(YL,9,-1,1,1);u(Y1,8,0,4,1);
  u(Y1,7,1,6,1);u(YL,7,1,2,1);u(Y1,6,2,8,1);u(Y1,5,3,10,3);u(YL,5,3,1,3);u(YD,14,3,1,3);
  u(YD,10,2,1,4);u('#ffb02e',9,2,1,4);                                       // đường may giữa lưng mũ
  WING(false);
  u(YD,5,6,10,1);u(YDD,7,6,1,1);u(YDD,12,6,1,1);
 }else{
  // chỏm lông + vòm (nhìn ngang, mặt hướng về bên "trước")
  M(Y1,8,-1,2,1);M(YL,8,-1,1,1);M(Y1,7,0,4,1);
  M(Y1,6,1,7,1);M(YL,6,1,2,1);M(Y1,5,2,9,1);M(YL,5,2,1,1);M(Y1,4,3,10,3);M(YL,4,3,1,2);M(YD,13,3,1,3);
  // cánh gần (nằm phía sau tai, dựng chéo ra sau)
  M(Y1,2,1,1,1);M(Y1,2,2,2,1);M(Y1,1,3,3,1);M(Y1,2,4,3,1);M(YD,1,3,1,1);M(YD,2,5,2,1);M(YL,3,2,1,1);
  // mắt + má
  M(EY,11,3,2,2);M(WH,11,3,1,1);M(PK,10,5,2,1);
  // mỏ cam nhô ra phía trước
  M(OR,14,3,3,1);M(OR,14,4,3,1);M(ORD,14,5,2,1);M('#ffb85a',14,3,1,1);
  // viền mũ + đường may
  M(YD,4,6,11,1);M(YDD,6,6,1,1);M(YDD,8,6,1,1);M(YDD,10,6,1,1);M(YDD,12,6,1,1);
 }
};

})();
