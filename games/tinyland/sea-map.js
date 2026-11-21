/* ============================================================
   BIỂN — map online thứ 3 (dùng chung hệ thống mạng với Công viên / Phố xá)
   - Bãi biển nhỏ ở góc TRÁI màn hình lúc mới vào, còn lại là mặt biển rất rộng
   - Shop quái vật (biển hiệu to) + NPC bạch tuộc đứng rao "Đồ câu quái vật đây!"
   - Xu quái vật (ST.qv) = đơn vị tiền tệ mới, hiện ở panel avatar góc phải
   - RA KHƠI bằng THUYỀN: Thuyền mini (1.000 xu vàng) / Thuyền thiên nga (3.000 xu quái vật) / Thuyền tre đom đóm (5.000 xu quái vật) — bán ở Shop quái vật
   - CHỈ câu được khi đang đứng trên thuyền ngoài biển (không câu trên cầu tàu / bãi cát)
   - Thỉnh thoảng có VÙNG NƯỚC TỐI: câu ở đó dính quái có 15% nhận thêm 1 vé quay hoặc 1 món ăn từ máy chế biến
   - Rương kho báu: mỗi 1 giờ nhận 10–40 xu quái vật (không cộng dồn)
   - HÒM KHO BÁU TRÔI: trôi lững lờ ngoài biển gần đảo dừa (1150,250), mỗi ngày (giờ máy người chơi) khui 1 lần nhận 2–4 kim cương (ST.tcD = ngày đã khui)
   - Decor: vỏ sò, sao biển, cua, cọc phao, dừa, dù che nắng, hải âu, thuyền buồm xa xa
   ============================================================ */
(()=>{
'use strict';
const SW=3200,SH=1100,CV=window.CV;
const SEA_LIM=1960,BGW=2160;   // GIỚI HẠN BIỂN: mở rộng để vòng quanh Ốc Đảo San Hô lớn
const SEA={sp:[],hits:[],lb:[],seats:[],horses:[],tbls:[],pos:{x:96,y:446},fx:null,built:0,bg:null};
(window.CVMAPS=window.CVMAPS||{}).bn={d:SEA,w:SEA_LIM+60,h:SH};
SEA.fx=seaFx;   // gán NGAY khi đăng ký map (trước đây gán trong build() → lần vào Biển đầu tiên bị mất hải âu / thoại bạch tuộc)
const tmNow=()=>performance.now()/1000;
let sd=4242;const rn=()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pk=a=>a[Math.floor(rn()*a.length)];
const BL=[];const blk=(x0,y0,x1,y1)=>BL.push([x0,y0,x1,y1]);
const put=(im,x,by,box)=>{const o=outl(im);SEA.sp.push({by,d:()=>cx.drawImage(o,Math.round(x-im.width/2)-1,Math.round(by-im.height)-1)});if(box)blk(...box)};
const dyn=(by,fn)=>SEA.sp.push({by,d:fn});
const hit=(x,y,w,h,msg,act,goal)=>SEA.hits.push(act?[x,y,w,h,msg,act,goal]:[x,y,w,h,msg]);
const lbl=(t,x,y)=>SEA.lb.push([t,x,y]);

// ---------- hình dạng bờ biển + Ốc Đảo San Hô lớn + vùng đi được ----------
const TOPY=150,BOTY=1004;                    // cát đi được từ y=150 đến y=1004 (trên/dưới là đụn cỏ)
const BW=70;   // độ nới rộng bãi cát (px). Muốn bãi rộng/hẹp hơn thì sửa số này
const shoreX=y=>{const t=Math.max(0,Math.min(1,(y-330)/160)),s=t*t*(3-2*t);   // bãi ~170px ở chỗ nhân vật xuất hiện, nở ra thành vịnh nhỏ ở chỗ tiệm
 return BW+168-70*s+9*Math.sin(y/70)+4*Math.sin(y/23+1.3)+50*Math.exp(-(((y-800)/85)**2))};
const PIER={y0:548,y1:578,x0:0,x1:0};PIER.x0=Math.round(shoreX(563))-34;PIER.x1=PIER.x0+232;
const OX=1280,OY=560,ORX=310,ORY=225;        // Ốc Đảo San Hô LỚN ngoài khơi (~620×450px)
const LX=1320,LY=498,LRX=64,LRY=38;          // Hồ suối nước ngọt rộng trên Ốc Đảo
const OPIER={x0:856,x1:1004,y0:540,y1:580};  // Cầu tàu Ốc Đảo (vươn sâu qua mép sóng lên bãi cát khô để đi ra/vào mượt mà)
const oasisR=an=>1+0.055*Math.cos(2*an-0.4)+0.04*Math.sin(3*an+0.8)-0.025*Math.cos(5*an);
const oasisDist=(x,y)=>{const dx=(x-OX)/ORX,dy=(y-OY)/ORY;return Math.hypot(dx,dy)/oasisR(Math.atan2(dy,dx))};
const inPier=(x,y)=>x>=PIER.x0&&x<=PIER.x1&&y>=PIER.y0&&y<=PIER.y1;
const inOasisPier=(x,y)=>x>=OPIER.x0&&x<=OPIER.x1&&y>=OPIER.y0&&y<=OPIER.y1;
const inOasisWalk=(x,y)=>oasisDist(x,y)<=0.965;
const bnSolid=(x,y)=>{
 for(const b of BL)if(x>=b[0]&&x<b[2]&&y>=b[1]&&y<b[3])return true;
 if(inPier(x,y)||inOasisPier(x,y)||inOasisWalk(x,y))return false;
 if(x<6||y<TOPY||y>BOTY||x>SW-4)return true;
 if(x>shoreX(y)-7)return true;
 return false};

// ============================================================
//  SPRITES
// ============================================================
const line=(r,c,x0,y0,x1,y1,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++){const k=n?i/n:0;r(c,Math.round(x0+(x1-x0)*k),Math.round(y0+(y1-y0)*k),t||1,t||1)}};
const WD='#b8864e',WDL='#d6a66a',WDD='#8a5f33',WDK='#5e3f20';

// --- Shop quái vật: nhà sàn gỗ to, mái hiên sọc xanh, bảng neon chạy chữ kiểu Hồng Kông (phần neon vẽ động ở drawShopNeon) ---
const SHW=172,SHH=134;
const mkShop=()=>mk(SHW,SHH,(g,r)=>{
 const W=SHW;
 E(r,'rgba(0,0,0,.22)',86,131,82,3);
 for(const x of[8,44,82,120,156]){r(WDK,x,112,6,20);r(WDD,x,112,2,20)}                 // cọc nhà sàn
 r(WDD,6,66,160,48);for(let x=6;x<166;x+=10){r(x%20?WD:WDL,x,66,9,48);r(WDK,x+9,66,1,48)}  // vách gỗ
 r('#47301c',14,74,144,28);r('#62432a',14,74,144,3);                                   // ô quầy mở
 // kệ trong tiệm: mồi câu, chai, cần câu
 r('#9a6d3a',16,86,140,3);r('#c18f55',16,86,140,1);
 const lure=['#e0584a','#f4d38a','#7ed6c8','#c9a8ff','#ffb08a','#ff8ac0'];
 for(let i=0;i<14;i++){const x=18+i*10;r(lure[i%6],x,78,5,7);r('#fff',x+1,79,1,2);r(shade(lure[i%6],-.25),x,84,5,1);r('#d8d8e0',x+2,75,1,3)}
 for(let i=0;i<5;i++){const x=30+i*26;r('#cfe6ec',x,92,8,9);r('#e8f4f7',x,92,2,9);r(lure[(i+2)%6],x+2,96,4,5);r('#7a5a33',x+1,90,6,2)}
 // quầy
 r(WDL,2,100,168,6);r('#f0c88a',2,100,168,1);r(WD,4,106,164,12);
 for(let x=4;x<168;x+=14){r(WDD,x,106,1,12);r(WDL,x+1,106,1,12)}r(WDK,4,116,164,3);
 // hàng bày trên quầy: thuyền mini + thuyền thiên nga mẫu, máy tính tiền, bạch tuộc bông, thùng cá
 r('#c98a5a',16,93,22,5);r('#f6dc9c',16,93,22,1);r('#e0584a',16,95,22,1);r('#8a5a30',16,98,22,1);r('#fff6d0',26,86,1,7);r('#e0584a',27,86,6,4);
 E(r,'#ffffff',58,95,9,4);r('#ffffff',64,86,3,9);r('#ff9a2a',67,87,3,1);r('#6fb8ff',50,97,18,2);r('#ffd6e8',52,92,10,2);
 r('#6a7a86',90,92,14,8);r('#8fa1ae',90,92,14,2);r('#5a6a76',90,99,14,1);r('#7cd1a8',93,90,4,3);r('#e0584a',100,91,3,2);
 E(r,'#a56bd8',122,92,9,6);r('#7f48b0',130,88,5,8);r('#fff',116,90,2,2);r('#2a1a3a',117,91,1,1);for(let i=0;i<4;i++)r('#fff',113+i*3,96,1,3);
 r('#8a6a3c',140,88,22,12);r('#a98450',140,88,22,2);r('#5e3f20',140,99,22,1);r('#7ed6c8',144,86,5,4);r('#ffb08a',151,85,6,5);r('#fff',145,87,1,1);
 // mái hiên sọc xanh – trắng
 for(let x=0;x<W;x+=12){const c=(x/12)%2?'#fff4d6':'#1fa6b4';r(c,x,52,12,14);r(shade(c,-.14),x,63,12,3);r(c,x+2,66,8,2);r(c,x+4,68,4,2)}
 r('rgba(255,255,255,.35)',0,52,W,1);
 for(let x=6;x<W;x+=14){const c=['#ff5a8a','#ffd23f','#5ee0ff','#9cff7a'][(x/14|0)%4];r('#2c1c0e',x,69,1,2);r(c,x-1,71,3,3);r('#fff',x,71,1,1)}   // dây đèn nhỏ
 r(WDK,4,50,5,20);r(WDK,163,50,5,20);
 // bảng neon (khung) + dải chạy chữ (khung); nội dung phát sáng vẽ động
 r('#2c1c0e',4,0,164,38);r('#ffd23f',6,2,160,34);r('#161022',8,4,156,30);r('#241640',8,4,156,2);
 r('#2c1c0e',8,39,156,12);r('#0a0612',10,41,152,8);r('#6b5a48',10,50,152,1);
 r(WDK,22,34,5,6);r(WDK,145,34,5,6);
 // phao cứu sinh + lưới + cần câu bên hông
 E(r,'#ffffff',160,86,7,7);E(r,'#e0584a',160,86,6,6);E(r,'#ffffff',160,86,3,3);E(r,'#47301c',160,86,2,2);r('#fff',158,81,4,2);r('#fff',158,91,4,2);
 line(r,'#6b4a2a',166,112,170,60,1);r('#e0584a',169,59,3,3);line(r,'#e8f0f4',171,62,171,82,1);
});

// --- dù nghỉ mát + bàn ghế bên cạnh shop ---
const mkBeachSet=()=>mk(92,76,(g,r)=>{
 E(r,'rgba(0,0,0,.18)',46,72,40,3);
 // ghế dài
 r('#fff4d6',6,60,26,6);for(let x=6;x<32;x+=6)r('#e0584a',x,60,3,6);r('#c98a5a',6,66,26,2);r('#8a5a30',8,68,2,4);r('#8a5a30',28,68,2,4);
 r('#fff4d6',4,54,8,8);for(let y=54;y<62;y+=4)r('#e0584a',4,y,8,2);
 // bàn tròn + ly nước + bóng
 E(r,'#8a5a30',62,64,13,4);E(r,'#c98a5a',62,63,13,3);r('#6b4a2a',61,64,3,8);r('#cfe6ec',56,56,4,7);r('#ff8ac0',56,56,4,3);r('#6fe0a0',66,57,4,6);r('#fff',68,53,1,5);r('#ffd23f',67,52,3,1);
 E(r,'#ffffff',80,68,5,5);r('#e0584a',77,66,6,2);r('#4aa0e8',77,70,6,2);
 // cột dù + tán dù to
 r('#8a6a3c',44,16,4,52);r('#b89058',44,16,1,52);r('#6b4a2a',40,66,12,3);
 for(let y=0;y<18;y++){const w=Math.round(44*Math.sqrt(1-((y-18)/18)**2*.9));for(let x=-w;x<=w;x++){const k=Math.floor((x+44)/11)%2;r(k?'#fff6e0':'#ff6a5a',46+x,y,1,1)}}
 r('#c0453a',2,17,88,2);for(let x=2;x<90;x+=11)r(Math.floor(x/11)%2?'#fff6e0':'#ff6a5a',x,19,11,2);
 r('rgba(255,255,255,.4)',18,3,12,2);r('#8a6a3c',44,0,4,3)});

// --- đảo nhỏ có cây dừa (chỉ là hình tĩnh, không bấm được, chỉ làm vật cản) ---
const mkIslet=()=>mk(92,56,(g,r)=>{
 E(r,'rgba(150,236,226,.45)',46,36,45,17);E(r,'rgba(190,248,240,.5)',46,36,40,14);
 E(r,'#cdb27a',46,35,35,13);E(r,'#e8cf98',46,34,34,12);E(r,'#f3deae',46,32,30,9);
 E(r,'rgba(255,255,255,.6)',46,46,40,2);
 E(r,'#6fb865',40,29,11,4);E(r,'#58a04f',40,30,10,3);E(r,'#82cc76',38,28,5,2);
 for(const[x,y]of[[30,36],[58,34],[50,40],[36,38],[62,38]])r('#d6b57a',x,y,2,1);
 r('#f4a8c0',54,32,3,2);r('#fff',54,32,1,1);r('#e2574c',26,34,2,1);
 r('#8a8f96',60,30,5,3);r('#aab0b6',60,30,3,1)});

// --- thuyền mini + thuyền thiên nga (ảnh to cho panel Shop quái vật) ---
const mkSwanIcon=()=>mk(64,42,(g,r)=>{
 E(r,'rgba(0,70,110,.28)',32,38,27,3);
 // đuôi + cánh
 r('#ffffff',5,22,6,3);r('#ffffff',3,19,5,4);r('#dfe9f5',3,22,5,1);r('#ffffff',9,24,8,3);
 // thân thuyền
 E(r,'#cfe0f0',32,31,26,8);E(r,'#ffffff',32,30,25,7);E(r,'#f4f8ff',30,28,20,4);
 r('#5aa8e8',9,32,46,2);r('#ff8ab0',9,34,46,1);
 E(r,'#eaf1fb',27,25,14,6);r('#cfdceb',16,25,22,1);r('#cfdceb',18,27,18,1);
 r('#ff8ab0',27,23,12,3);r('#ffb0cb',27,23,12,1);                                  // đệm ngồi
 // cổ + đầu thiên nga (hướng phải)
 for(const[x,y,w]of[[44,26,5],[46,22,5],[48,18,5],[49,14,5],[49,10,5],[50,7,5]]){r('#cfdceb',x+1,y,w,4);r('#ffffff',x,y,w,4)}
 r('#ffffff',49,3,8,6);r('#ffffff',52,2,5,2);r('#ff9a2a',57,5,6,3);r('#ffcf5a',57,5,6,1);r('#222',54,5,2,2);r('#ff8ab0',49,1,3,3);r('#fff',50,1,1,1);
 r('#ffd23f',44,30,3,2)});
// --- bảng neon Hồng Kông + chữ chạy (vẽ động mỗi khung hình, X0/Y0 = góc trên-trái ảnh tiệm) ---
const NEONF='"Nunito", "Segoe UI", Arial, sans-serif';
function neonTxt(txt,x,y,size,col,glow,al){
 cx.font='900 '+size+'px '+NEONF;cx.lineJoin='round';cx.globalAlpha=al;
 cx.shadowColor=glow;cx.shadowBlur=11;cx.lineWidth=3;cx.strokeStyle=col;cx.strokeText(txt,x,y);
 cx.shadowBlur=0;cx.lineWidth=1;cx.fillStyle='#fffafc';cx.fillText(txt,x,y);cx.globalAlpha=1}
function drawShopNeon(X0,Y0,tm){
 if(X0>camX+vw||X0+SHW<camX||Y0>camY+vh||Y0+54<camY)return;
 cx.save();cx.textAlign='center';cx.textBaseline='alphabetic';
 // viền neon xanh lơ + bóng đèn chạy quanh bảng
 cx.shadowColor='#2ff3ff';cx.shadowBlur=8;cx.strokeStyle='#5ff7ff';cx.lineWidth=1.5;cx.strokeRect(X0+11.5,Y0+7.5,150,23);cx.shadowBlur=0;
 const per=[];for(let x=0;x<156;x+=8){per.push([X0+8+x,Y0+4]);per.push([X0+8+x,Y0+31])}for(let y=8;y<30;y+=8){per.push([X0+8,Y0+y]);per.push([X0+162,Y0+y])}
 const ph=Math.floor(tm*9);
 per.forEach((p,i)=>{const on=((i>>1)+ph)%4==0;cx.fillStyle=on?'#fff3a0':'#6a4a18';if(on){cx.shadowColor='#ffd23f';cx.shadowBlur=6}cx.fillRect(p[0],p[1],2,2);cx.shadowBlur=0});
 // chữ: SHOP (xanh lơ) + QUÁI VẬT (hồng) — thỉnh thoảng chớp như neon cũ
 const fl1=Math.sin(tm*21)>.965?.3:1,fl2=Math.sin(tm*13+2)>.985?.35:1;
 neonTxt('SHOP',X0+52,Y0+26,14,'#27e8ff','#00cfff',fl1);
 neonTxt('QUÁI VẬT',X0+112,Y0+26,14,'#ff3d9a','#ff1f86',fl2);
 // icon neon: cá (trái) + thuyền (phải)
 cx.lineWidth=1.5;cx.shadowBlur=7;cx.strokeStyle='#ffe94d';cx.shadowColor='#ffb800';
 cx.beginPath();cx.ellipse(X0+23,Y0+19,7,4,0,0,6.283);cx.moveTo(X0+30,Y0+19);cx.lineTo(X0+35,Y0+15);cx.lineTo(X0+35,Y0+23);cx.closePath();cx.stroke();
 cx.fillStyle='#ffe94d';cx.fillRect(X0+19,Y0+17,2,2);
 const bb=Math.round(Math.sin(tm*2.4)*1);
 cx.strokeStyle='#8affc0';cx.shadowColor='#2bff9a';cx.beginPath();cx.moveTo(X0+143,Y0+22+bb);cx.lineTo(X0+158,Y0+22+bb);cx.lineTo(X0+155,Y0+27+bb);cx.lineTo(X0+146,Y0+27+bb);cx.closePath();
 cx.moveTo(X0+150,Y0+21+bb);cx.lineTo(X0+150,Y0+11+bb);cx.lineTo(X0+157,Y0+20+bb);cx.stroke();
 cx.shadowBlur=0;cx.restore();
 // dải đèn LED chạy chữ
 cx.save();cx.beginPath();cx.rect(X0+10,Y0+41,152,8);cx.clip();
 const msg='★ BÁN THUYỀN & THU MUA QUÁI VẬT ★     ';cx.font='800 8px '+NEONF;cx.textAlign='left';cx.textBaseline='alphabetic';
 const w=cx.measureText(msg).width||200,off=(tm*28)%w;
 cx.shadowColor='#ff9a2e';cx.shadowBlur=4;cx.fillStyle='#ffe94d';
 for(let k=-1;k<Math.ceil(152/w)+1;k++)cx.fillText(msg,X0+10-off+k*w,Y0+48);
 cx.shadowBlur=0;cx.restore()}

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
 g.font='900 8px Nunito, "Segoe UI", sans-serif';g.fillStyle='#1a8f9c';g.fillText('RA BIỂN ⛵',28,26,44)});
