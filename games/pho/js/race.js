/* race.js — trò đua ngựa (chơi cho vui, KHÔNG có thưởng). Cược 1 trong 4 ngựa; ngựa nào về đích trước thắng.
   Dọc đường thỉnh thoảng có con kiến bò ngang → ngựa giẫm phải, dừng lại một lát (tạo hồi hộp).
   Cân bằng: ngựa đang dẫn đầu xa bị kiến ghé nhiều hơn, ngựa đứng cuối chạy nhỉnh hơn một chút.
   Chỉnh độ khó trong RC bên dưới. */
window.PHO = window.PHO || {};
PHO.race = (() => {
  const G = PHO.gfx, U = () => PHO.ui;
  const RC = {
    baseSpeed: 0.074,        // tiến độ mỗi giây (1 = hết đường) → khoảng 13 giây nếu không bị kiến
    jitter: 0.014,           // độ dao động tốc độ
    antMin: 1.7, antMax: 3.6,  // khoảng thời gian giữa 2 lần kiến cho mỗi ngựa (giây)
    leaderAntBoost: 0.6,     // nhân với thời gian chờ nếu đang dẫn đầu (nhỏ hơn 1 = kiến đến sớm hơn)
    backAntSlow: 1.25,       // nhân với thời gian chờ nếu đang bét
    stopMin: 0.8, stopMax: 1.6,  // ngựa dừng bao lâu khi giẫm phải kiến (giây)
    rubber: 0.04             // kéo cân bằng tốc độ
  };
  const HORSES = [
    { n: 'Bạch Tuyết', c: '#fffaf2', m: '#ff9fbd', col: '#ff9fbd' },
    { n: 'Nâu Nâu', c: '#d9a074', m: '#7a5238', col: '#d9a074' },
    { n: 'Xanh Ngọc', c: '#a8e8d2', m: '#5fbfa0', col: '#6fd1b0' },
    { n: 'Tím Mộng', c: '#c9b6f2', m: '#8a70d0', col: '#b9a6ec' }
  ];
  const W = 256, H = 132, LANE0 = 26, LANEH = 24, X0 = 6, X1 = 214;

  function open(S, api) {
    const ui = U();
    const m = ui.modal('🏇 Khu đua ngựa — chơi cho vui, không có thưởng', 'wide race');
    m.body.innerHTML = `<div class="rc"><div class="rc-top"><span id="rcs">Thắng đoán trúng: <b>${S.race.w}</b> · Trượt: <b>${S.race.l}</b></span></div>
      <canvas id="rcv" width="${W}" height="${H}"></canvas>
      <div id="rcm" class="rc-msg">Chọn 1 chú ngựa để cược, rồi bấm <b>Bắt đầu đua</b>!</div>
      <div class="rc-pick" id="rcp"></div><button id="rcg" class="pbtn big go">🏁 Bắt đầu đua</button></div>`;
    const cv = m.body.querySelector('#rcv'), x = cv.getContext('2d'), msg = m.body.querySelector('#rcm'), go = m.body.querySelector('#rcg'), pick = m.body.querySelector('#rcp');
    x.imageSmoothingEnabled = false;
    let bet = -1, running = false, finished = false, raf = 0, last = 0, T = 0, hs = [], ants = [], winner = -1, endT = 0;
    HORSES.forEach((h, i) => {
      const b = ui.el('button', 'card'); const c = ui.el('canvas', 'th'); c.width = 60; c.height = 48;
      const cx = c.getContext('2d'); cx.imageSmoothingEnabled = false; cx.drawImage(PHO.horse.get(h.c, h.m, i + 1, 0), 0, 0, 60, 48);
      b.append(c, ui.el('span', 'nm', (i + 1) + '. ' + ui.esc(h.n))); b.onclick = () => { if (running) return; bet = i; pick.querySelectorAll('.card').forEach((q, j) => q.classList.toggle('sel', j === i)); msg.innerHTML = 'Bạn cược ngựa số <b>' + (i + 1) + ' · ' + ui.esc(h.n) + '</b>. Sẵn sàng chưa?'; draw(); };
      pick.appendChild(b);
    });
    const rnd = (a, b) => a + Math.random() * (b - a);
    function reset() {
      hs = HORSES.map((h, i) => ({ i, p: 0, v: RC.baseSpeed, stop: 0, nextAnt: rnd(RC.antMin, RC.antMax) + i * .3, done: false, vt: 0, bubble: 0 }));
      ants = []; winner = -1; finished = false; T = 0;
    }
    reset();
    function start() {
      if (running) return; if (bet < 0) { msg.innerHTML = 'Hãy chọn ngựa để cược trước nhé! 👆'; return; }
      reset(); running = true; go.disabled = true; msg.textContent = '3… 2… 1… XUẤT PHÁT!'; last = performance.now(); raf = requestAnimationFrame(loop);
    }
    go.onclick = start;
    function say(t) { msg.innerHTML = t; }
    function step(dt) {
      T += dt;
      const lead = Math.max(...hs.map(h => h.p)), back = Math.min(...hs.map(h => h.p));
      hs.forEach(h => {
        if (h.done) return;
        h.bubble = Math.max(0, h.bubble - dt);
        if (h.stop > 0) { h.stop -= dt; if (h.stop <= 0) h.stop = 0; return; }
        h.vt -= dt; if (h.vt <= 0) { h.vt = .35; h.v = RC.baseSpeed + (Math.random() * 2 - 1) * RC.jitter; }
        let v = h.v; if (h.p > lead - .005 && lead - back > .08) v *= 1 - RC.rubber; if (h.p < lead - .1) v *= 1 + RC.rubber;
        h.p += v * dt;
        // kiến
        h.nextAnt -= dt;
        if (h.nextAnt <= 0 && h.p > .1 && h.p < .86) {
          const isLead = h.p >= lead - .005; ants.push({ lane: h.i, p: h.p + .05, t: 0, h: h.i, hit: false });
          h.nextAnt = rnd(RC.antMin, RC.antMax) * (isLead ? RC.leaderAntBoost : h.p <= back + .005 ? RC.backAntSlow : 1);
        }
        if (h.p >= 1) { h.p = 1; h.done = true; if (winner < 0) { winner = h.i; endT = T + 1.4; } }
      });
      ants.forEach(a => {
        a.t += dt; const h = hs[a.lane];
        if (!a.hit && !h.done && h.p >= a.p - .004) { a.hit = true; h.stop = rnd(RC.stopMin, RC.stopMax); h.bubble = 1.2; say('🐜 Ngựa số <b>' + (h.i + 1) + '</b> giẫm phải con kiến! Dừng lại một chút…'); }
      });
      ants = ants.filter(a => !(a.hit && a.t > 3));
      if (winner >= 0 && T >= endT) finish();
    }
    function finish() {
      running = false; finished = true;
      const ok = winner === bet; if (ok) S.race.w++; else S.race.l++;
      PHO.save.touch(); m.body.querySelector('#rcs').innerHTML = 'Đoán trúng: <b>' + S.race.w + '</b> · Trượt: <b>' + S.race.l + '</b>';
      say('🏁 Ngựa số <b>' + (winner + 1) + ' · ' + ui.esc(HORSES[winner].n) + '</b> về nhất! ' + (ok ? '🎉 Bạn đoán trúng rồi!' : '😅 Tiếc quá, lần sau nhé!'));
      go.disabled = false; go.textContent = '🔁 Đua ván nữa'; api.sfx(ok ? 'buy' : 'ding');
    }
    function loop(now) {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (running) step(dt);
      draw(); if (running || !finished) raf = requestAnimationFrame(loop);
    }
    function draw() {
      // trời + khán đài + cỏ
      x.fillStyle = '#c9e8ff'; x.fillRect(0, 0, W, 14); x.fillStyle = '#e4f4ff'; x.fillRect(18, 4, 22, 4); x.fillRect(150, 7, 30, 4);
      x.fillStyle = '#a8e0a0'; x.fillRect(0, 14, W, H - 14);
      for (let i = 0; i < 26; i++) { x.fillStyle = (i % 3) ? '#ffb3cf' : '#fff3a6'; x.fillRect(4 + i * 10, 13, 2, 2); }
      // cờ tam giác
      for (let i = 0; i < 12; i++) { x.fillStyle = ['#ff9fbd', '#fff3a6', '#a8e8d2', '#bfe3ff'][i % 4]; x.fillRect(8 + i * 21, 6, 6, 3); x.fillRect(9 + i * 21, 9, 4, 2); }
      x.fillStyle = '#8a7a6a'; x.fillRect(0, 5, W, 1);
      for (let i = 0; i < 4; i++) {
        const y = LANE0 + i * LANEH;
        x.fillStyle = '#f6dfae'; x.fillRect(0, y, W, LANEH - 2); x.fillStyle = '#e9c98b'; for (let k = 0; k < 18; k++) x.fillRect((k * 37 + i * 11) % W, y + 4 + (k * 7) % 14, 2, 1);
        x.fillStyle = '#fff'; x.fillRect(0, y + LANEH - 2, W, 1);
        x.fillStyle = HORSES[i].col; x.fillRect(0, y, 4, LANEH - 2);
        if (bet === i) { x.fillStyle = '#ffd34d'; x.fillRect(W - 6, y + 2, 4, 4); x.fillRect(W - 5, y + 6, 2, 3); }
      }
      // vạch đích caro
      for (let j = 0; j < 4 * LANEH / 4; j++) { x.fillStyle = (j % 2) ? '#3a2c4a' : '#ffffff'; x.fillRect(X1 + 22, LANE0 + j * 4, 4, 4); x.fillStyle = (j % 2) ? '#ffffff' : '#3a2c4a'; x.fillRect(X1 + 26, LANE0 + j * 4, 4, 4); }
      x.fillStyle = '#ffffff'; x.fillRect(X0 + 6, LANE0, 1, 4 * LANEH);
      // kiến
      ants.forEach(a => {
        const px = X0 + a.p * (X1 - X0) + 24, y = LANE0 + a.lane * LANEH + 14 + Math.round(Math.sin(a.t * 6) * 3);
        if (a.hit) { x.fillStyle = '#3a2c4a'; x.fillRect(px, y, 3, 1); return; }
        const f = Math.floor(a.t * 10) % 2; x.fillStyle = '#3a2c4a'; x.fillRect(px, y, 4, 2); x.fillRect(px + 4, y, 2, 2); x.fillRect(px + 1, y + 2 - f, 1, 1); x.fillRect(px + 3, y + 1 + f, 1, 1); x.fillRect(px - 1, y - 1, 1, 1);
      });
      // ngựa
      hs.forEach(h => {
        const hx = Math.round(X0 + h.p * (X1 - X0)), hy = LANE0 + h.i * LANEH - 8;
        const f = (running && !h.stop && !h.done) ? Math.floor(T * 10) % 4 : 4;
        const sp = PHO.horse.get(HORSES[h.i].c, HORSES[h.i].m, h.i + 1, f, h.stop > 0);
        x.fillStyle = 'rgba(80,60,100,.18)'; x.fillRect(hx + 4, hy + 20, 22, 2);
        x.drawImage(sp, hx - 2, hy);
        if (h.bubble > 0) { x.fillStyle = '#fff'; x.fillRect(hx + 8, hy - 8, 12, 9); x.fillStyle = '#e0556a'; x.fillRect(hx + 13, hy - 6, 2, 4); x.fillRect(hx + 13, hy - 1, 2, 2); }
      });
    }
    draw();
    m.onClose = () => { cancelAnimationFrame(raf); running = false; finished = true; };
  }
  return { open, RC, HORSES };
})();
