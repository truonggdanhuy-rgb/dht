/* ============================================================
   CÔNG VIÊN ONLINE — Supabase Realtime (không cần tạo bảng)
   - Presence: danh sách người trong phòng (tối đa 20), tên, ghế, ngựa
   - Broadcast: vị trí, chat, nước đi của trò chơi
   Đổi 2 dòng dưới nếu bạn đổi project Supabase.
   ============================================================ */
(()=>{
const SB_URL_='https://opucbxnvlchwqmmjolye.supabase.co',SB_KEY_='sb_publishable_Ilx40wsl8EXciRRqPy0WPQ_ejkWl6Ur',MAXP=20;
const CV=window.CV,PK=window.PK={rank:-1,in:0,all:[],busy:0};
const clean=s=>String(s||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,16);
if(!ST.name)ST.name='Khách'+(100+Math.floor(Math.random()*900));
const ME={id:Math.random().toString(36).slice(2,9),ts:0,q:-1,qt:0,z:-1,zt:0};
let sb=null,ch=null,lastT=performance.now();

// ---------- tên nhân vật (bấm avatar góc phải) ----------
window.nameBox=()=>'<div style="display:flex;gap:4px;margin-bottom:8px"><input id="pnm" maxlength="16" value="'+escH(ST.name)+'" placeholder="Tên nhân vật" style="flex:1;min-width:0;font:inherit;padding:5px;border:2px solid #7a4a26;background:#fff8e0"><button class="b" onclick="setNm()">Lưu tên</button></div>';
window.setNm=()=>{const n=clean($('pnm').value);if(!n)return toast('Tên không được để trống');ST.name=n;save();toast('✅ Tên nhân vật: '+n);track();if(window.cardSync)cardSync()};

// ---------- vẽ tên + bong bóng chat trên đầu ----------
const bub={}; // id -> {t,until}
const tag=(t,x,y,col,bf)=>{cx.font='800 8px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';
 let tx=x;const L=window.idLogo?window.idLogo(bf):null; // logo Bạn thân đứng trước tên, luôn cao 11px dù ảnh gốc to/bé
 if(L){const h=11,w=Math.round(L.width*h/L.height),tw=cx.measureText(t).width,sx=x-(w+2+tw)/2;cx.save();cx.imageSmoothingEnabled=true;cx.drawImage(L,Math.round(sx),Math.round(y-9),w,h);cx.restore();tx=sx+w+2+tw/2}
 cx.lineWidth=3;cx.lineJoin='round';cx.strokeStyle='rgba(30,20,10,.85)';cx.strokeText(t,tx,y);cx.fillStyle=col;cx.fillText(t,tx,y)};
const bubble=(t,x,y)=>{cx.font='800 8px Nunito,"Segoe UI",Arial,sans-serif';cx.textAlign='center';const w=Math.min(150,cx.measureText(t).width)+10;
 cx.fillStyle='rgba(30,20,10,.55)';cx.fillRect(x-w/2+1,y-9,w,13);cx.fillStyle='#fffdf0';cx.fillRect(x-w/2,y-10,w,13);cx.fillRect(x-2,y+3,4,2);cx.fillStyle='#3a2412';cx.fillText(t,x,y,w-6)};
window.drawNames=tm=>{const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;
 if(CVON&&CV.fx)CV.fx(tm,dt);
 if(!(HMA&&HMA.hide)){let x,y;if(CVON){const p=cvHeadPos();x=p.x;y=p.y}else{x=Math.round(Pl.x);y=Math.round(Pl.y)-(Pl.sit?34:tagOff(ST.av.m,Pl.d))}
  tag(ST.name,x,y,'#fff6c0',((ST.id&&typeof ST.id.bt=='number')?ST.id.bt:-1));const b=bub[ME.id];if(b&&b.until>now)bubble(b.t,x,y-8)}
 if(CVON)for(const o of CV.others.values()){if(o.hx==null)continue;tag(o.n||'?',o.hx,o.hy,'#d8f4ff',o.bf);const b=bub[o.id];if(b&&b.until>now)bubble(b.t,o.hx,o.hy-8)}};

// ---------- tạo nhân vật lần đầu ----------
window.welcomeName=()=>{openUI('<div class="uh"><span>🌾 Chào mừng đến Tinyland!</span></div><div class="mut">Hãy đặt tên nhân vật. Tên hiện trên đầu bạn và bạn bè trong Công viên sẽ thấy tên này (không phải tên đăng nhập DHT). Sau này vẫn đổi được khi bấm avatar.</div><div style="display:flex;gap:4px;margin:8px 0"><input id="pnm0" maxlength="16" value="'+escH(ST.name)+'" style="flex:1;min-width:0;font:inherit;padding:6px;border:2px solid #7a4a26;background:#fff8e0"><button class="b" onclick="welcomeOk()">Bắt đầu</button></div>');
 const i=$('pnm0');if(i){i.select();i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key=='Enter')welcomeOk()})}};
window.welcomeOk=()=>{const n=clean($('pnm0').value);if(!n)return toast('Tên không được để trống');ST.name=n;ST.nm=1;closeUI();toast('🌾 Xin chào '+n+'!')};
if(!ST.nm)setTimeout(welcomeName,500);

