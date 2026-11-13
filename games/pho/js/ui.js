/* ui.js — mọi giao diện HTML phủ lên game: thanh trên (xu, tên), nút Túi, chat, hộp thoại tạo nhân vật, Túi, Cửa hàng.
   Kiểu dáng nằm ở pho.css. */
window.PHO = window.PHO || {};
PHO.ui = (() => {
  const I = PHO.ITEMS, CFG = PHO.CFG;
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = n => n.toLocaleString('vi-VN');

  // ---------- thông báo nhỏ ----------
  function toast(msg, ms = 2400) {
    const t = el('div', 'toast', msg); $('#toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), ms); setTimeout(() => t.remove(), ms + 400);
  }
  // chữ nổi lên (vd: +10 xu)
  function floatText(text, sx, sy) {
    const f = el('div', 'float', text); f.style.left = sx + 'px'; f.style.top = sy + 'px'; $('#stage').appendChild(f); setTimeout(() => f.remove(), 1200);
  }

  // ---------- hộp thoại ----------
  let openModal = null;
  function modal(title, cls = '') {
    closeModal();
    const back = el('div', 'm-back'), box = el('div', 'm-box ' + cls), head = el('div', 'm-head'), body = el('div', 'm-body');
    head.innerHTML = '<h3>' + esc(title) + '</h3>'; const x = el('button', 'x', '✕'); head.appendChild(x);
    box.append(head, body); back.appendChild(box); $('#modals').appendChild(back);
    const m = { back, box, body, close() { back.remove(); if (openModal === m) openModal = null; m.onClose && m.onClose(); } };
    x.onclick = m.close; back.addEventListener('pointerdown', e => { if (e.target === back && !cls.includes('lock')) m.close(); });
    openModal = m; return m;
  }
  function closeModal() { if (openModal) openModal.close(); }
  const isOpen = () => !!openModal;

  // ---------- vẽ nhân vật lên canvas ----------
  function drawLook(cv, look, scale, dir = 'd', crop) {
    const sp = PHO.char.get(look, dir, 0, false), x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    x.clearRect(0, 0, cv.width, cv.height);
    if (crop) x.drawImage(sp, 0, crop.y, sp.width, crop.h, 0, 0, sp.width * scale, crop.h * scale);
    else x.drawImage(sp, 0, 0, sp.width * scale, sp.height * scale);
  }
  function thumb(look, kind, scale = 2) {
    const cv = el('canvas', 'th'); const w = PHO.char.CW * scale;
    if (kind === 'head') { cv.width = w; cv.height = 25 * scale; drawLook(cv, look, scale, 'd', { y: 0, h: 25 }); }
    else { cv.width = w; cv.height = PHO.char.CH * scale; drawLook(cv, look, scale, 'd'); }
    return cv;
  }
  function petCanvas(id, scale) {
    const sp = PHO.pet.get(id, 'd', 0, false), cv = el('canvas', 'th'); cv.width = sp.width * scale; cv.height = sp.height * scale;
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(sp, 0, 0, cv.width, cv.height); return cv;
  }

  // ---------- thanh trên + chat ----------
  let chatLog, chatIn;
  function buildHud(api) {
    const hud = $('#hud');
    hud.innerHTML = `
      <div class="top-l"><button id="bBack" class="pbtn" title="Về Giải trí">←</button>
        <div class="badge"><i class="coin"></i><b id="xu">0</b></div>
        <div class="badge nm"><span id="pname"></span></div>
        <div class="badge net" id="net">⚪</div></div>
      <div class="top-r"><button id="bMute" class="pbtn" title="Âm thanh">🔊</button><button id="bBag" class="pbtn big">🎒 Túi</button></div>
      <div id="prompt"></div>
      <div id="chat"><div id="chatlog"></div><form id="chatf"><input id="chati" maxlength="${CFG.CHAT_MAX}" placeholder="Nhắn gì đó… (Enter)" autocomplete="off"><button class="pbtn" type="submit">Gửi</button></form></div>`;
    chatLog = $('#chatlog'); chatIn = $('#chati');
    $('#bBack').onclick = api.back; $('#bBag').onclick = api.bag;
    const mute = $('#bMute'); const setM = () => { mute.textContent = api.muted() ? '🔇' : '🔊'; }; setM(); mute.onclick = () => { api.toggleMute(); setM(); };
    $('#chatf').onsubmit = e => { e.preventDefault(); const t = chatIn.value.trim(); if (t) api.chat(t); chatIn.value = ''; chatIn.blur(); };
    chatIn.addEventListener('keydown', e => e.stopPropagation());
    addEventListener('keydown', e => { if (e.key === 'Enter' && document.activeElement !== chatIn && !isOpen()) { e.preventDefault(); chatIn.focus(); } });
  }
  const setXu = n => { const e = $('#xu'); if (e) e.textContent = fmt(n); };
  const setName = n => { const e = $('#pname'); if (e) e.textContent = n; };
  const setNet = (st, n) => {
    const e = $('#net'); if (!e) return;
    const m = { off: ['⚪ Chơi một mình', 'off'], idle: ['⚪ Chơi một mình', 'off'], connecting: ['🟡 Đang kết nối…', 'wait'], on: ['🟢 ' + (n + 1) + ' người ở đây', 'on'], error: ['🔴 Mất kết nối', 'err'] }[st] || ['⚪', 'off'];
    e.textContent = m[0]; e.className = 'badge net ' + m[1];
  };
  function chatAdd(name, text, mine) {
    const d = el('div', 'msg' + (mine ? ' mine' : ''), '<b>' + esc(name) + ':</b> ' + esc(text)); chatLog.appendChild(d);
    while (chatLog.children.length > 6) chatLog.firstChild.remove();
    setTimeout(() => d.classList.add('old'), 14000);
  }
  function chatSys(text) { const d = el('div', 'msg sys', esc(text)); chatLog.appendChild(d); while (chatLog.children.length > 6) chatLog.firstChild.remove(); setTimeout(() => d.classList.add('old'), 9000); }
  // nút hành động ở giữa dưới (Ngồi, Đứng dậy, Mở cửa hàng...)
  function setPrompt(btns) {
    const p = $('#prompt'); const key = btns.map(b => b.t).join('|');
    if (p.dataset.k === key) return; p.dataset.k = key; p.innerHTML = '';
    btns.forEach(b => { const e = el('button', 'pbtn big', b.t); e.onclick = b.f; p.appendChild(e); });
  }

  // ---------- tạo nhân vật ----------
  function createChar(done) {
    const m = modal('Chào mừng đến Phố! 🏘', 'lock narrow');
    let skin = 1, st = 0, name = '';
    m.body.innerHTML = `<p class="hint">Đặt tên và chọn dáng khởi đầu. Sau này bạn thay đồ thoải mái trong Cửa hàng nhé.</p>
      <div class="cc"><div class="cc-prev"><canvas id="ccp" width="${PHO.char.CW * 6}" height="${PHO.char.CH * 6}"></canvas></div>
      <div class="cc-form"><label>Tên nhân vật<input id="ccn" maxlength="${CFG.NAME_MAX}" placeholder="VD: Mây, Bơ, Na…" autocomplete="off"></label>
      <div class="lbl">Màu da</div><div id="ccs" class="sw"></div>
      <div class="lbl">Phong cách</div><div id="cct" class="stg"></div></div></div>
      <p id="cce" class="err"></p><button id="ccg" class="pbtn big go">Vào Phố ✨</button>`;
    const prev = m.body.querySelector('#ccp'), nameIn = m.body.querySelector('#ccn');
    const look = () => ({ skin, head: I.STARTERS[st].head, set: I.STARTERS[st].set });
    const refresh = () => {
      drawLook(prev, look(), 6);
      m.body.querySelectorAll('#ccs button').forEach((b, i) => b.classList.toggle('on', i === skin));
      m.body.querySelectorAll('#cct button').forEach((b, i) => b.classList.toggle('on', i === st));
      m.body.querySelectorAll('#cct canvas').forEach((c, i) => drawLook(c, { skin, head: I.STARTERS[i].head, set: I.STARTERS[i].set }, 2));
    };
    I.SKINS.forEach((c, i) => { const b = el('button'); b.style.background = c; b.onclick = () => { skin = i; refresh(); }; m.body.querySelector('#ccs').appendChild(b); });
    I.STARTERS.forEach((s, i) => { const b = el('button', 'card'); const c = el('canvas', 'th'); c.width = PHO.char.CW * 2; c.height = PHO.char.CH * 2; b.append(c, el('span', '', esc(s.n))); b.onclick = () => { st = i; refresh(); }; m.body.querySelector('#cct').appendChild(b); });
    refresh();
    const go = () => {
      name = nameIn.value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
      if (name.length < CFG.NAME_MIN) { m.body.querySelector('#cce').textContent = 'Tên cần từ ' + CFG.NAME_MIN + ' ký tự trở lên'; return; }
      m.onClose = null; m.close(); done({ name, skin, head: I.STARTERS[st].head, set: I.STARTERS[st].set });
    };
    m.body.querySelector('#ccg').onclick = go; nameIn.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') go(); });
    setTimeout(() => nameIn.focus(), 50);
  }

  // ---------- Túi / Cửa hàng (dùng chung 1 khung) ----------
  // mode: 'shop' | 'bag'.  S = dữ liệu lưu. api = { changed(), sfx(n) }
  function wardrobe(mode, S, api) {
    const shop = mode === 'shop';
    const m = modal(shop ? '🛍 Cửa hàng — mỗi món ' + CFG.PRICE + ' xu' : '🎒 Túi của bạn', 'wide');
    const tabsShop = [['head', 'Mũ / Tóc'], ['nam', 'Set nam'], ['nu', 'Set nữ'], ['cs', 'Công sở'], ['pet', 'Pet']];
    const tabsBag = [['head', 'Mũ / Tóc'], ['set', 'Set đồ'], ['pet', 'Pet'], ['mount', 'Thú cưỡi']];
    const tabs = shop ? tabsShop : tabsBag;
    let tab = 'head', filt = 'all', pv = { skin: S.skin, head: S.head, set: S.set }, sel = null;
    m.body.innerHTML = `<div class="wd"><div class="wd-l"><canvas id="wdp" width="${PHO.char.CW * 5}" height="${PHO.char.CH * 5}"></canvas>
      <div class="wd-info" id="wdi"></div><div class="wd-btns" id="wdb"></div></div>
      <div class="wd-r"><div class="tabs" id="wdt"></div><div class="chips" id="wdf"></div><div class="grid" id="wdg"></div></div></div>`;
    const $$ = s => m.body.querySelector(s), cv = $$('#wdp');
    const owned = (k, id) => S.own[k].includes(id);
    const kindOf = t => t === 'head' ? 'head' : 'set';
    function itemsFor() {
      if (tab === 'head') return I.HEADS.filter(h => filt === 'all' || (filt === 'hair' ? !h.hat : !!h.hat)).filter(h => shop || owned('heads', h.id));
      if (tab === 'pet') return I.PETS.filter(p => shop || owned('pets', p.id));
      if (tab === 'set') return I.SETS.filter(s => owned('sets', s.id));
      return I.SETS.filter(s => s.cat === tab);
    }
    function drawPrev() {
      if (shop && tab === 'pet') {
        const x = cv.getContext('2d'); x.clearRect(0, 0, cv.width, cv.height); x.imageSmoothingEnabled = false;
        const sp = PHO.pet.get('cat', 'd', 0, false), s = 8; x.drawImage(sp, (cv.width - sp.width * s) / 2, (cv.height - sp.height * s) / 2 + 10, sp.width * s, sp.height * s);
      } else drawLook(cv, pv, 5);
    }
    function info() {
      const i = $$('#wdi'), b = $$('#wdb'); b.innerHTML = '';
      if (tab === 'mount') { i.innerHTML = '<b>Thú cưỡi</b><br><span class="hint">Sắp ra mắt…</span>'; return; }
      if (!sel) { i.innerHTML = shop ? 'Chọn một món để mặc thử.' : 'Bấm vào món đồ để mặc.'; return; }
      const isPet = tab === 'pet', own = isPet ? owned('pets', sel.id) : owned(kindOf(tab) === 'head' ? 'heads' : 'sets', sel.id);
      const price = I.price(sel);
      i.innerHTML = '<b>' + esc(sel.n) + '</b>' + (isPet && sel.d ? '<br><span class="hint">' + esc(sel.d) + '</span>' : '') + '<br>' + (own ? '<span class="own">✔ Đã có</span>' : '<span class="price"><i class="coin"></i> ' + fmt(price) + ' xu</span>');
      if (shop) {
        if (!own) { const buy = el('button', 'pbtn big go', 'Mua · ' + fmt(price) + ' xu'); buy.disabled = S.xu < price; buy.onclick = () => doBuy(); b.appendChild(buy); if (S.xu < price) b.appendChild(el('div', 'hint', 'Chưa đủ xu — nhặt xu ngoài phố nhé!')); }
        else { const w = el('button', 'pbtn big go', isPet ? (S.pet === sel.id ? 'Cất pet' : 'Mang pet') : 'Mặc'); w.onclick = () => equip(); b.appendChild(w); }
      }
    }
    function doBuy() {
      const price = I.price(sel); if (S.xu < price) return;
      S.xu -= price;
      if (tab === 'pet') S.own.pets.push(sel.id); else if (tab === 'head') S.own.heads.push(sel.id); else S.own.sets.push(sel.id);
      api.sfx('buy'); ui.toast('Đã mua ' + sel.n + '! 🎉'); equip(true);
    }
    function equip(silent) {
      if (tab === 'pet') S.pet = (S.pet === sel.id && !silent) ? null : sel.id;
      else if (tab === 'head') S.head = sel.id; else S.set = sel.id;
      pv = { skin: S.skin, head: S.head, set: S.set }; api.changed(); render();
    }
    function render() {
      $$('#wdt').innerHTML = ''; tabs.forEach(([k, n]) => { const b = el('button', k === tab ? 'on' : '', n); if (k === 'mount') b.classList.add('soon'); b.onclick = () => { tab = k; sel = null; filt = 'all'; pv = { skin: S.skin, head: S.head, set: S.set }; render(); }; $$('#wdt').appendChild(b); });
      const f = $$('#wdf'); f.innerHTML = '';
      if (tab === 'head') [['all', 'Tất cả'], ['hair', 'Tóc'], ['hat', 'Mũ']].forEach(([k, n]) => { const b = el('button', k === filt ? 'on' : '', n); b.onclick = () => { filt = k; render(); }; f.appendChild(b); });
      f.append(el('span', 'hint', ''));
      const g = $$('#wdg'); g.innerHTML = '';
      if (tab === 'mount') { g.innerHTML = '<div class="empty">🐎 Thú cưỡi — sắp ra mắt!</div>'; drawPrev(); info(); return; }
      const list = itemsFor();
      if (!list.length) g.innerHTML = '<div class="empty">' + (tab === 'pet' ? 'Bạn chưa có pet nào.<br>Ghé Cửa hàng Shopping để nhận Mèo Thần Tài nhé! 🐱' : 'Chưa có món nào ở đây.') + '</div>';
      list.forEach(it => {
        const isPet = tab === 'pet', k = isPet ? 'pets' : tab === 'head' ? 'heads' : 'sets';
        const own = owned(k, it.id), on = isPet ? S.pet === it.id : (tab === 'head' ? S.head === it.id : S.set === it.id), pvOn = !isPet && (tab === 'head' ? pv.head === it.id : pv.set === it.id);
        const c = el('button', 'card' + (on ? ' wear' : '') + (sel && sel.id === it.id ? ' sel' : ''));
        c.appendChild(isPet ? petCanvas(it.id, 3) : thumb(tab === 'head' ? { ...pv, head: it.id } : { ...pv, set: it.id }, tab === 'head' ? 'head' : 'set'));
        c.appendChild(el('span', 'nm', esc(it.n)));
        c.appendChild(el('span', 'pr', on ? 'Đang mặc' : own ? (shop ? '✔ Đã có' : '') : '<i class="coin"></i>' + I.price(it)));
        c.onclick = () => {
          sel = it;
          if (!isPet) { pv = { skin: S.skin, head: S.head, set: S.set }; pv[tab === 'head' ? 'head' : 'set'] = it.id; }
          if (!shop) { equip(); return; }
          drawPrev(); info(); g.querySelectorAll('.card').forEach(x => x.classList.remove('sel')); c.classList.add('sel');
        };
        g.appendChild(c);
      });
      drawPrev(); info();
    }
    m.onClose = () => { S.xu = S.xu; api.changed(); };
    render();
    return m;
  }

  const ui = { toast, floatText, modal, closeModal, isOpen, buildHud, setXu, setName, setNet, chatAdd, chatSys, setPrompt, createChar, wardrobe, drawLook, petCanvas, el, esc, fmt };
  return ui;
})();
