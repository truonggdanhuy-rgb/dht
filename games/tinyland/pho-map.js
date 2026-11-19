/* ============================================================
   PHỐ XÁ — map online thứ 2 (dùng chung hệ thống mạng của Công viên)
   - Tiệm Vàng Kim Long (đổi chỗ với tiệm cắt tóc): giá vàng đổi theo phiên, mua/bán trang sức & vàng miếng, lời/lỗ
   - Ngân hàng Vàng (thay quán Phở bò): gửi tiết kiệm, sổ tiết kiệm, lãi cộng dồn mỗi ngày
   - Shop: bán thú cưỡi / pet / set / tóc-mũ (đồ trong Túi chỉ có khi đã mua)
   - Cửa hiệu Trùm kim cương (vỉa hè dưới): mặt tiền pastel, biển neon + biển dọc; Hòm kho báu & Đống kim cương bán ở Tiệm nội thất 500 Xu/món
   - Tiệm nội thất (nhà phố số 1): bán đồ trang trí nhà 100–4000 Xu, đồ mua về nằm trong Túi nội thất (chỉ mở khi ở trong nhà)
   - Sạp vé số (xổ sau 2 phút, lồng quay), Miếu cầu phúc (xin xăm 5 lần/ngày)
   - Khách phố tự thoại thưa thớt, vỉa hè, ghế nhựa, bánh mì, trà đá, báo
   ============================================================ */
