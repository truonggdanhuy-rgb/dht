/* ============================================================
   BIỂN — map online thứ 3 (dùng chung hệ thống mạng với Công viên / Phố xá)
   - Bãi biển nhỏ ở góc TRÁI màn hình lúc mới vào, còn lại là mặt biển rất rộng
   - Shop quái vật (biển hiệu to) + NPC bạch tuộc đứng rao "Đồ câu quái vật đây!"
   - Xu quái vật (ST.qv) = đơn vị tiền tệ mới, hiện ở panel avatar góc phải
   - RA KHƠI bằng THUYỀN: Thuyền mini (1.000 xu vàng) / Thuyền thiên nga (xu quái vật) — bán ở Shop quái vật
   - CHỈ câu được khi đang đứng trên thuyền ngoài biển (không câu trên cầu tàu / bãi cát)
   - Thỉnh thoảng có VÙNG NƯỚC TỐI: câu ở đó dính quái có 15% nhận thêm 1 vé quay hoặc 1 món ăn từ máy chế biến
   - Rương kho báu: mỗi 1 giờ nhận 10–40 xu quái vật (không cộng dồn)
   - Decor: vỏ sò, sao biển, cua, cọc phao, dừa, dù che nắng, hải âu, thuyền buồm xa xa
   ============================================================ */
