/* ===================================================================================
   VOTHUONG.JS — ⚫⚪ MASCOT HẮC VÔ THƯỜNG / BẠCH VÔ THƯỜNG (2 set, CHỈ KHÁC MÀU)
   • Bán ở TIỆM CHÚ HỀ (circus.js → CL_ITEMS): mỗi set cần ĐỦ 5000 Xu + 1000 Xu quái vật + 5 Kim cương.
   • File này nạp SAU vitvang.js, tự đẩy 2 set vào CUỐI mảng SETS (không làm lệch số thứ tự đồ đã mua).
       {k:'hacvt',  mascot:'vothuong', vt:'h'}  — Hắc Vô Thường: áo choàng ĐEN, mũ cao đen, chữ trắng
       {k:'bachvt', mascot:'vothuong', vt:'b'}  — Bạch Vô Thường: áo choàng TRẮNG, mũ cao trắng, chữ đen
   • Điểm nhấn: MŨ CAO VÚT (cao như hình, đỉnh chạm tới dòng tên trên đầu) có 3 ô chữ hình bầu dục + tua rua trắng/đen,
     dải viền hoa văn + dây đỏ; tóc dài thẳng; áo dài chấm gót (vạt dài), đai đỏ + dải lụa dài thả bên hông, tay áo rộng.
   • Biểu cảm có sẵn: THÈ LƯỠI DÀI TỚI NGỰC (luôn hiện, đè lên biểu cảm đang chọn; khuôn mặt & phụ kiện cầm tay vẫn hiện).
   • Chỉnh độ cao mũ: HAT_TOP bên dưới (mặc định -12 = ngay dưới dòng tên). Dòng tên nằm ở hàng -13 so với khung 20x31.
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof SETFX==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần) ----------
if(!SETS.some(s=>s.k=='hacvt')){
 SETS.push({n:'Hắc Vô Thường',k:'hacvt',mascot:'vothuong',vt:'h',wide:1,ach:1,
  ds:'Mũ cao vút đen chữ trắng có tua rua, tóc dài, áo choàng đen dài chấm gót, đai đỏ, tay áo rộng. Có sẵn biểu cảm thè lưỡi dài tới ngực. Không che mặt.',
  sh:'#1a1d2b',pt:'#1a1d2b',rpt:'#1a1d2b',shoe:'#12141c',scarf:'#d8232a'});
 SETS.push({n:'Bạch Vô Thường',k:'bachvt',mascot:'vothuong',vt:'b',wide:1,ach:1,
  ds:'Mũ cao vút trắng chữ đen có tua rua, tóc dài, áo choàng trắng dài chấm gót, đai đỏ, tay áo rộng. Có sẵn biểu cảm thè lưỡi dài tới ngực. Không che mặt.',
  sh:'#f3f4fa',pt:'#f3f4fa',rpt:'#f3f4fa',shoe:'#f3f4fa',scarf:'#d8232a'});
}

// ---------- 2) bảng màu ----------
const HAT_TOP=-12;                                  // hàng cao nhất của mũ (âm = cao hơn đầu). Muốn mũ thấp/cao hơn thì đổi số này (và rows bên dưới)
const PAL={
 h:{R:'#1a1d2b',RL:'#343b57',RD:'#0b0d15',TR:'#f2f3f8',TRD:'#c9ccd9',          // áo: chính / sáng / tối / viền / viền tối
    HAT:'#1a1d2b',HATL:'#3a4262',HATD:'#0a0c14',OV:'#f4f5fa',CH:'#262b43',      // mũ + ô chữ
    BAND:'#232840',BANDP:'#7a82a4',PIPE:'#f2f3f8',                              // dải hoa văn quanh mũ
    RIB:'#dfe1ea',RIBD:'#aeb2c4',SH:'#12141c',SHL:'#2b2f42'},                   // dải lụa thả hông + giày
 b:{R:'#f3f4fa',RL:'#ffffff',RD:'#c7cadb',TR:'#1a1d2b',TRD:'#3a4262',
    HAT:'#f3f4fa',HATL:'#ffffff',HATD:'#c4c8da',OV:'#1a1d2b',CH:'#f3f4fa',
    BAND:'#e2e5f2',BANDP:'#8f96b4',PIPE:'#1a1d2b',
    RIB:'#2a2e44',RIBD:'#0e101a',SH:'#f3f4fa',SHL:'#ffffff'}};
const RED='#d8232a',REDL='#f2565c',REDD='#9c1219',GOLD='#f2c14e',GOLDD='#c9961a',
      SK='#fbe3cf',SKD='#e8b998',                                               // da trắng
      HC='#2e2320',HL='#5b4a42',HD='#150f0d',                                   // tóc đen nâu
      TG='#ff6b86',TGD='#d93a5c',TGL='#ffb0c0',MTH='#6b1a2b';                   // lưỡi + trong miệng

function drawVT(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,P=PAL[S.vt]||PAL.h,mv=!!o.mv,t=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);                  // nhìn ngang (tự lật khi quay trái)
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sx=side?lg*(Rt?2:-2):0,hs=mv?lg:0;

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- giày (chỉ lòi mũi giày dưới vạt áo dài) ----------
 const shoe=(x,lift)=>{u(P.SH,x,29-lift,4,1);u(P.SHL,x,29-lift,1,1)};
 if(rd){}
 else if(sit){shoe(5,0);shoe(11,0)}
 else if(!side){if(lg>0){shoe(11,0);shoe(5,1)}else if(lg<0){shoe(5,0);shoe(11,1)}else{shoe(5,0);shoe(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){shoe(b,0);shoe(a,1)}else if(lg<0){shoe(a,0);shoe(b,1)}else{shoe(a,0);shoe(b,0)}}

 // ---------- tay áo rộng (cổ tay loe, viền) ----------
 const arm=(x,ay)=>{
  const lx=x<8?x-1:x;
  u(P.R,lx,15+ay,4,5);u(P.RL,lx,15+ay,1,5);u(P.RD,lx+3,15+ay,1,5);
  u(P.R,x<8?lx-1:lx+4,19+ay,1,2);                         // cổ tay loe ra ngoài
  u(P.R,lx,20+ay,4,1);u(P.TR,x<8?lx-1:lx,21+ay,5,1);
  u(SK,x,22+ay,3,2);u(SKD,x+2,22+ay,1,2)};
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(SK,x+ox,ty,3,3);u(SKD,x+ox+2,ty,1,3);u(P.TR,x,ty+3,3,1);
  u(P.R,x-(x<8?1:0),ty+4,4,3);u(P.RL,x-(x<8?1:0),ty+4,1,3);u(P.RD,x+2,ty+4,1,3)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 // ---------- thân + vạt áo dài ----------
 const skirtRows=[[23,5,15],[24,4,16],[25,4,16],[26,3,17],[27,3,17],[28,3,17]];       // [y, x đầu, x cuối(không gồm)]
 if(!side){
  // vạt dài (loe dần xuống gấu; 3 hàng cuối đung đưa theo bước đi)
  skirtRows.forEach(([y,a,b])=>{const s=y>=26?hs:0;u(P.R,a+s,y,b-a,1);u(P.RL,a+s,y,2,1);u(P.RD,b-2+s,y,2,1)});
  u(P.TR,3+hs,28,14,1);                                  // viền gấu
  u(P.RD,6,24,1,4);u(P.RD,13,24,1,4);                    // nếp gấp
  // thân áo
  u(P.R,5,14,10,8);u(P.RL,5,15,1,6);u(P.RD,14,15,1,6);
  if(!back){
   u(P.TR,8,14,1,1);u(P.TR,11,14,1,1);u(P.TR,8,15,1,1);u(P.TR,11,15,1,1);u(P.RD,9,15,2,1);   // cổ đứng chữ V
   u(P.TR,9,16,1,12);u(P.RD,10,16,1,12);               // nẹp trắng giữa áo (chạy xuống tận vạt)
   u(P.TR,5,23,1,1);u(P.TR,14,23,1,1);
  }else{u(P.RL,9,15,2,6);u(P.RD,9,24,2,4)}
  // đai đỏ
  u(RED,4,21,12,1);u(REDL,4,21,3,1);u(REDD,4,22,12,1);u(P.TR,4,20,12,1);
  if(!back){
   u(RED,6,21,3,2);u(REDD,6,22,3,1);u(GOLD,8,21,1,1);                                   // nút thắt
   u(P.RIB,7,23,2,6);u(P.RIBD,8,23,1,6);                             // dải lụa dài thả bên hông
   u(RED,13,22,1,3);u(REDD,13,24,1,1);                                                  // tua đai bên phải
  }else{
   u(RED,8,19,4,3);u(REDL,8,19,4,1);u(GOLD,9,20,2,1);
   u(P.RIB,8,23,1,5);u(P.RIB,11,23,1,5);u(P.RIBD,8,27,1,1);u(P.RIBD,11,27,1,1)}
  arms();
 }else{
  // nhìn ngang: vạt dài + thân + dải lụa sau lưng
  skirtRows.forEach(([y,a,b])=>{const s=y>=26?hs:0;M(P.R,a-1+s,y,b-a-2,1)});
  M(P.RL,4,24,1,4);M(P.RD,13,23,2,5);
  M(P.TR,3+hs,28,13,1);
  M(P.R,6,14,8,8);M(P.RD,12,15,2,6);M(P.RL,6,15,1,6);
  M(P.TR,13,16,1,11);                                    // nẹp trắng mép trước áo
  M(P.TR,10,14,2,1);M(P.RD,10,15,1,1);
  M(RED,6,21,8,1);M(REDD,6,22,8,1);M(P.TR,6,20,8,1);
  M(P.RIB,5,23,2,6);M(P.RIBD,5,23,1,6);                    // dải lụa sau hông
  M(RED,6,21,3,2);
  const ax=9-sx;
  if(!o.noarm){
   u(P.R,ax-1,15,5,5);u(P.RL,ax-1,15,1,5);u(P.RD,ax+3,15,1,5);
   u(P.R,ax-2,19,1,2);u(P.R,ax-1,20,5,1);u(P.TR,ax-2,21,6,1);
   u(SK,ax,22,3,2);u(SKD,ax+1,23,2,1)}
 }
 u(SK,9,14,2,1);                                          // cổ

 // ---------- đầu: mặt ----------
 if(back)fillRows(HC,MSTD.HF);
 else if(!side){fillRows(SK,MSTD.HF);u(SKD,15,8,1,4);u(SKD,6,13,8,1)}
 else{fillRows(SK,MSTD.HS,1);M(SKD,13,9,2,4);M(SKD,6,13,6,1)}

 // ---------- tóc dài thẳng ----------
 if(back){
  u(HC,3,5,14,9);u(HC,4,14,12,8);u(HL,6,7,2,1);u(HL,12,9,1,4);u(HD,3,9,1,5);u(HD,16,9,1,5);u(HD,9,10,2,11);
  for(let i=0;i<6;i++)u(HD,4+i*2,21+(i&1),1,1);
 }else if(!side){
  u(HC,4,5,12,2);u(HL,6,5,3,1);u(HL,11,6,2,1);
  u(HC,4,7,5,1);u(HC,11,7,5,1);u(HC,4,8,2,1);u(HC,14,8,2,1);u(HD,8,7,1,1);u(HD,11,7,1,1);
  for(let y=6;y<=12;y++){u(HC,3,y,2,1);u(HC,15,y,2,1)}
  // hai lọn dài rủ xuống trước ngực
  for(let y=13;y<=21;y++){u(HC,4,y,2,1);u(HC,14,y,2,1)}
  u(HD,4,9,1,3);u(HD,15,9,1,3);u(HL,3,7,1,2);u(HL,16,7,1,2);u(HL,4,14,1,5);u(HL,15,14,1,5);u(HD,5,13,1,8);u(HD,14,13,1,8);u(HD,4,21,2,1);u(HD,14,21,2,1);
 }else{
  M(HC,3,5,9,3);M(HL,5,5,3,1);M(HC,10,7,3,1);M(HD,11,7,1,1);
  M(HC,2,7,6,6);M(HC,2,13,6,11);M(HL,3,8,1,12);M(HD,2,12,1,12);M(HD,7,10,1,13);
  for(let i=0;i<3;i++)M(HD,2+i*2,23+(i&1),1,1);
  M(HC,8,7,2,4);
 }

 // ---------- biểu cảm (không che mặt) + THÈ LƯỠI DÀI TỚI NGỰC (luôn hiện) ----------
 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
  const w=Math.sin(t*3.2),sw=w>.45?1:w<-.45?-1:0;
  if(!side){
   u(MTH,8,13,4,1);u(MTH,9,14,2,1);                       // miệng há
   u(TG,9,14,2,1);u(TGL,9,14,1,1);
   for(let y=15;y<=20;y++){const d=y>=18?sw:0;u(TG,9+d,y,2,1);u(TGL,9+d,y,1,1);u(TGD,10+d,y,1,1)}
   u(TGD,9+sw,21,2,1);u(TGD,10+sw,21,1,1);   // đầu lưỡi chạm ngực
  }else{
   M(MTH,12,13,2,1);M(TG,12,14,2,1);M(TGL,12,14,1,1);
   for(let y=15;y<=20;y++){const d=y>=18?sw:0;M(TG,12+d,y,2,1);M(TGL,12+d,y,1,1);M(TGD,13+d,y,1,1)}
   M(TGD,12+sw,21,2,1)}
 }

 // ---------- MŨ CAO VÚT: chóp cao thon + 3 ô chữ + tua rua + dải hoa văn + dây đỏ ----------
 const hat=(Fm,mode)=>{
  const T=HAT_TOP;
  // chóp: đỉnh bo tròn → thân cao 8px → chạm dải viền
  Fm(P.HAT,7,T,6,1);Fm(P.HAT,6,T+1,8,-T-1+0);
  Fm(P.HATL,7,T,2,1);Fm(P.HATL,6,T+1,1,-T-1);Fm(P.HATD,13,T+1,1,-T-1);Fm(P.HATD,12,T,1,1);
  Fm(P.HATL,8,T+3,1,-T-5);                                // vệt sáng dọc thân mũ
  if(mode=='b'){Fm(P.HATD,10,T+1,1,-T-1)}                 // đường may sau gáy
  // 3 ô chữ hình bầu dục ở mặt trước (chữ = chấm đối màu)
  if(mode=='f'){
   [T+1,T+4,T+7].forEach(y=>{Fm(P.OV,10,y,1,1);Fm(P.OV,9,y+1,3,1);Fm(P.OV,10,y+2,1,1);Fm(P.CH,10,y+1,1,1)});
  }else if(mode=='s'){
   [T+1,T+4,T+7].forEach(y=>{Fm(P.OV,13,y,1,3);Fm(P.CH,13,y+1,1,1)});
  }
  // dây đỏ + dải viền hoa văn + viền trắng/đen dưới
  Fm(RED,5,0,10,1);Fm(REDL,5,0,3,1);Fm(REDD,12,0,3,1);
  Fm(P.BAND,3,1,14,2);Fm(P.PIPE,3,3,14,1);
  for(let x=4;x<16;x+=2){Fm(P.BANDP,x,1,1,1);Fm(P.BANDP,x+1,2,1,1)}
  Fm(P.HATD,3,2,1,1);Fm(P.HATD,16,2,1,1);
  if(mode!='b'){Fm(GOLD,16,1,1,2);Fm(GOLDD,16,2,1,1)}      // móc vàng bên phải
  // tua rua rủ xuống trước dải viền
  if(mode=='f'){
   Fm(P.OV,9,T+10,2,1);Fm(P.OV,9,T+11,2,1);Fm(P.OV,8,0,4,1);Fm(P.OV,8,1,4,2);
   Fm(P.CH,9,1,1,1);Fm(P.CH,11,1,1,1);
   Fm(P.OV,8,3,1,1);Fm(P.OV,9,3,1,1);Fm(P.OV,10,3,1,1);Fm(P.OV,11,3,1,1)}
  else if(mode=='s'){Fm(P.OV,13,0,1,3);Fm(P.OV,12,3,1,1);Fm(P.OV,13,3,1,1)}
 };
 if(!side)hat(u,back?'b':'f');
 else hat((c,x,y,w,h)=>M(c,x-2,y,w,h),'s');
}
window.drawMascotVT=drawVT;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.vothuong=drawVT;
})();
