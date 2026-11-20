/* ===================================================================================
   NGAYDEM-GAPTHU.JS — 🌙 SÁNG / TỐI THỜI GIAN THỰC + 🧸 MÁY GẮP THÚ PHỐ XÁ
   1) Sáng / Tối thời gian thực (không hoàng hôn, nhẹ máy, tối vẫn sáng rõ để câu cá & làm việc):
      • Áp dụng: Nông trại (nt), Công viên (cv), Phố xá (ps), Biển (bn).
      • Ngày: 06:00 – 17:59 | Đêm: 18:00 – 05:59 (theo giờ thiết bị).
      • Test nhanh trong Console: tlDayNight('night' | 'day' | 'auto')
   2) Máy gắp thú bên phải Thái tử Ba Tư ở Phố xá (GX=640, GY=484):
      • Tủ kính lớn dài rộng (440x300) đòi hỏi ngắm chuẩn tâm quả cầu mới kẹp được.
      • 16 quả cầu có vật lý rơi/lăn/chồng đè thật: gắp quả dưới thì các quả trên tự sụt rơi xuống!
      • Bước 1: Kéo cần gạt ngắm chuẩn tâm quả cầu rồi bấm GẮP THÚ (20 Xu).
      • Bước 2: Sau khi kẹp được cầu, nút đổi thành THẢ THÚ — kéo cần về Ô THÚ bên trái rồi bấm THẢ (có tỉ lệ rớt giữa đường, nhưng ngắm chuẩn chơi lâu vẫn có lời).
      • Có nút Trộn thú (20 Xu) để thả đợt 16 quả cầu mới.
   =================================================================================== */
