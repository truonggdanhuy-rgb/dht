/* ===================================================================================
   BOSIUTAP-DEM.JS — 5 BỘ SƯU TẬP MỚI (Set + Tóc/Mũ + Mascot) — KHÔNG CHE MẶT
   1. 🍊 Capybara Chill (Mascot)            : capychill  (4.500 Xu)
   2. 🧋 Trà Sữa Trân Châu (Nam/Nữ + Mũ)    : tsnam, tsnu (2.500 Xu) | tshair (2.000 Xu)
   3. 🕵️ Thám Tử Phố Đêm (Nam/Nữ + Mũ Phớt) : detm, detf (3.000 Xu)  | dethair (2.200 Xu)
   4. 🤿🧜 Thợ Lặn & Tiên Cá Biển Đêm       : diverm, merf (3.500 Xu) | diverh (2.500 Xu), merh (2.800 Xu)
   5. 🚀🦊 Phi Hành Gia Mini & Cáo 9 Đuôi   : astromini (6.000 Xu) | fox9 (4.500 Xu + 450 QV + 4 💎)
   • Giữ nguyên 100% khuôn mặt & biểu cảm người chơi (faceFx / faceDef).
   • Nạp SAU newitems.js & boyboy.js trong index.html. Tự đẩy vào CUỐI mảng SETS / HAIRS / MASCOT_DRAW.
   =================================================================================== */
(function(){
'use strict';
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined')return;
const sin=Math.sin,rnd=Math.round;

const bobOf=(o,K)=>o.nobob?0:o.mv?(K.lg?-1:0):0;

// ============================================================
//  1. MASCOT CAPYBARA CHILL (capychill, wide:1)
// ============================================================
function drawCapyChill(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const OL='#5c3619',BR='#b87b48',BRL='#dfa36e',BRD='#845229',SN='#704120',
       CR='#fff3de',CRL='#ffffff',CRD='#e3cda8',
       OR='#ff8a1f',ORL='#ffd054',ORD='#c9540f',LF='#3ea84f',
       SH='#59341a',SK='#f1c08a',SKD='#d99e6a',PK='#f299a8';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // chân: bộ đồ liền thân capybara nâu + tất kem + dép nâu
 const leg=(x,lift)=>{
  const h=3-lift;
  r(BRD,x,24,4,h);r(BR,x,24,3,h);
  r(CR,x,27-lift,4,2);r(SH,x,29-lift,4,1);
  if(side){const tx=Rt?x+4:x-1;r(CR,tx,28-lift,1,1);r(SH,tx,29-lift,1,1)}
 };
 if(rd){}else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 const arm=(x,ay)=>{
  u(BR,x,15+ay,3,5);u(BRL,x,15+ay,1,4);u(BRD,x+2,15+ay,1,5);
  u(CR,x,20+ay,3,2);u(BRD,x,22+ay,3,1);
 };
 const armUp=(x,h)=>{const ty=17-h;u(BRD,x,ty,3,2);u(CR,x,ty+2,3,2);u(BR,x,ty+4,3,3)};

 if(!side){
  // thân bộ đồ capybara nâu + bụng kem lớn mềm mại (liền cổ y=14)
  u(OL,7,14,6,1);u(CR,8,14,4,1);
  fill(BR,[[15,5,15],[16,4,16,7],[23,5,15]]);
  u(BRL,5,16,2,6);u(BRD,14,16,2,6);u(BRD,5,23,10,1);
  if(!back){
   u(CR,6,16,8,7);u(CRL,7,16,6,2);u(CRD,6,22,8,1);
   // huy hiệu quả quýt nhỏ trước ngực
   u(OR,9,18,2,2);u(LF,9,17,2,1);
   u('#ffd23f',6,16,1,1);u('#ffd23f',13,16,1,1);
  }else{
   // đuôi tròn nhỏ sau lưng
   u(OL,8,21,4,3);u(BR,9,21,2,2);
  }
  if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0]):arm(2,lg);armUp(15,o.aup[1])}
  else{arm(2,lg);arm(15,-lg)}

  // MŨ TRÙM ĐẦU CAPYBARA: tai tròn nằm thấp 2 bên (không phải tai gấu chổng lên!), trán phẳng + mõm capybara + quýt
  // tai tròn capybara nhỏ gọn hai bên thái dương
  u(OL,2,4,2,3);u(BR,3,4,2,2);u(BRD,3,5,1,1);
  u(OL,16,4,2,3);u(BR,15,4,2,2);u(BRD,16,5,1,1);
  // khối mũ trùm capybara bo viền nâu đậm
  fill(OL,[[2,5,15],[3,4,16],[4,3,17,9],[13,4,16]]);
  fill(BR,[[3,5,15],[4,4,16,8],[12,5,15]]);
  u(BRL,6,3,8,1);u(BRL,5,4,3,1);
  // QUẢ QUÝT ĐỈNH ĐẦU (bóng cam + viền + lá xanh)
  u(ORD,8,0,4,3);u(OR,8,0,4,2);u(ORL,9,0,2,1);u(LF,9,-1,2,1);u('#6be068',9,-1,1,1);

  if(back){
   u(BRD,5,11,10,2);u(CRD,7,5,6,1);
  }else{
   // khuôn mặt capybara đặc trưng trên phần mũ trán (y=3..6): mõm nâu rộng + mũi Y + mắt hí chill -_-
   u(SN,8,4,4,3);u(OL,9,4,2,1);u(OL,9,5,1,1);u(OL,10,5,1,1);
   u(OL,5,4,2,1);u(OL,13,4,2,1); // mắt hí chill của mũ capybara
   u(PK,4,5,1,1);u(PK,15,5,1,1); // má hồng mũ capybara
   // viền lót kem ôm gọn khuôn mặt chuẩn 8px (x=6..14) -> KHÔNG hở da 2 bên!
   u(CR,5,6,10,8);
   fill(SK,[[7,7,13],[8,6,14,5],[13,7,13]]);
   u(SKD,7,13,6,1);
   u('#5c3926',7,7,6,1);u('#5c3926',6,8,1,2);u('#5c3926',13,8,1,2);
   if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,0,0);
   else if(typeof faceDef==='function')faceDef(u,0,0);
  }
 }else{
  // nhìn ngang (nhân vật mặc bộ capybara + mũ mõm vuông dài đặc trưng nhô ra trước trán!)
  M(OL,4,21,3,3);M(BR,4,21,2,2);
  M(OL,8,14,5,1);M(CR,9,14,3,1);
  fill(BR,[[15,6,14],[16,5,15,7],[23,6,14]]);
  M(CR,10,16,4,6);M(BRD,6,16,2,6);
  // mũ capybara nhìn ngang: hộp đầu phẳng + mõm capybara nhô dài ra trước trán (x=13..16)
  M(OL,3,3,2,3);M(BR,4,3,2,2);
  fill(OL,[[2,5,14],[3,4,15],[4,3,16,9],[13,4,15]]);
  fill(BR,[[3,5,14],[4,4,15,8],[12,5,14]]);
  M(BRL,6,3,7,1);
  // tai tròn capybara bên má mũ + mắt hí chill + mõm vuông nhô ra
  M(BRD,5,5,2,2);M(OL,11,4,2,1);M(SN,13,4,3,3);M(OL,15,4,1,1);M(PK,12,5,1,1);
  // quả quýt
  M(ORD,8,0,4,3);M(OR,8,0,4,2);M(ORL,9,0,2,1);M(LF,9,-1,2,1);
  // mặt người chơi (8px gọn bên trong viền kem, không lòi da)
  M(CR,7,6,7,8);
  fill(SK,[[7,9,13],[8,8,14,5],[13,9,13]],1);
  M(SKD,9,13,4,1);
  M('#5c3926',9,7,4,1);M('#5c3926',8,8,1,2);
  if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,1,Rt);
  else if(typeof faceDef==='function')faceDef(u,1,Rt);
  const am=rnd(lg);
  if(!o.noarm){M(BR,8+am,15,3,5);M(CR,8+am,20,3,2);M(BRD,8+am,22,3,1)}
 }
}

