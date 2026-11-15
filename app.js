// Điền 2 dòng dưới theo hướng dẫn Supabase để tài khoản dùng được trên mọi thiết bị (để trống = tài khoản chỉ lưu trên máy)
const SB_URL='https://opucbxnvlchwqmmjolye.supabase.co',SB_KEY='sb_publishable_Ilx40wsl8EXciRRqPy0WPQ_ejkWl6Ur',ADMIN_USER='huyhuy003333';
const $=(s,e=document)=>e.querySelector(s),app=$('#app'),dlg=$('#dlg');
let user=localStorage.user||'',admin=user===ADMIN_USER;
window.DHT={SB_URL,SB_KEY,ADMIN_USER,tok:()=>tok(),rpc:(f,a)=>rpc(f,a)};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ses=j=>localStorage.sess=JSON.stringify({a:j.access_token,r:j.refresh_token,e:Date.now()+(j.expires_in||3600)*1000,id:j.user?.id});
async function tok(){let s=JSON.parse(localStorage.sess||'null');if(!SB_URL||!user||!s)return'';if(Date.now()>s.e-60000){try{ses(await sb('token?grant_type=refresh_token',{refresh_token:s.r}));s=JSON.parse(localStorage.sess)}catch{return''}}return s.a}
async function api(path,o={}){const t=await tok(),h={apikey:SB_KEY};if(o.method&&user&&!t)throw 'Phiên đăng nhập đã hết. Hãy đăng xuất rồi đăng nhập lại.';if(t)h.Authorization='Bearer '+t;if(o.ct)h['Content-Type']=o.ct;else if(o.body)h['Content-Type']='application/json';if(o.prefer)h.Prefer=o.prefer;
 const r=await fetch(SB_URL+path,{method:o.method||'GET',headers:h,body:o.raw?o.body:o.body&&JSON.stringify(o.body)});if(!r.ok)throw (await r.text()).slice(0,160);const x=await r.text();return x?JSON.parse(x):null}
