const ADMIN_PASS='dht2026'; // ĐỔI mật khẩu này trước khi đưa lên GitHub
const $=(s,e=document)=>e.querySelector(s),app=$('#app');
let admin=sessionStorage.admin==='1';
const db=new Promise(r=>{const q=indexedDB.open('dht',1);q.onupgradeneeded=()=>['books','posts','lists'].forEach(n=>q.result.createObjectStore(n,{keyPath:'id'}));q.onsuccess=()=>r(q.result)});
const tx=async(s,m,f)=>{const d=await db;return new Promise(r=>{const t=d.transaction(s,m),q=f(t.objectStore(s));t.oncomplete=()=>r(q&&q.result)})};
const all=s=>tx(s,'readonly',o=>o.getAll()),put=(s,v)=>tx(s,'readwrite',o=>o.put(v)),del=(s,k)=>tx(s,'readwrite',o=>o.delete(k)),get=(s,k)=>tx(s,'readonly',o=>o.get(k));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const prog=()=>JSON.parse(localStorage.prog||'{}'),setProg=(id,v)=>{const p=prog();p[id]=v;localStorage.prog=JSON.stringify(p)};
const cfg=()=>({font:'var(--f1)',size:19,pad:24,bg:'#f6edd2',rate:1,voice:'f',...JSON.parse(localStorage.cfg||'{}')});
const FONTS={'var(--f1)':'Bookerly (Literata)','var(--f2)':'Caecilia (Bitter)'};
const fopt=v=>Object.entries(FONTS).map(([k,n])=>`<option value="${k}" ${k==v?'selected':''}>${n}</option>`).join('');

// ---- admin
$('#adm').onclick=()=>{if(admin){admin=false;delete sessionStorage.admin}else if(prompt('Mật khẩu quản trị:')===ADMIN_PASS){admin=true;sessionStorage.admin='1'}else return alert('Sai mật khẩu');route()};
// ---- routing
const R={'':home,ebook,giaitri:()=>app.innerHTML='<div class=c style="text-align:center"><h2 style="color:var(--ink)">Giải trí</h2><p>Sắp ra mắt ❄</p></div>',thuvien:lib,read,viet:edit,bai:view};
async function route(){speechSynthesis.cancel();$('#adm').classList.toggle('on',admin);const[p,a]=location.hash.slice(2).split('/');await(R[p||'']||home)(a);scrollTo(0,0)}
addEventListener('hashchange',route);route();

// ---- ebook
async function shelf(){const b=await all('books'),p=prog();return b.length?`<div class=grid>${b.map(x=>{const v=Math.round((p[x.id]?.pct||0)*100);return `<a class=card href="#/read/${x.id}"><b>${esc(x.title)}</b><i>${x.type}</i><div class=bar><u style="width:${v}%"></u></div><small>Đã đọc ${v}%</small> <button data-del="${x.id}" style="float:right;border:0;background:none;cursor:pointer">🗑</button></a>`}).join('')}</div>`:'<p class=muted>Chưa có sách nào. Bấm “Tải sách lên”.</p>'}
async function home(){app.innerHTML=`<h2>Đang đọc</h2>${await shelf()}`;bindShelf()}
async function ebook(){app.innerHTML=`<div class=top><h2>Ebook</h2><label class=btn>＋ Tải sách lên<input type=file id=up accept=".epub,.docx,.txt,.mobi,.azw3" hidden multiple></label></div>${await shelf()}`;bindShelf();
 $('#up').onchange=async e=>{for(const f of e.target.files){try{const ch=await parse(f);await put('books',{id:uid(),title:f.name.replace(/\.\w+$/,''),type:f.name.split('.').pop().toUpperCase(),ch})}catch(x){alert(f.name+': '+x)}}ebook()}}
