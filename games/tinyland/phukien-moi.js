/* ===================================================================================
   PHUKIEN-MOI.JS — 🏮 Đèn lồng cá chép, 🔦 Đèn pin thám tử, 🧋 Ly trà sữa, 📷 Máy ảnh Retro, 🦋 Cánh Bướm Đêm
   • Đèn lồng cá chép & Đèn pin & Cánh Bướm Đêm tự phát sáng khi đi vào ban đêm (ngaydem-gapthu.js).
   • Bán ở Shop Phố xá (xu) và Shop Kim Cương (Cánh Bướm Đêm: 💎10).
   • Nạp SAU newitems.js & boyboy.js trong index.html. Tự đẩy vào CUỐI mảng ACCS.
   =================================================================================== */
(function(){
'use strict';
if(typeof ACCS==='undefined')return;

// 1) ĐÈN LỒNG CÁ CHÉP (cầm tay — phát sáng ấm ban đêm)
function accLanternCarp(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy,SK='#f1c08a',SKD='#d99e6a';
 const sw=Math.round(Math.sin(t*3.2));
 // que cầm chéo + dây treo
 R('#6b4220',0,hy-8,1,10);R('#8a5a30',1,hy-8,1,7);
 R('#ffd23f',1,hy-9,3,1);R('#d99e26',3+sw,hy-8,1,2);
 // thân cá chép đỏ-cam + vây vàng
 const cx=3+sw,cy=hy-5;
 R('#d93829',cx-2,cy,6,5);R('#ff5a3c',cx-1,cy+1,4,3);R('#ffd23f',cx,cy+1,2,2);R('#fff6c8',cx,cy+2,1,1);
 // đuôi cá + vây nhỏ
 R('#f59a23',cx-4,cy+1,2,3);R('#ffd23f',cx-4,cy+2,1,1);
 R('#ffd23f',cx,cy-1,2,1);R('#ffffff',cx+2,cy+1,1,1);R('#222222',cx+3,cy+1,1,1);
 // tua rua vàng rủ dưới đèn
 R('#ffcf4a',cx,cy+5,1,2);R('#e84a3c',cx,cy+7,1,1);
 // bàn tay nắm cán
 R(SK,-1,hy-1,3,2);R(SKD,-1,hy+1,3,1);
}

// 2) ĐÈN PIN THÁM TỬ (cầm tay — chiếu luồng sáng ban đêm)
function accFlashlight(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy,SK='#f1c08a',SKD='#d99e6a';
 if(P.back){
  R('#3b4252',-1,hy-5,3,6);R('#5e677d',-1,hy-5,1,5);R('#e0584a',0,hy-3,1,1);
  R(SK,-1,hy-1,3,2);R(SKD,-1,hy+1,3,1);return;
 }
 // thân đèn pin thép + đầu loe vàng
 R('#2e3440',-1,hy-4,3,5);R('#4c566a',-1,hy-4,1,4);R('#e0584a',0,hy-3,1,1);
 R('#8892a4',-2,hy-7,5,3);R('#d8dee9',-2,hy-7,5,1);
 R('#fff5a8',-1,hy-8,3,1);
 if(Math.sin(t*4)>0.2){R('rgba(255,245,168,0.45)',-2,hy-10,5,2)}
 R(SK,-1,hy-1,3,2);R(SKD,-1,hy+1,3,1);
}

// 3) LY TRÀ SỮA TRÂN CHÂU (cầm tay)
function accBobaCup(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,hy=P.hy,SK='#f1c08a',SKD='#d99e6a';
 // ống hút sọc hồng-trắng
 R('#ff6fa8',1,hy-13,1,5);R('#ffffff',1,hy-12,1,1);R('#ffffff',1,hy-10,1,1);
 // nắp vòm trong suốt
 R('#e8f7ff',-2,hy-9,6,2);R('#ffffff',-1,hy-10,4,1);R('#c2e5f5',-2,hy-8,6,1);
 // thân ly trà sữa + trân châu đen ở đáy
 R('#e6b88a',-2,hy-7,6,6);R('#f4d2ae',-2,hy-7,2,6);R('#c9925c',3,hy-7,1,6);
 R('#2b1b18',-1,hy-3,1,1);R('#2b1b18',1,hy-2,1,1);R('#2b1b18',2,hy-3,1,1);R('#2b1b18',0,hy-2,1,1);
 R('#a86e42',-1,hy-1,4,1);
 // tay cầm
 R(SK,-1,hy-2,3,2);R(SKD,-1,hy,3,1);
}

// 4) MÁY ẢNH RETRO (cầm tay)
function accRetroCam(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy,SK='#f1c08a',SKD='#d99e6a';
 // thân máy bạc + bọc da nâu
 R('#d8dee9',-3,hy-8,8,2);R('#8a5430',-3,hy-6,8,4);R('#5c341a',-3,hy-3,8,1);
 R('#ffffff',-2,hy-8,2,1);R('#e0584a',3,hy-9,1,1); // nút chụp
 // ống kính tròn giữa
 R('#2b303a',-1,hy-7,4,4);R('#566173',0,hy-6,2,2);R('#88d8ff',0,hy-6,1,1);
 // chớp đèn flash nhỏ theo chu kỳ
 if(Math.sin(t*1.6)>0.92){
  R('#fffbe0',2,hy-8,2,2);R('rgba(255,250,210,0.7)',1,hy-9,4,4);
 }
 R(SK,-1,hy-1,3,2);R(SKD,-1,hy+1,3,1);
}

// 5) CÁNH BƯỚM ĐÊM (đeo lưng t:'wing', wing:'nightbf' — phát sáng xanh tím ban đêm)
function drawNightButterfly(R,view,t,mv,k){
 const fl=mv?Math.sin(t*11)*2.4:Math.sin(t*2.6)*1.1;
 const side=view==='near'||view==='far',far=view==='far';
 const C1=far?'#1b2559':'#2b3d8f',C2=far?'#44318d':'#6f48c9',C3=far?'#3a7ca5':'#52e5ff',GL='#d6faff';
 const wingHalf=(sx,sh)=>{
  const s=sx,dy=Math.round(fl);
  // cánh trên lớn
  for(let row=0;row<9;row++){
   const w=row<2?4+row:row<6?7:6-(row-6);
   const x0=s>0?11+sh:10-sh-w;
   R(C1,x0,11+row+dy,w,1);
   if(w>=3)R(C2,x0+(s>0?1:1),11+row+dy,w-2,1);
   if(row===2||row===4)R(C3,x0+(s>0?w-3:1),11+row+dy,2,1);
  }
  R(GL,s>0?14+sh:5-sh,13+dy,1,1);
  // cánh dưới tròn mềm
  for(let row=0;row<6;row++){
   const w=row<3?4+row:5-(row-3);
   const x0=s>0?11+sh:10-sh-w;
   R(C1,x0,20+row+(dy>>1),w,1);
   if(w>=3)R(C2,x0+1,20+row+(dy>>1),w-2,1);
   if(row===2)R(C3,x0+(s>0?w-2:1),20+row+(dy>>1),1,1);
  }
  // hạt bụi tiên lấp lánh
  if(!far&&Math.sin(t*4+sx)>0.2){
   R(GL,s>0?17+sh:2-sh,10+dy,1,1);
   R('#c99cff',s>0?16+sh:3-sh,23+(dy>>1),1,1);
  }
 };
 if(view==='front'){
  wingHalf(-1,1);wingHalf(1,1);
 }else if(view==='back'){
  wingHalf(-1,0);wingHalf(1,0);
  R('#141a3d',9,14,2,9);R('#52e5ff',9,15,2,1);
 }else if(side){
  const dir=k.Rt?-1:1;
  wingHalf(dir,far?-2:0);
 }
}
window.WINGS=window.WINGS||{};
window.WINGS.nightbf=drawNightButterfly;

const ADD_ACCS=[
 {n:'Đèn lồng cá chép',k:'lanterncarp',t:'hold',xu:1800,art:accLanternCarp,ds:'Đèn lồng cá chép đỏ vàng, tự tỏa sáng ấm vào ban đêm.'},
 {n:'Đèn pin thám tử',k:'flashlight',t:'hold',xu:1200,art:accFlashlight,ds:'Đèn pin thép soi sáng đường đi vào ban đêm.'},
 {n:'Ly trà sữa trân châu',k:'bobacup',t:'hold',xu:800,art:accBobaCup,ds:'Ly trà sữa trân châu mát lạnh có ống hút sọc hồng.'},
 {n:'Máy ảnh Retro',k:'retrocam',t:'hold',xu:1500,art:accRetroCam,ds:'Máy ảnh cổ điển thỉnh thoảng nháy đèn flash.'},
 {n:'Cánh Bướm Đêm',k:'nightbf',t:'wing',wing:'nightbf',dia:10,ds:'Cánh bướm xanh tím huyền bí phát sáng nhẹ vào ban đêm.'}
];
for(const it of ADD_ACCS)if(!ACCS.some(a=>a.k===it.k))ACCS.push(it);
})();
