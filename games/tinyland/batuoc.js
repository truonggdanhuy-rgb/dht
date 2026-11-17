/* ===================================================================================
   BATUOC.JS — Mascot BÁ TƯỚC ĐEN (Nam / Nữ) — bán ở Shop kim cương 💎15 / set
   • 🦇 Bá tước đen (Nam)  — SETS (mascot:'bt', bt:'m')
       Mũ cao đen nghiêng, dải mũ đỏ + hoa hồng + vàng, tóc đen, kính tròn viền vàng,
       áo sơ mi đỏ thẫm + gile đen khuy vàng, cổ áo ren trắng cài hoa hồng trắng,
       áo vest đuôi tôm XẺ Ở SAU (nhìn sau thấy đường xẻ lót đỏ), quần short đen, bốt đen.
   • 🦇 Bá tước đen (Nữ)   — SETS (mascot:'bt', bt:'f')
       Tóc đen dài, NƠ BƯỚM đỏ cài đầu, kính tròn viền vàng, váy đen VOAN RẤT TO nhiều tầng
       viền đỏ, áo đen cổ ren đỏ, dây chuyền thánh giá, nơ đỏ ở eo.
   Cả hai: CÁNH DƠI BÉ sau lưng (vỗ nhẹ) + hiệu ứng DƠI NHỎ 🦇 bay ra từ cơ thể (một nửa sau lưng,
   một nửa phía trước, mờ dần).
   Có BIỂU CẢM SẴN: Nữ nháy mắt cười, Nam cười tít mắt há miệng. Nếu bạn chọn biểu cảm khác
   trong Túi thì mặt sẽ đổi theo (kính vẫn giữ nguyên).
   Khai báo 2 món ở CUỐI mảng SETS (index.html) + thêm 'btm','btf' vào DSETS.
   File này chỉ chứa HÀM VẼ. Muốn đổi giá: sửa dia:15 trong index.html.
   =================================================================================== */
(function(){
const sin=Math.sin,cos=Math.cos,rnd=Math.round,flr=Math.floor,PI=Math.PI;
const SK='#f6cfa8',SKL='#ffe3c8',SKD='#d9a37c';
const BK='#1d1a26',BKL='#3a3548',BKD='#0d0b13',BKV='#2a2536';
const RD='#b3202e',RDL='#e5414f',RDD='#6e1019',WH='#ffffff',WS='#dcd3e0',
 GD='#e8b83a',GDL='#fff0a0',GDD='#a8791a',EY='#2b1d12',DK='#6b2230',TG='#ff8c9c',PU='#9a5ad8',PUL='#e0b8ff';
const WM='#2a2234',WML='#54466a',WMR='#7a1626';

// ---------- DƠI NHỎ 🦇 BAY RA TỪ CƠ THỂ (part 0 = sau lưng, part 1 = phía trước) ----------
const BC=[['40,30,54','120,96,150'],['72,22,40','190,64,86'],['34,28,48','100,82,130']];
const SP_BIG=[['X...X','XXXXX','.X.X.'],['..X..','XXXXX','X...X']];
const SP_SM=[['X.X','XXX'],['XXX','X.X']];
function sprite(u,x,y,rows,c1,c2){
 rows.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]=='X')u((j==1&&i==(row.length>>1))?c2:c1,x+i,y+j,1,1)});
}
function bats(u,t,part){
 for(let i=part;i<12;i+=2){
  const P=2.5+(i%4)*.5,ph=((t/P)+i*.211)%1;
  const ang=-PI/2+(((i*53)%100)/100-.5)*PI*1.75;
  const R=ph*(10+(i%3)*4);
  const x=rnd(8+cos(ang)*R+sin(t*4+i)*1.2),y=rnd(18+sin(ang)*R*1.3-ph*4+sin(t*5+i*2)*1);
  const a=Math.min(1,ph*6,(1-ph)*2.4);if(a<.15)continue;
  const al=a>.7?'1':a>.4?'.7':'.45',c=BC[i%3];
  const c1='rgba('+c[0]+','+al+')',c2='rgba('+c[1]+','+al+')';
  const f=flr(t*7+i)%2;
  if(i%3!=2)sprite(u,x,y,SP_BIG[f],c1,c2);else sprite(u,x,y,SP_SM[f],c1,c2);
 }
}

