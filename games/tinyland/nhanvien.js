/* ===================================================================================
   NHANVIEN.JS — 🏨 NHÂN VIÊN KHÁCH SẠN: Set + Tóc (chỉ có bản Nữ)
   • Bán ở SHOP PHỐ XÁ:  Set 800 Xu (tab Set)  •  Tóc 1000 Xu (tab Tóc & mũ)
       → đổi giá: sửa NV_GIA_SET / NV_GIA_TOC ngay bên dưới (cần pho-map.js bản mới có đọc trường "xu").
   • SET : váy đen tay phồng, cổ áo trắng tròn có hàng khuy, măng sét ren trắng, váy xòe viền ren,
           TẠP DỀ trắng viền bèo, NƠ ĐEN to ở eo, tất trắng viền ren, giày búp bê đen.
   • TÓC : tóc hồng MƯỢT, bồng bềnh xù 2 bên (ngang vai, đuôi tóc lượn sóng), mái thưa mềm,
           BĂNG ĐÔ REN TRẮNG viền bèo + 2 NƠ ĐEN cài hai bên.
   • Vẽ ở độ phân giải GẤP ĐÔI (nửa điểm ảnh, tô theo hàm hình học + 5 tông bóng đổ) nên mượt, nhiều chi tiết.
   • Không che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   • File nạp SAU wintermage.js (cuối index.html), tự đẩy dữ liệu vào CUỐI mảng SETS / HAIRS
     (không làm lệch số thứ tự đồ đã mua).
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined')return;

const NV_GIA_SET=800,NV_GIA_TOC=1000;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần, luôn ở CUỐI mảng) ----------
if(!SETS.some(s=>s.k=='nvks'))SETS.push({n:'Set Nhân viên khách sạn',k:'nvks',fx:'nvks',xu:NV_GIA_SET,
 ds:'Váy đen tay phồng, cổ áo trắng tròn, măng sét ren, váy xòe viền ren, tạp dề trắng viền bèo, nơ đen to ở eo, tất trắng, giày búp bê đen. Hợp với Tóc Nhân viên khách sạn.',
 sh:'#2e2e3a',shl:'#4a4a5c',shd:'#1c1c26',scarf:'#ffffff',belt:'#ffffff',pt:'#f4f0f6',rpt:'#f4f0f6',shoe:'#1b1b24'});
if(!HAIRS.some(h=>h.k=='nvks'))HAIRS.push({n:'Tóc Nhân viên khách sạn',k:'nvks',c:'#f6bcd3',xu:NV_GIA_TOC});

// ---------- 2) bảng màu (mỗi bảng 5 tông: sáng nhất → tối nhất) ----------
const PK=['#fff3f8','#ffdfec','#f9c3da','#ee9fc0','#cd7099'],          // tóc hồng
      BK=['#74748c','#505064','#383844','#262633','#15151e'],          // váy / nơ đen
      WH=['#ffffff','#ffffff','#f7f2fa','#e5dcec','#c9bed6'],          // ren / tạp dề trắng
      PB='#f4a8c4';                                                    // điểm hồng (khuy)

// ---------- 3) bộ vẽ độ phân giải gấp đôi ----------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const sh5=(v,p)=>v<-.62?p[0]:v<-.18?p[1]:v<.32?p[2]:v<.78?p[3]:p[4];
const inE=(x,y,cx,cy,rx,ry)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return dx*dx+dy*dy<=1};
const blob=(cx,cy,rx,ry,p,lx,ly)=>(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return dx*dx+dy*dy>1?null:sh5(dx*(lx==null?.45:lx)+dy*(ly==null?.75:ly),p)};
const lay=(...fs)=>(x,y)=>{for(let i=0;i<fs.length;i++){const c=fs[i](x,y);if(c)return c}return null};
const mirF=f=>(x,y)=>f(40-x,y);
// dải ruy-băng đi theo đường cong: f(t) -> [x,y,nửa độ rộng]
const rib=(f,p)=>{const a=[];for(let i=0;i<=40;i++)a.push(f(i/40));
 return(x,y)=>{let b=1e9,bi=0;for(let i=0;i<a.length;i++){const d=Math.hypot(x-a[i][0],y-a[i][1]);if(d<b){b=d;bi=i}}const q=a[bi];if(b>q[2])return null;return sh5(((x-q[0])/q[2])*.75+(bi/40)*.2-.1,p)}};
// tô vùng theo hàm màu; gộp ô cùng màu thành khối chữ nhật
function paint(P,x0,y0,x1,y1,fn){x0=Math.floor(x0);y0=Math.floor(y0);x1=Math.ceil(x1);y1=Math.ceil(y1);let open=[];
 for(let y=y0;y<y1;y++){const row=[];let run=null,rs=0;
  for(let x=x0;x<=x1;x++){const c=x<x1?fn(x+.5,y+.5):null;if(c!==run){if(run)row.push({c:run,x:rs,w:x-rs});run=c;rs=x}}
  const nx=[];
  row.forEach(r=>{const m=open.find(o=>!o.u&&o.c===r.c&&o.x===r.x&&o.w===r.w&&o.y+o.h===y);if(m){m.h++;m.u=1;nx.push(m)}else nx.push({c:r.c,x:r.x,w:r.w,y,h:1,u:1})});
  open.forEach(o=>{if(!o.u)P(o.c,o.x,o.y,o.w,o.h)});nx.forEach(o=>o.u=0);open=nx}
 open.forEach(o=>P(o.c,o.x,o.y,o.w,o.h))}
// P: toạ độ nửa điểm ảnh. M = 2×tâm lật (nhìn ngang quay trái thì lật gương), dy = độ nhún (điểm ảnh)
const mkP=(u,flip,M,dy)=>(c,x,y,w,h)=>u(c,(flip?M-x-w:x)/2,y/2-(dy||0),w/2,h/2);
// viền tối nhẹ ở mép: nếu 1 ô lân cận ngoài hình thì dùng tông tối
const edged=(f,dark)=>(x,y)=>{const c=f(x,y);if(!c)return null;
 if(!f(x-1,y)||!f(x+1,y)||!f(x,y-1)||!f(x,y+1))return dark;return c};
// hình "xù": elip có mép gợn mềm như mây tóc
const fluffy=(cx,cy,rx,ry,amp,fr,ph)=>(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry,d=Math.sqrt(dx*dx+dy*dy);
 if(d>1.25)return false;const th=Math.atan2(dy,dx);return d<=1+amp*Math.sin(fr*th+(ph||0))};
const frill=(x,k)=>Math.abs(Math.sin(x*k));          // viền bèo lượn sóng

// nơ đen (loop trái + loop phải + nút + 2 đuôi); (cx,cy) tâm nút, s = tỉ lệ, tilt = nghiêng
const bowF=(cx,cy,s,tilt,p)=>{p=p||BK;
 const loop=dir=>(x,y)=>{const lx=(x-cx)*dir,ly=(y-cy)-tilt*lx*.12;const t=lx/(5.4*s);if(t<.05||t>1.05)return null;
  const hh=(1.2+2.9*sm(t*1.1))*s*(t>.85?1-(t-.85)*3.4:1);if(Math.abs(ly)>hh)return null;
  if(t>.2&&t<.82&&Math.abs(ly)<hh*.38)return ly>0?p[4]:p[3];
  return sh5((ly/hh)*.75-.12+(t-.5)*.1,p)};
 const knot=blob(cx,cy,1.7*s,2.1*s,p,.4,.8);
 const tail=dir=>rib(t=>[cx+dir*(1+1.9*t)*s,cy+(1+5.6*t)*s,(1.5-.45*t)*s],p);
 return lay(knot,loop(1),loop(-1),tail(1),tail(-1))};

// ---------- 4) SET NHÂN VIÊN KHÁCH SẠN ----------
SETFX.nvks=(u,o,S,K)=>{
 const{side,Rt,back,sit,rd,lg,sx,SK,SKS}=K,
  bob=o.nobob?0:o.mv?(lg?-1:0):0,
  P=mkP(u,side&&!Rt,42,0),            // thân (lật quanh x=21 khi nhìn ngang quay trái)
  PL=mkP(u,0,0,bob),                  // chân + tất + giày: toạ độ màn hình, không nhún
  skin=(x,y)=>sh5(((x-6)*.18)+((y-40)*.05),[SK,SK,SK,SKS,SKS]);

 // ---- tất trắng viền ren + giày búp bê đen (vẽ đè lên chân gốc) ----
 if(!rd){
  const leg=(x,l,w,toe)=>{                     // x = điểm ảnh gốc; l = nhấc chân; w = rộng (điểm ảnh)
   const X=x*2,W=w*2;
   paint(PL,X,52,X+W,59-l*2,(a,b)=>{if(b<53.2)return null;
    if(b<55.4)return b<54.2?WH[0]:(Math.abs(a-X-W/2)>W/2-.6?WH[3]:WH[2]);               // viền ren cổ tất
    return a<X+1.2?WH[2]:a>X+W-1.5?WH[3]:WH[1]});
   for(let k=0;k<w;k++)paint(PL,X+k*2,53.2,X+k*2+1.4,54.4,()=>WH[3]);
   // giày búp bê: đế mỏng, quai ngang cổ chân, mũi bo tròn
   paint(PL,X-.6,56.8-l*2,X+W+(toe?1.6:.6),60-l*2,(a,b)=>{
    const dx=a-(X+W/2+(toe?.6:0)),dy=b-(58.4-l*2);const rx=W/2+.8+(toe?.8:0);if(dx*dx/(rx*rx)+dy*dy/2.6>1)return null;
    if(b>59.1-l*2)return BK[4];if(b<57.7-l*2)return BK[1];return a<X+1.4?BK[1]:BK[2]});
   paint(PL,X+.6,57.7-l*2,X+W-.6,58.3-l*2,()=>BK[1]);           // quai giày sáng
   paint(PL,X+W/2-.5,57.5-l*2,X+W/2+.5,58.5-l*2,()=>'#9a9ab0');}  // khóa vàng nhỏ
  if(sit){const sw=Math.round(Math.sin(performance.now()/260)*1.5);
   for(const[x,s]of[[6,sw],[11,-sw]]){const e=s>0?1:0;
    paint(PL,x*2,54,x*2+6,60+e*2,(a,b)=>b<55.4?(b<54.4?WH[0]:WH[3]):(a<x*2+1.2?WH[2]:a>x*2+4.6?WH[3]:WH[1]));
    paint(PL,x*2-.4,60+e*2,x*2+6.6,62.4+e*2,(a,b)=>inE(a,b,x*2+3,61.2+e*2,3.6,1.3)?(b>61.6+e*2?BK[4]:BK[2]):null);}
  }else if(!side){let L=[[6,0],[11,0]];if(lg>0)L=[[11,0],[6,1]];else if(lg<0)L=[[6,0],[11,1]];L.forEach(q=>leg(q[0],q[1],3,0))}
  else{const x1=8+sx,x2=10-sx;let L=[[x1,0],[x2,0]];if(lg>0)L=[[x2,0],[x1,1]];else if(lg<0)L=[[x1,0],[x2,1]];
   L.forEach(q=>leg(q[0],q[1],3,Rt?1:-1))}
 }

 // ---- váy xòe viền ren + tạp dề ----
 const hemY=53.6;
 const skirtF=(cx0,wf)=>(x,y)=>{if(y<43.6||y>hemY+1.8)return null;const hw=(8.2+(y-44)*.78)*wf;if(Math.abs(x-cx0)>hw)return null;
  const e=hemY+.8*frill(x,.8);if(y>e)return null;
  if(y>hemY-1.1)return y>e-.5?WH[4]:(y>e-1.1?WH[3]:WH[1]);                        // viền ren gấu váy
  const fold=Math.sin((x-cx0)*.75)*.28;                                         // nếp váy
  return sh5(((x-cx0)/(hw+.01))*.5+((y-44)/10)*.25+fold-.05,BK)};
 const apronF=(cx0,wf,tw)=>(x,y)=>{if(y<44.4||y>51.8+.7*frill(x,.8))return null;const hw=(tw+(y-44)*.42)*wf;const a=Math.abs(x-cx0);if(a>hw)return null;
  const eb=51.8+.7*frill(x,.8);
  if(a>hw-1.3||y>eb-1.3){const k=(a>hw-.45||y>eb-.45)?WH[4]:(a>hw-.9||y>eb-.9)?WH[3]:WH[2];return k}   // viền bèo
  return sh5(((x-cx0)/(hw+.01))*.45+((y-44)/9)*.15+.02*Math.sin(x*2.1)-.45,[WH[0],WH[1],WH[2],WH[3],WH[4]])};
 if(!rd){
  if(!side){
   paint(P,2,43,38,56,skirtF(20,1));
   if(!back)paint(P,6,44,34,54,apronF(20,1,6.2));
  }else{
   paint(P,8,43,38,56,skirtF(22,.78));
   paint(P,24,44,36,54,(x,y)=>{if(y<44.4||y>51.6+.6*frill(x,.8))return null;const f=x-23.4;if(f<0||f>(5+(y-44)*.45))return null;
    const eb=51.6+.6*frill(x,.8);if(f>(4.4+(y-44)*.45)||y>eb-1.1)return f>(4.8+(y-44)*.45)||y>eb-.5?WH[4]:WH[3];return sh5(f*.07-.45,WH)});
  }
 }

 // ---- thân váy đen (corset) ----
 const bodice=(cx0,hwTop,hwWaist)=>(x,y)=>{if(y<32||y>44.6)return null;const t=clamp((y-33)/10.5,0,1),hw=hwTop+(hwWaist-hwTop)*sm(t);
  if(Math.abs(x-cx0)>hw)return null;if(y<33&&Math.abs(x-cx0)>hwTop-1.6)return null;
  return sh5(((x-cx0)/(hw+.01))*.5+t*.3-.12+Math.sin(x*1.8)*.12,BK)};
 const waistband=(cx0,hw)=>(x,y)=>{if(y<43.3||y>45.7||Math.abs(x-cx0)>hw)return null;return y<44.2?WH[0]:y<45?WH[2]:WH[3]};
 if(!side){
  paint(P,8,30,32,46,bodice(20,10.2,8.3));
  if(!back){
   // nút + nẹp trắng giữa ngực
   paint(P,19,36,21,44,(x,y)=>y>36.6?(x<20?WH[1]:WH[2]):null);
   for(const by of[38.6,41.2])paint(P,19.1,by,20.9,by+1.5,(x,y)=>inE(x,y,20,by+.75,.85,.75)?PB:null);
  }
  paint(P,8,43,32,46,waistband(20,10));
 }else{
  paint(P,13,30,30,46,bodice(21,7.4,6.6));
  paint(P,13,43,30,46,waistband(21,7.4));
 }

 // ---- tay: tay áo phồng đen + cánh tay + măng sét ren ----
 const armR=(ax,ay,aup)=>{            // ax = tâm tay áo (nửa điểm ảnh), ay = độ lắc cánh tay (điểm ảnh)
  const dy=ay*2;
  if(!aup){
   paint(P,ax-3.4,38.4+dy,ax+3.4,48+dy,(x,y)=>{
    if(y<39.6+dy)return Math.abs(x-ax)<2.6?skin(x,y):null;                            // cánh tay
    if(y<42.9+dy)return Math.abs(x-ax)<2.7?skin(x,y):null;
    if(y>=42.9+dy&&y<45.5+dy){const e=45.1+dy+.6*frill(x,2.2);if(y>e)return null;if(Math.abs(x-ax)>3.3)return null;         // măng sét ren
     return y<44+dy?WH[0]:(y>e-.9?WH[3]:WH[2])}
    return null})
  }
  paint(P,ax-5.4,30.6,ax+5.4,41.6,blob(ax,35.6,5,4,BK,.4,.7));                         // tay phồng
  paint(P,ax-4,38.1,ax+4,40.2,(x,y)=>(Math.abs(x-ax)<3.7&&y>38.4&&y<39.9)?BK[4]:null);  // gấu tay chun
  paint(P,ax-3,31.6,ax-.4,33.6,()=>BK[0]);                                              // điểm sáng
 };
 if(!side){
  armR(7.2,lg,o.aup);armR(32.8,-lg,o.aup);
 }else if(!o.noarm){
  const ax=(9-sx)*2+3;
  const dy=0;
  const S2=mkP(u,0,0,0);
  // cánh tay + măng sét (toạ độ màn hình)
  paint(S2,ax-3,40,ax+3,48,(x,y)=>{if(y<42.9)return Math.abs(x-ax)<2.6?skin(x,y):null;
   if(y<45.5){const e=45.1+.6*frill(x,2.2);if(y>e||Math.abs(x-ax)>3.2)return null;return y<44?WH[0]:(y>e-.9?WH[3]:WH[2])}return null});
  paint(S2,ax-5.2,30.6,ax+5.2,41.6,blob(ax,35.6,4.8,4,BK,.4,.7));
  paint(S2,ax-4,38.1,ax+4,40.2,(x,y)=>(Math.abs(x-ax)<3.5&&y>38.4&&y<39.9)?BK[4]:null);
 }

 // ---- cổ áo trắng tròn (Peter Pan) ----
 if(!side){
  paint(P,8,30,32,40,(x,y)=>{
   if(y<31)return null;
   const wing=(cx)=>inE(x,y,cx,35.4,5.8,3.5);
      if(!back&&inE(x,y,20,31.6,3.5,3.9)&&!(wing(14.6)&&wing(25.4)&&y>34.6))return skin(x,y);
   if(!(wing(14.6)||wing(25.4)))return null;
   if(!back&&Math.abs(x-20)<1&&y>35)return null;
   const e=!(inE(x,y,14.6,35.1,5.2,3)||inE(x,y,25.4,35.1,5.2,3));
   return e?(y>37?WH[4]:WH[3]):sh5(((x-20)/6)*.3+((y-34)/3)*.4-.55,WH)});
 }else{
  paint(P,10,30,32,40,(x,y)=>{if(y<31)return null;if(!(inE(x,y,23,35.2,6.2,3.4)))return null;
   const e=!inE(x,y,23,35,5.6,2.9);return e?(y>36.6?WH[4]:WH[3]):sh5(((x-22)/6)*.3+((y-34)/3)*.4-.55,WH)});
 }

 // ---- NƠ ĐEN to ở eo (trước: lệch trái nhẹ; sau: giữa lưng; ngang: sau lưng) ----
 if(!side){
  if(!back){paint(P,6,40,34,56,bowF(18.6,45,.92,0));}
  else{paint(P,4,40,36,58,bowF(20,45,1.05,0));}
 }else{
  paint(P,4,40,28,58,bowF(12.5,45.4,.85,0));
 }
};

// ---------- 5) TÓC NHÂN VIÊN KHÁCH SẠN ----------
const hairMaker=(PK,WH,decor)=>(u,o,K)=>{
 const{side,Rt,back}=K,P=mkP(u,side&&!Rt,40,0),mv=!!o.mv,
  t=performance.now()/1000,sw=mv?Math.sin(t*8)*.7:0;         // tóc đung đưa khi đi
 const strand=(x,y,k,ph)=>Math.sin(x*k+Math.sin(y*.45)*1.3+(ph||0));
 const hc=(x,y,cx,cy,rx,ry,lx)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;
  let v=dy*.62+dx*(lx==null?.3:lx)+.05+.17*strand(x,y,1.05);
  const ring=Math.abs((y-cy)+ry*.52+Math.abs(dx)*3.2);if(ring<1.1&&y<cy)v-=.55;       // vầng sáng trên đỉnh đầu
  return sh5(v,PK)};

 /* ---------- hình khối tóc ---------- */
 // (a) nhìn trước
 const crown=fluffy(20,16,13.6,12.8,.035,7,.4);
 const puffL=(x,y)=>fluffy(8.4,27.5,6.9,10.6,.05,6,1.1)(x,y);
 const curlsL=(x,y)=>inE(x,y,4.2,35.2+sw*.3,3.6,3.2)||inE(x,y,8.6,37.2+sw*.5,3.8,3.3)||inE(x,y,13,35.8+sw*.4,3.2,3);
 const sideL=(x,y)=>puffL(x,y)||curlsL(x,y);
 const bangY=x=>{const a=Math.abs(x-20);return 18.3+2.7*sm(a/7.4)+.55*frill(x,1.3)};
 const hole=(x,y)=>y>=bangY(x)&&inE(x,y,20,23.8,7.3,8.6);
 const faceHair=(x,y)=>{
  if(y>38.2)return false;
  const inL=x<20?sideL(x,y):sideL(40-x,y);
  const inC=crown(x,y);
  if(!(inL||inC))return false;
  return !hole(x,y)};
 const colF=(x,y)=>{
  if(!faceHair(x,y))return null;
  const L=x<20?x:40-x;
  let c=(y>22||L<12)&&y>17?hc(x,y,x<20?8.4:31.6,26,8,11,x<20?-.3:.3):hc(x,y,20,16,13.6,12.8);
  if(y>bangY(x)-1.3&&y<bangY(x)+.2&&Math.abs(x-20)<10.5&&y<22.4)c=PK[4];        // bóng đổ dưới mái
  return c};
 const hairFront=edged(colF,PK[4]);

 if(!side&&!back){
  paint(P,0,2,40,40,hairFront);
 }else if(back){
  const swb=sw*.5;
  const bobB=(x,y)=>{const yb=35.4+1.9*frill(x*.55+swb,1.2)+Math.sin(x*.9)*.5;
   if(y>yb)return false;
   if(inE(x,y,20,27,15.2,11.6))return true;
   if(fluffy(20,16,13.8,12.8,.035,7,.4)(x,y))return true;
   if(fluffy(5,28.5,5.2,8.2,.06,6,.8)(x,y)||fluffy(35,28.5,5.2,8.2,.06,6,2.1)(x,y))return true;
   return false};
  const colB=(x,y)=>{if(!bobB(x,y))return null;
   const dx=(x-20)/15,dy=(y-16)/20;let v=dy*.55+Math.abs(dx)*.32-.1+.22*strand(x,y,.95);
   if(Math.abs(x-20)<.8&&y>13)v+=.25;                                   // đường rẽ nhẹ phía sau
   if(y>33)v+=.18;return sh5(v,PK)};
  paint(P,0,2,40,42,edged(colB,PK[4]));
 }else{
  // nhìn ngang: sau đầu xù + đuôi tóc tới vai, mái trước đổ xuống thái dương
  const swS=sw*.5;
  const backS=(x,y)=>{const yb=35.6+1.9*frill(x*.6+swS,1.15);
   if(y>yb)return false;
   if(fluffy(14.4,27,10.6,10.8,.05,6,.7)(x,y))return true;
   if(inE(x,y,6.2,34.4+swS*.3,3.9,3.4)||inE(x,y,11.4,36.6+swS*.5,4,3.3)||inE(x,y,16.8,35.6,3.2,2.9))return true;
   return false};
  const crownS=fluffy(17.4,15.6,12.6,12.4,.035,7,.8);
  const holeS=(x,y)=>x>=20.4&&y>=(19.6-.28*(x-21)+(x>27?(x-27)*.5:0))&&y<=33;
  const colS=(x,y)=>{
   const sideburn=x>=17.4&&x<=24&&y>=17&&y<=30&&inE(x,y,20.8,17,3.8,13)&&!holeS(x,y);
   if(!(backS(x,y)||crownS(x,y)||sideburn))return null;
   if(holeS(x,y)&&!sideburn)return null;
   if(x>31.2)return null;
   let c=hc(x,y,backS(x,y)&&y>20?14.4:17.4,backS(x,y)&&y>20?27:15.6,10.8,11.5,.25);
   return c};
  paint(P,0,2,34,40,edged(colS,PK[4]));
 }

 /* ---------- BĂNG ĐÔ REN TRẮNG viền bèo ---------- */
 const ring=(x,y,cx,cy,rx,ry)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return Math.sqrt(dx*dx+dy*dy)};
 if(!side){
  const band=(x,y)=>{if(y>17.4)return null;const r=ring(x,y,20,16.4,12.6,10.6),th=Math.atan2((y-16.4)/10.6,(x-20)/12.6);
   const outer=1.04+.075*Math.abs(Math.sin(th*10)),inner=.76;
   if(r>outer||r<inner)return null;if(y>16.6&&Math.abs(x-20)>10.8&&r<.86)return null;
   const e=(r>outer-.045)?WH[4]:(r>outer-.1)?WH[3]:null;if(e)return e;
   if(Math.abs(Math.sin(th*10+.35))>.93)return WH[3];                                   // nếp bèo
   return sh5((r-.9)*3.2+(y-8)*.04-.5,WH)};
  paint(P,0,2,40,22,band);
  // nơ đen cài hai bên (nhìn trước: nghiêng nhẹ)
  decor(P,0,back);
 }else if(back){
  const band=(x,y)=>{if(y>17.4)return null;const r=ring(x,y,20,16.4,12.6,10.6),th=Math.atan2((y-16.4)/10.6,(x-20)/12.6);
   const outer=1.04+.075*Math.abs(Math.sin(th*10)),inner=.76;
   if(r>outer||r<inner)return null;if(y>16.6&&Math.abs(x-20)>10.8&&r<.86)return null;
   if(r>outer-.045)return WH[4];if(r>outer-.1)return WH[3];if(Math.abs(Math.sin(th*10+.35))>.93)return WH[3];
   return sh5((r-.9)*3.2+(y-8)*.04-.5,WH)};
  paint(P,0,2,40,22,band);
  decor(P,0,back);
 }else{
  const band=(x,y)=>{if(y>17.6)return null;const r=ring(x,y,17.4,16.2,12,10.4),th=Math.atan2((y-16.2)/10.4,(x-17.4)/12);
   const outer=1.05+.075*Math.abs(Math.sin(th*10)),inner=.78;
   if(r>outer||r<inner||x>29.6)return null;
   if(r>outer-.045)return WH[4];if(r>outer-.1)return WH[3];if(Math.abs(Math.sin(th*10+.35))>.93)return WH[3];
   return sh5((r-.9)*3.2+(y-8)*.04-.5,WH)};
  paint(P,0,2,36,22,band);
  decor(P,1,0);
 }
};

