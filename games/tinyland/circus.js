/* ============================================================
   XE HỀ XIẾC — đỗ ở vỉa hè dưới, cạnh ngõ vào PHỐ XÁ
   • Xe pixel-art: mái lều xiếc, loa phát thanh trên nóc, chú hề lái xe, bóng bay, đèn nhấp nháy
   • Cứ vài giây xe "phát loa": rung loa, sóng âm, nốt nhạc, confetti, bong bóng thoại + âm thanh (nhạc xiếc, còi hề)
   • Bấm vào xe → các nút: 🎡 Vòng quay may mắn • 🎁 Blind Box Kim Cương • 🎈 Xé túi Hề • 🤡 Tiệm Chú Hề (bán Mascot Hề Quái Đản + Hanbok)
   • Gắn vào pho-map.js qua: circusBuild({dyn,hit,blk}) và circusUI()
   ============================================================ */
(()=>{
'use strict';
const tmNow=()=>performance.now()/1000;
const VX=156,VB=462,VW=128,VH=72;            // tâm x, chân xe (y), kích thước sprite — đỗ ở vỉa hè dưới, cạnh ngõ vào (chỗ người chơi hay đứng)
const INK='#2a1540',RED='#e63946',RDK='#b3202e',CRM='#fff4dc',CRD='#e8d3a8',YEL='#ffd23f',YDK='#d9a514',
      PUR='#6a2fb0',PDK='#4a1d82',TEAL='#1fb5a6',TDK='#128a7e',BLU='#3a86ff',ORG='#ff8c1a',PNK='#ff7eb6';

/* ---------------- SPRITE XE (tĩnh) ---------------- */
let VAN=null,VANO=null;
function mkVan(){return mk(VW,VH,(g,r)=>{
 // bóng đổ
 E(r,'rgba(0,0,0,.22)',64,70,58,2);
 // thang phía sau
 r(INK,1,30,2,38);r(INK,5,30,1,38);for(let y=34;y<66;y+=5)r(INK,1,y,5,1);
 // ----- thân xe: sọc kẹo đỏ-kem -----
 for(let x=6,i=0;x<98;x+=6,i++)r(i%2?CRM:RED,x,30,6,32);
 r('rgba(255,255,255,.28)',6,30,92,2);
 // mái + viền
 r(PDK,4,14,96,3);r(PUR,4,14,96,1);
 // mái hiên sọc + diềm lượn sóng
 for(let x=4,i=0;x<100;x+=6,i++){r(i%2?'#fff':RED,x,17,6,7);}
 for(let x=4,i=0;x<100;x+=6,i++){const c=i%2?'#fff':RED;r(c,x,24,6,2);r(c,x+1,26,4,2);r(c,x+2,28,2,1)}
 r('rgba(0,0,0,.16)',4,17,96,1);
 // ----- bảng tranh chú hề (trái) -----
 r(YEL,8,31,40,29);r(YDK,8,59,40,1);r('#8fd8ff',10,33,36,25);
 for(let i=0;i<16;i++)r(['#ff7eb6','#ffd23f','#fff','#9b5de5'][i%4],11+((i*7)%33),34+((i*5)%22),2,2);
 // tóc cầu vồng 2 bên
 E(r,ORG,17,45,6,6);E(r,RED,16,41,4,4);E(r,BLU,37,45,6,6);E(r,TEAL,38,41,4,4);
 // mũ
 for(let i=0;i<7;i++)r(PUR,27-i,33+i-1,i*2+1,1);r(YEL,26,29,3,3);r(YEL,22,39,10,2);
 // mặt
 E(r,'#fff6ee',27,47,10,10);r('rgba(255,160,160,.5)',19,49,3,2);r('rgba(255,160,160,.5)',32,49,3,2);
 // mắt kim cương + lông mày
 for(const x of[22,31]){r(BLU,x,43,3,1);r(BLU,x-1,44,5,1);r(BLU,x,45,3,1);r(INK,x+1,44,1,1);r(RED,x-1,41,5,1)}
 // mũi đỏ
 E(r,RED,27,48,3,3);r('#ff9aa2',26,46,1,1);
 // miệng cười
 r(RED,21,52,13,2);r(RED,20,51,2,2);r(RED,33,51,2,2);r('#fff',23,52,9,1);
 // ----- biển tên (phải) -----
 r(YEL,52,31,44,17);r(TEAL,54,33,40,13);r(TDK,54,45,40,1);
 r(PUR,52,50,44,10);r(PDK,52,59,44,1);
 g.textAlign='center';g.textBaseline='alphabetic';
 g.font='800 10px Nunito, Arial, sans-serif';g.fillStyle=INK;g.fillText('CHÚ HỀ',75,44);g.fillStyle='#fff';g.fillText('CHÚ HỀ',74,43);
 g.font='800 7px Nunito, Arial, sans-serif';g.fillStyle=YEL;g.fillText('XIẾC VUI VẺ',74,57);
 // váy xe (viền tím + chấm vàng)
 r(PDK,4,60,96,5);r(PUR,4,60,96,1);for(let x=8;x<98;x+=8)r(YEL,x,62,2,2);
 // ----- cabin -----
 r(RED,98,38,29,26);r('rgba(255,255,255,.25)',98,38,29,1);r(RDK,98,62,29,2);
 r(YEL,100,34,22,4);r(YDK,100,37,22,1);                       // mái cabin
 r('#7bd7ff',102,40,18,13);r('#c8f0ff',102,40,3,13);r('#c8f0ff',107,40,1,13);r(INK,102,52,18,1); // kính
 r(RDK,100,54,1,8);r(YEL,101,57,3,1);                         // khe cửa + tay nắm
 r(PDK,118,56,9,2);r('#fff',118,58,9,1);                        // sọc hông
 // đầu xe + mũi hề đỏ
 r(RED,119,46,8,18);r(RDK,119,62,8,2);r('#9aa0a8',118,56,1,6);
 r('#fff6c0',121,50,5,5);r(YEL,122,51,3,3);r('#fff',122,51,1,1);  // đèn pha
 E(r,RED,125,59,4,4);r('#ff8f98',124,57,2,2);                      // mũi hề ở đầu xe
 r('#cfd4da',113,64,15,3);r('#fff',113,64,15,1);r('#8d949c',113,66,15,1); // cản
 // gương chiếu hậu
 r(INK,99,44,2,1);r(YEL,97,43,3,4);
 // cản sau + đèn hậu
 r('#cfd4da',3,64,6,3);r(RED,4,56,2,5);
 // ----- bánh xe -----
 for(const x of[24,110]){E(r,INK,x,62,10,10);E(r,'#111',x,62,8,8);E(r,YEL,x,62,5,5);E(r,YDK,x,62,3,3);r(RED,x-1,61,2,2);
  for(let a=0;a<8;a++){const q=a*.785;r('#fff6c0',x+Math.round(Math.cos(q)*4),62+Math.round(Math.sin(q)*4),1,1)}}
 // mái lều xiếc nhỏ trên nóc
 for(let y=1;y<14;y++){const hw=Math.round(2+(y-1)*2.05);for(let x=-hw;x<=hw;x++){r(Math.floor((x+60)/6)%2?'#fff':RED,50+x,y,1,1)}}
 r('rgba(0,0,0,.14)',50-27,13,54,1);r(YEL,48,0,5,3);E(r,YEL,50,0,3,3);
 for(let x=-26,i=0;x<27;x+=6,i++){r(i%2?RED:'#fff',50+x,13,6,2)}
});}

/* ---------------- DỮ LIỆU PHÁT LOA ---------------- */
const LINES=['Alo alo! Mời bà con quay Vòng quay may mắn nè! 🎡','Chú Hề đây! Quay trúng kim cương luôn nha! 💎','Tiệm Chú Hề mở cửa rồi! Ghé xem Hề Quái Đản nha! 🎪','Hề hề hề! Ai quay là trúng! 🤡','Pa-pa-pa! Xiếc đến rồi, vui quá vui! 🎉','Có vé là quay miễn phí nhé bà con ơi! 🎟️','Blind Box Kim Cương đây! Khui hộp là có quà nha! 🎁','Muốn nhiều xu thì cứ việc xé túi Hề! 🎈','Túi Hề VIP đây, xé là trúng 1000 xu nha! 🤡'];
const B={t0:-99,dur:3.6,line:'',next:4,kind:0,conf:[],notes:[]};
let LASTT=0;

/* ---------------- ÂM THANH (phát loa) ---------------- */
function play(kind,vol){
 const ac=window.__cvAC;if(!ac||!window.CV||CV.snd===0||vol<.004)return;
 try{
  if(ac.state=='suspended')ac.resume();
  const t0=ac.currentTime+.02,mst=ac.createGain();mst.gain.value=vol;
  const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=.7;     // âm "loa phường"
  mst.connect(bp);bp.connect(ac.destination);
  const tone=(f,t,d,type,v,f2)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t0+t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+t+d);
   g.gain.setValueAtTime(0,t0+t);g.gain.linearRampToValueAtTime(v||.5,t0+t+.012);g.gain.exponentialRampToValueAtTime(.001,t0+t+d);o.connect(g);g.connect(mst);o.start(t0+t);o.stop(t0+t+d+.03)};
  // tiếng "bụp" bật loa
  {const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*.05,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const g=ac.createGain();g.gain.value=.5;n.connect(g);g.connect(mst);n.start(t0)}
  if(kind==0){ // kèn xiếc: fanfare + oom-pah
   [[523,.0],[659,.13],[784,.26],[1047,.39],[784,.62],[1047,.75]].forEach(([f,t])=>tone(f,.08+t,.16,'square',.35));
   [[131,.08],[196,.34],[131,.60],[196,.86]].forEach(([f,t])=>tone(f,t,.2,'triangle',.7));
  }else if(kind==1){ // còi hề "bí-bo"
   tone(520,.08,.14,'sawtooth',.5,640);tone(380,.28,.26,'sawtooth',.55,300);tone(520,.62,.14,'sawtooth',.5,640);tone(380,.82,.3,'sawtooth',.55,260);
  }else if(kind==2){ // còi trượt (slide whistle)
   tone(400,.08,.55,'sine',.6,1500);tone(1500,.65,.45,'sine',.6,500);tone(700,1.12,.12,'square',.3);tone(990,1.26,.2,'square',.3);
  }else{ // nhạc xiếc nhảy nhót
   const n=[392,523,659,784,659,523,392,523,587,740,880,740,587,740,659,523];
   n.forEach((f,i)=>{tone(f,.08+i*.12,.1,'square',.3);if(i%2==0)tone(f/4,.08+i*.12,.1,'triangle',.6)});
  }
 }catch(e){}
}

