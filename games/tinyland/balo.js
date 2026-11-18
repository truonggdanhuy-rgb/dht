/* ===================================================================================
   BALO.JS — 🎒 3 BALO (phụ kiện đeo sau lưng, hoạt động giống CÁNH):
     • Balo Ong mật  (bagbee)     • Balo Thỏ hồng (bagbunny)     • Balo Cánh cụt (bagpeng)
   • Cùng kiểu, cùng cỡ (12 x 10 px), chỉ khác màu + hình mặt/túi.
   • Giống cánh: nhìn SAU / nhìn NGANG balo vẽ ĐÈ LÊN tóc (tóc dài cũng không che được balo);
     nhìn TRƯỚC thấy 2 quai đeo vai + mép balo ló ra sau lưng.
   • Chỉ đeo được 1 phụ kiện / lần (cầm tay, cánh, balo...). Tự ẩn khi cưỡi thú / ngồi nghỉ — như cánh.
   • Khai báo món: 3 dòng CUỐI mảng ACCS trong index.html (t:'wing', bag:'bee'|'bunny'|'peng').
   • Giá 2000 Xu / cái: pho-map.js → SHOP.a.pr (3 phần tử cuối).
   • Muốn thêm balo mới: thêm 1 bảng màu vào PAL + 1 nhánh trong hàm face() + 1 dòng cuối ACCS.
   Quy ước vẽ: R(màu,x,y,w,h) theo lưới nhân vật 20 px (thân x 5..14, y 16..24).
   =================================================================================== */
