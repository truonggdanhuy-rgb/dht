/* ===================================================================================
   ALO.JS — Đồ mới (lấy ý tưởng Tây Bắc Việt Nam):
   • 🍃 Mascot À Lôi (Nam)  — SETS (mascot:'aloi', al:'m'), 💎10, bán ở Shop kim cương (mục Set mascot)
       Tóc bạc, mắt xanh ngọc, mũ vải thêu xanh ngọc viền vàng, áo chàm có khuy vàng, dải vải buông bên tai.
   • 🍃 Mascot À Lôi (Nữ)   — SETS (mascot:'aloi', al:'f'), 💎10, bán ở Shop kim cương (mục Set mascot)
       Tóc tím xoăn sóng, mắt hồng, MẤN ĐỘI TO thêu hoa văn (hồng – xanh ngọc – vàng) có dây xà tích rủ hai bên,
       áo hồng thêu vàng – xanh, váy ngắn viền thổ cẩm, giày hồng.
   Hiệu ứng set: LÁ CÂY bay lên xung quanh người (một nửa bay sau lưng, một nửa bay phía trước).
   KHÔNG che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường
   (tóc bạn chọn sẽ tạm ẩn vì bộ có sẵn tóc riêng).
   Hai món khai báo ở CUỐI mảng SETS trong index.html (không làm lệch số thứ tự đồ đã mua) + thêm vào DSETS.
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: sửa dia:10 trong index.html.
   Khung chuẩn 20x31 (như các mascot khác); mũ/lá vượt khung nên khai báo wide:1.
   =================================================================================== */
