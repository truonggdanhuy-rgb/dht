/* ============================================================
   LÀNG TUYẾT — mở rộng ngang (640×432)
   • Quán trà tuyết (sạp trang trí, không bấm được): vòng nguyệt quế,
     dây quả thông mini, bảng hiệu neon kiểu Hong Kong
   • Góc 2 ghế ấm cúng + dây neon dài + hoa tuyết neon
   • Ông già Noel + tuần lộc chở hàng: mỗi ngày nhận 1 Huy hiệu tuyết,
     bấm lần nữa mở Panel (gian hàng quy đổi: coming soon)
   Chạy sau script chính (dùng lại r, E, mk, outl, ZZ, OL, deer, wbk, WT...)
   ============================================================ */
(function(){
const hsh=(a,b)=>{let h=Math.imul((a|0)*374761393+(b|0)*668265263+7,1274126177);h=Math.imul(h^h>>>13,1103515245);return((h^h>>>16)>>>0)/4294967296};
const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+Math.max(0,a).toFixed(2)+')';
let DX=110;/* dời cả cụm bên phải sang phải DX px cho thoáng */
const wbkp=(x0,y0,x1,y1)=>wbr(x0+DX,y0,x1+DX,y1);
const _sp=WT.sp.push.bind(WT.sp),_ht=WT.hits.push.bind(WT.hits),_lb=WT.lb.push.bind(WT.lb);
const SP={push:o=>{const dx=DX,d=o.d;return _sp({by:o.by,d:()=>{cx.save();cx.translate(dx,0);d();cx.restore()}})}};
const HT={push:h=>{const dx=DX;h=h.slice();h[0]+=dx;if(h[6])h[6]=[h[6][0]+dx,h[6][1]];return _ht(h)}};
const LBL={push:l=>_lb([l[0],l[1]+DX,l[2]])};
const snowBlob=(r,x,y,w)=>{for(let i=0;i<w;i++){const h=1+Math.round(1.2*Math.abs(Math.sin(i/3.1+x))+.6*Math.sin(i*1.7));r('#f4f9ff',x+i,y-h,1,h+1);r('#cfe0f5',x+i,y+1,1,1)}};

/* ====================== 1) QUÁN TRÀ TUYẾT ====================== */
const SX=364,SBY=164,SY=SBY-96,CXM=SX+56;           // sprite 112×96, đáy = 164
const swag=(x,x0,x1)=>40+Math.round(7*Math.sin(Math.PI*(x-x0)/(x1-x0)));
const garlandY=x=>x<56?swag(x,8,56):swag(x,56,104);
const CONES=[14,26,38,50,62,74,86,98];
const BEADS=[];for(let x=11;x<104;x+=6)BEADS.push(x);
const stallI=outl(mk(112,96,(g,r)=>{
 // vách sau + kệ
 r('#3b2414',10,30,92,54);for(let x=14;x<100;x+=8)r('#2c1a0e',x,30,1,54);
 r('#2a1a10',13,38,86,26);
 for(const y of[50,64]){r('#8a5a30',12,y,88,2);r('#5a3418',12,y+2,88,1)}
 const pot=(x,y,c,l)=>{E(r,c,x+4,y-3,4,3);E(r,l,x+3,y-4,2,1);r(c,x+9,y-4,2,1);r(c,x+10,y-5,1,1);r(c,x-1,y-4,1,3);r('#e8d8b0',x+3,y-7,3,1);r('#e8d8b0',x+4,y-8,1,1)};
 pot(18,50,'#c0392b','#ff8a7a');pot(40,50,'#2f6f9a','#8fd0ff');pot(70,50,'#3f8a4a','#9be070');pot(88,50,'#d9a521','#ffe27a');
 for(let i=0;i<6;i++){r(i%2?'#f4f1e6':'#9fd0e8',30+i*5,47,3,3);r('#6b4220',30+i*5,50,3,1)}
 for(const[x,c]of[[20,'#bfe4ff'],[30,'#ffd0a0'],[56,'#d9f0c0'],[66,'#ffc0d0'],[78,'#bfe4ff'],[90,'#ffd0a0']]){r(c,x,56,6,8);r('rgba(255,255,255,.5)',x+1,57,1,6);r('#8a5a30',x,55,6,1)}
 // cột
 for(const x of[5,101]){r('#6b4220',x,22,7,62);r('#8a5a30',x,22,2,62);r('#4a2c14',x+5,22,2,62);snowBlob(r,x-2,22,11)}
 // quầy
 r('#8a5a30',4,72,104,12);r('#6b4220',4,83,104,1);
 for(let x=9;x<100;x+=22){r('#6b4220',x,74,18,8);r('#7a4a26',x+1,75,16,6);r('#a8703c',x+1,75,16,1)}
 r('#c99660',2,67,108,5);r('#e0b078',2,67,108,1);r('#8a5a30',2,71,108,1);
 snowBlob(r,3,66,106);
 // ấm đồng + cốc
 r('#7a4a26',14,57,12,10);r('#c9852e',14,57,12,2);r('#e8a840',15,59,3,8);r('#9a6a1e',22,59,3,8);r('#7a4a26',26,60,4,1);r('#7a4a26',12,58,2,5);r('#5a3418',18,55,4,2);
 for(const x of[44,52,60]){r('#f4f1e6',x,61,5,6);r('#fff',x,61,2,6);r('#c0392b',x,63,5,1);r('#f4f1e6',x+5,62,1,3)}
 r('#d9a566',80,61,16,6);r('#b8814a',80,64,16,3);for(let i=0;i<4;i++)E(r,'#8a5a30',83+i*4,60,2,1);
 // mái: cân đối, ngói đỏ, tuyết phủ
 for(let i=0;i<24;i++){const w=Math.round(20+i*1.75),x0=Math.max(0,56-w),x1=Math.min(112,56+w);
  r(i%4==3?'#8f1f18':i%2?'#b32a22':'#c63a2e',x0,6+i,x1-x0,1);r('#e0584a',x0,6+i,Math.min(8,x1-x0),1);r('#8f1f18',x1-6,6+i,6,1)}
 for(let i=0;i<6;i++){const w=Math.round(19+i*1.7);r(i?'#e6eefa':'#ffffff',56-w,5+i,w*2,1);r('#c3d5ec',56-w,5+i,Math.max(2,w>>2),1);r('#c3d5ec',56+w-3,5+i,3,1)}
 // diềm mái sọc đỏ trắng + răng cưa
 for(let x=0;x<112;x+=8){const c=(x/8)%2?'#ffffff':'#d9302a';r(c,x,26,8,9);E(r,c,x+4,35,4,2);r('rgba(0,0,0,.12)',x,26,8,1)}
 snowBlob(r,0,26,112);
 // vòng nguyệt quế
 const wx=56,wy=17;for(let a=0;a<28;a++){const t=a/28*6.283,x=wx+Math.cos(t)*8,y=wy+Math.sin(t)*8;E(r,'#1f6a3a',x,y,3,2);E(r,a%2?'#2f8a4a':'#46a85c',x+(a%3?0:1),y-1,2,1)}
 for(let a=0;a<28;a+=2){const t=a/28*6.283;r('#7fd08a',Math.round(wx+Math.cos(t)*9),Math.round(wy+Math.sin(t)*9),1,1)}
 for(const t of[.4,1.7,2.9,4.1,5.2]){r('#d9302a',Math.round(wx+Math.cos(t)*8)-1,Math.round(wy+Math.sin(t)*8)-1,3,3);r('#ff7a6a',Math.round(wx+Math.cos(t)*8)-1,Math.round(wy+Math.sin(t)*8)-1,1,1)}
 r('#b8221a',wx-6,wy+7,5,4);r('#b8221a',wx+2,wy+7,5,4);r('#e0483a',wx-6,wy+7,5,1);r('#e0483a',wx+2,wy+7,5,1);r('#8f1612',wx-1,wy+7,3,4);
 r('#b8221a',wx-4,wy+11,2,5);r('#b8221a',wx+3,wy+11,2,5);r('#ffd23f',wx-1,wy+8,3,2);
 r('#6b4220',wx-1,wy-10,3,3);
 // dây quả thông mini
 for(let x=8;x<=104;x++){const y=garlandY(x);r('#245f38',x,y,1,3);r('#2f8a4a',x,y,1,2);if(hsh(x,1)<.35)r('#5cbf7a',x,y-1,1,1);if(hsh(x,2)<.25)r('#1b4a2c',x,y+3,1,1)}
 for(const x of CONES){const y=garlandY(x)+3;r('#4a2c14',x,y-1,1,2);r('#6b4423',x-2,y+1,5,2);r('#7a5230',x-2,y+3,5,2);r('#6b4423',x-1,y+5,3,2);r('#4a2c14',x,y+7,1,1);
  r('#a8703c',x-2,y+1,1,1);r('#a8703c',x,y+3,1,1);r('#a8703c',x+2,y+3,1,1);r('#f4f9ff',x-1,y,3,1)}
 for(const x of BEADS)r(x%12?'#d9302a':'#ffd23f',x,garlandY(x)+1,2,2);
}));
let NSG=null;
const neonSign=()=>NSG||(NSG=mk(132,40,(g,r)=>{
 r('#0c0620',3,4,126,32);
 g.lineJoin='round';g.lineCap='round';
 g.shadowColor='#19e6ff';g.shadowBlur=7;g.strokeStyle='#4af0ff';g.lineWidth=2;g.strokeRect(4,5,124,30);
 g.shadowBlur=2;g.strokeStyle='#e6ffff';g.lineWidth=.6;g.strokeRect(4,5,124,30);
 g.textAlign='center';g.textBaseline='middle';
 g.font='900 14px Nunito,"Segoe UI",Arial,sans-serif';
 g.shadowColor='#ff2a9a';g.shadowBlur=9;g.fillStyle='#ff5cbd';g.fillText('TRÀ TUYẾT',66,17);
 g.shadowBlur=4;g.fillText('TRÀ TUYẾT',66,17);
 g.shadowBlur=0;g.strokeStyle='#ffe4f6';g.lineWidth=.7;g.strokeText('TRÀ TUYẾT',66,17);
 g.font='800 6px Nunito,"Segoe UI",Arial,sans-serif';g.shadowColor='#19e6ff';g.shadowBlur=4;g.fillStyle='#9ff6ff';g.fillText('S N O W   T E A   H O U S E',66,29);
 g.shadowBlur=5;g.shadowColor='#ff2a9a';g.strokeStyle='#ff8fd4';g.lineWidth=1.2;
 g.beginPath();g.moveTo(11,15);g.lineTo(11,22);g.quadraticCurveTo(11,26,15,26);g.quadraticCurveTo(19,26,19,22);g.lineTo(19,15);g.closePath();g.moveTo(19,17);g.quadraticCurveTo(23,17,22,21);g.quadraticCurveTo(21,23,19,22);g.stroke();
 g.beginPath();g.moveTo(15,11);g.quadraticCurveTo(13,9,15,7);g.moveTo(18,11);g.quadraticCurveTo(16,9,18,7);g.stroke();
 g.strokeStyle='#8ff3ff';g.shadowColor='#19e6ff';
 g.beginPath();g.moveTo(117,12);g.lineTo(117,28);g.moveTo(109,20);g.lineTo(125,20);g.moveTo(111,14);g.lineTo(123,26);g.moveTo(123,14);g.lineTo(111,26);g.stroke()}));
SP.push({by:SBY,d:()=>{const t=performance.now()/1000;
 E(r,'rgba(60,90,140,.30)',CXM,SBY,56,3);
 // ánh đèn kệ
 E(r,'rgba(255,200,120,'+(.16+.04*Math.sin(t*2.3)).toFixed(2)+')',CXM,SY+52,38,12);
 cx.drawImage(stallI,SX-1,SY-1);
 // lấp lánh dây quả thông + vòng nguyệt quế
 for(const x of BEADS){const on=Math.sin(t*3+x*.8)>-.2;if(on){const c=x%12?[255,90,80]:[255,220,110];r(rgba(c,.9),x+SX,garlandY(x)+1+SY,2,2);r(rgba(c,.22),x+SX-1,garlandY(x)+SY,4,4)}}
 for(let i=0;i<5;i++){const a=i/5*6.283+.4;if(Math.sin(t*4+i*1.9)>0){const x=SX+56+Math.cos(a)*8,y=SY+17+Math.sin(a)*8;r('#fff6c0',Math.round(x),Math.round(y),1,1);r('rgba(255,240,170,.25)',Math.round(x)-1,Math.round(y)-1,3,3)}}
 // hơi nước bốc lên từ ấm
 for(let i=0;i<3;i++){const u=(t*.5+i/3)%1;r('rgba(255,255,255,'+(.55*(1-u)).toFixed(2)+')',Math.round(SX+20+Math.sin(t*2+i*2)*2+u*3),Math.round(SY+55-u*18),2+Math.round(u*2),2+Math.round(u*2))}
 for(let i=0;i<2;i++){const u=(t*.42+i/2+.2)%1;r('rgba(255,255,255,'+(.4*(1-u)).toFixed(2)+')',Math.round(SX+46+i*8+Math.sin(t*2+i)*2),Math.round(SY+58-u*14),2,2)}
 // bảng neon
 E(r,'rgba(255,70,170,'+(.12+.03*Math.sin(t*2)).toFixed(2)+')',CXM,SY-19,76,26);E(r,'rgba(30,230,255,.07)',CXM,SY-19,58,18);
 r('#3a2a44',SX+12,SY-3,2,6);r('#3a2a44',SX+98,SY-3,2,6);
 const f=(Math.sin(t*23)*Math.sin(t*7.3)>.9)?.55:1;cx.globalAlpha=f;cx.drawImage(neonSign(),CXM-66,SY-39);cx.globalAlpha=1;
 r('rgba(255,100,190,.10)',SX+2,SY+8,108,2)}});
wbkp(SX+2,SBY-26,SX+110,SBY);

/* ====================== 2) GÓC GHẾ NEON ====================== */
const CHx=[416,472],CHy=272,TBx=444,TBy=284,RGx=444,RGy=278;
const chairI=(cu,cu2,plaid)=>outl(mk(32,40,(g,r)=>{
 r('#4a2a14',3,2,26,25);r('#6b4220',4,3,24,23);
 r(cu,6,5,20,19);r(cu2,6,5,20,3);for(let y=9;y<22;y+=4){r('rgba(0,0,0,.14)',7,y,18,1);for(let x=9;x<26;x+=6)r('#e8c060',x,y-1,2,2)}
 r('#4a2a14',1,17,6,19);r(cu,2,18,4,16);r(cu2,2,18,4,2);r('#4a2a14',25,17,6,19);r(cu,26,18,4,16);r(cu2,26,18,4,2);
 r('#4a2a14',3,26,26,10);r(cu,4,25,24,9);r(cu2,4,25,24,2);r('rgba(0,0,0,.18)',4,32,24,2);
 r('#2c180a',4,36,4,4);r('#2c180a',24,36,4,4);
 if(plaid){for(let y=26;y<34;y+=2)for(let x=5;x<27;x+=2)r((x+y)%4?'#b8261e':'#1b1b22',x,y,2,1);r('#f4efe6',5,33,22,1)}
 else{r('#f7f2ea',1,13,9,7);r('#fff',1,13,9,2);r('#ece5d8',2,19,8,2);for(let i=0;i<5;i++)r('#f7f2ea',1+i*2,21,1,2)}}));
const chA=chairI('#a8261e','#c8413a',0),chB=chairI('#2a6a46','#3f8a5e',1);
const tableI=outl(mk(30,28,(g,r)=>{
 r('#4a2a14',12,14,6,12);r('#4a2a14',8,25,14,2);E(r,'#6b4220',15,13,13,4);E(r,'#a8703c',15,12,12,3);E(r,'#e8d8c0',15,12,10,2);E(r,'#f4efe6',14,11,6,1);
 r('#f4f9ff',9,7,1,0);
 r('#d9ecff',12,4,6,7);r('rgba(255,255,255,.55)',12,4,1,7);r('#8a5a30',12,3,6,1);r('#8a5a30',12,11,6,1);r('#f4efe6',14,6,2,4);
 r('#c0392b',4,8,4,4);r('#f4f1e6',4,8,4,1);r('#c0392b',8,9,1,2);r('#2f6f9a',22,8,4,4);r('#f4f1e6',22,8,4,1);r('#2f6f9a',26,9,1,2)}));
SP.push({by:1,d:()=>{cx.save();cx.translate(444,268);cx.scale(1,.5);const gr=cx.createRadialGradient(0,0,10,0,0,175);
 gr.addColorStop(0,'rgba(18,22,84,.50)');gr.addColorStop(.55,'rgba(24,30,100,.30)');gr.addColorStop(1,'rgba(30,40,110,0)');cx.fillStyle=gr;cx.fillRect(-176,-176,352,352);cx.restore()}});
SP.push({by:2,d:()=>{E(r,'#7a1f1f',RGx,RGy,56,15);E(r,'#a8302a',RGx,RGy,53,13);E(r,'#e8c060',RGx,RGy,48,11);E(r,'#a8302a',RGx,RGy,46,10);E(r,'#7a1f1f',RGx,RGy,38,7);
 for(let a=0;a<20;a++){const t=a/20*6.283;r('#ffd98a',Math.round(RGx+Math.cos(t)*43),Math.round(RGy+Math.sin(t)*8.5),2,1)}
 for(let i=0;i<10;i++){r('#e8c060',RGx-32+i*7,RGy-1,3,2)}
 for(let k=0;k<12;k++)r('#f4efe6',RGx-50+k*8+(k%2)*2,RGy+10+(k%2),1,2)}});
CHx.forEach((x,i)=>{SP.push({by:CHy,d:()=>{r('rgba(60,40,30,.28)',x-14,CHy-2,28,4);cx.drawImage(i?chB:chA,x-17,CHy-41)}});
 HT.push([x-16,CHy-36,32,42,'🪑 Ghế ấm cúng — bấm để ngồi cạnh dây neon','wchair:'+(x+DX)+':'+(CHy-2)+':'+(CHy+24),[x,CHy+24]])});
SP.push({by:TBy,d:()=>{const t=performance.now()/1000;r('rgba(60,40,30,.28)',TBx-12,TBy-2,24,4);cx.drawImage(tableI,TBx-16,TBy-29);
 E(r,'rgba(255,190,100,'+(.18+.05*Math.sin(t*7)).toFixed(2)+')',TBx,TBy-22,10,9);const fl=Math.round(Math.sin(t*9));r('#ffd23f',TBx-1,TBy-25-fl,2,2);r('#fff6c0',TBx,TBy-25-fl,1,1);
 for(const[dx,c]of[[-10,0],[9,1]])for(let i=0;i<2;i++){const u=(t*.6+i*.5+c*.3)%1;r('rgba(255,255,255,'+(.6*(1-u)).toFixed(2)+')',Math.round(TBx+dx+Math.sin(t*3+i)*1),Math.round(TBy-22-u*10),2,2)}}});
wbkp(398,CHy-8,490,CHy+2);wbkp(436,TBy-10,452,TBy+1);
// cột + dây neon + hoa tuyết neon
const PA=[374,SBY+0],PB=[514,0];const PXa=374,PXb=514,PYb=284,PTOP=196;
const cableY=x=>PTOP+3+Math.round(13*4*((x-PXa)/(PXb-PXa))*(1-(x-PXa)/(PXb-PXa)));
const NEO=[[255,106,196],[106,240,255],[255,230,150],[190,150,255]];
const flake=(x,y,R,c,a)=>{E(r,rgba(c,.13*a),x,y,R+4,R+4);for(let k=0;k<6;k++){const an=k*Math.PI/3+Math.PI/6;for(let s=1;s<=R;s++){const px=Math.round(x+Math.cos(an)*s),py=Math.round(y+Math.sin(an)*s);r(rgba(c,.95*a),px,py,1,1);
   if(s==Math.round(R*.62)){for(const d of[-1,1]){const b=an+d*.9;for(let q=1;q<=Math.max(1,R>>2);q++)r(rgba(c,.85*a),Math.round(px+Math.cos(b)*q),Math.round(py+Math.sin(b)*q),1,1)}}}}
 r('rgba(255,255,255,'+(.9*a).toFixed(2)+')',x,y,1,1)};
const FLK=[[394,18,6,0],[424,23,5,1],[444,26,7,2],[468,22,5,3],[498,14,6,0]];
const poleI=outl(mk(10,96,(g,r)=>{r('#6b4220',2,6,6,90);r('#8a5a30',2,6,2,90);r('#4a2c14',6,6,2,90);r('#8a5a30',0,10,10,3);snowBlob(r,0,8,10);r('#4a2c14',0,92,10,4);snowBlob(r,-1,95,12)}));
SP.push({by:PYb,d:()=>{const t=performance.now()/1000;
 for(const x of[PXa,PXb])cx.drawImage(poleI,x-6,PYb-95);
 // dây neon đôi
 for(let x=PXa;x<=PXb;x++){const y=cableY(x),p=.75+.25*Math.sin(t*2.2-x*.05);r(rgba(NEO[0],.14*p),x,y-2,1,5);r(rgba(NEO[0],.95*p),x,y,1,1);r('rgba(255,225,245,'+(.8*p).toFixed(2)+')',x,y,1,1);
  const y2=y+3;r(rgba(NEO[1],.12*p),x,y2-1,1,3);r(rgba(NEO[1],.9*p),x,y2,1,1)}
 for(let x=PXa+6;x<PXb;x+=10){const y=cableY(x),c=NEO[(x/10|0)%4],a=.6+.4*Math.sin(t*3+x);E(r,rgba(c,.2*a),x,y+1,4,4);r(rgba(c,a),x-1,y,3,3);r('rgba(255,255,255,'+(.8*a).toFixed(2)+')',x,y,1,1)}
 // hoa tuyết neon treo
 for(const[x,len,R,k]of FLK){const y=cableY(x),a=Math.sin(t*2.4+x)>-.85?.65+.35*Math.sin(t*3.1+x*.3):.35;
  r('rgba(200,210,255,.55)',x,y+1,1,len);flake(x,y+len+R,R,NEO[[1,0,3,1,0][k]],a)}
 // đèn nhỏ trên đỉnh cột
 for(const x of[PXa,PXb]){E(r,'rgba(255,200,120,.2)',x,PTOP+1,7,6);r('#ffe08a',x-1,PTOP-1,3,3)}}});
wbkp(PXa-4,PYb-8,PXa+4,PYb);wbkp(PXb-4,PYb-8,PXb+4,PYb);

/* ====================== 3) ÔNG GIÀ NOEL + TUẦN LỘC CHỞ HÀNG ====================== */
const SLx=428,SLy=372,DRx=544,SAx=592;
const sleighI=outl(mk(80,50,(g,r)=>{
 r('#6b4220',4,38,70,2);r('#e0b040',2,41,74,2);r('#ffe27a',2,41,74,1);
 for(let i=0;i<10;i++){r('#e0b040',74+Math.round(i*.9),41-i,2,2)}r('#ffe27a',76,31,2,2);
 r('#e0b040',12,36,2,6);r('#e0b040',44,36,2,6);r('#e0b040',66,36,2,6);
 r('#a8201a',6,22,66,16);r('#c8302a',6,22,66,6);r('#e0584a',6,22,66,1);r('#7a1612',6,36,66,2);r('#ffd23f',6,27,66,2);
 for(let x=10;x<68;x+=8){r('#ffe27a',x,31,3,3);r('#ffd23f',x+1,30,1,5)}
 r('#a8201a',2,8,8,30);r('#c8302a',2,8,3,30);r('#e0584a',2,8,8,1);r('#ffd23f',2,16,8,2);
 r('#a8201a',68,18,10,20);r('#c8302a',68,18,10,3);r('#ffd23f',72,22,2,4);
 // quà + bao
 E(r,'#8a5a30',38,16,13,13);E(r,'#a8703c',36,14,10,10);E(r,'#c99660',34,12,5,5);r('#ffd23f',34,2,10,3);r('#d9302a',36,0,6,3);
 const box=(x,y,w,h,c1,c2,rb)=>{r(c1,x,y,w,h);r(c2,x,y+h-3,w,3);r(rb,x+(w>>1)-1,y,2,h);r(rb,x,y+(h>>1)-1,w,2);r(rb,x+(w>>1)-3,y-3,3,3);r(rb,x+(w>>1),y-3,3,3)};
 box(12,12,13,11,'#2f6fe0','#2050a8','#ffffff');box(56,11,12,12,'#3f9a4a','#2a7a34','#ffd23f');box(26,18,9,6,'#a040d0','#7a2aa0','#ffd23f');box(48,18,8,5,'#ff9a1a','#c07010','#fff')}));
const santa=(x,y,t,u)=>{x=Math.round(x);y=Math.round(y);const a=[],z=ZZ(a),b=Math.round(Math.sin(t*2.2)*.7),wv=Math.sin(t*7),
 hx=Math.round(wv*2),hy=wv>.4?-1:0;
 r('rgba(60,90,140,.3)',x-8,y+1,17,3);
 z('#1b1b22',x-6,y-3,5,3);z('#1b1b22',x+1,y-3,5,3);z('#c0281e',x-5,y-10,4,7);z('#c0281e',x+1,y-10,4,7);z('#fff',x-5,y-5,4,1);z('#fff',x+1,y-5,4,1);
 z('#c0281e',x-8,y-25+b,16,16);z('#e0483a',x-8,y-25+b,4,16);z('#fff',x-1,y-25+b,2,16);z('#fff',x-8,y-10+b,16,2);
 z('#1b1b22',x-8,y-17+b,16,3);z('#ffd23f',x-2,y-17+b,4,3);z('#fff6c0',x-1,y-16+b,2,1);
 z('#c0281e',x-11,y-23+b,3,9);z('#fff',x-11,y-14+b,3,2);          // tay trái (cầm hờ)
 z('#c0281e',x+8,y-23+b,3,5);z('#c0281e',x+9+hx,y-31+b+hy,3,9);z('#fff',x+8+hx,y-33+b+hy,5,3);   // tay phải vẫy
 z('#f1c08a',x-4,y-32+b,8,7);z('#222',x-3,y-30+b,1,1);z('#222',x+2,y-30+b,1,1);z('#e89a8a',x-1,y-28+b,2,1);
 z('#fff',x-5,y-28+b,10,6);z('#fff',x-6,y-26+b,12,4);z('#e8eef6',x-3,y-25+b,6,1);z('#f1c08a',x-1,y-27+b,2,1);
 z('#c0281e',x-5,y-38+b,10,6);z('#e0483a',x-5,y-38+b,3,6);z('#fff',x-6,y-33+b,12,3);z('#c0281e',x+4,y-36+b,4,3);z('#fff',x+6,y-35+b+Math.round(wv),3,3);
 OL(a)};
window.SF={t0:-99999};
SP.push({by:SLy,d:()=>{const t=performance.now()/1000;
 E(r,'rgba(60,90,140,.3)',SLx+40,SLy,40,3);cx.drawImage(sleighI,SLx-1,SLy-50);
 for(let i=0;i<5;i++)if(Math.sin(t*3+i*1.9)>0){r('#fff6c0',SLx+14+i*11,SLy-36+(i%2)*3,1,1);r('rgba(255,240,170,.25)',SLx+13+i*11,SLy-37+(i%2)*3,3,3)}
 // dây kéo
 r('#ffd23f',SLx+78,SLy-14,DRx-SLx-92,1);r('#a8701a',SLx+78,SLy-13,DRx-SLx-92,1);
 deer(DRx,SLy,t,false,.9,'#8b5a2b','#c0281e','#222');
 // chuông nhỏ
 const bs=Math.round(Math.sin(t*3));r('#ffd23f',DRx+7,SLy-8+bs,2,2);}});
SP.push({by:SLy+1,d:()=>{const t=performance.now()/1000,n=new Date().toDateString();
 santa(SAx,SLy,t);
 if(ST.sbd!=n){const bob=Math.round(Math.sin(t*3.2)*2);E(r,'rgba(160,210,255,.35)',SAx,SLy-52+bob,9,9);E(r,'#ffffff',SAx,SLy-52+bob,7,7);E(r,'#8fb8e8',SAx,SLy-52+bob,6,6);
  r('#fff',SAx-1,SLy-57+bob,2,10);r('#fff',SAx-5,SLy-55+bob,10,2);r('#fff',SAx-4,SLy-54+bob,2,8);r('#fff',SAx+3,SLy-54+bob,2,8);r('#ffffff',SAx-1,SLy-53+bob,3,3)}
 const u=(performance.now()-SF.t0)/1000;if(u>=0&&u<1.8)for(let i=0;i<16;i++){const ang=i*.9,rr=u*26;r(i%2?'#ffffff':'#bfe0ff',Math.round(SAx+Math.cos(ang)*rr*(.5+(i%3)*.25)),Math.round(SLy-30-u*34+Math.sin(ang)*rr*.4+u*u*28),2,2)}}});
wbkp(SLx,SLy-14,SAx+10,SLy+1);
HT.push([SAx-13,SLy-42,26,46,'🎅 Ông già Noel — bấm để nhận Huy hiệu tuyết mỗi ngày','santa',[SAx-6,SLy+14]]);
LBL.push(['ÔNG GIÀ NOEL',SAx,SLy-62]);

/* ====================== 4) thêm vài cây thông + đèn ====================== */
/* (cây thông viền đã vẽ sẵn trong nền WB) */

/* ====================== 5) BẢNG CHỈ ĐƯỜNG: ngoài cổng → Ông già Noel ====================== */
DX=0;const SGx=250,SGy=412;
const signI=outl(mk(44,38,(g,r)=>{
 // cột + chân tuyết
 r('#6b4220',19,12,4,26);r('#8a5a30',19,12,1,26);r('#4a2c14',22,12,1,26);
 // tấm biển mũi tên
 for(let i=0;i<7;i++){const w=i<4?3+i:9-i;r('#e8d8b0',33+i,3+i,Math.max(1,5-i),1);r('#e8d8b0',33+i,17-i,Math.max(1,5-i),1)}
 r('#e8d8b0',3,3,32,15);r('#f6ecd0',3,3,32,2);r('#c9b88a',3,16,32,2);r('#6b4220',3,3,32,1);r('#6b4220',3,17,32,1);r('#6b4220',3,3,1,15);
 for(let i=0;i<8;i++){r('#e8d8b0',35+i,3+i,1,1);r('#e8d8b0',35+i,17-i,1,1);r('#6b4220',36+i,3+i,1,1);r('#6b4220',36+i,17-i,1,1)}
 r('#e8d8b0',35,4,6,12);r('#e8d8b0',41,8,1,4);r('#6b4220',42,10,1,1);
 // mũ ông già Noel nhỏ
 r('#c0281e',6,6,7,5);r('#e0483a',6,6,3,5);r('#ffffff',5,10,9,2);r('#ffffff',12,5,3,3);r('#e8eef6',5,11,9,1);
 // mũi tên đỏ chỉ sang phải
 r('#c0281e',17,9,13,3);r('#e0483a',17,9,13,1);for(let i=0;i<6;i++)r('#c0281e',27+i,7+i,1,7-i*2>0?7-i*2:1);r('#c0281e',31,10,2,1);
 // tuyết phủ
 r('#f4f9ff',2,1,34,2);r('#cfe0f5',2,2,34,1);r('#f4f9ff',17,10,10,0);
 for(let i=0;i<20;i++)r(i%3?'#f4f9ff':'#cfe0f5',13+i,35+(i%2)*0,1,1);
 r('#f4f9ff',14,35,16,3);r('#cfe0f5',14,37,16,1);r('#f4f9ff',16,33,12,2)}));
SP.push({by:SGy,d:()=>{const t=performance.now()/1000,s=Math.round(Math.sin(t*2.4));
 r('rgba(60,90,140,.28)',SGx-12,SGy-1,24,3);cx.drawImage(signI,SGx-22,SGy-37);
 // chấm sáng nhấp nháy dẫn đường
 for(let i=0;i<3;i++){const a=Math.sin(t*4-i*1.1)>0?1:.25;r('rgba(255,230,140,'+a.toFixed(2)+')',SGx+24+i*7,SGy-26+s*0,2,2)}}});
wbkp(SGx-5,SGy-8,SGx+5,SGy);
HT.push([SGx-22,SGy-38,44,40,'🪧 Chỉ đường: Ông già Noel ở phía Đông ▶ — đi thẳng sang bên phải nhé!']);
LBL.push(['ÔNG GIÀ NOEL ▶',SGx+4,SGy-42]);
WT.pos={x:130,y:402};
})();