// ---------- CÁNH DƠI BÉ ----------
function wingRows(Rf,rows,y0,t){          // rows: [y,x0,x1) ; vẽ màng + gân + viền đỏ ở gốc
 rows.forEach(q=>{const y=q[0]+y0;
  for(let x=q[1];x<q[2];x++){
   let c=WM;
   if((x-q[1])==0||(y-y0==q[0]&&q[3]))c=WML;
   Rf(c,x,y,1,1);
  }});
}
const WF=[[10,-3,-2],[11,-3,0],[12,-3,2],[13,-2,3],[14,-2,4],[15,-1,4],[16,0,4],[17,-1,0],[17,2,3]];   // cánh trái nhìn trước (nhỏ, tip hướng lên)
const WS_=[[11,1,4],[12,-1,6],[13,-2,6],[14,-2,6],[15,-1,6],[16,0,6],[17,1,3],[17,5,6]];   // cánh nhìn ngang (sau lưng)
const WB=[[9,-2,-1],[10,-2,2],[11,-1,5],[12,0,8],[13,2,9],[14,4,9],[15,6,9],[16,7,9]];   // cánh nhìn sau (trái)
function wingFront(u,SY,t){
 const y0=rnd(sin(t*3.2)*.8);
 WF.forEach(q=>{const y=q[0]+y0;for(let x=q[1];x<q[2];x++){
   const c=(x==-3||x==0)&&y<17?WML:(x>=3?WMR:WM);SY(c,x,y,1,1)}});
}
function wingSide(Rf,t){
 const y0=rnd(sin(t*3.2)*.8);
 WS_.forEach(q=>{const y=q[0]+y0;for(let x=q[1];x<q[2];x++){
   const c=(x==-2||x==2)&&y<17?WML:(x>=5?WMR:WM);Rf(c,x,y,1,1)}});
}
function wingBack(SY,t){
 const y0=rnd(sin(t*3.2)*.8);
 WB.forEach(q=>{const y=q[0]+y0;for(let x=q[1];x<q[2];x++){
   const c=(x==0||x==4)&&y<16?WML:(x>=7?WMR:WM);SY(c,x,y,1,1)}});
}

