/* ============================================================
   PHỐ XÁ — map online thứ 2 (dùng chung hệ thống mạng của Công viên)
   - Shop: bán thú cưỡi / pet / set / tóc-mũ (đồ trong Túi chỉ có khi đã mua)
   - Tiệm nội thất (nhà phố số 1): bán đồ trang trí nhà 100–4000 Xu, đồ mua về nằm trong Túi nội thất (chỉ mở khi ở trong nhà)
   - Sạp vé số (xổ sau 2 phút, lồng quay), Miếu cầu phúc (xin xăm 5 lần/ngày)
   - Khách phố tự thoại thưa thớt, vỉa hè, ghế nhựa, bánh mì, trà đá, báo
   ============================================================ */
(()=>{
'use strict';
const PW=960,PH=640,TS=16,GC=PW/TS,GR=PH/TS,CV=window.CV;
const SOL=new Uint8Array(GC*GR);
const blk=(x0,y0,x1,y1)=>{for(let ty=Math.floor(y0/TS);ty<=Math.floor((y1-1)/TS);ty++)for(let tx=Math.floor(x0/TS);tx<=Math.floor((x1-1)/TS);tx++)if(tx>=0&&ty>=0&&tx<GC&&ty<GR)SOL[ty*GC+tx]=1};
const psSolid=(x,y)=>{const tx=Math.floor(x/TS),ty=Math.floor(y/TS);return tx<0||ty<0||tx>=GC||ty>=GR||SOL[ty*GC+tx]===1};
const PS={sp:[],hits:[],lb:[],seats:[],horses:[],tbls:[],pos:{x:110,y:430},fx:null,built:0,npcs:[],view:'',dueN:0};
let sd=777;const rn=()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pk=a=>a[Math.floor(rn()*a.length)];
const hsh=(a,b)=>{let h=Math.imul(a*374761393+b*668265263|0,1274126177);h^=h>>>13;return((h>>>0)%1000)/1000};
const put=(im,x,by,box)=>{const o=outl(im);PS.sp.push({by,d:()=>cx.drawImage(o,Math.round(x-im.width/2)-1,Math.round(by-im.height)-1)});if(box)blk(...box)};
const dyn=(by,fn)=>PS.sp.push({by,d:fn});
const hit=(x,y,w,h,msg,act,goal)=>PS.hits.push(act?[x,y,w,h,msg,act,goal]:[x,y,w,h,msg]);

// ---------- bản đồ: hoán đổi dữ liệu giữa Công viên và Phố xá ----------
const KEYS=['sp','hits','lb','seats','horses','tbls','pos','fx'],STASH={};CV.cur='cv';
const MAPS=window.CVMAPS=window.CVMAPS||{};MAPS.ps={d:PS,w:PW,h:PH};   // map online khác (vd. Biển: sea-map.js) tự đăng ký thêm vào đây
function useMap(id){if(CV.cur===id)return;const sv={};KEYS.forEach(k=>sv[k]=CV[k]);STASH[CV.cur]=sv;
 const M=MAPS[id],to=M?M.d:STASH[id];KEYS.forEach(k=>CV[k]=to[k]);CV.cur=id;CW=M?M.w:1440;CH=M?M.h:1008}
window.cvUseMap=useMap;
const pSetup=window.cvSetup,pAct=window.cvAct,pSolid=window.cvSolid;
window.cvSetup=()=>{
 if(MAP!='ps'){useMap('cv');return pSetup()}
 useMap('ps');if(!PS.built)build();
 CVON=1;setA(SP,CV.sp);setA(hits,CV.hits);setA(LB,CV.lb);
 Pl.x=CV.pos.x;Pl.y=CV.pos.y;Pl.d=1;CV.seat=-1;CV.hz=-1;
 toast('🏘️ Chào mừng tới Phố xá! Ghé shop, thử vận may vé số, xin xăm ở miếu nhé');
 if(window.PKO)PKO.onEnter()};
const pBG=window.cvDrawBG;
window.cvDrawBG=tm=>MAP=='ps'?cx.drawImage(PS.bg,0,0):pBG(tm);
window.cvSolid=(x,y)=>MAP=='ps'?psSolid(x,y):pSolid(x,y);
window.cvAct=(a,h)=>a.startsWith('ps:')?psAct(a.slice(3),h):pAct(a,h);

// ============================================================
//  SPRITES
// ============================================================
const PAL={cream:'#f1e2c6',pink:'#ebc9c2',sage:'#cfe0cf',lemon:'#eee6b8',sky:'#c9dbe8',mauve:'#e3cfda',peach:'#efd3b3'};
const mkHouse=(w,h,o)=>mk(w,h,(g,r)=>{
 const W=o.wall,WL=shade(W,.14),WD=shade(W,-.12),WK=shade(W,-.24),TR=o.trim||'#8e7d6a';
 const gh=46,roofY=o.tile?16:o.tank?18:6,top=roofY+8,nf=Math.max(1,Math.round((h-top-gh)/36)),fh=Math.floor((h-top-gh)/nf);
 // mái ngói trước / bồn nước trên sân thượng
 if(o.tile){for(let i=0;i<14;i++){const ins=Math.round(i*.9);r(i%3==0?'#d8a08c':'#cf9380',ins,2+i,w-ins*2,1)}r('#b87a68',0,15,w,2);for(let x=3;x<w-3;x+=5)r('#e4b4a2',x,5+(x%3),2,1)}
 if(o.tank){r('#bfc9cf',w-34,2,20,14);r('#dde5ea',w-34,2,20,3);r('#9aa6ad',w-34,13,20,3);r('#8c979d',w-30,16,2,4);r('#8c979d',w-18,16,2,4);E(r,'#dde5ea',w-24,2,10,2)}
 r(W,0,top,w,h-top);r(WL,0,top,2,h-top);r(WD,w-3,top,3,h-top);
 r(TR,0,roofY,w,4);r(shade(TR,.22),0,roofY,w,1);r(shade(TR,-.2),0,roofY+4,w,1);r(WD,0,roofY+5,w,3);
 const win=(x,y,ww,hh)=>{r('#7f7062',x-1,y-1,ww+2,hh+2);r('#bcd6e2',x,y,ww,hh);r('#dcecf3',x,y,2,hh);r('#dcecf3',x+3,y,1,hh);r('#9cbccb',x,y+hh-3,ww,3);r('#7f7062',x,y+Math.floor(hh/2),ww,1);
  r(o.shut||'#a7c5ad',x-4,y-1,3,hh+2);r(o.shut||'#a7c5ad',x+ww+1,y-1,3,hh+2);r('rgba(0,0,0,.12)',x-4,y+2,3,1);r('rgba(0,0,0,.12)',x+ww+1,y+2,3,1);r('#7f7062',x-2,y+hh+1,ww+4,2)};
 for(let f=0;f<nf;f++){const y0=top+f*fh;r(WK,0,y0+fh-3,w,3);r(WL,0,y0+fh-3,w,1);
  const wins=w>=88?2:1;for(let k=0;k<wins;k++){const wx=wins==2?Math.round(w*(k?.64:.24))-7:Math.round(w/2)-8,wy=y0+6;win(wx,wy,14,16);
   if(o.balc&&f==nf-1){r('#6e7b77',wx-5,wy+20,24,1);for(let x=wx-5;x<wx+19;x+=3)r('#6e7b77',x,wy+20,1,5);r('#6e7b77',wx-5,wy+25,24,1);
    r('#b9805e',wx+1,wy+15,5,5);r('#7fb083',wx,wy+9,7,6);r('#e59ab3',wx+2,wy+9,2,2);r('#b9805e',wx+10,wy+16,5,4);r('#8fbf8a',wx+9,wy+11,7,5)}}
  if(o.laundry&&f==0){const ly=y0+27;r('#5a5048',3,ly,w-6,1);['#e8b0b0','#b0d0e8','#f0e0a0','#c0e0b8','#e0c0e0'].forEach((c,i)=>{const lx=6+i*Math.floor((w-14)/5);r(c,lx,ly+1,6,7);r(shade(c,-.15),lx,ly+7,6,1)})}}
 // tầng trệt: mái che sọc + cửa hàng
 const y0=h-gh;
 for(let x=0;x<w;x+=8){r(o.aw[(x/8)%2],x,y0,8,9);r('rgba(255,255,255,.25)',x,y0,8,1)}
 for(let x=0;x<w;x+=8)r(o.aw[(x/8)%2],x,y0+9,8,2),r(o.aw[(x/8)%2],x+2,y0+11,4,1);r('rgba(0,0,0,.13)',0,y0+12,w,3);
 const fy=y0+13,fhh=h-fy;
 if(o.door=='shutter'){r('#c4c9cb',6,fy,w-12,fhh);for(let y=fy+2;y<h;y+=3)r('#aab0b3',6,y,w-12,1);r('#868c8f',6,fy,w-12,1);r('#e3e7e8',6,fy+1,w-12,1)}
 else{r('#6d5c4e',6,fy,w-12,fhh);r(o.in||'#f6ebd3',8,fy+2,w-16,fhh-2);
  if(o.shelf){r('#a9855f',10,fy+10,w-20,2);r('#a9855f',10,fy+22,w-20,2);const cs=o.shelf;for(let x=12;x<w-14;x+=7){r(cs[(x/7|0)%cs.length],x,fy+4,5,6);r(cs[((x/7|0)+2)%cs.length],x,fy+16,5,6)}}
  r('#6d5c4e',Math.round(w/2)-8,fy+2,16,fhh-2);r('#4f4036',Math.round(w/2)-6,fy+4,12,fhh-4);r('#f0dcb0',Math.round(w/2)-5,fy+5,4,fhh-6);
  r('#dcecf3',8,fy+2,2,fhh-3)}
 // biển hiệu
 r(TR,5,y0-14,w-10,12);r(o.sign.bg,6,y0-13,w-12,10);r('rgba(255,255,255,.3)',6,y0-13,w-12,1);
 g.textAlign='center';g.font='800 8px Nunito, "Segoe UI", sans-serif';g.fillStyle=o.sign.fg;g.fillText(o.sign.t,w/2,y0-5,w-16);
 r('rgba(0,0,0,.1)',0,h-2,w,2)});
const mkMieu=()=>mk(184,150,(g,r)=>{
 const RD='#c4675a',RDD='#a24f45',GD='#e2c36b',CR='#f0e4cc',TL='#cf8f7b';
 r('#d9d0c0',4,140,176,10);r('#e8e0d2',4,140,176,2);r('#cfc6b6',12,132,160,8);r('#e8e0d2',12,132,160,1);
 r(CR,22,74,140,58);r(shade(CR,.1),22,74,3,58);r(shade(CR,-.14),159,74,3,58);
 for(const x of[22,60,118,156]){r(RD,x,74,6,58);r('#d98578',x,74,2,58);r(RDD,x+4,74,2,58);r('#6b5a48',x-1,128,8,4)}
 r('#7d4a3a',66,86,52,46);r(RD,68,88,24,44);r(RD,92,88,24,44);r(RDD,91,88,2,44);for(const[x,y]of[[78,106],[86,106],[96,106],[104,106],[78,116],[86,116],[96,116],[104,116]])r(GD,x,y,3,3);
 r(RDD,66,82,52,5);r(GD,66,82,52,1);
 r('#8a2f27',70,66,44,14);r(GD,70,66,44,1);r(GD,70,79,44,1);r(GD,70,66,1,14);r(GD,113,66,1,14);
 g.textAlign='center';g.font='800 8px Nunito, sans-serif';g.fillStyle='#ffe9a0';g.fillText('MIẾU CẦU PHÚC',92,76,40);
 const roof=(x0,x1,y0,hh)=>{for(let i=0;i<hh;i++){const ex=Math.round(i*.35),up=i<5?Math.round((5-i)*1.4):0;r(i%4==3?'#b87a68':i%2?TL:'#d8a08c',x0+ex-up,y0+i,x1-x0-ex*2+up*2,1)}
  r('#b87a68',x0-6,y0+hh-1,x1-x0+12,3);r('#e8b8a6',x0-6,y0+hh-1,x1-x0+12,1);for(let x=x0;x<x1;x+=6)r('#e8b8a6',x,y0+hh+2,4,2)};
 roof(14,170,52,24);roof(40,144,22,32);
 r('#8f6a46',88,10,8,12);r(GD,86,8,12,4);E(r,GD,92,6,3,3);
 for(const x of[24,160]){r('#6b5a48',x,50,1,6);E(r,'#e58a7a',x,60,5,5);r(GD,x-3,55,6,1);r(GD,x-3,66,6,1)}
 for(const x of[46,138]){r('#6b5a48',x,76,1,4);E(r,'#e58a7a',x,84,4,4)}
 r('#b8a98f',8,122,10,18);r('#d4c8b0',8,122,10,3);r('#b8a98f',166,122,10,18);r('#d4c8b0',166,122,10,3)});
const mkBurner=()=>mk(30,36,(g,r)=>{r('rgba(0,0,0,.16)',3,33,24,2);r('#8d6b3f',5,22,20,10);r('#b58d52',5,22,20,2);r('#6b4f2d',5,30,20,2);r('#8d6b3f',3,19,24,4);r('#b58d52',3,19,24,1);r('#6b4f2d',8,32,3,3);r('#6b4f2d',19,32,3,3);r('#d9cfba',7,19,16,2)});
const mkTable=c=>mk(26,20,(g,r)=>{E(r,'rgba(0,0,0,.18)',13,19,12,1);r(c[1],4,8,2,11);r(c[1],20,8,2,11);r(c[1],12,10,2,9);E(r,c[0],13,7,12,4);E(r,c[2],13,6,11,3);
 r('#f2f6f8',8,3,3,4);r('#b8d6e6',8,4,3,3);r('#f2f6f8',15,3,3,4);r('#f4dca8',16,4,1,2);r('#c9877a',19,1,3,6);r('#f0f0e8',19,3,3,1)});
const TBL=[mkTable(['#8bb3dc','#6a92bc','#b7d3ee']),mkTable(['#9cc9a4','#74a67d','#c3e2c9']),mkTable(['#e0a099','#bd7a74','#f1c2bc'])];
const mkStool=c=>mk(14,13,(g,r)=>{E(r,'rgba(0,0,0,.18)',7,12,6,1);r(c[2],3,5,8,7);r(c[0],3,5,2,7);r(c[1],10,5,1,7);E(r,c[0],7,4,6,2);E(r,c[3],7,3,5,1);r(c[2],4,11,6,1);for(let y=6;y<11;y+=2)r('rgba(0,0,0,.13)',4,y,6,1)});
const STL=[['#f0a7a0','#c98078','#e0928a','#f9c4be'],['#8fb8e0','#6a94bd','#7ba6d0','#b3d2f0'],['#9ccaa6','#75a57f','#86b892','#bfe2c8']].map(([a,b,c,d])=>mkStool([a,b,c,d]));
const mkLamp=()=>mk(14,52,(g,r)=>{E(r,'rgba(0,0,0,.18)',7,50,6,1);r('#6c7479',5,12,3,38);r('#8e979c',5,12,1,38);r('#6c7479',3,46,8,4);r('#6c7479',2,8,10,3);r('#fbf1c8',3,2,8,7);r('#fffbe6',4,3,5,3);r('#6c7479',2,1,10,2)});
const mkPole=()=>mk(18,96,(g,r)=>{E(r,'rgba(0,0,0,.18)',9,94,7,2);r('#a9a398',7,10,4,84);r('#c8c2b6',7,10,1,84);r('#8f897e',10,10,1,84);r('#a9a398',1,14,16,2);r('#a9a398',3,22,12,2);for(const x of[2,7,12,15])r('#e8e2d4',x,11,2,3);r('#7e786d',6,60,6,10);r('#d9d2c2',7,62,4,3)});
const mkMoto=c=>mk(44,32,(g,r)=>{E(r,'rgba(0,0,0,.18)',22,30,20,2);
 for(const x of[8,35]){E(r,'#4a4a4a',x,24,6,6);E(r,'#7a7a7a',x,24,4,4);E(r,'#b8b8b8',x,24,2,2)}
 r(c,14,12,18,8);r(shade(c,.2),14,12,18,2);r(shade(c,-.25),14,19,18,2);r('#54545a',12,10,14,3);r(c,30,14,8,4);r('#c8c8c0',33,6,2,10);r('#54545a',30,5,8,2);r('#fbeaa0',37,8,3,3);r('#9a9a9a',18,20,10,3);r('#fff',20,13,6,2)});
const mkTree=(cl,w,h)=>mk(w,h,(g,r)=>{const cxp=w>>1;
 r('#a8806a',cxp-9,h-14,18,14);r('#c79a82',cxp-9,h-14,18,3);r('#8c6652',cxp-9,h-4,18,4);r('#6b5a3a',cxp-1,h-30,3,17);
 const bl=[[cxp,h*.34,w*.40,h*.28],[cxp-w*.24,h*.5,w*.22,h*.2],[cxp+w*.24,h*.5,w*.22,h*.2],[cxp-w*.1,h*.2,w*.24,h*.17],[cxp+w*.14,h*.24,w*.22,h*.17]];
 for(const[x,y,a,b]of bl)E(r,cl[0],x,y+3,a,b);for(const[x,y,a,b]of bl)E(r,cl[1],x,y,a,b);for(const[x,y,a,b]of bl)E(r,cl[2],x-a*.18,y-b*.3,a*.64,b*.56);
 const inb=(x,y)=>bl.some(([a,b,p,q])=>((x-a)/p)**2+((y-b)/q)**2<.8);
 for(let i=0;i<220;i++){const x=Math.round(rn()*w),y=Math.round(rn()*h*.7);if(inb(x,y))r(rn()<.5?cl[3]:cl[0],x,y,2,1)}});
const T_BOU=mkTree(['#cf7d9f','#e59ab8','#f2b7ce','#fbd6e4'],64,76),T_GRN=mkTree(['#78a886','#94c4a0','#b4dcbc','#d4f0d8'],60,72);
const mkBmCart=()=>mk(78,52,(g,r)=>{E(r,'rgba(0,0,0,.18)',39,50,36,2);
 for(const x of[14,64]){E(r,'#4a4a4a',x,44,6,6);E(r,'#8a8a8a',x,44,2,2)}
 r('#9ec7c2',4,24,70,20);r('#b9dcd7',4,24,70,3);r('#78a5a0',4,42,70,2);r('#78a5a0',4,24,2,20);
 r('#fbf1d4',12,29,54,12);r('#c9877a',12,29,54,1);g.textAlign='center';g.font='800 9px Nunito, sans-serif';g.fillStyle='#b5584a';g.fillText('BÁNH MÌ',39,39,50);
 r('#d9e4e8',2,19,74,5);r('#f2f6f8',2,19,74,1);
 r('#cfe6ec',8,3,62,16);r('#e8f4f7',8,3,62,2);r('#a9c8d0',8,17,62,2);r('#8fb0b9',8,3,2,16);r('#8fb0b9',68,3,2,16);r('#8fb0b9',38,3,1,16);
 for(let i=0;i<5;i++){r('#e3bd78',12+i*11,9,9,3);r('#f2d79a',12+i*11,9,9,1);r('#c99a52',13+i*11,10,1,1);r('#c99a52',16+i*11,10,1,1);r('#e3bd78',12+i*11,13,9,3)}
 r('rgba(255,255,255,.3)',10,5,3,12)});
const LK=.76,mkLotStall=()=>mk(Math.round(104*LK),Math.round(64*LK),(g,r0)=>{const r=(c,x,y,w,h)=>r0(c,Math.round(x*LK),Math.round(y*LK),Math.max(1,Math.round(w*LK)),Math.max(1,Math.round(h*LK)));g.save();g.scale(1,1);E(r,'rgba(0,0,0,.18)',52,62,48,2);
 r('#e9d4ae',6,26,92,34);r('#f4e6c6',6,26,6,34);r('#cdb58a',92,26,6,34);r('#b8a074',6,58,92,2);
 r('#8d6b3f',2,34,100,5);r('#b58d52',2,34,100,1);r('#7a5a33',2,38,100,1);
 r('#cfe6ec',10,40,84,16);r('#e8f4f7',10,40,84,2);r('#a9c8d0',10,54,84,2);
 const cs=['#f0a7a0','#f4d38a','#a8d8b0','#a8c8f0','#d0b0e8'];for(let i=0;i<14;i++){r(cs[i%5],12+i*6,42,4,10);r(shade(cs[i%5],-.12),12+i*6,50,4,2)}
 for(let i=0;i<12;i++){const c=cs[i%5];r('#7a5a33',10+i*7,16,1,6);r(c,8+i*7,22,5,9);r(shade(c,-.14),8+i*7,29,5,2);r('#fff',9+i*7,24,3,1)}
 r('#6b5a48',8,10,88,4);r('#d9cdb4',8,10,88,1);
 r('#c9877a',14,2,76,10);r('#e0a399',14,2,76,2);r('#a66860',14,10,76,2);g.textAlign='center';g.font='800 6px Nunito, sans-serif';g.fillStyle='#fff5e0';g.fillText('VÉ SỐ',Math.round(52*LK),Math.round(10*LK),44);g.restore()});
const mkCar=c=>mk(64,32,(g,r)=>{E(r,'rgba(0,0,0,.18)',32,30,29,2);
 for(const x of[14,50]){E(r,'#3e3e42',x,25,6,6);E(r,'#8a8a90',x,25,3,3)}
 r(c,4,14,56,11);r(shade(c,.2),4,14,56,2);r(shade(c,-.25),4,23,56,2);
 r(c,14,6,34,9);r(shade(c,.2),14,6,34,1);r(shade(c,-.15),14,13,34,2);
 r('#cfe6ee',17,8,13,6);r('#cfe6ee',33,8,13,6);r('#a9c8d4',17,13,29,1);r('#e8f4f7',18,8,3,2);
 r('#fbeaa0',56,16,4,3);r('#d85a4a',4,16,3,3);r('#9a9a9a',5,24,54,2)});
const mkDog=(f)=>mk(18,13,(g,r)=>{E(r,'rgba(0,0,0,.16)',9,12,8,1);
 const B='#d9a86c',BD='#b88650',BL='#f4dcb0';
 r(B,4,4,10,6);r(BL,5,8,8,2);r(BD,4,4,10,1);r(B,12,1,5,6);r(BL,15,4,3,3);r('#2b1d12',17,4,1,1);r('#2b1d12',14,2,1,1);r(BD,12,0,2,3);
 r(BD,2,2,2,4);r(BD,3,1,1,2);
 r(B,5,10,2,2-(f?1:0));r(B,11,10,2,2-(f?0:1));r(BD,5,10,1,2);r(BD,11,10,1,2)});
const mkUmb=(c1,c2)=>mk(120,40,(g,r)=>{for(let y=0;y<24;y++){const w=Math.round(58*Math.sqrt(1-((y-24)/24)**2*.6));for(let x=-w;x<=w;x++)r(Math.floor((x+60)/10)%2?c2:c1,60+x,y+4,1,1)}
 r(shade(c1,-.2),0,26,120,3);for(let x=0;x<120;x+=6)r(x%12?c1:c2,x,29,6,3);r('#8a7a68',59,0,2,6)});
const mkCage=()=>mk(54,64,(g,r)=>{r('#8d6b3f',6,56,42,6);r('#b58d52',6,56,42,1);r('#6b4f2d',10,48,6,10);r('#6b4f2d',38,48,6,10)});
const mkNewsBoard=()=>mk(36,40,(g,r)=>{r('#8d6b3f',4,12,3,28);r('#8d6b3f',29,12,3,28);r('#c9a57a',2,2,32,22);r('#e3c79f',2,2,32,3);r('#7a5a33',2,22,32,2);
 for(let i=0;i<4;i++){r(i%2?'#f4f0e0':'#f6dede',5+i*7,6,6,8);r('#b9aea0',6+i*7,8,4,1);r('#b9aea0',6+i*7,10,4,1)}});
const mkCat=()=>mk(18,11,(g,r)=>{E(r,'rgba(0,0,0,.16)',9,10,8,1);E(r,'#e6b98a',9,6,7,4);E(r,'#f4d2a8',8,5,5,2);r('#e6b98a',13,2,4,4);r('#e6b98a',13,1,1,2);r('#e6b98a',16,1,1,2);r('#8a5a3a',14,4,1,1);r('#c98f5e',2,7,3,1);r('#c98f5e',5,4,1,5)});
const mkTea=()=>mk(48,26,(g,r)=>{E(r,'rgba(0,0,0,.18)',24,25,22,1);r('#a9855f',4,12,40,3);r('#c9a57a',4,12,40,1);r('#8d6b3f',6,15,3,10);r('#8d6b3f',39,15,3,10);
 r('#d98b7e',8,2,10,10);r('#eeb0a5',8,2,10,2);r('#b86a60',8,10,10,2);r('#6a5a50',11,0,4,2);
 for(let i=0;i<4;i++){r('#f2f6f8',24+i*5,6,4,6);r('#f4dca8',24+i*5,8,4,4)}r('#bfe0ee',20,8,3,4)});
const mkBin=()=>mk(16,22,(g,r)=>{E(r,'rgba(0,0,0,.18)',8,21,7,1);r('#8cb59a',2,4,12,16);r('#a9cdb6',2,4,3,16);r('#6f9a7f',11,4,3,16);r('#8cb59a',1,2,14,3);r('#a9cdb6',1,2,14,1);r('#f6f6f0',5,9,6,5);r('#8cb59a',7,10,2,3)});
const mkBike=()=>mk(36,24,(g,r)=>{E(r,'rgba(0,0,0,.16)',18,23,15,1);for(const x of[8,28]){for(let a=0;a<24;a++){const q=a/24*6.283;r('#5a5a5a',x+Math.round(Math.cos(q)*6),17+Math.round(Math.sin(q)*6),1,1)}r('#9a9a9a',x,17,1,1)}
 r('#e0a099',8,17,1,1);for(let i=0;i<10;i++){r('#e0a099',8+i,17-Math.round(i*.9),1,1);r('#e0a099',18+i,17-Math.round(i*.9)+2,1,1)}r('#e0a099',12,9,12,1);r('#5a5a5a',26,6,5,1);r('#5a5a5a',10,7,5,2);r('#d9b36a',24,12,6,3)});
const mkTank=()=>mk(26,34,(g,r)=>{E(r,'rgba(0,0,0,.16)',13,33,11,1);r('#8c979d',4,22,3,11);r('#8c979d',19,22,3,11);E(r,'#c9d3d8',13,14,11,12);r('#dde5ea',4,6,18,4);r('#aab5bb',4,18,18,6);E(r,'#dde5ea',13,5,9,2)});

// ============================================================
//  NỀN (vẽ 1 lần)
// ============================================================
const pave=(r,x0,y0,x1,y1,tones,jt)=>{r(jt,x0,y0,x1-x0,y1-y0);
 for(let y=y0,row=0;y<y1;y+=8,row++){const off=(row%2)*10;for(let x=x0-off;x<x1;x+=20){const bx=Math.max(x0,x),bw=Math.min(x1,x+19)-bx,bh=Math.min(7,y1-y-1);if(bw<=0||bh<=0)continue;
  r(tones[Math.floor(hsh(x,y)*tones.length)],bx,y+1,bw,bh);r('rgba(255,255,245,.25)',bx,y+1,bw,1)}}};
function buildBG(){return mk(PW,PH,(g,r)=>{
 // BỐ CỤC: vỉa hè trên (hàng quán) y156–268 • đường y274–388 (nhỏ 60%) • vỉa hè dưới (vé số, gánh hàng) y394–500
 r('#e6dccb',0,0,PW,160);
 pave(r,0,156,PW,266,['#dcd3c4','#d6ccbb','#e1d9cb'],'#c8bead');
 r('#f0eadf',0,266,PW,3);r('#bfb5a3',0,269,PW,3);
 r('#c9ccc6',0,272,PW,116);
 for(let i=0;i<900;i++)r(pk(['#c0c4be','#d2d5cf','#bcc0ba']),Math.floor(rn()*PW),272+Math.floor(rn()*116),2,1);
 for(let x=10;x<PW;x+=44)r('#f0ead7',x,329,24,3);
 for(let i=0;i<9;i++)r('#f0ead7',150+i*9,278,5,46),r('#f0ead7',150+i*9,338,5,46);
 r('#f0eadf',0,388,PW,3);r('#bfb5a3',0,391,PW,3);
 pave(r,0,394,PW,500,['#dcd3c4','#d6ccbb','#e1d9cb'],'#c8bead');
 // tường thấp + mái nhà phía sau
 r('#cdbfa8',0,498,PW,8);r('#e9dfcb',0,496,PW,4);
 for(let x=0;x<PW;x+=60)r('#d9cdb7',x+54,498,6,8);
 r('#b9ae9a',0,506,PW,134);
 const rc=['#a3bcc4','#d6aca4','#a9c4a8','#dac792','#b9aed0'];
 for(let y=512,k=0;y<PH;y+=44,k++)for(let x=-20+(k%2)*60,j=0;x<PW;x+=120,j++){const c=rc[(j+k*2)%5];r(shade(c,-.2),x,y,116,42);r(c,x+2,y+2,112,38);
  for(let i=0;i<112;i+=4)r(shade(c,.12),x+2+i,y+2,1,38),r(shade(c,-.1),x+4+i,y+2,1,38)}
 for(let i=0;i<30;i++)r('rgba(0,0,0,.06)',Math.floor(rn()*PW),506+Math.floor(rn()*130),30,2);
 // ngõ về Nông Trại
 r('#6d6a64',44,498,56,62);r('#8a867d',46,498,52,4);r('#4f4c47',50,506,44,54);
 for(let i=0;i<6;i++)r('#5a5650',52+i*7,508,3,52);
 r('#e2c36b',44,488,56,12);r('#c4675a',46,490,52,8);
 g.textAlign='center';g.font='800 7px Nunito, sans-serif';g.fillStyle='#ffe9a0';g.fillText('NGÕ',72,497);
 // bóng nhà đổ lên vỉa hè
 r('rgba(80,64,50,.10)',0,156,PW,10);r('rgba(80,64,50,.06)',0,166,PW,8);
 // lề đường: vài vết gạch vỡ, lá khô
 for(let i=0;i<60;i++)r(pk(['#cfc0a0','#bcae8e','#d9c9a4']),Math.floor(rn()*PW),160+Math.floor(rn()*100),2,1);
  for(let i=0;i<40;i++)r(pk(['#cfc0a0','#bcae8e','#d9c9a4']),Math.floor(rn()*PW),398+Math.floor(rn()*98),2,1);
})}

// ============================================================
//  NPC (khách phố) + thoại
// ============================================================

// ============================================================
//  TRÙM KIM CƯƠNG (NPC) + hòm kho báu + đống kim cương
// ============================================================
const BOSS_SET={n:'Trùm kim cương',sh:'#17171e',shl:'#2e2e3a',shd:'#08080c',scarf:'#ffd23f',knot:'#c89a10',tie:'#33d6ff',belt:'#ffd23f',trim:'#ffd23f',pt:'#17171e',shoe:'#ffd23f',cape:'#2a1a4e'};
const BOSS_HAIR={k:'short',c:'#101014'};
const gemBig=(r,x,y,c)=>{const rows=[[2,5],[1,6],[0,7],[1,6],[2,5],[3,4]];rows.forEach(([a,b],i)=>{r(c[1],x+a,y+i,b-a+1,1);r(c[0],x+a,y+i,Math.min(2,b-a+1),1);if(b-a>1)r(c[2],x+b-1,y+i,2,1)});r('#ffffff',x+2,y,2,1);r('#ffffff',x+1,y+1,1,1)};
const mkDiaPile=()=>mk(40,26,(g,r)=>{
 E(r,'rgba(0,0,0,.2)',20,24,17,2);
 const C=[['#f0fdff','#5fd6ff','#2a8ad8'],['#fff0fb','#ff9de0','#d44aa8'],['#f6f0ff','#b79bff','#7a56d8'],['#f0fdff','#7ae8ff','#2a8ad8'],['#fffbe8','#ffe27a','#d9a521']];
 [[1,17],[8,18],[15,19],[22,18],[29,17]].forEach(([x,y],i)=>gemBig(r,x,y,C[i%5]));
 [[5,11],[12,12],[19,12],[26,11]].forEach(([x,y],i)=>gemBig(r,x,y,C[(i+2)%5]));
 [[9,5],[17,4],[24,6]].forEach(([x,y],i)=>gemBig(r,x,y,C[(i+1)%5]));
 gemBig(r,16,-1+1,C[0]);
 r('#ffffff',3,16,1,1);r('#ffffff',33,15,1,1);r('#ffffff',20,3,1,1)});
const mkChest=()=>mk(34,26,(g,r)=>{
 E(r,'rgba(0,0,0,.2)',17,24,15,2);
 // nắp mở
 r('#5a3418',3,0,28,8);r('#7a4a26',4,1,26,6);r('#3a2412',6,2,22,4);r('#ffd23f',3,0,28,1);r('#ffd23f',3,0,1,8);r('#ffd23f',30,0,1,8);
 // thân
 r('#6b4220',2,9,30,15);r('#8a5a30',2,9,30,3);r('#4a2c14',2,22,30,2);
 for(let x=7;x<30;x+=6)r('#5a3418',x,12,1,10);
 r('#ffd23f',5,9,3,15);r('#ffd23f',26,9,3,15);r('#c89a10',7,9,1,15);r('#c89a10',28,9,1,15);
 r('#ffd23f',14,13,6,7);r('#c89a10',14,19,6,1);r('#3a2412',16,15,2,3);
 // kho báu trào ra
 E(r,'#e0a020',17,9,13,3);E(r,'#ffd23f',17,8,12,2);E(r,'#fff0a0',13,7,5,1);
 for(let i=0;i<8;i++)r(i%2?'#ffe27a':'#ffd23f',5+i*3,6+(i%3),3,2);
 gemBig(r,5,2,['#f0fdff','#5fd6ff','#2a8ad8']);gemBig(r,13,0,['#fff0fb','#ff9de0','#d44aa8']);gemBig(r,21,2,['#f6f0ff','#b79bff','#7a56d8']);
 r('#fff',9,5,1,1);r('#fff',27,6,1,1)});
const bossDraw=(n,tm)=>{const X=Math.round(n.x),Y=Math.round(n.y),p=actPose('diamond',tm),F=ACTFX.diamond,L=Math.round(p.lift);
 F.back(X,Y,tm);
 drawAv(cx,X-10,Y-30-L,{d:p.d,a:tm,mv:0,sit:0,hair:0,set:0,setObj:BOSS_SET,hairObj:BOSS_HAIR});
 if(p.d==0){r('#08080c',X-3,Y-19-L,6,2);r('#2a2a36',X-3,Y-19-L,6,1);r('#6fe8ff',X-2,Y-19-L,1,1);r('#6fe8ff',X+1,Y-19-L,1,1)}   // kính đen
 if(p.d==0||p.d==1===false){}
 if(p.d==0){r('#ffd23f',X-2,Y-12-L,4,1);gem(X,Y-10-L,0,Math.sin(tm*6))}                                    // dây chuyền + mặt kim cương
 F.front(X,Y-Math.round(L*.5),tm);
 n.hx=X;n.hy=Y-34-L};
const sparkle=(x,y,tm,k)=>{const a=Math.sin(tm*4+k*2.1);if(a>.55){r('#ffffff',x,y,1,1);r('rgba(190,240,255,.9)',x-1,y,3,1);r('rgba(190,240,255,.9)',x,y-1,1,3)}};
const NPC=[];
const mkNpc=(o)=>{o.next=performance.now()+8000+rn()*50000;o.say=null;o.until=0;NPC.push(o);PS.npcs.push(o);return o};
function drawNpc(n,tm){if(n.boss)return bossDraw(n,tm);const X=Math.round(n.x),Y=Math.round(n.y);
 drawAv(cx,X-10,Y-30,{d:n.d,a:tm,mv:0,sit:n.sit?2:0,hair:n.hair,set:n.set});
 if(n.prop=='news'){r('#e8e2d0',X-7,Y-21,14,10);r('#f7f4e8',X-6,Y-21,12,9);for(let i=0;i<3;i++){r('#b5ab98',X-5,Y-19+i*3,4,1);r('#b5ab98',X+1,Y-19+i*3,4,1)}r('#c9877a',X-5,Y-21,3,2);r('#f1c08a',X-9,Y-14,3,3);r('#f1c08a',X+6,Y-14,3,3)}
 if(n.prop=='tea'){r('#f2f6f8',X+5,Y-14,4,5);r('#f4dca8',X+5,Y-12,4,3)}
 if(n.prop=='bm'){r('#e3bd78',X+6,Y-16,8,3);r('#f2d79a',X+6,Y-16,8,1);r('#f1c08a',X+4,Y-15,3,3)}
 n.hx=X;n.hy=Y-(n.sit?34:34)}
function sayBubble(t,x,y){cx.font='800 8px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';const w=Math.min(150,cx.measureText(t).width)+10;
 cx.fillStyle='rgba(30,20,10,.45)';cx.fillRect(x-w/2+1,y-9,w,13);cx.fillStyle='#fffdf0';cx.fillRect(x-w/2,y-10,w,13);cx.fillRect(x-2,y+3,4,2);cx.fillStyle='#3a2412';cx.fillText(t,x,y,w-6)}

// ============================================================
//  DỰNG MAP
// ============================================================
// ============================================================
//  XE CỘ CHẠY TRÊN ĐƯỜNG + NGƯỜI ĐI LẠI (chỉ để trang trí, không bấm được, không cản đường)
// ============================================================
function drawVeh(v,tm){const L=PW+200;let x=(tm*v.sp+v.ph)%L;x=v.dir>0?x-100:PW+100-x;
 if(x<camX-90||x>camX+vw+90)return;const o=v.o,w=o.width,h=o.height,bob=Math.round(Math.sin(tm*13+v.ph)*.5);
 cx.save();if(v.dir>0)cx.drawImage(o,Math.round(x-w/2)-1,Math.round(v.by-h)-1+bob);else{cx.translate(Math.round(x),0);cx.scale(-1,1);cx.drawImage(o,-Math.round(w/2)-1,Math.round(v.by-h)-1+bob)}cx.restore()}
// vị trí đi qua đi lại: đứng/ngồi nghỉ ở đầu mỗi đoạn rồi đi tiếp
function pingPos(v,tm){const leg=(v.x1-v.x0)/v.sp,cyc=2*(leg+v.rest),u=(tm+v.ph)%cyc;
 if(u<v.rest)return{x:v.x0,d:0,mv:0,rest:1};if(u<v.rest+leg)return{x:v.x0+(u-v.rest)*v.sp,d:3,mv:1,rest:0};
 if(u<2*v.rest+leg)return{x:v.x1,d:0,mv:0,rest:1};return{x:v.x1-(u-2*v.rest-leg)*v.sp,d:2,mv:1,rest:0}}
const DOG=[mkDog(0),mkDog(1)].map(outl);
function drawWalker(w,tm){
 if(w.k=='gym'){const X=Math.round(w.x),b=Math.abs(Math.sin(tm*3.2))*3,Y=Math.round(w.y-b);
  drawAv(cx,X-10,Y-30,{d:0,a:tm*1.2,mv:1,sit:0,hair:w.hair,set:w.set});
  const up=Math.sin(tm*3.2)>0;r('#f1c08a',X-9,Y-(up?26:15),3,3);r('#f1c08a',X+6,Y-(up?26:15),3,3);return}
 const p=pingPos(w,tm),X=Math.round(p.x),Y=w.y;
 if(w.k=='vend'){const b=Math.round(Math.sin(tm*5+w.ph)),g=w.goods;
  const bk=(x,y)=>{r('#b58d52',x,y,9,5);r('#d9b36a',x,y,9,1);r('#8d6b3f',x,y+4,9,1);for(let i=0;i<3;i++)r(g[i%g.length],x+1+i*3,y-2,3,2)};
  if(p.rest){bk(X-30,Y-4);bk(X+20,Y-4);r('#8a6a3c',X-31,Y-5,60,1);drawAv(cx,X-10,Y-30,{d:0,a:tm,mv:0,sit:2,hair:w.hair,set:w.set})}
  else{drawAv(cx,X-10,Y-30,{d:p.d,a:tm,mv:1,sit:0,hair:w.hair,set:w.set});
   r('#8a6a3c',X-19,Y-19,38,1);r('#6b5a48',X-16,Y-18,1,6+b);r('#6b5a48',X+16,Y-18,1,6+b);bk(X-20,Y-12+b);bk(X+12,Y-12+b)}
  return}
 if(w.k=='jog'){const bo=Math.round(Math.abs(Math.sin(tm*8))*1);drawAv(cx,X-10,Y-30-bo,{d:p.d,a:tm*1.9,mv:1,sit:0,hair:w.hair,set:w.set});return}
 if(w.k=='dog'){drawAv(cx,X-10,Y-30,{d:p.d,a:tm,mv:p.mv,sit:0,hair:w.hair,set:w.set});
  const dr=p.d==2?-1:1,dx=p.d==0?-16:dr*24,DX=X+dx,fr=p.mv?Math.floor(tm*6)%2:0,dg=DOG[fr],flip=p.d==0?(Math.floor(tm/3)%2?-1:1):dr;
  const hx=X+(p.d==2?-6:6),hy=Y-12;for(let i=0;i<=8;i++){const t=i/8;r('#b5503a',Math.round(hx+(DX+flip*7-hx)*t),Math.round(hy+(Y-9-hy)*t+Math.sin(t*3.14)*2),1,1)}
  cx.save();if(flip>0)cx.drawImage(dg,Math.round(DX-9)-1,Math.round(Y+1-13)-1);else{cx.translate(DX,0);cx.scale(-1,1);cx.drawImage(dg,-9-1,Math.round(Y+1-13)-1)}cx.restore()}}
function walker(w){w.hx=null;dyn(w.k=='vend'?w.y+1.5:w.y+(w.k=='dog'?1:0),()=>drawWalker(w,tmNow()))}
function build(){
 PS.built=1;PS.bg=buildBG();const sp=PS.sp,seats=PS.seats;
 // ----- hàng nhà phố (san sát) -----
 put(mkMieu(),96,160,[4,0,190,162]);
 const H=[
  [188,76,132,{wall:PAL.cream,aw:['#cfe0cf','#f4f0e4'],tank:1,shelf:['#c98a52','#7db3a7','#e09a62','#d9a468'],sign:{t:'NỘI THẤT',bg:'#cfe3cf',fg:'#4c6f52'}}],
  [264,92,152,{wall:PAL.pink,aw:['#e7b4ae','#f8ece6'],balc:1,tile:1,shelf:['#e0a099','#8fb8e0','#f2d79a','#9ccaa6'],sign:{t:'TIỆM MAY & MŨ NÓN',bg:'#f0c8c2',fg:'#8a4a44'},shut:'#cfe0cf'}],
  [356,80,128,{wall:PAL.sky,aw:['#dba9a0','#f6efe6'],tank:1,shelf:['#f2d79a','#e8c7a0'],sign:{t:'PHỞ BÒ',bg:'#e8c4be',fg:'#8a3f38'},shut:'#e8d9a8'}],
  [436,98,152,{wall:PAL.sage,aw:['#a9c4dc','#f4f0e4'],balc:1,tile:1,shelf:['#8fb8e0','#e0a099','#9ccaa6'],sign:{t:'TIỆM THÚ CƯỠI',bg:'#bcd6e6',fg:'#3f607a'},shut:'#e8c6b0'}],
  [534,78,136,{wall:PAL.lemon,aw:['#b9d6bf','#f6f2e2'],laundry:1,sign:{t:'HIỆU THUỐC',bg:'#c8e2cc',fg:'#3f7a54'},shelf:['#f4f0e4','#b9d6bf']}],
  [612,98,152,{wall:PAL.peach,aw:['#d9c4e6','#f8f0ea'],balc:1,tile:1,shelf:['#e8c06a','#e0a099','#c9b0dc'],sign:{t:'TIỆM THÚ CƯNG',bg:'#e3d0ee',fg:'#6a4a86'},shut:'#c9dbe8'}],
  [710,80,126,{wall:PAL.mauve,aw:['#a9c9d6','#f4f0e4'],tank:1,door:'shutter',sign:{t:'CẮT TÓC',bg:'#d6e8ee',fg:'#4a6f80'}}],
  [790,84,140,{wall:PAL.sky,aw:['#e2b89a','#f8efe2'],balc:1,laundry:1,shelf:['#c99a6a','#f2e0b8'],sign:{t:'CÀ PHÊ SÁNG',bg:'#e8cfb4',fg:'#7a5236'}}],
  [874,86,134,{wall:PAL.cream,aw:['#e8d28a','#f8f2dc'],tank:1,shelf:['#e8c85a','#f6e08a'],sign:{t:'TIỆM VÀNG',bg:'#f0dc96',fg:'#8a6a1c'},shut:'#d6c9a0'}]];
 for(const[x,w,h,o]of H){put(mkHouse(w,h,o),x+w/2,156,[x,0,x+w,158])}
 blk(0,0,PW,158);blk(0,502,PW,PH);
 // cửa tương tác
 const mm=['m','p','s'];
 hit(64,92,64,66,'⛩️ Miếu cầu phúc — bấm vào để thắp nhang, xin xăm','cv:ps:mieu',[96,176]);
 hit(268,96,84,60,'👕 Tiệm may — mua trang phục, tóc & mũ','cv:ps:shop:s',[308,178]);
 hit(440,96,90,60,'🐃 Tiệm thú cưỡi — trâu, voi, kỳ lân, xe đạp...','cv:ps:shop:m',[486,178]);
 hit(616,96,90,60,'🐾 Tiệm thú cưng — mèo, thỏ, gà, Mây Mây...','cv:ps:shop:p',[662,178]);
 hit(358,100,76,56,'🍜 Phở bò — thơm nức mũi, chưa mở bán đâu nhé!');
 hit(190,100,72,56,'🛋️ Tiệm nội thất — mua đồ trang trí cho nhà (100–4000 Xu)','cv:ps:furn',[226,178]);
 hit(536,100,74,56,'💊 Hiệu thuốc — kệ thuốc ngăn nắp');
 hit(712,100,76,56,'✂️ Tiệm cắt tóc — chú thợ đi ăn sáng rồi');
 hit(792,100,80,56,'☕ Cà phê sáng — mùi cà phê phin ngào ngạt');
 hit(876,100,82,56,'🥇 Tiệm vàng — lấp lánh sau tủ kính');
 // ===== VỈA HÈ TRÊN (y156–268): hàng quán, bàn ghế, xe bánh mì, trà đá, người đi dạo / tập thể dục =====
 for(const x of[262,632,862])put(mkPole(),x,268,[x-3,258,x+3,268]);
 for(const x of[160,440,726])put(mkLamp(),x,266,[x-2,260,x+2,266]);
 put(T_BOU,50,232,[36,218,66,232]);hit(26,166,48,66,'🌸 Giàn hoa giấy rực rỡ');
 put(mkBurner(),96,214,[82,204,110,214]);
 hit(80,184,32,32,'🪔 Lư hương trước miếu — vào miếu để thắp nhang nhé','cv:ps:mieu',[96,226]);
 // bàn ghế nhựa (người chơi ngồi được) — dời hết lên vỉa hè
 const ptab=(x,by,ci,sc)=>{put(TBL[ci],x,by,[x-12,by-8,x+12,by]);for(const dx of[-24,24]){const i=seats.length;put(STL[sc[dx<0?0:1]],x+dx,by+3);
   seats.push({x:x+dx,y:by-1,by:by+3,sy:by+16,kind:'stool'});hit(x+dx-8,by-12,16,15,'🪑 Ghế nhựa vỉa hè — bấm E để ngồi','cv:seat:'+i,[x+dx,by+16])}};
 ptab(216,244,1,[2,0]);ptab(310,246,2,[1,2]);ptab(402,244,0,[0,1]);ptab(580,246,0,[2,1]);ptab(910,246,1,[0,2]);
 hit(368,222,70,34,'🍜 Bàn ghế nhựa trước quán phở');
 // xe bánh mì
 put(mkBmCart(),500,258,[464,242,536,258]);
 hit(462,208,76,50,'🥖 Xe bánh mì — "Bánh mì nóng giòn đây!"');
 mkNpc({id:'bm',x:550,y:252,d:2,set:0,hair:0,prop:'',lines:['Bánh mì nóng giòn đây!','Cho thêm ớt hông con?','Hết ổ này là nghỉ nha!','Pate nhà làm, thơm lắm nè.']});
 mkNpc({id:'k1',x:482,y:267,d:1,set:2,hair:1,prop:'bm',lines:['Cho tui ổ không hành nghen.','Thơm quá trời luôn!','Chú ơi, nhanh nhanh giùm nha.']});
 mkNpc({id:'k2',x:518,y:269,d:1,set:5,hair:2,prop:'',lines:['Cho 2 ổ mang đi nha chú!','Bánh mì chú này ngon nhất phố.']});
 // quán trà đá + khách đọc báo
 put(TBL[1],684,246,[672,238,696,246]);
 for(const dx of[-24,24])put(STL[dx<0?1:0],684+dx,249);
 mkNpc({id:'ong',x:660,y:248,d:0,set:0,hair:1,sit:1,prop:'news',lines:['Hôm nay giá vàng lên rồi...','Ủa, đội mình thắng hả?','Chậc chậc, thời tiết dạo này lạ ghê.','Tin này đọc hoài vẫn hay.']});
 mkNpc({id:'ba',x:708,y:248,d:0,set:5,hair:2,sit:1,prop:'tea',lines:['Trà đá ngày nắng là nhất.','Ông ơi, bớt đọc báo uống trà đi.','Bữa nay mát mẻ quá ha.']});
 put(mkTea(),770,252,[748,240,792,252]);
 mkNpc({id:'tra',x:808,y:248,d:2,set:3,hair:3,prop:'',lines:['Trà đá 3 nghìn nè!','Ngồi nghỉ chút đi con!','Trà đá mát lạnh, giải khát đây!']});
 put(mkNewsBoard(),836,254,[824,244,848,254]);hit(820,216,32,40,'📰 Bảng báo: "Phố xá hôm nay — nắng đẹp, lòng vui"');
 hit(640,214,80,40,'🧋 Quán trà đá — khách đang ngồi đọc báo');
 mkNpc({id:'cat',cat:1,x:300,y:214,d:0,set:0,hair:0,lines:[]});
 put(mkCat(),300,216);hit(290,200,22,18,'🐈 Chú mèo đang ngủ gật... khò khò');
 // người đi dạo (không bấm được): dắt chó, chạy bộ, tập thể dục
 walker({k:'dog',y:192,x0:130,x1:340,sp:17,rest:6,ph:3,set:2,hair:1});
 walker({k:'jog',y:190,x0:600,x1:930,sp:34,rest:0,ph:0,set:3,hair:2});
 walker({k:'jog',y:262,x0:20,x1:170,sp:30,rest:0,ph:5,set:5,hair:0});
 walker({k:'gym',y:258,x:350,ph:0,set:4,hair:3});
 // ===== ĐƯỜNG (y274–388): xe máy, xe đạp, ô tô chạy qua lại =====
 const VL=PW+200;
 [[1,326,44,[['c','#e9d27a']]],[-1,380,52,[['c','#8fb8e0']]]].forEach(([dir,by,sp,L])=>L.forEach((q,i)=>{
   const im=q[0]=='m'?mkMoto(q[1]):q[0]=='c'?mkCar(q[1]):mkBike(),v={dir,by,sp,ph:i*VL/L.length,im,o:outl(im)};dyn(by,()=>drawVeh(v,tmNow()))}));
 // ===== VỈA HÈ DƯỚI (y394–500): "bên kia đường" — sạp vé số, vòng quay, gánh hàng =====
 for(const[x,y]of[[24,424],[470,490],[250,490]])put(mkBin(),x,y,[x-6,y-8,x+6,y]);
 hit(14,402,22,24,'🗑️ Thùng rác xinh xắn');
 put(mkLotStall(),866,486,[827,470,905,486]);
 hit(826,440,80,46,'🎟️ Sạp vé số Kiến thiết — bấm để mua vé, xổ sau 2 phút','cv:ps:lot',[866,496]);
 mkNpc({id:'vs',x:920,y:486,d:2,set:4,hair:3,prop:'',lines:['Vé số đây! Thử vận may nào!','Mua tờ vé số lấy hên nè!','Xổ số sắp quay rồi nha!']});
 put(mkWheelStall(),165,486,[137,474,193,486]);
 hit(136,424,60,62,'🎡 Vòng quay may mắn — quay bằng vé nhận từ khí cầu','cv:ps:wheel',[165,498]);
 mkNpc({id:'wl',x:200,y:490,d:2,set:5,hair:2,prop:'',lines:['Giao khí cầu là có vé quay nè!','Quay trúng kim cương nha!','Có vé thì quay miễn phí đó!']});
 put(mkCage(),790,486,[776,480,804,486]);
 dyn(485,()=>psCage(790,456,tmNow()));
 hit(766,430,48,56,'🎰 Vòng quay số — bấm để xem vé của bạn','cv:ps:lot',[790,496]);
 // 2 cô bán hàng rong gánh hàng đi qua đi lại chậm rãi, đến đầu đường thì ngồi nghỉ
 for(const v of[{y:448,x0:200,x1:520,sp:13,rest:10,ph:0,set:5,hair:2,goods:['#e0584a','#f4d38a','#a8d8b0']},{y:470,x0:580,x1:730,sp:11,rest:12,ph:9,set:3,hair:3,goods:['#a8d8b0','#f6f2e2','#f0a7a0']}]){
   put(STL[0],v.x0,v.y+1);put(STL[1],v.x1,v.y+1);walker(Object.assign({k:'vend'},v))}

 // ----- TRÙM KIM CƯƠNG: đứng ở vỉa hè cạnh hòm kho báu + đống kim cương -----
 {const bx=372,by=490;   // dời sang giữa vỉa hè dưới: xa đường đi của 2 cô gánh hàng
  put(mkChest(),bx-46,by+2,[bx-62,by-8,bx-30,by+2]);put(mkDiaPile(),bx+48,by+2,[bx+28,by-8,bx+68,by+2]);
  dyn(by+3,()=>{const tm=tmNow();for(let i=0;i<5;i++)sparkle(bx-58+i*7,by-22+(i%3)*4,tm,i);for(let i=0;i<5;i++)sparkle(bx+32+i*8,by-24+(i%2)*6,tm,i+7)});
  mkNpc({id:'boss',boss:1,x:bx,y:by,d:0,set:0,hair:0,prop:'',lines:['Kim cương đây! Ai lấy kim cương nào?','Ánh sáng này là của các con nè!','Muốn phát kim cương hông? Ghé ta nhé!','Lấp lánh cả phố luôn!']});
  hit(bx-16,by-44,32,50,'💎 Trùm kim cương — bấm để mở Shop kim cương','cv:ps:dia',[bx,by+14]);
  hit(bx-64,by-26,36,30,'🧰 Hòm kho báu — lấp lánh quá!');hit(bx+28,by-28,42,32,'💎 Đống kim cương của Trùm');
  PS.lb.push(['TRÙM KIM CƯƠNG',bx,by-52])}
 // người
 for(const n of PS.npcs){if(n.cat)continue;dyn(n.sit?n.y+1.5:n.y,()=>drawNpc(n,tmNow()))}
 // ----- nhãn -----
 for(const l of[['NGÕ → NÔNG TRẠI',72,520],['VÒNG QUAY MAY MẮN',168,512]])PS.lb.push(l);
 hit(40,478,64,30,'🚪 Ngõ ra — bấm để về Nông Trại','gate',[72,490]);
 // thùng nước, bồn trên mái phía sau
 for(const x of[120,360,640,860])put(mkTank(),x,606);
 }
const tmNow=()=>performance.now()/1000;

// ============================================================
//  HIỆU ỨNG TRÊN CÙNG (dây điện, hơi nước, thoại, lồng quay)
// ============================================================
const STEAM=[];let stT=0;
function psCage(x,y,tm){const L=lotS(),now=Date.now(),pend=L.t.some(t=>!t.paid),due=L.t.some(t=>!t.paid&&t.at<=now);
 drawCage(cx,x,y,22,tm*(due?7:pend?2.2:.5),6);
 if(due){const b=Math.round(Math.sin(tm*8)*2);r('#e0584a',x-3,y-46+b,6,8);r('#fff',x-1,y-45+b,2,4);r('#fff',x-1,y-40+b,2,2)}}
function drawCage(g,x,y,R,ang,k){const rr=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(a),Math.round(b),w,h)};
 rr('#8d6b3f',x-R-4,y+R-4,R*2+8,6);rr('#b58d52',x-R-4,y+R-4,R*2+8,1);
 const col=['#f0a7a0','#f4d38a','#a8d8b0','#a8c8f0','#d0b0e8','#fff'];
 for(let i=0;i<k;i++){const a=ang*1.4+i*1.05,rad=R*.5*(.45+.55*Math.abs(Math.sin(i*2.3+ang*.7))),bx=x+Math.cos(a)*rad,by=y+Math.sin(a)*rad*.9;rr('rgba(0,0,0,.15)',bx-2,by,5,5);rr(col[i%6],bx-2,by-2,5,5);rr('#fff',bx-1,by-2,2,1)}
 for(let a=0;a<36;a++){const q=a/36*6.283;rr('#7a8187',x+Math.cos(q)*R,y+Math.sin(q)*R*.9,2,2)}
 for(let s=0;s<4;s++){const q=ang+s*Math.PI/4;for(let m=2;m<R;m+=2){rr('#a0a7ad',x+Math.cos(q)*m,y+Math.sin(q)*m*.9,1,1);rr('#a0a7ad',x-Math.cos(q)*m,y-Math.sin(q)*m*.9,1,1)}}
 rr('#6a7076',x-2,y-2,4,4);rr('#8d6b3f',x+R+1,y-2,6,3);const hx=x+R+7+Math.cos(ang*2)*3,hy=y+Math.sin(ang*2)*3;rr('#d9b36a',hx-1,hy-1,3,3)}