const mkBuoy=()=>mk(16,24,(g,r)=>{E(r,'rgba(0,30,60,.26)',8,21,7,2);r('#8d5228',3,16,10,4);r('#c8854c',4,16,8,2);r('#fff6e0',4,19,8,1);r('#474b54',5,5,1,11);r('#474b54',10,5,1,11);r('#ffe066',6,6,4,9);r('#fffbe0',7,7,2,6);r('#d94b3b',3,4,10,2);r('#ff7866',4,3,8,1);r('#ffd23f',7,1,2,2)});
const mkSail=()=>mk(34,34,(g,r)=>{r('#8a5a30',3,26,28,4);r('#6b4220',5,30,24,2);r('#5e3f20',16,4,2,24);
 for(let i=0;i<20;i++)r('#fff6e8',17,6+i,Math.max(1,Math.round(i*.7)),1);for(let i=0;i<16;i++)r('#ffe4b0',15-Math.round(i*.5),10+i,Math.round(i*.5)+1,1);r('#e0584a',16,3,6,2)});
const mkTuft=()=>mk(14,12,(g,r)=>{for(const[x,h]of[[2,7],[5,10],[8,8],[11,6]]){line(r,'#6fa84e',x,11,x+(x>6?1:-1),11-h,1);r('#8dc767',x,11-h,1,2)}});
const mkIsle=()=>mk(120,56,(g,r)=>{E(r,'#e8cf98',60,44,56,10);E(r,'#f3deae',60,42,52,8);E(r,'rgba(255,255,255,.7)',60,50,58,4);E(r,'#e8cf98',60,44,56,8)});
const mkWood=()=>mk(34,10,(g,r)=>{E(r,'rgba(90,60,20,.2)',17,9,15,1);r('#a98a62',2,3,28,4);r('#c9aa80',2,3,28,1);r('#7a5f3c',2,6,28,1);r('#8a6f48',30,4,3,3);r('#c9aa80',4,2,2,1);r('#6b4e2a',12,4,3,1)});

// --- Chòi Bar Tiki Ốc Đảo Lớn + Vọng Lâu Hoàng Hôn + Thác Đá Đôi + Tượng Tiki + Khóm Hoa Nhiệt Đới ---
const mkTikiHut=()=>mk(114,90,(g,r)=>{
 E(r,'rgba(0,0,0,.22)',57,86,52,4);
 // Sàn gỗ rộng + bậc thềm
 r('#6e4824',8,74,98,11);r('#b8844c',10,72,94,9);r('#d9a66c',10,72,94,2);
 for(let x=14;x<102;x+=8)r('#8c5d32',x,72,1,9);
 r('#c99258',32,81,50,5);r('#e6ba7e',32,81,50,1);
 // Cột tre đôi chắc chắn
 for(const x of[13,38,72,97]){r('#6b4a18',x,36,4,39);r('#a87e30',x,36,2,39);r('#d2a84a',x,36,1,39)}
 // Quầy bar nhiệt đới rộng + bảng gỗ menu
 r('#523418',17,44,80,22);r('#8f5f32',15,58,84,14);r('#c99258',13,55,88,4);r('#f0c88a',13,55,88,1);
 for(let x=18;x<96;x+=9){r('#6e4824',x,59,7,11);r('#a8743c',x+1,60,5,9)}
 r('#2c1c0e',44,44,26,10);r('#ffe27a',46,46,22,1);r('#8ef0dc',48,49,14,1);r('#ff9ab8',48,51,18,1);
 // Dừa tươi, ly nước dứa, sinh tố cầu vồng trên quầy
 for(const cx0 of[22,31,82,91]){E(r,'#4a7a2c',cx0,52,4,4);E(r,'#66a63c',cx0,51,3,3);r('#ff5a7a',cx0,46,1,4);r('#fff',cx0+1,46,2,1)}
 for(const cx0 of[42,56,70]){r('#98ecff',cx0,49,5,6);r('#ff7ea8',cx0,49,5,2);r('#ffd23f',cx0+2,45,1,4)}
 // Đèn lồng treo 2 bên hiên
 for(const lx of[22,92]){r('#3d2410',lx,35,1,4);r('#ff9f2e',lx-2,39,5,7);r('#ffe97a',lx-1,40,3,5);r('#fff',lx,41,1,2)}
 // Vòng hoa lei & lá dừa trang trí dưới hiên
 for(let x=9;x<105;x+=4){const c=['#ff6a88','#ffd23f','#78f0c8','#ff9a4a','#ffffff'][(x>>2)%5];r(c,x,34+(x%8===0?1:0),3,3);r('#2d8242',x+1,36,2,2)}
 // Mái lá cọ hai tầng ấm áp
 for(let i=0;i<30;i++){
  const w=Math.round(12+i*1.65),x0=Math.max(1,57-w),x1=Math.min(113,57+w);
  const c=i%5===4?'#9c7022':i%2?'#c49434':'#dcb04a';
  r(c,x0,6+i,x1-x0,1);
  r('#f2cb66',x0+3,6+i,Math.min(16,Math.max(2,(x1-x0)>>2)),1);
  if(i%4===0)for(let x=x0;x<x1;x+=7)r('#825c18',x,6+i,1,2);
 }
 r('#9c7022',51,2,12,5);r('#f2cb66',53,0,8,3);r('#ff5a7a',54,2,6,2);r('#ffd23f',56,2,2,1);
});

const mkGazebo=()=>mk(96,86,(g,r)=>{
 E(r,'rgba(0,0,0,.22)',48,82,42,4);
 // Sàn gỗ + lan can xung quanh vọng lâu
 r('#6e4824',8,70,80,10);r('#c99258',10,66,76,10);r('#e6ba7e',10,66,76,2);
 for(let x=14;x<84;x+=7)r('#8c5d32',x,66,1,10);
 r('#c99258',32,76,32,4);r('#f0c88a',32,76,32,1);
 // Băng ghế đệm êm hướng ra biển
 r('#5e3f20',22,57,52,11);r('#ff8ab0',24,55,48,5);r('#ffb8d2',24,55,48,2);
 r('#fff6e0',28,53,8,4);r('#7ce6d8',60,53,8,4);
 // Cột tre 4 góc + vòng hoa
 for(const x of[12,30,64,82]){r('#6b4a18',x,32,4,36);r('#a87e30',x,32,2,36);r('#d2a84a',x,32,1,36)}
 r('#b8844c',10,60,18,2);r('#b8844c',68,60,18,2);
 for(const lx of[48]){r('#3d2410',lx,32,1,4);r('#ffe066',lx-2,36,5,6);r('#fff8c8',lx-1,37,3,4)}
 for(let x=8;x<88;x+=5){const c=['#ff6a88','#78f0c8','#ffd23f','#ffffff'][(x/5|0)%4];r(c,x,31+(x%2),3,2)}
 // Mái lá cọ hình chóp lục giác
 for(let i=0;i<28;i++){
  const w=Math.round(9+i*1.48),x0=Math.max(2,48-w),x1=Math.min(94,48+w);
  r(i%4===3?'#9c7022':i%2?'#c49434':'#e0b44c',x0,5+i,x1-x0,1);
  r('#f4cf6a',x0+2,5+i,Math.min(12,Math.max(2,(x1-x0)>>2)),1);
 }
 r('#8a5a2a',44,1,8,5);r('#ffd23f',46,0,4,2);
});

const mkWaterfallRock=()=>mk(96,54,(g,r)=>{
 E(r,'rgba(16,80,100,.24)',48,50,44,4);
 // Khối vách đá vôi đôi nhiều tầng tự nhiên
 E(r,'#66707a',48,34,40,17);E(r,'#848f9a',46,27,34,15);E(r,'#a3aeb8',39,19,21,9);
 E(r,'#5b656e',20,38,16,11);E(r,'#848f9a',74,36,16,12);
 // Thảm rêu xanh rì & hoa nhiệt đới mọc trên đỉnh đá
 E(r,'#3e8a40',44,13,26,6);E(r,'#5fb858',46,11,18,4);E(r,'#7ed675',38,10,9,3);
 for(const[fx,fy,fc]of[[24,20,'#ff6088'],[31,14,'#ffd23f'],[49,13,'#ff7aa8'],[64,18,'#ff6088'],[72,26,'#ff9a52']]){r(fc,fx,fy,3,3);r('#fff6b0',fx+1,fy+1,1,1)}
 // Hai dòng thác ngọc lam đổ xuống hồ suối
 for(const[wx0,ww0]of[[36,10],[58,8]]){
  for(let y=19;y<50;y++){
   const w=ww0+Math.round((y-19)*.26);
   r('#4fd8e4',wx0-(w>>1),y,w,1);
   r('#95f5fb',wx0-(w>>1)+2,y,Math.max(2,w-4),1);
  }
 }
});

