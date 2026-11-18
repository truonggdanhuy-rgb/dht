# VẼ SET / MASCOT — BẢN NGẮN (thay cho bản dài cũ)
Mặc định: vẽ NHANH, đưa vào game luôn. Không bắt buộc xem trước, không bắt buộc đọc nhiều file.

## Chọn kiểu vẽ (hỏi người dùng nếu chưa nói)
- **Kiểu cũ (pixel, nhanh nhất)**: dùng cho mọi thứ nhỏ. Mascot → copy `clown.js`. Cầm tay → `mau-cam-tay.js`. Pet → `cunboi.js`. Thú cưỡi → `tetmount.js`.
- **Kiểu HD (K=4, cong mượt)**: CHỈ khi người dùng yêu cầu "đồ họa cao / HD". Cần `hdkit.js` + mẫu `boyboy.js` (set+tóc) hoặc `mau-hd-mascot.js`. Không cần đọc tieuacma.js.

## Quy tắc kỹ thuật HD (chỉ khi dùng HD)
- Khung 44x52 ô, gốc (12,12), mỗi ô chia 4x4. Vẽ bằng ell / rrect / poly / stroke(bez) — không tô từng ô.
- Bảng màu 4 tông [tối, vừa, sáng, rất sáng], sáng từ trên-trái. Màu viết đủ 6 ký tự (#ffffff, KHÔNG #fff).
- Sừng/tóc lọn/mũ nhọn dùng stroke(bez(...)), không dùng tam giác. Đối xứng dùng mirP/mirB.
- Thứ tự vẽ: tóc sau → chân → thân → tay → cổ → đầu → tóc trước → mũ/sừng → phụ kiện.
- Cần 3 hướng: trước, nghiêng, sau. Dựng 1 lần rồi cache.

## Giao hàng
- Mỗi món = 1 file .js riêng đặt trong `games/tinyland/`, tự `push` vào SETS/HAIRS/MOUNTS/PETS/ACCS, giá bằng `xu:`/`dia:`.
- KHÔNG sửa index.html / pho-map.js. Chỉ báo người dùng dán 1 dòng `<script src="...">` vào CUỐI danh sách script.
- Xem preview PNG chỉ khi người dùng yêu cầu.
