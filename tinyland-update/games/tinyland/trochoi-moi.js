/* ===================================================================================
   TROCHOI-MOI.JS — 🎮 TỦ MÁY TRÒ CHƠI MINI Ở CÔNG VIÊN (AX=880, AY=772)
   • Nâng máy lên rõ ràng phía trên biển chỉ đường SIGNP (không bị che, bấm mượt).
   • Bấm vào máy mở menu chọn 2 trò chơi mini — PHẢI BẤM XÁC NHẬN "BẮT ĐẦU CHƠI"
     mới vào ván (cả lúc mới mở lẫn khi chuyển qua lại giữa 2 trò):
     1) 🔨 Đập Chuột Chũi (30s):
        - Chuột nâu (+10), Chuột đội mũ (2 nhịp: bật mũ +5 rồi đập +25),
          Chuột vàng vương miện (+30), Bom (-15, mất combo).
        - Combo 3+ thưởng thêm điểm, 8s cuối "GIỜ VÀNG" tốc độ cao! Hỗ trợ phím 1-9.
     2) 🥥 Hứng Dừa Bãi Biển (45s):
        - Dừa xanh (+10), Dừa vàng (+25), Dừa hồng hồi tim (+1 ❤️ hoặc +20),
          né Bom (-1 ❤️, -10đ, 3 tim ❤️). Càng lâu rơi càng nhanh + Combo streak!
   • Cuối ván tự thưởng Xu theo điểm + lưu Kỷ lục cá nhân (localStorage).
   =================================================================================== */