// ---------- lì xì (tặng Xu) qua máy chủ Supabase ----------
let giftBusy=0;
window.claimGifts=async()=>{if(!dhtOk()||giftBusy)return;giftBusy=1;
 try{const L=await dhtRpc('claim_gifts');if(Array.isArray(L)&&L.length){let t=0;L.forEach(g=>{t+=g.a|0});ST.xu+=t;xuUp();save();toast('🧧 '+(L.length==1?escH(L[0].n)+' lì xì bạn':L.length+' lì xì')+' +'+fmtXu(t)+' Xu!')}}catch(e){}
 giftBusy=0};
setTimeout(claimGifts,2500);setInterval(claimGifts,20000);
let tapO=null;
function tapMenu(o){tapO=o;openUI('<div class="uh"><span>🧑 '+escH(o.n||'?')+'</span><button class="b x" onclick="closeUI()">X</button></div>'+
 '<div class="g1"><button class="b r" onclick="pkCard()"><span>🪪 Card</span><i>xem thông tin</i></button><button class="b r" disabled style="opacity:.55"><span>🎭 Hành động</span><i>sắp có</i></button><button class="b r" disabled style="opacity:.55"><span>🎮 Chơi chung</span><i>sắp có</i></button>'+
 '<button class="b r" onclick="liXiUI()"><span>🧧 Lì xì</span><i>tặng Xu</i></button>'+bfBtn(o)+'</div>')}
window.pkCard=()=>{if(tapO&&CV.others.has(tapO.id)&&window.idView)idView(tapO);else{closeUI();toast('Người này đã rời đi')}};
window.pkBack=o=>{const x=o&&CV.others.has(o.id)?o:tapO;if(x&&CV.others.has(x.id))tapMenu(x);else closeUI()};
window.liXiUI=()=>{const o=tapO;if(!o||!CV.others.has(o.id))return closeUI();if(!o.u)return toast('Người này chưa thể nhận lì xì');
 openUI('<div class="uh"><span>🧧 Lì xì cho '+escH(o.n||'?')+'</span><button class="b x" onclick="closeUI()">X</button></div><div class="mut">Bạn đang có 🪙 <b>'+fmtXu(ST.xu)+'</b> Xu. Xu tặng sẽ bị trừ của bạn và cộng cho '+escH(o.n||'?')+'.</div>'+
 '<div style="display:flex;gap:4px;margin:8px 0"><input id="lxn" type="number" inputmode="numeric" min="1" max="1000000" placeholder="Số Xu muốn tặng" style="flex:1;min-width:0;font:inherit;padding:6px;border:2px solid #7a4a26;background:#fff8e0"><button class="b" id="lxb" onclick="liXiGo()">🧧 Tặng</button></div>'+
 '<div class="pf">'+[10,50,100,500].map(v=>'<button class="b" onclick="$(\'lxn\').value='+v+'">'+v+'</button>').join('')+'</div>');
 const i=$('lxn');if(i)i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key=='Enter')liXiGo()})};
window.liXiGo=async()=>{if(giftBusy)return;const o=tapO,a=Math.floor(+($('lxn').value||0));
 if(!o||!o.u||!CV.others.has(o.id))return toast('Người này đã rời đi');
 if(!(a>=1))return toast('Nhập số Xu muốn tặng');if(a>1000000)return toast('Tối đa 1.000.000 Xu mỗi lần');if(a>ST.xu)return toast('🪙 Bạn không đủ Xu');
 giftBusy=1;$('lxb').disabled=true;
 try{const ok=await dhtRpc('send_gift',{p_to:o.u,p_amount:a,p_name:ST.name});
  if(ok===true){ST.xu-=a;xuUp();save();bcast('gift',{to:o.u});closeUI();toast('🧧 Đã lì xì '+fmtXu(a)+' Xu cho '+(o.n||'bạn ấy'))}
  else{toast('❌ Chưa gửi được (gửi quá nhanh hoặc người nhận không hợp lệ)');if($('lxb'))$('lxb').disabled=false}}
 catch(e){toast('❌ Chưa gửi được, thử lại nhé');if($('lxb'))$('lxb').disabled=false}
 giftBusy=0};


// ---------- Bạn thân (mời / đồng ý / đồng bộ qua Supabase, chạy file ban_than.sql 1 lần) ----------
const BFX=[0,100,300,700,1500]; // mốc EXP tình bạn của 5 bậc danh hiệu
window.bfTierOf=e=>{let t=0;BFX.forEach((v,i)=>{if((e|0)>=v)t=i});return t};
window.bfExpAt=BFX;
window.bfGet=()=>(ST.id&&ST.id.bfc)||null;
let bfBusy=0,bfShown={};
function bfApply(b){if(!ST.id)ST.id={};const was=ST.id.bfc||null;ST.id.bfc=b||null;ST.id.bt=b?bfTierOf(b.exp):-1;
 if(b&&(!was||was.pu!=b.pu))toast('💞 Bạn và '+(b.pn||'bạn ấy')+' đã là bạn thân!');
 save();track()}
