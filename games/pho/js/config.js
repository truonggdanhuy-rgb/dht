/* config.js — mọi con số chỉnh được của Phố nằm ở đây (giá, tốc độ, xu, chat...) */
window.PHO = window.PHO || {};
PHO.CFG = {
  VERSION: 1,            // tăng số này khi đổi cấu trúc dữ liệu lưu → viết thêm bước nâng cấp trong save.js (migrate)
  TILE: 16,              // 1 ô = 16 điểm ảnh
  SPEED: 64,             // tốc độ đi bộ (điểm ảnh / giây)
  PRICE: 200,            // giá mỗi món đồ (xu)
  PET_PRICE: 200,        // giá pet (xu)
  START_XU: 600,         // xu tặng khi tạo nhân vật
  DAILY_XU: 100,         // quà đăng nhập mỗi ngày
  COIN_VALUE: 10,        // mỗi đồng xu nhặt được ngoài phố
  COIN_MAX: 10,          // số xu tối đa nằm ngoài phố cùng lúc
  COIN_EVERY: 6,         // cứ mấy giây hiện thêm 1 xu
  CHAT_MAX: 80,          // tối đa ký tự mỗi tin
  CHAT_GAP: 1100,        // giãn cách tối thiểu giữa 2 tin (ms)
  NET_HZ: 8,             // số lần gửi vị trí mỗi giây
  MAX_PEERS: 40,         // tối đa số người hiện cùng lúc trên màn hình
  NAME_MIN: 2, NAME_MAX: 16,
  SUPABASE_JS: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.76.0/dist/umd/supabase.js'
};
