/* ===================================================================================
   TINHHA.JS — 🪐 MASCOT TINH HÀ VŨ TRỤ (Pixel 16-bit chuẩn Tinyland, NAM + NỮ đều mặc)
   • Bán ở SHOP PHỐ XÁ (tab 👕 Set): 3.500 Xu  (đổi giá tại TH_GIA bên dưới).
   • Thiết kế (vẽ pixel thuần theo lưới chuẩn 20×31 giống clown.js / phuthuy.js):
     - Quả cầu kính không gian trong suốt dạng pixel (viền xanh dương/xanh lơ, tâm trong
       suốt nhìn xuyên nền, vệt sáng kính góc trên-trái, vành cổ trắng viền xanh).
     - Bên trong là tóc đen gọn gàng để lộ hoàn toàn khuôn mặt & biểu cảm người chơi.
     - Bộ đồ phi hành gia trung tính màu trắng viền xanh dương, lõi sao tinh hà trước
       ngực, balo phản lực nhỏ sau lưng, găng tay trắng viền xanh và ủng không gian.
   • Hỗ trợ đủ 4 hướng, đi bộ, ngồi, cưỡi thú / xe đạp, giơ tay, cánh & phụ kiện cầm tay.
   • Nạp CUỐI danh sách <script> trong games/tinyland/index.html (sau gaubong.js).
   =================================================================================== */
