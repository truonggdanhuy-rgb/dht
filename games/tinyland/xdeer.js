/* =====================================================================
   XDEER.JS — 🦌 Set Tiểu tuần lộc + Tóc Tiểu tuần lộc (mỗi món 12 🗝️ Chìa khóa Giáng sinh)
   Tự đăng ký vào SETS / HAIRS (cuối mảng) và tự thêm 2 món vào Gian hàng quà ở Xưởng Noel.
   Chỉ cần thêm 1 dòng <script src="xdeer.js"> vào cuối index.html (sau perso.js).
   Đổi giá: sửa XD_PRICE. Vẽ pixel theo lưới nhân vật 20x31.
   ===================================================================== */
(function(){
const XD_PRICE=12;
const sin=Math.sin,rnd=Math.round;
// ---- bảng màu ----
const FW='#ffffff',F1='#f1f5fb',F2='#d9e2f0',F3='#b7c4dc';            // lông trắng
const BR='#8e5a37',BL='#b9804c',BD='#63391f';                          // nâu
const RD='#d8232a',RK='#9c1620',GD='#ffd23a',GK='#d9960f';            // đỏ / vàng
const TL='#25b3a2',TLL='#58dccb',TLD='#177a70';                        // xanh ngọc (quần short)
const bobOf=(o,K)=>o.nobob?0:o.mv?(K.lg?-1:0):0;

// vẽ bản đồ ký tự: half=true → đối xứng 2 bên; ngược lại nhìn ngang (vẽ hướng PHẢI, tự lật)
function stamp(u,K,rows,y0,pal,half){
 rows.forEach((s,j)=>{s=(s+'                    ').slice(0,20);
  for(let c=0;c<s.length;c++){const ch=s[c];if(ch==='.'||ch===' ')continue;let e=c;while(e+1<s.length&&s[e+1]===ch)e++;
   const w=e-c+1,col=pal[ch];if(col){
    if(half){u(col,c,y0+j,w,1);u(col,20-c-w,y0+j,w,1)}   // chỉ dùng nửa trái (c<10)
    else u(col,K.side&&!K.Rt?20-c-w:c,y0+j,w,1)}
   c=e}})}
const halfFix=r=>r.map(s=>s.slice(0,10));

// ======================= SET =======================
SETFX.xdeer=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK,SKS}=K,bob=bobOf(o,K);
 const Q=(c,x,y,w,h)=>u(c,x,y-bob,w,h);
 const P={h:FW,F:F1,f:F2,g:F3,B:BR,b:BL,d:BD,R:RD,r:RK,G:GD,y:GK,S:SK,s:SKS,T:TL,t:TLL,u:TLD};
 // ---- chân: short xanh ngọc, tất nâu + bông tuyết, viền lông trắng, ủng nâu ----
 const leg=(x,lift,w,toe)=>{
  Q(TL,x,24,w,1);Q(TLL,x,24,1,1);Q(TL,x,25,w,1);Q(TLD,x,25,w,1);Q(TL,x,25,w-1,1);
  for(let y=26;y<=27-lift;y++){Q(BR,x,y,w,1);Q(BL,x,y,1,1);Q(BD,x+w-1,y,1,1)}
  if(!side&&lift>=0)Q(FW,x+1,26,1,1);else if(side&&lift>=0)Q(FW,x+1,26,1,1);
  Q(F1,x-(side?0:0),28-lift,w,1);Q(FW,x,28-lift,1,1);Q(F3,x+w-1,28-lift,1,1);
  Q(S.shoe,x,29-lift,w,1);Q(shade(S.shoe,.3),x,29-lift,1,1);Q(shade(S.shoe,-.3),x+w-1,29-lift,1,1);
  if(side)Q(S.shoe,toe,29-lift,1,1)};
 if(!rd){
  if(sit){const sw=rnd(sin(performance.now()/260)*1.5);leg(5,sw>0?-2:-1,4);leg(11,-sw>0?-2:-1,4)}
  else if(!side){const A=[5,0],B=[11,0];let L=[A,B];if(lg>0)L=[[11,0],[5,1]];else if(lg<0)L=[[5,0],[11,1]];L.forEach(q=>leg(q[0],q[1],4))}
  else{const x1=8+sx,x2=10-sx;let L=[[x1,0],[x2,0]];if(lg>0)L=[[x2,0],[x1,1]];else if(lg<0)L=[[x1,0],[x2,1]];L.forEach(q=>leg(q[0],q[1],3,Rt?q[0]+3:q[0]-1))}
 }
 // ---- thân: croptop nâu + bụng trần + thắt lưng vàng + quần short ----
 if(!side){
  stamp(u,K,halfFix([
   back?".......BBB":".......BBS",
   back?"......BRRR":"......BBBS",
   back?"......BBRr":"......BbBR",
   "......BBBB",".....FFFFF","......sSSS","......sSSS",
   back?"......yGGG":"......yGGR",".....TTTTT"]),16,P,true);
  if(!back)u(SKS,9,22,1,1);
  u(FW,5,20,1,1);u(FW,14,20,1,1);u(F2,7,20,1,1);u(F2,12,20,1,1);   // viền lông xù
  if(!back){u(FW,9,18,1,1);u(TLL,7,24,1,1);u(FW,12,24,1,1)}
  else{u(F1,8,23,4,3);u(FW,8,23,2,1);u(F3,10,25,2,1);u(F2,8,25,2,1)}   // đuôi bông
 }else{
  stamp(u,K,[
   "........BBBBBB......",".......BbBBBBB......",".......BBBBBBR......",".......BBBBBBB......",
   ".......FFFFFFF......","........sSSSSS......","........sSSSSS......","........yGGGGR......",".......TTTTTTT......"],16,P,false);
  u(F1,K.Rt?5:12,23,3,3);u(FW,K.Rt?5:14,23,1,1);u(F3,K.Rt?7:12,25,1,1);   // đuôi bông phía sau
 }
 // ---- tay: da + viền lông cổ tay (vẽ trước lông vai) ----
 const arm=(x,ay)=>{u(SK,x,17+ay,3,4);u(SKS,x+2,17+ay,1,4);u(F1,x,21+ay,3,1);u(FW,x,21+ay,1,1);u(F3,x+2,21+ay,1,1);u(SK,x,22+ay,3,2);u(SKS,x+2,22+ay,1,2)};
 const up=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u('rgba(0,0,0,.12)',x+ox,ty+2,3,1);u(F1,x,ty+3,3,1);u(FW,x,ty+3,1,1);u(SK,x,ty+4,3,3);u(SKS,x+2,ty+4,1,3)};
 if(!side){if(o.aup){o.aup[0]!=null?up(2,o.aup[0],-1):arm(2,lg);up(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}}
 else if(!o.noarm){const ax=9-sx;u(SK,ax,17,3,4);u(SKS,ax+2,17,1,4);u(F1,ax,21,3,1);u(FW,ax,21,1,1);u(SK,ax,22,3,2);u(SKS,ax+2,22,1,2)}
 // ---- LÔNG TO 2 BÊN VAI ----
 if(!side)stamp(u,K,halfFix(["...hFF....","..hFFFFf..",".hFFFFFf..",".FFhFFf...",".FfFFFg...","..gfFg...."]),14,P,true);
 else stamp(u,K,["......hFFFF.........",".....hFFFFFFf.......",".....FFhFFFFFf......",".....FFFhFFFFf......","......FFFFFFg.......",".......gfFFfg......."],14,P,false);
 u(SK,9,15,2,1);
};