window.bfPoll=async()=>{if(!dhtOk()||bfBusy)return;bfBusy=1;
 try{const A=ST.av||{},r=await dhtRpc('bf_poll',{p_name:ST.name,p_av:{h:A.h|0,s:A.s|0,e:A.e|0}});
  if(r&&typeof r=='object'){bfApply(r.bf);
   (r.res||[]).forEach(x=>toast('🙏 '+(x.n||'Bạn ấy')+' chưa muốn kết bạn thân lúc này'));
   if(!r.bf&&!UI&&Array.isArray(r.inv))for(const v of r.inv){if(!bfShown[v.id]){bfShown[v.id]=1;bfAsk(v);break}}}}catch(e){}
 bfBusy=0};
function bfAsk(v){openUI('<div class="uh"><span>💞 Lời mời bạn thân</span></div><div style="text-align:center;padding:8px 4px"><div style="font-size:34px">💌</div><div style="font-size:15px;margin:6px 0"><b>'+escH(v.n||'Ai đó')+'</b> muốn làm bạn thân với bạn!</div><div class="mut">Mỗi người chỉ có 1 bạn thân, và cả hai cùng chung tiến trình tình bạn.</div></div><div style="display:flex;gap:6px"><button class="b go" style="flex:1" onclick="bfAnswer('+(v.id|0)+',1,\''+escH(v.u||'')+'\')">💞 Đồng ý</button><button class="b" style="flex:1" onclick="bfAnswer('+(v.id|0)+',0,\''+escH(v.u||'')+'\')">Từ chối</button></div>')}
window.bfAnswer=async(id,yes,from)=>{try{const r=await dhtRpc('bf_reply',{p_id:id,p_accept:!!yes});closeUI();
  if(r=='ok')toast('💞 Tuyệt! Hai bạn đã là bạn thân');else if(r=='declined')toast('Đã từ chối lời mời');
  else if(r=='busy')toast('Một trong hai bạn đã có bạn thân rồi');else toast('Lời mời đã hết hạn');
  if(from)bcast('bfok',{to:from});setTimeout(bfPoll,300)}catch(e){closeUI();toast('❌ Chưa trả lời được, thử lại nhé')}};
window.bfInvite=async()=>{const o=tapO;if(!o||!o.u)return toast('Người này chưa thể kết bạn thân');if(bfGet())return toast('Bạn đã có bạn thân rồi');
 try{const r=await dhtRpc('bf_invite',{p_to:o.u,p_name:ST.name,p_to_name:o.n||''});
  if(r=='ok'){bcast('bfinv',{to:o.u});closeUI();toast('💌 Đã gửi lời mời bạn thân cho '+(o.n||'bạn ấy'))}
  else if(r=='busy_me')toast('Bạn đã có bạn thân rồi');else if(r=='busy_them')toast('Người này đã có bạn thân rồi');
  else if(r=='rate')toast('Mời nhanh quá, đợi một chút nhé');else toast('❌ Chưa gửi được lời mời')}
 catch(e){toast('❌ Chưa gửi được (máy chủ Bạn thân chưa sẵn sàng)')}};
function bfBtn(o){const B=bfGet();
 if(B)return '<button class="b r" disabled style="opacity:.55"><span>💞 Bạn thân</span><i>'+(o.u&&o.u==B.pu?'bạn thân của bạn':'bạn đã có bạn thân')+'</i></button>';
 return '<button class="b r" onclick="bfInvite()"><span>💞 Mời bạn thân</span><i>mỗi người 1 bạn</i></button>'}
setTimeout(bfPoll,2500);setInterval(bfPoll,20000);

// ---------- giao diện: chat + số người ----------
const css=document.createElement('style');css.textContent=`
#cvc{position:fixed;left:10px;top:calc(10px + env(safe-area-inset-top,0px));z-index:4;display:none;max-width:min(62vw,300px);padding:6px 8px;background:rgba(30,24,14,.62);color:#fff;border-radius:6px;font-size:12px;line-height:1.35;pointer-events:none;font-weight:700}
#cvc .n{color:#ffe27a;font-size:11px;margin-bottom:2px}#cvc div.l{word-break:break-word}#cvc b{color:#9fe0ff}
#cvb{position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:4;display:none;gap:6px}
#cvi{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:7;display:none;gap:6px}
#cvi input{flex:1;min-width:0;font:inherit;font-size:16px;padding:8px;border:3px solid #7a4a26;background:#fff8e0;color:#3a2412}
#cvg{position:fixed;left:50%;top:calc(8px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:5;display:none;width:min(94vw,330px);box-sizing:border-box;padding:8px;max-height:92vh;overflow:auto;font-size:13px}
#cvg .bd{display:grid;gap:5px;justify-content:center;margin:8px 0}
#cvg .ce{width:var(--cs);height:var(--cs);font-size:calc(var(--cs)*.55);padding:0;display:flex;align-items:center;justify-content:center}
#cvg .ce.u{background:#fff3cf}#cvg .ce.m{background:#bfe8b0;border-color:#4caf50}#cvg .ce.o{background:#cfe3ff}`;document.head.appendChild(css);
const mkEl=(id,html,tagN)=>{const e=document.createElement(tagN||'div');e.id=id;e.innerHTML=html||'';document.body.appendChild(e);return e};
const elC=mkEl('cvc','<div class="n" id="cvn"></div><div id="cvl"></div>'),
 elB=mkEl('cvb','<button class="b" id="cvbt">💬 Chat</button><button class="b" id="cvsn">🔊</button>'),
 elI=mkEl('cvi','<input id="cvt" maxlength="60" placeholder="Nhập tin nhắn..." autocomplete="off"><button class="b" id="cvs">Gửi</button><button class="b" id="cvx">✕</button>'),
 elG=mkEl('cvg','');elG.className='p';
