/* aulac2.js — Chiến binh Âu Lạc vẽ lại độ phân giải gấp đôi. Nạp SAU aulac.js; lỗi thì tự dùng bản cũ. */
(function(){
"use strict";
/* ---------- ĐỘNG CƠ VẼ 2x: đường cong → mặt nạ → vát sáng/tối + viền, cache thành ảnh ---------- */
const CW=76,CH=96,OX=-9,OY=-14;                     // khung 2x (nửa điểm ảnh): 38x48 điểm ảnh game, gốc lệch (-9,-14)
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
/* ---------- khung vẽ chính: dựng ảnh 2x (cache) rồi dán lên nhân vật + hiệu ứng lấp lánh ---------- */
const AUL2={f:{},m:{}};            // AUL2.f / AUL2.m = hàm thiết kế (b,v,x) → true nếu đã vẽ
const _AC={};
function aulBuild(des,v,x,key){
 let hit=_AC[key];if(hit)return hit;
 const b=Brush();
 if(!des(b,v,x))return _AC[key]={ok:0};
 const out={ok:1,cv:{},sh:[]};
 for(const n of['legs','back','front']){const L=b.layers[n],c=document.createElement('canvas');c.width=CW;c.height=CH;const g=c.getContext('2d');
  const im=new ImageData(L.d,CW,CH);
  if(v==2&&!x.Rt){const t=document.createElement('canvas');t.width=CW;t.height=CH;t.getContext('2d').putImageData(im,0,0);g.translate(CW,0);g.scale(-1,1);g.drawImage(t,0,0)}
  else g.putImageData(im,0,0);
  out.cv[n]=c;
  for(let i=0;i<L.sh.length;i+=2){const px=(v==2&&!x.Rt)?CW-1-L.sh[i]:L.sh[i];out.sh.push([px/2+OX,L.sh[i+1]/2+OY])}}
 return _AC[key]=out}
const _orig=window.drawAuLac;
window.drawAuLac=function(g,r,u,o,S,k){
 try{
  const {lg,side,Rt,back,sit,rd}=k,t=performance.now()/1000,fem=S.aul=='f',des=(fem?AUL2.f:AUL2.m).draw;
  if(!des)return _orig(g,r,u,o,S,k);
  const v=side?2:back?1:0,sw=Math.round(Math.sin(t*2.2)),sw2=Math.round(Math.sin(t*2.2+1.7));
  const x={lg,Rt:v==2?!!Rt:true,sw,sw2,sit:!!sit,rd:!!rd,noarm:!!o.noarm,aup:o.aup?o.aup.join(','):'',S,o};
  const key=[fem?1:0,v,x.Rt?1:0,lg,sw,sw2,x.sit?1:0,x.rd?1:0,x.noarm?1:0,x.aup,fem?'':(S.pt||'')+(S.shoe||'')+(S.belt||'')].join('|');
  const art=aulBuild(des,v,x,key);if(!art.ok)return _orig(g,r,u,o,S,k);
  // gốc toạ độ thực của nhân vật (ox,oy) và độ nhún khi đi
  const fr=g.fillRect;let p0,p1;g.fillRect=function(a,b){p0=[a,b]};r('#000',0,0,0,0);g.fillRect=function(a,b){p1=[a,b]};u('#000',0,0,0,0);delete g.fillRect;
  const ox=p0[0],oy=p0[1],bob=p1[1]-p0[1];
  const SKD='rgba(70,35,15,.28)',SK='#f1c08a';
  const SHD=fem?'rgba(120,235,170,'+(.05+.03*Math.sin(t*1.5)).toFixed(3)+')':'rgba(255,170,90,'+(.05+.03*Math.sin(t*1.5)).toFixed(3)+')';
  if(!o.nosh){E(r,SHD,10,19,12,14);E(r,SHD,10,19,9,11)}
  if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);
  const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;
  const put=(n,dy)=>g.drawImage(art.cv[n],ox+OX,oy+OY+dy,CW/2,CH/2);
  put('legs',0);put('back',bob);
  g.imageSmoothingEnabled=sm;
  // ---- mặt (giữ nguyên biểu cảm của game) ----
  if(!back){
   if(!side){E(u,SK,10,11,4,4);u(SKD,7,8,6,1);if(o.e>0)faceFx(u,o.e,0,0);else if(typeof faceDef=='function')faceDef(u,0,0);else{u('#2b1d12',8,11,1,2);u('#2b1d12',11,11,1,2);u('#b5604a',9,13,2,1)}}
   else{E(u,SK,Rt?11:9,11,3,4);u(SKD,Rt?8:6,8,6,1);if(o.e>0)faceFx(u,o.e,1,Rt);else if(typeof faceDef=='function')faceDef(u,1,Rt);else{u('#2b1d12',Rt?12:7,11,1,2);u('#b5604a',Rt?13:6,13,1,1)}}}
  g.imageSmoothingEnabled=false;put('front',bob);g.imageSmoothingEnabled=sm;
  // ---- dải sáng trôi trên kim loại / ngọc ----
  {const br=.5+.5*Math.sin(t*1.4);
   for(const[mx,my]of art.sh){const ph=((t*.42-(mx*.055+my*.085))%1+1)%1,a=Math.pow(Math.max(0,Math.sin(ph*Math.PI*2)),6)*(.2+.3*br);
    if(a>.05)u('rgba(255,244,200,'+a.toFixed(2)+')',mx,my,.5,.5);
    if(Math.sin(t*2.1+mx*1.7+my*2.3)>.985)u('rgba(255,255,235,.8)',mx,my,.5,.5)}}
  AUL_SP.forEach(([sx,sy,off,col])=>{const ph=((t*.4+off)%1),a=Math.sin(Math.PI*ph);if(a<.15)return;
   const yy=Math.round(sy-ph*3),al=Math.min(1,a*1.4);r('rgba('+col+','+al.toFixed(2)+')',sx,yy,1,1);const c2='rgba('+col+','+(al*.6).toFixed(2)+')';
   if(a>.7){r(c2,sx-1,yy,1,1);r(c2,sx+1,yy,1,1);r(c2,sx,yy-1,1,1);r(c2,sx,yy+1,1,1)}});
  if(!fem&&!o.nosh)AUL_EM.forEach(([ex,ey,off],i)=>{const ph=((t*.55+off)%1);if(ph>.8)return;const yy=Math.round(ey-ph*18),xx=Math.round(ex+Math.sin(t*3+i*2)*1.5),a=1-ph/.8;
   r('rgba(255,'+(150+Math.round(ph*80))+',60,'+a.toFixed(2)+')',xx,yy,1,1);if(a>.5)r('rgba(255,210,120,'+(a*.5).toFixed(2)+')',xx,yy-1,1,1)});
 }catch(e){if(!window.__aul2err){window.__aul2err=1;console.warn('[aulac2] lỗi, dùng bản cũ:',e)}delete g.fillRect;return _orig(g,r,u,o,S,k)}
};
/* ---------- NỮ CHIẾN BINH ÂU LẠC ---------- */
(function(){
const G='#f2c14e',GL='#ffe58a',GD='#c58a1c',GDD='#8a5a12',GOL='#7a4d0e';
const AR='#8f3322',ARL='#b8523a',ARD='#5e1f14',ARK='#3d130c';
const JD='#3fd18a',JL='#b6f8d6',JK='#1b8a5a';
const HC='#1c1620',HL='#463a58',HD='#0e0a12',HOL='#06040a';
const SK='#f1c08a',SKD='#d99e6a',SKL='#fff0d8';
const gold={c:G,hi:GL,lo:GD,ol:GOL,form:1,sh:1};
const armor={c:AR,hi:ARL,lo:ARD,ol:ARK,form:1};
const jade={c:JD,hi:JL,lo:JK,ol:'#0d5a3a',sh:1};
const hair={c:HC,hi:HL,lo:HD,ol:HOL};
const skin={c:SK,hi:SKL,lo:SKD,ol:'#a8683a'};
const silk={c:'rgba(86,214,206,.78)',hi:'rgba(200,255,250,.9)',lo:'rgba(36,140,160,.82)',ol:'rgba(20,100,120,.8)'};
const leaf=(b,x0,y0,x1,y1,w,bend,pk,st)=>{const L=leafPath(x0,y0,x1,y1,w,bend,pk);b.path(L.d,st);return L};
// lông vũ vàng: lá + gân giữa + các gai lông chéo
function goldFeather(b,x0,y0,x1,y1,w,bend,sway){
 const L=leafPath(x0,y0,x1,y1,w,bend,.38,.8);b.path(L.d,gold);
 const sp=L.spine;
 // gân giữa
 for(let i=1;i<sp.length-2;i++){b.ln(sp[i][0],sp[i][1],sp[i+1][0],sp[i+1][1],GD,.5)}
 // gai lông chéo về phía ngọn
 for(let i=4;i<sp.length-3;i+=3){const p=sp[i],q=i/(sp.length-1),hw=w/2*Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(q,Math.log(.5)/Math.log(.38)))),.8)*.9;
  const tx=p[3],ty=-p[2];
  b.ln(p[0],p[1],p[0]+p[2]*hw+tx*hw*.8,p[1]+p[3]*hw+ty*hw*.8,GL,.5);
  b.ln(p[0],p[1],p[0]-p[2]*hw+tx*hw*.8,p[1]-p[3]*hw+ty*hw*.8,GD,.5)}
 return L}