function bindShelf(){app.querySelectorAll('[data-del]').forEach(b=>b.onclick=async e=>{e.preventDefault();if(confirm('Xóa sách này?')){await del('books',b.dataset.del);route()}})}
async function parse(f){const n=f.name.toLowerCase(),buf=await f.arrayBuffer();
 if(n.endsWith('.epub'))return epub(buf);
 if(n.endsWith('.docx'))return split((await mammoth.convertToHtml({arrayBuffer:buf})).value);
 if(n.endsWith('.txt'))return split(new TextDecoder().decode(buf).split(/\n+/).map(l=>'<p>'+esc(l)+'</p>').join(''));
 throw 'MOBI/AZW3 chưa hỗ trợ trong bản này. Hãy đổi sang EPUB bằng Calibre rồi tải lên.'}
function split(h){const d=document.createElement('div');d.innerHTML=h;const o=[];let c='';[...d.children].forEach(e=>{if(/^H[12]$/.test(e.tagName)&&c){o.push(c);c=''}c+=e.outerHTML;if(c.length>20000){o.push(c);c=''}});if(c)o.push(c);return o.map((h,i)=>({t:'Phần '+(i+1),h}))}
async function epub(buf){const z=await JSZip.loadAsync(buf),rd=p=>z.file(decodeURIComponent(p))?.async('string'),P=s=>new DOMParser().parseFromString(s,'text/'+(s.startsWith('<?xml')||s.includes('<package')||s.includes('<container')?'xml':'html'));
 const op=P(await rd('META-INF/container.xml')).querySelector('rootfile').getAttribute('full-path'),dir=op.replace(/[^/]*$/,''),o=P(await rd(op)),m={};
 o.querySelectorAll('manifest item').forEach(i=>m[i.getAttribute('id')]=i.getAttribute('href'));const out=[];
 for(const r of o.querySelectorAll('spine itemref')){const h=await rd(dir+m[r.getAttribute('idref')]);if(!h)continue;const d=new DOMParser().parseFromString(h,'text/html');d.querySelectorAll('script,style,link,img,svg').forEach(e=>e.remove());const b=d.body.innerHTML.trim();if(b.replace(/<[^>]+>/g,'').trim().length>20)out.push({t:(d.querySelector('h1,h2,h3')?.textContent||'Phần '+(out.length+1)).trim().slice(0,60),h:b})}
 if(!out.length)throw 'Không đọc được nội dung (có thể sách bị DRM)';return out}

