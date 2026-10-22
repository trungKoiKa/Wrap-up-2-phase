// Mô phỏng tương tác cho từng buổi. Mỗi mục: { title, intro, tries[], build(ui) }.
// ui: { controls, fig, out, slider(opts, cb), select(label, options, value, cb), button(label, cb), svg(w, h) }
var NS = 'http://www.w3.org/2000/svg';
function S(tag, attrs, parent) {
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function T(parent, x, y, text, attrs) {
  var e = S('text', Object.assign({ x: x, y: y, class: 'sv-t' }, attrs || {}), parent);
  e.textContent = text;
  return e;
}
function vn(x, d) { return Number(x).toFixed(d === undefined ? 2 : d).replace('.', ','); }
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function out(ui, items) {
  ui.out.innerHTML = items.map(function (it) {
    return '<div class="ro' + (it[2] ? ' ro-' + it[2] : '') + (String(it[1]).length > 34 ? ' ro-wide' : '') + '"><span>' + it[0] + '</span><b>' + it[1] + '</b></div>';
  }).join('');
}
function axes(svg, box, xt, yt) {
  S('line', { x1: box.l, y1: box.b, x2: box.r, y2: box.b, class: 'sv-ax' }, svg);
  S('line', { x1: box.l, y1: box.t, x2: box.l, y2: box.b, class: 'sv-ax' }, svg);
  xt.forEach(function (t) { S('line', { x1: t[0], y1: box.b, x2: t[0], y2: box.b + 4, class: 'sv-ax' }, svg); T(svg, t[0], box.b + 16, t[1], { 'text-anchor': 'middle' }); });
  yt.forEach(function (t) { S('line', { x1: box.l - 4, y1: t[0], x2: box.r, y2: t[0], class: 'sv-grid' }, svg); T(svg, box.l - 7, t[0] + 4, t[1], { 'text-anchor': 'end' }); });
}

/** @type {Record<string, import('../data/lessons/types').SimSpec>} */
export const SIMS = {};

// Day 16 · Hạ gradient
SIMS.day16 = {
  title: 'Thả quả bóng xuống dốc',
  intro: 'Hàm mất mát f(x) = (x − 3)², cực tiểu tại x = 3. Mỗi bước, quả bóng đi ngược độ dốc một đoạn dài η × đạo hàm. Bắt đầu ở x = 0.',
  tries: ['Giữ η = 0,2 rồi bấm "Bước tiếp" vài lần: bước ngắn dần khi gần đáy.', 'Kéo η lên 0,45: xuống đáy rất nhanh.', 'Kéo η lên 0,9: bóng nhảy qua lại hai bên đáy.', 'Kéo η lên 1,05: bóng văng ra xa dần, tức là phân kỳ.'],
  build: function (ui) {
    var eta = 0.2, xs = [0];
    var s = ui.slider({ label: 'Tốc độ học η', min: 0.02, max: 1.1, step: 0.01, value: eta, fmt: function (v) { return vn(v); } }, function (v) { eta = v; xs = [0]; draw(); });
    ui.button('Bước tiếp', function () { step(1); });
    ui.button('Chạy 10 bước', function () { step(10); });
    ui.button('Làm lại', function () { xs = [0]; draw(); });
    void s;
    function step(n) { for (var i = 0; i < n; i++) { var x = xs[xs.length - 1]; xs.push(x - eta * 2 * (x - 3)); } draw(); }
    var W = 560, H = 260, box = { l: 44, r: 544, t: 12, b: 226 };
    var X = function (x) { return box.l + (x + 3) / 12 * (box.r - box.l); };
    var Y = function (y) { return box.b - Math.min(y, 40) / 40 * (box.b - box.t); };
    function draw() {
      var svg = ui.svg(W, H);
      axes(svg, box, [-2, 0, 3, 6, 8].map(function (v) { return [X(v), String(v)]; }), [0, 20, 40].map(function (v) { return [Y(v), String(v)]; }));
      var d = ''; for (var x = -3; x <= 9.001; x += 0.1) d += (d ? 'L' : 'M') + X(x) + ' ' + Y((x - 3) * (x - 3));
      S('path', { d: d, class: 'sv-curve' }, svg);
      S('line', { x1: X(3), y1: box.t, x2: X(3), y2: box.b, class: 'sv-dash' }, svg);
      T(svg, X(3) + 4, box.t + 12, 'cực tiểu');
      var pts = xs.filter(function (x) { return x > -3 && x < 9; });
      for (var i = 1; i < xs.length; i++) {
        var a = xs[i - 1], b = xs[i];
        if (a < -3 || a > 9 || b < -3 || b > 9) continue;
        S('line', { x1: X(a), y1: Y((a - 3) * (a - 3)), x2: X(b), y2: Y((b - 3) * (b - 3)), class: 'sv-step' }, svg);
      }
      pts.forEach(function (x, i) { S('circle', { cx: X(x), cy: Y((x - 3) * (x - 3)), r: i === pts.length - 1 ? 7 : 3.5, class: i === pts.length - 1 ? 'sv-ball' : 'sv-dot' }, svg); });
      var x = xs[xs.length - 1], f = 1 - 2 * eta;
      var state = Math.abs(f) >= 1 ? ['Phân kỳ: càng lúc càng xa', 'bad'] : f < 0 ? ['Hội tụ nhưng dao động hai bên', 'warn'] : ['Hội tụ đều về đáy', 'ok'];
      if (x < -3 || x > 9) state = ['Bóng đã văng khỏi khung hình', 'bad'];
      out(ui, [['Số bước', String(xs.length - 1)], ['Vị trí x', Math.abs(x) > 1e4 ? 'rất lớn' : vn(x, 3)], ['Mất mát f(x)', Math.abs(x) > 1e4 ? 'rất lớn' : vn((x - 3) * (x - 3), 3)], ['Khoảng cách tới đáy nhân với', vn(f) + ' mỗi bước'], ['Trạng thái', state[0], state[1]]]);
    }
    draw();
  },
};

// Day 17 · Tích chập
SIMS.day17 = {
  title: 'Bộ lọc 3×3 trượt trên ảnh 5×5',
  intro: 'Đây là đúng ví dụ trong slide. Bấm vào một ô ở lưới kết quả (bên phải) để xem cửa sổ 3×3 tương ứng trên ảnh và phép tính ra con số đó.',
  tries: ['Chọn bộ lọc "Cạnh dọc": ô có số âm lớn là chỗ ảnh sáng dần từ trái sang phải.', 'Đổi sang "Cạnh ngang" và so sánh các ô.', 'Chọn "Làm mờ": mỗi ô là trung bình 9 điểm ảnh quanh nó.', 'Để ý: cả 9 vị trí dùng chung đúng 9 trọng số.'],
  build: function (ui) {
    var img = [[1, 2, 0, 1, 3], [0, 1, 2, 3, 1], [1, 0, 1, 2, 0], [2, 1, 0, 1, 1], [0, 2, 1, 0, 2]];
    var K = { 'Cạnh dọc': [[1, 0, -1], [1, 0, -1], [1, 0, -1]], 'Cạnh ngang': [[1, 1, 1], [0, 0, 0], [-1, -1, -1]], 'Làm mờ (÷9)': [[1, 1, 1], [1, 1, 1], [1, 1, 1]] };
    var kname = 'Cạnh dọc', sel = [0, 0];
    ui.select('Bộ lọc', Object.keys(K), kname, function (v) { kname = v; draw(); });
    function conv(i, j) { var s = 0, k = K[kname]; for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) s += k[a][b] * img[i + a][j + b]; return kname.indexOf('mờ') > 0 ? s / 9 : s; }
    function grid(rows, cls, hl, click) {
      return '<div class="cg ' + cls + '" style="grid-template-columns:repeat(' + rows[0].length + ',1fr)">' + rows.map(function (r, i) {
        return r.map(function (v, j) {
          var on = hl(i, j);
          return '<button type="button" class="cc' + (on ? ' on' : '') + '"' + (click ? ' data-i="' + i + '" data-j="' + j + '"' : ' tabindex="-1"') + '>' + v + '</button>';
        }).join('');
      }).join('') + '</div>';
    }
    function draw() {
      var k = K[kname], res = [0, 1, 2].map(function (i) { return [0, 1, 2].map(function (j) { var v = conv(i, j); return Number.isInteger(v) ? String(v) : vn(v, 2); }); });
      ui.fig.innerHTML = '<div class="convrow">' +
        '<figure><figcaption>Ảnh 5×5</figcaption>' + grid(img, 'big', function (i, j) { return i >= sel[0] && i < sel[0] + 3 && j >= sel[1] && j < sel[1] + 3; }) + '</figure>' +
        '<span class="op">∗</span><figure><figcaption>Bộ lọc 3×3</figcaption>' + grid(k, 'kern', function () { return false; }) + '</figure>' +
        '<span class="op">=</span><figure><figcaption>Kết quả 3×3 (bấm vào ô)</figcaption>' + grid(res, 'res', function (i, j) { return i === sel[0] && j === sel[1]; }, true) + '</figure></div>';
      ui.fig.querySelectorAll('.res .cc').forEach(function (b) { b.onclick = function () { sel = [+b.dataset.i, +b.dataset.j]; draw(); }; });
      var parts = [0, 1, 2].map(function (a) { return '(' + [0, 1, 2].map(function (b) { return img[sel[0] + a][sel[1] + b] + '·' + (k[a][b] < 0 ? '(' + k[a][b] + ')' : k[a][b]); }).join(' + ') + ')'; });
      out(ui, [['Ô đang xem', 'hàng ' + (sel[0] + 1) + ', cột ' + (sel[1] + 1)], ['Phép tính', parts.join(' + ') + (kname.indexOf('mờ') > 0 ? ' ÷ 9' : '')], ['Kết quả', res[sel[0]][sel[1]], 'ok'], ['Số tham số của bộ lọc', '9, dùng chung cho mọi vị trí']]);
    }
    draw();
  },
};