// ======================= TÓC =======================
const AL='#f3e2b8',AM='#cfa86a',AK='#8d6a3a';
function spark(u,cx,cy,ph,t){const s=sin(t*2.4+ph);
 if(s>.6){u('#ffffff',cx,cy,1,1);u('rgba(190,230,255,.95)',cx-1,cy,1,1);u('rgba(190,230,255,.95)',cx+1,cy,1,1);u('rgba(190,230,255,.95)',cx,cy-1,1,1);u('rgba(190,230,255,.95)',cx,cy+1,1,1)}
 else if(s>.15){u('rgba(220,240,255,.9)',cx,cy,1,1)}}
function flake5(u,cx,cy){const W='#fff',B='rgba(200,232,255,.95)';u(W,cx,cy,1,1);[[-1,0],[1,0],[0,-1],[0,1],[-2,0],[2,0],[0,-2],[0,2]].forEach(q=>u(W,cx+q[0],cy+q[1],1,1));[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(q=>u(B,cx+q[0],cy+q[1],1,1));[[-2,-1],[-2,1],[2,-1],[2,1]].forEach(q=>u(B,cx+q[0],cy+q[1],1,1))}
function holly(u,x,y){u('#2f8f4a',x,y,3,1);u('#5cc06a',x,y,1,1);u('#1f6a35',x+2,y+1,1,1);u('#d8232a',x+1,y,1,1);u('#ff6a5a',x+1,y,1,0)}
function flake(u,cx,cy){u('#fff',cx,cy,1,1);u('#bfe4ff',cx-1,cy,1,1);u('#bfe4ff',cx+1,cy,1,1);u('#bfe4ff',cx,cy-1,1,1);u('#bfe4ff',cx,cy+1,1,1)}


// ---- SỪNG: vẽ bằng nét cong (vùng vẽ rộng hơn lưới 20, x có thể < 0 hoặc > 19) ----
function strokePix(set,pts,w0,w1){let tot=0;for(let i=1;i<pts.length;i++)tot+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);let run=0;
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1]));
  for(let k=0;k<=L*2;k++){const f=k/(L*2),x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f,p=(run+f*L)/tot,w=Math.max(1,Math.round(w0+(w1-w0)*p));
   for(let dx=0;dx<w;dx++)for(let dy=0;dy<(w>2?2:1);dy++)set.add(Math.round(x-(w-1)/2+dx)+','+(Math.round(y)+dy))}run+=L}}
