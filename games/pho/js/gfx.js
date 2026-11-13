/* gfx.js — công cụ vẽ pixel dùng chung (canvas nhỏ, màu, viền, số ngẫu nhiên cố định) */
window.PHO = window.PHO || {};
PHO.gfx = (() => {
  const mk = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    return [c, x];
  };
  const hex = h => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
  const dark = (c, t = .18) => mix(c, '#3d2a50', t);
  const light = (c, t = .3) => mix(c, '#ffffff', t);
  // số ngẫu nhiên có hạt giống (cùng hạt → cùng kết quả, để cây/cỏ không đổi mỗi lần tải)
  const rng = s => () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const hash = (x, y, s = 0) => {
    let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const R = ctx => (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  // hình tròn pixel
  function disc(ctx, cx, cy, r, c) {
    ctx.fillStyle = c;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++)
      if (x * x + y * y <= r * r + r * .7) ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  }
  // hình elip pixel
  function ell(ctx, cx, cy, rx, ry, c) {
    ctx.fillStyle = c;
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++)
      if ((x * x) / (rx * rx + .3) + (y * y) / (ry * ry + .3) <= 1) ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  }
  // viền 1px quanh phần không trong suốt
  function outline(cv, col = '#54405f') {
    const w = cv.width, h = cv.height, x = cv.getContext('2d');
    const d = x.getImageData(0, 0, w, h), a = d.data, o = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) o[i] = a[i * 4 + 3] > 10 ? 1 : 0;
    const [r, g, b] = hex(col);
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx;
      if (o[i]) continue;
      if ((xx > 0 && o[i - 1]) || (xx < w - 1 && o[i + 1]) || (y > 0 && o[i - w]) || (y < h - 1 && o[i + w])) {
        a[i * 4] = r; a[i * 4 + 1] = g; a[i * 4 + 2] = b; a[i * 4 + 3] = 255;
      }
    }
    x.putImageData(d, 0, 0);
    return cv;
  }
  // lật ngang một canvas
  function flip(cv) {
    const [c, x] = mk(cv.width, cv.height);
    x.translate(cv.width, 0); x.scale(-1, 1); x.drawImage(cv, 0, 0);
    return c;
  }
  return { mk, hex, toHex, mix, dark, light, rng, hash, R, disc, ell, outline, flip };
})();
