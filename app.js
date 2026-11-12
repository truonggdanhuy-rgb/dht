// Điền 2 dòng dưới theo hướng dẫn Supabase để tài khoản dùng được trên mọi thiết bị (để trống = tài khoản chỉ lưu trên máy)
const SB_URL='https://opucbxnvlchwqmmjolye.supabase.co',SB_KEY='sb_publishable_Ilx40wsl8EXciRRqPy0WPQ_ejkWl6Ur',ADMIN_USER='huyhuy003333';
const $=(s,e=document)=>e.querySelector(s),app=$('#app'),dlg=$('#dlg');
let user=localStorage.user||'',admin=user===ADMIN_USER;
const db=new Promise(r=>{const q=indexedDB.open('dht',1);q.onupgradeneeded=()=>['books','posts','lists'].forEach(n=>q.result.createObjectStore(n,{keyPath:'id'}));q.onsuccess=()=>r(q.result)});
const tx=async(s,m,f)=>{const d=await db;return new Promise(r=>{const t=d.transaction(s,m),q=f(t.objectStore(s));t.oncomplete=()=>r(q&&q.result)})};
const all=s=>tx(s,'readonly',o=>o.getAll()),put=(s,v)=>tx(s,'readwrite',o=>o.put(v)),del=(s,k)=>tx(s,'readwrite',o=>o.delete(k)),get=(s,k)=>tx(s,'readonly',o=>o.get(k));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const K=k=>k+'_'+(user||'khach');
const prog=()=>JSON.parse(localStorage[K('prog')]||'{}'),setProg=(id,v)=>{const p=prog();p[id]=v;localStorage[K('prog')]=JSON.stringify(p)};
const hist=()=>JSON.parse(localStorage[K('hist')]||'[]'),addHist=(t,id)=>{localStorage[K('hist')]=JSON.stringify([{t,id},...hist().filter(x=>!(x.t==t&&x.id==id))].slice(0,12))};
const cfg=()=>({font:'var(--f1)',size:19,pad:24,bg:'#f6edd2',mode:'all',...JSON.parse(localStorage.cfg||'{}')});
const FONTS={'var(--f1)':'Bookerly (Literata)','var(--f2)':'Caecilia (Bitter)'};
const fopt=v=>Object.entries(FONTS).map(([k,n])=>`<option value="${k}" ${k==v?'selected':''}>${n}</option>`).join('');
// bìa: luôn tỉ lệ 2:3; không có ảnh thì tự tạo bìa nền nhạt + tiêu đề
const cover=(t,img)=>img?`<div class=cv><img src="${img}" alt=""></div>`:`<div class="cv gen"><span>${esc(t||'Không tiêu đề')}</span></div>`;
const fit=src=>new Promise(r=>{const i=new Image;i.onload=()=>{const w=360,h=540,c=document.createElement('canvas');c.width=w;c.height=h;const k=Math.max(w/i.width,h/i.height);c.getContext('2d').drawImage(i,(w-i.width*k)/2,(h-i.height*k)/2,i.width*k,i.height*k);r(c.toDataURL('image/jpeg',.82))};i.onerror=()=>r('');i.src=src});
const hid=bars=>{let y=scrollY;return()=>{const d=scrollY-y;if(Math.abs(d)>6){const h=d>0&&scrollY>60;bars.forEach(b=>b.classList.toggle('hide',h));if(h&&$('#panel'))$('#panel').hidden=true;y=scrollY}}};

const OFF=!SB_URL;
const ses=j=>localStorage.sess=JSON.stringify({a:j.access_token,r:j.refresh_token,e:Date.now()+(j.expires_in||3600)*1000,id:j.user?.id});
async function tok(){let s=JSON.parse(localStorage.sess||'null');if(!SB_URL||!user||!s)return'';if(Date.now()>s.e-60000){try{ses(await sb('token?grant_type=refresh_token',{refresh_token:s.r}));s=JSON.parse(localStorage.sess)}catch{return''}}return s.a}
async function api(path,o={}){const t=await tok(),h={apikey:SB_KEY};if(t)h.Authorization='Bearer '+t;if(o.ct)h['Content-Type']=o.ct;else if(o.body)h['Content-Type']='application/json';if(o.prefer)h.Prefer=o.prefer;
 const r=await fetch(SB_URL+path,{method:o.method||'GET',headers:h,body:o.raw?o.body:o.body&&JSON.stringify(o.body)});if(!r.ok)throw (await r.text()).slice(0,160);const x=await r.text();return x?JSON.parse(x):null}