function buildAnt(strokes,mirror){const set=new Set();strokes.forEach(q=>strokePix(set,q[0],q[1],q[2]));
 const out=[];set.forEach(k=>{const[x,y]=k.split(',').map(Number);const l=!set.has((x-1)+','+y),r=!set.has((x+1)+','+y),t=!set.has(x+','+(y-1));
  out.push([x,y,l?'l':r?'d':(t?'l':'m')])});
 if(mirror){const n=out.length;for(let i=0;i<n;i++){const q=out[i];out.push([19-q[0],q[1],q[2]=='l'?'d':q[2]=='d'?'l':q[2]])}}
 return out}
const ANT_F=buildAnt([ // nhìn trước/sau (nửa trái, tự đối xứng)
 [[[6,5],[5,2],[3,-1],[1,-4],[-1,-7],[-2,-10],[-2,-14],[-1,-17]],3,1],
 [[[2,-2],[2,-6],[3,-9],[3,-12]],2,1],
 [[[-1,-7],[0,-10],[1,-13],[1,-16]],2,1],
 [[[5,2],[7,-1],[8,-4],[8,-6]],2,1],
 [[[0,-5],[-3,-6],[-4,-8]],1,1]],true);
const ANT_S=buildAnt([ // nhìn ngang (hướng phải)
 [[[8,5],[7,1],[5,-3],[4,-7],[4,-11],[5,-15],[6,-17]],3,1],
 [[[6,-1],[8,-5],[9,-9],[9,-12]],2,1],
 [[[4,-7],[6,-11],[7,-14]],2,1],
 [[[7,2],[10,-1],[11,-4]],2,1]],false);
function drawAnt(u,K,list,P){list.forEach(q=>u(P[q[2]],K.side&&!K.Rt?20-q[0]-1:q[0],q[1],1,1))}

