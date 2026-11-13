/* char.js — vẽ nhân vật pixel chibi bằng code. Mỗi (ngoại hình, hướng, khung hình) được vẽ 1 lần rồi lưu cache.
   Hệ tọa độ vẽ: 24 x 31 điểm ảnh, tâm ngang x=11.5. Hướng: d (nhìn xuống/đối diện), u (quay lưng), l (nhìn trái), r (nhìn phải = lật của l).
   Thứ tự vẽ: tóc sau → chân/giày → thân/tay → váy/quần → đầu+mặt → tóc trước → mũ → viền */
window.PHO = window.PHO || {};
PHO.char = (() => {
  const G = PHO.gfx, { mk, R, dark, light, mix } = G;
  const CW = 26, CH = 36, AX = 13, AY = 34;      // kích thước canvas + điểm đứng (chân) của nhân vật
  const cache = new Map();
  const EYE = '#3a2c4a', BLUSH = '#ff9fb2', MOUTH = '#d9607a';

  // ---------- TÓC ----------
  // cap* = phần chỏm tóc theo hướng; mỗi kiểu tóc ghép thêm phần mái/đuôi
  function capD(r, c) {
    const d = dark(c, .22), h = light(c, .45);
    r(8, 2, 8, 1, c); r(6, 3, 12, 1, c); r(5, 4, 14, 1, c);
    r(4, 5, 16, 2, c); r(4, 7, 7, 1, c); r(13, 7, 7, 1, c);        // mái chia 2 bên
    r(4, 8, 6, 1, c); r(14, 8, 6, 1, c);
    r(4, 9, 3, 2, c); r(17, 9, 3, 2, c);                           // tóc mai
    r(4, 8, 6, 1, d); r(14, 8, 6, 1, d); r(10, 7, 1, 1, d); r(13, 7, 1, 1, d);
    r(9, 3, 3, 1, h); r(7, 4, 2, 1, h); r(6, 5, 1, 1, h);
  }
  function capU(r, c, low) {
    const d = dark(c, .22), h = light(c, .45);
    r(8, 2, 8, 1, c); r(6, 3, 12, 1, c); r(5, 4, 14, 1, c);
    r(4, 5, 16, low ? 9 : 7, c);
    if (low) { r(5, 14, 14, 1, c); r(7, 15, 10, 1, c); }
    r(11, 3, 2, 3, d); r(7, 5, 3, 1, h); r(8, 6, 2, 1, h);
    r(4, 5 + (low ? 8 : 6), 16, 1, d);
  }
  function capL(r, c) {
    const d = dark(c, .22), h = light(c, .45);
    r(8, 2, 8, 1, c); r(6, 3, 12, 1, c); r(5, 4, 14, 1, c);
    r(4, 5, 16, 4, c); r(4, 9, 2, 2, c);
    r(11, 9, 3, 2, c); r(14, 9, 6, 5, c); r(14, 14, 5, 1, c);
    r(4, 8, 8, 1, d); r(9, 3, 3, 1, h); r(7, 4, 2, 1, h); r(14, 13, 6, 1, d);
  }

  const HAIR = {
    short: {
      back() { },
      front(r, dir, c) { dir === 'd' ? capD(r, c) : dir === 'u' ? capU(r, c, false) : capL(r, c); }
    },
    spiky: {
      back() { },
      front(r, dir, c) {
        dir === 'd' ? capD(r, c) : dir === 'u' ? capU(r, c, false) : capL(r, c);
        r(6, 1, 2, 2, c); r(10, 0, 3, 3, c); r(15, 1, 2, 2, c); r(8, 1, 1, 1, c); r(13, 1, 2, 1, c); r(11, -0, 1, 1, light(c, .45));
        if (dir === 'd') { r(7, 8, 2, 1, c); r(15, 8, 2, 1, c); r(11, 8, 2, 1, c); }
      }
    },
    long: {
      back(r, dir, c) {
        const d = dark(c, .2);
        if (dir === 'u') { r(4, 14, 16, 8, c); r(5, 22, 14, 1, d); }
        if (dir === 'l') { r(12, 12, 9, 10, c); r(13, 22, 6, 1, d); }
      },
      front(r, dir, c) {
        const d = dark(c, .2);
        if (dir === 'd') { capD(r, c); r(4, 11, 2, 9, c); r(18, 11, 2, 9, c); r(4, 19, 2, 1, d); r(18, 19, 2, 1, d); r(5, 12, 1, 5, d); r(18, 12, 1, 5, d); }
        else if (dir === 'u') { capU(r, c, true); }
        else { capL(r, c); }
      }
    },
    bob: {
      back() { },
      front(r, dir, c) {
        const d = dark(c, .2);
        if (dir === 'd') { capD(r, c); r(4, 11, 3, 4, c); r(17, 11, 3, 4, c); r(5, 15, 2, 1, d); r(17, 15, 2, 1, d); r(5, 14, 1, 1, c); r(18, 14, 1, 1, c); }
        else if (dir === 'u') { capU(r, c, true); }
        else { capL(r, c); r(11, 14, 9, 2, c); r(13, 16, 5, 1, d); }
      }
    },
    twin: {
      back(r, dir, c, a) {
        const d = dark(c, .2);
        if (dir === 'd' || dir === 'u') {
          r(2, 10, 3, 9, c); r(19, 10, 3, 9, c); r(3, 19, 2, 2, c); r(19, 19, 2, 2, c); r(2, 18, 3, 1, d); r(19, 18, 3, 1, d);
        } else { r(16, 9, 5, 11, c); r(17, 20, 3, 2, c); r(16, 19, 5, 1, d); }
      },
      front(r, dir, c, a) {
        dir === 'd' ? capD(r, c) : dir === 'u' ? capU(r, c, false) : capL(r, c);
        if (dir === 'd' || dir === 'u') { r(1, 8, 5, 2, a); r(18, 8, 5, 2, a); r(2, 7, 3, 1, light(a, .3)); r(19, 7, 3, 1, light(a, .3)); }
        else { r(15, 8, 6, 2, a); }
      }
    },
    bun: {
      back() { },
      front(r, dir, c, a) {
        dir === 'd' ? capD(r, c) : dir === 'u' ? capU(r, c, false) : capL(r, c);
        r(10, -1, 4, 1, c); r(9, 0, 6, 3, c); r(10, 3, 4, 1, a); r(10, 0, 2, 1, light(c, .45)); r(9, 2, 6, 1, dark(c, .2));
      }
    },
    pony: {
      back(r, dir, c, a) {
        const d = dark(c, .2);
        if (dir === 'd') { r(18, 6, 4, 3, a); r(19, 9, 4, 9, c); r(20, 18, 2, 3, c); r(19, 17, 4, 1, d); }
        if (dir === 'l') { r(18, 6, 4, 3, a); r(18, 9, 5, 11, c); r(19, 20, 3, 2, c); r(18, 19, 5, 1, d); }
      },
      front(r, dir, c, a) {
        const d = dark(c, .2);
        if (dir === 'd') capD(r, c);
        else if (dir === 'u') { capU(r, c, false); r(10, 5, 4, 3, a); r(9, 8, 6, 12, c); r(10, 20, 4, 2, c); r(9, 19, 6, 1, d); r(11, 9, 1, 8, light(c, .4)); }
        else capL(r, c);
      }
    }
  };

  // ---------- MŨ ----------
  const HAT = {
    nonla(r, dir, h) {
      const c = h.c, d = dark(c, .16), l = light(c, .3);
      r(11, 0, 2, 1, c); r(10, 1, 4, 1, c); r(8, 2, 8, 1, c); r(6, 3, 12, 1, c); r(4, 4, 16, 1, c); r(2, 5, 20, 1, c); r(0, 6, 24, 1, d); r(2, 7, 20, 1, d);
      r(11, 0, 1, 1, l); r(9, 1, 1, 1, l); r(7, 2, 1, 1, l); r(5, 3, 1, 1, l); r(3, 4, 1, 1, l);
      r(11, 1, 1, 6, d); r(8, 3, 1, 3, d); r(15, 3, 1, 3, d); r(5, 5, 1, 1, d); r(18, 5, 1, 1, d);
      if (dir !== 'u') { r(5, 8, 1, 7, h.c2); r(18, 8, 1, 7, h.c2); r(5, 14, 2, 1, h.c2); r(17, 14, 2, 1, h.c2); }
    },
    beanie(r, dir, h) {
      const c = h.c, d = dark(c, .18), l = light(c, .3);
      r(8, 2, 8, 1, c); r(6, 3, 12, 1, c); r(5, 4, 14, 3, c); r(4, 7, 16, 2, h.c2);
      r(4, 8, 16, 1, dark(h.c2, .14)); for (let x = 5; x < 20; x += 2) r(x, 7, 1, 2, dark(h.c2, .1));
      r(9, 3, 2, 1, l); r(7, 4, 2, 1, l); r(18, 4, 1, 3, d); r(5, 6, 14, 1, d);
      r(10, 0, 4, 3, '#fffaf4'); r(9, 1, 6, 1, '#fffaf4'); r(10, 2, 4, 1, '#ece2da'); r(11, 0, 1, 1, '#ffffff');
    },
    beret(r, dir, h) {
      const c = h.c, d = dark(c, .2), l = light(c, .3);
      r(7, 2, 11, 1, c); r(5, 3, 15, 1, c); r(3, 4, 18, 1, c); r(2, 5, 20, 1, c); r(4, 6, 17, 1, d); r(7, 7, 12, 1, d);
      r(12, 1, 2, 1, d); r(8, 3, 3, 1, l); r(6, 4, 2, 1, l);
    },
    cap(r, dir, h) {
      const c = h.c, d = dark(c, .16), l = light(c, .3), b = h.c2;
      r(8, 2, 8, 1, c); r(6, 3, 12, 1, c); r(5, 4, 14, 3, c); r(5, 7, 14, 1, d); r(11, 2, 2, 5, d); r(9, 3, 2, 1, l); r(7, 4, 2, 1, l);
      r(11, 1, 2, 1, b);
      if (dir === 'd') { r(5, 8, 14, 1, b); r(6, 9, 12, 1, dark(b, .18)); }
      else if (dir === 'l') { r(0, 7, 9, 1, b); r(0, 8, 8, 1, dark(b, .18)); r(1, 6, 4, 1, b); }
      else { r(10, 7, 4, 1, b); }
    },
    bucket(r, dir, h) {
      const c = h.c, d = h.c2, l = light(c, .35);
      r(7, 2, 10, 1, c); r(6, 3, 12, 3, c); r(8, 3, 3, 1, l); r(5, 6, 14, 1, d);
      r(3, 6, 18, 1, c); r(2, 7, 20, 1, c); r(3, 8, 18, 1, d); r(5, 9, 14, 1, dark(d, .12));
      r(4, 7, 16, 1, light(c, .15));
    },
    ears(r, dir, h) {
      const c = h.c, p = h.c2;
      r(7, 0, 1, 1, c); r(6, 1, 3, 1, c); r(6, 2, 4, 1, c); r(6, 3, 4, 1, c); r(7, 1, 1, 2, p);
      r(16, 0, 1, 1, c); r(15, 1, 3, 1, c); r(14, 2, 4, 1, c); r(14, 3, 4, 1, c); r(16, 1, 1, 2, p);
      r(5, 4, 14, 1, dark(c, .12)); r(8, 3, 8, 1, dark(c, .08));
    },
    bow(r, dir, h) {
      const c = h.c, l = h.c2, d = dark(c, .2), x = dir === 'l' ? 3 : 0;
      r(14, 2, 3, 4, c); r(18, 1, 3, 5, c); r(21, 2, 2, 4, d); r(14, 2, 1, 4, d); r(17, 3, 2, 2, d);
      r(15, 3, 1, 1, l); r(19, 2, 1, 1, l); r(18, 3, 1, 2, l);
    },
    flowers(r, dir, h) {
      const L = '#8ed39a';
      for (let x = 5; x <= 18; x++) r(x, x % 2 ? 3 : 4, 1, 1, L);
      [[5, 4, h.c], [8, 3, h.c2], [11, 2, h.c], [14, 3, h.c2], [17, 4, h.c]].forEach(([x, y, cc]) => {
        r(x - 1, y, 3, 1, cc); r(x, y - 1, 1, 3, cc); r(x, y, 1, 1, '#ffd34d');
      });
    }
  };

  // ---------- MẶT ----------
  function face(r, dir, skin, hy) {
    if (dir === 'd') {
      r(8, 10 + hy, 2, 3, EYE); r(14, 10 + hy, 2, 3, EYE);
      r(8, 10 + hy, 1, 1, '#fff'); r(14, 10 + hy, 1, 1, '#fff'); r(9, 12 + hy, 1, 1, '#7a6a9a'); r(15, 12 + hy, 1, 1, '#7a6a9a');
      r(6, 13 + hy, 2, 1, BLUSH); r(16, 13 + hy, 2, 1, BLUSH);
      r(10, 13 + hy, 1, 1, MOUTH); r(11, 14 + hy, 2, 1, MOUTH); r(13, 13 + hy, 1, 1, MOUTH);
    } else if (dir === 'l') {
      r(6, 10 + hy, 2, 3, EYE);
      r(6, 10 + hy, 1, 1, '#fff'); r(7, 12 + hy, 1, 1, '#7a6a9a');
      r(5, 13 + hy, 2, 1, BLUSH);
      r(12, 11 + hy, 2, 2, dark(skin, .1)); r(12, 12 + hy, 1, 1, dark(skin, .26));
      r(8, 13 + hy, 1, 1, MOUTH); r(9, 14 + hy, 2, 1, MOUTH);
    }
  }

  // ---------- THÂN ----------
  const pat = (r, S, x0, x1, y0, y1) => {
    const p = S.pat, c = S.c2; if (!p) return;
    if (p === 'stripe') for (let y = y0 + 1; y <= y1; y += 2) r(x0, y, x1 - x0 + 1, 1, c);
    if (p === 'dots') [[9, 17], [12, 18], [14, 20], [10, 21], [13, 22], [8, 19]].forEach(([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && r(x, y, 1, 1, c));
    if (p === 'heart') { r(10, 19, 1, 1, c); r(13, 19, 1, 1, c); r(10, 20, 4, 1, c); r(11, 21, 2, 1, c); }
    if (p === 'star') { r(11, 18, 2, 1, c); r(10, 19, 4, 1, c); r(11, 20, 2, 1, c); r(11, 21, 1, 1, c); r(12, 21, 1, 1, c); }
    if (p === 'flower') [[9, 18], [13, 20], [10, 22], [14, 17]].forEach(([x, y]) => { r(x, y, 1, 1, c); r(x, y - 1, 1, 1, '#ffffff'); });
  };

  function arms(r, dir, f, S, skin, hy) {
    const sc = S.top === 'overall' ? S.c2 : S.c1, d = dark(sc, .16), sd = dark(skin, .14);
    const sl = S.sleeve;
    const ayL = [0, -1, 0, 1][f], ayR = [0, 1, 0, -1][f];
    if (dir === 'd' || dir === 'u') {
      const arm = (x, ay) => {
        const y0 = 17 + hy;
        const lenSleeve = sl === 'long' ? 5 : sl === 'short' ? 3 : 0;
        if (lenSleeve) r(x, y0 + ay, 2, lenSleeve, sc);
        r(x, y0 + ay + lenSleeve, 2, 6 - lenSleeve - hy * -0, skin);
        if (lenSleeve) { r(x + (x < 10 ? 0 : 1), y0 + ay, 1, lenSleeve, d); }
        if (S.top === 'suit' && sl === 'long') r(x, y0 + ay + 4, 2, 1, '#fffaf6');
        if (S.top === 'sailor') r(x, y0 + ay + 2, 2, 1, S.c2);
        r(x + (x < 10 ? 0 : 1), y0 + ay + 5, 1, 1, sd);
      };
      arm(6, ayL); arm(16, ayR);
    }
  }

  function torso(r, dir, S, skin, hy) {
    const c = S.c1, d = dark(c, .16), t = S.top;
    const y0 = 16 + hy, h = 8 - hy;
    if (dir === 'l') {
      r(9, y0, 6, h, c); r(14, y0, 1, h, d); r(9, 23, 6, 1, d);
      if (t === 'tee' || t === 'hoodie') pat(r, S, 9, 14, 17, 22);
      if (t === 'shirt' || t === 'suit') { r(9, 16, 1, 5, '#fffaf6'); if (S.tie) r(9, 18, 2, 4, S.tie); }
      if (t === 'hoodie') { r(9, 16, 6, 2, dark(c, .1)); r(9, 20, 5, 3, dark(c, .1)); }
      if (t === 'sailor') { r(9, 16, 6, 2, S.c2); r(9, 18, 2, 1, S.c2); }
      if (t === 'overall') { r(9, 16, 6, 8, S.c2); r(10, 19, 4, 5, c); r(10, 16, 1, 3, c); }
      if (t === 'dress') { r(9, 22, 6, 1, S.c2); }
      if (t === 'aodai') { r(9, 16, 6, 1, S.c2); }
      return;
    }
    if (t === 'overall') { r(8, y0, 8, h, S.c2); r(15, y0, 1, h, dark(S.c2, .14)); }
    else r(8, y0, 8, h, c);
    if (dir === 'u') {
      r(15, y0, 1, h, d); r(8, 23, 8, 1, d);
      if (t === 'hoodie') { r(8, 16, 8, 4, dark(c, .1)); r(10, 17, 4, 2, dark(c, .2)); }
      if (t === 'sailor') { r(8, 16, 8, 3, S.c2); r(10, 19, 4, 1, S.c2); }
      if (t === 'overall') { r(9, 16, 1, 7, c); r(14, 16, 1, 7, c); r(9, 21, 6, 3, c); }
      if (t === 'aodai') r(9, 16, 6, 1, S.c2);
      if (t === 'dress') r(8, 22, 8, 1, S.c2);
      if (t === 'tee') pat(r, { pat: S.pat === 'stripe' ? 'stripe' : null, c2: S.c2 }, 8, 15, 17, 22);
      return;
    }
    r(15, y0, 1, h, d); r(8, 23, 8, 1, d);
    if (t === 'tee') { r(9, 16, 6, 1, S.c2 === '#ffffff' || S.c2 === '#fff3a6' ? dark(c, .1) : S.c2); pat(r, S, 8, 15, 17, 22); }
    if (t === 'hoodie') {
      r(8, 16, 8, 2, dark(c, .1)); r(10, 16, 4, 1, skin); r(10, 18, 1, 3, '#ffffff'); r(13, 18, 1, 3, '#ffffff');
      r(9, 20, 6, 3, dark(c, .1)); r(9, 20, 6, 1, light(c, .2));
    }
    if (t === 'shirt') {
      if (!S.nocollar) { r(9, 16, 2, 1, '#fffaf6'); r(13, 16, 2, 1, '#fffaf6'); r(10, 17, 1, 1, '#fffaf6'); r(13, 17, 1, 1, '#fffaf6'); r(11, 16, 2, 2, skin); }
      else { r(10, 16, 4, 1, dark(c, .12)); }
      r(11, 18, 2, 6, dark(c, .08));
      if (S.btn === 'gold') [17, 19, 21].forEach(y => r(11, y, 1, 1, '#ffd34d'));
      else [19, 21].forEach(y => r(11, y, 1, 1, dark(c, .25)));
      if (S.tie) { r(11, 17, 2, 1, S.tie); r(11, 18, 2, 3, S.tie); r(11, 21, 2, 1, dark(S.tie, .15)); r(11, 21, 1, 1, S.tie); }
    }
    if (t === 'suit') {
      r(10, 16, 4, 2, '#fffaf6'); r(11, 18, 2, 2, '#fffaf6'); r(9, 16, 1, 3, light(c, .25)); r(14, 16, 1, 3, light(c, .25));
      if (S.tie) { r(11, 17, 2, 1, S.tie); r(11, 18, 2, 4, S.tie); r(11, 22, 1, 1, dark(S.tie, .15)); }
      r(12, 21, 1, 1, dark(c, .35)); r(8, 23, 8, 1, d);
    }
    if (t === 'sailor') {
      r(8, 16, 8, 2, S.c2); r(8, 18, 3, 1, S.c2); r(13, 18, 3, 1, S.c2); r(8, 19, 2, 1, S.c2); r(14, 19, 2, 1, S.c2);
      r(10, 17, 4, 1, '#ffffff'); r(8, 17, 1, 1, '#ffffff'); r(15, 17, 1, 1, '#ffffff');
      r(10, 18, 4, 1, skin);
      r(10, 19, 4, 2, '#ee6a7a'); r(11, 20, 2, 1, dark('#ee6a7a', .2)); r(10, 21, 1, 1, '#ee6a7a'); r(13, 21, 1, 1, '#ee6a7a');
    }
    if (t === 'dress') {
      r(10, 16, 4, 1, skin); r(9, 16, 1, 1, dark(c, .08)); r(8, 22, 8, 1, S.c2); pat(r, S, 8, 15, 17, 21);
    }
    if (t === 'aodai') {
      r(9, 16, 6, 1, S.c2); r(11, 17, 2, 1, S.c2);
      for (let i = 0; i < 6; i++) r(9 + i, 17 + i, 1, 1, dark(c, .22));
      r(14, 20, 1, 1, '#ffd34d'); r(13, 18, 1, 1, '#ffd34d');
    }
    if (t === 'overall') {
      r(9, 16, 1, 3, c); r(14, 16, 1, 3, c); r(9, 19, 6, 5, c); r(9, 19, 6, 1, light(c, .2));
      r(9, 19, 1, 1, '#ffd34d'); r(14, 19, 1, 1, '#ffd34d'); r(11, 21, 2, 2, dark(c, .14));
    }
  }

  function legs(r, dir, f, S, skin, hy) {
    const pc = S.c3, pd = dark(pc, .2), sh = S.shoe;
    const liftL = f === 1 ? 1 : 0, liftR = f === 3 ? 1 : 0;
    const bare = S.bottom === 'skirt' || S.bottom === 'none' && S.top !== 'aodai' || S.bottom === 'shorts';
    const sock = S.sock;
    const shoe = (x, y, w, toeLeft) => {
      r(x, y, w, 3, sh); r(x, y + 2, w, 1, '#f6eee6'); r(x + (toeLeft ? 1 : 0), y, w - 1, 1, light(sh, .3));
      r(x + (toeLeft ? w - 1 : 0), y, 1, 2, dark(sh, .12));
    };
    const leg = (x, w, lift, shadeRight) => {
      const top = 24, len = 4 - lift;
      if (S.bottom === 'pants' || S.top === 'aodai') {
        r(x, top, w, len, pc); r(x + (shadeRight ? w - 1 : 0), top, 1, len, pd);
      } else if (S.bottom === 'shorts') {
        r(x, top, w, 2, pc); r(x + (shadeRight ? w - 1 : 0), top, 1, 2, pd); r(x, top + 2, w, len - 2, skin);
      } else {
        r(x, top, w, len, skin); r(x + (shadeRight ? w - 1 : 0), top, 1, len, dark(skin, .12));
      }
      if (sock && S.bottom !== 'pants') r(x, top + len - 2, w, 2, sock);
    };
    if (dir === 'l') {
      const sw = [0, -2, 0, 2][f], sw2 = -sw;
      // chân sau (tối)
      const lx2 = 11 + sw2 * 0, sx2 = 10 + sw2;
      const pcs = S.bottom === 'pants' || S.top === 'aodai';
      r(11 + sw2, 24, 3, 4 - (sw2 < 0 ? 1 : 0), pcs ? pd : dark(skin, .14));
      if (S.bottom === 'shorts') r(11 + sw2, 24, 3, 2, pd);
      shoe(10 + sw2, 28 - (sw2 < 0 ? 1 : 0), 4, true);
      // chân trước
      r(10 + sw, 24, 3, 4 - (sw < 0 ? 1 : 0), pcs ? pc : skin);
      if (S.bottom === 'shorts') r(10 + sw, 24, 3, 2, pc);
      if (sock && !pcs) r(10 + sw, 26, 3, 2, sock);
      shoe(8 + sw, 28 - (sw < 0 ? 1 : 0), 4, true);
      return;
    }
    leg(9, 3, liftL, false); leg(12, 3, liftR, true);
    if (bare) { /* chân da: làm gọn 2 px cho thon */ }
    if (S.bottom === 'pants' && S.top !== 'aodai') r(12, 26, 1, 2, pd);
    shoe(8, 28 - liftL, 4, false); shoe(12, 28 - liftR, 4, false);
  }

  function bottom(r, dir, S, skin) {
    const t = S.bottom, c = S.c3;
    if (t === 'skirt') {
      const d = dark(c, .15), h = S.top === 'dress' ? S.c2 : dark(c, .1);
      const wd = dir === 'l' ? 0 : 0;
      r(8, 22, 8, 1, c); r(7, 23, 10, 1, c); r(6, 24, 12, 1, c); r(5, 25, 14, 1, c);
      r(5, 25, 14, 1, S.top === 'dress' ? S.c2 : d); r(6, 24, 1, 1, d); r(17, 24, 1, 1, d);
      [9, 12, 15].forEach(x => r(x, 23, 1, 2, d));
      r(8, 22, 8, 1, S.top === 'dress' ? dark(c, .06) : d);
      if (S.pat && S.top === 'dress') pat(r, S, 6, 17, 23, 24);
    } else if (S.top === 'aodai') {
      const d = dark(S.c1, .14);
      r(9, 24, 6, 5, S.c1); r(9, 24, 1, 5, light(S.c1, .2)); r(14, 24, 1, 5, d); r(9, 28, 6, 1, S.c2);
      if (dir === 'd') r(11, 25, 2, 3, light(S.c1, .12));
    }
  }

  // ---------- RENDER ----------
  function render(look, dir, f, sit) {
    const [cv, x] = mk(CW, CH);
    x.translate(1, 3);
    const r = R(x); r.ctx = x;
    const I = PHO.ITEMS;
    const skin = I.SKINS[look.skin] || I.SKINS[1];
    const H = I.head(look.head), S = I.set(look.set);
    const hy = (f === 1 || f === 3) ? -1 : 0;
    const hair = H.hair, hat = H.hat;
    const hs = HAIR[hair.s] || HAIR.short;
    hs.back(r, dir, hair.c, hair.a);
    if (!sit) legs(r, dir, f, S, skin, hy);
    const sd = dark(skin, .14);
    if (dir === 'l') {
      // tay xa (tối) → thân → tay gần
      const ax = [0, 1, 0, -1][f];
      r(13 + ax, 17 + hy, 3, 6, S.sleeve === 'none' ? sd : dark(S.top === 'overall' ? S.c2 : S.c1, .22));
      r(13 + ax, 21, 3, 2 - 0, sd);
      torso(r, dir, S, skin, hy);
      bottom(r, dir, S, skin);
      const nx = [0, -1, 0, 1][f], sc = S.top === 'overall' ? S.c2 : S.c1;
      const sl = S.sleeve === 'long' ? 5 : S.sleeve === 'short' ? 3 : 0;
      if (sl) r(10 + nx, 17 + hy, 3, sl, sc);
      r(10 + nx, 17 + hy + sl, 3, 6 - sl - hy * 0, skin);
      r(12 + nx, 17 + hy, 1, 5, dark(sc, .14)); if (sl) r(10 + nx, 17 + hy, 1, sl, light(sc, .15));
      if (S.top === 'suit' && sl) r(10 + nx, 21, 3, 1, '#fffaf6');
    } else {
      torso(r, dir, S, skin, hy);
      arms(r, dir, f, S, skin, hy);
      bottom(r, dir, S, skin);
    }
    // đầu
    const hh = hy;
    r(8, 4 + hh, 8, 1, skin); r(6, 5 + hh, 12, 1, skin); r(5, 6 + hh, 14, 8, skin); r(6, 14 + hh, 12, 1, skin); r(8, 15 + hh, 8, 1, skin);
    r(8, 15 + hh, 8, 1, dark(skin, .1)); r(6, 14 + hh, 12, 1, dark(skin, .05));
    if (dir !== 'u') face(r, dir, skin, hh);
    // tóc + mũ vẽ theo offset hh
    x.save(); x.translate(0, hh);
    const rr = R(x); rr.ctx = x;
    hs.front(rr, dir, hair.c, hair.a);
    if (hat) HAT[hat.k](rr, dir, hat);
    x.restore();
    G.outline(cv);
    return cv;
  }

  // lấy sprite: look = {skin, head, set}; dir d|u|l|r ; f 0..3 ; sit true/false
  function get(look, dir, f = 0, sit = false) {
    const key = look.skin + '|' + look.head + '|' + look.set + '|' + dir + '|' + f + '|' + (sit ? 1 : 0);
    let c = cache.get(key);
    if (c) return c;
    c = dir === 'r' ? G.flip(render(look, 'l', f, sit)) : render(look, dir, f, sit);
    if (cache.size > 900) cache.clear();
    cache.set(key, c);
    return c;
  }
  return { get, CW, CH, AX, AY };
})();