/* ---------------- panel + nhận huy hiệu ---------------- */
function wChair(a){const q=a.split(':');if(Pl.sit)return;if(ST.av.m>=0)ST.av.m=-1;Pl.x=+q[1];Pl.y=+q[2];Pl.by=+q[3];Pl.d=0;Pl.sit=2;Pl.st=0;Pl.nt=0;Pl.bn=1;goal=null;toast('☕ Ngồi nghỉ bên góc trà ấm cúng... (di chuyển để đứng dậy)')}
const SBSVG=z=>'<svg width="'+z+'" height="'+z+'" viewBox="0 0 40 40" style="flex:none"><defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2faff"/><stop offset="1" stop-color="#a9cdf5"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#sbg)" stroke="#7da3cc" stroke-width="2"/><g stroke="#5b86b8" stroke-width="2" stroke-linecap="round" fill="none"><path d="M20 7v26M8.7 13.5l22.6 13M8.7 26.5l22.6-13"/><path stroke-width="1.4" d="M16.5 9.5L20 12.5l3.5-3M16.5 30.5L20 27.5l3.5 3M7 17.5l4.2 1.2-.6-4.4M33 22.5l-4.2-1.2.6 4.4M7 22.5l4.2-1.2-.6 4.4M33 17.5l-4.2 1.2.6-4.4"/></g><circle cx="20" cy="20" r="2.6" fill="#fff" stroke="#5b86b8" stroke-width="1.2"/></svg>';
function santaAct(){const d=new Date().toDateString();
 if(ST.sbd!=d){ST.sbd=d;ST.sb=(ST.sb|0)+1;try{SF.t0=performance.now()}catch(e){}save();
  return toast('🎅 Ho ho ho! Bạn nhận được 1 ❄️ Huy hiệu tuyết!\nĐang có '+ST.sb+' huy hiệu • bấm lại ông để xem gian hàng')}
 santaPanel()}