(function(){
'use strict';

const AX=880,AY=772,AW=42,AH=56;
const UI_FONT="'Nunito','Be Vietnam Pro','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const HS_KEY='tl_arcade_hs_v1';

// ============================================================
//  1. SPRITE TỦ MÁY TRÒ CHƠI MINI NGOÀI MAP CÔNG VIÊN
// ============================================================
let CAB=null;
function buildArcadeCab(){
 if(CAB)return CAB;
 const img=mk(AW,AH,(g,r)=>{
  E(r,'rgba(0,0,0,0.22)',21,54,19,2);
  r('#2c354a',4,49,34,5);r('#475573',5,49,32,2);
  r('#45b39d',4,28,34,21);r('#73d9c5',5,28,5,21);r('#2d8775',33,28,4,21);
  r('#f78da7',3,25,36,5);r('#ffc4d4',4,25,34,2);
  r('#322940',8,22,1,3);r('#ff4757',7,20,3,2);
  r('#322940',15,22,1,3);r('#ffd23f',14,20,3,2);
  r('#48dbfb',23,26,3,2);r('#ff6b81',28,26,3,2);r('#ffd23f',33,26,2,2);
  r('#2c354a',11,33,20,13);r('#3d4966',12,34,18,11);
  r('#ffd23f',14,36,6,3);r('#ff9f43',22,36,6,3);
  r('#48dbfb',14,41,14,2);
  r('#45b39d',4,9,34,17);r('#73d9c5',5,9,4,17);r('#2d8775',33,9,4,17);
  r('#1a2238',7,11,28,13);r('#253152',8,12,26,11);
  r('#d44d72',3,2,36,8);
  for(let x=4,i=0;x<38;x+=4,i++)r(i%2?'#ffdf6b':'#ff85a8',x,2,4,2);
  r('#4a1c36',5,4,32,5);
  r('#ffe66d',10,5,22,3);r('#fff8c4',11,5,20,1);
  r('#ff7597',18,0,6,2);
 });
 CAB=outl(img);
 return CAB;
}

function drawArcadeCab(){
 if(typeof cx==='undefined'||!cx)return;
 const cam0=typeof camX!=='undefined'?camX:0,cam1=typeof camY!=='undefined'?camY:0;
 const vW=typeof vw!=='undefined'?vw:400,vH=typeof vh!=='undefined'?vh:300;
 if(AX<cam0-48||AX>cam0+vW+48||AY<cam1-24||AY>cam1+vH+72)return;
 const im=buildArcadeCab(),x0=Math.round(AX-AW/2)-1,y0=Math.round(AY-AH)-1;
 cx.drawImage(im,x0,y0);
 const tm=performance.now()/1000,f0=cx.fillStyle;
 const sx=x0+9,sy=y0+13;
 cx.fillStyle='#2a4073';cx.fillRect(sx,sy,26,11);
 const ph=Math.floor(tm*2.5)%4;
 cx.fillStyle='#6ed67a';cx.fillRect(sx+2,sy+8,10,3);
 cx.fillStyle='#b87842';cx.fillRect(sx+5,sy+(ph%2?5:7),4,ph%2?3:1);
 cx.fillStyle='#5ee0ff';cx.fillRect(sx+14,sy+1,10,9);
 cx.fillStyle='#69c75a';cx.fillRect(sx+17,sy+2+(ph*2),3,3);
 cx.fillStyle='#ffd23f';cx.fillRect(sx+16,sy+8,6,2);
 const blink=Math.floor(tm*2.2)%2;
 cx.fillStyle=blink?'#ffe66d':'#ff7aa8';cx.fillRect(x0+6,y0+5,3,3);
 cx.fillStyle=blink?'#ff7aa8':'#5ee0ff';cx.fillRect(x0+AW-7,y0+5,3,3);
 cx.fillStyle=f0;
}

function injectParkArcade(){
 if(typeof CV==='undefined'||!CV||!CV.built)return;
 if(!CV.__hasArcade){
  CV.__hasArcade=true;
  if(Array.isArray(CV.sp))CV.sp.push({by:AY+2,d:drawArcadeCab});
  if(Array.isArray(CV.hits))CV.hits.push([AX-22,AY-56,44,58,'🎮 Máy Trò Chơi Mini — Đập chuột chũi & Hứng dừa!','cv:arcade:open',[AX,AY+12]]);
  if(typeof SP!=='undefined'&&SP!==CV.sp&&Array.isArray(SP))SP.push({by:AY+2,d:drawArcadeCab});
  if(typeof hits!=='undefined'&&hits!==CV.hits&&Array.isArray(hits))hits.push([AX-22,AY-56,44,58,'🎮 Máy Trò Chơi Mini — Đập chuột chũi & Hứng dừa!','cv:arcade:open',[AX,AY+12]]);
 }
}

if(typeof window.cvSolid==='function'&&!window.cvSolid.__arcade){
 const s0=window.cvSolid;
 window.cvSolid=(x,y)=>(typeof MAP!=='undefined'&&MAP==='cv'&&x>=AX-18&&x<=AX+18&&y>=AY-14&&y<=AY)?true:s0(x,y);
 window.cvSolid.__arcade=1;
}
if(typeof window.cvSetup==='function'&&!window.cvSetup.__arcade){
 const cs0=window.cvSetup;
 window.cvSetup=function(){
  const r=cs0.apply(this,arguments);
  injectParkArcade();
  return r;
 };
 window.cvSetup.__arcade=1;
}
if(typeof window.cvAct==='function'&&!window.cvAct.__arcade){
 const ca0=window.cvAct;
 window.cvAct=function(a,h){
  if(a==='arcade:open'){openArcadeUI();return}
  return ca0.apply(this,arguments);
 };
 window.cvAct.__arcade=1;
}
if(typeof CV!=='undefined'&&CV&&CV.built)injectParkArcade();

// ============================================================
//  2. CSS & TRẠNG THÁI CHUNG CHO HỘP THOẠI TRÒ CHƠI MINI
// ============================================================
function injectCSS(){
 if(document.getElementById('arccss'))return;
 const st=document.createElement('style');st.id='arccss';
 st.textContent=`
#ui.arcui{width:min(96vw,486px);max-width:486px;max-height:92vh;font-family:${UI_FONT};font-weight:700;background:linear-gradient(180deg,#f5fffc 0%,#e6f7f4 100%);border:3px solid #2b8a78;box-shadow:0 12px 34px rgba(15,60,55,.45),inset 0 0 0 2px #fff;color:#1b453e}
#ui.arcui *{font-family:${UI_FONT}}
#ui.arcui .uh{background:linear-gradient(90deg,#1e6e60,#2da38e,#1e6e60);margin:-10px -12px 8px;padding:8px 12px;border-radius:10px 10px 0 0;color:#fffbe0;border-bottom:2px solid #ffd23f;font-size:15px;font-weight:800}
#ui.arcui .uh .b.x{background:#12473d;border-color:#ffd23f;color:#ffe694;font-weight:800}
.arc-tabs{display:flex;gap:6px;margin-bottom:8px}
.arc-tab{flex:1;padding:7px 8px;border-radius:10px;border:2px solid #7ec7b9;background:#fff;color:#1b594e;font-weight:800;font-size:13px;cursor:pointer;transition:all .12s}
.arc-tab.on{background:linear-gradient(180deg,#ffea7a,#ffc83d);border-color:#b87400;color:#522d00;box-shadow:0 2px 0 #b87400}
.arc-hud{display:flex;justify-content:space-between;align-items:center;gap:6px;background:#fff;border:1.5px solid #9bd4c9;border-radius:10px;padding:5px 10px;margin-bottom:7px;font-size:12.5px;font-weight:800}
.arc-hud b{color:#c94518}
.arc-stage{position:relative;border:3px solid #2b8a78;border-radius:12px;overflow:hidden;background:#dff7ff;box-shadow:inset 0 2px 8px rgba(0,0,0,.15);touch-action:none;user-select:none}
.arc-stage canvas{display:block;width:100%;height:auto;aspect-ratio:420/290;cursor:pointer}
.arc-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px}
.arc-btn{padding:8px 14px;border-radius:10px;border:2px solid #1e6e60;background:linear-gradient(180deg,#3bc7ae,#239983);color:#fff;font-weight:800;font-size:13.5px;cursor:pointer;box-shadow:0 3px 0 #145448;touch-action:manipulation}
.arc-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #145448}
.arc-btn.warn{border-color:#a85100;background:linear-gradient(180deg,#ffb830,#eb7e05);box-shadow:0 3px 0 #8a4200}
.arc-btn.go{border-color:#1c6b36;background:linear-gradient(180deg,#49d176,#23994c);box-shadow:0 3px 0 #145c2d}
.arc-move-wrap{display:flex;gap:8px}
.arc-mv{width:54px;height:38px;border-radius:10px;border:2px solid #2b8a78;background:#fff;color:#1b594e;font-weight:800;font-size:16px;cursor:pointer;box-shadow:0 2px 0 #2b8a78;touch-action:none;user-select:none}
.arc-mv:active{transform:translateY(2px);box-shadow:none;background:#d9f5ef}
.arc-tip{font-size:12px;color:#2c665b;font-weight:700;margin-top:6px;text-align:center}
`;
 document.head.appendChild(st);
}

const W=420,H=290;
let HS={mole:0,coco:0};
try{const raw=localStorage.getItem(HS_KEY);if(raw)HS=Object.assign(HS,JSON.parse(raw))}catch(e){}
function saveHS(){try{localStorage.setItem(HS_KEY,JSON.stringify(HS))}catch(e){}}

const G={
 open:false,tab:'mole',raf:0,last:0,
 // 'ready' (chờ xác nhận) | 'playing' (đang chơi) | 'ended' (xong ván)
 phase:'ready',running:false,ended:false,
 timeLeft:30,score:0,rewardXu:0,
 // Đập chuột chũi
 holes:[],combo:0,bestCombo:0,moleSpawnT:0,bonks:[],
 // Hứng dừa
 basketX:210,basketStretch:0,moveDir:0,items:[],cocoSpawnT:0,elapsed:0,lives:3,shake:0,
 // Chung
 popups:[],sparks:[]
};

function addPopup(x,y,txt,col){
 G.popups.push({x,y,txt,col,t:0,dur:0.8});
}
function addSparks(x,y,n,cols){
 for(let i=0;i<n;i++){
  const a=Math.random()*6.283,sp=35+Math.random()*95;
  G.sparks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-35,sz:2+Math.random()*2.5,c:cols[i%cols.length],t:0,dur:0.35+Math.random()*0.25});
 }
}
function awardRound(){
 const xu=G.score>0?Math.min(140,Math.max(5,Math.floor(G.score/5))):0;
 G.rewardXu=xu;
 if(G.rewardXu>0&&typeof ST!=='undefined'){
  ST.xu=(ST.xu||0)+G.rewardXu;
  if(typeof xuUp==='function')xuUp();
  if(typeof save==='function')save();
 }
 if(G.tab==='mole'&&G.score>HS.mole){HS.mole=G.score;saveHS()}
 if(G.tab==='coco'&&G.score>HS.coco){HS.coco=G.score;saveHS()}
 syncHUD();
}

