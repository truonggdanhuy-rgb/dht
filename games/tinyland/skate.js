/* ===================================================================================
   SKATE.JS — 🛹 VÁN TRƯỢT (thú cưỡi, nhân vật ĐỨNG trên ván). Ván GỐC = "Ván trượt cam".
   • Đi: nhân vật đứng lướt, bánh xe quay, có vệt gió phía sau.
   • Đứng yên: nhân vật CHỐNG 1 CHÂN xuống đất, chân kia gác trên ván; vài giây lại ĐẠP đuôi ván hất mũi ván lên nhẹ.
   • Muốn thêm ván mới: (1) thêm 1 bảng màu vào SKPAL bên dưới (copy khối 'orange' rồi đổi màu),
                         (2) thêm 1 dòng CUỐI mảng MOUNTS trong index.html (copy dòng "Ván trượt cam", đổi n / k / tên bảng màu 'orange' → tên mới).
   Quy ước vẽ: R(màu,x,y,w,h) quanh điểm chân (0,0); hướng TRÁI = lật gương hướng PHẢI (drawRide lo).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,rnd=Math.round;
// ---------- bảng màu các loại ván (mỗi ván = 1 bảng) ----------
const SKPAL={
 orange:{edge:'#d9320f',deck:'#ff7a1a',deckL:'#ff9a3a',mid:'#ffb02e',flame:'#ffd23a',flameL:'#fff08a',under:'#b82a0c',
         truck:'#4ccc2a',truckD:'#2f9a1a',wheel:'#3b4ff0',wheelL:'#7f92ff',wheelD:'#232fb0',hub:'#ffffff'}
};
// ---------- nhịp hành động khi đứng yên: chống chân ... rồi đạp đuôi hất ván ----------
const CYC=3.6;
function phase(t,mv){
 if(mv)return{u:-1,pre:-1,k:0,tilt:0,kick:0};
 const u=((t%CYC)+CYC)%CYC,pre=(u>=2.1&&u<2.4)?(u-2.1)/.3:-1,k=(u>=2.4&&u<3.2)?sin((u-2.4)/.8*PI):0;
 return{u,pre,k,tilt:rnd(5*k),kick:(u>=2.1&&u<3.2)?1:0}}
window.skHov=(t,mv)=>mv?0:3+(phase(t,0).k>.4?1:0);   // đứng yên: người hạ thấp (khom xuống chống chân), đạp ván thì khom thêm
window.skLean=(mv,d)=>mv?(d>1?1:0):3;                 // đi: hơi chúi về trước • đứng yên: nghiêng về phía chân chống
const yo=(tilt,x)=>tilt?-rnd(tilt*(x+12)/23):0;      // độ nâng của ván tại cột x (xoay quanh đuôi ván)
const WX=[-8,7];                                      // tâm 2 bánh xe

// ---------- thân ván ----------
function skDraw(key,R,d,f,b,t,pt,c){
 if(pt)return;                                        // ván không có lớp phủ trên người
 const P=SKPAL[key]||SKPAL.orange,mv=c.mv,side=d>1,p=phase(t,mv),tl=p.tilt;
 // vệt gió phía sau khi lướt (chỉ khi nhìn ngang)
 if(mv&&side)for(let i=0;i<3;i++){const u=(t*3+i/3)%1;R('rgba(255,255,255,'+(.55*(1-u)).toFixed(2)+')',-14-rnd(u*8),-9+i*3,3-rnd(u*2),1)}
 // trục xe (xanh lá) + bánh xe (xanh dương, có chấm sáng quay)
 for(const wx of WX){const y=yo(tl,wx),cy=-3+y;
  R(P.truck,wx-1,-6+y,3,1);R(P.truckD,wx-1,-5+y,3,1);
  R(P.wheel,wx-1,cy-2,3,5);R(P.wheel,wx-2,cy-1,5,3);
  R(P.wheelL,wx-1,cy-2,2,1);R(P.wheelL,wx-2,cy-1,1,1);R(P.wheelD,wx-1,cy+2,3,1);R(P.wheelD,wx+1,cy,2,2);
  const a=mv?(c.ph||0)*1.1:.8;R(P.hub,wx+rnd(cos(a)*1.3),cy+rnd(sin(a)*1.3),1,1)}
 // mặt ván: viền đỏ cam, ruột cam, vệt lửa vàng ở giữa, 2 đầu cong lên
 for(let x=-12;x<=11;x++){
  const yk=(x<-9||x>8)?-1:0,y0=-9+yk+yo(tl,x),ctr=x>=-8&&x<=7;
  if(x==-12||x==11){R(P.edge,x,y0+1,1,1);R(P.under,x,y0+2,1,1);continue}
  R(ctr?(x%4==0?P.flameL:P.flame):(x<-8?P.edge:P.deckL),x,y0,1,1);
  R(x>=-5&&x<=4?P.mid:P.deck,x,y0+1,1,1);
  R(P.under,x,y0+2,1,1)}
}

// ---------- chân người ----------
function skLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const mv=c&&c.mv,t=(c&&c.t)||0,p=phase(t,mv),L=mv?7.9:9.2,hy=sy-1+(hv||0),SDl=shade(SD,.25),PTs=shade(PT,-.3),
  shoe=(x,y)=>{R(SD,x-2,y,4,2);R(SDl,x-2,y,4,1)};
 // chân sau: gác trên ván; khi đạp thì nhấc lên rồi dậm xuống đuôi ván
 const rx=p.kick?-9:-6,lift=p.pre>=0?rnd(3*sin(p.pre*PI)):0,ry=-11+yo(p.tilt,rx)-lift;
 if(d>1){
  let q=leg2(R,PTs,sx+1,hy,rx,ry,L);shoe(q[0]+1,q[1]);                   // chân xa/sau (tối hơn)
  if(mv)q=leg2(R,PT,sx+1,hy,5,-11,L),shoe(q[0]+1,q[1]);                  // đi: chân trước gác trên ván
  else q=leg2(R,PT,sx+1,hy,9,-2,L),shoe(q[0]+1,-2);                      // đứng yên: chân trước CHỐNG xuống đất
 }else{
  const x1=sx-4,x2=sx+1;                                                  // nhìn trước/sau: 2 chân dạng ngang ván
  pxl(R,PTs,x1,hy,rx-1,ry-1,3);R(shade(PTs,.2),x1,hy,1,2);shoe(rx,ry);
  if(mv){pxl(R,PT,x2,hy,3,-12,3);R(shade(PT,.25),x2,hy,1,2);shoe(4,-11)}
  else{pxl(R,PT,x2,hy,9,-4,3);R(shade(PT,.25),x2,hy,1,2);shoe(10,-2)}}
}
window.skDraw=skDraw;window.skLegs=skLegs;
})();
