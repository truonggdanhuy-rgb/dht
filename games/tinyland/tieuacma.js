/* ===================================================================================
   TIEUACMA.JS — 😈 MASCOT TIỂU ÁC MA (Nam / Nữ) — bán ở TIỆM CHÚ HỀ (circus.js → CL_ITEMS)
   • Giá: 2000 Xu + 1000 Xu quái vật + 5 Kim cương / set (cần ĐỦ CẢ 3 thứ). Sửa giá ở circus.js (pr:{xu,qv,dia}).
   • Nữ: tóc trắng muốt DÀI xõa tới hông, mái dài rẽ lệch, 2 lọn dài rủ trước vai.
     Nam: tóc trắng NGẮN phần trên (mái vuốt lệch + tóc dựng cong), hai bên thái dương màu NÂU.
     Cả hai: 2 SỪNG ĐỎ cong mượt, áo khoác đen thêu thánh giá trắng viền đỏ, găng hở ngón, giày thể thao đỏ trắng.
   • BIỂU CẢM CỐ ĐỊNH (lạnh lùng, mắt đỏ, mí rủ nửa) — KHÔNG đổi theo biểu cảm trong Túi.
   • Hiệu ứng: sừng CHỚP ĐỎ (nháy sáng + vệt điện chạy dọc sừng + tia sét đỏ tách ra ở mũi sừng + quầng đỏ nhịp thở).
   • VẼ ĐỘ PHÂN GIẢI CAO: mỗi "điểm ảnh game" được chia thành 4x4 điểm nhỏ (K=4) nên sừng/tóc cong mượt, vát đều,
     không còn kiểu tam giác thô. Hình được dựng 1 lần rồi lưu cache; mỗi khung chỉ vẽ lại lớp hiệu ứng.
     Khung vẽ rộng 44 x 52 ô (x -12..32, y -12..40) nên tóc/sừng/hào quang thoải mái vượt khung chuẩn 20x31.
   • Tự đẩy 2 set vào CUỐI mảng SETS khi nạp (đặt file này SAU pinkcool.js trong index.html) và đăng ký MASCOT_DRAW.ta.
   • Cần 1 dòng móc ở drawAv (index.html): xem hướng dẫn kèm theo.
   =================================================================================== */