// ============================================================
//  2. TRÀ SỮA TRÂN CHÂU (tsnam, tsnu, tshair)
// ============================================================
SETFX.bs_ts=(u,o,S,K)=>{
 const {side,Rt,back,sit,rd,lg,sx}=K,fem=S.bsg==='f',bob=bobOf(o,K);
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);
 const MT='#e6b88a',MTL='#f7d8b5',MTD='#c28b58',
       CR='#fff7eb',CRS='#e8d8c0',BB='#2c1d1a',ST='#ff78aa',SHO='#633e26';

 if(!side){
  // áo hoodie trà sữa kem caramen
  u(MT,4,16,12,5);u(MTL,5,16,3,4);u(MTD,14,16,2,5);
  u(CR,6,15,8,2);u(ST,9,15,2,1);
  if(!back){
   // họa tiết hạt trân châu đen rải ở gấu áo
   for(const px of[6,9,11,13])u(BB,px,19+(px&1),1,1);
   u('#ff78aa',8,17,4,1); // đường kem hồng
  }else{
   u(CR,6,16,8,3);u(ST,9,16,2,2);
  }
  if(fem&&!rd){
   // chân váy xếp ly màu trà sữa caramen + tất kem
   for(let y=21;y<=25;y++){
    const a=y<=22?5:y<=24?4:3,w=20-2*a;
    u(y%2?MT:MTL,a,y,w,1);
    if(y===25){for(let x=a;x<20-a;x+=2)u(BB,x,25,1,1)}
   }
  }else if(!rd){
   u(MTD,5,21,10,2);
  }
 }else{
  u(MT,6,16,8,5);u(MTL,7,16,3,4);M(CR,8,15,6,2);
  if(!back)M(BB,11,19,1,1),M(BB,9,20,1,1);
  if(fem&&!rd){
   for(let y=21;y<=25;y++){const a=y<=22?6:y<=24?5:4;M(y%2?MT:MTL,a,y,14-2*a,1)}
  }
 }
 // giày nâu caramen + tất kem (nữ)
 if(!rd&&fem){
  let L=sit?[[6,0],[11,0]]:!side?(lg>0?[[11,0],[6,1]]:lg<0?[[6,0],[11,1]]:[[6,0],[11,0]]):[[8+sx,lg>0?1:0],[10-sx,lg<0?1:0]];
  for(const[x,l]of L){Q(CR,x,27,3,2-l);Q(SHO,x,29-l,3,1)}
 }
};