/* ---------------- VẼ XE (động) ---------------- */
const hornDraw=(x,y,dir,k)=>{ // loa phát thanh: dir=+1 hướng phải, -1 hướng trái
 const R=(c,xx,yy,w,h)=>{cx.fillStyle=c;cx.fillRect(Math.round(xx),Math.round(yy),w,h)};
 R('#8d949c',x-dir*2-(dir<0?3:0),y+3,5,4);
 for(let i=0;i<10;i++){const hh=Math.round(3+i*.75+k),xx=x+dir*(i*1.6)-(dir>0?0:1);R(i%3==2?RDK:YEL,xx,y+3-hh/2+1,2,hh);R('rgba(255,255,255,.5)',xx,y+3-hh/2+1,2,1)}
 R(RED,x+dir*16-(dir>0?0:2),y-2-k,2,12+k*2);R(INK,x+dir*14-(dir>0?0:1),y,2,8);
};
function drawVan(tm){
 if(!VAN){VAN=mkVan();VANO=outl(VAN)}
 if(VX<camX-110||VX>camX+vw+110)return;
 const R=(c,x,y,w,h)=>{cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)};
 // lịch phát loa
 if(tm>B.next&&tm-LASTT<1){B.t0=tm;B.next=tm+8+Math.random()*5;B.kind=(B.kind+1+Math.floor(Math.random()*2))%4;B.line=LINES[Math.floor(Math.random()*LINES.length)];
  if(MAP=='ps'){const d=Math.hypot(Pl.x-VX,Pl.y-VB);play(B.kind,Math.max(0,1-d/620)*.11)}
  for(let i=0;i<26;i++)B.conf.push({x:VX-52+(i%2)*104,y:VB-60,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,c:[RED,YEL,TEAL,PNK,BLU,ORG][i%6],t:0,l:1.6+Math.random()});
  for(let i=0;i<4;i++)B.notes.push({x:VX-52+(i%2)*104,y:VB-56,ph:Math.random()*6,t:-i*.25})}
 const a=tm-B.t0,talk=a<B.dur?1:0,k=talk?Math.abs(Math.sin(tm*18))*1.4:0;
 LASTT=tm;
 const bob=talk?Math.round(Math.sin(tm*16)*.8):(Math.sin(tm*9)>.7?1:0);
 const X=Math.round(VX-VW/2),Y=VB-VH+bob;
 cx.drawImage(VANO,X-1,Y-1);
 // đèn bóng nhấp nháy quanh biển tên + mái lều
 const bl=Math.floor(tm*4);
 for(let i=0;i<8;i++){const c=(i+bl)%2?'#fff6a0':RED;R(c,X+53+i*5,Y+32,2,2);R(c,X+53+i*5,Y+45,2,2)}
 for(let i=0;i<6;i++)R((i+bl)%2?YEL:'#fff',X+30+i*8,Y+14,2,2);
 // cờ phấp phới trên đỉnh lều
 R(INK,X+49,Y-9,1,9);{const w=Math.round(Math.sin(tm*6)*1.2);R(RED,X+50,Y-9,6,2);R(RED,X+50,Y-7,5+w,2);R(YEL,X+50,Y-5,4+w,1)}
 // đèn quay trên cabin
 {const on=Math.floor(tm*6)%2;R(on?RED:RDK,X+108,Y+30,5,4);R(on?'#ffb0b0':'#7a2a2a',X+109,Y+30,2,1);if(on){cx.fillStyle='rgba(255,70,70,.18)';cx.beginPath();cx.arc(X+110,Y+32,9,0,6.283);cx.fill()}}
 // chú hề lái xe (nhún nhảy trong kính)
 {const hb=Math.round(Math.sin(tm*3)*1);const hx=X+111,hy=Y+46+hb;
  R(ORG,hx-6,hy-8,4,5);R(BLU,hx+3,hy-8,4,5);R(RED,hx-4,hy-11,8,3);R('#fff6ee',hx-4,hy-8,9,8);R(RED,hx-1,hy-5,3,3);R(INK,hx-3,hy-7,1,1);R(INK,hx+3,hy-7,1,1);
  if(talk){R(RED,hx-2,hy-1,5,2)}else R(RED,hx-2,hy-1,5,1);
  // tay vẫy
  const wv=Math.round(Math.sin(tm*5)*2);R('#fff',hx-9+wv,hy-3,3,3);R(PUR,hx-9,hy+0,2,3)}
 // loa 2 đầu nóc xe
 hornDraw(X+86,Y+3,1,k);hornDraw(X+14,Y+3,-1,k);
 // sóng âm khi phát loa
 if(talk){const ph=(tm*2.2)%1;for(const[sx,dir]of[[X+86+18,1],[X+14-18,-1]])for(let i=0;i<3;i++){const p=(ph+i/3)%1;cx.strokeStyle='rgba(255,230,120,'+((1-p)*.8).toFixed(2)+')';cx.lineWidth=1.5;cx.beginPath();cx.arc(sx,Y+7,4+p*26,dir>0?-1.0:Math.PI-1.0,dir>0?1.0:Math.PI+1.0);cx.stroke()}}
 // ống xả khói nhẹ ở đuôi xe
 for(let i=0;i<4;i++){const p=((tm*.6)+i/4)%1;cx.fillStyle='rgba(235,235,240,'+(.5*(1-p)).toFixed(2)+')';cx.beginPath();cx.arc(X-2-p*10,Y+66-p*14,1.5+p*3,0,6.283);cx.fill()}
 // bóng bay buộc ở thang sau
 [[RED,-3,-34],[YEL,6,-40],[BLU,-10,-28]].forEach(([c,dx,dy],i)=>{const sw=Math.sin(tm*1.6+i*2)*3,bx=X+3+dx+sw,by=Y+30+dy+Math.sin(tm*2+i)*1.5;
  cx.strokeStyle='rgba(60,50,60,.8)';cx.lineWidth=1;cx.beginPath();cx.moveTo(X+3,Y+32);cx.quadraticCurveTo(X+3+dx*.2,Y+32+dy*.5,bx,by);cx.stroke();
  cx.fillStyle=c;cx.beginPath();cx.ellipse(bx,by-5,5,6.2,0,0,6.283);cx.fill();cx.fillStyle='rgba(255,255,255,.55)';cx.fillRect(Math.round(bx-2.5),Math.round(by-9),2,3)});
 // confetti + nốt nhạc
 const dt=.016;
 for(let i=B.conf.length-1;i>=0;i--){const p=B.conf[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=60*dt;if(p.t>p.l||p.y>VB+6){B.conf.splice(i,1);continue}R(p.c,p.x,p.y,2,2)}
 for(let i=B.notes.length-1;i>=0;i--){const n=B.notes[i];n.t+=dt;if(n.t<0)continue;if(n.t>2){B.notes.splice(i,1);continue}
  cx.fillStyle='rgba(255,255,255,'+(1-n.t/2).toFixed(2)+')';cx.font='800 11px Arial,sans-serif';cx.textAlign='center';cx.fillText(i%2?'♪':'♫',n.x+Math.sin(n.t*4+n.ph)*5,n.y-n.t*22)}
 // bong bóng thoại
 if(talk){const txt=B.line;cx.font='800 8px Nunito, Arial, sans-serif';cx.textAlign='center';const w=Math.ceil(cx.measureText(txt).width)+12,bx=Math.round(VX-w/2),by=Y-30-Math.round(Math.sin(a*4)*1),al=Math.min(1,a*4,(B.dur-a)*4);
  cx.globalAlpha=Math.max(0,al);R(INK,bx-1,by-1,w+2,16);R('#fff',bx,by,w,14);R('#fff',VX-3,by+14,6,2);R(INK,VX-4,by+14,1,1);R(INK,VX+3,by+14,1,1);R('#fff',VX-2,by+16,4,1);
  R(YEL,bx,by,w,2);cx.fillStyle=INK;cx.textBaseline='middle';cx.fillText(txt,VX,by+8);cx.textBaseline='alphabetic';cx.globalAlpha=1}
}

/* ---------------- GẮN VÀO PHỐ XÁ ---------------- */
window.circusBuild=H=>{
 H.blk(VX-60,VB-16,VX+60,VB);                                    // thân xe chặn đường đi
 H.dyn(VB,()=>drawVan(tmNow()));
 H.hit(VX-62,VB-VH+10,124,VH-8,'🤡 Xe Hề Xiếc — Vòng quay may mắn • Blind Box Kim Cương • Xé túi Hề • Tiệm Chú Hề','cv:ps:circus',[VX,VB+26]);
};
window.CIRCUS={x:VX,by:VB};

