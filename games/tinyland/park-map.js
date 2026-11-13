/* ============================================================
   CÔNG VIÊN — map mới (vẽ pixel-art bằng canvas, dựng 1 lần khi vào lần đầu)
   Phần mạng/chat/trò chơi nằm ở park-online.js
   ============================================================ */
(()=>{
'use strict';
const TS=16,GC=CW/TS,GR=Math.ceil(CH/TS);
const SOL=new Uint8Array(GC*GR);
const CV=window.CV={sp:[],hits:[],lb:[],pos:{x:720,y:944},seats:[],horses:[],built:0,lake:null,
  seat:-1,hz:-1,lock:0,nm:'',others:new Map(),tbls:[],snd:1};
const blk=(x0,y0,x1,y1,v)=>{v=v==null?1:v;for(let ty=Math.floor(y0/TS);ty<=Math.floor((y1-1)/TS);ty++)for(let tx=Math.floor(x0/TS);tx<=Math.floor((x1-1)/TS);tx++)if(tx>=0&&ty>=0&&tx<GC&&ty<GR)SOL[ty*GC+tx]=v};
window.cvSolid=(x,y)=>{const tx=Math.floor(x/TS),ty=Math.floor(y/TS);return tx<0||ty<0||tx>=GC||ty>=GR||SOL[ty*GC+tx]===1};

// ---------- ngẫu nhiên có hạt giống (để map lúc nào cũng giống nhau) ----------
let sd=20261113;const rn=()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const ir=(a,b)=>a+Math.floor(rn()*(b-a+1)),pk=a=>a[Math.floor(rn()*a.length)];
const hsh=(a,b)=>{let h=Math.imul(a*374761393+b*668265263|0,1274126177);h^=h>>>13;return((h>>>0)%1000)/1000};

// ---------- hồ Thiên Nga (hình dạng) ----------
const LK={x:392,y:430,a:282,b:150};CV.lake=LK;
const lkW=th=>.05*Math.sin(3*th+1)+.035*Math.sin(5*th+2)+.02*Math.sin(2*th);
const lkRR=(x,y)=>{const nx=(x-LK.x)/LK.a,ny=(y-LK.y)/LK.b;return[Math.hypot(nx,ny)-lkW(Math.atan2(ny,nx))-1,Math.atan2(ny,nx)]}; // <0 trong hồ
const inLake=(x,y)=>lkRR(x,y)[0]<0;
CV.inLake=inLake;
const ISL={x:322,y:398,a:40,b:21};

// ---------- tiện ích vẽ ----------
const put=(im,x,by,solidBox)=>{const o=outl(im);CV.sp.push({by,d:()=>cx.drawImage(o,Math.round(x-im.width/2)-1,Math.round(by-im.height)-1)});if(solidBox)blk(...solidBox)};
const dyn=(by,fn)=>CV.sp.push({by,d:fn});
const BR={ // bảng màu
 gr:['#3f8a30','#4a9a37','#55a83d','#61b544','#6dc04b','#79ca53','#85d35b','#8fd862'],
 wood:['#6a4020','#8a5a34','#b07a44','#c8955a','#e0b078']
};
// gạch lát (đường đi): bố cục "chạy so le"
const payRect=(g,x0,y0,x1,y1,tones,jt)=>{tones=tones||['#d6c69c','#dccda4','#cfbf94'];jt=jt||'#b9a878';
 g.fillStyle=jt;g.fillRect(x0,y0,x1-x0,y1-y0);
 for(let y=y0,row=0;y<y1;y+=6,row++){const off=(row%2)*6;
  for(let x=x0-off;x<x1;x+=12){const bx=Math.max(x0,x),bw=Math.min(x1,x+11)-bx,bh=Math.min(5,y1-y-1);if(bw<=0||bh<=0)continue;
   g.fillStyle=tones[Math.floor(hsh(x,y)*tones.length)];g.fillRect(bx,y+1,bw,bh);
   g.fillStyle='rgba(255,255,235,.22)';g.fillRect(bx,y+1,bw,1)}}};
const payPix=(x,y,tones,jt)=>{const row=Math.floor(y/6),off=(row%2)*6,bx=Math.floor((x+off)/12);
 if(y%6==0||(x+off)%12==0)return jt||'#b9a878';
 return tones[Math.floor(hsh(bx,row)*tones.length)]};
const edgeR=(g,x0,y0,x1,y1,c1,c2)=>{g.fillStyle=c1;g.fillRect(x0,y0,x1-x0,2);g.fillRect(x0,y1-2,x1-x0,2);g.fillRect(x0,y0,2,y1-y0);g.fillRect(x1-2,y0,2,y1-y0);
 g.fillStyle=c2;g.fillRect(x0,y1,x1-x0,2)};

// ============================================================
//  SPRITES
// ============================================================
const mkTree=(pal,w,h,fl)=>mk(w,h,(g,r)=>{const cxp=w>>1,th=Math.round(h*.36);
 r('#6b4423',cxp-4,h-th,9,th);r('#8a5a30',cxp-4,h-th,3,th);r('#4e3018',cxp+2,h-th,3,th);r('#6b4423',cxp-7,h-3,15,3);r('#4e3018',cxp-7,h-1,15,1);
 r('#6b4423',cxp-9,h-th+8,6,2);r('#6b4423',cxp+4,h-th+12,7,2);
 const bl=[[cxp,h*.33,w*.40,h*.27],[cxp-w*.24,h*.47,w*.24,h*.19],[cxp+w*.24,h*.47,w*.24,h*.19],[cxp-w*.13,h*.2,w*.24,h*.17],[cxp+w*.15,h*.23,w*.23,h*.17],[cxp,h*.55,w*.32,h*.14]];
 for(const[x,y,a,b]of bl)E(r,pal[0],x,y+3,a,b);
 for(const[x,y,a,b]of bl)E(r,pal[1],x,y,a,b);
 for(const[x,y,a,b]of bl)E(r,pal[2],x-a*.18,y-b*.32,a*.68,b*.58);
 const inb=(x,y)=>bl.some(([a,b,p,q])=>((x-a)/p)**2+((y-b)/q)**2<.82);
 for(let i=0;i<340;i++){const x=Math.round(rn()*w),y=Math.round(rn()*h*.7);if(!inb(x,y))continue;const q=rn();
  r(q<.35?pal[3]:q<.7?pal[0]:pal[2],x,y,q<.5?2:1,1)}
 if(fl)for(let i=0;i<120;i++){const x=Math.round(rn()*w),y=Math.round(rn()*h*.7);if(inb(x,y)){r(fl[i%fl.length],x,y,2,2)}}});
const TREE={
 g1:mkTree(['#2e7d3a','#46a047','#6cc457','#9be06f'],84,98),
 g2:mkTree(['#26683a','#3b8a4a','#58ad5c','#86d078'],76,90),
 yl:mkTree(['#5a8f2a','#79b035','#9fd04a','#c8ec7a'],80,94),
 ph:mkTree(['#2e7d3a','#3f9a40','#63bd52','#8fd86a'],88,100,['#e8362a','#ff5a3c','#ff8a5a','#d02a20']),
 pk:mkTree(['#c25a86','#e07aa6','#f6a0c4','#ffd0e2'],80,92),
 sm:mkTree(['#2e7d3a','#46a047','#6cc457','#9be06f'],54,64)};
const WILLOW=mk(100,104,(g,r)=>{const cxp=50;
 for(let i=0;i<40;i++){const x=cxp+Math.round(3*Math.sin(i/9)),w=Math.round(8-i*.08);r('#6b4423',x-w/2,103-i,w,1);r('#8a5a30',x-w/2,103-i,2,1)}
 E(r,'#3a8a40',cxp,26,46,17);E(r,'#4ea84e',cxp,23,42,15);E(r,'#6cc457',cxp-6,18,28,9);
 for(let x=cxp-46;x<=cxp+46;x+=2){const dx=(x-cxp)/46,top=26+Math.round(15*Math.sqrt(Math.max(0,1-dx*dx))*.9),ln=ir(16,48)*(1-.45*Math.abs(dx));
  for(let y=0;y<ln;y++){const c=y%7<2?'#8fd060':y%5<2?'#5aa84a':'#4a9a42';r(c,x+Math.round(Math.sin(y/6+x)*.7),top+y,2,1)}}
 for(let i=0;i<60;i++)r('#a8e070',cxp-44+Math.round(rn()*88),Math.round(8+rn()*30),2,1)});
const mkBench=()=>mk(48,28,(g,r)=>{
 E(r,'rgba(0,0,0,.2)',24,26,22,2);
 for(const x of[4,41]){r('#2c3036',x,13,3,13);r('#454b54',x,13,1,13);r('#2c3036',x-1,25,5,1);r('#2c3036',x,8,3,6)}
 r('#2c3036',3,12,42,2);
 for(const y of[3,7]){r('#a8703c',3,y,42,3);r('#d9a566',3,y,42,1);r('#7a4a22',3,y+2,42,1)}
 r('#2c3036',3,1,42,2);
 for(const y of[14,18]){r('#c8955a',2,y,44,3);r('#efc088',2,y,44,1);r('#8a5a34',2,y+2,44,1)}
 r('#5a3519',2,21,44,1)});
const mkSflPiece=()=>{ // đầu hoa hướng dương 16x16
 return mk(18,18,(g,r)=>{const c=9;for(let k=0;k<14;k++){const a=k/14*6.283;E(r,k%2?'#ffc61a':'#ffd93b',c+Math.round(Math.cos(a)*6),c+Math.round(Math.sin(a)*6),2,2)}
  E(r,'#ffd93b',c,c,6,6);E(r,'#6b4423',c,c,4,4);E(r,'#4e3018',c,c,3,3);r('#8a5a30',c-2,c-3,2,1);r('#8a5a30',c+1,c+1,2,1);r('#8a5a30',c-1,c+2,1,1)})};
const SFLH=mkSflPiece();
const SFLS=mk(14,40,(g,r)=>{r('#3a8a34',6,0,2,40);r('#2c6e28',7,0,1,40);E(r,'#4aa83e',3,24,3,1);E(r,'#4aa83e',11,30,3,1);r('#3a8a34',4,24,3,1);r('#3a8a34',8,30,3,1)});
// ghế đẩu nhựa & bàn nhựa thấp (vỉa hè)
const mkStool=c=>mk(14,13,(g,r)=>{E(r,'rgba(0,0,0,.2)',7,12,6,1);r(c[2],3,5,8,7);r(c[0],3,5,2,7);r(c[1],10,5,1,7);E(r,c[0],7,4,6,2);E(r,c[3],7,3,5,1);r(c[2],4,11,6,1);for(let y=6;y<11;y+=2)r('rgba(0,0,0,.15)',4,y,6,1)});
const STL=[['#e8564a','#ff8a7a','#b8362c','#ff9a8a'],['#2f7fd8','#6fb4ff','#1f5fb0','#8cc8ff'],['#35a853','#7fe09a','#237a3a','#9af0b2']].map(([a,b,c,d])=>mkStool([b,c,a,d]));
const mkPTbl=c=>mk(26,20,(g,r)=>{E(r,'rgba(0,0,0,.2)',13,19,12,1);r(c[1],4,8,2,11);r(c[1],20,8,2,11);r(c[1],12,10,2,9);E(r,c[0],13,7,12,4);E(r,c[2],13,6,11,3);
 r('#e8f4ff',8,2,3,5);r('#9bd0ff',8,3,3,3);r('#e8f4ff',14,3,3,4);r('#ffd9a0',15,4,1,2);r('#d9302a',18,0,3,7);r('#f0f0f0',18,2,3,1);r('#222',19,0,1,1)});
const PTB=[mkPTbl(['#2f7fd8','#1f5fb0','#6fb4ff']),mkPTbl(['#35a853','#237a3a','#7fe09a']),mkPTbl(['#e8564a','#b8362c','#ff8a7a'])];
// bàn picnic + đồ ăn
const mkPicnic=()=>mk(64,40,(g,r)=>{E(r,'rgba(0,0,0,.2)',32,38,29,2);
 r('#6a4020',6,20,4,18);r('#6a4020',54,20,4,18);r('#8a5a34',9,28,46,3);
 r('#c8955a',2,12,60,10);r('#e0b078',2,12,60,2);r('#8a5a34',2,21,60,1);
 for(let x=2;x<62;x+=6)for(let y=12;y<22;y+=5)r((x/6+y/5)%2?'#f4f4f4':'#e45a4a',x,y,6,5);
 r('rgba(0,0,0,.12)',2,20,60,2);
 // đồ ăn: bánh mì, đĩa trái cây, ly nước, tô
 r('#e0b060',8,6,12,4);r('#f4d08a',9,5,10,2);r('#c88a3a',10,6,1,1);r('#c88a3a',13,6,1,1);r('#c88a3a',16,6,1,1);
 E(r,'#f4f4f4',30,11,9,3);E(r,'#e8302a',27,9,2,2);E(r,'#ffd23f',31,9,2,2);E(r,'#7fd060',34,9,2,2);E(r,'#ff9a3a',30,8,2,2);
 r('#d9302a',46,3,5,8);r('#f4f4f4',46,5,5,1);r('#222',47,3,3,1);r('#bfe8ff',52,6,3,5);r('#e8f8ff',52,6,1,5);
 E(r,'#f4f4f4',58,11,4,2);r('#c0392b',56,9,4,2)});
const mkWStool=()=>mk(14,13,(g,r)=>{E(r,'rgba(0,0,0,.2)',7,12,6,1);r('#6a4020',3,6,2,6);r('#6a4020',10,6,2,6);r('#c8955a',2,4,11,3);r('#e0b078',2,4,11,1);r('#8a5a34',2,6,11,1)});
const WST=mkWStool();
// quán nước: xe đẩy + máy ép mía + thùng đá + biển
const CART=mk(96,60,(g,r)=>{E(r,'rgba(0,0,0,.2)',48,58,44,2);
 // bánh xe
 for(const x of[16,78]){E(r,'#222',x,52,6,6);E(r,'#888',x,52,2,2)}
 // thân xe
 r('#2f6fb0',6,26,84,26);r('#4a8ad0',6,26,84,3);r('#1f4f88',6,50,84,2);r('#1f4f88',6,26,2,26);
 for(let x=14;x<86;x+=14)r('#3a78bc',x,32,1,18);
 // mặt quầy
 r('#d8d8d0',2,22,92,5);r('#f4f4ee',2,22,92,1);r('#a8a8a0',2,26,92,1);
 // thùng đá xanh
 r('#1f8fd8',6,8,24,14);r('#5ab8f0',6,8,24,3);r('#176aa8',6,20,24,2);r('#f0f8ff',10,13,16,4);r('#2f6fb0',12,14,3,2);r('#2f6fb0',17,14,3,2);r('#2f6fb0',22,14,2,2);
 // bình trà đá + ly
 r('#d9302a',36,6,12,16);r('#f4f4f4',36,10,12,2);r('#a8201a',36,20,12,2);r('#222',40,4,4,2);r('#f4f4f4',48,12,3,6);
 for(let i=0;i<4;i++){r('#e8f8ff',54+i*5,14,4,8);r('#ffe6a0',54+i*5,17,4,5);r('#c8e8ff',54+i*5,14,1,8)}
 // máy ép mía
 r('#c0392b',74,6,16,16);r('#e0584a',74,6,16,3);r('#8a1f14',74,20,16,2);E(r,'#d8d8d0',82,12,4,4);E(r,'#888',82,12,2,2);
 for(let i=0;i<4;i++)r(i%2?'#7ab030':'#9cc844',92,4+i*1,2,18-i*2);
 // biển
 r('#f6e7b4',34,30,40,14);r('#7a4a26',34,30,40,1);r('#7a4a26',34,43,40,1);r('#7a4a26',34,30,1,14);r('#7a4a26',73,30,1,14);
 g.fillStyle='#b33b2e';g.font='800 7px Nunito, sans-serif';g.textAlign='center';g.fillText('TRÀ ĐÁ',54,38);g.fillStyle='#2f6fb0';g.fillText('NƯỚC MÍA',54,42)});
// dù che (ô lớn sọc đỏ-trắng)
const UMB=mk(120,52,(g,r)=>{const cx0=60;for(let y=0;y<26;y++){const w=Math.round(58*Math.sqrt(1-((y-26)/26)**2*.55));
  for(let x=-w;x<=w;x+=1){const seg=Math.floor((x+60)/10);r(seg%2?'#f6f6f0':'#d23a2c',cx0+x,y+4,1,1)}}
 for(let x=2;x<118;x+=10)r('rgba(0,0,0,.12)',x,30,1,1);
 r('#a01f14',0,28,120,3);for(let x=0;x<120;x+=6)r(x%12?'#d23a2c':'#f6f6f0',x,31,6,3);
 r('#5a4a3a',59,0,2,6);r('#c0c0b8',58,0,4,2)});
const MOTO=mk(44,32,(g,r)=>{E(r,'rgba(0,0,0,.2)',22,30,20,2);
 for(const x of[8,35]){E(r,'#222',x,24,6,6);E(r,'#555',x,24,4,4);E(r,'#999',x,24,2,2)}
 r('#d23a2c',14,12,18,8);r('#f0584a',14,12,18,2);r('#9a2a1e',14,19,18,2);r('#222',12,10,14,3);r('#3a3a3a',12,10,14,1);
 r('#d23a2c',30,14,8,4);r('#f0584a',30,14,8,1);r('#c8c8c0',33,6,2,10);r('#222',30,5,8,2);r('#ffe66b',37,8,3,3);
 r('#999',18,20,10,3);r('#777',8,22,8,2);r('#fff',20,13,6,2);r('#d23a2c',9,14,5,3)});
const LAMP=mk(14,52,(g,r)=>{E(r,'rgba(0,0,0,.2)',7,50,6,1);r('#2c3036',5,12,3,38);r('#454b54',5,12,1,38);r('#2c3036',3,46,8,4);r('#2c3036',4,44,6,2);
 r('#2c3036',2,8,10,3);r('#fff6c0',3,2,8,7);r('#fffbe0',4,3,5,3);r('#2c3036',2,1,10,2);r('#2c3036',5,0,4,1)});
const BIN=mk(16,22,(g,r)=>{E(r,'rgba(0,0,0,.2)',8,21,7,1);r('#2f7a4a',2,4,12,16);r('#46a066',2,4,3,16);r('#1f5a34',11,4,3,16);r('#2f7a4a',1,2,14,3);r('#46a066',1,2,14,1);r('#f6f6f0',5,9,6,5);r('#2f7a4a',7,10,2,3)});
// bảng gỗ có chữ
const mkSign=(txt,w,sub,col)=>mk(w,sub?34:26,(g,r)=>{const h=sub?34:26;
 r('#5a3519',w/2-14,h-14,3,14);r('#5a3519',w/2+11,h-14,3,14);
 r('#8a5a34',1,0,w-2,h-12);r('#c8955a',2,1,w-4,h-14);r('#e0b078',2,1,w-4,2);r('#7a4a26',1,h-13,w-2,2);
 g.textAlign='center';g.font='800 9px Nunito, sans-serif';g.fillStyle='#4a2008';g.fillText(txt,w/2+1,(sub?13:15)+1);g.fillStyle='#fff3d0';g.fillText(txt,w/2,sub?13:15);
 if(sub){g.font='800 7px Nunito, sans-serif';g.fillStyle='#ffe0a0';g.fillText(sub,w/2,22)}});
// cổng
const GATE_L=mk(30,76,(g,r)=>{E(r,'rgba(0,0,0,.2)',15,74,13,2);r('#a8a8a0',3,8,24,66);r('#c8c8c0',3,8,6,66);r('#8a8a82',22,8,5,66);for(let y=12;y<72;y+=8)r('#9a9a92',3,y,24,1);
 r('#8a8a82',0,4,30,6);r('#c8c8c0',0,4,30,2);r('#d23a2c',5,0,20,5);r('#ff6a58',5,0,20,1);E(r,'#ffd23f',15,22,4,4)});
const ARCH=mk(180,40,(g,r)=>{r('#7a4a26',0,10,180,26);r('#c8955a',3,13,174,20);r('#e0b078',3,13,174,2);r('#7a4a26',3,32,174,2);
 for(let x=10;x<170;x+=12)r('#ffe27a',x,6,5,5);for(let x=16;x<170;x+=12)r('#ff7a7a',x,6,5,5);
 g.textAlign='center';g.fillStyle='#a8281f';g.font='800 14px Nunito, sans-serif';g.fillText('CÔNG VIÊN',90,29);
 g.fillStyle='#ffe27a';g.font='800 8px Nunito, sans-serif';g.fillText('★',24,26);g.fillText('★',156,26)});
// bồn phun nước
const FOUNT=mk(96,64,(g,r)=>{E(r,'rgba(0,0,0,.22)',48,58,46,4);
 E(r,'#8a8a82',48,48,44,12);E(r,'#c0c0b8',48,46,44,11);E(r,'#d8d8d0',48,45,41,9);E(r,'#4aa8e0',48,45,37,8);E(r,'#6cc8f0',48,45,31,6);E(r,'#8fdcf8',48,44,22,4);
 r('#a8a8a0',4,46,88,2);for(let x=8;x<90;x+=8)r('#8a8a82',x,50,1,6);
 r('#c0c0b8',43,22,10,24);r('#e0e0d8',43,22,3,24);r('#9a9a92',50,22,3,24);E(r,'#c0c0b8',48,24,17,5);E(r,'#4aa8e0',48,23,13,3);E(r,'#8fdcf8',48,22,9,2);
 E(r,'#d8d8d0',48,12,6,3);r('#c0c0b8',46,8,4,6)});
const HORSE_COL=[['#ffd23f','#e8a800','#8a5a30'],['#ff8fb5','#e0608a','#fff'],['#6fb4ff','#3a82d8','#fff'],['#e0a060','#a8702e','#4a2c10']];
// cầu trượt, bập bênh
const SLIDE=mk(70,56,(g,r)=>{E(r,'rgba(0,0,0,.2)',35,54,32,2);
 r('#8a5a34',44,10,3,44);r('#8a5a34',58,10,3,44);r('#c8955a',42,8,22,4);
 for(let y=12;y<52;y+=7)r('#c8955a',44,y,17,2);
 r('#d23a2c',38,2,30,6);r('#ff6a58',38,2,30,1);
 for(let i=0;i<36;i++){const x=40-i,y=12+Math.round(i*1.05);r('#3a82d8',x-1,y,6,3);r('#8fc4ff',x-1,y,6,1)}
 r('#2f6fb0',2,48,16,4)});
const SEESAW=mk(72,34,(g,r)=>{E(r,'rgba(0,0,0,.2)',36,32,32,2);r('#8a5a34',30,18,12,14);r('#c8955a',30,18,12,2);
 r('#d23a2c',2,14,68,5);r('#ff6a58',2,14,68,1);r('#8a1f14',2,18,68,1);r('#ffd23f',4,8,8,6);r('#3a82d8',60,8,8,6);r('#222',6,6,2,3);r('#222',62,6,2,3)});
// tiền sảnh trò chơi: bàn
const mkGTbl=kind=>mk(54,34,(g,r)=>{E(r,'rgba(0,0,0,.22)',27,32,26,2);
 r('#5a3519',6,22,4,10);r('#5a3519',44,22,4,10);r('#8a5a34',4,20,46,3);
 r('#c8955a',2,8,50,14);r('#e0b078',2,8,50,2);r('#8a5a34',2,21,50,1);
 if(kind=='ttt'){r('#f6e7b4',16,10,22,11);r('#5a3519',16,10,22,1);
  r('#7a4a26',23,10,1,11);r('#7a4a26',30,10,1,11);r('#7a4a26',16,14,22,1);r('#7a4a26',16,18,22,1);
  r('#d23a2c',18,11,3,3);r('#3a82d8',25,15,3,3);r('#d23a2c',32,19,3,2);r('#3a82d8',32,11,3,3);r('#d23a2c',25,11,2,2)}
 else{r('#2f7a4a',8,10,38,10);for(let i=0;i<4;i++){r('#3a82d8',10+i*9,11,8,8);r('#8fc4ff',10+i*9,11,8,1);r('#fff',13+i*9,14,2,2)}}
 r('rgba(0,0,0,.1)',2,18,50,3)});


// ============================================================
//  NỀN TĨNH (dựng 1 lần)
// ============================================================
const SKY=['#4fb0ec','#62bdf0','#76c9f3','#8bd4f6','#a2dff9','#bce9fb','#d6f3fd'];
const PATHS=[[680,780,760,962],[690,214,750,580],[40,216,1400,252],[840,668,1400,716],[40,668,600,716],[1130,252,1190,296],[880,380,900,444]];
const SIDEW=[44,728,404,952],PLAY=[884,292,1396,532],GPLZ=[944,724,1396,946];
const PLAZA={x:720,y:690,r:118};
const BEDS=[[616,812,672,912],[768,812,824,912],[880,548,1392,580]];
const PTONE=['#d6c69c','#dccda4','#cfbf94'];

function buildBG(){return mk(CW,CH,(g,R)=>{
 // ---- trời + đường chân trời thành phố ----
 for(let y=0;y<164;y+=2)for(let x=0;x<CW;x+=2){const t=Math.min(6.99,y/164*7+((((x>>1)^(y>>1))&1)?.35:0));R(SKY[t|0],x,y,2,2)}
 E(R,'rgba(255,248,200,.30)',1300,58,44,44);E(R,'rgba(255,248,200,.45)',1300,58,30,30);E(R,'#fff6c0',1300,58,20,20);E(R,'#fffde8',1300,58,13,13);
 {let x=0;while(x<CW){const w=ir(22,44),h=ir(26,64),c=pk(['#a6c1d8','#9db9d2','#b3cadf','#8eaac4','#b9cee0']);
   R(c,x,152-h,w,h);R('rgba(255,255,255,.2)',x,152-h,3,h);R('rgba(40,70,100,.12)',x+w-3,152-h,3,h);
   for(let wy=152-h+4;wy<146;wy+=6)for(let wx=x+4;wx<x+w-4;wx+=5)if(rn()<.75)R(rn()<.18?'#fff3b0':'#d6e8f4',wx,wy,2,3);
   if(rn()<.3){R(c,x+(w>>1)-1,152-h-8,2,8);R('#e8574a',x+(w>>1)-1,152-h-8,2,2)}x+=w+ir(0,5)}}
 R('#98b4cc',1182,38,10,116);R('#b4cce0',1182,38,3,116);R('#98b4cc',1185,26,4,12);R('#d8e8f4',1186,18,2,10);E(R,'#e8574a',1187,38,5,5);
 for(let wy=50;wy<146;wy+=8)R('#e8f4fb',1185,wy,4,3);
 R('#a6b8c8',236,96,22,22);R('#8a9cae',232,92,30,5);R('#8a9cae',240,118,3,34);R('#8a9cae',252,118,3,34);
 for(let x=0;x<CW;x+=12)E(R,'#86bf8e',x,154+ir(-4,3),12,9);
 // ---- hàng rào cây phía bắc ----
 R('#2c7436',0,186,CW,30);
 for(let x=0;x<CW;x+=16)E(R,pk(['#2f7f3a','#3a9444','#46a64e']),x,188+ir(-5,3),13,12);
 for(let x=0;x<CW;x+=22)E(R,'#5cb85c',x+6,184+ir(-3,3),8,4);
 for(let x=-10;x<CW;x+=ir(54,82)){const t=pk([TREE.g1,TREE.g2,TREE.yl,TREE.g1,TREE.sm]);g.drawImage(t,x,200-t.height)}
 R('#1f5a2a',0,206,CW,12);R('rgba(10,40,20,.35)',0,214,CW,6);
 // ---- cỏ ----
 const GP=BR.gr;
 for(let y=212;y<CH;y+=4)for(let x=0;x<CW;x+=4){const n=Math.sin(x/53+Math.sin(y/37))*.45+Math.sin((x+y)/29)*.3+Math.sin(y/17+x/71)*.2+Math.sin(x/167)*Math.sin(y/139)*.6+(rn()-.5)*.4;
  R(GP[Math.max(0,Math.min(7,Math.floor((n+1.0)*4.3)))],x,y,4,4)}
 for(let i=0;i<16000;i++){const x=ir(0,CW-2),y=ir(214,CH-2),q=rn();if(q<.5)R('#3f7a2c',x,y,1,2);else if(q<.85)R('#8fd86a',x,y,2,1);else R('#a8e072',x,y,1,1)}
 for(let i=0;i<700;i++){const x=ir(34,CW-40),y=ir(230,950),c=pk(['#ffffff','#fff3a0','#ffb3d1','#d9b3ff','#ff8a7a']);R(c,x,y,2,2);R('#fff3a0',x,y,1,1)}
 // ---- vỉa hè quán nước ----
 {const[x0,y0,x1,y1]=SIDEW;R('#8e8e88',x0-2,y0-2,x1-x0+4,y1-y0+4);
  for(let y=y0;y<y1;y+=16)for(let x=x0;x<x1;x+=16){R(((x+y)>>4)&1?'#bdbdb6':'#b2b2ac',x,y,15,15);R('rgba(255,255,255,.18)',x,y,15,1)}
  for(let x=x0-4;x<x1+6;x+=12)R(((x-x0+4)/12|0)%2?'#f6f6f0':'#d23a2c',x,y0-7,12,6);
  for(let y=y0-4;y<y1;y+=12)R(((y-y0+4)/12|0)%2?'#f6f6f0':'#d23a2c',x1+1,y,6,12);
  R('rgba(0,0,0,.18)',x0,y0-1,x1-x0,2)}
 // ---- sân khu vui chơi (cát + gạch cao su) ----
 {const[x0,y0,x1,y1]=PLAY;R('#e6d49a',x0,y0,x1-x0,y1-y0);
  for(let i=0;i<5200;i++)R(pk(['#d8c586','#f4e6b4','#cbb878']),ir(x0,x1-2),ir(y0,y1-2),2,1);
  const C4=['#e0584a','#ffd23f','#3a82d8','#5ac060'];
  for(let x=x0,k=0;x<x1;x+=16,k++){R(C4[k%4],x,y0,16,10);R(C4[(k+2)%4],x,y1-10,16,10)}
  for(let y=y0,k=0;y<y1;y+=16,k++){R(C4[k%4],x0,y,10,16);R(C4[(k+1)%4],x1-10,y,10,16)}
  R('rgba(255,255,255,.25)',x0,y0,x1-x0,2);R('rgba(255,255,255,.25)',x0,y1-10,x1-x0,2)}
 // ---- sân khu trò chơi ----
 {const[x0,y0,x1,y1]=GPLZ;R('#2f9a94',x0-4,y0-4,x1-x0+8,y1-y0+8);
  for(let y=y0;y<y1;y+=16)for(let x=x0;x<x1;x+=16){R(((x+y)>>4)&1?'#f2e7c8':'#e4d5ab',x,y,16,16);R('rgba(255,255,255,.3)',x,y,16,1)}
  for(let x=x0;x<x1;x+=14)R('#f6f6f0',x,y0-4,7,2);for(let x=x0;x<x1;x+=14)R('#f6f6f0',x,y1+2,7,2);
  // thảm trung tâm cho từng cặp bàn
  for(const bx of[1060,1260])for(const by of[810,900]){R('rgba(58,168,160,.22)',bx-70,by-40,140,62);R('rgba(255,255,255,.35)',bx-70,by-40,140,2);R('rgba(255,255,255,.35)',bx-70,by+20,140,2)}}
 // ---- đường đi: viền trước, rồi lát gạch ----
 for(const[a,b,c,d]of PATHS){R('#9a8860',a-2,b-2,c-a+4,d-b+4)}
 // vòng quanh hồ
 for(let y=LK.y-LK.b-70;y<LK.y+LK.b+70;y++)for(let x=LK.x-LK.a-90;x<LK.x+LK.a+90;x++){const d=lkRR(x,y)[0];
  if(d>.0&&d<.27){const c=d<.035?(((x>>2)+(y>>2))&1?'#b4b4ac':'#a2a29a'):d<.245?payPix(x,y,PTONE):'#9a8860';R(c,x,y,1,1)}}
 // quảng trường đài phun nước
 for(let y=PLAZA.y-PLAZA.r-4;y<PLAZA.y+PLAZA.r+4;y++)for(let x=PLAZA.x-PLAZA.r-4;x<PLAZA.x+PLAZA.r+4;x++){const dx=x-PLAZA.x,dy=y-PLAZA.y,rr=Math.hypot(dx,dy);
  if(rr>PLAZA.r+2)continue;let c;
  if(rr>PLAZA.r)c='#9a8860';else if(rr>94)c=payPix(x,y,PTONE);
  else if(rr>91)c='#a89868';else{const b=Math.floor(rr/12),s=Math.floor((Math.atan2(dy,dx)+Math.PI)/(Math.PI/8));c=((b+s)&1)?'#eadfbf':'#d9caa0';if(rr%12<1)c='#c4b484'}
  R(c,x,y,1,1)}
 // lát gạch các đường chữ nhật
 for(const[a,b,c,d]of PATHS)payRect(g,a,b,c,d,PTONE);
 for(const[a,b,c,d]of PATHS){R('rgba(255,255,235,.25)',a,b,c-a,1)}
 // ---- hồ ----
 const WC=['#80d2f0','#6cc6ea','#5ab8e2','#4aa8d8','#3e98ca','#348ab9'];
 for(let y=LK.y-LK.b-30;y<LK.y+LK.b+30;y+=2)for(let x=LK.x-LK.a-50;x<LK.x+LK.a+50;x+=2){const d=lkRR(x+1,y+1)[0];if(d>=0)continue;
  const dep=Math.min(.999,-d/.8),t=Math.min(5.99,dep*6+((((x>>1)+(y>>1))&1)?.3:0));R(WC[t|0],x,y,2,2)}
 // đảo nhỏ
 E(R,'#cdbb86',ISL.x,ISL.y+2,ISL.a+4,ISL.b+3);E(R,'#e6d49a',ISL.x,ISL.y,ISL.a+2,ISL.b+1);E(R,'#6cc04b',ISL.x,ISL.y-2,ISL.a-4,ISL.b-4);E(R,'#8fd862',ISL.x-4,ISL.y-4,ISL.a-14,ISL.b-9);
 for(let i=0;i<14;i++)R(pk(['#ffffff','#ffd23f','#ff8fb5']),ISL.x-30+ir(0,60),ISL.y-8+ir(0,12),2,2);
 for(const[x,y]of[[ISL.x-36,ISL.y+6],[ISL.x+34,ISL.y+4],[ISL.x+6,ISL.y+14]]){E(R,'#8a8a84',x,y,5,3);E(R,'#b4b4ac',x-1,y-1,3,2)}
 // sen / súng
 const pad=(x,y,fl)=>{E(R,'#2f8a40',x,y,8,3);E(R,'#48b05a',x-1,y-1,6,2);R('#3aa8dd',x+1,y,6,1);if(fl){E(R,'#ff9fc2',x,y-3,4,3);E(R,'#ffd0e2',x,y-4,2,2);R('#ffe66b',x,y-3,1,1)}};
 for(const[x,y,f]of[[520,372,1],[552,392,0],[500,402,0],[470,322,1],[212,470,1],[186,452,0],[238,498,0],[600,470,1],[620,448,0],[540,520,1],[280,330,0],[640,400,0],[566,356,1]])pad(x,y,f);
 // lau sậy ven hồ
 for(const[x,y]of[[132,430],[126,452],[140,478],[170,520],[196,540],[600,552],[640,520],[660,470],[246,296],[300,288],[560,296],[610,310]]){for(let k=0;k<3;k++){const h=ir(14,24);R('#4a9a3a',x+k*3,y-h,1,h);R('#6bbf4a',x+k*3+1,y-h,1,h);R('#8a5a30',x+k*3-1,y-h-3,3,5)}}
 // cầu tàu gỗ
 {const x0=374,y0=524,x1=406,y1=606;R('#5a3a1c',x0-2,y0-2,x1-x0+4,y1-y0+4);
  for(let y=y0;y<y1;y+=5){R(((y-y0)/5|0)%2?'#c08a50':'#b07a44',x0,y,x1-x0,4);R('rgba(255,235,190,.4)',x0,y,x1-x0,1);R('#6a4020',x0,y+4,x1-x0,1)}
  R('#7a4a26',x0-2,y0-2,2,y1-y0+2);R('#7a4a26',x1,y0-2,2,y1-y0+2);
  for(let y=y0;y<y1-6;y+=14){R('#5a3519',x0-3,y,4,6);R('#5a3519',x1-1,y,4,6);R('#e0b078',x0-3,y,4,1);R('#e0b078',x1-1,y,4,1)}
  R('rgba(20,70,110,.25)',x0-2,y0-5,x1-x0+4,3)}
 // bồn hoa & bụi hoa trên bãi cỏ
 const patch=(x,y,n,c)=>{for(let i=0;i<n;i++){const px=x+ir(-14,14),py=y+ir(-8,8);R('#2f7a2c',px,py,1,4);R(pk(c),px-1,py-2,3,3);R('#fff3a0',px,py-1,1,1)}};
 for(const[x,y,c]of[[560,560,['#ff6a8a','#ff9fc2','#ffffff']],[860,600,['#ffd23f','#ff9a3a','#fff3a0']],[780,620,['#b36bff','#d9b3ff','#fff']],[300,640,['#ff6a8a','#ffffff']],[110,620,['#ffd23f','#ff9a3a']],[1330,600,['#ff6a8a','#ffffff','#ffd23f']],[1140,620,['#6fb4ff','#fff','#d9b3ff']],[430,720,['#ffd23f','#fff']],[590,740,['#ff6a8a','#ff9fc2']],[470,950,['#b36bff','#fff']],[860,930,['#ffd23f','#ff9a3a']],[1000,560,['#ff6a8a','#fff']],[880,300,['#ffd23f','#fff3a0']],[800,260,['#ff6a8a','#ffffff']]])patch(x,y,34,c);
 // luống hoa hướng dương: đất + gạch viền
 for(const[a,b,c,d]of BEDS){R('#6a4426',a-3,b-3,c-a+6,d-b+6);R('#8a5a30',a,b,c-a,d-b);for(let i=0;i<(c-a)*(d-b)/60;i++)R(pk(['#6a4426','#a07040']),ir(a,c-2),ir(b,d-2),2,1);R('rgba(255,255,255,.15)',a-3,b-3,c-a+6,1)}
 // ---- hàng rào + đường phố phía nam ----
 R('#5a5e66',0,976,CW,32);R('#6a6e76',0,976,CW,3);for(let x=0;x<CW;x+=40)R('#e8e8e0',x+8,994,22,2);R('#9a9a94',0,972,CW,6);R('#b8b8b0',0,972,CW,1);
 for(let x=28;x<CW-28;x+=12){if(x>660&&x<780)continue;R('#2c3036',x+4,940,2,32);R('#454b54',x+4,940,1,32);R('#2c3036',x+3,938,4,3);}
 R('#2c3036',28,950,632,2);R('#2c3036',780,950,632,2);R('#2c3036',28,964,632,2);R('#2c3036',780,964,632,2);
 for(let x=28;x<CW-28;x+=60){if(x>640&&x<780)continue;R('#a8a8a0',x,930,8,44);R('#c8c8c0',x,930,3,44);R('#8a8a82',x+5,930,3,44);R('#d23a2c',x-1,926,10,5)}
 // ---- hàng cây hai bên ----
 for(let y=230;y<970;y+=ir(60,84)){for(const x of[8,CW-8]){const t=pk([TREE.g1,TREE.g2,TREE.yl,TREE.ph]);g.drawImage(t,x-(t.width>>1),y-t.height+36)}}
 R('#1f5a2a',0,214,28,760);R('#1f5a2a',CW-28,214,28,760);
 for(let y=230;y<970;y+=ir(46,60)){for(const x of[6,CW-6]){const t=pk([TREE.g2,TREE.g1,TREE.sm]);g.drawImage(t,x-(t.width>>1),y-t.height+30)}}
})}

// ============================================================
//  DỰNG MAP: sprite, va chạm, điểm tương tác
// ============================================================
const FLOW=[]; // luống hướng dương: mỗi hàng 1 sprite động
let BGC=null,HAS_CLOUD=null;
const CLOUD=mk(110,34,(g,r)=>{E(r,'rgba(255,255,255,.95)',34,22,28,9);E(r,'#fff',60,16,30,12);E(r,'#fff',84,22,22,8);E(r,'#fff',50,24,48,8);E(r,'rgba(170,205,230,.55)',50,29,44,3)});
const SWANS=[
 {cx:480,cy:462,a:92,b:44,w:.30,ph:0},{cx:250,cy:466,a:70,b:38,w:-.26,ph:2},
 {cx:410,cy:340,a:130,b:16,w:.22,ph:1},{cx:520,cy:518,a:62,b:12,w:-.34,ph:4},{cx:560,cy:420,a:40,b:60,w:.2,ph:3.2}];
CV.swans=SWANS;
const drawSwan=(s,tm)=>{const u=tm*s.w+s.ph,x=Math.round(s.cx+s.a*Math.cos(u)),y=Math.round(s.cy+s.b*Math.sin(u)),dir=(-s.a*s.w*Math.sin(u))>=0?1:-1,bob=Math.round(Math.sin(tm*2+s.ph)*.7),nb=Math.round(Math.sin(tm*1.4+s.ph*2));
 E(R0,'rgba(20,70,110,.25)',x,y+2,13,3);
 // gợn nước
 const a=(tm*.8+s.ph)%1;E(R0,'rgba(235,250,255,'+(.4*(1-a)).toFixed(2)+')',x-dir*8,y+3,Math.round(12+a*8),Math.round(2+a*2));
 mirror(x,dir,()=>{const r=R0;
  E(r,'#dcecf4',x,y+1+bob,11,4);E(r,'#fff',x,y+bob,11,4);E(r,'#fff',x-2,y-1+bob,8,3);r('#e6f2f8',x-8,y+1+bob,8,1);
  r('#cfe0ea',x-4,y-1+bob,8,2);r('#e6f2f8',x-9,y-3+bob,4,3);r('#fff',x-10,y-3+bob,3,2);
  r('#fff',x+7,y-9+bob+nb,3,9);r('#fff',x+6,y-14+bob+nb,3,6);r('#fff',x+7,y-17+bob+nb,5,4);r('#dcecf4',x+7,y-8+bob+nb,1,7);
  r('#f4a030',x+12,y-15+bob+nb,3,2);r('#222',x+10,y-16+bob+nb,1,1);r('#222',x+12,y-14+bob+nb,1,1)})};
const R0=r; // hàm vẽ chữ nhật của canvas chính

// quảng cáo LED
const BOARD={x:968,y:132,w:244,h:76};
const ADS=[
 {bg:'#0d4a2a',t1:'CÔNG VIÊN',t2:'XIN CHÀO!',ic:'sun'},
 {bg:'#0a2f5a',t1:'TRÀ ĐÁ MÁT LẠNH',t2:'CHỈ 3K / LY',ic:'cup'},
 {bg:'#4a1230',t1:'TIC TAC TOE',t2:'THẮNG LÀ NHẬN XU!',ic:'xo'},
 {bg:'#3a2a08',t1:'NGỰA NHÚN',t2:'LEO LÊN LÀ MÊ!',ic:'horse'},
 {bg:'#073a4a',t1:'HỒ THIÊN NGA',t2:'GHÉ NGẮM THIÊN NGA',ic:'swan'}];
const TICK='★ GIỮ GÌN CÔNG VIÊN XANH – SẠCH – ĐẸP ★ ĐỪNG QUÊN CHƠI LẬT HÌNH VỚI BẠN BÈ ★ TRÀ ĐÁ VỈA HÈ MỜI BẠN GHÉ ★ ';
function drawAd(a,ox,tm){const{x,y,w,h}=BOARD,ix=x+8,iy=y+8,iw=w-16,ih=h-26;
 cx.fillStyle=a.bg;cx.fillRect(ix+ox,iy,iw,ih);
 cx.fillStyle='rgba(255,255,255,.06)';for(let k=0;k<ih;k+=4)cx.fillRect(ix+ox,iy+k,iw,1);
 const mx=ix+ox+32,my=iy+ih/2,b=Math.sin(tm*5);
 if(a.ic=='sun'){cx.fillStyle='#ffd93b';cx.beginPath();cx.arc(mx,my+b,10,0,7);cx.fill();for(let k=0;k<10;k++){const an=k/10*6.283+tm;cx.fillRect(mx+Math.cos(an)*14-1,my+b+Math.sin(an)*14-1,3,3)}cx.fillStyle='#6b4423';cx.beginPath();cx.arc(mx,my+b,5,0,7);cx.fill()}
 else if(a.ic=='cup'){cx.fillStyle='#e8f8ff';cx.fillRect(mx-7,my-10,14,20);cx.fillStyle='#ffd08a';cx.fillRect(mx-7,my-3,14,13);cx.fillStyle='#fff';for(let k=0;k<3;k++)cx.fillRect(mx-5+k*4,my-2-((tm*14+k*7)%12),2,2);cx.fillStyle='#d9302a';cx.fillRect(mx+2,my-16,2,10)}
 else if(a.ic=='xo'){const f=Math.floor(tm*2)%2;cx.font='800 24px Nunito,sans-serif';cx.textAlign='center';cx.fillStyle=f?'#ff6a6a':'#6ab4ff';cx.fillText(f?'X':'O',mx,my+9);cx.fillStyle=f?'#6ab4ff':'#ff6a6a';cx.fillText(f?'O':'X',mx+22,my+9)}
 else if(a.ic=='horse'){const sx=Math.sin(tm*5)*3;cx.fillStyle='#ffd23f';cx.fillRect(mx-8+sx,my-6+b,16,10);cx.fillRect(mx+6+sx,my-12+b,8,8);cx.fillStyle='#8a5a30';cx.fillRect(mx-9+sx,my-5+b,3,8);cx.fillStyle='#aaa';cx.fillRect(mx-2,my+4,4,8)}
 else{const sx=Math.sin(tm*2)*5;cx.fillStyle='#fff';cx.fillRect(mx-9+sx,my,18,8);cx.fillRect(mx+5+sx,my-10,4,12);cx.fillRect(mx+5+sx,my-12,7,4);cx.fillStyle='#f4a030';cx.fillRect(mx+12+sx,my-10,3,2);cx.fillStyle='rgba(255,255,255,.4)';cx.fillRect(mx-14+sx,my+10,28,1)}
 cx.textAlign='left';cx.font='800 15px Nunito,sans-serif';cx.fillStyle='#fff7c0';cx.fillText(a.t1,ix+ox+62,iy+22);
 cx.font='800 9px Nunito,sans-serif';cx.fillStyle='#9affc8';cx.fillText(a.t2,ix+ox+62,iy+40)}
function drawBoard(tm){const{x,y,w,h}=BOARD;
 // chân cột
 cx.fillStyle='#454b54';cx.fillRect(x+30,y+h-2,6,18);cx.fillRect(x+w-36,y+h-2,6,18);
 cx.fillStyle='#2c3036';cx.fillRect(x-2,y-2,w+4,h+4);cx.fillStyle='#454b54';cx.fillRect(x,y,w,h);
 for(let k=0;k<w;k+=8){cx.fillStyle=((k/8|0)+Math.floor(tm*3))%2?'#ffe27a':'#ff7a7a';cx.fillRect(x+k+2,y+1,3,3)}
 cx.fillStyle='#0b0b0b';cx.fillRect(x+6,y+6,w-12,h-22);
 cx.save();cx.beginPath();cx.rect(x+7,y+7,w-14,h-24);cx.clip();
 const T=4.2,k=Math.floor(tm/T)%ADS.length,p=(tm%T)/T,sl=p>.88?(p-.88)/.12:0,e=sl*sl*(3-2*sl);
 drawAd(ADS[k],-Math.round(e*(w-16)),tm);if(sl>0)drawAd(ADS[(k+1)%ADS.length],Math.round((1-e)*(w-16)),tm);
 cx.restore();
 // chữ chạy
 cx.fillStyle='#16161a';cx.fillRect(x+6,y+h-16,w-12,11);cx.save();cx.beginPath();cx.rect(x+6,y+h-16,w-12,11);cx.clip();
 cx.font='800 8px Nunito,sans-serif';cx.textAlign='left';cx.fillStyle='#ffcf5a';const tw=cx.measureText(TICK).width,off=(tm*34)%tw;cx.fillText(TICK+TICK,x+8-off,y+h-7);cx.restore();
 cx.fillStyle='rgba(255,255,255,.05)';for(let yy=y+6;yy<y+h-6;yy+=3)cx.fillRect(x+6,yy,w-12,1)}

// ---- hướng dương ----
function sunRow(x0,x1,y,step){const a=[];for(let x=x0;x<=x1;x+=step)a.push({x:x+((hsh(x,y)*4)|0)-2,ph:hsh(y,x)*6.28,h:34+((hsh(x+3,y)*8)|0)});
 dyn(y,()=>{const t=performance.now()/1000;for(const f of a){if(f.x<camX-20||f.x>camX+vw+20||y<camY||y-70>camY+vh)continue;
  const sw=Math.sin(t*1.5+f.ph),X=Math.round(f.x);cx.drawImage(SFLS,X-7,y-40);cx.drawImage(SFLH,X-9+Math.round(sw*1.4),y-f.h-12-(Math.abs(sw)>.9?1:0))}})}

// ---- ngựa nhún ----
function drawHorse(h,tm,occ){const col=HORSE_COL[h.c],x=h.x,by=h.y,rock=occ?Math.sin(tm*5+h.i):0,sx=Math.round(rock*3),ox=x+sx,r=R0;
 E(r,'rgba(0,0,0,.22)',x,by-1,14,3);E(r,'#3a3f48',x,by-3,11,3);E(r,'#6a707a',x,by-4,9,2);
 for(let k=0;k<7;k++){const f=k/6,px=x-2+Math.round(sx*f);r('#8a8a92',px+((k&1)?2:-1),by-5-k*2,5,2);r('#c8c8d0',px+((k&1)?2:-1),by-5-k*2,5,1)}
 const c0=col[0],c1=col[1],c2=col[2];
 r(c1,ox-8,by-19,3,7);r(c1,ox+5,by-19,3,7);r('#333',ox-8,by-13,3,2);r('#333',ox+5,by-13,3,2);
 r(c2,ox-14,by-27,4,11);r(c2,ox-13,by-17,3,4);
 E(r,c0,ox,by-23,11,6);E(r,c1,ox,by-19,9,2);E(r,'rgba(255,255,255,.35)',ox-2,by-26,6,2);
 r(c0,ox+6,by-35,6,13);r(c2,ox+4,by-37,3,12);r(c0,ox+8,by-39,10,7);r('#fff',ox+16,by-37,4,5);r('#222',ox+18,by-36,1,1);r('#222',ox+10,by-37,1,2);r(c1,ox+8,by-43,3,4);r(c2,ox+10,by-42,3,3);
 r('#d23a2c',ox-5,by-30,10,3);r('#ff7a6a',ox-5,by-30,10,1);r('#c8c8c8',ox+7,by-31,8,1);r('#d23a2c',ox+14,by-33,2,4)}

// ============================================================
//  DỰNG MAP
// ============================================================
function build(){
 CV.built=1;
 BGC=buildBG();
 const sp=CV.sp,hits=CV.hits,lb=CV.lb,seats=CV.seats;
 // ----- va chạm nền -----
 blk(0,0,CW,224);blk(0,0,28,CH);blk(CW-28,0,CW,CH);blk(0,960,CW,CH);
 for(let ty=0;ty<GR;ty++)for(let tx=0;tx<GC;tx++){let s=0;for(const[ox,oy]of[[0,0],[16,0],[0,16],[16,16],[8,8]])if(lkRR(tx*TS+ox,ty*TS+oy)[0]<.015){s=1;break}if(s)SOL[ty*GC+tx]=1}
 blk(372,520,408,612,0);
 // fountain
 for(let ty=0;ty<GR;ty++)for(let tx=0;tx<GC;tx++)if(Math.hypot((tx*TS+8-720)/44,(ty*TS+8-694)/22)<1)SOL[ty*GC+tx]=1;
 for(const[a,b,c,d]of BEDS)blk(a-2,b-2,c+2,d+2);
 // sân chơi: rào quanh, chừa 2 cổng
 {const[a,b,c,d]=PLAY;blk(a-4,b-4,c+4,b+4);blk(a-4,d-4,c+4,d+4);blk(c-4,b-4,c+4,d+4);blk(a-4,b-4,a+4,d+4);blk(1130,b-6,1190,b+8,0);blk(a-6,380,a+10,444,0)}
 // ----- cây cối -----
 const tree=(k,x,by)=>{const im=TREE[k];put(im,x,by);blk(x-8,by-12,x+8,by)};
 for(const[k,x,y]of[['g1',70,330],['yl',62,520],['g2',68,640],['ph',800,296],['g1',860,450],['pk',832,556],['g2',868,330],['g1',1380,650],
   ['g2',430,756],['ph',590,744],['g1',620,956],['yl',420,950],['ph',870,744],['g1',915,740],['yl',1400,820],['g1',1396,940],
   ['g1',1250,600],['ph',1020,600],['g2',1110,590]]){if(y>940&&x>500&&x<900)continue;tree(k,x,Math.min(y,952))}
 put(WILLOW,ISL.x,ISL.y+8);
 // ----- cổng -----
 put(GATE_L,664,976);put(GATE_L,776,976);
 const arch=mk(180,40,(g,r)=>g.drawImage(ARCH,0,0));put(arch,720,914);
 lb.push(['🚪 Cổng ra',720,970]);
 hits.push([676,930,88,44,'🚪 Cổng công viên — bấm E để ra về Nông Trại','gate']);
 // ----- đài phun nước -----
 put(FOUNT,720,706);
 dyn(704,()=>{const t=performance.now()/1000,x=720,y=662;
  for(let a=0;a<8;a++){const an=a/8*6.283+.4;for(let i=0;i<7;i++){const q=(t*.9+i/7+(a%2)*.5)%1,px=x+Math.cos(an)*q*30,py=y+4+Math.sin(an)*q*10-Math.sin(q*3.1416)*26+q*q*10;
    R0('rgba(220,244,255,'+(.95-q*.5).toFixed(2)+')',Math.round(px),Math.round(py),2,2)}}
  const hh=24+Math.sin(t*3)*4;for(let i=0;i<10;i++){const q=(t*1.6+i/10)%1;R0('rgba(235,250,255,.95)',x-1+Math.round(Math.sin(i+t*4)),Math.round(y+10-q*hh),2,2)}
  for(let k=0;k<3;k++){const q=(t*.7+k/3)%1;E(R0,'rgba(235,250,255,'+(.5*(1-q)).toFixed(2)+')',x,694,Math.round(10+q*28),Math.round(3+q*8))}});
 hits.push([694,664,52,40,'⛲ Đài phun nước giữa công viên']);
 // ----- ghế đá (2 chỗ) -----
 const BEN=mkBench();
 const bench=(x,by)=>{put(BEN,x,by);blk(x-24,by-10,x+24,by);for(const dx of[-11,11]){const i=seats.length;
   seats.push({x:x+dx,y:by-7,by,sy:by+16,kind:'bench'});hits.push([x+dx-10,by-22,20,22,'🪑 Ghế đá — bấm E để ngồi','cv:seat:'+i,[x+dx,by+18]])}};
 for(const[x,y]of[[190,272],[340,272],[490,272],[800,360],[800,500],[230,612],[550,612],[1010,652],[1300,652]])bench(x,y);
 // ----- bàn picnic có đồ ăn -----
 const PIC=mkPicnic();
 const picnic=(x,by)=>{put(PIC,x,by);blk(x-30,by-12,x+30,by);for(const dx of[-44,44]){const i=seats.length;
   put(WST,x+dx,by+3);seats.push({x:x+dx,y:by-1,by:by+3,sy:by+20,kind:'stool'});hits.push([x+dx-9,by-14,18,16,'🪑 Ngồi ăn picnic — bấm E','cv:seat:'+i,[x+dx,by+20]])}};
 picnic(500,832);picnic(530,912);
 hits.push([470,808,60,26,'🥖 Bàn picnic: bánh mì, trái cây, nước mát!']);
 // ----- quán nước vỉa hè -----
 put(UMB,140,764);put(CART,140,806,[92,778,190,806]);
 hits.push([92,740,98,66,'🧋 Quán nước cô Ba: trà đá, nước mía, cà phê!','cv:npc']);
 dyn(796,()=>{const o={d:0,a:0,mv:0,sit:0,hair:0,set:0},t=performance.now()/1000;drawAv(cx,136,762+Math.round(Math.sin(t*2)*.6),o)});

 put(MOTO,350,792,[330,772,376,792]);hits.push([330,766,48,28,'🛵 Xe máy dựng ven đường']);
 put(BIN,64,744,[54,734,76,744]);
 const ptab=(x,by,ci,sc)=>{put(PTB[ci],x,by);for(const dx of[-24,24]){const i=seats.length;put(STL[sc[dx<0?0:1]],x+dx,by+3);
   seats.push({x:x+dx,y:by-1,by:by+3,sy:by+16,kind:'stool'});hits.push([x+dx-8,by-12,16,15,'🪑 Ghế nhựa vỉa hè — bấm E để ngồi','cv:seat:'+i,[x+dx,by+16]])}};
 ptab(150,862,0,[0,1]);ptab(250,904,1,[2,0]);ptab(318,842,2,[1,2]);
 // ----- bàn trò chơi -----
 const GT=[['t1','ttt',20,1060,812,'TIC TAC TOE'],['t2','ttt',100,1060,904,'TIC TAC TOE'],['m1','mem',20,1260,812,'LẬT HÌNH'],['m2','mem',100,1260,904,'LẬT HÌNH']];
 for(const[id,kind,bet,x,by,txt]of GT){const tb={id,kind,bet,x,by,seats:[]};CV.tbls.push(tb);
  put(mkGTbl(kind),x,by);blk(x-26,by-14,x+26,by);
  put(mkSign(txt,70,bet+' XU / VÁN',kind=='ttt'?'#2a3a8a':'#8a2a5a'),x,by-30);
  for(const dx of[-44,44]){const i=seats.length;put(WST,x+dx,by+3);tb.seats.push(i);
   seats.push({x:x+dx,y:by-1,by:by+3,sy:by+18,kind:'game',tb:id,side:dx<0?0:1});
   hits.push([x+dx-9,by-14,18,16,(kind=='ttt'?'⭕ Tic Tac Toe':'🃏 Lật hình')+' — cược '+bet+' Xu. Bấm E để ngồi chờ bạn chơi','cv:seat:'+i,[x+dx,by+18]])}}
 // biển khu trò chơi
 const banner=mk(220,44,(g,r)=>{r('#5a3519',16,18,4,26);r('#5a3519',200,18,4,26);r('#2f9a94',4,0,212,24);r('#5ac8c0',6,2,208,4);r('#1f6e6a',4,20,212,3);
   for(let x=10;x<212;x+=14){r('#ffe27a',x,24,4,4);r('#ff7a7a',x+7,24,4,4)}
   g.textAlign='center';g.fillStyle='#fff';g.font='800 14px Nunito, sans-serif';g.fillText('KHU TRÒ CHƠI',110,17)});
 put(banner,1170,748);
 // ----- sân chơi: ngựa nhún, bập bênh, cầu trượt -----
 const HP=[[964,452,0],[1024,452,1],[1084,452,2],[1144,452,3]];
 HP.forEach(([x,y,c],i)=>{const h={x,y,c,i};CV.horses.push(h);dyn(y,()=>drawHorse(h,performance.now()/1000,CV.hzOcc&&CV.hzOcc(i)));
   blk(x-12,y-6,x+12,y);hits.push([x-14,y-44,28,46,'🐎 Ngựa nhún — bấm E để leo lên nhún!','cv:horse:'+i,[x,y+18]])});
 put(SEESAW,1240,458,[1210,448,1270,458]);hits.push([1208,430,64,30,'⚖️ Bập bênh (sắp có thể chơi)']);
 put(SLIDE,1330,462,[1300,430,1360,462]);hits.push([1296,408,70,56,'🛝 Cầu trượt (sắp có thể chơi)']);
 put(mkSign('KHU VUI CHƠI',86,null),1160,298);
 // ----- hoa hướng dương -----
 for(const y of[834,854,874,894,908])sunRow(624,664,y,20),sunRow(776,816,y,20);
 for(const y of[560,576])sunRow(888,1384,y,18);
 hits.push([616,812,56,100,'🌻 Hàng hoa hướng dương rực rỡ']);hits.push([768,812,56,100,'🌻 Hàng hoa hướng dương rực rỡ']);hits.push([880,548,512,32,'🌻 Luống hướng dương dài']);
 // ----- đèn đường, thùng rác, biển hồ -----
 for(const[x,y]of[[676,900],[764,900],[676,810],[764,810],[684,300],[756,300],[684,520],[756,520],[1130,700],[1376,700],[560,700],[300,700],[100,700],[960,240],[430,240],[1280,240]])put(LAMP,x,y);
 for(const[x,y]of[[640,700],[800,650],[1000,708],[432,266]])put(BIN,x,y);
 put(mkSign('HỒ THIÊN NGA',104,'🦢 sắp có câu cá',null),415,282);
 hits.push([374,520,34,30,'🎣 Bến câu cá — sắp có thể câu cá ở Hồ Thiên Nga!']);
 hits.push([130,296,520,280,'🦢 Hồ Thiên Nga — những chú thiên nga đang bơi lội']);
 // biển quảng cáo
 dyn(214,()=>{if(BOARD.x<camX+vw+10&&BOARD.x+BOARD.w>camX-10)drawBoard(performance.now()/1000)});
 hits.push([BOARD.x,BOARD.y,BOARD.w,BOARD.h+18,'📺 Biển quảng cáo điện tử']);
 // ----- chim sẻ + chim hót -----
 CV.sparrows=[];for(const[x,y]of[[720,300],[560,640],[1000,690],[250,640],[720,760],[1160,270]])CV.sparrows.push({x,y,dir:1,st:'hop',t:rn()*2,ph:rn()*6,ft:0,dur:1,tx:x,ty:y,ax:x,ay:y,fx:x,fy:y});
 CV.songs=[[802,206,'#4aa8e8','#ffd93b'],[862,356,'#e8574a','#ffd93b'],[72,262,'#ffd93b','#8a5a30'],[1388,246,'#4aa8e8','#fff'],[598,640,'#e8574a','#ffd93b'],[440,640,'#6bd46b','#ffd93b'],[1118,570,'#ffd93b','#e8574a']]
  .map(([x,y,c,w],i)=>({x,y,c,w,t:2+i*1.3,s:0,ph:i}));
 CV.bfly=[...Array(10)].map((_,i)=>({x:200+rn()*1000,y:300+rn()*600,tx:0,ty:0,t:0,c:['#ffd23f','#ff9fc2','#fff','#b8a0ff','#ff9a3a'][i%5],ph:rn()*6}));
 CV.petals=[...Array(26)].map(()=>({x:rn()*CW,y:rn()*CH,v:6+rn()*8,ph:rn()*6,c:pk(['#ffc2d4','#ff9fb8','#ffe0ea','#ffb3a0'])}));
 CV.clouds=[...Array(6)].map((_,i)=>({x:i*260-80,y:8+(i%3)*30,v:2+i%3*1.2}));
 CV.cars=[{x:100,v:34,t:0},{x:900,v:-26,t:1},{x:500,v:48,t:0},{x:1300,v:-40,t:1}];
 CV.waves=[];for(let i=0;i<150;i++){const x=LK.x-LK.a+rn()*LK.a*2,y=LK.y-LK.b+rn()*LK.b*2;if(lkRR(x,y)[0]<-.1)CV.waves.push({x,y,l:ir(4,9),ph:rn()*6})}
}

// ---------- vẽ nền động (trời, mây, nước, thiên nga, xe cộ) ----------
window.cvDrawBG=tm=>{
 cx.drawImage(BGC,0,0);
 for(const c of CV.clouds){c.x+=c.v*.016;if(c.x>CW+60)c.x=-130;cx.globalAlpha=.9;cx.drawImage(CLOUD,Math.round(c.x),c.y);cx.globalAlpha=1}
 // lấp lánh mặt hồ
 for(const w of CV.waves){const a=Math.sin(tm*2.1+w.ph);if(a>.1){cx.fillStyle='rgba(235,250,255,'+(a*.55).toFixed(2)+')';cx.fillRect(Math.round(w.x+Math.sin(tm*.5+w.ph)*3),Math.round(w.y),w.l,1);cx.fillStyle='rgba(20,80,130,.18)';cx.fillRect(Math.round(w.x+Math.sin(tm*.5+w.ph)*3)+1,Math.round(w.y)+1,w.l,1)}}
 for(const s of SWANS)drawSwan(s,tm);
 // gợn quanh đảo
 E(R0,'rgba(235,250,255,'+(.25+.1*Math.sin(tm*2)).toFixed(2)+')',ISL.x,ISL.y+ISL.b+4,ISL.a+8,3);
 // xe cộ ngoài phố
 for(const c of CV.cars){c.x+=c.v*.016;if(c.x>CW+60)c.x=-60;if(c.x<-60)c.x=CW+60;const x=Math.round(c.x),y=c.t?998:988,d=c.v>0?1:-1;
  mirror(x,d,()=>{const r=R0;E(r,'rgba(0,0,0,.2)',x,y+8,12,2);r('#222',x-9,y+3,5,5);r('#222',x+5,y+3,5,5);r('#999',x-8,y+4,3,3);r('#999',x+6,y+4,3,3);
   r(c.t?'#2f6fb0':'#d23a2c',x-7,y-3,14,6);r('#f4f4f4',x-2,y-12,5,9);r(c.t?'#f4b942':'#2c3036',x-1,y-18,4,6);r('#f1c08a',x,y-16,3,3);r('#ffe66b',x+9,y-1,2,2)})}
};
const mirror=(x,dir,fn)=>{cx.save();cx.translate(x,0);if(dir<0)cx.scale(-1,1);cx.translate(-x,0);fn();cx.restore()};

// ---------- hiệu ứng phía trên (bướm, cánh hoa, chim) ----------
const chirp=(f0)=>{if(!CV.snd||!window.__cvAC)return;try{const ac=window.__cvAC,n=2+Math.floor(Math.random()*3);for(let i=0;i<n;i++){const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+i*.09,f=f0*(1+Math.random()*.25);
 o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.45,t+.06);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.0008,t+.08);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.1)}}catch(e){}};
