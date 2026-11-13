/* art.js — toàn bộ hình vẽ của khu phố: ô nền, cây, ghế, đèn, nhà... (vẽ bằng code, tông pastel).
   Muốn đổi màu cả khu phố: sửa bảng PAL. Muốn thêm đồ trang trí: thêm 1 hàm vào PROPS rồi gọi trong world.js */
window.PHO = window.PHO || {};
PHO.art = (() => {
  const G = PHO.gfx, { mk, R, dark, light, mix, rng, hash, disc, ell } = G, T = 16;

  const PAL = {
    grassA: '#b6e59e', grassB: '#b0e198', tuft: '#93cf7d', tuftL: '#cdf2b8',
    paver: '#f6e5c8', paverJ: '#e6cea6', paverL: '#fff3de',
    plazaA: '#faf1e6', plazaB: '#f4e9d9', plazaJ: '#e7dac5',
    sand: '#f6dfae', sandD: '#e9c98b',
    water: '#86cfee', waterL: '#b3e6f8', waterD: '#66b6e0',
    rim: '#efe2c9', rimD: '#d9c7a4',
    hedge: '#6bbf78', hedgeD: '#52a666',
    wood: '#c98f66', woodD: '#a5704f', woodL: '#e3ae83',
    plum: '#54405f'
  };

  // ---------- ô nền ----------
  function grass(ctx, tx, ty) {
    const px = tx * T, py = ty * T, rr = rng(tx * 977 + ty * 131 + 7);
    ctx.fillStyle = ((tx + ty) & 1) ? PAL.grassA : PAL.grassB; ctx.fillRect(px, py, T, T);
    for (let i = 0; i < 3; i++) {
      const x = px + 1 + (rr() * 12 | 0), y = py + 2 + (rr() * 12 | 0);
      ctx.fillStyle = PAL.tuft; ctx.fillRect(x, y, 1, 2); ctx.fillRect(x + 2, y + 1, 1, 1);
      ctx.fillStyle = PAL.tuftL; ctx.fillRect(x + 1, y - 1, 1, 1);
    }
    if (rr() < .09) {
      const x = px + 3 + (rr() * 9 | 0), y = py + 3 + (rr() * 9 | 0), c = ['#ffffff', '#ffb3cf', '#fff08a', '#d3bdf7'][rr() * 4 | 0];
      ctx.fillStyle = c; ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3);
      ctx.fillStyle = '#ffd34d'; ctx.fillRect(x, y, 1, 1);
    }
  }
  function paver(ctx, tx, ty) {
    const px = tx * T, py = ty * T, rr = rng(tx * 31 + ty * 17);
    ctx.fillStyle = PAL.paver; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = PAL.paverJ;
    for (let r = 0; r < 2; r++) {
      const y0 = py + r * 8; ctx.fillRect(px, y0 + 7, T, 1);
      const o = r ? 4 : 0; ctx.fillRect(px + o, y0, 1, 7); ctx.fillRect(px + o + 8, y0, 1, 7);
    }
    ctx.fillStyle = PAL.paverL;
    for (let i = 0; i < 4; i++) ctx.fillRect(px + (rr() * 15 | 0), py + (rr() * 15 | 0), 1, 1);
  }
  function plaza(ctx, tx, ty) {
    const px = tx * T, py = ty * T;
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      ctx.fillStyle = ((tx * 2 + a + ty * 2 + b) & 1) ? PAL.plazaA : PAL.plazaB; ctx.fillRect(px + a * 8, py + b * 8, 8, 8);
      ctx.fillStyle = PAL.plazaJ; ctx.fillRect(px + a * 8 + 7, py + b * 8, 1, 8); ctx.fillRect(px + a * 8, py + b * 8 + 7, 8, 1);
    }
  }
  function sand(ctx, tx, ty) {
    const px = tx * T, py = ty * T, rr = rng(tx * 53 + ty * 29);
    ctx.fillStyle = PAL.sand; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = PAL.sandD;
    for (let i = 0; i < 5; i++) ctx.fillRect(px + (rr() * 15 | 0), py + (rr() * 15 | 0), 1, 1);
    ctx.fillStyle = '#fff1cc';
    for (let i = 0; i < 3; i++) ctx.fillRect(px + (rr() * 15 | 0), py + (rr() * 15 | 0), 2, 1);
  }
  function wood(ctx, tx, ty) {
    const px = tx * T, py = ty * T, rr = rng(tx * 13 + ty * 71);
    for (let r = 0; r < 4; r++) {
      ctx.fillStyle = (r + tx + ty) % 2 ? '#f7dcc4' : '#f4d4b8'; ctx.fillRect(px, py + r * 4, T, 4);
      ctx.fillStyle = '#e6bf9f'; ctx.fillRect(px, py + r * 4 + 3, T, 1);
      ctx.fillRect(px + ((r * 7 + tx * 5) % 15), py + r * 4, 1, 3);
    }
    if (rr() < .25) { ctx.fillStyle = '#e0b592'; ctx.fillRect(px + 3 + (rr() * 9 | 0), py + 1 + (rr() * 10 | 0), 2, 1); }
  }
  // gạch bông (gạch men hoa quen thuộc của quán cà phê Việt)
  function cement(ctx, tx, ty) {
    const px = tx * T, py = ty * T;
    ctx.fillStyle = '#fbf3e2'; ctx.fillRect(px, py, T, T);
    ctx.fillStyle = '#eadcc0'; ctx.fillRect(px, py, T, 1); ctx.fillRect(px, py, 1, T);
    for (let y = 0; y < 16; y++) {
      const w = Math.floor(8 - Math.abs(y - 7.5));
      ctx.fillStyle = '#b4e0d4'; ctx.fillRect(px + 8 - w, py + y, w * 2, 1);
      const w2 = w - 2; if (w2 > 0) { ctx.fillStyle = '#fbf3e2'; ctx.fillRect(px + 8 - w2, py + y, w2 * 2, 1); }
      const w3 = w - 4; if (w3 > 0) { ctx.fillStyle = '#f7bcae'; ctx.fillRect(px + 8 - w3, py + y, w3 * 2, 1); }
    }
    ctx.fillStyle = '#f7bcae'; [[1, 1], [14, 1], [1, 14], [14, 14]].forEach(([x, y]) => ctx.fillRect(px + x, py + y, 2, 2));
    ctx.fillStyle = '#ffe28a'; ctx.fillRect(px + 7, py + 7, 2, 2);
  }
  function carpet(ctx, tx, ty) {
    const px = tx * T, py = ty * T;
    ctx.fillStyle = (tx + ty) % 2 ? '#ffd9e6' : '#ffe6ee'; ctx.fillRect(px, py, T, T);
  }
  function hedgeTile(ctx, tx, ty) {
    const px = tx * T, py = ty * T, rr = rng(tx * 5 + ty * 3);
    ctx.fillStyle = PAL.hedgeD; ctx.fillRect(px, py, T, T);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? PAL.hedge : '#7ed08a'; ctx.fillRect(px + (rr() * 12 | 0), py + (rr() * 12 | 0), 4, 3); }
  }
  const TILE = { grass, paver, plaza, sand, wood, cement, carpet, hedge: hedgeTile };

  // ---------- đồ trang trí ----------
  const cache = {};
  const memo = (k, f) => cache[k] || (cache[k] = f());

  function leafCanopy(x, cx, cy, rx, ry, pal, seed) {
    const rr = rng(seed);
    const blobs = [[0, 0, 1], [-.62, .22, .62], [.62, .22, .62], [0, -.55, .62], [-.45, -.4, .5], [.45, -.4, .5], [0, .5, .55]];
    blobs.forEach(([bx, by, s]) => ell(x, cx + bx * rx + 2, cy + by * ry + 3, Math.round(rx * s), Math.round(ry * s), pal.d));
    blobs.forEach(([bx, by, s]) => ell(x, cx + bx * rx, cy + by * ry, Math.round(rx * s), Math.round(ry * s), pal.m));
    blobs.forEach(([bx, by, s]) => ell(x, cx + bx * rx - 2, cy + by * ry - 2, Math.round(rx * s * .6), Math.round(ry * s * .6), pal.l));
    for (let i = 0; i < 26; i++) {
      const a = rr() * 6.28, d = rr() * .85, px = cx + Math.cos(a) * rx * d, py = cy + Math.sin(a) * ry * d;
      x.fillStyle = rr() < .5 ? pal.s1 : pal.s2; x.fillRect(Math.round(px), Math.round(py), 2, 1);
    }
  }
  function tree(kind, seed) {
    return memo('tree' + kind + seed, () => {
      const sak = kind === 'sakura';
      const [cv, x] = mk(sak ? 64 : 52, 70);
      const cx = sak ? 32 : 26, tc = sak ? '#a77b68' : '#a97c5a';
      // thân
      x.fillStyle = tc; x.fillRect(cx - 3, 44, 7, 25); x.fillRect(cx - 5, 64, 3, 5); x.fillRect(cx + 3, 64, 3, 5);
      x.fillStyle = dark(tc, .22); x.fillRect(cx + 1, 44, 3, 25);
      if (sak) { x.fillStyle = tc; x.fillRect(cx - 12, 36, 4, 3); x.fillRect(cx + 9, 34, 4, 3); }
      const pal = sak
        ? { d: '#f08fb2', m: '#ffb5d0', l: '#ffd8e7', s1: '#fff0f6', s2: '#f7a0c0' }
        : [{ d: '#52ad69', m: '#76cf80', l: '#a4e79a', s1: '#b9f0aa', s2: '#4a9f62' }, { d: '#5aaf7a', m: '#80d495', l: '#b1ecb4', s1: '#c6f5c3', s2: '#4a9f6e' }][seed % 2];
      leafCanopy(x, cx, 26, sak ? 25 : 21, sak ? 20 : 19, pal, seed * 13 + 5);
      G.outline(cv, sak ? '#c96f94' : '#4a9a5e');
      cv.fadeable = true;   // cây sẽ mờ đi khi có người đứng sau tán lá
      return cv;
    });
  }
  function bush(seed) {
    return memo('bush' + seed, () => {
      const [cv, x] = mk(24, 16);
      leafCanopy(x, 12, 8, 9, 6, { d: '#52ad69', m: '#76cf80', l: '#a4e79a', s1: '#b9f0aa', s2: '#4a9f62' }, seed + 3);
      if (seed % 2) { x.fillStyle = '#ffb3cf'; [[6, 5], [15, 7], [11, 3]].forEach(([a, b]) => x.fillRect(a, b, 2, 2)); }
      G.outline(cv, '#4a9a5e'); return cv;
    });
  }
  function lamp() {
    return memo('lamp', () => {
      const [cv, x] = mk(14, 50), r = R(x);
      r(6, 12, 2, 36, '#8a7a9c'); r(4, 46, 6, 3, '#6d5d80'); r(5, 44, 4, 2, '#7b6a8e'); r(7, 12, 1, 34, '#a898b8');
      r(3, 3, 8, 9, '#fff0a8'); r(4, 1, 6, 2, '#8a7a9c'); r(5, 0, 4, 1, '#8a7a9c'); r(4, 4, 2, 4, '#fffbe0'); r(3, 11, 8, 2, '#8a7a9c');
      G.outline(cv); return cv;
    });
  }
  function bench() {
    return memo('bench', () => {
      const [cv, x] = mk(38, 24), r = R(x);
      r(2, 0, 34, 3, '#9bd8c4'); r(2, 4, 34, 3, '#8ccbb6'); r(1, 0, 2, 13, '#7fb9a5'); r(35, 0, 2, 13, '#7fb9a5');
      r(1, 9, 36, 3, '#c98f66'); r(1, 12, 36, 2, '#a5704f'); r(1, 9, 36, 1, '#e3ae83');
      r(2, 14, 3, 7, '#6d5d80'); r(33, 14, 3, 7, '#6d5d80'); r(4, 18, 30, 1, '#6d5d80');
      G.outline(cv); return cv;
    });
  }
  function fountain() {
    return memo('fountain', () => {
      const [cv, x] = mk(70, 58), r = R(x);
      ell(x, 35, 40, 33, 15, '#d9c7a4'); ell(x, 35, 38, 33, 15, '#f1e5cd'); ell(x, 35, 38, 28, 12, '#8fd6f2'); ell(x, 33, 36, 22, 8, '#b3e6f8');
      r(31, 18, 8, 22, '#e6d6ba'); r(29, 36, 12, 4, '#d9c7a4'); ell(x, 35, 22, 13, 5, '#f1e5cd'); ell(x, 35, 21, 10, 3, '#8fd6f2');
      r(34, 6, 2, 14, '#d4f2ff'); r(33, 4, 4, 3, '#eaf9ff');
      G.outline(cv, '#b5a07c'); return cv;
    });
  }
  function flowerbed(w, seed) {
    return memo('fb' + w + seed, () => {
      const [cv, x] = mk(w, 14), rr = rng(seed * 7 + 1), r = R(x);
      r(0, 8, w, 6, '#9a7a5a'); r(0, 8, w, 1, '#b8946e'); r(0, 13, w, 1, '#7d6046');
      const cols = ['#ff9fbd', '#fff3a6', '#ffffff', '#c4a8f0', '#ffb88a'];
      for (let i = 0; i < w / 3; i++) {
        const px = 1 + Math.floor(rr() * (w - 4)), py = 2 + Math.floor(rr() * 7), c = cols[rr() * cols.length | 0];
        r(px, py + 3, 1, 5, '#6cc07a'); r(px - 1, py, 3, 3, c); r(px, py + 1, 1, 1, '#ffd34d');
      }
      G.outline(cv, '#7d6046'); return cv;
    });
  }
  function planter() {
    return memo('planter', () => {
      const [cv, x] = mk(18, 20), r = R(x);
      r(2, 10, 14, 9, '#e8a07e'); r(1, 9, 16, 3, '#f2b595'); r(2, 17, 14, 2, '#c97f5f');
      leafCanopy(x, 9, 6, 7, 5, { d: '#52ad69', m: '#76cf80', l: '#a4e79a', s1: '#b9f0aa', s2: '#4a9f62' }, 9);
      [[5, 4], [11, 3], [8, 7], [13, 7]].forEach(([a, b], i) => { r(a, b, 2, 2, ['#ff9fbd', '#fff3a6', '#ffffff', '#ff9fbd'][i]); });
      G.outline(cv); return cv;
    });
  }
  function hay() {
    return memo('hay', () => {
      const [cv, x] = mk(20, 16), r = R(x);
      r(1, 3, 18, 11, '#f2d27a'); r(1, 3, 18, 2, '#f8e39a'); r(1, 11, 18, 3, '#d9b45a'); r(6, 3, 1, 11, '#d9b45a'); r(13, 3, 1, 11, '#d9b45a');
      G.outline(cv); return cv;
    });
  }
  function signpost(text) { return null; }
  function stool(c) {
    return memo('stool' + c, () => {
      const [cv, x] = mk(14, 14), r = R(x);
      r(2, 8, 2, 5, dark(c, .25)); r(10, 8, 2, 5, dark(c, .25)); r(6, 9, 2, 4, dark(c, .35));
      ell(x, 7, 6, 6, 3, dark(c, .12)); ell(x, 7, 5, 6, 3, c); r(4, 4, 3, 1, light(c, .4));
      G.outline(cv); return cv;
    });
  }
  function roundTable() {
    return memo('rtable', () => {
      const [cv, x] = mk(30, 26), r = R(x);
      r(13, 12, 4, 12, '#a5704f'); r(8, 22, 14, 3, '#8a5c3f');
      ell(x, 15, 10, 13, 6, '#c98f66'); ell(x, 15, 8, 13, 6, '#fff1d6'); ell(x, 15, 8, 11, 4, '#fff8e8');
      // ly cà phê + phin
      r(9, 5, 4, 4, '#e8c9a0'); r(10, 6, 2, 2, '#7a4a30'); r(18, 6, 3, 4, '#d6e8f2'); r(19, 7, 1, 2, '#9a5a38'); r(18, 5, 3, 1, '#c8c8d0');
      G.outline(cv); return cv;
    });
  }
  function rectTable() {
    return memo('ttable', () => {
      const [cv, x] = mk(46, 28), r = R(x);
      r(3, 14, 3, 12, '#8a5c3f'); r(40, 14, 3, 12, '#8a5c3f');
      r(1, 6, 44, 10, '#c98f66'); r(1, 6, 44, 6, '#e8c9a0'); r(1, 11, 44, 1, '#c98f66'); r(1, 15, 44, 1, '#a5704f');
      r(8, 6, 5, 4, '#d6e8f2'); r(9, 7, 3, 2, '#9a5a38'); r(26, 6, 4, 4, '#e8c9a0'); r(27, 7, 2, 2, '#7a4a30'); r(36, 5, 3, 5, '#f6c4d4');
      G.outline(cv); return cv;
    });
  }
  function sofa() {
    return memo('sofa', () => {
      const [cv, x] = mk(48, 30), r = R(x);
      r(0, 0, 48, 14, '#e68a78'); r(0, 0, 48, 3, '#f2a595'); r(2, 14, 44, 10, '#f0a090'); r(0, 8, 6, 18, '#d97a68'); r(42, 8, 6, 18, '#d97a68');
      r(24, 3, 1, 20, '#d97a68'); r(4, 24, 3, 4, '#7b5640'); r(41, 24, 3, 4, '#7b5640'); r(10, 4, 8, 6, '#ffe9b8'); r(30, 4, 8, 6, '#bfe3ff');
      G.outline(cv); return cv;
    });
  }
  function ficus(seed) {
    return memo('ficus' + seed, () => {
      const [cv, x] = mk(26, 40), r = R(x);
      r(5, 28, 16, 11, '#e8a07e'); r(4, 27, 18, 3, '#f2b595'); r(5, 37, 16, 2, '#c97f5f');
      r(12, 14, 2, 14, '#8a6a4a');
      leafCanopy(x, 13, 13, 10, 11, { d: '#3f9a5e', m: '#5fbf77', l: '#8fdc97', s1: '#a8eaa8', s2: '#3f9a5e' }, 21 + seed);
      G.outline(cv, '#3f8a56'); return cv;
    });
  }
  function counter(w) {
    return memo('counter' + w, () => {
      const [cv, x] = mk(w, 40), r = R(x);
      r(0, 8, w, 26, '#c98f66'); r(0, 8, w, 8, '#fff1d6'); r(0, 15, w, 1, '#e3ae83'); r(0, 30, w, 4, '#8a5c3f');
      for (let i = 4; i < w - 4; i += 12) { r(i, 18, 9, 10, '#a5704f'); r(i + 1, 19, 7, 8, '#b8825a'); r(i + 6, 22, 1, 2, '#ffd34d'); }
      // đồ trên quầy: phin, ly, máy pha
      r(6, 2, 5, 6, '#c8c8d0'); r(7, 0, 3, 3, '#e4e4ea'); r(8, 8, 1, 1, '#7a4a30');
      r(16, 4, 4, 4, '#d6e8f2'); r(17, 5, 2, 2, '#9a5a38');
      r(w - 22, 0, 14, 8, '#7fb9a5'); r(w - 20, 1, 10, 3, '#bfe8d8'); r(w - 16, 8, 6, 1, '#6d9a8a');
      G.outline(cv); return cv;
    });
  }
  function lantern(c) {
    return memo('lant' + c, () => {
      const [cv, x] = mk(14, 22), r = R(x);
      r(6, 0, 2, 6, '#7a6a5a'); ell(x, 7, 13, 6, 7, dark(c, .15)); ell(x, 7, 12, 6, 7, c); r(5, 6, 4, 2, '#ffd34d'); r(5, 19, 4, 2, '#ffd34d');
      r(3, 9, 2, 4, light(c, .45)); r(7, 21, 1, 1, '#ffd34d');
      G.outline(cv); return cv;
    });
  }
  function frame(w, h, kind) {
    return memo('frame' + w + h + kind, () => {
      const [cv, x] = mk(w, h), r = R(x);
      r(0, 0, w, h, '#c98f66'); r(1, 1, w - 2, h - 2, '#fff7e8');
      if (kind === 'nonla') { r(w / 2 - 8, h / 2 - 2, 16, 3, '#f1d78f'); r(w / 2 - 5, h / 2 - 5, 10, 3, '#f1d78f'); r(w / 2 - 2, h / 2 - 7, 4, 2, '#e3c070'); }
      else if (kind === 'phin') { r(w / 2 - 5, h / 2 - 6, 10, 3, '#c8c8d0'); r(w / 2 - 4, h / 2 - 3, 8, 4, '#e0e0e8'); r(w / 2 - 3, h / 2 + 1, 6, 4, '#d6e8f2'); r(w / 2 - 2, h / 2 + 2, 4, 2, '#9a5a38'); }
      else if (kind === 'lotus') { ell(x, w / 2, h / 2 + 2, 7, 3, '#8ed39a'); r(w / 2 - 3, h / 2 - 3, 6, 4, '#ffb3cf'); r(w / 2 - 1, h / 2 - 5, 2, 3, '#ff8fb8'); }
      else if (kind === 'dress') { r(w / 2 - 4, h / 2 - 7, 8, 5, '#ffb3cf'); r(w / 2 - 6, h / 2 - 2, 12, 8, '#ff9fbd'); r(w / 2 - 1, h / 2 - 7, 2, 2, '#fff'); }
      G.outline(cv, '#a5704f'); return cv;
    });
  }

  // ---------- NHÀ ----------
  const scallops = (r, x0, x1, y, c, d, step = 8) => { for (let x = x0; x < x1; x += step) { r(x, y, step, 3, c); r(x + 1, y + 3, step - 2, 1, c); r(x + 2, y + 4, step - 4, 1, d); } };

  function mannequinWin(r, x0, y0, w, h) {
    r(x0, y0, w, h, '#d4effc'); r(x0, y0 + h - 8, w, 8, '#bfe3f4');
    for (let i = 0; i < 3; i++) r(x0 + 4 + i * 10, y0 + 2, 3, h - 2, '#eefaff');
    r(x0, y0 + 20, w, 1, '#b2d6e8');
    const outfits = [['#ff9fbd', '#ffe3ec'], ['#9fd8f5', '#5f8fd0'], ['#ffe38a', '#ffb88a'], ['#b9a6ec', '#8a7ad0']];
    for (let i = 0; i < 2; i++) {
      const [a, b] = outfits[(x0 + i * 2) % 4], mx = x0 + 8 + i * 20;
      r(mx + 2, y0 + 10, 6, 6, '#f3dcc8'); r(mx, y0 + 16, 10, 9, a); r(mx - 2, y0 + 17, 2, 6, a); r(mx + 10, y0 + 17, 2, 6, a); r(mx, y0 + 25, 10, 5, b);
      r(mx + 4, y0 + 30, 2, 5, '#9a8a9a'); r(mx + 1, y0 + 35, 8, 2, '#9a8a9a');
    }
  }

  function shopFacade() {
    return memo('shop', () => {
      const W = 144, H = 112, [cv, x] = mk(W, H), r = R(x);
      const pink = '#ff9fbd', pinkD = '#e87fa3', pinkL = '#ffd2e0', cream = '#fff3e4';
      // mái
      for (let y = 0; y < 22; y++) {
        const ins = Math.max(0, 7 - y); r(ins, y, W - ins * 2, 1, (y % 6 < 3) ? pink : '#f48db0');
        for (let xx = ins + (y % 6 < 3 ? 0 : 4); xx < W - ins; xx += 8) r(xx, y, 1, 1, pinkL);
      }
      r(7, 0, W - 14, 2, pinkL); r(0, 22, W, 4, pinkD); r(0, 26, W, 2, '#e6c9b5');
      // tường
      r(0, 28, W, H - 28, cream); r(0, 28, 6, H - 28, pinkL); r(W - 6, 28, 6, H - 28, pinkL);
      r(0, 104, W, 8, '#f3dac8'); r(0, 104, W, 1, '#e2c4ae');
      // bảng hiệu
      r(30, 30, 84, 20, '#fffaf2'); r(30, 30, 84, 2, pink); r(30, 48, 84, 2, pink); r(30, 30, 2, 20, pink); r(112, 30, 2, 20, pink);
      r(36, 32, 2, 3, pinkD); r(106, 32, 2, 3, pinkD); [[34, 33], [108, 33]].forEach(([a, b]) => r(a, b, 2, 2, '#ffd34d'));
      // mái hiên sọc
      for (let xx = 6; xx < W - 6; xx++) { const c = Math.floor((xx - 6) / 8) % 2 ? '#ffffff' : pink; r(xx, 54, 1, 8, c); }
      r(6, 54, W - 12, 1, pinkD); scallops(r, 6, W - 6, 62, '#ff9fbd', pinkD, 16);
      for (let xx = 6; xx < W - 6; xx += 16) { r(xx + 8, 62, 8, 3, '#ffffff'); r(xx + 9, 65, 6, 1, '#ffffff'); r(xx + 10, 66, 4, 1, '#e8dcd6'); }
      // cửa sổ trưng bày
      [[10, 72], [88, 72]].forEach(([wx, wy]) => {
        r(wx - 2, wy - 2, 50, 36, '#ffffff'); r(wx - 2, wy - 2, 50, 1, pinkL);
        mannequinWin(r, wx, wy, 46, 32);
      });
      // cửa chính
      r(54, 68, 36, 44, '#ffffff'); r(56, 70, 32, 42, '#ffd2e0'); r(58, 72, 28, 22, '#d4effc'); r(58, 72, 28, 2, '#bfe3f4'); r(70, 72, 4, 40, '#ffffff'); r(60, 76, 2, 10, '#eefaff');
      r(58, 96, 28, 16, '#ff9fbd'); r(60, 98, 24, 12, '#ffb3cd'); r(66, 100, 2, 3, '#ffd34d'); r(76, 100, 2, 3, '#ffd34d');
      r(60, 74, 10, 5, '#fffaf2'); r(62, 75, 6, 1, '#ff9fbd'); // biển OPEN
      // thảm chân
      r(58, 108, 28, 4, '#ff9fbd'); for (let xx = 58; xx < 86; xx += 4) r(xx, 108, 2, 4, '#ffd2e0');
      // chậu hoa
      [[4, 94], [124, 94]].forEach(([px, py]) => { r(px, py + 8, 14, 10, '#e8a07e'); r(px - 1, py + 6, 16, 3, '#f2b595'); ell(x, px + 7, py + 3, 8, 5, '#76cf80'); [[px + 2, py], [px + 8, py - 1], [px + 11, py + 3], [px + 5, py + 4]].forEach(([a, b], i) => r(a, b, 3, 3, ['#ff9fbd', '#fff3a6', '#ffffff', '#c4a8f0'][i])); });
      G.outline(cv, '#a96a85'); return cv;
    });
  }

  function cafeFacade() {
    return memo('cafe', () => {
      const W = 160, H = 112, [cv, x] = mk(W, H), r = R(x);
      const tile = '#ea916f', tileD = '#cf7656', tileL = '#f8b393', wall = '#ffe9a8', wallD = '#f0cf7e', green = '#79c3a0', greenD = '#5aa684';
      // mái ngói
      for (let y = 0; y < 24; y++) {
        const ins = Math.max(0, 8 - y); r(ins, y, W - ins * 2, 1, tile);
        if (y % 4 === 3) r(ins, y, W - ins * 2, 1, tileD);
        for (let xx = ins + (Math.floor(y / 4) % 2 ? 0 : 3); xx < W - ins; xx += 6) r(xx, y, 1, 3, y % 4 === 3 ? tileD : tileL);
      }
      r(8, 0, W - 16, 2, '#b85f47'); r(0, 24, W, 4, '#c96a4c'); r(0, 28, W, 2, '#e8c68a');
      // tường vàng kiểu Pháp
      r(0, 30, W, H - 30, wall); r(0, 30, 6, H - 30, '#ffffff'); r(W - 6, 30, 6, H - 30, '#ffffff'); r(0, 100, W, 12, wallD); r(0, 100, W, 1, '#d9b868');
      // bảng hiệu gỗ
      r(40, 34, 80, 20, '#b8825a'); r(42, 36, 76, 16, '#e3ae83'); r(40, 34, 80, 2, '#8a5c3f'); r(40, 52, 80, 2, '#8a5c3f'); r(46, 30, 2, 4, '#7a5a40'); r(112, 30, 2, 4, '#7a5a40');
      // cửa sổ vòm có cửa chớp xanh
      [[8, 66], [112, 66]].forEach(([wx, wy]) => {
        r(wx - 2, wy - 6, 44, 44, '#ffffff'); r(wx, wy - 4, 40, 40, '#bfe6f5'); r(wx, wy + 14, 40, 22, '#e8c9a0');
        for (let yy = wy + 14; yy < wy + 36; yy += 3) r(wx, yy, 40, 1, '#c9a574');
        r(wx + 19, wy - 4, 2, 40, '#ffffff'); r(wx, wy + 14, 40, 2, '#ffffff');
        r(wx - 8, wy - 6, 7, 44, green); r(wx + 41, wy - 6, 7, 44, green);
        for (let yy = wy - 4; yy < wy + 36; yy += 4) { r(wx - 7, yy, 5, 1, greenD); r(wx + 42, yy, 5, 1, greenD); }
        // hộp hoa
        r(wx - 2, wy + 36, 44, 7, '#8a5c3f'); r(wx - 2, wy + 36, 44, 2, '#a5704f');
        for (let i = 0; i < 9; i++) { r(wx + i * 5, wy + 32, 3, 5, '#6cc07a'); r(wx + i * 5 - 1, wy + 30, 4, 3, ['#ff9fbd', '#fff3a6', '#ffffff'][i % 3]); }
      });
      // mái hiên vải xanh-trắng ở giữa
      for (let xx = 54; xx < 106; xx++) r(xx, 56, 1, 8, Math.floor((xx - 54) / 6) % 2 ? '#ffffff' : green);
      scallops(r, 54, 106, 64, green, greenD, 12);
      // cửa gỗ hai cánh
      r(58, 70, 44, 42, '#7a5a40'); r(60, 72, 40, 40, '#b8825a'); r(60, 72, 19, 40, '#c48f66'); r(81, 72, 19, 40, '#c48f66');
      r(63, 75, 13, 18, '#bfe6f5'); r(84, 75, 13, 18, '#bfe6f5'); r(63, 75, 13, 2, '#eefaff'); r(84, 75, 13, 2, '#eefaff');
      r(74, 92, 2, 4, '#ffd34d'); r(84, 92, 2, 4, '#ffd34d'); r(64, 98, 11, 10, '#a5704f'); r(85, 98, 11, 10, '#a5704f');
      r(60, 108, 40, 4, '#e8c68a');
      // dây đèn lồng
      r(2, 58, W - 4, 1, '#7a6a5a');
      [8, 30, 52, 108, 130, 150].forEach((lx, i) => {
        const L = lantern(['#ff6b6b', '#ffd34d', '#ff6b6b'][i % 3]); x.drawImage(L, lx - 4, 56);
      });
      // chữ viết trên kính (giả) + biển nhỏ
      r(66, 62, 28, 5, '#fffaf2');
      G.outline(cv, '#a5784a'); return cv;
    });
  }

  function raceFacade() {
    return memo('race', () => {
      const W = 160, H = 112, [cv, x] = mk(W, H), r = R(x);
      const lil = '#c9b6f2', lilD = '#a590dc', lilL = '#e9defc', cream = '#f5f0ff';
      // cờ đuôi nheo trên cột
      [[10, 0], [140, 0]].forEach(([fx, fy]) => { r(fx, fy, 2, 40, '#8a7aa6'); r(fx + 2, fy + 2, 12, 4, '#ff9fbd'); r(fx + 2, fy + 6, 9, 4, '#ff9fbd'); r(fx + 2, fy + 10, 6, 3, '#ff9fbd'); });
      // mái
      for (let y = 14; y < 38; y++) {
        const ins = Math.max(0, 22 - (y - 14) * 1 + 10); r(Math.min(ins, 30) * 0 + 14 + Math.max(0, 8 - (y - 14)), y, W - 28 - Math.max(0, 8 - (y - 14)) * 2, 1, ((y - 14) % 6 < 3) ? lil : '#b8a3ea');
      }
      r(22, 14, W - 44, 2, lilL); r(8, 38, W - 16, 4, lilD); r(8, 42, W - 16, 2, '#d6c9ea');
      // tường
      r(8, 44, W - 16, H - 44, cream); r(8, 44, 6, H - 44, lilL); r(W - 14, 44, 6, H - 44, lilL); r(8, 100, W - 16, 12, '#e6dcf7');
      // bảng hiệu
      r(32, 46, 96, 22, '#ffffff'); r(32, 46, 96, 3, '#ff9fbd'); r(32, 65, 96, 3, '#ff9fbd'); r(32, 46, 3, 22, '#ff9fbd'); r(125, 46, 3, 22, '#ff9fbd');
      // cờ tam giác
      for (let xx = 14; xx < W - 14; xx += 10) { const c = ['#ff9fbd', '#fff3a6', '#a8e8d2', '#bfe3ff'][(xx / 10 | 0) % 4]; r(xx, 72, 8, 2, c); r(xx + 1, 74, 6, 2, c); r(xx + 2, 76, 4, 2, c); r(xx + 3, 78, 2, 1, c); }
      r(8, 71, W - 16, 1, '#8a7aa6');
      // móng ngựa vàng
      r(74, 80, 12, 2, '#ffd34d'); r(72, 82, 3, 8, '#ffd34d'); r(85, 82, 3, 8, '#ffd34d'); [84, 87].forEach(yy => { r(73, yy, 1, 1, '#c99b20'); r(86, yy, 1, 1, '#c99b20'); });
      // cổng sắt đôi
      r(56, 72, 48, 40, '#8a7aa6'); r(58, 74, 44, 38, '#6d5d8a');
      for (let xx = 60; xx < 100; xx += 5) { r(xx, 74, 2, 38, '#c9b6f2'); r(xx - 1, 74, 4, 2, '#e9defc'); }
      r(58, 90, 44, 2, '#c9b6f2'); r(79, 74, 2, 38, '#e9defc');
      // cửa sổ bên với bóng ngựa
      [[18, 84], [112, 84]].forEach(([wx, wy]) => { r(wx - 2, wy - 2, 34, 28, '#ffffff'); r(wx, wy, 30, 24, '#d9ecfb'); r(wx + 13, wy, 2, 24, '#ffffff'); r(wx, wy + 8, 30, 2, '#ffffff'); r(wx + 4, wy + 12, 6, 8, '#a590dc'); r(wx + 18, wy + 12, 6, 8, '#a590dc'); r(wx + 8, wy + 10, 3, 3, '#a590dc'); r(wx + 22, wy + 10, 3, 3, '#a590dc'); });
      r(0, 104, W, 8, '#e6dcf7');
      G.outline(cv, '#7e6bb0'); return cv;
    });
  }

  // vẽ khung ảnh/biển nhỏ cho nội thất
  function hangPlant() {
    return memo('hangplant', () => {
      const [cv, x] = mk(16, 30), r = R(x);
      r(7, 0, 2, 8, '#8a7a6a'); r(3, 8, 10, 6, '#e8a07e'); r(3, 8, 10, 2, '#f2b595');
      leafCanopy(x, 8, 17, 7, 6, { d: '#3f9a5e', m: '#5fbf77', l: '#8fdc97', s1: '#a8eaa8', s2: '#3f9a5e' }, 4); r(2, 20, 2, 8, '#5fbf77'); r(12, 19, 2, 10, '#5fbf77');
      G.outline(cv); return cv;
    });
  }
  function rack(color) {
    return memo('rack' + color, () => {
      const [cv, x] = mk(48, 44), r = R(x);
      r(1, 0, 46, 2, '#c8b6a6'); r(1, 0, 2, 40, '#b8a696'); r(45, 0, 2, 40, '#b8a696'); r(0, 40, 6, 3, '#9a8a7a'); r(42, 40, 6, 3, '#9a8a7a');
      const cols = [color, '#ffffff', '#9fd8f5', '#ffe38a', '#c4a8f0', '#ff9fbd'];
      for (let i = 0; i < 7; i++) { const c = cols[i % cols.length], hx = 5 + i * 6; r(hx + 1, 2, 1, 3, '#9a8a7a'); r(hx - 1, 5, 6, 3, c); r(hx - 1, 8, 6, 20, c); r(hx + 3, 8, 2, 20, dark(c, .12)); r(hx - 1, 26, 6, 2, dark(c, .1)); }
      G.outline(cv); return cv;
    });
  }
  function shelf(w) {
    return memo('shelf' + w, () => {
      const [cv, x] = mk(w, 36), r = R(x);
      r(0, 0, w, 36, '#e8c9a0'); r(1, 1, w - 2, 34, '#f6e2c0');
      [12, 24].forEach(yy => r(0, yy, w, 2, '#c98f66'));
      const cols = ['#ff9fbd', '#9fd8f5', '#ffe38a', '#c4a8f0', '#a8e8d2', '#ffffff'];
      for (let row = 0; row < 3; row++) for (let i = 0; i < Math.floor((w - 4) / 10); i++) { const c = cols[(i + row * 2) % cols.length]; r(3 + i * 10, row * 12 + 3, 8, 8, c); r(3 + i * 10, row * 12 + 3, 8, 2, light(c, .35)); r(3 + i * 10 + 6, row * 12 + 5, 2, 6, dark(c, .12)); }
      G.outline(cv, '#a5704f'); return cv;
    });
  }
  function luckyCat() {
    return memo('luckycat', () => {
      const [cv, x] = mk(20, 24), r = R(x);
      r(5, 11, 10, 11, '#fff6ee'); r(4, 3, 12, 9, '#fff6ee'); r(4, 1, 3, 3, '#fff6ee'); r(13, 1, 3, 3, '#fff6ee'); r(5, 2, 1, 1, '#ff9fb2'); r(14, 2, 1, 1, '#ff9fb2');
      r(6, 6, 2, 2, '#3a2c4a'); r(12, 6, 2, 2, '#3a2c4a'); r(9, 8, 2, 1, '#ff9fb2'); r(5, 8, 2, 1, '#ffc0cc'); r(13, 8, 2, 1, '#ffc0cc');
      r(7, 11, 6, 2, '#ee4f5a'); r(9, 12, 2, 3, '#ffd34d'); r(14, 12, 3, 7, '#fff6ee'); r(15, 9, 3, 4, '#fff6ee'); r(8, 15, 4, 5, '#ffd34d'); r(9, 16, 2, 3, '#e8b330');
      r(5, 20, 10, 3, '#e87a8a');
      G.outline(cv); return cv;
    });
  }
  function mirror() {
    return memo('mirror', () => {
      const [cv, x] = mk(24, 40), r = R(x);
      r(0, 0, 24, 40, '#c98f66'); r(2, 2, 20, 36, '#d9f0fb'); r(4, 4, 3, 26, '#f0fbff'); r(9, 4, 1, 14, '#f0fbff');
      G.outline(cv, '#a5704f'); return cv;
    });
  }
  function curtain() {
    return memo('curtain', () => {
      const [cv, x] = mk(32, 46), r = R(x);
      r(0, 0, 32, 3, '#c98f66'); r(1, 3, 30, 43, '#ffb3cd'); for (let i = 4; i < 30; i += 5) r(i, 3, 1, 43, '#f48db0'); r(1, 42, 30, 4, '#ffd2e0');
      G.outline(cv, '#c9708f'); return cv;
    });
  }
  function banner(w, color) {
    return memo('banner' + w + color, () => {
      const [cv, x] = mk(w, 12), r = R(x);
      r(0, 0, w, 2, '#8a7a6a');
      for (let xx = 2; xx < w - 6; xx += 10) { const c = [color, '#fff3a6', '#a8e8d2', '#ffffff'][((xx - 2) / 10 | 0) % 4]; r(xx, 2, 8, 2, c); r(xx + 1, 4, 6, 2, c); r(xx + 2, 6, 4, 2, c); r(xx + 3, 8, 2, 1, c); }
      return cv;
    });
  }
  function fence(w) {
    return memo('fence' + w, () => {
      const [cv, x] = mk(w, 16), r = R(x);
      r(0, 5, w, 2, '#f3e8d2'); r(0, 11, w, 2, '#f3e8d2');
      for (let xx = 1; xx < w; xx += 8) { r(xx, 2, 3, 13, '#fffaf0'); r(xx, 2, 3, 2, '#fff'); r(xx + 2, 4, 1, 11, '#e6d8be'); }
      G.outline(cv, '#b9a888'); return cv;
    });
  }

  return {
    PAL, T, TILE, tree, bush, lamp, bench, fountain, flowerbed, planter, hay, stool, roundTable, rectTable, sofa, ficus, counter, lantern, frame,
    shopFacade, cafeFacade, raceFacade, hangPlant, rack, shelf, luckyCat, mirror, curtain, banner, fence
  };
})();
