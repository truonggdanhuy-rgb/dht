/* =====================================================================
   PERSO.JS — Thái tử Ba Tư + Thẻ cuốc + Quyền trượng Thủy Thần (Tinyland)
   - Thái tử Ba Tư đứng ở Phố xá (thổi sáo điều khiển rắn hổ mang trong hủ). Bấm vào mở panel:
       a) Thẻ cuốc (xu quái vật, 1 giờ thật, cộng dồn)  b) Ghép Quyền trượng  c) Nâng cấp
   - Điểm cuốc: 5 người tuyết ở Làng Tuyết (ra Mảnh tuyết), 5 ngôi sao ở Làng Lễ hội (ra Mảnh sao)
   - Quyền trượng Thủy Thần: phụ kiện trong Túi (mỗi cấp là 1 mục ACCS: scepter1/2/3 ở cuối mảng ACCS
     trong index.html) => người chơi khác tự thấy qua số phụ kiện `a` sẵn có, KHÔNG thêm dữ liệu mạng.
   - Dữ liệu lưu trong ST.pr = {t: hạn thẻ (ms), st: mảnh sao, sn: mảnh tuyết, lv: cấp gậy 0..3}
   Muốn chỉnh số mảnh / giá / thời gian: sửa các hằng số ngay dưới đây.
   ===================================================================== */