(()=>{
'use strict';
const PW=1440,PH=640,TS=16,GC=PW/TS,GR=PH/TS,CV=window.CV;
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
const mkHouse=(w,h,o)=>o.gold?mkGoldShop(w,h):mk(w,h,(g,r)=>{
 const W=o.wall,WL=shade(W,.14),WD=shade(W,-.12),WK=shade(W,-.24),TR=o.trim||'#8e7d6a';
 const gh=46,roofY=o.tile?16:o.tank?18:6,top=roofY+8,nf=Math.max(1,Math.round((h-top-gh)/46)),fh=Math.floor((h-top-gh)/nf);
 // mái ngói trước / bồn nước trên sân thượng
 if(o.tile){for(let i=0;i<14;i++){const ins=Math.round(i*.9);r(i%3==0?'#d8a08c':'#cf9380',ins,2+i,w-ins*2,1)}r('#b87a68',0,15,w,2);for(let x=3;x<w-3;x+=5)r('#e4b4a2',x,5+(x%3),2,1)}
 if(o.tank){r('#bfc9cf',w-34,2,20,14);r('#dde5ea',w-34,2,20,3);r('#9aa6ad',w-34,13,20,3);r('#8c979d',w-30,16,2,4);r('#8c979d',w-18,16,2,4);E(r,'#dde5ea',w-24,2,10,2)}
 r(W,0,top,w,h-top);r(WL,0,top,2,h-top);r(WD,w-3,top,3,h-top);
 r(TR,0,roofY,w,4);r(shade(TR,.22),0,roofY,w,1);r(shade(TR,-.2),0,roofY+4,w,1);r(WD,0,roofY+5,w,3);
 const win=(x,y,ww,hh)=>{r('#7f7062',x-1,y-1,ww+2,hh+2);r('#bcd6e2',x,y,ww,hh);r('#dcecf3',x,y,2,hh);r('#dcecf3',x+3,y,1,hh);r('#9cbccb',x,y+hh-3,ww,3);r('#7f7062',x,y+Math.floor(hh/2),ww,1);
  r(o.shut||'#a7c5ad',x-4,y-1,3,hh+2);r(o.shut||'#a7c5ad',x+ww+1,y-1,3,hh+2);r('rgba(0,0,0,.12)',x-4,y+2,3,1);r('rgba(0,0,0,.12)',x+ww+1,y+2,3,1);r('#7f7062',x-2,y+hh+1,ww+4,2)};
 for(let f=0;f<nf;f++){const y0=top+f*fh;r(WK,0,y0+fh-3,w,3);r(WL,0,y0+fh-3,w,1);
  const wins=w>=88?2:1;for(let k=0;k<wins;k++){const wx=wins==2?Math.round(w*(k?.64:.24))-7:Math.round(w/2)-8,wy=y0+4;win(wx,wy,14,16);
   if(o.balc&&f==nf-1){r('#6e7b77',wx-5,wy+20,24,1);for(let x=wx-5;x<wx+19;x+=3)r('#6e7b77',x,wy+20,1,5);r('#6e7b77',wx-5,wy+25,24,1);
    r('#b9805e',wx+1,wy+15,5,5);r('#7fb083',wx,wy+9,7,6);r('#e59ab3',wx+2,wy+9,2,2);r('#b9805e',wx+10,wy+16,5,4);r('#8fbf8a',wx+9,wy+11,7,5)}}
  if(false&&o.laundry&&f==0){const ly=y0+27;r('#5a5048',3,ly,w-6,1);['#e8b0b0','#b0d0e8','#f0e0a0','#c0e0b8','#e0c0e0'].forEach((c,i)=>{const lx=6+i*Math.floor((w-14)/5);r(c,lx,ly+1,6,7);r(shade(c,-.15),lx,ly+7,6,1)})}}
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
 // biển hiệu: khung vàng + nền tối (chữ neon chạy + dải đèn LED được vẽ động ở drawSign)
 if(!o.plain){ r('#2c1c0e',3,y0-24,w-6,24);r('#e2b93b',4,y0-23,w-8,22);r('#ffe27a',4,y0-23,w-8,1);r('#9a7414',4,y0-2,w-8,1);
 r('#140c26',5,y0-22,w-10,20);r('#241640',5,y0-22,w-10,1);if(o.sign.m){r('#0a0618',6,y0-10,w-12,8);r('#3a2a5a',6,y0-10,w-12,1)}}
 // chậu cây hai bên cửa
 for(const px of[0,w-6]){r('#b9805e',px,h-8,6,8);r('#d49a74',px,h-8,6,2);r('#6fae78',px,h-14,6,6);r('#8fcf98',px+1,h-14,2,2);r('#e59ab3',px+3,h-13,2,2)}
 r('rgba(0,0,0,.1)',0,h-2,w,2)});
// ---------- NGÂN HÀNG (thay quán Phở bò): mặt tiền cột La Mã màu vàng kem ----------
const mkBank=()=>mk(80,128,(g,r)=>{
 const CR='#f6ebc8',CRL='#fff7de',CRD='#d8c690',GD='#e2b93b',GDL='#ffe27a',GDD='#9a7414';
 // bậc thềm
 r('#d9d0c0',0,120,80,8);r('#ece5d6',0,120,80,2);r('#cfc6b6',5,114,70,6);r('#ece5d6',5,114,70,1);
 // thân nhà + tường
 r(CR,5,62,70,52);r(CRL,5,62,3,52);r(CRD,72,62,3,52);
 // cửa sổ khe 2 bên (song vàng)
 for(const x of[12,60]){r(GDD,x-1,76,10,28);r('#26354f',x,77,8,26);r('#6f8fb8',x,77,8,4);r(GD,x+3,77,2,26);r(GD,x,88,8,1);r(GDL,x,77,8,1);r(GD,x-2,104,12,2)}
 // cột
 for(const x of[6,20,54,68]){r(CRL,x,62,6,52);r(CR,x+1,62,4,52);r(CRD,x+4,62,2,52);r(GD,x-1,62,8,3);r(GDL,x-1,62,8,1);r(GDD,x-1,64,8,1);r(GD,x-1,111,8,3);r(GDD,x-1,113,8,1)}
 // cửa chính 2 cánh
 r(GDD,27,82,26,34);r(GD,28,83,24,2);r('#5a3208',29,86,22,30);r('#8a5416',30,87,9,29);r('#8a5416',41,87,9,29);r('#b07224',31,89,7,10);r('#b07224',42,89,7,10);r('#b07224',31,102,7,12);r('#b07224',42,102,7,12);
 r(GDL,37,100,2,4);r(GDL,41,100,2,4);r('#ffe27a',30,86,20,1);r('#fff3b0',39,86,2,30);r(GD,39,87,2,29);
 for(const[x,y]of[[33,92],[45,92],[33,106],[45,106]])r(GDL,x,y,2,2);
 // đèn vàng 2 bên cửa
 for(const x of[24,54]){r(GDD,x+1,76,1,6);E(r,'#fff3b0',x+1,74,3,3);E(r,GDL,x+1,74,2,2)}
 // mái đầu hồi (tam giác) + huy hiệu đồng xu
 for(let i=0;i<30;i++){const hw=Math.round(i*38/29);r(CR,40-hw,5+i,hw*2,1);r(GD,40-hw,5+i,2,1);r(GD,40+hw-2,5+i,2,1)}
 for(let i=9;i<28;i++){const hw=Math.round((i-6)*34/23);r('#f1dc98',40-hw,5+i,hw*2,1)}
 E(r,GDD,40,24,9,9);E(r,GD,40,24,8,8);E(r,GDL,40,23,6,6);E(r,GD,40,24,5,5);
 g.textAlign='center';g.font='900 11px Nunito, "Segoe UI", sans-serif';g.fillStyle='#8a6a00';g.fillText('$',40,28);g.fillStyle='#fff3b0';g.fillText('$',40,27);
 r(GD,38,1,4,5);r(GDL,38,1,4,1);
 // phào chỉ + nền bảng hiệu (chữ neon vẽ động)
 r(GD,0,34,80,3);r(GDL,0,34,80,1);r(GDD,0,36,80,1);r(CR,2,37,76,2);
 r('#2c1c0e',3,38,74,24);r(GD,4,39,72,22);r(GDL,4,39,72,1);r(GDD,4,60,72,1);r('#140c26',5,40,70,20);r('#241640',5,40,70,1);r('#0a0618',6,52,68,8);r('#3a2a5a',6,52,68,1);
 r(CRD,2,62,76,2);
 // chậu cây
 for(const px of[0,74]){r('#b9805e',px,106,6,8);r('#d49a74',px,106,6,2);r('#6fae78',px,100,6,6);r('#8fcf98',px+1,100,2,2);r(GDL,px+3,101,2,2)}});
// ---------- TIỆM VÀNG sang trọng: đá đỏ rượu + cột vàng + tủ kính trưng bày ----------
const mkGoldShop=(w,h)=>mk(w,h,(g,r)=>{
 const GD='#e2b93b',GDL='#ffe27a',GDD='#9a7414',WN='#4a1220',WNL='#6e1e30',WND='#2e0a14',MB='#f4ead2';
 const top=14,y0=h-46,fy=y0+13,fhh=h-fy;
 // mái chỉ vàng + lan can
 r(GDD,0,6,w,4);r(GD,0,7,w,3);r(GDL,0,7,w,1);r(WND,0,10,w,3);
 for(let x=2;x<w-2;x+=4){r(GD,x,2,2,5);r(GDL,x,2,2,1)}
 r(GD,0,1,w,2);r(GDL,0,1,w,1);
 // thân tường đá đỏ rượu
 r(WN,0,top,w,h-top);r(WNL,0,top,3,h-top);r(WND,w-3,top,3,h-top);
 for(let y=top+4;y<y0-24;y+=9){r('rgba(255,226,122,.10)',3,y,w-6,1)}
 // huy hiệu kim cương giữa
 r(GDD,w/2-9,top+2,18,16);r(GD,w/2-8,top+3,16,14);
 for(let i=0;i<7;i++){r(i<4?'#e8fbff':'#9fe3f0',w/2-i-0,top+5+i,i*2+1,1)}
 r('#e8fbff',w/2-3,top+5,7,1);r('#ffffff',w/2-1,top+6,2,1);
 // cột vàng hai bên
 for(const x of[1,w-8]){r(GDD,x,top,7,h-top-4);r(GD,x+1,top,5,h-top-4);r(GDL,x+1,top,1,h-top-4);r(GDD,x+5,top,1,h-top-4);r(GDL,x-1,top,9,2);r(GDD,x-1,top+2,9,1);r(GDL,x-1,h-10,9,2);r(GDD,x-1,h-8,9,1)}
 // cửa sổ trưng bày tầng 2 (rèm đỏ + đèn)
 for(const k of[0,1]){const wx=k?w-34:12;r(GDD,wx-1,top+22,22,22);r('#1b0a10',wx,top+23,20,20);r('#7a1c2c',wx,top+23,20,3);
  for(let i=0;i<4;i++)r('#a8283c',wx+1+i*5,top+26,3,17);r('#ffe27a',wx+10,top+30,1,2);E(r,'#fff3b0',wx+10,top+40,4,1)}
 // mái che sọc đen-vàng
 for(let x=0;x<w;x+=8){const c=(x/8)%2?GD:'#2a1218';r(c,x,y0,8,9);r('rgba(255,255,255,.22)',x,y0,8,1)}
 for(let x=0;x<w;x+=8){const c=(x/8)%2?GD:'#2a1218';r(c,x,y0+9,8,2);r(c,x+2,y0+11,4,1)}
 r('rgba(0,0,0,.18)',0,y0+12,w,3);
 // mặt tiền: nền đen + 2 tủ kính + cửa giữa
 r(GDD,6,fy,w-12,fhh);r('#1b0a10',8,fy+2,w-16,fhh-2);
 for(const k of[0,1]){const bx=k?w-29:9;r(GD,bx,fy+3,20,fhh-5);r('#241018',bx+1,fy+4,18,fhh-7);
  r('#c8eaf2',bx+1,fy+4,2,fhh-7);r('rgba(255,255,255,.18)',bx+4,fy+4,1,fhh-7);
  r(WNL,bx+1,fy+14,18,3);r(GDL,bx+1,fy+14,18,1);r(WNL,bx+1,fy+25,18,3);r(GDL,bx+1,fy+25,18,1);
  // trang sức trong tủ
  for(const[ix,iy]of[[bx+4,fy+10],[bx+10,fy+9],[bx+15,fy+10]]){E(r,GDL,ix,iy,2,2);r('#fff9c8',ix-1,iy-1,1,1)}
  r(GDL,bx+4,fy+20,12,1);for(let i=0;i<5;i++)r(GD,bx+4+i*3,fy+21,2,2);r('#fff9c8',bx+4,fy+20,1,1);
  r(GD,bx+3,fy+32,5,3);r(GDL,bx+3,fy+32,5,1);r(GD,bx+9,fy+31,6,4);r(GDL,bx+9,fy+31,6,1);E(r,'#e8fbff',bx+15,fy+33,1,1)}
 const dx=Math.round(w/2)-8;
 r(GDD,dx-1,fy+1,18,fhh-1);r('#3a0e1a',dx,fy+2,16,fhh-2);r(GD,dx+1,fy+3,6,fhh-4);r(GD,dx+9,fy+3,6,fhh-4);r('#5a1426',dx+2,fy+4,4,fhh-6);r('#5a1426',dx+10,fy+4,4,fhh-6);r(GDL,dx+7,fy+fhh*0.5,1,4);r(GDL,dx+8,fy+fhh*0.5,1,4);r(GDL,dx+2,fy+3,4,1);r(GDL,dx+10,fy+3,4,1);
 // biển hiệu
 r('#2c1c0e',3,y0-24,w-6,24);r('#f1c94a',4,y0-23,w-8,22);r('#fff0a0',4,y0-23,w-8,1);r(GDD,4,y0-2,w-8,1);
 r('#140c26',5,y0-22,w-10,20);r('#241640',5,y0-22,w-10,1);r('#0a0618',6,y0-10,w-12,8);r('#3a2a5a',6,y0-10,w-12,1);
 // thảm đỏ + bậc thềm + chậu cây vàng
 r('#d9d0c0',0,h-4,w,4);r('#ece5d6',0,h-4,w,1);r('#a8283c',dx-1,h-5,18,5);r('#d04058',dx-1,h-5,18,1);
 for(const px of[0,w-6]){r(GDD,px,h-9,6,8);r(GD,px,h-9,6,2);r('#6fae78',px,h-15,6,6);r('#8fcf98',px+1,h-15,2,2);r(GDL,px+3,h-14,2,2)}
 r('rgba(0,0,0,.1)',0,h-2,w,2)});

// ===== MIẾU CẦU PHÚC (vẽ lại): mái 2 tầng cong vút, đầu ngói, lưỡng long chầu nguyệt, hoành phi, cửa đỏ đinh vàng, thảm đỏ + bậc đá =====
// Ảnh tĩnh: dựng 1 lần bằng canvas rồi chỉ drawImage → không tốn CPU lúc chơi.
const mkMieu=()=>mk(184,150,(g,r)=>{
 const CX=92;
 const RD='#c0392f',RDL='#e0594a',RDD='#8e2420',GD='#e6c15a',GDL='#fff0a8',GDD='#a8842a';
 const WL='#f6ecd6',WLS='#e8dcc0',WLD='#d2c4a2',SN='#cfc8b8',SNL='#e8e2d4',SND='#a9a190';
 const R1='#efb09b',R2='#dc8b74',R3='#c0694f',R4='#8f4538',WD='#6b4a34',WDD='#43291d';
 // ---------- bậc đá + nền ----------
 r(SND,8,148,168,2);r(SN,8,146,168,2);r(SNL,8,146,168,1);
 r(SND,14,145,156,1);r(SN,14,142,156,3);r(SNL,14,142,156,1);
 r(SND,20,141,144,1);r(SN,20,138,144,3);r(SNL,20,138,144,1);
 r(SN,22,128,140,10);r(SNL,22,128,140,1);r('#bdb5a2',22,136,140,2);r(SND,22,137,140,1);
 for(let x=34;x<160;x+=14)r(SND,x,131,1,6);
 // thảm đỏ từ cửa xuống bậc
 for(let y=128;y<150;y++){const w=Math.round(38+(y-128)*.9),x=CX-(w>>1);r('#b8313a',x,y,w,1);r(GD,x,y,1,1);r(GD,x+w-1,y,1,1);if(y%4==0)r('#d4505a',x+2,y,w-4,1)}
 // ---------- thân nhà ----------
 r(WL,24,90,136,38);r(WLS,24,90,136,2);r(WLD,24,116,136,12);r(SND,24,116,136,1);
 for(let x=26;x<160;x+=8)r('rgba(120,90,50,.10)',x,118,1,10);
 // cửa sổ lá sách hai bên
 for(const wx of[36,133]){
  r(WDD,wx-1,95,18,24);r('#2a1210',wx,96,16,22);
  for(let x=wx;x<wx+16;x+=4){r(RD,x,96,1,22)}
  for(let y=96;y<118;y+=4){r(RD,wx,y,16,1)}
  r(RDL,wx,96,16,1);r(GD,wx+7,106,2,2);r(GDL,wx+7,106,1,1);
  r('#e2d6b8',wx-2,119,20,2);r(SND,wx-2,121,20,1)}
 // cột đỏ
 for(const x of[24,56,121,153]){r(RD,x,88,8,40);r(RDL,x+1,88,2,40);r(RDD,x+6,88,2,40);
  r(GD,x-1,92,10,2);r(GDL,x-1,92,10,1);r(WDD,x-1,88,10,3);
  r(SND,x-1,122,10,6);r(SNL,x-1,122,10,1);r(SN,x-2,126,12,2)}
 // cửa chính: khung gỗ + 2 cánh đỏ đinh vàng
 r(WDD,64,93,56,35);r(WD,65,94,54,34);r('#2a1210',66,95,52,7);
 for(let x=68;x<116;x+=3)r(GD,x,96,1,5);
 r(GD,66,102,52,1);r(GDD,66,103,52,1);
 for(const lx of[67,93]){r(RD,lx,104,25,24);r(RDL,lx,104,25,1);r(RDL,lx,104,1,24);r(RDD,lx+24,104,1,24);r(RDD,lx+2,106,21,1);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const sx=lx+4+i*7,sy=108+j*7;r(GDD,sx,sy+1,4,3);r(GD,sx,sy,4,3);r(GDL,sx,sy,1,1)}}
 r(RDD,91,104,2,24);r(GD,89,113,2,5);r(GD,93,113,2,5);r(GDL,89,113,1,2);r(GDL,93,113,1,2);
 r(SND,66,127,52,1);
 // phào xà ngang + bóng mái đổ xuống tường
 r(RDD,20,86,144,4);r(RD,20,86,144,2);r(GD,20,88,144,1);r(GDD,20,89,144,1);
 for(let x=22;x<164;x+=6){r(WD,x,84,3,2)}
 r('rgba(60,20,10,.20)',24,90,136,4);
 // ---------- gác chuông: tường + 2 cửa tròn + hoành phi ----------
 r(WL,44,46,96,15);r(WLS,44,46,96,2);r(WLD,44,59,96,2);
 for(const x of[44,134]){r(RD,x,46,6,15);r(RDL,x+1,46,1,15);r(RDD,x+4,46,2,15)}
 for(const wx of[57,127]){E(r,GDD,wx,53,6,6);E(r,GD,wx,53,5,5);E(r,'#2a1210',wx,53,4,4);r(RD,wx-4,53,9,1);r(RD,wx,49,1,9);r(GDL,wx-4,50,2,1)}
 r(GDD,65,46,54,14);r(GD,66,47,52,12);r(GDL,66,47,52,1);r('#7a1b1f',67,48,50,10);r('#a22a2e',67,48,50,1);
 g.textAlign='center';g.font='900 7px Nunito, "Segoe UI", sans-serif';g.fillStyle='#4a0d10';g.fillText('MIẾU CẦU PHÚC',CX+.5,56.5,46);g.fillStyle='#ffe9a0';g.fillText('MIẾU CẦU PHÚC',CX,56,46);
 // ---------- hàm vẽ mái cong ----------
 const roof=(top,hh,hTop,hBot,pw)=>{
  const half=i=>hTop+(hBot-hTop)*Math.pow(i/(hh-1),pw);
  for(let i=0;i<hh;i++){const h=Math.round(half(i)),x0=CX-h,w=h*2,y=top+i,m=i%3;
   r(m==0?R3:m==1?R2:R1,x0,y,w,1);
   if(m==1){const off=((i/3)|0)%2*2;for(let x=x0+off;x<x0+w;x+=4){r(R3,x,y,1,1);r(R1,x+1,y,1,1)}}
   if(m==2){const off=((i/3)|0)%2*2;for(let x=x0+off;x<x0+w;x+=4)r(R2,x,y,1,1)}
   r(R4,x0,y,1,1);r(R4,x0+w-1,y,1,1)}
  const hb=Math.round(half(hh-1)),x0=CX-hb,x1=CX+hb,yb=top+hh;
  r(R4,x0,yb,hb*2,1);r(R3,x0+1,yb-1,hb*2-2,1);
  // đầu ngói tròn (men vàng ngà) dọc mép mái
  for(let x=x0+2;x<x1-2;x+=5){r('#f4dda6',x,yb+1,3,2);r('#fff1c8',x,yb+1,1,1);r('#b8603e',x,yb+3,3,1)}
  // đầu mái vểnh cong lên (dày, cong dần, liền với mái)
  for(let k=0;k<=10;k++){const py=yb-3-Math.round(k*.35+k*k*.07),th=Math.max(2,5-(k>>1)),w=2;
   for(const sd of[-1,1]){const px=sd<0?x0-k:x1+k-w;
    r(R2,px,py,w,th);r(R1,px,py,w,1);r(R4,px,py+th,w,1);if(k>0)r(R3,px+(sd<0?w-1:0),py+1,1,th-1)}}
  {const ty=yb-3-Math.round(10*.35+100*.07)-2;r(GD,x0-12,ty,3,3);r(GDL,x0-12,ty,1,1);r(GD,x1+9,ty,3,3);r(GDL,x1+9,ty,1,1)}};
 roof(58,26,48,80,1.6);
 roof(20,26,26,62,1.7);
 // ---------- nóc: đường bờ nóc + lưỡng long chầu nguyệt ----------
 r(R4,58,17,68,6);r(R3,58,17,68,4);r(R1,58,17,68,1);r(R2,58,18,68,1);
 for(let x=60;x<126;x+=4){r(R4,x,19,1,3)}
 r(GDD,58,22,68,1);
 // kìm (đuôi cá) cong vút hai đầu nóc
 for(const s of[-1,1]){const bx=s<0?56:126;
  r(GDD,bx,14,4,8);r(GD,bx,14,3,8);r(GD,bx+s,10,3,5);r(GD,bx+s*2,7,3,4);r(GD,bx+s*3,5,3,3);r(GD,bx+s*2,3,3,3);r(GD,bx+s*1,2,2,2);
  r(GDL,bx,14,1,7);r(GDL,bx+s,10,1,4);r(GDL,bx+s*2,7,1,3);r(GDL,bx+s*3,5,1,2);r(RD,bx+s*2+(s<0?1:0),4,1,1)}
 // vầng trăng giữa nóc (có hào quang)
 E(r,'rgba(255,240,170,.35)',CX,11,11,10);E(r,GDD,CX,11,9,9);E(r,GD,CX,11,8,8);E(r,GDL,CX,11,6,6);E(r,'#fff6c8',CX,11,4,4);r('#fffbe0',CX-2,8,2,2);
 r(GDD,CX-3,17,7,3);r(GD,CX-3,17,7,1);
 // hai con rồng chầu hai bên: thân uốn sóng liền nét, đầu hướng vào trăng
 for(const s of[-1,1]){
  for(let dx=13;dx<=36;dx++){const yy=14+Math.round(2*Math.sin(dx*.55)),x=CX+s*dx;r(GDD,x,yy+2,1,1);r(GD,x,yy,1,2);r(GDL,x,yy,1,1);if(dx%4==1)r(GD,x,yy-2,1,2)}
  for(let k=0;k<5;k++){r(GD,CX+s*(36+(k>>1)),13-k,1,2);r(GDL,CX+s*(36+(k>>1)),13-k,1,1)}
  r(GD,CX+s*13-(s<0?2:0),11,3,5);r(GD,CX+s*11-(s<0?3:0),12,3,3);r(GDL,CX+s*13-(s<0?2:0),11,3,1);r(RD,CX+s*12,12,1,1);r(GDD,CX+s*10-(s<0?1:0),14,2,1);
  r(GD,CX+s*14-(s<0?1:0),9,1,3);r(GD,CX+s*16-(s<0?1:0),10,1,2)}
 // ---------- đèn lồng đỏ treo mái hiên ----------
 for(const x of[22,162]){r('#d8c8a0',x,84,1,6);r(GD,x-2,90,5,1);E(r,'#a81f1a',x,98,5,6);E(r,'#d9302a',x,98,4,5);E(r,'#ff6a3a',x,98,3,4);E(r,'#ffd37a',x,97,1,2);
  r('#a81f1a',x-2,95,1,7);r('#a81f1a',x+2,95,1,7);r(GD,x-2,104,5,1);r(GD,x,105,1,3);r('#d9302a',x-1,108,1,3);r('#d9302a',x+1,108,1,3)}
 // chậu cúc vàng hai bên bậc thềm
 for(const x of[34,150]){r('#a9654a',x-5,121,10,7);r('#c98466',x-5,121,10,2);r('#7a4430',x-5,127,10,1);
  E(r,'#3e8a44',x,118,6,3);for(const[dx,c]of[[-3,'#f6c02e'],[0,'#ffd84a'],[3,'#f08a2e'],[-1,'#fff0a0']])E(r,c,x+dx,115+(dx&1),2,2)}
});
// tượng sư tử đá (kind 'ball' = cầu bên phải • 'cub' = sư tử con bên trái) — cổ quàng lụa đỏ + chuông vàng
const mkLion=kind=>mk(30,40,(g,r)=>{
 const S='#cfc8b6',SL='#e8e2d2',SD='#a39b88',SX='#7d7664',MN='#b0a890';
 E(r,'rgba(0,0,0,.18)',15,39,13,1);
 r('#d8d0be',2,32,26,2);r('#bdb5a2',2,34,26,3);r('#9a9280',3,37,24,2);
 // thân + chân trước
 E(r,S,15,27,9,6);E(r,SL,13,25,5,3);E(r,S,15,22,6,5);
 r(S,10,24,4,9);r(S,17,24,4,9);r(SD,14,24,2,9);r(SL,9,31,6,2);r(SL,16,31,6,2);r(SD,11,32,1,1);r(SD,13,32,1,1);r(SD,18,32,1,1);r(SD,20,32,1,1);
 // bờm xoăn quanh đầu
 for(let k=0;k<12;k++){const a=k*Math.PI/6,x=Math.round(15+Math.cos(a)*9),y=Math.round(12+Math.sin(a)*8);E(r,MN,x,y,3,3);r(SL,x-1,y-1,1,1)}
 E(r,S,15,12,7,7);r(S,7,5,3,3);r(S,20,5,3,3);r(SD,8,6,1,1);r(SD,21,6,1,1);
 // mặt
 r(SX,10,9,4,1);r(SX,16,9,4,1);r(SX,11,10,2,2);r(SX,17,10,2,2);r(SL,11,10,1,1);r(SL,17,10,1,1);
 r(SX,14,13,3,2);r(SD,13,15,5,1);r('#8a3a30',12,16,7,3);r('#fff',12,16,1,1);r('#fff',18,16,1,1);r('#fff',14,18,1,1);r('#fff',16,18,1,1);
 E(r,SL,15,21,3,1);
 // lụa đỏ + chuông
 r('#c8283a',9,19,13,2);r('#e8545a',9,19,13,1);E(r,'#f2c230',15,23,2,2);r('#fff3a0',14,22,1,1);
 if(kind=='ball'){E(r,SD,25,30,3,3);E(r,SL,24,29,2,2);r(SX,22,30,6,1)}
 else{E(r,S,5,29,4,3);E(r,S,5,25,3,3);r(S,2,22,2,2);r(S,7,22,2,2);r(SX,4,25,1,1);r(SX,7,25,1,1);r(SX,5,27,2,1);r('#c8283a',3,28,5,1)}
});
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
 for(let i=0;i<9;i++)r('#f0ead7',1130+i*9,278,5,46),r('#f0ead7',1130+i*9,338,5,46);
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
//  TRÙM KIM CƯƠNG (NPC) + cửa hiệu pastel xanh kim cương (biển neon + biển dọc)
// ============================================================
const BOSS_SET={n:'Trùm kim cương',sh:'#17171e',shl:'#2e2e3a',shd:'#08080c',scarf:'#ffd23f',knot:'#c89a10',tie:'#33d6ff',belt:'#ffd23f',trim:'#ffd23f',pt:'#17171e',shoe:'#ffd23f',cape:'#2a1a4e'};
const BOSS_HAIR={k:'short',c:'#101014'};
const gemBig=(r,x,y,c)=>{const rows=[[2,5],[1,6],[0,7],[1,6],[2,5],[3,4]];rows.forEach(([a,b],i)=>{r(c[1],x+a,y+i,b-a+1,1);r(c[0],x+a,y+i,Math.min(2,b-a+1),1);if(b-a>1)r(c[2],x+b-1,y+i,2,1)});r('#ffffff',x+2,y,2,1);r('#ffffff',x+1,y+1,1,1)};
// ---- CỬA HIỆU TRÙM KIM CƯƠNG: mặt tiền pastel xanh kim cương (124x96), biển neon + biển dọc vẽ động bên dưới ----
const DS_C=[['#f0fdff','#5fd6ff','#2a8ad8'],['#fff0fb','#ff9de0','#d44aa8'],['#f6f0ff','#b79bff','#7a56d8'],['#fffbe8','#ffe27a','#d9a521']];
const mkDiaShop=()=>mk(124,96,(g,r)=>{
 const ICE='#d6f3f8',ICE2='#b6e4ee',ICEL='#f1fcff',DIAD='#27a9d4',NAVY='#17294d',GOLD='#ffd23f',GOLDD='#c89a10',C=DS_C;
 r(ICE,0,11,124,85);r(ICEL,0,11,124,1);
 for(let x=4;x<124;x+=12)r('rgba(120,190,210,.16)',x,34,1,52);
 // mái đua + 3 viên kim cương trên nóc
 r(ICEL,0,6,124,3);r(GOLD,0,6,124,1);r(ICE2,0,9,124,2);
 gemBig(r,58,0,C[0]);gemBig(r,9,1,C[1]);gemBig(r,107,1,C[2]);
 // bảng hiệu (nền xanh đêm, viền vàng) — chữ neon vẽ động đè lên
 r(GOLDD,9,12,106,22);r(GOLD,9,12,106,21);r(NAVY,10,13,104,20);r('rgba(255,255,255,.08)',10,13,104,2);
 // mái hiên sọc xanh kim cương / trắng, viền lượn
 for(let i=0;i<15;i++){const c=i%2?'#f6fdff':'#7fdcf2',x=2+i*8;r(c,x,37,8,6);r(c,x+1,43,6,1);r(c,x+2,44,4,1)}
 r(DIAD,2,37,120,1);r('rgba(20,70,100,.18)',3,46,118,2);
 // hai cột trụ + đèn tường vàng
 for(const px of[0,114]){r(ICEL,px,46,10,40);r(ICE2,px+9,46,1,40);r('#9fe3f3',px+4,48,2,34);r(GOLD,px+3,58,4,2);r('#fff6b0',px+4,55,2,3)}
 // 2 tủ kính trưng bày
 [[12,[C[0],C[1],C[3]],C[2]],[78,[C[2],C[0],C[1]],C[0]]].forEach(([wx,gs,hang])=>{
  r('#7fbfd4',wx,48,34,34);r('#f6fdff',wx+1,49,32,32);r('#cdeffa',wx+2,50,30,30);r('#e6f9ff',wx+2,50,30,9);
  r('rgba(255,255,255,.75)',wx+5,52,2,13);r('rgba(255,255,255,.5)',wx+9,52,1,8);
  r('#e6d9ff',wx+4,73,26,7);r('#c9b6f5',wx+4,79,26,1);r(GOLD,wx+4,73,26,1);
  gs.forEach((c,i)=>gemBig(r,wx+5+i*9,67-(i==1?2:0),c));
  r('#b6e4ee',wx+16,50,1,8);gemBig(r,wx+13,58,hang);
  r(ICEL,wx-2,82,38,3);r(ICE2,wx-2,85,38,1)});
 // cửa kính đôi viền vàng
 r(GOLDD,48,46,28,40);r(GOLD,49,47,26,39);r(NAVY,50,48,24,38);
 for(const dx of[52,63]){r('#9fe3f5',dx,50,9,32);r('#e8fcff',dx,50,9,8);r('rgba(255,255,255,.6)',dx+2,62,1,10)}
 r(GOLD,60,66,1,6);r(GOLD,63,66,1,6);
 // chân tường đá + thảm hồng
 r(ICEL,0,86,124,2);r(ICE2,0,88,124,8);r('#a5dbe9',0,91,124,5);r('#7fc7da',0,95,124,1);
 r('#ffc9e3',46,90,32,5);r(GOLD,46,90,32,1);r('#f59ac6',46,94,32,1)});
// biển neon chính: viền ống neon + chữ TRÙM KIM CƯƠNG phát sáng (thỉnh thoảng chớp)
const diaNeon=(x0,by,tm)=>{const X=x0+10,Y=by-83,Wd=104,Hh=20;
 if(X>camX+vw||X+Wd<camX||Y>camY+vh||Y+Hh<camY)return;
 const fl=Math.sin(tm*17+3.1)>.975?.4:1,pu=.8+.2*Math.sin(tm*2.4);
 cx.save();cx.globalAlpha=fl;
 cx.shadowColor='#4fe3ff';cx.shadowBlur=5;cx.strokeStyle='#8cf0ff';cx.lineWidth=1;cx.strokeRect(X+2.5,Y+2.5,Wd-5,Hh-5);cx.shadowBlur=0;
 cx.font='900 9px '+NEONF;cx.textAlign='center';cx.textBaseline='alphabetic';cx.lineJoin='round';
 const T='TRÙM KIM CƯƠNG',mw=Wd-32;
 cx.shadowColor='#2fd8ff';cx.shadowBlur=7*pu;cx.lineWidth=1.6;cx.strokeStyle='#2fd8ff';cx.strokeText(T,X+Wd/2,Y+13.5,mw);
 cx.shadowBlur=0;cx.fillStyle='#fbffff';cx.fillText(T,X+Wd/2,Y+13.5,mw);
 cx.globalAlpha=fl*(.7+.3*pu);gemBig(r,X+5,Y+7,DS_C[1]);gemBig(r,X+Wd-13,Y+7,DS_C[1]);
 cx.restore()};
// biển dọc treo bên hông tiệm (đung đưa nhẹ): KIM CƯƠNG
const diaBlade=(x0,by,tm)=>{const AX=x0+121,AY=by-86;
 if(AX+30<camX||AX-4>camX+vw||AY>camY+vh||AY+80<camY)return;
 cx.save();
 r('#ffd23f',AX,AY,18,2);r('#c89a10',AX,AY+2,18,1);r('#ffd23f',AX+16,AY+2,2,3);
 for(let i=0;i<8;i++)r('#c89a10',AX+1+i,AY+10-i,1,1);
 cx.translate(AX+13,AY+3);cx.rotate(Math.sin(tm*1.4)*.03);
 const h=74;
 r('#c89a10',-6,0,1,5);r('#c89a10',5,0,1,5);
 r('#c89a10',-9,5,18,h);r('#ffd23f',-9,5,18,h-1);r('#17294d',-8,6,16,h-2);
 cx.save();cx.shadowColor='#4fe3ff';cx.shadowBlur=4;cx.strokeStyle='#8cf0ff';cx.lineWidth=1;cx.strokeRect(-6.5,8.5,13,h-8);cx.restore();
 gemBig(r,-4,10,DS_C[0]);
 cx.font='900 6.4px '+NEONF;cx.textAlign='center';cx.textBaseline='alphabetic';
 const fl=Math.sin(tm*13+1.7)>.98?.45:1;cx.globalAlpha=fl;
 [['K',25],['I',31],['M',37],['C',45],['Ư',51],['Ơ',57],['N',63],['G',69]].forEach(([ch,y])=>{
  cx.shadowColor='#2fd8ff';cx.shadowBlur=4;cx.fillStyle='#2fd8ff';cx.fillText(ch,0,y);cx.shadowBlur=0;cx.fillStyle='#fbffff';cx.fillText(ch,0,y)});
 cx.restore()};
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
//  BIỂN HIỆU NEON CHẠY CHỮ (vẽ động, dùng chung cho các cửa hàng + Ngân hàng)
//  Mỗi biển: bóng đèn chạy quanh khung, tên tiệm phát sáng neon (tên dài thì tự chạy), dải LED chạy chữ phía dưới
// ============================================================
const SIGNS=[],NEONF='"Nunito", "Segoe UI", Arial, sans-serif',LIGHTC=['#ff5a8a','#ffd23f','#5ee0ff','#9cff7a','#ffa24a'];
function drawSign(s,tm){
 const X=s.x0,Y=s.Y,W=s.w;
 if(X>camX+vw||X+W<camX||Y>camY+vh||Y+26<camY)return;
 cx.save();
 // bóng đèn chạy trên khung (viền trên + dưới)
 const ph=Math.floor(tm*7);
 for(let i=0,x=X+1;x<X+W-2;x+=5,i++){const on=(i+ph)%3==0;cx.fillStyle=on?'#fff8c0':'#a8802a';if(on){cx.shadowColor='#ffd23f';cx.shadowBlur=4}cx.fillRect(x,Y,2,1);cx.fillRect(x,Y+21,2,1);cx.shadowBlur=0}
 // tên tiệm: chữ neon (viền màu phát sáng + lõi trắng ấm), thỉnh thoảng chớp như neon cũ
 const one=!s.m,NY=one?Y+15:Y+10;
 cx.save();cx.beginPath();cx.rect(X+2,Y+1,W-4,one?20:12);cx.clip();
 cx.font='900 '+(one?9:8)+'px '+NEONF;cx.textBaseline='alphabetic';cx.lineJoin='round';
 const tw=cx.measureText(s.t).width,fl=Math.sin(tm*17+s.ph)>.975?.35:1;
 const paint=(x,al)=>{cx.globalAlpha=al;cx.shadowColor=s.col;cx.shadowBlur=7;cx.lineWidth=1.6;cx.strokeStyle=s.col;cx.strokeText(s.t,x,NY);cx.shadowBlur=0;cx.fillStyle='#fffaf0';cx.fillText(s.t,x,NY)};
 if(tw<=W-8){cx.textAlign='center';paint(X+W/2,fl)}
 else{cx.textAlign='left';const gap=18,off=(tm*18+s.ph*9)%(tw+gap);paint(X+4-off,fl);paint(X+4-off+tw+gap,fl)}
 cx.restore();
 // dải LED chạy chữ (chỉ Ngân hàng + Shop Miniset)
 if(s.m){cx.save();cx.beginPath();cx.rect(X+2,Y+13,W-4,8);cx.clip();
 cx.font='800 7px '+NEONF;cx.textAlign='left';cx.textBaseline='alphabetic';
 const msg=s.m+'      ',mw=cx.measureText(msg).width||120,off=(tm*24+s.ph*13)%mw;
 cx.shadowColor='#ff9a2e';cx.shadowBlur=3;cx.fillStyle='#ffe94d';
 for(let k=-1;k<Math.ceil((W-4)/mw)+1;k++)cx.fillText(msg,X+3-off+k*mw,Y+19.5);
 cx.restore()};
 // dây đèn nhấp nháy dưới mái hiên
 if(s.lights){const y=Y+36;for(let i=0,x=X+2;x<X+W-3;x+=7,i++){const a=.45+.55*Math.abs(Math.sin(tm*2.6+i*1.3+s.ph));cx.globalAlpha=a;cx.fillStyle=LIGHTC[i%5];cx.shadowColor=LIGHTC[i%5];cx.shadowBlur=3;cx.fillRect(x,y,2,2)}}
 cx.restore()}

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
// ============================================================
//  NPC TRANG TRÍ MỚI (không thoại, không bấm được, không cản đường — chỉ để phố thêm sống động)
//  • Người đạp xe đạp: chạy trên đường từ trái sang phải, ra khỏi map thì biến mất, nghỉ vài giây rồi quay lại
//  • Người đẩy xe trái cây: đi sát lề trên của đường, chậm rãi từ phải sang trái, hết map thì biến mất rồi lặp lại
// ============================================================
// vị trí x trong 1 vòng lặp (null = đang "biến mất" ngoài map, chờ lượt sau)
function loopX(v,tm,dir){const span=PW+2*v.m,run=span/v.sp,u=(tm+v.ph)%(run+v.pause);if(u>=run)return null;const s=u*v.sp;return dir>0?-v.m+s:PW+v.m-s}
const FCW=64,FCH=46;   // kích thước sprite xe trái cây (gốc ở giữa, chân xe = đáy)
const mkFruitCart=()=>mk(FCW,FCH,(g,r)=>{
 const W1='#b98d58',W2='#d9b36a',W3='#8d6b3f',W4='#6b4a2a',SW='#e8564a',SC='#fff4dc';
 E(r,'rgba(0,0,0,.2)',38,45,26,1.5);
 // tay đẩy chếch xuống phía người đẩy (bên trái)
 for(let i=0;i<14;i++)r(W4,16-i,29+(i>>1),1,2);
 // 2 cột đỡ mái
 r(W4,17,7,1,20);r(W4,59,7,1,20);
 // thân xe gỗ + mặt trước sơn xanh bạc hà
 r(W4,18,36,40,1);
 r(W3,16,27,44,9);r(W2,16,27,44,2);r(W1,16,29,44,5);r(W3,16,34,44,2);
 r('#9fd3b6',19,30,38,4);r('#7fb897',19,33,38,1);
 for(let x=22;x<56;x+=6)r('#f4f0e0',x,31,3,2);
 const fr=(x,y,c)=>{r(c,x,y,3,3);r(shade(c,.4),x,y,1,1);r(shade(c,-.3),x+1,y+2,2,1)};
 // khay 1: táo đỏ
 r(W3,17,24,15,3);r(W2,17,23,15,1);
 for(const[x,y]of[[18,20],[21,20],[24,20],[27,20],[19,17],[22,17],[25,17],[21,14]])fr(x,y,'#e0443a');
 r('#3fa34d',22,13,2,1);
 // khay 2: cam
 r(W3,33,24,14,3);r(W2,33,23,14,1);
 for(const[x,y]of[[34,20],[37,20],[40,20],[43,20],[35,17],[38,17],[41,17],[38,14]])fr(x,y,'#f39a2b');
 // khay 3: dưa hấu
 r(W3,48,24,12,3);r(W2,48,23,12,1);
 E(r,'#2f8a43',54,19,5.5,4.5);r('#1f6a33',52,15,1,9);r('#1f6a33',55,15,1,9);r('#5fbf6a',50,16,2,1);
 // nải chuối treo dưới mái
 for(const dx of[0,2,4])for(const[x,y]of[[0,9],[0,10],[1,11],[1,12],[2,13]])r('#f6d84a',44+dx+x,y,1,1);
 r('#8a6a2a',44,8,6,1);
 // mái che sọc đỏ-kem
 for(const[y,x0,x1]of[[0,26,50],[1,20,56],[2,15,61],[3,12,63],[4,12,63],[5,12,63]])for(let x=x0;x<=x1;x++)r(((x-12)>>2)%2?SC:SW,x,y,1,1);
 for(let x=12;x<64;x+=4){const c=((x-12)>>2)%2?SC:SW;r(c,x,6,4,2);r(c,x+1,8,2,1)}
 r('rgba(255,255,255,.35)',26,0,24,1);r('rgba(0,0,0,.12)',12,5,52,1)});
const FRUITCART=outl(mkFruitCart());
// bánh xe 6px có nan hoa quay theo quãng đường đi được
function fcWheel(X,Y,th){
 for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const d=Math.hypot(dx,dy);if(d>6.3)continue;cx.fillStyle=d>4.8?'#3d3d46':'#c9a064';cx.fillRect(X+dx,Y+dy,1,1)}
 cx.fillStyle='#6b4a2a';for(let k=0;k<4;k++){const a=th+k*Math.PI/2;for(let q=1;q<=4;q++)cx.fillRect(X+Math.round(Math.cos(a)*q),Y+Math.round(Math.sin(a)*q),1,1)}
 cx.fillStyle='#e4e4e8';cx.fillRect(X,Y,1,1)}
