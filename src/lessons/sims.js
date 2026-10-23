// Mô phỏng tương tác cho từng buổi. Mỗi mục: { title, intro, tries[], build(ui) }, hoặc một mảng nhiều mục.
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

// ---- Hình minh hoạ tĩnh (FIGS): mỗi mục là một hàm trả về chuỗi SVG, gắn vào khái niệm qua trường fig ----
function fe(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function fsvg(w, h, label, inner) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + fe(label) + '">' + inner + '</svg>'; }
function fel(tag, a, txt) { var s = '<' + tag; for (var k in a) s += ' ' + k + '="' + a[k] + '"'; return txt === undefined ? s + '/>' : s + '>' + fe(txt) + '</' + tag + '>'; }
function ftx(x, y, t, a) { return fel('text', Object.assign({ x: x, y: y, class: 'sv-t' }, a || {}), t); }
function farrow(x1, y1, x2, y2, cls) {
  var an = Math.atan2(y2 - y1, x2 - x1), L = 7;
  return fel('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: cls || 'sv-ax' }) + fel('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - L * Math.cos(an - 0.45)).toFixed(1) + ' ' + (y2 - L * Math.sin(an - 0.45)).toFixed(1) + 'L' + (x2 - L * Math.cos(an + 0.45)).toFixed(1) + ' ' + (y2 - L * Math.sin(an + 0.45)).toFixed(1) + 'Z', class: 'sv-cam' });
}
/** Hình minh hoạ tĩnh: khoá là Concept.fig, mỗi mục trả về một chuỗi SVG. */
export const FIGS = {};

// Day 21 · Điểm thô → voxel → pillar → BEV
FIGS['pc-repr'] = function () {
  var r = rng(3), side = [], top = [], i, out = '', W = 560, H = 200, base = 150, cell = 12;
  for (i = 0; i < 70; i++) { var x = 14 + r() * 70, z = 8 + r() * (x > 30 && x < 70 ? 34 : 22); side.push([x, z]); top.push([x, 44 + r() * 28]); }
  for (i = 0; i < 16; i++) { side.push([98 + r() * 7, 6 + r() * 50]); top.push([98 + r() * 7, 28 + r() * 7]); }
  var titles = ['Điểm thô (nhìn ngang)', 'Voxel: ô 3D', 'Pillar: cột', 'BEV: nhìn từ trên'];
  for (var p = 0; p < 4; p++) {
    var ox = 6 + p * 139;
    out += ftx(ox + 2, 16, titles[p], { class: 'sv-tag' });
    if (p < 3) out += fel('line', { x1: ox, y1: base, x2: ox + 125, y2: base, class: 'sv-ax' });
    if (p === 3) out += fel('rect', { x: ox, y: 30, width: 125, height: base - 30, class: 'sv-ghost' });
    var occ = {};
    (p === 3 ? top : side).forEach(function (q) {
      var cx = Math.floor(q[0] / cell), cz = Math.floor(q[1] / cell);
      var key = p === 2 ? cx + ':0' : cx + ':' + cz;
      if (!occ[key]) {
        occ[key] = 1;
        if (p === 1) out += fel('rect', { x: ox + cx * cell, y: base - (cz + 1) * cell, width: cell, height: cell, class: 'sv-hl' });
        if (p === 2) out += fel('rect', { x: ox + cx * cell, y: base - 72, width: cell, height: 72, class: 'sv-hl' });
        if (p === 3) out += fel('rect', { x: ox + cx * cell, y: base - 120 + cz * cell, width: cell, height: cell, class: 'sv-hl' });
      }
    });
    (p === 3 ? top : side).forEach(function (q) { out += fel('circle', { cx: (ox + q[0]).toFixed(1), cy: (p === 3 ? base - 120 + q[1] : base - q[1]).toFixed(1), r: 1.6, class: 'sv-dot' }); });
    if (p < 3) out += ftx(ox + 2, base + 14, p === 0 ? 'xe · người' : p === 1 ? 'chia cả ngang lẫn cao' : 'gộp cả chiều cao');
    else out += ftx(ox + 2, base + 14, 'ảnh giả 2D cho CNN');
    if (p < 3) out += ftx(ox + 131, 92, '→', { class: 'sv-tag' });
  }
  return fsvg(W, H, 'Từ điểm thô tới voxel, pillar và BEV', out);
};

// Day 21 · Hệ trục LiDAR và camera
FIGS['frames'] = function () {
  var out = '';
  function triad(ox, oy, axes, title) {
    out += ftx(ox - 40, 20, title, { class: 'sv-tag' });
    axes.forEach(function (a) { out += farrow(ox, oy, ox + a[0], oy + a[1], 'sv-ax sv-bold') + ftx(ox + a[0] + (a[0] >= 0 ? 6 : -6), oy + a[1] + (a[1] > 0 ? 14 : -4), a[2], { 'text-anchor': a[0] >= 0 ? 'start' : 'end', class: 'sv-tag' }); });
    out += fel('circle', { cx: ox, cy: oy, r: 3, class: 'sv-cam' });
  }
  triad(120, 100, [[80, 0, 'x: tới trước'], [-45, -32, 'y: sang trái'], [0, -62, 'z: lên trên']], 'LiDAR (thường gặp)');
  triad(400, 90, [[80, 0, 'z: tới trước'], [45, 32, 'x: sang phải'], [0, 52, 'y: xuống dưới']], 'Camera (pinhole)');
  out += ftx(20, 168, 'Cùng một điểm cách xe 10 m phía trước: LiDAR ghi (10, 0, 0),') + ftx(20, 184, 'camera ghi khoảng (0, 0, 10) sau khi trừ vị trí lắp.');
  return fsvg(560, 192, 'Hệ trục LiDAR và hệ trục camera', out);
};

// Day 21 · Quy ước hộp 3D: tâm hay đáy, góc yaw
FIGS['box-conv'] = function () {
  var out = '', g = 140;
  out += ftx(20, 16, 'Nhìn ngang', { class: 'sv-tag' });
  out += fel('line', { x1: 20, y1: g, x2: 260, y2: g, class: 'sv-ax' }) + ftx(24, g + 14, 'mặt đường');
  out += fel('rect', { x: 60, y: g - 90, width: 150, height: 60, class: 'sv-ghost' }) + ftx(64, g - 96, 'đọc nhầm quy ước → lơ lửng thêm h/2');
  out += fel('rect', { x: 60, y: g - 60, width: 150, height: 60, class: 'sv-boxA' });
  out += fel('circle', { cx: 135, cy: g - 30, r: 4, class: 'sv-cam' }) + ftx(143, g - 26, 'tâm hộp: z = h/2');
  out += fel('circle', { cx: 135, cy: g, r: 4, class: 'sv-ball' }) + ftx(143, g - 4, 'tâm đáy: z = 0');
  out += ftx(300, 16, 'Nhìn từ trên (hệ xe)', { class: 'sv-tag' });
  var ox = 330, oy = 150;
  out += farrow(ox, oy, ox, oy - 120, 'sv-ax') + ftx(ox + 6, oy - 112, 'x: tới trước');
  out += farrow(ox, oy, ox - 26, oy, 'sv-ax') + ftx(ox - 30, oy + 14, 'y: trái', { 'text-anchor': 'end' });
  var cx = 450, cy = 80, a = 30 * Math.PI / 180, L = 70, Wd = 30;
  var pts = [[-L / 2, -Wd / 2], [L / 2, -Wd / 2], [L / 2, Wd / 2], [-L / 2, Wd / 2]].map(function (p) {
    // hướng xe theo trục x (lên trên màn hình), xoay một góc yaw ngược chiều kim đồng hồ
    var fx = p[0] * Math.cos(a) - p[1] * Math.sin(a), fy = p[0] * Math.sin(a) + p[1] * Math.cos(a);
    return (cx - fy).toFixed(1) + ',' + (cy - fx).toFixed(1);
  });
  out += fel('polygon', { points: pts.join(' '), class: 'sv-boxA' });
  out += farrow(cx, cy, cx - 42 * Math.sin(a), cy - 42 * Math.cos(a), 'sv-pred sv-bold');
  out += fel('line', { x1: cx, y1: cy, x2: cx, y2: cy - 50, class: 'sv-dash' });
  out += fel('path', { d: 'M' + cx + ' ' + (cy - 34) + ' A34 34 0 0 0 ' + (cx - 34 * Math.sin(a)).toFixed(1) + ' ' + (cy - 34 * Math.cos(a)).toFixed(1), class: 'sv-step', fill: 'none' });
  out += ftx(cx + 6, cy - 40, 'yaw = 30°');
  out += ftx(300, 176, 'yaw đo từ trục x; quấn ở ±π nên 3,3 rad và −2,98 rad là cùng một hướng');
  return fsvg(560, 186, 'Quy ước hộp 3D', out);
};

// Day 22 · Vòng lặp tracking-by-detection
FIGS['track-loop'] = function () {
  var out = '', names = [['1. Detect', 'detector cho hộp + điểm'], ['2. Predict', 'Kalman đoán vị trí mới'], ['3. Associate', 'bảng chi phí + Hungarian'], ['4. Update', 'cập nhật · tạo · xoá track']];
  names.forEach(function (n, i) {
    var x = 10 + i * 138;
    out += fel('rect', { x: x, y: 20, width: 118, height: 56, rx: 8, class: i === 2 ? 'sv-hl' : 'sv-img' });
    out += ftx(x + 8, 40, n[0], { class: 'sv-tag' }) + ftx(x + 8, 60, n[1]);
    if (i < 3) out += farrow(x + 120, 48, x + 136, 48);
  });
  out += fel('path', { d: 'M532 76 V98 H69 V80', class: 'sv-dash', fill: 'none' }) + farrow(69, 90, 69, 79) + ftx(220, 112, 'khung hình tiếp theo: lặp lại');
  return fsvg(560, 120, 'Vòng lặp bốn bước của tracking-by-detection', out);
};

// Day 22 · Vòng đời của một track
FIGS['track-life'] = function () {
  var out = '', st = [['Tentative', 'mới, chưa chắc', 'sv-img'], ['Confirmed', 'đã xác nhận', 'sv-hl'], ['Lost', 'mất hộp, vẫn nhớ', 'sv-boxB'], ['Removed', 'bị xoá', 'sv-ghost']];
  st.forEach(function (s, i) {
    var x = 10 + i * 138;
    out += fel('rect', { x: x, y: 40, width: 112, height: 46, rx: 8, class: s[2] }) + ftx(x + 8, 60, s[0], { class: 'sv-tag' }) + ftx(x + 8, 78, s[1]);
    if (i < 3) out += farrow(x + 114, 63, x + 136, 63);
  });
  out += ftx(126, 34, 'đủ min_hits khung') + ftx(268, 34, 'mất hộp') + ftx(400, 34, 'quá track_buffer khung');
  out += fel('path', { d: 'M332 86 V112 H210 V90', class: 'sv-step', fill: 'none' }) + farrow(210, 100, 210, 89, 'sv-step') + ftx(222, 124, 'ghép lại được trong buffer → giữ nguyên ID');
  return fsvg(560, 132, 'Vòng đời của một track', out);
};

// Day 22 · Vòng tròn hay elip khi gating
FIGS['mahalanobis'] = function () {
  var out = '';
  function panel(ox, title, ellipse) {
    var cx = ox + 130, cy = 95;
    out += ftx(ox + 10, 18, title, { class: 'sv-tag' });
    out += ellipse ? fel('ellipse', { cx: cx, cy: cy, rx: 70, ry: 24, class: 'sv-hl' }) : fel('circle', { cx: cx, cy: cy, r: 52, class: 'sv-hl' });
    out += fel('circle', { cx: cx, cy: cy, r: 4, class: 'sv-cam' }) + ftx(cx + 6, cy + 16, 'dự đoán');
    out += fel('circle', { cx: cx + 48, cy: cy, r: 5, class: 'sv-id3' }) + ftx(cx + 56, cy + 4, 'D1');
    out += fel('circle', { cx: cx, cy: cy - 40, r: 5, class: 'sv-ball' }) + ftx(cx + 8, cy - 40, 'D2');
    out += ftx(ox + 10, 172, ellipse ? 'Mahalanobis: nhận D1, loại D2 ✓' : 'khoảng cách thường: nhận cả D2 ✗');
  }
  panel(0, 'Vòng tròn: mọi hướng như nhau', false);
  panel(280, 'Elip: hướng dọc đang chắc hơn', true);
  return fsvg(560, 182, 'Gating bằng vòng tròn và bằng elip Mahalanobis', out);
};


// Day 23 · Một pixel là cả một tia
FIGS['pixel-ray'] = function () {
  var out = '', ox = 40, oy = 110, ang = -0.17;
  var P = function (d) { return [ox + d * Math.cos(ang), oy + d * Math.sin(ang)]; };
  out += fel('rect', { x: ox - 22, y: oy - 10, width: 20, height: 20, rx: 3, class: 'sv-cam' }) + ftx(ox - 30, oy + 28, 'camera');
  out += fel('line', { x1: ox + 30, y1: oy - 40, x2: ox + 30, y2: oy + 40, class: 'sv-ax sv-bold' }) + ftx(ox + 34, oy - 44, 'ảnh');
  var px = P(30); out += fel('circle', { cx: px[0], cy: px[1], r: 4, class: 'sv-ball' }) + ftx(px[0] + 6, px[1] + 18, '1 pixel');
  var end = P(520); out += fel('line', { x1: ox, y1: oy, x2: end[0], y2: end[1], class: 'sv-ray' });
  [[130, 10, 'vật nhỏ ở 10 m'], [290, 22, 'xe ở 25 m'], [470, 34, 'xe tải ở 45 m']].forEach(function (b) {
    var c = P(b[0]);
    out += fel('rect', { x: (c[0] - b[1] / 2).toFixed(1), y: (c[1] - b[1] / 2).toFixed(1), width: b[1], height: b[1], class: 'sv-boxA' }) + ftx(c[0] - 30, c[1] + b[1] / 2 + 16, b[2]);
  });
  out += ftx(20, 182, 'Cùng một pixel: chỉ từ ảnh không biết vật nằm đâu trên tia.') + ftx(20, 198, 'Cần thêm kích thước đã biết, chỗ chạm đất, stereo hoặc LiDAR/radar.');
  return fsvg(560, 206, 'Một pixel ứng với cả một tia trong không gian', out);
};