(function(){
'use strict';

// ============================================================
// 1. SÁNG / TỐI THỜI GIAN THỰC (nhẹ máy, tối thật nhưng sáng rõ đèn & biển hiệu)
// ============================================================
const NIGHT_MAPS=new Set(['nt','cv','ps','bn']);
let mode='auto';
window.tlDayNight=m=>{if(m==='day'||m==='night'||m==='auto')mode=m;return mode};
const isNight=()=>{
 if(mode==='night')return true;
 if(mode==='day')return false;
 const hr=new Date().getHours();
 return hr>=18||hr<6;
};

// Tạo sẵn sprite ánh sáng tròn 64x64 một lần duy nhất (không dùng shadowBlur nên không lag/nóng máy)
let GLOW=null;
function mkGlow(r,g,b){
 const c=document.createElement('canvas');c.width=c.height=64;
 const k=c.getContext('2d'),gr=k.createRadialGradient(32,32,2,32,32,32);
 gr.addColorStop(0,`rgba(${r},${g},${b},0.92)`);
 gr.addColorStop(0.28,`rgba(${r},${g},${b},0.52)`);
 gr.addColorStop(0.65,`rgba(${r},${g},${b},0.18)`);
 gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
 k.fillStyle=gr;k.fillRect(0,0,64,64);
 return c;
}
function getGlows(){
 if(GLOW)return GLOW;
 GLOW={
  warm:mkGlow(255,224,130),
  amber:mkGlow(255,186,68),
  cyan:mkGlow(72,236,255),
  pink:mkGlow(255,92,178),
  green:mkGlow(104,255,160),
  violet:mkGlow(196,132,255)
 };
 return GLOW;
}

const PS_LAMPS=[[440,266],[726,266],[1010,266],[1290,266],[1090,490],[1340,490]];
// [x0, w, Y, glowKey, hasAwningLights]
const PS_SIGNS=[
 [192,68,87,'green',1],[268,84,87,'pink',1],[360,72,67,'amber',0],[440,90,87,'cyan',1],
 [538,70,87,'pink',1],[616,90,87,'violet',1],[714,72,87,'amber',1],[794,76,87,'amber',1],[878,78,87,'cyan',1]
];
const PS_LC=['#ff5a8a','#ffd23f','#5ee0ff','#9cff7a','#ffa24a'];

const CV_LAMPS=[[676,900],[764,900],[676,810],[764,810],[684,300],[756,300],[684,520],[756,520],[1376,700],[560,700],[300,700],[100,700],[960,240],[430,240],[1280,240]];
const CV_BOARDS=[{x:968,y:132,w:244,h:76},{x:1068,y:586,w:244,h:76}];

const BN_BUOYS=[[560,300],[640,640],[900,860],[820,180],[1250,470],[1500,760],[1800,300],[2100,640],[2500,420],[2750,880]];

function drawNightLights(mp,tm,low){
 const G=getGlows();
 const cX=typeof camX!=='undefined'?camX:0,cY=typeof camY!=='undefined'?camY:0;
 const vW=typeof vw!=='undefined'?vw:400,vH=typeof vh!=='undefined'?vh:300;
 const vis=(x,y,r)=>x>=cX-r&&x<=cX+vW+r&&y>=cY-r&&y<=cY+vH+r;
 const stamp=(sp,x,y,r,a)=>{
  if(!vis(x,y,r))return;
  cx.globalAlpha=a;
  cx.drawImage(sp,Math.round(x-r),Math.round(y-r),r*2,r*2);
 };
 const streetLamp=(x,y,r,a)=>{
  const gy=y-46;
  if(!vis(x,gy,r+12))return;
  stamp(G.warm,x,gy,r,a);
  stamp(G.warm,x,gy,15,0.92);
  if(!low)stamp(G.warm,x,y-3,Math.round(r*0.72),0.2);
  cx.globalAlpha=0.92;cx.fillStyle='#fffbe0';cx.fillRect(x-4,y-49,8,5);
  cx.fillStyle='#ffffff';cx.fillRect(x-2,y-48,4,3);
 };

 cx.save();
 cx.globalCompositeOperation='lighter';

 if(mp==='ps'){
  // Đèn đường Phố xá
  for(const[lx,ly]of PS_LAMPS)streetLamp(lx,ly,48,0.88);
  // Biển hiệu các shop + Ngân hàng
  for(const[x0,w,Y,gk,awl]of PS_SIGNS){
   if(x0>cX+vW+50||x0+w<cX-50||Y>cY+vH+50||Y+45<cY-50)continue;
   const sp=G[gk]||G.amber,cy=Y+11;
   stamp(sp,x0+w*0.28,cy,40,0.68);
   stamp(sp,x0+w*0.72,cy,40,0.68);
   cx.globalAlpha=0.68;cx.fillStyle='#fff7d6';
   cx.fillRect(x0+2,Y,w-4,1);cx.fillRect(x0+2,Y+21,w-4,1);
   if(awl&&!low){
    const y=Y+36;
    for(let i=0,x=x0+2;x<x0+w-3;x+=7,i++){
     cx.globalAlpha=0.55+0.4*Math.abs(Math.sin(tm*2.6+i*1.3));
     cx.fillStyle=PS_LC[i%5];cx.fillRect(x,y,2,2);
    }
   }
  }
  // Cửa hiệu Trùm Kim Cương (biển ngang + biển dọc)
  stamp(G.cyan,344,407,44,0.8);stamp(G.cyan,400,407,44,0.8);stamp(G.cyan,440,432,34,0.75);
  if(vis(372,420,90)){
   cx.globalAlpha=0.55;cx.strokeStyle='#8af7ff';cx.lineWidth=1.5;cx.strokeRect(320,397,104,20);
  }
  // Sạp vé số
  stamp(G.amber,866,452,38,0.72);
  // Máy gắp thú
  stamp(G.pink,640,442,38,0.78);stamp(G.cyan,640,456,24,0.68);
  if(vis(640,454,36)){
   cx.globalAlpha=0.85;cx.fillStyle=Math.floor(tm*1.8)%2?'#ffe66d':'#ff9fb8';
   cx.fillRect(627,434,3,2);cx.fillRect(651,434,3,2);
  }
 }
 else if(mp==='cv'){
  // Đèn đường Công viên (sáng rõ hơn dọc lối đi)
  for(const[lx,ly]of CV_LAMPS)streetLamp(lx,ly,52,0.92);
  // 2 Biển quảng cáo điện tử LED
  for(const B of CV_BOARDS){
   if(B.x>cX+vW+70||B.x+B.w<cX-70||B.y>cY+vH+70||B.y+B.h<cY-70)continue;
   const cy=B.y+B.h*0.44;
   stamp(G.cyan,B.x+46,cy,56,0.62);stamp(G.warm,B.x+B.w*0.5,cy,58,0.65);stamp(G.amber,B.x+B.w-46,cy,56,0.62);
   cx.globalAlpha=0.22;cx.fillStyle='#c8f5ff';cx.fillRect(B.x+7,B.y+7,B.w-14,B.h-24);
   if(!low){
    for(let k=0;k<B.w;k+=8){
     cx.globalAlpha=0.88;cx.fillStyle=((k/8|0)+Math.floor(tm*3))%2?'#ffe67a':'#ff7a8a';
     cx.fillRect(B.x+k+2,B.y+1,3,3);
    }
   }
  }
  // Tiệm Mô Hình / Tí Nị (X0=100, Y0=700, SX=200, SB=824)
  if(vis(200,762,160)){
   stamp(G.amber,142,713,44,0.82);stamp(G.pink,200,713,48,0.85);stamp(G.amber,258,713,44,0.82);
   stamp(G.pink,103,774,34,0.72);stamp(G.pink,297,774,34,0.72);
   stamp(G.warm,160,774,44,0.72);stamp(G.cyan,236,784,42,0.78);stamp(G.green,236,749,22,0.68);
   cx.globalAlpha=0.75;cx.fillStyle='#ff5fb6';cx.fillRect(102,730,2,88);cx.fillRect(296,730,2,88);
   cx.fillStyle='#5eeeff';cx.fillRect(216,758,2,62);cx.fillRect(254,758,2,62);cx.fillRect(216,758,40,2);
   if(!low){
    for(let i=0;i<20;i++){
     const x=110+i*9.5,y=742+Math.sin(i*0.9)*1.5;
     cx.globalAlpha=(i+Math.floor(tm*3))%3===0?0.95:0.45;
     cx.fillStyle=['#ff5fa8','#ffd34a','#5ae0ff'][i%3];cx.fillRect(Math.round(x),Math.round(y),2,2);
    }
   }
  }
 }
 else if(mp==='bn'){
  // 10 Phao đèn biển trôi ngoài biển — tự bật sáng rực rỡ
  for(const[bx,by]of BN_BUOYS){
   const bob=Math.sin(tm*1.7+bx*0.013)*1.5,ly=Math.round(by-12+bob);
   if(!vis(bx,ly,54))continue;
   stamp(G.amber,bx,ly,46,0.88);
   stamp(G.warm,bx,ly,18,0.95);
   if(!low)stamp(G.amber,bx,by+4,26,0.34);
   cx.globalAlpha=0.95;cx.fillStyle='#ffe875';cx.fillRect(bx-3,ly-4,4,8);
   cx.fillStyle='#ffffff';cx.fillRect(bx-2,ly-3,2,5);
  }
  // Biển hiệu neon Shop Quái Vật (X0=10, Y0=268)
  if(vis(96,296,150)){
   stamp(G.cyan,62,287,44,0.84);stamp(G.pink,124,287,46,0.86);stamp(G.amber,96,312,42,0.58);
   cx.globalAlpha=0.55;cx.strokeStyle='#5ff7ff';cx.lineWidth=1.5;cx.strokeRect(21.5,275.5,150,23);
   if(!low){
    const ph=Math.floor(tm*9);
    for(let x=0,i=0;x<156;x+=8,i++){
     if((i+ph)%4!==0)continue;
     cx.globalAlpha=0.92;cx.fillStyle='#fff6b0';
     cx.fillRect(18+x,272,2,2);cx.fillRect(18+x,299,2,2);
    }
    for(let x=16,k=0;x<182;x+=14,k++){
     cx.globalAlpha=0.82;cx.fillStyle=['#ff5a8a','#ffd23f','#5ee0ff','#9cff7a'][k%4];
     cx.fillRect(x-1,339,3,3);
    }
   }
  }
 }
 else if(mp==='nt'){
  // Đèn & cây thông noel / neon người chơi tự đặt ngoài nông trại (ST.fm.p)
  const placed=typeof ST!=='undefined'&&ST&&ST.fm&&Array.isArray(ST.fm.p)?ST.fm.p:null;
  if(placed){
   for(const item of placed){
    if(!item||item.length<4)continue;
    const id=item[1],tx=item[2],ty=item[3],cx0=tx*16+8,cy0=ty*16;
    if(id==='farmlamp'){
     stamp(G.warm,cx0,cy0-14,48,0.9);stamp(G.warm,cx0,cy0-14,16,0.92);
     cx.globalAlpha=0.92;cx.fillStyle='#fffbe0';cx.fillRect(tx*16+1,cy0-16,3,3);cx.fillRect(tx*16+12,cy0-16,3,3);
    }else if(id==='denlong'){
     stamp(G.amber,cx0+1,cy0-16,42,0.88);stamp(G.warm,cx0+1,cy0-16,14,0.88);
     cx.globalAlpha=0.92;cx.fillStyle='#ffe27a';cx.fillRect(cx0-1,cy0-18,4,5);
    }else if(id==='xlamp'){
     stamp(G.warm,cx0,cy0-32,50,0.92);stamp(G.warm,cx0,cy0-32,16,0.92);
     cx.globalAlpha=0.95;cx.fillStyle='#fffbe0';cx.fillRect(cx0-2,cy0-35,4,5);
    }else if(id==='noel'){
     stamp(G.warm,cx0,cy0-26,42,0.75);stamp(G.amber,cx0,cy0-52,22,0.85);
     if(!low&&vis(cx0,cy0-26,42)){
      const nc=['#ff5964','#ffe66d','#48dbfb','#ff7eb9','#7bed9f'];
      for(let k=0;k<6;k++){
       cx.globalAlpha=0.55+0.45*Math.sin(tm*4+k*1.7);
       cx.fillStyle=nc[k%5];cx.fillRect(cx0-7+(k%3)*6,cy0-40+(k>>1)*10,2,2);
      }
      cx.globalAlpha=0.95;cx.fillStyle='#fff6a8';cx.fillRect(cx0-1,cy0-54,3,3);
     }
    }else if(id==='xtree'){
     stamp(G.cyan,cx0-4,cy0-26,40,0.78);stamp(G.pink,cx0+4,cy0-26,40,0.78);
     if(!low&&vis(cx0,cy0-26,40)){
      const nc=['#48dbfb','#ff6b9d','#ffe66d'];
      for(let k=0;k<5;k++){
       cx.globalAlpha=0.55+0.45*Math.cos(tm*4.5+k*1.5);
       cx.fillStyle=nc[k%3];cx.fillRect(cx0-6+(k%3)*5,cy0-38+(k>>1)*10,2,2);
      }
     }
    }else if(id==='xwreath'){
     stamp(G.warm,cx0,cy0-12,28,0.7);
    }else if(id==='tetlong'){
     stamp(G.amber,tx*16+16,cy0-14,38,0.82);stamp(G.amber,tx*16+48,cy0-14,38,0.82);
     if(vis(tx*16+32,cy0-14,45)){
      cx.globalAlpha=0.9;cx.fillStyle='#ffcf54';
      for(let k=0;k<4;k++)cx.fillRect(tx*16+6+k*16,cy0-16,4,5);
     }
    }else if(id==='tetcong'||id==='caytreoco'||id==='bienhieu'){
     stamp(G.warm,cx0,cy0-16,34,0.62);
    }
   }
  }
  // Đèn gian hàng online ("đèn onl"), bảng nhiệm vụ, cửa sổ nhà chính, đèn thuyền thương lái
  stamp(G.amber,460,298,44,0.82);stamp(G.cyan,460,290,28,0.55);
  if(vis(460,296,48)){
   cx.globalAlpha=0.88;
   for(let x=440;x<=480;x+=8){cx.fillStyle=((x>>3)+Math.floor(tm*3))%2?'#ffe66d':'#5ee0ff';cx.fillRect(x,282,2,2)}
  }
  stamp(G.warm,516,300,30,0.62);
  stamp(G.warm,526,224,30,0.62);stamp(G.warm,586,224,30,0.62);
  stamp(G.amber,456,725,36,0.74);
 }
 cx.restore();
}

if(typeof window.drawNames==='function'&&!window.drawNames.__nd){
 const oldNames=window.drawNames;
 window.drawNames=function(tm){
  const mp=typeof MAP!=='undefined'?MAP:'';
  if(NIGHT_MAPS.has(mp)&&isNight()&&typeof cx!=='undefined'&&cx){
   cx.save();
   cx.setTransform(typeof dpr!=='undefined'?dpr:1,0,0,typeof dpr!=='undefined'?dpr:1,0,0);
   cx.fillStyle=mp==='bn'?'rgba(4,10,34,0.48)':'rgba(4,9,30,0.56)';
   cx.fillRect(0,0,innerWidth,innerHeight);
   cx.restore();
   drawNightLights(mp,tm||performance.now()/1000,!!(window.lowfxOn&&window.lowfxOn()));
  }
  return oldNames.apply(this,arguments);
 };
 window.drawNames.__nd=1;
}

// ============================================================
// 2. SPRITE MÁY GẮP THÚ NGOÀI MAP PHỐ XÁ (GX=640, GY=484)
// ============================================================
const GX=640,GY=484,CW=36,CH=54;
let CAB=null;
function buildCab(){
 if(CAB)return CAB;
 const img=mk(CW,CH,(g,r)=>{
  E(r,'rgba(0,0,0,.2)',18,52,15,2);
  r('#f2849e',3,32,30,19);r('#f9a8bc',3,32,4,19);r('#d45c7a',29,32,4,19);r('#b84463',3,50,30,2);r('#ffd6e2',3,31,30,2);
  r('#8d5b76',4,32,28,3);r('#3d3448',10,29,1,3);r('#ff4757',9,27,3,2);r('#48dbfb',16,31,2,2);r('#ffd23f',20,31,2,2);
  r('#32233d',7,40,12,9);r('#4c385c',8,41,10,2);r('#ffd6e2',7,49,12,1);
  r('#32233d',23,39,6,5);r('#ffd23f',25,40,2,3);r('#fff6b0',25,40,1,1);
  r('#cfeeff',4,11,28,20);r('#e8f8ff',5,12,26,18);
  r('#f2849e',3,11,2,20);r('#d45c7a',31,11,2,20);
  r('#ffffff',7,14,2,10);r('#ffffff',10,13,1,6);
  r('#ffc6d6',5,27,26,3);
  r('#a66e38',7,24,5,4);r('#a66e38',7,23,2,1);r('#a66e38',10,23,2,1);r('#2d1e2f',8,25,1,1);r('#2d1e2f',10,25,1,1);
  r('#ffd94a',13,24,5,4);r('#ff9f43',15,26,2,1);r('#2d1e2f',14,25,1,1);r('#2d1e2f',16,25,1,1);
  r('#b274f8',19,24,5,4);r('#ffffff',21,25,1,2);
  r('#ff5c77',25,25,4,4);r('#ffffff',25,25,4,2);r('#ffd23f',26,26,2,1);
  r('#b84463',2,4,32,7);
  for(let x=2,i=0;x<34;x+=4,i++)r(i%2?'#fff2f6':'#ff7597',x,4,4,6);
  r('#d45c7a',2,10,32,2);r('#ffd23f',15,1,6,3);r('#fff5a8',16,0,4,1);
 });
 CAB=outl(img);
 return CAB;
}

function drawClawMachine(){
 if(typeof cx==='undefined'||!cx)return;
 const cam0=typeof camX!=='undefined'?camX:0,cam1=typeof camY!=='undefined'?camY:0,vW=typeof vw!=='undefined'?vw:400,vH=typeof vh!=='undefined'?vh:300;
 if(GX<cam0-40||GX>cam0+vW+40||GY<cam1-20||GY>cam1+vH+70)return;
 const im=buildCab(),x0=Math.round(GX-CW/2)-1,y0=Math.round(GY-CH)-1;
 cx.drawImage(im,x0,y0);
 const tm=performance.now()/1000,f0=cx.fillStyle;
 const clawX=Math.round(GX+Math.sin(tm*1.05)*7),clawY=y0+13;
 cx.fillStyle='#8c9aa8';cx.fillRect(clawX-2,clawY,4,2);
 cx.fillStyle='#6b7684';cx.fillRect(clawX,clawY+2,1,4);
 cx.fillStyle='#b8c4d0';cx.fillRect(clawX-2,clawY+6,5,1);cx.fillRect(clawX-2,clawY+7,1,2);cx.fillRect(clawX+2,clawY+7,1,2);
 const blink=Math.floor(tm*1.8)%2;
 cx.fillStyle=blink?'#ffe66d':'#ff9fb8';cx.fillRect(x0+6,y0+5,2,2);
 cx.fillStyle=blink?'#ff9fb8':'#ffe66d';cx.fillRect(x0+CW-6,y0+5,2,2);
 if(isNight()){cx.fillStyle='rgba(255,235,245,0.14)';cx.fillRect(x0+6,y0+13,26,18)}
 cx.fillStyle=f0;
}

if(typeof window.cvSolid==='function'&&!window.cvSolid.__claw){
 const s0=window.cvSolid;
 window.cvSolid=(x,y)=>(typeof MAP!=='undefined'&&MAP==='ps'&&x>=GX-14&&x<=GX+14&&y>=GY-12&&y<=GY)?true:s0(x,y);
 window.cvSolid.__claw=1;
}

// ============================================================
// 3. MINI-GAME MÁY GẮP THÚ (TỦ KÍNH DÀI 440x300 • VẬT LÝ BÓNG RƠI • NGẮM CHUẨN)
// ============================================================
const W=440,H=300;
const COST=20,MIX_COST=20,TRAY_N=16;
const BALL_R=14;
const PIT_L=84,PIT_R=430,PIT_B=286,CHUTE_MAX_X=72,RAIL_Y=48;
const UI_FONT="'Nunito','Be Vietnam Pro','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

const REWARDS={
 brown:{name:'Thú Nâu',xu:20,col:'#b8733c',hi:'#e3a772',dk:'#683a16',ear:'#945524',cap1:'#e09f67',cap2:'#a35d28',capDk:'#5e3212'},
 gold:{name:'Thú Vàng',xu:50,col:'#f8bc24',hi:'#fff08a',dk:'#9e6305',ear:'#e0980d',cap1:'#ffe066',cap2:'#e09812',capDk:'#8f5804'},
 red:{name:'Thú Đỏ Siêu Hiếm',xu:200,col:'#eb3b52',hi:'#ff94a3',dk:'#8c1224',ear:'#c42138',cap1:'#ff7a8d',cap2:'#cf233c',capDk:'#750d1d'}
};

function injectCSS(){
 if(document.getElementById('clwcss'))return;
 const st=document.createElement('style');st.id='clwcss';
 st.textContent=`
#ui.clwui{width:min(96vw,540px);max-width:540px;max-height:92vh;font-family:${UI_FONT};font-weight:700;background:linear-gradient(180deg,#fff3f8 0%,#ffe4ef 100%);border:3px solid #d45c7a;box-shadow:0 12px 34px rgba(70,18,45,.48),inset 0 0 0 2px #fff;color:#4a2035}
#ui.clwui *{font-family:${UI_FONT}}
#ui.clwui .uh{background:linear-gradient(90deg,#6e2654,#9c3670,#6e2654);margin:-10px -12px 8px;padding:8px 12px;border-radius:10px 10px 0 0;color:#fff6d6;border-bottom:2px solid #ffd23f;font-size:15px;font-weight:800}
#ui.clwui .uh .b.x{background:#471435;border-color:#ffd23f;color:#ffe694;font-weight:800}
.clw-top{display:flex;justify-content:space-between;align-items:center;gap:6px;background:#fff;border:1.5px solid #f2b8cb;border-radius:10px;padding:5px 10px;margin-bottom:7px;font-size:12.5px;font-weight:700}
.clw-top b{color:#b52b5c;font-weight:800}
.clw-stage{position:relative;background:#fff;border:3px solid #d45c7a;border-radius:12px;overflow:hidden;box-shadow:inset 0 2px 10px rgba(150,40,80,.18)}
.clw-stage canvas{display:block;width:100%;height:auto;aspect-ratio:440/300;image-rendering:auto}
.clw-msg{min-height:32px;display:flex;align-items:center;justify-content:center;text-align:center;margin:7px 0;padding:4px 10px;border-radius:8px;background:#fff8fb;border:1.5px dashed #e799b2;font-size:12.5px;font-weight:800;line-height:1.35;color:#612442}
.clw-msg.win{background:#fff8db;border-color:#f2b705;color:#8a5300}
.clw-msg.jackpot{background:linear-gradient(90deg,#ffe0e6,#fff2cc,#ffe0e6);border:2px solid #e83b4f;color:#a80e28}
.clw-ctrl{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:6px;background:linear-gradient(180deg,#ffdbe8,#ffc4da);border:2px solid #d45c7a;border-radius:12px;padding:8px 12px}
.clw-joy-wrap{display:flex;align-items:center;gap:7px;user-select:none}
.clw-nudge{width:38px;height:40px;border-radius:10px;border:2px solid #b54566;background:#fff5f8;color:#7d2143;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 2px 0 #b54566;touch-action:none}
.clw-nudge:active,.clw-nudge.on{transform:translateY(2px);box-shadow:none;background:#ffd4e4}
.clw-joy{position:relative;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#52465c,#271d30);border:2px solid #96415f;cursor:grab;touch-action:none;flex:none}
.clw-stick{position:absolute;left:50%;top:50%;width:8px;height:24px;margin-left:-4px;margin-top:-22px;background:linear-gradient(90deg,#d8e0ea,#8f9aa8);border-radius:4px;transform-origin:50% 90%;transition:transform .06s linear;pointer-events:none}
.clw-knob{position:absolute;left:-6px;top:-11px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 32% 28%,#ff8ca1,#e62246 65%,#9e0e29);border:1.5px solid #590a1b;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.clw-drop{flex:1;height:46px;border-radius:11px;border:2px solid #9e1b32;background:linear-gradient(180deg,#ff5e78,#e02246);color:#fff;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 3px 0 #8a1328;text-shadow:0 1px 1px rgba(0,0,0,.25);touch-action:manipulation}
.clw-drop.release-mode{border-color:#1f6e3d;background:linear-gradient(180deg,#38c96b,#229e4f);box-shadow:0 3px 0 #165c30}
.clw-drop.release-ready{border-color:#b87300;background:linear-gradient(180deg,#ffb830,#eb8705);box-shadow:0 3px 0 #8f5100;animation:clwPulse .7s infinite alternate}
@keyframes clwPulse{from{transform:scale(1)}to{transform:scale(1.02)}}
.clw-drop:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 #8a1328}
.clw-drop:disabled{opacity:.6;cursor:not-allowed}
.clw-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:7px;font-size:12px;font-weight:700;color:#7a3e58}
.clw-refill{padding:5px 10px;border-radius:8px;border:1.5px solid #c96484;background:#fff;color:#7d2143;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap}
.clw-refill:hover:not(:disabled){background:#fff0f5}
.clw-refill:disabled{opacity:.5;cursor:not-allowed}
`;
 document.head.appendChild(st);
}

const S={
 open:false,raf:0,last:0,
 balls:[],
 clawX:256,clawY:RAIL_Y,grip:1,
 dir:0,
 phase:'idle',                                          // idle | drop | grab | lift | carry | release | slip | reveal
 t:0,
 caught:null,
 willSlip:false,
 slipAt:'carry',                                        // 'lift' | 'carry'
 slipY:140,
 slipX:150,
 dropBall:null,
 reveal:null,
 fx:[],
 msg:'Kéo cần ngắm chuẩn tâm quả cầu rồi bấm GẮP THÚ (20 Xu)!',
 msgCls:'',
 totalCatch:0,
 failStreak:0
};

// Vật lý quả cầu 2D (trọng lực, va chạm thành hố, đè chồng & sụt xuống khi lấy quả bên dưới!)
function stepPhysics(dt,iters){
 const n=S.balls.length;if(!n)return;
 const sub=iters||2,sdt=dt/sub;
 const G=560,minD=BALL_R*2-0.3;
 const skipB=S.dropBall&&S.dropBall.target;
 for(let s=0;s<sub;s++){
  for(let i=0;i<n;i++){
   const b=S.balls[i];
   if(b===S.caught||b===skipB)continue;
   b.vy+=G*sdt;
   b.vx*=0.992;
   b.vy*=0.996;
   b.x+=b.vx*sdt;
   b.y+=b.vy*sdt;
   b.rot+=(b.vx*sdt)/BALL_R;
   if(b.x<PIT_L+BALL_R){b.x=PIT_L+BALL_R;if(b.vx<0)b.vx*=-0.35}
   if(b.x>PIT_R-BALL_R){b.x=PIT_R-BALL_R;if(b.vx>0)b.vx*=-0.35}
   if(b.y>PIT_B-BALL_R){
    b.y=PIT_B-BALL_R;
    if(b.vy>35)b.vy*=-0.22;else b.vy=0;
    b.vx*=0.86;
    if(Math.abs(b.vx)<2)b.vx=0;
   }
  }
  // Giải va chạm giữa các quả cầu (2 vòng mỗi sub-step để xếp chồng chắc chắn không lún)
  for(let p=0;p<2;p++){
   for(let i=0;i<n;i++){
    const a=S.balls[i];if(a===S.caught||a===skipB)continue;
    for(let j=i+1;j<n;j++){
     const b=S.balls[j];if(b===S.caught||b===skipB)continue;
     let dx=b.x-a.x,dy=b.y-a.y;
     let d=Math.hypot(dx,dy);
     if(d<minD){
      if(d<0.01){dx=(Math.random()-.5)||0.2;dy=-1;d=Math.hypot(dx,dy)}
      const nx=dx/d,ny=dy/d,ov=(minD-d)*0.5;
      a.x-=nx*ov;a.y-=ny*ov;b.x+=nx*ov;b.y+=ny*ov;
      const rvx=b.vx-a.vx,rvy=b.vy-a.vy,vn=rvx*nx+rvy*ny;
      if(vn<0){
       const imp=-0.56*vn;
       a.vx-=imp*nx;a.vy-=imp*ny;
       b.vx+=imp*nx;b.vy+=imp*ny;
       // trượt nhẹ theo tiếp tuyến giúp quả trên tự lăn vào khe hở bên dưới
       const tx=-ny,ty=nx,vt=rvx*tx+rvy*ty;
       a.vx+=vt*0.08*tx;b.vx-=vt*0.08*tx;
      }
      // giữ trong thành hố sau đẩy
      if(a.x<PIT_L+BALL_R)a.x=PIT_L+BALL_R;if(a.x>PIT_R-BALL_R)a.x=PIT_R-BALL_R;
      if(b.x<PIT_L+BALL_R)b.x=PIT_L+BALL_R;if(b.x>PIT_R-BALL_R)b.x=PIT_R-BALL_R;
      if(a.y>PIT_B-BALL_R)a.y=PIT_B-BALL_R;if(b.y>PIT_B-BALL_R)b.y=PIT_B-BALL_R;
     }
    }
   }
  }
 }
}

function makeTray(animate){
 // 16 quả cầu: 7 Thú Nâu (20 Xu), 6 Thú Vàng (50 Xu), 3 Quả ? (Nâu 20 / Vàng 50 / Đỏ 200 Xu)
 const list=[
  'brown','brown','brown','brown','brown','brown','brown',
  'gold','gold','gold','gold','gold','gold',
  'mystery','mystery','mystery'
 ];
 for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}
 S.balls=list.map((kind,idx)=>{
  const col=idx%8,row=(idx/8)|0;
  const x=PIT_L+24+col*42+(row%2?14:-6)+(Math.random()*10-5);
  const y=(animate?78:198)+row*38+(Math.random()*14-7);
  return{
   id:Math.random().toString(36).slice(2),
   kind,
   x:Math.max(PIT_L+BALL_R,Math.min(PIT_R-BALL_R,x)),
   y,
   vx:(Math.random()-.5)*40,
   vy:animate?40+Math.random()*50:0,
   rot:(Math.random()-.5)*0.6
  };
 });
 // Nếu lần đầu mở: chạy trước vài bước để quả cầu xếp gọn thành đống tự nhiên
 if(!animate){for(let i=0;i<50;i++)stepPhysics(0.025,2)}
}
if(!S.balls.length)makeTray(false);

function rollMystery(){
 const r=Math.random();
 if(r<0.34)return 'brown';                               // 34% -> 20 Xu
 if(r<0.76)return 'gold';                                // 42% -> 50 Xu
 return 'red';                                           // 24% -> 200 Xu!
}

// Vẽ chú thú nhồi bông chi tiết, mềm mại (không thô)
function drawPlush(g,kind,x,y,sc){
 g.save();g.translate(x,y);g.scale(sc,sc);
 if(kind==='mystery'){
  g.fillStyle='#ffe866';g.strokeStyle='#5a1f82';g.lineWidth=2.2;
  g.font='800 15px '+UI_FONT;g.textAlign='center';g.textBaseline='middle';
  g.strokeText('?',0,1);g.fillText('?',0,1);
  g.restore();return;
 }
 const R=REWARDS[kind]||REWARDS.brown;
 // Tai thú mượt
 g.fillStyle=R.ear;
 if(kind==='brown'){
  // gấu tai tròn có vành trong hồng kem
  g.beginPath();g.arc(-5.2,-5.4,3.1,0,6.28);g.arc(5.2,-5.4,3.1,0,6.28);g.fill();
  g.fillStyle='#f8d0b8';g.beginPath();g.arc(-5.2,-5.4,1.5,0,6.28);g.arc(5.2,-5.4,1.5,0,6.28);g.fill();
 }else{
  // cáo/mèo vàng hoặc đỏ tai nhọn mềm
  for(const s of[-1,1]){
   g.beginPath();g.moveTo(s*2.2,-5.2);g.quadraticCurveTo(s*7.2,-9.5,s*6.8,-2.2);g.closePath();g.fill();
   g.fillStyle='#ffd6df';g.beginPath();g.moveTo(s*3.0,-5.0);g.quadraticCurveTo(s*5.8,-7.8,s*5.6,-3.2);g.closePath();g.fill();
   g.fillStyle=R.ear;
  }
 }
 // Thân nhỏ phía dưới
 g.fillStyle=R.col;
 g.beginPath();g.ellipse(0,6.2,5.6,4.2,0,0,6.28);g.fill();
 g.fillStyle='#fff4e6';
 g.beginPath();g.ellipse(0,6.6,3.2,2.4,0,0,6.28);g.fill();

 // Đầu thú bo tròn có gradient 3D mềm
 const hg=g.createRadialGradient(-2.4,-2.8,1.2,0,0,7.5);
 hg.addColorStop(0,R.hi);hg.addColorStop(0.55,R.col);hg.addColorStop(1,R.dk);
 g.fillStyle=hg;
 g.beginPath();g.ellipse(0,0,7.2,6.4,0,0,6.28);g.fill();

 // Má hồng
 g.fillStyle='rgba(255,120,145,0.48)';
 g.beginPath();g.ellipse(-4.3,1.8,1.5,0.95,0,0,6.28);g.ellipse(4.3,1.8,1.5,0.95,0,0,6.28);g.fill();

 // Mõm kem + mũi + miệng cười
 g.fillStyle='#fff6ea';
 g.beginPath();g.ellipse(0,2.3,3.2,2.2,0,0,6.28);g.fill();
 g.fillStyle='#3b1d2a';
 g.beginPath();g.ellipse(0,1.4,1.1,0.75,0,0,6.28);g.fill();
 g.strokeStyle='#3b1d2a';g.lineWidth=0.85;g.lineCap='round';
 g.beginPath();g.arc(-0.9,2.6,0.9,0.2,Math.PI-0.2);g.arc(0.9,2.6,0.9,0.2,Math.PI-0.2);g.stroke();

 // Mắt tròn long lanh có đốm sáng trắng
 for(const ex of[-2.9,2.9]){
  g.fillStyle='#241320';g.beginPath();g.arc(ex,-0.4,1.15,0,6.28);g.fill();
  g.fillStyle='#ffffff';g.beginPath();g.arc(ex-0.35,-0.75,0.42,0,6.28);g.fill();
 }
 g.restore();
}

// Vẽ quả cầu bóng bẩy 3D (nửa dưới màu, nửa trên kính trong thấy thú bên trong)
function drawCapsule(g,x,y,kind,rot,noShadow){
 g.save();g.translate(x,y);
 const r=BALL_R;
 if(!noShadow&&y>=PIT_B-BALL_R-5){
  g.fillStyle='rgba(75,20,50,0.18)';
  g.beginPath();g.ellipse(0,r-0.5,r*0.85,3.2,0,0,6.28);g.fill();
 }
 g.rotate(rot||0);

 if(kind==='mystery'){
  // Quả cầu bí ẩn tím pha lê viền vàng
  const mg=g.createRadialGradient(-4,-5,2,0,0,r);
  mg.addColorStop(0,'#d4a6ff');mg.addColorStop(0.55,'#8e4ce0');mg.addColorStop(1,'#4d1f8a');
  g.fillStyle=mg;g.beginPath();g.arc(0,0,r,0,6.28);g.fill();
  // Đai vàng giữa quả cầu
  g.fillStyle='#ffd54f';g.fillRect(-r,-1.7,r*2,3.4);
  g.fillStyle='#fff6b0';g.fillRect(-r,-1.1,r*2,1.1);
  // Lấp lánh & dấu ?
  drawPlush(g,'mystery',0,0.5,1.02);
  g.fillStyle='rgba(255,255,255,0.55)';
  g.beginPath();g.ellipse(-4.8,-6.2,4.2,2.1,-0.55,0,6.28);g.fill();
  g.strokeStyle='#3d156e';g.lineWidth=1.4;g.beginPath();g.arc(0,0,r,0,6.28);g.stroke();
 }else{
  const R=REWARDS[kind]||REWARDS.brown;
  // Nửa dưới vỏ nhựa màu gradient mịn
  const cg=g.createRadialGradient(-3,4,2,0,3,r);
  cg.addColorStop(0,R.cap1);cg.addColorStop(0.7,R.cap2);cg.addColorStop(1,R.capDk);
  g.fillStyle=cg;g.beginPath();g.arc(0,0,r,0,Math.PI);g.closePath();g.fill();

  // Khoang nền phía sau con thú (giúp thú nổi rõ bên trong vỏ cầu)
  g.fillStyle='rgba(225,244,255,0.82)';
  g.beginPath();g.arc(0,0,r-0.6,Math.PI,0);g.closePath();g.fill();

  // Con thú ngồi gọn bên trong nửa trên quả cầu
  drawPlush(g,kind,0,-2.6,0.92);

  // Vỏ kính nửa trên + phản chiếu ánh sáng
  const gg=g.createRadialGradient(-4,-6,1.5,0,-2,r);
  gg.addColorStop(0,'rgba(255,255,255,0.62)');gg.addColorStop(0.6,'rgba(210,240,255,0.16)');gg.addColorStop(1,'rgba(140,195,235,0.28)');
  g.fillStyle=gg;g.beginPath();g.arc(0,0,r,Math.PI,0);g.closePath();g.fill();

  // Gờ khớp giữa 2 nửa cầu
  g.fillStyle='rgba(255,255,255,0.92)';g.fillRect(-r+0.8,-1.3,r*2-1.6,2.6);
  g.fillStyle='rgba(0,0,0,0.08)';g.fillRect(-r+0.8,0.6,r*2-1.6,0.8);

  // Đốm bóng gương tròn mượt
  g.fillStyle='rgba(255,255,255,0.72)';
  g.beginPath();g.ellipse(-5.0,-6.6,3.8,1.8,-0.55,0,6.28);g.fill();
  g.beginPath();g.arc(-8.2,-3.2,1.1,0,6.28);g.fill();

  g.strokeStyle=R.capDk;g.lineWidth=1.35;g.beginPath();g.arc(0,0,r,0,6.28);g.stroke();
 }
 g.restore();
}

function drawArcade(g,tm){
 // Nền tủ kính pastel dài rộng
 const bg=g.createLinearGradient(0,26,0,H);
 bg.addColorStop(0,'#dff3ff');bg.addColorStop(0.68,'#fff5fa');bg.addColorStop(1,'#ffd5e5');
 g.fillStyle=bg;g.fillRect(0,0,W,H);

 // Sọc kính nhẹ phía sau
 g.fillStyle='rgba(255,255,255,0.42)';
 for(let x=16;x<W;x+=36)g.fillRect(x,26,16,H-46);

 // Sàn hố đựng bóng
 g.fillStyle='#ffc2d7';g.fillRect(PIT_L-4,PIT_B,W-PIT_L+4,H-PIT_B);
 g.fillStyle='#e889a8';g.fillRect(PIT_L-4,PIT_B-1,W-PIT_L+4,3);

 // Ô NHẬN THÚ bên trái (x: 8..72)
 const overChute=S.clawX<=CHUTE_MAX_X;
 const readyDrop=S.phase==='carry'&&overChute;
 g.fillStyle=readyDrop?'#25693f':'#592848';g.fillRect(8,190,64,H-190);
 g.fillStyle=readyDrop?'#3ba363':'#783660';g.fillRect(10,192,60,22);
 g.fillStyle='#ffe89c';g.font='800 10px '+UI_FONT;g.textAlign='center';
 g.fillText(readyDrop?'THẢ ĐÂY!':'Ô NHẬN THÚ',40,206.5);
 if(S.phase==='carry'&&!overChute){
  const pulse=0.55+0.45*Math.sin(tm*8);
  g.fillStyle='rgba(255,220,70,'+pulse.toFixed(2)+')';
  g.font='800 16px '+UI_FONT;g.fillText('◀',40,248);
 }

 // Vách ngăn giữa Ô THÚ và hố bóng
 g.fillStyle='#d45c7a';g.fillRect(72,184,10,H-184);
 g.fillStyle='#fff0f5';g.fillRect(74,184,3,H-184);
 g.fillStyle='#b84463';g.beginPath();g.arc(77,184,5,Math.PI,0);g.fill();

 // Thanh ray trên cùng
 g.fillStyle='#8c9aab';g.fillRect(16,31,W-32,6);
 g.fillStyle='#dce5ef';g.fillRect(16,32,W-32,2.5);

 // Vẽ 16 quả cầu theo thứ tự từ trên xuống dưới (những quả dưới có physics va chạm thật)
 const sorted=S.balls.slice().sort((a,b)=>a.y-b.y);
 const fallingT=S.dropBall&&S.dropBall.target;
 for(const b of sorted){
  if(b===S.caught||b===fallingT)continue;
  drawCapsule(g,b.x,b.y,b.kind,b.rot,false);
 }

 // Quả cầu đang rơi (rớt giữa đường / thả trượt / thả vào ô thú)
 if(S.dropBall){
  drawCapsule(g,S.dropBall.x,S.dropBall.y,S.dropBall.kind,S.dropBall.rot,true);
 }

 // Quả cầu đang được kẹp trên càng móc
 if(S.caught){
  drawCapsule(g,S.clawX,S.clawY+21,S.caught.kind,0,true);
 }

 // Dây cáp + cụm móc gắp (từ ray y=34 hạ sâu tới y~268!)
 const cx0=S.clawX,cy0=S.clawY;
 g.fillStyle='#5c6878';g.fillRect(cx0-1.5,35,3,Math.max(4,cy0-35));
 // Xe trượt trên ray
 g.fillStyle='#f2849e';g.fillRect(cx0-13,26,26,11);
 g.strokeStyle='#a83858';g.lineWidth=1.5;g.strokeRect(cx0-13,26,26,11);
 // Khớp nối + 2 càng thép cong ôm cầu
 g.fillStyle='#6f7d8f';g.beginPath();g.arc(cx0,cy0,5.5,0,6.28);g.fill();
 g.fillStyle='#cfd8e3';g.beginPath();g.arc(cx0-1.5,cy0-1.5,1.8,0,6.28);g.fill();

 const ang=0.18+S.grip*0.44;
 g.strokeStyle='#4e5968';g.lineWidth=3.4;g.lineCap='round';g.lineJoin='round';
 for(const side of[-1,1]){
  const x1=cx0+side*Math.sin(ang)*13,y1=cy0+Math.cos(ang)*12;
  const x2=cx0+side*(6.5+S.grip*7.5),y2=cy0+24;
  const x3=cx0+side*(3.2+S.grip*5.5),y3=cy0+28;
  g.beginPath();g.moveTo(cx0,cy0+1);g.lineTo(x1,y1);g.lineTo(x2,y2);g.lineTo(x3,y3);g.stroke();
 }

 // Đèn marquee trên cùng
 g.fillStyle='#6e2654';g.fillRect(0,0,W,25);
 g.fillStyle='#ffd23f';g.fillRect(0,23,W,2.5);
 const bPhase=Math.floor(tm*3)%2;
 for(let x=12;x<W;x+=20){
  g.fillStyle=((x/20|0)+bPhase)%2?'#ffe975':'#ff8cb5';
  g.beginPath();g.arc(x,12,3.4,0,6.28);g.fill();
 }
 g.fillStyle='#ffffff';g.font='800 11.5px '+UI_FONT;g.textAlign='center';
 g.fillText('MÁY GẮP THÚ PHỐ XÁ',W/2,16.5);

 // Ánh kính phản chiếu nhẹ
 g.fillStyle='rgba(255,255,255,0.22)';
 g.beginPath();g.moveTo(16,28);g.lineTo(54,28);g.lineTo(22,190);g.lineTo(8,190);g.closePath();g.fill();

 // Bảng mở quà trúng thưởng
 if(S.reveal){
  const p=Math.min(1,S.reveal.t/0.9);
  const R=REWARDS[S.reveal.kind];
  const sc=0.85+Math.sin(Math.min(1,p*2)*Math.PI/2)*0.8;
  g.save();
  g.fillStyle='rgba(38,10,28,'+(0.46*Math.min(1,p*3)).toFixed(2)+')';
  g.fillRect(0,25,W,H-25);
  g.fillStyle=S.reveal.kind==='red'?'rgba(255,80,100,0.38)':'rgba(255,220,90,0.32)';
  g.beginPath();g.arc(W/2,145,56*sc,0,6.28);g.fill();
  drawPlush(g,S.reveal.kind,W/2,140,3.8*sc);
  g.fillStyle='#ffffff';g.font='800 17px '+UI_FONT;g.textAlign='center';
  g.fillText((S.reveal.fromQ?'❓ QUẢ MỞ RA: ':'🎉 NHẬN ĐƯỢC ')+R.name.toUpperCase()+'!',W/2,216);
  g.fillStyle='#ffe866';g.font='800 20px '+UI_FONT;
  g.fillText('+'+R.xu+' XU',W/2,244);
  g.restore();
 }

 for(const q of S.fx){
  g.fillStyle=q.c;
  g.fillRect(Math.round(q.x),Math.round(q.y),3.5,3.5);
 }
}

function spawnConfetti(x,y,n,cols){
 for(let i=0;i<n;i++){
  const a=Math.random()*6.283,sp=40+Math.random()*130;
  S.fx.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-50,c:cols[i%cols.length],t:0,dur:0.8+Math.random()*.45});
 }
}

