/* =====================================================================
   MACH-SLOTS.JS — 🍳 MỞ THÊM Ô NẤU cho TẤT CẢ máy chế biến (ô 4, 5, 6)
   • Mặc định vẫn 3 ô như cũ + 1 nút nhỏ "➕ Mở thêm ô". Bấm → hiện khung xác nhận giá → mở xong thì ô mới mới hiện ra,
     rồi tới ô kế tiếp (lần lượt 4 → 5 → 6). Ô chưa mở KHÔNG hiện, tránh rối mắt.
   • Mở 1 lần là áp dụng cho MỌI máy (đường, bột, xôi, cơm, mì, dệt, mứt, ...).
   • Giá: ô 4 = 10.000 Xu • ô 5 = 20.000 Xu • ô 6 = 30.000 Xu  → sửa trong MSL_COST bên dưới.
   • Dữ liệu: ST.mx = số ô đã mở thêm (0..3). Hàng đợi vẫn nằm trong ST.mq[máy][0..5].
   • Ghi đè: machAct, mRefresh, collectAll, enq, tickMach (index.html chỉ sửa 1 chỗ: ST.mq giữ 6 ô thay vì 3 khi nạp save).
   Muốn quay về cũ: xóa dòng <script src="mach-slots.js"> (ô 4-6 đang nấu dở sẽ bị ẩn, nhưng không mất).
   ===================================================================== */
