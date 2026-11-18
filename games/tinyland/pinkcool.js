/* ===================================================================================
   PINKCOOL.JS — 🎀 BỘ PINKCOOL: Set Nữ / Set Nam + Tóc Nữ / Tóc Nam (4 món)
   • Bán ở TIỆM CHÚ HỀ (circus.js) — cần ĐỦ 3 thứ mới mua được (sửa giá ở mảng CL_ITEMS):
       Set Pinkcool (Nữ) / (Nam) : 1.000 Xu + 300 Xu quái vật + 1 Kim cương (mỗi set)
       Tóc Pinkcool (Nữ) / (Nam) :   900 Xu + 400 Xu quái vật + 1 Kim cương (mỗi bản)
   • File nạp CUỐI CÙNG trong index.html, tự đẩy dữ liệu vào CUỐI mảng SETS / HAIRS
     (không làm lệch số thứ tự đồ đã mua).
   • SET NỮ : áo caro đỏ, cổ ren, NƠ HỒNG TO Ở NGỰC, tay áo viền ren, váy caro xòe viền ren, giày đỏ.
   • SET NAM: áo caro đỏ, cổ sơ mi trắng + nơ cổ đỏ, khuy vàng, quần short caro viền trắng, thắt lưng khóa vàng.
   • TÓC NỮ : tóc hồng xoăn đuôi + MŨ REN TRẮNG bồng + NƠ ĐỎ RẤT TO.
   • TÓC NAM: tóc hồng NGẮN đẹp trai (hai bên + gáy fade mờ dần, mái trên texture lọn ngắn) + VƯƠNG MIỆN VÀNG.
   • PHÁ GIỚI HẠN: vẽ ở độ phân giải GẤP ĐÔI (mỗi ô chia 4 điểm ảnh nhỏ, tô theo hàm hình học + 5 tông bóng đổ),
     nên đường cong mượt, nhiều chi tiết, vượt khung 20x31 thoải mái. Không dùng hình tam giác để vẽ tóc/đầu.
   • Không che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   =================================================================================== */