HAIRFX.xdeer=(u,o,K)=>{
 const{side,Rt,back,HC}=K,t=performance.now()/1000,H=HC||'#6b3d22',
  P={H:H,L:shade(H,.3),D:shade(H,-.32),a:AL,A:AM,k:AK,w:FW,v:F1,x:F2,e:BR,p:'#f4a6b4',q:BL,N:'#c0e6ff',l:'#b0713f',m:'#7a4526',d:'#4a2813'};
 // sừng (nửa trái, đối xứng) — y từ -11
 const ANT=halfFix([
  "..l.......","..m...l...","..m...m...","..m...m...","..lm..m...","..mm.lm...","..mmlmd...","..lmmmd...","..lmmmd...",
  ".llmmmd...",".m.lmmd...","..mlmmd...","...lmmd...","...lmmd...","....lmmd..","....lmmd..","....lmmd..",
 ]);
 const ANS=[".....l....l",".....m....m",".....m...lm",".....m...m",".....lm.m",".....mmlm",".....lmmm","....lmmmd","....lmmmd",".....lmmd",".....lmmd",".....lmmd","......lmmd","......lmmd","......lmmd","......lmmd","......lmmd"];
 if(!side){
  // lông mũ + tóc
  const HR=back?halfFix([".......HHH","....HHHHHH","...HHHLHHH","...HHHHHHH","...HHHHHHH","...HHHHLHH","...HHHHHHH","...HHHHHHH","...HHHHHHH","...HHHHHHH","...HHLHHHH","....HHHHHH","....HLHHHH",".....HHHHH","......HHHH","......DDDD"])
   :halfFix([".......HHH","....HHHHHH","...HHHHLHH","...HHHHHHH","...HHHHHHH","...HHHHH..","....HHH...","...LHHD...","...HHHD...","...HHHD...","...LHHD...","...HHHD...","...HHHD...","..HHHHD...","..HHHD....","..HHDD...."]);
  stamp(u,K,HR,4,P,true);
  if(!back){u(P.H,7,8,1,1);u(P.H,12,8,1,1);u(P.D,8,8,1,1)}
  // sừng
  drawAnt(u,K,ANT_F,P);
  // tai hươu 2 bên
  const ear=["ee.....","epe....",".eppe..","..epee.","...eee."];
  [0,1].forEach(sd=>{ear.forEach((row,j)=>{for(let c=0;c<row.length;c++){const ch=row[c];if(ch==='.')continue;const x=sd?19-(c):c;u(P[ch],x,4+j+1,1,1)}})});
  // băng lông trắng + bông tuyết
  u(P.w,5,6,10,1);u(P.v,4,7,12,1);u(P.x,5,7,1,1);u(P.x,14,7,1,1);u(P.w,7,6,2,1);u(P.w,12,6,1,1);
  flake5(u,2,-5);flake5(u,17,-5);holly(u,4,8);holly(u,13,8);
  // lấp lánh hoa tuyết trên sừng
  [[-2,-17,0],[21,-17,2.1],[3,-12,4.2],[16,-12,1.2],[-4,-8,3.3],[23,-8,5.1],[8,-6,5.9],[11,-6,.7],[1,-17,2.7],[18,-17,.4]].forEach(q=>spark(u,q[0],q[1],q[2],t));
  for(let i=0;i<3;i++){const p=((t*.3+i*.33)%1),fx=[-1,20,9][i]+rnd(sin(t*2+i*2)*1.5),fy=-14+rnd(p*20);u('rgba(255,255,255,'+(1-p).toFixed(2)+')',fx,fy,1,1)}
 }else{
  const mx=(x,w)=>Rt?x:20-x-w;
  const HS=["....HHHHH...","...HHHHHHHH.","..HHHHHHHHHH","..HHHHHLHHHH","..HHHHHHHH..","..HHHHHH....","..HHHHHD....","..HHHHHD....","..HHLHHD....","..HHHHHD....","..HHHHHD....","..HHHHD.....","..HHHD......","..HHD......."];
  stamp(u,K,HS.map(s=>'..'+s),4,P,false);
  drawAnt(u,K,ANT_S,P);
  // tai
  [[10,6,'e'],[11,6,'e'],[10,7,'p'],[11,7,'e'],[11,5,'e']].forEach(q=>u(P[q[2]],mx(q[0],1),q[1],1,1));
  u(P.w,mx(6,9),6,9,1);u(P.v,mx(5,10),7,10,1);flake5(u,mx(5,1),-5);holly(u,mx(8,3),8);
  [[5,-17,0],[10,-14,2.1],[3,-9,4],[11,-4,1.3]].forEach(q=>spark(u,mx(q[0],1),q[1],q[2],t));
  for(let i=0;i<2;i++){const p=((t*.3+i*.5)%1);u('rgba(255,255,255,'+(1-p).toFixed(2)+')',mx(5+i*4,1)+rnd(sin(t*2+i)*1.5),-9+rnd(p*16),1,1)}
 }
};