window.cvChirp=chirp;
function songBird(b,tm){const x=b.x,y=b.y,sing=b.s>0,o=sing?Math.round(Math.sin(tm*18)):0;
 r('rgba(0,0,0,.15)',x-4,y+1,9,1);r(b.c,x-4,y-6+o,8,5);r(b.w,x-2,y-3+o,5,2);r(b.c,x+2,y-9+o,4,4);r('#222',x+4,y-8+o,1,1);r('#f4a030',x+6,y-7+o,2,1+(sing?1:0));r(b.c,x-7,y-5+o,4,2);r('#f4a030',x-1,y-1,1,2);r('#f4a030',x+2,y-1,1,2)}
function cvFx(tm,dt){
 if(CV.hasFx==null)CV.hasFx=1;
 // chim hót trên cây
 for(const b of CV.songs){b.t-=dt;if(b.t<=0){b.s=1.6;b.t=5+Math.random()*7;if(Math.hypot(b.x-Pl.x,b.y-Pl.y)<420)chirp(2400+Math.random()*1400)}
  if(b.s>0){b.s-=dt;if(Math.random()<dt*3&&b.x>camX-10&&b.x<camX+vw+10)NT.push({x:b.x+4,y:b.y-12,t:0,k:ri(0,1),c:pick(['#ffd23f','#ff7aa8','#fff','#9ae0ff']),ph:Math.random()*6})}
  if(b.x>camX-12&&b.x<camX+vw+12&&b.y>camY-12&&b.y<camY+vh+14)songBird(b,tm)}
 // bướm
 for(const b of CV.bfly){b.t-=dt;if(b.t<=0){b.tx=b.x+(Math.random()*120-60);b.ty=b.y+(Math.random()*80-40);if(inLake(b.tx,b.ty)||b.ty<240||b.ty>940)b.ty=b.y;if(inLake(b.tx,b.ty)){b.tx=b.x}b.t=1+Math.random()*1.6}
  const dx=b.tx-b.x,dy=b.ty-b.y,L=Math.hypot(dx,dy)||1;b.x+=dx/L*20*dt;b.y+=dy/L*20*dt;
  if(b.x<camX-8||b.x>camX+vw+8||b.y<camY-20||b.y>camY+vh+8)continue;const f=Math.floor(tm*12+b.ph)%2,X=Math.round(b.x),Y=Math.round(b.y+Math.sin(tm*5+b.ph)*3);
  r(b.c,X-3,Y-(f?3:1),3,f?3:2);r(b.c,X+1,Y-(f?3:1),3,f?3:2);r('#333',X,Y-1,1,3)}
 // cánh hoa rơi
 for(const p of CV.petals){p.y+=p.v*dt;p.x+=Math.sin(tm*1.3+p.ph)*10*dt+4*dt;if(p.y>CH){p.y=-8;p.x=Math.random()*CW}if(p.x>CW)p.x=0;
  if(p.x<camX-4||p.x>camX+vw+4||p.y<camY-4||p.y>camY+vh+4)continue;r(p.c,Math.round(p.x),Math.round(p.y),2,1+(Math.floor(tm*3+p.ph)%2))}
 // chim sẻ nhảy nhót
 for(const b of CV.sparrows){
  if(b.st!='fly'&&Math.hypot(Pl.x-b.x,Pl.y-b.y)<44){const an=Math.atan2(b.y-Pl.y,b.x-Pl.x);let tx=b.x+Math.cos(an)*120,ty=b.y+Math.sin(an)*80;if(cvSolid(tx,ty)||inLake(tx,ty)){tx=b.x-Math.cos(an)*60;ty=b.y}
   b.fx=b.x;b.fy=b.y;b.tx=cl(tx,40,CW-40);b.ty=cl(ty,240,940);b.ft=0;b.dur=.7;b.st='fly';b.dir=b.tx>b.x?1:-1}
  if(b.st=='fly'){b.ft+=dt;const p=Math.min(1,b.ft/b.dur);b.x=b.fx+(b.tx-b.fx)*p;b.y=b.fy+(b.ty-b.fy)*p-Math.sin(Math.PI*p)*26;if(p>=1){b.x=b.tx;b.y=b.ty;b.st='peck';b.t=1}}
  else if(b.st=='air'){b.ft+=dt;const p=Math.min(1,b.ft/b.dur);b.x=b.ax+(b.tx-b.ax)*p;b.y=b.ay+(b.ty-b.ay)*p;if(p>=1){b.x=b.tx;b.y=b.ty;b.st='hop';b.t=.4+Math.random()*1.2}}
  else{b.t-=dt;if(b.t<=0){const q=Math.random();if(q<.5){const nx=b.x+(Math.random()*30-15),ny=b.y+(Math.random()*16-8);if(!cvSolid(nx,ny)&&!inLake(nx,ny)){b.ax=b.x;b.ay=b.y;b.tx=nx;b.ty=ny;b.ft=0;b.dur=.25;b.st='air';b.dir=nx>b.x?1:-1}else b.t=.3}else if(q<.8){b.st='peck';b.t=.7}else{b.st='hop';b.t=.6}}}
  if(b.x>camX-10&&b.x<camX+vw+10&&b.y>camY-10&&b.y<camY+vh+20){if(b.st=='fly')drawSparrowFly(b,tm);else drawSparrow(b,tm)}}
}
CV.fx=cvFx;
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));

