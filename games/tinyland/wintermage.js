/* =====================================================================
   WINTERMAGE.JS — ❄️ PHÁP SƯ MÙA ĐÔNG: Set + Mũ (mỗi món 10 🗝️ Chìa khóa Giáng sinh)
   • Nam nữ mặc chung (tóc ngắn, mặc quần). KHÔNG che mặt.
   • Tự đăng ký vào SETS / HAIRS (cuối mảng) và tự thêm 2 món vào Gian hàng quà ở Xưởng Noel.
   • Chỉ cần thêm 1 dòng <script src="wintermage.js"> vào index.html, SAU xdeer.js và phuthuy.js.
   • Đổi giá: sửa WM_PRICE.  Hiệu ứng hoa tuyết nhẹ: set (hoa tuyết lượn quanh áo choàng, tinh thể lấp lánh)
     và mũ (hoa tuyết rơi từ vành mũ, đỉnh tinh thể lấp lánh). Muốn tắt: đặt WM_FX=false.
   • Vẽ vượt khung 20x31: vành mũ rộng ~34 điểm ảnh, chóp mũ + tinh thể cao tới hàng -10,
     vai áo & áo choàng loe ra tới x -2 … 21. Mọi nét đều vát cong / cắt góc, không dùng tam giác nhọn thô.
   ===================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined'||typeof HAIRS==='undefined')return;
const WM_PRICE=10,WM_FX=true;
const sin=Math.sin,rnd=Math.round,cos=Math.cos;

// ---------------- bảng màu ----------------
const IW='#f6fcff',IL='#d3f0ff',IM='#a2dbfa',IB='#6cc0f2',ID='#3d93d8',IK='#27639f',IN='#1b3a78',   // băng: trắng / sáng / giữa / xanh / tối / viền / xanh đêm
      GD='#ffe29a',GK='#e0b050',                                                                     // viền vàng nhạt
      FW='#ffffff',F1='#ebf6ff',F2='#cadff2',F3='#a6c4e2',                                           // lông trắng / tuyết
      NV='#26417f',NVL='#3d60b0',NVD='#162b5e',                                                      // quần xanh đêm
      BO='#d2e8f9',BOL='#f6fcff',BOD='#8db4d8',                                                      // ủng băng
      HC0='#b7d7f1',HL='#eaf8ff',HD='#7ea8d4',HT='#9fe2ff';                                          // tóc bạc xanh

// vẽ đối xứng (nhìn trước/sau)
const SY=(u,c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
// chấm sáng lấp lánh (chữ thập nhỏ, nhấp nháy)
function spark(u,cx,cy,ph,t){const s=sin(t*2.2+ph);
 if(s>.62){u('#ffffff',cx,cy,1,1);u('rgba(190,235,255,.95)',cx-1,cy,1,1);u('rgba(190,235,255,.95)',cx+1,cy,1,1);u('rgba(190,235,255,.95)',cx,cy-1,1,1);u('rgba(190,235,255,.95)',cx,cy+1,1,1)}
 else if(s>.2)u('rgba(225,245,255,.9)',cx,cy,1,1)}
// hoa tuyết nhỏ rơi nhẹ: x0..x0+w, từ y0 xuống y0+h, mờ dần
function drift(u,i,t,x0,w,y0,h,sp){const p=((t*(sp||.16)+i*.381)%1),fx=x0+((i*7.3+3)%w)+sin(t*1.3+i*2.1)*1.6,fy=y0+p*h,a=(sin(p*Math.PI)*.9).toFixed(2);
 const X=rnd(fx),Y=rnd(fy);
 if(i%3==0){u('rgba(255,255,255,'+a+')',X,Y,1,1);u('rgba(200,236,255,'+(a*.8).toFixed(2)+')',X-1,Y,1,1);u('rgba(200,236,255,'+(a*.8).toFixed(2)+')',X+1,Y,1,1);u('rgba(200,236,255,'+(a*.8).toFixed(2)+')',X,Y-1,1,1);u('rgba(200,236,255,'+(a*.8).toFixed(2)+')',X,Y+1,1,1)}
 else u('rgba(255,255,255,'+a+')',X,Y,1,1)}
// hoa tuyết pixel 7x7 / 5x5 (huy hiệu)
const FLK7=['...X...','.X.X.X.','..XXX..','XXXXXXX','..XXX..','.X.X.X.','...X...'];
const FLK5=['X.X.X','.XXX.','XXXXX','.XXX.','X.X.X'];
function glyph(F,rows,x,y,c,c2){rows.forEach((s,j)=>{for(let i=0;i<s.length;i++)if(s[i]=='X')F(c2&&j==(rows.length>>1)&&i==(s.length>>1)?c2:c,x+i,y+j,1,1)})}
// tinh thể xiên: lõi w điểm (sáng trái – giữa – tối phải) + viền xanh đậm 2 bên, đáy loe, ĐỈNH cắt vát (không nhọn)
// F(c,x,y,w,h); (x,yBase)=cột lõi trái-đáy; lean<0 ngả sang trái, >0 sang phải
function crystal(F,x,yBase,h,w,lean){w=w||2;lean=lean||0;
 for(let j=0;j<h;j++){const y=yBase-1-j,f=j/(h-1||1),top=j==h-1,
   ww=j<2?w+1:(j>=h-2?Math.max(1,w-1):w),xx=x+rnd(lean*f);
  if(top){F(IK,xx,y,ww,1);continue}
  F(IK,xx-1,y,1,1);F(IK,xx+ww,y,1,1);
  if(ww==1)F(IM,xx,y,1,1);
  else{F(IL,xx,y,1,1);F(ID,xx+ww-1,y,1,1);if(ww>2)F(IM,xx+1,y,ww-2,1)}
  if(j==h-2)F(IW,xx,y,1,1)}
}

/* ===================================================================
   MŨ PHÁP SƯ MÙA ĐÔNG  (HAIRFX.wmage)  — tóc ngắn + vành rộng + chóp tinh thể cao
   =================================================================== */
