/* ===================================================================================
   THOITRANG-MOI.JS — 4A..4E Thời Trang & Mascot ĐỘ PHÂN GIẢI CAO (K=4, hdkit.js)
   • 4A: Set Học Viện Phép Thuật (Nam/Nữ) + Tóc Học Viện Phép Thuật (Nam/Nữ)
   • 4B: Set Đầu Bếp Bánh Ngọt (Nam/Nữ) + Mũ Đầu Bếp Bánh Kem
   • 4C: Set Cổ Phong Áo Lụa (Nam/Nữ) + Tóc Cổ Phong Cài Trâm (Nam/Nữ)
   • 4D: Mascot Ong Mật Mũm Mĩm (MASCOT_DRAW.beebuz)
   • 4E: Mascot Gấu Trúc Trà Chanh (MASCOT_DRAW.pandatea)
   =================================================================================== */
(function(){
'use strict';
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined'||typeof HD!=='function')return;

const TMC={g:null,ox:0,oy:0};
if(typeof window.drawAv==='function'&&!window.drawAv.__tm){
 const old=window.drawAv;
 window.drawAv=function(g,ox,oy,o){
  const pg=TMC.g,px=TMC.ox,py=TMC.oy;TMC.g=g;TMC.ox=ox;TMC.oy=oy;
  try{return old.apply(this,arguments)}finally{TMC.g=pg;TMC.ox=px;TMC.oy=py}
 };
 window.drawAv.__tm=1;
}

const h=HD({K:4,MX:12,MY:12,WU:44,HU:52});
const SK='#f1c08a',SKS='#d99e6a',SKL='#fad6ae';
const gtBob=()=>Math.floor(performance.now()/210)%2?-1:0;
const bobOf=o=>{
 if(o.nobob)return 0;
 const f=o.mv?Math.floor(o.a*9)%4:0;
 if(o.mv)return(f===1||f===3)?-1:0;
 const gtr=o.acc>=0&&!o.ride&&o.sit!==2&&typeof ACCS!=='undefined'&&ACCS[o.acc]&&ACCS[o.acc].k==='guitar';
 return gtr?gtBob():0;
};
const flipD=D=>{
 const W=h.W,H=h.H;
 for(let y=0;y<H;y++)for(let x=0;x<(W>>1);x++){
  const a=(y*W+x)*4,b=(y*W+(W-1-x))*4;
  for(let k=0;k<4;k++){const t=D[a+k];D[a+k]=D[b+k];D[b+k]=t}
 }
 return D;
};
const lock=(a,b,c,d,r0,r1,pal,pw)=>h.stroke(h.bez(a,b,c,d),r0,r1,h.shade(pal),pw||1);
const lockM=(a,b,c,d,r0,r1,pal,pw)=>{lock(a,b,c,d,r0,r1,pal,pw);lock(h.mirP(a),h.mirP(b),h.mirP(c),h.mirP(d),r0,r1,pal,pw)};
const mass=(cx,cy,rx,ry,pal)=>h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>pal[dy<-.42?3:dy<.12?2:(dy<.62&&dx<.55)?1:0]||pal[pal.length-1]);
const mkSt=(o,K)=>{
 const side=K.side,Rt=K.Rt,back=K.back,lg=K.lg>0?1:K.lg<0?-1:0;
 return{view:side?'s':back?'b':'f',flip:side&&!Rt,lg,sit:!!K.sit,rd:!!K.rd,noarm:!!(o.noarm&&side),
  aupL:o.aup&&o.aup[0]!=null?o.aup[0]:null,aupR:o.aup&&o.aup[1]!=null?o.aup[1]:null};
};

// Vẽ tay nâng / xuôi theo K=4 (che kín tay gốc của drawAv ở mọi tư thế)
function drawArmStd(x,ay,hi,coatPal,cuffCol,handCol){
 if(hi!=null){
  const ty=17-hi,hx=x+(x<10?-0.7:0.7);
  h.begin();h.ell(hx+1.5,ty+1.3,1.6,1.3,handCol||SK);h.end(1,h.olSoft);
  h.begin();h.rrect(x-.2,ty+2.5,3.5,5.2,1.2,ux=>ux<x+1?coatPal[3]:ux>x+2.3?coatPal[0]:coatPal[1]);
  if(cuffCol)h.rect(x-.2,ty+2.5,3.5,.9,cuffCol);
  h.end(2);return;
 }
 const top=15.5+ay;
 h.begin();h.ell(x+1.5,top+7.6,1.35,1.05,handCol||SK);h.end(1,h.olSoft);
 h.begin();h.rrect(x-.2,top,3.6,6.8,1.3,ux=>ux<x+1?coatPal[3]:ux>x+2.3?coatPal[0]:coatPal[1]);
 if(cuffCol)h.rect(x-.2,top+5.6,3.6,1.1,cuffCol);
 h.end(2);
}
function drawLegStd(x0,lift,pantPal,shoePal,sockCol,extraH){
 const eh=extraH||0;
 h.begin();
 if(sockCol){
  h.rrect(x0,23.6,3.9,2.6,.4,sockCol);
  h.rrect(x0+.05,25.6,3.8,2.8-lift+eh,.4,sockCol);
 }else{
  h.rrect(x0,23.6,3.9,5.0-lift+eh,.5,ux=>ux<x0+1.1?pantPal[2]:ux>x0+2.7?pantPal[0]:pantPal[1]);
 }
 h.end(2);
 const y=27.6-lift+eh;
 h.begin();h.rrect(x0-.35,y,4.6,2.9,.8,(ux,uy)=>uy>y+2.0?shoePal[0]:ux<x0+1.2?shoePal[3]:shoePal[1]);
 h.rect(x0-.35,y+2.2,4.6,.7,shoePal[0]);
 h.end(2);
}
// Vẽ chân khớp chuẩn vị trí chân drawAv ở cả đứng/đi/ngồi/nhìn ngang (che kín chân gốc 100%)
function drawLegsMatched(st,pantPal,shoePal,sockCol){
 if(st.rd)return;
 const side=st.view==='s',lg=st.lg;
 const L=(x,l,eh)=>drawLegStd(x,l,pantPal,shoePal,sockCol,eh);
 if(st.sit){
  L(5.5,0,1.1);L(10.6,0,1.1);
 }else if(!side){
  if(lg>0){L(10.6,0);L(5.5,1)}else if(lg<0){L(5.5,0);L(10.6,1)}else{L(5.5,0);L(10.6,0)}
 }else{
  const sx=lg*2;
  if(lg>0){L(9.6-sx,0);L(7.6+sx,1)}else if(lg<0){L(7.6+sx,0);L(9.6-sx,1)}else{L(7.6,0);L(9.6,0)}
 }
}

// ============================================================
//  4A. HỌC VIỆN PHÉP THUẬT (magicm / magicf + magichm / magichf)
// ============================================================
const MNV=['#181c3a','#262d59','#3a4580','#5b69b0'];
const MCR=['#6e1628','#a8243b','#d63e58','#ff7a8e'];
const MGD=['#9e6d12','#d9a026','#ffd447','#fff4a3'];
const MSH=['#0e0f1c','#1e2036','#2f3352','#4b5178'];
const MHR=['#1d1533','#322554','#4f3d82','#7a63bd'];
const MHB=['#140e24','#241b3d','#3c2e66','#58468c'];

function buildMagicBody(st,fem){
 h.newFrame();
 const side=st.view==='s',back=st.view==='b',lg=st.lg;
 if(!st.rd){
  if(back){
   h.begin();h.poly([[4.6,15],[15.4,15],[17.2,27.8],[2.8,27.8]],ux=>ux<7?MNV[2]:ux>13?MNV[0]:MNV[1]);
   h.rect(3.0,26.6,14.0,1.1,MGD[2]);h.end(2);
  }else if(side){
   h.begin();h.poly([[7.4,15.2],[12.8,15.2],[12.2,27.2],[4.6,27.2]],MNV[0]);
   h.rect(4.7,26.2,7.5,.9,MGD[2]);h.end(1);
  }
  drawLegsMatched(st,MSH,MSH,fem?'#f5ede6':null);
 }
 if(!side){
  h.begin();
  h.rrect(4.4,14.6,11.2,9.8,1.8,ux=>ux<6.6?MNV[2]:ux>13.4?MNV[0]:MNV[1]);
  if(!back){
   h.poly([[7.8,14.8],[12.2,14.8],[10,20.8]],'#f6f5fc');
   h.poly([[9.3,15.4],[10.7,15.4],[10.9,20.2],[10,21.2],[9.1,20.2]],(ux,uy)=>((uy*2|0)%2===0?MCR[2]:MGD[2]));
   h.rect(4.4,21.5,11.2,1.1,MCR[1]);h.rrect(9.1,21.2,1.8,1.7,.4,MGD[2]);
   h.ell(12.8,18.2,.85,.85,MGD[2]);
  }
  h.end(2);
  if(fem&&!st.rd){
   h.begin();h.poly([[4.6,22.2],[15.4,22.2],[16.6,26.6],[3.4,26.6]],(ux)=>((Math.floor(ux*1.4)%2)?MNV[1]:MNV[2]));
   h.rect(3.6,25.6,12.8,.85,MGD[2]);h.end(2);
  }
  h.begin();h.rrect(3.8,14.2,12.4,3.1,1.0,ux=>ux<7?MCR[2]:ux>13?MCR[0]:MCR[1]);
  h.rect(4.0,16.5,12.0,.6,MGD[2]);h.end(1);
  drawArmStd(2.0,lg,st.aupL,MNV,MGD[2]);
  drawArmStd(14.7,-lg,st.aupR,MNV,MGD[2]);
 }else{
  h.begin();h.rrect(6.4,14.6,7.8,9.8,1.8,ux=>ux<8?MNV[2]:MNV[1]);
  h.rrect(11.4,15.0,2.4,5.0,.4,'#f6f5fc');h.rect(12.2,15.4,1.2,4.6,MCR[2]);
  h.rect(6.4,21.5,7.8,1.1,MCR[1]);h.end(2);
  if(fem&&!st.rd){
   h.begin();h.poly([[6.4,22.2],[13.8,22.2],[14.8,26.6],[5.4,26.6]],MNV[1]);
   h.rect(5.5,25.6,9.2,.8,MGD[2]);h.end(2);
  }
  h.begin();h.rrect(6.2,14.2,8.2,2.9,1.0,MCR[1]);h.rect(6.4,16.4,7.8,.6,MGD[2]);h.end(1);
  if(!st.noarm)drawArmStd(8.2-lg*2,0,null,MNV,MGD[2]);
 }
 return h.frame();
}

function buildMagicHair(view,fem){
 h.newFrame();
 // Mũ phù thủy đỉnh cong gọn (y >= -0.8) để hiển thị trọn vẹn không bị xén cạnh trên trong ô Shop & Túi!
 const drawWitchHat=(cx0)=>{
  h.begin();
  h.ell(cx0,5.8,8.4,1.9,(ux,uy,dx,dy)=>dy<-.2?MNV[2]:dy>.4?MNV[0]:MNV[1]);
  h.poly([[cx0-5.2,5.4],[cx0+5.2,5.4],[cx0+2.5,.2],[cx0-1.2,-.8],[cx0-2.6,1.0]],(ux)=>ux<cx0-1?MNV[2]:ux>cx0+2?MNV[0]:MNV[1]);
  h.rrect(cx0-4.4,4.2,8.8,1.3,.4,MGD[2]);
  h.ell(cx0-1.6,4.8,.85,.85,MCR[2]);
  h.end(2);
 };
 if(view==='f'){
  if(fem){
   h.begin();
   mass(10,10.5,7.4,6.4,MHB);
   lockM([4.6,8.2],[3.4,13.0],[3.2,18.2],[4.2,22.6],2.1,.5,MHB,.9);
   h.end(1);
  }
  h.begin();
  mass(10,6.9,6.4,4.0,MHR);
  lock([10,5.5],[8.4,7.3],[7.2,9.2],[6.4,10.4],1.8,.25,MHR,.9);
  lock([10,5.5],[11.6,7.3],[12.8,9.2],[13.6,10.4],1.8,.25,MHR,.9);
  lock([10,5.2],[10.2,7.3],[10.0,9.0],[9.6,10.0],1.2,.2,MHR,.9);
  if(fem){lockM([5.8,8.4],[5.2,11.6],[5.6,14.8],[6.4,17.2],1.3,.3,MHR,.9)}
  else{lockM([5.6,7.8],[5.1,9.6],[5.2,11.4],[5.8,12.6],1.0,.2,MHR,.9)}
  h.end(1);
  drawWitchHat(10);
 }else if(view==='s'){
  h.begin();
  mass(9.4,7.2,6.0,4.0,MHR);
  if(fem){lock([6.2,7.6],[4.2,12.2],[3.6,17.6],[4.4,22.2],2.3,.6,MHR,.9)}
  else{lock([6.2,7.8],[4.8,10.0],[5.0,12.4],[6.0,13.8],1.7,.3,MHR,.9)}
  lock([10.4,5.6],[12.2,7.0],[13.4,8.6],[13.6,10.0],1.4,.25,MHR,.9);
  h.end(1);
  h.begin();
  h.ell(10.0,5.8,8.0,1.8,MNV[1]);
  h.poly([[5.0,5.4],[14.8,5.4],[10.4,.2],[6.8,-.8],[6.0,1.2]],(ux)=>ux<9?MNV[2]:MNV[1]);
  h.rrect(5.8,4.2,8.4,1.2,.4,MGD[2]);
  h.end(2);
 }else{
  h.begin();
  if(fem){
   mass(10,12.2,7.2,8.6,MHB);
   lockM([5.2,10.4],[4.6,15.6],[5.2,20.0],[6.4,23.2],2.2,.5,MHR,.9);
  }else{
   mass(10,8.8,6.2,5.2,MHR);
  }
  h.end(1);
  drawWitchHat(10);
 }
 return h.frame();
}

// ============================================================
//  4B. ĐẦU BẾP BÁNH NGỌT (pastrym / pastryf + pastryh)
// ============================================================
const PCR=['#d9c5b2','#f2e7dc','#fffaf5','#ffffff'];
const PPK=['#bf4b6f','#f2749a','#ff9ec0','#ffcce0'];
const PCK=['#4a281a','#73412c','#9c5d42','#c27e60'];
const PHR=['#522e1a','#804b2d','#ad6b44','#d49268'];

function buildPastryBody(st,fem){
 h.newFrame();
 const side=st.view==='s',back=st.view==='b',lg=st.lg;
 drawLegsMatched(st,PCK,PPK,fem?'#ffffff':null);
 if(!side){
  h.begin();h.rrect(4.6,14.6,10.8,9.2,1.8,ux=>ux<6.5?PCR[3]:ux>13.5?PCR[1]:PCR[2]);
  if(!back){
   h.rrect(7.6,14.8,4.8,2.2,.6,PPK[2]);
   h.rrect(5.4,19.4,9.2,5.6,.8,PPK[2]);
   h.rect(5.4,24.1,9.2,1.0,PCR[3]);
   for(const by of[17.2,18.7]){h.ell(8.2,by,.45,.45,PPK[1]);h.ell(11.8,by,.45,.45,PPK[1])}
   h.rrect(8.4,20.8,3.2,2.2,.5,PCR[3]);h.ell(10,21.5,.6,.6,'#ff4d6d');
  }else{
   h.rect(5.4,20.2,9.2,1.3,PPK[1]);h.rrect(8.6,19.6,2.8,2.4,.5,PPK[2]);
  }
  h.end(2);
  if(fem&&!st.rd){
   h.begin();h.poly([[4.8,22.8],[15.2,22.8],[16.4,26.6],[3.6,26.6]],PPK[2]);
   h.rect(3.8,25.7,12.4,.8,PCR[3]);h.end(2);
  }
  drawArmStd(2.0,lg,st.aupL,PCR,PPK[2]);
  drawArmStd(14.7,-lg,st.aupR,PCR,PPK[2]);
 }else{
  h.begin();h.rrect(6.5,14.6,7.6,9.2,1.6,PCR[2]);
  h.rrect(11.0,15.0,2.7,2.0,.4,PPK[2]);
  h.rrect(7.0,19.4,6.4,5.4,.6,PPK[2]);
  h.end(2);
  if(fem&&!st.rd){
   h.begin();h.poly([[6.5,22.8],[13.7,22.8],[14.6,26.6],[5.6,26.6]],PPK[2]);
   h.rect(5.7,25.7,8.8,.8,PCR[3]);h.end(2);
  }
  if(!st.noarm)drawArmStd(8.2-lg*2,0,null,PCR,PPK[2]);
 }
 return h.frame();
}

function buildPastryHair(view){
 h.newFrame();
 // Mũ đầu bếp bánh kem + dâu đỏ nằm gọn trong khung Shop & Túi (y >= -0.7)
 const drawChefCap=(cx0,w)=>{
  h.begin();
  h.rrect(cx0-w/2,4.6,w,2.6,.7,PPK[2]);h.rect(cx0-w/2+.2,4.8,w-.4,1.0,PCR[3]);
  h.ell(cx0-2.6,2.9,2.8,2.2,PCR[2]);h.ell(cx0+2.6,2.9,2.8,2.2,PCR[2]);
  h.ell(cx0,2.1,3.5,2.6,PCR[3]);
  h.ell(cx0,.2,1.35,1.2,(ux,uy)=>uy<0?'#ff8aa0':'#e6294b');
  h.poly([[cx0-1.1,-.6],[cx0,-.2],[cx0+1.1,-.6],[cx0,-.95]],'#5ac762');
  h.end(2);
 };
 if(view==='f'){
  h.begin();
  mass(10,7.5,6.2,3.6,PHR);
  lock([10,6.0],[8.2,7.5],[7.0,9.1],[6.2,10.2],1.7,.22,PHR,.9);
  lock([10,6.0],[11.8,7.5],[13.0,9.1],[13.8,10.2],1.7,.22,PHR,.9);
  lockM([5.6,8.2],[5.1,10.2],[5.4,12.2],[6.0,13.6],1.0,.2,PHR,.9);
  h.end(1);
  drawChefCap(10,9.6);
 }else if(view==='s'){
  h.begin();
  mass(9.4,7.6,5.8,3.6,PHR);
  lock([6.2,8.2],[5.2,10.4],[5.6,12.6],[6.4,13.8],1.5,.25,PHR,.9);
  lock([10.4,6.0],[12.2,7.3],[13.2,8.8],[13.4,10.2],1.4,.22,PHR,.9);
  h.end(1);
  drawChefCap(9.8,8.8);
 }else{
  h.begin();mass(10,9.0,6.2,4.8,PHR);h.end(1);
  drawChefCap(10,9.6);
 }
 return h.frame();
}

// ============================================================
//  4C. CỔ PHONG ÁO LỤA (hanfum / hanfuf + hanfuhm / hanfuhf)
// ============================================================
const HJD=['#1e706e','#38a39d','#6dd6cc','#b8fff7'];
const HPK=['#b54566','#e87498','#ffa6c2','#ffd9e6'];
const HWH=['#ccd8e0','#edf4f7','#ffffff','#ffffff'];
const HGD=['#a67514','#d9a226','#ffd952','#fff6b8'];
const HBK=['#0d0e17','#1a1c2b','#2d314a','#4d5378'];

function buildHanfuBody(st,fem){
 h.newFrame();
 const side=st.view==='s',back=st.view==='b',lg=st.lg;
 const mainPal=fem?HPK:HJD,subPal=fem?HJD:HWH;
 drawLegsMatched(st,HBK,fem?HPK:HJD,null);
 if(!side){
  if(!st.rd){
   h.begin();
   h.poly([[4.6,20.2],[15.4,20.2],[16.8,28.2],[3.2,28.2]],ux=>ux<7?mainPal[2]:ux>13?mainPal[0]:mainPal[1]);
   h.poly([[7.8,20.4],[12.2,20.4],[13.4,28.2],[6.6,28.2]],subPal[2]);
   h.rect(3.4,27.2,13.2,.9,HGD[2]);
   h.end(2);
  }
  h.begin();
  h.rrect(4.4,14.5,11.2,7.2,1.6,ux=>ux<6.8?mainPal[2]:ux>13.2?mainPal[0]:mainPal[1]);
  if(!back){
   h.poly([[7.4,14.6],[12.6,14.6],[10.4,19.4]],HWH[2]);
   h.stroke(h.bez([7.4,14.6],[8.6,17.0],[9.8,18.2],[11.2,19.6]),.45,.45,()=>subPal[2]);
   h.stroke(h.bez([12.6,14.6],[11.4,16.8],[10.2,18.0],[9.2,19.2]),.45,.45,()=>mainPal[3]);
  }
  h.rrect(4.5,19.8,11.0,1.6,.4,HGD[2]);
  if(!back){
   h.rrect(9.4,20.4,1.2,4.4,.3,fem?HJD[2]:HPK[2]);
   h.ell(10,21.2,.9,.9,HJD[3]);
  }else{
   h.rrect(8.2,20.4,3.6,3.8,.5,subPal[2]);
  }
  h.end(2);
  const sArm=(x,ay,hi,isL)=>{
   if(hi!=null){drawArmStd(x,ay,hi,mainPal,HWH[2]);return}
   const top=15.0+ay;
   h.begin();h.ell(x+1.5,top+7.8,1.25,.95,SK);h.end(1,h.olSoft);
   h.begin();
   h.poly([[x-.3,top],[x+3.5,top],[x+(isL?3.6:4.2),top+7.4],[x+(isL?-1.0:0),top+6.6]],ux=>ux<x+1?mainPal[3]:mainPal[1]);
   h.rect(x-.2,top+5.8,3.8,.9,HWH[2]);
   h.end(2);
  };
  sArm(2.0,lg,st.aupL,true);
  sArm(14.7,-lg,st.aupR,false);
 }else{
  if(!st.rd){
   h.begin();h.poly([[6.2,20.2],[13.8,20.2],[15.2,28.2],[5.0,28.2]],mainPal[1]);
   h.rect(5.2,27.2,9.8,.9,HGD[2]);h.end(2);
  }
  h.begin();h.rrect(6.4,14.5,7.8,7.2,1.6,mainPal[1]);
  h.poly([[11.0,14.6],[13.6,14.6],[12.0,18.8]],HWH[2]);
  h.rrect(6.4,19.8,7.8,1.6,.4,HGD[2]);h.end(2);
  if(!st.noarm)drawArmStd(8.2-lg*2,0,null,mainPal,HWH[2]);
 }
 return h.frame();
}

function buildHanfuHair(view,fem){
 h.newFrame();
 if(view==='f'){
  if(fem){
   h.begin();mass(10,11.6,7.4,7.4,HBK);
   lockM([4.6,8.4],[3.2,13.6],[3.0,19.0],[4.0,23.6],2.1,.5,HBK,.9);h.end(1);
  }
  h.begin();
  mass(10,6.8,6.2,4.0,HBK);
  if(fem){
   h.ell(6.2,2.8,2.4,2.2,HBK[1]);h.ell(13.8,2.8,2.4,2.2,HBK[1]);
   h.rect(4.2,2.4,11.6,.7,HGD[2]);h.ell(4.0,2.7,.85,.85,HJD[2]);h.ell(16.0,2.7,.85,.85,HJD[2]);
   lock([4.0,3.2],[3.8,5.0],[3.8,6.4],[4.0,7.8],.45,.25,HPK,.9);
  }else{
   h.ell(10,2.3,2.5,2.2,HBK[1]);
   h.rrect(7.8,3.6,4.4,.9,.3,HGD[2]);
   h.rect(6.0,2.1,8.0,.6,HGD[2]);h.ell(14.0,2.4,.75,.75,HJD[3]);
  }
  lock([10,5.2],[8.4,7.0],[7.2,8.8],[6.4,10.0],1.6,.22,HBK,.9);
  lock([10,5.2],[11.6,7.0],[12.8,8.8],[13.6,10.0],1.6,.22,HBK,.9);
  lockM([5.6,8.0],[4.9,10.8],[5.1,13.6],[5.8,15.6],1.1,.2,HBK,.9);
  h.end(1);
 }else if(view==='s'){
  h.begin();
  mass(9.4,7.2,5.8,4.0,HBK);
  if(fem){
   h.ell(8.2,2.6,2.4,2.2,HBK[1]);h.rect(6.2,2.4,6.0,.6,HGD[2]);
   lock([6.0,7.6],[4.0,12.8],[3.6,18.2],[4.4,23.2],2.3,.6,HBK,.9);
  }else{
   h.ell(8.8,2.3,2.3,2.1,HBK[1]);h.rect(6.6,2.2,5.4,.6,HGD[2]);
   lock([6.0,8.0],[4.8,10.4],[5.2,12.8],[6.2,14.4],1.6,.3,HBK,.9);
  }
  lock([10.4,5.4],[12.0,6.8],[13.2,8.6],[13.4,10.0],1.3,.22,HBK,.9);
  h.end(1);
 }else{
  h.begin();
  if(fem){
   mass(10,12.6,7.2,9.0,HBK);
   h.ell(6.2,2.8,2.4,2.2,HBK[1]);h.ell(13.8,2.8,2.4,2.2,HBK[1]);
   h.rect(4.2,2.4,11.6,.7,HGD[2]);
  }else{
   mass(10,8.8,6.2,5.2,HBK);
   h.ell(10,2.3,2.5,2.2,HBK[1]);h.rect(6.0,2.1,8.0,.6,HGD[2]);
  }
  h.end(1);
 }
 return h.frame();
}

// ============================================================
//  4D. MASCOT ONG MẬT MŨM MĨM (beebuz, K=4 HD)
// ============================================================
const BEE_Y=['#c7770c','#f5a623','#ffd242','#fff199'];
const BEE_B=['#2b160a','#4a2815','#6e3f24','#8c5636'];
const BEE_W=['#99dcf7','#b8ebff','#dcf7ff','#ffffff'];

function buildBeeBody(st){
 h.newFrame();
 const side=st.view==='s',back=st.view==='b',lg=st.lg;
 if(!side&&back){
  h.begin();h.poly([[9.0,24.4],[11.0,24.4],[10,27.0]],BEE_B[0]);h.end(1);
 }
 const wings=(cx0,cy0,dir)=>{
  h.begin();
  h.ell(cx0-dir*4.2,cy0-1.0,3.8,2.5,(ux,uy)=>uy<cy0-1.8?BEE_W[3]:BEE_W[2]);
  h.ell(cx0-dir*3.2,cy0+1.8,2.6,1.8,BEE_W[1]);
  h.end(1,h.olSoft);
 };
 if(!side&&!back){wings(6.0,17.2,1);wings(14.0,17.2,-1)}
 drawLegsMatched(st,BEE_B,BEE_B,null);
 if(!side){
  h.begin();
  h.ell(10,19.8,6.6,5.8,(ux,uy)=>{
   const band=Math.floor((uy-14.2)/2.3)%2===0;
   const pal=band?BEE_Y:BEE_B;
   return ux<6.4?pal[3]:ux>13.6?pal[0]:pal[2];
  });
  h.end(2);
  h.begin();
  for(const cx0 of[6.2,8.1,10,11.9,13.8])h.ell(cx0,15.0,1.6,1.3,'#fff7de');
  h.end(1,h.olSoft);
  drawArmStd(1.6,lg,st.aupL,BEE_Y,BEE_B[1],BEE_B[2]);
  drawArmStd(15.0,-lg,st.aupR,BEE_Y,BEE_B[1],BEE_B[2]);
  if(!back&&st.aupR==null){
   h.begin();h.rect(16.6,19.2-lg,.55,4.2,'#9e5a24');h.ell(16.9,18.6-lg,1.1,1.3,BEE_Y[2]);h.end(1);
  }
  if(back){wings(6.5,17.2,1);wings(13.5,17.2,-1)}
 }else{
  h.begin();
  h.ell(10.0,19.8,5.6,5.8,(ux,uy)=>(Math.floor((uy-14.2)/2.3)%2===0)?BEE_Y[2]:BEE_B[1]);
  h.end(2);
  h.begin();h.ell(5.2,16.8,3.8,2.2,BEE_W[2]);h.ell(6.0,19.4,2.8,1.6,BEE_W[1]);h.end(1,h.olSoft);
  h.begin();for(const cx0 of[7.6,9.8,12.0])h.ell(cx0,15.0,1.6,1.2,'#fff7de');h.end(1,h.olSoft);
  if(!st.noarm)drawArmStd(8.2-lg*2,0,null,BEE_Y,BEE_B[1],BEE_B[2]);
 }
 h.begin();
 h.ell(10,8.2,7.8,6.6,(ux,uy,dx,dy)=>{
  if(uy<5.8&&Math.floor(uy*1.1)%2===0)return BEE_B[1];
  return dy<-.4?BEE_Y[3]:dy>.5?BEE_Y[0]:BEE_Y[2];
 });
 lock([7.4,2.8],[6.4,.6],[5.2,-.4],[4.0,-.3],.52,.38,BEE_B);
 lock([12.6,2.8],[13.6,.6],[14.8,-.4],[16.0,-.3],.52,.38,BEE_B);
 h.ell(3.8,-.3,1.1,1.1,BEE_Y[3]);h.ell(16.2,-.3,1.1,1.1,BEE_Y[3]);
 h.end(2);
 if(!back){
  h.begin();
  if(!side)h.ell(10,11.2,4.7,4.0,(ux,uy)=>uy<8.6?SKS:SK);
  else h.ell(11.3,11.2,3.9,4.0,(ux,uy)=>uy<8.6?SKS:SK);
  h.end(1,h.olSoft);
 }
 return h.frame();
}

// ============================================================
//  4E. MASCOT GẤU TRÚC TRÀ CHANH (pandatea, K=4 HD)
// ============================================================
const PD_W=['#cfd8e3','#edf2f7','#ffffff','#ffffff'];
const PD_B=['#12151f','#212636','#343b52','#4c5573'];
const LMN_T=['#d48a08','#ffb81c','#ffe047','#fff8a6'];
const LMN_G=['#1e662c','#2c8a3e','#4ec25a','#85eb8c'];

function buildPandaBody(st){
 h.newFrame();
 const side=st.view==='s',back=st.view==='b',lg=st.lg;
 drawLegsMatched(st,PD_B,PD_B,null);
 if(!side){
  h.begin();
  h.ell(10,19.8,6.8,5.8,(ux,uy)=>uy<16.8?PD_B[1]:ux<6.5?PD_W[3]:ux>13.5?PD_W[0]:PD_W[2]);
  h.end(2);
  if(back){
   h.begin();h.ell(10,23.2,2.0,1.8,PD_W[2]);h.end(1);
  }
  drawArmStd(1.6,lg,st.aupL,PD_B,null,PD_B[2]);
  drawArmStd(15.0,-lg,st.aupR,PD_B,null,PD_B[2]);
  if(!back){
   h.begin();
   h.poly([[7.8,18.2],[12.2,18.2],[11.6,23.8],[8.4,23.8]],(ux,uy)=>uy<19.4?'#f4fcff':LMN_T[2]);
   h.rrect(7.5,17.6,5.0,1.0,.4,'#ffffff');
   h.rect(10.6,15.3,.65,3.2,LMN_G[2]);
   h.ell(8.8,19.2,1.1,1.1,'#fff142');
   h.rect(9.8,20.2,1.1,1.0,'#ffffff');
   h.end(1);
  }
 }else{
  h.begin();h.ell(4.5,22.8,1.8,1.7,PD_W[2]);h.end(1);
  h.begin();h.ell(10.0,19.8,5.6,5.8,(ux,uy)=>uy<16.8?PD_B[1]:PD_W[2]);h.end(2);
  h.begin();
  h.poly([[12.2,18.2],[15.2,18.2],[14.6,23.4],[12.6,23.4]],(ux,uy)=>uy<19.4?'#f4fcff':LMN_T[2]);
  h.rrect(12.0,17.6,3.4,.9,.3,'#ffffff');
  h.rect(13.6,15.5,.6,2.8,LMN_G[2]);
  h.end(1);
  if(!st.noarm)drawArmStd(8.2-lg*2,0,null,PD_B,null,PD_B[2]);
 }
 h.begin();
 if(!side){
  h.ell(4.6,3.2,2.6,2.5,PD_B[1]);h.ell(4.6,3.4,1.3,1.2,'#ffadc6');
  h.ell(15.4,3.2,2.6,2.5,PD_B[1]);h.ell(15.4,3.4,1.3,1.2,'#ffadc6');
 }else{
  h.ell(7.0,3.2,2.5,2.4,PD_B[1]);h.ell(7.2,3.4,1.2,1.1,'#ffadc6');
 }
 h.end(2);
 h.begin();
 h.ell(10,8.2,7.8,6.4,(ux,uy,dx,dy)=>dy<-.35?PD_W[3]:dy>.5?PD_W[0]:PD_W[2]);
 h.poly([[12.2,3.2],[15.2,2.0],[16.0,3.4],[13.2,4.2]],LMN_G[2]);
 h.end(2);
 if(!back){
  h.begin();
  if(!side){
   // má hồng & mảng lông tai-mũ gấu trúc viền quanh khuôn mặt
   h.ell(5.2,11.6,1.2,1.0,PD_B[2]);h.ell(14.8,11.6,1.2,1.0,PD_B[2]);
   h.ell(10,11.2,4.7,4.0,(ux,uy)=>uy<8.6?SKS:SK);
   h.ell(7.6,6.4,1.5,.9,PD_B[1]);h.ell(12.4,6.4,1.5,.9,PD_B[1]);
   h.ell(10,5.2,1.1,.8,PD_B[1]);
  }else{
   h.ell(8.0,11.2,1.3,1.1,PD_B[2]);
   h.ell(11.3,11.2,3.9,4.0,(ux,uy)=>uy<8.6?SKS:SK);
   h.ell(11.4,6.2,1.4,.9,PD_B[1]);
  }
  h.end(1,h.olSoft);
 }
 return h.frame();
}

// ============================================================
//  CACHE & ĐĂNG KÝ VÀO SETS / HAIRS / SETFX / HAIRFX / MASCOT_DRAW
// ============================================================
const CACHE={};
const getCached=(key,fn)=>{
 if(!CACHE[key])CACHE[key]=h.toCanvas(fn());
 return CACHE[key];
};

const ADD_SETS=[
 {n:'Set Học Viện Phép Thuật (Nam)',k:'magicm',fx:'tm_magicm',xu:3200,boot:1,sh:'#262d59',pt:'#1e2036',rpt:'#1e2036',shoe:'#0e0f1c',scarf:'#a8243b',
  ds:'Áo choàng Học Viện Phép Thuật viền vàng sao, khăn sọc đỏ đậm & giày da học viện.'},
 {n:'Set Học Viện Phép Thuật (Nữ)',k:'magicf',fx:'tm_magicf',xu:3200,boot:1,sh:'#262d59',pt:'#1e2036',rpt:'#1e2036',shoe:'#0e0f1c',scarf:'#a8243b',
  ds:'Váy xếp ly Học Viện Phép Thuật viền vàng ánh kim, khăn sọc đỏ & tất cao.'},
 {n:'Set Đầu Bếp Bánh Ngọt (Nam)',k:'pastrym',fx:'tm_pastrym',xu:2600,boot:1,sh:'#fffaf5',pt:'#73412c',rpt:'#73412c',shoe:'#f2749a',scarf:'#ff9ec0',
  ds:'Áo bếp trưởng hai hàng khuy màu kem, tạp dề dâu tây ngọt ngào.'},
 {n:'Set Đầu Bếp Bánh Ngọt (Nữ)',k:'pastryf',fx:'tm_pastryf',xu:2600,boot:1,sh:'#fffaf5',pt:'#f2749a',rpt:'#f2749a',shoe:'#f2749a',scarf:'#ff9ec0',
  ds:'Váy bếp bánh ngọt dâu kem kèm tạp dề thêu hình quả dâu xinh xắn.'},
 {n:'Set Cổ Phong Áo Lụa (Nam)',k:'hanfum',fx:'tm_hanfum',xu:3400,boot:1,sh:'#38a39d',pt:'#212636',rpt:'#212636',shoe:'#38a39d',scarf:'#ffd952',
  ds:'Áo lụa cổ phong xanh ngọc bích tay rộng, đai vàng thêu vân mây & ngọc bội.'},
 {n:'Set Cổ Phong Áo Lụa (Nữ)',k:'hanfuf',fx:'tm_hanfuf',xu:3400,boot:1,sh:'#e87498',pt:'#38a39d',rpt:'#e87498',shoe:'#e87498',scarf:'#ffd952',
  ds:'Áo lụa cổ phong sắc đào tiên & xanh ngọc thước tha kèm ngọc bội cổ điển.'},
 {n:'Mascot Ong Mật Mũm Mĩm',k:'beebuz',mascot:'beebuz',wide:1,xu:4800,boot:1,sh:'#ffd242',pt:'#4a2815',rpt:'#4a2815',shoe:'#2b160a',scarf:'#fff7de',
  ds:'Mascot Ong Mật vàng ươm mũm mĩm có râu ong cong, cánh trong xanh & que quệt mật.'},
 {n:'Mascot Gấu Trúc Trà Chanh',k:'pandatea',mascot:'pandatea',wide:1,xu:5200,boot:1,sh:'#ffffff',pt:'#212636',rpt:'#212636',shoe:'#12151f',scarf:'#ffe047',
  ds:'Mascot Gấu Trúc tròn xoe cài lá trúc, ôm ly Trà Chanh mát lạnh rực rỡ.'}
];
for(const s of ADD_SETS)if(!SETS.some(x=>x.k===s.k))SETS.push(s);

const ADD_HAIRS=[
 {n:'Tóc Học Viện Phép Thuật (Nam)',k:'magichm',c:'#322554',xu:1800},
 {n:'Tóc Học Viện Phép Thuật (Nữ)',k:'magichf',c:'#322554',xu:1800},
 {n:'Mũ Đầu Bếp Bánh Kem',k:'pastryh',c:'#804b2d',xu:1500},
 {n:'Tóc Cổ Phong Cài Trâm (Nam)',k:'hanfuhm',c:'#1a1c2b',xu:1900},
 {n:'Tóc Cổ Phong Cài Trâm (Nữ)',k:'hanfuhf',c:'#1a1c2b',xu:1900}
];
for(const hr of ADD_HAIRS)if(!HAIRS.some(x=>x.k===hr.k))HAIRS.push(hr);

const regSet=(fxKey,fn,fem)=>{
 SETFX[fxKey]=(u,o,S,K)=>{
  const g=TMC.g;if(!g)return;
  const st=mkSt(o,K);
  const key=fxKey+'|'+[st.view,st.flip?1:0,st.lg,st.sit?1:0,st.rd?1:0,st.noarm?1:0,st.aupL,st.aupR].join('|');
  const cv=getCached(key,()=>{let D=fn(st,fem);if(st.flip)D=flipD(D);return D});
  h.drawTo(g,cv,TMC.ox,TMC.oy+bobOf(o));
 };
};
regSet('tm_magicm',buildMagicBody,false);
regSet('tm_magicf',buildMagicBody,true);
regSet('tm_pastrym',buildPastryBody,false);
regSet('tm_pastryf',buildPastryBody,true);
regSet('tm_hanfum',buildHanfuBody,false);
regSet('tm_hanfuf',buildHanfuBody,true);

const regHair=(hKey,fn,fem)=>{
 HAIRFX[hKey]=(u,o,K)=>{
  const g=TMC.g;if(!g)return;
  const side=K.side,Rt=K.Rt,back=K.back,view=side?'s':back?'b':'f',flip=side&&!Rt;
  const key=hKey+'|'+view+'|'+(flip?1:0);
  const cv=getCached(key,()=>{let D=fn(view,fem);if(flip)D=flipD(D);return D});
  h.drawTo(g,cv,TMC.ox,TMC.oy+bobOf(o));
 };
};
regHair('magichm',buildMagicHair,false);
regHair('magichf',buildMagicHair,true);
regHair('pastryh',buildPastryHair,false);
regHair('hanfuhm',buildHanfuHair,false);
regHair('hanfuhf',buildHanfuHair,true);

if(typeof MASCOT_DRAW!=='undefined'){
 const regMascot=(mKey,fn)=>{
  MASCOT_DRAW[mKey]=(r,u,o,S,K)=>{
   if(!K.sit&&!K.rd&&!o.nosh&&typeof E==='function')E(r,'rgba(0,0,0,.2)',10,30,8,2);
   const g=TMC.g;if(!g)return;
   const st=mkSt(o,K);
   const key=mKey+'|'+[st.view,st.flip?1:0,st.lg,st.sit?1:0,st.rd?1:0,st.noarm?1:0,st.aupL,st.aupR].join('|');
   const cv=getCached(key,()=>{let D=fn(st);if(st.flip)D=flipD(D);return D});
   h.drawTo(g,cv,TMC.ox,TMC.oy+bobOf(o));
   if(!K.back){
    if(o.e>0&&typeof faceFx==='function')faceFx(u,o.e,K.side,K.Rt);
    else if(typeof faceDef==='function')faceDef(u,K.side,K.Rt);
   }
  };
 };
 regMascot('beebuz',buildBeeBody);
 regMascot('pandatea',buildPandaBody);
}
})();