// ============================================================
//  VÀO / RA / CẬP NHẬT / NGỒI / NGỰA / NGƯỜI CHƠI KHÁC
// ============================================================
function release(){CV.seat=-1;CV.hz=-1;CVLOCK=0;if(window.PKO)PKO.onStand()}
window.cvSetup=()=>{
 if(!CV.built)build();
 CVON=1;setA(SP,CV.sp);setA(hits,CV.hits);setA(LB,CV.lb);
 Pl.x=CV.pos.x;Pl.y=CV.pos.y;Pl.d=1;CV.seat=-1;CV.hz=-1;
 toast('🌳 Chào mừng tới Công viên! Bấm 💬 để trò chuyện với mọi người');
 if(window.PKO)PKO.onEnter();
};
window.cvLeave=()=>{if(CV.seat>=0||CV.hz>=0)release();CVON=0;CVLOCK=0;if(window.PKO)PKO.onLeave()};
window.cvUpdate=(dt,tm)=>{
 if((CV.seat>=0||CV.hz>=0)&&!Pl.sit)release();
 if(CVLOCK){goal=null;ptr=null}
 for(const o of CV.others.values()){const k=Math.min(1,dt*9),ox=o.x,oy=o.y;o.x+=(o.tx-o.x)*k;o.y+=(o.ty-o.y)*k;
  o.mv=Math.abs(o.x-ox)+Math.abs(o.y-oy)>.04;if(o.mv)o.a+=dt}
 if(window.PKO)PKO.tick(dt,tm);
};
window.cvMeKey=()=>CV.seat>=0&&CV.seats[CV.seat]?CV.seats[CV.seat].by+.5:CV.hz>=0&&CV.horses[CV.hz]?CV.horses[CV.hz].y+.5:Pl.y;
const hbob=i=>Math.sin(performance.now()/1000*5+i);
window.cvLiftMe=()=>CV.hz>=0?22+Math.round(Math.abs(hbob(CV.hz))*3):0;
window.cvRockMe=()=>CV.hz>=0?Math.round(hbob(CV.hz)*3):0;
// khoảng cách từ chân tới dòng tên: tính theo chỗ ngồi (seat) riêng của từng thú cưỡi + hướng nhìn
window.tagOff=(m,d)=>{if(m==null||m<0)return 34;const M=MOUNTS[m];if(!M)return 44;const s=M.seat[d>1?'side':d]||M.seat[0];return 28-s[1]};
window.cvHeadPos=()=>({x:Math.round(Pl.x)+cvRockMe(),y:Math.round(Pl.y)-cvLiftMe()-(Pl.sit?34:tagOff(ST.av.m,Pl.d))});