(function(){
if(typeof machAct!=='function'||window.__mslots)return;window.__mslots=1;
const MSL_COST=[10000,20000,30000],MAXS=6;
const $$=id=>document.getElementById(id);
const nS=()=>Math.min(MAXS,3+Math.max(0,Math.min(3,ST.mx|0)));
let ASK=0;

const css=document.createElement('style');
css.textContent=`
.mslrow{display:flex;justify-content:flex-end;margin:6px 0 0}
.mslb{font:inherit;font-weight:800;font-size:11.5px;line-height:1.2;padding:4px 10px;background:#e4f3e4;border:2px dashed #6fa583;border-radius:14px;color:#24543d;cursor:pointer}
.mslb:active{transform:translateY(1px)}
.mslq{margin-top:6px;padding:8px 9px;background:#fffbe3;border:2px solid #e0a800;border-radius:10px;color:#5a4300;font-size:12.5px;font-weight:700;line-height:1.4;animation:mslin .2s}
.mslq .row{display:flex;gap:8px;margin-top:7px}
.mslq .b{flex:1;margin:0;padding:8px 4px;font-size:13px;border-radius:9px}
.mslq .go{background:#5dbb63;border-color:#2f6b2a;color:#fff;box-shadow:0 2px 0 #1f4a1c;text-shadow:0 1px 0 rgba(0,0,0,.3)}
.mslq .go.no{background:#d5d5cf;border-color:#a8a79c;box-shadow:0 2px 0 #a8a79c;color:#74736a;text-shadow:none}
.mslq .lack{color:#c62828}
@keyframes mslin{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.ms.newslot{animation:mslnew .7s}
@keyframes mslnew{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
`;
document.head.appendChild(css);

/* chuẩn hóa hàng đợi đủ 6 ô (đề phòng save cũ) */
const fix=()=>{try{ST.mq.forEach(q=>{while(q.length<MAXS)q.push(null)})}catch(e){}};

window.machAct=machAct=function(mi,ask,fresh){MUI=-1;fix();const m=MACHS[mi],N=nS();ASK=ask?1:0;
 let h=head(m[2]+' '+m[0])+'<div class="mtip">Bấm món bên dưới để nấu • Nấu xong bấm vào ô để thu về Kho</div><div class="mslots">';
 for(let i=0;i<N;i++)h+='<div class="ms'+(fresh===i?' newslot':'')+'" id="ms'+i+'" onclick="slotTap('+mi+','+i+')"><span class="mn">Ô '+(i+1)+'</span><div class="mic" id="mic'+i+'"></div><b id="mnm'+i+'"></b><small id="mtx'+i+'"></small><div class="mpb"><i id="mpb'+i+'"></i></div><button class="b x mcx" id="mcx'+i+'" onclick="event.stopPropagation();cancelSlot('+mi+','+i+')">Hủy</button></div>';
 h+='</div>';
 if(N<MAXS){
  const c=MSL_COST[N-3],ok=ST.xu>=c;
  if(!ASK)h+='<div class="mslrow"><button class="mslb" onclick="mslAsk('+mi+')">➕ Mở thêm ô</button></div>';
  else h+='<div class="mslq">🔓 Mở <b>ô '+(N+1)+'</b> — giá <b>'+fmtXu(c)+' 🪙</b><br><span style="font-weight:600">Áp dụng cho <b>tất cả máy</b>. Bạn có: <b'+(ok?'':' class="lack"')+'>'+fmtXu(ST.xu)+' 🪙</b>'+(ok?'':' • thiếu <b class="lack">'+fmtXu(c-ST.xu)+'</b>')+'</span>'
   +'<div class="row"><button class="b" onclick="machAct('+mi+')">Để sau</button><button class="b go'+(ok?'':' no')+'" onclick="mslBuy('+mi+')">'+(ok?'✅ Mở ô '+(N+1):'Chưa đủ Xu')+'</button></div></div>'}
 h+='<button class="b w mall" id="mall" style="display:none" onclick="collectAll('+mi+')"></button><div class="mh">🍽️ Chọn món để nấu</div><div class="mrc">';
 m.rec.forEach((o,ri)=>h+='<button class="rcc'+(canMake(o)?'':' z')+'" onclick="enq('+mi+','+ri+')"><span class="rci">'+ic(o.e,o.n)+'</span><span class="rct"><b>'+o.n+'</b><em>⏱ '+o.min+' phút</em></span><small>'+o.ing.map(g=>'<span'+(stock(g.ref)>=g.n?'':' class="lack"')+'>'+g.n+' '+g.k+'</span>').join(' + ')+'</small></button>');
 const st=$$('ui').scrollTop;openUI(h+'</div>');$$('ui').classList.add('mchui');MUI=mi;mRefresh();$$('ui').scrollTop=st};
window.mslAsk=function(mi){machAct(mi,1)};
window.mslBuy=function(mi){const N=nS();if(N>=MAXS)return machAct(mi);const c=MSL_COST[N-3];
 if(ST.xu<c){toast('Chưa đủ Xu! Cần '+fmtXu(c)+' 🪙');return machAct(mi,1)}
 ST.xu-=c;ST.mx=(ST.mx|0)+1;xuUp();save();toast('🎉 Đã mở ô nấu '+(N+1)+' cho TẤT CẢ máy!'+(N+1<MAXS?'':'\n(Đã mở đủ 6 ô)'));
 machAct(mi,0,N)};

window.mRefresh=mRefresh=function(){if(MUI<0)return;const q=mq(MUI),n=now(),N=nS();let nd=0;
 for(let i=0;i<N;i++){const el=$$('ms'+i);if(!el)return;const it=q[i],ic0=$$('mic'+i);
  if(!it){el.className='ms';if(el.dataset.k!=='-'){el.dataset.k='-';ic0.innerHTML='＋'}
   $$('mnm'+i).textContent='Ô trống';$$('mtx'+i).textContent='Chọn món bên dưới';$$('mpb'+i).style.width='0%';$$('mcx'+i).style.display='none';continue}
  const o=MACHS[MUI].rec[it.r],dn=isDone(it);if(dn)nd++;
  el.className='ms '+(dn?'ok':'on');
  if(el.dataset.k!==o.id){el.dataset.k=o.id;ic0.innerHTML=ic(o.e,o.n)}
  $$('mnm'+i).textContent=o.n;$$('mtx'+i).textContent=dn?'Xong! Bấm để thu':'⏱ '+mmss(it.e-n);
  $$('mpb'+i).style.width=(dn?100:Math.min(100,(n-it.s)/(it.e-it.s)*100))+'%';$$('mcx'+i).style.display=dn?'none':'block'}
 const a=$$('mall');if(a){a.style.display=nd>1?'block':'none';a.textContent='✅ Thu tất cả ('+nd+' món) về Kho'}};

window.collectAll=collectAll=function(mi){fix();const got={};let c=0;for(let i=0;i<nS();i++){const o=collectSlot(mi,i);if(o){c++;const k=o.e+' '+o.n;got[k]=(got[k]||0)+1}}
 if(!c)return;qAdd('cook',c);const mx=ST.lv>=100,lu=addExp(c);save();const ks=Object.keys(got);toast('📦 Đã thu: '+ks.map(k=>k+(got[k]>1?' x'+got[k]:'')).join(', ')+' → Kho vật phẩm'+(mx?'':' • +'+c+' EXP')+lu);machAct(mi)};

window.enq=enq=function(mi,ri){fix();const q=mq(mi),o=MACHS[mi].rec[ri],N=nS();let f=-1;for(let i=0;i<N;i++)if(!q[i]){f=i;break}
 if(f<0)return toast('Máy đã đủ '+N+' ô đang nấu, chờ xong 1 ô nhé!'+(N<MAXS?'\n(Hoặc bấm ➕ Mở thêm ô)':''));
 if(!canMake(o)){const miss=o.ing.filter(i=>stock(i.ref)<i.n).map(i=>i.k+' '+(stock(i.ref))+'/'+i.n);return toast('Thiếu: '+miss.join(', '))}
 o.ing.forEach(i=>ST[i.ref[0]][i.ref[1]]=stock(i.ref)-i.n);
 const n=now();q[f]={r:ri,s:n,e:n+o.min*MIN};save();toast('🍳 Ô '+(f+1)+': '+o.n+' — '+o.min+' phút');machAct(mi)};

window.tickMach=tickMach=function(dt){let ch=false;const n=now(),done={};
 ST.mq.forEach((q,mi)=>{for(let i=0;i<MAXS;i++){const it=q[i];if(it&&!it.d&&n>=it.e){it.d=1;ch=true;const o=MACHS[mi].rec[it.r],k=o.e+' '+o.n;done[k]=(done[k]||0)+1}}});
 if(ch){save();const ks=Object.keys(done),sh=ks.slice(0,6).map(k=>k+(done[k]>1?' x'+done[k]:'')).join(', ');toast('❗ Xong: '+sh+(ks.length>6?' ...':'')+' — bấm vào máy để thu về Kho')}
 if(MUI>=0&&UI){mUiT-=dt;if(mUiT<=0){mUiT=.5;mRefresh()}if(ch)mRefresh()}};
fix();
})();
