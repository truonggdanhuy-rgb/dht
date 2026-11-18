/* =====================================================================================
   broomkit.js — 🧹 KIT CHỔI BAY (thú cưỡi bay lơ lửng, nhân vật NGỒI trên chổi)
   Chổi đầu tiên: "Chổi bay phù thủy" (sao nhỏ treo ở đầu cán) — Tiệm Chú Hề: 1.000 Xu + 500 xu quái vật + 3 💎.
   • Hình vẽ ở độ phân giải gấp đôi (nửa điểm ảnh), tự vát sáng/tối + viền, KHÔNG tam giác thô; cache nên rất nhẹ.
   • Chổi bay cao hơn mặt đất ~11 điểm ảnh, bồng bềnh nhẹ; rơm đung đưa, sao lắc lư (đi thì rơm bay ngược ra sau).
   ---------------------------------------------------------------------------------
   THÊM CHỔI MỚI (3 bước, không cần vẽ lại):
   1) Trong file này, gọi BROOM.add({...}) ở cuối (xem mẫu 'witch'): đặt k (khóa), bảng màu pal (gỗ/rơm/băng/vàng),
      charm (món treo: 'star' | 'moon' | 'heart' | 'bell'), charm2 (món treo thứ hai, tuỳ chọn), len (độ dài cán, 1 = chuẩn), bristle (độ dài rơm, mặc định 19).
   2) index.html: thêm 1 dòng CUỐI mảng MOUNTS, copy dòng chổi phù thủy rồi đổi n, k, cb và 'witch' trong brDraw.
   3) circus.js: thêm 1 dòng vào CL_ITEMS (copy dòng broom_witch, đổi k, n, d, pr).
   Muốn thêm món treo mới: thêm 1 hàm vào BR_CHARMS (vẽ quanh điểm (x,y)).
   ===================================================================================== */
(function(){
'use strict';
/* ---------- ĐỘNG CƠ VẼ 2x: đường cong → mặt nạ → vát sáng/tối + viền, cache thành ảnh ---------- */
const CW=136,CH=72,OX=-34,OY=-30;
const _pc={};
function pc(c){if(Array.isArray(c))return c;if(_pc[c])return _pc[c];let r;
 if(c[0]=='#'){let h=c.slice(1);if(h.length==3)h=h.replace(/./g,'$&$&');r=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),h.length>6?parseInt(h.slice(6,8),16):255]}
 else{const m=c.match(/[\d.]+/g).map(Number);r=[m[0],m[1],m[2],Math.round((m[3]==null?1:m[3])*255)]}
 return _pc[c]=r}
const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]];
const lit=(c,t)=>mixc(pc(c),[255,255,255,0],t),drk=(c,t)=>mixc(pc(c),[0,0,0,0],t);
// phân tích đường dẫn kiểu SVG tuyệt đối (M L Q C Z), trả về danh sách đa giác (điểm theo toạ độ game)
function parsePath(d){const t=d.match(/[MLQCZ]|-?\d*\.?\d+/g),polys=[];let i=0,cur=null,px=0,py=0,cmd='';
 const num=()=>+t[i++];
 while(i<t.length){const s=t[i];if(/[MLQCZ]/.test(s)){cmd=s;i++;if(cmd=='Z'){cur=null;continue}}
  if(cmd=='M'){px=num();py=num();cur=[[px,py]];polys.push(cur);cmd='L'}
  else if(cmd=='L'){px=num();py=num();cur.push([px,py])}
  else if(cmd=='Q'){const cx=num(),cy=num(),x=num(),y=num();for(let k=1;k<=10;k++){const q=k/10,a=(1-q)*(1-q),b=2*(1-q)*q,c=q*q;cur.push([a*px+b*cx+c*x,a*py+b*cy+c*y])}px=x;py=y}
  else if(cmd=='C'){const c1x=num(),c1y=num(),c2x=num(),c2y=num(),x=num(),y=num();for(let k=1;k<=12;k++){const q=k/12,a=(1-q)**3,b=3*(1-q)**2*q,c=3*(1-q)*q*q,e=q**3;cur.push([a*px+b*c1x+c*c2x+e*x,a*py+b*c1y+c*c2y+e*y])}px=x;py=y}}
 return polys}