// Day 23 · Ảnh phối cảnh và BEV
FIGS['persp-vs-bev'] = function () {
  var out = '';
  out += ftx(10, 16, 'Ảnh phối cảnh (camera)', { class: 'sv-tag' });
  out += fel('rect', { x: 10, y: 24, width: 250, height: 150, class: 'sv-ghost' });
  out += fel('line', { x1: 10, y1: 80, x2: 260, y2: 80, class: 'sv-dash' }) + ftx(200, 76, 'chân trời');
  out += fel('line', { x1: 40, y1: 174, x2: 128, y2: 80, class: 'sv-ax' }) + fel('line', { x1: 220, y1: 174, x2: 142, y2: 80, class: 'sv-ax' });
  out += fel('rect', { x: 92, y: 120, width: 70, height: 40, rx: 4, class: 'sv-car' }) + ftx(168, 146, 'xe gần: to');
  out += fel('rect', { x: 128, y: 86, width: 16, height: 10, rx: 2, class: 'sv-car' }) + ftx(150, 96, 'xe xa: bé');
  out += ftx(300, 16, 'BEV (nhìn từ trên xuống)', { class: 'sv-tag' });
  out += fel('rect', { x: 300, y: 24, width: 250, height: 150, class: 'sv-ghost' });
  out += fel('line', { x1: 380, y1: 24, x2: 380, y2: 174, class: 'sv-ax' }) + fel('line', { x1: 470, y1: 24, x2: 470, y2: 174, class: 'sv-ax' });
  out += fel('rect', { x: 412, y: 120, width: 26, height: 44, rx: 3, class: 'sv-car' }) + ftx(444, 150, 'xe gần');
  out += fel('rect', { x: 412, y: 40, width: 26, height: 44, rx: 3, class: 'sv-car' }) + ftx(444, 66, 'xe xa: cùng cỡ');
  out += farrow(425, 190, 425, 172) + ftx(434, 192, 'xe của bạn');
  return fsvg(560, 200, 'Ảnh phối cảnh và BEV', out);
};

// Day 23 · Early / mid / late fusion
FIGS['fusion-levels'] = function () {
  var out = '', rows = [['Early', 'gộp dữ liệu thô', 'một mạng → hộp 3D'], ['Mid', 'gộp đặc trưng (BEV)', 'heads → hộp 3D'], ['Late', 'gộp hộp / track', 'hộp 3D hợp nhất']];
  rows.forEach(function (r, i) {
    var y = 14 + i * 66, srcEnd = [166, 262, 364][i], mx = [190, 288, 388][i];
    out += ftx(8, y + 26, r[0], { class: 'sv-tag' }) + ftx(8, y + 42, r[1]);
    [['ảnh', 0], ['LiDAR', 1]].forEach(function (s) {
      var yy = y + s[1] * 30;
      out += fel('rect', { x: 120, y: yy, width: 46, height: 22, rx: 4, class: 'sv-img' }) + ftx(126, yy + 15, s[0]);
      if (i >= 1) out += fel('rect', { x: 200, y: yy, width: 62, height: 22, rx: 4, class: 'sv-img' }) + ftx(205, yy + 15, 'backbone');
      if (i === 2) out += fel('rect', { x: 292, y: yy, width: 72, height: 22, rx: 4, class: 'sv-img' }) + ftx(297, yy + 15, 'detector');
      out += farrow(srcEnd, yy + 11, mx, y + 26);
    });
    out += fel('rect', { x: mx, y: y + 14, width: 30, height: 24, rx: 12, class: 'sv-hl' }) + ftx(mx + 15, y + 31, '+', { class: 'sv-tag', 'text-anchor': 'middle' });
    out += farrow(mx + 30, y + 26, 432, y + 26) + fel('rect', { x: 434, y: y + 14, width: 120, height: 24, rx: 4, class: 'sv-boxA' }) + ftx(440, y + 31, r[2]);
  });
  return fsvg(560, 206, 'Ba tầng hợp nhất: early, mid, late', out);
};

// Day 23 · Track-then-fuse và fuse-then-track
FIGS['track-fuse'] = function () {
  var out = '';
  function box(x, y, w, t, cls) { return fel('rect', { x: x, y: y, width: w, height: 26, rx: 5, class: cls || 'sv-img' }) + ftx(x + 6, y + 17, t); }
  out += ftx(8, 16, 'Track-then-fuse: một track, update lần lượt', { class: 'sv-tag' });
  out += box(8, 26, 70, 'track x, P', 'sv-hl') + farrow(78, 39, 92, 39) + box(94, 26, 60, 'predict') + farrow(154, 39, 168, 39) + box(170, 26, 92, 'update LiDAR') + farrow(262, 39, 276, 39) + box(278, 26, 60, 'predict') + farrow(338, 39, 352, 39) + box(354, 26, 100, 'update camera') + farrow(454, 39, 468, 39) + box(470, 26, 80, 'track x, P', 'sv-hl');
  out += ftx(8, 88, 'Fuse-then-track: gộp phép đo trước, update một lần', { class: 'sv-tag' });
  out += box(8, 98, 76, 'đo LiDAR') + box(8, 130, 76, 'đo camera') + farrow(84, 111, 110, 126) + farrow(84, 143, 110, 132);
  out += box(112, 116, 108, 'hàm gộp', 'sv-boxB') + farrow(220, 129, 236, 129) + box(238, 116, 56, 'z gộp') + farrow(294, 129, 308, 129) + box(310, 116, 60, 'predict') + farrow(370, 129, 384, 129) + box(386, 116, 66, 'update') + farrow(452, 129, 468, 129) + box(470, 116, 80, 'track x, P', 'sv-hl');
  return fsvg(560, 156, 'Track-then-fuse và fuse-then-track', out);
};

// Day 24 · Phễu dữ liệu
FIGS['data-funnel'] = function () {
  var out = '', L = [['Thô: 3–6 TB/giờ mỗi xe', 520], ['Mã hoá video: ~36 GB/giờ (≈150× nhỏ hơn)', 430], ['Bronze: nguyên bản, chỉ ghi thêm', 340], ['Silver: làm sạch, gắn cờ, cổng 1', 250], ['Gold: dataset huấn luyện, cổng 2', 170], ['vài khung có nhãn', 100]];
  L.forEach(function (l, i) {
    var y = 10 + i * 30, x = (560 - l[1]) / 2;
    out += fel('rect', { x: x, y: y, width: l[1], height: 24, rx: 5, class: i < 2 ? 'sv-img' : i < 5 ? 'sv-hl' : 'sv-boxA' });
    out += ftx(280, y + 16, l[0], { 'text-anchor': 'middle', class: 'sv-tag' });
  });
  return fsvg(560, 192, 'Phễu dữ liệu từ log thô tới dataset có nhãn', out);
};

