// Mô phỏng tương tác cho từng buổi Phase 1 (sinh từ sổ ôn p1-review). Mỗi mục: { title, intro, tries[], build(ui) }.
// ui: { controls, fig, out, slider(opts, cb) → input, select(label, options, value, cb) → select, button(label, fn), svg(w, h) }
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
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function vn(x, d) { return Number(x).toFixed(d === undefined ? 2 : d).replace('.', ','); }
function pct(x, d) { return vn(x * 100, d === undefined ? 0 : d) + '%'; }
function money(x) { return '$' + (x >= 1000 ? Math.round(x).toLocaleString('vi-VN') : vn(x, x < 1 ? 4 : 2)); }
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function out(ui, items) {
  ui.out.innerHTML = items.map(function (it) {
    return '<div class="ro' + (it[2] ? ' ro-' + it[2] : '') + (String(it[1]).length > 34 ? ' ro-wide' : '') + '"><span>' + it[0] + '</span><b>' + esc(it[1]) + '</b></div>';
  }).join('');
}
function axes(svg, box, xt, yt) {
  S('line', { x1: box.l, y1: box.b, x2: box.r, y2: box.b, class: 'sv-ax' }, svg);
  S('line', { x1: box.l, y1: box.t, x2: box.l, y2: box.b, class: 'sv-ax' }, svg);
  xt.forEach(function (t) { S('line', { x1: t[0], y1: box.b, x2: t[0], y2: box.b + 4, class: 'sv-ax' }, svg); T(svg, t[0], box.b + 16, t[1], { 'text-anchor': 'middle' }); });
  yt.forEach(function (t) { S('line', { x1: box.l - 4, y1: t[0], x2: box.r, y2: t[0], class: 'sv-grid' }, svg); T(svg, box.l - 7, t[0] + 4, t[1], { 'text-anchor': 'end' }); });
}
function setVal(inp, v) { inp.value = v; inp.dispatchEvent(new Event('input')); }
function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
function arrow(svg, x1, y1, x2, y2, cls) {
  S('line', { x1: x1, y1: y1, x2: x2, y2: y2, class: cls }, svg);
  var a = Math.atan2(y2 - y1, x2 - x1), L = 7;
  S('path', { d: 'M' + x2 + ' ' + y2 + 'L' + (x2 - L * Math.cos(a - 0.45)) + ' ' + (y2 - L * Math.sin(a - 0.45)) + 'L' + (x2 - L * Math.cos(a + 0.45)) + ' ' + (y2 - L * Math.sin(a + 0.45)) + 'Z', class: cls === 'sv-arrow-on' ? 'f-sea' : 'f-muted' }, svg);
}

/** @type {Record<string, import('../data/lessons/types').SimSpec>} */
export const SIMS = {};

// Day 1 · Nhiệt độ và token tiếp theo
SIMS.day1 = {
  title: 'Temperature quyết định token tiếp theo',
  intro: 'Model vừa đọc "Hà Nội là thủ đô của" và chấm điểm thô cho 6 token ứng viên. Softmax chia cho temperature T biến điểm thành xác suất; top_p chỉ giữ nhóm token có tổng xác suất đạt p. Bấm "Lấy mẫu 20 lần" để xem model thật sự chọn gì.',
  tries: ['Kéo temperature T xuống 0,2: "Việt Nam" gần như 100%, mọi lần lấy mẫu giống hệt nhau.', 'Kéo T lên 1,8 rồi lấy mẫu: thỉnh thoảng ra "nước", "Đông Dương"…', 'Giữ T = 1,8 và kéo top_p xuống 0,9: các token hiếm bị loại khỏi vòng chọn.', 'Để ý: model không "biết" đáp án đúng, nó chỉ rút thăm theo phân bố này.'],
  build: function (ui) {
    var toks = ['Việt Nam', 'nước', 'đất nước', 'Đông Dương', 'miền Bắc', 'tôi'];
    var z = [5.4, 1.8, 1.4, 0.9, 0.6, -0.5];
    var temp = 1, topP = 1, seed = 7, counts = null;
    ui.slider({ label: 'Temperature T (nhiệt độ)', min: 0.1, max: 2, step: 0.05, value: 1, fmt: function (v) { return vn(v); } }, function (v) { temp = v; counts = null; draw(); });
    ui.slider({ label: 'top_p', min: 0.5, max: 1, step: 0.01, value: 1, fmt: function (v) { return vn(v); } }, function (v) { topP = v; counts = null; draw(); });
    ui.button('Lấy mẫu 20 lần', function () { sample(); draw(); });
    function dist() {
      var m = Math.max.apply(null, z), e = z.map(function (v) { return Math.exp((v - m) / temp); }), s = sum(e);
      var p = e.map(function (v) { return v / s; }), keep = [], cum = 0;
      p.forEach(function (v) { keep.push(cum < topP - 1e-9); cum += v; });
      var ks = sum(p.filter(function (_, i) { return keep[i]; }));
      return { p: p, keep: keep, q: p.map(function (v, i) { return keep[i] ? v / ks : 0; }) };
    }
    function sample() {
      var d = dist(), r = rng(seed++); counts = toks.map(function () { return 0; });
      for (var n = 0; n < 20; n++) { var u = r(), c = 0; for (var i = 0; i < d.q.length; i++) { c += d.q[i]; if (u <= c) { counts[i]++; break; } } }
    }
    function draw() {
      var d = dist(), W = 580, H = 250, x0 = 120, x1 = 500, svg = ui.svg(W, H);
      T(svg, x0, 18, 'Probability chọn token (sau temperature và top_p)');
      toks.forEach(function (t, i) {
        var y = 34 + i * 34, w = (x1 - x0) * d.q[i];
        T(svg, x0 - 10, y + 16, t, { 'text-anchor': 'end', class: 'sv-tm' });
        S('rect', { x: x0, y: y, width: x1 - x0, height: 22, rx: 4, class: 'f-surface2' }, svg);
        if (d.keep[i]) S('rect', { x: x0, y: y, width: Math.max(w, 1), height: 22, rx: 4, class: i === 0 ? 'f-sea' : 'f-warn' }, svg);
        else T(svg, x0 + 8, y + 15, 'bị top_p loại');
        T(svg, x1 + 8, y + 15, pct(d.q[i], 1) + (counts ? '  ·  ×' + counts[i] : ''));
      });
      var q0 = d.q[0], kc = d.keep.filter(Boolean).length;
      var note = q0 > 0.99 ? ['Gần như tất định: luôn ra "Việt Nam"', 'ok'] : q0 > 0.8 ? ['Ổn định, thỉnh thoảng lệch', 'ok'] : q0 > 0.5 ? ['Đa dạng hơn, đôi khi ra câu lạ', 'warn'] : ['Rất ngẫu nhiên: dễ ra câu sai', 'bad'];
      out(ui, [
        ['P("Việt Nam")', pct(q0, 1)],
        ['Token còn trong vòng chọn (sau top_p)', kc + ' / 6'],
        ['20 lần lấy mẫu', counts ? toks.map(function (t, i) { return counts[i] ? t + ' ×' + counts[i] : ''; }).filter(Boolean).join(', ') : 'chưa lấy mẫu'],
        ['Nhận xét', note[0], note[1]],
      ]);
    }
    draw();
  },
};

