/* net.js — gặp nhau & chat thời gian thực bằng Supabase Realtime (Broadcast + Presence, kênh công khai theo từng khu).
   Nếu không kết nối được (mất mạng, chưa bật Realtime...) game vẫn chơi bình thường, chỉ là "chơi một mình".
   Gói dữ liệu: pos {i,x,y,d,m,s}  chat {i,n,t}  presence meta {id,name,look,pet,x,y,d,s} */
window.PHO = window.PHO || {};
PHO.net = (() => {
  const CFG = PHO.CFG;
  let client = null, ch = null, chName = '', myId = '', meta = null, ready = false, lastPos = 0, lastKey = '', status = 'off';
  const peers = new Map();            // id → {id,name,look,pet,x,y,tx,ty,dir,moving,sit,seen}
  let onChat = () => { }, onStatus = () => { };

  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });

  async function init(opts) {
    onChat = opts.onChat || onChat; onStatus = opts.onStatus || onStatus;
    myId = opts.id;
    try {
      const D = window.parent !== window && window.parent.DHT;
      if (!D || !D.SB_URL || !myId) throw 0;
      if (!window.supabase) await loadScript(CFG.SUPABASE_JS);
      client = window.supabase.createClient(D.SB_URL, D.SB_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, realtime: { params: { eventsPerSecond: 20 } } });
      try { const t = await D.tok(); if (t) client.realtime.setAuth(t); } catch { }
      ready = true; setStatus('idle');
    } catch { ready = false; setStatus('off'); }
  }
  function setStatus(s) { status = s; onStatus(s, peers.size); }

  function leave() {
    if (ch && client) { try { client.removeChannel(ch); } catch { } }
    ch = null; peers.clear();
  }
  function join(chan, m) {
    meta = m;
    if (!ready) return;
    leave(); chName = 'pho:' + chan; setStatus('connecting');
    try {
      ch = client.channel(chName, { config: { broadcast: { self: false, ack: false }, presence: { key: myId }, private: false } });
      ch.on('presence', { event: 'sync' }, () => {
        const st = ch.presenceState(), seen = new Set();
        Object.keys(st).forEach(k => {
          if (k === myId) return; const mm = st[k][st[k].length - 1]; if (!mm) return; seen.add(k);
          let p = peers.get(k);
          if (!p) { if (peers.size >= CFG.MAX_PEERS) return; p = { id: k, x: mm.x || 0, y: mm.y || 0, tx: mm.x || 0, ty: mm.y || 0, dir: mm.d || 'd', moving: 0, sit: mm.s || 0, f: 0, ft: 0 }; peers.set(k, p); }
          p.name = mm.name; p.look = mm.look; p.pet = mm.pet; p.seen = Date.now();
        });
        [...peers.keys()].forEach(k => { if (!seen.has(k)) peers.delete(k); });
        setStatus('on');
      });
      ch.on('broadcast', { event: 'pos' }, ({ payload: d }) => {
        const p = peers.get(d.i); if (!p) return;
        p.tx = d.x; p.ty = d.y; p.dir = d.d; p.moving = d.m; p.sit = d.s || 0; p.seen = Date.now();
        if (Math.hypot(p.tx - p.x, p.ty - p.y) > 90) { p.x = p.tx; p.y = p.ty; }
      });
      ch.on('broadcast', { event: 'chat' }, ({ payload: d }) => onChat(d.i, d.n, String(d.t || '').slice(0, CFG.CHAT_MAX)));
      ch.subscribe(st => {
        if (st === 'SUBSCRIBED') { ch.track(meta); setStatus('on'); }
        else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT') setStatus('error');
      });
    } catch { setStatus('error'); }
  }
  // cập nhật thông tin hiển thị (đổi đồ / pet)
  function updateMeta(m) { meta = m; if (ch && ready) { try { ch.track(meta); } catch { } } }
  function sendPos(me, force) {
    if (!ch || !ready) return;
    const now = performance.now(), key = Math.round(me.x) + ',' + Math.round(me.y) + me.dir + (me.sit ? me.sit.id : '') + (me.moving ? 1 : 0);
    if (!force && key === lastKey && now - lastPos < 2000) return;
    if (!force && now - lastPos < 1000 / CFG.NET_HZ) return;
    lastPos = now; lastKey = key;
    try { ch.send({ type: 'broadcast', event: 'pos', payload: { i: myId, x: Math.round(me.x), y: Math.round(me.y), d: me.dir, m: me.moving ? 1 : 0, s: me.sit ? me.sit.id : 0 } }); } catch { }
  }
  function sendChat(name, text) {
    if (!ch || !ready) return;
    try { ch.send({ type: 'broadcast', event: 'chat', payload: { i: myId, n: name, t: text } }); } catch { }
  }
  return { init, join, leave, updateMeta, sendPos, sendChat, peers, get status() { return status; }, get online() { return ready && !!ch; } };
})();