// Day 18 · IoU
SIMS.day18 = {
  title: 'Hai hộp chồng nhau: IoU và GIoU',
  intro: 'Hộp xanh là đáp án (ground truth), hộp cam là dự đoán. Kéo để dịch chuyển hoặc đổi cỡ hộp dự đoán và xem các con số thay đổi.',
  tries: ['Dịch hộp cam sang phải dần: IoU giảm, qua 0,5 thì không còn tính là đúng (TP) ở ngưỡng AP50.', 'Kéo hai hộp rời hẳn nhau rồi kéo xa thêm: IoU kẹt ở 0, còn GIoU tiếp tục giảm. Đó là lý do GIoU dùng được làm hàm mất mát.', 'Phóng to hộp cam bao trùm hộp xanh: IoU vẫn thấp vì phần hợp lớn.'],
  build: function (ui) {
    var dx = 2, dy = 2, sc = 1;
    ui.slider({ label: 'Dịch ngang', min: -6, max: 10, step: 0.1, value: dx, fmt: function (v) { return vn(v, 1); } }, function (v) { dx = v; draw(); });
    ui.slider({ label: 'Dịch dọc', min: -4, max: 6, step: 0.1, value: dy, fmt: function (v) { return vn(v, 1); } }, function (v) { dy = v; draw(); });
    ui.slider({ label: 'Cỡ hộp dự đoán', min: 0.5, max: 2.2, step: 0.05, value: sc, fmt: function (v) { return '×' + vn(v); } }, function (v) { sc = v; draw(); });
    var W = 560, H = 280, u = 22, ox = 120, oy = 60;
    function draw() {
      var A = [0, 0, 4, 4], Bw = 4 * sc, B = [dx, dy, dx + Bw, dy + Bw];
      var ix = Math.max(0, Math.min(A[2], B[2]) - Math.max(A[0], B[0])), iy = Math.max(0, Math.min(A[3], B[3]) - Math.max(A[1], B[1]));
      var inter = ix * iy, uni = 16 + Bw * Bw - inter, iou = inter / uni;
      var C = [Math.min(A[0], B[0]), Math.min(A[1], B[1]), Math.max(A[2], B[2]), Math.max(A[3], B[3])], cA = (C[2] - C[0]) * (C[3] - C[1]);
      var giou = iou - (cA - uni) / cA;
      var svg = ui.svg(W, H);
      var R = function (b, cls) { return S('rect', { x: ox + b[0] * u, y: oy + b[1] * u, width: (b[2] - b[0]) * u, height: (b[3] - b[1]) * u, class: cls }, svg); };
      R(C, 'sv-hull');
      R(A, 'sv-boxA'); R(B, 'sv-boxB');
      if (inter > 0) R([Math.max(A[0], B[0]), Math.max(A[1], B[1]), Math.min(A[2], B[2]), Math.min(A[3], B[3])], 'sv-inter');
      T(svg, ox + 2, oy - 6, 'đáp án');
      T(svg, ox + B[0] * u + 2, oy + B[3] * u + 14, 'dự đoán');
      T(svg, ox + C[0] * u, oy + C[3] * u + 30, 'nét đứt: hộp nhỏ nhất bao cả hai (dùng cho GIoU)');
      out(ui, [['Giao', vn(inter, 2)], ['Hợp', vn(uni, 2)], ['IoU = giao / hợp', vn(iou, 3), iou >= 0.5 ? 'ok' : iou > 0 ? 'warn' : 'bad'], ['GIoU', vn(giou, 3)], ['Ở ngưỡng IoU 0,5', iou >= 0.5 ? 'Tính là đúng (TP)' : 'Tính là sai (FP)', iou >= 0.5 ? 'ok' : 'bad'], ['NMS ngưỡng 0,7', iou > 0.7 ? 'Hộp dự đoán bị xoá vì trùng' : 'Giữ cả hai hộp']]);
    }
    draw();
  },
};

