/* ===================================================================================
   THANMUA.JS — 🌧️ MASCOT THẦN MƯA (Mùa 2 của Thái tử Ba Tư) — CẤP 1
   • Nhận ở Thái tử Ba Tư (Phố xá), Mùa 2. Phải nâng Quyền trượng Thủy Thần lên CẤP 3 mới ghép được (xem perso.js).
   • Cấp 1/2/3 = SETS 'thanmua1/2/3' (tmlv:1/2/3), dùng chung hàm vẽ drawTM.
   Cấp 2: vầng sáng lung linh hơn, chạy nhanh như cưỡi thú (tmSpd=1.8), bong bóng bể thì nước chảy phủ nón.
   Cấp 3: gồm cấp 2 + tà áo dài hơn + cứ 4 giây có tinh linh nước bay quanh người + chạy cực nhanh (tmSpd=2.5).
   Chỉnh tốc độ: sửa 2 số trong hàm window.tmSpd ở cuối file.
   • Nét riêng: nón chóp trắng ngà, đỉnh nón thổi BONG BÓNG NƯỚC phình ra rồi bể; khăn che mũi miệng (chỉ thấy đôi mắt
     xanh biển — biểu cảm riêng, KHÔNG dùng biểu cảm của người chơi); tóc bạc xanh dài; váy dài toàn NƯỚC TRONG SUỐT có
     ánh sáng chạy ngang, họa tiết sóng, hạt nước hất lên lấp lánh; tà áo dài ra phía sau khi đi ngang (thướt tha).
   • Vẽ nửa-pixel (0.5) nên mịn hơn pixel thường, được phép tràn khung 20x31.
   • Mascot: mặc cả bộ, không tách rời. Phụ kiện cầm tay vẫn hiện.
   =================================================================================== */