HAIRFX.wmage=(u,o,K)=>{
 const{side,Rt,back,SK}=K,t=performance.now()/1000,
  M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const F=side?M:u,CX=10;

 // ---------- 1) TÓC NGẮN (bạc xanh) ----------
 if(back){
  u(HC0,4,6,12,8);u(HC0,3,8,14,5);u(HL,6,8,3,1);u(HL,8,10,1,3);u(HD,4,9,1,4);u(HD,15,9,1,4);u(HD,9,12,2,1);
  u(HT,4,13,3,1);u(HT,13,13,3,1);u(HD,5,13,1,1);u(HD,14,13,1,1);
 }else if(!side){
  u(HC0,5,7,10,2);u(HL,6,7,3,1);u(HL,11,7,2,1);                                  // mái
  u(HC0,5,9,3,1);u(HC0,12,9,3,1);u(HC0,8,9,1,1);u(HD,9,9,2,1);u(HC0,11,9,1,1);u(HD,7,9,1,1);u(HD,12,9,1,1);
  for(let y=9;y<=12;y++){u(HC0,4,y,2,1);u(HC0,14,y,2,1);u(HD,4,y,1,1);u(HD,15,y,1,1)}     // 2 lọn ngắn 2 bên má
  u(HL,5,10,1,2);u(HL,14,10,1,2);u(HT,4,13,2,1);u(HT,14,13,2,1);u(HD,5,13,1,1);u(HD,14,13,1,1);
 }else{
  M(HC0,5,7,9,2);M(HL,7,7,3,1);M(HC0,5,9,3,1);M(HC0,11,9,3,1);
  M(HC0,2,8,7,5);M(HL,4,9,1,3);M(HD,2,10,1,3);M(HD,7,11,1,2);M(HC0,2,12,5,1);M(HT,2,13,4,1);M(HD,6,13,1,1);M(HC0,9,10,2,2);
 }

 // ---------- 2) VÀNH MŨ: elip rất rộng, hai đầu cụp xuống & bo tròn ----------
 const RX=17,cols=[];
 for(let x=CX-RX;x<=CX+RX-1;x++){
  const d=(x+.5-CX)/RX,e=Math.sqrt(Math.max(0,1-d*d)),dd=Math.pow(Math.abs(d),2.3);
  const top=rnd(4.9-2.6*e+3.0*dd),bot=rnd(5.5+2.6*e+3.0*dd);
  cols.push([x,top,Math.max(top+2,bot)]);
 }
 cols.forEach(([x,top,bot],i)=>{
  const h=bot-top,n=cols.length;
  F(IB,x,top,1,h);
  F(IL,x,top,1,1);                                           // mép trên sáng (sương giá)
  if(h>3)F(IM,x,top+1,1,1);
  F(ID,x,bot-2,1,1);F(IK,x,bot-1,1,1);                       // bóng + viền dưới
  if(i<2||i>n-3){F(IK,x,top,1,h)}                            // đầu vành bo tròn có viền
  if(i%5==2&&h>3)F(IW,x,top+1,1,1);                          // lấp lánh sương
 });
 // đường viền lông tuyết trắng quanh mép vành phía trước (lượn sóng nhẹ)
 cols.forEach(([x,top,bot],i)=>{ if(i>1&&i<cols.length-2&&((i>>1)%2==0))F(FW,x,bot-2,1,1)});

 // ---------- 3) CHÓP MŨ BĂNG: thân phân mặt (facet), thon cong, đỉnh bo tròn ----------
 const T=-10,BASE=3,H=BASE-T,rows=[];
 for(let y=T;y<=BASE;y++){
  const s=(y-T)/H,hw=2.1+4.7*Math.pow(s,1.15);              // nửa bề rộng: thon đều, đỉnh dày ~4 điểm
  rows.push([y,Math.round(CX-hw),Math.round(CX+hw)]);
 }
 // bóng đổ của cả chóp trên vành (cho nổi khối)
 rows.forEach(([y,x0,x1],i)=>{
  if(i==0){x0+=1;x1-=1}
  const w=x1-x0,mid=x0+(w>>1);
  F(IB,x0,y,w,1);                                            // nền
  F(IM,x0+1,y,Math.max(1,(w>>1)-1),1);                       // mặt sáng trái
  F(IL,x0+1,y,1,1);                                          // gờ sáng
  F(ID,mid+1,y,x1-mid-1,1);                                  // mặt tối phải
  F(IK,x1-2>x0?x1-2:x1-1,y,1,1);
  F(IK,x0,y,1,1);F(IK,x1-1,y,1,1);                           // viền
  if(i<=1)F(IK,x0,y,w,1);                                    // đỉnh bo tròn
  if(i%2==1)F(IL,mid,y,1,1);                                  // sống tinh thể giữa (thưa)
  if(i>1&&i%3==0&&w>4)F(IL,x0+2,y,1,1);
 });
 // dải đai xanh đêm ở chân chóp + hạt ngọc băng
 const rb=rows[rows.length-1],rb2=rows[rows.length-2];
 F(IN,rb2[1],BASE-1,rb2[2]-rb2[1],1);F(IN,rb[1]-1,BASE,rb[2]-rb[1]+2,1);
 F(ID,rb2[1]+1,BASE-1,rb2[2]-rb2[1]-2,1);
 for(let x=rb[1];x<rb[2];x+=3)F(IW,x,BASE,1,1);
 // đầu chóp: bo tròn, thêm viên ngọc băng nhỏ (cắt góc, không nhọn)
 F(IK,CX-1,T-1,2,1);F(IL,CX-1,T-2,2,1);F(IK,CX-2,T-2,1,1);F(IK,CX+1,T-2,1,1);F(IW,CX-1,T-2,1,1);F(IM,CX,T-2,1,1);F(IK,CX-1,T-3,2,1);

 // ---------- 4) HOA TUYẾT HUY HIỆU ở thân chóp (nhìn trước), tinh thể quanh chân chóp ----------
 if(!back&&!side){
  // đĩa nền xanh đậm + hoa tuyết 7x7
  F(IK,7,-3,7,7);F(IN,8,-4,5,1);F(IN,8,4,5,1);F(ID,8,-3,5,7);
  glyph(F,FLK7,7,-3,IW,IL);
 }else if(side){
  F(IK,12,-2,3,5);F(ID,12,-1,2,3);glyph(F,FLK5,11,-2,IW);
 }else{
  F(IK,7,-3,7,7);F(ID,8,-3,5,7);glyph(F,FLK7,7,-3,IL,IW);
 }
 // 2 cụm tinh thể xòe chéo ra ngoài hai bên chóp (đáy rộng, đỉnh vát) — vượt khung 20
 if(!side){
  crystal(u,0,6,9,2,-4);crystal(u,4,5,6,2,-2);          // cụm trái
  crystal(u,18,6,9,2,4);crystal(u,14,5,6,2,2);           // cụm phải (đối xứng)
 }else{
  crystal(M,-1,6,8,2,-3);crystal(M,3,5,5,2,-1);crystal(M,13,6,6,2,2);
 }

 // ---------- 5) HIỆU ỨNG HOA TUYẾT NHẸ ----------
 if(WM_FX){
  [[1,-7,0],[18,-7,2.1],[9,-12,4.2],[-3,4,1.3],[22,4,3.7],[6,-4,5.2],[14,-4,.7]].forEach(q=>spark(F,q[0],q[1],q[2],t));
  for(let i=0;i<4;i++)drift(F,i,t,-5,30,-8,24,.13);
 }
};

