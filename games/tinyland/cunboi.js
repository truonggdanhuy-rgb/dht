/* =====================================================================
   TINYLAND — PET MỚI: 🐶 CÚN BƠI LỘI — 🪙 10.000 Xu, bán ở Shop Phố xá → tab 🐾 Pet
   • Là pet THƯỜNG đi theo trên đất như Mèo, Thỏ... (không cần vào vùng nước).
   • Điểm riêng: cún đeo phao vịt vàng + kính bơi, đứng trên một vũng nước nhỏ dưới chân.
     – Bạn ĐỨNG yên: cún nổi lềnh bềnh, gợn sóng nhẹ, vẫy đuôi.
     – Bạn ĐI: cún quạt chân "bơi chó" theo bạn, sóng tỏa ra phía sau, lè lưỡi.
   • Nhìn được 4 hướng (trước, sau, trái, phải).
   Nạp ở index.html SAU pho-map.js:  <script src="cunboi.js"></script>
   File tự đăng ký vào PETS (thêm ở CUỐI nên không lệch số thứ tự). Giá 10000 Xu nằm trong pho-map.js: SHOP.p.pr (phần tử số 12).
   Muốn đổi giá: sửa số 10000 ở cuối mảng pr của tab Pet trong pho-map.js.
   ===================================================================== */
