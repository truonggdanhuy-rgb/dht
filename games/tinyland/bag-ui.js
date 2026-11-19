/* =====================================================================
   BAG-UI.JS — 🎒 Giao diện TÚI NHÂN VẬT mới (file riêng, không sửa index.html ngoài 1 dòng <script>)
   - Khung túi cố định chiều cao, CHỈ có 1 vùng cuộn (trước đây cuộn lồng nhau, ô chỉ hiện ~2 hàng)
   - Nút ⤢ MỞ RỘNG panel (gần full màn hình). Máy tính: tab dọc bên trái + nhân vật to; điện thoại: toàn màn hình
   - Ô vật phẩm chỉnh được cỡ (nhỏ / vừa / lớn), có ô 🔍 TÌM theo tên
   - Tab hiển thị số lượng đồ đang có; vuốt trái/phải trên danh sách để đổi tab
   - Nhân vật xem trước luôn nằm cố định, không trôi mất khi cuộn; các ghi chú dài gom vào nút ℹ️
   Cách hoạt động: bọc openUI — mỗi khi UI có khối .bgw (túi / đồ ăn) thì sắp xếp lại DOM, các hàm cũ
   (bagUI, foodUI, avPick, avPaint, avLoop, perso.js...) vẫn chạy y như cũ vì id/class được giữ nguyên.
   Muốn quay về giao diện cũ: xóa dòng <script src="bag-ui.js"> trong index.html.
   ===================================================================== */