function wires(){cx.lineWidth=1;cx.strokeStyle='rgba(76,68,64,.55)';
 const P=[[262,192],[632,192],[862,192]];
 for(let i=0;i<P.length-1;i++)for(const dy of[0,5,10]){cx.beginPath();cx.moveTo(P[i][0],P[i][1]+dy);cx.quadraticCurveTo((P[i][0]+P[i+1][0])/2,P[i][1]+dy+16,P[i+1][0],P[i+1][1]+dy);cx.stroke()}
 for(const dy of[0,5]){cx.beginPath();cx.moveTo(262,192+dy);cx.quadraticCurveTo(110,206+dy,0,196+dy);cx.stroke();cx.beginPath();cx.moveTo(862,192+dy);cx.quadraticCurveTo(920,206+dy,960,196+dy);cx.stroke()}}
PS.fx=psFx;
function psFx(tm,dt){
 if(CV.cur!='ps')return;
 wires();
 // hơi nước: xe bánh mì + quán phở + nhang miếu
 stT-=dt;if(stT<=0){stT=.35;STEAM.push({x:396+Math.random()*6,y:158,t:0,c:'255,255,255',v:12},{x:496+Math.random()*24,y:210,t:0,c:'255,255,255',v:8},{x:93+Math.random()*6,y:202,t:0,c:'230,225,215',v:10})}
 for(let i=STEAM.length-1;i>=0;i--){const s=STEAM[i];s.t+=dt;s.y-=s.v*dt;s.x+=Math.sin(s.t*2+i)*5*dt;if(s.t>2.2){STEAM.splice(i,1);continue}
  if(s.x<camX-6||s.x>camX+vw+6||s.y<camY-6||s.y>camY+vh+6)continue;cx.fillStyle='rgba('+s.c+','+(.5*(1-s.t/2.2)).toFixed(2)+')';cx.fillRect(Math.round(s.x),Math.round(s.y),3,2)}
 // thoại thưa thớt
 const now=performance.now();
 for(const n of NPC){if(n.cat){const z=Math.floor(tm*1.2)%3;cx.font='800 8px Nunito,Arial,sans-serif';cx.textAlign='center';cx.fillStyle='rgba(90,80,70,.8)';cx.fillText('z'.repeat(1+z),308+z*2,200-z*2);continue}
  if(now>n.next){n.say=pk(n.lines);n.until=now+4200;n.next=now+30000+Math.random()*60000}
  if(n.say&&now<n.until&&n.hx!=null&&Math.abs(n.hx-Pl.x)<260&&Math.abs(n.hy-Pl.y)<200)sayBubble(n.say,n.hx,n.hy-6)}}