(()=>{
'use strict';
const SW=3200,SH=1100,CV=window.CV;
const SEA={sp:[],hits:[],lb:[],seats:[],horses:[],tbls:[],pos:{x:96,y:446},fx:null,built:0,bg:null};
(window.CVMAPS=window.CVMAPS||{}).bn={d:SEA,w:SW,h:SH};
SEA.fx=seaFx;   // gán NGAY khi đăng ký map (trước đây gán trong build() → lần vào Biển đầu tiên bị mất hải âu / thoại bạch tuộc)
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
const BW=70;   // độ nới rộng bãi cát (px). Muốn bãi rộng/hẹp hơn thì sửa số này
const shoreX=y=>{const t=Math.max(0,Math.min(1,(y-330)/160)),s=t*t*(3-2*t);   // bãi ~170px ở chỗ nhân vật xuất hiện, nở ra thành vịnh nhỏ ở chỗ tiệm
 return BW+168-70*s+9*Math.sin(y/70)+4*Math.sin(y/23+1.3)+50*Math.exp(-(((y-800)/85)**2))};
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
 const wm='🌊 Mặt biển — phải LÊN THUYỀN mới câu được! Ra cuối cầu tàu, bấm "RA BIỂN" nhé.',hw=(x,y,w,h)=>hit(x,y,w,h,wm);
 for(let y=0;y<SH;y+=60){const y1=y+60,sx=Math.round(shoreX(y+30))+16;
  if(y1>PIER.y0-2&&y<PIER.y1+4){
   if(y<PIER.y0-2)hw(sx,y,SW,PIER.y0-2-y);
   hw(PIER.x1+4,Math.max(y,PIER.y0-2),SW,Math.min(y1,PIER.y1+4)-Math.max(y,PIER.y0-2));
   if(y1>PIER.y1+4)hw(sx,PIER.y1+4,SW,y1-PIER.y1-4)}
  else hw(sx,y,SW,60)}
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
  // --- cầu tàu + bến thuyền: bấm RA BIỂN để lên thuyền của bạn ---
 {const ex=PIER.x1,my=Math.round((PIER.y0+PIER.y1)/2),SG=[ex-40,my];
  put(mkSignPost(),ex-14,PIER.y0-4,[ex-30,PIER.y0-8,ex-2,PIER.y0-2]);
  hit(ex-44,PIER.y0-70,56,68,'⛵ Bến thuyền — bấm để RA BIỂN','cv:bn:sail',SG);
  const bm=mkBoat(),bo=outl(bm);dyn(PIER.y1+22,()=>{if(CV.boat)return;const t=tmNow(),bb=Math.round(Math.sin(t*1.6)*1);cx.drawImage(bo,Math.round(ex-84)-1,PIER.y1+4+bb-1)});
  hit(ex-84,PIER.y1+4,64,26,'⛵ Thuyền buộc ở bến — bấm để RA BIỂN','cv:bn:sail',SG);
  dyn(PIER.y1+300,()=>{if(CV.boat||camX>ex+120||camX+vw<ex-200)return;const tm=tmNow(),bx=ex-14,by=PIER.y0-86+Math.round(Math.sin(tm*2.4)*2),t='⛵ RA BIỂN';
   cx.save();cx.font='800 9px Nunito, sans-serif';cx.textAlign='center';const w=Math.round(cx.measureText(t).width)+16;
   cx.fillStyle='#0d6a76';cx.fillRect(bx-(w>>1)-1,by-10,w+2,16);cx.fillStyle='#e8fbff';cx.fillRect(bx-(w>>1),by-9,w,14);
   cx.fillStyle='#0d6a76';cx.fillRect(bx-3,by+6,6,2);cx.fillRect(bx-1,by+8,2,2);cx.fillText(t,bx,by+2);cx.restore()});
  hit(ex-44,PIER.y0-98,60,24,'⛵ Bấm để RA BIỂN','cv:bn:sail',SG)}
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
 // --- thả phao + đá ngoài biển + thuyền buồm xa xa + đảo nhỏ ---
 for(const[x,y]of[[560,300],[640,640],[900,860],[820,180],[1250,470],[1500,760],[1800,300],[2100,640],[2500,420],[2750,880]]){const bo=outl(mkBuoy()),ph=x*.013;dyn(y,()=>{const t=tmNow();cx.drawImage(bo,x-8,Math.round(y-18+Math.sin(t*1.7+ph)*1.5));
  const a=.18+.12*Math.sin(t*1.7+ph);r('rgba(255,255,255,'+a.toFixed(2)+')',x-8,y+1,16,1)});hit(x-9,y-20,18,22,'🔴 Phao tiêu — đánh dấu luồng biển')}
 // --- đảo nhỏ có dừa (thay cho ghềnh đá cũ; chỉ là vật cản, không bấm được) ---
 {const ik=mkIslet();BROCK.forEach(([x,y,w,h],i)=>{const cx0=Math.round(x+w/2),cy0=Math.round(y+h/2)+2,ph=i*1.7;
  dyn(cy0-6,()=>{const t=tmNow(),a=.35+.2*Math.sin(t*1.8+ph);
   cx.drawImage(ik,cx0-46,cy0-34);r('rgba(255,255,255,'+a.toFixed(2)+')',cx0-44,cy0+12,88,1);r('rgba(255,255,255,'+(a*.6).toFixed(2)+')',cx0-48,cy0+14,96,1)});
  put(mkPalm(i%2?-.3:.3),cx0-4,cy0+3)})}
 for(const[x,y,sp,ph]of[[1300,600,5,0],[2200,300,4,60],[2700,700,3,120]]){const m=mkSail(),o=outl(m);dyn(y+34,()=>{const t=tmNow(),px=x+((t*sp+ph*10)%520)-260;cx.drawImage(o,Math.round(px),Math.round(y+Math.sin(t*1.2+x)*1.2))})}
 for(const[x,y]of[[1900,150],[1000,980]])put(mkIsle(),x+60,y+56);
 for(const[x,y,l]of[[1946,128,.3],[1030,950,-.3]])put(mkPalm(l),x,y+36);
 SEA.fx=seaFx;
 // sóng lấp lánh trên mặt biển
 for(let i=0;i<520;i++)SPK.push({x:shoreX(100)+60+rn()*(SW-420),y:rn()*SH,ph:rn()*6.3});
 for(let i=0;i<14;i++)GULL.push({y:60+rn()*(SH-120),sp:20+rn()*18,ph:rn()*SW,dir:rn()<.5?1:-1,fl:rn()*6});
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
 boatTick();zoneTick();hud();zoneArrow();
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
 Pl.x=SEA.pos.x;Pl.y=SEA.pos.y;Pl.d=1;CV.seat=-1;CV.hz=-1;CV.boat=0;CV.bk=0;CV.dock=null;SEAB.dock=0;ZN.z=null;ZN.next=0;
 toast('🌊 Chào mừng tới Biển! Ra cuối cầu tàu, bấm RA BIỂN để lên thuyền rồi mới câu quái vật được nhé');
 if(window.PKO)PKO.onEnter()};
window.cvSolid=(x,y)=>MAP=='bn'?bnSolid(x,y):pSolid(x,y);
const pLeave=window.cvLeave,pBS=window.cvBoatSolid,pBT=window.cvBoatTap,pBM=window.cvBoatMe;
window.cvAct=(a,h)=>a.startsWith('bn:')?bnAct(a.slice(3),h):pAct(a,h);

// ============================================================
//  THUYỀN RA BIỂN
//  ST.boats = {mini:0/1, swan:0/1, use:'mini'|'swan'}  (tự lưu cùng ST; KHÔNG dùng ST.sb vì Làng Tuyết đã dùng cho huy hiệu)
//  Thuyền mini: 1.000 xu vàng (ST.xu) • Thuyền thiên nga: xu quái vật (ST.qv)
//  Muốn đổi giá: sửa SB_MINI / SB_SWAN ngay dưới đây.
// ============================================================
const SB_MINI=1000,SB_SWAN=3000;   // swan ≈ 15–30 phút câu liên tục
const SEAB={dock:0},ZN={z:null,next:0};
const sbs=()=>{const o=ST.boats=(ST.boats&&typeof ST.boats=='object')?ST.boats:{};o.mini=o.mini?1:0;o.swan=o.swan?1:0;
 if(!(o.use=='mini'&&o.mini)&&!(o.use=='swan'&&o.swan))o.use=o.swan?'swan':o.mini?'mini':'';return o};
const BROCK=[[700,520,60,36],[1150,250,70,40],[1450,950,64,38],[2000,420,70,40],[2350,820,60,34]],BISLE=[[1900,150],[1000,980]];
const nearLand=(x,y)=>x<shoreX(y)+36||(x<=PIER.x1+10&&y>=PIER.y0-12&&y<=PIER.y1+34);
const boatSolid=(x,y)=>{
 if(nearLand(x,y)||x>SW-24||y<30||y>SH-30)return true;
 for(const b of BROCK)if(x>b[0]-18&&x<b[0]+b[2]+18&&y>b[1]-14&&y<b[1]+b[3]+16)return true;
 for(const q of BISLE)if(Math.hypot((x-q[0]-60)/72,(y-q[1]-40)/26)<1)return true;
 return false};
const dockSpot=()=>({x:PIER.x1+44,y:Math.round((PIER.y0+PIER.y1)/2)});
const mirror=(x,dir,fn)=>{cx.save();cx.translate(x,0);if(dir<0)cx.scale(-1,1);cx.translate(-x,0);fn();cx.restore()};

// cần câu cắm bên cạnh mạn thuyền (chỉ để trang trí — không có món "cần câu")
function seaRod(x,yy,dir,tm){mirror(x,dir,()=>{
 const bx=x-9,by=yy-5,tx=x-26,ty=yy-33,bo=Math.round(Math.sin(tm*3+x));
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
window.cvBoatKind=k=>k==2?miniSea:k==3?swanSea:null;   // người chơi khác nhìn thấy đúng loại thuyền
window.cvBoatSolid=(x,y)=>MAP=='bn'?boatSolid(x,y):pBS(x,y);
window.cvBoatMe=()=>{if(MAP!='bn')return pBM();const A=ST.av,tm=performance.now()/1000;(CV.bk==3?swanSea:miniSea)(Math.round(Pl.x),Math.round(Pl.y),CV.bdir||1,tm,Pl.mv,window.cvBoatRider(A.s,A.h,A.e,A.a,CV.bdir||1))};

// lên thuyền / cập bến
function noBoatUI(){openUI(head('⛵ Bến thuyền')+'<div class="mut" style="text-align:center">🐙 <i>"Chưa có thuyền thì chưa ra biển được nha! Ghé tiệm tôi mua Thuyền mini giá '+fmtXu(SB_MINI)+' xu vàng đi~"</i></div><button class="b w" style="font-size:14px;padding:9px" onclick="bnShop()">🛒 Tới Shop quái vật mua thuyền</button>')}
function sail(){
 if(CV.boat||MAP!='bn'||Pl.sit||CVLOCK||CV.seat>=0||CV.hz>=0)return;
 const o=sbs();if(!o.use)return noBoatUI();
 if(ST.av.m>=0){ST.av.m=-1;toast('🐃 Bạn xuống khỏi thú cưỡi để lên thuyền')}
 try{if(ACT&&typeof actStop=='function')actStop()}catch(e){}
 if(window.MQ)MQ.clear();
 const d=dockSpot();
 CV.boat=1;CV.bk=o.use=='swan'?3:2;CV.bdir=1;CV.dock=null;SEAB.dock=0;Pl.x=d.x;Pl.y=d.y;Pl.d=3;Pl.mv=0;Pl.pend=0;goal=null;pa=null;
 if(window.PKO)PKO.onBoat();
 toast('⛵ Bấm giữ mặt nước để di chuyển')}
function landSea(){
 const d=dockSpot();CV.boat=0;CV.bk=0;CV.dock=null;SEAB.dock=0;
 Pl.x=PIER.x1-26;Pl.y=d.y;Pl.d=2;Pl.mv=0;goal=null;pa=null;
 if(window.PKO)PKO.onBoat();toast('⚓ Đã cập bến — bạn bước lên cầu tàu')}
function dockNow(){if(!CV.boat||MAP!='bn')return;const d=dockSpot();SEAB.dock=1;goal={x:d.x,y:d.y,t:-14};Pl.pend=0;toast('⚓ Đang chèo về bến...')}
function boatTick(){
 if(!CV.boat||!SEAB.dock)return;
 const d=dockSpot();if(Math.hypot(Pl.x-d.x,Pl.y-d.y)<9)return landSea();
 if(!goal){if(Pl.mv)SEAB.dock=0;else landSea()}}   // tự lái tay → hủy cập bến; kẹt → lên bờ luôn
window.cvBoatTap=(wx,wy)=>{
 if(MAP!='bn')return pBT(wx,wy);
 if(!CV.boat)return;
 if(boatSolid(wx,wy)){if(nearLand(wx,wy))return dockNow();return toast('🏝️ Có đảo nhỏ chắn đường — lái thuyền vòng qua nhé')}
 SEAB.dock=0;goal=null;fishHere()};   // bấm mặt nước = câu
function fishHere(){if(window.MQ)MQ.open({boat:CV.bk})}
window.cvLeave=()=>{if(DB)DB.style.display='none';SEAB.dock=0;
 if(MAP=='bn'&&CV.boat){const d=dockSpot();CV.boat=0;CV.dock=null;Pl.x=PIER.x1-26;Pl.y=d.y}
 CV.bk=0;return pLeave()};

// nút nổi ⚓ Cập bến (chỉ hiện khi đang ở trên thuyền)
let DB=null;
function hud(){
 if(!DB){DB=document.createElement('button');DB.textContent='⚓ Cập bến';
  DB.style.cssText='position:fixed;left:10px;top:54px;z-index:25;display:none;padding:7px 14px;font:800 13px Nunito,"Segoe UI",Arial,sans-serif;background:#fff6d0;border:2px solid #7a4a26;border-radius:8px;color:#3a2412;box-shadow:0 2px 0 #7a4a26;cursor:pointer';
  DB.onpointerdown=e=>{e.preventDefault();e.stopPropagation();dockNow()};document.body.appendChild(DB)}
 DB.style.display=(MAP=='bn'&&CV.boat&&!UI&&!SEAB.dock)?'block':'none'}

// VÙNG NƯỚC TỐI: thỉnh thoảng xuất hiện ngoài khơi (chỉ khi bạn đang ở trên thuyền), tồn tại ~100 giây
window.seaZoneHere=()=>{const z=ZN.z;if(!z||!CV.boat||MAP!='bn'||performance.now()>z.until)return null;return Math.hypot(Pl.x-z.x,Pl.y-z.y)<z.r-6?z:null};
function zoneTick(){
 const n=performance.now();
 if(ZN.z&&n>ZN.z.until){ZN.z=null;ZN.next=n+(45+Math.random()*60)*1000}
 if(!ZN.z&&CV.boat){
  if(!ZN.next)ZN.next=n+(15+Math.random()*20)*1000;
  if(n>=ZN.next){
   for(let k=0;k<40;k++){const x=PIER.x1+200+Math.random()*1000,y=190+Math.random()*700;
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

function bnAct(a){const t=a.split(':')[0];
 if(t=='chest')return chestClaim();
 if(t=='shop')return bnShop();
 if(t=='sail')return sail()}
window.bnShop=()=>bnShop();
const qvImg=()=>'<img src="'+QVI+'" style="width:15px;height:15px;vertical-align:-3px;image-rendering:pixelated">';
window.qvImg=qvImg;
window.bnBuy=k=>{const o=sbs();
 if(k=='mini'){if(o.mini)return;if((ST.xu|0)<SB_MINI)return toast('Không đủ Xu vàng! Cần '+fmtXu(SB_MINI)+' Xu');ST.xu-=SB_MINI;o.mini=1}
 else if(k=='swan'){if(o.swan)return;if((ST.qv|0)<SB_SWAN)return toast('Không đủ Xu quái vật! Cần '+fmtXu(SB_SWAN)+' Xu quái vật');ST.qv-=SB_SWAN;o.swan=1}
 else return;
 o.use=k;try{xuUp()}catch(e){}try{save()}catch(e){}
 toast('🎉 Đã mua '+(k=='swan'?'Thuyền thiên nga':'Thuyền mini')+' và trang bị luôn! Ra cầu tàu bấm RA BIỂN nhé');bnShop()};
window.bnEquip=k=>{const o=sbs();if(!o[k])return;o.use=k;try{save()}catch(e){}toast('✅ Đã trang bị '+(k=='swan'?'Thuyền thiên nga':'Thuyền mini'));bnShop()};
// ---------- RƯƠNG: 1 giờ / lần, 10–40 xu quái vật, không cộng dồn (ST.rcT = lúc nhận gần nhất) ----------
const CH_CD=3600000,CH_MIN=10,CH_MAX=40,CH={fx:0};   // chỉnh thời gian chờ / số xu ở đây
const QVIM=new Image();QVIM.src=QVI;
function chestReady(){return Date.now()-(+ST.rcT||0)>=CH_CD}
function chestClaim(){if(!chestReady())return;const n=CH_MIN+Math.floor(Math.random()*(CH_MAX-CH_MIN+1));
 ST.rcT=Date.now();ST.qv=(ST.qv|0)+n;CH.fx=performance.now()+900;try{xuUp()}catch(e){}try{save()}catch(e){}toast('+'+n+' xu quái vật')}
// ---------- ĐỒ BIỂN bán bằng Xu quái vật ----------
// t: 'k' kem chống nắng • 'h' tóc/nón • 's' set • 'a' phụ kiện cầm tay • k = khóa trong HAIRS/SETS/ACCS • p = GIÁ (xu quái vật)
// Cân bằng: câu ~10 phút ≈ 1.000 xu quái vật. Muốn đổi giá chỉ cần sửa số p.
const QSHOP=[
 {t:'k',n:'Kem chống nắng',p:10},
 {t:'h',k:'hawaii',p:500},
 {t:'s',k:'hwm',p:900},
 {t:'s',k:'hwf',p:900},
 {t:'s',k:'duckm',p:3000},
 {t:'s',k:'duckf',p:3000},
 {t:'h',k:'luffy',p:1200},
 {t:'a',k:'starfish',p:3000},
 {t:'a',k:'octobub',p:3000}];
const qArr=t=>t=='h'?HAIRS:t=='s'?SETS:ACCS;
const qItem=q=>{if(q.t=='k')return{n:q.n,i:-1};const A=qArr(q.t),i=A.findIndex(x=>x.k==q.k);return i<0?null:{n:A[i].n,i,it:A[i]}};
const qOwn=(q,m)=>q.t!='k'&&(ST.own&&ST.own[q.t]||[]).includes(m.i);
const QBAG={h:'Túi › Tóc',s:'Túi › Set',a:'Túi › Phụ kiện',k:'Túi › Biển'};
window.bnBuyItem=n=>{const q=QSHOP[n],m=q&&qItem(q);if(!m)return;
 if(qOwn(q,m))return toast('✓ Bạn đã có món này rồi');
 if((ST.qv|0)<q.p)return toast('Không đủ Xu quái vật! Cần '+fmtXu(q.p)+', bạn có '+fmtXu(ST.qv|0));
 ST.qv-=q.p;
 if(q.t=='k')ST.kcn=(ST.kcn|0)+1;
 else{ST.own=ST.own||{};const a=ST.own[q.t]=ST.own[q.t]||[];if(!a.includes(m.i))a.push(m.i)}
 try{xuUp()}catch(e){}try{save()}catch(e){}
 toast('🎉 Đã mua '+m.n+' → '+QBAG[q.t]);bnShop()};
let BRAF=0;
function bnPrev(c,t){const q=QSHOP[+c.dataset.q],m=q&&qItem(q);if(!m)return;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 if(q.t=='k'){if(window.MQ)MQ.paint(g,100,c);return}
 const A=ST.av||{},K=2;g.save();g.scale(K,K);const W=c.width/K,H=c.height/K;
 const d=q.t=='a'?(m.it.t=='pull'?3:0):[0,3,1,2][Math.floor(t/1.6)%4];
 drawAv(g,Math.round(W/2)-10,H-33+(q.t=='a'&&m.it.t=='float'?6:0),{d,a:t,mv:q.t=='a'?1:0,sit:0,hair:q.t=='h'?m.i:(A.h|0),set:q.t=='s'?m.i:(A.s|0),e:A.e|0,acc:q.t=='a'?m.i:-1});
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
function boatIcons(){if(!BOATIM)BOATIM={mini:outl(mkBoat()),swan:outl(mkSwanIcon())};
 document.querySelectorAll('canvas.bnbi').forEach(c=>{const g=c.getContext('2d'),im=BOATIM[c.dataset.b];if(!im)return;g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);
  const k=Math.min(Math.floor(c.width/im.width),Math.floor(c.height/im.height))||1,tm=performance.now()/1000,bob=Math.round(Math.sin(tm*1.8)*1.5);
  g.drawImage(im,Math.round((c.width-im.width*k)/2),Math.round(c.height-im.height*k-4+bob),im.width*k,im.height*k)})}
function bnAnim2(){const cs=document.querySelectorAll('canvas.bnbi');if(!cs.length||!UI){BIRAF=0;return}boatIcons();BIRAF=requestAnimationFrame(bnAnim2)}
let BIRAF=0;
function bnShop(){
 const o=sbs();
 const B=[['mini','Thuyền mini',fmtXu(SB_MINI)+' 🪙',o.mini],['swan','Thuyền thiên nga',fmtXu(SB_SWAN)+' '+qvImg(),o.swan]];
 const tile=(q,n)=>{const m=qItem(q);if(!m)return '';const own=qOwn(q,m);
  return '<div class="bst"><canvas class="bsc" data-q="'+n+'" width="88" height="96"></canvas><b>'+m.n+'</b>'+
   (own?'<small>✓ Đã có</small>':'<small>'+qvImg()+' <b>'+fmtXu(q.p)+'</b>'+(q.t=='k'&&(ST.kcn|0)>0?' • có x'+(ST.kcn|0):'')+'</small><button class="b" onclick="bnBuyItem('+n+')">Mua</button>')+'</div>'};
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