// ---- mỗi tài khoản chỉ đăng nhập trên 1 thiết bị (bảng devices + hàm claim_device, xem file supabase.sql)
const DEV=localStorage.dev||(localStorage.dev=uid()+uid());
const rpc=(f,a)=>api('/rest/v1/rpc/'+f,{method:'POST',body:a||{}});
const claim=async()=>{try{return(await rpc('claim_device',{d:DEV}))!==false}catch{return true}};
const kick=m=>{user='';admin=false;localStorage.removeItem('user');localStorage.removeItem('sess');alert(m);route()};
const chk=async()=>{if(SB_URL&&user&&localStorage.sess&&!(await claim()))kick('Tài khoản này vừa được đăng nhập ở thiết bị khác nên thiết bị này đã bị đăng xuất.')};
setInterval(chk,30000);setTimeout(chk,2000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)chk()});
// ---- tài khoản (lưu trên trình duyệt này)
const sync=()=>{const b=$('#adm');b.textContent=user?'👤 '+user:'Đăng nhập';b.classList.toggle('on',!!user)};
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('dht'+s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const er=m=>$('#er').textContent=m,ERR={'User already registered':'Tên này đã có người dùng','Invalid login credentials':'Sai tên hoặc mật khẩu'};
async function sb(path,body){const r=await fetch(SB_URL+'/auth/v1/'+path,{method:'POST',headers:{apikey:SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)}),j=await r.json(),m=j.msg||j.message||j.error_description;if(!r.ok)throw ERR[m]||m||'Lỗi kết nối';return j}
async function auth(reg){const n=$('#un').value.trim().toLowerCase(),p=$('#pw').value;
 if(!/^[a-z0-9._-]{3,30}$/.test(n))return er('Tên 3–30 ký tự: chữ thường không dấu, số, . _ -');
 if(p.length<6)return er('Mật khẩu từ 6 ký tự');
 try{if(SB_URL){const e=n+'@dht.app',j=reg?await sb('signup',{email:e,password:p}):await sb('token?grant_type=password',{email:e,password:p});if(!j.access_token)throw 'Cần tắt “Confirm email” trong Supabase';ses(j)}
  else{const U=JSON.parse(localStorage.users||'{}');if(reg){if(U[n])throw 'Tên này đã có trên máy này';U[n]=await sha(p);localStorage.users=JSON.stringify(U)}else if(U[n]!==await sha(p))throw 'Sai tên hoặc mật khẩu'}}
 catch(x){return er(String(x))}
 user=n;admin=n===ADMIN_USER;localStorage.user=n;
 if(SB_URL&&!await claim()){user='';admin=false;localStorage.removeItem('user');localStorage.removeItem('sess');return er('⚠️ Tài khoản này đang đăng nhập ở thiết bị khác. Hãy đăng xuất ở thiết bị đó hoặc dùng tài khoản khác.')}
 er('');$('#pw').value='';dlg.close();route()}
$('#adm').onclick=()=>{if(!user)return dlg.showModal();const d=$('#dlg2'),c=()=>d.close();
 d.innerHTML=`<h3>👤 ${esc(user)}</h3><p><span class=tag>${admin?'✅ Quản trị viên':'Thành viên'}</span></p><div class=row><button class="btn g" id=lo>Đăng xuất</button> <button class="btn g" id=cx>Đóng</button></div>`;
 d.showModal();$('#cx').onclick=c;$('#lo').onclick=async()=>{c();try{if(SB_URL)await rpc('release_device',{d:DEV})}catch{}user='';admin=false;localStorage.removeItem('user');localStorage.removeItem('sess');route()}};
$('#li').onclick=()=>auth(0);$('#rg').onclick=()=>auth(1);$('#cl').onclick=()=>dlg.close();

// ---- điều hướng
const R={'':home,trochoi:minis,game};
async function route(){const[h,q]=location.hash.slice(2).split('?'),[p,a]=h.split('/');
 if(SB_URL&&user&&!localStorage.sess){user='';admin=false;localStorage.removeItem('user')}sync();
 const tl=p=='game'&&a=='tinyland',full=tl&&!!user,isHome=!p||!R[p];
 document.body.classList.toggle('reading',full);document.body.classList.toggle('home',isHome);
 const cur=tl?'tinyland':(p=='trochoi'||p=='game')?'trochoi':'';
 document.querySelectorAll('nav a').forEach(x=>x.classList.toggle('on',x.dataset.n===cur));
 {const vp=document.querySelector('meta[name=viewport]');if(vp){/* Tinyland: khóa zoom trang (iOS tự phóng to khi chat/chạm 2 lần), các trang khác giữ nguyên */
  vp.setAttribute('content',full?'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover':'width=device-width,initial-scale=1')}}
 await(R[p||'']||home)(a,q);scrollTo(0,0)}
addEventListener('hashchange',route);setTimeout(route);

// ---- trang chủ: chỉ có logo
function home(){app.innerHTML=`<section class="hero"><picture><source srcset="assets/logo.webp" type="image/webp"><img src="assets/logo.png" alt="DHT" draggable="false"></picture></section>`}

// ---- Trò mini
function minis(){app.innerHTML=`<div class=top><h2>Trò mini</h2></div><div class=grid2>${Object.entries(GAMES).filter(([k,g])=>!g.hide).map(([k,g])=>`<a class="card gc" href="#/game/${k}"><span class=em>${g.e}</span><b>${g.n}</b><small>${g.keys.length?(user?'Tự lưu tiến trình':'Đăng nhập để lưu'):'Giải trí nhanh'}</small></a>`).join('')}</div>`}


// ---- trò chơi (lưu tiến trình theo tài khoản)
const GAMES={2048:{n:'2048',e:'🔢',keys:['bestScore','gameState']},flappy:{n:'Flappy Bird',e:'🐤',keys:['flappyBest']},ttt:{n:'Tic Tac Toe',e:'⭕',keys:['tttStats','tttHard'],hide:1},quasong:{n:'Qua sông',e:'🛶',keys:['quasongBest','quasongWins']},pacman:{n:'Pacman',e:'👻',keys:[]},tinyland:{n:'Tinyland',e:'🌾',keys:['nt_save'],hide:1,full:1}};
async function game(id){const g=GAMES[id];if(!g){location.hash='#/';return}
 if(g.full&&!user){app.innerHTML=`<div class="card gate"><div class=ge>${g.e}</div><h2>Hãy đăng nhập để vào ${g.n} nhé</h2><p class=muted>Tài khoản DHT dùng để lưu tiến trình và gặp người chơi khác.</p><button class=btn id=gl>Đăng nhập</button></div>`;$('#gl').onclick=()=>dlg.showModal();return}
 if(user&&SB_URL&&g.keys.length){try{const[r]=await api('/rest/v1/saves?select=data&game=eq.'+id),d=r?.data||{},me=JSON.parse(localStorage.sess||'{}').id||'',own=localStorage['own_'+id],ts=v=>{try{return+JSON.parse(v).ts||0}catch{return 0}};g.keys.forEach(k=>{const lv=localStorage[k];/* bản trên máy mới hơn bản đám mây (chưa kịp đẩy lên) → giữ bản máy, tự đẩy lên sau */if(lv!=null&&(!own||own===me)&&ts(lv)>ts(d[k])){return}d[k]!=null?localStorage[k]=d[k]:localStorage.removeItem(k)});if(me)localStorage['own_'+id]=me}catch{if(g.full){app.innerHTML=`<div class="card gate"><div class=ge>⚠️</div><h2>Chưa tải được tiến trình</h2><p class=muted>Kiểm tra mạng rồi mở lại nhé.</p><a class=btn href="#/">Về trang chủ</a></div>`;return}}}
 if(g.full)app.innerHTML=`<iframe class="gf full" src="games/${id}/index.html"></iframe><span id=sv hidden></span>`;else app.innerHTML=`<div class=top><h2>${g.n}</h2><a class="btn g" href="#/trochoi">←</a></div><p class=muted id=sv>${!g.keys.length?'Trò chơi giải trí, không lưu tiến trình':user?'Tiến trình tự lưu mỗi vài giây':'Đăng nhập để lưu tiến trình lên tài khoản'}</p><iframe class=gf src="games/${id}/index.html"></iframe>`;
 let last='',busy=0,again=0;const snap=()=>{const d={};g.keys.forEach(k=>d[k]=localStorage[k]??null);return d};
 const push=async()=>{if(!user||!SB_URL||!g.keys.length)return;if(busy){again=1;return}busy=1;try{do{again=0;const d=snap(),j=JSON.stringify(d);if(j===last)break;await api('/rest/v1/saves',{method:'POST',body:{user_id:JSON.parse(localStorage.sess).id,game:id,data:d},prefer:'resolution=merge-duplicates'});last=j;$('#sv')&&($('#sv').textContent='Đã lưu '+new Date().toLocaleTimeString('vi'))}while(again)}catch{}busy=0};
 /* thoát/ẩn trang: gửi ngay bằng keepalive để không bị hủy giữa chừng */
 const flush=()=>{if(!user||!SB_URL||!g.keys.length)return;try{const d=snap(),j=JSON.stringify(d),s=JSON.parse(localStorage.sess||'null');if(j===last||!s||Date.now()>s.e-5000)return;fetch(SB_URL+'/rest/v1/saves',{method:'POST',keepalive:true,headers:{apikey:SB_KEY,Authorization:'Bearer '+s.a,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify({user_id:s.id,game:id,data:d})}).then(r=>{if(r.ok)last=j}).catch(()=>{})}catch{}};
 window.GFLUSH=flush;window.onmessage=e=>{if(e.data==='dht-save')push()};
 const iv=setInterval(()=>{if(location.hash.startsWith('#/game'))push();else{flush();clearInterval(iv);window.GFLUSH=null}},2000);push()}
if(!window.GLEAVE){window.GLEAVE=1;const lv=()=>{try{window.GFLUSH&&window.GFLUSH()}catch{}};addEventListener('pagehide',lv);addEventListener('beforeunload',lv);document.addEventListener('visibilitychange',()=>{if(document.hidden)lv()})}