// Day 20 · Kalman 1 chiều
SIMS.day20 = {
  title: 'Trộn hai niềm tin',
  intro: 'Đường xanh dương là dự đoán, đường cam là phép đo của cảm biến, đường xanh lá là kết quả bộ lọc Kalman. Mặc định đúng ví dụ trong slide: dự đoán 10 m (σ = 2), cảm biến 12 m (σ = 1).',
  tries: ['Nhìn đường xanh lá: nó luôn hẹp hơn cả hai đường kia.', 'Tăng σ cảm biến lên 4: kết quả trượt về phía dự đoán, K nhỏ lại.', 'Tăng σ dự đoán lên 6 (như sau khi đi lâu trong hầm): K tiến gần 1, kết quả gần như bằng phép đo.', 'Đặt hai σ bằng nhau: K = 0,5, kết quả nằm chính giữa.'],
  build: function (ui) {
    var mp = 10, sp = 2, z = 12, sr = 1;
    ui.slider({ label: 'Dự đoán μ (m)', min: 2, max: 18, step: 0.1, value: mp, fmt: function (v) { return vn(v, 1); } }, function (v) { mp = v; draw(); });
    ui.slider({ label: 'Độ không chắc của dự đoán σ', min: 0.3, max: 6, step: 0.1, value: sp, fmt: function (v) { return vn(v, 1); } }, function (v) { sp = v; draw(); });
    ui.slider({ label: 'Phép đo z (m)', min: 2, max: 18, step: 0.1, value: z, fmt: function (v) { return vn(v, 1); } }, function (v) { z = v; draw(); });
    ui.slider({ label: 'Nhiễu cảm biến σ (√R)', min: 0.3, max: 6, step: 0.1, value: sr, fmt: function (v) { return vn(v, 1); } }, function (v) { sr = v; draw(); });
    var W = 560, H = 250, box = { l: 30, r: 545, t: 14, b: 214 };
    var X = function (x) { return box.l + x / 20 * (box.r - box.l); };
    function pdf(x, m, s) { return Math.exp(-(x - m) * (x - m) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); }
    function draw() {
      var P = sp * sp, Rv = sr * sr, K = P / (P + Rv), mf = mp + K * (z - mp), Pf = (1 - K) * P, sf = Math.sqrt(Pf);
      var ymax = Math.max(pdf(mf, mf, sf), pdf(mp, mp, sp), pdf(z, z, sr)) * 1.08;
      var Y = function (y) { return box.b - y / ymax * (box.b - box.t); };
      var svg = ui.svg(W, H);
      axes(svg, box, [0, 5, 10, 15, 20].map(function (v) { return [X(v), v + ' m']; }), []);
      [[mp, sp, 'sv-pred'], [z, sr, 'sv-meas'], [mf, sf, 'sv-fuse']].forEach(function (g) {
        var d = ''; for (var x = 0; x <= 20.001; x += 0.05) d += (d ? 'L' : 'M') + X(x) + ' ' + Y(pdf(x, g[0], g[1]));
        S('path', { d: d, class: g[2] }, svg);
        S('line', { x1: X(g[0]), y1: box.b, x2: X(g[0]), y2: Y(pdf(g[0], g[0], g[1])), class: g[2] + ' sv-thin' }, svg);
      });
      var lg = [['dự đoán', 'sv-pred'], ['cảm biến', 'sv-meas'], ['kết quả Kalman', 'sv-fuse']];
      lg.forEach(function (l, i) { S('line', { x1: box.r - 150, y1: box.t + 8 + i * 16, x2: box.r - 128, y2: box.t + 8 + i * 16, class: l[1] }, svg); T(svg, box.r - 122, box.t + 12 + i * 16, l[0]); });
      out(ui, [['K = P/(P + R)', vn(K, 3), 'ok'], ['Ước lượng mới', vn(mf, 2) + ' m'], ['Phương sai: dự đoán → kết quả', vn(P, 2) + ' → ' + vn(Pf, 2)], ['Tin cảm biến', Math.round(K * 100) + '%'], ['Tin dự đoán', Math.round((1 - K) * 100) + '%']]);
    }
    draw();
  },
};