(function(){
if(typeof SETS==='undefined'||typeof HAIRS==='undefined'||typeof SETFX==='undefined'||typeof HAIRFX==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần, luôn ở CUỐI mảng) ----------
if(!SETS.some(s=>s.k=='pinkcool'))SETS.push({n:'Set Pinkcool (Nữ)',k:'pinkcool',fx:'pinkcool',ach:1,
 ds:'Áo caro đỏ cổ ren, nơ hồng to ở ngực, tay áo viền ren, váy caro đỏ xòe viền ren trắng, giày đỏ. Hợp với Tóc Pinkcool (Nữ).',
 sh:'#d92a3a',shl:'#ff5c6c',shd:'#a3182a',scarf:'#ffffff',belt:'#ffffff',trim:'#ffc2da',skirt:'#d92a3a',pt:'#c9243a',rpt:'#c9243a',shoe:'#c8203a'});
if(!HAIRS.some(h=>h.k=='pinkcool'&&h.pc=='f'))HAIRS.push({n:'Tóc Pinkcool (Nữ)',k:'pinkcool',pc:'f',c:'#ff9ec6',ach:1});
if(!HAIRS.some(h=>h.k=='pinkcool'&&h.pc=='m'))HAIRS.push({n:'Tóc Pinkcool (Nam)',k:'pinkcool',pc:'m',c:'#ff9ec6',ach:1});
if(!SETS.some(s=>s.k=='pinkcoolm'))SETS.push({n:'Set Pinkcool (Nam)',k:'pinkcoolm',fx:'pinkcoolm',ach:1,
 ds:'Áo sơ mi caro đỏ, cổ trắng + nơ cổ đỏ, khuy vàng, quần short caro viền trắng, thắt lưng khóa vàng, giày đỏ. Hợp với Tóc Pinkcool (Nam).',
 sh:'#d92a3a',shl:'#ff5c6c',shd:'#a3182a',scarf:'#ffffff',belt:'#fff3f6',trim:'#ffc2da',pt:'#c9243a',rpt:'#c9243a',shoe:'#c8203a'});

// ---------- 2) bảng màu (mỗi bảng 5 tông: sáng nhất → tối nhất) ----------
const PKP=['#ffe4ef','#ffc6dc','#ff9ec6','#ec6fa4','#c24785'],          // tóc hồng
      WHP=['#ffffff','#ffffff','#f7f0fa','#e6daef','#cdbfdd'],          // ren trắng
      RDP=['#ff7a88','#f0384c','#e0243a','#a01426','#6e0c1a'],          // nơ đỏ
      GDP=['#fff6b0','#ffe27a','#ffd23a','#d9961a','#a86a0c'],          // vàng
      BWP=['#ffd6e6','#ffb0cf','#ff7fb0','#d4457f','#a83068'],          // nơ hồng
      RBP=['#ffb3c2','#ff6b88','#ff2f5a','#c4163c','#7a0c24'],          // hồng ngọc
      SBP=['#d8f6ff','#8fe0ff','#46c8ff','#1f93d0','#126496'];          // ngọc xanh
const PRD='#b01a2c',PRL='#ff7b88',GKK='#a86a0c',WH='#ffffff',WS='#e6daef',WSS='#cdbfdd',RK='#a01426';

// ---------- 3) bộ vẽ độ phân giải gấp đôi ----------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const sh5=(v,p)=>v<-.62?p[0]:v<-.18?p[1]:v<.32?p[2]:v<.78?p[3]:p[4];
const blob=(cx,cy,rx,ry,p,lx,ly)=>(x,y)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return dx*dx+dy*dy>1?null:sh5(dx*(lx==null?.45:lx)+dy*(ly==null?.75:ly),p)};
const inE=(x,y,cx,cy,rx,ry)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return dx*dx+dy*dy<=1};
const mirF=f=>(x,y)=>f(40-x,y);                         // lật gương quanh x=20 (đơn vị nửa điểm ảnh)
const lay=(...fs)=>(x,y)=>{for(let i=0;i<fs.length;i++){const c=fs[i](x,y);if(c)return c}return null};   // lớp đầu tiên nằm trên
// dải ruy-băng đi theo đường cong: f(t) -> [x,y,độ rộng nửa]
const rib=(f,p)=>{const a=[];for(let i=0;i<=48;i++)a.push(f(i/48));
 return(x,y)=>{let b=1e9,bi=0;for(let i=0;i<a.length;i++){const d=Math.hypot(x-a[i][0],y-a[i][1]);if(d<b){b=d;bi=i}}const q=a[bi];if(b>q[2])return null;return sh5(((x-q[0])/q[2])*.75+(bi/48)*.22-.1,p)}};
// tô vùng [x0,y0,x1,y1] theo hàm màu; gộp ô cùng màu thành khối chữ nhật
function paint(P,x0,y0,x1,y1,fn){x0=Math.floor(x0);y0=Math.floor(y0);x1=Math.ceil(x1);y1=Math.ceil(y1);let open=[];
 for(let y=y0;y<y1;y++){const row=[];let run=null,rs=0;
  for(let x=x0;x<=x1;x++){const c=x<x1?fn(x+.5,y+.5):null;if(c!==run){if(run)row.push({c:run,x:rs,w:x-rs});run=c;rs=x}}
  const nx=[];
  row.forEach(r=>{const m=open.find(o=>!o.u&&o.c===r.c&&o.x===r.x&&o.w===r.w&&o.y+o.h===y);if(m){m.h++;m.u=1;nx.push(m)}else nx.push({c:r.c,x:r.x,w:r.w,y,h:1,u:1})});
  open.forEach(o=>{if(!o.u)P(o.c,o.x,o.y,o.w,o.h)});nx.forEach(o=>o.u=0);open=nx}
 open.forEach(o=>P(o.c,o.x,o.y,o.w,o.h))}
// P: toạ độ nửa điểm ảnh; khi nhìn ngang tự lật theo hướng (Rt)
const mkP=(u,side,Rt)=>(c,x,y,w,h)=>u(c,(side&&!Rt?40-x-w:x)/2,y/2,w/2,h/2);

