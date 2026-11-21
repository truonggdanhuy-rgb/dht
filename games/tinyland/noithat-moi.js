/* ===================================================================================
   NOITHAT-MOI.JS — 14 Món Nội Thất Nhà Mới (Tiệm nội thất ở Phố xá)
   • Kawaii / Capybara: Sofa Capybara, Giường mây cầu vồng, Gương tai thỏ phát sáng, Bàn trà dâu kem, Thảm gấu mây
   • Biển Đêm / Thủy Cung: Bể cá phát sáng, Đèn sứa lơ lửng, Giường vỏ sò ngọc trai, Thảm sóng biển
   • Chill Ban Đêm & Âm Nhạc: Lò sưởi ấm, Đàn Piano lớn, Kệ đĩa than, Cửa sổ trời sao, Bể cá Koi
   • Tự đăng ký vào CAT, DR, ANI, FURN_PR và hỗ trợ ngồi (hmSeat) cho sofa / piano / giường.
   =================================================================================== */
(function(){
'use strict';
if(typeof CAT==='undefined'||typeof DR==='undefined'||typeof ANI==='undefined')return;

const bx=(r,x,y,w,h,c,d)=>{r(d,x,y,w,h);r(c,x,y,w,h-1);r('rgba(255,255,255,0.22)',x+1,y,Math.max(1,w-2),1)};

// ============================================================
//  1. SOFA CAPYBARA (5x2 = 40x16) — có thể ngồi nghỉ!
// ============================================================
DR.capysofa=r=>{
 // chân gỗ nhỏ
 r('#5c3619',2,15,3,1);r('#5c3619',35,15,3,1);
 // lưng tựa hình đầu capybara bầu bĩnh: tai tròn 2 bên + trán nâu ấm + mũi + mắt hí chill
 r('#845229',3,1,4,3);r('#b87b48',4,2,2,2);
 r('#845229',33,1,4,3);r('#b87b48',34,2,2,2);
 bx(r,4,0,32,9,'#b87b48','#845229');
 r('#dfa36e',6,1,28,2);
 // mặt capybara trên tựa lưng: mắt hí -_-, má hồng, mõm nâu sẫm
 r('#24140a',12,4,3,1);r('#24140a',25,4,3,1);
 r('#f299a8',10,5,2,1);r('#f299a8',28,5,2,1);
 r('#6b3e1d',17,3,6,4);r('#24140a',19,3,2,1);r('#24140a',19,5,2,1);
 // 2 tay vịn bo tròn + đệm ngồi màu kem mềm mại + gối quả quýt
 bx(r,0,5,6,10,'#a66b3c','#74431e');r('#dfa36e',1,6,4,2);
 bx(r,34,5,6,10,'#a66b3c','#74431e');r('#dfa36e',35,6,4,2);
 bx(r,6,7,28,8,'#fff3de','#d9be94');r('#ffffff',7,8,26,2);
 r('#d9be94',20,8,1,6);
 // gối quýt xinh đặt góc ghế
 E(r,'#ff8a1f',10,9,3,2);r('#ffd054',9,8,2,1);r('#3ea84f',10,6,2,2);
 // mép đáy gỗ
 r('#74431e',5,14,30,1);
};

// ============================================================
//  2. GIƯỜNG MÂY CẦU VỒNG (5x4 = 40x32)
// ============================================================
DR.cloudbed=r=>{
 E(r,'rgba(0,0,0,0.16)',20,31,18,1);
 // vòm cầu vồng 7 sắc sau đầu giường
 const RB=['#ff6b8b','#ffa14a','#ffe45e','#76e896','#66dbff','#879eff','#c488ff'];
 for(let y=0;y<=12;y++){
  for(let x=2;x<38;x++){
   const dist=Math.hypot(x-19.5,(y-11)*1.25);
   if(dist>=11.5&&dist<18.5){
    const idx=Math.min(6,Math.floor((18.5-dist)));
    r(RB[idx],x,y,1,1);
   }
  }
 }
 // đầu giường hình đám mây trắng viền xanh nhạt
 E(r,'#9ec2ef',20,9,17,5);
 E(r,'#ffffff',10,8,7,4);E(r,'#ffffff',20,7,9,5);E(r,'#ffffff',30,8,7,4);
 r('#e3f0ff',6,11,28,2);
 // khung giường pastel
 bx(r,4,12,32,19,'#f0f6ff','#9cb8e3');
 // 2 chiếc gối sao êm ái
 bx(r,7,13,12,6,'#ffffff','#cfe0f5');r('#ffd447',12,15,2,2);
 bx(r,21,13,12,6,'#ffffff','#cfe0f5');r('#ff96c5',26,15,2,2);
 // chăn bông mây hồng-tím-xanh pastel + dải bèo trắng
 bx(r,5,19,30,10,'#ffc9e3','#d98fb3');
 r('#ffffff',5,19,30,2);
 r('#bae8ff',6,23,28,2);
 r('#fff0a8',14,25,3,2);r('#fff0a8',24,22,2,2);
 // chân gỗ đầu cuối giường
 r('#9cb8e3',6,30,3,2);r('#9cb8e3',31,30,3,2);
};

// ============================================================
//  3. GƯƠNG ĐỨNG TAI THỎ PHÁT SÁNG (2x4 = 16x32)
// ============================================================
DR.bunmir=r=>{
 E(r,'rgba(0,0,0,0.18)',8,31,6,1);
 // 2 tai thỏ dài trên đỉnh gương
 r('#f2b6cf',3,0,4,7);r('#ffffff',4,1,2,5);r('#ff85b3',4,2,2,3);
 r('#f2b6cf',9,0,4,7);r('#ffffff',10,1,2,5);r('#ff85b3',10,2,2,3);
 // khung gương bo tròn trắng hồng + chân đế
 bx(r,1,6,14,21,'#fff4f8','#d98fb3');
 r('#ffb5d4',2,7,12,19);
 // mặt gương kính sáng long lanh
 r('#cbe8ff',3,8,10,17);
 r('#e8f7ff',4,9,4,10);
 r('#ffffff',5,10,1,5);r('#ffffff',6,11,1,2);
 // chân đỡ gỗ trắng
 r('#d98fb3',4,27,2,4);r('#d98fb3',10,27,2,4);
 r('#fff4f8',3,30,10,1);
};
ANI.bunmir=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('bunmir',0),X-1,Y-1);
 const p=0.45+0.45*Math.sin(t*3.2);
 cx.globalAlpha=0.25+p*0.4;
 cx.fillStyle='#ffe8f6';
 // bóng đèn LED viền gương
 for(let y=8;y<25;y+=3){cx.fillRect(X+2,Y+y,1,2);cx.fillRect(X+13,Y+y,1,2)}
 cx.fillRect(X+4,Y+7,8,1);cx.fillRect(X+4,Y+25,8,1);
 cx.globalAlpha=0.14+p*0.12;
 cx.fillStyle='#ffb5e0';
 cx.fillRect(X-1,Y+6,18,22);
 cx.globalAlpha=1;
};