function syncUIState(){
 const xuEl=document.getElementById('clw-xu');
 const cntEl=document.getElementById('clw-cnt');
 const msgEl=document.getElementById('clw-msg');
 const actBtn=document.getElementById('clw-drop');
 const mixBtn=document.getElementById('clw-refill');
 if(xuEl&&typeof ST!=='undefined')xuEl.textContent=(typeof fmtXu==='function'?fmtXu(ST.xu):ST.xu)+' Xu';
 if(cntEl)cntEl.textContent=S.balls.length+'/'+TRAY_N;
 if(msgEl){msgEl.textContent=S.msg;msgEl.className='clw-msg'+(S.msgCls?' '+S.msgCls:'')}
 if(actBtn){
  if(S.phase==='carry'){
   actBtn.disabled=false;
   actBtn.textContent=S.clawX<=CHUTE_MAX_X?'⬇️ THẢ VÀO Ô THÚ!':'⬇️ THẢ THÚ';
   actBtn.className='clw-drop '+(S.clawX<=CHUTE_MAX_X?'release-ready':'release-mode');
  }else{
   actBtn.disabled=S.phase!=='idle';
   actBtn.textContent='🎯 GẮP THÚ • '+COST+' Xu';
   actBtn.className='clw-drop';
  }
 }
 if(mixBtn)mixBtn.disabled=S.phase!=='idle';
}