const lines=[];
function chatUI(){$('cvn').textContent='👥 '+(PK.all.length||1)+'/'+MAXP+(CV.room=='ps'?' trong phố xá':' trong công viên');
 $('cvl').innerHTML=lines.map(l=>'<div class="l"><b>'+escH(l[0])+':</b> '+escH(l[1])+'</div>').join('')}
function addLine(n,t){lines.push([n,t]);while(lines.length>3)lines.shift();chatUI()}
const showUI=v=>{elC.style.display=v?'block':'none';elB.style.display=v?'flex':'none';if(!v){elI.style.display='none';elG.style.display='none'}};
let lastSend=0;
function sendChat(){const t=$('cvt').value.trim().slice(0,60);if(!t)return;const n=performance.now();if(n-lastSend<800)return toast('Bạn nhắn nhanh quá, chờ chút nhé!');lastSend=n;$('cvt').value='';
 bcast('chat',{i:ME.id,n:ST.name,t});addLine(ST.name,t);bub[ME.id]={t,until:n+5000}}
$('cvbt').onclick=()=>{elI.style.display='flex';elB.style.display='none';$('cvt').focus()};
$('cvx').onclick=()=>{elI.style.display='none';elB.style.display='flex'};$('cvs').onclick=sendChat;
$('cvt').addEventListener('keydown',e=>{if(e.key=='Enter'){sendChat();e.preventDefault()}else if(e.key=='Escape')$('cvx').onclick();e.stopPropagation()});
// bàn phím điện thoại: chỉ nâng ô chat lên trên bàn phím, không zoom
if(window.visualViewport){const vv=visualViewport,fit=()=>{const k=Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop));elI.style.bottom='calc('+(10+k)+'px + env(safe-area-inset-bottom,0px))';if(k>0)scrollTo(0,0)};vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit)}
$('cvt').addEventListener('blur',()=>setTimeout(()=>{scrollTo(0,0);if(window.visualViewport)elI.style.bottom=''},60));
CV.snd=localStorage.cv_snd!='0';$('cvsn').textContent=CV.snd?'🔊':'🔇';
$('cvsn').onclick=()=>{CV.snd=!CV.snd;localStorage.cv_snd=CV.snd?'1':'0';$('cvsn').textContent=CV.snd?'🔊':'🔇'};

// ---------- mạng ----------
const me=()=>({id:ME.id,u:myUid(),n:ST.name,h:ST.av.h,s:ST.av.s,e:ST.av.e|0,m:ST.av.m,x:Math.round(Pl.x),y:Math.round(Pl.y),ts:ME.ts,q:ME.q,qt:ME.qt,z:ME.z,zt:ME.zt,bf:((ST.id&&typeof ST.id.bt=='number')?ST.id.bt:-1)});
function track(){if(ch&&PK.in)try{ch.track(me())}catch(e){}}
function bcast(ev,p){if(ch)try{ch.send({type:'broadcast',event:ev,payload:p})}catch(e){}}
const loadLib=()=>window.supabase?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';s.onload=ok;s.onerror=()=>no(new Error('không tải được thư viện Supabase'));document.head.appendChild(s)});
async function disconnect(){PK.in=0;try{if(ch){await ch.untrack();await sb.removeChannel(ch)}}catch(e){}ch=null;CV.others.clear();PK.all=[];PK.rank=-1}
function sync(){if(!ch)return;const st=ch.presenceState(),all=[];for(const k in st){const m=st[k][st[k].length-1];if(m&&m.id)all.push(m)}
 all.sort((a,b)=>a.ts-b.ts||(a.id<b.id?-1:1));PK.all=all.slice(0,MAXP);PK.rank=all.findIndex(p=>p.id==ME.id);
 const okIds=new Set(PK.all.map(p=>p.id));
 for(const p of PK.all){if(p.id==ME.id)continue;let o=CV.others.get(p.id);
  if(!o){o={id:p.id,x:p.x,y:p.y,tx:p.x,ty:p.y,d:0,a:0,mv:0};CV.others.set(p.id,o)}
  o.u=p.u||'';o.n=p.n;o.hair=p.h;o.set=p.s;o.e=p.e|0;o.m=p.m==null?-1:p.m;o.seat=p.q==null?-1:p.q;o.hz=p.z==null?-1:p.z;o.qt=p.qt||0;o.zt=p.zt||0;o.bf=p.bf==null?-1:p.bf|0}
 for(const id of[...CV.others.keys()])if(!okIds.has(id))CV.others.delete(id);
 if(PK.in){chatUI();
  if(PK.rank<0)selfHeal();   // máy chủ đã xóa mình khỏi danh sách (rớt mạng ngắn, iPhone ngủ...) -> đăng ký lại ngay
  if(PK.rank>=MAXP){toast('🚫 Công viên đã đủ người, bạn được mời ra ngoài');switchMap('nt');return}
  // ai ngồi/cưỡi trước thì giữ chỗ
  const lose=(mine,t,get)=>{for(const o of CV.others.values())if(get(o)==mine&&((o.t0||0)<t||((o.t0||0)==t&&o.id<ME.id)))return 1};
  if(CV.seat>=0&&[...CV.others.values()].some(o=>o.seat==CV.seat&&(o.qt<ME.qt||(o.qt==ME.qt&&o.id<ME.id)))){toast('🪑 Có người nhanh chân hơn bạn rồi!');Pl.sit=0;Pl.y=Pl.by}
  if(CV.hz>=0&&[...CV.others.values()].some(o=>o.hz==CV.hz&&(o.zt<ME.zt||(o.zt==ME.zt&&o.id<ME.id)))){toast('🐎 Có bạn nhanh chân hơn rồi!');Pl.sit=0;Pl.y=Pl.by}
  gSync()}}