// Day 2 · Cây quyết định cấp giải pháp
SIMS.day2 = {
  title: 'Đi qua cây quyết định: Rule, Workflow hay Agent?',
  intro: 'Trả lời lần lượt 4 câu hỏi của cây quyết định. CÓ ở câu nào thì dừng ngay ở đó; KHÔNG thì đi tiếp xuống câu sau. Chọn một ca mẫu hoặc tự trả lời từng câu.',
  tries: ['Chọn ca "Hỏi hạn nộp bài": dừng ở Rule, không cần LLM.', 'Chọn "Theo dõi cả lớp, phát hiện nhóm kẹt": đi hết cây tới Agent.', 'Với ca Agent, đổi câu 4 thành "Có": kết luận đổi thành "Chưa làm".', 'Để ý: càng đi xuống, chi phí, độ trễ và rủi ro càng tăng.'],
  build: function (ui) {
    var Q = ['1. Tác động nhỏ hoặc quá hiếm gặp?', '2. Logic viết được thành if/else?', '3. Lộ trình xử lý viết trước được?', '4. Chi phí, độ trễ, rủi ro vượt giá trị agent mang lại?'];
    var QS = ['Tác động nhỏ / hiếm gặp?', 'Viết được thành if/else?', 'Lộ trình viết trước được?', 'Chi phí & rủi ro > giá trị?'];
    var END = [
      { name: 'Không cần AI', why: 'Tác động nhỏ hoặc quá hiếm: chỉnh quy trình, làm tay.', cost: 'Thấp nhất', need: 'Không', cls: 'ok' },
      { name: 'Cấp 1 · Rule', why: 'Logic phân nhánh rành mạch, kết quả lặp lại y hệt; không cần LLM.', cost: 'Thấp; dễ test, dự đoán được', need: 'Đường chuyển người khi câu hỏi ngoài danh mục', cls: 'ok' },
      { name: 'Cấp 2 · Workflow', why: 'Các bước viết trước được; LLM chỉ xử lý ngôn ngữ ở từng bước.', cost: 'Vừa', need: 'Gate kiểm tra giữa các bước, người duyệt câu khó', cls: 'ok' },
      { name: 'Not Yet (chưa làm)', why: 'Giá trị chưa đủ bù chi phí, độ trễ và rủi ro.', cost: 'Không tốn thêm', need: 'Bổ sung dữ liệu, chốt chặn HITL rồi xét lại', cls: 'warn' },
      { name: 'Cấp 3 · Agent', why: 'Không đoán trước số bước, môi trường nhiều biến, cần nhiều tool và nguồn dữ liệu.', cost: 'Cao; lỗi cộng dồn', need: 'Guardrails, sandbox, điều kiện dừng, người duyệt', cls: 'warn' },
    ];
    var cases = {
      'Tự trả lời': null,
      'Hỏi hạn nộp bài': [0, 1, 0, 0],
      'Soạn nháp trả lời học viên, TA duyệt': [0, 0, 1, 0],
      'Theo dõi cả lớp, phát hiện nhóm kẹt': [0, 0, 0, 0],
      'Lỗi cài đặt hiếm, 2 lần mỗi năm': [1, 0, 0, 0],
      'Tự hoàn tiền khi chưa có dữ liệu đánh giá': [0, 0, 0, 1],
    };
    var a = cases['Theo dõi cả lớp, phát hiện nhóm kẹt'].slice(), sels = [];
    var caseSel = ui.select('Ca mẫu', Object.keys(cases), 'Theo dõi cả lớp, phát hiện nhóm kẹt', function (v) {
      if (cases[v]) { a = cases[v].slice(); sels.forEach(function (s, i) { s.value = a[i] ? 'Có' : 'Không'; }); }
      draw();
    });
    Q.forEach(function (q, i) {
      sels.push(ui.select(q, ['Không', 'Có'], a[i] ? 'Có' : 'Không', function (v) { a[i] = v === 'Có' ? 1 : 0; caseSel.value = 'Tự trả lời'; draw(); }));
    });
    function draw() {
      var stop = a.indexOf(1), end = stop < 0 ? 4 : stop, svg = ui.svg(600, 340);
      for (var i = 0; i < 4; i++) {
        var y = 14 + i * 64, visited = stop < 0 || i <= stop, yes = i === stop;
        var g = S('g', visited ? {} : { class: 'sv-dim' }, svg);
        S('rect', { x: 14, y: y, width: 300, height: 46, rx: 10, class: visited ? 'sv-on' : 'sv-box' }, g);
        T(g, 30, y + 28, QS[i], { class: 'sv-tb' });
        T(g, 300, y + 28, visited ? (a[i] ? 'CÓ' : 'KHÔNG') : '', { 'text-anchor': 'end', class: 'sv-tb' });
        arrow(g, 314, y + 23, 368, y + 23, yes ? 'sv-arrow-on' : 'sv-arrow');
        T(g, 341, y + 16, 'CÓ', { 'text-anchor': 'middle' });
        S('rect', { x: 372, y: y + 3, width: 214, height: 40, rx: 10, class: yes ? (END[i].cls === 'ok' ? 'sv-okbox' : 'sv-warnbox') : 'sv-box' }, g);
        T(g, 479, y + 28, END[i].name, { 'text-anchor': 'middle', class: yes ? 'sv-tb' : 'sv-tm' });
        if (i < 3) { arrow(g, 164, y + 46, 164, y + 64, visited && !yes ? 'sv-arrow-on' : 'sv-arrow'); T(g, 172, y + 59, 'KHÔNG'); }
      }
      var ya = 14 + 4 * 64, reach = stop < 0;
      arrow(svg, 164, ya - 18, 164, ya, reach ? 'sv-arrow-on' : 'sv-arrow');
      T(svg, 172, ya - 5, 'KHÔNG');
      S('rect', { x: 14, y: ya, width: 300, height: 46, rx: 10, class: reach ? 'sv-warnbox' : 'sv-box' }, svg);
      T(svg, 164, ya + 28, 'Hết đường rẽ → Cấp 3 · Agent', { 'text-anchor': 'middle', class: reach ? 'sv-tb' : 'sv-tm' });
      var e = END[end];
      out(ui, [['Cấp đề xuất', e.name, e.cls], ['Vì sao', e.why], ['Cost & latency (chi phí, độ trễ)', e.cost], ['Bắt buộc kèm theo', e.need]]);
    }
    draw();
  },
};

// Day 3 · Vòng ReAct
SIMS.day3 = {
  title: 'Bước qua từng vòng ReAct',
  intro: 'Câu hỏi: "Mua 2 iPhone dùng mã WINNER, ship về Hà Nội. Tổng bao nhiêu?" Agent có 3 tool: check_stock, get_discount, calc_shipping. Mỗi lần gọi LLM, toàn bộ lịch sử được gửi lại, nên token đầu vào tăng dần.',
  tries: ['Bấm "Bước tiếp" từng lần và đọc Thought → Action → Observation.', 'Chọn "Tool get_discount bị timeout": agent thử lại một lần rồi trả lời phần chắc chắn, không bịa mức giảm.', 'Chọn "Không có điều kiện dừng": agent gọi lặp cùng một tool tới khi chạm MAX_ITERATIONS.', 'Kéo MAX_ITERATIONS xuống 3 với ca bình thường: trần quá thấp, agent bị dừng trước khi trả lời xong.'],
  build: function (ui) {
    var A1 = { t: 'Cần kiểm tra còn hàng trước khi tính giá.', a: 'check_stock(item_name="iPhone")', o: 'Còn 15 chiếc, giá 25.000.000 đ/chiếc.' };
    var A2 = { t: 'Có hàng. Kiểm tra mã giảm giá WINNER.', a: 'get_discount(coupon_code="WINNER")', o: 'Giảm 10%.' };
    var A3 = { t: '2 × 25M = 50M, giảm 10% còn 45M. Cần phí ship.', a: 'calc_shipping(weight=0.8, destination="Hanoi")', o: '50.000 đ.' };
    var SC = {
      'Bình thường': [A1, A2, A3, { f: 'Tổng 45.050.000 đ (50M − 10% + ship 50K), giao về Hà Nội.' }],
      'Tool get_discount bị timeout': [A1, { t: A2.t, a: A2.a, o: 'ERROR: get_discount timed out after 5s', err: true }, { t: 'Tool lỗi. Thử lại một lần.', a: A2.a, o: 'ERROR: get_discount timed out after 5s', err: true }, { t: 'Không bịa mức giảm. Tính phần chắc chắn và báo rõ phần thiếu.', a: A3.a, o: A3.o }, { f: 'Tạm tính 50.050.000 đ, chưa gồm mã WINNER vì hệ thống mã giảm giá đang lỗi. Bạn thử lại sau hoặc liên hệ CSKH.' }],
      'Không có điều kiện dừng': [A1].concat([1, 2, 3, 4, 5, 6, 7, 8].map(function () { return { t: 'Cần kiểm tra còn hàng.', a: A1.a, o: 'WARNING: Duplicate tool call. Try different.', err: true }; })),
    };
    var name = 'Bình thường', maxIt = 5, pos = 0;
    ui.select('Tình huống', Object.keys(SC), name, function (v) { name = v; pos = 0; draw(); });
    ui.slider({ label: 'MAX_ITERATIONS', min: 2, max: 8, step: 1, value: 5, fmt: function (v) { return String(v); } }, function (v) { maxIt = v; pos = Math.min(pos, v); draw(); });
    ui.button('Bước tiếp', function () { pos = Math.min(pos + 1, limit()); draw(); });
    ui.button('Chạy hết', function () { pos = limit(); draw(); });
    ui.button('Làm lại', function () { pos = 0; draw(); });
    function limit() { return Math.min(SC[name].length, maxIt); }
    function draw() {
      var turns = SC[name], shown = turns.slice(0, pos), html = '', tok = [], hist = 0, tools = 0, done = false;
      shown.forEach(function (s, i) {
        tok.push(450 + 40 + hist);
        if (s.f) { html += '<li class="final"><span class="k k-f">Final ' + (i + 1) + '</span><span>' + esc(s.f) + '</span></li>'; done = true; return; }
        html += '<li><span class="k k-t">Thought ' + (i + 1) + '</span><span>' + esc(s.t) + '</span></li>';
        html += '<li><span class="k k-a">Action ' + (i + 1) + '</span><code>' + esc(s.a) + '</code></li>';
        html += '<li' + (s.err ? ' class="err"' : '') + '><span class="k ' + (s.err ? 'k-e' : 'k-o') + '">Obs ' + (i + 1) + '</span><span>' + esc(s.o) + '</span></li>';
        hist += 130; tools++;
      });
      var capped = !done && pos >= maxIt && pos < turns.length;
      if (capped) html += '<li class="err"><span class="k k-e">Dừng</span><span>Stopped: max iterations reached</span></li>';
      if (!shown.length) html = '<li class="empty">Bấm "Bước tiếp" để chạy lượt gọi LLM đầu tiên.</li>';
      ui.fig.innerHTML = '<ol class="rtrace">' + html + '</ol>';
      var W = 560, H = 132, svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Input token của từng lượt gọi LLM' }, ui.fig);
      T(svg, 10, 14, 'Input token mỗi lượt gọi LLM');
      var maxT = 450 + 40 + 130 * 8;
      tok.forEach(function (v, i) {
        var h = v / maxT * 88, x = 14 + i * 66;
        S('rect', { x: x, y: 112 - h, width: 48, height: h, rx: 4, class: 'f-sea' }, svg);
        T(svg, x + 24, 108 - h, String(v), { 'text-anchor': 'middle' });
        T(svg, x + 24, 126, 'Lượt ' + (i + 1), { 'text-anchor': 'middle' });
      });
      var state = done ? ['Đã trả lời, dừng đúng lúc', 'ok'] : capped ? ['Bị chặn bởi MAX_ITERATIONS', 'bad'] : pos ? ['Đang chạy', 'warn'] : ['Chưa chạy', ''];
      out(ui, [['Lượt gọi LLM', String(pos)], ['Lượt gọi tool', String(tools)], ['Input token cộng dồn', sum(tok).toLocaleString('vi-VN')], ['Trạng thái', state[0], state[1]]]);
    }
    draw();
  },
};

