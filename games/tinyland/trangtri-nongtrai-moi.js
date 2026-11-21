/* ===================================================================================
   TRANGTRI-NONGTRAI-MOI.JS — Trang trí & Tiện ích Nông Trại Mới (13 món)
   • Lối đi & Hàng rào tự nối 4 hướng:
     - fencew    : Hàng rào gỗ trắng (tự liên kết 4 hướng + nối cổng vòm hoa hồng) — 35 Xu
     - fencetb   : Hàng rào tre đèn lồng (tre ngọc buộc thừng + đèn lồng giấy ấm) — 55 Xu
     - gatew     : Cổng vòm hoa hồng (4×1, đi xuyên qua được, có đèn trụ & hoa leo) — 600 Xu
     - pathstone : Lối đi lát đá (tự liền mảng, đi lên được) — 15 Xu
   • Vật dụng, Công trình, Đèn đêm & Cây/Hoa:
     - bunhinh   : Bù nhìn hoa hướng dương (khăn quàng bay + chim đậu) — 250 Xu
     - fountain  : Đài phun nước đá (3×2, tia nước & bọt sóng chuyển động) — 1.800 Xu
     - greenhouse: Nhà kính hoa mini (3×2, vòm kính Victoria 3 tầng hoa & bướm bay) — 1.450 Xu
     - greenhouselg: Nhà kính thực vật lớn (5×3, sảnh vòm Victoria hai cánh trồng cây & hoa) — 3.400 Xu
     - mushlamp1 : Đèn nấm lùn (phát sáng ấm ban đêm!) — 280 Xu
     - mushlamp2 : Đèn nấm cao (phát sáng ngọc tím ban đêm!) — 420 Xu
     - fairylamp : Đèn cổ tích (trụ sắt hoa + đèn lồng pha lê sáng đêm!) — 550 Xu
     - swing     : Xích đu gỗ treo hoa (3×1, đung đưa nhẹ & ngồi được!) — 1.200 Xu
     - teagarden : Bàn trà sân vườn (3×1, có ấm trà bánh ngọt & ngồi được!) — 850 Xu
   =================================================================================== */
(function(){
'use strict';
if(typeof FMD==='undefined'||typeof S_==='undefined'||typeof mk!=='function'||typeof outl!=='function')return;

const r=(c,x,y,w,h)=>{cx.fillStyle=c;cx.fillRect(x,y,w,h)};
const bxd=(r,x,y,w,h,c,d)=>{r(d,x,y,w,h);r(c,x,y,w,h-1);r('rgba(255,255,255,0.24)',x+1,y,Math.max(1,w-2),1)};

// Viền mảnh quanh hình nhưng KHÔNG viền vượt ra ngoài mép trái/phải ảnh (giúp hàng rào nối nhau không tạo vạch chia)
const edgeTile=(c,olCol)=>{
 const w=c.width,h=c.height,o=document.createElement('canvas');o.width=w;o.height=h;
 const g=o.getContext('2d'),s=c.getContext('2d').getImageData(0,0,w,h).data;
 const A=(x,y)=>x>=0&&x<w&&y>=0&&y<h&&s[(y*w+x)*4+3]>20;
 g.fillStyle=olCol||'rgba(42,50,68,0.72)';
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(!A(x,y)&&(A(x-1,y)||A(x+1,y)||A(x,y-1)||A(x,y+1)))g.fillRect(x,y,1,1);
 }
 g.drawImage(c,0,0);
 return o;
};

// ============================================================
//  1. HÀNG RÀO GỖ TRẮNG (fencew) & HÀNG RÀO TRE ĐÈN LỒNG (fencetb)
// ============================================================
const FW_SET=new Set();
const FT_SET=new Set();
const PS_SET=new Set();
function rebuildMySets(){
 FW_SET.clear();
 FT_SET.clear();
 PS_SET.clear();
 if(typeof ST!=='undefined'&&ST.fm&&Array.isArray(ST.fm.p)){
  for(const o of ST.fm.p){
   if(!o||o[0]!=='de')continue;
   if(o[1]==='fencew')FW_SET.add(o[2]+','+o[3]);
   else if(o[1]==='fencetb')FT_SET.add(o[2]+','+o[3]);
   else if(o[1]==='gatew'){
    FW_SET.add(o[2]+','+o[3]);
    FW_SET.add((o[2]+3)+','+o[3]);
   }else if(o[1]==='pathstone')PS_SET.add(o[2]+','+o[3]);
  }
 }
}
const myMask=(S,tx,ty)=>
 (S.has(tx+','+(ty-1))?1:0)|
 (S.has((tx+1)+','+ty)?2:0)|
 (S.has(tx+','+(ty+1))?4:0)|
 (S.has((tx-1)+','+ty)?8:0);

const FW_CACHE={};
function fenceWhiteTile(m){
 if(FW_CACHE[m])return FW_CACHE[m];
 let N=m&1,E_=m&2,S=m&4,W=m&8;
 if(!m){E_=2;W=8}
 const WL='#ffffff',WM='#f0f4fa',WS='#cad4e6',WD='#8496b5',WK='#4a5b78';
 const CL='#a8d0ff',CM='#689ee6',CD='#426ca8',GD='#ffe066';
 const raw=mk(16,28,(g,r)=>{
  const B=26;
  const picket=(x,h)=>{
   const top=B-h;
   r(WL,x+1,top,1,1);
   r(WM,x,top+1,3,h-1);
   r(WL,x,top+1,1,h-2);
   r(WS,x+2,top+1,1,h-2);
   r(WD,x,B-1,3,1);
   r(WK,x+1,B-9,1,1); // đinh tán thanh ngang
   r(WK,x+1,B-4,1,1);
  };
  const pillar=(x,h)=>{
   const top=B-h;
   r(WM,x,top,4,h);
   r(WL,x,top,1,h-1);
   r(WS,x+2,top,2,h-1);
   r(WD,x+3,top,1,h-1);
   // đế & mũ trụ xanh lam pastel + chóp vàng
   r(WS,x-1,B-2,6,2);r(WD,x-1,B-1,6,1);
   r(CM,x-1,top-2,6,2);r(CL,x,top-2,4,1);r(CD,x-1,top,6,1);
   r(GD,x+1,top-3,2,1);
  };
  const straightEW=E_&&W&&!N&&!S;
  const rail=(a,b)=>{
   r(WD,a,B-10,b-a,3);r(WM,a,B-10,b-a,2);r(WL,a,B-10,b-a,1);
   r(WD,a,B-5,b-a,3);r(WM,a,B-5,b-a,2);r(WL,a,B-5,b-a,1);
  };
  if(W)rail(0,8);
  if(E_)rail(8,16);
  if(N){
   r(WD,7,B-19,2,16);r(WL,7,B-19,1,16);
   picket(7,12);
  }
  if(S){
   r(WD,7,B-10,2,13);r(WL,7,B-10,1,13);
  }
  if(straightEW){
   for(const x of[1,5,9,13])picket(x,12);
  }else{
   if(W)picket(1,12);
   if(E_)picket(12,12);
   pillar(6,15);
   // khóm hoa hồng nhỏ xinh ở chân trụ góc / đầu mút
   r('#2f7838',4,B-2,4,2);r('#5ec258',5,B-3,3,2);
   r('#ff6b9d',5,B-4,2,2);r('#ffc9de',5,B-4,1,1);
  }
  if(S)picket(7,10);
 });
 const outlined=edgeTile(raw,'#3e4c66');
 const out=mk(16,28,(g,r)=>{
  E(r,'rgba(0,0,0,0.16)',8,26,8,2);
  g.drawImage(outlined,0,0);
 });
 return FW_CACHE[m]=out;
}

// ============================================================
//  2. LỐI ĐI LÁT ĐÁ TỰ LIỀN MẢNG (pathstone)
// ============================================================
const PS_CACHE={};
const H_=(x,y)=>{let h=(x*374761393+y*668265263)^0x5bd1e995;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};
function pathStoneTile(m,v){
 const k=m+'_'+v;if(PS_CACHE[k])return PS_CACHE[k];
 const N=m&1,E_=m&2,S=m&4,W=m&8;
 const ins=(x,y)=>{
  if(x<0)return !!W&&y>=0&&y<=15;
  if(x>15)return !!E_&&y>=0&&y<=15;
  if(y<0)return !!N&&x>=0&&x<=15;
  if(y>15)return !!S&&x>=0&&x<=15;
  if(!N&&y<1)return false;if(!S&&y>14)return false;
  if(!W&&x<1)return false;if(!E_&&x>14)return false;
  if(!N&&!W&&x===1&&y===1)return false;if(!N&&!E_&&x===14&&y===1)return false;
  if(!S&&!W&&x===1&&y===14)return false;if(!S&&!E_&&x===14&&y===14)return false;
  return true;
 };
 const ST=['#d8dde6','#c4ccd8','#e8ecf2','#b5bfce'];
 const c=mk(16,16,(g,r)=>{
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
   if(!ins(x,y)){
    if(ins(x,y-1)||ins(x,y+1)||ins(x-1,y)||ins(x+1,y))r('rgba(60,90,40,0.22)',x,y,1,1);
    continue;
   }
   const bx0=Math.floor((x+((Math.floor(y/5)%2)*3))/5),by0=Math.floor(y/5);
   const lx=(x+((Math.floor(y/5)%2)*3))%5,ly=y%5;
   let col='#919ba8';
   if(lx>0&&ly>0){
    const idx=Math.floor(H_(bx0+v*7,by0+v*11)*ST.length);
    col=ST[idx];
    if(ly===1)col='#f7f9fc';
    else if(lx===4||ly===4)col='#aab4c4';
   }
   if(!ins(x,y+1))col='#6f7b8c';
   else if(!ins(x,y-1))col='#f5f7fa';
   r(col,x,y,1,1);
  }
  if(!N&&!W)r('#6cc25b',2,1,2,1);
  if(!S&&!E_)r('#ff96bc',13,13,1,1);
 });
 return PS_CACHE[k]=c;
}