const sbooks=async()=>{try{return OFF?[]:await api('/rest/v1/shared_books?select=*&order=at.desc')}catch{return[]}};
const shared=async id=>{try{const[m]=await api('/rest/v1/shared_books?select=id,title,type,cover&id=eq.'+id),j=await(await fetch(SB_URL+'/storage/v1/object/public/books/'+id+'.json')).json();return{...m,...j}}catch{}};
const pPut=p=>OFF?put('posts',p):api('/rest/v1/posts',{method:'POST',body:p,prefer:'resolution=merge-duplicates'}),pDel=id=>OFF?del('posts',id):api('/rest/v1/posts?id=eq.'+id,{method:'DELETE'}),lPut=l=>OFF?put('lists',l):api('/rest/v1/lists',{method:'POST',body:l,prefer:'resolution=merge-duplicates'});
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
 user=n;admin=n===ADMIN_USER;localStorage.user=n;er('');$('#pw').value='';dlg.close();route()}
$('#adm').onclick=()=>{if(!user)return dlg.showModal();const d=$('#dlg2'),c=()=>d.close();
 d.innerHTML=`<h3>👤 ${esc(user)}</h3>${admin?'<p>✅ Quyền quản trị</p><p><a class=btn href="#/viet/new">✎ Viết bài mới</a> <a class="btn g" href="#/diendan">Quản lý Diễn đàn</a></p>':'<p class=muted>Thành viên</p>'}<p><button class="btn g" id=lo>Đăng xuất</button> <button class="btn g" id=cx>Đóng</button></p>`;
 d.showModal();d.querySelectorAll('a').forEach(a=>a.onclick=c);$('#cx').onclick=c;$('#lo').onclick=()=>{c();user='';admin=false;localStorage.removeItem('user');localStorage.removeItem('sess');route()}};
$('#li').onclick=()=>auth(0);$('#rg').onclick=()=>auth(1);$('#cl').onclick=()=>dlg.close();

// ---- điều hướng
const R={'':home,ebook,giaitri:()=>app.innerHTML=`<h2>Giải trí</h2><div class=grid2><a class="c gc" href="#/trochoi">🎮<b>Trò chơi</b></a><div class="c gc off">🏘<b>Phố</b><small>Sắp ra mắt</small></div></div>`,trochoi:()=>app.innerHTML=`<div class=top><h2>Trò chơi</h2><a class="btn g" href="#/giaitri">←</a></div><div class=grid2><a class="c gc" href="#/game/2048">🔢<b>2048</b><small>${user?'Tự lưu tiến trình':'Đăng nhập để lưu tiến trình'}</small></a></div>`,game,diendan:lib,read,viet:edit,bai:view};
async function route(){const[h,q]=location.hash.slice(2).split('?'),[p,a]=h.split('/');onscroll=null;sync();const rd=p=='read'||p=='bai';document.body.classList.toggle('reading',rd);$('#snow').style.display=rd?'none':'';await(R[p||'']||home)(a,q);scrollTo(0,0)}
addEventListener('hashchange',route);route();