(function(){
// ---------- bảng màu ----------
const PAL={
 bee:  {body:'#ffc83a',hi:'#ffe58a',lo:'#e09a1a',strap:'#c27a10',stripe:'#8a5a14',eye:'#3a2410',cheek:'#ff9a80',line:'#2a2a2a'},
 bunny:{body:'#ff8eae',hi:'#ffb9d0',lo:'#e0608a',strap:'#d4547e',pocket:'#ffffff',pocketLo:'#e6dce4',earIn:'#ffd3e0',eye:'#3a2a30',nose:'#ff7aa0',cheek:'#ffb0c4'},
 peng: {body:'#202c4e',hi:'#35477c',lo:'#131b33',strap:'#131b33',pocket:'#ffd23a',pocketLo:'#e3a51c',eyeW:'#ffffff',eye:'#101010',beak:'#ff9a1a',zip:'#7a5a10'}
};
const bagOf=o=>{if(typeof ACCS=='undefined')return null;const i=wgIx(o);if(!(i>=0))return null;const A=ACCS[i];return A&&A.bag?A:null};
const bobOf=o=>{const f=o.mv?Math.floor(o.a*9)%4:0;return o.nobob?0:o.mv?((f==1||f==3)?-1:0):0};

// ---------- hình dáng thân balo (nhìn sau): 12 cột x 10 hàng, bo góc ----------
const BX=4,BY=16;
const SP=[[2,9],[1,10],[0,11],[0,11],[0,11],[0,11],[0,11],[0,11],[1,10],[2,9]];
function body(R,P){
 SP.forEach(([a,b],i)=>{R(P.body,BX+a,BY+i,b-a+1,1);
  if(i>0&&i<9){R(P.hi,BX+a,BY+i,1,1);R(P.lo,BX+b,BY+i,1,1)}});
 R(P.lo,BX+2,BY+9,8,1)}                                       // đáy tối
// phần trang trí (mặt balo — phía NGOÀI lưng, thấy được khi nhìn từ sau)
function face(R,P,kind){
 if(kind=='bee'){
  [6,8].forEach(i=>{const[a,b]=SP[i];R(P.stripe,BX+a,BY+i,b-a+1,1)});      // 2 sọc nâu
  R(P.eye,BX+3,BY+2,1,1);R(P.eye,BX+8,BY+2,1,1);                          // mắt
  R(P.cheek,BX+2,BY+4,1,1);R(P.cheek,BX+9,BY+4,1,1);                      // má hồng
  R(P.eye,BX+4,BY+3,1,1);R(P.eye,BX+5,BY+4,2,1);R(P.eye,BX+7,BY+3,1,1);   // miệng cười
  for(const x of[3,8]){R(P.line,BX+x,BY-2,1,2);R(P.line,BX+x-1,BY-4,2,2)}  // 2 râu ong
 }else if(kind=='bunny'){
  for(const x of[3,7]){R(P.body,BX+x,BY-3,2,3);R(P.lo,BX+x+(x<5?0:1),BY-3,1,3);R(P.earIn,BX+(x<5?x+1:x),BY-2,1,2)}   // 2 tai thỏ
  R(P.pocket,BX+2,BY+4,8,4);R(P.pocket,BX+3,BY+8,6,1);R(P.pocketLo,BX+3,BY+8,6,1);
  R(P.eye,BX+4,BY+5,1,1);R(P.eye,BX+7,BY+5,1,1);                          // mắt
  R(P.nose,BX+5,BY+6,2,1);R(P.cheek,BX+3,BY+6,1,1);R(P.cheek,BX+8,BY+6,1,1)
 }else{
  R(P.lo,BX+4,BY-2,4,1);R(P.lo,BX+4,BY-1,1,1);R(P.lo,BX+7,BY-1,1,1);      // quai xách
  R(P.eyeW,BX+3,BY+2,2,2);R(P.eyeW,BX+7,BY+2,2,2);                        // mắt trắng
  R(P.eye,BX+4,BY+3,1,1);R(P.eye,BX+7,BY+3,1,1);
  R(P.beak,BX+5,BY+4,2,1);                                                // mỏ cam
  R(P.pocket,BX+2,BY+5,8,3);R(P.pocket,BX+3,BY+8,6,1);R(P.pocketLo,BX+3,BY+8,6,1);
  R(P.zip,BX+5,BY+5,1,3)}                                                 // khóa kéo
}
function backView(R,P,kind){body(R,P);face(R,P,kind)}

// ---------- nhìn NGANG (balo ngay sau lưng, dày 5 px) ----------
function sideView(R,P,kind,Rt){
 const X=d=>Rt?3+d:17-d,H=(col,d0,d1,y,h)=>R(col,Math.min(X(d0),X(d1)),y,Math.abs(d1-d0)+1,h||1);
 for(let i=0;i<10;i++){const d0=(i==0||i==9)?1:0;H(P.body,d0,4,16+i);H(P.hi,d0,d0,16+i);H(P.lo,4,4,16+i)}
 H(P.lo,1,4,25);
 if(kind=='bee'){H(P.stripe,0,4,22);H(P.stripe,0,4,24);H(P.line,1,1,13,2);H(P.line,0,1,11,2)}
 else if(kind=='bunny'){H(P.body,1,2,13,3);H(P.earIn,1,1,14,2);H(P.pocket,0,1,20,4)}
 else{H(P.lo,2,3,15);H(P.pocket,0,1,21,4);H(P.pocketLo,0,1,24)}
 R(P.strap,Rt?8:12,16,1,6)}                                                // quai vai bên gần

// ---------- nhìn TRƯỚC: phần balo ló ra sau lưng (vẽ trước thân) + 2 quai (vẽ sau thân) ----------
function backPeek(R,P){SP.forEach(([a,b],i)=>{if(i>1&&i<9){R(P.body,BX+a,BY+i,2,1);R(P.lo,BX+b-1,BY+i,2,1)}});R(P.lo,BX+3,BY+9,6,1)}
function frontStraps(R,P){R(P.strap,6,16,2,6);R(P.strap,12,16,2,6);R(P.hi,6,16,1,6);R(P.hi,12,16,1,6)}

// ---------- móc vào hệ cánh có sẵn (newitems.js): balo đi qua đúng đường vẽ của cánh ----------
const oldBack=window.WingBack,oldFront=window.WingFront;
window.WingBack=function(r,o,k){
 const A=bagOf(o);if(!A)return oldBack&&oldBack(r,o,k);
 if(k.rd||k.sit||o.ride)return;
 const bob=bobOf(o),R=(c,x,y,w,h)=>r(c,x,y+bob,w,h);
 if(!k.side&&!k.back)backPeek(R,PAL[A.bag])};
window.WingFront=function(r,o,c){
 const A=bagOf(o);if(!A)return oldFront&&oldFront(r,o,c);
 if(o.ride||o.sit==2)return;
 const bob=bobOf(o),R=(col,x,y,w,h)=>r(col,x,y+bob,w,h),P=PAL[A.bag];
 if(c.back)backView(R,P,A.bag);else if(c.side)sideView(R,P,A.bag,c.Rt);else frontStraps(R,P)};
window.BALO_PAL=PAL;
})();