function creditPrize(kind,fromQ){
 const R=REWARDS[kind]||REWARDS.brown;
 if(typeof ST!=='undefined'){ST.xu=(ST.xu||0)+R.xu;if(typeof xuUp==='function')xuUp();if(typeof save==='function')save()}
 S.totalCatch++;
 S.failStreak=0;
 S.reveal={kind,xu:R.xu,t:0,fromQ};
 S.msg=(fromQ?'🎁 Quả ? mở ra ':'🎉 Nhận được ')+R.name+'! Cộng +'+R.xu+' Xu';
 S.msgCls=kind==='red'?'jackpot':'win';
 spawnConfetti(W/2,145,kind==='red'?28:16,kind==='red'?['#ff3b5c','#ffd23f','#ffffff','#ff9ad0']:['#ffd23f','#fff3a8','#ff85a2','#7bed9f']);
 if(typeof toast==='function'&&kind==='red')toast('🔥 Trúng Thú Đỏ Siêu Hiếm +200 Xu!');
 syncUIState();
}

function onActionBtn(){
 if(S.phase==='carry'){releaseHeldBall();return}
 if(S.phase!=='idle')return;
 if(S.clawX<PIT_L){
  S.msg='👉 Kéo cần sang phải vào vùng quả cầu rồi hãy bấm GẮP THÚ!';S.msgCls='';syncUIState();
  return;
 }
 if(typeof ST!=='undefined'&&(ST.xu||0)<COST){
  S.msg='🪙 Bạn cần '+COST+' Xu để gắp (hiện có '+(ST.xu|0)+' Xu)!';S.msgCls='';syncUIState();
  if(typeof toast==='function')toast('🪙 Không đủ 20 Xu để gắp thú!');
  return;
 }
 if(typeof ST!=='undefined'){ST.xu-=COST;if(typeof xuUp==='function')xuUp();if(typeof save==='function')save()}
 S.dir=0;setStickVisual(0);
 S.phase='drop';S.t=0;S.caught=null;S.reveal=null;
 S.msg='⬇️ Đang hạ móc xuống sâu...';S.msgCls='';
 syncUIState();
}

