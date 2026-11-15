/* =====================================================================
   TINYLAND — HÀNH ĐỘNG MỚI (file riêng, không đụng vào code cũ)
     ⚡ Siêu bá khí            — 💎 20
     👑 Hoàng thượng giá đáo   — 💎 30
   Nạp ở CUỐI index.html (sau food-icons.js):  <script src="actions2.js"></script>
   File tự đăng ký vào ACTS / ACTFX / APOSE của index.html → tự có trong Shop kim cương,
   bảng Hành động, xem trước hoạt hình và đồng bộ online (thêm ở CUỐI ACTS nên không lệch số thứ tự).
   Toàn bộ nằm trong 1 hàm bọc (IIFE) nên không trùng tên biến với file khác.
   ===================================================================== */
(function(){
'use strict';
if(typeof ACTS==='undefined'||typeof ACTFX==='undefined'||typeof APOSE==='undefined'||typeof actDraw!=='function'||typeof HAIRFX==='undefined'){
  console.warn('[actions2] Không tìm thấy hệ thống Hành động trong index.html — bỏ qua.');return}
if(ACTS.some(a=>a.id==='sbk'))return;   // đã nạp rồi

const TAU=Math.PI*2;
const rnd=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};      // số giả ngẫu nhiên cố định 0..1
const al=a=>Math.max(0,Math.min(1,a)).toFixed(2);
// LƯU Ý: `r` là biến toàn cục của index.html (xem trước hoạt hình sẽ tạm đổi sang canvas khác) nên luôn gọi r(...) trực tiếp
const ell=(c,x,y,a,b)=>E(r,c,x,y,a,b);
const line=(c,x0,y0,x1,y1,w)=>{w=w||1;const n=Math.max(1,Math.round(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));
  for(let i=0;i<=n;i++)r(c,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w)};
const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+al(a)+')';

/* ======================= TÓC SIÊU XAYDA (chỉ dùng khi làm hành động Siêu bá khí) ======================= */
const SSJ={n:'Tóc Siêu bá khí',k:'ssj',c:'#ffd631'};
HAIRFX.ssj=function(u,o,K){
 const side=K.side,Rt=K.Rt,back=K.back,G='#ffd631',L='#fff6a6',D='#e8a014',m=(side&&!Rt)?-1:1,cxm=c=>m>0?c:20-c;
 const sp=(cx,by,h,w,lean)=>{for(let i=0;i<h;i++){const k=i/h,ww=Math.max(1,Math.round(w*(1-k))),x0=Math.round(cx+lean*m*k-ww/2);
   u(G,x0,by-i,ww,1);if(ww>1)u(L,x0,by-i,1,1);if(ww>2&&k<.6)u(D,x0+ww-1,by-i,1,1)}};
 if(!side&&!back){
  u(G,6,7,8,2);u(G,7,6,6,1);u(G,6,9,1,3);u(G,13,9,1,3);u(G,7,9,6,1);u(D,6,9,1,1);u(L,8,6,3,1);
  sp(5,8,6,4,-4);sp(15,8,6,4,4);sp(7,6,8,5,-2);sp(13,6,8,5,2);sp(10,6,11,6,0);
 }else if(back){
  u(G,6,6,8,3);u(G,7,5,6,1);u(D,7,13,6,1);u(L,8,6,3,1);
  sp(5,8,6,4,-4);sp(15,8,6,4,4);sp(7,6,8,5,-2);sp(13,6,8,5,2);sp(10,6,11,6,0);
 }else{
  u(G,Rt?5:6,6,9,3);u(G,Rt?7:8,5,5,1);u(G,Rt?9:6,9,5,1);u(G,Rt?5:12,9,3,4);u(L,Rt?7:9,6,3,1);
  sp(cxm(6),8,6,4,-5);sp(cxm(8),6,9,5,-4);sp(cxm(10),6,11,5,-1);sp(cxm(12),6,7,4,2);
 }
};

/* ============================================================================
   ⚡ SIÊU BÁ KHÍ
   Hào quang vàng bùng cháy (lửa 3 lớp + cột sáng + sóng xung kích + tia điện), tóc vàng dựng đứng,
   tay phải cầm quyền trượng vung lên → hạt sáng bắn lên trời rồi nổ như pháo hoa.
   ============================================================================ */
const SB_T=2.0;
const sbU=t=>((t%SB_T)+SB_T)%SB_T/SB_T;
const sbAng=u=>kf(u,[[0,-.14],[.28,-.14],[.48,-.62],[.60,.9],[.78,.62],[1,-.14]]);   // góc quyền trượng (0 = dựng đứng)
const sbH=u=>Math.round(kf(u,[[0,9],[.28,9],[.48,8],[.60,13],[.78,12],[1,9]]));        // độ giơ tay phải
const sbFl=u=>kf(u,[[0,0],[.5,0],[.6,1],[.8,0],[1,0]]);                              // chớp sáng lúc vung
APOSE.sbk=t=>{const u=sbU(t);return{d:0,lift:3+Math.sin(t*4)*1.3,aup:[3+(Math.floor(t*16)%2),sbH(u)],e:1,nosh:1,noacc:1,sbu:u}};

function sbBack(X,Yg,L,t,pw,fl){
 const cy=Yg-L-15,pu=.5+.5*Math.sin(t*6);
 ell('rgba(0,0,0,.22)',X,Yg,Math.max(5,10-(L>>1)),2);                                   // bóng dưới đất
 ell('rgba(255,196,30,'+al(.30+.12*pu+.2*fl)+')',X,Yg,17,5);ell('rgba(255,250,200,'+al(.35+.2*fl)+')',X,Yg,10,3);
 for(let i=0;i<3;i++){const a=((t*.85+i/3)%1),rx=7+a*28,ry=rx*.3,n=Math.round(rx*3.2),c='rgba(255,226,110,'+al(.8*(1-a))+')';   // sóng xung kích lan trên mặt đất
  for(let j=0;j<n;j++){const an=j/n*TAU;r(c,Math.round(X+Math.cos(an)*rx),Math.round(Yg+Math.sin(an)*ry),1,1)}}
 for(let k=0;k<64;k++){const f=k/64,a=(.2+.08*pu+.12*fl)*Math.pow(1-f,1.2),hw=Math.round(11+f*4);r('rgba(255,236,140,'+al(a)+')',X-hw,Yg-2-k,hw*2,1)}   // cột sáng
 ell('rgba(255,200,40,'+al(.14+.05*pu)+')',X,cy-2,20,28);ell('rgba(255,236,120,'+al(.16+.05*pu+.1*fl)+')',X,cy-2,14,22);
}
function sbFlames(X,Yg,L,t,pw){
 const N=13,cy=Yg-L-15,COL=['rgba(255,150,20,.9)','rgba(255,214,60,.92)','#fff4a8'],FW=[1,.74,.48],FH=[1,.82,.62];
 for(let k=0;k<N;k++){
  const q=(k-(N-1)/2)/((N-1)/2),aq=Math.abs(q),edge=Math.sqrt(Math.max(0,1-q*q)),bx=X+q*12,by=Math.round(cy-edge*17+5);
  const H=(15+(1-aq)*11+aq*aq*10)*pw*(.78+.22*Math.sin(t*11+k*1.9)+.1*Math.sin(t*17+k*3.1)),W=7-aq*2;
  for(let li=0;li<3;li++){const hh=Math.round(H*FH[li]);
   for(let j=0;j<hh;j++){const fr=j/hh,w=Math.max(1,Math.round(W*FW[li]*(1-Math.pow(fr,1.25)))),xc=bx+Math.sin(t*6+k*1.3)*2.2*fr*fr+q*5*fr;
    r(COL[li],Math.round(xc-w/2),by-j,w,1)}}
 }
 for(let i=0;i<10;i++){const h=rnd(i+3),v=((t*(.7+h*.9)+rnd(i)*4)%1),x=X+(rnd(i+20)*2-1)*15,y=Yg-2-v*64,len=4+Math.round(h*8);   // vệt sáng bay vút lên
  r(i%3?'rgba(255,244,170,'+al(1-v)+')':'rgba(255,255,255,'+al(1-v)+')',Math.round(x),Math.round(y),1,len)}
}
const SB_PAL=[[255,246,176],[255,226,122],[255,200,58],[255,255,255],[255,157,224],[143,232,255],[183,155,255]];
function sbFront(X,Yg,L,t,u,fl,p){
 const cy=Yg-L-15,pu=.5+.5*Math.sin(t*8);
 ell('rgba(255,236,120,'+al(.12+.1*fl)+')',X,cy,9,15);                                    // thân người ánh vàng
 for(let i=0;i<7;i++){const v=((t*.7+i/7)%1),x=X+(rnd(i+9)*2-1)*14+Math.sin(t*3+i)*2,y=Yg-2-v*42;r(i%2?'#8a7a5a':'#cbbd92',Math.round(x),Math.round(y),2,1)}   // đá vụn bay lên
 // tia điện chớp quanh người
 const arc=(x,y,ang,len,sd,col)=>{let px=x,py=y;for(let s=0;s<len;s++){const na=ang+(rnd(sd+s*1.7)-.5)*1.7,nx=px+Math.cos(na)*3,ny=py+Math.sin(na)*3;line(col,px,py,nx,ny);px=nx;py=ny}};
 for(let a=0;a<4;a++){const sd=Math.floor(t*13)*5.3+a*11.1;if(rnd(sd)<.35)continue;const th=rnd(sd+1)*TAU,sx=X+Math.cos(th)*10,sy=cy+Math.sin(th)*16;
  arc(sx,sy,th,5,sd+2,'#fffbd0');arc(sx+1,sy,th,5,sd+2,'rgba(255,200,40,.7)')}
 // ---- quyền trượng ----
 const h=p.aup[1],hx=X+7,hy=Yg-L-12-h,a=sbAng(u),dx=Math.sin(a),dy=-Math.cos(a);
 const gate=kf(u,[[0,0],[.46,0],[.56,1],[.7,0],[1,0]]);
 if(gate>.02)for(const R of[18,22,26])for(let i=0;i<10;i++){const ag=a-i*.12;r('rgba(255,248,190,'+al((1-i/10)*.85*gate)+')',Math.round(hx+Math.sin(ag)*R),Math.round(hy-Math.cos(ag)*R),2,2)}   // vệt vung
 for(let s=-6;s<=21;s++)r('#6b4210',Math.round(hx+dx*s)-1,Math.round(hy+dy*s)-1,3,3);
 for(let s=-6;s<=21;s++){const px=Math.round(hx+dx*s)-1,py=Math.round(hy+dy*s)-1;r(s%7==3?'#d9302a':'#f2c53d',px,py,2,2);if(s%4==0)r('#fff3a8',px,py,1,1)}
 r(SKN,hx-1,hy-1,3,3);r(SKND,hx-1,hy+1,3,1);                                               // bàn tay nắm cán
 const tx=hx+dx*23,ty=hy+dy*23,gc=GEMC[Math.floor(t*2.5)%4];
 ell('rgba(255,230,120,'+al(.28+.2*pu+.3*fl)+')',tx,ty,8+Math.round(pu*2+fl*4),8+Math.round(pu*2+fl*4));
 for(let k=-2;k<=2;k++){const ag=a+k*.6,px=tx+Math.sin(ag)*6,py=ty-Math.cos(ag)*6;r('#f2c53d',Math.round(px)-1,Math.round(py)-1,2,2);r('#fff3a8',Math.round(px),Math.round(py),1,1)}   // vương miện nhỏ
 ell('#a8741a',tx,ty,5,5);ell('#f2c53d',tx,ty,4,4);ell(gc[1],tx,ty,3,3);ell(gc[0],tx-1,ty-1,1,1);r(gc[2],Math.round(tx)+1,Math.round(ty)+1,1,1);
 if(Math.sin(t*8)>0||fl>.4)star4(tx,ty,3+Math.round(fl*3),'rgba(255,250,200,.9)');
 if(u>.58&&u<.74){const rr=(u-.58)*130,n=Math.round(rr*3),c='rgba(255,240,170,'+al(1-(u-.58)/.16)+')';for(let i=0;i<n;i++){const an=i/n*TAU;r(c,Math.round(tx+Math.cos(an)*rr),Math.round(ty+Math.sin(an)*rr),2,2)}}   // vòng sáng lúc vung
 // ---- hạt sáng + pháo hoa ----
 for(const n of[Math.floor(t/SB_T),Math.floor(t/SB_T)-1]){
  const tl=n*SB_T+.6*SB_T,age=t-tl;if(age<0||age>2.3)continue;
  const sd=n*17.31,ha=sbAng(.6),hh=sbH(.6),ox=X+7+Math.sin(ha)*23,oy=Yg-L-12-hh-Math.cos(ha)*23;
  for(let i=0;i<24;i++){                                                                   // hạt lấp lánh bắn từ đầu trượng
   const h1=rnd(sd+i),h2=rnd(sd+i*3.3+1),an=-Math.PI/2+(h1-.5)*1.5,sp=35+h2*45,life=.9+h2*.7,aa=age-h1*.15;if(aa<0||aa>life)continue;
   const x=ox+Math.cos(an)*sp*aa,y=oy+Math.sin(an)*sp*aa+20*aa*aa,c=SB_PAL[i%SB_PAL.length],f=1-aa/life;
   if((Math.floor(aa*18)+i)%3==0)continue;
   r(rgba(c,f),Math.round(x),Math.round(y),i%3?1:2,i%3?1:2);
   if(i%6==0&&f>.4)star4(x,y,1,rgba(c,f*.8))}
  for(let k=0;k<3;k++){                                                                    // 3 quả pháo hoa nổ trên cao
   const ba=age-(.5+k*.28);if(ba<0||ba>1.3)continue;
   const cxs=ox+(k-1)*15+(rnd(sd+k)-.5)*6,cys=Yg-L-62-(k%2)*9,R=17-k,pal=[[255,226,122],[255,157,224],[143,232,255]][k],pal2=[[255,246,176],[255,214,240],[216,248,255]][k],f=1-Math.pow(ba/1.3,1.5);
   if(ba<.12)star4(cxs,cys,4,'rgba(255,255,255,.95)');
   for(let i=0;i<16;i++){const an=i/16*TAU+k*.3;
    for(let tr=0;tr<3;tr++){const b2=ba-tr*.06;if(b2<0)continue;const rd=R*(1-Math.exp(-4.5*b2)),x=cxs+Math.cos(an)*rd,y=cys+Math.sin(an)*rd+6*b2*b2;
     r(rgba(tr?pal:pal2,f*(tr?.45:1)),Math.round(x),Math.round(y),tr||ba>.8?1:2,tr||ba>.8?1:2)}
    if(ba>.3&&i%4==0&&Math.sin(ba*24+i)>.3){const rd=R*(1-Math.exp(-4.5*ba));star4(cxs+Math.cos(an)*rd,cys+Math.sin(an)*rd+6*ba*ba,1,rgba(pal2,f))}}
  }
 }
}
ACTFX.sbk={
 back:(X,Y,t,o,p)=>{const L=Math.round(p.lift),fl=sbFl(p.sbu),pw=.92+.12*Math.sin(t*3)+.4*fl;sbBack(X,Y,L,t,pw,fl);sbFlames(X,Y,L,t,pw)},
 front:(X,Yf,t,o,p)=>{const L=Math.round(p.lift),Yg=Yf+Math.round(p.lift*.5);sbFront(X,Yg,L,t,p.sbu,sbFl(p.sbu),p)}};

/* ============================================================================
   👑 HOÀNG THƯỢNG GIÁ ĐÁO
   Nhân vật ngồi trên kiệu vàng (mái cong, màn đỏ, lưng ngai có vầng hào quang),
   2 cung nhân khiêng đòn 2 bên, 2 cung nữ ở rìa cầm quạt khổng lồ quạt hầu.
   Vẽ riêng toàn bộ cảnh (ACTCUS) vì không dùng tư thế đứng như hành động thường.
   ============================================================================ */
const SERV={n:'Cung nhân',sh:'#b8262a',shl:'#d9443f',shd:'#7a1417',pt:'#2b2433',shoe:'#14121a',scarf:'#f2c53d',belt:'#f2c53d',trim:'#f2c53d',knot:'#c89a10',boot:1};
const FANC={n:'Cung nữ',sh:'#2f7fb8',shl:'#58a6dc',shd:'#1d4f78',pt:'#2b2433',shoe:'#14121a',scarf:'#f2c53d',belt:'#ffd23f',trim:'#ffd23f',knot:'#c89a10',boot:1,skirt:'#2f7fb8'};
const HB={n:'tóc',k:'short',c:'#17151c'},HF={n:'tóc',k:'tail',c:'#17151c'};
const PBG={ol:'#c9921e',f1:'#fff3c4',f2:'#fffbe8',f3:'#ffe28a',tx:'#a8201a',sp:'rgba(255,240,170,.95)'};

function bigFan(px,py,th,t){                         // quạt khổng lồ cán dài, vừa vẫy vừa xoay mặt quạt
 const dx=Math.sin(th),dy=-Math.cos(th);
 for(let s=-6;s<=21;s++)r('#7a4d12',Math.round(px+dx*s)-1,Math.round(py+dy*s)-1,3,3);
 for(let s=-6;s<=21;s++)r(s%6==2?'#d9302a':'#f2c53d',Math.round(px+dx*s)-1,Math.round(py+dy*s)-1,2,2);
 r(SKN,px-1,py-1,3,3);
 const cx=Math.round(px+dx*31),cy=Math.round(py+dy*31),rx=Math.max(5,Math.round(11*(.62+.38*Math.abs(Math.cos(t*4.2))))),ry=12;
 ell('#8a5a10',cx,cy,rx+1,ry+1);ell('#f2c53d',cx,cy,rx,ry);ell('#b8262a',cx,cy,Math.max(1,rx-2),ry-2);ell('#d9302a',cx-1,cy-1,Math.max(1,rx-4),ry-4);
 for(let a=0;a<8;a++){const ag=a*Math.PI/4+Math.PI/8;line('#f2c53d',cx,cy,cx+Math.cos(ag)*(rx-2),cy+Math.sin(ag)*(ry-2))}
 ell('#a8741a',cx,cy,3,3);ell('#ffd23f',cx,cy,2,2);r('#d9302a',cx,cy,1,1);
 r('#fffbe0',cx-Math.round(rx*.6),cy-Math.round(ry*.7),2,1);
 for(const k of[-2,2]){r('#d9302a',cx+k,cy+ry+1,1,5);r('#f2c53d',cx+k,cy+ry+6,1,1)}
}
const ACTCUS={};
ACTCUS.hoangthuong=function(g,X,Y,t,o){
 const Yg=Y,f=Math.floor(t*.32*9)%4,B=(f==1||f==3)?-1:0,sw=Math.sin(t*4.2),LX=X-52,RX=X+52;
 // 1. thảm đỏ + bóng
 ell('rgba(0,0,0,.2)',X,Yg,58,4);
 r('#e0b43a',X-52,Yg-3,104,1);r('#b8262a',X-52,Yg-2,104,3);r('#e0483f',X-52,Yg-2,104,1);r('#7d1418',X-52,Yg,104,1);
 for(let x=-48;x<=48;x+=8)r('#e0b43a',X+x,Yg-1,2,1);
 // 2. hai cung nữ cầm quạt (thân)
 drawAv(g,LX-10,Yg-30,{d:0,a:0,mv:0,sit:0,hair:0,set:0,e:5,acc:-1,nosh:1,setObj:FANC,hairObj:HF,aup:[1,10]});
 drawAv(g,RX-10,Yg-30,{d:0,a:0,mv:0,sit:0,hair:0,set:0,e:5,acc:-1,nosh:1,setObj:FANC,hairObj:HF,aup:[10,1]});
 // 3. đòn kiệu (đặt sau tay cung nhân để trông như đang nắm)
 const py=Yg-17+B;
 r('#d9302a',X-45,py,91,1);r('#9c1c20',X-45,py+1,91,1);r('#5a0f0c',X-45,py+2,91,1);
 for(let x=-39;x<=39;x+=13)r('#f2c53d',X+x,py,2,3);
 for(const s of[-1,1]){const ex=s<0?X-48:X+46;r('#f2c53d',ex,py-1,3,5);r('#fff3a8',ex,py-1,3,1);r('#a8741a',ex,py+3,3,1)}
 // 4. hai cung nhân khiêng kiệu (đi tại chỗ)
 const bo={d:0,a:t*.32,mv:1,sit:0,hair:0,set:0,e:0,acc:-1,setObj:SERV,hairObj:HB,aup:[4,4]};
 drawAv(g,X-30-10,Yg-30,bo);drawAv(g,X+30-10,Yg-30,Object.assign({},bo));
 for(const s of[-1,1])for(let i=0;i<2;i++){const v=((t*.9+i/2+(s>0?.25:0))%1);ell('rgba(235,225,205,'+al(.5*(1-v))+')',X+s*30+(i?4:-4),Yg-1-v*4,2+v*2,1+Math.round(v))}   // bụi bước chân
 // 5. kiệu: lưng ngai + vầng hào quang
 const yT=Yg-54+B,yB=Yg-24+B,hy=Yg-37+B,pu=.5+.5*Math.sin(t*2.4);
 for(let j=0;j<=yB-yT;j++){const w=j==0?22:j==1?28:j==2?32:34;r('#a8741a',X-(w>>1),yT+j,w,1)}
 for(let j=1;j<=yB-yT;j++){const w=j==1?20:j==2?26:j==3?30:32;r('#f2c53d',X-(w>>1),yT+j,w,1)}
 r('#fff3a8',X-9,yT+1,18,1);r('#b8262a',X-14,yT+6,28,yB-yT-8);r('#8f1a1d',X-14,yT+6,28,1);
 for(const sx of[-12,11]){r('#fff3a8',X+sx,yT+9,2,2);r('#fff3a8',X+sx,yB-5,2,2)}
 ell('rgba(255,230,120,'+al(.22+.1*pu)+')',X,hy,15,15);ell('#a8741a',X,hy,11,11);ell('#f2c53d',X,hy,10,10);ell('#b8262a',X,hy,8,8);
 for(let k=0;k<16;k++){const ag=k*TAU/16+t*.3;r(k%2?'#fff3a8':'#ffe27a',Math.round(X+Math.cos(ag)*13),Math.round(hy+Math.sin(ag)*13),1,1)}
 r('#7d1418',X-14,Yg-26+B,28,3);r('#d9302a',X-14,Yg-26+B,28,2);r('#f2c53d',X-14,Yg-24+B,28,1);   // nệm ngồi
 // 6. nhân vật ngồi vẫy tay
 const hv=3+Math.round(Math.sin(t*3)*2);
 drawAv(g,X-10,Yg-48+B,Object.assign({},o,{d:0,mv:0,sit:2,acc:-1,e:5,nosh:1,aup:[null,hv]}));
 // 7. thành kiệu phía trước (che chân), cột, màn đỏ, mái cong vàng
 r('#a8741a',X-22,Yg-24+B,44,8);r('#f2c53d',X-21,Yg-23+B,42,6);r('#fff3a8',X-21,Yg-23+B,42,1);r('#b8262a',X-18,Yg-21+B,36,3);r('#7a5010',X-22,Yg-17+B,44,1);
 for(const sx of[-12,0,12]){r('#f2c53d',X+sx-1,Yg-20+B,3,1);r('#f2c53d',X+sx,Yg-21+B,1,3);r('#8fe8ff',X+sx,Yg-20+B,1,1)}
 for(const s of[-1,1]){const px=s<0?X-21:X+19;r('#8f1a1d',px,Yg-51+B,3,27);r('#e0483f',px,Yg-51+B,1,27);for(const by of[-30,-40,-48])r('#f2c53d',px-1,Yg+by+B,5,2)}
 for(const s of[-1,1]){const x0=s<0?X-21:X+21;                                              // màn lụa đỏ vén gọn, buộc tua vàng
  for(let j=0;j<22;j++){const w=j<13?6:Math.max(2,6-(j-12)),x=s<0?x0:x0-w;r(j%5==0?'#ff6a5a':'#d9302a',x,Yg-51+B+j,w,1);r('#a8201a',s<0?x+w-1:x,Yg-51+B+j,1,1)}
  r('#f2c53d',s<0?x0:x0-6,Yg-38+B,6,2);r('#d9302a',s<0?x0+1:x0-3,Yg-36+B,2,5);r('#f2c53d',s<0?x0+1:x0-3,Yg-31+B,2,1)}
 for(let i=0;i<7;i++){const w=8+Math.round(i*3.2),y=Yg-64+B+i,x=X-(w>>1);                // mái trên
  r('#f2c53d',x,y,w,1);if(i==0)r('#fff3a8',x,y,w,1);r('#d9a521',x+w-3,y,3,1);for(let k=3;k<w-3;k+=5)r('#c9921e',x+k,y,1,1)}
 for(let i=0;i<7;i++){const w=28+Math.round(Math.pow(i/6,1.3)*20),y=Yg-57+B+i,x=X-(w>>1);   // mái dưới (loe ra)
  r('#f2c53d',x,y,w,1);if(i==0)r('#fff3a8',x,y,w,1);r('#d9a521',x+w-4,y,4,1);for(let k=3;k<w-3;k+=5)r('#c9921e',x+k,y,1,1)}
 r('#a8741a',X-14,Yg-57+B,28,1);r('#b8262a',X-24,Yg-51+B,48,1);
 for(let x=-22;x<=22;x+=4){r('#fff6e0',X+x,Yg-50+B,1,2);r('#f2c53d',X+x,Yg-48+B,1,1)}      // chuỗi ngọc rủ mép mái
 for(const s of[-1,1]){const ex=X+s*25-(s<0?2:0);r('#f2c53d',ex,Yg-54+B,3,2);r('#f2c53d',ex+s,Yg-56+B,3,2);r('#fff3a8',ex+2*s,Yg-58+B,2,3)}   // mái cong vút
 for(const s of[-1,1]){const tx=X+s*24+Math.round(Math.sin(t*3+s)),ty=Yg-49+B;r('#d9302a',tx,ty,1,6);r('#f2c53d',tx,ty+6,1,2)}
 r('#f2c53d',X-1,Yg-68+B,3,4);ell('#f2c53d',X,Yg-70+B,2,2);r('#fff3a8',X-1,Yg-71+B,1,1);r('#fff3a8',X,Yg-74+B,1,3);
 // 8. quạt khổng lồ + cánh hoa bay theo gió quạt
 bigFan(LX+7,Yg-22,sw*.3,t);bigFan(RX-7,Yg-22,-sw*.3,t);
 for(const s of[-1,1]){const fx=X+s*45;for(let i=0;i<6;i++){const v=((t*.35+i/6+(s>0?.08:0))%1),x=fx+(X-fx)*v*.9+Math.sin(t*3+i*2)*3,y=Yg-50+v*34+Math.sin(t*2.3+i)*3,a=Math.sin(v*Math.PI);
  r('rgba(255,170,195,'+al(a)+')',Math.round(x),Math.round(y),2,1);r('rgba(255,225,235,'+al(a)+')',Math.round(x),Math.round(y)-1,1,1)}}
 // 9. lấp lánh vàng + bong bóng chữ
 for(let i=0;i<6;i++){const a=Math.sin(t*3.4+i*2.1);if(a>.55)star4(X+(rnd(i+40)*2-1)*24,Yg-60+B+rnd(i+50)*8,a>.9?2:1,'rgba(255,250,200,.95)')}
 for(let i=0;i<8;i++){const v=((t*.4+i/8)%1);star4(X+(rnd(i)*2-1)*36,Yg-14-v*60,0,null,'rgba(255,240,170,'+al(1-v)+')')}
 pbub(X,Yg-93,t,'Hoàng thượng giá đáo',PBG);
};
ACTFX.hoangthuong={};                                  // hình vẽ nằm hết trong ACTCUS
APOSE.hoangthuong=t=>({d:0,lift:0});

/* ======================= ĐĂNG KÝ ======================= */
// luôn ở CUỐI mảng ACTS (số thứ tự được đồng bộ online)
ACTS.push(
 {id:'sbk',n:'Siêu bá khí',e:'⚡',pr:20,k:'solo',ds:'Hào quang vàng bùng cháy quanh người như Siêu Xayda, tay cầm quyền trượng vung hạt sáng bắn lên trời nổ như pháo hoa'},
 {id:'hoangthuong',n:'Hoàng thượng giá đáo',e:'👑',pr:30,k:'solo',ds:'Ngồi kiệu vàng lấp lánh, 2 cung nhân khiêng hai bên, 2 cung nữ cầm quạt lớn quạt hầu ở rìa'});

// khung xem trước rộng/cao hơn bình thường cho cảnh lớn: [nhân chiều rộng, nhân chiều cao]
window.ACTWIDE=Object.assign(window.ACTWIDE||{},{sbk:[1,1.1],hoangthuong:[1.8,1.15]});

// bọc actDraw: hành động vẽ riêng (ACTCUS) + đổi tóc vàng cho Siêu bá khí
const _actDraw0=actDraw;
actDraw=function(g,X,Y,t,o,id){
 if(ACTCUS[id])return ACTCUS[id](g,X,Y,t,o);
 if(id==='sbk')o.hairObj=SSJ;
 return _actDraw0(g,X,Y,t,o,id)};
})();
