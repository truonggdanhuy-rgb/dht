/* ===================================================================================
   🍼 BÉ BỎNG — HỆ THỐNG BABY HOÀN CHỈNH (file riêng: games/tinyland/baby.js)
   Nạp trong index.html bằng <script src="baby.js"></script> (sau newitems.js).

   • DỮ LIỆU: ST.bb = {on, g:'m'|'f', c:'anh'|'chi', n:tên(≤7 ký tự), ad:ngày nhận nuôi, big:0|1, exp, h:vui vẻ, f:no bụng,
                       t:mốc tính thanh, gt:mốc có quà, nf:đã báo có quà, fl:đang đi theo, pp:pet đã cất, own:[id miniset], set:id đang mặc}
     (ST được lưu cả vào localStorage lẫn đồng bộ lên tài khoản như mọi dữ liệu khác của Tinyland.)
   • Nhận nuôi: chọn bé trai/gái, chọn bé gọi mình Anh/Chị (không đổi được), đặt tên (miễn phí lần đầu, tối đa 7 ký tự).
   • Em bé: nằm nôi. Cho ăn / chơi mỗi lần 20 Xu, +10 EXP. Đủ 100 EXP (hoặc trả 10 💎) → bé lớn.
   • Khi lớn: nhân vật thu nhỏ 70%, mặc Miniset (mặc sẵn "Miniset Ấm áp"), đi theo như pet (pet được cất, chỉ 1 trong 2).
   • 2 thanh Vui vẻ / No bụng tụt theo thời gian thật. Lớn rồi thì tụt chậm hơn nhiều (đỡ tốn xu).
   • Quà: mỗi 2 giờ có 1 món quà, KHÔNG cộng dồn — phải bấm nhận thì mới tính 2 giờ tiếp theo.
   • Đổi tên bé: 1 💎, không ghi chú gì, chỉ hiện thông báo khi đổi.
   • 🛁 TẮM (mới): thanh Sạch sẽ (b.s, tụt theo thời gian thật). Tắm 10 Xu → bóng nước nổi quanh bé 3 giây rồi biến mất, Sạch sẽ = 100%.
   • 💬 Bé không đứng yên: nhún nhẹ, hay nói "Anh/Chị ơi, em ..." tùy ngữ cảnh (đói / bẩn / buồn / có quà / sau khi ăn-chơi-tắm / giờ giấc...).
   • Thời trang: danh sách MINISETS bên dưới. Muốn thêm set mới chỉ cần thêm 1 dòng vào MINISETS (xem hướng dẫn ngay đó).
   =================================================================================== */
