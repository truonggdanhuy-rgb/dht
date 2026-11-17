/* ============================================================
   CÂU QUÁI VẬT (Biển)
   - Phải LÊN THUYỀN ngoài biển rồi bấm mặt nước -> mở khung câu (cầu tàu / bãi cát không câu được)
   - Câu ở VÙNG NƯỚC TỐI: câu trúng quái có tỉ lệ ZB (15%) nhận thêm 1 vé quay hoặc 1 món ăn từ máy chế biến
   - Bấm CÂU -> ~2 giây sau có BÓNG (nhỏ = thường, vừa = hiếm, to = cao cấp)
   - Bóng rỉa mồi vài lần -> cắn câu -> thanh trượt dọc, canh vạch trắng vào vùng sáng
   - Câu được: vào Túi > Biển (ST.qvm = số quái đã câu). Bấm quái vật trong Túi để cầm trên tay (đi là mất)
   - Cần câu có tỉ lệ HƯ (hiếm, chỉ sau ROD_N con): sửa ROD_FIX xu quái vật
   - Shop quái vật: nút "Thu mua quái vật" -> bán lấy Xu quái vật (ST.qv)
   - Kem chống nắng (ST.kcn, mua ở Shop quái vật 10 xu quái vật): ngoài biển có tỉ lệ (thấp) bị RÁT DA khi câu nhiều/ở biển lâu: tạm không câu được; thoa kem trong Túi > Biển để hết rát + được bảo vệ. Chỉnh ở khối SUN_* bên dưới
   Muốn chỉnh độ khó / tỉ lệ / giá: sửa bảng RAR và MON ngay bên dưới.
   ============================================================ */
(()=>{
'use strict';
const $=id=>document.getElementById(id);

// ---------- BẢNG CÂN BẰNG ----------
// w = tỉ lệ xuất hiện • zone = bề rộng vùng sáng (0..1) • spd = tốc độ thanh trượt • nib = số lần rỉa mồi
const RAR=[
 {k:'th',n:'Quái thường',   w:.797,zone:.36,spd:.75,nib:2,col:'#7ad0ff'},
 {k:'hi',n:'Quái hiếm',     w:.200,zone:.28,spd:.95,nib:3,col:'#ffd23f'},
 {k:'cc',n:'Quái cao cấp',  w:.003,zone:.22,spd:1.2,nib:4,col:'#ff8ad8'}];
const MON=[
 {id:'qv_chuot',n:'Chuột nước',        r:0,p:20},
 {id:'qv_nhen', n:'Nhện nước',         r:0,p:20},
 {id:'qv_heo',  n:'Cá heo quái vật',   r:0,p:20},
 {id:'qv_chim', n:'Cá chim đỏ',        r:1,p:50},
 {id:'qv_tuoc', n:'Bạch tuộc hoàng kim',r:1,p:50},
 {id:'qv_kq',   n:'Kim Quy',           r:2,p:1500}];
// QUY ƯỚC ĐẶT TÊN: id quái vật luôn bắt đầu bằng 'qv_' (ví dụ qv_heo) để KHÔNG BAO GIỜ trùng với id nguyên liệu/chuồng/vật phẩm (heo, chim, ...).
// Thêm quái mới: đặt id dạng 'qv_xxx' ở đây + thêm hình cùng tên 'qv_xxx' trong ART bên dưới.
const KQ_ID='qv_kq';
// id cũ (trước khi có tiền tố qv_) -> id mới, dùng để chuyển dữ liệu túi của người chơi đã lưu
const OLD_ID={chuot:'qv_chuot',nhen:'qv_nhen',heo:'qv_heo',chim:'qv_chim',tuoc:'qv_tuoc',kq:'qv_kq'};
const SHN=['bóng nhỏ','bóng vừa','bóng to'];
// ---------- QUÀ VÙNG NƯỚC TỐI ----------
const ZB=.15;   // tỉ lệ nhận thêm quà khi câu trúng quái ở vùng nước tối (muốn 10–20% thì sửa số này)
// chỉ lấy MÓN ĂN từ máy chế biến: xôi, cơm, mì, mứt, đồ hộp, kem, sinh tố, bánh kem, bánh quê, miền Tây, máy ong
const FOODM=[2,3,4,6,7,8,9,10,13,14,17];
function foodPick(){try{const L=[];for(const mi of FOODM){const M=MACHS[mi];if(M&&M.rec)for(const o of M.rec)if(!/^Vắt /.test(o.n))L.push(o)}return L.length?L[Math.floor(Math.random()*L.length)]:null}catch(e){return null}}
function giveBonus(){
 const f=Math.random()<.5?foodPick():null;
 if(f){ST.vp=ST.vp||{};ST.vp[f.id]=(ST.vp[f.id]|0)+1;toast('🎁 Vùng nước tối tặng bạn 1 '+f.e+' '+f.n+'!');return '🎁 Quà vùng nước tối: <b>'+ic(f.e,f.n)+' '+f.n+'</b> (đã vào Kho)'}
 ST.tk=(ST.tk|0)+1;toast('🎁 Vùng nước tối tặng bạn 1 🎟️ vé quay!');return '🎁 Quà vùng nước tối: <b>+1 🎟️ vé quay</b>'}

// ---------- vẽ quái vật (đơn giản) ----------
const mkS=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 const r=(col,x,y,ww,hh)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),ww,hh)};
 const E=(col,x,y,a,b)=>{a=Math.round(a);b=Math.max(1,Math.round(b));for(let d=-b;d<=b;d++){const ww=Math.round(a*Math.sqrt(Math.max(0,1-d*d/(b*b+.01))));r(col,x-ww,y+d,ww*2,1)}};
 const L=(col,x0,y0,x1,y1,t)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)r(col,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,t||1,t||1)};
 fn(r,E,L,g);return c};