async function read(id){const b=await get('books',id);if(!b)return location.hash='#/ebook';let S=cfg(),ci=prog()[id]?.ch||0,speaking=0;
 app.innerHTML=`<div class=rd id=rd><div class=rbar><a href="#/ebook">←</a><b>${esc(b.title)}</b><button id=bt>🔊 Đọc</button><button id=bs>⚙</button></div>
 <div id=panel hidden><label>Font<select id=f>${fopt(S.font)}</select></label><label>Cỡ chữ <input type=range id=z min=14 max=34 value=${S.size}></label><label>Lề chữ (sát ↔ thụt) <input type=range id=p min=0 max=120 value=${S.pad}></label>
 <label>Màu nền<select id=bg>${[['#f6edd2','Vàng nhạt'],['#ffffff','Trắng'],['#e4efe0','Xanh dịu'],['#1d2330','Tối']].map(([v,n])=>`<option value="${v}" ${v==S.bg?'selected':''}>${n}</option>`)}</select></label>
 <label>Giọng đọc<select id=v><option value=f ${S.voice=='f'?'selected':''}>Nữ (miền Nam)</option><option value=m ${S.voice=='m'?'selected':''}>Nam (miền Nam)</option></select></label><label>Tốc độ <input type=range id=r min=.5 max=2 step=.1 value=${S.rate}></label></div>
 <article id=art></article><div class=nav><button class=btn id=pv>‹</button><select id=sel>${b.ch.map((c,i)=>`<option value=${i}>${i+1}. ${esc(c.t)}</option>`)}</select><button class=btn id=nx>›</button></div></div>`;
 const rd=$('#rd'),art=$('#art'),save=()=>{localStorage.cfg=JSON.stringify(S);rd.style.setProperty('--f',S.font);rd.style.setProperty('--sz',S.size+'px');rd.style.setProperty('--pad',S.pad+'px');rd.style.background=S.bg;rd.style.color=S.bg=='#1d2330'?'#e8e8e8':'#222'};
 const sc=()=>(scrollY)/Math.max(1,document.body.scrollHeight-innerHeight),rec=()=>setProg(id,{ch:ci,pct:Math.min(1,(ci+sc())/b.ch.length),y:sc()});
 const show=(i,y=0)=>{speechSynthesis.cancel();speaking=0;$('#bt').textContent='🔊 Đọc';ci=Math.max(0,Math.min(b.ch.length-1,i));art.innerHTML=b.ch[ci].h;$('#sel').value=ci;scrollTo(0,y*Math.max(1,document.body.scrollHeight-innerHeight));rec()};
 [['f','font'],['bg','bg'],['v','voice']].forEach(([e,k])=>$('#'+e).onchange=x=>{S[k]=x.target.value;save()});[['z','size'],['p','pad'],['r','rate']].forEach(([e,k])=>$('#'+e).oninput=x=>{S[k]=+x.target.value;save()});
 $('#bs').onclick=()=>$('#panel').hidden^=1;$('#pv').onclick=()=>show(ci-1);$('#nx').onclick=()=>show(ci+1);$('#sel').onchange=e=>show(+e.target.value);
 $('#bt').onclick=()=>{speechSynthesis.cancel();if(speaking){speaking=0;$('#bt').textContent='🔊 Đọc';return}speaking=1;$('#bt').textContent='⏹ Dừng';
  const vs=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('vi')),ml=/nam|male|minh/i,v=vs.find(x=>S.voice=='m'?ml.test(x.name):!ml.test(x.name))||vs[0];
  (art.innerText.match(/[^.!?\n]+[.!?]?/g)||[]).forEach(t=>{const u=new SpeechSynthesisUtterance(t);u.lang='vi-VN';if(v)u.voice=v;u.rate=S.rate;speechSynthesis.speak(u)})};
 let tm;onscroll=()=>{clearTimeout(tm);tm=setTimeout(()=>location.hash.startsWith('#/read')&&rec(),300)};
 save();show(ci,prog()[id]?.y||0)}