AUL2.f.draw=function(b,v,x){
 const {lg,sw,sw2,sit,rd,noarm,aup,Rt}=x,ay=lg;
 const au=aup?aup.split(',').map(Number):null;
 // ===== chân / giày (lớp không nhún) =====
 b.use('legs');
 const foot=(fx,l)=>{const yy=29.2-l;b.path('M'+fx+' '+yy+' L'+(fx+3)+' '+yy+' Q'+(fx+3.5)+' '+(yy+1.2)+' '+(fx+3)+' '+(yy+1.6)+' L'+(fx-.2)+' '+(yy+1.6)+' Q'+(fx-.5)+' '+(yy+.6)+' '+fx+' '+yy+'Z',{c:'#7a5424',hi:GL,lo:'#4a3010',ol:'#2e1c08'});b.path('M'+(fx+.3)+' '+(yy+.1)+' L'+(fx+2.7)+' '+(yy+.1)+' L'+(fx+2.7)+' '+(yy+.6)+' L'+(fx+.3)+' '+(yy+.6)+'Z',{c:G,ol:0,bev:0})};
 if(!rd){
  if(v==0){if(sit){foot(6,0);foot(11,0)}else if(lg>0){foot(11,0);foot(6,1)}else if(lg<0){foot(6,0);foot(11,1)}else{foot(6,0);foot(11,0)}}
  else if(v==1){if(sit){foot(6,0);foot(11,0)}else if(lg>0){foot(11,0);foot(6,1)}else if(lg<0){foot(6,0);foot(11,1)}else{foot(6,0);foot(11,0)}}
  else{const sx=lg*2,x1=8+sx,x2=10-sx;if(sit){foot(8,0)}else if(lg>0){foot(x2,0);foot(x1,1)}else if(lg<0){foot(x1,0);foot(x2,1)}else{foot(x1,0);foot(x2,0)}}}
 b.use('back');
 if(v==0)return front(b,x,au);
 if(v==1)return backv(b,x,au);
 return sidev(b,x,au);
};
function backv(b,x,au){
 const {lg,sw,sw2,noarm}=x;
 for(const s of[0,1]){const m=s?1:-1,k=s?sw2:sw;
  b.path('M'+(10+m*5.2)+' 16.8 Q'+(10+m*(7.6+k*.5))+' 18 '+(10+m*(8.2+k*.8))+' 22.6 Q'+(10+m*(8.4+k))+' 26 '+(10+m*(6.8+k*.6))+' 29.2 Q'+(10+m*(7+k*.6))+' 25.6 '+(10+m*6.5)+' 22.2 Q'+(10+m*6)+' 19.4 '+(10+m*4.8)+' 18.2Z',silk)}
 b.path('M6.1 21.2 L13.9 21.2 Q15 24.4 16.9 28.2 Q16.9 29.1 16 29.2 Q13 29.7 10 29.2 Q7 29.7 4 29.2 Q3.1 29.1 3.1 28.2 Q5 24.4 6.1 21.2Z',armor);
 for(const[x0,x1]of[[7.6,5.8],[8.9,8.2],[10,10],[11.1,11.8],[12.4,14.2]]){b.ln(x0,22.4,x1,28.6,ARD,.45);b.ln(x0+.45,22.6,x1+.45,28.6,ARL,.35)}
 b.path('M3.3 27.2 Q10 29 16.7 27.2 L16.9 29 Q10 30 3.1 29Z',gold);
 b.path('M6.6 16.3 Q10 15.5 13.4 16.3 L13.3 20.8 Q10 22 6.7 20.8Z',armor);
 b.ln(10,16.2,10,21,G,.7);b.ln(7.6,18.4,12.4,18.4,GD,.4);
 b.path('M6.4 20.4 Q10 21.8 13.6 20.4 L13.7 22.4 Q10 23.6 6.3 22.4Z',gold);
 b.ell(10,22,1.05,.85,jade);
 const arm=(s,dy)=>{const m=s?1:-1,cx=10+m*6.2;b.at(0,dy);
  if(!noarm){
   if(au){const h=au[s]||0,ty=17-h;b.path('M'+(cx-1)+' '+(ty+3)+' L'+(cx+1)+' '+(ty+3)+' L'+(cx+1.1)+' '+(ty+8)+' L'+(cx-1.1)+' '+(ty+8)+'Z',armor);b.ell(cx,ty+1.6,1.1,1.5,skin);b.path('M'+(cx-1.1)+' '+(ty+3.4)+' L'+(cx+1.1)+' '+(ty+3.4)+' L'+(cx+1.1)+' '+(ty+4.4)+' L'+(cx-1.1)+' '+(ty+4.4)+'Z',gold)}
   else{
    b.path('M'+(cx-1.4)+' 17.6 L'+(cx+1.4)+' 17.6 L'+(cx+1.2)+' 21 L'+(cx-1.2)+' 21Z',armor);
    b.path('M'+(cx-1.1)+' 20.8 L'+(cx+1.1)+' 20.8 L'+(cx+1)+' 23.2 L'+(cx-1)+' 23.2Z',skin);
    b.path('M'+(cx-1.5)+' 20.6 L'+(cx+1.5)+' 20.6 L'+(cx+1.4)+' 22.2 L'+(cx-1.4)+' 22.2Z',gold);
    b.ell(cx,23.8,1.05,1,skin)}}
  b.at(0,0)};
 arm(0,lg);arm(1,-lg);
 for(const m of[-1,1]){const cx=10+m*5.2;
  b.path('M'+cx+' 15.6 Q'+(cx+m*2.2)+' 15.8 '+(cx+m*2.4)+' 17.8 Q'+(cx+m*2.2)+' 19.4 '+(cx+m*.6)+' 19.2 Q'+(cx-m*1)+' 18 '+(cx-m*1.1)+' 16.8Z',gold)}
 b.use('front');
 b.path('M5.0 8 Q4.3 4.8 7.8 4.2 Q10 3.8 12.2 4.2 Q15.7 4.8 15 8 Q16 12 16.2 17 Q16.6 22 16.8 27 Q16 28.6 14.6 27.8 Q13.4 28.6 12.2 27.8 Q11 28.6 10 27.8 Q9 28.6 7.8 27.8 Q6.6 28.6 5.4 27.8 Q4 28.6 3.2 27 Q3.4 22 3.8 17 Q4 12 5 8Z',hair);
 for(const[hx,y0,y1]of[[6.6,9,26.5],[8.2,8.4,27],[10,8,27.4],[11.8,8.4,27],[13.4,9,26.5]]){b.ln(hx,y0,hx+(hx<10?-.3:hx>10?.3:0),y1,HL,.4);b.ln(hx+.55,y0+.5,hx+.55+(hx<10?-.3:hx>10?.3:0),y1-.5,HD,.35)}
 for(const[sx,hh]of[[4.4,4.6],[6.4,3.8],[8.2,4.6],[10,3.6],[11.8,4.6],[13.6,3.8],[15.6,4.6]]){b.path(leafPath(sx,28.6-hh,sx+(sx<10?-.3:sx>10?.3:0),28.9,1.7,sx<10?.4:-.4,.35).d,{c:G,hi:GL,lo:GD,ol:GOL})}
 b.path('M5.0 9.2 Q10 6.6 15 9.2 L15 10.4 Q10 8 5 10.4Z',gold);
 for(const m of[-1,1])leaf(b,10+m*1,6.4,10+m*5.4+sw*.3,-1.8,2.0,-m*1.8,.4,gold);
 goldFeather(b,10,6.8,10+sw*.4,-7.6,4.4,sw*.5,sw);
 b.ell(10,8.4,.9,.9,jade);
 return true}