function drawCyclist(v,tm){const x0=loopX(v,tm,1);if(x0==null)return;const x=Math.round(x0);if(x<camX-70||x>camX+vw+70)return;
 const mi=MOUNTS.findIndex(m=>m.n=='Xe đạp');if(mi<0)return;
 drawRide(cx,x,v.by,{d:3,a:tm*1.2,mv:1,sit:0,set:v.set,hair:v.hair},mi,tm)}
function drawFruitCart(v,tm){const dir=-1,x0=loopX(v,tm,dir);if(x0==null)return;const x=Math.round(x0);if(x<camX-100||x>camX+vw+100)return;
 const by=v.by,bob=Math.sin(x/4)>.7?-1:0,o=FRUITCART;
 cx.save();if(dir>0)cx.drawImage(o,Math.round(x-FCW/2)-1,by-FCH-1+bob);else{cx.translate(x,0);cx.scale(-1,1);cx.drawImage(o,-Math.round(FCW/2)-1,by-FCH-1+bob)}cx.restore();
 // bánh xe (tâm sprite 24.5 và 52.5, cao 39.5)
 const wy=by-FCH+39+bob;for(const sx of[24.5,52.5])fcWheel(Math.round(dir>0?x-FCW/2+sx:x+FCW/2-sx),wy,x/6);
 // người đẩy đứng sau xe, hai tay nắm tay đẩy
 const px=dir>0?x-29:x+29;drawAv(cx,px-10,by-30,{d:dir>0?3:2,a:tm*.9,mv:1,sit:0,set:v.set,hair:v.hair})}
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
 put(mkMieu(),96,160,[4,0,182,162]);
 const SN=(t,bg,fg,n,m)=>({t,bg,fg,n,m});
 const H=[
  [188,76,118,{wall:PAL.cream,aw:['#cfe0cf','#f4f0e4'],tank:1,shelf:['#c98a52','#7db3a7','#e09a62','#d9a468'],sign:SN('NỘI THẤT','#cfe3cf','#4c6f52','#7dffb0','')}],
  [264,92,116,{wall:PAL.pink,aw:['#e7b4ae','#f8ece6'],balc:1,tile:1,shelf:['#e0a099','#8fb8e0','#f2d79a','#9ccaa6'],sign:SN('TIỆM MAY & MŨ NÓN','#f0c8c2','#8a4a44','#ff7ab8',''),shut:'#cfe0cf'}],
  [436,98,116,{wall:PAL.sage,aw:['#a9c4dc','#f4f0e4'],balc:1,tile:1,shelf:['#8fb8e0','#e0a099','#9ccaa6'],sign:SN('TIỆM THÚ CƯỠI','#bcd6e6','#3f607a','#5fd8ff',''),shut:'#e8c6b0'}],
  [534,78,106,{wall:PAL.lemon,aw:['#b9d6bf','#f6f2e2'],laundry:1,sign:SN('SHOP MINISET','#ffd9e6','#b04a72','#ff9ad0','★ THỜI TRANG CHO BÉ BỎNG ★'),shelf:['#f4f0e4','#b9d6bf']}],
  [612,98,116,{wall:PAL.peach,aw:['#d9c4e6','#f8f0ea'],balc:1,tile:1,shelf:['#e8c06a','#e0a099','#c9b0dc'],sign:SN('TIỆM THÚ CƯNG','#e3d0ee','#6a4a86','#c79bff',''),shut:'#c9dbe8'}],
  [710,80,118,{gold:1,sign:SN('TIỆM VÀNG','#f0dc96','#8a6a1c','#ffd84d','★ VÀNG 9999 ★')}],
  [790,84,106,{wall:PAL.sky,aw:['#e2b89a','#f8efe2'],balc:1,laundry:1,shelf:['#c99a6a','#f2e0b8'],sign:SN('CÀ PHÊ SÁNG','#e8cfb4','#7a5236','#ffb066','')}],
  [874,86,118,{wall:PAL.mauve,aw:['#a9c9d6','#f4f0e4'],tank:1,door:'shutter',sign:SN('CẮT TÓC','#d6e8ee','#4a6f80','#6ee7ff','')}],
  // ----- KHU MỚI nới sang phải (x960–1440): nhà dân đơn giản, không biển hiệu (plain:1) -----
  [960,92,114,{plain:1,wall:PAL.sage,aw:['#e2b89a','#f8efe2'],balc:1,tile:1,shelf:['#e0a099','#8fb8e0','#f2d79a'],shut:'#e8c6b0'}],
  [1052,86,108,{plain:1,wall:PAL.pink,aw:['#b9d6bf','#f6f2e2'],laundry:1,shelf:['#f4f0e4','#9ccaa6']}],
  [1138,98,118,{plain:1,wall:PAL.cream,aw:['#a9c4dc','#f4f0e4'],tank:1,door:'shutter'}],
  [1236,90,112,{plain:1,wall:PAL.sky,aw:['#e7b4ae','#f8ece6'],balc:1,tile:1,shelf:['#c99a6a','#8fb8e0','#f2e0b8'],shut:'#cfe0cf'}],
  [1326,114,116,{plain:1,wall:PAL.lemon,aw:['#d9c4e6','#f8f0ea'],tank:1,shelf:['#e8c06a','#e0a099','#c9b0dc']}]];
 SIGNS.length=0;
 for(const[x,w,h,o]of H){put(mkHouse(w,h,o),x+w/2,156,[x,0,x+w,158]);if(o.plain)continue;const g=o.sign;SIGNS.push({x0:x+4,w:w-8,Y:87,t:g.t,m:g.m,col:g.n,ph:x*.37,lights:1})}
 // NGÂN HÀNG (thay quán Phở bò cũ)
 put(mkBank(),396,156,[356,0,436,158]);
 SIGNS.push({x0:360,w:72,Y:67,t:'NGÂN HÀNG',m:'★ GỬI TIẾT KIỆM • LÃI MỖI NGÀY • AN TOÀN ★',col:'#ffd23f',ph:1.9,lights:0});
 dyn(157,()=>{const tm=tmNow();for(const s of SIGNS)drawSign(s,tm)});
 blk(0,0,PW,158);blk(0,502,PW,PH);
 // cửa tương tác
 const mm=['m','p','s'];
 hit(64,92,64,66,'⛩️ Miếu cầu phúc — bấm vào để thắp nhang, xin xăm','cv:ps:mieu',[96,176]);
 hit(268,96,84,60,'👕 Tiệm may — mua trang phục, tóc & mũ','cv:ps:shop:s',[308,178]);
 hit(440,96,90,60,'🐃 Tiệm thú cưỡi — trâu, voi, kỳ lân, xe đạp...','cv:ps:shop:m',[486,178]);
 hit(616,96,90,60,'🐾 Tiệm thú cưng — mèo, thỏ, gà, Mây Mây...','cv:ps:shop:p',[662,178]);
 hit(358,100,76,56,'🏦 Ngân hàng — gửi tiết kiệm, nhận lãi mỗi ngày','cv:ps:bank',[396,178]);
 hit(190,100,72,56,'🛋️ Tiệm nội thất — mua đồ trang trí cho nhà (100–4000 Xu)','cv:ps:furn',[226,178]);
 hit(536,100,74,56,'🧸 Shop Miniset — thời trang cho Bé bỏng','cv:ps:mini',[572,178]);
 hit(712,100,76,56,'🥇 Tiệm vàng — vàng 9999, canh giá mua rẻ bán đắt','cv:ps:gold',[750,178]);
 hit(792,100,80,56,'☕ Cà phê sáng — mùi cà phê phin ngào ngạt');
 hit(876,100,82,56,'✂️ Tiệm cắt tóc — chú thợ đi ăn sáng rồi');
 hit(964,100,84,56,'🏠 Nhà dân — cửa đã đóng then cài');hit(1056,100,78,56,'🏠 Nhà dân — quần áo phơi thơm mùi nắng');hit(1142,100,90,56,'🏠 Nhà dân — cửa cuốn đã kéo xuống');hit(1240,100,82,56,'🏠 Nhà dân — chắc cả nhà đi chợ rồi');hit(1330,100,106,56,'🏠 Nhà dân — chó nhà nào sủa gâu gâu đâu đó');
 // ===== VỈA HÈ TRÊN (y156–268): hàng quán, bàn ghế, xe bánh mì, trà đá, người đi dạo / tập thể dục =====
 for(const x of[262,632,862,1150,1400])put(mkPole(),x,268,[x-3,258,x+3,268]);
 for(const x of[440,726,1010,1290])put(mkLamp(),x,266,[x-2,260,x+2,266]);
 // MIẾU: 2 tượng sư tử đá đứng hai bên thềm miếu (để trống lối giữa cho người chơi đi vào)
 put(mkLion('ball'),20,176,[10,166,30,178]);hit(4,140,32,38,'🦁 Tượng sư tử đá canh giữ miếu','cv:ps:mieu',[96,176]);
 put(mkLion('cub'),164,176,[154,166,174,178]);hit(148,140,32,38,'🦁 Tượng sư tử đá canh giữ miếu','cv:ps:mieu',[96,176]);
 // bàn ghế nhựa (người chơi ngồi được) — dời hết lên vỉa hè
 const ptab=(x,by,ci,sc)=>{put(TBL[ci],x,by,[x-12,by-8,x+12,by]);for(const dx of[-24,24]){const i=seats.length;put(STL[sc[dx<0?0:1]],x+dx,by+3);
   seats.push({x:x+dx,y:by-1,by:by+3,sy:by+16,kind:'stool'});hit(x+dx-8,by-12,16,15,'🪑 Ghế nhựa vỉa hè — bấm E để ngồi','cv:seat:'+i,[x+dx,by+16])}};
 ptab(402,244,0,[0,1]);ptab(580,246,0,[2,1]);ptab(910,246,1,[0,2]);ptab(1096,246,2,[1,0]);ptab(1290,246,0,[2,1]);
 hit(368,222,70,34,'🪑 Bàn ghế nhựa vỉa hè');
 // xe bánh mì
 put(mkBmCart(),500,258,[464,242,536,258]);
 hit(462,208,76,50,'🥖 Xe bánh mì — "Bánh mì nóng giòn đây!"','cv:ps:bm');
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
 // ----- KHU MỚI x960–1440: vỉa hè trên -----
 put(T_GRN,1010,236,[996,222,1024,236]);hit(990,176,44,62,'🌳 Cây xanh bên đường');
 put(T_BOU,1190,234,[1176,220,1204,234]);hit(1160,170,64,66,'🌸 Giàn hoa giấy rực rỡ');
 put(T_GRN,1400,236,[1386,222,1414,236]);hit(1380,176,44,62,'🌳 Cây xanh bên đường');
 put(mkTea(),1352,254,[1330,242,1374,254]);hit(1326,214,52,42,'🧋 Quán trà đá nhỏ');
 mkNpc({id:'tra2',x:1390,y:250,d:2,set:1,hair:2,prop:'',lines:['Trà đá mát lạnh đây!','Ngồi nghỉ chút cho khỏe nè.','Trà chanh nữa nha, 5 nghìn!']});
 put(mkNewsBoard(),1050,254,[1038,244,1062,254]);hit(1034,216,32,40,'📰 Bảng báo: "Khu phố mới mở rộng — mời bà con ghé chơi"');
 // người đi dạo (không bấm được): dắt chó, chạy bộ, tập thể dục
 walker({k:'dog',y:192,x0:130,x1:340,sp:17,rest:6,ph:3,set:2,hair:1});
 walker({k:'jog',y:190,x0:600,x1:930,sp:34,rest:0,ph:0,set:3,hair:2});
 walker({k:'jog',y:262,x0:20,x1:170,sp:30,rest:0,ph:5,set:5,hair:0});
 walker({k:'gym',y:258,x:350,ph:0,set:4,hair:3});
 walker({k:'dog',y:190,x0:1040,x1:1300,sp:17,rest:6,ph:8,set:1,hair:2});
 walker({k:'jog',y:262,x0:960,x1:1420,sp:32,rest:0,ph:11,set:2,hair:1});
 walker({k:'gym',y:256,x:1240,ph:3,set:5,hair:2});
 // ===== ĐƯỜNG (y274–388): xe máy, xe đạp, ô tô chạy qua lại =====
 const VL=PW+200;
 [[1,344,44,[['c','#e9d27a'],['c','#e0a099']]],[-1,384,52,[['c','#8fb8e0'],['c','#9ccaa6']]]].forEach(([dir,by,sp,L])=>L.forEach((q,i)=>{
   const im=q[0]=='m'?mkMoto(q[1]):q[0]=='c'?mkCar(q[1]):mkBike(),v={dir,by,sp,ph:i*VL/L.length,im,o:outl(im)};dyn(by,()=>drawVeh(v,tmNow()))}));
 // NPC trang trí mới: người đạp xe (chạy → qua phải) & người đẩy xe trái cây (đi sát lề trên, ← qua trái); không thoại, không chạm được
 {const CY={by:316,sp:34,m:60,pause:11,ph:3,set:3,hair:2},FC={by:298,sp:14,m:80,pause:9,ph:30,set:1,hair:0};
  dyn(CY.by,()=>drawCyclist(CY,tmNow()));dyn(FC.by,()=>drawFruitCart(FC,tmNow()))}
 // Xe Hề Xiếc đỗ ở vỉa hè dưới, ngay cạnh ngõ vào (circus.js) — chỗ người chơi hay đứng khi mới vào phố
 if(window.circusBuild)circusBuild({dyn,hit,blk});
 // ===== VỈA HÈ DƯỚI (y394–500): sạp vé số, cửa hiệu Trùm kim cương, Xe Hề Xiếc (đỗ cạnh ngõ vào) — gánh hàng rong & thùng rác đã dời/xóa =====
 // (đã xóa các thùng rác ở vỉa hè dưới để nhường chỗ cho Xe Hề)
 put(mkLotStall(),866,486,[827,470,905,486]);
 hit(826,440,80,46,'🎟️ Sạp vé số Kiến thiết — bấm để mua vé, xổ sau 2 phút','cv:ps:lot',[866,496]);
 mkNpc({id:'vs',x:920,y:486,d:2,set:4,hair:3,prop:'',lines:['Vé số đây! Thử vận may nào!','Mua tờ vé số lấy hên nè!','Xổ số sắp quay rồi nha!']});
 put(mkCage(),790,486,[776,480,804,486]);
 dyn(485,()=>psCage(790,456,tmNow()));
 hit(766,430,48,56,'🎰 Vòng quay số — bấm để xem vé của bạn','cv:ps:lot',[790,496]);
 // 2 cô bán hàng rong gánh hàng đã dời sang VỈA HÈ TRÊN ("bên kia đường") để không đụng Xe Hề; đi qua đi lại chậm rãi, không ngồi nghỉ nên không cần ghế
 for(const v of[{y:224,x0:140,x1:252,sp:13,rest:0,ph:0,set:5,hair:2,goods:['#e0584a','#f4d38a','#a8d8b0']},{y:204,x0:400,x1:570,sp:11,rest:0,ph:9,set:3,hair:3,goods:['#a8d8b0','#f6f2e2','#f0a7a0']}])walker(Object.assign({k:'vend'},v))
 // ----- KHU MỚI x960–1440: vỉa hè dưới (y394–500) -----
 for(const x of[1010,1180,1400]){put(T_GRN,x,488,[x-12,474,x+12,488]);hit(x-24,430,48,60,'🌳 Cây xanh bên đường')}
 for(const x of[1090,1340])put(mkLamp(),x,490,[x-2,484,x+2,490]);
 put(mkBin(),1120,488,[1112,480,1128,488]);put(mkBin(),1270,488,[1262,480,1278,488]);
 ptab(1230,452,1,[0,2]);ptab(1060,456,2,[1,0]);
 put(mkBmCart(),1190,486,[1154,470,1226,486]);hit(1152,436,76,50,'🥖 Xe bánh mì — "Bánh mì nóng giòn đây!"','cv:ps:bm');
 mkNpc({id:'bm2',x:1242,y:484,d:2,set:2,hair:1,prop:'',lines:['Bánh mì nóng giòn đây!','Mới ra lò nè bà con ơi!','Ổ này nhiều pate lắm nha.']});

 // ----- TRÙM KIM CƯƠNG: cửa hiệu pastel nhỏ gọn (chỉ chắn 1 hàng ô sát tường) + ông đứng trước cửa -----
 // (hòm kho báu + đống kim cương đã chuyển sang Tiệm nội thất, 500 Xu/món)
 {const bx=372,by=480,x0=bx-62,boy=by+12;
  put(mkDiaShop(),bx,by,[x0,by-14,x0+124,by-2]);
  dyn(by+1,()=>{const tm=tmNow();diaNeon(x0,by,tm);diaBlade(x0,by,tm);
   for(let i=0;i<4;i++){sparkle(x0+16+i*8,by-36+(i%2)*5,tm,i);sparkle(x0+82+i*8,by-36+(i%2)*5,tm,i+5)}});
  mkNpc({id:'boss',boss:1,x:bx,y:boy,d:0,set:0,hair:0,prop:'',lines:['Kim cương đây! Ai lấy kim cương nào?','Ánh sáng này là của các con nè!','Muốn phát kim cương hông? Ghé ta nhé!','Lấp lánh cả phố luôn!']});
  hit(bx-16,boy-44,32,50,'💎 Trùm kim cương — bấm để mở Shop kim cương','cv:ps:dia',[bx,boy+2]);
  hit(x0,by-92,124,60,'💎 Cửa hiệu Trùm kim cương — bấm để mở Shop kim cương','cv:ps:dia',[bx,boy+2])}
 // người
 for(const n of PS.npcs){if(n.cat)continue;dyn(n.sit?n.y+1.5:n.y,()=>drawNpc(n,tmNow()))}
 // ----- nhãn -----
  hit(40,478,64,30,'🚪 Ngõ ra — bấm để về Nông Trại','gate',[72,490]);
 // thùng nước, bồn trên mái phía sau
 for(const x of[120,360,640,860,1100,1340])put(mkTank(),x,606);
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
 const P=[[262,192],[632,192],[862,192],[1150,192],[1400,192]];
 for(let i=0;i<P.length-1;i++)for(const dy of[0,5,10]){cx.beginPath();cx.moveTo(P[i][0],P[i][1]+dy);cx.quadraticCurveTo((P[i][0]+P[i+1][0])/2,P[i][1]+dy+16,P[i+1][0],P[i+1][1]+dy);cx.stroke()}
 for(const dy of[0,5]){cx.beginPath();cx.moveTo(262,192+dy);cx.quadraticCurveTo(110,206+dy,0,196+dy);cx.stroke();cx.beginPath();cx.moveTo(1400,192+dy);cx.quadraticCurveTo(1422,204+dy,1440,196+dy);cx.stroke()}}