CV.seatOcc=i=>{for(const o of CV.others.values())if(o.seat==i)return 1;return 0};
CV.hzOcc=i=>{if(CV.hz==i)return 1;for(const o of CV.others.values())if(o.hz==i)return 1;return 0};
function connect(room,keep){return new Promise((ok,no)=>{
 sb=sb||window.supabase.createClient(SB_URL_,SB_KEY_,{realtime:{params:{eventsPerSecond:20}}});
 if(!keep){ME.ts=Date.now();ME.q=-1;ME.z=-1}let done=0;
 const tm=setTimeout(()=>{if(!done){done=1;no(new Error('hết thời gian chờ'))}},9000);
 ch=sb.channel(room=='ps'?'pho-xa':'cong-vien',{config:{presence:{key:ME.id},broadcast:{self:false}}});
 ch.on('presence',{event:'sync'},()=>{sync();if(!done&&PK.rank>=0){done=1;clearTimeout(tm);ok(PK.rank>=MAXP?'full':'ok')}});
 ch.on('broadcast',{event:'mv'},({payload:p})=>{const o=CV.others.get(p.i);if(!o){askRetrack(p.i);return}o.tx=p.x;o.ty=p.y;o.d=p.d;if(Math.hypot(o.tx-o.x,o.ty-o.y)>160){o.x=o.tx;o.y=o.ty}});
 ch.on('broadcast',{event:'chat'},({payload:p})=>{if(!PK.in||!CV.others.has(p.i))return;const t=String(p.t||'').slice(0,60);addLine(String(p.n||'?').slice(0,16),t);bub[p.i]={t,until:performance.now()+5000}});
 ch.on('broadcast',{event:'g'},({payload:p})=>gRecv(p));
 ch.on('broadcast',{event:'rt'},({payload:p})=>{if(p&&p.to==ME.id)track()});
 ch.on('broadcast',{event:'bfinv'},({payload:p})=>{if(p&&p.to&&p.to==myUid())setTimeout(bfPoll,600)});
 ch.on('broadcast',{event:'bfok'},({payload:p})=>{if(p&&p.to&&p.to==myUid())setTimeout(bfPoll,600)});
 ch.on('broadcast',{event:'gift'},({payload:p})=>{if(p&&p.to&&p.to==myUid())setTimeout(claimGifts,600)});
 ch.subscribe(s=>{if(s=='SUBSCRIBED')ch.track({...me(),x:Math.round(CV.pos.x),y:Math.round(CV.pos.y)});
  else if((s=='CHANNEL_ERROR'||s=='TIMED_OUT'||s=='CLOSED')){if(!done){if(s=='CLOSED')return;done=1;clearTimeout(tm);no(new Error('lỗi kênh '+s))}else if(PK.in){if(s!='CLOSED')toast('⚠️ Mất kết nối, đang thử lại...');setTimeout(()=>revive(0),4000)}}})})}
// ---------- TỰ CHỮA LÀNH: không để người chơi "biến mất" ----------
// Nguyên nhân cũ: khi 1 máy rớt kết nối thoáng qua (iPhone khóa màn hình/chuyển app, wifi chập chờn),
// máy chủ xóa họ khỏi danh sách; máy họ vẫn chạy nhưng không đăng ký lại nên mọi người thấy họ biến mất mãi.
let lastHeal=0,rvBusy=0,askT={};
function selfHeal(){const n=performance.now();if(n-lastHeal<1500)return;lastHeal=n;track()}
function askRetrack(id){if(!id||!PK.in)return;const n=performance.now();if(askT[id]&&n-askT[id]<4000)return;askT[id]=n;bcast('rt',{to:id})}
async function revive(force){
 if(!PK.in||rvBusy||PK.busy)return;
 if(ch&&ch.state==='joined'&&!force){track();return}
 rvBusy=1;
 try{const room=CV.room;try{if(ch)await sb.removeChannel(ch)}catch(e){}ch=null;await loadLib();await connect(room,1);track();toast('✅ Đã kết nối lại')}
 catch(e){setTimeout(()=>revive(1),5000)}
 rvBusy=0}