function sidev(b,x,au){
 const {lg,sw,sw2,noarm}=x,sx=lg*2;
 // tóc dài thả sau lưng
 b.path('M10.8 5.6 Q7 5 5.8 8.6 Q4.6 12.4 4.2 17 Q3.4 22 3.6 27 Q4.6 28.6 6.2 27.8 Q7.4 28.6 8.8 27.6 Q9.6 24 9.8 20 Q10 17 10.4 14Z',hair);
 for(const[hx,h]of[[4.4,4.8],[6.2,4.2],[8,4.6]])b.path(leafPath(hx,28.2-h,hx-.2,28.6,1.7,.3,.35).d,{c:G,hi:GL,lo:GD,ol:GOL});
 // lụa
 for(const[k,dy]of[[sw,0],[sw2,2.6]]){const e=k*.8;b.path('M9.2 '+(17+dy*.3)+' Q5 '+(17.2+dy+e)+' 2.4 '+(20.4+dy+e*2)+' Q.2 '+(23.4+dy+e)+' -1.6 '+(27.2+dy)+' Q3.6 '+(24.2+dy)+' 4.2 '+(21.6+dy+e)+' Q6.6 '+(19.4+dy)+' 8.8 '+(18.4+dy*.3)+'Z',silk)}
 // váy
 b.path('M7.6 21.2 L12.8 21.2 Q14.8 24.6 16.2 28.2 Q16.2 29.2 15.2 29.2 Q11 29.7 6.2 29.2 Q5 29.1 5 28.2 Q6.6 24.6 7.6 21.2Z',armor);
 for(const[x0,x1]of[[8.6,7.2],[10,9.8],[11.4,12.6]]){b.ln(x0,22.4,x1,28.6,ARD,.45);b.ln(x0+.45,22.6,x1+.45,28.6,ARL,.35)}
 b.path('M5.2 27.2 Q10.6 29 16.1 27.2 L16.3 29 Q10.6 30 5.1 29Z',gold);
 // thân
 b.path('M8 16.2 Q10.2 15.6 12.2 16.2 L12.6 21 Q10 22.1 7.8 21Z',armor);
 b.path('M8.4 16.2 Q10.2 15.7 11.8 16.2 L11.2 17.4 Q10 18.6 9 17.4Z',gold);
 b.path('M7.8 20.4 Q10.2 21.6 12.6 20.4 L12.7 22.4 Q10.2 23.4 7.7 22.4Z',gold);
 b.ell(11.8,21.9,.8,.8,jade);
 b.path('M9.4 14.6 L11 14.6 L11 16.3 L9.4 16.3Z',skin);
 // tay gần
 if(!noarm){const cx=10-sx;
  if(au){const h=au[0]||0,ty=17-h;b.path('M'+(cx-1)+' '+(ty+3)+' L'+(cx+1)+' '+(ty+3)+' L'+(cx+1.1)+' '+(ty+8)+' L'+(cx-1.1)+' '+(ty+8)+'Z',armor);b.ell(cx,ty+1.6,1.1,1.5,skin);b.path('M'+(cx-1.1)+' '+(ty+3.4)+' L'+(cx+1.1)+' '+(ty+3.4)+' L'+(cx+1.1)+' '+(ty+4.4)+' L'+(cx-1.1)+' '+(ty+4.4)+'Z',gold)}
  else{b.path('M'+(cx-1.5)+' 17.4 L'+(cx+1.5)+' 17.4 L'+(cx+1.3)+' 21 L'+(cx-1.3)+' 21Z',armor);
   b.path('M'+(cx-1.1)+' 20.8 L'+(cx+1.1)+' 20.8 L'+(cx+1)+' 23.2 L'+(cx-1)+' 23.2Z',skin);
   b.path('M'+(cx-1.5)+' 20.6 L'+(cx+1.5)+' 20.6 L'+(cx+1.4)+' 22.2 L'+(cx-1.4)+' 22.2Z',gold);b.ell(cx,23.8,1.05,1,skin)}}
 b.path('M8.2 16.2 Q10 15.2 12.2 16.4 Q12.6 18 11.4 19 Q9.2 19.2 8.2 17.6Z',gold);b.ell(10.2,17.2,.5,.5,jade);
 b.use('front');
 // tóc trên đầu + vòng mão + lông vũ
 b.path('M5.8 12.4 Q5 6 9.4 4.5 Q13.2 3.9 14.3 7.2 Q14.5 8.5 13.8 9 Q11.6 7.7 9.8 8.8 Q8.4 9.6 8.3 12 Q8.2 14.2 7 15 Q5.8 14.4 5.8 12.4Z',hair);
 b.path('M7 10.2 Q8.4 7.6 13.8 6.6 L14.4 7.8 Q9.8 8.4 8.2 11Z',gold);
 b.path(leafPath(8.5,8,6.6,15.4,1.6,-.4,.35).d,hair);
 for(const m of[1])leaf(b,9.8,6.4,6.4+sw*.3,-1.4,2.0,1.4,.4,gold);
 goldFeather(b,11,6.6,9.6+sw*.4,-7.2,4.2,-sw*.5-.5,sw);
 b.path('M13.2 6.2 L14.2 7.4 L13.2 8.8 L12.4 7.4Z',jade);
 return true}