// Hàng rào tre đèn lồng tự liên kết 4 hướng (fencetb) — tre ngọc mượt, đốt tre + dây thừng X + đèn lồng nhịp nhàng
const FT_CACHE={};
function fenceBambooTile(m,hasLantern){
 const key=m+'_'+(hasLantern?1:0);
 if(FT_CACHE[key])return FT_CACHE[key];
 let N=m&1,E_=m&2,S=m&4,W=m&8;
 if(!m){E_=2;W=8}
 const BL='#b8eb8c',BG='#78c254',BM='#4e9434',BD='#2e6120',RP='#8f5424',RPD='#4a2810';
 const raw=mk(16,34,(g,r)=>{
  const B=32;
  const stalk=(x,h,w)=>{
   const top=B-h;
   r(BM,x,top,w,h);
   r(BG,x,top+1,Math.max(1,w-1),h-1);
   r(BL,x,top+1,1,h-2);
   if(w>=3)r(BD,x+w-1,top+1,1,h-2);
   for(let y=top+4;y<B-1;y+=5){r(BD,x,y,w,1);r(BL,x,y-1,Math.max(1,w-1),1)}
  };
  const hrail=(x0,x1)=>{
   if(x1<=x0)return;
   for(const ry of[B-11,B-5]){
    r(BD,x0,ry,x1-x0,2);r(BM,x0,ry,x1-x0,1);r(BG,x0,ry,x1-x0,1);
    for(let x=x0+2;x<x1-1;x+=5){r(BD,x,ry,1,2);r(BL,x+1,ry,1,1)}
   }
  };
  if(N){
   stalk(6,24,3);
   r(BM,7,2,2,14);r(BL,7,2,1,14);
  }
  if(W&&E_)hrail(0,16);
  else if(W)hrail(0,9);
  else if(E_)hrail(7,16);

  if(S){stalk(6,16,3);stalk(7,15,2)}

  const straightEW=E_&&W&&!N&&!S;
  if(straightEW&&!hasLantern){
   // tấm rào tre đan chéo thoáng mắt xen giữa các cột đèn
   for(const x of[2,7,12])stalk(x,14,2);
   for(const x of[2,12]){r(RPD,x,B-11,2,2);r(RP,x,B-11,1,1);r(RPD,x,B-5,2,2);r(RP,x,B-5,1,1)}
   // mầm lá tre xanh tươi ở góc trên
   r(BM,9,B-16,2,2);r(BL,10,B-17,2,1);
   return;
  }

  if(W&&!N)stalk(2,14,2);
  if(E_&&!N)stalk(12,14,2);

  if(hasLantern){
   // Trụ tre chính chắc chắn + dây buộc chữ X + tay treo uốn + đèn lồng giấy tre ấm
   stalk(5,23,4);
   for(const ry of[B-11,B-5]){r(RPD,5,ry,4,2);r(RP,5,ry,3,1)}
   // cành lá tre ở mắt đốt
   r(BG,2,B-18,3,1);r(BL,1,B-19,2,1);
   // tay treo cong phía đỉnh + đèn lồng giấy vàng cam
   r(BD,6,B-25,7,2);r(BL,7,B-25,5,1);r(RP,6,B-24,2,2);
   r('#4a2810',11,B-23,1,2);
   r('#8c1d18',9,B-21,5,1); // nắp đèn đỏ sẫm
   r('#ff7828',8,B-20,7,6);
   r('#ffb838',9,B-20,5,5);
   r('#ffe875',10,B-19,3,3);
   r('#fff9c4',11,B-19,1,2); // lõi nến sáng
   r('#8c1d18',9,B-14,5,1); // đáy đèn
   r('#ffd24a',11,B-13,1,2); // tua rua vàng
  }else{
   stalk(6,17,4);
   for(const ry of[B-11,B-5]){r(RPD,6,ry,4,2);r(RP,6,ry,3,1)}
  }
 });
 const outlined=edgeTile(raw,'#1b3812');
 const out=mk(16,34,(g,r)=>{
  E(r,'rgba(0,0,0,0.16)',8,32,7,2);
  g.drawImage(outlined,0,0);
 });
 return FT_CACHE[key]=out;
}

if(window.FMDX){
 window.FMDX.fencew=(tx,ty)=>{
  const X=tx*T,Y=ty*T,by=(ty+1)*T-1;
  return{im:fenceWhiteTile(myMask(FW_SET,tx,ty)),x:X,y:Y-12,by,hb:by,fw:1,fh:1,so:1};
 };
 window.FMDX.fencetb=(tx,ty)=>{
  const X=tx*T,Y=ty*T,by=(ty+1)*T-1;
  const m=myMask(FT_SET,tx,ty);
  const hasL=(m!==10&&m!==5)||(((tx+ty)&1)===0);
  return{im:fenceBambooTile(m,hasL),x:X,y:Y-18,by,hb:by,fw:1,fh:1,so:1};
 };
 window.FMDX.pathstone=(tx,ty)=>{
  const X=tx*T,Y=ty*T;
  return{im:pathStoneTile(myMask(PS_SET,tx,ty),(tx*7+ty*13)%3),x:X,y:Y,by:-4.4,hb:Y-1,fw:1,fh:1,so:0};
 };
}
S_.fencewT=fenceWhiteTile(10);
S_.fencetbT=fenceBambooTile(10,true);
S_.pathstoneT=pathStoneTile(10,0);