(()=>{
/* ---------------- CÂN BẰNG: chỉnh các số ở đây ---------------- */
const BB_COST=20,          // Xu mỗi lần cho ăn / chơi
      BB_FILL=40,          // mỗi lần cho ăn/chơi hồi bao nhiêu % thanh
      BB_ALLOW=60,         // chỉ cho ăn/chơi khi thanh ≤ mức này (tránh bấm liên tục tốn xu)
      BB_BATH=10,          // Xu mỗi lần tắm
      BB_ALLOW_BATH=80,    // chỉ cho tắm khi Sạch sẽ ≤ mức này (tránh tốn xu oan)
      BB_XP_BATH=0,        // EXP mỗi lần tắm (0 = tắm không cộng EXP; chỉ ăn/chơi mới giúp bé lớn)
      BB_BATH_MS=3000,     // bóng nước nổi bao lâu
      BB_EXP=100,BB_XP=10, // EXP để lớn • EXP mỗi lần cho ăn/chơi (chỉ lúc còn là em bé)
      BB_DIA_GROW=10,      // kim cương để cho bé lớn ngay
      BB_DIA_NAME=1,       // kim cương để đổi tên
      BB_NAME_MAX=7,       // số ký tự tối đa của tên
      BB_GIFT_MS=2*60*60*1000,   // 2 giờ / quà
      BB_SCALE=.7,         // bé bằng 70% nhân vật chính
      BB_EMPTY={baby:{f:150,h:180,s:200},big:{f:420,h:540,s:500}};   // số PHÚT để mỗi thanh tụt từ 100 → 0 (em bé / đã lớn)
/* Quà: trọng số (càng lớn càng hay ra). Kim cương & vé Tí Nị để thấp vì "ít khi". Xu ngẫu nhiên 80–160 */
const BB_GIFTS=[['xu',45],['tk',42],['ti',9],['dia',4]],BB_XU=[80,160],BB_TK=2;

/* ---------------- MINISET (thời trang của Bé bỏng) ----------------
   Muốn thêm set mới: thêm 1 object vào MINISETS (đừng đổi thứ tự/ id các set cũ):
     {id:'duy nhất', n:'Tên hiển thị', xu:giá Xu  (hoặc dia:giá kim cương; bỏ cả hai = miễn phí),
      set:{...giống 1 phần tử trong SETS của index.html: sh, shl, shd, scarf, belt, pt, shoe, fx...},
      hm:{k:'short',c:'#màu'}   ← tóc khi là bé trai   (cùng định dạng phần tử HAIRS)
      hf:{k:'longf',c:'#màu'}   ← tóc khi là bé gái}
   Bé chỉ mặc được CẢ SET (gồm tóc), không đổi riêng tóc hay biểu cảm.                                        */
const XMAS={n:'Miniset Mùa đông',sh:'#c8202a',shl:'#e8454e',shd:'#8f1a22',scarf:'#fbfbfd',tail:1,belt:'#8f1a22',trim:'#fbfbfd',pt:'#2f5d3a',rpt:'#2f5d3a',shoe:'#3a2a22'};
/* mũ Noel + tóc (bé trai: tóc ngắn lòi ra; bé gái: tóc dài xõa) + sao lấp lánh trên đỉnh mũ (nam vàng, nữ hồng) */
HAIRFX.bbxm=(u,o,K)=>{const{side,Rt,back,HS}=K,HC=HS.c,fe=HS.f,tw=Math.floor(performance.now()/300)%3,R='#c8202a',Rl='#e8454e',Rd='#8f1a22',W='#fbfbfd',Wd='#d6dae6',sc=HS.sc,scl=shade(sc,.55);
 const star=(x,y)=>{u(sc,x+1,y,1,3);u(sc,x,y+1,3,1);u(tw?scl:'#ffffff',x+1,y+1,1,1);if(tw==1){u('#ffffff',x-1,y-1,1,1);u('#ffffff',x+3,y+3,1,1)}else if(tw==2){u('#ffffff',x+3,y-1,1,1);u('#ffffff',x-1,y+3,1,1)}};
 if(!side&&!back){
  if(fe){u(HC,5,9,2,13);u(HC,13,9,2,13);u(HC,5,22,2,1);u(HC,13,22,2,1)}else{u(HC,6,9,1,3);u(HC,13,9,1,3)}
  u(R,6,5,8,3);u(R,5,7,10,1);u(Rl,7,5,2,2);u(Rd,12,5,2,3);u(R,7,4,7,1);u(R,8,3,5,1);u(R,10,2,3,1);star(10,-1);
  u(W,5,8,10,2);u(Wd,5,9,10,1)}
 else if(back){
  if(fe){u(HC,5,9,10,14)}else{u(HC,6,9,8,3)}
  u(R,5,5,10,3);u(R,6,4,8,1);u(R,7,3,6,1);u(R,9,2,4,1);u(Rd,5,5,1,3);u(Rd,14,5,1,3);star(10,-1);
  u(W,5,8,10,2);u(Wd,5,9,10,1)}
 else{
  const x0=Rt?5:6,tipx=Rt?5:12;
  if(fe)u(HC,Rt?5:12,9,3,13);else u(HC,Rt?5:12,9,3,3);
  u(R,x0,5,9,3);u(R,Rt?6:7,4,7,1);u(R,Rt?6:8,3,5,1);u(R,Rt?6:8,2,3,1);u(Rd,Rt?5:13,5,2,3);u(Rl,Rt?8:8,5,2,2);star(Rt?5:8,-1);
  u(W,x0,8,9,2);u(Wd,x0,9,9,1)}};
/* ⭐ Vương miện ngôi sao + tóc (bé trai: tóc ngắn; bé gái: tóc dài xõa). HS.c = màu tóc, HS.f = 1 nếu tóc dài, HS.sc = màu sao */
HAIRFX.bbstar=(u,o,K)=>{const{side,Rt,back,HS}=K,HC=HS.c,fe=HS.f,hl=shade(HC,.3),hd=shade(HC,-.22),tw=Math.floor(performance.now()/320)%3,
 G='#ffd23f',Gl='#fff0a0',Gd='#d99a14',sc=HS.sc||'#ffe27a',GEM=fe?'#ff7ab8':'#4db8ff';
 const star=(x,y)=>{u(G,x+1,y,1,3);u(G,x,y+1,3,1);u(tw==0?'#ffffff':Gl,x+1,y+1,1,1);if(tw==1){u('#ffffff',x-1,y-1,1,1);u('#ffffff',x+3,y+3,1,1)}else if(tw==2){u('#ffffff',x+3,y-1,1,1);u('#ffffff',x-1,y+3,1,1)}};
 if(!side&&!back){
  u(HC,6,6,8,3);u(HC,7,5,6,1);u(hl,8,6,3,1);
  if(fe){u(HC,5,8,2,14);u(HC,13,8,2,14);u(hd,5,10,1,11);u(hd,14,10,1,11);u(hl,6,10,1,9);u(HC,5,22,2,1);u(HC,13,22,2,1);u(HC,7,8,2,1);u(HC,11,8,2,1)}
  else{u(HC,6,9,1,3);u(HC,13,9,1,3);u(HC,7,8,3,1);u(hd,6,11,1,1);u(hd,13,11,1,1)}
  u(G,5,5,10,2);u(Gl,5,5,10,1);u(Gd,5,6,10,1);u(GEM,9,5,2,2);u('#ffffff',9,5,1,1);
  star(5,2);star(9,0);star(13,2)}
 else if(back){
  if(fe){u(HC,5,6,10,17);u(hd,5,9,1,13);u(hd,14,9,1,13);u(hd,9,10,2,12);u(hl,7,9,1,11);u(HC,5,22,10,1)}
  else{u(HC,6,6,8,6);u(hd,6,11,8,1);u(hl,8,7,3,1)}
  u(G,5,5,10,2);u(Gl,5,5,10,1);u(Gd,5,6,10,1);
  star(5,2);star(9,0);star(13,2)}
 else{
  const x0=Rt?5:6;
  u(HC,x0,6,9,3);u(HC,Rt?6:7,5,7,1);u(hl,Rt?7:9,6,3,1);
  if(fe){u(HC,Rt?5:12,8,3,14);u(hd,Rt?5:14,10,1,11);u(hl,Rt?7:12,10,1,9)}else{u(HC,Rt?5:12,8,3,4);u(hd,Rt?5:14,11,1,1)}
  u(G,x0,5,9,2);u(Gl,x0,5,9,1);u(Gd,x0,6,9,1);u(GEM,Rt?11:7,5,2,2);
  star(Rt?5:11,2);star(Rt?9:7,0)}};
/* ---------------- 🐮🐷🦊 MINISET THÚ BÔNG (hình pixel sẵn) ----------------
   Các set có spr:'tên' sẽ vẽ thẳng hình pixel bên dưới (PNG nhúng sẵn dạng base64, không cần file ảnh ngoài).
   Hình chỉ có 1 góc nhìn (nhìn thẳng): quay trái/phải thì lật ngang, đi bộ thì nhún nhẹ. Không có g => bé trai & bé gái đều mua/mặc được.
   Muốn thêm thú mới: thêm 1 dòng vào SPR (tên: 'data:image/png;base64,...') + 1 dòng trong MINISETS có spr:'tên'. */
const SPR={
 trau:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAZCAYAAADAHFVeAAAEFUlEQVR42rWWT0gcZxjGfzM67syoEVnicQkiWIuUsnTZSOluLkrQYtQc0iDYBnPZHrKFog3uul1FCypCzaF7iYdaQhOESIqRXhXKVoTSgxgCJRSPLYvorp3RiTM97M64s38Se+gLw377/Xmfed/3ed5vhMf3LcaWuqyFaFrgf7RkKmTVAtTXSSRTISsRWSsDnE4NWgAqOf6h4a1OReWE+GcbAoCIF5MMXy19bNXXSdSaZADY2fyG4PVey9Q8rsMDfrUwUmmugYMzCHRmMQgisV0GZvAh86luy34xUTlhL71IIDxBbfHG7Z8Xyw4Hr3/JrSsKmiKj53QCAQOgIpA9HxtRiK3kA3BFLeIlGdkSAuGJiodlzUBTZBRN59mLo7emcXZFwyDI8anhzAXCEyQjW4ITWSKyJgTC+foU251ACwdnoCkycFRIVZB2Xy9t3XIZ2BcPx5DY5tu7IuHwPXRFIhHZEEwyiMUbE5E14fjUYMCvcrtDZMCvoud0FC3/9PhbaPVN0e7rZXRm3AUSDt8DYC+94Mz9feoheygi4i08dj7xMp0atIavNqFoOv034yia7nL46NdDB2Q5Pu9a29x84AIFuFx3wsLdLpKpkGWScRNEJUdzjUrPzTjDizH6O5odwCd/avw0PQvgAOqLErJ2XhtdkXgUn2d0ZpzYiFJEpBpEvG6w8chvQjIVsr7fjfFpZzN6TnfIYUuirVtmmXle7m8A0O7r5eX+Bu2+XmedmXPw2EoNychWQXclloisCabmcUihaHlAlZyTprZumb7RIfpGh5wxQH9iskhvQbKHYt5fQcvim2hcWjOgahdp65ZpbDKdiCS2qa+THHIA7jRexOwIS8mwufnAVb9KdiEwO8KX+xuMj1wrY6BT85FrPF9+WtWP8Pj+uY7tpjl8tYlAZxaA3R0p30kaZJ7s/OU6rCuSq9PYZjNxcvU1puZxCFJbDGTfAMW1evbiiBsdl9BzOjc6LtEZMP5zkvLdo4KoB/yqy6H99poiu+ZbfVO0+qYwCDrjivfYyAfONSWWRlYc1eTqa25dUaoy09ZZNbNTKyon+V+TDMlUyClcvuGW16HUXu1//cb/rjRqHkwyCO80fWT9GE/Qn5hkLrou2LeqSo4ef4sTkdwg09aRLXPU6puqCGQQZHr1F7KHInPR9fIOIuJ1FoqBAPSc7jDzIhH9vruHqXlYiKYFW9i1iciacHsm3+3Hlrqs+jqpkGO1opOd3caq9XNpE72yzkwyTKcGrTsBlYOz8+vEvm4Ah4mzK1pZyzo+Nbhcd+KSRnEDrihqmyjHpwYL0bSQTIWsAb/K+53v5r8tKjgobQQGQcYeppmLrgt2TywDe/r8u4rpSP/xg9XYZGJqHt7zfVL127LavqG+z509/wL/57y+ru2PRwAAAABJRU5ErkJggg==',
 heo:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAYAAAARfGZ1AAADBklEQVR42o1Wz08aQRT+ZoEGolxMOXmBg6QHa+2haRWJCUFt1tCGpF5M2kOPtdGDDW4QT1YC/jpY2j/Ag0kjiYlE0yohsf6oaQ+leLM2cNd40QZaYKcHu+MMu1jfZWH2vW/efO97b5YklRIAIJKQqV2q4Ew1AwBev1wnuKbxsXycWXt5oMwLAbdj4mYlUgUAWKlJ8LNLFaTCc3CqFhSkMgJRmWobmLXAglSGU7WwoANlHgWpDEdTCcenVrh8bl3Gqu1iI49Xxl5oQYgHAAkAZoc+kkB0jC12Tg8DAJyqBT2hcbh8bgbEA0vFKjxeGbvb62iJjwgnZJlrHGtU7IUWDIEAIB1bZOt+5dlFhsUqjjZX0dEbwOzQBhEy5/mrBV5S5lA5yTLgicwyAGAis4x0bBGfN1LsVFp9dOCRhExrgQFgMDaKPz8o+z/pGxCeAODu6odqMyG3u4pIQqY6WoysJT6C7MwUekLjOKYEDkJ1PhOZZWRnpuDu6sfhzprw7kpwB6E4PrViSZljqvn5ZV/wefCwHTdajFuiLnhBKgvUbK1E0YzfaL5/V/DrDoaxtRLV6V9XUN54zR7T6zWrVKwaS7EuNU0lgevuYJj93lqJXhn7X/D9D1lBGbWAk74BfHrzzTCWJJUSIgmZpsJx1uI0nWe8D8ZGhQAjihyEYnd7HVKxilZ/kDWl2YjjzulhNiv2QgsgfpeuU3XGrWu8m7Wsic+lmx+/bp6hsb3t8pipI+SlMlw+N86zOQAQ3mvxhztrcHf1UXNttTt6A2wENJzYDVVE03k0wG6oFu1ppSZRirWZ6wrkdwn61+iqF0+SSgmv3vZRrTC186UWAADOszmBDt74grJ5bgTMK4c3I2DVZkI+cwi7VIFwE0USMi2R+l1otIGOsn/9zo9dcqvRR1PhOJyqhUmQp0S1meDxyoK+HYSyKbk5PcVO0tEbwNiLy8uCNRGfxYEyz7hu9QcNvwS0S11LoM3zSOdHnnre6Y64nXtPtSl3786Tunx9/Z5kSfF+j73PAQB/AZS3V3ZbMhd8AAAAAElFTkSuQmCC',
 cao:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAYAAACkVDyJAAAD70lEQVR42pWWXUhbZxjHf+9JaERSN9LIxIJfKRsMJ6OyRSoGE92ltLuRebFeVCJlN6OMbi6V7qKpdheb7KYMD91FYVh6sQ9kjDGXDNkGQpFSRejANfFChGbSSdBE0vPu4uQ9OTk5ydwD4XzkOc///f+fj/cV96Ylje0AaAYOuH13QgK8d3FRqHfmteI7o0clwEz8F9GEvyaaxrHMDNQfjtAfjjCjR2WBvKvPWGScscg4SX1Emgv6X4DmByrQ5DkPk+c8VsACRtmnAgZYPkoRu3kbAzZTy6S80rwgqY/Idl8bO8VdAJZW7pcBJwDK7w+q4nmPI6iWFwB0eVYBuDEEN989aVOhxfHFD1wPDbK0UgFykfTA9jOtQJ7Z+VG5NtfNjaEHeLUtAGKz6YYLHJ5ax8fvPNJbavKt2XNVWY0J3ISG4ZcWkN2KDHJca7LxsiS9fXdC7hR30fKCxJVlYTr60fKCktFjgXq1LVKJKCfe+tAK8mpX1LrfzKT57QmUfj7vnh4Ftvx4kc1Mmo1citn5UbOX9LBcm+uuYlgyQjWSbmbSVVclK2DJqlT0mo38vegNDsiNXAqAjVyK3mBMOvtWgX310TS9wRiGX1oFhd9kGhBZ9mQn301P0xdf5JHeUtsWBfK0nXqp6g/DL2vA7Ey/Sb7TMG8dA4cERBZ4zb3xC0erHOmTABzpk1XyqNyVjJD1fOnTW3QMHHI69IyOgUPrdzr0jAu3Fl17ugx4QFIfkamEmXjjzrAFaq7Q3fZkJwCeVl/Ve+ezc2p5zfFUYWG/NrKAyPL8aRFPq4/Rt79gT3YSEFl+WrjccKHepD4iH17rqalE07ZrZAW488dzBoeu4mk9AmD52/er/AaHrvLJ5+6A4sypN2sAASLJbVKJKFpXzpQ6E7Ty+PrNv9Dyoqaw7KPwxZMZfl0wC6Yvvk+7r41LF78WrrPUZLiNV9vC4AVrnKk8OwuqnqnmD4gsu38L991C9VoqEcXoyP1n0D+/XADg5ctTVfdOe7B8nrMXRmTd/dAu8fDUOqlEtGExKbC68Z6mGm/A9p5rZE42buzsw15LxtPi7MdPKBkha5qkElFis2n64vvHYqdA6oE1nQjzRvxHkvG00Oybo6pCBRoQWatQ7D5qODRipgrGyATZKe6SjKeFteMnriyL2OwZa9o45XSyKxkhKI/B+jXwjwlIsGq0iXvTkgJ5mtCY0aPSyUpVrGKv+nJ4ap092Yn9TKMmjL1/++L75SOjBjSbgG6nNOeKH17rqROkckq4Ph+Ta3PdaF05igxaeStgoM6ownkQXn38matESyv3JUC7r43+cETUk1L5AYxFxi2/8CsfAPAv3y3BiK5JwX8AAAAASUVORK5CYII='};
const SPI={};
function sprImg(k){let im=SPI[k];if(!im&&SPR[k]){im=SPI[k]=new Image();im.onload=()=>{Object.keys(SPC).forEach(x=>delete SPC[x]);try{if(UI&&$('ui').classList.contains('bbui')){paintFashion();paintShop()}}catch(e){}};im.src=SPR[k]}return im&&im.complete&&im.naturalWidth?im:null}
Object.keys(SPR).forEach(sprImg);   // nạp trước cho kịp lúc mở shop
const BBSPR={w:64,h:64};            // khung vẽ của set thú bông (px), vẽ gấp đôi hình gốc
const MINISETS=[
 {id:'warm',n:'Miniset Ấm áp',
  set:{n:'Miniset Ấm áp',sh:'#fbfbfd',shl:'#ffffff',shd:'#d5d9e6',scarf:'#fbfbfd',knot:'#e3e6ee',belt:'#e3e6ee',pt:'#1c1c22',rpt:'#1c1c22',shoe:'#f4f4f6'},
  hm:{n:'Tóc ngắn',k:'short',c:'#2b1d12'},hf:{n:'Tóc dài',k:'longf',c:'#201a24'}},
 /* ---- Miniset Mùa đông: bán ở 🧸 Shop Miniset (Phố xá, chỗ Hiệu thuốc cũ). g = chỉ bé trai ('m') / bé gái ('f') mua & mặc được. shop:1 = có bán trong shop ---- */
 {id:'winm',n:'Miniset Mùa đông',g:'m',xu:250,shop:1,set:XMAS,hm:{n:'Mũ Noel',k:'bbxm',c:'#2b1d12',f:0,sc:'#ffd23f'}},
 {id:'winf',n:'Miniset Mùa đông',g:'f',xu:250,shop:1,set:XMAS,hf:{n:'Mũ Noel',k:'bbxm',c:'#201a24',f:1,sc:'#ff7ab8'}},
 /* ---- Miniset Ngôi sao (Mi nhon): vương miện ngôi sao, trang phục cute — 1500 Xu / set. Bé gái tóc hồng. ---- */
 {id:'starm',n:'Miniset Ngôi sao',g:'m',xu:1500,shop:1,set:{n:'Miniset Ngôi sao',sh:'#ffe27a',shl:'#fff0a8',shd:'#e0b94a',scarf:'#ffffff',knot:'#7ec8f2',belt:'#7ec8f2',trim:'#ffffff',tail:1,pt:'#7ec8f2',rpt:'#7ec8f2',shoe:'#ffffff'},hm:{n:'Vương miện sao',k:'bbstar',c:'#6a4426',f:0}},
 {id:'starf',n:'Miniset Ngôi sao',g:'f',xu:1500,shop:1,set:{n:'Miniset Ngôi sao',sh:'#ffb6d3',shl:'#ffd3e5',shd:'#e88fb4',scarf:'#ffffff',knot:'#ffe27a',bow:1,belt:'#ffffff',skirt:'#ff94bf',pt:'#f1c08a',rpt:'#ff94bf',shoe:'#ffffff'},hf:{n:'Vương miện sao',k:'bbstar',c:'#ff9cc8',f:1}},
 /* ---- 🐮🐷🦊 Miniset thú bông (hình pixel): Trâu bé / Heo bé / Cáo bé — 2000 Xu / set, bé trai & bé gái đều mặc được ---- */
 {id:'trau',n:'Miniset Trâu bé',xu:2000,shop:1,spr:'trau',set:{n:'Miniset Trâu bé',sh:'#a86838',shl:'#a86838',shd:'#a86838',pt:'#1c1c22',rpt:'#1c1c22',shoe:'#f4f4f6'},hm:{n:'Tóc ngắn',k:'short',c:'#2b1d12'},hf:{n:'Tóc dài',k:'longf',c:'#201a24'}},
 {id:'heo',n:'Miniset Heo bé',xu:2000,shop:1,spr:'heo',set:{n:'Miniset Heo bé',sh:'#f880c8',shl:'#f880c8',shd:'#f880c8',pt:'#1c1c22',rpt:'#1c1c22',shoe:'#f4f4f6'},hm:{n:'Tóc ngắn',k:'short',c:'#2b1d12'},hf:{n:'Tóc dài',k:'longf',c:'#201a24'}},
 {id:'cao',n:'Miniset Cáo bé',xu:2000,shop:1,spr:'cao',set:{n:'Miniset Cáo bé',sh:'#f88838',shl:'#f88838',shd:'#f88838',pt:'#1c1c22',rpt:'#1c1c22',shoe:'#f4f4f6'},hm:{n:'Tóc ngắn',k:'short',c:'#2b1d12'},hf:{n:'Tóc dài',k:'longf',c:'#201a24'}}
];
const msGet=id=>MINISETS.find(x=>x.id==id)||MINISETS[0];

/* ---------------- tiện ích ---------------- */
const B=()=>ST.bb&&ST.bb.on?ST.bb:null,tNow=()=>Date.now();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cleanName=s=>Array.from(String(s||'').normalize('NFC').replace(/[\u0000-\u001f<>]/g,'').trim()).slice(0,BB_NAME_MAX).join('');
const fmtDay=t=>{const d=new Date(t);return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()};
const fmtLeft=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' giờ '+m+' phút':m?m+' phút '+(s%60)+' giây':(s%60)+' giây'};
function bbFix(){const b=ST.bb;if(!b||!b.on)return;
 b.g=b.g=='f'?'f':'m';b.c=b.c=='chi'?'chi':'anh';b.n=cleanName(b.n)||'Bé';b.ad=+b.ad||tNow();b.big=b.big?1:0;b.exp=cl(b.exp|0,0,BB_EXP);
 b.h=cl(+b.h||0,0,100);b.f=cl(+b.f||0,0,100);b.s=b.s==null?100:cl(+b.s||0,0,100);b.t=+b.t||tNow();b.gt=+b.gt||tNow()+BB_GIFT_MS;b.fl=b.fl?1:0;b.pp=(b.pp|0)>=0?b.pp|0:-1;
 if(!Array.isArray(b.own))b.own=[];if(!b.own.includes('warm'))b.own.push('warm');b.own=b.own.filter(id=>MINISETS.some(x=>x.id==id));const cs=MINISETS.find(x=>x.id==b.set);if(!cs||!b.own.includes(b.set)||(cs.g&&cs.g!=b.g))b.set='warm'}
bbFix();

/* thanh Vui vẻ / No bụng: tính theo mốc thời gian thật nên vẫn tụt khi tắt game (giống thanh Sức khỏe / Độ no) */
function bars(b){b=b||B();const m=Math.max(0,(tNow()-b.t)/60000),e=BB_EMPTY[b.big?'big':'baby'];return{h:cl(b.h-m*100/e.h,0,100),f:cl(b.f-m*100/e.f,0,100),s:cl((b.s==null?100:b.s)-m*100/e.s,0,100)}}
function settle(b){const c=bars(b);b.h=c.h;b.f=c.f;b.s=c.s;b.t=tNow()}
function mood(b){const c=bars(b);return c.f<30?'hungry':c.s<30?'dirty':c.h<30?'bored':'ok'}
function statusTxt(b){const m=mood(b);
 if(b.big)return m=='hungry'?'Đói bụng rồi 🍙':m=='dirty'?'Người bẩn bẩn, muốn tắm 🫧':m=='bored'?'Buồn chán, muốn chơi 🥺':'Đang vui vẻ 😊';
 return m=='hungry'?'Đói bụng, khóc nhè 😭':m=='dirty'?'Người bẩn bẩn, đòi tắm 🫧':m=='bored'?'Buồn chán, đòi chơi 🥺':'Đang ngủ ngon 💤'}

/* ---------------- VẼ NHÂN VẬT BÉ (dùng lại drawAv của nhân vật chính) ---------------- */
function avObj(b,d,mv,a){const m=msGet(b.set);return{d,a:a||0,mv:mv?1:0,sit:0,e:0,acc:-1,setObj:m.set,hairObj:(m.g||b.g)=='f'?m.hf:m.hm}}
const SPC={};
function sprite(b,d,mv,f){const ms=msGet(b.set);
 if(ms.spr){const key='S'+ms.id+'_'+(d==3?1:0)+(mv?'w'+(f&1):'i');if(SPC[key])return SPC[key];
  const im=sprImg(ms.spr),c=document.createElement('canvas');c.width=BBSPR.w;c.height=BBSPR.h;if(!im)return c;   // chưa nạp xong: trả khung trống, KHÔNG lưu cache
  const g=c.getContext('2d');g.imageSmoothingEnabled=false;const w=im.naturalWidth*2,h=im.naturalHeight*2,x=Math.round((BBSPR.w-w)/2),y=BBSPR.h-h-(mv&&(f&1)?4:0)-2;
  if(d==3){g.translate(BBSPR.w,0);g.scale(-1,1)}g.drawImage(im,x,y,w,h);return SPC[key]=c}
 const key=b.set+b.g+'_'+d+(mv?'w'+f:'i')+(msGet(b.set).hm&&msGet(b.set).hm.k=='bbxm'||msGet(b.set).hf&&msGet(b.set).hf.k=='bbxm'?'t'+Math.floor(performance.now()/300)%3:'');let c=SPC[key];if(c)return c;
 c=document.createElement('canvas');c.width=48;c.height=72;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.scale(2,2);
 try{drawAv(g,2,2,avObj(b,d,mv,(f+.5)/9))}catch(e){}return SPC[key]=c}
function drawFollow(){const b=B();if(!b||!b.big||!b.fl||(CVON&&CV.boat)||(HMA&&HMA.hide))return;
 const mv=PET.mv?1:0,f=mv?Math.floor(PET.a*9)%4:0,sp=sprite(b,PET.d|0,mv,f),isS=!!msGet(b.set).spr,W=(isS?BBSPR.w*.35:24*BB_SCALE),H=(isS?BBSPR.h*.35:36*BB_SCALE),sm=cx.imageSmoothingEnabled,
  tt=performance.now()/1000,bn=mv?0:Math.abs(Math.sin(tt*3.4)),lift=bn*1.3,sy=mv?1:1+.035*(bn-.5);   // đứng yên: nhún nhẹ (nảy lên + co giãn)
 cx.imageSmoothingEnabled=true;try{cx.imageSmoothingQuality='high'}catch(e){}
 const hh=H*sy,fy=PET.y-32*BB_SCALE+36*BB_SCALE;                                         // chân luôn đứng đúng chỗ
 cx.drawImage(sp,Math.round(PET.x-W/2),Math.round((fy-lift-hh)*10)/10,W,hh);cx.imageSmoothingEnabled=sm;
 if(BATH&&performance.now()<BATH.until){const R=(c,x,y,w,h)=>{cx.fillStyle=c;cx.fillRect(Math.round(PET.x+x),Math.round(PET.y+y),w,h)};
  bubbleField(R,(performance.now()-BATH.t0)/1000,{cx:0,cy:2,hw:15,rise:36,k:1})}}
function drawTag(){const b=B();if(!b||!b.big||!b.fl||(CVON&&CV.boat)||(HMA&&HMA.hide))return;
 cx.save();cx.font='400 6px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';cx.lineJoin='round';cx.lineWidth=1.4;
 const x=Math.round(PET.x),y=Math.round(PET.y-(msGet(b.set).spr?18:23));cx.strokeStyle='rgba(30,20,10,.55)';cx.strokeText(b.n,x,y);cx.fillStyle='#eafff1';cx.fillText(b.n,x,y);
 if(SAY&&SAY.w&&performance.now()<SAY.until){const t=SAY.txt,by=y-12;cx.font='800 8px Nunito,"Segoe UI",Arial,sans-serif';cx.lineWidth=1;const w=Math.min(150,cx.measureText(t).width)+10;   // bong bóng thoại
  cx.fillStyle='rgba(30,20,10,.45)';cx.fillRect(x-w/2+1,by-9,w,13);cx.fillStyle='#fffdf0';cx.fillRect(x-w/2,by-10,w,13);cx.fillRect(x-2,by+3,4,2);cx.fillStyle='#3a2412';cx.fillText(t,x,by,w-6)}
 cx.restore()}
/* móc vào vòng vẽ của game (tên vẽ sau cùng để không bị che) */
{const od=window.drawNames;window.drawNames=tm=>{if(od)od(tm);drawTag()}}
window.bbFollowing=()=>{const b=B();return !!(b&&b.big&&b.fl)};
window.bbDrawFollow=drawFollow;

/* ---------------- NÔI EM BÉ (SVG) ---------------- */
function cradle(md){
 const face=md=='hungry'?
  '<path d="M136 101q4-4 8 0M148 101q4-4 8 0" fill="none" stroke="#7a5a4a" stroke-width="2" stroke-linecap="round"/><ellipse cx="147" cy="109" rx="3.4" ry="4" fill="#c9605a"/>'
  +'<g class="bbtear" fill="#8fd0ff"><path d="M138 104q-3 5 0 7q3-2 0-7z"/><path d="M156 104q-3 5 0 7q3-2 0-7z"/></g>'
  :(md=='bored'||md=='dirty')?
  '<circle cx="141" cy="99" r="2.3" fill="#7a5a4a"/><circle cx="153" cy="99" r="2.3" fill="#7a5a4a"/><path d="M144 110q3-3 6 0" fill="none" stroke="#c9806a" stroke-width="1.8" stroke-linecap="round"/>'
  :'<path d="M137 99q4 4 8 0M149 99q4 4 8 0" fill="none" stroke="#7a5a4a" stroke-width="2" stroke-linecap="round"/><path d="M144 108q3 3 6 0" fill="none" stroke="#c9806a" stroke-width="1.8" stroke-linecap="round"/>';
 const zz=md=='ok'?'<g font-family="sans-serif" font-weight="800" fill="#9bb5d6"><text class="bbz" x="190" y="88" font-size="14">z</text><text class="bbz bbz2" x="200" y="74" font-size="18">Z</text></g>':'';
 return '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
 +'<defs><linearGradient id="bbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4f6ec"/><stop offset="1" stop-color="#fff4d8"/></linearGradient></defs>'
 +'<rect width="300" height="200" fill="url(#bbg)"/>'
 +'<ellipse cx="60" cy="40" rx="26" ry="9" fill="#fff" opacity=".8"/><ellipse cx="76" cy="34" rx="16" ry="8" fill="#fff" opacity=".8"/>'
 +'<ellipse cx="248" cy="62" rx="22" ry="8" fill="#fff" opacity=".7"/>'
 +'<g class="bbtw" fill="#ffd86b"><path d="M34 90l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z"/></g><g class="bbtw bbtw2" fill="#ffc9a8"><path d="M262 108l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/></g>'
 +'<g class="bbtw" fill="#bfe8d4"><circle cx="46" cy="140" r="3"/><circle cx="256" cy="150" r="2.5"/></g>'
 +'<g class="bbmo"><line x1="150" y1="0" x2="150" y2="22" stroke="#c9a56b" stroke-width="2"/><line x1="96" y1="22" x2="204" y2="22" stroke="#c9a56b" stroke-width="3" stroke-linecap="round"/>'
 +'<line x1="100" y1="22" x2="100" y2="46" stroke="#d8c39a" stroke-width="1.5"/><path d="M100 44l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#ffd86b"/>'
 +'<line x1="150" y1="22" x2="150" y2="54" stroke="#d8c39a" stroke-width="1.5"/><path d="M150 52a9 9 0 1 0 8 13 7 7 0 0 1-8-13z" fill="#ffe6a8"/>'
 +'<line x1="200" y1="22" x2="200" y2="42" stroke="#d8c39a" stroke-width="1.5"/><g fill="#fff" stroke="#cfe3f5" stroke-width="1"><circle cx="195" cy="48" r="6"/><circle cx="204" cy="46" r="7"/><circle cx="210" cy="50" r="5"/><rect x="192" y="48" width="20" height="7" rx="3.5" stroke="none"/></g></g>'
 +'<ellipse cx="150" cy="184" rx="92" ry="8" fill="#000" opacity=".08"/>'
 +'<g class="'+(md=='ok'?'bbsw':'bbsh')+'"><path d="M92 176q58 14 116 0" fill="none" stroke="#c99a5b" stroke-width="5" stroke-linecap="round"/>'
 +'<path d="M58 118C62 160 100 172 150 172S238 160 242 118Z" fill="#f3d6a4" stroke="#d6b073" stroke-width="3" stroke-linejoin="round"/>'
 +'<g fill="none" stroke="#e6c48c" stroke-width="2" stroke-linecap="round"><path d="M70 134q80 22 160 0"/><path d="M80 150q70 18 140 0"/><path d="M100 164q50 10 100 0"/><path d="M110 120v46M150 124v48M190 120v46" opacity=".6"/></g>'
 +'<ellipse cx="150" cy="118" rx="92" ry="13" fill="#e9c88c" stroke="#d6b073" stroke-width="3"/><ellipse cx="150" cy="119" rx="82" ry="9" fill="#fff6dc"/>'
 +'<ellipse cx="146" cy="104" rx="22" ry="12" fill="#fff" opacity=".9"/>'
 +'<circle cx="146" cy="98" r="21" fill="#ffe3cc"/><path d="M128 92q18-18 36 0q-18-8-36 0z" fill="#fff0c9"/>'
 +face
 +(md=='dirty'?'<g fill="#b8956a" opacity=".6"><circle cx="138" cy="91" r="2.2"/><circle cx="156" cy="96" r="1.8"/><circle cx="150" cy="88" r="1.4"/></g>':'')
 +'<ellipse cx="135" cy="107" rx="4.5" ry="3" fill="#ffb7a0" opacity=".7"/><ellipse cx="159" cy="107" rx="4.5" ry="3" fill="#ffb7a0" opacity=".7"/>'
 +'<path d="M84 121Q150 104 216 121L212 128Q150 146 88 128Z" fill="#bfe8d4"/><g fill="#fff" opacity=".85"><circle cx="110" cy="124" r="2"/><circle cx="135" cy="128" r="2"/><circle cx="165" cy="128" r="2"/><circle cx="190" cy="124" r="2"/></g>'
 +'<path d="M58 118Q150 150 242 118" fill="none" stroke="#d6b073" stroke-width="6" stroke-linecap="round"/><path d="M58 118Q150 150 242 118" fill="none" stroke="#e9c88c" stroke-width="3" stroke-linecap="round"/></g>'
 +zz+'</svg>'}

/* ---------------- CSS ---------------- */
(()=>{const css=document.createElement('style');css.textContent=
 '#ui.bbui{width:min(94vw,440px);max-height:90vh;background:linear-gradient(170deg,#f1fbf5 0%,#fff8e6 55%,#eef6ff 100%);border-color:#a9d3bc;box-shadow:0 3px 0 #86b79d;color:#4a6a5a;border-radius:18px}'
 +'#ui.bbui .b.x{background:#dff3e8;border-color:#86b79d;box-shadow:0 2px 0 #86b79d;color:#3f6a55}'
 +'.bbsc{border-radius:16px;overflow:hidden;border:2px solid #cfe6d9;background:#fff;line-height:0}.bbsc svg{width:100%;height:auto;display:block}'
 +'.bbsw{transform-origin:150px 176px;animation:bbsw 4.2s ease-in-out infinite}.bbsh{transform-origin:150px 176px;animation:bbsh .5s ease-in-out infinite}'
 +'@keyframes bbsw{0%,100%{transform:rotate(-1.8deg)}50%{transform:rotate(1.8deg)}}@keyframes bbsh{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}'
 +'.bbmo{transform-origin:150px 22px;animation:bbsw 5.4s ease-in-out infinite reverse}'
 +'.bbz{animation:bbz 3.2s ease-in-out infinite;opacity:0}.bbz2{animation-delay:1.4s}@keyframes bbz{0%{opacity:0;transform:translate(0,6px)}30%{opacity:.9}100%{opacity:0;transform:translate(8px,-14px)}}'
 +'.bbtw{animation:bbtw 2.6s ease-in-out infinite}.bbtw2{animation-delay:1.1s}@keyframes bbtw{0%,100%{opacity:.25}50%{opacity:1}}'
 +'.bbtear{animation:bbtr 1.1s ease-in infinite}@keyframes bbtr{0%{opacity:0;transform:translateY(-2px)}30%{opacity:1}100%{opacity:0;transform:translateY(10px)}}'
 +'.bbcard{background:rgba(255,255,255,.78);border:2px solid #d6eadf;border-radius:14px;padding:10px 12px;margin-top:8px}'
 +'.bbnm{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-weight:800;font-size:15px;color:#3f6a55}.bbnm small{font-size:11px;color:#7b9a8a;font-weight:700;text-align:right}'
 +'.bbbar{height:12px;border-radius:8px;background:#e8f1ec;border:2px solid #cfe6d9;overflow:hidden;box-sizing:content-box;margin-top:4px}.bbbar i{display:block;height:100%;border-radius:6px;transition:width .4s}'
 +'.bbrow{margin-top:8px}.bbrow:first-of-type{margin-top:0}.bbrl{display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#5a7d6c}.bbrl b{color:#6f9a85}'
 +'.bbq{text-align:center;font-size:14px;font-weight:800;color:#3f6a55}.bbq small{display:block;font-size:11px;color:#7b9a8a;font-weight:700;margin-top:2px}'
 +'.bbbt{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:9px;font:inherit;font-weight:800;font-size:14px;border-radius:12px;border:2px solid #cfe6d9;background:#eef6f1;color:#9bb5a7;cursor:pointer}'
 +'.bbbt.on{background:#c9efdc;border-color:#86b79d;color:#2f6a52;box-shadow:0 2px 0 #86b79d}.bbbt.on:active{transform:translateY(2px);box-shadow:none}'
 +'.bbbt.sel{background:#ffe9a8;border-color:#e6c25a;color:#7a5a10;box-shadow:0 2px 0 #e6c25a}.bbbt.warn{background:#ffe0e0;border-color:#e89a9a;color:#a03a3a;box-shadow:0 2px 0 #e89a9a}'
 +'.bbbt small{font-weight:700;font-size:11px;opacity:.85}'
 +'.bbch{display:flex;gap:8px;margin-top:8px}.bbch .bbbt{margin-top:0;flex:1}'
 +'.bbtb{width:100%;border-collapse:collapse;font-size:13px}.bbtb td{padding:5px 2px;border-bottom:1px dashed #d6eadf;color:#4a6a5a}.bbtb tr:last-child td{border-bottom:0}.bbtb td:first-child{color:#7b9a8a;font-weight:700;width:46%}.bbtb td:last-child{font-weight:800;text-align:right}'
 +'.bbrn{display:flex;gap:6px;margin-top:8px}.bbrn input,.bbin{flex:1;min-width:0;box-sizing:border-box;font:inherit;font-weight:700;padding:7px 9px;border:2px solid #cfe6d9;border-radius:10px;background:#fff;color:#3f6a55}.bbrn .bbbt{width:auto;margin-top:0;padding:7px 12px}'
 +'.bbgf{text-align:center;font-weight:800;color:#3f6a55;font-size:13px}.bbgf .big{font-size:30px;display:block;line-height:1.2}'
 +'#hbb.rdy::after{content:"";position:absolute;top:-4px;right:-4px;width:11px;height:11px;border-radius:50%;background:#ff5a5a;border:2px solid #fff;box-shadow:0 1px 0 rgba(0,0,0,.25)}'
 +'.bbav{border-radius:16px;overflow:hidden;border:2px solid #cfe6d9;line-height:0;cursor:pointer;background:#f6f1de url(data:image/webp;base64,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) center/cover no-repeat}.bbav canvas{width:100%;height:auto;display:block;image-rendering:pixelated}'
 +'.bbfl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}.bbft{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;border-radius:12px;border:2px solid #cfe6d9;background:#fff;font:inherit;color:#4a6a5a;cursor:pointer}'
 +'.bbft.sel{border-color:#e6c25a;background:#fff6d6}.bbft b{font-size:12px}.bbft small{font-size:10.5px;color:#7b9a8a;font-weight:700}.bbft canvas{width:56px;height:72px;image-rendering:pixelated}'
 +'.bbsc,.bbav{position:relative}.bbfxc{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:3;image-rendering:pixelated}'
 +'.bbsay{position:absolute;left:50%;top:6px;transform:translateX(-50%);max-width:92%;box-sizing:border-box;background:#fffdf0;border:2px solid #e6c25a;border-radius:12px;padding:3px 10px;font:800 12px/1.35 Nunito,"Segoe UI",Arial,sans-serif;color:#6b4a10;text-align:center;z-index:4;display:none;pointer-events:none;box-shadow:0 2px 0 rgba(0,0,0,.08)}'
 +'.bbsay.on{display:block;animation:bbsy .25s ease-out}@keyframes bbsy{from{opacity:0;transform:translate(-50%,4px)}to{opacity:1;transform:translate(-50%,0)}}'
 +'.bbpop{position:absolute;right:8px;bottom:8px;display:flex;flex-direction:column;gap:8px;z-index:5;line-height:1}'
 +'.bbpb{width:52px;height:52px;border-radius:50%;border:2px solid #a9d3bc;background:rgba(255,255,255,.93);box-shadow:0 3px 0 #86b79d,0 4px 10px rgba(0,0,0,.15);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;font:inherit;padding:0}'
 +'.bbpb span{font-size:22px;line-height:1}.bbpb small{font-size:9px;font-weight:800;color:#5a7d6c;line-height:1}.bbpb:active{transform:scale(.92);box-shadow:0 1px 0 #86b79d}'
 +'.bbch3 .bbbt{font-size:13px;padding:8px 3px}.bbch3 .bbbt small{font-size:10.5px}';
 document.head.appendChild(css)})();

/* ---------------- GIAO DIỆN ---------------- */
let VIEW='main',SEL={g:'',c:'',n:''},RENN='',RENT=0,CONF=0,CONFT=0,BBDIR=0,BBANI=0,LASTMOOD='';
const isOpen=()=>UI&&$('ui').classList.contains('bbui');
const bar=(id,ic,nm,v,col)=>'<div class="bbrow"><div class="bbrl"><span>'+ic+' '+nm+'</span><b id="'+id+'v">'+Math.round(v)+'%</b></div><div class="bbbar"><i id="'+id+'" style="width:'+v+'%;background:'+col+'"></i></div></div>';
const COL_S='linear-gradient(90deg,#bfe8ff,#6fc3f2)',COL_H='linear-gradient(90deg,#ffe08a,#ffb84d)',COL_F='linear-gradient(90deg,#b5e8d0,#6cc7a3)',COL_X='linear-gradient(90deg,#ffe08a,#ffc24d)';
function show(h,v){const st=$('ui').scrollTop;openUI(h);$('ui').classList.add('bbui');$('ui').scrollTop=st;VIEW=v}
function syncSel(){const i=$('bbnm0');if(i)SEL.n=i.value}
function guard(el){if(!el)return;['keydown','keyup','keypress'].forEach(k=>el.addEventListener(k,e=>e.stopPropagation()))}

function viewAdopt(){
 const b1=(k,v,t)=>'<button class="bbbt'+(SEL[k]==v?' sel':'')+'" onclick="bbSel(\''+k+'\',\''+v+'\')">'+t+'</button>';
 show(head('🍼 Bé bỏng')+'<div class="bbsc">'+cradle('ok')+'</div>'
  +'<div class="bbcard"><div class="bbq">Bé của bạn là</div><div class="bbch">'+b1('g','m','👦 Bé trai')+b1('g','f','👧 Bé gái')+'</div>'
  +'<div class="bbq" style="margin-top:14px">Bạn muốn em bé gọi bạn là<small>Không thể thay đổi sau này</small></div><div class="bbch">'+b1('c','anh','Anh')+b1('c','chi','Chị')+'</div>'
  +'<div class="bbq" style="margin-top:14px">Đặt tên cho bé<small>Tối đa '+BB_NAME_MAX+' ký tự</small></div>'
  +'<div class="bbrn"><input id="bbnm0" class="bbin" maxlength="'+BB_NAME_MAX+'" value="'+esc(SEL.n)+'" placeholder="Tên bé"></div>'
  +'<button class="bbbt on" onclick="bbAdopt()">💝 Nhận nuôi</button></div>','adopt');
 guard($('bbnm0'))}
window.bbSel=(k,v)=>{syncSel();SEL[k]=v;viewAdopt()};
window.bbAdopt=()=>{syncSel();const n=cleanName(SEL.n);
 if(!SEL.g)return toast('👶 Hãy chọn bé trai hoặc bé gái');
 if(!SEL.c)return toast('💬 Hãy chọn bé gọi bạn là Anh hay Chị');
 if(!n)return toast('✏️ Hãy đặt tên cho bé');
 const t=tNow();ST.bb={on:1,g:SEL.g,c:SEL.c,n,ad:t,big:0,exp:0,h:50,f:50,s:100,t,gt:t+BB_GIFT_MS,nf:0,fl:0,pp:-1,own:['warm'],set:'warm'};
 save();toast('💝 Bạn đã nhận nuôi '+n+'!\nBé sẽ gọi bạn là '+(SEL.c=='chi'?'Chị':'Anh'));bbUI()};

function charPaint(cv,b,d,mv,sc,lift){const g=cv.getContext('2d'),t=performance.now()/1000;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;
 const ms=msGet(b.set);
 if(ms.spr){const im=sprImg(ms.spr);if(im){const w=im.naturalWidth*sc,h=im.naturalHeight*sc,x=Math.round((cv.width-w)/2),y=cv.height-h-2-(lift|0)-(mv&&Math.floor(t*9)%2?sc:0);g.save();if(d==3){g.translate(cv.width,0);g.scale(-1,1)}g.drawImage(im,x,y,w,h);g.restore()}return}
 g.save();g.translate(0,-(lift|0));g.scale(sc,sc);drawAv(g,(cv.width/sc-20)/2,cv.height/sc-34,avObj(b,d,mv,t));g.restore()}
function paintHero(){const cv=$('bbav'),b=B();if(!cv||!b)return;const mv=performance.now()<BBANI;charPaint(cv,b,[0,3,1,2][BBDIR%4],mv,3,mv?0:Math.round(Math.abs(Math.sin(performance.now()/1000*3.4))*3))}   // đứng yên: nhún nhẹ
let HLOOP=0;function heroLoop(){const cv=$('bbav');if(!cv||!UI){HLOOP=0;return}paintHero();requestAnimationFrame(heroLoop)}
function startHero(){if(!HLOOP){HLOOP=1;requestAnimationFrame(heroLoop)}}
window.bbTurn=()=>{BBDIR=(BBDIR+1)%4;BBANI=performance.now()+700;startHero()};
function paintFashion(){document.querySelectorAll('canvas.bbfc').forEach(c=>{const b=B();if(!b)return;const m=MINISETS[+c.dataset.i];if(!m)return;
 charPaint(c,Object.assign({},b,{set:m.id}),0,0,2)})}

function viewMain(){const b=B();if(!b)return viewAdopt();
 const c=bars(b),md=mood(b),ready=tNow()>=b.gt,nm=esc(b.n);LASTMOOD=md;
 const ACT='<div class="bbpop">'+[['f','🍼','Cho ăn',BB_COST],['p','🎈','Chơi cùng bé',BB_COST],['b','🛁','Tắm cho bé',BB_BATH]].map(q=>'<button class="bbpb" title="'+q[2]+'" onclick="event.stopPropagation();bbAct(\''+q[0]+'\')"><span>'+q[1]+'</span><small>'+q[3]+'🪙</small></button>').join('')+'</div>';
 const scene=b.big?'<div class="bbav" onclick="bbTurn()"><canvas id="bbav" width="150" height="120"></canvas><div class="bbsay" id="bbsay"></div>'+ACT+'</div><div class="mut" style="text-align:center;margin:4px 0 0">👆 Chạm vào bé để xoay</div>'
  :'<div class="bbsc">'+cradle(md)+'<div class="bbsay" id="bbsay"></div>'+ACT+'</div>';
 let h=head('🍼 Bé bỏng')+scene
 +'<div class="bbcard"><div class="bbnm"><span>'+(b.g=='f'?'👧 ':'👦 ')+nm+'</span><small id="bbst">'+statusTxt(b)+'</small></div>'
 +(b.big?'':'<div class="bbrow"><div class="bbrl"><span>⭐ EXP</span><b id="bbxv">'+b.exp+' / '+BB_EXP+'</b></div><div class="bbbar"><i id="bbx" style="width:'+b.exp/BB_EXP*100+'%;background:'+COL_X+'"></i></div></div>'
   +'<div class="bbq" style="margin-top:6px;font-size:11px;color:#7b9a8a;font-weight:700">Đủ '+BB_EXP+' EXP bé sẽ lớn</div>')
 +bar('bbh','😊','Vui vẻ',c.h,COL_H)+bar('bbf','🍼','No bụng',c.f,COL_F)+bar('bbs','🫧','Sạch sẽ',c.s,COL_S)+'</div>'
 +'<div class="bbcard">';
 if(!b.big)h+='<button class="bbbt'+(CONF?' warn':' on')+'" onclick="bbGrowNow()">'+(CONF?'⚠️ Bấm lần nữa để xác nhận (−'+BB_DIA_GROW+' 💎)':'💎 Cho bé lớn ngay ('+BB_DIA_GROW+' 💎)')+'</button>';
 else h+='<button class="bbbt on" onclick="bbFollow()">'+(b.fl?'🏠 Cho bé về nhà':'🚶 Cho Bé bỏng đi theo')+'</button>'
   +(b.fl?'':'<div class="mut" style="text-align:center;margin:4px 0 0">Pet sẽ được cất vào Túi — chỉ có thể 1 pet hoặc 1 Bé bỏng đi theo.</div>');
 h+='</div>'
 +'<div class="bbcard"><div class="bbgf"><span class="big">'+(ready?'🎁':'📦')+'</span>'
 +(ready?'Bé có quà cho '+(b.c=='chi'?'chị':'anh')+'!</div><button class="bbbt on" onclick="bbClaim()">🎁 Nhận quà</button>'
        :'Quà tiếp theo sau <b id="bbgt">'+fmtLeft(b.gt-tNow())+'</b></div>')+'</div>'
 +'<div class="bbcard"><table class="bbtb"><tr><td>Tên bé</td><td id="bbtn">'+nm+'</td></tr><tr><td>Ngày nhận nuôi</td><td>'+fmtDay(b.ad)+'</td></tr>'
 +'<tr><td>Giới tính</td><td>'+(b.g=='f'?'Bé gái':'Bé trai')+'</td></tr><tr><td>Bé gọi bạn là</td><td>'+(b.c=='chi'?'Chị':'Anh')+'</td></tr>'
 +'<tr><td>Giai đoạn</td><td>'+(b.big?'🌟 Đã lớn':'🍼 Em bé')+'</td></tr></table>'
 +'<div class="bbrn"><input id="bbrn" maxlength="'+BB_NAME_MAX+'" value="'+esc(RENN||b.n)+'" placeholder="Tên mới">'+(RENN?'':'<button class="bbbt on" onclick="bbRename()">✏️ Đổi tên</button>')+'</div>'
 +(RENN?'<div class="bbch"><button class="bbbt warn" onclick="bbRename()">⚠️ Xác nhận đổi tên (−'+BB_DIA_NAME+' 💎)</button><button class="bbbt on" style="flex:none;width:30%" onclick="bbRenCancel()">Hủy</button></div>':'')+'</div>'
 +'<button class="bbbt on" onclick="bbFashion()">👗 Thời trang</button>';
 show(h,'main');guard($('bbrn'));if(b.big){paintHero();startHero()}paintSay();bathFx()}

window.bbUI=()=>{const b=B();CONF=0;RENN='';if(!b){SEL={g:'',c:'',n:''};return viewAdopt()}viewMain()};
function refresh(){if(!isOpen())return;if(VIEW=='fash')viewFashion();else if(VIEW=='main')viewMain()}

window.bbAct=k=>{const b=B();if(!b)return;settle(b);if(k=='b')return bbBath(b);const feed=k=='f';
 if((feed?b.f:b.h)>BB_ALLOW){save();return toast(feed?'🍼 '+b.n+' còn no, chút nữa hãy cho ăn nha!':'🎈 '+b.n+' đang vui lắm, chút nữa hãy chơi nha!')}
 if(ST.xu<BB_COST)return toast('🪙 Chưa đủ xu — cần '+BB_COST+' xu');
 ST.xu-=BB_COST;xuUp();if(feed)b.f=Math.min(100,b.f+BB_FILL);else b.h=Math.min(100,b.h+BB_FILL);
 let tx=feed?'🍼 '+b.n+' ăn no rồi!':'🎈 '+b.n+' chơi vui quá!';sayNow(feed?'feed':'play');
 if(!b.big){b.exp=Math.min(BB_EXP,b.exp+BB_XP);tx+=' +'+BB_XP+' EXP';if(b.exp>=BB_EXP){b.big=1;b.nf=0;tx+='\n🎉 '+b.n+' đã lớn rồi! Giờ bé mặc đồ và đi theo bạn được nè'}}
 save();toast(tx);refresh()};
window.bbGrowNow=()=>{const b=B();if(!b||b.big)return;
 if(!CONF){if((ST.dia|0)<BB_DIA_GROW)return toast('💎 Chưa đủ kim cương — cần '+BB_DIA_GROW+', bạn có '+(ST.dia|0));CONF=1;clearTimeout(CONFT);CONFT=setTimeout(()=>{CONF=0;if(isOpen()&&VIEW=='main')viewMain()},4000);return viewMain()}
 clearTimeout(CONFT);CONF=0;if((ST.dia|0)<BB_DIA_GROW)return toast('💎 Chưa đủ kim cương — cần '+BB_DIA_GROW+', bạn có '+(ST.dia|0));
 ST.dia-=BB_DIA_GROW;xuUp();settle(b);b.big=1;b.exp=BB_EXP;save();toast('🎉 '+b.n+' đã lớn rồi! (−'+BB_DIA_GROW+' 💎)');refresh()};
window.bbRenCancel=()=>{RENN='';clearTimeout(RENT);viewMain()};
window.bbRename=()=>{const b=B(),i=$('bbrn');if(!b||!i)return;const n=cleanName(i.value);
 if(!n)return toast('✏️ Tên không được để trống');if(n==b.n){RENN='';return toast('✏️ Đó đang là tên của bé rồi')}
 if((ST.dia|0)<BB_DIA_NAME)return toast('💎 Chưa đủ kim cương — cần '+BB_DIA_NAME+', bạn có '+(ST.dia|0));
 if(RENN!=n){RENN=n;clearTimeout(RENT);RENT=setTimeout(()=>{RENN='';if(isOpen()&&VIEW=='main'&&!(document.activeElement&&document.activeElement.tagName=='INPUT'))viewMain()},8000);return viewMain()}
 RENN='';clearTimeout(RENT);ST.dia-=BB_DIA_NAME;xuUp();const old=b.n;b.n=n;save();toast('✏️ Đã đổi tên bé: '+old+' → '+n+' (−'+BB_DIA_NAME+' 💎)');refresh()};

window.bbClaim=()=>{const b=B();if(!b)return;if(tNow()<b.gt)return toast('📦 Chưa tới giờ nhận quà');
 let u=Math.random()*BB_GIFTS.reduce((a,x)=>a+x[1],0),k=BB_GIFTS[0][0];for(const [n,w] of BB_GIFTS){u-=w;if(u<0){k=n;break}}
 let tx;
 if(k=='dia'){ST.dia=(ST.dia|0)+1;tx='+1 💎 kim cương (quà hiếm!)'}
 else if(k=='ti'){tiEnsure().tk++;tx='+1 🎟️ Vé Tí Nị (quà hiếm!)'}
 else if(k=='tk'){ST.tk=(ST.tk|0)+BB_TK;tx='+'+BB_TK+' 🎟️ vé quay số'}
 else{const x=BB_XU[0]+Math.floor(Math.random()*(BB_XU[1]-BB_XU[0]+1));ST.xu+=x;tx='+'+x+' 🪙 Xu'}
 b.gt=tNow()+BB_GIFT_MS;b.nf=0;xuUp();save();toast('🎁 '+b.n+' tặng bạn quà!\n'+tx);refresh()};

window.bbFollow=()=>{const b=B();if(!b)return;if(!b.big)return toast('🍼 Bé còn nhỏ, lớn rồi mới đi theo bạn được nha');
 if(b.fl){b.fl=0;const p=b.pp|0;if(p>=0&&ST.own.p.includes(p)){ST.av.p=p;petReset()}b.pp=-1;save();toast('🏠 '+b.n+' về nhà nghỉ');return refresh()}
 b.pp=ST.av.p>=0?ST.av.p:-1;ST.av.p=-1;b.fl=1;petReset();save();
 toast('🚶 '+b.n+' đang đi theo bạn'+(b.pp>=0?'\nPet đã được cất vào Túi':''));refresh()};

/* ---------- Thời trang ---------- */
function viewFashion(){const b=B();if(!b)return viewAdopt();
 let h='<div class="uh"><span><button class="b x" onclick="bbUI()">‹ Bé bỏng</button> 👗 Thời trang</span><button class="b x" onclick="closeUI()">X</button></div>'
 +(b.big?'<div class="bbav" onclick="bbTurn()"><canvas id="bbav" width="150" height="120"></canvas></div><div class="mut" style="text-align:center;margin:4px 0 0">👆 Chạm vào bé để xoay</div>'
        :'<div class="bbcard" style="text-align:center;font-weight:800;color:#7b9a8a;margin-top:0">🔒 Bé lớn rồi mới thay đồ được nha<div class="mut" style="margin:4px 0 0">Bạn vẫn có thể xem trước các Miniset bên dưới.</div></div>')
 +'<div class="mut" style="text-align:center">Bé chỉ mặc được cả set (gồm cả tóc). Bạn có 🪙 '+fmtXu(ST.xu)+' • 💎 '+(ST.dia|0)+'</div><div class="bbfl">';
 MINISETS.forEach((m,i)=>{if(m.g&&m.g!=b.g)return;const own=b.own.includes(m.id),on=b.set==m.id,pr=m.dia?'💎 '+m.dia:m.xu?'🪙 '+m.xu:'Miễn phí';
  h+='<button class="bbft'+(on?' sel':'')+'" onclick="bbSetPick('+i+')"><canvas class="bbfc" data-i="'+i+'" width="56" height="72"></canvas><b>'+esc(m.n)+'</b><small>'+(on?'✅ Đang mặc':own?'Đã có':pr)+'</small></button>'});
 h+='</div><div class="mut" style="text-align:center;margin-top:8px">✨ Sẽ có thêm Miniset mới, ghé lại sau nhé!</div>';
 show(h,'fash');paintFashion();if(b.big){paintHero();startHero()}}
window.bbFashion=()=>viewFashion();
window.bbSetPick=i=>{const b=B(),m=MINISETS[i];if(!b||!m)return;
 if(m.g&&m.g!=b.g)return toast('🔒 Set này dành cho '+(m.g=='f'?'bé gái':'bé trai'));
 if(!b.own.includes(m.id)){const dia=m.dia|0,xu=m.xu|0;
  if(dia&&(ST.dia|0)<dia)return toast('💎 Chưa đủ kim cương — cần '+dia+', bạn có '+(ST.dia|0));
  if(xu&&ST.xu<xu)return toast('🪙 Chưa đủ xu — cần '+xu+' xu');
  ST.dia=(ST.dia|0)-dia;ST.xu-=xu;xuUp();b.own.push(m.id);toast('🛍️ Đã mua '+m.n+'!')}
 if(!b.big){save();return viewFashion()}
 b.set=m.id;save();toast('👗 '+b.n+' đã mặc '+m.n);viewFashion()};


/* ---------- 🧸 SHOP MINISET (Phố xá, chỗ Hiệu thuốc cũ — pho-map.js gọi bbShop()) ---------- */
let SHSEL=-1;
function shopList(){return MINISETS.map((m,i)=>[m,i]).filter(x=>x[0].shop)}
function paintShop(){const b=B();if(!b)return;document.querySelectorAll('canvas.bbsc2').forEach(c=>{const m=MINISETS[+c.dataset.i];if(m)charPaint(c,Object.assign({},b,{set:m.id,g:m.g||b.g}),0,0,2)})}
window.bbShop=()=>{const b=B();
 if(!b)return show(head('🧸 Shop Miniset')+'<div class="bbcard" style="text-align:center;font-weight:800;color:#7b9a8a">Bạn chưa nhận nuôi Bé bỏng nè<div class="mut" style="margin:6px 0 0">Bấm nút 🍼 Bé bỏng để nhận nuôi, rồi quay lại mua Miniset cho bé nhé!</div></div>','shop');
 const L=shopList(),sel=L.find(x=>x[1]==SHSEL);let h=head('🧸 Shop Miniset')+'<div class="mut" style="text-align:center">Set mua xong nằm trong <b>👗 Thời trang</b> của Bé bỏng. Bạn có 🪙 '+fmtXu(ST.xu)+'</div><div class="bbfl">';
 L.forEach(([m,i])=>{const own=b.own.includes(m.id),lock=m.g&&m.g!=b.g;
  h+='<button class="bbft'+(SHSEL==i?' sel':'')+'" style="'+(lock?'opacity:.6':'')+'" onclick="bbShopSel('+i+')"><canvas class="bbsc2" data-i="'+i+'" width="56" height="72"></canvas><b>'+esc(m.n)+'</b><small>'+(m.g=='f'?'👧 Bé gái':m.g=='m'?'👦 Bé trai':'')+'</small><small>'+(own?'✅ Đã có':lock?'🔒 Không hợp bé':'🪙 '+m.xu)+'</small></button>'});
 h+='</div>';
 if(sel){const m=sel[0],own=b.own.includes(m.id),lock=m.g&&m.g!=b.g;
  h+=own?'<button class="bbbt" disabled>✅ Bé đã có set này</button>':lock?'<button class="bbbt" disabled>🔒 Set này dành cho '+(m.g=='f'?'bé gái':'bé trai')+', bé của bạn là '+(b.g=='f'?'bé gái':'bé trai')+'</button>'
   :'<button class="bbbt on" onclick="bbShopBuy('+sel[1]+')">🛍️ Mua — '+m.xu+' Xu</button>'}
 else h+='<div class="mut" style="text-align:center;margin-top:8px">👆 Chọn 1 set để mua</div>';
 show(h,'shop');paintShop()};
window.bbShopSel=i=>{SHSEL=i;bbShop()};
window.bbShopBuy=i=>{const b=B(),m=MINISETS[i];if(!b||!m||!m.shop)return;
 if(m.g&&m.g!=b.g)return toast('🔒 Set này dành cho '+(m.g=='f'?'bé gái':'bé trai'));
 if(b.own.includes(m.id))return toast('✅ Bé đã có set này rồi');
 if(ST.xu<m.xu)return toast('🪙 Chưa đủ xu — cần '+m.xu+' xu');
 ST.xu-=m.xu;xuUp();b.own.push(m.id);save();toast('🛍️ Đã mua '+m.n+'!\nSet nằm trong 👗 Thời trang của '+b.n);bbShop()};


/* ---------------- 🛁 TẮM + BÓNG NƯỚC ---------------- */
let BATH=null,SAY=null,NEXTSAY=0,NEXTWORLD=0,LASTM='';
const hs=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)};
/* Bóng nước: cùng kiểu pixel với bóng nước của Cánh Đại dương (viền xanh nhạt + chấm sáng). t = giây từ lúc bắt đầu (0..3).
   o={cx,cy,hw,rise,k}: tâm, nửa bề rộng, độ cao bay lên, k = kích thước 1 "pixel". Mỗi bóng sinh ra ở 0–1.2s, sống 1.3–1.8s → hết trước 3s. */