// Day 22 · MOTA và IDF1
SIMS.day22 = {
  title: 'Một người đi qua 10 khung hình',
  intro: 'Hàng trên là sự thật: một người, 10 khung. Hàng dưới là ID tracker gán (màu = ID). Thử cho tracker đổi ID giữa chừng hoặc bỏ sót vài khung, rồi so MOTA với IDF1.',
  tries: ['Đặt "Đổi ID từ khung" = 7: MOTA vẫn 90% nhưng IDF1 chỉ 60%. Đó là ví dụ trong slide.', 'Kéo điểm đổi ID về khung 2: MOTA không đổi, IDF1 tăng lại vì đoạn ID 2 dài hơn.', 'Bấm vài khung để tracker bỏ sót: cả hai điểm cùng giảm.', 'Đặt "Không đổi ID" (11): IDF1 đạt 100% nếu không bỏ sót khung nào.'],
  build: function (ui) {
    var sw = 7, miss = {};
    ui.slider({ label: 'Đổi ID từ khung', min: 2, max: 11, step: 1, value: sw, fmt: function (v) { return v >= 11 ? 'không đổi' : 'khung ' + v; } }, function (v) { sw = v; draw(); });
    ui.button('Bỏ hết khung sót', function () { miss = {}; draw(); });
    function draw() {
      var ids = []; for (var f = 1; f <= 10; f++) ids.push(miss[f] ? 0 : f >= sw ? 2 : 1);
      var fn = ids.filter(function (x) { return !x; }).length, preds = 10 - fn, idsw = 0, last = 0;
      ids.forEach(function (x) { if (x) { if (last && x !== last) idsw++; last = x; } });
      var c1 = ids.filter(function (x) { return x === 1; }).length, c2 = ids.filter(function (x) { return x === 2; }).length;
      var idtp = Math.max(c1, c2), idfn = 10 - idtp, idfp = preds - idtp;
      var mota = 1 - (fn + 0 + idsw) / 10, idf1 = (2 * idtp) / (2 * idtp + idfn + idfp);
      ui.fig.innerHTML = '<div class="trk"><div class="trk-l">Sự thật</div>' + ids.map(function (_, i) { return '<span class="tk gt">' + (i + 1) + '</span>'; }).join('') +
        '<div class="trk-l">Tracker<small>bấm để bỏ sót</small></div>' + ids.map(function (x, i) {
          return '<button type="button" class="tk id' + x + '" data-f="' + (i + 1) + '">' + (x ? 'ID ' + x : 'sót') + '</button>';
        }).join('') + '</div>';
      ui.fig.querySelectorAll('button.tk').forEach(function (b) { b.onclick = function () { var f = +b.dataset.f; if (miss[f]) delete miss[f]; else miss[f] = true; draw(); }; });
      out(ui, [['Bỏ sót (FN)', String(fn)], ['Đổi ID (IDSW)', String(idsw)], ['MOTA = 1 − (FN + FP + IDSW)/10', Math.round(mota * 100) + '%', mota >= 0.8 ? 'ok' : 'warn'], ['IDTP / IDFN / IDFP', idtp + ' / ' + idfn + ' / ' + idfp], ['IDF1', Math.round(idf1 * 100) + '%', idf1 >= 0.8 ? 'ok' : 'warn']]);
    }
    draw();
  },
};