if(typeof window.fmKRebuild==='function'){
 const _oldK=window.fmKRebuild;
 window.fmKRebuild=function(){
  _oldK();
  rebuildMySets();
 };
}

if(typeof fmTap==='function'){
 const _oldTap=fmTap;
 window.fmTap=fmTap=function(wx,wy){
  const s=typeof FMSEL!=='undefined'?FMSEL:null;
  if(s&&s.k==='de'&&!s.o&&(s.id==='fencew'||s.id==='fencetb'||s.id==='pathstone')){
   const tx=Math.floor(wx/T),ty=Math.floor(wy/T);
   if(tx===s.tx&&ty===s.ty)return fmDo(0);
   s.tx=tx;s.ty=ty;
   return fmDo(0);
  }
  return _oldTap(wx,wy);
 };
}

// ============================================================
//  3. CỔNG VÒM HOA HỒNG (gatew, 4x1 = 70x78 + outl(), đi xuyên qua được!)
// ============================================================
const roseL=(r,x,y,c,d,m)=>{
 r(c,x-1,y-3,3,2);r(c,x-1,y+2,3,2);r(c,x-3,y-1,2,3);r(c,x+2,y-1,2,3);
 r(c,x-2,y-2,2,2);r(c,x+1,y-2,2,2);r(c,x-2,y+1,2,2);r(c,x+1,y+1,2,2);
 r(d,x+2,y-1,2,3);r(d,x-1,y+3,3,1);r(d,x+1,y+2,2,1);
 r(m,x-1,y-1,3,3);r('#b34b18',x,y,1,1);r('#ffffff',x-2,y-2,1,1);
};
const roseM=(r,x,y,c,d,m)=>{
 r(c,x-1,y-2,3,5);r(c,x-2,y-1,5,3);
 r(d,x+1,y+1,2,1);r(d,x,y+2,2,1);r(m,x,y,1,1);r('#ffffff',x-1,y-1,1,1);
};
const roseS=(r,x,y,c,m)=>{r(c,x,y-1,1,3);r(c,x-1,y,3,1);r(m,x,y,1,1)};

S_.gatew=mk(70,78,(g,r)=>{
 const CX=35,PL=5,PR=57,PB=74;
 const gArch=x=>13+Math.round(10*Math.pow((x-CX)/30,2));
 const WL='#ffffff',WM='#eef3fa',WS='#cad4e6',WD='#8496b5',WK='#556682';
 const G1='#245c2c',G2='#388a42',G3='#66c45e',G4='#9ef086';

 E(r,'rgba(0,0,0,0.18)',CX,PB+2,33,2);

 // Mấu nối thanh ngang hai mép cổng khớp với hàng rào gỗ trắng (fencew)
 for(const ry of[PB-10,PB-5]){
  r(WD,0,ry,6,3);r(WM,0,ry,6,2);r(WL,0,ry,6,1);
  r(WD,64,ry,6,3);r(WM,64,ry,6,2);r(WL,64,ry,6,1);
 }

 // Xà vòm gỗ trắng chạm khắc (2 lớp + bóng râm + thanh giằng lưới)
 for(let x=PL;x<=PR+7;x++){
  const y=gArch(x);
  r(WL,x,y,1,1);r(WM,x,y+1,1,3);r(WS,x,y+4,1,2);r(WD,x,y+6,1,1);r(WK,x,y+7,1,1);
 }
 for(let x=PL+3;x<=PR+4;x+=5){const y=gArch(x);r(WS,x,y+2,1,3)}
 // Nẹp lưới tam giác góc vòm
 for(let i=0;i<9;i++){
  const y=gArch(PL+8+i)+8+i;
  r(WM,PL+8+i,y,1,3);r(WL,PL+8+i,y,1,1);r(WD,PL+8+i,y+3,1,1);
  const x2=PR-i;
  r(WM,x2,gArch(x2)+8+i,1,3);r(WL,x2,gArch(x2)+8+i,1,1);r(WD,x2,gArch(x2)+11+i,1,1);
 }

 // Hai trụ cột trắng + chân đế đá + đèn lồng đồng sáng trên đỉnh trụ
 for(const x of[PL,PR]){
  // đèn lồng nhỏ trên đỉnh cột
  r('#3a485e',x+1,12,6,1);r('#3a485e',x+2,10,4,2);r('#ffd24a',x+3,9,2,1);
  r('#ffd866',x+2,13,4,5);r('#fff9c4',x+3,14,2,3);
  r('#3a485e',x+1,13,1,5);r('#3a485e',x+6,13,1,5);
  // mũ cột xòe
  r(WL,x-1,18,10,1);r(WM,x-1,19,10,2);r(WS,x-1,21,10,1);r(WD,x-1,22,10,1);
  // thân trụ trắng có panel chìm giữa
  r(WM,x,23,8,PB-26);r(WL,x,23,2,PB-26);r(WS,x+6,23,2,PB-26);r(WD,x+7,23,1,PB-26);
  r(WS,x+2,26,4,PB-32);r(WL,x+3,26,2,PB-32);
  for(const y of[36,52])r(WD,x,y,8,1);
  // đế đá cổ điển
  r('#ede8dd',x-1,PB-4,10,1);r('#cfc8ba',x-1,PB-3,10,2);r('#9e9788',x-1,PB-1,10,2);
 }

 // Huy hiệu hoa hồng vàng ở đỉnh vòm giữa cổng
 E(r,WD,CX,gArch(CX)+4,5,4);E(r,'#ffd24a',CX,gArch(CX)+4,4,3);E(r,'#fff4a8',CX-1,gArch(CX)+3,2,1);

 // Tán lá dây leo xanh 4 tông phủ vòm + dây rủ xuống
 for(let x=PL+1;x<=PR+6;x+=4){
  const y=gArch(x)-1+Math.round(H_(x,5)*2-1);
  E(r,G1,x,y+1,3,2);E(r,G2,x,y,3,2);E(r,G3,x-1,y-1,2,1);
  if(H_(x,9)<0.55)r(G4,x+1,y-2,1,1);
 }
 for(const[vx,len]of[[15,13],[19,7],[24,10],[45,10],[50,7],[54,13]]){
  const y0=gArch(vx)+7;
  r(G1,vx,y0,1,len);
  for(let i=2;i<len;i+=3)E(r,i%2?G2:G3,vx+(i%6<3?-1:1),y0+i,2,1);
 }
 // dây leo quấn quanh 2 trụ
 for(const x of[PL,PR]){
  r(G1,x+4,24,1,PB-28);
  for(let y=26;y<PB-6;y+=6){
   const k=((y/6)|0)%2;
   E(r,G2,x+(k?-1:7),y,2,2);E(r,G3,x+(k?-2:8),y-1,1,1);r(G1,x+(k?1:5),y+1,2,1);
  }
 }
 // khóm cỏ hoa nhỏ chân cột
 for(const bx of[1,15,49,62]){
  for(let i=0;i<5;i++)r(i%2?G2:G3,bx+i,PB-2-(i%2),1,2+(i%2));
 }

 // Chùm hoa hồng đỏ/hồng/kem/vàng rải đều quanh vòm & trụ
 const P={pk:['#ff7aa8','#d43b70','#ffe07d'],cr:['#ff526c','#b81d38','#ffe894'],wh:['#ffffff','#d6dff0','#ffd23f'],ye:['#ffe27a','#e0a82e','#ff9a3c']};
 roseL(r,CX,10,...P.cr);
 roseL(r,11,24,...P.pk);roseL(r,59,24,...P.pk);
 roseL(r,22,15,...P.wh);roseL(r,48,15,...P.wh);
 roseL(r,9,42,...P.pk);roseL(r,61,42,...P.ye);
 roseL(r,10,59,...P.cr);roseL(r,60,59,...P.pk);
 roseM(r,16,19,...P.ye);roseM(r,54,19,...P.pk);
 roseM(r,28,13,...P.pk);roseM(r,42,13,...P.wh);
 roseM(r,7,32,...P.wh);roseM(r,63,33,...P.cr);
 roseM(r,8,50,...P.ye);roseM(r,62,51,...P.wh);
 for(const[fx,fy,k]of[[19,18,'pk'],[51,18,'ye'],[31,12,'wh'],[39,12,'pk'],[15,28,'cr'],[55,29,'pk'],[2,71,'pk'],[16,72,'wh'],[51,72,'ye'],[66,71,'pk']]){
  roseS(r,fx,fy,P[k][0],P[k][2]);
 }
});
S_.gatewO=outl(S_.gatew);
FMANI.gatew=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 // Đom đóm cánh hoa hồng & ánh đèn trụ cổng dịu nhẹ
 for(let i=0;i<2;i++){
  const px=Math.round(ox+20+i*28+Math.sin(t*1.6+i*2.1)*5);
  const py=Math.round(oy+16+((t*5+i*9)%18));
  cx.globalAlpha=0.82;
  r(i?'#ffe0f0':'#fff6a8',px,py,2,1);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  4. BÙ NHÌN HOA HƯỚNG DƯƠNG (bunhinh, 1x1, hoạt ảnh khăn bay)
// ============================================================
S_.bunhinh=mk(30,44,(g,r)=>{
 E(r,'rgba(0,0,0,0.18)',15,41,8,2);
 r('#6b4020',14,18,3,24);r('#9e6638',14,18,1,24);
 r('#6b4020',4,22,22,2);r('#9e6638',5,22,20,1);
 for(const[sx,sy]of[[2,21],[26,21],[12,35],[17,35]]){r('#f2c85b',sx,sy,2,3);r('#d49e2a',sx+1,sy+1,1,2)}
 bxd(r,9,20,12,8,'#e88b4a','#b55a24');
 r('#3c70b8',10,24,10,11);r('#5b94e0',11,24,3,9);r('#264c85',18,24,2,11);
 r('#ffd24a',11,25,1,1);r('#ffd24a',18,25,1,1);
 E(r,'#c99c60',15,14,5,5);E(r,'#e8c28a',15,13,4,4);
 r('#261a14',13,13,1,2);r('#261a14',17,13,1,2);
 r('#ff8fa8',12,15,1,1);r('#ff8fa8',18,15,1,1);
 r('#7a4e26',13,16,5,1);
 E(r,'#d4a035',15,9,8,2);E(r,'#f5d066',15,9,7,1);
 bxd(r,11,5,8,4,'#f0c04a','#b88422');
 r('#e84a3c',11,8,8,1);
 r('#ffb824',18,4,4,4);r('#ffe466',19,3,2,6);r('#ffe466',17,5,6,2);
 r('#5c3416',19,5,2,2);
 r('#4ec0f0',23,19,4,3);r('#8ae4ff',24,19,2,1);r('#ffd24a',27,20,1,1);r('#222',26,20,1,1);
});
FMANI.bunhinh=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 const sw=Math.round(Math.sin(t*3.2+a.x)*1.5);
 r('#e84848',ox+11,oy+18,8,2);
 r('#ff7373',ox+6-sw,oy+19,5,2);
 r('#c42b2b',ox+4-sw,oy+20,3,2);
};

