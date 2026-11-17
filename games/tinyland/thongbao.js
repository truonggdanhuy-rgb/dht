/* ===================================================================================
   THONGBAO.JS — 🔔 BẢNG THÔNG BÁO do ADMIN đăng (cả server đều thấy)
   • Bảng dữ liệu + hàm trên Supabase: xem file thongbao.sql (chạy 1 lần trong SQL Editor).
   • Ai là admin: tên đăng nhập nằm trong bảng dht_admins (mặc định huyhuy003333). Quyền kiểm tra ở SERVER.
   • Mỗi bài = 1 ảnh ngang (CHUẨN 1280 × 720 px, tỉ lệ 16:9) + tiêu đề (≤80 ký tự) + nội dung (≤1500 ký tự).
       Ảnh khác tỉ lệ sẽ được tự cắt giữa cho vừa 16:9, rồi nén JPG. Đăng xong KHÔNG sửa được, chỉ XÓA được.
   • Chỉ giữ 20 bài mới nhất (bài thứ 21 đăng lên thì bài cũ nhất tự mất — server tự làm, xem hướng dẫn sửa ann_post từ 10 → 20).
   • Danh sách xếp 2 ảnh / hàng. Bấm 1 ảnh → hiện ảnh TO toàn màn hình (bấm ảnh để phóng to thêm, bấm nền / ✕ để đóng).
   • Người chơi đang online: cứ ~60 giây game tự kiểm tra; có bài mới → nút 🔔 T.Báo hiện chấm đỏ + báo "🔔 Thông báo mới".
   • Người chơi: bấm 🔔 → thấy danh sách → bấm 1 bài để đọc. Admin thấy thêm nút ✍️ Đăng bài mới và 🗑️ Xóa bài.
   =================================================================================== */