// ============================================================
//  3. GAME 1: 🔨 ĐẬP CHUỘT CHŨI (3x3 HỐ • CHUỘT MŨ • GIỜ VÀNG • BOM)
// ============================================================
function resetMoleState(startNow){
 G.phase=startNow?'playing':'ready';
 G.running=!!startNow;G.ended=false;G.timeLeft=30;G.score=0;G.combo=0;G.bestCombo=0;G.rewardXu=0;
 G.moleSpawnT=0.22;G.bonks=[];G.popups=[];G.sparks=[];
 G.holes=[];
 const xs=[92,210,328],ys=[98,173,248];
 for(let r=0;r<3;r++)for(let c=0;c<3;c++){
  G.holes.push({x:xs[c],y:ys[r],kind:'',hp:1,stun:0,up:0,state:'idle',t:0,dur:0.9,hit:false});
 }
 syncHUD();
}

function spawnMole(){
 const free=G.holes.filter(h=>h.state==='idle');
 if(!free.length)return;
 const h=free[Math.floor(Math.random()*free.length)];
 const progress=1-(G.timeLeft/30);
 const fever=G.timeLeft<=8;
 const q=Math.random();
 const bombRate=(fever?0.15:0.17)+progress*0.06;
 if(q<bombRate){
  h.kind='bomb';h.hp=1;
 }else if(q<bombRate+(fever?0.24:0.16)){
  h.kind='gold';h.hp=1;
 }else if(q<bombRate+(fever?0.42:0.32)){
  h.kind='helmet';h.hp=2;
 }else{
  h.kind='brown';h.hp=1;
 }
 h.state='rise';h.up=0;h.t=0;h.hit=false;h.stun=0;
 h.dur=(h.kind==='gold'?0.58:h.kind==='helmet'?1.18:0.88)-progress*(fever?0.18:0.22);
 addSparks(h.x,h.y+2,4,['#784b26','#a87442']);
}

function hitHoleLogic(h,px,py){
 G.bonks.push({x:px,y:py,t:0,ok:!!h});
 if(!h){G.combo=0;syncHUD();return}
 if(h.kind==='bomb'){
  h.hit=true;h.state='drop';h.t=0;
  G.combo=0;G.score=Math.max(0,G.score-15);G.shake=0.3;
  addSparks(h.x,h.y-24,14,['#ff3b5c','#ffb830','#242630']);
  addPopup(h.x,h.y-36,'💥 -15','#ff3b5c');
  syncHUD();return;
 }
 if(h.hp>1){
  h.hp--;h.stun=0.25;h.t=Math.max(0,h.t-0.35);
  G.score+=5;G.combo++;if(G.combo>G.bestCombo)G.bestCombo=G.combo;
  addSparks(h.x,h.y-28,7,['#6ec2ff','#ffffff','#ffe866']);
  addPopup(h.x,h.y-42,'🪖 VỠ MŨ +5','#a8e8ff');
  syncHUD();return;
 }
 h.hit=true;h.state='drop';h.t=0;
 G.combo++;if(G.combo>G.bestCombo)G.bestCombo=G.combo;
 const base=h.kind==='gold'?30:h.kind==='helmet'?25:10;
 const bonus=G.combo>=6?10:G.combo>=3?5:0;
 const pts=base+bonus;
 G.score+=pts;
 addSparks(h.x,h.y-26,h.kind==='gold'?12:7,h.kind==='gold'?['#ffe866','#ffffff','#ff7aa8']:['#ffe866','#ffffff']);
 addPopup(h.x,h.y-38,(h.kind==='gold'?'🌟 +':'+')+pts+(bonus?' (x'+G.combo+')':''),h.kind==='gold'?'#ffe847':'#ffffff');
 syncHUD();
}

function tapMole(px,py){
 if(G.phase!=='playing')return;
 let hitHole=null;
 for(const h of G.holes){
  if(h.state==='idle'||h.hit||h.up<0.28)continue;
  if(Math.hypot(px-h.x,(py-(h.y-18*h.up))*0.9)<=38){hitHole=h;break}
 }
 hitHoleLogic(hitHole,px,py);
}

function tapHoleByIdx(idx){
 if(G.phase!=='playing'||idx<0||idx>=G.holes.length)return;
 const h=G.holes[idx];
 if(h.state==='idle'||h.hit||h.up<0.28){hitHoleLogic(null,h.x,h.y-10);return}
 hitHoleLogic(h,h.x,h.y-18*h.up);
}

function stepMole(dt){
 if(G.phase==='playing'){
  G.timeLeft=Math.max(0,G.timeLeft-dt);
  const fever=G.timeLeft<=8;
  G.moleSpawnT-=dt;
  if(G.moleSpawnT<=0){
   spawnMole();
   if((fever||G.timeLeft<18)&&Math.random()<(fever?0.52:0.32))spawnMole();
   const prog=1-(G.timeLeft/30);
   G.moleSpawnT=Math.max(fever?0.24:0.3,0.68-prog*0.32);
  }
  for(const h of G.holes){
   if(h.stun>0)h.stun=Math.max(0,h.stun-dt);
   if(h.state==='rise'){
    h.up=Math.min(1,h.up+dt*7.2);
    if(h.up>=1){h.state='hold';h.t=0}
   }else if(h.state==='hold'){
    h.t+=dt;
    if(h.t>=h.dur)h.state='drop';
   }else if(h.state==='drop'){
    h.up=Math.max(0,h.up-dt*(h.hit?9.8:5.8));
    if(h.up<=0){h.state='idle';h.kind=''}
   }
  }
  if(G.timeLeft<=0){G.phase='ended';G.running=false;G.ended=true;awardRound()}
 }
 for(let i=G.bonks.length-1;i>=0;i--){G.bonks[i].t+=dt;if(G.bonks[i].t>0.22)G.bonks.splice(i,1)}
}