// ---- trang chủ
async function home(){const B=[...await all('books'),...await sbooks()],{posts:P}=await posts(),p=prog(),bk=b=>{const v=Math.round((p[b.id]?.pct||0)*100);return `<a class=bk href="#/read/${b.id}">${cover(b.title,b.cover)}<div class=pb><u style="width:${v}%"></u></div><small>${v}%</small></a>`},pk=x=>`<a class=bk href="#/bai/${x.id}">${cover(x.title,x.cover)}${x.pin?'<span class=pn>📌</span>':''}</a>`;
 const hs=hist().map(x=>x.t=='b'?(B.find(b=>b.id==x.id)&&bk(B.find(b=>b.id==x.id))):(P.find(b=>b.id==x.id)&&pk(P.find(b=>b.id==x.id)))).filter(Boolean),pins=P.filter(x=>x.pin).slice(0,10);
 app.innerHTML=`<div class="c wel"><h1>Chào mừng đến DHT ❄</h1><p class=muted>Nơi đọc sách và đọc truyện.</p></div>${hs.length?`<h2>Lịch sử đọc</h2><div class=grid>${hs.join('')}</div>`:''}${pins.length?`<h2>📌 Ghim</h2><div class=grid>${pins.map(pk).join('')}</div>`:''}`}

// ---- ebook
async function ebook(a,q){const tu=q=='t=tu',S=await sbooks(),B=await all('books'),sh=JSON.parse(localStorage[K('shelf')]||'[]'),p=prog();
 const it=(b,x)=>{const v=Math.round((p[b.id]?.pct||0)*100);return `<div class=bk><a href="#/read/${b.id}">${cover(b.title,b.cover)}</a>${x}<div class=pb><u style="width:${v}%"></u></div><small>${v}%</small></div>`};
 const list=tu?[...S.filter(b=>sh.includes(b.id)).map(b=>it(b,`<button class=del data-sh="${b.id}">✖</button>`)),...B.map(b=>it(b,`<button class=del data-del="${b.id}">🗑</button>`))]:S.map(b=>it(b,(admin?`<button class=del data-ds="${b.id}">🗑</button>`:'')+`<button class=add data-sh="${b.id}">${sh.includes(b.id)?'✔':'＋'}</button>`));
 app.innerHTML=`<div class=top><h2>Ebook</h2>${tu||admin?`<label class=btn>＋ ${tu?'Tải sách của tôi':'Tải lên kho'}<input type=file id=up accept=".epub,.docx,.txt" hidden multiple></label>`:''}</div>
 <div class=chips><a href="#/ebook" class="${tu?'':'on'}">Kho sách</a><a href="#/ebook?t=tu" class="${tu?'on':''}">Tủ sách của tôi</a></div>
 ${list.length?`<div class=grid>${list.join('')}</div>`:`<p class=muted>${tu?'Tủ sách trống. Bấm ＋ ở sách trong Kho sách, hoặc tải sách của bạn lên.':'Kho sách chưa có sách nào.'}</p>`}`;
 const up=$('#up');if(up)up.onchange=async e=>{for(const f of e.target.files){try{const r=await parse(f),t=f.name.replace(/\.\w+$/,''),ty=f.name.split('.').pop().toUpperCase();
  if(tu)await put('books',{id:uid(),title:t,type:ty,ch:r.ch,cover:r.cover||''});
  else{const id='s_'+uid();await api('/storage/v1/object/books/'+id+'.json',{method:'POST',raw:1,body:new Blob([JSON.stringify({ch:r.ch})],{type:'application/json'}),ct:'application/json'});await api('/rest/v1/shared_books',{method:'POST',body:{id,title:t,type:ty,cover:r.cover||'',at:Date.now()}})}}catch(x){alert(f.name+': '+x)}}route()}}
app.onclick=async e=>{const b=e.target.closest('[data-ds],[data-sh],[data-del]');if(!b)return;const d=b.dataset;
 if(d.del){if(confirm('Xóa sách này khỏi máy?')){await del('books',d.del);route()}}
 else if(d.sh){const k=K('shelf'),s=JSON.parse(localStorage[k]||'[]'),i=s.indexOf(d.sh);i<0?s.push(d.sh):s.splice(i,1);localStorage[k]=JSON.stringify(s);route()}
 else if(confirm('Xóa sách khỏi kho? Mọi người sẽ không thấy nữa.')){try{await api('/rest/v1/shared_books?id=eq.'+d.ds,{method:'DELETE'});await api('/storage/v1/object/books/'+d.ds+'.json',{method:'DELETE'}).catch(()=>0)}catch(x){alert(x)}route()}};