/* ===================================================================
   SET PHÁP SƯ MÙA ĐÔNG  (SETFX.wmage) — áo choàng băng + vai tinh thể + quần xanh đêm
   =================================================================== */
SETFX.wmage=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK,SKS}=K,t=performance.now()/1000,
  M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h),
  bob=o.nobob?0:o.mv?(lg?-1:0):0,Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);

 // ---------- chân: quần xanh đêm + viền sáng + ủng băng viền lông ----------
 const leg=(x,lift,w,toe)=>{
  for(let y=24;y<=27-lift;y++){u(NV,x,y,w,1)}
  u(NVL,x,24,1,4-lift);u(NVD,x+w-1,24,1,4-lift);
  u(F1,x,28-lift,w,1);u(FW,x,28-lift,1,1);u(F3,x+w-1,28-lift,1,1);            // viền lông cổ ủng
  u(BO,x,29-lift,w,1);u(BOL,x,29-lift,1,1);u(BOD,x+w-1,29-lift,1,1);
  if(side)u(BO,toe,29-lift,1,1)};
 if(!rd){
  if(sit){const sw=rnd(sin(performance.now()/260)*1.5);leg(5,sw>0?-2:-1,4);leg(11,-sw>0?-2:-1,4)}
  else if(!side){let L=[[5,0],[11,0]];if(lg>0)L=[[11,0],[5,1]];else if(lg<0)L=[[5,0],[11,1]];L.forEach(q=>leg(q[0],q[1],4))}
  else{const x1=8+sx,x2=10-sx;let L=[[x1,0],[x2,0]];if(lg>0)L=[[x2,0],[x1,1]];else if(lg<0)L=[[x1,0],[x2,1]];L.forEach(q=>leg(q[0],q[1],3,Rt?q[0]+3:q[0]-1))}
 }

 // ---------- áo choàng sau lưng (nhìn sau: choàng dài loe; nhìn ngang: vạt sau đung đưa) ----------
 const sw=o.mv?rnd(sin(performance.now()/120)):0;
 if(back){
  const CP=[[15,5,15],[16,4,16],[17,4,16],[18,3,17],[19,3,17],[20,3,17],[21,3,17],[22,2,18],[23,2,18],[24,2,18],[25,1,19],[26,1,19],[27,0,20]];
  CP.forEach(([y,a,b],i)=>{Q(IB,a,y,b-a,1);Q(IM,a+1,y,2,1);Q(ID,b-3,y,2,1);Q(IK,a,y,1,1);Q(IK,b-1,y,1,1);if(i%4==2)Q(IL,a+3,y,1,1)});
  Q(F1,0,28,20,1);Q(FW,1,28,18,1);for(let x=1;x<19;x+=3)Q(F3,x,28,1,1);       // viền lông gấu choàng
  Q(F2,0,28,1,1);Q(F2,19,28,1,1);
  Q(ID,9,16,2,12);Q(IL,5,16,1,11);                                              // nếp gấp
  glyph(Q,FLK7,7,18,IW,IL);                                                     // hoa tuyết lớn sau lưng
  Q(IN,4,22,12,1);Q(IM,5,22,1,1);                                               // đai
 }else if(side&&!rd){
  const bx=Rt?2:12,bw=6+sw;
  for(let y=15;y<=27;y++){const w2=3+(y-15>>2)+(y>22?1:0);M(IB,8-w2-sw*(y>20?1:0),y,w2+2,1);M(IM,8-w2-sw*(y>20?1:0),y,1,1);M(ID,8,y,1,1)}
  M(F1,3-sw,28,7,1);M(FW,3-sw,28,3,1);
 }

 // ---------- thân + áo ----------
 const coat=(rowsList,mirror)=>rowsList.forEach(([y,a,b])=>{
  const w=b-a,m=mirror?M:u;
  m(IB,a,y,w,1);m(IM,a+1,y,Math.min(3,w-3),1);m(ID,b-3,y,2,1);m(IK,a,y,1,1);m(IK,b-1,y,1,1)});
 if(!side){
  // áo choàng dài tới đùi: thân + vạt loe, viền lông trắng
  const BD=[[16,5,15],[17,5,15],[18,5,15],[19,5,15],[20,5,15],[21,5,15],[22,5,15],[23,4,16],[24,3,17],[25,3,17]];
  BD.forEach(([y,a,b])=>{Q(IB,a,y,b-a,1);Q(IM,a+1,y,2,1);Q(ID,b-3,y,2,1);Q(IK,a,y,1,1);Q(IK,b-1,y,1,1)});
  if(back){Q(IB,6,15,8,1);Q(ID,9,16,2,10);glyph(Q,FLK5,8,17,IL,IW)}
  else{
   // vạt áo mở giữa (xanh đêm bên trong) + cúc băng
   Q(IN,9,17,2,9);Q(NVL,9,17,1,9);
   for(let y=18;y<=24;y+=3){Q(IL,9,y,2,1);Q(IW,9,y,1,1)}
   glyph(Q,FLK5,7,16,IW,IL);
  }
  // viền lông trắng gấu áo (răng cưa mềm)
  Q(F1,3,26,14,1);Q(FW,3,26,1,1);Q(FW,16,26,1,1);for(let x=4;x<16;x+=2)Q(FW,x,26,1,1);Q(F2,3,27,14,0);
  Q(F3,4,27,1,1);Q(F3,8,27,1,1);Q(F3,12,27,1,1);Q(F3,15,27,1,1);
  // đai bạc + ngọc băng
  Q(F2,5,22,10,1);Q(F1,5,22,1,1);Q(F3,14,22,1,1);if(!back){Q(IW,9,22,2,1);Q('#58d4ff',9,22,2,1);Q(IW,9,22,1,1)}
  // cổ lông + khăn choàng vai
  Q(FW,5,14,10,1);Q(F1,4,15,12,1);Q(FW,4,15,2,1);Q(F2,14,15,2,1);Q(F3,6,15,1,1);Q(F3,13,15,1,1);
 }else{
  const BD=[[16,7,14],[17,7,14],[18,7,14],[19,7,14],[20,7,14],[21,7,14],[22,7,14],[23,6,15],[24,5,15],[25,5,15]];
  BD.forEach(([y,a,b])=>{Q(IB,Rt?a:20-b,y,b-a,1);Q(IM,Rt?a+1:20-b+(b-a)-3,y,2,1);Q(ID,Rt?b-3:20-b,y,2,1);Q(IK,Rt?a:19-a,y,1,1)});
  M(F1,5,26,10,1);M(FW,5,26,2,1);M(FW,9,26,2,1);M(FW,13,26,1,1);M(F2,5,27,2,1);M(F2,10,27,1,1);M(F3,13,27,1,1);
  M(F2,7,22,7,1);M(IW,11,22,2,1);M('#58d4ff',11,22,1,1);
  M(FW,8,14,6,1);M(F1,7,15,8,1);M(F2,12,15,2,1);
  glyph(Q,FLK5,Rt?10:5,17,IW,IL);
 }

 // ---------- tay áo: băng nhạt + măng sét lông + bàn tay ----------
 const arm=(x,ay)=>{
  Q(IB,x,17+ay,3,4);Q(IM,x,17+ay,1,4);Q(ID,x+2,17+ay,1,4);
  Q(F1,x-0,21+ay,3,1);Q(FW,x,21+ay,1,1);Q(F3,x+2,21+ay,1,1);
  Q(SK,x,22+ay,3,2);Q(SKS,x+2,22+ay,1,2)};
 const up=(x,h,ox)=>{const ty=17-h;
  Q(SK,x+ox,ty,3,3);Q(SKS,x+ox+2,ty,1,3);Q(F1,x,ty+3,3,1);Q(FW,x,ty+3,1,1);
  Q(IB,x,ty+4,3,3);Q(IM,x,ty+4,1,3);Q(ID,x+2,ty+4,1,3)};
 if(!side){if(o.aup){o.aup[0]!=null?up(2,o.aup[0],-1):arm(2,lg);up(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}}
 else if(!o.noarm){const ax=9-sx;Q(IB,ax,17,3,4);Q(IM,ax,17,1,4);Q(ID,ax+2,17,1,4);Q(F1,ax,21,3,1);Q(FW,ax,21,1,1);Q(SK,ax,22,3,2);Q(SKS,ax+2,22,1,2)}

 // ---------- VAI TINH THỂ: giáp vai băng tràn ra ngoài khung 20 (x -2 … 21), đỉnh vát ----------
 const cr=(X,x,yb,h,w,ln)=>crystal(X,x,yb,h,w,ln);
 const pauld=(sd)=>{ // sd=0 trái, 1 phải (nhìn trước/sau)
  const X=(c,x,y,w,h)=>{Q(c,sd?20-x-w:x,y,w,h)};
  // đế vai tròn lông
  X(FW,1,14,4,1);X(F1,0,15,5,1);X(F2,0,16,4,1);X(F3,1,17,2,1);
  // 2 tinh thể xiên ra ngoài, đỉnh cắt vát
  cr(X,-1,14,4,2,-2);cr(X,2,13,3,2,-1);
 };
 if(!side){pauld(0);pauld(1)}
 else{ // nhìn ngang: 1 vai tinh thể bên gần + 1 chùm nhỏ phía sau
  const X=(c,x,y,w,h)=>M(c,x,y,w,h);
  X(FW,6,14,4,1);X(F1,6,15,5,1);X(F2,7,16,3,1);
  cr(X,4,14,5,2,-2);cr(X,7,13,4,2,0);
 }
 u(SK,9,15,2,1);

 // ---------- HIỆU ỨNG: hoa tuyết lượn nhẹ quanh áo choàng, tinh thể lấp lánh ----------
 if(WM_FX){
  const F=side?M:u;
  [[-2,8,.3],[21,8,2.4],[1,24,4.1],[18,25,1.7]].forEach(q=>spark(F,q[0],q[1],q[2],t));
  for(let i=0;i<4;i++)drift(F,i+4,t,-3,26,8,22,.11);
 }
};