// ============================================================
//  4. BÀN TRÀ DÂU KEM (3x2 = 24x16)
// ============================================================
DR.strawtbl=r=>{
 E(r,'rgba(0,0,0,0.16)',12,15,10,1);
 // chân bàn kem pastel
 r('#c98fa0',4,9,2,6);r('#c98fa0',18,9,2,6);
 r('#ffd9e6',5,9,1,5);r('#ffd9e6',18,9,1,5);
 // thân bánh kem tròn + viền kem chảy
 E(r,'#e69db5',12,7,11,5);
 E(r,'#fff8f0',12,5,11,4);
 // dải kem hồng chảy rủ
 for(let x=2;x<22;x+=3){r('#ffb3cd',x,7,2,2+(x%2))}
 // tách trà & đĩa bánh dâu trên mặt bàn
 r('#ffffff',5,3,5,2);r('#ff789e',6,2,3,2);r('#ffe478',7,2,1,1);
 r('#fff0f5',14,3,5,3);r('#e84365',15,1,2,2);r('#6fd16a',16,0,1,1);
};

// ============================================================
//  5. THẢM GẤU MÂY (6x4 = 48x32)
// ============================================================
DR.bearrug=r=>{
 // 2 tai gấu tròn phía trên
 E(r,'#e3cbb0',11,5,6,5);E(r,'#fff7eb',11,5,5,4);E(r,'#ffafc9',11,5,3,2);
 E(r,'#e3cbb0',37,5,6,5);E(r,'#fff7eb',37,5,5,4);E(r,'#ffafc9',37,5,3,2);
 // thảm bầu dục lông xù mềm mại
 E(r,'#dcc0a1',24,18,22,12);
 E(r,'#fff7eb',24,17,21,11);
 E(r,'#ffffff',24,15,17,8);
 // mặt gấu dễ thương dệt trên thảm
 r('#6b4834',16,13,2,2);r('#6b4834',30,13,2,2);
 r('#ff9fc2',13,16,3,2);r('#ff9fc2',32,16,3,2);
 E(r,'#fff0d8',24,17,5,3);
 r('#6b4834',23,16,2,1);r('#6b4834',22,18,4,1);
 // viền chỉ hồng pastel
 r('#ffd4e5',12,24,24,1);
};