async function parse(f){const n=f.name.toLowerCase(),buf=await f.arrayBuffer();
 if(n.endsWith('.epub'))return epub(buf);
 if(n.endsWith('.docx'))return{ch:split((await mammoth.convertToHtml({arrayBuffer:buf})).value)};
 if(n.endsWith('.txt'))return{ch:split(new TextDecoder().decode(buf).split(/\n+/).map(l=>'<p>'+esc(l)+'</p>').join(''))};
 throw 'MOBI/AZW3 chưa hỗ trợ. Hãy đổi sang EPUB bằng Calibre rồi tải lên.'}
function split(h){const d=document.createElement('div');d.innerHTML=h;const o=[];let c='';[...d.children].forEach(e=>{if(/^H[12]$/.test(e.tagName)&&c){o.push(c);c=''}c+=e.outerHTML;if(c.length>20000){o.push(c);c=''}});if(c)o.push(c);return o.map((h,i)=>({t:'Phần '+(i+1),h}))}
async function epub(buf){const z=await JSZip.loadAsync(buf),rd=p=>z.file(decodeURIComponent(p))?.async('string'),P=s=>new DOMParser().parseFromString(s,'text/'+(s.startsWith('<?xml')||s.includes('<package')||s.includes('<container')?'xml':'html'));
 const op=P(await rd('META-INF/container.xml')).querySelector('rootfile').getAttribute('full-path'),dir=op.replace(/[^/]*$/,''),o=P(await rd(op)),m={};
 o.querySelectorAll('manifest item').forEach(i=>m[i.getAttribute('id')]=i.getAttribute('href'));const out=[];
 for(const r of o.querySelectorAll('spine itemref')){const h=await rd(dir+m[r.getAttribute('idref')]);if(!h)continue;const d=new DOMParser().parseFromString(h,'text/html');d.querySelectorAll('script,style,link,img,svg').forEach(e=>e.remove());const b=d.body.innerHTML.trim();if(b.replace(/<[^>]+>/g,'').trim().length>20)out.push({t:(d.querySelector('h1,h2,h3')?.textContent||'Phần '+(out.length+1)).trim().slice(0,60),h:b})}
 if(!out.length)throw 'Không đọc được nội dung (có thể sách bị DRM)';
 let cv='';try{const ci=o.querySelector('manifest item[properties~="cover-image"]')||o.querySelector('manifest item[id="'+(o.querySelector('meta[name="cover"]')?.getAttribute('content')||'x')+'"]');if(ci)cv=await fit(URL.createObjectURL(await z.file(decodeURIComponent(dir+ci.getAttribute('href'))).async('blob')))}catch{}
 return{ch:out,cover:cv}}

