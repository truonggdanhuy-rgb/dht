/* ===================================================================================
   GIRLKHO.JS — 👓🎀 MASCOT GIRL KHỜ (bán ở TIỆM CHÚ HỀ: circus.js → CL_ITEMS)
   • Giá: 2.000 Xu + 400 Xu quái vật + 5 Kim cương (ach:1 nên chỉ bán ở Tiệm Chú Hề).
   • Mascot mặc cả cơ thể, CHE BIỂU CẢM (kính gọng đỏ to hơn mặt cố định + mắt xanh to lấp lánh).
   • Phá bỏ giới hạn 20px (wide:1): đầu & tóc xù rộng ~26–30px (x=-5..25, y=-5..29),
     búi bông trắng bên trái đỉnh đầu, kẹp sọc đỏ trắng bên phải mái,
     2 chùm tóc tết dày dài hai bên thắt nơ đỏ chấm trắng, đồng phục thủy thủ cổ tối viền đỏ,
     váy xếp ly, tất trắng & giày đen (ẩn chân gọn khi cưỡi thú).
   =================================================================================== */
(function(){
'use strict';
if(typeof SETS==='undefined'||typeof MASCOT_DRAW==='undefined')return;

// ---------- 1) Đăng ký set vào CUỐI mảng SETS (chỉ thêm 1 lần) ----------
if(!SETS.some(s=>s.k=='girlkho')){
 SETS.push({
  n:'Girl Khờ',
  k:'girlkho',
  mascot:'girlkho',
  wide:1,
  ach:1,
  ds:'Mascot Girl Khờ: tóc đen xù to kèm búi bông trắng & kẹp đỏ trắng, 2 bím tóc dài thắt nơ đỏ hai bên, kính gọng đỏ to hơn mặt (che biểu cảm) & đồng phục thủy thủ.',
  sh:'#f4f6fb',
  pt:'#262734',
  rpt:'#f4f6fb',
  shoe:'#22232e',
  scarf:'#c92832'
 });
}

// ---------- 2) Bảng màu ----------
const HO='#171820',HB='#292a36',HL='#3d3f50',HS='#54576d',HD='#121319',      // tóc đen than: viền / chính / sáng / điểm sáng / bóng
      PF='#e6e9f2',PFL='#ffffff',PFD='#b8bfd0',PFO='#949cb0',                 // búi bông trắng xám đỉnh trái
      CL='#f6f7fc',CR='#c9222c',CRD='#8e1119',                                // kẹp tóc & ruy băng đỏ
      SK='#ffe2cf',SKL='#fff0e4',SKS='#e4b296',SKD='#c4886b',                 // da mặt & bóng da
      BL='#f69ca0',                                                           // má hồng nhẹ
      GF='#cf2029',GFL='#ff6060',GFD='#8b0d14',GL='rgba(210,235,255,.22)',     // gọng kính đỏ to hơn mặt + tròng kính mờ nhẹ
      EB='#1c3478',EM='#3c7ae0',EL='#6fb5ff',EW='#ffffff',                    // mắt xanh to tròn lấp lánh
      SH='#f5f7fc',SHD='#cfd5e4',COL='#292b38',COLD='#191a24',                // áo thủy thủ trắng & cổ tối
      SKT='#252734',SKTL='#3a3d50',SKTD='#161720',                            // váy xếp ly
      SC='#f7f8fc',SCD='#cfd4e2',SHO='#22232e',SHOL='#3c3f50';                // tất trắng & giày

function drawGirlKho(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const sx=side?lg*(Rt?2:-2):0;
 const blink=(t%4.1)>3.97&&!o.e;
 const sway=o.mv?lg:Math.round(Math.sin(t*2.4)*.4);

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,9,2);

 // ---------- 1) CHÂN, TẤT TRẮNG & GIÀY (ẩn khi cưỡi thú) ----------
 const leg=(x,lift)=>{
  const h=2-lift;
  if(h>0){r(SK,x,26,3,1);r(SKS,x+2,26,1,1)}
  r(SC,x,27-lift,3,1);r(SCD,x+2,27-lift,1,1);
  r(SHO,x,28-lift,3,2);r(SHOL,x,28-lift,1,1);
  if(side){const tx=Rt?x+3:x-1;r(SHO,tx,29-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(6,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(6,1)}else if(lg<0){leg(6,0);leg(11,1)}else{leg(6,0);leg(11,0)}}
 else{const a=8+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- 2) THÂN ĐỒNG PHỤC THỦY THỦ + VÁY XẾP LY + TAY ----------
 const arm=(x,ay,flip)=>{
  u(HO,x,16+ay,3,4);
  u(SH,x,16+ay,3,3);u(SHD,x+(flip?2:0),16+ay,1,3);
  u(COL,x,18+ay,3,1);
  u(SK,x,19+ay,3,2);u(SKS,x+(flip?2:0),19+ay,1,2);
 };
 const armUp=(x,h)=>{
  const ty=16-h;
  u(SK,x,ty,3,2);u(COL,x,ty+2,3,1);u(SH,x,ty+3,3,3);
 };

 if(!side){
  // Váy xếp ly (y=23..26)
  u(HO,4,23,12,3);
  u(SKT,5,23,10,3);
  u(SKTL,6,23,1,3);u(SKTL,9,23,2,3);u(SKTL,13,23,1,3);
  u(SKTD,5,25,10,1);u(SKTD,8,23,1,3);u(SKTD,11,23,1,3);

  // Thân áo thủy thủ trắng (y=16..23)
  u(HO,5,16,10,7);
  u(SH,6,16,8,7);u(SHD,6,21,8,2);u(SHD,13,16,1,7);
  // Cổ thủy thủ tối viền đỏ
  if(back){
   u(COL,5,15,10,4);u(COLD,5,18,10,1);
   u(CR,6,18,8,.5);u(SH,6,18.5,8,.5);
  }else{
   u(SK,9,15,2,1);
   u(COL,6,15,8,2);u(COL,7,17,6,1);u(COL,8,18,4,1);
   u(SH,9,16,2,1);
   u(CR,6,16,1,1);u(CR,13,16,1,1);u(CR,7,17,6,1);
   // Nơ đỏ trước ngực
   u(CRD,8,18,4,1);u(CR,9,18,2,2);u(CR,8,20,1.5,2);u(CR,10.5,20,1.5,2);u(CRD,9,19,2,1);
  }
  // Tay
  if(o.aup){o.aup[0]!=null?armUp(3,o.aup[0]):arm(3,lg,0);armUp(14,o.aup[1])}
  else{arm(3,lg,0);arm(14,-lg,1)}
 }else{
  // Nhìn ngang: váy + áo + cổ + tay
  M(HO,6,23,8,3);M(SKT,7,23,6,3);M(SKTL,9,23,2,3);M(SKTD,7,25,6,1);
  M(HO,7,16,7,7);M(SH,8,16,5,7);M(SHD,8,21,5,2);
  M(COL,7,15,6,3);M(CR,8,17,5,1);M(CR,12,18,2,3);
  const ax=9-sx;
  if(!o.noarm){u(SH,ax,16,3,3);u(COL,ax,18,3,1);u(SK,ax,19,3,2);u(SKS,ax+2,19,1,2)}
 }

 // ---------- 3) HAI BÍM TÓC DÀY DÀI + NƠ ĐỎ (vẽ phía sau tai, buông xuống y=24) ----------
 const pigtailF=(left,sw)=>{
  const x0=left?-4+sw:19+sw;
  // Bím tóc tròn dần xuống dưới
  u(HO,x0,12,5,9);u(HO,x0+1,21,3,3);
  u(HB,x0+1,13,3,8);u(HB,x0+1.5,21,2,2);
  // Nếp tết
  u(HL,x0+1,15,1,2);u(HL,x0+2,18,1,2);u(HD,x0+3,14,1,2);u(HD,x0+1,17,1,2);
  // Dây buộc đỏ gần ngọn
  u(CR,x0+1,21,3,1);u(CRD,x0+2,21,1,1);
  // Nơ đỏ to chấm trắng ở gốc bím
  const bx=left?x0:x0-1;
  u(CRD,bx,10,6,3);
  u(CR,bx+.5,10,2,2.5);u(CR,bx+3.5,10,2,2.5);u(CR,bx+2,11,2,1.5);
  u(EW,bx+1,11,1,1);u(EW,bx+4,11,1,1);
  u(CR,bx+1,13,1.5,2);u(CR,bx+3.5,13,1.5,2);
 };
 if(!side){
  pigtailF(1,sway);
  pigtailF(0,-sway);
 }else{
  const px=3+Math.round(sway*.6);
  M(HO,px,12,5,9);M(HO,px+1,21,3,3);
  M(HB,px+1,13,3,8);M(HB,px+1.5,21,2,2);
  M(HL,px+1,15,1,2);M(HL,px+2,18,1,2);
  M(CR,px+1,21,3,1);
  // Nơ đỏ bên hông
  M(CRD,px-.5,10,6,3);M(CR,px,10,2,2.5);M(CR,px+3,10,2,2.5);M(EW,px+.5,11,1,1);M(EW,px+3.5,11,1,1);
  M(CR,px+1,13,1.5,2);M(CR,px+3,13,1.5,2);
 }

 // ---------- 4) ĐẦU & TÓC XÙ TO RỘNG (x=-2..22, y=-5..15) ----------
 if(!side){
  // Khối tóc lớn phía sau & đỉnh đầu (24px rộng)
  const HAIR=[
   [-4,5,15],[-3,3,17],[-2,1,19],[-1,0,20],[0,-1,21],
   [1,-1,21],[2,-2,22],[3,-2,22],[4,-2,22],[5,-2,22],
   [6,-2,22],[7,-2,22],[8,-2,22],[9,-2,22],[10,-2,22],
   [11,-1,21],[12,0,20],[13,2,18]
  ];
  HAIR.forEach(([y,x0,x1])=>u(HO,x0,y,x1-x0,1));
  // Lõi tóc đen than bên trong viền
  u(HB,4,-3,12,1);u(HB,2,-2,16,1);u(HB,1,-1,18,1);u(HB,0,0,20,1);
  u(HB,-1,1,22,10);u(HB,0,11,20,1);u(HB,1,12,18,1);
  // Ánh sáng tóc cong mềm & đốm bóng
  u(HL,6,-2,8,1);u(HL,3,-1,14,1);u(HL,2,0,16,2);
  u(HS,5,0,2,1);u(HS,13,0,2,1);u(HS,1,4,1,3);u(HS,18,4,1,3);
  // Cọng tóc vểnh nhẹ trên đỉnh (y=-5)
  u(HO,6,-5,6,1);u(HO,12,-4,2,1);u(HL,7,-5,4,.5);

  if(back){
   // Nhìn sau: tóc xõa ôm gáy + nếp tóc
   u(HD,3,12,14,2);u(HL,6,4,8,1);u(HS,4,7,1,1);u(HS,14,8,1,1);
  }else{
   // Tai nhỏ hai bên mặt
   SY(SKS,1,8,1.5,2.5);SY(SK,1.5,8.5,1,1.5);
   // Da mặt tròn bầu bĩnh (x=3..17, y=4..14) — hẹp hơn kính để kính to hơn mặt!
   u(SK,8,4,4,1);u(SK,6,5,8,2);u(SK,3,7,14,5);u(SK,4,12,12,2);u(SK,6,14,8,1);
   u(SKS,4,13,12,1);u(SKD,6,14,8,1);u(SKL,9,11,2,2);
   // Má hồng & miệng nhỏ ngây thơ
   SY(BL,3.5,12,2,1);
   u('#d4847a',9.2,13.2,1.6,.7);

   // Mái tóc rẽ tự nhiên ôm trán
   u(HB,1,3,18,2);u(HB,1,5,7,1);u(HB,12,5,7,1);
   u(HO,2,5,5,1);u(HO,13,5,5,1);u(HO,1,6,3,2);u(HO,16,6,3,2);
   u(HB,9,4,2,1);u(HB,9.5,5,1,2);   // lọn mái nhỏ giữa 2 mắt

   // ---------- KÍNH GỌNG ĐỎ TO HƠN MẶT + MẮT XANH LẤP LÁNH (che biểu cảm cố định) ----------
   // Hai mắt xanh to tròn đặt cân đối trong 2 tròng kính
   const drawEye=(ex)=>{
    u(EW,ex-.5,7.5,4.5,4.5);                                // nền lòng trắng
    u(EB,ex,7.5,3.5,2);                                     // mí & tròng trên xanh đậm
    u(EM,ex,9,3.5,2);                                       // xanh biển vừa
    u(EL,ex+.5,10.5,2.5,1);                                 // ánh xanh sáng đáy mắt
    u(EW,ex+.5,8,1.2,1.2);                                  // đốm sáng mắt
    u(EW,ex+2.2,10.2,.8,.8);                                // đốm nhỏ thứ 2
    if(blink){
     u(SK,ex-.5,7.5,4.5,3);u(HB,ex-.5,10,4.5,1);            // nhắm mắt nhẹ
    }
   };
   drawEye(3.5);
   drawEye(13);

   // Tròng kính hơi bóng nhẹ
   u(GL,2,7,7,5);u(GL,11,7,7,5);

   // Gọng kính đỏ RỘNG HƠN MẶT (x=0.5..19.5, che ngoài viền má x=3..17!)
   // Trái (x=0.5..9, y=6..13)
   u(GF,1.5,6,7,1);u(GFD,1,7,1,5);u(GF,8,7,1,5);u(GF,1.5,12,7,1);
   u(CR,1,6.5,1,1);u(CR,8,6.5,1,1);u(GFL,2,6,3,.6);
   u(GF,0.5,8,1,1);                                         // càng kính nhô ra ngoài mặt trái!
   // Cầu kính nối giữa
   u(CR,9,7.5,2,1);u(GFD,9,8.5,2,.5);
   // Phải (x=11..19.5, y=6..13)
   u(GF,11.5,6,7,1);u(GF,11,7,1,5);u(GFD,18,7,1,5);u(GF,11.5,12,7,1);
   u(CR,11,6.5,1,1);u(CR,18,6.5,1,1);u(GFL,12,6,3,.6);
   u(GF,18.5,8,1,1);                                        // càng kính nhô ra ngoài mặt phải!
  }

  // ---------- 5) PHỤ KIỆN TÓC: BÚI BÔNG TRẮNG TRÁI + KẸP ĐỎ TRẮNG PHẢI ----------
  // Búi bông trắng xám ở góc trên bên trái (nhìn trước ở x=-3..4, nhìn sau lật đối xứng x=16..23)
  const pxB=back?17:-3;
  u(PFO,pxB+1,-5,5,1);u(PFO,pxB,-4,7,4);u(PFO,pxB+1,0,5,1);u(PFO,pxB+2,1,3,1);
  u(PF,pxB+1,-4,5,4);u(PF,pxB+2,-3,4,4);
  u(PFL,pxB+2,-4,3,3);u(PFD,pxB+1,-1,2,2);u(PFD,pxB+4,-1,2,1);
  // Kẹp tóc sọc đỏ trắng ở mái phải (nhìn trước)
  if(!back){
   u(CR,13,1,6,2.5);u(EW,14,1.3,4.5,1.8);
   u(CR,14.8,1.3,.7,1.8);u(CR,16.2,1.3,.7,1.8);
   u(EW,17.2,1.2,1.6,2);
  }
 }else{
  // ---------- NHÌN NGANG (quay mặt phải, M tự lật khi quay trái) ----------
  M(HO,3,-4,13,1);M(HO,1,-3,16,3);M(HO,0,0,18,12);M(HO,1,12,16,2);
  M(HB,4,-3,11,1);M(HB,2,-2,14,2);M(HB,1,0,16,12);
  M(HL,4,-2,8,2);M(HS,3,3,1,3);M(HO,5,-5,5,1);

  // Da mặt ngang & tai
  M(SK,10,5,7,9);M(SKS,10,13,6,1);M(BL,12,12,2,1);
  M(HB,9,4,8,2);M(HB,14,5,3,2);M(HB,9,6,2,5);
  // Mắt xanh & kính đỏ nhô ra trước mặt
  if(!blink){
   M(EW,13,7.5,3.5,4.5);M(EB,13.5,7.5,3,2);M(EM,13.5,9,3,2);M(EL,14,10.5,2,1);M(EW,14,8,1,1);
  }else{
   M(SK,13,7.5,3.5,3);M(HB,13,10,3.5,1);
  }
  M(GL,12.5,7,5.5,5);
  M(GF,12,6,6,1);M(GF,12,7,1,5);M(GFD,17.5,7,1,5);M(GF,12,12,6,1);
  M(GFL,13,6,2,.6);
  M(GF,8,8,4,1);                                            // càng kính vắt qua tai

  // Búi bông trắng phía trên đỉnh
  M(PFO,1,-5,6,5);M(PF,2,-4,4,4);M(PFL,2,-4,2,2);M(PFD,4,-2,2,2);
  // Kẹp đỏ trắng trên mái
  M(CR,12,1,5,2);M(EW,13,1.3,3.5,1.4);M(CR,14.2,1.3,.7,1.4);
 }
}

MASCOT_DRAW.girlkho=drawGirlKho;
})();