// ============================================================
//  6. BỂ CÁ PHÁT SÁNG (5x4 = 40x32)
// ============================================================
DR.aquarium=r=>{
 E(r,'rgba(0,0,0,0.22)',20,31,19,1);
 // tủ đỡ gỗ xanh biển đậm bên dưới
 bx(r,1,19,38,12,'#263b59','#152236');
 r('#36537d',3,21,16,8);r('#36537d',21,21,16,8);
 r('#ffd25a',16,24,2,2);r('#ffd25a',22,24,2,2);
 // khung kính bể cá + nắp đèn LED trên nóc
 bx(r,0,0,40,3,'#1a2b42','#0d1726');
 r('#7cf7ff',4,2,32,1);
 r('#0f2d4f',1,3,38,16);
 r('#184c7a',2,4,36,14);
 r('#2373a8',3,5,34,11);
 // cát trắng đáy bể + san hô phát sáng + rong biển
 r('#e6d7b0',2,15,36,3);r('#fff0cc',4,15,20,1);
 r('#32b86d',5,9,2,6);r('#52e08d',7,10,1,5);
 r('#ff6fa8',31,10,2,5);r('#ff9ec8',29,11,2,4);r('#ff9ec8',33,12,2,3);
 r('#4de8ff',19,12,2,3);r('#8ef7ff',17,13,2,2);
 // vệt kính bóng
 r('rgba(255,255,255,0.25)',3,5,2,9);r('rgba(255,255,255,0.15)',6,5,1,6);
};
ANI.aquarium=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('aquarium',0),X-1,Y-1);
 // ánh sáng cyan dịu từ bể cá
 cx.globalAlpha=0.14+0.05*Math.sin(t*2.8);
 cx.fillStyle='#6ef7ff';
 cx.fillRect(X+2,Y+3,36,15);
 cx.fillRect(X-1,Y+18,42,6);
 cx.globalAlpha=1;
 // 3 con cá bơi qua lại
 const fishes=[
  {c:'#ff8a2e',c2:'#fff6d6',y:8,sp:0.9,ph:0},
  {c:'#ffe34a',c2:'#ff7aa8',y:12,sp:1.25,ph:2.1},
  {c:'#7af5ff',c2:'#ffffff',y:10,sp:0.7,ph:4.2}
 ];
 for(const f of fishes){
  const u=Math.sin(t*f.sp+f.ph);
  const fx=Math.round(X+19+u*12);
  const fy=Math.round(Y+f.y+Math.sin(t*2.4+f.ph)*1.2);
  const dir=Math.cos(t*f.sp+f.ph)>=0?1:-1;
  r(f.c,fx-1,fy,4,2);
  r(f.c2,dir>0?fx+2:fx-1,fy,1,1);
  r(f.c,dir>0?fx-2:fx+3,fy+(Math.floor(t*8)%2),1,1);
 }
 // bong bóng nhỏ nổi lên
 for(let i=0;i<4;i++){
  const p=(t*0.7+i*0.25)%1;
  const bx0=Math.round(X+8+i*8+Math.sin(t*4+i)*1);
  const by0=Math.round(Y+15-p*11);
  cx.globalAlpha=Math.sin(p*Math.PI)*0.85;
  r('#dffbff',bx0,by0,1,1);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  7. ĐÈN SỨA LƠ LỬNG (2x3 = 16x24)
// ============================================================
DR.jellylamp=r=>{
 E(r,'rgba(0,0,0,0.2)',8,23,6,1);
 // chân đế đồng chạm khắc
 bx(r,3,19,10,4,'#d4a24a','#8a6020');
 r('#ffe082',4,19,8,1);
 // lồng thủy tinh trụ
 bx(r,2,2,12,17,'#213b66','#132442');
 r('#2e5894',3,3,10,15);
 r('#e8c060',3,1,10,2);r('#ffe488',6,0,4,1);
 // phản quang kính
 r('rgba(255,255,255,0.28)',3,4,1,12);
};
ANI.jellylamp=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('jellylamp',0),X-1,Y-1);
 const by=Math.round(Y+8+Math.sin(t*2.5)*1.8);
 cx.globalAlpha=0.2+0.08*Math.sin(t*3.5);
 cx.fillStyle='#ff8ce6';
 cx.fillRect(X+2,Y+3,12,15);
 cx.globalAlpha=1;
 // con sứa phát sáng bồng bềnh
 r('#ff7ae0',X+5,by,6,3);r('#ffc9f5',X+6,by,4,1);r('#ffffff',X+6,by+1,2,1);
 const sw=Math.round(Math.sin(t*5));
 r('#d98cff',X+5+sw,by+3,1,4);r('#9cf2ff',X+8,by+3,1,5);r('#ff96e0',X+10-sw,by+3,1,4);
};

// ============================================================
//  8. GIƯỜNG VỎ SÒ NGỌC TRAI (5x4 = 40x32)
// ============================================================
DR.shellbed=r=>{
 E(r,'rgba(0,0,0,0.18)',20,31,18,1);
 // đầu giường vỏ sò lớn màu hồng ngọc trai
 E(r,'#d66d98',20,9,17,8);
 E(r,'#ff9ec4',20,9,15,7);
 E(r,'#ffd1e6',20,9,11,5);
 // rãnh nan vỏ sò
 for(const dx of[-9,-4,0,4,9])r('#e878a5',20+dx,4,1,8);
 // viên ngọc trai phát sáng giữa vỏ sò
 E(r,'#fff8e6',20,8,3,2);r('#ffffff',19,7,2,1);
 // thân giường xanh ngọc biển + gối + chăn sóng biển
 bx(r,4,12,32,19,'#4ec4c8','#247b87');
 bx(r,7,13,12,5,'#fff7fc','#d9b6d4');
 bx(r,21,13,12,5,'#fff7fc','#d9b6d4');
 r('#ff8a5a',11,14,3,3); // sao biển nhỏ trên gối
 bx(r,5,18,30,11,'#5ee0d4','#2b9da3');
 r('#ffffff',5,18,30,2);r('#a8fff5',7,22,26,2);
 r('#ffd1e6',6,26,28,2);
};