window.circusUI=()=>{
 if(window.PKO&&window.PK&&PK.in){} 
 B.next=tmNow()+9;B.t0=tmNow();B.kind=1;B.line='Hề hề! Chọn trò nào đây bà con ơi! 🤡';
 {const d=Math.hypot(Pl.x-VX,Pl.y-VB);play(1,Math.max(0,1-d/620)*.1)}
 openUI(head('🤡 Xe Hề Xiếc')+
  '<div style="height:10px;border-radius:6px;background:repeating-linear-gradient(90deg,#e63946 0 14px,#fff 14px 28px);margin:2px 0 8px"></div>'+
  '<div style="text-align:center;font-weight:800;color:#6a2fb0;font-size:14px;margin-bottom:8px">“Hề hề! Lại đây chơi với Chú Hề nào!” 🎈</div>'+
  '<button class="b" onclick="circusGo(\'wheel\')" style="display:block;width:100%;margin:6px 0;padding:14px 10px;font-size:16px;font-weight:800;color:#fff;border-radius:14px;border:3px solid #8c1c13;background:linear-gradient(135deg,#ff5a5f 0%,#ff8c1a 50%,#ffd23f 100%);text-shadow:0 2px 0 #8c1c13">🎡 Vòng quay may mắn<br><small style="font-weight:700">Quay trúng Xu & 💎 Kim cương</small></button>'+
  '<button class="b" onclick="circusGo(\'blind\')" style="display:block;width:100%;margin:6px 0;padding:14px 10px;font-size:16px;font-weight:800;color:#fff;border-radius:14px;border:3px solid #0b4f8a;background:linear-gradient(135deg,#22d3ee 0%,#3a86ff 55%,#7c5cff 100%);text-shadow:0 2px 0 #0b4f8a">🎁 Blind Box Kim Cương<br><small style="font-weight:700">20 Xu / hộp • tối đa 30 hộp/ngày • trúng tới 💎 10</small></button>'+
  '<button class=\"b\" onclick=\"circusGo(\'tui\')\" style=\"display:block;width:100%;margin:6px 0;padding:14px 10px;font-size:16px;font-weight:800;color:#fff;border-radius:14px;border:3px solid #8c1c13;background:linear-gradient(135deg,#ff4d6d 0%,#ff8c1a 55%,#ffd23f 100%);text-shadow:0 2px 0 #8c1c13\">🎈 Xé túi Hề<br><small style=\"font-weight:700\">20 Xu / túi • mỗi lần 1 túi • trúng tới 🪙 1000</small></button>'+
  '<button class="b" onclick="circusGo(\'shop\')" style="display:block;width:100%;margin:6px 0;padding:14px 10px;font-size:16px;font-weight:800;color:#fff;border-radius:14px;border:3px solid #4a1d82;background:linear-gradient(135deg,#9b5de5 0%,#3a86ff 55%,#1fb5a6 100%);text-shadow:0 2px 0 #4a1d82">🤡 Tiệm Chú Hề<br><small style="font-weight:700">Mascot Hề Quái Đản</small></button>'+
  '<div style="height:10px;border-radius:6px;background:repeating-linear-gradient(90deg,#1fb5a6 0 14px,#fff 14px 28px);margin:8px 0 2px"></div>');
};
/* ============================================================
   TIỆM CHÚ HỀ — bán Mascot: Hề Quái Đản (clown.js) + Hanbok Nam / Hanbok Nữ (hanbok.js)
   • Giao diện: lưới 3 cột như các shop thường — mỗi món có hình động, tên, GIÁ nằm dưới.
   • Mỗi món cần ĐỦ CẢ 3 thứ (Xu + Xu quái vật + Kim cương) mới mua được; thiếu thứ nào thì nút Mua bị khóa
     và thứ đó hiện màu đỏ ✗.
   • Muốn đổi giá / thêm món: sửa mảng CL_ITEMS bên dưới (k = khóa của set trong SETS, pr = giá).
   ============================================================ */
const CL_ITEMS=[
 {k:'clown',  n:'Hề Quái Đản',  d:'Nón hề cao 2 màu • Không che mặt',               pr:{xu:1500,qv:500,dia:5}},
 {k:'hanbokm',n:'Hanbok (Nam)', d:'Nón gat cao viền đỏ, áo đỏ thêu rắn • Không che mặt', pr:{xu:5000,qv:500,dia:2}},
 {k:'hanbokf',n:'Hanbok (Nữ)',  d:'Búi củ hành cài trâm, áo đỏ thêu rắn • Không che mặt', pr:{xu:5000,qv:500,dia:2}}];
const clIdx=k=>SETS.findIndex(x=>x.k==k);
const clOwn=k=>{const i=clIdx(k);return i>=0&&!!(ST.own&&ST.own.s&&ST.own.s.includes(i))};
const clHave=()=>({xu:ST.xu|0,qv:ST.qv|0,dia:ST.dia|0});
const clMiss=it=>{const h=clHave(),m=[];if(h.xu<it.pr.xu)m.push('🪙 Xu');if(h.qv<it.pr.qv)m.push('Xu quái vật');if(h.dia<it.pr.dia)m.push('💎 Kim cương');return m};
const clQv=()=>window.qvImg?qvImg():'🐙';
const clFmt=n=>n.toLocaleString('vi-VN');
// 3 dòng giá (mỗi dòng đỏ nếu đang thiếu)
function clPriceRows(it,big){const h=clHave(),sz=big?'13px':'10.5px',
 row=(ok,ico,v)=>'<span style="display:block;white-space:nowrap;font-size:'+sz+';font-weight:800;color:'+(ok?'#3a6a2c':'#c0392b')+'">'+ico+' '+v+(big?(ok?' ✓':' ✗'):'')+'</span>';
 return row(h.xu>=it.pr.xu,'🪙',clFmt(it.pr.xu))+row(h.qv>=it.pr.qv,clQv(),clFmt(it.pr.qv))+row(h.dia>=it.pr.dia,'💎',clFmt(it.pr.dia))}
let CLRAF=0,CLV=null,CLD=0;
// vẽ 1 canvas xem trước (K = hệ số phóng)
function clPrev(c,t){const it=CL_ITEMS.find(x=>x.k==c.dataset.k);if(!it)return;const i=clIdx(it.k);if(i<0)return;
 const g=c.getContext('2d'),K=+c.dataset.z||2,A=ST.av||{};g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;
 g.save();g.scale(K,K);const W=c.width/K,H=c.height/K;
 drawAv(g,Math.round(W/2)-10,H-33,{d:[0,3,1,2][Math.floor(t/1.8)%4],a:t,mv:0,sit:0,hair:A.h|0,set:i,e:A.e|0,acc:-1});g.restore()}
function clAnim(){const cs=document.querySelectorAll('canvas.clv');if(!cs.length||!UI){CLRAF=0;return}const t=performance.now()/1000;cs.forEach(c=>clPrev(c,t));CLRAF=requestAnimationFrame(clAnim)}
const CL_TOP=()=>'<div style="height:10px;border-radius:6px;background:repeating-linear-gradient(90deg,#3b32d6 0 14px,#fff 14px 28px);margin:2px 0 8px"></div>';
const CL_BOT=()=>'<div style="height:10px;border-radius:6px;background:repeating-linear-gradient(90deg,#1fb5a6 0 14px,#fff 14px 28px);margin:8px 0 4px"></div>';

/* ---- danh sách: lưới 3 cột ---- */
window.clownShopUI=()=>{CLV='list';
 let h=head('🤡 Tiệm Chú Hề')+CL_TOP()+
  '<div style="text-align:center;font-weight:800;color:#4a1d82;font-size:14px;margin-bottom:6px">“Hề hề! Đồ xịn chỉ có ở tiệm của Chú Hề thôi nha!” 🎪</div>'+
  '<div class="mut" style="text-align:center;margin-bottom:6px">Mỗi món cần <b>đủ cả 3 loại</b>: 🪙 Xu • '+clQv()+' Xu quái vật • 💎 Kim cương</div>'+
  '<div class="sg" style="grid-template-columns:repeat(3,1fr)">'+
  CL_ITEMS.map(it=>{const own=clOwn(it.k);
   return '<button class="sq'+(own?' z':'')+'" onclick="clownItem(\''+it.k+'\')" style="padding:6px 3px;gap:3px">'+
    '<canvas class="clv" data-k="'+it.k+'" data-z="2" width="52" height="66" style="width:78px;height:99px;max-width:100%;image-rendering:pixelated;border-radius:8px;background:linear-gradient(#e4dcfa,#f6eefc 70%,#dcccf0 70%)"></canvas>'+
    '<b>'+it.n+'</b>'+
    (own?'<small>✓ Đã có</small>':'<span style="display:flex;flex-direction:column;align-items:center;gap:1px;margin-top:1px">'+clPriceRows(it)+'</span>')+
    '</button>'}).join('')+'</div>'+
  '<div class="mut" style="margin-top:6px">Chạm vào món để xem rõ & mua. Đồ đã mua nằm ở 🎒 Túi › Set.</div>'+CL_BOT()+
  '<button class="b" onclick="circusUI()" style="display:block;width:100%;margin-top:4px">← Quay lại Xe Hề</button>';
 openUI(h);document.querySelectorAll('canvas.clv').forEach(c=>clPrev(c,performance.now()/1000));
 if(!CLRAF)CLRAF=requestAnimationFrame(clAnim)};

/* ---- chi tiết 1 món: hình lớn xoay + giá + nút Mua ---- */
window.clownItem=k=>{const it=CL_ITEMS.find(x=>x.k==k);if(!it)return clownShopUI();CLV='item';
 const own=clOwn(k),miss=own?[]:clMiss(it),can=!own&&!miss.length;
 openUI(head('🤡 '+it.n)+CL_TOP()+
  '<div style="border-radius:14px;padding:8px;background:linear-gradient(180deg,#efe6ff,#ffe3f3);border:3px solid #4a1d82;text-align:center">'+
  '<canvas class="clv" data-k="'+k+'" data-z="3" width="150" height="231" style="width:150px;height:231px;image-rendering:pixelated;border-radius:10px;background:linear-gradient(#cdbdf5,#efe6ff 70%,#d9c8f0 70%)"></canvas>'+
  '<div style="font-weight:900;font-size:17px;color:#3b32d6;margin:4px 0 2px">'+it.n+'</div>'+
  '<div class="mut" style="margin-bottom:6px">'+it.d+'</div>'+
  (own?'<button class="b w z" disabled style="font-weight:800">✓ Đã có — mở 🎒 Túi › Set để mặc</button>'
   :'<div style="display:inline-flex;flex-direction:column;gap:2px;align-items:flex-start;background:#fff8;border-radius:10px;padding:6px 14px;margin-bottom:8px">'+clPriceRows(it,1)+'</div><br>'+
    (can?'<button class="b w" onclick="clownBuy(\''+k+'\')" style="font-weight:800;color:#fff;border:3px solid #4a1d82;border-radius:12px;background:linear-gradient(135deg,#9b5de5,#3a86ff);text-shadow:0 1px 0 #4a1d82">🛒 Mua</button>'
        :'<button class="b w z" disabled style="font-weight:800">🔒 Chưa đủ để mua</button><div class="mut" style="margin-top:4px;color:#c0392b">Còn thiếu: '+miss.join(', ')+'</div>'))+
  '</div>'+CL_BOT()+
  '<button class="b" onclick="clownShopUI()" style="display:block;width:100%;margin-top:4px">← Quay lại Tiệm</button>');
 document.querySelectorAll('canvas.clv').forEach(c=>clPrev(c,performance.now()/1000));
 if(!CLRAF)CLRAF=requestAnimationFrame(clAnim)};

window.clownBuy=k=>{const it=CL_ITEMS.find(x=>x.k==k),i=clIdx(k);if(!it||i<0)return;ST.own=ST.own||{};ST.own.s=ST.own.s||[];
 if(ST.own.s.includes(i))return toast('✓ Bạn đã có '+it.n+' rồi, mở 🎒 Túi để mặc');
 const miss=clMiss(it);                                       // phải ĐỦ CẢ 3 loại, thiếu 1 loại là không mua được
 if(miss.length)return toast('🤡 Chú Hề: “Bạn còn thiếu: '+miss.join(', ')+'”');
 ST.xu-=it.pr.xu;ST.qv=(ST.qv|0)-it.pr.qv;ST.dia=(ST.dia|0)-it.pr.dia;ST.own.s.push(i);
 try{xuUp()}catch(e){}save();
 toast('🎉 Chú Hề: “Hề hề! Chúc mừng bạn nhận được '+it.n+'!”\nMở 🎒 Túi → Set để mặc');clownItem(k)};