// ---------- 4) SET PINKCOOL (chi tiết nửa điểm ảnh) ----------
// họa tiết caro: đường mảnh 0,5 điểm ảnh
const plaid=(x,y,ox)=>{const a=(x+ox)%6<1,b=y%6<1;return a&&b?'#8e1224':a?PRD:b?PRL:null};
function setCommon(u,o,K,fem){
 const{side,Rt,back,rd,lg,sx}=K,P=mkP(u,side,Rt);
 const bowL=(cx,cy,rx,ry)=>(x,y)=>{const t=clamp((cx+rx-x)/(2*rx),0,1),re=ry*(.58+.42*(1-t)),yy=cy-.18*(x-cx-rx)*-1*.0-(x-(cx+rx))*.0;const dx=(x-cx)/rx,dy=(y-cy)/re;
  if(dx*dx+dy*dy>1)return null;if(inE(x,y,cx-rx*.18,cy+.4,rx*.55,re*.42))return dy>0?BWP[4]:BWP[3];return sh5(dx*.3+dy*.85,BWP)};
 return{P,bowL};
}
SETFX.pinkcool=(u,o,S,K)=>{
 const{side,Rt,back,rd,lg,sx}=K,{P,bowL}=setCommon(u,o,K,1);
 const bowM=(cx,cy)=>lay(blob(cx,cy,2.6,3.2,BWP),()=>null);
 if(!side){
  // caro trên thân + tay áo
  paint(P,10,34,30,44,(x,y)=>{if(y<35&&(x<12||x>28))return null;return plaid(x,y,0)});
  paint(P,4,34,10,43,(x,y)=>plaid(x,y,2));paint(P,30,34,36,43,(x,y)=>plaid(x,y,2));
  // cổ ren tròn
  paint(P,10,30,30,40,lay(blob(14,35,5.6,3.4,WHP),blob(26,35,5.6,3.4,WHP),(x,y)=>(y>=31.5&&y<35&&Math.abs(x-20)<7)?WHP[2]:null));
  paint(P,10,37,30,40,(x,y)=>{const a=Math.abs(x-20);if(a>9||y<38)return null;return (y>38.2+1.1*Math.abs(Math.sin(x*1.5))&&inE(x,y,14,35,5.6,4.4)||(y>38.2+1.1*Math.abs(Math.sin(x*1.5))&&inE(x,y,26,35,5.6,4.4)))?null:null});
  if(!back){
   // NƠ HỒNG TO Ở NGỰC: hai cánh nghiêng + nút + 2 dải rủ
   const tl=rib(t=>[16-2.5*t+1.2*Math.sin(t*3),41+7*t,2.1],BWP),tr=mirF(tl);
   paint(P,10,40,30,50,lay(tl,tr));
   paint(P,6,32,34,44,lay(blob(20,38,2.9,3.4,BWP,.4,.8),bowL(8,37.2,5.8,4.3),mirF(bowL(8,37.2,5.8,4.3))));
   paint(P,18,36,22,41,(x,y)=>inE(x,y,19.2,37,.9,.9)?BWP[0]:null);
  }else{
   const tl=rib(t=>[16-2*t,46+7*t,2],BWP),tr=mirF(tl);paint(P,10,45,30,56,lay(tl,tr));
   paint(P,6,40,34,52,lay(blob(20,46,2.8,3.2,BWP),bowL(8,45.5,5.4,4),mirF(bowL(8,45.5,5.4,4))));
  }
  // cổ tay áo ren trắng (hai bên)
  if(!o.aup){for(const [x0,ay] of[[4,lg],[30,-lg]]){paint(P,x0,38+ay*2,x0+6,46+ay*2,(x,y)=>{const yy=y-(38+ay*2);if(yy<2.2)return WHP[1];if(yy<6+.9*Math.abs(Math.sin(x*1.9)))return yy<3.5?WHP[2]:yy<5?WHP[3]:WHP[4];return null})}}
  if(!rd){
   // váy caro xòe + dây lưng hồng + gấu ren
   paint(P,8,44,32,56,(x,y)=>{const hw=y<48?8:y<50?10:12;if(Math.abs(x-20)>hw)return null;
    if(y<46)return y<45?BWP[1]:BWP[3];
    if(y>=52+.0){const e=53.3+1.3*Math.abs(Math.sin(x*.95));if(y>=e)return null;return y<53?WHP[1]:(y<54?WHP[3]:WHP[4])}
    const c=plaid(x,y,Math.floor(((x-20)/hw)*0)+0);return c||null});
   paint(P,8,50,32,56,(x,y)=>{const e=53.3+1.3*Math.abs(Math.sin(x*.95));return(Math.abs(x-20)<=12&&y>=51.6&&y<e)?(y<52.8?WHP[1]:(y<53.9?WHP[3]:WHP[4])):null});
   paint(P,12,44,28,46.2,(x,y)=>y<45?BWP[1]:BWP[2]);
  }
 }else{
  // ---- nhìn ngang ----
  paint(P,14,34,28,44,(x,y)=>plaid(x,y,1));
  if(!o.noarm&&!o.aup){const ax=(9-sx)*2;paint(P,ax,40,ax+6,46,(x,y)=>{const yy=y-40;return yy<2.2?WHP[1]:yy<5.6?WHP[3]:null})}
  paint(P,12,30,30,38,lay(blob(22,34,6.4,3,WHP),(x,y)=>(Math.abs(x-22)<6&&y>=31.5&&y<34)?WHP[2]:null));
  paint(P,16,34,36,50,lay(rib(t=>[23-2*t,41+7*t,2],BWP),blob(26.5,37.3,3.6,3.6,BWP),blob(24.6,37.6,2.4,2.6,BWP,.2,.9),(x,y)=>inE(x,y,25.2,36,.8,.8)?BWP[0]:null));
  if(!rd){
   paint(P,10,44,34,56,(x,y)=>{const hw=y<48?7:y<50?8:10.5;if(x<20-hw||x>20+hw+1)return null;
    if(y<46)return y<45?BWP[1]:BWP[3];
    const e=53.3+1.3*Math.abs(Math.sin(x*.95));if(y>=51.6){return y>=e?null:(y<52.8?WHP[1]:(y<53.9?WHP[3]:WHP[4]))}
    return plaid(x,y,0)});
  }
 }
};
SETFX.pinkcoolm=(u,o,S,K)=>{
 const{side,Rt,back,rd,sit,lg,sx}=K,P=mkP(u,side,Rt);
 const cuffs=()=>{if(!o.aup){for(const [x0,ay] of[[4,lg],[30,-lg]]){paint(P,x0,38+ay*2,x0+6,46+ay*2,(x,y)=>{const yy=y-(38+ay*2);return yy<2.4?WHP[1]:yy<4?WHP[2]:yy<5.6?WHP[3]:null})}}};
 if(!side){
  paint(P,10,34,30,44,(x,y)=>{if(y<35&&(x<12||x>28))return null;return plaid(x,y,0)});
  paint(P,4,34,10,43,(x,y)=>plaid(x,y,2));paint(P,30,34,36,43,(x,y)=>plaid(x,y,2));
  // cổ sơ mi trắng (hai cánh bẻ bo tròn)
  paint(P,10,30,30,40,lay(blob(15,35.2,4.6,3.4,WHP,.3,.8),blob(25,35.2,4.6,3.4,WHP,.3,.8),(x,y)=>(y>=31.5&&y<34.5&&Math.abs(x-20)<8)?WHP[2]:null));
  if(!back){
   // nơ cổ đỏ + hàng khuy vàng
   const t1=rib(t=>[18.4-1.2*t,37+4.5*t,1.9],RDP),t2=mirF(t1);paint(P,14,36,26,44,lay(t1,t2));
   paint(P,12,33,28,42,lay(blob(20,36,1.9,2.3,RDP),(x,y)=>(inE(x,y,15.6,36.4,3.8,2.6)&&!inE(x,y,17.6,36.4,1.2,1))?sh5(((x-15.6)/3.8)*.3+((y-36.4)/2.6)*.9,RDP):null,(x,y)=>(inE(x,y,24.4,36.4,3.8,2.6)&&!inE(x,y,22.4,36.4,1.2,1))?sh5(((x-24.4)/3.8)*.3+((y-36.4)/2.6)*.9,RDP):null));
   for(const by of[42,44.5])paint(P,19,by,21,by+1.6,(x,y)=>inE(x,y,20,by+.8,1,.8)?GDP[+(y>by+.9)*2+1]:null);
  }else{paint(P,12,34,28,42,(x,y)=>Math.abs(x-20)<.5?PRD:null)}
  cuffs();
  // thắt lưng + khóa vàng, quần short caro viền trắng
  if(!rd){
   paint(P,12,44,28,46,(x,y)=>y<45?'#fff3f6':WS);
   if(!back)paint(P,18,43.6,22,46.4,(x,y)=>(x>=18.4&&x<=21.6)&&(y>=44&&y<=46)?((x<19||y<44.5)?GDP[0]:(x>21||y>45.6)?GDP[3]:GDP[2]):null);
   for(const x0 of[12,22]){paint(P,x0,46,x0+6,54,(x,y)=>{if(y>=52.2)return y<53.2?WHP[1]:WHP[3];return plaid(x,y,0)})}
  }
 }else{
  paint(P,14,34,28,44,(x,y)=>plaid(x,y,1));
  if(!o.noarm&&!o.aup){const ax=(9-sx)*2;paint(P,ax,40,ax+6,46,(x,y)=>{const yy=y-40;return yy<2.4?WHP[1]:yy<4?WHP[2]:yy<5.6?WHP[3]:null})}
  paint(P,12,30,30,38,lay(blob(22,34,6.2,3,WHP,.3,.8),(x,y)=>(Math.abs(x-22)<6&&y>=31.5&&y<34)?WHP[2]:null));
  paint(P,20,34,32,42,lay(blob(26,36.4,3.6,2.4,RDP),(x,y)=>(inE(x,y,26,36.4,1.5,1.3))?RDP[4]:null));
  if(!rd){paint(P,14,44,28,46,(x,y)=>y<45?'#fff3f6':WS);
   const x1=(8+sx)*2,x2=(10-sx)*2;for(const x0 of[x1,x2])paint(P,x0,46,x0+6,54,(x,y)=>{if(y>=52.2)return y<53.2?WHP[1]:WHP[3];return plaid(x,y,0)})}
 }
};