// ============================================================
//  9. THẢM SÓNG BIỂN (6x4 = 48x32)
// ============================================================
DR.waverug=r=>{
 E(r,'#238096',24,16,22,14);
 E(r,'#4ecde0',24,16,21,13);
 E(r,'#88eeff',24,15,16,9);
 E(r,'#ffffff',24,15,11,5);
 E(r,'#4ecde0',24,16,7,3);
 // họa tiết vỏ sò & sao biển trên thảm
 r('#ffd2e8',12,18,4,3);r('#fff',13,19,2,1);
 r('#ff9c5a',34,11,3,3);r('#ffe07d',35,12,1,1);
};

// ============================================================
//  10. LÒ SƯỞI ẤM (4x4 = 32x32) — lửa bập bùng & hắt sáng ấm!
// ============================================================
DR.fireplace=r=>{
 E(r,'rgba(0,0,0,0.2)',16,31,15,1);
 // ống khói đá phía trên
 bx(r,8,0,16,10,'#9c948c','#6b635c');
 for(const[x,y]of[[9,2],[16,2],[12,6],[19,6]])r('#7a726a',x,y,5,3);
 // bệ lò sưởi gạch + bệ gỗ cổ điển
 bx(r,2,9,28,22,'#a89e94','#756c63');
 bx(r,1,8,30,3,'#8a5228','#5c3416');r('#b87442',2,8,28,1);
 // vòm hốc lò đen sâu + củi cháy
 r('#261d1c',7,15,18,14);
 r('#171110',8,16,16,12);
 r('#6e3f20',10,25,12,3);r('#4a2812',12,24,8,2);
 // tất treo hoặc đồng hồ nhỏ trang trí trên bệ lò
 bx(r,13,3,6,5,'#d4a03f','#8a621c');r('#fff7e0',14,4,4,3);r('#222',16,4,1,2);
 r('#e8383d',4,11,3,5);r('#ffffff',4,11,3,1);
 r('#3f9a4a',25,11,3,5);r('#ffffff',25,11,3,1);
 // thảm đá trước lò
 r('#756c63',4,29,24,3);r('#9c948c',6,29,20,2);
};
ANI.fireplace=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('fireplace',0),X-1,Y-1);
 const fl=Math.sin(t*11)*1.2,fl2=Math.cos(t*15);
 // hắt ánh sáng ấm ra phía trước sàn
 cx.globalAlpha=0.18+0.05*Math.sin(t*8);
 cx.fillStyle='#ff9a3a';
 cx.fillRect(X+2,Y+15,28,18);
 cx.globalAlpha=1;
 // ngọn lửa cam & vàng nhảy múa
 E(r,'#ff5719',X+16,Y+23,6,4);
 E(r,'#ff9624',X+16+Math.round(fl*0.5),Y+21-Math.round(Math.abs(fl)),4,4);
 E(r,'#ffe666',X+16,Y+22-Math.round(Math.abs(fl2)),2,3);
 // tàn lửa bay lên
 for(let i=0;i<3;i++){
  const p=(t*0.9+i*0.33)%1;
  cx.globalAlpha=1-p;
  r('#ffe67a',Math.round(X+12+i*4+Math.sin(t*6+i)*2),Math.round(Y+22-p*8),1,1);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  11. ĐÀN PIANO LỚN (5x4 = 40x32) — ngồi chơi được!
// ============================================================
DR.piano=r=>{
 E(r,'rgba(0,0,0,0.2)',20,31,18,1);
 // thân đàn gỗ mun đen bóng + viền vàng đồng
 bx(r,2,2,36,20,'#282b36','#12131a');
 r('#43495c',4,3,32,2);
 // giá để bản nhạc & sheet nhạc trắng
 bx(r,14,6,12,5,'#3d4252','#1a1d26');
 r('#ffffff',15,7,10,3);r('#333',16,8,8,1);
 // bàn phím trắng đen
 bx(r,4,13,32,5,'#ffffff','#cfd6e0');
 for(let x=6;x<34;x+=3)if(x%9!==3)r('#14161c',x,13,2,3);
 // chân đàn + pedal vàng
 r('#12131a',4,22,4,6);r('#12131a',32,22,4,6);
 r('#ffd24a',17,25,6,2);
 // ghế đàn piano phía trước (ngồi được!)
 bx(r,12,24,16,5,'#78412a','#4a2414');
 r('#a85e3e',13,24,14,2);
 r('#282b36',13,29,2,3);r('#282b36',25,29,2,3);
};

// ============================================================
//  12. KỆ ĐĨA THAN (3x4 = 24x32) — đĩa quay + nốt nhạc!
// ============================================================
DR.vinyl=r=>{
 E(r,'rgba(0,0,0,0.2)',12,31,10,1);
 // tủ gỗ óc chó retro
 bx(r,2,10,20,19,'#8a522a','#573014');
 r('#573014',3,11,18,16);
 // hàng đĩa nhiều màu xếp đứng bên trong kệ
 const VC=['#ff6b8b','#4ac8ff','#ffd24a','#78e08f','#c488ff','#ff9c4a','#f2f2f2'];
 for(let i=0;i<7;i++){r(VC[i],4+i*2,13,2,13);r('rgba(0,0,0,0.2)',5+i*2,13,1,13)}
 r('#573014',4,29,2,3);r('#573014',18,29,2,3);
 // mâm đĩa than phía trên
 bx(r,3,4,18,6,'#c99c66','#8a6030');
 E(r,'#1b1d24',10,6,6,3);
 E(r,'#e85a7a',10,6,2,1);
 // kim đọc & loa nhỏ
 r('#d4dce6',18,3,1,4);r('#ffd24a',17,6,1,1);
};
ANI.vinyl=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('vinyl',0),X-1,Y-1);
 // vệt sáng quay trên đĩa than
 const sp=Math.floor(t*6)%4;
 const dx=[-3,0,3,0][sp],dy=[0,-1,0,1][sp];
 r('#8f99ad',X+10+dx,Y+6+dy,2,1);
 // nốt nhạc bay lên nhẹ nhàng
 const p=(t*0.6)%1;
 cx.globalAlpha=Math.sin(p*Math.PI);
 const nx=Math.round(X+12+Math.sin(t*4)*3),ny=Math.round(Y+3-p*8);
 r('#ff85c0',nx,ny,2,2);r('#ff85c0',nx+1,ny-3,1,4);r('#ff85c0',nx+2,ny-3,1,1);
 cx.globalAlpha=1;
};

