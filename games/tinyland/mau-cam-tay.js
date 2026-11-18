/* MẪU PHỤ KIỆN CẦM TAY (t:'hold') — copy file này, đổi tên/khóa/giá/hình. KHÔNG cần sửa index.html hay pho-map.js
   Chỉ cần thêm 1 dòng <script src="ten-file.js?v=1"></script> ở CUỐI danh sách script trong index.html.
   art(P): P.R(màu, dx, y, w, h) tô 1 hình chữ nhật pixel tương đối bàn tay (dx>0 = hướng nhân vật nhìn)
           P.hy = y bàn tay phải • P.hyL = y bàn tay trái • P.lx = dx tay trái (khi nhìn thẳng/sau)
           P.side = đang nhìn nghiêng • P.back = quay lưng • P.t = thời gian (giây) để làm động
   Quy ước vẽ: y NHỎ hơn P.hy là phía TRÊN bàn tay. Bàn tay vẽ cuối cùng (đè lên cán). */
(function(){
const GIA=300;   // ← giá Xu bán ở Shop Phố xá (tab 🎀 Phụ kiện)
function accMauGau(P){
 const R=P.side?(c,x,y,w,h)=>P.R(c,x+2,y,w,h):P.R,t=P.t,hy=P.hy,SK='#f1c08a',SKD='#d99e6a';
 // thân gấu (nâu), sáng trái / tối phải
 R('#b9824a',-3,hy-9,8,7);R('#d9a56a',-3,hy-9,2,7);R('#8a5a2a',4,hy-9,1,7);
 // 2 tai
 R('#b9824a',-3,hy-11,2,2);R('#b9824a',3,hy-11,2,2);R('#f2b8a0',-3,hy-10,1,1);R('#f2b8a0',4,hy-10,1,1);
 // mặt: mắt chớp + mũi
 const blink=Math.sin(t*2)>.95;
 R('#2a1a10',-1,hy-7,1,blink?1:2);R('#2a1a10',2,hy-7,1,blink?1:2);R('#2a1a10',0,hy-5,2,1);
 // tay cầm
 R(SK,-1,hy-2,3,2);R(SKD,-1,hy,3,1);
}
window.accMauGau=accMauGau;
if(typeof ACCS!=='undefined'&&!ACCS.some(a=>a.k==='maugau'))
 ACCS.push({n:'Gấu bông cầm tay',k:'maugau',t:'hold',xu:GIA,art:(P)=>accMauGau(P)});
})();
