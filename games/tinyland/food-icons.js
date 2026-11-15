/* =====================================================================
   TINYLAND — Icon vẽ SVG cho các món nấu từ máy chế biến (thay emoji dùng chung).
   Cách hoạt động: nạp thêm vào CIC (xem hàm ic(e,n) trong index.html) theo TÊN món.
   Thêm món mới: thêm 1 dòng vào bảng D bên dưới:  'Tên món':['kiểu', 'màu', 'dấu nhỏ'],
   Các kiểu: sack bowl soup plate jar can cup cone cake xoi nest bottle tub pot ...
   ===================================================================== */
(function(){
const sh=(h,k)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(k>0?v+(255-v)*k:v*(1+k))));return '#'+[n>>16&255,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const SV=b=>'<svg class="ci" viewBox="0 0 24 24" aria-hidden="true">'+b+'</svg>';
const P=(d,f,s)=>'<path d="'+d+'" fill="'+f+'" stroke="'+(s||sh(f,-.38))+'" stroke-width=".6" stroke-linejoin="round"/>';
const E=(x,y,rx,ry,f,s)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+(s||sh(f,-.38))+'" stroke-width=".6"/>';
const R=(x,y,w,h,r,f,s)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+f+'" stroke="'+(s||sh(f,-.38))+'" stroke-width=".6"/>';
const L=(d,c,w)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(w||.7)+'" stroke-linecap="round" stroke-linejoin="round"/>';
const T=(g,x,y,s)=>g?'<text x="'+x+'" y="'+y+'" font-size="'+s+'" text-anchor="middle" dominant-baseline="central">'+g+'</text>':'';
const W='#fffdf6';

/* ---- các kiểu dụng cụ: mỗi hàm nhận (màu c, dấu nhỏ g) ---- */
const K={
 // bao bột / bao cám
 sack:(c,g)=>P('M7.5 5.5L9 3H15L16.5 5.5C18.5 8 19.5 13 19 19.5C19 21 17.5 21.8 12 21.8S5 21 5 19.5C4.5 13 5.5 8 7.5 5.5Z',c)+L('M7.6 5.7C10 6.8 14 6.8 16.4 5.7','#c0392b',1.2)+E(12,14,5,4.6,W,'#d8cfb0')+T(g,12,14.3,8),
 // đường cục
 cube:()=>{const c=(x,y)=>P('M'+x+' '+y+'L'+(x+5)+' '+(y+2.5)+'L'+x+' '+(y+5)+'L'+(x-5)+' '+(y+2.5)+'Z','#fff','#b8c4d4')+P('M'+(x-5)+' '+(y+2.5)+'L'+x+' '+(y+5)+'V'+(y+10)+'L'+(x-5)+' '+(y+7.5)+'Z','#e4ebf3','#b8c4d4')+P('M'+(x+5)+' '+(y+2.5)+'L'+x+' '+(y+5)+'V'+(y+10)+'L'+(x+5)+' '+(y+7.5)+'Z','#cdd8e6','#b8c4d4');return c(7.4,10)+c(16.6,10)+c(12,3.2)+L('M3 3L4 4M21 4L20 5','#8fb4e8',1)},
 // chai (siro / serum / dầu)
 bottle:(c,g)=>R(10,2,4,3,1,'#8a5a30')+P('M10 5H14V8C17 9 18.5 11 18.5 14V20C18.5 21.2 17.6 22 16.4 22H7.6C6.4 22 5.5 21.2 5.5 20V14C5.5 11 7 9 10 8Z',c)+E(12,15.4,3.6,3.8,W,'#d8cfb0')+T(g,12,15.6,6.5)+L('M7.4 13V19','#fff',.9),
 // hũ thủy tinh (mứt, muối)
 jar:(c,g)=>R(6.4,2.6,11.2,3.6,1.2,'#d9453a')+P('M6 6.8H18C19.6 8.4 20 10.6 20 13.6V19.6C20 20.8 19 21.6 17.8 21.6H6.2C5 21.6 4 20.8 4 19.6V13.6C4 10.6 4.4 8.4 6 6.8Z',c)+E(12,14.6,4.8,4.6,W,'#d8cfb0')+T(g,12,14.9,8.5)+L('M5.6 10V18','#fff',.9),
 // đồ hộp
 can:(c,g)=>E(12,5,7,2.2,'#c9d0da')+P('M5 5V19C5 20.6 8 21.6 12 21.6S19 20.6 19 19V5C19 6.2 16 7.2 12 7.2S5 6.2 5 5Z',c)+R(5,10,14,7,0,W,'#d8cfb0')+T(g,12,13.7,8)+E(12,5,7,2.2,'none','#8a929e'),
 // ly sinh tố
 cup:(c,g)=>L('M13.4 6.2L15.8 1.4','#ff5d6f',1.5)+R(5.8,5.6,12.4,2.4,1.2,W)+P('M6.6 8H17.4L16.2 21.4C16.1 21.9 15.8 22 15.4 22H8.6C8.2 22 7.9 21.9 7.8 21.4Z',c)+R(7.2,12,9.6,5,1.2,W,'#e8e0cc')+T(g,12,14.7,7.5),
 // dừa tươi
 coco:()=>P('M12 3.6C17.4 3.6 20.4 8.4 20.4 13.6C20.4 18.6 16.8 22 12 22S3.6 18.6 3.6 13.6C3.6 8.4 6.6 3.6 12 3.6Z','#a6cf6e')+E(12,6.4,4.4,1.8,'#fffaf0','#c9b88a')+L('M13 6.4L16.2 1.6','#ff5d6f',1.5)+L('M7 11C8 16 10 19 12 20','#fff',.9),
 // ốc kem
 cone:(c,g)=>P('M7 11.5L12 22.4L17 11.5Z','#e2b060')+L('M8.4 14.2L14 18M15.6 14.2L10 18','#b98a3c',.5)+E(12,9.2,5.4,5,c)+P('M7 11.5C7.4 13.6 9 13.6 9.4 12M14.6 12C15 13.6 16.6 13.6 17 11.5','#fff','none')+T(g,12,9,7.5),
 // bát cơm (mound = màu cơm)
 bowl:(c,g)=>P('M3.8 13C3.8 8.4 7.6 5.6 12 5.6S20.2 8.4 20.2 13Z',c,'#cdbf9a')+T(g,12,9.4,8)+P('M2.8 12.6H21.2C21.2 17.8 17.2 21 12 21S2.8 17.8 2.8 12.6Z','#eef2f8','#7c8aa6')+L('M3.2 14.4H20.8','#4a7fc4',1.2)+R(8.2,20.4,7.6,1.8,.7,'#7c8aa6'),
 // bát phở / hủ tíu (c = màu nước dùng)
 soup:(c,g)=>P('M2.4 10.4H21.6C21.6 16.8 17.6 21 12 21S2.4 16.8 2.4 10.4Z','#eef2f8','#7c8aa6')+L('M3 13.6H21','#e07a3c',1.1)+E(12,10.4,9.6,2.8,c)+L('M6 10.4C8 8.6 10 12 12 10C14 8.4 16 12 18 10.2','#fffdf4',1)+T(g,12,9,8.5)+L('M17 4L21 8M19 3L22 6.4','#a0522d',.9),
 // đĩa
 plate:(c,g)=>E(12,16,10.6,4.6,'#f6f3ea','#bdb59e')+E(12,15.4,8,3,'#ece8da','#d3ccb8')+P('M5.4 15C5.4 10.6 8.4 8.2 12 8.2S18.6 10.6 18.6 15Z',c)+T(g,12,12.4,8.5),
 // xôi trên lá chuối
 xoi:(c,g)=>E(12,16.6,10.6,4.4,'#4f9a45')+L('M3 16.6H21','#3b7a35',.6)+P('M5.6 16C5.6 9.6 8.6 6.4 12 6.4S18.4 9.6 18.4 16Z',c,'#cbbf98')+T(g,12,12,8.5),
 // vắt mì
 nest:(c,g)=>E(12,17,9.6,3.6,sh(c,-.15))+P('M3.4 16C3.4 9.4 7.4 6 12 6S20.6 9.4 20.6 16Z',c)+(g=='flat'?L('M6 14L12 8.4L18 14M7.6 15.6L12 11.4L16.4 15.6','#c9bd96',1.5):L('M5.5 14C7 9.6 9 12 10.4 8.4M9 15C10.4 11 12.4 14 13.6 9.2M13 15.6C14.6 11.4 16 14 17.6 10.4','#c9a43a',.8)),
 // thố đất kho tộ
 pot:(c,g)=>P('M3.6 11H20.4C20.4 17 17 21 12 21S3.6 17 3.6 11Z','#8a5530')+E(12,11,8.8,2.4,'#5a3318')+E(12,11,7.2,1.6,'#9a3a14')+T(g,12,9.4,9)+L('M8 5C7 3.6 9 3 8 1.4M13 5C12 3.6 14 3 13 1.4','#9aa',.7),
 // bánh kem
 cake:(c,g)=>E(12,20.4,10,2,'#e8e0cc','#bdb59e')+P('M4 12H20V19.4C20 20.4 19.4 21 18.4 21H5.6C4.6 21 4 20.4 4 19.4Z','#f1d49a')+R(4,14.6,16,1.8,.9,W,'#e8e0cc')+P('M3.6 12.4C3.6 9.4 8 8.4 12 8.4S20.4 9.4 20.4 12.4C20.4 13.6 18.8 13.8 18 13.4C17 14.6 15.6 14.6 14.6 13.4C13.4 14.6 11.6 14.6 10.6 13.4C9.6 14.6 8 14.6 7 13.4C6 13.8 3.6 13.6 3.6 12.4Z',c)+T(g,12,7.4,8.5),
 // hũ kem dưỡng
 tub:(c,g)=>R(4,5,16,4.4,1.6,'#c9a06a')+R(4.4,9.4,15.2,10.8,2.4,c)+T(g,12,14.8,8.5)+L('M6.4 11V18','#fff',.9),
 // xà phòng
 soap:()=>R(3.4,7.4,17.2,10,3.4,'#fdf3e3','#c9b88a')+T('🥥',12,12.6,7)+'<circle cx="19" cy="5" r="2" fill="none" stroke="#8fc8ee" stroke-width=".7"/><circle cx="15.6" cy="3.4" r="1.2" fill="none" stroke="#8fc8ee" stroke-width=".7"/>',
 // mặt nạ
 mask:()=>P('M12 2.6C17.4 2.6 19.8 6.6 19.4 11.4C19 17 15.6 21.4 12 21.4S5 17 4.6 11.4C4.2 6.6 6.6 2.6 12 2.6Z','#ffc0d0')+E(8.6,10.4,1.8,1,'#fff','#c9708a')+E(15.4,10.4,1.8,1,'#fff','#c9708a')+E(12,16.4,2.2,1,'#fff','#c9708a')+T('🍓',18.6,19,7),
 // bông gòn / sợi
 spool:()=>E(12,19.4,6.8,2,'#c79a5a')+R(8,7.4,8,12,0,W,'#cfc8b4')+L('M8 10H16M8 12.6H16M8 15.2H16M8 17.6H16','#e2dccb',.6)+E(12,7.4,6.8,2,'#d9ac68')+L('M16 11C20 11 21 14 19.6 16','#fff',1)+T('☁️',18,4.8,7),
 // vải
 cloth:(c)=>P('M3 9L12 5.6L21 9V13.4L12 17L3 13.4Z',c)+P('M3 13.4L12 17L21 13.4V16.6L12 20.4L3 16.6Z',sh(c,-.14))+L('M7 10L12 8.2L17 10M7 12L12 10.2L17 12','#fff',.5),
 roll:(c)=>E(18,12,3.4,7.6,sh(c,-.12))+P('M18 4.4H8C5.6 4.4 4.4 8 4.4 12S5.6 19.6 8 19.6H18Z',c)+E(8,12,2.6,5,sh(c,.2))+L('M10.4 7H17M10.4 17H17','#fff',.7)+P('M5 19L3.4 22H8L8 19.6Z',c),
 shirt:()=>P('M8 3.5L12 5.4L16 3.5L21.5 7L19.4 11L17 9.6V20.5H7V9.6L4.6 11L2.5 7Z','#d9bf8a')+L('M9.6 3.8C10.6 6.2 13.4 6.2 14.4 3.8','#9a7a44',.8)+L('M7.4 19H16.6','#9a7a44',.6)+R(9,12,3.4,3,.4,'#c9a96a'),
 pants:()=>P('M6.4 3H17.6L18.6 21.4H13.2L12 9.6L10.8 21.4H5.4Z','#7ea0cc')+R(6.4,3,11.2,2.4,0,'#5f84b3')+L('M12 5.4V9.6','#4a6a96',.7),
 jacket:()=>P('M8 3.5L12 5L16 3.5L22 8L20.8 17.6L17.6 17V21.4H6.4V17L3.2 17.6L2 8Z','#c5ccd6')+L('M12 5V21.4','#7b8594',1)+P('M8 3.5L12 8L16 3.5L14.4 3L12 5L9.6 3Z','#9aa4b4')+L('M7 17H10M14 17H17','#7b8594',.7),
 dress:()=>P('M6 21.6L7.2 9.6L5 8L7.6 4.4L10.4 2.8H13.6L16.4 4.4L19 8L16.8 9.6L18 21.6H13.2L12 14L10.8 21.6Z','#f4c542')+L('M12 3V14','#c9961c',.8)+'<circle cx="9" cy="8" r=".8" fill="#fff3b0"/><circle cx="15" cy="8" r=".8" fill="#fff3b0"/><circle cx="9" cy="13" r=".8" fill="#fff3b0"/><circle cx="15" cy="13" r=".8" fill="#fff3b0"/>',
 bag:()=>L('M8 8C8 2.6 16 2.6 16 8','#8a6a3a',1.2)+P('M4.4 8H19.6L20.6 21H3.4Z','#d8bf90')+E(12,14.6,3.4,3.4,'#c25a4a')+T('🌸',12,14.8,6),
 scarf:()=>P('M4.4 6C4.4 3 19.6 3 19.6 6C19.6 9.2 15.6 10.4 12 10.4S4.4 9.2 4.4 6Z','#d6a8e8')+P('M8 9.6L6.6 21.6H12L12 10.4Z','#c288dc')+P('M13 10.2L14.4 20.4H19.4L16.6 9.2Z','#e2bcf2')+L('M7 17H11.8M14 16.4H18.6','#fff',.8),
 // bánh quê
 dome:()=>E(12,16,8.6,3.4,'#fff4ef')+P('M3.6 15C3.8 8.6 8 5.6 12 5.6S20.2 8.6 20.4 15Z','#f7a8bd')+E(8,11,1,.8,'#e57f9c','none')+E(12,9,1,.8,'#e57f9c','none')+E(15.6,11.4,1,.8,'#e57f9c','none')+E(11,13.4,1,.8,'#e57f9c','none')+E(16.6,14,1,.8,'#e57f9c','none')+E(7.4,14,1,.8,'#e57f9c','none'),
 log:()=>'<g transform="rotate(-20 12 12)">'+R(2.4,7.6,19.2,8.8,4,'#4d8f3c')+L('M7.4 7.8V16.2M12 7.6V16.4M16.6 7.8V16.2','#e0c050',1.2)+E(20,12,2.2,4,'#f3e6a0','#8a9a40')+'<circle cx="20" cy="12" r="1.1" fill="#f2a0a0"/></g>',
 pia:()=>E(12,12.4,9.2,8.4,'#e8c382')+E(12,11.6,6.4,5.6,'#f1d49a','#c9a45a')+L('M6 11.6H18M7.6 8.4C10.6 9.6 13.4 9.6 16.4 8.4M7.6 14.8C10.6 13.6 13.4 13.6 16.4 14.8','#d9b068',.5)+'<circle cx="12" cy="11.6" r="2" fill="#d9302a"/>',
 sheet:()=>E(12,14.4,9.6,6.6,'#e8e2d0','#b8b098')+E(12,12.4,9.6,6.6,'#fffdf4','#c8c0a8')+L('M5 10L19 15M5 13L19 18M8 6.6L18 14M13 6L20 11M5 15L12 18.6','#d8d0b8',.5)+L('M10 6.6L16 9M6 9L12 6.2','#d8d0b8',.5),
 layer:()=>P('M3 8L9 5H21L15 8Z','#cfe9c4')+R(3,8,12,9,0,'#fff','#8a9a80')+L('M3 10H15M3 12H15M3 14H15','#5bbf6a',1.4)+P('M15 8L21 5V14L15 17Z','#8fd29a')+L('M15 10L21 7M15 12L21 9','#fff',.7),
 candy:()=>P('M2.4 9.6L6.4 12L2.4 14.4Z','#fff','#c9b88a')+P('M21.6 9.6L17.6 12L21.6 14.4Z','#fff','#c9b88a')+R(6,7.6,12,8.8,3,'#f3e3c0')+'<circle cx="9.4" cy="11" r=".9" fill="#8a5a2a"/><circle cx="14" cy="13.4" r=".9" fill="#8a5a2a"/><circle cx="12" cy="9.8" r=".7" fill="#8a5a2a"/>'+T('🥥',12,12.2,5),
 tart:(c,g)=>E(12,16,10,4.6,'#d9a85a')+E(12,14.6,8.4,3.6,'#f6ecd0','#c9b88a')+P('M5 14.6C5 9 8.4 7 12 7S19 9 19 14.6Z',W,'#d8cfb0')+T(g,12,11.4,9),
 // dây chuyền hoa
 bq:(cs)=>P('M12 22L5 11H19Z','#f2d9a0')+cs.map((c,i)=>{const p=[[8,8],[12,5.6],[16,8],[12,9.6],[9.6,12],[14.6,12],[6.4,11],[17.6,11]][i];return E(p[0],p[1],2.8,2.8,c)+E(p[0],p[1],.9,.9,'#ffe27a','none')}).join('')+P('M9.6 16L12 14.6L14.4 16L12 17.4Z','#ff6f96')+L('M10 17L8.6 20.4M14 17L15.4 20.4','#ff6f96',1.1),
 basket:()=>P('M7 8C7.6 4 9 3 10 5C11 3 12.4 2 12.8 6C14 3.6 16 4 17 8Z','#4fa050')+E(8.6,5.4,2.4,2.4,'#ff9fc2')+E(15.4,5,2.2,2.2,'#9a6ad8')+P('M3.6 9H20.4L19 20.6C18.9 21.4 18.4 22 17.6 22H6.4C5.6 22 5.1 21.4 5 20.6Z','#b8844a')+L('M4 12.6H20M4.6 16.2H19.4M9 9L8.4 22M15 9L15.6 22','#8a5a2a',.6),
 hex:()=>P('M2.4 12L6.4 9.6V14.4Z','#ffe08a','#c9a02a')+P('M21.6 12L17.6 9.6V14.4Z','#ffe08a','#c9a02a')+P('M12 4L19 8V16L12 20L5 16V8Z','#f2a516')+P('M12 7L16 9.4V14.6L12 17L8 14.6V9.4Z','#ffcf4a')+L('M9.6 10.2L11 9.4','#fff',1)
};

/* ---- BẢNG MÓN: tên món (đúng như trong MACHS) : [kiểu, màu, dấu nhỏ] ---- */
const D={
 'Đường':['cube'],'Siro đường':['bottle','#d98a1c','💧'],
 'Bột gạo':['sack','#ecebe2','🌾'],'Bột nếp':['sack','#fdeef3','🍙'],'Bột bắp':['sack','#f7d65a','🌽'],'Bột mì':['sack','#e9cf9a','🥖'],'Bột khoai lang':['sack','#d9b0e6','🍠'],
 'Xôi trắng':['xoi','#fffaf0',''],'Xôi bắp':['xoi','#f6e08a','🌽'],'Xôi đậu xanh':['xoi','#d4e08a','🫘'],'Xôi dừa':['xoi','#ffffff','🥥'],'Xôi gà':['xoi','#fff3d8','🍗'],
 'Cơm trắng':['bowl','#ffffff',''],'Cơm trứng':['bowl','#ffffff','🥚'],'Cơm thịt heo':['bowl','#ffffff','🥓'],'Cơm bò':['bowl','#ffffff','🥩'],'Cơm xào':['bowl','#f1d68c','🥕'],'Cơm xào bò':['bowl','#f1d68c','🥩'],'Cơm cà chua trứng':['bowl','#ffffff','🍅'],
 'Vắt phở':['nest','#fffdf4','flat'],'Vắt hủ tíu':['nest','#f6f1e0',''],'Vắt mì':['nest','#f4cb4a',''],
 'Phở bò':['soup','#e8c37a','🥩'],'Hủ tíu Nam Vang':['soup','#f2d28a','🦐'],'Mì xào':['plate','#f4cb4a','🥕'],'Hủ tíu thịt heo':['soup','#f2d28a','🥓'],'Phở gà':['soup','#e8c37a','🥚'],
 'Sợi bông':['spool'],'Vải thô':['cloth','#d9bf8a'],'Vải mềm':['roll','#d6a8e8'],
 'Mứt xoài':['jar','#f7a823','🥭'],'Mứt mít':['jar','#f3cf3a','🍈'],'Mứt dừa':['jar','#f4efe0','🥥'],'Mứt dâu':['jar','#e8304a','🍓'],'Mứt sầu riêng':['jar','#cfd96a','🌰'],
 'Dưa leo muối':['jar','#9ed08a','🥒'],'Bắp cải muối':['jar','#d4eab0','🥬'],'Kim chi':['jar','#e8502a','🥬'],'Cà chua đóng hộp':['can','#e8402a','🍅'],'Dưa leo ngâm ớt':['jar','#7fbf6a','🌶️'],'Mướp đóng hộp':['can','#5aa83c','🌿'],
 'Kem xoài':['cone','#ffb93a','🥭'],'Kem dừa':['cone','#fffaf0','🥥'],'Kem mít':['cone','#f6d84a','🍈'],'Kem sầu riêng':['cone','#e6e08a','🌰'],'Kem dâu':['cone','#ff8fa8','🍓'],'Kem khoai lang':['cone','#a56bc4','🍠'],
 'Sinh tố xoài':['cup','#ffb93a','🥭'],'Nước dừa tươi':['coco'],'Sinh tố mít':['cup','#f6d84a','🍈'],'Sinh tố sầu riêng':['cup','#e6e08a','🌰'],'Sinh tố dâu':['cup','#ff8fa8','🍓'],'Sinh tố khoai lang':['cup','#a56bc4','🍠'],
 'Bánh kem cơ bản':['cake','#ffffff','🍒'],'Bánh kem xoài':['cake','#ffe3a0','🥭'],'Bánh kem mít':['cake','#fff0a8','🍈'],'Bánh kem sầu riêng':['cake','#f2f0b0','🌰'],'Bánh kem dâu':['cake','#ffc8d6','🍓'],
 'Xà phòng dừa':['soap'],'Kem dưỡng dừa':['tub','#fff6ee','🥥'],'Serum vàng':['bottle','#f7c948','✨'],'Mặt nạ dâu':['mask'],'Dầu dưỡng tóc':['bottle','#e8a640','🥥'],
 'Áo vải thô':['shirt'],'Quần vải':['pants'],'Áo khoác bạc':['jacket'],'Áo dài vàng':['dress'],'Túi vải quê':['bag'],'Khăn choàng':['scarf'],
 'Bánh bò':['dome'],'Bánh tét':['log'],'Bánh khoai lang':['tart','#a96bc4','🍠'],'Bánh pía sầu riêng':['pia'],'Bánh tráng':['sheet'],'Bánh da lợn':['layer'],'Kẹo dừa':['candy'],'Bánh dâu':['tart','#ffffff','🍓'],
 'Cá kho tộ':['pot','','🐟'],'Tôm rang':['plate','#e8602a','🦐'],'Canh chua cá':['soup','#f0a24a','🐟'],'Lươn xào sả ớt':['plate','#5a4a3a','🐍'],'Cua rang':['plate','#e8402a','🦀'],'Gỏi xoài tôm':['plate','#e8d870','🥭'],'Cá chiên':['plate','#e0a040','🐟'],'Bắp xào tôm':['plate','#f6d84a','🌽'],'Mướp xào trứng':['plate','#9ad06a','🥚'],'Khoai lang chiên':['plate','#f3a640','🍟'],
 'Cám gà':['sack','#f2d27a','🐔'],'Cám heo':['sack','#f4b5c6','🐖'],'Cám bò':['sack','#bcd4ee','🐄'],
 'Bó hoa đồng quê':['bq',['#ffd23f','#ff9fc2','#ffffff','#ff9f45']],'Bó hoa tình yêu':['bq',['#d9302a','#e8506a','#ffffff','#9a6ad8']],'Giỏ cây mùa thu':['basket'],'Bó hoa Bát Sắc':['bq',['#d9302a','#ff9f45','#ffd23f','#6fe38a','#5ab8ff','#9a6ad8','#ff9fc2','#ffffff']],
 'Kẹo mật ong':['hex'],'Khoai lang nướng mật':['plate','#ffb347','🍠'],'Bắp nướng mật ong':['plate','#f3b21e','🌽'],'Sữa chua mật dâu':['cup','#fffdf4','🍓'],'Bánh mật ong':['cake','#f2a516','🐝']
};
const I={};
Object.keys(D).forEach(n=>{const a=D[n],f=K[a[0]];if(!f)return;I[n]=SV(a[0]=='bq'?f(a[1]):f(a[1],a[2]))});
window.FOOD_ICONS=I;
if(typeof CIC!=='undefined')Object.assign(CIC,I);
})();
