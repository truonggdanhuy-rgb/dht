// ===== Căn cước Tinyland (thẻ thông tin cá nhân) =====
(function(){
// ---- dữ liệu thẻ (lưu chung trong ST nên tự đồng bộ theo tài khoản) ----
const todayS=(d=new Date())=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
if(!ST.id||typeof ST.id!='object')ST.id={};
const ID=ST.id;
if(!ID.fr&&ID.fr!==0)ID.fr=-1;                       // khung đang dùng (-1: không khung)
if(!Array.isArray(ID.own))ID.own=[0,1];              // 2 khung đầu miễn phí
[0,1].forEach(k=>{if(!ID.own.includes(k))ID.own.push(k)});
if(typeof ID.bio!='string')ID.bio='';
if(!ID.born)ID.born=Date.now();
if(typeof ID.earn!='number')ID.earn=Math.max(0,Math.floor(ST.xu||0)); // tính từ lượng xu hiện có
// tổng xu kiếm được: mọi lần ST.xu tăng đều cộng dồn (trừ xu nhập code)
let _xu=+ST.xu||0;window.IDNOEARN=0;
Object.defineProperty(ST,'xu',{enumerable:true,configurable:true,get(){return _xu},set(v){v=+v;if(!isFinite(v))return;if(v>_xu&&!window.IDNOEARN)ID.earn+=v-_xu;_xu=v}});
// chuỗi đăng nhập
(function(){const t=todayS(),y=todayS(new Date(Date.now()-864e5));if(!ID.ls)ID.ls={d:t,n:1};else if(ID.ls.d!=t){ID.ls.n=ID.ls.d==y?ID.ls.n+1:1;ID.ls.d=t}})();
try{save()}catch(e){}
const PRICE=300,FR_FREE=2;

// ---- giao diện ----
const css=document.createElement('style');css.textContent=`
#ui.idc{background:#eaf6fd;border-color:#7fb8d8;box-shadow:0 3px 0 #4a86a8;color:#2c4a5e}
#ui.idc .b{background:#bfe3f5;border-color:#6aa6c9;box-shadow:0 2px 0 #4a86a8;color:#24475c}
#ui.idc .b.on,#ui.idc .b.go{background:#8fd0ee}
#ui.idc .b.buy{background:#ffe9a8;border-color:#d9a000;box-shadow:0 2px 0 #a67c00}
#ui.idc .mut{color:#5b7f95}
.idtop{display:flex;gap:10px;align-items:flex-start;background:linear-gradient(160deg,#f6fcff,#d9eefb);border:2px solid #b5dbef;border-radius:14px;padding:10px;position:relative}
.idl{display:flex;flex-direction:column;align-items:center;gap:6px;flex:none}
.idavw{cursor:pointer;position:relative}
.idavw:active{transform:scale(.98)}
.idav{position:relative;flex:none}
.idph{position:absolute;inset:0;background-size:cover;background-position:center;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;overflow:hidden}
.idph canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
.idav.nf .idph{border-radius:16px;border:3px solid #8cc4e2;box-sizing:border-box;-webkit-mask:none;mask:none;background-color:#cfe9f7}
.idfr{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block}
.idst{width:46px;height:46px;border-radius:50%;background:#fff;border:2px dashed #9ccbe4;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:18px;line-height:1;color:#7aa6bf;opacity:.85}
.idst small{font-size:8px;margin-top:1px;font-weight:800}
.idr{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}
.idnm{font-size:19px;font-weight:800;line-height:1.15;word-break:break-word;color:#1f4a66}
.idsub{font-size:11px;color:#5b7f95}
.idline{background:#fff;border:2px solid #cfe8f5;border-radius:10px;padding:4px 8px;font-size:12px;display:flex;justify-content:space-between;gap:6px;align-items:center}
.idline b{font-size:12.5px;color:#1f4a66}
.idlv{background:#fff;border:2px solid #cfe8f5;border-radius:10px;padding:4px 8px;font-size:12px}
.idlv .t{display:flex;justify-content:space-between;margin-bottom:3px}
.idbar{height:7px;background:#d6ebf6;border-radius:6px;overflow:hidden}.idbar i{display:block;height:100%;background:linear-gradient(90deg,#6cc7ee,#7fe0c3)}
.idmenu{display:none;gap:5px;margin:8px 0 0}
.idmenu.on{display:flex}.idmenu .b{flex:1;padding:7px 2px;font-size:11.5px;border-radius:10px}
.idbox{background:#fff;border:2px solid #cfe8f5;border-radius:14px;padding:8px 10px;margin-top:8px}
.idbox h4{margin:0 0 5px;font-size:13px;color:#1f4a66}
.idbox textarea{width:100%;box-sizing:border-box;min-height:74px;resize:none;font:inherit;font-weight:700;color:#24475c;background:#f4fbff;border:2px solid #cfe8f5;border-radius:10px;padding:6px 8px;outline:none;touch-action:auto}
.idbox textarea:focus{border-color:#6aa6c9}
.idcnt{text-align:right;font-size:11px;color:#5b7f95}
.idg3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.idsq{background:#fff;border:2px solid #cfe8f5;border-radius:12px;padding:6px 3px;text-align:center;display:flex;flex-direction:column;gap:1px;align-items:center;justify-content:center;min-height:62px}
.idsq .e{font-size:20px;line-height:1.1}.idsq b{font-size:14px;color:#1f4a66}.idsq small{font-size:10px;color:#5b7f95;line-height:1.2}
.idsoon{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
.idsoon div{background:repeating-linear-gradient(135deg,#f4fbff,#f4fbff 8px,#e6f4fc 8px,#e6f4fc 16px);border:2px dashed #b5dbef;border-radius:12px;padding:8px 6px;text-align:center;font-size:12px;color:#4a7390}
.idsoon small{display:block;font-size:10px;margin-top:2px;color:#7aa6bf}
.idfl{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
.idft{background:#fff;border:2px solid #cfe8f5;border-radius:12px;padding:4px 2px 5px;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;font:inherit;color:#24475c;min-width:0}
.idft.sel{border-color:#4aa3d4;background:#e3f4fd;box-shadow:0 0 0 2px #9fd5ee}
.idft.eq{border-color:#5cc08f}
.idft b{font-size:10.5px;line-height:1.15}.idft small{font-size:9.5px;color:#5b7f95;line-height:1.1}
.idpv{display:flex;flex-direction:column;align-items:center;gap:4px;background:linear-gradient(160deg,#f6fcff,#d9eefb);border:2px solid #b5dbef;border-radius:14px;padding:10px}
@media(max-width:380px){.idfl{grid-template-columns:repeat(3,1fr)}}
`;document.head.appendChild(css);

const _open=openUI;
openUI=function(h){$('ui').classList.remove('idc');return _open(h)};
const openIdc=h=>{_open(h);$('ui').classList.add('idc');$('ui').scrollTop=0};
const fmtD=t=>{const d=new Date(t);return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()};
const accName=()=>{try{return localStorage.user||ST.name||'Khách'}catch(e){return ST.name||'Khách'}};

// avatar có khung: ảnh nằm dưới khung, chỉ lộ ra ở phần lỗ trống của khung
function avHtml(fr,w){
 const f=FRAMES[fr],h=Math.round(w*1.25);
 const ph=ID.img?'background-image:url('+ID.img+')':'';
 const body='<div class="idph"'+(f?' style="'+ph+';-webkit-mask-image:url('+f.m+');mask-image:url('+f.m+')"':' style="'+ph+'"')+'>'+(ID.img?'':'<canvas class="idface" width="64" height="80"></canvas>')+'</div>';
 return '<div class="idav'+(f?'':' nf')+'" style="width:'+w+'px;height:'+h+'px">'+body+(f?'<img class="idfr" alt="" src="'+f.f+'">':'')+'</div>'}
// mặt nhân vật mặc định (khi chưa tải ảnh)
function paintFaces(){
 document.querySelectorAll('canvas.idface').forEach(c=>{
  try{const g=c.getContext('2d'),A=ST.av||{},o={d:0,a:0,mv:0,sit:0,hair:A.h|0,set:A.s|0,e:A.e|0};
   const gr=g.createLinearGradient(0,0,0,80);gr.addColorStop(0,'#d6f0fb');gr.addColorStop(1,'#bfe3f5');g.fillStyle=gr;g.fillRect(0,0,64,80);
   const t=document.createElement('canvas');t.width=40;t.height=48;const tg=t.getContext('2d');drawAv(tg,10,2,o);
   g.imageSmoothingEnabled=false;g.drawImage(t,5,1,30,37.5,0,0,64,80)}catch(e){}})}

let IDV='main',FSEL=0;
window.idUI=function(){IDV='main';idRender();idBorn()};
function idRender(){IDV=='frames'?framesView():mainView();paintFaces()}
function mainView(){
 const n=ID.ls.n,mx=ST.lv>=100,need=mx?1:lvNeed(ST.lv),pc=mx?100:Math.min(100,ST.exp/need*100);
 const h='<div class="uh"><span>🪪 Căn cước Tinyland</span><button class="b x" onclick="closeUI()">X</button></div>'+
 '<div class="idtop"><div class="idl"><div class="idavw" onclick="idMenu()" title="Bấm để chỉnh avatar">'+avHtml(ID.fr,132)+'</div><div class="idst" title="Sticker (sắp có)">🏅<small>Sticker</small></div></div>'+
 '<div class="idr"><div class="idnm">'+escH(accName())+'</div><div class="idsub">🎭 '+escH(ST.name||'')+'</div>'+
 '<div class="idline"><span>🎂 Ngày ra đời</span><b id="idborn">'+fmtD(ID.born)+'</b></div>'+
 '<div class="idlv"><div class="t"><span>⭐ Level</span><b>'+ST.lv+(mx?' MAX':'')+'</b></div><div class="idbar"><i style="width:'+pc+'%"></i></div></div>'+
 '<div class="mut" style="margin:0;font-size:10.5px">👆 Bấm vào avatar để đổi khung</div></div></div>'+
 '<div class="idmenu" id="idmenu"><button class="b" onclick="idPick()">📷 Đổi ảnh</button><button class="b" onclick="idFrames()">🖼️ Đổi khung</button><button class="b" onclick="toast(\'🏅 Sticker sắp ra mắt, chờ chút nha!\')">🏅 Đổi sticker</button></div>'+
 (ID.img?'<div style="text-align:right;margin-top:4px"><button class="b x" style="font-size:10.5px" onclick="idDelImg()">🗑 Dùng lại mặt nhân vật</button></div>':'')+
 '<input id="idfile" type="file" accept="image/*" style="display:none" onchange="idFile(this)">'+
 '<div class="idbox"><h4>📝 Thông tin</h4><textarea id="idbio" maxlength="200" placeholder="Viết vài dòng giới thiệu bản thân nhé (tối đa 200 chữ)..." oninput="idBio(this)" onchange="save()" onblur="save()">'+escH(ID.bio)+'</textarea><div class="idcnt"><span id="idcn">'+ID.bio.length+'</span>/200</div></div>'+
 '<div class="idg3"><div class="idsq"><span class="e">🪙</span><b>'+fmtXu(ID.earn)+'</b><small>Tổng xu đã kiếm</small></div>'+
 '<div class="idsq"><span class="e">'+(n>10?'🔥':'📅')+'</span><b>'+n+' ngày</b><small>Chuỗi đăng nhập'+(n>10?' 🔥':'')+'</small></div>'+
 '<div class="idsq"><span class="e">🖼️</span><b>'+(ID.fr>=0?FRAMES[ID.fr].n:'Chưa có')+'</b><small>Khung đang dùng</small></div></div>'+
 '<div class="idsoon"><div>👫 Bạn thân<small>Coming soon</small></div><div>🌳 Cây gia đình<small>Coming soon</small></div></div>';
 openIdc(h)}
window.idMenu=()=>{const m=$('idmenu');if(m)m.classList.toggle('on')};
window.idPick=()=>{const f=$('idfile');if(f)f.click()};
window.idBio=el=>{if(el.value.length>200)el.value=el.value.slice(0,200);ID.bio=el.value;const c=$('idcn');if(c)c.textContent=el.value.length};
window.idDelImg=()=>{ID.img='';save();idRender();toast('Đã dùng lại mặt nhân vật')};
window.idFile=inp=>{const f=inp.files&&inp.files[0];if(!f)return;
 const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{
  const W=240,H=300,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  const s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;g.drawImage(im,(W-w)/2,(H-h)/2,w,h);
  ID.img=c.toDataURL('image/jpeg',.82);save();idRender();toast('📷 Đã đổi ảnh avatar!')};
  im.onerror=()=>toast('Ảnh không đọc được, thử ảnh khác nhé');im.src=rd.result};
 rd.onerror=()=>toast('Không đọc được ảnh');rd.readAsDataURL(f)};

// ---- đổi khung ----
window.idFrames=()=>{IDV='frames';FSEL=ID.fr>=0?ID.fr:0;idRender()};
window.idBack=()=>{IDV='main';idRender()};
window.idSel=i=>{FSEL=i;idRender()};
window.idEquip=i=>{ID.fr=i;save();idRender();toast('🖼️ Đã dùng khung '+FRAMES[i].n)};
window.idNone=()=>{ID.fr=-1;save();idRender();toast('Đã gỡ khung')};
window.idBuy=i=>{if(ID.own.includes(i))return;if(ST.xu<PRICE)return toast('Không đủ Xu! Cần '+PRICE+' Xu');
 ST.xu-=PRICE;ID.own.push(i);ID.fr=i;xuUp();save();idRender();toast('🎉 Đã mua khung '+FRAMES[i].n+' (−'+PRICE+' Xu)')};
function framesView(){
 const own=i=>ID.own.includes(i),f=FRAMES[FSEL];
 let act;
 if(ID.fr==FSEL)act='<button class="b w" onclick="idNone()">✅ Đang dùng • Bấm để gỡ khung</button>';
 else if(own(FSEL))act='<button class="b w go" onclick="idEquip('+FSEL+')">✨ Dùng khung này</button>';
 else act='<button class="b w buy'+(ST.xu<PRICE?' z':'')+'" onclick="idBuy('+FSEL+')">🪙 Mua khung • '+PRICE+' Xu</button>';
 let h='<div class="uh"><span><button class="b x" onclick="idBack()">‹ Thẻ</button> 🖼️ Đổi khung</span><button class="b x" onclick="closeUI()">X</button></div>'+
 '<div class="idpv">'+avHtml(FSEL,150)+'<div style="font-weight:800;font-size:15px;color:#1f4a66">'+f.n+'</div><div class="mut" style="margin:0">'+(FSEL<FR_FREE?'Khung miễn phí':PRICE+' Xu/khung')+' • Bạn có 🪙 '+fmtXu(ST.xu)+'</div></div>'+act+
 '<div class="idfl">';
 FRAMES.forEach((x,i)=>{h+='<button class="idft'+(i==FSEL?' sel':'')+(i==ID.fr?' eq':'')+'" onclick="idSel('+i+')">'+avHtml(i,70)+'<b>'+x.n+'</b><small>'+(i==ID.fr?'✅ Đang dùng':own(i)?'Đã có':i<FR_FREE?'Miễn phí':'🪙 '+PRICE)+'</small></button>'});
 openIdc(h+'</div><div class="mut">Khung chỉ hiện trong Căn cước, không đổi avatar ngoài màn hình chính.</div>')}

// ---- ngày ra đời = ngày tạo tài khoản DHT (lấy từ máy chủ, nếu có) ----
async function idBorn(){
 if(ID.bs)return;
 try{const D=parent.DHT;if(!D||!D.SB_URL)return;const t=await D.tok();if(!t)return;
  const r=await fetch(D.SB_URL+'/auth/v1/user',{headers:{apikey:D.SB_KEY,Authorization:'Bearer '+t}});if(!r.ok)return;
  const j=await r.json();const ts=Date.parse(j.created_at);if(!ts)return;
  ID.born=ts;ID.bs=1;save();const e=$('idborn');if(e)e.textContent=fmtD(ts)}catch(e){}}
})();