PS.fx=psFx;
function psFx(tm,dt){
 if(CV.cur!='ps')return;
 wires();
 // hơi nước: xe bánh mì
 stT-=dt;if(stT<=0){stT=.35;STEAM.push({x:496+Math.random()*24,y:210,t:0,c:'255,255,255',v:8})}
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
(function(){if(document.getElementById('lotcss'))return;const st=document.createElement('style');st.id='lotcss';st.textContent=`
#ui.lotui{background:radial-gradient(120% 70% at 50% 0%,#5a1a86 0%,#2a1055 45%,#150a35 100%);border-color:#ff5cc8;box-shadow:0 0 0 2px #2a1055,0 0 16px #ff3fb4,0 0 34px rgba(120,60,255,.55);color:#ffeefb}
#ui.lotui .uh{color:#ffe9fb;text-shadow:0 0 6px #ff5cc8,0 0 12px #ff2a9a}
#ui.lotui .uh .b.x{background:#3a1668;border-color:#ff5cc8;color:#ffd9f5;box-shadow:0 0 8px #ff5cc8}
#ui.lotui .mut{color:#ffd0f2}#ui.lotui .mut b{color:#ffe27a}
.lotsign{position:relative;text-align:center;margin:4px 0 10px;padding:14px 6px 12px;border-radius:14px;background:#14082e;border:2px solid #4af0ff;box-shadow:0 0 10px #19e6ff,inset 0 0 14px rgba(25,230,255,.35)}
.lotsign:before,.lotsign:after{content:"";position:absolute;left:8px;right:8px;height:6px;background:radial-gradient(circle,#ffe27a 0 2px,transparent 3px) 0 50%/16px 6px repeat-x;animation:lotbulb 1s steps(2) infinite}
.lotsign:before{top:2px}.lotsign:after{bottom:2px;animation-delay:.5s}
.lotsign .ln1{font-weight:900;font-size:25px;letter-spacing:2px;color:#ff7ad0;text-shadow:0 0 4px #fff,0 0 10px #ff2a9a,0 0 22px #ff2a9a,0 0 34px #ff2a9a;animation:lotflick 3.2s infinite}
.lotsign .ln2{margin-top:2px;font-weight:800;font-size:11px;letter-spacing:2px;color:#aef8ff;text-shadow:0 0 5px #19e6ff,0 0 11px #19e6ff}
@keyframes lotbulb{0%{opacity:1}100%{opacity:.25}}
@keyframes lotflick{0%,18%,22%,62%,64%,100%{opacity:1}20%,63%{opacity:.55}}
@keyframes lotshine{0%{background-position:-120% 0,0 0}100%{background-position:220% 0,0 0}}
#ui.lotui .g1>.it{border:1px solid #6a3aa8;border-left:5px solid var(--lc,#c9a6ff);border-radius:10px;padding:6px 10px;align-items:center;background:linear-gradient(90deg,rgba(255,255,255,.10),rgba(255,255,255,.03));color:#fff0fb}
#ui.lotui .g1>.it small{color:#d9c2ff}
#ui.lotui .g1>.it>b{font-size:15px;color:var(--lc,#ffe27a);text-shadow:0 0 8px var(--lc,#ffe27a)}
#ui.lotui .g1>.it.lt0{--lc:#ffd23f;border-color:#ffd23f;background:linear-gradient(105deg,transparent 35%,rgba(255,240,170,.55) 50%,transparent 65%) 0 0/250% 100% no-repeat,#5a3508;animation:lotshine 2.6s linear infinite;box-shadow:0 0 12px rgba(255,210,63,.6)}
#ui.lotui .g1>.it.lt0>b{font-size:18px}
#ui.lotui .g1>.it.lt1{--lc:#ff6fcf}#ui.lotui .g1>.it.lt2{--lc:#4af0ff}#ui.lotui .g1>.it.lt3{--lc:#7dff9a}#ui.lotui .g1>.it.lt4{--lc:#ffa94a}#ui.lotui .g1>.it.lt5{--lc:#c9a6ff;box-shadow:0 0 8px rgba(201,166,255,.5)}
#ui.lotui .pf{background:linear-gradient(#2a1055,#1a0b3c);border-top:2px solid #ff5cc8}
#ui.lotui .pf .b{flex:1;font-weight:900;font-size:14px;color:#fff;background:linear-gradient(#ff7ad0,#e0309a);border:2px solid #ffd0f0;border-radius:12px;box-shadow:0 0 12px #ff3fb4,0 2px 0 #8a1466;text-shadow:0 1px 0 #8a1466}
#ui.lotui .pf .b:active{transform:translateY(1px)}
#ui.lotui #lotp{grid-template-columns:1fr 1fr;gap:3px}#ui.lotui #lotp>.it{padding:3px 6px;font-size:11px;border-radius:7px}#ui.lotui #lotp>.it>b{font-size:12px}#ui.lotui #lotp>.it>span>b{font-size:11px}#ui.lotui #lotp>.it>span>small{font-size:10px}#ui.lotui #lotp>.it.lt0{grid-column:1/3}#ui.lotui #lotp>.it.lt0>b{font-size:14px}
#ui.lotui #lotl>.it{background:linear-gradient(#fff6d6,#ffe9a8);border:2px dashed #c98a2a;border-left:5px solid #e0309a;border-radius:8px;color:#4a2a08}
#ui.lotui #lotl>.it.z{opacity:.6}#ui.lotui #lotl>.it b{color:#4a2a08;text-shadow:none;font-size:14px;letter-spacing:1px}
#ui.lotui #lotl>.it .b.x{background:linear-gradient(#7dffb0,#2fc46a);border:2px solid #fff;border-radius:10px;color:#064a22;font-weight:900;box-shadow:0 0 10px #4dff9a;animation:lotflick 1.4s infinite}
`;document.head.appendChild(st)})();
const LOT_PRICE=100,LOT_REFUND=100,LOT_MAXP=10,LOT_WAIT=120000;
// o = "1 trên o vé" (KHÔNG hiển thị cho người chơi). Giải 4 ≈ 1/15; giải 5 (trùng 1 số cuối, nhận 150) ≈ 1/3 (trước đây 1/3.3, tăng nhẹ); không trùng số nào hoàn 100 (hòa vốn). Kỳ vọng ≈ 134.5 Xu / vé 100 Xu (trước đây ≈ 133) — muốn bớt lời thì tăng số o của giải 5 hoặc giảm p.
const LOT=[{k:'ĐẶC BIỆT',p:99999,o:100000,j:6},{k:'GIẢI NHẤT',p:8888,o:15000,j:5},{k:'GIẢI NHÌ',p:2888,o:2500,j:4},{k:'GIẢI BA',p:888,o:300,j:3},{k:'GIẢI TƯ',p:288,o:15,j:2},{k:'GIẢI NĂM',p:150,o:3.0,j:1}];
window.PS_LOT=LOT;
const lotS=()=>{if(!ST.lot||!Array.isArray(ST.lot.t))ST.lot={t:[]};return ST.lot};
const dig=()=>String(Math.floor(Math.random()*10));
function lotMake(){let u=Math.random(),gi=-1,acc=0;for(let i=0;i<LOT.length;i++){acc+=1/LOT[i].o;if(u<acc){gi=i;break}}
 const n=Array.from({length:6},dig).join(''),j=gi>=0?LOT[gi].j:0;
 const w=Array.from({length:6},dig);for(let i=0;i<j;i++)w[5-i]=n[5-i];if(j<6){let d;do d=dig();while(d==n[5-j]);w[5-j]=d}
 return{n,w:w.join(''),j,g:gi,p:gi>=0?LOT[gi].p:LOT_REFUND,at:Date.now()+LOT_WAIT,paid:0}}
window.psLot=()=>{PS.view='lot';const L=lotS();L.t=L.t.filter((t,i,a)=>!t.paid||i>=a.length-6);
 let h=head('🎟️ Sạp vé số')+'<div class="lotsign"><div class="ln1">VÉ SỐ KIẾN THIẾT</div><div class="ln2">✦ THỬ VẬN MAY · NHẬN THƯỞNG LIỀN TAY ✦</div></div><div class="mut">Vé <b>'+LOT_PRICE+' Xu</b> • xổ số sau <b>2 phút</b> • không trùng số nào được hoàn <b>'+LOT_REFUND+' Xu</b>. Tối đa '+LOT_MAXP+' vé chờ xổ.</div>'+
 '<div class="pf"><button class="b" onclick="psLotBuy(1)">🎟️ Mua 1 vé</button><button class="b" onclick="psLotBuy(5)">🎟️ Mua 5 vé</button></div><div class="mut"><b>Vé của bạn</b> (🪙 '+fmtXu(ST.xu)+' Xu)</div><div class="g1" id="lotl"></div>'+
 '<div class="mut" style="margin-top:8px"><b>🏆 Bảng giải thưởng</b></div><div class="g1" id="lotp">'+LOT.map((g,gi)=>'<div class="it lt'+gi+'"><span><b>'+g.k+'</b> <small>'+g.j+' số cuối</small></span><b>'+g.p.toLocaleString('vi-VN')+'</b></div>').join('')+'</div>';
 openUI(h);$('ui').classList.add('lotui');lotList()};
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
 if(t.g<0){let m=0;while(m<6&&t.n[5-m]==t.w[5-m])m++;if(m>=1){t.g=5;t.p=LOT[5].p;t.j=m}else t.p=LOT_REFUND} // vé cũ mua trước bản cập nhật: tính lại theo số thực sự khớp
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
const SHOP={m:{t:'🐃 Thú cưỡi',all:()=>MOUNTS,pr:[4000,5500,4200,9000,1500,null,null,null,null,8000,1000]},p:{t:'🐾 Pet',all:()=>PETS,pr:[250,900,350,300,1100,500,null,null,null,null,null,null,10000]},s:{t:'👕 Set',all:()=>SETS,pr:[0,600,500,450,450,500,800,800,1500,2800,3500,20000, 500,500,600,1000,800,400,400,5000,5000, 0,0,0,0,0,0,0,0,0, 900,700, 500,500,500, 5000,5000, 0, 3000,3000]},h:{t:'🧢 Tóc & mũ',all:()=>HAIRS,pr:[0,150,200,250,300,300, 1000,400,600,200,250,300,1000, 3500,6000,4000,3500,2800, 0,0,0, 800,500]},
 e:{t:'😄 Biểu cảm',all:()=>EXPRS,pr:[0,0,0,0,0,0,18000,0,500,500]},   // số 7 'Thổi tim' bán bằng kim cương ở Shop kim cương
 a:{t:'🎀 Phụ kiện',all:()=>ACCS,pr:[300,450, 0,0,0,0, 5000,1500,300,800, 3000, 500,500, 400, 0, 4000, 0,0,0, 2000,2000,2000, 0,0, 500,100]}};   // số 19-21 = Balo Ong mật / Thỏ hồng / Cánh cụt 2000 Xu/cái • số 10 = Đàn guitar 3000 Xu • số 14 = Gậy Nấm pháp sư (bán kim cương) • số 15 = Guitar điện 4000 Xu • số 24 = Chảo chống dính 500 Xu • số 25 = Kem ốc quế 100 Xu
window.nmSet=s=>{const W=SETS[s|0];return W&&(W.mascot||W.deer||W.dn||W.tn||W.aul)?0:(s|0)};   // set mascot che mất tóc -> khi XEM THỬ tóc/mũ trong shop thì mặc tạm set thường
const price=(k,i)=>{const it=SHOP[k].all()[i];if(it&&it.xu!=null)return it.xu;const v=SHOP[k].pr[i];return v==null?500:v};   // món có trường xu (vd nhanvien.js) thì lấy giá ở đó
/* Giá gộp nhiều loại tiền: món có cb:{xu,qv,dia} trong MOUNTS (vd Ván trượt cam). qv = xu quái vật, dia = kim cương */
const cbTxt=(cb,short)=>short?'🪙'+cb.xu.toLocaleString('vi-VN')+' • QV '+cb.qv+' • 💎'+cb.dia:cb.xu.toLocaleString('vi-VN')+' Xu + '+cb.qv.toLocaleString('vi-VN')+' xu quái vật + '+cb.dia+' 💎';
let SH_TAB='m',SH_I=-1,SH_DIR=0,shRaf=0;
window.psShop=(tab)=>{if(typeof ownE=='function')ownE();if(tab)SH_TAB=tab;PS.view='shop';SH_I=-1;const S=SHOP[SH_TAB],L=S.all(),own=ST.own[SH_TAB],mt=SH_TAB=='m';
 let h=head('🏘️ Shop Phố xá')+'<div class="mut">🪙 Bạn có <b>'+fmtXu(ST.xu)+'</b> Xu</div><div class="tabs" style="flex-wrap:wrap">'+['m','p','s','h','e','a'].map(k=>'<button class="b'+(k==SH_TAB?' on':'')+'" onclick="psShop(\''+k+'\')">'+SHOP[k].t+'</button>').join('')+'</div>';
 h+='<div class="sg" style="grid-template-columns:repeat(3,1fr)">'+L.map((x,i)=>{const has=own.includes(i);if((x.ach&&!has)||x.dia||x.cl||x.up)return '';   // x.up = vật phẩm NÂNG CẤP (Thái tử Ba Tư) -> không bao giờ hiện trong shop
  return '<button class="sq'+(has?' z':'')+'" onclick="psItem('+i+')"><canvas class="shc" data-i="'+i+'" width="'+(mt?72:44)+'" height="'+(mt?68:SH_TAB=='p'?52:44)+'" style="width:'+(mt?88:57)+'px;height:'+(mt?83:SH_TAB=='p'?68:57)+'px;image-rendering:pixelated"></canvas><b>'+x.n+'</b><small>'+(has?'✓ Đã có':x.cb?cbTxt(x.cb,1):'🪙 '+price(SH_TAB,i).toLocaleString('vi-VN'))+'</small></button>'}).join('')+'</div>';
 h+='<div class="mut">Đồ đã mua nằm trong 🎒 Túi. Chạm vào món để xem thử & mua.</div>';
 openUI(h);shPaint()};
function shDraw(g,k,ix,o,t,big){
 if(k=='h'){o.hair=ix;o.set=nmSet(o.set)}else if(k=='s')o.set=ix;else if(k=='e'){o.e=ix;if(SETS[o.set]&&SETS[o.set].mascot)o.set=0}else if(k=='a'){o.acc=ix;if(ACCS[ix]&&ACCS[ix].bag&&!big)o.d=1}
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
 const eq=(SH_TAB=='a'&&ACCS[i]&&ACCS[i].t=='wing'?ST.av.w:ST.av[SH_TAB])==i;
 openUI(head(S.t+' — '+x.n)+'<div style="text-align:center"><canvas id="shp" width="110" height="92" style="width:220px;height:184px;max-width:100%;image-rendering:pixelated;background:linear-gradient(#d6e8f2,#e8efd6 70%);border:2px solid #7a4a26;cursor:pointer" onclick="SH_DIR=(SH_DIR+1)%4"></canvas><div class="mut" style="margin:2px 0 6px">Chạm vào hình để xoay • bạn có 🪙 <b>'+fmtXu(ST.xu)+'</b> Xu'+(x.cb?' • QV <b>'+fmtXu(ST.qv|0)+'</b> • 💎 <b>'+(ST.dia|0)+'</b>':'')+'</div></div>'+
 '<div class="pf">'+(has?'<button class="b" onclick="psUse('+i+')">'+(eq?'✓ Đang dùng':'✨ Dùng ngay')+'</button>':'<button class="b" onclick="psBuy('+i+')">'+(x.cb?'🛍️ Mua — '+cbTxt(x.cb):'🪙 Mua — '+pr.toLocaleString('vi-VN')+' Xu')+'</button>')+'<button class="b" onclick="psShop()">⬅ Quay lại</button></div>');
 if(!shRaf)shLoop()};
function shLoop(){const c=$('shp');if(!c||!UI||PS.view!='item'){shRaf=0;return}const A=ST.av,g=c.getContext('2d'),t=performance.now()/1000;
 shDraw(g,SH_TAB,SH_I,{d:0,a:t,mv:1,sit:0,hair:A.h,set:A.s,e:A.e},t,1);shRaf=requestAnimationFrame(shLoop)}
window.psBuy=i=>{if(typeof ownE=='function')ownE();const k=SH_TAB,pr=price(k,i),own=ST.own[k];if(own.includes(i))return psItem(i);
 if(SHOP[k].all()[i].cl)return toast('🤡 Món này bán ở Tiệm Chú Hề (Xe Hề, Phố xá)');
 if(SHOP[k].all()[i].dia)return toast('💎 Món này bán bằng kim cương ở Trùm kim cương (Shop kim cương)');
 if(SHOP[k].all()[i].up)return toast('👑 Vật phẩm nâng cấp — chỉ nhận ở Thái tử Ba Tư (Phố xá)');
 if(SHOP[k].all()[i].ach)return toast(SHOP[k].all()[i].bd?'❄️ Món này đổi bằng Huy hiệu tuyết ở Ông già Noel (Làng tuyết)':'🏆 Pet này chỉ nhận được từ mốc quà trong Thẻ');
 const cb=SHOP[k].all()[i].cb;
 if(cb){const need=[];if(ST.xu<cb.xu)need.push((cb.xu-ST.xu).toLocaleString('vi-VN')+' Xu');if((ST.qv|0)<cb.qv)need.push((cb.qv-(ST.qv|0)).toLocaleString('vi-VN')+' xu quái vật');if((ST.dia|0)<cb.dia)need.push((cb.dia-(ST.dia|0))+' 💎');
  if(need.length)return toast('Chưa đủ — còn thiếu '+need.join(' + '));
  ST.xu-=cb.xu;ST.qv=(ST.qv|0)-cb.qv;ST.dia=(ST.dia|0)-cb.dia;own.push(i);xuUp();save();toast('🛍️ Đã mua '+SHOP[k].all()[i].n+'!');return psItem(i)}
 if(ST.xu<pr)return toast('🪙 Chưa đủ Xu — còn thiếu '+(pr-ST.xu).toLocaleString('vi-VN')+' Xu');
 ST.xu-=pr;own.push(i);xuUp();save();toast('🛍️ Đã mua '+SHOP[k].all()[i].n+'!');psItem(i)};
window.psUse=i=>{const k=SH_TAB;if(!ST.own[k].includes(i))return;if(k=='a'&&ACCS[i]&&ACCS[i].t=='wing')ST.av.w=i;else ST.av[k]=i;if(k=='m'&&Pl.sit){Pl.sit=0;Pl.mv=0}if(k=='p')petReset();save();toast('✨ Đã dùng '+SHOP[k].all()[i].n);psItem(i)};

// ============================================================
//  TIỆM NỘI THẤT (giá theo độ đẹp: 100–4000 Xu). Mua → vào Túi nội thất (ST.hm.i), mở khi ở trong nhà.
// ============================================================
const FURN_PR={clk:100,cal:100,chr:100,mir:120,lmp:120,drw:130,bsk:140,tbl:140,plt:150,cat:160,rug:170,pic:180,shf:190,wrd:200,tv:220,arm:230,din:260,sofa:300,ctbl:500,cchr:500,clmp:500,wcl:500,wph:500,wpc:500,ftv:500,pcd:4000,ofd:1000,win:150,bkS:500,bkL:700,mdl:1000,spk:2000,mai:1200,quat:700,hphi:1500,cchuc:500,dlong:300,nguqua:800,thong:1500,neon:1200,vong:600,day:350,tat:200,qua:250,tkb:500,dkc:500,fan:100,ac:500,rack:500,cine:5000,wmc:200,spc:100,bday:600,cth:200,wrdo:400};
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


// ============================================================
//  NGÂN HÀNG — gửi tiết kiệm (sổ tiết kiệm màu vàng)
//  ST.bank = {no:'số sổ', n:'tên chủ sổ', open:ms, p:gốc đang sinh lãi, w:gốc gửi thêm (chờ kỳ sau), i:lãi đã cộng dồn (chờ rút), tot:tổng lãi, at:mốc kỳ lãi, h:[lịch sử]}
//  Quy tắc: gửi tối thiểu 1.000, gốc tối đa 5.000.000 • kỳ lãi 24 giờ • lãi cộng dồn vào sổ (lãi mẹ đẻ lãi con) • rút gốc / rút lời bất cứ lúc nào
//  Gửi lần đầu: tính lãi ngay từ kỳ đầu. Gửi thêm khi sổ đang có tiền: vào "chờ kỳ sau", được gộp vào gốc sau lần trả lãi kế tiếp (chống gửi sát giờ rồi rút).
//  LÃI SUẤT (chỉnh ở BK_TIERS): lãi/ngày theo từng bậc số dư — 50.000 Xu → 2.000 Xu/ngày; tối đa ở 5 triệu ≈ 28.000/ngày (≈0,56%) để tránh lạm phát
// ============================================================
const BK_MIN=1000,BK_MAX=5000000,BK_DAY=86400000,BK_MAXD=30;
const BK_TIERS=[[100000,.04],[500000,.015],[2000000,.006],[5000000,.003]];   // [số dư tới mức, lãi/ngày của phần số dư trong bậc]
const bkN=n=>Math.floor(+n||0).toLocaleString('vi-VN');
function bkRate(base){let r=0,lo=0;for(const[hi,p]of BK_TIERS){if(base>lo)r+=(Math.min(base,hi)-lo)*p;lo=hi}return Math.floor(r)}
const bkBook=()=>{const b=ST.bank;if(!b||typeof b!='object')return null;['p','w','i','tot'].forEach(k=>b[k]=Math.max(0,Math.floor(+b[k]||0)));if(!(b.at>0))b.at=Date.now();if(!Array.isArray(b.h))b.h=[];return b};
function bkLog(b,k,a){b.h.push([Date.now(),k,a]);if(b.h.length>14)b.h.splice(0,b.h.length-14)}
function bkSettle(b){const now=Date.now();if(now<b.at){b.at=now;return 0}
 const n=Math.floor((now-b.at)/BK_DAY);if(n<1)return 0;let got=0;
 for(let d=0;d<Math.min(n,BK_MAXD);d++){const it=bkRate(b.p+b.i);b.i+=it;got+=it;b.p+=b.w;b.w=0}
 b.at=n>BK_MAXD?now:b.at+n*BK_DAY;
 if(got){b.tot+=got;bkLog(b,'l',got)}return got}
const bkHas=b=>b&&b.p+b.i>0;
function bkClock(ms){ms=Math.max(0,Math.floor(ms/1000));const h=Math.floor(ms/3600),m=Math.floor(ms%3600/60),s=ms%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
const bkDate=t=>{const d=new Date(t);return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()};
const bkTime=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+' '+d.getDate()+'/'+(d.getMonth()+1)};
let bkTmr=0;
function bkStyle(){if(document.getElementById('bkcss'))return;const st=document.createElement('style');st.id='bkcss';st.textContent=
 '#ui.bkui{background:linear-gradient(160deg,#fff6c4 0%,#ffe27a 38%,#f6c23a 100%);border:3px solid #b8860b;box-shadow:0 0 0 2px #fff0a0 inset,0 3px 0 #8a6408,0 0 18px rgba(255,200,40,.55);color:#5a3b00;border-radius:12px}'+
 '#ui.bkui .uh{color:#7a4f00;text-shadow:0 1px 0 #fff3b0}'+
 '#ui.bkui .b{background:linear-gradient(#ffe98a,#f2b827);border:2px solid #8a6408;box-shadow:0 2px 0 #6a4a05;color:#4a3000;border-radius:8px}'+
 '#ui.bkui .b:active{transform:translateY(2px);box-shadow:none}'+
 '#ui.bkui .b.x{background:#fff3b0;border-color:#8a6408}'+
 '.bkmq{background:#2a1a00;border:2px solid #ffd23f;border-radius:6px;box-shadow:0 0 8px #ffc928,inset 0 0 8px rgba(255,200,40,.4);overflow:hidden;white-space:nowrap;padding:3px 0;margin-bottom:8px}'+
 '.bkmq span{display:inline-block;padding-left:100%;font-weight:900;font-size:13px;letter-spacing:.5px;color:#ffe94d;text-shadow:0 0 3px #ff9a2e,0 0 9px #ffc928;animation:bkmq 13s linear infinite}'+
 '@keyframes bkmq{from{transform:translateX(0)}to{transform:translateX(-100%)}}'+
 '.bkw{display:flex;justify-content:center;margin:0 0 8px}.bkw span{background:#fffbe0;border:2px solid #d9a800;border-radius:14px;padding:2px 12px;font-size:14px;box-shadow:0 1px 0 #b8860b}'+
 '.bkbook{position:relative;background:linear-gradient(135deg,#7a1f1f,#a8322c 55%,#7a1f1f);border:3px solid #ffd23f;border-radius:10px;padding:8px 10px 10px;color:#fff3c4;box-shadow:0 3px 0 #5a1010,inset 0 0 0 2px #7a1f1f,inset 0 0 0 3px #e2b93b}'+
 '.bkbook .bt{display:flex;justify-content:space-between;align-items:center;font-weight:900;letter-spacing:1px;color:#ffe27a;text-shadow:0 1px 0 #4a0c0c,0 0 6px rgba(255,210,63,.6);font-size:14px}'+
 '.bkbook .bt small{font-size:10px;letter-spacing:.5px;color:#ffd9a0}'+
 '.bkbook .bi{font-size:11.5px;color:#ffe9b8;margin:2px 0 6px;line-height:1.5}.bkbook .bi b{color:#fff}'+
 '.bkbook .bb{background:rgba(0,0,0,.28);border:1px solid #e2b93b;border-radius:8px;padding:5px 8px;text-align:center}'+
 '.bkbook .bb small{display:block;font-size:10.5px;color:#ffd9a0}.bkbook .bb b{font-size:24px;color:#ffe27a;text-shadow:0 0 8px rgba(255,210,63,.7);letter-spacing:.5px}'+
 '.bkbook .br{display:flex;justify-content:space-between;font-size:12px;padding:2px 2px;border-bottom:1px dashed rgba(255,226,122,.35)}.bkbook .br:last-of-type{border:0}'+
 '.bkbook .br b{color:#fff}'+
 '.bkcd{margin-top:6px;text-align:center;background:#2a1a00;border:1px solid #ffd23f;border-radius:8px;padding:4px;font-size:12px;color:#ffe9b8}.bkcd b{color:#ffe94d;font-size:15px;text-shadow:0 0 6px #ffc928}'+
 '.bkbox{background:#fffbe3;border:2px solid #d9a800;border-radius:10px;padding:7px 8px;margin-top:8px}'+
 '.bkbox h4{margin:0 0 4px;font-size:13px;color:#8a5a00}'+
 '.bkrow{display:flex;gap:4px;margin:4px 0}.bkrow input{flex:1;min-width:0;font:inherit;padding:6px;border:2px solid #b8860b;background:#fffdf0;border-radius:6px;color:#4a3000}'+
 '.bkq{display:flex;gap:4px;flex-wrap:wrap;margin:4px 0}.bkq .b{flex:1;padding:4px 2px;font-size:11.5px;min-width:44px}'+
 '.bkt{width:100%;border-collapse:collapse;font-size:12px}.bkt td{padding:2px 4px;border-bottom:1px dotted #d9a800}.bkt td:last-child{text-align:right;font-weight:800;color:#8a5a00}'+
 '.bkh{max-height:110px;overflow:auto;font-size:11.5px}.bkh div{display:flex;justify-content:space-between;padding:2px 2px;border-bottom:1px dotted #d9a800}'+
 '.bkmut{font-size:11.5px;color:#7a5600;margin:3px 0}';
 document.head.appendChild(st)}
function bkTick(){if(!UI||PS.view!='bank'||!$('bkcd')){clearInterval(bkTmr);bkTmr=0;return}
 const b=bkBook();if(!b)return;const rem=b.at+BK_DAY-Date.now();
 if(rem<=0){const g=bkSettle(b);if(g){save();toast('🏦 Lãi kỳ mới +'+bkN(g)+' Xu đã vào sổ');bankUI(1)}else{b.at=Date.now()-BK_DAY+1000}return}
 $('bkcd').textContent=bkClock(rem)}
window.bankUI=keep=>{PS.view='bank';bkStyle();const b=bkBook();let got=0;if(b)got=bkSettle(b);if(got){save();if(!keep)toast('🏦 Lãi kỳ mới +'+bkN(got)+' Xu đã vào sổ')}
 const base=b?b.p+b.i:0,exp=bkRate(base),room=BK_MAX-(b?b.p+b.w:0);
 const LOGN={g:'Gửi tiền',rg:'Rút gốc',rl:'Rút lời',l:'Nhận lãi',tt:'Tất toán sổ'};
 let h=head('🏦 Ngân hàng Vàng')+'<div class="bkmq"><span>★ NGÂN HÀNG VÀNG — GỬI TIẾT KIỆM • LÃI CỘNG DỒN MỖI NGÀY • RÚT GỐC, RÚT LỜI TỰ DO ★</span></div>'+
 '<div class="bkw"><span>🪙 Ví của bạn: <b>'+bkN(ST.xu)+'</b> Xu</span></div>';
 if(!b)h+='<div class="bkbook"><div class="bt"><span>📒 SỔ TIẾT KIỆM</span><small>NGÂN HÀNG VÀNG</small></div><div class="bi">Bạn chưa có sổ. Gửi tối thiểu <b>'+bkN(BK_MIN)+' Xu</b> để được cấp sổ tiết kiệm riêng, lãi tính mỗi 24 giờ.</div><div class="bb"><small>SỐ DƯ</small><b>0</b></div></div>';
 else h+='<div class="bkbook"><div class="bt"><span>📒 SỔ TIẾT KIỆM</span><small>NGÂN HÀNG VÀNG</small></div>'+
  '<div class="bi">Chủ sổ: <b>'+escH(b.n||ST.name||'Khách')+'</b><br>Số sổ: <b>'+escH(b.no)+'</b> • Mở ngày: <b>'+bkDate(b.open)+'</b></div>'+
  '<div class="bb"><small>TỔNG SỐ DƯ TRONG SỔ</small><b>'+bkN(b.p+b.w+b.i)+'</b></div>'+
  '<div style="margin-top:6px"><div class="br"><span>💰 Gốc đang sinh lãi</span><b>'+bkN(b.p)+'</b></div>'+
  '<div class="br"><span>⏳ Gốc gửi thêm (tính lãi từ kỳ sau)</span><b>'+bkN(b.w)+'</b></div>'+
  '<div class="br"><span>✨ Lãi đã cộng dồn (rút được)</span><b>'+bkN(b.i)+'</b></div>'+
  '<div class="br"><span>🏆 Tổng lãi đã nhận từ trước tới giờ</span><b>'+bkN(b.tot)+'</b></div></div>'+
  '<div class="bkcd">'+(bkHas(b)?'Kỳ lãi tiếp theo sau <b id="bkcd">'+bkClock(b.at+BK_DAY-Date.now())+'</b><br>Lãi dự kiến: <b>+'+bkN(exp)+' Xu</b>':'Chưa có số dư sinh lãi — gửi thêm để bắt đầu kỳ lãi')+'</div></div>';
 h+='<div class="bkbox"><h4>📥 Gửi tiết kiệm</h4><div class="bkmut">Tối thiểu '+bkN(BK_MIN)+' • gốc tối đa '+bkN(BK_MAX)+' Xu • còn nhận được '+bkN(Math.max(0,room))+' Xu</div>'+
  '<div class="bkrow"><input id="bka" type="number" inputmode="numeric" min="'+BK_MIN+'" max="'+BK_MAX+'" placeholder="Số Xu muốn gửi"><button class="b" onclick="bkDep()">📥 Gửi</button></div>'+
  '<div class="bkq">'+[1000,10000,50000,100000].map(v=>'<button class="b" onclick="$(\'bka\').value='+v+'">'+bkN(v)+'</button>').join('')+'<button class="b" onclick="bkAll()">Tối đa</button></div>'+
  (b&&bkHas(b)?'<div class="bkmut">💡 Gửi thêm khi sổ đã có tiền: số mới được tính lãi từ <b>kỳ kế tiếp</b>.</div>':'<div class="bkmut">💡 Gửi lần đầu được tính lãi ngay kỳ đầu tiên (24 giờ).</div>')+'</div>';
 if(b&&(b.p+b.w+b.i)>0)h+='<div class="bkbox"><h4>📤 Rút tiền</h4>'+
  '<div class="bkrow"><button class="b" style="flex:1" '+(b.i>0?'':'disabled style="flex:1;opacity:.5"')+' onclick="bkWdI()">✨ Rút lời ('+bkN(b.i)+')</button></div>'+
  '<div class="bkrow"><input id="bkw" type="number" inputmode="numeric" min="1" placeholder="Số gốc muốn rút (tối đa '+bkN(b.p+b.w)+')"><button class="b" onclick="bkWdP()">📤 Rút gốc</button></div>'+
  '<div class="bkq"><button class="b" onclick="$(\'bkw\').value='+(b.p+b.w)+'">Rút hết gốc</button><button class="b" onclick="bkClose()">🔒 Tất toán sổ (rút hết)</button></div>'+
  '<div class="bkmut">Rút gốc trước kỳ lãi sẽ làm giảm tiền sinh lãi của các kỳ sau.</div></div>';
 h+='<div class="bkbox"><h4>📈 Bảng lãi suất (lãi mỗi ngày)</h4><table class="bkt">';
 let lo=0;for(const[hi,p]of BK_TIERS){h+='<tr><td>'+(lo?'Phần từ '+bkN(lo):'Phần đầu tới')+(lo?' đến '+bkN(hi):' '+bkN(hi))+' Xu</td><td>'+(p*100).toFixed(p*100%1?1:0).replace('.',',')+'%</td></tr>';lo=hi}
 h+='</table><div class="bkmut">Ví dụ: gửi 50.000 Xu → nhận khoảng <b>'+bkN(bkRate(50000))+' Xu</b> mỗi ngày; 100.000 Xu → <b>'+bkN(bkRate(100000))+' Xu</b>. Lãi được cộng dồn vào sổ nên các kỳ sau lãi tính trên cả gốc lẫn lãi.</div></div>';
 if(b&&b.h.length)h+='<div class="bkbox"><h4>🧾 Lịch sử giao dịch gần đây</h4><div class="bkh">'+b.h.slice().reverse().map(x=>'<div><span>'+bkTime(x[0])+' • '+(LOGN[x[1]]||'')+'</span><b style="color:'+(x[1]=='g'?'#b03a2e':'#2e7d32')+'">'+(x[1]=='g'?'−':'+')+bkN(x[2])+'</b></div>').join('')+'</div></div>';
 openUI(h);$('ui').classList.add('bkui');if(!bkTmr)bkTmr=setInterval(bkTick,1000)};
const bkKeep=fn=>{const box=$('ui'),top=box?box.scrollTop:0;fn();const b2=$('ui');if(b2)b2.scrollTop=top};
window.bkAll=()=>{const b=bkBook(),room=BK_MAX-(b?b.p+b.w:0),a=Math.max(0,Math.min(Math.floor(ST.xu),room));$('bka').value=a||''};
window.bkDep=()=>{const a=Math.floor(+($('bka').value||0));
 if(!(a>=BK_MIN))return toast('🏦 Gửi tối thiểu '+bkN(BK_MIN)+' Xu');
 if(a>ST.xu)return toast('🪙 Bạn không đủ Xu để gửi');
 let b=bkBook();
 if(!b){b=ST.bank={no:String(Math.floor(10000000+Math.random()*89999999)).replace(/(\d{4})(\d{4})/,'$1 $2'),n:ST.name||'',open:Date.now(),p:0,w:0,i:0,tot:0,at:Date.now(),h:[]};toast('📒 Ngân hàng đã cấp cho bạn sổ tiết kiệm mới!')}
 else bkSettle(b);
 if(b.p+b.w+a>BK_MAX)return toast('🏦 Sổ chỉ nhận thêm tối đa '+bkN(Math.max(0,BK_MAX-b.p-b.w))+' Xu gốc');
 ST.xu-=a;
 if(b.p+b.i<=0){b.p+=a;b.at=Date.now()}else b.w+=a;
 bkLog(b,'g',a);xuUp();save();toast('🏦 Đã gửi '+bkN(a)+' Xu vào sổ tiết kiệm');bkKeep(()=>bankUI(1))};
function bkPay(pr,li){window.IDNOEARN=1;ST.xu+=pr;window.IDNOEARN=0;if(li)ST.xu+=li}
window.bkWdI=()=>{const b=bkBook();if(!b||b.i<1)return toast('✨ Chưa có lãi để rút');bkSettle(b);const a=b.i;b.i=0;bkPay(0,a);bkLog(b,'rl',a);if(!bkHas(b)&&b.w<1)b.at=Date.now();xuUp();save();toast('✨ Đã rút lời +'+bkN(a)+' Xu');bkKeep(()=>bankUI(1))};
window.bkWdP=()=>{const b=bkBook();if(!b)return;bkSettle(b);const a=Math.floor(+($('bkw').value||0));
 if(!(a>=1))return toast('Nhập số gốc muốn rút');if(a>b.p+b.w)return toast('Sổ chỉ có '+bkN(b.p+b.w)+' Xu gốc');
 let t=a;const fw=Math.min(b.w,t);b.w-=fw;t-=fw;b.p-=t;bkPay(a,0);bkLog(b,'rg',a);if(!bkHas(b)&&b.w<1)b.at=Date.now();xuUp();save();toast('📤 Đã rút gốc +'+bkN(a)+' Xu');bkKeep(()=>bankUI(1))};
window.bkClose=()=>{const b=bkBook();if(!b)return;bkSettle(b);const pr=b.p+b.w,li=b.i;if(pr+li<1)return toast('Sổ đang trống');
 if(window.bkCf!==1){window.bkCf=1;setTimeout(()=>{window.bkCf=0},4000);return toast('🔒 Bấm "Tất toán" lần nữa để rút hết '+bkN(pr+li)+' Xu và dừng sinh lãi')}
 window.bkCf=0;b.p=0;b.w=0;b.i=0;bkPay(pr,li);bkLog(b,'tt',pr+li);b.at=Date.now();xuUp();save();toast('🔒 Đã tất toán: nhận '+bkN(pr+li)+' Xu (gốc '+bkN(pr)+' + lãi '+bkN(li)+')');bkKeep(()=>bankUI(1))};

// ============================================================
//  TIỆM VÀNG — vàng 9999 dạng trang sức / vàng miếng / vàng đúc hình
//  • Giá vàng 1 chỉ đổi mỗi 35–135 phút (giờ thật), TÍNH THEO GIỜ HỆ THỐNG nên mọi người chơi, mọi máy thấy cùng một giá
//  • Có 2 giá như tiệm thật: BÁN RA (người chơi mua) cao hơn MUA VÀO (người chơi bán) GD_SPREAD = 5%
//  • Giá 1 chỉ dao động trong GD_LO..GD_HI, tự kéo về mức giữa (GD_MID) nên không tăng mãi / giảm mãi
//  • 8 món, giá từ ~50.000 đến ~1.000.000 Xu; kho tối đa GD_CAPW chỉ để không lạm phát
//  ST.gold = {inv:{id:{q:số lượng, c:tổng Xu đã bỏ ra mua}}, re:tổng lời/lỗ đã chốt, h:[lịch sử]}
// ============================================================
const GD_T0=Date.UTC(2026,0,1),GD_LO=68000,GD_HI=95000,GD_MID=81500,GD_SPREAD=.05,GD_CAPW=60,GD_MAXN=10;
const GD_ITEMS=[['nhan','Nhẫn trơn',.7,'💍'],['bt','Bông tai hoa',1,'🌸'],['mdc','Mặt dây trái tim',1.5,'❤️'],['lac','Lắc tay',2,'🔗'],['nc','Nhẫn cưới đôi',3,'💞'],['dc','Dây chuyền',5,'📿'],['vm','Vàng miếng',7,'🟨'],['dh','Vàng đúc hình Rồng',10,'🐉']];
const GD_SEG=[];
const gdHash=n=>{let h=Math.imul((n|0)+0x9e3779b9|0,2246822519);h^=h>>>15;h=Math.imul(h,3266489917);h^=h>>>13;h=Math.imul(h,668265263);h^=h>>>16;return(h>>>0)/4294967296};
function gdBuild(upTo){
 if(!GD_SEG.length)GD_SEG.push([GD_T0,GD_MID,0]);
 while(true){const n=GD_SEG.length,L=GD_SEG[n-1];
  L[2]=(35+Math.floor(gdHash(n*3+1)*101))*60000;      // mỗi phiên giá kéo dài 35–135 phút
  if(L[0]+L[2]>upTo)return;
  const nz=gdHash(n*3+2)+gdHash(n*3+3)-1;              // nhiễu -1..1
  let p=L[1]+(GD_MID-L[1])*.08+L[1]*nz*.075;
  if(p>GD_HI)p=GD_HI-(p-GD_HI)*.5;if(p<GD_LO)p=GD_LO+(GD_LO-p)*.5;
  p=Math.max(GD_LO,Math.min(GD_HI,p));
  GD_SEG.push([L[0]+L[2],Math.round(p/100)*100,0])}}
function gdNow(){const t=Date.now();gdBuild(t+1);let i=GD_SEG.length-1;while(i>0&&GD_SEG[i][0]>t)i--;
 const s=GD_SEG[i],pv=GD_SEG[Math.max(0,i-1)];
 return{i,g:s[1],prev:pv[1],start:s[0],end:s[0]+s[2],ask:Math.round(s[1]*(1+GD_SPREAD)/100)*100}}
const gdBuy=(it,ask)=>Math.round(it[2]*ask/100)*100,gdSell=(it,g)=>Math.round(it[2]*g/100)*100;
const gdN=n=>Math.floor(+n||0).toLocaleString('vi-VN');
const gdSg=n=>(n>0?'+':n<0?'−':'')+gdN(Math.abs(n));
const gdCol=n=>n>0?'#5fe08a':n<0?'#ff7a6e':'#e8d9a8';
function gdBag(){let G=ST.gold;if(!G||typeof G!='object')G=ST.gold={};if(!G.inv||typeof G.inv!='object')G.inv={};G.re=Math.floor(+G.re||0);if(!Array.isArray(G.h))G.h=[];
 for(const it of GD_ITEMS){const o=G.inv[it[0]];if(o){o.q=Math.max(0,Math.floor(+o.q||0));o.c=Math.max(0,Math.floor(+o.c||0));if(!o.q)delete G.inv[it[0]]}}return G}
const gdWeight=G=>GD_ITEMS.reduce((a,it)=>a+(G.inv[it[0]]?G.inv[it[0]].q*it[2]:0),0);
function gdLog(G,k,a,name){G.h.push([Date.now(),k,a,name]);if(G.h.length>16)G.h.splice(0,G.h.length-16)}
const gdClock=ms=>{ms=Math.max(0,Math.floor(ms/1000));const h=Math.floor(ms/3600),m=Math.floor(ms%3600/60),s=ms%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};
const gdTime=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+' '+d.getDate()+'/'+(d.getMonth()+1)};
let gdTmr=0,gdIdx=-1;
function gdStyle(){if(document.getElementById('gdcss'))return;const st=document.createElement('style');st.id='gdcss';st.textContent=
 '#ui.gdui{background:radial-gradient(ellipse at 50% 0%,#4a1a24 0%,#2a0e16 45%,#150709 100%);border:3px solid #e2b93b;border-radius:14px;box-shadow:0 0 0 2px #7a5a10 inset,0 0 0 5px #1c0a0e inset,0 0 0 6px #e2b93b inset,0 4px 0 #6a4a05,0 0 26px rgba(255,200,40,.55);color:#f6e7b4}'+
 '#ui.gdui .uh{color:#ffe27a;font-family:Georgia,"Times New Roman",serif;letter-spacing:1px;text-shadow:0 0 8px rgba(255,210,63,.7),0 1px 0 #4a2c00}'+
 '#ui.gdui .b{background:linear-gradient(#ffe98a,#e2a91f);border:2px solid #8a6408;box-shadow:0 2px 0 #5a3d03;color:#3a2400;border-radius:8px}'+
 '#ui.gdui .b:active{transform:translateY(2px);box-shadow:none}#ui.gdui .b.x{background:#fff3b0}#ui.gdui .b[disabled]{opacity:.4;filter:grayscale(.6);cursor:default}'+
 '.gdmq{background:#0d0506;border:2px solid #e2b93b;border-radius:6px;box-shadow:0 0 8px #ffc928,inset 0 0 8px rgba(255,200,40,.35);overflow:hidden;white-space:nowrap;padding:3px 0;margin-bottom:8px}'+
 '.gdmq span{display:inline-block;padding-left:100%;font-weight:900;font-size:12.5px;letter-spacing:.6px;color:#ffe94d;text-shadow:0 0 3px #ff9a2e,0 0 9px #ffc928;animation:gdmq 15s linear infinite}'+
 '@keyframes gdmq{from{transform:translateX(0)}to{transform:translateX(-100%)}}'+
 '.gdw{display:flex;justify-content:center;margin:0 0 8px}.gdw span{background:#0d0506;border:2px solid #e2b93b;border-radius:14px;padding:2px 14px;font-size:14px;color:#ffe9a0;box-shadow:0 0 8px rgba(255,200,40,.3)}.gdw b{color:#ffe27a}'+
 '.gdbd{background:linear-gradient(#0a0405,#1a0a0e);border:3px solid #e2b93b;border-radius:10px;padding:8px 10px;box-shadow:inset 0 0 14px rgba(255,200,40,.25),0 2px 0 #6a4a05}'+
 '.gdbd .gt{display:flex;justify-content:space-between;align-items:center;font-size:11px;letter-spacing:1px;color:#d9b24a;font-weight:800}'+
 '.gdbd .grw{display:flex;gap:8px;margin-top:6px}.gdbd .gcl{flex:1;background:rgba(255,200,40,.07);border:1px solid #7a5a10;border-radius:8px;padding:5px 6px;text-align:center}'+
 '.gdbd .gcl small{display:block;font-size:10.5px;color:#c9a64a;letter-spacing:.5px}.gdbd .gcl b{display:block;font-size:20px;color:#ffe94d;text-shadow:0 0 8px rgba(255,200,40,.75);font-family:"Courier New",monospace;letter-spacing:.5px}.gdbd .gcl i{font-style:normal;font-size:10px;color:#c9a64a}'+
 '.gdbd .gch{margin-top:6px;font-size:12px;display:flex;justify-content:space-between;align-items:center}.gdbd .gch b{font-size:14px}'+
 '.gdsp{width:100%;height:54px;display:block;margin-top:4px}'+
 '.gdcd{margin-top:5px;text-align:center;font-size:11.5px;color:#c9a64a}.gdcd b{color:#ffe94d;font-size:13px;font-family:"Courier New",monospace}'+
 '.gdsec{margin-top:10px;font-family:Georgia,serif;color:#ffe27a;font-size:13px;letter-spacing:1px;font-weight:800;display:flex;align-items:center;gap:6px}.gdsec:before,.gdsec:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,#e2b93b,transparent)}'+
 '.gdsum{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.gdsum div{background:linear-gradient(135deg,#fff3b8,#e9b930 60%,#c99a1c);border:2px solid #8a6408;border-radius:9px;padding:5px 7px;color:#3a2400;text-align:center;box-shadow:0 2px 0 #5a3d03}.gdsum small{display:block;font-size:10.5px;color:#6a4a05}.gdsum b{font-size:15px}'+
 '.gdg{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}'+
 '.gdc{background:linear-gradient(150deg,#fff6c8 0%,#f0c94a 52%,#c8921a 100%);border:2px solid #8a6408;border-radius:10px;padding:5px 5px 6px;color:#3a2400;box-shadow:0 2px 0 #5a3d03,inset 0 0 0 1px #fff3b0;text-align:center;position:relative;min-width:0}'+
 '.gdc .gce{font-size:26px;line-height:1.1;filter:drop-shadow(0 1px 0 rgba(255,255,255,.6))}.gdc .gcn{font-weight:900;font-size:12.5px;line-height:1.2}.gdc .gcw{font-size:10.5px;color:#6a4a05}.gdc .gcp{font-weight:900;font-size:14px;color:#6b1020;margin:2px 0 3px}'+
 '.gdc .gcb{display:flex;gap:4px}.gdc .gcb .b{flex:1;padding:4px 2px;font-size:11.5px}.gdc.hv{border-color:#fff3b0;box-shadow:0 0 0 1px #8a6408,0 0 10px rgba(255,226,122,.7)}'+
 '.gdc .gco{position:absolute;top:3px;right:4px;font-size:10px;font-weight:900;background:#6b1020;color:#ffe27a;border-radius:8px;padding:0 5px}'+
 '.gdv{background:linear-gradient(135deg,#2a0e16,#1a0a0e);border:2px solid #b8921f;border-radius:10px;padding:6px 8px;margin-top:6px}'+
 '.gdv .gtp{display:flex;align-items:center;gap:6px}.gdv .gtp .gve{font-size:22px}.gdv .gtp .gvn{flex:1;font-weight:900;color:#ffe27a;font-size:13px;line-height:1.2}.gdv .gtp .gvn small{display:block;color:#c9a64a;font-weight:600;font-size:10.5px}'+
 '.gdv .gtp .gvp{text-align:right;font-weight:900;font-size:13px;line-height:1.2}.gdv .gtp .gvp small{display:block;font-size:10.5px;font-weight:700}'+
 '.gdv .gvr{display:flex;justify-content:space-between;font-size:11.5px;color:#e8d9a8;margin-top:3px;border-top:1px dashed rgba(226,185,59,.3);padding-top:3px}.gdv .gvr b{color:#fff3b0}'+
 '.gdv .gvb{display:flex;gap:4px;margin-top:5px}.gdv .gvb .b{flex:1;padding:4px 2px;font-size:11.5px}'+
 '.gdh{max-height:110px;overflow:auto;font-size:11.5px;background:rgba(0,0,0,.3);border:1px solid #7a5a10;border-radius:8px;padding:3px 6px;margin-top:6px}.gdh div{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px dotted rgba(226,185,59,.3)}.gdh div:last-child{border:0}'+
 '.gdmut{font-size:11px;color:#b99a48;margin:6px 0 0;text-align:center}';
 document.head.appendChild(st)}