// Day 23 · Khoảng cách từ chân xe
SIMS.day23 = {
  title: 'Đoán khoảng cách từ chỗ bánh xe chạm đường',
  intro: 'Nhìn từ bên hông: camera cao h mét nhìn ra đường phẳng. Chân xe nằm thấp hơn đường chân trời trong ảnh bao nhiêu pixel thì suy ra được khoảng cách Z = f·h / (v − c_y), với f = 720 px.',
  tries: ['Đặt 40 px: ra 29,7 m như slide; vùng tô màu là sai số khi lệch ±1 px.', 'Kéo xuống 10 px (vật ở xa, gần chân trời): lệch 1 px sai tới hàng chục mét.', 'Kéo lên 150 px (vật ở gần): sai số chỉ vài chục cm.', 'Đổi độ cao camera: cùng pixel, khoảng cách tỉ lệ thuận với h. Xe nhún làm h đổi là công thức sai.'],
  build: function (ui) {
    var px = 40, h = 1.65, f = 720;
    ui.slider({ label: 'Chân xe dưới chân trời (px)', min: 6, max: 200, step: 1, value: px, fmt: function (v) { return v + ' px'; } }, function (v) { px = v; draw(); });
    ui.slider({ label: 'Độ cao camera h (m)', min: 1, max: 2.5, step: 0.05, value: h, fmt: function (v) { return vn(v) + ' m'; } }, function (v) { h = v; draw(); });
    var W = 560, H = 230, box = { l: 40, r: 545, t: 30, b: 180 }, maxZ = 150;
    var X = function (z) { return box.l + Math.min(z, maxZ) / maxZ * (box.r - box.l); };
    function draw() {
      var Z = f * h / px, Zn = f * h / (px + 1), Zf = px > 1 ? f * h / (px - 1) : Infinity;
      var svg = ui.svg(W, H), camY = box.b - h * 22;
      S('line', { x1: box.l, y1: box.b, x2: box.r, y2: box.b, class: 'sv-ax' }, svg);
      [0, 25, 50, 75, 100, 125, 150].forEach(function (z) { S('line', { x1: X(z), y1: box.b, x2: X(z), y2: box.b + 4, class: 'sv-ax' }, svg); T(svg, X(z), box.b + 17, z + ' m', { 'text-anchor': 'middle' }); });
      S('rect', { x: X(Zn), y: box.b - 26, width: Math.max(2, X(Math.min(Zf, maxZ)) - X(Zn)), height: 26, class: 'sv-band' }, svg);
      S('line', { x1: box.l, y1: camY, x2: X(Z), y2: box.b, class: 'sv-ray' }, svg);
      S('line', { x1: box.l, y1: camY, x2: box.r, y2: camY, class: 'sv-dash' }, svg);
      T(svg, box.r - 4, camY - 6, 'hướng đường chân trời', { 'text-anchor': 'end' });
      S('rect', { x: box.l - 10, y: camY - 7, width: 16, height: 12, rx: 2, class: 'sv-cam' }, svg);
      S('line', { x1: box.l - 2, y1: camY + 5, x2: box.l - 2, y2: box.b, class: 'sv-thin sv-ax' }, svg);
      T(svg, box.l + 4, (camY + box.b) / 2, 'h = ' + vn(h) + ' m');
      if (Z <= maxZ) { S('rect', { x: X(Z) - 3, y: box.b - 16, width: 30, height: 14, rx: 3, class: 'sv-car' }, svg); }
      else T(svg, box.r, box.b - 30, 'xe ở ngoài khung →', { 'text-anchor': 'end' });
      T(svg, box.l, box.t - 12, 'vùng tô: khoảng cách khi lệch ±1 px');
      var spread = Zf - Zn;
      out(ui, [['Khoảng cách Z', vn(Z, 1) + ' m', 'ok'], ['Nếu lệch +1 px', vn(Zn, 1) + ' m'], ['Nếu lệch −1 px', isFinite(Zf) ? vn(Zf, 1) + ' m' : 'vô cùng'], ['Độ rộng sai số', vn(spread, 1) + ' m', spread > 10 ? 'bad' : spread > 2 ? 'warn' : 'ok']]);
    }
    draw();
  },
};