// ---------- 5) TÓC PINKCOOL (nửa điểm ảnh, tô theo hàm hình học) ----------
HAIRFX.pinkcool=(u,o,K)=>{
 const{side,Rt,back,HS}=K,fem=!(HS&&HS.pc=='m'),P=mkP(u,side,Rt),mv=!!o.mv;
 const sw=mv?Math.sin(performance.now()/130)*.8:0;                 // tóc / nơ đung đưa khi đi
 const strand=(x,y,k,ph)=>Math.sin(x*k+y*.1+(ph||0));
 const pkS=(x,y,base,k)=>{const s=strand(x,y,k||.9);return s>.72?PKP[1]:s<-.7?PKP[3]:PKP[base==null?2:base]};

 /* ============================ NỮ ============================ */
 if(fem){
  // --- nơ đỏ RẤT TO: hai cánh phồng nghiêng + nút + 2 dải rủ ---
  const loopF=(cx,cy,rx,ry,dir)=>(x,y)=>{const t=clamp(dir*(x-20)/26,0,1),re=ry*(.55+.45*sm(t*1.15)),yy=cy-(dir*(x-20)>0?0:0)-.16*dir*(x-20)*.0;
   const dx=(x-cx)/rx,dy=(y-(cy-.18*Math.abs(x-20)+3))/re;if(dx*dx+dy*dy>1)return null;
   const ix=(x-(cx-dir*rx*.2))/(rx*.56),iy=(y-(cy-.18*Math.abs(x-20)+3.6))/(re*.42);
   if(ix*ix+iy*iy<1)return iy>.2?RDP[4]:RDP[3];
   return sh5(dx*.3+dy*.9,RDP)};
  const bow=()=>{
   if(!side){
    const t1=rib(t=>[11.5-7*t-1.2*Math.sin(t*2.6)+sw*t,6+15*t,3.1-.8*t],RDP),t2=mirF(t1);
    paint(P,-10,-12,50,34,lay(t1,t2));
    paint(P,-12,-12,52,16,lay(blob(20,1.6,4.8,6,RDP,.4,.8),loopF(7,-.5,13,8.8,-1),mirF(loopF(7,-.5,13,8.8,-1))));
    paint(P,16,-3,24,5,(x,y)=>inE(x,y,18.4,-.6,1.2,1.6)?RDP[0]:null);
   }else{
    const tl=rib(t=>[11-7*t+sw*t,6+14*t,3.1-.8*t],RDP);paint(P,0,0,30,34,tl);
    paint(P,-8,-12,40,16,lay(blob(18,1.8,4.8,6,RDP,.4,.8),blob(28,1.4,8,6.2,RDP),(x,y)=>(inE(x,y,28.8,2,4,2.4))?RDP[3]:null,blob(5,-.5,12.5,8.6,RDP),(x,y)=>inE(x,y,6.4,.3,6.2,3.4)?(y>.8?RDP[4]:RDP[3]):null));
   }
  };
  // --- mũ ren trắng bồng + viền ren xếp nếp ---
  const capF=(cx,cy,rx,ry)=>(x,y)=>{if(!inE(x,y,cx,cy,rx,ry))return null;const e=16.2+1.4*Math.abs(Math.sin(x*.95));if(y>e)return null;
   if(y>14.6&&y<=e)return y<15.4?WHP[2]:y<16?WHP[3]:WHP[4];
   const dx=(x-cx)/rx,dy=(y-cy)/ry;let c=sh5(dx*.5+dy*.75,WHP);
   if(Math.sin((x-cx)*.62)>.9&&y>3)c=WHP[3];                        // nếp gấp vải
   if(((x*2|0)%7==3)&&((y*2|0)%7==3)&&y>5&&y<13)c=PKP[1];             // lỗ ren hồng
   if(y>13&&y<14.3)c=WHP[3];return c};
  const flapF=cx=>(x,y)=>{if(!inE(x,y,cx,21.5,4.4,7.4))return null;const e=27.8+1.2*Math.abs(Math.sin(x*1.2));if(y>e)return null;
   const dx=(x-cx)/4.4,dy=(y-21.5)/7.4;let c=sh5(dx*.5+dy*.6,WHP);if(y>24.8)c=y<26?WHP[2]:WHP[3];if(Math.sin(y*1.7)>.93)c=WHP[3];return c};
  if(!side&&!back){
   // tóc dài hai bên + xoăn đuôi
   const lock=(x,y)=>{const xl=4.2+1.5*Math.sin(y*.22),xr=y<31?12.2:14.6;if(y<14||y>40||x<xl||x>xr)return null;
    let c=pkS(x,y,2,.95);if(x-xl<1.4)c=PKP[3];if(y>36)c=PKP[3];return c};
   const curl=blob(8.6,36.6,4.6,4.2,PKP,.5,.8);
   paint(P,2,12,14,46,lay(curl,lock));paint(P,26,12,38,46,mirF(lay(curl,lock)));
   // tóc mái rẽ ngôi dưới mũ
   const bang=(x,y)=>{const a=Math.abs(x-20);if(a>8.8||a<.9)return null;const yb=17.2+3.5*sm(a/8)+.8*Math.sin(x*1.3);if(y<15||y>yb)return null;
    let c=pkS(x,y,2,1.1);if(yb-y<1)c=PKP[3];return c};
   paint(P,10,14,30,23,bang);
   paint(P,0,0,40,34,lay(flapF(7.5),mirF(flapF(7.5)),capF(20,10,17,9.2)));
   bow();
  }else if(back){
   const hairB=(x,y)=>{const a=Math.abs(x-20);if(inE(x,y,20,18,15.2,12.5)&&y<30)return 1;if(a<=15&&y>=24&&y<=36)return 1;if(inE(x,y,20,36,15,8.5))return 1;return 0};
   paint(P,3,5,37,46,(x,y)=>{if(!hairB(x,y))return null;let c=pkS(x,y,2,.85);if(y>40)c=PKP[3];if(y>43)c=PKP[4];if(Math.abs(x-20)>13)c=PKP[3];return c});
   paint(P,0,0,40,34,lay(flapF(7.5),mirF(flapF(7.5)),capF(20,10,17,9.2)));
   bow();
  }else{
   // nhìn ngang
   const lockS=(x,y)=>{const xl=3+1.5*Math.sin(y*.22);if(y<14||y>40||x<xl||x>(y<30?21:22))return null;let c=pkS(x,y,2,.95);if(x-xl<1.4)c=PKP[3];if(y>36)c=PKP[3];return c};
   const curlS=blob(11,37,5,4.4,PKP,.5,.8);
   const bangS=(x,y)=>{if(x<20||x>29.4||y<15)return null;const yb=19.6-.35*(x-20)+(x>27?(x-27)*.9:0);if(y>yb||!inE(x,y,22.5,15,8,6.5))return null;let c=pkS(x,y,2,1);if(yb-y<1)c=PKP[3];return c};
   const sideburn=(x,y)=>(x>=19&&x<=23.6&&y>=17&&y<=27.5&&inE(x,y,21.3,17,2.4,11))?(x>22.6?PKP[3]:PKP[2]):null;
   paint(P,0,10,38,46,lay(bangS,sideburn,curlS,lockS));
   const capS=(x,y)=>{if(!inE(x,y,18,10,15,9.2))return null;const e=16.2+1.4*Math.abs(Math.sin(x*.95));if(y>e)return null;
    if(y>14.6)return y<15.4?WHP[2]:y<16?WHP[3]:WHP[4];let c=sh5((x-18)/15*.5+(y-10)/9.2*.75,WHP);if(Math.sin((x-18)*.62)>.9&&y>3)c=WHP[3];
    if(((x*2|0)%7==3)&&((y*2|0)%7==3)&&y>5&&y<13)c=PKP[1];if(y>13&&y<14.3)c=WHP[3];return c};
   const flapS=(x,y)=>{if(!inE(x,y,19,21.5,5,7.4))return null;const e=27.8+1.2*Math.abs(Math.sin(x*1.2));if(y>e)return null;let c=sh5((x-19)/5*.5+(y-21.5)/7.4*.6,WHP);if(y>24.8)c=y<26?WHP[2]:WHP[3];return c};
   paint(P,0,0,40,34,lay(flapS,capS));
   bow();
  }
  return;
 }

 /* ============================ NAM: TÓC NGẮN FADE + MÁI TEXTURE + VƯƠNG MIỆN ============================ */
 const hsh=(x,y)=>{const v=Math.sin(x*12.9898+y*78.233)*43758.5453;return v-Math.floor(v)};
 // màu tóc có texture: các lọn ngắn xen kẽ sáng / tối + vài điểm bóng
 const tex=(x,y,dark)=>{const s=Math.sin(x*1.5+y*.3+Math.sin(y*.8)*.5);let c=PKP[2];if(s>.7)c=PKP[1];else if(s<-.7)c=PKP[3];
  if(hsh(x,y)>.985)c=PKP[0];if(dark)c=c===PKP[1]?PKP[2]:c===PKP[2]?PKP[3]:PKP[4];return c};
 const crownF=cy=>(x,y)=>{   // vòng vàng ôm đầu + ngọc + hoa văn
  const a=(x-20)/12.8,yc=cy+2*a*a;if(Math.abs(a)>1||Math.abs(y-yc)>2.7)return null;
  const v=(y-yc)/2.7;let c=sh5(v*.9-.35,GDP);
  if(Math.abs(x-20)<2.2)return inE(x,y,20,yc,2,1.9)?sh5(((x-19.4)*.3+(y-yc+.4)*.5)/1.5,RBP):c;
  for(const g of[7.2,-7.2]){if(inE(x,y,20+g,yc,1.5,1.5))return sh5(((x-20-g)*.4+(y-yc)*.6)/1.3,SBP)}
  for(const g of[10.8,-10.8]){if(inE(x,y,20+g,yc,.9,.9))return(y<yc?WHP[0]:WHP[3])}
  if(((x*2|0)%5==0)&&Math.abs(y-yc)<.9&&Math.abs(x-20)>3.5&&Math.abs(Math.abs(x-20)-7.2)>2&&Math.abs(Math.abs(x-20)-10.8)>1.6)c=GDP[4];
  return c};
 const prongF=(cx,h,cy)=>(x,y)=>{const top=cy-h;
  if(inE(x,y,cx,top,2,2))return sh5(((x-cx)*.4+(y-top)*.7)/1.9,WHP);                      // ngọc trai tròn đầu trụ
  if(x>=cx-1.7&&x<=cx+1.7&&y>=top&&y<=cy+1)return sh5((x-cx)/1.7*.8,GDP);return null};
 const crownAll=cy=>{const pr=[[-12,4.5],[-8.4,6.5],[8.4,6.5],[12,4.5]];
  paint(P,-2,-8,42,16,lay(crownF(cy),...pr.map(([d,h])=>prongF(20+d,h,cy-1.5))))};
 // đầu: mái tóc ngắn có texture, hai bên + gáy fade mờ dần
 const domeF=(x,y)=>{const ry=11.8+.7*Math.sin(x*1.3);const dx=(x-20)/11.6,dy=(y-15.2)/ry;return dx*dx+dy*dy<=1&&y>=3.2};
 if(!side&&!back){
  const hair=(x,y)=>{if(!domeF(x,y))return null;const a=Math.abs(x-20);
   if(a<=8.4){const yb=15.4+2.4*Math.abs(Math.sin(x*.95+.4));if(y>=yb)return null;return(y>yb-1.1)?PKP[3]:tex(x,y)}
   if(y>23)return null;const p=clamp(1-(y-16)/7,0,1);if(y>16&&hsh(x,y)>p)return null;return y>16?PKP[3]:tex(x,y)};
  paint(P,6,2,34,28,hair);
  crownAll(7.2);
 }else if(back){
  const hair=(x,y)=>{if(y<22){const a=Math.abs(x-20),dx=a/11.6,dy=(y-15.2)/(11.8+.7*Math.sin(x*1.3));if(dx*dx+dy*dy>1||y<3.2)return null;return tex(x,y,y>18)}
   const a=Math.abs(x-20);if(a>11.2-(y-22)*.3||y>31)return null;const p=clamp(1-(y-22)/9,0,1);if(hsh(x,y)>p)return null;return PKP[3]};
  paint(P,6,2,34,33,hair);
  crownAll(7.2);
 }else{
  const hair=(x,y)=>{if(!domeF(x*1+0,y)&&!(x<22&&inE(x,y,16,19,8,10)))return null;if(x>31.4||y<3.2)return null;
   const dx=(x-19)/11.8,dy=(y-15.2)/(11.8+.7*Math.sin(x*1.3));if(x>=14&&dx*dx+dy*dy>1)return null;
   if(x>20){const yb=17.4+1.4*Math.abs(Math.sin(x*1.05));if(x>23.6&&y>=yb)return null;if(x<=23.6&&y>=yb){const p=clamp(1-(y-19)/6,0,1);if(y>27||hsh(x,y)>p)return null;return PKP[3]}return(y>yb-1.1)?PKP[3]:tex(x,y)}
   if(y>22){const p=clamp(1-(y-22)/8,0,1);if(y>30||hsh(x,y)>p)return null;return PKP[3]}
   return tex(x,y,y>18)};
  paint(P,2,2,36,32,hair);
  const bandS=(x,y)=>{const yc=7.6+1*Math.pow((x-19)/13,2);if(x<7.6||x>30.4||Math.abs(y-yc)>2.7)return null;if((x<9||x>29)&&Math.abs(y-yc)>1.9)return null;
   const c=sh5((y-yc)/2.7*.9-.35,GDP);if(inE(x,y,25,yc,1.5,1.5))return sh5(((x-25)*.4+(y-yc)*.6)/1.3,SBP);if(inE(x,y,14.5,yc,1.6,1.6))return sh5(((x-14.5)*.4+(y-yc)*.6)/1.4,RBP);return c};
  const prongS=(cx,h)=>prongF(cx,h,6.2);
  paint(P,2,-8,40,16,lay(bandS,prongS(9.5,4),prongS(15.5,6.5),prongS(23,6.5),prongS(28.5,4)));
 }
};

})();