// ---- trang trí của Tóc Nhân viên khách sạn: 2 nơ đen cài hai bên ----
const decorBow=(P,side)=>{
 if(!side)paint(P,0,1,40,18,lay(bowF(9.6,10.4,.95,-1.6),bowF(30.4,10.4,.95,1.6)));
 else paint(P,0,1,40,18,bowF(11.4,9.6,.95,0));
};
HAIRFX.nvks=hairMaker(PK,WH,decorBow);

/* ===================================================================================
   🦌 TÓC ĐÔNG XÙ — dựa trên Tóc Nhân viên khách sạn: tóc TRẮNG TUYẾT xù bồng, băng đô ren băng giá,
   2 SỪNG TUẦN LỘC thay cho 2 nơ, 1 BÔNG HOA TUYẾT cài trên tóc.
   • Đổi ở gian hàng ÔNG GIÀ NOEL (Làng tuyết) bằng 3 ❄️ Huy hiệu tuyết (bd:3).
     Muốn đổi giá: sửa bd:3 ở dòng HAIRS.push bên dưới. Món này KHÔNG bán ở Shop Phố xá (ach:1).
   • Món nằm trong snow-village.js: SBSHOP có dòng {t:'h',k:'nvdx'}.
   =================================================================================== */
const SN=['#ffffff','#f7fbff','#e7f2fb','#c9dff0','#9fbfd9'],       // tóc trắng tuyết (bóng xanh băng rất nhẹ)
      WI=['#fbfeff','#e6f4ff','#cde4f6','#a6cbe6','#7aaad0'],       // ren băng giá
      AN=['#e0b27a','#c08a52','#9a6a3c','#744828','#4a2a16'];       // sừng nâu