function bubbleField(R,t,o){const N=44,k=o.k||1;
 for(let i=0;i<N;i++){const st=hs(i+1)*1.2,L=1.3+hs(i+7)*.5,age=t-st;if(age<0||age>L)continue;const p=age/L,
  a=Math.min(1,p/.15,(1-p)/.35)*.95,big=i%4==0,mid=i%4==1||i%4==2;
  const x=Math.round(o.cx+(hs(i+3)*2-1)*o.hw+Math.sin(p*6+i*1.7)*2*k),y=Math.round(o.cy-p*o.rise*(.55+hs(i+9)*.45)-hs(i+5)*4*k);
  const ring='rgba(176,228,255,'+a.toFixed(2)+')',hi='rgba(255,255,255,'+a.toFixed(2)+')',fl='rgba(200,240,255,'+(a*.3).toFixed(2)+')';
  const r=(c,dx,dy,w,h)=>R(c,x+dx*k,y+dy*k,w*k,h*k);
  if(big){r(fl,-2,-2,5,5);r(ring,-1,-3,3,1);r(ring,-1,3,3,1);r(ring,-3,-1,1,3);r(ring,3,-1,1,3);r(ring,-2,-2,1,1);r(ring,2,-2,1,1);r(ring,-2,2,1,1);r(ring,2,2,1,1);r(hi,-1,-1,1,1);r('rgba(255,255,255,'+(a*.6).toFixed(2)+')',1,1,1,1)}
  else if(mid){r(fl,-1,-1,3,3);r(ring,-1,-2,3,1);r(ring,-1,2,3,1);r(ring,-2,-1,1,3);r(ring,2,-1,1,3);r(hi,-1,-1,1,1)}
  else{r(ring,0,-1,1,1);r(ring,-1,0,1,1);r(ring,1,0,1,1);r(ring,0,1,1,1);r(hi,0,0,1,1)}}}
