/* ===================================================================================
   HDFACE.JS — BIỂU CẢM HD (vẽ độ phân giải cao K=4) cho 6 biểu cảm đầu + mặt mặc định
   Thay faceDef (mặc định) và faceFx (biểu cảm 1..5) của index.html. Biểu cảm 6..9 (Bong bóng kẹo, Thổi tim,
   Buồn ngủ, Lém lỉnh) vẫn dùng bản cũ, làm HD sau.
   • Đặt SAU hdkit.js và sau tieuacma.js trong index.html (xem hướng dẫn). Nếu thiếu hdkit.js thì tự dùng bản cũ.
   • Mặt chỉ vẽ ĐÈ lên đúng chỗ mặt cũ (lưới 20x31, đầu x6..13 y8..14), thứ tự vẽ giữ nguyên => tóc/mũ vẫn đè lên mặt như trước.
   • Dựng 1 lần rồi lưu cache; mỗi khung chỉ drawImage 1 ảnh nhỏ 10x8 ô. Tim bay / lấp lánh vẫn vẽ pixel nhẹ như cũ.
   • Tắt nhanh nếu lỗi: đặt  window.HDFACE_OFF=1  (hoặc xóa thẻ script hdface.js) là về mặt cũ.
   =================================================================================== */
(function(){
if(typeof HD!='function'||typeof faceFx!='function'||typeof faceDef!='function')return;
const oldFx=faceFx,oldDef=faceDef;
const h=HD({K:4,MX:12,MY:12,WU:44,HU:52}),K=4;
const CX0=5,CY0=9,CW=10,CH=8;                       // vùng cắt (ô game): x5..15, y9..17
const EYE=['#1a100a','#2b1d12','#4a3020','#6b4a38'],HC=['#c01838','#ff3b5c','#ff8fa6'],HC2=['#a8123a','#ff6a8a','#ffb0c4'];
// ---------- 1) các bộ phận mặt ----------
function eyeBig(cx,cy,rx,ry){
 h.begin();h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>dy<-.45?EYE[0]:dy>.5?EYE[3]:dy>.1?EYE[2]:EYE[1]);h.end(0);
 h.begin();h.ell(cx-rx*.3,cy-ry*.35,rx*.38,ry*.3,'#ffffff');h.ell(cx+rx*.35,cy+ry*.4,rx*.17,ry*.14,'#dff0ff');h.end(0);
 h.begin();h.stroke(h.bez([cx-rx-.1,cy-ry*.15],[cx-rx*.5,cy-ry-.35],[cx+rx*.5,cy-ry-.35],[cx+rx+.1,cy-ry*.1]),.22,.16,()=>'#1a100a');h.end(0)}
function blush(cx,cy,rx,ry){h.begin();h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>Math.hypot(dx,dy)<.55?'#f0907f':'#f4a590');h.end(0)}
function smile(a,b,c,d,r0){h.begin();h.stroke(h.bez(a,b,c,d),r0||.2,r0?r0*.7:.14,()=>'#a8503f');h.end(0)}
function heart(cx,cy,s,col){
 h.begin();
 h.ell(cx-s*.5,cy-s*.2,s*.55,s*.55,(ux,uy,dx,dy)=>col[(dy<-.3&&dx<0)?2:1]);
 h.ell(cx+s*.5,cy-s*.2,s*.55,s*.55,()=>col[1]);
 h.poly([[cx-s*1.02,cy],[cx+s*1.02,cy],[cx,cy+s*1.15]],(ux)=>col[ux>cx+s*.3?0:1]);
 h.end(1,c=>[c[0]*.55|0,c[1]*.15|0,c[2]*.3|0]);
 h.begin();h.ell(cx-s*.62,cy-s*.42,s*.2,s*.14,'#ffe0ea');h.end(0)}
const star=(cx)=>{eyeBig(cx,12,1.05,1.3);h.begin();h.ell(cx-.4,11.5,.34,.4,'#ffffff');h.ell(cx+.4,12.6,.2,.22,'#ffffff');
 h.poly([[cx+.8,10.4],[cx+.95,10.9],[cx+1.45,11.05],[cx+.95,11.2],[cx+.8,11.7],[cx+.65,11.2],[cx+.15,11.05],[cx+.65,10.9]],'#fff3a8');h.end(0)};
const lens=(x,w)=>{h.begin();h.rrect(x,11.1,w,2.1,.8,(ux,uy)=>uy<11.7?'#26354f':uy<12.4?'#141c2c':'#0c1220');h.end(1,()=>[10,14,24]);
 h.begin();h.poly([[x+.4,11.4],[x+1.2,11.4],[x+.5,12.3],[x+.2,12.3]],'#8fbfff');h.rect(x+1.4,11.4,.35,.35,'#cfe6ff');h.end(0)};
