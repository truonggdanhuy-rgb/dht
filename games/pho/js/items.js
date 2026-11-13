/* items.js — DANH MỤC ĐỒ. Muốn thêm đồ mới: thêm 1 dòng vào HEADS hoặc SETS (không phải sửa chỗ nào khác).
   free:true  → miễn phí (có sẵn khi tạo nhân vật). Không ghi free → giá = PHO.CFG.PRICE.
   HEADS (phần đầu = tóc + mũ, tính là 1 món):
     hair: { s:'kiểu tóc', c:'màu' }   kiểu: short long bob twin bun pony spiky
     hat : { k:'loại mũ', c:'màu chính', c2:'màu phụ' } hoặc bỏ trống   loại: nonla beanie beret cap bucket ears bow flowers
   SETS (set quần áo + giày, nhân vật chỉ mặc set, không mặc lẻ):
     top   : tee hoodie shirt suit sailor dress aodai overall
     sleeve: short long none        bottom: pants shorts skirt none
     c1 màu áo · c2 màu phụ · c3 màu quần/váy · shoe màu giày · pat họa tiết (stripe dots heart star flower) · tie màu cà vạt · btn:'gold' nút vàng
     cat   : nam | nu | cs (công sở)  → chỉ để xếp vào tab trong cửa hàng */