(function(){
const K=4,MX=12,MY=12,WU=44,HU=52,W=WU*K,H=HU*K;
const sin=Math.sin,cos=Math.cos,PI=Math.PI,flr=Math.floor,rnd=Math.round,abs=Math.abs,min=Math.min,max=Math.max;

// ---------- 1) khai báo set ----------
if(typeof SETS!=='undefined'){
 const base={mascot:'ta',wide:1,ach:1,vt:1,sh:'#14101a',pt:'#14101a',rpt:'#14101a',shoe:'#d4202a',scarf:'#d4202a'};
 if(!SETS.some(s=>s.k=='tamm'))SETS.push(Object.assign({n:'Tiểu ác ma (Nam)',k:'tamm',ta:'m',ds:'Tóc trắng muốt ngắn phần trên, hai bên thái dương nâu, hai sừng đỏ chớp điện, áo khoác đen thánh giá trắng viền đỏ. Biểu cảm lạnh lùng mắt đỏ (cố định).'},base));
 if(!SETS.some(s=>s.k=='tamf'))SETS.push(Object.assign({n:'Tiểu ác ma (Nữ)',k:'tamf',ta:'f',ds:'Tóc trắng muốt dài xõa tới hông, hai sừng đỏ chớp điện, áo khoác đen thánh giá trắng viền đỏ. Biểu cảm lạnh lùng mắt đỏ (cố định).'},base));
}

// ---------- 2) bộ vẽ raster độ phân giải cao (thuần mảng, không cần DOM) ----------
const HX={};const rgb=h=>HX[h]||(HX[h]=[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]);
let cur=null,RAS=null;
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

// ---------- 3) bảng màu ----------
const HW=['#9ea3c6','#d2d6ea','#f2f3fc','#ffffff'],HWB=['#868bb0','#bcc1dc','#dcdff0','#f0f1fa'];     // tóc trắng (trước / sau)
const HB=['#4c3226','#6f4c3a','#8c6450','#a47c66'];                                                  // nâu thái dương
const HR=['#6a050e','#c3121e','#ee3a34','#ff9078'],HRF=['#4a0309','#8a0c16','#b8222a','#d84a48'];     // sừng đỏ / sừng xa (tối hơn)
const HHOT=['#ff5a4a','#ff8a70','#ffd0b0','#ffffff'];                                                // sừng lúc chớp
const SKB='#f6c6a2',SKS='#e3a47e',SKD='#c98660',SKL='#ffddc4';
const BKP=['#0b070e','#171020','#261a30','#3a2a48'],RD='#d2161f',RDL='#ff5a52',RDD='#7e0a12';
const skin=(ux,uy,dx,dy)=>dx>.55?SKS:dy<-.55?SKS:dx<-.5&&dy>.1?SKL:SKB;

// ---------- 4) các bộ phận ----------
function shoeLeg(x0,lift,side){      // chân + giày, x0 = mép trái chân
 begin();rect(x0,24,4,3.7-lift,(ux,uy)=>ux<x0+.9?BKP[2]:ux>x0+3.2?BKP[0]:BKP[1]);
 rect(side?x0+2.9:x0,24.4,.9,3,RD);end(2);
 begin();const y=27.3-lift;rrect(x0-.5,y,5.1,2.6,.9,(ux,uy)=>uy>y+1.9?'#f4f4fb':uy<y+.7?'#ef4a4c':ux<x0+1?'#ef4a4c':ux>x0+3.4?'#9a0f18':'#d4202a');
 rect(side?x0+2.6:x0-.1,y+.5,2,1.2,'#f6f6ff');for(let i=0;i<3;i++)rect(x0+.5+i*1.1,y+.15,.5,.6,'#ffffff');
 rect(x0-.5,y+2.1,5.1,.5,'#cfd0e2');end(2)}
function torsoF(back){
 begin();rrect(4.7,14.5,10.6,10,1.6,(ux,uy)=>ux<6?BKP[2]:ux>13.6?BKP[0]:BKP[1]);
 rect(4.7,23.5,10.6,1,RD);rect(4.7,23.5,10.6,.25,RDL);
 if(!back){rect(9.9,15.4,.25,8,BKP[0]);rect(9.1,17.1,1.8,.7,'#ffffff');rect(9.55,16.2,.7,2.6,'#ffffff');rect(9.55,17.1,.35,.7,'#dcdff0');
  poly([[7.2,14.4],[12.8,14.4],[11.6,16.3],[8.4,16.3]],RD);poly([[8,14.4],[12,14.4],[11.3,15.4],[8.7,15.4]],RDD);
  rect(6.2,19.6,.5,3.6,RD);rect(13.3,19.6,.5,3.6,RD);rect(6.2,19.6,.5,.4,RDL);rect(13.3,19.6,.5,.4,RDL)}
 else{rect(7.4,14.5,5.2,1.1,RD);rect(9.6,16,.8,6,RD);rect(8.4,18,3.2,.8,RD);rect(9.6,16,.8,.4,RDL)}
 end(2)}
function neck(){begin();rect(9,13.6,2,2,SKS);end(0)}
function armF(x,ay,left,hi){      // tay nhìn trước: x = mép trái, ay = nhún, hi = nhấc tay lên (aup)
 const top=hi!=null?17-hi:16+ay;
 begin();rrect(x,top,3.2,5.2,1.1,(ux)=>ux<x+.9?BKP[3]:ux>x+2.4?BKP[0]:BKP[1]);
 rect(x,top+4.2,3.2,.9,RD);rect(x,top+4.2,3.2,.25,RDL);rect(x+.5,top+5.0,.45,1.1,RD);rect(x+1.9,top+5.0,.45,.8,RD);rect(x+.7,top+1.2,.4,2.4,RDD);end(2);
 begin();rrect(x+.1,top+5.2,3,1.5,.6,BKP[1]);rect(x+.1,top+5.2,3,.3,RDD);ell(x+1.6,top+7.1,1.35,.95,SKB);rect(x+.4,top+6.6,.3,.7,SKD);rect(x+1.4,top+6.8,.3,.8,SKD);end(2)}
function armS(x,ay){
 begin();rrect(x,16+ay,3.2,5.2,1.1,(ux)=>ux<x+.9?BKP[3]:BKP[1]);rect(x,20.2+ay,3.2,.9,RD);rect(x+.4,21.0+ay,.45,1,RD);end(2);
 begin();rrect(x+.1,21.2+ay,3,1.5,.6,BKP[1]);rect(x+.1,21.2+ay,3,.3,RDD);ell(x+1.6,23.1+ay,1.35,.95,SKB);end(2)}
function torsoS(){begin();rrect(6.6,14.5,6.8,10,1.8,(ux)=>ux<7.6?BKP[2]:ux>12?BKP[0]:BKP[1]);rect(6.6,23.5,6.8,1,RD);rect(6.6,23.5,6.8,.25,RDL);
 rect(10.9,16.2,2.5,.7,'#ffffff');rect(11.7,15.4,.7,2.4,'#ffffff');poly([[8,14.4],[12.6,14.4],[12.6,15.8],[9,15.8]],RD);end(2)}

// ---------- 5) sừng ----------
const HORN=(side)=>{      // trả về các đường cong sừng theo góc nhìn
 if(side)return[{f:bez([8.6,5.6],[6.6,1.4],[7.6,-3.4],[11.6,-5.6]),r0:1.75,far:0},{f:bez([10.8,5.8],[9.2,1.8],[10.4,-2.8],[13.8,-4.6]),r0:1.45,far:1}];
 return[{f:bez([6.6,6.0],[3.6,2.6],[3.4,-2.4],[6.8,-5.4]),r0:1.85},{f:bez([13.4,6.0],[16.4,2.6],[16.6,-2.4],[13.2,-5.4]),r0:1.85}]};
function horns(side,hot,tips){
 HORN(side).forEach(h=>{const pal=hot?HHOT:h.far?HRF:HR;
  stroke(h.f,h.r0,.34,(ux,uy,t,cx,cy,r)=>{const c=shade(pal,-.7,-.55)(ux,uy,t,cx,cy,r);return(!hot&&(t*6)%1<.07&&t>.08&&t<.9)?pal[0]:c},.9);
  if(tips){const e=h.f(1);tips.push([e[0],e[1]])}});
}

// ---------- 6) mặt, tóc ----------
// mắt đỏ, mí trên rủ nửa (lạnh lùng). out = hướng ra phía ngoài mặt (-1 trái / +1 phải)
function eye(cx,cy,fem,out,front){
 const rx=fem?1.85:1.75,ry=fem?2.05:1.8,sl=fem?.12:.2,top=cy-(fem?.55:.45);
 const lid=ux=>top-sl*out*(ux-cx);
 begin();
 each(cx-rx,cy-ry,cx+rx,cy+ry,(px,py,ux,uy)=>{const dx=(ux-cx)/rx,dy=(uy-cy)/ry;if(dx*dx+dy*dy>1||uy<lid(ux))return;
  put(px,py,rgb(dy<-.55?'#5a050c':dy<-.1?'#a50d1a':dy<.4?'#e0222f':dy<.75?'#ff5a58':'#ff9a8c'))});
 each(cx-1,cy-1,cx+1,cy+1.6,(px,py,ux,uy)=>{const dx=(ux-cx)/.62,dy=(uy-(cy+.45))/1.15;if(dx*dx+dy*dy<=1&&uy>=lid(ux)+.15)put(px,py,rgb('#1d0207'))});
 each(cx-1.5,cy-1,cx+1.5,cy+1.6,(px,py,ux,uy)=>{const hx=cx+out*.2-out*.55,dx=ux-hx,dy=uy-(cy+.05);if(dx*dx+dy*dy<=.2&&uy>=lid(ux)+.1)put(px,py,rgb('#ffffff'));
  const qx=ux-(cx-out*.7),qy=uy-(cy+1.1);if(qx*qx+qy*qy<=.07)put(px,py,rgb('#ffd0d0'))});
 end(1,c=>[c[0]*.3+10|0,c[1]*.2+4|0,c[2]*.24+8|0]);
 begin();
 stroke(bez([cx-out*(rx+.05),lid(cx-out*(rx+.05))+.05],[cx-out*rx*.4,lid(cx-out*rx*.4)-.1],[cx+out*rx*.4,lid(cx+out*rx*.4)-.1],[cx+out*(rx+.05),lid(cx+out*(rx+.05))+.05]),.34,.3,()=>'#2a0f16');
 const ox=cx+out*(rx+.05),oy=lid(ox);
 stroke(bez([ox,oy],[ox+out*.5,oy-.1],[ox+out*.9,oy-.5],[ox+out*1.5,oy-(fem?1.3:.8)]),.32,.08,()=>'#2a0f16');
 if(fem)stroke(bez([ox-out*.5,oy+.05],[ox+out*.1,oy-.2],[ox+out*.5,oy-.4],[ox+out*1.0,oy-.55]),.2,.07,()=>'#2a0f16');
 end(0)}
function browMouth(cx0,fem,side){
 begin();
 if(!side){[[4.8,8.1,8.7,9.1],[15.2,8.1,11.3,9.1]].forEach(b=>stroke(bez([b[0],b[1]],[b[0]+(b[2]-b[0])*.35,b[1]-.25],[b[0]+(b[2]-b[0])*.7,b[1]+.1],[b[2],b[3]]),fem?.26:.36,.16,()=>fem?'#9ea2c6':'#80859f'));
  stroke(bez([9.1,13.3],[9.6,13.45],[10.4,13.45],[10.9,13.3]),.2,.2,()=>'#9a4c44');ell(10,12.3,.32,.2,'#d98d68')}
 else{stroke(bez([10.6,8.2],[11.6,8.1],[13.2,8.5],[14.7,9.3]),fem?.26:.36,.16,()=>fem?'#9ea2c6':'#80859f');
  stroke(bez([14.0,13.3],[14.5,13.4],[15,13.4],[15.5,13.2]),.2,.2,()=>'#9a4c44')}
 end(0)}
function headF(fem){
 begin();ell(3.2,10.8,.95,1.3,SKS);ell(16.8,10.8,.95,1.3,SKS);
 ell(10,9.8,6.9,5.2,skin);ell(10,12.0,5.7,3.1,(ux,uy,dx,dy)=>dx>.5?SKS:uy>13.8?SKS:SKB);end(2);
 eye(6.8,10.9,fem,-1,1);eye(13.2,10.9,fem,1,1);browMouth(10,fem,0)}
function headS(fem){
 begin();ell(9.4,9.9,6.1,5.1,(ux,uy,dx,dy)=>dx<-.45?SKS:SKB);ell(11.4,12.1,4.8,2.9,(ux,uy,dx,dy)=>uy>13.6?SKS:SKB);ell(15.5,11.4,.8,.75,SKB);
 ell(8.2,10.9,.95,1.4,SKS);end(2);
 eye(12.7,10.9,fem,-1,0);browMouth(10,fem,1)}
function headB(){begin();ell(10,9.9,6.8,5.4,(ux,uy,dx)=>HWB[dx>.5||dx<-.5?1:2]);end(2)}

const lock=(a,b,c,d,r0,r1,pal,pw)=>stroke(bez(a,b,c,d),r0,r1,shade(pal),pw||1);
const lockM=(a,b,c,d,r0,r1,pal,pw)=>{lock(a,b,c,d,r0,r1,pal,pw);lock(mirP(a),mirP(b),mirP(c),mirP(d),r0,r1,pal,pw)};
const cap=(cx,cy,rx,ry,pal)=>ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>pal[dy<-.5?3:dy<.1?2:dy<.6?1:0]);

function backHairFem(view){      // tóc nữ dài phía sau (nhìn trước: nằm sau thân; nhìn sau: phủ lên thân)
 begin();
 if(view=='s'){
  lock([9,5],[3.2,6],[-.4,13],[1.4,28.6],3.0,.7,HWB);lock([8.6,5.4],[4.2,8],[2.4,15],[4.6,27.6],2.6,.7,HWB);lock([9.6,5],[6,9],[6.6,16],[8.4,25.6],2.2,.6,HWB);
  lock([7.4,6],[1.2,9],[-1.2,16],[-.4,26],1.6,.4,HW);lock([8,6.5],[3,11],[1.6,19],[2.6,28.2],1.7,.4,HW);
 }else{
  poly([[3.6,8],[16.4,8],[18.2,27],[1.8,27]],HWB[1]);ell(10,9.4,8.1,5.9,HWB[1]);
  lockM([4.6,6],[-1,9],[-2.8,18],[-.6,29],3.0,.6,HWB);lockM([5.6,6.5],[1.2,11],[.6,20],[2.6,28.6],2.6,.6,HW);
  lockM([3.6,8],[-2.6,13],[-4.4,20],[-2.6,27.4],2.0,.4,HW);lockM([6.4,8],[3.2,14],[3,21],[4.6,28.2],1.9,.5,HWB);
  if(view=='b'){lockM([8,6],[6.2,11],[5.8,19],[6.6,28.6],2.3,.5,HW);lockM([10,6],[9.4,12],[9.6,20],[10.4,28.6],2.1,.5,HWB);lock([10,6],[10.8,12],[10.6,20],[10.2,29],1.9,.4,HW)}
 }
 end(2)}
function frontHairFem(view){
 begin();
 if(view=='f'){
  cap(10,6.1,7.6,3.5,HW);
  lock([10.6,3.9],[8,5.2],[6,7.4],[4.2,10.8],2.0,.5,HW);lock([12.4,4.0],[14.8,5.6],[15.9,8],[16,11.8],2.0,.5,HW);
  lock([9.2,3.9],[8.4,5.8],[7.6,7.4],[6.8,9],1.5,.4,HW);lock([11.6,4.0],[13,5.8],[13.4,7.4],[13,9],1.4,.4,HW);
  lock([10.8,3.9],[11.2,5.4],[10.8,7],[9.9,8.6],1.4,.4,HW);
 }else if(view=='s'){
  cap(9.2,6.1,6.8,3.5,HW);lock([9.6,4],[12,4.4],[14.4,5.8],[15.2,8.8],2.0,.5,HW);lock([8.4,4.2],[11,5.2],[12.6,6.8],[13,9.2],1.6,.4,HW);
 }else{cap(10,6.3,7.4,3.4,HW);lockM([6,4.8],[3,7],[2.8,10],[3.6,13.4],1.8,.5,HW)}
 end(2)}
function sideLocksFem(){begin();lockM([3.8,9],[1.4,13.4],[1.2,20],[3.2,27],1.9,.45,HW);end(2)}
function sideLockS(){begin();lock([8.4,6],[7,9.6],[6.4,15],[6.4,23.4],1.8,.5,HW);end(2)}
function hairMale(view){
 if(view=='f'){
  begin();ell(4.2,10.6,1.0,2.1,(ux,uy,dx,dy)=>HB[dx<-.2?2:dx>.4?0:1]);ell(15.8,10.6,1.0,2.1,(ux,uy,dx,dy)=>HB[dx>.2?2:dx<-.4?0:1]);end(1,olSoft);
  return 1}
 if(view=='s'){begin();ell(7.4,9.7,1.15,1.9,(ux,uy,dx,dy)=>HB[dy<-.3?2:dx<-.3?0:1]);end(1,olSoft);return 1}
 begin();ell(4.2,11.2,1.3,2.3,(ux,uy,dx)=>HB[dx<0?1:0]);ell(15.8,11.2,1.3,2.3,(ux,uy,dx)=>HB[dx>0?1:0]);end(1,olSoft)}
function topHairMale(view){
 begin();
 if(view=='s'){
  cap(9.2,6.1,6.7,3.5,HW);
  lock([6.6,5.2],[3.8,3.6],[2.2,5.6],[2.4,9],1.6,.5,HW);lock([8,4.6],[6.6,2],[8.6,-.4],[11.8,.2],1.7,.4,HW);
  lock([10,4.5],[11.6,2],[13.8,1.4],[15.4,3.2],1.6,.4,HW);lock([9.6,4.1],[12,4.6],[13.6,6.2],[14.2,8.6],1.6,.4,HW);
 }else if(view=='b'){
  cap(10,6.5,7.4,3.6,HW);lockM([7,4.8],[4.4,3.4],[3,5.6],[3.4,8.6],1.6,.5,HW);lock([10,4.6],[9.2,2.2],[10.6,.2],[13.4,.8],1.8,.4,HW);lock([8.6,4.6],[7.2,2],[6,.6],[4.2,1.2],1.5,.4,HW);
 }else{
  cap(10,5.7,7.6,4.0,HW);
  lock([8.2,5.2],[6.2,2.4],[7,-.8],[10.2,-1.6],2.2,.4,HW);lock([10.8,5],[10.4,2.2],[12.2,.2],[15,.2],2.1,.4,HW);
  lock([12.2,5.2],[14.2,3.4],[15.8,3],[17,4.2],1.8,.4,HW);lock([7.8,5.4],[5.8,3.8],[4,3.8],[2.8,5.2],1.8,.4,HW);
  lock([9,4.6],[8.8,2.4],[9.6,.6],[11.4,.2],1.6,.4,HWB);
  lock([6.8,4.8],[4.4,5.4],[3.6,7],[3.8,9.4],1.6,.45,HW);lock([13.4,4.8],[15.8,5.4],[16.6,7],[16.2,9.4],1.6,.45,HW);
  lock([10,4],[9,5.6],[8,6.8],[6.8,8.2],1.7,.4,HW);lock([11.8,4.1],[12,5.6],[12.6,6.8],[13.8,8.3],1.6,.4,HW);lock([9.6,4],[10.6,5.6],[10.8,7],[10,8.2],1.4,.4,HW);
 }
 end(2)}

// ---------- 7) lắp ráp 1 khung ----------
function build(st){
 const fem=st.fem,view=st.view,side=view=='s',back=view=='b',lg=st.lg,sit=st.sit;
 RAS={d:new Uint8ClampedArray(W*H*4)};const tips=[];
 const leg=(x,l)=>shoeLeg(x,l,side);
 const legs=()=>{if(st.rd)return;if(sit){leg(5,0);leg(11,0)}
  else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
  else{const s=lg*2;leg(8-s-.5,lg>0?1:0);leg(8+s-.5,lg<0?1:0)}};
 if(fem&&(view!='b'))backHairFem(view);
 if(side){legs();torsoS();if(!st.noarm)armS(8.4-lg,lg)}
 else{legs();torsoF(back);armF(1.9,lg,1,st.aupL);armF(15.9,-lg,0,st.aupR)}
 if(!back){neck();if(side)headS(fem);else headF(fem)}
 else if(!fem)headB();
 if(fem&&back)backHairFem('b');
 if(!fem)hairMale(view);
 if(!fem)topHairMale(view);else frontHairFem(view);
 begin();horns(side,false,tips);end(2);
 if(!fem&&!back){/* tóc mái nam đè gốc sừng */}
 if(fem&&view=='f')sideLocksFem();
 if(fem&&side)sideLockS();
 // lớp chớp: chỉ sừng, đổi màu sáng; cắt bỏ phần bị tóc che
 const base=RAS;RAS={d:new Uint8ClampedArray(W*H*4)};begin();horns(side,true,null);end(0);const hot=RAS;RAS=base;
 for(let i=0;i<W*H;i++){const o=i*4;if(hot.d[o+3]){const r=base.d[o],g=base.d[o+1],b=base.d[o+2];if(!(r>110&&g<120&&b<120&&r>g*1.7))hot.d[o+3]=0}}
 const out={base:base.d,hot:hot.d,tips:tips.map(p=>[(p[0]+MX)*K,(p[1]+MY)*K])};
 // nhìn sang trái = lật gương ảnh nhìn sang phải
 if(st.flip){[out.base,out.hot].forEach(D=>{for(let y=0;y<H;y++)for(let x=0;x<W>>1;x++){const a=(y*W+x)*4,b=(y*W+(W-1-x))*4;for(let k=0;k<4;k++){const t=D[a+k];D[a+k]=D[b+k];D[b+k]=t}}});
  out.tips=out.tips.map(p=>[W-p[0],p[1]])}
 return out}

// ---------- 8) vẽ lên canvas game (cache + hiệu ứng chớp đỏ) ----------
const CACHE={};let SCR=null,SX=null;
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
function toCanvas(D){const c=mkc(W,H),x=c.getContext('2d');x.putImageData(new ImageData(new Uint8ClampedArray(D),W,H),0,0);return c}
function getFrame(st){const key=[st.fem?1:0,st.view,st.flip?1:0,st.lg,st.sit?1:0,st.rd?1:0,st.noarm?1:0,st.aupL,st.aupR].join('|');
 let f=CACHE[key];if(!f){const o=build(st);f={base:toCanvas(o.base),hot:toCanvas(o.hot),tips:o.tips};CACHE[key]=f}return f}
const flashAt=t=>{const p=t%2.6;return(p<.14?1-p/.14:0)+(p>.26&&p<.38?.8*(1-(p-.26)/.12):0)};
function bolt(x,ctx,sd,x0,y0,ang,len,seg,w){
 let px=x0,py=y0;ctx.fillStyle='#ff2a2a';
 const pts=[[px,py]];for(let i=0;i<seg;i++){const a=ang+((sd=(sd*9301+49297)%233280)/233280-.5)*1.7;px+=cos(a)*len/seg;py+=sin(a)*len/seg;pts.push([px,py])}
 [[w,'#ff2a2a'],[w*.45,'#ffe0d0']].forEach(([ww,col])=>{ctx.fillStyle=col;for(let i=0;i<seg;i++){const a=pts[i],b=pts[i+1],n=max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])));
  for(let j=0;j<=n;j++){const q=j/n;ctx.fillRect(Math.round(a[0]+(b[0]-a[0])*q-ww/2),Math.round(a[1]+(b[1]-a[1])*q-ww/2),max(1,Math.round(ww)),max(1,Math.round(ww)))}}});
 return sd}