function trySeat(i){const s=CV.seats[i];if(!s||Pl.sit||CV.seat>=0)return;
 if(CV.hzOcc&&CV.seatOcc&&CV.seatOcc(i))return toast('🪑 Chỗ này có người ngồi rồi!');
 if(window.PKO){const why=PKO.canSit(s);if(why)return toast(why)}
 if(ST.av.m>=0){ST.av.m=-1;toast('🐃 Bạn xuống khỏi thú cưỡi để ngồi')}
 Pl.x=s.x;Pl.y=s.y;Pl.d=0;Pl.sit=2;Pl.st=0;Pl.bn=1;Pl.by=s.sy;Pl.nt=s.kind=='bench'?2:1e9;goal=null;pa=null;Pl.mv=0;
 CV.seat=i;CV.hz=-1;if(window.PKO)PKO.onSeat(i);
 if(s.kind!='game')toast('🪑 Bạn đang ngồi nghỉ... (di chuyển để đứng dậy)')}
function tryHorse(i){const h=CV.horses[i];if(!h||Pl.sit||CV.hz>=0)return;
 if(CV.hzOcc&&CV.hzOcc(i))return toast('🐎 Có bạn đang nhún ngựa này rồi!');
 if(ST.av.m>=0){ST.av.m=-1;toast('🐃 Bạn xuống khỏi thú cưỡi để nhún ngựa')}
 Pl.x=h.x;Pl.y=h.y+.5;Pl.d=0;Pl.sit=2;Pl.st=0;Pl.bn=1;Pl.by=h.y+18;Pl.nt=1e9;goal=null;pa=null;Pl.mv=0;
 CV.hz=i;CV.seat=-1;if(window.PKO)PKO.onHorse(i);toast('🐎 Nhún nào! (di chuyển để xuống ngựa)')}