// ======================= ĐĂNG KÝ =======================
if(!SETS.some(s=>s.k=='wmages'))SETS.push({n:'Set Pháp sư mùa đông',k:'wmages',fx:'wmage',ach:1,ck:WM_PRICE,
 ds:'Áo choàng băng giá viền lông tuyết, giáp vai tinh thể, đai bạc ngọc băng, quần xanh đêm, ủng băng. Nam nữ đều mặc được. Có hoa tuyết rơi nhẹ. Đổi bằng 🗝️ Chìa khóa Giáng sinh.',
 sh:'#6cc0f2',shl:'#a2dbfa',shd:'#3d93d8',scarf:'#ebf6ff',belt:'#cadff2',pt:'#26417f',rpt:'#26417f',shoe:'#d2e8f9'});
if(!HAIRS.some(h=>h.k=='wmage'))HAIRS.push({n:'Mũ Pháp sư mùa đông',k:'wmage',c:'#b7d7f1',ach:1,ck:WM_PRICE});

// ======================= SHOP: Xưởng Noel (Gian hàng quà) =======================
const WMI=[{t:'s',k:'wmages'},{t:'h',k:'wmage'}];
const arr=t=>t=='s'?SETS:HAIRS,find=q=>arr(q.t).findIndex(x=>x.k==q.k),own=q=>{const i=find(q);return ST.own&&ST.own[q.t]&&ST.own[q.t].includes(i)};
window.wmBuy=function(n){const q=WMI[n],i=find(q);if(i<0)return;ST.own=ST.own||{};const a=(ST.own[q.t]=ST.own[q.t]||[]);
 if(a.includes(i))return toast('✓ Bạn đã có món này rồi, mở 🎒 Túi để dùng');
 const k=ST.ck|0;if(k<WM_PRICE)return toast('🗝️ Chưa đủ chìa khóa — cần '+WM_PRICE+', bạn có '+k);
 ST.ck=k-WM_PRICE;a.push(i);save();toast('❄️ Nhận được '+arr(q.t)[i].n+'!\nMở 🎒 Túi để dùng');nxHouse()};