// Day 4 · Ngân sách context
SIMS.day4 = {
  title: 'Context budget và vị trí thông tin',
  intro: 'Mỗi lần gọi, system prompt, lịch sử chat, schema của tool, tài liệu truy xuất, câu hỏi và câu trả lời phải chung một cửa sổ. Mong muốn chừa 2.000 token cho câu trả lời. Biểu đồ dưới minh hoạ hình chữ U của hiện tượng lost in the middle (hình dạng, không phải số đo thật).',
  tries: ['Chọn cửa sổ 8K rồi tăng lịch sử chat: thanh "chỗ cho câu trả lời" co lại rồi biến mất.', 'Tăng số tool lên 40: schema tool cũng ăn context dù lượt này không dùng tới.', 'Kéo vị trí thông tin quan trọng về 50%: đúng đáy chữ U, dễ bị bỏ sót nhất.', 'Context càng đầy, đáy chữ U càng sâu: lý do phải nén lịch sử và chọn lọc tài liệu.'],
  build: function (ui) {
    var hist = 8, tools = 6, docs = 6, win = 32000, posI = 50;
    var WIN = { '8K': 8000, '32K': 32000, '128K': 128000 };
    ui.select('Context window (cửa sổ ngữ cảnh)', Object.keys(WIN), '32K', function (v) { win = WIN[v]; draw(); });
    ui.slider({ label: 'Chat history giữ lại (lượt × 350 token)', min: 0, max: 40, step: 1, value: hist, fmt: String }, function (v) { hist = v; draw(); });
    ui.slider({ label: 'Tool schema khai báo (tool × 250 token)', min: 0, max: 40, step: 1, value: tools, fmt: String }, function (v) { tools = v; draw(); });
    ui.slider({ label: 'RAG chunk (đoạn tài liệu × 500 token)', min: 0, max: 20, step: 1, value: docs, fmt: String }, function (v) { docs = v; draw(); });
    ui.slider({ label: 'Vị trí thông tin quan trọng', min: 0, max: 100, step: 1, value: posI, fmt: function (v) { return v + '%'; } }, function (v) { posI = v; draw(); });
    function draw() {
      var parts = [['System', 800, 'f-sea'], ['History', hist * 350, 'f-warn'], ['Tool schema', tools * 250, 'f-muted'], ['RAG chunk', docs * 500, 'f-leaf'], ['Input', 150, 'f-fg']];
      var used = sum(parts.map(function (p) { return p[1]; })), room = win - used;
      var W = 580, H = 300, x0 = 20, x1 = 560, svg = ui.svg(W, H), scale = (x1 - x0) / Math.max(win, used);
      T(svg, x0, 16, 'Context window ' + (win / 1000) + 'K token');
      var x = x0;
      parts.forEach(function (p) { var w = p[1] * scale; if (w > 0) S('rect', { x: x, y: 24, width: w, height: 30, class: p[2] }, svg); x += w; });
      if (room > 0) { S('rect', { x: x, y: 24, width: room * scale, height: 30, class: 'sv-room' }, svg); T(svg, x + 6, 44, room >= 2000 ? 'chỗ cho output' : 'thiếu chỗ cho output'); }
      S('line', { x1: x0 + win * scale, y1: 18, x2: x0 + win * scale, y2: 60, class: 'l-bad' }, svg);
      var lx = x0;
      parts.forEach(function (p) { S('rect', { x: lx, y: 68, width: 10, height: 10, class: p[2] }, svg); T(svg, lx + 14, 77, p[0]); lx += 98; });
      var box = { l: 50, r: 560, t: 112, b: 270 }, depth = 0.15 + 0.5 * Math.min(1, used / win);
      var Y = function (v) { return box.b - v * (box.b - box.t); }, X = function (p) { return box.l + p / 100 * (box.r - box.l); };
      axes(svg, box, [[X(0), 'đầu'], [X(50), 'giữa'], [X(100), 'cuối']], [[Y(1), 'cao'], [Y(0.25), 'thấp']]);
      T(svg, box.l, box.t - 8, 'Khả năng model dùng tới thông tin (minh hoạ)');
      var d = ''; for (var p = 0; p <= 100; p += 2) d += (d ? 'L' : 'M') + X(p) + ' ' + Y(0.95 - depth * Math.sin(Math.PI * p / 100));
      S('path', { d: d, class: 'sv-curve' }, svg);
      var v = 0.95 - depth * Math.sin(Math.PI * posI / 100);
      S('circle', { cx: X(posI), cy: Y(v), r: 7, class: 'sv-ball' }, svg);
      var st = used > win ? ['Vượt context window: request bị từ chối', 'bad'] : room < 2000 ? ['Output truncation: câu trả lời có thể bị cắt cụt', 'warn'] : ['Đủ chỗ cho câu trả lời', 'ok'];
      var where = posI < 20 ? ['Đầu: dễ được dùng', 'ok'] : posI > 80 ? ['Cuối: dễ được dùng', 'ok'] : posI > 35 && posI < 65 ? ['Giữa: dễ bị bỏ sót nhất', 'bad'] : ['Lưng chừng: rủi ro vừa', 'warn'];
      out(ui, [['Input token', used.toLocaleString('vi-VN')], ['Chỗ còn cho output (câu trả lời)', room > 0 ? room.toLocaleString('vi-VN') : '0'], ['Trạng thái', st[0], st[1]], ['Thông tin quan trọng nằm ở', where[0], where[1]]]);
    }
    draw();
  },
};

// Day 5 · Ngưỡng lọc: precision và recall
SIMS.day5 = {
  title: 'Kéo threshold, xem precision và recall đổi chỗ',
  intro: 'Đúng ví dụ trong slide: 100 video, 10 video xấu thật. AI chấm mỗi video một điểm "độ xấu" từ 0 đến 1; video có điểm từ ngưỡng trở lên bị chặn. Ở ngưỡng 0,5: chặn đúng 8, gỡ oan 5, bỏ lọt 2.',
  tries: ['Giữ threshold 0,5: precision 8/13 = 62%, recall 8/10 = 80%.', 'Hạ ngưỡng xuống 0,3: bắt hết video xấu nhưng gỡ oan nhiều hơn.', 'Nâng ngưỡng lên 0,8: gần như không gỡ oan nhưng bỏ lọt nhiều.', 'Đổi sang "Lọc spam tự động": ngưỡng tốt nhất dịch hẳn sang phải vì báo nhầm giờ mới là kiểu sai đắt.'],
  build: function (ui) {
    var bad = [0.95, 0.91, 0.86, 0.82, 0.77, 0.71, 0.64, 0.56, 0.42, 0.31];
    var good = [0.83, 0.69, 0.61, 0.57, 0.53], r = rng(11);
    for (var i = 0; i < 85; i++) good.push(0.02 + 0.46 * Math.pow(r(), 1.4));
    var jit = good.map(function () { return r(); });
    var W8 = { 'Lọc video cho trẻ em': [10, 1], 'Lọc spam tự động (người dùng không thấy)': [1, 10] };
    var thr = 0.5, prod = 'Lọc video cho trẻ em';
    ui.slider({ label: 'Threshold (ngưỡng chặn)', min: 0.05, max: 0.95, step: 0.01, value: thr, fmt: function (v) { return vn(v); } }, function (v) { thr = v; draw(); });
    ui.select('Sản phẩm', Object.keys(W8), prod, function (v) { prod = v; draw(); });
    function conf(t) { var tp = bad.filter(function (s) { return s >= t; }).length, fp = good.filter(function (s) { return s >= t; }).length; return { tp: tp, fn: bad.length - tp, fp: fp, tn: good.length - fp }; }
    function draw() {
      var W = 580, H = 200, box = { l: 90, r: 560, t: 20, b: 172 }, svg = ui.svg(W, H), X = function (s) { return box.l + s * (box.r - box.l); };
      axes(svg, box, [0, 0.25, 0.5, 0.75, 1].map(function (v) { return [X(v), vn(v)]; }), []);
      T(svg, box.l - 8, 58, 'Xấu thật (10)', { 'text-anchor': 'end' });
      T(svg, box.l - 8, 128, 'Lành thật (90)', { 'text-anchor': 'end' });
      S('rect', { x: X(thr), y: box.t, width: box.r - X(thr), height: box.b - box.t, class: 'f-bad-soft' }, svg);
      bad.forEach(function (s, i) { S('circle', { cx: X(s), cy: 46 + (i % 3) * 8, r: 5.5, class: s >= thr ? 'f-leaf' : 'f-bad' }, svg); });
      good.forEach(function (s, i) { S('circle', { cx: X(s), cy: 106 + jit[i] * 44, r: 4, class: s >= thr ? 'f-warn' : 'f-line' }, svg); });
      S('line', { x1: X(thr), y1: box.t, x2: X(thr), y2: box.b, class: 'l-bad' }, svg);
      T(svg, X(thr) + 4, box.t + 10, 'bị chặn →');
      var c = conf(thr), w = W8[prod], cost = w[0] * c.fn + w[1] * c.fp, best = 0.05, bc = 1e9;
      for (var t = 0.05; t <= 0.951; t += 0.01) { var k = conf(t), cc = w[0] * k.fn + w[1] * k.fp; if (cc < bc) { bc = cc; best = t; } }
      var prec = c.tp + c.fp ? c.tp / (c.tp + c.fp) : null, rec = c.tp / (c.tp + c.fn);
      out(ui, [
        ['True positive (chặn đúng)', String(c.tp), 'ok'], ['False positive (gỡ oan)', String(c.fp), c.fp ? 'warn' : ''], ['False negative (bỏ lọt)', String(c.fn), c.fn ? 'bad' : ''],
        ['Precision', prec === null ? 'không chặn gì' : pct(prec) + ' (' + c.tp + '/' + (c.tp + c.fp) + ')'], ['Recall', pct(rec) + ' (' + c.tp + '/10)'],
        ['Cost of error (trọng số minh hoạ)', w[0] + ' × FN + ' + w[1] + ' × FP = ' + cost],
        ['Threshold có cost thấp nhất', vn(best)],
      ]);
    }
    draw();
  },
};

