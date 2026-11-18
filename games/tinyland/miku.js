/* =====================================================================
   miku.js — 🎀 MIKU CÁ TÍNH: Set (1.000 Xu) + Tóc (2.500 Xu), bán ở Shop Phố xá (Tiệm may: tab Set / tab Tóc & mũ)
   • Hình vẽ ở độ phân giải gấp đôi, đường cong mượt + vát sáng/tối + viền, KHÔNG dùng tam giác; có cache nên nhẹ.
   • Set: áo đầm hồng cổ trắng + nơ xanh ngọc, váy hồng xếp ly, tất đen, giày nâu (mascot — không che mặt).
   • Tóc: 2 búi đuôi xanh ngọc dài TỚI CHÂN (vượt khung 20 điểm ảnh), vòng nghe đỏ, kẹp chữ X, mái cong. Đội được với mọi set;
     mặc Set Miku mà chưa mua tóc thì có tóc bob ngắn xanh ngọc mặc định.
   • Giá: sửa số xu ở 2 dòng SETS.push / HAIRS.push cuối file (xu:1000, xu:2500).
   • Nạp CUỐI index.html (sau pinkcool.js); tự thêm vào CUỐI mảng SETS / HAIRS nên không lệch đồ đã mua.
   ===================================================================== */
(function(){
"use strict";
/* ---------- ĐỘNG CƠ VẼ 2x: đường cong → mặt nạ → vát sáng/tối + viền, cache thành ảnh ---------- */
const CW=88,CH=88,OX=-12,OY=-8;
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
 const Ls={legs:newLayer(),tails:newLayer(),back:newLayer(),front:newLayer()};let L=Ls.back,DX=0,DY=0;
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
/* ---------- đường cong mượt cho tóc dài ---------- */
function crs(P,n){const o=[];for(let i=0;i<P.length-1;i++){const a=P[Math.max(0,i-1)],b=P[i],c=P[i+1],d=P[Math.min(P.length-1,i+2)];
 for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t,f=(p0,p1,p2,p3)=>.5*(2*p1+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);o.push([f(a[0],b[0],c[0],d[0]),f(a[1],b[1],c[1],d[1])])}}
 o.push(P[P.length-1]);return o}
const WT=[[0,.8],[.1,1.25],[.3,1.85],[.55,1.8],[.78,1.3],[.93,.62],[1,.06]];
const wAt=(s,k)=>{for(let i=1;i<WT.length;i++)if(s<=WT[i][0]){const a=WT[i-1],b=WT[i],q=(s-a[0])/(b[0]-a[0]);return(a[1]+(b[1]-a[1])*q)*k}return WT[WT.length-1][1]*k};
function strand(P,k){const S=crs(P,9),n=S.length,L=[],R=[],N=[];
 for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)],tx=b[0]-a[0],ty=b[1]-a[1],tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,h=wAt(i/(n-1),k||1);
  L.push([S[i][0]+nx*h,S[i][1]+ny*h]);R.push([S[i][0]-nx*h,S[i][1]-ny*h]);N.push([nx,ny,h])}
 return{d:'M'+L.map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' L')+' L'+R.reverse().map(p=>p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' L')+'Z',S,N}}