const mkTikiTotem=()=>mk(34,58,(g,r)=>{
 E(r,'rgba(0,0,0,.22)',17,55,13,3);
 r('#5e3f20',9,14,16,41);r('#8a5f33',10,14,14,41);r('#a97644',11,15,4,39);r('#472c14',21,15,3,39);
 r('#6b4220',8,12,18,4);r('#6b4220',8,28,18,3);r('#6b4220',7,51,20,4);
 // Mặt nạ Tiki + mắt phát sáng ngọc + miệng cười răng nanh
 r('#2c1c0e',12,19,4,3);r('#5ef5d0',13,20,2,1);
 r('#2c1c0e',18,19,4,3);r('#5ef5d0',19,20,2,1);
 r('#2c1c0e',12,24,10,3);r('#fff6e0',13,25,2,1);r('#fff6e0',19,25,2,1);
 // Vòng hoa trên đỉnh đầu & mặt dưới
 for(let x=9;x<25;x+=3){r(x%2?'#ff6088':'#ffd23f',x,9,3,3);r('#3e8a40',x+1,11,2,2)}
 r('#2c1c0e',13,34,3,3);r('#ffd23f',14,35,1,1);r('#2c1c0e',18,34,3,3);r('#ffd23f',19,35,1,1);
 r('#2c1c0e',12,41,10,4);r('#fff6e0',14,42,2,2);r('#fff6e0',18,42,2,2);
});

const mkTropBush=c=>mk(28,22,(g,r)=>{
 E(r,'rgba(0,0,0,.18)',14,19,12,3);
 E(r,'#2e7a36',14,13,12,7);E(r,'#4ca84e',14,11,10,6);E(r,'#6fd068',11,9,7,4);
 for(const[fx,fy]of[[8,10],[15,7],[20,12],[12,14]]){r(c,fx,fy,3,3);r('#fff6b0',fx+1,fy+1,1,1)}
});

const mkLounger=(c1,c2)=>mk(54,50,(g,r)=>{
 E(r,'rgba(0,0,0,.18)',27,47,23,3);
 r('#c98a5a',6,36,36,8);r('#8a5a30',6,43,36,2);
 r(c2,7,35,34,6);for(let x=9;x<39;x+=6)r(c1,x,35,3,6);
 r(c1,4,29,9,9);r(c2,5,30,7,2);
 r('#8a5a30',9,45,3,4);r('#8a5a30',36,45,3,4);
 r('#8a6a3c',28,14,3,33);r('#b89058',28,14,1,33);
 for(let y=0;y<14;y++){const w=Math.round(23*Math.sqrt(1-((y-14)/14)**2*.85));for(let x=-w;x<=w;x++){const k=Math.floor((x+23)/7)%2;r(k?c2:c1,29+x,y,1,1)}}
 r(shade(c1,-.24),5,13,48,2);for(let x=5;x<53;x+=7)r(Math.floor(x/7)%2?c1:c2,x,15,7,2);
 r('rgba(255,255,255,.35)',16,2,9,2);r('#8a6a3c',28,0,3,3);
});

const mkTikiPole=()=>mk(16,38,(g,r)=>{
 E(r,'rgba(0,0,0,.2)',8,36,6,2);
 r('#6b421c',6,14,4,22);r('#a87236',6,14,2,22);r('#4a2c10',9,14,1,22);
 r('#4a2c10',5,22,6,2);r('#4a2c10',5,29,6,2);
 r('#8c5a28',4,10,8,5);r('#c98e46',5,10,6,2);r('#4a2c10',4,14,8,1);
});

const mkPierLamp=()=>mk(14,34,(g,r)=>{
 E(r,'rgba(0,0,0,.2)',7,32,5,2);
 r('#4a2c14',5,11,4,21);r('#8a5a30',6,11,2,21);
 r('#3d2410',3,8,8,3);r('#ffd23f',4,4,6,5);r('#fff6b0',5,5,4,3);r('#3d2410',3,3,8,2);
});

const mkOasisSign=()=>mk(56,64,(g,r)=>{E(r,'rgba(0,0,0,.2)',28,62,14,2);
 r(WDK,26,18,5,44);r(WD,26,18,2,44);
 r('#2c1c0e',2,2,52,30);r('#f6e7b4',4,4,48,26);r('#d9c28a',4,26,48,4);
 g.textAlign='center';g.font='900 8.5px Nunito, "Segoe UI", sans-serif';g.fillStyle='#136f7d';g.fillText('BẾN ỐC ĐẢO',28,15,44);
 g.font='900 8px Nunito, "Segoe UI", sans-serif';g.fillStyle='#e0584a';g.fillText('RA BIỂN ⛵',28,26,44)});

// ============================================================
//  NỀN (vẽ 1 lần): cát • biển • cầu tàu • Ốc Đảo San Hô LỚN • đụn cỏ
// ============================================================
function buildBG(){return mk(BGW,SH,(g,r)=>{
 const B=[[0,'#c6f2e8'],[6,'#92e4d8'],[30,'#6fd3d2'],[68,'#4fbad0'],[130,'#3da2ca'],[230,'#2f88be'],[400,'#2573ae'],[660,'#1e609c'],[1000,'#194f88'],[1600,'#144278']];
 for(let y=0;y<SH;y++){const s=Math.round(shoreX(y));
  r('#f3deae',0,y,s,1);r('#e8cf9a',s-18,y,8,1);r('#dcc088',s-10,y,6,1);r('#cfb07a',s-4,y,4,1);
  for(let i=0;i<B.length;i++){const x0=s+B[i][0],x1=i+1<B.length?s+B[i+1][0]:BGW;r(B[i][1],x0,y,x1-x0,1)}}
 // hoà trộn các dải nước (dither)
 for(let n=0;n<56000;n++){const y=Math.floor(rn()*SH),s=shoreX(y),d=rn()*2200,j=d+(rn()-.5)*(30+d*.28);let k=0;while(k+1<B.length&&j>=B[k+1][0])k++;r(B[k][1],Math.round(s+d),y,2,1)}
 // sóng nhẹ trên mặt nước
 for(let n=0;n<3400;n++){const y=Math.floor(rn()*SH),x=Math.round(shoreX(y)+40+rn()*(BGW-340));r(rn()<.6?'rgba(255,255,255,.10)':'rgba(8,40,96,.12)',x,y,4+Math.floor(rn()*8),1)}
 // cát: hạt + gợn
 for(let n=0;n<7000;n++){const y=Math.floor(rn()*SH),x=Math.floor(rn()*Math.max(1,shoreX(y)-22));r(pk(['#e8cf98','#fbecc4','#dfc185','#f8e6b4','#d9bb7e']),x,y,rn()<.3?2:1,1)}
 for(let n=0;n<260;n++){const y=140+Math.floor(rn()*850),x=Math.floor(rn()*Math.max(1,shoreX(y)-40));const w=8+Math.floor(rn()*14);r('#eed7a2',x,y,w,1);r('#fff2d0',x+1,y-1,w-3,1)}
 // đụn cỏ phía trên và phía dưới
 const gy=x=>128+7*Math.sin(x/37)+3*Math.sin(x/13+1),gy2=x=>1008+7*Math.sin(x/31+2)+3*Math.sin(x/11);
 for(let y=0;y<140;y++){const s=Math.round(shoreX(y))-3;for(let x=0;x<s;x++){const e=gy(x);if(y<e){r(y>e-2?'#6fa84e':rn()<.12?pk(['#a4d97a','#76b055']):'#8dc767',x,y,1,1)}else if(y<e+3&&y>=e)r('#d9c088',x,y,1,1)}}
 for(let y=996;y<SH;y++){const s=Math.round(shoreX(y))-3;for(let x=0;x<s;x++){const e=gy2(x);if(y>e){r(y<e+2?'#6fa84e':rn()<.12?pk(['#a4d97a','#76b055']):'#8dc767',x,y,1,1)}else if(y>e-3&&y<=e)r('#d9c088',x,y,1,1)}}

 // ---- ỐC ĐẢO SAN HÔ LỚN NGOÀI KHƠI (OX=1280, OY=560, ORX=310, ORY=225) ----
 const xMin=OX-ORX-110,xMax=OX+ORX+110,yMin=OY-ORY-85,yMax=OY+ORY+85;
 for(let y=yMin;y<=yMax;y+=2){
  for(let x=xMin;x<=xMax;x+=2){
   const d=oasisDist(x,y);
   if(d>1.34)continue;
   if(d>1.23){r('#2894c4',x,y,2,2);continue}
   if(d>1.14){r('#3cb9ce',x,y,2,2);continue}
   if(d>1.05){r('#6eddd8',x,y,2,2);continue}
   if(d>1.00){r('#b6f1e6',x,y,2,2);continue}
   if(d>0.97){r('#cca86e',x,y,2,2);continue}
   if(d>0.74){r(d>0.91?'#e5c990':'#f5e2b2',x,y,2,2);continue}
   // Lòng đảo: thảm cỏ nhiệt đới xanh mướt
   const md=Math.hypot((x-(OX+12))/(ORX*0.72),(y-(OY-14))/(ORY*0.70));
   r(md<0.55?'#9cd974':md<0.82?'#7ec058':'#63a246',x,y,2,2);
  }
 }
 // Rạn san hô sắc màu lấp lánh dưới làn nước cạn quanh đảo
 for(let i=0;i<260;i++){
  const an=rn()*6.283,rr=1.03+rn()*0.23,sc=oasisR(an);
  const cx0=Math.round(OX+Math.cos(an)*ORX*sc*rr),cy0=Math.round(OY+Math.sin(an)*ORY*sc*rr);
  r(pk(['#ff8c80','#ffd478','#64dcd0','#f6b8e0','#96b8ff']),cx0,cy0,i%3?2:3,2);
 }
 // Hạt cát mịn & gợn cát vàng trên bãi tắm rộng
 for(let i=0;i<2200;i++){
  const an=rn()*6.283,rr=0.68+Math.sqrt(rn())*0.30,sc=oasisR(an);
  const sx0=Math.round(OX+Math.cos(an)*ORX*sc*rr),sy0=Math.round(OY+Math.sin(an)*ORY*sc*rr);
  r(pk(['#e6c88e','#fbecc4','#dfc185','#fff3d4']),sx0,sy0,1,1);
 }
 // Hoa cỏ nhiệt đới trên thảm xanh lòng đảo
 for(let i=0;i<360;i++){
  const an=rn()*6.283,rr=Math.sqrt(rn())*0.66,sc=oasisR(an);
  const gx=Math.round(OX+Math.cos(an)*ORX*sc*rr),gy0=Math.round(OY-8+Math.sin(an)*ORY*sc*rr);
  r(i%10===0?pk(['#ff7ea8','#ffe66d','#ffffff']):pk(['#6eb050','#a8e080']),gx,gy0,2,1);
 }
 // Lối đá san hô tròn uốn lượn kết nối cầu tàu -> Bar Tiki -> Hồ Suối -> Vọng Lâu -> Bãi Tắm Nam
 const stonePath=(pts)=>{
  for(let k=0;k+1<pts.length;k++){
   const[ax,ay]=pts[k],[bx,by]=pts[k+1],n=Math.max(1,Math.round(Math.hypot(bx-ax,by-ay)/13));
   for(let i=0;i<=n;i++){
    const px=Math.round(ax+(bx-ax)*i/n+Math.sin(i*1.7)*2),py=Math.round(ay+(by-ay)*i/n+Math.cos(i*1.3)*2);
    E(r,'#cbb998',px,py+1,5,3);E(r,'#ede1cb',px,py,4,3);
   }
  }
 };
 stonePath([[1002,560],[1120,560],[1148,492]]);
 stonePath([[1120,560],[1230,582],[1320,560],[1445,582]]);
 stonePath([[1230,582],[1150,672]]);
 stonePath([[1320,560],[1375,672]]);

 // Hồ suối nước ngọt rộng trong vắt giữa Ốc Đảo (LX=1320, LY=498, LRX=64, LRY=38)
 E(r,'#cbb68a',LX,LY,LRX+4,LRY+4);
 E(r,'#e7d8b8',LX,LY,LRX+2,LRY+2);
 E(r,'#45c2b8',LX,LY,LRX,LRY);
 E(r,'#239db0',LX,LY+2,LRX-10,LRY-6);
 E(r,'#6ee6e2',LX-8,LY-4,LRX-28,LRY-15);
 for(const[lx0,ly0]of[[LX-34,LY+14],[LX+28,LY+16],[LX+36,LY-6],[LX-26,LY-12],[LX+8,LY+22]]){
  E(r,'#4f9c4a',lx0,ly0,5,3);r('#ff9ac0',lx0,ly0-1,2,2);
 }

 // ---- CẦU TÀU GỖ BỜ CHÍNH & CẦU TÀU ỐC ĐẢO (đi được) ----
 const drawPier=(px0,px1,py0,py1,dirEnd)=>{
  r('rgba(0,30,70,.22)',px0+4,py1+3,px1-px0,8);
  for(let x=px0+14;x<px1-4;x+=26){r(WDK,x,py1,5,10);r('rgba(255,255,255,.35)',x-1,py1+9,7,2)}
  r(WDK,px0,py0-1,px1-px0+3,py1-py0+3);
  for(let x=px0;x<px1;x+=7){const c=(x/7|0)%2?WD:WDL;r(c,x,py0,6,py1-py0);r(WDD,x+6,py0,1,py1-py0)}
  r('#f0c88a',px0,py0,px1-px0,1);r(WDD,px0,py1-2,px1-px0,2);
  for(let x=px0+8;x<px1-6;x+=7)if(((x/7)|0)%3===0){r('#3a2412',x+1,py0+4,1,1);r('#3a2412',x+1,py1-5,1,1)}
  const bx=dirEnd>0?px1-6:px0+2;
  for(const y of[py0+2,py1-6]){r('#3a2412',bx,y,5,5);r('#8a6a3c',bx+1,y+1,3,2)}
  line(r,'#d9c28a',dirEnd>0?px1-22:px0+18,py1+1,dirEnd>0?px1-22:px0+18,py1+9,1);
 };
 drawPier(PIER.x0,PIER.x1,PIER.y0,PIER.y1,1);
 drawPier(OPIER.x0,OPIER.x1,OPIER.y0,OPIER.y1,-1);
})}

