/* ===================================================================================
   TINYLAND — Mascot "CHIẾN BINH ÂU LẠC" (Nam / Nữ) + Thú cưỡi "CÁ CHÉP" + Shop Tiên Nữ

   FILE NÀY gồm 3 phần:
     1) drawAuLac()   — vẽ set Chiến binh Âu Lạc (S.aul:'m' = Nam, 'f' = Nữ). Dữ liệu (tên, màu, cờ aul) nằm ở SETS trong index.html.
     2) aulFish()     — vẽ thú cưỡi Cá Chép (MOUNTS trong index.html gọi hàm này), + aulHov() nhịp cá chồi lên khỏi mặt nước.
     3) tnShopUI()    — Shop Tiên Nữ: đổi 🎫 Phiếu Tiên Giới lấy set / thú cưỡi. Muốn thêm món mới: thêm 1 dòng vào TN_SHOP bên dưới.

   • Set thuộc nhóm MASCOT KHÔNG che mặt: có sẵn tóc + mão/mũ lông vũ, NHƯNG khuôn mặt, biểu cảm & phụ kiện cầm tay
     người chơi đang trang bị vẫn hiện (giống Dạ nguyệt / Tiên nữ).
   • Vẽ theo khung chuẩn 20x31 của nhân vật (đầu x6..13 y8..14). Lụa / kiếm / lông vũ được phép tràn ra hai bên một chút.
   • Hàm vẽ nhận (g, r, u, o, S, k):  r = tô theo tọa độ gốc (không nhún), u = tô có nhún khi đi, M = tô theo hướng nhìn (lật trái/phải).
   =================================================================================== */

/* ---------- tia sáng / đốm lửa bay quanh người ---------- */
const AUL_SP=[[-3,14,0,'255,226,140'],[22,10,.27,'255,244,200'],[21,22,.72,'255,226,140'],[5,0,.15,'255,255,255']];
const AUL_EM=[[2,26,0],[17,24,.31],[9,28,.57],[14,27,.83],[5,22,.12]];   // đốm lửa nhỏ bay lên (bản Nam — thành cổ cháy phía sau)

