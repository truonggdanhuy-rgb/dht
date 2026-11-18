/* DUVIT.JS — ☂️ DÙ VỊT VÀNG (phụ kiện cầm tay, t:'hold') — 🪙 10.000 Xu, bán ở Shop Phố xá → tab 🎀 Phụ kiện
   Đồng thời là KHUNG DÙ DÙNG CHUNG: window.UMB.draw(P, kiểu). Muốn làm dù mới (dù hoa, dù mèo, dù trong suốt...)
   chỉ cần khai báo 1 "kiểu" (bảng màu + hàm trang trí mặt dù) rồi UMB.add({n,k,xu,style}) — xem cuối file, mẫu "dù vịt".

   Quy ước hình dù (đã chốt với người làm game):
   - Dù RẤT TO, phủ cả đầu nhân vật (rộng 34px, nhân vật chỉ rộng 20px); vành dù nằm trên đỉnh mũ cao nhất (mũ Vô Thường cao tới y=-12 nên vành ở y=-14), KHÔNG che mặt.
   - Cán là 1 thanh THẲNG ĐỨNG, mỏng 1px (không nghiêng, không cong). Đầu dưới là tay cầm 2px.
   - Cán dài hơn đầu nhân vật; đáy cán dừng ở y = hy+5 (≈ ngang hông) → KHÔNG chạm đất.
   - Cán lệch ra ngoài 2px so với bàn tay (dx=2) để cán không che tay / vai; bàn tay vẽ đè lên cán ở cuối.
   - Nhìn thẳng: có mặt (mắt + mỏ). Nhìn nghiêng: cánh bên hông. Quay lưng: chỉ có nan dù + đuôi vịt. */
