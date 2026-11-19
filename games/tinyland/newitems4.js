/* ===================================================================================
   NEWITEMS4.JS — 🎪 Thú cưỡi XE ĐẠP 1 BÁNH (k:'unicycle' đen, k:'unicycle_blue' xanh) — 8000 Xu, Tiệm Chú Hề
   v3.1: đứng yên nhìn ngang → chân chống đất duỗi THẲNG xuống đất (trước bị gập đùi, nhìn lạ).
   v3 (vẽ lại hoàn toàn):
   • THẤP & VỪA NGƯỜI: yên cao -15 (trước là -24). Bánh bán kính 5.8, chân người dài ~6.6/đoạn → gối gập tự nhiên,
     KHÔNG còn bị kéo dài/biến dạng. Đứng yên: người hạ 2px, chân chống chạm đất vẫn còn hơi gập.
   • ĐỘ PHÂN GIẢI CAO: xe được vẽ ở lưới 4x4 điểm nhỏ / 1 ô game (K=4) → bánh tròn mượt, lốp có gai chạy, vành bạc bóng,
     nan hoa mảnh, trục/moay-ơ, bàn đạp, chắn bùn cong, yên có mũi + khung sườn... (hết kiểu vuông & tam giác).
     Kết quả mỗi khung hình được CACHE (chỉ dựng 1 lần), nên không nặng máy.
   • Nghiêng người khi đứng yên: thân xe nghiêng mượt (shear từng hàng) thay vì nhảy bậc.
   Món được khai báo ở CUỐI mảng MOUNTS trong index.html (không làm lệch số thứ tự đồ đã mua).
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: pho-map.js → SHOP.m.pr.
   Quy ước vẽ: R(màu,x,y,w,h) quanh điểm chân (0,0); hướng TRÁI = lật gương hướng PHẢI (drawRide lo).
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,rnd=Math.round,abs=Math.abs,hyp=Math.hypot,at2=Math.atan2,flr=Math.floor,
 cl=(v,a,b)=>Math.max(a,Math.min(b,v));

// ---------- hình học ----------
const HX=0,HY=-5.8,RT=5.8,CR=2.3;          // tâm bánh (hub), bán kính lốp, bán kính tay quay
const SEAT=-15;                             // độ cao yên (khớp seat trong index.html)
const LEG_GO=6.6,LEG_STOP=6.9;              // độ dài đùi = cẳng chân (đi / đứng chống chân)
const NQ=36;                                // số bước quay của bánh được cache

// ---------- bảng màu ----------
const RP=c=>[shade(c,-.5),shade(c,-.25),c,shade(c,.22),shade(c,.5)];   // dải 5 mức: tối → sáng
const TIRE=RP('#30303b'),RIM=RP('#c3cad3'),HUBC=RP('#aab3be'),
 SPK='#9aa4b0',SPKL='#c9d1da',RED='#ff4a4a',REDL='#ffb0b0',GOLD='#f0c84c',GOLDL='#fff0a0',
 PED='#c3cad3',PEDD='#6d7580',CRK='#8b949f',CRKD='#4a525c';
const PAL={
 black:{fork:RP('#383844'),chr:RP('#c6cdd6'),sad:RP('#34343f'),sadL:'#6b6b80'},
 blue:{fork:RP('#1f55c4'),chr:RP('#3f86f2'),sad:RP('#1d2b5c'),sadL:'#4a5ca0'}
};
// ánh sáng từ trên-trái: trả về 0..4
const LI=(dx,dy,r)=>{const d=(dx*-.55+dy*-.8)/r;return d>.62?4:d>.2?3:d>-.3?2:d>-.72?1:0};

// ---------- lưới 4x4 ----------
const K=4,GX0=-16,GY0=-18,GW=32,GH=21,NW=GW*K,NH=GH*K;
function Grid(){
 const G=new Array(NW*NH).fill(null);
 const scan=(x0,y0,x1,y1,fn)=>{
  const i0=Math.max(0,flr((x0-GX0)*K)),i1=Math.min(NW-1,Math.ceil((x1-GX0)*K)),j0=Math.max(0,flr((y0-GY0)*K)),j1=Math.min(NH-1,Math.ceil((y1-GY0)*K));
  for(let j=j0;j<=j1;j++){const uy=GY0+(j+.5)/K;for(let i=i0;i<=i1;i++){const c=fn(GX0+(i+.5)/K,uy);if(c)G[j*NW+i]=c}}};
 const pick=(col,x,y,d)=>typeof col=='function'?col(x,y,d):col;
 return{G,scan,
  disc:(cx,cy,r,col)=>scan(cx-r,cy-r,cx+r,cy+r,(x,y)=>{const d=hyp(x-cx,y-cy);return d<=r?pick(col,x,y,d):null}),
  ring:(cx,cy,r0,r1,col)=>scan(cx-r1,cy-r1,cx+r1,cy+r1,(x,y)=>{const d=hyp(x-cx,y-cy);return d>=r0&&d<r1?pick(col,x,y,d):null}),
  rect:(x,y,w,h,col)=>scan(x,y,x+w,y+h,(ux,uy)=>ux>=x&&ux<x+w&&uy>=y&&uy<y+h?pick(col,ux,uy):null),
  rrect:(x,y,w,h,r,col)=>scan(x,y,x+w,y+h,(ux,uy)=>{
   if(ux<x||ux>=x+w||uy<y||uy>=y+h)return null;
   const qx=ux<x+r?x+r-ux:ux>x+w-r?ux-(x+w-r):0,qy=uy<y+r?y+r-uy:uy>y+h-r?uy-(y+h-r):0;
   return qx*qx+qy*qy>r*r?null:pick(col,ux,uy)}),
  line:(x0,y0,x1,y1,th,col)=>{const r=th/2,dx=x1-x0,dy=y1-y0,L2=dx*dx+dy*dy||1;
   scan(Math.min(x0,x1)-r,Math.min(y0,y1)-r,Math.max(x0,x1)+r,Math.max(y0,y1)+r,(x,y)=>{
    const t=cl(((x-x0)*dx+(y-y0)*dy)/L2,0,1);return hyp(x-(x0+dx*t),y-(y0+dy*t))<=r?pick(col,x,y):null})}
 }}

// độ nghiêng: càng lên cao càng lệch (lx = độ lệch của yên) — mượt, không làm tròn
const shear=(y,lx)=>lx?lx*cl((-y-1)/14,0,1):0;

// lưới → danh sách ô chữ nhật (gộp ngang + dọc) để vẽ bằng R()
function flatten(G,lx){
 const out=[],last=new Map();
 for(let j=0;j<NH;j++){
  const y=GY0+j/K,sft=lx?rnd(shear(y+.5/K,lx)*K):0,base=j*NW;
  let i=0;
  while(i<NW){
   const c=G[base+i];if(!c){i++;continue}
   let e=i+1;while(e<NW&&G[base+e]===c)e++;
   const x=GX0+(i+sft)/K,w=(e-i)/K,key=c+'|'+x+'|'+w,p=last.get(key);
   if(p&&abs(p[2]+p[4]-y)<1e-6)p[4]+=1/K;else{const r=[c,x,y,w,1/K];out.push(r);last.set(key,r)}
   i=e}}
 return out}

// ---------- NHÌN NGANG ----------
function bSide(P,th,b){
 const g=Grid(),F=P.fork,C=P.chr,SD=P.sad;
 const pedal=(a,far)=>{
  const px=cos(a)*CR,py=HY+sin(a)*CR;
  g.line(HX,HY,px,py,.9,far?CRKD:CRK);
  g.rect(px-2.4,py-.25,4.8,.6,far?'#98a1ab':PED);          // mặt bàn đạp
  g.rect(px-2.4,py+.35,4.8,.55,far?'#4f5761':PEDD);        // thân bàn đạp
  for(let k=0;k<3;k++)g.rect(px-1.7+k*1.5,py-.45,.45,.25,far?'#6d7580':'#8d96a1')};   // đinh chống trượt
 pedal(th+PI,1);
 // --- lốp: dày, bóng khối, gai chạy theo bánh ---
 g.ring(HX,HY,RT-1.35,RT,(x,y,d)=>{
  const dx=x-HX,dy=y-HY;let i=LI(dx,dy,RT);
  if(d<RT-1.12)return TIRE[0];                              // mép tanh (bead)
  if(d>RT-.7){const seg=flr((at2(dy,dx)-th)/(PI/10));if(seg&1)i=Math.max(0,i-1)}   // gai lốp
  return TIRE[i]});
 // --- vành bạc ---
 g.ring(HX,HY,RT-2.3,RT-1.35,(x,y,d)=>d<RT-2.1?RIM[0]:RIM[LI(x-HX,y-HY,RT-1.3)]);
 // --- nan hoa mảnh (4 nan xuyên tâm = 8 nan) ---
 for(let j=0;j<4;j++){const q=th+j*PI/4,cs=cos(q),sn=sin(q);
  g.line(HX+cs*1.2,HY+sn*1.2,HX+cs*(RT-2.25),HY+sn*(RT-2.25),.32,(cs*-.55+sn*-.8)>0?SPKL:SPK);
  g.line(HX-cs*1.2,HY-sn*1.2,HX-cs*(RT-2.25),HY-sn*(RT-2.25),.32,(cs*.55+sn*.8)>0?SPKL:SPK)}
 // --- mắt phản quang đỏ trên vành ---
 {const q=th+1,rx=HX+cos(q)*(RT-1.8),ry=HY+sin(q)*(RT-1.8);g.disc(rx,ry,.55,RED);g.disc(rx-.15,ry-.15,.2,REDL)}
 // --- chắn bùn bạc ôm phía trên bánh ---
 g.scan(HX-RT-1.4,HY-RT-1.4,HX+RT+1.4,HY+1,(x,y)=>{
  const dx=x-HX,dy=y-HY,d=hyp(dx,dy),an=at2(dy,dx);
  if(d<RT+.4||d>=RT+1.05||an<-2.95||an>-.2)return null;return C[LI(dx,dy,RT+1)]});
 {const q=-2.95,rx=HX+cos(q)*(RT+.72),ry=HY+sin(q)*(RT+.72);g.disc(rx,ry+.2,.6,RED);g.disc(rx-.1,ry,.22,REDL)}   // đèn hậu
 // --- càng (fork) + cổ càng ---
 g.rect(-.8,-13,1.6,HY+13,(x)=>x<-.3?F[3]:x>.35?F[1]:F[2]);
 g.rrect(-2.5,-14,5,1.5,.6,(x,y)=>y<-13.5?F[3]:y>-12.8?F[1]:F[2]);
 g.disc(-1.6,-13.25,.35,GOLD);g.disc(1.6,-13.25,.35,GOLD);
 // --- moay-ơ ---
 g.disc(HX,HY,1.65,'#4a5058');g.disc(HX,HY,1.35,(x,y)=>HUBC[LI(x-HX,y-HY,1.35)]);g.disc(HX,HY,.5,GOLD);
 pedal(th,0);
 // --- cổ yên + kẹp vàng ---
 g.rect(-.55,-14.8,1.1,1.0,(x)=>x<0?C[3]:C[1]);
 g.rect(-.95,-14.95,1.9,.4,(x,y)=>y<-14.75?GOLDL:GOLD);
 // --- yên: mũi thon về phía trước, vỏ đen bóng, khung sườn bạc ---
 const top=SEAT-1+b,rear=-4.5,nose=5.5;
 g.scan(rear-.5,top-1,nose+.5,top+4,(x,y)=>{
  if(x<rear||x>nose)return null;
  const u=(x-rear)/(nose-rear),tk=2.6-1.5*Math.max(0,(u-.3)/.7),yt=top+(u>.45?(u-.45)*1.0:0);
  if(y<yt||y>=yt+tk)return null;
  const k=(y-yt)/tk;
  if(u<.07&&(k<.25||k>.75))return null;                    // bo tròn đuôi yên
  if(u>.93&&k>.5)return null;                              // bo mũi yên
  return k<.22?P.sadL:k>.78?SD[0]:k>.5?SD[1]:SD[2]});
 g.line(-2.6,top+2.75,2.8,top+2.35,.3,C[2]);
 return g}

// ---------- NHÌN TRƯỚC / SAU ----------
function bFront(P,th,b,back){
 const g=Grid(),F=P.fork,C=P.chr,SD=P.sad,off=(back?-1:1)*th*RT,TW=1.45,top=SEAT-1+b;
 const pedalLR=(sg,py)=>{      // sg = -1 trái, +1 phải
  const x0=sg>0?3.5:-8.3;
  g.rect(sg*3.7-.4,Math.min(HY,py)-.4,.8,abs(py-HY)+.8,CRK);                    // tay quay
  g.rect(x0,py-.25,4.8,.6,PED);g.rect(x0,py+.35,4.8,.55,PEDD);                  // bàn đạp
  for(let k=0;k<3;k++)g.rect(x0+.6+k*1.5,py-.45,.45,.25,'#8d96a1')};
 const pyR=HY+sin(th)*CR,pyL=HY-sin(th)*CR;
 // --- lốp: tròn đầu, bóng ngang, gai chạy dọc ---
 g.scan(-TW,HY-RT,TW,HY+RT,(x,y)=>{
  const tp=HY-RT,bt=HY+RT,ey=y<tp+TW?tp+TW-y:y>bt-TW?y-(bt-TW):0;
  if(hyp(x,ey)>TW)return null;
  const u=x/TW;let i=u<-.55?3:u<-.1?2:u<.5?1:0;
  if(abs(u)<.62&&(flr((y+off)/1.1)&1))i=Math.max(0,i-1);
  if(abs(u)>.85)i=Math.max(0,i-1);
  return TIRE[i]});
 // --- càng 2 bên + trục ---
 for(const s of[-1,1]){const x0=s<0?-3.4:2.1;
  g.rect(x0,-13,1.3,HY+13,(x)=>{const u=(x-x0)/1.3;return s<0?(u<.45?F[3]:F[2]):(u<.45?F[2]:F[1])})}
 g.rect(-4.2,HY-.45,8.4,.9,(x,y)=>y<HY?C[3]:C[1]);
 for(const s of[-1,1])g.disc(s*3.9,HY,.8,(x,y)=>C[LI(x-s*3.9,y-HY,.8)]);
 // --- chắn bùn nhìn từ trước: mũ bạc phủ đỉnh bánh ---
 g.scan(-2.5,HY-RT-1.1,2.5,HY-RT+1.8,(x,y)=>{
  const cy=HY-RT+.3,e=y<cy?hyp(x/2.4,(y-cy)/1.4):(abs(x)<=2.4?0:9);
  if(e>1)return null;const u=x/2.4;return u<-.5?C[4]:u<-.05?C[3]:u<.5?C[2]:C[1]});
 // --- cổ càng nối 2 bên ---
 g.rrect(-4.8,-14,9.6,1.5,.6,(x,y)=>y<-13.5?F[3]:y>-12.8?F[1]:F[2]);
 g.disc(-4.0,-13.25,.4,GOLD);g.disc(4.0,-13.25,.4,GOLD);
 // --- bàn đạp + tay quay (2 bên) ---
 pedalLR(-1,pyL);pedalLR(1,pyR);
 // --- cổ yên + kẹp vàng ---
 g.rect(-.55,-14.8,1.1,1.0,(x)=>x<0?C[3]:C[1]);
 g.rect(-.95,-14.95,1.9,.4,GOLD);
 // --- yên ---
 if(back){
  g.rrect(-3.9,top,7.8,2.5,1,(x,y)=>y<top+.6?P.sadL:y>top+1.9?SD[0]:SD[2]);
  g.disc(0,HY-RT+.1,.55,RED);g.disc(-.15,HY-RT-.05,.2,REDL);                   // đèn hậu trên chắn bùn
  g.rrect(-.8,HY+RT-3.1,1.6,2.2,.4,RED);g.rect(-.5,HY+RT-2.9,.5,1.5,REDL);      // phản quang đỏ trên lốp
 }else{
  g.rrect(-3.5,top,7,1.6,.8,(x,y)=>y<top+.5?P.sadL:SD[2]);                       // phần đuôi lấp ló phía sau
  g.rrect(-1.9,top+.5,3.8,2.1,.9,(x,y)=>y<top+1.1?SD[3]:y>top+1.8?SD[0]:SD[2]);   // mũi yên
 }
 return g}

// ---------- cache ----------
const CACHE={};
function runsFor(view,pk,q,lx,b){
 const ck=view+pk+q+'|'+lx+'|'+b;let r=CACHE[ck];
 if(!r){const P=PAL[pk],th=q*2*PI/NQ,g=view=='s'?bSide(P,th,b):bFront(P,th,b,view=='b');r=CACHE[ck]=flatten(g.G,lx)}
 return r}

// ---------- trạng thái đứng yên / di chuyển ----------
window.uniHov=(t,mv)=>mv?0:2;                      // đứng yên: người hạ thấp 2px (tụt xuống chống chân)
window.uniLean=(mv,d)=>mv?0:(d>1?2:4);             // đứng yên: nghiêng người (nhìn trước/sau lệch 4px, nhìn ngang 2px)

// ---------- chân người ----------
// R,d,ph,sx,sy = như các thú cưỡi khác; hv = độ hạ người; c = {mv,lx,...}
function uniLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const mv=c&&c.mv,lx=(c&&c.lx)||0,th=mv?ph*.62:0,LEG=mv?LEG_GO:LEG_STOP,hy=sy-1+(hv||0),SDl=shade(SD,.25),PTs=shade(PT,-.3),
  shoe=(x,y)=>{R(SD,x-2,y,4,2);R(SDl,x-2,y,4,1)};
 if(d>1){
  // ---- nhìn ngang ----
  const ped=a=>{const y=HY+sin(a)*CR;return[HX+shear(y,lx)+cos(a)*CR,y]};
  const far=ped(th+PI),near=ped(th);
  let p=leg2(R,PTs,sx+1,hy,far[0]-1,far[1]-2,LEG);shoe(p[0]+1,p[1]);          // chân xa (tối hơn) luôn gác bàn đạp
  if(mv){p=leg2(R,PT,sx+1,hy,near[0]-1,near[1]-2,LEG);shoe(p[0]+1,p[1])}
  else{const hx=sx+1,ky=rnd((hy-3)/2);                                           // chân gần chống xuống đất: CHÂN THẲNG, đứng thẳng đứng từ hông xuống đất (không gập đùi)
   pxl(R,PT,hx,hy,hx,ky,3);pxl(R,PT,hx,ky,hx,-3,3);R(shade(PT,.25),hx,hy,1,-3-hy+3);shoe(hx+1,-2)}
 }else{
  // ---- nhìn trước / sau ----
  const pyR=HY+(mv?sin(th)*CR:0),pyL=HY-(mv?sin(th)*CR:0);
  const cxL=y=>rnd(-6+shear(y,lx)),cxR=y=>rnd(6+shear(y,lx));
  {const fy=rnd(pyL)-2,cc=cxL(pyL),x1=sx-4;pxl(R,PTs,x1,hy,cc-2,fy,3);R(shade(PTs,.2),x1,hy,1,2);shoe(cc,fy)}   // chân trái: luôn trên bàn đạp
  if(mv){const fy=rnd(pyR)-2,cc=cxR(pyR),x1=sx+1;pxl(R,PT,x1,hy,cc-2,fy,3);R(shade(PT,.25),x1,hy,1,2);shoe(cc,fy)}
  else{const x1=sx+1,x2=sx+2;pxl(R,PT,x1,hy,x2,-4,3);R(shade(PT,.25),x1,hy,1,2);shoe(x2+1,-2)}                  // chân phải chống đất
 }
}

// ---------- thân xe ----------
function uniDraw(R,d,f,b,t,pt,c,key){
 const mv=c.mv,lx=c.lx||0,S=c.S;
 if(pt){   // lớp trên: cánh tay giữ thăng bằng (chỉ nhìn ngang): đi = dang ra trước, đứng yên = tì tay lên đùi
  if(d>1){
   const sx=-1+lx,sy=SEAT,hv=b,ax=sx+1,ay=sy-6+hv,k=mv?rnd(sin(c.ph*.62)*1):0,SK='#f1c08a';
   if(mv){pxl(R,S.sh,ax,ay,ax+5,ay+k,2);R(SK,ax+5,ay+k,2,2)}
   else{pxl(R,S.sh,ax,ay,ax+3,ay+4,2);R(SK,ax+3,ay+4,2,2)}}
  return}
 const pk=PAL[key]?key:'black',th=mv?c.ph*.62:0,
  q=mv?(((rnd(th/(2*PI)*NQ))%NQ)+NQ)%NQ:0,view=d>1?'s':d?'b':'f',runs=runsFor(view,pk,q,lx,b),e=.06;
 for(let i=0;i<runs.length;i++){const r=runs[i];R(r[0],r[1],r[2],r[3]+e,r[4]+e)}
}
window.uniLegs=uniLegs;window.uniDraw=uniDraw;
})();