// ---- thư viện
const posts=async()=>{let r={posts:[],lists:[]};try{r=await(await fetch('data/posts.json?'+Date.now())).json()}catch{}const m=(a,b)=>Object.values(Object.fromEntries([...a,...b].map(x=>[x.id,x])));return{posts:m(r.posts,await all('posts')).sort((a,b)=>b.at-a.at),lists:m(r.lists,await all('lists'))}};
async function lib(){const{posts:P,lists:L}=await posts(),h=location.hash.split('?l=')[1]||'';const sh=h?P.filter(p=>p.list==h):P;
 app.innerHTML=`<div class=top><h2>Thư viện</h2>${admin?`<div><a class=btn href="#/viet/new">✎ Viết bài</a> <button class="btn g" id=nl>＋ Danh sách</button> <button class="btn g" id=ex>⬇ Xuất dữ liệu</button></div>`:''}</div>
 <div class=stats><div><b>${P.length}</b>bài viết</div><div><b>${L.length}</b>danh sách</div><div><b>${P.reduce((n,p)=>n+p.body.replace(/<[^>]+>/g,' ').split(/\s+/).length,0)}</b>từ</div></div>
 <div class=chips><a href="#/thuvien" class="${h?'':'on'}">Tất cả</a>${L.map(l=>`<a href="#/thuvien?l=${l.id}" class="${h==l.id?'on':''}">${esc(l.name)}</a>`).join('')}</div>
 ${sh.map(p=>`<a class=post href="#/bai/${p.id}"><b>${esc(p.title)}</b><br><small>${new Date(p.at).toLocaleDateString('vi')} · ${esc(L.find(l=>l.id==p.list)?.name||'Chưa phân loại')}</small></a>`).join('')||'<p class=muted>Chưa có bài viết.</p>'}`;
 if(admin){$('#nl').onclick=async()=>{const n=prompt('Tên danh sách:');if(n){await put('lists',{id:uid(),name:n});lib()}};
  $('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({posts:P,lists:L})],{type:'application/json'}));a.download='posts.json';a.click()}}}
async function view(id){const{posts:P,lists:L}=await posts(),p=P.find(x=>x.id==id);if(!p)return location.hash='#/thuvien';
 app.innerHTML=`<div class=post><div class=top><a href="#/thuvien">← Thư viện</a><select id=f>${fopt(localStorage.pf||'var(--f1)')}</select></div><h1 style="font-family:var(--f2)">${esc(p.title)}</h1><div class=body id=bd style="font-family:${localStorage.pf||'var(--f1)'}">${p.body}</div>
 ${admin?`<p><a class=btn href="#/viet/${p.id}">Sửa</a> <button class="btn g" id=dl>Xóa</button></p>`:''}</div>`;
 $('#f').onchange=e=>{localStorage.pf=e.target.value;$('#bd').style.fontFamily=e.target.value};if(admin)$('#dl').onclick=async()=>{if(confirm('Xóa bài?')){await del('posts',id);location.hash='#/thuvien'}}}
async function edit(id){if(!admin){alert('Chỉ quản trị viên');return location.hash='#/thuvien'}const{posts:P,lists:L}=await posts(),p=P.find(x=>x.id==id)||{id:uid(),title:'',body:'',list:'',at:Date.now()};
 app.innerHTML=`<div class=post><input type=text id=t placeholder="Tiêu đề" value="${esc(p.title)}"><select id=l><option value="">— Danh sách —</option>${L.map(l=>`<option value=${l.id} ${l.id==p.list?'selected':''}>${esc(l.name)}</option>`)}</select>
 <div class=tb><button data-c=bold><b>B</b></button><button data-c=italic><i>I</i></button><button data-c=underline><u>U</u></button><input type=color id=col value="#c0392b"><button id=cp>Chú thích</button><button id=tx>Văn bản</button><label>🖼 Ảnh<input type=file id=im accept="image/*" hidden></label></div>
 <div class=ed id=ed contenteditable style="font-family:var(--f1)">${p.body}</div><p><button class=btn id=sv>Lưu bài</button> <a class="btn g" href="#/thuvien">Hủy</a></p></div>`;
 const ed=$('#ed');app.querySelectorAll('[data-c]').forEach(b=>b.onmousedown=e=>{e.preventDefault();document.execCommand(b.dataset.c)});
 $('#col').oninput=e=>document.execCommand('foreColor',false,e.target.value);
 $('#cp').onmousedown=e=>{e.preventDefault();const s=getSelection().toString();if(s)document.execCommand('insertHTML',false,`<span class=cap>${esc(s)}</span>`)};
 $('#tx').onmousedown=e=>{e.preventDefault();document.execCommand('removeFormat')};
 $('#im').onchange=e=>{const f=e.target.files[0],i=new Image;i.onload=()=>{const k=Math.min(1,1000/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ed.focus();document.execCommand('insertImage',false,c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(f)};
 $('#sv').onclick=async()=>{await put('posts',{...p,title:$('#t').value||'Không tiêu đề',list:$('#l').value,body:ed.innerHTML});location.hash='#/bai/'+p.id}}

// ---- tuyết
(()=>{const c=$('#snow'),x=c.getContext('2d');let w,h,f=[];const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight};rs();addEventListener('resize',rs);
 for(let i=0;i<70;i++)f.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2.5+.8,s:Math.random()*.7+.3,d:Math.random()*6});
 (function L(){x.clearRect(0,0,w,h);x.fillStyle='#fff';x.globalAlpha=.85;f.forEach(a=>{a.y+=a.s;a.d+=.01;a.x+=Math.sin(a.d)*.4;if(a.y>h){a.y=-5;a.x=Math.random()*w}x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fill()});requestAnimationFrame(L)})()})();