// bông hoa tuyết: 6 nhánh + nhánh con, tâm trắng
const flakeF=(cx,cy,r)=>(x,y)=>{const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy);if(d>r+.6)return null;
 if(d<.95)return '#ffffff';
 const seg=(px,py,x1,y1,x2,y2)=>{const vx=x2-x1,vy=y2-y1,t=clamp(((px-x1)*vx+(py-y1)*vy)/(vx*vx+vy*vy),0,1);return Math.hypot(px-x1-t*vx,py-y1-t*vy)};
 let best=9;
 for(let k=0;k<6;k++){const a=k*Math.PI/3,ca=Math.cos(a),sa=Math.sin(a),
   P1=(l,p)=>[cx+l*ca-p*sa,cy+l*sa+p*ca];
  const e=P1(r,0),m=P1(r*.58,0),b1=P1(r*.84,r*.3),b2=P1(r*.84,-r*.3);
  best=Math.min(best,seg(x,y,cx,cy,e[0],e[1]),seg(x,y,m[0],m[1],b1[0],b1[1]),seg(x,y,m[0],m[1],b2[0],b2[1]))}
 if(best>.56)return null;return d<r*.42?'#d8f1ff':(d<r*.75?'#8ccbf2':'#62aee6')};
// sừng tuần lộc: thân cong + 2 nhánh; sd=1 trái, -1 phải (nhìn trước/sau)
const antlerF=(bx,by,dir,sc,p)=>{p=p||AN;sc=sc||1;
 const X=(l)=>bx+dir*l*sc,Y=(l)=>by-l*sc;
 const beam=rib(t=>[bx-dir*(5.2*t+1.1*Math.sin(t*3.1))*sc,by-(12.6*t)*sc,(2.0-.7*t)*sc],p);
 const t1=rib(t=>[bx-dir*(2.7+3.3*t)*sc*-1+dir*0,by-(5.4+4.4*t)*sc,(1.5-.6*t)*sc],p);          // nhánh trong, hướng lên
 const t2=rib(t=>[bx-dir*(4.2+2.9*t)*sc,by-(9.3+1.8*t)*sc,(1.45-.6*t)*sc],p);                    // nhánh ngoài
 const tuft=blob(bx,by+.4,2.9*sc,2.1*sc,SN,.3,.8);
 return lay(tuft,beam,t1,t2)};
const decorSnow=(P,side,back)=>{
 const flake=(cx,cy)=>flakeF(cx,cy,3.5);
 if(!side){
  paint(P,0,-6,40,20,lay(antlerF(10.4,11.4,1,1),antlerF(29.6,11.4,-1,1)));
  if(!back)paint(P,22,11,36,25,flake(29,17.4));else paint(P,22,11,36,25,flake(30,17.2));
 }else{
  paint(P,0,-6,40,20,lay(antlerF(11.6,10.6,1,1),antlerF(15.6,10.8,1,.8,[AN[1],AN[2],AN[3],AN[4],AN[4]])));
  paint(P,6,10,26,26,flake(14.6,17.6));
 }
};
HAIRFX.nvdx=hairMaker(SN,WI,decorSnow);
if(!HAIRS.some(h=>h.k=='nvdx'))HAIRS.push({n:'Tóc Đông xù',k:'nvdx',c:'#eef6fc',ach:1,bd:3});
})();