const TL='#35d0c4',TLH='#8ff3ea',TLL='#1c9b9d',TLD='#0f6f78',TOL='#0a4a58';
const teal={c:TL,hi:TLH,lo:TLL,ol:TOL,form:1},tealD={c:TLL,hi:TL,lo:TLD,ol:TOL,form:1};
const RED='#e63946',REDH='#ff8a92',REDD='#9c1a2a';
const PK={c:'#f7a3c4',hi:'#ffd3e4',lo:'#dc75a0',ol:'#8a3a5c',form:1},PK2={c:'#f58fb9',hi:'#ffc4da',lo:'#d0638f',ol:'#7e2f52',form:1};
const WH={c:'#ffffff',hi:'#ffffff',lo:'#e6e9f5',ol:'#b9bfd6'},TIE={c:'#1fb9b0',hi:'#7df0e6',lo:'#0f7f84',ol:'#07484f',form:1};
const SKI={c:'#f1c08a',hi:'#fff0d8',lo:'#d99e6a',ol:'#a8683a'},BLK={c:'#26222c',hi:'#4b4556',lo:'#141218',ol:'#0a090c'},SHOE={c:'#5a3a30',hi:'#8a6256',lo:'#33201a',ol:'#1c0f0a'};
// ---------------- TÓC ----------------
function tails(b,v,x){b.use('tails');const{sw,mv}=x,k=mv?1.5:1;
 const s=(a)=>sw*a*k;
 if(v<2){for(const m of[-1,1]){const cx=10+m*(v==1?5.6:5.4);
  const P=[[cx,7.8],[10+m*8.4,10.2],[10+m*9.3+m*s(.15),15.6],[10+m*8.3+m*s(.5),22.2],[10+m*8.9+m*s(.85),28],[10+m*7.7+m*s(1.15),32.8]];
  const T=strand(P,1);b.path(T.d,teal);
  for(let i=6;i<T.S.length-6;i+=1){const q=T.N[i],p=T.S[i],h=q[2];if(i+1<T.S.length){const p2=T.S[i+1],q2=T.N[i+1];
   b.ln(p[0]+q[0]*h*-.45,p[1]+q[1]*h*-.45,p2[0]+q2[0]*q2[2]*-.45,p2[1]+q2[1]*q2[2]*-.45,TLH,.4);
   b.ln(p[0]+q[0]*h*.5,p[1]+q[1]*h*.5,p2[0]+q2[0]*q2[2]*.5,p2[1]+q2[1]*q2[2]*.5,TLL,.4)}}}}
 else{ // nhìn ngang (hướng phải): 2 đuôi sau gáy rủ xuống
  for(const[dx,dy,st]of[[.9,.5,tealD],[0,0,teal]]){const P=[[7.7+dx,8+dy],[5.5+dx,11.4],[4.1+dx,17.4],[3.5+dx+s(.2),23.4],[3.7+dx+s(.7),28.2],[3.1+dx+s(1.1),32.6]];
   const T=strand(P,1);b.path(T.d,st);
   if(!dx)for(let i=6;i<T.S.length-6;i++){const q=T.N[i],p=T.S[i],h=q[2],p2=T.S[i+1],q2=T.N[i+1];
    b.ln(p[0]+q[0]*h*-.45,p[1]+q[1]*h*-.45,p2[0]+q2[0]*q2[2]*-.45,p2[1]+q2[1]*q2[2]*-.45,TLH,.4)}}}}
function shortBob(b,v){b.use('tails');
 if(v<2)for(const m of[-1,1])b.path('M'+(10+m*5.6)+' 8 Q'+(10+m*6.8)+' 12 '+(10+m*5.8)+' 16.4 Q'+(10+m*4.4)+' 17.4 '+(10+m*3.6)+' 15.6 L'+(10+m*3.6)+' 9Z',teal);
 else b.path('M8.4 8 Q5.2 9 4.8 13 Q4.6 16.4 6.4 17 Q8 16 8.8 12.4Z',teal)}