// ============================================================
//  DỰNG MAP
// ============================================================
function build(){
 SEA.built=1;SEA.bg=buildBG();
 // --- nước: chạm vào nước (chừa cầu tàu & vùng Ốc Đảo) — các lát theo bờ ---
 const wm='🌊 Mặt biển — phải LÊN THUYỀN mới câu được! Bấm vào Bến thuyền ("RA BIỂN") nhé.',hw=(x,y,w,h)=>{
  if(w<=0||h<=0)return;
  if(y+h>OY-ORY-32&&y<OY+ORY+32&&x<OX+ORX+40&&x+w>OPIER.x0-8){
   const lx=Math.max(x,OPIER.x0-8),rx=Math.min(x+w,OX+ORX+40);
   if(lx>x)hw(x,y,lx-x,h);
   if(x+w>rx)hw(rx,y,(x+w)-rx,h);
   return;
  }
  hit(x,y,w,h,wm);
 };
 for(let y=0;y<SH;y+=60){const y1=y+60,sx=Math.round(shoreX(y+30))+16;
  if(y1>PIER.y0-2&&y<PIER.y1+4){
   if(y<PIER.y0-2)hw(sx,y,BGW-sx,PIER.y0-2-y);
   hw(PIER.x1+4,Math.max(y,PIER.y0-2),BGW-(PIER.x1+4),Math.min(y1,PIER.y1+4)-Math.max(y,PIER.y0-2));
   if(y1>PIER.y1+4)hw(sx,PIER.y1+4,BGW-sx,y1-PIER.y1-4)}
  else hw(sx,y,BGW-sx,60)}
 // --- SHOP QUÁI VẬT (to, có neon chạy chữ + dù nghỉ mát bên cạnh) ---
 const SX=96,SY=402;
 put(mkShop(),SX,SY,[SX-82,SY-24,SX+82,SY-2]);
 {const X0=Math.round(SX-SHW/2),Y0=Math.round(SY-SHH);dyn(SY+.4,()=>drawShopNeon(X0,Y0,tmNow()))}
 hit(SX-84,SY-132,168,134,'🎣 Shop quái vật — bán thuyền & thu mua quái vật, bấm để vào','cv:bn:shop',[SX,SY+16]);
 {const ux=150,uy=486;put(mkBeachSet(),ux,uy,[ux-8,uy-8,ux+22,uy-2]);hit(ux-44,uy-76,90,78,'⛱️ Dù nghỉ mát của Shop quái vật — ngồi hóng gió biển cũng thích lắm')}
 // --- bạch tuộc đứng rao ở mép nước cạnh tiệm ---
 OCT.x=Math.round(shoreX(SY+30))+16;OCT.y=SY+30;
 dyn(OCT.y+.5,()=>drawOcto(tmNow()));
 hit(OCT.x-40,OCT.y-52,64,58,'🐙 Bạch tuộc: "Đồ câu quái vật đây! Vào tiệm xem thử nha!"','cv:bn:shop',[SX,SY+16]);
  // --- cầu tàu + bến thuyền chính ---
 {const ex=PIER.x1,my=Math.round((PIER.y0+PIER.y1)/2),SG=[ex-40,my];
  put(mkSignPost(),ex-14,PIER.y0-4,[ex-30,PIER.y0-8,ex-2,PIER.y0-2]);
  hit(ex-44,PIER.y0-70,56,68,'⛵ Bến thuyền — bấm để RA BIỂN','cv:bn:sail:main',SG);
  const bm=mkBoat(),bo=outl(bm);dyn(PIER.y1+22,()=>{if(CV.boat||SEAB.at==='oasis')return;const t=tmNow(),bb=Math.round(Math.sin(t*1.6)*1);cx.drawImage(bo,Math.round(ex-84)-1,PIER.y1+4+bb-1)});
  hit(ex-84,PIER.y1+4,64,26,'⛵ Thuyền buộc ở bến — bấm để RA BIỂN','cv:bn:sail:main',SG);
  dyn(PIER.y1+300,()=>{if(CV.boat||camX>ex+120||camX+vw<ex-200)return;const tm=tmNow(),bx=ex-14,by=PIER.y0-86+Math.round(Math.sin(tm*2.4)*2),t='⛵ RA BIỂN';
   cx.save();cx.font='800 9px Nunito, sans-serif';cx.textAlign='center';const w=Math.round(cx.measureText(t).width)+16;
   cx.fillStyle='#0d6a76';cx.fillRect(bx-(w>>1)-1,by-10,w+2,16);cx.fillStyle='#e8fbff';cx.fillRect(bx-(w>>1),by-9,w,14);
   cx.fillStyle='#0d6a76';cx.fillRect(bx-3,by+6,6,2);cx.fillRect(bx-1,by+8,2,2);cx.fillText(t,bx,by+2);cx.restore()});
  hit(ex-44,PIER.y0-98,60,24,'⛵ Bấm để RA BIỂN','cv:bn:sail:main',SG)}

 // --- ỐC ĐẢO SAN HÔ LỚN (Cầu tàu + 2 đèn bến, Thác đá đôi & Hồ suối, Bar Tiki, Vọng lâu Hoàng Hôn, Tượng Tiki, 8 dừa, 4 đuốc, 3 ghế nằm) ---
 {const oex=OPIER.x0,omy=Math.round((OPIER.y0+OPIER.y1)/2),OSG=[oex+38,omy];
  put(mkOasisSign(),oex+18,OPIER.y0-4,[oex+4,OPIER.y0-8,oex+32,OPIER.y0-2]);
  hit(oex-12,OPIER.y0-70,56,68,'🏝️ Bến Ốc Đảo — bấm để RA BIỂN','cv:bn:sail:oasis',OSG);
  for(const ly of[OPIER.y0+4,OPIER.y1-2])put(mkPierLamp(),oex+6,ly,[oex+1,ly-6,oex+11,ly+1]);
  const obm=mkBoat(),obo=outl(obm);
  dyn(OPIER.y1+22,()=>{if(CV.boat||SEAB.at!=='oasis')return;const t=tmNow(),bb=Math.round(Math.sin(t*1.6)*1);cx.drawImage(obo,Math.round(oex+16)-1,OPIER.y1+4+bb-1)});
  hit(oex+16,OPIER.y1+4,64,26,'⛵ Thuyền đang neo tại Ốc Đảo — bấm để RA BIỂN','cv:bn:sail:oasis',OSG);
  dyn(OPIER.y1+300,()=>{if(CV.boat||camX>oex+200||camX+vw<oex-140)return;const tm=tmNow(),bx=oex+18,by=OPIER.y0-86+Math.round(Math.sin(tm*2.4)*2),t='⛵ RA BIỂN';
   cx.save();cx.font='800 9px Nunito, sans-serif';cx.textAlign='center';const w=Math.round(cx.measureText(t).width)+16;
   cx.fillStyle='#0d6a76';cx.fillRect(bx-(w>>1)-1,by-10,w+2,16);cx.fillStyle='#e8fbff';cx.fillRect(bx-(w>>1),by-9,w,14);
   cx.fillStyle='#0d6a76';cx.fillRect(bx-3,by+6,6,2);cx.fillRect(bx-1,by+8,2,2);cx.fillText(t,bx,by+2);cx.restore()});
  hit(oex-12,OPIER.y0-98,60,24,'⛵ Bấm để RA BIỂN','cv:bn:sail:oasis',OSG);
  lbl('ỐC ĐẢO SAN HÔ',OX,OY-ORY-14);

  // Hồ suối nước ngọt + Thác đá vôi đôi
  put(mkWaterfallRock(),LX,LY-6,[LX-58,LY-26,LX+58,LY+28]);
  dyn(LY+2,()=>{
   if(LX+75<camX||LX-75>camX+vw)return;
   const t=tmNow();
   for(const wx0 of[LX-12,LX+10])for(let k=0;k<4;k++){
    const u=(t*1.45+k*.25)%1,fy=Math.round(LY-34+u*22);
    r('rgba(255,255,255,'+(.78*(1-u*.55)).toFixed(2)+')',wx0-2+(k%3)*2,fy,2,3);
   }
   for(let k=0;k<3;k++){
    const a=(t*.75+k*.33)%1;
    E(r,'rgba(220,255,255,'+(.48*(1-a)).toFixed(2)+')',LX,LY-8,Math.round(12+a*20),Math.round(3+a*6));
   }
  });
  hit(LX-60,LY-56,120,86,'🏞️ Suối nước ngọt & Thác Đôi Ốc Đảo — nước trong veo mát lạnh!');

  // Quán Bar Tiki Ốc Đảo Lớn
  const TX=1148,TY=478;
  put(mkTikiHut(),TX,TY,[TX-46,TY-22,TX+46,TY-2]);
  hit(TX-52,TY-88,104,88,'🥥 Quán Bar Tiki Ốc Đảo — sinh tố dứa dừa & không khí lễ hội!');

  // Vọng Lâu Hoàng Hôn (ngồi nghỉ ngắm biển)
  const GX=1462,GY=578;
  put(mkGazebo(),GX,GY,[GX-38,GY-22,GX+38,GY-2]);
  hit(GX-44,GY-84,88,84,'🏝️ Vọng Lâu Hoàng Hôn — bấm để ngồi ngắm đại dương xanh','cv:bn:sit:'+GX+':'+(GY-16)+':'+(GY+6),[GX,GY+6]);

  // Tượng Tiki Cổ Nhiệt Đới ở quảng trường trung tâm đảo
  const TTX=1228,TTY=568;
  put(mkTikiTotem(),TTX,TTY,[TTX-11,TTY-12,TTX+11,TTY+1]);
  hit(TTX-16,TTY-58,32,58,'🗿 Tượng Tiki Cổ Ốc Đảo — đôi mắt phát sáng ngọc ban đêm!');

  // 8 Cây dừa cao rợp bóng quanh Ốc Đảo
  for(const[px,py,lean]of[[1014,458,-.35],[1056,668,-.30],[1216,384,-.25],[1418,392,.35],[1528,472,.40],[1536,642,.36],[1338,738,.28],[1130,730,-.28]]){
   put(mkPalm(lean),px,py,[px-7,py-9,px+7,py+1]);
   hit(px-22,py-88,44,88,'🥥 Dừa Ốc Đảo — trái sum suê, bóng mát rượi');
  }

  // Khóm hoa nhiệt đới dâm bụt & lan rừng
  for(const[bx,by,col]of[[1082,534,'#ff6088'],[1250,468,'#ffd23f'],[1414,486,'#ff6088'],[1404,638,'#ff8eb8'],[1202,650,'#ffd23f'],[1078,618,'#ff6088']]){
   put(mkTropBush(col),bx,by,[bx-10,by-6,bx+10,by+1]);
  }

  // 4 Đuốc Tiki cháy bập bùng quanh đảo
  const TP=outl(mkTikiPole());
  for(const[fx,fy]of[[986,526],[1084,476],[1214,476],[1402,588]]){
   SEA.sp.push({by:fy,d:()=>{
    cx.drawImage(TP,fx-9,fy-37);
    const t=tmNow(),fl=Math.round(Math.sin(t*11+fx)*1);
    E(r,'rgba(255,170,60,.26)',fx,fy-30,8,7);
    r('#ff6a22',fx-2,fy-31-fl,5,4);r('#ffd23f',fx-1,fy-30-fl,3,3);r('#fff8c0',fx,fy-29,1,2);
   }});
   blk(fx-4,fy-6,fx+4,fy+1);
   hit(fx-8,fy-38,16,40,'🔥 Đuốc Tiki — thắp sáng lối dạo Ốc Đảo');
  }

  // 3 Ghế nằm bãi biển + Dù sọc ở Bãi Tắm Nam (ngồi nghỉ được!)
  for(const[ux,uy,c1,c2,sgY]of[[1136,682,'#ff6a5a','#fff6e0',692],[1262,704,'#1fa6b4','#fff6e0',714],[1388,682,'#f0a830','#fff6e0',692]]){
   put(mkLounger(c1,c2),ux,uy,[ux-22,uy-10,ux+14,uy-1]);
   hit(ux-25,uy-48,50,50,'🏖️ Ghế bãi biển Ốc Đảo — bấm để nằm hóng gió!','cv:bn:sit:'+(ux-6)+':'+(uy-6)+':'+sgY,[ux-6,sgY]);
  }

  // Vỏ sò, sao biển & chú cua đỏ trên bãi cát Ốc Đảo
  for(const[sx,sy,k]of[[1030,582,0],[1190,602,2],[1094,724,1],[1330,740,4],[1470,694,0],[1494,522,3],[1178,412,2]]){
   const o=SHELL[k];SEA.sp.push({by:sy,d:()=>cx.drawImage(o,sx-8,sy-12)});
  }
  {const ic={y:736,x0:1200,x1:1295,ph:1.8};dyn(ic.y+.5,()=>drawCrab(ic,tmNow()));hit(1196,722,106,22,'🦀 Chú cua Ốc Đảo đang phơi nắng bãi cát vàng')}
 }
 // --- đụn cỏ trên / dưới + dừa ---
 for(const[x,lean]of[[34,.4],[112,-.5]]){const p=mkPalm(lean);put(p,x,176,[x-6,166,x+6,176])}
 for(const[x,lean]of[[36,-.4],[92,.3]]){put(mkPalm(lean),x,1036,[x-6,1016,x+6,1036])}
 hit(8,84,44,92,'🥥 Cây dừa — nhiều trái lắm nè!');hit(86,84,44,92,'🥥 Cây dừa — gió biển mát rượi');
 const tuft=outl(mkTuft());for(let i=0;i<18;i++){const y=(i%2?138+rn()*10:1002+rn()*14),x=8+rn()*Math.max(10,shoreX(y)-34);SEA.sp.push({by:y,d:()=>cx.drawImage(tuft,Math.round(x),Math.round(y-12))})}
 // --- DÙ CHE NẮNG + khăn trải ---
 put(mkUmb('#e0584a','#fff6e0'),52,668,[34,662,70,668]);hit(24,628,56,42,'⛱️ Dù che nắng — khăn trải cát ấm áp, ngồi hóng gió biển thích lắm');
 put(mkUmb('#1fa6b4','#fff6e0'),50,930,[32,924,68,930]);hit(22,890,56,42,'⛱️ Dù che nắng — ai bỏ quên khăn tắm nè');
 // --- RƯƠNG KHO BÁU: mỗi 1 giờ bấm nhận 10–40 xu quái vật (không cộng dồn, không chữ) ---
 {const cy0=690,cx0=Math.round(shoreX(cy0))-62;
  put(mkChestCl(),cx0,cy0,[cx0-18,cy0-12,cx0+18,cy0]);
  dyn(cy0+1,()=>{const t=tmNow(),rdy=chestReady();if(!rdy&&!CH.fx)return;const b=rdy?Math.round(Math.sin(t*2.6)*2):0;
   if(rdy){ // đồng xu quái vật nhảy lơ lửng báo đã sẵn sàng
    if(QVIM.complete)cx.drawImage(QVIM,cx0-8,cy0-52+b,16,16);
    for(let k=0;k<4;k++){const a=Math.sin(t*3+k*1.9);if(a>.4){const px=cx0-14+((k*9+Math.round(t*4))%30),py=cy0-30+(k*7%16);r('#ffffff',px,py,1,1);r('rgba(255,236,150,.9)',px-1,py,3,1);r('rgba(255,236,150,.9)',px,py-1,1,3)}}}
   if(CH.fx&&performance.now()<CH.fx){const u=1-(CH.fx-performance.now())/900;for(let k=0;k<10;k++){const an=k*.63,d=u*26;r(k%2?'#ffe27a':'#ffffff',Math.round(cx0+Math.cos(an)*d),Math.round(cy0-18+Math.sin(an)*d*.8-u*8),2,2)}}});
  hit(cx0-22,cy0-34,44,40,'','cv:bn:chest',[cx0,cy0+14])}
 // --- VỎ SÒ, SAO BIỂN, ĐÁ, GỖ TRÔI rải trên bãi ---
 const SH_MSG=['🐚 Vỏ sò hồng xinh xắn — còn ấm nắng','🐚 Ốc xoắn kem — áp tai nghe tiếng biển thử xem','⭐ Sao biển cam nằm phơi nắng','🐚 Con nghêu tím nhạt','🪙 Đồng tiền cát — lấp lánh nè'];
 const spots=[[100,196],[40,226],[120,252],[30,330],[24,452],[84,486],[40,520],[70,590],[22,640],[44,742],[110,830],[64,870],[100,960],[30,988],[72,520],[104,640],[56,790],[20,560],[88,420]];
 spots.forEach(([x,y],i)=>{if(bnSolid(x,y)||x>shoreX(y)-20||(x<150&&y>288&&y<440&&x>4))return;const k=(i*3+i%5)%5,o=SHELL[k];SEA.sp.push({by:y,d:()=>cx.drawImage(o,x-8,y-12)});hit(x-8,y-12,16,14,SH_MSG[k])});
 for(const[x,y,w,h]of[[20,220,28,20],[40,610,34,22],[30,860,30,20],[56,960,36,22]]){if(x+w>shoreX(y)-14)continue;put(mkRock(w,h,['#9aa3ab','#6f7880','#c3cad0']),x+w/2,y+h,[x+3,y+h-9,x+w-3,y+h]);hit(x,y,w,h,'🪨 Hòn đá nhẵn thín bị sóng mài')}
 for(const[x,y]of[[70,260],[60,520],[40,780],[70,930]]){if(x+16>shoreX(y)-12)continue;const o=outl(mkWood());SEA.sp.push({by:y,d:()=>cx.drawImage(o,x-17,y-10)});hit(x-17,y-12,34,12,'🪵 Khúc gỗ trôi dạt vào bờ')}
 // --- hai chú cua chạy ngang ---
 for(const c of[{y:610,x0:22,x1:78,ph:0},{y:850,x0:26,x1:92,ph:4}])dyn(c.y+.5,()=>drawCrab(c,tmNow()));
 hit(10,596,76,22,'🦀 Chú cua nhỏ đang đi ngang — tách tách tách');hit(14,836,88,22,'🦀 Cua đồng chạy ngang bờ cát');
 // --- thả phao + đá ngoài biển + thuyền buồm xa xa + đảo nhỏ (tránh vùng Ốc Đảo lớn) ---
 for(const[x,y]of[[540,290],[640,640],[830,860],[820,230],[1290,220],[1700,320],[1740,770],[1310,910],[1900,640]].filter(p=>p[0]<BGW)){const bo=outl(mkBuoy()),ph=x*.013;dyn(y,()=>{const t=tmNow();cx.drawImage(bo,x-9,Math.round(y-22+Math.sin(t*1.7+ph)*1.5));
  const a=.2+.12*Math.sin(t*1.7+ph);r('rgba(255,255,255,'+a.toFixed(2)+')',x-9,y+1,18,1)});hit(x-10,y-24,20,26,'🏮 Phao đèn biển — tự bật sáng rực rỡ vào ban đêm')}
 // --- đảo nhỏ có dừa (chỉ là vật cản, nằm ngoài vùng Ốc Đảo) ---
 {const ik=mkIslet();BROCK.forEach(([x,y,w,h],i)=>{if(x>BGW)return;const cx0=Math.round(x+w/2),cy0=Math.round(y+h/2)+2,ph=i*1.7;
  dyn(cy0-6,()=>{const t=tmNow(),a=.35+.2*Math.sin(t*1.8+ph);
   cx.drawImage(ik,cx0-46,cy0-34);r('rgba(255,255,255,'+a.toFixed(2)+')',cx0-44,cy0+12,88,1);r('rgba(255,255,255,'+(a*.6).toFixed(2)+')',cx0-48,cy0+14,96,1)});
  put(mkPalm(i%2?-.3:.3),cx0-4,cy0+3)})}
 for(const[x,y,sp,ph]of[[1760,865,5,0],[1820,150,4,60],[2700,700,3,120]].filter(p=>p[0]<BGW)){const m=mkSail(),o=outl(m);dyn(y+34,()=>{const t=tmNow(),px=x+((t*sp+ph*10)%360)-180;cx.drawImage(o,Math.round(px),Math.round(y+Math.sin(t*1.2+x)*1.2))})}
 for(const[x,y]of[[1920,165],[960,975]].filter(p=>p[0]<BGW))put(mkIsle(),x+60,y+56);
 for(const[x,y,l]of[[1966,143,.3],[990,945,-.3]].filter(p=>p[0]<BGW))put(mkPalm(l),x,y+36);
 SEA.fx=seaFx;
 tcBuild();   // hòm kho báu trôi gần ốc đảo (xem khối HÒM KHO BÁU TRÔI bên dưới)
 // sóng lấp lánh trên mặt biển (né bãi cát & rạn Ốc Đảo)
 for(let i=0;i<260;i++){const sx=shoreX(100)+60+rn()*(BGW-300),sy=rn()*SH;if(oasisDist(sx,sy)>1.08)SPK.push({x:sx,y:sy,ph:rn()*6.3})}
 for(let i=0;i<14;i++)GULL.push({y:60+rn()*(SH-120),sp:20+rn()*18,ph:rn()*BGW,dir:rn()<.5?1:-1,fl:rn()*6});
 // người chơi mới vào: bãi biển nằm ở góc TRÁI màn hình
 SEA.pos.x=96;SEA.pos.y=446}

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
 boatTick();zoneTick();hud();zoneArrow();tcArrow();
 // thoại bạch tuộc: nói 3.6s, nghỉ 2.4s, đổi câu
 const now=performance.now();
 if(now>OCTS.next){OCTS.on=1;OCTS.i=(OCTS.i+1)%OCT_LINES.length;OCTS.until=now+3600;OCTS.next=now+6000}
 if(now>OCTS.until)OCTS.on=0;
 if(OCTS.on&&OCT.hx!=null&&Math.abs(OCT.hx-Pl.x)<320&&Math.abs(OCT.hy-Pl.y)<260){
  const t=OCT_LINES[OCTS.i];cx.font='800 8px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';const w=Math.min(160,cx.measureText(t).width)+12,y=OCT.hy-6,x=Math.max(camX+w/2+3,Math.min(camX+vw-w/2-3,OCT.hx+4));
  cx.fillStyle='rgba(30,20,10,.45)';cx.fillRect(x-w/2+1,y-9,w,14);cx.fillStyle='#fffdf0';cx.fillRect(x-w/2,y-10,w,14);cx.fillRect(x-2,y+4,4,2);cx.fillStyle='#4a1f66';cx.fillText(t,x,y,w-6)}
 // hải âu
 for(const g of GULL){const L=BGW+200;let x=(g.ph+tm*g.sp*g.dir)%L;if(x<0)x+=L;x-=100;
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
 // sóng bọt uốn theo đường bờ tự nhiên của Ốc Đảo (khi nằm trong màn hình)
 if(OX+ORX+50>camX&&OX-ORX-50<camX+vw&&OY+ORY+40>camY&&OY-ORY-40<camY+vh){
  cx.save();
  const s=Math.sin(tm*1.5)*2.8;
  const traceShore=(padX,padY)=>{
   cx.beginPath();
   for(let i=0;i<=48;i++){
    const an=i/48*6.283,sc=oasisR(an);
    const px=OX+Math.cos(an)*(ORX*sc+padX),py=OY+Math.sin(an)*(ORY*sc+padY);
    if(i===0)cx.moveTo(px,py);else cx.lineTo(px,py);
   }
   cx.closePath();cx.stroke();
  };
  cx.strokeStyle='rgba(255,255,255,0.46)';cx.lineWidth=2;traceShore(5+s,4+s*.7);
  cx.strokeStyle='rgba(175,248,242,0.34)';cx.lineWidth=1.5;traceShore(14-s*.6,10-s*.5);
  cx.restore();
 }
 // gợn sóng + lấp lánh
 for(const k of SPK){if(k.y<camY-2||k.y>camY+vh+2||k.x<camX-4||k.x>camX+vw+4)continue;
  const a=Math.sin(tm*2.3+k.ph);if(a>.62){r('rgba(255,255,255,'+((a-.5)*1.6).toFixed(2)+')',Math.round(k.x),Math.round(k.y),2,1);if(a>.85)r('rgba(255,255,255,.6)',Math.round(k.x)-1,Math.round(k.y),4,1)}}
 // VÙNG NƯỚC TỐI (màu tối nhẹ hơn nước thường) — lái thuyền vào đó câu để dễ nhận quà
 const nw=performance.now(),z=ZN.z;
 if(z&&nw<z.until&&z.x+z.r*1.2>camX&&z.x-z.r*1.2<camX+vw&&z.y+z.r>camY&&z.y-z.r<camY+vh){
  const al=Math.max(0,Math.min(1,(nw-z.t0)/2500,(z.until-nw)/4000));
  cx.save();cx.translate(z.x,z.y);cx.scale(1,.62);
  const gr=cx.createRadialGradient(0,0,z.r*.15,0,0,z.r*1.1);gr.addColorStop(0,'rgba(3,22,62,'+(.34*al).toFixed(3)+')');gr.addColorStop(.6,'rgba(3,22,62,'+(.24*al).toFixed(3)+')');gr.addColorStop(1,'rgba(3,22,62,0)');
  cx.fillStyle=gr;cx.beginPath();cx.arc(0,0,z.r*1.1,0,6.283);cx.fill();
  for(let i=0;i<2;i++){const p=(tm*.25+i*.5)%1;cx.strokeStyle='rgba(180,225,255,'+(.24*al*(1-p)).toFixed(3)+')';cx.lineWidth=1.5;cx.beginPath();cx.arc(0,0,z.r*(.25+p*.8),0,6.283);cx.stroke()}
  cx.restore();
  for(let k=0;k<5;k++){const an=tm*.5+k*1.26,rr=z.r*(.3+.45*((k*37%10)/10)),px=Math.round(z.x+Math.cos(an)*rr),py=Math.round(z.y+Math.sin(an)*rr*.62);r('rgba(2,18,50,'+(.38*al).toFixed(2)+')',px-4,py,9,2);r('rgba(2,18,50,'+(.3*al).toFixed(2)+')',px-2,py-1,5,1)}
  for(let k=0;k<7;k++){const u=(tm*.55+k*.143)%1,bx=Math.round(z.x+Math.sin(k*2.7)*z.r*.6),by=Math.round(z.y+Math.cos(k*1.9)*z.r*.3-u*10);r('rgba(255,255,255,'+(.55*al*(1-u)).toFixed(2)+')',bx,by,2,2)}}
};
const pSetup=window.cvSetup,pSolid=window.cvSolid,pAct=window.cvAct;
window.cvSetup=()=>{
 if(MAP!='bn')return pSetup();
 window.cvUseMap('bn');if(!SEA.built)build();CV.fx=seaFx;
 CVON=1;setA(SP,CV.sp);setA(hits,CV.hits);setA(LB,CV.lb);
 Pl.x=SEA.pos.x;Pl.y=SEA.pos.y;Pl.d=1;CV.seat=-1;CV.hz=-1;CV.boat=0;CV.bk=0;CV.dock=null;SEAB.dock=0;SEAB.dockTarget='main';SEAB.at='main';SEAB.wp=null;ZN.z=null;ZN.next=0;
 toast('🌊 Chào mừng tới Biển! Ra cầu tàu bấm RA BIỂN — ngoài khơi phía Đông có Ốc Đảo San Hô có thể cập bến!');
 if(window.PKO)PKO.onEnter()};
