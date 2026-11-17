/* =====================================================================
   LOWFX.JS — Tự giảm đồ họa cho máy yếu (Phố xá, Lễ hội... bị lag)
   • Đo FPS vài giây đầu; nếu thấp (< ~40 FPS) tự BẬT chế độ nhẹ và nhớ luôn cho lần sau:
       1) Tắt hiệu ứng phát sáng (shadowBlur) — nguyên nhân lag nặng nhất của đèn neon biển hiệu
       2) Vẽ ở độ phân giải thường (devicePixelRatio = 1) — màn hình scale 125–200% nặng gấp 2–4 lần
   • Bật/tắt tay: thêm ?low=1 (bật) hoặc ?low=0 (tắt) sau địa chỉ game. Hoặc gõ trong Console: lowfx(true/false)
   • Chỉ cần thêm 1 dòng <script src="lowfx.js"> vào CUỐI index.html (sau xdeer.js)
   ===================================================================== */
(function(){
const KEY='tl_lowfx';let low=false;
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
else if(saved!=='0'){ // tự đo
 let n=0,t0=0,last=0,slow=0;
 const f=t=>{if(!last){last=t;t0=t}else{const dt=t-last;last=t;if(dt>28&&dt<400)slow++;n++}
  if(t-t0<6000)return requestAnimationFrame(f);
  const fps=n/((t-t0)/1000);
  if(fps<40||slow/Math.max(1,n)>.5){window.lowfx(true);try{toast('⚙️ Máy hơi chậm — đã bật chế độ nhẹ để mượt hơn')}catch(e){}}};
 setTimeout(()=>requestAnimationFrame(f),4000);   // chờ game vào xong rồi mới đo
}
})();