(function(){
'use strict';
/* ---------- HẰNG SỐ DỄ CHỈNH ---------- */
const CARD_PRICE=100;          // giá Thẻ cuốc (xu quái vật)
const CARD_MS=3600000;         // 1 giờ thật mỗi lần mua (mua khi còn hạn thì cộng dồn)
const DIG_MS=1400;             // thời gian 1 lần cuốc (ms)
const DIG_RESPAWN=5000;        // điểm cuốc ẩn bao lâu thì tái xuất (ms)
const SWING_EVERY=5;           // mỗi bao nhiêu giây vung gậy ném bóng nước (giây)
/* Bảng vật phẩm nâng cấp: thêm vật phẩm / cấp mới = thêm 1 dòng.
   k = khóa trong ACCS (index.html), star/snow = số Mảnh sao/Mảnh tuyết, xu/dia = giá, lock = chưa mở */
const UPG=[
 {id:'scepter',name:'Quyền trượng Thủy Thần',lv:1,k:'scepter1',star:10, snow:10, xu:0,    dia:0},
 {id:'scepter',name:'Quyền trượng Thủy Thần',lv:2,k:'scepter2',star:40, snow:40, xu:10000,dia:0},
 {id:'scepter',name:'Quyền trượng Thủy Thần',lv:3,k:'scepter3',star:100,snow:100,xu:30000,dia:10,lock:1}];
/* Vị trí điểm cuốc cố định (tọa độ chân) */
const PTS={
 wt:[[95,178],[350,238],[520,182],[350,338],[565,278]].map(a=>({x:a[0],y:a[1],hide:0,dig:0})),
 lh:[[760,160],[310,570],[460,440],[850,640],[1040,160]].map(a=>({x:a[0],y:a[1],hide:0,dig:0}))};
/* Vị trí Thái tử ở Phố (chân) + điểm đứng khi bấm */
const PRX=520,PRY=480,PSTAND=[560,494];

/* ---------- dữ liệu ---------- */
const P=()=>{let p=ST.pr;if(!p||typeof p!='object')p=ST.pr={};p.t=+p.t||0;p.st=p.st|0;p.sn=p.sn|0;p.lv=Math.max(0,Math.min(3,p.lv|0));return p};
const sci=lv=>ACCS.findIndex(a=>a.k=='scepter'+lv);
const now=()=>Date.now();
const cardLeft=()=>Math.max(0,P().t-now());
const fmtT=ms=>{const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),c=s%60;return (h?h+' giờ ':'')+(h||m?m+' phút ':'')+c+' giây'};
const N=n=>fmtXu(n|0);
/* đặt cấp gậy: gậy cũ bị loại, đang trang bị thì đổi cấp tại chỗ */
function setScepter(lv){const p=P(),old=p.lv;let wore=0;
 for(let l=1;l<=3;l++){const i=sci(l);if(i<0)continue;const k=ST.own.a.indexOf(i);if(k>=0)ST.own.a.splice(k,1);if(ST.av.a==i){wore=1;ST.av.a=-1}}
 p.lv=lv;const ni=sci(lv);if(ni>=0){ST.own.a.push(ni);if(wore)ST.av.a=ni}}
/* đồng bộ: nếu có gậy trong dữ liệu nhưng thiếu trong Túi (vd. tải lại) thì bổ sung */
function fixOwn(){const p=P();if(p.lv>0){const i=sci(p.lv);if(i>=0&&!ST.own.a.includes(i))ST.own.a.push(i)}}

/* ---------- hình vẽ nhỏ ---------- */
const rgba=(c,a)=>'rgba('+c+','+a+')';
const disc=(x,y,rad,col)=>{for(let dy=-rad;dy<=rad;dy++){const w=Math.round(Math.sqrt(rad*rad-dy*dy+rad*.5));r(col,x-w,y+dy,w*2+1,1)}};

/* ===== THÁI TỬ BA TƯ: ngồi xếp bằng trên thảm, thổi sáo, rắn hổ mang đung đưa trong hủ ===== */
function drawPrince(){
 const X=PRX,Y=PRY,tm=performance.now()/1000,f=Math.floor(tm*6)%12,sw=Math.sin(f/12*6.283),sw2=Math.sin(((f+3)%12)/12*6.283);
 if(X<camX-70||X>camX+vw+70||Y<camY-70||Y>camY+vh+60)return;
 const SK='#f1c08a',SKD='#d99e6a',GD='#f0c040',GDD='#b58a1c';
 // --- thảm Ba Tư ---
 r('rgba(0,0,0,.18)',X-27,Y+9,56,3);
 r(GDD,X-26,Y-6,54,15);r(GD,X-25,Y-5,52,13);r('#6a1838',X-23,Y-4,48,11);r('#8a2450',X-23,Y-4,48,1);
 for(let i=0;i<6;i++){const cx0=X-17+i*7;r('#2f2a86',cx0,Y-1,3,1);r('#2f2a86',cx0-1,Y,5,1);r('#2f2a86',cx0,Y+1,3,1);r(GD,cx0+1,Y,1,1)}
 for(let x=X-26;x<X+28;x+=3){r('#e8d8a8',x,Y+9,1,2);r('#e8d8a8',x,Y-8,1,2)}
 // --- hào quang nhẹ + lấp lánh ---
 for(let i=0;i<5;i++){const a=Math.sin(tm*2.2+i*1.9);if(a>.4){const sx=X-24+i*11+(i%2)*3,sy=Y-34+(i*7)%26;r('#fff3b0',sx,sy,1,1);r('rgba(255,235,150,.7)',sx-1,sy,3,1);r('rgba(255,235,150,.7)',sx,sy-1,1,3)}}
 // --- người ---
 const PX=X-7,hb=f%6<3?0:-1;
 r('#e8f0ff',PX-9,Y-7,18,7);r('#b9c6e8',PX-9,Y-2,18,1);r('#b9c6e8',PX-1,Y-6,2,5);   // quần ống rộng
 r(GD,PX-9,Y-1,18,1);r('#7a3cc8',PX-10,Y-2,5,2);r(GD,PX-11,Y-3,1,2);r('#7a3cc8',PX+6,Y-2,5,2);r(GD,PX+11,Y-3,1,2); // giày cong mũi
 r('#3a2a9a',PX-6,Y-17+hb,12,11);r('#2a1c78',PX+4,Y-17+hb,2,11);r(GD,PX-6,Y-17+hb,1,11);r(GD,PX+5,Y-17+hb,1,11);r(GD,PX-1,Y-14+hb,2,1);r(GD,PX-1,Y-11+hb,2,1);
 r('#f8f8ff',PX-1,Y-17+hb,2,3);r(GD,PX-6,Y-9,12,2);r('#e0305a',PX-1,Y-9,2,2);               // vest + sash
 r('#f4f4ff',PX-8,Y-16+hb,3,7);r('#c9d2ee',PX-8,Y-10+hb,3,1);                               // tay áo trái
 r('#f4f4ff',PX-5,Y-13,12,3);r('#c9d2ee',PX-5,Y-11,12,1);                                   // cẳng tay vắt ngang
 r(SK,PX+7,Y-13,2,2);r(SK,PX+11,Y-12,2,2);                                                   // 2 bàn tay giữ sáo
 // đầu
 r('#1a1020',PX-5,Y-26+hb,1,7);r('#1a1020',PX+4,Y-26+hb,1,7);
 r(SK,PX-4,Y-25+hb,8,8);r(SKD,PX+3,Y-25+hb,1,8);r('#f08a7a',PX-4,Y-21+hb,2,1);r('#f08a7a',PX+2,Y-21+hb,2,1);
 r('#1a1020',PX-3,Y-23+hb,2,1);r('#1a1020',PX+1,Y-23+hb,2,1);r('#241a3a',PX-3,Y-24+hb,2,1);r('#241a3a',PX+1,Y-24+hb,2,1);  // mắt nhắm + lông mày
 r('#1a1020',PX-2,Y-20+hb,1,1);r('#1a1020',PX+1,Y-20+hb,1,1);                                // ria mỏng
 // sáo: từ miệng chếch xuống hướng hủ rắn
 for(let i=0;i<11;i++)r(i%4==3?'#7a4a1c':'#d9a441',PX+1+i,Y-20+hb+Math.floor(i*.55),1,1);
 r('#fff2b0',PX+1,Y-20+hb,1,1);
 // khăn quấn + ngọc + lông vũ
 r('#5a2fb0',PX-7,Y-31+hb,14,6);r('#5a2fb0',PX-5,Y-33+hb,10,2);r('#7b4fd8',PX-5,Y-32+hb,9,1);r('#4a2490',PX-7,Y-28+hb,14,1);r(GD,PX-6,Y-26+hb,12,1);
 r('#ff3b6b',PX-1,Y-30+hb,2,2);r('#fff',PX-1,Y-30+hb,1,1);
 r('#ffffff',PX+1,Y-39+hb,1,6);r('#ffe9a0',PX+2,Y-38+hb,1,4);r(GD,PX+1,Y-40+hb,2,1);
 // --- hủ rắn ---
 const JX=X+15,JY=Y-2;
 r('rgba(0,0,0,.2)',JX-8,Y+7,17,2);
 r('#b5603a',JX-6,JY+1,12,8);r('#d9824e',JX-6,JY+1,3,8);r('#8a4426',JX+3,JY+1,3,8);r('#a5532f',JX-5,JY+9,10,1);
 r('#d9824e',JX-7,JY-1,14,2);r('#f0a06a',JX-7,JY-1,14,1);r(GD,JX-6,JY+4,12,1);r('#2a1a14',JX-5,JY-1,10,1);
 for(let i=0;i<4;i++)r('#f0c040',JX-4+i*3,JY+6,1,1);
 // --- rắn hổ mang: thân đung đưa theo nhịp sáo, ít khung ---
 const seg=[];for(let i=0;i<11;i++){const k=i/10;seg.push([JX+Math.round(sw*(1+k*4.5)+sw2*k*1.5),JY-i*1.5])}
 const BL='#c9a23a',BD='#7a5a14',BH='#ecd070';
 seg.forEach((s,i)=>{const x=Math.round(s[0]),y=Math.round(s[1]);if(i<8){r(i%2?BD:BL,x-2,y,4,2);r(BH,x-2,y,1,2)}});
 const [hx,hy]=seg[10],HX=Math.round(hx),HY=Math.round(hy);
 // mang bành ra
 r(BL,HX-5,HY+5,10,2);r(BL,HX-4,HY+3,8,2);r(BL,HX-3,HY+1,6,2);r(BH,HX-4,HY+3,2,3);r(BD,HX+2,HY+3,2,4);r(BD,HX-5,HY+6,10,1);
 r('#241a14',HX-1,HY+4,1,1);r('#241a14',HX+1,HY+4,1,1);r('#e8c870',HX,HY+5,1,2);          // hoa văn kính trên mang
 r(BL,HX-2,HY-1,5,3);r(BH,HX-2,HY-1,2,1);r('#e0203a',HX-1,HY,1,1);r('#e0203a',HX+1,HY,1,1);
 if(f%4==0){r('#e0203a',HX,HY+2,1,2);r('#e0203a',HX-1,HY+4,1,1);r('#e0203a',HX+1,HY+4,1,1)} // lè lưỡi
 // nốt nhạc bay lên từ đầu sáo
 for(let i=0;i<2;i++){const p=((tm*.55)+i*.5)%1,nx=PX+13+Math.round(Math.sin(p*6+i*2)*3),ny=Y-22-Math.round(p*22);
  const c=i?'rgba(255,225,120,':'rgba(190,230,255,',a=(1-p).toFixed(2);r(c+a+')',nx,ny+3,2,2);r(c+a+')',nx+1,ny,1,4);r(c+a+')',nx+2,ny,2,1)}
 // bảng tên cung điện
 const tx=X,ty=Y-50;cx.save();cx.font='900 7px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';
 const w=Math.round(cx.measureText('THÁI TỬ BA TƯ').width)+12;
 r(GDD,tx-w/2-1,ty-8,w+2,11);r('#2a1a6e',tx-w/2,ty-7,w,9);r(GD,tx-w/2,ty-7,w,1);
 r('#ff3b6b',tx-w/2+2,ty-4,2,2);r('#ff3b6b',tx+w/2-4,ty-4,2,2);
 cx.fillStyle='#ffe9a0';cx.fillText('THÁI TỬ BA TƯ',tx,ty,w);cx.restore()}

/* ===== ĐIỂM CUỐC ===== */
function drawSnowman(p){const x=p.x,y=p.y;if(p.hide>now())return;
 if(x<camX-30||x>camX+vw+30||y<camY-40||y>camY+vh+50)return;
 r('rgba(60,90,140,.25)',x-9,y+1,18,3);disc(x,y-5,6,'#e8f0fa');disc(x,y-5,5,'#ffffff');disc(x,y-15,4,'#e8f0fa');disc(x,y-15,3,'#ffffff');
 r('#d0def0',x+2,y-8,3,5);r('#2a2a3a',x-2,y-16,1,1);r('#2a2a3a',x+1,y-16,1,1);r('#f08a2a',x,y-14,3,1);
 r('#d9302a',x-4,y-11,8,2);r('#d9302a',x+2,y-9,2,4);r('#7a4a26',x-9,y-12,4,1);r('#7a4a26',x+6,y-13,4,1);r('#2a2a3a',x-1,y-7,1,1);r('#2a2a3a',x-1,y-4,1,1);
 r('#2a2a3a',x-3,y-21,6,1);r('#2a2a3a',x-2,y-24,4,3);r('#d9302a',x-2,y-22,4,1);
 if(p.dig)drawPick(p)}
function drawStar(p){const x=p.x,y=p.y,tm=performance.now()/1000;if(p.hide>now())return;
 if(x<camX-30||x>camX+vw+30||y<camY-40||y>camY+vh+50)return;
 const f=Math.floor(tm*3+x*.1)%3,a=f==0?.55:f==1?.85:1;
 r('rgba(255,230,120,'+(.18*a).toFixed(2)+')',x-6,y-1,12,3);r('rgba(255,235,150,'+(.3*a).toFixed(2)+')',x-4,y-2,8,5);
 r('#ffe27a',x-1,y-3,3,7);r('#ffe27a',x-3,y-1,7,3);r('#fff8c8',x-1,y-1,3,3);r('#ffffff',x,y,1,1);
 if(f==2){r('#fff8c8',x,y-6,1,3);r('#fff8c8',x,y+4,1,3);r('#fff8c8',x-6,y,3,1);r('#fff8c8',x+4,y,3,1)}
 if(p.dig)drawPick(p)}
/* cây cuốc pixel tự xuất hiện giữa khoảng không cạnh điểm cuốc, cuốc vài nhát rồi biến mất */
function drawPick(p){const el=(now()-p.dig)/DIG_MS;if(el<0||el>1)return;
 const s=(el*3)%1,ang=s<.55?-.9+s/.55*1.9:1-(s-.55)/.45*1.9,px=p.x+13,py=p.y-16;
 const dx=Math.sin(ang),dy=-Math.cos(ang);
 for(let k=-3;k<=11;k++)r(k%3?'#a8703a':'#7a4a26',Math.round(px+dx*k),Math.round(py+dy*k),1,1);
 const ex=px+dx*11,ey=py+dy*11,nx=-dy,ny=dx;
 for(let k=-5;k<=5;k++){r(Math.abs(k)>3?'#d8dde4':'#9aa3ad',Math.round(ex+nx*k),Math.round(ey+ny*k),2,2)}
 if(s>.5&&s<.75){r('#ffffff',p.x+1,p.y-8,1,1);r('#fff3b0',p.x+4,p.y-11,1,1);r('#fff3b0',p.x-3,p.y-10,1,1);r('#ffffff',p.x+5,p.y-6,1,1)}}
let busy=0,busyAt=0;
function dig(key,i){const p=(PTS[key]||[])[i];if(!p)return;const n=now();
 if(busy&&n-busyAt>6000)busy=0;
 if(busy)return;
 if(p.hide>n)return toast('Điểm cuốc đang hồi lại, chờ chút nhé');
 if(cardLeft()<=0)return toast('Cần Thẻ cuốc, mua ở Thái tử Ba Tư ở Phố');
 busy=1;busyAt=n;p.dig=n;
 setTimeout(()=>{p.dig=0;p.hide=now()+DIG_RESPAWN;busy=0;const q=P();
  if(key=='wt'){q.sn++;toast('❄️ +1 Mảnh tuyết (có '+q.sn+')')}else{q.st++;toast('⭐ +1 Mảnh sao (có '+q.st+')')}
  save();if(UI&&$('prp'))prince()},DIG_MS)}

/* ===== PANEL THÁI TỬ (phong cách cung điện Ba Tư) ===== */
function css(){if(document.getElementById('prcss'))return;const s=document.createElement('style');s.id='prcss';
 s.textContent='.prp{background:radial-gradient(ellipse at 50% -10%,#6a46c8 0,#2f1d7a 42%,#150d3d 100%);border:3px solid #e8b83a;border-radius:18px 18px 8px 8px;box-shadow:inset 0 0 0 2px #7a5a14,inset 0 0 24px rgba(0,0,0,.55);color:#ffe9a0;padding:6px 10px 10px;text-align:left}'+
 '.prp:before{content:"";display:block;height:14px;margin:0 -4px 2px;background:radial-gradient(circle at 10px 15px,transparent 7px,#e8b83a 7px,#e8b83a 8.5px,transparent 8.5px) repeat-x;background-size:20px 14px}'+
 '.prh{display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:17px;color:#ffd75a;text-shadow:0 1px 0 #000,0 0 8px rgba(255,200,60,.6)}'+
 '.prs{font-size:11px;color:#cdbcff;margin:2px 0 6px}.prr{font-size:12px;color:#ffe9a0;background:rgba(0,0,0,.28);border:1px solid #b58a1c;border-radius:8px;padding:4px 6px;margin-bottom:6px}'+
 '.prc{border:1px solid #e8b83a;background:rgba(18,8,60,.6);border-radius:10px;padding:8px;margin:7px 0;box-shadow:inset 0 0 0 1px rgba(232,184,58,.25)}'+
 '.prc h4{margin:0 0 4px;font-size:14px;color:#ffd75a}.prc div{font-size:12px;line-height:1.5}.ok{color:#8dffb0}.no{color:#ff9a9a}'+
 '.prb{display:block;width:100%;margin-top:6px;padding:8px;border:2px solid #7a5a14;border-radius:9px;background:linear-gradient(#ffe27a,#e0a92e);color:#3a2000;font-weight:900;font-size:13px;cursor:pointer}'+
 '.prb[disabled]{background:#6b6280;color:#c9c0e0;border-color:#4a4260;cursor:not-allowed}';
 document.head.appendChild(s)}
let tmr=0;
function prince(){css();fixOwn();const p=P(),L=cardLeft(),lv=p.lv;
 const need=(have,n)=>'<span class="'+(have>=n?'ok':'no')+'">'+N(have)+'/'+N(n)+'</span>';
 const reqHtml=u=>'⭐ Mảnh sao '+need(p.st,u.star)+' • ❄️ Mảnh tuyết '+need(p.sn,u.snow)+(u.xu?' • 🪙 Xu '+need(ST.xu|0,u.xu):'')+(u.dia?' • 💎 '+need(ST.dia|0,u.dia):'');
 const can=u=>p.st>=u.star&&p.sn>=u.snow&&(ST.xu|0)>=u.xu&&(ST.dia|0)>=u.dia;
 const u1=UPG.find(u=>u.lv==1),nx=UPG.find(u=>u.lv==lv+1);
 let h='<div class="prp" id="prp"><div class="prh"><span>👑 Thái tử Ba Tư</span><button class="b x" onclick="closeUI()">X</button></div>'+
 '<div class="prs">“Chào lữ khách! Hãy cuốc mảnh ở Làng Tuyết và Làng Lễ hội, ta sẽ ban cho ngươi báu vật.”</div>'+
 '<div class="prr">🪙 '+N(ST.xu)+' • 💎 '+N(ST.dia)+' • Xu quái vật '+N(ST.qv)+'<br>⭐ Mảnh sao <b>'+p.st+'</b> • ❄️ Mảnh tuyết <b>'+p.sn+'</b></div>';
 h+='<div class="prc"><h4>⛏️ Thẻ cuốc</h4><div>Cuốc mảnh ở Làng Tuyết & Làng Lễ hội. Hiệu lực 1 giờ (tính giờ thật, tắt game vẫn trôi), mua thêm khi còn hạn sẽ cộng dồn.</div>'+
  '<div>Còn lại: <b id="prl">'+(L>0?fmtT(L):'chưa có thẻ')+'</b></div>'+
  '<button class="prb" onclick="PERSO.buyCard()"'+((ST.qv|0)<CARD_PRICE?' disabled':'')+'>Mua Thẻ cuốc — '+CARD_PRICE+' xu quái vật (+1 giờ)</button></div>';
 h+='<div class="prc"><h4>🔱 Ghép Quyền trượng Thủy Thần</h4>';
 if(lv>0)h+='<div class="ok">✓ Bạn đã có Quyền trượng Thủy Thần cấp '+lv+' (xem trong 🎒 Túi › Phụ kiện).</div>';
 else h+='<div>Nộp nguyên liệu để nhận Quyền trượng cấp 1:<br>'+reqHtml(u1)+'</div><button class="prb" onclick="PERSO.craft()"'+(can(u1)?'':' disabled')+'>Ghép Quyền trượng cấp 1</button>';
 h+='</div><div class="prc"><h4>✨ Nâng cấp</h4>';
 if(lv==0)h+='<div>Hãy ghép Quyền trượng cấp 1 trước.</div>';
 else if(!nx)h+='<div class="ok">Quyền trượng đã ở cấp cao nhất.</div>';
 else{h+='<div>Lên cấp '+nx.lv+':<br>'+reqHtml(nx)+'</div>';
  if(nx.lock)h+='<button class="prb" disabled>🔒 Sắp ra mắt</button>';
  else h+='<button class="prb" onclick="PERSO.upgrade()"'+(can(nx)?'':' disabled')+'>Nâng lên cấp '+nx.lv+'</button>'}
 h+='</div></div>';
 openUI(h);clearInterval(tmr);tmr=setInterval(()=>{const e=$('prl');if(!UI||!e){clearInterval(tmr);return}const l=cardLeft();e.textContent=l>0?fmtT(l):'chưa có thẻ';if(l<=0&&e.dataset.x!='1'){e.dataset.x='1';prince()}},1000)}
function buyCard(){const p=P();if((ST.qv|0)<CARD_PRICE)return toast('Không đủ xu quái vật! Cần '+CARD_PRICE);
 ST.qv-=CARD_PRICE;p.t=Math.max(now(),p.t)+CARD_MS;xuUp();save();toast('⛏️ Đã mua Thẻ cuốc +1 giờ');prince()}
function pay(u){const p=P();if(!(p.st>=u.star&&p.sn>=u.snow&&(ST.xu|0)>=u.xu&&(ST.dia|0)>=u.dia))return 0;
 p.st-=u.star;p.sn-=u.snow;ST.xu-=u.xu;ST.dia-=u.dia;return 1}
function craft(){const p=P(),u=UPG.find(x=>x.lv==1);if(p.lv>0||u.lock)return;if(!pay(u))return toast('Chưa đủ nguyên liệu');setScepter(1);xuUp();save();toast('🔱 Nhận Quyền trượng Thủy Thần cấp 1!\nMở 🎒 Túi › Phụ kiện để trang bị');prince()}
function upgrade(){const p=P(),u=UPG.find(x=>x.lv==p.lv+1);if(!u||u.lock||p.lv<1)return;if(!pay(u))return toast('Chưa đủ nguyên liệu');setScepter(u.lv);xuUp();save();toast('✨ Quyền trượng lên cấp '+u.lv+'!');prince()}

/* ===== QUYỀN TRƯỢNG: hình vẽ (art của ACCS, t:'hold') ===== */
function art(Pa,lv){
 const R=Pa.side?(c,x,y,w,h)=>Pa.R(c,x+2,y,w,h):Pa.R,t=Pa.t,hy=Pa.hy;
 const ln=(c,x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let k=0;k<=n;k++)R(c,Math.round(x0+(x1-x0)*k/n),Math.round(y0+(y1-y0)*k/n),1,1)};
 const cyc=t%SWING_EVERY,SW=.9;let th=0;
 if(cyc<SW){const u=cyc/SW;th=u<.2?-.5*(u/.2):u<.5?-.5+1.7*((u-.2)/.3):u<.7?1.2:1.2*(1-(u-.7)/.3)}
 const sn=Math.sin(th),cs=Math.cos(th),L=24;
 const tx=Math.round(sn*L),ty=Math.round(hy-cs*L),bx=Math.round(-sn*7),by=Math.round(hy+cs*7);
 // cán gậy xanh ngọc mảnh dài
 ln('#7fc4e8',bx,by,tx,ty);ln('#d8f6ff',bx+(sn>.3?0:1),by,tx+(sn>.3?0:1),ty);
 R('#f0c850',Math.round(sn*8),Math.round(hy-cs*8),2,1);                          // vòng vàng ở tay
 R('#f0c850',tx-1,ty+1,3,1);R('#5ab4e8',tx-3,ty,1,2);R('#5ab4e8',tx+3,ty,1,2);R('#8fd6ff',tx-2,ty-1,1,1);R('#8fd6ff',tx+2,ty-1,1,1); // vây nước
 // quả cầu bóng nước
 const ox=tx+Math.round(sn*4),oy=ty-Math.round(cs*4)-1;
 for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.hypot(dx,dy);if(d>4.3)continue;
  if(d>3.2)R('rgba(90,190,255,.95)',ox+dx,oy+dy,1,1);
  else if(dy>1+Math.round(Math.sin(t*3+dx)*.6))R('rgba(60,160,240,.55)',ox+dx,oy+dy,1,1);
  else R('rgba(190,235,255,.38)',ox+dx,oy+dy,1,1)}
 R('#ffffff',ox-2,oy-2,1,1);R('rgba(255,255,255,.8)',ox-1,oy-3,1,1);R('rgba(255,255,255,.6)',ox+2,oy+2,1,1);
 // bóng nước nhỏ bay lên
 for(let i=0;i<3;i++){const p=((t*.45)+i/3)%1,bxx=ox+Math.round(Math.sin(t*2.5+i*2.1)*2)+(i-1)*2,byy=oy-5-Math.round(p*14),a=(1-p).toFixed(2);
  R('rgba(190,235,255,'+a+')',bxx,byy,2,2);R('rgba(255,255,255,'+a+')',bxx,byy,1,1)}
 // mỗi 5 giây: vung gậy, ném các bóng nước (chỉ để đẹp)
 if(cyc<2.4){const sx=Math.round(Math.sin(1.2)*L+4),sy=Math.round(hy-Math.cos(1.2)*L)-3;
  for(let k=0;k<5;k++){const e=cyc-(.3+.11*k);if(e<=0||e>1.5)continue;
   const x=Math.round(sx+e*(12+k*5)),y=Math.round(sy-e*(7-k*2)+e*e*9+Math.sin(e*5+k)*1);
   if(e<1.3){R('rgba(90,190,255,.9)',x+1,y,1,1);R('rgba(90,190,255,.9)',x,y+1,1,1);R('rgba(90,190,255,.9)',x+2,y+1,1,1);R('rgba(90,190,255,.9)',x+1,y+2,1,1);R('rgba(200,240,255,.5)',x+1,y+1,1,1);R('#fff',x+1,y,1,1)}
   else{R('rgba(220,245,255,.8)',x-1,y,1,1);R('rgba(220,245,255,.8)',x+3,y,1,1);R('rgba(220,245,255,.8)',x+1,y-1,1,1);R('rgba(220,245,255,.8)',x+1,y+3,1,1)}}}
 // cấp 2: vòng sáng nước dưới chân (ít pixel, ít khung hình)
 if(lv>=2){const q=Math.floor(t*3)%3,c0=Pa.side?0:-6,rx=8+q*1.5,ry=2.4;
  for(let a=0;a<28;a++){const an=a/28*6.283,cx0=Math.round(Math.cos(an)*rx),cy0=Math.round(Math.sin(an)*ry);
   if(cy0<0&&Math.abs(cx0)<6)continue;                                       // phía sau bị chân che
   R(cy0>=0?'rgba(120,205,255,'+(.75-q*.15).toFixed(2)+')':'rgba(120,205,255,.35)',c0+cx0,29+cy0,1,1)}
  R('rgba(60,160,240,.3)',c0-6,30,12,1);
  const bs=[[-7,0],[6,1],[-3,2],[3,0]][q];R('rgba(230,250,255,.95)',c0+bs[0],27-bs[1],1,1);R('rgba(230,250,255,.8)',c0-bs[0],26+bs[1],1,1)}}

