import { maker } from './make'

const q = maker(16)

// Day 16 · Mạng nơ-ron và huấn luyện
export const day16 = [
  q.order('01', 1, 'Sắp xếp các bước của một vòng lặp huấn luyện theo đúng thứ tự.', [
    'Truyền xuôi: tính ŷ = f(x; w)',
    'Tính hàm mất mát J',
    'Truyền ngược: tính ∂J/∂w',
    'Cập nhật: w ← w − η·∂J/∂w',
  ], 'Truyền xuôi cho đầu ra và mất mát, truyền ngược cho gradient, rồi cập nhật trọng số đi ngược gradient một bước η. Lặp lại nhiều lần chính là huấn luyện.'),

  q.single('02', 1, 'Hàm J(θ) = (1/N) Σ ℓ(f(xᵢ; θ), tᵢ) được gọi là gì?',
    'Rủi ro thực nghiệm: sai số trung bình trên tập huấn luyện',
    ['Sai số tổng quát hoá trên dữ liệu chưa thấy', 'Gradient của mô hình theo tham số θ', 'Độ chính xác trung bình trên tập kiểm tra'],
    'J là trung bình của ℓ trên N mẫu huấn luyện (empirical risk). Huấn luyện tìm θ̂ = arg min J, nhưng mục tiêu thật là sai số trên dữ liệu chưa thấy; hai đại lượng có thể lệch nhau (quá khớp).'),

  q.match('03', 1, 'Ghép mỗi tập dữ liệu với vai trò của nó.', [
    ['Tập huấn luyện', 'Cập nhật tham số θ ở mỗi bước'],
    ['Tập kiểm định (validation)', 'Chọn siêu tham số, kiến trúc, thời điểm dừng'],
    ['Tập kiểm tra (test)', 'Báo cáo sai số cuối cùng, dùng một lần'],
  ], 'Tập kiểm tra chỉ dùng một lần để báo cáo. Tập kiểm định được dùng nhiều lần để chọn siêu tham số nên không còn "sạch" như tập kiểm tra.'),

  q.tf('04', 2, 'Sai số trên tập kiểm định thường thấp hơn sai số thật của mô hình.', true,
    'Đúng. Chính tập kiểm định được dùng để chọn siêu tham số, nên con số trên nó lạc quan hơn sai số thật. Vì vậy cần một tập kiểm tra riêng chỉ dùng một lần.'),

  q.match('05', 1, 'Ghép tình huống với tên gọi.', [
    ['Sai số huấn luyện và kiểm định đều cao, khoảng cách nhỏ', 'Chưa khớp (underfitting)'],
    ['Sai số huấn luyện gần 0, sai số kiểm định tăng', 'Quá khớp (overfitting)'],
    ['Hai sai số cùng giảm, khoảng cách nhỏ', 'Khớp vừa phải'],
  ], 'Chưa khớp là thất bại ở việc giảm sai số huấn luyện (độ chệch cao). Quá khớp là khoảng cách giữa kiểm định và huấn luyện lớn (phương sai cao).'),

  q.single('06', 2, 'Một nơ-ron sigmoid có x = (0,35; 0,7), w = (0,2; 0,2), b = 0. Đầu ra a bằng bao nhiêu?',
    'a = σ(0,21) ≈ 0,5523',
    ['a = σ(0,35) ≈ 0,5866', 'a = 0,21 vì sigmoid giữ nguyên giá trị nhỏ', 'a = σ(0,7) ≈ 0,6682'],
    'z = 0,2·0,35 + 0,2·0,7 = 0,07 + 0,14 = 0,21, rồi a = σ(0,21) = 0,5523. Nơ-ron = tổng có trọng số + hệ số tự do, rồi qua hàm kích hoạt.'),

  q.fill('07', 2, 'Mạng 784 → 128 → 10 (có bias ở mỗi lớp) có bao nhiêu tham số?', ['101770', '101 770', '101.770'],
    'Mỗi lớp có n_ra·(n_vào + 1) tham số: 128·785 + 10·129 = 100 480 + 1 290 = 101 770.'),

  q.fill('08', 3, 'Mạng MLP 3 → 4 → 3 (có bias) có bao nhiêu tham số?', ['31'],
    '4·(3 + 1) + 3·(4 + 1) = 16 + 15 = 31. Mỗi đường nối là một phần tử của ma trận trọng số, cộng thêm một bias cho mỗi nơ-ron.'),

  q.single('09', 1, 'Điều gì xảy ra nếu bỏ hết hàm kích hoạt khỏi một mạng nhiều lớp?',
    'Cả mạng gộp lại thành một phép biến đổi tuyến tính duy nhất, độ sâu không thêm khả năng biểu diễn',
    ['Mạng học nhanh hơn vì gradient không bị bão hoà nữa', 'Mạng vẫn xấp xỉ được mọi hàm liên tục nếu đủ sâu', 'Mạng chỉ mất khả năng xuất ra xác suất ở lớp cuối'],
    'W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂): vẫn là một ma trận và một vector. Hàm kích hoạt phi tuyến đặt giữa các lớp ngăn việc gộp này.'),

  q.match('10', 1, 'Ghép hàm kích hoạt với đặc điểm của nó.', [
    ['sigmoid', 'Ép vào (0, 1), đọc như xác suất, phẳng ở hai đầu'],
    ['tanh', 'Ép vào (−1, 1), đối xứng quanh 0'],
    ['ReLU', 'max(0, z): giữ số dương, chặn số âm, tính rất nhanh'],
    ['GELU / SiLU', 'Phiên bản mềm của ReLU, dùng nhiều trong mô hình hiện đại'],
  ], 'Mạng thị giác hiện nay thường dùng ReLU hoặc SiLU ở lớp ẩn, sigmoid hoặc softmax ở lớp ra.'),

  q.single('11', 1, 'Giá trị lớn nhất của đạo hàm sigmoid σ′(z) là bao nhiêu và đạt tại đâu?',
    '0,25, tại z = 0',
    ['1, tại z = 0', '0,5, tại z = 1', '0,25, khi z → +∞'],
    'σ′(z) = σ(z)(1 − σ(z)) ≤ 1/4, đạt 0,25 tại z = 0 và giảm rất nhanh khi |z| lớn (z = 5 chỉ còn 0,0066).'),

  q.single('12', 2, 'Vì sao mạng sigmoid sâu khiến các lớp đầu gần như không học?',
    'Mỗi lớp nhân gradient với σ′ ≤ 0,25, sau 10 lớp hệ số có thể nhỏ hơn 10⁻⁶',
    ['Sigmoid làm gradient tăng theo hàm mũ qua từng lớp', 'Sigmoid không có đạo hàm tại z = 0', 'Các lớp đầu không có bias nên không cập nhật được'],
    '0,25¹⁰ ≈ 9,5·10⁻⁷. Nếu trọng số không khuếch đại tín hiệu, gradient về tới lớp đầu gần bằng 0: đó là gradient biến mất (vanishing gradient).'),

  q.single('13', 2, 'Định lý xấp xỉ phổ quát nói gì, và KHÔNG nói gì?',
    'Mạng một lớp ẩn đủ rộng tồn tại để xấp xỉ hàm liên tục, nhưng không nói cần rộng bao nhiêu hay huấn luyện có tìm ra nó không',
    ['Mạng một lớp ẩn luôn học được mọi hàm nếu huấn luyện đủ lâu', 'Mạng sâu luôn tốt hơn mạng rộng với cùng số tham số', 'Chỉ mạng dùng hàm kích hoạt đa thức mới xấp xỉ được hàm liên tục'],
    'Định lý chỉ khẳng định sự tồn tại (với hàm kích hoạt không phải đa thức, trên miền đóng và bị chặn). Nó không bảo đảm kích thước hợp lý hay việc tối ưu tìm ra nghiệm.'),

  q.single('14', 2, 'Vì sao MLP không phù hợp cho ảnh 224 × 224 × 3?',
    'Lớp ẩn 1 000 nơ-ron đã cần ≈ 1,5·10⁸ tham số và không dùng lại trọng số giữa các vị trí',
    ['MLP không xử lý được giá trị điểm ảnh lớn hơn 1', 'MLP chỉ nhận đầu vào có số chiều là lũy thừa của 2', 'MLP không có hàm kích hoạt phi tuyến'],
    '1 000·(150 528 + 1) ≈ 1,5·10⁸ tham số (≈ 0,6 GB ở FP32). Mỗi nơ-ron nhìn toàn ảnh, không khai thác cấu trúc không gian; Day 17 giới thiệu tích chập để sửa điều này.'),

  q.fill('15', 3, 'Mạng 2-2-1 ví dụ cho ŷ = 0,6651 với đáp án t = 0,5. Mất mát J = ½(ŷ − t)² bằng bao nhiêu (4 chữ số thập phân)?', ['0,0136', '0.0136'],
    '½·(0,6651 − 0,5)² = ½·0,1651² = ½·0,02726 ≈ 0,0136.'),

  q.single('16', 2, 'Đạo hàm của f(x) = x² tại x = 1,5 bằng bao nhiêu, và cát tuyến với bước h = 0,1 cho độ dốc bao nhiêu?',
    'f′(1,5) = 3; cát tuyến h = 0,1 cho 3,10',
    ['f′(1,5) = 2,25; cát tuyến h = 0,1 cho 2,35', 'f′(1,5) = 3; cát tuyến h = 0,1 cho 4,00', 'f′(1,5) = 1,5; cát tuyến h = 0,1 cho 1,60'],
    'f′(x) = 2x nên f′(1,5) = 3. Độ dốc cát tuyến [f(x+h) − f(x)]/h = 2x + h: h = 1 cho 4,00, h = 0,1 cho 3,10, tiến về 3 khi h → 0.'),

  q.tf('17', 1, 'Gradient ∇J chỉ hướng làm hàm mất mát giảm nhanh nhất.', false,
    'Sai. Gradient chỉ hướng làm J TĂNG nhanh nhất. Hạ gradient đi theo −∇J, tức ngược gradient, để đi xuống dốc.'),

  q.single('18', 3, 'Với f(w₁, w₂) = w₁² + 3w₁w₂, gradient tại (1, 2) là gì?',
    '(8, 3)',
    ['(2, 3)', '(8, 6)', '(5, 3)'],
    '∂f/∂w₁ = 2w₁ + 3w₂ = 2 + 6 = 8; ∂f/∂w₂ = 3w₁ = 3. Mỗi đạo hàm riêng giữ các biến khác cố định.'),

  q.fill('19', 3, 'Hạ gradient trên f(x) = (x − 3)² với η = 0,2, bắt đầu x₀ = 0. Giá trị x₂ sau hai bước là bao nhiêu?', ['1,92', '1.92'],
    'f′(x) = 2(x − 3). x₁ = 0 − 0,2·(−6) = 1,2; x₂ = 1,2 − 0,2·(−3,6) = 1,92. Càng gần cực tiểu, độ dốc càng nhỏ nên bước càng ngắn.'),

  q.fill('20', 2, 'Cho y = (3x + 1)². Dùng quy tắc chuỗi, dy/dx tại x = 1 bằng bao nhiêu?', ['24'],
    'Đặt u = 3x + 1: dy/du = 2u, du/dx = 3, nên dy/dx = 6(3x + 1) = 24 tại x = 1. Mức thay đổi nhân dồn qua từng mắt xích.'),

  q.single('21', 2, 'Với một nơ-ron sigmoid và J = ½(a − t)², biểu thức ∂J/∂w là gì?',
    '(a − t) · a(1 − a) · x',
    ['(a − t) · x', '(a − t) · a(1 − a)', '(a − t)² · a · x'],
    'Chuỗi w → z → a → J: ∂J/∂a = a − t, ∂a/∂z = a(1 − a), ∂z/∂w = x. Với số liệu bài giảng ra −0,0444, khớp sai phân trung tâm −0,04436.'),

  q.tf('22', 2, 'Gradient ∂J/∂w âm có nghĩa là tăng w một chút sẽ làm J giảm.', true,
    'Đúng. Đạo hàm âm nghĩa là J đi xuống khi w tăng; bước cập nhật w ← w − η·g với g < 0 sẽ làm w tăng.'),

  q.single('23', 1, 'Ý tưởng then chốt giúp lan truyền ngược nhanh hơn tính đạo hàm riêng cho từng trọng số là gì?',
    'Tính các thừa số chung một lần từ đầu ra về đầu vào rồi tái sử dụng cho nhiều trọng số',
    ['Bỏ qua các lớp có gradient nhỏ để tiết kiệm phép tính', 'Xấp xỉ gradient bằng cách thử tăng giảm từng trọng số', 'Chỉ cập nhật trọng số của lớp ra ở mỗi bước'],
    'Nhiều trọng số dùng chung các thừa số đứng sau chúng trong chuỗi. Lan truyền ngược là quy tắc chuỗi cho cả mạng, đi từ lớp ra về lớp vào và tái sử dụng thừa số đã tính.'),

  q.single('24', 2, 'Trong mạng 2-2-1, δ₅ = (y₅ − t)·y₅(1 − y₅) = 0,0368 và y₃ = 0,5523. Gradient ∂J/∂w₁,₃ bằng bao nhiêu?',
    '0,0203',
    ['0,0368', '0,0213', '0,1651'],
    'Gradient trọng số = δ của nơ-ron nhận × đầu ra của nơ-ron gửi: 0,0368 × 0,5523 ≈ 0,0203. (0,0213 là gradient của w₂,₃, dùng y₄ = 0,5781.)'),

  q.match('25', 1, 'Ghép đại lượng lan truyền ngược với công thức.', [
    ['δ ở nơ-ron ra', '(y − t) · σ′(z)'],
    ['δ ở nơ-ron ẩn', 'σ′(z) · Σₖ wₖ δₖ'],
    ['Gradient một trọng số', 'δ_nhận · y_gửi'],
    ['Cập nhật', 'w ← w − η · ∂J/∂w'],
  ], 'Sai số đi ngược: δ của lớp ẩn gom δ của lớp sau theo trọng số rồi nhân đạo hàm cục bộ. Dạng ma trận của tổng này là nhân với Wᵀ.'),

  q.single('26', 2, 'Trong ví dụ, gradient ở lớp ẩn nhỏ hơn lớp ra từ 3,6 đến 22 lần. Đây là dấu hiệu sớm của hiện tượng nào?',
    'Gradient biến mất (vanishing gradient)',
    ['Gradient bùng nổ (exploding gradient)', 'Quá khớp (overfitting)', 'Nơ-ron chết của ReLU'],
    'Mỗi bước lùi nhân thêm đạo hàm sigmoid (≤ 0,25) và một trọng số. Qua nhiều lớp, tích này co về 0 làm các lớp đầu học rất chậm.'),

  q.single('27', 3, 'Sau đúng một bước cập nhật (η = 1) trên mạng 2-2-1, mất mát J thay đổi thế nào?',
    'Giảm từ 0,01362 xuống 0,01273, khoảng 6,6%',
    ['Giảm từ 0,01362 xuống 0, vì mạng đã khớp đáp án', 'Tăng nhẹ vì η = 1 quá lớn', 'Không đổi vì mọi gradient đều dương'],
    'Mọi gradient dương nên mọi trọng số giảm; đầu ra từ 0,6651 xuống 0,6596, gần t = 0,5 hơn. Bước nhỏ vì độ dốc sigmoid ở đầu ra chỉ 0,2227.'),

  q.single('28', 2, 'Với 6 trọng số, kiểm tra gradient bằng sai phân trung tâm tốn bao nhiêu lượt truyền xuôi, và vì sao không dùng nó để huấn luyện?',
    '12 lượt (2 lượt mỗi tham số); quá tốn với mạng hàng triệu tham số, chỉ dùng để kiểm tra',
    ['6 lượt; vì kết quả sai lệch nhiều so với lan truyền ngược', '2 lượt; vì nó không tính được gradient của bias', '1 lượt xuôi và 1 lượt ngược; vì nó không ổn định số học'],
    'Sai phân hữu hạn cần 2 lượt truyền xuôi cho mỗi tham số. Lan truyền ngược chỉ cần 1 lượt xuôi + 1 lượt ngược cho mọi tham số. Sai phân dùng làm gradient check khi viết khối mới.'),

  q.single('29', 2, 'Một bước huấn luyện (xuôi + ngược) tốn khoảng bao nhiêu lần chi phí một lượt truyền xuôi?',
    'Khoảng 3 lần (lượt ngược ≈ 2 lần lượt xuôi)',
    ['Khoảng 1,5 lần', 'Khoảng 10 lần', 'Bằng đúng một lượt xuôi'],
    'Lượt truyền ngược tốn khoảng gấp đôi lượt xuôi, nên một bước huấn luyện ≈ 3× truyền xuôi.'),

  q.single('30', 2, 'Gradient checkpointing đánh đổi điều gì?',
    'Tính lại giá trị kích hoạt thay vì lưu: bộ nhớ giảm mạnh, thời gian tăng khoảng 30%',
    ['Lưu thêm gradient của các bước trước để hội tụ nhanh hơn', 'Giảm độ chính xác số xuống 16 bit để tiết kiệm bộ nhớ', 'Bỏ bớt lớp khi lan truyền ngược để chạy nhanh hơn'],
    'Lan truyền ngược phải giữ giá trị trung gian của lượt xuôi, nên bộ nhớ tăng theo độ sâu và kích thước lô. Checkpointing đổi bộ nhớ lấy thời gian.'),

  q.multi('31', 1, 'Những cách nào giúp chống gradient BIẾN MẤT? (chọn nhiều)',
    ['Dùng ReLU thay sigmoid ở lớp ẩn', 'Khởi tạo trọng số đúng cỡ', 'Chuẩn hoá (normalization)', 'Kết nối tắt (skip connection)'],
    ['Cắt gradient (gradient clipping)', 'Tăng số lớp sigmoid'],
    'Cắt gradient chỉ sửa gradient bùng nổ, không làm gradient nhỏ lớn lên. Gradient biến mất cần ReLU, khởi tạo đúng, chuẩn hoá và đường đi cộng như residual.'),

  q.tf('32', 2, 'PyTorch autograd tự kiểm tra được hàm mất mát bạn viết có đúng với bài toán hay không.', false,
    'Sai. Autograd tự dựng đồ thị tính toán và nhân gradient chính xác, nhưng không biết hàm mất mát có phù hợp bài toán. Chọn loss vẫn là việc của người thiết kế.'),

  q.single('33', 3, 'Vì sao phương pháp Newton không dùng để huấn luyện mạng lớn dù hội tụ rất nhanh?',
    'Cần ma trận độ cong n × n theo số tham số, quá lớn với mạng hàng triệu tham số',
    ['Newton chỉ dùng được cho hàm tuyến tính', 'Newton không dùng đạo hàm nên kém chính xác', 'Newton luôn phân kỳ với hàm mất mát cross-entropy'],
    'Newton dùng thêm độ cong (đạo hàm bậc hai). Với n tham số cần ma trận n × n, không khả thi khi n là hàng triệu đến hàng tỉ.'),

  q.match('34', 1, 'Ghép bài toán với hàm mất mát thường dùng.', [
    ['Hồi quy số thực', 'Sai số bình phương hoặc L1'],
    ['Phân loại 2 lớp', 'Cross-entropy nhị phân (với sigmoid)'],
    ['Phân loại nhiều lớp', 'Cross-entropy (với softmax)'],
    ['Phát hiện vật thể', 'Focal loss cộng smooth-L1'],
  ], 'Hàm mất mát phải nhỏ khi dự đoán tốt và có đạo hàm. Chọn hàm nào quan trọng ngang chọn kiến trúc.'),

  q.match('35', 2, 'Mỗi hàm mất mát ứng với một giả định về phân phối của nhãn. Ghép cho đúng.', [
    ['Gauss, phương sai cố định', 'Sai số bình phương'],
    ['Bernoulli (hai kết cục)', 'Cross-entropy nhị phân'],
    ['Phân phối rời rạc trên C lớp', 'Cross-entropy'],
    ['Laplace', 'Giá trị tuyệt đối (L1)'],
  ], 'Các hàm mất mát này là lôgarit hợp lý âm (NLL) dưới giả định tương ứng. Giả định sai thì mô hình tối ưu một mục tiêu không phù hợp.'),

  q.single('36', 2, 'Vì sao hàm mất mát bình phương dễ bị một nhãn ngoại lai chi phối cả lô?',
    'Bình phương phạt sai số lớn rất nặng: lệch gấp đôi thì phạt gấp bốn',
    ['Bình phương bỏ qua các sai số nhỏ hơn 1', 'Bình phương không có đạo hàm tại 0', 'Bình phương chỉ tính trên mẫu sai nhãn'],
    'ℓ = ½(ŷ − t)², gradient ŷ − t tăng tuyến tính theo sai số. Hợp với nhiễu gần Gauss; nhãn ngoại lai cho gradient rất lớn.'),

  q.tf('37', 3, '`torch.nn.MSELoss()` có hệ số ½ giống công thức ℓ = ½(ŷ − t)² trong bài.', false,
    'Sai. MSELoss không có hệ số ½ và lấy trung bình trên mọi phần tử của đầu ra. Hệ số ½ trong bài chỉ để đạo hàm gọn thành ŷ − t.'),

  q.single('38', 2, 'Cross-entropy nhị phân với p = 0,9: mất mát khi t = 1 và khi t = 0 lần lượt bằng bao nhiêu?',
    '0,105 và 2,303',
    ['0,9 và 0,1', '0,105 và 0,105', '2,303 và 0,105'],
    'ℓ = −log(xác suất gán cho đáp án đúng). t = 1: −ln 0,9 = 0,105. t = 0: −ln 0,1 = 2,303. Dự đoán sai với độ tự tin cao bị phạt nặng.'),

  q.single('39', 2, 'Vì sao nên dùng `BCEWithLogitsLoss` thay vì sigmoid rồi BCE?',
    'Nó tính trực tiếp từ logit theo dạng chỉ lấy mũ của số không dương, nên không tràn số',
    ['Nó bỏ được hàm sigmoid nên mô hình học nhanh gấp đôi', 'Nó tự cân bằng các lớp mất cân bằng', 'Nó cho phép nhãn nằm ngoài khoảng [0, 1]'],
    'Dạng ℓ = max(z, 0) − tz + log(1 + e^(−|z|)) tương đương log(1 + eᶻ) − tz nhưng ổn định số học.'),

  q.single('40', 2, 'Softmax của logit z = (2,0; 1,0; 0,1) cho xác suất xấp xỉ bao nhiêu?',
    '(0,659; 0,242; 0,099)',
    ['(0,645; 0,323; 0,032)', '(0,333; 0,333; 0,333)', '(0,500; 0,300; 0,200)'],
    'eᶻ = (7,39; 2,72; 1,11), tổng 11,21. Chia ra được (0,659; 0,242; 0,099); tổng bằng 1, mọi p > 0.'),

  q.tf('41', 2, 'Trừ logit lớn nhất khỏi mọi zₖ trước khi tính softmax làm thay đổi kết quả xác suất.', false,
    'Sai. Trừ cùng một hằng số ở cả tử và mẫu triệt tiêu nhau, kết quả không đổi. Mẹo này chỉ để tránh tràn số khi lấy mũ.'),

  q.fill('42', 2, 'Mất mát ở bước 0 của bộ phân loại 10 lớp (chưa học gì, softmax gần đều) nên xấp xỉ bao nhiêu? (2 chữ số thập phân)', ['2,30', '2,3026', 'ln 10', 'ln10'],
    'Khi pₖ = 1/C, ℓ = −log(1/C) = ln C. ln 10 ≈ 2,3026. Lệch xa ln C ở bước 0 là lỗi khởi tạo, nhãn hoặc mã.'),

  q.single('43', 1, 'Gradient của softmax kèm cross-entropy theo logit zₖ là gì?',
    'pₖ − yₖ: xác suất dự đoán trừ nhãn one-hot',
    ['−log pₖ', 'pₖ(1 − pₖ)', '(pₖ − yₖ) · pₖ(1 − pₖ)'],
    'Các phép đạo hàm của softmax và cross-entropy triệt tiêu nhau. Ví dụ p = (0,659; 0,242; 0,099), nhãn lớp 1: gradient = (−0,341; 0,242; 0,099); lớp đúng được đẩy lên, lớp sai bị kéo xuống.'),

  q.single('44', 1, 'Vì sao phân loại dùng cross-entropy thay vì sai số bình phương trên đầu ra sigmoid?',
    'Với cross-entropy, thừa số ŷ(1 − ŷ) triệt tiêu nên gradient không bão hoà khi nơ-ron sai',
    ['Cross-entropy luôn cho giá trị mất mát nhỏ hơn', 'Sai số bình phương không có đạo hàm với nhãn 0/1', 'Cross-entropy không cần hàm kích hoạt ở lớp ra'],
    'Cùng ví dụ: sigmoid + bình phương cho gradient 0,0368, sigmoid + cross-entropy cho ŷ − t = 0,1651 (lớn hơn 4,5 lần). Khi ŷ ≈ 0 mà t = 1, bình phương gần như dừng học.'),

  q.single('45', 2, 'Smooth-L1 kết hợp ưu điểm nào của L2 và L1?',
    'Trơn, bậc hai gần 0 như L2; gradient bị chặn ở ±1 khi sai số lớn như L1',
    ['Gradient tăng tuyến tính ở mọi nơi như L2', 'Không có đạo hàm tại 0 như L1 nên ổn định hơn', 'Luôn bằng IoU giữa hai hộp'],
    'ℓ = ½r² khi |r| < 1, ngược lại |r| − ½. Fast R-CNN cộng smooth-L1 của 4 sai số hộp; hộp lệch xa không làm huấn luyện mất ổn định.'),

  q.single('46', 1, 'Focal loss FL(p_t) = −(1 − p_t)^γ log p_t giải quyết vấn đề gì?',
    'Mất cân bằng lớp: hàng chục nghìn hộp nền dễ chiếm phần lớn mất mát',
    ['Gradient bùng nổ khi hộp lệch xa đáp án', 'Hộp dự đoán không giao với hộp thật nên IoU = 0', 'Mô hình quá tự tin khi kiểm tra trên dữ liệu dịch chuyển'],
    'Mẫu dễ có p_t gần 1 nên (1 − p_t)^γ gần 0, mất mát bị thu nhỏ; gradient tập trung vào mẫu khó.'),

  q.single('47', 2, 'Với γ = 2, focal loss giảm mất mát của một mẫu dễ có p_t = 0,9 bao nhiêu lần so với cross-entropy?',
    '100 lần',
    ['10 lần', '2 lần', '1 000 lần'],
    '(1 − 0,9)² = 0,01 nên giảm 100 lần. p_t ≈ 0,968 giảm 1 000 lần; p_t ≤ 0,5 giảm tối đa 4 lần. γ = 0 cho lại cross-entropy; RetinaNet dùng γ = 2.'),

  q.single('48', 2, 'Vì sao IoU thuần không phù hợp làm hàm mất mát cho hộp bao?',
    'IoU bằng 0 khi hai hộp không giao nhau dù gần hay xa, nên không cho hướng sửa',
    ['IoU không bất biến theo tỉ lệ hộp', 'IoU luôn lớn hơn 1 với hộp lớn', 'IoU chỉ tính được trên ảnh vuông'],
    'Gradient bằng 0 khi không giao. GIoU vẫn cho gradient trong trường hợp này. Nói chung mất mát phải có đạo hàm, còn thước đo đánh giá thì không cần.'),

  q.fill('49', 3, 'Suy giảm trọng số với η = 0,1, λ = 0,01: mỗi bước trọng số bị nhân với hệ số bao nhiêu trước khi trừ gradient?', ['0,999', '0.999'],
    'w ← (1 − ηλ)w − η·∂J/∂w, nên hệ số co là 1 − 0,1·0,01 = 0,999. Phạt trọng số lớn tương đương tin trước rằng trọng số nhỏ có khả năng cao hơn.'),

  q.single('50', 1, 'Hạ gradient trên f(x) = x² cho x ← (1 − 2η)x. Với η = 1,05 điều gì xảy ra?',
    'Hệ số −1,1: x nhảy qua lại và lớn dần, phân kỳ',
    ['Hệ số 0,1: hội tụ rất nhanh', 'Hệ số 0,9: hội tụ chậm', 'Hệ số 0: hội tụ ngay sau một bước'],
    'Hội tụ khi 0 < η < 1 (|1 − 2η| < 1). η = 0,05 giảm chậm (0,9), η = 0,45 giảm nhanh (0,1), η = 1,05 phân kỳ (−1,1).'),

  q.single('51', 2, 'Tăng kích thước lô nhỏ B lên 4 lần thì độ nhiễu của gradient ước lượng thay đổi thế nào?',
    'Giảm một nửa, vì nhiễu tỉ lệ 1/√B',
    ['Giảm 4 lần, vì nhiễu tỉ lệ 1/B', 'Không đổi, vì gradient lô luôn không chệch', 'Tăng gấp đôi, vì có nhiều mẫu nhiễu hơn'],
    'g_B là ước lượng không chệch của ∇J với nhiễu ∝ 1/√B. Lô lớn ổn định hơn nhưng lợi ích giảm dần; lô nhỏ cho nhiều bước rẻ hơn.'),

  q.single('52', 2, 'Động lượng b_t = μ·b_{t−1} + g_t (μ ≈ 0,9) giúp gì trên thung lũng hẹp?',
    'Cộng dồn hướng ổn định và triệt tiêu dao động qua lại giữa hai thành',
    ['Đảm bảo luôn tìm được cực tiểu toàn cục', 'Tự chọn tốc độ học riêng cho từng tham số', 'Loại bỏ nhu cầu dùng lịch tốc độ học'],
    'Như quả bóng lăn có quán tính: hướng nhất quán qua nhiều bước được khuếch đại, hướng dao động triệt tiêu. Tự chọn bước theo tham số là việc của Adam.'),

  q.single('53', 1, 'Trong Adam, vì sao bước cập nhật chia cho √v̂_t?',
    'Để tham số có gradient luôn lớn nhận bước nhỏ hơn và ngược lại: mỗi tham số đi cỡ η mỗi bước',
    ['Để hiệu chỉnh độ chệch do khởi tạo m, v bằng 0', 'Để triệt tiêu số hạng suy giảm trọng số', 'Để gradient luôn có chuẩn bằng 1'],
    'v_t là trung bình trượt của g² (độ lớn), m_t là trung bình trượt của g (hướng). Hiệu chỉnh độ chệch là việc của m̂, v̂; ε = 10⁻⁸ tránh chia 0.'),

  q.fill('54', 3, 'Giá trị mặc định của β₂ trong Adam là bao nhiêu?', ['0,999', '0.999'],
    'Mặc định: η = 10⁻³, β₁ = 0,9, β₂ = 0,999, ε = 10⁻⁸.'),

  q.single('55', 1, 'AdamW khác `Adam(weight_decay=...)` của PyTorch ở điểm nào?',
    'AdamW tách suy giảm trọng số khỏi gradient nên số hạng λw không bị chia cho √v̂',
    ['AdamW không dùng trung bình trượt của gradient bình phương', 'AdamW chỉ áp dụng cho bias và tham số chuẩn hoá', 'AdamW thay động lượng bằng lịch tốc độ học cosine'],
    'Adam(weight_decay) cộng λw vào gradient trước khi chia √v̂, tức L2 gộp vào gradient. AdamW: w ← w − ηλw − η·m̂/(√v̂ + ε), mọi trọng số co cùng tốc độ. AdamW mặc định λ = 0,01.'),

  q.single('56', 2, 'Vì sao cần khởi động (warmup) tốc độ học ở đầu huấn luyện?',
    'Đầu huấn luyện mạng đổi rất nhanh và thống kê của bộ tối ưu chưa tin cậy',
    ['Để tiết kiệm bộ nhớ GPU ở các bước đầu', 'Vì gradient ở bước đầu luôn bằng 0', 'Để mô hình quá khớp nhanh hơn một lô nhỏ'],
    'Warmup tăng tuyến tính η từ 0 lên giá trị đích trong vài trăm đến vài nghìn bước, rồi thường giảm theo cosine về η_min.'),

  q.single('57', 1, 'Khởi tạo He cho lớp ReLU đặt phương sai trọng số bằng bao nhiêu, và vì sao?',
    'Var[W] = 2/n_vào, vì ReLU cắt mất khoảng một nửa tín hiệu nên phải nhân đôi để bù',
    ['Var[W] = 1/n_vào, vì cần giữ nguyên phương sai đầu vào', 'Var[W] = 2/n_ra, vì gradient đi ngược từ lớp ra', 'Var[W] = 0, để mọi nơ-ron bắt đầu giống nhau'],
    'Bù thiếu thì tín hiệu co về 0 qua các lớp; bù đúng giữ ổn định qua 30 lớp. Lưu ý: mặc định của nn.Linear không phải He.'),

  q.single('58', 2, 'Trong BatchNorm y = γx̂ + β, vai trò của γ và β là gì?',
    'Hai hệ số học được, cho phép lớp khôi phục lại phép đồng nhất nếu cần',
    ['Trung bình và phương sai của lô, tính lại mỗi bước', 'Hằng số cố định để tránh chia cho 0', 'Tốc độ học và động lượng riêng của lớp chuẩn hoá'],
    'x̂ đưa mỗi đặc trưng về trung bình 0, độ lệch chuẩn 1 trên lô; γ (scale), β (shift) được học. LayerNorm làm tương tự nhưng trên từng mẫu, không phụ thuộc lô.'),

  q.single('59', 2, 'Với dropout xác suất tắt q, các nơ-ron còn lại được xử lý thế nào khi huấn luyện?',
    'Nhân với 1/(1 − q) để giữ nguyên trung bình; khi suy luận dùng toàn bộ nơ-ron',
    ['Nhân với q để giảm ảnh hưởng của chúng', 'Giữ nguyên khi huấn luyện, chia cho q khi suy luận', 'Tắt luôn cả khi suy luận với cùng xác suất'],
    'Không nơ-ron nào dựa hẳn vào nơ-ron khác nên giảm quá khớp. Trong PyTorch, p là xác suất tắt; một số tài liệu dùng p là xác suất giữ.'),

  q.single('60', 2, 'Cắt gradient g ← g·min(1, c/‖g‖) làm gì với hướng của gradient?',
    'Giữ nguyên hướng, chỉ giới hạn độ dài bước khi gradient đột ngột lớn',
    ['Đổi hướng gradient về phía cực tiểu gần nhất', 'Đặt mọi thành phần vượt ngưỡng c về 0', 'Chuẩn hoá mọi gradient về độ dài đúng bằng c'],
    'Cắt theo chuẩn chỉ thu nhỏ vector khi ‖g‖ vượt c. Gradient nhỏ hơn c được giữ nguyên.'),

  q.single('61', 3, 'Trong độ chính xác hỗn hợp FP16, vì sao nhân mất mát với hệ số s rồi chia lại trước khi cập nhật?',
    'Để gradient nhỏ không bị làm tròn về 0 trong số 16 bit',
    ['Để tăng tốc độ học lên s lần', 'Để bù cho việc bỏ bớt lớp khi lan truyền ngược', 'Vì bfloat16 bắt buộc phải tỉ lệ hoá mất mát'],
    'Loss scaling giữ gradient nhỏ trong miền biểu diễn của FP16. bfloat16 có dải mũ rộng như FP32 nên thường không cần.'),

  q.single('62', 2, 'Quy tắc co giãn tuyến tính khi tăng kích thước lô là gì?',
    'Lô nhân k thì tốc độ học nhân k, kèm khởi động; kiểm chứng trên ResNet-50 đến lô ≈ 8 000',
    ['Lô nhân k thì tốc độ học chia k', 'Lô nhân k thì số epoch nhân k', 'Lô nhân k thì giữ nguyên tốc độ học, bỏ khởi động'],
    'Vượt khoảng lô 8 000 thì độ chính xác giảm. Khởi động giúp giai đoạn đầu ổn định khi η lớn.'),

  q.match('63', 1, 'Ghép dạng đường cong mất mát với chẩn đoán.', [
    ['Dao động, tăng rồi thành NaN', 'Tốc độ học quá cao'],
    ['Giảm gần tuyến tính, rất chậm', 'Tốc độ học quá thấp'],
    ['Huấn luyện về gần 0, kiểm định tăng trở lại', 'Quá khớp'],
    ['Phẳng từ bước 0, quanh ln C', 'Gradient không chảy, nhãn sai hoặc tốc độ học quá thấp'],
  ], 'Kiểm tra đầu tiên khi mất mát phẳng: cho mô hình quá khớp một lô nhỏ. Mất mát NaN: cắt gradient, tính từ logit, tỉ lệ hoá mất mát.'),

  q.single('64', 1, 'Mô hình không quá khớp được một lô 2 đến 20 mẫu (đã tắt chính quy hoá và tăng cường). Nguyên nhân thường là gì?',
    'Lỗi mã: nhãn không khớp đầu vào, hàm mất mát sai, tham số không được cập nhật',
    ['Mô hình quá nhỏ, cần tăng số lớp', 'Dữ liệu huấn luyện quá ít', 'Tốc độ học quá nhỏ so với lô lớn'],
    'Một lô nhỏ mà không khớp được thì gần như chắc là lỗi mã, ít khi do năng lực biểu diễn. Đây là bước kiểm tra trước khi huấn luyện lâu.'),

  q.tf('65', 2, 'Nhiệm vụ của bộ tối ưu hoá là tìm cực tiểu toàn cục của hàm mất mát huấn luyện.', false,
    'Sai. Nhiều cực tiểu cùng khớp tập huấn luyện nhưng tổng quát hoá khác nhau. Mục tiêu là cực tiểu tổng quát hoá tốt; tốc độ học, kích thước lô và chính quy hoá quan trọng hơn giá trị mất mát huấn luyện cuối cùng.'),

  q.single('66', 2, 'Tăng độ phức tạp mô hình (ví dụ đa thức bậc 1 → bậc 11) ảnh hưởng thế nào đến độ chệch và phương sai?',
    'Độ chệch giảm, phương sai tăng',
    ['Độ chệch tăng, phương sai giảm', 'Cả hai cùng giảm', 'Cả hai cùng tăng'],
    'Bậc 1 chưa khớp (độ chệch cao); bậc 11 đi qua mọi điểm nhiễu (phương sai cao). Thêm dữ liệu, chính quy hoá, dừng sớm giúp giảm phương sai.'),
]