/* ---- Gian hàng đổi Huy hiệu tuyết: thêm món mới = thêm 1 dòng vào SBSHOP (loại 'p' pet / 's' set / 'h' tóc-mũ / 'a' phụ kiện / 'x' hành động; k = khóa trong PETS/SETS/HAIRS/ACCS, riêng 'x' là id trong ACTS; giá = bd) ---- */
const SBSHOP=[{t:'p',k:'ginger'},{t:'p',k:'snowcloud'},{t:'h',k:'earfur'},{t:'x',k:'bell'},{t:'a',k:'gift'},{t:'a',k:'snowbub'},{t:'s',k:'wintm'},{t:'s',k:'wintf'}];
const sbArr=t=>t=='p'?PETS:t=='s'?SETS:t=='h'?HAIRS:t=='x'?ACTS:ACCS;
const sbItem=q=>{const A=sbArr(q.t),i=A.findIndex(x=>(q.t=='x'?x.id:x.k)==q.k);return i<0?null:{t:q.t,i,it:A[i]}};
const sbOwn=m=>m.t=='x'?!!(ST.acts&&ST.acts[m.it.id]):(ST.own&&ST.own[m.t]||[]).includes(m.i);
var SBRAF=0;
function sbPrev(c,t){const g=c.getContext('2d'),q=SBSHOP[+c.dataset.q],m=sbItem(q);if(!m)return;g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 const A=ST.av||{},K=m.t=='p'?3:2;g.save();g.scale(K,K);const W=c.width/K,H=c.height/K;
 if(m.t=='p'){g.fillStyle='rgba(80,110,60,.15)';drawPet(g,Math.round(W/2),H-6,Math.floor(t/2)%2?3:0,1,t,t,m.i)}
 else{const d=(m.t=='s'||m.t=='h')?[0,3,1,2][Math.floor(t/1.6)%4]:(m.it.t=='pull'?3:0);
  drawAv(g,Math.round(W/2)-10,H-33+(m.it.t=='float'?6:0),{d,a:t,mv:m.t=='a'?1:0,sit:0,hair:m.t=='h'?m.i:(A.h|0),set:m.t=='s'?m.i:(A.s|0),e:A.e|0,acc:m.t=='a'?m.i:-1})}
 g.restore()}
