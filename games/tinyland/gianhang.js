/* =====================================================================
   GIAN HÀNG NGƯỜI CHƠI — Tinyland
   Sạp bán trước nhà (bên trái bảng nhiệm vụ). Người chơi treo nông sản /
   sản phẩm từ máy lên server Supabase để người khác mua.
   Cần chạy file gianhang.sql trên Supabase 1 lần (xem hướng dẫn).

   Luật:
   - Treo tối đa 5 đơn cùng lúc, không thu phí. Giá chỉ được giảm, không nâng.
   - Đơn bị trừ khỏi kho lúc đăng; hủy treo thì trả về kho.
   - Có người mua: đơn biến mất, người bán bấm "Nhận xu" (mỗi đơn 1 lần).
   - Quá 6 giờ chưa ai mua: BOT mua với 80% giá, người bán vẫn bấm Nhận xu.
   - Không bán quái vật câu được (chúng nằm ở kho riêng nên không có trong danh sách).
   ===================================================================== */
(function(){
'use strict';
const MAXO=5;
const MK={tab:'my',my:null,list:null,err:'',busy:0,ld:{my:0,other:0},f:{w:'ns',id:'',qty:1,price:0}};
let DOT=0,FAIL=0,LASTSOLD=0;

/* ---------- danh mục món + giá mặc định (lấy từ dữ liệu game) ---------- */
let CAT=null;
const cat=()=>{if(CAT)return CAT;CAT={};
 CROPS.forEach((c,k)=>CAT['ns:c'+k]={w:'ns',id:'c'+k,e:c[1],n:c[0],p:c[4]});
 Object.keys(FRUITS).forEach(k=>CAT['ns:'+k]={w:'ns',id:k,e:FRUITS[k][1],n:FRUITS[k][0],p:FRUITS[k][4]});
 POTS.forEach((c,k)=>CAT['ns:p'+k]={w:'ns',id:'p'+k,e:c[1],n:c[0],p:c[4]});
 VPI.forEach(v=>CAT['vp:'+v[0]]={w:'vp',id:v[0],e:v[1],n:v[2],p:v[3]});
 PRODS.forEach(o=>CAT['vp:'+o.id]={w:'vp',id:o.id,e:o.e,n:o.n,p:o.price});
 return CAT};
const itm=(w,id)=>cat()[w+':'+id]||{w,id,e:'❓',n:String(id),p:0};
const stock=(w,id)=>Math.max(0,((ST[w]||{})[id])|0);
const give=(w,id,n)=>{ST[w]=ST[w]||{};ST[w][id]=(ST[w][id]|0)+n};

/* ---------- gọi server ---------- */
const call=(f,a)=>{if(typeof dhtOk!=='function'||!dhtOk())return Promise.reject('Chưa đăng nhập DHT');return dhtRpc(f,a)};
const errMsg=e=>{const s=String(e&&e.message||e||'');
 if(/Chưa đăng nhập|đăng nhập lại|hết/i.test(s))return '🔒 Cần đăng nhập tài khoản DHT (trên web DHT) để dùng gian hàng.';
 if(/Could not find the function|PGRST202|market_/i.test(s))return '⚙️ Máy chủ chưa có gian hàng. Hãy chạy file gianhang.sql trên Supabase 1 lần.';
 return '📡 Lỗi mạng, bạn thử lại nhé.'};
const left=s=>{s=s|0;const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?h+'g '+m+'p':(m?m+' phút':'dưới 1 phút')};

/* ---------- chấm đỏ trên quầy: có đơn đã bán chưa nhận xu ---------- */
window.mkDot=()=>DOT;
const setDot=n=>{DOT=n>0?1:0};
async function poll(){
 if(document.hidden||FAIL>=3)return;
 try{if(typeof dhtOk!=='function'||!dhtOk())return;
  const r=await call('market_my');
  if(r&&r.ok){FAIL=0;const n=(r.sold||[]).length;setDot(n);
   if(n>LASTSOLD)toast('🏪 Quầy của bạn có '+n+' đơn đã bán!\nRa quầy bấm Nhận xu nhé');
   LASTSOLD=n}
 }catch(e){FAIL++}}
setTimeout(poll,4000);setInterval(poll,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});

/* ---------- giao diện ---------- */
const draw=()=>{if(UI&&$('mkw'))render()};
const loading='<div class="mut" style="text-align:center">⏳ Đang tải...</div>';
function render(){
 const el=$('ui'),y=el?el.scrollTop:0;
 let h=head('🏪 Gian hàng')+'<div id="mkw"><div class="tabs">'+
  [['my','🏪 Quầy của tôi'],['other','🛒 Gian hàng người chơi khác']].map(([k,n])=>'<button class="b'+(k==MK.tab?' on':'')+'" onclick="mkTab(\''+k+'\')">'+n+'</button>').join('')+'</div>';
 h+=MK.err?'<div class="mut">'+MK.err+'</div><button class="b w" onclick="mkRefresh()">🔄 Thử lại</button>':(MK.tab=='my'?viewMy():viewOther());
 openUI(h+'</div>');$('ui').scrollTop=y}

function viewMy(){
 const M=MK.my;if(!M)return loading;
 const S=M.sold||[],O=M.open||[];let h='';
 if(S.length){
  h+='<div class="mut"><b>💰 Đã bán — bấm Nhận xu để xu vào ví</b></div><div class="g1">'+S.map(o=>{const it=itm(o.w,o.item);
   return '<div class="it"><span>'+ic(it.e,it.n)+' <b>'+escH(it.n)+'</b> x'+o.qty+'<br><small>'+(o.bot?'🤖 BOT mua (80% giá)':'🧑 Người chơi mua')+' • '+o.price+' Xu/món</small></span>'+
   '<span style="text-align:right"><b>+'+o.xu+' 🪙</b><br><button class="b x" onclick="mkClaim('+o.id+')">🎁 Nhận xu</button></span></div>'}).join('')+'</div>';
  if(S.length>1)h+='<button class="b w" onclick="mkClaimAll()">🎁 Nhận hết ('+S.length+' đơn • '+S.reduce((a,o)=>a+(o.xu|0),0)+' Xu)</button>'}
 h+='<div class="mut"><b>📌 Đang treo ('+O.length+'/'+MAXO+')</b> • tối đa 6 giờ, quá hạn BOT mua 80% giá</div>';
 if(!O.length)h+='<div class="mut" style="margin:0">Chưa treo món nào.</div>';
 else h+='<div class="g1">'+O.map(o=>{const it=itm(o.w,o.item),d=it.p>o.price?' <small>(giảm '+Math.round((1-o.price/it.p)*100)+'%)</small>':'';
  return '<div class="it"><span>'+ic(it.e,it.n)+' <b>'+escH(it.n)+'</b> x'+o.qty+'<br><small>'+o.price+' Xu/món'+d+' • tổng '+o.qty*o.price+' Xu<br>⏳ còn '+left(o.left)+'</small></span>'+
  '<span style="text-align:right"><button class="b x" onclick="mkCancel('+o.id+')">↩️ Hủy treo</button></span></div>'}).join('')+'</div>';
 return h+form(O.length)}

function form(n){
 if(n>=MAXO)return '<div class="mut">Bạn đã treo đủ '+MAXO+' đơn. Có người mua hoặc hủy treo bớt thì treo thêm được.</div>';
 const F=MK.f,w=F.w;
 let h='<div class="mut" style="margin-top:10px"><b>➕ Treo đồ bán</b> • không thu phí • giá chỉ được giảm, không được nâng</div>'+
  '<div class="tabs">'+[['ns','🧺 Nông sản'],['vp','📦 Sản phẩm / vật phẩm']].map(([k,t])=>'<button class="b'+(k==w?' on':'')+'" onclick="mkW(\''+k+'\')">'+t+'</button>').join('')+'</div>';
 const L=Object.values(cat()).filter(i=>i.w==w&&stock(w,i.id)>0);
 h+=L.length?'<div class="sg kg">'+L.map(i=>'<button class="sq'+(F.id==i.id?' sel':'')+'" onclick="mkPick(\''+i.id+'\')"><span class="e">'+ic(i.e,i.n)+'</span><b>x'+stock(w,i.id)+'</b><small>'+escH(i.n)+'</small></button>').join('')+'</div>'
  :'<div class="mut">Kho mục này đang trống.</div>';
 const cur=F.id?itm(w,F.id):null,st=cur?stock(w,F.id):0;
 if(cur&&st>0&&cur.p>0){
  const q=Math.min(Math.max(1,F.qty|0),Math.min(st,9999)),p=Math.min(Math.max(1,F.price|0||cur.p),cur.p);F.qty=q;F.price=p;
  h+='<div class="it" style="flex-direction:column;gap:7px;margin-top:8px">'+
   '<div>'+ic(cur.e,cur.n)+' <b>'+escH(cur.n)+'</b> — trong kho <b>x'+st+'</b> • giá gốc <b>'+cur.p+' Xu</b>/món</div>'+
   '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">Số lượng <input id="mkq" type="number" inputmode="numeric" min="1" max="'+Math.min(st,9999)+'" value="'+q+'" oninput="mkIn()" style="width:84px"><button class="b x" onclick="mkMax()">Tối đa</button></div>'+
   '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">Giá 1 món <input id="mkp" type="number" inputmode="numeric" min="1" max="'+cur.p+'" value="'+p+'" oninput="mkIn()" style="width:84px"><button class="b x" onclick="mkPr(1)">Giá gốc</button><button class="b x" onclick="mkPr(.9)">−10%</button><button class="b x" onclick="mkPr(.8)">−20%</button></div>'+
   '<div id="mkt" class="mut" style="margin:0"></div>'+
   '<button class="b w" style="margin-top:0" onclick="mkPost()">📤 Đăng bán</button></div>';
  setTimeout(totalLine,0)}
 else if(F.id)F.id='';
 return h}

function viewOther(){
 const L=MK.list;if(!L)return loading;
 let h='<div class="mut">Đơn đang bán của người chơi khác trên server (mới nhất, tối đa 10 đơn).</div><button class="b w" style="margin-top:0" onclick="mkRefresh()">🔄 Làm mới</button>';
 if(!L.length)return h+'<div class="mut" style="text-align:center;margin-top:10px">Hiện chưa có ai đang bán.</div>';
 return h+'<div class="g1" style="margin-top:6px">'+L.map(o=>{const it=itm(o.w,o.item),tot=o.qty*o.price,z=ST.xu<tot?' z':'';
  return '<div class="it"><span>'+ic(it.e,it.n)+' <b>'+escH(it.n)+'</b> x'+o.qty+'<br><small>👤 '+escH(o.name)+' • '+o.price+' Xu/món<br>⏳ còn '+left(o.left)+'</small></span>'+
  '<span style="text-align:right"><b>'+tot+' 🪙</b><br><button class="b x'+z+'" onclick="mkBuy('+o.id+')">🛒 Mua</button></span></div>'}).join('')+'</div>'}

/* ---------- ô nhập số lượng / giá ---------- */
function readForm(){
 const F=MK.f,it=itm(F.w,F.id),st=stock(F.w,F.id),qe=$('mkq'),pe=$('mkp');if(!qe||!pe)return null;
 const q=Math.floor(+qe.value),p=Math.floor(+pe.value);
 return{it,st,q,p,ok:q>=1&&q<=Math.min(st,9999)&&p>=1&&p<=it.p}}
function totalLine(){
 const e=$('mkt'),R=readForm();if(!e||!R)return;
 if(R.ok){MK.f.qty=R.q;MK.f.price=R.p;
  e.innerHTML='Bạn sẽ nhận <b>'+R.q*R.p+' Xu</b> khi có người mua'+(R.p<R.it.p?' (đã giảm '+Math.round((1-R.p/R.it.p)*100)+'%)':'')+'.'}
 else e.innerHTML='⚠️ '+(!(R.p>=1&&R.p<=R.it.p)?'Giá phải từ 1 đến '+R.it.p+' Xu (không được cao hơn giá gốc).':'Số lượng phải từ 1 đến '+Math.min(R.st,9999)+'.')}
window.mkIn=totalLine;
window.mkMax=()=>{const e=$('mkq');if(e){e.value=Math.min(stock(MK.f.w,MK.f.id),9999);totalLine()}};
window.mkPr=f=>{const e=$('mkp'),it=itm(MK.f.w,MK.f.id);if(e){e.value=Math.max(1,Math.floor(it.p*f));totalLine()}};

/* ---------- tải dữ liệu ---------- */
async function fetchMy(){MK.ld.my=1;
 try{const r=await call('market_my');if(r&&r.ok){MK.my=r;MK.err='';FAIL=0;setDot((r.sold||[]).length);LASTSOLD=(r.sold||[]).length}else MK.err=errMsg('')}
 catch(e){MK.err=errMsg(e)}
 MK.ld.my=0;draw()}
async function fetchList(){MK.ld.other=1;
 try{const r=await call('market_list');if(r&&r.ok){MK.list=r.list||[];MK.err=''}else MK.err=errMsg('')}
 catch(e){MK.err=errMsg(e)}
 MK.ld.other=0;draw()}
const reload=()=>MK.tab=='my'?fetchMy():fetchList();

window.mkOpen=function(){
 MK.tab='my';MK.my=null;MK.list=null;MK.err='';MK.busy=0;FAIL=0;
 if(typeof dhtOk!=='function'||!dhtOk()){MK.err=errMsg('Chưa đăng nhập DHT')}
 render();if(!MK.err)fetchMy()};
window.mkTab=t=>{MK.tab=t;MK.err='';
 if(t=='my'){MK.my=null}else{MK.list=null}
 render();reload()};
window.mkRefresh=()=>{MK.err='';if(MK.tab=='my')MK.my=null;else MK.list=null;render();reload()};
window.mkW=w=>{MK.f={w,id:'',qty:1,price:0};render()};
window.mkPick=id=>{const it=itm(MK.f.w,id);MK.f.id=MK.f.id==id?'':id;MK.f.qty=1;MK.f.price=it.p;render()};

/* ---------- hành động ---------- */
const fail=(r,fallback)=>{const e=r&&r.err;
 return e=='limit'?'Bạn đã treo đủ '+MAXO+' đơn!':e=='price'?'Giá không được cao hơn giá gốc'+(r.max?' ('+r.max+' Xu)':'')+'!':e=='qty'?'Số lượng không hợp lệ!':e=='item'?'Món này không bán được trên gian hàng!':
 e=='gone'?fallback:e=='own'?'Đây là đơn của bạn!':e=='auth'?errMsg('Chưa đăng nhập DHT'):fallback||errMsg('')};

window.mkPost=async function(){
 if(MK.busy)return;const R=readForm();if(!R)return;
 if(!R.ok){totalLine();return toast('⚠️ Kiểm tra lại số lượng và giá')}
 const F=MK.f,w=F.w,id=F.id;
 MK.busy=1;ST[w][id]=stock(w,id)-R.q;save();        // trừ kho trước, lỗi thì trả lại
 try{const r=await call('market_post',{p_w:w,p_item:id,p_qty:R.q,p_price:R.p,p_name:ST.name||'Ai đó'});
  if(r&&r.ok){toast('📤 Đã treo '+R.it.e+' '+R.it.n+' x'+R.q+' • '+R.p+' Xu/món');MK.f={w,id:'',qty:1,price:0}}
  else{give(w,id,R.q);toast('❌ '+fail(r,'Không đăng được, thử lại nhé'))}
 }catch(e){give(w,id,R.q);toast('❌ '+errMsg(e))}
 save();MK.busy=0;fetchMy()};

window.mkCancel=async function(id){
 if(MK.busy)return;MK.busy=1;
 try{const r=await call('market_cancel',{p_id:id});
  if(r&&r.ok){give(r.w,r.item,r.qty);save();const it=itm(r.w,r.item);toast('↩️ Đã hủy treo, trả '+it.e+' '+it.n+' x'+r.qty+' về kho')}
  else toast('ℹ️ '+fail(r,'Đơn này đã được mua hoặc hết hạn rồi — xem mục nhận xu nhé'))
 }catch(e){toast('❌ '+errMsg(e))}
 MK.busy=0;fetchMy()};

window.mkClaim=async function(id){
 if(MK.busy)return;MK.busy=1;
 try{const r=await call('market_claim',{p_id:id});
  if(r&&r.ok){ST.xu+=r.xu|0;xuUp();save();toast('💰 Nhận +'+r.xu+' Xu')}
  else toast('ℹ️ Đơn này đã nhận xu rồi')
 }catch(e){toast('❌ '+errMsg(e))}
 MK.busy=0;fetchMy()};

window.mkClaimAll=async function(){
 if(MK.busy)return;MK.busy=1;
 try{const r=await call('market_claim_all');
  if(r&&r.ok&&r.n>0){ST.xu+=r.xu|0;xuUp();save();toast('💰 Nhận +'+r.xu+' Xu từ '+r.n+' đơn')}
  else toast('ℹ️ Không có đơn nào để nhận')
 }catch(e){toast('❌ '+errMsg(e))}
 MK.busy=0;fetchMy()};

window.mkBuy=async function(id){
 if(MK.busy)return;const o=(MK.list||[]).find(x=>x.id==id);if(!o)return;
 const tot=o.qty*o.price;
 if(ST.xu<tot)return toast('🪙 Không đủ Xu! Cần '+tot+' Xu');
 MK.busy=1;ST.xu-=tot;xuUp();save();                  // trừ xu trước, đơn đã bị người khác mua thì hoàn lại
 try{const r=await call('market_buy',{p_id:id});
  if(r&&r.ok){give(r.w,r.item,r.qty);save();const it=itm(r.w,r.item);toast('🛒 Đã mua '+it.e+' '+it.n+' x'+r.qty+' (−'+tot+' Xu)')}
  else{ST.xu+=tot;xuUp();save();toast('😅 '+fail(r,'Đơn này vừa có người khác mua hoặc đã hết hạn!'))}
 }catch(e){ST.xu+=tot;xuUp();save();toast('❌ '+errMsg(e))}
 MK.busy=0;fetchList()};
})();