(function(){
if(typeof openUI!=='function'||window.__bagx)return;window.__bagx=1;
const $$=id=>document.getElementById(id);
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
let BIG=LS('tl_bag_big')=='1',CELL=+(LS('tl_bag_cell')||1),BQ='',BQT='',INFO=0;
const CELLS=[[72,'Nhỏ'],[92,'Vừa'],[122,'Lớn']];
if(!(CELL>=0&&CELL<=2))CELL=1;

const css=document.createElement('style');
css.textContent=`
#ui.bagx{overflow:hidden;max-height:none;height:min(88vh,780px);height:min(88dvh,780px);padding:8px;overscroll-behavior:contain}
#ui.bagx.bagbig{width:min(98vw,1020px);height:min(96vh,940px);height:min(96dvh,940px)}
.bgx{display:flex;flex-direction:column;height:100%;min-height:0;gap:6px;--cell:92px}
.bgx-hd{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:800;flex:none}
.bgx-hd .hb{display:flex;gap:5px}.bgx-hd .b{margin:0;min-width:36px;padding:4px 9px}
.bgx-body{display:grid;gap:6px 8px;flex:1;min-height:0;grid-template-columns:116px minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);grid-template-areas:"pv tabs" "main main"}
.bgx-body.nopv{grid-template-columns:minmax(0,1fr)!important;grid-template-areas:"tabs" "main"!important}
.bgx-body.nopv .bgx-pv{display:none}
.bgx-pv{grid-area:pv;min-width:0;text-align:center}
.bgx-pv canvas#avp{width:100%!important;height:auto!important;max-width:240px;display:block;margin:0 auto;cursor:pointer;border-radius:6px}
.bgx-pv .tip{font-size:10px;color:#6a3d1c;line-height:1.2;margin-top:2px}
.bgx-vit{display:flex;flex-direction:column;gap:3px;font-size:12px;font-weight:800;padding:6px;background:#fff3cf;border:2px solid #c9a06a;text-align:left}
.bgx-tabs{grid-area:tabs;display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start;min-width:0}
.bgx-tabs .b{flex:1 1 28%;margin:0;padding:6px 3px;font-size:12px;line-height:1.15;width:auto;position:relative;white-space:nowrap}
.bgx-tabs .b.on{background:#ffe27a;border-color:#d9a000}
.bgx-tabs .n{display:inline-block;margin-left:3px;min-width:15px;padding:0 4px;border-radius:9px;background:#7a4a26;color:#fff;font-size:10px;font-weight:800;line-height:15px;vertical-align:1px}
.bgx-tabs .b.on .n{background:#d9a000}
.bgx-main{grid-area:main;display:flex;flex-direction:column;min-height:0;min-width:0;gap:5px}
.bgx-tb{display:flex;gap:5px;align-items:center;flex:none}
.bgx-tb input{flex:1;min-width:0;font:inherit;font-size:13px;padding:6px 8px;border:2px solid #7a4a26;background:#fff8e6;color:#3a2412;border-radius:0;outline:0}
.bgx-tb input:focus{border-color:#d9a000}
.bgx-tb .b{margin:0;padding:5px 8px;white-space:nowrap;font-size:12px}
.bgx-info{flex:none;font-size:11.5px;background:#fff3cf;border:2px solid #c9a06a;padding:5px 7px;max-height:30vh;overflow:auto}.bgx-info .mut{margin:2px 0}
.bgx-main .bgr{flex:1;min-height:0;max-height:none!important;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding:0 3px 6px 0;scrollbar-width:thin}
#ui.bagx .bgr .sg{grid-template-columns:repeat(auto-fill,minmax(var(--cell),1fr))!important;gap:6px}
#ui.bagx .bgr .sq{min-height:calc(var(--cell) * .98)}
#ui.bagx .bgr .sq canvas.avt{width:calc(var(--cell) * .64)!important;height:auto!important;max-height:calc(var(--cell) * .66);object-fit:contain}
#ui.bagx .bgr .sq b{font-size:calc(11px + (var(--cell) - 72px) / 30);word-break:break-word}
#ui.bagx .bgr .it{padding:9px 8px}
.bgx-empty{padding:18px 8px;text-align:center;color:#6a3d1c;font-weight:700}
.bgx-body .bgr::-webkit-scrollbar{width:7px}.bgx-body .bgr::-webkit-scrollbar-thumb{background:#c9a06a;border-radius:4px}
/* MỞ RỘNG trên màn rộng: nhân vật to + tab dọc bên trái */
@media (min-width:720px){
 #ui.bagx.bagbig .bgx-body{grid-template-columns:230px minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);grid-template-areas:"pv main" "tabs main"}
 #ui.bagx.bagbig .bgx-tabs{flex-direction:column;flex-wrap:nowrap;overflow-y:auto}
 #ui.bagx.bagbig .bgx-tabs .b{flex:none;text-align:left;padding:10px 12px;font-size:13.5px}
 #ui.bagx.bagbig .bgx-tabs .n{float:right;margin-top:1px}
 #ui.bagx.bagbig .bgx-pv canvas#avp{max-width:230px}
 #ui.bagx.bagbig .bgx-body.nopv{grid-template-columns:230px minmax(0,1fr)!important;grid-template-areas:"pv main" "tabs main"!important}
}
/* Điện thoại: mở rộng = toàn màn hình */
@media (max-width:719px){
 #ui.bagx.bagbig{width:100vw;height:100vh;height:100dvh;max-height:none;border-radius:0;top:50%}
 #ui.bagx.bagbig .bgx-body{grid-template-columns:140px minmax(0,1fr)}
}
/* Màn thấp (xoay ngang điện thoại): xếp ngang cho đủ chỗ */
@media (min-width:520px) and (max-height:520px){
 #ui.bagx{width:min(98vw,820px);height:96vh;height:96dvh}
 #ui.bagx .bgx-body,#ui.bagx.bagbig .bgx-body{grid-template-columns:150px minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);grid-template-areas:"pv main" "tabs main"}
 #ui.bagx .bgx-tabs{flex-direction:column;flex-wrap:nowrap;overflow-y:auto}
 #ui.bagx .bgx-tabs .b{flex:none;text-align:left;padding:5px 8px}
 #ui.bagx .bgx-pv canvas#avp{max-width:120px}
}
`;
document.head.appendChild(css);

/* số lượng đồ của từng tab */
function cnt(k){try{
 if(k=='f'){const f=ST.food||{};return Object.keys(f).reduce((a,n)=>a+(f[n]>0?f[n]:0),0)}
 const L=avItems(k);return L.filter(x=>x.idx>=0).length}catch(e){return ''}}

function build(ui){
 const bgw=ui.querySelector('.bgw');
 if(!bgw){ui.classList.remove('bagx','bagbig');return}
 if(ui.querySelector('.bgx'))return;
 const hd=ui.querySelector('.uh'),cv=ui.querySelector('#avp'),tabsOld=bgw.querySelector('.bgt'),bgr=bgw.querySelector('.bgr');
 if(!tabsOld||!bgr)return;
 const curKey=(tabsOld.querySelector('.b.on')||{}).getAttribute?(tabsOld.querySelector('.b.on').getAttribute('onclick')||'').replace(/^.*\('(\w+)'\).*$/,'$1'):'';
 if(curKey!==BQT){BQ='';BQT=curKey}
 /* ghi chú đầu trang (Đang mặc Mascot...) → nút ℹ️ */
 const notes=[...ui.children].filter(e=>e.classList&&e.classList.contains('mut'));
 const pvWrap=cv?cv.parentElement:null;
 const hint=pvWrap?pvWrap.querySelector('.mut'):null;

 const root=document.createElement('div');root.className='bgx';root.style.setProperty('--cell',CELLS[CELL][0]+'px');
 /* header */
 const h=document.createElement('div');h.className='bgx-hd';
 const title=hd?hd.querySelector('span'):null;
 h.innerHTML='<span>'+(title?title.innerHTML:'🎒 Túi nhân vật')+'</span><span class="hb"><button class="b" id="bgxBig" title="Mở rộng / thu nhỏ" onclick="bagxBig()">'+(BIG?'⤡ Thu nhỏ':'⤢ Mở rộng')+'</button></span>';
 const xb=hd?hd.querySelector('button'):null;if(xb)h.querySelector('.hb').appendChild(xb);
 root.appendChild(h);
 /* body */
 const body=document.createElement('div');body.className='bgx-body'+(cv?'':' nopv');
 const pv=document.createElement('div');pv.className='bgx-pv';
 if(cv){pv.appendChild(cv);const t=document.createElement('div');t.className='tip';t.textContent='Chạm nhân vật để xoay';pv.appendChild(t)}
 else{try{const v=vit();pv.innerHTML='<div class="bgx-vit"><span>🍚 Độ no: '+Math.round(v.f)+'%</span><span>💤 Sức khỏe: '+Math.round(v.h)+'%</span></div>'}catch(e){}}
 body.appendChild(pv);
 const tabs=document.createElement('div');tabs.className='bgx-tabs';
 [...tabsOld.querySelectorAll('.b')].forEach(b=>{
  const k=(b.getAttribute('onclick')||'').replace(/^.*\('(\w+)'\).*$/,'$1'),n=cnt(k);
  if(n!==''&&!/<i class="n">/.test(b.innerHTML))b.insertAdjacentHTML('beforeend','<i class="n">'+n+'</i>');
  b.dataset.k=k;tabs.appendChild(b)});
 body.appendChild(tabs);
 /* main: thanh công cụ + danh sách */
 const main=document.createElement('div');main.className='bgx-main';
 const tb=document.createElement('div');tb.className='bgx-tb';
 tb.innerHTML='<input type="search" id="bgxQ" placeholder="🔍 Tìm đồ..." autocomplete="off" value="'+BQ.replace(/"/g,'&quot;')+'"><button class="b" id="bgxCell" title="Đổi cỡ ô">▦ '+CELLS[CELL][1]+'</button>'+(notes.length||hint?'<button class="b" id="bgxInfo" title="Ghi chú">ℹ️</button>':'');
 main.appendChild(tb);
 if(notes.length){const inf=document.createElement('div');inf.className='bgx-info';inf.id='bgxInfoBox';inf.style.display=INFO?'block':'none';notes.forEach(n=>inf.appendChild(n));main.appendChild(inf)}
 main.appendChild(bgr);
 body.appendChild(main);root.appendChild(body);
 ui.innerHTML='';ui.appendChild(root);
 ui.classList.add('bagx');ui.classList.toggle('bagbig',BIG);

 const q=root.querySelector('#bgxQ');
 const filt=()=>{BQ=q.value;const s=BQ.trim().toLowerCase();let shown=0,tot=0;
  bgr.querySelectorAll('.sq,.it').forEach(e=>{tot++;const t=(e.textContent||'').toLowerCase(),ok=!s||t.includes(s);e.style.display=ok?'':'none';if(ok)shown++});
  let em=bgr.querySelector('.bgx-empty');
  if(s&&tot&&!shown){if(!em){em=document.createElement('div');em.className='bgx-empty';bgr.insertBefore(em,bgr.firstChild)}em.textContent='Không thấy "'+BQ+'" 🤔'}else if(em)em.remove()};
 q.addEventListener('input',filt);filt();
 /* đổi cỡ ô */
 root.querySelector('#bgxCell').onclick=function(){CELL=(CELL+1)%3;LS('tl_bag_cell',CELL);root.style.setProperty('--cell',CELLS[CELL][0]+'px');this.textContent='▦ '+CELLS[CELL][1]};
 const ib=root.querySelector('#bgxInfo');
 if(ib)ib.onclick=()=>{INFO=!INFO;const bx=root.querySelector('#bgxInfoBox');if(bx)bx.style.display=INFO?'block':'none';else if(hint){toast(hint.textContent)}};
 /* vuốt trái/phải đổi tab */
 let sx=0,sy=0,st=0;
 bgr.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now()},{passive:true});
 bgr.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(Date.now()-st<600&&Math.abs(dx)>80&&Math.abs(dy)<35){const ks=[...tabs.querySelectorAll('.b')].map(b=>b.dataset.k),i=ks.indexOf(curKey),j=i+(dx<0?1:-1);
   if(i>=0&&j>=0&&j<ks.length&&typeof bagUI==='function')bagUI(ks[j])}},{passive:true});
 /* cuộn tab đang chọn vào tầm nhìn */
 const on=tabs.querySelector('.b.on');if(on&&on.scrollIntoView&&tabs.scrollHeight>tabs.clientHeight)try{on.scrollIntoView({block:'nearest'})}catch(e){}
}

window.bagxBig=function(){BIG=!BIG;LS('tl_bag_big',BIG?'1':'0');const ui=$$('ui');ui.classList.toggle('bagbig',BIG);const b=$$('bgxBig');if(b)b.textContent=BIG?'⤡ Thu nhỏ':'⤢ Mở rộng'};

const o0=openUI;
window.openUI=openUI=function(h){const r=o0.apply(this,arguments);try{build($$('ui'))}catch(e){console.warn('bag-ui',e)}return r};
/* đóng UI khác → bỏ chế độ túi */
const c0=closeUI;
window.closeUI=closeUI=function(){const r=c0.apply(this,arguments);try{$$('ui').classList.remove('bagx','bagbig')}catch(e){}return r};
})();
