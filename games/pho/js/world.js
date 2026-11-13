/* world.js — bố cục các "màn" (scene) của Phố: phố chính (có công viên), cửa hàng, quán cà phê.
   Mỗi scene gồm: nền (canvas vẽ sẵn), bản đồ va chạm, vật thể (xếp theo độ sâu), cửa, ghế ngồi, điểm bấm, nhãn chữ, NPC, hiệu ứng.
   Muốn thêm tòa nhà mới: vẽ mặt tiền trong art.js, rồi thêm 1 khối trong street() + 1 cửa (door). Toạ độ trong file này tính theo Ô (tile) trừ khi ghi "px". */
window.PHO = window.PHO || {};
PHO.world = (() => {
  const A = PHO.art, G = PHO.gfx, T = 16, { mk, R, hash, rng, ell, dark, light } = G;

  function Scene(id, name, w, h, chan) {
    const [gnd, gx] = mk(w * T, h * T);
    return {
      id, name, w, h, gnd, gx, chan, blocked: new Uint8Array(w * h), objs: [], doors: [], seats: [], hot: [], labels: [], npcs: [],
      under: [], over: [], coins: false, spawn: { x: w * T / 2, y: h * T / 2 }, bg: '#bfe8a6'
    };
  }
  const fill = (S, kind, x, y, w, h) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) A.TILE[kind](S.gx, i, j); };
  const block = (S, x, y, w = 1, h = 1, v = 1) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < S.w && j < S.h) S.blocked[j * S.w + i] = v; };
  // đặt sprite có góc trên-trái ở (x,y) px; sort = độ sâu (mặc định đáy sprite)
  const put = (S, spr, x, y, o = {}) => { const ob = { spr, x: Math.round(x), y: Math.round(y), sort: o.sort != null ? o.sort : Math.round(y) + spr.height }; if (spr.fadeable) ob.fade = 1; S.objs.push(ob); return ob; };
  // đặt sprite sao cho điểm (ax,ay) của sprite trùng (fx,fy) px
  const putAt = (S, spr, fx, fy, ax, ay, o) => put(S, spr, fx - ax, fy - ay, Object.assign({ sort: fy }, o));
  const label = (S, text, x, y, cls = 'sign') => S.labels.push({ text, x, y, cls });
  const tileOf = v => Math.floor(v / T);

  // ================= PHỐ CHÍNH =================
  function street() {
    const S = Scene('street', 'Phố', 92, 24, 'street');
    S.coins = true;
    // nền cỏ
    fill(S, 'grass', 0, 0, 92, 24);
    fill(S, 'hedge', 0, 0, 92, 2); fill(S, 'hedge', 0, 23, 92, 1);
    // đường lát chính (trái và phải), công viên có lối đi riêng
    fill(S, 'paver', 3, 9, 26, 7); fill(S, 'paver', 66, 9, 25, 7);
    fill(S, 'paver', 29, 9, 37, 4);
    // viền lề đường
    const gx = S.gx;
    gx.fillStyle = '#e4cba0'; gx.fillRect(3 * T, 16 * T, 26 * T, 2); gx.fillRect(66 * T, 16 * T, 25 * T, 2);
    gx.fillStyle = '#efdcb8'; gx.fillRect(3 * T, 16 * T + 2, 26 * T, 1); gx.fillRect(66 * T, 16 * T + 2, 25 * T, 1);
    // quảng trường tròn + đài phun nước
    const PC = { x: 41, y: 17, r: 5 };
    for (let y = 8; y < 23; y++) for (let x = 29; x < 66; x++) {
      const dx = x + .5 - PC.x, dy = y + .5 - PC.y; if (dx * dx + dy * dy <= PC.r * PC.r) A.TILE.plaza(gx, x, y);
    }
    // vành quảng trường
    gx.strokeStyle = '#e4d5bb'; gx.lineWidth = 2; gx.beginPath(); gx.arc(PC.x * T, PC.y * T, PC.r * T + 1, 0, 6.3); gx.stroke();
    // đường nhỏ nối ra nam
    fill(S, 'paver', 40, 13, 2, 1);
    // hồ cá (vẽ từng điểm ảnh cho tròn đẹp)
    const PD = { x: 54 * T, y: 17.5 * T, rx: 6.4 * T, ry: 4.1 * T };
    const rr = rng(77);
    for (let py = Math.floor(PD.y - PD.ry - 6); py < PD.y + PD.ry + 7; py++) for (let px = Math.floor(PD.x - PD.rx - 6); px < PD.x + PD.rx + 7; px++) {
      const d = ((px + .5 - PD.x) / PD.rx) ** 2 + ((py + .5 - PD.y) / PD.ry) ** 2;
      if (d <= 1) {
        gx.fillStyle = d > .82 ? A.PAL.waterD : A.PAL.water; gx.fillRect(px, py, 1, 1);
        if (rr() < .035) { gx.fillStyle = A.PAL.waterL; gx.fillRect(px, py, 2, 1); }
      } else if (d <= 1.26) { gx.fillStyle = (py > PD.y ? A.PAL.rimD : A.PAL.rim); gx.fillRect(px, py, 1, 1); if ((px + py) % 5 === 0) { gx.fillStyle = '#fffaf0'; gx.fillRect(px, py, 1, 1); } }
    }
    for (let ty = 0; ty < S.h; ty++) for (let tx = 0; tx < S.w; tx++) {
      const d = ((tx + .5) * T - PD.x) ** 2 / PD.rx ** 2 + ((ty + .5) * T - PD.y) ** 2 / PD.ry ** 2; if (d <= 1.35) S.blocked[ty * S.w + tx] = 1;
    }
    S.pond = PD;
    // khu đua ngựa: sân cát bên dưới
    fill(S, 'sand', 66, 17, 25, 5);
    gx.fillStyle = '#ffffff'; gx.fillRect(80 * T, 17 * T, 3, 5 * T); gx.fillStyle = '#ffb3cf'; for (let i = 0; i < 10; i++) gx.fillRect(80 * T + 3, 17 * T + i * 8, 3, 4);
    // viền biên: cây ở mép
    block(S, 0, 0, 92, 2); block(S, 0, 23, 92, 1); block(S, 0, 0, 3, 24); block(S, 90, 0, 2, 24);

    // ----- nhà Shopping -----
    const shop = A.shopFacade(); put(S, shop, 72, 32, { sort: 128 });
    block(S, 4, 2, 10, 7); block(S, 8, 8, 2, 1, 0);
    label(S, 'SHOPPING', 72 + 72, 32 + 40, 'sign pinks');
    S.doors.push({ x: 128, y: 128, w: 32, h: 16, to: 'shop', at: { x: 8 * T, y: 9.6 * T }, name: 'Cửa hàng', go: { x: 144, y: 134 } });
    S.hot.push({ x: 72, y: 32, w: 144, h: 112, go: { x: 144, y: 134 }, door: 0 });
    // ----- quán cà phê -----
    const cafe = A.cafeFacade(); put(S, cafe, 256, 32, { sort: 128 });
    block(S, 16, 2, 10, 7); block(S, 20, 8, 2, 1, 0);
    label(S, 'QUÁN CÀ PHÊ', 256 + 80, 32 + 44, 'sign cafes');
    S.doors.push({ x: 320, y: 128, w: 32, h: 16, to: 'cafe', at: { x: 10 * T, y: 10.4 * T }, name: 'Quán cà phê', go: { x: 336, y: 134 } });
    S.hot.push({ x: 256, y: 32, w: 160, h: 112, go: { x: 336, y: 134 }, door: 1 });
    // ----- khu đua ngựa -----
    const race = A.raceFacade(); put(S, race, 1120, 32, { sort: 128 });
    block(S, 70, 2, 10, 7); block(S, 74, 8, 2, 1, 0);
    label(S, 'ĐUA NGỰA', 1120 + 80, 32 + 57, 'sign races');
    S.doors.push({ x: 1184, y: 128, w: 32, h: 16, act: 'race', name: 'Khu đua ngựa', go: { x: 1200, y: 134 } });
    S.hot.push({ x: 1120, y: 32, w: 160, h: 112, go: { x: 1200, y: 134 }, door: 2 });

    // ----- hàng rào, cây, đèn quanh khu nhà -----
    const lampXs = [3.2, 14.2, 27.8, 67.5, 89];
    // khoảng giữa shop và cafe, hai bên
    [[13.7, 8.3], [14.1, 6.6], [14, 4.6]].forEach(([tx, ty], i) => putAt(S, A.bush(i + 2), tx * T + 8, ty * T + 12, 12, 14));
    [[27.6, 7.2], [27.9, 3.6]].forEach(([tx, ty], i) => putAt(S, A.tree('g', i), tx * T + 8, ty * T + 16, 26, 68));
    block(S, 13, 2, 3, 7); block(S, 26, 2, 3, 7);
    [[3.2, 4.5], [2.9, 7]].forEach(([tx, ty], i) => putAt(S, A.tree('g', i + 1), tx * T + 8, ty * T + 16, 26, 68));
    [[2.3, 11], [2.3, 14]].forEach(([tx, ty]) => putAt(S, A.bush(1), tx * T + 8, ty * T + 8, 12, 14));
    // chậu cây trước cửa
    [[6.2, 8.9], [11.8, 8.9], [18.2, 8.9], [23.8, 8.9], [72.2, 8.9], [77.8, 8.9]].forEach(([tx, ty]) => { putAt(S, A.planter(), tx * T, ty * T, 9, 19); });
    // đèn đường dọc lề (y=15.8)
    [4, 12.5, 27.5, 68.5, 78].forEach(tx => { putAt(S, A.lamp(), tx * T, 15.9 * T, 7, 49); block(S, Math.floor(tx), 15); });
    // hàng cây mép trên (che biên) và dưới
    [[2, 2.6], [30, 2.4], [38, 2.2], [46, 2.4], [53, 2.2], [66.5, 2.4]].forEach(([tx, ty], i) => putAt(S, A.tree('g', i + 7), tx * T + 8, ty * T + 12, 26, 66));
    // ----- bãi cỏ phía nam khu trái -----
    [[5, 18, 3], [9, 18.4, 2], [14, 19, 3], [19, 18.2, 2], [24, 19, 3]].forEach(([tx, ty, w], i) => { putAt(S, A.flowerbed(w * T, i + 1), tx * T, ty * T + 14, 0, 14); });
    [[9, 21.4], [20, 21.2]].forEach(([tx, ty], i) => putAt(S, A.tree('g', i + 3), tx * T + 8, ty * T + 16, 26, 68));
    block(S, 9, 20), block(S, 20, 21);
    // ghế dài hàng lề trái
    const seatsOf = (benchX, benchY) => [10, 28].map((dx, i) => ({ x: benchX + dx, y: benchY + 18 }));
    const addBench = (tx, ty) => {
      const bx = tx * T, by = ty * T - 24;     // đáy ghế nằm trên đường ty
      put(S, A.bench(), bx, by, { sort: by + 24 });
      block(S, Math.floor(tx), Math.floor(ty) - 1, 3, 1);
      seatsOf(bx, by).forEach((s, i) => S.seats.push({ id: 'b' + S.seats.length, x: s.x, y: s.y + 2, dir: 'd', at: { x: s.x, y: ty * T + 8 }, kind: 'bench', sort: by + 25 }));
    };
    // bắt đầu từ phố
    addBench(7, 17.4);

    // ----- ghế bàn cà phê vỉa hè -----
    [[17.2, 14.6], [22.6, 14.6]].forEach(([tx, ty], k) => {
      putAt(S, A.roundTable(), tx * T, ty * T, 15, 22);
      block(S, Math.floor(tx) - 1, Math.floor(ty) - 1, 2, 1);
      [['l', -22, 4, 'r'], ['r', 22, 4, 'l'], ['t', 0, -13, 'd']].forEach(([n, dx, dy, face]) => {
        const sx = tx * T + dx, sy = ty * T + dy + 2;
        putAt(S, A.stool(['#6fb7f0', '#f06b6b', '#6fd1a0', '#ffd34d'][(k + n.length) % 4]), sx, sy + 6, 7, 13);
        S.seats.push({ id: 'cs' + S.seats.length, x: sx, y: sy + 3, dir: face, at: { x: sx + (dx > 0 ? 8 : dx < 0 ? -8 : 0), y: sy + (dy < 0 ? -8 : 8) }, kind: 'stool' });
      });
    });

    // ================= CÔNG VIÊN =================
    // cây anh đào + cây xanh
    const sak = [[31, 5], [34, 4], [37, 6.2], [32.5, 8], [35.5, 8.2], [59, 4], [62, 5.4], [57, 6.4], [63.5, 8], [60, 8.2]];
    sak.forEach(([tx, ty], i) => { putAt(S, A.tree('sakura', i), tx * T + 8, ty * T + 16, 32, 68); block(S, Math.floor(tx), Math.floor(ty)); });
    const grn = [[40, 3.5], [44, 4.5], [48, 3.5], [52, 5], [42, 7.2], [47, 7.4], [55, 3.6], [30, 19.5], [33, 21.6], [62, 21], [64, 19], [64.2, 15], [30.6, 14.5], [63, 12.4]];
    grn.forEach(([tx, ty], i) => { putAt(S, A.tree('g', i), tx * T + 8, ty * T + 16, 26, 68); block(S, Math.floor(tx), Math.floor(ty)); });
    [[30, 8.6], [38.5, 8.6], [45, 8.6], [50, 8.8], [56, 8.8], [64, 7], [30, 11.6]].forEach(([tx, ty], i) => { putAt(S, A.bush(i), tx * T + 12, ty * T + 14, 12, 14); });
    // vườn hoa
    [[31, 12.7, 3], [49, 12.4, 2], [35, 20.6, 3], [41.5, 22, 3], [52, 22.4, 3], [60, 17.8, 3], [57, 23, 2]].forEach(([tx, ty, w], i) => putAt(S, A.flowerbed(w * T, i + 4), tx * T, ty * T, 0, 14));
    // ghế dài quanh công viên (hướng nam, xoay quanh đường đi)
    addBench(33, 9.1); addBench(38.5, 9.1); addBench(44.5, 9.1); addBench(50, 9.1); addBench(56, 9.1);
    addBench(36.2, 12.9); addBench(43.6, 12.9);
    addBench(52, 13.2); addBench(58.5, 13.2);
    // đài phun nước giữa quảng trường
    putAt(S, A.fountain(), PC.x * T, PC.y * T + 18, 35, 52); block(S, PC.x - 2, PC.y - 1, 4, 2);
    // đèn trong công viên
    [[34, 12.2], [48.5, 12.2], [62, 12.2], [36.2, 19.2], [46.2, 19.2], [31, 9.4]].forEach(([tx, ty]) => { putAt(S, A.lamp(), tx * T, ty * T + 16, 7, 49); block(S, Math.floor(tx), Math.floor(ty)); });
    // sen & lá sen trên hồ (vẽ đè lên nền, không va chạm)
    const lil = mk(40, 20), lx = lil[1];
    ell(lx, 10, 10, 8, 4, '#7fcf8f'); ell(lx, 10, 9, 8, 4, '#9be3a6'); lx.fillStyle = '#ffb3cf'; lx.fillRect(8, 5, 5, 4); lx.fillStyle = '#ff8fb8'; lx.fillRect(9, 3, 3, 3); lx.fillStyle = '#ffd34d'; lx.fillRect(10, 6, 1, 1);
    ell(lx, 29, 12, 6, 3, '#7fcf8f'); ell(lx, 29, 11, 6, 3, '#9be3a6');
    G.outline(lil[0], '#4a9a5e');
    S.under.push((ctx, cx, cy) => { ctx.drawImage(lil[0], PD.x - 38 - cx, PD.y - 10 - cy); ctx.drawImage(lil[0], PD.x + 12 - cx, PD.y + 6 - cy); });
    // cá koi bơi
    const fish = [0, 1, 2, 3].map(i => ({ ph: i * 1.7, sp: .5 + i * .13, rx: .45 + (i % 2) * .22, ry: .4 + (i % 3) * .15, c: i % 2 ? '#ffb070' : '#fff6ee', c2: i % 2 ? '#ff7a4a' : '#ff9a8a' }));
    S.under.push((ctx, cx, cy, t) => {
      fish.forEach(f => {
        const a = t * f.sp + f.ph, x = PD.x + Math.cos(a) * PD.rx * f.rx, y = PD.y + Math.sin(a * 1.3) * PD.ry * f.ry;
        const vx = -Math.sin(a) * f.rx, dir = vx >= 0 ? 1 : -1, px = Math.round(x - cx), py = Math.round(y - cy), wag = Math.sin(t * 8 + f.ph) > 0 ? 1 : 0;
        ctx.fillStyle = f.c; ctx.fillRect(px - 3, py - 1, 6, 3); ctx.fillStyle = f.c2; ctx.fillRect(px - 1 * dir - 1, py - 1, 2, 2);
        ctx.fillStyle = f.c; ctx.fillRect(px - 5 * dir + (dir > 0 ? 0 : 5) - (dir > 0 ? 0 : 0), py - 1 + wag, 2, 2);
        ctx.fillStyle = '#3a2c4a'; ctx.fillRect(px + 2 * dir - (dir > 0 ? 0 : 1), py - 1, 1, 1);
      });
      // gợn nước lấp lánh
      for (let i = 0; i < 9; i++) {
        const a = (t * .6 + i * 1.3) % 6.28, x = PD.x + Math.cos(a + i) * PD.rx * .8, y = PD.y + Math.sin(a * 1.1 + i) * PD.ry * .7;
        if (Math.sin(t * 3 + i * 2) > .45) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), 2, 1); }
      }
    });
    // tia nước đài phun lấp lánh
    S.over.push((ctx, cx, cy, t) => {
      for (let i = 0; i < 6; i++) {
        const ph = (t * 1.6 + i / 6) % 1, ang = i * 1.05 + 0.3, ox = Math.cos(ang) * 14 * ph, oy = -22 + ph * 24 - Math.sin(ph * 3.14) * 12;
        ctx.fillStyle = '#d4f2ff'; ctx.fillRect(Math.round(PC.x * T + ox - cx), Math.round(PC.y * T + 18 - 22 + oy - cy + 10), 1, 1);
      }
    });
    label(S, '🌸 Công viên', 31.5 * T, 10.4 * T, 'tag');
    label(S, '🐟 Hồ cá', PD.x, PD.y - PD.ry - 12, 'tag');

    // ================= KHU ĐUA NGỰA: chuồng & hàng rào =================
    const pad = [[82, 3, 9], [82, 8.2, 9]];
    for (let x = 80.8; x < 90; x += 5.9) { put(S, A.fence(96), x * T, 8.2 * T, { sort: 8.6 * T }); break; }
    put(S, A.fence(96), 81 * T, 3 * T + 4, { sort: 3 * T + 20 });
    block(S, 81, 3, 9, 1); block(S, 81, 8, 9, 1); block(S, 81, 3, 1, 6); block(S, 90, 3, 1, 6);
    const hs = [['#fffaf2', '#ff9fbd', 0], ['#c98b62', '#6a4a3a', 0]];
    const horses = [{ c: '#fffaf2', m: '#ff9fbd', x: 84.5 * T, y: 6.3 * T, n: 0 }, { c: '#d9a074', m: '#8a5c40', x: 88 * T, y: 5.5 * T, n: 0 }];
    S.over.push(null); S.over.pop();
    S.npcs.push({ kind: 'horse', horses });
    putAt(S, A.hay(), 83 * T + 8, 8.1 * T, 10, 16); putAt(S, A.hay(), 89 * T, 4.2 * T, 10, 16);
    [[67, 3.6], [68.6, 8.2]].forEach(([tx, ty], i) => { });
    putAt(S, A.banner(150, '#ff9fbd'), 1120 + 5, 32 + 91, 0, 0, { sort: 128 });
    // bụi cây và cây phía đua ngựa
    [[66.5, 4.5], [67.4, 7.2], [80, 12]].forEach(([tx, ty], i) => { if (i < 2) { putAt(S, A.tree('g', i + 6), tx * T + 8, ty * T + 16, 26, 68); } });
    block(S, 66, 4, 1, 1); block(S, 67, 7, 1, 1);
    [[70, 18.5, 3], [75, 18.8, 3], [84, 21.3, 3]].forEach(([tx, ty, w], i) => putAt(S, A.flowerbed(w * T, i + 9), tx * T, ty * T + 14, 0, 14));
    [[88.5, 21.2], [67.5, 21.4]].forEach(([tx, ty], i) => putAt(S, A.bush(i + 4), tx * T + 8, ty * T + 8, 12, 14));
    addBench(86, 19.2);
    addBench(72, 21.3);

    S.spawn = { x: 9 * T, y: 12 * T };
    return S;
  }

  // ================= CỬA HÀNG =================
  function shop() {
    const S = Scene('shop', 'Cửa hàng', 16, 11, 'shop');
    const gx = S.gx;
    fill(S, 'wood', 0, 4, 16, 7);
    // tường hồng + sọc giấy dán
    gx.fillStyle = '#ffd9e6'; gx.fillRect(0, 0, 16 * T, 4 * T);
    for (let x = 0; x < 16 * T; x += 8) { gx.fillStyle = (x / 8) % 2 ? '#ffd1e0' : '#ffe0ea'; gx.fillRect(x, 0, 4, 3 * T + 8); }
    gx.fillStyle = '#ffb3cd'; gx.fillRect(0, 3 * T + 8, 16 * T, 3); gx.fillStyle = '#f48db0'; gx.fillRect(0, 4 * T - 5, 16 * T, 5); gx.fillStyle = '#d97399'; gx.fillRect(0, 4 * T - 1, 16 * T, 1);
    gx.fillStyle = '#fff'; for (let x = 4; x < 16 * T; x += 16) { gx.fillRect(x, 0, 2, 2); }
    // thảm
    fill(S, 'carpet', 5, 7, 6, 3);
    gx.strokeStyle = '#ffb3cd'; gx.lineWidth = 1; gx.strokeRect(5 * T + .5, 7 * T + .5, 6 * T - 1, 3 * T - 1);
    // tường viền / chặn
    block(S, 0, 0, 16, 4); block(S, 0, 4, 1, 7); block(S, 15, 4, 1, 7);
    // kệ + gương + giá treo
    put(S, A.shelf(64), 12, 8, { sort: 40 }); put(S, A.shelf(64), 90, 8, { sort: 40 }); put(S, A.mirror(), 168, 20, { sort: 60 });
    put(S, A.rack('#ff9fbd'), 10, 46, { sort: 4 * T + 40 }); block(S, 1, 4, 3, 2);
    // đèn dây
    S.over.push((ctx, cx, cy, t) => { for (let x = 4; x < 16 * T; x += 12) { const y = 4 + Math.round(Math.sin(x / 20) * 2); ctx.fillStyle = (Math.floor(t * 2) + (x / 12 | 0)) % 2 ? '#fff3a6' : '#ff9fbd'; ctx.fillRect(x - cx, y - cy, 3, 3); } });
    // bục người mẫu + người mẫu mặc đồ
    const MQ = [['h_long_pink', 's_dress_flower', 4.6, 7.4], ['h_short_butter', 's_suit_navy', 7.2, 6.9], ['h_bun_black', 's_aodai_red', 9.6, 7.4]];
    MQ.forEach(([h, s, tx, ty], i) => {
      const pod = mk(26, 10), pr = R(pod[1]); ell(pod[1], 13, 5, 12, 4, '#fff6ee'); ell(pod[1], 13, 4, 12, 4, '#ffffff'); G.outline(pod[0], '#d97399');
      putAt(S, pod[0], tx * T, ty * T + 2, 13, 8, { sort: ty * T - 1 });
      S.npcs.push({ kind: 'mannequin', look: { skin: 0, head: h, set: s }, x: tx * T, y: ty * T, dir: 'd', frozen: true });
      block(S, Math.floor(tx), Math.floor(ty - .3));
    });
    // quầy thu ngân + nhân viên + mèo may mắn
    const [ct, cx2] = mk(76, 36), cr = R(cx2);
    cr(0, 8, 76, 24, '#ff9fbd'); cr(0, 8, 76, 6, '#fff6ee'); cr(0, 13, 76, 1, '#e87fa3'); cr(0, 28, 76, 4, '#d97399');
    for (let i = 4; i < 70; i += 14) { cr(i, 17, 10, 9, '#ffb3cd'); cr(i + 1, 18, 8, 7, '#ffc4d8'); cr(i + 7, 21, 1, 2, '#ffd34d'); }
    cr(10, 2, 14, 7, '#c8c8d0'); cr(12, 3, 10, 3, '#9fd8f5'); cr(50, 4, 10, 4, '#fff3a6'); cr(52, 5, 6, 1, '#e8b330');
    G.outline(ct, '#c9708f');
    putAt(S, ct, 204, 6.3 * T, 38, 36, { sort: 6.3 * T }); block(S, 10, 5, 5, 2);
    S.npcs.push({ kind: 'clerk', look: { skin: 1, head: 'h_ears_white', set: 's_dress_mint' }, x: 204, y: 5.3 * T, dir: 'd', frozen: true, say: ['Chào mừng bạn đến cửa hàng! 💖', 'Mèo Thần Tài đang chờ chủ nhân nè~', 'Mỗi món chỉ 200 xu thôi nha!'] });
    putAt(S, A.luckyCat(), 204 + 26, 6.3 * T - 22, 10, 24, { sort: 6.3 * T + 1 });
    // ổ mèo thần tài (hiện vật bán pet)
    S.npcs.push({ kind: 'pet', pet: 'cat', x: 13.4 * T, y: 8.4 * T });
    ell(S.gx, 13.4 * T, 8.4 * T - 1, 11, 5, '#ffb3cd'); ell(S.gx, 13.4 * T, 8.4 * T - 2, 10, 4, '#ffd2e0');
    S.hot.push({ x: 9.5 * T, y: 4 * T, w: 5.5 * T, h: 3 * T, act: 'shop', go: { x: 12.7 * T, y: 7.8 * T } });
    S.hot.push({ x: 12.4 * T, y: 7.4 * T, w: 2 * T, h: 2 * T, act: 'shop', go: { x: 12.7 * T, y: 7.8 * T } });
    // cửa ra
    gx.fillStyle = '#ff9fbd'; gx.fillRect(7 * T, 10 * T + 4, 2 * T, 12); gx.fillStyle = '#ffd2e0'; for (let i = 0; i < 8; i++) gx.fillRect(7 * T + i * 4, 10 * T + 4, 2, 12);
    S.doors.push({ x: 7 * T, y: 10 * T + 2, w: 2 * T, h: 14, to: 'street', at: { x: 9 * T, y: 9.8 * T }, name: 'Ra phố' });
    label(S, 'CỬA HÀNG', 8 * T, 2 * T + 8, 'tag');
    S.spawn = { x: 8 * T, y: 9 * T };
    return S;
  }

  // ================= QUÁN CÀ PHÊ =================
  function cafe() {
    const S = Scene('cafe', 'Quán cà phê', 20, 12, 'cafe');
    const gx = S.gx;
    fill(S, 'cement', 0, 4, 20, 8);
    // tường vàng + ốp xanh
    gx.fillStyle = '#ffe9a8'; gx.fillRect(0, 0, 20 * T, 4 * T);
    for (let x = 0; x < 20 * T; x += 12) { gx.fillStyle = '#ffe19a'; gx.fillRect(x, 0, 1, 3 * T); }
    gx.fillStyle = '#79c3a0'; gx.fillRect(0, 2 * T + 8, 20 * T, 2 * T - 8); gx.fillStyle = '#5aa684'; for (let x = 0; x < 20 * T; x += 6) gx.fillRect(x, 2 * T + 12, 1, 2 * T - 12);
    gx.fillStyle = '#fff'; gx.fillRect(0, 2 * T + 6, 20 * T, 3); gx.fillStyle = '#4f9c7c'; gx.fillRect(0, 4 * T - 3, 20 * T, 3);
    // cửa sổ có rèm tre
    [[2.2, 0.6], [8.6, 0.6]].forEach(([tx, ty]) => {
      const x0 = tx * T, y0 = ty * T; gx.fillStyle = '#fff'; gx.fillRect(x0 - 2, y0 - 2, 52, 38); gx.fillStyle = '#bfe6f5'; gx.fillRect(x0, y0, 48, 34);
      gx.fillStyle = '#fff'; gx.fillRect(x0 + 23, y0, 2, 34); gx.fillStyle = '#e8c9a0'; gx.fillRect(x0, y0, 48, 14); for (let yy = y0; yy < y0 + 14; yy += 3) { gx.fillStyle = '#c9a574'; gx.fillRect(x0, yy + 2, 48, 1); }
    });
    block(S, 0, 0, 20, 4); block(S, 0, 4, 1, 8); block(S, 19, 4, 1, 8);
    // tranh ảnh, thực đơn
    putAt(S, A.frame(24, 24, 'nonla'), 5.6 * T, 0.5 * T + 24, 0, 24, { sort: 40 });
    putAt(S, A.frame(24, 24, 'lotus'), 12.6 * T, 0.4 * T + 24, 0, 24, { sort: 40 });
    // quầy + barista
    putAt(S, A.counter(112), 12 * T, 5 * T + 2, 0, 40, { sort: 5 * T + 2 }); block(S, 12, 3, 7, 2);
    S.npcs.push({ kind: 'barista', look: { skin: 2, head: 'h_bun_orange', set: 's_aodai_red' }, x: 15.5 * T, y: 4.2 * T, dir: 'd', frozen: true, say: ['Cà phê sữa đá nè! ☕', 'Bạn ngồi đâu cũng được nha~', 'Phin cà phê Việt thơm lắm đó!'] });
    label(S, 'MENU: cà phê sữa · bạc xỉu · trà đào', 16.2 * T, 1.2 * T, 'tag');
    // dây đèn lồng đung đưa
    const L = [A.lantern('#ff6b6b'), A.lantern('#ffd34d'), A.lantern('#ff6b6b')];
    S.over.push((ctx, cx, cy, t) => {
      for (let i = 0; i < 7; i++) { const x = 28 + i * 48, sw = Math.sin(t * 1.4 + i) * 1.5; ctx.drawImage(L[i % 3], Math.round(x - 7 + sw - cx), Math.round(6 - cy)); }
    });
    // cây & chậu treo
    [[1.2, 4.8], [18.6, 4.6], [1.2, 10.8], [18.6, 10.8]].forEach(([tx, ty], i) => { putAt(S, A.ficus(i), tx * T, ty * T + 8, 13, 38); block(S, Math.floor(tx), Math.floor(ty)); });

    const seatCaf = (sx, sy, face, appr, kind = 'stool') => S.seats.push({ id: 'c' + S.seats.length, x: sx, y: sy, dir: face, at: appr, kind });
    // ---- KHU 1 (trái): sofa + bàn chữ nhật + 2 bàn tròn
    putAt(S, A.sofa(), 3.2 * T, 4.9 * T, 0, 30, { sort: 4.8 * T }); block(S, 3, 3, 3, 2);
    seatCaf(3.2 * T + 14, 4.9 * T - 6, 'd', { x: 3.2 * T + 14, y: 7.2 * T }, 'sofa'); seatCaf(3.2 * T + 34, 4.9 * T - 6, 'd', { x: 3.2 * T + 34, y: 7.2 * T }, 'sofa'); S.seats.slice(-2).forEach(q => q.sort = 4.8 * T + 1);
    putAt(S, A.rectTable(), 4.7 * T + 8, 6.6 * T, 23, 26, { sort: 6.6 * T }); block(S, 3, 6, 3, 1);
    [[-13, 'u'], [13, 'u']].forEach(([dx, f]) => { const sx = 4.7 * T + 8 + dx, sy = 6.6 * T + 9; putAt(S, A.stool('#6fb7f0'), sx, sy + 6, 7, 13); seatCaf(sx, sy + 3, f, { x: sx, y: sy + 15 }); });
    [[2.8, 9.2], [7.8, 9.6]].forEach(([tx, ty], k) => {
      putAt(S, A.roundTable(), tx * T, ty * T, 15, 22, { sort: ty * T }); block(S, Math.floor(tx) - 1, Math.floor(ty) - 1, 2, 1);
      [['l', -21, 3, 'r'], ['r', 21, 3, 'l'], ['b', 0, 16, 'u']].forEach(([n, dx, dy, face]) => {
        const sx = tx * T + dx, sy = ty * T + dy; putAt(S, A.stool(['#f06b6b', '#6fd1a0', '#ffd34d'][(k + n.length) % 3]), sx, sy + 6, 7, 13);
        seatCaf(sx, sy + 3, face, { x: sx + (dx > 0 ? 8 : dx < 0 ? -8 : 0), y: sy + (dy > 8 ? 8 : 8) });
      });
    });
    // ---- KHU 2 (phải): 2 bàn chữ nhật kiểu cà phê vỉa hè, ghế nhựa
    [[14, 8.3], [16.5, 10.6]].forEach(([tx, ty], k) => {
      putAt(S, A.rectTable(), tx * T + 8, ty * T, 23, 26, { sort: ty * T }); block(S, Math.floor(tx) - 1, Math.floor(ty) - 1, 3, 1);
      [[-13, 't', 'd'], [13, 't', 'd'], [-13, 'b', 'u'], [13, 'b', 'u']].forEach(([dx, pos, face]) => {
        const sx = tx * T + 8 + dx, sy = pos === 't' ? ty * T - 14 : ty * T + 9; putAt(S, A.stool(['#6fb7f0', '#f06b6b', '#6fd1a0', '#ffd34d'][(k * 2 + (dx > 0 ? 1 : 0)) % 4]), sx, sy + 6, 7, 13);
        seatCaf(sx, sy + 3, face, { x: sx, y: pos === 't' ? sy - 8 : sy + 14 });
      });
    });
    // cửa ra
    gx.fillStyle = '#7a5a40'; gx.fillRect(9 * T, 11 * T + 4, 2 * T, 12); gx.fillStyle = '#e8c68a'; gx.fillRect(9 * T + 2, 11 * T + 6, 2 * T - 4, 8); gx.fillStyle = '#79c3a0'; for (let i = 0; i < 4; i++) gx.fillRect(9 * T + 4 + i * 6, 11 * T + 6, 3, 8);
    S.doors.push({ x: 9 * T, y: 11 * T + 2, w: 2 * T, h: 14, to: 'street', at: { x: 21 * T - 4, y: 9.8 * T }, name: 'Ra phố' });
    // bàn ghế che mất ghế ngồi → loại ghế bị chặn
    S.spawn = { x: 10 * T, y: 10.2 * T };
    return S;
  }

  const builders = { street, shop, cafe }, built = {};
  return {
    get(id) { return built[id] || (built[id] = builders[id]()); },
    T, tileOf,
    walkable(S, px, py) { const tx = Math.floor(px / T), ty = Math.floor(py / T); return tx >= 0 && ty >= 0 && tx < S.w && ty < S.h && !S.blocked[ty * S.w + tx]; }
  };
})();
