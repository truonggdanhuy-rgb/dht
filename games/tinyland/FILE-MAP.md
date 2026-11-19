# FILE-MAP — bản đồ game Tinyland (tạo tự động, đọc cái này thay vì đi tìm file)

## ⛔ File NẶNG — KHÔNG cat / view / grep thẳng (có dòng ảnh base64 hàng trăm KB, làm đơ và tốn token)
- `frames.js` (951 KB, 1 dòng) — khung avatar dạng ảnh. KHÔNG đụng.
- `idcard.js` (390 KB) — ảnh thẻ/logo. KHÔNG đụng.
- `index.html` dòng 3716 (373 KB, ảnh bản đồ làng base64) — nhảy qua dòng này.
- `baby.js` dòng ~10520 và ~10667 có chuỗi base64 dài.
- Khi grep luôn dùng: `grep -n -o -E '.{0,60}TỪ_KHÓA.{0,60}' --exclude=frames.js --exclude=idcard.js *.js` (giới hạn độ dài dòng).

## Thứ tự nạp script trong index.html (cuối file, từ trên xuống)
outfits.js, congso.js, aulac.js, aulac2.js, park-map.js, pho-map.js, broomkit.js, circus.js, sea-map.js, fishing.js, park-online.js, frames.js, idcard.js, snow-village.js, food-icons.js, actions2.js, nhuy.js, newitems.js, newitems2.js, baby.js, newitems3.js, newitems4.js, skate.js, balo.js, duoi.js, pajama.js, vitvang.js, vothuong.js, alo.js, winter.js, clown.js, hanbok.js, skater.js, batuoc.js, hauvuong.js, cunboi.js, thongbao.js, gianhang.js, perso.js, xdeer.js, phuthuy.js, tetmount.js, lowfx.js, pinkcool.js, miku.js, wintermage.js, nhanvien.js, tieuacma.js, hdkit.js, hdface.js, boyboy.js

(Món mới = file mới, thêm 1 dòng `<script src="tenfile.js?v=..."></script>` vào CUỐI danh sách, sau boyboy.js.)