function sbAnim(){const cs=document.querySelectorAll('canvas.sbc');if(!cs.length||!UI){SBRAF=0;return}const t=performance.now()/1000;cs.forEach(c=>sbPrev(c,t));SBRAF=requestAnimationFrame(sbAnim)}
function sbBuy(n){const q=SBSHOP[n],m=q&&sbItem(q);if(!m)return;ST.own=ST.own||{};ST.acts=ST.acts||{};const own=m.t=='x'?[]:(ST.own[m.t]=ST.own[m.t]||[]);
 if(sbOwn(m))return toast(m.t=='x'?'✓ Bạn đã có hành động này rồi, mở ⚡ Hành động để dùng':'✓ Bạn đã có món này rồi, mở 🎒 Túi để dùng');
 const c=m.it.bd|0;if((ST.sb|0)<c)return toast('❄️ Chưa đủ huy hiệu — cần '+c+', bạn có '+(ST.sb|0)+'\nMỗi ngày ghé ông Noel nhận 1 huy hiệu nhé!');
 ST.sb-=c;if(m.t=='x')ST.acts[m.it.id]=1;else own.push(m.i);save();toast('🎁 Ông Noel: "Ho ho ho! Chúc mừng con nhận được '+m.it.n+'!"\n'+(m.t=='x'?'Mở ⚡ Hành động để dùng':'Mở 🎒 Túi để dùng'));santaPanel()}