function gdSpark(){const lo=Math.max(0,GD_SEG.length-24),a=GD_SEG.slice(lo),n=a.length;if(n<2)return'';
 const mn=GD_LO,mx=GD_HI,W=300,H=54,px=i=>i/(n-1)*(W-8)+4,py=v=>H-5-(v-mn)/(mx-mn)*(H-10);let d='';
 a.forEach((s,i)=>{const x=px(i),y=py(s[1]);d+=(i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);if(i<n-1)d+='L'+px(i+1).toFixed(1)+','+y.toFixed(1)});
 const last=a[n-1],up=last[1]>=a[n-2][1],c=up?'#5fe08a':'#ff7a6e',lx=px(n-1),ly=py(last[1]);
 return'<svg class="gdsp" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><line x1="0" x2="'+W+'" y1="'+py(GD_MID).toFixed(1)+'" y2="'+py(GD_MID).toFixed(1)+'" stroke="#7a5a10" stroke-dasharray="3 3" stroke-width="1"/><path d="'+d+'L'+W+','+ly.toFixed(1)+'" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><circle cx="'+lx.toFixed(1)+'" cy="'+ly.toFixed(1)+'" r="2.6" fill="'+c+'"/></svg>'}
function gdTick(){if(!UI||PS.view!='gold'||!$('gdcd')){clearInterval(gdTmr);gdTmr=0;return}
 const m=gdNow();if(m.i!==gdIdx){toast('🥇 Giá vàng vừa đổi: '+gdN(m.ask)+' Xu/chỉ (bán ra)');goldUI(1);return}
 $('gdcd').textContent=gdClock(m.end-Date.now())}