// ============================================================
//  VÉ SỐ
// ============================================================
const LOT_PRICE=100,LOT_REFUND=88,LOT_MAXP=10,LOT_WAIT=120000;
// o = "1 trên o vé" (KHÔNG hiển thị cho người chơi). Giải 4 ≈ 1/18; giải 5 (trùng 1 số cuối, hoàn 100) ≈ 1/5; không trùng số nào hoàn 88. Kỳ vọng ≈ 107 Xu / vé 100 Xu.
const LOT=[{k:'ĐẶC BIỆT',p:99999,o:100000,j:6},{k:'GIẢI NHẤT',p:8888,o:15000,j:5},{k:'GIẢI NHÌ',p:2888,o:2500,j:4},{k:'GIẢI BA',p:888,o:300,j:3},{k:'GIẢI TƯ',p:288,o:18,j:2},{k:'GIẢI NĂM',p:100,o:5,j:1}];
window.PS_LOT=LOT;
const lotS=()=>{if(!ST.lot||!Array.isArray(ST.lot.t))ST.lot={t:[]};return ST.lot};
const dig=()=>String(Math.floor(Math.random()*10));
function lotMake(){let u=Math.random(),gi=-1,acc=0;for(let i=0;i<LOT.length;i++){acc+=1/LOT[i].o;if(u<acc){gi=i;break}}
 const n=Array.from({length:6},dig).join(''),j=gi>=0?LOT[gi].j:0;
 const w=Array.from({length:6},dig);for(let i=0;i<j;i++)w[5-i]=n[5-i];if(j<6){let d;do d=dig();while(d==n[5-j]);w[5-j]=d}
 return{n,w:w.join(''),j,g:gi,p:gi>=0?LOT[gi].p:LOT_REFUND,at:Date.now()+LOT_WAIT,paid:0}}