// ---- đọc ebook
async function read(id){const b=id.startsWith('s_')?await shared(id):await get('books',id);if(!b)return location.hash='#/ebook';addHist('b',id);let S=cfg(),pg=b.type==='DOCX'||S.mode=='chap',ci=prog()[id]?.ch||0;
 app.innerHTML=`<div class=rd id=rd><div class="bar top" id=tp><a href="#/ebook">←</a><b>${esc(b.title)}</b><button id=bs>⚙</button></div>
 <div id=panel hidden><label>Font<select id=f>${fopt(S.font)}</select></label><label>Cỡ chữ <input type=range id=z min=14 max=34 value=${S.size}></label><label>Lề chữ (sát ↔ thụt) <input type=range id=p min=0 max=120 value=${S.pad}></label>
 <label>Màu nền<select id=bg>${[['#f6edd2','Vàng nhạt'],['#ffffff','Trắng'],['#e4efe0','Xanh dịu'],['#1d2330','Tối']].map(([v,n])=>`<option value="${v}" ${v==S.bg?'selected':''}>${n}</option>`)}</select></label>
 <label>Chế độ đọc<select id=md><option value=all ${S.mode=='all'?'selected':''}>Cuộn dọc liền cả sách</option><option value=chap ${S.mode=='chap'?'selected':''}>Từng chương (hết chương mới sang trang)</option></select></label></div>
 <article id=art></article><div class="bar bot" id=bt>${pg?'<button id=pv>‹</button>':''}<select id=sel>${b.ch.map((c,i)=>`<option value=${i}>${i+1}. ${esc(c.t)}</option>`)}</select>${pg?'<button id=nx>›</button>':''}</div></div>`;
 const rd=$('#rd'),art=$('#art'),bars=[$('#tp'),$('#bt')],max=()=>Math.max(1,document.body.scrollHeight-innerHeight),sc=()=>scrollY/max();
 const save=()=>{localStorage.cfg=JSON.stringify(S);rd.style.setProperty('--f',S.font);rd.style.setProperty('--sz',S.size+'px');rd.style.setProperty('--pad',S.pad+'px');rd.style.background=S.bg;rd.style.color=S.bg=='#1d2330'?'#e8e8e8':'#222'};
 const rec=()=>{if(!pg){const s=[...art.children];ci=Math.max(0,s.findLastIndex(e=>e.getBoundingClientRect().top<innerHeight/3));$('#sel').value=ci;setProg(id,{ch:ci,pct:sc(),y:sc()})}else setProg(id,{ch:ci,pct:Math.min(1,(ci+sc())/b.ch.length),y:sc()})};
 const show=(i,y=0)=>{ci=Math.max(0,Math.min(b.ch.length-1,i));art.innerHTML=b.ch[ci].h+(ci<b.ch.length-1?'<p style="text-align:center;margin-top:2em"><button class=btn id=n2>Chương tiếp →</button></p>':'');$('#n2')&&($('#n2').onclick=()=>show(ci+1));$('#sel').value=ci;scrollTo(0,y*max());rec()};
 [['f','font'],['bg','bg']].forEach(([e,k])=>$('#'+e).onchange=x=>{S[k]=x.target.value;save()});[['z','size'],['p','pad']].forEach(([e,k])=>$('#'+e).oninput=x=>{S[k]=+x.target.value;save()});
 $('#md').onchange=e=>{S.mode=e.target.value;save();route()};$('#bs').onclick=()=>$('#panel').hidden^=1;
 if(pg){$('#pv').onclick=()=>show(ci-1);$('#nx').onclick=()=>show(ci+1);$('#sel').onchange=e=>show(+e.target.value)}else{art.innerHTML=b.ch.map(c=>`<section>${c.h}</section>`).join('');$('#sel').onchange=e=>art.children[+e.target.value]?.scrollIntoView()}
 art.onclick=()=>{bars.forEach(x=>x.classList.toggle('hide'));$('#panel').hidden=true};
 const h=hid(bars);let tm;onscroll=()=>{h();clearTimeout(tm);tm=setTimeout(()=>location.hash.startsWith('#/read')&&rec(),300)};
 save();if(pg)show(ci,prog()[id]?.y||0);else{scrollTo(0,(prog()[id]?.y||0)*max());rec()}}