const ART={
 qv_chuot:()=>mkS(30,20,(r,E,L)=>{
  // đuôi gai tím sẫm + gai xương
  L('#4a3a6a',4,15,1,12);L('#4a3a6a',1,12,2,7);r('#e8e0c8',0,11,1,1);r('#e8e0c8',3,12,1,1);r('#e8e0c8',3,9,1,1);r('#e8e0c8',1,7,1,1);
  // thân đen tím + bụng tím
  E('#23253f',13,13,9,5);E('#3b4170',12,11,7,3);E('#6a3f8f',14,16,6,2);
  // gai xương trên lưng
  for(const x of[7,10,13,16]){r('#e8e0c8',x,6,1,3);r('#fff8e0',x,5,1,1)}
  // đầu
  E('#23253f',21,10,5,4);E('#3b4170',21,8,4,2);r('#ff3d6e',26,11,2,2);
  // tai nhọn viền đỏ
  E('#23253f',19,5,2,2);r('#b0204a',19,5,2,2);E('#23253f',24,5,2,2);r('#b0204a',24,5,2,2);
  // mắt đỏ rực + lông mày dữ
  r('#ff1e1e',22,9,2,2);r('#ffd9a0',22,9,1,1);r('#0e0e1c',21,8,2,1);r('#0e0e1c',23,7,2,1);
  // nanh + ria
  r('#fff',25,13,1,2);r('#fff',27,13,1,2);L('#dbe6f0',26,12,29,10);L('#dbe6f0',26,12,29,15);
  // chân vuốt xương
  r('#23253f',8,18,3,2);r('#e8e0c8',10,19,2,1);r('#23253f',17,18,3,2);r('#e8e0c8',19,19,2,1);
  // giọt độc xanh lá
  r('#6bffb0',5,4,2,2);r('#e0ffee',5,4,1,1);r('#6bffb0',13,2,2,2);r('#6bffb0',27,16,2,2)}),
 qv_nhen:()=>mkS(28,22,(r,E,L)=>{
  const lg='#2a1850';
  // 8 chân dày có khớp gai
  for(const[y0,x1,y1]of[[9,2,3],[11,0,9],[13,0,15],[15,2,21]]){L(lg,10,y0+1,x1+2,y1,2);L(lg,17,y0+1,25-x1,y1,2);r('#8a5ad8',x1+2,y1,1,1);r('#8a5ad8',25-x1,y1,1,1)}
  // thân đen tím
  E('#2a1850',14,13,6,5);E('#4a2f88',12,11,3,2);
  // dấu đồng hồ cát hồng-tím trên bụng
  r('#e02a9a',13,10,3,1);r('#e02a9a',14,11,1,5);r('#e02a9a',13,16,3,1);
  // đầu
  E('#2a1850',14,7,4,3);
  // 4 mắt phát sáng: 2 lớn đỏ + 2 nhỏ xanh lá
  r('#ff2a2a',11,5,3,3);r('#ff2a2a',15,5,3,3);r('#ffe0a0',11,5,1,1);r('#ffe0a0',15,5,1,1);r('#12081f',12,6,1,2);r('#12081f',16,6,1,2);
  r('#6bffb0',13,4,1,1);r('#6bffb0',15,4,1,1);
  // răng nanh
  r('#fff',12,9,1,2);r('#fff',16,9,1,2);
  // tơ độc
  r('rgba(150,255,190,.55)',11,17,6,1);r('rgba(150,255,190,.55)',10,18,1,3);r('rgba(150,255,190,.55)',17,18,1,3)}),
 qv_heo:()=>mkS(32,22,(r,E,L)=>{
  // đuôi tím đen xẻ gai
  r('#2a1a52',1,6,3,2);r('#2a1a52',2,8,3,2);r('#2a1a52',1,15,3,2);r('#2a1a52',2,13,3,2);r('#e0245e',0,5,1,1);r('#e0245e',0,17,1,1);E('#3b2a7a',7,12,4,2);
  // thân chàm + bụng nhạt
  E('#3b2a7a',15,12,10,5);E('#c2b4ee',15,15,9,2);E('#3b2a7a',24,12,4,4);r('#3b2a7a',27,13,4,2);
  // vây lưng gai đỏ thẫm
  r('#e0245e',11,2,1,1);r('#e0245e',11,3,2,1);r('#e0245e',12,4,3,1);r('#a8143e',12,5,4,1);r('#a8143e',13,6,5,1);r('#a8143e',13,7,6,1);
  r('#ffb0c8',14,3,1,1);r('#ffb0c8',16,5,1,1);
  // vây bụng
  r('#2a1a52',18,16,4,2);r('#2a1a52',17,18,3,1);
  // vằn sẹo
  r('#5a48b0',10,9,8,1);r('#e0245e',13,10,1,2);r('#e0245e',17,11,1,2);
  // mắt đỏ rực + lông mày
  r('#ff1e1e',24,10,2,2);r('#ffe0a0',24,10,1,1);r('#12081f',23,9,3,1);
  // miệng răng cưa
  r('#12081f',26,14,5,1);for(const x of[26,28,30])r('#fff',x,15,1,1);for(const x of[27,29])r('#fff',x,13,1,1);
  // bong bóng độc
  r('#6bffb0',20,3,1,2);r('#6bffb0',23,1,1,2)}),
 qv_chim:()=>mkS(30,24,(r,E,L)=>{
  // vây đuôi rách đỏ máu
  L('#9c1020',9,11,1,3,3);L('#9c1020',9,13,1,21,3);L('#ff3a3a',9,11,2,5,1);L('#ff3a3a',9,13,2,19,1);
  // thân đỏ thẫm
  E('#6a0f1e',17,12,10,9);E('#a01a2c',17,13,9,7);E('#e8a8a0',16,16,6,3);
  // gai lưng
  r('#9c1020',12,5,11,2);r('#e0262e',13,4,8,1);
  for(const x of[13,15,17,19,21]){r('#ffe08a',x,2+(x==17?-1:0),1,3)}
  // vây bụng
  r('#9c1020',13,20,9,2);r('#ff3a3a',14,21,6,1);
  // mắt vàng rực khe đứng + lông mày
  r('#12040a',21,8,5,1);E('#ffd23f',24,10,2,2);r('#12040a',24,9,1,3);r('#fff8c0',25,10,1,1);
  // miệng nanh dài
  r('#12040a',22,14,6,1);r('#fff',23,15,1,3);r('#fff',26,15,1,3);r('#fff',25,13,1,1);r('#fff',28,13,1,1);
  // vết thương/vảy sáng
  r('#ff6a50',15,11,1,1);r('#ff6a50',18,14,1,1);r('#3a0810',16,17,1,1)}),
 qv_tuoc:()=>mkS(30,28,(r,E,L)=>{
  // xúc tu vàng đồng sẫm + gai
  for(let k=0;k<6;k++){const x0=5+k*4;for(let y=17;y<27;y++){const x=x0+Math.round(Math.sin(y/2+k)*2);r('#a8700a',x,y,3,1);if(y%3==0)r('#e8a830',x+1,y,1,1);if(y%4==1)r('#8a2be2',x+2,y,1,1)}}
  // đầu vàng hoàng kim sẫm
  E('#b8800a',15,9,9,8);E('#f2b01e',15,8,8,7);r('#ffe27a',10,3,4,2);
  // đốm tím độc
  r('#8a2be2',18,3,2,2);r('#8a2be2',12,8,2,2);r('#8a2be2',20,8,1,1);r('#c77dff',19,3,1,1);
  // 2 mắt đỏ rực khe đứng
  E('#ff2a2a',11,12,3,3);E('#ff2a2a',19,12,3,3);r('#ffe0a0',10,11,1,1);r('#ffe0a0',18,11,1,1);r('#12081f',12,11,1,4);r('#12081f',20,11,1,4);
  r('#12081f',9,9,5,1);r('#12081f',17,9,5,1);
  // mỏ nanh
  r('#5a2a04',14,17,3,1);r('#fff',13,18,1,2);r('#fff',17,18,1,2);r('#fff',15,18,1,1);
  // tia sáng tím
  r('#c77dff',2,3,1,3);r('#c77dff',1,4,3,1);r('#c77dff',27,7,1,3);r('#c77dff',26,8,3,1)}),
 qv_kq:()=>mkS(46,34,(r,E,L)=>{
  // chân vuốt
  r('#e8b72e',1,22,6,2);E('#e8b72e',9,28,5,3);r('#fff',5,29,2,1);E('#f2c94a',34,28,5,3);r('#fff',38,29,2,1);
  // mai vàng
  E('#a8700a',21,20,17,12);E('#ffcf3a',21,19,16,11);E('#ffe27a',18,14,11,5);
  for(const x of[13,21,29])L('#d9951a',x,10,x+(x<21?-3:x>21?3:0),27,1);
  L('#d9951a',7,17,35,17,1);L('#d9951a',6,23,36,23,1);
  // gai mai nhọn
  for(const x of[9,13,17,21,25,29,33]){const yt=Math.round(19-11*Math.sqrt(Math.max(0,1-Math.pow((x-21)/16,2))));r('#8a5a05',x,yt-3,2,3);r('#fff3a0',x,yt-4,1,1)}
  r('#fff3a0',20,15,2,2);r('#fff3a0',14,20,2,1);r('#fff3a0',27,20,2,1);
  r('#a8700a',5,29,32,2);
  // đầu dữ: mắt đỏ rực, mày, nanh
  E('#f6d56a',38,22,4,4);E('#f6d56a',41,19,4,4);r('#ff1e1e',43,18,2,2);r('#fff',43,18,1,1);r('#7a4a08',42,17,4,1);
  r('#c98a0a',45,21,1,1);r('#5a2a04',40,22,5,1);r('#fff',41,23,1,2);r('#fff',44,23,1,2);
  // ánh vàng quanh
  r('#ffe27a',6,10,1,2);r('#ffe27a',5,11,3,1)})};
