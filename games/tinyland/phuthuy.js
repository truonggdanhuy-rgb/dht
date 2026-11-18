/* ===================================================================================
   PHUTHUY.JS — 🔮 MASCOT PHÙ THỦY MỘNG MƠ (1 set chung, NAM + NỮ đều mặc được)
   • Tự đẩy set vào CUỐI mảng SETS khi nạp (nên đặt file này SAU xdeer.js trong index.html).
       {k:'phuthuy', mascot:'phuthuy'}
   • Bán ở TIỆM CHÚ HỀ (circus.js → CL_ITEMS): cần ĐỦ 5000 Xu + 800 Xu quái vật + 5 Kim cương.
   • Hình: tóc ngắn bob trắng kem, đuôi tóc chuyển hồng – xanh; MŨ PHÙ THỦY vừa CAO vừa RỘNG VÀNH
     (vành rộng ~32 điểm ảnh, vượt hẳn khung chuẩn 20 — wide:1), chóp mũ vát cong mượt (không tam giác),
     màu hồng chấm bi xanh, dải mũ tím than gài sao vàng, sao vàng ở đầu chóp + ở vành;
     áo sơ mi trắng + gi-lê xanh đêm cài sao vàng, QUẦN dài xanh đêm điểm sao, ủng tím viền vàng.
   • KHÔNG che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   • Chỉnh độ cao chóp mũ: HAT_TOP bên dưới (dòng tên nằm ở hàng -13; sao đầu chóp cao hơn đỉnh 3 hàng nên để -10).
   =================================================================================== */
