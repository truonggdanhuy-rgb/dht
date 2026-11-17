/* ===================================================================================
   HAUVUONG.JS — Mascot MỸ HẦU VƯƠNG (Tôn Ngộ Không) — bán ở Shop kim cương 💎15 (cùng giá set Ma đồng giáng thế / Na Tra)
   • Tóc cam dựng đứng như lửa, có kim cô vàng uốn (băng đô + hai vòng cuộn ở thái dương + ngọc đỏ giữa trán)
   • Tóc phủ xuống má thành tóc mai + RÂU QUAI NÓNG ôm hàm. Tai khỉ nhọn. Mắt đỏ cam, mày dựng.
   • Có sẵn BIỂU CẢM (cười nhếch, lộ răng nanh, chớp mắt). Nếu chọn biểu cảm khác trong Túi thì mặt đổi theo (tóc mai + râu vẫn giữ).
   • HAI SỢI DÂY dài thật dài buộc trên tóc, tung bay theo gió (đi bộ thì bay mạnh hơn), đầu dây có tua vàng.
   • Áo giáp đỏ viền vàng, vai giáp vàng có gai cong, ngọc lục bảo ở ngực & đai, váy da hổ, giày vàng.
   • VẠT ÁO CHOÀNG RỘNG đỏ thẫm viền vàng sau lưng (nhìn sau thấy hoa văn vòng vàng).
   • LUỒNG VẦN VŨ vàng & xanh dương xoáy quanh người (vòng sau – vòng trước), tia sáng lấp lánh.
   Khai báo 1 món ở CUỐI mảng SETS (index.html) + thêm 'mhv' vào DSETS. File này chỉ chứa HÀM VẼ.
   Muốn đổi giá: sửa dia:15 trong index.html.
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
const RB='#ff5a28',RBL='#ffae78',RBD='#a82a0c';                                                  // dây tóc

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
// 1 gai tóc: thân cam, mép trái sáng, mép phải tối, một đường gân đậm ở giữa
function spike(R,a,tip,b){
 poly(R,[a,tip,b],HR);
 poly(R,[[(a[0]+b[0])/2,(a[1]+b[1])/2],tip,b],HRD);
 line(R,HRL,a[0]+1,a[1]-1,tip[0],tip[1]+1);
 line(R,HRX,b[0]-1,b[1]-1,(b[0]+tip[0])/2,(b[1]+tip[1])/2);
 R(HRH,tip[0],tip[1],1,1)}
function star(R,x,y,a,rgb,big){
 x=rnd(x);y=rnd(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.75){R(c(a*.6),x-2,y,1,1);R(c(a*.6),x+2,y,1,1);R(c(a*.6),x,y-2,1,1);R(c(a*.6),x,y+2,1,1);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y,1,1)}}

// ---------- DÂY TÓC DÀI (2 sợi) — fn(s,ph) trả [x,y] theo s=0..1 ----------
function cord(R,fn,n,ph,t){
 const P=[];for(let i=0;i<=n;i++)P.push(fn(i/n,ph));
 for(let i=0;i<=n;i++){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(RBD,x+1,y,1,1);R(RBD,x,y+1,1,1)}
 for(let i=0;i<=n;i++){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(RB,x,y,1,1)}
 for(let i=1;i<=n;i+=3){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(RBL,x,y,1,1)}
 for(let i=7;i<n-4;i+=12){const x=rnd(P[i][0]),y=rnd(P[i][1]);R(GDD,x,y,2,2);R(GD,x,y,2,1);R(GDL,x,y,1,1)}   // hạt vàng đính dọc dây
 const e=P[n],ex=rnd(e[0]),ey=rnd(e[1]),sw=rnd(sin(t*5+ph)*.8);                                                // tua vàng + tua đỏ ở đầu dây
 R(GDD,ex-1,ey,3,2);R(GD,ex-1,ey,3,1);R(GDL,ex-1,ey,1,1);
 R(RD,ex-1+sw,ey+2,1,3);R(RDD,ex+sw,ey+2,1,4);R(RD,ex+1+sw,ey+2,1,3)}

// ---------- LUỒNG VẦN VŨ vàng + xanh dương xoáy quanh người (part 0 = vòng sau, 1 = vòng trước) ----------
const STR=[{rgb:['255,210,63','255,243,160','232,150,20'],ph:0,dir:1},
           {rgb:['63,180,255','190,238,255','31,100,224'],ph:PI*.5,dir:1},
           {rgb:['255,210,63','255,243,160','232,150,20'],ph:PI,dir:1},
           {rgb:['63,180,255','190,238,255','31,100,224'],ph:PI*1.5,dir:1}];
function aura(u,t,part,mv){
 const N=90,spd=mv?2.4:1.35;
 STR.forEach((S,si)=>{
  for(let k=0;k<=N;k++){
   if(part&&k%9>6)continue;                                              // vòng trước: ngắt thành vệt; vòng sau: liền mạch
   const s=k/N,a=t*spd+S.ph+s*PI*3.3,z=sin(a);
   if((z>0?1:0)!==part)continue;
   const R=(part?11.5:10.5+s*3)+2.4*sin(s*PI*1.3+t*1.1+si),x=10+R*cos(a),y=34-s*40+sin(t*2+si+s*6)*.8;
   if(part&&y<15)continue;                                               // vòng trước không che mặt
   const env=Math.pow(sin(s*PI),.5),al=(part?.85:.6)*env;if(al<.14)continue;
   const xi=rnd(x),yi=rnd(y),f=al.toFixed(2),w=part?2:(env>.6?3:2);
   u('rgba('+S.rgb[2]+','+f+')',xi,yi,w,w);
   u('rgba('+S.rgb[0]+','+f+')',xi,yi,w-1,w-1);
   if(k%4==0)u('rgba('+S.rgb[1]+','+(part?'.95':'.6')+')',xi,yi,1,1);
  }});
}
function sparkles(u,t,mv){
 for(let i=0;i<14;i++){
  const P=1.7+(i%5)*.45,ph=((t/P)+i*.173)%1,ang=i*2.399+t*.35*(i%2?1:-1);
  const R=7+((i*37)%9),x=10+R*cos(ang),y=26-ph*36+sin(t*3+i)*1.2;
  const a=Math.min(1,ph*5,(1-ph)*2.2);if(a<.12)continue;
  star(u,x,y,a,i%2?'160,226,255':'255,226,110',i%4==0)}
 // tia chớp xanh nhỏ quanh đầu
 const q=flr(t*7)%9;if(q<3){const bx=[3,15,-1][q],by=[-3,-5,8][q];
  const pts=[[0,0],[1,1],[0,2],[1,3],[2,4]];pts.forEach(p=>u('rgba(190,238,255,.95)',bx+p[0],by+p[1],1,1));u('rgba(63,180,255,.7)',bx+1,by+1,1,1)}
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

 // ---- dây tóc dài (đứng yên: rủ & lượn nhẹ; đi: bay ngược ra sau) ----
 const cordF=(sg)=>(s,ph)=>{const w=sin(t*2.4*amp+s*10+ph)*(.6+1.8*s);
  return[10+sg*(8+15*sin(s*PI*.95)-5*s+(mv?3*s:0)+w),5+27*s-9*sin(s*PI)+sin(t*1.7+s*5+ph)*1.2*s]};
 const cordS=(s,ph)=>[6-32*s-(mv?9*s:0),6+4*s+sin(t*3*amp+s*9+ph)*(.8+3.2*s)+(mv?0:7*s)];
 const cordB=(sg)=>(s,ph)=>{const w=sin(t*2.2*amp+s*9+ph)*(.6+1.6*s);
  return[10+sg*(7+8*sin(s*PI*.9)-2*s+w),7+26*s+sin(t*1.5+s*4+ph)*1.2*s]};

 if(!side){
  // ======================= NHÌN TRƯỚC / SAU =======================
  const RL=(c,x,y,w,h)=>u(c,x,y,w,h),RR=(c,x,y,w,h)=>u(c,20-x-w,y,w,h);
  if(!back){cord(RL,cordF(-1),64,0,t);cord(RR,cordF(-1),64,1.9,t);capeFront()}
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
   u(GD,x-1,13,1,3);u(GDL,x-1,13,1,1);u(GD,x,12,1,2)};                                // gai cong lên
  pauld(0);u(GD,15,15,5,2);u(GD,15,14,4,1);u(GDL,15,14,3,1);u(GDD,15,17,5,1);u(GDD,15,15,1,2);u(RD,16,15,2,1);u(RDL,16,15,1,1);u(GD,20,13,1,3);u(GD,19,12,1,2);
  if(back)capeBack();
  // ---------- đầu ----------
  headFB();
  if(back){cord(RL,cordB(-1),58,0,t);cord(RR,cordB(-1),58,1.9,t)}
 }else{
  // ======================= NHÌN NGANG =======================
  cord(M,cordS,64,0,t);cord(M,(s,ph)=>{const p=cordS(s,ph);return[p[0]+1.5,p[1]+3+sin(t*2.6+s*5+ph)*1.3*s]},56,2.1,t);
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
  M(GD,6,15,6,2);M(GD,7,14,5,1);M(GDL,7,14,3,1);M(GDD,6,17,6,1);M(RD,9,15,2,1);M(RDL,9,15,1,1);M(GD,5,13,1,3);M(GD,6,12,1,2);M(GDL,5,13,1,1);
  headS();
 }

 if(!DBG.noaura){aura(u,t,1,mv);sparkles(u,t,mv)}                      // vòng luồng sáng PHÍA TRƯỚC người

 // ===========================================================================
 //  ĐẦU nhìn trước / sau
 // ===========================================================================
 function headFB(){
  const sw=rnd(sin(t*2)*.6);
  // tai khỉ
  SY(SKN,1,9,3,3);SY(SKS,1,10,1,2);SY(SKL,2,9,1,1);SY(SKX,1,11,1,1);
  if(!back)SY(SKS,2,10,1,1);
  // gai tóc dựng (sau → trước)
  const SPK=[
   [[3,8],[-2,0],[6,3]],[[14,3],[22,0],[17,8]],                       // gai bay ngang hai bên
   [[3,6],[1,-6],[9,4]],[[11,4],[19,-6],[17,6]],
   [[5,5],[6,-9],[11,4]],[[9,4],[14,-9],[15,5]],
   [[6,5],[10+sw,-14],[14,5]]];
  SPK.forEach(q=>spike(u,q[0],q[1],q[2]));
  // khối tóc trên đầu
  ell(u,HR,10,6,7,3);u(HR,3,5,14,3);u(HRD,3,7,14,1);
  [[6,4],[9,3],[12,4],[8,5],[14,5]].forEach(p=>u(HRL,p[0],p[1],1,1));[[5,6],[11,6],[15,6]].forEach(p=>u(HRX,p[0],p[1],1,1));
  if(back){
   // gáy: tóc phủ kín
   u(HR,3,7,14,6);u(HRD,3,12,14,1);u(HRL,5,8,2,1);u(HRL,12,9,2,1);u(HRL,9,10,1,2);u(HRX,7,9,1,3);u(HRX,13,8,1,3);
   for(let x=4;x<16;x+=2)u(HRX,x,13,1,1);
   // đuôi tóc dài xõa ra sau lưng
   poly(u,[[5,12],[4,19],[8,13]],HR);poly(u,[[12,13],[16,19],[15,12]],HR);poly(u,[[8,12],[10,17],[12,12]],HRD);
   line(u,HRL,5,13,4,18);line(u,HRL,15,13,16,18);
   // kim cô sau gáy
   u(GDD,3,7,14,1);u(GD,3,6,14,1);u(GDL,5,6,2,1);u(GDL,11,6,3,1);u(GD,9,6,2,2);u(GDL,9,6,1,1);
  }else{
   // mặt
   u(SKN,5,8,10,5);u(SKN,6,13,8,1);u(SKL,5,8,2,3);u(SKS,14,9,1,4);u(SKS,6,13,8,1);u(SKN,8,13,4,1);
   // tóc mai (sideburn) phủ má + râu quai nón ôm hàm
   poly(u,[[3,7],[0,12],[3,15],[6,14],[6,8]],HR);poly(u,[[17,7],[20,12],[17,15],[14,14],[14,8]],HR);
   u(HR,3,7,2,6);u(HR,15,7,2,6);u(HRL,3,8,1,4);u(HRL,16,8,1,4);u(HRD,4,9,1,4);u(HRD,15,9,1,4);
   u(HR,4,13,2,2);u(HR,14,13,2,2);u(HRD,4,14,2,1);u(HRD,14,14,2,1);
   u(HRX,2,12,1,2);u(HRX,17,12,1,2);u(HRL,1,11,1,1);u(HRL,18,11,1,1);u(HRL,5,12,1,1);u(HRL,14,12,1,1);
   // râu cằm
   const bd=(o.e>0);
   u(HR,6,14,2,1);u(HR,12,14,2,1);u(HRD,7,15,2,1);u(HRD,11,15,2,1);u(HRL,6,14,1,1);u(HRL,12,14,1,1);
   if(!bd){u(HRD,8,14,4,1);u(HR,9,14,2,1);u(HRX,9,15,2,1)}else{u(HRD,8,14,4,1)}
   // chân mày dựng + mắt
   const bl=(performance.now()%4100)<130;
   u(HRO,6,8,2,1);u(HRO,8,9,1,1);u(HRO,12,8,2,1);u(HRO,11,9,1,1);u(HRX,5,8,1,1);u(HRX,14,8,1,1);
   if(o.e>0)faceFx(u,o.e,0,0);
   else{
    if(bl){u(DK,6,11,3,1);u(DK,11,11,3,1)}
    else{
     u(DK,6,10,3,1);u(DK,11,10,3,1);
     u(EYL,6,11,1,1);u(EYE,7,11,2,1);u(DK,8,11,1,1);u(EYE,11,11,2,1);u(DK,11,11,1,1);u(EYL,13,11,1,1);
     u(WH,6,11,1,1);u(WH,13,11,1,1)}
    u(SKS,9,12,2,1);u(SKX,9,12,1,1);                                    // mũi
    u(DK,8,13,4,1);u(WH,8,13,1,1);u(WH,11,13,1,1);u('#e8605a',9,13,2,1);   // cười nhếch lộ răng nanh
    u('rgba(255,110,90,.5)',6,12,1,1);u('rgba(255,110,90,.5)',13,12,1,1);    // má hồng
   }
  }
  // kim cô: băng vàng + vòng cuộn ở thái dương + ngọc đỏ giữa trán
  if(!back){
   u(GDD,3,7,14,1);u(GD,3,6,14,1);u(GDL,4,6,3,1);u(GDL,10,6,2,1);u(GDD,14,6,2,1);
   u(GD,9,4,2,4);u(GDL,9,4,1,2);u(RD,9,6,2,2);u(RDL,9,6,1,1);u(RDD,10,7,1,1);u(GDD,8,7,4,1);   // ngọc đỏ giữa trán
   u(GD,8,5,1,1);u(GD,11,5,1,1);u(GD,7,6,1,1);u(GD,12,6,1,1);
   // vòng cuộn hai bên
   const cp=(c,x,y)=>{u(c,x,y,1,1);u(c,19-x,y,1,1)};
   [[1,7],[1,6],[1,5],[2,4],[3,4],[4,5],[4,6],[3,6]].forEach(p=>cp(GD,p[0],p[1]));cp(GDL,2,4);cp(GDD,4,6);cp(GDD,1,7);
  }
 }

 // ===========================================================================
 //  ĐẦU nhìn ngang (hướng phải)
 // ===========================================================================
 function headS(){
  const sw=rnd(sin(t*2)*.6);
  const SPK=[
   [[4,6],[-6,-2],[8,4]],[[3,9],[-7,6],[7,6]],[[3,11],[-5,14],[7,10]],      // tóc xõa dài ra sau
   [[4,6],[1,-7],[9,4]],[[6,5],[6,-10],[12,4]],[[8,5],[13+sw,-12],[14,6]]];
  SPK.forEach(q=>spike(M,q[0],q[1],q[2]));
  // khối đầu
  M(HR,3,5,10,3);M(HRD,3,7,10,1);
  // mặt
  M(SKN,8,8,6,5);M(SKN,9,13,4,1);M(SKL,9,9,2,2);M(SKS,13,10,1,3);M(SKN,14,11,1,2);M(SKS,14,12,1,1);   // mũi nhô ra
  // tai khỉ
  M(SKN,6,9,3,3);M(SKS,7,10,1,2);M(SKL,6,9,1,1);M(SKX,6,11,1,1);
  // tóc sau tai + tóc mai + râu
  M(HR,3,8,4,6);M(HRD,3,13,4,1);M(HRL,3,9,1,3);M(HRX,5,10,1,3);
  M(HR,7,8,2,6);M(HRD,8,9,1,5);M(HRL,7,9,1,3);                                    // tóc mai trước tai
  M(HR,8,13,4,2);M(HRD,8,14,4,1);M(HRL,8,13,1,1);M(HR,12,13,2,1);M(HRX,13,14,1,1);M(HR,11,15,2,1); // râu quai nón + cằm
  // chân mày + mắt
  M(HRO,11,8,3,1);M(HRX,13,9,1,1);
  const bl=(performance.now()%4100)<130;
  if(o.e>0)faceFx(u,o.e,1,Rt);
  else{
   if(bl)M(DK,11,11,3,1);
   else{M(DK,11,10,3,1);M(EYL,11,11,1,1);M(EYE,12,11,2,1);M(DK,13,11,1,1);M(WH,11,11,1,1)}
   M(DK,12,13,2,1);M(WH,13,13,1,1);M('rgba(255,110,90,.5)',10,12,1,1);
  }
  // kim cô
  M(GDD,3,7,10,1);M(GD,3,6,10,1);M(GDL,4,6,3,1);M(GDL,9,6,2,1);
  M(GD,11,4,2,4);M(GDL,11,4,1,2);M(RD,11,6,2,2);M(RDL,11,6,1,1);M(GDD,10,7,3,1);M(GD,10,5,1,1);
  [[3,7],[2,6],[2,5],[3,4],[4,4],[5,5],[5,6]].forEach(p=>M(GD,p[0],p[1],1,1));M(GDL,3,4,1,1);M(GDD,5,6,1,1);   // vòng cuộn phía sau
 }
}

window.drawMascotHauVuong=drawHauVuong;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.mhv=drawHauVuong;
})();