// ======================= ĐĂNG KÝ =======================
if(!SETS.some(s=>s.k=='xdeers'))SETS.push({n:'Set Tiểu tuần lộc',k:'xdeers',fx:'xdeer',ach:1,ck:XD_PRICE,
 ds:'Áo croptop nâu, lông trắng to 2 bên vai, quần short xanh ngọc, tất nâu có bông tuyết, ủng viền lông. Đổi bằng 🗝️ Chìa khóa Giáng sinh.',
 sh:BR,shl:BL,shd:BD,scarf:F1,belt:GD,pt:TL,rpt:BR,shoe:'#4a2c18'});
if(!HAIRS.some(h=>h.k=='xdeer'))HAIRS.push({n:'Tóc Tiểu tuần lộc',k:'xdeer',c:'#6b3d22',ach:1,ck:XD_PRICE});

// ======================= SHOP: Xưởng Noel =======================
const XDI=[{t:'s',k:'xdeers'},{t:'h',k:'xdeer'}];
const arr=t=>t=='s'?SETS:HAIRS,find=q=>arr(q.t).findIndex(x=>x.k==q.k),own=q=>{const i=find(q);return ST.own&&ST.own[q.t]&&ST.own[q.t].includes(i)};
window.xdBuy=function(n){const q=XDI[n],i=find(q);if(i<0)return;ST.own=ST.own||{};const a=(ST.own[q.t]=ST.own[q.t]||[]);
 if(a.includes(i))return toast('✓ Bạn đã có món này rồi, mở 🎒 Túi để dùng');
 const k=ST.ck|0;if(k<XD_PRICE)return toast('🗝️ Chưa đủ chìa khóa — cần '+XD_PRICE+', bạn có '+k);
 ST.ck=k-XD_PRICE;a.push(i);save();toast('🎁 Nhận được '+arr(q.t)[i].n+'!\nMở 🎒 Túi để dùng');nxHouse()};
let XRAF=0;
function xdAnim(){const cs=document.querySelectorAll('canvas.xdc');if(!cs.length||!UI){XRAF=0;return}const t=performance.now()/1000;
 cs.forEach(c=>{const q=XDI[+c.dataset.q],i=find(q),g=c.getContext('2d'),A=ST.av||{};g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.save();g.scale(3,3);
  const d=[0,3,1,2][Math.floor(t/1.6)%4];drawAv(g,Math.round(c.width/6)-10,c.height/3-33+(q.t=='h'?0:0),{d,a:t,mv:0,sit:0,hair:q.t=='h'?i:(A.h|0),set:q.t=='s'?i:(q.t=='h'?(window.nmSet?nmSet(A.s):(A.s|0)):(A.s|0)),e:A.e|0,acc:-1});g.restore()});
 XRAF=requestAnimationFrame(xdAnim)}
const _nx=window.nxHouse;
if(typeof _nx=='function')window.nxHouse=function(){_nx.apply(this,arguments);
 const gg=document.querySelector('#ui .nxgg');if(!gg)return;
 const h=XDI.map((q,n)=>{const i=find(q);if(i<0)return '';const it=arr(q.t)[i],has=own(q),ok=(ST.ck|0)>=XD_PRICE;
  return '<div class="nxd nxbox" style="grid-column:span 1"><canvas class="xdc" data-q="'+n+'" width="96" height="120" style="width:64px;height:80px;image-rendering:pixelated"></canvas><b>'+it.n+'</b>'
   +(has?'<span class="nxs">✓ Đã có</span>':'<button class="nxb'+(ok?'':' lack')+'" onclick="xdBuy('+n+')">🗝️ '+XD_PRICE+' • Đổi</button>')+'</div>'}).join('');
 gg.insertAdjacentHTML('beforeend',h);
 gg.querySelectorAll('.nxg').forEach(e=>e.remove());   // bỏ 5 ô khóa mờ
 const c=document.querySelector('#ui .nxc.soon');if(c)c.textContent='3 MÓN';
 if(!XRAF)XRAF=requestAnimationFrame(xdAnim)};
})();
