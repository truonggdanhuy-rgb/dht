/* ===================================================================================
   SKATE.JS — 🛹 VÁN TRƯỢT (thú cưỡi, nhân vật ĐỨNG trên ván). Ván GỐC = "Ván trượt cam".
   • Đi: nhân vật đứng lướt, hơi khuỵu gối, bánh xe quay, có vệt gió phía sau.
   • Đứng yên: nhân vật CHỐNG 1 CHÂN xuống đất, chân kia gác trên ván; vài giây lại ĐẠP đuôi ván hất mũi ván lên nhẹ.
   • Muốn thêm ván mới: (1) thêm 1 bảng màu vào SKPAL bên dưới (copy khối 'orange' rồi đổi màu),
                         (2) thêm 1 dòng CUỐI mảng MOUNTS trong index.html (copy dòng "Ván trượt cam", đổi n / k / tên bảng màu 'orange' → tên mới).
   Quy ước vẽ: R(màu,x,y,w,h) quanh điểm chân (0,0); hướng TRÁI = lật gương hướng PHẢI (drawRide lo).
   v2: ván dài hơn (32px), đầu ván cong mềm, chân dùng khớp gối cong NHẸ theo tỉ lệ (không còn gập góc), chuyển động có easing.
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,rnd=Math.round,sqrt=Math.sqrt,hyp=Math.hypot;
// ---------- bảng màu các loại ván (mỗi ván = 1 bảng) ----------
const SKPAL={
 orange:{edge:'#d9320f',deck:'#ff7a1a',deckL:'#ff9a3a',mid:'#ffb02e',flame:'#ffd23a',flameL:'#fff08a',under:'#b82a0c',
         truck:'#4ccc2a',truckD:'#2f9a1a',wheel:'#3b4ff0',wheelL:'#7f92ff',wheelD:'#232fb0',hub:'#ffffff'}
};
// ---------- nhịp hành động khi đứng yên: chống chân ... rồi đạp đuôi hất ván ----------
const CYC=3.6;
const ease=x=>x*x*(3-2*x);                              // smoothstep: vào/ra mềm
function phase(t,mv){
 if(mv)return{u:-1,pre:-1,k:0,tilt:0,kick:0};
 const u=((t%CYC)+CYC)%CYC,
  pre=(u>=2.1&&u<2.4)?(u-2.1)/.3:-1,                    // nhấc chân sau
  k=(u>=2.4&&u<3.2)?ease(sin((u-2.4)/.8*PI)):0;         // ván hất lên rồi hạ xuống mềm
 return{u,pre,k,tilt:rnd(6*k),kick:(u>=2.1&&u<3.2)?1:0}}
window.skHov=(t,mv)=>mv?1:2+(phase(t,0).k>.4?1:0);      // đi: khuỵu gối nhẹ • đứng yên: hạ thấp người, đạp ván thì khom thêm
window.skLean=(mv,d)=>mv?(d>1?1:0):3;                   // đi: hơi chúi về trước • đứng yên: nghiêng về phía chân chống

// ---------- hình học ván ----------
const WX=[-10,9];                                       // tâm 2 bánh xe
const XL=-16,XR=15;                                     // đuôi / mũi ván (rộng 32px)
const yo=(tilt,x)=>tilt?-rnd(tilt*(x-XL)/(XR-XL)):0;    // độ nâng của ván tại cột x (xoay quanh đuôi ván)
// độ cong 2 đầu ván: càng xa bánh xe càng cong lên (mềm hơn bản cũ)
const kick=x=>{const e=Math.max(WX[0]-x,x-WX[1]);return e<=1?0:e<=3?-1:e<=5?-2:-3};

// ---------- thân ván ----------
function skDraw(key,R,d,f,b,t,pt,c){
 if(pt)return;                                          // ván không có lớp phủ trên người
 const P=SKPAL[key]||SKPAL.orange,mv=c.mv,side=d>1,p=phase(t,mv),tl=p.tilt;
 // vệt gió phía sau khi lướt (chỉ khi nhìn ngang)
 if(mv&&side)for(let i=0;i<3;i++){const u=(t*3+i/3)%1;R('rgba(255,255,255,'+(.55*(1-u)).toFixed(2)+')',-19-rnd(u*8),-10+i*3,3-rnd(u*2),1)}
 // trục xe (xanh lá) + bánh xe (xanh dương, có chấm sáng quay)
 for(const wx of WX){const y=yo(tl,wx),cy=-3+y;
  R(P.truck,wx-2,-6+y,5,1);R(P.truckD,wx-1,-5+y,3,1);
  R(P.wheel,wx-1,cy-2,3,5);R(P.wheel,wx-2,cy-1,5,3);
  R(P.wheelL,wx-1,cy-2,2,1);R(P.wheelL,wx-2,cy-1,1,1);R(P.wheelD,wx-1,cy+2,3,1);R(P.wheelD,wx+1,cy,2,2);
  const a=mv?(c.ph||0)*1.1:.8;R(P.hub,wx+rnd(cos(a)*1.3),cy+rnd(sin(a)*1.3),1,1)}
 // mặt ván: viền đỏ cam, ruột cam, vệt lửa vàng ở giữa, 2 đầu cong lên mềm
 for(let x=XL;x<=XR;x++){
  const yk=kick(x),y0=-9+yk+yo(tl,x),ctr=x>=WX[0]&&x<=WX[1];
  if(x==XL||x==XR){R(P.edge,x,y0+1,1,1);R(P.under,x,y0+2,1,1);continue}
  R(ctr?(x%4==0?P.flameL:P.flame):(x<WX[0]?P.edge:P.deckL),x,y0,1,1);
  R(x>=-6&&x<=5?P.mid:P.deck,x,y0+1,1,1);
  R(P.under,x,y0+2,1,1)}
}

// ---------- 1 chân 2 khúc: khớp gối cong NHẸ theo tỉ lệ (hết kiểu gập khuỷu) ----------
// hx,hy = hông • fx,fy = bàn chân • dir = +1 gối cong ra phía trước(+x), -1 ra phía sau, 0 = tự chọn (dùng nhìn thẳng)
// bend = độ cong (1.00 = chân thẳng; 1.10 = cong nhẹ; 1.25 = khuỵu rõ)
function leg(R,c,hx,hy,fx,fy,dir,bend){
 const dx=fx-hx,dy=fy-hy,d=hyp(dx,dy)||1,l=d/2,L=l*bend,h=sqrt(Math.max(0,L*L-l*l));
 let nx=dy/d,ny=-dx/d;                                  // pháp tuyến (hướng gối)
 if(nx*dir<0){nx=-nx;ny=-ny}
 const kx=hx+dx/2+nx*h,ky=hy+dy/2+ny*h,hi=shade(c,.22);
 pxl(R,c,hx,hy,kx,ky,3);pxl(R,c,kx,ky,fx,fy,3);        // đùi + cẳng cùng dày 3px → liền mạch
 pxl(R,hi,hx,hy,kx,ky,1);                               // vệt sáng mép đùi
 return[rnd(fx),rnd(fy)]}

// ---------- chân người ----------
function skLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const mv=c&&c.mv,t=(c&&c.t)||0,p=phase(t,mv),hy=sy-1+(hv||0),SDl=shade(SD,.25),PTs=shade(PT,-.3),
  shoe=(x,y)=>{R(SD,x-2,y,5,2);R(SDl,x-2,y,5,1)};
 // chân sau: gác trên đuôi ván; khi đạp thì nhấc lên rồi dậm xuống đuôi ván (có easing)
 const rx=p.kick?-10:(mv?-6:-4),lift=p.pre>=0?rnd(4*sin(p.pre*PI)):0,ry=-11+yo(p.tilt,rx)-lift;
 if(d>1){
  // nhìn NGANG: 2 chân so le trước/sau, gối cong nhẹ về phía trước
  const hx=sx+1;
  let q=leg(R,PTs,hx,hy,rx,ry,1,mv?1.10:1.16);shoe(q[0]+1,q[1]);        // chân sau (tối hơn)
  if(mv)q=leg(R,PT,hx,hy,5,-11,1,1.12),shoe(q[0]+1,q[1]);               // đi: chân trước gác trên ván
  else q=leg(R,PT,hx,hy,10,-2,1,1.03),shoe(q[0]+1,-2);                  // đứng yên: chân trước chống xuống đất (gần thẳng)
 }else{
  // nhìn TRƯỚC/SAU: 2 chân dạng ngang ván, gối cong ra ngoài rất nhẹ
  const xl=sx-3,xr=sx+2;
  let q=leg(R,PTs,xl,hy,rx+1,ry,-1,1.08);shoe(q[0],q[1]);
  if(mv)q=leg(R,PT,xr,hy,5,-11,1,1.08),shoe(q[0]+1,q[1]);
  else q=leg(R,PT,xr,hy,9,-3,1,1.03),shoe(q[0]+1,-2)}
}
window.skDraw=skDraw;window.skLegs=skLegs;
})();