// ============================================================
//  5. ĐÀI PHUN NƯỚC ĐÁ (fountain, 3x2 = 48x44) — tia nước phun động!
// ============================================================
S_.fountain=mk(48,44,(g,r)=>{
 E(r,'rgba(0,0,0,0.2)',24,37,22,7);
 E(r,'#7c8794',24,35,22,8);
 E(r,'#aeb8c4',24,33,22,8);
 E(r,'#dce4ed',24,31,21,7);
 E(r,'#2684a3',24,31,18,5);
 E(r,'#45b6d4',24,31,15,4);
 bxd(r,20,17,8,14,'#c2ccd6','#7c8794');
 E(r,'#8a95a3',24,19,11,4);
 E(r,'#dce4ed',24,18,10,3);
 E(r,'#45b6d4',24,18,8,2);
 bxd(r,22,11,4,7,'#dce4ed','#8a95a3');
 r('#ffffff',23,10,2,2);
});
FMANI.fountain=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 for(let i=0;i<8;i++){
  const p=(t*1.9+i*0.125)%1;
  const dx=p*9,dy=-Math.sin(p*Math.PI)*7+p*8;
  r(p<0.4?'#ffffff':'#8ef2ff',Math.round(ox+24+dx),Math.round(oy+10+dy),1,1);
  r(p<0.4?'#ffffff':'#8ef2ff',Math.round(ox+23-dx),Math.round(oy+10+dy),1,1);
 }
 for(const tx of[16,20,27,31]){
  const dy=Math.floor((t*14+tx)%10);
  r('#8ef2ff',ox+tx,oy+20,2,10);
  r('#ffffff',ox+tx,oy+20+dy,1,2);
 }
 const R=4+((t*7)%8);
 cx.globalAlpha=Math.max(0,1-(R-4)/8)*0.65;
 r('#ffffff',Math.round(ox+24-R),oy+32,Math.round(R*2),1);
 cx.globalAlpha=1;
};

// ============================================================
//  6. ĐÈN NẤM LÙN (mushlamp1, 1x1) & ĐÈN NẤM CAO (mushlamp2, 1x1)
// ============================================================
S_.mushlamp1=mk(24,28,(g,r)=>{
 E(r,'rgba(0,0,0,0.18)',12,26,9,2);
 E(r,'#479c48',12,25,8,2);r('#7ce06c',9,24,3,2);
 bxd(r,9,17,6,9,'#fff5db','#d4be94');
 bxd(r,4,20,3,6,'#fff5db','#d4be94');
 E(r,'#c95c14',12,13,8,5);
 E(r,'#ff9a2e',12,12,7,4);
 E(r,'#ffd866',11,11,5,2);
 r('#fff8db',8,12,2,2);r('#fff8db',14,11,2,2);r('#fff8db',15,14,1,1);
 E(r,'#e6731e',5,18,4,3);E(r,'#ffbf47',5,17,3,2);r('#fff8db',4,18,1,1);
});
FMANI.mushlamp1=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 const a2=0.35+0.4*Math.sin(t*3.2+a.x);
 cx.globalAlpha=a2;
 r('#ffe98a',ox+10,oy+11,4,2);
 r('#fff7c2',ox+8,oy+7+Math.round(Math.sin(t*2)*1),1,1);
 r('#fff7c2',ox+16,oy+8+Math.round(Math.cos(t*2.3)*1),1,1);
 cx.globalAlpha=1;
};