// ---- diễn đàn
const posts=async()=>{if(!OFF){try{const[P,L]=await Promise.all([api('/rest/v1/posts?select=*&order=at.desc'),api('/rest/v1/lists?select=*')]);return{posts:P,lists:L}}catch{}}return{posts:(await all('posts')).sort((a,b)=>b.at-a.at),lists:await all('lists')}};
async function lib(a,q){const{posts:P,lists:L}=await posts(),h=(q||'').replace('l=',''),sh=h?P.filter(p=>p.list==h):P;
 app.innerHTML=`<div class=top><h2>Diễn đàn</h2>${admin?`<div><a class=btn href="#/viet/new">✎ Viết bài</a> <button class="btn g" id=nl>＋ Danh sách</button> <button class="btn g" id=ex>⬇ Xuất dữ liệu</button></div>`:''}</div>
 <div class=stats><div><b>${P.length}</b>bài viết</div><div><b>${L.length}</b>danh sách</div><div><b>${P.reduce((n,p)=>n+p.body.replace(/<[^>]+>/g,' ').split(/\s+/).length,0)}</b>từ</div></div>
 <div class=chips><a href="#/diendan" class="${h?'':'on'}">Tất cả</a>${L.map(l=>`<a href="#/diendan?l=${l.id}" class="${h==l.id?'on':''}">${esc(l.name)}</a>`).join('')}</div>
 ${sh.length?`<div class=grid>${sh.map(p=>`<a class=bk href="#/bai/${p.id}">${cover(p.title,p.cover)}${p.pin?'<span class=pn>📌</span>':''}<small>${esc(p.title)}</small></a>`).join('')}</div>`:'<p class=muted>Chưa có bài viết.</p>'}`;
 if(admin){$('#nl').onclick=async()=>{const n=prompt('Tên danh sách:');if(n){await lPut({id:uid(),name:n});lib(a,q)}};
  $('#ex').onclick=()=>{const x=document.createElement('a');x.href=URL.createObjectURL(new Blob([JSON.stringify({posts:P,lists:L})],{type:'application/json'}));x.download='posts.json';x.click()}}}
async function view(id){const{posts:P}=await posts(),p=P.find(x=>x.id==id);if(!p)return location.hash='#/diendan';addHist('p',id);const F=localStorage.pf||'var(--f1)';
 app.innerHTML=`<div class=rd id=rd><div class="bar top" id=tp><a href="#/diendan">←</a><b>${esc(p.title)}</b><select id=f>${fopt(F)}</select></div><article id=art><h1 style="font-family:var(--f2)">${esc(p.title)}</h1>${p.pin?'<small>📌 Đã ghim</small>':''}<div>${p.body}</div>
 ${admin?`<p><a class=btn href="#/viet/${p.id}">Sửa</a> <button class="btn g" id=pn>${p.pin?'Bỏ ghim':'Ghim lên trang chủ'}</button> <button class="btn g" id=dl>Xóa</button></p>`:''}</article></div>`;
 const rd=$('#rd'),bars=[$('#tp')];rd.style.setProperty('--f',F);$('#f').onchange=e=>{localStorage.pf=e.target.value;rd.style.setProperty('--f',e.target.value)};
 $('#art').onclick=e=>{if(!e.target.closest('a,button'))bars[0].classList.toggle('hide')};onscroll=hid(bars);
 if(admin){$('#dl').onclick=async()=>{if(confirm('Xóa bài?')){await pDel(id);location.hash='#/diendan'}};
  $('#pn').onclick=async()=>{if(!p.pin&&P.filter(x=>x.pin).length>=10)return alert('Tối đa 10 bài ghim');await pPut({...p,pin:!p.pin});view(id)}}}