/* lớp phủ bóng nước trên khung bé trong panel */
function bathFx(){if(!BATH||performance.now()>=BATH.until){const o=document.getElementById('bbfx');if(o)o.remove();return}
 if(BATH.raf)return;BATH.raf=1;const loop=()=>{if(!BATH||performance.now()>=BATH.until){BATH&&(BATH.raf=0);const o=document.getElementById('bbfx');if(o)o.remove();return}
  const host=document.querySelector('#ui .bbsc,#ui .bbav');let c=document.getElementById('bbfx');
  if(host&&UI&&$('ui').classList.contains('bbui')){const W=host.clientWidth,H=host.clientHeight;
   if(!c||c.parentNode!==host){if(c)c.remove();c=document.createElement('canvas');c.id='bbfx';c.className='bbfxc';host.appendChild(c)}
   if(c.width!=W||c.height!=H){c.width=W;c.height=H}
   const g=c.getContext('2d'),k=Math.max(2,Math.round(W/110));g.clearRect(0,0,W,H);
   bubbleField((col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w,h)},(performance.now()-BATH.t0)/1000,{cx:W/2,cy:H*.95,hw:W*.42,rise:H*.85,k})}
  else if(c)c.remove();
  requestAnimationFrame(loop)};requestAnimationFrame(loop)}