function drawMoleScene(g,tm){
 const fever=G.phase==='playing'&&G.timeLeft<=8;
 const bg=g.createLinearGradient(0,0,0,H);
 bg.addColorStop(0,fever?'#ffcf9e':'#8ae3ff');
 bg.addColorStop(0.22,fever?'#ffeab5':'#d4f7c5');
 bg.addColorStop(0.24,'#7dd162');bg.addColorStop(1,'#4d9e3c');
 g.fillStyle=bg;g.fillRect(0,0,W,H);

 // Mây trôi nhẹ + hàng rào gỗ vườn sau lưng
 g.fillStyle='rgba(255,255,255,0.88)';
 const cd=(tm*8)%90;
 for(const cx0 of[65,205,345]){
  const x=(cx0+cd)%(W+40)-20;
  g.beginPath();g.arc(x,22,12,0,6.28);g.arc(x+13,20,14,0,6.28);g.arc(x+25,23,11,0,6.28);g.fill();
 }
 g.fillStyle='#c98a4a';g.fillRect(0,55,W,6);g.fillStyle='#965d28';g.fillRect(0,60,W,2);
 for(let x=8;x<W;x+=28){
  g.fillStyle='#a86d35';g.fillRect(x,46,12,20);
  g.fillStyle='#e0a86c';g.fillRect(x+1,46,4,19);
  g.fillStyle='#78481c';g.fillRect(x,64,12,2);
 }

 // Đám cỏ & hoa nhỏ
 g.fillStyle='#3b8a30';
 for(const[gx,gy]of[[24,96],[390,104],[30,185],[388,180],[28,255],[386,258],[152,132],[268,216]]){
  g.fillRect(gx,gy,2,5);g.fillRect(gx-3,gy+2,2,3);g.fillRect(gx+3,gy+2,2,3);
 }
 g.fillStyle='#ffe875';
 for(const[fx,fy]of[[36,126],[386,122],[40,224],[380,232],[152,130],[268,215]])g.fillRect(fx,fy,4,4);

 // 9 Hố đất & Chuột chũi / Bom
 for(let idx=0;idx<G.holes.length;idx++){
  const h=G.holes[idx];
  g.fillStyle='#633d1e';g.beginPath();g.ellipse(h.x,h.y,36,13,0,0,6.28);g.fill();
  g.fillStyle='#2e1808';g.beginPath();g.ellipse(h.x,h.y+1,30,9.5,0,0,6.28);g.fill();

  if(h.state!=='idle'&&h.up>0){
   g.save();
   g.beginPath();g.rect(h.x-38,h.y-72,76,74);g.clip();
   const shk=h.stun>0?Math.sin(tm*55)*2.5:0;
   const cy=h.y+18-h.up*36,hx=h.x+shk;
   if(h.kind==='bomb'){
    // Vòng hào quang đỏ cảnh báo bom
    const pulse=0.35+0.35*Math.sin(tm*14);
    g.fillStyle='rgba(255,50,80,'+pulse.toFixed(2)+')';
    g.beginPath();g.arc(hx,cy+6,22,0,6.28);g.fill();
    g.fillStyle='#242630';g.beginPath();g.arc(hx,cy+6,17,0,6.28);g.fill();
    g.fillStyle='#454a5c';g.beginPath();g.arc(hx-5,cy,5,0,6.28);g.fill();
    g.fillStyle='#5c6375';g.fillRect(hx-4,cy-13,8,4);
    g.strokeStyle='#ffd27a';g.lineWidth=2.4;g.beginPath();g.moveTo(hx,cy-13);g.quadraticCurveTo(hx+7,cy-21,hx+11,cy-17);g.stroke();
    g.fillStyle=Math.floor(tm*16)%2?'#ff3b5c':'#ffe866';g.beginPath();g.arc(hx+12,cy-17,4.2,0,6.28);g.fill();
    g.strokeStyle='#ff5268';g.lineWidth=2.6;g.lineCap='round';
    g.beginPath();g.moveTo(hx-5,cy+2);g.lineTo(hx+5,cy+12);g.moveTo(hx+5,cy+2);g.lineTo(hx-5,cy+12);g.stroke();
   }else{
    const gold=h.kind==='gold',helm=h.kind==='helmet';
    const col=gold?'#ffd23f':helm?'#8d6044':'#a86a3a';
    const hi=gold?'#fff49c':helm?'#bc8d6e':'#d49562';
    const dk=gold?'#b57b05':'#5e3518';
    g.fillStyle=col;g.beginPath();g.ellipse(hx,cy+8,19,22,0,0,6.28);g.fill();
    g.fillStyle=hi;g.beginPath();g.ellipse(hx-5,cy+2,7,10,0,0,6.28);g.fill();
    g.strokeStyle=dk;g.lineWidth=2;g.stroke();
    if(gold){
     g.fillStyle='#ff4f8b';g.beginPath();g.moveTo(hx-8,cy-12);g.lineTo(hx-6,cy-21);g.lineTo(hx,cy-15);g.lineTo(hx+6,cy-21);g.lineTo(hx+8,cy-12);g.closePath();g.fill();
     g.fillStyle='#fff6b0';g.fillRect(hx-1.5,cy-16,3,3);
    }else if(helm&&h.hp>1){
     // Mũ sắt xanh cứng 2 nhịp đập
     g.fillStyle='#3b95e8';g.beginPath();g.arc(hx,cy-7,16,Math.PI,0);g.fill();
     g.fillStyle='#8fd3ff';g.beginPath();g.arc(hx-5,cy-13,4.5,0,6.28);g.fill();
     g.fillStyle='#1f5ea6';g.fillRect(hx-18,cy-8,36,4);
    }else{
     g.fillStyle='#ffd23f';g.beginPath();g.arc(hx,cy-7,15,Math.PI,0);g.fill();
     g.fillStyle='#f0b216';g.fillRect(hx-17,cy-8,34,3);
    }
    g.fillStyle='#ff94ae';g.beginPath();g.ellipse(hx-10,cy+6,3.5,2,0,0,6.28);g.ellipse(hx+10,cy+6,3.5,2,0,0,6.28);g.fill();
    g.fillStyle='#24130a';
    if(h.hit){
     g.lineWidth=2;g.strokeStyle='#24130a';
     g.beginPath();g.moveTo(hx-9,cy+1);g.lineTo(hx-4,cy+4);g.moveTo(hx+9,cy+1);g.lineTo(hx+4,cy+4);g.stroke();
     // Sao choáng váng quay quay
     g.fillStyle='#ffe866';
     for(let s=0;s<3;s++){
      const a=tm*10+s*2.09;
      g.fillRect(hx+Math.cos(a)*14-2,cy-16+Math.sin(a)*4-2,4,4);
     }
    }else{
     g.beginPath();g.arc(hx-6.5,cy+2,2.4,0,6.28);g.arc(hx+6.5,cy+2,2.4,0,6.28);g.fill();
     g.fillStyle='#ffffff';g.beginPath();g.arc(hx-7.3,cy+1.2,0.9,0,6.28);g.arc(hx+5.7,cy+1.2,0.9,0,6.28);g.fill();
    }
    g.fillStyle='#ff7597';g.beginPath();g.ellipse(hx,cy+6,4.2,2.8,0,0,6.28);g.fill();
   }
   g.restore();
  }
  g.fillStyle='#784b26';g.beginPath();g.ellipse(h.x,h.y+6,35,6,0,0,Math.PI);g.fill();
  g.fillStyle='#4a9638';g.fillRect(h.x-28,h.y+8,6,3);g.fillRect(h.x+22,h.y+8,6,3);
  if(G.phase==='ready'){
   g.fillStyle='rgba(36,19,10,0.45)';g.font='800 10px '+UI_FONT;g.textAlign='center';
   g.fillText(String(idx+1),h.x,h.y+4);
  }
 }

 // Banner Giờ vàng 8s cuối
 if(fever){
  g.fillStyle='rgba(215,48,42,0.88)';g.fillRect(W/2-62,6,124,20);
  g.fillStyle='#fffbe0';g.font='800 11px '+UI_FONT;g.textAlign='center';
  g.fillText('⚡ GIỜ VÀNG TĂNG TỐC!',W/2,20);
 }

 // Búa đập
 for(const b of G.bonks){
  const p=b.t/0.22;
  g.save();g.translate(b.x,b.y);g.rotate(-0.9+p*1.1);
  g.fillStyle='#b8733c';g.fillRect(4,-4,18,5);
  g.fillStyle=b.ok?'#ff5268':'#d99c5a';g.fillRect(-10,-12,18,22);
  g.fillStyle='#ffe4b8';g.fillRect(-10,-12,18,4);
  g.restore();
 }
}