function sbHairChk(){const W=SETS[ST.av.s];if(W&&(W.mascot||W.deer||W.dn||W.tn||W.aul))toast('🧸 Bạn cần gỡ mascot mới xem được vật phẩm tóc & mũ')}
function santaPanel(){const n=ST.sb|0;
 const tile=(q,qi)=>{const m=sbItem(q);if(!m)return '';const own=sbOwn(m),c=m.it.bd|0,ok=n>=c,kind=m.t=='p'?'Pet':m.t=='s'?'Set':m.t=='h'?'Mũ':m.t=='x'?'Hành động':'Phụ kiện';
  return '<div class="sbt on">'+(m.t=='x'?actCv(m.it.id,72,100,'sbx'):'<canvas class="sbc" data-q="'+qi+'" width="88" height="96"'+(m.t=='h'?' onclick="sbHairChk()"':'')+'></canvas>')+'<b>'+m.it.n+'</b><small>'+kind+'</small>'
   +(own?'<button class="sbb own" disabled>✓ Đã có</button>':'<button class="sbb'+(ok?'':' lack')+'" onclick="sbBuy('+qi+')">❄ '+c+' • Đổi</button>')+'</div>'};
 openUI(head('🎅 Ông già Noel')
 +'<div class="sbtop"><div class="sbav">🎅</div><div class="sbsay">“Ho ho ho! Con gom huy hiệu tuyết đem lại đây, ông đổi quà Giáng Sinh cho nhé!”</div></div>'
 +'<div class="sbown">'+SBSVG(52)+'<div><div class="sbl">Huy hiệu tuyết hiện có</div><div class="sbn">❄ '+n+'</div></div></div>'
 +'<div class="sbshop"><div class="sbsh"><span>🎁 Gian hàng quy đổi</span><span class="sbcs">'+SBSHOP.length+' MÓN</span></div>'
 +'<div class="sbgrid">'+SBSHOP.map(tile).join('')+'</div>'
 +'<div class="sbnote">Mỗi ngày bấm ông Noel 1 lần để nhận 1 huy hiệu tuyết. Đồ đổi được nằm trong 🎒 Túi.</div></div>');
 $('ui').classList.add('wui');if(!SBRAF)SBRAF=requestAnimationFrame(sbAnim);if(typeof actAnimGo=='function')actAnimGo()}