// quay lại app / có mạng lại -> kiểm tra & đăng ký lại ngay
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>revive(0),300)});
addEventListener('pageshow',()=>setTimeout(()=>revive(0),300));
addEventListener('online',()=>setTimeout(()=>revive(1),800));
// nhịp tim: 25 giây đăng ký lại 1 lần cho chắc (rẻ, chỉ vài người)
setInterval(()=>{if(PK.in&&!document.hidden){if(!ch||ch.state!=='joined')revive(0);else track()}},25000);
window.cvEnter=async(room)=>{room=room==='ps'?'ps':'cv';const nm=room=='ps'?'Phố xá':'Công viên',was=MAP=='cv'||MAP=='ps';
 if(PK.busy)return;PK.busy=1;closeUI();toast((room=='ps'?'🏘️':'🌳')+' Đang vào '+nm+'...');
 try{await loadLib();if(ch){showUI(0);gLeave();await disconnect()}CV.room=room;const r=await connect(room);
  if(r=='full'){toast('🚫 '+nm+' đã đủ '+MAXP+' người, thử lại sau nhé!');await disconnect();if(was)switchMap('nt')}else switchMap(room)}
 catch(e){toast('❌ Chưa vào được '+nm+': '+(e.message||e));await disconnect();if(was)switchMap('nt')}
 PK.busy=0};
let tMv=0,tHb=0,lx=0,ly=0,ld=0,tAv=0,avs='';
const PKO=window.PKO={
 tap(wx,wy){let best=null,bd=1e9;for(const o of CV.others.values()){if(o.hx==null)continue;const dx=Math.abs(wx-o.x),dy=wy-(o.hy+20);if(dx<=14&&dy>=-30&&dy<=26){const d=dx+Math.abs(dy);if(d<bd){bd=d;best=o}}}if(!best||G)return false;tapMenu(best);return true},
 onEnter(){PK.in=1;ME.q=-1;ME.z=-1;showUI(1);chatUI();try{const A=window.AudioContext||window.webkitAudioContext;if(A&&!window.__cvAC)window.__cvAC=new A();if(window.__cvAC&&window.__cvAC.resume)window.__cvAC.resume()}catch(e){}track()},
 onLeave(){showUI(0);gLeave();disconnect()},
 canSit(s){if(s.kind=='game'){const t=CV.tbls.find(t=>t.id==s.tb);if(ST.xu<t.bet)return '🪙 Cần ít nhất '+t.bet+' Xu để ngồi bàn này'}return ''},
 onSeat(i){ME.q=i;ME.qt=Date.now();ME.z=-1;track();const s=CV.seats[i];if(s.kind=='game')gSit(s)},
 onHorse(i){ME.z=i;ME.zt=Date.now();ME.q=-1;track()},
 onStand(){ME.q=-1;ME.z=-1;track();gLeave()},
 tick(dt,tm){if(!ch)return;tMv+=dt;tHb+=dt;
  const x=Math.round(Pl.x),y=Math.round(Pl.y);
  if(tMv>=.25&&(x!=lx||y!=ly||Pl.d!=ld)){tMv=0;tHb=0;lx=x;ly=y;ld=Pl.d;bcast('mv',{i:ME.id,x,y,d:Pl.d})}
  else if(tHb>=3){tHb=0;bcast('mv',{i:ME.id,x,y,d:Pl.d})}
  tAv+=dt;if(tAv>1){tAv=0;const k=ST.av.h+'|'+ST.av.s+'|'+(ST.av.e|0)+'|'+ST.av.m+'|'+ST.name;if(k!=avs){avs=k;track()}}
  gTick(dt)}};

// ============================================================
//  TRÒ CHƠI 2 NGƯỜI (người ngồi ghế trái làm "chủ bàn" quyết định kết quả)
// ============================================================
const EMO=['🍎','🍌','🍇','🍉','🐶','🐱','🦆','🌻'];
let G=null; // bàn đang ngồi
const rdy={}; // tb -> {id:true}
const TTL={ttt:'Tic Tac Toe',mem:'Lật hình'};
const players=tb=>tb.seats.map(si=>{if(CV.seat==si)return{id:ME.id,n:ST.name,me:1};for(const o of CV.others.values())if(o.seat==si)return{id:o.id,n:o.n};return null});
const mySide=()=>G?(CV.seat==G.tb.seats[0]?0:1):0;
const isHost=()=>G&&mySide()==0;
function gSit(s){const tb=CV.tbls.find(t=>t.id==s.tb);G={tb,ph:'wait',gid:'',bd:null,turn:0,w:-1,msg:'Đang chờ người chơi thứ 2...',dl:0,sc:[0,0],pick:[],paid:0};
 rdy[tb.id]=rdy[tb.id]||{};rdy[tb.id][ME.id]=1;bcast('g',{k:'rdy',tb:tb.id,f:ME.id});gUI()}