const SPR={},get=id=>SPR[id]||(SPR[id]=ART[id]());
const idxOf=id=>MON.findIndex(m=>m.id==id);

// hiệu ứng Kim Quy: hào quang + tia sáng xoay + sao lấp lánh
function star(g,x,y,s,col){g.fillStyle=col||'#fff';g.fillRect(Math.round(x-s),Math.round(y),s*2+1,1);g.fillRect(Math.round(x),Math.round(y-s),1,s*2+1);g.fillStyle='rgba(255,240,170,.7)';g.fillRect(Math.round(x-1),Math.round(y-1),3,3)}
function fxGold(g,cx0,cy0,t,R,rays){
 const gr=g.createRadialGradient(cx0,cy0,1,cx0,cy0,R);gr.addColorStop(0,'rgba(255,244,170,.9)');gr.addColorStop(.5,'rgba(255,205,70,.35)');gr.addColorStop(1,'rgba(255,205,70,0)');
 g.fillStyle=gr;g.beginPath();g.arc(cx0,cy0,R*(1+.06*Math.sin(t*4)),0,6.283);g.fill();
 if(rays){g.save();g.translate(cx0,cy0);g.rotate(t*.6);g.fillStyle='rgba(255,236,150,.2)';for(let i=0;i<10;i++){g.rotate(Math.PI/5);g.beginPath();g.moveTo(0,0);g.lineTo(R*1.5,-R*.12);g.lineTo(R*1.5,R*.12);g.closePath();g.fill()}g.restore()}
 for(let k=0;k<6;k++){const a=t*1.5+k*1.047,rr=R*.8+Math.sin(t*3+k)*R*.1;star(g,cx0+Math.cos(a)*rr,cy0+Math.sin(a)*rr*.7,Math.max(1,Math.round(R/18*((Math.sin(t*5+k*2)+1.4)*.7))))}}

// vẽ quái vào ctx g, giữa (x,y), rộng w (px)
function put(g,id,x,y,w,t,fx){const s=get(id),h=Math.round(w*s.height/s.width),m=MON[idxOf(id)];
 if(m.r==2&&fx!==false)fxGold(g,x,y,t||0,w*.85,fx==='rays');
 const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;g.drawImage(s,Math.round(x-w/2),Math.round(y-h/2),w,h);g.imageSmoothingEnabled=sm}

// ---------- dữ liệu ----------
const bag=()=>{ST.qvm=(ST.qvm&&typeof ST.qvm=='object'&&!Array.isArray(ST.qvm))?ST.qvm:{};
 for(const o in OLD_ID){if(o in ST.qvm){ST.qvm[OLD_ID[o]]=(ST.qvm[OLD_ID[o]]|0)+(ST.qvm[o]|0);delete ST.qvm[o]}}
 return ST.qvm};
const total=()=>Object.values(bag()).reduce((a,b)=>a+(b|0),0);
const MQ=window.MQ={};
MQ.items=()=>{const b=bag();const L=MON.map((m,i)=>({n:m.n,idx:i,r:m.r,c:b[m.id]|0})).filter(x=>x.c>0).sort((a,b)=>b.r-a.r||a.idx-b.idx).map(x=>({n:x.n,idx:x.idx,sm:'x'+x.c+(HOLD===x.idx?' • đang cầm':'')}));
 const k=ST.kcn|0;if(k>0)L.push({n:'Kem chống nắng',idx:SUN_ID,sm:'x'+k+(protLeft()>0?' • đang bảo vệ':'')});
 for(const id of[101,102,103]){const c=(ST.pot&&ST.pot[POTK[id]])|0;if(c>0)L.push({n:POTN[id],idx:id,sm:'x'+c+(id==103&&toanLeft()>0?' • đang có tác dụng':'')})}return L};
MQ.paint=(g,ix,c)=>{if(POTK[ix]){const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;const s=potSpr(POTK[ix]),w=Math.round(c.width*.55),h=Math.round(w*s.height/s.width);g.drawImage(s,Math.round(c.width/2-w/2),Math.round(c.height/2-h/2),w,h);g.imageSmoothingEnabled=sm;return}
 if(ix===SUN_ID){const sm=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;const s=sunSpr(),w=Math.round(c.width*.55),h=Math.round(w*s.height/s.width);g.drawImage(s,Math.round(c.width/2-w/2),Math.round(c.height/2-h/2),w,h);g.imageSmoothingEnabled=sm;return}
 if(ix<0||!MON[ix])return;const t=performance.now()/1000;put(g,MON[ix].id,c.width/2,c.height/2,MON[ix].r==2?34:30,t)};

// ---------- cầm trên tay ----------
let HOLD=null;
MQ.hold=i=>{if(i===SUN_ID)return useSun();if(POTK[i])return usePot(i);if(!MON[i])return;HOLD=i;window.MQH=1;closeUI();toast('🖐️ Bạn đang cầm '+MON[i].n+' trên tay (di chuyển để cất)')};
MQ.clear=()=>{HOLD=null;window.MQH=0};
const HC={};
MQ.drawHold=(X,Y,d)=>{if(HOLD==null)return;const m=MON[HOLD],t=performance.now()/1000,w=m.r==2?22:m.r==1?17:15,
 off=d==2?-11:d==3?11:d==1?-12:12,bx=X+off,by=Y-5+Math.round(Math.sin(t*3)*1);
 const s=get(m.id),h=Math.round(w*s.height/s.width);
 if(m.r==2)fxGold(cx,bx,by-h/2,t,w*.75,false);
 let o=HC[m.id+w];if(!o&&typeof outl=='function'){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(s,0,0,w,h);o=HC[m.id+w]=outl(c)}
 const sm=cx.imageSmoothingEnabled;cx.imageSmoothingEnabled=false;
 if(o)cx.drawImage(o,Math.round(bx-o.width/2),Math.round(by-o.height));else cx.drawImage(s,Math.round(bx-w/2),Math.round(by-h),w,h);
 cx.imageSmoothingEnabled=sm};
