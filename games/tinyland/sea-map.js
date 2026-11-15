/* ============================================================
   BIỂN — map online thứ 3 (dùng chung hệ thống mạng với Công viên / Phố xá)
   - Bãi biển nhỏ ở góc TRÁI màn hình lúc mới vào, còn lại là mặt biển rất rộng
   - Tiệm câu Quái vật (biển hiệu to) + NPC bạch tuộc đứng rao "Đồ câu quái vật đây!"
   - Xu quái vật (ST.qv) = đơn vị tiền tệ mới, hiện ở panel avatar góc phải
   - Ra khơi cần THUYỀN (coming soon), hòm kho báu (coming soon)
   - Decor: vỏ sò, sao biển, cua, cọc phao, dừa, dù che nắng, hải âu, thuyền buồm xa xa
   ============================================================ */
(()=>{
'use strict';
const SW=3200,SH=1100,CV=window.CV;
const SEA={sp:[],hits:[],lb:[],seats:[],horses:[],tbls:[],pos:{x:58,y:446},fx:null,built:0,bg:null};
(window.CVMAPS=window.CVMAPS||{}).bn={d:SEA,w:SW,h:SH};
const tmNow=()=>performance.now()/1000;
let sd=4242;const rn=()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pk=a=>a[Math.floor(rn()*a.length)];
const BL=[];const blk=(x0,y0,x1,y1)=>BL.push([x0,y0,x1,y1]);
const put=(im,x,by,box)=>{const o=outl(im);SEA.sp.push({by,d:()=>cx.drawImage(o,Math.round(x-im.width/2)-1,Math.round(by-im.height)-1)});if(box)blk(...box)};
const dyn=(by,fn)=>SEA.sp.push({by,d:fn});
const hit=(x,y,w,h,msg,act,goal)=>SEA.hits.push(act?[x,y,w,h,msg,act,goal]:[x,y,w,h,msg]);
const lbl=(t,x,y)=>SEA.lb.push([t,x,y]);

// ---------- hình dạng bờ biển + vùng đi được ----------
const TOPY=150,BOTY=1004;                    // cát đi được từ y=150 đến y=1004 (trên/dưới là đụn cỏ)
const shoreX=y=>{const t=Math.max(0,Math.min(1,(y-330)/160)),s=t*t*(3-2*t);   // bãi hẹp ~100px ở chỗ nhân vật xuất hiện, nở ra thành vịnh nhỏ ở chỗ tiệm
 return 168-70*s+9*Math.sin(y/70)+4*Math.sin(y/23+1.3)+50*Math.exp(-(((y-800)/85)**2))};
const PIER={y0:548,y1:578,x0:0,x1:0};PIER.x0=Math.round(shoreX(563))-34;PIER.x1=PIER.x0+232;
const inPier=(x,y)=>x>=PIER.x0&&x<=PIER.x1&&y>=PIER.y0&&y<=PIER.y1;
const bnSolid=(x,y)=>{
 if(inPier(x,y))return false;
 if(x<6||y<TOPY||y>BOTY||x>SW-4)return true;
 if(x>shoreX(y)-7)return true;
 for(const b of BL)if(x>=b[0]&&x<b[2]&&y>=b[1]&&y<b[3])return true;
 return false};

// ============================================================
//  SPRITES
// ============================================================
const line=(r,c,x0,y0,x1,y1,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++){const k=n?i/n:0;r(c,Math.round(x0+(x1-x0)*k),Math.round(y0+(y1-y0)*k),t||1,t||1)}};
const WD='#b8864e',WDL='#d6a66a',WDD='#8a5f33',WDK='#5e3f20';

// --- Tiệm câu Quái vật: nhà sàn gỗ, mái hiên sọc xanh, BIỂN HIỆU TO ---
const mkShop=()=>mk(138,114,(g,r)=>{
 const W=138;
 E(r,'rgba(0,0,0,.22)',69,112,62,3);
 for(const x of[12,66,122])r(WDK,x,96,5,16);
 r(WDD,8,52,122,46);for(let x=8;x<130;x+=10){r(x%20?WD:WDL,x,52,9,46);r(WDK,x+9,52,1,46)}
 r('#47301c',16,62,106,26);r('#62432a',16,62,106,3);
 r('#9a6d3a',18,74,102,3);r('#c18f55',18,74,102,1);
 const lure=['#e0584a','#f4d38a','#7ed6c8','#c9a8ff','#ffb08a'];
 for(let i=0;i<11;i++){const x=21+i*9;r(lure[i%5],x,66,5,7);r('#fff',x+1,67,1,2);r(shade(lure[i%5],-.25),x,72,5,1);r('#d8d8e0',x+2,63,1,3)}
 for(let i=0;i<4;i++){const x=28+i*24;r('#cfe6ec',x,78,8,9);r('#e8f4f7',x,78,2,9);r(lure[(i+2)%5],x+2,82,4,5);r('#7a5a33',x+1,76,6,2)}
 r(WDL,3,86,132,5);r('#f0c88a',3,86,132,1);r(WD,5,91,128,12);
 for(let x=5;x<133;x+=14){r(WDD,x,91,1,12);r(WDL,x+1,91,1,12)}r(WDK,5,101,128,3);
 r('#6a7a86',12,79,13,8);r('#8fa1ae',12,79,13,2);r('#5a6a76',12,86,13,1);r('#7cd1a8',15,77,4,3);r('#e0584a',20,78,3,2);
 r('#e8c35a',68,81,8,5);E(r,'#e8c35a',72,81,4,3);r('#8a6a1c',71,85,3,2);
 E(r,'#7a63d6',106,82,8,4);r('#5d49b5',113,79,5,6);r('#fff',100,81,2,2);r('#161022',101,82,1,1);for(let i=0;i<4;i++)r('#fff',97+i*2,84,1,2);
 for(let x=0;x<W;x+=12){const c=(x/12)%2?'#fff4d6':'#1fa6b4';r(c,x,40,12,14);r(shade(c,-.14),x,51,12,3);r(c,x+2,54,8,2);r(c,x+4,56,4,2)}
 r('rgba(255,255,255,.35)',0,40,W,1);
 for(const x of[34,104]){r('#6b5a48',x,56,1,4);r('#e0584a',x-3,60,7,6);r('#ff9a8a',x-2,61,2,3);r('#ffd23f',x-3,60,7,1)}
 r(WDK,22,28,5,14);r(WDK,111,28,5,14);
 r('#2c1c0e',1,0,136,31);r('#ffd23f',3,2,132,27);r('#1a8f9c',5,4,128,23);r('#27b3c0',5,4,128,3);r('#12707b',5,24,128,3);
 for(const x of[7,129]){r('#ffd23f',x-1,7,3,3);r('#ffd23f',x-1,21,3,3)}
 g.textAlign='center';g.lineJoin='round';
 g.font='900 8px Nunito, "Segoe UI", Arial, sans-serif';g.lineWidth=2;g.strokeStyle='#0d4a52';g.strokeText('TIỆM CÂU',69,12,80);g.fillStyle='#fff6d0';g.fillText('TIỆM CÂU',69,12,80);
 g.font='900 13px Nunito, "Segoe UI", Arial, sans-serif';g.lineWidth=3;g.strokeStyle='#3a2412';g.strokeText('QUÁI VẬT',69,26,96);g.fillStyle='#ffd23f';g.fillText('QUÁI VẬT',69,26,96);
 line(r,'#e8f0f4',13,9,13,18,2);line(r,'#e8f0f4',13,18,10,21,2);r('#e8f0f4',8,20,3,2);
 E(r,'#a56bd8',123,15,6,4);r('#7f48b0',128,12,4,6);r('#fff',119,14,2,2);r('#2a1a3a',120,15,1,1);for(let i=0;i<3;i++)r('#fff',117+i*2,17,1,2);
 line(r,'#6b4a2a',128,100,133,48,1);line(r,'#7a5a33',131,102,136,54,1);line(r,'#5e3f20',125,98,130,58,1);
 r('#e0584a',132,47,3,3);line(r,'#e8f0f4',134,50,134,66,1);
 for(let y=56;y<84;y+=4){for(let x=0;x<7;x+=4)r('#b8d4c4',x+(y%8?0:2),y,2,1);r('#b8d4c4',3,y,1,3)}
 r('#6b4a2a',0,54,8,2)});

// --- bạch tuộc rao hàng (vẽ động) ---
const OCT={x:236,y:346};
function drawOcto(tm){
 const X=OCT.x,Y=OCT.y,P='#a66ad8',PL='#c79af0',PD='#7f48b0',PK='#f0a0cc',tk=tm*3.4;
 const bob=Math.round(Math.sin(tm*3.2));
 E(r,'rgba(0,0,0,.2)',X,Y,18,3);
 // 6 xúc tu bên dưới
 for(let i=0;i<6;i++){const bx=X-15+i*6,out=(i-2.5)*.6;for(let s=0;s<9;s++){const w=Math.max(2,5-(s>>1)),x=Math.round(bx+out*s*.9+Math.sin(tk+i*1.2+s*.55)*s*.32),y=Y-16+s*2;r(PD,x,y+1,w,2);r(P,x,y,w,2);if(s==3||s==6)r(PK,x+1,y,1,1)}}
 // xúc tu giơ loa (phải) + xúc tu vẫy câu (trái)
 const wv=Math.sin(tm*5)*2;
 for(let s=0;s<8;s++){const x=Math.round(X+11+s*1.7+Math.sin(tk+s)*.6),y=Math.round(Y-20-s*1.9+bob);r(PD,x,y+1,5-(s>>2),3);r(P,x,y,5-(s>>2),3)}
 for(let s=0;s<8;s++){const x=Math.round(X-14-s*1.8-wv*s/8),y=Math.round(Y-20-s*1.8+bob);r(PD,x,y+1,5-(s>>2),3);r(P,x,y,5-(s>>2),3)}
 // lưỡi câu + mồi ở đầu xúc tu trái
 {const hx=Math.round(X-30-wv),hy=Math.round(Y-35+bob);r('#e8f0f4',hx,hy,1,7);r('#e8f0f4',hx,hy+7,1,2);r('#e8f0f4',hx-2,hy+8,3,1);r('#e0584a',hx-2,hy+5,4,3);r('#fff',hx-1,hy+6,1,1)}
 // đầu
 E(r,PD,X,Y-26+bob,15,14);E(r,P,X,Y-27+bob,15,14);E(r,PL,X-6,Y-34+bob,6,4);r('#8e55c0',X+6,Y-30+bob,2,2);r('#8e55c0',X+9,Y-25+bob,2,2);r('#8e55c0',X-10,Y-24+bob,2,2);
 // mắt
 const dxp=Math.sign(Pl.x-X),blink=(Math.floor(tm*2.2)%11==0);
 for(const ex of[-6,6]){const ax=X+ex;if(blink){r('#3a1f52',ax-3,Y-26+bob,6,1)}else{E(r,'#fff',ax,Y-26+bob,4,5);r('#2a1a3a',ax-1+dxp,Y-27+bob,3,4);r('#fff',ax+dxp,Y-28+bob,1,1)}}
 r('#f4a8c8',X-13,Y-21+bob,3,2);r('#f4a8c8',X+10,Y-21+bob,3,2);
 const say=OCTS.on;
 if(say){r('#4a1f66',X-2,Y-20+bob,4,3);r('#e8607a',X-1,Y-18+bob,2,1)}else{r('#4a1f66',X-2,Y-19+bob,4,1)}
 // mũ câu cá vàng
 E(r,'#e0b83a',X,Y-38+bob,16,3);E(r,'#f4cf4f',X,Y-38+bob,15,2);E(r,'#f4cf4f',X,Y-42+bob,9,5);r('#e0584a',X-9,Y-40+bob,18,2);r('#fff2a8',X-4,Y-45+bob,5,1);
 // loa: hình nón sọc đỏ-trắng, hướng sang phải
 const mx=X+22,my=Math.round(Y-34+bob);
 for(let i=0;i<12;i++){const h=3+Math.round(i*.65);r(i%4<2?'#e0584a':'#fff6e0',mx+i,my-(h>>1),1,h)}r('#5a2a30',mx-2,my-2,2,4);r('#2a1a1a',mx+11,my-4,1,8);
 // sóng âm ))) nhấp nháy
 for(let k=0;k<3;k++){const a=Math.max(0,Math.sin(tm*(say?9:4)-k*1.2));if(a>.1){const px=mx+16+k*5;r('rgba(255,255,255,'+(a*.9).toFixed(2)+')',px,my-3-k,1,6+k*2);r('rgba(255,255,255,'+(a*.5).toFixed(2)+')',px+1,my-2-k,1,4+k*2)}}
 OCT.hx=X;OCT.hy=Y-56+bob}
const OCTS={on:0,i:0,until:0,next:0};
const OCT_LINES=['Đồ câu quái vật đây!','Đồ câu quái vật đây~','Lại xem đồ câu nè!','Ai mua đồ câu quái vật hông?','Đồ câu quái vật đây! Đồ câu đây!'];

// --- decor bãi biển ---
const mkShell=k=>mk(14,12,(g,r)=>{E(r,'rgba(90,60,20,.22)',7,10,5,1);
 if(k==0){ // sò điệp hồng
  E(r,'#f0a7b8',7,6,6,4);r('#f0a7b8',3,8,8,1);for(const x of[3,5,7,9,11])r('#d9768e',x,3+(x>6?(x-7)/2|0:(7-x)/2|0),1,5);r('#fbd0da',5,4,4,1);r('#d9768e',5,9,4,2)}
 else if(k==1){ // ốc xoắn kem
  E(r,'#f6e6c6',6,6,5,4);E(r,'#f2cfa0',7,6,3,2);r('#fff4dc',4,4,2,1);r('#d9a972',9,5,1,1);r('#d9a972',5,7,1,1);r('#e8b88a',9,8,4,2);r('#f6e6c6',10,8,3,1);r('#c98f5e',12,8,1,1)}
 else if(k==2){ // sao biển cam
  const c='#f08a3a',d='#c9622a';r(c,6,2,2,8);r(c,2,5,10,2);line(r,c,3,3,10,9,2);line(r,c,10,3,3,9,2);E(r,c,7,6,3,3);for(const[x,y]of[[7,3],[4,6],[9,6],[6,8],[8,8]])r(d,x,y,1,1);r('#ffd0a0',6,5,1,1)}
 else if(k==3){ // nghêu tím nhạt
  E(r,'#c9b8e8',7,7,6,3);r('#a896d0',2,8,10,1);for(const x of[4,6,8,10])r('#b09ddb',x,5,1,4);r('#e8def8',5,5,3,1)}
 else { // đồng tiền cát (sand dollar)
  E(r,'#f2e2bc',7,6,5,4);E(r,'#e6cf9c',7,6,4,3);for(const[x,y]of[[7,3],[4,5],[10,5],[5,8],[9,8]])r('#c9aa70',x,y,1,2);r('#c9aa70',7,6,1,1)}});
const SHELL=[0,1,2,3,4].map(k=>outl(mkShell(k)));
const mkRock=(w,h,c)=>mk(w,h,(g,r)=>{E(r,'rgba(0,0,0,.2)',w/2,h-2,w/2-1,2);
 E(r,c[1],w/2,h*.55,w/2-1,h*.42);E(r,c[0],w/2,h*.5,w/2-3,h*.38);E(r,c[2],w/2-3,h*.38,w/4,h*.16);
 for(let i=0;i<w/5;i++)r(c[1],2+Math.floor(rn()*(w-4)),Math.floor(h*.3+rn()*h*.4),2,1)});
const mkPalm=(lean)=>mk(76,104,(g,r)=>{E(r,'rgba(0,0,0,.2)',38,100,20,3);
 const bx=36,by=98;let px=bx,py=by;
 for(let i=0;i<46;i++){const t=i/46;const x=Math.round(bx+lean*t*t*22),y=Math.round(by-t*70);r('#8a6a3c',x-3+((i>>1)&1?0:0),y,6,2);r('#a9844c',x-3,y,2,2);r('#6b4e2a',x+2,y,1,2);if(i%5==0)r('#6b4e2a',x-3,y,6,1);px=x;py=y}
 const cxp=px+1,cyp=py;
 const fr=[[-1,-.1,.5],[-.7,-.8,.3],[0,-1,.2],[.7,-.8,.3],[1,-.1,.5],[-.9,.5,.6],[.9,.5,.6],[.2,.7,.4]];
 for(const[dx,dy,dr]of fr){for(let i=0;i<=26;i++){const t=i/26,x=cxp+dx*t*30,y=cyp+dy*t*22+dr*t*t*26,w=Math.max(1,3-Math.floor(t*3));
  r(i%2?'#4f9a55':'#62b567',x,y,w+1,2);if(i%2==0&&i>3){r('#3f8248',x+(dx>0?-1:1),y+2,1,3);r('#7fd183',x,y-1,2,1)}}}
 r('#7a5a2a',cxp-3,cyp+1,3,3);r('#7a5a2a',cxp+1,cyp+2,3,3);r('#a9844c',cxp-3,cyp+1,1,1)});
const mkUmb=(c1,c2)=>mk(52,50,(g,r)=>{E(r,'rgba(0,0,0,.18)',26,47,22,3);
 r('#f4ead0',4,41,32,7);for(let x=4;x<36;x+=6)r(c1,x,41,3,7);r(shade(c1,-.2),4,47,32,1);
 r('#8a6a3c',25,12,3,34);r('#b89058',25,12,1,34);
 for(let y=0;y<14;y++){const w=Math.round(23*Math.sqrt(1-((y-14)/14)**2*.85));for(let x=-w;x<=w;x++){const k=Math.floor((x+23)/8)%2;r(k?c2:c1,26+x,y,1,1)}}
 r(shade(c1,-.25),3,13,46,2);for(let x=3;x<49;x+=6)r(Math.floor(x/6)%2?c1:c2,x,15,6,2);r('rgba(255,255,255,.35)',13,2,9,2);r('#8a6a3c',25,0,3,3)});
const mkChestCl=()=>mk(40,34,(g,r)=>{
 E(r,'#e8cf98',20,30,18,4);E(r,'#d4b676',20,31,14,2); // gò cát
 r('rgba(0,0,0,.22)',4,30,32,3);
 r('#5a3418',4,10,32,20);r('#7a4a26',5,11,30,4);r('#6b4220',4,15,32,14);r('#8a5a30',4,15,32,2);
 r('#5a3418',6,2,28,10);r('#7a4a26',7,3,26,6);r('#8a5a30',9,4,22,2);r('#3a2412',6,11,28,1);
 for(let x=10;x<34;x+=7)r('#4a2c14',x,16,1,13);
 r('#ffd23f',4,10,3,20);r('#ffd23f',33,10,3,20);r('#c89a10',6,10,1,20);r('#c89a10',35,10,1,20);r('#ffd23f',6,2,28,2);r('#ffd23f',6,2,2,10);r('#ffd23f',32,2,2,10);r('#ffd23f',4,10,32,1);
 // khoá vàng
 r('#c89a10',16,14,8,9);r('#ffd23f',16,14,8,2);r('#ffe97a',17,14,2,1);r('#3a2412',19,17,2,3);r('#3a2412',19,20,1,2);
 r('#9a9aa6',17,9,1,5);r('#9a9aa6',22,9,1,5);r('#9a9aa6',17,8,6,1)});
const mkBoat=()=>mk(64,26,(g,r)=>{ // thuyền nhỏ buộc cạnh cầu tàu
 E(r,'rgba(0,30,60,.25)',32,22,28,3);
 for(let i=0;i<9;i++){const ins=Math.round(Math.pow(i/9,2)*8);r(i%2?'#b8764a':'#c98a5a',2+ins,8+i,60-ins*2,1)}
 r('#e8c07a',2,6,60,3);r('#f6dc9c',2,6,60,1);r('#8a5a30',2,9,60,1);
 r('#e0584a',6,12,52,2);r('#fff6e0',6,14,52,1);
 r('#8a6a3c',14,10,3,3);r('#8a6a3c',46,10,3,3);r('#d8c8a0',20,8,24,2)});
const mkSignPost=()=>mk(56,64,(g,r)=>{E(r,'rgba(0,0,0,.2)',28,62,14,2);
 r(WDK,26,18,5,44);r(WD,26,18,2,44);
 r('#2c1c0e',2,2,52,30);r('#f6e7b4',4,4,48,26);r('#d9c28a',4,26,48,4);
 g.textAlign='center';g.font='900 9px Nunito, "Segoe UI", sans-serif';g.fillStyle='#3a6a8a';g.fillText('BẾN THUYỀN',28,15,44);
 g.font='900 8px Nunito, "Segoe UI", sans-serif';g.fillStyle='#d9302a';g.fillText('SẮP MỞ',28,26,40)});
const mkBuoy=()=>mk(14,20,(g,r)=>{E(r,'rgba(0,30,60,.25)',7,17,6,2);r('#e0584a',3,5,8,11);r('#fff6e0',3,9,8,3);r('#c4382e',3,14,8,2);r('#fff',4,6,2,3);r('#6a6a72',6,0,2,5);r('#ffd23f',5,0,4,2)});
const mkSail=()=>mk(34,34,(g,r)=>{r('#8a5a30',3,26,28,4);r('#6b4220',5,30,24,2);r('#5e3f20',16,4,2,24);
 for(let i=0;i<20;i++)r('#fff6e8',17,6+i,Math.max(1,Math.round(i*.7)),1);for(let i=0;i<16;i++)r('#ffe4b0',15-Math.round(i*.5),10+i,Math.round(i*.5)+1,1);r('#e0584a',16,3,6,2)});
const mkTuft=()=>mk(14,12,(g,r)=>{for(const[x,h]of[[2,7],[5,10],[8,8],[11,6]]){line(r,'#6fa84e',x,11,x+(x>6?1:-1),11-h,1);r('#8dc767',x,11-h,1,2)}});
const mkIsle=()=>mk(120,56,(g,r)=>{E(r,'#e8cf98',60,44,56,10);E(r,'#f3deae',60,42,52,8);E(r,'rgba(255,255,255,.7)',60,50,58,4);E(r,'#e8cf98',60,44,56,8)});
const mkWood=()=>mk(34,10,(g,r)=>{E(r,'rgba(90,60,20,.2)',17,9,15,1);r('#a98a62',2,3,28,4);r('#c9aa80',2,3,28,1);r('#7a5f3c',2,6,28,1);r('#8a6f48',30,4,3,3);r('#c9aa80',4,2,2,1);r('#6b4e2a',12,4,3,1)});

// ============================================================
//  NỀN (vẽ 1 lần): cát • biển • cầu tàu • đụn cỏ
// ============================================================
function buildBG(){return mk(SW,SH,(g,r)=>{
 const B=[[0,'#c6f2e8'],[6,'#92e4d8'],[30,'#6fd3d2'],[68,'#4fbad0'],[130,'#3da2ca'],[230,'#2f88be'],[400,'#2573ae'],[660,'#1e609c'],[1000,'#194f88'],[1600,'#144278']];
 for(let y=0;y<SH;y++){const s=Math.round(shoreX(y));
  r('#f3deae',0,y,s,1);r('#e8cf9a',s-18,y,8,1);r('#dcc088',s-10,y,6,1);r('#cfb07a',s-4,y,4,1);
  for(let i=0;i<B.length;i++){const x0=s+B[i][0],x1=i+1<B.length?s+B[i+1][0]:SW;r(B[i][1],x0,y,x1-x0,1)}}
 // hoà trộn các dải nước (dither)
 for(let n=0;n<42000;n++){const y=Math.floor(rn()*SH),s=shoreX(y),d=rn()*1700,j=d+(rn()-.5)*(30+d*.28);let k=0;while(k+1<B.length&&j>=B[k+1][0])k++;r(B[k][1],Math.round(s+d),y,2,1)}
 // sóng nhẹ trên mặt nước
 for(let n=0;n<5200;n++){const y=Math.floor(rn()*SH),x=Math.round(shoreX(y)+40+rn()*(SW-340));r(rn()<.6?'rgba(255,255,255,.10)':'rgba(8,40,96,.12)',x,y,4+Math.floor(rn()*8),1)}
 // cát: hạt + gợn
 for(let n=0;n<7000;n++){const y=Math.floor(rn()*SH),x=Math.floor(rn()*Math.max(1,shoreX(y)-22));r(pk(['#e8cf98','#fbecc4','#dfc185','#f8e6b4','#d9bb7e']),x,y,rn()<.3?2:1,1)}
 for(let n=0;n<260;n++){const y=140+Math.floor(rn()*850),x=Math.floor(rn()*Math.max(1,shoreX(y)-40));const w=8+Math.floor(rn()*14);r('#eed7a2',x,y,w,1);r('#fff2d0',x+1,y-1,w-3,1)}
 // đụn cỏ phía trên và phía dưới
 const gy=x=>128+7*Math.sin(x/37)+3*Math.sin(x/13+1),gy2=x=>1008+7*Math.sin(x/31+2)+3*Math.sin(x/11);
 for(let y=0;y<140;y++){const s=Math.round(shoreX(y))-3;for(let x=0;x<s;x++){const e=gy(x);if(y<e){r(y>e-2?'#6fa84e':rn()<.12?pk(['#a4d97a','#76b055']):'#8dc767',x,y,1,1)}else if(y<e+3&&y>=e)r('#d9c088',x,y,1,1)}}
 for(let y=996;y<SH;y++){const s=Math.round(shoreX(y))-3;for(let x=0;x<s;x++){const e=gy2(x);if(y>e){r(y<e+2?'#6fa84e':rn()<.12?pk(['#a4d97a','#76b055']):'#8dc767',x,y,1,1)}else if(y>e-3&&y<=e)r('#d9c088',x,y,1,1)}}
 // CẦU TÀU gỗ (đi được)
 const{x0,x1,y0,y1}=PIER;
 r('rgba(0,30,70,.22)',x0+6,y1+3,x1-x0,8);                         // bóng xuống nước
 for(let x=x0+14;x<x1-4;x+=26){r(WDK,x,y1,5,10);r('rgba(255,255,255,.35)',x-1,y1+9,7,2)}  // cọc đỡ
 r(WDK,x0,y0-1,x1-x0+3,y1-y0+3);
 for(let x=x0;x<x1;x+=7){const c=(x/7|0)%2?WD:WDL;r(c,x,y0,6,y1-y0);r(WDD,x+6,y0,1,y1-y0)}
 r('#f0c88a',x0,y0,x1-x0,1);r(WDD,x0,y1-2,x1-x0,2);
 for(let x=x0+8;x<x1-6;x+=7)if(((x/7)|0)%3==0){r('#3a2412',x+1,y0+4,1,1);r('#3a2412',x+1,y1-5,1,1)}
 // cọc buộc dây ở đầu cầu
 for(const y of[y0+2,y1-6]){r('#3a2412',x1-6,y,5,5);r('#8a6a3c',x1-5,y+1,3,2)}
 // đá + dây buộc thuyền
 line(r,'#d9c28a',x1-22,y1+1,x1-22,y1+9,1)
})}

// ============================================================
//  DỰNG MAP
// ============================================================
function build(){
 SEA.built=1;SEA.bg=buildBG();
 // --- nước: chạm vào nước (không bấm được thì nhắc cần thuyền) — các lát theo bờ, chừa cầu tàu ---
 const wm='🌊 Biển rộng mênh mông! Cần có THUYỀN mới ra khơi câu quái vật được — sắp mở nhé!';
 for(let y=0;y<SH;y+=60){const y1=y+60,sx=Math.round(shoreX(y+30))+16;
  if(y1>PIER.y0-2&&y<PIER.y1+4){
   if(y<PIER.y0-2)hit(sx,y,SW,PIER.y0-2-y,wm);
   hit(PIER.x1+4,Math.max(y,PIER.y0-2),SW,Math.min(y1,PIER.y1+4)-Math.max(y,PIER.y0-2),wm);
   if(y1>PIER.y1+4)hit(sx,PIER.y1+4,SW,y1-PIER.y1-4,wm)}
  else hit(sx,y,SW,60,wm)}
 // --- TIỆM CÂU QUÁI VẬT ---
 const SX=76,SY=402;
 put(mkShop(),SX,SY,[SX-62,SY-22,SX+62,SY-2]);
 hit(SX-66,SY-98,132,100,'🎣 Tiệm câu Quái vật — bấm để vào xem','cv:bn:shop',[SX,SY+16]);
 // --- bạch tuộc đứng rao ở mép nước cạnh tiệm ---
 OCT.x=Math.round(shoreX(SY+30))+16;OCT.y=SY+30;
 dyn(OCT.y+.5,()=>drawOcto(tmNow()));
 hit(OCT.x-40,OCT.y-52,64,58,'🐙 Bạch tuộc: "Đồ câu quái vật đây! Vào tiệm xem thử nha!"','cv:bn:shop',[SX,SY+16]);
 // --- cầu tàu + thuyền: sắp mở ---
 {const ex=PIER.x1;put(mkSignPost(),ex-14,PIER.y0-4,[ex-30,PIER.y0-8,ex-2,PIER.y0-2]);
  hit(ex-44,PIER.y0-70,56,68,'🚣 Bến thuyền — cần có THUYỀN mới ra khơi câu quái vật. Sắp mở nhé!');
  const bm=mkBoat(),bo=outl(bm);dyn(PIER.y1+22,()=>{const t=tmNow(),bb=Math.round(Math.sin(t*1.6)*1);cx.drawImage(bo,Math.round(ex-84)-1,PIER.y1+4+bb-1)});
  hit(ex-84,PIER.y1+4,64,26,'⛵ Chiếc thuyền gỗ đang buộc ở bến — chưa thể lên được, sắp mở!');
  }
 // --- đụn cỏ trên / dưới + dừa ---
 for(const[x,lean]of[[34,.4],[112,-.5]]){const p=mkPalm(lean);put(p,x,176,[x-6,166,x+6,176])}
 for(const[x,lean]of[[36,-.4],[92,.3]]){put(mkPalm(lean),x,1036,[x-6,1016,x+6,1036])}
 hit(8,84,44,92,'🥥 Cây dừa — nhiều trái lắm nè!');hit(86,84,44,92,'🥥 Cây dừa — gió biển mát rượi');
 const tuft=outl(mkTuft());for(let i=0;i<18;i++){const y=(i%2?138+rn()*10:1002+rn()*14),x=8+rn()*Math.max(10,shoreX(y)-34);SEA.sp.push({by:y,d:()=>cx.drawImage(tuft,Math.round(x),Math.round(y-12))})}
 // --- DÙ CHE NẮNG + khăn trải ---
 put(mkUmb('#e0584a','#fff6e0'),52,668,[34,662,70,668]);hit(24,628,56,42,'⛱️ Dù che nắng — khăn trải cát ấm áp, ngồi hóng gió biển thích lắm');
 put(mkUmb('#1fa6b4','#fff6e0'),50,930,[32,924,68,930]);hit(22,890,56,42,'⛱️ Dù che nắng — ai bỏ quên khăn tắm nè');
 // --- HÒM KHO BÁU (coming soon) ---
 {const cx0=Math.round(shoreX(790))-92,cy0=800;
  put(mkChestCl(),cx0,cy0,[cx0-18,cy0-12,cx0+18,cy0]);
  dyn(cy0+1,()=>{const t=tmNow(),b=Math.round(Math.sin(t*2.2)*2);
   // thẻ "SẮP MỞ" lơ lửng
   cx.font='900 8px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';const w=44;
   cx.fillStyle='rgba(30,20,10,.55)';cx.fillRect(cx0-w/2+1,cy0-46+b+1,w,13);cx.fillStyle='#fff3cf';cx.fillRect(cx0-w/2,cy0-46+b,w,13);cx.fillStyle='#c9302a';cx.fillText('SẮP MỞ',cx0,cy0-36+b);cx.fillStyle='#fff3cf';cx.fillRect(cx0-2,cy0-33+b,4,3);
   for(let k=0;k<4;k++){const a=Math.sin(t*3+k*1.9);if(a>.4){const px=cx0-14+((k*9+Math.round(t*4))%30),py=cy0-30+(k*7%16);r('#ffffff',px,py,1,1);r('rgba(255,236,150,.9)',px-1,py,3,1);r('rgba(255,236,150,.9)',px,py-1,1,3)}}});
  hit(cx0-22,cy0-34,44,40,'🧰 Hòm kho báu — khoá chặt rồi! Sắp mở, chờ chút nhé 🔒')}
 // --- VỎ SÒ, SAO BIỂN, ĐÁ, GỖ TRÔI rải trên bãi ---
 const SH_MSG=['🐚 Vỏ sò hồng xinh xắn — còn ấm nắng','🐚 Ốc xoắn kem — áp tai nghe tiếng biển thử xem','⭐ Sao biển cam nằm phơi nắng','🐚 Con nghêu tím nhạt','🪙 Đồng tiền cát — lấp lánh nè'];
 const spots=[[100,196],[40,226],[120,252],[30,330],[24,452],[84,486],[40,520],[70,590],[22,640],[96,700],[44,742],[110,830],[64,870],[100,960],[30,988],[72,520],[104,640],[56,790],[20,560],[88,420]];
 spots.forEach(([x,y],i)=>{if(bnSolid(x,y)||x>shoreX(y)-20||(x<150&&y>288&&y<440&&x>4))return;const k=(i*3+i%5)%5,o=SHELL[k];SEA.sp.push({by:y,d:()=>cx.drawImage(o,x-8,y-12)});hit(x-8,y-12,16,14,SH_MSG[k])});
 for(const[x,y,w,h]of[[20,220,28,20],[40,610,34,22],[30,860,30,20],[56,960,36,22]]){if(x+w>shoreX(y)-14)continue;put(mkRock(w,h,['#9aa3ab','#6f7880','#c3cad0']),x+w/2,y+h,[x+3,y+h-9,x+w-3,y+h]);hit(x,y,w,h,'🪨 Hòn đá nhẵn thín bị sóng mài')}
 for(const[x,y]of[[70,260],[60,520],[40,780],[70,930]]){if(x+16>shoreX(y)-12)continue;const o=outl(mkWood());SEA.sp.push({by:y,d:()=>cx.drawImage(o,x-17,y-10)});hit(x-17,y-12,34,12,'🪵 Khúc gỗ trôi dạt vào bờ')}
 // --- hai chú cua chạy ngang ---
 for(const c of[{y:610,x0:22,x1:78,ph:0},{y:850,x0:26,x1:92,ph:4}])dyn(c.y+.5,()=>drawCrab(c,tmNow()));
 hit(10,596,76,22,'🦀 Chú cua nhỏ đang đi ngang — tách tách tách');hit(14,836,88,22,'🦀 Cua đồng chạy ngang bờ cát');
 // --- thả phao + đá ngoài biển + thuyền buồm xa xa + đảo nhỏ ---
 for(const[x,y]of[[560,300],[640,640],[900,860],[820,180],[1250,470],[1500,760],[1800,300],[2100,640],[2500,420],[2750,880]]){const bo=outl(mkBuoy()),ph=x*.013;dyn(y,()=>{const t=tmNow();cx.drawImage(bo,x-8,Math.round(y-18+Math.sin(t*1.7+ph)*1.5));
  const a=.18+.12*Math.sin(t*1.7+ph);r('rgba(255,255,255,'+a.toFixed(2)+')',x-8,y+1,16,1)});hit(x-9,y-20,18,22,'🔴 Phao tiêu — đánh dấu luồng biển')}
 for(const[x,y,w,h]of[[700,520,60,36],[1150,250,70,40],[1450,950,64,38],[2000,420,70,40],[2350,820,60,34]]){const o=outl(mkRock(w,h,['#7d8a94','#586470','#a9b6c0']));dyn(y+h,()=>{const t=tmNow(),a=.45+.25*Math.sin(t*1.8+x);
  cx.drawImage(o,x-1,y-1);r('rgba(255,255,255,'+a.toFixed(2)+')',x-3,y+h-4,w+6,1);r('rgba(255,255,255,'+(a*.7).toFixed(2)+')',x-6,y+h-1,w+12,1)});hit(x,y,w,h,'🪨 Ghềnh đá giữa biển — sóng vỗ trắng xoá')}
 for(const[x,y,sp,ph]of[[1300,600,5,0],[2200,300,4,60],[2700,700,3,120]]){const m=mkSail(),o=outl(m);dyn(y+34,()=>{const t=tmNow(),px=x+((t*sp+ph*10)%520)-260;cx.drawImage(o,Math.round(px),Math.round(y+Math.sin(t*1.2+x)*1.2))})}
 for(const[x,y]of[[1900,150],[1000,980]])put(mkIsle(),x+60,y+56);
 for(const[x,y,l]of[[1946,128,.3],[1030,950,-.3]])put(mkPalm(l),x,y+36);
 SEA.fx=seaFx;
 // sóng lấp lánh trên mặt biển
 for(let i=0;i<520;i++)SPK.push({x:shoreX(100)+60+rn()*(SW-420),y:rn()*SH,ph:rn()*6.3});
 for(let i=0;i<14;i++)GULL.push({y:60+rn()*(SH-120),sp:20+rn()*18,ph:rn()*SW,dir:rn()<.5?1:-1,fl:rn()*6});
 // người chơi mới vào: bãi biển nằm ở góc TRÁI màn hình
 SEA.pos.x=58;SEA.pos.y=446}

// ---------- cua đi ngang ----------
const CR=['#e2574c','#c4382e','#f58a7e'];
function drawCrab(c,tm){const L=c.x1-c.x0,sp=14,leg=L/sp,rest=3,cyc=2*(leg+rest),u=(tm+c.ph)%cyc;let x,mv=0;
 if(u<rest)x=c.x0;else if(u<rest+leg){x=c.x0+(u-rest)*sp;mv=1}else if(u<2*rest+leg)x=c.x1;else{x=c.x1-(u-2*rest-leg)*sp;mv=1}
 const X=Math.round(x),Y=c.y,f=mv?Math.floor(tm*9)%2:0;
 E(r,'rgba(90,60,20,.22)',X,Y+1,8,1);
 for(let i=0;i<3;i++){r(CR[1],X-8-i,Y-2+i+(f&&i%2?1:0),2,1);r(CR[1],X+7+i,Y-2+i+(f&&i%2?0:1),2,1)}
 E(r,CR[1],X,Y-3,7,4);E(r,CR[0],X,Y-4,6,3);r(CR[2],X-3,Y-6,3,1);
 const cl=f?1:0;r(CR[0],X-10,Y-8-cl,3,3);r(CR[0],X+8,Y-8-(1-cl),3,3);r(CR[1],X-8,Y-6,2,2);r(CR[1],X+7,Y-6,2,2);
 r('#fff',X-3,Y-9,2,2);r('#fff',X+2,Y-9,2,2);r('#161022',X-3,Y-8,1,1);r('#161022',X+3,Y-8,1,1)}

// ============================================================
//  HIỆU ỨNG TRÊN CÙNG: sóng vỗ bờ, lấp lánh, hải âu, thoại bạch tuộc
// ============================================================
const SPK=[],GULL=[];
function seaFx(tm,dt){
 if(CV.cur!='bn')return;
 // thoại bạch tuộc: nói 3.6s, nghỉ 2.4s, đổi câu
 const now=performance.now();
 if(now>OCTS.next){OCTS.on=1;OCTS.i=(OCTS.i+1)%OCT_LINES.length;OCTS.until=now+3600;OCTS.next=now+6000}
 if(now>OCTS.until)OCTS.on=0;
 if(OCTS.on&&OCT.hx!=null&&Math.abs(OCT.hx-Pl.x)<320&&Math.abs(OCT.hy-Pl.y)<260){
  const t=OCT_LINES[OCTS.i];cx.font='800 8px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';const w=Math.min(160,cx.measureText(t).width)+12,y=OCT.hy-6,x=Math.max(camX+w/2+3,Math.min(camX+vw-w/2-3,OCT.hx+4));
  cx.fillStyle='rgba(30,20,10,.45)';cx.fillRect(x-w/2+1,y-9,w,14);cx.fillStyle='#fffdf0';cx.fillRect(x-w/2,y-10,w,14);cx.fillRect(x-2,y+4,4,2);cx.fillStyle='#4a1f66';cx.fillText(t,x,y,w-6)}
 // hải âu
 for(const g of GULL){const L=SW+200;let x=(g.ph+tm*g.sp*g.dir)%L;if(x<0)x+=L;x-=100;
  if(x<camX-20||x>camX+vw+20||g.y<camY-30||g.y>camY+vh+30)continue;
  const fl=Math.floor(tm*5+g.fl)%2,y=Math.round(g.y+Math.sin(tm*1.4+g.fl)*3),X=Math.round(x);
  r('rgba(0,30,70,.16)',X-3,y+24,8,1);
  for(let i=1;i<=5;i++){const dy=fl?-Math.round(i*.7):Math.round(i*.5);r('#ffffff',X-i,y+dy,1,1);r('#ffffff',X+1+i,y+dy,1,1);r('#cfd8de',X-i,y+dy+1,1,1);r('#cfd8de',X+1+i,y+dy+1,1,1)}
  r('#ffffff',X-1,y,3,1);r('#e6edf0',X-1,y+1,3,1);r('#f2a93b',g.dir>0?X+3:X-3,y,1,1)}}

// ---------- ghi đè: nền + sóng vỗ bờ ----------
const pBG=window.cvDrawBG;
window.cvDrawBG=tm=>{if(MAP!='bn')return pBG(tm);
 cx.drawImage(SEA.bg,0,0);
 const y0=Math.max(0,Math.floor(camY)-2),y1=Math.min(SH,Math.ceil(camY+vh)+3);
 // nước triều dâng lên cát + bọt trắng
 for(let y=y0;y<y1;y++){const s=Math.round(shoreX(y)),a=Math.sin(tm*1.1+y/38)*3+Math.sin(tm*.6+y/15)*1.5;
  if(s-60>camX+vw||(y>=PIER.y0-1&&y<=PIER.y1+1))continue;
  r('rgba(150,232,222,.55)',Math.round(s-5+a),y,Math.round(7-a),1);
  if(y%2==0)r('rgba(255,255,255,.92)',Math.round(s+1+a*1.2),y,3+((y>>1)%3),1);
  if(y%3==0)r('rgba(255,255,255,.4)',Math.round(s+8+a*1.6),y,2+((y>>2)%4),1)}
 // gợn sóng + lấp lánh
 for(const k of SPK){if(k.y<camY-2||k.y>camY+vh+2||k.x<camX-4||k.x>camX+vw+4)continue;
  const a=Math.sin(tm*2.3+k.ph);if(a>.62){r('rgba(255,255,255,'+((a-.5)*1.6).toFixed(2)+')',Math.round(k.x),Math.round(k.y),2,1);if(a>.85)r('rgba(255,255,255,.6)',Math.round(k.x)-1,Math.round(k.y),4,1)}}
};
const pSetup=window.cvSetup,pSolid=window.cvSolid,pAct=window.cvAct;
window.cvSetup=()=>{
 if(MAP!='bn')return pSetup();
 window.cvUseMap('bn');if(!SEA.built)build();
 CVON=1;setA(SP,CV.sp);setA(hits,CV.hits);setA(LB,CV.lb);
 Pl.x=SEA.pos.x;Pl.y=SEA.pos.y;Pl.d=1;CV.seat=-1;CV.hz=-1;CV.boat=0;CV.dock=null;
 toast('🌊 Chào mừng tới Biển! Ghé Tiệm câu Quái vật, nhặt vỏ sò, trò chuyện cùng mọi người nhé');
 if(window.PKO)PKO.onEnter()};
window.cvSolid=(x,y)=>MAP=='bn'?bnSolid(x,y):pSolid(x,y);
window.cvAct=(a,h)=>a.startsWith('bn:')?bnAct(a.slice(3),h):pAct(a,h);

// ============================================================
//  TƯƠNG TÁC
// ============================================================
function bnAct(a){const t=a.split(':')[0];
 if(t=='shop')return bnShop()}
function bnShop(){
 const L=[['🎣','Cần câu quái vật','Chắc tay, bền, hợp với quái vật biển'],['🪝','Lưỡi câu thép','Đủ sắc để móc quái vật'],['🪱','Mồi quái vật','Quái vật nào cũng mê'],['⛵','Thuyền gỗ','Cần có thuyền mới ra khơi được']];
 openUI(head('🎣 Tiệm câu Quái vật')+
  '<div class="mut" style="text-align:center">🐙 <i>"Đồ câu quái vật đây! Hàng sắp về, khách ghé lại sau nha~"</i></div>'+
  '<div class="mut" style="text-align:center">Bạn có <img src="'+QVI+'" style="width:15px;height:15px;vertical-align:-3px;image-rendering:pixelated"> <b>'+fmtXu(ST.qv)+'</b> Xu quái vật</div>'+
  '<div class="g1">'+L.map(x=>'<div class="it z"><span>'+x[0]+' <b>'+x[1]+'</b><br><small>'+x[2]+'</small></span><b>🔒 Sắp mở</b></div>').join('')+'</div>'+
  '<div class="mut">Xu quái vật là đơn vị tiền tệ mới của vùng Biển. Cửa hàng và chuyến ra khơi đang được hoàn thiện — sắp mở!</div>')}
})();