function hairFront(b,v,x){b.use('front');const{sw}=x;
 if(v==0){
  for(const m of[-1,1])b.path('M'+(10+m*5)+' 9 Q'+(10+m*4.1)+' 8.6 '+(10+m*3.8)+' 10.6 Q'+(10+m*3.6)+' 13.4 '+(10+m*3.9)+' 16 Q'+(10+m*4.3)+' 17.6 '+(10+m*5)+' 17.2 Q'+(10+m*5.5)+' 14 '+(10+m*5.3)+' 11Z',teal);
  b.path('M5 10.4 Q4.2 5 8.4 4.5 Q10 4.2 11.6 4.5 Q15.8 5 15 10.4 Q14.5 8.4 13.6 7.9 Q12.6 9.8 11.2 8.3 Q10.4 10 9.4 8.2 Q8 9.6 7 7.9 Q5.7 8.7 5 10.4Z',teal);
  b.path('M8 4.9 Q10 4.4 12 4.9 Q10.6 6.4 8 4.9Z',{c:TLH,ol:0,bev:0});
  // kẹp tóc chữ X trắng
  b.ln(7.0,5.9,8.4,7.3,'#ffffff',.55);b.ln(8.4,5.9,7.0,7.3,'#ffffff',.55);b.ell(7.7,6.6,.35,.35,{c:'#7df0e6',ol:0,bev:0})}
 else if(v==1){
  b.path('M5.2 9.8 Q4.2 4.8 8.4 4.4 Q10 4.1 11.6 4.4 Q15.8 4.8 14.8 9.8 Q15.4 13.4 14.4 16.4 Q10 17.8 5.6 16.4 Q4.6 13.4 5.2 9.8Z',teal);
  for(const hx of[6.6,8.2,10,11.8,13.4])b.ln(hx,6.2,hx+(hx<10?-.25:hx>10?.25:0),15.8,hx%2?TLH:TLL,.4)}
 else{
  b.path('M5.6 12 Q5 6 9.4 4.6 Q13 4.2 14.2 7.4 Q14.5 8.8 13.8 9.2 Q12.4 9 11.5 8.2 Q10.7 9.7 9.7 8.7 Q8.6 9.9 8.2 12.4 Q8 14.4 7 15.4 Q5.8 14.8 5.6 12Z',teal);
  b.ln(8.4,5.4,9.4,7.6,'#ffffff',.5);b.ln(9.4,5.4,8.4,7.6,'#ffffff',.5)}
 // vòng nghe / nơ buộc đỏ ở gốc đuôi
 if(x.long||x.cuffs!==false){const cx=v==2?7.5:null;
  if(v<2)for(const m of[-1,1]){const px=10+m*5.4;b.ell(px,8.3,1.05,1.55,{c:RED,hi:REDH,lo:REDD,ol:'#5a0f1a'});b.ell(px,8.3,.42,.8,{c:'#2a1016',ol:0,bev:0})}
  else b.ell(7.6,8.7,1.05,1.5,{c:RED,hi:REDH,lo:REDD,ol:'#5a0f1a'})}}
// ---------------- THÂN: váy hồng, nơ xanh, tất đen ----------------
function legsL(b,v,x){b.use('legs');if(x.rd)return;const{lg}=x;
 const leg=(lx,l)=>{const yb=29-l;
  b.path('M'+lx+' 24 L'+(lx+3)+' 24 L'+(lx+2.95)+' 26.8 L'+(lx+.05)+' 26.8Z',SKI);
  b.path('M'+(lx-.05)+' 26.6 L'+(lx+3.05)+' 26.6 L'+(lx+3)+' '+(yb-.2)+' L'+lx+' '+(yb-.2)+'Z',BLK);
  b.ln(lx+.2,27.2,lx+2.8,27.2,'#5a5266',.35);
  b.path('M'+(lx-.3)+' '+(yb-.1)+' L'+(lx+3.3)+' '+(yb-.1)+' Q'+(lx+3.9)+' '+(yb+.3)+' '+(lx+3.6)+' '+(yb+1.3)+' L'+(lx-.5)+' '+(yb+1.3)+' Q'+(lx-.7)+' '+(yb+.4)+' '+(lx-.3)+' '+(yb-.1)+'Z',SHOE)};
 if(v<2){if(x.sit){leg(6,0);leg(11,0)}else if(lg>0){leg(11,0);leg(6,1)}else if(lg<0){leg(6,0);leg(11,1)}else{leg(6,0);leg(11,0)}}
 else{const sx=lg*2,x1=8+sx,x2=10-sx;if(x.sit){leg(8,0)}else if(lg>0){leg(x2,0);leg(x1,1)}else if(lg<0){leg(x1,0);leg(x2,1)}else{leg(x1,0);leg(x2,0)}}}