window.PHO = window.PHO || {};
PHO.ITEMS = (() => {
  const C = { black: '#3f3445', brown: '#7a5238', chest: '#a56d45', butter: '#f4d98a', mint: '#8fdcc0', pink: '#f7a8c4', lav: '#b9a6ec', silver: '#dfe2ee', orange: '#f08a4b', peach: '#ffb48a', blue: '#8fb8ee', white: '#fff6ee', red: '#e06666', wine: '#a8445a' };

  const SKINS = ['#ffe3d3', '#fbd2b8', '#f2c3a0', '#dca982', '#bc8460', '#94603f'].map(s => s.toLowerCase());

  const HEADS = [
    // ---- tóc (g: nam / nu / chung)
    { id: 'h_short_black', n: 'Tóc ngắn đen', g: 'nam', free: 1, hair: { s: 'short', c: C.black } },
    { id: 'h_long_brown', n: 'Tóc dài nâu', g: 'nu', free: 1, hair: { s: 'long', c: C.brown } },
    { id: 'h_bob_black', n: 'Tóc bob đen', g: 'nu', free: 1, hair: { s: 'bob', c: C.black } },
    { id: 'h_spiky_chest', n: 'Tóc nhím nâu', g: 'nam', free: 1, hair: { s: 'spiky', c: C.chest } },
    { id: 'h_short_brown', n: 'Tóc ngắn nâu', g: 'nam', hair: { s: 'short', c: C.chest } },
    { id: 'h_short_butter', n: 'Tóc ngắn vàng bơ', g: 'chung', hair: { s: 'short', c: C.butter } },
    { id: 'h_short_mint', n: 'Tóc ngắn xanh mint', g: 'chung', hair: { s: 'short', c: C.mint } },
    { id: 'h_spiky_orange', n: 'Tóc nhím cam', g: 'nam', hair: { s: 'spiky', c: C.orange } },
    { id: 'h_spiky_blue', n: 'Tóc nhím xanh', g: 'nam', hair: { s: 'spiky', c: C.blue } },
    { id: 'h_long_black', n: 'Tóc dài đen', g: 'nu', hair: { s: 'long', c: C.black } },
    { id: 'h_long_pink', n: 'Tóc dài hồng', g: 'nu', hair: { s: 'long', c: C.pink } },
    { id: 'h_long_lav', n: 'Tóc dài tím nhạt', g: 'nu', hair: { s: 'long', c: C.lav } },
    { id: 'h_long_silver', n: 'Tóc dài bạc', g: 'chung', hair: { s: 'long', c: C.silver } },
    { id: 'h_bob_butter', n: 'Tóc bob vàng bơ', g: 'nu', hair: { s: 'bob', c: C.butter } },
    { id: 'h_bob_peach', n: 'Tóc bob hồng đào', g: 'nu', hair: { s: 'bob', c: C.peach } },
    { id: 'h_twin_brown', n: 'Hai bím nâu', g: 'nu', hair: { s: 'twin', c: C.brown, a: C.red } },
    { id: 'h_twin_pink', n: 'Hai bím hồng', g: 'nu', hair: { s: 'twin', c: C.pink, a: C.white } },
    { id: 'h_bun_black', n: 'Búi tóc đen', g: 'chung', hair: { s: 'bun', c: C.black, a: C.pink } },
    { id: 'h_bun_orange', n: 'Búi tóc cam đất', g: 'nu', hair: { s: 'bun', c: C.orange, a: C.white } },
    { id: 'h_pony_brown', n: 'Đuôi ngựa nâu', g: 'nu', hair: { s: 'pony', c: C.chest, a: C.red } },
    { id: 'h_pony_mint', n: 'Đuôi ngựa xanh mint', g: 'nu', hair: { s: 'pony', c: C.mint, a: C.white } },
    // ---- mũ (đi kèm tóc)
    { id: 'h_nonla', n: 'Nón lá', g: 'chung', hair: { s: 'short', c: C.black }, hat: { k: 'nonla', c: '#f1d78f', c2: C.pink } },
    { id: 'h_beanie_red', n: 'Mũ len đỏ', g: 'chung', hair: { s: 'bob', c: C.chest }, hat: { k: 'beanie', c: C.red, c2: '#f4a0a0' } },
    { id: 'h_beanie_blue', n: 'Mũ len xanh', g: 'chung', hair: { s: 'short', c: C.black }, hat: { k: 'beanie', c: C.blue, c2: '#cfe3fb' } },
    { id: 'h_beret_wine', n: 'Mũ bê rê đỏ rượu', g: 'nu', hair: { s: 'long', c: C.black }, hat: { k: 'beret', c: C.wine } },
    { id: 'h_beret_lav', n: 'Mũ bê rê tím nhạt', g: 'nu', hair: { s: 'bob', c: C.butter }, hat: { k: 'beret', c: C.lav } },
    { id: 'h_cap_white', n: 'Mũ lưỡi trai trắng', g: 'nam', hair: { s: 'short', c: C.chest }, hat: { k: 'cap', c: '#fffaf2', c2: '#9fb8e8' } },
    { id: 'h_cap_blue', n: 'Mũ lưỡi trai xanh', g: 'nam', hair: { s: 'spiky', c: C.black }, hat: { k: 'cap', c: '#7fa8e8', c2: '#f3f6ff' } },
    { id: 'h_bucket_beige', n: 'Mũ tai bèo be', g: 'chung', hair: { s: 'bob', c: C.brown }, hat: { k: 'bucket', c: '#f3e3c3', c2: '#e2c9a0' } },
    { id: 'h_bucket_pink', n: 'Mũ tai bèo hồng', g: 'nu', hair: { s: 'long', c: C.chest }, hat: { k: 'bucket', c: '#f8bfd2', c2: '#eaa0bb' } },
    { id: 'h_ears_black', n: 'Băng đô tai mèo', g: 'chung', hair: { s: 'long', c: C.black }, hat: { k: 'ears', c: C.black, c2: '#ff9db8' } },
    { id: 'h_ears_white', n: 'Tai mèo trắng', g: 'nu', hair: { s: 'twin', c: C.silver, a: C.pink }, hat: { k: 'ears', c: '#fffaf6', c2: '#ffb3c8' } },
    { id: 'h_bow_red', n: 'Nơ đỏ to', g: 'nu', hair: { s: 'long', c: C.chest }, hat: { k: 'bow', c: C.red, c2: '#ff9f9f' } },
    { id: 'h_flowers', n: 'Vòng hoa', g: 'nu', hair: { s: 'long', c: C.butter }, hat: { k: 'flowers', c: '#ffa9c4', c2: '#fff3a6' } }
  ];

  const SETS = [
    // ---- nam
    { id: 's_tee_jeans', n: 'Áo thun trắng + quần jeans', cat: 'nam', free: 1, top: 'tee', sleeve: 'short', bottom: 'pants', c1: '#fdfbf6', c2: '#9bbcf0', c3: '#7fa0d8', shoe: '#fffaf0', pat: 'star' },
    { id: 's_hoodie_mint', n: 'Hoodie mint + quần be', cat: 'nam', top: 'hoodie', sleeve: 'long', bottom: 'pants', c1: '#9fe0c8', c2: '#ffffff', c3: '#ead9b8', shoe: '#ffffff' },
    { id: 's_stripe_navy', n: 'Áo sọc + quần xanh', cat: 'nam', top: 'tee', sleeve: 'short', bottom: 'pants', c1: '#ffffff', c2: '#7f9ae0', c3: '#55689b', shoe: '#e9eef9', pat: 'stripe' },
    { id: 's_shirt_sky', n: 'Sơ mi xanh trời + quần tây', cat: 'nam', top: 'shirt', sleeve: 'long', bottom: 'pants', c1: '#bfe3ff', c2: '#ffffff', c3: '#5b6aa5', shoe: '#6a5a68' },
    { id: 's_sport_blue', n: 'Đồ thể thao xanh', cat: 'nam', top: 'tee', sleeve: 'short', bottom: 'shorts', c1: '#8fc8ff', c2: '#ffffff', c3: '#6aa9ee', shoe: '#ffffff', pat: 'stripe' },
    { id: 's_baba', n: 'Áo bà ba + quần trắng', cat: 'nam', top: 'shirt', sleeve: 'long', bottom: 'pants', c1: '#5a4f68', c2: '#5a4f68', c3: '#fff6ee', shoe: '#5a4f68', btn: 'gold', nocollar: 1 },
    { id: 's_overall_blue', n: 'Quần yếm xanh', cat: 'nam', top: 'overall', sleeve: 'short', bottom: 'pants', c1: '#7fb5ee', c2: '#fff3a6', c3: '#7fb5ee', shoe: '#a66f4b' },
    { id: 's_pj_star', n: 'Pijama sao', cat: 'nam', top: 'tee', sleeve: 'long', bottom: 'pants', c1: '#cdb8f5', c2: '#fff3a6', c3: '#cdb8f5', shoe: '#f6eefc', pat: 'dots' },
    { id: 's_tee_red', n: 'Áo đỏ + quần short', cat: 'nam', top: 'tee', sleeve: 'short', bottom: 'shorts', c1: '#f58a8a', c2: '#ffffff', c3: '#f3e6c6', shoe: '#fff6ee', pat: 'heart' },
    // ---- nữ
    { id: 's_dress_pink', n: 'Váy hồng', cat: 'nu', free: 1, top: 'dress', sleeve: 'short', bottom: 'skirt', c1: '#fbb6cc', c2: '#fff3f7', c3: '#fbb6cc', shoe: '#f3829f', pat: 'heart' },
    { id: 's_dress_flower', n: 'Váy hoa vàng', cat: 'nu', top: 'dress', sleeve: 'none', bottom: 'skirt', c1: '#ffe38a', c2: '#ff9db8', c3: '#ffe38a', shoe: '#ffffff', pat: 'flower' },
    { id: 's_dress_mint', n: 'Váy xòe mint', cat: 'nu', top: 'dress', sleeve: 'short', bottom: 'skirt', c1: '#a8e8d2', c2: '#ffffff', c3: '#a8e8d2', shoe: '#ffffff', pat: 'dots' },
    { id: 's_skirt_sakura', n: 'Áo trắng + chân váy hồng', cat: 'nu', top: 'tee', sleeve: 'short', bottom: 'skirt', c1: '#fffaf6', c2: '#ffffff', c3: '#f7a8c4', shoe: '#ffffff' },
    { id: 's_sailor', n: 'Đồng phục thủy thủ', cat: 'nu', top: 'sailor', sleeve: 'short', bottom: 'skirt', c1: '#ffffff', c2: '#6f8fd8', c3: '#6f8fd8', shoe: '#5a4f68', sock: '#ffffff' },
    { id: 's_aodai_white', n: 'Áo dài trắng', cat: 'nu', top: 'aodai', sleeve: 'long', bottom: 'none', c1: '#ffffff', c2: '#f6a9c2', c3: '#ffffff', shoe: '#f6d6e0' },
    { id: 's_aodai_red', n: 'Áo dài đỏ', cat: 'nu', top: 'aodai', sleeve: 'long', bottom: 'none', c1: '#ee6a7a', c2: '#ffd34d', c3: '#fff6ee', shoe: '#ffd34d' },
    { id: 's_hoodie_pink', n: 'Hoodie hồng + chân váy', cat: 'nu', top: 'hoodie', sleeve: 'long', bottom: 'skirt', c1: '#f8b5c9', c2: '#ffffff', c3: '#ffffff', shoe: '#ffffff', sock: '#ffffff' },
    { id: 's_pj_cloud', n: 'Pijama mây', cat: 'nu', top: 'tee', sleeve: 'long', bottom: 'pants', c1: '#bfe3ff', c2: '#ffffff', c3: '#bfe3ff', shoe: '#ffffff', pat: 'dots' },
    // ---- công sở
    { id: 's_suit_navy', n: 'Vest nam xanh navy', cat: 'cs', top: 'suit', sleeve: 'long', bottom: 'pants', c1: '#5f6fb0', c2: '#ff9db0', c3: '#53629f', shoe: '#4a3f58', tie: '#ff9db0' },
    { id: 's_suit_grey', n: 'Vest nam xám nhạt', cat: 'cs', top: 'suit', sleeve: 'long', bottom: 'pants', c1: '#b9bdd0', c2: '#6f8fd8', c3: '#a8adc4', shoe: '#4a3f58', tie: '#6f8fd8' },
    { id: 's_suit_beige', n: 'Vest nữ be + chân váy', cat: 'cs', top: 'suit', sleeve: 'long', bottom: 'skirt', c1: '#f1dcc0', c2: '#ffffff', c3: '#e2c9a6', shoe: '#a66f4b', sock: '#fff6ee' },
    { id: 's_blouse_skirt', n: 'Sơ mi + chân váy bút chì', cat: 'cs', top: 'shirt', sleeve: 'long', bottom: 'skirt', c1: '#ffffff', c2: '#ff9db0', c3: '#5f6fb0', shoe: '#4a3f58', tie: '#ff9db0' },
    { id: 's_shirt_white', n: 'Sơ mi trắng + quần tây', cat: 'cs', top: 'shirt', sleeve: 'long', bottom: 'pants', c1: '#ffffff', c2: '#ffffff', c3: '#6a6f8c', shoe: '#4a3f58' },
    { id: 's_blazer_pink', n: 'Blazer hồng + quần', cat: 'cs', top: 'suit', sleeve: 'long', bottom: 'pants', c1: '#f7b5c9', c2: '#ffffff', c3: '#f0a3bb', shoe: '#ffffff', tie: '#ffffff' }
  ];

  const PETS = [
    { id: 'cat', n: 'Mèo Thần Tài', d: 'Chú mèo đỏ lon ton đi theo bạn, mang lại may mắn.' }
  ];

  // Phong cách khởi đầu khi tạo nhân vật (đều miễn phí)
  const STARTERS = [
    { n: 'Chàng trai', head: 'h_short_black', set: 's_tee_jeans' },
    { n: 'Cô gái', head: 'h_long_brown', set: 's_dress_pink' },
    { n: 'Năng động', head: 'h_spiky_chest', set: 's_tee_jeans' },
    { n: 'Dễ thương', head: 'h_bob_black', set: 's_dress_pink' }
  ];

  const hm = {}, sm = {}, pm = {};
  HEADS.forEach(h => hm[h.id] = h); SETS.forEach(s => sm[s.id] = s); PETS.forEach(p => pm[p.id] = p);
  const price = it => it.free ? 0 : (it.d ? PHO.CFG.PET_PRICE : PHO.CFG.PRICE);
  return {
    C, SKINS, HEADS, SETS, PETS, STARTERS, price,
    head: id => hm[id] || HEADS[0], set: id => sm[id] || SETS[0], pet: id => pm[id],
    hasHead: id => !!hm[id], hasSet: id => !!sm[id]
  };
})();