## Danh mục các file .js (tên – KB – việc chính)
| File | KB | Nội dung |
|---|---|---|
| actions2.js | 18 | TINYLAND — HÀNH ĐỘNG MỚI (file riêng, không đụng vào code cũ) |
| alo.js | 12 | ALO.JS — Đồ mới (lấy ý tưởng Tây Bắc Việt Nam): |
| aulac.js | 29 | TINYLAND — Mascot "CHIẾN BINH ÂU LẠC" (Nam / Nữ) + Thú cưỡi "CÁ CHÉP" + Shop Tiên Nữ |
| aulac2.js | 30 | aulac2.js — Chiến binh Âu Lạc vẽ lại độ phân giải gấp đôi. Nạp SAU aulac.js; lỗi thì tự dùng bản cũ. */ |
| baby.js | 66 | 🍼 BÉ BỎNG — HỆ THỐNG BABY HOÀN CHỈNH (file riêng: games/tinyland/baby.js) |
| balo.js | 5 | BALO.JS — 🎒 3 BALO (phụ kiện đeo sau lưng, hoạt động giống CÁNH): |
| batuoc.js | 15 | BATUOC.JS — Mascot BÁ TƯỚC ĐEN (Nam / Nữ) — bán ở Shop kim cương 💎15 / set |
| boyboy.js | 14 | BOYBOY.JS — 🖤 SET BOYBOY (Nam) + TÓC BOYBOY — vẽ ĐỒ HỌA CAO (K=4) theo bộ máy hdkit.js |
| broomkit.js | 13 | broomkit.js — 🧹 KIT CHỔI BAY (thú cưỡi bay lơ lửng, nhân vật NGỒI trên chổi) |
| circus.js | 61 | XE HỀ XIẾC — đỗ ở vỉa hè dưới, cạnh ngõ vào PHỐ XÁ |
| clown.js | 8 | CLOWN.JS — 🤡 Mascot HỀ QUÁI ĐẢN (1 set chung, không phân nam/nữ) |
| congso.js | 4 | TINYLAND — CÔNG SỞ NAM / CÔNG SỞ NỮ (vẽ lại) — bán ở Shop Phố xá |
| cunboi.js | 6 | TINYLAND — PET MỚI: 🐶 CÚN BƠI LỘI — 🪙 10.000 Xu, bán ở Shop Phố xá → tab 🐾 Pet |
| duoi.js | 8 | DUOI.JS — 🦊 2 ĐUÔI HỒ LY (phụ kiện đeo lưng dưới, hoạt động giống CÁNH / BALO): |
| fishing.js | 37 | CÂU QUÁI VẬT (Biển) |
| food-icons.js | 14 | TINYLAND — Icon vẽ SVG cho các món nấu từ máy chế biến (thay emoji dùng chung). |
| frames.js ⛔ | 929 |  |
| gianhang.js | 13 | GIAN HÀNG NGƯỜI CHƠI — Tinyland |
| girlkho.js | 7 | GIRLKHO.JS — 👓🎀 Mascot GIRL KHỜ (Tiệm Chú Hề: 2.000 Xu + 400 Xu quái vật + 5 Kim cương) |
| hanbok.js | 10 | HANBOK.JS — 🧧 Mascot HANBOK TẾT RẮN (Nam / Nữ) — 2 set, THÂN GIỐNG HỆT NHAU, chỉ khác phần ĐẦU |
| hauvuong.js | 17 | HAUVUONG.JS — Mascot MỸ HẦU VƯƠNG (Tôn Ngộ Không) — bán ở Shop kim cương 💎15 (cùng giá set Ma đồng giáng thế / |
| hdface.js | 21 | HDFACE.JS — BIỂU CẢM HD (vẽ độ phân giải cao K=4) cho mặt mặc định + biểu cảm 1..7 và 9 |
| hdkit.js | 5 | HDKIT.JS — BỘ MÁY VẼ "ĐỒ HỌA CAO" (K=4) cho set / mascot của tinyland |
| idcard.js ⛔ | 380 | ===== Căn cước Tinyland (thẻ thông tin cá nhân) ===== |
| lowfx.js | 2 | LOWFX.JS — Tự giảm đồ họa cho máy yếu (Phố xá, Lễ hội... bị lag) |
| mau-hd-mascot.js | 1 | MẪU MASCOT HD (nhìn trước) — copy file này làm điểm xuất phát cho set mới. Cần hdkit.js nạp TRƯỚC. |
| miku.js | 8 | miku.js — 🎀 MIKU CÁ TÍNH: Set (1.000 Xu) + Tóc (2.500 Xu), bán ở Shop Phố xá (Tiệm may: tab Set / tab Tóc & mũ |
| newitems.js | 19 | NEWITEMS.JS — Cánh (phụ kiện đeo lưng) + Xe bí ngô (thú cưỡi), bán ở Shop kim cương 💎 |
| newitems2.js | 41 | NEWITEMS2.JS — Đồ mới: |
| newitems3.js | 15 | NEWITEMS3.JS — Đồ mới: |
| newitems4.js | 7 | NEWITEMS4.JS — Đồ mới: |
| nhanvien.js | 20 | NHANVIEN.JS — 🏨 NHÂN VIÊN KHÁCH SẠN: Set + Tóc (chỉ có bản Nữ) |
| nhuy.js | 6 | TINYLAND — HÀNH ĐỘNG MỚI: 🪄 GẬY NHƯ Ý — 💎 10 |
| outfits.js | 51 | TINYLAND — Đồ mới: Hoodie, Áo dài, Bà ba, Tứ thân + Tóc & Khăn & Nón quai thao |
| pajama.js | 15 | PAJAMA.JS — Đồ mới: |
| park-map.js | 67 | CÔNG VIÊN — map mới (vẽ pixel-art bằng canvas, dựng 1 lần khi vào lần đầu) |
| park-online.js | 43 | CÔNG VIÊN ONLINE — Supabase Realtime (không cần tạo bảng) |
| perso.js | 36 | PERSO.JS — Thái tử Ba Tư + Thẻ cuốc + Quyền trượng Thủy Thần (Tinyland) |
| pho-map.js | 109 | PHỐ XÁ — map online thứ 2 (dùng chung hệ thống mạng của Công viên) |
| phuthuy.js | 11 | PHUTHUY.JS — 🔮 MASCOT PHÙ THỦY MỘNG MƠ (1 set chung, NAM + NỮ đều mặc được) |
| pinkcool.js | 19 | PINKCOOL.JS — 🎀 BỘ PINKCOOL: Set Nữ / Set Nam + Tóc Nữ / Tóc Nam (4 món) |
| sea-map.js | 63 | BIỂN — map online thứ 3 (dùng chung hệ thống mạng với Công viên / Phố xá) |
| skate.js | 7 | SKATE.JS — 🛹 VÁN TRƯỢT (thú cưỡi, nhân vật ĐỨNG trên ván). Ván GỐC = "Ván trượt cam". |
| skater.js | 11 | SKATER.JS — 🛹 Mascot SKATER PHỐ (Nam / Nữ) — 2 set, THÂN GIỐNG HỆT NHAU, chỉ khác phần ĐẦU |
| snow-village.js | 35 | LÀNG TUYẾT — mở rộng ngang (640×432) |
| tetmount.js | 25 | TETMOUNT.JS — 🌸 Thú cưỡi "Bệ Xuân Tết" (cây mai + đào, hũ lộc, bánh chưng, nén vàng) |
| thongbao.js | 13 | THONGBAO.JS — 🔔 BẢNG THÔNG BÁO do ADMIN đăng (cả server đều thấy) |
| tieuacma.js | 21 | TIEUACMA.JS — 😈 MASCOT TIỂU ÁC MA (Nam / Nữ) — bán ở TIỆM CHÚ HỀ (circus.js → CL_ITEMS) |
| vitvang.js | 8 | VITVANG.JS — 🦆 SET VỊT VÀNG (nam/nữ đều mặc, 1 set chung) + MŨ VỊT VÀNG (bản Nam tóc ngắn / bản Nữ tóc dài) |
| vothuong.js | 10 | VOTHUONG.JS — ⚫⚪ MASCOT HẮC VÔ THƯỜNG / BẠCH VÔ THƯỜNG (2 set, CHỈ KHÁC MÀU) |
| winter.js | 7 | WINTER.JS — Đồ mới: |
| wintermage.js | 17 | WINTERMAGE.JS — ❄️ PHÁP SƯ MÙA ĐÔNG: Set + Mũ (mỗi món 10 🗝️ Chìa khóa Giáng sinh) |
| xdeer.js | 12 | XDEER.JS — 🦌 Set Tiểu tuần lộc + Tóc Tiểu tuần lộc (mỗi món 12 🗝️ Chìa khóa Giáng sinh) |

## Nơi ĐĂNG KÝ từng loại đồ (trong index.html — đừng sửa, hãy push từ file mới)
| Loại | Mảng | Dòng khai báo | Cách thêm từ file mới |
|---|---|---|---|
| Set (áo, mascot) | SETS | 883 | `SETS.push({n,k,fx,xu,...})` — mẫu boyboy.js |
| Tóc / mũ | HAIRS | 957 | `HAIRS.push({n,k,c,xu})` — mẫu boyboy.js |
| Thú cưỡi | MOUNTS | 1892 | `MOUNTS.push({n,k,dia|xu,hw,drop,spd,seat,draw})` — mẫu tetmount.js |
| Pet | PETS | 2381 | `PETS.push({n,k,fn})` — mẫu cunboi.js |
| Phụ kiện cầm tay | ACCS | 1690 | `ACCS.push({n,k,t:'hold',art:fn,xu})` — mẫu mau-cam-tay.js |
| Mascot (vẽ riêng) | MASCOT_DRAW | 1202 | `MASCOT_DRAW.tenmascot=fn` rồi SETS.push có `mascot:'tenmascot'` |
| Đồ nội thất | CAT (trong index.html) + FURN_PR (pho-map.js) | 4582 | phức tạp — hỏi người dùng trước |

## GIÁ BÁN
- Shop Phố xá nằm ở `pho-map.js` (dòng ~756, `SHOP`). Giá cũ theo THỨ TỰ trong mảng `pr` — dễ lệch.
- Cách đúng: gắn trường `xu:GIÁ` trực tiếp vào món (hàm `price()` ưu tiên đọc `xu`). Thú cưỡi dùng `dia` (kim cương) hoặc `cb:{xu,qv,dia}`.
- Vì vậy KHÔNG cần sửa pho-map.js khi thêm món mới.

## Danh sách món hiện có (để tránh trùng khóa k)
- **SETS** (khai báo sẵn trong index.html; có thể thiếu vài món) khóa k = warm, deerm, deerf, dnm, dnf, hwm, hwf, duckm, m, duckf, f, chef, linh, tn, aulm, aulf, madong, pjf, pjm, aloim, aloif, wintm, wintf, clown, hanbokm, hanbokf, btm, btf, mhv, skatem, skatef
- **HAIRS** (khai báo sẵn trong index.html; có thể thiếu vài món) khóa k = hat, short, tail, beanie, sailor, bun2, longf, bobf, krang, kman, qthao, lwave, twt, pony, earfur, hawaii, luffy, chef, linh
- **PETS** (khai báo sẵn trong index.html; có thể thiếu vài món) khóa k = cat, cloud, rabbit, rooster, panda, pig, parrot, parrot2, polar, heron, ginger, snowcloud
- **ACCS** (khai báo sẵn trong index.html; có thể thiếu vài món) khóa k = moon, duck, gift, snowbub, starfish, octobub, dsword, ipad, ladle, spear, guitar, wingeagle, wingocean, maspear, mushstaff, scepter1, scepter2, scepter3, bagbee, bagbunny, bagpeng, tailmong, tailfire, pan, icecream
- **PETS.push thêm từ file khác**: Cún bơi lội (cunboi.js)
- **SETS.push thêm từ file khác**: Set Tiểu tuần lộc (xdeer.js); Set Pinkcool (Nữ) (pinkcool.js); Set Pinkcool (Nam) (pinkcool.js); Set Boyboy (boyboy.js); Hắc Vô Thường (vothuong.js); Bạch Vô Thường (vothuong.js); Set Nhân viên khách sạn (nhanvien.js); Set Vịt vàng (vitvang.js); Set Pháp sư mùa đông (wintermage.js); Phù Thủy Mộng Mơ (phuthuy.js); Miku cá tính (miku.js)
- **HAIRS.push thêm từ file khác**: Tóc Tiểu tuần lộc (xdeer.js); Tóc Pinkcool (Nữ) (pinkcool.js); Tóc Pinkcool (Nam) (pinkcool.js); Tóc đồng phục (pajama.js); Tóc Boyboy (boyboy.js); Tóc Nhân viên khách sạn (nhanvien.js); Tóc Đông xù (nhanvien.js); Mũ vịt vàng (Nam) (vitvang.js); Mũ vịt vàng (Nữ) (vitvang.js); Mũ Pháp sư mùa đông (wintermage.js); Tóc Miku cá tính (miku.js)
- **MOUNTS.push thêm từ file khác**: Bệ Xuân Tết (tetmount.js); Trăng khuyết (newitems2.js)

> Kiểm tra trùng khóa chắc chắn nhất: `grep -n -o -E "k:'TENKHOA'" --exclude=frames.js --exclude=idcard.js *.js index.html`