window.cvSolid=(x,y)=>MAP=='bn'?bnSolid(x,y):pSolid(x,y);
const pLeave=window.cvLeave,pBS=window.cvBoatSolid,pBT=window.cvBoatTap,pBM=window.cvBoatMe;
window.cvAct=(a,h)=>a.startsWith('bn:')?bnAct(a.slice(3),h):pAct(a,h);

// ============================================================
//  THUYỀN RA BIỂN
//  ST.boats = {mini:0/1, swan:0/1, bamboo:0/1, use:'mini'|'swan'|'bamboo'}  (tự lưu cùng ST; KHÔNG dùng ST.sb vì Làng Tuyết đã dùng cho huy hiệu)
//  Mã loại thuyền (CV.bk, gửi cho người chơi khác qua park-online): 2 = mini • 3 = thiên nga • 4 = tre đom đóm
//  Thuyền mini: 1.000 xu vàng (ST.xu) • Thuyền thiên nga 3.000 & Thuyền tre đom đóm 5.000: xu quái vật (ST.qv)
//  Muốn đổi giá: sửa SB_MINI / SB_SWAN / SB_BAMBOO ngay dưới đây.
// ============================================================
const SB_MINI=1000,SB_SWAN=3000,SB_BAMBOO=5000;   // swan ≈ 15–30 phút câu liên tục
const BNAME={mini:'Thuyền mini',swan:'Thuyền thiên nga',bamboo:'Thuyền tre đom đóm'},BKIND={mini:2,swan:3,bamboo:4};
const SEAB={dock:0,dockTarget:'main',at:'main',wp:null},ZN={z:null,next:0};
const sbs=()=>{const o=ST.boats=(ST.boats&&typeof ST.boats=='object')?ST.boats:{};o.mini=o.mini?1:0;o.swan=o.swan?1:0;o.bamboo=o.bamboo?1:0;
 if(!(o.use&&BKIND[o.use]&&o[o.use]))o.use=o.swan?'swan':o.bamboo?'bamboo':o.mini?'mini':'';return o};