// ============================================================
//  13. CỬA SỔ TRỜI SAO (4x2 = 32x16, treo tường 'w')
// ============================================================
DR.starwin=r=>{
 bx(r,0,0,32,16,'#6e4326','#472914');
 r('#0f1636',2,2,28,12);
 r('#1a2659',3,3,26,9);
 // rèm xanh-tím dịu hai bên
 r('#475ba8',2,2,4,12);r('#697fd4',3,2,1,12);
 r('#475ba8',26,2,4,12);r('#697fd4',28,2,1,12);
 // khung chữ thập
 r('#6e4326',15,2,2,12);r('#6e4326',2,8,28,1);
 r('#99633c',0,15,32,1);
};
ANI.starwin=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('starwin',0),X-1,Y-1);
 // trăng lưỡi liềm vàng
 r('#ffe678',X+21,Y+4,3,4);r('#1a2659',X+20,Y+5,2,2);
 // sao lấp lánh bên ngoài cửa sổ
 const stars=[[8,5],[12,10],[19,9],[24,11],[10,7]];
 for(let i=0;i<stars.length;i++){
  const a=0.35+0.65*Math.abs(Math.sin(t*2.8+i*1.9));
  cx.globalAlpha=a;
  r('#ffffff',X+stars[i][0],Y+stars[i][1],1,1);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  14. BỂ CÁ KOI (4x3 = 32x24)
// ============================================================
DR.koitank=r=>{
 E(r,'rgba(0,0,0,0.2)',16,23,15,1);
 // chậu đá / gỗ bát giác trang nhã
 bx(r,1,4,30,18,'#78828a','#4d545c');
 r('#a4aeb8',2,4,28,2);
 // mặt nước xanh ngọc + lá sen nhỏ
 E(r,'#1e6a82',16,12,13,6);
 E(r,'#2f92ad',16,12,11,5);
 E(r,'#4fb8cf',15,11,8,3);
 E(r,'#4eb85c',22,10,3,2);r('#ff96c2',23,9,1,1);
};
ANI.koitank=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('koitank',0),X-1,Y-1);
 // 2 chú cá Koi bơi vòng tròn
 for(let i=0;i<2;i++){
  const a=t*1.4+i*3.14;
  const kx=Math.round(X+16+Math.cos(a)*7);
  const ky=Math.round(Y+12+Math.sin(a)*3);
  r('#ff6b2e',kx-1,ky,3,2);
  r('#ffffff',kx+(i?0:1),ky,1,1);
 }
};