window.psLot=()=>{PS.view='lot';const L=lotS();L.t=L.t.filter((t,i,a)=>!t.paid||i>=a.length-6);
 let h=head('🎟️ Sạp vé số Kiến thiết')+'<div class="mut">Vé <b>'+LOT_PRICE+' Xu</b> • xổ số sau <b>2 phút</b> • không trùng số nào được hoàn <b>'+LOT_REFUND+' Xu</b>. Tối đa '+LOT_MAXP+' vé chờ xổ.</div>'+
 '<div class="g1">'+LOT.map(g=>'<div class="it"><span><b>'+g.k+'</b><br><small>khớp '+g.j+' số cuối</small></span><b>'+g.p.toLocaleString('vi-VN')+' Xu</b></div>').join('')+'</div>'+
 '<div class="pf"><button class="b" onclick="psLotBuy(1)">🎟️ Mua 1 vé</button><button class="b" onclick="psLotBuy(5)">🎟️ Mua 5 vé</button></div><div class="mut"><b>Vé của bạn</b> (🪙 '+fmtXu(ST.xu)+' Xu)</div><div class="g1" id="lotl"></div>';
 openUI(h);lotList()};
function lotList(){const el=$('lotl');if(!el)return;const L=lotS(),now=Date.now();
 el.innerHTML=L.t.length?L.t.slice().reverse().map(t=>{let st;
  if(t.paid)st=t.g>=0?'<b style="color:#2e7d32">🏆 '+LOT[t.g].k+' +'+t.p.toLocaleString('vi-VN')+'</b>':'hoàn '+LOT_REFUND+' Xu';
  else if(t.at<=now)st='<button class="b x" onclick="psLotRev()">🎰 Xem xổ số</button>';
  else{const s=Math.ceil((t.at-now)/1000);st='⏳ '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
  return '<div class="it'+(t.paid&&t.g<0?' z':'')+'"><span>🎫 <b>'+t.n+'</b></span><span>'+st+'</span></div>'}).join(''):'<div class="mut">Chưa có vé nào — mua một tờ lấy hên nhé!</div>'}
window.psLotBuy=n=>{const L=lotS(),pend=L.t.filter(t=>!t.paid).length;
 if(pend+n>LOT_MAXP)return toast('🎟️ Chỉ được giữ tối đa '+LOT_MAXP+' vé chờ xổ');
 if(ST.xu<LOT_PRICE*n)return toast('🪙 Không đủ Xu mua vé');
 ST.xu-=LOT_PRICE*n;for(let i=0;i<n;i++)L.t.push(lotMake());xuUp();save();toast('🎟️ Đã mua '+n+' vé — 2 phút nữa xổ số!');psLot()};
window.psLotRev=()=>{PS.view='rev';const L=lotS(),now=Date.now(),t=L.t.find(t=>!t.paid&&t.at<=now);if(!t)return psLot();
 if(t.g<0){let m=0;while(m<6&&t.n[5-m]==t.w[5-m])m++;if(m>=1){t.g=5;t.p=100;t.j=m}else t.p=LOT_REFUND} // vé cũ mua trước bản cập nhật: tính lại theo số thực sự khớp
 t.paid=1;ST.xu+=t.p;xuUp();save();
 openUI(head('🎰 Xổ số kiến thiết')+'<div style="text-align:center"><canvas id="lotc" width="160" height="104" style="width:100%;max-width:320px;image-rendering:pixelated;background:#efe6d4;border:2px solid #7a4a26"></canvas><div class="mut" style="margin:6px 0 0">Vé của bạn</div><div style="font-size:22px;letter-spacing:5px;font-weight:800">'+t.n+'</div><div class="mut" style="margin:6px 0 0">Số trúng thưởng</div><div id="lotn" style="font-size:28px;letter-spacing:5px;font-weight:800;min-height:36px">······</div><div id="lotr" style="min-height:48px;margin-top:4px"></div></div><div class="pf"><button class="b" id="lotb" disabled onclick="psLot()">Tiếp tục</button></div>');
 const c=$('lotc'),g=c.getContext('2d'),t0=performance.now();let shown=-1;
 const loop=()=>{if(!$('lotc')||!UI||PS.view!='rev')return;const e=(performance.now()-t0)/1000,n=Math.max(0,Math.min(6,Math.floor((e-1.3)/.75)+1));
  g.clearRect(0,0,160,104);g.fillStyle='#efe6d4';g.fillRect(0,0,160,104);
  drawCage(g,56,50,34,e<1.3?e*10:e*6*(n<6?1:.2),6-Math.min(5,n));
  for(let i=0;i<n;i++){const age=Math.min(1,(e-1.3-i*.75)/.5),bx=Math.round(92+(66+i*15-92)*age),by=Math.round(52+(86-52)*age-Math.sin(age*3.14)*8);g.fillStyle='#e8dcc4';g.fillRect(64+i*15,84,15,2);g.fillStyle=['#f0a7a0','#f4d38a','#a8d8b0','#a8c8f0','#d0b0e8','#f6c0a0'][i];g.fillRect(bx,by,13,13);g.fillStyle='#fff';g.fillRect(bx+2,by+2,4,2);g.fillStyle='#5a3a2a';g.font='800 10px Nunito,sans-serif';g.textAlign='center';g.fillText(t.w[i],bx+7,by+11)}
  if(n!=shown){shown=n;const el=$('lotn');if(el){let s='';for(let i=0;i<6;i++){const m=n>=6&&i>=6-t.j;s+=i<n?'<span style="color:'+(m?'#2e7d32':'#3a2412')+'">'+t.w[i]+'</span>':'·'}el.innerHTML=s}
   if(n>=6){const rs=$('lotr'),b=$('lotb');if(rs)rs.innerHTML=t.g>=0?'<div style="font-size:18px;color:#2e7d32;font-weight:800">🎉 TRÚNG '+LOT[t.g].k+'!<br>+'+t.p.toLocaleString('vi-VN')+' Xu</div>':'<div class="mut">Không trùng số nào — hoàn '+LOT_REFUND+' Xu. Thử lại nhé! 🍀</div>';if(b)b.disabled=false;if(t.g>=0)toast('🎉 Trúng '+LOT[t.g].k+' +'+t.p+' Xu!')}}
  requestAnimationFrame(loop)};loop()};
setInterval(()=>{if(MAP!='ps')return;const L=lotS(),now=Date.now(),due=L.t.filter(t=>!t.paid&&t.at<=now).length;
 if(due>PS.dueN)toast('🎰 Đã đến giờ xổ số! Ra sạp vé số xem kết quả nhé');PS.dueN=due;
 if(PS.view=='lot'&&UI&&$('lotl'))lotList()},1000);


const WHS=[{xu:2,c:'#8fd0ff',t:'2'},{xu:20,c:'#ffd27a',t:'20'},{xu:5,c:'#b9ec8a',t:'5'},{dia:1,c:'#ff9de0',t:'💎'},{xu:10,c:'#ffb08a',t:'10'},{xu:50,c:'#c9a8ff',t:'50'}];
const mkWheelStall=()=>mk(60,66,(g,r)=>{
 r('rgba(0,0,0,.15)',4,62,52,3);
 r('#6b4220',9,38,4,26);r('#a8794a',9,38,1,26);r('#6b4220',47,38,4,26);r('#a8794a',47,38,1,26);
 for(let x=2;x<58;x+=6){r('#e0584a',x,0,3,6);r('#fff6e0',x+3,0,3,6)}r('#b83a30',2,6,56,2);
 const X=30,Y=28,R=19;
 for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const d=Math.hypot(x,y);if(d>R)continue;
  if(d>R-2){r((x+y)%4?'#7a4a26':'#ffe14a',X+x,Y+y,1,1);continue}
  const a=(Math.atan2(y,x)+Math.PI*2.5)%(Math.PI*2),i=Math.floor(a/(Math.PI/3))%6;
  r(Math.abs(a%(Math.PI/3))<.05||Math.abs(a%(Math.PI/3)-Math.PI/3)<.05?'#fff8e0':WHS[i].c,X+x,Y+y,1,1)}
 r('#f6e7b4',X-3,Y-3,6,6);r('#7a4a26',X-3,Y-3,6,1);r('#7a4a26',X-3,Y+2,6,1);r('#7a4a26',X-3,Y-3,1,6);r('#7a4a26',X+2,Y-3,1,6);
 r('#d9302a',X-1,Y-R-2,3,6);r('#fff',X,Y-R-1,1,2);
 r('#b58d52',4,50,52,12);r('#d9b36a',4,50,52,2);r('#8d6b3f',4,60,52,2);
 r('#fff6e0',10,52,8,6);r('#e0584a',10,52,8,1);r('#ffd23f',22,52,6,6);r('#fff',40,52,10,6);r('#9a5ad0',43,54,4,3)});