window.cvAct=(a,h)=>{const[t,v]=a.split(':');
 if(t=='seat')return trySeat(+v);if(t=='horse')return tryHorse(+v);
 if(t=='npc')return toast(['🧋 Cô Ba: "Trà đá 3 nghìn nè con!"','🧋 Cô Ba: "Nước mía mới ép, mát lắm nghen!"','🧋 Cô Ba: "Ngồi ghế nhựa đi con, nghỉ chân chút!"'][Math.floor(Math.random()*3)])};

// ---------- người chơi khác ----------
function drawOther(o,tm){let X,Y,sit=0,lift=0;
 if(o.seat>=0&&CV.seats[o.seat]){const s=CV.seats[o.seat];X=s.x;Y=s.y;sit=2}
 else if(o.hz>=0&&CV.horses[o.hz]){const h=CV.horses[o.hz],b=Math.sin(tm*5+h.i);X=h.x+Math.round(b*3);Y=h.y;sit=2;lift=22+Math.round(Math.abs(b)*3)}
 else{X=o.x;Y=o.y}
 X=Math.round(X);Y=Math.round(Y)-lift;o.hx=X;o.hy=Y-(sit?34:tagOff(o.m,o.d));
 if(X<camX-30||X>camX+vw+30||Y<camY-30||Y>camY+vh+60)return;
 const ob={d:o.d,a:o.a,mv:o.mv,sit,hair:o.hair,set:o.set};
 if(o.m>=0&&!sit)drawRide(cx,X,Y,ob,o.m,tm);else drawAv(cx,X-10,Y-30,ob)}
window.cvPushOthers=(L,tm)=>{for(const o of CV.others.values()){let key=o.y;
 if(o.seat>=0&&CV.seats[o.seat])key=CV.seats[o.seat].by+.5;else if(o.hz>=0&&CV.horses[o.hz])key=CV.horses[o.hz].y+.5;
 L.push([key,()=>drawOther(o,tm)])}};
})();