window.circusGo=w=>{
 if(w=='wheel')return wheelUI();
 if(w=='blind')return lbxUI();
 if(w=='tui')return tuUI();
 clownShopUI();
};

/* ============================================================
   VÒNG QUAY MAY MẮN (đã dời từ sạp cũ ở vỉa hè dưới) — giao diện màu hề
   vé nhận khi giao khí cầu • 20 Xu/lượt nếu không có vé • ô Kim cương rất hiếm
   ============================================================ */
const WHS=[{xu:2,c:'#ff4d6d',t:'2',tc:'#fff'},{xu:20,c:'#ffd23f',t:'20',tc:'#4a1d82'},{xu:5,c:'#1fc8b8',t:'5',tc:'#fff'},{dia:1,c:'#9b5de5',t:'💎',tc:'#fff'},{xu:10,c:'#ff8c1a',t:'10',tc:'#fff'},{xu:50,c:'#3a86ff',t:'50',tc:'#fff'}];
const WH_COST=20,WH_PITY=100,WH_PMIN=90,WHP=[.435,.09,.24,.035,.15,.05]; // tỉ lệ từng ô; 💎 = 3.5%, bảo hiểm chắc chắn có trong 90–100 lượt
const whS=()=>{if(!ST.wh||typeof ST.wh!='object')ST.wh={n:0,p:0};if(!(ST.wh.p>=0))ST.wh.p=0;if(!(ST.wh.th>=WH_PMIN&&ST.wh.th<=WH_PITY))ST.wh.th=WH_PMIN+Math.floor(Math.random()*(WH_PITY-WH_PMIN+1));if(!(ST.wh.n>=0))ST.wh.n=0;return ST.wh};
function whRoll(){const W=whS();W.n++;W.p++;let i=0;
 if(W.p>=W.th)i=3;else{const u=Math.random();let a=0;for(let k=0;k<6;k++){a+=WHP[k];if(u<a){i=k;break}}}
 if(i==3){W.p=0;W.th=WH_PMIN+Math.floor(Math.random()*(WH_PITY-WH_PMIN+1))}return i}
const whName=i=>WHS[i].dia?'💎 1 Kim cương':'🪙 '+WHS[i].xu+' Xu';
let WTH=0,WA=null,WTOK=0,WLOOP=0,CONF=[];
function whDraw(c,th){const g=c.getContext('2d'),W=c.width,cxp=W/2,cyp=W/2+14,R=W/2-20,tm=performance.now()/1000;g.clearRect(0,0,W,c.height);
 // chân đế + bóng
 g.fillStyle='rgba(0,0,0,.12)';g.beginPath();g.ellipse(cxp,cyp+R+14,R*.8,6,0,0,7);g.fill();
 g.save();g.translate(cxp,cyp);
 // viền kẹo sọc đỏ-trắng
 for(let i=0;i<24;i++){const a0=i/24*Math.PI*2+th*.0,a1=a0+Math.PI*2/24;g.fillStyle=i%2?'#fff':'#e63946';g.beginPath();g.moveTo(0,0);g.arc(0,0,R+11,a0,a1);g.closePath();g.fill()}
 g.fillStyle='#4a1d82';g.beginPath();g.arc(0,0,R+4,0,7);g.fill();
 g.rotate(th);
 for(let i=0;i<6;i++){const a0=-Math.PI/2+i*Math.PI/3,a1=a0+Math.PI/3,s=WHS[i];
  g.fillStyle=s.c;g.beginPath();g.moveTo(0,0);g.arc(0,0,R,a0,a1);g.closePath();g.fill();
  // họa tiết hề: đường chéo sáng + chấm bi
  g.save();g.clip();g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.moveTo(0,0);g.arc(0,0,R,a0,a0+Math.PI/6);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.35)';for(const q of[.38,.8]){const am=a0+Math.PI/6+(q>.5?.22:-.22);g.beginPath();g.arc(Math.cos(am)*R*q,Math.sin(am)*R*q,3,0,7);g.fill()}g.restore();
  g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a0)*R,Math.sin(a0)*R);g.stroke();
  g.save();g.rotate(a0+Math.PI/6+Math.PI/2);g.textAlign='center';g.textBaseline='middle';
  g.font='900 26px Nunito,Arial,sans-serif';g.lineJoin='round';g.lineWidth=5;g.strokeStyle='#2a1540';g.strokeText(s.t,0,-R*.62);g.fillStyle=s.tc=='#fff'?'#fff':'#fff6a0';g.fillText(s.t,0,-R*.62);
  if(s.xu){g.font='900 11px Nunito,Arial,sans-serif';g.lineWidth=4;g.strokeText('Xu',0,-R*.62+19);g.fillStyle='#fff';g.fillText('Xu',0,-R*.62+19)}g.restore()}
 // tâm: mũi hề đỏ
 g.fillStyle='#ffd23f';g.beginPath();g.arc(0,0,19,0,7);g.fill();g.strokeStyle='#4a1d82';g.lineWidth=3;g.stroke();
 g.fillStyle='#e63946';g.beginPath();g.arc(0,0,13,0,7);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(-4,-4,4,0,7);g.fill();
 g.restore();
 // bóng đèn nhấp nháy quanh viền
 const bl=Math.floor(tm*3.5);for(let i=0;i<24;i++){const a=i/24*Math.PI*2;g.fillStyle=(i+bl)%2?'#fff6a0':'#ff9ec8';g.beginPath();g.arc(cxp+Math.cos(a)*(R+7.5),cyp+Math.sin(a)*(R+7.5),2.7,0,7);g.fill();g.strokeStyle='#4a1d82';g.lineWidth=.8;g.stroke()}
 // kim chỉ: mũ hề / tam giác sọc
 g.fillStyle='#ffd23f';g.strokeStyle='#4a1d82';g.lineWidth=2.5;g.beginPath();g.moveTo(cxp,cyp-R+10);g.lineTo(cxp-12,cyp-R-20);g.lineTo(cxp+12,cyp-R-20);g.closePath();g.fill();g.stroke();
 g.fillStyle='#e63946';g.beginPath();g.moveTo(cxp,cyp-R+4);g.lineTo(cxp-7,cyp-R-14);g.lineTo(cxp+7,cyp-R-14);g.closePath();g.fill();
 g.fillStyle='#fff';g.beginPath();g.arc(cxp,cyp-R-22,4,0,7);g.fill();g.stroke();
 // confetti khi trúng
 for(let i=CONF.length-1;i>=0;i--){const p=CONF[i];p.t+=.016;p.x+=p.vx*.016;p.y+=p.vy*.016;p.vy+=260*.016;p.r+=p.vr*.016;if(p.t>p.l||p.y>c.height+8){CONF.splice(i,1);continue}
  g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-2.5,-1.5,5,3);g.restore()}
}
function whLoop(id){const c=$('whc');if(!c||!UI||id!=WLOOP)return;
 if(WA){const e=Math.min(1,(performance.now()-WA.t0)/WA.d);WTH=WA.f+(WA.to-WA.f)*(1-Math.pow(1-e,3.2));if(e>=1){const fn=WA.fin;WA=null;WTH%=Math.PI*2;fn()}}
 whDraw(c,WTH);requestAnimationFrame(()=>whLoop(id))}
function whInfo(){const el=$('whi');if(!el)return;const tk=ST.tk|0,W=whS(),busy=!!WA;
 el.innerHTML='<div class="sg" style="grid-template-columns:repeat(3,1fr)"><div class="sq" style="cursor:default;background:#ffe9a855"><span class="e">🎟️</span><b>'+tk+'</b><small>Vé quay</small></div><div class="sq" style="cursor:default;background:#ffb3c855"><span class="e">🪙</span><b>'+fmtXu(ST.xu)+'</b><small>Xu</small></div><div class="sq" style="cursor:default;background:#c9a8ff55"><span class="e">💎</span><b>'+(ST.dia|0)+'</b><small>Kim cương</small></div></div>'+
 '<div class="mut" style="text-align:center;margin:4px 0">Mỗi đơn khí cầu giao xong = 1 vé • Hết vé quay tốn '+WH_COST+' Xu/lượt</div>';
 const b=$('whb');if(!b)return;const useT=Math.min(tk,10),cost10=(10-useT)*WH_COST,ok1=!busy&&(tk>0||ST.xu>=WH_COST),ok10=!busy&&ST.xu>=cost10;
 const st1=ok1?' style="font-weight:800;color:#fff;border:3px solid #8c1c13;border-radius:12px;background:linear-gradient(135deg,#ff5a5f,#ff8c1a);text-shadow:0 1px 0 #8c1c13"':'',st2=ok10?' style="font-weight:800;color:#fff;border:3px solid #4a1d82;border-radius:12px;background:linear-gradient(135deg,#9b5de5,#3a86ff);text-shadow:0 1px 0 #4a1d82"':'';
 b.innerHTML='<button class="b w'+(ok1?'':' z')+'" onclick="whGo(1)"'+st1+'>🎡 Quay 1 lần ('+(tk>0?'dùng 1 vé':WH_COST+' Xu')+')</button><button class="b w'+(ok10?'':' z')+'" onclick="whGo(10)"'+st2+'>⚡ Quay nhanh x10 ('+(useT?useT+' vé':'')+(useT&&cost10?' + ':'')+(cost10?cost10+' Xu':'')+')</button>'}
window.wheelUI=()=>{WA=null;whS();CONF=[];
 openUI(head('🎪 Vòng quay may mắn')+
  '<div style="border-radius:14px;padding:6px;background:linear-gradient(180deg,#fff7e0,#ffe3f0)">'+
  '<div style="height:9px;border-radius:5px;background:repeating-linear-gradient(90deg,#e63946 0 14px,#fff 14px 28px);margin-bottom:4px"></div>'+
  '<div style="text-align:center"><canvas id="whc" width="260" height="290" style="width:100%;max-width:240px"></canvas></div>'+
  '<div id="whr" style="text-align:center;min-height:38px;font-weight:800;color:#4a1d82;font-size:14px;margin:2px 0">🤡 Chú Hề: “Quay đi quay đi, trúng lớn nha!”</div><div id="whb" class="pf"></div><div id="whi"></div>'+
  '<div style="height:9px;border-radius:5px;background:repeating-linear-gradient(90deg,#1fb5a6 0 14px,#fff 14px 28px);margin:6px 0 4px"></div>'+
  '<button class="b" onclick="circusUI()" style="display:block;width:100%;margin-top:4px">← Quay lại Xe Hề</button></div>');
 whInfo();whLoop(++WLOOP)};