HAIRFX.tshair=(u,o,K)=>{
 const {side,Rt,back}=K,M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const HC='#5c3a28',HL='#875940',HD='#3b2216',
       CAP='#f5dfbf',CAPL='#ffffff',CAPD='#d4b288',ST='#ff6ea3',BB='#2c1d1a';
 if(!side){
  // mũ nồi kiểu ly trà sữa + ống hút hồng chĩa lên
  u(ST,12,0,2,4);u('#ffffff',12,1,2,1);u('#ffffff',12,3,2,1);
  u(CAPL,6,3,8,1);u(CAP,5,4,10,3);u(CAPD,4,6,12,1);
  u(BB,6,5,1,1);u(BB,9,4,1,1);u(BB,12,5,1,1);
  if(back){
   u(HC,5,7,10,8);u(HL,7,8,2,5);u(HD,5,13,10,2);
  }else{
   u(HC,5,7,10,2);u(HL,7,7,3,1);u(HC,5,9,2,4);u(HC,13,9,2,4);u(HD,6,9,1,2);u(HD,13,9,1,2);
  }
 }else{
  M(ST,10,0,2,4);M('#ffffff',10,1,2,1);
  M(CAPL,6,3,7,1);M(CAP,5,4,9,3);M(CAPD,4,6,11,1);
  M(BB,9,5,1,1);M(BB,12,4,1,1);
  M(HC,4,7,6,7);M(HL,6,8,1,4);M(HC,10,7,4,2);M(HD,4,12,6,2);
 }
};

// ============================================================
//  3. THÁM TỬ PHỐ ĐÊM (detm, detf, dethair)
// ============================================================
SETFX.bs_det=(u,o,S,K)=>{
 const {side,Rt,back,sit,rd,lg,sx}=K,fem=S.bsg==='f',bob=bobOf(o,K);
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);
 const TC='#b88b58',TCL='#dbb07a',TCD='#8a6236',SH='#f4f0e8',TIE='#7a1e2e',BELT='#3d2618',BK='#221a16';

 if(!side){
  // áo măng tô trench-coat nâu vàng
  u(TC,4,15,12,6);u(TCL,4,15,2,6);u(TCD,14,15,2,6);
  if(!back){
   u(SH,8,15,4,3);u(TIE,9,15,2,3); // sơ mi + cà vạt đỏ sẫm
   u(TCD,7,15,1,3);u(TCD,12,15,1,3); // ve áo
   u(BELT,4,20,12,1);u('#ffd23f',9,20,2,1); // thắt lưng khóa đồng
   u(TCD,7,22,1,1);u(TCD,12,22,1,1);
  }else{
   u(TCD,5,16,10,2);u(BELT,4,20,12,1);u(TCD,9,18,2,6);
  }
  if(!rd){
   if(fem){
    for(let y=21;y<=25;y++){const a=y<=22?5:4;u(y===25?TCD:TC,a,y,20-2*a,1)}
   }else{
    u(TC,4,21,12,4);u(TCD,4,24,12,1);u(TCL,5,21,2,3);
   }
  }
 }else{
  u(TC,6,15,8,6);u(TCL,7,15,2,5);M(SH,11,15,2,3);M(TIE,12,16,1,2);M(BELT,6,20,8,1);
  if(!rd)M(TC,6,21,8,4),M(TCD,6,24,8,1);
 }
 if(!rd&&fem){
  let L=sit?[[6,0],[11,0]]:!side?(lg>0?[[11,0],[6,1]]:lg<0?[[6,0],[11,1]]:[[6,0],[11,0]]):[[8+sx,lg>0?1:0],[10-sx,lg<0?1:0]];
  for(const[x,l]of L){Q('#2b242c',x,26,3,3-l);Q(BK,x,29-l,3,1)}
 }
};