function front(b,x,au){
 const {lg,sw,sw2,noarm}=x;
 // --- tóc dài sau lưng + ngọn vàng ---
 b.path('M5.2 7.6 Q4.2 11 3.6 16 Q3.0 21.5 2.9 26 Q3.4 28 5 27.6 Q6.4 26.4 8 27.9 Q10 27.0 12 27.9 Q13.6 26.4 15 27.6 Q16.6 28 17.1 26 Q17.0 21.5 16.4 16 Q15.8 11 14.8 7.6 Q10 4.8 5.2 7.6Z',hair);
 for(const[sx,ln,hh]of[[3.6,0,5.2],[5.2,1,4.4],[14.8,1,4.4],[16.4,0,5.2]]){
  b.path(leafPath(sx,28-hh,sx+(sx<10?-.35:.35),28.3,1.7,sx<10?.5:-.5,.35).d,{c:G,hi:GL,lo:GD,ol:GOL})}
 // --- dải lụa xanh ngọc phía sau ---
 for(const s of[0,1]){const m=s?1:-1,k=s?sw2:sw;
  const d='M'+(10+m*5.2)+' 16.8 Q'+(10+m*(9+k*.6))+' 17.8 '+(10+m*(10+k))+' 22.6 Q'+(10+m*(10.2+k*1.2))+' 26 '+(10+m*(8.2+k*.8))+' 29.4 Q'+(10+m*(7.6+k*.6))+' 25.6 '+(10+m*(7.2))+' 22.2 Q'+(10+m*6.4)+' 19.4 '+(10+m*4.8)+' 18.2Z';
  b.path(d,silk)}
 // --- váy ---
 b.path('M6.1 21.2 L13.9 21.2 Q15 24.4 16.9 28.2 Q16.9 29.1 16 29.2 Q13 29.7 10 29.2 Q7 29.7 4 29.2 Q3.1 29.1 3.1 28.2 Q5 24.4 6.1 21.2Z',armor);
 for(const[x0,x1]of[[7.6,5.8],[8.9,8.2],[11.1,11.8],[12.4,14.2]]){b.ln(x0,22.4,x1,28.6,ARD,.45);b.ln(x0+.45,22.6,x1+.45,28.6,ARL,.35)}
 b.path('M3.3 27.2 Q10 29 16.7 27.2 L16.9 29 Q10 30 3.1 29Z',gold);
 b.path('M9.0 21.8 L11.0 21.8 L11.9 28.2 L8.1 28.2Z',{c:ARD,hi:ARL,lo:ARK,ol:ARK});
 b.path('M10 23.2 L11.1 24.9 L10 26.6 L8.9 24.9Z',jade);
 // --- thân giáp ---
 b.path('M6.6 16.3 Q10 15.5 13.4 16.3 L13.3 20.8 Q10 22 6.7 20.8Z',armor);
 b.path('M7.8 16.4 Q10 15.7 12.2 16.4 L11.2 17.6 Q10 19.8 8.8 17.6Z',gold);
 b.ell(10,18.5,.75,.85,jade);
 b.ln(7.4,19.2,9,20.1,ARD,.4);b.ln(12.6,19.2,11,20.1,ARD,.4);
 b.path('M6.4 20.4 Q10 21.8 13.6 20.4 L13.7 22.4 Q10 23.6 6.3 22.4Z',gold);
 b.ell(10,22,1.05,.85,jade);
 b.path('M9.0 14.7 L11 14.7 L11 16.3 L9 16.3Z',skin);
 // --- tay + giáp vai ---
 const arm=(s,dy)=>{const m=s?1:-1,cx=10+m*6.2;b.at(0,dy);
  if(!noarm){
   if(au){const h=au[s]||0,ty=17-h;b.path('M'+(cx-1)+' '+(ty+3)+' L'+(cx+1)+' '+(ty+3)+' L'+(cx+1.1)+' '+(ty+8)+' L'+(cx-1.1)+' '+(ty+8)+'Z',armor);b.ell(cx,ty+1.6,1.1,1.5,skin);b.path('M'+(cx-1.1)+' '+(ty+3.4)+' L'+(cx+1.1)+' '+(ty+3.4)+' L'+(cx+1.1)+' '+(ty+4.4)+' L'+(cx-1.1)+' '+(ty+4.4)+'Z',gold)}
   else{
    b.path('M'+(cx-1.4)+' 17.6 L'+(cx+1.4)+' 17.6 L'+(cx+1.2)+' 21 L'+(cx-1.2)+' 21Z',armor);
    b.path('M'+(cx-1.1)+' 20.8 L'+(cx+1.1)+' 20.8 L'+(cx+1)+' 23.2 L'+(cx-1)+' 23.2Z',skin);
    b.path('M'+(cx-1.5)+' 20.6 L'+(cx+1.5)+' 20.6 L'+(cx+1.4)+' 22.2 L'+(cx-1.4)+' 22.2Z',gold);
    b.ell(cx,23.8,1.05,1,skin)}}
  b.at(0,0)};
 arm(0,lg);arm(1,-lg);
 for(const m of[-1,1]){const cx=10+m*5.2;
  b.path('M'+(cx-m*-0)+' 15.6 Q'+(cx+m*2.2)+' 15.8 '+(cx+m*2.4)+' 17.8 Q'+(cx+m*2.2)+' 19.4 '+(cx+m*.6)+' 19.2 Q'+(cx-m*1)+' 18 '+(cx-m*1.1)+' 16.8Z',gold);
  b.ell(cx+m*1.1,17.5,.5,.5,jade)}
 // ===== lớp trước: tóc, mão, lông vũ =====
 b.use('front');
 for(const m of[-1,1]){ // lọn tóc rủ trước vai
  const x0=10+m*5.1;
  b.path('M'+x0+' 9 Q'+(x0+m*.9)+' 8.6 '+(x0+m*1)+' 10 Q'+(x0+m*1.1)+' 13.5 '+(x0+m*.9)+' 17 Q'+(x0+m*.9)+' 20 '+(x0+m*.3)+' 23 Q'+(x0-m*.6)+' 24.2 '+(x0-m*1.2)+' 22.8 Q'+(x0-m*1.1)+' 18 '+(x0-m*.9)+' 13.5Z',hair);
  b.path(leafPath(x0-m*.5,19.4,x0-m*.2,24.6,1.6,m*.3,.4).d,{c:G,hi:GL,lo:GD,ol:GOL})}
 // mũ tóc
 b.path('M4.9 10.4 Q4.2 5.8 7.8 4.8 Q10 4.3 12.2 4.8 Q15.8 5.8 15.1 10.4 Q14.5 8.6 13.4 8.3 Q10 7.1 6.6 8.3 Q5.5 8.6 4.9 10.4Z',hair);
 // vòng mão vàng
 b.path('M5.4 9.2 Q6 7.6 7.6 7.1 Q10 6.3 12.4 7.1 Q14 7.6 14.6 9.2 L14.2 9.6 Q13.4 8.4 12.3 8 Q10 7.4 7.7 8 Q6.6 8.4 5.8 9.6Z',gold);
 // lông vũ vàng lớn + hai lá phụ
 const bend=sw*.5;
 for(const m of[-1,1]){leaf(b,10+m*1,6.6,10+m*5.4+sw*.3,-1.6,2.0,-m*1.8,.4,gold)}
 goldFeather(b,10,7,10+sw*.4,-7.4,4.4,sw*.5,sw);
 // ngọc giữa trán
 b.path('M10 5.9 L11.1 7.4 L10 9.3 L8.9 7.4Z',jade);
 b.ell(5.3,10.4,.55,.55,jade);b.ell(14.7,10.4,.55,.55,jade);
 return true}
})();
/* ---------- NAM CHIẾN BINH ÂU LẠC ---------- */
(function(){
const BZ='#c9822a',BZL='#f0b24a',BZD='#8a5316',BOL='#4a2a08',G='#f2c14e',GL='#ffe58a',GD='#c58a1c';
const TU='#6b2a1c',TUL='#8f4430',TUD='#40180f';
const FM='#7d2a26',FML='#b04a3c',FMD='#4d1714',FOL='#2a0b0a';
const FT='#4aa6b0',FTL='#9be8e6',FTD='#2a6e7a',TOL='#15424c';
const RS='#e03a4a',RSL='#ff7a86',RSD='#a01c2c';
const BL='#8fb3bc',BLL='#dff3f5',BLD='#4a6b75';
const HC='#2b1d15',HL='#58402e',HD='#150d09';
const SK='#f1c08a',SKD='#d99e6a',SKL='#fff0d8';
const bronze={c:BZ,hi:BZL,lo:BZD,ol:BOL,form:1,sh:1},tun={c:TU,hi:TUL,lo:TUD,ol:'#25100a',form:1};
const fm={c:FM,hi:FML,lo:FMD,ol:FOL,form:1},ft={c:FT,hi:FTL,lo:FTD,ol:TOL,form:1};
const hair={c:HC,hi:HL,lo:HD,ol:'#0a0605'},skin={c:SK,hi:SKL,lo:SKD,ol:'#a8683a'},scarf={c:RS,hi:RSL,lo:RSD,ol:'#6a0f1c'};
const lf=(b,x0,y0,x1,y1,w,bend,pk,st,barb,bc1,bc2)=>{const L=leafPath(x0,y0,x1,y1,w,bend,pk,.8);b.path(L.d,st);const sp=L.spine;
 for(let i=1;i<sp.length-2;i++)b.ln(sp[i][0],sp[i][1],sp[i+1][0],sp[i+1][1],bc2,.45);
 if(barb)for(let i=4;i<sp.length-3;i+=3){const p=sp[i],q=i/(sp.length-1),hw=w/2*Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(q,Math.log(.5)/Math.log(pk)))),.8)*.9,tx=p[3],ty=-p[2];
  b.ln(p[0],p[1],p[0]+p[2]*hw+tx*hw*.8,p[1]+p[3]*hw+ty*hw*.8,bc1,.5);b.ln(p[0],p[1],p[0]-p[2]*hw+tx*hw*.8,p[1]-p[3]*hw+ty*hw*.8,bc2,.5)}return L};