const flipPath=d=>d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g,(m,a,b)=>(20-a)+' '+b);   // lật gương quanh x=10
function newLayer(){return{d:new Uint8ClampedArray(CW*CH*4),sh:[]}}
function Brush(){
 const Ls={legs:newLayer(),back:newLayer(),front:newLayer()};let L=Ls.back,DX=0,DY=0;
 const put=(x,y,c)=>{if(x<0||y<0||x>=CW||y>=CH)return;const i=(y*CW+x)*4,a=c[3]/255,d=L.d;
  if(a>=.99||!d[i+3]){d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=c[3]}
  else{const da=d[i+3]/255,oa=a+da*(1-a);d[i]=(c[0]*a+d[i]*da*(1-a))/oa;d[i+1]=(c[1]*a+d[i+1]*da*(1-a))/oa;d[i+2]=(c[2]*a+d[i+2]*da*(1-a))/oa;d[i+3]=oa*255}};
 const toH=p=>[(p[0]+DX-OX)*2,(p[1]+DY-OY)*2];
 function raster(polys){const m=new Uint8Array(CW*CH),E=[];let y0=1e9,y1=-1e9;
  for(const pl of polys){const P=pl.map(toH);for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];if(a[1]!=b[1])E.push([a,b]);y0=Math.min(y0,a[1]);y1=Math.max(y1,a[1])}}
  for(let y=Math.max(0,Math.floor(y0));y<=Math.min(CH-1,Math.ceil(y1));y++){const yy=y+.5,xs=[];
   for(const[a,b]of E)if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(yy-a[1])*(b[0]-a[0])/(b[1]-a[1]));
   xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){for(let x=Math.ceil(xs[k]-.5);x<Math.ceil(xs[k+1]-.5);x++)if(x>=0&&x<CW)m[y*CW+x]=1}}
  return m}
 function paint(m,st){const c=pc(st.c),ol=st.ol===0?null:pc(st.ol||drk(c,.55)),hi=pc(st.hi||lit(c,.38)),lo=pc(st.lo||drk(c,.3)),bev=st.bev!==0,form=st.form;
  let x0=1e9,x1=-1,y0=1e9,y1=-1;for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)if(m[y*CW+x]){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return;
  const inn=(x,y)=>x>=0&&y>=0&&x<CW&&y<CH&&m[y*CW+x];
  const ed=new Uint8Array(CW*CH);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(m[y*CW+x]&&!(inn(x-1,y)&&inn(x+1,y)&&inn(x,y-1)&&inn(x,y+1)))ed[y*CW+x]=1;
  const E=(x,y)=>x>=0&&y>=0&&x<CW&&y<CH&&ed[y*CW+x];
  const sp=Math.max(1,x1-x0),sq=Math.max(1,y1-y0);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!m[y*CW+x])continue;let col;
   if(ed[y*CW+x])col=ol||c;
   else{col=c;
    if(bev){const ul=E(x-1,y)||E(x,y-1)||E(x-1,y-1),lr=E(x+1,y)||E(x,y+1)||E(x+1,y+1);if(ul&&!lr)col=hi;else if(lr&&!ul)col=lo}
    if(form&&col===c){const q=(x-x0)/sp*.5+(y-y0)/sq*.5;if(q<.24)col=mixc(c,hi,.55);else if(q>.74)col=mixc(c,lo,.6)}
    if(st.sh)L.sh.push(x,y)}
   put(x,y,col)}}
 const B={
  use(n){L=Ls[n]},at(dx,dy){DX=dx||0;DY=dy||0},
  path(d,st){paint(raster(parsePath(d)),st)},
  sym(d,st){B.path(d,st);B.path(flipPath(d),st)},
  ell(cx,cy,rx,ry,st){const n=Math.max(16,Math.round((rx+ry)*14)),p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}paint(raster([p]),st)},
  // đường mảnh (gân lông, vân): từ (x0,y0) đến (x1,y1), bề dày w (điểm ảnh game)
  ln(x0,y0,x1,y1,c,w){w=w||.5;const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1,nx=-dy/l*w/2,ny=dx/l*w/2;
   paint(raster([[[x0+nx,y0+ny],[x1+nx,y1+ny],[x1-nx,y1-ny],[x0-nx,y0-ny]]]),{c,ol:0,bev:0})},
  dot(x,y,c,w){paint(raster([[[x,y],[x+(w||.5),y],[x+(w||.5),y+(w||.5)],[x,y+(w||.5)]]]),{c,ol:0,bev:0})},
  layers:Ls};
 return B}
