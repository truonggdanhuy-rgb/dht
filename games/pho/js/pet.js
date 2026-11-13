/* pet.js — vẽ pet bằng code. Hiện có: Mèo Thần Tài (mèo đỏ, đeo chuông vàng).
   Thêm pet mới: thêm vào PHO.ITEMS.PETS (items.js) + thêm hàm vẽ cùng tên id vào PETART bên dưới. */
window.PHO = window.PHO || {};
PHO.pet = (() => {
  const G = PHO.gfx, { mk, R, dark, light } = G;
  const CW = 18, CH = 17, AX = 9, AY = 16;
  const cache = new Map();

  const PETART = {
    cat(r, dir, f, blink) {
      const B = '#f4605f', D = '#cf4848', L = '#ff8f86', W = '#fff0e2', EYE = '#3a2c4a', GOLD = '#ffd34d', PINK = '#ff9fb2';
      const bob = (f === 1 || f === 3) ? -1 : 0;
      const step = f === 1 ? 1 : f === 3 ? -1 : 0;
      if (dir === 'd') {
        // đuôi
        r(12, 8, 2, 4, B); r(13, 6, 2, 3, B); r(14, 5, 1, 1, W); r(12, 11, 2, 1, D);
        // thân
        r(4, 9 + bob, 8, 4, B); r(6, 10 + bob, 4, 3, W); r(4, 12 + bob, 8, 1, D);
        // chân
        r(4, 13, 3, 3, W); r(9, 13, 3, 3, W);
        if (step === 1) { r(4, 13, 3, 2, W); r(4, 15, 3, 1, 'rgba(0,0,0,0)'); }
        // đầu
        r(4, 2 + bob, 8, 1, B); r(3, 3 + bob, 10, 5, B); r(4, 8 + bob, 8, 1, B);
        r(5, 7 + bob, 6, 2, W);
        // tai
        r(3, 0 + bob, 1, 1, B); r(3, 1 + bob, 3, 1, B); r(3, 2 + bob, 3, 1, B); r(4, 1 + bob, 1, 2, PINK);
        r(12, 0 + bob, 1, 1, B); r(10, 1 + bob, 3, 1, B); r(10, 2 + bob, 3, 1, B); r(11, 1 + bob, 1, 2, PINK);
        // mặt
        if (blink) { r(5, 5 + bob, 2, 1, EYE); r(9, 5 + bob, 2, 1, EYE); }
        else { r(5, 4 + bob, 2, 3, EYE); r(9, 4 + bob, 2, 3, EYE); r(5, 4 + bob, 1, 1, '#fff'); r(9, 4 + bob, 1, 1, '#fff'); }
        r(7, 7 + bob, 2, 1, PINK); r(4, 7 + bob, 1, 1, L); r(11, 7 + bob, 1, 1, L);
        r(7, 3 + bob, 2, 1, D);               // đốm trán
        // chuông vàng
        r(6, 9 + bob, 4, 1, '#d94a5a'); r(7, 10 + bob, 2, 2, GOLD); r(7, 10 + bob, 1, 1, '#fff3a6');
      } else if (dir === 'u') {
        r(7, 7, 2, 6, B); r(7, 3 + bob, 3, 1, B);
        r(4, 9 + bob, 8, 4, B); r(4, 12 + bob, 8, 1, D); r(4, 13, 3, 3, B); r(9, 13, 3, 3, B);
        r(4, 2 + bob, 8, 1, B); r(3, 3 + bob, 10, 6, B); r(4, 9 + bob, 8, 1, B);
        r(3, 0 + bob, 1, 1, B); r(3, 1 + bob, 3, 1, B); r(3, 2 + bob, 3, 1, B);
        r(12, 0 + bob, 1, 1, B); r(10, 1 + bob, 3, 1, B); r(10, 2 + bob, 3, 1, B);
        r(7, 3 + bob, 2, 3, D);
        // đuôi dựng lên giữa
        r(7, 5 + bob, 2, 8, L); r(7, 5 + bob, 2, 1, W);
      } else { // l
        // đuôi
        r(13, 5, 2, 7, B); r(12, 4, 2, 2, B); r(13, 4, 1, 1, W);
        // chân sau + trước
        r(10 + step, 13, 2, 3, D); r(4 - step, 13, 2, 3, D);
        r(7 - step, 13, 2, 3, W); r(11 + step, 13, 2, 3, W);
        // thân
        r(4, 9 + bob, 9, 4, B); r(5, 11 + bob, 6, 2, W); r(4, 12 + bob, 9, 1, D);
        // đầu
        r(2, 3 + bob, 9, 1, B); r(1, 4 + bob, 10, 5, B); r(2, 9 + bob, 8, 1, B); r(2, 8 + bob, 4, 2, W);
        r(2, 1 + bob, 1, 1, B); r(2, 2 + bob, 3, 2, B); r(3, 2 + bob, 1, 1, PINK);
        r(7, 1 + bob, 1, 1, B); r(6, 2 + bob, 3, 2, B);
        if (blink) r(3, 6 + bob, 2, 1, EYE); else { r(3, 5 + bob, 2, 3, EYE); r(3, 5 + bob, 1, 1, '#fff'); }
        r(1, 7 + bob, 1, 1, PINK); r(8, 6 + bob, 1, 2, D);
        r(6, 9 + bob, 1, 3, '#d94a5a'); r(5, 10 + bob, 2, 2, GOLD);
      }
    }
  };

  function get(id, dir, f = 0, blink = false) {
    const key = id + dir + f + (blink ? 1 : 0);
    let c = cache.get(key);
    if (c) return c;
    const base = dir === 'r' ? 'l' : dir;
    const [cv, x] = mk(CW, CH);
    x.translate(1, 1);
    const r = R(x);
    (PETART[id] || PETART.cat)(r, base, f, blink);
    G.outline(cv);
    c = dir === 'r' ? G.flip(cv) : cv;
    cache.set(key, c);
    return c;
  }
  return { get, CW, CH, AX, AY };
})();