// ============================================================
//  4. GAME 2: 🥥 HỨNG DỪA BÃI BIỂN (DỪA HỒNG HỒI TIM • COMBO • CÀNG LÂU CÀNG NHANH)
// ============================================================
function resetCocoState(startNow){
 G.phase=startNow?'playing':'ready';
 G.running=!!startNow;G.ended=false;G.timeLeft=45;G.score=0;G.combo=0;G.bestCombo=0;G.rewardXu=0;
 G.basketX=W/2;G.basketStretch=0;G.moveDir=0;G.items=[];G.cocoSpawnT=0.35;G.elapsed=0;G.lives=3;G.shake=0;G.popups=[];G.sparks=[];
 syncHUD();
}

function spawnCocoItem(){
 const prog=Math.min(1,G.elapsed/42);
 const baseSpd=110+prog*170+Math.random()*32;
 const bombChance=0.16+prog*0.12;
 const r=Math.random();
 let kind='green';
 if(r<bombChance)kind='bomb';
 else if(r<bombChance+0.06)kind='heart';
 else if(r<bombChance+0.24)kind='gold';
 G.items.push({
  x:28+Math.random()*(W-56),
  y:-18,
  vy:baseSpd,
  vx:(Math.random()-0.5)*(12+prog*28),
  kind,
  rot:Math.random()*6.28,
  vr:(Math.random()-0.5)*3.6
 });
}

function stepCoco(dt){
 if(G.basketStretch>0)G.basketStretch=Math.max(0,G.basketStretch-dt*5.5);
 if(G.phase!=='playing')return;
 G.elapsed+=dt;
 G.timeLeft=Math.max(0,G.timeLeft-dt);
 if(G.moveDir!==0){
  G.basketX=Math.max(38,Math.min(W-38,G.basketX+G.moveDir*300*dt));
 }
 G.cocoSpawnT-=dt;
 if(G.cocoSpawnT<=0){
  spawnCocoItem();
  const prog=Math.min(1,G.elapsed/42);
  G.cocoSpawnT=Math.max(0.27,0.82-prog*0.51);
 }
 const catchY=H-36;
 for(let i=G.items.length-1;i>=0;i--){
  const it=G.items[i];
  it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=it.vr*dt;
  if(it.x<18){it.x=18;it.vx=Math.abs(it.vx)}
  if(it.x>W-18){it.x=W-18;it.vx=-Math.abs(it.vx)}
  if(it.y>=catchY-10&&it.y<=catchY+18&&Math.abs(it.x-G.basketX)<=35){
   G.items.splice(i,1);
   G.basketStretch=1;
   if(it.kind==='bomb'){
    G.lives=Math.max(0,G.lives-1);
    G.combo=0;
    G.score=Math.max(0,G.score-10);
    G.shake=0.35;
    addSparks(it.x,catchY-10,14,['#ff3b5c','#ffb830','#242630']);
    addPopup(it.x,catchY-18,'💥 BOM! -1 ❤️','#ff3b5c');
    syncHUD();
    if(G.lives<=0){G.phase='ended';G.running=false;G.ended=true;awardRound();return}
   }else if(it.kind==='heart'){
    if(G.lives<3){
     G.lives++;
     addPopup(it.x,catchY-18,'💖 HỒI +1 ❤️','#ff85b3');
    }else{
     G.score+=20;
     addPopup(it.x,catchY-18,'💖 +20','#ff85b3');
    }
    G.combo++;if(G.combo>G.bestCombo)G.bestCombo=G.combo;
    addSparks(it.x,catchY-10,10,['#ff85b3','#ffffff','#ffe866']);
    syncHUD();
   }else{
    G.combo++;if(G.combo>G.bestCombo)G.bestCombo=G.combo;
    const bonus=G.combo>=5?5:0;
    const pts=(it.kind==='gold'?25:10)+bonus;
    G.score+=pts;
    addSparks(it.x,catchY-10,it.kind==='gold'?10:5,it.kind==='gold'?['#ffe866','#ffffff']:['#8ef29e','#ffffff']);
    addPopup(it.x,catchY-18,(it.kind==='gold'?'🌟 +':'+')+pts+(bonus?' 🔥':''),it.kind==='gold'?'#ffe847':'#ffffff');
    syncHUD();
   }
   continue;
  }
  if(it.y>H+22){
   if(it.kind!=='bomb')G.combo=0;
   G.items.splice(i,1);
  }
 }
 if(G.timeLeft<=0){G.phase='ended';G.running=false;G.ended=true;awardRound()}
}