window.goldUI=keep=>{PS.view='gold';gdStyle();const G=gdBag(),m=gdNow();gdIdx=m.i;
 const dl=m.g-m.prev,pc=m.prev?dl/m.prev*100:0,up=dl>0?'▲':dl<0?'▼':'■';
 const lo=Math.max(0,GD_SEG.length-24),hist=GD_SEG.slice(lo).map(s=>s[1]),hi24=Math.max(...hist),lo24=Math.min(...hist);
 let tc=0,tv=0,cnt=0;for(const it of GD_ITEMS){const o=G.inv[it[0]];if(o){tc+=o.c;tv+=gdSell(it,m.g)*o.q;cnt+=o.q}}
 const pl=tv-tc,plp=tc?pl/tc*100:0,wt=gdWeight(G),wtS=(Math.round(wt*10)/10).toString().replace('.',',');
 let h=head('🥇 Tiệm Vàng Kim Long')+'<div class="gdmq"><span>★ TIỆM VÀNG KIM LONG — VÀNG 9999 CHÍNH HÃNG • GIÁ NIÊM YẾT THEO PHIÊN • MUA BÁN TRỰC TIẾP TẠI QUẦY ★</span></div>'+
 '<div class="gdw"><span>🪙 Ví của bạn: <b>'+gdN(ST.xu)+'</b> Xu</span></div>'+
 '<div class="gdbd"><div class="gt"><span>◆ BẢNG GIÁ VÀNG 9999 ◆</span><span>Cập nhật '+gdTime(m.start)+'</span></div>'+
 '<div class="grw"><div class="gcl"><small>BÁN RA (bạn mua)</small><b>'+gdN(m.ask)+'</b><i>Xu / chỉ</i></div><div class="gcl"><small>MUA VÀO (bạn bán)</small><b>'+gdN(m.g)+'</b><i>Xu / chỉ</i></div></div>'+
 '<div class="gch"><span style="color:'+gdCol(dl)+'"><b>'+up+' '+gdN(Math.abs(dl))+' Xu</b> ('+(pc>0?'+':pc<0?'−':'')+Math.abs(pc).toFixed(2).replace('.',',')+'%) so với phiên trước</span></div>'+
 gdSpark()+
 '<div class="gch" style="font-size:10.5px;color:#c9a64a"><span>Thấp nhất 24 phiên: <b style="font-size:11px;color:#ff9a8e">'+gdN(lo24)+'</b></span><span>Cao nhất: <b style="font-size:11px;color:#8ff0aa">'+gdN(hi24)+'</b></span></div>'+
 '<div class="gdcd">Phiên giá kế tiếp sau <b id="gdcd">'+gdClock(m.end-Date.now())+'</b></div></div>'+
 '<div class="gdsec">KÉT SẮT CỦA BẠN</div>'+
 '<div class="gdsum"><div><small>Tổng vốn đã bỏ ra</small><b>'+gdN(tc)+'</b></div><div><small>Giá trị bán hiện tại</small><b>'+gdN(tv)+'</b></div>'+
 '<div><small>Lời / lỗ đang giữ</small><b style="color:'+(pl>0?'#0d6b2a':pl<0?'#a01818':'#3a2400')+'">'+gdSg(pl)+(tc?' ('+(plp>0?'+':plp<0?'−':'')+Math.abs(plp).toFixed(1).replace('.',',')+'%)':'')+'</b></div>'+
 '<div><small>Lời / lỗ đã chốt</small><b style="color:'+(G.re>0?'#0d6b2a':G.re<0?'#a01818':'#3a2400')+'">'+gdSg(G.re)+'</b></div></div>'+
 '<div class="gdmut">Đang giữ <b style="color:#ffe27a">'+wtS+'</b> / '+GD_CAPW+' chỉ vàng</div>';
 if(cnt){h+='<div class="gdsec">TÀI SẢN VÀNG</div>';
  for(const it of GD_ITEMS){const o=G.inv[it[0]];if(!o)continue;const sv=gdSell(it,m.g)*o.q,p1=sv-o.c,pp=o.c?p1/o.c*100:0,avg=Math.round(o.c/o.q);
   h+='<div class="gdv"><div class="gtp"><span class="gve">'+it[3]+'</span><div class="gvn">'+it[1]+' × '+o.q+'<small>'+String(it[2]).replace('.',',')+' chỉ / món • vốn TB '+gdN(avg)+' Xu</small></div>'+
   '<div class="gvp" style="color:'+gdCol(p1)+'">'+gdSg(p1)+' Xu<small>'+(pp>0?'+':pp<0?'−':'')+Math.abs(pp).toFixed(1).replace('.',',')+'%</small></div></div>'+
   '<div class="gvr"><span>Vốn: <b>'+gdN(o.c)+'</b></span><span>Bán được: <b>'+gdN(sv)+'</b></span></div>'+
   '<div class="gvb"><button class="b" onclick="gdSellN(\''+it[0]+'\',1)">Bán 1 ('+gdN(gdSell(it,m.g))+')</button><button class="b" onclick="gdSellN(\''+it[0]+'\',0)">Bán hết ('+gdN(sv)+')</button></div></div>'}}
 h+='<div class="gdsec">QUẦY TRANG SỨC & VÀNG</div><div class="gdg">';
 for(const it of GD_ITEMS){const o=G.inv[it[0]],pr=gdBuy(it,m.ask);
  h+='<div class="gdc'+(it[0]=='dh'?' hv':'')+'">'+(o?'<span class="gco">đang có '+o.q+'</span>':'')+'<div class="gce">'+it[3]+'</div><div class="gcn">'+it[1]+'</div><div class="gcw">'+String(it[2]).replace('.',',')+' chỉ • vàng 9999</div><div class="gcp">'+gdN(pr)+' Xu</div>'+
  '<div class="gcb"><button class="b" onclick="gdBuyN(\''+it[0]+'\',1)">Mua 1</button><button class="b" onclick="gdBuyN(\''+it[0]+'\',5)">Mua 5</button></div></div>'}
 h+='</div>';
 if(G.h.length)h+='<div class="gdsec">GIAO DỊCH GẦN ĐÂY</div><div class="gdh">'+G.h.slice().reverse().map(x=>'<div><span>'+gdTime(x[0])+' • '+(x[1]=='b'?'Mua ':'Bán ')+escH(x[3]||'')+'</span><b style="color:'+(x[1]=='b'?'#ffb0a0':'#8ff0aa')+'">'+(x[1]=='b'?'−':'+')+gdN(x[2])+'</b></div>').join('')+'</div>';
 openUI(h);$('ui').classList.add('gdui');if(!gdTmr)gdTmr=setInterval(gdTick,1000)};