function drum(b,cx,cy,r){b.ell(cx,cy,r,r,bronze);b.ell(cx,cy,r*.62,r*.62,{c:BZD,hi:BZ,lo:BOL,ol:BOL,bev:0});b.ell(cx,cy,r*.28,r*.28,{c:BZL,ol:0,bev:0});
 for(let i=0;i<8;i++){const a=i*Math.PI/4;b.ln(cx+Math.cos(a)*r*.34,cy+Math.sin(a)*r*.34,cx+Math.cos(a)*r*.6,cy+Math.sin(a)*r*.6,BZL,.35)}}
// mão lông vũ đỏ thẫm nhiều tầng, đỉnh cao
function crownFront(b,sw,sym){
 const feathers=[[-3.6,-1.5,2.2,1.6],[3.6,-1.5,2.2,-1.6],[-2.0,-5.2,2.6,.8],[2.0,-5.2,2.6,-.8],[0,-9.2,3.2,sw*.4]];
 for(const[dx,ty,w,bend]of feathers){const x1=10+dx*1.1+sw*.3;lf(b,10+dx*.35,7.3,x1,ty,w,bend,.4,fm,0,FML,FMD)}
 // tầng viền vàng trên mỗi lông
 for(const[dx,ty]of[[0,-9.2],[-2,-5.2],[2,-5.2]]){b.path('M'+(10+dx-.9)+' '+(ty+3.6)+' Q'+(10+dx)+' '+(ty+2.6)+' '+(10+dx+.9)+' '+(ty+3.6)+' L'+(10+dx+.9)+' '+(ty+4.3)+' Q'+(10+dx)+' '+(ty+3.4)+' '+(10+dx-.9)+' '+(ty+4.3)+'Z',{c:G,ol:GD,bev:0})}}