function releaseHeldBall(){
 if(S.phase!=='carry'||!S.caught)return;
 const b=S.caught;
 S.dir=0;setStickVisual(0);
 S.grip=1;
 if(S.clawX<=CHUTE_MAX_X){
  S.balls=S.balls.filter(q=>q!==b);
  S.caught=null;S.willSlip=false;
  S.phase='release';S.t=0;
  S.dropBall={x:S.clawX,y:S.clawY+21,vy:40,kind:b.kind,rot:0,prize:true};
  S.msg='🎁 Quả cầu đang rơi xuống ô nhận thú...';S.msgCls='win';
  syncUIState();
 }else{
  S.caught=null;S.willSlip=false;S.failStreak++;
  S.phase='slip';S.t=0;
  S.dropBall={x:S.clawX,y:S.clawY+21,vx:(Math.random()-.5)*40,vy:40,kind:b.kind,rot:b.rot,target:b};
  S.msg='😅 Bạn thả hơi sớm! Quả cầu rơi lại xuống đống bóng rồi.';S.msgCls='';
  syncUIState();
 }
}

function mixBalls(){
 if(S.phase!=='idle')return;
 if(typeof ST!=='undefined'&&(ST.xu||0)<MIX_COST){
  S.msg='🪙 Cần '+MIX_COST+' Xu để trộn đợt cầu thú mới!';S.msgCls='';syncUIState();
  if(typeof toast==='function')toast('🪙 Không đủ 20 Xu để trộn thú!');
  return;
 }
 if(typeof ST!=='undefined'){ST.xu-=MIX_COST;if(typeof xuUp==='function')xuUp();if(typeof save==='function')save()}
 makeTray(true);
 S.msg='🔀 Đã trộn và thả đợt 16 quả cầu thú mới!';S.msgCls='win';
 syncUIState();
}