// Day 7 · Cosine và Euclid
SIMS.day7 = {
  title: 'Hai vector, hai cách đo "giống nhau"',
  intro: 'Embedding thật có hàng trăm chiều; ở đây thu về 2 chiều để nhìn được. Cosine chỉ nhìn góc giữa hai mũi tên; khoảng cách Euclid nhìn cả độ dài. Bắt đầu với đúng bài tập trong slide: A = [1, 2], B = [2, 4], tức B = 2A.',
  tries: ['Giữ nguyên: cosine = 1 dù B dài gấp đôi A, còn khoảng cách Euclid khác 0.', 'Bấm "Vuông góc": cosine về 0, hai câu "không liên quan".', 'Bấm "Ngược hướng": cosine = −1.', 'Kéo độ dài B mà không đổi góc: cosine đứng yên, Euclid đổi. Vì vậy FAISS phải normalize trước khi dùng inner product.'],
  build: function (ui) {
    var aA = 63, aL = 2.2, bA = 63, bL = 4.5;
    var sA = ui.slider({ label: 'Góc của A', min: 0, max: 359, step: 1, value: aA, fmt: function (v) { return v + '°'; } }, function (v) { aA = v; draw(); });
    var lA = ui.slider({ label: 'Độ dài A', min: 0.5, max: 5, step: 0.1, value: aL, fmt: function (v) { return vn(v, 1); } }, function (v) { aL = v; draw(); });
    var sB = ui.slider({ label: 'Góc của B', min: 0, max: 359, step: 1, value: bA, fmt: function (v) { return v + '°'; } }, function (v) { bA = v; draw(); });
    var lB = ui.slider({ label: 'Độ dài B', min: 0.5, max: 5, step: 0.1, value: bL, fmt: function (v) { return vn(v, 1); } }, function (v) { bL = v; draw(); });
    void sA; void lA;
    ui.button('B = 2A', function () { setVal(sB, aA); setVal(lB, Math.min(5, Math.round(aL * 20) / 10)); });
    ui.button('Vuông góc', function () { setVal(sB, (aA + 90) % 360); setVal(lB, aL); });
    ui.button('Ngược hướng', function () { setVal(sB, (aA + 180) % 360); setVal(lB, aL); });
    ui.button('Gần nhưng lệch 40°', function () { setVal(sB, (aA + 40) % 360); setVal(lB, aL); });
    function draw() {
      var W = 580, H = 300, cx = 150, cy = 150, k = 26, svg = ui.svg(W, H), rad = Math.PI / 180;
      var A = [aL * Math.cos(aA * rad), aL * Math.sin(aA * rad)], B = [bL * Math.cos(bA * rad), bL * Math.sin(bA * rad)];
      for (var g = -5; g <= 5; g++) { S('line', { x1: cx + g * k, y1: cy - 5 * k, x2: cx + g * k, y2: cy + 5 * k, class: 'sv-grid' }, svg); S('line', { x1: cx - 5 * k, y1: cy + g * k, x2: cx + 5 * k, y2: cy + g * k, class: 'sv-grid' }, svg); }
      S('line', { x1: cx - 5 * k, y1: cy, x2: cx + 5 * k, y2: cy, class: 'sv-ax' }, svg);
      S('line', { x1: cx, y1: cy - 5 * k, x2: cx, y2: cy + 5 * k, class: 'sv-ax' }, svg);
      var P = function (v) { return [cx + v[0] * k, cy - v[1] * k]; }, pa = P(A), pb = P(B);
      S('line', { x1: pa[0], y1: pa[1], x2: pb[0], y2: pb[1], class: 'sv-dash' }, svg);
      [[pb, 'sv-vec-b', 'f-warn', 'B'], [pa, 'sv-vec-a', 'f-sea', 'A']].forEach(function (q) {
        S('line', { x1: cx, y1: cy, x2: q[0][0], y2: q[0][1], class: q[1] }, svg);
        var an = Math.atan2(q[0][1] - cy, q[0][0] - cx), L = 11;
        S('path', { d: 'M' + q[0][0] + ' ' + q[0][1] + 'L' + (q[0][0] - L * Math.cos(an - 0.4)) + ' ' + (q[0][1] - L * Math.sin(an - 0.4)) + 'L' + (q[0][0] - L * Math.cos(an + 0.4)) + ' ' + (q[0][1] - L * Math.sin(an + 0.4)) + 'Z', class: q[2] }, svg);
        T(svg, q[0][0] + 8, q[0][1] - 6, q[3], { class: 'sv-tb' });
      });
      var dot = A[0] * B[0] + A[1] * B[1], cos = dot / (aL * bL), th = Math.acos(Math.max(-1, Math.min(1, cos))) / rad, d = Math.hypot(A[0] - B[0], A[1] - B[1]);
      var lines = ['A = [' + vn(A[0]) + '; ' + vn(A[1]) + ']', 'B = [' + vn(B[0]) + '; ' + vn(B[1]) + ']', 'A·B = ' + vn(dot), '‖A‖ · ‖B‖ = ' + vn(aL, 1) + ' × ' + vn(bL, 1) + ' = ' + vn(aL * bL), 'cos = A·B ÷ (‖A‖‖B‖) = ' + vn(cos, 3), 'Euclidean distance d = ' + vn(d)];
      lines.forEach(function (t, i) { T(svg, 310, 70 + i * 28, t, { class: i === 4 ? 'sv-tb' : 'sv-tc' }); });
      var verdict = cos > 0.95 ? ['Gần như cùng nghĩa (cùng hướng)', 'ok'] : cos > 0.6 ? ['Khá giống nghĩa', 'ok'] : cos > 0.2 ? ['Hơi liên quan', 'warn'] : cos > -0.2 ? ['Không liên quan (gần vuông góc)', 'warn'] : ['Ngược hướng', 'bad'];
      out(ui, [['Cosine', vn(cos, 3)], ['Góc giữa A và B', vn(th, 0) + '°'], ['Euclidean distance (khoảng cách)', vn(d)], ['Đọc là', verdict[0], verdict[1]]]);
    }
    draw();
  },
};

// Day 8 · RRF
SIMS.day8 = {
  title: 'Gộp hai bảng xếp hạng bằng RRF',
  intro: 'Ba truy vấn trên một kho phiếu hỗ trợ (ví dụ trong slide Day 7–8). Cột trái là xếp hạng theo nghĩa (dense), cột phải theo từ khoá (BM25), cột giữa là kết quả gộp RRF. Tài liệu đúng được tô xanh.',
  tries: ['"error code E-4471": dense xếp mã gần giống E-4417 lên đầu; BM25 khớp đúng chuỗi; RRF kéo tài liệu đúng lên hạng 1.', '"my package never showed up": không trùng từ nào nên BM25 trống; RRF vẫn giữ kết quả của dense.', 'Kéo k xuống 1: điểm dồn mạnh về hạng 1 của từng bảng. k = 60 là mặc định của bài báo gốc.'],
  build: function (ui) {
    var DOC = { A: 'Fix lỗi E-4471', B: 'Lỗi E-4417 checkout', C: 'Bảng mã lỗi', D: 'Refund policy', E: 'Shipment not arrived', F: 'Money transfer' };
    var QS = {
      'error code E-4471': { dense: ['B', 'A', 'C', 'E', 'D'], bm25: ['A', 'C', 'B'], gold: 'A', note: 'Dense làm nhoè mã chính xác; BM25 bắt đúng chuỗi E-4471.' },
      'my package never showed up': { dense: ['E', 'D', 'F', 'B', 'C'], bm25: [], gold: 'E', note: 'Không trùng từ nào: BM25 trống, dense hiểu "shipment did not arrive".' },
      'refund policy': { dense: ['D', 'F', 'E', 'C', 'A'], bm25: ['D'], gold: 'D', note: 'Hai bên đồng ý: RRF giữ nguyên hạng 1.' },
    };
    var q = 'error code E-4471', k = 60;
    ui.select('Query (truy vấn)', Object.keys(QS), q, function (v) { q = v; draw(); });
    ui.slider({ label: 'Hằng số k của RRF', min: 1, max: 100, step: 1, value: k, fmt: String }, function (v) { k = v; draw(); });
    function fuse(Q) {
      var sc = {};
      [Q.dense, Q.bm25].forEach(function (L) { L.forEach(function (d, i) { sc[d] = (sc[d] || 0) + 1 / (k + i + 1); }); });
      return Object.keys(sc).sort(function (a, b) { return sc[b] - sc[a] || Q.dense.indexOf(a) - Q.dense.indexOf(b); }).map(function (d) { return [d, sc[d]]; });
    }
    function draw() {
      var Q = QS[q], F = fuse(Q), W = 600, H = 280, svg = ui.svg(W, H), cols = [85, 300, 515], bw = 150;
      T(svg, cols[0], 18, 'Dense (theo nghĩa)', { 'text-anchor': 'middle', class: 'sv-tb' });
      T(svg, cols[1], 18, 'RRF, k = ' + k, { 'text-anchor': 'middle', class: 'sv-tb' });
      T(svg, cols[2], 18, 'BM25 (từ khoá)', { 'text-anchor': 'middle', class: 'sv-tb' });
      var Yr = function (i) { return 34 + i * 40; };
      var fr = F.map(function (x) { return x[0]; });
      Q.dense.forEach(function (d, i) { var j = fr.indexOf(d); S('path', { d: 'M' + (cols[0] + bw / 2) + ' ' + (Yr(i) + 15) + 'C' + (cols[0] + bw / 2 + 30) + ' ' + (Yr(i) + 15) + ' ' + (cols[1] - bw / 2 - 30) + ' ' + (Yr(j) + 15) + ' ' + (cols[1] - bw / 2) + ' ' + (Yr(j) + 15), class: d === Q.gold ? 'sv-link-gold' : 'sv-link' }, svg); });
      Q.bm25.forEach(function (d, i) { var j = fr.indexOf(d); S('path', { d: 'M' + (cols[2] - bw / 2) + ' ' + (Yr(i) + 15) + 'C' + (cols[2] - bw / 2 - 30) + ' ' + (Yr(i) + 15) + ' ' + (cols[1] + bw / 2 + 30) + ' ' + (Yr(j) + 15) + ' ' + (cols[1] + bw / 2) + ' ' + (Yr(j) + 15), class: d === Q.gold ? 'sv-link-gold' : 'sv-link' }, svg); });
      function item(cx, i, d, extra) {
        S('rect', { x: cx - bw / 2, y: Yr(i), width: bw, height: 30, rx: 7, class: d === Q.gold ? 'sv-okbox' : 'sv-box' }, svg);
        T(svg, cx - bw / 2 + 8, Yr(i) + 19, (i + 1) + '. ' + d + ' · ' + DOC[d], { class: 'sv-tm' });
        if (extra) T(svg, cx, Yr(i) + 44, extra, { 'text-anchor': 'middle' });
      }
      Q.dense.forEach(function (d, i) { item(cols[0], i, d); });
      Q.bm25.forEach(function (d, i) { item(cols[2], i, d); });
      if (!Q.bm25.length) T(svg, cols[2], 52, 'không tài liệu nào trùng từ', { 'text-anchor': 'middle' });
      F.forEach(function (x, i) { item(cols[1], i, x[0]); });
      var di = Q.dense.indexOf(Q.gold), bi = Q.bm25.indexOf(Q.gold), fi = fr.indexOf(Q.gold);
      out(ui, [['Ground truth (tài liệu đúng)', Q.gold + ' · ' + DOC[Q.gold]], ['Rank ở Dense', di < 0 ? 'không có' : String(di + 1)], ['Rank ở BM25', bi < 0 ? 'không có' : String(bi + 1)], ['Rank sau RRF', String(fi + 1), fi === 0 ? 'ok' : 'warn'], ['Điểm RRF của nó', vn(F[fi][1], 4)], ['Ghi chú', Q.note]]);
    }
    draw();
  },
};