const BROCK=[[660,480,60,36],[1160,175,70,40],[1560,940,64,38],[1920,420,70,40],[2350,820,60,34]],BISLE=[[1920,165],[960,975]];
const nearMainLand=(x,y)=>x<shoreX(y)+36||(x<=PIER.x1+10&&y>=PIER.y0-12&&y<=PIER.y1+34);
const nearOasisLand=(x,y)=>oasisDist(x,y)<=1.15||(x>=OPIER.x0-20&&x<=OPIER.x1+14&&y>=OPIER.y0-20&&y<=OPIER.y1+28);
const nearLand=(x,y)=>nearMainLand(x,y)||nearOasisLand(x,y);
const boatSolid=(x,y)=>{
 if(nearLand(x,y)||x>SEA_LIM||y<30||y>SH-30)return true;
 for(const b of BROCK)if(x>b[0]-18&&x<b[0]+b[2]+18&&y>b[1]-14&&y<b[1]+b[3]+16)return true;
 for(const q of BISLE)if(Math.hypot((x-q[0]-60)/72,(y-q[1]-40)/26)<1)return true;
 return false};
const dockSpot=t=>t==='oasis'?{x:OPIER.x0-44,y:Math.round((OPIER.y0+OPIER.y1)/2)}:{x:PIER.x1+44,y:Math.round((PIER.y0+PIER.y1)/2)};
const mirror=(x,dir,fn)=>{cx.save();cx.translate(x,0);if(dir<0)cx.scale(-1,1);cx.translate(-x,0);fn();cx.restore()};

// cần câu cắm bên cạnh mạn thuyền (chỉ để trang trí — không có món "cần câu")
function seaRod(x,yy,dir,tm,ox){if(window.RODX)return;   // canca.js đã nạp: nhân vật tự cầm cần, bỏ cần cắm trang trí
 mirror(x,dir,()=>{ox=ox|0;   // ox: dời chân cần câu ra phía đuôi (Thuyền tre dùng -11)
 const bx=x-9+ox,by=yy-5,tx=x-26+ox,ty=yy-33,bo=Math.round(Math.sin(tm*3+x));
 line(r,'#5e3f20',bx,by,tx,ty,2);line(r,'#a9844c',bx,by-1,tx,ty-1,1);
 r('#6a6a72',bx+1,by-5,3,3);r('#d8d8e0',bx+1,by-5,1,1);r('#ffd23f',tx-1,ty-1,2,2);
 line(r,'rgba(255,255,255,.85)',tx,ty,tx-3,yy+7+bo,1);
 r('#e8402a',tx-5,yy+6+bo,3,2);r('#fff',tx-5,yy+8+bo,3,1)})}
// thuyền thiên nga (copy từ Công viên) + cần câu
const swanSea=(x,y,dir,tm,mv,rider)=>window.cvDrawBoat(x,y,dir,tm,mv,(rx,ry)=>{seaRod(x,ry,dir,tm);if(rider)rider(rx,ry)});
// thuyền mini bằng gỗ + cần câu
function miniSea(x,y,dir,tm,mv,rider){
 const yy=y+Math.round(Math.sin(tm*2.4+x*.03));
 E(r,'rgba(20,70,110,.3)',x,y+4,19,3);
 const a=(tm*.9+x*.01)%1;E(r,'rgba(235,250,255,'+(.35*(1-a)).toFixed(2)+')',x,y+5,Math.round(20+a*7),Math.round(3+a*2));
 if(mv)for(let i=0;i<3;i++){const p=(tm*1.6+i/3)%1;E(r,'rgba(235,250,255,'+(.55*(1-p)).toFixed(2)+')',Math.round(x-dir*(15+p*26)),y+4,Math.round(4+p*8),Math.round(1+p*2))}
 mirror(x,dir,()=>{
  E(r,'#7a4e28',x,yy+2,18,5);E(r,'#b8764a',x,yy+1,18,5);E(r,'#c98a5a',x,yy,17,4);r('#8a5a30',x-16,yy+3,32,1);
  r('#c98a5a',x+16,yy-3,3,3);r('#e8c07a',x+17,yy-5,2,3);r('#8a5a30',x+17,yy-1,2,1);r('#c98a5a',x-18,yy-3,2,3);
  r('#5e3f20',x-14,yy-5,29,3);r('#d6a66a',x-5,yy-6,10,2);r('#f0c88a',x-5,yy-6,10,1)});
 seaRod(x,yy,dir,tm);
 if(rider)rider(x-2*dir,yy);
 mirror(x,dir,()=>{r('#c98a5a',x-16,yy-5,33,5);r('#f6dc9c',x-16,yy-5,33,1);r('#e0584a',x-16,yy-3,33,1);r('#8a5a30',x-16,yy-1,33,1);r('#8a5a30',x-16,yy-5,1,5);r('#8a5a30',x+16,yy-5,1,5)})}

// ---------- THUYỀN TRE ĐOM ĐÓM (5.000 xu quái vật) ----------
// Bè tre vàng + mái tre đan (hình mẫu) • nhân vật ĐỨNG trên bè, KHÔNG có mái chèo (thuyền tự lướt) • đèn đom đóm vàng ở MŨI thuyền
// Hình bè + mái vẽ 1 lần vào canvas nhỏ (BAMB) rồi dán lại mỗi khung hình; đèn + đom đóm vẽ động (bambooLantern).
// Quy ước: phía mũi thuyền luôn là +x (mirror() tự lật khi quay trái). Tâm bè = (26,22) trong ảnh 52x28.
let BAMB=null;
const bambooBody=()=>BAMB||(BAMB=mk(52,28,(g,r)=>{
 const p=(c,a,b,w,h)=>r(c,26+a,22+b,w,h);
 // --- bè: 3 lớp ống tre (sàn sáng, mặt bên vàng đậm, bóng dưới) ---
 p('#9a6a18',-20,3,40,1);
 p('#d19a2b',-22,0,44,3);p('#e9b93c',-22,0,44,1);
 p('#f5d462',-22,-5,44,5);p('#fbe790',-22,-5,44,1);p('#e3bf4c',-22,-3,44,1);p('#e3bf4c',-22,-1,44,1);
 for(let a=-17;a<=17;a+=11){p('#b07c1e',a,0,1,3);p('#f1cc58',a+1,0,1,1);p('#d9b13f',a,-4,1,4)}   // mắt tre
 p('#b8841f',-23,0,1,3);p('#d19a2b',-23,-4,1,4);                                                  // đầu ống phía đuôi
 p('#f5d462',22,-6,2,2);p('#d19a2b',22,-4,2,5);p('#fbe790',22,-6,2,1);p('#b8841f',24,-5,1,3);      // mũi bè cong nhẹ lên
 for(const a of[-10,11]){p('#8d5b2a',a,-5,2,8);p('#c8905a',a,-5,1,8)}                              // dây buộc
 // --- mái tre đan (nửa ống úp), mở ra phía mũi ---
 const ins=[6,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0];
 for(let i=0;i<16;i++){const b=-21+i;
  for(let a=-21+ins[i];a<=-4-ins[i];a++){
   const u=a+21,cell=((u/3|0)+(i/3|0))%2;
   let c=cell?'#f2c54c':'#e0a92f';
   if(u%3==2||i%3==2)c=cell?'#cf9a26':'#c18d20';
   if(i==0||a==-21+ins[i]||i==15)c='#a87414';
   p(c,a,b,1,1)}}
 p('#fff0a0',-18,-20,5,1);p('#fff0a0',-19,-18,1,2);                                                // bóng sáng
 p('#fbe08a',-8,-17,1,11);p('#3d2808',-7,-17,4,12);p('#3d2808',-6,-18,2,1);p('#6b4510',-7,-17,1,12);   // cửa mái nhìn từ mũi
 p('#a87414',-21,-5,17,1)}));
// đèn đom đóm vàng ở mũi: cột tre cong + đèn lồng sáng nhấp nháy + vài chú đom đóm bay quanh (tách 3 phần: quầng sáng / đèn / đom đóm)
function bambooGlow(R,x,yy,tm){
 const pu=.5+.5*Math.sin(tm*3.2);
 E(R,'rgba(255,224,80,'+(.10+.07*pu).toFixed(2)+')',x+23,yy-14,13,10);
 E(R,'rgba(255,236,120,'+(.14+.09*pu).toFixed(2)+')',x+23,yy-14,8,7)}
function bambooLamp(R,x,yy){
 const p=(c,a,b,w,h)=>R(c,x+a,yy+b,w,h);
 p('#b27a2a',17,-19,2,15);p('#d9a24a',17,-19,1,15);p('#b27a2a',17,-21,7,2);p('#d9a24a',17,-21,7,1);p('#b27a2a',23,-21,1,3);   // cột cong + móc
 p('#6b4a2a',23,-19,1,1);
 p('#5e3f20',21,-18,5,1);p('#8a5a2a',22,-19,3,1);                                                  // nắp đèn
 p('#ffa82a',21,-17,5,5);p('#ffd23a',22,-17,3,5);p('#fff4a8',22,-16,3,3);p('#ffffff',23,-15,1,1);   // thân đèn
 p('#5e3f20',21,-12,5,1);p('#ff7a3a',23,-11,1,2)}                                                  // đáy + tua
function bambooFlies(R,x,yy,tm){
 for(let i=0;i<5;i++){
  const ph=tm*(.9+i*.17)+i*1.9,fx=Math.round(x+23+Math.cos(ph*1.1+i)*(9+i%2*3)),fy=Math.round(yy-14+Math.sin(ph*1.6+i*2)*(7+i%3)),al=Math.max(0,Math.sin(tm*3.4+i*2.3)*.6+.5);
  if(al<.12)continue;
  R('rgba(255,236,110,'+(al*.3).toFixed(2)+')',fx-1,fy,3,1);R('rgba(255,236,110,'+(al*.3).toFixed(2)+')',fx,fy-1,1,3);
  R('rgba(255,250,170,'+Math.min(1,al+.2).toFixed(2)+')',fx,fy,1,1)}}
const bambooLantern=(R,x,yy,tm)=>{bambooGlow(R,x,yy,tm);bambooLamp(R,x,yy);bambooFlies(R,x,yy,tm)};
function bambooSea(x,y,dir,tm,mv,rider){
 const yy=y+Math.round(Math.sin(tm*2.1+x*.03));
 E(r,'rgba(20,70,110,.3)',x,y+5,25,3);
 const a=(tm*.9+x*.01)%1;E(r,'rgba(235,250,255,'+(.35*(1-a)).toFixed(2)+')',x,y+6,Math.round(25+a*8),Math.round(3+a*2));
 if(mv)for(let i=0;i<3;i++){const p=(tm*1.6+i/3)%1;E(r,'rgba(235,250,255,'+(.55*(1-p)).toFixed(2)+')',Math.round(x-dir*(22+p*28)),y+5,Math.round(4+p*9),Math.round(1+p*2))}
 mirror(x,dir,()=>cx.drawImage(bambooBody(),Math.round(x-26),Math.round(yy-22)));
 seaRod(x,yy,dir,tm,-11);
 if(rider)rider(x+dir,yy);            // nhân vật ĐỨNG trên sàn (ry = mặt sàn)
 mirror(x,dir,()=>bambooLantern(r,x,yy,tm))}
const mkBambooIcon=()=>mk(64,38,(g,r)=>{   // chỉ bè + đèn (quầng sáng & đom đóm được vẽ động trong boatIcons để không bị viền đen)
 E(r,'rgba(0,70,110,.25)',28,36,25,2);
 g.drawImage(bambooBody(),2,8);                       // tâm bè (26,22) → (28,30)
 bambooLamp(r,28,30)});
window.cvBoatKind=k=>k==2?miniSea:k==3?swanSea:k==4?bambooSea:null;   // người chơi khác nhìn thấy đúng loại thuyền
window.cvBoatSolid=(x,y)=>MAP=='bn'?boatSolid(x,y):pBS(x,y);
window.cvBoatMe=()=>{if(MAP!='bn')return pBM();const A=ST.av,tm=performance.now()/1000,k=CV.bk;(k==4?bambooSea:k==3?swanSea:miniSea)(Math.round(Pl.x),Math.round(Pl.y),CV.bdir||1,tm,Pl.mv,window.cvBoatRider(A.s,A.h,A.e,A.a,CV.bdir||1,k==4))};

// lên thuyền / cập bến
function noBoatUI(){openUI(head('⛵ Bến thuyền')+'<div class="mut" style="text-align:center">🐙 <i>"Chưa có thuyền thì chưa ra biển được nha! Ghé tiệm tôi mua Thuyền mini giá '+fmtXu(SB_MINI)+' xu vàng đi~"</i></div><button class="b w" style="font-size:14px;padding:9px" onclick="bnShop()">🛒 Tới Shop quái vật mua thuyền</button>')}
function sail(from){
 if(CV.boat||MAP!='bn'||Pl.sit||CVLOCK||CV.seat>=0||CV.hz>=0)return;
 const o=sbs();if(!o.use)return noBoatUI();
 if(ST.av.m>=0){ST.av.m=-1;toast('🐃 Bạn xuống khỏi thú cưỡi để lên thuyền')}
 try{if(ACT&&typeof actStop=='function')actStop()}catch(e){}
 if(window.MQ)MQ.clear();
 const side=from==='oasis'?'oasis':(from==='main'?'main':(Pl.x>600?'oasis':'main'));
 const d=dockSpot(side);
 CV.boat=1;CV.bk=BKIND[o.use]||2;CV.bdir=side==='oasis'?-1:1;CV.dock=null;SEAB.dock=0;SEAB.wp=null;SEAB.at=side;Pl.x=d.x;Pl.y=d.y;Pl.d=side==='oasis'?2:3;Pl.mv=0;Pl.pend=0;goal=null;pa=null;
 if(window.PKO)PKO.onBoat();
 toast('⛵ Bấm giữ mặt nước để di chuyển'+(tcReady()?'\n🧰 Hôm nay có hòm kho báu trôi gần ốc đảo!':''))}
function landSea(target){
 const t=target||SEAB.dockTarget||'main',d=dockSpot(t);
 CV.boat=0;CV.bk=0;CV.dock=null;SEAB.dock=0;SEAB.wp=null;SEAB.at=t;
 if(t==='oasis'){Pl.x=OPIER.x0+26;Pl.y=d.y;Pl.d=3}
 else{Pl.x=PIER.x1-26;Pl.y=d.y;Pl.d=2}
 Pl.mv=0;goal=null;pa=null;
 if(window.PKO)PKO.onBoat();
 toast(t==='oasis'?'🏝️ Đã cập bến Ốc Đảo San Hô — chúc bạn dạo chơi vui vẻ!':'⚓ Đã cập bến — bạn bước lên cầu tàu')}