window.whGo=n=>{if(WA)return;const tk=ST.tk|0,useT=Math.min(tk,n),cost=(n-useT)*WH_COST;
 if(ST.xu<cost||(n==1&&!tk&&ST.xu<WH_COST))return toast('🪙 Không đủ Xu để quay (cần '+cost+' Xu)');
 ST.tk=tk-useT;ST.xu-=cost;
 const res=[];for(let k=0;k<n;k++){const i=whRoll();res.push(i);const s=WHS[i];if(s.xu)ST.xu+=s.xu;else ST.dia=(ST.dia|0)+s.dia}
 let xpGot=0,lvMsg='';if(n==10&&ST.lv<100){xpGot=1+Math.floor(Math.random()*2);lvMsg=addExp(xpGot)}   // x10: cả lượt quay nhanh chỉ nhận ngẫu nhiên 1-2 EXP 1 lần (quay lẻ x1 không có)
 xuUp();save();
 const last=res[res.length-1];let msg;
 if(n==1)msg=res[0]==3?'💎 KIM CƯƠNG!!! Chúc mừng bạn!':'🎉 Trúng '+whName(res[0])+'!';
 else{const c={};res.forEach(i=>c[i]=(c[i]||0)+1);const xu=res.reduce((a,i)=>a+(WHS[i].xu||0),0),dia=c[3]||0;
  msg='⚡ x10: '+Object.keys(c).sort((a,b)=>WHS[a].xu-WHS[b].xu).map(i=>(WHS[i].dia?'💎':WHS[i].xu+' Xu')+' ×'+c[i]).join(' • ')+'<br>Tổng: +'+xu+' Xu'+(dia?' • +'+dia+' 💎':'')+(xpGot?' • +'+xpGot+' EXP'+lvMsg.replace(/\\n/g,'<br>'):'')}
 const from=WTH%(Math.PI*2),jit=(Math.random()-.5)*Math.PI/3*.7,to=from+Math.PI*2*(n==1?5:2)+(((-(last+.5)*Math.PI/3+jit)-from)%(Math.PI*2)+Math.PI*2)%(Math.PI*2),tok=++WTOK,
  boom=()=>{const c=$('whc');if(!c)return;for(let i=0;i<(res.includes(3)?90:45);i++)CONF.push({x:c.width/2,y:c.height/2,vx:(Math.random()-.5)*340,vy:-120-Math.random()*220,r:Math.random()*6,vr:(Math.random()-.5)*14,c:['#e63946','#ffd23f','#1fc8b8','#ff7eb6','#3a86ff','#ff8c1a','#9b5de5'][i%7],t:0,l:1.8+Math.random()})},
  fin=()=>{const r=$('whr');if(r)r.innerHTML=msg;whInfo();boom();play(res.includes(3)?2:0,.05);if(res.includes(3))toast('💎 Bạn vừa trúng Kim cương!')};
 WA={t0:performance.now(),d:n==1?3200:1500,f:from,to,fin};whInfo();const r=$('whr');if(r)r.textContent='🎡 Đang quay...';
 setTimeout(()=>{if(WA&&WTOK==tok){WA=null;WTH=to%(Math.PI*2);toast(msg.replace(/<br>/g,' '));whInfo()}},(n==1?3200:1500)+250);
};

/* ============================================================
   BLIND BOX KIM CƯƠNG — 20 Xu / hộp • tối đa 30 hộp/ngày • mỗi lần chỉ 1 hộp • chạm 3–5 lần để khui
   • Quà được bốc lúc mua và lưu vào ST.lbx.pen (thoát game giữa chừng vẫn mở tiếp được), trao quà khi khui xong
   • CÂN BẰNG KINH TẾ: chỉnh tỉ lệ ở bảng LBT bên dưới (p = % , tổng = 100)
   ============================================================ */
const LB_COST=20,LB_DAY=30;   // giới hạn 30 hộp / ngày (reset theo ngày máy, giống nhiệm vụ hằng ngày)
const LBT=[
 {k:'Thường',p:66,xu:20,c:'#3a86ff',c2:'#9fd0ff'},
 {k:'Trung', p:29,xu:50,c:'#9b5de5',c2:'#e0c6ff'},
 {k:'Hiếm',  p:4.5,dia:1, c:'#ff8c1a',c2:'#ffe27a'},
 {k:'Secret',p:.5,dia:10,c:'#ff3d7f',c2:'#fff6a0'}];
const lbRoll=()=>{const u=Math.random()*100;let a=0;for(let i=0;i<LBT.length;i++){a+=LBT[i].p;if(u<a)return i}return 0};
function lbS(){if(!ST.lbx||typeof ST.lbx!='object')ST.lbx={n:0,pen:null};const B=ST.lbx,p=B.pen;
 if(p&&!(p.t>=0&&p.t<LBT.length&&p.need>=3&&p.need<=5&&p.tap>=0&&p.tap<p.need))B.pen=null;if(!(B.n>=0))B.n=0;const dk=new Date().toDateString();if(B.dd!=dk||!(B.dc>=0)){B.dd=dk;B.dc=0}return B}
let LBLOOP=0,LBO=null,LBD=null,LBP=[],LBSH=0;
function lbSnd(k,i){const ac=window.__cvAC;if(!ac||!window.CV||CV.snd===0)return;
 try{if(ac.state=='suspended')ac.resume();const t=ac.currentTime+.01,o=ac.createOscillator(),g=ac.createGain();o.type='square';
  const f=k==0?300+i*80:150;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*(k==0?1.6:.6),t+.1);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.15);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.18)}catch(e){}}
function lbPrize(g,t,x,y,s){
 g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 if(t.xu){g.fillStyle='#ffd23f';g.strokeStyle='#7a4a00';g.lineWidth=3;g.beginPath();g.arc(x,y,24*s,0,7);g.fill();g.stroke();
  g.fillStyle='#ffb300';g.beginPath();g.arc(x,y,17*s,0,7);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(x-8*s,y-8*s,4*s,0,7);g.fill();
  g.font='900 '+Math.round(17*s)+'px Nunito,Arial,sans-serif';g.lineWidth=4;g.strokeStyle='#7a4a00';g.strokeText(t.xu,x,y+1);g.fillStyle='#fff';g.fillText(t.xu,x,y+1)}
 else{const w=22*s;g.fillStyle='#5fe0ff';g.strokeStyle='#12557f';g.lineWidth=3;g.beginPath();g.moveTo(x-w,y-w*.35);g.lineTo(x-w*.5,y-w*.95);g.lineTo(x+w*.5,y-w*.95);g.lineTo(x+w,y-w*.35);g.lineTo(x,y+w*1.05);g.closePath();g.fill();g.stroke();
  g.fillStyle='#b9f3ff';g.beginPath();g.moveTo(x-w*.5,y-w*.95);g.lineTo(x-w*.2,y-w*.35);g.lineTo(x-w,y-w*.35);g.closePath();g.fill();
  g.fillStyle='#2bb6e0';g.beginPath();g.moveTo(x-w*.2,y-w*.35);g.lineTo(x+w*.2,y-w*.35);g.lineTo(x,y+w*1.05);g.closePath();g.fill();
  g.strokeStyle='#12557f';g.lineWidth=2;g.beginPath();g.moveTo(x-w,y-w*.35);g.lineTo(x+w,y-w*.35);g.moveTo(x-w*.5,y-w*.95);g.lineTo(x-w*.2,y-w*.35);g.lineTo(x,y+w*1.05);g.moveTo(x+w*.5,y-w*.95);g.lineTo(x+w*.2,y-w*.35);g.stroke();
  if(t.dia>1){g.font='900 '+Math.round(20*s)+'px Nunito,Arial,sans-serif';g.lineWidth=5;g.strokeStyle='#12557f';g.strokeText('×'+t.dia,x+w*1.05,y+w*.9);g.fillStyle='#fff';g.fillText('×'+t.dia,x+w*1.05,y+w*.9)}}}
