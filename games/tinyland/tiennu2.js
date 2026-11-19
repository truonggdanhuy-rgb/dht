/* tiennu2.js — 🧚 TIÊN NỮ vẽ lại: tóc dài mượt + búi hoa sen, dải lụa phi thiên (quấn vai / eo / bay sau lưng), váy nhiều tầng cánh sen.
   Ghi đè window.drawTienNu của index.html. PHẢI nạp SAU index.html (cuối danh sách script). Lỗi gì thì tự dùng bản cũ.
   Muốn quay về bản cũ: xóa dòng <script src="tiennu2.js"> trong index.html.
   Giữ nguyên: khung 20x31, hào quang, vòng sao xoay, bụi sao, tia lấp lánh, gậy phép, dải sáng quét trên váy, mặt & biểu cảm người chơi. */
(function(){
"use strict";
const _orig=window.drawTienNu;

/* ---- màu ---- */
const PW='#fff4fb',PWD='#ecd0ee',PK='#ff93c6',PKL='#ffc9e2',PKD='#d95c9f',LV='#d8c8ff',LVD='#a98ee6',AQ='#c6f4ff',AQD='#7fd0e8',
 G='#ffd45a',GL='#fff0a8',GD='#d99a1c',TL='#4fe0d8',SK='#f1c08a',SKD='#d99e6a',
 HD='#17112a',HC='#2b2250',HM='#42367e',HL='#8576d6',HS='#c4b8ff';           // tóc: chàm tím đậm + ánh bóng
const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,q)=>a.map((v,i)=>Math.round(v+(b[i]-v)*q));
const rgba=(a,al)=>'rgba('+a[0]+','+a[1]+','+a[2]+','+Math.max(0,Math.min(1,al)).toFixed(2)+')';
const RP=[[255,125,192],[190,150,255],[120,214,255]];
const gradC=s=>{const q=Math.max(0,Math.min(1,s))*2;return q<1?mix(RP[0],RP[1],q):mix(RP[1],RP[2],q-1)};
const WH=[255,255,255];

function drawTN(g,r,u0,o,S,k){
 const {lg,side,Rt,back,sit,rd}=k,t=performance.now()/1000;
 const fl=(o.nosh||o.mv||rd||sit)?0:Math.round(.5+.5*Math.sin(t*2.2));
 const u=(c,x,y,w,h)=>u0(c,x,y-fl,w,h);
 const hs=(h,a,l)=>'hsla('+(((Math.round(h)%360)+360)%360)+',100%,'+(l||82)+'%,'+Math.max(0,Math.min(1,a)).toFixed(2)+')';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h),UM=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const mk=new Set(),pm=(c,x,y,w,h)=>{u(c,x,y,w,h);for(let j=0;j<h;j++)for(let i=0;i<w;i++)mk.add((y+j)*64+x+i+16)};
 const XM=(x,w)=>side&&!Rt?20-x-w:x;
 const star=(x,y,col,q)=>{u(col,x,y,1,1);if(q>.45){const c2=col.replace(/,[0-9.]+\)$/,',.55)');u(c2,x-1,y,3,1);u(c2,x,y-1,1,3)}if(q>.85)u('rgba(255,255,255,.95)',x,y,1,1)};

 /* ---- DẢI LỤA: đường cong bezier + sóng chạy dọc dải, thon dần về đuôi, vẽ liền mạch (mỗi điểm ảnh 1 lần), mép trên sáng / mép dưới đậm ---- */
 const bez=(a,b,c,d)=>s=>{const q=1-s;return[q*q*q*a[0]+3*q*q*s*b[0]+3*q*s*s*c[0]+s*s*s*d[0],q*q*q*a[1]+3*q*q*s*b[1]+3*q*s*s*c[1]+s*s*s*d[1]]};
 const ribbon=(P,w0,w1,al,ph,A,sp,fq)=>{
  const seen=new Map(),n=110,wave=(s)=>{const p=P(s),q=P(Math.min(1,s+.02)),p0=P(Math.max(0,s-.02)),dx=q[0]-p0[0],dy=q[1]-p0[1],l=Math.hypot(dx,dy)||1,d=Math.sin(t*sp-s*fq)*A*s;return[p[0]-dy/l*d,p[1]+dx/l*d]};
  for(let i=0;i<=n;i++){const s=i/n,p=wave(s),q=wave(Math.min(1,s+.03)),dx=q[0]-p[0],dy=q[1]-p[1],steep=Math.abs(dy)>Math.abs(dx)*1.1,
    x=Math.round(p[0]),y=Math.round(p[1]),w=Math.max(1,Math.round(w0+(w1-w0)*s));
   for(let j=0;j<w;j++){const xx=steep?x+j-((w-1)>>1):x,yy=steep?y:y+j-((w-1)>>1),key=yy*200+xx+100;if(!seen.has(key))seen.set(key,[xx,yy,s])}}
  seen.forEach(([x,y,s],key)=>{
   const above=seen.has(key-200),below=seen.has(key+200);
   let c=gradC(s*.9+ph);const sh=.5+.5*Math.sin(t*3-s*9+ph*6);
   c=mix(c,WH,.03+.1*sh);
   if(!above)c=mix(c,WH,.38);else if(!below)c=mix(c,[190,90,215],.3);
   u(rgba(c,al*(1-.3*s)),XM(x,1),y,1,1)});
  const sp2=((t*.5+ph)%1),p=wave(sp2);u('rgba(255,255,255,.95)',XM(Math.round(p[0]),1),Math.round(p[1]),1,1)};
 const mir=(P)=>s=>{const p=P(s);return[20-p[0],p[1]]};                     // đối xứng qua giữa người
 const silkBack=()=>{            // 2 dải lụa dài bay sau lưng, uốn sóng
  if(!side){const L=bez([5,17],[-2,17],[-5,22],[-4,28.5]);ribbon(L,3,1,.85,.1,2.6,2.1,8);ribbon(mir(L),3,1,.85,.5,2.6,2.1,8)}
  else{ribbon(bez([8,17],[3,17],[-1,22],[-4,28]),3,1,.85,.1,2.2,2.1,8);ribbon(bez([8,20],[4,22],[1,26],[-1,29.5]),2,1,.72,.55,1.8,2.1,8)}};
 const silkFront=()=>{           // khăn phi thiên vắt vai + 1 dải quấn chéo thân buông thành đuôi lụa
  if(!side){
   const L=bez([6,16.5],[1,16.5],[-1,21],[-3,26.5]);ribbon(L,2,1,.95,.0,1.8,2.3,8);ribbon(mir(L),2,1,.95,.4,1.8,2.3,8);
   if(!back){const D=s=>{if(s<.42){const q=s/.42;return[7+6.5*q,16.5+5.5*q]}const q=(s-.42)/.58;return[13.5+1.2*Math.sin(q*3)-.2*q,22+7.8*q]};
    ribbon(D,2,1,.95,.25,1.8,2.7,7)}}
  else{
   ribbon(bez([10,16.5],[8,18],[4,20],[0,25]),2,1,.95,.0,1.6,2.3,7);
   ribbon(bez([11.5,21.5],[10,24],[9,26],[9,29]),2,1,.88,.3,1.5,2.8,6)}};
 const orbit=fr=>{for(let i=0;i<7;i++){const a=t*1.4+i*.8976,sn=Math.sin(a);if((sn>=0)!==fr)continue;
  star(Math.round(10+(side?6:11)*Math.cos(a)),Math.round(20+3.4*sn),hs(i*52+t*70,1),.5+.5*Math.sin(t*5+i*2))}};
 const wand=(hx,hy,sd)=>{
  const P=sd?[[0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6]]:[[0,0],[0,-1],[1,-2],[1,-3],[2,-4],[2,-5],[3,-6],[3,-7]];
  const W=sd?(c,x,y,w,h)=>M(c,x,y,w,h):(c,x,y,w,h)=>u(c,x,y,w,h);
  P.forEach(([dx,dy],i)=>W(i==2?G:(i&1?'#a86f3f':'#6b4328'),hx+dx,hy+dy,1,1));
  const e=P[P.length-1],tx=hx+e[0],ty=hy+e[1]-1,ph=Math.sin(t*9)+Math.sin(t*5.3+1),on=ph>.5;
  if(on){W('rgba(255,240,170,.7)',tx-2,ty,5,1);W('rgba(255,240,170,.7)',tx,ty-2,1,5);W('#fff6a8',tx-1,ty,3,1);W('#fff6a8',tx,ty-1,1,3);W('#ffffff',tx,ty,1,1);
   W('rgba(255,255,255,.8)',tx-1,ty-1,1,1);W('rgba(255,255,255,.8)',tx+1,ty+1,1,1);W('rgba(255,200,255,.8)',tx+1,ty-1,1,1);W('rgba(190,240,255,.8)',tx-1,ty+1,1,1)}
  else{W('#ffe27a',tx,ty,1,1);W('rgba(255,226,122,.5)',tx-1,ty,3,1);W('rgba(255,226,122,.5)',tx,ty-1,1,3)}
  for(let i=0;i<3;i++){const q=(t*1.3+i/3)%1;if(q>.8)continue;W(hs(i*120+t*90,1-q,86),tx+Math.round(Math.cos(i*2.1+t)*(2+q*4)),ty+Math.round(Math.sin(i*2.1+t)*(2+q*4))+1,1,1)}};

 /* ---- hào quang + bóng ---- */
 {const a=.06+.035*Math.sin(t*1.5);E(r,hs(300+60*Math.sin(t*.8),a*.8,80),10,19,12,14);E(r,hs(200+50*Math.sin(t*.8+2),a,86),10,19,9,11)}
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.13)',10,30,7,2);

 /* ---- TÓC DÀI (lớp sau thân): tóc mượt xõa quá eo, đuôi tóc loe nhẹ, ombre tím nhạt ở ngọn ---- */
 const sw=(y,a)=>Math.round(Math.sin(t*1.9-y*.33)*a);                   // gió làm tóc đung đưa, càng xuống càng nhiều
 const hairTip=(y)=>y>=24?'#9c8bea':y>=21?'#6c5ac0':null;
 const hairBackFront=()=>{               // nhìn trước: tóc xõa sau vai, 2 mảng thon dần (mảnh, không che váy)
  for(let y=12;y<=26;y++){
   const tp=Math.max(0,y-19),w=tp>3?1:2,ox=sw(y,tp>0?1:0),c=hairTip(y)||(y<17?HC:HM);
   u(c,2+ox,y,w,1);u(c,18-w+ox,y,w,1);
   if(!hairTip(y)){u(HD,2+ox,y,1,1);u(HD,17+ox,y,1,1);if(y%4==0){u(HL,3+ox,y,1,1);u(HL,16+ox,y,1,1)}}}};
 const hairBackBack=()=>{                // nhìn sau: tóc dài như thác, chia lọn, 3 ngọn tóc thon, ombre nhẹ ở ngọn
  const sil=[[9,5,15],[10,4,16],[11,4,16],[12,4,16],[13,4,16],[14,4,16],[15,4,16],[16,4,16],[17,4,16],[18,5,15],[19,5,15],[20,5,15],[21,5,15],[22,6,14],[23,6,14]];
  sil.forEach(([y,a,b])=>{const ox=sw(y,y>19?1:0),L=a+ox,Rr=b+ox;
   for(let x=L;x<Rr;x++){const f=(x-L)/(Rr-L),col=(x-L)%4;let c=HC;
    if(f<.16)c=HM;else if(f>.84)c=HD;else if(col==1)c=(y%5<3)?HL:HM;else if(col==3)c=HD;
    if(y>=21)c=mix2(c,y-20);
    u(c,x,y,1,1)}
   u(HD,L,y,1,1);u(HD,Rr-1,y,1,1)});
  // đuôi tóc thon dần, kết thúc bằng 3 ngọn nhỏ
  [[24,7,12],[25,7,12],[26,8,11],[27,8,11]].forEach(([y,a2,b2])=>{const ox=sw(y,1.2);for(let x=a2;x<=b2;x++){if(y==27&&(x==9||x==10))continue;
    u(mix2(((x-a2)%3==1)?HM:HC,y-22),x+ox,y,1,1)}});
  [[8,28],[11,28],[9,29]].forEach(([x,y])=>u(mix2(HC,4),x+sw(y,1.2),y,1,1));
  for(let y=11;y<=20;y++)u(HS,6+((y%3==0)?1:0),y,1,1);u(HS,12,12,1,2);u(HS,11,15,1,2)};
 const mix2=(c,n)=>{const k=[0,.25,.5,.7,.85][Math.min(4,n)];const a=rgb(c.startsWith('#')?c:'#2b2250');return '#'+mix(a,[160,140,235],k).map(v=>v.toString(16).padStart(2,'0')).join('')};
 const hairBackSide=()=>{                // nhìn nghiêng: tóc bay ra sau theo gió, ngọn tóc cong
  for(let y=8;y<=26;y++){
   const s=(y-8)/18,drift=Math.round(s*2.6+Math.sin(t*1.9-y*.33)*(.5+s*1.4)),tp=y>20?(y-20):0,w=Math.max(2,6-Math.floor(tp*.8)),x0=Math.round(3+ (y<12?3-(y-8)*.5:1))-drift+ (y<12?0:0);
   const tip=hairTip(y);
   M(tip||HC,x0,y,w,1);M(HD,x0,y,1,1);if(!tip){M(HM,x0+w-2,y,1,1);if(y%3==0)M(HL,x0+2,y,1,1)}}
  for(let y=10;y<=21;y+=1)M(HS,6-Math.round((y-8)/18*2.6),y,1,((y*7)%5==0)?1:0)};
 if(back)hairBackBack();else if(!side)hairBackFront();else hairBackSide();

 /* ---- lụa bay sau + sao sau ---- */
 silkBack();orbit(false);

 /* ---- VÁY: nhiều tầng cánh sen, dài thướt tha, viền ren ngọc trai ---- */
 {const sh=side?0:lg,ROWS=[[22,4,'#fff6fc',PKL],[23,4,'#ffeaf6',PKL],[24,5,'#ffdaee',PK],[25,6,'#f2d8ff',LV],[26,7,'#e4d4ff',LV],[27,7,'#d4dffe',AQ],[28,8,'#c6f1ff',AQ]];
  ROWS.forEach(([y,hw0,c,ec])=>{if(rd&&y>26)return;
   const hw=side?Math.max(3,hw0-2):hw0,x0=10-hw,W2=hw*2,sw0=y>=26?sh:0,fo=y>=27?Math.round(Math.sin(t*2.2+y)*.7):0;
   if(y==28){for(let x=x0;x<x0+W2;x++){const m=(x+Math.floor(t*2.4))%3;if(m==2)continue;pm(m==0?c:'#ffffff',x+sw0+fo,y,1,1);if(m==0&&(x&1))u(AQD,x+sw0+fo,y,1,1)}}
   else{pm(c,x0+sw0+fo,y,W2,1);u(ec,x0+sw0+fo,y,1,1);u(ec,x0+W2-1+sw0+fo,y,1,1);
    for(let x=x0+3;x<x0+W2-1;x+=4)u('rgba(170,130,210,.16)',x+sw0+fo,y,1,1);
    if(y==24)for(let x=x0+1;x<x0+W2-1;x+=2)u(PK,x+sw0+fo,y,1,1);
    if(y==26)for(let x=x0+1;x<x0+W2-1;x+=2)u(LVD,x+sw0+fo,y,1,1);
    if(y==25)for(let x=x0+2;x<x0+W2-2;x+=4)u(G,x+sw0+fo,y,1,1)}})}
 /* ---- THÂN ÁO: cổ giao lĩnh chéo vạt, đai lưng cao + ngọc, tay áo rộng loe (đặc, viền hồng + châu vàng) ---- */
 const sleeve=(dir,ay)=>{
  const L=(x,w)=>dir<0?x:20-x-w;
  [[17,3],[18,3],[19,3],[20,2],[21,1]].forEach(([y,x0],i)=>{const w=6-x0,yy=y+(y>=21?ay:0);
   pm(i<3?PW:'#ffeaf6',L(x0,w),yy,w,1);
   u(PKL,L(x0,1),yy,1,1);u(PWD,L(5,1),yy,1,1);                           // mép ngoài sáng, mép trong đổ bóng
   if(i>=3&&i%2)u('#f6d4ec',L(x0+2,1),yy,1,1)});
  const yb=22+ay;u(PK,L(0,6),yb,6,1);u(GL,L(0,1),yb,1,1);u(G,L(2,1),yb,1,1);u(G,L(4,1),yb,1,1);u(PKD,L(5,1),yb,1,1);
  u('rgba(255,210,235,.6)',L(0,6),yb+1,6,1);                             // vạt voan phía dưới
  u(SK,L(2,2),yb+1,2,2);u(SKD,L(2,2),yb+2,2,1)};
 const shimmer=()=>{const br=.5+.5*Math.sin(t*1.4);   // dải sáng ẩn hiện trên trang phục
  mk.forEach(key=>{const x=(key&63)-16,y=key>>6,ph=((t*.42-(x*.055+y*.085))%1+1)%1,a=Math.pow(Math.max(0,Math.sin(ph*Math.PI*2)),6)*(.2+.32*br);
   if(a>.05)u('rgba(255,248,230,'+a.toFixed(2)+')',x,y,1,1);
   if(Math.sin(t*2.1+x*1.7+y*2.3)>.965)u('rgba(255,255,255,.8)',x,y,1,1)})};
 let wx=17,wy=22,wsd=0;
 if(!side){
  pm(PW,5,16,10,1);pm(PW,6,17,8,3);u(PWD,12,17,2,3);u('#ffffff',6,17,1,3);
  if(!back){ // cổ giao lĩnh: 2 vạt chéo trắng viền hồng, lót hồng nhạt
   u('#fbd3ea',8,17,4,3);u('#f2a9d2',9,18,2,2);
   [[7,17],[8,18],[9,19],[12,17],[11,18],[10,19]].forEach(([x,y])=>{pm(PW,x,y,1,1);u(PK,x+((x<10)?1:-1),y,1,1)});
   u(PW,7,16,1,1);u(PW,12,16,1,1);
   u(G,9,15,2,1);u(GL,9,15,1,1);u(PKD,9,16,2,1);u(GL,9,16,1,1)}          // dây chuyền + mặt ngọc
  else{u(PKL,7,17,6,1);u(PK,7,19,6,1)}
  // đai lưng cao tím viền vàng + ngọc
  pm(LV,6,20,8,1);pm(LVD,6,21,8,1);u(G,6,20,8,1);u(GD,6,21,8,1);u(LV,6,21,1,1);u(LV,13,21,1,1);
  if(!back){u(PKD,9,20,2,2);u(PK,9,20,2,1);u(GL,9,20,1,1);u('#ffffff',10,20,1,1)}
  else{u(PK,8,20,4,2);u(PKL,8,20,2,1);u(PK,7,22,2,3);u(PK,11,22,2,3);u(LV,6,22,2,2);u(LV,12,22,2,2)}
  u(SK,9,15,2,1);
  shimmer();
  if(back)hairBackBack();                                               // nhìn sau: tóc phủ lên lưng
  if(o.aup){const up=(x,h,ox,dir)=>{const ty=17-h;u(SK,x+ox+1,ty,2,2);u(PK,x+ox-1,ty+2,6,1);for(let i=-1;i<5;i+=2)u(G,x+ox+i,ty+2,1,1);
    u(PKL,x+ox-1,ty+3,6,1);pm(PW,x+ox,ty+4,4,1);pm(PW,x+(dir<0?ox+1:ox),ty+5,3,Math.max(0,17-(ty+5)))};
   up(2,o.aup[0],-1,-1);up(15,o.aup[1],1,1);wx=17;wy=17-o.aup[1]-1}
  else{sleeve(-1,lg);sleeve(1,-lg);wx=17;wy=23-lg}
 }else{
  pm(PW,8,16,6,1);pm(PW,7,17,7,3);u('#ffffff',Rt?7:12,17,2,3);u(PWD,Rt?12:7,17,2,3);
  pm(LV,7,20,7,1);pm(LVD,7,21,7,1);u(G,7,20,7,1);u(GD,7,21,7,1);M(PKD,12,20,2,2);M(GL,12,20,1,1);
  u(SK,9,15,2,1);
  const ax=9-(lg*(Rt?2:-2));
  if(!o.noarm){pm(PW,ax,17,3,3);pm('#ffeaf6',ax-1,20,5,1);pm('#ffeaf6',ax-2,21,7,1);
   u(PKL,ax-2,21,1,1);u(PWD,ax+4,21,1,1);u(PK,ax-2,22,7,1);u(G,ax-2,22,1,1);u(G,ax,22,1,1);u(G,ax+2,22,1,1);u(G,ax+4,22,1,1);u('rgba(255,210,235,.6)',ax-2,23,7,1);u(SK,ax+1,23,2,2)}
  wsd=1;wx=Rt?ax+2:18-ax;wy=23;shimmer()}
 silkFront();orbit(true);
 if(!o.noarm)wand(wx,wy,wsd);

 /* ---- ĐẦU: mặt người chơi + tóc mái thưa, búi cao, hoa sen nhỏ, vương miện mảnh, trâm tua rua ---- */
 const gem=(x,y,w)=>{if(Math.sin(t*4)>.2)u('rgba(255,255,255,.9)',x,y,w||1,1)};
 const tas=(x,y0)=>{[PKL,PK,G,PKL].forEach((c,i)=>{const s=i>=2?Math.round(Math.sin(t*2.4+i)*1):0;u(c,x+s,y0+i,1,1)})};
 const bun=()=>{
  u(HC,8,2,4,1);u(HC,7,3,6,1);u(HC,6,4,8,1);
  u(HM,8,2,1,1);u(HM,7,3,2,1);u(HL,7,3,1,1);u(HD,12,3,1,1);u(HD,13,4,1,1);u(HD,9,4,3,1);u(HM,6,4,2,1);
  // hoa sen nhỏ trên đỉnh búi
  u(PKL,9,0,2,1);u(PK,8,1,1,1);u(PK,11,1,1,1);u(PKL,9,1,2,1);u(PKD,9,2,2,1);u(GL,9,1,1,1);gem(10,0);
  // trâm vàng xuyên búi + tua rua
  u(G,4,3,2,1);u(G,14,3,2,1);u(GL,4,3,1,1);u(PKL,3,3,1,1);u(PKL,16,3,1,1);
  tas(4,4);tas(15,4);
  // vương miện mảnh
  u(G,6,5,8,1);u(GL,6,5,3,1);u(GD,11,5,3,1);u(PK,9,4,2,1);u(PKD,9,5,2,1);u(TL,7,4,1,1);u(TL,12,4,1,1);gem(9,4)};
 if(back){
  E(u,HC,10,11,4,4);u(HC,5,5,10,1);u(HC,4,6,12,3);u(HL,7,6,4,1);u(HM,6,7,2,1);
  bun();
 }else if(!side){
  E(u,SK,10,11,4,4);
  u('#ffb0b8',6,13,1,1);u('#ffb0b8',13,13,1,1);
  if(o.e>0)faceFx(u,o.e,0,0);else if(typeof faceDef=='function')faceDef(u,0,0);else{u('#2b1d12',8,11,1,1);u('#2b1d12',11,11,1,1);u('#b5604a',9,13,2,1)}
  bun();
  // tóc mái thưa rẽ giữa + tóc mai
  u(HC,5,6,10,1);u(HC,4,7,12,1);u(HL,6,6,3,1);u(HS,6,6,1,1);
  u(HC,5,7,4,1);u(HC,11,7,4,1);u(HC,5,8,2,1);u(HC,13,8,2,1);u(HM,6,7,1,1);u(HM,13,7,1,1);u(PKD,10,7,1,1);
  // hai lọn tóc mai dài rủ trước vai, thon dần, buộc nơ hồng
  [[3,1],[16,-1]].forEach(([x0,dir])=>{
   for(let y=9;y<=21;y++){const w=y<13?3:y<18?2:1,ox=Math.round(Math.sin(t*1.9-y*.33)*(y>16?1:0)),xs=dir>0?x0+ox:x0-w+1+ox;
    u(y>18?'#6c5ac0':HC,xs,y,w,1);u(HD,dir>0?xs:xs+w-1,y,1,1);if(y%4==1)u(HM,dir>0?xs+1:xs,y,1,1)}
   u(PK,x0-1+(dir<0?-0:0),15,3,1);u(PKL,x0,15,1,1);u(PKD,x0,16,2,1)});
 }else{
  E(u,HC,Rt?8:12,11,3,4);E(u,SK,Rt?11:9,11,3,4);
  u('#ffb0b8',Rt?13:6,13,1,1);
  if(o.e>0)faceFx(u,o.e,1,Rt);else if(typeof faceDef=='function')faceDef(u,1,Rt);else{u('#2b1d12',Rt?12:7,11,1,1);u('#b5604a',Rt?13:6,13,1,1)}
  // búi sau đầu + hoa sen nhỏ + vương miện
  M(HC,6,2,4,1);M(HC,5,3,6,1);M(HC,4,4,7,1);M(HM,6,2,1,1);M(HM,5,3,2,1);M(HL,5,3,1,1);M(HD,9,3,1,1);M(HD,6,4,3,1);
  M(PKL,6,0,2,1);M(PK,5,1,1,1);M(PK,8,1,1,1);M(PKL,6,1,2,1);M(PKD,6,2,2,1);M(GL,6,1,1,1);gem(Rt?7:12,0);
  M(G,2,3,3,1);M(PKL,1,3,1,1);[PKL,PK,G,PKL].forEach((c,i)=>M(c,2+(i>=2?Math.round(Math.sin(t*2.4+i)):0),4+i,1,1));
  M(G,5,5,9,1);M(GL,5,5,3,1);M(GD,11,5,3,1);M(PK,11,4,2,1);M(PKD,12,5,1,1);M(TL,9,4,1,1);
  // tóc mái & tóc mai
  M(HC,5,6,8,1);M(HC,4,7,7,1);M(HL,6,6,3,1);M(HS,6,6,1,1);M(HC,11,7,2,1);M(HC,11,8,1,1);M(HC,5,8,3,1);M(HD,5,8,1,1);
  M(HC,8,8,1,3);M(HM,8,9,1,1)
 }

 /* ---- bling: bụi sao rơi + tia lấp lánh nổ ---- */
 TN_P.forEach(([x,y0,off],i)=>{const ph=(t*.35+off)%1,a=Math.sin(Math.PI*ph);if(a<.15)return;
  const yy=Math.round(y0+ph*30),xx=Math.round(x+Math.sin(t*2+i)*1.5),col=hs(i*36+t*50,Math.min(1,a*1.3),84);
  r(col,xx,yy,1,1);if(a>.7){const c2=hs(i*36+t*50,.45,84);r(c2,xx-1,yy,1,1);r(c2,xx+1,yy,1,1);r(c2,xx,yy-1,1,1);r(c2,xx,yy+1,1,1)}});
 TN_B.forEach(([x,y],i)=>{const ph=(t*.6+i*.27)%1;if(ph>.35)return;const q=Math.sin(ph/.35*Math.PI),L=1+Math.round(q*2),c=hs(i*70+t*80,.9,86);
  r('#ffffff',x,y,1,1);for(let d=1;d<=L;d++){r(c,x-d,y,1,1);r(c,x+d,y,1,1);r(c,x,y-d,1,1);r(c,x,y+d,1,1)}
  if(q>.7){r('rgba(255,255,255,.7)',x-1,y-1,1,1);r('rgba(255,255,255,.7)',x+1,y+1,1,1)}});
}

window.drawTienNu=function(g,r,u,o,S,k){
 try{return drawTN(g,r,u,o,S,k)}
 catch(e){if(window.console)console.warn('tiennu2.js lỗi, dùng bản cũ:',e);return _orig.apply(this,arguments)}
};
})();
