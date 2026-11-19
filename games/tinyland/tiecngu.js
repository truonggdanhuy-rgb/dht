/* ===================================================================================
   TIECNGU.JS — 🌙 MASCOT TIỆC NGỦ (Nam / Nữ) — vẽ ĐỒ HỌA CAO (K=4) theo bộ máy hdkit.js
   • Bán ở SHOP KIM CƯƠNG: 💎15 / mascot (đổi giá: sửa TCN_GIA bên dưới).
   • Nam : đồ ngủ caro XANH LÁ (áo cộc có cổ bẻ, túi ngực, 3 khuy + quần đùi), tóc đen mái bằng,
           MŨ NGỦ caro xanh lá viền kem + chóp dài rũ về một bên có cục bông trắng, dép gấu/ếch xanh.
   • Nữ  : váy ngủ caro HỒNG tay phồng viền ren, cổ bèo + nơ ngực, 2 nơ thêu ở gấu váy, tóc bob hồng,
           MŨ NGỦ caro hồng viền kem có cục bông, tất trắng + dép thỏ hồng.
   • Vẽ HD (mỗi ô game chia 4x4), dựng 1 lần rồi cache. Hỗ trợ đủ 4 hướng, đi bộ, ngồi, cưỡi thú / chổi / xe đạp
     (khi cưỡi: thú cưỡi tự vẽ chân màu da + dép), giơ tay (hành động), cầm phụ kiện, biểu cảm HD.
   • KHÔNG che mặt: khuôn mặt (mặc định + biểu cảm) do game vẽ, tóc mái ngắn nằm phía trên mắt.
   • Nạp CUỐI CÙNG trong index.html (sau hdkit.js, hdface.js). Tự đẩy vào CUỐI mảng SETS + danh sách Shop kim cương (DSETS).
   =================================================================================== */