setInterval(()=>{if(HOLD==null)return;try{if(Pl.mv||(ST.av&&ST.av.m>=0)||Pl.sit||(typeof ACT!=='undefined'&&ACT))MQ.clear()}catch(e){}},80);

// ---------- CẦN CÂU HƯ (tiền sink) ----------
// Mỗi lần câu được quái tính +1 (ST.rodN). Chỉ khi đã câu TRÊN ROD_N con kể từ lần sửa gần nhất mới có tỉ lệ ROD_P bị hư sau mỗi con (ngẫu nhiên, không cố định).
// Hư thì không câu được cho tới khi sửa: ROD_FIX xu quái vật (sửa ngay trong khung câu hoặc ở Shop quái vật). Cân bằng: trung bình ~45 con mới hư 1 lần ≈ 1,7 xu/con (khoảng 6% thu nhập).
const ROD_N=20,ROD_P=.04,ROD_FIX=75;
const rodBroken=()=>!!ST.rodBroken;
MQ.rodBroken=rodBroken;MQ.rodFix=ROD_FIX;
MQ.repair=()=>{if(!ST.rodBroken)return;
 if((ST.qv|0)<ROD_FIX)return toast('Cần '+ROD_FIX+' xu quái vật để sửa cần câu');
 ST.qv-=ROD_FIX;ST.rodBroken=0;ST.rodN=0;try{xuUp()}catch(e){}try{save()}catch(e){}toast('🔧 Đã sửa cần câu (-'+ROD_FIX+' xu quái vật)');
 if(F){F.ph='idle';F.t=0;MQ.stat();cnt()}};
function rodRoll(){ST.rodN=(ST.rodN|0)+1;if(ST.rodN>ROD_N&&Math.random()<ROD_P){ST.rodBroken=1;return true}return false}
function rodBtn(){const b=$('mqg');if(b&&rodBroken()&&F&&F.ph!='cast'&&F.ph!='shadow'&&F.ph!='nibble'&&F.ph!='bite'){b.textContent='🔧 SỬA CẦN CÂU ('+ROD_FIX+' xu quái vật)';b.classList.remove('z')}}

// ---------- KEM CHỐNG NẮNG + RÁT DA ----------
// Rát da là NGẪU NHIÊN, tỉ lệ thấp: tăng dần theo số quái đã câu và theo thời gian ở biển (trên 15 phút). Rát da chỉ khiến bạn tạm thời không câu được.
// Kem chống nắng (Túi › Biển): thoa xong hết rát ngay + được bảo vệ SUN_PROT ms. Chỉnh ở các số SUN_* bên dưới.
const SUN_ID=100,SUN_PROT=5*60000,SUN_BURN=60000;
const SUN_CATCH=.015,SUN_CATCH_ADD=.002,SUN_CATCH_CAP=25;   // mỗi lần câu được: 1.5% + 0.2%/con đã câu (tối đa ~6.5%)
const SUN_LONG=15*60,SUN_LONG_P=.06;                          // ở biển liên tục >15 phút: mỗi phút 6%
let burnUntil=0,sunEl=null,seaSec=0,seaCatch=0;
const protLeft=()=>Math.max(0,(+ST.kcnU||0)-Date.now());
const burning=()=>burnUntil>Date.now();
const atSea=()=>{try{return !!(window.CV&&CV.boat&&typeof MAP!=='undefined'&&MAP=='bn')}catch(e){return false}};
function sunBurn(){burnUntil=Date.now()+SUN_BURN;seaSec=0;seaCatch=0;sunHud();toast('☀️ Nắng làm rát da, tạm thời chưa câu được'+((ST.kcn|0)>0?'\n🧴 Dùng kem trong Túi › Biển':''))}
function sunCatch(){if(burning()||protLeft()>0)return;seaCatch++;if(Math.random()<SUN_CATCH+SUN_CATCH_ADD*Math.min(seaCatch,SUN_CATCH_CAP))sunBurn()}
let _sun=null;const sunSpr=()=>_sun||(_sun=mkS(20,26,(r,E)=>{
 r('#fff',7,1,6,3);r('#c9d3de',7,3,6,1);r('#e8eef4',6,4,8,1);
 r('#ff9f2e',5,5,10,19);r('#ffc266',5,5,2,19);r('#d9741a',13,5,2,19);r('#c4620f',5,23,10,1);
 r('#fff6d8',6,10,8,9);r('#f0dca8',6,18,8,1);
 E('#ffb300',10,14,2,2);for(const[x,y]of[[10,10],[10,18],[7,14],[13,14],[8,11],[12,11],[8,17],[12,17]])r('#ffb300',x,y,1,1);r('#ff7a00',10,14,1,1)}));
function useSun(){
 if(!(ST.kcn>0))return;
 if(!atSea())return toast('☀️ Ra biển rồi hãy thoa kem nhé');
 if(protLeft()>30000)return toast('🧴 Bạn vẫn đang được bảo vệ khỏi nắng');
 ST.kcn=(ST.kcn|0)-1;ST.kcnU=Date.now()+SUN_PROT;burnUntil=0;seaSec=0;seaCatch=0;sunHud();try{save()}catch(e){}closeUI();toast('🧴 Đã thoa kem chống nắng!')}

// ---------- 3 LOẠI DƯỢC (Shop quái vật, xu quái vật) — dùng ở Túi › Biển; số lượng ST.pot = {phuclac, bachthuc, toany} ----------
// Phúc lạc dược 40: hết buồn ngủ ngay (Sức khỏe về 100%) • Bách thực dược 40: no căng (Độ no 100%) • Toàn ý dược 50: thuyền chạy nhanh TOAN_MS
// Hệ số tốc độ thuyền (1.6) nằm ở dòng tính tốc độ trong index.html (ST.toanU).
const POTK={101:'phuclac',102:'bachthuc',103:'toany'},POTN={101:'Phúc lạc dược',102:'Bách thực dược',103:'Toàn ý dược'},TOAN_MS=5*60000;
MQ.potId=k=>+Object.keys(POTK).find(i=>POTK[i]==k);
const toanLeft=()=>Math.max(0,(+ST.toanU||0)-Date.now());
const POTC={phuclac:['#b79bff','#d6c6ff','#7a56d8'],bachthuc:['#ffb84d','#ffd98a','#d9801a'],toany:['#4fe3c8','#9ff5e6','#1fa98f']},_pot={};
const potSpr=k=>_pot[k]||(_pot[k]=mkS(20,26,(r,E)=>{const[c,l,d]=POTC[k];
 r('#c98a52',7,1,6,3);r('#e0a46a',7,1,6,1);r('#e8f4f7',8,4,4,5);r('#cfe6ec',8,4,1,5);
 r('#e8f4f7',5,9,10,1);r('#e8f4f7',3,10,14,13);r('#e8f4f7',4,23,12,1);r('#cfe6ec',3,10,1,13);r('#cfe6ec',16,10,1,13);
 r(c,4,13,12,10);r(l,4,13,12,1);r(l,4,14,3,8);r(d,4,22,12,1);r(d,13,14,3,8);r('#fff',5,11,1,2);
 if(k=='phuclac'){r('#fff',8,15,4,1);r('#fff',11,16,1,1);r('#fff',10,17,1,1);r('#fff',8,18,4,1)}
 else if(k=='bachthuc'){r('#fff',8,15,4,4);r(c,9,16,2,2)}
 else{r('#fff',11,14,2,2);r('#fff',10,16,2,2);r('#fff',8,18,3,2);r('#fff',7,20,2,2)}}));
