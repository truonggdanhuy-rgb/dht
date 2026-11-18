/* ===================================================================================
   DUOI.JS — 🦊 2 ĐUÔI HỒ LY (phụ kiện đeo lưng dưới, hoạt động giống CÁNH / BALO):
     • Đuôi Mộng hồ ly (k:'tailmong', tail:'mong') — chùm đuôi TÍM, đầu đuôi vàng cam, sao lấp lánh + lửa ma xanh nhạt
     • Đuôi Hỏa hồ ly  (k:'tailfire', tail:'fire') — chùm đuôi ĐỎ, đầu đuôi là lửa XANH NHẠT, tàn lửa bay lên
   • Đuôi TO, xòe rộng như đóa sen, KHÔNG bị giới hạn trong khung 20 px của nhân vật (vẽ tràn ra hai bên + lên cao).
     Mỗi đuôi là 1 chiếc lá bầu ở giữa, vát mượt, đầu đuôi uốn như ngọn lửa.
   • Giống cánh: nhìn SAU / nhìn NGANG đuôi vẽ ĐÈ LÊN tóc + thân (tóc dài cũng không che được đuôi);
     nhìn TRƯỚC đuôi nằm sau thân, xòe ra hai bên.
   • Tự ẩn khi cưỡi thú / ngồi nghỉ — như cánh. Chỉ đeo 1 phụ kiện / lần.
   • Khai báo món: 2 dòng CUỐI mảng ACCS trong index.html (t:'wing', tail:'mong'|'fire', dia:15).
   • Giá: dia:15 (kim cương) ngay trong dòng ACCS. Muốn đổi giá chỉ sửa số này.
   • File này phải nằm SAU balo.js trong index.html (vì móc nối vào WingBack / WingFront của balo + cánh).
   • Chỉnh to/nhỏ: sửa số "dài" và "rộng" trong 3 bảng LAYOUT bên dưới (front / back / side).
   • Muốn thêm đuôi mới: thêm 1 bảng màu vào PAL + 1 dòng cuối ACCS (tail:'tên').
   Quy ước vẽ: R(màu,x,y,w,h) theo lưới nhân vật 20 px (thân x 5..14, y 16..24, chân tới y 29).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,abs=Math.abs,rnd=Math.round;
const hash=n=>{const s=sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};

// ---------- bảng màu: 6 dải từ GỐC đuôi tới ĐẦU đuôi (ranh giới dải ở BAND) ----------
const BAND=[.26,.48,.64,.77,.9];
const PAL={
 mong:['#4a1a82','#7f2bbd','#b043d3','#ef8a4a','#ffc04d','#ffe784'],
 fire:['#5d0a14','#a8161f','#dd3a2b','#ff7a45','#9fd9ff','#e6f7ff']
};
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const toHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,rnd(v))).toString(16).padStart(2,'0')).join('');
const shade=(c,k)=>k>=0?c.map(v=>v+(255-v)*k):c.map(v=>v*(1+k));   // k>0 sáng hơn, k<0 tối hơn

// ---------- vẽ 1 chiếc đuôi: thân lá bầu, cong dần lên trên, đầu uốn như ngọn lửa ----------
// bx,by = gốc • ang = hướng (rad, y hướng lên) • len = dài • wid = nửa rộng • dir = hướng cong (+1 phải, -1 trái, 0 thẳng)
function stamp(bx,by,ang,len,wid,dir,sg,pal,dk,out,tips){
 const n=Math.max(14,rnd(len*3)),ds=len/n,M=new Map(),K=(px,py)=>(px+90)*400+(py+90);let x=bx,y=by;
 for(let i=0;i<=n;i++){
  const s=i/n,
   a=ang+sg+dir*(.62*Math.pow(s,1.35))-dir*.55*Math.pow(Math.max(0,(s-.72)/.28),2),        // cong dần + đầu đuôi hất ngược như ngọn lửa
   w=wid*Math.pow(sin(PI*Math.min(1,(s+.14)/1.14)),.62);                                     // bầu ở giữa, thon mượt về đầu (không phải tam giác)
  const nx=sin(a),ny=cos(a);
  for(let o=-w;o<=w+.01;o+=.35){
   const px=rnd(x+nx*o),py=rnd(y+ny*o),key=K(px,py),e=w>0?abs(o)/w:0,old=M.get(key);
   if(!old||e<old.e)M.set(key,{x:px,y:py,s,e,sd:w>0?o/w:0})}
  x+=cos(a)*ds;y-=sin(a)*ds}
 tips.push([rnd(x),rnd(y)]);
 M.forEach(p=>{
  const edge=!M.has(K(p.x-1,p.y))||!M.has(K(p.x+1,p.y))||!M.has(K(p.x,p.y-1))||!M.has(K(p.x,p.y+1));
  const s2=p.s+.07*abs(p.sd);                                       // ranh giới màu cong mềm, không cắt ngang thẳng
  let bi=0;while(bi<BAND.length&&s2>BAND[bi])bi++;
  let c=hx(pal[bi]);
  if(edge)c=shade(c,bi>=4?-.32:-.5);                                // viền tối (đầu đuôi viền nhẹ hơn)
  else if(p.sd<-.5)c=shade(c,.2);                                   // vệt sáng dọc đuôi
  else if(p.sd>.62)c=shade(c,-.16);                                 // mép tối
  if(dk)c=shade(c,-dk);
  out.push([p.x,p.y,toHex(c)])})}

// ---------- 3 BẢNG LAYOUT: mỗi đuôi = [góc độ (0=sang phải, 90=lên, 180=sang trái), dài, nửa rộng] ----------
const LAYOUT={
 // nhìn TRƯỚC: đuôi nằm sau thân, xòe rộng hai bên + vươn cao qua vai
 front:[[188,16,3.2],[-8,16,3.2],[160,20,3.7],[20,20,3.7],[134,22,3.9],[46,22,3.9],[112,21,3.8],[68,21,3.8]],
 // nhìn SAU: đóa sen đè lên thân + tóc, đuôi giữa thấp hơn, hai bên cao
 back:[[4,14,3],[176,14,3],[30,19,3.6],[150,19,3.6],[58,22,3.9],[122,22,3.9],[90,16,3.8]],
 // nhìn NGANG: [góc ra sau lưng so với phương ngang, dài, rộng]; far = các đuôi ló sau thân
 side:[[-10,14,3],[14,18,3.5],[38,21,3.8],[62,20,3.7],[84,16,3.4]],
 sideFar:[[2,13,2.8],[26,17,3.2],[52,18,3.3]]
};

// ---------- dựng chùm đuôi (cache theo độ lắc để đỡ tốn máy) ----------
const CACHE=new Map();
function fan(kind,view,Rt,far,sw){
 const key=kind+view+Rt+far+sw,hit=CACHE.get(key);if(hit)return hit;
 const pal=PAL[kind].slice(),out=[],tips=[],sg=sw*.035;let L,bx=10,by=28,dk=0,sp=4;
 if(view=='front'){by=27;L=LAYOUT.front}
 else if(view=='back'){by=28;L=LAYOUT.back}
 else{bx=Rt?7:13;by=25;sp=0;
  const B=far?LAYOUT.sideFar:LAYOUT.side;
  if(far){dk=.3;bx+=Rt?1:-1}
  L=B.map(b=>[Rt?180-b[0]:b[0],b[1],b[2]])}
 L.forEach(l=>{
  const r=l[0]*PI/180,c=cos(r),dir=c>.05?1:c<-.05?-1:0;
  stamp(bx+c*sp*.6,by-sin(r)*1.2,r,l[1],l[2],dir,sg,pal,dk,out,tips)});
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
  for(let i=0;i<11;i++){   // sao lấp lánh trắng-xanh quanh đuôi
   const x=cx+(hash(i)*2-1)*sp,y=cy-4-hash(i+7)*20,a=(sin(t*3+i*2.1)+1)/2;
   star(R,x,y,a,i%3?'210,238,255':'255,255,255',i%3==0)}
  for(let i=0;i<4;i++){   // lửa ma xanh nhạt bay lên
   const ph=(t*.4+i/4)%1,x=rnd(cx+(i-1.5)*sp*.55+sin(ph*6+i*2)*1.8),y=rnd(cy-2-ph*22),
    a=(ph<.15?ph/.15:ph>.7?(1-ph)/.3:1)*.85;
   R('rgba(150,215,255,'+(a*.55).toFixed(2)+')',x,y,1,4);R('rgba(205,238,255,'+a.toFixed(2)+')',x,y+1,1,2);R('rgba(255,255,255,'+a.toFixed(2)+')',x,y+3,1,1)}
  tips.forEach((p,i)=>{const a=(sin(t*4+i*1.9)+1)/2;if(a>.6)star(R,p[0],p[1],a,'255,230,120',0)})   // đầu đuôi vàng lóe sáng
 }else{
  for(let i=0;i<12;i++){   // tàn lửa cam bay lên
   const ph=(t*.7+i*.083)%1,x=rnd(cx+(hash(i)*2-1)*sp+sin(t*5+i)*1),y=rnd(cy-2-ph*24),a=(ph<.1?ph/.1:1-ph)*.95;
   R('rgba('+(i%2?'255,150,50':'255,225,110')+','+a.toFixed(2)+')',x,y,1,1)}
  tips.forEach((p,i)=>{   // đầu đuôi là lửa xanh nhạt nhấp nháy
   const h=2+Math.floor((sin(t*11+i*2.3)+1)*1.6);
   for(let k=1;k<=h;k++)R(k==h?'rgba(255,255,255,.85)':'rgba(170,225,255,'+(1-k*.14).toFixed(2)+')',p[0]+(k==3&&i%2?1:0),p[1]-k,1,1)})
 }}

// ---------- móc vào hệ cánh + balo có sẵn ----------
const oldBack=window.WingBack,oldFront=window.WingFront;
const tailOf=o=>{if(typeof ACCS=='undefined')return null;const i=wgIx(o);if(!(i>=0))return null;const A=ACCS[i];return A&&A.tail?A:null};
const bobOf=o=>{const f=o.mv?Math.floor(o.a*9)%4:0;return o.nobob?0:o.mv?((f==1||f==3)?-1:0):0};
const swOf=(o,t)=>o.mv?rnd(sin(t*9)*3):rnd(sin(t*1.8)*2);

// nhìn trước: đuôi sau thân; nhìn ngang: chỉ các đuôi xa nằm sau thân
window.WingBack=function(r,o,k){
 const A=tailOf(o);if(!A)return oldBack&&oldBack(r,o,k);
 if(k.rd||k.sit||o.ride)return;
 const t=performance.now()/1000,bob=bobOf(o),R=(c,x,y,w,h)=>r(c,x,y+bob,w,h),sw=swOf(o,t);
 if(!k.side&&!k.back){const F=fan(A.tail,'front',0,0,sw);paint(R,F);fx(R,A.tail,t,10,26,15,F.tips)}
 else if(k.side)paint(R,fan(A.tail,'side',k.Rt?1:0,1,sw))};
// nhìn sau / các đuôi gần khi nhìn ngang: đè lên tóc + thân → vẽ sau cùng
window.WingFront=function(r,o,c){
 const A=tailOf(o);if(!A)return oldFront&&oldFront(r,o,c);
 if(o.ride||o.sit==2)return;
 const t=performance.now()/1000,bob=bobOf(o),R=(col,x,y,w,h)=>r(col,x,y+bob,w,h),sw=swOf(o,t);
 if(c.back){const F=fan(A.tail,'back',0,0,sw);paint(R,F);fx(R,A.tail,t,10,26,15,F.tips)}
 else if(c.side){const F=fan(A.tail,'side',c.Rt?1:0,0,sw);paint(R,F);fx(R,A.tail,t,c.Rt?-2:22,24,9,F.tips)}};
window.TAIL_PAL=PAL;
})();