// Day 24 · Data engine 10 bước
FIGS['data-engine'] = function () {
  var out = '', steps = ['record', 'trigger', 'ingest', 'index', 'curate', 'label', 'dataset', 'train', 'eval', 'deploy'], cx = 280, cy = 112, rx = 210, ry = 78;
  out += fel('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry, class: 'sv-ghost' });
  steps.forEach(function (s, i) {
    var a = -Math.PI / 2 + i * 2 * Math.PI / 10, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    out += fel('rect', { x: (x - 36).toFixed(1), y: (y - 12).toFixed(1), width: 72, height: 24, rx: 12, class: i === 8 || i === 4 ? 'sv-boxB' : 'sv-hl' });
    out += ftx(x.toFixed(1), (y + 4).toFixed(1), (i + 1) + ' ' + s, { 'text-anchor': 'middle', class: 'sv-tag' });
  });
  var e = [cx + rx * Math.cos(-Math.PI / 2 + 8 * Math.PI / 5), cy + ry * Math.sin(-Math.PI / 2 + 8 * Math.PI / 5)], c = [cx + rx * Math.cos(-Math.PI / 2 + 4 * Math.PI / 5), cy + ry * Math.sin(-Math.PI / 2 + 4 * Math.PI / 5)];
  out += fel('path', { d: 'M' + (e[0] + 20).toFixed(1) + ' ' + (e[1] + 8).toFixed(1) + ' Q ' + cx + ' ' + (cy + 10) + ' ' + (c[0] + 30).toFixed(1) + ' ' + (c[1] - 8).toFixed(1), class: 'sv-cut', fill: 'none', 'stroke-dasharray': '5 4' });
  out += ftx(cx, cy - 22, 'eval chỉ chỗ yếu → curate thu thêm', { 'text-anchor': 'middle', class: 'sv-tag' });
  return fsvg(560, 206, 'Vòng lặp dữ liệu 10 bước', out);
};

// Day 24 · Event time và ingestion time
FIGS['event-time'] = function () {
  var out = '', l = 90, r = 540, T = function (t) { return l + t * (r - l); };
  out += ftx(8, 16, 'event time (lúc xảy ra) →', { class: 'sv-tag' });
  [['LiDAR 10 Hz', 0.1, 40], ['camera 30 Hz', 1 / 30, 74], ['IMU 200 Hz (đến theo cụm)', 0.02, 108]].forEach(function (s) {
    out += ftx(8, s[2] + 4, s[0].split(' (')[0]) + fel('line', { x1: l, y1: s[2], x2: r, y2: s[2], class: 'sv-grid' });
    for (var t = 0; t <= 1.0001; t += s[1]) out += fel('circle', { cx: T(t).toFixed(1), cy: s[2], r: s[1] < 0.05 ? 1.6 : 3, class: s[1] < 0.05 ? 'sv-dot' : 'sv-ball' });
  });
  [0.3, 0.7].forEach(function (t) { out += fel('line', { x1: T(t), y1: 26, x2: T(t), y2: 120, class: 'sv-cut' }); });
  out += ftx(T(0.3) + 4, 134, 'ghép theo event time');
  out += fel('rect', { x: T(0.9), y: 26, width: T(1) - T(0.9), height: 94, class: 'sv-band', style: 'fill-opacity:.2' }) + ftx(T(1), 16, 'watermark: chờ dữ liệu đến muộn', { 'text-anchor': 'end' });
  return fsvg(560, 144, 'Ghép các luồng theo event time', out);
};

// Day 24 · Học chủ động so với ngẫu nhiên
FIGS['al-bars'] = function () {
  var out = '', data = [['Ngẫu nhiên', 25.67], ['Entropy', 25.91], ['Core-set', 25.96], ['Đề xuất (CDAL)', 26.62], ['Toàn bộ nhãn', 26.83]], lo = 25, hi = 27, base = 160, H = 130;
  out += fel('line', { x1: 40, y1: base, x2: 540, y2: base, class: 'sv-ax' }) + ftx(36, base + 4, '25', { 'text-anchor': 'end' }) + ftx(36, base - H + 4, '27', { 'text-anchor': 'end' });
  data.forEach(function (d, i) {
    var x = 60 + i * 96, h = (d[1] - lo) / (hi - lo) * H;
    out += fel('rect', { x: x, y: (base - h).toFixed(1), width: 60, height: h.toFixed(1), class: i === 0 ? 'sv-boxB' : i === 4 ? 'sv-boxA' : 'sv-hl' });
    out += ftx(x + 30, base - h - 6, d[1].toFixed(2).replace('.', ','), { 'text-anchor': 'middle', class: 'sv-tag' }) + ftx(x + 30, base + 16, d[0], { 'text-anchor': 'middle' });
  });
  out += ftx(40, 14, 'mIoU (trục cắt, bắt đầu từ 25) · số trong slide', { class: 'sv-tag' });
  return fsvg(560, 186, 'Học chủ động so với chọn ngẫu nhiên', out);
};

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

// Day 19 · Bốn cảm biến trong cùng một cảnh, đổi môi trường
var SENSOR_SIM = {
  title: 'Bốn cảm biến nhìn cùng một con đường',
  intro: 'Nhìn từ trên xuống: xe của bạn ở bên trái, chạy sang phải. Phía trước có một xe cùng làn (45 m), một người đi bộ trên vỉa hè (25 m), một xe sơn đen ở làn ngược chiều (72 m), một cột thấp sát cản xe (2,7 m) và rào chắn ven đường. Chọn môi trường và mức độ để xem camera, LiDAR, radar, sonar mỗi loại thấy gì, rơi vào mức S0–S3 nào, và khi ghép lại thì còn sót gì.',
  tries: ['Chọn từng cảm biến ở "Hiện cảm biến" để thấy vùng nó phủ: camera hình quạt rộng, radar hẹp mà xa, LiDAR quanh xe, sonar chỉ sát cản.', 'Trời đẹp: ba cảm biến chính thấy cả ba vật phía trước, nhưng cột thấp sát cản chỉ sonar thấy (nằm ngoài góc nhìn camera, radar và trong vùng mù gần của LiDAR trên nóc xe).', 'Nhìn bóng ma radar bên kia rào chắn: chỉ radar báo, không cảm biến nào xác nhận, nên bước hợp nhất loại bỏ.', 'Chọn "Sương mù" ở mức 100%: camera và LiDAR gần như mù, LiDAR còn sinh điểm giả sát xe; radar vẫn thấy xe phía trước.', 'Chọn "Ban đêm": camera mất người đi bộ trước tiên, còn LiDAR và radar không đổi vì tự phát sóng.', 'Chọn "Chói nắng": camera mất đúng các vật ngay phía trước, nơi mặt trời rọi vào ống kính.', 'Chọn "Mưa lớn": LiDAR mất xe sơn đen trước xe sáng màu vì bề mặt tối phản xạ ít tia laser; radar thì không quan tâm màu sơn.', 'Chọn "Cảm biến bị bẩn": mọi cảm biến cùng xuống cấp, sonar bẩn làm sót cả cột sát cản; đây là lúc cần health check và hành động theo mức S0–S3.'],
  build: function (ui) {
    var ENVS = ['Trời đẹp ban ngày', 'Ban đêm', 'Mưa lớn', 'Sương mù', 'Chói nắng ngược chiều', 'Cảm biến bị bẩn (bùn)'];
    var SHOW = ['Tất cả', 'Camera', 'LiDAR', 'Radar', 'Sonar'];
    var env = ENVS[0], show = SHOW[0], sev = 70;
    ui.select('Môi trường', ENVS, env, function (v) { env = v; draw(); });
    ui.slider({ label: 'Mức độ', min: 0, max: 100, step: 10, value: sev, fmt: function (v) { return v + '%'; } }, function (v) { sev = v; draw(); });
    ui.select('Hiện cảm biến', SHOW, show, function (v) { show = v; draw(); });
    var OBJ = [
      { k: 'car', x: 45, y: 0, name: 'xe phía trước' },
      { k: 'ped', x: 25, y: -3.5, name: 'người đi bộ' },
      { k: 'dark', x: 72, y: 4, name: 'xe sơn đen' },
      { k: 'pole', x: 1.6, y: -2.2, name: 'cột thấp sát cản' },
    ];
    var GHOST = { x: 48, y: -13 };
    // tầm tối đa (m) trong điều kiện tốt; null = không thấy được loại vật này
    var BASE = {
      cam: { car: 100, ped: 60, dark: 90, pole: 30 },
      lidar: { car: 120, ped: 80, dark: 80, pole: 50 },
      radar: { car: 160, ped: 45, dark: 160, pole: 20 },
      sonar: { car: 4.5, ped: 4.5, dark: 4.5, pole: 4.5 },
    };
    var FOV = { cam: 35, lidar: 180, radar: 25, sonar: 180 };
    var NAME = { cam: 'Camera', lidar: 'LiDAR', radar: 'Radar', sonar: 'Sonar' };
    function factor(sn, o, s) {
      var ahead = o && Math.abs(Math.atan2(o.y, o.x) * 180 / Math.PI) < 12;
      if (env === 'Ban đêm') return sn === 'cam' ? (o && o.k === 'ped' ? 1 - 0.9 * s : o && o.k === 'dark' ? 1 - 0.7 * s : 1 - 0.5 * s) : 1;
      if (env === 'Mưa lớn') return { cam: 1 - 0.5 * s, lidar: 1 - 0.4 * s, radar: 1 - 0.1 * s, sonar: 1 - 0.1 * s }[sn];
      if (env === 'Sương mù') return { cam: 1 - 0.85 * s, lidar: 1 - 0.8 * s, radar: 1, sonar: 1 }[sn];
      if (env === 'Chói nắng ngược chiều') return sn === 'cam' ? (ahead ? 1 - 0.9 * s : 1 - 0.3 * s) : sn === 'lidar' ? 1 - 0.1 * s : 1;
      if (env === 'Cảm biến bị bẩn (bùn)') return { cam: 1 - 0.7 * s, lidar: 1 - 0.5 * s, radar: 1 - 0.35 * s, sonar: 1 - 0.8 * s }[sn];
      return 1;
    }
    function sees(sn, o, s) {
      var d = Math.hypot(o.x, o.y), ang = Math.abs(Math.atan2(o.y, o.x) * 180 / Math.PI);
      if (ang > FOV[sn]) return false;
      if (sn === 'lidar' && o.k === 'pole' && d < 3) return false; // vùng mù gần của LiDAR trên nóc xe với vật thấp
      return d <= BASE[sn][o.k] * factor(sn, o, s);
    }
    function level(sn, s) {
      var f = (factor(sn, OBJ[0], s) + factor(sn, OBJ[1], s)) / 2;
      return f >= 0.85 ? ['S0', 'ok'] : f >= 0.6 ? ['S1', 'ok'] : f >= 0.3 ? ['S2', 'warn'] : ['S3', 'bad'];
    }
    var clipSeq = 0, W = 560, H = 320, KX = 5.2, KY = 11, X = function (x) { return 26 + (x + 4) * KX; }, Y = function (y) { return 14 + (8 - y) * KY; };
    function wedge(svg, range, half, cls, op) {
      var pts = [[X(0), Y(0)]];
      for (var a = -half; a <= half; a += half / 12) { var r = a * Math.PI / 180; pts.push([X(range * Math.cos(r)), Y(range * Math.sin(r))]); }
      S('polygon', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), class: cls, style: 'stroke:none;fill-opacity:' + op }, svg);
    }
    function draw() {
      var s = sev / 100, root = ui.svg(W, H), on = function (sn) { return show === 'Tất cả' || show === NAME[sn]; };
      // cảnh được cắt trong khung để vùng phủ không tràn ra chú thích
      var cid = 'sensclip' + (clipSeq++), defs = S('defs', {}, root), cp = S('clipPath', { id: cid }, defs);
      S('rect', { x: X(-4), y: Y(8), width: X(98) - X(-4), height: Y(-15) - Y(8) }, cp);
      S('rect', { x: X(-4), y: Y(8), width: X(98) - X(-4), height: Y(-15) - Y(8), class: 'sv-ghost' }, root);
      var svg = S('g', { 'clip-path': 'url(#' + cid + ')' }, root);
      // vùng phủ (tô mờ) chỉ vẽ khi chọn một cảm biến, để chế độ "Tất cả" không bị rối
      var one = function (sn) { return show === NAME[sn]; };
      if (one('lidar')) { var rl = Math.min(100, BASE.lidar.car * factor('lidar', OBJ[0], s)); S('ellipse', { cx: X(0), cy: Y(0), rx: rl * KX, ry: rl * KY, class: 'sv-band', style: 'stroke:none;fill-opacity:.12' }, svg); }
      if (one('cam')) wedge(svg, Math.min(100, BASE.cam.car * factor('cam', OBJ[0], s)), FOV.cam, 'sv-boxA', 0.45);
      if (one('radar')) wedge(svg, Math.min(100, BASE.radar.car * factor('radar', OBJ[0], s)), FOV.radar, 'sv-inter', 0.35);
      if (one('sonar')) { var rs = 4.5 * factor('sonar', null, s); S('ellipse', { cx: X(0), cy: Y(0), rx: rs * KX, ry: rs * KY, class: 'sv-boxB', style: 'fill-opacity:.5' }, svg); }
      // đường: hai làn, mép đường, rào chắn
      S('line', { x1: X(-4), y1: Y(6), x2: X(98), y2: Y(6), class: 'sv-ax' }, svg);
      S('line', { x1: X(-4), y1: Y(2), x2: X(98), y2: Y(2), class: 'sv-dash' }, svg);
      S('line', { x1: X(-4), y1: Y(-2), x2: X(98), y2: Y(-2), class: 'sv-ax' }, svg);
      S('line', { x1: X(-4), y1: Y(-6.5), x2: X(98), y2: Y(-6.5), class: 'sv-ax sv-bold' }, svg);
      T(svg, X(96), Y(-6.5) + 14, 'rào chắn', { 'text-anchor': 'end' });
      T(svg, X(96), Y(-4) + 4, 'vỉa hè', { 'text-anchor': 'end' });
      T(svg, X(96), Y(4) + 4, 'làn ngược chiều', { 'text-anchor': 'end' });
      // vật thật
      OBJ.forEach(function (o) {
        if (o.k === 'ped') S('circle', { cx: X(o.x), cy: Y(o.y), r: 5, class: 'sv-cam' }, svg);
        else if (o.k === 'pole') S('rect', { x: X(o.x) - 4, y: Y(o.y) - 4, width: 8, height: 8, class: 'sv-cam' }, svg);
        else S('rect', { x: X(o.x - 2.2), y: Y(o.y + 0.9), width: 4.4 * KX, height: 1.8 * KY, rx: 2, class: o.k === 'dark' ? 'sv-cam' : 'sv-car' }, svg);
        T(svg, X(o.x), Y(o.y) - (o.k === 'pole' ? -18 : 14), { car: 'xe 45 m', ped: 'người 25 m', dark: 'xe đen 72 m', pole: 'cột 2,7 m' }[o.k], { 'text-anchor': 'middle' });
      });
      S('rect', { x: X(-2.2), y: Y(0.9), width: 4.4 * KX, height: 1.8 * KY, rx: 2, class: 'sv-car' }, svg);
      T(svg, X(0), Y(0.9) - 6, 'xe bạn', { 'text-anchor': 'middle' });
      // phát hiện của từng cảm biến
      var seen = { cam: [], lidar: [], radar: [], sonar: [] }, rnd = (function (seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; })(7);
      OBJ.forEach(function (o) {
        ['cam', 'lidar', 'radar', 'sonar'].forEach(function (sn) { if (sees(sn, o, s)) seen[sn].push(o); });
        if (on('cam') && seen.cam.indexOf(o) >= 0) S('rect', { x: X(o.x - 3), y: Y(o.y + 1.5), width: 6 * KX, height: 3 * KY, class: 'sv-pred' }, svg);
        if (on('lidar') && seen.lidar.indexOf(o) >= 0) for (var i = 0; i < 6; i++) S('circle', { cx: X(o.x - 1.6 + (o.k === 'ped' || o.k === 'pole' ? 1.3 : 0)), cy: Y(o.y - 0.8 + i * 0.32), r: 1.6, class: 'sv-dot' }, svg);
        if (on('radar') && seen.radar.indexOf(o) >= 0) {
          var d = Math.hypot(o.x, o.y), ry = Math.max(0.8, d * Math.tan(3 * Math.PI / 180));
          S('ellipse', { cx: X(o.x), cy: Y(o.y), rx: 2.2 * KX, ry: ry * KY, class: 'sv-fuse' }, svg);
        }
        if (on('sonar') && seen.sonar.indexOf(o) >= 0) S('circle', { cx: X(o.x), cy: Y(o.y), r: 10, class: 'sv-fuse' }, svg);
      });
      // điểm giả của LiDAR do giọt nước
      var clutter = (env === 'Mưa lớn' || env === 'Sương mù') && on('lidar') ? Math.round((env === 'Sương mù' ? 45 : 30) * s) : 0;
      for (var c = 0; c < clutter; c++) { var cr = 1.5 + rnd() * 9, ca = (rnd() - 0.5) * 2 * Math.PI; S('circle', { cx: X(cr * Math.cos(ca)), cy: Y(cr * Math.sin(ca) * 0.6), r: 1.3, class: 'sv-dot' }, svg); }
      // bóng ma radar: phản xạ qua rào chắn, chỉ có khi radar thấy xe phía trước
      var ghost = seen.radar.indexOf(OBJ[0]) >= 0;
      if (ghost && on('radar')) { S('ellipse', { cx: X(GHOST.x), cy: Y(GHOST.y), rx: 2.2 * KX, ry: 2.4 * KY, class: 'sv-fuse sv-thin' }, svg); T(svg, X(GHOST.x) + 14, Y(GHOST.y) + 4, 'bóng ma radar'); }
      T(root, X(-4), H - 24, 'Camera: khung xanh dương · LiDAR: chấm cam · Radar: elip xanh lá · Sonar: vòng sát xe');
      T(root, X(-4), H - 8, 'Elip radar bè ngang vì phân giải góc kém. Chọn một cảm biến để thấy vùng phủ.');
      // kết quả
      var rows = ['cam', 'lidar', 'radar', 'sonar'].map(function (sn) {
        var lv = level(sn, s), list = seen[sn].map(function (o) { return o.name; });
        return [NAME[sn] + ' · ' + lv[0], list.length ? 'thấy ' + list.join(', ') : 'không thấy vật nào', lv[1]];
      });
      var fused = OBJ.filter(function (o) { return ['cam', 'lidar', 'radar', 'sonar'].some(function (sn) { return seen[sn].indexOf(o) >= 0; }); });
      var miss = OBJ.filter(function (o) { return fused.indexOf(o) < 0; }).map(function (o) { return o.name; });
      rows.push(['Ghép cả bốn', fused.length + '/4 vật thật' + (miss.length ? '; sót ' + miss.join(', ') : '') + (ghost ? '; bóng ma bị loại vì chỉ radar thấy' : ''), fused.length === 4 ? 'ok' : fused.length >= 3 ? 'warn' : 'bad']);
      var NOTE = {
        'Trời đẹp ban ngày': 'Điều kiện tốt: mỗi cảm biến chỉ bị giới hạn bởi tầm và góc nhìn của nó, nên cần nhiều loại để phủ hết.',
        'Ban đêm': 'Camera cần ánh sáng nên nhiễu tăng, vật tối và người đi bộ mất trước. LiDAR và radar tự phát sóng nên không bị ảnh hưởng.',
        'Mưa lớn': 'Giọt mưa phản xạ tia laser thành điểm giả sát xe và làm giảm tầm LiDAR; nước trên kính làm camera mờ. Radar bước sóng milimét gần như không bị ảnh hưởng.',
        'Sương mù': 'Giọt sương cỡ micromet tán xạ mạnh ánh sáng nhìn thấy và tia laser hồng ngoại gần, nên camera và LiDAR gần như mù; sóng radar dài cỡ milimét đi xuyên qua.',
        'Chói nắng ngược chiều': 'Mặt trời thấp ngay phía trước làm điểm ảnh cháy sáng: camera mất đúng các vật ngay trước mặt. LiDAR chỉ hơi nhiễu, radar không ảnh hưởng.',
        'Cảm biến bị bẩn (bùn)': 'Bùn che ống kính, cửa sổ LiDAR, mặt radar và đầu sonar: mọi cảm biến cùng xuống cấp. Health check phải phát hiện và hệ thống hành động theo mức S0–S3.',
      };
      rows.push(['Đọc là', NOTE[env]]);
      out(ui, rows);
    }
    draw();
  },
};