// Day 9 · Multi-agent: được gì, mất gì
SIMS.day9 = {
  title: 'Thêm worker: được gì, mất gì',
  intro: 'Một supervisor lập kế hoạch, n worker làm việc hẹp, rồi một bước tổng hợp. Mỗi bước đúng với xác suất p. Token tính theo đơn vị "một lần chat"; con số là mô hình minh hoạ, neo theo ước lượng khoảng 4× (một agent) và 15× (nhiều agent) của Anthropic.',
  tries: ['Tăng số worker: xác suất cả hệ chạy đúng tụt dần vì lỗi cộng dồn.', 'Đổi "Tuần tự" sang "Song song": độ trễ giảm mạnh, token không đổi.', 'Đổi worker trả về "Nguyên transcript": token phần tổng hợp phình theo số worker.', 'Kéo p lên 0,99: thêm worker bớt đau hơn; đây là lý do phải làm rõ vai trò và thêm bước kiểm chứng.'],
  build: function (ui) {
    var n = 3, p = 0.95, mode = 'Song song', ret = 'Bản tóm tắt', t = [2.6, 3.4, 1.9, 4.2, 2.2, 3.0, 3.8, 2.4];
    ui.slider({ label: 'Số worker', min: 1, max: 8, step: 1, value: n, fmt: String }, function (v) { n = v; draw(); });
    ui.slider({ label: 'Success rate mỗi bước p (xác suất đúng)', min: 0.8, max: 0.99, step: 0.01, value: p, fmt: function (v) { return vn(v); } }, function (v) { p = v; draw(); });
    ui.select('Worker chạy', ['Song song', 'Tuần tự'], mode, function (v) { mode = v; draw(); });
    ui.select('Worker trả về', ['Bản tóm tắt', 'Nguyên transcript'], ret, function (v) { ret = v; draw(); });
    function draw() {
      var W = 580, H = 250, svg = ui.svg(W, H), ts = t.slice(0, n);
      S('rect', { x: 210, y: 10, width: 160, height: 36, rx: 9, class: 'sv-on' }, svg);
      T(svg, 290, 33, 'Supervisor · lập kế hoạch', { 'text-anchor': 'middle', class: 'sv-tb' });
      var gap = 560 / n, bw = Math.min(110, gap - 10);
      ts.forEach(function (s, i) {
        var cx = 10 + gap * i + gap / 2;
        arrow(svg, 290, 46, cx, 92, 'sv-arrow');
        S('rect', { x: cx - bw / 2, y: 94, width: bw, height: 40, rx: 8, class: 'sv-box' }, svg);
        T(svg, cx, 111, 'Worker ' + (i + 1), { 'text-anchor': 'middle', class: 'sv-tm' });
        T(svg, cx, 127, vn(s, 1) + ' giây', { 'text-anchor': 'middle' });
        arrow(svg, cx, 134, 290, 178, 'sv-arrow');
      });
      S('rect', { x: 210, y: 180, width: 160, height: 36, rx: 9, class: 'sv-okbox' }, svg);
      T(svg, 290, 203, 'Synthesis (tổng hợp)', { 'text-anchor': 'middle', class: 'sv-tb' });
      T(svg, 290, 238, mode === 'Song song' ? 'Worker chạy cùng lúc: chờ worker chậm nhất' : 'Worker chạy lần lượt: cộng dồn thời gian', { 'text-anchor': 'middle' });
      var lat = 1.2 + (mode === 'Song song' ? Math.max.apply(null, ts) : sum(ts)) + 1.5;
      var succ = Math.pow(p, n + 2), tok = 3 + 3 * n + 1 + n * (ret === 'Bản tóm tắt' ? 0.5 : 3);
      var note = succ < 0.7 ? ['Lỗi cộng dồn nặng: cần verifier, vai trò rõ hơn, ít worker hơn', 'bad'] : tok > 20 ? ['Tốn token: chỉ đáng cho việc giá trị cao', 'warn'] : ['Cân bằng được', 'ok'];
      out(ui, [['Success rate cả hệ (xác suất chạy đúng)', pct(succ, 1) + ' (= p^' + (n + 2) + ')', succ < 0.7 ? 'bad' : succ < 0.85 ? 'warn' : 'ok'], ['Latency (độ trễ)', vn(lat, 1) + ' giây'], ['Token (≈ × một lần chat)', vn(tok, 1) + '×'], ['So với một agent (~4×)', 'gấp ' + vn(tok / 4, 1) + ' lần'], ['Nhận xét', note[0], note[1]]]);
    }
    draw();
  },
};

// Day 10 · Phát hiện bất thường
SIMS.day10 = {
  title: 'z-score bị chính đợt nạp trùng che mắt',
  intro: 'Số tài liệu nạp vào corpus mỗi ngày trong 28 ngày. Từ ngày 16, một lỗi làm batch bị nạp trùng vài ngày liền. Ngưỡng gắn cờ là |điểm| > 3. Ngày cuối tuần (T7, CN) tô nhạt; cột đỏ là ngày bị gắn cờ, tam giác là ngày nạp trùng thật.',
  tries: ['Giữ mặc định (3 ngày nạp trùng, z-score): không ngày nào bị gắn cờ dù số liệu vọt lên. Đó là masking.', 'Giảm còn 1 ngày nạp trùng: z-score bắt được ngay.', 'Đổi sang MAD: bắt được đợt nạp trùng nhưng gắn cờ nhầm cả loạt ngày cuối tuần.', 'Đổi sang "STL: tách seasonality + MAD": bắt đúng mà không có false positive.'],
  build: function (ui) {
    var k = 3, mult = 4, method = 'z-score (dùng mean và standard deviation)', seas = 'Có (cuối tuần ít)';
    var noise = [], r = rng(5); for (var i = 0; i < 28; i++) noise.push(gauss(r) * 35);
    ui.slider({ label: 'Số ngày bị duplicate (nạp trùng)', min: 1, max: 4, step: 1, value: k, fmt: String }, function (v) { k = v; draw(); });
    ui.slider({ label: 'Mức nạp trùng (× bình thường)', min: 1, max: 6, step: 0.5, value: mult, fmt: function (v) { return vn(v, 1) + '×'; } }, function (v) { mult = v; draw(); });
    ui.select('Phương pháp anomaly detection', ['z-score (dùng mean và standard deviation)', 'MAD (dùng median: trung vị)', 'STL: tách seasonality + MAD'], method, function (v) { method = v; draw(); });
    ui.select('Seasonality (mùa vụ) trong tuần', ['Có (cuối tuần ít)', 'Không'], seas, function (v) { seas = v; draw(); });
    function weekend(d) { return d % 7 === 5 || d % 7 === 6; }
    function draw() {
      var x = [], anom = [];
      for (var d = 0; d < 28; d++) {
        var base = seas[0] === 'C' && weekend(d) ? 600 : 1000, a = d >= 15 && d < 15 + k;
        x.push(Math.round(base * (a ? mult : 1) + noise[d])); anom.push(a);
      }
      var score;
      if (method[0] === 'z') { var m = sum(x) / 28, sd = Math.sqrt(sum(x.map(function (v) { return (v - m) * (v - m); })) / 28); score = x.map(function (v) { return (v - m) / sd; }); }
      else if (method[0] === 'M') { var md = median(x), mad = median(x.map(function (v) { return Math.abs(v - md); })); score = x.map(function (v) { return (v - md) / (1.4826 * mad); }); }
      else {
        var gw = median(x.filter(function (_, d) { return !weekend(d); })), ge = median(x.filter(function (_, d) { return weekend(d); }));
        var res = x.map(function (v, d) { return v - (seas[0] === 'C' && weekend(d) ? ge : gw); }), rm = median(res.map(Math.abs));
        score = res.map(function (v) { return v / (1.4826 * rm); });
      }
      var flag = score.map(function (s) { return Math.abs(s) > 3; });
      var W = 580, H = 230, box = { l: 50, r: 570, t: 14, b: 196 }, svg = ui.svg(W, H), mx = Math.max.apply(null, x) * 1.1;
      var Y = function (v) { return box.b - v / mx * (box.b - box.t); }, bw = (box.r - box.l) / 28;
      var yt = [0, Math.round(mx / 2000) * 1000 || 1000, Math.round(mx / 1000) * 1000].filter(function (v, i, a) { return a.indexOf(v) === i && v <= mx; });
      axes(svg, box, [0, 6, 13, 20, 27].map(function (d) { return [box.l + bw * d + bw / 2, 'N' + (d + 1)]; }), yt.map(function (v) { return [Y(v), v.toLocaleString('vi-VN')]; }));
      x.forEach(function (v, d) {
        S('rect', { x: box.l + bw * d + 2, y: Y(v), width: bw - 4, height: box.b - Y(v), rx: 2, class: flag[d] ? 'f-bad' : weekend(d) ? 'f-sea-soft' : 'f-sea' }, svg);
        if (anom[d]) S('path', { d: 'M' + (box.l + bw * d + bw / 2) + ' ' + (Y(v) - 4) + 'l-5 -8h10z', class: 'f-warn' }, svg);
      });
      var caught = anom.filter(function (a, d) { return a && flag[d]; }).length, fp = flag.filter(function (f, d) { return f && !anom[d]; }).length;
      var maxAn = Math.max.apply(null, score.filter(function (_, d) { return anom[d]; }).map(Math.abs));
      var days = flag.map(function (f, d) { return f ? 'N' + (d + 1) : ''; }).filter(Boolean);
      var note = caught === k && !fp ? ['Bắt đúng, không báo nhầm', 'ok'] : caught === 0 ? ['Bỏ lọt hoàn toàn đợt nạp trùng', 'bad'] : fp ? ['Có false positive: dễ gây alert fatigue', 'warn'] : ['Bắt được một phần', 'warn'];
      if (mult === 1) note = ['Không có nạp trùng (mức 1×)', fp ? 'warn' : 'ok'];
      out(ui, [['Ngày bị gắn cờ', days.length ? days.join(', ') : 'không ngày nào'], ['Bắt được ngày nạp trùng', caught + ' / ' + k, caught === k ? 'ok' : 'bad'], ['False positive (báo nhầm)', String(fp), fp ? 'warn' : 'ok'], ['|Điểm| lớn nhất của ngày nạp trùng', vn(maxAn)], ['Nhận xét', note[0], note[1]]]);
    }
    draw();
  },
};

