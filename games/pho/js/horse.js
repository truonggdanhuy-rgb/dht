/* horse.js — vẽ ngựa pixel (nhìn ngang, quay sang phải). Dùng cho khu đua ngựa và chuồng ngựa trang trí.
   frame 0..3: phi; frame 4: đứng yên/dừng lại (bị kiến cắn); num: số trên yên (1-4) */
window.PHO = window.PHO || {};
PHO.horse = (() => {
  const G = PHO.gfx, { mk, R, dark, light } = G;
  const CW = 30, CH = 24, cache = new Map();
  const DIG = { 1: ['010', '110', '010', '010', '111'], 2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '011', '001', '111'], 4: ['101', '101', '111', '001', '001'] };
  function get(c, mane, num, f, blink) {
    const key = c + mane + num + f + (blink ? 1 : 0);
    let s = cache.get(key); if (s) return s;
    const [cv, x] = mk(CW, CH); x.translate(2, 2);
    const r = R(x), d = dark(c, .2), l = light(c, .35), hoof = '#6a5870';
    // chân (khung hình)
    const g = [[0, 0, 0, 0], [-2, 1, 1, -2], [0, 0, 0, 0], [1, -2, -2, 1]][f] || [0, 0, 0, 0];
    const run = f < 4;
    const leg = (lx, dx, back) => { const col = back ? d : c; r(lx + dx, 13, 2, 5, col); r(lx + dx, 17, 2, 2, hoof); };
    leg(6, run ? g[0] : 0, true); leg(17, run ? g[1] : 0, true);
    leg(9, run ? g[2] : 0, false); leg(14, run ? g[3] : 0, false);
    // đuôi
    r(1, 6, 3, 2, mane); r(0, 8, 3, 5, mane); r(1, 12, 2, 2, dark(mane, .15));
    // thân
    r(4, 6, 16, 8, c); r(5, 5, 14, 1, c); r(5, 14, 14, 1, d); r(6, 11, 12, 3, l); r(4, 13, 16, 1, d);
    // cổ + đầu
    r(18, 2, 4, 6, c); r(19, 1, 4, 3, c); r(21, 2, 5, 5, c); r(25, 4, 2, 3, l); r(26, 5, 1, 1, '#ff9fb2');
    r(20, 0, 2, 2, c); r(21, 0, 1, 1, '#ff9fb2');
    // bờm
    r(17, 1, 3, 7, mane); r(16, 3, 1, 5, mane); r(19, 0, 1, 1, mane);
    // mắt
    if (blink) r(23, 4, 2, 1, '#3a2c4a'); else { r(23, 3, 2, 2, '#3a2c4a'); r(23, 3, 1, 1, '#fff'); }
    // yên
    r(8, 5, 8, 6, '#ff8fb0'); r(8, 5, 8, 1, '#ffb7cd'); r(8, 10, 8, 1, '#e0678d');
    if (num) { const dg = DIG[num]; dg.forEach((row, yy) => [...row].forEach((ch, xx) => ch === '1' && r(10 + xx + (xx > 0 ? 0 : 0), 5 + yy, 1, 1, '#fff'))); }
    G.outline(cv);
    cache.set(key, cv); return cv;
  }
  return { get, CW, CH };
})();
