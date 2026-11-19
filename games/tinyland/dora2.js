/* ===================================================================================
   DORA2.JS — 🤖 MASCOT DORAEMON vẽ pixel lại (16-bit chuẩn 20×31 Tinyland)
   • Ghi đè MASCOT_DRAW.dora của index.html (nạp CUỐI danh sách <script>).
   • Khắc phục bản cũ bị thô/vuông/lệch tâm:
     - Đầu tròn mũm mĩm cân đối tâm x=10, có trán xanh & viền khối rõ ràng.
     - Đôi mắt bầu dục cạnh nhau chuẩn Doraemon (chớp mắt tự nhiên), mũi đỏ tròn,
       miệng cười gọn & 3 cặp ria mép chếch tự nhiên trên má trắng.
     - Thân tròn xanh, vòng cổ đỏ + chuông vàng cân tâm, bụng trắng + túi thần kỳ 4D,
       tay tròn trắng, chân ngắn bàn chân tròn dẹt & đuôi cầu đỏ.
   • Tuân thủ 100% khung chuẩn MSTD 20×31 (mascotCheck() hợp lệ cả đứng/đi/ngồi/cưỡi).
   =================================================================================== */
(function(){
'use strict';
if(typeof MASCOT_DRAW==='undefined')return;

// ---------- Bảng màu pixel Doraemon ----------
const BL='#1b94e6',BLL='#64c8ff',BLD='#106ab8',                    // xanh dương: chính / sáng / bóng
      WH='#ffffff',WD='#d6e5f5',                                   // trắng & bóng trắng
      RD='#e8272b',RDL='#ff7a7d',RDD='#a8161a',                    // đỏ: mũi, vòng cổ, đuôi
      YL='#ffd43b',YLL='#fff4a8',YLD='#c7860a',                    // chuông vàng
      BK='#15202e';                                                // nét mực mắt, miệng, ria, túi

function drawDora2(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sx=side?lg*(Rt?2:-2):0;
 const blink=(t%3.8)>3.67&&!o.e;

 // Bóng dưới chân
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- 1) CHÂN & BÀN CHÂN TRÒN TRẮNG (ẩn khi cưỡi để khớp M.legs) ----------
 const leg=(x,lift)=>{
  const h=3-lift;
  r(BL,x,24,4,h);r(BLL,x,24,1,h);r(BLD,x+3,24,1,h);
  r(WH,x,27-lift,4,2);r(S.shoe||WD,x,29-lift,4,1);
  if(side){const tx=Rt?x+4:x-1;r(WH,tx,28-lift,1,1);r(S.shoe||WD,tx,29-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(12,0)}
 else if(!side){if(lg>0){leg(12,0);leg(5,1)}else if(lg<0){leg(5,0);leg(12,1)}else{leg(5,0);leg(12,0)}}
 else{const a=8+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- 2) THÂN + TÚI THẦN KỲ + VÒNG CỔ + CHUÔNG + TAY ----------
 const arm=(x,ay)=>{
  u(BL,x,16+ay,3,3);u(BLL,x,16+ay,1,3);u(BLD,x+2,16+ay,1,3);
  u(WH,x,19+ay,3,2);u(WD,x,21+ay,3,1);
 };
 const armUp=(x,h)=>{
  const ty=17-h;
  u(WH,x,ty,3,2);u(WD,x,ty+2,3,1);
  u(BL,x,ty+3,3,3);u(BLL,x,ty+3,1,3);u(BLD,x+2,ty+3,1,3);
 };

 if(!side){
  // Thân tròn cân tâm x=10 (x=4..16, w=13)
  fill(BL,[[15,5,16],[16,4,17,6],[22,5,16,2]]);
  if(!rd)u(BL,6,24,9,1);
  u(BLL,5,16,1,6);u(BLD,15,16,2,6);u(BLD,6,23,9,1);

  if(back){
   // Đuôi cầu đỏ cân tâm x=9..11
   u(RD,9,20,3,2);u(RDL,9,20,1,1);u(RDD,11,21,1,1);u(RDD,10,22,1,1);
  }else{
   // Bụng trắng bầu dục (x=6..14)
   fill(WH,[[16,7,14],[17,6,15,4],[21,7,14],[22,8,13]]);
   // Túi thần kỳ 4D nửa vòng tròn
   u(BK,7,19,7,1);
   u(BK,7,20,1,1);u(WD,8,20,5,1);u(BK,13,20,1,1);
   u(BK,8,21,1,1);u(WD,9,21,3,1);u(BK,12,21,1,1);
   u(BK,9,22,3,1);
  }

  // Vòng cổ đỏ + chuông vàng (tâm x=9..11)
  u(RD,6,14,9,1);u(RD,5,15,11,1);u(RDL,6,15,2,1);u(RDD,14,15,2,1);
  if(!back){
   u(YL,9,15,3,2);u(YLL,9,15,1,1);u(YLD,9,17,3,1);u(BK,10,17,1,1);
  }

  // Tay tròn trắng
  if(o.aup){o.aup[0]!=null?armUp(1,o.aup[0]):arm(1,lg);armUp(16,o.aup[1])}
  else{arm(1,lg);arm(16,-lg)}

  // ---------- 3) ĐẦU TRÒN MŨM MĨM (trước / sau) ----------
  fill(BL,[[1,7,14],[2,5,16],[3,4,17],[4,3,18,6],[10,4,17,2],[12,5,16],[13,6,15]]);
  u(BLL,8,1,4,1);u(BLL,6,2,4,1);u(BLL,4,4,1,4);
  u(BLD,16,4,2,5);u(BLD,15,11,1,1);

  if(!back){
   // Vòm mặt trắng cong mềm dưới mắt & ôm lên 2 má
   fill(WH,[[5,5,16],[6,4,17,5],[11,5,16],[12,6,15],[13,7,14]]);
   u(WD,4,10,1,1);u(WD,16,10,1,1);u(WD,7,13,7,1);

   // Đôi mắt bầu dục cạnh nhau, trán xanh rõ ở y=1..2
   u(BK,7,3,3,1);u(BK,11,3,3,1);
   u(BK,6,4,1,3);u(BK,10,4,1,3);u(BK,14,4,1,3);
   u(WH,7,4,3,3);u(WH,11,4,3,3);
   if(blink){
    u(BK,7,5,3,1);u(BK,11,5,3,1);
   }else{
    u(BK,8,4,1,2);u(BK,12,4,1,2);
   }
   u(BK,7,7,2,1);u(BK,12,7,2,1);

   // Mũi đỏ tròn cân tâm (x=9..11, y=7..8)
   u(RD,9,7,3,2);u(RDL,9,7,1,1);u(RDD,11,8,1,1);

   // Đường nhân trung + miệng cười gọn
   u(BK,10,9,1,2);
   u(BK,7,10,1,1);u(BK,13,10,1,1);
   u(BK,8,11,5,1);

   // 3 cặp ria mép trên má trắng (trái x=2..5, phải x=15..18)
   u(BK,2,7,2,1);u(BK,4,8,2,1);   u(BK,17,7,2,1);u(BK,15,8,2,1);
   u(BK,2,9,4,1);                  u(BK,15,9,4,1);
   u(BK,4,10,2,1);u(BK,2,11,2,1); u(BK,15,10,2,1);u(BK,17,11,2,1);
  }
 }else{
  // ---------- NHÌN NGANG (vẽ hướng PHẢI, M tự lật khi quay TRÁI) ----------
  // Đuôi cầu đỏ sau lưng
  M(RD,3,20,3,2);M(RDL,3,20,1,1);M(RDD,3,22,2,1);

  // Thân tròn nhìn ngang
  fill(BL,[[15,6,15],[16,5,16,6],[22,6,15,2]],1);
  if(!rd)M(BL,7,24,7,1);
  M(BLL,5,16,1,5);M(BLD,14,16,2,6);M(BLD,7,23,7,1);

  // Bụng trắng + túi 4D phía trước
  fill(WH,[[16,12,15],[17,11,16,4],[21,12,15]],1);
  M(WD,11,22,3,1);
  M(BK,13,19,3,1);M(BK,13,20,1,1);M(WD,14,20,2,1);M(BK,14,21,2,1);

  // Vòng cổ đỏ + chuông vàng
  M(RD,6,14,8,1);M(RD,5,15,10,1);M(RDL,7,15,2,1);
  M(YL,14,15,3,2);M(YLL,14,15,1,1);M(YLD,14,17,3,1);M(BK,16,16,1,1);

  // Đầu tròn nhìn ngang
  fill(BL,[[1,7,13],[2,5,15],[3,4,16],[4,3,16,6],[10,4,16,2],[12,5,15],[13,7,13]],1);
  M(BLL,7,1,4,1);M(BLL,5,2,4,1);M(BLL,3,4,1,4);M(BLD,5,12,3,1);

  // Mặt trắng nhìn ngang
  fill(WH,[[5,11,15],[6,10,16,6],[12,11,15],[13,12,14]],1);
  M(WD,11,13,3,1);

  // Mắt bầu dục nhìn ngang
  M(BK,12,3,3,1);M(BK,11,4,1,2);M(WH,12,4,3,2);M(BK,15,4,1,2);
  if(blink)M(BK,12,5,3,1);
  else M(BK,13,4,1,2);
  M(BK,12,6,3,1);

  // Mũi đỏ tròn gọn ở đầu mũi
  M(RD,15,7,3,2);M(RDL,15,7,1,1);M(RDD,17,8,1,1);

  // Miệng & 3 ria mép bên má
  M(BK,15,9,1,2);M(BK,12,10,1,1);M(BK,13,11,3,1);
  M(BK,8,7,2,1);M(BK,10,8,2,1);
  M(BK,8,9,4,1);
  M(BK,10,10,2,1);M(BK,8,11,2,1);

  // Tay tròn trắng bên hông
  const am=Math.round(lg);
  if(!o.noarm){
   M(BL,9+am,16,3,3);M(BLL,9+am,16,1,3);M(BLD,11+am,16,1,3);
   M(WH,9+am,19,3,2);M(WD,9+am,21,3,1);
  }
 }
}

MASCOT_DRAW.dora=drawDora2;
window.drawMascotDora2=drawDora2;
})();