function tickClaw(dt){
 // Luôn chạy vật lý để các quả cầu bên trên tự rơi/lăn xuống khi quả bên dưới bị nhấc đi!
 stepPhysics(dt,2);

 for(let i=S.fx.length-1;i>=0;i--){
  const q=S.fx[i];q.t+=dt;q.vy+=200*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;
  if(q.t>=q.dur)S.fx.splice(i,1);
 }

 if(S.phase==='idle'){
  if(S.dir!==0){
   S.clawX=Math.max(40,Math.min(410,S.clawX+S.dir*142*dt));
  }
  S.grip+=(1-S.grip)*Math.min(1,dt*12);
 }else if(S.phase==='drop'){
  S.clawY+=155*dt;
  // Chạm xuống quả cầu cao nhất nằm ngay trong lòng càng gắp
  let hitY=PIT_B-26;
  for(const b of S.balls){
   if(Math.abs(b.x-S.clawX)<=BALL_R*0.92)hitY=Math.min(hitY,b.y-20);
  }
  if(S.clawY>=hitY){S.clawY=hitY;S.phase='grab';S.t=0}
 }else if(S.phase==='grab'){
  S.t+=dt;S.grip=Math.max(0,1-S.t/0.25);
  if(S.t>=0.27){
   // Chỉ gắp được khi CĂN CHUẨN TÂM quả cầu (lệch > 7.5px sẽ đẩy trượt quả cầu & hụt!)
   let best=null,bestD=99,bestDx=99;
   for(const b of S.balls){
    const dx=Math.abs(b.x-S.clawX),dy=Math.abs((b.y-20)-S.clawY);
    const d=Math.hypot(dx,dy);
    if(d<bestD){bestD=d;best=b;bestDx=dx}
   }
   if(best&&bestD<=22&&bestDx<=7.5){
    // Càng đúng tâm (bestDx nhỏ), tỉ lệ khóa kẹp càng cao
    const lockRate=bestDx<=4.2?0.97:0.68;
    const locked=S.failStreak>=2&&bestDx<=5.0?true:(Math.random()<lockRate);
    if(!locked){
     best.vx+=(best.x<S.clawX?-1:1)*45;best.vy=-35;
     S.caught=null;S.willSlip=false;S.failStreak++;
     S.phase='lift';S.t=0;
     S.msg='😅 Chưa ôm trọn quả cầu rồi! Căn chuẩn giữa tâm hơn nhé.';syncUIState();
    }else{
     // Đã nhấc lên được — tỉ lệ rớt giữa đường (lúc kéo lên hoặc lúc kéo về ô thú)
     const slipBase=(best.kind==='brown'?0.11:best.kind==='gold'?0.17:0.19)+(bestDx>4.5?0.08:0);
     const willSlip=S.failStreak>=2?false:(Math.random()<slipBase);
     S.caught=best;
     S.caught.vx=0;S.caught.vy=0;
     S.willSlip=willSlip;
     if(willSlip&&Math.random()<0.35&&S.clawY>120){
      S.slipAt='lift';
      S.slipY=72+Math.random()*Math.min(80,S.clawY-82);
     }else{
      S.slipAt='carry';
      const maxSpan=Math.max(18,S.clawX-96);
      S.slipX=90+Math.random()*maxSpan;
     }
     S.phase='lift';S.t=0;
     S.msg='⬆️ Đã kẹp trúng! Đang kéo lên...';syncUIState();
    }
   }else{
    // Bị lệch tâm -> càng gắp hất nhẹ quả cầu qua 1 bên và về không!
    if(best&&bestD<=26){
     best.vx+=(best.x<S.clawX?-1:1)*60;
     best.vy=-25;
    }
    S.caught=null;S.willSlip=false;S.failStreak++;S.phase='lift';S.t=0;
    S.msg='😅 Bị lệch tâm rồi! Cần ngắm thẳng chính giữa quả cầu.';syncUIState();
   }
  }
 }else if(S.phase==='lift'){
  S.clawY-=132*dt;
  // Rơi ngay khi đang kéo lên (nếu slipAt==='lift')
  if(S.caught&&S.willSlip&&S.slipAt==='lift'&&S.clawY<=S.slipY){
   const b=S.caught;
   S.caught=null;S.willSlip=false;S.grip=0.75;S.failStreak++;
   S.dropBall={x:S.clawX,y:S.clawY+21,vx:(Math.random()-.5)*40,vy:20,kind:b.kind,rot:b.rot,target:b};
   S.msg='😱 Ôi! Quả cầu bị tuột khỏi càng rơi xuống lại rồi!';syncUIState();
  }
  if(S.clawY<=RAIL_Y){
   S.clawY=RAIL_Y;
   if(S.caught){
    S.phase='carry';S.t=0;
    S.msg='👈 Kéo cần đưa về Ô NHẬN THÚ bên trái rồi bấm THẢ THÚ!';
    syncUIState();
   }else if(S.dropBall){
    S.phase='slip';S.t=0;
   }else{
    S.phase='idle';syncUIState();
   }
  }
 }else if(S.phase==='carry'){
  const prevOver=S.clawX<=CHUTE_MAX_X;
  if(S.dir!==0){
   S.clawX=Math.max(38,Math.min(410,S.clawX+S.dir*142*dt));
   if(S.caught&&S.willSlip&&S.slipAt==='carry'&&S.dir<0&&S.clawX<=S.slipX&&S.clawX>PIT_L+10){
    const b=S.caught;
    S.caught=null;S.willSlip=false;S.grip=0.75;S.failStreak++;
    S.dropBall={x:S.clawX,y:S.clawY+21,vx:-25+(Math.random()-.5)*30,vy:30,kind:b.kind,rot:b.rot,target:b};
    S.phase='slip';S.t=0;
    S.msg='😱 Á! Đang kéo đi thì quả cầu tuột tay rớt xuống hố!';S.msgCls='';
    syncUIState();
    return;
   }
  }
  const nowOver=S.clawX<=CHUTE_MAX_X;
  if(nowOver!==prevOver){
   S.msg=nowOver?'✨ Đã tới Ô NHẬN THÚ! Bấm THẢ THÚ để mở quà!':'👈 Kéo cần đưa về Ô NHẬN THÚ bên trái rồi bấm THẢ THÚ!';
   syncUIState();
  }
 }else if(S.phase==='slip'){
  if(S.dropBall){
   const db=S.dropBall;
   db.vy+=520*dt;db.x+=db.vx*dt;db.y+=db.vy*dt;
   db.x=Math.max(PIT_L+BALL_R,Math.min(PIT_R-BALL_R,db.x));
   let landed=db.y>=PIT_B-BALL_R;
   if(!landed){
    for(const o of S.balls){
     if(o!==db.target&&Math.hypot(db.x-o.x,db.y-o.y)<=BALL_R*2){landed=true;break}
    }
   }
   if(landed){
    // Trả quả cầu vào hệ vật lý cho nảy và lăn vào đống thật!
    db.target.x=db.x;
    db.target.y=Math.min(PIT_B-BALL_R,db.y);
    db.target.vx=db.vx+(Math.random()-.5)*60;
    db.target.vy=Math.min(180,db.vy*0.45);
    S.dropBall=null;S.phase='idle';syncUIState();
   }
  }else{S.phase='idle';syncUIState()}
 }else if(S.phase==='release'){
  if(S.dropBall){
   S.dropBall.vy+=520*dt;S.dropBall.y+=S.dropBall.vy*dt;
   if(S.dropBall.y>=PIT_B-8){
    const kind=S.dropBall.kind;S.dropBall=null;
    const fromQ=kind==='mystery';
    const finalKind=fromQ?rollMystery():kind;
    creditPrize(finalKind,fromQ);
    S.phase='reveal';S.t=0;
   }
  }
 }else if(S.phase==='reveal'){
  S.t+=dt;
  if(S.reveal)S.reveal.t+=dt;
  if(S.t>=1.35){
   S.reveal=null;
   S.clawX=256;
   if(S.balls.length===0){
    makeTray(true);
    S.msg='✨ Đã gắp sạch 16 quả — đợt cầu mới vừa được thả xuống!';S.msgCls='win';
   }else{
    S.msg='Kéo cần ngắm chuẩn tâm quả cầu rồi bấm GẮP THÚ (20 Xu)!';S.msgCls='';
   }
   S.phase='idle';
   syncUIState();
  }
 }

 // Nếu quả cầu rơi trong khi móc vẫn đang kéo lên (slipAt==='lift')
 if(S.dropBall&&S.phase==='lift'){
  const db=S.dropBall;
  db.vy+=520*dt;db.x+=db.vx*dt;db.y+=db.vy*dt;
  db.x=Math.max(PIT_L+BALL_R,Math.min(PIT_R-BALL_R,db.x));
  let landed=db.y>=PIT_B-BALL_R;
  if(!landed){
   for(const o of S.balls){
    if(o!==db.target&&Math.hypot(db.x-o.x,db.y-o.y)<=BALL_R*2){landed=true;break}
   }
  }
  if(landed){
   db.target.x=db.x;db.target.y=Math.min(PIT_B-BALL_R,db.y);
   db.target.vx=db.vx+(Math.random()-.5)*60;db.target.vy=Math.min(180,db.vy*0.45);
   S.dropBall=null;
  }
 }
}