// Day 11 · HITL và bộ ba chết người
SIMS.day11 = {
  title: 'HITL: ai duyệt hành động này, và nó có thể làm rò dữ liệu không?',
  intro: 'Bên trái: ma trận định tuyến HITL theo tác động × khả năng hoàn tác. Bên phải: bộ ba chết người. Chọn một hành động mẫu hoặc tự chỉnh từng yếu tố.',
  tries: ['Chọn "Gửi email trả lời khách": in-the-loop, và agent đang có đủ cả ba chân của bộ ba.', 'Với ca đó, đổi "Có kênh gửi ra ngoài" thành "Không": chặn được đường rút dữ liệu.', 'Chọn "Chuyển 50 triệu tới tài khoản lạ": tác động cao, không hoàn tác được → tiebreaker + 2 người.', 'Đổi khả năng hoàn tác từ "Không" sang "Dễ": mức duyệt giảm hẳn. Làm hành động hoàn tác được là cách rẻ nhất để bớt HITL.'],
  build: function (ui) {
    var IMP = ['Thấp', 'Vừa', 'Cao'], REV = ['Hoàn tác dễ', 'Hoàn tác khó', 'Không hoàn tác được'], YN = ['Không', 'Có'];
    var M = [['Tự động', 'Tự động + log', 'On-the-loop'], ['Tự động + log', 'On-the-loop', 'In-the-loop'], ['On-the-loop', 'In-the-loop', 'Tiebreaker + 2 người']];
    var WHY = { 'Tự động': 'Rủi ro thấp, sai thì sửa ngay được.', 'Tự động + log': 'Cho chạy nhưng ghi lại để soát sau.', 'On-the-loop': 'Agent làm trước, người xem lại sau.', 'In-the-loop': 'Agent đề xuất, người duyệt trước khi thực hiện.', 'Tiebreaker + 2 người': 'Người quyết, agent chỉ chuẩn bị bằng chứng; cần hai người duyệt.' };
    var CASES = {
      'Tự chỉnh': null,
      'Gợi ý bài hát': [0, 0, 0, 0, 0],
      'Tóm tắt một trang web cho người dùng': [0, 0, 0, 1, 0],
      'Cập nhật ghi chú CRM nội bộ': [1, 1, 1, 0, 0],
      'Gửi email trả lời khách': [1, 2, 1, 1, 1],
      'Chuyển 50 triệu tới tài khoản lạ': [2, 2, 1, 0, 1],
    };
    var s = CASES['Gửi email trả lời khách'].slice(), sels = [];
    var cs = ui.select('Hành động mẫu', Object.keys(CASES), 'Gửi email trả lời khách', function (v) { if (CASES[v]) { s = CASES[v].slice(); sels.forEach(function (el, i) { el.value = [IMP, REV, YN, YN, YN][i][s[i]]; }); } draw(); });
    [['Impact (tác động)', IMP], ['Reversibility (khả năng hoàn tác)', REV], ['Private data (đọc dữ liệu riêng tư)', YN], ['Untrusted content (đọc nội dung không tin cậy)', YN], ['External comms (có kênh gửi ra ngoài)', YN]].forEach(function (c, i) {
      sels.push(ui.select(c[0], c[1], c[1][s[i]], function (v) { s[i] = c[1].indexOf(v); cs.value = 'Tự chỉnh'; draw(); }));
    });
    function draw() {
      var W = 580, H = 290, svg = ui.svg(W, H), cw = 92, ch = 52, x0 = 74, y0 = 40, mode = M[s[0]][s[1]];
      T(svg, x0 + 1.5 * cw, 18, 'Reversibility (khả năng hoàn tác) →', { 'text-anchor': 'middle', class: 'sv-tb' });
      ['Dễ', 'Khó', 'Không'].forEach(function (t, j) { T(svg, x0 + j * cw + cw / 2, 34, t, { 'text-anchor': 'middle' }); });
      IMP.forEach(function (t, i) { T(svg, x0 - 8, y0 + i * ch + ch / 2 + 4, t, { 'text-anchor': 'end' }); });
      T(svg, 12, y0 + 1.5 * ch, 'Impact', { transform: 'rotate(-90 12 ' + (y0 + 1.5 * ch) + ')', 'text-anchor': 'middle', class: 'sv-tb' });
      var tone = { 'Tự động': 'f-leaf-soft', 'Tự động + log': 'f-leaf-soft', 'On-the-loop': 'f-sea-soft', 'In-the-loop': 'f-warn-soft', 'Tiebreaker + 2 người': 'f-bad-soft' };
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        var on = i === s[0] && j === s[1];
        S('rect', { x: x0 + j * cw + 2, y: y0 + i * ch + 2, width: cw - 4, height: ch - 4, rx: 7, class: tone[M[i][j]] }, svg);
        if (on) S('rect', { x: x0 + j * cw + 2, y: y0 + i * ch + 2, width: cw - 4, height: ch - 4, rx: 7, class: 's-fg', fill: 'none' }, svg);
        var words = M[i][j].split(' + ');
        words.forEach(function (w, wi) { T(svg, x0 + j * cw + cw / 2, y0 + i * ch + ch / 2 + 4 + (wi - (words.length - 1) / 2) * 13, (wi ? '+ ' : '') + w, { 'text-anchor': 'middle', class: on ? 'sv-tb' : 'sv-tm' }); });
      }
      var C = [[430, 112, 'Private data', s[2]], [500, 112, 'Untrusted', s[3]], [465, 172, 'External comms', s[4]]], all = s[2] && s[3] && s[4];
      T(svg, 465, 34, 'Lethal trifecta', { 'text-anchor': 'middle', class: 'sv-tb' });
      C.forEach(function (c) { S('circle', { cx: c[0], cy: c[1], r: 46, class: c[3] ? (all ? 'f-bad' : 'f-warn') : 'f-line', 'fill-opacity': c[3] ? 0.35 : 0.5 }, svg); });
      C.forEach(function (c, i) { T(svg, c[0] + [-18, 18, 0][i], c[1] + [-18, -18, 30][i], c[2], { 'text-anchor': 'middle', class: 'sv-tm' }); });
      if (all) T(svg, 465, 136, 'RÒ RỈ', { 'text-anchor': 'middle', class: 'sv-tb' });
      var cnt = s[2] + s[3] + s[4];
      var cut = !all ? 'Không cần: chưa đủ ba chân' : 'Bỏ một chân: ví dụ không cho agent gửi ra ngoài, hoặc tách việc đọc nội dung lạ sang model không có tool (Dual-LLM).';
      out(ui, [['Mô hình HITL', mode, mode.indexOf('Tự động') === 0 ? 'ok' : mode === 'Tiebreaker + 2 người' ? 'bad' : 'warn'], ['Vì sao', WHY[mode]], ['Lethal trifecta (bộ ba chết người)', all ? 'Đủ 3/3 chân: có thể bị rút dữ liệu' : cnt + '/3 chân', all ? 'bad' : 'ok'], ['Cắt chân nào', cut]]);
    }
    draw();
  },
};