// Day 24 · Chia train/test
SIMS.day24 = {
  title: 'Chia train/test: theo khung hay theo cảnh?',
  intro: 'Có 4 cảnh lái xe, mỗi cảnh 10 khung liền nhau (các khung cùng cảnh gần như giống hệt). Ta lấy khoảng 25% làm test. Ô viền đỏ là khung test có "anh em sinh đôi" ngay sát bên trong tập train.',
  tries: ['Chọn "Ngẫu nhiên theo khung": gần như khung test nào cũng có bản gần trùng trong train, điểm test sẽ đẹp giả.', 'Chọn "Theo cảnh": cả một cảnh nằm trọn bên test, không còn rò rỉ.', 'Bấm "Chia lại" vài lần ở chế độ ngẫu nhiên: rò rỉ lần nào cũng cao.'],
  build: function (ui) {
    var mode = 'frame', seed = 3;
    ui.select('Cách chia', ['Ngẫu nhiên theo khung', 'Theo cảnh'], 'Ngẫu nhiên theo khung', function (v) { mode = v.indexOf('cảnh') > 0 ? 'scene' : 'frame'; draw(); });
    ui.button('Chia lại', function () { seed++; draw(); });
    function draw() {
      var r = rng(seed), test = {};
      if (mode === 'frame') { for (var s = 0; s < 4; s++) for (var f = 0; f < 10; f++) if (r() < 0.25) test[s + '-' + f] = true; }
      else { var pick = Math.floor(r() * 4); for (var f2 = 0; f2 < 10; f2++) test[pick + '-' + f2] = true; }
      var nTest = 0, leak = 0, html = '<div class="split">';
      for (var sc = 0; sc < 4; sc++) {
        html += '<div class="split-l">Cảnh ' + 'ABCD'[sc] + '</div>';
        for (var fr = 0; fr < 10; fr++) {
          var k = sc + '-' + fr, isT = !!test[k];
          var lk = isT && ((fr > 0 && !test[sc + '-' + (fr - 1)]) || (fr < 9 && !test[sc + '-' + (fr + 1)]));
          if (isT) nTest++; if (lk) leak++;
          html += '<span class="fr sc' + sc + (isT ? ' test' : '') + (lk ? ' leak' : '') + '" title="' + (isT ? 'test' : 'train') + '">' + (isT ? 'T' : '') + '</span>';
        }
      }
      ui.fig.innerHTML = html + '</div><p class="fig-note">Ô chữ T là test, ô trống là train. Cùng màu = cùng một cảnh.</p>';
      var pct = nTest ? Math.round(leak / nTest * 100) : 0;
      out(ui, [['Khung test', String(nTest)], ['Khung test có bản gần trùng trong train', String(leak)], ['Tỷ lệ rò rỉ', pct + '%', pct > 20 ? 'bad' : pct > 0 ? 'warn' : 'ok'], ['Kết luận', pct > 20 ? 'Điểm test sẽ cao giả' : 'Điểm test đáng tin hơn', pct > 20 ? 'bad' : 'ok']]);
    }
    draw();
  },
};