function drawAuLac(g,r,u,o,S,k){
 const {lg,side,Rt,back,sit,rd}=k,t=performance.now()/1000,fem=S.aul=='f';
 const SK='#f1c08a',SKD='rgba(70,35,15,.28)';
 // vàng
 const G='#f2c14e',GL='#ffe58a',GH='#fff6c8',GD='#c58a1c',GDD='#8a5a12';
 // giáp nữ: đỏ nâu — ngọc lục bảo
 const AR='#8f3322',ARL='#b8523a',ARD='#5e1f14',ARK='#3d130c',JD='#3fd18a',JL='#b6f8d6',JK='#1b8a5a';
 // tóc
 const HC=fem?'#1c1620':'#2b1d15',HL=fem?'#463a58':'#58402e',HD=fem?'#0e0a12':'#150d09',HG='#e0ae42',HGL='#fbe08a';
 // nam: lông vũ đỏ thẫm + xanh, đồng, áo, khăn đỏ, kiếm
 const FM='#7d2a26',FML='#b04a3c',FMD='#4d1714',FT='#4aa6b0',FTL='#9be8e6',FTD='#2a6e7a';
 const BZ='#c9822a',BZL='#f0b24a',BZD='#8a5316',TU='#6b2a1c',TUL='#8f4430',TUD='#40180f';
 const RS='#e03a4a',RSL='#ff7a86',RSD='#a01c2c',BL='#8fb3bc',BLL='#dff3f5',BLD='#4a6b75';
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h),UM=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};
 const mk=new Set(),pm=(c,x,y,w,h)=>{u(c,x,y,w,h);for(let j=0;j<h;j++)for(let i=0;i<w;i++)mk.add((y+j)*64+x+i+16)},
  PM=(c,x,y,w,h)=>pm(c,Rt?x:20-x-w,y,w,h),PU=(c,x,y,w,h)=>{pm(c,x,y,w,h);pm(c,20-x-w,y,w,h)};
 const sw=Math.round(Math.sin(t*2.2)),sw2=Math.round(Math.sin(t*2.2+1.7)),tw=Math.sin(t*4);
 const gem=(x,y,w)=>{if(tw>.2)u('rgba(255,255,255,.9)',x,y,w||1,1)};
 const SHD=fem?'rgba(120,235,170,'+(.05+.03*Math.sin(t*1.5)).toFixed(3)+')':'rgba(255,170,90,'+(.05+.03*Math.sin(t*1.5)).toFixed(3)+')';
 // ---- hào quang nhẹ + bóng ----
 if(!o.nosh){E(r,SHD,10,19,12,14);E(r,SHD,10,19,9,11)}
 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------------------------- CHÂN / GIÀY ----------------------------
 let sx=0;
 if(fem){
  const foot=(x,l)=>{r('#6b4a22',x,29-l,3,1);r(GD,x,29-l,1,1)};
  if(rd){}
  else if(sit){foot(6,0);foot(11,0)}
  else if(!side){if(lg>0){foot(11,0);foot(6,1)}else if(lg<0){foot(6,0);foot(11,1)}else{foot(6,0);foot(11,0)}}
  else{sx=lg*(Rt?2:-2);const x1=8+sx,x2=10-sx;if(lg>0){foot(x2,0);foot(x1,1)}else if(lg<0){foot(x1,0);foot(x2,1)}else{foot(x1,0);foot(x2,0)}}
 }else{
  const PT=S.pt,PTL=shade(PT,.25),SD=S.shoe;
  const leg=(x,lift)=>{r(PT,x,24,3,3);r(PTL,x,24,1,3);r(SD,x,27,3,2-lift);r(BZ,x,27,3,1);r(BZL,x,27,1,1);r(SD,x,29-lift,3,1)};
  if(rd){}
  else if(sit){const s2=Math.round(Math.sin(performance.now()/260)*1.5);for(const[x,s]of[[6,s2],[11,-s2]]){const e=s>0?1:0;r(PT,x,24,3,4+e);r(SD,x,28+e,3,2);r(BZ,x,28+e,3,1)}}
  else if(!side){if(lg>0){leg(11,0);leg(6,1)}else if(lg<0){leg(6,0);leg(11,1)}else{leg(6,0);leg(11,0)}}
  else{sx=lg*(Rt?2:-2);const x1=8+sx,x2=10-sx;if(lg>0){leg(x2,0);leg(x1,1)}else if(lg<0){leg(x1,0);leg(x2,1)}else{leg(x1,0);leg(x2,0)}}
 }

 // ---------------------------- LỚP SAU (tóc dài sau lưng / khăn / lụa) ----------------------------
 // dải lụa xanh ngọc trong suốt (nữ): P(s) -> [x,y]
 const rib=(P,n,w,al)=>{for(let i=0;i<=n;i++){const s=i/n,p=P(s),x=Math.round(p[0]),y=Math.round(p[1]),a=al*(1-.55*s);
  u('rgba(110,236,170,'+a.toFixed(2)+')',x,y,w,2);u('rgba(240,255,244,'+(a*.75).toFixed(2)+')',x,y,1,1);
  if(((i*5+Math.floor(t*7))%13)==0)u('rgba(255,255,255,.95)',x+1,y,1,1)}};

 // ---------------------------- THÂN ----------------------------
 if(fem){
  // ===== NỮ: váy giáp đỏ nâu viền vàng =====
  {const SR=side?[[23,5],[24,4],[25,4],[26,3],[27,3],[28,3]]:[[23,5],[24,4],[25,4],[26,3],[27,3],[28,3]],shk=side?0:lg;
   SR.forEach(([y,x0])=>{if(rd&&y>26)return;
    const w=20-2*x0-(side?2:0),xs=x0+(side?1:0),s2=y>=26?shk:0;
    if(y==28){for(let x=xs;x<xs+w;x++){const m=(x-xs)%4;pm(m==0?GL:m==2?JD:G,x+s2,y,1,1)}}
    else{pm(y&1?AR:ARL,xs+s2,y,w,1);u(ARD,xs+w-2+s2,y,2,1);u(GD,xs+s2,y,1,1);u(GD,xs+w-1+s2,y,1,1);
     if(y==27)for(let x=xs+1;x<xs+w-1;x+=3){u(GL,x+s2,y,1,1);u(GD,x+1+s2,y,1,1)}
     if(y==25&&!side){for(let x=xs+2;x<xs+w-1;x+=4)u(G,x+s2,y,1,1)}
     if(y==24)u(ARD,xs+(w>>1)+s2,y,1,1)}});}
  const cuff=(x,ay)=>{pm(AR,x,17+ay,3,3);u(ARL,x,17+ay,1,3);u(ARD,x+2,17+ay,1,3);pm(G,x-1,20+ay,5,1);u(GL,x-1,20+ay,2,1);u(GD,x+3,20+ay,1,1);u(JD,x+1,21+ay,1,1);u(SK,x,21+ay,3,1);u(SK,x,22+ay,3,2)};
  if(!side){
   pm(AR,6,16,8,1);pm(AR,5,17,10,5);u(ARL,5,17,2,5);u(ARD,13,17,2,5);
   if(back){ // lưng: hoa văn mặt trống đồng
    u(G,8,17,4,1);u(G,7,18,6,3);u(GL,8,18,2,1);u(GD,9,19,2,1);u(G,8,21,4,1);u(GH,9,19,1,1);u(JD,10,18,1,1)}
   else{u(G,7,16,6,1);u(GL,7,16,2,1);u(GD,12,16,1,1);u(G,6,17,1,3);u(G,13,17,1,3);u(GD,7,17,1,1);u(GD,12,17,1,1);
    u(G,8,18,4,1);u(G,8,21,4,1);u(G,8,19,1,2);u(G,11,19,1,2);u(JD,9,19,2,2);u(JL,9,19,1,1);u(JK,10,20,1,1);
    u(GL,7,20,1,1);u(GL,12,20,1,1)}
   pm(G,5,22,10,1);u(GL,5,22,3,1);u(GD,12,22,3,1);u(JD,9,22,2,1);u(JL,9,22,1,1);u(ARK,5,23,1,1);u(ARK,14,23,1,1);
   u(SK,9,15,2,1);
   if(o.aup){const up=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u(G,x,ty+3,3,1);u(AR,x,ty+4,3,3);u(ARL,x,ty+4,1,3);u(ARD,x+2,ty+4,1,3)};up(2,o.aup[0],-1);up(15,o.aup[1],1)}
   else{cuff(2,lg);cuff(15,-lg)}
   // vai: giáp vai vàng
   pm(G,4,16,3,2);u(GL,4,16,3,1);u(GD,4,17,3,1);pm(G,13,16,3,2);u(GL,13,16,3,1);u(GD,13,17,3,1);u(JD,5,17,1,1);u(JD,14,17,1,1);
  }else{
   pm(AR,8,16,6,1);pm(AR,7,17,7,5);PM(ARD,12,17,2,5);u(ARL,Rt?7:12,17,1,5);
   pm(G,7,22,7,1);PM(GL,7,22,3,1);PM(JD,11,22,2,1);
   u(SK,9,15,2,1);PM(G,8,16,5,1);PM(G,11,17,1,4);PM(JD,10,18,2,2);PM(JL,10,18,1,1);
   const ax=9-sx;
   if(!o.noarm){pm(AR,ax,17,3,3);pm(G,ax-1,20,5,1);u(GL,ax-1,20,2,1);u(JD,ax+1,21,1,1);u(SK,ax,21,3,1);u(SK,ax,22,3,2);pm(G,ax-1,16,5,2);u(GL,ax-1,16,5,1)}
  }
 }else{
  // ===== NAM: giáp đồng nâu đỏ =====
  if(!side){
   pm(TU,6,16,8,1);pm(TU,5,17,10,5);u(TUL,5,17,2,5);u(TUD,13,17,2,5);
   if(back){ // sau lưng: tấm giáp đồng + mặt trống đồng
    pm(BZ,7,17,6,5);u(BZL,7,17,6,1);u(BZD,7,21,6,1);u(BZL,7,18,1,3);u(BZD,12,18,1,3);
    u(BZL,9,18,2,3);u(GH,9,19,1,1);u(BZD,10,19,1,1);u(BZL,8,19,1,1);u(BZL,11,19,1,1);u(BZL,9,17,2,1);u(BZL,9,21,2,1)}
   else{pm(BZ,7,17,6,5);u(BZL,7,17,6,1);u(BZD,7,21,6,1);u(BZL,7,18,1,3);u(BZD,12,18,1,3);
    u(TUD,9,17,2,1);u(BZL,9,18,2,3);u(GH,9,19,1,1);u(BZD,10,19,1,1);u(BZL,8,19,1,1);u(BZL,11,19,1,1);u(BZL,9,17,2,1);u(BZL,9,21,2,1);
    u(GD,7,19,1,1);u(GD,12,19,1,1)}
   pm(S.belt,5,22,10,1);u(BZ,9,22,2,1);u(BZL,9,22,1,1);u(BZD,6,22,1,1);u(BZD,13,22,1,1);
   // váy giáp ngắn (tua đồng)
   pm(TU,5,23,10,1);for(let x=5;x<15;x+=2){u(BZ,x,23,1,1);}u(TUD,5,23,1,1);u(TUD,14,23,1,1);
   u(SK,9,15,2,1);
   // vai đồng
   pm(BZ,3,16,4,3);u(BZL,3,16,4,1);u(BZD,3,18,4,1);u(BZL,3,17,1,1);pm(BZ,13,16,4,3);u(BZL,13,16,4,1);u(BZD,13,18,4,1);u(BZL,13,17,1,1);
   const arm=(x,ay,hold)=>{pm(TU,x,19+ay,3,2);u(TUL,x,19+ay,1,2);pm(BZ,x,21+ay,3,1);u(BZL,x,21+ay,1,1);u(SK,x,22+ay,3,2)};
   if(o.aup){const up=(x,h,ox)=>{const ty=17-h;u(SK,x+ox,ty,3,3);u(BZ,x,ty+3,3,1);u(TU,x,ty+4,3,3);u(TUL,x,ty+4,1,3);u(TUD,x+2,ty+4,1,3)};up(2,o.aup[0],-1);up(15,o.aup[1],1)}
   else{arm(2,lg);arm(15,-lg)}
  }else{
   pm(TU,8,16,6,1);pm(TU,7,17,7,5);PM(TUD,12,17,2,5);
   pm(BZ,8,17,5,4);PM(BZL,8,17,5,1);PM(BZD,8,20,5,1);PM(BZL,10,18,2,2);PM(GH,11,18,1,1);
   pm(S.belt,7,22,7,1);PM(BZ,11,22,2,1);
   pm(TU,7,23,7,1);u(SK,9,15,2,1);
   pm(BZ,7,16,5,3);PM(BZL,7,16,5,1);PM(BZD,7,18,5,1);
   const ax=9-sx;
   if(!o.noarm){pm(TU,ax,19,3,2);pm(BZ,ax,21,3,1);u(BZL,ax,21,1,1);u(SK,ax,22,3,2)}
  }
 }

 // ---------------------------- KIẾM (nam) ----------------------------
 if(!fem){
  const hilt=(hx,hy)=>{u(BZD,hx-1,hy,4,1);u(BZL,hx-1,hy,2,1);u('#5a3a1a',hx,hy+1,2,1)};
  if(!side){
   if(!back&&!o.aup){const ay=lg,hx=2,hy=24+ay;hilt(hx,hy-1);
    const B=rd?[[2,25],[2,26]]:[[2,25],[2,26],[1,27],[1,28],[1,29],[0,30]];
    B.forEach(([bx,by],i)=>{u(BL,bx,by+ay,3,1);u(BLL,bx,by+ay,1,1);u(BLD,bx+2,by+ay,1,1)});
    if(!rd)u(BLL,0,30+ay,1,1)}
   else if(back){ // vỏ kiếm đeo chéo sau lưng, chuôi nhô qua vai phải
    const P=[[7,23],[8,22],[9,21],[10,20],[11,19],[12,18],[13,17],[14,16]];
    P.forEach(([x,y],i)=>{u(i>5?BZ:'#3a2620',x,y,2,1);if(i<=5)u(BZD,x,y+1,1,1)});u(BZL,14,15,2,1);u(BZD,15,14,1,1);u(BL,16,13,1,1)}
  }else if(!o.noarm){
   const ax=9-sx,hx=ax+1,dx=Rt?1:-1,hy=23;
   // kiếm cầm chéo trước người
   const px=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h),HX=Rt?hx:19-hx;
   px(BZD,hx+1,hy-1,1,3);px(BZL,hx+1,hy-1,1,1);
   for(let i=0;i<6;i++){const bx=hx+2+i,by=hy+Math.floor(i*.8);if(rd&&by>26)break;px(BL,bx,by,1,2);px(BLL,bx,by,1,1);px(BLD,bx,by+1,1,1)}
  }
 }

 // ---------------------------- ĐẦU ----------------------------
 // ===== NỮ: mão vàng + chiếc lông vũ vàng cao + tóc đen dài ánh vàng =====
 const topF=()=>{ // đỉnh đầu nhìn trước / sau
  // lông vũ vàng
  u(GH,9,0,2,1);u(GL,8,1,4,1);u(GH,9,1,1,1);u(G,8,2,4,1);u(GD,11,2,1,1);u(G,9,3,2,1);u(GD,10,3,1,1);u(GD,8,4,4,1);
  // vành mão
  u(G,5,4,3,1);u(G,12,4,3,1);u(GL,5,4,2,1);u(GD,13,4,2,1);
  u(GD,4,5,12,1);u(G,5,5,10,1);u(GL,5,5,3,1);u(GD,13,5,2,1);
  if(!back){u(JD,9,5,2,1);u(JL,9,5,1,1);u(JK,10,5,1,1);gem(9,5)}
  UM(G,3,5,1,1);UM(GD,3,6,1,1)};
 const topM=()=>{ // mão lông vũ nam
  // 7 lông vũ xòe: đỏ thẫm giữa, xanh ngọc ở ngoài cùng
  const bar=(x,y0,y1,c1,c2,c3)=>{for(let y=y0;y<=y1;y++){u(c2,x,y,1,1);u(c1,x+1,y,1,1)}u(c3,x,y0,1,1)};
  // ngoài cùng (xanh ngọc)
  u(FT,3,3,2,2);u(FTL,3,3,1,1);u(FTD,4,4,1,1);u(FT,2,2,1,1);u(FTL,2,2,1,1);
  u(FT,15,3,2,2);u(FTL,16,3,1,1);u(FTD,15,4,1,1);u(FT,17,2,1,1);u(FTL,17,2,1,1);
  // lớp ba
  bar(5,2,4,FM,FMD,FML);bar(13,2,4,FM,FMD,FML);u(FTL,5,2,1,1);u(FTL,14,2,1,1);
  // lớp hai
  bar(7,1,4,FM,FMD,FML);bar(11,1,4,FM,FMD,FML);u(FTD,7,1,1,1);u(FTD,12,1,1,1);
  // lông giữa cao nhất
  for(let y=0;y<=4;y++){u(FMD,9,y,1,1);u(FM,10,y,1,1);}u(FML,10,0,1,1);u(FML,9,1,1,1);u(FTL,9,0,1,1);
  // mặt trống đồng nhỏ trên mão
  u(BZL,9,2,2,2);u(GH,9,2,1,1);u(BZD,10,3,1,1);
  // vành đồng
  u(BZD,4,5,12,1);u(BZ,5,5,10,1);u(BZL,5,5,3,1);u(BZD,13,5,2,1);u(FMD,5,4,10,1);
  u(JD,9,5,2,1);u(JL,9,5,1,1);u(JK,10,5,1,1);gem(9,5)};
 const topSide=()=>{
  if(fem){
   M(GH,9,0,2,1);M(GL,8,1,3,1);M(G,8,2,3,1);M(GD,10,2,1,1);M(G,8,3,2,1);M(GD,8,4,3,1);
   M(GD,4,5,10,1);M(G,5,5,8,1);M(GL,5,5,3,1);M(JD,11,5,2,1);M(JL,11,5,1,1);gem(Rt?12:7,5);
   M(G,4,4,2,1);M(G,5,6,1,1)}
  else{
   M(FT,5,3,2,2);M(FTL,5,3,1,1);M(FT,4,2,1,1);
   M(FM,6,2,2,3);M(FMD,6,2,1,3);M(FML,7,2,1,1);M(FM,8,1,2,4);M(FMD,8,1,1,4);M(FML,9,1,1,1);M(FM,10,0,2,5);M(FMD,10,0,1,5);M(FML,11,0,1,1);M(FTL,10,0,1,1);
   M(FM,12,2,2,3);M(FMD,12,2,1,3);M(FT,13,3,1,1);
   M(BZL,10,2,2,2);M(GH,10,2,1,1);M(BZD,11,3,1,1);
   M(BZD,4,5,10,1);M(BZ,5,5,8,1);M(BZL,5,5,3,1);M(JD,11,5,2,1);M(JL,11,5,1,1);M(FMD,5,4,8,1);gem(Rt?12:7,5)}};
 const top=()=>fem?topF():topM();

 if(back){
  E(u,HC,10,11,4,4);
  if(fem){
   u(HC,4,6,12,15);u(HL,6,8,2,11);u(HL,12,8,1,9);u(HD,4,19,12,2);u(HD,9,8,2,11);UM(HD,4,9,1,11);
   // sợi tóc ánh vàng
   for(let i=0;i<5;i++){u(HG,5+i*2,15+(i&1)*2,1,4);u(HGL,5+i*2,15+(i&1)*2,1,1)}
   for(let i=0;i<6;i++)u(HD,5+i*2,19+(i&1),1,1);
   // tóc bay trái ra ngoài
   u(HC,2+sw,12,2,8);u(HG,2+sw,17,1,4);u(HC,1+sw,16,1,5);u(HGL,1+sw,19,1,2)
  }else{
   u(HC,4,6,12,14);u(HL,6,8,2,10);u(HL,12,8,1,8);u(HD,4,18,12,2);u(HD,9,8,2,10);UM(HD,4,9,1,10);
   for(let i=0;i<6;i++)u(HD,5+i*2,18+(i&1),1,1);
   u(HC,2+sw,11,2,8);u(HC,16+sw2,12,2,6)
  }
  top();
 }else if(!side){
  E(u,SK,10,11,4,4);u(SKD,7,8,6,1);
  if(o.e>0)faceFx(u,o.e,0,0);else if(typeof faceDef=='function')faceDef(u,0,0);else{u('#2b1d12',8,11,1,2);u('#2b1d12',11,11,1,2);u('#b5604a',9,13,2,1)}
  top();
  if(fem){
   u(HC,5,6,10,1);u(HC,4,7,12,1);u(HL,7,6,3,1);u(HD,9,6,2,1);
   UM(HC,4,8,2,1);UM(HC,6,8,1,1);
   // tóc buông hai bên: trái (người xem) dài + bay, phải ngắn hơn
   u(HC,3,9,3,10);u(HD,3,10,1,8);u(HL,5,10,1,7);u(HG,4,13,1,6);u(HGL,4,13,1,2);
   u(HC,2+sw,15,2,7);u(HG,2+sw,18,1,4);u(HC,1+sw,19,1,4);u(HGL,1+sw,21,1,2);
   u(HC,14,9,3,8);u(HD,16,10,1,6);u(HL,14,10,1,6);u(HG,15,12,1,5);u(HGL,15,12,1,2);
   u(HC,16+sw2,14,1,5);u(HG,16+sw2,16,1,3)
  }else{
   u(HC,5,6,10,1);u(HC,4,7,12,1);u(HL,7,6,3,1);u(HD,9,6,2,1);
   // mái rối
   u(HC,6,8,2,1);u(HC,12,8,2,1);u(HD,7,8,1,1);u(HD,12,8,1,1);
   UM(HC,4,8,2,1);
   UM(HC,3,9,3,9);UM(HD,3,10,1,7);UM(HL,5,10,1,6);
   u(HC,2+sw,12,1,6);u(HC,17+sw2,12,1,5);u(HD,2+sw,16,1,2);u(HC,3,18,2,1);u(HC,15,18,2,1)
  }
 }else{
  E(u,HC,Rt?8:12,11,3,4);E(u,SK,Rt?11:9,11,3,4);u(SKD,Rt?8:6,8,6,1);
  if(o.e>0)faceFx(u,o.e,1,Rt);else if(typeof faceDef=='function')faceDef(u,1,Rt);else{u('#2b1d12',Rt?12:7,11,1,2);u('#b5604a',Rt?13:6,13,1,1)}
  topSide();
  if(fem){
   M(HC,6,5,7,1);M(HC,4,6,10,2);M(HL,7,6,3,1);M(HC,5,8,3,1);
   M(HC,3,8,5,12);M(HD,3,9,1,10);M(HL,6,9,1,9);M(HG,4,12,1,7);M(HGL,4,12,1,2);
   M(HC,2+sw,14,2,7);M(HG,2+sw,17,1,4);M(HC,1+sw,18,1,4);M(HGL,1+sw,20,1,2);M(HC,8,9,2,5);M(HD,8,13,2,1)
  }else{
   M(HC,6,5,7,1);M(HC,4,6,10,2);M(HL,7,6,3,1);M(HC,5,8,3,1);
   M(HC,3,8,5,11);M(HD,3,9,1,9);M(HL,6,9,1,8);M(HC,2+sw,11,1,6);M(HD,3,17,5,1);M(HC,8,9,2,4);M(HD,8,12,2,1)
  }
 }

 // ---------------------------- LỚP TRƯỚC (khăn đỏ / lụa) ----------------------------
 if(fem){
  if(!side&&!back){
   rib(s=>[3-5*s+Math.sin(t*2.2+s*6)*2*s,20+9*s+Math.cos(t*1.8+s*5)*1.4*s],9,2,.62);
   rib(s=>[15+5*s+Math.sin(t*2.2+1.5+s*6)*2*s,20+8*s+Math.cos(t*1.8+1.5+s*5)*1.2*s],8,2,.62)
  }else if(back){
   rib(s=>[3-8*s+Math.sin(t*2.2+s*6)*2*s,19+9*s+Math.cos(t*1.8+s*5)*1.4*s],9,2,.5);
   rib(s=>[15+5*s+Math.sin(t*2.2+1.5+s*6)*2*s,19+9*s+Math.cos(t*1.8+1.5+s*5)*1.2*s],8,2,.5)
  }else{
   rib(s=>[Rt?4-6*s+Math.sin(t*2.2+s*6)*2*s:15+6*s-Math.sin(t*2.2+s*6)*2*s,19+8*s+Math.cos(t*1.8+s*5)*1.2*s],9,2,.58)
  }
 }else{
  // khăn đỏ buộc nơ ở vai, đuôi khăn bay
  const fl=Math.round(Math.sin(t*5)*1),fl2=Math.round(Math.sin(t*5+1.3)*1);
  if(!side&&!back){
   u(RS,13,16,4,2);u(RSL,13,16,2,1);u(RSD,15,17,2,1);u(RS,15,15,2,2);u(RSL,15,15,1,1);   // nơ
   u(RS,16+fl,18,2,3);u(RSD,17+fl,19,1,2);u(RS,16+fl2,21,2,3);u(RSD,17+fl2,22,1,2);u(RSL,16+fl,18,1,1);u(RS,14,18,2,2);u(RSD,15,19,1,1)
  }else if(back){
   u(RS,13,15,4,2);u(RSL,13,15,2,1);u(RS,15,17,2,3);u(RSD,16,18,1,2);u(RS,16+fl,20,2,3);u(RSD,17+fl,21,1,2);u(RS,14+fl2,20,2,3);u(RSD,15+fl2,21,1,2)
  }else{
   // khăn tung bay ra phía sau người
   M(RS,6,16,3,2);M(RSL,6,16,2,1);M(RSD,8,17,1,1);M(RS,3+fl,17,3,2);M(RSL,3+fl,17,2,1);M(RS,1+fl2,18,3,2);M(RSD,2+fl2,19,2,1);M(RS,0+fl,19,2,2)
  }
 }

 // ---------------------------- HIỆU ỨNG ----------------------------
 // dải sáng ẩn hiện trôi trên giáp
 {const br=.5+.5*Math.sin(t*1.4);
  mk.forEach(key=>{const x=(key&63)-16,y=key>>6,ph=((t*.42-(x*.055+y*.085))%1+1)%1,a=Math.pow(Math.max(0,Math.sin(ph*Math.PI*2)),6)*(.2+.3*br);
   if(a>.05)u('rgba(255,244,200,'+a.toFixed(2)+')',x,y,1,1);
   if(Math.sin(t*2.1+x*1.7+y*2.3)>.965)u('rgba(255,255,235,.75)',x,y,1,1)})}
 // đốm sáng vàng bay quanh người
 AUL_SP.forEach(([x,y,off,col])=>{const ph=((t*.4+off)%1),a=Math.sin(Math.PI*ph);if(a<.15)return;
  const yy=Math.round(y-ph*3),al=Math.min(1,a*1.4);
  r('rgba('+col+','+al.toFixed(2)+')',x,yy,1,1);const c2='rgba('+col+','+(al*.6).toFixed(2)+')';
  if(a>.7){r(c2,x-1,yy,1,1);r(c2,x+1,yy,1,1);r(c2,x,yy-1,1,1);r(c2,x,yy+1,1,1)}});
 // nam: đốm lửa bay lên (thành cổ cháy phía sau)
 if(!fem&&!o.nosh)AUL_EM.forEach(([x,y0,off],i)=>{const ph=((t*.55+off)%1);if(ph>.8)return;const yy=Math.round(y0-ph*18),xx=Math.round(x+Math.sin(t*3+i*2)*1.5),a=1-ph/.8;
  r('rgba(255,'+(150+Math.round(ph*80))+',60,'+a.toFixed(2)+')',xx,yy,1,1);if(a>.5)r('rgba(255,210,120,'+(a*.5).toFixed(2)+')',xx,yy-1,1,1)});
}