HAIRFX.dethair=(u,o,K)=>{
 const {side,Rt,back}=K,M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const HC='#262028',HL='#453b4a',HAT='#7a5332',HATL='#a3734a',HATD='#4f331c',BD='#2b1a12';
 if(!side){
  // mũ phớt thám tử + dải ruy băng sẫm
  u(HATL,7,2,6,1);u(HAT,6,3,8,3);u(BD,5,5,10,1);u(HATD,3,6,14,1);u(HAT,4,6,12,1);
  if(back){u(HC,5,7,10,7);u(HL,7,8,2,4)}
  else{u(HC,5,7,10,2);u(HC,5,9,2,3);u(HC,13,9,2,3);u(HL,8,7,2,1)}
 }else{
  M(HATL,7,2,6,1);M(HAT,6,3,7,3);M(BD,5,5,9,1);M(HATD,3,6,13,1);M(HAT,4,6,11,1);
  M(HC,4,7,6,6);M(HC,10,7,4,2);M(HL,6,8,1,3);
 }
};

// ============================================================
//  4. THỢ LẶN & TIÊN CÁ BIỂN ĐÊM (diverm, merf, diverh, merh)
// ============================================================
SETFX.bs_sea=(u,o,S,K)=>{
 const {side,Rt,back,sit,rd,lg,sx}=K,fem=S.bsg==='f',bob=bobOf(o,K);
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);

 if(fem){
  // TIÊN CÁ BIỂN ĐÊM: áo vỏ sò xanh ngọc + váy đuôi vảy phát sáng
  const AQ='#3cc9c4',AQL='#8efaf0',AQD='#1b8287',PU='#8b5ce6',PK='#ff8cc6',PRL='#fff9e8';
  if(!side){
   u(AQ,5,15,10,5);u(AQL,6,16,3,2);u(AQD,13,16,2,4);
   if(!back){
    u(PK,6,16,3,2);u(PK,11,16,3,2);u(PRL,9,17,2,1); // áo vỏ sò + ngọc trai
    u(AQL,5,20,10,1);u(PRL,9,20,2,1);
   }else{
    u(AQD,6,16,8,1);u(PU,6,20,8,1);
   }
   if(!rd){
    // váy vảy tiên cá óng ánh
    for(let y=21;y<=26;y++){
     const a=y<=23?5:y<=25?4:3;
     u(y%2?AQ:PU,a,y,20-2*a,1);
     for(let x=a+1;x<19-a;x+=3)u(AQL,x,y,1,1);
    }
    u(AQL,3,26,14,1);
   }
  }else{
   u(AQ,6,15,8,5);M(PK,11,16,3,2);M(PRL,12,20,1,1);
   if(!rd){for(let y=21;y<=26;y++){const a=y<=23?6:5;M(y%2?AQ:PU,a,y,14-2*a,1);M(AQL,a+1,y,2,1)}}
  }
  if(!rd){
   let L=sit?[[6,0],[11,0]]:!side?(lg>0?[[11,0],[6,1]]:lg<0?[[6,0],[11,1]]:[[6,0],[11,0]]):[[8+sx,lg>0?1:0],[10-sx,lg<0?1:0]];
   for(const[x,l]of L){Q(AQ,x,28,3,1);Q(PRL,x,29-l,3,1)}
  }
 }else{
  // THỢ LẶN BIỂN ĐÊM: đồ lặn xanh đen + sọc neon cyan phát sáng + bình khí nhỏ sau lưng
  const NV='#182647',NVL='#2a4073',CY='#4ce8ff',CYL='#c9fbff',OR='#ff8e3c';
  if(!side){
   u(NV,4,15,12,7);u(NVL,5,15,2,6);u(CY,4,17,12,1);u(OR,9,18,2,2);
   if(back){
    // bình dưỡng khí đôi sau lưng
    u('#7b8a9e',6,15,3,6);u('#7b8a9e',11,15,3,6);u(CYL,6,15,1,5);u(CYL,11,15,1,5);u(CY,7,14,2,1);u(CY,11,14,2,1);
   }
  }else{
   u(NV,6,15,8,7);M(CY,6,17,8,1);M(OR,11,18,2,2);
   M('#7b8a9e',4,15,3,6);M(CYL,4,15,1,5);
  }
 }
};

HAIRFX.diverh=(u,o,K)=>{
 const {side,Rt,back}=K,M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const HC='#1e293b',HL='#3b5278',STR='#222b3d',CY='#4beaff',CYL='#d6fcff',FR='#d9e2ec';
 if(!side){
  u(HC,6,5,8,2);u(HC,5,6,10,3);u(HL,7,6,3,1);
  if(back){
   u(HC,5,9,10,4);u(STR,5,7,10,2);u(CY,9,7,2,1);
  }else{
   // kính lặn viền neon cyan đeo trên trán (không che mắt!)
   u(STR,5,7,10,1);
   u(FR,5,6,4,3);u(FR,11,6,4,3);u(FR,9,7,2,1);
   u(CY,6,7,2,1);u(CY,12,7,2,1);u(CYL,6,6,1,1);u(CYL,12,6,1,1);
   u(HC,5,9,2,3);u(HC,13,9,2,3);
  }
 }else{
  M(HC,5,5,8,3);M(HL,7,6,2,1);M(HC,4,8,5,5);
  M(STR,4,7,7,1);M(FR,10,6,4,3);M(CY,11,7,2,1);M(CYL,11,6,1,1);
 }
};