(function(){const css=document.createElement('style');css.textContent='.sbt.on{border:2px solid #b9d0ea;background:linear-gradient(#f4f9ff,#e6f0fc);color:#3d5f8f}.sbt.on b{font-size:12px;line-height:1.15;text-align:center}.sbt.on small{font-size:10px;color:#7d97b8}canvas.actc.sbx{width:88px;height:122px;margin:0;border-radius:8px;border:0}canvas.sbc{width:88px;height:96px;image-rendering:pixelated;background:linear-gradient(#cfe6ff,#eaf4ff 66%,#d6e8c4 66%);border-radius:8px}.sbb{margin-top:2px;font:inherit;font-weight:800;font-size:12px;padding:4px 8px;border-radius:14px;border:2px solid #7da3cc;background:linear-gradient(#ffffff,#cfe3fa);color:#2f5a96;cursor:pointer}.sbb.lack{opacity:.6}.sbb.own{background:#e5f4e0;border-color:#9ccc90;color:#3a7a35;cursor:default}';document.head.appendChild(css)})();

/* ============================================================
   🦌 XƯỞNG NOEL — 4 TUẦN LỘC CON bên trái nhà + panel đổi quà (coming soon)
   • Bấm từng chú tuần lộc: cho ăn 20 Xu, mỗi chú 1 lần/ngày, mỗi lần được 1 🗝️ Chìa khóa Giáng sinh (ST.ck).
   • Bấm nhà Xưởng Noel: mở panel (xem số chìa khóa, cho ăn nhanh, gian hàng quà = SẮP RA MẮT).
   • Lưu: ST.ck (số chìa khóa), ST.rdD (ngày), ST.rdF (4 chú đã ăn hôm nay hay chưa).
   • Đổi giá cho ăn: sửa NXPRICE. Đổi tên/màu: sửa mảng NXD.
   ============================================================ */
const NXPRICE=20;
const NXBOXKEY=4,NXBOXMIN=400,NXBOXMAX=900; /* Hộp quà xu Noel: giá (chìa khóa) + khoảng xu ngẫu nhiên (KHÔNG ghi ra giao diện) */
const NXD=[ /* x, y(chân), tên, lông, lông sáng, mũi, khăn */
 {x:204,y:114,n:'Bông', c:'#a9794a',l:'#c9985f',nz:'#222',   sc:'#2f6fe0'},
 {x:230,y:127,n:'Kẹo',  c:'#8b5a2b',l:'#a8723a',nz:'#ff2020',sc:'#d9302a'},
 {x:256,y:114,n:'Gừng', c:'#c49a6c',l:'#dcb88a',nz:'#222',   sc:'#3f9a4a'},
 {x:276,y:128,n:'Sao',  c:'#7a5a40',l:'#9a7656',nz:'#222',   sc:'#a040d0'}];
