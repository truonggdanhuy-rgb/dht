/* =====================================================================
   TINYLAND — HÀNH ĐỘNG MỚI: 🪄 GẬY NHƯ Ý — 💎 10
   Chuỗi hành động (lặp lại đến khi bạn di chuyển), chu kỳ 7,4 giây:
     0.0–0.5  Cây gậy vàng hiện ra trên tay (chớp sáng + sao lấp lánh)
     0.5–1.9  Gậy còn nhỏ, nhân vật hô "Hóa to!" (hộp thoại vàng)
     1.9–2.5  Gậy hóa to từng nấc (6 khung hình), mặt đất rung, vòng sóng vàng tỏa ra
     2.5–6.5  GIỮ 4 GIÂY: gậy dài gấp 4 lần nhân vật (120 điểm ảnh), SÉT VÀNG nhảy quanh gậy
     6.5–7.1  Gậy thu nhỏ lại từng nấc
     7.1–7.4  Gậy chớp tắt rồi lặp lại
   Ít khung hình cho nhẹ: gậy to ra/thu nhỏ theo 6 nấc, tia sét đổi hình 8 lần/giây.
   Nạp ở CUỐI index.html (sau actions2.js):  <script src="nhuy.js"></script>
   File tự đăng ký vào ACTS / ACTFX / APOSE → tự có trong Shop kim cương, bảng Hành động, xem trước, đồng bộ online
   (thêm ở CUỐI ACTS nên không lệch số thứ tự). Muốn đổi giá: sửa pr:10 ở cuối file.
   ===================================================================== */
(function(){
'use strict';
if(typeof ACTS==='undefined'||typeof ACTFX==='undefined'||typeof APOSE==='undefined'||typeof actDraw!=='function'){
  console.warn('[nhuy] Không tìm thấy hệ thống Hành động trong index.html — bỏ qua.');return}
if(ACTS.some(a=>a.id==='nhuy'))return;   // đã nạp rồi

const T=7.4,STEPS=[26,40,56,76,98,120];            // chiều dài gậy theo từng nấc (120 = 4 lần chiều cao nhân vật 30)
const rnd=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const al=a=>Math.max(0,Math.min(1,a)).toFixed(2);
const GD='#f8cd4e',GDL='#fff5ac',GDD='#b9871c',GDX='#6e4a10',RD='#d3212f',RDL='#ff5c66',RDD='#8c1226';
const PBY={ol:'#c9921e',f1:'#fff6d0',f2:'#ffffff',f3:'#ffe9a0',tx:'#c2410c',sp:'rgba(255,240,170,.95)'};   // hộp thoại vàng

// trạng thái theo thời gian: L = chiều dài gậy, vis = có hiện không, say = đang hô, big = đang to (giữ), grow = đang đổi cỡ
const ST_=t=>{const u=((t%T)+T)%T;let L=STEPS[0],vis=1,say=0,big=0,grow=0,bornFlash=0;
 if(u<.5){vis=(u>.3||Math.floor(u*12)%2==0)?1:0;bornFlash=1-u/.5}
 else if(u<1.9){say=(u>.8)?1:0}
 else if(u<2.5){L=STEPS[Math.min(5,Math.floor((u-1.9)/.1))];grow=1}
 else if(u<6.5){L=STEPS[5];big=1}
 else if(u<7.1){L=STEPS[Math.max(0,5-Math.floor((u-6.5)/.1))];grow=1}
 else{vis=(Math.floor(u*12)%2==0)?1:0}
 return{u,L,vis,say,big,grow,bornFlash}};

APOSE.nhuy=t=>{const s=ST_(t);
 return{d:0,lift:s.grow?(Math.floor(t*8)%2):0,nosh:0,noacc:1}};

// ---------- cây gậy: viền nâu, thân vàng, đầu đỏ có vòng vàng, khắc vân, ánh sáng chạy dọc ----------
function staff(sx,yb,L,t){
 const W=L>=98?4:L>=56?3:2,x0=sx-(W>>1),top=yb-L,cap=Math.max(3,Math.round(L*.085));
 r(GDX,x0-1,top-1,W+2,L+2);                                                        // viền
 r(GD,x0,top,W,L);r(GDL,x0,top,1,L);r(W>2?GDD:'#d9a521',x0+W-1,top,1,L);          // thân vàng 3 tông
 for(let y=top+cap+6;y<yb-cap-3;y+=Math.max(9,Math.round(L/9))){r(GDD,x0,y,W,1);r(GDL,x0,y+1,1,1)}   // vân khắc
 for(const e of[0,1]){const cy=e?yb-cap+1:top;                                       // hai đầu bịt đỏ
  r(RDD,x0-1,cy-(e?0:1),W+2,cap);r(RD,x0,cy,W,cap-1);r(RDL,x0,cy,1,cap-1);
  r(GDL,x0-1,e?cy-1:cy+cap-1,W+2,1);r(GDD,x0-1,e?cy:cy+cap,W+2,1)}                 // vòng vàng
 const gy=top+cap+2+Math.floor((t*70)%Math.max(1,L-2*cap-4));                      // ánh sáng chạy dọc thân
 r('#ffffff',x0,gy,Math.min(2,W),2)}

// ---------- tia sét vàng zigzag ----------
function bolt(x,y,dx,dy,n,seed,c1,c2){
 const P=[[x,y]];let px=x,py=y;
 for(let i=0;i<n;i++){
  const l=2+Math.floor(rnd(seed+i)*3),j=(i%2?1:-1)*(2+Math.floor(rnd(seed+i+9)*2));
  if(dx){px+=dx*l;py+=j}else{px+=j;py+=dy*l}
  P.push([px,py])}
 for(const c of[[c1,2],[c2,1]])for(let i=1;i<P.length;i++){
  const a=P[i-1],b=P[i],k=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]),1);
  for(let q=0;q<=k;q++)r(c[0],Math.round(a[0]+(b[0]-a[0])*q/k),Math.round(a[1]+(b[1]-a[1])*q/k),c[1],c[1])}}