let WRAF=0;
function wmAnim(){const cs=document.querySelectorAll('canvas.wmc');if(!cs.length||!UI){WRAF=0;return}const t=performance.now()/1000;
 cs.forEach(c=>{const q=WMI[+c.dataset.q],i=find(q),g=c.getContext('2d'),A=ST.av||{};g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.save();g.scale(3,3);
  const d=[0,3,1,2][Math.floor(t/1.6)%4];drawAv(g,Math.round(c.width/6)-10,c.height/3-33,{d,a:t,mv:0,sit:0,hair:q.t=='h'?i:(A.h|0),set:q.t=='s'?i:(A.s|0),e:A.e|0,acc:-1});g.restore()});
 WRAF=requestAnimationFrame(wmAnim)}
const _nx=window.nxHouse;
if(typeof _nx=='function')window.nxHouse=function(){_nx.apply(this,arguments);
 const gg=document.querySelector('#ui .nxgg');if(!gg)return;
 const h=WMI.map((q,n)=>{const i=find(q);if(i<0)return '';const it=arr(q.t)[i],has=own(q),ok=(ST.ck|0)>=WM_PRICE;
  return '<div class="nxd nxbox" style="grid-column:span 1"><canvas class="wmc" data-q="'+n+'" width="120" height="150" style="width:84px;height:105px;image-rendering:pixelated"></canvas><b>'+it.n+'</b>'
   +(has?'<span class="nxs">✓ Đã có</span>':'<button class="nxb'+(ok?'':' lack')+'" onclick="wmBuy('+n+')">🗝️ '+WM_PRICE+' • Đổi</button>')+'</div>'}).join('');
 gg.insertAdjacentHTML('beforeend',h);
 const c=document.querySelector('#ui .nxc.soon');if(c)c.textContent=gg.querySelectorAll('.nxbox').length+' MÓN';
 if(!WRAF)WRAF=requestAnimationFrame(wmAnim)};
})();