const NXT0=[-99999,-99999,-99999,-99999];
const NXZ={x0:192,x1:266,y0:100,y1:150}; /* vùng tuần lộc đi lại (tọa độ bản đồ): sửa số để rộng/hẹp hơn */
NXD.forEach((D,i)=>{D.tx=D.x;D.ty=D.y;D.w=Math.random()*2;D.f=1;D.mv=0});
function nxDay(){const d=new Date().toDateString();if(ST.rdD!==d||!Array.isArray(ST.rdF)){ST.rdD=d;ST.rdF=[0,0,0,0]}return ST.rdF}
function nxFeed(i,fromPanel){
 const f=nxDay(),D=NXD[i];if(!D)return;
 if(f[i]){toast('🦌 '+D.n+' đã ăn no rồi, mai quay lại nhé!');return}
 if((ST.xu|0)<NXPRICE){toast('🦌 Cần '+NXPRICE+' Xu để cho '+D.n+' ăn');return}
 ST.xu-=NXPRICE;f[i]=1;ST.ck=(ST.ck|0)+1;NXT0[i]=performance.now();try{xuUp()}catch(e){}save();
 toast('🦌 '+D.n+' ăn no rồi! (-'+NXPRICE+' Xu)\n🗝️ +1 Chìa khóa Giáng sinh (đang có '+ST.ck+')');
 if(fromPanel)nxHouse()}
function nxFeedAct(i){nxFeed(i,0)}
function nxBuy(){
 const k=ST.ck|0;if(k<NXBOXKEY)return toast('🗝️ Chưa đủ chìa khóa — cần '+NXBOXKEY+', bạn có '+k);
 ST.ck=k-NXBOXKEY;const xu=NXBOXMIN+Math.floor(Math.random()*(NXBOXMAX-NXBOXMIN+1));ST.xu+=xu;try{xuUp()}catch(e){}save();
 toast('🎁 Mở hộp quà Noel: +'+xu+' Xu! 🎄');nxHouse()}
const NXKEY='<svg width="46" height="46" viewBox="0 0 40 40" style="flex:none"><g stroke="#a8741c" stroke-width="2" stroke-linejoin="round"><circle cx="13" cy="13" r="9" fill="#ffd23f"/><path d="M19 19L35 35M29 29l4-4M32 32l4-4" fill="none" stroke-width="6" stroke-linecap="round"/><path d="M19 19L35 35M29 29l4-4M32 32l4-4" fill="none" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/></g><circle cx="13" cy="13" r="3.4" fill="#8f1a1a"/><circle cx="9" cy="8" r="2" fill="#fff6c0"/></svg>';
function nxHouse(){
 const f=nxDay(),k=ST.ck|0,n=f.filter(Boolean).length;
 const lights=[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>'<i style="animation-delay:'+(i*.18).toFixed(2)+'s;background:'+['#ff4040','#ffd23f','#40a0ff','#50e070','#ff80d0'][i%5]+'"></i>').join('');
 const tiles=NXD.map((D,i)=>'<div class="nxd'+(f[i]?' ok':'')+'"><div class="nxe" style="background:'+D.c+'">🦌</div><b>'+D.n+'</b>'
  +(f[i]?'<span class="nxs">✓ Đã ăn</span>':'<button class="nxb'+((ST.xu|0)<NXPRICE?' lack':'')+'" onclick="nxFeed('+i+',1)">🥕 '+NXPRICE+' Xu</button>')+'</div>').join('');
 const ck=ST.ck|0,gifts='<div class="nxd nxbox"><div class="nxe nxeb">🎁</div><b>Hộp quà xu Noel</b><button class="nxb'+(ck<NXBOXKEY?' lack':'')+'" onclick="nxBuy()">🗝️ '+NXBOXKEY+' • Đổi</button></div>'
  +['🧦','🔔','⛄','🎄','⭐'].map(e=>'<div class="nxg"><span>'+e+'</span><i>🔒</i></div>').join('');
 openUI(head('🎄 Xưởng Noel')
 +'<div class="nxcane"></div><div class="nxlights">'+lights+'</div>'
 +'<div class="nxkey">'+NXKEY+'<div><div class="nxl">Chìa khóa Giáng sinh</div><div class="nxn">'+k+'</div></div></div>'
 +'<div class="nxsec"><div class="nxh"><span>🦌 Tuần lộc con hôm nay</span><span class="nxc">'+n+'/4</span></div><div class="nxdg">'+tiles+'</div>'
 +'<div class="nxnote">Mỗi chú ăn 1 lần/ngày, cho ăn '+NXPRICE+' Xu được 1 chìa khóa. Bấm trực tiếp tuần lộc bên trái xưởng cũng được.</div></div>'
 +'<div class="nxsec"><div class="nxh"><span>🎁 Gian hàng quà Giáng sinh</span><span class="nxc soon">1 MÓN</span></div><div class="nxgg">'+gifts+'</div>'
 +'<div class="nxnote">Quà mới sắp ra mắt — hãy gom chìa khóa nhé!</div></div>'
 +'<div class="pf"><button class="b x" onclick="closeUI()">Đóng</button></div>');
 $('ui').classList.add('nxui')}