const arc=(cx)=>{h.begin();h.stroke(h.bez([cx-1.1,12.5],[cx-.6,11],[cx+.6,11],[cx+1.1,12.5]),.34,.22,()=>'#2b1d12');h.end(0)};
const sadEye=(cx,sd)=>{eyeBig(cx,12.1,1.0,1.3);h.begin();h.ell(cx,13,.85,.35,'#8fd0ff');h.end(0);
 h.begin();h.stroke(h.bez([cx-1.1,11-.1*sd],[cx-.3,10.4+.1],[cx+.5,10.5],[cx+1.2,11.1+sd*.4]),.2,.12,()=>'#2b1d12');h.end(0)};
// ---------- 2) lắp từng biểu cảm (e=0 mặc định). Nhìn ngang luôn vẽ hướng PHẢI rồi lật ----------
function face(e,fr,st){
 if(e==0){
  if(fr){
   if(st.bl){[7.9,12.1].forEach(cx=>{h.begin();h.stroke(h.bez([cx-1,12.4],[cx-.4,12.8],[cx+.4,12.8],[cx+1,12.4]),.26,.2,()=>'#2b1d12');h.end(0)})}
   else{eyeBig(7.9,12,.95,1.2);eyeBig(12.1,12,.95,1.2)}
   blush(7.6,13.6,.75,.5);blush(12.4,13.6,.75,.5);smile([9,14.2],[9.5,14.7],[10.5,14.7],[11,14.2])}
  else{
   if(st.bl){h.begin();h.stroke(h.bez([11.3,12.4],[11.9,12.8],[12.7,12.8],[13.3,12.4]),.26,.2,()=>'#2b1d12');h.end(0)}else eyeBig(12.2,12,.95,1.2);
   blush(10,13.7,.7,.5);smile([12.3,13.7],[12.8,14.0],[13.4,13.9],[13.8,13.5])}}
 else if(e==1){
  if(fr){lens(6.3,3.2);lens(10.5,3.2);h.begin();h.rect(9.4,11.4,1.2,.45,'#0c1220');h.end(0);smile([9.2,14.5],[10,14.7],[10.9,14.3],[11.6,13.6],.22);blush(7.6,13.9,.6,.4);blush(12.4,13.9,.6,.4)}
  else{lens(11.2,2.5);smile([12.4,13.8],[12.9,14.0],[13.4,13.9],[13.8,13.5],.22)}}
 else if(e==2){
  const C=st.pc?HC2:HC;
  if(fr){heart(7.9,11.5,.95,C);heart(12.1,11.5,.95,C);blush(7.5,13.7,.85,.55);blush(12.5,13.7,.85,.55);
   h.begin();h.ell(10,14.4,.95,.65,(ux,uy,dx,dy)=>dy<0?'#c4566a':'#a8384f');h.end(0);h.begin();h.ell(9.7,14.15,.3,.14,'#ffc2cf');h.end(0)}
  else{heart(12.2,11.5,.95,C);blush(10,13.8,.8,.55);smile([12.3,13.7],[12.8,14.1],[13.4,14.0],[13.8,13.6],.24)}}
 else if(e==3){
  if(fr){star(7.9);star(12.1);blush(7.5,13.8,.7,.45);blush(12.5,13.8,.7,.45);
   h.begin();h.ell(10,14.0,1.1,.75,(ux,uy,dx,dy)=>dy<-.4?'#6b2230':'#8a3040');h.end(1,()=>[80,24,34]);
   h.begin();h.ell(10,14.4,.65,.36,'#ff8c9c');h.ell(9.8,14.3,.25,.14,'#ffc2cc');h.end(0);
   h.begin();h.ell(11.4,14.8+(st.ph?.4:0),.26,.38+(st.ph?.15:0),'#9bd8ff');h.end(0)}
  else{star(12.2);blush(10,13.8,.7,.45);h.begin();h.ell(12.9,13.7,.75,.55,'#8a3040');h.ell(13,14.0,.48,.3,'#ff8c9c');h.end(1,()=>[80,24,34]);h.begin();h.ell(13.5,14.4+(st.ph?.3:0),.22,.32,'#9bd8ff');h.end(0)}}
 else if(e==4){
  if(fr){sadEye(7.9,1);sadEye(12.1,-1);
   const dy=st.ph?.5:0;h.begin();h.ell(7.4,14+dy,.28,.5,'#9bd8ff');h.ell(12.6,14+dy,.28,.5,'#9bd8ff');h.ell(7.35,13.8+dy,.1,.18,'#ffffff');h.end(0);
   blush(7.5,13.7,.7,.42);blush(12.5,13.7,.7,.42);smile([9,14.9],[9.5,14.3],[10.5,14.3],[11,14.9],.2)}
  else{sadEye(12.2,-1);h.begin();h.ell(11.8,14.1+(st.ph?.5:0),.28,.5,'#9bd8ff');h.end(0);smile([12.4,14.0],[12.8,13.6],[13.3,13.6],[13.7,14.0],.2)}}
 else if(e==5){
  if(fr){arc(7.9);arc(12.1);blush(7.5,13.7,.8,.5);blush(12.5,13.7,.8,.5);
   h.begin();h.poly([[8.6,13.6],[11.4,13.6],[11,14.5],[10,14.95],[9,14.5]],(ux,uy)=>uy<14.2?'#ffffff':'#e8587a');h.ell(10,13.8,1.4,.22,'#ffffff');h.end(1,()=>[90,30,40]);
   h.begin();h.ell(10,14.6,.6,.3,'#ff8c9c');h.end(0)}
  else{arc(12.2);blush(10,13.8,.8,.5);h.begin();h.poly([[12.0,13.3],[13.5,13.3],[13.3,14.0],[12.8,14.35],[12.3,14.0]],(ux,uy)=>uy<13.8?'#ffffff':'#e8587a');h.end(1,()=>[90,30,40])}}
}
// ---------- 3) dựng + cache ----------
const CACHE={},cx0=(CX0+12)*K,cy0=(CY0+12)*K,cw=CW*K,ch=CH*K;
function crop(){const D=h.frame(),o=new Uint8ClampedArray(cw*ch*4);
 for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const s=((cy0+y)*h.W+cx0+x)*4,d=(y*cw+x)*4;o[d]=D[s];o[d+1]=D[s+1];o[d+2]=D[s+2];o[d+3]=D[s+3]}return o}
