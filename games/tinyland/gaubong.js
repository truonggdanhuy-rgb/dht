/* ===================================================================================
   GAUBONG.JS — 🐻 MASCOT GẤU NÂU BÔNG XÙ (1 set chung, NAM + NỮ đều mặc được)
   • Tự đẩy set vào CUỐI mảng SETS khi nạp (đặt file này SAU boyboy.js trong index.html):
       {k:'gaubong', mascot:'gaubong'}
   • Bán ở TIỆM CHÚ HỀ (circus.js → CL_ITEMS): cần ĐỦ 2000 Xu + 1000 Xu quái vật + 5 Kim cương.
   • Hình: bộ đồ gấu bông (kigurumi) lông nâu xù, mũ trùm có 2 tai tròn + mặt gấu nhỏ (mắt, mũi) trên trán,
     mặt người thò ra giữa mũ (có mái tóc kem + lọn xanh), bụng kem, tay chân có đệm thịt, đuôi tròn phía sau.
   • Hiệu ứng: vài chú 🐻 (emoji) trồi lên – phình to – thu nhỏ lại quanh người, mỗi lần một chỗ khác nhau.
   • KHÔNG che mặt: khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện bình thường.
   • Muốn đổi số lượng / tốc độ emoji: sửa GB_N, GB_L, GB_SIZE ở phần "HIỆU ỨNG" bên dưới.
   =================================================================================== */