function arm(b,cx,dy,x,h){if(x.noarm)return;b.at(0,dy);
 if(h!=null){const ty=17-h;b.path('M'+(cx-1.3)+' '+(ty+3)+' L'+(cx+1.3)+' '+(ty+3)+' L'+(cx+1.2)+' '+(ty+7.4)+' L'+(cx-1.2)+' '+(ty+7.4)+'Z',PK);b.ell(cx,ty+1.5,1.1,1.5,SKI);b.path('M'+(cx-1.3)+' '+(ty+3.2)+' L'+(cx+1.3)+' '+(ty+3.2)+' L'+(cx+1.3)+' '+(ty+4.2)+' L'+(cx-1.3)+' '+(ty+4.2)+'Z',WH)}
 else{b.path('M'+(cx-1.5)+' 17.6 Q'+cx+' 16.9 '+(cx+1.5)+' 17.6 L'+(cx+1.35)+' 20.6 L'+(cx-1.35)+' 20.6Z',PK);
  b.path('M'+(cx-1.4)+' 19.9 L'+(cx+1.4)+' 19.9 L'+(cx+1.35)+' 21.1 L'+(cx-1.35)+' 21.1Z',WH);b.ln(cx-1.35,20.5,cx+1.35,20.5,'#26222c',.4);
  b.path('M'+(cx-1)+' 21 L'+(cx+1)+' 21 L'+(cx+.9)+' 23 L'+(cx-.9)+' 23Z',SKI);b.ell(cx,23.3,1.05,1,SKI)}
 b.at(0,0)}
function skirt(b,x0,x1,hm){ // váy xếp ly hồng, rộng từ x0 đến x1 (tại gấu)
 const w=(x1-x0);b.path('M'+(10-3.8)+' 21.2 L'+(10+3.8)+' 21.2 Q'+(x1-1)+' 23.4 '+x1+' 25.7 Q10 '+(27.2+hm)+' '+x0+' 25.7 Q'+(x0+1)+' 23.4 '+(10-3.8)+' 21.2Z',PK2);
 for(let i=1;i<6;i++){const q=i/6,tx=10-3.6+7.2*q,bx=x0+w*q;b.ln(tx,21.7,bx,26+hm*.5,'#c9588a',.45);b.ln(tx+.5,21.8,bx+.5,26+hm*.5,'#ffc4da',.35)}
 b.path('M'+(x0+.2)+' 25 Q10 '+(26.6+hm)+' '+(x1-.2)+' 25 L'+x1+' 25.9 Q10 '+(27.4+hm)+' '+x0+' 25.9Z',{c:'#ffe0ec',hi:'#ffffff',lo:'#f4b4cd',ol:'#c26a92'})}
function bowTie(b,cx,cy){
 b.path('M'+cx+' '+cy+' Q'+(cx-2)+' '+(cy-1.5)+' '+(cx-2.3)+' '+cy+' Q'+(cx-2)+' '+(cy+1.6)+' '+cx+' '+cy+'Z',TIE);
 b.path('M'+cx+' '+cy+' Q'+(cx+2)+' '+(cy-1.5)+' '+(cx+2.3)+' '+cy+' Q'+(cx+2)+' '+(cy+1.6)+' '+cx+' '+cy+'Z',TIE);
 b.path('M'+(cx-.6)+' '+(cy+.6)+' Q'+(cx-1.2)+' '+(cy+2.4)+' '+(cx-.7)+' '+(cy+3.4)+' L'+cx+' '+(cy+2.8)+' L'+(cx+.7)+' '+(cy+3.4)+' Q'+(cx+1.2)+' '+(cy+2.4)+' '+(cx+.6)+' '+(cy+.6)+'Z',TIE);
 b.ell(cx,cy,.65,.65,{c:'#1fb9b0',hi:'#a8fff6',lo:'#0f7f84',ol:'#07484f'})}