function dockNow(target){
 if(!CV.boat||MAP!='bn')return;
 const do_=dockSpot('oasis'),dm=dockSpot('main');
 const t=target||(Math.hypot(Pl.x-do_.x,Pl.y-do_.y)<Math.hypot(Pl.x-dm.x,Pl.y-dm.y)?'oasis':'main');
 const d=dockSpot(t);
 SEAB.dock=1;SEAB.dockTarget=t;Pl.pend=0;
 if(t==='oasis'&&Pl.x>OPIER.x0+20&&Math.abs(Pl.y-OY)<ORY+54){
  const wx=OX,wy=Pl.y<OY?OY-ORY-58:OY+ORY+58;
  SEAB.wp={x:wx,y:wy};
  goal={x:wx,y:wy,t:-14};
 }else{
  SEAB.wp=null;
  goal={x:d.x,y:d.y,t:-14};
 }
 toast(t==='oasis'?'🏝️ Đang chèo về bến Ốc Đảo...':'⚓ Đang chèo về bến...')}
function boatTick(){
 if(!CV.boat||!SEAB.dock)return;
 const d=dockSpot(SEAB.dockTarget);
 if(SEAB.wp){
  if(Math.hypot(Pl.x-SEAB.wp.x,Pl.y-SEAB.wp.y)<18){SEAB.wp=null;goal={x:d.x,y:d.y,t:-14}}
  else if(!goal&&Pl.mv){SEAB.dock=0;SEAB.wp=null}
  return;
 }
 if(Math.hypot(Pl.x-d.x,Pl.y-d.y)<12)return landSea(SEAB.dockTarget);
 if(!goal){if(Pl.mv)SEAB.dock=0;else landSea(SEAB.dockTarget)}}   // tự lái tay → hủy cập bến; kẹt → lên bờ luôn
window.cvBoatTap=(wx,wy)=>{
 if(MAP!='bn')return pBT(wx,wy);
 if(!CV.boat)return;
 if(tcTap(wx,wy))return;   // bấm trúng hòm kho báu trôi → khui (nếu thuyền đủ gần)
 if(boatSolid(wx,wy)){
  if(nearOasisLand(wx,wy))return dockNow('oasis');
  if(nearMainLand(wx,wy))return dockNow('main');
  if(wx>SEA_LIM)return toast('🌊 Ngoài kia sóng lớn quá, không ra xa hơn được');
  return toast('🏝️ Có đảo nhỏ chắn đường — lái thuyền vòng qua nhé');
 }
 SEAB.dock=0;SEAB.wp=null;goal=null;fishHere()};   // bấm mặt nước = câu
function fishHere(){if(window.MQ)MQ.open({boat:CV.bk})}
window.cvLeave=()=>{if(DB)DB.style.display='none';SEAB.dock=0;SEAB.wp=null;
 if(MAP=='bn'&&CV.boat){const d=dockSpot(SEAB.at);CV.boat=0;CV.dock=null;Pl.x=SEAB.at==='oasis'?OPIER.x0+26:PIER.x1-26;Pl.y=d.y}
 CV.bk=0;return pLeave()};

// nút nổi ⚓ Cập bến (chỉ hiện khi đang ở trên thuyền)
let DB=null;
function hud(){
 if(!DB){DB=document.createElement('button');DB.textContent='⚓ Cập bến';
  DB.style.cssText='position:fixed;left:10px;top:54px;z-index:25;display:none;padding:7px 14px;font:800 13px Nunito,"Segoe UI",Arial,sans-serif;background:#fff6d0;border:2px solid #7a4a26;border-radius:8px;color:#3a2412;box-shadow:0 2px 0 #7a4a26;cursor:pointer';
  DB.onpointerdown=e=>{e.preventDefault();e.stopPropagation();dockNow()};document.body.appendChild(DB)}
 const show=(MAP=='bn'&&CV.boat&&!UI&&!SEAB.dock);
 DB.style.display=show?'block':'none';
 if(show){
  const do_=dockSpot('oasis'),dm=dockSpot('main');
  DB.textContent=(Math.hypot(Pl.x-do_.x,Pl.y-do_.y)<Math.hypot(Pl.x-dm.x,Pl.y-dm.y))?'🏝️ Cập bến Ốc Đảo':'⚓ Cập bến';
 }}

// VÙNG NƯỚC TỐI: thỉnh thoảng xuất hiện ngoài khơi (chỉ khi bạn đang ở trên thuyền), tồn tại ~100 giây
window.seaZoneHere=()=>{const z=ZN.z;if(!z||!CV.boat||MAP!='bn'||performance.now()>z.until)return null;return Math.hypot(Pl.x-z.x,Pl.y-z.y)<z.r-6?z:null};
function zoneTick(){
 const n=performance.now();
 if(ZN.z&&n>ZN.z.until){ZN.z=null;ZN.next=n+(45+Math.random()*60)*1000}
 if(!ZN.z&&CV.boat){
  if(!ZN.next)ZN.next=n+(15+Math.random()*20)*1000;
  if(n>=ZN.next){
   for(let k=0;k<40;k++){const x=PIER.x1+200+Math.random()*1350,y=190+Math.random()*700;
    if(!boatSolid(x,y)&&!boatSolid(x+80,y)&&!boatSolid(x-80,y)&&!boatSolid(x,y+60)&&!boatSolid(x,y-60)){ZN.z={x,y,r:96,t0:n,until:n+100000};toast('🌑 Vùng tối đã xuất hiện, câu ở đó sẽ nhận thêm quà');break}}
   if(!ZN.z)ZN.next=n+5000}}}
function zoneArrow(){ // mũi tên chỉ hướng vùng nước tối khi nó nằm ngoài màn hình
 const z=ZN.z;if(!z||!CV.boat||performance.now()>z.until)return;
 const sx=z.x-camX,sy=z.y-camY;if(sx>-z.r&&sx<vw+z.r&&sy>-z.r&&sy<vh+z.r)return;
 const dx=sx-vw/2,dy=sy-vh/2,k=Math.min((vw/2-16)/Math.abs(dx||1e-3),(vh/2-16)/Math.abs(dy||1e-3)),an=Math.atan2(dy,dx);
 cx.save();cx.translate(Math.round(camX+vw/2+dx*k),Math.round(camY+vh/2+dy*k));
 cx.fillStyle='rgba(8,24,60,.85)';cx.beginPath();cx.arc(0,0,9,0,6.283);cx.fill();
 cx.rotate(an);cx.fillStyle='#bfe8ff';cx.beginPath();cx.moveTo(12,0);cx.lineTo(4,-5);cx.lineTo(4,5);cx.fill();cx.restore()}

// ============================================================
//  TƯƠNG TÁC
// ============================================================

function bnSit(x,y,by){
 if(Pl.sit)return;if(ST.av.m>=0)ST.av.m=-1;
 Pl.x=+x;Pl.y=+y;Pl.by=+by;Pl.d=0;Pl.sit=2;Pl.st=0;Pl.nt=0;Pl.bn=1;goal=null;
 toast('🏖️ Ngồi nghỉ hóng gió trên Ốc Đảo... (di chuyển để đứng dậy)');
}
function bnAct(a){const p=a.split(':'),t=p[0];
 if(t=='chest')return chestClaim();
 if(t=='shop')return bnShop();   // vào Shop quái vật (Biển): nhắc 2 giây
 if(t=='sail')return sail(p[1]);
 if(t=='sit')return bnSit(p[1],p[2],p[3])}
window.bnShop=()=>bnShop();
const qvImg=()=>'<img src="'+QVI+'" style="width:15px;height:15px;vertical-align:-3px;image-rendering:pixelated">';
window.qvImg=qvImg;
window.bnBuy=k=>{const o=sbs();
 if(k=='mini'){if(o.mini)return;if((ST.xu|0)<SB_MINI)return toast('Không đủ Xu vàng! Cần '+fmtXu(SB_MINI)+' Xu');ST.xu-=SB_MINI;o.mini=1}
 else if(k=='swan'){if(o.swan)return;if((ST.qv|0)<SB_SWAN)return toast('Không đủ Xu quái vật! Cần '+fmtXu(SB_SWAN)+' Xu quái vật');ST.qv-=SB_SWAN;o.swan=1}
 else if(k=='bamboo'){if(o.bamboo)return;if((ST.qv|0)<SB_BAMBOO)return toast('Không đủ Xu quái vật! Cần '+fmtXu(SB_BAMBOO)+' Xu quái vật');ST.qv-=SB_BAMBOO;o.bamboo=1}
 else return;
 o.use=k;try{xuUp()}catch(e){}try{save()}catch(e){}
 toast('🎉 Đã mua '+BNAME[k]+' và trang bị luôn! Ra cầu tàu bấm RA BIỂN nhé');bnShop()};
window.bnEquip=k=>{const o=sbs();if(!BKIND[k]||!o[k])return;o.use=k;try{save()}catch(e){}toast('✅ Đã trang bị '+BNAME[k]);bnShop()};
// ---------- RƯƠNG: 1 giờ / lần, 10–40 xu quái vật, không cộng dồn (ST.rcT = lúc nhận gần nhất) ----------
const CH_CD=3600000,CH_MIN=10,CH_MAX=40,CH={fx:0};   // chỉnh thời gian chờ / số xu ở đây
const QVIM=new Image();QVIM.src=QVI;
function chestReady(){return Date.now()-(+ST.rcT||0)>=CH_CD}
function chestClaim(){if(!chestReady())return;const n=CH_MIN+Math.floor(Math.random()*(CH_MAX-CH_MIN+1));
 ST.rcT=Date.now();ST.qv=(ST.qv|0)+n;CH.fx=performance.now()+900;try{xuUp()}catch(e){}try{save()}catch(e){}toast('+'+n+' xu quái vật')}
// ============================================================
//  HÒM KHO BÁU TRÔI (ngoài biển, gần ốc đảo dừa) — mỗi ngày khui 1 lần, nhận 2–4 💎 kim cương
//  - Phải đang ở TRÊN THUYỀN, lái lại gần hòm (≤ TC_R px) rồi bấm vào hòm
//  - ST.tcD = ngày đã khui gần nhất ("năm-tháng-ngày" theo giờ máy). Sang ngày mới hòm tự trôi tới lại
//  - Muốn đổi: TC_AX/TC_AY = tâm quỹ đạo trôi • TC_MIN/TC_MAX = số kim cương • TC_R = khoảng cách khui
//  - Quỹ đạo nằm trong vùng thuyền đi được (x ≤ SEA_LIM=1300, không đè đảo/đá). Nếu đổi chỗ nhớ kiểm tra boatSolid
// ============================================================
const TC_AX=1230,TC_AY=264,TC_R=80,TC_MIN=2,TC_MAX=4,TC={dk:'',dn:0,fx:0};
function tcDay(){const n=performance.now();if(n>TC.dn){const d=new Date();TC.dk=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();TC.dn=n+20000}return TC.dk}
function tcReady(){return ST.tcD!==tcDay()}
function tcPos(t){return{x:Math.round(TC_AX+Math.sin(t*.21)*34+Math.sin(t*.09+1)*10),y:Math.round(TC_AY+Math.sin(t*.33)*9+Math.sin(t*.13)*3)}}
const mkFloatChest=open=>mk(56,44,(g,r)=>{
 E(r,'rgba(0,50,90,.25)',28,40,25,3);
 // bè gỗ nhỏ đỡ hòm
 r('#b8764a',6,33,44,5);r('#d6a66a',6,33,44,1);r('#8a5a30',16,33,1,5);r('#8a5a30',27,33,1,5);r('#8a5a30',38,33,1,5);r('#5e3f20',6,38,44,1);
 r('#e0584a',8,36,4,2);r('#fff6e0',44,36,4,2);   // dây buộc
 // thân hòm
 r('#5a3418',14,22,28,11);r('#7a4a26',15,23,26,3);r('#6b4220',14,26,28,7);r('#8a5a30',15,26,26,1);
 r('#ffd23f',14,22,3,11);r('#ffd23f',39,22,3,11);r('#c89a10',16,22,1,11);r('#c89a10',41,22,1,11);
 if(!open){
  // nắp đóng
  r('#5a3418',15,15,26,7);r('#7a4a26',17,14,22,2);r('#8a5a30',19,15,18,1);
  r('#ffd23f',15,15,3,7);r('#ffd23f',38,15,3,7);r('#ffd23f',17,14,22,1);r('#c89a10',15,21,26,1);
  r('#ffd23f',26,21,4,5);r('#c89a10',26,25,4,1);r('#3a2412',27,23,2,2)}
 else{
  // nắp mở bật ra sau + ánh vàng + kim cương
  r('#5a3418',16,7,24,6);r('#7a4a26',17,8,22,2);r('#ffd23f',16,7,24,1);r('#ffd23f',16,7,3,6);r('#ffd23f',37,7,3,6);
  r('#2a1408',15,19,26,4);r('#ffe27a',17,17,22,3);r('#fff3b0',20,17,8,1);
  for(const[x,y,c]of[[19,13,'#33d6ff'],[26,11,'#7fe8ff'],[33,14,'#33d6ff']]){r(c,x,y,4,4);r('#ffffff',x,y,1,1);r('#1486b0',x+1,y+3,2,1)}
  r('#ffd23f',24,23,5,4);r('#c89a10',24,26,5,1)}});