// Day 25 · Token ảnh
SIMS.day25 = {
  title: 'Ảnh biến thành bao nhiêu token?',
  intro: 'Qwen3-VL cắt ảnh thành mảnh 16 px rồi gộp 2×2 mảnh thành 1 token, nên mỗi token ứng với một ô 32×32 px. Mỗi ô lưới dưới đây là một token mà LLM phải đọc.',
  tries: ['Đặt 1280 × 720: khoảng 900 token như slide.', 'Lên 1920 × 1080: khoảng 2 000 token, chi phí và độ trễ tăng theo.', 'Hạ xuống 640 × 360: rẻ hơn 4 lần nhưng chữ nhỏ, vật nhỏ khó đọc hơn.', 'So với Gemma 3: mọi ảnh cố định 256 token, bất kể kích thước.'],
  build: function (ui) {
    var w = 1280, hh = 720;
    ui.slider({ label: 'Chiều rộng ảnh (px)', min: 320, max: 1920, step: 32, value: w, fmt: function (v) { return v + ' px'; } }, function (v) { w = v; draw(); });
    ui.slider({ label: 'Chiều cao ảnh (px)', min: 192, max: 1088, step: 32, value: hh, fmt: function (v) { return v + ' px'; } }, function (v) { hh = v; draw(); });
    var W = 560, H = 330;
    function draw() {
      var cols = Math.round(w / 32), rows = Math.round(hh / 32), sc = Math.min((W - 20) / 1920, (H - 20) / 1088);
      var svg = ui.svg(W, H), rw = cols * 32 * sc, rh = rows * 32 * sc, x0 = 10, y0 = 10;
      S('rect', { x: x0, y: y0, width: 1920 * sc, height: 1088 * sc, class: 'sv-ghost' }, svg);
      S('rect', { x: x0, y: y0, width: rw, height: rh, class: 'sv-img' }, svg);
      var d = '';
      for (var c = 1; c < cols; c++) d += 'M' + (x0 + c * 32 * sc) + ' ' + y0 + 'v' + rh;
      for (var r = 1; r < rows; r++) d += 'M' + x0 + ' ' + (y0 + r * 32 * sc) + 'h' + rw;
      S('path', { d: d, class: 'sv-tok' }, svg);
      T(svg, x0 + 1920 * sc - 4, y0 + 1088 * sc - 6, 'khung 1920 × 1088', { 'text-anchor': 'end' });
      var n = cols * rows;
      out(ui, [['Lưới token', cols + ' × ' + rows], ['Số token ảnh', n.toLocaleString('vi-VN'), n > 1500 ? 'warn' : 'ok'], ['So với ảnh 1280 × 720', '×' + vn(n / 920, 2) + ' chi phí'], ['Gemma 3 (cố định)', '256 token']]);
    }
    draw();
  },
};

// Day 26 · Nhiễu thành gia tốc giả
SIMS.day26 = {
  title: 'Nhiễu vị trí biến thành gia tốc giả',
  intro: 'Một xe chuyển làn 3,5 m trong 4 giây; gia tốc ngang thật tối đa chỉ khoảng 1,08 m/s² (đường xanh lá). Tracker đo vị trí có nhiễu σ. Lấy gia tốc bằng sai phân hai lần thì nhiễu bị phóng đại theo 1/Δt² (đường cam).',
  tries: ['Mặc định σ = 0,10 m, Δt = 0,1 s: gia tốc giả cỡ ±25 m/s² (≈ 2,5 g), che lấp hoàn toàn tín hiệu thật.', 'Tăng "Làm mượt" lên 3–5: đường cam bám lại đường xanh lá.', 'Giảm Δt xuống 0,05 s (đo dày hơn) mà không làm mượt: nhiễu còn tệ hơn gấp 4 lần.', 'Đặt σ = 0: sai phân hai lần cho đúng tín hiệu thật.'],
  build: function (ui) {
    var sig = 0.1, dt = 0.1, k = 0;
    ui.slider({ label: 'Nhiễu vị trí σ (m)', min: 0, max: 0.2, step: 0.01, value: sig, fmt: function (v) { return vn(v) + ' m'; } }, function (v) { sig = v; draw(); });
    ui.slider({ label: 'Bước thời gian Δt (s)', min: 0.05, max: 0.2, step: 0.01, value: dt, fmt: function (v) { return vn(v) + ' s'; } }, function (v) { dt = v; draw(); });
    ui.slider({ label: 'Làm mượt (trung bình ±k mẫu)', min: 0, max: 6, step: 1, value: k, fmt: function (v) { return v ? '±' + v : 'tắt'; } }, function (v) { k = v; draw(); });
    var W = 560, H = 260, box = { l: 44, r: 545, t: 12, b: 222 }, lim = 30;
    var X = function (t) { return box.l + t / 4 * (box.r - box.l); };
    var Y = function (a) { return (box.t + box.b) / 2 - Math.max(-lim, Math.min(lim, a)) / lim * (box.b - box.t) / 2; };
    function draw() {
      var r = rng(7), n = Math.round(4 / dt) + 1, ts = [], ys = [], ns = [];
      for (var i = 0; i < n; i++) { var t = i * dt; ts.push(t); ys.push(1.75 * (1 - Math.cos(Math.PI * t / 4))); ns.push(ys[i] + sig * gauss(r)); }
      var sm = ns.map(function (_, i) { var s = 0, c = 0; for (var j = i - k; j <= i + k; j++) if (j >= 0 && j < n) { s += ns[j]; c++; } return s / c; });
      var svg = ui.svg(W, H);
      axes(svg, box, [0, 1, 2, 3, 4].map(function (v) { return [X(v), v + ' s']; }), [-30, -15, 0, 15, 30].map(function (v) { return [Y(v), String(v)]; }));
      T(svg, box.l + 4, box.t + 10, 'gia tốc ngang (m/s²)');
      var est = '', err = 0, cnt = 0;
      for (var i2 = 1; i2 < n - 1; i2++) {
        var a = (sm[i2 + 1] - 2 * sm[i2] + sm[i2 - 1]) / (dt * dt), at = 1.75 * Math.pow(Math.PI / 4, 2) * Math.cos(Math.PI * ts[i2] / 4);
        est += (est ? 'L' : 'M') + X(ts[i2]) + ' ' + Y(a);
        if (i2 > k && i2 < n - 1 - k) { err += (a - at) * (a - at); cnt++; }
      }
      S('path', { d: est, class: 'sv-meas' }, svg);
      var tru = ''; for (var t2 = 0; t2 <= 4.001; t2 += 0.02) tru += (tru ? 'L' : 'M') + X(t2) + ' ' + Y(1.75 * Math.pow(Math.PI / 4, 2) * Math.cos(Math.PI * t2 / 4));
      S('path', { d: tru, class: 'sv-fuse sv-bold' }, svg);
      var rms = cnt ? Math.sqrt(err / cnt) : 0, th = Math.sqrt(6) * sig / (dt * dt);
      out(ui, [['Lý thuyết √6·σ/Δt² (chưa làm mượt)', vn(th, 1) + ' m/s²'], ['Sai số đo được (RMS)', vn(rms, 1) + ' m/s²', rms > 5 ? 'bad' : rms > 1.5 ? 'warn' : 'ok'], ['Tín hiệu thật tối đa', '1,08 m/s²'], ['Gia tốc giả so với thật', '×' + vn(rms / 1.08, 1)]]);
    }
    draw();
  },
};