S_.mushlamp2=mk(24,44,(g,r)=>{
 E(r,'rgba(0,0,0,0.18)',12,42,8,2);
 E(r,'#3f8c4a',12,40,7,2);
 bxd(r,11,16,3,25,'#e3f6ff','#9cb8d4');
 bxd(r,7,25,2,15,'#e3f6ff','#9cb8d4');
 E(r,'#2e7bc4',12,12,8,6);
 E(r,'#49d6ff',12,11,7,5);
 E(r,'#b5fbff',11,9,4,3);
 r('#ffffff',8,11,2,2);r('#ffffff',14,10,2,2);r('#ffffff',15,14,1,1);
 E(r,'#784acc',8,22,5,3);E(r,'#c28eff',8,21,4,2);r('#ffffff',6,21,1,1);
});
FMANI.mushlamp2=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 const gl=0.45+0.45*Math.sin(t*2.6+a.x);
 cx.globalAlpha=gl;
 r('#9efbff',ox+6,oy+16,1,2);r('#ffffff',ox+17,oy+16,1,2);
 r('#d9b8ff',ox+4,oy+24,1,1);
 cx.globalAlpha=1;
};

// ============================================================
//  7. ĐÈN CỔ TÍCH (fairylamp, 1x1 = 24x54)
// ============================================================
S_.fairylamp=mk(24,54,(g,r)=>{
 E(r,'rgba(0,0,0,0.2)',10,52,7,2);
 bxd(r,7,47,6,5,'#3c4759','#1f2633');
 bxd(r,8,43,4,4,'#4d5c73','#262f40');
 r('#262f40',9,8,2,36);r('#5f728f',9,8,1,36);
 r('#262f40',9,6,8,2);r('#5f728f',10,6,6,1);
 r('#ffd45a',8,20,4,1);r('#ffd45a',8,35,4,1);
 r('#49a854',8,26,3,3);r('#ff85b3',8,25,2,2);
 r('#49a854',9,14,3,3);r('#ffd866',10,14,2,2);
 r('#262f40',17,8,1,3);
 bxd(r,14,11,7,2,'#262f40','#141821');
 r('#ffd85a',15,13,5,7);
 r('#fff6b8',16,14,3,5);
 r('#262f40',14,13,1,7);r('#262f40',20,13,1,7);
 bxd(r,15,20,5,2,'#262f40','#141821');
});
FMANI.fairylamp=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 const p=0.55+0.35*Math.sin(t*3.8+a.x);
 cx.globalAlpha=p*0.42;
 E(r,'#ffe680',ox+17,oy+16,6,6);
 cx.globalAlpha=0.95;
 r('#ffffff',ox+16,oy+15,3,3);
 cx.globalAlpha=1;
};

// ============================================================
//  8. XÍCH ĐU GỖ TREO HOA (swing, 3x1 = 50x48)
// ============================================================
S_.swing=mk(50,48,(g,r)=>{
 E(r,'rgba(0,0,0,0.16)',10,45,6,2);
 E(r,'rgba(0,0,0,0.16)',40,45,6,2);
 r('#6e4222',7,5,4,40);r('#a86f3e',8,5,2,40);
 r('#6e4222',39,5,4,40);r('#a86f3e',40,5,2,40);
 r('#6e4222',5,11,3,34);r('#8f5a30',6,11,1,34);
 r('#6e4222',42,11,3,34);r('#8f5a30',43,11,1,34);
 bxd(r,4,3,42,4,'#a86f3e','#6e4222');
 for(let x=6;x<=43;x+=4){
  const drop=(x%8===0)?2:1;
  E(r,'#3d9448',x,2,4,2+drop);r('#6fd16b',x,1,2,2);
  if(x%8===2){r('#ff78a8',x,3,2,2);r('#ffc9e0',x,3,1,1)}
  else if(x%8===6){r('#d18cff',x,3,2,2);r('#f3dbff',x,3,1,1)}
 }
 r('#5ab856',5,43,6,2);r('#ff96bc',8,42,2,2);
 r('#5ab856',39,43,6,2);r('#ffe26a',40,42,2,2);
});
S_.swingO=outl(S_.swing);
if(window.FMDX){
 window.FMDX.swing=(tx,ty)=>{
  const X=tx*T,by=(ty+1)*T-1;
  return{im:S_.swingO,x:X-2,y:by-47,by:by-14,hb:by,fw:3,fh:1,so:1};
 };
}
FMANI.swing=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 const seated=typeof Pl!=='undefined'&&Pl.sit===2&&Math.hypot(Pl.x-(X+24),Pl.y-(a.hb-7))<4;
 const sw=seated?0:Math.round(Math.sin(t*1.8+a.x)*2);
 r('#c9a266',ox+15,oy+7,1,28);
 r('#c9a266',ox+34,oy+7,1,28);
 r('#e6c288',ox+15+Math.round(sw*0.5),oy+20,1,15);
 r('#e6c288',ox+34+Math.round(sw*0.5),oy+20,1,15);
 bxd(r,ox+13+sw,oy+35,24,4,'#d99c5a','#8a5224');
 r('#ffb8d2',ox+15+sw,oy+34,20,2);
};

// ============================================================
//  9. BÀN TRÀ SÂN VƯỜN (teagarden, 3x1 = 48x36)
// ============================================================
S_.teagarden=mk(48,36,(g,r)=>{
 E(r,'rgba(0,0,0,0.16)',24,33,22,3);
 const chair=cxp=>{
  r('#9eb0c4',cxp+1,14,8,2);r('#ffffff',cxp+2,13,6,2);
  r('#9eb0c4',cxp+1,16,2,8);r('#ffffff',cxp+1,16,1,8);
  r('#9eb0c4',cxp+7,16,2,8);r('#ffffff',cxp+8,16,1,8);
  r('#ffd9e8',cxp+3,16,4,6);r('#ffb3d1',cxp+3,20,4,2);
  bxd(r,cxp,23,10,3,'#ff9ec4','#d46e98');
  r('#ffffff',cxp+1,23,8,1);
  r('#9eb0c4',cxp+1,26,2,7);r('#ffffff',cxp+1,26,1,7);
  r('#9eb0c4',cxp+7,26,2,7);r('#ffffff',cxp+7,26,1,7);
 };
 chair(2);chair(36);
 r('#9eb0c4',23,22,2,11);r('#ffffff',20,32,8,2);r('#9eb0c4',20,33,8,1);
 E(r,'#9eb0c4',24,22,8,3);
 E(r,'#ffffff',24,21,8,3);
 r('#ffb8d2',17,23,14,2);
 r('#fff0f5',19,17,4,3);r('#ff8fb5',20,16,2,1);
 r('#8ad8ff',27,18,2,2);r('#8ad8ff',30,19,2,2);
 r('#6ec268',23,15,3,4);r('#ff6fa8',22,13,2,2);r('#ffe26a',24,13,2,2);
});
S_.teagardenO=outl(S_.teagarden);
if(window.FMDX){
 window.FMDX.teagarden=(tx,ty)=>{
  const X=tx*T,by=(ty+1)*T-1;
  return{im:S_.teagardenO,x:X-1,y:by-35,by:by-10,hb:by,fw:3,fh:1,so:1};
 };
}