function tcGem(x,y){r('#7fe8ff',x-2,y-3,4,1);r('#33d6ff',x-3,y-2,6,2);r('#1aa6d6',x-2,y,4,1);r('#1486b0',x-1,y+1,2,1);r('#ffffff',x-2,y-2,1,1)}
function tcBuild(){
 const cl=outl(mkFloatChest(0)),op=outl(mkFloatChest(1));
 SEA.sp.push({by:TC_AY+22,d:()=>{
  const now=performance.now(),rdy=tcReady(),fxOn=TC.fx&&now<TC.fx;
  if(!rdy&&!fxOn)return;
  const t=tmNow(),p=tcPos(t);
  if(p.x<camX-60||p.x>camX+vw+60||p.y<camY-80||p.y>camY+vh+40)return;
  const bob=Math.round(Math.sin(t*2.1+1)*1.5),u=fxOn?1-(TC.fx-now)/1600:0;
  // gợn nước quanh hòm
  const a=(t*.8)%1;E(r,'rgba(235,250,255,'+(.4*(1-a)).toFixed(2)+')',p.x,p.y+3,Math.round(26+a*9),Math.round(3+a*2));
  cx.save();if(fxOn&&u>.6)cx.globalAlpha=Math.max(0,1-(u-.6)/.4);   // khui xong thì mờ dần rồi chìm
  cx.drawImage(fxOn?op:cl,p.x-29,p.y-41+bob+(fxOn&&u>.6?Math.round((u-.6)*20):0));cx.restore();
  if(rdy){ // kim cương nhảy lơ lửng + lấp lánh báo hòm chưa khui
   tcGem(p.x,p.y-48+Math.round(Math.sin(t*2.6)*2));
   for(let k=0;k<4;k++){const s=Math.sin(t*3+k*1.9);if(s>.4){const px=p.x-16+((k*9+Math.round(t*4))%32),py=p.y-34+(k*7%18);r('#ffffff',px,py,1,1);r('rgba(255,236,150,.9)',px-1,py,3,1);r('rgba(255,236,150,.9)',px,py-1,1,3)}}}
  if(fxOn){ // kim cương bắn lên
   for(let k=0;k<7;k++){const an=-1.57+(k-3)*.42,d=u*30+k%2*6;tcGem(Math.round(p.x+Math.cos(an)*d*.7),Math.round(p.y-26+Math.sin(an)*d-u*8))}}}})}
function tcTap(wx,wy){
 if(!tcReady())return false;
 const p=tcPos(tmNow());
 if(Math.hypot(wx-p.x,wy-(p.y-14))>30)return false;
 if(Math.hypot(Pl.x-p.x,Pl.y-p.y)>TC_R){toast('🧰 Hòm kho báu ở xa quá — lái thuyền lại gần rồi bấm vào hòm nhé');return true}
 tcClaim();return true}
function tcClaim(){
 if(!tcReady())return;
 const n=TC_MIN+Math.floor(Math.random()*(TC_MAX-TC_MIN+1));
 ST.tcD=tcDay();ST.dia=(ST.dia|0)+n;TC.fx=performance.now()+1600;
 try{xuUp()}catch(e){}try{save()}catch(e){}
 toast('🧰 Khui hòm kho báu! +'+n+' 💎 kim cương\nNgày mai hòm mới sẽ trôi tới nhé')}
function tcArrow(){ // mũi tên vàng chỉ hướng hòm khi nó nằm ngoài màn hình (chỉ khi đang ở trên thuyền)
 if(!CV.boat||MAP!='bn'||!tcReady())return;
 const p=tcPos(tmNow()),sx=p.x-camX,sy=p.y-camY;if(sx>-20&&sx<vw+20&&sy>-20&&sy<vh+20)return;
 const dx=sx-vw/2,dy=sy-vh/2,k=Math.min((vw/2-16)/Math.abs(dx||1e-3),(vh/2-16)/Math.abs(dy||1e-3)),an=Math.atan2(dy,dx);
 cx.save();cx.translate(Math.round(camX+vw/2+dx*k),Math.round(camY+vh/2+dy*k));
 cx.fillStyle='rgba(90,50,10,.88)';cx.beginPath();cx.arc(0,0,9,0,6.283);cx.fill();
 cx.rotate(an);cx.fillStyle='#ffd23f';cx.beginPath();cx.moveTo(12,0);cx.lineTo(4,-5);cx.lineTo(4,5);cx.fill();cx.restore()}
// ---------- ĐỒ BIỂN bán bằng Xu quái vật ----------
// t: 'k' kem chống nắng • 'h' tóc/nón • 's' set • 'a' phụ kiện cầm tay • k = khóa trong HAIRS/SETS/ACCS • p = GIÁ (xu quái vật)
// Cân bằng: câu ~10 phút ≈ 1.000 xu quái vật. Muốn đổi giá chỉ cần sửa số p.
const QSHOP=[
 {t:'k',n:'Kem chống nắng',p:10},
 {t:'d',k:'phuclac',n:'Phúc lạc dược',p:40},
 {t:'d',k:'bachthuc',n:'Bách thực dược',p:40},
 {t:'d',k:'toany',n:'Toàn ý dược',p:50},
 {t:'h',k:'hawaii',p:500},
 {t:'s',k:'hwm',p:900},
 {t:'s',k:'hwf',p:900},
 {t:'s',k:'duckm',p:3000},
 {t:'s',k:'duckf',p:3000},
 {t:'h',k:'luffy',p:1200},
 {t:'a',k:'starfish',p:3000},
 {t:'a',k:'octobub',p:3000},
 {t:'s',k:'vitvang',p:1000},      // Set Vịt vàng (nam nữ đều mặc) — hình vẽ: vitvang.js
 {t:'h',k:'duckhat',dh:'m',p:800},    // Mũ vịt vàng (Nam, tóc ngắn)
 {t:'h',k:'duckhat',dh:'f',p:800}];   // Mũ vịt vàng (Nữ, tóc dài)
const qArr=t=>t=='h'?HAIRS:t=='s'?SETS:ACCS;
const qItem=q=>{if(q.t=='k'||q.t=='d')return{n:q.n,i:-1};const A=qArr(q.t),i=A.findIndex(x=>x.k==q.k&&(!q.dh||x.dh==q.dh));return i<0?null:{n:A[i].n,i,it:A[i]}};
const qOwn=(q,m)=>q.t!='k'&&q.t!='d'&&(ST.own&&ST.own[q.t]||[]).includes(m.i);
const QBAG={h:'Túi › Tóc',s:'Túi › Set',a:'Túi › Phụ kiện',k:'Túi › Biển',d:'Túi › Biển'};
window.bnBuyItem=n=>{const q=QSHOP[n],m=q&&qItem(q);if(!m)return;
 if(qOwn(q,m))return toast('✓ Bạn đã có món này rồi');
 if((ST.qv|0)<q.p)return toast('Không đủ Xu quái vật! Cần '+fmtXu(q.p)+', bạn có '+fmtXu(ST.qv|0));
 ST.qv-=q.p;
 if(q.t=='k')ST.kcn=(ST.kcn|0)+1;
 else if(q.t=='d'){ST.pot=ST.pot||{};ST.pot[q.k]=(ST.pot[q.k]|0)+1}
 else{ST.own=ST.own||{};const a=ST.own[q.t]=ST.own[q.t]||[];if(!a.includes(m.i))a.push(m.i)}
 try{xuUp()}catch(e){}try{save()}catch(e){}
 toast('🎉 Đã mua '+m.n+' → '+QBAG[q.t]);bnShop()};
let BRAF=0;
function bnPrev(c,t){const q=QSHOP[+c.dataset.q],m=q&&qItem(q);if(!m)return;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 if(q.t=='k'||q.t=='d'){if(window.MQ)MQ.paint(g,q.t=='k'?100:MQ.potId(q.k),c);return}
 const A=ST.av||{},K=2;g.save();g.scale(K,K);const W=c.width/K,H=c.height/K;
 const d=q.t=='a'?(m.it.t=='pull'?3:0):[0,3,1,2][Math.floor(t/1.6)%4];
 drawAv(g,Math.round(W/2)-10,H-33+(q.t=='a'&&m.it.t=='float'?6:0),{d,a:t,mv:q.t=='a'?1:0,sit:0,hair:q.t=='h'?m.i:(A.h|0),set:q.t=='s'?m.i:(q.t=='h'?(window.nmSet?nmSet(A.s):(A.s|0)):(A.s|0)),e:A.e|0,acc:q.t=='a'?m.i:-1});
 g.restore()}
function bnAnim(){const cs=document.querySelectorAll('canvas.bsc');if(!cs.length||!UI){BRAF=0;return}const t=performance.now()/1000;cs.forEach(c=>bnPrev(c,t));BRAF=requestAnimationFrame(bnAnim)}
{const st=document.createElement('style');st.textContent=
 '.bnp{background:linear-gradient(#e6fbff,#fffbe8 55%,#fff3cf);border:2px solid #5ccbd6;border-radius:10px;padding:6px;margin-top:4px}'+
 '.bnmq{background:#160a2e;border:2px solid #ff4fa3;border-radius:6px;box-shadow:0 0 8px #ff4fa3,inset 0 0 8px rgba(255,79,163,.4);overflow:hidden;white-space:nowrap;padding:3px 0;margin-bottom:6px}'+
 '.bnmq span{display:inline-block;padding-left:100%;font-weight:900;font-size:13px;letter-spacing:.5px;color:#ffe94d;text-shadow:0 0 3px #ff9a2e,0 0 8px #ff4fa3;animation:bnmq 11s linear infinite}'+
 '@keyframes bnmq{from{transform:translateX(0)}to{transform:translateX(-100%)}}'+
 '.bnbal{display:flex;justify-content:center;gap:14px;margin:2px 0 6px;font-size:14px;color:#1d5a66}'+
 '.bnbal span{background:#fff;border:2px solid #9fe3ea;border-radius:14px;padding:2px 10px}'+
 '.bnh{margin:8px 0 5px;padding:4px 10px;font-weight:800;color:#fff;background:linear-gradient(90deg,#17b6c4,#46d9c4);border-radius:14px;text-shadow:0 1px 0 rgba(0,70,80,.5)}'+
 '.bnb2{display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
 '.bnbt{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 4px;background:linear-gradient(#ffffff,#e8f9ff);border:2px solid #7fd6e0;border-radius:10px;text-align:center}'+
 '.bnbt canvas{width:136px;height:96px;max-width:100%;image-rendering:pixelated;background:linear-gradient(#bfeaff,#e6f8ff 55%,#4fc3dc 55%,#2f9fc4);border-radius:8px;border:2px solid #9fe3ea}'+
 '.bnbt b{font-size:13px}.bnbt small{font-size:12px;color:#3a6a74}.bnbt .b{padding:3px 12px;font-size:12px}'+
 '.bsg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}'+
 '.bst{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 3px;background:linear-gradient(#ffffff,#fff4d2);border:2px solid #ffc86a;border-radius:10px;text-align:center}'+
 '.bst b{font-size:12px;line-height:1.15}.bst small{font-size:11px}'+
 'canvas.bsc{width:88px;height:96px;image-rendering:pixelated;background:linear-gradient(#cfeeff,#eaf7ff 66%,#f3dca4 66%);border-radius:8px}.bst .b{padding:3px 8px;font-size:12px}';
 document.head.appendChild(st)}
let BOATIM=null;
function boatIcons(){if(!BOATIM)BOATIM={mini:outl(mkBoat()),swan:outl(mkSwanIcon()),bamboo:outl(mkBambooIcon())};
 document.querySelectorAll('canvas.bnbi').forEach(c=>{const g=c.getContext('2d'),im=BOATIM[c.dataset.b];if(!im)return;g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);
  const k=Math.min(Math.floor(c.width/im.width),Math.floor(c.height/im.height))||1,tm=performance.now()/1000,bob=Math.round(Math.sin(tm*1.8)*1.5);
  const ox=Math.round((c.width-im.width*k)/2),oy=Math.round(c.height-im.height*k-4+bob);
  g.drawImage(im,ox,oy,im.width*k,im.height*k);
  if(c.dataset.b=='bamboo'){const R=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(ox+x*k,oy+y*k,w*k,h*k)};bambooGlow(R,29,31,tm);bambooFlies(R,29,31,tm)}})}
function bnAnim2(){const cs=document.querySelectorAll('canvas.bnbi');if(!cs.length||!UI){BIRAF=0;return}boatIcons();BIRAF=requestAnimationFrame(bnAnim2)}
let BIRAF=0;
function bnShop(){
 const o=sbs();
 const B=[['mini','Thuyền mini',fmtXu(SB_MINI)+' 🪙',o.mini],['swan','Thuyền thiên nga',fmtXu(SB_SWAN)+' '+qvImg(),o.swan],['bamboo','Thuyền tre đom đóm',fmtXu(SB_BAMBOO)+' '+qvImg(),o.bamboo]];
 const tile=(q,n)=>{const m=qItem(q);if(!m)return '';const own=qOwn(q,m);
  return '<div class="bst"><canvas class="bsc" data-q="'+n+'" width="88" height="96"></canvas><b>'+m.n+'</b>'+
   (own?'<small>✓ Đã có</small>':'<small>'+qvImg()+' <b>'+fmtXu(q.p)+'</b>'+(q.t=='k'&&(ST.kcn|0)>0?' • có x'+(ST.kcn|0):'')+(q.t=='d'&&((ST.pot||{})[q.k]|0)>0?' • có x'+(ST.pot[q.k]|0):'')+'</small><button class="b" onclick="bnBuyItem('+n+')">Mua</button>')+'</div>'};
 openUI(head('🎣 Shop quái vật')+'<div class="bnp">'+
  '<div class="bnmq"><span>★ BÁN THUYỀN &amp; THU MUA QUÁI VẬT ★ &nbsp; ★ CẦN CÂU • KEM CHỐNG NẮNG • ĐỒ BIỂN ★</span></div>'+
  '<div class="bnbal"><span>🪙 <b>'+fmtXu(ST.xu|0)+'</b></span><span>'+qvImg()+' <b>'+fmtXu(ST.qv|0)+'</b></span></div>'+
  '<button class="b w" style="font-size:14px;padding:9px" onclick="MQ.sellUI()">💰 Thu mua quái vật</button>'+
  (window.MQ&&MQ.rodBroken&&MQ.rodBroken()?'<button class="b w" style="font-size:14px;padding:9px" onclick="MQ.repair();bnShop()">🔧 Sửa cần câu • '+qvImg()+' '+MQ.rodFix+'</button>':'')+
  '<div class="bnh">⛵ Thuyền</div>'+
  '<div class="bnb2">'+B.map(b=>{const k=b[0],own=b[3],eq=o.use==k;
   return '<div class="bnbt"><canvas class="bnbi" data-b="'+k+'" width="136" height="96"></canvas><b>'+b[1]+'</b>'+(own?'':'<small>'+b[2]+'</small>')+
    (own?(eq?'<b style="color:#1a9a5a">✅ Đang dùng</b>':'<button class="b" onclick="bnEquip(\''+k+'\')">Trang bị</button>'):'<button class="b" onclick="bnBuy(\''+k+'\')">Mua</button>')+'</div>'}).join('')+'</div>'+
  '<div class="bnh">🛍️ Đồ biển</div>'+
  '<div class="bsg">'+QSHOP.map(tile).join('')+'</div></div>');
 boatIcons();if(!BIRAF)BIRAF=requestAnimationFrame(bnAnim2);
 if(!BRAF)BRAF=requestAnimationFrame(bnAnim)}
})();