// lá / lông vũ / lọn tóc / dải lụa: đường cong Bezier bậc 2 từ (x0,y0) → (x1,y1), cong `bend`, rộng `w`, bụng phình ở vị trí `pk`
function leafPath(x0,y0,x1,y1,w,bend,pk,tipBlunt){pk=pk||.4;bend=bend||0;const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,cx=(x0+x1)/2+nx*bend,cy=(y0+y1)/2+ny*bend,N=18,A=[],Bq=[],ex=Math.log(.5)/Math.log(pk),spine=[];
 for(let i=0;i<=N;i++){const s=i/N,a=(1-s)*(1-s),b=2*(1-s)*s,c=s*s,x=a*x0+b*cx+c*x1,y=a*y0+b*cy+c*y1,tx=2*(1-s)*(cx-x0)+2*s*(x1-cx),ty=2*(1-s)*(cy-y0)+2*s*(y1-cy),tl=Math.hypot(tx,ty)||1;
  let hw=w/2*Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(s,ex))),tipBlunt||.75);spine.push([x,y,-ty/tl,tx/tl]);A.push([x-ty/tl*hw,y+tx/tl*hw]);Bq.push([x+ty/tl*hw,y-tx/tl*hw])}
 return{d:'M'+A.map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' L')+' L'+Bq.reverse().map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' L')+'Z',spine}}