HAIRFX.merh=(u,o,K)=>{
 const {side,Rt,back}=K,sw=o.mv?rnd(sin(performance.now()/120)):0;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const HC='#30bfbd',HL='#7cf7ec',HD='#178085',SH='#ffd2e6',PRL='#ffffff';
 if(!side){
  if(back){
   u(HC,5,5,10,3);u(HC,4,7,12,13);u(HL,6,7,2,10);u(HL,12,8,1,8);u(HD,4,18,12,2);
   u(HC,3+sw,12,2,8);u(HC,15-sw,12,2,8);
   u(SH,12,6,3,2);u(PRL,13,6,1,1);
  }else{
   u(HC,6,5,8,2);u(HC,5,7,10,2);u(HL,7,6,3,1);
   // 2 lọn tóc ngọc bồng bềnh hai bên vai
   u(HC,3,9,3,11);u(HL,4,10,1,7);u(HD,3,18,2,2);
   u(HC,14,9,3,11);u(HL,15,10,1,7);u(HD,15,18,2,2);
   // kẹp vỏ sò ngọc trai bên mái
   u(SH,12,7,3,2);u(PRL,13,7,1,1);
  }
 }else{
  M(HC,5,5,8,3);M(HL,7,6,3,1);
  M(HC,3,8,6,12);M(HL,5,9,2,8);M(HD,3,18,4,2);
  M(HC,2-sw,12,2,7);
  M(SH,9,7,3,2);M(PRL,10,7,1,1);
 }
};

// ============================================================
//  5. PHI HÀNH GIA MINI (astromini) & CÁO TUYẾT 9 ĐUÔI (fox9)
// ============================================================

// 5A) PHI HÀNH GIA MINI (astromini, wide:1) — mũ kính trong suốt lộ rõ biểu cảm!
function drawAstroMini(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const WH='#f4f8ff',WL='#ffffff',WS='#cbd8ed',WD='#8d9fc2',
       OR='#ff7a2e',ORL='#ffad5c',BL='#36b9ff',CY='#9ef3ff',SK='#f1c08a',SKD='#d99e6a';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 const leg=(x,lift)=>{
  r(WH,x,24,4,3-lift);r(WL,x,24,1,3-lift);r(OR,x,26-lift,4,1);
  r(WS,x,27-lift,4,2);r(WD,x,29-lift,4,1);
  if(side){const tx=Rt?x+4:x-1;r(WS,tx,28-lift,1,1);r(WD,tx,29-lift,1,1)}
 };
 if(rd){}else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 const arm=(x,ay)=>{u(WH,x,15+ay,3,5);u(WL,x,15+ay,1,5);u(OR,x,19+ay,3,1);u(WS,x,20+ay,3,3)};
 const armUp=(x,h)=>{const ty=17-h;u(WS,x,ty,3,3);u(OR,x,ty+3,3,1);u(WH,x,ty+4,3,3)};

 if(!side){
  // ba lô phản lực trắng-cam sau lưng
  if(back){
   u(WH,4,15,12,8);u(WD,5,15,10,1);u(OR,6,17,8,2);u(BL,7,20,2,2);u(BL,11,20,2,2);
  }
  fill(WH,[[15,5,15],[16,4,16,7],[23,5,15]]);
  u(WL,5,16,2,7);u(WS,14,16,2,7);u(OR,5,14,10,2);
  if(!back){
   u(WS,7,17,6,4);u(CY,8,18,2,1);u('#ff4757',11,18,1,1);u('#2ed573',11,20,1,1);
   u(OR,6,22,8,1);
  }
  if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0]):arm(2,lg);armUp(15,o.aup[1])}
  else{arm(2,lg);arm(15,-lg)}

  // mũ phi hành gia kính trong suốt (khung trắng viền xanh ngọc ngoài mặt)
  u(WL,6,2,8,1);u(WH,5,3,10,2);u(OR,5,13,10,1);
  // ăng-ten mini nhấp nháy
  u(WD,14,0,1,3);u(sin(t*5)>0?'#52e5ff':'#ff5e78',14,-1,1,1);
  if(back){
   fill(WH,MSTD.HF);u(WL,6,4,6,1);u(WS,5,11,10,2);u(CY,5,10,10,1);
  }else{
   // nền kính xanh nhạt bên trong mũ + mặt người chơi hoàn toàn rõ nét
   fill('#daf4ff',MSTD.HF);
   u(WH,5,3,10,2);u(WL,6,3,5,1);u(WH,4,5,1,8);u(WH,15,5,1,8);
   u(CY,5,5,10,1);u(CY,5,5,1,8);u(CY,14,5,1,8);
   fill(SK,[[7,7,13],[8,6,14,5],[13,7,13]]);u(SKD,7,13,6,1);
   u('#3b2820',7,7,6,1);u('#3b2820',6,8,1,2);u('#3b2820',13,8,1,2);
   if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,0,0);
   else if(typeof faceDef==='function')faceDef(u,0,0);
   // ánh kính phản chiếu nhẹ ở mép trên-trái (không che mắt)
   u('rgba(255,255,255,0.72)',6,6,2,1);u('rgba(255,255,255,0.5)',5,7,1,2);
  }
 }else{
  // ba lô phản lực bên lưng
  M(WS,2,15,4,8);M(OR,3,17,2,3);
  if(o.mv&&sin(t*14)>0)M('#5ce1ff',2,23,2,2);
  fill(WH,[[15,6,14],[16,5,15,7],[23,6,14]]);M(OR,6,14,8,2);
  M(WH,6,2,7,1);M(WD,6,0,1,3);M(sin(t*5)>0?'#52e5ff':'#ff5e78',6,-1,1,1);
  fill('#d8f2ff',MSTD.HS,1);
  M(WH,5,3,8,3);M(WH,4,5,2,8);M(CY,14,6,1,6);M(OR,5,13,9,1);
  fill(SK,[[7,9,13],[8,8,15,5],[13,9,14]],1);
  M('#3b2820',9,7,4,1);M('#3b2820',8,8,1,2);
  if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,1,Rt);
  else if(typeof faceDef==='function')faceDef(u,1,Rt);
  M('rgba(255,255,255,0.6)',9,6,2,1);
  const am=rnd(lg);
  if(!o.noarm){M(WH,8+am,15,3,5);M(OR,8+am,19,3,1);M(WS,8+am,20,3,3)}
 }
}