// ============================================================
//  VÒNG QUAY MAY MẮN: vé nhận khi giao khí cầu, 20 Xu/lượt nếu không có vé, ô Kim cương rất hiếm
// ============================================================
const WH_COST=20,WH_PITY=100,WH_PMIN=90,WHP=[.435,.09,.24,.035,.15,.05]; // tỉ lệ từng ô (WHS); 💎 = 3.5% (≈ 1/29), bảo hiểm chắc chắn có trong 90–100 lượt
const whS=()=>{if(!ST.wh||typeof ST.wh!='object')ST.wh={n:0,p:0};if(!(ST.wh.p>=0))ST.wh.p=0;if(!(ST.wh.th>=WH_PMIN&&ST.wh.th<=WH_PITY))ST.wh.th=WH_PMIN+Math.floor(Math.random()*(WH_PITY-WH_PMIN+1));if(!(ST.wh.n>=0))ST.wh.n=0;return ST.wh};
function whRoll(){const W=whS();W.n++;W.p++;let i=0;
 if(W.p>=W.th)i=3;else{const u=Math.random();let a=0;for(let k=0;k<6;k++){a+=WHP[k];if(u<a){i=k;break}}}
 if(i==3){W.p=0;W.th=WH_PMIN+Math.floor(Math.random()*(WH_PITY-WH_PMIN+1))}return i}
