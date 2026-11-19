/* ===================================================================================
   NEWITEMS2.JS — Đồ mới:
   • 🐰 Mascot Thỏ tuyết (Nam / Nữ)  — SETS (mascot:'bunny', bn:'m'|'f'), 5000 Xu / set, bán ở Shop Phố xá
   • 🔥 Mascot Ma đồng giáng thế     — SETS (mascot:'madong'),             💎15,       bán ở Shop kim cương
   • 🔱 Thương ma đồng               — ACCS (t:'hold', k:'maspear'),      400 Xu,     bán ở Shop Phố xá (tab Phụ kiện)
   • 🍰 Thú cưỡi Bánh ngọt           — MOUNTS (k:'cake'),                  💎20,       bán ở Shop kim cương
   • 🛞 Thú cưỡi Phong hỏa luân      — MOUNTS (k:'firewheel'),             💎10,       bán ở Shop kim cương
   Các món được khai báo ở CUỐI mảng SETS / ACCS / MOUNTS trong index.html (không làm lệch số thứ tự đồ đã mua).
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: Xu → pho-map.js (SHOP.s.pr / SHOP.a.pr), kim cương → dia:... trong index.html.
   Hai thú cưỡi là loại "bay – nhân vật ĐỨNG" (acc:1 → vẫn cầm được Thương ma đồng khi đứng trên thú cưỡi).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,abs=Math.abs,rnd=Math.round,flr=Math.floor;
const hash=n=>{const s=sin(n*127.1+311.7)*43758.5453;return s-flr(s)};
// ---------- tiện ích vẽ pixel (R = hàm vẽ hình chữ nhật) ----------
function ell(R,col,cx,cy,rx,ry){
 for(let y=flr(cy-ry);y<=Math.ceil(cy+ry);y++){const dy=(y+.5-cy)/ry;if(abs(dy)>1)continue;
  const hw=rnd(rx*Math.sqrt(1-dy*dy));if(hw>0)R(col,rnd(cx)-hw,y,hw*2,1)}}
function line(R,col,x0,y0,x1,y1){
 x0=rnd(x0);y0=rnd(y0);x1=rnd(x1);y1=rnd(y1);
 const n=Math.max(abs(x1-x0),abs(y1-y0),1);
 for(let k=0;k<=n;k++)R(col,rnd(x0+(x1-x0)*k/n),rnd(y0+(y1-y0)*k/n),1,1)}
function poly(R,pts,col){
 let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}
 y0=flr(y0);y1=Math.ceil(y1);
 for(let y=y0;y<y1;y++){const yc=y+.5,xs=[];
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
   if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
  xs.sort((p,q)=>p-q);
  for(let k=0;k+1<xs.length;k+=2){const xa=rnd(xs[k]),xb=rnd(xs[k+1]);if(xb>xa)R(col,xa,y,xb-xa,1)}}}
function star(R,x,y,a,rgb,big){
 x=rnd(x);y=rnd(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.75){R(c(a*.6),x-2,y,1,1);R(c(a*.6),x+2,y,1,1);R(c(a*.6),x,y-2,1,1);R(c(a*.6),x,y+2,1,1);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y,1,1)}}
const shadeC=(h,k)=>window.shade?shade(h,k):h;

// ===================================================================================
//  🐰 MASCOT THỎ TUYẾT — khung chuẩn MSTD 20x31 (u = vẽ theo màn hình, M = vẽ hướng phải & tự lật khi quay trái)
//  Nam: mũ thỏ trắng, tai cao hồng bên trong.  Nữ: giống hệt + hai bím tóc vàng kem rất to buông hai bên (rủ xuống gần chân).
// ===================================================================================
function drawBunny(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000,fem=S.bn=='f',mv=!!o.mv;
 const WH='#fbfcff',WL='#ffffff',WS='#dce5f5',WD='#b9c7e2',OL='#8c9cc0',
       PN='#ffc2d6',PD='#f58fb2',RB='#ff6fa8',RBL='#ffa8ca',
       IB='#bfe3ff',IBL='#ebf6ff',IBD='#7ab6e8',
       SK='#f1c08a',SKD='#d99e6a',
       EY='#4e333c',NS='#ff82a8',
       // tóc Nữ: vàng mật ong dịu; tóc Nam: nâu hạt dẻ gọn gàng
       HF='#f4cf82',HFL='#ffebb8',HFD='#cfa04e',
       HM='#5c4338',HML='#7d5e4f',HMD='#3c2922';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const sway=mv?rnd(sin(t*8)*.8):rnd(sin(t*1.8)*.5);

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---- chân gọn gàng + đệm thỏ hồng ----
 const leg=(x,lift)=>{
  const h=3-lift;
  r(WH,x,24,4,h);r(WL,x,24,1,h);r(WS,x+3,24,1,h);
  r(WH,x,27-lift,4,2);r(S.shoe||WD,x,29-lift,4,1);
  if(!side&&!back)r(PN,x+1,28-lift,2,1);
  if(side){const tx=Rt?x+4:x-1;r(WH,tx,28-lift,1,1);r(S.shoe||WD,tx,29-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---- tay áo trắng bông + cổ tay xanh băng (hỗ trợ giơ tay o.aup) ----
 const arm=(x,ay)=>{
  u(WH,x,15+ay,3,5);u(WL,x,15+ay,1,5);u(WS,x+2,15+ay,1,5);
  u(IB,x,20+ay,3,1);u(WH,x,21+ay,3,2);u(WD,x,22+ay,3,1);
 };
 const armUp=(x,h)=>{
  const ty=17-h;
  u(WH,x,ty,3,2);u(IB,x,ty+2,3,1);u(WH,x,ty+3,3,3);u(WS,x+2,ty+3,1,3);
 };

 // ---- lọn tóc Nữ hai bên vai (gọn gàng ngang ngực, KHÔNG to thô lủng lẳng tới chân) ----
 const girlLocks=(ph)=>{
  const d=mv?rnd(sin(t*7+ph)*.6):0;
  // lọn trái (x=4..5) & phải (x=14..15) ôm nhẹ dọc hai bên cổ áo
  u(HF,4,10,1,4);u(HF,15,10,1,4);
  u(HFL,4,11,1,1);u(HFL,15,11,1,1);
  u(HF,4+d,14,2,3);u(HFL,4+d,14,1,2);u(HFD,5+d,15,1,2);
  u(HF,14-d,14,2,3);u(HFL,14-d,14,1,2);u(HFD,15-d,15,1,2);
  u(HFD,4+d,17,1,1);u(HFD,15-d,17,1,1);
  // 2 nơ hồng pastel xinh trên vai tóc
  u(RB,4+d,13,2,1);u(RBL,4+d,13,1,1);
  u(RB,14-d,13,2,1);u(RBL,15-d,13,1,1);
 };

 if(!side){
  // ---- thân bộ đồ thỏ tuyết ----
  fill(WH,[[15,5,15],[16,4,16,7],[23,5,15]]);
  if(!rd)u(WH,6,24,8,1);
  u(WL,5,16,2,7);u(WS,14,16,2,7);u(WS,6,23,8,1);
  if(back){
   // đuôi bông tròn trắng xù sau lưng
   u(WL,8,20,4,3);u(WH,9,19,2,1);u(WS,8,23,4,1);u(OL,7,21,1,2);u(OL,12,21,1,2);
   u(WD,6,14,8,1);
   if(fem){
    // 2 lọn tóc vàng nhỏ thắt nơ hồng ló nhẹ dưới vành mũ sau gáy
    u(HF,5,13,2,4);u(HFL,5,14,1,2);u(HFD,6,16,1,1);
    u(HF,13,13,2,4);u(HFL,13,14,1,2);u(HFD,14,16,1,1);
    u(RB,5,13,2,1);u(RB,13,13,2,1);
   }
  }else{
   // cổ áo xanh băng + bụng kem trắng + chi tiết riêng Nam/Nữ
   u(IBL,6,14,8,1);u(IB,6,15,8,1);
   u(WL,7,16,6,6);u(WS,8,21,4,1);
   if(fem){
    u(RB,9,15,2,1);u(RBL,9,15,1,1);u(PD,9,16,1,1);u(PD,10,16,1,1); // nơ hồng trước cổ
    u(IB,9,18,2,1);u(IBL,9,17,1,1);
   }else{
    u(IBD,9,15,2,1);u(IB,8,17,4,1);u(IB,9,16,2,3);u(IBL,9,17,1,1); // bông tuyết xanh băng
   }
  }
  if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0]):arm(2,lg);armUp(15,o.aup[1])}
  else{arm(2,lg);arm(15,-lg)}
  if(fem&&!back)girlLocks(0);

  // ---- đôi tai thỏ dài mềm mại (y=-3..5) ----
  const ear=(sgn)=>{
   const m=(c,x,y,w,h)=>sgn<0?u(c,x,y,w,h):u(c,20-x-w,y,w,h),tw=sgn<0?sway:-sway;
   const E2=[[-2,4,6],[-1,4,6],[0,4,7],[1,4,7],[2,4,7],[3,5,7],[4,5,7],[5,5,7]];
   m(OL,4+tw,-3,2,1);
   E2.forEach(([y,x0,x1],i)=>{
    const ox=i<3?tw:0;
    m(OL,x0-1+ox,y,1,1);m(WH,x0+ox,y,x1-x0+1,1);m(WL,x0+ox,y,1,1);m(WS,x1+ox,y,1,1);
   });
   if(!back){
    m(PD,5+tw,-1,1,1);m(PN,5+tw,0,1,2);m(PN,5,2,1,2);m(PD,6,3,1,2);m(PN,5,4,1,1);
   }
  };
  ear(-1);ear(1);

  // ---- mũ trùm đầu thỏ tuyết ----
  fill(WH,MSTD.HF);
  u(WL,6,4,5,1);u(WL,4,5,2,2);u(WL,3,7,1,3);
  SY(WS,15,6,1,6);u(WS,4,12,12,1);u(WD,6,13,8,1);
  if(back){
   u(WS,5,9,10,1);u(WD,6,10,8,1);
  }else{
   // mặt thỏ nhỏ nhắn dễ thương trên trán mũ (mắt tròn + mũi hồng tí hon)
   SY(EY,6,5,1,2);SY(WL,6,5,1,1);
   u(NS,9,6,2,1);u(PN,8,7,1,1);u(PN,11,7,1,1);
   // khung mặt người viền lông sáng
   u(WL,6,7,8,1);SY(WL,5,8,1,1);SY(WL,4,9,1,4);
   fill(SK,[[8,6,14],[9,5,15,4],[13,6,14]]);
   u(SKD,6,13,8,1);u(SKD,5,12,1,1);u(SKD,14,12,1,1);
   // tóc bên trong mũ: Nữ mái vàng tỉa gọn rẽ nhẹ; Nam mái nâu gọn
   if(fem){
    u(HF,6,8,8,1);u(HFL,7,8,3,1);u(HFL,11,8,2,1);
    u(HF,5,9,3,1);u(HF,12,9,3,1);u(HFD,8,9,1,1);u(HFD,11,9,1,1);
    u(HF,5,10,1,2);u(HF,14,10,1,2);
   }else{
    u(HM,6,8,8,1);u(HML,7,8,4,1);
    u(HM,5,9,2,1);u(HMD,8,9,1,1);u(HM,10,9,1,1);u(HM,13,9,2,1);
    u(HM,5,10,1,2);u(HM,14,10,1,2);
   }
   // khuôn mặt & biểu cảm chuẩn người chơi
   if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,0,0);
   else if(typeof faceDef==='function')faceDef(u,0,0);
  }
 }else{
  // ---- nhìn ngang (vẽ hướng PHẢI, M tự lật khi quay TRÁI) ----
  M(WL,3,20,3,3);M(WS,3,22,3,1);                                   // đuôi bông phía sau
  fill(WH,[[15,6,14],[16,5,15,7],[23,6,14]]);
  if(!rd)M(WH,7,24,7,1);
  M(WL,6,16,2,7);M(WS,13,16,2,7);M(WD,6,14,7,1);
  M(IBL,7,14,6,1);M(IB,10,15,4,1);
  if(fem)M(RB,13,15,2,1);

  // đôi tai thỏ nhìn ngang
  const tw=sway;
  M(OL,4+tw,-3,2,1);
  for(let y=-2;y<=5;y++){const x0=y<=1?3:4,ox=y<=0?tw:0;M(OL,x0-1+ox,y,1,1);M(WH,x0+ox,y,3,1);M(WS,x0+2+ox,y,1,1)}
  M(OL,8-tw,-3,2,1);
  for(let y=-2;y<=5;y++){const x0=y<=1?7:8,ox=y<=0?-tw:0;M(OL,x0-1+ox,y,1,1);M(WH,x0+ox,y,3,1);M(WL,x0+ox,y,1,1);M(WS,x0+2+ox,y,1,1);if(y>=-1&&y<=4)M(PN,x0+1+ox,y,1,1)}

  // mũ trùm nhìn ngang
  fill(WH,MSTD.HS,1);M(WL,4,7,2,3);M(WS,4,12,10,1);M(WD,6,13,7,1);
  M(EY,12,5,1,2);M(WL,12,5,1,1);M(NS,14,6,1,1);                   // mắt & mũi thỏ trên mũ
  M(WL,8,7,6,1);M(WL,7,8,1,5);
  fill(SK,[[8,9,14],[9,8,15,4],[13,9,14]],1);
  M(SKD,9,13,5,1);

  if(fem){
   M(HF,9,8,5,1);M(HFL,10,8,3,1);M(HF,8,9,3,1);M(HF,13,9,1,1);
   M(HF,8,10,2,3);M(HF,7,12,2,4);M(HFL,8,13,1,2);M(HFD,7,16,2,1); // lọn tóc vàng buông gọn ngang vai
   M(RB,8,12,2,1);M(RBL,8,12,1,1);
  }else{
   M(HM,9,8,5,1);M(HML,10,8,3,1);M(HM,8,9,2,1);M(HM,13,9,1,1);
   M(HM,8,10,1,2);
  }

  if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,1,Rt);
  else if(typeof faceDef==='function')faceDef(u,1,Rt);

  const am=rnd(lg);
  if(!o.noarm){
   M(WH,8+am,15,3,5);M(WL,8+am,15,1,5);M(WS,10+am,15,1,5);
   M(IB,8+am,20,3,1);M(WH,8+am,21,3,2);M(WD,8+am,22,3,1);
  }
 }
}
window.drawMascotBunny=drawBunny;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.bunny=drawBunny;

// ===================================================================================
//  🔥 MASCOT MA ĐỒNG GIÁNG THẾ (ý tưởng Na Tra) — PHIÊN BẢN VẼ LẠI (v2), theo QUY-TAC-VE-SET.md
//  • Đầu/tóc vẽ bằng BẢN ĐỒ PIXEL (HF trước · HB sau · HS ngang) — tóc đen là các lọn cong, bất đối xứng, cùng nghiêng một hướng gió,
//    3 tông (ngọn tím sáng → gốc đen), viền đậm. Không còn gai tam giác.
//  • Mặt: mắt đỏ viền khói đen, mày dựng, ngọn lửa đỏ giữa trán, tai nhọn, vằn đỏ hai bên mắt. Mắt/mũi/miệng vẽ bằng code
//    và giữ đúng toạ độ chuẩn nên biểu cảm faceFx của game vẫn khớp.
//  • Thân trần có cơ, vòng cổ vàng + ngọc đỏ, vòng tay vàng, đai đỏ, váy nâu viền lửa, chân trần buộc vòng vàng + dép.
//  • Dải lụa đỏ: CHỈ 2 sợi mảnh 1px bay PHÍA SAU người (không còn quấn quanh người / che mặt).
//  Muốn chỉnh tóc/đầu: sửa các mảng HF / HB / HS (mỗi ký tự = 1 pixel, bảng màu ở MD_PAL; giữ nguyên số cột mỗi hàng).
//  Khai báo trong SETS (index.html) giữ nguyên: mascot:'madong', wide:1. Cầm tay: Thương ma đồng (ACCS) • Thú cưỡi: Phong hỏa luân (MOUNTS).
// ===================================================================================
const MD_SKN='#f3bd92',MD_SKL='#ffd9b8',MD_SKS='#d1926a',MD_SKX='#a8664a',
 MD_RD='#d8263a',MD_RDL='#ff5a70',MD_RDD='#8f1228',MD_RDX='#4e0914',
 MD_GD='#f6c84a',MD_GDL='#fff1a8',MD_GDD='#b8861c',MD_GDX='#6e4a10',
 MD_BRN='#4a2a2a',MD_BRL='#704034',MD_BRD='#2e1818',
 MD_FL1='#e2452a',MD_FL2='#ff9a2e',MD_FL3='#ffd34d',
 MD_RB='#d81f4a',MD_RBL='#ff6a88',MD_RBD='#9a1236',
 MD_EYE='#e8283e',MD_EYL='#ff8a8a',MD_DK='#1a1624',MD_WH='#ffffff';
// ký tự trong bản đồ → màu ('.' = trong suốt)
const MD_PAL={X:'#0a0810',D:'#1a1624',H:'#2e2840',L:'#4f4a72',W:'#9a94c8',
 s:MD_SKN,S:MD_SKL,t:MD_SKS,u:MD_SKX,R:MD_RD,r:MD_RDL,q:MD_RDD,G:MD_GD,g:MD_GDL,d:MD_GDD,k:MD_GDX};
// ===================================================================================
//  BẢN ĐỒ PIXEL ĐẦU — {x,y} = góc trên-trái. X viền · D/H/L/W tóc (đậm → vừa → sáng → ngọn) · s/S/t/u da · R/r/q đỏ.
const HF={x:-3,y:-9,rows:[
 "............................",
 ".................X..........",
 "...............XXWX.........",
 "..............XLWDX.........",
 "..........X..XLLHX..........",
 ".........XWX.XLHDX..........",
 ".......XXLHXXLHHX....X......",
 "......XWLHDXLLHDX...XWX.....",
 ".....XLDLHDXLHHDX..XLDX.....",
 "....XLHXLHDXLHHDX.XLHX......",
 "....XLHXLHDLLHHDXXLHDX......",
 "....XHDLLHDHHHHDXLHHDX.X....",
 "...XLHDLHHDHHHHDHHHDX.XWX...",
 "...XLHHHHHHHHHHDDHHDXXXHX...",
 "...XLHHDHHHHHHHDDHDXXLLHX...",
 "....XDHHHHLLsrLLHHHDDLHX....",
 "....XHDHLLSSRqssLHHDHHDX....",
 "....XsLHSSssssssssHDtDX.....",
 "....XssHsSssssssstDssX......",
 ".....XsDssssssssstDtX.......",
 "......XDssssssssstDX........",
 "......XDssssssssstDX........",
 ".......XXstsssstsXX.........",
 ".........XttttttX..........."
]};
const HB={x:-3,y:-9,rows:[
 "............................",
 ".................X..........",
 "...............XXWX.........",
 "..............XLWDX.........",
 "..........X..XLLHX..........",
 ".........XWX.XLHDX..........",
 ".......XXLHXXLHHX....X......",
 "......XWLHDXLLHDX...XWX.....",
 ".....XLDLHDXLHHDX..XLDX.....",
 "....XLHXLHDXLHHDX.XLHX......",
 "....XLHXLHDLLHHDXXLHDX......",
 "....XHDLLHDHHHHDXLHHDX.X....",
 "...XLHDLHHDHHHHDHHHDX.XWX...",
 "...XLHHHHHHHHHHDDHHDXXXHX...",
 "...XLHHDHHHHHHHDDHDXXLLHX...",
 "....XHHHHHHHHHHHDHDHLLHX....",
 "....XHHHHLHHHHHLHDDHHHDX....",
 "....XsHHHHHDHHHHHHHHtDX.....",
 "....XssHHHHDHHDHDHDssX......",
 ".....XtHHHLHDHDHDHHtX.......",
 "......XHHHHHDHHHHHHX........",
 ".......XHDHHDHHDHHX.........",
 "........XDDDDDDDDX..........",
 ".........XDDXXDDX..........."
]};
const HS={x:-6,y:-9,rows:[
 "..........................",
 "........XXX...............",
 ".......XWWDXX.............",
 "........XWWHDX............",
 ".........XLWHDX...........",
 "..........XLDHDX..........",
 "..........XLHHHDX.........",
 "..........XLHDHHDX........",
 "...........XLHHHHDX.......",
 ".XXXX......XLHDHHDX.......",
 "XWWHDXXX...XLHDHHDX.......",
 ".XLLHHDDXXXXHHHHHHDX......",
 "..XXLLHHHDDXHHHDHHDX......",
 "....XLLHHHHDHHHDHHDXXX....",
 ".....XLLLHHHDHHHLLHHDDX...",
 "......XLHHHHHHHHLHHHHDDX..",
 ".......XLHHHHHHHHLHHRDDDX.",
 ".....XXXDHHHHHstHSSsssXX..",
 "..XXXDDDHHHHHHssDSssstX...",
 ".XDHHHHHHHHHHHttDsssstsX..",
 ".XLLLLLLHHHHHHHHDsssstsX..",
 "..XXXXXXXXXHHHHHDsssstX...",
 "...........XHHHHHsssssX...",
 "............XXXXXttttX...."
]};

function mdStamp(U,m){
 m.rows.forEach((row,ri)=>{
  for(let c=0;c<row.length;c++){
   const ch=row[c];if(ch==='.')continue;
   let e=c;while(e+1<row.length&&row[e+1]===ch)e++;
   U(MD_PAL[ch],m.x+c,m.y+ri,e-c+1,1);
   c=e}})}

// ---------- tiện ích vẽ pixel ----------
// ---------- DẢI LỤA MẢNH 1px (fn(s,ph) → [x,y], s=0..1) — vẽ PHÍA SAU người ----------
function mdRibbon(R,fn,n,ph){
 const P=[];for(let i=0;i<=n;i++)P.push(fn(i/n,ph));
 for(let i=0;i<=n;i++){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(MD_RBD,x,y+1,1,1)}
 for(let i=0;i<=n;i++){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(MD_RB,x,y,1,1)}
 for(let i=1;i<=n;i+=3){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(MD_RBL,x,y,1,1)}
 const e=P[n],ex=rnd(e[0]),ey=rnd(e[1]);                                   // tua vàng nhỏ ở đầu dải
 R(MD_GDD,ex,ey,2,2);R(MD_GD,ex,ey,2,1);R(MD_GDL,ex,ey,1,1)}
// bling ĐỎ RƯỢU nhẹ: vài tia sáng nhỏ lấp lánh quanh người (không che mặt)
function mdBling(R,t,mv){
 for(let i=0;i<8;i++){
  const P=1.9+(i%5)*.45,ph=((t/P)+i*.31)%1,ang=i*2.399+t*.35*(i%2?1:-1);
  const Rr=8+((i*37)%7),x=10+Rr*cos(ang),y=26-ph*34+sin(t*3+i)*1.2;
  const a=Math.min(1,ph*5,(1-ph)*2.2);if(a<.12)continue;
  if(x>2&&x<18&&y>4&&y<17)continue;
  star(R,x,y,a,i%2?'214,56,92':'150,20,48',i%3==0)}}

// ===================================================================================
function drawMaDong(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000,mv=!!o.mv,amp=mv?1.6:1;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 if(!sit&&!rd)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---- 2 sợi lụa đỏ mảnh PHÍA SAU người (đứng yên: lượn nhẹ; đi: bay ngược ra sau) ----
 const RLx=(c,x,y,w,h)=>u(c,x,y,w,h),RRx=(c,x,y,w,h)=>u(c,20-x-w,y,w,h);
 const ribA=(s,ph)=>[4-20*s-(mv?4*s:0)+sin(t*2.4*amp+s*7+ph)*2*s,17-13*s+cos(t*2+s*5+ph)*1.8*s];        // sợi trái: bay lên ngoài vai
 const ribB=(s,ph)=>[4-18*s-(mv?4*s:0)+sin(t*2.7*amp+s*6+ph)*2*s,19+9*s+cos(t*2.2+s*4+ph)*1.6*s];   // sợi phải: buông xuống ngoài hông
 const ribS1=(s,ph)=>[5-26*s-(mv?10*s:0),16+2*s+sin(t*2.8*amp+s*6+ph)*(.5+2.2*s)];
 const ribS2=(s,ph)=>[5-22*s-(mv?9*s:0),21+4*sin(s*PI*.8)+sin(t*2.5*amp+s*5+ph+1.7)*(.4+2*s)];
 if(!side){mdRibbon(RLx,ribA,40,0);mdRibbon(RRx,ribB,36,1.9)}
 else{mdRibbon(M,ribS1,46,0);mdRibbon(M,ribS2,40,2.2)}

 // ---- chân trần + vòng chân vàng + dép ----
 const leg=(x,lift)=>{r(MD_SKN,x,24,4,5-lift);r(MD_SKL,x,24,1,5-lift);r(MD_SKS,x+3,24,1,5-lift);r(MD_GD,x,27-lift,4,1);r(MD_GDL,x,27-lift,1,1);r(MD_GDD,x+3,27-lift,1,1);r(S.shoe,x,29-lift,4,1);r(MD_GD,x,29-lift,1,1)};
 if(rd){}
 else if(sit)leg(5,0),leg(11,0);
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 if(!side){
  // ======================= NHÌN TRƯỚC / SAU =======================
  // thân trần: nền da + ánh sáng bên trái, bóng bên phải
  u(MD_SKN,6,14,8,1);u(MD_SKN,4,15,12,9);
  u(MD_SKL,4,15,1,8);u(MD_SKL,5,16,1,5);u(MD_SKS,14,15,2,9);u(MD_SKX,15,16,1,7);
  if(!back){
   u(MD_SKL,6,16,3,1);u(MD_SKL,10,16,3,1);                                   // đỉnh ngực sáng
   u(MD_SKS,6,19,4,1);u(MD_SKS,10,19,4,1);u(MD_SKS,9,17,2,1);u(MD_SKS,9,18,1,5);   // dưới ngực + rãnh giữa
   u('#c97a60',7,18,1,1);u('#c97a60',12,18,1,1);
   u(MD_SKS,7,21,2,1);u(MD_SKS,11,21,2,1);u(MD_SKL,7,20,1,1);u(MD_SKL,11,20,1,1);u(MD_SKS,8,23,4,1);   // múi bụng
   u(MD_RD,4,16,2,1);u(MD_RDD,5,17,1,1);u(MD_RD,14,16,2,1);u(MD_RDD,14,17,1,1);u(MD_RD,6,15,1,1);u(MD_RD,13,15,1,1);   // vằn đỏ trên vai
   // vòng cổ vàng + ngọc đỏ
   u(MD_GD,6,14,8,1);u(MD_GDL,6,14,2,1);u(MD_GDD,12,14,2,1);
   u(MD_GDD,7,15,6,1);u(MD_GD,8,15,1,1);u(MD_GD,11,15,1,1);u(MD_GD,9,15,2,1);
   u(MD_RD,9,16,2,2);u(MD_RDL,9,16,1,1);u(MD_RDD,10,17,1,1);u(MD_GDD,9,18,2,1);
  }else{
   u(MD_SKS,9,15,2,8);u(MD_SKL,6,16,2,3);u(MD_SKL,12,16,2,3);u(MD_SKS,6,19,3,1);u(MD_SKS,11,19,3,1);   // xương sống + bả vai
   u(MD_SKS,7,21,2,1);u(MD_SKS,11,21,2,1);
   u(MD_GD,6,14,8,1);u(MD_GDD,7,15,6,1);
   u(MD_RD,4,16,2,1);u(MD_RD,14,16,2,1);
  }
  // đai đỏ + khóa vàng
  u(MD_RD,4,22,12,2);u(MD_RDL,4,22,12,1);u(MD_RDD,4,23,12,1);u(MD_RDX,14,22,2,2);
  if(!back){u(MD_GD,9,22,2,2);u(MD_GDL,9,22,1,1);u(MD_GDD,10,23,1,1)}
  else{u(MD_RDD,8,22,4,1);u(MD_RDX,9,23,2,1)}
  // váy nâu viền lửa
  u(MD_BRN,4,24,12,3);u(MD_BRL,5,24,2,3);u(MD_BRL,9,24,2,2);u(MD_BRD,14,24,2,3);u(MD_BRD,8,25,1,2);u(MD_BRD,12,25,1,2);
  for(let x=4;x<16;x++){u(x%2?MD_FL1:MD_FL2,x,27,1,1);if(x%2==0)u(MD_FL3,x,26,1,1);if(x%4==1)u(MD_FL1,x,28,1,1)}
  // tay: vòng tay vàng + cổ tay vàng
  const arm=(x,ay)=>{
   u(MD_SKN,x,16+ay,3,6);u(MD_SKL,x,16+ay,1,6);u(MD_SKS,x+2,16+ay,1,6);
   u(MD_GD,x,17+ay,3,2);u(MD_GDL,x,17+ay,1,1);u(MD_GDD,x,18+ay,3,1);
   u(MD_GDD,x,21+ay,3,1);
   u(MD_SKN,x,22+ay,3,1);u(MD_SKL,x,22+ay,1,1)};
  arm(1,lg);arm(16,-lg);
  // đầu
  mdStamp(u,back?HB:HF);
  if(!back){
   const bl=(performance.now()%4100)<130;
   if(o.e>0)faceFx(u,o.e,0,0);
   else{
    // mày dựng, mắt đỏ viền khói đen, vằn đỏ hai bên mắt
    u(MD_DK,5,9,3,1);u(MD_DK,12,9,3,1);u(MD_DK,8,10,1,1);u(MD_DK,11,10,1,1);
    if(bl){u(MD_DK,6,11,3,1);u(MD_DK,11,11,3,1)}
    else{
     u(MD_DK,6,10,2,1);u(MD_DK,12,10,2,1);
     u(MD_WH,6,11,1,1);u(MD_EYE,7,11,1,1);u(MD_DK,8,11,1,1);
     u(MD_DK,11,11,1,1);u(MD_EYE,12,11,1,1);u(MD_WH,13,11,1,1);
     u(MD_RDD,6,12,1,1);u(MD_EYE,7,12,2,1);u(MD_EYE,11,12,2,1);u(MD_RDD,13,12,1,1);
    }
    u(MD_RD,5,11,1,2);u(MD_RD,14,11,1,2);   // vằn đỏ
    u(MD_SKS,9,12,2,1);u(MD_SKX,9,12,1,1);                                        // mũi
    u('#a8523f',8,13,4,1);u(MD_WH,11,13,1,1);                                     // miệng nhếch lộ nanh
   }
  }
 }else{
  // ======================= NHÌN NGANG (hướng phải) =======================
  M(MD_SKN,6,14,7,1);M(MD_SKN,5,15,9,9);
  M(MD_SKL,5,15,1,8);M(MD_SKL,6,16,1,5);M(MD_SKS,13,15,1,9);M(MD_SKX,13,17,1,6);
  M(MD_SKL,10,16,2,1);M(MD_SKS,10,19,3,1);M('#c97a60',12,18,1,1);M(MD_SKS,11,21,2,1);M(MD_SKL,11,20,1,1);M(MD_SKS,10,23,3,1);
  M(MD_RD,5,16,2,1);M(MD_RDD,6,17,1,1);
  M(MD_GD,6,14,7,1);M(MD_GDL,6,14,2,1);M(MD_GDD,11,14,2,1);M(MD_GDD,8,15,4,1);M(MD_GD,12,15,1,1);
  M(MD_RD,12,16,1,2);M(MD_RDL,12,16,1,1);M(MD_GDD,12,18,1,1);
  M(MD_RD,4,22,10,2);M(MD_RDL,4,22,10,1);M(MD_RDD,4,23,10,1);M(MD_GD,11,22,2,2);M(MD_GDL,11,22,1,1);
  M(MD_BRN,5,24,9,3);M(MD_BRL,6,24,2,3);M(MD_BRL,10,24,2,2);M(MD_BRD,12,24,2,3);
  for(let x=5;x<14;x++){M(x%2?MD_FL1:MD_FL2,x,27,1,1);if(x%2==0)M(MD_FL3,x,26,1,1);if(x%4==1)M(MD_FL1,x,28,1,1)}
  const am=rnd(lg);
  M(MD_SKN,8+am,16,3,6);M(MD_SKL,8+am,16,1,6);M(MD_SKS,10+am,16,1,6);
  M(MD_GD,8+am,17,3,2);M(MD_GDL,8+am,17,1,1);M(MD_GDD,8+am,18,3,1);M(MD_GDD,8+am,21,3,1);
  M(MD_SKN,8+am,22,3,1);M(MD_SKL,8+am,22,1,1);
  mdStamp(M,HS);
  const bl=(performance.now()%4100)<130;
  if(o.e>0)faceFx(u,o.e,1,Rt);
  else{
   M(MD_DK,10,9,4,1);M(MD_DK,10,10,1,1);                                           // mày dựng
   if(bl)M(MD_DK,11,11,3,1);
   else{M(MD_DK,11,10,3,1);M(MD_WH,11,11,1,1);M(MD_EYE,12,11,1,1);M(MD_DK,13,11,1,1);M(MD_RDD,11,12,3,1);M(MD_EYE,12,12,1,1)}
   M(MD_RD,10,11,1,2);M(MD_RD,14,10,1,1);                                          // vằn đỏ
   M('#a8523f',12,13,2,1);M(MD_WH,13,13,1,1);                                      // miệng
  }
 }
 mdBling(u,t,mv);
}
window.drawMascotMaDong=drawMaDong;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.madong=drawMaDong;

// ===================================================================================
//  🔱 THƯƠNG MA ĐỒNG — giáo vàng mỏng, dài, hơi nghiêng; mũi giáo lá + trăng khuyết, tua đỏ bay, ánh vàng chạy dọc cán.
//  (t:'hold' trong ACCS — art(P): P.R(màu,dx,y,w,h) vẽ tương đối bàn tay; P.hy = y bàn tay)
// ===================================================================================
function accMaSpear(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy;
 const GD='#f6c84a',GDD='#b8861c',GDL='#fff1a8',RD='#e0243a',RDD='#9a1228',lean=.1;
 const ox=y=>rnd((hy-y)*lean);
 // cán vàng: 1px sáng + 1px tối, đai vàng đậm mỗi 9px, ánh sáng chạy dọc cán
 const top=hy-27,bot=hy+8,glint=flr((t*14)%36);
 for(let y=bot;y>=top;y--){const x=ox(y),i=bot-y;
  R(GDD,x+1,y,1,1);R(GD,x,y,1,1);
  if(i%9==4){R(GDD,x-1,y,3,1);R(GDL,x,y,1,1)}
  if(i==glint||i==glint-1)R('#ffffff',x,y,1,1)}
 R('#7a5410',ox(bot)-0,bot+1,2,1);                                     // đuôi giáo
 // mũi giáo hình lá (cao 11) + hai vấu trăng khuyết
 const bx=ox(top),ty=top-11;
 const rows=[[0,1],[1,1],[2,3],[3,3],[4,3],[5,5],[6,5],[7,3],[8,3],[9,5]];
 rows.forEach(([i,w])=>{const x0=bx-flr(w/2);R(GDD,x0+w-1,ty+i,1,1);R(GD,x0,ty+i,w-1>0?w-1:1,1);if(w>1)R(GDL,x0,ty+i,1,1)});
 R(GDL,bx,ty,1,2);R('#ffffff',bx,ty+3,1,1);
 R(GD,bx-3,ty+7,1,2);R(GD,bx+3,ty+7,1,2);R(GDD,bx-3,ty+9,1,1);R(GDD,bx+3,ty+9,1,1);       // trăng khuyết hai bên
 R(GDD,bx-2,ty+10,5,1);R(GD,bx-2,ty+10,2,1);R(RD,bx,ty+10,1,1);                          // đai cổ mũi giáo
 // tua đỏ bay
 for(let i=0;i<5;i++){const sw=rnd(sin(t*5+i*.9)*(i*.5+.3));R(i%2?RDD:RD,bx+sw,ty+11+i,i<2?2:1,1)}
 for(let i=0;i<4;i++){const sw=rnd(sin(t*5.5+i+1)*(i*.5+.3));R(i%2?RD:RDD,bx+1+sw,ty+11+i,1,1)}
 if(sin(t*3)>.5){R('#ffffff',bx,ty-1,1,1);R('rgba(255,241,168,.7)',bx-1,ty,1,1);R('rgba(255,241,168,.7)',bx+1,ty,1,1)}
}
window.accMaSpear=accMaSpear;

// ===================================================================================
//  🐾 CHÂN ĐỨNG chung cho 2 thú cưỡi "bay": người ĐỨNG trên mặt thú cưỡi (seat y = -19, chân chạm y = -13)
//  Vẽ ở lớp sau (pt=0), người vẽ đè lên. Màu: rpt / shoe của set đang mặc.
// ===================================================================================
function standLegs(RR,d,S,mv,t){
 const PT=S.rpt||S.pt||'#444',SD=S.shoe||'#222',sy=-19,sh=shadeC(PT,-.2);
 if(d>1){ // nhìn ngang: 2 chân chụm
  const st=mv?(flr(t*5)%2?1:0):0;
  RR(sh,-4,sy,3,4);RR(PT,-4,sy,2,4);RR(SD,-4,sy+4,4,2);
  RR(PT,0+st,sy,3,4);RR(shadeC(PT,.25),0+st,sy,1,4);RR(SD,0+st,sy+4,5,2)
 }else{
  RR(PT,-5,sy,4,4);RR(shadeC(PT,.25),-5,sy,1,4);RR(sh,-2,sy,1,4);RR(SD,-5,sy+4,4,2);
  RR(PT,1,sy,4,4);RR(shadeC(PT,.25),1,sy,1,4);RR(sh,4,sy,1,4);RR(SD,1,sy+4,4,2)}
}

// ===================================================================================
//  🍰 THÚ CƯỠI BÁNH NGỌT — bệ bánh quy lơ lửng (cách đất ~3px, bóng mờ dưới đất), người ĐỨNG giữa bệ.
//  Có: cupcake xanh ngọc, bánh cuộn caramel (bánh quy sô-cô-la hình trái tim, cửa kẹo xanh), kẹo mút, gậy kẹo đường nơ đỏ, kẹo bọc bay quanh.
//  Hệ tọa độ thú cưỡi: gốc (0,0) = mặt đất giữa, y âm = lên, x dương = hướng đầu (R tự lật khi quay trái). pt=0: lớp sau người, pt=1: lớp trước.
// ===================================================================================
window.cakeHov=function(t,mv){return mv?-Math.round(1+sin(t*7)*.9):-Math.round(1.4+sin(t*2.2)*1.1)};
function cakeCupcake(RR,cx,by){
 const W=[12,12,11,11,10,9];
 for(let i=0;i<6;i++){const y=by-6+i,w=W[i],x=cx-flr(w/2);
  RR(i==5?'#2c9488':'#4fd1c1',x,y,w,1);
  for(let k=0;k<w;k+=2)RR(i==0?'#8eeadf':'#38b3a4',x+k+1,y,1,1)}
 RR('#8eeadf',cx-6,by-6,12,1);
 ell(RR,'#a8621f',cx,by-8,7,4);ell(RR,'#d58a3a',cx,by-9,6.5,3.6);ell(RR,'#e9aa5c',cx-1,by-10,4,2);
 RR('#fff0cc',cx-4,by-11,2,1);
 [[-3,-9],[1,-10],[3,-8],[-1,-7],[4,-10]].forEach(([dx,dy])=>RR('#5a2e14',cx+dx,by+dy,1,1));
}
function cakeRoll(RR,cx,cy,t){
 // thân cuộn: viền nâu, thịt bánh cam, phủ caramel cam đậm + giọt chảy
 ell(RR,'#8a4a1a',cx,cy,10,6);ell(RR,'#d9822c',cx,cy-.5,9.3,5.3);
 ell(RR,'#ff9d2e',cx-.5,cy-2.3,8.4,3.3);ell(RR,'#ffbf55',cx-2,cy-3.4,5,1.5);
 for(const dx of[-7,-3,2,6]){RR('#ff9d2e',cx+dx,cy+1,2,2);RR('#d9822c',cx+dx,cy+3,2,1)}   // giọt caramel chảy
 RR('#fff3c8',cx-5,cy-5,2,1);                                                                  // vệt bóng
 // mặt cắt (đầu phải): kem + vòng xoáy + cửa kẹo xanh
 ell(RR,'#8a4a1a',cx+9,cy,3.3,5.6);ell(RR,'#fff0c8',cx+9,cy,2.5,4.7);
 RR('#d99a4a',cx+8,cy-3,2,1);RR('#d99a4a',cx+7,cy-2,1,3);RR('#d99a4a',cx+10,cy-2,1,2);
 RR('#3fd18a',cx+8,cy-1,2,4);RR('#8affc0',cx+8,cy-1,1,2);RR('#1c8f5a',cx+9,cy+1,1,2);
 // bánh quy sô-cô-la hình trái tim trên đỉnh
 const H=[[1,2],[1,2]];
 RR('#7a4a1c',cx-4,cy-9,2,1);RR('#7a4a1c',cx-1,cy-9,2,1);RR('#b9803f',cx-5,cy-8,7,2);RR('#d9a45a',cx-4,cy-8,2,1);RR('#b9803f',cx-4,cy-6,5,1);RR('#8a5a26',cx-3,cy-5,3,1);RR('#8a5a26',cx-2,cy-4,1,1);
}
function cakeLolly(RR,cx,cy,r,c1,c2,c3,len,lean,t){
 // cán trước (đè dưới)
 for(let i=0;i<len;i++){const x=cx+rnd(lean*i/len);RR('#ffffff',x,cy+r+i,1,1);RR('#cfd3e6',x+1,cy+r+i,1,1)}
 ell(RR,c3,cx,cy,r+.5,r+.5);ell(RR,c1,cx,cy,r,r);
 ell(RR,c2,cx,cy,r*.62,r*.62);ell(RR,c1,cx,cy,r*.3,r*.3);
 RR('#ffffff',cx-flr(r*.6),cy-flr(r*.6),1,1);
 if(sin(t*3+cx)>.7)RR('#ffffff',cx-flr(r*.6)+1,cy-flr(r*.6),1,1)
}
function cakeCane(RR,x0,yb,h,sg){
 for(let i=0;i<h;i++){const y=yb-i,c=((i>>1)%2)?'#ffffff':'#e8384f';RR(c,x0,y,2,1);RR(c==='#ffffff'?'#e8c0c8':'#b01d36',x0+1,y,1,1)}
 // móc cong ở đỉnh (sang phía đầu / sang phải)
 const hook=[[0,0],[1,-1],[2,-1],[3,-1],[4,0],[5,1],[5,2]];
 hook.forEach(([dx,dy],i)=>{const c=(i>>1)%2?'#ffffff':'#e8384f';RR(c,x0+dx*sg-(sg<0?1:0),yb-h+dy-1,2,2);RR('#b01d36',x0+dx*sg,yb-h+dy+0,1,1)});
 // nơ đỏ
 const by=yb-8;
 RR('#e8384f',x0-4,by-1,4,3);RR('#ff6a7e',x0-4,by-1,4,1);RR('#a8142c',x0-3,by+1,3,1);
 RR('#e8384f',x0+2,by-1,4,3);RR('#ff6a7e',x0+2,by-1,4,1);RR('#a8142c',x0+3,by+1,3,1);
 RR('#a8142c',x0,by,2,2);RR('#e8384f',x0,by-1,2,1);
 RR('#e8384f',x0-1,by+2,2,4);RR('#a8142c',x0-1,by+5,2,1);RR('#e8384f',x0+2,by+2,2,3);
}
function cakeCandy(RR,cx,cy,c1,c2,ph,t){
 const w=rnd(sin(t*4+ph)*.6);
 RR(c1,cx-2,cy,5,3);RR(c2,cx-2,cy,5,1);RR('#ffffff',cx-1,cy+1,1,1);
 RR(c1,cx-4,cy,2,1);RR(c1,cx-4,cy+2,2,1);RR(c1,cx+3,cy,2,1);RR(c1,cx+3,cy+2,2,1);RR(c2,cx-4,cy+1+w,1,1);RR(c2,cx+4,cy+1-w,1,1)}
function cakeBase(RR,t,sd){
 // bệ bánh quy hình thoi (đỉnh y=-26, đáy y=-3). cy=-14, nửa rộng 24, nửa cao 11 + dày 3
 const cy=-14,hw=24,hh=11;
 for(let d=-hh;d<=hh;d++){const w=rnd(hw*(1-abs(d)/hh));if(w<1)continue;
  const y=cy+d;
  RR('#b8803a',-w-1,y,w*2+2,1);                                         // viền ngoài nâu
  RR('#f6dc9e',-w,y,w*2,1);
  if(d<=-hh+3)RR('#fff0c4',-w,y,w*2,1);                                   // mép sáng phía sau
  RR('#fff0c4',-w,y,Math.min(2,w),1);                                     // mép sáng trái
  RR('#e6c27a',w-2,y,Math.min(2,w),1)}                                    // mép tối phải
 // dày: thành bánh phía trước (trái sáng / phải tối)
 for(let d=0;d<=hh;d++){const w=rnd(hw*(1-d/hh));if(w<1)continue;
  RR('#d9a85c',-w,cy+d+1,w,3);RR('#c0883f',0,cy+d+1,w,3);RR('#8a5a26',-w,cy+d+3,w*2,1);RR('#f0cd84',-w,cy+d+1,w,1)}
 // chấm lỗ bánh quy + cạnh răng cưa
 for(let i=0;i<34;i++){const a=hash(i+sd)*6.28,r2=hash(i*3+sd)*.85,x=rnd(cos(a)*r2*hw*.9),y=rnd(cy+sin(a)*r2*hh*.9);if(abs(x)/hw+abs(y-cy)/hh<.82)RR('#e2bd72',x,y,1,1)}
 // kem + dâu giữa bệ (chỗ người đứng)
 ell(RR,'#fff6ec',0,cy,10,4.2);ell(RR,'#ffe1e8',0,cy+.5,8,3);RR('#ffc4d2',-6,cy-1,2,1);RR('#ffc4d2',4,cy+1,2,1);
 RR('#ff4f63',6,cy-2,3,2);RR('#ffb0bb',6,cy-2,1,1);RR('#2e9e46',8,cy-3,1,1);
 RR('#8a5a26',-9,cy+2,1,1);RR('#8a5a26',8,cy+3,1,1);RR('#8a5a26',-3,cy-3,1,1)
}
function cakeDraw(R,d,f,b,t,pt,c){
 const mv=!!(c&&c.mv),S=(c&&c.S)||{},RR=(col,x,y,w,h)=>R(col,x,y+b,w,h),side=d>1,back=d==1;
 if(!pt){
  // bóng mờ dưới đất (không nhún theo bệ), nhỏ lại khi bệ nhún cao
  const lift=-b,k2=Math.max(.8,1-lift*.04);
  ell(R,'rgba(0,0,0,.10)',0,1,rnd(26*k2),3);ell(R,'rgba(0,0,0,.13)',0,1,rnd(18*k2),2);
  cakeBase(RR,t,3);
  const sg=back?-1:1;
  if(!side){
   const X=x=>x*sg;
   cakeCane(RR,X(-9)-(sg<0?1:0),-21,24,sg);
   cakeLolly(RR,X(-19),-35,3,'#58b4f0','#cfeeff','#2f7fc0',12,X(4)-X(0),t);
   cakeLolly(RR,X(9),-47,5,'#8fe05a','#d3fba0','#4faa28',26,X(1)-X(0),t);
   cakeLolly(RR,X(21),-38,4,'#b77ae6','#e8d0ff','#7d46b8',16,X(-2)-X(0),t);
   cakeRoll(RR,X(15),-19,t);
   cakeCupcake(RR,X(-18),-11);
  }else{
   cakeCane(RR,-8,-22,24,-1);
   cakeLolly(RR,-3,-48,5,'#8fe05a','#d3fba0','#4faa28',26,1,t);
   cakeLolly(RR,-17,-36,3,'#58b4f0','#cfeeff','#2f7fc0',12,3,t);
   cakeLolly(RR,-23,-30,4,'#b77ae6','#e8d0ff','#7d46b8',10,-2,t);
   cakeRoll(RR,-13,-17,t);
   cakeCupcake(RR,15,-11);
  }
  // (không vẽ chân ảo nữa: nhân vật đứng thật, chân tự vẽ theo set/mascot — xem drawRide, cờ stand:1)
 }else{
  // lớp trước: kẹo bọc + kẹo bông bay quanh bệ, lấp lánh
  const A=t*1.3,bobv=rnd(sin(t*2.6)*1.5);
  cakeCandy(RR,rnd(25+sin(A)*2),-27+bobv,'#ffd23a','#ffa81f',0,t);
  cakeCandy(RR,-27,-17-bobv,'#ff8ac0','#d8559a',2,t);
  RR('#6fe0a0',27,-12-bobv,3,3);RR('#c8ffe0',27,-12-bobv,1,1);RR('#ff6fa0',-25,-33+bobv,3,2);RR('#ffc0d8',-25,-33+bobv,1,1);
  for(let i=0;i<9;i++){const a=(sin(t*3.1+i*2.3)+1)/2;star(RR,-30+hash(i)*60,-44+hash(i+7)*40,a,i%2?'255,255,255':'255,214,235',i%3==0)}
 }
}
window.cakeDraw=cakeDraw;

// ===================================================================================
//  🛞 THÚ CƯỠI PHONG HỎA LUÂN — hai bánh xe vàng bọc lửa dưới chân, người ĐỨNG trên bánh xe (cao bằng Bánh ngọt).
//  Bánh xe quay, lửa cháy rực nhiều tầng (trắng-vàng-cam-đỏ), tia lửa bắn ra; đi thì lửa kéo vệt phía sau.
// ===================================================================================
window.wheelHov=function(t,mv){return mv?-Math.round(1+sin(t*9)*.8):-Math.round(1.2+sin(t*2.6)*1)};
const FIRE=['#fff7c8','#ffe066','#ffb82e','#ff7a1a','#e8401a','#a8200e'];
function wheelRing(RR,cx,cy,rad,ang,t){
 for(let y=-rad-1;y<=rad+1;y++)for(let x=-rad-1;x<=rad+1;x++){
  const d=Math.sqrt(x*x+y*y);if(d>rad+.4)continue;
  let c=d>rad-.8?'#b8400f':d>rad-2?'#ffd24a':d>rad-3.4?'#ff4a1c':'#ff9a2e';
  if(d<rad-3.4){const a0=ang;for(let k=0;k<4;k++){const a=a0+k*PI/2,dist=abs(-x*sin(a)+y*cos(a)),fwd=x*cos(a)+y*sin(a);if(dist<.55&&fwd>0)c='#ffe58f'}}
  if(d<1.4)c='#fff7c8';
  if(y<0&&x<0&&d>rad-2&&d<rad-.8)c='#fff0a0';                                // viền sáng trên-trái
  RR(c,cx+x,cy+y,1,1)}
}
function flameCol(RR,x,yb,h,t,seed,big){
 for(let i=0;i<h;i++){const rel=i/h,ci=Math.min(5,flr(rel*5.4)),y=yb-i;
  const a=rel>.78?.65:1;
  RR(a<1?'rgba(255,110,30,'+a.toFixed(2)+')':FIRE[ci],x,y,1,1)}
}
function flameBlock(RR,cx,yb,w,h,t,seed){
 for(let c=-w;c<=w;c++){
  const env=1-abs(c)/(w+1)*.55,fl=.55+.45*sin(t*11+c*1.9+seed)*sin(t*7+c*.8+seed*2),hh=Math.max(2,rnd(h*env*fl));
  flameCol(RR,cx+c,yb,hh,t,seed)}
}
function wheelDraw(R,d,f,b,t,pt,c){
 const mv=!!(c&&c.mv),S=(c&&c.S)||{},RR=(col,x,y,w,h)=>R(col,x,y+b,w,h),side=d>1;
 const ang=t*(mv?16:5),cy=-8,rad=6,cxs=[-6,6];
 if(!pt){
  // bóng mờ + quầng sáng lửa trên mặt đất
  const lift=-b,k2=Math.max(.8,1-lift*.04);
  ell(R,'rgba(255,120,30,.14)',0,1,rnd(22*k2),4);ell(R,'rgba(0,0,0,.13)',0,1,rnd(16*k2),2);
  // lửa lớp sau (cháy phía sau chân)
  cxs.forEach((cx,i)=>flameBlock(RR,cx,cy-1,rad-1,17,t,i*3.1));
  cxs.forEach(cx=>wheelRing(RR,cx,cy,rad,ang,t));
  // (không vẽ chân ảo nữa: nhân vật đứng thật — cờ stand:1)
 }else{
  // lửa lớp trước: ôm quanh mép trên bánh xe, liếm lên mắt cá chân
  cxs.forEach((cx,i)=>{flameBlock(RR,cx,cy-rad+2,rad-2,8,t,i*4.7+1.3);
   for(let k=-rad;k<=rad;k+=2){const hh=1+rnd((sin(t*13+k+i*2)+1)*1.6);flameCol(RR,cx+k,cy+3-abs(k)*.3,hh+2,t,k)}});
  // vệt lửa/tàn lửa kéo sau khi đi + tia lửa bắn lên
  const dirx=d==3?-1:d==2?1:0,diry=d==0?-1:d==1?1:0;     // hướng kéo vệt = ngược chiều di chuyển (d==2 đã bị R lật nên +x ở đây là phía sau)
  for(let i=0;i<22;i++){
   const ph=(t*(mv?1.9:1.1)+i/22+hash(i)*.2)%1,bx=cxs[i%2]+rnd((hash(i+5)-.5)*8);
   let x=bx,y=cy-2-ph*20;
   if(mv){x=bx+(side?-ph*16:0);y=cy-2-ph*(side?10:16)}
   const a=ph<.15?ph/.15:1-(ph-.15)/.85,ci=Math.min(5,flr(ph*6));
   if(a>.12){RR('rgba(255,'+(220-ph*140|0)+','+(80-ph*60|0)+','+a.toFixed(2)+')',rnd(x),rnd(y),ph<.4?2:1,ph<.4?2:1)}}
  for(let i=0;i<7;i++){const a=(sin(t*4.2+i*2.7)+1)/2;star(RR,-14+hash(i+3)*28,-30+hash(i+9)*22,a*a,'255,226,120',i%3==0)}
 }
}
window.wheelDraw=wheelDraw;

// ===================================================================================
//  🌙 THÚ CƯỠI TRĂNG KHUYẾT — 💎15, bán ở Shop kim cương (mục Thú cưỡi). Người NGỒI trên vầng trăng khuyết xanh dịu,
//  chân buông thõng, lơ lửng cách đất như Bánh ngọt (có bóng mờ dưới đất, nhún nhẹ).
//  Có: thân trăng xanh ngọc nhạt + viền sáng, vài bông hoa xanh tím, TUA RUA mỏng rủ dưới vầng trăng (đung đưa, đính hạt),
//      CÁNH BƯỚM xanh vỗ cánh bay quanh đầu trăng, và những mặt trăng xanh BÉ 🌙 bay lên lấp lánh.
//  Món này được thêm vào CUỐI mảng MOUNTS bằng MOUNTS.push ở cuối khối này (nên chỉ cần thay file newitems2.js, không phải sửa index.html).
//  Muốn đổi giá: sửa dia:15 ở dòng MOUNTS.push cuối khối.
// ===================================================================================
window.moonHov=function(t,mv){return mv?-Math.round(1.3+sin(t*7)*.9):-Math.round(1.8+sin(t*2.1)*1.3)};
let moonCache=null;
const MG={OX:-4,OY:-24,OR:17,IX:2,IY:-29,IR:14};      // vòng ngoài (OX,OY,OR) trừ vòng trong (IX,IY,IR) = vầng trăng khuyết, mở sang phải
function moonSpans(){
 // thân trăng = vòng tròn ngoài trừ vòng tròn trong (hướng mở sang phải). Tính 1 lần rồi dùng lại.
 if(moonCache)return moonCache;
 const OX=MG.OX,OY=MG.OY,OR=MG.OR,IX=MG.IX,IY=MG.IY,IR=MG.IR,out=[];
 const L=[-.55,-.83];                                   // hướng sáng từ trên-trái
 for(let y=-46;y<=-5;y++){
  let run=null;
  for(let x=-26;x<=14;x++){
   const px=x+.5,py=y+.5,d1=Math.hypot(px-OX,py-OY),d2=Math.hypot(px-IX,py-IY);
   let col=null;
   if(d1<=OR&&d2>IR){
    const e1=OR-d1,e2=d2-IR,e=Math.min(e1,e2);
    const nOut=[(px-OX)/d1,(py-OY)/d1],nIn=[(IX-px)/d2,(IY-py)/d2];
    const litO=nOut[0]*L[0]+nOut[1]*L[1]>.15,litI=nIn[0]*L[0]+nIn[1]*L[1]>.15;
    if(e<1){col=e1<e2?(litO?'#bdeefb':'#4f9bd2'):(litI?'#aee6f7':'#5aa5d8')}
    else if(e<2.3){col=e1<e2?(litO?'#e2f9ff':'#86cdee'):(litI?'#d2f4fd':'#7ec6ea')}
    else{
     const ys=(y+46)/40;
     col=ys<.3?'#b0e8f8':ys<.62?'#98ddf3':'#82d0ee';
     if(e>3.2&&e<4.5&&((x*3+y*2)%7+7)%7==0)col='#dcf7ff'
    }
   }
   if(run&&run.c===col)run.w++;
   else{if(run)out.push(run);run=col?{c:col,x,y,w:1}:null}
  }
  if(run)out.push(run)
 }
 return moonCache=out
}
function moonFlower(P,cx,cy,big){
 const pc=big?'#8f94f2':'#a29cf5',pl='#c9c6ff',pd='#6f72d6';
 P(pd,cx-1,cy-2,3,1);P(pc,cx-1,cy-2,3,1);
 P(pc,cx-2,cy-1,5,3);P(pl,cx-2,cy-1,2,1);P(pl,cx-1,cy-2,1,1);
 P(pd,cx-1,cy+2,3,1);P(pd,cx+2,cy,1,2);
 P('#ffe38a',cx,cy,1,1);P('#fff6c8',cx,cy-1,1,1)
}
function moonTassel(P,ax,ay,len,t,i){
 const sw=sin(t*2.3+i*1.4);
 for(let k=0;k<len;k++){
  const x=ax+rnd(sw*(k/len)*1.3);
  P(k%2?'#a6e0f7':'#d8f4ff',x,ay+k,1,1);
  if(k==2||k==len-3)P('#fff0a8',x,ay+k,1,1)
 }
 const ex=ax+rnd(sw*1.3);
 P('#bfeaff',ex-1,ay+len,1,2);P('#fff0a8',ex,ay+len,1,2);P('#bfeaff',ex+1,ay+len,1,2);
 P('rgba(191,234,255,.55)',ex-1,ay+len+2,1,1);P('rgba(191,234,255,.55)',ex+1,ay+len+2,1,1)
}
function moonButterfly(P,cx,cy,t){
 const fl=abs(sin(t*9)),w=2+rnd(fl*1.2);        // vỗ cánh: cánh khép lại / mở ra
 for(const s of[-1,1]){
  const x0=s<0?cx-w:cx+1,sh=s<0?1:0;
  P('#8fcfff',x0+sh,cy-3,w-1,1);P('#8fcfff',x0,cy-2,w,2);P('#e4f8ff',x0+sh,cy-3,w-1,1);P('#c3a4f5',x0+(s<0?0:w-1),cy-2,1,1);   // cánh trên (đốm tím)
  P('#6fb4f0',x0+sh,cy,w-1,2);P('#b9e4ff',x0+sh,cy,w-1,1)                                                                      // cánh dưới
 }
 P('#3f55c0',cx,cy-3,1,6);P('#8fa0ff',cx,cy-3,1,1);                      // thân + đầu
 P('#3f55c0',cx-1,cy-5,1,2);P('#3f55c0',cx+1,cy-5,1,2);                   // râu
 if(sin(t*3)>.2)star(P,cx+5,cy-4,.8,'220,245,255',0)
}
function moonMini(P,x,y,a){
 // trăng khuyết bé 4x5 (mở sang phải) có quầng sáng nhỏ, mờ/sáng theo a
 if(a<=.05)return;a=Math.min(1,a);
 const q=v=>'rgba('+v+','+a.toFixed(2)+')',c1=q('168,236,255'),c2=q('96,190,240'),c3=q('255,255,255');
 P(c1,x+1,y,2,1);P(c3,x+1,y,1,1);P(c1,x,y+1,2,1);P(c1,x,y+2,1,1);P(c1,x,y+3,2,1);P(c2,x+1,y+4,2,1);P(c2,x,y+3,1,1)
}
function moonDraw(R,d,f,b,t,pt,c){
 const mv=!!(c&&c.mv),RR=(col,x,y,w,h)=>R(col,x,y+b,w,h),back=d==1,side=d>1,sg=back?-1:1;
 const P=(col,x,y,w,h)=>{w=w||1;h=h||1;RR(col,sg>0?x:-x-w,y,w,h)};
 if(!pt){
  // bóng mờ dưới đất (không nhún theo vầng trăng)
  const lift=-b,k2=Math.max(.8,1-lift*.035);
  ell(R,'rgba(0,0,0,.10)',-3*sg,1,rnd(21*k2),3);ell(R,'rgba(0,0,0,.13)',-3*sg,1,rnd(14*k2),2);
  // quầng sáng xanh nhạt quanh trăng
  ell(P,'rgba(150,224,255,.07)',MG.OX+3,MG.OY-1,22,22);ell(P,'rgba(190,240,255,.07)',MG.OX+3,MG.OY-1,19,19);
  const sp=moonSpans();
  for(let i=0;i<sp.length;i++){const s=sp[i];P(s.c,s.x,s.y,s.w,1)}
  // hoa xanh tím gắn trên thân trăng (phía sau lưng người)
  moonFlower(P,-17,-30,1);moonFlower(P,-13,-22,0);moonFlower(P,-18,-21,0);
  P('#7fd0a8',-15,-26,1,1);P('#7fd0a8',-16,-27,1,1);
  // tua rua mỏng rủ dưới vầng trăng
  [[100,8],[115,7],[130,6],[145,5]].forEach(([ang,len],i)=>{
   const a=ang*PI/180,ax=rnd(MG.OX+MG.OR*cos(a)),ay=rnd(MG.OY+MG.OR*sin(a))+1;
   moonTassel(P,ax,ay,len,t,i)});
  // 2 sợi dài rủ từ đầu sừng dưới
  moonTassel(P,10,-16,8,t,5);moonTassel(P,7,-12,6,t,6)
 }else{
  // cánh bướm bay quanh đầu trăng phía trên
  const bx=rnd(9+sin(t*1.3)*6),by=rnd(-43+sin(t*2.1)*3);
  moonButterfly(P,bx,by,t);
  // mặt trăng xanh bé bay lên lấp lánh
  const bases=[-19,-11,-3,5,12,18,-7,9];
  for(let i=0;i<bases.length;i++){
   const ph=(t*.3+i/bases.length)%1,a=Math.min(1,sin(ph*PI)*1.6),x=bases[i]+rnd(sin(t*1.7+i*2.1)*3.5),y=-10-rnd(ph*34);
   moonMini(P,x,y,a*(.75+.25*sin(t*6+i*1.9)));
   if(i%2==0)star(P,x+3,y-2,a*(sin(t*7+i*3)+1)/2,'200,240,255',i%4==0)
  }
  for(let i=0;i<7;i++){const a=(sin(t*3.3+i*2.1)+1)/2;star(P,-22+hash(i+11)*44,-48+hash(i+5)*40,a*a,i%2?'255,255,255':'190,236,255',i%3==0)}
 }
}
window.moonDraw=moonDraw;
// chân ngồi buông thõng (vẽ sau lớp trăng, trước người). R = hàm vẽ đã lật theo hướng; hv = độ nhún của thú cưỡi
function moonLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const t=performance.now()/1000,mv=!!(c&&c.mv),sw=rnd(sin(t*(mv?7:2.2))*(mv?1.4:1)),y=sy-3+hv,sh=shadeC(PT,-.18);
 if(d>1){
  // nhìn ngang: đùi ngang, 2 cẳng chân buông thõng đung đưa ngược nhau
  R(shadeC(PT,-.3),sx-1,y,6,3);
  R(shadeC(PT,-.25),sx+1-sw,y+2,3,8);R(shadeC(SD,-.2),sx+1-sw,y+10,5,2);
  R(shadeC(PT,-.12),sx-2,y,8,3);R(PT,sx+3+sw,y+2,3,8);R(shadeC(PT,.25),sx+3+sw,y+2,1,8);R(SD,sx+3+sw,y+10,5,2)
 }else{
  // nhìn trước/sau: 2 chân thõng gần nhau
  R(PT,sx-4,y,3,9+(sw>0?1:0));R(shadeC(PT,.25),sx-4,y,1,9);R(sh,sx-2,y,1,9);R(SD,sx-4,y+9+(sw>0?1:0),3,2);
  R(PT,sx+1,y,3,9+(sw<0?1:0));R(shadeC(PT,.25),sx+1,y,1,9);R(sh,sx+3,y,1,9);R(SD,sx+1,y+9+(sw<0?1:0),3,2)
 }
}
window.moonLegs=moonLegs;
// đăng ký thú cưỡi vào CUỐI mảng MOUNTS (index.html khai báo MOUNTS trước khi file này chạy)
if(typeof MOUNTS!=='undefined'&&!MOUNTS.some(m=>m.k==='moon'))
 MOUNTS.push({n:'Trăng khuyết',k:'moon',dia:15,hw:10,drop:9,spd:2.4,nobob:1,sh:[0,0],seat:{0:[0,-15],1:[0,-15],side:[1,-15]},
  legs(R,d,ph,sx,sy,PT,SD,S,hv,c){moonLegs(R,d,ph,sx,sy,PT,SD,S,hv,c)},
  hov:(t,mv)=>window.moonHov?moonHov(t,mv):0,
  draw(R,d,f,b,t,pt,c){moonDraw(R,d,f,b,t,pt,c)}});

})();