// 5B) CÁO TUYẾT 9 ĐUÔI (fox9, wide:1) — tóc tuyết phủ kín đầu không lòi da + tai cáo tam giác + 9 đuôi bông trắng mượt xòe 2 lớp!
function drawFox9(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000,mv=!!o.mv;
 const WH='#ffffff',WS='#e6f0fc',WD='#a4bfe3',OL='#7c9bc9',
       IC='#49b3ff',ICL='#9ef0ff',ICD='#267bc4',PK='#ff9ec6',GOLD='#ffd64a',
       SK='#f1c08a',SKD='#d99e6a';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // 9 ĐUÔI TUYẾT XÒE HÌNH QUẠT — vẽ 2 PASS (Pass 1 viền xanh băng dịu, Pass 2 lông tuyết trắng muốt) nên KHÔNG bị lem đè!
 const drawTails=(frontLayer)=>{
  if(back&&!frontLayer)return;
  if(!back&&frontLayer)return;
  const pts=[];
  for(let i=-4;i<=4;i++){
   const sw=sin(t*2.5+i*0.6)*(mv?1.5:0.7);
   const spread=i*0.29; // xòe rộng đều sang 2 bên
   const len=10-Math.abs(i)*0.45;
   const bx=side?(Rt?7:12):10+i*1.1,by=22;
   const tailPts=[];
   for(let s=1;s<=len;s++){
    const f=s/len;
    // đường cong mềm hướng ra ngoài rồi vểnh cong lên như ngọn lửa lông mềm
    const dirSide=Rt?-1:1;
    const dx=side?(dirSide*(s*1.25+f*f*2.2)):(Math.sin(spread)*s*1.55+(i>=0?1:-1)*f*f*2.5);
    const dy=-Math.cos(spread*0.65)*s*0.95-(f*f*4.5);
    const tx=rnd(bx+dx+sw*f),ty=rnd(by+dy);
    const rad=f<0.25?1:2;
    tailPts.push({x:tx,y:ty,rad,tip:f>0.75});
   }
   pts.push(tailPts);
  }
  // Pass 1: viền xanh băng nhạt vừa khít dưới tất cả 9 đuôi
  for(const tp of pts)for(const p of tp){
   r(OL,p.x-1,p.y-1,p.rad+2,p.rad+2);
  }
  // Pass 2: phần thân lông trắng muốt + chóp đuôi băng tuyết bồng bềnh
  for(const tp of pts)for(const p of tp){
   r(p.tip?ICL:WS,p.x,p.y,p.rad,p.rad);
   r(WH,p.x,p.y,Math.max(1,p.rad-1),Math.max(1,p.rad-1));
  }
 };

 drawTails(false);

 const leg=(x,lift)=>{r(WH,x,24,4,4-lift);r(IC,x,27-lift,4,1);r(ICD,x,28-lift,4,2)};
 if(rd){}else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 const arm=(x,ay)=>{u(WH,x,15+ay,3,5);u(WS,x+2,15+ay,1,5);u(IC,x,20+ay,3,1);u(SK,x,21+ay,3,2)};
 const armUp=(x,h)=>{const ty=17-h;u(SK,x,ty,3,2);u(IC,x,ty+2,3,1);u(WH,x,ty+3,3,4)};

 if(!side){
  // bạch y tiên hồ viền lam băng + đai vàng ngọc (liền cổ y=14)
  u(WH,7,14,6,1);u(SK,8,14,4,1);
  fill(WH,[[15,5,15],[16,4,16,7],[23,5,15]]);
  u(WS,13,16,3,7);u(WD,5,23,10,1);
  u(IC,6,15,8,1);u(GOLD,7,20,6,1);u('#ff6e9c',9,20,2,2);
  if(!back){
   u(IC,7,15,2,2);u(IC,11,15,2,2);u(ICD,9,17,2,3); // cổ áo chéo thanh thoát
  }else{
   u(ICD,6,15,8,2);u(GOLD,8,20,4,1);
  }
  if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0]):arm(2,lg);armUp(15,o.aup[1])}
  else{arm(2,lg);arm(15,-lg)}

  // TAI CÁO TAM GIÁC NHỌN (x=3..7 và 13..17, viền xanh băng nhẹ để tách nền!)
  u(OL,4,0,2,1);u(OL,3,1,4,3);u(WH,4,1,2,3);u(WH,3,3,4,1);u(PK,5,2,1,2);
  u(OL,14,0,2,1);u(OL,13,1,4,3);u(WH,14,1,2,3);u(WH,13,3,4,1);u(PK,14,2,1,2);

  if(back){
   // tóc tuyết dài bồng bềnh phủ kín đầu (không hở viền)
   fill(WD,[[4,5,15],[5,4,16,8],[13,5,15]]);
   fill(WH,[[4,6,14],[5,5,15,7],[12,6,14]]);
   u(WS,6,12,8,3);u(IC,6,10,8,1);u(GOLD,9,10,2,1);
  }else{
   // TÓC TUYẾT PHỦ KÍN KHUNG ĐẦU (y=4..14, x=4..16), KHUÔN MẶT CHUẨN 8px (x=6..14) Ở CHÍNH GIỮA — TUYỆT ĐỐI KHÔNG LÒI ĐẦU!
   fill(WD,[[4,5,15],[5,4,16,8],[13,5,15]]);
   fill(WH,[[4,6,14],[5,5,15,7],[12,6,14]]);
   // hai lọn tóc dài rủ qua vai
   u(WH,4,12,2,5);u(WS,3,13,1,4);u(WH,14,12,2,5);u(WS,16,13,1,4);
   // khuôn mặt chuẩn 8px (x=6..14) nằm gọn bên trong tóc
   fill(SK,[[7,7,13],[8,6,14,5],[13,7,13]]);
   u(SKD,7,13,6,1);
   // mái tóc tuyết rủ nhẹ + trâm cài lam băng & ngọc vàng
   u(WH,6,6,8,2);u(WH,6,8,1,2);u(WH,13,8,1,2);
   u(ICL,6,6,8,1);u(GOLD,9,5,2,1);
   if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,0,0);
   else if(typeof faceDef==='function')faceDef(u,0,0);
  }
  drawTails(true);
 }else{
  M(WH,8,14,5,1);M(SK,9,14,3,1);
  fill(WH,[[15,6,14],[16,5,15,7],[23,6,14]]);M(IC,8,15,6,1);M(GOLD,8,20,5,1);M('#ff6e9c',11,20,1,2);
  // tai cáo tam giác nhìn ngang
  M(OL,6,0,2,1);M(OL,5,1,4,3);M(WH,6,1,2,3);M(PK,7,2,1,2);
  // đầu phủ kín tóc tuyết (khung HS), mặt 8px gọn bên trong
  fill(WD,MSTD.HS,1);
  fill(WH,[[4,6,12],[5,5,13,7],[12,6,12]],1);
  fill(SK,[[7,9,13],[8,8,14,5],[13,9,13]],1);
  M(SKD,9,13,4,1);
  M(WH,4,6,5,10);M(WS,3,8,2,7);M(WH,8,6,5,2);M(ICL,9,6,4,1);M(GOLD,10,5,1,1);
  if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,1,Rt);
  else if(typeof faceDef==='function')faceDef(u,1,Rt);
  const am=rnd(lg);
  if(!o.noarm){M(WH,8+am,15,3,5);M(IC,8+am,20,3,1);M(SK,8+am,21,3,2)}
 }

 // bông tuyết nhỏ bay quanh người
 for(let i=0;i<4;i++){
  const ph=(t*0.5+i*0.25)%1,sy=rnd(28-ph*26),sx=rnd(2+i*5+sin(t*2+i)*2.5);
  if(ph>0.1&&ph<0.9)r('rgba(195,242,255,0.85)',sx,sy,1,1);
 }
}