// Day 19 · Lệch do thời gian và lệch do góc lắp
var TIMING_SIM = {
  title: 'Vật lệch chỗ: do đồng hồ hay do góc lắp?',
  intro: 'Nhìn từ trên xuống. Một xe máy chạy ngang qua trước xe ở khoảng cách d. Camera thấy vị trí thật (hộp xanh); LiDAR báo vị trí lệch (hộp cam) vì hai lỗi: timestamp lệch Δt (vật đã đi thêm v·Δt) và LiDAR lắp lệch góc Δθ (lệch d·tan Δθ). Trục ngang được phóng to để thấy rõ độ lệch.',
  tries: ['Giữ mặc định 50 km/h, 50 ms: lệch khoảng 0,7 m như slide.', 'Kéo tốc độ về 0: phần lệch do thời gian biến mất. Lệch đổi theo tốc độ là dấu hiệu của đồng bộ thời gian.', 'Đặt góc lệch 1° rồi kéo d từ 30 lên 60 m: lệch do góc tăng gấp đôi theo khoảng cách, không đổi theo tốc độ: dấu hiệu của extrinsic.', 'Đặt góc 1°, d = 30 m, tốc độ 35 km/h: hai lỗi gần như triệt tiêu nhau. Một bài test ở đúng một tốc độ có thể "đẹp" mà hệ vẫn sai.', 'Bật "Bù thời gian": nội suy về thời điểm chung, phần lệch do Δt về 0.'],
  build: function (ui) {
    var kmh = 50, dt = 50, th = 0, d = 30, comp = 'Tắt';
    ui.slider({ label: 'Tốc độ xe máy (km/h)', min: 0, max: 80, step: 5, value: kmh, fmt: function (v) { return v + ' km/h'; } }, function (v) { kmh = v; draw(); });
    ui.slider({ label: 'Timestamp lệch Δt (ms)', min: 0, max: 150, step: 5, value: dt, fmt: function (v) { return v + ' ms'; } }, function (v) { dt = v; draw(); });
    ui.slider({ label: 'LiDAR lắp lệch góc Δθ', min: -3, max: 3, step: 0.25, value: th, fmt: function (v) { return vn(v) + '°'; } }, function (v) { th = v; draw(); });
    ui.slider({ label: 'Khoảng cách d (m)', min: 5, max: 80, step: 5, value: d, fmt: function (v) { return v + ' m'; } }, function (v) { d = v; draw(); });
    ui.select('Bù thời gian (nội suy)', ['Tắt', 'Bật'], comp, function (v) { comp = v; draw(); });
    var W = 560, H = 250, box = { l: 50, r: 540, t: 24, b: 214 }, maxX = 85, kx = (box.r - box.l) / maxX, ky = 16, y0 = (box.t + box.b) / 2;
    var P = function (x, y) { return [box.l + x * kx, y0 - y * ky]; };
    function draw() {
      var v = kmh / 3.6, eT = comp === 'Bật' ? 0 : -v * dt / 1000, eA = d * Math.tan(th * Math.PI / 180), e = eT + eA;
      var svg = ui.svg(W, H);
      [0, 20, 40, 60, 80].forEach(function (x) { var p = P(x, 0); S('line', { x1: p[0], y1: box.t, x2: p[0], y2: box.b, class: 'sv-grid' }, svg); T(svg, p[0], box.b + 16, x + ' m', { 'text-anchor': 'middle' }); });
      [-5, 0, 5].forEach(function (y) { var p = P(0, y); T(svg, box.l - 8, p[1] + 4, (y > 0 ? '+' : '') + y + ' m', { 'text-anchor': 'end' }); });
      S('line', { x1: box.l, y1: y0, x2: box.r, y2: y0, class: 'sv-dash' }, svg);
      var c = P(0, 0);
      S('rect', { x: c[0] - 22, y: c[1] - 8, width: 22, height: 16, rx: 3, class: 'sv-cam' }, svg);
      T(svg, c[0] - 11, c[1] - 14, 'xe', { 'text-anchor': 'middle' });
      var tp = P(d, 0), mp = P(d, e), w = Math.max(10, 2 * kx), h = 0.8 * ky;
      S('line', { x1: tp[0] + w / 2 + 8, y1: tp[1] + 30, x2: tp[0] + w / 2 + 8, y2: tp[1] - 30, class: 'sv-ray' }, svg);
      T(svg, tp[0] + w / 2 + 12, tp[1] - 22, 'hướng chạy');
      S('rect', { x: mp[0] - w / 2, y: mp[1] - h / 2, width: w, height: h, rx: 2, class: 'sv-boxB' }, svg);
      S('rect', { x: tp[0] - w / 2, y: tp[1] - h / 2, width: w, height: h, rx: 2, class: 'sv-boxA' }, svg);
      if (Math.abs(e) > 0.02) S('line', { x1: tp[0] - w / 2 - 6, y1: tp[1], x2: tp[0] - w / 2 - 6, y2: mp[1], class: 'sv-step' }, svg);
      T(svg, box.r, box.t - 8, 'xanh: vị trí thật · cam: LiDAR báo', { 'text-anchor': 'end' });
      var ae = Math.abs(e), dom = Math.abs(eT) < 0.02 && Math.abs(eA) < 0.02 ? 'Khớp: không có lệch đáng kể' : ae < 0.2 && Math.abs(eT) > 0.2 ? 'Hai lỗi đang triệt tiêu nhau: đổi tốc độ là lộ ra' : Math.abs(eT) >= Math.abs(eA) ? 'Lệch chủ yếu do thời gian → sửa đồng bộ' : 'Lệch chủ yếu do góc lắp → sửa extrinsic';
      out(ui, [['Lệch do thời gian v·Δt', vn(Math.abs(eT)) + ' m'], ['Lệch do góc d·tan Δθ', vn(Math.abs(eA)) + ' m'], ['Tổng độ lệch', vn(ae) + ' m', ae < 0.2 ? 'ok' : ae < 0.4 ? 'warn' : 'bad'], ['So với nửa bề ngang xe máy (~0,4 m)', ae < 0.4 ? 'còn trong thân xe' : 'đã ra ngoài thân xe', ae < 0.4 ? 'ok' : 'bad'], ['Đọc là', dom]]);
    }
    draw();
  },
};
SIMS.day19 = [SENSOR_SIM, TIMING_SIM];