// Day 12 · Timeout của hạ tầng
SIMS.day12 = {
  title: 'Request của agent có sống sót qua hạ tầng?',
  intro: 'Agent chạy D giây, trong đó có một quãng im lặng dài (đang gọi tool, chưa sinh token). Mỗi chặng hạ tầng có luật cắt riêng: trần tổng thời gian, chờ byte đầu, hoặc thời gian im lặng tối đa. Timeline bên dưới đánh dấu chỗ request bị cắt.',
  tries: ['Mặc định (ALB, không stream, 75 giây): bị cắt ở giây 60 vì im lặng quá lâu.', 'Chọn "Streaming token (SSE)": vẫn bị cắt nếu idle gap (quãng im lặng) giữa chừng vượt 60 giây; kéo lên 70 để thấy.', 'Chọn "Streaming + heartbeat 15 giây": sống sót, vì dòng ": ping" giữ kết nối.', 'Chọn API Gateway: stream cũng không cứu được trần 29 giây; phải chuyển sang async job.'],
  build: function (ui) {
    var P = {
      'AWS ALB (idle timeout 60 giây)': { idle: 60 },
      'nginx proxy_read_timeout 60 giây': { idle: 60 },
      'Heroku router (first byte trong 30 giây)': { first: 30 },
      'AWS API Gateway (timeout 29 giây)': { cap: 29 },
      'Vercel function Hobby (timeout 5 phút)': { cap: 300 },
      'Railway public HTTP (timeout 15 phút)': { cap: 900 },
      'Cloud Run (timeout 60 phút)': { cap: 3600 },
    };
    var plat = 'AWS ALB (idle timeout 60 giây)', D = 75, gap = 40, mode = 'Non-streaming: chờ xong mới trả';
    ui.select('Infrastructure (hạ tầng)', Object.keys(P), plat, function (v) { plat = v; draw(); });
    ui.slider({ label: 'Agent chạy tổng cộng (giây)', min: 5, max: 1200, step: 5, value: D, fmt: function (v) { return v + ' s'; } }, function (v) { D = v; draw(); });
    ui.slider({ label: 'Idle gap dài nhất (quãng im lặng, giây)', min: 0, max: 120, step: 1, value: gap, fmt: function (v) { return v + ' s'; } }, function (v) { gap = v; draw(); });
    ui.select('Cách trả kết quả', ['Non-streaming: chờ xong mới trả', 'Streaming token (SSE)', 'Streaming + heartbeat 15 giây'], mode, function (v) { mode = v; draw(); });
    function draw() {
      var p = P[plat], none = mode[0] === 'N', hb = mode.indexOf('heartbeat') > 0;
      var g = Math.min(gap, Math.max(0, D - 2)), gs = none ? 0 : Math.max(1, Math.min(0.3 * D, D - g - 1));
      var first = none ? D : 1, silence = none ? D : hb ? Math.min(g, 15) : g;
      var cut = null, why = '';
      function c(t, w) { if (cut === null || t < cut) { cut = t; why = w; } }
      if (p.cap && D > p.cap) c(p.cap, 'Vượt timeout ' + p.cap + ' giây của nền tảng');
      if (p.first && first > p.first) c(p.first, 'Chưa có first byte sau ' + p.first + ' giây');
      if (p.idle && silence > p.idle) c((none ? 0 : gs) + p.idle, 'Idle (im lặng) quá ' + p.idle + ' giây');
      var W = 580, H = 150, box = { l: 20, r: 560 }, svg = ui.svg(W, H), X = function (t) { return box.l + t / D * (box.r - box.l); };
      S('rect', { x: box.l, y: 40, width: box.r - box.l, height: 34, rx: 6, class: 'f-surface2' }, svg);
      if (!none) {
        for (var t = 1; t < D; t += Math.max(0.6, D / 140)) { if (t >= gs && t <= gs + g) continue; S('line', { x1: X(t), y1: 46, x2: X(t), y2: 68, class: 'l-sea' }, svg); }
        if (g > 0) S('rect', { x: X(gs), y: 40, width: Math.max(2, X(gs + g) - X(gs)), height: 34, class: 'sv-gap' }, svg);
        if (hb) for (var h = gs + 15; h < gs + g; h += 15) S('circle', { cx: X(h), cy: 57, r: 3.5, class: 'f-leaf' }, svg);
      } else {
        S('rect', { x: box.l, y: 40, width: box.r - box.l, height: 34, rx: 6, class: 'sv-gap' }, svg);
        S('line', { x1: X(D) - 2, y1: 44, x2: X(D) - 2, y2: 70, class: 'l-sea' }, svg);
      }
      if (cut !== null) {
        S('rect', { x: X(cut), y: 36, width: box.r - X(cut), height: 42, class: 'f-bad-soft', 'fill-opacity': 0.8 }, svg);
        S('line', { x1: X(cut), y1: 30, x2: X(cut), y2: 84, class: 'sv-cut' }, svg);
        T(svg, X(cut), 24, '504 ở giây ' + Math.round(cut), { 'text-anchor': X(cut) > 470 ? 'end' : 'middle', class: 'sv-tb' });
      }
      T(svg, box.l, 100, '0 s'); T(svg, box.r, 100, D + ' s', { 'text-anchor': 'end' });
      T(svg, box.l, 126, none ? 'Vùng cam: không gửi byte nào cho tới khi xong' : 'Vạch xanh: token đang stream · vùng cam: idle (im lặng)' + (hb ? ' · chấm xanh lá: heartbeat' : ''));
      var tip = cut === null ? 'Ổn. Vẫn nên có timeout phía client.' : why.indexOf('Vượt timeout') === 0 ? 'Chuyển sang async job (trả job_id, worker chạy nền) hoặc nền tảng có trần dài hơn.' : why.indexOf('first byte') >= 0 ? 'Stream để gửi byte đầu sớm.' : 'Bật heartbeat ": ping" mỗi ~15 giây, hoặc stream cả trạng thái "đang gọi tool".';
      out(ui, [['Kết quả', cut === null ? 'Sống sót tới khi xong' : 'Bị cắt ở giây ' + Math.round(cut), cut === null ? 'ok' : 'bad'], ['Lý do', cut === null ? 'Không vi phạm luật nào' : why], ['First byte (byte đầu tiên) tới lúc', vn(first, 0) + ' giây'], ['Idle dài nhất (im lặng)', vn(silence, 0) + ' giây'], ['Gợi ý', tip]]);
    }
    draw();
  },
};

// Day 13 · Trung bình che đuôi dài
SIMS.day13 = {
  title: 'Mean (trung bình) che mất long tail',
  intro: '2.000 request giả lập có độ trễ phân bố lệch phải (log-normal), giống thực tế của LLM. Đường dọc là trung bình, P50, P95, P99; vạch xanh lá là SLO 5 giây. Thanh cuối tính xác suất một người chat n lượt gặp ít nhất một lần chậm.',
  tries: ['Mặc định: trung bình chỉ khoảng 2,8 giây nhưng P99 gần 7 giây.', 'Kéo "Tail σ" lên 0,8: mean (trung bình) nhích nhẹ, P99 vọt lên.', 'Chỉ khoảng 7% request chậm hơn 5 giây, nhưng chat 10 lượt thì khoảng một nửa người dùng gặp ít nhất một lần; kéo lên 30 lượt để thấy con số tăng tiếp.', 'Đây là lý do SLO và alert dùng P95/P99, không dùng trung bình.'],
  build: function (ui) {
    var med = 2.5, sig = 0.45, n = 10, base = [], r = rng(13);
    for (var i = 0; i < 2000; i++) base.push(gauss(r));
    ui.slider({ label: 'Median (trung vị, giây)', min: 1, max: 4, step: 0.1, value: med, fmt: function (v) { return vn(v, 1) + ' s'; } }, function (v) { med = v; draw(); });
    ui.slider({ label: 'Tail σ (độ dài đuôi)', min: 0.2, max: 1, step: 0.05, value: sig, fmt: function (v) { return vn(v); } }, function (v) { sig = v; draw(); });
    ui.slider({ label: 'Số lượt chat mỗi người dùng', min: 1, max: 30, step: 1, value: n, fmt: String }, function (v) { n = v; draw(); });
    function q(s, p) { return s[Math.min(s.length - 1, Math.floor(p * s.length))]; }
    function draw() {
      var lat = base.map(function (z) { return med * Math.exp(sig * z); }), s = lat.slice().sort(function (a, b) { return a - b; });
      var mean = sum(lat) / lat.length, p50 = q(s, 0.5), p95 = q(s, 0.95), p99 = q(s, 0.99), f5 = lat.filter(function (v) { return v > 5; }).length / lat.length;
      var maxX = 15, bins = 30, hist = []; for (var b = 0; b < bins; b++) hist.push(0);
      lat.forEach(function (v) { hist[Math.min(bins - 1, Math.floor(v / maxX * bins))]++; });
      var W = 580, H = 250, box = { l: 44, r: 566, t: 40, b: 214 }, svg = ui.svg(W, H), mh = Math.max.apply(null, hist);
      var X = function (v) { return box.l + Math.min(v, maxX) / maxX * (box.r - box.l); }, Y = function (c) { return box.b - c / mh * (box.b - box.t); };
      axes(svg, box, [0, 3, 6, 9, 12, 15].map(function (v) { return [X(v), v === 15 ? '15+ s' : v + ' s']; }), []);
      hist.forEach(function (c, i) { S('rect', { x: box.l + i * (box.r - box.l) / bins + 1, y: Y(c), width: (box.r - box.l) / bins - 2, height: box.b - Y(c), class: 'f-sea-soft' }, svg); });
      [[5, 'SLO 5 s', 'l-leaf', 0], [mean, 'Mean', 'l-muted', 1], [p50, 'P50', 'l-sea', 2], [p95, 'P95', 'l-warn', 3], [p99, 'P99', 'l-bad', 4]].forEach(function (L) {
        S('line', { x1: X(L[0]), y1: box.t - 4, x2: X(L[0]), y2: box.b, class: L[2] }, svg);
        T(svg, X(L[0]) + 3, 12 + (L[3] % 3) * 11, L[1] + ' ' + vn(L[0], 1));
      });
      var pu = 1 - Math.pow(1 - f5, n);
      out(ui, [['Mean (trung bình)', vn(mean, 2) + ' s'], ['P50', vn(p50, 2) + ' s'], ['P95', vn(p95, 2) + ' s', p95 > 5 ? 'warn' : 'ok'], ['P99', vn(p99, 2) + ' s', p99 > 5 ? 'bad' : 'ok'], ['Request chậm hơn SLO 5 s', pct(f5, 1)], ['Người chat ' + n + ' lượt gặp ≥ 1 lần > 5 s', pct(pu, 1), pu > 0.3 ? 'bad' : pu > 0.1 ? 'warn' : 'ok'], ['Theo công thức P99: 1 − 0,99^' + n, pct(1 - Math.pow(0.99, n), 1)]]);
    }
    draw();
  },
};

