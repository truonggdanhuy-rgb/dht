/* ===================================================================================
   HAUVUONG.JS — Mascot MỸ HẦU VƯƠNG (Tôn Ngộ Không) — bán ở Shop kim cương 💎15 (cùng giá set Ma đồng giáng thế / Na Tra)
   PHIÊN BẢN VẼ LẠI (v2) — đầu/tóc vẽ bằng BẢN ĐỒ PIXEL thay vì tam giác:
   • Tóc cam là khối lửa lớn nhiều lọn, 3 tông (ngọn vàng sáng → gốc cam đậm), viền cam sẫm. Không còn "gai vương miện".
   • Kim cô vàng: băng đô + vòng cuộn ở thái dương + ngọc đỏ giữa trán. Mắt to 3×3 cam đỏ, mày dựng, cười nhếch lộ răng nanh.
   • Tóc mai ôm má cuộn ra ngoài. Tai khỉ nhọn lộ ra bên dưới tóc.
   • Có sẵn BIỂU CẢM (faceFx của game vẫn khớp vì vị trí mắt/miệng giữ chuẩn). Chọn biểu cảm khác thì mặt đổi, tóc giữ.
   • Hiệu ứng GIẢM NHẸ: 2 dải ruy băng mảnh bay sau đầu (không còn dây dài quấn quanh người), luồng vần vũ chỉ còn
     2 dải mảnh PHÍA SAU người (vàng + xanh) và vài tia sáng nhỏ — không còn che mặt.
   • Áo giáp đỏ viền vàng, vai giáp vàng gai cong, ngọc lục bảo ngực & đai, váy da hổ, giày vàng, áo choàng đỏ thẫm.
   Khai báo 1 món ở CUỐI mảng SETS (index.html) + thêm 'mhv' vào DSETS. File này chỉ chứa HÀM VẼ.
   Muốn đổi giá: sửa dia:15 trong index.html.  Muốn chỉnh tóc/đầu: sửa các mảng HF / HB / HS bên dưới
   (mỗi ký tự = 1 pixel, bảng màu ở PAL). Xem nhanh bằng: window.__hvdbg={noaura:1} (tắt hiệu ứng) trong console.
   =================================================================================== */