(function(){
const TCN_GIA=15;
const flr=Math.floor,sin=Math.sin;

// ---------- màu ----------
const hex2=c=>[parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)];
const toHex=a=>'#'+a.map(v=>('0'+Math.max(0,Math.min(255,Math.round(v))).toString(16)).slice(-2)).join('');
const TC={};
function tone(c,l){const k=c+l;if(TC[k])return TC[k];const a=hex2(c);
 return TC[k]=toHex(l==3?a.map(v=>v+(255-v)*.28):l==2?a.map(v=>v+(255-v)*.1):l==1?a:[a[0]*.8,a[1]*.82,a[2]*.86])}
const GRN={l:'#f1f4e2',m:'#c4dbb4',d:'#98bf92'},PNK={l:'#fff2f5',m:'#fbcdd9',d:'#f3a3bb'};
const G=(P,ux,uy,lv,sz,ox,oy)=>{const i=flr((ux-ox)/sz),j=flr((uy-oy)/sz),a=i&1,b=j&1;return tone(a&&b?P.d:(a||b)?P.m:P.l,lv)};
const SK=['#d79a76','#e9b08c','#f6cfae','#ffe2c9'];
const CR=['#cfc6b0','#efe6d0','#fbf5e6','#ffffff'];                       // kem (viền mũ, ren)
const WT=['#c9cfd6','#e8ecf0','#f8fafc','#ffffff'];                       // bông trắng
const HB=['#0c0a10','#1b1822','#2e2a39','#4a4658'];                       // tóc đen
const HP=['#c47690','#dd93ab','#efa8bd','#fbc6d4'];                        // tóc hồng
const olGreen=c=>[c[0]*.36+4|0,c[1]*.5+8|0,c[2]*.38+6|0];
const olPink=c=>[c[0]*.62|0,c[1]*.36|0,c[2]*.45|0];
const olSkin=c=>[c[0]*.62|0,c[1]*.42|0,c[2]*.36|0];
const olCream=c=>[c[0]*.68|0,c[1]*.6|0,c[2]*.52|0];
const olHP=c=>[c[0]*.55|0,c[1]*.32|0,c[2]*.42|0];
const olBlk=c=>[c[0]*.5+16|0,c[1]*.5+14|0,c[2]*.55+22|0];

const h=HD({K:4,MX:12,MY:12,WU:44,HU:52});
const lvB=(ux,x0,x1,top)=>top?3:ux<x0?2:ux>x1?0:1;                           // mức sáng theo chiều ngang
const shadeFn=(pal)=>h.shade(pal);

// ---------- DÉP (gấu/ếch xanh – thỏ hồng) ----------
function slipper(x,y,fem,view,lift){
 const base=fem?'#fff3f6':'#f4f7ec',top=fem?'#f8cfdb':'#b9d4a8',eye='#2a2020',inn='#ffc0d0';
 y=y-lift;
 h.begin();
 if(view=='f'){
  if(fem){h.ell(x+.8,y-.9,.8,1.6,(ux,uy,dx)=>dx>.3?'#f2b8c8':'#fde0e8');h.ell(x+3.8,y-.9,.8,1.6,(ux,uy,dx)=>dx>.3?'#f2b8c8':'#fde0e8');
   h.ell(x+.8,y-.7,.32,.9,inn);h.ell(x+3.8,y-.7,.32,.9,inn)}
  else{h.ell(x+.4,y+.5,.95,.85,top);h.ell(x+4.2,y+.5,.95,.85,top)}
  h.rrect(x-.45,y+.3,5.5,3.2,1.5,(ux,uy,dx)=>uy<y+1?tone(top,2):uy>y+2.6?tone(base,0):ux>x+3.9?tone(base,1):tone(base,3));
  h.ell(x+1.35,y+1.7,.3,.3,eye);h.ell(x+3.45,y+1.7,.3,.3,eye);h.ell(x+2.4,y+2.2,.26,.2,'#c07a88');
 }else if(view=='b'){
  h.rrect(x-.45,y+.6,5.5,2.9,1.4,(ux,uy)=>uy>y+2.7?'#ffffff':uy<y+1.2?tone(top,3):ux>x+3.9?tone(top,0):tone(top,1));
 }else{ // nhìn ngang (hướng sang phải)
  if(fem){h.ell(x+3.6,y-.7,.85,1.6,(ux,uy,dx)=>dx>.3?'#f2b8c8':'#fde0e8');h.ell(x+3.6,y-.5,.3,.9,inn)}
  else h.ell(x+3.7,y+.4,1.0,.9,top);
  h.rrect(x-1.0,y+.5,6.6,3.0,1.5,(ux,uy)=>uy>y+2.7?tone(base,0):uy<y+1.1?tone(top,2):ux<x+.6?tone(top,1):tone(base,3));
  h.ell(x+4.5,y+1.6,.3,.3,eye);h.ell(x+5.2,y+2.1,.24,.2,'#c07a88');
 }
 h.end(2,olSkin);
}
// ---------- CHÂN ----------
function leg(x,lift,view,fem){
 h.begin();h.rrect(x,25.2,3.2,3.6-lift,.6,(ux)=>ux<x+1?SK[3]:ux>x+2.3?SK[1]:SK[2]);h.end(2,olSkin);
 if(fem){h.begin();h.rrect(x-.2,27.1-lift*.6,3.6,1.6-lift*.5,.5,(ux)=>ux>x+2.6?CR[1]:CR[3]);h.end(1,olCream)}
}

// ---------- THÂN ----------
function maleTorsoF(back){
 // quần đùi
 h.begin();h.rrect(5,23.0,10,3.9,1,(ux,uy)=>G(GRN,ux,uy,lvB(ux,6.6,13.4),1.25,5,23));
 h.rect(9.88,24.2,.26,2.7,tone(GRN.d,0));h.rect(5,26.35,10,.6,CR[2]);h.end(2,olGreen);
 // áo
 h.begin();h.rrect(4.4,14.4,11.2,9.8,1.7,(ux,uy)=>G(GRN,ux,uy,lvB(ux,6.2,13.8,uy<15.2),1.25,4.4,14.4));
 h.rect(4.4,23.6,11.2,.6,CR[2]);h.end(2,olGreen);
 if(!back){
  h.begin();h.rect(9.8,16.6,.4,7,CR[2]);                                  // nẹp áo
  [18.2,20.2,22.2].forEach(y=>{h.ell(10,y,.38,.38,CR[3])});
  h.rrect(12.1,17.6,2.5,2.4,.4,(ux,uy)=>uy<18.3?CR[3]:G(GRN,ux,uy,2,1.25,4.4,14.4));h.rect(12.1,17.6,2.5,.5,CR[2]);   // túi ngực
  h.end(1,olGreen);
  // cổ bẻ
  h.begin();h.poly([[6.4,14.2],[10,14.2],[10,19.4]],CR[2]);h.poly([[13.6,14.2],[10,14.2],[10,19.4]],(ux)=>CR[1]);
  h.poly([[6.4,14.2],[9.4,14.2],[9.8,17.6],[7.4,15.8]],CR[3]);h.poly([[13.6,14.2],[10.6,14.2],[10.2,17.6],[12.6,15.8]],CR[1]);h.end(1,olCream);
 }else{
  h.begin();h.rrect(6.4,14.0,7.2,2.2,1,(ux)=>ux<9?CR[3]:CR[1]);h.end(1,olCream);
 }
}
function maleTorsoS(){
 h.begin();h.rrect(5.4,23.0,8,3.9,1,(ux,uy)=>G(GRN,ux,uy,lvB(ux,6.6,12.4),1.25,5,23));h.rect(5.4,26.35,8,.6,CR[2]);h.end(2,olGreen);
 h.begin();h.rrect(5.8,14.4,7.6,9.8,1.7,(ux,uy)=>G(GRN,ux,uy,lvB(ux,7,12.2,uy<15.2),1.25,4.4,14.4));h.rect(5.8,23.6,7.6,.6,CR[2]);h.end(2,olGreen);
 h.begin();h.rect(12.4,15.2,.5,8,CR[2]);h.poly([[10.4,14.2],[13.8,14.2],[13.2,16.8],[11.4,15.4]],CR[3]);h.end(1,olCream);
}
function femDressF(back){
 h.begin();
 h.poly([[5,14.6],[15,14.6],[17.4,25.2],[2.6,25.2]],(ux,uy)=>G(PNK,ux,uy,lvB(ux,5.6,14.6,uy<15.4),1.25,2.6,14.6));
 h.rrect(5,14.4,10,2,1,(ux,uy)=>G(PNK,ux,uy,3,1.25,2.6,14.6));
 h.end(2,olPink);
 // ren viền gấu (vòng tròn nhỏ)
 h.begin();for(let x=3.3;x<=16.8;x+=1.45)h.ell(x,25.35,.78,.78,(ux,uy,dx,dy)=>dy>.35?CR[1]:CR[3]);h.rect(2.6,24.5,14.8,.9,CR[2]);h.end(1,olCream);
 if(!back){
  // cổ bèo + nơ ngực + nơ thêu ở gấu
  h.begin();h.ell(7.4,15.1,2.3,1.5,(ux,uy,dx,dy)=>dy>.2?CR[1]:CR[3]);h.ell(12.6,15.1,2.3,1.5,(ux,uy,dx,dy)=>dy>.2?CR[1]:CR[3]);h.end(1,olCream);
  const bow=(cx,cy,s)=>{h.begin();h.ell(cx-1.0*s,cy,1.1*s,.8*s,'#f08aaa');h.ell(cx+1.0*s,cy,1.1*s,.8*s,'#e0709a');h.ell(cx,cy,.45*s,.45*s,'#c94f7e');h.end(1,olPink)};
  bow(10,16.6,.9);
  h.begin();h.stroke(h.bez([9.6,17.2],[9,19],[8.4,20.4],[8.2,21.8]),.28,.2,()=>'#e0709a',1);h.stroke(h.bez([10.4,17.2],[11,19],[11.6,20.4],[11.8,21.8]),.28,.2,()=>'#e0709a',1);h.end(0);
  bow(6.2,22.4,.75);bow(13.8,22.4,.75);
 }else{
  h.begin();h.ell(10,15.0,4.4,1.4,(ux,uy,dx,dy)=>dy>.2?CR[1]:CR[3]);h.end(1,olCream);
  h.begin();h.stroke(h.bez([7.4,16.4],[10,18],[10,18],[12.6,16.4]),.35,.35,()=>'#e0709a',1);h.ell(10,18.0,1.2,.9,'#e0709a');h.end(1,olPink);
 }
}
function femDressS(){
 h.begin();h.poly([[6.4,14.6],[13.4,14.6],[16,25.2],[3.8,25.2]],(ux,uy)=>G(PNK,ux,uy,lvB(ux,6.8,13,uy<15.4),1.25,2.6,14.6));
 h.rrect(6.2,14.4,7.2,2,1,(ux,uy)=>G(PNK,ux,uy,3,1.25,2.6,14.6));h.end(2,olPink);
 h.begin();for(let x=4.5;x<=15.6;x+=1.45)h.ell(x,25.35,.78,.78,(ux,uy,dx,dy)=>dy>.35?CR[1]:CR[3]);h.rect(3.8,24.5,12.2,.9,CR[2]);h.end(1,olCream);
 h.begin();h.ell(10.4,15.1,2.4,1.4,(ux,uy,dx,dy)=>dy>.2?CR[1]:CR[3]);h.end(1,olCream);
 h.begin();h.ell(12.4,16.6,.9,.8,'#e0709a');h.ell(10.6,16.6,.9,.8,'#f08aaa');h.end(1,olPink);
 h.begin();h.ell(12.6,22.4,.9,.7,'#f08aaa');h.ell(11.2,22.4,.9,.7,'#e0709a');h.ell(11.9,22.4,.4,.4,'#c94f7e');h.end(1,olPink);
}

// ---------- TAY ----------
// x = mép trái ống tay, ay = nhún khi bước, hi = nhấc tay (aup)
function hand(cx,cy){h.begin();h.ell(cx,cy,1.4,1.3,(ux,uy,dx)=>dx>.35?SK[1]:SK[2]);h.end(2,olSkin)}
function armF(x,ay,hi,fem){
 if(hi!=null){
  const ty=17-hi;
  hand(x+1.85,ty+1.3);
  h.begin();h.rrect(x+.5,ty+2.0,2.7,3.6,.9,(ux)=>ux<x+1.4?SK[3]:ux>x+2.5?SK[1]:SK[2]);h.end(2,olSkin);
  sleeve(x,ty+4.6,fem,true);
  return}
 h.begin();h.rrect(x+.45,17.4+ay,2.8,5.3,.9,(ux)=>ux<x+1.4?SK[3]:ux>x+2.5?SK[1]:SK[2]);h.end(2,olSkin);
 hand(x+1.85,23.0+ay);
 sleeve(x,14.9+ay,fem,false);
}
function sleeve(x,y,fem,up){
 const P=fem?PNK:GRN,ol=fem?olPink:olGreen;
 if(fem){
  h.begin();h.ell(x+1.85,y+1.6,2.3,2.0,(ux,uy,dx,dy)=>G(P,ux,uy,dx>.45?0:dy<-.4?3:1,1.25,x,y));h.end(2,ol);
  h.begin();h.rrect(x-.2,y+3.0,4.1,.9,.4,(ux,uy)=>CR[ux>x+2.6?1:3]);h.end(1,olCream);
 }else{
  h.begin();h.rrect(x-.2,y,4.1,3.5,1.2,(ux,uy)=>G(P,ux,uy,ux<x+.8?2:ux>x+2.9?0:1,1.25,x,y));h.rect(x-.2,y+2.9,4.1,.6,CR[2]);h.end(2,ol)}
}
function armS(x,ay,fem){
 h.begin();h.rrect(x+.5,17.4+ay,2.8,5.3,.9,(ux)=>ux<x+1.4?SK[3]:ux>x+2.5?SK[1]:SK[2]);h.end(2,olSkin);
 hand(x+1.9,23.0+ay);
 const P=fem?PNK:GRN;
 if(fem){h.begin();h.ell(x+1.85,15.2+ay+1.6,2.2,2.0,(ux,uy,dx,dy)=>G(P,ux,uy,dx>.45?0:dy<-.4?3:1,1.25,x,15));h.end(2,olPink);h.begin();h.rrect(x-.2,18.1+ay,4.1,.9,.4,CR[2]);h.end(1,olCream)}
 else sleeve(x,14.9+ay,false,false);
}

// ---------- ĐẦU (da) + CỔ ----------
function headSkin(view,fem){
 h.begin();h.rect(8.6,13.6,2.8,2.0,SK[1]);h.end(1,olSkin);
 h.begin();
 if(view=='s')h.ell(9.6,9.4,5.9,5.3,(ux,uy,dx,dy)=>dx<-.55?SK[1]:dy>.72?SK[1]:dx>.5&&dy<-.3?SK[3]:SK[2]);
 else h.ell(10,9.4,6.8,5.3,(ux,uy,dx,dy)=>dx>.62||dy>.72?SK[1]:dx<-.45&&dy<-.35?SK[3]:SK[2]);
 h.end(2,olSkin);
}

function buildBody(st){
 h.newFrame();
 const side=st.view=='s',back=st.view=='b',lg=st.lg,sit=st.sit,fem=st.fem;
 // chân
 if(!st.rd){
  const L=(x,l,v)=>{leg(x,l,v,fem);slipper(x-.8,27.7,fem,v,l)};
  if(sit||(!side&&lg==0)){L(5.4,0,back?'b':'f');L(11.4,0,back?'b':'f')}
  else if(!side){if(lg>0){L(11.4,0,back?'b':'f');L(5.4,1,back?'b':'f')}else{L(5.4,0,back?'b':'f');L(11.4,1,back?'b':'f')}}
  else{const s=lg*2;L(8-s-.5,lg>0?1:0,'s');L(8+s-.5,lg<0?1:0,'s')}
 }
 if(side){
  (fem?femDressS:maleTorsoS)();
  if(!st.noarm)armS(8.2-lg,lg,fem);
 }else{
  (fem?femDressF:maleTorsoF)(back);
  armF(1.7,lg,st.aupL,fem);armF(15.0,-lg,st.aupR,fem);
 }
 headSkin(st.view,fem);
 return h.frame();
}

// ---------- TÓC + MŨ NGỦ (lớp trên, vẽ sau khuôn mặt) ----------
const lock=(a,b,c,d,r0,r1,pal,pw)=>h.stroke(h.bez(a,b,c,d),r0,r1,h.shade(pal),pw||1);
const lockM=(a,b,c,d,r0,r1,pal,pw)=>{lock(a,b,c,d,r0,r1,pal,pw);lock(h.mirP(a),h.mirP(b),h.mirP(c),h.mirP(d),r0,r1,pal,pw)};
const mass=(cx,cy,rx,ry,pal)=>h.ell(cx,cy,rx,ry,(ux,uy,dx,dy)=>pal[dy<-.5?3:dy>.55?0:(dx<-.4&&dy<0)?2:1]);

function hairHat(st){
 h.newFrame();
 const side=st.view=='s',back=st.view=='b',fem=st.fem,HC=fem?HP:HB,olH=fem?olHP:olBlk,P=fem?PNK:GRN,olP=fem?olPink:olGreen;
 // ---- TÓC ----
 h.begin();
 if(!side&&!back){
  mass(10,5.8,7.6,3.8,HC);
  if(fem){
   lockM([4.2,6],[3.2,9],[3.0,12],[3.2,15.0],1.6,1.1,HC,.9);
   lockM([3.8,13.4],[3.2,14.8],[2.2,15.6],[1.4,15.0],1.0,.3,HC,1);
  }else{
   lockM([4.0,6],[3.4,8.4],[3.4,10.6],[3.9,12.4],1.5,.7,HC,.9);
  }
  h.end(1,olH);
  [[7.0,6],[8.6,6],[10.2,6],[11.8,6],[13.2,6]].forEach((q,i)=>{h.begin();lock([q[0]+(i-2)*.2,5.8],[q[0]+(i-2)*.35,7.2],[q[0]+(i-2)*.2,8.4],[q[0]+(i-2)*.4,8.9+(i%2?.35:0)],1.15,.25,HC,.9);h.end(1,olH)});
 }else if(back){
  if(fem){
   mass(10,8.4,7.8,5.6,HC);h.rrect(2.6,9,14.8,7.4,3,(ux,uy)=>uy<10.4?HC[2]:ux<5.2?HC[2]:ux>14.8?HC[0]:uy>15.2?HC[0]:HC[1]);
   h.ell(3.2,16.0,1.4,.9,HC[1]);h.ell(16.8,16.0,1.4,.9,HC[0]);
   h.end(1,olH);
   h.begin();h.stroke(h.bez([10,10.4],[9.8,12.4],[10.2,14.4],[10,15.8]),.22,.14,()=>HC[0],1);h.stroke(h.bez([6.6,10.2],[6.2,12.4],[6.6,14.2],[6.4,15.6]),.2,.12,()=>HC[0],1);h.stroke(h.bez([13.4,10.2],[13.8,12.4],[13.4,14.2],[13.6,15.6]),.2,.12,()=>HC[0],1);h.end(0);
  }else{
   mass(10,8.4,7.4,6.0,HC);h.rrect(4.4,10,11.2,4.4,2,(ux,uy)=>uy>13?HC[0]:ux<7?HC[2]:HC[1]);
   h.end(1,olH);
   h.begin();lock([10,6.5],[9.6,9],[9.8,11.4],[10.1,13.4],.4,.14,HC.slice().reverse(),1);lock([7.2,7.4],[6.6,9.4],[6.8,11.6],[7.4,13],.4,.14,HC.slice().reverse(),1);lock([12.8,7.4],[13.4,9.4],[13.2,11.6],[12.7,13],.4,.14,HC.slice().reverse(),1);h.end(0);
  }
 }else{ // nhìn ngang (hướng phải)
  mass(9.2,5.8,6.4,3.8,HC);
  if(fem){h.rrect(2.2,6.4,7.4,10,2.6,(ux,uy)=>uy<8?HC[2]:ux<4?HC[2]:ux>8?HC[0]:HC[1]);h.ell(2.6,16.0,1.4,.9,HC[1]);lock([8.6,8],[8.2,11],[8.6,14],[9.4,15.6],1.2,.5,HC,.9)}
  else{mass(5.6,9.2,3.7,4.4,HC);lock([8.4,7.6],[8.0,10],[8.2,12],[8.8,13],1.1,.4,HC,.9)}
  h.end(1,olH);
  [[10.6,5.8,11.6,8.8],[12.0,5.6,13.0,8.6],[9.2,5.8,9.8,8.6]].forEach((q,i)=>{h.begin();lock([q[0],q[1]],[q[0]+.2,q[1]+1.2],[q[2]-.3,q[3]-.8],[q[2],q[3]+(i==1?.2:0)],1.1,.25,HC,.9);h.end(1,olH)});
 }
 // ---- MŨ NGỦ ----
 const cap=(cx,cy,rx,ry,a,b,c,d)=>{h.begin();
  const dl=(ux,uy)=>{const dx=(ux-cx)/rx,dy=(uy-cy)/ry;return dy<-.55?3:dx>.55||dy>.7?0:dx<-.4?2:1};
  h.ell(cx,cy,rx,ry,(ux,uy)=>G(P,ux,uy,dl(ux,uy),1.3,0,0));
  h.stroke(h.bez(a,b,c,d),2.9,1.1,(ux,uy,t,sx,sy,r)=>{const dd=((ux-sx)*-.55+(uy-sy)*-.8)/r;return G(P,ux,uy,t<.62?dl(ux,uy):dd>.58?3:dd>.02?2:dd>-.5?1:0,1.3,0,0)},1);
  h.end(2,olP)};
 const band=(a,b,c,d)=>{h.begin();h.stroke(h.bez(a,b,c,d),1.3,1.15,h.shade(CR),1);h.end(2,olCream)};
 const pom=(cx,cy)=>{h.begin();h.ell(cx,cy,2.1,2.0,(ux,uy,dx,dy)=>WT[dy<-.35&&dx<.1?3:(dx>.45||dy>.5)?0:dx>.1?1:2]);h.end(2,olCream)};
 if(!side){
  cap(9.6,3.9,6.1,3.4,[11.2,1.9],[16,0.9],[19.4,3.6],[19.0,8.0]);
  band([2.8,5.0],[6.5,5.4],[12,6.2],[16.6,7.4]);
  pom(19.1,9.6);
 }else{
  cap(8.8,3.9,5.6,3.3,[7.8,1.8],[3.6,0.8],[0.2,3.5],[0.7,8.2]);
  band([14.6,5.2],[10.5,5.8],[6,6.8],[2.6,8.0]);
  pom(.6,9.4);
 }
 return h.frame();
}

// ---------- cache + vẽ xuống canvas game ----------
const flipD=D=>{const W=h.W,H=h.H;for(let y=0;y<H;y++)for(let x=0;x<W>>1;x++){const a=(y*W+x)*4,b=(y*W+(W-1-x))*4;for(let k=0;k<4;k++){const t=D[a+k];D[a+k]=D[b+k];D[b+k]=t}}return D};
const CB={},CT={};
const getBody=st=>{const key=[st.fem?1:0,st.view,st.flip?1:0,st.lg,st.sit?1:0,st.rd?1:0,st.noarm?1:0,st.aupL,st.aupR].join('|');
 let c=CB[key];if(!c){let D=buildBody(st);if(st.flip)D=flipD(D);c=CB[key]=h.toCanvas(D)}return c};
const getTop=st=>{const key=[st.fem?1:0,st.view,st.flip?1:0].join('|');
 let c=CT[key];if(!c){let D=hairHat(st);if(st.flip)D=flipD(D);c=CT[key]=h.toCanvas(D)}return c};
const bobOf=o=>{if(o.nobob)return 0;const f=o.mv?Math.floor(o.a*9)%4:0;return o.mv?((f==1||f==3)?-1:0):0};
window.__TCN={buildBody,hairHat,h};

if(typeof SETS==='undefined'||typeof MASCOT_DRAW==='undefined')return;

// ---------- 1) khai báo dữ liệu (chỉ thêm 1 lần, luôn ở CUỐI mảng SETS) ----------
if(!SETS.some(s=>s.k=='tcnm'))SETS.push({n:'Tiệc ngủ (Nam)',k:'tcnm',mascot:'tiecngu',tcn:'m',wide:1,ach:1,dia:TCN_GIA,
 ds:'Đồ ngủ caro xanh lá (áo cộc có túi ngực + quần đùi), mũ ngủ caro viền kem có cục bông trắng, tóc đen mái bằng, dép gấu xanh. Không che mặt.',
 sh:'#c4dbb4',pt:'#f6cfae',rpt:'#f6cfae',shoe:'#c4dbb4',scarf:'#c4dbb4'});
if(!SETS.some(s=>s.k=='tcnf'))SETS.push({n:'Tiệc ngủ (Nữ)',k:'tcnf',mascot:'tiecngu',tcn:'f',wide:1,ach:1,dia:TCN_GIA,
 ds:'Váy ngủ caro hồng tay phồng viền ren, nơ ngực + nơ thêu ở gấu, mũ ngủ caro hồng có cục bông, tóc bob hồng, tất trắng + dép thỏ. Không che mặt.',
 sh:'#fbcdd9',pt:'#f6cfae',rpt:'#f6cfae',shoe:'#f8cfdb',scarf:'#fbcdd9'});
try{if(typeof DSETS!=='undefined'){['tcnm','tcnf'].forEach(k=>{if(!DSETS.includes(k))DSETS.push(k)})}}catch(e){}

// ---------- 2) lấy canvas game của nhân vật đang vẽ (bọc drawAv, không sửa index.html) ----------
const TX={g:null,ox:0,oy:0};
if(typeof window.drawAv==='function'&&!window.drawAv.__tcn){
 const old=window.drawAv;
 window.drawAv=function(g,ox,oy,o){
  const pg=TX.g,px=TX.ox,py=TX.oy;TX.g=g;TX.ox=ox;TX.oy=oy;
  try{return old.apply(this,arguments)}finally{TX.g=pg;TX.ox=px;TX.oy=py}};
 window.drawAv.__tcn=1;
 // giữ cờ của các lớp bọc trước đó
 ['__bb'].forEach(k=>{if(old[k])window.drawAv[k]=old[k]});
}

// ---------- 3) hàm vẽ mascot (đăng ký MASCOT_DRAW) ----------
MASCOT_DRAW.tiecngu=function(r,u,o,S,k){
 const {side,Rt,back,sit,rd,lg}=k,g=TX.g;
 if(!sit&&!rd&&!o.nosh&&typeof E=='function')E(r,'rgba(0,0,0,.2)',10,30,S.tcn=='f'?8:7,2);
 if(!g)return;
 const st={fem:S.tcn=='f',view:side?'s':back?'b':'f',flip:side&&!Rt,lg:lg>0?1:lg<0?-1:0,sit:!!sit,rd:!!rd,noarm:!!(o.noarm&&side),
  aupL:o.aup&&o.aup[0]!=null?o.aup[0]:null,aupR:o.aup&&o.aup[1]!=null?o.aup[1]:null};
 const by=TX.oy+bobOf(o);
 h.drawTo(g,getBody(st),TX.ox,by);
 // khuôn mặt do game vẽ (mặc định hoặc biểu cảm), nằm giữa da đầu và tóc/mũ
 if(!back){if(o.e>0)faceFx(u,o.e,side?1:0,side?Rt:0);else faceDef(u,side?1:0,side?Rt:0)}
 h.drawTo(g,getTop(st),TX.ox,by);
};
})();