function lbBox(g,lift,frac,tap,open){ // gốc toạ độ = giữa đáy hộp
 const INK='#2a1540';g.lineJoin='round';g.lineWidth=3;g.strokeStyle=INK;
 // thân
 g.fillStyle='#e63946';g.fillRect(-48,-70,96,70);g.fillStyle='#b3202e';g.fillRect(-48,-10,96,10);
 g.fillStyle='rgba(255,255,255,.22)';for(let i=0;i<4;i++)for(let j=0;j<3;j++)if((i+j)%2==0){g.beginPath();g.arc(-39+i*26,-52+j*20,3,0,7);g.fill()}
 g.fillStyle='#ffd23f';g.fillRect(-9,-70,18,70);g.strokeRect(-48,-70,96,70);
 g.strokeStyle='rgba(42,21,64,.55)';g.lineWidth=2;g.beginPath();g.moveTo(-9,-70);g.lineTo(-9,0);g.moveTo(9,-70);g.lineTo(9,0);g.stroke();g.lineWidth=3;g.strokeStyle=INK;
 if(open){g.fillStyle='#4a1d82';g.fillRect(-46,-70,92,7)}
 else{g.fillStyle='rgba(255,255,255,.92)';g.font='900 26px Nunito,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('?',-29,-35);g.fillText('?',29,-35)}
 // vết nứt sáng theo số lần chạm
 if(!open&&tap>0){g.strokeStyle='#fff6a0';g.lineWidth=2.5;const Z=[[-32,-62,-26,-50,-34,-40,-28,-26],[26,-62,32,-48,24,-38,31,-22],[-4,-62,-14,-54,-6,-44,-16,-34],[16,-62,10,-52,19,-42,8,-30],[-20,-62,-12,-48,-22,-34,-14,-18]];
  for(let k=0;k<Math.min(tap,5);k++){const z=Z[k];g.beginPath();g.moveTo(z[0],z[1]);for(let q=2;q<z.length;q+=2)g.lineTo(z[q],z[q+1]);g.stroke()}g.lineWidth=3;g.strokeStyle=INK}
 // ánh sáng lọt qua khe nắp
 if(!open&&lift>2){g.fillStyle='rgba(255,246,160,'+(.45+.5*frac).toFixed(2)+')';g.fillRect(-46,-70-lift,92,lift);
  g.fillStyle='rgba(255,246,160,'+(.12+.2*frac).toFixed(2)+')';g.beginPath();g.moveTo(-46,-70-lift);g.lineTo(-70,-70-lift-70);g.lineTo(70,-70-lift-70);g.lineTo(46,-70-lift);g.closePath();g.fill()}
}
function lbLid(g,ox,oy){ // nắp + nơ, gốc = đáy nắp
 const INK='#2a1540';g.lineJoin='round';g.lineWidth=3;g.strokeStyle=INK;
 g.fillStyle='#ff5a5f';g.fillRect(-54,-26,108,26);g.fillStyle='#ffd23f';g.fillRect(-9,-26,18,26);g.strokeRect(-54,-26,108,26);
 g.fillStyle='rgba(255,255,255,.3)';g.fillRect(-52,-24,104,4);
 g.fillStyle='#ffd23f';for(const sx of[-1,1]){g.beginPath();g.ellipse(sx*15,-34,15,10,sx*-.45,0,7);g.fill();g.stroke()}
 g.fillStyle='#ffb300';g.beginPath();g.arc(0,-30,8,0,7);g.fill();g.stroke()}
function lbDraw(c,tm){
 const g=c.getContext('2d'),W=c.width,H=c.height,CX=W/2,BY=212,B=lbS(),p=B.pen;g.clearRect(0,0,W,H);
 // bục
 g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(CX,BY+10,86,11,0,0,7);g.fill();
 g.fillStyle='#4a1d82';g.beginPath();g.ellipse(CX,BY+4,86,12,0,0,7);g.fill();g.fillStyle='#ffd23f';g.beginPath();g.ellipse(CX,BY+1,82,10,0,0,7);g.fill();
 g.fillStyle='#e63946';for(let i=0;i<10;i++){const a=i/10*Math.PI*2;g.beginPath();g.arc(CX+Math.cos(a)*68,BY+1+Math.sin(a)*8,2.4,0,7);g.fill()}
 const now=performance.now()/1000;
 if(LBO){ // ----- đang khui / vừa khui xong -----
  const t=now-LBO.t0,T=LBT[LBO.t],ease=e=>1-Math.pow(1-Math.min(1,Math.max(0,e)),3);
  // tia sáng
  const ra=Math.min(1,t*4)*(t>1.6?Math.max(.3,1-(t-1.6)*.6):1);g.save();g.translate(CX,BY-70);g.rotate(t*.6);g.globalAlpha=.55*ra;g.fillStyle=T.c2;
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.moveTo(0,0);g.arc(0,0,150*Math.min(1,t*3),a,a+Math.PI/18);g.closePath();g.fill()}g.restore();
  if(!LBO.sp){LBO.sp=1;const n=T.dia?(T.dia>=10?110:70):45,cols=['#e63946','#ffd23f','#1fc8b8','#ff7eb6','#3a86ff','#ff8c1a','#9b5de5',T.c,T.c2];
   for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,v=130+Math.random()*230;LBP.push({x:CX,y:BY-70,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6,vr:(Math.random()-.5)*14,c:cols[i%cols.length],t:0,l:1.4+Math.random()*.9})}}
  g.save();g.translate(CX,BY);lbBox(g,0,0,0,true);g.restore();
  // quà trồi lên
  const pe=ease((t-.12)/.7),py=BY-70-pe*88+(pe>=1?Math.sin(now*3)*3:0),ps=(LBO.t>=3?1.45:1.15)*(pe<1?pe*1.1:1)+ (pe>=1?Math.sin(now*4)*.03:0);
  if(pe>0){lbPrize(g,T,CX,py,ps);}
  // nhãn hạng
  if(t>.35){g.save();g.globalAlpha=Math.min(1,(t-.35)*4);g.textAlign='center';g.textBaseline='middle';g.font='900 '+(LBO.t>=3?27:22)+'px Nunito,Arial,sans-serif';g.lineJoin='round';g.lineWidth=6;g.strokeStyle='#2a1540';
   const lb=T.k.toUpperCase()+(LBO.t>=2?'!':'');g.strokeText(lb,CX,26);g.fillStyle=T.c2;g.fillText(lb,CX,26);g.restore()}
  // nắp bay
  if(t<1.3){const lx=CX+t*70,ly=BY-70-(-300*t+420*t*t),al=Math.max(0,1-t/1.3);g.save();g.globalAlpha=al;g.translate(lx,ly);g.rotate(t*3.2);lbLid(g);g.restore()}
  if(t>1.0&&!LBO.fin){LBO.fin=1;const r=$('lbxr');if(r)r.innerHTML='<span style="color:'+T.c+'">'+T.k+'</span> • '+(T.dia?'💎 +'+T.dia+' Kim cương':'🪙 +'+T.xu+' Xu');lbInfo()}
 }else if(p){ // ----- hộp đang chờ khui -----
  let off=0,land=1;if(LBD){const e=(performance.now()-LBD.t0)/650;if(e<1){land=0;off=-260*Math.pow(1-e,2)}else{LBD=null;LBSH=.9;lbSnd(1,0)}}
  const frac=p.tap/p.need;LBSH*=.88;if(LBSH<.01)LBSH=0;
  const dx=Math.sin(now*70)*LBSH*7,rot=Math.sin(now*55)*LBSH*.07,sq=LBSH*.07,idle=land&&!LBSH&&p.tap==0?Math.sin(now*2.4)*1.5:0;
  g.save();g.translate(CX+dx,BY+off+idle);g.rotate(rot);g.scale(1+sq,1-sq*.8);
  const lift=2+frac*9+(LBSH>0?LBSH*3:0);lbBox(g,lift,frac,p.tap,false);
  g.save();g.translate(0,-70-lift);lbLid(g);g.restore();g.restore();
  if(LBD)LBD.ph=1;
 }else{ // ----- chưa có hộp: vài ngôi sao lấp lánh -----
  for(let i=0;i<5;i++){const a=now*.6+i*1.9,x=CX+Math.cos(a)*(40+i*14),y=BY-60+Math.sin(a*1.3)*(26+i*6),s=2+Math.abs(Math.sin(now*3+i))*2;g.fillStyle=i%2?'#ffd23f':'#9fd0ff';g.fillRect(x-s/2,y-s/2,s,s);g.fillRect(x-s*1.4,y-.5,s*2.8,1);g.fillRect(x-.5,y-s*1.4,1,s*2.8)}
 }
 // hạt confetti
 for(let i=LBP.length-1;i>=0;i--){const q=LBP[i];q.t+=.016;q.x+=q.vx*.016;q.y+=q.vy*.016;q.vy+=300*.016;q.r+=q.vr*.016;if(q.t>q.l||q.y>H+8){LBP.splice(i,1);continue}
  g.save();g.translate(q.x,q.y);g.rotate(q.r);g.globalAlpha=Math.min(1,(q.l-q.t)*3);g.fillStyle=q.c;g.fillRect(-3,-2,6,4);g.restore()}
}
function lbLoop(id){const c=$('lbxc');if(!c||!UI||id!=LBLOOP)return;lbDraw(c,0);requestAnimationFrame(()=>lbLoop(id))}
function lbInfo(){const el=$('lbxi');if(!el)return;const B=lbS(),busy=!!B.pen||(LBO&&!LBO.fin);
 el.innerHTML='<div class="sg" style="grid-template-columns:repeat(2,1fr)"><div class="sq" style="cursor:default;min-height:54px;background:#ffb3c855"><b style="font-size:15px">🪙 '+fmtXu(ST.xu)+'</b></div><div class="sq" style="cursor:default;min-height:54px;background:#c9a8ff55"><b style="font-size:15px">💎 '+(ST.dia|0)+'</b></div></div>'+'<div class="mut" style="text-align:center;margin:4px 0">Hôm nay: <b>'+B.dc+'/'+LB_DAY+'</b> hộp • làm mới mỗi ngày</div>';
 const b=$('lbxb');if(!b)return;b.style.display=busy?'none':'';
 if(!busy){const left=LB_DAY-B.dc,ok=ST.xu>=LB_COST&&left>0;b.innerHTML='<button class="b w'+(ok?'':' z')+'" onclick="lbxBuy()"'+(ok?' style="font-weight:800;color:#fff;border:3px solid #0b4f8a;border-radius:12px;background:linear-gradient(135deg,#22d3ee,#3a86ff,#7c5cff);text-shadow:0 1px 0 #0b4f8a"':'')+'>'+(left>0?'🎁 Mua hộp — '+LB_COST+' Xu':'🌙 Hết lượt hôm nay — mai quay lại nhé')+'</button>'}}
window.lbxUI=()=>{lbS();LBO=null;LBD=null;LBP=[];LBSH=0;
 const bar=(a,b)=>'<div style="height:9px;border-radius:5px;background:repeating-linear-gradient(90deg,'+a+' 0 14px,'+b+' 14px 28px);margin:4px 0"></div>';
 openUI(head('🎁 Blind Box Kim Cương')+
  '<div style="border-radius:14px;padding:6px;background:linear-gradient(180deg,#e6f7ff,#f3e6ff)">'+bar('#22d3ee','#fff')+
  '<div style="text-align:center"><canvas id="lbxc" width="260" height="250" onpointerdown="lbxTap(event)" style="width:100%;max-width:250px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none"></canvas></div>'+
  '<div id="lbxr" style="text-align:center;min-height:30px;font-weight:800;color:#4a1d82;font-size:15px;margin:2px 0"></div><div id="lbxb" class="pf"></div><div id="lbxi"></div>'+
  '<div class="sg" style="grid-template-columns:repeat(2,1fr);margin-top:6px">'+LBT.map(t=>'<div class="sq" style="cursor:default;min-height:62px;background:'+t.c+';color:#fff"><small style="color:#fff;opacity:.92">'+t.k+' • '+t.p+'%</small><b style="font-size:15px">'+(t.dia?'💎 '+t.dia+' Kim cương':'🪙 '+t.xu+' Xu')+'</b></div>').join('')+'</div>'+
  bar('#7c5cff','#fff')+
  '<button class="b" onclick="circusUI()" style="display:block;width:100%;margin-top:4px">← Quay lại Xe Hề</button></div>');
 lbInfo();lbLoop(++LBLOOP)};
window.lbxBuy=()=>{const B=lbS();if(B.pen||(LBO&&!LBO.fin))return;
 if(B.dc>=LB_DAY)return toast('🌙 Hôm nay bạn đã mở đủ '+LB_DAY+' hộp rồi, mai quay lại nhé!');
 if(ST.xu<LB_COST)return toast('🪙 Không đủ Xu (cần '+LB_COST+' Xu)');
 ST.xu-=LB_COST;B.dc++;B.pen={t:lbRoll(),need:3+Math.floor(Math.random()*3),tap:0};LBO=null;LBP=[];LBD={t0:performance.now()};LBSH=0;
 const r=$('lbxr');if(r)r.textContent='';xuUp();save();lbInfo();lbSnd(1,0)};