(function(){
'use strict';
const IMG_W=1280,IMG_H=720,MAX_IMG=780000,POLL_MS=60000;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const can=()=>{try{return window.parent!==window&&!!parent.DHT&&!!parent.DHT.SB_URL}catch(e){return false}};
const logged=()=>{try{return can()&&!!localStorage.user}catch(e){return false}};
async function GET(q){const r=await fetch(parent.DHT.SB_URL+'/rest/v1/'+q,{headers:{apikey:parent.DHT.SB_KEY}});if(!r.ok)throw 'http '+r.status;return r.json()}
const RPC=(f,a)=>parent.DHT.rpc(f,a);
const getSeen=()=>{try{return +localStorage.ann_seen||0}catch(e){return 0}};
const setSeen=n=>{try{localStorage.ann_seen=String(n)}catch(e){}};
const fdate=s=>{try{const d=new Date(s);return d.toLocaleDateString('vi-VN')+' '+d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}catch(e){return''}};

let LIST=null,ISADM=null,DET={},DRAFT={t:'',b:'',img:'',note:''},BUSY=0,LASTTOAST=0,MAXID=0;

/* ---------- chấm đỏ trên nút 🔔 ---------- */
(function(){const st=document.createElement('style');
 st.textContent='#htb{position:relative}#htb.nw::after{content:"";position:absolute;top:-4px;right:-4px;width:12px;height:12px;border-radius:50%;background:#ff3b3b;border:2px solid #fff;box-shadow:0 0 0 2px #ff3b3b66;animation:tbpulse 1.2s infinite}'+
 '@keyframes tbpulse{50%{transform:scale(1.25)}}'+
 '.tbgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:8px 0}.tbi{position:relative;display:block;width:100%;padding:0;margin:0;border:0;background:none;cursor:pointer}'+
 '#tbv{position:fixed;inset:0;z-index:99999;background:rgba(8,12,24,.94);display:flex;flex-direction:column}#tbv .tbvbar{display:flex;gap:8px;justify-content:space-between;align-items:center;padding:8px 10px;flex:none}#tbv .tbvbar button{font:inherit;font-weight:800;font-size:14px;border:2px solid #7da3cc;background:#d6e8fa;color:#3d5a80;border-radius:10px;padding:8px 14px;cursor:pointer}#tbv .tbvbar .del{background:#ffd9d9;border-color:#c96a6a;color:#7a2020}#tbv .tbvbox{flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;-webkit-overflow-scrolling:touch}#tbv .tbvbox img{max-width:100%;max-height:100%;object-fit:contain;cursor:zoom-in;display:block}#tbv .tbvbox.zm{align-items:flex-start;justify-content:flex-start}#tbv .tbvbox.zm img{max-width:none;max-height:none;width:250%;cursor:zoom-out}#tbv .tbvhint{color:#cfe0f5;font-size:11px;text-align:center;padding:4px 0 8px;flex:none}.tbi:active{transform:translateY(1px)}'+
 '.tbi .ic{font-size:26px;width:40px;height:40px;border-radius:50%;background:#dff0ff;border:2px solid #b5d2f0;display:flex;align-items:center;justify-content:center;flex:none}'+
 '.tbi b{display:block;font-size:14px}.tbi small{color:#6a86ad;font-size:11px}.tbi .nw{position:absolute;top:8px;right:8px;background:#ff3b3b;color:#fff;border-radius:8px;font-size:11px;font-weight:800;padding:2px 8px;box-shadow:0 1px 4px #0004}'+
 '.tbimg{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;border:2px solid #9fc4e8;display:block;background:#dfeaf7}'+
 '.tbfm label{display:block;font-weight:800;font-size:12px;margin:8px 0 3px}.tbfm input[type=text],.tbfm textarea{width:100%;box-sizing:border-box;font:inherit;font-size:14px;border:2px solid #9fc4e8;border-radius:8px;padding:6px 8px;background:#fff;color:#2c3e5c}'+
 '.tbfm textarea{min-height:90px;resize:vertical}.tbbtn{display:block;width:100%;margin:6px 0}';
 document.head.appendChild(st)})();
const badge=on=>{const b=document.getElementById('htb');if(b)b.classList.toggle('nw',!!on)};

/* ---------- tải dữ liệu ---------- */
async function loadList(){
 try{LIST=await GET('announcements?select=id,img,created_at&order=id.desc&limit=20')}catch(e){LIST=[]}
 MAXID=LIST.length?LIST[0].id:0;
 // dọn cache ảnh của bài đã bị xóa
 const ids=new Set(LIST.map(x=>x.id));for(const k in DET)if(!ids.has(+k))delete DET[k];LIST.forEach(x=>{DET[x.id]=x});
 return LIST}
async function loadAdmin(){
 if(!logged()){ISADM=false;return false}
 try{ISADM=(await RPC('ann_is_admin',{}))===true}catch(e){ISADM=false}
 return ISADM}
async function loadDetail(id){
 if(DET[id])return DET[id];
 const r=await GET('announcements?id=eq.'+(+id)+'&select=*');if(!r.length)throw 'gone';DET[id]=r[0];return r[0]}

/* ---------- 1) DANH SÁCH ---------- */
window.tbaoUI=async function(){
 if(!can()){openUI(head('🔔 Bảng Thông Báo')+'<div class="sbnote" style="padding:26px 6px;font-size:13px">📭 Chưa có thông báo nào.<br><small>Tin mới sẽ hiện ở đây nha~</small></div><div class="pf"><button class="b x" onclick="closeUI()">Đóng</button></div>');$('ui').classList.add('wui');return}
 openUI(head('🔔 Bảng Thông Báo')+'<div class="sbnote" style="padding:26px 6px;font-size:13px">⏳ Đang tải thông báo…</div>');$('ui').classList.add('wui');
 await Promise.all([loadList(),ISADM==null?loadAdmin():0]);
 if(!UI||!$('ui').classList.contains('wui'))return;           // người chơi đã đóng bảng trong lúc tải
 tbaoShowList()};
function tbaoShowList(){
 const seen=getSeen();
 let h=head('🔔 Bảng Thông Báo');
 if(ISADM)h+='<button class="b tbbtn" onclick="tbaoNew()" style="font-weight:800;background:#d6f2dc;border-color:#6bb27a;color:#2f6a3c">✍️ Đăng bài mới</button>';
 if(!LIST.length)h+='<div class="sbnote" style="padding:26px 6px;font-size:13px">📭 Chưa có thông báo nào.<br><small>Tin mới sẽ hiện ở đây nha~</small></div>';
 else h+='<div class="tbgrid">'+LIST.map(n=>'<button class="tbi" onclick="tbaoRead('+n.id+')"><img class="tbimg" src="'+esc(n.img)+'" alt="">'+(n.id>seen?'<span class="nw">MỚI</span>':'')+'</button>').join('')+'</div>';
 openUI(h+'<div class="pf"><button class="b x" onclick="closeUI()">Đóng</button></div>');$('ui').classList.add('wui');
 if(MAXID>seen){setSeen(MAXID)}badge(false)}

/* ---------- 2) ĐỌC 1 BÀI ---------- */
window.tbaoRead=async function(id){
 tbaoCloseView();
 let n;try{n=await loadDetail(id)}catch(e){toast('📭 Bài này không còn nữa');await loadList();return tbaoShowList()}
 if(!UI)return;
 const v=document.createElement('div');v.id='tbv';
 v.innerHTML='<div class="tbvbar"><button onclick="tbaoCloseView()">✕ Đóng</button>'+(ISADM?'<button class="del" onclick="tbaoAskDel('+(+n.id)+')">🗑️ Xóa bài</button>':'')+'</div>'+
  '<div class="tbvbox" id="tbvbox"><img src="'+esc(n.img)+'" alt="" onclick="document.getElementById(\'tbvbox\').classList.toggle(\'zm\')"></div>'+
  '<div class="tbvhint">Bấm vào ảnh để phóng to / thu nhỏ</div>';
 v.addEventListener('click',e=>{if(e.target===v)tbaoCloseView()});
 document.body.appendChild(v)};
window.tbaoCloseView=function(){const v=document.getElementById('tbv');if(v)v.remove()};
window.tbaoBack=async function(){if(!LIST)await loadList();tbaoShowList()};

/* ---------- 3) XÓA BÀI (có xác nhận) ---------- */
window.tbaoAskDel=function(id){
 const n=DET[id];if(!n)return;tbaoCloseView();
 openUI(head('🗑️ Xóa bài')+'<div style="text-align:center;padding:10px 4px"><div style="font-size:40px">🗑️</div>'+
  '<div style="font-size:15px;margin:8px 0">Xóa bài này?</div>'+
  '<div class="mut" style="font-size:12px">Bài sẽ biến mất với <b>tất cả người chơi</b> và không khôi phục được.</div></div>'+
  '<div style="display:flex;gap:6px"><button class="b x" style="flex:1" onclick="tbaoRead('+(+id)+')">Giữ lại</button><button class="b" style="flex:1;background:#ffc9c9;border-color:#c96a6a;color:#7a2020" onclick="tbaoDoDel('+(+id)+')">🗑️ Xác nhận xóa</button></div>');
 $('ui').classList.add('wui')};
window.tbaoDoDel=async function(id){
 if(BUSY)return;BUSY=1;
 try{await RPC('ann_delete',{p_id:+id});delete DET[id];toast('🗑️ Đã xóa bài')}catch(e){toast('❌ Chưa xóa được (cần quyền admin / kiểm tra mạng)')}
 BUSY=0;await loadList();tbaoShowList()};

/* ---------- 4) ĐĂNG BÀI MỚI (admin) ---------- */
function fitImage(file){return new Promise((res,rej)=>{
 if(!file||!/^image\//.test(file.type))return rej('Hãy chọn một file ảnh (JPG / PNG / WebP)');
 const fr=new FileReader();fr.onerror=()=>rej('Không đọc được file');
 fr.onload=()=>{const im=new Image();im.onerror=()=>rej('File ảnh bị lỗi');
  im.onload=()=>{
   const c=document.createElement('canvas');c.width=IMG_W;c.height=IMG_H;const g=c.getContext('2d');
   const s=Math.max(IMG_W/im.width,IMG_H/im.height),w=im.width*s,h=im.height*s;
   g.imageSmoothingQuality='high';g.fillStyle='#ffffff';g.fillRect(0,0,IMG_W,IMG_H);g.drawImage(im,(IMG_W-w)/2,(IMG_H-h)/2,w,h);
   let q=.88,d;for(;;){d=c.toDataURL('image/jpeg',q);if(d.length<=MAX_IMG||q<=.4)break;q-=.08}
   if(d.length>MAX_IMG)return rej('Ảnh quá nặng, hãy dùng ảnh đơn giản hơn');
   const ratio=im.width/im.height,notes=[];
   if(im.width<IMG_W||im.height<IMG_H)notes.push('ảnh gốc '+im.width+'×'+im.height+' nhỏ hơn chuẩn nên sẽ hơi mờ');
   if(Math.abs(ratio-16/9)>.04)notes.push('tỉ lệ khác 16:9 nên bị cắt giữa');
   res({d,note:notes.length?'⚠️ '+notes.join('; '):'✓ Đúng chuẩn '+IMG_W+'×'+IMG_H})};
  im.src=fr.result};
 fr.readAsDataURL(file)})}

window.tbaoNew=function(){
 const D=DRAFT;
 openUI(head('✍️ Đăng bài mới')+'<div class="tbfm">'+
  '<div class="mut" style="font-size:12px">Mỗi bài chỉ gồm <b>1 ảnh ngang '+IMG_W+' × '+IMG_H+' px</b> (16:9) — hãy vẽ sẵn chữ vào ảnh. Đăng xong <b>không sửa được</b>, chỉ xóa được.</div>'+
  '<label>Ảnh bài đăng *</label><input type="file" id="tbf" accept="image/*" onchange="tbaoPick(this)">'+
  '<div id="tbpv" style="margin-top:6px">'+(D.img?'<img class="tbimg" src="'+D.img+'"><div class="mut" style="font-size:11px;margin-top:2px">'+esc(D.note)+'</div>':'')+'</div>'+
  '</div>'+
  '<div class="pf"><button class="b x" onclick="tbaoBack()">← Hủy</button><button class="b" onclick="tbaoPreview()" style="font-weight:800;background:#d6f2dc;border-color:#6bb27a;color:#2f6a3c">Xem lại & đăng</button></div>');
 $('ui').classList.add('wui')};
window.tbaoDraft=function(){};
window.tbaoPick=async function(inp){
 const f=inp.files&&inp.files[0];if(!f)return;
 const pv=$('tbpv');if(pv)pv.innerHTML='<span class="mut">⏳ Đang xử lý ảnh…</span>';
 try{const r=await fitImage(f);DRAFT.img=r.d;DRAFT.note=r.note}catch(e){DRAFT.img='';DRAFT.note='';toast('❌ '+e)}
 tbaoDraft();const pv2=$('tbpv');
 if(pv2)pv2.innerHTML=DRAFT.img?'<img class="tbimg" src="'+DRAFT.img+'"><div class="mut" style="font-size:11px;margin-top:2px">'+esc(DRAFT.note)+'</div>':''};
window.tbaoPreview=function(){
 tbaoDraft();const D=DRAFT;
 if(!D.img)return toast('📷 Bài đăng cần có 1 tấm ảnh ngang');
 openUI(head('📣 Xác nhận đăng')+'<div class="mut" style="font-size:12px;margin-bottom:6px">Bài sẽ hiện với <b>tất cả người chơi</b>. Đăng xong <b>không sửa được</b> (chỉ xóa được).</div>'+
  '<img class="tbimg" src="'+D.img+'">'+
  '<div class="pf"><button class="b x" onclick="tbaoNew()">← Sửa lại</button><button class="b" onclick="tbaoDoPost()" style="font-weight:800;background:#d6f2dc;border-color:#6bb27a;color:#2f6a3c">📣 Đăng bài</button></div>');
 $('ui').classList.add('wui')};
window.tbaoDoPost=async function(){
 if(BUSY)return;BUSY=1;const D=DRAFT;
 try{await RPC('ann_post',{p_title:'Thông báo',p_body:'',p_img:D.img});DRAFT={t:'',b:'',img:'',note:''};toast('📣 Đã đăng bài lên Bảng Thông Báo!')}
 catch(e){BUSY=0;const m=String(e&&e.message||e);toast(/not_admin/.test(m)?'⛔ Tài khoản này không có quyền đăng bài':'❌ Chưa đăng được: '+m.slice(0,80));return tbaoPreview()}
 BUSY=0;DET={};await loadList();setSeen(MAXID);badge(false);tbaoShowList()};

/* ---------- 5) TỰ ĐỘNG BÁO BÀI MỚI cho người đang online ---------- */
async function poll(){
 if(!can()||document.hidden)return;
 try{const r=await GET('announcements?select=id&order=id.desc&limit=1');
  if(!r.length)return;const L=r[0];MAXID=Math.max(MAXID,L.id);
  if(L.id>getSeen()){badge(true);if(LASTTOAST!=L.id){LASTTOAST=L.id;try{toast('🔔 Có thông báo mới!')}catch(e){}}}
  else badge(false);
  // bảng đang mở ở màn danh sách → làm mới luôn
  if(UI&&LIST&&$('ui').classList.contains('wui')&&document.querySelector('#ui .tbi')&&(!LIST.length||LIST[0].id!==L.id)){await loadList();tbaoShowList()}
 }catch(e){}}
setInterval(poll,POLL_MS);setTimeout(poll,4000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});
})();