const gdKeep=fn=>{const box=$('ui'),top=box?box.scrollTop:0;fn();const b2=$('ui');if(b2)b2.scrollTop=top};
const gdItem=id=>GD_ITEMS.find(x=>x[0]==id);
window.gdBuyN=(id,n)=>{const it=gdItem(id);if(!it)return;const G=gdBag(),m=gdNow(),pr=gdBuy(it,m.ask);
 if(gdWeight(G)+it[2]*n>GD_CAPW+1e-9){const room=Math.floor((GD_CAPW-gdWeight(G))/it[2]+1e-9);return toast(room>0?'🥇 Két sắt chỉ còn chứa thêm được '+room+' món này':'🥇 Két sắt đã đầy ('+GD_CAPW+' chỉ) — bán bớt vàng rồi mua tiếp')}
 if(ST.xu<pr*n){const k=Math.floor(ST.xu/pr);return toast(k>0?'🪙 Không đủ Xu cho '+n+' món — mua được tối đa '+k:'🪙 Chưa đủ Xu — còn thiếu '+gdN(pr*n-ST.xu)+' Xu')}
 const cost=pr*n;ST.xu-=cost;const o=G.inv[id]||(G.inv[id]={q:0,c:0});o.q+=n;o.c+=cost;gdLog(G,'b',cost,it[1]+(n>1?' ×'+n:''));xuUp();save();
 toast('🥇 Đã mua '+n+' '+it[1]+' — '+gdN(cost)+' Xu');gdKeep(()=>goldUI(1))};