// ============================================================
//  10. NHÀ KÍNH HOA MINI VICTORIA (greenhouse, 3x2 = 54x54 + outl())
// ============================================================
S_.greenhouse=mk(54,54,(g,r)=>{
 const CX=27,B=51;
 const FL='#ffffff',FM='#eef5f0',FS='#bdd4c7',FD='#6e9680',FK='#3e5e4d';
 const BRK1='#c96e4b',BRK2='#a64f32',MOR='#e6d8cc';

 E(r,'rgba(0,0,0,0.20)',CX,B,24,3);

 // Khung bóng xanh thẫm bên trong (làm nền tương phản để hoa phía sau kính bật sắc rực rỡ)
 for(let i=0;i<=12;i++){
  const hw=10+i;
  r('#214a39',CX-hw,6+i,hw*2,1);
 }
 r('#1d4233',5,18,44,23);

 // Bồn đất & 3 tầng hoa rực rỡ bên trong nhà kính
 // Tầng 1 (cao): 2 giỏ hoa treo đung đưa dưới mái
 for(const bx of[13,39]){
  r('#704828',bx,12,1,4);
  bxd(r,bx-2,16,5,3,'#d99a5b','#8f5528');
  r('#4eb856',bx-3,15,7,2);
  r('#ff78a8',bx-2,14,2,2);r('#ffd866',bx+1,14,2,2);r('#ffffff',bx,15,1,1);
 }
 // Đèn treo vàng ấm dưới đỉnh chóp mái
 r('#5c3c20',CX-1,10,2,4);r('#ffd85a',CX-2,14,4,3);r('#fffbe0',CX-1,14,2,2);
 // Tầng 2 (giữa): kệ gỗ + chậu tulip hồng, hoa oải hương tím, cúc vàng
 r('#8f5a30',7,31,12,2);r('#8f5a30',35,31,12,2);
 const pot=(px,py,fc,hi)=>{
  r('#c96846',px,py+3,3,3);r('#964228',px+2,py+3,1,3);
  r('#4eb856',px+1,py+1,1,2);r('#75d678',px,py+2,1,1);
  r(fc,px,py-1,3,2);r(hi,px,py-1,1,1);
 };
 pot(8,25,'#ff6b9d','#ffd1e3');pot(13,25,'#c785ff','#f0dbff');
 pot(36,25,'#ffd23f','#fff7b2');pot(41,25,'#ff5c77','#ffc7d1');
 // Tầng 3 (sàn): luống hướng dương vàng & hồng nhung dọc cửa sổ
 for(const fx of[7,11,15,36,40,44]){
  r('#388e42',fx+1,34,1,6);r('#68c760',fx,36,3,2);
  E(r,fx%2?'#ffd23f':'#ff78a8',fx+1,33,2,2);
  r(fx%2?'#5c3416':'#fff4b8',fx+1,33,1,1);
 }

 // Tấm kính xanh ngọc trong & vệt phản sáng chéo (nằm sau nẹp gỗ để nẹp sắc nét)
 for(let i=0;i<=11;i++){
  const hw=10+i;
  r('rgba(176,238,255,0.28)',CX-hw+1,7+i,hw*2-2,1);
 }
 r('rgba(176,238,255,0.24)',5,18,44,22);
 // ánh kính phản chiếu chéo từng ô
 for(let k=0;k<7;k++){
  r('rgba(255,255,255,0.52)',8+k,29-k,2,1);
  r('rgba(255,255,255,0.48)',37+k,29-k,2,1);
  r('rgba(255,255,255,0.45)',18+k,16-k,2,1);
 }

 // Chân tường gạch đất nung & viền đá kem (y=40..49)
 r(MOR,4,40,46,9);
 for(let y=41;y<49;y+=2){
  const off=(y%4===1)?0:3;
  for(let x=4+off;x<48;x+=5)r((x+y)%3?BRK1:BRK2,x,y,4,1);
 }
 r(FK,4,49,46,1);
 r('#f2ece1',3,39,48,2);r('#bdb3a2',3,40,48,1); // bệ đá bậu cửa sổ

 // Khung cột & nẹp cửa kính Victoria (xanh bạc hà kem + viền xanh rêu đậm)
 r(FD,4,18,2,22);r(FL,4,18,1,22);
 r(FD,48,18,2,22);r(FL,49,18,1,22);
 for(const mx of[12,19,34,41]){r(FD,mx,18,2,22);r(FM,mx,18,1,22)}
 r(FD,4,29,16,1);r(FD,34,29,16,1);
 // Mái vòm chữ A giật cấp & chóp sắt Victoria
 for(let i=0;i<=12;i++){
  const hw=11+i,y=6+i;
  r(FK,CX-hw-1,y,2,2);r(FL,CX-hw,y,1,1);
  r(FK,CX+hw-1,y,2,2);r(FM,CX+hw-1,y,1,1);
 }
 r(FD,3,17,48,2);r(FL,4,17,46,1);
 // Sống mái ngang trên đỉnh + chóp trang trí đồng vàng
 r(FD,CX-11,5,22,2);r(FL,CX-11,5,22,1);
 for(let x=CX-9;x<=CX+9;x+=3)r(FK,x,3,1,2);
 r('#ffd24a',CX-1,1,2,4);r('#fff8c4',CX-1,1,1,1);

 // Cửa chính vòm kính đôi ở giữa (x=20..33, y=20..49)
 r(FK,19,20,16,30);r(FM,20,21,14,28);
 r('#1c3f30',21,22,12,26);
 r('rgba(176,238,255,0.34)',21,22,12,24);
 // đố chữ thập cửa kính & nắm đồng
 r(FM,26,22,2,26);r(FM,21,31,12,2);
 r('#ffd24a',25,35,1,2);r('#ffd24a',28,35,1,2);
 // bậc thềm đá trước cửa
 r('#ede7dc',18,49,18,2);r('#9e9484',18,50,18,1);

 // Dây leo hoa hồng bám góc trái & 2 chậu hoa + bình tưới đồng trước hiên
 r('#2e7a3b',4,22,2,16);r('#68c760',3,25,2,6);r('#ff78a8',3,26,2,2);r('#ffe26a',4,32,2,2);
 bxd(r,14,45,4,5,'#d97852','#9e4d2d');r('#4cb856',14,43,4,2);r('#ff78a8',15,42,2,2);
 bxd(r,36,45,4,5,'#d97852','#9e4d2d');r('#4cb856',36,43,4,2);r('#ffd866',37,42,2,2);
 // bình tưới cây đồng nhỏ bên bậc thềm phải
 bxd(r,43,46,4,4,'#e89f48','#9e5d1e');r('#f7ca7e',42,45,2,2);
});
S_.greenhouseO=outl(S_.greenhouse);
FMANI.greenhouse=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 // Đèn lồng bên trong hơi nhấp nháy ấm áp
 const p=0.45+0.35*Math.sin(t*2.8+a.x);
 cx.globalAlpha=p;
 r('#fff9c4',ox+26,oy+14,2,2);
 // 2 chú bướm nhỏ bay lượn quanh nhà kính hoa
 const cols=['#ffd23f','#ff8ec7'];
 cx.globalAlpha=0.95;
 for(let i=0;i<2;i++){
  const bx=Math.round(ox+27+Math.sin(t*(1.4+i*0.4)+i*2.5)*18);
  const by=Math.round(oy+11+Math.cos(t*(2.1+i*0.3)+i)*5);
  const fl=Math.floor(t*10+i)%2;
  r(cols[i],bx-(fl?2:1),by,fl?2:1,2);
  r(cols[i],bx+1,by,fl?2:1,2);
  r('#3a2414',bx,by,1,2);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  11. NHÀ KÍNH THỰC VẬT LỚN VICTORIA (greenhouselg, 5x3 = 86x78 + outl())
// ============================================================
S_.greenhouselg=mk(86,78,(g,r)=>{
 const CX=43,B=75;
 const FL='#ffffff',FM='#eef5f0',FS='#bdd4c7',FD='#5d8770',FK='#345243';
 const BRK1='#c96e4b',BRK2='#a64f32',MOR='#e6d8cc';

 E(r,'rgba(0,0,0,0.22)',CX,B,40,3);

 // Khung bóng xanh thẫm bên trong để tán cây & hoa nổi bật rực rỡ qua lớp kính
 for(let i=0;i<=14;i++){
  const hw=Math.round(4+17*Math.sqrt(Math.max(0,1-Math.pow(1-i/14,2))));
  r('#193d2f',CX-hw,9+i,hw*2,1);
 }
 for(let i=0;i<=8;i++){
  r('#1d4435',6+Math.max(0,8-i),25+i,74-Math.max(0,8-i)*2,1);
 }
 r('#193d2f',6,33,74,31);

 // --- Cây & hoa nhiều tầng bên trong hai cánh và vòm trung tâm ---
 // Cây cam/hoa anh đào bonsai cao ở chính giữa dưới vòm kính
 r('#6e4423',CX-2,36,4,22);r('#8f5a30',CX-2,36,1,20);
 r('#6e4423',CX-7,38,5,2);r('#6e4423',CX+2,35,6,2);
 E(r,'#2e7d3b',CX,28,12,8);E(r,'#48a852',CX-3,26,9,6);E(r,'#73d46c',CX-5,24,6,4);
 for(const[fx,fy,fc]of[[CX-6,25,'#ff7aa8'],[CX+4,26,'#ffd866'],[CX,23,'#ff7aa8'],[CX-2,30,'#ffd866'],[CX+6,29,'#ffb3d1'],[CX-8,28,'#ffe875']]){
  r(fc,fx,fy,2,2);r('#fff8d6',fx,fy,1,1);
 }
 // 3 đèn lồng treo ấm bên trong (giữa vòm + cánh trái + cánh phải)
 for(const[lx,ly]of[[CX,15],[15,34],[71,34]]){
  r('#4a2e16',lx,ly-3,1,4);r('#ffd24a',lx-2,ly+1,4,4);r('#fffbe0',lx-1,ly+1,2,3);
 }
 // Cánh trái: kệ gỗ 2 tầng với chậu oải hương, hoa hồng, dương xỉ rủ
 r('#8f5a30',8,46,16,2);r('#6b4020',8,48,16,1);
 const mpot=(px,py,fc,hi)=>{
  r('#c96846',px,py+3,3,3);r('#964228',px+2,py+3,1,3);
  r('#4eb856',px+1,py+1,1,2);r('#75d678',px,py+2,1,1);
  r(fc,px,py-1,3,2);r(hi,px,py-1,1,1);
 };
 mpot(9,40,'#c785ff','#f0dbff');mpot(14,40,'#ff6b9d','#ffd1e3');mpot(19,40,'#ff9a3c','#ffe0b2');
 // Tầng sàn cánh trái: luống hoa cúc & hướng dương
 for(const fx of[8,13,18,23]){
  r('#388e42',fx+1,55,1,8);r('#68c760',fx,57,3,2);
  E(r,fx%2?'#ffd23f':'#ff78a8',fx+1,54,2,2);
  r('#fff8c4',fx+1,54,1,1);
 }
 // Cánh phải: kệ gỗ + cẩm tú cầu xanh, hồng môn, hoa hướng dương
 r('#8f5a30',62,46,16,2);r('#6b4020',62,48,16,1);
 mpot(63,40,'#5ee0ff','#d6faff');mpot(68,40,'#ff5c77','#ffc7d1');mpot(73,40,'#ffd23f','#fff7b2');
 for(const fx of[62,67,72,77]){
  r('#388e42',fx+1,55,1,8);r('#68c760',fx,57,3,2);
  E(r,fx%2?'#5ee0ff':'#ffd23f',fx+1,54,2,2);
  r('#ffffff',fx+1,54,1,1);
 }

 // --- Lớp kính xanh ngọc trong suốt & ánh phản chiếu chéo ---
 for(let i=0;i<=13;i++){
  const hw=Math.round(3+16*Math.sqrt(Math.max(0,1-Math.pow(1-i/13,2))));
  r('rgba(176,238,255,0.28)',CX-hw,10+i,hw*2,1);
 }
 for(let i=0;i<=7;i++){
  r('rgba(176,238,255,0.24)',7+Math.max(0,7-i),26+i,72-Math.max(0,7-i)*2,1);
 }
 r('rgba(176,238,255,0.22)',6,33,74,30);
 for(let k=0;k<8;k++){
  r('rgba(255,255,255,0.52)',10+k,43-k,2,1);
  r('rgba(255,255,255,0.48)',66+k,43-k,2,1);
  r('rgba(255,255,255,0.44)',34+k,22-k,2,1);
  r('rgba(255,255,255,0.38)',28+k,50-k,2,1);
 }

 // --- Chân tường gạch đất nung & bậu đá kem hai bên (y=63..72) ---
 r(MOR,5,63,76,9);
 for(let y=64;y<72;y+=2){
  const off=(y%4===0)?0:3;
  for(let x=5+off;x<78;x+=5)r((x+y)%3?BRK1:BRK2,x,y,4,1);
 }
 r(FK,5,72,76,1);
 r('#f2ece1',4,62,78,2);r('#bdb3a2',4,63,78,1);

 // --- Khung cột sắt sơn trắng bạc hà & gân vòm Victoria ---
 r(FD,5,33,2,30);r(FL,5,33,1,30);
 r(FD,79,33,2,30);r(FL,80,33,1,30);
 for(const mx of[13,20,27,57,64,71]){r(FD,mx,33,2,30);r(FM,mx,33,1,30)}
 r(FD,5,47,24,1);r(FD,57,47,24,1);
 // Sườn mái nghiêng hai cánh
 for(let i=0;i<=8;i++){
  const xL=14-i,xR=72+i,y=25+i;
  r(FK,xL,y,2,2);r(FL,xL+1,y,1,1);
  r(FK,xR-1,y,2,2);r(FM,xR-1,y,1,1);
 }
 r(FD,4,32,78,2);r(FL,5,32,76,1);
 // Mái vòm cao trung tâm & chóp trang trí hoa sắt đồng vàng
 for(let i=0;i<=14;i++){
  const hw=Math.round(4+18*Math.sqrt(Math.max(0,1-Math.pow(1-i/14,2))));
  const y=9+i;
  r(FK,CX-hw-1,y,2,2);r(FL,CX-hw,y,1,1);
  r(FK,CX+hw-1,y,2,2);r(FM,CX+hw-1,y,1,1);
 }
 r(FD,CX-19,23,38,2);r(FL,CX-18,23,36,1);
 // Họa tiết chóp nóc & cầu đồng vàng
 r(FD,CX-7,7,14,2);r(FL,CX-6,7,12,1);
 for(let x=CX-6;x<=CX+6;x+=3)r(FK,x,5,1,2);
 r('#ffd24a',CX-1,1,2,6);r('#fff8c4',CX-1,2,1,2);

 // --- Tiền sảnh cửa vòm đôi ở chính giữa (x=31..55, y=28..73) ---
 r(FK,30,28,26,45);r(FL,31,29,24,43);
 // vòm tròn phía trên cửa đôi
 r(FK,33,24,20,5);r(FM,34,25,18,4);
 r('#193d2f',33,27,20,44);
 r('rgba(176,238,255,0.34)',33,27,20,40);
 r(FM,42,27,2,44);r(FM,33,40,20,2);r(FM,33,55,20,2);
 r('#ffd24a',40,51,1,3);r('#ffd24a',45,51,1,3);
 // Bậc thềm đá rộng phía trước cửa
 r('#ede7dc',28,72,30,3);r('#cfc8ba',28,73,30,1);r('#9e9484',27,74,32,1);

 // --- Dây hoa hồng leo & chậu cảnh trước hiên ---
 r('#2e7a3b',5,36,2,24);r('#68c760',4,40,2,8);r('#ff78a8',4,41,2,2);r('#ffe26a',5,50,2,2);
 r('#2e7a3b',79,36,2,24);r('#68c760',80,41,2,8);r('#ff78a8',80,44,2,2);r('#ffe26a',79,53,2,2);
 // 2 chậu cây nguyệt quế/hoa hai bên bậc cửa
 for(const px of[23,59]){
  bxd(r,px,66,5,6,'#d97852','#9e4d2d');
  r('#388e42',px,62,5,4);r('#68c760',px+1,60,3,3);
  r(px<40?'#ff78a8':'#ffd866',px+1,61,2,2);
 }
 // bình tưới cây đồng & xẻng vườn nhỏ
 bxd(r,68,68,5,4,'#e89f48','#9e5d1e');r('#f7ca7e',67,67,2,2);
});
S_.greenhouselgO=outl(S_.greenhouselg);
FMANI.greenhouselg=(a,X,Y)=>{
 cx.drawImage(a.im,a.x,a.y);
 const t=performance.now()/1000,ox=a.x+1,oy=a.y+1;
 // Đèn lồng bên trong nhấp nháy ấm áp (vòm giữa + 2 cánh)
 const p=0.45+0.35*Math.sin(t*2.6+a.x);
 cx.globalAlpha=p;
 r('#fff9c4',ox+42,oy+16,2,3);
 r('#fff9c4',ox+14,oy+35,2,3);
 r('#fff9c4',ox+70,oy+35,2,3);
 // Vệt nắng lướt nhẹ trên mái kính
 const sh=Math.floor((t*10)%36);
 if(sh<12){
  cx.globalAlpha=0.22;
  r('#ffffff',ox+33+sh,oy+14,2,7);
 }
 // 3 chú bướm nhỏ bay lượn quanh nhà kính lớn
 const cols=['#ffd23f','#ff8ec7','#8ef2ff'];
 cx.globalAlpha=0.95;
 for(let i=0;i<3;i++){
  const bx=Math.round(ox+43+Math.sin(t*(1.2+i*0.35)+i*2.1)*28);
  const by=Math.round(oy+18+Math.cos(t*(1.9+i*0.3)+i)*8);
  const fl=Math.floor(t*10+i)%2;
  r(cols[i],bx-(fl?2:1),by,fl?2:1,2);
  r(cols[i],bx+1,by,fl?2:1,2);
  r('#3a2414',bx,by,1,2);
 }
 cx.globalAlpha=1;
};

if(window.FMDX){
 window.FMDX.gatew=(tx,ty)=>{
  const X=tx*T,Y=ty*T;
  return{im:S_.gatewO,x:Math.round(X+32-S_.gatewO.width/2),y:(ty+1)*T-1-S_.gatewO.height+1,by:Y+9,hb:(ty+1)*T-1,fw:4,fh:1,so:0};
 };
 window.FMDX.greenhouse=(tx,ty)=>{
  const X=tx*T,by=(ty+2)*T-1;
  return{im:S_.greenhouseO,x:X-4,y:by-54,by:by-4,hb:by,fw:3,fh:2,so:1};
 };
 window.FMDX.greenhouselg=(tx,ty)=>{
  const X=tx*T,by=(ty+3)*T-1;
  return{im:S_.greenhouselgO,x:X-4,y:by-78,by:by-5,hb:by,fw:5,fh:3,so:1};
 };
}

// ============================================================
//  ĐĂNG KÝ VÀO FMD & HỖ TRỢ NGỒI (swing, teagarden)
// ============================================================
Object.assign(FMD,{
 pathstone:['Lối đi lát đá',()=>S_.pathstoneT,1,1,0,'p',15],
 fencew:['Hàng rào gỗ trắng',()=>S_.fencewT,1,1,1,'p',35],
 fencetb:['Hàng rào tre đèn lồng',()=>S_.fencetbT,1,1,1,'p',55],
 gatew:['Cổng vòm hoa hồng',()=>S_.gatewO,4,1,0,'p',600],
 bunhinh:['Bù nhìn hoa hướng dương',()=>S_.bunhinh,1,1,1,'v',250],
 fountain:['Đài phun nước đá',()=>S_.fountain,3,2,1,'k',1800],
 greenhouse:['Nhà kính hoa mini',()=>S_.greenhouseO,3,2,1,'v',1450],
 greenhouselg:['Nhà kính thực vật lớn',()=>S_.greenhouselgO,5,3,1,'k',3400],
 mushlamp1:['Đèn nấm lùn',()=>S_.mushlamp1,1,1,1,'b',280],
 mushlamp2:['Đèn nấm cao',()=>S_.mushlamp2,1,1,1,'b',420],
 fairylamp:['Đèn cổ tích',()=>S_.fairylamp,1,1,1,'k',550],
 swing:['Xích đu gỗ treo hoa',()=>S_.swingO,3,1,1,'k',1200],
 teagarden:['Bàn trà sân vườn',()=>S_.teagardenO,3,1,1,'v',850]
});

if(typeof fmBuild==='function'){
 const _oldBuild=fmBuild;
 window.fmBuild=fmBuild=function(o,out,a){
  _oldBuild(o,out,a);
  if(o&&o[0]==='de'){
   const id=o[1],tx=o[2],ty=o[3],X=tx*T,yb=(ty+a.fh)*T-1;
   if(id==='swing'){
    out.h.push([a.x+8,a.y+8,34,40,'🌸 Xích đu gỗ treo hoa — bấm để ngồi','fmsit:'+(X+24)+':'+(yb-7)+':'+(yb+10),[X+24,yb+10]]);
   }else if(id==='teagarden'){
    out.h.push([a.x+1,a.y+8,16,28,'🍵 Ghế trái — bấm để ngồi thưởng trà','fmsit:'+(X+7)+':'+(yb-6)+':'+(yb+8),[X+7,yb+8]]);
    out.h.push([a.x+33,a.y+8,16,28,'🍵 Ghế phải — bấm để ngồi thưởng trà','fmsit:'+(X+41)+':'+(yb-6)+':'+(yb+8),[X+41,yb+8]]);
   }
  }
 };
}

// Khôi phục lại đồ trang trí nông trại mới từ nt_save nếu fmInit() đã chạy trước khi script này nạp
const NEW_KEYS=new Set(['pathstone','fencew','fencetb','gatew','bunhinh','fountain','greenhouse','greenhouselg','mushlamp1','mushlamp2','fairylamp','swing','teagarden']);
try{
 if(typeof ST!=='undefined'&&ST.fm&&Array.isArray(ST.fm.p)&&ST.fm.d&&typeof localStorage!=='undefined'){
  const raw=localStorage.getItem('nt_save');
  if(raw){
   const sv=JSON.parse(raw);
   if(sv&&sv.fm){
    let changed=false;
    if(sv.fm.d){
     for(const k of NEW_KEYS){
      if(sv.fm.d[k]>0&&!(ST.fm.d[k]>0)){ST.fm.d[k]=sv.fm.d[k];changed=true}
     }
    }
    if(Array.isArray(sv.fm.p)){
     for(const o of sv.fm.p){
      if(Array.isArray(o)&&o[0]==='de'&&NEW_KEYS.has(o[1])&&o[2]>=0&&o[3]>=0&&!ST.fm.p.some(q=>q[0]==='de'&&q[1]===o[1]&&q[2]===o[2]&&q[3]===o[3])){
       ST.fm.p.push(o);changed=true;
      }
     }
    }
    if(changed&&typeof fmSync==='function')fmSync();
   }
  }
 }
}catch(e){}
rebuildMySets();
})();