/* ===================================================================================
   THÚ CƯỠI "CÁ CHÉP"
   • Cá chép đỏ – trắng, vây xòe như lửa/lụa hồng-trắng viền xanh ngọc, ngọc tím giữa trán, râu dài.
   • Người ngồi trên lưng cá. Cá luôn "chồi" lên khỏi mặt nước: nước tóe, gợn sóng lan, giọt nước bắn quanh,
     lấp lánh xanh – trắng. Tốc độ bằng Xe hơi mui trần (spd 2.8).
   • aulHov(t,mv): độ cao nhún của cá + người (số nguyên, âm = lên). Đi = nhảy lên hạ xuống theo nhịp; đứng yên = bồng bềnh nhẹ.
   • Hướng TRÁI = lật gương hướng PHẢI (do drawRide lo). part 0 = lớp dưới (đè dưới người), part 1 = lớp trên (đè lên người).
   =================================================================================== */
function aulHov(t,mv){
 if(!mv)return Math.round(-.5-.5*Math.sin(t*2.4));
 const p=(t*1.25)%1;return p<.55?-Math.round(Math.sin(p/.55*Math.PI)*3):0}

function aulFish(R,d,f,b,t,pt,c){
 const mv=c.mv,ph=c.ph;
 // màu cá: đỏ – hồng – trắng
 const RD='#e8384f',RDL='#ff6b7e',RDD='#a8203a',WH='#fff6f4',WHD='#f3d9e0',PKF='#ff9cc2',PKL='#ffd3e6',PKD='#e0648f',
  AQ='#8ff0ff',AQD='#39b8e8',AQL='#dffcff',PU='#c24be0',PUL='#ecb4ff',EY='#2a1630',YW='#ffd36a';
 const wag=Math.sin(t*(mv?9:3.2)),wg=Math.round(wag*(mv?2:1));
 const Rb=(k,x,y,w,h)=>R(k,x,y+b,w,h);
 const sp=(x,y,k)=>{Rb(k||'#ffffff',x,y,1,1);Rb('rgba(255,255,255,.55)',x-1,y,1,1);Rb('rgba(255,255,255,.55)',x+1,y,1,1);Rb('rgba(255,255,255,.55)',x,y-1,1,1);Rb('rgba(255,255,255,.55)',x,y+1,1,1)};
 // ---- mặt nước dưới cá: vũng nước + sóng lan + giọt bắn (vẽ ở mặt đất, KHÔNG nhún theo cá) ----
 const water=(w2,h2)=>{
  const a1=(t*1.1)%1,a2=(t*1.1+.5)%1;
  for(const a of[a1,a2]){const rw=Math.round(w2*(.55+a*.55)),rh=Math.max(1,Math.round(h2*(.55+a*.55))),al=(.55*(1-a)).toFixed(2);
   E(R,'rgba(190,245,255,'+al+')',0,-1,rw,rh);E(R,'rgba(60,170,235,'+(al*.7).toFixed(2)+')',0,-1,Math.max(1,rw-2),Math.max(1,rh-1))}
  E(R,'rgba(70,190,245,.55)',0,-1,w2-2,h2-1);E(R,'rgba(150,230,255,.6)',-2,-2,Math.round(w2*.55),Math.max(1,h2-2));
  // nước tóe thành vòng quanh thân cá
  for(let i=0;i<9;i++){const q=((t*(mv?1.9:1.1))+i/9)%1,a=i/9*Math.PI*2+.6,ex=Math.round(Math.cos(a)*(w2-1)),
    ey=-1-Math.round(Math.sin(q*Math.PI)*(5+(i%3)*2))-(Math.sin(a)>0?0:1);
   if(q<.9){R('rgba(235,252,255,'+(1-q).toFixed(2)+')',ex,ey,1,1);if(q>.15&&q<.7)R('rgba(120,220,255,'+(.8*(1-q)).toFixed(2)+')',ex+(ex>0?1:-1),ey+1,1,1)}}
 };
 // ---- vây xòe hồng – trắng viền ngọc, lấp lánh ----
 const fan=(x,y,L,dir,k)=>{ // vây quạt: gốc (x,y), tỏa ra L ô theo hướng dir (+1 phải/-1 trái)
  for(let i=0;i<L;i++){const hh=Math.max(1,Math.round(L*.55-Math.abs(i-L*.35)*.6));
   for(let j=-hh;j<=hh;j++){const c2=j==-hh?AQ:(i>L-3?PKL:(j<0?WH:PKF));Rb(c2,x+dir*i,y+j-(i>>1),1,1)}}
  Rb(AQL,x+dir*(L-1),y-(L>>1),1,1)};

 if(d>1){
  // ============ NHÌN NGANG (cá quay đầu sang PHẢI; trái = lật gương) ============
  if(!pt){
   water(17,5);
   const sw3=(x)=>Math.round(Math.sin(t*(mv?8:3)-x*.22)*(mv?1.6:.8)*(x<0?(-x/16):0));
   // đuôi chẻ đôi quạt lớn, vẫy
   for(let i=0;i<10;i++){const x=-17-i,y0=-9+sw3(-16),sp2=Math.round(1+i*.6);
    for(let j=-sp2;j<=sp2;j++){const notch=i>5&&Math.abs(j)<=1;if(notch)continue;Rb(Math.abs(j)==sp2?AQ:(i>6?PKL:(j<0?WH:PKF)),x,y0+j,1,1)}}
   Rb(AQL,-26,-9+sw3(-16)-6,1,1);Rb(AQL,-26,-9+sw3(-16)+6,1,1);
   // vây lưng: dựng như ngọn lửa hồng
   for(let i=0;i<10;i++){const hh=Math.round(5-Math.abs(i-3)*.8);for(let j=0;j<hh;j++)Rb(j==hh-1?AQ:(j>2?WH:PKF),-9+i,-14-j-(i<4?0:0),1,1)}
   Rb(AQL,-6,-20,1,1);
   // thân thon: nhỏ dần về đuôi, bụng trắng
   for(let x=-16;x<=17;x++){
    const hh=x<-4?2+(x+16)/12*4.4:x<9?6.4:6.4*Math.sqrt(Math.max(0,1-((x-9)/9)**2)),cy=-9+sw3(x),H=Math.max(1,Math.round(hh));
    for(let j=-H;j<=H;j++){const f2=j/H;Rb(j==-H||(j==H&&H>1)?'#7a1a30':f2<-.45?RDL:f2<.25?RD:f2<.7?WH:WHD,x,cy+j,1,1)}}
   // hoa văn đốm trắng + vảy
   for(const[x,y,w2]of[[-9,-12,3],[-2,-14,4],[5,-12,3],[-5,-8,2]]){Rb(WH,x,y+sw3(x),w2,2);Rb(WHD,x,y+1+sw3(x),w2,1)}
   for(let i=0;i<6;i++)Rb('rgba(255,225,230,.55)',-10+i*3,-9+(i&1)*2+sw3(-10+i*3),1,1);
   // đầu: mắt, miệng, ngọc tím, râu
   Rb(EY,12,-11,2,2);Rb('#ffffff',12,-11,1,1);Rb(YW,13,-10,1,1);
   Rb(RDD,16,-8,2,1);Rb('#ffb0bf',15,-7,3,1);
   Rb(PU,10,-15,3,2);Rb(PUL,10,-15,1,1);Rb(PU,11,-16,1,1);
   const bw=Math.round(Math.sin(t*5));Rb(YW,18,-8,3,1);Rb(YW,21,-8+bw,2,1);Rb(YW,18,-6,2,1);Rb(YW,20,-5+bw,2,1);
   // mang cá
   Rb(RDD,9,-12,1,5);Rb(RDL,8,-11,1,3);
  }else{
   // vây ngực lớn gần người xem + lớp nước tóe che bụng cá
   for(let i=0;i<9;i++){const hh=Math.max(1,Math.round(5-Math.abs(i-3)*.9));for(let j=0;j<hh;j++)Rb(j==hh-1?AQ:(i>5?PKL:(j>1?WH:PKF)),6-i,-8+j-Math.round(Math.sin(t*(mv?9:3)+i*.4)*1)+(i>>2),1,1)}
   Rb(AQL,-2,-6,1,1);
   // vành nước tóe phía trước (che chân người)
   for(let x=-14;x<=16;x++){const hh=Math.round(2+Math.sin(x*.9+t*(mv?9:4))*1.2);const y=-2-hh;
    R('rgba(225,250,255,.85)',x,y+b,1,1);R('rgba(110,215,255,.6)',x,y+1+b,1,1);R('rgba(70,170,235,.45)',x,y+2+b,1,hh+1)}
   // bọt & lấp lánh
   for(let i=0;i<10;i++){const q=(t*1.4+i*.173)%1,x=-15+i*3.2+Math.sin(i*1.7)*1.5,y=-4-Math.sin(q*Math.PI)*9;
    if(q<.8)R('rgba(255,255,255,'+(1-q).toFixed(2)+')',Math.round(x),Math.round(y)+b,1,1)}
   sp(-18,-15+((t*3)%3|0),AQL);sp(19,-14,'#ffffff');sp(4,-21,'#ffffff')
  }
 }else if(d==0){
  // ============ NHÌN TRƯỚC (cá quay đầu về phía người xem) ============
  if(!pt){
   water(15,5);
   // vây lưng & đuôi nhô sau người
   for(let i=0;i<7;i++)Rb(i>4?AQ:(i>2?WH:PKF),-2,-20-i,4,1);Rb(AQL,-1,-27,2,1);
   // thân sau
   E(R,'#7a1a30',0,-9+b,11,7);E(R,RD,0,-9+b,10,6);E(R,RDL,0,-12+b,7,2);
   Rb(WH,-6,-10,3,2);Rb(WH,3,-9,3,2);Rb(WHD,-6,-9,3,1);Rb(WHD,3,-8,3,1);
   // vây ngực xòe hai bên như đôi cánh
   const fw=Math.round(Math.sin(t*(mv?8:3))*1);
   for(const s of[-1,1]){for(let i=0;i<11;i++){const hh=Math.max(1,Math.round(5-Math.abs(i-3)*.7));for(let j=0;j<hh;j++)
     Rb(j==hh-1?AQ:(i>6?PKL:(j>1?WH:PKF)),s*(8+i)+(s>0?0:-1),-9-j-(i>>1)+fw*(i>5?1:0),1,1)}Rb(AQL,s*18+(s>0?0:-1),-15,1,1)}
  }else{
   // đầu cá ở trước, che bụng người
   E(R,'#7a1a30',0,-6+b,9,6);E(R,RD,0,-6+b,8,5);E(R,RDL,0,-9+b,6,2);
   Rb(PU,-1,-11,3,2);Rb(PUL,-1,-11,1,1);Rb(PU,0,-12,1,1);                // ngọc tím
   Rb(WH,-5,-6,3,2);Rb(WH,3,-6,3,2);Rb(WHD,-5,-5,3,1);Rb(WHD,3,-5,3,1);
   for(const s of[-1,1]){Rb(EY,s*5-(s>0?0:1),-7,2,2);Rb('#ffffff',s*5-(s>0?0:1),-7,1,1);Rb(YW,s*5+(s>0?1:-2),-6,1,1)}
   Rb(RDD,-3,-3,6,2);Rb('#ffb0bf',-2,-3,4,1);Rb(RDD,-1,-2,2,1);          // miệng
   const bw=Math.round(Math.sin(t*5));
   Rb(YW,-7,-3,3,1);Rb(YW,-10,-2+bw,3,1);Rb(YW,4,-3,3,1);Rb(YW,7,-2+bw,3,1);
   // nước tóe phía trước
   for(let x=-13;x<=13;x++){const hh=Math.round(1.5+Math.sin(x*1.1+t*(mv?9:4))*1.1),y=-2-hh;
    R('rgba(225,250,255,.9)',x,y+b,1,1);R('rgba(110,215,255,.6)',x,y+1+b,1,1);R('rgba(70,170,235,.5)',x,y+2+b,1,hh+1)}
   for(let i=0;i<9;i++){const q=(t*1.5+i*.19)%1,x=-12+i*3+Math.sin(i*2.3)*1.5,y=-3-Math.sin(q*Math.PI)*10;
    if(q<.8)R('rgba(255,255,255,'+(1-q).toFixed(2)+')',Math.round(x),Math.round(y)+b,1,1)}
   sp(-14,-17,AQL);sp(15,-13,'#ffffff')
  }
 }else{
  // ============ NHÌN SAU (đuôi cá về phía người xem) ============
  if(!pt){
   water(15,5);
   // vây ngực lấp ló hai bên
   for(const s of[-1,1])for(let i=0;i<9;i++){const hh=Math.max(1,Math.round(4-Math.abs(i-2)*.8));for(let j=0;j<hh;j++)Rb(j==hh-1?AQ:(i>5?PKL:(j>1?WH:PKF)),s*(8+i)+(s>0?0:-1),-12-j-(i>>1),1,1)}
   E(R,'#7a1a30',0,-10+b,11,7);E(R,RD,0,-10+b,10,6);E(R,RDL,0,-13+b,7,2);
   for(let i=0;i<7;i++)Rb(i>4?AQ:(i>2?WH:PKF),-2,-21-i,4,1);Rb(AQL,-1,-28,2,1);
  }else{
   // đuôi quạt lớn quét lên phía trước, thân cá che bụng người
   E(R,'#7a1a30',0,-5+b,9,5);E(R,RD,0,-5+b,8,4);Rb(WH,-4,-6,3,2);Rb(WH,2,-6,3,2);
   const tw2=Math.round(Math.sin(t*(mv?9:3.2))*2);
   for(const s of[-1,1])for(let i=0;i<10;i++){const hh=Math.max(1,Math.round(5-Math.abs(i-3)*.7));for(let j=0;j<hh;j++)
    Rb(j==hh-1?AQ:(i>6?PKL:(j>1?WH:PKF)),s*(3+i)+(s>0?0:-1)+tw2*(i>5?s:0),-6-j-(i>>2),1,1)}
   Rb(RDL,-3,-8,6,2);
   for(let x=-13;x<=13;x++){const hh=Math.round(1.5+Math.sin(x*1.1+t*(mv?9:4))*1.1),y=-2-hh;
    R('rgba(225,250,255,.9)',x,y+b,1,1);R('rgba(110,215,255,.6)',x,y+1+b,1,1);R('rgba(70,170,235,.5)',x,y+2+b,1,hh+1)}
   for(let i=0;i<9;i++){const q=(t*1.5+i*.19)%1,x=-12+i*3+Math.sin(i*2.3)*1.5,y=-3-Math.sin(q*Math.PI)*10;
    if(q<.8)R('rgba(255,255,255,'+(1-q).toFixed(2)+')',Math.round(x),Math.round(y)+b,1,1)}
   sp(-14,-17,AQL);sp(15,-13,'#ffffff')
  }
 }
}