/* ===== Túi: bấm lại để cất + hiện số nguyên liệu ===== */
function hookBag(){
 const ap0=window.avPick;
 window.avPick=function(i){if(AVTAB=='a'){const x=avItems('a')[i];if(x&&x.idx>=0&&ACCS[x.idx]&&ACCS[x.idx].sc&&ST.av.a==x.idx){ST.av.a=-1;save();toast('Đã cất '+ACCS[x.idx].n);return bagUI()}}return ap0.apply(this,arguments)};
 const bg0=window.bagUI;
 window.bagUI=function(t){const r0=bg0.apply(this,arguments);try{fixOwn();if(AVTAB=='a'){const p=P(),g=document.querySelector('#ui .sg');
   if(g)g.insertAdjacentHTML('afterend','<div class="mut">⭐ Mảnh sao: <b>'+p.st+'</b> • ❄️ Mảnh tuyết: <b>'+p.sn+'</b> — dùng để ghép & nâng cấp Quyền trượng Thủy Thần ở Thái tử Ba Tư (Phố xá).'+(p.lv?'<br>🔱 Bấm vào Quyền trượng để trang bị, bấm lại để cất.':'')+'</div>')}}catch(e){}return r0}}

/* ===== gắn vào game ===== */
function prAct(a,h){const q=a.split(':');
 if(q[0]=='prince')return prince();
 if(q[0]=='dig')return dig(q[1],+q[2])}
