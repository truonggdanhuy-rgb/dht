/* ===================================================================================
   HDKIT.JS — BỘ MÁY VẼ "ĐỒ HỌA CAO" (K=4) cho set / mascot của tinyland
   Tách từ tieuacma.js (Tiểu ác ma). Mỗi "điểm ảnh game" chia 4x4 điểm nhỏ => sừng, tóc, mũ cong mượt,
   có tô bóng khối + viền tự động, KHÔNG còn kiểu pixel thô / tam giác thô.
   Dùng:  const h = HD({K:4,MX:12,MY:12,WU:44,HU:52});   // khung 44x52 ô, gốc lệch (12,12) => vẽ thoải mái vượt khung 20x31
          h.newFrame(); h.begin(); ...vẽ... h.end(2); ...   // mỗi bộ phận: begin -> vẽ -> end(độ dày viền)
          h.frame()  -> mảng RGBA (W*H*4)   |  h.toCanvas(h.frame()) -> canvas để drawImage
   =================================================================================== */
(function(root){
root.HD=function(opt){
opt=opt||{};
const K=opt.K||4,MX=opt.MX!=null?opt.MX:12,MY=opt.MY!=null?opt.MY:12,WU=opt.WU||44,HU=opt.HU||52,W=WU*K,H=HU*K;
const sin=Math.sin,cos=Math.cos,PI=Math.PI,flr=Math.floor,rnd=Math.round,abs=Math.abs,min=Math.min,max=Math.max;
let cur=null,RAS=null;
const HX={};const rgb=h=>{if(!h)h='#000000';return HX[h]||(HX[h]=[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)])};
const newLayer=()=>({d:new Uint8ClampedArray(W*H*4),m:new Uint8Array(W*H),x0:W,y0:H,x1:0,y1:0});
const put=(px,py,c)=>{if(px<0||py<0||px>=W||py>=H)return;const i=py*W+px,o=i*4;cur.m[i]=1;cur.d[o]=c[0];cur.d[o+1]=c[1];cur.d[o+2]=c[2];cur.d[o+3]=255;
 if(px<cur.x0)cur.x0=px;if(px>cur.x1)cur.x1=px;if(py<cur.y0)cur.y0=py;if(py>cur.y1)cur.y1=py};
const each=(ax,ay,bx,by,fn)=>{const x0=max(0,flr((ax+MX)*K)),x1=min(W-1,Math.ceil((bx+MX)*K)),y0=max(0,flr((ay+MY)*K)),y1=min(H-1,Math.ceil((by+MY)*K));
 for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++)fn(px,py,(px+.5)/K-MX,(py+.5)/K-MY)};
const cc=(c,a,b,d)=>typeof c=='function'?rgb(c(a,b,d)):rgb(c);
const ell=(cx,cy,rx,ry,col)=>each(cx-rx,cy-ry,cx+rx,cy+ry,(px,py,ux,uy)=>{const dx=(ux-cx)/rx,dy=(uy-cy)/ry;if(dx*dx+dy*dy<=1)put(px,py,typeof col=='function'?rgb(col(ux,uy,dx,dy)):rgb(col))});
const rect=(x,y,w,h,col)=>each(x,y,x+w,y+h,(px,py,ux,uy)=>{if(ux>=x&&ux<x+w&&uy>=y&&uy<y+h)put(px,py,typeof col=='function'?rgb(col(ux,uy)):rgb(col))});
const rrect=(x,y,w,h,r,col)=>each(x,y,x+w,y+h,(px,py,ux,uy)=>{if(ux<x||ux>=x+w||uy<y||uy>=y+h)return;
 const qx=ux<x+r?x+r-ux:ux>x+w-r?ux-(x+w-r):0,qy=uy<y+r?y+r-uy:uy>y+h-r?uy-(y+h-r):0;if(qx*qx+qy*qy>r*r)return;put(px,py,typeof col=='function'?rgb(col(ux,uy)):rgb(col))});
const poly=(P,col)=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;P.forEach(p=>{a=min(a,p[0]);c=max(c,p[0]);b=min(b,p[1]);d=max(d,p[1])});
 each(a,b,c,d,(px,py,ux,uy)=>{let ins=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const xi=P[i][0],yi=P[i][1],xj=P[j][0],yj=P[j][1];
  if((yi>uy)!=(yj>uy)&&ux<(xj-xi)*(uy-yi)/(yj-yi)+xi)ins=!ins}if(ins)put(px,py,typeof col=='function'?rgb(col(ux,uy)):rgb(col))})};