window.gdSellN=(id,n)=>{const it=gdItem(id),G=gdBag(),o=G.inv[id];if(!it||!o)return;const m=gdNow(),k=n?Math.min(n,o.q):o.q;
 const cp=Math.round(o.c*k/o.q),pro=gdSell(it,m.g)*k,pf=pro-cp;
 o.q-=k;o.c-=cp;if(o.q<=0)delete G.inv[id];
 bkPay(Math.min(pro,cp),pf>0?pf:0);   // phần hoàn vốn không tính "kiếm được"; phần lời mới tính
 G.re+=pf;gdLog(G,'s',pro,it[1]+(k>1?' ×'+k:''));xuUp();save();
 toast('🥇 Đã bán '+k+' '+it[1]+' — nhận '+gdN(pro)+' Xu ('+(pf>=0?'lời ':'lỗ ')+gdN(Math.abs(pf))+')');gdKeep(()=>goldUI(1))};

function psAct(a,h){const[t,v]=a.split(':');
 if(t=='shop'){return psShop(v)}   // vào Shop Phố xá: nhắc 2 giây
 if(t=='mini')return window.bbShop?bbShop():toast('🧸 Shop Miniset đang chuẩn bị');
 if(t=='lot')return psLot();
 if(t=='bm')return buffShopUI('bm');
 if(t=='furn')return psFurn();
 if(t=='bank')return bankUI();
 if(t=='gold')return goldUI();
 if(t=='dia')return diaShop();
 if(t=='circus')return circusUI();
 if(t=='mieu')return mieuUI()}
})();
