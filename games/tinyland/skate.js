/* ===================================================================================
   SKATE.JS — 🛹 VÁN TRƯỢT (thú cưỡi, nhân vật ĐỨNG trên ván). Ván GỐC = "Ván trượt cam".
   v3 (viết lại phần chân cho ĐÚNG GIẢI PHẪU):
   • Ván THẤP lại (cao ~5px thay vì ~9px) và ngắn hơn (26px) → chân người không còn phải dài ngoằng.
   • Mỗi chân là 2 đoạn đùi/cẳng BẰNG NHAU (tổng chiều dài cố định) → chân không bao giờ "co giãn" kỳ quặc.
   • ĐẦU GỐI LUÔN HƯỚNG VỀ PHÍA TRƯỚC (hướng nhân vật nhìn), không bao giờ gập ra sau.
   • Đứng yên: CHÂN TRƯỚC chống thẳng xuống đất • CHÂN SAU đặt trên đuôi ván, gối co về phía trước;
     thỉnh thoảng chân sau nhấc lên ĐẠP đuôi ván, mũi ván hất lên nhẹ.
   • Đi: 2 chân đứng trên ván, 2 gối cùng co về phía trước (tư thế trượt thật).
   Muốn thêm ván mới: (1) thêm 1 bảng màu vào SKPAL, (2) thêm 1 dòng CUỐI mảng MOUNTS trong index.html.
   Quy ước vẽ: R(màu,x,y,w,h) quanh điểm chân (0,0); hướng TRÁI = lật gương hướng PHẢI (drawRide lo).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,rnd=Math.round,sqrt=Math.sqrt,hyp=Math.hypot;
const SKPAL={
 orange:{edge:'#d9320f',deck:'#ff7a1a',deckL:'#ff9a3a',mid:'#ffb02e',flame:'#ffd23a',flameL:'#fff08a',under:'#b82a0c',
         truck:'#9aa3b5',truckD:'#5d667a',wheel:'#3b4ff0',wheelL:'#7f92ff',wheelD:'#232fb0',hub:'#ffffff'},
 // ván HỀ: mặt ván trắng – đỏ – xanh – vàng, bánh xe vàng, có BONG BÓNG buộc ở đuôi ván (balloon)
 clown:{edge:'#3b32d6',deck:'#ffffff',deckL:'#ffffff',mid:'#ffd23a',flame:'#e8303a',flameL:'#3b9bff',under:'#2c24b0',
         truck:'#9aa3b5',truckD:'#5d667a',wheel:'#ffd23a',wheelL:'#fff3a0',wheelD:'#d99a14',hub:'#e8303a',
         balloon:{b:'#e8303a',l:'#ff9a9a',d:'#a8161e',s:'#f5f5fa'}}
};
// ---------- nhịp hành động khi đứng yên ----------
// 2.0-2.4s: chân sau NHẤC lên, đưa RA TRƯỚC • 2.4-3.2s: dậm xuống ĐẦU (mũi) ván → đuôi ván hất lên • 3.2-3.6s: thu chân về chỗ cũ
const CYC=3.6;
const ease=x=>x*x*(3-2*x);
function phase(t,mv){
 if(mv)return{u:-1,sw:0,k:0,tilt:0,arc:0};
 const u=((t%CYC)+CYC)%CYC;
 let sw=0,arc=0,k=0;                                   // sw: 0 = chân sau ở đuôi ... 1 = chân sau ở mũi ván
 if(u>=2.0&&u<2.4){const q=(u-2.0)/.4;sw=ease(q);arc=sin(q*PI)}
 else if(u>=2.4&&u<3.2){sw=1;k=ease(sin((u-2.4)/.8*PI))}
 else if(u>=3.2){const q=(u-3.2)/.4;sw=1-ease(q);arc=sin(q*PI)}
 return{u,sw,k,tilt:rnd(4*k),arc}}
// hov: độ hạ hông (dương = hạ thấp). lean: dịch thân theo trục x.
window.skHov=(t,mv)=>0;
window.skLean=(mv,d)=>mv?0:1;

// ---------- hình học ván (THẤP: tổng cao 5px) ----------
const WX=[-7,6];                  // tâm 2 bánh xe
const XL=-13,XR=12;               // đuôi / mũi ván (26px)
const DK=-5;                      // hàng trên cùng của mặt ván (cao 5px so với đất)
const yo=(tilt,x)=>tilt?-rnd(tilt*(XR-x)/(XR-XL)):0;      // xoay quanh MŨI ván: mũi bị dậm xuống, đuôi hất lên
const kick=x=>{const e=Math.max(WX[0]-x,x-WX[1]);return e<=2?0:e<=4?-1:-2};

function skDraw(key,R,d,f,b,t,pt,c){
 if(pt)return;
 const P=SKPAL[key]||SKPAL.orange,mv=c.mv,side=d>1,p=phase(t,mv),tl=p.tilt;
 if(mv&&side)for(let i=0;i<3;i++){const u=(t*3+i/3)%1;R('rgba(255,255,255,'+(.55*(1-u)).toFixed(2)+')',-16-rnd(u*8),-6+i*2,3-rnd(u*2),1)}
 // BONG BÓNG buộc ở đuôi ván (chỉ ván có P.balloon): bồng bềnh phía sau, bị gió thổi dạt ra sau khi đi
 if(P.balloon){const B=P.balloon,w=Math.sin(t*2.1),bx=-21-(mv?5:0)+rnd(w*1.5),by=-22+rnd(Math.sin(t*1.6)*2)+(mv?3:0),tx=XL+1,ty=DK+kick(XL)+yo(tl,XL);
  // dây: từ đuôi ván lên bong bóng (đường thẳng bậc thang)
  for(let i=0;i<=8;i++){const q=i/8;R(B.s,rnd(tx+(bx+4-tx)*q+Math.sin(q*6+t*3)*1.2),rnd(ty+(by+11-ty)*q),1,1)}
  // thân bong bóng 9x11 hình oval + nút thắt + bóng sáng
  R(B.b,bx+2,by,5,1);R(B.b,bx+1,by+1,7,1);R(B.b,bx,by+2,9,6);R(B.b,bx+1,by+8,7,1);R(B.b,bx+2,by+9,5,1);R(B.b,bx+3,by+10,3,1);
  R(B.d,bx+6,by+3,3,5);R(B.d,bx+4,by+8,4,1);R(B.d,bx+3,by+10,3,1);R(B.d,bx+5,by+9,2,1);
  R(B.l,bx+2,by+2,2,3);R(B.l,bx+3,by+1,2,1);R('#ffffff',bx+2,by+2,1,1);
  R(B.d,bx+4,by+11,2,1)}
 // bánh xe 3x2 + trục xe
 for(const wx of WX){const y=yo(tl,wx);
  R(P.truck,wx-1,-3+y,3,1);R(P.truckD,wx,-3+y,2,1);
  R(P.wheel,wx-1,-2+y,3,2);R(P.wheelL,wx-1,-2+y,1,1);R(P.wheelD,wx,-1+y,2,1);
  const a=mv?rnd((c.ph||0)*.9)%4:0;R(P.hub,wx-1+(a&1?2:0),-2+y+(a&2?1:0),1,1)}
 // mặt ván 2 lớp + viền, 2 đầu cong lên
 for(let x=XL;x<=XR;x++){
  const yk=kick(x),y0=DK+yk+yo(tl,x),ctr=x>=WX[0]&&x<=WX[1];
  if(x==XL||x==XR){R(P.edge,x,y0,1,1);R(P.under,x,y0+1,1,1);continue}
  R(ctr?(x%4==0?P.flameL:P.flame):(x<WX[0]?P.edge:P.deckL),x,y0,1,1);
  R(x>=-4&&x<=3?P.mid:P.deck,x,y0+1,1,1)}
 for(let x=XL+1;x<XR;x++){const y0=DK+kick(x)+yo(tl,x);R(P.under,x,y0+2,1,1)}
}

// ---------- chân 2 đoạn BẰNG NHAU, gối LUÔN về phía trước (+x) ----------
// hx,hy hông • fx,fy mắt cá • len = tổng chiều dài chân (cố định) • kdir = +1: gối hướng +x (trước), -1: hướng -x
function leg(R,c,hx,hy,fx,fy,len,kdir){
 const dx=fx-hx,dy=fy-hy,d=hyp(dx,dy)||1,L=len/2,l=Math.min(d/2,L-.01),h=sqrt(L*L-l*l);
 let nx=dy/d,ny=-dx/d;if(nx*kdir<0){nx=-nx;ny=-ny}
 const kx=hx+dx/2+nx*h,ky=hy+dy/2+ny*h,hi=shade(c,.22);
 pxl(R,c,hx,hy,kx,ky,3);pxl(R,c,kx,ky,fx,fy,3);
 pxl(R,hi,hx,hy,kx,ky,1);
 return[rnd(fx),rnd(fy)]}

const LEN=11;                     // chiều dài chân (px) — người chibi, chân ngắn
// ---------- chân người ----------
function skLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const mv=c&&c.mv,t=(c&&c.t)||0,p=phase(t,mv),hy=sy-1+(hv||0),SDl=shade(SD,.25),PTs=shade(PT,-.3),
  shoe=(x,y)=>{R(SD,x-2,y,5,2);R(SDl,x-2,y,5,1);if(S&&S.sole){R(S.sole,x-2,y+1,5,1);R('#e23a3a',x+(d>1?2:-2),y,1,1)}},
  ON=DK-2;                                            // mắt cá khi chân đặt lên mặt ván
 // chân sau: đặt trên đuôi ván; khi lật ván thì nhấc lên, đưa RA TRƯỚC, dậm xuống mũi ván
 const REST=-4,NOSE=9,rx=REST+(NOSE-REST)*p.sw,ry=ON+yo(p.tilt,rx)-rnd(4*p.arc)+(p.k>.3?1:0);
 if(d>1){
  const hxB=sx-1,hxF=sx+2;                            // hông chân sau hơi lùi, chân trước hơi tiến
  let q;
  if(mv){
   q=leg(R,PTs,hxB,hy,rx,ry,LEN,1);shoe(q[0]+1,q[1]);               // chân sau (tối hơn), gối về trước
   q=leg(R,PT,hxF,hy,sx+5,ON,LEN,1);shoe(q[0]+1,q[1]);              // chân trước trên ván, gối về trước
  }else{
   q=leg(R,PTs,hxB,hy,rx,ry,LEN,1);shoe(q[0]+1,q[1]);               // chân sau giữ ván
   q=leg(R,PT,hxF,hy,sx+3,-2,LEN,1);shoe(q[0]+1,-2);                // CHÂN CHỐNG: thẳng xuống đất
  }
 }else{
  const xl=sx-3,xr=sx+2;
  let q=leg(R,PTs,xl,hy,sx-6,ON+yo(p.tilt,-6)-rnd(3*p.arc),LEN,-1);shoe(q[0],q[1]);
  if(mv)q=leg(R,PT,xr,hy,sx+6,ON,LEN,1),shoe(q[0]+1,q[1]);
  else q=leg(R,PT,xr,hy,sx+7,-2,LEN,1),shoe(q[0]+1,-2)}
}
window.skDraw=skDraw;window.skLegs=skLegs;
})();