function raw(e,fr,Rt,st){h.newFrame();face(e,fr,st);let o=crop();
 if(!fr&&!Rt){const f=new Uint8ClampedArray(o.length);for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const s=(y*cw+x)*4,d=(y*cw+(cw-1-x))*4;for(let k=0;k<4;k++)f[d+k]=o[s+k]}o=f}
 return o}
function getImg(e,fr,Rt,st){const key=[e,fr?1:0,fr?0:Rt?1:0,st.bl|0,st.ph|0,st.pc|0].join('|');let c=CACHE[key];
 if(!c){const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;cv.getContext('2d').putImageData(new ImageData(raw(e,fr,Rt,st),cw,ch),0,0);c=CACHE[key]=cv}return c}
// ---------- 4) biết vẽ ở đâu: bắt toạ độ thật của u(0,0) qua fillRect ----------
let CTX=null;
const _dv=window.drawAv;
if(typeof _dv=='function')window.drawAv=function(g,ox,oy,o){const p=CTX;CTX=g;try{return _dv.apply(this,arguments)}finally{CTX=p}};
function origin(u,g){let X=null,Y=0;const own=Object.prototype.hasOwnProperty.call(g,'fillRect'),f=g.fillRect;
 g.fillRect=function(a,b){X=a;Y=b};try{u('#000000',0,0,0,0)}finally{if(own)g.fillRect=f;else delete g.fillRect}
 return X==null?null:[X,Y]}
function blit(u,e,fr,Rt,st){const g=CTX;if(!g||window.HDFACE_OFF)return false;
 const p=origin(u,g);if(!p)return false;
 const pm=g.imageSmoothingEnabled,pq=g.imageSmoothingQuality;let a=1;try{const m=g.getTransform();a=Math.hypot(m.a,m.b)}catch(x){}
 g.imageSmoothingEnabled=(a/K)<1.7;try{g.imageSmoothingQuality='high'}catch(x){}
 g.drawImage(getImg(e,fr,Rt,st),p[0]+CX0,p[1]+CY0,CW,CH);
 g.imageSmoothingEnabled=pm;try{g.imageSmoothingQuality=pq}catch(x){}
 return true}
const nowS=()=>performance.now()/1000;
// ---------- 5) thay faceDef / faceFx ----------
window.faceDef=function(u,side,Rt){
 const st={bl:(performance.now()%4300)<140};
 if(!blit(u,0,!side,Rt,st))oldDef(u,side,Rt)};
window.faceFx=function(u,e,side,Rt){
 if(e<1||e>5){oldFx(u,e,side,Rt);return}
 const t=nowS(),st={bl:0,ph:0,pc:Math.sin(t*5)>0?1:0};
 if(e==3)st.ph=Math.floor(((t*1.3)%1)*2);if(e==4)st.ph=Math.floor(((t*1.6)%1)*2);
 if(!blit(u,e,!side,Rt,st)){oldFx(u,e,side,Rt);return}
 // hiệu ứng nhẹ vẽ pixel như cũ: tim bay (iu iu), lấp lánh (vui vẻ) — chỉ nhìn trước
 if(!side&&e==2){const heart=(c,x,y)=>{u(c,x,y,1,1);u(c,x+2,y,1,1);u(c,x,y+1,3,1);u(c,x+1,y+2,1,1)};
  for(let k=0;k<2;k++){const p=((t*.45)+k*.5)%1,y=7-Math.round(p*7),x=k?15:1,a=(1-p).toFixed(2);heart('rgba(255,77,122,'+a+')',x+Math.round(Math.sin(t*3+k*3)),y)}}
 if(!side&&e==5){const tw=Math.sin(t*4)>0,Y='#fff3a8';if(tw){u(Y,16,6,1,1);u(Y,15,7,3,1);u(Y,16,8,1,1)}else{u(Y,2,9,1,1);u(Y,1,10,3,1);u(Y,2,11,1,1)}}
};
window.__HDF={raw,cw,ch,CX0,CY0};
})();