(function(){
'use strict';
if(typeof SETS==='undefined'||typeof MASCOT_DRAW==='undefined')return;

// ---------- 1) khai báo (chỉ thêm 1 lần, luôn đẩy vào CUỐI mảng) ----------
if(!SETS.some(s=>s.k=='thanmua1')){
 SETS.push({n:'Mascot Thần Mưa',k:'thanmua1',mascot:'thanmua',tmlv:1,vt:'tm',wide:1,
  ds:'Nón chóp có bong bóng nước phình ra rồi bể, khăn che mũi miệng chỉ lộ đôi mắt xanh biển, váy dài bằng nước trong suốt, tà áo thướt tha phía sau. Có biểu cảm riêng. Phụ kiện cầm tay vẫn hiện.',
  sh:'#8fd0f2',pt:'#8fd0f2',rpt:'#8fd0f2',shoe:'#cdeeff',scarf:'#8fd0f5'});
}
if(!SETS.some(s=>s.k=='thanmua2')){
 SETS.push({n:'Mascot Thần Mưa (Cấp 2)',k:'thanmua2',mascot:'thanmua',tmlv:2,vt:'tm',wide:1,
  ds:'Cấp 2: vầng sáng trên đầu lung linh hơn, chạy nhanh như cưỡi thú, bong bóng bể thì nước chảy phủ lên nón.',
  sh:'#8fd0f2',pt:'#8fd0f2',rpt:'#8fd0f2',shoe:'#cdeeff',scarf:'#8fd0f5'});
 SETS.push({n:'Mascot Thần Mưa (Cấp 3)',k:'thanmua3',mascot:'thanmua',tmlv:3,vt:'tm',wide:1,
  ds:'Cấp 3: tà áo dài hơn, cứ 4 giây có tinh linh nước bay quanh người, chạy cực nhanh.',
  sh:'#8fd0f2',pt:'#8fd0f2',rpt:'#8fd0f2',shoe:'#cdeeff',scarf:'#8fd0f5'});
}

// ---------- 2) bảng màu ----------
const TAU=6.283185;
const W={base:'rgba(112,198,240,.80)',mid:'rgba(160,222,248,.80)',lt:'rgba(218,248,255,.92)',
         dk:'rgba(58,140,216,.88)',dk2:'rgba(36,104,192,.92)',foam:'rgba(255,255,255,.96)',edge:'rgba(136,212,252,.96)'};
const HR=['#bcc8dc','#e6edf7','#8798b8'];                // tóc bạc xanh: chính / sáng / tối
const SKIN='#f7e4d4',SKIND='#e4c4ae';
const VEIL='rgba(228,247,255,.95)',VEILD='rgba(150,208,240,.95)',VEILL='#ffffff';
const EYE='#2d86ea',EYED='#1747a8',EYEL='#6fc0ff',LASH='#25306a';
const HAT='#f6f1e4',HATL='#fffdf7',HATD='#d6cab2',HATR='#e6dcc6',HATB='#b8e4f6';
const HAND='#d4f0ff',HANDD='#86c8f0';
const q=v=>Math.round(v*2)/2;                             // làm tròn 0.5 pixel

// vạt váy: mép trái từng hàng y=14..29 (mép phải đối xứng = 20 - trái)
const LEFT=[6,5.5,6,6.5,6.5,7,7,7,6.5,6,5.5,5,4.5,3.5,3,2.5];

function drawTM(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,mv=!!o.mv,t=performance.now()/1000;
 const LV=S.tmlv||1;                                       // cấp 1/2/3 (cấp 2+ sẽ thêm hiệu ứng sau)
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);              // nhìn ngang (tự lật khi quay trái)
 const sway=Math.sin(t*2.2)*.35+(mv?lg*.7:0),bp=(t%3.6)/3.6;
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.16)',10,30,8,2);

 // ===== vầng sáng mỏng sau nón =====
 const halo=cxs=>{const n=46;for(let i=0;i<n;i++){const an=i/n*TAU,x=cxs+Math.cos(an)*11.2,y=2.5+Math.sin(an)*10.6;
   u(i%6==0?'rgba(255,255,255,.95)':'rgba(240,252,255,.5)',q(x),q(y),i%6==0?1:.5,i%6==0?1:.5)}
  for(let i=0;i<30;i++){const an=i/30*TAU,x=cxs+Math.cos(an)*9.4,y=2.5+Math.sin(an)*8.9;u('rgba(150,214,250,.34)',q(x),q(y),.5,.5)}
  if(LV>=2){ // CẤP 2: vầng sáng lung linh — quầng nước mờ, vòng ngoài thứ hai, 8 tia sáng xoay + lấp lánh nhấp nháy
   for(let dy=-10;dy<=10;dy+=.5){const w=Math.sqrt(Math.max(0,100-dy*dy));u('rgba(190,236,255,'+(.09+.05*Math.sin(t*2+dy)).toFixed(3)+')',q(cxs-w),q(2.5+dy),q(w*2),.5)}
   for(let i=0;i<64;i++){const an=i/64*TAU,m=1+.03*Math.sin(an*6+t*2.5);u(i%8==0?'rgba(255,255,255,.95)':'rgba(190,236,255,.55)',q(cxs+Math.cos(an)*13*m),q(2.5+Math.sin(an)*12.4*m),.5,.5)}
   for(let i=0;i<8;i++){const an=t*.7+i*TAU/8,x=cxs+Math.cos(an)*12.1,y=2.5+Math.sin(an)*11.5,v=.5+.5*Math.sin(t*4+i*1.7);
    u('rgba(255,255,255,'+(.55+.45*v).toFixed(2)+')',q(x),q(y),1,1);if(v>.6){u('rgba(255,255,255,.8)',q(x-1),q(y),3,.5);u('rgba(255,255,255,.8)',q(x),q(y-1),1,3)}}
   for(let i=0;i<5;i++){const e=(t*.5+i*.2)%1,an=i*1.9,x=cxs+Math.cos(an)*(9+e*2),y=2.5+Math.sin(an)*(9+e*2)-e*5;u('rgba(220,248,255,'+(1-e).toFixed(2)+')',q(x),q(y),.5,.5)}
  }};

 // ===== nón chóp (đỉnh có bong bóng, tua hạt treo hai bên vành) =====
 const hat=(cxs,mode)=>{
  const AP=-3,BY=5.3;
  for(let y=3.5;y<=7.2;y+=.5){const f=(y-5.3)/1.9,w=10.6*Math.sqrt(Math.max(0,1-f*f));u(y<5.3?HATR:y<6.8?HAT:HATL,cxs-w,y,w*2,.5)}
  u(HATD,cxs-9,6.5,18,.5);
  for(let y=AP;y<BY;y+=.5){const hw=.5+(y-AP)*1.18;u(HAT,cxs-hw,y,hw*2,.5);u(HATL,cxs-hw,y,hw*.55,.5);u(HATD,cxs+hw*.42,y,hw*.58,.5)}
  [.5,2.3,4].forEach(y=>{const hw=.5+(y-AP)*1.18;u(HATR,cxs-hw+.5,y,hw*2-1,.5)});
  if(LV>=2&&bp>.8){ // CẤP 2: bong bóng bể → nước chảy phủ xuống nón rồi nhỏ giọt ở mép vành
   const f=Math.min(1,(bp-.8)/.14),fade=bp>.93?Math.max(0,1-(bp-.93)/.07):1;
   for(let y=AP;y<BY;y+=.5){if(y>AP+f*(BY-AP)*1.15)break;const hw=.5+(y-AP)*1.18;
    u('rgba(110,200,250,'+(.55*fade).toFixed(2)+')',cxs-hw,y,hw*2,.5);
    for(let k=0;k<4;k++){const sx=cxs-hw+hw*2*((k+.5)/4)+Math.sin(t*5+y*.8+k)*.4;u('rgba(255,255,255,'+(.85*fade).toFixed(2)+')',q(sx),y,.5,.5)}}
   if(f>=1)for(let i=0;i<6;i++){const e=(t*1.6+i*.31)%1;u('rgba(170,228,255,'+(fade*(1-e)).toFixed(2)+')',q(cxs-8+i*3.2),q(7.3+e*3),.5,1)}}
  u(HATB,cxs-5.2,4.5,10.4,.5);u(HATB,cxs-6.5,5,13,.5);
  u('#fff',cxs-.5,AP,1,.5);
  if(mode!='b'){[-7.5,-3.5,0,3.5,7.5].forEach((dx,i)=>{u('#7fd0f4',cxs+dx-.5,5.5+(i%2?0:.5),1,1);u('#fff',cxs+dx-.5,5.5+(i%2?0:.5),.5,.5)})}
  // tua hạt treo hai bên (chừa giữa để thấy mắt)
  const offs=mode=='s'?[-9.6,-8,-6.4,6.6,8.2]:[-9.6,-8,-6.4,6.4,8,9.6],lens=[4.5,3,5.5,5,3.5,4.5];
  offs.forEach((dx,i)=>{const L=lens[i%lens.length];
   for(let j=0;j<L;j+=1.5){const sw=Math.sin(t*2.4+i*1.3+j*.5)*(mv?.8:.45);
    u(j%3?'#7fd0f4':'#eef4fa',q(cxs+dx+sw),7.2+j,1,1);u('rgba(255,255,255,.9)',q(cxs+dx+sw),7.2+j,.5,.5)}});
 };

 // ===== CẤP 3: tinh linh nước (4 giây một lần) xuất hiện bên cạnh, bay quanh người rồi tan biến =====
 const spirit=(cxs,front)=>{
  if(LV<3)return;const T=4,sp=(t%T)/T,V=.78;if(sp>V)return;
  const g=sp/V,a=Math.min(1,g*7,(1-g)*7),AL=(rgb,v)=>'rgba('+rgb+','+Math.max(0,v).toFixed(2)+')';
  const pos=an=>({x:cxs+Math.cos(an)*14,y:17+Math.sin(an)*5.5-Math.sin(g*Math.PI)*4,z:Math.sin(an)}),an0=g*TAU*1.6+.5,P=pos(an0);
  if((P.z>=0)!==!!front)return;
  for(let i=1;i<=7;i++){const Q=pos(an0-i*.17);u(AL('170,232,255',a*(1-i/8)*.7),q(Q.x),q(Q.y+1),i<3?1:.5,i<3?1:.5)}
  const x=P.x,y=P.y,fl=Math.sin(t*16)>0?1:0;
  for(let dy=-2.5;dy<=2.5;dy+=.5){const w=2.5*Math.sqrt(Math.max(0,1-dy*dy/7.3));u(AL('120,205,250',.88*a),q(x-w),q(y+dy),Math.max(.5,q(w*2)),.5)}
  u(AL('120,205,250',.88*a),x-.5,y-3.5,1,.5);u(AL('225,250,255',a),x-1.5,y-1.5,1,2);u(AL('50,130,210',a),x+1,y,1.5,2);
  u('#ffffff',x-1,y-.5,1,1);u('#ffffff',x+.5,y-.5,1,1);u('#1a3f8f',x-.5,y-.5,.5,.5);u('#1a3f8f',x+1,y-.5,.5,.5);u(AL('255,160,190',a*.7),x-.5,y+1,1,.5);
  u(AL('215,246,255',.85*a),x-4.5,y-2+(fl?-1:0),2,1);u(AL('215,246,255',.85*a),x+3,y-2+(fl?-1:0),2,1);   // cánh nhỏ vẫy
  u(AL('150,220,252',.7*a),x-.5,y+3,1,1);u(AL('150,220,252',.5*a),x+(fl?.5:-.5),y+4,1,.5);
  if(g<.1||g>.9){const e=g<.1?g/.1:(1-g)/.1;for(let i=0;i<8;i++){const an=i*.785,d=(1-e)*5+2;u(AL('255,255,255',.9*a+.1),q(x+Math.cos(an)*d),q(y+Math.sin(an)*d),.5,.5)}}};

 // ===== bong bóng thổi ở đỉnh nón: phình ra → rung → BỂ =====
 const bubble=bx=>{
  const T=3.6,p=(t%T)/T,AP=-3;
  if(p>.92)return;
  if(p<=.8){const g=p/.8,rr=.6+g*3.8+Math.sin(t*10)*.14*g,cy=AP-rr-.2;
   for(let dy=-rr;dy<=rr;dy+=.5){const w=Math.sqrt(Math.max(0,rr*rr-dy*dy));u('rgba(205,242,255,.36)',q(bx-w),q(cy+dy),Math.max(.5,q(w*2)),.5)}
   const n=Math.max(12,Math.round(rr*10));
   for(let i=0;i<n;i++){const an=i/n*TAU,lit=Math.cos(an+2.3);u(lit>.3?'rgba(246,254,255,.98)':'rgba(110,204,252,.92)',q(bx+Math.cos(an)*rr),q(cy+Math.sin(an)*rr),.5,.5)}
   u('#ffffff',q(bx-rr*.5),q(cy-rr*.55),rr>2?1:.5,.5);u('rgba(255,255,255,.8)',q(bx-rr*.25),q(cy-rr*.75),.5,.5);u('rgba(255,255,255,.7)',q(bx+rr*.45),q(cy+rr*.45),.5,.5);
   u('rgba(200,240,255,.8)',bx-.5,AP-.5,1,.5);
  }else{const e=(p-.8)/.12,a=Math.max(0,1-e).toFixed(2);
   for(let i=0;i<10;i++){const an=i*.628+.3,d=4.4+e*4;u('rgba(226,249,255,'+a+')',q(bx+Math.cos(an)*d),q(AP-4.4+Math.sin(an)*d*.9),i%2?1:.5,i%2?1:.5)}
   for(let i=0;i<10;i++){const an=i*.628+.3,d=3.6+e*2.2;u('rgba(120,208,252,'+(a*.8).toFixed(2)+')',q(bx+Math.cos(an)*d),q(AP-4.4+Math.sin(an)*d*.9),.5,.5)}}
 };

 // ===== hạt nước hất lên lấp lánh từ vai (giông nước) =====
 const splash=()=>{const cyc=t%2.6;
  for(let i=0;i<9;i++){const e=cyc-.2-i*.05;if(e<=0||e>1.25)continue;const sg=i%2?1:-1,x=10+sg*(5+(i>>1)*.8)+sg*e*(4+i*.9),y=15.5-e*(9+(i%3)*2)+e*e*14,a=Math.max(0,1-e/1.25).toFixed(2);
   u('rgba(236,252,255,'+a+')',q(x),q(y),i%3?.5:1,i%3?.5:1);if(i%3==0)u('rgba(120,208,252,'+a+')',q(x),q(y+1),.5,.5)}};

 // ===== ánh sáng nước chạy ngang váy + lấp lánh =====
 const shimmer=(lx,rx)=>{
  for(let i=0;i<16;i++){const y=14+i,xs=((t*7+y*1.1)%30)-5,a=LEFT[i],x0=a,x1=20-a;if(xs>=x0&&xs<=x1-1.5)u('rgba(255,255,255,.85)',q(xs),y,1.5,.5)}
  [[8,17,0],[13,22,1.7],[9,26,3.1],[12,19,4.4],[7,23,5.6]].forEach(s=>{const v=Math.sin(t*3+s[2]);if(v>.55){u('#fff',s[0]+(Rt||!side?0:0),s[1],1,1);u('rgba(255,255,255,.7)',s[0]-1,s[1],3,.5);u('rgba(255,255,255,.7)',s[0],s[1]-1,1,3)}})};

 // ===== váy nhìn trước / sau =====
 const dressFront=()=>{
  for(let i=0;i<16;i++){const y=14+i,a=LEFT[i],off=y>=24?((y-24)/6)*sway:0,x0=a+off,w=20-2*a,e=Math.min(2,w/3);
   u(W.base,x0,y,w,1);u(W.lt,x0,y,e,1);u(W.dk,x0+w-e,y,e,1);
   if(i>=5&&i%2==0)u('rgba(220,248,255,.35)',x0+w/2-1,y,2,1)}
  u(W.edge,6.5,14,7,.5);u(W.lt,7,20,6,.5);u(W.dk2,7,21,6,.5);                                  // cổ + eo nước
  // họa tiết sóng ~ trên váy
  for(let i=0;i<10;i++){const x=5.5+i*1.0,s=sway*.5;u('rgba(236,252,255,.88)',q(x+s),q(24.5+Math.sin(i*.95+t*2)*.9),1,.5);u('rgba(236,252,255,.7)',q(x+s*.7),q(27+Math.sin(i*.9+1.6+t*2)*.9),1,.5)}
  // gấu váy: sóng bọt
  for(let x=2;x<=17;x++){const dy=Math.sin(t*3+x*1.2)*.5,off=sway;u(W.edge,x+off,q(29.5+dy),1,.5);if(x%3==0)u(W.foam,x+off,q(29+dy),1,.5)}
  if(!back)u(W.foam,9.5,14.5,1,1);
 };

 // ===== tay áo nước + bàn tay nước =====
 const arm=(x,ay)=>{
  const lx=x<8?x-1:x,sg=x<8?-1:1;
  u(W.base,lx,15+ay,4,5);u(W.lt,lx,15+ay,1,5);u(W.dk,lx+3,15+ay,1,5);
  u(W.base,x<8?lx-1:lx+4,18.5+ay,1,2.5);u(W.mid,x<8?lx-.5:lx+4,18.5+ay,.5,2.5);
  u(W.foam,lx-(x<8?1:0),20+ay,5,.5);
  u(HAND,x,21+ay,3,2.5);u(HANDD,x+(x<8?0:2),21+ay,1,2.5);u(W.foam,x+(x<8?1:0),21+ay,1,.5);
  for(let j=0;j<7;j++){const s=Math.sin(t*3+j*.7+x)*(.5+j*.1);u(W.edge,q(x+1+sg*(1.5)+s),q(23.5+ay+j),1,.5);if(j%2)u(W.foam,q(x+1+sg*1.5+s),q(23.5+ay+j),.5,.5)}};     // dải nước chảy xuống
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(HAND,x+ox,ty,3,3);u(HANDD,x+ox+2,ty,1,3);u(W.foam,x,ty+3,3,.5);
  u(W.base,x-(x<8?1:0),ty+3.5,4,3.5);u(W.lt,x-(x<8?1:0),ty+3.5,1,3.5);u(W.dk,x+2,ty+3.5,1,3.5)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 // ===== đầu: mặt + khăn che + mắt =====
 const faceRows=(L)=>L.forEach(a=>u(SKIN,a[1],a[0],a[2]-a[1],a[3]||1));
 const eyes=(x0,y0)=>{
  const bl=(t%4.3)<.14;
  if(bl){u(LASH,x0,y0+1,3,.5);return}
  u('#ffffff',x0,y0,3,2);u(EYE,x0+.5,y0,2,2);u(EYED,x0+.5,y0,2,.5);u(EYEL,x0+.5,y0+1.5,2,.5);u('#fff',x0+.5,y0+.5,.5,.5);u(LASH,x0-.5,y0-.5,3.5,.5)};

 if(!side){
  spirit(10,0);
  halo(10);
  if(LV>=3){for(const sg of[-1,1])for(let j=0;j<8;j++){const s=Math.sin(t*3+j*.7+sg)*(.5+j*.1);u(W.edge,q(10+sg*8.7+s+sg*j*.12),q(22.5+j),1,.5);if(j%2)u(W.foam,q(10+sg*8.7+s+sg*j*.12),q(22.5+j),.5,.5)}}
  if(back){
   // tóc dài phía sau lưng
   u(HR[0],4,5,12,9);
   for(let y=6;y<=24;y++){const w=y>14?Math.sin(t*2.2+y*.5)*.6:0;u(HR[0],3+w,y,14,1);u(HR[1],5+w,y,1,1);u(HR[2],14+w,y,2,1)}
   for(let i=0;i<7;i++)u(HR[2],4+i*2+Math.sin(t*2.2+24*.5)*.6,24.5,1,1);
   dressFront();
   // nút khăn sau gáy + 2 dải khăn bay
   u(VEIL,8.5,10.5,3,2.5);u(VEILD,10,10.5,1.5,2.5);
   for(let j=0;j<8;j++){const s=Math.sin(t*3+j*.7)*(.5+j*.12);u(VEIL,q(8.5+s),13+j,1,1);u(VEILD,q(11+s*.9),13+j,1,1)}
   arms();
   // đầu sau (tóc phủ)
   u(HR[0],4,5,12,9);u(HR[1],6,6,2,6);u(HR[2],14,6,2,8);
   shimmer();
  }else{
   // tóc dài phía sau (hai bên người)
   for(let y=6;y<=23;y++){const w=y>14?Math.sin(t*2.2+y*.5)*.6:0;u(HR[0],2.5+w,y,3.5,1);u(HR[0],14+w,y,3.5,1);u(HR[2],2.5+w,y,.5,1);u(HR[1],4+w,y,.5,1);u(HR[1],14.5+w,y,.5,1);u(HR[2],17+w,y,.5,1)}
   u(HR[2],3,23.5,3,.5);u(HR[2],14.5,23.5,3,.5);
   u(HR[0],4,5,12,9);
   dressFront();
   arms();
   shimmer();
   // mặt
   faceRows([[4,6,14],[5,4,16],[6,3,17,6],[12,4,16],[13,6,14]]);
   u(SKIND,15,8,1,4);u(SKIND,6,13,8,.5);
   u('rgba(255,170,185,.5)',5,9,2,1);u('rgba(255,170,185,.5)',13,9,2,1);
   eyes(6,7.5);eyes(11,7.5);
   // khăn che mũi miệng
   for(let y=9.5;y<=13.5;y+=.5){const f=(y-9.5)/4,x0=6.5-(y<11.5?(y-9.5)*.75:(1.5-(y-11.5)*.6)),x1=20-x0;u(VEIL,x0,y,x1-x0,.5)}
   u(VEILL,7,10,1,.5);u(VEILL,9.5,10.5,1,.5);u(VEILL,12,10,1,.5);u(VEILD,6,11.5,2,.5);u(VEILD,12,11.5,2,.5);u(VEILD,5,12.5,10,.5);u(VEILD,8.5,13.5,3,.5);
   u(VEILD,4,8,.5,3);u(VEILD,15.5,8,.5,3);                                    // dây khăn vòng sau tai
   // tóc mái hai bên mặt
   u(HR[0],3,6,2,7);u(HR[1],3.5,6.5,.5,5);u(HR[0],15,6,2,7);u(HR[2],16.5,7,.5,5);
  }
  hat(10,back?'b':'f');
  bubble(10);
  splash();
  spirit(10,1);
 }else{
  // ---------- nhìn ngang (tà áo bay ra sau) ----------
  const cxs=Rt?9:11;
  spirit(cxs,0);
  halo(cxs);
  // tóc dài bay ra sau
  const amp=mv?1.2:.5;
  for(let y=5;y<=23;y++){const wv=Math.sin(t*(mv?5:2.2)-y*.45)*amp*(y>10?(y-10)/13:0),tr=y>12?(y-12)*(mv?.55:.25):0;
   M(HR[0],1.5-tr+wv,y,7.5+tr*.3,1);if(y%3==0)M(HR[1],2-tr+wv,y,1.5,1);M(HR[2],1.5-tr+wv,y,.5,1)}
  // ---- TÀ ÁO DÀI RA SAU (nước trong suốt, vẫy theo bước đi) ----
  const N=mv?(LV>=3?27:19):(LV>=3?13:9),spd=mv?6:2.5;
  for(let j=0;j<=N;j++){
   const x=5-j,yc=Math.max(17,25.5+Math.sin(t*spd-j*.55)*(.4+j*(mv?.16:.07))-j*(mv?.3:.08)),th=Math.max(.8,4.4*(1-j/(N+1.5))),y0=Math.max(15,yc-th),y1=Math.min(30.5,yc+th);
   M(W.base,x,q(y0),1,q(y1-y0)||.5);M(W.lt,x,q(y0),1,.5);M(W.dk,x,q(y1-.5),1,.5);
   if(j%4==1)M(W.foam,x,q(yc-th*.4),1,.5);
   if(j>=N-2)M(W.foam,x,q(yc),1,.5)}
  for(let j=0;j<=N-3;j++){const x=6-j,yc=20.5+Math.sin(t*spd-j*.6+1)*(.3+j*(mv?.13:.06))-j*(mv?.22:.06);M(W.edge,x,q(yc),1,.5);M(W.foam,x,q(yc-.5),1,.5);if(j%3==0)M('rgba(120,208,252,.9)',x,q(yc+.5),1,.5)}
  // vạt váy + thân nhìn ngang
  for(let i=0;i<16;i++){const y=14+i,hem=y>=22?(y-22):0,xb=6-hem*.55,xf=14+hem*.35+(i>=8?0:0),off=y>=24?((y-24)/6)*sway*.6:0,w=xf-xb;
   M(W.base,xb+off,y,w,1);M(W.lt,xb+off,y,1.5,1);M(W.dk,xf+off-2,y,2,1);if(i>=5&&i%2==0)M('rgba(220,248,255,.35)',xb+off+w/2-1,y,2,1)}
  for(let i=0;i<9;i++){const x=3.5+i*1.1;M('rgba(236,252,255,.88)',q(x),q(24.5+Math.sin(i*.95+t*2)*.9),1,.5)}
  for(let x=2;x<=15;x++){const dy=Math.sin(t*3+x*1.2)*.5;M(W.edge,x+sway*.6,q(29.5+dy),1,.5);if(x%3==0)M(W.foam,x+sway*.6,q(29+dy),1,.5)}
  M(W.lt,7,20,6,.5);M(W.dk2,7,21,6,.5);M(W.edge,9,14,4,.5);
  // tay (nước)
  const sxx=lg*(Rt?2:-2),ax=9-sxx;
  u(W.base,ax-1,15,5,5);u(W.lt,ax-1,15,1,5);u(W.dk,ax+3,15,1,5);u(W.base,ax-2,19,1,2);u(W.foam,ax-2,20.5,6,.5);
  u(HAND,ax,21,3,2.5);u(HANDD,ax+1,22.5,2,1);
  for(let j=0;j<6;j++){const s=Math.sin(t*3+j*.7)*(.4+j*.1);u(W.edge,q(ax+1+s),q(23.5+j),1,.5)}
  shimmer();
  // đầu + mặt nghiêng
  [[4,6,12],[5,4,14],[6,3,15,6],[12,4,14],[13,6,12]].forEach(a=>M(SKIN,a[1],a[0],a[2]-a[1],a[3]||1));
  M(SKIND,13,9,2,3);
  M('rgba(255,170,185,.5)',11.5,9,2,1);
  // 1 mắt xanh bên mặt
  (function(){const bl=(t%4.3)<.14;if(bl){M(LASH,11,8.5,3,.5);return}
   M('#ffffff',11,7.5,3,2);M(EYE,12,7.5,2,2);M(EYED,12,7.5,2,.5);M(EYEL,12,9,2,.5);M('#fff',12,8,.5,.5);M(LASH,10.5,7,3.5,.5)})();
  // khăn che + đuôi khăn bay ra sau
  for(let y=9.5;y<=13.5;y+=.5){const x0=y<11.5?11-(y-9.5)*1.2:8.6+(y-11.5)*.8;M(VEIL,x0,y,15.4-x0,.5)}
  M(VEILL,12,10,1,.5);M(VEILD,9,12,5,.5);M(VEILD,11,13.5,3,.5);
  for(let j=0;j<9;j++){const s=Math.sin(t*(mv?6:3)-j*.7)*(.4+j*.12);M(VEIL,q(8-j*(mv?1:.6)),q(10.5+j*.12+s),1,1.5);if(j%3==0)M(VEILD,q(8-j*(mv?1:.6)),q(11.5+s),1,.5)}
  // tóc mái
  M(HR[0],3,5,9,3);M(HR[1],5,5,3,.5);M(HR[0],2,7,5,6);M(HR[2],2,12,1,2);
  hat(cxs,'s');
  bubble(cxs);
  splash();
  spirit(cxs,1);
 }
}
window.drawMascotTM=drawTM;
// tốc độ chạy khi mặc Mascot Thần Mưa (nhân với tốc độ gốc; thú cưỡi 'Trâu Việt' là 1.8). Chỉ tính khi KHÔNG cưỡi thú.
window.tmSpd=function(){try{const S=SETS[ST.av.s];return S&&S.tmlv==2?1.8:S&&S.tmlv==3?2.5:1}catch(e){return 1}};
MASCOT_DRAW.thanmua=drawTM;
})();
