/* ===================================================================================
   🍼 BÉ BỎNG — HỆ THỐNG BABY HOÀN CHỈNH (file riêng: games/tinyland/baby.js)
   Nạp trong index.html bằng <script src="baby.js"></script> (sau newitems.js).

   • DỮ LIỆU: ST.bb = {on, g:'m'|'f', c:'anh'|'chi', n:tên(≤7 ký tự), ad:ngày nhận nuôi, big:0|1, exp, h:vui vẻ, f:no bụng,
                       t:mốc tính thanh, gt:mốc có quà, nf:đã báo có quà, fl:đang đi theo, pp:pet đã cất, own:[id miniset], set:id đang mặc}
     (ST được lưu cả vào localStorage lẫn đồng bộ lên tài khoản như mọi dữ liệu khác của Tinyland.)
   • Nhận nuôi: chọn bé trai/gái, chọn bé gọi mình Anh/Chị (không đổi được), đặt tên (miễn phí lần đầu, tối đa 7 ký tự).
   • Em bé: nằm nôi. Cho ăn / chơi mỗi lần 20 Xu, +10 EXP. Đủ 100 EXP (hoặc trả 10 💎) → bé lớn.
   • Khi lớn: nhân vật thu nhỏ 70%, mặc Miniset (mặc sẵn "Miniset Ấm áp"), đi theo như pet (pet được cất, chỉ 1 trong 2).
   • 2 thanh Vui vẻ / No bụng tụt theo thời gian thật. Lớn rồi thì tụt chậm hơn nhiều (đỡ tốn xu).
   • Quà: mỗi 2 giờ có 1 món quà, KHÔNG cộng dồn — phải bấm nhận thì mới tính 2 giờ tiếp theo.
   • Đổi tên bé: 1 💎, không ghi chú gì, chỉ hiện thông báo khi đổi.
   • Thời trang: danh sách MINISETS bên dưới. Muốn thêm set mới chỉ cần thêm 1 dòng vào MINISETS (xem hướng dẫn ngay đó).
   =================================================================================== */