function bbBath(b){
 if(b.s>BB_ALLOW_BATH){save();return toast('🛁 '+b.n+' còn sạch bong, chút nữa hãy tắm nha!')}
 if(ST.xu<BB_BATH)return toast('🪙 Chưa đủ xu — cần '+BB_BATH+' xu');
 ST.xu-=BB_BATH;xuUp();b.s=100;let tx='🛁 '+b.n+' tắm xong sạch bong, thơm tho!';
 if(!b.big&&BB_XP_BATH){b.exp=Math.min(BB_EXP,b.exp+BB_XP_BATH);tx+=' +'+BB_XP_BATH+' EXP';if(b.exp>=BB_EXP){b.big=1;b.nf=0;tx+='\n🎉 '+b.n+' đã lớn rồi!'}}
 BATH={t0:performance.now(),until:performance.now()+BB_BATH_MS,raf:0};
 save();toast(tx);sayNow('bath');refresh();bathFx()}

/* ---------------- 💬 THOẠI: "Anh/Chị ơi, em ..." tùy ngữ cảnh ---------------- */
function pickLine(b,ctx){const A=b.c=='chi'?'Chị':'Anh',a=A.toLowerCase(),c=bars(b),h=new Date().getHours(),pk=L=>L[Math.floor(Math.random()*L.length)];
 if(ctx=='bath')return pk([A+' ơi, em sạch bong thơm tho rồi nè! ✨','Tắm xong mát quá, cảm ơn '+a+' nha!',A+' ơi, em thơm chưa? Hihi']);
 if(ctx=='feed')return pk(['Em no căng bụng rồi, cảm ơn '+a+' nha!',A+' ơi, đồ ăn ngon quá trời!','Ợ... em no rồi '+a+' ơi 🍼']);
 if(ctx=='play')return pk([A+' ơi, chơi vui quá trời!','Em thích chơi với '+a+' nhất!',A+' ơi, mai mình chơi nữa nha!']);
 if(ctx=='far')return pk([A+' ơi, đợi em với!',A+' ơi, đi chậm thôi, em theo không kịp!']);
 if(c.f<30)return pk([A+' ơi, em đói bụng quá...','Bụng em kêu ọc ọc rồi, cho em ăn đi '+a+' ơi 🍼','Em đói rồi, '+a+' cho em ăn nha?']);
 if(c.s<30)return pk([A+' ơi, người em bẩn quá, tắm cho em nha 🛁','Em lấm lem hết rồi '+a+' ơi, em muốn tắm!',A+' ơi, em thấy ngứa ngứa, tắm cho em đi']);
 if(c.h<30)return pk([A+' ơi, chơi với em đi mà...','Em buồn quá, '+a+' chơi với em nha 🎈',A+' ơi, em chán quá à']);
 if(tNow()>=b.gt)return pk([A+' ơi, em có quà cho '+a+' nè! 🎁','Em giữ quà cho '+a+' nãy giờ đó, nhận đi nè!']);
 if(h>=22||h<5)return pk([A+' ơi, em buồn ngủ quá...','Khuya rồi, '+a+' đi ngủ sớm nha, em cũng díp mắt rồi 😴']);
 if(h>=5&&h<10)return pk(['Chào buổi sáng '+a+' ơi!',A+' ơi, sáng nay em khỏe lắm!']);
 if(h>=11&&h<14)return pk([A+' ơi, trưa rồi, mình ăn gì nhỉ?','Em thấy buồn ngủ trưa rồi nè '+a+' ơi']);
 if(h>=18&&h<22)return pk([A+' ơi, tối rồi, trời đẹp ghê!','Em thích đi chơi buổi tối với '+a+'!']);
 return pk([A+' ơi, hôm nay vui ghê!','Em thương '+a+' nhất trên đời!',A+' ơi, mình đi đâu nữa nè?','Em theo '+a+' hoài luôn nha!',A+' ơi, em khỏe re à!','Hihi, em ở đây với '+a+' nè'])}
