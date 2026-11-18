/* ===================================================================================
   BOYBOY.JS — 🖤 SET BOYBOY (Nam) + TÓC BOYBOY — vẽ ĐỒ HỌA CAO (K=4) theo bộ máy hdkit.js
   • Bán ở SHOP PHỐ XÁ:  Set Boyboy 1200 Xu (tab Set)  •  Tóc Boyboy 1200 Xu (tab Tóc & mũ)
       → đổi giá: sửa BB_GIA_SET / BB_GIA_TOC ngay bên dưới (pho-map.js bản mới có đọc trường "xu").
   • SET  : áo khoác đen oversize mở khóa, tay áo rộng phủ gần hết bàn tay (chỉ hở đầu ngón hồng),
            bên trong áo thun sọc ngang đen-trắng + thân trắng, huy hiệu chữ X nhỏ ở ngực,
            2 khuy bạc ở túi + 1 khuy bạc ở vai, cổ áo dựng cao, gấu áo thun trắng lòi ra dưới áo khoác,
            quần đen ống rộng, giày thể thao đen có sọc trắng.
   • TÓC  : tóc TRẮNG TUYẾT xù bồng, dựng gai lộn xộn nhiều lớp, mái chẻ thưa để lộ mắt,
            tóc mai dài chạm má, 2 khuyên tai đen ở tai phải. Hợp với Set Boyboy.
   • VẼ ĐỘ PHÂN GIẢI CAO: mỗi ô game chia 4x4 điểm nhỏ, vẽ bằng hình cong (ell / rrect / stroke bez),
     không bị giới hạn khung 20x31 (tóc gai vượt khung thoải mái). Dựng 1 lần rồi cache.
   • Không che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   • Nạp CUỐI CÙNG trong index.html (sau hdkit.js và hdface.js). Tự đẩy dữ liệu vào CUỐI mảng SETS / HAIRS
     (không làm lệch số thứ tự đồ đã mua).
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined'||typeof HD!=='function')return;

const BB_GIA_SET=1200,BB_GIA_TOC=1200;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần, luôn ở CUỐI mảng) ----------
if(!SETS.some(s=>s.k=='boyboy'))SETS.push({n:'Set Boyboy',k:'boyboy',fx:'boyboy',xu:BB_GIA_SET,boot:1,
 ds:'Áo khoác đen oversize mở khóa, tay áo rộng, áo thun sọc đen trắng bên trong có huy hiệu chữ X, khuy bạc ở túi & vai, quần đen ống rộng, giày thể thao đen sọc trắng. Hợp với Tóc Boyboy.',
 sh:'#17171d',shl:'#2c2c36',shd:'#0b0b10',scarf:'#17171d',belt:'#17171d',pt:'#15151b',rpt:'#15151b',shoe:'#0f0f14'});
if(!HAIRS.some(h=>h.k=='boyboy'))HAIRS.push({n:'Tóc Boyboy',k:'boyboy',c:'#eef0f8',xu:BB_GIA_TOC});

// ---------- 2) lấy canvas game của nhân vật đang vẽ (bọc drawAv, không sửa index.html) ----------
const BBC={g:null,ox:0,oy:0};
if(typeof window.drawAv==='function'&&!window.drawAv.__bb){
 const old=window.drawAv;
 window.drawAv=function(g,ox,oy,o){
  const pg=BBC.g,px=BBC.ox,py=BBC.oy;BBC.g=g;BBC.ox=ox;BBC.oy=oy;
  try{return old.apply(this,arguments)}finally{BBC.g=pg;BBC.ox=px;BBC.oy=py}};
 window.drawAv.__bb=1;
}

// ---------- 3) bảng màu (mỗi bảng 4 tông: tối, vừa, sáng, rất sáng — ánh sáng từ trên-trái) ----------
const h=HD({K:4,MX:12,MY:12,WU:44,HU:52});
const BK=['#07070a','#15151b','#24242e','#3b3b49'],               // áo khoác / quần đen
      WT=['#bfc4d8','#dfe2ee','#f6f7fc','#ffffff'],               // áo thun trắng
      HW=['#9aa1bb','#cdd2e5','#eceff8','#ffffff'],               // tóc trắng
      HWB=['#8189a8','#b2b9d2','#d4d9ea','#eef1f9'],              // tóc trắng phía sau (tối hơn)
      MT=['#7c8296','#a9aebf','#d0d4e2','#f0f2f8'];               // kim loại bạc
const SKB='#fbd5c6',SKS='#eab29f',SKD='#d99886',                  // da hồng nhạt (như hình mẫu)
      STR='#23232c';                                              // sọc áo thun
const olW=c=>[c[0]*.6+34|0,c[1]*.6+36|0,c[2]*.62+46|0];            // viền xám nhạt cho tóc trắng
const olWs=c=>[c[0]*.7+26|0,c[1]*.7+28|0,c[2]*.72+36|0];

// ---------- 4) SET ----------
function leg(x0,lift,side){
 h.begin();h.rrect(x0-.1,23.4,4.6,5.2-lift,.6,(ux,uy)=>ux<x0+1?BK[2]:ux>x0+3.4?BK[0]:BK[1]);
 h.rect(x0+1.9,25.2-lift*.3,.28,3,BK[0]);                           // nếp ống quần
 h.rect(x0-.1,27.1-lift,4.6,.8,BK[0]);                              // bo gấu quần
 h.end(2);
 // giày thể thao đen sọc trắng
 const y=27.6-lift;
 h.begin();h.rrect(x0-.5,y,5.4,3,1,(ux,uy)=>uy>y+2.3?'#0a0a0e':(ux<x0+1?BK[3]:ux>x0+3.8?BK[0]:BK[2]));
 h.rect(x0-.5,y+.95,5.4,.55,'#f8f9ff');h.rect(x0-.5,y+1.9,5.4,.5,'#f8f9ff');
 if(side)h.rect(x0+3.8,y+.4,1.1,.5,'#f8f9ff');
 h.rect(x0-.5,y+2.45,5.4,.55,'#0a0a0e');
 h.end(2)}

function tee(x,y,w,hh,stripes){       // áo thun: sọc ngang đen-trắng ở trên, trắng trơn ở dưới
 h.rect(x,y,w,hh,(ux,uy)=>{
  if(uy<y+stripes){const k=Math.floor((uy-y)/.78);return k%2==0?'#f2f3fa':STR}
  return ux>x+w*.62?WT[1]:WT[2]})}

function torsoF(back){
 // thân áo khoác
 h.begin();h.rrect(3.4,14.5,13.2,10.3,2.2,(ux,uy)=>ux<5.2?BK[2]:ux>14.6?BK[0]:BK[1]);
 if(!back){
  tee(8.55,14.9,2.9,10,3.3);                                         // áo thun hở giữa
 }
 h.end(2);
 if(!back){
  // mép áo khoác 2 bên khe hở (đổ bóng)
  h.begin();h.rect(8.2,15.2,.4,9.4,BK[0]);h.rect(11.4,15.2,.4,9.4,BK[0]);h.end(0);
  // nếp vải & đường viền túi
  h.begin();
  h.stroke(h.bez([5.4,16.2],[4.8,19],[4.8,21.6],[4.6,24]),.2,.1,()=>BK[3]);
  h.stroke(h.bez([14.6,16.2],[15.2,19],[15.2,21.6],[15.4,24]),.2,.1,()=>BK[2]);
  h.stroke(h.bez([5.6,20.9],[6.2,20.6],[7.4,20.6],[8.0,20.9]),.14,.14,()=>BK[3]);
  h.stroke(h.bez([12.0,20.9],[12.6,20.6],[13.8,20.6],[14.4,20.9]),.14,.14,()=>BK[3]);
  h.end(0);
  // khuy bạc ở túi + khuy vai
  h.begin();h.rrect(6.4,21.1,.9,1.5,.3,(ux,uy)=>uy<21.8?MT[3]:MT[1]);h.rrect(12.7,21.1,.9,1.5,.3,(ux,uy)=>uy<21.8?MT[3]:MT[1]);
  h.rrect(14.1,16.4,.8,1.3,.3,(ux,uy)=>uy<17?MT[2]:MT[0]);h.end(1);
  // huy hiệu chữ X nhỏ ở ngực áo thun
  h.begin();
  [[9.35,18.7,10.65,20.1],[10.65,18.7,9.35,20.1]].forEach(q=>h.stroke(h.bez([q[0],q[1]],[q[0]+(q[2]-q[0])*.35,q[1]+(q[3]-q[1])*.35],[q[0]+(q[2]-q[0])*.65,q[1]+(q[3]-q[1])*.65],[q[2],q[3]]),.2,.2,()=>'#15151b'));
  h.rect(9.8,20.0,.4,.9,'#15151b');
  h.end(0);
 }else{
  // lưng áo: đường may giữa + chữ X thêu chìm
  h.begin();h.rect(9.85,15.6,.3,8.4,BK[0]);
  h.stroke(h.bez([8.6,17.2],[9.2,17.7],[9.6,18.1],[10,18.5]),.24,.24,()=>BK[3]);h.stroke(h.bez([11.4,17.2],[10.8,17.7],[10.4,18.1],[10,18.5]),.24,.24,()=>BK[3]);
  h.stroke(h.bez([8.6,19.8],[9.2,19.3],[9.6,18.9],[10,18.5]),.24,.24,()=>BK[3]);h.stroke(h.bez([11.4,19.8],[10.8,19.3],[10.4,18.9],[10,18.5]),.24,.24,()=>BK[3]);
  h.stroke(h.bez([5.4,16.2],[4.8,19],[4.8,21.6],[4.6,24]),.2,.1,()=>BK[3]);
  h.stroke(h.bez([14.6,16.2],[15.2,19],[15.2,21.6],[15.4,24]),.2,.1,()=>BK[2]);
  h.end(0)}
 // gấu áo thun trắng lòi ra dưới áo khoác
 h.begin();h.rrect(4.0,24.0,12.0,1.5,.5,(ux,uy)=>uy>25?WT[0]:ux>12.5?WT[1]:WT[3]);h.rect(4.0,24.9,12.0,.28,'#aeb3c8');h.end(1,h.olSoft);
 // cổ áo dựng
 h.begin();
 h.rrect(5.8,13.7,3.4,2.6,1.0,(ux,uy)=>ux<6.8?BK[3]:BK[1]);h.rrect(10.8,13.7,3.4,2.6,1.0,(ux,uy)=>ux>13?BK[0]:BK[2]);
 if(back)h.rrect(5.8,13.6,8.4,2.2,1.0,(ux,uy)=>uy<14.4?BK[3]:ux>12.8?BK[0]:BK[2]);
 h.end(2)}
function torsoS(){
 h.begin();h.rrect(6.2,14.5,7.8,10.3,2.2,(ux,uy)=>ux<7.4?BK[2]:ux>12.4?BK[0]:BK[1]);
 tee(12.9,14.9,1.1,10,3.3);h.end(2);
 h.begin();h.rect(12.6,15.2,.35,9.4,BK[0]);
 h.stroke(h.bez([7.2,16.4],[6.8,19],[6.8,21.6],[6.6,24]),.18,.1,()=>BK[3]);
 h.rrect(10.6,21.1,.9,1.5,.3,(ux,uy)=>uy<21.8?MT[3]:MT[1]);h.end(0);
 h.begin();h.rrect(6.2,24.0,8.0,1.5,.5,(ux,uy)=>uy>25?WT[0]:WT[3]);h.rect(6.2,24.9,8.0,.28,'#aeb3c8');h.end(1,h.olSoft);
 h.begin();h.rrect(8.4,13.7,4.6,2.6,1.0,(ux,uy)=>ux<9.4?BK[3]:ux>12?BK[0]:BK[2]);h.end(2)}

// tay áo rộng phủ bàn tay: x = mép trái, ay = nhún khi bước, hi = nhấc tay (aup)
function arm(x,ay,hi,left){
 if(hi!=null){
  const ty=17-hi;
  h.begin();h.ell(x+1.65,ty+1.2,1.35,1.25,(ux,uy,dx,dy)=>dx>.4?SKS:SKB);h.end(1,h.olSoft);
  h.begin();h.rrect(x-.2,ty+2.2,3.7,6.2,1.3,(ux)=>ux<x+.9?BK[3]:ux>x+2.6?BK[0]:BK[1]);h.rect(x-.2,ty+7.4,3.7,1,BK[0]);h.end(2);
  return}
 const top=15.5+ay;
 h.begin();h.ell(x+1.65,top+8.1,1.15,.8,SKB);h.end(1,h.olSoft);                          // đầu ngón tay hồng lấp ló
 h.begin();h.rrect(x-.2,top,3.7,7.9,1.5,(ux)=>ux<x+.9?BK[3]:ux>x+2.6?BK[0]:BK[1]);
 h.rect(x-.2,top+6.7,3.7,1.2,BK[0]);h.rect(x-.2,top+6.7,3.7,.25,BK[3]);
 h.rect(x+.7,top+1.2,.3,4.6,BK[0]);h.end(2)}
function armS(x,ay){
 h.begin();h.ell(x+1.7,ay+23.7,1.15,.8,SKB);h.end(1,h.olSoft);
 h.begin();h.rrect(x-.2,15.5+ay,3.6,7.9,1.5,(ux)=>ux<x+.9?BK[3]:ux>x+2.5?BK[0]:BK[1]);
 h.rect(x-.2,22.2+ay,3.6,1.2,BK[0]);h.rect(x-.2,22.2+ay,3.6,.25,BK[3]);h.end(2)}

function buildBody(st){
 h.newFrame();
 const side=st.view=='s',back=st.view=='b',lg=st.lg,sit=st.sit;
 const L=(x,l)=>leg(x,l,side);
 if(!st.rd){
  if(sit){L(5,0);L(11,0)}
  else if(!side){if(lg>0){L(11,0);L(5,1)}else if(lg<0){L(5,0);L(11,1)}else{L(5,0);L(11,0)}}
  else{const s=lg*2;L(8-s-.5,lg>0?1:0);L(8+s-.5,lg<0?1:0)}}
 if(side){torsoS();if(!st.noarm)armS(8.2-lg,lg)}
 else{torsoF(back);arm(1.7,lg,st.aupL,1);arm(15.5,-lg,st.aupR,0)}
 const D=h.frame();return D}

// ---------- 5) TÓC (gai trắng xù, mái chẻ thưa, 2 khuyên tai đen) ----------
const lock=(a,b,c,d,r0,r1,pal,pw)=>h.stroke(h.bez(a,b,c,d),r0,r1,h.shade(pal),pw||1);
const lockM=(a,b,c,d,r0,r1,pal,pw)=>{lock(a,b,c,d,r0,r1,pal,pw);lock(h.mirP(a),h.mirP(b),h.mirP(c),h.mirP(d),r0,r1,pal,pw)};
const mass=(cx,cy,rx,ry,pal)=>h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>pal[dy<-.45?3:dy<.1?2:(dy<.62&&dx<.55)?1:0]);
function earring(cx,cy){h.begin();h.ell(cx,cy,.55,.5,'#1a1a22');h.ell(cx,cy+1.25,.5,.46,'#1a1a22');h.ell(cx-.15,cy-.12,.16,.14,'#7a7f94');h.end(0)}

function hairF(){
 h.newFrame();
 // lớp khối bồng + gai dựng ngắn dày (viền xám nhạt bao ngoài)
 h.begin();
 mass(10,5.4,8.5,5.0,HW);
 lock([8.6,4.6],[8.4,2.4],[9.6,.4],[11.4,-1.8],2.8,.14,HW,.8);                    // chỏm gai trên đỉnh
 lock([11.0,4.4],[12.4,2.4],[14.4,1.2],[16.8,1.0],2.6,.14,HW,.8);
 lock([6.6,4.8],[5.2,3.0],[3.4,2.2],[1.4,2.6],2.5,.14,HW,.8);
 lock([13.2,5.0],[15.0,3.8],[17.0,3.6],[19.0,4.6],2.4,.14,HW,.8);
 lock([5.0,6.6],[3.2,6.4],[1.4,7.0],[-.2,8.2],2.3,.14,HW,.85);                    // gai chìa 2 bên
 lock([15.0,6.6],[16.8,6.4],[18.6,7.0],[20.2,8.2],2.3,.14,HW,.85);
 lock([5.0,8.0],[3.4,8.6],[2.6,9.8],[2.2,11.2],1.9,.16,HW,.9);
 lock([15.0,8.0],[16.6,8.6],[17.4,9.8],[17.8,11.2],1.9,.16,HW,.9);
 lock([9.0,4.2],[9.4,2.4],[11.0,1.4],[13.0,1.6],2.0,.14,HWB,.9);
 h.end(1,olW);
 // mái chẻ thưa dày (mỗi lọn viền riêng cho rõ nét)
 [[[10.2,4.2],[9.0,5.8],[8.0,7.6],[7.0,9.0],2.0,.25],
  [[10.2,4.2],[10.7,6.0],[10.5,7.8],[9.8,9.0],1.5,.2],
  [[10.6,4.2],[11.8,5.8],[12.6,7.6],[13.0,9.0],1.9,.22],
  [[7.8,4.6],[6.4,6.2],[5.6,8.0],[5.4,9.4],1.6,.22],
  [[12.6,4.6],[14.2,6.0],[14.8,7.8],[14.6,9.4],1.6,.22]
 ].forEach(q=>{h.begin();lock(q[0],q[1],q[2],q[3],q[4],q[5],HW,.9);h.end(1,olWs)});
 // tóc mai chạm má
 h.begin();lockM([5.9,7.8],[5.0,9.2],[4.9,11.0],[5.5,12.6],1.1,.2,HW,.9);h.end(1,olW);
 earring(14.7,11.3);
 return h.frame()}

function hairS(){
 h.newFrame();
 h.begin();
 mass(9.2,5.6,7.8,5.0,HW);
 lock([8.2,4.6],[7.8,2.4],[8.8,.4],[10.6,-1.6],2.7,.14,HW,.8);
 lock([10.6,4.4],[12.0,2.4],[14.0,1.2],[16.2,1.6],2.5,.14,HW,.8);
 lock([6.4,4.8],[4.8,2.8],[2.8,2.0],[.6,2.6],2.5,.14,HW,.8);
 lock([5.0,6.4],[3.2,6.4],[1.2,7.4],[-.8,9.2],2.3,.14,HW,.85);
 lock([5.4,8.2],[3.8,9.4],[3.0,11.2],[3.2,13.0],2.0,.16,HWB,.9);
 lock([13.0,5.6],[14.8,5.2],[16.2,6.0],[17.0,7.4],1.8,.14,HW,.85);
 lock([8.4,4.2],[8.8,2.4],[10.4,1.2],[12.4,1.4],1.8,.14,HWB,.9);
 h.end(1,olW);
 [[[10.6,4.2],[12.4,5.4],[13.8,7.2],[14.4,9.0],1.9,.25],
  [[9.6,4.2],[11.0,5.8],[11.8,7.8],[11.6,9.2],1.5,.2],
  [[8.0,4.6],[9.0,6.4],[9.2,8.2],[8.6,9.4],1.4,.2]
 ].forEach(q=>{h.begin();lock(q[0],q[1],q[2],q[3],q[4],q[5],HW,.9);h.end(1,olWs)});
 h.begin();lock([7.4,7.6],[6.8,9.4],[6.8,11.2],[7.4,12.6],1.1,.2,HW,.9);h.end(1,olW);
 earring(8.4,11.6);
 return h.frame()}

function hairB(){
 h.newFrame();
 h.begin();
 mass(10,8.4,8.2,6.8,HWB);
 mass(10,6.0,8.5,5.0,HW);
 lock([8.6,4.6],[8.4,2.4],[9.6,.4],[11.4,-1.8],2.8,.14,HW,.8);
 lock([11.0,4.4],[12.4,2.4],[14.4,1.2],[16.8,1.0],2.6,.14,HW,.8);
 lock([6.6,4.8],[5.2,3.0],[3.4,2.2],[1.4,2.6],2.5,.14,HW,.8);
 lock([13.2,5.0],[15.0,3.8],[17.0,3.6],[19.0,4.6],2.4,.14,HW,.8);
 lock([5.0,6.6],[3.2,6.4],[1.4,7.0],[-.2,8.2],2.3,.14,HW,.85);
 lock([15.0,6.6],[16.8,6.4],[18.6,7.0],[20.2,8.2],2.3,.14,HW,.85);
 lock([4.4,9.8],[3.0,11.2],[2.8,13.0],[3.6,14.4],1.9,.16,HWB,.9);
 lock([15.6,9.8],[17.0,11.2],[17.2,13.0],[16.4,14.4],1.9,.16,HWB,.9);
 h.end(1,olW);
 h.begin();
 lock([10,6.4],[9.6,9],[9.8,11.4],[10.2,13.4],.5,.14,HWB,1);
 lock([7.4,7.2],[6.6,9.4],[6.6,11.6],[7.2,13.2],.5,.14,HWB,1);
 lock([12.6,7.2],[13.4,9.4],[13.4,11.6],[12.8,13.2],.5,.14,HWB,1);
 h.end(0);
 return h.frame()}

// ---------- 6) cache + vẽ xuống canvas game ----------
const CB={},CH={};
const bobOf=o=>{if(o.nobob)return 0;const f=o.mv?Math.floor(o.a*9)%4:0;return o.mv?((f==1||f==3)?-1:0):0};
const flipD=D=>{const W=h.W,H=h.H;for(let y=0;y<H;y++)for(let x=0;x<W>>1;x++){const a=(y*W+x)*4,b=(y*W+(W-1-x))*4;for(let k=0;k<4;k++){const t=D[a+k];D[a+k]=D[b+k];D[b+k]=t}}return D};
const getBody=st=>{const key=[st.view,st.flip?1:0,st.lg,st.sit?1:0,st.rd?1:0,st.noarm?1:0,st.aupL,st.aupR].join('|');
 let c=CB[key];if(!c){let D=buildBody(st);if(st.flip)D=flipD(D);c=CB[key]=h.toCanvas(D)}return c};
const getHair=(view,flip)=>{const key=view+'|'+(flip?1:0);
 let c=CH[key];if(!c){let D=view=='s'?hairS():view=='b'?hairB():hairF();if(flip)D=flipD(D);c=CH[key]=h.toCanvas(D)}return c};

SETFX.boyboy=(u,o,S,K)=>{
 const g=BBC.g;if(!g)return;
 const side=K.side,Rt=K.Rt,back=K.back,lg=K.lg>0?1:K.lg<0?-1:0;
 const st={view:side?'s':back?'b':'f',flip:side&&!Rt,lg,sit:!!K.sit,rd:!!K.rd,noarm:!!(o.noarm&&side),
  aupL:o.aup&&o.aup[0]!=null?o.aup[0]:null,aupR:o.aup&&o.aup[1]!=null?o.aup[1]:null};
 h.drawTo(g,getBody(st),BBC.ox,BBC.oy+bobOf(o));
};
HAIRFX.boyboy=(u,o,K)=>{
 const g=BBC.g;if(!g)return;
 const side=K.side,Rt=K.Rt,back=K.back;
 h.drawTo(g,getHair(side?'s':back?'b':'f',side&&!Rt),BBC.ox,BBC.oy+bobOf(o));
};

window.__BOYBOY={getBody,getHair,h};
})();
