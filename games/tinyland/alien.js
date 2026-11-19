/* ===================================================================================
   ALIEN.JS — 👽 MASCOT KHÁCH LẠ VŨ TRỤ (Người Ngoài Hành Tinh — Pixel 16-bit 20×31)
   • Bán ở SHOP PHỐ XÁ (tab 👕 Set): 5.000 Xu  (đổi giá tại AL_GIA bên dưới).
   • Thiết kế pixel thuần chuẩn Tinyland (không HD, hòa hợp thú cưỡi & thế giới):
     - Đầu người ngoài hành tinh xanh ngọc lục bảo thon cằm, đôi tai nhọn nhỏ, 2 ăng-ten
       đỉnh đầu có cầu năng lượng phát sáng nhấp nháy.
     - Đôi mắt đen huyền hình quả hạnh ánh sao lấp lánh (tự nhiên chớp mắt).
     - Giáp phi hành gia tím vũ trụ – bạc kim loại – viền neon xanh lơ, lõi năng lượng
       trước ngực, balo phản trọng lực sau lưng & ủng không gian đế phát sáng.
   • Hỗ trợ đủ 4 hướng, đi bộ, ngồi, cưỡi thú / xe đạp, giơ tay, cánh & phụ kiện cầm tay.
   • Nạp CUỐI danh sách <script> trong games/tinyland/index.html.
   =================================================================================== */