const whName=i=>WHS[i].dia?'💎 1 Kim cương':'🪙 '+WHS[i].xu+' Xu';
let WTH=0,WA=null,WTOK=0;
function whDraw(c,th){const g=c.getContext('2d'),W=c.width,cxp=W/2,cyp=W/2+14,R=W/2-18;g.clearRect(0,0,W,c.height);
 g.save();g.translate(cxp,cyp);g.fillStyle='#7a4a26';g.beginPath();g.arc(0,0,R+9,0,7);g.fill();g.rotate(th);
 for(let i=0;i<6;i++){const a0=-Math.PI/2+i*Math.PI/3,a1=a0+Math.PI/3;g.fillStyle=WHS[i].c;g.beginPath();g.moveTo(0,0);g.arc(0,0,R,a0,a1);g.closePath();g.fill();g.strokeStyle='#fff8e0';g.lineWidth=3;g.stroke();
  g.save();g.rotate(a0+Math.PI/6+Math.PI/2);g.fillStyle='#3a2412';g.textAlign='center';g.textBaseline='middle';g.font='800 24px Nunito,Arial,sans-serif';g.fillText(WHS[i].t,0,-R*.62);
  if(WHS[i].xu){g.font='800 11px Nunito,Arial,sans-serif';g.fillText('Xu',0,-R*.62+17)}g.restore()}
 g.fillStyle='#f6e7b4';g.beginPath();g.arc(0,0,15,0,7);g.fill();g.strokeStyle='#7a4a26';g.lineWidth=3;g.stroke();g.restore();
 const bl=Math.floor(performance.now()/280);for(let i=0;i<20;i++){const a=i/20*Math.PI*2;g.fillStyle=(i+bl)%2?'#ffe14a':'#fff';g.beginPath();g.arc(cxp+Math.cos(a)*(R+4.5),cyp+Math.sin(a)*(R+4.5),2.6,0,7);g.fill()}
 g.fillStyle='#d9302a';g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.moveTo(cxp,cyp-R+10);g.lineTo(cxp-11,cyp-R-18);g.lineTo(cxp+11,cyp-R-18);g.closePath();g.fill();g.stroke()}
function whLoop(){const c=$('whc');if(!c||!UI||PS.view!='wheel')return;
 if(WA){const e=Math.min(1,(performance.now()-WA.t0)/WA.d);WTH=WA.f+(WA.to-WA.f)*(1-Math.pow(1-e,3.2));if(e>=1){const fn=WA.fin;WA=null;WTH%=Math.PI*2;fn()}}
 whDraw(c,WTH);requestAnimationFrame(whLoop)}