(function(){
const sin=Math.sin,cos=Math.cos,abs=Math.abs,rnd=Math.round,flr=Math.floor,PI=Math.PI;

// ---------- bảng màu ----------
const HR='#f6a02a',HRL='#ffd552',HRH='#fff3a6',HRD='#d96d1a',HRX='#a3400f',HRO='#5e1f0c';      // tóc / râu cam
const SKN='#f6c397',SKL='#ffdfc2',SKS='#d58f65',SKX='#a8664a';                                  // da
const GD='#f8cd4e',GDL='#fff5ac',GDD='#b9871c',GDX='#6e4a10';                                    // vàng
const RD='#d3212f',RDL='#ff5c66',RDD='#8c1226',RDX='#4e0914';                                    // đỏ giáp
const JD='#35dc8c',JDL='#c2ffe0',JDD='#10925a';                                                  // ngọc lục bảo
const EYE='#ff5a1e',EYL='#ffc26a',DK='#2b0d0d',WH='#ffffff';
const CP='#a3142b',CPL='#cf2c42',CPD='#5c0b1d';                                                  // áo choàng
const TG='#f28b22',TGL='#ffb14e',TGD='#2f1308';                                                  // da hổ
const RB='#ff7a2e',RBL='#ffb27a',RBD='#b8350f';                                                  // ruy băng

// ký tự trong bản đồ pixel → màu ('.' = trong suốt)
const PAL={X:HRX,D:HRD,H:HR,L:HRL,W:HRH,O:HRO,B:HRO,
           s:SKN,S:SKL,t:SKS,u:SKX,
           G:GD,g:GDL,d:GDD,k:GDX,
           R:RD,r:RDL,q:RDD};

// ===================================================================================
//  BẢN ĐỒ PIXEL ĐẦU — mỗi ký tự = 1 pixel, "." = trong suốt. {x,y} = toạ độ góc trên-trái của bản đồ.
//  Bảng ký tự: X viền tóc · D/H/L/W tóc (đậm → vừa → sáng → ngọn vàng) · s/S/t/u da · G/g/d/k vàng · R/r/q đỏ · B mày.
//  Muốn sửa tóc: đổi ký tự trong các mảng dưới đây (giữ nguyên số cột của mỗi hàng).
// NHÌN TRƯỚC (đầy đủ, bất đối xứng; mắt/mũi/miệng vẽ bằng code)
const HF={x:-6,y:-8,rows:[
 "...........XXX..................",
 "..........XWHDX.................",
 "..........XLWHDXXXXX............",
 "...........XLHHDDWHDX...........",
 ".....XXX...XLHHHDLWHDX..........",
 "....XWHDXXXXLLHHHDHHHDX.XXX.....",
 "....XLHHDDDDHLHHHDLHHDXXLLWX....",
 "...XXLLHHHDDHHHHHHDHHHHLLHDX....",
 "..XWDDLLHHHDHHHHHHDHHHHHHHDX....",
 "..XLHDDHHHHDHHHHHDDHHDHHHDLWX...",
 "..XLHHDHHHDHHHHHHDDDHDHHDLHHX...",
 "...XLHHHHHDHHHHHHDDDDDHDDHHX....",
 "....XLHHgGHHHHHgGDDDDDGgHHDX....",
 ".....XHGHDGHHHGGGGDDDGHHGXX.....",
 "......XGDdGgggGrRGGGGGdDG.......",
 ".......dDddddddRqddddddXd.......",
 "......XDHHSSBBssssBBssHDX.......",
 "......XDSsSsssBssBssstsS........",
 ".......sstSssssssssssttss.......",
 "......XHLDssssssssssstLHX.......",
 "......XHXXssssssssssstDHX.......",
 "......XWX.ssssssssssstDWX.......",
 ".......X...tttttttttt.XX........"
]};
// NHÌN SAU
const HB={x:-6,y:-8,rows:[
 "...........XXX..................",
 "..........XWHDX.................",
 "..........XLWHDXXXXX............",
 "...........XLHHDDWHDX...........",
 ".....XXX...XLHHHDLWHDX..........",
 "....XWHDXXXXLLHHHDHHHDX.XXX.....",
 "....XLHHDDDDHLHHHDLHHDXXLLWX....",
 "...XXLLHHHDDHHHHHHDHHHHLLHDX....",
 "..XWDDLLHHHDHHHHHHDHHHHHHHDX....",
 "..XLHDDHHHHDHHHHHDDHHDHHHDLWX...",
 "..XLHHDHHHDHHHHHHDDDHDHHDLHHX...",
 "...XLHHHHHDHHHHHHDDDDDHDDHHX....",
 "....XLHHgGHHHHHHHDDDDDGgHHDX....",
 ".....XHGHDGHHHHHHDDDDGHHGXX.....",
 "......XGHdGgggGGGGGGGGdDG.......",
 ".......dXddddddGdddddddXd.......",
 "........XHHDLHDLHDLDDHHX........",
 "........XHDDLHDLHDLDDHHX........",
 "........XDDDLHDLHDLHDDHX........",
 "........XDHDHHDHHDHHDDHX........",
 "........XDHDHDDHHDHHDDHX........",
 "........XHHDHHDHHDHHDHHX........",
 ".......XDHHLXXDHHHDLHHDX........",
 ".......XDHLLXXDHHXXLLHDX........",
 ".......XDHLX.XDHLX.XLHDX........",
 "........XHLX.XDHLX.XLHX.........",
 "........XHLX.XDHLX.XLHX.........",
 "........XWLX.XDHLX.XLHX.........",
 "........XDX...XHLX.XLWX........."
]};
// NHÌN NGANG quay sang PHẢI (game tự lật khi quay trái)
const HS={x:-8,y:-9,rows:[
 "...........XX..........",
 "..........XWDXX........",
 "..........XWHHDX.......",
 "...........XLHHDXXXX...",
 "...XXXXXXX.XLHHHDDWDX..",
 "..XWHHHDDDXXLLHHHDLHHX.",
 "...XLLHHHHDDDLHHHDDHHDX",
 "....XLLLHHHHHLLHHHDHHHX",
 ".XXXXDDLLHHHHHHHHHDDHHX",
 "XWWHDDDDLLHHHHHHHHHDDDX",
 ".XLLHHHHDLHHHHHHHHHDDDX",
 "..XLLHHHHHDHHHHHHHHDDDX",
 "...XXLLLHHHDHDHHHHHDDDX",
 ".....XXLLHHGgDHHHHHgGX.",
 ".......XDHGHHGHHHHHGG..",
 ".......XDDGggdggGGGrR..",
 "......XDHHdddddddddRq..",
 ".....XDHHHLHHHHHHSsBBB.",
 "....XDHHLLHHHsSHHSssst.",
 "....XHHLLLXXHssHHsssst.",
 "...XDLLXXX.XHutHHssssts",
 "...XWLX....XHDHHHsssstu",
 "....XX.....XHDHHHsssst.",
 "............XXXXXttttt."
]};
function stamp(U,m){
 m.rows.forEach((row,ri)=>{
  for(let c=0;c<row.length;c++){
   const ch=row[c];if(ch==='.')continue;
   let e=c;while(e+1<row.length&&row[e+1]===ch)e++;
   U(PAL[ch],m.x+c,m.y+ri,e-c+1,1);
   c=e}})}

// ---------- tiện ích vẽ pixel (R = hàm vẽ hình chữ nhật) ----------
function ell(R,col,cx,cy,rx,ry){
 for(let y=flr(cy-ry);y<=Math.ceil(cy+ry);y++){const dy=(y+.5-cy)/ry;if(abs(dy)>1)continue;
  const hw=rnd(rx*Math.sqrt(1-dy*dy));if(hw>0)R(col,rnd(cx)-hw,y,hw*2,1)}}
function line(R,col,x0,y0,x1,y1){
 x0=rnd(x0);y0=rnd(y0);x1=rnd(x1);y1=rnd(y1);
 const n=Math.max(abs(x1-x0),abs(y1-y0),1);
 for(let k=0;k<=n;k++)R(col,rnd(x0+(x1-x0)*k/n),rnd(y0+(y1-y0)*k/n),1,1)}
function star(R,x,y,a,rgb,big){
 x=rnd(x);y=rnd(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.75){R('rgba(255,255,255,'+a.toFixed(2)+')',x,y,1,1)}}

// ---------- RUY BĂNG MẢNH (1px) — fn(s,ph) trả [x,y] theo s=0..1 ----------
function ribbon(R,fn,n,ph,t){
 const P=[];for(let i=0;i<=n;i++)P.push(fn(i/n,ph));
 for(let i=0;i<=n;i++){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(RBD,x,y+1,1,1)}
 for(let i=0;i<=n;i++){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(RB,x,y,1,1)}
 for(let i=1;i<=n;i+=3){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(RBL,x,y,1,1)}
 const e=P[n],ex=rnd(e[0]),ey=rnd(e[1]);                                                  // tua vàng nhỏ ở đầu
 R(GDD,ex,ey,2,2);R(GD,ex,ey,2,1);R(GDL,ex,ey,1,1)}

// ---------- LUỒNG VẦN VŨ (chỉ vòng PHÍA SAU người, 2 dải mảnh vàng + xanh) ----------
const STR=[{rgb:['255,210,63','255,243,160','232,150,20'],ph:0}];
function aura(u,t,part,mv){
 if(part)return;
 const N=70,spd=mv?2.2:1.2;
 STR.forEach((S,si)=>{
  for(let k=0;k<=N;k++){
   const s=k/N,a=t*spd+S.ph+s*PI*3,z=sin(a);
   if(z>0)continue;
   const R=10.5+s*2.5+1.6*sin(s*PI*1.3+t*1.1+si),x=10+R*cos(a),y=33-s*38+sin(t*2+si+s*6)*.8;
   const env=Math.pow(sin(s*PI),.5),al=.5*env;if(al<.14)continue;
   const xi=rnd(x),yi=rnd(y),f=al.toFixed(2);
   u('rgba('+S.rgb[0]+','+f+')',xi,yi,1,1);
   if(k%5==0)u('rgba('+S.rgb[1]+','+(al+.2).toFixed(2)+')',xi,yi,1,1);
  }});
}
function sparkles(u,t,mv){
 for(let i=0;i<7;i++){
  const P=1.9+(i%5)*.45,ph=((t/P)+i*.31)%1,ang=i*2.399+t*.35*(i%2?1:-1);
  const R=8+((i*37)%7),x=10+R*cos(ang),y=26-ph*34+sin(t*3+i)*1.2;
  const a=Math.min(1,ph*5,(1-ph)*2.2);if(a<.12)continue;
  if(x>3&&x<17&&y>5&&y<16)continue;                                   // không che mặt
  star(u,x,y,a,i%2?'255,243,170':'255,214,80',i%3==0)}
}

// ===================================================================================
function drawHauVuong(r,u,o,S,k){
 const DBG=window.__hvdbg||{};
 const {side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000,mv=!!o.mv,amp=mv?1.6:1;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const hem=(sit||rd)?25:28;
 if(!sit&&!rd)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 if(!DBG.noaura)aura(u,t,0,mv);                                     // vòng luồng sáng PHÍA SAU người

 // ---- chân: quần đỏ + ống giày vàng + giày ----
 const leg=(x,lift)=>{r(RDD,x,24,4,3-lift);r(RD,x,24,3,3-lift);r(GD,x,27-lift,4,2);r(GDL,x,27-lift,1,2);r(GDD,x+3,27-lift,1,2);r(S.shoe||GDX,x,29-lift,4,1);r(GD,x,29-lift,1,1)};
 const legs=()=>{
  if(rd){}
  else if(sit)leg(5,0),leg(11,0);
  else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
  else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}};

 // ---- áo choàng ----
 const capeFront=()=>{                                               // nhìn trước: xòe 2 bên sau thân
  for(let y=15;y<=hem;y++){const i=y-15,hw=7+i*.38,sl=sin(t*2.3*amp+i*.42)*(.4+i*.12)*(mv?1.5:1),sr=sin(t*2.3*amp+i*.42+1.9)*(.4+i*.12)*(mv?1.5:1);
   const xl=rnd(10-hw+sl),xr=rnd(10+hw+sr);
   u(CP,xl,y,xr-xl,1);u(CPL,xl+1,y,2,1);u(CPD,xr-3,y,2,1);u(CPD,xl+4,y,1,1);u(CPD,xr-6,y,1,1);
   u(GD,xl,y,1,1);u(GD,xr-1,y,1,1);
   if(y==hem){u(GD,xl,y,xr-xl,1);for(let x=xl+1;x<xr-1;x+=2)u(GDD,x,y,1,1)}}};
 const capeSide=()=>{                                                // nhìn ngang: vạt trải ra phía sau lưng
  for(let y=15;y<=hem;y++){const i=y-15,xl=rnd(6-i*.5-1+sin(t*3*amp+i*.5)*(i*.16)*(mv?1.8:1));
   M(CP,xl,y,9-xl,1);M(CPL,xl+1,y,1,1);M(CPD,xl+3,y,1,1);M(GD,xl,y,1,1);
   if(y==hem)M(GD,xl,y,9-xl,1);else if(y==hem-1)M(CPD,xl+1,y,8-xl,1)}};
 const capeBack=()=>{                                                // nhìn sau: phủ kín lưng
  for(let y=15;y<=hem;y++){const i=y-15,hw=6.8+i*.22,sh=sin(t*2.2*amp+i*.4)*(.2+i*.07)*(mv?1.4:1);
   const xl=rnd(10-hw+sh),xr=rnd(10+hw+sh);
   u(CP,xl,y,xr-xl,1);u(CPL,xl+1,y,2,1);u(CPD,xr-3,y,2,1);u(CPD,10+rnd(sh),y,1,1);u(CPD,xl+4,y,1,1);u(CPD,xr-5,y,1,1);
   u(GD,xl,y,1,1);u(GD,xr-1,y,1,1);
   if(y==hem){u(GD,xl,y,xr-xl,1);for(let x=xl+1;x<xr-1;x+=2)u(GDD,x,y,1,1)}}
  ell(u,GDD,10,20,3.5,3.5);ell(u,GD,10,20,3,3);ell(u,CPD,10,20,2,2);u(GD,9,19,2,2);u(RD,10,20,1,1);u(GDL,8,18,1,1);   // vòng vàng giữa lưng
  u(GD,10,22,1,3);u(GD,9,24,3,1);                                                                                    // đuôi mây
 };


 // ---- ruy băng mảnh bay sau đầu (đứng yên: lượn nhẹ; đi: bay ngược ra sau) ----
 const RLx=(c,x,y,w,h)=>u(c,x,y,w,h),RRx=(c,x,y,w,h)=>u(c,20-x-w,y,w,h);
 const ribF=(s,ph)=>{const w=sin(t*2.4*amp+s*8+ph)*(.4+1.3*s);
  return[3-11*s-(mv?4*s:0),9+5*s+w]};
 const ribbonsFB=()=>{};   // nhìn trước/sau: bỏ ruy băng cho gọn, mặt và tóc luôn rõ
 const ribS=(s,ph)=>[4-34*s-(mv?14*s:0),10+3*s+sin(t*2.6*amp+s*6+ph)*(.5+2.4*s)];   // dải dài gấp đôi
 const ribbonsS=()=>{ribbon(M,ribS,50,0,t)};

 if(!side){
  // ======================= NHÌN TRƯỚC / SAU =======================
  const RL=(c,x,y,w,h)=>u(c,x,y,w,h),RR=(c,x,y,w,h)=>u(c,20-x-w,y,w,h);
  if(!back)capeFront();
  ribbonsFB();
  legs();
  // ---------- thân ----------
  u(RDD,5,15,10,9);u(RD,5,15,9,9);u(RDL,5,16,1,7);u(RDX,13,16,1,7);                  // áo đỏ
  if(!back){
   u(GD,6,15,8,1);u(GDL,6,15,2,1);u(GDD,12,15,2,1);                                  // cổ áo vàng
   // giáp ngực: 2 mảnh vàng + sống giữa
   u(GD,6,16,4,3);u(GD,10,16,4,3);u(GDL,6,16,3,1);u(GDL,10,16,3,1);u(GDD,6,18,4,1);u(GDD,10,18,4,1);u(GDX,9,16,2,3);
   u(JD,9,16,2,2);u(JDL,9,16,1,1);u(JDD,10,17,1,1);u(GDD,9,18,2,1);                    // ngọc lục bảo
   u(RDX,7,20,1,2);u(RDX,10,19,1,3);u(RDX,12,20,1,2);u(RDL,6,19,1,1);                  // nếp áo
   u(GD,6,19,1,1);u(GD,13,19,1,1);                                                    // khuy vàng
  }else{
   u(GD,6,15,8,1);u(GDD,6,16,8,1);u(RDX,9,16,2,6);u(RDL,7,17,1,4);
  }
  // đai vàng + khóa ngọc
  u(GDD,4,22,12,2);u(GD,4,22,12,1);u(GDL,4,22,3,1);
  if(!back){u(GDL,8,21,4,3);u(GD,8,21,4,1);u(JD,9,22,2,1);u(JDD,9,23,2,1);u(JDL,9,22,1,1);u(GDD,8,23,4,1)}
  // váy da hổ + viền vàng
  u(TG,4,24,12,3);u(TGL,5,24,2,1);
  [[5,25],[7,24],[9,25],[11,24],[13,25],[15,24]].forEach(p=>{u(TGD,p[0],p[1],1,2);u(TGD,p[0]+1,p[1],1,1)});
  for(let x=4;x<16;x++)u(x%2?GD:GDD,x,27,1,1);
  // dây tua đỏ rủ từ đai
  if(!back){u(RD,6,24,1,3);u(RDD,6,26,1,1);u(RD,13,24,1,3);u(RDD,13,26,1,1)}
  // ---------- tay: tay áo đỏ + bao tay vàng + bàn tay ----------
  const arm=(x,ay)=>{u(RD,x,17+ay,3,2);u(RDL,x,17+ay,1,2);u(GD,x,19+ay,3,2);u(GDL,x,19+ay,1,1);u(GDD,x,20+ay,3,1);u(SKN,x,21+ay,3,2);u(SKL,x,21+ay,1,2);u(SKS,x+2,22+ay,1,1)};
  arm(1,lg);arm(16,-lg);
  // ---------- vai giáp vàng có gai cong ----------
  const pauld=(x)=>{ // x = mép ngoài trái; vẽ bên trái, bên phải lật gương
   u(GD,x,15,5,2);u(GD,x+1,14,4,1);u(GDL,x+1,14,3,1);u(GDL,x,15,1,1);u(GDD,x,17,5,1);u(GDD,x+4,15,1,2);
   u(RD,x+2,15,2,1);u(RDL,x+2,15,1,1);                                              // viên đá đỏ
   u(GD,x-1,14,1,2);u(GDL,x-1,14,1,1)};                                // gai cong lên
  pauld(0);u(GD,15,15,5,2);u(GD,15,14,4,1);u(GDL,15,14,3,1);u(GDD,15,17,5,1);u(GDD,15,15,1,2);u(RD,16,15,2,1);u(RDL,16,15,1,1);u(GD,20,14,1,2);
  if(back)capeBack();
  // ---------- đầu ----------
  headFB();
   }else{
  // ======================= NHÌN NGANG =======================
  ribbonsS();
  capeSide();
  legs();
  M(RDD,5,15,9,9);M(RD,5,15,8,9);M(RDL,6,16,1,7);M(RDX,12,16,1,7);
  M(GD,6,15,6,1);M(GDL,6,15,2,1);
  M(GD,9,16,4,3);M(GDL,9,16,3,1);M(GDD,9,18,4,1);M(JD,11,16,1,2);M(JDL,11,16,1,1);
  M(RDX,8,20,1,2);M(RDX,11,19,1,3);
  M(GDD,4,22,10,2);M(GD,4,22,10,1);M(GDL,9,21,3,3);M(JD,10,22,1,1);
  M(TG,4,24,10,3);M(TGL,5,24,2,1);[[5,25],[7,24],[9,25],[11,24],[13,25]].forEach(p=>M(TGD,p[0],p[1],1,2));
  for(let x=4;x<14;x++)M(x%2?GD:GDD,x,27,1,1);
  M(RD,10,24,1,3);M(RDD,10,26,1,1);
  const am=rnd(lg);
  M(RD,8+am,17,3,2);M(RDL,8+am,17,1,2);M(GD,8+am,19,3,2);M(GDL,8+am,19,1,1);M(GDD,8+am,20,3,1);M(SKN,8+am,21,3,2);M(SKL,8+am,21,1,2);
  // vai giáp
  M(GD,6,15,6,2);M(GD,7,14,5,1);M(GDL,7,14,3,1);M(GDD,6,17,6,1);M(RD,9,15,2,1);M(RDL,9,15,1,1);M(GD,5,14,1,2);M(GDL,5,14,1,1);
  headS();
 }

 if(!DBG.noaura)sparkles(u,t,mv);                                      // chỉ còn vài tia sáng nhỏ phía trước (không che mặt)

 // ===========================================================================
 //  ĐẦU — vẽ bằng BẢN ĐỒ PIXEL (mỗi ký tự = 1 pixel, xem bảng PAL). Tóc là các lọn lửa 3 tông (sáng ở ngọn, đậm ở gốc).
 //  Mắt / mũi / miệng vẽ bằng code (để biểu cảm faceFx của game vẫn khớp vị trí khuôn mặt chuẩn).
 // ===========================================================================
 function headFB(){
  stamp(u,back?HB:HF);
  if(!back){
   // mặt: nền da (nửa mặt đã nằm trong bản đồ) + đặc điểm
   const bl=(performance.now()%4100)<130;
   if(o.e>0)faceFx(u,o.e,0,0);
   else{
    if(bl){u(DK,6,11,3,1);u(DK,11,11,3,1)}
    else{
     // mắt to 3x3: viền mi trên đậm, lòng cam, đồng tử ở phía mũi, điểm sáng ngoài
     u(DK,6,10,3,1);u(DK,11,10,3,1);
     u(WH,6,11,1,1);u(EYE,7,11,1,1);u(DK,8,11,1,1);
     u(DK,11,11,1,1);u(EYE,12,11,1,1);u(WH,13,11,1,1);
     u(EYL,6,12,1,1);u(EYE,7,12,2,1);u(EYE,11,12,2,1);u(EYL,13,12,1,1);
    }
    u(SKS,9,12,2,1);u(SKX,9,12,1,1);                                      // mũi
    u(DK,8,13,4,1);u(WH,8,13,1,1);u(WH,11,13,1,1);u('#e8605a',9,13,2,1);  // cười nhếch lộ răng nanh
    u('rgba(255,110,90,.55)',5,12,1,1);u('rgba(255,110,90,.55)',14,12,1,1); // má hồng
   }
  }
 }

 function headS(){
  stamp(M,HS);
  // mặt (nhìn ngang): mắt, mũi, miệng
  const bl=(performance.now()%4100)<130;
  if(o.e>0)faceFx(u,o.e,1,Rt);
  else{
   if(bl)M(DK,11,11,3,1);
   else{M(DK,11,10,3,1);M(WH,11,11,1,1);M(EYE,12,11,1,1);M(DK,13,11,1,1);M(EYL,11,12,1,1);M(EYE,12,12,2,1)}
   M(DK,12,13,2,1);M(WH,13,13,1,1);M('rgba(255,110,90,.55)',10,12,1,1);
  }
 }
}

window.drawMascotHauVuong=drawHauVuong;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.mhv=drawHauVuong;
})();