function sidesFront(b,sw,sw2){ // lông xanh ngọc dài hai bên (phía sau đầu)
 for(const m of[-1,1]){const k=m<0?sw:sw2;
  lf(b,10+m*3.6,7.6,10+m*8.4+k*.5,22,3.4,m*2.4,.4,ft,1,FTL,FTD);
  lf(b,10+m*3.2,7.8,10+m*8.6+k*.4,13.2,2.4,m*-.8,.4,ft,1,FTL,FTD)}}
function legs(b,x,v){
 b.use('legs');const{lg,sit,rd,S}=x,PT=S.pt||'#3a2a2a',SD=S.shoe||'#2a1a10';
 const leg=(lx,l,w)=>{w=w||3;b.path('M'+lx+' '+(24)+' L'+(lx+w)+' 24 L'+(lx+w)+' '+(27.4-l)+' L'+lx+' '+(27.4-l)+'Z',{c:PT,ol:'#150d09'});
  b.path('M'+(lx-.2)+' '+(26.6-l)+' L'+(lx+w+.2)+' '+(26.6-l)+' L'+(lx+w+.2)+' '+(28.4-l)+' L'+(lx-.2)+' '+(28.4-l)+'Z',bronze);
  b.path('M'+(lx-.3)+' '+(28.4-l)+' L'+(lx+w+.5)+' '+(28.4-l)+' Q'+(lx+w+.9)+' '+(30.4-l)+' '+(lx+w+.2)+' 30.4 L'+(lx-.5)+' 30.4 Q'+(lx-.7)+' '+(29.4-l)+' '+(lx-.3)+' '+(28.4-l)+'Z',{c:SD,ol:'#150d09'})};
 if(rd)return;
 if(v<2){if(sit){leg(6,0);leg(11,0)}else if(lg>0){leg(11,0);leg(6,1)}else if(lg<0){leg(6,0);leg(11,1)}else{leg(6,0);leg(11,0)}}
 else{const sx=lg*2,x1=8+sx,x2=10-sx;if(sit)leg(8,0);else if(lg>0){leg(x2,0);leg(x1,1)}else if(lg<0){leg(x1,0);leg(x2,1)}else{leg(x1,0);leg(x2,0)}}}