/* ---------- KIT CHỔI BAY: bảng cấu hình → ảnh 2x (cache) ---------- */
const BROOMS={};        // id → spec
const Y0=-13.8;
const BR_CHARMS={       // món treo ở đầu cán: hàm (b, x, y, pal) vẽ quanh điểm treo
 star(b,x,y,P){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?1.55:3.2;pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r])}
  b.path('M'+pts.map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' L')+'Z',{c:P.gold[0],hi:P.gold[1],lo:P.gold[2],ol:P.gold[3],form:1});
  b.ell(x-.6,y-.6,.5,.5,{c:'#fffbe0',ol:0,bev:0})},
 moon(b,x,y,P){b.path('M'+x+' '+(y-2.6)+' Q'+(x+3.4)+' '+y+' '+x+' '+(y+2.6)+' Q'+(x+1.3)+' '+y+' '+x+' '+(y-2.6)+'Z',{c:P.gold[0],hi:P.gold[1],lo:P.gold[2],ol:P.gold[3],form:1})},
 heart(b,x,y,P){b.path('M'+x+' '+(y+2.6)+' Q'+(x-3.6)+' '+(y-.4)+' '+(x-1.8)+' '+(y-2)+' Q'+x+' '+(y-2.6)+' '+x+' '+(y-.8)+' Q'+x+' '+(y-2.6)+' '+(x+1.8)+' '+(y-2)+' Q'+(x+3.6)+' '+(y-.4)+' '+x+' '+(y+2.6)+'Z',{c:P.gold[0],hi:P.gold[1],lo:P.gold[2],ol:P.gold[3],form:1})},
 bell(b,x,y,P){b.path('M'+(x-2)+' '+(y+1.8)+' Q'+(x-2)+' '+(y-2)+' '+x+' '+(y-2)+' Q'+(x+2)+' '+(y-2)+' '+(x+2)+' '+(y+1.8)+'Z',{c:P.gold[0],hi:P.gold[1],lo:P.gold[2],ol:P.gold[3],form:1});b.ell(x,y+2.1,.6,.6,{c:P.gold[2],ol:P.gold[3],bev:0})}
};
const wd=P=>({c:P.wood[0],hi:P.wood[1],lo:P.wood[2],ol:P.wood[3],form:1});
// vẽ chổi hướng PHẢI (cán ở phía trước = bên phải, đuôi rơm tỏa về bên trái). st = {sw:-1..1, mv:0/1}
function drawBroomSide(b,sp,st){
 const P=sp.pal,sw=st.sw,mv=st.mv,L=sp.len||1,ys=Y0+.9,ye=Y0-1.9,XF=24*L+1;      // đầu cán
 b.use('back');
 // ---- chùm lông sậy nhỏ ----
 const bx=-10.6,by=ys+.1,Lb=(sp.bristle||13);
 const ord=[0,6,1,5,2,4,3];
 for(const i of ord){const f=(i-3)/3,a=f*.34,len=Lb*(1-Math.abs(f)*.14)+(i%2?-.9:.7);
  const ex=bx-Math.cos(a)*len,ey=by+Math.sin(a)*len*.9+1.1+(mv?-.9:0)+sw*(.5+Math.abs(f)*.4)*(i%2?1:-1)*.6+f*.5;
  const c3=i%3==0?[P.straw[0],P.straw[1],P.straw[2]]:i%3==1?[P.straw[4]||P.straw[0],P.straw[1],P.straw[2]]:[P.straw[2],P.straw[0],P.straw[2]];
  const lf=leafPath(bx,by,ex,ey,2.2,f*-.6,.55,.5);
  b.path(lf.d,{c:c3[0],hi:c3[1],lo:c3[2],ol:P.straw[3],form:1});
  const sp2=lf.spine;for(let k=3;k<sp2.length-3;k++)b.ln(sp2[k][0],sp2[k][1],sp2[k+1][0],sp2[k+1][1],P.straw[2],.3)}
 // ---- cán gỗ ----
 const yt=ys-1.1,yb=ys+1.1;
 b.path('M-11 '+(yt+.2)+' L'+(XF-1)+' '+(ye-1)+' Q'+(XF+1.4)+' '+(ye-.9)+' '+(XF+1.4)+' '+ye+' Q'+(XF+1.4)+' '+(ye+.9)+' '+(XF-1)+' '+(ye+1)+' L-11 '+(yb+.2)+'Z',wd(P));
 const ly=x=>ys+(ye-ys)*(x+9)/(XF+9);
 b.ln(-10,ly(-10)-.35,XF-2,ly(XF-2)-.35,P.wood[1],.35);b.ln(-10,ly(-10)+.45,XF-2,ly(XF-2)+.45,P.wood[2],.35);
 // vòng vàng + dây quấn gần đầu cán
 for(const[x0,w]of[[XF-6.4,1.5],[XF-3.6,.9]])b.path('M'+x0+' '+(ly(x0)-1.35)+' L'+(x0+w)+' '+(ly(x0+w)-1.35)+' L'+(x0+w)+' '+(ly(x0+w)+1.35)+' L'+x0+' '+(ly(x0)+1.35)+'Z',{c:P.gold[0],hi:P.gold[1],lo:P.gold[2],ol:P.gold[3],form:1,sh:1});
 b.ell(XF+.6,ye,1.5,1.4,{c:P.wood[2],hi:P.wood[0],lo:P.wood[3],ol:P.wood[3]});
 // ---- dây buộc chùm sậy (nhỏ) ----
 b.path('M-12.2 '+(ys-1.5)+' Q-10.8 '+(ys-1.9)+' -9.4 '+(ys-1.4)+' L-9.5 '+(ys+1.9)+' Q-10.9 '+(ys+2.3)+' -12.1 '+(ys+1.9)+' Q-12.7 '+ys+' -12.2 '+(ys-1.5)+'Z',{c:P.band[0],hi:P.band[1],lo:P.band[2],ol:P.band[3],form:1});
 b.ln(-11.4,ys-1.6,-11.3,ys+2,P.gold[0],.4);
 // ---- món treo ----
 const tx=XF+.6,ty=ye+1,swg=sw*.9-(mv?1.4:0);
 const hang=(x0,len,charm,ox)=>{b.ln(x0,ty,x0+ox,ty+len,P.string||'#efe6cc',.4);BR_CHARMS[charm](b,x0+ox,ty+len+(charm=='moon'?1.2:2.6),P)};
 hang(tx-.3,5.6+(sp.charm2?0:2.6),sp.charm||'star',swg);
 if(sp.charm2)hang(tx-3.2,4,sp.charm2,swg*.8);
}
const _BC={};
function brBuild(sp,st){const key=[sp.k,st.sw,st.mv].join('|');if(_BC[key])return _BC[key];
 const b=Brush();drawBroomSide(b,sp,st);const L=b.layers.back,c=document.createElement('canvas');c.width=CW;c.height=CH;c.getContext('2d').putImageData(new ImageData(L.d,CW,CH),0,0);
 const m=document.createElement('canvas');m.width=CW;m.height=CH;const g=m.getContext('2d');g.translate(CW,0);g.scale(-1,1);g.drawImage(c,0,0);
 return _BC[key]={r:c,l:m,sh:L.sh}}