function drawTAM(g,ox,oy,r,u,o,S,k){
 const fem=S.ta=='f',{side,Rt,back,sit,rd,lg}=k,t=performance.now()/1000;
 const st={fem,view:side?'s':back?'b':'f',flip:side&&!Rt,lg:lg>0?1:lg<0?-1:0,sit:!!sit,rd:!!rd,noarm:!!(o.noarm&&side),aupL:o.aup&&o.aup[0]!=null?o.aup[0]:null,aupR:o.aup&&o.aup[1]!=null?o.aup[1]:null};
 if(!st.noarm){}
 if(!sit&&!rd&&!o.nosh&&typeof E=='function')E(r,'rgba(0,0,0,.22)',10,30,9,2);
 const f=getFrame(st);
 if(!SCR){SCR=mkc(W,H);SX=SCR.getContext('2d')}
 const x=SX;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);
 // quầng đỏ nhịp thở quanh sừng
 const fl=flashAt(t),br=.16+.07*sin(t*3.1)+.38*fl;
 f.tips.forEach(p=>{const cx=p[0],cy=p[1]+4*K,R=11*K,gr=x.createRadialGradient(cx,cy,0,cx,cy,R);gr.addColorStop(0,'rgba(255,40,40,'+min(.75,br*1.6).toFixed(2)+')');gr.addColorStop(1,'rgba(255,40,40,0)');x.fillStyle=gr;x.fillRect(cx-R,cy-R,R*2,R*2)});
 x.drawImage(f.base,0,0);
 // chớp toàn sừng
 if(fl>.02){x.globalAlpha=min(1,fl);x.drawImage(f.hot,0,0);x.globalAlpha=1}
 // vệt điện chạy dọc sừng (từ gốc lên mũi)
 const ph=((t*.9)%1.5);if(ph<1){const ty=f.tips.length?f.tips[0][1]:0,by=ty+11*K,yy=by+(ty-by)*ph;x.save();x.beginPath();x.rect(0,yy-1.6*K,W,3.2*K);x.clip();x.globalAlpha=.85;x.drawImage(f.hot,0,0);x.restore();x.globalAlpha=1}
 // tia sét đỏ tách ra từ mũi sừng
 const sd0=flr(t*13);
 if(fl>.05||sd0%3==0){f.tips.forEach((p,i)=>{let sd=(sd0*131+i*977)%233280;const n=fl>.3?3:1;for(let j=0;j<n;j++){const ang=-PI/2+((sd=(sd*9301+49297)%233280)/233280-.5)*2.6;sd=bolt(0,x,sd,p[0],p[1],ang,(3+(sd%5))*K*.9,4,K*.55)}})}
 // vẽ xuống canvas game
 const pm=g.imageSmoothingEnabled,pq=g.imageSmoothingQuality;let a=1;try{const m=g.getTransform();a=Math.hypot(m.a,m.b)}catch(e){}
 g.imageSmoothingEnabled=(a/K)<1.7;try{g.imageSmoothingQuality='high'}catch(e){}
 g.drawImage(SCR,ox-MX,oy-MY,WU,HU);
 g.imageSmoothingEnabled=pm;try{g.imageSmoothingQuality=pq}catch(e){}
}
window.drawTieuAcMa=drawTAM;window.__TAM={build,W,H,K,MX,MY};
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.ta=function(){};   // việc vẽ do móc ở drawAv (index.html) gọi drawTieuAcMa
})();