function setStickVisual(dir){
 const el=document.getElementById('clw-stick');
 const bL=document.getElementById('clw-l'),bR=document.getElementById('clw-r');
 if(el)el.style.transform='rotate('+(dir*20)+'deg)';
 if(bL)bL.classList.toggle('on',dir<0);
 if(bR)bR.classList.toggle('on',dir>0);
}
function setDir(d){
 const canMove=S.phase==='idle'||S.phase==='carry';
 S.dir=canMove?d:0;
 setStickVisual(d);
}

function stopClaw(){
 if(S.raf){cancelAnimationFrame(S.raf);S.raf=0}
 S.open=false;S.dir=0;
 if(S.caught&&!S.willSlip){
  const kind=S.caught.kind==='mystery'?rollMystery():S.caught.kind;
  S.balls=S.balls.filter(q=>q!==S.caught);
  S.caught=null;
  creditPrize(kind,false);
  if(S.balls.length===0)makeTray(false);
 }
 if(S.phase!=='idle'){S.phase='idle';S.dropBall=null;S.reveal=null;S.clawY=RAIL_Y;S.clawX=256;S.caught=null;S.willSlip=false}
}

function loopClaw(now){
 if(!S.open){S.raf=0;return}
 const cv=document.getElementById('clw-cv');
 if(!cv){stopClaw();return}
 const dt=Math.min(0.05,(now-(S.last||now))/1000);S.last=now;
 tickClaw(dt);
 const g=cv.getContext('2d');
 drawArcade(g,now/1000);
 S.raf=requestAnimationFrame(loopClaw);
}

