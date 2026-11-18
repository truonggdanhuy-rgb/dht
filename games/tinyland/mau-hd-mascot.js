/* MẪU MASCOT HD (nhìn trước) — copy file này làm điểm xuất phát cho set mới. Cần hdkit.js nạp TRƯỚC.
   Quy trình: begin() -> vẽ bộ phận -> end(2). Bộ phận vẽ sau đè lên bộ phận vẽ trước. */
(function(){
const h=HD({K:4,MX:12,MY:12,WU:44,HU:52});
const PAL={body:['#5a3a8a','#7c58b8','#a584d8','#d2bcf4'],ear:['#8a2a50','#c64a7c','#ef7aa4','#ffc0d6'],skin:'#f6c6a2'};
function build(){
 h.newFrame();
 // thân (tô bóng 4 mức theo hướng ánh sáng trên-trái)
 h.begin();h.rrect(5,14,10,11,1.8,(ux)=>ux<6.2?PAL.body[2]:ux>13.5?PAL.body[0]:PAL.body[1]);h.end(2);
 // 2 tai cong: stroke = nét cong có độ dày đổi từ r0 -> r1 (gốc to, đầu nhỏ)
 h.begin();
 h.stroke(h.bez([6,5],[3,1],[3,-4],[6,-6]),2.0,.4,h.shade(PAL.ear),.9);
 h.stroke(h.mirB([6,5],[3,1],[3,-4],[6,-6]),2.0,.4,h.shade(PAL.ear),.9);
 h.end(2);
 // đầu
 h.begin();h.ell(10,9.8,6.9,5.2,(ux,uy,dx,dy)=>dx>.55?'#e3a47e':'#f6c6a2');h.end(2);
 // mắt
 h.begin();h.ell(7,10.5,1.5,1.8,'#2a1a3a');h.ell(13,10.5,1.5,1.8,'#2a1a3a');h.ell(6.6,9.9,.5,.5,'#ffffff');h.ell(12.6,9.9,.5,.5,'#ffffff');h.end(1);
 return h.frame();
}
window.MauHD={build,h};
})();
