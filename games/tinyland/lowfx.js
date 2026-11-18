/* =====================================================================
   LOWFX.JS — Tự giảm đồ họa cho máy yếu (Phố xá, Lễ hội... bị lag)
   • Chỉ bật khi người chơi bấm nút "Giảm lag" (panel Thông tin), nhớ cho lần sau:
       1) Tắt hiệu ứng phát sáng (shadowBlur) — nguyên nhân lag nặng nhất của đèn neon biển hiệu
       2) Vẽ ở độ phân giải thường (devicePixelRatio = 1) — màn hình scale 125–200% nặng gấp 2–4 lần
   • Bật/tắt tay: thêm ?low=1 (bật) hoặc ?low=0 (tắt) sau địa chỉ game. Hoặc gõ trong Console: lowfx(true/false)
   • Chỉ cần thêm 1 dòng <script src="lowfx.js"> vào CUỐI index.html (sau xdeer.js)
   ===================================================================== */
(function(){
/* khóa mới: bỏ trạng thái tự bật của bản cũ */
const KEY='tl_lowfx2';let low=false;
const P=CanvasRenderingContext2D.prototype,sb=Object.getOwnPropertyDescriptor(P,'shadowBlur'),dprD=Object.getOwnPropertyDescriptor(window,'devicePixelRatio');
function apply(on){low=!!on;
 try{Object.defineProperty(P,'shadowBlur',on?{configurable:true,get(){return 0},set(v){}}:sb)}catch(e){}
 try{Object.defineProperty(window,'devicePixelRatio',on?{configurable:true,get(){return 1}}:(dprD||{configurable:true,get(){return 1}}))}catch(e){}
 try{window.dispatchEvent(new Event('resize'))}catch(e){}}
window.lowfx=function(on){try{localStorage.setItem(KEY,on?'1':'0')}catch(e){}apply(on);console.log('Chế độ nhẹ:',on?'BẬT':'TẮT')};
let saved=null;try{saved=localStorage.getItem(KEY)}catch(e){}
const q=new URLSearchParams(location.search).get('low');
if(q==='1'||q==='0')window.lowfx(q==='1');
else if(saved==='1')apply(true);
/* Không còn tự đo FPS / tự bật. Người chơi bật tay bằng nút "Giảm lag" ở panel Thông tin. */
window.lowfxOn=()=>low;
window.lowfxBtn=()=>{window.lowfx(!low);const b=document.getElementById('lowfxb');if(b)b.innerHTML=window.lowfxLabel()};
window.lowfxLabel=()=>'⚡ Giảm lag: <b>'+(low?'BẬT':'TẮT')+'</b>';
})();