(function(){
if(typeof SETS==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần) ----------
if(!SETS.some(s=>s.k=='phuthuy')){
 SETS.push({n:'Phù Thủy Mộng Mơ',k:'phuthuy',mascot:'phuthuy',wide:1,ach:1,
  ds:'Mũ phù thủy hồng vừa cao vừa rộng vành, chóp cong mượt gắn sao vàng, tóc bob trắng đuôi hồng – xanh, gi-lê xanh đêm, quần dài. Nam nữ đều mặc được. Không che mặt.',
  sh:'#2b2f6e',pt:'#34306e',rpt:'#34306e',shoe:'#6a43b0',scarf:'#ffd23a'});
}

// ---------- 2) bảng màu ----------
const HAT_TOP=-10;                                          // hàng cao nhất của chóp mũ
const PK='#f06fb0',PKL='#ff9fd0',PKD='#c24a97',PKO='#8e2f78',   // mũ hồng: chính / sáng / tối / viền
      DOT='#a8e6ff',DOT2='#ffffff',                              // chấm bi xanh nhạt / lấp lánh
      BD='#3a2a78',BDL='#5a46a8',BDD='#241a52',                  // dải mũ tím than
      GD='#ffd23a',GDL='#fff3a8',GDO='#f29a1e',                  // sao vàng
      HC='#fff1ee',HL='#ffffff',HD='#dcbfd2',HM='#ecd0f0',      // tóc trắng kem / sáng / bóng / chuyển tím nhạt
      HP='#ff9fcb',HPD='#e873ad',HB='#92d2ff',HBD='#63b3ee',    // đuôi tóc hồng / xanh
      SK='#ffe5d2',SKD='#f0c1a3',SKL='#fff3e8',                  // da
      VS='#2b2f6e',VSL='#4a52a8',VSD='#1a1c4a',                  // gi-lê xanh đêm
      WH='#ffffff',WS='#d9d6ee',                                 // áo sơ mi trắng
      PT='#34306e',PTL='#4d4896',PTD='#1f1c4c',                  // quần
      BT='#6a43b0',BTL='#8c66d6',BTD='#432878';                  // ủng tím

const star5=(F,x,y,big)=>{                                   // sao vàng 5 điểm (5x5)
 const rows=['..X..','.XXX.','XXXXX','.XXX.','.X.X.'];
 rows.forEach((s,j)=>{for(let i=0;i<5;i++)if(s[i]=='X')F(GD,x+i,y+j,1,1)});
 F(GDL,x+2,y+1,1,1);F(GDL,x+1,y+2,1,1);F(GDO,x+3,y+3,1,1);F(GDO,x+1,y+4,1,1);F(GDO,x+3,y+4,1,1);
};
const star3=(F,x,y)=>{F(GD,x+1,y,1,3);F(GD,x,y+1,3,1);F(GDL,x+1,y+1,1,1)};   // sao nhỏ 3x3

function drawPT(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,mv=!!o.mv,t=performance.now()/1000;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);                // nhìn ngang (tự lật khi quay trái)
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sx=side?lg*(Rt?2:-2):0;

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân: quần dài xanh đêm + ủng tím viền vàng ----------
 const leg=(x,lift)=>{
  for(let y=24;y<27-lift;y++){u(PT,x,y,4,1)}
  u(PTL,x,24,1,3-lift);u(PTD,x+3,24,1,3-lift);
  if(!lift)u(GDL,x+1,25,1,1);                                // sao nhỏ trên ống quần
  u(GD,x,27-lift,4,1);u(GDO,x+3,27-lift,1,1);                // viền cổ ủng vàng
  u(BT,x,28-lift,4,1);u(BTL,x,28-lift,1,1);u(BTD,x,29-lift,4,1);
  if(side){const tx=Rt?x+4:x-1;u(BT,tx,28-lift,1,2);u(BTL,tx,28-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 // tay: sơ mi trắng phồng nhẹ + cổ tay gi-lê xanh + bàn tay
 const arm=(x,ay)=>{
  const lx=x<8?x-1:x;
  u(WH,lx,15+ay,4,4);u(WH,lx,15+ay,1,4);u(WS,lx+3,15+ay,1,4);u(WS,lx+1,18+ay,2,1);
  u(VS,x,19+ay,3,1);u(GD,x,20+ay,3,1);                         // măng sét xanh + viền vàng
  u(SK,x,21+ay,3,3);u(SKD,x+2,21+ay,1,3);u(SKD,x,23+ay,3,1);
 };
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(SK,x+ox,ty,3,3);u(SKD,x+ox+2,ty,1,3);u(GD,x,ty+3,3,1);u(VS,x,ty+4,3,1);
  u(WH,x,ty+5,3,3);u(WS,x+2,ty+5,1,3)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 if(!side){
  // gi-lê xanh đêm + vạt ngắn
  u(VS,4,15,12,8);u(VSL,4,15,2,7);u(VSD,14,15,2,8);
  u(VS,4,23,12,1);u(GD,4,24,12,1);u(GDO,4,24,1,1);u(GDO,15,24,1,1);   // viền gấu vàng
  u(PT,6,23,8,1);                                                 // quần lộ dưới vạt gi-lê
  if(back){
   u(WH,6,14,8,2);u(WS,6,15,8,1);
   u(VSL,9,17,2,5);u(VSD,10,17,1,5);                             // đường may lưng
   star5((c,x,y,w,h)=>u(c,x,y,w,h),8,17);                        // sao vàng sau lưng
   u(GD,4,21,12,1);                                               // đai vàng
  }else{
   // cổ áo sơ mi trắng + nơ tím nhỏ
   u(WH,6,14,8,2);u(WS,6,15,8,1);u(WH,5,15,2,2);u(WH,13,15,2,2);u(WS,5,16,2,1);u(WS,13,16,2,1);
   u(BD,9,15,2,2);u(BDL,9,15,1,1);
   // hàng cúc sao vàng dọc gi-lê
   u(WH,8,16,4,6);u(WS,8,16,1,6);                                 // vạt sơ mi lộ giữa
   u(GD,9,17,2,1);u(GD,9,19,2,1);u(GD,9,21,2,1);
   u(GD,7,16,1,7);u(GD,12,16,1,7);                                // viền vàng 2 bên
   u(GDL,7,16,1,1);
   // sao nhỏ trang trí trên gi-lê
   u(GDL,5,18,1,1);u(GDL,14,20,1,1);u(GDL,5,21,1,1);
  }
  arms();
 }else{
  u(VS,7,16,7,7);u(VSD,Rt?12:7,16,2,7);u(VS,8,14,6,2);
  M(VS,5,23,10,1);M(GD,5,24,10,1);M(VSD,5,22,10,1);
  M(WH,8,14,6,2);M(WS,8,15,6,1);M(BD,12,15,2,2);
  M(WH,11,16,2,6);M(GD,10,16,1,7);M(GD,11,17,1,1);M(GD,11,19,1,1);M(GD,11,21,1,1);
  M(PT,6,23,8,1);
  const ax=9-sx;
  if(!o.noarm){
   u(WH,ax-1,15,5,4);u(WH,ax-1,15,1,4);u(WS,ax+3,15,1,4);u(WS,ax,18,3,1);
   u(VS,ax,19,3,1);u(GD,ax,20,3,1);
   u(SK,ax,21,3,3);u(SKD,ax+2,21,1,3);u(SKD,ax,23,3,1)}
 }
 u(SK,9,14,2,1);

 // ---------- đầu: mặt ----------
 if(back)fillRows(HC,MSTD.HF);
 else if(!side){fillRows(SK,MSTD.HF);u(SKD,15,9,2,4);u(SKD,6,13,8,1);u(SKL,7,9,2,1)}
 else{fillRows(SK,MSTD.HS,1);M(SKD,13,9,2,4);M(SKD,6,13,8,1)}

 // ---------- tóc bob ngắn trắng kem, đuôi hồng – xanh ----------
 if(back){
  u(HC,4,5,12,10);u(HC,3,8,14,6);
  u(HL,6,7,3,1);u(HL,7,9,1,4);u(HL,12,9,1,4);u(HD,4,8,1,6);u(HD,15,8,1,6);u(HD,10,9,1,5);
  u(HM,4,13,12,1);
  u(HP,3,14,6,2);u(HB,11,14,6,2);u(HPD,3,15,6,1);u(HBD,11,15,6,1);u(HC,9,14,2,1);   // đuôi tóc 2 màu, nhịp nhàng
  u(HP,3,13,1,1);u(HB,16,13,1,1);
 }else if(!side){
  // mái bằng chẻ lệch + 2 lọn tóc bên mặt
  u(HC,4,7,12,2);u(HL,6,7,3,1);u(HL,12,7,2,1);u(HC,4,9,3,1);u(HC,13,9,3,1);u(HC,7,9,1,1);u(HC,9,9,3,1);u(HD,8,8,1,1);u(HD,12,9,1,1);
  u(HC,4,10,2,1);u(HC,14,10,2,1);
  for(let y=9;y<=13;y++){u(HC,3,y,2,1);u(HC,15,y,2,1);u(HD,4,y,1,1);u(HD,15,y,1,1);if(y%2)u(HL,3,y,1,1)}
  u(HM,3,12,2,1);u(HM,15,12,2,1);
  u(HP,3,13,2,1);u(HPD,3,14,2,1);u(HP,4,14,1,1);u(HB,15,13,2,1);u(HBD,15,14,2,1);u(HB,15,14,1,1);   // đuôi tóc hồng trái – xanh phải
 }else{
  M(HC,4,7,10,2);M(HL,6,7,3,1);M(HC,4,9,3,1);M(HC,11,9,3,1);
  M(HC,2,8,7,7);M(HL,4,9,1,5);M(HD,2,10,1,5);M(HD,7,11,1,3);M(HC,1,12,3,3);
  M(HC,8,10,2,3);M(HM,2,12,6,1);
  M(HP,1,13,3,2);M(HPD,1,14,3,1);M(HB,4,13,3,2);M(HBD,4,14,3,1);   // đuôi tóc hồng + xanh
 }

 // ---------- mặt: biểu cảm vẽ SAU tóc, TRƯỚC mũ (mũ không che mắt) ----------
 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
 }

 // ---------- MŨ PHÙ THỦY: vành rộng + chóp cao cong mượt ----------
 // F(c,x,y,w,h): hàm vẽ (đã tự lật theo hướng). lean>0: chóp ngả sang phải của hình vẽ
 const hat=(F,lean,mode)=>{
  const T=HAT_TOP,BASE=3,CX=10;
  // --- vành mũ: elip rất rộng (x từ -6 đến 26), hai đầu vành cụp xuống & bo tròn ---
  const RX=16,cols=[];
  for(let x=CX-RX;x<=CX+RX-1;x++){
   const d=(x+.5-CX)/RX,e=Math.sqrt(Math.max(0,1-d*d)),dd=Math.pow(Math.abs(d),2.2);
   const top=Math.round(5.2-2.6*e+3.4*dd),bot=Math.round(5.8+2.5*e+3.4*dd);
   cols.push([x,top,Math.max(top+2,bot)]);
  }
  cols.forEach(([x,top,bot],i)=>{
   const h=bot-top,end=(i<2||i>cols.length-3);
   F(PK,x,top,1,h);
   F(PKD,x,bot-2,1,1);                                          // bóng mép dưới vành
   F(PKO,x,bot-1,1,1);                                          // viền dưới đậm
   F(PKL,x,top,1,1);                                            // mép trên sáng
   if(i<12&&h>3)F(PKL,x,top+1,1,1);                             // ánh sáng nửa vành trái
   if(i==0||i==cols.length-1){F(PKO,x,top,1,h)}                 // đầu vành bo tròn có viền
   else if(i==1||i==cols.length-2){F(PKO,x,top,1,1)}
  });
  // chấm bi xanh + lấp lánh trên mặt vành
  cols.forEach(([x,top,bot])=>{
   for(let y=top+1;y<bot-2;y++){
    if(((x*5+y*3)%7)==0)F(DOT,x,y,1,1);
    else if(((x*3+y*7)%11)==4)F(DOT2,x,y,1,1);
   }
  });
  // --- chóp mũ: thân phình, thon dần, ĐỈNH ngả cong, đầu chóp bo tròn (không phải tam giác thẳng) ---
  const H=BASE-T,rows=[];
  for(let y=T;y<=BASE;y++){
   const s=(y-T)/H,                                              // 0 ở đỉnh → 1 ở đáy
    hw=2.3+4.9*Math.pow(s,1.05),                                  // nửa bề rộng: thon đều, đỉnh vẫn dày 4-5 điểm (không nhọn)
    cx=CX+lean*.8*Math.pow(1-s,2.6);                             // chỉ phần đỉnh ngả cong, thân vẫn cân đối
   rows.push([y,Math.round(cx-hw),Math.round(cx+hw)]);
  }
  // bo tròn đỉnh: cắt 1 điểm ảnh ở góc hàng đầu
  rows.forEach(([y,x0,x1],i)=>{
   if(i==0){x0+=1;x1-=1}
   const w=x1-x0;
   F(PK,x0,y,w,1);
   F(PKO,x0,y,1,1);F(PKO,x1-1,y,1,1);                            // viền 2 bên
   if(i<=1)F(PKO,x0,y,w,1);                                      // mũi chóp có viền tròn
   if(w>3){F(PKL,x0+1,y,1,1);F(PKD,x1-2,y,1,1)}
   if(w>6){F(PKD,x1-3,y,1,1);F(PKL,x0+2,y,1,1)}
   if(w>4&&i>1){
    const span=w-2,md=n=>((n%span)+span)%span;
    if((((y*5)%3)+3)%3==0)F(DOT,x0+1+md(y*3+7),y,1,1);
    else if((((y*7)%4)+4)%4==1)F(DOT2,x0+1+md(y*2),y,1,1);
   }
  });
  // --- dải mũ tím than ở chân chóp + chấm sao nhỏ ---
  const rb=rows[rows.length-1],rb2=rows[rows.length-2];
  F(BD,rb2[1],BASE-1,rb2[2]-rb2[1],1);F(BD,rb[1]-1,BASE,rb[2]-rb[1]+2,1);
  F(BDL,rb2[1]+1,BASE-1,2,1);F(BDD,rb[2],BASE,1,1);
  for(let x=rb[1]+1;x<rb[2]-1;x+=3)F(GDL,x,BASE,1,1);
  if(mode!='b')star5(F,CX-2,BASE-3);                             // sao vàng lớn làm khóa mũ (phía trước)
  // --- sao vàng ở đầu chóp (to, rõ như hình mẫu) + sao nhỏ trên vành ---
  const tip=rows[0],tcx=(tip[1]+tip[2])>>1;
  star5(F,tcx-2+(lean>0?2:-2),T-3);
  if(mode=='f')star5(F,-4,3);
  else if(mode=='b')star5(F,-4,3);
  if(mode!='b')star3(F,CX+Math.round(lean*.35)+2,T+5);
 };
 if(!side)hat(back?((c,x,y,w,h)=>u(c,20-x-w,y,w,h)):u,5,back?'b':'f');
 else hat(M,-5,'s');
}
window.drawMascotPT=drawPT;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.phuthuy=drawPT;
})();