window.lbxTap=e=>{if(e&&e.preventDefault)e.preventDefault();const B=lbS(),p=B.pen;if(!p||LBD||LBO)return;
 p.tap++;LBSH=1;
 if(p.tap<p.need){lbSnd(0,p.tap);save();return}
 // khui!
 const T=LBT[p.t];B.pen=null;B.n++;if(T.xu)ST.xu+=T.xu;else ST.dia=(ST.dia|0)+T.dia;
 LBO={t0:performance.now()/1000,t:p.t};xuUp();save();lbInfo();
 play(p.t>=2?2:0,.06);if(p.t>=2)toast(p.t==3?'💎 SECRET! +10 Kim cương!!!':'💎 Trúng Kim cương!')};
/* ============================================================
   XÉ TÚI HỀ — 20 Xu / túi • mỗi lần chỉ mua 1 túi (xé xong mới mua tiếp) • mỗi túi chạm 3 lần để xé
   • Túi Hề cấp 1: nhận lại 20 Xu • Túi Hề cấp 2: nhận 50 Xu • Túi Hề VIP: nhận 1000 Xu
   • CÂN BẰNG KINH TẾ (chỉnh ở các hằng số bên dưới):
       - Cấp 2 chia theo "bộ bài" 100 túi: đúng 12 túi cấp 2 + 88 túi cấp 1, xáo trộn  → lãi đều 12×30 = +360 Xu / 100 túi
       - VIP rất hiếm 0.03% / túi (≈ 1 lần mỗi 3.300 túi)
       - Mỗi túi tối thiểu ≈ 2,3 giây (3 lần chạm cách nhau ≥0,35s + 1,2s khui quà) → mở liên tục 10 phút ≈ 200–260 túi
         ⇒ lời ≈ 720–940 Xu (nếu may trúng VIP thì cộng thêm +980)
   • Giới hạn Xu NHẬN được từ túi hề: 20.000 Xu / ngày (reset theo ngày máy). Quá giới hạn thì túi được hoàn 20 Xu.
   • Túi đang xé dở lưu ở ST.tui.pen (thoát game giữa chừng vẫn xé tiếp được)
   ============================================================ */
const TU_COST=20,TU_TAPS=3,TU_CAP=20000,TU_DECK=100,TU_L2=12,TU_VIP=0.0003,TU_TAPGAP=350,TU_REVEAL=1200;
const TUT=[
 {k:'Cấp 1',xu:20,  c:'#3a86ff',c2:'#9fd0ff',lb:'Túi Hề cấp 1'},
 {k:'Cấp 2',xu:50,  c:'#9b5de5',c2:'#e0c6ff',lb:'Túi Hề cấp 2'},
 {k:'VIP',  xu:1000,c:'#ff8c1a',c2:'#fff6a0',lb:'Túi Hề VIP'}];
const tuDeck=()=>{const d=[];for(let i=0;i<TU_DECK;i++)d.push(i<TU_L2?1:0);for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d};
function tuS(){if(!ST.tui||typeof ST.tui!='object')ST.tui={stock:0,pen:null,dk:[],n:0};const S=ST.tui;
 if(!(S.stock>=0))S.stock=0;S.stock=Math.floor(S.stock);if(!(S.n>=0))S.n=0;if(!Array.isArray(S.dk))S.dk=[];
 const p=S.pen;if(p&&!(p.t>=0&&p.t<TUT.length&&p.tap>=0&&p.tap<TU_TAPS))S.pen=null;
 const dk=new Date().toDateString();if(S.dd!=dk||!(S.rc>=0)){S.dd=dk;S.rc=0;S.dn=0}if(!(S.dn>=0))S.dn=0;return S}
function tuRoll(){const S=tuS();if(!S.dk.length)S.dk=tuDeck();const c=S.dk.pop();return Math.random()<TU_VIP?2:(c==1?1:0)}
let TULOOP=0,TUO=null,TUD=null,TUP=[],TUSH=0,TULAST=0,TUTOK=0;
function tuTake(){const S=tuS();if(S.pen||TUO)return;
 if(S.stock>=1){S.stock--;S.pen={t:tuRoll(),tap:0};TUD={t0:performance.now()};TUSH=0;save()}}
function tuCoin(g,amt,x,y,s,vip){
 g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 g.fillStyle=vip?'#ffe27a':'#ffd23f';g.strokeStyle='#7a4a00';g.lineWidth=3;g.beginPath();g.arc(x,y,(vip?28:24)*s,0,7);g.fill();g.stroke();
 g.fillStyle=vip?'#ffb300':'#ffb300';g.beginPath();g.arc(x,y,(vip?21:17)*s,0,7);g.fill();
 g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(x-8*s,y-8*s,4*s,0,7);g.fill();
 const fs=Math.round((amt>=1000?14:17)*s);g.font='900 '+fs+'px Nunito,Arial,sans-serif';g.lineWidth=4;g.strokeStyle='#7a4a00';g.strokeText(amt,x,y+1);g.fillStyle='#fff';g.fillText(amt,x,y+1)}
function tuFlap(g,jag){ // phần miệng túi (zigzag), gốc = đáy phần miệng
 const INK='#2a1540';g.lineJoin='round';g.lineWidth=3;g.strokeStyle=INK;
 g.fillStyle='#ff5a5f';g.beginPath();g.moveTo(-46,0);
 for(let i=0;i<=8;i++){g.lineTo(-46+i*11.5,-20-(i%2?0:8))}
 g.lineTo(46,0);g.closePath();g.fill();g.stroke();
 g.fillStyle='rgba(255,255,255,.28)';g.fillRect(-44,-6,88,4);
 g.fillStyle='#ffd23f';g.fillRect(-9,-4,18,4);
 if(jag){g.strokeStyle='#fff6a0';g.lineWidth=2}}
function tuBag(g,tap,open,tr){ // gốc = giữa đáy túi
 const INK='#2a1540';g.lineJoin='round';g.lineWidth=3;g.strokeStyle=INK;
 // thân túi giấy sọc kẹo
 g.fillStyle='#fff4dc';g.beginPath();g.moveTo(-40,0);g.lineTo(40,0);g.lineTo(46,-82);g.lineTo(-46,-82);g.closePath();g.fill();
 g.save();g.clip();g.fillStyle='rgba(230,57,70,.85)';for(let i=-5;i<=5;i+=2){g.fillRect(i*9-4,-84,9,86)}g.fillStyle='rgba(0,0,0,.10)';g.fillRect(-46,-8,92,8);g.restore();
 g.beginPath();g.moveTo(-40,0);g.lineTo(40,0);g.lineTo(46,-82);g.lineTo(-46,-82);g.closePath();g.stroke();
 // mặt chú hề
 g.fillStyle='#fff';g.strokeStyle=INK;g.lineWidth=2.5;
 for(const sx of[-1,1]){g.beginPath();g.arc(sx*15,-54,9,0,7);g.fill();g.stroke();g.fillStyle=INK;g.beginPath();g.arc(sx*15+(open?0:sx*-1),-53,3.4,0,7);g.fill();g.fillStyle='#fff'}
 g.fillStyle='#e63946';g.beginPath();g.arc(0,-38,10,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.65)';g.beginPath();g.arc(-3,-41,3,0,7);g.fill();
 g.strokeStyle='#e63946';g.lineWidth=3.5;g.lineCap='round';g.beginPath();
 if(open){g.ellipse(0,-20,12,8,0,0,7)}else{g.arc(0,-26,15,.25,Math.PI-.25)}g.stroke();g.lineCap='butt';
 g.fillStyle='#ff8c1a';for(const sx of[-1,1])for(let k=0;k<3;k++){g.beginPath();g.arc(sx*(48+k*3),-70+k*9,7-k,0,7);g.fill()}
 // miệng túi: đã xé / chưa xé
 if(open){g.fillStyle='#4a1d82';g.beginPath();g.moveTo(-46,-82);for(let i=0;i<=8;i++)g.lineTo(-46+i*11.5,-82+(i%2?7:-1));g.lineTo(46,-82);g.closePath();g.fill();
  g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.moveTo(-46,-82);for(let i=0;i<=8;i++)g.lineTo(-46+i*11.5,-82+(i%2?7:-1));g.lineTo(46,-82);g.stroke()}
 else{g.save();g.translate(0,-82);tuFlap(g);
  // vết xé sáng theo số lần chạm
  if(tap>0){g.strokeStyle='#fff6a0';g.lineWidth=2.8;g.beginPath();const ex=-46+tap*30;g.moveTo(-46,-8);for(let x=-46,i=0;x<=ex;x+=7,i++)g.lineTo(x,i%2?-12:-4);g.stroke()}
  g.restore()}}