function onKey(e,down){
 if(!S.open)return;
 if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){e.preventDefault();setDir(down?-1:0)}
 else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){e.preventDefault();setDir(down?1:0)}
 else if(down&&(e.key===' '||e.key==='Enter')){e.preventDefault();onActionBtn()}
}
let keyHooked=false;

function openClawUI(){
 injectCSS();
 if(typeof openUI!=='function'){if(typeof toast==='function')toast('🧸 Máy gắp thú!');return}
 S.phase='idle';S.clawY=RAIL_Y;S.caught=null;S.dropBall=null;S.reveal=null;S.dir=0;S.willSlip=false;
 S.msg='Kéo cần ngắm chuẩn tâm quả cầu rồi bấm GẮP THÚ (20 Xu)!';S.msgCls='';
 if(!S.balls.length)makeTray(true);

 openUI(
  '<div class="uh"><span>🧸 Máy gắp thú Phố xá</span><button class="b x" onclick="closeUI()">✕</button></div>'+
  '<div class="clw-top">'+
   '<span>🪙 Có: <b id="clw-xu"></b></span>'+
   '<span>🎱 Còn: <b id="clw-cnt"></b></span>'+
   '<span>💰 20 Xu/lượt</span>'+
  '</div>'+
  '<div class="clw-stage"><canvas id="clw-cv" width="440" height="300"></canvas></div>'+
  '<div id="clw-msg" class="clw-msg"></div>'+
  '<div class="clw-ctrl">'+
   '<div class="clw-joy-wrap">'+
    '<button id="clw-l" class="clw-nudge" type="button" title="Sang trái">◀</button>'+
    '<div id="clw-joy" class="clw-joy" title="Kéo cần gạt trái/phải"><div id="clw-stick" class="clw-stick"><div class="clw-knob"></div></div></div>'+
    '<button id="clw-r" class="clw-nudge" type="button" title="Sang phải">▶</button>'+
   '</div>'+
   '<button id="clw-drop" class="clw-drop" type="button">🎯 GẮP THÚ • 20 Xu</button>'+
  '</div>'+
  '<div class="clw-foot">'+
   '<span>🐻 Nâu +20 • 🌟 Vàng +50 • ❓ Đỏ +200</span>'+
   '<button id="clw-refill" class="clw-refill" type="button">🔀 Trộn thú • 20 Xu</button>'+
  '</div>'
 );

 const ui=document.getElementById('ui');
 if(ui)ui.classList.add('clwui');
 syncUIState();

 const bindHold=(el,d)=>{
  if(!el)return;
  const on=e=>{e.preventDefault();setDir(d)};
  const off=e=>{e.preventDefault();if(S.dir===d)setDir(0)};
  el.addEventListener('pointerdown',on);
  el.addEventListener('pointerup',off);
  el.addEventListener('pointerleave',off);
  el.addEventListener('pointercancel',off);
 };
 bindHold(document.getElementById('clw-l'),-1);
 bindHold(document.getElementById('clw-r'),1);

 const joy=document.getElementById('clw-joy');
 if(joy){
  let drag=false,x0=0;
  joy.addEventListener('pointerdown',e=>{e.preventDefault();drag=true;x0=e.clientX;joy.setPointerCapture&&joy.setPointerCapture(e.pointerId)});
  joy.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-x0;setDir(dx<-6?-1:dx>6?1:0)});
  const end=()=>{if(drag){drag=false;setDir(0)}};
  joy.addEventListener('pointerup',end);joy.addEventListener('pointercancel',end);
 }

 const drop=document.getElementById('clw-drop');
 if(drop)drop.addEventListener('click',onActionBtn);

 const ref=document.getElementById('clw-refill');
 if(ref)ref.addEventListener('click',mixBalls);

 if(!keyHooked){
  keyHooked=true;
  window.addEventListener('keydown',e=>onKey(e,true));
  window.addEventListener('keyup',e=>onKey(e,false));
 }

 S.open=true;S.last=performance.now();
 if(!S.raf)S.raf=requestAnimationFrame(loopClaw);
}

if(typeof window.openUI==='function'&&!window.openUI.__clw){
 const o0=window.openUI;
 window.openUI=function(){
  stopClaw();
  const u=document.getElementById('ui');if(u)u.classList.remove('clwui');
  return o0.apply(this,arguments);
 };
 window.openUI.__clw=1;
}
if(typeof window.closeUI==='function'&&!window.closeUI.__clw){
 const c0=window.closeUI;
 window.closeUI=function(){
  stopClaw();
  const u=document.getElementById('ui');if(u)u.classList.remove('clwui');
  return c0.apply(this,arguments);
 };
 window.closeUI.__clw=1;
}

if(typeof window.cvAct==='function'&&!window.cvAct.__claw){
 const ca0=window.cvAct;
 window.cvAct=function(a,h){
  if(a==='claw:open'){openClawUI();return}
  return ca0.apply(this,arguments);
 };
 window.cvAct.__claw=1;
}

const D=window.CVMAPS&&CVMAPS.ps&&CVMAPS.ps.d;
if(D){
 D.sp.push({by:GY+2,d:drawClawMachine});
 D.hits.push([GX-20,GY-54,40,56,'🧸 Máy gắp thú — bấm để chơi (20 Xu/lượt)','cv:claw:open',[GX,GY+10]]);
}
window.CLAW={open:openClawUI,state:S};
})();