(()=>{
/* ---------------- CÂN BẰNG: chỉnh các số ở đây ---------------- */
const BB_COST=20,          // Xu mỗi lần cho ăn / chơi
      BB_FILL=40,          // mỗi lần cho ăn/chơi hồi bao nhiêu % thanh
      BB_ALLOW=60,         // chỉ cho ăn/chơi khi thanh ≤ mức này (tránh bấm liên tục tốn xu)
      BB_EXP=100,BB_XP=10, // EXP để lớn • EXP mỗi lần cho ăn/chơi (chỉ lúc còn là em bé)
      BB_DIA_GROW=10,      // kim cương để cho bé lớn ngay
      BB_DIA_NAME=1,       // kim cương để đổi tên
      BB_NAME_MAX=7,       // số ký tự tối đa của tên
      BB_GIFT_MS=2*60*60*1000,   // 2 giờ / quà
      BB_SCALE=.7,         // bé bằng 70% nhân vật chính
      BB_EMPTY={baby:{f:150,h:180},big:{f:420,h:540}};   // số PHÚT để mỗi thanh tụt từ 100 → 0 (em bé / đã lớn)
/* Quà: trọng số (càng lớn càng hay ra). Kim cương & vé Tí Nị để thấp vì "ít khi". Xu ngẫu nhiên 80–160 */
const BB_GIFTS=[['xu',45],['tk',42],['ti',9],['dia',4]],BB_XU=[80,160],BB_TK=2;

/* ---------------- MINISET (thời trang của Bé bỏng) ----------------
   Muốn thêm set mới: thêm 1 object vào MINISETS (đừng đổi thứ tự/ id các set cũ):
     {id:'duy nhất', n:'Tên hiển thị', xu:giá Xu  (hoặc dia:giá kim cương; bỏ cả hai = miễn phí),
      set:{...giống 1 phần tử trong SETS của index.html: sh, shl, shd, scarf, belt, pt, shoe, fx...},
      hm:{k:'short',c:'#màu'}   ← tóc khi là bé trai   (cùng định dạng phần tử HAIRS)
      hf:{k:'longf',c:'#màu'}   ← tóc khi là bé gái}
   Bé chỉ mặc được CẢ SET (gồm tóc), không đổi riêng tóc hay biểu cảm.                                        */
const XMAS={n:'Miniset Mùa đông',sh:'#c8202a',shl:'#e8454e',shd:'#8f1a22',scarf:'#fbfbfd',tail:1,belt:'#8f1a22',trim:'#fbfbfd',pt:'#2f5d3a',rpt:'#2f5d3a',shoe:'#3a2a22'};
/* mũ Noel + tóc (bé trai: tóc ngắn lòi ra; bé gái: tóc dài xõa) + sao lấp lánh trên đỉnh mũ (nam vàng, nữ hồng) */
HAIRFX.bbxm=(u,o,K)=>{const{side,Rt,back,HS}=K,HC=HS.c,fe=HS.f,tw=Math.floor(performance.now()/300)%3,R='#c8202a',Rl='#e8454e',Rd='#8f1a22',W='#fbfbfd',Wd='#d6dae6',sc=HS.sc,scl=shade(sc,.55);
 const star=(x,y)=>{u(sc,x+1,y,1,3);u(sc,x,y+1,3,1);u(tw?scl:'#ffffff',x+1,y+1,1,1);if(tw==1){u('#ffffff',x-1,y-1,1,1);u('#ffffff',x+3,y+3,1,1)}else if(tw==2){u('#ffffff',x+3,y-1,1,1);u('#ffffff',x-1,y+3,1,1)}};
 if(!side&&!back){
  if(fe){u(HC,5,9,2,13);u(HC,13,9,2,13);u(HC,5,22,2,1);u(HC,13,22,2,1)}else{u(HC,6,9,1,3);u(HC,13,9,1,3)}
  u(R,6,5,8,3);u(R,5,7,10,1);u(Rl,7,5,2,2);u(Rd,12,5,2,3);u(R,7,4,7,1);u(R,8,3,5,1);u(R,10,2,3,1);star(10,-1);
  u(W,5,8,10,2);u(Wd,5,9,10,1)}
 else if(back){
  if(fe){u(HC,5,9,10,14)}else{u(HC,6,9,8,3)}
  u(R,5,5,10,3);u(R,6,4,8,1);u(R,7,3,6,1);u(R,9,2,4,1);u(Rd,5,5,1,3);u(Rd,14,5,1,3);star(10,-1);
  u(W,5,8,10,2);u(Wd,5,9,10,1)}
 else{
  const x0=Rt?5:6,tipx=Rt?5:12;
  if(fe)u(HC,Rt?5:12,9,3,13);else u(HC,Rt?5:12,9,3,3);
  u(R,x0,5,9,3);u(R,Rt?6:7,4,7,1);u(R,Rt?6:8,3,5,1);u(R,Rt?6:8,2,3,1);u(Rd,Rt?5:13,5,2,3);u(Rl,Rt?8:8,5,2,2);star(Rt?5:8,-1);
  u(W,x0,8,9,2);u(Wd,x0,9,9,1)}};
const MINISETS=[
 {id:'warm',n:'Miniset Ấm áp',
  set:{n:'Miniset Ấm áp',sh:'#fbfbfd',shl:'#ffffff',shd:'#d5d9e6',scarf:'#fbfbfd',knot:'#e3e6ee',belt:'#e3e6ee',pt:'#1c1c22',rpt:'#1c1c22',shoe:'#f4f4f6'},
  hm:{n:'Tóc ngắn',k:'short',c:'#2b1d12'},hf:{n:'Tóc dài',k:'longf',c:'#201a24'}},
 /* ---- Miniset Mùa đông: bán ở 🧸 Shop Miniset (Phố xá, chỗ Hiệu thuốc cũ). g = chỉ bé trai ('m') / bé gái ('f') mua & mặc được. shop:1 = có bán trong shop ---- */
 {id:'winm',n:'Miniset Mùa đông',g:'m',xu:250,shop:1,set:XMAS,hm:{n:'Mũ Noel',k:'bbxm',c:'#2b1d12',f:0,sc:'#ffd23f'}},
 {id:'winf',n:'Miniset Mùa đông',g:'f',xu:250,shop:1,set:XMAS,hf:{n:'Mũ Noel',k:'bbxm',c:'#201a24',f:1,sc:'#ff7ab8'}}
];
const msGet=id=>MINISETS.find(x=>x.id==id)||MINISETS[0];

/* ---------------- tiện ích ---------------- */
const B=()=>ST.bb&&ST.bb.on?ST.bb:null,tNow=()=>Date.now();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cleanName=s=>Array.from(String(s||'').normalize('NFC').replace(/[\u0000-\u001f<>]/g,'').trim()).slice(0,BB_NAME_MAX).join('');
const fmtDay=t=>{const d=new Date(t);return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()};
const fmtLeft=ms=>{const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+' giờ '+m+' phút':m?m+' phút '+(s%60)+' giây':(s%60)+' giây'};
function bbFix(){const b=ST.bb;if(!b||!b.on)return;
 b.g=b.g=='f'?'f':'m';b.c=b.c=='chi'?'chi':'anh';b.n=cleanName(b.n)||'Bé';b.ad=+b.ad||tNow();b.big=b.big?1:0;b.exp=cl(b.exp|0,0,BB_EXP);
 b.h=cl(+b.h||0,0,100);b.f=cl(+b.f||0,0,100);b.t=+b.t||tNow();b.gt=+b.gt||tNow()+BB_GIFT_MS;b.fl=b.fl?1:0;b.pp=(b.pp|0)>=0?b.pp|0:-1;
 if(!Array.isArray(b.own))b.own=[];if(!b.own.includes('warm'))b.own.push('warm');b.own=b.own.filter(id=>MINISETS.some(x=>x.id==id));const cs=MINISETS.find(x=>x.id==b.set);if(!cs||!b.own.includes(b.set)||(cs.g&&cs.g!=b.g))b.set='warm'}
bbFix();

/* thanh Vui vẻ / No bụng: tính theo mốc thời gian thật nên vẫn tụt khi tắt game (giống thanh Sức khỏe / Độ no) */
function bars(b){b=b||B();const m=Math.max(0,(tNow()-b.t)/60000),e=BB_EMPTY[b.big?'big':'baby'];return{h:cl(b.h-m*100/e.h,0,100),f:cl(b.f-m*100/e.f,0,100)}}
function settle(b){const c=bars(b);b.h=c.h;b.f=c.f;b.t=tNow()}
function mood(b){const c=bars(b);return c.f<30?'hungry':c.h<30?'bored':'ok'}
function statusTxt(b){const m=mood(b);
 if(b.big)return m=='hungry'?'Đói bụng rồi 🍙':m=='bored'?'Buồn chán, muốn chơi 🥺':'Đang vui vẻ 😊';
 return m=='hungry'?'Đói bụng, khóc nhè 😭':m=='bored'?'Buồn chán, đòi chơi 🥺':'Đang ngủ ngon 💤'}

/* ---------------- VẼ NHÂN VẬT BÉ (dùng lại drawAv của nhân vật chính) ---------------- */
function avObj(b,d,mv,a){const m=msGet(b.set);return{d,a:a||0,mv:mv?1:0,sit:0,e:0,acc:-1,setObj:m.set,hairObj:(m.g||b.g)=='f'?m.hf:m.hm}}
const SPC={};
function sprite(b,d,mv,f){const key=b.set+b.g+'_'+d+(mv?'w'+f:'i')+(msGet(b.set).hm&&msGet(b.set).hm.k=='bbxm'||msGet(b.set).hf&&msGet(b.set).hf.k=='bbxm'?'t'+Math.floor(performance.now()/300)%3:'');let c=SPC[key];if(c)return c;
 c=document.createElement('canvas');c.width=48;c.height=72;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.scale(2,2);
 try{drawAv(g,2,2,avObj(b,d,mv,(f+.5)/9))}catch(e){}return SPC[key]=c}
function drawFollow(){const b=B();if(!b||!b.big||!b.fl||(CVON&&CV.boat)||(HMA&&HMA.hide))return;
 const mv=PET.mv?1:0,f=mv?Math.floor(PET.a*9)%4:0,sp=sprite(b,PET.d|0,mv,f),W=24*BB_SCALE,H=36*BB_SCALE,sm=cx.imageSmoothingEnabled;
 cx.imageSmoothingEnabled=true;try{cx.imageSmoothingQuality='high'}catch(e){}
 cx.drawImage(sp,Math.round(PET.x-12*BB_SCALE),Math.round(PET.y-32*BB_SCALE),W,H);cx.imageSmoothingEnabled=sm}
function drawTag(){const b=B();if(!b||!b.big||!b.fl||(CVON&&CV.boat)||(HMA&&HMA.hide))return;
 cx.save();cx.font='400 6px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';cx.lineJoin='round';cx.lineWidth=1.4;
 const x=Math.round(PET.x),y=Math.round(PET.y-23);cx.strokeStyle='rgba(30,20,10,.55)';cx.strokeText(b.n,x,y);cx.fillStyle='#eafff1';cx.fillText(b.n,x,y);cx.restore()}
/* móc vào vòng vẽ của game (tên vẽ sau cùng để không bị che) */
{const od=window.drawNames;window.drawNames=tm=>{if(od)od(tm);drawTag()}}
window.bbFollowing=()=>{const b=B();return !!(b&&b.big&&b.fl)};
window.bbDrawFollow=drawFollow;

/* ---------------- NÔI EM BÉ (SVG) ---------------- */
function cradle(md){
 const face=md=='hungry'?
  '<path d="M136 101q4-4 8 0M148 101q4-4 8 0" fill="none" stroke="#7a5a4a" stroke-width="2" stroke-linecap="round"/><ellipse cx="147" cy="109" rx="3.4" ry="4" fill="#c9605a"/>'
  +'<g class="bbtear" fill="#8fd0ff"><path d="M138 104q-3 5 0 7q3-2 0-7z"/><path d="M156 104q-3 5 0 7q3-2 0-7z"/></g>'
  :md=='bored'?
  '<circle cx="141" cy="99" r="2.3" fill="#7a5a4a"/><circle cx="153" cy="99" r="2.3" fill="#7a5a4a"/><path d="M144 110q3-3 6 0" fill="none" stroke="#c9806a" stroke-width="1.8" stroke-linecap="round"/>'
  :'<path d="M137 99q4 4 8 0M149 99q4 4 8 0" fill="none" stroke="#7a5a4a" stroke-width="2" stroke-linecap="round"/><path d="M144 108q3 3 6 0" fill="none" stroke="#c9806a" stroke-width="1.8" stroke-linecap="round"/>';
 const zz=md=='ok'?'<g font-family="sans-serif" font-weight="800" fill="#9bb5d6"><text class="bbz" x="190" y="88" font-size="14">z</text><text class="bbz bbz2" x="200" y="74" font-size="18">Z</text></g>':'';
 return '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
 +'<defs><linearGradient id="bbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4f6ec"/><stop offset="1" stop-color="#fff4d8"/></linearGradient></defs>'
 +'<rect width="300" height="200" fill="url(#bbg)"/>'
 +'<ellipse cx="60" cy="40" rx="26" ry="9" fill="#fff" opacity=".8"/><ellipse cx="76" cy="34" rx="16" ry="8" fill="#fff" opacity=".8"/>'
 +'<ellipse cx="248" cy="62" rx="22" ry="8" fill="#fff" opacity=".7"/>'
 +'<g class="bbtw" fill="#ffd86b"><path d="M34 90l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z"/></g><g class="bbtw bbtw2" fill="#ffc9a8"><path d="M262 108l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/></g>'
 +'<g class="bbtw" fill="#bfe8d4"><circle cx="46" cy="140" r="3"/><circle cx="256" cy="150" r="2.5"/></g>'
 +'<g class="bbmo"><line x1="150" y1="0" x2="150" y2="22" stroke="#c9a56b" stroke-width="2"/><line x1="96" y1="22" x2="204" y2="22" stroke="#c9a56b" stroke-width="3" stroke-linecap="round"/>'
 +'<line x1="100" y1="22" x2="100" y2="46" stroke="#d8c39a" stroke-width="1.5"/><path d="M100 44l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#ffd86b"/>'
 +'<line x1="150" y1="22" x2="150" y2="54" stroke="#d8c39a" stroke-width="1.5"/><path d="M150 52a9 9 0 1 0 8 13 7 7 0 0 1-8-13z" fill="#ffe6a8"/>'
 +'<line x1="200" y1="22" x2="200" y2="42" stroke="#d8c39a" stroke-width="1.5"/><g fill="#fff" stroke="#cfe3f5" stroke-width="1"><circle cx="195" cy="48" r="6"/><circle cx="204" cy="46" r="7"/><circle cx="210" cy="50" r="5"/><rect x="192" y="48" width="20" height="7" rx="3.5" stroke="none"/></g></g>'
 +'<ellipse cx="150" cy="184" rx="92" ry="8" fill="#000" opacity=".08"/>'
 +'<g class="'+(md=='ok'?'bbsw':'bbsh')+'"><path d="M92 176q58 14 116 0" fill="none" stroke="#c99a5b" stroke-width="5" stroke-linecap="round"/>'
 +'<path d="M58 118C62 160 100 172 150 172S238 160 242 118Z" fill="#f3d6a4" stroke="#d6b073" stroke-width="3" stroke-linejoin="round"/>'
 +'<g fill="none" stroke="#e6c48c" stroke-width="2" stroke-linecap="round"><path d="M70 134q80 22 160 0"/><path d="M80 150q70 18 140 0"/><path d="M100 164q50 10 100 0"/><path d="M110 120v46M150 124v48M190 120v46" opacity=".6"/></g>'
 +'<ellipse cx="150" cy="118" rx="92" ry="13" fill="#e9c88c" stroke="#d6b073" stroke-width="3"/><ellipse cx="150" cy="119" rx="82" ry="9" fill="#fff6dc"/>'
 +'<ellipse cx="146" cy="104" rx="22" ry="12" fill="#fff" opacity=".9"/>'
 +'<circle cx="146" cy="98" r="21" fill="#ffe3cc"/><path d="M128 92q18-18 36 0q-18-8-36 0z" fill="#fff0c9"/>'
 +face
 +'<ellipse cx="135" cy="107" rx="4.5" ry="3" fill="#ffb7a0" opacity=".7"/><ellipse cx="159" cy="107" rx="4.5" ry="3" fill="#ffb7a0" opacity=".7"/>'
 +'<path d="M84 121Q150 104 216 121L212 128Q150 146 88 128Z" fill="#bfe8d4"/><g fill="#fff" opacity=".85"><circle cx="110" cy="124" r="2"/><circle cx="135" cy="128" r="2"/><circle cx="165" cy="128" r="2"/><circle cx="190" cy="124" r="2"/></g>'
 +'<path d="M58 118Q150 150 242 118" fill="none" stroke="#d6b073" stroke-width="6" stroke-linecap="round"/><path d="M58 118Q150 150 242 118" fill="none" stroke="#e9c88c" stroke-width="3" stroke-linecap="round"/></g>'
 +zz+'</svg>'}

/* ---------------- CSS ---------------- */
(()=>{const css=document.createElement('style');css.textContent=
 '#ui.bbui{width:min(94vw,440px);max-height:90vh;background:linear-gradient(170deg,#f1fbf5 0%,#fff8e6 55%,#eef6ff 100%);border-color:#a9d3bc;box-shadow:0 3px 0 #86b79d;color:#4a6a5a;border-radius:18px}'
 +'#ui.bbui .b.x{background:#dff3e8;border-color:#86b79d;box-shadow:0 2px 0 #86b79d;color:#3f6a55}'
 +'.bbsc{border-radius:16px;overflow:hidden;border:2px solid #cfe6d9;background:#fff;line-height:0}.bbsc svg{width:100%;height:auto;display:block}'
 +'.bbsw{transform-origin:150px 176px;animation:bbsw 4.2s ease-in-out infinite}.bbsh{transform-origin:150px 176px;animation:bbsh .5s ease-in-out infinite}'
 +'@keyframes bbsw{0%,100%{transform:rotate(-1.8deg)}50%{transform:rotate(1.8deg)}}@keyframes bbsh{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}'
 +'.bbmo{transform-origin:150px 22px;animation:bbsw 5.4s ease-in-out infinite reverse}'
 +'.bbz{animation:bbz 3.2s ease-in-out infinite;opacity:0}.bbz2{animation-delay:1.4s}@keyframes bbz{0%{opacity:0;transform:translate(0,6px)}30%{opacity:.9}100%{opacity:0;transform:translate(8px,-14px)}}'
 +'.bbtw{animation:bbtw 2.6s ease-in-out infinite}.bbtw2{animation-delay:1.1s}@keyframes bbtw{0%,100%{opacity:.25}50%{opacity:1}}'
 +'.bbtear{animation:bbtr 1.1s ease-in infinite}@keyframes bbtr{0%{opacity:0;transform:translateY(-2px)}30%{opacity:1}100%{opacity:0;transform:translateY(10px)}}'
 +'.bbcard{background:rgba(255,255,255,.78);border:2px solid #d6eadf;border-radius:14px;padding:10px 12px;margin-top:8px}'
 +'.bbnm{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-weight:800;font-size:15px;color:#3f6a55}.bbnm small{font-size:11px;color:#7b9a8a;font-weight:700;text-align:right}'
 +'.bbbar{height:12px;border-radius:8px;background:#e8f1ec;border:2px solid #cfe6d9;overflow:hidden;box-sizing:content-box;margin-top:4px}.bbbar i{display:block;height:100%;border-radius:6px;transition:width .4s}'
 +'.bbrow{margin-top:8px}.bbrow:first-of-type{margin-top:0}.bbrl{display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#5a7d6c}.bbrl b{color:#6f9a85}'
 +'.bbq{text-align:center;font-size:14px;font-weight:800;color:#3f6a55}.bbq small{display:block;font-size:11px;color:#7b9a8a;font-weight:700;margin-top:2px}'
 +'.bbbt{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:9px;font:inherit;font-weight:800;font-size:14px;border-radius:12px;border:2px solid #cfe6d9;background:#eef6f1;color:#9bb5a7;cursor:pointer}'
 +'.bbbt.on{background:#c9efdc;border-color:#86b79d;color:#2f6a52;box-shadow:0 2px 0 #86b79d}.bbbt.on:active{transform:translateY(2px);box-shadow:none}'
 +'.bbbt.sel{background:#ffe9a8;border-color:#e6c25a;color:#7a5a10;box-shadow:0 2px 0 #e6c25a}.bbbt.warn{background:#ffe0e0;border-color:#e89a9a;color:#a03a3a;box-shadow:0 2px 0 #e89a9a}'
 +'.bbbt small{font-weight:700;font-size:11px;opacity:.85}'
 +'.bbch{display:flex;gap:8px;margin-top:8px}.bbch .bbbt{margin-top:0;flex:1}'
 +'.bbtb{width:100%;border-collapse:collapse;font-size:13px}.bbtb td{padding:5px 2px;border-bottom:1px dashed #d6eadf;color:#4a6a5a}.bbtb tr:last-child td{border-bottom:0}.bbtb td:first-child{color:#7b9a8a;font-weight:700;width:46%}.bbtb td:last-child{font-weight:800;text-align:right}'
 +'.bbrn{display:flex;gap:6px;margin-top:8px}.bbrn input,.bbin{flex:1;min-width:0;box-sizing:border-box;font:inherit;font-weight:700;padding:7px 9px;border:2px solid #cfe6d9;border-radius:10px;background:#fff;color:#3f6a55}.bbrn .bbbt{width:auto;margin-top:0;padding:7px 12px}'
 +'.bbgf{text-align:center;font-weight:800;color:#3f6a55;font-size:13px}.bbgf .big{font-size:30px;display:block;line-height:1.2}'
 +'#hbb.rdy::after{content:"";position:absolute;top:-4px;right:-4px;width:11px;height:11px;border-radius:50%;background:#ff5a5a;border:2px solid #fff;box-shadow:0 1px 0 rgba(0,0,0,.25)}'
 +'.bbav{border-radius:16px;overflow:hidden;border:2px solid #cfe6d9;line-height:0;cursor:pointer;background:linear-gradient(#cfeefc,#e4f6ec 62%,#bfe3a8 62%,#a9d68e)}.bbav canvas{width:100%;height:auto;display:block;image-rendering:pixelated}'
 +'.bbfl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}.bbft{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;border-radius:12px;border:2px solid #cfe6d9;background:#fff;font:inherit;color:#4a6a5a;cursor:pointer}'
 +'.bbft.sel{border-color:#e6c25a;background:#fff6d6}.bbft b{font-size:12px}.bbft small{font-size:10.5px;color:#7b9a8a;font-weight:700}.bbft canvas{width:56px;height:72px;image-rendering:pixelated}';
 document.head.appendChild(css)})();

/* ---------------- GIAO DIỆN ---------------- */
let VIEW='main',SEL={g:'',c:'',n:''},RENN='',RENT=0,CONF=0,CONFT=0,BBDIR=0,BBANI=0,LASTMOOD='';
const isOpen=()=>UI&&$('ui').classList.contains('bbui');
const bar=(id,ic,nm,v,col)=>'<div class="bbrow"><div class="bbrl"><span>'+ic+' '+nm+'</span><b id="'+id+'v">'+Math.round(v)+'%</b></div><div class="bbbar"><i id="'+id+'" style="width:'+v+'%;background:'+col+'"></i></div></div>';
const COL_H='linear-gradient(90deg,#ffe08a,#ffb84d)',COL_F='linear-gradient(90deg,#b5e8d0,#6cc7a3)',COL_X='linear-gradient(90deg,#ffe08a,#ffc24d)';
function show(h,v){const st=$('ui').scrollTop;openUI(h);$('ui').classList.add('bbui');$('ui').scrollTop=st;VIEW=v}
function syncSel(){const i=$('bbnm0');if(i)SEL.n=i.value}
function guard(el){if(!el)return;['keydown','keyup','keypress'].forEach(k=>el.addEventListener(k,e=>e.stopPropagation()))}

function viewAdopt(){
 const b1=(k,v,t)=>'<button class="bbbt'+(SEL[k]==v?' sel':'')+'" onclick="bbSel(\''+k+'\',\''+v+'\')">'+t+'</button>';
 show(head('🍼 Bé bỏng')+'<div class="bbsc">'+cradle('ok')+'</div>'
  +'<div class="bbcard"><div class="bbq">Bé của bạn là</div><div class="bbch">'+b1('g','m','👦 Bé trai')+b1('g','f','👧 Bé gái')+'</div>'
  +'<div class="bbq" style="margin-top:14px">Bạn muốn em bé gọi bạn là<small>Không thể thay đổi sau này</small></div><div class="bbch">'+b1('c','anh','Anh')+b1('c','chi','Chị')+'</div>'
  +'<div class="bbq" style="margin-top:14px">Đặt tên cho bé<small>Tối đa '+BB_NAME_MAX+' ký tự</small></div>'
  +'<div class="bbrn"><input id="bbnm0" class="bbin" maxlength="'+BB_NAME_MAX+'" value="'+esc(SEL.n)+'" placeholder="Tên bé"></div>'
  +'<button class="bbbt on" onclick="bbAdopt()">💝 Nhận nuôi</button></div>','adopt');
 guard($('bbnm0'))}
window.bbSel=(k,v)=>{syncSel();SEL[k]=v;viewAdopt()};
window.bbAdopt=()=>{syncSel();const n=cleanName(SEL.n);
 if(!SEL.g)return toast('👶 Hãy chọn bé trai hoặc bé gái');
 if(!SEL.c)return toast('💬 Hãy chọn bé gọi bạn là Anh hay Chị');
 if(!n)return toast('✏️ Hãy đặt tên cho bé');
 const t=tNow();ST.bb={on:1,g:SEL.g,c:SEL.c,n,ad:t,big:0,exp:0,h:50,f:50,t,gt:t+BB_GIFT_MS,nf:0,fl:0,pp:-1,own:['warm'],set:'warm'};
 save();toast('💝 Bạn đã nhận nuôi '+n+'!\nBé sẽ gọi bạn là '+(SEL.c=='chi'?'Chị':'Anh'));bbUI()};

function charPaint(cv,b,d,mv,sc){const g=cv.getContext('2d'),t=performance.now()/1000;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;
 g.save();g.scale(sc,sc);drawAv(g,(cv.width/sc-20)/2,cv.height/sc-34,avObj(b,d,mv,t));g.restore()}
function paintHero(){const cv=$('bbav'),b=B();if(!cv||!b)return;charPaint(cv,b,[0,3,1,2][BBDIR%4],performance.now()<BBANI,3)}
function heroLoop(){const cv=$('bbav');if(!cv||!UI){return}paintHero();if(performance.now()<BBANI)requestAnimationFrame(heroLoop)}
window.bbTurn=()=>{BBDIR=(BBDIR+1)%4;BBANI=performance.now()+700;heroLoop()};
function paintFashion(){document.querySelectorAll('canvas.bbfc').forEach(c=>{const b=B();if(!b)return;const m=MINISETS[+c.dataset.i];if(!m)return;
 charPaint(c,Object.assign({},b,{set:m.id}),0,0,2)})}

function viewMain(){const b=B();if(!b)return viewAdopt();
 const c=bars(b),md=mood(b),ready=tNow()>=b.gt,nm=esc(b.n);LASTMOOD=md;
 const scene=b.big?'<div class="bbav" onclick="bbTurn()"><canvas id="bbav" width="150" height="120"></canvas></div><div class="mut" style="text-align:center;margin:4px 0 0">👆 Chạm vào bé để xoay</div>'
  :'<div class="bbsc">'+cradle(md)+'</div>';
 let h=head('🍼 Bé bỏng')+scene
 +'<div class="bbcard"><div class="bbnm"><span>'+(b.g=='f'?'👧 ':'👦 ')+nm+'</span><small id="bbst">'+statusTxt(b)+'</small></div>'
 +(b.big?'':'<div class="bbrow"><div class="bbrl"><span>⭐ EXP</span><b id="bbxv">'+b.exp+' / '+BB_EXP+'</b></div><div class="bbbar"><i id="bbx" style="width:'+b.exp/BB_EXP*100+'%;background:'+COL_X+'"></i></div></div>'
   +'<div class="bbq" style="margin-top:6px;font-size:11px;color:#7b9a8a;font-weight:700">Đủ '+BB_EXP+' EXP bé sẽ lớn</div>')
 +bar('bbh','😊','Vui vẻ',c.h,COL_H)+bar('bbf','🍼','No bụng',c.f,COL_F)+'</div>'
 +'<div class="bbcard"><div class="bbch"><button class="bbbt on" onclick="bbAct(\'f\')">🍼 Cho ăn<br><small>'+BB_COST+' 🪙'+(b.big?'':' • +'+BB_XP+' EXP')+'</small></button>'
 +'<button class="bbbt on" onclick="bbAct(\'p\')">🎈 Chơi cùng bé<br><small>'+BB_COST+' 🪙'+(b.big?'':' • +'+BB_XP+' EXP')+'</small></button></div>';
 if(!b.big)h+='<button class="bbbt'+(CONF?' warn':' on')+'" onclick="bbGrowNow()">'+(CONF?'⚠️ Bấm lần nữa để xác nhận (−'+BB_DIA_GROW+' 💎)':'💎 Cho bé lớn ngay ('+BB_DIA_GROW+' 💎)')+'</button>';
 else h+='<button class="bbbt on" onclick="bbFollow()">'+(b.fl?'🏠 Cho bé về nhà':'🚶 Cho Bé bỏng đi theo')+'</button>'
   +(b.fl?'':'<div class="mut" style="text-align:center;margin:4px 0 0">Pet sẽ được cất vào Túi — chỉ có thể 1 pet hoặc 1 Bé bỏng đi theo.</div>');
 h+='</div>'
 +'<div class="bbcard"><div class="bbgf"><span class="big">'+(ready?'🎁':'📦')+'</span>'
 +(ready?'Bé có quà cho '+(b.c=='chi'?'chị':'anh')+'!</div><button class="bbbt on" onclick="bbClaim()">🎁 Nhận quà</button>'
        :'Quà tiếp theo sau <b id="bbgt">'+fmtLeft(b.gt-tNow())+'</b></div>')+'</div>'
 +'<div class="bbcard"><table class="bbtb"><tr><td>Tên bé</td><td id="bbtn">'+nm+'</td></tr><tr><td>Ngày nhận nuôi</td><td>'+fmtDay(b.ad)+'</td></tr>'
 +'<tr><td>Giới tính</td><td>'+(b.g=='f'?'Bé gái':'Bé trai')+'</td></tr><tr><td>Bé gọi bạn là</td><td>'+(b.c=='chi'?'Chị':'Anh')+'</td></tr>'
 +'<tr><td>Giai đoạn</td><td>'+(b.big?'🌟 Đã lớn':'🍼 Em bé')+'</td></tr></table>'
 +'<div class="bbrn"><input id="bbrn" maxlength="'+BB_NAME_MAX+'" value="'+esc(RENN||b.n)+'" placeholder="Tên mới">'+(RENN?'':'<button class="bbbt on" onclick="bbRename()">✏️ Đổi tên</button>')+'</div>'
 +(RENN?'<div class="bbch"><button class="bbbt warn" onclick="bbRename()">⚠️ Xác nhận đổi tên (−'+BB_DIA_NAME+' 💎)</button><button class="bbbt on" style="flex:none;width:30%" onclick="bbRenCancel()">Hủy</button></div>':'')+'</div>'
 +'<button class="bbbt on" onclick="bbFashion()">👗 Thời trang</button>';
 show(h,'main');guard($('bbrn'));if(b.big)paintHero()}

window.bbUI=()=>{const b=B();CONF=0;RENN='';if(!b){SEL={g:'',c:'',n:''};return viewAdopt()}viewMain()};
function refresh(){if(!isOpen())return;if(VIEW=='fash')viewFashion();else if(VIEW=='main')viewMain()}

window.bbAct=k=>{const b=B();if(!b)return;settle(b);const feed=k=='f';
 if((feed?b.f:b.h)>BB_ALLOW){save();return toast(feed?'🍼 '+b.n+' còn no, chút nữa hãy cho ăn nha!':'🎈 '+b.n+' đang vui lắm, chút nữa hãy chơi nha!')}
 if(ST.xu<BB_COST)return toast('🪙 Chưa đủ xu — cần '+BB_COST+' xu');
 ST.xu-=BB_COST;xuUp();if(feed)b.f=Math.min(100,b.f+BB_FILL);else b.h=Math.min(100,b.h+BB_FILL);
 let tx=feed?'🍼 '+b.n+' ăn no rồi!':'🎈 '+b.n+' chơi vui quá!';
 if(!b.big){b.exp=Math.min(BB_EXP,b.exp+BB_XP);tx+=' +'+BB_XP+' EXP';if(b.exp>=BB_EXP){b.big=1;b.nf=0;tx+='\n🎉 '+b.n+' đã lớn rồi! Giờ bé mặc đồ và đi theo bạn được nè'}}
 save();toast(tx);refresh()};
window.bbGrowNow=()=>{const b=B();if(!b||b.big)return;
 if(!CONF){if((ST.dia|0)<BB_DIA_GROW)return toast('💎 Chưa đủ kim cương — cần '+BB_DIA_GROW+', bạn có '+(ST.dia|0));CONF=1;clearTimeout(CONFT);CONFT=setTimeout(()=>{CONF=0;if(isOpen()&&VIEW=='main')viewMain()},4000);return viewMain()}
 clearTimeout(CONFT);CONF=0;if((ST.dia|0)<BB_DIA_GROW)return toast('💎 Chưa đủ kim cương — cần '+BB_DIA_GROW+', bạn có '+(ST.dia|0));
 ST.dia-=BB_DIA_GROW;xuUp();settle(b);b.big=1;b.exp=BB_EXP;save();toast('🎉 '+b.n+' đã lớn rồi! (−'+BB_DIA_GROW+' 💎)');refresh()};
window.bbRenCancel=()=>{RENN='';clearTimeout(RENT);viewMain()};
window.bbRename=()=>{const b=B(),i=$('bbrn');if(!b||!i)return;const n=cleanName(i.value);
 if(!n)return toast('✏️ Tên không được để trống');if(n==b.n){RENN='';return toast('✏️ Đó đang là tên của bé rồi')}
 if((ST.dia|0)<BB_DIA_NAME)return toast('💎 Chưa đủ kim cương — cần '+BB_DIA_NAME+', bạn có '+(ST.dia|0));
 if(RENN!=n){RENN=n;clearTimeout(RENT);RENT=setTimeout(()=>{RENN='';if(isOpen()&&VIEW=='main'&&!(document.activeElement&&document.activeElement.tagName=='INPUT'))viewMain()},8000);return viewMain()}
 RENN='';clearTimeout(RENT);ST.dia-=BB_DIA_NAME;xuUp();const old=b.n;b.n=n;save();toast('✏️ Đã đổi tên bé: '+old+' → '+n+' (−'+BB_DIA_NAME+' 💎)');refresh()};

window.bbClaim=()=>{const b=B();if(!b)return;if(tNow()<b.gt)return toast('📦 Chưa tới giờ nhận quà');
 let u=Math.random()*BB_GIFTS.reduce((a,x)=>a+x[1],0),k=BB_GIFTS[0][0];for(const [n,w] of BB_GIFTS){u-=w;if(u<0){k=n;break}}
 let tx;
 if(k=='dia'){ST.dia=(ST.dia|0)+1;tx='+1 💎 kim cương (quà hiếm!)'}
 else if(k=='ti'){tiEnsure().tk++;tx='+1 🎟️ Vé Tí Nị (quà hiếm!)'}
 else if(k=='tk'){ST.tk=(ST.tk|0)+BB_TK;tx='+'+BB_TK+' 🎟️ vé quay số'}
 else{const x=BB_XU[0]+Math.floor(Math.random()*(BB_XU[1]-BB_XU[0]+1));ST.xu+=x;tx='+'+x+' 🪙 Xu'}
 b.gt=tNow()+BB_GIFT_MS;b.nf=0;xuUp();save();toast('🎁 '+b.n+' tặng bạn quà!\n'+tx);refresh()};

window.bbFollow=()=>{const b=B();if(!b)return;if(!b.big)return toast('🍼 Bé còn nhỏ, lớn rồi mới đi theo bạn được nha');
 if(b.fl){b.fl=0;const p=b.pp|0;if(p>=0&&ST.own.p.includes(p)){ST.av.p=p;petReset()}b.pp=-1;save();toast('🏠 '+b.n+' về nhà nghỉ');return refresh()}
 b.pp=ST.av.p>=0?ST.av.p:-1;ST.av.p=-1;b.fl=1;petReset();save();
 toast('🚶 '+b.n+' đang đi theo bạn'+(b.pp>=0?'\nPet đã được cất vào Túi':''));refresh()};

/* ---------- Thời trang ---------- */
function viewFashion(){const b=B();if(!b)return viewAdopt();
 let h='<div class="uh"><span><button class="b x" onclick="bbUI()">‹ Bé bỏng</button> 👗 Thời trang</span><button class="b x" onclick="closeUI()">X</button></div>'
 +(b.big?'<div class="bbav" onclick="bbTurn()"><canvas id="bbav" width="150" height="120"></canvas></div><div class="mut" style="text-align:center;margin:4px 0 0">👆 Chạm vào bé để xoay</div>'
        :'<div class="bbcard" style="text-align:center;font-weight:800;color:#7b9a8a;margin-top:0">🔒 Bé lớn rồi mới thay đồ được nha<div class="mut" style="margin:4px 0 0">Bạn vẫn có thể xem trước các Miniset bên dưới.</div></div>')
 +'<div class="mut" style="text-align:center">Bé chỉ mặc được cả set (gồm cả tóc). Bạn có 🪙 '+fmtXu(ST.xu)+' • 💎 '+(ST.dia|0)+'</div><div class="bbfl">';
 MINISETS.forEach((m,i)=>{if(m.g&&m.g!=b.g)return;const own=b.own.includes(m.id),on=b.set==m.id,pr=m.dia?'💎 '+m.dia:m.xu?'🪙 '+m.xu:'Miễn phí';
  h+='<button class="bbft'+(on?' sel':'')+'" onclick="bbSetPick('+i+')"><canvas class="bbfc" data-i="'+i+'" width="56" height="72"></canvas><b>'+esc(m.n)+'</b><small>'+(on?'✅ Đang mặc':own?'Đã có':pr)+'</small></button>'});
 h+='</div><div class="mut" style="text-align:center;margin-top:8px">✨ Sẽ có thêm Miniset mới, ghé lại sau nhé!</div>';
 show(h,'fash');paintFashion();if(b.big)paintHero()}
window.bbFashion=()=>viewFashion();
window.bbSetPick=i=>{const b=B(),m=MINISETS[i];if(!b||!m)return;
 if(m.g&&m.g!=b.g)return toast('🔒 Set này dành cho '+(m.g=='f'?'bé gái':'bé trai'));
 if(!b.own.includes(m.id)){const dia=m.dia|0,xu=m.xu|0;
  if(dia&&(ST.dia|0)<dia)return toast('💎 Chưa đủ kim cương — cần '+dia+', bạn có '+(ST.dia|0));
  if(xu&&ST.xu<xu)return toast('🪙 Chưa đủ xu — cần '+xu+' xu');
  ST.dia=(ST.dia|0)-dia;ST.xu-=xu;xuUp();b.own.push(m.id);toast('🛍️ Đã mua '+m.n+'!')}
 if(!b.big){save();return viewFashion()}
 b.set=m.id;save();toast('👗 '+b.n+' đã mặc '+m.n);viewFashion()};


/* ---------- 🧸 SHOP MINISET (Phố xá, chỗ Hiệu thuốc cũ — pho-map.js gọi bbShop()) ---------- */
let SHSEL=-1;
function shopList(){return MINISETS.map((m,i)=>[m,i]).filter(x=>x[0].shop)}
function paintShop(){const b=B();if(!b)return;document.querySelectorAll('canvas.bbsc2').forEach(c=>{const m=MINISETS[+c.dataset.i];if(m)charPaint(c,Object.assign({},b,{set:m.id,g:m.g||b.g}),0,0,2)})}
window.bbShop=()=>{const b=B();
 if(!b)return show(head('🧸 Shop Miniset')+'<div class="bbcard" style="text-align:center;font-weight:800;color:#7b9a8a">Bạn chưa nhận nuôi Bé bỏng nè<div class="mut" style="margin:6px 0 0">Bấm nút 🍼 Bé bỏng để nhận nuôi, rồi quay lại mua Miniset cho bé nhé!</div></div>','shop');
 const L=shopList(),sel=L.find(x=>x[1]==SHSEL);let h=head('🧸 Shop Miniset')+'<div class="mut" style="text-align:center">Set mua xong nằm trong <b>👗 Thời trang</b> của Bé bỏng. Bạn có 🪙 '+fmtXu(ST.xu)+'</div><div class="bbfl">';
 L.forEach(([m,i])=>{const own=b.own.includes(m.id),lock=m.g&&m.g!=b.g;
  h+='<button class="bbft'+(SHSEL==i?' sel':'')+'" style="'+(lock?'opacity:.6':'')+'" onclick="bbShopSel('+i+')"><canvas class="bbsc2" data-i="'+i+'" width="56" height="72"></canvas><b>'+esc(m.n)+'</b><small>'+(m.g=='f'?'👧 Bé gái':m.g=='m'?'👦 Bé trai':'')+'</small><small>'+(own?'✅ Đã có':lock?'🔒 Không hợp bé':'🪙 '+m.xu)+'</small></button>'});
 h+='</div>';
 if(sel){const m=sel[0],own=b.own.includes(m.id),lock=m.g&&m.g!=b.g;
  h+=own?'<button class="bbbt" disabled>✅ Bé đã có set này</button>':lock?'<button class="bbbt" disabled>🔒 Set này dành cho '+(m.g=='f'?'bé gái':'bé trai')+', bé của bạn là '+(b.g=='f'?'bé gái':'bé trai')+'</button>'
   :'<button class="bbbt on" onclick="bbShopBuy('+sel[1]+')">🛍️ Mua — '+m.xu+' Xu</button>'}
 else h+='<div class="mut" style="text-align:center;margin-top:8px">👆 Chọn 1 set để mua</div>';
 show(h,'shop');paintShop()};
window.bbShopSel=i=>{SHSEL=i;bbShop()};
window.bbShopBuy=i=>{const b=B(),m=MINISETS[i];if(!b||!m||!m.shop)return;
 if(m.g&&m.g!=b.g)return toast('🔒 Set này dành cho '+(m.g=='f'?'bé gái':'bé trai'));
 if(b.own.includes(m.id))return toast('✅ Bé đã có set này rồi');
 if(ST.xu<m.xu)return toast('🪙 Chưa đủ xu — cần '+m.xu+' xu');
 ST.xu-=m.xu;xuUp();b.own.push(m.id);save();toast('🛍️ Đã mua '+m.n+'!\nSet nằm trong 👗 Thời trang của '+b.n);bbShop()};

/* ---------------- NHỊP CẬP NHẬT (gọi mỗi khung hình từ update() của game) ---------------- */
let acc=0;
window.bbTick=dt=>{acc+=dt;if(acc<1)return;acc=0;const b=B();if(!b)return;
 // đang dẫn pet đi theo thì Bé bỏng tự về nhà (chỉ 1 pet HOẶC 1 bé)
 if(b.fl&&ST.av.p>=0){b.fl=0;b.pp=-1;save();toast('🏠 '+b.n+' về nhà vì bạn dẫn pet đi theo')}
 const ready=tNow()>=b.gt,hb=$('hbb');if(hb)hb.classList.toggle('rdy',ready);
 if(ready&&!b.nf){b.nf=1;save();toast('🎁 '+b.n+' có quà cho bạn! Mở 🍼 Bé bỏng để nhận')}
 if(!isOpen()||VIEW!='main')return;
 const c=bars(b),set=(id,v)=>{const e=$(id),t=$(id+'v');if(e)e.style.width=v+'%';if(t)t.textContent=Math.round(v)+'%'};
 set('bbh',c.h);set('bbf',c.f);const st=$('bbst');if(st)st.textContent=statusTxt(b);
 const g=$('bbgt');if(g){if(ready){if(!(document.activeElement&&document.activeElement.tagName=='INPUT'))viewMain()}else g.textContent=fmtLeft(b.gt-tNow())}
 if(mood(b)!=LASTMOOD&&!b.big&&!(document.activeElement&&document.activeElement.tagName=='INPUT'))viewMain()};
setTimeout(()=>{try{bbTick(1)}catch(e){}},1500);
})();