function bodyB(b,v,x,au){b.use('back');const{lg}=x;
 if(v==0){
  skirt(b,4,16,0);
  b.path('M6.5 16.2 Q10 15.4 13.5 16.2 L13.8 21.6 Q10 22.5 6.2 21.6Z',PK);
  b.path('M9.2 14.6 L10.8 14.6 L10.8 16.4 L9.2 16.4Z',SKI);
  b.path('M6.9 15.9 Q10 15.1 13.1 15.9 L11.5 18.6 Q10 19.8 8.5 18.6Z',WH);
  bowTie(b,10,17.3);b.ell(10,20.2,.38,.38,{c:'#26222c',ol:0,bev:0});
  b.ln(6.4,21.5,13.6,21.5,'#dc75a0',.5);
  arm(b,3.8,lg,x,au&&au[0]);arm(b,16.2,-lg,x,au&&au[1])}
 else if(v==1){
  skirt(b,4,16,0);
  b.path('M6.5 16.2 Q10 15.4 13.5 16.2 L13.8 21.6 Q10 22.5 6.2 21.6Z',PK);
  b.path('M6.9 15.9 Q10 15.1 13.1 15.9 L13 17.8 Q10 18.8 7 17.8Z',WH);
  b.path('M8.2 20.6 Q10 19.8 11.8 20.6 Q10 22.2 8.2 20.6Z',TIE);b.ell(10,20.9,.55,.55,{c:'#1fb9b0',ol:'#07484f',bev:0});
  arm(b,3.8,lg,x,au&&au[0]);arm(b,16.2,-lg,x,au&&au[1])}
 else{const sx=lg*2;
  skirt(b,5.4,15.4,0);
  b.path('M7.9 16.2 Q10.2 15.6 12.4 16.2 L12.8 21.6 Q10.2 22.4 7.7 21.6Z',PK);
  b.path('M9.4 14.6 L11 14.6 L11 16.3 L9.4 16.3Z',SKI);
  b.path('M8.3 15.9 Q10.4 15.3 12.4 16 L11.6 18.2 Q10 19 8.8 18Z',WH);
  bowTie(b,11.4,17.5);
  if(!x.noarm)arm(b,10-sx,0,x,au&&au[0])}}
const MIKU_C={};
function mkBuild(v,x,mode){const key=['m',v,x.Rt?1:0,x.lg,x.sw,x.mv?1:0,x.sit?1:0,x.rd?1:0,x.noarm?1:0,x.aup,mode].join('|');if(MIKU_C[key])return MIKU_C[key];
 const au=x.aup?x.aup.split(',').map(s=>s===''?null:+s):null;
 const b=Brush();
 if(mode!='haironly'){legsL(b,v,x);bodyB(b,v,x,au)}
 if(mode=='long'||mode=='haironly')tails(b,v,x);else shortBob(b,v);
 hairFront(b,v,Object.assign({long:1},x));
 const out={};
 for(const n of['legs','tails','back','front']){const L=b.layers[n],c=document.createElement('canvas');c.width=CW;c.height=CH;const g=c.getContext('2d'),im=new ImageData(L.d,CW,CH);
  if(v==2&&!x.Rt){const t=document.createElement('canvas');t.width=CW;t.height=CH;t.getContext('2d').putImageData(im,0,0);g.translate(CW,0);g.scale(-1,1);g.drawImage(t,0,0)}else g.putImageData(im,0,0);out[n]=c}
 return MIKU_C[key]=out}