function armF(b,x,au,cx,dy,sword){const{noarm}=x;if(noarm)return;b.at(0,dy);
 if(au){const h=au,ty=17-h;b.path('M'+(cx-1.2)+' '+(ty+3)+' L'+(cx+1.2)+' '+(ty+3)+' L'+(cx+1.2)+' '+(ty+8)+' L'+(cx-1.2)+' '+(ty+8)+'Z',tun);b.ell(cx,ty+1.6,1.1,1.5,skin);b.path('M'+(cx-1.2)+' '+(ty+3.2)+' L'+(cx+1.2)+' '+(ty+3.2)+' L'+(cx+1.2)+' '+(ty+4.2)+' L'+(cx-1.2)+' '+(ty+4.2)+'Z',bronze)}
 else{b.path('M'+(cx-1.5)+' 17.8 L'+(cx+1.5)+' 17.8 L'+(cx+1.3)+' 21 L'+(cx-1.3)+' 21Z',tun);
  b.path('M'+(cx-1.15)+' 20.8 L'+(cx+1.15)+' 20.8 L'+(cx+1)+' 23.2 L'+(cx-1)+' 23.2Z',skin);
  b.path('M'+(cx-1.5)+' 20.8 L'+(cx+1.5)+' 20.8 L'+(cx+1.4)+' 22.3 L'+(cx-1.4)+' 22.3Z',bronze);b.ell(cx,23.9,1.1,1,skin)}
 b.at(0,0)}