function whInfo(){const el=$('whi');if(!el)return;const tk=ST.tk|0,W=whS(),busy=!!WA;
 el.innerHTML='<div class="sg" style="grid-template-columns:repeat(3,1fr)"><div class="sq" style="cursor:default"><span class="e">🎟️</span><b>'+tk+'</b><small>Vé quay</small></div><div class="sq" style="cursor:default"><span class="e">🪙</span><b>'+fmtXu(ST.xu)+'</b><small>Xu</small></div><div class="sq" style="cursor:default"><span class="e">💎</span><b>'+(ST.dia|0)+'</b><small>Kim cương</small></div></div>'+
 '<div class="mut" style="text-align:center;margin:4px 0">Mỗi đơn khí cầu giao xong = 1 vé • Hết vé quay tốn '+WH_COST+' Xu/lượt<br><small>Bảo hiểm: chắc chắn có 1 💎 trong '+WH_PMIN+'–'+WH_PITY+' lượt (đã quay '+W.p+' lượt)</small></div>';
 const b=$('whb');if(!b)return;const useT=Math.min(tk,10),cost10=(10-useT)*WH_COST,ok1=!busy&&(tk>0||ST.xu>=WH_COST),ok10=!busy&&ST.xu>=cost10;
 b.innerHTML='<button class="b w'+(ok1?'':' z')+'" onclick="whGo(1)">🎡 Quay 1 lần ('+(tk>0?'dùng 1 vé':WH_COST+' Xu')+')</button><button class="b w'+(ok10?'':' z')+'" onclick="whGo(10)">⚡ Quay nhanh x10 ('+(useT?useT+' vé':'')+(useT&&cost10?' + ':'')+(cost10?cost10+' Xu':'')+')</button>'}
window.wheelUI=()=>{PS.view='wheel';WA=null;whS();
 openUI(head('🎡 Vòng quay may mắn')+'<div style="text-align:center"><canvas id="whc" width="260" height="276" style="width:100%;max-width:300px"></canvas></div><div id="whr" style="text-align:center;min-height:38px;font-weight:800;color:#3a2412;font-size:14px;margin:2px 0"></div><div id="whb" class="pf"></div><div id="whi"></div>'+
  '<div class="mut"><b>Các ô thưởng</b></div><div class="sg" style="grid-template-columns:repeat(3,1fr)">'+WHS.map(s=>'<div class="sq" style="cursor:default;background:'+s.c+'55"><span class="e">'+(s.dia?'💎':'🪙')+'</span><b>'+(s.dia?'Kim cương':s.xu+' Xu')+'</b></div>').join('')+'</div>');
 whInfo();whLoop()};
window.whGo=n=>{if(WA)return;const tk=ST.tk|0,useT=Math.min(tk,n),cost=(n-useT)*WH_COST;
 if(ST.xu<cost||(n==1&&!tk&&ST.xu<WH_COST))return toast('🪙 Không đủ Xu để quay (cần '+cost+' Xu)');
 ST.tk=tk-useT;ST.xu-=cost;
 const res=[];for(let k=0;k<n;k++){const i=whRoll();res.push(i);const s=WHS[i];if(s.xu)ST.xu+=s.xu;else ST.dia=(ST.dia|0)+s.dia}
 xuUp();save();
 const last=res[res.length-1];let msg;
 if(n==1)msg=res[0]==3?'💎 KIM CƯƠNG!!! Chúc mừng bạn!':'🎉 Trúng '+whName(res[0])+'!';
 else{const c={};res.forEach(i=>c[i]=(c[i]||0)+1);const xu=res.reduce((a,i)=>a+(WHS[i].xu||0),0),dia=c[3]||0;
  msg='⚡ x10: '+Object.keys(c).sort((a,b)=>WHS[a].xu-WHS[b].xu).map(i=>(WHS[i].dia?'💎':WHS[i].xu+' Xu')+' ×'+c[i]).join(' • ')+'<br>Tổng: +'+xu+' Xu'+(dia?' • +'+dia+' 💎':'')}
 const from=WTH%(Math.PI*2),jit=(Math.random()-.5)*Math.PI/3*.7,to=from+Math.PI*2*(n==1?5:2)+(((-(last+.5)*Math.PI/3+jit)-from)%(Math.PI*2)+Math.PI*2)%(Math.PI*2),tok=++WTOK,
  fin=()=>{const r=$('whr');if(r)r.innerHTML=msg;whInfo();if(res.includes(3))toast('💎 Bạn vừa trúng Kim cương!')};
 WA={t0:performance.now(),d:n==1?3200:1500,f:from,to,fin};whInfo();const r=$('whr');if(r)r.textContent='🎡 Đang quay...';
 setTimeout(()=>{if(WA&&WTOK==tok){WA=null;WTH=to%(Math.PI*2);toast(msg.replace(/<br>/g,' '));whInfo()}},(n==1?3200:1500)+250);
};

// ============================================================
//  MIẾU CẦU PHÚC
// ============================================================
const BLESS=['Lộc đến nhà vui, tài lộc đầy kho.','Bình an là phúc lớn nhất — hôm nay mọi việc suôn sẻ.','Gieo hạt hôm nay, gặt quả ngọt ngày mai.','Người hiền gặp lành, đi đâu cũng có bạn tốt.','Mưa thuận gió hòa, mùa màng bội thu.','Một nụ cười hôm nay, vạn điều may đến.','Lòng thiện ắt được phúc dày.','Chậm mà chắc, việc lớn rồi cũng thành.','Quý nhân sắp tới, hãy mở lòng đón nhận.','Sức khỏe dồi dào, tinh thần phấn chấn.','Vận may đang gõ cửa, đừng ngại mở ra.','Tâm an thì vạn sự an.','Mỗi bước nhỏ hôm nay là một cột mốc ngày mai.','Gia đình êm ấm, bạn bè quây quần.','Của ít lòng nhiều, tấm lòng là tài sản quý.','Đường xa có bạn, gian nan hóa nhẹ.','Nước chảy đá mòn, kiên trì ắt nở hoa.','Làm điều tốt dù nhỏ, phúc sẽ nhân đôi.','Trời không phụ người chăm chỉ.','Tin vui đang trên đường về với bạn.','Thuận buồm xuôi gió, ra khơi cá đầy khoang.','Hoa nở đúng mùa, việc của bạn cũng sắp nở rộ.','Biết đủ là đủ, lòng thảnh thơi là giàu.','Nụ cười của bạn làm sáng cả con phố.','Điều mong đợi sẽ đến vào lúc bạn không ngờ nhất.','Uống nước nhớ nguồn — biết ơn mang lại may mắn.','Cứ bình tĩnh bước đi, con đường phía trước rất đẹp.','Chúc bạn một ngày thật nhẹ nhàng và đáng nhớ.','Chén trà ấm, lòng thư thái, vạn sự hanh thông.','Mai sau rực rỡ bởi hôm nay bạn đã cố gắng.'];
const MIEU_DAY=5,MIEU_XU=20;
const mieuS=()=>{const d=new Date().toDateString();if(!ST.mieu||ST.mieu.d!=d)ST.mieu={d,n:0,x:0,l:-1};return ST.mieu};
let MQ={ph:0,t0:0,msg:'',lit:0};
window.mieuUI=()=>{PS.view='mieu';const M=mieuS();MQ.ph=0;MQ.lit=Math.min(3,M.n);
 openUI(head('⛩️ Miếu cầu phúc')+'<div style="text-align:center;font-weight:800;color:#8a2f27;letter-spacing:1px">HIỀN NHÂN ĐẤT NƯỚC</div><div style="text-align:center"><canvas id="mc" width="120" height="84" style="width:100%;max-width:360px;image-rendering:pixelated;border:2px solid #7a4a26;background:#e9cfae"></canvas></div><div id="mm" class="mut" style="text-align:center;min-height:54px"></div><div class="pf"><button class="b" id="mb1" onclick="mieuLight()">🪔 Thắp nhang</button><button class="b" id="mb2" onclick="mieuDraw()">🎋 Xin xăm</button></div>');
 mieuInfo();mieuLoop()};
function mieuInfo(){const M=mieuS(),ph=M.n-M.x,el=$('mm');if(!el)return;const b1=$('mb1'),b2=$('mb2');
 if(MQ.ph==0)el.innerHTML='Hôm nay đã xin <b>'+M.x+'/'+MIEU_DAY+'</b> lần • phiếu xin xăm: <b>'+ph+'</b><br><small>Thắp nhang để nhận 1 phiếu, rồi bấm xin xăm nhận +'+MIEU_XU+' Xu.</small>'+(M.l>=0&&M.x>0?'<div style="margin-top:4px">📜 Quẻ gần nhất: <i>'+escH(BLESS[M.l])+'</i></div>':'');
 else if(MQ.ph==1)el.innerHTML='Đang lắc ống xăm... 🎋';
 else el.innerHTML='<div style="font-size:15px;color:#8a2f27;font-weight:800">📜 Quẻ số '+(MQ.k+1)+'</div><div style="font-size:14px;margin:4px 0">“'+escH(MQ.msg)+'”</div><b style="color:#2e7d32">+'+MIEU_XU+' Xu</b>';
 if(b1)b1.disabled=MQ.ph==1||M.n>=MIEU_DAY;if(b2)b2.disabled=MQ.ph==1||ph<=0}
window.mieuLight=()=>{const M=mieuS();if(M.n>=MIEU_DAY)return toast('⛩️ Hôm nay bạn đã thắp đủ '+MIEU_DAY+' lần, mai quay lại nhé');
 M.n++;MQ.ph=0;MQ.lit=Math.min(3,M.n);save();toast('🪔 Đã thắp nhang — bạn nhận 1 phiếu xin xăm');mieuInfo()};
window.mieuDraw=()=>{const M=mieuS();if(M.n-M.x<=0)return toast('🎋 Cần thắp nhang để nhận phiếu xin xăm');if(M.x>=MIEU_DAY)return toast('⛩️ Hôm nay đã đủ '+MIEU_DAY+' lần xin xăm');
 let k;do k=Math.floor(Math.random()*BLESS.length);while(k==M.l&&BLESS.length>1);
 M.x++;M.l=k;ST.xu+=MIEU_XU;xuUp();save();MQ.ph=1;MQ.t0=performance.now();MQ.k=k;MQ.msg=BLESS[k];mieuInfo();
 setTimeout(()=>{if(PS.view=='mieu'&&UI&&$('mc')){MQ.ph=2;mieuInfo()}},1400)};
function mieuLoop(){const c=$('mc');if(!c||!UI||PS.view!='mieu')return;const g=c.getContext('2d'),t=performance.now()/1000,R=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h)};
 g.clearRect(0,0,120,84);
 R('#ead3b0',0,0,120,60);R('#d9b98f',0,56,120,28);for(let x=0;x<120;x+=15)R('#c9a67a',x,56,1,28);
 R('#cf7d70',0,0,14,60);R('#cf7d70',106,0,14,60);R('#e29a8c',0,0,3,60);R('#b45f54',11,0,3,60);R('#b45f54',106,0,3,60);
 for(const x of[4,110])for(const y of[6,26]){R('#e2c36b',x,y,6,1);R('#e58a7a',x,y+1,6,8);R('#e2c36b',x,y+9,6,1)}
 // bệ + tượng
 R('#d9d0c0',38,34,44,22);R('#ece4d4',38,34,44,2);R('#c2b8a6',38,50,44,6);
 for(let i=0;i<7;i++)R('#f0b7c4',42+i*5,32,4,3);
 g.fillStyle='rgba(255,236,170,.45)';g.beginPath();g.arc(60,18,17,0,6.283);g.fill();
 R('#c9a24d',48,22,24,12);R('#e0bf6a',48,22,5,12);R('#a8832f',68,22,4,12);R('#c9a24d',46,26,5,8);R('#c9a24d',69,26,5,8);
 R('#e0bf6a',55,12,10,10);R('#f0d98a',56,12,3,8);R('#a8832f',55,11,10,2);R('#a8832f',57,8,6,3);R('#c9a24d',59,6,2,2);
 R('#f7f2e2',56,19,8,6);R('#e8e0c8',58,24,4,3);R('#6b5a2e',57,15,2,1);R('#6b5a2e',61,15,2,1);R('#c98f5e',59,17,2,1);
 R('#b08a2e',54,29,12,3);
 // bàn thờ
 R('#a24f45',20,50,80,4);R('#c4675a',20,50,80,1);R('#8a5a34',24,54,72,24);R('#a9724a',24,54,72,2);R('#6b4524',24,76,72,2);
 // hoa quả, hoa sen
 R('#9ccaa6',26,46,10,4);R('#e0a099',28,43,4,3);R('#f2d79a',32,44,4,3);
 R('#9ccaa6',84,46,10,4);R('#f2d79a',86,43,4,3);R('#a8d8b0',90,44,4,3);
 // nến
 for(const x of[40,78]){R('#f7efe0',x,44,3,6);const f=Math.sin(t*9+x)*1;R('#ffd96a',x,41+f,3,3);R('#fff4b0',x+1,42+f,1,1)}
 // lư hương
 R('#8d6b3f',52,44,16,8);R('#b58d52',52,44,16,2);R('#6b4f2d',54,52,12,2);
 for(let i=0;i<MQ.lit;i++){const x=55+i*5;R('#c4675a',x,34,1,10);R('#ff8a5a',x,33,1,1);
  for(let k=0;k<4;k++){const q=(t*.5+k*.25+i*.2)%1;R('rgba(230,224,212,'+(.55*(1-q)).toFixed(2)+')',x+Math.sin(q*6+i)*3,33-q*26,2,2)}}
 // ống xăm
 if(MQ.ph==1){const e=(performance.now()-MQ.t0)/1000,sh=Math.sin(e*28)*3;R('#b58d52',50+sh,58,18,18);R('#d9b36a',50+sh,58,18,3);R('#8d6b3f',50+sh,73,18,3);for(let i=0;i<4;i++)R('#f4e6c0',53+i*3+sh,52-Math.abs(Math.sin(e*28+i))*3,1,8)}
 else if(MQ.ph==2){R('#f4e6c0',66,58,3,14);R('#c4675a',66,58,3,3)}
 requestAnimationFrame(mieuLoop)}