function usePot(i){const k=POTK[i];ST.pot=ST.pot||{};if(!(ST.pot[k]>0))return;
 if(k=='phuclac'){if(vit().h>=99.5)return toast('😊 Bạn đang rất tỉnh táo, chưa cần uống');ST.pot[k]--;vitAdd(100,0);toast('🧪 Phúc lạc dược: hết buồn ngủ rồi, tỉnh như sáo!')}
 else if(k=='bachthuc'){if(vit().f>=99.5)return toast('🍚 Bạn đang no căng rồi, chưa cần uống');ST.pot[k]--;vitAdd(0,100);toast('🧪 Bách thực dược: no căng bụng!')}
 else{if(!atSea())return toast('🧪 Lên thuyền ra biển rồi hãy uống nhé');if(toanLeft()>30000)return toast('🌊 Toàn ý dược vẫn đang có tác dụng');ST.pot[k]--;ST.toanU=Date.now()+TOAN_MS;toast('🧪 Toàn ý dược: thuyền lướt nhanh '+(TOAN_MS/60000)+' phút!')}
 try{save()}catch(e){}closeUI()}
function sunHud(){
 if(!sunEl){sunEl=document.createElement('div');
  sunEl.style.cssText='position:fixed;left:50%;top:54px;transform:translateX(-50%);z-index:24;pointer-events:none;display:none;padding:5px 12px;font:800 13px Nunito,\'Segoe UI\',Arial,sans-serif;background:#ffe3d6;border:2px solid #c4382e;border-radius:8px;color:#8a2218;box-shadow:0 2px 0 #c4382e';
  sunEl.textContent='🔥 Rát da';document.body.appendChild(sunEl)}
 sunEl.style.display=burning()?'block':'none'}
setInterval(()=>{const n=Date.now();
 if(burnUntil&&n>=burnUntil){burnUntil=0;toast('😌 Da đã hết rát')}
 if(!atSea()){seaSec=0;seaCatch=0;sunHud();return}
 if(!burning()&&protLeft()<=0){seaSec++;if(seaSec>SUN_LONG&&(seaSec-SUN_LONG)%60==0&&Math.random()<SUN_LONG_P)sunBurn()}
 sunHud()},1000);

// ---------- CSS ----------
{const s=document.createElement('style');s.textContent='#mqb{position:relative;width:30px;flex:none;background:#d9c28a;border:2px solid #7a4a26;opacity:.4}#mqb.on{opacity:1}#mqz{position:absolute;left:0;right:0;background:#5fe36a;box-shadow:0 0 10px #c8ff8a inset,0 0 8px #8dff7a;display:none}#mqk{position:absolute;left:-5px;right:-5px;height:6px;margin-top:-3px;background:#fff;border:1px solid #333;display:none}.mqr{display:flex;align-items:center;gap:8px}.mqr canvas{width:54px;height:44px;image-rendering:pixelated;background:#cfeeff;border:1px solid #c9a06a;flex:none}.mqr .t{flex:1;min-width:0;font-size:12px;line-height:1.3}.mqr .bt{display:flex;flex-direction:column;gap:3px}';document.head.appendChild(s)}

// ============================================================
//  KHUNG CÂU
// ============================================================
let F=null,raf=0,last=0;
const HX=66,SY=16,KEY=e=>(e.key==' '||e.key=='e'||e.key=='E');
const rr=(a,b)=>a+Math.random()*(b-a);
const ease=u=>1-Math.pow(1-Math.min(1,Math.max(0,u)),3);
MQ.open=(ctx)=>{
 const onBoat=window.CV&&CV.boat&&CV.cur=='bn'&&typeof MAP!=='undefined'&&MAP=='bn';
 if(!onBoat)return toast('🚣 Phải lên thuyền ra biển mới câu được! Ra cuối cầu tàu, bấm RA BIỂN nhé');
 if(burning())return toast('☀️ Da đang rát, chưa câu được');
 const bk=(ctx&&ctx.boat)||CV.bk||2;
 openUI(head('🎣 Câu quái vật')+
  '<div class="mut" id="mqs" style="text-align:center;min-height:32px"></div>'+
  '<div style="display:flex;gap:8px;justify-content:center;align-items:stretch">'+
  '<canvas id="mqc" width="120" height="90" style="width:240px;max-width:calc(100% - 44px);height:auto;aspect-ratio:4/3;image-rendering:pixelated;border:2px solid #7a4a26;background:#5fd0d8;touch-action:manipulation"></canvas>'+
  '<div id="mqb" onpointerdown="event.preventDefault();MQ.btn()"><div id="mqz"></div><div id="mqk"></div></div></div>'+
  '<button class="b w" id="mqg" style="font-size:15px;padding:10px" onpointerdown="event.preventDefault();MQ.btn()">🎣 CÂU</button>'+
  '<div class="mut" id="mqn"></div>'+
  '<button class="b w" onclick="MQ.bag()">🎒 Xem quái đã câu (Túi › Biển)</button>');
 F={ph:'idle',t:0,rip:[],parts:[],cast:0,bk:bk};MQ.stat();cnt();if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}};
