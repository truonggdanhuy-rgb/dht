# QUY TẮC VẼ SET / MASCOT "ĐỒ HỌA CAO" (HD) — tinyland
Áp dụng MẶC ĐỊNH cho mọi set / mascot / mũ / pet mới. Mẫu chuẩn: games/tinyland/tieuacma.js (Tiểu ác ma). Bộ máy: hdkit.js.

## 1. Nguyên lý (vì sao đẹp, không thấy pixel)
- Mỗi "điểm ảnh game" chia thành 4x4 điểm nhỏ (K=4). Vẽ bằng HÌNH CONG (ell, rrect, poly, bez, stroke), KHÔNG tô từng ô vuông 1x1.
- Khung vẽ 44x52 ô, gốc lệch (12,12): tóc/sừng/mũ/cánh thoải mái vượt khung chuẩn 20x31.
- Dựng 1 lần rồi CACHE theo (giới tính, hướng nhìn, bước chân, ngồi...). Mỗi khung chỉ vẽ lại lớp hiệu ứng.
- Cần đủ 3 hướng: trước (f), nghiêng (s, nhìn trái = lật gương nhìn phải), sau (b).

## 2. Công thức màu & khối
- Mọi khối dùng bảng 4 màu [tối, vừa, sáng, rất sáng], ánh sáng từ TRÊN-TRÁI (shade(pal)). Bên phải/dưới tối, bên trái/trên sáng.
- Màu viết đủ 6 ký tự (#ffffff, KHÔNG #fff — bộ đọc màu không hiểu 3 ký tự).
- Viền: end(2) = viền tối tự lấy từ màu khối (olDark); chi tiết nhỏ (mắt, ngón tay) end(1); tóc sáng/da dùng olSoft cho mềm.
- Da có 3 sắc: thường / bóng đổ phía phải / sáng phía trái. Tóc, vải mỗi loại 1 bảng 4 màu riêng.

## 3. Hình dáng (tránh kiểu thô)
- Sừng, tóc lọn, tai, mũ cong: dùng stroke(bez(...), r0, r1, shade(pal), pw): gốc to r0 -> đầu nhỏ r1. TUYỆT ĐỐI không dùng tam giác poly cho sừng/mũ nhọn.
- Mũ rộng vành / cao: dựng bằng ell + stroke cong, vát mượt; được phép vượt khung 20 điểm.
- Đối xứng: dùng mirP / mirB để lật gương các nét bên trái sang phải cho khỏi lệch.
- Thứ tự vẽ (sau đè trước): tóc sau -> chân -> thân -> tay -> cổ -> đầu -> tóc trước -> sừng/mũ -> phụ kiện.

## 4. Hiệu ứng
- Chỉ vẽ lại hiệu ứng mỗi khung (quầng sáng, chớp, tuyết, lấp lánh) trên canvas riêng, rồi drawImage lớp đã cache lên trên.
- Hiệu ứng nhẹ, không che mặt; nhịp thở/chớp theo thời gian (t).

## 5. Quy trình bắt buộc khi AI vẽ set mới
1. Đọc hdkit.js + tieuacma.js (hoặc mau-hd-mascot.js) trước khi vẽ.
2. Vẽ MẪU XEM TRƯỚC (ảnh PNG phóng to 3 hướng) cho tớ duyệt, rồi mới đưa vào game.
3. Kiểm tra 3 hướng + chân bước + ngồi, không bị hở/lệch.
4. Giữ bản backup file cũ. Gửi từng file riêng (không zip) + nói rõ đặt vào thư mục GitHub nào.
5. Set có biểu cảm cố định hay đổi theo Túi: ghi rõ trong ds.