AUL2.m.draw=function(b,v,x){
 const{lg,sw,sw2,noarm,sit,rd}=x,au=x.aup?x.aup.split(',').map(Number):null;
 legs(b,x,v);b.use('back');
 if(v==0){
  sidesFront(b,sw,sw2);
  b.path('M5.6 8 Q5 5 8 4.6 Q10 4.2 12 4.6 Q15 5 14.4 8 Q15 10 14.6 12 Q10 7.4 5.4 12 Q5 10 5.6 8Z',hair);
  // khăn đỏ + đuôi khăn
  b.path('M7.6 15.4 Q10 16.6 12.4 15.4 L12.8 17.2 Q10 18.4 7.2 17.2Z',scarf);
  b.path('M12 16.6 Q15 17.4 16.4 20.4 Q16.8 21.6 15.6 21.4 Q14.8 19.6 12.4 18.2Z',scarf);
  // váy giáp (tassets)
  for(let i=0;i<5;i++){const x0=6+i*1.6;b.path('M'+x0+' 21.6 L'+(x0+1.6)+' 21.6 L'+(x0+1.5+(i-2)*.12)+' 25.4 Q'+(x0+.8)+' 26 '+(x0+.1+(i-2)*.12)+' 25.4Z',tun)}
  b.path('M6.2 24.6 Q10 26.2 13.8 24.6 L13.8 25.6 Q10 27.2 6.2 25.6Z',bronze);
  // thân
  b.path('M6.8 16.2 Q10 15.6 13.2 16.2 L13.6 21.6 L6.4 21.6Z',tun);
  b.path('M7.4 16.6 Q10 16 12.6 16.6 L12.4 20.6 Q10 21.4 7.6 20.6Z',bronze);
  drum(b,10,18.7,1.7);
  b.path('M6.2 21 Q10 22.2 13.8 21 L13.8 22.6 Q10 23.8 6.2 22.6Z',{c:x.S.belt||'#7a4a20',ol:'#2a1608',form:1});
  b.path('M9 21.7 L11 21.7 L11 23 L9 23Z',bronze);
  // vai
  for(const m of[-1,1]){const cx=10+m*5.2;b.path('M'+cx+' 15.4 Q'+(cx+m*2.6)+' 15.6 '+(cx+m*2.8)+' 18 Q'+(cx+m*2.4)+' 19.6 '+(cx+m*.6)+' 19.4 Q'+(cx-m*1)+' 18 '+(cx-m*1.2)+' 16.4Z',bronze);b.ln(cx+m*.2,16.4,cx+m*1.8,18.4,BZD,.4)}
  armF(b,x,au&&au[0],3.8,lg);armF(b,x,au&&au[1],16.2,-lg);
  // kiếm cầm tay trái người xem
  if(!au&&!noarm){const ay=lg;b.at(0,ay);b.path('M2.1 23 L5.5 23 L5.5 24 L2.1 24Z',bronze);b.path('M3.1 24 L4.5 24 L4.5 25.2 L3.1 25.2Z',{c:'#5a3a1a',ol:'#2a1608'});
   b.path('M3 25.2 L4.6 25.2 L4.4 '+(rd?26.6:30.4)+' L3.8 '+(rd?27:31)+' L3.2 '+(rd?26.6:30.4)+'Z',{c:BL,hi:BLL,lo:BLD,ol:'#2a4048'});b.at(0,0)}
  b.use('front');
  // tóc rối hai bên mặt
  for(const m of[-1,1]){b.path('M'+(10+m*4.8)+' 8.8 Q'+(10+m*5.6)+' 9 '+(10+m*5.2)+' 11 Q'+(10+m*5.6)+' 13.2 '+(10+m*4.8)+' 14 Q'+(10+m*4.4)+' 12 '+(10+m*4.2)+' 10Z',hair);}
  b.path('M5.6 8.6 Q6.6 6.8 8.4 7.6 Q10 8.8 11.6 7.6 Q13.4 6.8 14.4 8.6 Q12.6 7.2 10 7.4 Q7.4 7.2 5.6 8.6Z',hair);
  crownFront(b,sw);
  // vành vàng + trống đồng
  b.path('M5.2 9 Q10 5.8 14.8 9 L14.6 10.3 Q10 7.4 5.4 10.3Z',{c:G,hi:GL,lo:GD,ol:'#7a4d0e',form:1,sh:1});
  drum(b,10,7.5,1.5);
  return true}
 if(v==1){
  sidesFront(b,sw,sw2);
  b.path('M5 8 Q4.6 4.8 8 4.4 Q10 4 12 4.4 Q15.4 4.8 15 8 Q15.4 11 14.6 13.6 Q10 15.6 5.4 13.6 Q4.6 11 5 8Z',hair);
  b.path('M9.6 15 L10.4 15 L10.4 20 L9.6 20Z',{c:RS,ol:0,bev:0});
  b.path('M6.8 16 Q10 15.4 13.2 16 L13.6 21.6 L6.4 21.6Z',tun);
  b.path('M7.4 16.4 Q10 15.8 12.6 16.4 L12.4 21 Q10 21.6 7.6 21Z',bronze);
  // vỏ kiếm chéo lưng
  b.path('M7 23 L13.4 16.4 L14.2 17.2 L7.8 23.8Z',{c:'#3a2620',hi:'#5a3a30',lo:'#1c100c',ol:'#0e0806'});b.path('M13.2 15.4 L15 13.6 L15.8 14.4 L14 16.2Z',bronze);
  for(let i=0;i<5;i++){const x0=6+i*1.6;b.path('M'+x0+' 21.6 L'+(x0+1.6)+' 21.6 L'+(x0+1.5)+' 25.4 Q'+(x0+.8)+' 26 '+(x0+.1)+' 25.4Z',tun)}
  b.path('M6.2 24.6 Q10 26.2 13.8 24.6 L13.8 25.6 Q10 27.2 6.2 25.6Z',bronze);
  b.path('M6.2 21 Q10 22.2 13.8 21 L13.8 22.6 Q10 23.8 6.2 22.6Z',{c:x.S.belt||'#7a4a20',ol:'#2a1608',form:1});
  for(const m of[-1,1]){const cx=10+m*5.2;b.path('M'+cx+' 15.4 Q'+(cx+m*2.6)+' 15.6 '+(cx+m*2.8)+' 18 Q'+(cx+m*2.4)+' 19.6 '+(cx+m*.6)+' 19.4 Q'+(cx-m*1)+' 18 '+(cx-m*1.2)+' 16.4Z',bronze)}
  armF(b,x,au&&au[0],3.8,lg);armF(b,x,au&&au[1],16.2,-lg);
  b.path('M12 16.4 Q14.4 17.6 14.8 20 Q14.8 21 14 20.6 Q13.6 19 11.6 18Z',scarf);
  b.use('front');
  crownFront(b,sw);
  b.path('M5.2 9 Q10 5.8 14.8 9 L14.6 10.3 Q10 7.4 5.4 10.3Z',{c:G,hi:GL,lo:GD,ol:'#7a4d0e',form:1,sh:1});
  return true}
 // ===== nhìn ngang (hướng phải) =====
 const sx=lg*2;
 lf(b,8,7.6,1.8+sw*.5,22,3.4,-2.4,.4,ft,1,FTL,FTD);lf(b,8.6,7.4,3+sw*.4,14,2.4,1.2,.4,ft,1,FTL,FTD);
 b.path('M11 5 Q7 4.6 5.8 8.4 Q5 12 6 15 Q8.4 14 9.6 12 Q10.4 9 10.4 7Z',hair);
 b.path('M8 15.8 Q5.6 16.6 4 19 Q3.4 20 4.4 19.8 Q6 18.8 8.6 17.8Z',scarf);
 for(let i=0;i<4;i++){const x0=7.8+i*1.4;b.path('M'+x0+' 21.6 L'+(x0+1.4)+' 21.6 L'+(x0+1.4)+' 25.4 Q'+(x0+.7)+' 26 '+x0+' 25.4Z',tun)}
 b.path('M7.6 24.6 Q10.4 26.2 13.4 24.6 L13.4 25.6 Q10.4 27.2 7.6 25.6Z',bronze);
 b.path('M8 16.2 Q10.2 15.6 12.4 16.2 L12.8 21.6 L7.8 21.6Z',tun);
 b.path('M8.4 16.5 Q10.4 16 12.2 16.6 L12 20.6 Q10.2 21.2 8.6 20.6Z',bronze);drum(b,11.4,18.7,1.2);
 b.path('M7.6 21 Q10.4 22.2 13 21 L13 22.6 Q10.4 23.8 7.6 22.6Z',{c:x.S.belt||'#7a4a20',ol:'#2a1608',form:1});
 b.path('M9.4 14.6 L11 14.6 L11 16.2 L9.4 16.2Z',skin);
 b.path('M8.2 15.6 Q10.2 14.8 12.4 16 Q12.8 17.8 11.4 19 Q9.2 19.2 8.2 17.6Z',bronze);
 if(!noarm){const cx=10-sx;
  if(au&&au[0]!=null){armF(b,x,au[0],cx,0)}
  else{armF(b,x,0,cx,0);
   // kiếm cầm chéo trước người
   b.path('M'+(cx+.4)+' 22 L'+(cx+2.2)+' 22 L'+(cx+2.2)+' 25 L'+(cx+.4)+' 25Z',bronze);
   b.path('M'+(cx+2.2)+' 22.6 L'+(cx+9.6)+' '+(rd?24.6:26.4)+' L'+(cx+9.4)+' '+(rd?25.8:27.6)+' L'+(cx+2.2)+' 24.2Z',{c:BL,hi:BLL,lo:BLD,ol:'#2a4048'})}}
 b.use('front');
 b.path('M5.8 12.6 Q5 6.4 9.4 4.8 Q13 4.2 14.2 7.4 Q14.4 8.6 13.8 9 Q11.6 7.8 9.8 9 Q8.4 9.8 8.3 12 Q8.2 14.2 7 15 Q5.8 14.6 5.8 12.6Z',hair);
 b.path('M7 12.6 Q7.2 15 8.4 15.6 Q9 14 8.6 12Z',hair);
 for(const[dx,ty,w,bend]of[[-3.4,-1.4,2.2,1.4],[-1.4,-5,2.6,.6],[1.2,-8.8,3.2,-sw*.4-.3]]){lf(b,10+dx*.3,7.2,10+dx+sw*.3,ty,w,bend,.4,fm,0,FML,FMD)}
 b.path('M6.6 10 Q8.4 6.6 13.9 6.4 L14.4 7.8 Q9.6 8.2 7.8 11Z',{c:G,hi:GL,lo:GD,ol:'#7a4d0e',form:1,sh:1});
 drum(b,13,7.5,1.2);
 return true};
})();
})();