(function(){
'use strict';
if(typeof PETS==='undefined'||typeof E==='undefined'){console.warn('[cunboi] Không tìm thấy PETS — bỏ qua.');return}
if(PETS.some(p=>p.k==='dogswim'))return;

// bảng màu
const FUR='#f2c27a',FURL='#fde6b8',FURD='#c98f48',EAR='#a8682c',NOSE='#3a2418',TNG='#ff7a96',
      LENS='#59c8ff',LENSL='#d6f3ff',FRM='#ffffff',STR='#2a6fb0',
      RG='#ffd23a',RGL='#fff6d0',RGD='#e8a21a',
      W1='rgba(110,190,235,.78)',W2='rgba(205,236,255,.9)',W3='rgba(70,150,215,.8)';

function drawPetDogSwim(g,x,y,d,mv,a,t){
 const side=d>1,mir=d==2,back=d==1;
 const R=(c,a2,b2,w,h)=>{g.fillStyle=c;g.fillRect(x+(mir?-a2-w:a2),y+b2,w,h)};
 const RAW=(c,a2,b2,w,h)=>{g.fillStyle=c;g.fillRect(x+a2,y+b2,w,h)};          // không lật (sóng nước)
 const EE=(c,cx,cy,rx,ry)=>E((c2,a2,b2,w,h)=>{g.fillStyle=c2;g.fillRect(a2,b2,w,h)},c,cx,cy,rx,ry);
 const sp=mv?9:2.6,ph=t*sp,f=mv?Math.floor(a*9)%4:0,
       bob=Math.round(Math.sin(ph)*(mv?.9:.7)),                                // nhấp nhô trên mặt nước
       pad=Math.sin(ph*1.6),pad2=Math.sin(ph*1.6+Math.PI),                      // quạt chân
       wag=Math.round(Math.sin(t*(mv?14:6))),bl=Math.sin(t*1.9)>.965;

 // ---------- vũng nước dưới chân + sóng gợn ----------
 const rp=(t*(mv?1.6:.7))%1;
 EE(W3,x,y,10,3.4);EE(W1,x,y-1,9,2.8);EE(W2,x-3,y-2,3,1);
 const ring=(k)=>{const q=(rp+k)%1,rx=Math.round(5+q*6),ry=Math.max(1,Math.round(1+q*2.2));
  g.save();g.globalAlpha=Math.max(0,.85*(1-q));g.fillStyle='#ffffff';
  const n=rx*3;for(let i=0;i<n;i++){const an=i/n*Math.PI*2;g.fillRect(Math.round(x+Math.cos(an)*rx),Math.round(y-1+Math.sin(an)*ry),1,1)}g.restore()};
 ring(0);ring(.5);
 // vệt sóng phía sau khi đang bơi (chỉ khi nhìn ngang)
 if(mv&&side){const dx=mir?1:-1;
  for(let i=1;i<=3;i++){const o=Math.round((t*6+i*1.7)%3);RAW('rgba(255,255,255,'+(.8-i*.2).toFixed(2)+')',dx*(8+i*3+o)-(dx>0?0:2),-1+(i%2?0:1),3,1)}}

 const by=bob;                                                                 // độ nhô lên/xuống của cả thân
 // chân quạt dưới nước (vẽ trước, nằm dưới phao)
 const paw=(a2,b2,lift)=>{R(FURD,a2,-3+b2-lift+by,2,2);R(FURL,a2,-3+b2-lift+by,2,1)};

 if(side){
  // ===== NHÌN NGANG (hướng phải; mir = trái) =====
  paw(-4,0,pad>0?1:0);paw(0,0,pad2>0?1:0);paw(3,0,pad2>0?1:0);paw(-6,0,pad>0?1:0);
  // đuôi vẫy
  R(FUR,-8,-9+by,2,2);R(FUR,-9,-11+by+(wag>0?0:1),1,3);R(FURL,-9,-12+by+(wag>0?0:1),1,1);
  // thân
  R(FUR,-6,-8+by,10,5);R(FURL,-5,-8+by,8,1);R(FURD,-6,-4+by,10,1);R(FURL,-2,-5+by,5,1);
  R(FURD,-5,-7+by,2,2);                                                          // đốm lông
  // đầu
  R(FUR,2,-13+by,6,6);R(FURL,3,-13+by,4,1);R(FURL,6,-9+by,3,3);R(FUR,8,-9+by,1,2);// mõm
  R(NOSE,9,-9+by,1,2);R(FURD,6,-7+by,3,1);
  R(EAR,2,-12+by,2,5+(mv&&f%2?1:0));R(EAR,1,-11+by,1,3);                         // tai cụp, rung khi bơi
  R(bl?FURD:NOSE,6,-11+by,1,1);R(FRM,6,-12+by,1,1);                              // mắt
  if(mv){R(TNG,7,-6+by,1,2);R('#d9506f',7,-5+by,1,1)}                            // lè lưỡi
  // kính bơi đẩy lên trán
  R(STR,2,-13+by,6,1);R(FRM,3,-14+by,3,2);R(LENS,4,-14+by,2,1);R(LENSL,4,-14+by,1,1);R(STR,3,-12+by,1,1);
  // phao vịt vàng quanh bụng (phía trước)
  R(RGD,-7,-4+by,13,3);R(RG,-7,-4+by,13,2);R(RGL,-5,-4+by,2,1);R(RGL,0,-4+by,2,1);R(RGL,4,-4+by,2,1);R(RGD,-7,-2+by,13,1);
  // đầu vịt nhỏ trên phao
  R(RG,5,-6+by,3,3);R('#ff9a2a',8,-5+by,2,1);R(NOSE,6,-5+by,1,1);R(RGL,5,-6+by,1,1)
 }else if(back){
  // ===== NHÌN SAU =====
  paw(-6,0,pad>0?1:0);paw(3,0,pad2>0?1:0);
  R(FUR,-5,-9+by,10,6);R(FURD,-5,-4+by,10,1);R(FURL,-4,-9+by,6,1);
  R(FUR,-3,-14+by,6,6);R(FURL,-2,-14+by,3,1);R(EAR,-4,-13+by,2,5);R(EAR,2,-13+by,2,5);
  R(STR,-3,-11+by,6,1);                                                          // dây kính sau gáy
  R(FUR,-1,-12+by+(wag>0?0:1),2,0);R(FURD,0,-8+by,1,3);R(FUR,-1,-11+by+(wag>0?-1:0),2,2);R(FURL,-1,-12+by+(wag>0?-1:0),1,1);   // đuôi vẫy giữa lưng
  R(RGD,-7,-4+by,14,3);R(RG,-7,-4+by,14,2);R(RGL,-5,-4+by,2,1);R(RGL,-1,-4+by,2,1);R(RGL,3,-4+by,2,1);R(RGD,-7,-2+by,14,1)
 }else{
  // ===== NHÌN TRƯỚC =====
  paw(-6,0,pad>0?1:0);paw(4,0,pad2>0?1:0);paw(-3,1,pad2>0?1:0);paw(1,1,pad>0?1:0);
  R(FUR,-5,-9+by,10,6);R(FURL,-3,-8+by,6,4);R(FURD,-5,-4+by,10,1);
  R(FUR,-4,-14+by,8,7);R(FURL,-3,-14+by,6,1);R(FURL,-2,-10+by,4,3);                // đầu + mõm
  R(EAR,-6,-13+by,2,6+(mv&&f%2?1:0));R(EAR,4,-13+by,2,6+(mv&&f%2?0:1));R(EAR,-7,-12+by,1,3);R(EAR,6,-12+by,1,3);
  if(bl){R(FURD,-3,-11+by,2,1);R(FURD,1,-11+by,2,1)}else{R(NOSE,-3,-11+by,2,2);R(NOSE,1,-11+by,2,2);R(FRM,-3,-11+by,1,1);R(FRM,1,-11+by,1,1)}
  R(NOSE,-1,-9+by,2,1);R(FURD,-1,-8+by,2,1);
  if(mv){R(TNG,-1,-7+by,2,2);R('#d9506f',-1,-6+by,2,1)}else R(NOSE,-1,-7+by,2,0);
  // kính bơi trên trán
  R(STR,-5,-13+by,10,1);R(FRM,-4,-15+by,3,3);R(FRM,1,-15+by,3,3);R(LENS,-3,-14+by,1,2);R(LENS,2,-14+by,1,2);R(LENSL,-3,-14+by,1,1);R(LENSL,2,-14+by,1,1);R(FRM,-1,-14+by,2,1);
  R(RGD,-7,-4+by,14,3);R(RG,-7,-4+by,14,2);R(RGL,-5,-4+by,2,1);R(RGL,-1,-4+by,2,1);R(RGL,3,-4+by,2,1);R(RGD,-7,-2+by,14,1);
  // đầu vịt trên phao (nhìn trước)
  R(RG,-6,-6+by,3,3);R('#ff9a2a',-6,-4+by,3,1);R(NOSE,-5,-5+by,1,1)
 }
 // nước phủ lên phần dưới phao + lấp lánh
 R(W1,-8,-1+by*0,16,1);
 const sx=Math.round(Math.sin(t*3.1)*5);
 if(Math.sin(t*4.2)>.6)RAW('#ffffff',sx,-3,1,1);
}

const IDX=PETS.length;
PETS.push({n:'Cún bơi lội',k:'dogswim',fn:drawPetDogSwim});
if(IDX!==12)console.warn('[cunboi] Cún bơi lội đang ở vị trí PETS số',IDX,'— hãy sửa số 10000 trong pho-map.js (SHOP.p.pr) cho khớp.');
})();