// Day 27 · Bản đồ kịch bản
SIMS.day27 = {
  title: 'Bản đồ kịch bản "xe khác cắt vào"',
  intro: 'Mỗi ô là một kịch bản cụ thể: khoảng cách lúc xe cắt vào (trục ngang) và tốc độ tiến gần (trục dọc). Màu cho biết cần phanh mạnh cỡ nào: a = v²/(2d). Bấm vào một ô để xem chi tiết.',
  tries: ['Bấm ô 30 m, 5 m/s (ca A trong slide): TTC 6 s, chỉ cần phanh rất nhẹ.', 'Bấm ô 12 m, 10 m/s (ca C): TTC 1,2 s, cần ~4,2 m/s².', 'Nhìn ranh giới giữa vàng và đỏ: lỗi thường nằm trên ranh giới, nên kiểm thử ở đó chứ không ở giữa vùng xanh.', 'Đổi giới hạn phanh của xe xuống 6 m/s²: vùng đỏ lan rộng.'],
  build: function (ui) {
    var amax = 8, sel = [12, 5];
    ui.slider({ label: 'Giới hạn phanh của xe (m/s²)', min: 4, max: 10, step: 0.5, value: amax, fmt: function (v) { return vn(v, 1); } }, function (v) { amax = v; draw(); });
    var ds = [], vs = [];
    for (var d = 4; d <= 40; d += 2) ds.push(d);
    for (var v = 1; v <= 15; v += 1) vs.push(v);
    function draw() {
      var html = '<div class="tgrid" style="grid-template-columns:44px repeat(' + ds.length + ',minmax(0,1fr))">';
      for (var i = vs.length - 1; i >= 0; i--) {
        html += '<span class="tg-y">' + (vs[i] % 5 === 0 ? vs[i] + ' m/s' : '') + '</span>';
        ds.forEach(function (d) {
          var a = vs[i] * vs[i] / (2 * d), cls = a < 3 ? 'z-ok' : a <= amax ? 'z-warn' : 'z-bad', on = d === sel[0] && vs[i] === sel[1];
          html += '<button type="button" class="tg ' + cls + (on ? ' on' : '') + '" data-d="' + d + '" data-v="' + vs[i] + '" aria-label="' + d + ' m, ' + vs[i] + ' m/s"></button>';
        });
      }
      html += '<span></span>' + ds.map(function (d) { return '<span class="tg-x">' + (d % 10 === 0 ? d + ' m' : '') + '</span>'; }).join('') + '</div>' +
        '<p class="fig-note"><span class="lg z-ok"></span>phanh êm (&lt; 3 m/s²) <span class="lg z-warn"></span>phải phanh gấp <span class="lg z-bad"></span>vượt giới hạn phanh: va chạm</p>';
      ui.fig.innerHTML = html;
      ui.fig.querySelectorAll('.tg').forEach(function (b) { b.onclick = function () { sel = [+b.dataset.d, +b.dataset.v]; draw(); }; });
      var a = sel[1] * sel[1] / (2 * sel[0]), ttc = sel[0] / sel[1];
      out(ui, [['Kịch bản', sel[0] + ' m, tiến gần ' + sel[1] + ' m/s'], ['TTC = d / v', vn(ttc, 1) + ' s', ttc < 1.5 ? 'bad' : ttc < 3 ? 'warn' : 'ok'], ['Cần phanh a = v²/(2d)', vn(a, 1) + ' m/s²', a > amax ? 'bad' : a >= 3 ? 'warn' : 'ok'], ['Kết quả', a > amax ? 'Không kịp dừng' : a >= 3 ? 'Kịp nếu phanh gấp' : 'An toàn', a > amax ? 'bad' : a >= 3 ? 'warn' : 'ok']]);
    }
    draw();
  },
};

