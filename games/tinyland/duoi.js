/* ===================================================================================
   DUOI.JS — 🦊 2 ĐUÔI HỒ LY (phụ kiện đeo lưng dưới, hoạt động giống CÁNH / BALO):
     • Đuôi Mộng hồ ly (k:'tailmong', tail:'mong') — chùm đuôi TÍM, đầu đuôi vàng cam, sao lấp lánh + lửa ma xanh nhạt
     • Đuôi Hỏa hồ ly  (k:'tailfire', tail:'fire') — chùm đuôi ĐỎ, đầu đuôi là lửa XANH NHẠT, tàn lửa bay lên
   • Giống cánh: nhìn SAU / nhìn NGANG đuôi vẽ ĐÈ LÊN tóc + thân (tóc dài cũng không che được đuôi);
     nhìn TRƯỚC đuôi nằm sau thân, thò ra hai bên. Chỉ làm phần dưới, sát đất (từ eo xuống chân).
   • Tự ẩn khi cưỡi thú / ngồi nghỉ — như cánh. Chỉ đeo 1 phụ kiện / lần.
   • Khai báo món: 2 dòng CUỐI mảng ACCS trong index.html (t:'wing', tail:'mong'|'fire', dia:15).
   • Giá: dia:15 (kim cương) ngay trong dòng ACCS. Muốn đổi giá chỉ sửa số này.
   • File này phải nằm SAU balo.js trong index.html (vì móc nối vào WingBack / WingFront của balo + cánh).
   • Muốn thêm đuôi mới: thêm 1 bảng màu vào PAL + 1 dòng cuối ACCS (tail:'tên').
   Quy ước vẽ: R(màu,x,y,w,h) theo lưới nhân vật 20 px (thân x 5..14, y 16..24, chân tới y 29).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,abs=Math.abs,rnd=Math.round;
const hash=n=>{const s=sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};

// ---------- bảng màu: các mốc màu từ GỐC đuôi (s=0) tới ĐẦU đuôi (s=1) ----------
const PAL={
 mong:{stops:[[0,'#4f1d8c'],[.35,'#8b30c4'],[.62,'#c14dd6'],[.74,'#ef8a4a'],[.88,'#ffb445'],[1,'#ffe27a']]},
 fire:{stops:[[0,'#6a0c17'],[.35,'#b51b25'],[.6,'#e43a2b'],[.72,'#ff7a45'],[.84,'#9fd9ff'],[1,'#e6f7ff']]}
};
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const toHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,rnd(v))).toString(16).padStart(2,'0')).join('');
function colAt(st,s){
 for(let i=1;i<st.length;i++){if(s<=st[i][0]){const a=st[i-1],b=st[i],k=(s-a[0])/(b[0]-a[0]||1),A=hx(a[1]),B=hx(b[1]);
  return [A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k,A[2]+(B[2]-A[2])*k]}}
 return hx(st[st.length-1][1])}
const shade=(c,k)=>k>=0?c.map(v=>v+(255-v)*k):c.map(v=>v*(1+k));   // k>0 sáng hơn, k<0 tối hơn

// ---------- vẽ 1 chiếc đuôi cong: tâm đuôi đi từ gốc, hướng ang (rad, y hướng lên), cong dần về phía trên ----------
function stamp(bx,by,ang,len,wid,curl,st,dk,out,tips){
 const n=Math.max(10,rnd(len*2.4)),ds=len/n,M=new Map(),K=(px,py)=>(px+60)*300+(py+60);let x=bx,y=by;
 for(let i=0;i<=n;i++){
  const s=i/n,a=ang+curl*s,
   w=wid*(s<.4?.6+s:Math.max(0,1-Math.pow((s-.4)/.6,1.6)));            // to ở giữa, nhọn dần về đầu
  const nx=sin(a),ny=cos(a);
  for(let o=-w;o<=w+.01;o+=.4){
   const px=rnd(x+nx*o),py=rnd(y+ny*o),key=K(px,py),old=M.get(key);
   if(!old||abs(o)/(w||1)<old.e)M.set(key,{x:px,y:py,s,e:abs(o)/(w||1),sd:w>0?o/w:0})}
  x+=cos(a)*ds;y-=sin(a)*ds}
 tips.push([rnd(x),rnd(y)]);
 M.forEach(p=>{
  const edge=!M.has(K(p.x-1,p.y))||!M.has(K(p.x+1,p.y))||!M.has(K(p.x,p.y-1))||!M.has(K(p.x,p.y+1));
  let c=colAt(st,p.s);
  if(edge)c=shade(c,p.s>.8?-.3:-.5);                  // viền tối (đầu đuôi viền nhẹ hơn)
  else if(p.sd<-.35)c=shade(c,.2);                     // mép sáng
  else if(p.sd>.55)c=shade(c,-.14);                    // mép tối
  if(dk)c=shade(c,-dk);
  out.push([p.x,p.y,toHex(c)])})}

// ---------- chùm đuôi theo từng góc nhìn (có cache theo độ lắc để đỡ tốn máy) ----------
// mỗi đuôi: [góc độ (0=sang phải,90=lên,180=sang trái), dài, nửa rộng]
const CACHE=new Map();
function fan(kind,view,Rt,far,sw){
 const key=kind+view+Rt+far+sw,hit=CACHE.get(key);if(hit)return hit;
 const st=PAL[kind].stops,out=[],tips=[],sg=sw*.05;let L=[],bx=10,by=26,dk=0;
 if(view=='front'){           // sau thân: chỉ thấy phần thò ra hai bên + sát đất
  by=27;L=[[184,10,1.7],[158,13,2],[132,14,2],[-4,10,1.7],[22,13,2],[48,14,2]]}
 else if(view=='back'){       // đè lên thân + tóc: xòe quạt từ eo, sát đất
  by=28;L=[[6,10,1.6],[174,10,1.6],[34,12.5,1.9],[146,12.5,1.9],[62,13,2],[118,13,2],[90,12,2.1]]}
 else{                        // nhìn ngang: đuôi buông ra sau lưng, tip cong lên
  bx=Rt?7:13;by=25;
  const B=far?[[2,10,1.5],[34,11,1.7]]:[[-8,10,1.8],[18,13,2],[44,13,2],[70,11,1.9]];
  if(far){dk=.3;bx+=Rt?1:-1}
  L=B.map(b=>[Rt?180-b[0]:b[0],b[1],b[2]])}
 L.forEach(l=>{
  const c=cos(l[0]*PI/180),curl=(c>.05?1:c<-.05?-1:0)*.55+sg;
  stamp(bx+c*2.6,by-sin(l[0]*PI/180)*1.2,l[0]*PI/180+sg,l[1],l[2],curl,st,dk,out,tips)});
 const res={px:out,tips};CACHE.set(key,res);return res}
const paint=(R,F)=>{const p=F.px;for(let i=0;i<p.length;i++)R(p[i][2],p[i][0],p[i][1],1,1)};

// ---------- hiệu ứng ----------
function star(R,x,y,a,rgb,big){
 x=rnd(x);y=rnd(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.75){R(c(a*.6),x-2,y,1,1);R(c(a*.6),x+2,y,1,1);R(c(a*.6),x,y-2,1,1);R(c(a*.6),x,y+2,1,1);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y,1,1)}}
function fx(R,kind,t,cx,cy,sp,tips){
 if(kind=='mong'){
  for(let i=0;i<7;i++){   // sao lấp lánh trắng-xanh quanh đuôi
   const x=cx+(hash(i)*2-1)*sp,y=cy-hash(i+7)*13,a=(sin(t*3+i*2.1)+1)/2;
   star(R,x,y,a,i%3?'210,238,255':'255,255,255',i%3==0)}
  for(let i=0;i<3;i++){   // lửa ma xanh nhạt bay lên
   const ph=(t*.45+i/3)%1,x=rnd(cx+(i-1)*sp*.75+sin(ph*6+i*2)*1.6),y=rnd(cy-ph*15),
    a=(ph<.15?ph/.15:ph>.7?(1-ph)/.3:1)*.85;
   R('rgba(150,215,255,'+(a*.55).toFixed(2)+')',x,y,1,3);R('rgba(205,238,255,'+a.toFixed(2)+')',x,y+1,1,2);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y+2,1,1)}
  tips.forEach((p,i)=>{const a=(sin(t*4+i*1.9)+1)/2;if(a>.6)star(R,p[0],p[1],a,'255,230,120',0)})   // đầu đuôi vàng lóe sáng
 }else{
  for(let i=0;i<8;i++){   // tàn lửa cam bay lên
   const ph=(t*.7+i*.125)%1,x=rnd(cx+(hash(i)*2-1)*sp+sin(t*5+i)*1),y=rnd(cy-ph*16),a=(ph<.1?ph/.1:1-ph)*.95;
   R('rgba('+(i%2?'255,150,50':'255,225,110')+','+a.toFixed(2)+')',x,y,1,1)}
  tips.forEach((p,i)=>{   // đầu đuôi là lửa xanh nhạt nhấp nháy
   const h=1+Math.floor((sin(t*11+i*2.3)+1)*1.5);
   for(let k=1;k<=h;k++)R(k==h?'rgba(255,255,255,.85)':'rgba(170,225,255,'+(1-k*.18).toFixed(2)+')',p[0]+(k==2&&i%2?1:0),p[1]-k,1,1)})
 }}

// ---------- móc vào hệ cánh + balo có sẵn ----------
const oldBack=window.WingBack,oldFront=window.WingFront;
const tailOf=o=>{if(!(o.acc>=0)||typeof ACCS=='undefined')return null;const A=ACCS[o.acc];return A&&A.tail?A:null};
const bobOf=o=>{const f=o.mv?Math.floor(o.a*9)%4:0;return o.nobob?0:o.mv?((f==1||f==3)?-1:0):0};
const swOf=(o,t)=>o.mv?rnd(sin(t*9)*3):rnd(sin(t*1.8)*2);

// nhìn trước: đuôi sau thân; nhìn ngang: chỉ các đuôi xa nằm sau thân
window.WingBack=function(r,o,k){
 const A=tailOf(o);if(!A)return oldBack&&oldBack(r,o,k);
 if(k.rd||k.sit||o.ride)return;
 const t=performance.now()/1000,bob=bobOf(o),R=(c,x,y,w,h)=>r(c,x,y+bob,w,h),sw=swOf(o,t);
 if(!k.side&&!k.back){const F=fan(A.tail,'front',0,0,sw);paint(R,F);fx(R,A.tail,t,10,24,9,F.tips)}
 else if(k.side)paint(R,fan(A.tail,'side',k.Rt?1:0,1,sw))};
// nhìn sau / các đuôi gần khi nhìn ngang: đè lên tóc + thân → vẽ sau cùng
window.WingFront=function(r,o,c){
 const A=tailOf(o);if(!A)return oldFront&&oldFront(r,o,c);
 if(o.ride||o.sit==2)return;
 const t=performance.now()/1000,bob=bobOf(o),R=(col,x,y,w,h)=>r(col,x,y+bob,w,h),sw=swOf(o,t);
 if(c.back){const F=fan(A.tail,'back',0,0,sw);paint(R,F);fx(R,A.tail,t,10,24,9,F.tips)}
 else if(c.side){const F=fan(A.tail,'side',c.Rt?1:0,0,sw);paint(R,F);fx(R,A.tail,t,c.Rt?3:17,22,6,F.tips)}};
window.TAIL_PAL=PAL;
})();