if(typeof MASCOT_DRAW!=='undefined'){
 MASCOT_DRAW.capychill=drawCapyChill;
 MASCOT_DRAW.astromini=drawAstroMini;
 MASCOT_DRAW.fox9=drawFox9;
}

const ADD_SETS=[
 {n:'Mascot Capybara Chill',k:'capychill',mascot:'capychill',wide:1,xu:4500,
  sh:'#fff3de',shl:'#ffffff',shd:'#e3cda8',scarf:'#a86f42',belt:'#784824',pt:'#a86f42',shoe:'#59341a',
  ds:'Mascot Capybara đầu đội quả quýt cam, giữ nguyên biểu cảm.'},
 {n:'Set Trà Sữa (Nam)',k:'tsnam',fx:'bs_ts',bsg:'m',xu:2500,
  sh:'#e6b88a',shl:'#f7d8b5',shd:'#c28b58',scarf:'#ff78aa',belt:'#c28b58',pt:'#4a3528',shoe:'#3b2418',
  ds:'Áo hoodie trà sữa kem caramen kèm họa tiết trân châu.'},
 {n:'Set Trà Sữa (Nữ)',k:'tsnu',fx:'bs_ts',bsg:'f',xu:2500,
  sh:'#e6b88a',shl:'#f7d8b5',shd:'#c28b58',scarf:'#ff78aa',belt:'#fff7eb',pt:'#f1c08a',rpt:'#fff7eb',shoe:'#633e26',
  ds:'Áo trà sữa caramen kết hợp chân váy xếp ly hạt trân châu.'},
 {n:'Set Thám Tử (Nam)',k:'detm',fx:'bs_det',bsg:'m',xu:3000,
  sh:'#b88b58',shl:'#dbb07a',shd:'#8a6236',scarf:'#7a1e2e',belt:'#3d2618',pt:'#362d2a',shoe:'#221a16',
  ds:'Áo khoác măng tô thám tử cổ điển, cà vạt đỏ sẫm.'},
 {n:'Set Thám Tử (Nữ)',k:'detf',fx:'bs_det',bsg:'f',xu:3000,
  sh:'#b88b58',shl:'#dbb07a',shd:'#8a6236',scarf:'#7a1e2e',belt:'#3d2618',pt:'#f1c08a',rpt:'#2b242c',shoe:'#221a16',
  ds:'Váy măng tô thám tử nâu ấm thanh lịch.'},
 {n:'Set Thợ Lặn Biển Đêm',k:'diverm',fx:'bs_sea',bsg:'m',xu:3500,
  sh:'#182647',shl:'#2a4073',shd:'#0e1830',scarf:'#4ce8ff',belt:'#ff8e3c',pt:'#182647',shoe:'#2e3b5c',
  ds:'Bộ đồ lặn xanh than viền dạ quang cyan kèm bình khí.'},
 {n:'Set Tiên Cá Biển Đêm',k:'merf',fx:'bs_sea',bsg:'f',xu:3500,
  sh:'#3cc9c4',shl:'#8efaf0',shd:'#1b8287',scarf:'#ff8cc6',belt:'#8b5ce6',pt:'#f1c08a',rpt:'#3cc9c4',shoe:'#fff9e8',
  ds:'Áo vỏ sò ngọc trai và váy vảy tiên cá phát sáng nhẹ.'},
 {n:'Mascot Phi Hành Gia Mini',k:'astromini',mascot:'astromini',wide:1,xu:6000,
  sh:'#f4f8ff',shl:'#ffffff',shd:'#cbd8ed',scarf:'#ff7a2e',belt:'#ff7a2e',pt:'#f4f8ff',shoe:'#8d9fc2',
  ds:'Bộ đồ phi hành gia mũ kính trong suốt giữ nguyên biểu cảm khuôn mặt.'},
 {n:'Mascot Cáo Tuyết 9 Đuôi',k:'fox9',mascot:'fox9',wide:1,cb:{xu:4500,qv:450,dia:4},
  sh:'#f7faff',shl:'#ffffff',shd:'#d4e3f7',scarf:'#4da6ff',belt:'#ffd95a',pt:'#f7faff',shoe:'#9ab4db',
  ds:'Bạch y tiên cáo kèm 9 đuôi tuyết trắng xòe chuyển động sau lưng.'}
];
for(const s of ADD_SETS)if(!SETS.some(q=>q.k===s.k))SETS.push(s);

const ADD_HAIRS=[
 {n:'Mũ Trà Sữa Trân Châu',k:'tshair',c:'#5c3a28',xu:2000},
 {n:'Mũ Phớt Thám Tử',k:'dethair',c:'#7a5332',xu:2200},
 {n:'Mũ Kính Lặn Biển Đêm',k:'diverh',c:'#4beaff',xu:2500},
 {n:'Tóc Tiên Cá Vỏ Sò',k:'merh',c:'#30bfbd',xu:2800}
];
for(const h of ADD_HAIRS)if(!HAIRS.some(q=>q.k===h.k))HAIRS.push(h);
})();