ACTFX.nhuy={
 back:(X,Y,t,o,p)=>{const s=ST_(t),sx=X+10,yb=Y+1;
  if(!s.vis)return;
  // quầng sáng vàng phía sau gậy + bóng đổ dưới đất
  const gl=s.big?.22:.12,W=s.L>=98?10:6;
  r('rgba(255,214,90,'+al(gl)+')',sx-W,yb-s.L-3,W*2,s.L+6);r('rgba(255,244,190,'+al(gl*.9)+')',sx-(W>>1),yb-s.L,W,s.L);
  E(r,'rgba(255,214,90,'+al(s.big?.3:.16)+')',sx,yb,s.big?13:8,3);
  // sóng xung kích khi gậy to ra
  if(s.u>=1.9&&s.u<2.9){const a=(s.u-1.9)/1.0,rad=4+a*34,n=Math.round(rad*5);
   for(let i=0;i<n;i++){const an=i/n*Math.PI*2;r('rgba(255,226,130,'+al(.75*(1-a))+')',Math.round(sx+Math.cos(an)*rad),Math.round(yb+Math.sin(an)*rad*.34),2,1)}}},
 front:(X,Y,t,o,p)=>{const s=ST_(t),Yg=Y+Math.round(p.lift*.5),sx=X+10,yb=Yg+1,hy=Yg-9,f=Math.floor(t*8);
  // ---- hộp thoại "Hóa to!" ----
  if(s.say&&typeof pbub==='function')pbub(X-2,Yg-58,t,'Hóa to!',PBY);
  if(!s.vis)return;
  staff(sx,yb,s.L,t);
  // bàn tay nắm gậy
  const W=s.L>=98?4:s.L>=56?3:2;
  r('#d99e6a',sx-(W>>1)-1,hy+1,W+2,2);r('#f1c08a',sx-(W>>1)-1,hy,W+2,2);r('#fff0d8',sx-(W>>1)-1,hy,1,1);
  // ---- chớp sáng lúc hiện ra ----
  if(s.bornFlash>0){for(let i=0;i<6;i++){const a=i*Math.PI/3+f*.3,rr=4+(1-s.bornFlash)*14;star4(sx+Math.cos(a)*rr,hy-8+Math.sin(a)*rr,s.bornFlash>.5?2:1,'rgba(255,240,170,'+al(s.bornFlash+.3)+')')}}
  // ---- sét vàng quanh gậy: nhiều khi gậy càng to, đổi hình 8 lần/giây ----
  const nb=s.big?11:(s.L>=56?4:(s.say?2:0));
  for(let i=0;i<nb;i++){
   const sd=f*31+i*17,y=yb-8-rnd(sd)*(s.L-16),side=i%2?1:-1;
   bolt(sx+side*(W/2+1),y,side,0,5+(i%3),sd,'#ffcf30','#fffbe0')}
  if(s.big){
   // tia sét bắn lên từ đầu gậy + chạm xuống đất
   const top=yb-s.L;bolt(sx,top-2,0,-1,4,f*7,'#ffcf30','#fffbe0');bolt(sx+1,top-2,0,-1,3,f*7+5,'#ffcf30','#fffbe0');
   for(let i=0;i<5;i++){const a=f*1.7+i*2.3,x=sx+Math.cos(a)*11,y=yb-2+Math.sin(a*1.3)*2;star4(x,y,1,'rgba(255,226,110,.95)')}
   // sao lấp lánh bay dọc thân gậy
   for(let i=0;i<7;i++){const a=Math.sin(t*3.6+i*2.1);if(a>.35)star4(sx+(rnd(i+3)*2-1)*10,yb-6-rnd(i+8)*(s.L-12),a>.8?2:1,'rgba(255,248,190,.95)')}
   // đầu gậy chói sáng
   if(f%3)star4(sx,top-3,3,'rgba(255,240,150,.95)')}
 }};

// luôn ở CUỐI mảng ACTS (số thứ tự được đồng bộ online)
ACTS.push({id:'nhuy',n:'Gậy Như Ý',e:'🪄',pr:10,k:'solo',ds:'Gậy vàng hiện trên tay, hô "Hóa to!" — gậy liền dài gấp 4 lần nhân vật, sét vàng nổ quanh gậy, giữ 4 giây rồi lặp lại'});

// khung xem trước cao hơn bình thường (gậy cao 120): [nhân chiều rộng, nhân chiều cao]
window.ACTWIDE=Object.assign(window.ACTWIDE||{},{nhuy:[1.25,2.3]});
})();
