/* save.js — dữ liệu người chơi. Lưu vào localStorage khóa "phoSave"; trang web chính (app.js) tự đồng bộ khóa này
   lên Supabase (bảng saves, game='pho') nên đăng nhập máy nào cũng giữ nguyên.
   Khi đổi cấu trúc dữ liệu: tăng PHO.CFG.VERSION và thêm bước vào migrate(). */
window.PHO = window.PHO || {};
PHO.save = (() => {
  const KEY = 'phoSave', CFG = PHO.CFG, I = PHO.ITEMS;
  let data = null, timer = null;
  const me = () => { try { return localStorage.user || ''; } catch { return ''; } };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  function fresh(name, skin, head, set) {
    return {
      v: CFG.VERSION, u: me(), name, skin, head, set, pet: null, xu: CFG.START_XU,
      own: { heads: [head], sets: [set], pets: [] }, daily: '', race: { w: 0, l: 0 },
      pos: { s: 'street', x: 9 * 16, y: 12 * 16 }, created: Date.now()
    };
  }
  // nâng cấp dữ liệu cũ lên bản mới + dọn id không còn tồn tại
  function migrate(d) {
    d.v = d.v || 1;
    d.own = d.own || {}; ['heads', 'sets', 'pets'].forEach(k => { d.own[k] = Array.isArray(d.own[k]) ? d.own[k] : []; });
    I.HEADS.forEach(h => { if (h.free && !d.own.heads.includes(h.id)) d.own.heads.push(h.id); });
    I.SETS.forEach(s => { if (s.free && !d.own.sets.includes(s.id)) d.own.sets.push(s.id); });
    d.own.heads = d.own.heads.filter(I.hasHead); d.own.sets = d.own.sets.filter(I.hasSet); d.own.pets = d.own.pets.filter(p => !!I.pet(p));
    if (!I.hasHead(d.head)) d.head = I.HEADS[0].id; if (!I.hasSet(d.set)) d.set = I.SETS[0].id;
    if (d.pet && !d.own.pets.includes(d.pet)) d.pet = null;
    d.skin = Math.max(0, Math.min(I.SKINS.length - 1, d.skin | 0));
    d.xu = Math.max(0, Math.floor(+d.xu || 0));
    d.race = d.race || { w: 0, l: 0 };
    d.pos = d.pos || { s: 'street', x: 144, y: 192 };
    // ... khi có v2: if (d.v < 2) { ...; d.v = 2 }
    d.v = CFG.VERSION;
    return d;
  }
  function load() {
    try {
      const j = JSON.parse(localStorage[KEY]);
      if (j && j.u && me() && j.u !== me()) { data = null; return null; }   // dữ liệu của tài khoản khác trên cùng trình duyệt
      data = migrate(j);
    } catch { data = null; }
    return data;
  }
  function flush() {
    if (!data) return;
    try { localStorage[KEY] = JSON.stringify(data); } catch { }
    try { parent !== window && parent.postMessage('dht-save', '*'); } catch { }
  }
  function touch() { clearTimeout(timer); timer = setTimeout(flush, 500); }
  function create(name, skin, head, set) { data = fresh(name, skin, head, set); flush(); return data; }
  const get = () => data;
  return { load, get, create, touch, flush, today, owns: (k, id) => data && data.own[k].includes(id) };
})();
