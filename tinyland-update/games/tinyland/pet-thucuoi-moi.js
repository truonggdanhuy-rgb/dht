/* ===================================================================================
   PET-THUCUOI-MOI.JS — 3 Pet mới + 3 Thú cưỡi mới cho Tinyland
   • 3 Pet (Shop Phố xá → tab 🐾 Pet):
     1. ghostlantern : 👻 Bóng Ma Đèn Lồng (3.500 Xu) — tự tỏa sáng ấm vào ban đêm!
     2. seaturtle    : 🐢 Rùa Biển Con (2.500 Xu)
     3. minicapy     : 🍊 Capybara Mini (3.000 Xu)
   • 3 Thú cưỡi:
     1. giantcapy    : 🍊 Capybara Khổng Lồ (7.500 Xu — Shop Phố xá)
     2. rainbowcloud : 🌈 Đám Mây Cầu Vồng (💎12 — Shop Kim Cương)
     3. icecart      : 🍓 Xe Kem Dâu Mini (6.500 Xu — Shop Phố xá)
   • Nạp SAU newitems.js & boyboy.js trong index.html.
   =================================================================================== */
(function(){
'use strict';
const sin=Math.sin,cos=Math.cos,rnd=Math.round,flr=Math.floor;
const hash=n=>{const s=sin(n*127.1+311.7)*43758.5453;return s-flr(s)};
const shCol=(col,p)=>typeof shade==='function'?shade(col,p):col;
function ell(R,col,cx,cy,rx,ry){
 for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){
  const dy=(y+.5-cy)/ry;if(Math.abs(dy)>1)continue;
  const hw=rnd(rx*Math.sqrt(1-dy*dy));
  if(hw>0)R(col,rnd(cx)-hw,y,hw*2,1);
 }
}
function star(R,x,y,a,rgb,big){
 x=rnd(x);y=rnd(y);if(a<=.08)return;
 const c=al=>'rgba('+rgb+','+Math.min(1,al).toFixed(2)+')';
 if(a<.4){R(c(a+.2),x,y,1,1);return}
 R(c(a),x,y,1,1);R(c(a*.8),x-1,y,1,1);R(c(a*.8),x+1,y,1,1);R(c(a*.8),x,y-1,1,1);R(c(a*.8),x,y+1,1,1);
 if(big&&a>.72){
  R(c(a*.55),x-2,y,1,1);R(c(a*.55),x+2,y,1,1);R(c(a*.55),x,y-2,1,1);R(c(a*.55),x,y+2,1,1);
  R('rgba(255,255,255,'+Math.min(1,a).toFixed(2)+')',x,y,1,1);
 }
}

// ============================================================
//  1. 3 PET MỚI (PETS.push)
// ============================================================

// 1) BÓNG MA ĐÈN LỒNG (bay lơ lửng, tay cầm lồng đèn vàng đung đưa, phát sáng ban đêm)
function drawPetGhostLantern(g,x,y,d,mv,a,t){
 const side=d>1,mir=d==2,back=d==1;
 const R=(c,a2,b2,w,h)=>{g.fillStyle=c;g.fillRect(x+(mir?-a2-w:a2),y+b2,w,h)};
 const bob=rnd(sin(t*(mv?7.5:2.8))*1.4)-2;
 const sw=rnd(sin(t*3.8));
 const bl=sin(t*2.1)>0.96;
 const GH='#f4f6ff',GHL='#ffffff',GHD='#cdd6f2',GHO='#95a3cf',CH='#ff9ec2',EY='#2b2240',LT='#ffd447',LTG='#fff7b8',LTD='#e07a1f';

 // bóng tím mờ dưới đất (nằm nguyên ở y, không nhấp nhô theo thân)
 g.fillStyle='rgba(70,60,120,0.22)';
 g.fillRect(x-4,y+1,9,1);
 g.fillRect(x-3,y,7,1);

 const wv=flr(t*6)%2;
 // thân ma bầu bĩnh đuôi lượn sóng
 R(GHO,-4,-14+bob,8,1);
 R(GH,-5,-13+bob,10,9);
 R(GHL,-4,-13+bob,4,2);
 R(GHD,4,-12+bob,1,8);
 R(GHD,-5,-6+bob,10,2);
 // gấu áo ma lượn sóng ở đáy
 R(GH,-5,-4+bob+(wv?0:1),2,2);
 R(GH,-2,-4+bob+(wv?1:0),4,2);
 R(GH,3,-4+bob+(wv?0:1),2,2);
 R(GHD,-2,-3+bob+(wv?1:0),4,1);

 if(!side){
  if(!back){
   // mặt ma dễ thương
   if(bl){R(EY,-3,-10+bob,2,1);R(EY,1,-10+bob,2,1)}
   else{R(EY,-3,-11+bob,2,2);R(EY,1,-11+bob,2,2);R('#ffffff',-3,-11+bob,1,1);R('#ffffff',1,-11+bob,1,1)}
   R(CH,-4,-8+bob,1,1);R(CH,3,-8+bob,1,1);
   R(EY,-1,-8+bob,2,1);
   // tay phải đưa ra cầm gậy + lồng đèn vàng đung đưa
   R(GH,5,-9+bob,2,2);
   R('#8a5a30',6,-13+bob,1,6);
   R('#ffd23f',6,-14+bob,2+sw,1);
   R(LTD,7+sw,-13+bob,3,4);
   R(LT,7+sw,-12+bob,3,2);
   R(LTG,8+sw,-12+bob,1,2);
   R('#e0584a',8+sw,-9+bob,1,1);
  }else{
   // nhìn sau: nếp lưng + đốm sáng đèn ló sang phải
   R(GHD,-2,-11+bob,1,4);R(GHD,2,-10+bob,1,4);
   R(LTD,6+sw,-13+bob,2,3);R(LT,6+sw,-12+bob,2,2);
  }
 }else{
  // nhìn ngang
  R(GHL,-3,-13+bob,5,2);
  R(GHD,-5,-12+bob,2,7);
  if(bl)R(EY,2,-10+bob,2,1);
  else{R(EY,2,-11+bob,2,2);R('#ffffff',2,-11+bob,1,1)}
  R(CH,1,-8+bob,1,1);
  // tay cầm đèn phía trước
  R(GH,4,-9+bob,3,2);
  R('#8a5a30',6,-14+bob,1,7);
  R('#ffd23f',6,-14+bob,2+sw,1);
  R(LTD,7+sw,-13+bob,3,4);
  R(LT,7+sw,-12+bob,3,2);
  R(LTG,8+sw,-12+bob,1,2);
  R('#e0584a',8+sw,-9+bob,1,1);
 }

 // hạt sáng vàng bay quanh đèn
 if(sin(t*5)>0.15){
  R('rgba(255,240,140,0.85)',6+sw,-16+bob,1,1);
  R('rgba(255,230,110,0.65)',10+sw,-11+bob,1,1);
 }
}

// 2) RÙA BIỂN CON (mai xanh ngọc đốm vàng, 4 vây chèo lạch bạch)
function drawPetSeaTurtle(g,x,y,d,mv,a,t){
 const side=d>1,mir=d==2,back=d==1;
 const f=mv?flr(a*9)%4:0,lg=f==1?1:f==3?-1:0,b=mv&&(f==1||f==3)?-1:0,bl=sin(t*1.9)>0.96;
 const R=(c,a2,b2,w,h)=>{g.fillStyle=c;g.fillRect(x+(mir?-a2-w:a2),y+b2,w,h)};
 const SH='#268c5c',SHL='#48c987',SHD='#16593a',RIM='#d9b25f',
       SK='#5cd195',SKL='#92f0bd',SKD='#349666',EY='#1d1d24';

 g.fillStyle='rgba(20,85,110,0.22)';g.fillRect(x-6,y,12,2);
 if(mv&&flr(t*8)%2===0){g.fillStyle='rgba(165,235,255,0.45)';g.fillRect(x-8,y+1,3,1);g.fillRect(x+5,y+1,3,1)}

 if(side){
  // 2 vây chèo
  const s1=lg>0?1:0,s2=lg<0?1:0;
  R(SKD,-6,-2-s1,4,2);R(SK,1,-2-s2,5,2);R(SKL,2,-2-s2,2,1);
  // đuôi nhỏ sau mai
  R(SKD,-8,-4+b,2,2);
  // mai vòm + viền vàng
  R(RIM,-7,-4+b,12,2);
  R(SH,-6,-9+b,10,5);R(SHL,-4,-9+b,6,2);R(SHD,-6,-5+b,10,1);
  R(RIM,-3,-8+b,2,2);R('#ffe885',-3,-8+b,1,1);
  R(RIM,1,-7+b,2,2);
  // đầu rùa vươn ra phía trước
  R(SK,4,-7+b,6,5);R(SKL,5,-7+b,4,1);R(SKD,5,-3+b,5,1);
  if(bl)R(EY,7,-6+b,2,1);else{R(EY,7,-6+b,2,2);R('#ffffff',7,-6+b,1,1)}
  R('#ff9cb8',8,-4+b,1,1);
 }else if(back){
  R(SKD,-6,-2-(lg>0?1:0),3,2);R(SKD,3,-2-(lg<0?1:0),3,2);
  R(SKD,-1,-2+b,2,2);
  R(SH,-5,-10+b,10,7);R(SHL,-3,-10+b,6,2);R(RIM,-5,-3+b,10,1);
  R(SHD,-1,-9+b,2,6);R(RIM,-4,-8+b,2,2);R(RIM,2,-8+b,2,2);
  R(SK,-3,-13+b,6,3);R(SKD,-2,-13+b,4,1);
 }else{
  // nhìn trước: mặt tròn + mai rộng
  R(SK,-7,-2-(lg>0?1:0),4,2);R(SK,3,-2-(lg<0?1:0),4,2);
  R(SKL,-7,-2-(lg>0?1:0),2,1);R(SKL,5,-2-(lg<0?1:0),2,1);
  R(RIM,-5,-4+b,10,2);
  R(SH,-5,-10+b,10,6);R(SHL,-3,-10+b,6,2);R(RIM,-3,-9+b,2,2);R(RIM,1,-9+b,2,2);
  R(SK,-4,-9+b,8,6);R(SKL,-3,-9+b,6,1);R(SKD,-3,-4+b,6,1);
  if(bl){R(EY,-3,-7+b,2,1);R(EY,1,-7+b,2,1)}
  else{R(EY,-3,-7+b,2,2);R(EY,1,-7+b,2,2);R('#ffffff',-3,-7+b,1,1);R('#ffffff',1,-7+b,1,1)}
  R('#ff9cb8',-4,-5+b,1,1);R('#ff9cb8',3,-5+b,1,1);
  R(SKD,-1,-5+b,2,1);
 }
}

// 3) CAPYBARA MINI (bo tròn viền nâu đậm, mõm vuông tròn, mắt hí -_- & má hồng + quýt bóng)
function drawPetMiniCapy(g,x,y,d,mv,a,t){
 const side=d>1,mir=d==2,back=d==1;
 const f=mv?flr(a*9)%4:0,lg=f==1?1:f==3?-1:0,b=mv&&(f==1||f==3)?-1:0;
 const R=(c,a2,b2,w,h)=>{g.fillStyle=c;g.fillRect(x+(mir?-a2-w:a2),y+b2,w,h)};
 const OL='#5c3619',FR='#b87b48',FL='#dfa36e',FD='#845229',BL='#ebd0a6',SN='#6e4120',EY='#24140a',OR='#ff8a1f',ORL='#ffd054',ORD='#c45310',LF='#3ea84f',PK='#f299a8';

 g.fillStyle='rgba(0,0,0,0.2)';g.fillRect(x-5,y,11,2);
 const paw=(px,lift,c)=>{R(OL,px,-3-(lift?1:0),2,3);R(c,px,-3-(lift?1:0),2,2);R(FD,px,-1-(lift?1:0),2,1)};

 if(side){
  paw(-5,lg>0,FD);paw(1,lg<0,FD);
  // thân bầu tròn có viền + bụng kem
  ell(R,OL,-1,-6+b,7,4.2);ell(R,FR,-1,-6+b,6,3.4);
  R(FL,-4,-9+b,6,1);R(BL,-3,-4+b,5,1);
  paw(-4,lg<0,FR);paw(2,lg>0,FR);
  // đầu capybara đặc trưng: trán phẳng dốc ra mõm vuông to
  R(OL,0,-14+b,10,7);R(OL,7,-12+b,4,5);
  R(FR,1,-13+b,8,5);R(FL,2,-13+b,5,1);
  R(SN,6,-11+b,4,4);R(EY,9,-11+b,1,1);R(FD,7,-8+b,3,1);
  R(OL,1,-14+b,2,2);R(FD,2,-14+b,1,1); // tai tròn nằm thấp
  R(EY,5,-12+b,2,1);R(PK,4,-10+b,1,1); // mắt hí chill + má hồng
  // quả quýt cam bóng bẩy trên đầu
  R(ORD,3,-17+b,4,3);R(OR,3,-17+b,4,2);R(ORL,4,-17+b,2,1);R(LF,4,-18+b,2,1);
 }else if(back){
  paw(-4,lg>0,FR);paw(2,lg<0,FR);
  ell(R,OL,0,-6+b,6,4.2);ell(R,FR,0,-6+b,5,3.4);R(OL,-1,-5+b,2,2);
  R(OL,-5,-14+b,10,6);R(FR,-4,-13+b,8,5);R(FL,-3,-13+b,6,1);
  R(OL,-5,-14+b,2,2);R(OL,3,-14+b,2,2);
  R(ORD,-2,-17+b,4,3);R(OR,-2,-17+b,4,2);R(ORL,-1,-17+b,2,1);R(LF,-1,-18+b,2,1);
 }else{
  paw(-4,lg>0,FR);paw(2,lg<0,FR);
  ell(R,OL,0,-6+b,6,4.2);ell(R,FR,0,-6+b,5,3.4);R(BL,-3,-7+b,6,3);
  R(OL,-5,-14+b,10,7);R(FR,-4,-13+b,8,6);R(FL,-3,-13+b,6,1);
  R(OL,-5,-14+b,2,2);R(OL,3,-14+b,2,2);
  // mõm tròn nâu sẫm + mũi Y + mắt hí -_-
  R(SN,-2,-11+b,4,4);R(EY,-1,-10+b,2,1);
  R(EY,-3,-12+b,2,1);R(EY,1,-12+b,2,1);
  R(PK,-4,-10+b,1,1);R(PK,3,-10+b,1,1);
  R(ORD,-2,-17+b,4,3);R(OR,-2,-17+b,4,2);R(ORL,-1,-17+b,2,1);R(LF,-1,-18+b,2,1);
 }
}

if(typeof PETS!=='undefined'){
 const ADD_PETS=[
  {n:'Bóng ma đèn lồng',k:'ghostlantern',fly:1,xu:3500,fn:drawPetGhostLantern,ds:'Bóng ma nhỏ cầm lồng đèn vàng, tự tỏa sáng ấm vào ban đêm.'},
  {n:'Rùa biển con',k:'seaturtle',xu:2500,fn:drawPetSeaTurtle,ds:'Rùa biển con mai đốm vàng dễ thương.'},
  {n:'Capybara Mini',k:'minicapy',xu:3000,fn:drawPetMiniCapy,ds:'Capybara mini siêu chill đội quả quýt trên đầu.'}
 ];
 for(const p of ADD_PETS)if(!PETS.some(q=>q.k===p.k))PETS.push(p);
}

// ============================================================
//  2. 3 THÚ CƯỠI MỚI (MOUNTS.push)
// ============================================================

// 1) CAPYBARA KHỔNG LỒ — vẽ bo tròn có viền tối, mõm vuông tròn đặc trưng, mắt hí chill -_-, má hồng & quả quýt căng mọng; dáng ngồi nghiêng (side-saddle)
function capyLegs(R,d,ph,sx,sy,PT,SD,S,hv,c){
 const mv=!!(c&&c.mv),bob=mv&&(flr(ph)%4===1||flr(ph)%4===3)?-1:0;
 const y=sy-3+bob+hv,sw=mv?rnd(sin(ph*.9)):0;
 const PTd=shCol(PT,-.22),PTl=shCol(PT,.22),SDd=shCol(SD,-.22);
 if(d>1){
  // nhìn ngang: hai chân khép gọn buông xuôi tự nhiên bên hông yên
  R(PTd,sx-3,y+1,7,3);
  R(PT,sx-2,y,6,3);R(PTl,sx-2,y,4,1);
  R(PTd,sx-2,y+2,3,5);R(SDd,sx-2,y+7+Math.max(0,-sw),4,2);
  R(PT,sx+1,y+2,3,5);R(PTl,sx+1,y+2,1,5);
  R(SD,sx+1,y+7+Math.max(0,sw),4,2);
 }else if(d==1){
  // nhìn sau: ngồi nghiêng gọn hai chân sang bên phải thân capybara
  R(PTd,-1,y+1,7,3);R(PT,0,y+1,6,2);
  R(PTd,3,y+3,3,5);R(SDd,3,y+8,3,2);
  R(PT,6,y+3,3,5+(sw>0?1:0));R(PTl,6,y+3,1,5);R(SD,6,y+8+(sw>0?1:0),4,2);
 }else{
  // nhìn trước: ngồi nghiêng sang bên phải yên (không banh chân hai bên)
  R(PTd,-1,y+1,8,3);R(PT,2,y+1,7,3);R(PTl,3,y+1,5,1);
  R(PTd,5,y+3,3,5);R(SDd,5,y+8,3,2);
  R(PT,7,y+3,3,5+(sw>0?1:0));R(PTl,7,y+3,1,5);R(SD,7,y+8+(sw>0?1:0),4,2);
 }
}
function drawGiantCapy(R,d,f,b,t,pt,c){
 const OL='#5c3619',FR='#b87b48',FL='#dfa36e',FD='#845229',BL='#ebd0a6',
       SN='#6b3e1d',NO='#24140a',OR='#ff8a1f',ORL='#ffd054',ORD='#c45310',LF='#3ea84f',LFL='#7ce86b',PK='#f299a8';
 const lg=f==1?1:f==3?-1:0;
 const Rb=(k,x,y,w,h)=>R(k,x,y+b,w,h);
 const leg=(x,lift,k)=>{const h=8-(lift?2:0);R(OL,x-1,-8,6,h+1);R(k,x,-8,4,h);R(FD,x,-2-(lift?2:0),4,2);R(NO,x,-1-(lift?2:0),1,1);R(NO,x+2,-1-(lift?2:0),1,1)};
 const tangerine=(cx,cy,big)=>{
  const rx=big?3.8:3.4,ry=big?2.8:2.4;
  ell(Rb,ORD,cx,cy,rx+.8,ry+.7);
  ell(Rb,OR,cx,cy-.2,rx,ry);
  ell(Rb,ORL,cx-.7,cy-1,rx*.5,ry*.42);
  Rb(LF,cx-1,cy-ry-1.8,3,2);Rb(LFL,cx-1,cy-ry-1.8,1,1);Rb('#297a35',cx+1,cy-ry-1,2,1);
 };

 if(d>1){
  if(pt)return;
  leg(-10,lg<0,FD);leg(4,lg>0,FD);
  // THÂN CAPYBARA BẦU BĨNH BO TRÒN (elip kép có viền nâu đậm + bụng kem)
  ell(Rb,OL,-1,-11,15.5,6.8);
  ell(Rb,FR,-1,-11,14.5,5.8);
  ell(Rb,FL,-2,-14.5,11,2.2);
  ell(Rb,BL,-1,-7.2,10.5,2.0);
  // yên vải pastel viền kem + khóa vàng + tua rua
  Rb(OL,-7,-17,13,1);Rb('#3f8a7d',-7,-16,13,4);
  Rb('#6fc7b8',-6,-17,11,4);Rb('#d8f7ef',-5,-17,9,1);Rb('#ffd86b',-2,-15,3,1);
  leg(-13,lg>0,FR);leg(7,lg<0,FR);
  // ĐẦU CAPYBARA NGHIÊNG ĐẶC TRƯNG: trán phẳng, mõm vuông dài nặng nề, tai nhỏ phía sau
  ell(Rb,OL,15,-16.5,8.2,6.2);
  Rb(OL,16,-19,8,8); // dáng mõm vuông dài đặc trưng phía trước
  ell(Rb,FR,14.5,-16.5,7.2,5.3);
  Rb(FR,15,-18,8,6);
  Rb(FL,11,-21.5,8,1.5);
  // tai nhỏ tròn nằm lùi phía sau đầu
  Rb(OL,9,-23,3,3);Rb(FD,10,-22,2,2);
  // mõm nâu sẫm đặc trưng + mũi + miệng chữ Y + má hồng + mắt hí chill -_-
  Rb(SN,18,-18,5,6);Rb(FD,18,-13,5,1);
  Rb(NO,21,-17,2,2);Rb(NO,20,-14,1,1);Rb(NO,19,-13,2,1);
  Rb(FL,13,-20,4,1);Rb(NO,13,-19,4,1); // mí mắt ngang siêu chill
  Rb(PK,13,-16,2,1);
  tangerine(15,-25.2,1);
 }else if(d==1){
  if(pt)return;
  leg(-8,lg>0,FD);leg(4,lg<0,FD);
  ell(Rb,OL,0,-10.5,12,6.5);ell(Rb,FR,0,-10.5,11,5.5);ell(Rb,FL,0,-14.5,8.5,1.8);
  Rb(OL,-1,-10,2,3);Rb(FD,0,-10,1,2); // đuôi tí hon
  Rb(OL,-7,-17,14,4);Rb('#6fc7b8',-6,-17,12,4);Rb('#d8f7ef',-5,-17,10,1);Rb('#4fa899',-6,-14,12,1);
  ell(Rb,OL,0,-17.5,7.6,5.2);ell(Rb,FR,0,-17.5,6.6,4.3);
  Rb(OL,-8,-21,3,3);Rb(FD,-7,-20,2,2);Rb(OL,5,-21,3,3);Rb(FD,5,-20,2,2);
  tangerine(0,-24,0);
 }else{
  if(!pt){
   leg(-8,lg>0,FR);leg(4,lg<0,FR);
   ell(Rb,OL,0,-10.5,12,6.5);ell(Rb,FR,0,-10.5,11,5.5);ell(Rb,BL,0,-8.5,7.5,3.5);
   Rb(OL,-7,-17,14,3);Rb('#6fc7b8',-6,-17,12,3);Rb('#d8f7ef',-5,-17,10,1);
  }else{
   // ĐẦU CAPYBARA CHÍNH DIỆN: bo tròn viền nâu, 2 tai nhỏ xẹp 2 bên, mõm nâu sẫm hình thang rộng + mũi Y + mắt hí -_-
   Rb(OL,-8,-17,3,3);Rb(FD,-7,-16,2,2);Rb(OL,5,-17,3,3);Rb(FD,5,-16,2,2); // tai tròn nằm thấp hai bên
   ell(Rb,OL,0,-11.5,8.2,5.8);
   ell(Rb,FR,0,-11.5,7.2,4.9);
   Rb(FL,-4,-16,8,1.5);
   // mõm nâu sẫm rộng + sống mũi + miệng chữ Y đặc trưng
   ell(Rb,SN,0,-9.8,4.2,2.8);
   Rb(NO,-2,-11,1,1);Rb(NO,1,-11,1,1);Rb(NO,-1,-10,2,1);Rb(NO,0,-9,1,2);Rb(NO,-2,-8,1,1);Rb(NO,1,-8,1,1);
   // mắt hí chill ngang + mí trên sáng + má hồng tròn
   Rb(FL,-6,-14,3,1);Rb(FL,3,-14,3,1);
   Rb(NO,-6,-13,3,1);Rb(NO,3,-13,3,1);
   Rb(PK,-6,-11,2,1);Rb(PK,4,-11,2,1);
   tangerine(0,-19.5,0);
  }
 }
}

// 2) ĐÁM MÂY CẦU VỒNG (💎12 — nâng cấp toàn diện: mây bồng bềnh đa tầng viền xanh dịu + vòm cầu vồng 7 sắc rực rỡ + tua sao pha lê + mây tí hon & sao lấp lánh)
function rainbowHov(t,mv){return mv?-rnd(1.5+sin(t*6.5)*.9):-rnd(2.1+sin(t*2.2)*1.2)}
const RB7=['#ff5e7e','#ff9a3c','#ffe354','#68e889','#4ce0ff','#6e8eff','#b875ff'];
const RB_GLOW=['255,155,190','255,220,110','120,235,255','195,155,255'];

let _rbFrontSpans=null,_rbSideSpans=null;
function buildSpanCache(x0,x1,y0,y1,fn){
 const out=[];
 for(let y=y0;y<=y1;y++){
  let run=null;
  for(let x=x0;x<=x1;x++){
   const col=fn(x,y);
   if(run&&run.c===col)run.w++;
   else{if(run)out.push(run);run=col?{c:col,x,y,w:1}:null}
  }
  if(run)out.push(run);
 }
 return out;
}
function getRbFrontSpans(){
 if(_rbFrontSpans)return _rbFrontSpans;
 return _rbFrontSpans=buildSpanCache(-26,25,-48,-14,(x,y)=>{
  const dist=Math.hypot(x+.5,(y+14)*0.75);
  if(dist>=18.2&&dist<25.4)return RB7[Math.min(6,flr((25.4-dist)/7.2*7))];
  if((dist>=17.3&&dist<18.2)||(dist>=25.4&&dist<26.3))return 'rgba(255,255,255,0.28)';
  return null;
 });
}
function getRbSideSpans(){
 if(_rbSideSpans)return _rbSideSpans;
 return _rbSideSpans=buildSpanCache(-20,-4,-38,-16,(x,y)=>{
  const dist=Math.hypot(x+2,(y+16)*0.82);
  if(dist>=12&&dist<17.5)return RB7[Math.min(6,flr((17.5-dist)/5.5*7))];
  return null;
 });
}

function drawCloudCluster(P,puffs,col){
 for(const q of puffs)ell(P,col,q[0],q[1],q[2],q[3]);
}
function drawCloudTassel(P,ax,ay,len,t,idx){
 const sw=sin(t*2.3+idx*1.5);
 for(let k=0;k<len;k++){
  const x=ax+rnd(sw*(k/len)*1.3);
  P(k%2?'#cde8ff':'#ffffff',x,ay+k,1,1);
  if(k===2)P('#ffe478',x,ay+k,1,1);
 }
 const ex=ax+rnd(sw*1.3),ey=ay+len;
 P('#ffe478',ex,ey-1,1,3);P('#ffe478',ex-1,ey,3,1);P('#ffffff',ex,ey,1,1);
 P('rgba(165,225,255,0.65)',ex,ey+2,1,1);
}
function drawMiniCloud(P,cx,cy,sc){
 ell(P,'#8fb7ec',cx,cy,4*sc+1,2.2*sc+1);
 ell(P,'#8fb7ec',cx-2*sc,cy-.5*sc,2.3*sc+1,1.8*sc+1);
 ell(P,'#8fb7ec',cx+2*sc,cy-.3*sc,2.2*sc+1,1.6*sc+1);
 ell(P,'#d6eaff',cx,cy+.2*sc,4*sc,2*sc);
 ell(P,'#ffffff',cx,cy-.4*sc,3.6*sc,1.7*sc);
 ell(P,'#ffffff',cx-2*sc,cy-.7*sc,2*sc,1.4*sc);
 ell(P,'#ffffff',cx+2*sc,cy-.5*sc,1.8*sc,1.2*sc);
}

function drawRainbowCloud(R,d,f,b,t,pt,c){
 const mv=!!(c&&c.mv);
 const Rb=(col,x,y,w,h)=>R(col,x,y+b,w,h);
 const OL='#88b2ea',SH='#b9d6f8',MD='#e3f0ff',WH='#ffffff';
 const back=d==1,side=d>1;

 if(!pt){
  // 1) bóng mờ mềm dưới đất (co nhẹ theo độ cao)
  const lift=-b,k2=Math.max(.76,1-lift*.038);
  ell(R,'rgba(70,105,165,0.11)',0,1,rnd(25*k2),3);
  ell(R,'rgba(70,105,165,0.15)',0,1,rnd(17*k2),2);

  // 2) quầng hào quang cầu vồng dịu sau lưng
  ell(Rb,'rgba(180,225,255,0.10)',0,-25,25,21);

  // 3) CẦU VỒNG 7 SẮC RỰC RỠ (dùng span tối ưu tốc độ)
  if(side){
   for(let x=-27;x<=-3;x++){
    const frac=(x+27)/24;
    const curve=rnd(-17-Math.pow(1-frac,1.35)*13+sin(t*(mv?6:3.2)+x*.26)*(1-frac*.5)*1.4);
    Rb('rgba(255,255,255,0.28)',x,curve-1,1,9);
    for(let bnd=0;bnd<7;bnd++)Rb(RB7[bnd],x,curve+bnd,1,1);
   }
   const spS=getRbSideSpans();
   for(let i=0;i<spS.length;i++){const q=spS[i];Rb(q.c,q.x,q.y,q.w,1)}
  }else{
   const spF=getRbFrontSpans();
   for(let i=0;i<spF.length;i++){const q=spF[i];Rb(q.c,q.x,q.y,q.w,1)}
  }

  // 4) THÂN ĐÁM MÂY BỒNG BỀNH ĐA TẦNG (viền xanh dịu + bóng đáy + khối trắng mịn)
  const basePuffs=[
   [0,-11,15.5,5.5],[-12,-12,8.5,5],[12,-12,8.5,5],
   [-19,-14,5.5,4],[19,-14,5.5,4],
   [-7,-16,7,4.2],[0,-17,8.5,4.5],[7,-16,7,4.2]
  ];
  drawCloudCluster(Rb,basePuffs.map(p=>[p[0],p[1],p[2]+1,p[3]+1]),OL);
  drawCloudCluster(Rb,basePuffs.map(p=>[p[0],p[1]+.4,p[2],p[3]]),SH);
  drawCloudCluster(Rb,[
   [0,-12,15,4.8],[-12,-13,8,4.2],[12,-13,8,4.2],
   [-19,-14.5,5,3.4],[19,-14.5,5,3.4],
   [-7,-16,6.8,3.8],[0,-17,8,4.2],[7,-16,6.8,3.8]
  ],MD);
  drawCloudCluster(Rb,[
   [0,-13.5,12.5,3.8],[-11,-14,6.5,3.2],[11,-14,6.5,3.2],
   [-18,-15,4,2.5],[18,-15,4,2.5],
   [-6,-16.5,5.5,3],[0,-17.5,7,3.3],[6,-16.5,5.5,3]
  ],WH);

  // hai ngôi sao vàng chốt chân cầu vồng trên hai đầu mây
  if(!side){
   star(Rb,-19,-16,0.95,'255,230,115',1);
   star(Rb,19,-16,0.95,'255,230,115',1);
  }else{
   star(Rb,-15,-22,0.9,'255,230,115',1);
  }

  // mặt mây kawaii dễ thương phía dưới chân nhân vật
  if(!back){
   const fx=side?7:0;
   Rb('#ff93be',fx-5,-10,2,1);Rb('#ff93be',fx+3,-10,2,1);
   Rb('#3f5487',fx-3,-12,1,2);Rb('#3f5487',fx+2,-12,1,2);
   Rb('#ffffff',fx-3,-12,1,1);Rb('#ffffff',fx+2,-12,1,1);
   Rb('#5d74ad',fx-1,-10,2,1);
  }

  // 3 dải tua sao pha lê rủ đung đưa dưới bụng mây
  drawCloudTassel(Rb,-11,-6,4,t,0);
  drawCloudTassel(Rb,0,-5,5,t,1);
  drawCloudTassel(Rb,11,-6,4,t,2);
 }else{
  // LỚP TRƯỚC: viền mây mịn ôm quanh bàn chân + mây tí hon & sao cầu vồng lấp lánh
  ell(Rb,MD,0,-11,11,2.2);
  ell(Rb,WH,-6,-12.2,5,1.8);ell(Rb,WH,0,-11.8,6.5,2);ell(Rb,WH,6,-12.2,5,1.8);
  ell(Rb,WH,-13,-12.5,3.5,1.5);ell(Rb,WH,13,-12.5,3.5,1.5);

  // hai cụm mây tí hon trôi bồng bềnh hai bên
  const mb1=rnd(sin(t*2.4)*1.6),mb2=rnd(cos(t*2.1)*1.6);
  drawMiniCloud(Rb,-23,-23+mb1,0.9);
  drawMiniCloud(Rb,23,-21+mb2,0.85);

  // sao lấp lánh 7 sắc quanh vòm & thân mây
  for(let i=0;i<10;i++){
   const ph=(t*.45+i*.1)%1;
   const sx=rnd(-24+hash(i+3)*48+sin(t*1.8+i)*1.8);
   const sy=rnd(-14-ph*32);
   const a=(sin(t*4.5+i*2.1)+1)/2;
   if(a>.18)star(Rb,sx,sy,a,RB_GLOW[i%4],i%3===0);
  }
 }
}

// 3) XE KEM DÂU MINI (nhân vật ĐỨNG trên xe kem hồng kem sọc đỏ trắng, bánh xe quay & cây kem xoay trên mái)
function drawIceCart(R,d,f,b,t,pt,c){
 const mv=!!(c&&c.mv),ph=c&&c.ph?c.ph:0;
 const PK='#ff88b2',PKL='#ffb8d2',PKD='#cf4d7e',CR='#fff8ec',
       CH='#cfd8e3';
 const Rb=(col,x,y,w,h)=>R(col,x,y+b,w,h);
 const wheelBox=(wx)=>{
  const sp=flr(ph*0.9)%2;
  Rb('#2e2833',wx-3,-7,7,7);Rb('#484052',wx-2,-6,5,5);
  Rb(CH,wx-1,-5,3,3);
  Rb('#ffffff',sp?wx-2:wx,sp?-4:-6,1,1);
 };

 if(d>1){
  if(!pt){
   R('rgba(65,25,40,0.18)',-18,0,36,2);
   Rb(CH,-17,-20,2,8);Rb('#f05d7e',-19,-21,4,2);
   Rb(CR,-14,-14,28,4);Rb(PKL,-14,-15,28,2);
  }else{
   Rb(PK,-14,-12,28,8);
   for(let x=-12;x<14;x+=4)Rb(CR,x,-12,2,7);
   Rb(PKD,-14,-5,28,2);Rb(CR,-15,-13,30,2);
   Rb('#f2b66d',10,-19,4,5);Rb('#d98d3a',11,-15,2,2);
   Rb('#ff6fa8',9,-24,6,5);Rb('#ffadd0',10,-24,3,2);Rb('#e63950',11,-26,2,2);
   wheelBox(-9);wheelBox(9);
   if(mv&&flr(t*8)%2===0)Rb('rgba(255,205,225,0.75)',-20,-6,2,2);
  }
 }else if(d==1){
  if(!pt){
   Rb(CH,-10,-20,2,8);Rb(CH,8,-20,2,8);Rb(PK,-10,-21,20,2);
   Rb(CR,-12,-14,24,4);
  }else{
   Rb(PK,-12,-12,24,8);
   for(let x=-10;x<12;x+=4)Rb(CR,x,-12,2,7);
   Rb(PKD,-12,-5,24,2);
   Rb('#2e2833',-13,-7,3,7);Rb('#2e2833',10,-7,3,7);
  }
 }else{
  if(!pt){
   Rb(CR,-12,-14,24,4);Rb(PKL,-12,-15,24,2);
  }else{
   Rb(PK,-12,-12,24,8);
   for(let x=-10;x<12;x+=4)Rb(CR,x,-12,2,7);
   Rb(PKD,-12,-5,24,2);Rb(CR,-13,-13,26,2);
   Rb('#f2b66d',-2,-10,4,4);Rb('#ff6fa8',-3,-13,6,3);Rb('#fff0f5',-1,-14,2,1);
   Rb('#2e2833',-13,-7,3,7);Rb('#2e2833',10,-7,3,7);
  }
 }
}

if(typeof MOUNTS!=='undefined'){
 const ADD_MOUNTS=[
  {n:'Capybara Khổng Lồ',k:'giantcapy',xu:7500,hw:9,drop:5,spd:2.2,seat:{0:[0,-15],1:[0,-15],side:[0,-15]},
   legs(R,d,ph,sx,sy,PT,SD,S,hv,c){capyLegs(R,d,ph,sx,sy,PT,SD,S,hv,c)},
   draw(R,d,f,b,t,pt,c){drawGiantCapy(R,d,f,b,t,pt,c)}},
  {n:'Đám Mây Cầu Vồng',k:'rainbowcloud',stand:1,dia:12,hw:12,drop:0,spd:2.6,nobob:1,acc:1,sh:[0,0],seat:{0:[0,-19],1:[0,-19],side:[0,-19]},
   legs(){},hov:(t,mv)=>rainbowHov(t,mv),
   draw(R,d,f,b,t,pt,c){drawRainbowCloud(R,d,f,b,t,pt,c)}},
  {n:'Xe Kem Dâu Mini',k:'icecart',stand:1,xu:6500,hw:13,drop:0,spd:2.4,nobob:1,acc:1,sh:[0,0],seat:{0:[0,-18],1:[0,-18],side:[0,-18]},
   legs(){},hov:(t,mv)=>mv?-rnd(0.6+Math.abs(sin(t*9))*0.7):0,
   draw(R,d,f,b,t,pt,c){drawIceCart(R,d,f,b,t,pt,c)}}
 ];
 for(const m of ADD_MOUNTS)if(!MOUNTS.some(q=>q.k===m.k))MOUNTS.push(m);
}
})();