(function(){
if(typeof SETS==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần, luôn ở CUỐI mảng) ----------
if(!SETS.some(s=>s.k=='gaubong')){
 SETS.push({n:'Gấu nâu bông xù',k:'gaubong',mascot:'gaubong',ach:1,
  ds:'Bộ đồ gấu bông nâu xù, mũ trùm 2 tai tròn có mặt gấu nhỏ, bụng kem, đệm chân hồng nhạt, đuôi tròn. Vài chú 🐻 trồi lên quanh người. Nam nữ đều mặc được. Không che mặt.',
  sh:'#b9774a',pt:'#b9774a',rpt:'#b9774a',shoe:'#8c542f',scarf:'#f2d4a8'});
}

// ---------- 2) bảng màu ----------
const BR='#b9774a',BRL='#d99a66',BRH='#efc590',BRD='#8c542f',   // lông nâu: chính / sáng / viền mũ sáng / tối
      BE='#f2d4a8',BEL='#fff0d2',BED='#dcb583',                  // bụng, đệm, đuôi: kem / sáng / bóng
      EI='#d9967a',EID='#b9745c',                                // trong tai
      SKN='#ffe4d0',                                             // da mặt
      CR='#f6f1e4',CRD='#d9d0bd',BLH='#7fcbe8',BLD='#4aa3cf',   // tóc mái kem + lọn xanh
      DK='#3a2214',NS='#2a1810';                                 // mắt / mũi gấu trên mũ

function drawBear(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k;
 const M=(c,x,y,w,h)=>u(c,Rt?x:20-x-w,y,w,h);                    // nhìn ngang (tự lật khi quay trái)
 const SY=(c,x,y,w,h)=>{u(c,x,y,w,h);u(c,20-x-w,y,w,h)};          // đối xứng trái-phải
 const fillRows=(c,L,m)=>L.forEach(q=>{const h=q[3]||1;m?M(c,q[1],q[0],q[2]-q[1],h):u(c,q[1],q[0],q[2]-q[1],h)});
 // rải chấm lông sáng / tối lên vùng đã tô → nhìn bông xù
 const fur=(L,m)=>{const P=m?M:u;L.forEach(q=>{const h=q[3]||1;for(let yy=0;yy<h;yy++){const y=q[0]+yy;
  for(let x=q[1];x<q[2];x++){const v=(x*3+y*5)%7;if(v==0)P(BRL,x,y,1,1);else if(v==3&&((x+y)&1))P(BRD,x,y,1,1)}}})};

 if(!sit&&!rd&&!o.nosh)E(r,'rgba(0,0,0,.2)',10,30,8,2);

 // ---------- chân: ống lông nâu + bàn chân có đệm ----------
 const leg=(x,lift)=>{
  const h=3-lift;
  u(BR,x,24,4,h);u(BRL,x,24,1,h);u(BRD,x+3,24,1,h);
  u(BR,x,27-lift,4,2);u(BRL,x,27-lift,1,1);u(BRD,x,29-lift,4,1);
  if(!side&&!back)u(BE,x+1,28-lift,2,1);                          // đệm ngón chân (nhìn trước)
  if(side){const tx=Rt?x+4:x-1;u(BR,tx,28-lift,1,2);u(BRD,tx,29-lift,1,1)}
 };
 if(rd){}
 else if(sit){leg(5,0);leg(11,0)}
 else if(!side){if(lg>0){leg(11,0);leg(5,1)}else if(lg<0){leg(5,0);leg(11,1)}else{leg(5,0);leg(11,0)}}
 else{const sx=lg*(Rt?2:-2),a=7+sx,b=9-sx;if(lg>0){leg(b,0);leg(a,1)}else if(lg<0){leg(a,0);leg(b,1)}else{leg(a,0);leg(b,0)}}

 // ---------- thân + tay ----------
 const arm=(x,ay)=>{                                              // tay áo gấu + bàn tay tròn có đệm
  u(BR,x,16+ay,3,5);u(BRL,x,16+ay,1,8);u(BRD,x+2,16+ay,1,5);
  u(BR,x,21+ay,3,3);u(BRD,x+2,21+ay,1,3);u(BRD,x,24+ay,3,1);
  if(!back)u(BE,x+1,22+ay,1,1);                                   // đệm lòng bàn tay
 };
 const armUp=(x,h,ox)=>{const ty=17-h;
  u(BR,x+ox,ty,3,3);u(BRD,x+ox+2,ty,1,3);if(!back)u(BE,x+ox+1,ty+1,1,1);
  u(BR,x,ty+3,3,4);u(BRL,x,ty+3,1,4);u(BRD,x+2,ty+3,1,4)};
 const arms=()=>{if(o.aup){o.aup[0]!=null?armUp(2,o.aup[0],-1):arm(2,lg);armUp(15,o.aup[1],1)}else{arm(2,lg);arm(15,-lg)}};

 if(!side){
  const BODY=[[15,4,16,8],[23,3,17,2]];                            // thân tròn trịa, gấu áo xòe
  fillRows(BR,BODY);fur(BODY);
  u(BRL,4,15,2,8);u(BRD,14,15,2,8);u(BRD,3,24,14,1);u(BRL,3,23,1,1);
  if(back){
   // đuôi tròn kem
   u(BE,9,20,2,1);u(BE,8,21,4,2);u(BE,9,23,2,1);u(BEL,9,21,1,1);u(BED,11,22,1,1);
   u(BRD,6,14,8,1);                                               // bóng đáy mũ trùm
  }else{
   // bụng kem xù
   const BL=[[16,7,13],[17,6,14,6],[23,7,13]];
   fillRows(BE,BL);
   for(const q of BL)for(let x=q[1];x<q[2];x++)for(let yy=0;yy<(q[3]||1);yy++){const y=q[0]+yy;if((x*3+y*5)%7==0)u(BEL,x,y,1,1)}
   u(BEL,7,17,2,1);u(BED,12,19,2,4);u(BED,8,23,4,1);
   SY(BRH,5,14,3,1);u(BRH,6,15,8,1);u(BR,5,15,1,1);u(BR,14,15,1,1);   // cổ lông mũ trùm
  }
  arms();
 }else{
  const BODY=[[16,7,14,6],[22,6,15,2]];
  fillRows(BR,BODY,1);fur(BODY,1);
  M(BRD,12,16,2,6);M(BRD,6,23,9,1);
  // đuôi tròn phía sau
  M(BE,5,20,2,1);M(BE,4,21,3,2);M(BE,5,23,2,1);M(BEL,4,21,1,1);M(BED,6,22,1,1);
  // bụng
  M(BE,11,17,2,5);M(BEL,11,17,1,2);
  M(BRH,7,14,6,1);M(BR,7,15,6,1);
  const ax=9-(lg*(Rt?2:-2));
  if(!o.noarm){u(BR,ax,16,3,5);u(BRL,ax,16,1,8);u(BRD,ax+2,16,1,5);u(BR,ax,21,3,3);u(BRD,ax+2,21,1,3);u(BE,ax+1,22,1,1)}
 }
 u(BR,9,14,2,1);

 // ---------- MŨ TRÙM GẤU + MẶT (mặt người thò ra, biểu cảm vẫn thấy) ----------
 if(back){
  SY(BR,4,0,3,1);SY(BR,3,1,5,3);SY(BRL,3,1,1,2);SY(BRD,6,3,1,1);   // 2 tai
  fillRows(BR,MSTD.HF);fur(MSTD.HF);
  SY(BR,2,8,1,2);SY(BR,2,11,1,1);SY(BRL,2,8,1,1);
  u(BRD,10,5,1,7);u(BRD,9,12,1,1);                                  // đường may giữa mũ
  u(BRH,6,13,8,1);
 }else if(!side){
  SY(BR,4,0,3,1);SY(BR,3,1,5,3);SY(BRL,3,1,1,2);SY(EI,4,1,3,2);SY(EID,5,2,2,1);
  fillRows(BR,MSTD.HF);fur(MSTD.HF);
  SY(BR,2,8,1,2);SY(BR,2,11,1,1);SY(BRL,2,8,1,1);
  // mặt gấu nhỏ trên trán mũ: 2 mắt + mũi
  SY(DK,6,5,1,2);u(NS,9,6,2,1);u(BRH,9,5,1,1);
  // khung mặt người (viền lông sáng) + da
  u(BRH,6,7,8,1);SY(BRH,5,8,1,1);SY(BRH,4,9,1,4);
  fillRows(SKN,[[8,6,14],[9,5,15,4],[13,6,14],[14,8,12]]);
  SY(BRH,5,14,3,1);
  // tóc mái kem + lọn xanh
  u(CR,6,8,8,1);u(CR,5,9,4,1);u(CR,12,9,3,1);u(CRD,8,9,1,1);u(CRD,13,9,1,1);
  u(BLH,5,10,1,3);u(BLD,5,12,1,1);u(CR,14,10,1,2);
 }else{
  M(BRD,9,1,4,3);                                                   // tai xa (tối hơn)
  M(BR,5,0,3,1);M(BR,4,1,5,3);M(BRL,4,1,1,2);M(EI,5,1,3,2);       // tai gần
  fillRows(BR,MSTD.HS,1);fur(MSTD.HS,1);
  M(BR,2,8,1,2);M(BRL,2,8,1,1);
  M(DK,12,5,1,2);M(NS,14,6,1,1);                                    // mắt + mũi gấu trên mũ
  M(BRH,9,7,5,1);M(BRH,7,8,1,5);M(BRH,14,8,1,4);
  fillRows(SKN,[[8,9,13],[9,8,14,4],[13,9,14],[14,10,13]],1);
  M(BRH,8,14,2,1);
  M(CR,9,8,4,1);M(CR,8,9,2,1);M(BLH,8,10,1,2);
 }

 // ---------- mặt: không che biểu cảm ----------
 if(!back){
  if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);
  else faceDef(u,side?1:0,side?Rt:0);
 }
}
window.drawMascotGauBong=drawBear;
if(typeof MASCOT_DRAW!='undefined')MASCOT_DRAW.gaubong=drawBear;

// ==================================================================================
//  HIỆU ỨNG: vài chú 🐻 (emoji) trồi lên quanh người — vẽ SAU khi vẽ xong nhân vật
//  (bọc drawAv, không sửa index.html; cùng cách với boyboy.js)
// ==================================================================================
const GB_N=5,            // số "chỗ" emoji hoạt động luân phiên (tối đa ~3 chú hiện cùng lúc)
      GB_L=3.6,          // chu kỳ mỗi chú (giây)
      GB_SIZE=7.5,       // cỡ emoji (đơn vị điểm ảnh game)
      GB_SHOW=.62;       // phần chu kỳ mà chú gấu hiện ra
// các vị trí quanh người (tọa độ theo khung nhân vật 20x31) — né vùng khuôn mặt
const GB_POS=[[-3,7],[23,7],[0,-3],[20,-3],[-4,17],[24,17],[-3,27],[23,27],[10,-6],[5,31],[15,31]];
const GB_FONT='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const popEase=x=>{const c=1.70158,t=x-1;return 1+(c+1)*t*t*t+c*t*t};   // easeOutBack: bật nảy lên

function bearFx(g,ox,oy,o){
 const t=performance.now()/1000;
 g.save();g.textAlign='center';g.textBaseline='middle';
 for(let i=0;i<GB_N;i++){
  const x=t/GB_L+i/GB_N,c=Math.floor(x),ph=x-c;
  if(ph>GB_SHOW)continue;
  const kk=ph/GB_SHOW;
  const s=kk<.22?popEase(kk/.22):kk>.78?Math.max(0,(1-kk)/.22):1;   // phình lên → giữ → thu nhỏ
  if(s<=.02)continue;
  const p=GB_POS[(c*GB_N+i)%GB_POS.length];
  const rise=(1-Math.min(1,s))*3;                                  // trồi lên từ dưới
  g.globalAlpha=Math.min(1,s*1.6);
  g.font=(GB_SIZE*s).toFixed(2)+'px '+GB_FONT;
  g.fillText('🐻',ox+p[0],oy+p[1]+rise);
 }
 g.restore();
}
if(typeof window.drawAv==='function'&&!window.drawAv.__gb){
 const old=window.drawAv;
 window.drawAv=function(g,ox,oy,o){
  const res=old.apply(this,arguments);
  try{const S=o&&(o.setObj||SETS[o.set]);if(S&&S.k=='gaubong')bearFx(g,ox,oy,o)}catch(e){}
  return res;
 };
 window.drawAv.__gb=1;
}
})();