(function(){
'use strict';
if(typeof SETS==='undefined')return;

const AL_GIA=5000;

// ---------- 1) Khai báo vào CUỐI mảng SETS (bán 5.000 Xu ở Shop Phố xá) ----------
if(!SETS.some(s=>s.k=='alien')){
 SETS.push({n:'Khách Lạ Vũ Trụ',k:'alien',mascot:'alien',xu:AL_GIA,
  ds:'Mascot người ngoài hành tinh xanh ngọc với 2 ăng-ten phát sáng, đôi mắt quả hạnh ánh sao, giáp tím vũ trụ viền neon xanh lơ & balo phản trọng lực.',
  sh:'#2b2458',pt:'#2b2458',rpt:'#2b2458',shoe:'#3ef2c8',scarf:'#3ef2c8'});
}

// ---------- 2) Bảng màu pixel ----------
const SK='#5ee88b',SKL='#a8ffc2',SKD='#279e5d',SKO='#15613a',     // da xanh ngọc người ngoài hành tinh
      EYE='#0c1124',EYS='#29487d',EHL='#ffffff',ECL='#52ffe8',    // mắt đen quả hạnh & ánh sao
      SU='#2b2458',SUL='#4b4094',SUD='#191438',                    // giáp tím vũ trụ
      SV='#dce6ff',SVD='#94a6d6',                                  // giáp vai & găng bạc kim loại
      NE='#3ef2c8',NEL='#b8fff0',NED='#19a896',GD='#ffe46b';       // năng lượng neon & cầu ăng-ten

function drawAlien(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sx=side?lg*(Rt?2:-2):0;
 const pulse=Math.sin(t*4)>.1,blink=(t%4.2)>4.07&&!o.e;
 const ORB=pulse?NEL:GD;

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- 1) CHÂN & ỦNG KHÔNG GIAN (ẩn khi cưỡi để khớp M.legs) ----------
 const leg=(x,lift)=>{
  const h=3-lift;
  r(SU,x,24,4,h);r(SUL,x,24,1,h);r(SUD,x+3,24,1,h);
  if(!lift)r(SV,x+1,25,2,1);                                      // đệm gối bạc
  r(NE,x,27-lift,4,1);r(SV,x,28-lift,4,1);r(SVD,x+3,28-lift,1,1);
  r(S.shoe||NE,x,29-lift,4,1);                                     // đế giày neon
  if(side){const tx=Rt?x+4:x-1;r(SV,tx,28-lift,1,1);r(S.shoe||NE,tx,29-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(12,0)}
 else if(!side){if(lg>0){leg(12,0);leg(5,1)}else if(lg<0){leg(5,0);leg(12,1)}else{leg(5,0);leg(12,0)}}
 else{const a=8+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- 2) TAY & GĂNG BẠC VIỀN NEON ----------
 const arm=(x,ay)=>{
  u(SV,x,15+ay,3,2);u(SVD,x+2,15+ay,1,2);                          // cầu vai bạc
  u(SU,x,17+ay,3,3);u(SUL,x,17+ay,1,3);u(SUD,x+2,17+ay,1,3);       // tay áo tím
  u(NE,x,20+ay,3,1);                                               // vòng cổ tay neon
  u(SV,x,21+ay,3,2);u(SVD,x+2,21+ay,1,2);                          // găng bạc
 };
 const armUp=(x,h)=>{
  const ty=17-h;
  u(SV,x,ty,3,2);u(NE,x,ty+2,3,1);
  u(SU,x,ty+3,3,3);u(SUD,x+2,ty+3,1,3);
 };

 // ---------- 3) THÂN GIÁP + LÕI NĂNG LƯỢNG / BALO PHẢN TRỌNG LỰC ----------
 if(!side){
  // Cổ giáp bạc + chốt neon
  u(SV,6,14,9,1);u(NE,9,14,3,1);
  // Thân giáp tím vũ trụ (x=5..15, cân tâm x=10)
  u(SU,5,15,11,8);u(SUL,5,15,2,7);u(SUD,14,15,2,8);
  if(!rd){u(SU,6,23,9,1);u(SUD,13,23,2,1)}
  // Cầu vai bạc + sọc neon
  u(SV,5,15,3,2);u(SV,13,15,3,2);u(NE,5,17,1,4);u(NE,15,17,1,4);
  // Đai lưng công nghệ neon
  u(SUD,5,22,11,1);u(NE,7,22,7,1);u(NEL,9,22,3,1);

  if(back){
   // Balo phản trọng lực đôi sau lưng
   u(SVD,6,15,9,6);u(SV,7,15,7,5);u(SUD,8,16,5,3);
   u(NE,8,17,2,2);u(NE,11,17,2,2);
   u(pulse?NEL:NE,8,20,2,1);u(pulse?NEL:NE,11,20,2,1);
  }else{
   // Lõi năng lượng tinh cầu trước ngực
   u(SVD,8,16,5,5);u(SU,9,16,3,1);
   u(NED,9,17,3,3);u(NE,9,17,2,2);u(pulse?NEL:EHL,10,18,1,1);
  }

  // Tay
  if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0]):arm(2,lg);armUp(15,o.aup[1])}
  else{arm(2,lg);arm(15,-lg)}

  // ---------- 4) ĐẦU NGƯỜI NGOÀI HÀNH TINH (trước / sau) ----------
  // 2 ăng-ten trên đỉnh đầu + cầu phát sáng
  u(SKD,6,2,1,1);u(SKD,14,2,1,1);
  u(NE,4,1,2,1);u(ORB,5,1,1,1);u(NE,15,1,2,1);u(ORB,15,1,1,1);

  // Vòm đầu xanh ngọc thon cằm (trán rộng x=3..17, cằm x=8..12)
  fill(SK,[[3,6,15],[4,4,17],[5,3,18,3],[8,4,17,2],[10,5,16],[11,6,15],[12,7,14],[13,8,13]]);
  // Đôi tai nhọn nhỏ 2 bên
  u(SK,2,7,1,1);u(SKD,2,8,1,1);u(SK,18,7,1,1);u(SKD,18,8,1,1);
  // Tạo khối sáng trán & bóng cằm
  u(SKL,7,3,6,1);u(SKL,5,4,5,1);u(SKL,4,5,2,2);
  u(SKD,16,6,2,3);u(SKD,15,9,1,2);u(SKD,8,13,5,1);

  if(!back){
   // Đôi mắt đen quả hạnh to đặc trưng + 2 tia sáng sao
   if(blink){
    u(SKO,5,8,4,1);u(SKO,12,8,4,1);
   }else{
    // Mắt trái (x=5..8, nghiêng vào tâm)
    u(EYE,5,6,3,1);u(EYE,5,7,4,1);u(EYE,6,8,3,1);u(EYE,7,9,2,1);
    u(EYS,6,9,1,1);u(EHL,6,7,1,1);u(ECL,8,8,1,1);
    // Mắt phải (x=12..15, đối xứng)
    u(EYE,13,6,3,1);u(EYE,12,7,4,1);u(EYE,12,8,3,1);u(EYE,12,9,2,1);
    u(EYS,14,9,1,1);u(EHL,13,7,1,1);u(ECL,14,8,1,1);
   }
   // Mũi chấm nhỏ & nụ cười tinh nghịch
   u(SKD,9,10,1,1);u(SKD,11,10,1,1);
   u(SKO,9,11,3,1);
  }else{
   // Mảng gáy & vạch sống đầu nhẹ khi quay lưng
   u(SKD,9,5,3,1);u(SKD,8,11,5,2);
  }
 }else{
  // ---------- NHÌN NGANG (vẽ hướng PHẢI, M tự lật khi quay TRÁI) ----------
  // Balo phản trọng lực sau lưng
  M(SVD,4,15,3,6);M(SV,4,16,2,4);M(pulse?NEL:NE,4,20,2,1);M(NE,5,17,1,2);

  // Thân giáp nhìn ngang
  M(SV,7,14,7,1);M(NE,12,14,2,1);
  M(SU,6,15,9,8);M(SUL,12,15,3,7);M(SUD,6,15,2,8);
  if(!rd)M(SU,7,23,7,1);
  M(SV,9,15,5,2);M(NE,13,17,2,3);                                  // giáp vai & lõi ngực bên
  M(SUD,6,22,9,1);M(NE,9,22,6,1);M(NEL,13,22,2,1);                 // đai lưng neon

  // Đầu nhìn ngang thon cằm hướng phải
  M(SKD,8,2,1,1);M(SKD,12,2,1,1);                                  // chân ăng-ten
  M(NE,7,1,2,1);M(ORB,7,1,1,1);M(NE,12,1,2,1);M(ORB,13,1,1,1);     // đầu ăng-ten phát sáng
  fill(SK,[[3,6,14],[4,5,15],[5,4,16,3],[8,5,16,2],[10,6,15],[11,7,15],[12,8,14],[13,9,13]],1);
  M(SKL,7,3,5,1);M(SKL,6,4,4,1);M(SKD,5,9,2,3);M(SKD,9,13,4,1);
  // Tai nhọn ở bên thái dương
  M(SKO,5,7,2,1);M(SK,6,7,1,2);M(SKD,5,8,1,1);

  // Mắt quả hạnh lớn hướng phải
  if(blink){
   M(SKO,12,8,4,1);
  }else{
   M(EYE,12,6,3,1);M(EYE,11,7,5,1);M(EYE,12,8,4,1);M(EYE,13,9,2,1);
   M(EYS,12,9,1,1);M(EHL,13,7,1,1);M(ECL,14,8,1,1);
  }
  // Nụ cười nhỏ gọn
  M(SKO,13,11,2,1);

  // Tay giáp bên hông
  const am=Math.round(lg);
  if(!o.noarm){
   M(SV,9+am,15,3,2);M(SVD,11+am,15,1,2);
   M(SU,9+am,17,3,3);M(SUL,9+am,17,1,3);M(SUD,11+am,17,1,3);
   M(NE,9+am,20,3,1);M(SV,9+am,21,3,2);
  }
 }

 // ---------- 5) HẠT NĂNG LƯỢNG NEON LẤP LÁNH NHẸ ----------
 const SP=[[1,4,0],[18,5,1.5],[2,18,3.1],[17,20,4.6]];
 for(let i=0;i<SP.length;i++){
  const ph=(Math.sin(t*3.1+SP[i][2])+1)*.5;
  if(ph>.5){
   const a=((ph-.5)/.5*.85).toFixed(2);
   r('rgba(82,255,232,'+a+')',SP[i][0],SP[i][1]-(ph>.8?1:0),1,1);
  }
 }
}

window.drawMascotAlien=drawAlien;
if(typeof MASCOT_DRAW!=='undefined')MASCOT_DRAW.alien=drawAlien;
})();
