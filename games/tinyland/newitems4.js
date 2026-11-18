/* ===================================================================================
   NEWITEMS4.JS — Đồ mới:
   v2: xe CAO & TO hơn (bánh bán kính ~8, yên cao thêm 4px) — seat trong index.html đổi -20 → -24.
   • 🎪 Thú cưỡi Xe đạp 1 bánh — MOUNTS (k:'unicycle'), 8000 Xu, bán ở Tiệm Chú Hề (Xe Hề, Phố xá)
       Yên đen, cổ yên bạc, càng đen, chắn bùn bạc, vành bạc + căm xe + mắt phản quang đỏ, bàn đạp xám.
       • Di chuyển: nhân vật ĐẠP xe (bánh quay cùng bàn đạp, giống xe đạp thường).
       • Đứng yên: nghiêng người, CHỐNG 1 CHÂN xuống đất, chân kia gác lên bàn đạp.
   Món được khai báo ở CUỐI mảng MOUNTS trong index.html (không làm lệch số thứ tự đồ đã mua).
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: pho-map.js → SHOP.m.pr (phần tử cuối).
   Quy ước vẽ: R(màu,x,y,w,h) quanh điểm chân (0,0); hướng TRÁI = lật gương hướng PHẢI.
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos,rnd=Math.round,abs=Math.abs,hyp=Math.hypot,at2=Math.atan2;
// ---------- bảng màu ----------
const TIRE='#2a2a33',TIRL='#52525f',RIM='#dfe5ec',RIMD='#a4aeb9',SPK='#98a2ae',HUB='#f1f4f7',
 PED='#b9c0c8',PEDD='#6d7580',CRK='#7f8995',RED='#ff4a4a',GOLD='#f0c84c';
// màu thay đổi theo từng xe (càng, chắn bùn/cổ yên, yên): 'black' = xe gốc, 'blue' = xe xanh dương
const UPAL={
 black:{FORK:'#383844',FORKL:'#6a6a7c',CHR:'#c6cdd6',CHRL:'#f4f7fa',CHRD:'#8791a0',SAD:'#30303a',SADL:'#5f5f72'},
 blue:{FORK:'#1f55c4',FORKL:'#5b8cf0',CHR:'#3f86f2',CHRL:'#a9cdff',CHRD:'#2459b8',SAD:'#1d2b5c',SADL:'#44559a'}};
let FORK,FORKL,CHR,CHRL,CHRD,SAD,SADL;
const setPal=k=>({FORK,FORKL,CHR,CHRL,CHRD,SAD,SADL}=UPAL[k]||UPAL.black);setPal('black');
const HX=0,HY=-9,CR=2.7,LEG_GO=9.3,LEG_STOP=11.3;   // tâm bánh (hub), bán kính tay quay, độ dài đùi/cẳng chân (đi / đứng chống chân)
// độ nghiêng theo độ cao: càng cao càng lệch (lx = độ lệch của yên, px)
const sh=(lx,y)=>lx?rnd(lx*Math.max(0,Math.min(1,(-y-1)/19))):0;
const sh2=shade;                                   // shade() có sẵn trong game

// ---------- trạng thái đứng yên / di chuyển ----------
window.uniHov=(t,mv)=>mv?0:1;                      // đứng yên: người hạ thấp 1px (đang chống chân)
window.uniLean=(mv,d)=>mv?0:(d>1?2:4);             // đứng yên: nghiêng người (nhìn trước/sau lệch 4px, nhìn ngang 2px)

// ---------- chân người ----------
// R,d,ph,sx,sy = như các thú cưỡi khác; hv = độ hạ người; c = {mv,lx,...}
function uniLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const mv=c&&c.mv,lx=(c&&c.lx)||0,th=mv?ph*.62:0,LEG=mv?LEG_GO:LEG_STOP,hy=sy-1+(hv||0),SDl=sh2(SD,.25),PTs=sh2(PT,-.3),
  shoe=(x,y)=>{R(SD,x-2,y,4,2);R(SDl,x-2,y,4,1)};
 if(d>1){
  // ---- nhìn ngang ----
  const ped=a=>[HX+sh(lx,HY)+cos(a)*CR,HY+sin(a)*CR];
  const far=ped(th+PI),near=ped(th);
  // chân xa (tối hơn) luôn gác bàn đạp
  let p=leg2(R,PTs,sx+1,hy,far[0],far[1]-2,LEG);shoe(p[0]+1,p[1]);
  if(mv){p=leg2(R,PT,sx+1,hy,near[0],near[1]-2,LEG);shoe(p[0]+1,p[1])}
  else{p=leg2(R,PT,sx+1,hy,sx+5,-3,LEG);shoe(p[0]+1,-2)}              // chân gần chống xuống đất
 }else{
  // ---- nhìn trước / sau ----
  const pr=HY+(mv?sin(th)*CR:0),pl=HY-(mv?sin(th)*CR:0);              // độ cao 2 bàn đạp (phải / trái)
  const ox=sh(lx,HY);
  const legL=(ay)=>{const x1=sx-4,x2=ox-8+1;pxl(R,PTs,x1,hy,x2,rnd(ay)-2,3);R(sh2(PTs,.2),x1,hy,1,2);shoe(x2+2,rnd(ay)-2)};
  legL(pl);                                                              // chân trái: luôn trên bàn đạp
  if(mv){const x1=sx+1,x2=ox+5;pxl(R,PT,x1,hy,x2,rnd(pr)-2,3);R(sh2(PT,.25),x1,hy,1,2);shoe(x2+2,rnd(pr)-2)}
  else{const x1=sx+1,x2=sx+4;pxl(R,PT,x1,hy,x2,-4,3);R(sh2(PT,.25),x1,hy,1,2);shoe(x2+2,-2)}   // chân phải chống đất
 }
}

// ---------- thân xe ----------
function uniDraw(R,d,f,b,t,pt,c,key){
 setPal(key);
 const mv=c.mv,lx=c.lx||0,th=mv?c.ph*.62:0,S=c.S,
  Rs=(col,x,y,w,h)=>R(col,x+sh(lx,y),y,w,h);                          // vẽ có nghiêng
 const hx=HX+sh(lx,HY);
 if(d>1){
  if(pt){   // cánh tay giữ thăng bằng (lớp trên): đi = dang ra trước, đứng yên = tì tay lên đùi
   const sx=-1+lx,sy=-24,hv=mv?0:1,ax=sx+1,ay=sy-6+hv,k=mv?rnd(sin(c.ph*.62)*1):0,SK='#f1c08a';
   if(mv){pxl(R,S.sh,ax,ay,ax+5,ay+k,2);R(SK,ax+5,ay+k,2,2)}
   else{pxl(R,S.sh,ax,ay,ax+3,ay+4,2);R(SK,ax+3,ay+4,2,2)}
   return}
  // --- tay quay + bàn đạp phía xa ---
  const crank=(a,k,pc,pd)=>{const px=rnd(HX+cos(a)*CR),py=rnd(HY+sin(a)*CR);pxl(Rs,k,HX,HY,px,py,1);Rs(pc,px-2,py,5,1);Rs(pd,px-2,py+1,5,1)};
  crank(th+PI,'#59616b',sh2(PED,-.2),sh2(PEDD,-.2));
  // --- bánh: lốp đen dày, vành bạc, căm xe, mắt phản quang ---
  for(let y=-9;y<=9;y++)for(let x=-9;x<=9;x++){const dd=hyp(x,y);
   if(dd>=5.8&&dd<8.4){const hi=(x+y<-4&&dd>6.9);Rs(hi?TIRL:TIRE,x,HY+y,1,1)}
   else if(dd>=4.6&&dd<5.8)Rs(y>1?RIMD:RIM,x,HY+y,1,1)}
  for(let j=0;j<4;j++){const q=th+j*PI/4,cs=cos(q),sn=sin(q);for(let m=1;m<4.6;m++){Rs(SPK,rnd(cs*m),HY+rnd(sn*m),1,1);Rs(SPK,rnd(-cs*m),HY+rnd(-sn*m),1,1)}}
  Rs(RED,rnd(cos(th+1)*5.2),HY+rnd(sin(th+1)*5.2),1,1);
  // --- chắn bùn bạc ôm phần trên bánh ---
  for(let y=-12;y<=4;y++)for(let x=-12;x<=12;x++){const dd=hyp(x,y),an=at2(y,x);
   if(dd>=8.7&&dd<10.4&&an>-2.75&&an<-.12)Rs(dd<9.4?CHRD:(y<-9?CHRL:CHR),x,HY+y,1,1)}
  Rs(RED,-9,-16,1,2);                                                  // đèn hậu nhỏ ở đuôi chắn bùn
  // --- càng đen (phía gần) ---
  pxl(Rs,FORK,-1,HY,-1,-19,2);for(let y=-19;y<=-10;y++)Rs(FORKL,-1,y,1,1);
  Rs(FORK,-3,-21,6,3);Rs(FORKL,-3,-21,6,1);Rs(GOLD,0,-20,1,1);        // chốt cổ càng
  // --- hub + tay quay + bàn đạp phía gần ---
  Rs(HUB,-1,HY-1,3,3);Rs(RIMD,0,HY,1,1);
  crank(th,'#8b949f',PED,PEDD);
  // --- cổ yên bạc ---
  Rs(CHRD,0,-23,2,3);Rs(CHR,-1,-23,1,3);Rs(CHRL,-1,-23,1,1);
  // --- yên đen ---
  const yy=-25+b;
  Rs(SAD,-4,yy,9,2);Rs(SAD,-3,yy+2,7,1);Rs(SAD,5,yy,3,1);Rs(SADL,-3,yy,8,1);Rs(CHR,-1,yy+2,2,1);
 }else{
  // ---- nhìn trước / sau ----
  if(pt)return;
  const crank=(sgn,a)=>{const py=rnd(HY+(mv?sgn*sin(a)*CR:0));
   const x=hx+(sgn>0?4:-5);R(CRK,x,Math.min(HY,py),1,abs(py-HY)+1);          // tay quay
   R(PED,hx+(sgn>0?4:-8),py,5,1);R(PEDD,hx+(sgn>0?4:-8),py+1,5,1)};          // bàn đạp
  crank(-1,th);crank(1,th);
  // trục + càng 2 bên
  R(CHR,hx-4,HY,8,1);
  for(let y=-19;y<=HY;y++){Rs(FORK,-5,y,2,1);Rs(FORK,3,y,2,1);Rs(FORKL,-5,y,1,1);Rs(FORKL,3,y,1,1)}
  // lốp (dày 4px, bo tròn 2 đầu) + hoa lốp chạy
  for(let y=-17;y<=-1;y++){const e=(y==-17||y==-1)?1:0,tr=mv&&((y+rnd(th*3))&1);
   Rs(TIRE,-2+e,y,4-2*e,1);if(!e){Rs(TIRL,-2,y,1,1);if(tr)Rs(TIRL,0,y,1,1)}}
  // chắn bùn bạc
  Rs(CHRD,-4,-18,8,1);Rs(CHR,-3,-19,6,1);Rs(CHRL,-2,-19,3,1);Rs(CHR,-4,-18,2,1);
  // nối càng + cổ càng
  Rs(FORK,-5,-21,10,3);Rs(FORKL,-5,-21,10,1);Rs(GOLD,-5,-21,1,1);Rs(GOLD,4,-21,1,1);
  // cổ yên 3 mảng sáng-tối
  for(let y=-24;y<=-22;y++){Rs(CHRL,-1,y,1,1);Rs(CHRD,0,y,1,1)}
  if(d==1){Rs(RED,-1,-5,2,2);Rs('#ffb0b0',-1,-5,1,1)}                      // phản quang đỏ phía sau
  // yên đen
  const yy=-26+b;
  Rs(SAD,-4,yy,8,2);Rs(SADL,-3,yy,6,1);Rs(SAD,-3,yy+2,6,1);
 }
}
window.uniLegs=uniLegs;window.uniDraw=uniDraw;
})();