(function(){
if(typeof SETS==='undefined')return;

const TH_GIA=3500;

// ---------- 1) Khai báo dữ liệu vào CUỐI mảng SETS (chỉ thêm 1 lần) ----------
if(!SETS.some(s=>s.k=='tinhha')){
 SETS.push({n:'Tinh Hà Vũ Trụ',k:'tinhha',mascot:'tinhha',wide:1,xu:TH_GIA,
  ds:'Mascot phi hành gia Tinh Hà trung tính (nam nữ đều mặc được): bộ đồ trắng viền xanh dương, mũ cầu không gian trong suốt kèm tóc đen bên trong. Không che biểu cảm.',
  sh:'#d8e9ff',pt:'#d4e6ff',rpt:'#d4e6ff',shoe:'#2478f0',scarf:'#4ec3ff'});
}

// ---------- 2) Bảng màu pixel ----------
const WH='#f4f8ff',WL='#ffffff',WD='#c2d8f2',WO='#8aa8d6',        // trắng không gian
      BL='#2478f0',BC='#4ec3ff',BD='#1449a8',BI='#a8ecff',        // viền xanh dương / xanh lơ
      NV='#1b2c5c',                                               // đệm khớp / nền balo xanh đêm
      SK='#f1c08a',SKD='#d99e6a',SKL='#fad4b2',                   // da mặt chuẩn game
      HC='#181d2c',HM='#262f4a',HL='#3c4b73',HD='#0c0f18';        // tóc đen có khối & ánh sáng

// ---------- 3) Bảng điểm ảnh quả cầu kính (dựng 1 lần) ----------
// Tâm (10, 8.0), bán kính ngoài ~8.8, cắt trên vòng cổ y <= 14
const DOME=[];
for(let y=-1;y<=14;y++){
 for(let x=1;x<=18;x++){
  const dx=x+.5-10,dy=y+.5-8.0,d=Math.hypot(dx,dy);
  if(d>8.85)continue;
  let c;
  if(d>=7.8)c=(dx<=0&&dy<=0)?BI:(dx>1.5&&dy>1)?BL:BC;            // viền kính pixel ngoài
  else if(d>=6.6)c='rgba(88,198,255,.28)';                       // ánh kính cong gần mép
  else c='rgba(200,242,255,.07)';                                 // tâm rất trong
  DOME.push([x,y,c]);
 }
}
const GLINT=[[4,2,'rgba(255,255,255,.88)'],[5,1,'rgba(255,255,255,.88)'],[6,1,'rgba(255,255,255,.78)'],[4,3,'rgba(255,255,255,.65)'],[7,1,'rgba(215,248,255,.55)'],[15,11,'rgba(168,236,255,.45)']];

// ---------- 4) Hàm vẽ Mascot pixel ----------
function drawTinhHa(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sx=side?lg*(Rt?2:-2):0;

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ----- Chân (ẩn khi cưỡi thú để dùng chân thú cưỡi khớp S.rpt / S.shoe) -----
 const leg=(x,lift)=>{
  const h=3-lift;
  u(WH,x,24,4,h);u(WL,x,24,1,h);u(WD,x+3,24,1,h);
  if(!lift)u(NV,x+1,25,2,1);                                     // đệm gối xanh đêm
  u(BC,x,27-lift,4,1);u(BL,x,28-lift,4,1);u(BD,x,29-lift,4,1);    // ủng xanh
  u(BI,x,27-lift,1,1);
  if(side){const tx=Rt?x+4:x-1;u(BL,tx,28-lift,1,2);u(BD,tx,29-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ----- Tay -----
 const arm=(x,ay)=>{
  u(BL,x,15+ay,3,2);u(BC,x,15+ay,1,1);                            // đệm vai xanh
  u(WH,x,17+ay,3,3);u(WL,x,17+ay,1,3);u(WD,x+2,17+ay,1,3);        // ống tay trắng
  u(BC,x,20+ay,3,1);                                              // cổ tay xanh
  u(WH,x,21+ay,3,2);u(WD,x+2,21+ay,1,2);u(WD,x,22+ay,3,1);        // găng trắng
 };
 const armUp=(x,h)=>{
  const ty=17-h;
  u(WH,x,ty,3,2);u(WD,x+2,ty,1,2);u(BC,x,ty+2,3,1);
  u(WH,x,ty+3,3,3);u(BL,x,ty+6,3,1);
 };
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0]):arm(2,lg);armUp(15,o.aup[1])}else{arm(2,lg);arm(15,-lg)}};

 // ----- Thân áo -----
 if(!side){
  u(WH,5,15,10,9);u(WL,5,15,2,8);u(WD,13,15,2,9);                 // áo trắng
  u(BL,5,15,2,2);u(BL,13,15,2,2);                                 // cầu vai xanh
  u(BL,5,17,1,5);u(BL,14,17,1,5);                                 // viền sườn xanh
  u(BL,5,22,10,1);u(BC,5,22,2,1);u(BD,13,22,2,1);                 // thắt lưng xanh
  if(!rd){u(WH,6,23,8,1);u(WD,12,23,2,1)}                         // nối hông khi đứng/đi
  if(back){
   // balo phản lực sau lưng
   u(WD,6,15,8,7);u(WH,7,15,6,6);u(NV,7,16,6,4);
   u(BL,8,17,1,2);u(BC,8,16,1,1);u(BL,11,17,1,2);u(BC,11,16,1,1);
  }else{
   // viền cổ chữ V + lõi sao tinh hà trước ngực + khóa đai
   u(BL,7,15,1,2);u(BL,12,15,1,2);u(BC,8,16,1,2);u(BC,11,16,1,2);u(BL,9,17,2,1);
   u(NV,9,18,2,2);u(BC,9,18,1,1);u(BI,10,18,1,1);
   u(WL,9,22,2,1);u(BC,9,22,1,1);
  }
  arms();
 }else{
  // nhìn ngang (vẽ hướng PHẢI, M tự lật khi quay TRÁI)
  M(WD,5,16,2,6);M(WH,5,16,1,5);M(BC,6,17,1,3);                    // balo phản lực gọn sau lưng
  M(WH,7,15,7,8);M(WL,12,15,2,7);M(WD,7,15,2,8);                  // thân áo trắng (gọn đến y=23)
  M(BL,9,15,5,1);M(BC,11,16,3,1);                                 // viền vai & cổ xanh
  M(BL,7,22,7,1);M(BC,12,22,2,1);M(BI,13,22,1,1);                 // thắt lưng xanh
  if(!rd)M(WH,7,23,7,1);                                          // khi đứng/đi nối xuống chân; khi cưỡi mở hông cho M.legs
  const ax=9-sx;
  if(!o.noarm){
   u(BL,ax,15,3,2);u(WH,ax,17,3,3);u(WD,ax+2,17,1,3);u(BC,ax,20,3,1);u(WH,ax,21,3,2);
  }
 }
 u(SK,9,14,2,1);

 // ----- Đầu + Tóc đen bồng bềnh bên trong mũ cầu -----
 if(back){
  fillRows(HC,MSTD.HF);
  u(HC,9,3,2,1);u(HL,9,3,1,1);
  u(HC,6,4,8,1);u(HC,4,5,12,8);u(HC,5,13,10,1);
  u(HD,6,14,2,1);u(HD,9,14,2,1);u(HD,12,14,2,1);
  u(HM,6,5,8,2);u(HL,7,5,3,1);u(HL,11,6,2,1);
  u(HM,7,9,1,3);u(HM,12,9,1,3);u(HD,4,8,1,5);u(HD,15,8,1,5);
 }else if(!side){
  fillRows(SK,MSTD.HF);u(SKD,14,9,2,4);u(SKD,6,13,8,1);u(SKL,7,9,2,1);
  // tóc đen đỉnh tròn bồng (lên tới y=3..4), mái tỉa lọn dừng trên y=9
  u(HC,9,3,2,1);u(HL,9,3,1,1);
  u(HC,6,4,8,1);u(HC,5,5,10,2);u(HC,4,6,12,2);
  u(HM,6,5,8,1);u(HL,7,5,3,1);u(HL,12,5,2,1);
  u(HC,4,8,3,1);u(HC,7,8,2,1);u(HC,10,8,3,1);u(HC,13,8,3,1);
  u(HC,4,9,2,1);u(HC,7,9,1,1);u(HC,11,9,1,1);u(HC,14,9,2,1);
  u(HC,4,10,1,3);u(HC,15,10,1,3);u(HC,5,10,1,1);u(HC,14,10,1,1);
  u(HM,4,10,1,1);u(HM,15,10,1,1);u(HD,4,13,1,1);u(HD,15,13,1,1);
 }else{
  fillRows(SK,MSTD.HS,1);M(SKD,13,9,2,4);M(SKD,6,13,8,1);
  // tóc đen đỉnh tròn + chỏm nhẹ (y=3..4), gáy bo mềm & mái tỉa lọn (không che mắt)
  M(HC,8,3,2,1);M(HL,8,3,1,1);
  M(HC,6,4,7,1);M(HC,4,5,10,2);M(HC,3,7,11,1);
  M(HM,5,5,7,1);M(HL,7,5,3,1);M(HL,11,5,1,1);
  M(HC,3,8,5,4);M(HC,4,12,4,2);M(HD,5,13,2,1);M(HD,3,10,1,2);
  M(HM,4,8,1,3);M(HL,5,8,1,2);
  M(HC,9,8,5,1);M(HC,10,9,1,1);M(HC,12,9,2,1);                     // mái tỉa 2 lọn gọn trên trán
  M(HC,7,9,2,3);M(HC,8,12,1,2);M(HM,8,10,1,1);                     // tóc mai cạnh tai
 }

 // ----- Khuôn mặt / Biểu cảm người chơi (giữ nguyên bên trong mũ) -----
 if(!back){
  if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,side?1:0,side?Rt:0);
  else if(typeof faceDef==='function')faceDef(u,side?1:0,side?Rt:0);
 }

 // ----- Quả cầu kính không gian trong suốt dạng PIXEL bọc quanh đầu -----
 DOME.forEach(([x,y,c])=>u(c,x,y,1,1));
 GLINT.forEach(([x,y,c])=>u(c,x,y,1,1));
 // Vòng cổ khóa kính trắng viền xanh ở y=14..15
 if(!side){
  u(WL,5,14,10,1);u(BL,6,15,8,1);u(BC,9,14,2,1);
 }else{
  M(WL,6,14,8,1);M(BL,7,15,6,1);M(BC,11,14,2,1);
 }

 // ----- Bụi sao tinh hà lấp lánh (pixel 1x1) -----
 const SP=[[1,3,0],[18,5,1.6],[2,19,3.1],[17,17,4.4]];
 for(let i=0;i<SP.length;i++){
  const ph=(Math.sin(t*3.2+SP[i][2])+1)*.5;
  if(ph>.45){
   const a=((ph-.45)/.55*.9).toFixed(2),px=SP[i][0],py=SP[i][1]-(ph>.78?1:0);
   r('rgba(168,236,255,'+a+')',px,py,1,1);
   if(ph>.72){const c2='rgba(120,210,255,'+(a*.6).toFixed(2)+')';r(c2,px-1,py,1,1);r(c2,px+1,py,1,1);r(c2,px,py-1,1,1);r(c2,px,py+1,1,1)}
  }
 }
}

window.drawMascotTinhHa=drawTinhHa;
if(typeof MASCOT_DRAW!=='undefined')MASCOT_DRAW.tinhha=drawTinhHa;
})();