function gLeave(){if(G){delete (rdy[G.tb.id]||{})[ME.id];bcast('g',{k:'unr',tb:G.tb.id,f:ME.id});G=null}CVLOCK=0;elG.style.display='none'}
function gSend(p){p.tb=G.tb.id;p.gid=G.gid;p.f=ME.id;bcast('g',p)}
function pay(w,why){if(!G||G.paid)return;G.paid=1;G.ph='over';G.w=w;CVLOCK=0;const b=G.tb.bet,s=mySide();
 if(w==s){ST.xu+=2*b;G.msg='🏆 Bạn thắng! +'+b+' Xu'+(why?' ('+why+')':'')}
 else if(w==2){ST.xu+=b;G.msg='🤝 Hòa — hoàn lại '+b+' Xu'}
 else G.msg='😢 Bạn thua −'+b+' Xu'+(why?' ('+why+')':'');
 xuUp();save();toast(G.msg);rdy[G.tb.id]={};gUI()}
function startGame(first,deck){const b=G.tb.bet;if(ST.xu<b){G.msg='🪙 Không đủ Xu để chơi tiếp';G.ph='wait';gUI();return false}
 ST.xu-=b;xuUp();save();G.ph='play';G.paid=0;G.gone=0;G.w=-1;G.sc=[0,0];G.pick=[];G.turn=first;G.msg='';CVLOCK=1;
 if(G.tb.kind=='ttt')G.bd=Array(9).fill('');else{G.deck=deck||null;G.bd=Array(16).fill(null);G.done=Array(16).fill(-1)}
 G.dl=Date.now()+(G.tb.kind=='ttt'?30000:40000);gUI();return true}
const LN=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const tWin=b=>{for(const[a,c,d]of LN)if(b[a]&&b[a]==b[c]&&b[a]==b[d])return b[a]=='X'?0:1;return b.includes('')?-1:2};
function gSync(){ // gọi sau mỗi lần presence đổi
 if(!G)return;const pl=players(G.tb);
 if(G.ph=='play'){const opp=pl[1-mySide()];if(!opp){if(!G.gone)G.gone=Date.now()}else G.gone=0}
 if(G.ph!='play'&&(!pl[1-mySide()])){G.msg='Đang chờ người chơi thứ 2...';G.ph='wait'}
 gUI()}
function gRecv(p){if(!G||p.tb!=G.tb.id)return;const k=p.k;
 if(k=='rdy'){(rdy[p.tb]=rdy[p.tb]||{})[p.f]=1;return}
 if(k=='unr'){delete (rdy[p.tb]||{})[p.f];return}
 if(k=='start'&&!isHost()){if(ST.xu<G.tb.bet){bcast('g',{k:'no',tb:G.tb.id,gid:p.gid,f:ME.id});return}G.gid=p.gid;startGame(p.first,null)}
 else if(k=='no'&&isHost()&&p.gid==G.gid&&G.ph=='play'){ST.xu+=G.tb.bet;xuUp();save();G.ph='wait';CVLOCK=0;G.msg='Đối thủ không đủ Xu';rdy[G.tb.id]={};gUI()}
 else if(p.gid!=G.gid)return;
 else if(k=='mv'&&isHost())hostMove(p.c,1-0,p.f);
 else if(k=='ts'&&!isHost()){G.bd=p.b;G.turn=p.turn;G.dl=Date.now()+p.left;if(p.w>=0)pay(p.w);else gUI()}
 else if(k=='fl'&&isHost())hostFlip(p.c,p.f);
 else if(k=='rv'&&!isHost()){G.bd[p.c]=p.v;G.pick.push(p.c);gUI()}
 else if(k=='rs'&&!isHost()){applyRes(p);}
 else if(k=='end'&&!isHost())pay(p.w,p.why)}
const oppId=()=>{const o=players(G.tb)[1-mySide()];return o&&o.id};
function hostMove(c,_,from){ // chỉ chủ bàn chạy (hoặc chính chủ bàn bấm); from=id người đi
 if(!G||G.ph!='play')return;const side=from==ME.id?0:1;if(G.turn!=side)return;
 if(G.tb.kind!='ttt'||G.bd[c])return;G.bd[c]=side?'O':'X';const w=tWin(G.bd);G.turn=1-G.turn;G.dl=Date.now()+30000;
 gSend({k:'ts',b:G.bd,turn:G.turn,left:30000,w});if(w>=0)pay(w);else gUI()}
function hostFlip(c,from){if(!G||G.ph!='play'||G.tb.kind!='mem')return;const side=from==ME.id?0:1;if(G.turn!=side||G.pick.length>=2||G.done[c]>=0||G.pick.includes(c))return;
 const v=G.deck[c];G.bd[c]=v;G.pick.push(c);gSend({k:'rv',c,v});gUI();
 if(G.pick.length==2){const[a,b]=G.pick;setTimeout(()=>{if(!G||G.ph!='play')return;const m=G.bd[a]==G.bd[b]?1:0;if(m){G.done[a]=G.done[b]=G.turn;G.sc[G.turn]++}else{G.bd[a]=G.bd[b]=null}
   G.pick=[];G.turn=1-G.turn;G.dl=Date.now()+40000;const left=G.done.every(x=>x>=0),w=left?(G.sc[0]>G.sc[1]?0:G.sc[1]>G.sc[0]?1:2):-1;
   gSend({k:'rs',a,b,m,sc:G.sc,turn:G.turn,w});if(w>=0)pay(w);else gUI()},1100)}}