MQ.bag=()=>{F=null;bagUI('b')};
const cnt=()=>{const e=$('mqn');if(e)e.innerHTML='🎒 Trong Túi › Biển: <b>'+total()+'</b> quái vật • <img src="'+QVI+'" style="width:14px;height:14px;vertical-align:-2px;image-rendering:pixelated"> <b>'+fmtXu(ST.qv|0)+'</b> Xu quái vật'+(window.seaZoneHere&&seaZoneHere()?'<br>🌑 <b>Đang ở vùng nước tối</b> — câu trúng quái có '+Math.round(ZB*100)+'% nhận quà!':'')};
const say=(s,col)=>{const e=$('mqs');if(e){e.innerHTML=s;e.style.color=col||''}};
MQ.stat=()=>{if(!F)return;const b=$('mqg');if(!b)return;const p=F.ph;
 if(p=='idle'){b.textContent='🎣 CÂU';b.classList.remove('z');say('Bấm <b>CÂU</b> để thả mồi từ thuyền xuống biển')}
 else if(p=='cast'){b.textContent='Đang thả mồi...';b.classList.add('z');say('🌊 Đang thả mồi... chờ bóng quái vật')}
 else if(p=='shadow'){b.textContent='Chờ bóng...';b.classList.add('z');say('👀 Có <b>'+SHN[F.rar]+'</b> đang bơi lại gần!')}
 else if(p=='nibble'){b.textContent='Nó đang rỉa mồi...';b.classList.add('z');say('🫧 Bóng đang rỉa mồi... <b>đừng kéo vội!</b>')}
 else if(p=='bite'){b.textContent='⚡ KÉO!';b.classList.remove('z');say('❗ <b>Cắn câu rồi!</b> Bấm KÉO khi vạch trắng nằm trong vùng xanh!','#c4382e')}
 else if(p=='win'){b.textContent='🎣 CÂU TIẾP';b.classList.remove('z')}
 else if(p=='lose'){b.textContent='🎣 CÂU LẠI';b.classList.remove('z')}
 if(rodBroken()){rodBtn();if(p=='idle')say('🔧 Cần câu bị hư — bấm để sửa','#c4382e')}};
MQ.btn=()=>{if(!F)return;const p=F.ph;
 if(rodBroken()&&(p=='idle'||p=='win'||p=='lose'))return MQ.repair();
 if(p=='idle'||((p=='win'||p=='lose')&&F.t>.8))return startCast();
 if(p=='bite')return pull()};
addEventListener('keydown',e=>{if(!F||e.repeat||!KEY(e))return;MQ.btn()});

function startCast(){if(rodBroken())return MQ.repair();if(burning()){say('☀️ Da đang rát, chưa câu được','#c4382e');return}F.ph='cast';F.t=0;F.wait=rr(1.8,2.3);F.rip=[];F.parts=[];F.dip=0;F.sh=null;F.mon=null;const z=$('mqz'),k=$('mqk'),b=$('mqb');if(z)z.style.display='none';if(k)k.style.display='none';if(b)b.classList.remove('on');MQ.stat()}
function rollMon(){if(MQ.force!=null&&MON[MQ.force])return MON[MQ.force];let u=Math.random(),rar=0;for(let i=0;i<RAR.length;i++){if(u<RAR[i].w){rar=i;break}u-=RAR[i].w;rar=i}
 const L=MON.filter(m=>m.r==rar);return L[Math.floor(Math.random()*L.length)]}
function spawnShadow(){const m=rollMon();F.mon=m;F.rar=m.r;const from=Math.random()<.5?-14:134,y=rr(52,72);F.sh={x:from,y,dir:from<0?1:-1,a:0,fx:from,fy:y,mode:0};F.ph='shadow';F.t=0;MQ.stat()}
function startBite(){F.ph='bite';F.t=0;const R=RAR[F.rar];F.zone=R.zone;F.zx=rr(.06,.94-F.zone);F.spd=R.spd;F.p0=Math.random()*2;
 const z=$('mqz'),k=$('mqk'),b=$('mqb');if(z){z.style.display='block';z.style.top=F.zx*100+'%';z.style.height=F.zone*100+'%'}if(k)k.style.display='block';if(b)b.classList.add('on');MQ.stat()}
const markPos=()=>Math.abs(((F.t*F.spd+F.p0)%2)-1);
function hideBar(){const z=$('mqz'),k=$('mqk'),b=$('mqb');if(z)z.style.display='none';if(k)k.style.display='none';if(b)b.classList.remove('on')}
function pull(){const p=markPos(),ok=p>=F.zx-.015&&p<=F.zx+F.zone+.015;
 if(ok){const m=F.mon,b=bag();b[m.id]=(b[m.id]|0)+1;try{tnProg('mon')}catch(e){}let bonus='';try{const zn=window.seaZoneHere&&seaZoneHere();if(zn&&Math.random()<ZB)bonus=giveBonus()}catch(e){}try{save()}catch(e){}
  try{sunCatch()}catch(e){}let broke=false;try{broke=rodRoll()}catch(e){}F.ph='win';F.t=0;F.parts=[];for(let i=0;i<(m.r==2?46:m.r==1?18:9);i++)F.parts.push({a:rr(0,6.283),v:rr(20,m.r==2?70:46),l:rr(.5,1.3),t:0,c:m.r==2?['#fff','#ffe27a','#ffcf3a','#ffb0e8'][i%4]:m.r==1?'#ffe27a':'#bfe8ff'});
  F.rip.push({x:HX,t:0});hideBar();
  say('🎉 Câu được <b style="color:'+RAR[m.r].col+';text-shadow:0 0 1px #000">'+m.n+'</b> ('+RAR[m.r].n.toLowerCase()+')!<br><small>Đã vào Túi › Biển • bán ở Shop quái vật: '+m.p+' xu quái vật</small>'+(bonus?'<br>'+bonus:'')+(broke?'<br><b style="color:#c4382e">🔧 Cần câu bị hư rồi!</b>':''),'#2a7a2a');
  const bt=$('mqg');if(bt)bt.textContent='🎣 CÂU TIẾP';cnt();rodBtn();
  if(m.r==2)toast('✨🐢 WOW! Bạn câu được KIM QUY huyền thoại!');if(broke)toast('🔧 Cần câu bị hư! Sửa tốn '+ROD_FIX+' xu quái vật')}
 else{F.ph='lose';F.t=0;say('💨 Hụt rồi! Quái vật tuột câu và bơi mất. Thử lại nhé!','#c4382e');F.sh.mode=9;MQ.stat();hideBar()}}

function upd(dt){F.t+=dt;F.rip.forEach(q=>q.t+=dt);F.rip=F.rip.filter(q=>q.t<1.1);F.parts.forEach(q=>q.t+=dt);
 const s=F.sh,p=F.ph;
 if(p=='cast'){if(F.t>=F.wait)spawnShadow()}
 else if(p=='shadow'){const u=ease(F.t/1.7),tx=HX+(s.dir>0?-1:1)*(10+(F.rar+1)*5),ty=44;s.a=Math.min(1,F.t*2.5);
  s.x=s.fx+(tx-s.fx)*u;s.y=s.fy+(ty-s.fy)*u+Math.sin(F.t*5)*1.2;
  if(F.t>=1.7){F.ph='nibble';F.t=0;F.nb=0;s.mode=1;MQ.stat()}}
 else if(p=='nibble'){const N=RAR[F.rar].nib,per=1.0,u=F.t/per,idx=Math.floor(u),ss=u-idx,rx=[7,12,19][F.rar];
  const far=rx+12,near=rx+3,d=far-(far-near)*Math.pow(Math.sin(Math.PI*Math.min(1,ss)),.7);
  s.x=HX+(s.dir>0?-1:1)*d;s.y=44+Math.sin(F.t*4)*1.5;
  const tch=ss>.42&&ss<.62;F.dip=tch?2.5:Math.max(0,F.dip-dt*8);
  if(tch&&F.nb<=idx){F.nb=idx+1;F.rip.push({x:HX,t:0})}
  if(idx>=N)startBite()}
 else if(p=='bite'){F.dip=Math.min(9,F.dip+dt*30);s.x=HX+(s.dir>0?-1:1)*(RAR[F.rar]?[7,12,19][F.rar]+2:10)+Math.sin(F.t*30)*1.2;s.y=44+Math.sin(F.t*22)*1.2;
  const k=$('mqk');if(k)k.style.top=markPos()*100+'%';
  if(F.t>7){F.ph='lose';F.t=0;say('💨 Chờ lâu quá, quái vật nhả mồi bơi mất. Thử lại nhé!','#c4382e');s.mode=9;MQ.stat();hideBar()}}
 else if(p=='lose'){s.x+=s.dir*-1*90*dt;s.a=Math.max(0,s.a-dt*1.2);F.dip=Math.max(0,F.dip-dt*14)}
 else if(p=='win'){F.dip=Math.max(0,F.dip-dt*14)}}

