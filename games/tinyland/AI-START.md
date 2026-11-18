# AI-START — ĐỌC FILE NÀY TRƯỚC (Tinyland, game HTML do 1 người tự làm vui, không kinh doanh)

## Việc của bạn
Người dùng mô tả 1 món (set / tóc-mũ / thú cưỡi / pet / mascot / phụ kiện cầm tay) kèm: hình dáng, nơi bán, giá.
→ Bạn viết **1 FILE .js MỚI** và trả về. Xong. Không cần hiểu toàn bộ game.

## QUY TẮC TỐC ĐỘ (quan trọng nhất)
1. Đọc đúng 3 thứ: file này → `FILE-MAP.md` (bản đồ) → **1 file mẫu** theo bảng dưới. KHÔNG khám phá cả thư mục.
2. ⛔ KHÔNG cat / view / grep thẳng `frames.js`, `idcard.js`, `index.html`, `baby.js` — có dòng ảnh base64 dài hàng trăm KB. Muốn tìm: `grep -n -o -E '.{0,60}TỪ_KHÓA.{0,60}' --exclude=frames.js --exclude=idcard.js *.js`
3. KHÔNG sửa `index.html`, `pho-map.js`, `outfits.js`. Món mới tự `push` vào mảng từ file mới (kiểu `boyboy.js`).
4. KHÔNG dựng pipeline xem trước (node-canvas, headless browser, PNG). Chỉ làm khi người dùng yêu cầu rõ. Kiểm tra bằng đọc lại code + `node --check ten-file.js`.
5. Không đọc `HD-VE-SET.md` dài, `tieuacma.js`, `hdface.js` trừ khi người dùng đòi HD.
6. Vẽ ngay sau khi đọc mẫu. Mục tiêu: < 5 lần gọi công cụ trước khi viết file.

## Chọn file mẫu
| Món | Copy mẫu | Đăng ký | Giá |
|---|---|---|---|
| Set áo + tóc/mũ (HD) | `boyboy.js` (+ `hdkit.js`) | `SETS.push`, `HAIRS.push` | `xu:` |
| Mascot (pixel, kiểu cũ) | `clown.js` | `MASCOT_DRAW.ten=fn` + `SETS.push({k,mascot:'ten',wide:1,...})` | `xu:` |
| Mascot (HD) | `mau-hd-mascot.js` (+ `hdkit.js`) | như trên | `xu:` |
| Phụ kiện cầm tay (gấu, đàn, kem...) | `mau-cam-tay.js` | `ACCS.push({t:'hold',art})` | `xu:` |
| Pet | `cunboi.js` | `PETS.push({n,k,fn})` | `xu:` |
| Thú cưỡi | `tetmount.js` | `MOUNTS.push({...,dia|xu})` | `dia:` kim cương hoặc `xu:` |

Giá: gắn `xu:GIÁ` thẳng vào món (shop tự đọc). Nơi bán mặc định: **Shop Phố xá** (tab Set / Tóc & mũ / Thú cưỡi / Pet / Phụ kiện). Shop kim cương/Tiệm Chú Hề/… có sẵn trong file khác — chỉ hỏi người dùng nếu họ nói bán ở đó.

## Quy ước bắt buộc trong file mới
- Bọc `(function(){ ... })();`, kiểm tra `typeof SETS!=='undefined'` trước khi push, và `!SETS.some(s=>s.k=='khoa')` để không push trùng.
- Khóa `k` duy nhất (kiểm tra bằng grep ở FILE-MAP). LUÔN push vào CUỐI mảng (không làm lệch món người chơi đã mua).
- Màu viết đủ 6 ký tự `#rrggbb`.
- Set "không che mặt": khuôn mặt, biểu cảm & phụ kiện cầm tay vẫn hiện.

## Giao hàng cho người dùng (ngắn gọn)
1. File mới (1 file / món), nói rõ đặt vào `games/tinyland/`.
2. Đúng 1 dòng để dán vào CUỐI danh sách `<script>` của `games/tinyland/index.html` (sau `boyboy.js`):
   `<script src="ten-file.js?v=1"></script>`
3. Giá + nơi bán đã đặt ở đâu, 1 câu. Không viết dài.

## Sau khi giao file
Kèm 1 dòng để người dùng thêm vào cuối bảng của `FILE-MAP.md`: `| ten-file.js | KB | mô tả ngắn |`. Giúp lần sau AI khác vẫn có bản đồ đúng.