// Day 14 · Bộ test là cái cân
SIMS.day14 = {
  title: 'Bản mới tốt hơn thật, hay chỉ là may?',
  intro: 'So hai phiên bản trên cùng bộ test. Chỉ những case hai bản cho kết quả khác nhau mới mang thông tin. Nếu hai bản ngang nhau, mỗi case như tung đồng xu; biểu đồ là phân bố số lần "bản mới thắng" khi chỉ có may rủi. Phần đỏ là những kết quả lệch ít nhất bằng kết quả bạn quan sát.',
  tries: ['Mặc định 7 thắng – 3 thua (ví dụ trong slide): p ≈ 0,34, chưa phân biệt được với may rủi.', 'Giữ tỷ lệ 70% nhưng tăng lên 60 case khác nhau (42–18): giờ là khác biệt thật.', 'Với 10 case khác nhau, phải thắng ít nhất 9–1 mới có ý nghĩa ở mức 5%.', 'Kéo p = 0,9 và k = 8 ở phần dưới: pass^k chỉ còn 43%.'],
  build: function (ui) {
    var m = 10, w = 7, pk = 0.9, kk = 8, wIn;
    ui.slider({ label: 'Số case hai bản khác nhau', min: 2, max: 60, step: 1, value: m, fmt: String }, function (v) { m = v; wIn.max = m; if (w > m) setVal(wIn, m); else draw(); });
    wIn = ui.slider({ label: 'Trong đó bản mới thắng', min: 0, max: m, step: 1, value: w, fmt: String }, function (v) { w = Math.min(v, m); draw(); });
    ui.slider({ label: 'Accuracy mỗi lần p (cho pass^k)', min: 0.5, max: 0.999, step: 0.001, value: pk, fmt: function (v) { return vn(v, 3); } }, function (v) { pk = v; draw(); });
    ui.slider({ label: 'Số lần chạy k', min: 1, max: 20, step: 1, value: kk, fmt: String }, function (v) { kk = v; draw(); });
    function pmf(n) { var a = [1]; for (var i = 1; i <= n; i++) a.push(a[i - 1] * (n - i + 1) / i); var t = Math.pow(2, n); return a.map(function (c) { return c / t; }); }
    function pval(n, x) { var f = pmf(n), hi = Math.max(x, n - x), s = 0; for (var i = hi; i <= n; i++) s += f[i]; return Math.min(1, 2 * s); }
    function draw() {
      var f = pmf(m), hi = Math.max(w, m - w), lo = m - hi, p = pval(m, w), need = null;
      for (var x = Math.ceil(m / 2); x <= m; x++) if (pval(m, x) < 0.05) { need = x; break; }
      var W = 580, H = 210, box = { l: 40, r: 566, t: 14, b: 180 }, svg = ui.svg(W, H), mx = Math.max.apply(null, f), bw = (box.r - box.l) / (m + 1);
      var ticks = [0, Math.round(m / 2), m].filter(function (v, i, a) { return a.indexOf(v) === i; });
      axes(svg, box, ticks.map(function (v) { return [box.l + bw * v + bw / 2, String(v)]; }), []);
      f.forEach(function (v, i) {
        var h = v / mx * (box.b - box.t), tail = i >= hi || i <= lo;
        S('rect', { x: box.l + bw * i + 1, y: box.b - h, width: Math.max(1, bw - 2), height: h, class: tail ? 'f-bad' : 'f-sea-soft', 'fill-opacity': tail ? 0.55 : 1 }, svg);
        if (i === w) S('rect', { x: box.l + bw * i + 1, y: box.b - h, width: Math.max(1, bw - 2), height: h, class: 's-fg', fill: 'none' }, svg);
      });
      T(svg, box.r, box.b + 28, 'Số lần bản mới thắng (nếu chỉ là may rủi)', { 'text-anchor': 'end' });
      out(ui, [
        ['Improvement – regression (cải thiện – tụt)', w + ' – ' + (m - w)],
        ['p-value (hai phía)', vn(p, 3)],
        ['Kết luận ở mức 5%', p < 0.05 ? (w > m - w ? 'Bản mới tốt hơn thật' : 'Bản mới tệ hơn thật') : 'Chưa phân biệt được với may rủi', p < 0.05 ? 'ok' : 'warn'],
        ['Muốn có ý nghĩa cần thắng ít nhất', need === null ? 'không đạt được với ' + m + ' case' : need + ' / ' + m],
        ['pass^k: đúng cả ' + kk + ' lần', pct(Math.pow(pk, kk), 1)],
        ['pass@k: đúng ít nhất 1 trong ' + kk + ' lần', 1 - Math.pow(1 - pk, kk) > 0.9999 ? '≈ 100%' : pct(1 - Math.pow(1 - pk, kk), 2)],
      ]);
    }
    draw();
  },
};

// Day 15 · Hoá đơn tháng và ba đòn bẩy
SIMS.day15 = {
  title: 'Hoá đơn tháng và ba đòn bẩy tối ưu',
  intro: 'Giá tham khảo theo bảng Day 1: model mạnh Claude Sonnet 4 ($3 vào / $15 ra mỗi triệu token), model rẻ Claude Haiku 4.5 ($0,8 / $4). Kéo ba đòn bẩy để xem tiền API mỗi tháng thay đổi thế nào; ngân sách thật còn cộng chi phí ẩn 1,5–2 lần.',
  tries: ['Đặt 500 request/ngày, 1.000 input token, 0 output token: ra đúng $45/tháng như ví dụ trong slide.', 'Kéo "Model routing" lên 70%: chi phí API giảm hơn một nửa.', 'Thêm 30% trúng cache và nén prompt 20%: cộng dồn tiết kiệm.', 'Để ý: token ra đắt gấp 5 lần token vào, nên cắt độ dài câu trả lời cũng là một đòn bẩy.'],
  build: function (ui) {
    var N = 2000, tin = 1500, tout = 300, rr = 0, h = 0, c = 0;
    ui.slider({ label: 'Request mỗi ngày', min: 100, max: 20000, step: 100, value: N, fmt: function (v) { return v.toLocaleString('vi-VN'); } }, function (v) { N = v; draw(); });
    ui.slider({ label: 'Input token mỗi request', min: 200, max: 5000, step: 50, value: tin, fmt: function (v) { return v.toLocaleString('vi-VN'); } }, function (v) { tin = v; draw(); });
    ui.slider({ label: 'Output token mỗi request', min: 0, max: 2000, step: 50, value: tout, fmt: function (v) { return v.toLocaleString('vi-VN'); } }, function (v) { tout = v; draw(); });
    ui.slider({ label: 'Model routing (việc dễ sang model rẻ)', min: 0, max: 90, step: 5, value: rr, fmt: function (v) { return v + '%'; } }, function (v) { rr = v; draw(); });
    ui.slider({ label: 'Semantic cache hit rate (tỷ lệ trúng)', min: 0, max: 60, step: 5, value: h, fmt: function (v) { return v + '%'; } }, function (v) { h = v; draw(); });
    ui.slider({ label: 'Prompt compression (bớt input token)', min: 0, max: 40, step: 5, value: c, fmt: function (v) { return v + '%'; } }, function (v) { c = v; draw(); });
    function draw() {
      var req = N * 30, bIn = req * tin * 3 / 1e6, bOut = req * tout * 15 / 1e6, before = bIn + bOut;
      var llm = req * (1 - h / 100), ti = tin * (1 - c / 100), r = rr / 100;
      var aIn = llm * ti * ((1 - r) * 3 + r * 0.8) / 1e6, aOut = llm * tout * ((1 - r) * 15 + r * 4) / 1e6, after = aIn + aOut;
      var W = 580, H = 190, x0 = 120, x1 = 470, svg = ui.svg(W, H), mx = Math.max(before * 2, 1e-9), X = function (v) { return x0 + v / mx * (x1 - x0); };
      [['Trước tối ưu', bIn, bOut, 20], ['Sau tối ưu', aIn, aOut, 74]].forEach(function (row) {
        T(svg, x0 - 10, row[3] + 22, row[0], { 'text-anchor': 'end', class: 'sv-tm' });
        S('rect', { x: x0, y: row[3], width: Math.max(0, X(row[1]) - x0), height: 32, class: 'f-sea' }, svg);
        S('rect', { x: X(row[1]), y: row[3], width: Math.max(0, X(row[1] + row[2]) - X(row[1])), height: 32, class: 'f-warn' }, svg);
        T(svg, X(row[1] + row[2]) + 6, row[3] + 21, money(row[1] + row[2]) + '/tháng', { class: 'sv-tb' });
      });
      S('rect', { x: x0, y: 128, width: Math.max(0, X(after * 2) - x0), height: 18, class: 'sv-room' }, svg);
      S('rect', { x: x0, y: 128, width: Math.max(0, X(after * 1.5) - x0), height: 18, class: 'f-line' }, svg);
      T(svg, x0 - 10, 141, 'Ngân sách thật', { 'text-anchor': 'end', class: 'sv-tm' });
      S('rect', { x: x0, y: 164, width: 10, height: 10, class: 'f-sea' }, svg); T(svg, x0 + 14, 173, 'input token');
      S('rect', { x: x0 + 90, y: 164, width: 10, height: 10, class: 'f-warn' }, svg); T(svg, x0 + 104, 173, 'output token');
      S('rect', { x: x0 + 170, y: 164, width: 10, height: 10, class: 'f-line' }, svg); T(svg, x0 + 184, 173, 'sau tối ưu × 1,5–2 (hidden cost)');
      var tier = N < 100 ? 'MVP' : N <= 5000 ? 'Growth (100–5K request/ngày)' : 'Scale (trên 5K request/ngày)';
      out(ui, [['API mỗi tháng, trước', money(before)], ['API mỗi tháng, sau', money(after)], ['Tiết kiệm', before ? pct(1 - after / before) : '0%', 'ok'], ['Budget thật (ngân sách × 1,5–2)', money(after * 1.5) + ' – ' + money(after * 2)], ['Cost mỗi request (sau tối ưu)', money(after / req)], ['Tier gợi ý', tier]]);
    }
    draw();
  },
};

