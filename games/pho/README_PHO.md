# Phố — tài liệu bảo trì

## Cấu trúc file (games/pho/)
- index.html, pho.css — khung trang + giao diện
- js/config.js — CFG: giá (PRICE 200), xu khởi đầu, tốc độ, xu rơi...
- js/items.js — DANH MỤC ĐỒ: HEADS (mũ/tóc), SETS (set đồ), PETS, STARTERS
- js/char.js — vẽ nhân vật; js/pet.js — vẽ pet; js/horse.js — vẽ ngựa
- js/art.js — vẽ nền, cây, nhà, đồ vật; js/world.js — bản đồ (street, shop, cafe)
- js/save.js — lưu tiến trình (khóa phoSave, có số VERSION để nâng cấp)
- js/net.js — online (Supabase Realtime); js/ui.js — túi, cửa hàng, hộp thoại
- js/race.js — đua ngựa (chỉnh độ khó ở RC); js/main.js — vòng lặp game

## Thêm đồ mới
- Tóc/mũ: thêm 1 dòng vào HEADS trong items.js (id duy nhất, tên, giá, kiểu).
- Set đồ: thêm 1 dòng vào SETS (cat: nam / nu / cs).
- Pet: thêm vào PETS + vẽ trong pet.js (PETART).
- Giá chung: đổi CFG.PRICE trong config.js.
- Chỗ ngồi/đồ vật/tòa nhà: thêm trong world.js (hàm put/block), vẽ trong art.js.

## Nâng cấp dữ liệu lưu
Đổi CFG.VERSION rồi bổ sung bước migrate trong save.js.

## Gỡ lỗi
Mở địa chỉ games/pho/index.html?debug rồi dùng PHOD trong Console.
Chat không được lưu (chỉ hiện trực tiếp). Lệnh admin trong ô chat: /xu 500