(function(){
const GIA=10000;                      // ← giá Xu ở Shop Phố xá
const W=34, HH=14;                    // rộng dù / cao mái dù (px)
const A=W/2;                          // nửa rộng
const PDX=2;                          // độ lệch cán so với bàn tay (dx)
const RIM_UP=36;                      // vành dù cao hơn bàn tay bao nhiêu px (rim y = hy-RIM_UP)

/* ===== KHUNG DÙ DÙNG CHUNG ===== */
// style = {base, light, dark, edge, rib, under, pole, poleL, grip, gripD, tip, face(R,ctx,view)}
function drawUmb(P,S){
 const hy=P.hy, view=P.back?'back':(P.side?'side':'front');
 const cx=PDX;                                   // tâm dù = đúng đầu cán (cán thẳng đứng)
 const rim=hy-RIM_UP, top=rim-HH+1;              // rim = hàng dưới cùng của mái
 const R=(c,x,y,w,h)=>P.R(c,cx+x,y,w,h);          // R theo tâm dù, x âm = sang trái
 const hwAt=(r)=>{const t=(HH-r-.5)/HH; return Math.max(1,Math.round(A*Math.pow(1-t*t,.5)*1.0))};  // nửa rộng hàng r (0=đỉnh)
 const ribs=view=='side'?[-11,-5,5,11]:[-15,-9,9,15];          // x nan dù tại vành

 /* --- 1. mái dù: tô từng hàng --- */
 for(let r=0;r<HH;r++){
  const y=top+r, hw=hwAt(r)+(r==HH-1?0:0);
  for(let x=-hw;x<hw;x++){
   const f=(x+hw)/(2*hw);                         // 0 trái .. 1 phải
   let c=S.base;
   if(f<.28||(r<3&&f<.4))c=S.light;               // sáng bên trái/đỉnh
   else if(f>.74)c=S.dark;                         // tối bên phải
   if(r==HH-1)c=S.under;                           // dải vành (mặt trong tối hơn)
   R(c,x,y,1,1);
  }
  // viền ngoài
  R(S.edge,-hw-1,y,1,1);R(S.edge,hw,y,1,1);
  if(r==0)for(let x=-hw;x<hw;x++)R(S.edge,x,y-1,1,1);
 }
 R(S.edge,-hwAt(HH-1)-1,rim+1,1,1);R(S.edge,hwAt(HH-1),rim+1,1,1);

 /* --- 2. nan dù: đường cong từ đỉnh xuống vành --- */
 ribs.forEach(xr=>{
  for(let r=1;r<HH-1;r++){
   const k=Math.pow(r/(HH-1),1.15), x=Math.round(xr*k-(xr<0?0:0));
   if(Math.abs(x)<hwAt(r)-0)R(S.rib,x,top+r,1,1);
  }
 });

 /* --- 3. vành dù lượn sóng: đầu nan chúc xuống, giữa các múi vồng lên --- */
 for(let x=-A+1;x<A-1;x++){
  if(ribs.some(xr=>x==xr||x==xr-1))R(S.edge,x,rim+1,1,1);   // đầu nan chúc xuống
 }
 R(S.edge,-A+1,rim+1,2,1);R(S.edge,A-3,rim+1,2,1);           // 2 mép ngoài cùng

 /* --- 4. trang trí theo hướng nhìn (mặt vịt / cánh / đuôi) --- */
 if(S.deco)S.deco(R,{view,top,rim,hwAt,t:P.t});

 /* --- 5. đầu nhọn trên đỉnh dù --- */
 R(S.tip,-1,top-2,2,2);R(S.edge,-1,top-3,2,1);

 /* --- 6. cán dù: thẳng đứng, mỏng 1px, từ vành xuống tay --- */
 for(let y=rim+2;y<=hy-3;y++)R(S.pole,0,y,1,1);
 R(S.under,0,rim+1,1,1);                           // gốc cán dưới vành
 // tay cầm 2px (dày hơn cán 1 chút), dừng ở hy+5 để không chạm đất
 R(S.grip,0,hy-2,2,8);R(S.gripD,1,hy-2,1,8);R(S.poleL,0,hy-2,1,1);
 R(S.gripD,0,hy+5,2,1);

 /* --- 7. bàn tay đè lên cán (hơi chếch ra ngoài) --- */
 const SK='#f1c08a',SKD='#d99e6a';
 R(SK,-1,hy-1,4,2);R(SKD,-1,hy+1,4,1);R(SK,0,hy-2,2,1);
}

/* ===== KIỂU: DÙ VỊT VÀNG ===== */
const DUCK={
 base:'#ffd23a',light:'#ffe680',dark:'#f4b820',edge:'#d98a10',rib:'#f2a91c',under:'#f0a818',
 pole:'#f08a1c',poleL:'#ffb347',grip:'#ffd23a',gripD:'#e8951c',tip:'#ff9a1f',
 deco(R,d){
  const{view,top,rim}=d,EY='#2a1a10',BK='#ff9a1f',BKL='#ffb84d',BKD='#c8650e',BL='rgba(255,150,130,.75)';
  if(view=='front'){
   const ey=rim-8;
   R(EY,-7,ey,2,3);R(EY,5,ey,2,3);R('#ffffff',-7,ey,1,1);R('#ffffff',5,ey,1,1);   // 2 mắt đen + chấm sáng
   R(BKL,-4,ey+4,8,1);R(BK,-4,ey+5,8,2);R(BKD,-3,ey+7,6,1);R(BKD,-4,ey+5,1,2);R(BKD,3,ey+5,1,2);  // mỏ vịt cam dẹt
   R('#ffffff',-3,ey+4,1,1);
   R(BL,-11,ey+3,3,1);R(BL,8,ey+3,3,1);                                             // má hồng
  }else if(view=='side'){
   const ey=rim-8;
   R(EY,-3,ey,2,3);R('#ffffff',-3,ey,1,1);
   R(BKL,-9,ey+4,6,1);R(BK,-9,ey+5,6,2);R(BKD,-8,ey+7,5,1);                         // mỏ chìa ra phía trước
   R(BL,0,ey+3,3,1);
   R(S_WING,3,rim-8,7,5);R(S_WINGD,3,rim-3,7,1);R(S_WINGD,9,rim-8,1,5);R('#fff3b0',4,rim-7,3,1);  // cánh bên hông
  }else{
   R('#ffec99',-4,rim-9,8,3);R('#f4b820',-4,rim-6,8,1);R('#ffec99',-2,rim-11,4,2);  // đuôi vịt
  }
  if(view!='side'){  // 2 cánh nhỏ ở 2 múi ngoài
   R(S_WING,-16,rim-6,4,3);R(S_WINGD,-16,rim-3,4,1);R('#fff3b0',-15,rim-6,2,1);
   R(S_WING,12,rim-6,4,3);R(S_WINGD,12,rim-3,4,1);R('#fff3b0',13,rim-6,2,1)}
 }
};
const S_WING='#ffe680',S_WINGD='#e8a21a';

/* ===== ĐĂNG KÝ ===== */
window.UMB={draw:drawUmb,styles:{duck:DUCK},
 add(o){if(typeof ACCS==='undefined'||ACCS.some(a=>a.k===o.k))return;
  ACCS.push({n:o.n,k:o.k,t:'hold',xu:o.xu,art:(P)=>drawUmb(P,o.style)})}};
window.accDuVit=(P)=>drawUmb(P,DUCK);

UMB.add({n:'Dù vịt vàng',k:'duvit',xu:GIA,style:DUCK});
})();
