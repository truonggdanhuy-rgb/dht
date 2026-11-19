/* ===================================================================================
   HOAIBAO.JS — 🌟 SET HOÀI BÃO: Set Nam / Set Nữ + Tóc Nam / Tóc Nữ (4 món) — bán ở SHOP PHỐ XÁ
   • Giá đồng bộ: 2.000 Xu / món (cả Set và Tóc & mũ) → đổi giá: sửa HB_GIA bên dưới.
   • SET NAM : Áo khoác đen mở khóa ngoài áo thun xanh rêu, quần đen ống đứng, giày xanh than mũi trắng.
   • SET NỮ  : Áo hai dây đen dáng xòe nhẹ, quần soóc trắng cạp gọn, giày sneaker trắng, tay & chân trần.
   • TÓC NAM : Tóc nâu đen xù layer rối tự nhiên + kính gọng chữ nhật nâu đậm mảnh thanh lịch.
   • TÓC NỮ  : Tóc nâu socola xoăn gợn sóng dài ngang lưng rẽ ngôi giữa + đôi khuyên tai vuông vàng nhỏ.
   • Vẽ HD (K=4), không che biểu cảm khuôn mặt (kính nam rỗng tròng để lộ mắt & mọi biểu cảm).
   • Đủ 4 hướng, đi bộ, ngồi, cưỡi thú, giơ tay, cầm phụ kiện.
   • Nạp SAU hdkit.js & hdface.js trong index.html. Tự đẩy vào CUỐI mảng SETS / HAIRS.
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined'||typeof HD!=='function')return;
const HB_GIA=2000;

// ---------- Bảng màu (chỉ dùng mã hex 6 ký tự #rrggbb theo hdkit.js) ----------
const SK=['#d99e6a','#e5ae7a','#f1c08a','#fbd8aa'];                     // da mặc định của game
const BK=['#131418','#1e2026','#2b2d36','#3d404b'];                     // áo khoác / áo dây / quần đen than
const BKI=['#0c0d10','#16181e','#23252e','#343742'];                    // lớp trong / cổ áo tối hơn
const OLV=['#3a4224','#4d5731','#606d3f','#75844e'];                    // áo thun xanh rêu bên trong (Nam)
const NVY=['#111833','#1c284f','#2a3b70','#3c5294'];                    // giày sneaker xanh than đậm
const WHT=['#cdd5e2','#e3e9f3','#f5f7fb','#ffffff'];                    // quần soóc trắng / sneaker trắng / mũi giày
const HM=['#1e1a1c','#2e292c','#3f393d','#524b50'];                     // tóc nam nâu đen than
const HMB=['#161315','#242022','#332e31','#433d41'];                    // phần tóc sau tối hơn
const GLS_D='#2a1b16',GLS_M='#442d24',GLS_L='#5e4034';                  // gọng kính chữ nhật nâu đậm

const olSkin=c=>[c[0]*.62|0,c[1]*.42|0,c[2]*.36|0];
const olBlk=c=>[c[0]*.45+6|0,c[1]*.45+6|0,c[2]*.5+8|0];
const olWht=c=>[c[0]*.66|0,c[1]*.68|0,c[2]*.76|0];
const olHM=c=>[c[0]*.48+8|0,c[1]*.44+8|0,c[2]*.48+10|0];

const h=HD({K:4,MX:12,MY:12,WU:44,HU:52});
const lvB=(ux,x0,x1,top)=>top?3:ux<x0?2:ux>x1?0:1;
const lock=(a,b,c,d,r0,r1,pal,pw)=>h.stroke(h.bez(a,b,c,d),r0,r1,h.shade(pal),pw||1);
const lockM=(a,b,c,d,r0,r1,pal,pw)=>{lock(a,b,c,d,r0,r1,pal,pw);lock(h.mirP(a),h.mirP(b),h.mirP(c),h.mirP(d),r0,r1,pal,pw)};
const mass=(cx,cy,rx,ry,pal)=>h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>pal[dy<-.5?3:dy>.55?0:(dx<-.35&&dy<.1)?2:1]);

// ---------- GIÀY ----------
function shoeMale(x,y,view,lift){
 y=y-lift;
 h.begin();
 if(view=='f'){
  h.rrect(x-.4,y+.2,4.8,3.0,1.1,(ux,uy)=>uy>y+2.5?WHT[1]:uy<y+1.1?NVY[2]:ux>x+3.1?NVY[0]:NVY[1]);
  h.ell(x+2.0,y+1.55,1.45,.95,(ux,uy)=>uy<y+1.55?WHT[3]:WHT[2]);     // mũi giày trắng tròn
  h.rect(x-.4,y+2.65,4.8,.55,WHT[1]);
 }else if(view=='b'){
  h.rrect(x-.4,y+.3,4.8,2.9,1.1,(ux,uy)=>uy>y+2.5?WHT[1]:ux>x+3.0?NVY[0]:NVY[1]);
  h.rect(x-.4,y+2.6,4.8,.55,WHT[1]);
 }else{ // nhìn ngang (hướng phải)
  h.rrect(x-.7,y+.3,5.8,2.9,1.1,(ux,uy)=>uy>y+2.55?WHT[2]:uy<y+1.1?NVY[2]:ux<x+.8?NVY[0]:NVY[1]);
  h.ell(x+3.85,y+1.65,1.15,.9,(ux,uy)=>uy<y+1.6?WHT[3]:WHT[2]);     // mũi trắng phía trước
  h.rect(x-.7,y+2.65,5.8,.55,WHT[1]);
 }
 h.end(2,olBlk);
}
function shoeFem(x,y,view,lift){
 y=y-lift;
 h.begin();
 if(view=='f'){
  h.rrect(x-.35,y+.3,4.5,2.9,1.1,(ux,uy)=>uy>y+2.5?WHT[0]:uy<y+1.1?WHT[3]:ux>x+2.9?WHT[1]:WHT[2]);
  h.rect(x+.7,y+.8,2.3,.45,WHT[0]);                                  // dây giày nhẹ
  h.rect(x-.35,y+2.65,4.5,.55,WHT[0]);
 }else if(view=='b'){
  h.rrect(x-.35,y+.35,4.5,2.85,1.1,(ux,uy)=>uy>y+2.5?WHT[0]:ux>x+2.9?WHT[1]:WHT[2]);
  h.rect(x-.35,y+2.6,4.5,.55,WHT[0]);
 }else{
  h.rrect(x-.65,y+.35,5.6,2.85,1.1,(ux,uy)=>uy>y+2.55?WHT[0]:uy<y+1.1?WHT[3]:ux<x+.8?WHT[1]:WHT[2]);
  h.rect(x+2.2,y+.85,1.4,.42,WHT[0]);
  h.rect(x-.65,y+2.65,5.6,.55,WHT[0]);
 }
 h.end(2,olWht);
}

// ---------- CHÂN ----------
function legMale(x,lift){
 h.begin();
 h.rrect(x,23.2,4.0,5.0-lift,.55,(ux,uy)=>uy>27.4-lift?BK[0]:ux<x+1.1?BK[2]:ux>x+2.9?BK[0]:BK[1]);
 h.rect(x+1.7,24.4,.3,3.1-lift*.6,BK[0]);                            // nếp ống quần
 h.end(2,olBlk);
}
function legFem(x,lift){
 h.begin();
 h.rrect(x+.2,24.6,3.4,3.8-lift,.6,(ux,uy)=>ux<x+1.1?SK[3]:ux>x+2.6?SK[1]:SK[2]);
 h.rect(x+1.2,26.1-lift*.3,1.3,.35,SK[1]);                           // khớp gối nhẹ
 h.end(2,olSkin);
}

// ---------- THÂN NAM (áo khoác đen mở khóa + áo thun xanh rêu) ----------
function maleTorsoF(back){
 if(!back){
  // áo thun xanh rêu ở giữa
  h.begin();
  h.rrect(6.6,14.5,6.8,9.0,.8,(ux,uy)=>uy<15.5?OLV[3]:ux<8.5?OLV[2]:ux>11.5?OLV[0]:OLV[1]);
  h.ell(10,14.6,1.65,.95,SK[2]);                                     // cổ tròn hở da nhẹ
  h.end(1,olBlk);
  // 2 vạt áo khoác đen mở phía trước
  h.begin();
  h.poly([[4.3,14.4],[8.15,14.8],[8.0,24.1],[4.1,24.1]],(ux,uy)=>ux<5.4?BK[2]:ux>7.4?BK[0]:BK[1]);
  h.poly([[15.7,14.4],[11.85,14.8],[12.0,24.1],[15.9,24.1]],(ux,uy)=>ux>14.6?BK[0]:ux<12.6?BK[2]:BK[1]);
  h.rrect(4.2,23.4,3.8,.7,.3,BK[0]);
  h.rrect(12.0,23.4,3.8,.7,.3,BK[0]);
  h.end(2,olBlk);
  // ve cổ áo + đường khóa + miệng túi 2 bên
  h.begin();
  h.poly([[6.4,14.2],[8.3,14.6],[7.9,16.5],[6.0,15.5]],BK[2]);
  h.poly([[13.6,14.2],[11.7,14.6],[12.1,16.5],[14.0,15.5]],BK[2]);
  h.rect(7.75,16.2,.4,7.6,BK[3]);h.rect(11.85,16.2,.4,7.6,BK[3]);    // nẹp mép khóa
  h.stroke(h.bez([4.9,20.8],[5.6,21.0],[6.4,21.4],[7.0,21.9]),.18,.16,()=>BK[3]);
  h.stroke(h.bez([15.1,20.8],[14.4,21.0],[13.6,21.4],[13.0,21.9]),.18,.16,()=>BK[3]);
  h.end(0);
  // thắt lưng quần lộ ở khe dưới
  h.begin();h.rrect(7.8,22.4,4.4,1.3,.3,BKI[1]);h.end(1,olBlk);
 }else{
  h.begin();
  h.rrect(4.2,14.4,11.6,9.7,1.4,(ux,uy)=>lvB(ux,6.0,14.0,uy<15.2)==3?BK[2]:ux<6.2?BK[2]:ux>13.8?BK[0]:BK[1]);
  h.rrect(6.4,13.9,7.2,1.9,.8,(ux)=>ux<9?BK[2]:BK[0]);                // gáy cổ áo khoác
  h.rect(4.2,23.4,11.6,.7,BK[0]);
  h.end(2,olBlk);
  h.begin();
  h.rect(9.85,15.8,.3,7.6,BK[0]);
  h.stroke(h.bez([6.0,16.4],[5.4,18.8],[5.2,21.2],[5.0,23.2]),.18,.12,()=>BK[2]);
  h.stroke(h.bez([14.0,16.4],[14.6,18.8],[14.8,21.2],[15.0,23.2]),.18,.12,()=>BK[0]);
  h.end(0);
 }
}
function maleTorsoS(){
 // lớp lưng & thân áo khoác bên
 h.begin();
 h.rrect(5.3,14.4,8.6,9.7,1.4,(ux,uy)=>uy<15.3?BK[2]:ux<7.0?BK[2]:ux>12.2?BK[0]:BK[1]);
 h.rect(5.3,23.4,8.6,.7,BK[0]);
 h.end(2,olBlk);
 // lớp áo thun xanh rêu nhô ra ở ngực phải
 h.begin();
 h.rrect(12.2,15.0,1.9,7.8,.5,(ux,uy)=>uy<16?OLV[3]:OLV[1]);
 h.end(1,olBlk);
 h.begin();
 h.poly([[10.5,14.2],[13.2,14.3],[12.8,16.2],[10.9,15.4]],BK[2]);
 h.rect(12.1,15.8,.45,7.8,BK[3]);
 h.end(0);
}

// ---------- THÂN NỮ (áo hai dây đen dáng xòe + quần soóc trắng) ----------
function femTorsoF(back){
 // quần soóc trắng
 h.begin();
 h.rrect(5.0,22.0,10.0,3.2,.8,(ux,uy)=>ux<7.2?WHT[3]:ux>13.0?WHT[1]:WHT[2]);
 h.rect(5.0,24.7,4.7,.55,WHT[1]);h.rect(10.3,24.7,4.7,.55,WHT[1]);
 if(!back)h.rect(9.85,22.4,.3,2.2,WHT[0]);                           // đường may giữa
 h.end(2,olWht);
 // khe hở giữa 2 ống quần (nền da/chân nối liền bên dưới)
 h.begin();h.rect(9.65,24.6,.7,.7,SK[1]);h.end(0);

 // phần da vai & ngực trên
 h.begin();
 h.rrect(5.1,14.6,9.8,3.4,1.2,(ux,uy)=>ux<7.0?SK[3]:ux>13.0?SK[1]:SK[2]);
 h.end(1,olSkin);

 // hai dây áo đen mảnh trên vai
 h.begin();
 h.rect(6.4,14.5,.85,2.6,BK[1]);
 h.rect(12.75,14.5,.85,2.6,BK[1]);
 h.end(1,olBlk);

 // thân áo hai dây đen xòe nhẹ
 h.begin();
 if(!back){
  h.poly([[5.4,16.6],[7.4,16.5],[10.0,17.4],[12.6,16.5],[14.6,16.6],[15.7,22.9],[4.3,22.9]],
   (ux,uy)=>uy<17.8?BK[2]:ux<6.8?BK[2]:ux>13.4?BK[0]:BK[1]);
 }else{
  h.poly([[5.4,16.6],[14.6,16.6],[15.7,22.9],[4.3,22.9]],
   (ux,uy)=>uy<17.5?BK[2]:ux<6.8?BK[2]:ux>13.4?BK[0]:BK[1]);
 }
 h.end(2,olBlk);
 // nếp xòe nhẹ trên thân áo
 h.begin();
 h.stroke(h.bez([7.5,18.4],[7.1,20.2],[6.8,21.6],[6.6,22.6]),.16,.12,()=>BK[3]);
 h.stroke(h.bez([12.5,18.4],[12.9,20.2],[13.2,21.6],[13.4,22.6]),.16,.12,()=>BK[0]);
 if(!back)h.stroke(h.bez([10.0,18.2],[10.0,20.2],[10.0,21.6],[10.0,22.6]),.15,.1,()=>BK[2]);
 h.end(0);
}
function femTorsoS(){
 h.begin();
 h.rrect(5.6,22.0,8.2,3.2,.8,(ux,uy)=>ux<7.5?WHT[3]:ux>12.0?WHT[1]:WHT[2]);
 h.rect(5.6,24.7,8.2,.55,WHT[0]);
 h.end(2,olWht);
 h.begin();h.rrect(6.2,14.6,6.8,3.2,1.1,(ux)=>ux<8.0?SK[3]:SK[2]);h.end(1,olSkin);
 h.begin();h.rect(9.3,14.5,.9,2.5,BK[1]);h.end(1,olBlk);
 h.begin();
 h.poly([[6.2,16.6],[13.0,16.6],[14.4,22.9],[5.0,22.9]],(ux,uy)=>uy<17.6?BK[2]:ux<7.4?BK[2]:ux>12.0?BK[0]:BK[1]);
 h.end(2,olBlk);
 h.begin();h.stroke(h.bez([9.8,18.2],[10.1,20.4],[10.4,21.8],[10.6,22.6]),.16,.1,()=>BK[2]);h.end(0);
}

// ---------- TAY ----------
function hand(cx,cy){h.begin();h.ell(cx,cy,1.35,1.25,(ux,uy,dx)=>dx>.35?SK[1]:SK[2]);h.end(2,olSkin)}
function armMaleF(x,ay,hi){
 if(hi!=null){
  const ty=17-hi;
  hand(x+1.8,ty+1.3);
  h.begin();h.rrect(x+.1,ty+2.0,3.4,5.4,1.0,(ux)=>ux<x+1.1?BK[2]:ux>x+2.6?BK[0]:BK[1]);h.rect(x+.1,ty+2.0,3.4,.6,BK[0]);h.end(2,olBlk);
  return;
 }
 hand(x+1.8,23.1+ay);
 h.begin();
 h.rrect(x+.1,14.7+ay,3.4,7.8,1.1,(ux,uy)=>uy<15.8+ay?BK[2]:ux<x+1.1?BK[2]:ux>x+2.6?BK[0]:BK[1]);
 h.rect(x+.1,21.7+ay,3.4,.7,BK[0]);
 h.end(2,olBlk);
}
function armFemF(x,ay,hi){
 if(hi!=null){
  const ty=17-hi;
  hand(x+1.75,ty+1.3);
  h.begin();h.rrect(x+.35,ty+2.0,2.8,5.4,1.0,(ux)=>ux<x+1.2?SK[3]:ux>x+2.3?SK[1]:SK[2]);h.end(2,olSkin);
  return;
 }
 hand(x+1.75,23.0+ay);
 h.begin();
 h.rrect(x+.35,14.8+ay,2.8,7.7,1.15,(ux,uy)=>uy<16+ay?SK[3]:ux<x+1.2?SK[3]:ux>x+2.3?SK[1]:SK[2]);
 h.end(2,olSkin);
}
function armMaleS(x,ay){
 hand(x+1.8,23.1+ay);
 h.begin();
 h.rrect(x+.1,14.8+ay,3.4,7.7,1.1,(ux,uy)=>uy<15.8+ay?BK[2]:ux<x+1.1?BK[2]:ux>x+2.6?BK[0]:BK[1]);
 h.rect(x+.1,21.7+ay,3.4,.7,BK[0]);
 h.end(2,olBlk);
}
function armFemS(x,ay){
 hand(x+1.75,23.0+ay);
 h.begin();
 h.rrect(x+.35,14.9+ay,2.8,7.6,1.1,(ux,uy)=>uy<16+ay?SK[3]:ux<x+1.2?SK[3]:ux>x+2.3?SK[1]:SK[2]);
 h.end(2,olSkin);
}

function buildBody(st){
 h.newFrame();
 const side=st.view=='s',back=st.view=='b',lg=st.lg,sit=st.sit,fem=st.fem;
 // chân + giày
 if(!st.rd){
  const L=(x,l,v)=>{
   if(fem){legFem(x,l);shoeFem(x-.3,27.3,v,l)}
   else{legMale(x,l);shoeMale(x-.1,27.3,v,l)}
  };
  if(sit||(!side&&lg==0)){L(5.4,0,back?'b':'f');L(10.6,0,back?'b':'f')}
  else if(!side){if(lg>0){L(10.6,0,back?'b':'f');L(5.4,1,back?'b':'f')}else{L(5.4,0,back?'b':'f');L(10.6,1,back?'b':'f')}}
  else{const s=lg*2;L(7.8-s,lg>0?1:0,'s');L(7.8+s,lg<0?1:0,'s')}
 }
 if(side){
  (fem?femTorsoS:maleTorsoS)();
  if(!st.noarm)(fem?armFemS:armMaleS)(8.1-lg,lg);
 }else{
  (fem?femTorsoF:maleTorsoF)(back);
  if(fem){armFemF(1.75,lg,st.aupL);armFemF(14.75,-lg,st.aupR)}
  else{armMaleF(1.65,lg,st.aupL);armMaleF(14.75,-lg,st.aupR)}
 }
 return h.frame();
}

// ---------- KÍNH NAM (chỉ vẽ gọng nâu đậm + điểm sáng nhẹ, giữ tròng rỗng để thấy rõ mắt & biểu cảm) ----------
function drawGlassesF(){
 h.begin();
 // viền tròng trái (6.15..9.45, y 10.65..13.45)
 h.rect(6.15,10.65,3.3,.42,GLS_D);
 h.rect(6.15,13.02,3.3,.42,GLS_D);
 h.rect(6.15,10.65,.42,2.78,GLS_D);
 h.rect(9.03,10.65,.42,2.78,GLS_D);
 // viền tròng phải (10.55..13.85, y 10.65..13.45)
 h.rect(10.55,10.65,3.3,.42,GLS_D);
 h.rect(10.55,13.02,3.3,.42,GLS_D);
 h.rect(10.55,10.65,.42,2.78,GLS_D);
 h.rect(13.43,10.65,.42,2.78,GLS_D);
 // cầu kính & 2 càng bên
 h.rect(9.38,11.38,1.24,.42,GLS_M);
 h.rect(5.7,11.35,.5,.4,GLS_M);
 h.rect(13.8,11.35,.5,.4,GLS_M);
 // nhấn sáng gọng trên + đốm sáng nhỏ góc kính
 h.rect(6.55,10.65,2.4,.22,GLS_L);
 h.rect(10.95,10.65,2.4,.22,GLS_L);
 h.rect(6.75,11.28,.38,.38,'#ffffff');
 h.rect(11.15,11.28,.38,.38,'#ffffff');
 h.end(0);
}
function drawGlassesS(){
 h.begin();
 // viền tròng nhìn ngang (10.55..13.85, y 10.65..13.45) + gọng dài ra tai
 h.rect(10.55,10.65,3.3,.42,GLS_D);
 h.rect(10.55,13.02,3.3,.42,GLS_D);
 h.rect(10.55,10.65,.42,2.78,GLS_D);
 h.rect(13.43,10.65,.42,2.78,GLS_D);
 h.rect(10.95,10.65,2.4,.22,GLS_L);
 h.rect(7.35,11.38,3.25,.42,GLS_M);
 h.rect(7.35,11.38,3.2,.2,GLS_L);
 h.rect(11.15,11.28,.38,.38,'#ffffff');
 h.end(0);
}

// ---------- TÓC NỮ (pixel thường: nâu socola gợn sóng rẽ ngôi giữa + khuyên tai vàng) ----------
const HF_PAL={d:'#55372a',b:'#6f4938',l:'#885f4a',h:'#a1765f',g:'#ffd23f'};
const HF_PIX={
 f:[
  '.......dddddd.......',
  '.....ddbhllhbdd.....',
  '....dbbllbbllbbd....',
  '....dbbbddddbbbd....',
  '...ddbbb....bbbdd...',
  '...dbbb......bbbd...',
  '..ddbb........bbdd..',
  '..dbbl........lbbd..',
  '..dbbg........gbbd..',
  '..ddbb........bbdd..',
  '..dbbb........bbbd..',
  '.ddbbl........lbbdd.',
  '.dbbbb........bbbbd.',
  '.dbblb........blbbd.',
  '.ddbb..........bbdd.',
  '..dbd..........dbd..',
  '...d............d...'
 ],
 b:[
  '.......dddddd.......',
  '.....ddbhllhbdd.....',
  '....dbbllbbllbbd....',
  '....dbbbbbbbbbbd....',
  '...ddbbbbbbbbbbdd...',
  '...dbbbblbblbbbbd...',
  '..ddbbbblbblbbbbdd..',
  '..dbbbbbbbbbbbbbbd..',
  '..dbblbbbbbbbblbbd..',
  '..ddbbbbbbbbbbbbdd..',
  '..dbbbbdbbbbdbbbbd..',
  '.ddbblbbbbbbbblbbdd.',
  '.dbbbbbbbbbbbbbbbbd.',
  '.dbblbbdbbbbdbblbbd.',
  '.ddbbddbbbbbbddbbdd.',
  '..dbd..dbbbbd..dbd..',
  '...d....d..d....d...'
 ],
 s:[
  '......ddddddd.......',
  '.....ddbhllhbdd.....',
  '....dbbllbbllbd.....',
  '...ddbbbbbbbbbd.....',
  '...dbbbbbbbbdd......',
  '..ddbbbbbbbd........',
  '..dbbbblbbd.........',
  '..dbbbbbbd..........',
  '..dbblbbdg..........',
  '..ddbbbbd...........',
  '..dbbbbbd...........',
  '.ddbbblbbd..........',
  '.dbbbbbbbd..........',
  '.dbblbbbbd..........',
  '.ddbbddbd...........',
  '..dbd..d............',
  '...d................'
 ]
};

// ---------- Cache + vẽ xuống canvas game ----------
const flipD=D=>{const W=h.W,H=h.H;for(let y=0;y<H;y++)for(let x=0;x<W>>1;x++){const a=(y*W+x)*4,b=(y*W+(W-1-x))*4;for(let k=0;k<4;k++){const t=D[a+k];D[a+k]=D[b+k];D[b+k]=t}}return D};
const CB={},CH={};
const getBody=st=>{const key=[st.fem?1:0,st.view,st.flip?1:0,st.lg,st.sit?1:0,st.rd?1:0,st.noarm?1:0,st.aupL,st.aupR].join('|');
 let c=CB[key];if(!c){let D=buildBody(st);if(st.flip)D=flipD(D);c=CB[key]=h.toCanvas(D)}return c};
const getMaleHair=(view,flip)=>{const key=view+'|'+(flip?1:0);
 let c=CH[key];if(!c){let D=view=='s'?hairMaleS():view=='b'?hairMaleB():hairMaleF();if(flip)D=flipD(D);c=CH[key]=h.toCanvas(D)}return c};
const bobOf=o=>{if(o.nobob)return 0;const f=o.mv?Math.floor(o.a*9)%4:0;return o.mv?((f==1||f==3)?-1:0):0};

// ---------- 1) Khai báo dữ liệu (chỉ thêm 1 lần, luôn ở CUỐI mảng) — bán Shop Phố xá 2.000 Xu/món ----------
if(!SETS.some(s=>s.k=='hbsetm'))SETS.push({n:'Set Hoài bão (Nam)',k:'hbsetm',fx:'hbset',hb:'m',xu:HB_GIA,boot:1,
 ds:'Áo khoác đen mở khóa ngoài áo thun xanh rêu, quần đen ống đứng, giày sneaker xanh than mũi trắng. Hợp với Tóc Hoài bão (Nam).',
 sh:'#1e2026',shl:'#2b2d36',shd:'#131418',scarf:'#1e2026',belt:'#16181e',pt:'#1e2026',rpt:'#1e2026',shoe:'#1c284f'});
if(!SETS.some(s=>s.k=='hbsetf'))SETS.push({n:'Set Hoài bão (Nữ)',k:'hbsetf',fx:'hbset',hb:'f',xu:HB_GIA,boot:0,
 ds:'Áo hai dây đen dáng xòe nhẹ, quần soóc trắng gọn gàng, giày sneaker trắng. Hợp với Tóc Hoài bão (Nữ).',
 sh:'#f1c08a',shl:'#fbd8aa',shd:'#d99e6a',scarf:'#f1c08a',belt:'#1e2026',pt:'#f5f7fb',rpt:'#f1c08a',shoe:'#f5f7fb'});
if(!HAIRS.some(x=>x.k=='hbhairm'))HAIRS.push({n:'Tóc Hoài bão (Nam)',k:'hbhairm',c:'#2e292c',xu:HB_GIA,
 ds:'Tóc nâu đen xù layer rối tự nhiên kèm kính gọng chữ nhật nâu đậm mảnh.'});
if(!HAIRS.some(x=>x.k=='hbhairf'))HAIRS.push({n:'Tóc Hoài bão (Nữ)',k:'hbhairf',c:'#6f4938',xu:HB_GIA,
 ds:'Tóc nâu socola gợn sóng dài rẽ ngôi giữa kèm đôi khuyên tai vuông vàng nhỏ.'});

// ---------- TÓC NAM (xù rối layer + kính chữ nhật) ----------
function hairMaleF(){
 h.newFrame();
 h.begin();
 mass(10,5.8,7.3,3.7,HM);
 // các chỏm tóc xù dựng quanh đỉnh & 2 bên thái dương
 lock([9.6,4.2],[10.2,2.2],[11.1,.5],[12.0,-.6],2.3,.16,HM,.85);       // chỏm cao hơi lệch phải như hình mẫu
 lock([7.4,4.5],[6.4,2.6],[5.2,1.4],[3.9,.9],2.1,.16,HM,.85);
 lock([11.8,4.5],[13.2,2.8],[14.6,1.8],[16.1,1.6],2.1,.16,HM,.85);
 lock([5.8,5.4],[4.3,4.2],[2.8,3.8],[1.7,4.2],1.9,.16,HM,.85);
 lock([14.2,5.4],[15.7,4.2],[17.2,3.8],[18.3,4.2],1.9,.16,HM,.85);
 lock([5.2,7.2],[3.8,7.0],[2.4,7.4],[1.5,8.3],1.8,.16,HM,.9);
 lock([14.8,7.2],[16.2,7.0],[17.6,7.4],[18.5,8.3],1.8,.16,HM,.9);
 lock([8.6,4.0],[8.2,2.2],[8.8,1.0],[9.8,.2],1.7,.15,HMB,.9);
 // tóc mai ôm nhẹ hai bên
 lockM([5.5,7.4],[5.0,9.0],[5.0,10.6],[5.5,11.9],1.3,.35,HM,.9);
 h.end(1,olHM);
 // mái tơi phủ trán (dừng ở y~9.4 để không che lông mày/mắt)
 [[[9.6,4.8],[8.8,6.4],[8.2,8.0],[7.8,9.2],1.5,.22],
  [[10.4,4.8],[10.4,6.6],[10.1,8.2],[9.9,9.4],1.4,.22],
  [[11.2,4.8],[11.8,6.4],[12.2,8.0],[12.1,9.2],1.5,.22],
  [[7.6,5.2],[6.7,6.8],[6.2,8.4],[6.0,9.6],1.4,.22],
  [[12.6,5.2],[13.5,6.8],[14.0,8.4],[14.1,9.5],1.4,.22]
 ].forEach(q=>{h.begin();lock(q[0],q[1],q[2],q[3],q[4],q[5],HM,.9);h.end(1,olHM)});
 drawGlassesF();
 return h.frame();
}
function hairMaleB(){
 h.newFrame();
 h.begin();
 mass(10,8.2,7.1,5.7,HMB);
 mass(10,5.8,7.3,3.7,HM);
 lock([9.6,4.2],[10.2,2.2],[11.1,.5],[12.0,-.6],2.3,.16,HM,.85);
 lock([7.4,4.5],[6.4,2.6],[5.2,1.4],[3.9,.9],2.1,.16,HM,.85);
 lock([11.8,4.5],[13.2,2.8],[14.6,1.8],[16.1,1.6],2.1,.16,HM,.85);
 lock([5.8,5.4],[4.3,4.2],[2.8,3.8],[1.7,4.2],1.9,.16,HM,.85);
 lock([14.2,5.4],[15.7,4.2],[17.2,3.8],[18.3,4.2],1.9,.16,HM,.85);
 lock([5.2,7.2],[3.8,7.0],[2.4,7.4],[1.5,8.3],1.8,.16,HM,.9);
 lock([14.8,7.2],[16.2,7.0],[17.6,7.4],[18.5,8.3],1.8,.16,HM,.9);
 // tỉa gọn gáy
 h.rrect(4.6,10.2,10.8,3.8,1.8,(ux,uy)=>uy>12.8?HMB[0]:ux<7.5?HMB[2]:HMB[1]);
 h.end(1,olHM);
 h.begin();
 lock([10,6.2],[9.8,8.8],[10,11.2],[10.1,13.2],.45,.14,HM.slice().reverse(),1);
 lock([7.2,7.0],[6.8,9.2],[7.0,11.4],[7.4,13.0],.45,.14,HM.slice().reverse(),1);
 lock([12.8,7.0],[13.2,9.2],[13.0,11.4],[12.6,13.0],.45,.14,HM.slice().reverse(),1);
 h.end(0);
 return h.frame();
}
function hairMaleS(){
 h.newFrame();
 h.begin();
 mass(9.1,5.9,6.8,3.8,HM);
 mass(5.8,8.8,3.8,4.6,HMB);
 lock([9.0,4.2],[9.6,2.2],[10.6,.5],[11.5,-.5],2.2,.16,HM,.85);
 lock([6.6,4.6],[5.2,2.8],[3.6,1.8],[2.0,2.0],2.0,.16,HM,.85);
 lock([5.0,6.6],[3.4,6.4],[2.0,7.2],[1.2,8.4],1.8,.16,HM,.9);
 lock([4.6,9.2],[3.4,10.2],[3.2,11.6],[3.8,13.0],1.6,.18,HMB,.9);
 lock([12.2,5.0],[13.8,4.4],[15.2,4.8],[16.2,5.8],1.7,.15,HM,.85);
 // tóc mai bên tai
 lock([7.3,7.6],[6.9,9.4],[7.0,11.0],[7.5,12.2],1.1,.25,HM,.9);
 h.end(1,olHM);
 [[[11.2,5.0],[12.6,6.2],[13.4,7.8],[13.8,9.2],1.5,.24],
  [[9.8,5.0],[11.0,6.4],[11.6,8.0],[11.5,9.4],1.35,.22],
  [[8.4,5.4],[9.2,6.8],[9.5,8.2],[9.2,9.5],1.25,.2]
 ].forEach(q=>{h.begin();lock(q[0],q[1],q[2],q[3],q[4],q[5],HM,.9);h.end(1,olHM)});
 drawGlassesS();
 return h.frame();
}

// ---------- 2) Lấy canvas game của nhân vật đang vẽ (bọc drawAv, không sửa code gốc) ----------
const TX={g:null,ox:0,oy:0};
if(typeof window.drawAv==='function'&&!window.drawAv.__hb){
 const old=window.drawAv;
 window.drawAv=function(g,ox,oy,o){
  const pg=TX.g,px=TX.ox,py=TX.oy;TX.g=g;TX.ox=ox;TX.oy=oy;
  try{return old.apply(this,arguments)}finally{TX.g=pg;TX.ox=px;TX.oy=py}};
 Object.keys(old).forEach(k=>{if(k.indexOf('__')==0)window.drawAv[k]=old[k]});
 window.drawAv.__hb=1;
}

// ---------- 3) Hàm vẽ: SET = thân + giày  |  TÓC NAM (HD + kính)  |  TÓC NỮ (pixel thường) ----------
SETFX.hbset=(u,o,S,K)=>{
 const g=TX.g;if(!g)return;
 const side=K.side,Rt=K.Rt,back=K.back,lg=K.lg>0?1:K.lg<0?-1:0;
 const st={fem:S.hb=='f',view:side?'s':back?'b':'f',flip:side&&!Rt,lg,sit:!!K.sit,rd:!!K.rd,noarm:!!(o.noarm&&side),
  aupL:o.aup&&o.aup[0]!=null?o.aup[0]:null,aupR:o.aup&&o.aup[1]!=null?o.aup[1]:null};
 h.drawTo(g,getBody(st),TX.ox,TX.oy+bobOf(o));
};
HAIRFX.hbhairm=(u,o,K)=>{
 const g=TX.g;if(!g)return;
 const side=K.side,Rt=K.Rt,back=K.back;
 h.drawTo(g,getMaleHair(side?'s':back?'b':'f',side&&!Rt),TX.ox,TX.oy+bobOf(o));
};
HAIRFX.hbhairf=(u,o,K)=>{
 const rows=K.side?HF_PIX.s:K.back?HF_PIX.b:HF_PIX.f,flip=K.side&&!K.Rt;
 for(let r=0;r<rows.length;r++){
  const s=rows[r],y=4+r;
  for(let x=0;x<s.length;x++){
   const ch=s.charAt(flip?19-x:x);
   if(ch!=='.')u(HF_PAL[ch],x,y,1,1);
  }
 }
};
})();