function paintSay(){const e=document.getElementById('bbsay');if(!e)return;const on=SAY&&performance.now()<SAY.until;e.textContent=on?SAY.txt:'';e.classList.toggle('on',!!on)}
function sayNow(ctx){const b=B();if(!b)return;SAY={txt:pickLine(b,ctx),until:performance.now()+4500,w:0};NEXTSAY=performance.now()+9000+Math.random()*7000;paintSay()}

/* ---------------- NHỊP CẬP NHẬT (gọi mỗi khung hình từ update() của game) ---------------- */
let acc=0;
window.bbTick=dt=>{acc+=dt;if(acc<1)return;acc=0;const b=B();if(!b)return;
 // thoại: trong panel Bé bỏng thì nói bình thường; ngoài map CHỈ nói khi thanh đói/chơi/tắm thấp (<30%)
 const flw=!!(b.big&&b.fl),open=isOpen()&&VIEW=='main',now=performance.now();
 if(open){const md=mood(b);
  if(md!=LASTM){const was=LASTM;LASTM=md;if(was&&md!='ok'&&(!SAY||now>=SAY.until)){SAY={txt:pickLine(b),until:now+4500,w:0};NEXTSAY=now+9000+Math.random()*7000}}
  else if(now>=NEXTSAY){SAY={txt:pickLine(b),until:now+4500,w:0};NEXTSAY=now+9000+Math.random()*7000}
  paintSay()}
 else if(flw){const c=bars(b);
  if(c.f<30||c.s<30||c.h<30){if(now>=NEXTWORLD){SAY={txt:pickLine(b),until:now+4500,w:1};NEXTWORLD=now+30000+Math.random()*15000}}
  else NEXTWORLD=0}
 // đang dẫn pet đi theo thì Bé bỏng tự về nhà (chỉ 1 pet HOẶC 1 bé)
 if(b.fl&&ST.av.p>=0){b.fl=0;b.pp=-1;save();toast('🏠 '+b.n+' về nhà vì bạn dẫn pet đi theo')}
 const ready=tNow()>=b.gt,hb=$('hbb');if(hb)hb.classList.toggle('rdy',ready);
 if(ready&&!b.nf){b.nf=1;save();toast('🎁 '+b.n+' có quà cho bạn! Mở 🍼 Bé bỏng để nhận')}
 if(!isOpen()||VIEW!='main')return;
 const c=bars(b),set=(id,v)=>{const e=$(id),t=$(id+'v');if(e)e.style.width=v+'%';if(t)t.textContent=Math.round(v)+'%'};
 set('bbh',c.h);set('bbf',c.f);set('bbs',c.s);const st=$('bbst');if(st)st.textContent=statusTxt(b);
 const g=$('bbgt');if(g){if(ready){if(!(document.activeElement&&document.activeElement.tagName=='INPUT'))viewMain()}else g.textContent=fmtLeft(b.gt-tNow())}
 if(mood(b)!=LASTMOOD&&!b.big&&!(document.activeElement&&document.activeElement.tagName=='INPUT'))viewMain()};
setTimeout(()=>{try{bbTick(1)}catch(e){}},1500);
})();