const ca0=window.cvAct;
window.cvAct=function(a,h){if(typeof a=='string'&&a.startsWith('pr:'))return prAct(a.slice(3),h);return ca0.apply(this,arguments)};
// Phố: thêm trước lần dựng map đầu tiên (build() chỉ push thêm, không xóa)
{const D=window.CVMAPS&&CVMAPS.ps&&CVMAPS.ps.d;
 if(D){D.sp.push({by:PRY+5,d:drawPrince});
  D.hits.push([PRX-30,PRY-50,72,58,'👑 Thái tử Ba Tư — bấm để mua Thẻ cuốc, ghép & nâng cấp Quyền trượng','cv:pr:prince',PSTAND])}}
// chọn ô đứng cạnh điểm cuốc không bị chặn (thử vài hướng), tránh nhân vật đi không tới
const standAt=(M,p)=>{const bad=(x,y)=>{const tx=Math.floor(x/16),ty=Math.floor(y/16);return !(M.solid[ty]&&M.solid[ty][tx]===0)};
 for(const o of[[18,6],[-18,6],[0,14],[22,0],[-22,0],[0,-8],[14,12],[-14,12]])if(!bad(p.x+o[0],p.y+o[1])&&!bad(p.x+o[0],p.y+o[1]-8))return[p.x+o[0],p.y+o[1]];
 return[p.x,p.y+8]};
// Làng Tuyết & Làng Lễ hội
[['wt',WT,drawSnowman,'⛄ Người tuyết — bấm để cuốc Mảnh tuyết (cần Thẻ cuốc)'],['lh',LH,drawStar,'⭐ Ngôi sao lấp lánh — bấm để cuốc Mảnh sao (cần Thẻ cuốc)']].forEach(([key,M,fn,msg])=>{
 PTS[key].forEach((p,i)=>{M.sp.push({by:p.y+2,d:()=>fn(p)});M.hits.push([p.x-12,p.y-26,24,32,msg,'cv:pr:dig:'+key+':'+i,standAt(M,p)])})});
hookBag();
window.PERSO={art,buyCard,craft,upgrade,prince,PTS,UPG};
})();