// ---------- vẽ cảnh ----------
const BANDS=['#6fd9d6','#5cc8d4','#4cb4d0','#3ea0c8','#318abc','#2874ae','#1f609c','#194f88'];
function shadow(g,x,y,rar,dir,a,t){g.save();g.globalAlpha=.55*a;g.translate(Math.round(x),Math.round(y));g.scale(dir,1);
 const C='#0a2450',w=Math.sin(t*9)*1.4;
 if(rar==0){g.fillStyle=C;g.beginPath();g.ellipse(0,0,7,3.4,0,0,6.283);g.fill();g.beginPath();g.moveTo(-6,0);g.lineTo(-11,-3+w);g.lineTo(-11,3+w);g.fill()}
 else if(rar==1){g.fillStyle=C;g.beginPath();g.ellipse(0,0,12,5.2,0,0,6.283);g.fill();g.beginPath();g.moveTo(-10,0);g.lineTo(-17,-5+w);g.lineTo(-17,5+w);g.fill();g.beginPath();g.moveTo(-3,-4);g.lineTo(2,-9);g.lineTo(5,-4);g.fill();g.beginPath();g.moveTo(0,4);g.lineTo(-3,8);g.lineTo(4,4);g.fill()}
 else{g.fillStyle=C;g.beginPath();g.ellipse(0,0,17,10,0,0,6.283);g.fill();g.beginPath();g.ellipse(18,-1,5,3.6,0,0,6.283);g.fill();g.beginPath();g.ellipse(-5,-10+w*.4,7,3,-.5,0,6.283);g.fill();g.beginPath();g.ellipse(9,10-w*.4,7,3,.5,0,6.283);g.fill();g.beginPath();g.ellipse(-5,10-w*.4,6,3,.5,0,6.283);g.fill();g.beginPath();g.moveTo(-16,0);g.lineTo(-22,1+w*.4);g.lineTo(-16,3);g.fill();
  g.globalAlpha=.3*a+.1*Math.sin(t*4);g.strokeStyle='#ffd23f';g.lineWidth=1;g.beginPath();g.ellipse(0,0,19,12,0,0,6.283);g.stroke()}
 g.restore()}
function boatScene(g,k,t,y){
 g.fillStyle='rgba(20,60,100,.35)';g.fillRect(0,SY+3,36,5);
 if(k==3){g.fillStyle='#cfe0ea';g.fillRect(0,y+3,34,8);g.fillStyle='#fff';g.fillRect(0,y,34,6);g.fillStyle='#ff8fb5';g.fillRect(0,y+7,32,1);g.fillStyle='#ffc2d8';g.fillRect(4,y-1,24,2);
  g.fillStyle='#fff';g.fillRect(0,y-9,5,11);g.fillRect(2,y-13,6,6);g.fillStyle='#ffa733';g.fillRect(8,y-11,4,2);g.fillStyle='#222';g.fillRect(5,y-11,1,2)}
 else{g.fillStyle='#7a4e28';g.fillRect(0,y+4,34,6);g.fillStyle='#b8764a';g.fillRect(0,y+1,34,6);g.fillStyle='#c98a5a';g.fillRect(0,y,34,3);g.fillStyle='#f6dc9c';g.fillRect(0,y,34,1);g.fillStyle='#e0584a';g.fillRect(0,y+3,34,1);g.fillStyle='#8a5a30';g.fillRect(3,y+8,28,1)}
 g.fillStyle='#f2c9a0';g.fillRect(12,y-9,6,6);g.fillStyle='#5a3a22';g.fillRect(11,y-11,8,3);g.fillStyle='#3a6fb0';g.fillRect(11,y-3,8,4)}