/* ===================================================================================
   SHOP TIÊN NỮ — đổi 🎫 Phiếu Tiên Giới (ST.tn.tk) lấy set / thú cưỡi.
   • Mở từ NPC Tiên Nữ (Công viên) → nút "Shop Tiên Nữ".
   • TN_SHOP: t = 's' (set) | 'm' (thú cưỡi) | k = khóa trong SETS / MOUNTS (xem index.html) | p = giá (số Phiếu).
     Muốn đổi giá chỉ cần sửa số p. Muốn thêm món: thêm 1 dòng (món mới trong SETS/MOUNTS PHẢI nằm CUỐI mảng).
   =================================================================================== */
const TN_SHOP=[
 {t:'s',k:'aulm',p:1},
 {t:'s',k:'aulf',p:1},
 {t:'m',k:'carp',p:1}];
const tnArr=t=>t=='m'?MOUNTS:SETS;
const tnKey=(t,x)=>x.k;
const tnIdx=q=>tnArr(q.t).findIndex(x=>tnKey(q.t,x)==q.k);
let TNRAF=0;
// giao diện Shop Tiên Nữ: panel xanh lá pastel, 4 món / hàng, chỉ tên + giá
(function(){const c=document.createElement('style');c.textContent=
 '#ui.tgn .pf{background:#e3f5da;border-color:#8fcf9a}#ui.tgn{background:#e3f5da;border-color:#6fae7a;box-shadow:0 3px 0 #4a8a58;color:#2d5a3a}#ui.tgn .uh{color:#2d6a40}'
 +'#ui.tgn .b{background:#bfe8b0;border-color:#5f9f6a;box-shadow:0 2px 0 #3f7a4a;color:#2d5a3a}#ui.tgn .b.x{background:#d3f0c6}'
 +'.tsg{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin:6px 0}'
 +'.tcd{display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:3px;background:linear-gradient(#f6fff2,#d6f0cc);border:2px solid #8fcf9a;padding:4px 2px;text-align:center;min-width:0}'
 +'.tcd b{font-size:10.5px;line-height:1.15;color:#2d5a3a;display:block}.tcd .b{padding:3px 2px;font-size:11px;width:100%;box-sizing:border-box}'
 +'canvas.tsc{width:100%;height:auto;aspect-ratio:4/5;image-rendering:pixelated;background:linear-gradient(#e9fbe4,#cfeec3);display:block}'
 +'.tcnt{text-align:center;font-weight:800;color:#2d6a40;margin:2px 0 4px}';document.head.appendChild(c)})();