function drawBaTuoc(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,fem=S.bt=='f',t=performance.now()/1000,mv=!!o.mv;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const sx=side?lg*(Rt?2:-2):0;
 const fill=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 const HC='#16131f',HL='#3b3552',HD='#07060b',HS='#2b2640';
 const sw=rnd(sin(t*2.4)*.8)+(mv?1:0);

 bats(u,t,0);
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.22)',10,30,fem?10:8,2);

 // ---------- cánh dơi (nằm sau thân khi nhìn trước / ngang) ----------
 if(!back){if(!side)wingFront(u,SY,t);else wingSide(M,t)}

 // ---------- chân ----------
 const leg=(x,lift)=>{
  if(fem){
   r(BK,x,24,4,4-lift);r(BKL,x,24,1,4-lift);
   r(BK,x,28-lift,4,1);r(RD,x,29-lift,4,1);
   if(!side)r(GD,x+1,28-lift,1,1);
  }else{
   r(BK,x,24,4,2);r(BKL,x,24,1,2);r(RD,x,25,4,1);          // quần short đen viền đỏ
   r(SK,x,26,4,1);r(SKD,x+3,26,1,1);
   r(BK,x,27-lift,4,2);r(BKL,x,27-lift,1,2);r(BKD,x,29-lift,4,1);
   if(!side)r(GD,x+1,28-lift,2,1);else{const tx=Rt?x+3:x;r(GD,tx,28-lift,1,1)}
  }
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 const armF=(x,ay,left)=>{
  if(fem){u(BK,x,16+ay,3,4);u(BKL,x,16+ay,1,4);u(RD,x,20+ay,3,1);u(BKL,x+1,20+ay,1,1)}
  else{u(RD,x,16+ay,3,4);u(RDL,x,16+ay,1,4);u(RDD,x+2,16+ay,1,4);u(BK,x,20+ay,3,1);u(GD,x+1,20+ay,1,1)}
  u(SK,x,21+ay,3,3);u(SKD,x+2,21+ay,1,3);
 };
 const armUp=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u('rgba(0,0,0,.12)',x+ox,ty+2,3,1);
  u(fem?RD:BK,x,ty+3,3,1);u(fem?BK:RD,x,ty+4,3,3);u(fem?BKL:RDL,x,ty+4,1,3)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):armF(2,lg);armUp(15,o.aup[1],1)}else{armF(2,lg);armF(15,-lg)}};

 if(fem){
  // ===== NỮ: VÁY VOAN RẤT TO =====
  const tl=(c,y,x0,x1)=>u(c,x0,y,x1-x0,1);
  const wob=rnd(sin(t*2.2)*.6);
  if(!side){
   // thân áo đen
   u(BK,4,15,12,7);u(BKL,4,15,2,6);u(BKD,14,15,2,7);u(BK,6,14,8,1);
   if(!back){
    u(RD,6,14,8,1);u(RDL,6,14,2,1);u(RDD,6,15,8,1);u(WH,7,14,1,1);u(WH,10,14,1,1);u(WH,13,14,1,1);      // cổ ren đỏ
    u(GD,8,16,1,1);u(GD,12,16,1,1);u(GD,9,17,1,1);u(GD,11,17,1,1);u('#e8e4f0',10,17,1,3);u('#e8e4f0',9,18,3,1);   // dây + thánh giá
    u(RD,5,20,10,1);u(RDD,5,21,10,1);u(RD,3,20,3,3);u(RDL,3,20,1,1);u(RD,4,22,1,2);u(RD,2,23,2,1);               // nơ eo + dải
   }else{u(RD,5,14,10,2);u(RDD,5,15,10,1);u(RD,5,20,10,1);u(RD,9,19,2,3)}
   arms();
   // váy voan nhiều tầng, to
   const SKT=[[21,3,17],[22,2,18],[23,1,19],[24,0,20],[25,-1,21],[26,-2,22],[27,-2,22]];
   SKT.forEach(q=>{u(BK,q[1],q[0],q[2]-q[1],1)});
   for(let i=0;i<SKT.length;i++){const q=SKT[i];
    u(BKL,q[1],q[0],2,1);u(BKD,q[2]-2,q[0],2,1);
    for(let x=q[1]+3;x<q[2]-1;x+=4)u(BKV,x+(i%2),q[0],1,1)}
   // viền đỏ từng tầng + ren
   u(RD,2,24,16,1);u(RDD,2,25,16,1);u(RD,0,26,20,1);
   for(let x=-2;x<22;x++){u((x+wob)%2?RD:RDD,x,27,1,1);if(x%3==0)u(RDL,x,27,1,1)}
   for(let x=-1;x<21;x+=2)u(BKL,x,28,1,1);                       // đuôi voan lòa xòa
   // dây chéo đỏ trước váy
   if(!back){u(RD,6,22,1,1);u(RD,9,23,2,1);u(RD,13,22,1,1)}
  }else{
   u(BK,7,16,7,6);u(BKD,Rt?7:12,16,2,6);u(BK,8,14,6,2);
   M(RD,8,14,6,1);M(RDD,8,15,6,1);M(RD,6,20,8,1);
   if(!o.noarm){const ax=9-sx;u(BK,ax,16,3,4);u(BKL,ax,16,3,1);u(RD,ax,20,3,1);u(SK,ax,21,3,3);u(SKD,ax+1,23,2,1)}
   // váy xòe ngang nhìn nghiêng
   const SD=[[21,4,16],[22,3,17],[23,2,18],[24,1,19],[25,0,20],[26,-1,20],[27,-1,20]];
   SD.forEach((q,i)=>{M(BK,q[1],q[0],q[2]-q[1],1);M(BKL,q[1],q[0],2,1)});
   M(RD,3,24,14,1);M(RDD,3,25,14,1);M(RD,0,26,20,1);
   for(let x=-1;x<20;x++)M((x+wob)%2?RD:RDD,x,27,1,1);
   for(let x=0;x<20;x+=2)M(BKL,x,28,1,1);
  }
  u(SK,9,14,2,1);
 }else{
  // ===== NAM: VEST ĐUÔI TÔM XẺ SAU =====
  const tw=rnd(sin(t*2.4)*.8)+(mv?1:0);
  if(!side){
   if(!back){
    u(RD,4,15,12,7);u(RDL,4,15,2,6);u(RDD,14,15,2,7);                       // sơ mi đỏ thẫm
    u(BK,4,15,4,9);u(BK,12,15,4,9);u(BKL,4,15,1,9);u(BK,6,15,2,2);u(BK,12,15,2,2);
    u(RD,8,15,4,9);u(RDL,8,16,1,1);u(RDD,11,17,1,1);u(RDD,9,19,1,1);u(RDL,10,21,1,1);   // ngực sơ mi
    u(GD,13,19,1,1);u(GD,13,21,1,1);u(GD,13,23,1,1);u(GD,6,19,1,1);u(GD,6,21,1,1);u(GD,6,23,1,1);   // khuy vàng
    u(BK,4,24,12,1);
    // ren trắng + hoa hồng trắng cài ngực
    u(RD,6,14,8,1);u(WH,8,14,4,1);u(WH,9,15,2,1);u(WS,9,16,2,1);u(WH,8,15,1,1);u(WH,11,15,1,1);
    u(WH,6,17,2,2);u(WS,7,18,1,1);u(WS,6,17,1,1);u(WH,6,19,1,2);                     // hoa hồng + dây
   }else{
    u(BK,4,15,12,9);u(BKL,4,15,2,9);u(BKD,14,15,2,9);u(RD,6,14,8,1);u(BK,8,14,4,1);
    // đường xẻ sau, lót đỏ
    u(RDD,10,21,1,4);u(RD,9,22,1,3);u(RD,11,22,1,3);
   }
   arms();
   // đuôi áo vest
   const t1=back?0:1;
   if(back){
    for(let y=22;y<28;y++){const w=(y-22)>>1;u(BK,4-w-tw,y,5+w+tw,1);u(BK,11,y,5+w+tw,1);u(RDD,9-tw+(y>25?-1:0),y,1,1);u(RD,11+tw,y,1,1)}
    u(BKL,4,22,1,5);u(BKL,11,22,1,5);u(RDD,10,22,1,3);
   }else{
    for(let y=22;y<28;y++){const w=(y-22)>>1;u(BK,2-w,y,3+w,1);u(BK,15,y,3+w,1)}
    u(BKL,2,22,1,5);u(RD,4,22,1,4);u(RD,15,22,1,4);u(RDD,4-tw,26,1,1);
   }
  }else{
   u(RD,7,16,7,6);u(RDD,Rt?7:12,16,2,6);u(RD,8,14,6,2);
   M(BK,6,16,9,8);M(BKL,6,16,1,8);M(RD,12,17,2,5);M(GD,13,19,1,1);M(GD,13,21,1,1);M(GD,13,23,1,1);M(BK,5,24,10,1);
   M(RD,8,14,6,1);M(WH,11,14,3,2);M(WS,12,16,2,1);M(WH,13,17,1,2);
   // đuôi áo nhìn ngang
   for(let y=22;y<28;y++){const w=(y-22)>>1;M(BK,3-w-tw,y,5+w+tw,1)}
   M(RD,3,22,1,4);
   const ax=9-sx;
   if(!o.noarm){u(RD,ax,16,3,4);u(RDL,ax,16,3,1);u(RDD,ax,19,3,1);u(BK,ax,20,3,1);u(GD,ax+1,20,1,1);u(SK,ax,21,3,3);u(SKD,ax+1,23,2,1)}
  }
  u(SK,9,14,2,1);
 }

 // ---------- đầu ----------
 if(back)fill(HC,MSTD.HF);
 else if(!side){fill(SK,MSTD.HF);u(SKL,5,8,3,3);u(SKD,15,9,2,4);u(SKD,6,13,8,1)}
 else{fill(SK,MSTD.HS,1);M(SKL,9,8,3,3);M(SKD,13,9,2,4);M(SKD,6,13,8,1)}

 // ---------- tóc ----------
 if(fem){   // đen dài, mái bằng, hai bên chấm ngực
  const fl=y=>(y>=12?1:0);
  if(back){
   u(HC,4,5,12,11);u(HC,3,10,14,6);u(HL,6,6,3,1);u(HL,7,8,1,7);u(HL,13,8,1,7);u(HD,4,7,1,9);u(HD,15,7,1,9);u(HD,10,9,1,7);
   for(let x=3;x<17;x+=2)u(HD,x,15,1,1);
  }else if(!side){
   u(HC,5,5,10,1);u(HC,4,6,12,2);u(HL,7,6,3,1);u(HL,11,6,2,1);u(HC,4,8,2,1);u(HC,14,8,2,1);u(HC,6,8,3,1);u(HC,11,8,3,1);u(HC,9,8,2,1);u(HD,10,8,1,1);
   for(let y=9;y<=16;y++){const w=fl(y);u(HC,3-w,y,3+w,1);u(HC,14,y,3+w,1);if(y%3==0){u(HL,4,y,1,1);u(HL,15,y,1,1)}u(HD,3-w,y,1,1);u(HD,16+w,y,1,1)}
   u(HS,2,16,2,1);u(HS,16,16,2,1);
  }else{
   M(HC,5,5,9,1);M(HC,4,6,10,2);M(HL,6,6,3,1);M(HC,11,8,3,1);
   M(HC,2,7,6,10);M(HC,1,12,3,4);M(HL,4,8,1,7);M(HD,2,9,1,8);M(HD,6,10,1,6);M(HS,1,15,2,1);M(HC,8,9,2,3);
  }
  // nơ bướm đỏ cài đầu (bên phải mặt)
  const bow=(Rf,x)=>{   // nơ bướm: 2 cánh tam giác + nút giữa vàng
   [[3,0,2],[4,0,3],[5,0,3],[6,0,2]].forEach(q=>{Rf(RD,x+q[1],q[0],q[2]-q[1],1);Rf(RD,x+5-q[2]+3,q[0],q[2]-q[1],1)});
   Rf(RDL,x,3,1,1);Rf(RDL,x+5,3,1,1);Rf(RDD,x+1,6,1,1);Rf(RDD,x+6,6,1,1);Rf(RDD,x+2,5,1,1);Rf(RDD,x+5,5,1,1);
   Rf(BK,x+3,4,2,2);Rf(GD,x+3,4,2,1);Rf(WH,x+1,4,1,1);Rf(WH,x+6,4,1,1);
   Rf(RD,x+2,7,1,1);Rf(RD,x+5,7,1,1);
   if(sin(t*3)>.85)Rf('#ffffff',x+7,2,1,1);
  };
  if(!side)bow(u,10);else bow(M,3);
 }else{     // đen ngắn rối dưới mũ
  if(back){
   u(HC,4,5,12,8);u(HC,5,13,10,1);u(HL,6,6,3,1);u(HL,12,8,2,1);u(HD,4,9,1,4);u(HD,15,9,1,4);u(HD,9,9,2,4);
   for(let x=5;x<15;x+=2)u(HD,x,13,1,1);
  }else if(!side){
   u(HC,4,5,12,3);u(HC,3,6,2,5);u(HC,15,6,2,5);u(HC,5,8,3,1);u(HC,12,8,3,1);u(HC,8,8,1,1);u(HC,10,8,2,1);u(HL,6,5,3,1);u(HL,12,5,2,1);u(HD,3,10,1,1);u(HD,16,10,1,1);u(HS,9,8,1,1);
  }else{
   M(HC,4,5,10,3);M(HC,2,6,6,7);M(HC,10,8,4,1);M(HC,11,8,2,1);M(HL,6,5,3,1);M(HD,2,11,1,2);M(HD,6,10,1,2);
  }
  // mũ cao đen nghiêng + dải đỏ vàng + hoa hồng
  const hat=(Rf,mode)=>{
   if(mode=='f'){
    const R=[[3,5,15],[2,5,15],[1,5,15],[0,6,16],[-1,6,16],[-2,6,16],[-3,7,17],[-4,7,17]];
    R.forEach(q=>{Rf(BK,q[1],q[0],q[2]-q[1],1);Rf(BKL,q[1],q[0],1,1);Rf(BKD,q[2]-1,q[0],1,1)});
    Rf(BKV,8,-4,8,1);Rf(BKL,9,-4,2,1);
    Rf(RD,5,2,10,1);Rf(RDD,5,3,10,1);Rf(GD,5,1,10,1);Rf(GDL,6,1,2,1);       // dải mũ đỏ + viền vàng
    Rf(RD,12,0,3,3);Rf(RDL,12,0,1,1);Rf(RDD,14,2,1,1);Rf(GD,13,1,1,1);   // hoa hồng đỏ
    Rf(BK,2,4,16,1);Rf(BKL,3,4,3,1);Rf(BKD,14,4,4,1);Rf(GD,2,4,1,1);Rf(GD,17,4,1,1);   // vành mũ
    Rf(GD,4,5,1,1);Rf(GD,3,6,1,1);Rf(GD,4,7,1,1);                          // xích vàng rủ
    Rf(GD,6,-1,1,1);Rf(GD,7,-3,1,1);                                      // dây vàng trên mũ
   }else{
    for(let y=-4;y<4;y++){Rf(BK,3,y,10,1);Rf(BKL,3,y,1,1);Rf(BKD,12,y,1,1)}
    Rf(BKV,4,-4,8,1);
    Rf(GD,3,1,10,1);Rf(RD,3,2,10,1);Rf(RDD,3,3,10,1);Rf(RD,10,0,3,3);Rf(RDL,10,0,1,1);
    Rf(BK,1,4,15,1);Rf(BKL,2,4,3,1);Rf(GD,1,4,1,1);
   }
  };
  if(!side)hat(u,'f');else hat(M,'s');
 }

 // ---------- mặt: biểu cảm sẵn (đổi biểu cảm trong Túi thì theo biểu cảm đã chọn) + KÍNH TRÒN ----------
 if(!back){
  const bl=(performance.now()%4300)<140;
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else if(fem){      // Nữ: nháy mắt cười
   if(!side){
    u(EY,6,11,3,1);u(EY,6,12,1,1);u(EY,8,10,1,1);                                 // mắt trái nháy ( ^ )
    u(PU,11,11,2,2);u(PUL,11,12,2,1);u(WH,11,11,1,1);u(EY,11,10,3,1);u(EY,13,11,1,1);   // mắt phải mở, tím
    u('rgba(236,110,110,.55)',6,13,1,1);u('rgba(236,110,110,.55)',13,13,1,1);
    u('#b5604a',8,13,1,1);u(RDL,9,14,2,1);u('#b5604a',11,13,1,1);
   }else{
    M(PU,11,11,2,2);M(PUL,11,12,2,1);M(WH,11,11,1,1);M(EY,10,10,3,1);M(EY,13,11,1,1);
    M('rgba(236,110,110,.55)',9,13,1,1);M('#b5604a',12,13,2,1);
   }
  }else{             // Nam: cười tít mắt, há miệng
   if(!side){
    u(EY,6,12,1,1);u(EY,7,11,2,1);u(EY,9,12,1,1);u(EY,10,12,1,1);u(EY,11,11,2,1);u(EY,13,12,1,1);
    u('rgba(236,110,110,.6)',5,13,2,1);u('rgba(236,110,110,.6)',13,13,2,1);
    u(DK,8,13,4,1);u(DK,9,14,2,1);u(TG,9,14,2,1);u(WH,8,13,1,1);u(WH,11,13,1,1);
   }else{
    M(EY,10,12,1,1);M(EY,11,11,2,1);M(EY,13,12,1,1);
    M('rgba(236,110,110,.6)',9,13,2,1);M(DK,12,13,2,1);M(TG,12,14,1,1);
   }
  }
  // kính tròn viền vàng
  const GL='rgba(190,225,255,.12)';
  if(!side){
   [6,10].forEach(x0=>{
    u(GL,x0+1,11,2,2);
    u(GD,x0+1,10,2,1);u(GD,x0+1,13,2,1);u(GD,x0,11,1,2);u(GD,x0+3,11,1,2);
    u(GDL,x0+1,10,1,1);
   });
   u(GDD,3,11,3,1);u(GDD,14,11,3,1);          // sống kính + gọng
  }else{
   M(GL,11,11,2,2);M(GD,11,10,2,1);M(GD,11,13,2,1);M(GD,10,11,1,2);M(GD,13,11,1,2);M(GDL,11,10,1,1);
   M(GDD,4,11,6,1);
  }
 }

 // ---------- cánh nằm TRÊN thân khi nhìn từ sau ----------
 if(back)wingBack(SY,t);

 bats(u,t,1);
}
window.drawMascotBaTuoc=drawBaTuoc;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.bt=drawBaTuoc;
})();