function drawCocoScene(g,tm){
 const bg=g.createLinearGradient(0,0,0,H);
 bg.addColorStop(0,'#5ec8ff');bg.addColorStop(0.54,'#b8ecff');bg.addColorStop(0.71,'#32a9cf');bg.addColorStop(0.81,'#ffe4a8');bg.addColorStop(1,'#f2c572');
 g.fillStyle=bg;g.fillRect(0,0,W,H);

 // Mây trôi & mặt trời
 g.fillStyle='#ffe866';g.beginPath();g.arc(365,36,20,0,6.28);g.fill();
 g.fillStyle='rgba(255,244,170,0.35)';g.beginPath();g.arc(365,36,27+Math.sin(tm*2)*2,0,6.28);g.fill();
 g.fillStyle='rgba(255,255,255,0.85)';
 const cx1=(40+tm*10)%(W+60)-30,cx2=(220+tm*6)%(W+60)-30;
 g.beginPath();g.arc(cx1,42,11,0,6.28);g.arc(cx1+12,40,13,0,6.28);g.arc(cx2,28,10,0,6.28);g.arc(cx2+10,27,11,0,6.28);g.fill();

 // Sóng biển lăn tăn + cua chạy ngang bãi cát
 g.fillStyle='rgba(255,255,255,0.38)';
 for(let x=0;x<W;x+=24){
  const wy=206+Math.sin(tm*2.5+x*0.05)*2;
  g.fillRect(x,wy,14,2);
 }
 const crabX=210+Math.sin(tm*0.75)*145;
 g.fillStyle='#e2574c';g.fillRect(crabX-5,H-14,10,6);g.fillStyle='#ff8c7a';g.fillRect(crabX-3,H-13,6,2);
 g.fillStyle='#1a1a1a';g.fillRect(crabX-3,H-16,2,2);g.fillRect(crabX+1,H-16,2,2);

 // Lá dừa đung đưa nhẹ 2 góc trên
 g.fillStyle='#3b9445';
 const sw=Math.sin(tm*2)*0.05;
 for(const s of[-1,1]){
  const bx=s<0?0:W;
  for(let k=0;k<4;k++){
   g.beginPath();g.ellipse(bx-s*18,16+k*9,32,7,(s<0?0.3:-0.3)+(k*0.18*s)+sw,0,6.28);g.fill();
  }
 }

 // Dừa & Bom đang rơi
 for(const it of G.items){
  g.save();g.translate(it.x,it.y);g.rotate(it.rot);
  if(it.kind==='bomb'){
   g.fillStyle='rgba(255,48,80,'+(0.25+0.22*Math.sin(tm*16)).toFixed(2)+')';
   g.beginPath();g.arc(0,2,16.5,0,6.28);g.fill();
   g.fillStyle='#1f232e';g.beginPath();g.arc(0,2,12.5,0,6.28);g.fill();
   g.fillStyle='#4a5166';g.beginPath();g.arc(-4,-3,3.5,0,6.28);g.fill();
   g.fillStyle='#676e85';g.fillRect(-3.5,-13,7,3);
   g.strokeStyle='#ffd27a';g.lineWidth=2;g.beginPath();g.moveTo(0,-13);g.quadraticCurveTo(5,-19,8,-16);g.stroke();
   g.fillStyle=Math.floor(tm*16)%2?'#ff3b5c':'#ffe866';g.beginPath();g.arc(9,-16,3.4,0,6.28);g.fill();
   g.strokeStyle='#ff4d68';g.lineWidth=2.2;g.beginPath();g.moveTo(-4,-2);g.lineTo(4,6);g.moveTo(4,-2);g.lineTo(-4,6);g.stroke();
  }else if(it.kind==='heart'){
   g.fillStyle='#ff5c93';g.beginPath();g.ellipse(0,1,11.5,13,0,0,6.28);g.fill();
   g.fillStyle='#ffb8d2';g.beginPath();g.ellipse(-3,-4,4,5,-0.3,0,6.28);g.fill();
   g.fillStyle='#fff';g.font='800 11px '+UI_FONT;g.textAlign='center';g.fillText('♥',0,5);
   g.fillStyle='#a82055';g.fillRect(-3,-13,6,3);
  }else{
   const gold=it.kind==='gold';
   g.fillStyle=gold?'#f5ab1d':'#439c3f';
   g.beginPath();g.ellipse(0,1,12,13.5,0,0,6.28);g.fill();
   g.fillStyle=gold?'#fff082':'#7de065';
   g.beginPath();g.ellipse(-3.5,-4,4.2,5.5,-0.3,0,6.28);g.fill();
   g.fillStyle=gold?'#9e6305':'#256322';g.fillRect(-3,-14,6,3);
  }
  g.restore();
 }

 // Rổ tre đan (nhún nảy khi vừa hứng!)
 const bx=G.basketX,by=H-30+Math.round(G.basketStretch*4);
 const sx=1+G.basketStretch*0.14,sy=1-G.basketStretch*0.1;
 g.save();g.translate(bx,by);g.scale(sx,sy);
 g.fillStyle='rgba(90,55,15,0.22)';g.beginPath();g.ellipse(0,16,34,5,0,0,6.28);g.fill();
 g.fillStyle='#c98642';
 g.beginPath();g.moveTo(-32,-8);g.lineTo(32,-8);g.lineTo(24,13);g.lineTo(-24,13);g.closePath();g.fill();
 g.strokeStyle='#784316';g.lineWidth=2.5;g.stroke();
 g.fillStyle='#eab26c';g.fillRect(-34,-11,68,5);
 g.strokeStyle='#784316';g.lineWidth=1.5;g.strokeRect(-34,-11,68,5);
 for(let x=-20;x<=20;x+=10){
  g.beginPath();g.moveTo(x,-6);g.lineTo(x*0.8,12);g.stroke();
 }
 g.restore();

 // Thanh tốc độ rơi
 const spdLevel=1+Math.floor(Math.min(4,G.elapsed/9));
 g.fillStyle='rgba(20,50,70,0.68)';g.fillRect(8,8,110,20);
 g.fillStyle='#ffe875';g.font='800 11px '+UI_FONT;g.textAlign='left';
 g.fillText('⚡ Tốc độ x'+spdLevel+(G.combo>=5?' 🔥x'+G.combo:''),15,22);
}

// ============================================================
//  5. MÀN HÌNH XÁC NHẬN CHƠI & KẾT THÚC VÁN
// ============================================================
function startActiveGame(){
 if(G.tab==='mole')resetMoleState(true);
 else resetCocoState(true);
}

function prepareGame(tab){
 G.tab=tab;
 if(tab==='mole')resetMoleState(false);
 else resetCocoState(false);
}

function syncHUD(){
 const sc=document.getElementById('arc-score');
 const tm=document.getElementById('arc-time');
 const ex=document.getElementById('arc-extra');
 const hs=document.getElementById('arc-hs');
 const btn=document.getElementById('arc-restart');
 if(sc)sc.textContent=G.score;
 if(tm)tm.textContent=Math.ceil(G.timeLeft)+'s';
 if(ex){
  ex.innerHTML=G.tab==='mole'
   ?('🔥 Combo: <b>'+G.combo+'</b>')
   :('❤️ Tim: <b>'+'❤️'.repeat(G.lives)+'🖤'.repeat(3-G.lives)+'</b>');
 }
 if(hs)hs.textContent=G.tab==='mole'?HS.mole:HS.coco;
 if(btn){
  if(G.phase==='ready'){
   btn.textContent='▶ Bắt đầu chơi';
   btn.className='arc-btn go';
  }else{
   btn.textContent='🔄 Chơi lại';
   btn.className='arc-btn warn';
  }
 }
}

