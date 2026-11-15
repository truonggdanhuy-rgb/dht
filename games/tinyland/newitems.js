/* ===================================================================================
   NEWITEMS.JS — Cánh (phụ kiện đeo lưng) + Xe bí ngô (thú cưỡi), bán ở Shop kim cương 💎
   -----------------------------------------------------------------------------------
   • 🪽 Cánh Dực Ưng      (ACCS, k:'wingeagle', 💎10) — cánh lông vũ hồng/tím, viền vàng, sao lấp lánh
   • 🌊 Cánh Đại dương    (ACCS, k:'wingocean', 💎10) — cánh màng xanh dương nhạt, bong bóng nước bay lên
   • 🎃 Xe bí ngô         (MOUNTS, k:'pumpkin', 💎15) — xe bí ngô có mũ phù thủy, 2 bánh xe, ánh sáng cam lấp lánh
   Các món này được khai báo ở CUỐI mảng ACCS / MOUNTS trong index.html (không làm lệch số thứ tự đồ đã mua).
   File này chỉ chứa: hàm vẽ + giao diện bán trong Shop kim cương.
   Muốn đổi giá: sửa dia:10 / dia:15 ngay trong index.html (dòng ACCS / MOUNTS).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos;

// ---------- tiện ích vẽ pixel ----------
// tô đa giác bằng cách quét từng hàng (R = hàm vẽ hình chữ nhật của nhân vật)
function poly(R,pts,col){
 let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}
 y0=Math.floor(y0);y1=Math.ceil(y1);
 for(let y=y0;y<y1;y++){const yc=y+.5,xs=[];
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
   if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
  xs.sort((p,q)=>p-q);
  for(let k=0;k+1<xs.length;k+=2){const xa=Math.round(xs[k]),xb=Math.round(xs[k+1]);if(xb>xa)R(col,xa,y,xb-xa,1)}}}
// đường thẳng 1px
function line(R,col,x0,y0,x1,y1){
 x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
 for(let k=0;k<=n;k++)R(col,Math.round(x0+(x1-x0)*k/n),Math.round(y0+(y1-y0)*k/n),1,1)}
// elip đặc
function ell(R,col,cx,cy,rx,ry){
 for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){const dy=(y+.5-cy)/ry;if(Math.abs(dy)>1)continue;
  const hw=Math.round(rx*Math.sqrt(1-dy*dy));if(hw>0)R(col,Math.round(cx)-hw,y,hw*2,1)}}
// ngôi sao lấp lánh (dấu cộng 3x3 / 5x5 hoặc 1 điểm) — a = độ sáng 0..1
function star(R,x,y,a,rgb,big){
 x=Math.round(x);y=Math.round(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.75){R(c(a*.6),x-2,y,1,1);R(c(a*.6),x+2,y,1,1);R(c(a*.6),x,y-2,1,1);R(c(a*.6),x,y+2,1,1);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y,1,1)}}
const hash=n=>{const s=sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};

// ===================================================================================
//  🪽 CÁNH — khung tọa độ nhân vật 20x31 (đầu y4..13, thân y14..25, vai ở y≈16-17)
//  Mỗi cánh được định nghĩa trong hệ (u,v): u = hướng ra ngoài, v = hướng lên trên, gốc = vai.
//  view: 'front' = nhìn trước (cánh vẽ SAU lưng, thò ra hai bên)
//        'back'  = nhìn sau  (cánh phủ lên lưng + tóc)
//        'near' / 'far' = nhìn ngang (cánh gần phủ lên tóc/lưng, cánh xa ló sau lưng)
// ===================================================================================
function flapOf(t,mv){return mv?.10+sin(t*10)*.20:sin(t*2.3)*.07}

// ---- Dực Ưng: cánh lông vũ 2 tầng (tầng trên hồng-trắng viền vàng, tầng dưới tím lavender)
const EAGLE_F=[ // [góc độ, dài, rộng gốc, màu]
 [-24,9,3.2,'v1'],[-6,12,3.4,'v2'],                          // tầng dưới (tím)
 [12,17,3.6,'p3'],[30,20,3.8,'p2'],[48,20,3.6,'p1'],[66,16,3.2,'p0']]; // tầng trên (hồng/trắng)
const EAGLE_C={p0:['#fff4fa','#e9b6d6'],p1:['#ffd3ea','#d98bbd'],p2:['#f9a9d4','#c46aa8'],p3:['#e98fd2','#a850a0'],v1:['#c9b6f7','#8f78d4'],v2:['#a98fe8','#7459c2']};
function featherWing(R,px,py,sgn,rot,scale,flap,far){
 const sh=far?-.18:0;
 EAGLE_F.forEach((f,i)=>{
  const a=(f[0]*PI/180)+flap*(.5+i*.07)+rot,L=f[1]*scale,bw=f[2]*scale*.7,
   dx=cos(a)*sgn,dy=-sin(a),nx=-dy,ny=dx,C=EAGLE_C[f[3]];
  const T=[px+dx*L,py+dy*L],B1=[px+nx*bw,py+ny*bw],B2=[px-nx*bw,py-ny*bw];
  const mk=(w,tw)=>[[px+nx*w,py+ny*w],[T[0]+nx*tw,T[1]+ny*tw],[T[0]-nx*tw,T[1]-ny*tw],[px-nx*w,py-ny*w]];
  poly(R,mk(bw+.9,.9),far?'#9a7fb8':C[1]);                   // viền tối
  poly(R,mk(bw,.35),far?'#d9c4ec':C[0]);                      // thân lông
  line(R,far?'#efe2f8':'#ffffff',px+dx*2.2,py+dy*2.2,px+dx*L*.72,py+dy*L*.72); // sống lông sáng
  if(i>=3&&!far)R('#ffd34d',Math.round(T[0]),Math.round(T[1]),1,1),R('#ffd34d',Math.round(T[0]-dx),Math.round(T[1]-dy),1,1); // đầu lông vàng
 })}

// ---- Đại dương: cánh màng (cánh trên to + cánh dưới nhỏ) xanh dương nhạt
const OC_UP=[[0,1],[4,3],[9,7],[13,12],[14,18],[11,22],[7,19],[4,13],[1,7]];
const OC_LO=[[0,0],[6,0],[11,-3],[13,-8],[9,-12],[5,-9],[1,-4]];
function rot(p,a){return [p[0]*cos(a)-p[1]*sin(a),p[0]*sin(a)+p[1]*cos(a)]}
function memWing(R,px,py,sgn,rotA,scale,flap,far){
 const T=(P,a)=>P.map(p=>{const q=rot([p[0]*scale,p[1]*scale],a);return [px+sgn*q[0],py-q[1]]});
 const cen=P=>{let sx=0,sy=0;P.forEach(p=>{sx+=p[0];sy+=p[1]});return [sx/P.length,sy/P.length]};
 const shr=(P,k)=>{const c=cen(P);return P.map(p=>[c[0]+(p[0]-c[0])*k,c[1]+(p[1]-c[1])*k])};
 const parts=[[OC_LO,rotA-flap*.5],[OC_UP,rotA+flap]];
 parts.forEach(([P,a],ix)=>{
  const W=T(P,a),M=shr(W,.80),I=shr(W,.55);
  poly(R,W,far?'#5f9fd6':'#4a97e0');          // viền xanh đậm
  poly(R,M,far?'#a9dcf8':'#8fd2ff');          // màng chính
  poly(R,shr(W,.5),far?'#d5eefb':'#d3f1ff');   // vùng sáng ở giữa
  // gân cánh
  const gx=W[0][0],gy=W[0][1];[2,4,6].forEach(k=>{if(W[k])line(R,far?'#7fb9e6':'#6db8f2',gx,gy,(gx+W[k][0]*2)/3,(gy+W[k][1]*2)/3)});
  if(!far){const tp=ix?W[4]:W[3];R('#ffffff',Math.round(tp[0]),Math.round(tp[1]),1,1);R('#e8d8ff',Math.round(M[3][0]),Math.round(M[3][1]),1,1)} // lóe sáng + ánh tím nhạt
 })}

// bong bóng nước nhỏ & lớn bay lên từ cánh
function bubbles(R,t,o){ // o:{lx,rx,y,sgn[]}
 const N=9;
 for(let i=0;i<N;i++){
  const ph=(t*.34+i/N+hash(i)*.07)%1,big=i%3==0,side=i%2?1:-1;
  const bx=o.cx+side*(o.sp+hash(i+3)*8)+sin(ph*7+i*1.7)*1.8,by=o.y-ph*(big?30:26)-hash(i+9)*5;
  const a=(ph<.12?ph/.12:ph>.72?(1-ph)/.28:1)*.9,x=Math.round(bx),y=Math.round(by);
  const ring='rgba(176,228,255,'+a.toFixed(2)+')',hi='rgba(255,255,255,'+a.toFixed(2)+')',fl='rgba(200,240,255,'+(a*.3).toFixed(2)+')';
  if(big){R(fl,x-1,y-1,3,3);R(ring,x-1,y-2,3,1);R(ring,x-1,y+2,3,1);R(ring,x-2,y-1,1,3);R(ring,x+2,y-1,1,3);R(hi,x-1,y-1,1,1);R('rgba(255,255,255,'+(a*.6).toFixed(2)+')',x+1,y+1,1,1)}
  else{R(ring,x,y-1,1,1);R(ring,x-1,y,1,1);R(ring,x+1,y,1,1);R(ring,x,y+1,1,1);R(hi,x,y,1,1)}
 }}

// ---- điểm vào: vẽ 1 cặp cánh theo từng góc nhìn
function drawWing(kind,R,view,t,mv,k){
 const flap=flapOf(t,mv),eagle=kind=='eagle',W=eagle?featherWing:memWing,Rt=k.Rt,sideSgn=Rt?-1:1; // sideSgn: hướng "ra sau lưng" khi nhìn ngang
 if(view=='front'){
  const py=17,sc=eagle?1.05:1.1;W(R,5,py,-1,0,sc,flap,0);W(R,15,py,1,0,sc,flap,0);
  fx(kind,R,t,10,py,18)}
 else if(view=='back'){
  const py=17,ra=eagle?-.12:-.2;W(R,7,py,-1,ra,.95,flap,0);W(R,13,py,1,ra,.95,flap,0);
  fx(kind,R,t,10,py,17)}
 else if(view=='far'){W(R,(Rt?6:14)-sideSgn*1.5,15,sideSgn,.55,.85,flap,1)}
 else{ // near
  const ax=Rt?6:14;W(R,ax,17,sideSgn,.4,.95,flap,0);
  fx(kind,R,t,ax+sideSgn*5,14,10)}
}
// hiệu ứng sáng của từng loại cánh
function fx(kind,R,t,cx,y,sp){
 if(kind=='eagle'){ // sao lấp lánh hồng/trắng/vàng quanh cánh
  const cols=['255,255,255','255,150,210','255,226,120'];
  for(let i=0;i<9;i++){
   const side=i%2?1:-1,x=cx+side*(sp*.55+hash(i)*sp*.95),yy=y-12+hash(i+5)*20,a=(sin(t*3.2+i*2.1)+1)/2;
   star(R,x,yy,a,cols[i%3],i%3==0)}
 }else bubbles(R,t,{cx,sp:sp*.35,y:y+6});
}

// ===================================================================================
//  🎃 XE BÍ NGÔ — vẽ theo hệ của thú cưỡi: gốc (0,0) = mặt đất giữa xe, y âm = lên trên,
//  x dương = hướng đầu xe (hàm R tự lật khi quay trái). pt=0: phần SAU người ngồi, pt=1: phần TRƯỚC.
// ===================================================================================
const PK={O:'#f58a1f',L:'#ffb446',LL:'#ffd884',D:'#d9620f',DD:'#a8450a',OL:'#7d3308',IN:'#7a2f0c'};
function bodyRows(R,rx,cy,ry,y0,y1,fr){ // thân bí ngô: elip + múi + viền
 for(let y=y0;y<=y1;y++){
  const dy=(y+.5-cy)/ry;if(Math.abs(dy)>1)continue;
  const hw=Math.round(rx*Math.sqrt(1-dy*dy));if(hw<1)continue;
  R(PK.OL,-hw,y,hw*2,1);                                   // viền
  if(hw>2){R(PK.O,-hw+1,y,hw*2-2,1);
   if(y>=y1-1)R(PK.D,-hw+1,y,hw*2-2,1);                    // đáy tối
   R(PK.L,-hw+1,y,Math.max(1,Math.round(hw*.25)),1);       // mảng sáng bên trái
   for(const f of fr){const x=Math.round(hw*f);R(PK.D,x,y,1,1)}  // múi bí
  }}
 R(PK.LL,-rx+4,y0+1,3,1);R(PK.LL,-rx+3,y0+2,1,1)}          // chấm bóng
function wheel(R,cx,cy,rad,ang){
 for(let y=-rad;y<=rad;y++)for(let x=-rad;x<=rad;x++){
  const d=Math.sqrt(x*x+y*y);if(d>rad+.35)continue;
  let c=d>rad-1?'#6e3510':d>rad-2.2?'#ffcf5a':'#e0801f';
  if(d<rad-1){for(let s=0;s<3;s++){const a=ang+s*PI/3,dist=Math.abs(-x*sin(a)+y*cos(a));if(dist<.55)c='#ffe58f'}}
  if(d<1.3)c='#fff4b8';
  R(c,cx+x,cy+y,1,1)}}
function hatSide(R){ // mũ phù thủy nghiêng ra sau (khung: quay phải; R tự lật)
 poly(R,[[-14,-20],[-6,-20],[-9,-27],[-15,-33],[-15,-27]],'#7a3fb5');
 poly(R,[[-14,-20],[-12,-20],[-13,-27],[-15,-33],[-15,-27]],'#9a63d0');
 poly(R,[[-9,-24],[-6,-20],[-9,-27]],'#5d2f93');
 R('#ff9a2e',-14,-23,8,1);R('#ffd34d',-11,-23,2,1);R('#ffd34d',-11,-22,2,1);  // dải cam + khóa vàng
 ell(R,'#4a2078',-10,-19,8,2);ell(R,'#8a4fc8',-10,-20,8,1);ell(R,'#a874e0',-11,-20,5,1);  // vành mũ
 star(R,-15,-34,.95,'255,225,80',1)}
function hatFront(R){
 poly(R,[[-12,-19],[-5,-19],[-7,-25],[-11,-30],[-12,-25]],'#7a3fb5');
 poly(R,[[-12,-19],[-10,-19],[-11,-25],[-11,-30],[-12,-25]],'#9a63d0');
 R('#ff9a2e',-12,-22,7,1);R('#ffd34d',-9,-22,2,2);
 ell(R,'#4a2078',-8.5,-18,7,2);ell(R,'#8a4fc8',-8.5,-19,7,1);ell(R,'#a874e0',-9.5,-19,4,1);
 star(R,-11,-31,.95,'255,225,80',1)}
// ánh sáng cam bling bling bay lên
function glow(R,t,spread,top){
 for(let i=0;i<13;i++){
  const ph=(t*.55+i*.077)%1,x=Math.round(hash(i)*2*spread-spread+sin(t*2+i)*1.2),y=Math.round(-5-ph*top-(i%3));
  const a=(ph<.1?ph/.1:ph>.65?(1-ph)/.35:1)*.95,tw=(sin(t*9+i*2.3)+1)/2;
  if(i%3==0)star(R,x,y,a*(.5+tw*.5),'255,214,90',1);
  else if(i%3==1){R('rgba(255,170,40,'+a.toFixed(2)+')',x,y,2,2);R('rgba(255,240,170,'+(a*.8).toFixed(2)+')',x,y,1,1)}
  else R('rgba(255,200,70,'+(a*(.4+tw*.6)).toFixed(2)+')',x,y,1,1)}}
function pumpkinDraw(R,d,f,b,t,pt,c){
 const mv=!!(c&&c.mv),ph=mv?(c.ph||0):0,side=d>1,RR=(col,x,y,w,h)=>R(col,x,y+b,w,h);
 if(side){
  if(!pt){
   R('rgba(255,170,40,.10)',-17,-3,34,3);                                   // quầng sáng cam dưới đất
   RR(PK.IN,-12,-20,24,2);RR('#5a210a',-12,-20,24,1);                       // thành trong phía sau
   hatSide((col,x,y,w,h)=>RR(col,x,y,w,h));
  }else{
   RR(PK.DD,-13,-7,26,1);                                                   // trục xe
   bodyRows(RR,14,-10.5,8,-18,-3,[-.62,-.22,.25,.64]);
   RR(PK.LL,-12,-18,24,1);RR(PK.L,-13,-17,2,1);RR(PK.L,11,-17,2,1);         // gờ miệng bí
   // đèn nhỏ nhấp nháy dọc gờ
   for(let i=0;i<5;i++){const on=(Math.floor(t*3)+i)%2;RR(on?'#fff6b0':'#ffb030',-9+i*4.5|0,-18,1,1)}
   const sp=mv?ph*.9:0;
   wheel(RR,-8,-5,5,sp);wheel(RR,8,-5,5,sp);
   // dây leo + lá xanh ở đầu xe
   [[11,-19],[12,-20],[13,-21],[13,-22],[12,-23],[11,-23],[11,-22]].forEach(p=>RR('#58b840',p[0],p[1],1,1));
   RR('#3f9a35',13,-19,3,1);RR('#3f9a35',14,-20,2,1);RR('#7ed860',13,-19,1,1);
   glow(RR,t,15,24)}
 }else{
  const back=d==1;
  if(!pt){
   R('rgba(255,170,40,.10)',-13,-3,26,3);
   RR(PK.IN,-9,-20,18,2);RR('#5a210a',-9,-20,18,1);
   if(!back)hatFront((col,x,y,w,h)=>RR(col,x,y,w,h));
  }else{
   bodyRows(RR,12,-10.5,8,-18,-3,[-.5,0,.5]);
   RR(PK.LL,-10,-18,20,1);RR(PK.L,-11,-17,2,1);RR(PK.L,9,-17,2,1);
   for(let i=0;i<5;i++){const on=(Math.floor(t*3)+i)%2;RR(on?'#fff6b0':'#ffb030',-8+i*4,-18,1,1)}
   // bánh xe nhìn ngang (mỏng) hai bên
   const sy=Math.round(sin(ph)*3);
   for(const x0 of[-15,12]){RR('#6e3510',x0+1,-10,2,1);RR('#6e3510',x0,-9,4,8);RR('#6e3510',x0+1,-1,2,1);RR('#ffcf5a',x0+1,-9,2,8);RR('#e0801f',x0+1,-7,2,4);RR('#ffe58f',x0+1,-6+sy,2,1);RR('#fff4b8',x0+1,-5,2,1)}
   if(back)hatFront((col,x,y,w,h)=>RR(col,x,y,w,h));
   else{ // đèn pha nhỏ phía trước
    RR('#fff0a0',-6,-8,2,2);RR('#fff0a0',4,-8,2,2);RR('rgba(255,240,160,.35)',-7,-9,4,4);RR('rgba(255,240,160,.35)',3,-9,4,4)}
   glow(RR,t,13,24)}
 }}

// ===================================================================================
//  Xuất ra để index.html gọi
// ===================================================================================
window.WINGS={eagle:(R,view,t,mv,k)=>drawWing('eagle',R,view,t,mv,k),ocean:(R,view,t,mv,k)=>drawWing('ocean',R,view,t,mv,k)};
window.pumpkinDraw=pumpkinDraw;
const bobOf=o=>{const f=o.mv?Math.floor(o.a*9)%4:0;return o.nobob?0:o.mv?((f==1||f==3)?-1:0):0};
const wingOf=o=>{if(!(o.acc>=0)||typeof ACCS=='undefined')return null;const A=ACCS[o.acc];return A&&A.t=='wing'?A:null};
// nhìn trước: cánh nằm SAU thân → vẽ trước khi vẽ nhân vật; nhìn ngang: chỉ cánh xa nằm sau thân
window.WingBack=function(r,o,k){
 if(k.rd||k.sit)return;const A=wingOf(o);if(!A)return;const bob=bobOf(o),t=performance.now()/1000,R=(c,x,y,w,h)=>r(c,x,y+bob,w,h);
 if(!k.side&&!k.back)WINGS[A.wing](R,'front',t,!!o.mv,k);else if(k.side)WINGS[A.wing](R,'far',t,!!o.mv,k)};
// nhìn sau / cánh gần khi nhìn ngang: cánh phủ lên tóc & lưng → vẽ sau cùng
window.WingFront=function(r,o,c){
 const A=wingOf(o);if(!A)return;const bob=bobOf(o),t=performance.now()/1000,R=(col,x,y,w,h)=>r(col,x,y+bob,w,h);
 if(c.back)WINGS[A.wing](R,'back',t,!!o.mv,c);else if(c.side)WINGS[A.wing](R,'near',t,!!o.mv,c)};

// ===================================================================================
//  Shop kim cương: mục Cánh & Thú cưỡi (diaShop trong index.html gọi diaWingRows / diaMountRows)
// ===================================================================================
function rows(arr,own,cls,buy,wear,cur){
 return arr.map((x,i)=>{if(!x.dia)return '';const have=(own||[]).includes(i),ok=(ST.dia|0)>=x.dia;
  return '<div class="dcd"><canvas class="'+cls+'" data-i="'+i+'" width="144" height="176"></canvas><b>'+x.n+'</b>'+
   (have?'<button class="b" onclick="'+wear+'('+i+')">'+(cur==i?'✓ Đang dùng':'✓ Đã có • Dùng')+'</button>'
        :'<button class="b" style="'+(ok?'':'opacity:.6')+'" onclick="'+buy+'('+i+')">💎 '+x.dia+'</button>')+'</div>'}).join('')}
window.diaWingRows=()=>rows(ACCS,ST.own.a,'dsc dac','diaBuyA','diaWearA',ST.av.a);
window.diaMountRows=()=>rows(MOUNTS,ST.own.m,'dsc dmc','diaBuyM','diaWearM',ST.av.m);
window.diaBuyA=i=>{const x=ACCS[i];if(!x||!x.dia||ST.own.a.includes(i))return;
 if((ST.dia|0)<x.dia)return toast('💎 Chưa đủ kim cương — cần '+x.dia+', bạn có '+(ST.dia|0));
 ST.dia-=x.dia;ST.own.a.push(i);xuUp();save();toast('🎉 Đã mua '+x.n+'!\nMở 🎒 Túi → Phụ kiện để đeo');diaShop()};
window.diaWearA=i=>{if(!ST.own.a.includes(i))return;ST.av.a=ST.av.a==i?-1:i;save();toast(ST.av.a==i?'✨ Đã đeo '+ACCS[i].n+'\n(cánh ẩn khi cưỡi thú / ngồi nghỉ)':'Đã tháo '+ACCS[i].n);diaShop()};
window.diaBuyM=i=>{const x=MOUNTS[i];if(!x||!x.dia||ST.own.m.includes(i))return;
 if((ST.dia|0)<x.dia)return toast('💎 Chưa đủ kim cương — cần '+x.dia+', bạn có '+(ST.dia|0));
 ST.dia-=x.dia;ST.own.m.push(i);xuUp();save();toast('🎉 Đã mua '+x.n+'!\nMở 🎒 Túi → Thú cưỡi để dùng');diaShop()};
window.diaWearM=i=>{if(!ST.own.m.includes(i))return;ST.av.m=ST.av.m==i?-1:i;if(ST.av.m>=0&&Pl.sit){Pl.sit=0;Pl.mv=0}save();toast(ST.av.m==i?'✨ Đã cưỡi '+MOUNTS[i].n:'Đã xuống '+MOUNTS[i].n);diaShop()};
})();

/* ===================================================================================
   🥖 BÁNH MÌ (xe bánh mì ở Phố xá) & 🧋 NƯỚC MÍA (quán cô Ba ở Công viên)
   • Bấm vào quầy → hộp thoại mua. Mỗi lần mua tốn BUFF_COST xu và ăn/uống NGAY (không vào Túi).
   • Hiệu ứng: đi bộ nhanh hơn (x1.4) trong 10 phút. Chỉ tính khi đi bộ — đang cưỡi thú thì dùng tốc độ thú cưỡi, KHÔNG cộng dồn.
   • Mua lại khi còn hiệu ứng = làm mới lại đủ 10 phút (không cộng dồn thời gian).
   • Hết hạn lưu theo giờ thật (ST.spdEnd) nên thoát game vẫn tính giờ.
   Muốn đổi giá/thời gian/tốc độ: BUFF_COST, BUFF_MIN ở đây; hệ số 1.4 nằm ở dòng tính tốc độ trong index.html (spdBuff()?1.4).
   =================================================================================== */