async function edit(id){if(!admin){alert('Chỉ quản trị viên');return location.hash='#/diendan'}const{posts:P,lists:L}=await posts(),p=P.find(x=>x.id==id)||{id:uid(),title:'',body:'',list:'',at:Date.now(),cover:'',pin:false};let cv=p.cover||'';
 app.innerHTML=`<div class=c><input type=text id=t placeholder="Tiêu đề" value="${esc(p.title)}"><select id=l><option value="">— Danh sách —</option>${L.map(l=>`<option value=${l.id} ${l.id==p.list?'selected':''}>${esc(l.name)}</option>`)}</select>
 <div style="display:flex;gap:14px;align-items:center;margin-bottom:10px"><div id=cvp style="width:90px">${cover(p.title,cv)}</div><div><label class="btn g">🖼 Tải bìa<input type=file id=cf accept="image/*" hidden></label> <button class="btn g" id=nc>Dùng bìa tự tạo</button><br><label><input type=checkbox id=pn ${p.pin?'checked':''}> 📌 Ghim lên trang chủ</label></div></div>
 <div class=tb><button data-c=bold><b>B</b></button><button data-c=italic><i>I</i></button><button data-c=underline><u>U</u></button><input type=color id=col value="#c0392b"><button id=cp>Chú thích</button><button id=tx>Văn bản</button><label>🖼 Ảnh<input type=file id=im accept="image/*" hidden></label></div>
 <div class=ed id=ed contenteditable style="font-family:var(--f1)">${p.body}</div><p><button class=btn id=sv>Lưu bài</button> <a class="btn g" href="#/diendan">Hủy</a></p></div>`;
 const ed=$('#ed'),pv=()=>$('#cvp').innerHTML=cover($('#t').value,cv);$('#t').oninput=()=>{if(!cv)pv()};
 $('#cf').onchange=async e=>{cv=await fit(URL.createObjectURL(e.target.files[0]));pv()};$('#nc').onclick=()=>{cv='';pv()};
 app.querySelectorAll('[data-c]').forEach(b=>b.onmousedown=e=>{e.preventDefault();document.execCommand(b.dataset.c)});
 $('#col').oninput=e=>document.execCommand('foreColor',false,e.target.value);
 $('#cp').onmousedown=e=>{e.preventDefault();const s=getSelection().toString();if(s)document.execCommand('insertHTML',false,`<span class=cap>${esc(s)}</span>`)};
 $('#tx').onmousedown=e=>{e.preventDefault();document.execCommand('removeFormat')};
 $('#im').onchange=e=>{const i=new Image;i.onload=()=>{const k=Math.min(1,1000/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ed.focus();document.execCommand('insertImage',false,c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(e.target.files[0])};
 $('#sv').onclick=async()=>{if($('#pn').checked&&!p.pin&&P.filter(x=>x.pin).length>=10)return alert('Tối đa 10 bài ghim');await pPut({...p,title:$('#t').value||'Không tiêu đề',list:$('#l').value,body:ed.innerHTML,cover:cv,pin:$('#pn').checked});location.hash='#/bai/'+p.id}}

// ---- trò chơi (lưu tiến trình theo tài khoản)
const GAMES={2048:{n:'2048',keys:['bestScore','gameState']}};
async function game(id){const g=GAMES[id];if(!g)return;
 if(user&&SB_URL){try{const[r]=await api('/rest/v1/saves?select=data&game=eq.'+id),d=r?.data||{};g.keys.forEach(k=>d[k]!=null?localStorage[k]=d[k]:localStorage.removeItem(k))}catch{}}
 app.innerHTML=`<div class=top><h2>${g.n}</h2><a class="btn g" href="#/trochoi">←</a></div><p class=muted id=sv>${user?'Tiến trình tự lưu mỗi vài giây':'Đăng nhập để lưu tiến trình lên tài khoản'}</p><iframe class=gf src="games/${id}/index.html"></iframe>`;
 const push=async()=>{if(!user||!SB_URL)return;const d={};g.keys.forEach(k=>d[k]=localStorage[k]??null);try{await api('/rest/v1/saves',{method:'POST',body:{user_id:JSON.parse(localStorage.sess).id,game:id,data:d},prefer:'resolution=merge-duplicates'});$('#sv')&&($('#sv').textContent='Đã lưu '+new Date().toLocaleTimeString('vi'))}catch{}};
 const iv=setInterval(()=>location.hash.startsWith('#/game')?push():clearInterval(iv),4000)}

// ---- tuyết
(()=>{const c=$('#snow'),x=c.getContext('2d');let w,h,f=[];const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight};rs();addEventListener('resize',rs);
 for(let i=0;i<70;i++)f.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2.5+.8,s:Math.random()*.7+.3,d:Math.random()*6});
 (function L(){x.clearRect(0,0,w,h);x.fillStyle='#fff';x.globalAlpha=.85;f.forEach(a=>{a.y+=a.s;a.d+=.01;a.x+=Math.sin(a.d)*.4;if(a.y>h){a.y=-5;a.x=Math.random()*w}x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fill()});requestAnimationFrame(L)})()})();