(function(){
 /* ---- hình tuần lộc con ---- */
 const nxMove=(D,dt)=>{
  if(D.w>0){D.w-=dt;D.mv=0;return}
  const dx=D.tx-D.x,dy=D.ty-D.y,d=Math.hypot(dx,dy);
  if(d<1.5){D.mv=0;D.w=1.5+Math.random()*3.5;D.tx=NXZ.x0+Math.random()*(NXZ.x1-NXZ.x0);D.ty=NXZ.y0+Math.random()*(NXZ.y1-NXZ.y0);return}
  const sp=13*dt;D.x+=dx/d*Math.min(sp,d);D.y+=dy/d*Math.min(sp,d);D.mv=1;if(Math.abs(dx)>.5)D.f=dx>0?1:-1};
 const baby=(i,t)=>{const D=NXD[i],now=performance.now();nxMove(D,Math.min(.1,(now-(D.lt||now))/1000));D.lt=now;D.o.by=D.y;D.h[0]=D.x-10;D.h[1]=D.y-34;D.h[6]=[D.x+6,D.y+16];
  const x=Math.round(D.x),y=Math.round(D.y),fed=(ST.rdD===new Date().toDateString()&&ST.rdF&&ST.rdF[i]);
  const u=(performance.now()-NXT0[i])/1000,hop=(u>=0&&u<1.2)?-Math.round(Math.abs(Math.sin(u*9))*4):0,
   gp=Math.sin(t*9+i*2),bob=hop+(D.mv?-Math.round(Math.abs(gp)):fed?0:Math.round(Math.sin(t*1.8+i*1.7)*.6)),hb=(fed||D.mv)?0:Math.round(Math.sin(t*2.2+i)),a=[],z=ZZ(a);
  r('rgba(60,90,140,.3)',x-9,y+1,18,3);
  cx.save();if(D.f<0){cx.translate(2*x,0);cx.scale(-1,1)}
  [-7,-4,2,5].forEach((dx,j)=>{const sg=D.mv?(j%2?-gp:gp):0,o=Math.round(sg*2),l=Math.round(Math.max(0,-sg)*2);z(D.c,x+dx+o,y-6+hop,2,5-hop-l);z('#3a2a22',x+dx+o,y-1-l,2,1)});
  z(D.c,x-8,y-13+bob,16,8);z(D.l,x-8,y-13+bob,16,1);z('#e8d0a8',x-6,y-7+bob,12,2);
  z('#fff8ee',x-5,y-11+bob,1,1);z('#fff8ee',x-1,y-12+bob,1,1);z('#fff8ee',x+2,y-10+bob,1,1);
  z('#fff8ee',x-11,y-12+bob,3,3);                                   // đuôi
  z(D.c,x+5,y-19+bob+hb,5,8);                                       // cổ
  z(D.sc,x+4,y-13+bob,7,2);z(D.sc,x+4,y-11+bob,2,4);                // khăn
  z(D.c,x+5,y-25+bob+hb,10,8);z(D.l,x+5,y-25+bob+hb,10,1);          // đầu to
  z('#e8d0a8',x+12,y-20+bob+hb,4,3);z(D.nz,x+14,y-21+bob+hb,2,2);   // mõm + mũi
  z(D.c,x+4,y-27+bob+hb,2,3);z(D.c,x+13,y-27+bob+hb,2,3);           // tai
  z('#e8d8b0',x+7,y-30+bob+hb,1,4);z('#e8d8b0',x+6,y-31+bob+hb,3,1);z('#e8d8b0',x+11,y-30+bob+hb,1,4);z('#e8d8b0',x+10,y-31+bob+hb,3,1);
  if(fed)z('#111',x+9,y-21+bob+hb,3,1);else z('#111',x+9,y-22+bob+hb,2,2);   // mắt: no = nhắm cười
  OL(a);
  if(!fed)r('#fff',x+9,y-22+bob+hb,1,1);
  r('rgba(255,140,150,.7)',x+7,y-19+bob+hb,2,1);
  if(D.nz=='#ff2020')E(r,'rgba(255,60,60,.28)',x+15,y-20+bob+hb,5,5);
  cx.restore();
  if(!fed){ // bong bóng cà rốt: đang đói
   const by=y-49+Math.round(Math.sin(t*3+i)*2),bx=x+1;r('#8fb8e8',bx-1,by-1,13,13);r('#fff',bx,by,11,11);r('#fff',bx+4,by+11,3,3);r('#8fb8e8',bx+4,by+13,3,1);
   r('#ff8a1f',bx+2,by+4,6,3);r('#ff8a1f',bx+3,by+3,4,5);r('#e06a00',bx+4,by+5,1,1);r('#e06a00',bx+6,by+4,1,1);r('#3f9a4a',bx+7,by+2,2,2);r('#3f9a4a',bx+8,by+5,2,1)}
  else if(u>=0&&u<2.2){for(let k=0;k<3;k++){const p=Math.min(1,u/2.2),hx=x+3+k*5+Math.round(Math.sin(u*5+k)*2),hy=y-36-Math.round(p*18)-k*3;
   r('rgba(255,70,110,'+(1-p).toFixed(2)+')',hx,hy,2,2);r('rgba(255,70,110,'+(1-p).toFixed(2)+')',hx+3,hy,2,2);r('rgba(255,70,110,'+(1-p).toFixed(2)+')',hx,hy+1,5,2);r('rgba(255,70,110,'+(1-p).toFixed(2)+')',hx+1,hy+3,3,1)}}
 };
 NXD.forEach((D,i)=>{
  const o={by:D.y,d:()=>baby(i,performance.now()/1000)};WT.sp.push(o);
  const h=[D.x-10,D.y-34,28,38,'🦌 '+D.n+' — bấm để cho ăn ('+NXPRICE+' Xu = 1 chìa khóa)','nxd:'+i,[D.x+6,D.y+16]];WT.hits.push(h);D.o=o;D.h=h});
 /* ---- giao diện panel Xưởng Noel (kiểu Giáng sinh) ---- */
 const css=document.createElement('style');
 css.textContent='#ui.nxui{background:linear-gradient(170deg,#b3241f 0%,#8f1a1a 42%,#1f5a34 100%);border-color:#ffd23f;box-shadow:0 3px 0 #7a4a14,0 0 18px rgba(255,210,63,.35);color:#fff6e0}'+
 '#ui.nxui .uh{color:#ffe9a8;text-shadow:0 2px 0 #5a0f0f;font-weight:900;font-size:16px}#ui.nxui .b.x{background:#fff3d6;border-color:#d9a23a;box-shadow:0 2px 0 #a8741c;color:#8f1a1a}'+
 '.nxcane{height:8px;border-radius:4px;margin:4px 0 2px;background:repeating-linear-gradient(45deg,#d9302a 0 8px,#fff 8px 16px);border:1.5px solid #fff6e0}'+
 '.nxlights{display:flex;justify-content:space-between;padding:0 6px;margin-bottom:6px}.nxlights i{width:9px;height:12px;border-radius:50% 50% 55% 55%;box-shadow:0 0 6px currentColor;animation:nxtw 1.6s infinite}@keyframes nxtw{50%{opacity:.35;transform:scale(.85)}}'+
 '.nxkey{display:flex;gap:12px;align-items:center;margin:6px 0 8px;background:linear-gradient(90deg,#fff3d6,#ffe2a0);border:2px solid #d9a23a;border-radius:14px;padding:10px 12px;color:#6b2a1a}'+
 '.nxl{font-size:12px;font-weight:700;color:#9a4a2a}.nxn{font-size:28px;font-weight:900;color:#b3241f;line-height:1.1}'+
 '.nxsec{background:rgba(255,246,224,.94);border:2px solid #d9a23a;border-radius:14px;padding:8px;margin:8px 0;color:#6b2a1a}'+
 '.nxh{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:13px}.nxc{font-size:10px;letter-spacing:1px;background:#d9302a;color:#fff;border-radius:20px;padding:2px 9px}.nxc.soon{background:#2a7a34}'+
 '.nxdg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0}.nxd{display:flex;flex-direction:column;align-items:center;gap:3px;background:#fff;border:2px dashed #e0b070;border-radius:10px;padding:6px 2px}.nxd.ok{border:2px solid #7fc088;background:#eef9ea}'+
 '.nxe{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:2px solid #fff;box-shadow:0 1px 3px #0003}.nxd b{font-size:12px}.nxs{font-size:11px;font-weight:800;color:#2a7a34}'+
 '.nxb{font:inherit;font-weight:800;font-size:11px;padding:4px 6px;border-radius:12px;border:2px solid #1b5a26;background:linear-gradient(#5cbf6a,#2a7a34);color:#fff;cursor:pointer}.nxb.lack{opacity:.55}'+
 '.nxeb{width:46px;height:46px;font-size:28px;background:linear-gradient(#ff6a5a,#c0281e)!important;border-color:#ffd23f}.nxbox{border:2px solid #e0b070}.nxgg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}.nxg{position:relative;height:54px;border-radius:10px;background:repeating-linear-gradient(45deg,#fbe3e3 0 8px,#fff 8px 16px);border:2px dashed #d9302a;display:flex;align-items:center;justify-content:center}.nxg span{font-size:26px;filter:grayscale(.6) blur(1.5px);opacity:.7}.nxg i{position:absolute;right:4px;bottom:2px;font-style:normal;font-size:13px}'+
 '.nxnote{font-size:11px;color:#9a4a2a;text-align:center;margin-top:2px}';
 document.head.appendChild(css)})();