// Day 20 · Kalman 1 chiều
var KALMAN_SIM = {
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

// Day 20 · Hai núm vặn Q và R
var QR_SIM = {
  title: 'Hai núm vặn Q và R',
  intro: 'Robot chạy trên đường ray, được ra lệnh đi 1 m mỗi bước nhưng bánh xe trượt nhẹ (thật: lệch ±0,5 m mỗi bước). Từ bước 40 đến 60 robot bị kẹt, đứng yên mà lệnh vẫn là 1 m/bước. Cảm biến đo vị trí với nhiễu ±2 m. Trục dọc là độ lệch so với kế hoạch. Đen: sự thật; chấm cam: cảm biến; xanh dương đứt: chỉ dự đoán theo lệnh; xanh lá: Kalman với Q, R bạn chọn.',
  tries: ['Bấm "Đúng thực tế" (√Q = 0,5, √R = 2): đường xanh lá bám sát đường đen, sai số nhỏ nhất.', 'Bấm "Quá tin bánh xe" (Q rất nhỏ): đường xanh lá mượt nhưng khi robot kẹt ở bước 40 nó vẫn "chạy tiếp" một lúc lâu mới nhận ra: trễ.', 'Bấm "Quá tin cảm biến" (R rất nhỏ): đường xanh lá nhảy theo từng chấm cam: chép luôn nhiễu.', 'Nhân cả hai lên: đặt √Q = 1,5, √R = 6 (cùng tỷ lệ với "Đúng thực tế"). Đường xanh lá gần như không đổi, chỉ dải bất định ±2σ rộng ra: hành vi do tỷ lệ Q : R quyết định.', 'Nhìn K trung bình: Q tăng hoặc R giảm thì K tăng (tin cảm biến hơn).'],
  build: function (ui) {
    var sq = 0.5, sr = 2;
    var iq = ui.slider({ label: 'Bộ lọc nghĩ √Q (nghi mô hình)', min: 0.02, max: 3, step: 0.02, value: sq, fmt: function (v) { return vn(v); } }, function (v) { sq = v; draw(); });
    var ir = ui.slider({ label: 'Bộ lọc nghĩ √R (nghi cảm biến)', min: 0.1, max: 8, step: 0.1, value: sr, fmt: function (v) { return vn(v, 1); } }, function (v) { sr = v; draw(); });
    var setTo = function (q, r) { iq.value = q; iq.dispatchEvent(new Event('input')); ir.value = r; ir.dispatchEvent(new Event('input')); };
    ui.button('Đúng thực tế', function () { setTo(0.5, 2); });
    ui.button('Quá tin bánh xe', function () { setTo(0.04, 2); });
    ui.button('Quá tin cảm biến', function () { setTo(0.5, 0.2); });
    // dữ liệu cố định để so sánh công bằng giữa các lần chỉnh
    var Nst = 80, r = rng(5), truth = [0], z = [], cmd = 1;
    for (var k = 1; k <= Nst; k++) truth.push(truth[k - 1] + (k > 40 && k <= 60 ? 0 : cmd + 0.5 * gauss(r)));
    for (k = 0; k <= Nst; k++) z.push(truth[k] + 2 * gauss(r));
    var W = 560, H = 270, box = { l: 44, r: 545, t: 14, b: 232 };
    function draw() {
      var Q = sq * sq, Rv = sr * sr, x = 0, P = 1, est = [0], band = [1], Ks = [], pred = [0];
      for (var k = 1; k <= Nst; k++) {
        x = x + cmd; P = P + Q;
        var K = P / (P + Rv); x = x + K * (z[k] - x); P = (1 - K) * P;
        est.push(x); band.push(Math.sqrt(P)); Ks.push(K); pred.push(k * cmd);
      }
      var dev = function (arr) { return arr.map(function (v, k) { return v - k * cmd; }); };
      var dT = dev(truth), dZ = dev(z), dE = dev(est), dP = dev(pred);
      var lo = Math.min.apply(null, dT.concat(dZ)) - 2, hi = Math.max.apply(null, dT.concat(dZ)) + 2;
      var X = function (k) { return box.l + k / Nst * (box.r - box.l); }, Y = function (v) { return box.b - (v - lo) / (hi - lo) * (box.b - box.t); };
      var svg = ui.svg(W, H), yt = [], step = (hi - lo) > 30 ? 10 : 5;
      for (var t = Math.ceil(lo / step) * step; t <= hi; t += step) yt.push([Y(t), (t > 0 ? '+' : '') + t + ' m']);
      axes(svg, box, [0, 20, 40, 60, 80].map(function (k) { return [X(k), 'bước ' + k]; }), yt);
      S('rect', { x: X(40), y: box.t, width: X(60) - X(40), height: box.b - box.t, class: 'sv-band', style: 'fill-opacity:.12' }, svg);
      T(svg, (X(40) + X(60)) / 2, box.t + 12, 'robot bị kẹt', { 'text-anchor': 'middle' });
      var bandUp = dE.map(function (v, k) { return [X(k), Y(v + 2 * band[k])]; }), bandDn = dE.map(function (v, k) { return [X(k), Y(v - 2 * band[k])]; }).reverse();
      S('polygon', { points: bandUp.concat(bandDn).map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '), class: 'sv-inter', style: 'fill-opacity:.2' }, svg);
      var line = function (arr, cls) { S('path', { d: arr.map(function (v, k) { return (k ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(''), class: cls, style: 'fill:none' }, svg); };
      line(dP, 'sv-pred sv-thin');
      dZ.forEach(function (v, k) { if (k) S('circle', { cx: X(k), cy: Y(v), r: 2.2, class: 'sv-dot' }, svg); });
      line(dT, 'sv-ax sv-bold');
      line(dE, 'sv-fuse');
      var rms = function (a) { var s = 0; for (var k = 1; k <= Nst; k++) s += Math.pow(a[k] - truth[k], 2); return Math.sqrt(s / Nst); };
      var eE = rms(est), eZ = rms(z), eP = rms(pred), kAvg = Ks.reduce(function (a, b) { return a + b; }, 0) / Ks.length;
      // trễ: sai số trung bình trong đoạn kẹt; giật: độ dao động từng bước ngoài đoạn kẹt
      var lag = 0; for (k = 41; k <= 60; k++) lag += est[k] - truth[k]; lag /= 20;
      var jit = 0, n = 0; for (k = 2; k <= 40; k++) { jit += Math.abs((est[k] - est[k - 1]) - (truth[k] - truth[k - 1])); n++; } jit /= n;
      var verdict = lag > 3 ? 'Trễ: quá tin mô hình (Q nhỏ so với R). Robot kẹt mà ước lượng vẫn chạy tiếp.' : jit > 1.3 ? 'Giật: quá tin cảm biến (R nhỏ so với Q). Ước lượng chép luôn nhiễu.' : 'Cân bằng: bám kịp thay đổi thật mà không đuổi theo nhiễu.';
      out(ui, [['Sai số Kalman (RMS)', vn(eE) + ' m', eE < 1.6 ? 'ok' : eE < 2.5 ? 'warn' : 'bad'], ['Chỉ cảm biến', vn(eZ) + ' m'], ['Chỉ dự đoán theo lệnh', vn(eP) + ' m'], ['K trung bình (tin cảm biến)', Math.round(kAvg * 100) + '%'], ['Tỷ lệ Q : R', vn(Q / Rv, 3)], ['Đọc là', verdict]]);
    }
    draw();
  },
};

// Day 20 · Đưa hình chuông qua đường cong: EKF và UKF
var EKF_UKF_SIM = {
  title: 'Hình chuông đi qua đường cong: EKF hay UKF?',
  intro: 'Hình chuông dưới trục ngang là niềm tin về x (giá trị đoán μ, độ lệch chuẩn σ). Ta đưa nó qua hàm cong y = f(x). Cột xám bên trái là phân bố thật của y (lấy 4000 mẫu); đường xanh dương là EKF (dùng tiếp tuyến, nét đứt); đường xanh lá là UKF (ba điểm sigma, chấm tròn).',
  tries: ['Giữ y = x², μ = 1, σ = 0,5: EKF ra trung bình 1, UKF ra 1,25 đúng như đáp án.', 'Kéo σ xuống 0,1: đường cong trong vùng hẹp gần như thẳng, EKF và UKF gần như trùng nhau.', 'Đặt μ = 0 với y = x²: tiếp tuyến nằm ngang nên EKF tin rằng y luôn bằng 0 với phương sai 0, sai hoàn toàn; UKF vẫn ra trung bình σ².', 'Chọn y = sin x, μ = 1,5 (gần đỉnh), σ = 1: EKF lệch rõ, UKF bám sát hơn nhiều.', 'Chọn y = x³ / 3: UKF đúng trung bình nhưng phương sai vẫn lệch một chút. UKF là xấp xỉ tốt hơn, không phải phép tính chính xác.'],
  build: function (ui) {
    var FN = {
      'y = x²': { f: function (x) { return x * x; }, d: function (x) { return 2 * x; } },
      'y = sin x': { f: function (x) { return Math.sin(x); }, d: function (x) { return Math.cos(x); } },
      'y = x³ / 3': { f: function (x) { return x * x * x / 3; }, d: function (x) { return x * x; } },
    };
    var fname = 'y = x²', mu = 1, sd = 0.5;
    ui.select('Hàm cong', Object.keys(FN), fname, function (v) { fname = v; draw(); });
    ui.slider({ label: 'Giá trị đoán μ', min: -2, max: 2.5, step: 0.1, value: mu, fmt: function (v) { return vn(v, 1); } }, function (v) { mu = v; draw(); });
    ui.slider({ label: 'Độ lệch chuẩn σ', min: 0.05, max: 1.2, step: 0.05, value: sd, fmt: function (v) { return vn(v); } }, function (v) { sd = v; draw(); });
    var W = 560, H = 360, bx = { l: 150, r: 545, t: 14, b: 262 }, N = 4000;
    function draw() {
      var F = FN[fname], r = rng(11), ys = [], i;
      for (i = 0; i < N; i++) ys.push(F.f(mu + sd * gauss(r)));
      var tm = ys.reduce(function (a, b) { return a + b; }, 0) / N;
      var tv = ys.reduce(function (a, b) { return a + (b - tm) * (b - tm); }, 0) / N;
      var em = F.f(mu), ev = Math.pow(F.d(mu) * sd, 2);
      var k = Math.sqrt(3) * sd, xs = [mu - k, mu, mu + k], w = [1 / 6, 2 / 3, 1 / 6], fy = xs.map(F.f);
      var um = fy[0] * w[0] + fy[1] * w[1] + fy[2] * w[2], uv = fy.reduce(function (a, y, j) { return a + w[j] * (y - um) * (y - um); }, 0);
      // khung toạ độ
      var x0 = mu - 3.2 * sd - 0.3, x1 = mu + 3.2 * sd + 0.3, curve = [], j;
      for (j = 0; j <= 80; j++) { var xx = x0 + (x1 - x0) * j / 80; curve.push([xx, F.f(xx)]); }
      var sorted = ys.slice().sort(function (a, b) { return a - b; });
      var lo = Math.min(sorted[Math.floor(N * 0.005)], em - 3 * Math.sqrt(ev), um - 3 * Math.sqrt(uv)), hi = Math.max(sorted[Math.floor(N * 0.995)], em + 3 * Math.sqrt(ev), um + 3 * Math.sqrt(uv));
      if (hi - lo < 0.5) { var c = (hi + lo) / 2; lo = c - 0.25; hi = c + 0.25; }
      var pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
      var X = function (x) { return bx.l + (x - x0) / (x1 - x0) * (bx.r - bx.l); }, Y = function (y) { return bx.b - (y - lo) / (hi - lo) * (bx.b - bx.t); };
      var svg = ui.svg(W, H);
      S('rect', { x: bx.l, y: bx.t, width: bx.r - bx.l, height: bx.b - bx.t, class: 'sv-ghost' }, svg);
      // đường cong và tiếp tuyến tại μ (EKF)
      S('path', { d: curve.filter(function (p) { return p[1] >= lo && p[1] <= hi; }).map(function (p, idx) { return (idx ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join(''), class: 'sv-curve' }, svg);
      var tx0 = x0, tx1 = x1, slope = F.d(mu);
      S('line', { x1: X(tx0), y1: Y(em + slope * (tx0 - mu)), x2: X(tx1), y2: Y(em + slope * (tx1 - mu)), class: 'sv-pred sv-thin' }, svg);
      T(svg, bx.r - 4, bx.t + 14, fname, { 'text-anchor': 'end' });
      // niềm tin đầu vào: hình chuông dưới trục x
      var g = function (x, m, s) { return Math.exp(-0.5 * Math.pow((x - m) / s, 2)); }, base = bx.b + 70, inP = [];
      for (j = 0; j <= 80; j++) { var xi = x0 + (x1 - x0) * j / 80; inP.push((j ? 'L' : 'M') + X(xi).toFixed(1) + ' ' + (base - 56 * g(xi, mu, sd)).toFixed(1)); }
      S('path', { d: inP.join(''), class: 'sv-curve' }, svg);
      S('line', { x1: bx.l, y1: base, x2: bx.r, y2: base, class: 'sv-ax' }, svg);
      T(svg, bx.l, base + 16, 'niềm tin về x: μ = ' + vn(mu, 1) + ', σ = ' + vn(sd));
      // điểm sigma: chiếu lên đường cong rồi sang trục y
      xs.forEach(function (x, idx) {
        S('line', { x1: X(x), y1: base, x2: X(x), y2: Y(fy[idx]), class: 'sv-fuse sv-thin' }, svg);
        S('line', { x1: X(x), y1: Y(fy[idx]), x2: bx.l, y2: Y(fy[idx]), class: 'sv-fuse sv-thin' }, svg);
        S('circle', { cx: X(x), cy: base, r: 4, class: 'sv-ball' }, svg);
        S('circle', { cx: X(x), cy: Y(fy[idx]), r: 4, class: 'sv-ball' }, svg);
      });
      // phân bố của y bên trái: histogram thật + hình chuông EKF và UKF
      var bins = 36, cnt = new Array(bins).fill(0);
      ys.forEach(function (y) { var b = Math.floor((y - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) cnt[b]++; });
      var mx = Math.max.apply(null, cnt), bh = (bx.b - bx.t) / bins;
      cnt.forEach(function (n, b) { if (n) S('rect', { x: bx.l - 8 - 120 * n / mx, y: bx.b - (b + 1) * bh, width: 120 * n / mx, height: bh, class: 'sv-band' }, svg); });
      function bell(m, v, cls) {
        var pts = [], sdv = Math.sqrt(Math.max(v, 1e-9)), peak = 0, q, yy;
        for (q = 0; q <= 120; q++) { yy = lo + (hi - lo) * q / 120; peak = Math.max(peak, g(yy, m, sdv)); }
        for (q = 0; q <= 120; q++) { yy = lo + (hi - lo) * q / 120; pts.push((q ? 'L' : 'M') + (bx.l - 8 - 120 * g(yy, m, sdv) / peak).toFixed(1) + ' ' + Y(yy).toFixed(1)); }
        S('path', { d: pts.join(''), class: cls }, svg);
      }
      if (ev > 1e-9) bell(em, ev, 'sv-pred'); else S('line', { x1: bx.l - 128, y1: Y(em), x2: bx.l - 8, y2: Y(em), class: 'sv-pred sv-bold' }, svg);
      bell(um, uv, 'sv-fuse');
      T(svg, 8, bx.t + 10, 'phân bố của y');
      var err = function (a, b) { return Math.abs(a - b); }, eE = err(em, tm) + err(Math.sqrt(ev), Math.sqrt(tv)), eU = err(um, tm) + err(Math.sqrt(uv), Math.sqrt(tv));
      out(ui, [
        ['Đúng (4000 mẫu): trung bình · độ lệch chuẩn', vn(tm) + ' · ' + vn(Math.sqrt(tv))],
        ['EKF (tiếp tuyến)', vn(em) + ' · ' + vn(Math.sqrt(ev)), eE < 0.05 * (1 + Math.abs(tm)) ? 'ok' : 'warn'],
        ['UKF (3 điểm sigma)', vn(um) + ' · ' + vn(Math.sqrt(uv)), eU < 0.05 * (1 + Math.abs(tm)) ? 'ok' : 'warn'],
        ['Đọc là', eE < 0.05 * (1 + Math.abs(tm)) && eU < 0.05 * (1 + Math.abs(tm)) ? 'Vùng chưa chắc chắn hẹp, đường cong gần như thẳng: hai cách gần như bằng nhau.' : eU < eE ? 'Đường cong uốn mạnh trong vùng chưa chắc chắn: UKF bám sát hơn EKF.' : 'Trường hợp này EKF không thua UKF.'],
      ]);
    }
    draw();
  },
};

SIMS.day20 = [KALMAN_SIM, QR_SIM, EKF_UKF_SIM];

// Day 21 · Kích thước voxel
var VOXEL_SIM = {
  title: 'Kéo kích thước voxel: chi tiết hay tốc độ?',
  intro: 'Nhìn từ trên xuống một khung LiDAR: một xe cách 14 m (nhiều điểm), một người đi bộ cách 8 m (ít điểm) và một xe đạp ở xa 32 m (rất thưa). Dải trên là toàn cảnh; ba khung dưới phóng to quanh từng vật, mỗi ô tô xanh là một voxel có điểm rơi vào. Kéo kích thước voxel để xem đổi lại được gì và mất gì.',
  tries: ['Giữ 0,20 m: người đi bộ còn vài ô, xe đạp ở xa còn nhận ra hình dạng.', 'Kéo xuống 0,05 m: tổng số ô tăng 16 lần so với 0,20 m, nhưng mỗi ô chỉ có 1–2 điểm: tốn bộ nhớ, độ trễ tăng vọt.', 'Kéo lên 1 m: người đi bộ và xe đạp chỉ còn 1–2 ô, mất hình dạng: dễ bỏ sót vật nhỏ.', 'So "Tổng số ô trong vùng cắt": tăng theo 1/v², đó là lý do không thể chọn voxel thật nhỏ cho mọi bài toán.'],
  build: function (ui) {
    var v = 0.2;
    ui.slider({ label: 'Kích thước voxel', min: 0.05, max: 1.5, step: 0.05, value: v, fmt: function (x) { return vn(x) + ' m'; } }, function (x) { v = x; draw(); });
    var r = rng(21), pts = [], i;
    for (i = 0; i < 160; i++) pts.push({ o: 'car', x: 11.75 + gauss(r) * 0.03, y: 1.1 + r() * 1.8 });
    for (i = 0; i < 160; i++) pts.push({ o: 'car', x: 11.75 + r() * 4.5, y: 1.1 + gauss(r) * 0.03 });
    for (i = 0; i < 28; i++) { var a = Math.PI * (0.6 + r() * 0.8); pts.push({ o: 'ped', x: 8 + 0.25 * Math.cos(a), y: -3 + 0.25 * Math.sin(a) }); }
    for (i = 0; i < 10; i++) pts.push({ o: 'bike', x: 31.2 + r() * 1.7, y: -1.75 + gauss(r) * 0.05 });
    var W = 560, H = 270, k = 13, X = function (x) { return 20 + x * k; }, Y = function (y) { return 14 + (5 - y) * 6; };
    // ba khung phóng to quanh từng vật: [tên, tâm x, tâm y, cạnh cửa sổ (m)]
    var ZOOM = [['xe 14 m', 14, 2, 6, 'car'], ['người 8 m', 8, -3, 1.6, 'ped'], ['xe đạp 32 m', 32, -1.75, 3, 'bike']];
    function draw() {
      var svg = ui.svg(W, H), occ = {}, byObj = { car: {}, ped: {}, bike: {} };
      pts.forEach(function (p) {
        var key = Math.floor(p.x / v) + ':' + Math.floor(p.y / v);
        occ[key] = (occ[key] || 0) + 1; byObj[p.o][key] = 1;
      });
      // dải tổng quan nhìn từ trên (không theo tỷ lệ dọc)
      S('rect', { x: X(0), y: Y(5), width: 40 * k, height: 60, class: 'sv-ghost' }, svg);
      pts.forEach(function (p) { S('circle', { cx: X(p.x), cy: Y(p.y), r: 1, class: 'sv-dot' }, svg); });
      S('rect', { x: X(0) - 4, y: Y(0) - 5, width: 10, height: 10, rx: 2, class: 'sv-car' }, svg);
      T(svg, X(0) + 10, Y(0) + 4, 'xe bạn');
      ZOOM.forEach(function (z, i) {
        var x0 = z[1] - z[3] / 2, y0 = z[2] - z[3] / 2, size = 160, s = size / z[3], ox = 14 + i * 182, oy = 96;
        S('rect', { x: X(x0), y: Y(z[2]) - 8, width: Math.max(4, z[3] * k), height: 16, class: 'sv-hull' }, svg);
        T(svg, X(z[1]), Y(z[2]) - 12, z[0], { 'text-anchor': 'middle' });
        S('line', { x1: X(z[1]), y1: Y(z[2]) + 8, x2: ox + size / 2, y2: oy - 4, class: 'sv-dash' }, svg);
        S('rect', { x: ox, y: oy, width: size, height: size, class: 'sv-ghost' }, svg);
        var px = function (x) { return ox + (x - x0) * s; }, py = function (y) { return oy + size - (y - y0) * s; };
        Object.keys(byObj[z[4]]).forEach(function (key) {
          var c = key.split(':').map(Number), rx = px(c[0] * v), ry = py((c[1] + 1) * v), w = v * s;
          // cắt ô vào trong khung phóng to
          var l = Math.max(ox, rx), t = Math.max(oy, ry), r = Math.min(ox + size, rx + w), b = Math.min(oy + size, ry + w);
          if (r > l && b > t) S('rect', { x: l, y: t, width: r - l, height: b - t, class: 'sv-hl' }, svg);
        });
        pts.forEach(function (p) { if (p.o === z[4]) S('circle', { cx: px(p.x), cy: py(p.y), r: 1.8, class: 'sv-dot' }, svg); });
        T(svg, ox + 4, oy + size + 14, z[0] + ' · cửa sổ ' + vn(z[3], 1) + ' m · ' + Object.keys(byObj[z[4]]).length + ' ô');
      });
      var total = Math.ceil(40 / v) * Math.ceil(12 / v), base = Math.ceil(40 / 0.2) * Math.ceil(12 / 0.2), nOcc = Object.keys(occ).length;
      var nPed = Object.keys(byObj.ped).length, nBike = Object.keys(byObj.bike).length;
      var verdict = nPed <= 2 ? 'Voxel quá to: vật nhỏ chỉ còn 1–2 ô, mất hình dạng.' : total > 4 * base ? 'Voxel rất nhỏ: chi tiết tốt nhưng bộ nhớ và độ trễ tăng mạnh.' : 'Cân bằng: vật nhỏ vẫn còn hình dạng, số ô vừa phải.';
      out(ui, [['Tổng số ô trong vùng cắt 40 × 12 m', total.toLocaleString('vi-VN') + ' (×' + vn(total / base, 1) + ' so với 0,2 m)', total > 4 * base ? 'warn' : 'ok'], ['Ô có điểm', String(nOcc)], ['Điểm trung bình mỗi ô có điểm', vn(pts.length / nOcc, 1)], ['Người đi bộ chiếm', nPed + ' ô', nPed <= 2 ? 'bad' : 'ok'], ['Xe đạp ở xa chiếm', nBike + ' ô', nBike <= 2 ? 'bad' : 'ok'], ['Đọc là', verdict]]);
    }
    draw();
  },
};

// Day 21 · Chiếu LiDAR lên ảnh
var PROJ_SIM = {
  title: 'Chiếu điểm LiDAR lên ảnh và làm lệch hiệu chuẩn',
  intro: 'Một xe đỗ phía trước, cách camera 15 m. Hộp xanh là xe trong ảnh; chấm cam là điểm LiDAR chiếu lên ảnh bằng s·[u, v, 1]ᵀ = K·[R | t]·[x, y, z, 1]ᵀ, với fx = fy = 500 px trên ảnh 640 × 360. Hiệu chuẩn đúng thì chấm nằm gọn trên xe.',
  tries: ['Đặt lệch yaw 1°: cả đám điểm trượt ngang khoảng 500 × tan 1° ≈ 9 px.', 'Đặt lệch tịnh tiến 20 cm: ở 15 m chỉ lệch khoảng 6–7 px; vật càng gần thì lệch tịnh tiến càng lớn.', 'Chọn "Ảnh thu nhỏ 0,5×, quên scale K": điểm bay khỏi xe dù hiệu chuẩn không đổi.', 'Chọn "Quên lọc z ≤ 0": điểm của chiếc xe phía sau camera bị lật ra trước, thành vật ma trên ảnh.'],
  build: function (ui) {
    var yaw = 0, tx = 0, mode = 'Ảnh gốc 640 × 360', filt = 'Lọc điểm sau camera (z > 0)';
    ui.slider({ label: 'Lệch yaw extrinsic', min: -3, max: 3, step: 0.25, value: yaw, fmt: function (v) { return vn(v) + '°'; } }, function (v) { yaw = v; draw(); });
    ui.slider({ label: 'Lệch tịnh tiến ngang', min: -40, max: 40, step: 5, value: tx, fmt: function (v) { return v + ' cm'; } }, function (v) { tx = v; draw(); });
    ui.select('Kích thước ảnh', ['Ảnh gốc 640 × 360', 'Ảnh thu nhỏ 0,5×, có scale K', 'Ảnh thu nhỏ 0,5×, quên scale K'], mode, function (v) { mode = v; draw(); });
    ui.select('Lọc độ sâu', ['Lọc điểm sau camera (z > 0)', 'Quên lọc z ≤ 0'], filt, function (v) { filt = v; draw(); });
    // điểm trong hệ camera (x phải, y xuống, z tới trước), camera cao 1,6 m
    var car = [], ground = [], back = [], i, j;
    for (i = 0; i <= 8; i++) for (j = 0; j <= 6; j++) car.push([0.6 + i * 0.225, 0.1 + j * 0.25, 15]);
    for (i = 1; i <= 6; i++) for (j = 0; j <= 4; j++) car.push([0.6, 0.35 + j * 0.25, 15 + i * 0.7]);
    for (i = 0; i <= 10; i++) for (j = 0; j <= 4; j++) ground.push([-5 + i, 1.6, 6 + j * 7]);
    for (i = 0; i <= 6; i++) for (j = 0; j <= 4; j++) back.push([-1.5 + i * 0.3, 0.2 + j * 0.3, -6]);
    var W = 560, H = 315, f0 = 500, cx0 = 320, cy0 = 180;
    function proj(p, sK, perturb) {
      var x = p[0], y = p[1], z = p[2];
      if (perturb) {
        var a = yaw * Math.PI / 180, x2 = x * Math.cos(a) + z * Math.sin(a), z2 = -x * Math.sin(a) + z * Math.cos(a);
        x = x2 + tx / 100; z = z2;
      }
      return [sK * (f0 * x / z + cx0), sK * (f0 * y / z + cy0), z];
    }
    function draw() {
      var s = mode === 'Ảnh gốc 640 × 360' ? 1 : 0.5, sK = mode.indexOf('quên') >= 0 ? 1 : s, iw = 640 * s, ih = 360 * s, D = W / iw;
      var svg = ui.svg(W, H), inImg = function (q) { return q[0] >= 0 && q[0] <= iw && q[1] >= 0 && q[1] <= ih; };
      S('rect', { x: 0, y: 0, width: W, height: H, class: 'sv-img' }, svg);
      S('line', { x1: 0, y1: cy0 * s * D, x2: W, y2: cy0 * s * D, class: 'sv-dash' }, svg);
      var truth = car.map(function (p) { return proj(p, s, false); });
      var bx = { l: Math.min.apply(null, truth.map(function (q) { return q[0]; })), r: Math.max.apply(null, truth.map(function (q) { return q[0]; })), t: Math.min.apply(null, truth.map(function (q) { return q[1]; })), b: Math.max.apply(null, truth.map(function (q) { return q[1]; })) };
      S('rect', { x: bx.l * D, y: bx.t * D, width: (bx.r - bx.l) * D, height: (bx.b - bx.t) * D, rx: 3, class: 'sv-boxA' }, svg);
      T(svg, bx.l * D, bx.t * D - 6, 'xe trong ảnh');
      var shown = 0;
      ground.forEach(function (p) { var q = proj(p, sK, true); if (q[2] > 0 && inImg(q)) { shown++; S('circle', { cx: q[0] * D, cy: q[1] * D, r: 1.8, class: 'sv-dot' }, svg); } });
      var inside = 0, err = 0, carShown = 0;
      car.forEach(function (p, k) {
        var q = proj(p, sK, true);
        err += Math.hypot(q[0] - truth[k][0], q[1] - truth[k][1]);
        if (q[0] >= bx.l - 0.5 && q[0] <= bx.r + 0.5 && q[1] >= bx.t - 0.5 && q[1] <= bx.b + 0.5) inside++;
        if (inImg(q)) { carShown++; shown++; S('circle', { cx: q[0] * D, cy: q[1] * D, r: 2.4, class: 'sv-ball' }, svg); }
      });
      var ghosts = 0;
      if (filt !== 'Lọc điểm sau camera (z > 0)') back.forEach(function (p) { var q = proj(p, sK, true); if (inImg(q)) { ghosts++; shown++; S('circle', { cx: q[0] * D, cy: q[1] * D, r: 3, class: 'sv-hull' }, svg); } });
      if (ghosts) T(svg, 8, H - 10, 'vòng đứt nét: điểm sau camera bị lật ra trước (vật ma)');
      var pctIn = inside / car.length * 100, mErr = err / car.length;
      out(ui, [['Điểm của xe nằm trong hộp', vn(pctIn, 0) + '%', pctIn > 95 ? 'ok' : pctIn > 60 ? 'warn' : 'bad'], ['Lệch trung bình', vn(mErr, 1) + ' px', mErr < 2 ? 'ok' : mErr < 8 ? 'warn' : 'bad'], ['Điểm hiện trên ảnh', String(shown)], ['Vật ma từ sau camera', String(ghosts), ghosts ? 'bad' : 'ok']]);
    }
    draw();
  },
};

// Day 22 · MOTA và IDF1
var MOT_SIM = {
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

SIMS.day21 = [VOXEL_SIM, PROJ_SIM];

// Day 22 · Hungarian và ghép tham lam
var HUNGARIAN_SIM = {
  title: 'Ghép track với hộp: tham lam hay Hungarian?',
  intro: 'Bảng chi phí 3 × 3: hàng là track dự đoán (T1–T3), cột là hộp mới (D1–D3); số càng nhỏ càng giống. Ghép tham lam chọn ô rẻ nhất trước rồi khoá hàng và cột. Hungarian tìm cách ghép có tổng nhỏ nhất. Ngưỡng chi phí loại các cặp quá tệ dù đã được chọn.',
  tries: ['Giữ "Ví dụ trong slide": tham lam chọn 1 rồi 3 rồi buộc phải lấy 8, tổng 12; Hungarian chọn 2 + 2 + 3 = 7.', 'Bấm "Ma trận khác" vài lần: có lúc hai cách cho cùng kết quả, nhưng Hungarian không bao giờ tệ hơn.', 'Kéo ngưỡng chi phí xuống 5: cặp có chi phí 6, 7, 8 bị loại dù Hungarian đã chọn; track đó sang trạng thái Lost và hộp thừa sinh track mới.'],
  build: function (ui) {
    var SLIDE = [[1, 2, 6], [2, 8, 7], [6, 7, 3]], M = SLIDE, gate = 10, seed = 1;
    ui.button('Ví dụ trong slide', function () { M = SLIDE; draw(); });
    ui.button('Ma trận khác', function () { var r = rng(++seed * 7919); M = [0, 1, 2].map(function () { return [0, 1, 2].map(function () { return 1 + Math.floor(r() * 9); }); }); draw(); });
    ui.slider({ label: 'Ngưỡng chi phí tối đa', min: 1, max: 10, step: 1, value: gate, fmt: function (x) { return x >= 10 ? 'không loại' : '≤ ' + x; } }, function (x) { gate = x; draw(); });
    var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    function draw() {
      // tham lam: lần lượt chọn ô nhỏ nhất còn trống
      var used = { r: {}, c: {} }, greedy = [], step;
      for (step = 0; step < 3; step++) {
        var best = null;
        for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) if (!used.r[i] && !used.c[j] && (!best || M[i][j] < best[2])) best = [i, j, M[i][j]];
        used.r[best[0]] = used.c[best[1]] = 1; greedy.push(best);
      }
      var gSum = greedy.reduce(function (a, g) { return a + g[2]; }, 0);
      var opt = perms.reduce(function (b, p) { var s = M[0][p[0]] + M[1][p[1]] + M[2][p[2]]; return !b || s < b.s ? { p: p, s: s } : b; }, null);
      var W = 560, H = 210, svg = ui.svg(W, H);
      function grid(ox, title, mark) {
        T(svg, ox, 18, title, { class: 'sv-tag' });
        for (var j = 0; j < 3; j++) T(svg, ox + 52 + j * 62, 40, 'D' + (j + 1), { 'text-anchor': 'middle' });
        for (var i = 0; i < 3; i++) {
          T(svg, ox, 72 + i * 48, 'T' + (i + 1));
          for (j = 0; j < 3; j++) {
            var m = mark(i, j), x = ox + 24 + j * 62, y = 48 + i * 48;
            S('rect', { x: x, y: y, width: 56, height: 42, rx: 6, class: m ? (m.rej ? 'sv-boxB' : 'sv-hl') : 'sv-ghost' }, svg);
            T(svg, x + 28, y + 26, String(M[i][j]), { 'text-anchor': 'middle', class: 'sv-tag' });
            if (m && m.n) T(svg, x + 50, y + 14, String(m.n), { 'text-anchor': 'end' });
            if (m && m.rej) S('line', { x1: x + 6, y1: y + 36, x2: x + 50, y2: y + 6, class: 'sv-cut' }, svg);
          }
        }
      }
      grid(10, 'Tham lam: tổng ' + gSum, function (i, j) { for (var s = 0; s < 3; s++) if (greedy[s][0] === i && greedy[s][1] === j) return { n: s + 1, rej: M[i][j] > gate }; return null; });
      grid(290, 'Hungarian: tổng ' + opt.s, function (i, j) { return opt.p[i] === j ? { rej: M[i][j] > gate } : null; });
      var kept = opt.p.filter(function (j, i) { return M[i][j] <= gate; }).length;
      out(ui, [['Tổng chi phí tham lam', String(gSum), gSum > opt.s ? 'warn' : 'ok'], ['Tổng chi phí Hungarian', String(opt.s), 'ok'], ['Cặp Hungarian giữ lại sau ngưỡng', kept + '/3', kept < 3 ? 'warn' : 'ok'], ['Đọc là', gSum > opt.s ? 'Tham lam lấy ô rẻ trước nên buộc phải nhận một cặp rất tệ ở cuối; Hungarian tối ưu cả bảng.' : 'Lần này hai cách trùng nhau; Hungarian không bao giờ cho tổng lớn hơn.']]);
    }
    draw();
  },
};

// Day 22 · ByteTrack: giữ track bằng hộp điểm thấp
var BYTE_SIM = {
  title: 'ByteTrack: đừng vứt hộp điểm thấp',
  intro: 'Một người đi qua 30 khung, bị cột che từ khung 11 đến 19 nên điểm tin cậy (score) tụt xuống. Rải rác có vài hộp báo nhầm (FP) điểm thấp ở chỗ khác. Hàng dưới so hai cách: SORT chỉ dùng hộp có score ≥ τ; ByteTrack dùng thêm hộp điểm thấp ở vòng ghép thứ hai, nhưng không bao giờ tạo track mới từ chúng.',
  tries: ['Giữ τ = 0,60: SORT mất người suốt lúc bị che, track bị xoá và khi người hiện lại thì nhận ID mới (đổi ID). ByteTrack giữ nguyên ID.', 'Hạ τ xuống 0,30: SORT không còn mất người, nhưng mọi hộp báo nhầm cũng thành track: FP tăng.', 'Tăng track_buffer lên 10: SORT giữ được ID nhưng vẫn mất 9 khung không có vị trí.', 'Ý chính: ByteTrack cho phép đặt τ cao (ít báo nhầm) mà không đánh rơi người bị che.'],
  build: function (ui) {
    var tau = 0.6, buf = 3, N = 30;
    ui.slider({ label: 'Ngưỡng điểm cao τ', min: 0.2, max: 0.9, step: 0.05, value: tau, fmt: function (x) { return vn(x); } }, function (x) { tau = x; draw(); });
    ui.slider({ label: 'track_buffer (khung)', min: 1, max: 12, step: 1, value: buf, fmt: function (x) { return x + ' khung'; } }, function (x) { buf = x; draw(); });
    var occl = [0.55, 0.48, 0.4, 0.35, 0.3, 0.33, 0.4, 0.5, 0.58], score = [], f;
    for (f = 1; f <= N; f++) score[f] = f >= 11 && f <= 19 ? occl[f - 11] : 0.88 + 0.04 * Math.sin(f);
    var FP = { 4: 0.35, 8: 0.5, 15: 0.42, 23: 0.55, 27: 0.38 };
    function run(byte) {
      var id = 0, cur = 0, lost = 0, rows = [], idsw = 0, missed = 0, fpOut = 0;
      for (var f = 1; f <= N; f++) {
        var s = score[f], high = s >= tau, low = !high && s >= 0.1, matched = false;
        if (high) {
          if (cur && lost <= buf) matched = true;
          else { if (cur) idsw++; id++; cur = id; matched = true; }
        } else if (byte && low && cur && lost <= buf) matched = true;
        if (matched) { lost = 0; rows.push(cur); }
        else { if (cur) { lost++; if (lost > buf) { rows.push(-2); } else rows.push(-1); } else rows.push(-2); missed++; }
        if (FP[f] && FP[f] >= tau) fpOut++;
      }
      return { rows: rows, idsw: idsw, missed: missed, fp: fpOut };
    }
    function draw() {
      var W = 560, H = 230, l = 92, r = 548, cw = (r - l) / N, svg = ui.svg(W, H), sy = function (v) { return 90 - v * 70; };
      T(svg, 4, 24, 'score');
      S('line', { x1: l, y1: sy(tau), x2: r, y2: sy(tau), class: 'sv-step' }, svg);
      T(svg, r, sy(tau) - 4, 'τ = ' + vn(tau), { 'text-anchor': 'end' });
      S('rect', { x: l + 10 * cw, y: 14, width: 9 * cw, height: 78, class: 'sv-band', style: 'fill-opacity:.12' }, svg);
      T(svg, l + 14.5 * cw, 12, 'bị cột che', { 'text-anchor': 'middle' });
      var d = ''; for (var f = 1; f <= N; f++) d += (f > 1 ? 'L' : 'M') + (l + (f - 0.5) * cw).toFixed(1) + ' ' + sy(score[f]).toFixed(1);
      S('path', { d: d, class: 'sv-fuse', style: 'fill:none' }, svg);
      Object.keys(FP).forEach(function (k) { var x = l + (k - 0.5) * cw, y = sy(FP[k]); S('path', { d: 'M' + (x - 4) + ' ' + (y - 4) + 'L' + (x + 4) + ' ' + (y + 4) + 'M' + (x + 4) + ' ' + (y - 4) + 'L' + (x - 4) + ' ' + (y + 4), class: 'sv-cut' }, svg); });
      var res = [run(false), run(true)];
      ['SORT-style', 'ByteTrack'].forEach(function (name, m) {
        var y = 112 + m * 46;
        T(svg, 4, y + 22, name, { class: 'sv-tag' });
        res[m].rows.forEach(function (v, i) {
          var cls = v === -1 ? 'sv-lost' : v === -2 ? 'sv-ghost' : 'sv-id' + Math.min(3, v);
          S('rect', { x: l + i * cw + 1, y: y, width: cw - 2, height: 32, rx: 3, class: cls }, svg);
        });
      });
      T(svg, l, H - 8, 'màu = ID (đổi màu = đổi ID) · viền đỏ đứt: Lost · ô trống: không có track · ✕: báo nhầm');
      out(ui, [['SORT: đổi ID · khung mất · FP', res[0].idsw + ' · ' + res[0].missed + ' · ' + res[0].fp, res[0].idsw || res[0].fp ? 'warn' : 'ok'], ['ByteTrack: đổi ID · khung mất · FP', res[1].idsw + ' · ' + res[1].missed + ' · ' + res[1].fp, res[1].idsw || res[1].fp ? 'warn' : 'ok'], ['Đọc là', res[0].idsw && !res[1].idsw ? 'Hộp điểm thấp lúc bị che là người thật chứ không phải rác: ByteTrack dùng chúng để giữ ID.' : res[0].fp ? 'τ thấp thì cả hai đều nhận hộp báo nhầm thành track: phải giữ τ cao.' : 'Ở thiết lập này hai cách gần như nhau.']]);
    }
    draw();
  },
};

SIMS.day22 = [HUNGARIAN_SIM, BYTE_SIM, MOT_SIM];

// Day 23 · Khoảng cách từ chân xe
var GROUND_SIM = {
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

// Day 23 · Radar chỉ thấy vận tốc hướng tâm
var RADAR_SIM = {
  title: 'Radar Doppler: chỉ thấy một nửa vận tốc',
  intro: 'Nhìn từ trên xuống: radar ở bên trái, nhìn sang phải. Một xe cách 30 m theo góc φ, đang chạy theo hướng ψ với tốc độ v. Mũi tên xanh lá là phần radar đo được (dọc tia nhìn); mũi tên đứt nét là phần vuông góc mà radar không thấy.',
  tries: ['Giữ mặc định (φ = 25°, ψ = 100°, v = 15 m/s): radar đo +3,9 m/s đang ra xa, bỏ sót 14,5 m/s như slide.', 'Đặt ψ = φ (xe chạy thẳng ra xa theo tia nhìn): radar đo đủ cả 15 m/s.', 'Đặt ψ = φ + 90° (xe chạy ngang qua trục nhìn): Doppler gần 0 dù xe chạy nhanh. Vì vậy cần camera/LiDAR cho hướng và vị trí.', 'Đặt ψ = φ + 180°: xe lao thẳng về phía radar, vận tốc hướng tâm âm (đang lại gần).'],
  build: function (ui) {
    var phi = 25, psi = 100, v = 15;
    ui.slider({ label: 'Góc vị trí xe φ', min: -60, max: 60, step: 5, value: phi, fmt: function (x) { return x + '°'; } }, function (x) { phi = x; draw(); });
    ui.slider({ label: 'Hướng xe chạy ψ', min: 0, max: 355, step: 5, value: psi, fmt: function (x) { return x + '°'; } }, function (x) { psi = x; draw(); });
    ui.slider({ label: 'Tốc độ v', min: 0, max: 30, step: 1, value: v, fmt: function (x) { return x + ' m/s'; } }, function (x) { v = x; draw(); });
    var W = 560, H = 300, ox = 50, oy = 170, R0 = 300, k = 7;
    function draw() {
      var svg = ui.svg(W, H), rad = Math.PI / 180, ux = Math.cos(phi * rad), uy = Math.sin(phi * rad);
      var tx = ox + R0 * ux, ty = oy - R0 * uy, vx = v * Math.cos(psi * rad), vy = v * Math.sin(psi * rad);
      var vr = vx * ux + vy * uy, vt = Math.sqrt(Math.max(0, v * v - vr * vr));
      [-60, 60].forEach(function (a) { S('line', { x1: ox, y1: oy, x2: ox + 340 * Math.cos(a * rad), y2: oy - 340 * Math.sin(a * rad), class: 'sv-dash' }, svg); });
      S('rect', { x: ox - 16, y: oy - 10, width: 16, height: 20, rx: 3, class: 'sv-cam' }, svg); T(svg, ox - 14, oy + 26, 'radar');
      S('line', { x1: ox, y1: oy, x2: tx, y2: ty, class: 'sv-ray' }, svg); T(svg, ox + 120 * ux, oy - 120 * uy - 8, 'tia nhìn');
      S('rect', { x: tx - 10, y: ty - 10, width: 20, height: 20, rx: 4, class: 'sv-car' }, svg);
      function arrow(x2, y2, cls, dash) {
        S('line', { x1: tx, y1: ty, x2: x2, y2: y2, class: cls, style: dash ? 'stroke-dasharray:5 4' : '' }, svg);
        var an = Math.atan2(y2 - ty, x2 - tx); S('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - 9 * Math.cos(an - 0.4)) + ' ' + (y2 - 9 * Math.sin(an - 0.4)) + 'L' + (x2 - 9 * Math.cos(an + 0.4)) + ' ' + (y2 - 9 * Math.sin(an + 0.4)) + 'Z', class: 'sv-cam' }, svg);
      }
      if (v > 0) {
        arrow(tx + k * vx, ty - k * vy, 'sv-pred sv-bold');
        T(svg, tx + k * vx + 6, ty - k * vy, 'v = ' + v + ' m/s');
        if (Math.abs(vr) > 0.05) arrow(tx + k * vr * ux, ty - k * vr * uy, 'sv-fuse sv-bold');
        var px = vx - vr * ux, py = vy - vr * uy;
        if (vt > 0.05) arrow(tx + k * px, ty - k * py, 'sv-ax', true);
      }
      var c = v ? Math.abs(vr) / v : 1;
      out(ui, [['Radar đo (hướng tâm)', (vr >= 0 ? '+' : '') + vn(vr, 1) + ' m/s · ' + (Math.abs(vr) < 0.05 ? 'đứng yên theo tia' : vr > 0 ? 'đang ra xa' : 'đang lại gần'), 'ok'], ['Phần không thấy (vuông góc)', vn(vt, 1) + ' m/s', vt > v * 0.7 ? 'bad' : vt > v * 0.3 ? 'warn' : 'ok'], ['Tỷ lệ radar thấy', Math.round(c * 100) + '%'], ['Đọc là', v === 0 ? 'Xe đứng yên.' : c < 0.2 ? 'Xe chạy gần như ngang qua tia nhìn: Doppler gần 0, radar tưởng xe chậm.' : c > 0.95 ? 'Xe chạy dọc tia nhìn: radar đo gần đủ tốc độ.' : 'Radar chỉ đo được thành phần dọc tia; hướng và tốc độ đầy đủ cần ghép với camera/LiDAR.']]);
    }
    draw();
  },
};

// Day 23 · Lift-splat: rải đặc trưng pixel theo phân phối độ sâu
var LSS_SIM = {
  title: 'Lift-splat: một pixel rải lên BEV theo độ sâu',
  intro: 'Nhìn từ trên xuống dọc tia của một pixel. Vật thật nằm ở độ sâu d (khung xanh). Mạng không biết chắc độ sâu nên đoán một phân phối (cột cam) quanh giá trị μ với độ không chắc σ, rồi rải đặc trưng của pixel vào các ô BEV theo đúng tỷ lệ đó (ô càng đậm càng nhận nhiều đặc trưng).',
  tries: ['Giữ σ = 3 m, μ = d = 30 m: chỉ khoảng một nửa đặc trưng rơi sát vật, phần còn lại nhoè ra hai bên. Kéo σ xuống 1,5 m thì phần lớn rơi đúng chỗ.', 'Kéo σ lên 12 m: đặc trưng nhoè dọc cả tia, ô đúng chỉ nhận một phần nhỏ. Đây là lý do BEVDepth giám sát độ sâu bằng LiDAR.', 'Giữ σ nhỏ nhưng đặt μ = 20 m (đoán sai mà rất tự tin): đặc trưng dồn vào chỗ không có gì, sinh vật ma.', 'Vật càng xa (d = 50 m) thì cùng một σ tương đối càng trải rộng hơn theo mét.'],
  build: function (ui) {
    var d = 30, mu = 30, sg = 3, bin = 2, N = 30;
    ui.slider({ label: 'Độ sâu thật của vật d', min: 6, max: 56, step: 2, value: d, fmt: function (x) { return x + ' m'; } }, function (x) { d = x; draw(); });
    ui.slider({ label: 'Mạng đoán độ sâu μ', min: 6, max: 56, step: 2, value: mu, fmt: function (x) { return x + ' m'; } }, function (x) { mu = x; draw(); });
    ui.slider({ label: 'Độ không chắc σ', min: 1, max: 15, step: 0.5, value: sg, fmt: function (x) { return vn(x, 1) + ' m'; } }, function (x) { sg = x; draw(); });
    var W = 560, H = 240, l = 50, r = 545, base = 130, X = function (m) { return l + m / (N * bin) * (r - l); };
    function draw() {
      var svg = ui.svg(W, H), w = [], s = 0, i;
      for (i = 0; i < N; i++) { var c = (i + 0.5) * bin, g = Math.exp(-0.5 * Math.pow((c - mu) / sg, 2)); w.push(g); s += g; }
      w = w.map(function (x) { return x / s; });
      var mx = Math.max.apply(null, w);
      S('rect', { x: l - 34, y: base - 8, width: 18, height: 16, rx: 3, class: 'sv-cam' }, svg); T(svg, l - 36, base + 24, 'camera');
      for (i = 0; i < N; i++) {
        var x0 = X(i * bin), x1 = X((i + 1) * bin);
        S('rect', { x: x0, y: base - 10, width: x1 - x0 - 1, height: 20, class: 'sv-hl', style: 'fill-opacity:' + (0.05 + 0.95 * w[i] / mx).toFixed(2) + ';stroke-opacity:.3' }, svg);
        S('rect', { x: x0 + 1, y: base - 16 - 70 * w[i] / mx, width: x1 - x0 - 3, height: 70 * w[i] / mx, class: 'sv-band', style: 'fill-opacity:.7' }, svg);
      }
      S('line', { x1: l, y1: base, x2: r, y2: base, class: 'sv-ray' }, svg);
      S('rect', { x: X(d - 2.25), y: base - 14, width: X(4.5) - X(0), height: 28, rx: 3, class: 'sv-boxA', style: 'fill-opacity:0' }, svg);
      T(svg, X(d), base + 30, 'vật thật', { 'text-anchor': 'middle' });
      [0, 10, 20, 30, 40, 50, 60].forEach(function (m) { T(svg, X(m), H - 30, m + ' m', { 'text-anchor': 'middle' }); });
      T(svg, l, 18, 'cột cam: phân phối độ sâu mạng đoán · dải ô: đặc trưng rải lên BEV dọc tia');
      var near = 0; for (i = 0; i < N; i++) if (Math.abs((i + 0.5) * bin - d) <= 2.5) near += w[i];
      var spread = 0; w.forEach(function (x, j) { if (x > 0.02) spread += bin; });
      out(ui, [['Đặc trưng rơi trong ±2,5 m quanh vật', Math.round(near * 100) + '%', near > 0.6 ? 'ok' : near > 0.25 ? 'warn' : 'bad'], ['Đặc trưng trải dài', '≈ ' + spread + ' m dọc tia'], ['Đọc là', near > 0.6 ? 'Độ sâu chắc và đúng: BEV sắc nét đúng chỗ vật.' : Math.abs(mu - d) > 2 * sg ? 'Đoán sai mà tự tin: đặc trưng dồn vào chỗ không có vật (vật ma).' : 'Độ sâu không chắc: đặc trưng nhoè dọc tia, BEV mờ.']]);
    }
    draw();
  },
};

SIMS.day23 = [GROUND_SIM, LSS_SIM, RADAR_SIM];

// Day 24 · Chia train/test
var SPLIT_SIM = {
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

// Day 24 · Định tuyến nhãn máy theo điểm tin cậy
var ROUTING_SIM = {
  title: 'Định tuyến nhãn máy: tự nhận, người kiểm hay gán lại?',
  intro: '60 nhãn do máy gán, mỗi chấm là một nhãn đặt theo điểm tin cậy (trục ngang). Chấm xanh lá là nhãn đúng, vòng đỏ đứt là nhãn sai (người chưa biết). Hai ngưỡng chia ba làn: tự chấp nhận, người kiểm, gán lại. Thời gian người làm là giả định minh hoạ: kiểm 15 s/nhãn, vẽ lại 60 s/nhãn, audit 10% làn tự nhận.',
  tries: ['Giữ 0,9 và 0,4 (như slide): vài nhãn sai vẫn lọt qua làn tự nhận, chi phí người vừa phải.', 'Hạ ngưỡng tự nhận xuống 0,6: tiết kiệm nhiều giờ người nhưng nhiều nhãn sai lọt vào dataset hơn.', 'Nâng ngưỡng tự nhận lên 0,97: gần như không lọt lỗi nhưng người phải kiểm gần hết.', 'Ngưỡng phải hiệu chỉnh trên tập gold; điểm tin cậy của mô hình không tự động bằng xác suất đúng.'],
  build: function (ui) {
    var hiT = 0.9, loT = 0.4, r = rng(24), L = [], i;
    for (i = 0; i < 60; i++) { var s = Math.min(0.995, Math.pow(r(), 0.3)), ok = r() < 0.05 + 0.95 * Math.pow(s, 2.2); L.push({ s: s, ok: ok, j: r() }); }
    ui.slider({ label: 'Ngưỡng tự chấp nhận', min: 0.5, max: 0.99, step: 0.01, value: hiT, fmt: function (x) { return '≥ ' + vn(x); } }, function (x) { hiT = Math.max(x, loT + 0.02); draw(); });
    ui.slider({ label: 'Ngưỡng gán lại', min: 0.1, max: 0.6, step: 0.02, value: loT, fmt: function (x) { return '< ' + vn(x); } }, function (x) { loT = Math.min(x, hiT - 0.02); draw(); });
    var W = 560, H = 200, l = 30, rr = 545, X = function (s) { return l + s * (rr - l); };
    function draw() {
      var svg = ui.svg(W, H);
      S('rect', { x: X(0), y: 24, width: X(loT) - X(0), height: 130, class: 'sv-boxB', style: 'fill-opacity:.25' }, svg);
      S('rect', { x: X(loT), y: 24, width: X(hiT) - X(loT), height: 130, class: 'sv-img', style: 'fill-opacity:.35' }, svg);
      S('rect', { x: X(hiT), y: 24, width: X(1) - X(hiT), height: 130, class: 'sv-hl', style: 'fill-opacity:.35' }, svg);
      T(svg, X(loT / 2), 18, 'gán lại', { 'text-anchor': 'middle', class: 'sv-tag' });
      T(svg, X((loT + hiT) / 2), 18, 'người kiểm', { 'text-anchor': 'middle', class: 'sv-tag' });
      T(svg, X((hiT + 1) / 2), 18, 'tự nhận', { 'text-anchor': 'middle', class: 'sv-tag' });
      L.forEach(function (p) { S('circle', { cx: X(p.s), cy: 34 + p.j * 110, r: 5, class: p.ok ? 'sv-id3' : 'sv-lost' }, svg); });
      S('line', { x1: l, y1: 160, x2: rr, y2: 160, class: 'sv-ax' }, svg);
      [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(function (t) { T(svg, X(t), 176, vn(t, 1), { 'text-anchor': 'middle' }); });
      T(svg, rr, 192, 'điểm tin cậy của máy', { 'text-anchor': 'end' });
      var auto = L.filter(function (p) { return p.s >= hiT; }), rev = L.filter(function (p) { return p.s >= loT && p.s < hiT; }), rel = L.filter(function (p) { return p.s < loT; });
      var leak = auto.filter(function (p) { return !p.ok; }).length, sec = rev.length * 15 + rel.length * 60 + Math.ceil(auto.length * 0.1) * 15;
      out(ui, [['Tự nhận · người kiểm · gán lại', auto.length + ' · ' + rev.length + ' · ' + rel.length], ['Nhãn sai lọt vào dataset', leak + ' (' + (auto.length ? Math.round(leak / auto.length * 100) : 0) + '% làn tự nhận)', leak === 0 ? 'ok' : leak <= 2 ? 'warn' : 'bad'], ['Thời gian người (giả định)', Math.round(sec / 60) + ' phút', sec > 30 * 60 ? 'warn' : 'ok'], ['Đọc là', leak > 2 ? 'Ngưỡng tự nhận thấp: tiết kiệm công người nhưng lỗi lọt vào dataset.' : sec > 30 * 60 ? 'An toàn nhưng tốn công: người gần như kiểm hết.' : 'Cân bằng: phần lớn nhãn tự nhận, người dồn sức vào làn khó.']]);
    }
    draw();
  },
};

// Day 24 · Bốn số, ba cách đọc hộp
var BOXFMT_SIM = {
  title: 'Bốn số, ba cách đọc: hộp sai mà không báo lỗi',
  intro: 'Ảnh 320 × 200. Bốn số [a, b, c, d] được đọc theo ba định dạng: xywh góc trên trái (COCO), xyxy hai góc (Pascal VOC, torchvision), xywh tâm hộp (YOLO, sau khi nhân lại kích thước ảnh). Cả ba đều là bốn số hợp lệ, nhưng ra ba hộp khác nhau.',
  tries: ['Giữ [100, 60, 50, 80] như slide: hộp xyxy bị méo (x2 < x1), hộp tâm lệch nửa kích thước.', 'Đặt c > a và d > b: cả ba đều "trông được", nên lỗi định dạng rất khó thấy bằng mắt nếu không vẽ thử.', 'Kéo a gần mép phải: hộp đọc theo góc trên trái tràn ra ngoài ảnh; một kiểm tra phạm vi đơn giản bắt được lỗi này.'],
  build: function (ui) {
    var a = 100, b = 60, c = 50, d = 80;
    [['a', 0, 320, a], ['b', 0, 200, b], ['c', 0, 200, c], ['d', 0, 200, d]].forEach(function (s, i) {
      ui.slider({ label: 'Số thứ ' + (i + 1) + ' (' + s[0] + ')', min: s[1], max: s[2], step: 2, value: s[3], fmt: function (x) { return String(x); } }, function (x) { if (i === 0) a = x; else if (i === 1) b = x; else if (i === 2) c = x; else d = x; draw(); });
    });
    var W = 560, H = 270, k = 1.25, ox = 20, oy = 14;
    function draw() {
      var svg = ui.svg(W, H), boxes = [['xywh góc (COCO)', a, b, a + c, b + d, 'sv-pred'], ['xyxy hai góc', a, b, c, d, 'sv-meas'], ['xywh tâm (YOLO)', a - c / 2, b - d / 2, a + c / 2, b + d / 2, 'sv-fuse']];
      S('rect', { x: ox, y: oy, width: 320 * k, height: 200 * k, class: 'sv-ghost' }, svg);
      T(svg, ox + 4, oy + 200 * k + 16, 'ảnh 320 × 200');
      boxes.forEach(function (bx, i) {
        var x1 = Math.min(bx[1], bx[3]), x2 = Math.max(bx[1], bx[3]), y1 = Math.min(bx[2], bx[4]), y2 = Math.max(bx[2], bx[4]);
        S('rect', { x: ox + x1 * k, y: oy + y1 * k, width: Math.max(1, (x2 - x1) * k), height: Math.max(1, (y2 - y1) * k), class: bx[5], style: 'fill:none;stroke-width:2.5' + (i === 1 ? ';stroke-dasharray:6 4' : '') }, svg);
        S('line', { x1: 430, y1: 30 + i * 22, x2: 452, y2: 30 + i * 22, class: bx[5], style: 'stroke-width:2.5' }, svg); T(svg, 458, 34 + i * 22, bx[0]);
      });
      function check(bx) {
        var bad = [];
        if (bx[3] <= bx[1] || bx[4] <= bx[2]) bad.push('x2 ≤ x1 hoặc y2 ≤ y1');
        if (Math.min(bx[1], bx[3]) < 0 || Math.max(bx[1], bx[3]) > 320 || Math.min(bx[2], bx[4]) < 0 || Math.max(bx[2], bx[4]) > 200) bad.push('ra ngoài ảnh');
        return bad.length ? '✗ ' + bad.join(', ') : '✓ hợp lệ';
      }
      out(ui, boxes.map(function (bx) { var ck = check(bx); return [bx[0] + ' → [x1, y1, x2, y2]', '[' + [bx[1], bx[2], bx[3], bx[4]].map(function (x) { return Math.round(x); }).join(', ') + '] ' + ck, ck.charAt(0) === '✓' ? 'ok' : 'bad']; }).concat([['YOLO thật sự lưu', 'tâm và kích thước chia cho ảnh: [' + [a / 320, b / 200, c / 320, d / 200].map(function (x) { return vn(x, 3); }).join('; ') + ']']]));
    }
    draw();
  },
};

SIMS.day24 = [BOXFMT_SIM, SPLIT_SIM, ROUTING_SIM];

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