// lấy ctx + gốc toạ độ từ hàm R của drawRide
function brOrigin(R){const P=CanvasRenderingContext2D.prototype,old=P.fillRect;let cap=null;P.fillRect=function(x,y){cap={g:this,x,y}};try{R('#000',0,0,0,0)}finally{P.fillRect=old}return cap}
// d: 0 trước, 1 sau, 2 trái, 3 phải. Nhìn trước: đầu cán quay sang trái màn hình; nhìn sau: sang phải.
window.brDraw=function(id,R,d,f,b,t,pt,c){
 const sp=BROOMS[id];if(!sp)return;
 // nhìn sau: chổi nằm TRƯỚC (che đùi); các hướng khác: chổi nằm SAU người, riêng nhìn ngang có thêm cánh tay + bàn tay đặt lên cán (lớp trên)
 if(d==1?!pt:pt&&d<2)return;
 const sw=Math.round(Math.sin(t*(c&&c.mv?7:2.6))),mv=c&&c.mv?1:0,o=brOrigin(R);if(!o)return;
 const g=o.g,sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;
 if(!pt||d==1){const art=brBuild(sp,{sw,mv});g.drawImage((d==2||d==0)?art.l:art.r,o.x+OX,o.y+OY+b,CW/2,CH/2)}
 if(pt&&d>1){const S=(c&&c.S)||{},sh=S.sh||'#4a78b8',art=brArm(sp,sh,mv);g.drawImage(d==2?art.l:art.r,o.x+OX,o.y+OY+b,CW/2,CH/2)}
 g.imageSmoothingEnabled=sm};
// cánh tay chống lên cán (người hơi khom về trước): từ vai xuống bàn tay đặt trên cán, vẽ hướng phải
const _AM={};
function brArm(sp,sh,mv){const key=sp.k+'|'+sh+'|'+mv;if(_AM[key])return _AM[key];
 const b=Brush();b.use('back');const sx=sp.seat?sp.seat[0]:0,sy=sp.seat?sp.seat[1]:-14,XF=24*(sp.len||1)+1,ys=Y0+.9,ye=Y0-1.9;
 const hx=sx+9.5,hy=ys+(ye-ys)*(hx+9)/(XF+9)-.6,shx=sx+.8,shy=sy-6.6;
 const cm=pc(sh),sl={c:sh,hi:lit(sh,.3),lo:drk(sh,.28),ol:drk(sh,.6),form:1};
 b.path(leafPath(shx,shy,hx-.8,hy-1.2,2.3,-.8,.5,.9).d,sl);
 b.ell(hx,hy-.2,1.35,1.25,{c:'#f1c08a',hi:'#fff0d8',lo:'#d99e6a',ol:'#a8683a'});
 b.ln(hx-.7,hy+.5,hx+.9,hy+.5,'#a8683a',.3);
 const L=b.layers.back,c=document.createElement('canvas');c.width=CW;c.height=CH;c.getContext('2d').putImageData(new ImageData(L.d,CW,CH),0,0);
 const m=document.createElement('canvas');m.width=CW;m.height=CH;const g=m.getContext('2d');g.translate(CW,0);g.scale(-1,1);g.drawImage(c,0,0);
 return _AM[key]={r:c,l:m}}
window.brHov=(t,mv)=>Math.round(-11+Math.sin(t*(mv?3.4:2.2))*(mv?1.2:1.4));
window.BROOM={add(sp){BROOMS[sp.k]=sp},list:BROOMS};

// chân ngồi vắt qua cán chổi (cộng thêm độ bay hv để chân đi theo người)
window.brLegs=function(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const dr=6,y=sy+hv;
 if(d>1){R(shade(PT,-.15),sx-2,y-3,8,3);R(PT,sx+3,y-1,3,dr);R(shade(PT,.25),sx+3,y-1,1,dr);R(SD,sx+3,y-1+dr,5,2)}
 else for(const x0 of[-4,1]){R(PT,x0,y-3,3,dr+2);R(shade(PT,.25),x0,y-3,1,dr+2);R(SD,x0-.0,y-1+dr,3,2)}};
BROOM.add({k:'witch',charm:'star',seat:[0,-14],
 pal:{wood:['#8a5a2b','#c8924f','#5a3515','#2e1808'],
      straw:['#e2a73c','#ffe08a','#a8701c','#6b440c','#f2c15a'],
      band:['#7a3fb0','#b883f2','#4a2278','#24103e'],
      gold:['#f2c14e','#fff0a0','#c58a1c','#7a4d0e'],string:'#efe6cc'}});
})();