// ============================================================
//  15. QUẦY PHA CHẾ CÀ PHÊ (4x3 = 32x24) — decor không tương tác
// ============================================================
DR.coffeebar=r=>{
 E(r,'rgba(0,0,0,0.2)',16,23,15,1);
 // quầy gỗ ấm + mặt đá kem
 bx(r,1,10,30,13,'#9e6338','#693d1e');
 r('#7d4b28',2,13,28,9);
 for(let x=4;x<28;x+=5)r('#63391c',x,13,1,9);
 bx(r,0,8,32,3,'#fff4e4','#d1ba99');
 // tấm biển thực đơn nhỏ phía trước
 r('#3d2a22',11,15,10,5);r('#f5e6cc',12,16,8,3);r('#693d1e',13,17,5,1);
 // máy pha espresso bạc cổ điển (bên trái)
 bx(r,3,1,10,7,'#c4d0db','#738291');
 r('#eef5fa',4,2,8,2);r('#353f4a',5,4,6,3);
 r('#ff595e',10,2,1,1);r('#68d89b',11,2,1,1);
 r('#472c1b',4,6,3,2);r('#fff8eb',8,6,2,2); // tay cầm + tách hứng espresso
 // bình thủy tinh cà phê + khay ly giấy (bên phải)
 bx(r,16,3,5,5,'#d9f0ff','#7da2b8');r('#4a2815',17,5,3,2);r('#2e1c14',16,2,5,1);
 bx(r,23,4,6,4,'#f0d9b5','#b89262');
 r('#ffffff',24,2,2,2);r('#ff96b2',27,2,2,2);
};
ANI.coffeebar=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('coffeebar',0),X-1,Y-1);
 // hơi nước cà phê nóng bốc lên nhẹ nhàng
 for(let i=0;i<2;i++){
  const p=((t*0.75+i*0.5)%1);
  cx.globalAlpha=Math.sin(p*Math.PI)*0.6;
  const sx=Math.round(X+8+i*9+Math.sin(t*3+i)*1);
  const sy=Math.round(Y+1-p*4);
  r('#fff7ed',sx,sy,1,2);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  16. TỦ SÁCH CAO CÓ THANG GỖ (3x4 = 24x32)
// ============================================================
DR.bookladder=r=>{
 E(r,'rgba(0,0,0,0.2)',12,31,11,1);
 // khung tủ gỗ óc chó cổ điển + vương miện nóc tủ
 bx(r,1,2,22,29,'#804a26','#4f2b12');
 bx(r,0,0,24,3,'#9e6034','#5c3418');
 r('#593116',2,3,20,26);
 // 4 tầng kệ sách xếp dày đủ màu ấm áp
 const COLS=['#d94f5c','#4b8bd4','#5cb874','#f0b43a','#9b6bd4','#e87b48','#52b5b8'];
 const rows=[4,10,16,22];
 for(let row=0;row<4;row++){
  const sy=rows[row];
  r('#3b1f0d',2,sy,20,5);
  r('#b37140',2,sy+5,20,1);
  let x=3;
  for(let k=0;x<19;k++){
   const bw=(k+row)%3===0?3:2;
   const bh=3+((k*7+row)%2);
   if(row===1&&x>=14&&x<=17){
    // đèn lồng vàng nhỏ trang trí trên kệ
    r('#ffd24a',15,sy+2,2,3);r('#fff7b8',15,sy+2,1,2);
    x+=4;continue;
   }
   r(COLS[(k+row*2)%COLS.length],x,sy+5-bh,bw,bh);
   r('rgba(255,255,255,0.25)',x,sy+5-bh,1,bh);
   x+=bw+((k%4===0)?1:0);
  }
 }
 // chân tủ + thanh ray đồng treo thang
 r('#ffd25a',2,6,20,1);
 // thang gỗ tựa nghiêng phía trước bên phải
 for(let i=0;i<24;i++){
  const lx=16-Math.floor(i/6),ly=7+i;
  r('#d69658',lx,ly,1,1);r('#d69658',lx+5,ly,1,1);
  if(i%4===2)r('#b8783e',lx+1,ly,4,1);
 }
};

// ============================================================
//  17. KỆ CÂY DÂY LEO TREO TƯỜNG (3x2 = 24x16, tường 'w')
// ============================================================
DR.ivywall=r=>{
 // thanh kệ gỗ + 2 giá đỡ
 r('rgba(0,0,0,0.14)',2,9,20,2);
 bx(r,1,7,22,2,'#b37444','#754420');
 r('#5c3316',4,9,2,2);r('#5c3316',18,9,2,2);
 // 3 chậu cây gốm màu đất & trắng kem
 bx(r,3,3,5,4,'#d97852','#a14d2d');
 bx(r,10,2,5,5,'#f7efe2','#ccb89c');
 bx(r,17,4,4,3,'#88b892','#517d5a');
 // tán lá & hoa nhỏ trên chậu
 E(r,'#45a849',5,2,3,2);r('#73d46a',4,1,2,2);
 E(r,'#3a9646',12,1,4,2);r('#ff85b3',11,0,2,2);r('#ffe670',13,1,1,1);
 E(r,'#4eb556',19,3,3,2);r('#93e887',18,2,2,1);
 // dây leo rủ mềm xuống dưới kệ
 const vines=[[4,8,6],[6,9,4],[11,8,7],[14,9,5],[19,8,6]];
 for(const[vx,vy,len]of vines){
  for(let y=0;y<len;y++){
   const px=vx+((y%2===0)?0:1);
   r(y%2?'#368a40':'#59c25b',px,vy+y,2,1);
  }
  r('#85e37d',vx,vy+len,1,1);
 }
};

// ============================================================
//  18. LÒ NƯỚNG BÁNH NGỌT (3x3 = 24x24) — decor không tương tác
// ============================================================
DR.pastryoven=r=>{
 E(r,'rgba(0,0,0,0.2)',12,23,11,1);
 // thân lò nướng vintage màu kem viền đồng ấm
 bx(r,2,5,20,18,'#fff2db','#d4b991');
 r('#ffffff',3,6,18,2);
 // mặt bếp + bảng điều khiển núm vặn
 r('#7d5438',3,8,18,3);
 for(const kx of[5,9,15,19])r('#ffd25a',kx,9,1,1);
 // cửa kính lò tối viền đồng
 r('#4f3a2e',4,12,16,9);
 r('#2e1b16',5,13,14,7);
 r('#ffe5b4',5,13,14,1); // tay nắm cửa lò
 // bánh croissant & khay bánh trưng bày trên nóc lò
 bx(r,4,3,16,2,'#c79e6b','#8f683a');
 E(r,'#f5aa42',8,2,3,2);r('#ffd57a',7,1,2,1);
 r('#ff85a8',14,1,3,2);r('#fff7ed',15,0,1,1); // bánh cupcake dâu kem
};
ANI.pastryoven=(b,o,t)=>{
 const X=b[0],Y=b[1];
 cx.drawImage(dspr('pastryoven',0),X-1,Y-1);
 // ánh lửa vàng cam ấm áp bên trong cửa kính lò + bánh đang nướng vàng ruộm
 const g=0.65+0.35*Math.sin(t*6.5);
 cx.globalAlpha=0.35*g;
 r('#ff7315',X+5,Y+13,14,7);
 cx.globalAlpha=0.88;
 r('#ffb838',X+8,Y+16,8,2); // khay bánh phát sáng ấm
 r('#f29e38',X+10,Y+15,4,2);
 cx.globalAlpha=g;
 for(let i=0;i<3;i++){
  const fl=Math.floor(t*7+i)%2;
  r('#ff5412',X+7+i*4,Y+18-fl,2,2);
  r('#ffe670',X+7+i*4,Y+18,1,1);
 }
 cx.globalAlpha=1;
};

// ============================================================
//  19. ĐÈN CÂY ĐỨNG CỔ ĐIỂN (2x4 = 16x32) — tỏa ánh sáng vàng ấm ban đêm
// ============================================================
DR.floorlamp=r=>{
 E(r,'rgba(0,0,0,0.18)',8,31,6,1);
 // chân đế đồng tròn cổ điển + trụ mảnh chạm khắc
 E(r,'#734c20',8,30,5,2);
 E(r,'#c99342',8,29,4,1);
 r('#8f6229',7,11,2,19);
 r('#e8bd68',7,11,1,18);
 r('#ffe394',6,19,4,1); // khớp chạm giữa thân đèn
 // chao đèn xếp ly màu kem vàng viền ren
 for(let y=2;y<=10;y++){
  const hw=3+Math.floor((y-2)*0.45);
  r('#8a5d27',8-hw-1,y,hw*2+2,1);
  r('#fff1c7',8-hw,y,hw*2,1);
  if(y>=4&&y<=9)r('#ffe091',8-hw+1,y,Math.max(1,hw*2-2),1);
  if(y%2===0&&y>=3&&y<=9)r('#e6c278',8-hw+1,y,1,1);
 }
 r('#ffe278',7,0,2,2); // chóp đồng
 r('#c99342',3,11,10,1); // diềm dưới chao đèn
};
ANI.floorlamp=(b,o,t)=>{
 const X=b[0],Y=b[1];
 const hr=new Date().getHours();
 const night=(hr>=18||hr<6)||(typeof window.tlDayNight==='function'&&window.tlDayNight()&&false);
 // tự nhận biết chế độ test tối nếu user gọi tlDayNight('night')
 const pulse=0.85+0.15*Math.sin(t*2.6);
 cx.save();
 cx.globalCompositeOperation='lighter';
 cx.globalAlpha=(night?0.42:0.22)*pulse;
 E(r,'#ffd86b',X+8,Y+9,12,10);
 cx.globalAlpha=(night?0.26:0.12)*pulse;
 E(r,'#ffe694',X+8,Y+24,14,7);
 cx.restore();
 cx.drawImage(dspr('floorlamp',0),X-1,Y-1);
 // bóng đèn sáng ấm rạng bên dưới chao đèn
 cx.globalAlpha=0.92;
 r('#fffbe0',X+6,Y+10,4,2);
 cx.globalAlpha=1;
};

// ============================================================
//  20. THẢM HOA CÚC TRÒN (5x3 = 40x24, nền thảm 'r')
// ============================================================
DR.daisyrug=r=>{
 // bóng viền thảm + nền xanh lá bơ dịu & kem
 E(r,'#b89c74',20,12,19,11);
 E(r,'#fff8eb',20,11,19,10);
 E(r,'#d8ebce',20,11,16,8);
 E(r,'#e9f5e1',20,11,13,6);
 // hoa cúc trắng nhụy vàng lớn chính giữa + 4 bông cúc nhỏ xung quanh
 const daisy=(dx,dy,big)=>{
  if(big){
   r('#ffffff',dx-1,dy-4,2,8);r('#ffffff',dx-4,dy-1,8,2);
   r('#fff4db',dx-3,dy-3,6,6);
   r('#ffd23f',dx-1,dy-1,2,2);r('#ff9f1c',dx,dy,1,1);
  }else{
   r('#ffffff',dx,dy-2,1,5);r('#ffffff',dx-2,dy,5,1);
   r('#ffd23f',dx,dy,1,1);
  }
 };
 daisy(20,11,true);
 daisy(10,9,false);daisy(30,9,false);
 daisy(12,15,false);daisy(28,15,false);
};

// Đăng ký vào CAT & FURN_PR
const ADD_FURN=[
 ['capysofa','Sofa Capybara',5,2,'f',1,1200],
 ['cloudbed','Giường mây cầu vồng',5,4,'f',1,1800],
 ['bunmir','Gương tai thỏ phát sáng',2,4,'f',1,900],
 ['strawtbl','Bàn trà dâu kem',3,2,'f',0,650],
 ['bearrug','Thảm gấu mây',6,4,'r',1,750],
 ['aquarium','Bể cá phát sáng',5,4,'f',1,2800],
 ['jellylamp','Đèn sứa lơ lửng',2,3,'f',1,1100],
 ['shellbed','Giường vỏ sò ngọc trai',5,4,'f',1,2000],
 ['waverug','Thảm sóng biển',6,4,'r',1,800],
 ['fireplace','Lò sưởi ấm',4,4,'f',1,2400],
 ['piano','Đàn Piano lớn',5,4,'f',1,2600],
 ['vinyl','Kệ đĩa than',3,4,'f',1,1400],
 ['starwin','Cửa sổ trời sao',4,2,'w',1,1300],
 ['koitank','Bể cá Koi',4,3,'f',1,1900],
 ['coffeebar','Quầy pha chế cà phê',4,3,'f',1,1650],
 ['bookladder','Tủ sách cao có thang gỗ',3,4,'f',0,1900],
 ['ivywall','Kệ cây dây leo treo tường',3,2,'w',0,700],
 ['pastryoven','Lò nướng bánh ngọt',3,3,'f',1,1550],
 ['floorlamp','Đèn cây đứng cổ điển',2,4,'f',1,950],
 ['daisyrug','Thảm hoa cúc tròn',5,3,'r',0,820]
];
for(const[k,nm,w,h,tp,nf,pr]of ADD_FURN){
 CAT[k]=nf?[nm,w,h,tp,1]:[nm,w,h,tp];
 if(typeof FURN_PR!=='undefined')FURN_PR[k]=pr;
}

// Cho phép ngồi nghỉ trên Sofa Capybara, Đàn Piano, Giường mây, Giường vỏ sò
if(typeof hmSeat==='function'){
 const _oldSeat=hmSeat;
 const EXTRA_SEAT={
  capysofa:'🛋️ Đang thư giãn trên Sofa Capybara... (di chuyển để đứng dậy)',
  piano:'🎹 Đang chơi đàn Piano... (di chuyển để đứng dậy)',
  cloudbed:'☁️ Đang nằm nghỉ trên Giường mây... (di chuyển để đứng dậy)',
  shellbed:'🐚 Đang nằm nghỉ trên Giường vỏ sò... (di chuyển để đứng dậy)'
 };
 window.hmSeat=hmSeat=function(wx,wy){
  if(_oldSeat(wx,wy))return 1;
  if(typeof Pl==='undefined'||Pl.sit||typeof ST==='undefined'||!ST.hm||!ST.hm.p)return 0;
  for(const o of ST.hm.p){
   if(!EXTRA_SEAT[o[0]])continue;
   const c=CAT[o[0]];if(!c)continue;
   const b=[o[1]*8,o[2]*8,c[1]*8,c[2]*8];
   if(wx>=b[0]&&wx<b[0]+b[2]&&wy>=b[1]&&wy<b[1]+b[3]){
    ST.av.m=-1;
    const isBed=(o[0]==='cloudbed'||o[0]==='shellbed');
    Pl.x=Math.min(b[0]+b[2]-6,Math.max(b[0]+6,wx));
    Pl.y=isBed?(b[1]+b[3]-4):(b[1]+b[3]+1);
    if(typeof SEAT!=='undefined')SEAT.y=b[1]+b[3]+10;
    Pl.by=b[1]+b[3]+8;
    Pl.d=o[0]==='piano'?1:0;Pl.bk=o[0]==='piano'?1:0;
    Pl.sit=2;Pl.st=0;Pl.nt=0;Pl.bn=1;
    if(typeof goal!=='undefined')goal=null;
    if(typeof toast==='function')toast(EXTRA_SEAT[o[0]]);
    return 1;
   }
  }
  return 0;
 };
}
})();