function applyRes(p){const{a,b,m}=p;if(m){G.done[a]=G.done[b]=1-p.turn}else{G.bd[a]=G.bd[b]=null}G.pick=[];G.sc=p.sc;G.turn=p.turn;G.dl=Date.now()+40000;if(p.w>=0)pay(p.w);else gUI()}
window.pkMv=c=>{if(!G||G.ph!='play'||G.turn!=mySide())return;
 if(G.tb.kind=='ttt'){if(G.bd[c])return;if(isHost())hostMove(c,0,ME.id);else gSend({k:'mv',c})}
 else{if(G.pick.length>=2||G.done[c]>=0||G.pick.includes(c))return;if(isHost())hostFlip(c,ME.id);else gSend({k:'fl',c})}};
window.pkRdy=()=>{if(!G)return;rdy[G.tb.id]=rdy[G.tb.id]||{};rdy[G.tb.id][ME.id]=1;bcast('g',{k:'rdy',tb:G.tb.id,f:ME.id});G.msg='Đã sẵn sàng, chờ đối thủ...';gUI()};
window.pkLeave=()=>{if(G&&G.ph=='play'&&!confirm('Rời bàn giữa ván sẽ bị xử thua và mất '+G.tb.bet+' Xu. Rời thật không?'))return;CVLOCK=0;Pl.sit=0;Pl.y=Pl.by;goal=null};
let tG=0;
function gTick(dt){if(!G)return;tG+=dt;if(tG<.25)return;tG=0;
 const pl=players(G.tb);
 if(isHost()&&G.ph!='play'&&pl[0]&&pl[1]&&(rdy[G.tb.id]||{})[pl[0].id]&&(rdy[G.tb.id]||{})[pl[1].id]){
  const gid=G.tb.id+'-'+Date.now(),first=Math.random()<.5?0:1;G.gid=gid;
  const deck=G.tb.kind=='mem'?[...EMO,...EMO].sort(()=>Math.random()-.5).map(e=>EMO.indexOf(e)):null;
  rdy[G.tb.id]={};if(startGame(first,deck))gSend({k:'start',first})}
 if(G.ph=='play'&&G.gone&&Date.now()-G.gone>10000)pay(mySide(),'đối thủ rời bàn');
 if(G.ph=='play'&&isHost()&&Date.now()>G.dl+1500){gSend({k:'end',w:1-G.turn,why:'hết giờ'});pay(1-G.turn,'hết giờ')}
 if(G.ph=='play')gUI(1)}
function gUI(light){if(!G)return;const tb=G.tb,pl=players(tb),s=mySide(),n=i=>pl[i]?escH(pl[i].n):'…',ttt=tb.kind=='ttt';
 const sec=Math.max(0,Math.ceil((G.dl-Date.now())/1000));
 if(light&&$('cvtm')){$('cvtm').textContent=G.ph=='play'?'⏱ '+sec+'s':'';return}
 let h='<div class="uh" style="display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:15px"><span>'+(ttt?'⭕ ':'🃏 ')+TTL[tb.kind]+' · cược '+tb.bet+' Xu</span><button class="b x" onclick="pkLeave()">Rời bàn</button></div>';
 h+='<div class="mut" style="display:flex;justify-content:space-between"><span>'+(ttt?'❌ ':'👤 ')+n(0)+(ttt?'':' : '+G.sc[0])+'</span><span id="cvtm">'+(G.ph=='play'?'⏱ '+sec+'s':'')+'</span><span>'+(ttt?'⭕ ':'👤 ')+n(1)+(ttt?'':' : '+G.sc[1])+'</span></div>';
 if(G.ph=='play')h+='<div style="text-align:center;font-weight:800;color:'+(G.turn==s?'#2e7d32':'#7a4a26')+'">'+(G.turn==s?'👉 Đến lượt bạn!':'⏳ Lượt của '+n(G.turn))+'</div>';
 else h+='<div style="text-align:center;font-weight:800">'+escH(G.msg||'')+'</div>';
 if(G.ph=='play'||G.ph=='over'){
  if(ttt){h+='<div class="bd" style="grid-template-columns:repeat(3,1fr);--cs:64px">'+G.bd.map((v,i)=>'<button class="b ce" onclick="pkMv('+i+')">'+(v=='X'?'❌':v=='O'?'⭕':'')+'</button>').join('')+'</div>'}
  else{h+='<div class="bd" style="grid-template-columns:repeat(4,1fr);--cs:56px">'+G.bd.map((v,i)=>{const dn=G.done[i];return '<button class="b ce '+(dn>=0?(dn==s?'m':'o'):v!=null?'u':'')+'" onclick="pkMv('+i+')">'+(v!=null?EMO[v]:'❓')+'</button>'}).join('')+'</div>'}}
 if(G.ph=='over')h+='<div class="pf" style="position:static;margin:6px 0 0;padding:0;border:0;background:none"><button class="b" onclick="pkRdy()">🔁 Ván nữa</button></div>';
 if(G.ph=='wait')h+='<div class="mut" style="text-align:center">Ngồi đủ 2 người là ván bắt đầu • thắng nhận '+tb.bet+' Xu, thua mất '+tb.bet+' Xu</div>';
 elG.innerHTML=h;elG.style.display='block'}
})();