(function(){
const BUFF_COST=50,BUFF_MIN=10;
const KIND={
 bm:{e:'🥖',n:'Bánh mì',t:'Xe bánh mì',say:'Bánh mì nóng giòn đây con ơi!',act:'Ăn',did:'🥖 Bạn ăn ổ bánh mì nóng giòn, thơm phức!'},
 nm:{e:'🧋',n:'Nước mía',t:'Quán nước cô Ba',say:'Nước mía mới ép, mát lắm nghen!',act:'Uống',did:'🧋 Bạn uống ly nước mía mát lạnh, đã quá!'}};
// còn hiệu ứng không? (tự dọn khi hết hạn)
window.spdBuff=function(){
 if(!(ST.spdEnd>0))return 0;
 if(Date.now()>=ST.spdEnd){ST.spdEnd=0;try{save()}catch(e){}toast('🍃 Hiệu ứng đi nhanh đã hết');return 0}
 return 1};
const left=()=>Math.max(0,Math.ceil((ST.spdEnd-Date.now())/1000));
const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
window.buffShopUI=function(k){
 const K=KIND[k];if(!K)return;
 const on=window.spdBuff(),ok=ST.xu>=BUFF_COST;
 openUI(head(K.e+' '+K.t)
  +'<div style="text-align:center;font-size:44px;margin:4px 0">'+K.e+'</div>'
  +'<div class="mut" style="text-align:center">“'+K.say+'”</div>'
  +'<div class="mut" style="text-align:center">'+K.n+' <b>🪙 '+BUFF_COST+' Xu</b> • '+K.act+' ngay tại chỗ<br>⚡ Đi bộ nhanh hơn trong <b>'+BUFF_MIN+' phút</b><br><small>Không cộng dồn với thú cưỡi (chỉ tính khi đi bộ)</small></div>'
  +(on?'<div class="mut" style="text-align:center">⏱️ Đang có hiệu ứng, còn <b>'+fmt(left())+'</b> (mua thêm sẽ làm mới lại '+BUFF_MIN+' phút)</div>':'')
  +'<div class="mut" style="text-align:center">Bạn có 🪙 <b>'+fmtXu(ST.xu)+'</b> Xu</div>'
  +'<div class="pf"><button class="b" style="'+(ok?'':'opacity:.6')+'" onclick="buffBuy(\''+k+'\')">'+K.e+' Mua & '+K.act.toLowerCase()+' — '+BUFF_COST+' Xu</button><button class="b" onclick="closeUI()">Thôi</button></div>')};
window.buffBuy=function(k){
 const K=KIND[k];if(!K)return;
 if(ST.xu<BUFF_COST)return toast('🪙 Chưa đủ Xu — cần '+BUFF_COST+' Xu, bạn có '+ST.xu);
 ST.xu-=BUFF_COST;ST.spdEnd=Date.now()+BUFF_MIN*60000;xuUp();save();
 toast(K.did+'\n⚡ Đi bộ nhanh hơn trong '+BUFF_MIN+' phút!');
 buffShopUI(k)};
})();
