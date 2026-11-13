/* main.js — "động cơ" của Phố: vòng lặp, camera, đi lại (phím / bấm / giữ kéo), tìm đường, ngồi, pet, xu, người chơi khác, vẽ màn hình.
   Các phần khác: world.js (bản đồ) · ui.js (giao diện) · net.js (online) · save.js (lưu) · race.js (đua ngựa). */
(() => {
  const CFG = PHO.CFG, I = PHO.ITEMS, W = PHO.world, G = PHO.gfx, T = 16;
  const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  const AX = PHO.char.AX, AY = PHO.char.AY, SIT_DY = 3;
  const DEBUG = /debug/.test(location.search);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let scale = 3, vw = 300, vh = 170;
  let scene = null, save = null, t = 0, last = 0, busy = false, userId = '', userName = '';
  const cam = { x: 0, y: 0 };
  const me = { x: 0, y: 0, dir: 'd', f: 0, ft: 0, moving: false, sit: null, path: null, pending: null };
  const pet = { x: 0, y: 0, dir: 'd', f: 0, ft: 0, blink: 0, moving: false };
  let freeCam = false, coins = [], coinT = 0, petals = [], ripple = null, doorLock = true, lastChat = 0, muted = false, savedPosT = 0;
  try { muted = localStorage.phoMute === '1'; } catch { }

  // ---------- âm thanh nhỏ ----------
  let AC = null;
  function sfx(n) {
    if (muted) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume();
      const seq = { coin: [[988, .07], [1319, .12]], buy: [[523, .08], [659, .08], [784, .14]], ding: [[440, .12], [330, .18]], sit: [[330, .06]], door: [[392, .06], [523, .08]] }[n] || [];
      let at = AC.currentTime;
      seq.forEach(([f, d]) => {
        const o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.setValueAtTime(.05, at); g.gain.exponentialRampToValueAtTime(.001, at + d + .05);
        o.connect(g); g.connect(AC.destination); o.start(at); o.stop(at + d + .06); at += d;
      });
    } catch { }
  }

  // ---------- kích thước màn hình ----------
  function resize() {
    const Wd = innerWidth, Hd = innerHeight;
    scale = clamp(Math.floor(Math.min(Wd / 300, Hd / 170)), 2, 5);
    vw = Math.ceil(Wd / scale); vh = Math.ceil(Hd / scale);
    cv.width = vw; cv.height = vh; cv.style.width = vw * scale + 'px'; cv.style.height = vh * scale + 'px'; ctx.imageSmoothingEnabled = false;
  }
  addEventListener('resize', resize);
  addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  ['gesturestart', 'gesturechange'].forEach(n => addEventListener(n, e => e.preventDefault()));

  // ---------- va chạm + tìm đường ----------
  const blockedAt = (tx, ty) => tx < 0 || ty < 0 || tx >= scene.w || ty >= scene.h || scene.blocked[ty * scene.w + tx] === 1;
  const canStand = (px, py) => !(blockedAt(Math.floor((px - 3.5) / T), Math.floor((py - 2) / T)) || blockedAt(Math.floor((px + 3.5) / T), Math.floor((py - 2) / T)) || blockedAt(Math.floor((px - 3.5) / T), Math.floor(py / T)) || blockedAt(Math.floor((px + 3.5) / T), Math.floor(py / T)));
  function nearestFree(tx, ty) {
    if (!blockedAt(tx, ty)) return [tx, ty];
    for (let r = 1; r < 9; r++) {
      let best = null, bd = 1e9;
      for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { if (Math.max(Math.abs(i), Math.abs(j)) !== r) continue; if (!blockedAt(tx + i, ty + j)) { const d = i * i + j * j; if (d < bd) { bd = d; best = [tx + i, ty + j]; } } }
      if (best) return best;
    }
    return null;
  }
  function findPath(sx, sy, gx, gy) {
    const s = nearestFree(Math.floor(sx / T), Math.floor(sy / T)), g = nearestFree(Math.floor(gx / T), Math.floor(gy / T)); if (!s || !g) return null;
    const w = scene.w, prev = new Int32Array(scene.w * scene.h).fill(-2), q = [s[1] * w + s[0]]; prev[q[0]] = -1;
    const goal = g[1] * w + g[0]; let h = 0;
    while (h < q.length) {
      const c = q[h++]; if (c === goal) break; const cx = c % w, cy = (c / w) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue; const nx = cx + dx, ny = cy + dy; if (blockedAt(nx, ny) || prev[ny * w + nx] !== -2) continue;
        if (dx && dy && (blockedAt(cx + dx, cy) || blockedAt(cx, cy + dy))) continue;
        prev[ny * w + nx] = c; q.push(ny * w + nx);
      }
    }
    if (prev[goal] === -2) return null;
    const path = []; for (let c = goal; c !== -1; c = prev[c]) path.push({ x: (c % w) * T + 8, y: ((c / w) | 0) * T + 12 }); path.reverse(); path.shift();
    if (path.length && Math.floor(gx / T) === g[0] && Math.floor(gy / T) === g[1] && canStand(gx, gy)) path[path.length - 1] = { x: gx, y: gy };
    return path;
  }

  // ---------- thao tác ----------
  const dirOf = (vx, vy) => Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 'l' : 'r') : (vy < 0 ? 'u' : 'd');
  function walkTo(x, y, pending) {
    if (me.sit) standUp(true);
    const p = findPath(me.x, me.y, x, y);
    if (!p) { me.path = null; me.pending = null; return false; }
    me.path = p; me.pending = pending || null; ripple = { x, y, t: 0 };
    if (!p.length && pending) { arrive(); }
    return true;
  }
  function arrive() {
    const p = me.pending; me.pending = null; me.path = null; if (!p) return;
    if (p.sit) sitAt(p.sit); else if (p.act === 'shop') openShop(); else if (p.act === 'race') openRace(); else if (p.say) npcSay(p.say);
  }
  const seatTaken = s => { for (const p of PHO.net.peers.values()) if (p.sit === s.id) return true; return false; };
  function sitAt(s) {
    if (seatTaken(s)) { PHO.ui.toast('Chỗ này có người ngồi rồi 😅'); return; }
    me.sit = s; me.x = s.x; me.y = s.y; me.dir = s.dir; me.path = null; me.moving = false; sfx('sit'); PHO.net.sendPos(me, true);
  }
  function standUp(silent) {
    if (!me.sit) return; const a = me.sit.at; me.sit = null;
    if (canStand(a.x, a.y)) { me.x = a.x; me.y = a.y; } else { const f = nearestFree(Math.floor(a.x / T), Math.floor(a.y / T)); if (f) { me.x = f[0] * T + 8; me.y = f[1] * T + 12; } }
    PHO.net.sendPos(me, true);
  }
  function openShop() { if (PHO.ui.isOpen()) return; PHO.ui.wardrobe('shop', save, { changed, sfx }); }
  function openBag() { if (PHO.ui.isOpen()) return; PHO.ui.wardrobe('bag', save, { changed, sfx }); }
  function openRace() { if (PHO.ui.isOpen()) return; me.path = null; PHO.race.open(save, { sfx }); }
  function changed() {
    PHO.ui.setXu(save.xu); PHO.save.touch(); PHO.net.updateMeta(meta());
    if (save.pet && !pet.have) { pet.x = me.x - 12; pet.y = me.y; } pet.have = !!save.pet;
  }
  const meta = () => ({ id: userId, name: save.name, look: { skin: save.skin, head: save.head, set: save.set }, pet: save.pet, x: Math.round(me.x), y: Math.round(me.y), d: me.dir, s: me.sit ? me.sit.id : 0 });
  const myLook = () => ({ skin: save.skin, head: save.head, set: save.set });

  // ---------- đổi khu ----------
  function fade(on) { document.getElementById('fade').style.opacity = on ? 1 : 0; }
  function goScene(id, at) {
    if (busy) return; busy = true; fade(1); sfx('door');
    setTimeout(() => {
      scene = W.get(id); me.x = at.x; me.y = at.y; me.path = null; me.pending = null; me.sit = null; me.moving = false; me.dir = 'd';
      coins = []; pet.x = me.x; pet.y = me.y + 4; buildLabels(); doorLock = true; PHO.net.join(scene.chan, meta()); resizeCam(true);
      PHO.ui.setPrompt([]); document.title = 'Phố · ' + scene.name; fade(0); busy = false;
    }, 230);
  }

  // ---------- nhãn chữ (DOM) ----------
  const labelsEl = document.getElementById('labels'), plEls = new Map(), bubbles = new Map();
  let worldLabels = [];
  function buildLabels() {
    labelsEl.innerHTML = ''; plEls.clear(); worldLabels = [];
    scene.labels.forEach(l => { const e = document.createElement('div'); e.className = 'lb ' + l.cls; e.textContent = l.text; labelsEl.appendChild(e); worldLabels.push({ e, x: l.x, y: l.y }); });
  }
  function plEl(id) {
    let p = plEls.get(id); if (p) return p;
    const e = document.createElement('div'); e.className = 'pl'; e.innerHTML = '<div class="bub"></div><div class="nm"></div>'; labelsEl.appendChild(e);
    p = { e, bub: e.firstChild, nm: e.lastChild, tm: 0 }; plEls.set(id, p); return p;
  }
  function say(id, name, text, ms = 5200) {
    const p = plEl(id); p.nm.textContent = name; p.bub.textContent = text; p.bub.classList.add('on'); clearTimeout(p.tm); p.tm = setTimeout(() => p.bub.classList.remove('on'), ms);
  }
  const sx = x => Math.round((x - Math.round(cam.x)) * scale), sy = y => Math.round((y - Math.round(cam.y)) * scale);
  function placeEl(e, wx, wy) { e.style.transform = 'translate(' + sx(wx) + 'px,' + sy(wy) + 'px)'; }
  function npcSay(n) { const ln = n.say && n.say[(Math.random() * n.say.length) | 0]; if (ln) say('npc' + n.x, '', ln, 3800); }

  // ---------- camera ----------
  function resizeCam(snap, dt = .016) {
    const wpx = scene.w * T, hpx = scene.h * T;
    let tx = me.x - vw / 2, ty = me.y - 16 - vh / 2;
    tx = wpx <= vw ? (wpx - vw) / 2 : clamp(tx, 0, wpx - vw); ty = hpx <= vh ? (hpx - vh) / 2 : clamp(ty, 0, hpx - vh);
    if (snap) { cam.x = tx; cam.y = ty; } else { const k = Math.min(1, dt * 9); cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k; }
  }

  // ---------- nhập liệu ----------
  const keys = new Set();
  const typing = () => document.activeElement && document.activeElement.tagName === 'INPUT';
  addEventListener('keydown', e => {
    if (typing() || PHO.ui.isOpen()) return;
    const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) { keys.add(k); e.preventDefault(); }
    if (k === 'e' || k === ' ') { if (me.sit) standUp(); e.preventDefault(); }
  });
  addEventListener('keyup', e => keys.delete(e.key.toLowerCase())); addEventListener('blur', () => keys.clear());
  function keyVec() {
    let x = 0, y = 0;
    if (keys.has('arrowleft') || keys.has('a')) x -= 1; if (keys.has('arrowright') || keys.has('d')) x += 1;
    if (keys.has('arrowup') || keys.has('w')) y -= 1; if (keys.has('arrowdown') || keys.has('s')) y += 1;
    if (!x && !y) return null; const l = Math.hypot(x, y); return { x: x / l, y: y / l };
  }
  const ptr = { down: false, hold: false, sx: 0, sy: 0, x: 0, y: 0, t0: 0 };
  const toWorld = (cx, cy) => ({ x: cx / scale + Math.round(cam.x), y: cy / scale + Math.round(cam.y) });
  cv.addEventListener('pointerdown', e => {
    if (PHO.ui.isOpen()) return; try { AC && AC.state === 'suspended' && AC.resume(); } catch { }
    if (typing()) document.activeElement.blur();
    ptr.down = true; ptr.hold = false; ptr.sx = e.clientX; ptr.sy = e.clientY; ptr.x = e.clientX; ptr.y = e.clientY; ptr.t0 = performance.now(); cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!ptr.down) return; ptr.x = e.clientX; ptr.y = e.clientY;
    if (!ptr.hold && (Math.hypot(ptr.x - ptr.sx, ptr.y - ptr.sy) > 10 || performance.now() - ptr.t0 > 280)) { ptr.hold = true; if (me.sit) standUp(); me.path = null; me.pending = null; }
  });
  const endPtr = e => {
    if (!ptr.down) return; ptr.down = false; const wasHold = ptr.hold; ptr.hold = false;
    if (!wasHold && !PHO.ui.isOpen()) { const r = cv.getBoundingClientRect(), w = toWorld(e.clientX - r.left, e.clientY - r.top); tap(w.x, w.y); }
  };
  cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', () => { ptr.down = false; ptr.hold = false; });
  cv.addEventListener('contextmenu', e => e.preventDefault());

  function tap(wx, wy) {
    // 1) ghế
    let best = null, bd = 18;
    scene.seats.forEach(s => { const d = Math.hypot(s.x - wx, (s.y - 6) - wy); if (d < bd) { bd = d; best = s; } });
    if (best) { if (me.sit === best) return; walkTo(best.at.x, best.at.y, { sit: best }); return; }
    // 2) NPC / người chơi
    for (const n of scene.npcs) {
      if (n.kind === 'clerk' || n.kind === 'mannequin' || n.kind === 'pet' || n.kind === 'barista') {
        if (Math.abs(n.x - wx) < 12 && wy > n.y - 36 && wy < n.y + 4) { if (n.kind === 'barista') { npcSay(n); return; } walkTo(scene.id === 'shop' ? 12.7 * T : me.x, scene.id === 'shop' ? 7.6 * T : me.y, { act: 'shop' }); return; }
      }
    }
    // 3) điểm bấm (nhà, quầy...)
    for (const h of scene.hot) {
      if (wx >= h.x && wx <= h.x + h.w && wy >= h.y && wy <= h.y + h.h) { walkTo(h.go.x, h.go.y, h.act ? { act: h.act } : null); return; }
    }
    // 4) đi tới chỗ bấm
    walkTo(wx, wy);
  }

  // ---------- cập nhật ----------
  function moveFree(vx, vy, dt) {
    const sp = CFG.SPEED * dt; let nx = me.x + vx * sp, ny = me.y + vy * sp;
    if (canStand(nx, me.y)) me.x = nx; if (canStand(me.x, ny)) me.y = ny;
  }
  function updateMe(dt) {
    let vx = 0, vy = 0, moving = false, free = false;
    const kv = keyVec();
    if (me.sit) { if (kv) standUp(); else { me.moving = false; return; } }
    if (kv) { vx = kv.x; vy = kv.y; me.path = null; me.pending = null; free = true; }
    else if (ptr.hold) {
      const r = cv.getBoundingClientRect(), w = toWorld(ptr.x - r.left, ptr.y - r.top), dx = w.x - me.x, dy = w.y - 10 - me.y, d = Math.hypot(dx, dy);
      if (d > 6) { vx = dx / d; vy = dy / d; free = true; }
    } else if (me.path && me.path.length) {
      const w = me.path[0], dx = w.x - me.x, dy = w.y - me.y, d = Math.hypot(dx, dy), st = CFG.SPEED * dt;
      if (d <= st) { me.x = w.x; me.y = w.y; me.path.shift(); if (!me.path.length) { me.moving = false; arrive(); return; } }
      else { vx = dx / d; vy = dy / d; me.x += vx * st; me.y += vy * st; moving = true; me.dir = dirOf(vx, vy); }
    }
    if (free && (vx || vy)) { const ox = me.x, oy = me.y; moveFree(vx, vy, dt); moving = Math.hypot(me.x - ox, me.y - oy) > .05; me.dir = dirOf(vx, vy); }
    me.moving = moving;
    if (moving) { me.ft += dt * 9; me.f = Math.floor(me.ft) % 4; } else { me.f = 0; me.ft = 0; }
    // cửa
    let inside = false;
    for (const d of scene.doors) if (me.x >= d.x && me.x <= d.x + d.w && me.y >= d.y && me.y <= d.y + d.h) {
      inside = true;
      if (!doorLock && !busy) { doorLock = true; me.path = null; if (d.act === 'race') { me.y += 6; openRace(); } else if (d.to) goScene(d.to, d.at); }
    }
    if (!inside) doorLock = false;
  }
  function updatePet(dt) {
    if (!save.pet) return;
    const tx = me.sit ? me.sit.x + 14 : me.x - (me.dir === 'l' ? -12 : me.dir === 'r' ? 12 : 0) + (me.dir === 'u' ? 0 : 0), ty = me.sit ? me.sit.y + 10 : me.y + (me.dir === 'u' ? 10 : me.dir === 'd' ? -10 : 2);
    const dx = tx - pet.x, dy = ty - pet.y, d = Math.hypot(dx, dy);
    pet.moving = false;
    if (d > 20 || (pet.moving0 && d > 6)) {
      const sp = (CFG.SPEED + 14) * dt * Math.min(1.6, .6 + d / 40); let nx = pet.x + dx / d * sp, ny = pet.y + dy / d * sp;
      if (!blockedAt(Math.floor(nx / T), Math.floor(ny / T))) { pet.x = nx; pet.y = ny; } else if (!blockedAt(Math.floor(nx / T), Math.floor(pet.y / T))) pet.x = nx; else if (!blockedAt(Math.floor(pet.x / T), Math.floor(ny / T))) pet.y = ny;
      pet.dir = dirOf(dx, dy); pet.moving = true; pet.moving0 = true;
    } else pet.moving0 = false;
    if (d > 150) { pet.x = tx; pet.y = ty; }
    if (pet.moving) { pet.ft += dt * 11; pet.f = 1 + (Math.floor(pet.ft) % 2) * 2; } else { pet.f = 0; pet.blink -= dt; if (pet.blink < -3.2) pet.blink = .16; }
  }
  function updateCoins(dt) {
    if (!scene.coins) return;
    coinT += dt;
    if (coinT > CFG.COIN_EVERY && coins.length < CFG.COIN_MAX) {
      coinT = 0;
      for (let k = 0; k < 20; k++) {
        const tx = 3 + (Math.random() * (scene.w - 6)) | 0, ty = 3 + (Math.random() * (scene.h - 5)) | 0;
        if (!blockedAt(tx, ty) && !blockedAt(tx + 1, ty) && ty > 8) { coins.push({ x: tx * T + 8, y: ty * T + 10, p: Math.random() * 6 }); break; }
      }
    }
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i]; if (Math.hypot(c.x - me.x, c.y - 4 - me.y) < 10) {
        coins.splice(i, 1); save.xu += CFG.COIN_VALUE; PHO.ui.setXu(save.xu); PHO.save.touch(); sfx('coin');
        PHO.ui.floatText('+' + CFG.COIN_VALUE + ' xu', sx(me.x) - 18, sy(me.y) - 52);
      }
    }
  }
  function updatePeers(dt) {
    for (const p of PHO.net.peers.values()) {
      if (!p.look || !I.hasHead(p.look.head) || !I.hasSet(p.look.set)) continue;
      let seat = null; if (p.sit) seat = scene.seats.find(s => s.id === p.sit);
      if (seat) { p.x = seat.x; p.y = seat.y; p.dir = seat.dir; p.moving = 0; p.seat = seat; }
      else {
        p.seat = null; const dx = p.tx - p.x, dy = p.ty - p.y, k = Math.min(1, dt * 10); p.x += dx * k; p.y += dy * k;
        p.moving = Math.hypot(dx, dy) > 1.2;
      }
      if (p.moving) { p.ft += dt * 9; p.f = Math.floor(p.ft) % 4; } else { p.f = 0; }
      if (p.pet) {
        p.px = p.px == null ? p.x - 12 : p.px; p.py = p.py == null ? p.y : p.py; const ddx = p.x - 12 - p.px, ddy = p.y - 6 - p.py, dd = Math.hypot(ddx, ddy);
        p.pm = false; if (dd > 18) { const s = (CFG.SPEED + 14) * dt; p.px += ddx / dd * s; p.py += ddy / dd * s; p.pm = true; p.pdir = dirOf(ddx, ddy); }
        if (dd > 160) { p.px = p.x; p.py = p.y; }
      }
    }
  }
  function updatePetals(dt) {
    if (scene.id !== 'street') return;
    while (petals.length < 36) petals.push({ x: (29 + Math.random() * 37) * T, y: (2 + Math.random() * 10) * T, vy: 8 + Math.random() * 10, ph: Math.random() * 6, s: Math.random() < .5 ? 1 : 2 });
    petals.forEach(p => { p.y += p.vy * dt; p.x += Math.sin(t * 1.4 + p.ph) * 10 * dt + 3 * dt; if (p.y > 22 * T) { p.y = 2 * T; p.x = (29 + Math.random() * 37) * T; } });
  }

  // ---------- vẽ ----------
  const coinSp = [];
  (function () { for (let f = 0; f < 4; f++) { const [c, x] = G.mk(10, 10), r = G.R(x), w = [6, 4, 2, 4][f]; r(5 - w / 2, 1, w, 7, '#e8a900'); r(5 - w / 2 + (w > 2 ? 1 : 0), 1, Math.max(1, w - 2), 6, '#ffd34d'); if (w >= 4) r(4, 2, 1, 2, '#fff3a6'); G.outline(c, '#a56d00'); coinSp.push(c); } })();
  function drawChar(look, dir, f, sit, x, y) { const sp = PHO.char.get(look, dir, f, sit); ctx.drawImage(sp, Math.round(x - AX - cam.x), Math.round(y - AY - cam.y + (sit ? SIT_DY : 0))); }
  function shadow(x, y, w = 7) { ctx.fillStyle = 'rgba(70,50,90,.18)'; ctx.fillRect(Math.round(x - w - cam.x), Math.round(y - 2 - cam.y), w * 2, 3); ctx.fillRect(Math.round(x - w + 1 - cam.x), Math.round(y - 3 - cam.y), w * 2 - 2, 1); }
  function drawPetSp(id, dir, f, blink, x, y, hop) { const sp = PHO.pet.get(id, dir, f, blink); ctx.drawImage(sp, Math.round(x - PHO.pet.AX - cam.x), Math.round(y - PHO.pet.AY - cam.y - hop)); }

  function render() {
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    cam.x = cx; cam.y = cy;
    ctx.fillStyle = scene.id === 'street' ? '#bfe8a6' : '#4a3a58'; ctx.fillRect(0, 0, vw, vh);
    ctx.drawImage(scene.gnd, -cx, -cy);
    scene.under.forEach(f => f && f(ctx, cx, cy, t));
    const L = [];
    const who = [me, ...PHO.net.peers.values()];
    scene.objs.forEach(o => {
      if (o.x + o.spr.width < cx || o.x > cx + vw || o.y + o.spr.height < cy || o.y > cy + vh) return;
      L.push({ s: o.sort, f: () => {
        const hide = o.fade && who.some(p => p.y < o.sort && p.y > o.y + 12 && p.x > o.x + 4 && p.x < o.x + o.spr.width - 4);
        if (hide) ctx.globalAlpha = .42; ctx.drawImage(o.spr, o.x - cx, o.y - cy); if (hide) ctx.globalAlpha = 1;
      } });
    });
    scene.npcs.forEach(n => {
      if (n.kind === 'horse') n.horses.forEach(h => L.push({ s: h.y, f: () => { const sp = PHO.horse.get(h.c, h.m, 0, 4, Math.sin(t * .8 + h.x) > .9); shadow(h.x + 11, h.y, 10); ctx.drawImage(sp, Math.round(h.x - 2 - cx), Math.round(h.y - 22 - cy)); } }));
      else if (n.kind === 'pet') L.push({ s: n.y, f: () => drawPetSp('cat', 'd', 0, Math.sin(t * .9) > .93, n.x, n.y, 0) });
      else L.push({ s: n.y, f: () => { shadow(n.x, n.y); drawChar(n.look, n.dir, 0, false, n.x, n.y); } });
    });
    coins.forEach(c => L.push({ s: c.y, f: () => { shadow(c.x, c.y + 2, 3); ctx.drawImage(coinSp[Math.floor(t * 6 + c.p) % 4], Math.round(c.x - 5 - cx), Math.round(c.y - 9 - cy - Math.abs(Math.sin(t * 3 + c.p)) * 2)); } }));
    // người chơi khác
    for (const p of PHO.net.peers.values()) {
      if (!p.look || !I.hasHead(p.look.head) || !I.hasSet(p.look.set)) continue;
      L.push({ s: p.seat ? (p.seat.sort != null ? p.seat.sort : p.y) : p.y, f: () => { if (!p.seat) shadow(p.x, p.y); drawChar(p.look, p.dir || 'd', p.f, !!p.seat, p.x, p.y); } });
      if (p.pet && p.px != null) L.push({ s: p.py, f: () => { shadow(p.px, p.py, 4); drawPetSp(p.pet, p.pdir || 'd', p.pm ? 1 + (Math.floor(t * 11) % 2) * 2 : 0, false, p.px, p.py, p.pm ? Math.abs(Math.sin(t * 14)) * 1.5 : 0); } });
    }
    // chính mình
    L.push({ s: me.sit ? (me.sit.sort != null ? me.sit.sort : me.y) : me.y, f: () => { if (!me.sit) shadow(me.x, me.y); drawChar(myLook(), me.dir, me.f, !!me.sit, me.x, me.y); } });
    if (save.pet) L.push({ s: pet.y, f: () => { shadow(pet.x, pet.y, 4); drawPetSp(save.pet, pet.dir, pet.f, pet.blink > 0, pet.x, pet.y, pet.moving ? Math.abs(Math.sin(t * 14)) * 1.5 : 0); } });
    L.sort((a, b) => a.s - b.s).forEach(o => o.f());
    scene.over.forEach(f => f && f(ctx, cx, cy, t));
    // cánh hoa anh đào
    if (scene.id === 'street') { ctx.fillStyle = '#ffc2d8'; petals.forEach(p => { const px = p.x - cx, py = p.y - cy; if (px > -4 && py > -4 && px < vw && py < vh) { ctx.fillRect(Math.round(px), Math.round(py), p.s + 1, 1); if (p.s > 1) ctx.fillRect(Math.round(px), Math.round(py) + 1, 1, 1); } }); }
    // gợi ý bấm: mũi tên trên cửa và ghế gần
    if (!me.sit) {
      ctx.fillStyle = '#ffffff';
      scene.seats.forEach(s => { if (Math.hypot(s.x - me.x, s.y - me.y) < 70 && !seatTaken(s)) { const bx = Math.round(s.x - cx), by = Math.round(s.y - 22 - cy + Math.sin(t * 4) * 1.5); ctx.fillStyle = 'rgba(84,64,95,.55)'; ctx.fillRect(bx - 3, by - 1, 7, 5); ctx.fillStyle = '#fff'; ctx.fillRect(bx - 2, by, 5, 1); ctx.fillRect(bx - 1, by + 1, 3, 1); ctx.fillRect(bx, by + 2, 1, 1); } });
      scene.doors.forEach(d => { if (Math.abs(d.x + d.w / 2 - me.x) < 80 && Math.abs(d.y - me.y) < 60) { const bx = Math.round(d.x + d.w / 2 - cx), by = Math.round(d.y - 4 - cy + Math.sin(t * 4) * 1.5); ctx.fillStyle = '#ffd34d'; ctx.fillRect(bx - 3, by, 7, 1); ctx.fillRect(bx - 2, by + 1, 5, 1); ctx.fillRect(bx - 1, by + 2, 3, 1); ctx.fillRect(bx, by + 3, 1, 1); } });
    }
    if (ripple) { ripple.t += .016; const r = 2 + ripple.t * 14; ctx.strokeStyle = 'rgba(255,255,255,' + Math.max(0, .8 - ripple.t * 2) + ')'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(ripple.x - r - cx) + .5, Math.round(ripple.y - r / 2 - cy) + .5, Math.round(r * 2), Math.round(r)); if (ripple.t > .4) ripple = null; }
    if (DEBUG) { ctx.fillStyle = '#000'; ctx.fillText(Math.round(me.x) + ',' + Math.round(me.y) + ' ' + scene.id, 4, 10); }
    // DOM nhãn
    worldLabels.forEach(l => placeEl(l.e, l.x, l.y));
    placeEl(plEl('me').e, me.x, me.y - 36); plEl('me').nm.textContent = save.name;
    const used = new Set(['me']);
    for (const p of PHO.net.peers.values()) { used.add(p.id); const e = plEl(p.id); e.nm.textContent = p.name || '…'; placeEl(e.e, p.x, p.y - 36 + (p.seat ? SIT_DY : 0)); }
    plEls.forEach((v, k) => { if (!used.has(k) && !k.startsWith('npc')) { v.e.remove(); plEls.delete(k); } });
  }

  function updatePrompt() {
    const b = [];
    if (me.sit) b.push({ t: '🧍 Đứng dậy', f: () => standUp() });
    else if (scene.id === 'shop') b.push({ t: '🛍 Mở cửa hàng', f: () => walkTo(12.7 * T, 7.6 * T, { act: 'shop' }) });
    PHO.ui.setPrompt(b);
  }

  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000 || .016); last = now; t += dt;
    if (save && scene) {
      if (!busy) { if (!PHO.ui.isOpen() || true) updateMe(dt); }
      updatePet(dt); updateCoins(dt); updatePeers(dt); updatePetals(dt);
      // NPC lẩm nhẩm
      scene.npcs.forEach(n => { if (n.say) { n.sayT = (n.sayT || 4 + Math.random() * 6) - dt; if (n.sayT <= 0) { n.sayT = 10 + Math.random() * 8; if (Math.hypot(n.x - me.x, n.y - me.y) < 110) say('npc' + n.x, '', n.say[(Math.random() * n.say.length) | 0], 3600); } } });
      plEls.forEach((v, k) => { if (k.startsWith('npc')) { const n = scene.npcs.find(q => 'npc' + q.x === k); if (n) placeEl(v.e, n.x, n.y - 38); } });
      if (!freeCam) resizeCam(false, dt); render(); updatePrompt();
      PHO.net.sendPos(me, false);
      savedPosT += dt; if (savedPosT > 5) { savedPosT = 0; save.pos = { s: scene.id, x: Math.round(me.sit ? me.sit.at.x : me.x), y: Math.round(me.sit ? me.sit.at.y : me.y) }; PHO.save.touch(); }
    }
    requestAnimationFrame(loop);
  }

  // ---------- khởi động ----------
  function onChat(id, name, text) { say(id, name, text); PHO.ui.chatAdd(name, text, false); }
  function sendChat(text) {
    const n = performance.now(); if (n - lastChat < CFG.CHAT_GAP) { PHO.ui.toast('Nhắn chậm một chút nhé 🙂', 1200); return; }
    lastChat = n; text = text.slice(0, CFG.CHAT_MAX);
    const D = window.parent !== window && window.parent.DHT;
    if (D && userName === D.ADMIN_USER && /^\/xu\s+\d+$/.test(text)) { save.xu += parseInt(text.split(/\s+/)[1], 10); changed(); PHO.ui.chatSys('Đã cộng xu (lệnh quản trị)'); return; }
    say('me', save.name, text); PHO.ui.chatAdd(save.name, text, true); PHO.net.sendChat(save.name, text);
  }

  function start() {
    // quà đăng nhập hằng ngày
    const td = PHO.save.today();
    if (save.daily !== td) { const first = !save.daily; save.daily = td; if (!first) { save.xu += CFG.DAILY_XU; setTimeout(() => PHO.ui.toast('🎁 Quà đăng nhập hằng ngày: +' + CFG.DAILY_XU + ' xu', 3600), 800); } PHO.save.touch(); }
    PHO.ui.setXu(save.xu); PHO.ui.setName(save.name);
    scene = W.get(['street', 'shop', 'cafe'].includes(save.pos.s) ? save.pos.s : 'street');
    me.x = save.pos.x; me.y = save.pos.y; if (!canStand(me.x, me.y)) { me.x = scene.spawn.x; me.y = scene.spawn.y; }
    pet.x = me.x - 12; pet.y = me.y; pet.have = !!save.pet;
    buildLabels(); resizeCam(true); document.title = 'Phố · ' + scene.name; 
    PHO.net.init({ id: userId, onChat, onStatus: (s, n) => PHO.ui.setNet(s, n) }).then(() => PHO.net.join(scene.chan, meta()));
    setInterval(() => PHO.ui.setNet(PHO.net.status, PHO.net.peers.size), 3000);
    if (!save.hinted) { setTimeout(() => PHO.ui.toast('Bấm hoặc giữ ngón tay để đi · Bấm ghế để ngồi · Nhặt xu vàng ngoài phố', 5200), 1200); save.hinted = 1; }
  }

  function boot() {
    resize();
    try { userName = localStorage.user || ''; const s = JSON.parse(localStorage.sess || 'null'); userId = (s && s.id) || ''; } catch { }
    if (!userId) userId = 'guest-' + Math.random().toString(36).slice(2, 8);
    PHO.ui.buildHud({
      back() { try { parent !== window ? parent.location.hash = '#/giaitri' : history.back(); } catch { history.back(); } },
      bag: openBag, chat: sendChat, muted: () => muted, toggleMute() { muted = !muted; try { localStorage.phoMute = muted ? '1' : '0'; } catch { } }
    });
    // ai chưa đăng nhập: chỉ cho xem hướng dẫn
    save = PHO.save.load(); const ld = document.getElementById('loading'); ld && ld.remove();
    requestAnimationFrame(t0 => { last = t0; loop(t0); });
    if (!save) PHO.ui.createChar(d => { save = PHO.save.create(d.name, d.skin, d.head, d.set); start(); });
    else start();
  }
  window.PHOD = { get cam() { return cam; }, get scale() { return scale; }, snap(w, h, x, y) { freeCam = true; vw = w; vh = h; cv.width = w; cv.height = h; cv.style.width = w * scale + 'px'; cv.style.height = h * scale + 'px'; ctx.imageSmoothingEnabled = false; cam.x = x; cam.y = y; render(); return true; }, unfree() { freeCam = false; resize(); }, get me() { return me; }, get scene() { return scene; }, get save() { return save; }, goScene, tp(x, y) { me.x = x; me.y = y; }, walkTo, sitAt, openShop, openBag, openRace, say, sfx, coins: () => coins };
  boot();
})();