const START_BTN={x:W/2-92,y:198,w:184,h:40};
function drawOverlayReady(g){
 g.fillStyle='rgba(12,35,34,0.74)';g.fillRect(0,0,W,H);
 g.fillStyle='rgba(255,255,255,0.12)';
 g.beginPath();g.roundRect?g.roundRect(24,22,W-48,H-44,14):g.fillRect(24,22,W-48,H-44);g.fill();
 g.fillStyle='#ffe866';g.font='800 20px '+UI_FONT;g.textAlign='center';
 g.fillText(G.tab==='mole'?'🔨 ĐẬP CHUỘT CHŨI':'🥥 HỨNG DỪA BÃI BIỂN',W/2,64);
 g.fillStyle='#ffffff';g.font='700 12.5px '+UI_FONT;
 if(G.tab==='mole'){
  g.fillText('• Chuột nâu +10 • Chuột đội mũ 2 nhịp (+5 & +25) • Vàng +30',W/2,98);
  g.fillText('• Tránh Bom (-15 điểm & mất Combo)! Phím 1–9 hoặc chạm hố',W/2,120);
  g.fillText('• Thời gian: 30 giây • 8 giây cuối tăng tốc Giờ Vàng!',W/2,142);
 }else{
  g.fillText('• Dừa xanh +10 • Dừa vàng +25 • Dừa hồng +1 ❤️',W/2,98);
  g.fillText('• Tránh Bom hải tặc (mất 1 ❤️)! Càng hứng lâu rơi càng nhanh',W/2,120);
  g.fillText('• Thời gian: 45 giây • Dùng tay kéo / chuột / phím ◀ ▶',W/2,142);
 }
 g.fillStyle='#9ef7c4';g.font='800 13px '+UI_FONT;
 g.fillText('🏆 Kỷ lục của bạn: '+(G.tab==='mole'?HS.mole:HS.coco)+' điểm',W/2,174);

 g.fillStyle='#23b859';g.beginPath();g.roundRect?g.roundRect(START_BTN.x,START_BTN.y+3,START_BTN.w,START_BTN.h,11):g.fillRect(START_BTN.x,START_BTN.y+3,START_BTN.w,START_BTN.h);g.fill();
 g.fillStyle='#4ce37d';g.beginPath();g.roundRect?g.roundRect(START_BTN.x,START_BTN.y,START_BTN.w,START_BTN.h,11):g.fillRect(START_BTN.x,START_BTN.y,START_BTN.w,START_BTN.h);g.fill();
 g.fillStyle='#0b3d1e';g.font='800 15px '+UI_FONT;
 g.fillText('▶ BẮT ĐẦU CHƠI',W/2,START_BTN.y+25);
}

function drawOverlayEnd(g){
 g.fillStyle='rgba(12,35,34,0.76)';g.fillRect(0,0,W,H);
 g.fillStyle='#ffffff';g.font='800 20px '+UI_FONT;g.textAlign='center';
 g.fillText(G.tab==='mole'?'🔨 HẾT GIỜ!':'🥥 KẾT THÚC LƯỢT HỨNG!',W/2,80);
 g.fillStyle='#ffe866';g.font='800 28px '+UI_FONT;
 g.fillText(G.score+' ĐIỂM',W/2,120);
 g.fillStyle='#bfe8ff';g.font='700 12.5px '+UI_FONT;
 g.fillText('🔥 Combo cao nhất: x'+G.bestCombo+'   •   🏆 Kỷ lục: '+(G.tab==='mole'?HS.mole:HS.coco),W/2,146);
 g.fillStyle='#8effb8';g.font='800 17px '+UI_FONT;
 g.fillText(G.rewardXu>0?('🪙 Thưởng +'+G.rewardXu+' Xu!'):'Cố lên nhé!',W/2,175);
 g.fillStyle='#d99500';g.beginPath();g.roundRect?g.roundRect(START_BTN.x,START_BTN.y+3,START_BTN.w,START_BTN.h,11):g.fillRect(START_BTN.x,START_BTN.y+3,START_BTN.w,START_BTN.h);g.fill();
 g.fillStyle='#ffd23f';g.beginPath();g.roundRect?g.roundRect(START_BTN.x,START_BTN.y,START_BTN.w,START_BTN.h,11):g.fillRect(START_BTN.x,START_BTN.y,START_BTN.w,START_BTN.h);g.fill();
 g.fillStyle='#4f2800';g.font='800 15px '+UI_FONT;
 g.fillText('🔄 CHƠI LẠI',W/2,START_BTN.y+25);
}

function loopArcade(now){
 if(!G.open){G.raf=0;return}
 const dt=Math.min(0.05,Math.max(0.001,(now-(G.last||now))/1000));
 G.last=now;
 if(G.shake>0)G.shake=Math.max(0,G.shake-dt);
 if(G.tab==='mole')stepMole(dt);
 else stepCoco(dt);
 for(let i=G.popups.length-1;i>=0;i--){
  const p=G.popups[i];p.t+=dt;p.y-=32*dt;
  if(p.t>=p.dur)G.popups.splice(i,1);
 }
 for(let i=G.sparks.length-1;i>=0;i--){
  const s=G.sparks[i];s.t+=dt;s.vy+=240*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
  if(s.t>=s.dur)G.sparks.splice(i,1);
 }

 const cv=document.getElementById('arc-cv');
 if(cv){
  const g=cv.getContext('2d'),tm=now/1000;
  g.save();
  if(G.shake>0)g.translate((Math.random()-0.5)*7,(Math.random()-0.5)*7);
  if(G.tab==='mole')drawMoleScene(g,tm);
  else drawCocoScene(g,tm);
  for(const s of G.sparks){
   g.globalAlpha=Math.max(0,1-s.t/s.dur);
   g.fillStyle=s.c;g.fillRect(Math.round(s.x),Math.round(s.y),s.sz,s.sz);
  }
  for(const p of G.popups){
   g.globalAlpha=Math.max(0,1-p.t/p.dur);
   g.font='800 14px '+UI_FONT;g.textAlign='center';
   g.fillStyle='#24130a';g.fillText(p.txt,p.x+1,p.y+1);
   g.fillStyle=p.col;g.fillText(p.txt,p.x,p.y);
  }
  g.globalAlpha=1;
  if(G.phase==='ready')drawOverlayReady(g);
  else if(G.phase==='ended')drawOverlayEnd(g);
  g.restore();
 }
 syncHUD();
 G.raf=requestAnimationFrame(loopArcade);
}

