/* =====================================================================
   FARM-UI.JS — 🛒 Shop nông trại + 📦 Thùng nông trại (giao diện mới, màu SÁNG hơn)
   File riêng, ghi đè fmShop / fmAsk / fmBuy / fmBox / fmUse của index.html (không sửa logic game).
   • SHOP: bấm 1 món → trang mua GIỮ NGUYÊN sau mỗi lần mua (bấm "Mua" liên tục để mua nhiều cái),
           chỉ thoát khi bấm "Quay lại". Hiện số đang có trong thùng + số vừa mua.
   • THÙNG: bỏ tab "Vật tư" — vật tư (ô ruộng, chậu, máy, tổ ong, cây...) nằm CHUNG 1 danh sách với đồ trang trí.
   • 3 nút chế độ to, khác màu, dính trên đầu (cuộn không mất):  🟢 Đặt ra • 🟠 Bán lại • 🔵 Di chuyển / Cất
     Chế độ Bán: ô đồ hiện giá +Xu, có banner cam + nút ↩ Hoàn tác.
   Muốn quay về giao diện cũ: xóa dòng <script src="farm-ui.js"> trong index.html.
   ===================================================================== */
(function(){
if(typeof fmShop!=='function'||typeof fmBox!=='function'||window.__farmx)return;window.__farmx=1;
const $$=id=>document.getElementById(id);

const css=document.createElement('style');
css.textContent=`
#ui.fx{background:#fffbef;border-color:#dcb67f;box-shadow:0 3px 0 #b68e57;max-height:90vh;max-height:90dvh;width:min(96vw,460px)}
#ui.fx .mut{color:#8a5a2e}
#ui.fx .b{background:#ffe3a3;border-color:#b98a4e;box-shadow:0 2px 0 #b98a4e}
#ui.fx .b.x{background:#ffd0c8;border-color:#c9786a;box-shadow:0 2px 0 #c9786a}
.fx-sticky{position:sticky;top:-10px;z-index:3;background:#fffbef;margin:-10px -10px 8px;padding:10px 10px 8px;border-bottom:2px solid #f3e2b8}
#ui.fx .uh{margin-bottom:6px}
.fx-modes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.fx-m{font:inherit;font-weight:800;font-size:13px;line-height:1.15;padding:8px 3px 7px;border:2px solid;border-radius:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;color:#33200f;min-width:0}
.fx-m span{font-size:19px;line-height:1}.fx-m small{font-weight:700;font-size:10px;opacity:.8}
.fx-m:active{transform:translateY(2px)}
.fx-m.place{background:#e9f9e4;border-color:#8fd08a;box-shadow:0 3px 0 #8fd08a}
.fx-m.place.on{background:#86e07f;border-color:#3fa43a;box-shadow:0 3px 0 #3fa43a;color:#10360e}
.fx-m.sell{background:#fff1d9;border-color:#f3b45a;box-shadow:0 3px 0 #f3b45a}
.fx-m.sell.on{background:#ffb347;border-color:#d97d00;box-shadow:0 3px 0 #d97d00;color:#3b1d00}
.fx-m.move{background:#e3f1ff;border-color:#7db8f0;box-shadow:0 3px 0 #7db8f0}
.fx-ban{margin-top:7px;padding:6px 9px;border-radius:9px;font-size:12.5px;font-weight:800;display:flex;align-items:center;justify-content:space-between;gap:8px;line-height:1.25}
.fx-ban.place{background:#eaf9e6;color:#2d6a2a}
.fx-ban.sell{background:#ffe8c2;color:#7a3f00;border:2px dashed #f0a02a}
.fx-ban .b{margin:0;padding:4px 8px;font-size:12px;white-space:nowrap;flex:none}
.fx-xu{font-weight:800;white-space:nowrap}
#ui.fx .fh2{display:inline-block;font-size:12px;font-weight:800;color:#fff;background:#d9a35a;padding:2px 10px;border-radius:10px;margin:12px 0 6px}
#ui.fx .fh2.sup{background:#55b868}
#ui.fx .fg{grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:7px}
#ui.fx .ft{background:#fff;border:2px solid #efdcae;border-radius:11px;min-height:92px;padding:6px 2px 4px;box-shadow:0 2px 0 #efdcae}
#ui.fx .ft:active{background:#fff1b8}
#ui.fx .ft img{width:46px;height:46px}
#ui.fx .ft b{font-size:11px;color:#33200f}
#ui.fx .ft small{font-size:10.5px;color:#8a5a2e}
#ui.fx .ft i{background:#fff3cf;border:1px solid #d9b27c;color:#5a3a1a;border-radius:8px;padding:0 5px;font-size:10.5px;right:2px;top:2px}
#ui.fx .ft.sup{border-color:#bfe6c0;box-shadow:0 2px 0 #bfe6c0}
#ui.fx .ft.sl{border-color:#f3b45a;box-shadow:0 2px 0 #f3b45a;background:#fffaf0}
#ui.fx .ft.sl em{font-style:normal;font-size:11px;font-weight:800;background:#ffb347;color:#3b1d00;border-radius:9px;padding:0 7px;margin-top:auto;line-height:1.4}
#ui.fx .ft.dis{opacity:.4;filter:grayscale(.6)}
#ui.fx .ft.pop{animation:fxpop .35s}
@keyframes fxpop{0%{transform:scale(1)}40%{transform:scale(.9);background:#ffe27a}100%{transform:scale(1)}}
.fx-empty{margin:26px 6px;text-align:center;color:#8a5a2e;font-weight:700;line-height:1.5}
/* trang mua */
.fx-buy{text-align:center;padding:4px 0 2px}
.fx-buy .pic{width:116px;height:116px;margin:4px auto 6px;background:#fff;border:3px solid #efdcae;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 #efdcae}
.fx-buy .pic img{width:92px;height:92px;image-rendering:pixelated;object-fit:contain}
.fx-buy .nm{font-weight:800;font-size:19px;margin:4px 0 6px}
.fx-pill{display:inline-flex;align-items:center;gap:4px;background:#fff;border:2px solid #efdcae;border-radius:12px;padding:3px 11px;font-weight:800;font-size:13px;margin:2px 3px}
.fx-pill.own{background:#e9f9e4;border-color:#8fd08a;color:#2d6a2a}
.fx-pill.bad{background:#ffe3df;border-color:#e89a8f;color:#b3261e}
.fx-flash{min-height:26px;margin:8px 0 4px;font-weight:800;font-size:14px;color:#2d8a2a}
.fx-flash.k{animation:fxfl .5s}
@keyframes fxfl{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.fx-act{display:flex;gap:8px;margin-top:6px}
.fx-act .b{margin:0!important;border-radius:13px;font-size:15px;padding:13px 6px}
.fx-act .back{flex:1;background:#e3f1ff!important;border-color:#7db8f0!important;box-shadow:0 3px 0 #7db8f0!important}
.fx-act .yes{flex:1.7;background:#86e07f!important;border-color:#3fa43a!important;box-shadow:0 3px 0 #3fa43a!important;color:#10360e}
.fx-act .yes.no{background:#ddd!important;border-color:#aaa!important;box-shadow:0 3px 0 #aaa!important;color:#777}
.fx-act .b:active{transform:translateY(3px);box-shadow:none!important}
`;
document.head.appendChild(css);

/* UI khác mở ra → bỏ màu sáng của shop/thùng */
const o0=openUI;
window.openUI=openUI=function(){try{$$('ui').classList.remove('fx')}catch(e){}return o0.apply(this,arguments)};
const show=h=>{openUI(h);$$('ui').classList.add('fx')};

const owned=k=>(ST.fm.d[k]||0);
const tile=(img,name,o)=>{o=o||{};
 return '<button class="ft'+(o.cls?' '+o.cls:'')+'" '+(o.id?'id="'+o.id+'" ':'')+'onclick="'+o.click+'"><img src="'+img+'" alt="">'
  +(o.badge!==''&&o.badge!=null?'<i>'+o.badge+'</i>':'')+'<b>'+name+'</b>'+(o.sub?'<small>'+o.sub+'</small>':'')+(o.chip?'<em>'+o.chip+'</em>':'')+'</button>'};
const sticky=(title,inner)=>'<div class="fx-sticky">'+head(title)+(inner||'')+'</div>';

/* ================= SHOP ================= */
let KEEP=-1;
window.fmShop=fmShop=function(){const old=FMSCR>=0?FMSCR:$$('ui').scrollTop;FMSCR=-1;
 let h=sticky('🛒 Shop nông trại','<div class="fx-ban place"><span>Chạm món để xem & mua</span><span class="fx-xu">🪙 '+fmtXu(ST.xu)+'</span></div>');
 for(const[c,cn]of FMCAT){const ks=Object.keys(FMD).filter(k=>FMD[k][5]==c);if(!ks.length)continue;
  h+='<div class="fh2">'+cn+'</div><div class="fg">'+ks.map(k=>tile(fmDeTh(k),FMD[k][0],{click:"fmAsk('"+k+"')",sub:fmPr(k)+'🪙',badge:owned(k)>0?'x'+owned(k):''})).join('')+'</div>'}
 show(h);$$('ui').scrollTop=old};

/* trang mua: GIỮ NGUYÊN sau khi mua; chỉ "Quay lại" mới ra danh sách */
let SESS={k:'',n:0};
window.fmAsk=fmAsk=function(k,flash){if(!FMD[k])return;
 if(flash==null){FMSCR=$$('ui').scrollTop;      /* nhớ vị trí danh sách để Quay lại đúng chỗ */
  FMBL=performance.now()+150;if(SESS.k!==k)SESS={k:k,n:0}}
 const c=fmPr(k),ok=ST.xu>=c,own=owned(k),sx=$$('ui').scrollTop;
 const h=sticky('🛒 Mua đồ')
  +'<div class="fx-buy"><div class="pic"><img src="'+fmDeTh(k)+'" alt=""></div><div class="nm">'+FMD[k][0]+'</div>'
  +'<div><span class="fx-pill">Giá <b>'+fmtXu(c)+'</b> 🪙</span><span class="fx-pill'+(ok?'':' bad')+'">Bạn có <b>'+fmtXu(ST.xu)+'</b> 🪙</span></div>'
  +'<div><span class="fx-pill own">📦 Trong thùng: <b>x'+own+'</b></span>'+(SESS.n?'<span class="fx-pill own">+'+SESS.n+' vừa mua</span>':'')+'</div>'
  +'<div class="fx-flash'+(flash?' k':'')+'" id="fxflash">'+(flash||(ok?'Bấm <b>Mua</b> nhiều lần để mua nhiều cái':'<span style="color:#b3261e">⚠ Chưa đủ Xu (thiếu '+fmtXu(c-ST.xu)+' 🪙)</span>'))+'</div>'
  +'<div class="fx-act"><button class="b back" onclick="fmShop()">↩ Quay lại</button><button class="b yes'+(ok?'':' no')+'" id="fmyes" onclick="fmYes(\''+k+'\')">✅ Mua  (−'+fmtXu(c)+' 🪙)</button></div></div>';
 show(h);$$('ui').scrollTop=0};
window.fmYes=fmYes=function(k){if(performance.now()<FMBL)return;fmBuy(k)};
window.fmBuy=fmBuy=function(k){const c=fmPr(k);if(!FMD[k])return;
 if(ST.xu<c){return fmAsk(k,'<span style="color:#b3261e">⚠ Không đủ Xu! Cần '+fmtXu(c)+' 🪙</span>')}
 ST.xu-=c;ST.fm.d[k]=(ST.fm.d[k]||0)+1;xuUp();save();
 if(SESS.k!==k)SESS={k:k,n:0};SESS.n++;
 fmAsk(k,'✅ Đã mua '+FMD[k][0]+'!  (trong thùng: x'+ST.fm.d[k]+')')};

/* ================= THÙNG ================= */
let LASTSELL=null,SMSG='';
window.fxMode=function(m){FMSELL=m?1:0;SMSG='';LASTSELL=null;fmBox()};
window.fxUndo=function(){const s=LASTSELL;if(!s)return;if(ST.xu<s.p){toast('Không đủ Xu để hoàn tác');return}
 ST.xu-=s.p;ST.fm.d[s.k]=(ST.fm.d[s.k]||0)+1;xuUp();save();LASTSELL=null;SMSG='↩ Đã hoàn tác: nhận lại '+FMD[s.k][0];fmBox()};

window.fmBox=fmBox=function(){const f=ST.fm,old=$$('ui').scrollTop,sell=FMSELL;
 const plc=fmCount('pl'),poc=fmCount('po'),mas=MACHS.map((m,i)=>i).filter(i=>fmCount('ma',i)),trs=Object.keys(FRUITS).filter(k=>fmCount('tr',k)),bes=[...Array(BEEN).keys()].filter(i=>fmCount('bee',i)),mic=fmCount('mi',0);
 const nde=Object.keys(f.d).reduce((a,k)=>a+(f.d[k]>0?f.d[k]:0),0),nsu=plc+poc+mas.length+trs.length+bes.length+mic;
 const modes='<div class="fx-modes">'
  +'<button class="fx-m place'+(sell?'':' on')+'" onclick="fxMode(0)"><span>🟢</span>Đặt ra<small>chạm để đặt</small></button>'
  +'<button class="fx-m sell'+(sell?' on':'')+'" onclick="fxMode(1)"><span>💰</span>Bán lại<small>chạm để bán</small></button>'
  +'<button class="fx-m move" onclick="fmEdit()"><span>✏️</span>Di chuyển / Cất<small>đồ trên nông trại</small></button></div>';
 const ban=sell?'<div class="fx-ban sell"><span>'+(SMSG||'💰 CHẾ ĐỘ BÁN — chạm đồ trang trí để bán 1 cái')+'</span>'+(LASTSELL?'<button class="b" onclick="fxUndo()">↩ Hoàn tác</button>':'<span class="fx-xu">🪙 '+fmtXu(ST.xu)+'</span>')+'</div>'
   :'<div class="fx-ban place"><span>Chạm đồ để đặt ra nông trại • <b>'+(nsu+nde)+'</b> món</span><span class="fx-xu">🪙 '+fmtXu(ST.xu)+'</span></div>';
 let h=sticky('📦 Thùng nông trại',modes+ban);
 const sup=(label,grid)=>'<div class="fh2 sup">'+label+'</div><div class="fg">'+grid+'</div>';
 const st=sell?{cls:'sup dis'}:{cls:'sup'};
 if(sell&&!nde)h+='<div class="fx-empty">Chưa có đồ trang trí nào để bán 📭<br>(vật tư như ruộng, chậu, máy không bán được)</div>';
 else if(!nsu&&!nde)h+='<div class="fx-empty">Thùng đang trống 📭<br>Ghé 🛒 Shop nông trại để mua đồ trang trí nhé.</div>';
 /* --- VẬT TƯ (chung 1 danh sách với trang trí) --- */
 if(!sell)if(plc||poc)h+=sup('🌱 Ô ruộng & chậu',
   (plc?tile(fmTh('pl',FMSOIL),'Ô ruộng',{badge:'x'+plc,click:"fmUse('pl',"+fmNextId('pl')+")",cls:st.cls}):'')
  +(poc?tile(fmTh('po',FMPOT),'Chậu',{badge:'x'+poc,click:"fmUse('po',"+fmNextId('po')+")",cls:st.cls}):''));
 if(!sell)if(mas.length)h+=sup('⚙️ Máy móc (4×2 ô)',mas.map(i=>tile(fmTh('m'+i,MSP[i]),MACHS[i][1],{click:"fmUse('ma',"+i+")",cls:st.cls})).join(''));
 if(!sell)if(bes.length||mic)h+=sup('🐝 Trại ong & máy đào',bes.map(i=>tile(fmTh('bee',FMHIVE),'Tổ ong '+(i+1),{click:"fmUse('bee',"+i+")",cls:st.cls})).join('')+(mic?tile(fmTh('mi',mineM),'Máy đào',{click:"fmUse('mi',0)",cls:st.cls}):''));
 if(!sell)if(trs.length)h+=sup('🌳 Cây lâu năm',trs.map(k=>tile(fmTh('t'+k,S_[k]),FRUITS[k][0],{click:"fmUse('tr','"+k+"')",cls:st.cls})).join(''));
 /* --- TRANG TRÍ --- */
 for(const[c,cn]of FMCAT){const ks=Object.keys(FMD).filter(k=>FMD[k][5]==c&&f.d[k]>0);if(!ks.length)continue;
  h+='<div class="fh2">'+cn+'</div><div class="fg">'+ks.map(k=>tile(fmDeTh(k),FMD[k][0],{badge:'x'+f.d[k],click:"fmUse('de','"+k+"')",id:'fxt_'+k,cls:sell?'sl':'',chip:sell?'+'+fmPr(k)+'🪙':''})).join('')+'</div>'}
 show(h);$$('ui').scrollTop=old};

window.fmUse=fmUse=function(kd,id){
 if(kd=='de'&&FMSELL){const f=ST.fm;if(!(f.d[id]>0))return;const p=fmPr(id);f.d[id]--;ST.xu+=p;xuUp();save();
  LASTSELL={k:id,p:p};SMSG='💰 Đã bán '+FMD[id][0]+' +'+fmtXu(p)+' 🪙';fmBox();
  const t=$$('fxt_'+id);if(t)t.classList.add('pop');return}
 if(FMSELL)return toast('Vật tư không bán được — chỉ bán đồ trang trí');
 if(id<0||fmCount(kd,id)<1)return toast('Hết món này rồi!');
 fmStart(kd,id)};

/* nút dock dưới màn hình sáng hơn một chút */
const c2=document.createElement('style');c2.textContent='#fmb .b{background:#ffe3a3;border-color:#b98a4e;box-shadow:0 3px 0 #b98a4e}#fbar .b{background:#ffe3a3}';document.head.appendChild(c2);
})();