function draw(c){const g=c.getContext('2d');g.imageSmoothingEnabled=false;const t=performance.now()/1000,W=120,H=90;
 // trời + nước
 g.fillStyle='#cfeeff';g.fillRect(0,0,W,SY);g.fillStyle='#fff';g.fillRect(84,3,14,3);g.fillRect(88,1,8,2);g.fillRect(12,5,10,2);
 for(let i=0;i<BANDS.length;i++){g.fillStyle=BANDS[i];g.fillRect(0,SY+Math.floor(i*(H-SY)/BANDS.length),W,Math.ceil((H-SY)/BANDS.length)+1)}
 g.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<4;i++){const x=40+i*22+Math.sin(t*.6+i)*4;g.beginPath();g.moveTo(x,SY);g.lineTo(x+10,SY);g.lineTo(x+30,H);g.lineTo(x+14,H);g.fill()}
 g.fillStyle='rgba(255,255,255,.55)';for(let x=0;x<W;x+=7)g.fillRect(x+Math.round(Math.sin(t*2+x)*1.5),SY,4,1);
 // thuyền (mini / thiên nga) + cần câu cắm bên mạn thuyền
 const by0=F.bk?10+Math.round(Math.sin(t*2.2)):9;
 if(F.bk)boatScene(g,F.bk,t,by0);
 else{g.fillStyle='#5e3f20';g.fillRect(5,18,3,26);g.fillRect(20,18,3,22);g.fillStyle='rgba(20,60,100,.35)';g.fillRect(0,SY+2,28,6);
  g.fillStyle='#b8864e';g.fillRect(0,10,28,7);g.fillStyle='#d6a66a';g.fillRect(0,10,28,2);g.fillStyle='#8a5f33';g.fillRect(0,16,28,1)}
 const tipX=46,tipY=1,rx0=F.bk?24:18,RL=44-rx0;g.fillStyle='#6b4220';for(let i=0;i<=RL;i++)g.fillRect(rx0+i,by0-Math.round(i*(by0-1)/RL),2,2);g.fillStyle='#d9a441';g.fillRect(tipX,tipY,2,2);
 // phao + dây
 let fy=SY-2+(F.dip||0);
 if(F.ph=='cast'&&F.t<.45){fy=-6+(SY-2+6)*ease(F.t/.45)*1;if(F.t>=.4&&!F.spl){F.spl=1;F.rip.push({x:HX,t:0})}}else F.spl=F.ph=='cast'?F.spl:0;
 g.fillStyle='rgba(255,255,255,.8)';{const n=40;for(let i=0;i<=n;i++){const u=i/n;g.fillRect(Math.round(tipX+(HX-tipX)*u),Math.round(tipY+(fy-tipY)*u+Math.sin(u*Math.PI)*5),1,1)}}
 const hy=Math.round(fy+20);
 if(fy>SY-4){g.fillStyle='rgba(255,255,255,.65)';g.fillRect(HX,Math.round(fy+3),1,hy-Math.round(fy+3));g.fillStyle='#c8c8d0';g.fillRect(HX-1,hy,3,1);g.fillRect(HX-1,hy-1,1,1);g.fillStyle='#ff9ab8';g.fillRect(HX-2,hy-3,2,2)}
 g.fillStyle='#e8402a';g.fillRect(HX-1,Math.round(fy)-3,3,3);g.fillStyle='#fff';g.fillRect(HX-1,Math.round(fy),3,2);
 // gợn sóng
 for(const q of F.rip){const a=1-q.t/1.1;g.strokeStyle='rgba(255,255,255,'+(.8*a).toFixed(2)+')';g.lineWidth=1;g.beginPath();g.ellipse(q.x,SY+1,2+q.t*16,1+q.t*3,0,0,6.283);g.stroke()}
 // bóng
 if(F.sh&&F.ph!='win')shadow(g,F.sh.x,F.sh.y,F.rar,F.sh.dir,F.sh.a,t);
 if(F.ph=='bite'){for(let i=0;i<3;i++){g.fillStyle='rgba(255,255,255,.7)';g.fillRect(HX-6+((i*7+Math.floor(t*10))%12),SY-2-((t*30+i*5)%9|0),1,1)}
  g.fillStyle='#fff';g.fillRect(HX+6,SY-14,2,5);g.fillRect(HX+6,SY-7,2,2);g.fillStyle='#e8402a';g.fillRect(HX+5,SY-15,2,5);g.fillRect(HX+5,SY-8,2,2)}
 // quái vật nhảy lên
 if(F.ph=='win'&&F.mon){const m=F.mon,u=Math.min(1,F.t/.7),x=HX+(60-HX)*ease(u),y=hy-(hy-40)*ease(u)-Math.sin(Math.PI*u)*18,w=m.r==2?50:m.r==1?38:34;
  if(m.r==2)fxGold(g,60,44,t,48,'rays');
  put(g,m.id,x,y+(u>=1?Math.sin(t*3)*2:0),w,t,false);
  for(const q of F.parts){if(q.t>q.l)continue;const a=1-q.t/q.l;g.globalAlpha=a;g.fillStyle=q.c;const px=60+Math.cos(q.a)*q.v*q.t,py=44+Math.sin(q.a)*q.v*q.t+q.t*q.t*14;g.fillRect(Math.round(px),Math.round(py),2,2);if(m.r==2)star(g,px,py,1,q.c);g.globalAlpha=1}}}
function loop(ts){raf=0;if(!F)return;const c=$('mqc');if(!c||!UI){F=null;return}
 const dt=Math.min(.05,(ts-last)/1000||0);last=ts;upd(dt);draw(c);raf=requestAnimationFrame(loop)}

// ============================================================
//  THU MUA QUÁI VẬT (trong Shop quái vật)
// ============================================================
let SC=null,SCT=0;
MQ.sellUI=()=>{F=null;const b=bag(),L=MON.map((m,i)=>({m,i,c:b[m.id]|0})).filter(x=>x.c>0).sort((a,c)=>c.m.r-a.m.r||a.i-c.i);
 let sum=0;for(const x of L)sum+=x.c*x.m.p;
 let h=head('💰 Thu mua quái vật')+'<div class="mut" style="text-align:center">🐙 <i>"Quái vật tươi roi rói! Bán đây tôi thu mua hết nè~"</i></div>'+
  '<div class="mut" style="text-align:center">Bạn có <img src="'+QVI+'" style="width:15px;height:15px;vertical-align:-3px;image-rendering:pixelated"> <b>'+fmtXu(ST.qv|0)+'</b> Xu quái vật</div>';
 if(!L.length)h+='<div class="mut" style="text-align:center">Bạn chưa câu được quái vật nào. Lên thuyền ra biển để câu nhé! 🎣</div>';
 else{h+='<div class="g1">'+L.map(x=>{const sure=SC==x.m.id&&performance.now()<SCT;
   return '<div class="it mqr"><canvas class="mqs" data-id="'+x.m.id+'" width="54" height="44"></canvas><div class="t"><b>'+x.m.n+'</b> <small>('+RAR[x.m.r].n+')</small><br><small>'+x.m.p+' xu/con • đang có <b>x'+x.c+'</b></small></div>'+
   '<div class="bt"><button class="b" onclick="MQ.sell(\''+x.m.id+'\',0)">'+(sure?'⚠️ Chắc chưa?':'Bán 1 (+'+x.m.p+')')+'</button>'+(x.c>1?'<button class="b" onclick="MQ.sell(\''+x.m.id+'\',1)">Bán hết (+'+x.c*x.m.p+')</button>':'')+'</div></div>'}).join('')+'</div>';
  h+='<button class="b w" onclick="MQ.sellAll()">💰 Bán tất cả (+'+fmtXu(sum)+' Xu quái vật)</button>'}
 h+='<button class="b w" onclick="MQ.shop()">⬅ Về tiệm</button>';
 openUI(h);document.querySelectorAll('canvas.mqs').forEach(c=>{const g=c.getContext('2d');put(g,c.dataset.id,27,22,MON[idxOf(c.dataset.id)].r==2?42:34,0,false)})};
MQ.sell=(id,all)=>{const m=MON[idxOf(id)],b=bag(),c=b[id]|0;if(!m||c<1)return MQ.sellUI();
 if(m.r==2&&!(SC==id&&performance.now()<SCT)){SC=id;SCT=performance.now()+4000;toast('⚠️ Kim Quy rất hiếm! Bấm lần nữa để chắc chắn bán');return MQ.sellUI()}
 const n=all?c:1;b[id]=c-n;ST.qv=(ST.qv|0)+n*m.p;SC=null;try{xuUp()}catch(e){}try{save()}catch(e){}toast('💰 Đã bán '+n+' '+m.n+' → +'+fmtXu(n*m.p)+' Xu quái vật');MQ.sellUI()};
MQ.sellAll=()=>{const b=bag();let sum=0,n=0;for(const m of MON){const c=b[m.id]|0;if(c>0){sum+=c*m.p;n+=c}}
 if(!n)return toast('Bạn chưa có quái vật nào để bán');
 if((b[KQ_ID]|0)>0&&!(SC=='all'&&performance.now()<SCT)){SC='all';SCT=performance.now()+4000;toast('⚠️ Trong túi có Kim Quy! Bấm lần nữa để bán tất cả');return}
 for(const m of MON)b[m.id]=0;ST.qv=(ST.qv|0)+sum;SC=null;try{xuUp()}catch(e){}try{save()}catch(e){}toast('💰 Bán '+n+' quái vật → +'+fmtXu(sum)+' Xu quái vật');MQ.sellUI()};
MQ.shop=()=>{if(window.bnShop)window.bnShop();else closeUI()};
})();
