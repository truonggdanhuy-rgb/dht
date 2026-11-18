/* ===================================================================================
   HDFACE.JS — BIỂU CẢM HD (vẽ độ phân giải cao K=4) cho mặt mặc định + biểu cảm 1..7 và 9
   Thay faceDef (mặc định) và faceFx của index.html. Đã HD: Ngầu, Iu iu, Đói bụng, Sad, Vui vẻ, Bong bóng kẹo (6),
   Thổi tim (7), Lém lỉnh (9). Riêng Buồn ngủ (8) vẫn dùng bản cũ, làm HD sau.
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

// ---------- 1b) bộ phận mới cho Iu iu / Bong bóng kẹo / Thổi tim / Lém lỉnh ----------
const SKL='#2b1d12',dkOut=c=>[c[0]*.5|0,c[1]*.15|0,c[2]*.25|0],pts=(f,n)=>{const a=[];for(let i=0;i<=n;i++)a.push(f(i/n));return a};
// miệng há hốc cute: trong miệng tối, lưỡi hồng ở đáy, răng cửa trắng, điểm sáng
function openMouth(cx,cy,rx,ry){
 h.begin();h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>dy>.18?(dx<-.25&&dy<.65?'#ffa3b1':'#ff8c9c'):dy<-.55?'#5e1727':'#7e2336');h.end(1,dkOut);
 h.begin();h.ell(cx-rx*.38,cy+ry*.55,rx*.2,ry*.1,'#ffd6de');h.rrect(cx-rx*.5,cy-ry*.82,rx,ry*.26,ry*.1,'#ffffff');h.end(0)}
// mắt nhắm cong ‿ (có/không mi), dir = hướng ra phía ngoài mặt (-1 trái, +1 phải)
function closedEye(cx,cy,w,dir,lash){
 h.begin();h.stroke(h.bez([cx-w,cy-.2],[cx-w*.55,cy+.55],[cx+w*.55,cy+.55],[cx+w,cy-.2]),.17,.17,()=>EYE[1]);h.end(0);
 if(lash){const ox=cx+dir*w;h.begin();h.stroke(h.bez([ox,cy-.15],[ox+dir*.15,cy-.3],[ox+dir*.3,cy-.42],[ox+dir*.5,cy-.5]),.12,.06,()=>EYE[0]);h.end(0)}}
// môi chu thổi: vòng môi hồng bóng nhô ra + lỗ "o" nhỏ ở giữa (s=0 nhỏ, 1 to)
function pucker(cx,cy,rx,ry,s){
 h.begin();h.ell(cx,cy,rx+.08*s,ry+.1*s,(ux,uy,dx,dy)=>dy<-.4&&dx<.2?'#ff9db1':dy>.45?'#d0506a':'#ee6f89');h.end(1,c=>[c[0]*.55|0,c[1]*.18|0,c[2]*.28|0]);
 h.begin();h.ell(cx+.02,cy+.06,rx*.3+.08*s,ry*.42+.1*s,(ux,uy,dx,dy)=>dy<0?'#5e1727':'#8a2840');h.end(0);
 h.begin();h.ell(cx-rx*.45,cy-ry*.55,rx*.22,ry*.13,'#ffe2e9');h.end(0)}
// miệng cười toe lém lỉnh + lưỡi thè (front: to; side: nhỏ)
function cheekyMouth(fr,ph){
 const D=(cx,cy,rx,ry)=>{const a=[];for(let i=0;i<=14;i++){const th=Math.PI*i/14;a.push([cx+Math.cos(th)*rx,cy+Math.sin(th)*ry])}a.push([cx-rx,cy-.12],[cx,cy-.2],[cx+rx,cy-.12]);return a};
 if(fr){
  h.begin();h.poly(D(10,13.8,1.65,1.15),(ux,uy)=>uy<14.1?'#5e1727':'#7e2336');h.end(1,dkOut);
  h.begin();h.rrect(8.7,13.74,2.6,.38,.15,'#ffffff');h.end(0);
  h.begin();h.ell(10.5,14.62+ph*.1,.78,.66,(ux,uy,dx,dy)=>dy>.5?'#e8587a':(dx<-.2&&dy<0)?'#ffa9b6':'#ff8c9c');
  h.stroke(h.bez([10.5,14.4+ph*.1],[10.5,14.65+ph*.1],[10.5,14.8+ph*.1],[10.5,15.0+ph*.1]),.05,.04,()=>'#d9506f');
  h.end(1,c=>[c[0]*.55|0,c[1]*.2|0,c[2]*.3|0])}
 else{
  h.begin();h.poly(D(13.1,13.7,.95,.85),(ux,uy)=>uy<13.95?'#5e1727':'#7e2336');h.end(1,dkOut);
  h.begin();h.rrect(12.4,13.65,1.4,.3,.12,'#ffffff');h.end(0);
  h.begin();h.ell(13.25,14.3+ph*.08,.5,.5,(ux,uy,dx,dy)=>dy>.5?'#e8587a':'#ff8c9c');h.end(1,c=>[c[0]*.55|0,c[1]*.2|0,c[2]*.3|0])}}
// ---------- 1c) 3 biểu cảm mới: lắp mặt ----------
function faceCheeky(fr,st){
 if(fr){eyeBig(7.9,12,.95,1.2);if(st.wk)arc(12.1);else eyeBig(12.1,12,.95,1.2);
  blush(7.5,13.7,.8,.5);blush(12.5,13.7,.8,.5);cheekyMouth(1,st.ph)}
 else{if(st.wk)arc(12.2);else eyeBig(12.2,12,.95,1.2);blush(10,13.8,.7,.5);cheekyMouth(0,st.ph)}}
function faceHeart(fr,st){
 if(fr){closedEye(7.9,12.1,1.1,-1,1);closedEye(12.1,12.1,1.1,1,1);blush(7.4,13.7,.9,.6);blush(12.6,13.7,.9,.6);pucker(10,14.3,.8,.72,st.ph)}
 else{closedEye(12.2,12.1,1.1,1,1);blush(10,13.8,.85,.55);pucker(13.5,13.95,.62,.7,st.ph)}}
function faceBubble(fr,st){
 const ey=st.ey,mo=st.mo;
 if(fr){
  if(ey=='s'){eyeBig(7.9,11.9,1.1,1.4);eyeBig(12.1,11.9,1.1,1.4)}
  else if(ey=='c'){closedEye(7.9,12.2,.95,-1,0);closedEye(12.1,12.2,.95,1,0)}
  else if(ey=='b'){closedEye(7.9,12.4,.95,-1,0);closedEye(12.1,12.4,.95,1,0)}
  else{eyeBig(7.9,12,.95,1.2);eyeBig(12.1,12,.95,1.2)}
  blush(7.5,13.6,.75,.5);blush(12.5,13.6,.75,.5);
  if(mo=='bl'){h.begin();h.ell(10,14.2,.42,.4,'#5e1727');h.end(0)}
  else if(mo=='su')openMouth(10,14.35,.55,.6);
  else if(mo=='m1')openMouth(10,14.3,.55,.42);
  else smile([9.2,14.1],[9.6,14.5],[10.4,14.5],[10.8,14.1],.18)}
 else{
  if(ey=='s')eyeBig(12.2,11.9,1.1,1.4);
  else if(ey=='c')closedEye(12.2,12.2,.95,1,0);
  else if(ey=='b')closedEye(12.2,12.4,.95,1,0);
  else eyeBig(12.2,12,.95,1.2);
  blush(10,13.7,.7,.5);
  if(mo=='bl'){h.begin();h.ell(13.4,13.9,.3,.34,'#5e1727');h.end(0)}
  else if(mo=='su')openMouth(13.3,14.0,.45,.55);
  else if(mo=='m1')openMouth(13.2,13.95,.45,.4);
  else smile([12.4,13.8],[12.8,14.1],[13.3,14.0],[13.7,13.6],.2)}}
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
   openMouth(10,14.2,1.0,1.0)}
  else{heart(12.2,11.5,.95,C);blush(10,13.8,.8,.55);openMouth(13.2,14.0,.6,.78)}}
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
 else if(e==6)faceBubble(fr,st);
 else if(e==7)faceHeart(fr,st);
 else if(e==9)faceCheeky(fr,st);
}
// ---------- 3) dựng + cache ----------
const CACHE={},cx0=(CX0+12)*K,cy0=(CY0+12)*K,cw=CW*K,ch=CH*K;
function crop(){const D=h.frame(),o=new Uint8ClampedArray(cw*ch*4);
 for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const s=((cy0+y)*h.W+cx0+x)*4,d=(y*cw+x)*4;o[d]=D[s];o[d+1]=D[s+1];o[d+2]=D[s+2];o[d+3]=D[s+3]}return o}
function raw(e,fr,Rt,st){h.newFrame();face(e,fr,st);let o=crop();
 if(!fr&&!Rt){const f=new Uint8ClampedArray(o.length);for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const s=(y*cw+x)*4,d=(y*cw+(cw-1-x))*4;for(let k=0;k<4;k++)f[d+k]=o[s+k]}o=f}
 return o}
function getImg(e,fr,Rt,st){const key=[e,fr?1:0,fr?0:Rt?1:0,st.bl|0,st.ph|0,st.pc|0,st.ey||'',st.mo||'',st.wk|0].join('|');let c=CACHE[key];
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
 return p}
const nowS=()=>performance.now()/1000;
// ---------- 5) thay faceDef / faceFx ----------
window.faceDef=function(u,side,Rt){
 const st={bl:(performance.now()%4300)<140};
 if(!blit(u,0,!side,Rt,st))oldDef(u,side,Rt)};
// ---------- 6) hiệu ứng động vẽ nét mịn (canvas phụ K=4, dựng lại mỗi khung, rất nhẹ) ----------
const SX0=1,SY0=8,SW=27,SH=18,PI2=Math.PI*2;
let SCR=null,SC=null;
function scratch(){if(!SCR){SCR=document.createElement('canvas');SCR.width=SW*K;SCR.height=SH*K;SC=SCR.getContext('2d')}
 SC.setTransform(1,0,0,1,0,0);SC.clearRect(0,0,SW*K,SH*K);SC.setTransform(K,0,0,K,-SX0*K,-SY0*K);return SC}
function putScratch(g,p,side,Rt){
 const pm=g.imageSmoothingEnabled,pq=g.imageSmoothingQuality;let a=1;try{const m=g.getTransform();a=Math.hypot(m.a,m.b)}catch(x){}
 g.imageSmoothingEnabled=(a/K)<1.7;try{g.imageSmoothingQuality='high'}catch(x){}
 if(side&&!Rt){g.save();g.translate(p[0]+20,p[1]);g.scale(-1,1);g.drawImage(SCR,SX0,SY0,SW,SH);g.restore()}
 else g.drawImage(SCR,p[0]+SX0,p[1]+SY0,SW,SH);
 g.imageSmoothingEnabled=pm;try{g.imageSmoothingQuality=pq}catch(x){}}
// ---- Bong bóng kẹo: màu kẹo (đổi ở đây nếu muốn kẹo hồng: rim '#e0507a', body '#ff9ab8', light '#ffe0ea') ----
const GUMC={rim:'rgba(34,166,92,.95)',body:'rgba(70,205,125,',light:'rgba(214,255,230,',solid:'rgba(84,208,132,.97)',dark:'rgba(40,168,92,'};
const BT=4.6;
function bubbleState(t){
 const tt=t%BT;let r=0,pop=-1;
 if(tt>=.6&&tt<3.2){const q=(tt-.6)/2.6;r=.9+2.8*(1-Math.pow(1-q,1.8))+Math.sin(t*7)*.07*q}
 else if(tt>=3.2&&tt<3.5)r=3.7+(tt-3.2)*1.0+Math.sin(t*45)*.1;
 else if(tt>=3.5&&tt<3.9)pop=(tt-3.5)/.4;
 const surp=tt>=3.3&&tt<3.9,blow=tt>=.6&&tt<3.3;
 const ey=surp?'s':blow?'c':(Math.floor(t)%5==2&&(t%1)<.18)?'b':'o';
 const mo=blow?'bl':surp?'su':(Math.floor(t*4)%2?'m1':'m0');
 return{tt,r,pop,surp,blow,ey,mo}}
function gumBubble(s,cx,cy,r,t,tens){
 const wob=Math.sin(t*9)*.022*(r>2?1:.4),f=Math.max(0,Math.min(1,(r-1)/1.3));      // f: 0 = cục kẹo đặc, 1 = màng mỏng trong
 s.save();s.translate(cx+(tens?Math.sin(t*60)*.06:0),cy);s.scale(1+wob,1-wob);
 let g=s.createRadialGradient(-r*.3,-r*.35,r*.08,0,0,r);
 g.addColorStop(0,GUMC.light+(.95-.7*f).toFixed(2)+')');g.addColorStop(.62,GUMC.body+(.97-.62*f).toFixed(2)+')');g.addColorStop(1,GUMC.body+(.98-.3*f).toFixed(2)+')');
 s.beginPath();s.arc(0,0,r,0,PI2);s.fillStyle=g;s.fill();
 // bóng đổ phía dưới-phải bên trong
 s.beginPath();s.arc(0,0,r*.82,Math.PI*.08,Math.PI*.62);s.lineWidth=r*.2;s.lineCap='round';s.strokeStyle=GUMC.dark+(.18+.12*f).toFixed(2)+')';s.stroke();
 // viền
 s.beginPath();s.arc(0,0,r,0,PI2);s.lineWidth=.17;s.strokeStyle=GUMC.rim;s.stroke();
 s.beginPath();s.arc(0,0,r-.17,0,PI2);s.lineWidth=.07;s.strokeStyle='rgba(225,255,236,'+(.35+.3*f).toFixed(2)+')';s.stroke();
 // điểm sáng
 s.lineCap='round';
 if(r>1.5){s.beginPath();s.arc(0,0,r*.68,Math.PI*1.08,Math.PI*1.42);s.lineWidth=Math.min(.36,r*.1);s.strokeStyle='rgba(255,255,255,.95)';s.stroke();
  s.beginPath();s.arc(0,0,r*.68,Math.PI*1.5,Math.PI*1.56);s.lineWidth=Math.min(.3,r*.08);s.stroke();
  s.beginPath();s.arc(0,0,r*.74,Math.PI*.14,Math.PI*.36);s.lineWidth=.14;s.strokeStyle='rgba(255,255,255,.45)';s.stroke()}
 else{s.beginPath();s.arc(-r*.34,-r*.38,r*.24,0,PI2);s.fillStyle='rgba(255,255,255,.95)';s.fill()}
 s.restore()}
function lipGum(s,mx,my,a,rx,ry){        // kẹo bám quanh môi
 s.save();s.globalAlpha=a;
 s.beginPath();s.ellipse(mx,my,rx,ry,0,0,PI2);s.fillStyle=GUMC.solid;s.fill();s.lineWidth=.12;s.strokeStyle=GUMC.rim;s.stroke();
 s.beginPath();s.ellipse(mx-rx*.35,my-ry*.35,rx*.28,ry*.2,0,0,PI2);s.fillStyle='rgba(255,255,255,.9)';s.fill();s.restore()}
function sparkle(s,x,y,z,a){s.save();s.globalAlpha=a;s.fillStyle='#ffffff';s.beginPath();s.moveTo(x,y-z);s.quadraticCurveTo(x,y,x+z,y);s.quadraticCurveTo(x,y,x,y+z);s.quadraticCurveTo(x,y,x-z,y);s.quadraticCurveTo(x,y,x,y-z);s.fill();s.restore()}
function bubbleFx(g,p,side,Rt,t,B){
 const mx=side?13.4:10,my=side?14.0:14.35;
 const anc=r=>side?[13.5+r*.9,13.9+r*.6]:[10,14.3+r*.78];
 const s=scratch();let any=false;
 if(B.r>0){any=true;const c=anc(B.r);lipGum(s,mx,my,1,.95,.55);gumBubble(s,c[0],c[1],B.r,t,B.tt>=3.2);0}
 if(B.pop>=0){any=true;const q=B.pop,c=anc(3.95),a=1-q;
  // sóng nổ + mảnh kẹo văng + lấp lánh
  s.beginPath();s.arc(c[0],c[1],3.8+q*2.8,0,PI2);s.lineWidth=.22*(1-q)+.04;s.strokeStyle='rgba(110,225,150,'+(a*.8).toFixed(2)+')';s.stroke();
  for(let k=0;k<10;k++){const an=k*PI2/10+.3,D=3.1+q*(2.4+(k%3)*.7),x=c[0]+Math.cos(an)*D,y=c[1]+Math.sin(an)*D*.92,z=(1.0-.35*(k%2))*(1-q*.5);
   s.save();s.translate(x,y);s.rotate(an+q*3);s.globalAlpha=Math.max(0,1-Math.pow(q,1.6));
   s.beginPath();s.moveTo(-z,-z*.55);s.quadraticCurveTo(0,-z*.9,z,-z*.3);s.quadraticCurveTo(z*.7,z*.7,-z*.2,z*.6);s.quadraticCurveTo(-z*.9,z*.4,-z,-z*.55);
   s.fillStyle=k%2?'rgba(120,226,160,.95)':GUMC.solid;s.fill();s.lineWidth=.1;s.strokeStyle=GUMC.rim;s.stroke();
   s.beginPath();s.arc(-z*.3,-z*.2,z*.18,0,PI2);s.fillStyle='rgba(255,255,255,.9)';s.fill();s.restore()}
  for(let k=0;k<4;k++){const an=k*PI2/4+.9,D=2.2+q*5;sparkle(s,c[0]+Math.cos(an)*D,c[1]+Math.sin(an)*D,.55*(1-q)+.1,a)}
  // màng kẹo dính quanh miệng (kéo thành sợi)
  const sp=Math.min(1,q*2.2);
  lipGum(s,mx-1.0,my+.15,.9,.55*sp+.1,.4*sp+.1);lipGum(s,mx+1.0,my+.25,.9,.5*sp+.1,.36*sp+.1);lipGum(s,mx,my+.95,.9,.95*sp+.1,.38*sp+.1);
  s.lineCap='round';s.lineWidth=.1;s.strokeStyle='rgba(90,215,140,'+(.85*a+.1).toFixed(2)+')';
  [-1,1].forEach(sg=>{s.beginPath();s.moveTo(mx+sg*.8,my-.1);s.quadraticCurveTo(mx+sg*(1.6+q*1.6),my-.6-q*.5,mx+sg*(2.0+q*2.4),my-.2-q*1.4);s.stroke()})}
 if(B.tt>=3.9){any=true;const fade=Math.max(0,1-(B.tt-3.9)/.7);   // kẹo còn dính ở môi, mờ dần
  lipGum(s,mx,my+.75,.95*fade,.9,.36);lipGum(s,mx-.95,my+.2,.8*fade,.42,.34);
  s.lineCap='round';s.lineWidth=.09;s.strokeStyle='rgba(90,215,140,'+(.8*fade).toFixed(2)+')';s.beginPath();s.moveTo(mx+.7,my-.05);s.quadraticCurveTo(mx+1.7,my-.5,mx+2.1,my-.1);s.stroke()}
 if(any)putScratch(g,p,side,Rt)}
// tim bay (vẽ pixel như cũ — chỉ đổi điểm xuất phát cho khớp miệng mới)
function heartsFly(u,t,side,Rt){
 const px=(c,x,y)=>side?u(c,Rt?x:19-x,y,1,1):u(c,x,y,1,1);
 const L=2.8,HC2=[['#ff3b5c','#c01838','#ffc2cf'],['#4aa8ff','#1f6fc8','#c4e4ff'],['#ffd23f','#d99a10','#fff2b0']];
 const mx=side?13:10,my=14.5;
 for(let k=0;k<3;k++){
  const p=((t/L)+k/3)%1,C=HC2[k];
  if(p<.84){
   const R=1+p*3.7,cx=Math.round(mx+Math.sin(p*6.3+k*2.1)*(1.2+p*2.2)+(side?p*6:(k-1)*p*3)),cy=Math.round(my-1-p*27),pulse=p>.72?Math.sin(t*40)*.25:0,RR=R+pulse;
   if(RR<1.5){px(C[0],cx-1,cy-1);px(C[0],cx+1,cy-1);px(C[0],cx-1,cy);px(C[0],cx,cy);px(C[0],cx+1,cy);px(C[0],cx,cy+1);px(C[2],cx-1,cy-1)}
   else{const inH=(i,j)=>{const x=i/(RR*1.08),y=-(j-RR*.1)/(RR*1.08),a=x*x+y*y-1;return a*a*a-x*x*y*y*y<=0},m=Math.ceil(RR*1.3);
    for(let j=-m;j<=m;j++)for(let i=-m;i<=m;i++){if(!inH(i,j))continue;const dk=!inH(i+1,j)||!inH(i,j+1)||!inH(i+1,j+1);px(dk?C[1]:C[0],cx+i,cy+j)}
    px(C[2],cx-Math.round(RR*.5),cy-Math.round(RR*.45));if(RR>2.6)px(C[2],cx-Math.round(RR*.5)+1,cy-Math.round(RR*.45))}
  }else{
   const q=(p-.84)/.16,R0=4.6+q*7,cx=Math.round(mx+Math.sin(.84*6.3+k*2.1)*3.4+(side?5:(k-1)*2.5)),cy=Math.round(my-1-.84*27),a=1-q;
   for(let i=0;i<10;i++){const an=i*Math.PI/5+k,sx=Math.round(cx+Math.cos(an)*R0),sy=Math.round(cy+Math.sin(an)*R0*.9);
    if(a>.15){px(i%2?C[0]:C[1],sx,sy);if(a>.5&&i%3==0)px(C[2],sx+(Math.cos(an)>0?-1:1),sy)}}
   if(q<.5){px('#ffffff',cx,cy);px(C[2],cx-1,cy);px(C[2],cx+1,cy);px(C[2],cx,cy-1);px(C[2],cx,cy+1)}}}}
// tim nhỏ thả lên (Lém lỉnh)
function cheekyHeart(u,t,side,Rt){
 const px=(c,x,y)=>side?u(c,Rt?x:19-x,y,1,1):u(c,x,y,1,1),p=(t%2.6)/2.6;
 if(p<.92){const x=14+Math.round(p*5),y=Math.round(9-p*11),a=Math.min(1,(1-p)*2.2).toFixed(2),c='rgba(255,77,122,'+a+')',hh='rgba(255,194,207,'+a+')';
  px(c,x,y);px(c,x+2,y);px(c,x,y+1);px(c,x+1,y+1);px(c,x+2,y+1);px(c,x+1,y+2);px(hh,x,y)}}
// ---------- 7) thay faceDef / faceFx ----------
window.faceDef=function(u,side,Rt){
 const st={bl:(performance.now()%4300)<140};
 if(!blit(u,0,!side,Rt,st))oldDef(u,side,Rt)};
window.faceFx=function(u,e,side,Rt){
 if(e<1||e>9||e==8){oldFx(u,e,side,Rt);return}
 const t=nowS(),st={bl:0,ph:0,pc:Math.sin(t*5)>0?1:0};let B=null;
 if(e==3)st.ph=Math.floor(((t*1.3)%1)*2);if(e==4)st.ph=Math.floor(((t*1.6)%1)*2);
 if(e==6){B=bubbleState(t);st.ey=B.ey;st.mo=B.mo}
 if(e==7)st.ph=Math.floor(t*3.2)%2;
 if(e==9){st.ph=Math.floor(t*3)%2;st.wk=side?((t%1.8)<1.2?1:0):((t%2.4)<1.6?1:0)}
 const p=blit(u,e,!side,Rt,st);
 if(!p){oldFx(u,e,side,Rt);return}
 if(e==6){bubbleFx(CTX,p,side,Rt,t,B);return}
 if(e==7){heartsFly(u,t,side,Rt);return}
 if(e==9){cheekyHeart(u,t,side,Rt);return}
 // hiệu ứng nhẹ vẽ pixel như cũ: tim bay (iu iu), lấp lánh (vui vẻ) — chỉ nhìn trước
 if(!side&&e==2){const heart=(c,x,y)=>{u(c,x,y,1,1);u(c,x+2,y,1,1);u(c,x,y+1,3,1);u(c,x+1,y+2,1,1)};
  for(let k=0;k<2;k++){const p=((t*.45)+k*.5)%1,y=7-Math.round(p*7),x=k?15:1,a=(1-p).toFixed(2);heart('rgba(255,77,122,'+a+')',x+Math.round(Math.sin(t*3+k*3)),y)}}
 if(!side&&e==5){const tw=Math.sin(t*4)>0,Y='#fff3a8';if(tw){u(Y,16,6,1,1);u(Y,15,7,3,1);u(Y,16,8,1,1)}else{u(Y,2,9,1,1);u(Y,1,10,3,1);u(Y,2,11,1,1)}}
};
window.__HDF={raw,cw,ch,CX0,CY0};
})();