const bez=(p0,p1,p2,p3)=>t=>{const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;return[a*p0[0]+b*p1[0]+c*p2[0]+d*p3[0],a*p0[1]+b*p1[1]+c*p2[1]+d*p3[1]]};
// nét cong có độ dày thay đổi: đóng dấu đĩa dọc theo đường cong (col(ux,uy,t,cx,cy,r))
const stroke=(fn,r0,r1,col,pw)=>{let L=0,q=fn(0);for(let i=1;i<=20;i++){const p=fn(i/20);L+=Math.hypot(p[0]-q[0],p[1]-q[1]);q=p}
 const n=max(6,Math.ceil(L*11));for(let i=0;i<=n;i++){const t=i/n,p=fn(t),r=r0+(r1-r0)*Math.pow(t,pw||1);
  each(p[0]-r,p[1]-r,p[0]+r,p[1]+r,(px,py,ux,uy)=>{const dx=ux-p[0],dy=uy-p[1];if(dx*dx+dy*dy<=r*r)put(px,py,rgb(col(ux,uy,t,p[0],p[1],r)))})}};
// tô bóng khối trụ: pal = [tối, vừa, sáng, rất sáng]; ánh sáng từ trên-trái
const shade=(pal,lx,ly)=>{lx=lx==null?-.55:lx;ly=ly==null?-.8:ly;return(ux,uy,t,cx,cy,r)=>{const d=((ux-cx)*lx+(uy-cy)*ly)/r;return pal[d>.58?3:d>.02?2:d>-.5?1:0]}};
const mirP=p=>[20-p[0],p[1]];
const mirB=(a,b,c,d)=>bez(mirP(a),mirP(b),mirP(c),mirP(d));

function begin(){cur=newLayer()}
// kết thúc lớp: viền (T điểm nhỏ) rồi dán lớp lên khung; olc: hàm đổi màu viền hoặc null = không viền
const OFF={};const offs=T=>OFF[T]||(OFF[T]=(()=>{const a=[];for(let dy=-T;dy<=T;dy++)for(let dx=-T;dx<=T;dx++)if((dx||dy)&&dx*dx+dy*dy<=T*T+.5)a.push([dx,dy]);return a})());
const olDark=c=>[c[0]*.36+12|0,c[1]*.30+6|0,c[2]*.34+14|0];
const olSoft=c=>[c[0]*.62+20|0,c[1]*.58+14|0,c[2]*.66+26|0];
function end(T,olc){const L=cur,D=RAS.d;cur=null;if(T&&L.x1>=L.x0){const O=offs(T),ol=olc||olDark;
  for(let py=max(0,L.y0-T);py<=min(H-1,L.y1+T);py++)for(let px=max(0,L.x0-T);px<=min(W-1,L.x1+T);px++){const i=py*W+px;if(L.m[i])continue;
   for(let k=0;k<O.length;k++){const x=px+O[k][0],y=py+O[k][1];if(x<0||y<0||x>=W||y>=H)continue;const j=y*W+x;if(L.m[j]){const c=ol([L.d[j*4],L.d[j*4+1],L.d[j*4+2]]),o=i*4;D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;break}}}}
 for(let py=L.y0;py<=L.y1;py++)for(let px=L.x0;px<=L.x1;px++){const i=py*W+px;if(L.m[i]){const o=i*4;D[o]=L.d[o];D[o+1]=L.d[o+1];D[o+2]=L.d[o+2];D[o+3]=255}}}


const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
function toCanvas(D){const c=mkc(W,H),x=c.getContext('2d');x.putImageData(new ImageData(new Uint8ClampedArray(D),W,H),0,0);return c}
return {K,MX,MY,WU,HU,W,H,rgb,ell,rect,rrect,poly,bez,stroke,shade,mirP,mirB,begin,end,olDark,olSoft,toCanvas,
 newFrame(){RAS={d:new Uint8ClampedArray(W*H*4)};return RAS},frame(){return RAS.d},
 // vẽ canvas đã dựng xuống canvas game: ox,oy = vị trí ô (0,0) của nhân vật
 drawTo(g,cv,ox,oy){const pm=g.imageSmoothingEnabled;let a=1;try{const m=g.getTransform();a=Math.hypot(m.a,m.b)}catch(e){}
  g.imageSmoothingEnabled=(a/K)<1.7;try{g.imageSmoothingQuality='high'}catch(e){}g.drawImage(cv,ox-MX,oy-MY,WU,HU);g.imageSmoothingEnabled=pm}};
};
})(typeof window!=='undefined'?window:globalThis);