function tnShopUI(){
 const T=tnEnsure();
 const tile=(q,n)=>{const i=tnIdx(q);if(i<0)return '';const x=tnArr(q.t)[i],have=(ST.own[q.t]||[]).includes(i),on=ST.av[q.t]==i,ok=T.tk>=q.p;
  return '<div class="tcd"><canvas class="tsc" data-n="'+n+'" width="96" height="120"></canvas><b>'+x.n+'</b>'
   +(have?'<button class="b" onclick="tnWear('+n+')">'+(on?'✓ Đang dùng':'✓ Dùng')+'</button>'
    :'<button class="b" style="'+(ok?'':'opacity:.6')+'" onclick="tnBuy('+n+')">🎫 '+q.p+'</button>')+'</div>'};
 openUI(head('🛍️ Shop Tiên Nữ')+'<div class="tcnt">🎫 Phiếu Tiên Giới: '+T.tk+'</div><div class="tsg">'+TN_SHOP.map(tile).join('')+'</div>'
  +'<div class="pf"><button class="b" onclick="tnNpcUI()">⬅ Quay lại</button></div>');
 $('ui').classList.add('tgn');
 if(!TNRAF)TNRAF=requestAnimationFrame(tnLoop)}
function tnBuy(n){const q=TN_SHOP[n],T=tnEnsure(),i=q?tnIdx(q):-1;if(i<0)return;
 ST.own[q.t]=ST.own[q.t]||[];if(ST.own[q.t].includes(i))return tnShopUI();
 if(T.tk<q.p)return toast('🎫 Chưa đủ Phiếu Tiên Giới — cần '+q.p+', bạn có '+T.tk);
 T.tk-=q.p;ST.own[q.t].push(i);try{xuUp()}catch(e){}save();
 toast('🎉 Đã đổi '+tnArr(q.t)[i].n+'!\nMở 🎒 Túi → '+(q.t=='m'?'Thú cưỡi':'Set')+' để dùng');tnShopUI()}
function tnWear(n){const q=TN_SHOP[n],i=q?tnIdx(q):-1;if(i<0||!(ST.own[q.t]||[]).includes(i))return;
 ST.av[q.t]=i;if(q.t=='m'&&Pl.sit){Pl.sit=0;Pl.mv=0}save();toast('✨ Đã dùng '+tnArr(q.t)[i].n);tnShopUI()}
function tnLoop(){const cs=document.querySelectorAll('canvas.tsc');if(!cs.length||!UI){TNRAF=0;return}
 const t=performance.now()/1000,d=[0,3,1,2][Math.floor(t/2.4)%4],A=ST.av||{};
 cs.forEach(c=>{const q=TN_SHOP[+c.dataset.n],i=q?tnIdx(q):-1;if(i<0)return;const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.save();
  if(q.t=='m'){g.scale(1.7,1.7);drawRide(g,28,62,{d:3,a:t,mv:1,sit:0,hair:0,set:A.s|0,e:A.e|0},i,t)}
  else{g.scale(3,3);drawAv(g,6,6,{d,a:t,mv:0,sit:0,hair:0,set:i,e:A.e|0})}
  g.restore()});
 TNRAF=requestAnimationFrame(tnLoop)}