function tuDraw(c){
 const g=c.getContext('2d'),W=c.width,H=c.height,CX=W/2,BY=212,S=tuS(),p=S.pen,now=performance.now()/1000;g.clearRect(0,0,W,H);
 g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(CX,BY+10,86,11,0,0,7);g.fill();
 g.fillStyle='#4a1d82';g.beginPath();g.ellipse(CX,BY+4,86,12,0,0,7);g.fill();g.fillStyle='#ffd23f';g.beginPath();g.ellipse(CX,BY+1,82,10,0,0,7);g.fill();
 g.fillStyle='#e63946';for(let i=0;i<10;i++){const a=i/10*Math.PI*2;g.beginPath();g.arc(CX+Math.cos(a)*68,BY+1+Math.sin(a)*8,2.4,0,7);g.fill()}
 if(TUO){
  const t=now-TUO.t0,T=TUT[TUO.t],ease=e=>1-Math.pow(1-Math.min(1,Math.max(0,e)),3);
  const ra=Math.min(1,t*4)*(t>1.6?Math.max(.3,1-(t-1.6)*.6):1);
  if(TUO.t>0||t<.9){g.save();g.translate(CX,BY-70);g.rotate(t*.6);g.globalAlpha=(TUO.t==2?.6:.4)*ra;g.fillStyle=T.c2;
   for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.moveTo(0,0);g.arc(0,0,(TUO.t==2?170:130)*Math.min(1,t*3),a,a+Math.PI/18);g.closePath();g.fill()}g.restore()}
  if(!TUO.sp){TUO.sp=1;const n=TUO.t==2?120:(TUO.t==1?60:30),cols=['#e63946','#ffd23f','#1fc8b8','#ff7eb6','#3a86ff','#ff8c1a','#9b5de5',T.c,T.c2];
   for(let i=0;i<n;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,v=120+Math.random()*(TUO.t==2?280:200);TUP.push({x:CX,y:BY-80,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6,vr:(Math.random()-.5)*14,c:cols[i%cols.length],t:0,l:1.3+Math.random()*.9})}}
  g.save();g.translate(CX,BY);tuBag(g,0,true);g.restore();
  const pe=ease((t-.1)/.6),py=BY-82-pe*80+(pe>=1?Math.sin(now*3)*3:0),ps=(TUO.t==2?1.35:1.1)*(pe<1?pe*1.1:1);
  if(pe>0)tuCoin(g,TUO.shown,CX,py,ps,TUO.t==2);
  if(t>.3){g.save();g.globalAlpha=Math.min(1,(t-.3)*4);g.textAlign='center';g.textBaseline='middle';g.font='900 '+(TUO.t==2?24:19)+'px Nunito,Arial,sans-serif';g.lineJoin='round';g.lineWidth=6;g.strokeStyle='#2a1540';
   const lb=T.lb.toUpperCase()+(TUO.t>=1?'!':'');g.strokeText(lb,CX,24);g.fillStyle=T.c2;g.fillText(lb,CX,24);g.restore()}
  // miệng túi bay đi
  if(t<1.2){const lx=CX+t*70,ly=BY-82-(-260*t+380*t*t),al=Math.max(0,1-t/1.2);g.save();g.globalAlpha=al;g.translate(lx,ly);g.rotate(t*3.4);tuFlap(g);g.restore()}
  if(t>.9&&!TUO.fin){TUO.fin=1;const r=$('tur');if(r)r.innerHTML=TUO.msg;tuInfo()}
 }else if(p){
  let off=0,land=1;if(TUD){const e=(performance.now()-TUD.t0)/450;if(e<1){land=0;off=-250*Math.pow(1-e,2)}else{TUD=null;TUSH=.8;lbSnd(1,0)}}
  TUSH*=.88;if(TUSH<.01)TUSH=0;
  const dx=Math.sin(now*70)*TUSH*7,rot=Math.sin(now*55)*TUSH*.07,sq=TUSH*.07,idle=land&&!TUSH&&p.tap==0?Math.sin(now*2.4)*1.5:0;
  g.save();g.translate(CX+dx,BY+off+idle);g.rotate(rot);g.scale(1+sq,1-sq*.8);tuBag(g,p.tap,false);g.restore();
  if(land&&!TUSH&&now*1000%1400<900){g.textAlign='center';g.textBaseline='middle';g.font='800 12px Nunito,Arial,sans-serif';g.fillStyle='#4a1d82';g.fillText('👆 Chạm '+(TU_TAPS-p.tap)+' lần nữa để xé!',CX,H-6)}
 }else{
  for(let i=0;i<5;i++){const a=now*.6+i*1.9,x=CX+Math.cos(a)*(40+i*14),y=BY-60+Math.sin(a*1.3)*(26+i*6),s=2+Math.abs(Math.sin(now*3+i))*2;g.fillStyle=i%2?'#ffd23f':'#ff9ec8';g.fillRect(x-s/2,y-s/2,s,s);g.fillRect(x-s*1.4,y-.5,s*2.8,1);g.fillRect(x-.5,y-s*1.4,1,s*2.8)}
  g.textAlign='center';g.textBaseline='middle';g.font='800 13px Nunito,Arial,sans-serif';g.fillStyle='#4a1d82';g.fillText(S.stock>0?'':'Mua túi ở dưới để bắt đầu xé nhé!',CX,BY-70)}
 for(let i=TUP.length-1;i>=0;i--){const q=TUP[i];q.t+=.016;q.x+=q.vx*.016;q.y+=q.vy*.016;q.vy+=300*.016;q.r+=q.vr*.016;if(q.t>q.l||q.y>H+8){TUP.splice(i,1);continue}
  g.save();g.translate(q.x,q.y);g.rotate(q.r);g.globalAlpha=Math.min(1,(q.l-q.t)*3);g.fillStyle=q.c;g.fillRect(-3,-2,6,4);g.restore()}
}
function tuLoop(id){const c=$('tuc');if(!c||!UI||id!=TULOOP)return;tuDraw(c);requestAnimationFrame(()=>tuLoop(id))}
function tuInfo(){const el=$('tui');if(!el)return;const S=tuS(),capped=S.rc>=TU_CAP;
 el.innerHTML='<div class="sg" style="grid-template-columns:repeat(2,1fr)"><div class="sq" style="cursor:default;min-height:54px;background:#ffb3c855"><b style="font-size:15px">🪙 '+fmtXu(ST.xu)+'</b></div><div class="sq" style="cursor:default;min-height:54px;background:#c9a8ff55"><b style="font-size:15px">🎈 '+(S.stock+(S.pen?1:0))+' túi</b><small>chưa xé</small></div></div>'+
  '<div class="mut" style="text-align:center;margin:4px 0">Hôm nay nhận từ túi hề: <b>'+fmtXu(S.rc)+' / '+fmtXu(TU_CAP)+'</b> Xu • xé '+S.dn+' túi</div>';
 const b=$('tub');if(!b)return;const xu=ST.xu|0,busy=!!(S.pen||S.stock>0||TUO),ok=!capped&&!busy&&xu>=TU_COST;
 b.innerHTML=(capped?'<div class="mut" style="text-align:center;font-weight:800;color:#b3202e">🌙 Hôm nay đã nhận đủ '+fmtXu(TU_CAP)+' Xu từ túi hề — mai quay lại nhé!</div>':'')+
  '<button class="b w'+(ok?'':' z')+'" onclick="tuBuy()"'+(ok?' style="font-weight:800;color:#fff;border:3px solid #8c1c13;border-radius:12px;background:linear-gradient(135deg,#ff5a5f,#ff8c1a);text-shadow:0 1px 0 #8c1c13"':'')+'>🎈 Mua 1 túi — '+TU_COST+' Xu</button>'+
  (busy&&!capped?'<div class="mut" style="text-align:center">Xé xong túi này mới mua được túi tiếp theo nhé!</div>':'')}
window.tuUI=()=>{tuS();TUO=null;TUD=null;TUP=[];TUSH=0;TUTOK++;
 const bar=(a,b)=>'<div style="height:9px;border-radius:5px;background:repeating-linear-gradient(90deg,'+a+' 0 14px,'+b+' 14px 28px);margin:4px 0"></div>';
 openUI(head('🎈 Xé túi Hề')+
  '<div style="border-radius:14px;padding:6px;background:linear-gradient(180deg,#fff0f3,#fff7d6)">'+bar('#e63946','#fff')+
  '<div style="text-align:center;font-weight:800;color:#6a2fb0;font-size:14px;margin:2px 0 4px">🤡 “Bạn muốn nhiều xu thì cứ việc xé túi!”</div>'+
  '<div style="text-align:center"><canvas id="tuc" width="260" height="250" onpointerdown="tuTap(event)" style="width:100%;max-width:250px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none"></canvas></div>'+
  '<div id="tur" style="text-align:center;min-height:30px;font-weight:800;color:#4a1d82;font-size:15px;margin:2px 0"></div><div id="tub" class="pf"></div><div id="tui"></div>'+
  '<div class="sg" style="grid-template-columns:repeat(3,1fr);margin-top:6px">'+
   TUT.map((t,i)=>'<div class="sq" style="cursor:default;min-height:62px;background:'+t.c+';color:#fff"><small style="color:#fff;opacity:.92">'+t.lb+'</small><b style="font-size:15px">🪙 '+t.xu+'</b><small style="color:#fff;opacity:.92">'+['~88%','~12%','~0,03%'][i]+'</small></div>').join('')+'</div>'+
  '<div class="mut" style="text-align:center;margin-top:6px">Mỗi túi chạm '+TU_TAPS+' lần để xé • Giới hạn nhận '+fmtXu(TU_CAP)+' Xu/ngày</div>'+
  bar('#7c5cff','#fff')+
  '<button class="b" onclick="circusUI()" style="display:block;width:100%;margin-top:4px">← Quay lại Xe Hề</button></div>');
 tuInfo();tuLoop(++TULOOP);tuTake()};
window.tuBuy=()=>{const S=tuS();if(S.rc>=TU_CAP)return toast('🌙 Hôm nay đã nhận đủ '+fmtXu(TU_CAP)+' Xu từ túi hề rồi, mai quay lại nhé!');
 if(S.pen||S.stock>0||TUO)return toast('🎈 Xé xong túi này rồi mới mua túi tiếp theo nhé!');
 if((ST.xu|0)<TU_COST)return toast('🪙 Không đủ Xu (cần '+TU_COST+' Xu)');
 ST.xu-=TU_COST;S.stock=1;xuUp();save();tuTake();tuInfo();const r=$('tur');if(r&&!TUO)r.textContent='';lbSnd(1,0)};
window.tuTap=e=>{if(e&&e.preventDefault)e.preventDefault();const S=tuS(),p=S.pen;if(!p||TUD||TUO)return;
 const now=performance.now();if(now-TULAST<TU_TAPGAP)return;TULAST=now;
 p.tap++;TUSH=1;
 if(p.tap<TU_TAPS){lbSnd(0,p.tap);save();return}
 // xé xong!
 const T=TUT[p.t],tier=p.t;S.pen=null;S.n++;S.dn++;
 const rem=TU_CAP-S.rc;let got,msg;
 if(rem<=0){got=TU_COST;msg='🌙 Đã đạt giới hạn ngày — hoàn lại '+TU_COST+' Xu';ST.xu+=got}
 else{got=Math.min(T.xu,rem);ST.xu+=got;S.rc+=got;msg='<span style="color:'+T.c+'">'+T.lb+'</span> • 🪙 +'+fmtXu(got)+' Xu'+(got<T.xu?' (chạm giới hạn ngày)':'')}
 TUO={t0:performance.now()/1000,t:tier,shown:got,msg:msg};
 xuUp();save();tuInfo();play(tier>=1?2:0,.05);
 if(tier==2)toast('🤡 TÚI HỀ VIP!!! +'+fmtXu(got)+' Xu');
 const tok=++TUTOK;setTimeout(()=>{if(tok!=TUTOK||!$('tuc'))return;TUO=null;TUP=[];tuTake();tuInfo()},TU_REVEAL+300)};
})();