function probe(fn){const P=CanvasRenderingContext2D.prototype,old=P.fillRect;let cap=null;P.fillRect=function(a,b){cap={g:this,x:a,y:b}};try{fn('#000',0,0,0,0)}finally{P.fillRect=old}return cap}
function ctxOf(o,k,Rt){const t=performance.now()/1000;return{lg:k.lg||0,Rt:k.side?!!k.Rt:true,sw:Math.round(Math.sin(t*2.2)),mv:!!o.mv,sit:!!k.sit,rd:!!k.rd,noarm:!!o.noarm,aup:o.aup?o.aup.join(','):''}}
const SKc='#f1c08a',SKDc='rgba(70,35,15,.28)';
// ---- Set Miku cá tính (mascot) ----
function drawMikuSet(r,u,o,S,k){
 const{side,Rt,back,sit,rd}=k,v=side?2:back?1:0,x=ctxOf(o,k);
 const hs=(o.hairObj||HAIRS[o.hair]||{}),mode=hs.k=='miku'?'long':'short';
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);
 const a=probe(r),bq=probe(u);if(!a||!bq)return;const g=a.g,sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;
 const art=mkBuild(v,x,mode),put=(n,p)=>g.drawImage(art[n],p.x+OX,p.y+OY,CW/2,CH/2);
 put('legs',a);put('tails',bq);put('back',bq);g.imageSmoothingEnabled=sm;
 if(!back){
  if(!side){E(u,SKc,10,11,4,4);u(SKDc,7,8,6,1);if(o.e>0)faceFx(u,o.e,0,0);else if(typeof faceDef=='function')faceDef(u,0,0);else{u('#2b1d12',8,11,1,2);u('#2b1d12',11,11,1,2);u('#b5604a',9,13,2,1)}}
  else{E(u,SKc,Rt?11:9,11,3,4);u(SKDc,Rt?8:6,8,6,1);if(o.e>0)faceFx(u,o.e,1,Rt);else if(typeof faceDef=='function')faceDef(u,1,Rt);else{u('#2b1d12',Rt?12:7,11,1,2);u('#b5604a',Rt?13:6,13,1,1)}}}
 g.imageSmoothingEnabled=false;put('front',bq);g.imageSmoothingEnabled=sm}
// ---- Tóc Miku cá tính (đội cho mọi set thường) ----
function hairMiku(u,o,K){
 const side=K.side,v=side?2:K.back?1:0,x={lg:0,Rt:side?!!K.Rt:true,sw:Math.round(Math.sin(performance.now()/1000*2.2)),mv:!!o.mv,sit:0,rd:0,noarm:0,aup:''};
 const bq=probe(u);if(!bq)return;const g=bq.g,sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;
 const art=mkBuild(v,x,'haironly');g.drawImage(art.tails,bq.x+OX,bq.y+OY,CW/2,CH/2);g.drawImage(art.front,bq.x+OX,bq.y+OY,CW/2,CH/2);g.imageSmoothingEnabled=sm}
// ---------- đăng ký (luôn thêm vào CUỐI SETS / HAIRS) ----------
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof HAIRFX==='undefined'||typeof MASCOT_DRAW==='undefined')return;
if(!SETS.some(s=>s.k=='miku'))SETS.push({n:'Miku cá tính',k:'miku',mascot:'miku',wide:1,xu:1000,
 ds:'Áo đầm hồng cổ trắng, nơ xanh ngọc, váy hồng xếp ly, tất đen dài, giày nâu. Hợp với Tóc Miku cá tính. Không che mặt.',
 sh:'#f7a3c4',shl:'#ffd3e4',shd:'#dc75a0',scarf:'#1fb9b0',belt:'#ffffff',pt:'#26222c',rpt:'#26222c',shoe:'#5a3a30'});
if(!HAIRS.some(h=>h.k=='miku'))HAIRS.push({n:'Tóc Miku cá tính',k:'miku',c:'#35d0c4',xu:2500});
MASCOT_DRAW.miku=drawMikuSet;HAIRFX.miku=hairMiku;
})();