(function(){
const PI=Math.PI,sin=Math.sin,rnd=Math.round,flr=Math.floor;

// ---------- LÁ CÂY BAY LÊN (part 0 = phía sau người, part 1 = phía trước) ----------
const LFC=[['127,220,106','63,158,74'],['169,236,120','79,174,82'],['88,194,106','47,138,69'],['255,216,106','217,150,42']];
function leaves(u,t,part){
 for(let i=part;i<16;i+=2){
  const P=3.3+(i%4)*.55,ph=((t/P)+i*.173)%1;
  const y=rnd(31-ph*40),x=rnd(10+(((i*37)%27)-13)*.95+sin(t*1.5+i*2.1)*2.6+sin(ph*PI*2+i)*1.4);
  const a=Math.min(1,ph*5,(1-ph)*2.2);if(a<.15)continue;
  const al=a>.7?'1':a>.4?'.7':'.4',c=LFC[i%4],c1='rgba('+c[0]+','+al+')',c2='rgba('+c[1]+','+al+')';
  const f=flr(t*3+i)%3;
  if(i%3==0){const L=(cc,dx,dy,w,h)=>u(cc,x+dx,y+dy,w,h);          // lá to 4x3 có gân
   if(f==1){L(c1,1,0,2,1);L(c1,0,1,4,1);L(c2,1,2,2,1);L(c2,0,1,1,1)}else{L(c1,0,0,2,1);L(c1,0,1,4,1);L(c2,2,2,2,1);L(c2,3,1,1,1)}}
  else if(f==0){u(c1,x,y,2,1);u(c2,x+1,y+1,2,1);u(c2,x-1,y+1,1,1)}
  else if(f==1){u(c1,x,y,2,1);u(c2,x,y+1,2,1);u(c1,x+2,y,1,1)}
  else{u(c1,x+1,y,2,1);u(c2,x,y+1,2,1);u(c2,x+3,y+1,1,1)}
 }
}

// ---------- bảng màu ----------
const SK='#d4935f',SKL='#e6ab7a',SKD='#a9683f',WH='#ffffff',YL='#ffd23a',YLD='#d99a12',YLL='#fff3a8',TL='#2fd0cf',TLD='#1a9aa8',BLU='#3e4fd0',GR='#2fae6a',PRP='#7b3fc4';
const PF={
 sk:SK,skl:SKL,skd:SKD,
 sh:'#e8458f',shl:'#ff6fae',shd:'#b82a6c',sl:'#e8458f',cf:TL,cf2:BLU,
 sd:'#e9609a',sdl:'#ffb3d2',sdd:'#a8336f',
 hc:'#a98ae8',hl:'#cdb8fa',hd:'#7d5fcf',hs:'#e1d4ff',
 iris:'#ff7ab8',irisl:'#ffc2e0',lash:'#4a1e5a'
};
const PM={
 sk:SK,skl:SKL,skd:SKD,
 sh:'#232a55',shl:'#3a4388',shd:'#161a3a',sl:'#232a55',cf:TL,cf2:YL,
 pt:'#1e2348',sd:'#2a2f5a',sdl:'#454d8a',sdd:'#d8dcf0',
 hc:'#f2f2f8',hl:'#ffffff',hd:'#b9bccf',hs:'#d4d6e4',
 iris:'#27b7d0',irisl:'#8aeaf4',lash:'#2a2438'
};

// ---------- MẤN ĐỘI NỮ: hình khối + viền thổ cẩm ----------
// bảng hàng: [y,x0,x1] (x1 loại trừ). Màu theo khoảng cách d tới mép (trên / hai bên): 0 viền xanh, 1 tím nhạt, 2-3 hoa văn, 4+ tối (lòng mũ)
const HAT_F=[[-3,4,16],[-2,2,18],[-1,1,19],[0,0,20],[1,-1,21],[2,-1,21],[3,-1,21],[4,-1,21],[5,-1,21],[6,-1,21],[7,0,20],[8,1,19]];
const HAT_S=[[-3,2,15],[-2,0,17],[-1,-1,18],[0,-1,19],[1,-1,19],[2,-1,19],[3,-1,19],[4,-1,19],[5,-1,18],[6,0,18],[7,1,17]];
function hat(Rf,tbl,shiftTop){
 const top={};
 tbl.forEach(q=>{for(let x=q[1];x<q[2];x++)if(top[x]==null)top[x]=q[0]});
 tbl.forEach(q=>{const y=q[0];
  for(let x=q[1];x<q[2];x++){
   const dE=Math.min(x-q[1],q[2]-1-x),dT=y-top[x],d=Math.min(dE,dT),s=dT<=dE?x:y,cell=((s%5)+5)%5,sw=flr(s/5)%2;
   let c;
   if(d==0)c='#3a46c8';
   else if(d==1)c='#b7a8ff';
   else if(d==2)c=cell==1?(sw?TL:YL):(cell==0||cell==2)?'#ff6fae':'#ec3a8c';
   else if(d==3)c=cell==1?(sw?YL:TL):(cell==0||cell==2)?'#ff6fae':'#c2307a';
   else if(d==4)c='#8a2470';
   else c='#2a1450';
   if(d>4&&y>=q[0]&&((y-top[x])%3==0)&&(x%4==1))c='#34195e';        // họa tiết chìm trong lòng mũ
   Rf(c,x,y,1,1);
  }});
}
// dây xà tích rủ: sợi trắng + hạt vàng ở đầu
function tassels(Rf,list,t){
 list.forEach((q,i)=>{const x=q[0],y0=q[1],y1=q[2],sw=rnd(sin(t*2+i*1.7)*.6);
  Rf(YL,x,y0,1,1);
  for(let y=y0+1;y<y1;y++)Rf(y>y1-3?'#e9e4ff':WH,x+(y>y0+3?sw:0),y,1,1);
  Rf(YLD,x+sw-1,y1,3,1);Rf(YL,x+sw-1,y1-1,1,1);Rf(YL,x+sw+1,y1-1,1,1);Rf(YLL,x+sw,y1,1,1);
 });
}

// ---------- MŨ NAM: mũ vải thêu xanh ngọc ----------
function capRows(Rf,x0,x1,hy){        // x0..x1 (loại trừ x1): các hàng y1..y7
 const row=(y,a,b,fn)=>{for(let x=a;x<b;x++)Rf(fn(x,y),x,y,1,1)};
 row(1,x0+3,x1-3,x=>x<x0+7?'#5b95f5':'#2b57c8');
 row(2,x0+1,x1-1,x=>x<x0+8?'#3a74e8':'#2b57c8');
 row(3,x0,x1,x=>{const m=((x-x0)%6+6)%6;return(m==2||m==3)?YL:TL});
 row(4,x0,x1,x=>{const m=((x-x0)%6+6)%6;return(m>=1&&m<=4)?YL:TLD});
 row(5,x0,x1,x=>(x-x0)%3==1?YL:'#f08a2a');
 row(6,x0,x1,x=>(x-x0)%2?YL:TL);
 row(7,x0+1,x1-1,()=>'#1c2350');
}

function drawALoi(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,fem=S.al=='f',t=performance.now()/1000,mv=!!o.mv,P=fem?PF:PM;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const sx=side?lg*(Rt?2:-2):0;
 const bl=(performance.now()%4300)<140;
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});

 leaves(u,t,0);
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân ----------
 const leg=(x,lift)=>{
  if(fem){r(SK,x,24,4,3-lift);r(SKD,x+3,24,1,3-lift)}
  else{r(P.pt,x,24,4,3-lift);r(P.shd,x+3,24,1,3-lift);r(TL,x,26-lift,4,1);r(YL,x,26-lift,1,1)}
  r(P.sd,x,27-lift,4,2);r(P.sdl,x,27-lift,2,1);r(P.sdd,x,29-lift,4,1);
  if(!fem){r('#3a4380',x+2,28-lift,2,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 const arm=(x,ay)=>{
  u(P.sl,x,16+ay,3,4);u(P.shl,x,16+ay,1,4);u(P.shd,x+2,16+ay,1,4);
  u(P.cf,x,20+ay,3,1);u(P.cf2,x,20+ay,1,1);
  u(SK,x,21+ay,3,3);u(SKD,x+2,21+ay,1,3);
 };
 const armUp=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u('rgba(0,0,0,.12)',x+ox,ty+2,3,1);u(P.cf,x,ty+3,3,1);u(P.sl,x,ty+4,3,3);u(P.shl,x,ty+4,1,3);u(P.shd,x+2,ty+4,1,3)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 if(!side){
  if(fem){
   // áo hồng thêu
   u(P.sh,4,15,12,7);u(P.shl,4,15,2,6);u(P.shd,14,15,2,7);u(P.sh,6,14,8,1);
   if(back){
    u('#7b3fc4',9,16,2,1);u(GR,8,17,4,1);u(YL,9,18,2,2);u(GR,8,19,4,1);u(TL,5,17,2,1);u(YL,13,17,2,1);u(TL,13,20,2,1);u(YL,5,20,2,1);
   }else{
    u(YL,8,15,4,7);u(YLD,11,15,1,7);
    u(GR,9,17,2,1);u(GR,8,18,4,1);u(PRP,9,18,2,1);u(GR,9,19,2,1);u(PRP,9,21,2,1);u(GR,8,21,1,1);u(GR,11,21,1,1);
    u(TL,5,16,2,1);u(YL,5,18,2,1);u(TL,5,20,2,1);u(TL,13,16,2,1);u(YL,13,18,2,1);u(TL,13,20,2,1);
   }
   // thắt lưng + váy ngắn thổ cẩm
   u(BLU,4,22,12,1);u(PRP,4,22,2,1);u(YL,9,22,2,1);
   u(P.sh,4,23,12,1);u(P.sh,3,24,14,1);u(P.shl,3,24,2,1);u(P.shd,15,24,2,1);
   for(let x=5;x<16;x+=3)u(YL,x,24,1,1);
   u(BLU,3,25,14,1);for(let x=4;x<17;x+=2)u(TL,x,25,1,1);
  }else{
   // áo chàm
   u(P.sh,4,15,12,8);u(P.shl,4,15,2,7);u(P.shd,14,15,2,8);u(P.sh,6,14,8,1);
   if(back){
    u(P.shd,9,15,2,8);u(TL,7,15,6,1);u(YL,9,17,2,1);u(YL,8,18,4,1);u(YL,9,19,2,1);u(TL,4,22,12,1);
   }else{
    u(SK,9,14,2,1);u(TL,7,14,6,1);u(TL,8,15,1,1);u(TL,11,15,1,1);u(SK,9,15,2,1);        // cổ chữ V viền ngọc
    u('#4aa6c4',10,16,1,6);u(P.shd,9,16,1,6);                                              // đường khóa
    u(YL,6,17,3,1);u(YL,6,18,1,2);u(YL,6,19,2,1);u(YLD,7,18,1,1);                         // khuy vàng chữ F
    u(YL,11,17,3,1);u(YL,13,18,1,2);u(YL,12,19,2,1);u(YLD,12,18,1,1);
    u(TL,4,22,12,1);u(YL,4,22,1,1);u(YL,15,22,1,1);u(P.shd,4,23,12,1);
   }
  }
  arms();
 }else{
  if(fem){
   u(P.sh,7,16,7,6);u(P.shd,Rt?7:12,16,2,6);u(P.sh,8,14,6,2);
   M(YL,11,16,2,6);M(GR,11,18,2,1);M(PRP,12,18,1,1);M(YLD,13,16,1,6);M(TL,8,18,1,1);M(YL,8,20,1,1);
   M(BLU,6,22,9,1);M(P.sh,5,23,10,2);M(BLU,5,25,10,1);for(let x=6;x<15;x+=2)M(TL,x,25,1,1);M(YL,8,24,1,1);M(YL,11,24,1,1);
  }else{
   u(P.sh,7,16,7,7);u(P.shd,Rt?7:12,16,2,7);u(P.sh,8,14,6,2);
   M(TL,9,14,4,1);M(SK,10,14,2,1);M('#4aa6c4',12,16,1,6);M(YL,11,17,2,1);M(YL,11,18,1,2);M(TL,7,22,7,1);M(P.shd,7,23,7,1);
  }
  const ax=9-sx;
  if(!o.noarm){u(P.sl,ax,16,3,4);u(P.shl,ax,16,3,1);u(P.shd,ax,19,3,1);u(P.cf,ax,20,3,1);u(SK,ax,21,3,3);u(SKD,ax+1,23,2,1)}
 }
 u(SK,9,14,2,1);

 // ---------- đầu ----------
 const faceBase=()=>{
  if(!side){fill(SK,MSTD.HF);u(SKL,5,8,3,3);u(SKD,15,9,2,4);u(SKD,6,13,8,1)}
  else{fill(SK,MSTD.HS,1);M(SKL,9,8,3,3);M(SKD,13,9,2,4);M(SKD,6,13,8,1)}
 };
 const faceFinish=()=>{
  if(o.e>0){faceFx(u,o.e,side?1:0,side?Rt:0);return}
  faceDef(u,side?1:0,side?Rt:0);
  if(bl)return;
  if(!side){
   u(P.iris,7,11,2,1);u(P.irisl,7,12,2,1);u(WH,7,11,1,1);u(P.iris,11,11,2,1);u(P.irisl,11,12,2,1);u(WH,11,11,1,1);
   if(fem){u(P.lash,6,10,3,1);u(P.lash,11,10,3,1);u(P.lash,6,11,1,1);u(P.lash,13,11,1,1)}
   else{u('#3a2a3a',6,10,3,1);u('#3a2a3a',11,10,3,1)}
  }else{
   M(P.iris,11,11,2,1);M(P.irisl,11,12,2,1);M(WH,11,11,1,1);
   if(fem){M(P.lash,10,10,3,1);M(P.lash,13,11,1,1)}else M('#3a2a3a',10,10,3,1);
  }
 };

 if(fem&&!back){if(!side)hat(u,HAT_F);else hat((c,x,y,w,h)=>M(c,x,y,w,h),HAT_S)}   // mấn đội vẽ TRƯỚC (nằm sau đầu/tóc)
 if(back){
  fill(P.hc,MSTD.HF);
 }else{faceBase()}

 // ---------- tóc ----------
 const HC=P.hc,HL=P.hl,HD=P.hd,HS=P.hs;
 if(fem){   // tím xoăn sóng, dài chấm vai
  const wv=y=>rnd(sin(t*1.7+y*.8)*.6);
  if(back){
   u(HC,5,5,10,1);u(HC,4,6,12,10);u(HC,5,16,10,1);
   u(HL,6,6,3,1);u(HL,7,8,1,6);u(HL,13,8,1,6);u(HD,4,7,1,9);u(HD,15,7,1,9);u(HD,10,9,1,7);
   for(let x=4;x<16;x+=2)u(HD,x,16,1,1);
   for(let y=9;y<17;y+=2){u(HC,3-wv(y)*0,y,1,1);u(HC,16,y,1,1)}
  }else if(!side){
   u(HC,6,5,8,1);u(HC,4,6,12,2);u(HL,7,6,3,1);u(HL,11,6,2,1);
   u(HC,4,8,2,1);u(HC,14,8,2,1);u(HC,8,8,1,1);u(HC,11,8,1,1);u(HC,9,8,2,1);u(HD,10,8,1,1);   // mái
   for(let y=9;y<=16;y++){
    const w=(y>>1)%2?1:0,wl=wv(y);
    u(HC,3-w,y,3+w,1);u(HC,14,y,3+w,1);
    if(y%3==0){u(HL,4,y,1,1);u(HL,15,y,1,1)}
    if(y>11){u(HD,3-w,y,1,1);u(HD,16+w,y,1,1)}
   }
   u(HS,3,16,2,1);u(HS,15,16,2,1);
  }else{
   M(HC,6,5,7,1);M(HC,4,6,10,2);M(HL,7,6,3,1);M(HC,11,8,3,1);M(HC,12,9,2,1);
   M(HC,2,7,6,10);M(HC,3,17,4,1);M(HL,4,8,1,7);M(HD,2,9,1,8);M(HD,6,10,1,6);
   for(let y=9;y<17;y+=2)M(HC,1,y,1,1);
   M(HC,8,9,2,3);M(HD,8,11,2,1);          // lọn trước tai
  }
  // mấn đội
  if(back){hat(u,HAT_F);tassels(u,[[2,3,10],[18,3,10]],t)}
  else if(!side){tassels(u,[[2,3,10],[7,0,8],[13,0,8],[18,3,10]],t)}
  else{tassels((c,x,y,w,h)=>M(c,x,y,w,h),[[2,3,10],[9,0,8]],t)}
 }else{   // tóc bạc + mũ vải thêu
  if(back){
   u(HC,3,8,14,7);u(HD,3,12,14,1);u(HL,6,9,3,1);u(HL,11,10,2,1);u(HS,4,10,1,3);u(HS,15,10,1,3);
   for(let x=3;x<17;x+=2)u(HC,x,15,1,1);
  }else if(!side){
   u(HC,3,8,14,1);u(HC,3,9,5,1);u(HC,12,9,5,1);u(HC,9,9,2,1);u(HC,5,10,3,1);u(HC,13,10,3,1);u(HC,6,9,1,2);
   u(HC,3,10,2,4);u(HC,15,10,2,4);u(HS,3,12,1,2);u(HS,16,12,1,2);u(HD,4,13,1,1);u(HD,15,13,1,1);
   u(HC,2,13,1,1);u(HC,17,13,1,1);u(HC,3,14,1,1);u(HC,16,14,1,1);u(HC,5,10,1,2);
   u(HL,8,8,3,1);u(HS,9,9,1,1);u(HD,12,9,1,1);u(HD,7,10,1,1);
  }else{
   M(HC,3,8,12,1);M(HC,10,9,5,1);M(HC,12,10,3,1);M(HC,2,9,8,6);M(HD,2,13,8,1);M(HS,3,10,1,3);
   for(let x=2;x<10;x+=2)M(HC,x,15,1,1);
   M(HL,6,8,3,1);M(HD,11,9,1,1);
  }
  // mũ vải thêu
  if(!side)capRows(u,2,18);
  else capRows((c,x,y,w,h)=>M(c,x,y,w,h),1,17);
  // dải vải buông bên tai
  const sw=rnd(sin(t*2.2)*.7)+(mv?1:0)*(side?(Rt?-1:1):0);
  if(!side){const sx0=back?16:2;u('#1f2a60',sx0,8,2,6);u('#2c3a85',sx0,8,1,6);u(TL,sx0,14,2,1);u(YL,sx0+(back?1:0),14,1,1);u(TL,sx0,15,2,1);u(YL,sx0,16,2,1)}
  else{M('#1f2a60',1+sw,8,2,6);M('#2c3a85',1+sw,8,1,6);M(TL,1+sw,14,2,1);M(YL,1+sw,15,2,1);M(TL,1+sw,16,2,1)}
 }

 // ---------- mặt (vẽ sau tóc/mũ, nhưng KHÔNG che biểu cảm) ----------
 if(!back)faceFinish();

 leaves(u,t,1);
}
window.drawMascotALoi=drawALoi;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.aloi=drawALoi;
})();