// ============================================================
//  SHOP
// ============================================================
const SHOP={m:{t:'🐃 Thú cưỡi',all:()=>MOUNTS,pr:[4000,5500,4200,9000,1500]},p:{t:'🐾 Pet',all:()=>PETS,pr:[250,900,350,300,1100,500]},s:{t:'👕 Set',all:()=>SETS,pr:[0,600,500,450,450,500,800,800,1500,2800,3500,20000, 500,500,600,1000,800,400,400,5000,5000, 0,0,0,0,0,0,0,0,0, 900,700]},h:{t:'🧢 Tóc & mũ',all:()=>HAIRS,pr:[0,150,200,250,300,300, 1000,400,600,200,250,300,1000, 4500,3500,6000,4000,3500,2800, 2200,2000,3200,6000,4500,2800, 0,0,0, 800,500]},
 e:{t:'😄 Biểu cảm',all:()=>EXPRS,pr:[0,0,0,0,0,0,18000]},
 a:{t:'🎀 Phụ kiện',all:()=>ACCS,pr:[300,450, 0,0,0,0, 5000,1500,300,800]}};
const price=(k,i)=>{const v=SHOP[k].pr[i];return v==null?500:v};
let SH_TAB='m',SH_I=-1,SH_DIR=0,shRaf=0;
window.psShop=(tab)=>{if(typeof ownE=='function')ownE();if(tab)SH_TAB=tab;PS.view='shop';SH_I=-1;const S=SHOP[SH_TAB],L=S.all(),own=ST.own[SH_TAB],mt=SH_TAB=='m';
 let h=head('🏘️ Shop Phố xá')+'<div class="mut">🪙 Bạn có <b>'+fmtXu(ST.xu)+'</b> Xu</div><div class="tabs" style="flex-wrap:wrap">'+['m','p','s','h','e','a'].map(k=>'<button class="b'+(k==SH_TAB?' on':'')+'" onclick="psShop(\''+k+'\')">'+SHOP[k].t+'</button>').join('')+'</div>';
 h+='<div class="sg" style="grid-template-columns:repeat(3,1fr)">'+L.map((x,i)=>{const has=own.includes(i);if(x.ach&&!has)return '';
  return '<button class="sq'+(has?' z':'')+'" onclick="psItem('+i+')"><canvas class="shc" data-i="'+i+'" width="'+(mt?72:44)+'" height="'+(mt?68:SH_TAB=='p'?52:44)+'" style="width:'+(mt?88:57)+'px;height:'+(mt?83:SH_TAB=='p'?68:57)+'px;image-rendering:pixelated"></canvas><b>'+x.n+'</b><small>'+(has?'✓ Đã có':'🪙 '+price(SH_TAB,i).toLocaleString('vi-VN'))+'</small></button>'}).join('')+'</div>';
 h+='<div class="mut">Đồ đã mua nằm trong 🎒 Túi. Chạm vào món để xem thử & mua.</div>';
 openUI(h);shPaint()};
function shDraw(g,k,ix,o,t,big){
 if(k=='h')o.hair=ix;else if(k=='s')o.set=ix;else if(k=='e'){o.e=ix;if(SETS[o.set]&&SETS[o.set].mascot)o.set=0}else if(k=='a')o.acc=ix;
 if(big){const d=AVDIR[SH_DIR];o.d=d;o.a=t;o.mv=1;g.clearRect(0,0,110,92);g.fillStyle='rgba(60,110,40,.28)';g.fillRect(0,78,110,14);
  if(k=='m')drawRide(g,55,80,o,ix,t);else if(k=='e'){o.mv=0;g.save();g.scale(3,3);drawAv(g,8,0,o);g.restore()}else{drawAv(g,k=='p'?34:45,50,o);if(k=='p')drawPet(g,d==3?12:68,82,d,1,t,t,ix)}return}
 if(k=='h'){g.save();g.scale(2,2);drawAv(g,1,1,o);g.restore()}
 else if(k=='s')drawAv(g,12,5,o);
 else if(k=='a')drawAv(g,4,5,o);
 else if(k=='m')drawRide(g,36,64,Object.assign({},o,{d:3,a:t,mv:0}),ix,t);
 else if(k=='e'){g.save();g.scale(3,3);const dr=()=>drawAv(g,-3,-4,o);if(ix==6)tlFreeze(2500,dr);else dr();g.restore()}
 else{g.save();g.scale(2,2);drawPet(g,11,24,0,0,0,t,ix);g.restore()}}
function shPaint(){const A=ST.av,t=performance.now()/1000;document.querySelectorAll('canvas.shc').forEach(c=>{const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);shDraw(g,SH_TAB,+c.dataset.i,{d:0,a:0,mv:0,sit:0,hair:A.h,set:A.s,e:A.e},t,0)})}
window.psItem=i=>{if(typeof ownE=='function')ownE();SH_I=i;const S=SHOP[SH_TAB],x=S.all()[i],has=ST.own[SH_TAB].includes(i),pr=price(SH_TAB,i);PS.view='item';
 const eq=ST.av[SH_TAB]==i;
 openUI(head(S.t+' — '+x.n)+'<div style="text-align:center"><canvas id="shp" width="110" height="92" style="width:220px;height:184px;max-width:100%;image-rendering:pixelated;background:linear-gradient(#d6e8f2,#e8efd6 70%);border:2px solid #7a4a26;cursor:pointer" onclick="SH_DIR=(SH_DIR+1)%4"></canvas><div class="mut" style="margin:2px 0 6px">Chạm vào hình để xoay • bạn có 🪙 <b>'+fmtXu(ST.xu)+'</b> Xu</div></div>'+
 '<div class="pf">'+(has?'<button class="b" onclick="psUse('+i+')">'+(eq?'✓ Đang dùng':'✨ Dùng ngay')+'</button>':'<button class="b" onclick="psBuy('+i+')">🪙 Mua — '+pr.toLocaleString('vi-VN')+' Xu</button>')+'<button class="b" onclick="psShop()">⬅ Quay lại</button></div>');
 if(!shRaf)shLoop()};
function shLoop(){const c=$('shp');if(!c||!UI||PS.view!='item'){shRaf=0;return}const A=ST.av,g=c.getContext('2d'),t=performance.now()/1000;
 shDraw(g,SH_TAB,SH_I,{d:0,a:t,mv:1,sit:0,hair:A.h,set:A.s,e:A.e},t,1);shRaf=requestAnimationFrame(shLoop)}
window.psBuy=i=>{if(typeof ownE=='function')ownE();const k=SH_TAB,pr=price(k,i),own=ST.own[k];if(own.includes(i))return psItem(i);
 if(SHOP[k].all()[i].ach)return toast(SHOP[k].all()[i].bd?'❄️ Món này đổi bằng Huy hiệu tuyết ở Ông già Noel (Làng tuyết)':'🏆 Pet này chỉ nhận được từ mốc quà trong Thẻ');
 if(ST.xu<pr)return toast('🪙 Chưa đủ Xu — còn thiếu '+(pr-ST.xu).toLocaleString('vi-VN')+' Xu');
 ST.xu-=pr;own.push(i);xuUp();save();toast('🛍️ Đã mua '+SHOP[k].all()[i].n+'!');psItem(i)};
window.psUse=i=>{const k=SH_TAB;if(!ST.own[k].includes(i))return;ST.av[k]=i;if(k=='m'&&Pl.sit){Pl.sit=0;Pl.mv=0}if(k=='p')petReset();save();toast('✨ Đã dùng '+SHOP[k].all()[i].n);psItem(i)};

// ============================================================
//  TIỆM NỘI THẤT (giá theo độ đẹp: 100–4000 Xu). Mua → vào Túi nội thất (ST.hm.i), mở khi ở trong nhà.
// ============================================================
const FURN_PR={clk:100,cal:100,chr:100,mir:120,lmp:120,drw:130,bsk:140,tbl:140,plt:150,cat:160,rug:170,pic:180,shf:190,wrd:200,tv:220,arm:230,din:260,sofa:300,ctbl:500,cchr:500,clmp:500,wcl:500,wph:500,wpc:500,ftv:500,pcd:4000,ofd:1000,bkS:500,bkL:700,mdl:1000,spk:2000,mai:1200,quat:700,hphi:1500,cchuc:500,dlong:300,nguqua:800,thong:1500,neon:1200,vong:600,day:350,tat:200,qua:250};
window.FURN_PR=FURN_PR;
window.psFurn=()=>{PS.view='furn';if(typeof hmInit=='function')hmInit();const I=ST.hm.i,P=ST.hm.p,ks=Object.keys(CAT).sort((a,b)=>(FURN_PR[a]||200)-(FURN_PR[b]||200));
 let h=head('🛋️ Tiệm nội thất')+'<div class="mut">🪙 Bạn có <b>'+fmtXu(ST.xu)+'</b> Xu • đồ mua về nằm trong <b>🎒 Túi nội thất</b> (vào nhà → 🛠️ Trang trí để bày)</div><div class="g3">';
 h+=ks.map(k=>{const c=CAT[k],pr=FURN_PR[k]||200,own=(I[k]||0)+P.filter(o=>o[0]==k).length;
  return '<div class="fcd"><canvas class="fc" data-k="'+k+'" width="60" height="52"></canvas><b>'+c[0]+'</b><small>'+c[1]+'×'+c[2]+(c[3]=='w'?' • treo tường':c[3]=='r'?' • thảm':'')+(own?' • có '+own:'')+'</small>'+
   '<button class="b" onclick="psFurnBuy(\''+k+'\')">🪙 '+pr+'</button></div>'}).join('');
 openUI(h+'</div>');
 document.querySelectorAll('canvas.fc').forEach(c=>{try{const g=c.getContext('2d'),im=dspr(c.dataset.k,0),sc=Math.max(1,Math.min(Math.floor(56/im.width),Math.floor(48/im.height),3));g.imageSmoothingEnabled=false;g.clearRect(0,0,60,52);
  g.drawImage(im,Math.round((60-im.width*sc)/2),Math.round((52-im.height*sc)/2),im.width*sc,im.height*sc)}catch(e){}})};
window.psFurnBuy=k=>{if(!CAT[k])return;if(typeof hmInit=='function')hmInit();const pr=FURN_PR[k]||200;
 if(ST.xu<pr)return toast('🪙 Chưa đủ Xu — còn thiếu '+(pr-ST.xu).toLocaleString('vi-VN')+' Xu');
 ST.xu-=pr;ST.hm.i[k]=(ST.hm.i[k]||0)+1;xuUp();save();toast('🛋️ Đã mua '+CAT[k][0]+' — nằm trong Túi nội thất (vào nhà để bày)');
 const box=document.getElementById('ui'),top=box?box.scrollTop:0;psFurn();if(box)box.scrollTop=top};

function psAct(a,h){const[t,v]=a.split(':');
 if(t=='shop')return psShop(v);
 if(t=='lot')return psLot();
 if(t=='wheel')return wheelUI();
 if(t=='furn')return psFurn();
 if(t=='dia')return diaShop();
 if(t=='mieu')return mieuUI()}
})();