function stopArcade(){
 G.open=false;G.running=false;G.moveDir=0;
 if(G.raf){cancelAnimationFrame(G.raf);G.raf=0}
}

let keyBound=false;
function openArcadeUI(){
 injectCSS();
 if(typeof openUI!=='function')return;
 openUI(
  '<div class="uh"><span>🎮 Góc Trò Chơi Mini</span><button class="b x" onclick="closeUI()">✕</button></div>'+
  '<div class="arc-tabs">'+
   '<button id="arc-t-mole" class="arc-tab on" type="button">🔨 Đập Chuột Chũi</button>'+
   '<button id="arc-t-coco" class="arc-tab" type="button">🥥 Hứng Dừa</button>'+
  '</div>'+
  '<div class="arc-hud">'+
   '<span>⭐ Điểm: <b id="arc-score">0</b></span>'+
   '<span>⏱️ <b id="arc-time">30s</b></span>'+
   '<span id="arc-extra">🔥 Combo: <b>0</b></span>'+
   '<span>🏆 <b id="arc-hs">0</b></span>'+
  '</div>'+
  '<div class="arc-stage"><canvas id="arc-cv" width="420" height="290"></canvas></div>'+
  '<div class="arc-bar">'+
   '<button id="arc-restart" class="arc-btn go" type="button">▶ Bắt đầu chơi</button>'+
   '<div id="arc-mv" class="arc-move-wrap" style="display:none">'+
    '<button id="arc-l" class="arc-mv" type="button">◀</button>'+
    '<button id="arc-r" class="arc-mv" type="button">▶</button>'+
   '</div>'+
  '</div>'+
  '<div id="arc-tip" class="arc-tip">Bấm "Bắt đầu chơi" để xác nhận vào ván!</div>'
 );
 const ui=document.getElementById('ui');
 if(ui)ui.classList.add('arcui');

 const switchTab=tab=>{
  const tm=document.getElementById('arc-t-mole'),tc=document.getElementById('arc-t-coco');
  const mv=document.getElementById('arc-mv'),tip=document.getElementById('arc-tip');
  if(tm)tm.classList.toggle('on',tab==='mole');
  if(tc)tc.classList.toggle('on',tab==='coco');
  if(mv)mv.style.display=tab==='coco'?'flex':'none';
  if(tip)tip.textContent=tab==='mole'
   ?'Chạm chuột / phím 1–9! Chuột đội mũ đập 2 lần, tránh bom!'
   :'Kéo tay / di chuột hoặc bấm ◀ ▶ để hứng dừa, né Bom & nhặt Dừa hồng!';
  prepareGame(tab);
 };

 const tmBtn=document.getElementById('arc-t-mole');
 const tcBtn=document.getElementById('arc-t-coco');
 const rsBtn=document.getElementById('arc-restart');
 if(tmBtn)tmBtn.onclick=()=>switchTab('mole');
 if(tcBtn)tcBtn.onclick=()=>switchTab('coco');
 if(rsBtn)rsBtn.onclick=startActiveGame;

 const bindHold=(el,d)=>{
  if(!el)return;
  el.addEventListener('pointerdown',e=>{e.preventDefault();if(G.phase==='playing')G.moveDir=d});
  const off=()=>{if(G.moveDir===d)G.moveDir=0};
  el.addEventListener('pointerup',off);
  el.addEventListener('pointerleave',off);
  el.addEventListener('pointercancel',off);
 };
 bindHold(document.getElementById('arc-l'),-1);
 bindHold(document.getElementById('arc-r'),1);

 const cv=document.getElementById('arc-cv');
 if(cv){
  const toCanvasXY=e=>{
   const rc=cv.getBoundingClientRect();
   return[(e.clientX-rc.left)*W/rc.width,(e.clientY-rc.top)*H/rc.height];
  };
  let dragging=false;
  cv.addEventListener('pointerdown',e=>{
   e.preventDefault();
   const[px,py]=toCanvasXY(e);
   if(G.phase==='ready'||G.phase==='ended'){
    if(px>=START_BTN.x-10&&px<=START_BTN.x+START_BTN.w+10&&py>=START_BTN.y-8&&py<=START_BTN.y+START_BTN.h+8){
     startActiveGame();
    }
    return;
   }
   if(G.tab==='mole'){tapMole(px,py)}
   else{dragging=true;G.basketX=Math.max(38,Math.min(W-38,px))}
  });
  cv.addEventListener('pointermove',e=>{
   if(G.tab==='coco'&&G.phase==='playing'&&(dragging||e.pointerType==='mouse')){
    const[px]=toCanvasXY(e);
    G.basketX=Math.max(38,Math.min(W-38,px));
   }
  });
  const endD=()=>{dragging=false};
  cv.addEventListener('pointerup',endD);cv.addEventListener('pointercancel',endD);
 }

 if(!keyBound){
  keyBound=true;
  window.addEventListener('keydown',e=>{
   if(!G.open)return;
   if(G.phase!=='playing'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();startActiveGame();return}
   if(G.tab==='mole'&&G.phase==='playing'){
    const n=parseInt(e.key,10);
    if(n>=1&&n<=9){e.preventDefault();tapHoleByIdx(n-1)}
    return;
   }
   if(G.tab==='coco'&&G.phase==='playing'){
    if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){G.moveDir=-1;e.preventDefault()}
    else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){G.moveDir=1;e.preventDefault()}
   }
  });
  window.addEventListener('keyup',e=>{
   if(!G.open)return;
   if((e.key==='ArrowLeft'||e.key==='a'||e.key==='A')&&G.moveDir===-1)G.moveDir=0;
   else if((e.key==='ArrowRight'||e.key==='d'||e.key==='D')&&G.moveDir===1)G.moveDir=0;
  });
 }

 G.open=true;
 switchTab('mole');
 G.last=performance.now();
 if(!G.raf)G.raf=requestAnimationFrame(loopArcade);
}

if(typeof window.openUI==='function'&&!window.openUI.__arc){
 const o0=window.openUI;
 window.openUI=function(){stopArcade();const u=document.getElementById('ui');if(u)u.classList.remove('arcui');return o0.apply(this,arguments)};
 window.openUI.__arc=1;
}
if(typeof window.closeUI==='function'&&!window.closeUI.__arc){
 const c0=window.closeUI;
 window.closeUI=function(){stopArcade();const u=document.getElementById('ui');if(u)u.classList.remove('arcui');return c0.apply(this,arguments)};
 window.closeUI.__arc=1;
}

window.ARCADE={open:openArcadeUI,state:G,pos:{x:AX,y:AY}};
})();
