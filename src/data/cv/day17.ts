import { maker } from './make'

const q = maker(17)

// Day 17 · Kiến trúc mạng cho thị giác máy tính
export const day17 = [
  q.multi('01', 1, 'Hai tính chất của ảnh mà tích chập mã hoá vào cấu trúc mạng (còn MLP bỏ qua) là gì?',
    ['Tính cục bộ: điểm ảnh gần nhau liên hệ chặt', 'Dùng chung trọng số: cùng một mẫu có thể xuất hiện ở mọi vị trí'],
    ['Tính bất biến hoàn toàn với phép xoay', 'Mọi điểm ảnh đều phụ thuộc vào toàn bộ ảnh'],
    'Tích chập dùng kết nối cục bộ và chia sẻ bộ lọc giữa các vị trí, nên cần ít tham số và ít dữ liệu hơn MLP để học cùng một việc. Đây là giả định về dữ liệu, không phải định luật.'),

  q.fill('02', 1, 'Lớp 1 của AlexNet: ảnh vào 227, k = 11, s = 4, p = 0. Kích thước đầu ra H_out là bao nhiêu?', ['55'],
    'H_out = ⌊(H + 2p − d(k − 1) − 1)/s⌋ + 1 = ⌊(227 − 11)/4⌋ + 1 = 54 + 1 = 55. Với 224 thương không nguyên, nên kích thước thực dùng là 227.'),

  q.tf('03', 2, '`nn.Conv2d` trong PyTorch lật bộ lọc trước khi trượt, đúng như định nghĩa tích chập toán học.', false,
    'Sai. Phép tính thực tế là tương quan chéo (cross-correlation), không lật bộ lọc. Vì bộ lọc được học nên việc có lật hay không không đổi khả năng biểu diễn.'),

  q.single('04', 2, 'Bộ lọc [[1, 0, −1], [1, 0, −1], [1, 0, −1]] phản hồi mạnh với gì?',
    'Cạnh dọc: độ sáng đổi từ trái sang phải',
    ['Cạnh ngang: độ sáng đổi từ trên xuống dưới', 'Vùng có độ sáng đều', 'Điểm sáng đơn lẻ ở tâm cửa sổ'],
    'Cột trái cộng, cột phải trừ nên đầu ra lớn khi độ sáng khác nhau giữa hai bên. Bộ lọc dùng chung cho mọi vị trí nên cả phép tính chỉ có 9 tham số.'),

  q.single('05', 1, 'Số tham số của một lớp tích chập phụ thuộc vào những gì?',
    'C_out·(C_in·k² + 1): không phụ thuộc kích thước ảnh',
    ['H_out·W_out·C_out: tăng theo diện tích ảnh', 'C_in·C_out: không phụ thuộc cỡ bộ lọc', 'k²: chỉ phụ thuộc cỡ bộ lọc'],
    'Số tham số không phụ thuộc kích thước ảnh, nhưng chi phí tính toán MAC = H_out·W_out·C_out·C_in·k² thì tỉ lệ với diện tích đầu ra.'),

  q.fill('06', 3, 'AlexNet lớp 1 có 96 bộ lọc 11 × 11 × 3 (có bias). Có bao nhiêu tham số?', ['34944', '34 944', '34.944'],
    '96·(11·11·3 + 1) = 96·364 = 34 944. Nếu mỗi vị trí đầu ra 55 × 55 có trọng số riêng thì cần 105 705 600 tham số: chia sẻ trọng số tiết kiệm hơn 3 000 lần.'),

  q.single('07', 2, 'Tích chập 1 × 1 làm gì?',
    'Như một lớp kết nối đầy đủ áp dụng độc lập tại từng điểm ảnh: trộn kênh, không trộn vị trí',
    ['Giảm kích thước không gian đi một nửa', 'Không làm gì, chỉ sao chép đầu vào', 'Trộn thông tin giữa các vị trí lân cận'],
    'Chi phí H·W·C_in·C_out. Thường dùng để đổi số kênh, ví dụ trong khối nút cổ chai hoặc lateral conv của FPN.'),

  q.single('08', 2, 'Trong CNN điển hình, vì sao mỗi giai đoạn giảm diện tích 4 lần và tăng số kênh gấp đôi?',
    'Để lượng tính toán mỗi giai đoạn gần như ngang nhau',
    ['Để số tham số mỗi giai đoạn bằng nhau', 'Để trường tiếp nhận không đổi qua các giai đoạn', 'Vì GPU chỉ xử lý được số kênh là lũy thừa của 2'],
    'MAC tỉ lệ H·W·C_in·C_out: chia diện tích cho 4 và nhân đôi cả C_in lẫn C_out giữ chi phí xấp xỉ. ResNet-50 đưa ảnh 224 thành lưới 7 × 7 × 2048, bước tổng 32.'),

  q.single('09', 2, 'Gộp trung bình toàn cục (global average pooling) thay cho lớp kết nối đầy đủ lớn mang lại lợi ích gì?',
    'Mạng chấp nhận ảnh có kích thước khác lúc huấn luyện',
    ['Mạng có tính bất biến tuyệt đối với phép dịch', 'Mạng không cần hàm kích hoạt ở lớp cuối', 'Mạng tăng được trường tiếp nhận lên gấp đôi'],
    'Gộp toàn cục biến bản đồ đặc trưng bất kỳ kích thước thành một vector cố định theo số kênh, đồng thời bỏ phần lớn tham số của lớp FC.'),

  q.match('10', 1, 'Ghép bài toán với tính chất nó cần.', [
    ['Phát hiện vật thể', 'Tương đương dịch chuyển: vật dịch thì đầu ra dịch theo'],
    ['Phân loại ảnh', 'Bất biến: nhãn không đổi khi vật dịch'],
  ], 'Tích chập cho tính tương đương dịch chuyển; tính bất biến chỉ đến từ gộp (pooling) và chỉ gần đúng.'),

  q.fill('11', 2, 'Ba lớp tích chập 3 × 3, lớp giữa có bước 2 (hai lớp kia bước 1). Trường tiếp nhận là bao nhiêu pixel?', ['9'],
    'r_l = r_{l−1} + (k − 1)·j_{l−1}, j_l = j_{l−1}·s_l: r = 1 + 2·1 + 2·1 + 2·2 = 9. Nếu cả ba bước 1 thì r = 7. Đệm không ảnh hưởng trường tiếp nhận.'),

  q.single('12', 2, 'Vì sao VGG xếp chồng hai lớp 3 × 3 thay vì một lớp 5 × 5?',
    'Cùng trường tiếp nhận 5 × 5 nhưng ít tham số hơn 28% (18C² so với 25C²) và có thêm một phi tuyến',
    ['Hai lớp 3 × 3 có trường tiếp nhận lớn hơn 5 × 5', 'Lớp 5 × 5 không chạy được trên GPU thời đó', 'Hai lớp 3 × 3 không cần hàm kích hoạt'],
    '2·9C² = 18C² < 25C². Tương tự ba lớp 3 × 3 (27C²) thay một lớp 7 × 7 (49C²).'),

  q.single('13', 1, 'Mạng thường 56 lớp có sai số HUẤN LUYỆN cao hơn mạng 20 lớp trên CIFAR-10. Đây là hiện tượng gì?',
    'Suy giảm (degradation): bộ tối ưu không tìm ra nghiệm tốt, không phải quá khớp',
    ['Quá khớp vì mạng sâu có quá nhiều tham số', 'Gradient bùng nổ do thiếu cắt gradient', 'Thiếu dữ liệu tăng cường'],
    'Quá khớp thì sai số huấn luyện phải thấp. Mạng sâu hơn luôn biểu diễn được mạng nông (thêm lớp đồng nhất) nhưng bộ tối ưu không tìm ra nghiệm đó.'),

  q.single('14', 1, 'Khối residual thay đổi bài toán học như thế nào?',
    'Lớp học phần dư F(x) = H(x) − x, đầu ra là F(x) + x',
    ['Lớp học trực tiếp H(x) nhưng với tốc độ học lớn hơn', 'Lớp bỏ qua đầu vào x và chỉ học từ nhãn', 'Lớp học H(x) rồi nhân với x'],
    'Đường tắt cộng thẳng đầu vào vào đầu ra nên khối chỉ cần học phần dư, và gradient có đường đi trực tiếp về các lớp đầu.'),

  q.tf('15', 2, 'Theo nhóm tác giả ResNet, hiện tượng suy giảm chủ yếu do gradient triệt tiêu.', false,
    'Sai. Mạng đã có BatchNorm nên tác giả ghi nhận suy giảm là do khó tối ưu; đường tắt làm bài toán tối ưu dễ hơn. ResNet-34 còn lỗi 25,03% so với 28,54% của mạng thường 34 lớp.'),

  q.match('16', 1, 'Ghép phương pháp chuẩn hoá với phạm vi tính µ, σ² và lúc nên dùng.', [
    ['BatchNorm', 'Mỗi kênh, qua cả lô và vị trí; lô đủ lớn, CNN phân loại'],
    ['LayerNorm', 'Mỗi mẫu, qua mọi kênh; Transformer, độc lập cỡ lô'],
    ['GroupNorm', 'Mỗi mẫu, theo nhóm kênh; lô nhỏ như phát hiện, policy robot'],
  ], 'BatchNorm lúc suy luận dùng trung bình động của tập huấn luyện. Diffusion Policy thay BatchNorm bằng GroupNorm khi huấn luyện ResNet-18 từ đầu cùng EMA.'),

  q.single('17', 2, 'Lỗi suy luận phổ biến liên quan đến BatchNorm là gì?',
    'Quên chuyển sang chế độ eval, nên đầu ra một ảnh phụ thuộc các ảnh khác trong lô',
    ['Dùng BatchNorm với lô lớn hơn 32', 'Gộp BatchNorm vào tích chập trước khi xuất mô hình', 'Dùng trung bình động thay cho thống kê của lô'],
    'Ở chế độ eval, BatchNorm dùng thống kê trung bình động đã học nên kết quả của một ảnh độc lập với lô. Ở chế độ train, nó dùng thống kê của lô hiện tại.'),

  q.single('18', 1, 'FPN cải thiện thang đặc trưng như thế nào?',
    'Thêm đường từ trên xuống: tầng sâu được nâng ×2 và cộng vào tầng nông, nên mọi tầng vừa giàu ngữ nghĩa vừa giữ phân giải',
    ['Chỉ dùng tầng sâu nhất C₅ cho mọi kích thước vật', 'Tăng bước trượt để mọi tầng có cùng kích thước', 'Bỏ các tầng nông để giảm chi phí'],
    'C₂–C₅ có bước 4, 8, 16, 32. Tầng nông phân giải cao nhưng ngữ nghĩa yếu. Với Faster R-CNN R-50, FPN đưa AP từ 31,6 lên 33,9, vật nhỏ từ 13,2 lên 17,8.'),

  q.match('19', 1, 'Ghép cấu trúc dữ liệu với họ kiến trúc khớp với nó.', [
    ['Lưới không gian (ảnh camera, bản đồ BEV)', 'Tích chập'],
    ['Chuỗi thời gian (IMU, odometry)', 'Mạng hồi quy (RNN, LSTM, GRU)'],
    ['Tập không thứ tự (đối tượng, điểm LiDAR, token)', 'Attention'],
  ], 'Kiến trúc khớp cấu trúc dữ liệu: giả định đúng thì ít dữ liệu vẫn học được.'),

  q.single('20', 2, 'Số tham số của một RNN h_t = tanh(W_hh h_{t−1} + W_xh x_t + b) phụ thuộc vào độ dài chuỗi thế nào?',
    'Không phụ thuộc: h(h + d) + h, cùng trọng số dùng ở mọi bước',
    ['Tăng tuyến tính theo độ dài chuỗi', 'Tăng bình phương theo độ dài chuỗi', 'Giảm khi chuỗi dài hơn'],
    'Cùng W_hh, W_xh ở mọi bước nên mạng xử lý chuỗi dài tuỳ ý; h_t là bản tóm tắt kích thước cố định của x₁…x_t.'),

  q.single('21', 2, 'Gradient qua RNN bị chặn bởi η^(t−k) với η = γ·σ_max(W_hh). Với hệ số 0,9 mỗi bước, sau 50 bước gradient còn khoảng bao nhiêu?',
    '5,2·10⁻³',
    ['0,45', '1,2·10⁻¹', '2,7·10⁻⁵'],
    '0,9⁵⁰ ≈ 5,2·10⁻³ (20 bước: 0,12; 100 bước: 2,7·10⁻⁵). Với hệ số 1,1 thì bùng nổ: 100 bước ≈ 1,4·10⁴. γ = 1 với tanh, ¼ với sigmoid.'),

  q.tf('22', 1, 'Cắt gradient (gradient clipping) sửa được cả gradient bùng nổ lẫn gradient triệt tiêu.', false,
    'Sai. Cắt theo chuẩn chỉ thu nhỏ gradient quá lớn, không làm gradient nhỏ lớn lên. Triệt tiêu chỉ sửa bằng đổi kiến trúc: thêm đường cộng (LSTM, GRU, residual).'),

  q.single('23', 1, 'Vì sao LSTM giữ thông tin lâu tốt hơn RNN thường?',
    'Ô nhớ c_t chỉ bị nhân từng phần tử với cổng quên rồi cộng thông tin mới, không qua nhân ma trận và tanh ở mọi bước',
    ['LSTM có ít tham số hơn nên ít bị quá khớp', 'LSTM xử lý mọi bước song song nên không có chuỗi nhân', 'LSTM không dùng hàm kích hoạt nên gradient không co'],
    'Gradient đi theo đường cộng nên co chậm hơn: ở 50 bước, RNN còn ~10⁻¹⁶, LSTM ~10⁻¹¹, LSTM có bias cổng quên = 1 còn ~10⁻⁵. Đổi lại LSTM có số tham số gấp 4 lần.'),

  q.match('24', 2, 'Ghép cổng của LSTM với vai trò.', [
    ['Cổng quên f_t', 'Giữ lại bao nhiêu ô nhớ cũ c_{t−1}'],
    ['Cổng nhập i_t', 'Ghi bao nhiêu nội dung mới c̃_t'],
    ['Cổng ra o_t', 'Đưa phần nào của ô nhớ ra h_t'],
  ], 'Đầu vào của các cổng là x_t ghép với h_{t−1}. Cổng làm việc giữ thông tin lâu dài trở nên dễ học, nhưng không bảo đảm hết triệt tiêu gradient.'),

  q.single('25', 2, 'GRU khác LSTM ở điểm nào?',
    'Một trạng thái h_t và hai cổng (đặt lại, cập nhật); ít tham số hơn LSTM một phần tư, chất lượng thường gần nhau',
    ['Ba trạng thái và bốn cổng, nhiều tham số hơn LSTM', 'Không có cổng, chỉ có kết nối tắt', 'Dùng attention thay cho trạng thái ẩn'],
    'h_t = z_t ⊙ h_{t−1} + (1 − z_t) ⊙ h̃_t. Khi z_t ≈ 1 trạng thái cũ được giữ nguyên. Tham số 3h(h + d) + 3h so với 4 lần của LSTM.'),

  q.multi('26', 2, 'Những giới hạn nào khiến attention thay RNN trong phần lớn bài toán chuỗi dài? (chọn nhiều)',
    ['Tính toán tuần tự: bước t cần h_{t−1}, không song song theo thời gian được', 'Thông tin từ bước xa phải đi qua mọi bước ở giữa (đường đi O(n))', 'Mọi lịch sử bị nén vào một vector cố định'],
    ['Số tham số tăng theo độ dài chuỗi', 'Không xử lý được chuỗi có độ dài thay đổi'],
    'RNN vẫn hữu ích khi xử lý luồng thời gian thực: mỗi khung chỉ cần h_{t−1}, không cần giữ cả lịch sử.'),

  q.single('27', 1, 'Công thức attention tích vô hướng co giãn là gì?',
    'softmax(QKᵀ/√d_k)·V',
    ['softmax(QV)·Kᵀ/√d_k', 'QKᵀ·softmax(V)', 'softmax(Q + K)·V'],
    'So truy vấn với mọi khoá, softmax thành trọng số, rồi lấy trung bình có trọng số của giá trị. Chia √d_k để logit không quá lớn làm softmax bão hoà.'),

  q.single('28', 2, 'Trong attention nhiều đầu với h đầu, vì sao tổng chi phí xấp xỉ một đầu đầy đủ?',
    'Mỗi đầu dùng d_k = d_model/h chiều',
    ['Các đầu dùng chung một bộ chiếu Q, K, V', 'Chỉ một đầu được tính, các đầu khác sao chép', 'Mỗi đầu chỉ nhìn 1/h số token'],
    'h phép attention chạy song song với bộ chiếu riêng; mỗi đầu có thể chuyên về một kiểu quan hệ. Kết quả các đầu được ghép rồi chiếu thêm một lần.'),

  q.single('29', 1, 'Vì sao Transformer cần mã hoá vị trí?',
    'Attention xử lý một tập: đổi thứ tự token thì đầu ra chỉ đổi thứ tự theo, không biết vị trí',
    ['Để giảm chi phí attention từ bình phương xuống tuyến tính', 'Để thay cho hàm softmax', 'Vì FFN không xử lý được token đứng riêng'],
    'Cộng vector vị trí vào mỗi token trước lớp đầu. Dạng hình sin: chiều thấp dao động nhanh, chiều cao dao động chậm, giống chữ số của một bộ đếm.'),

  q.single('30', 2, 'Trong khối Transformer, attention và FFN chia nhau việc gì?',
    'Attention trộn thông tin giữa các token; FFN xử lý từng token độc lập',
    ['Attention xử lý từng token; FFN trộn thông tin giữa các token', 'Cả hai đều trộn thông tin giữa các token', 'Attention chỉ dùng ở decoder, FFN chỉ ở encoder'],
    'FFN là W₂φ(W₁x) với lớp ẩn 4d, tương đương hai tích chập 1 × 1. Mỗi khối có hai kết nối tắt residual và xấp xỉ 12d² tham số.'),

  q.single('31', 2, 'Chú ý chéo (cross-attention) lấy Q, K, V từ đâu?',
    'Truy vấn từ một tập, khoá và giá trị từ một tập khác',
    ['Cả Q, K, V từ cùng một tập token', 'Q và K từ cùng tập, V từ tập khác', 'Chỉ dùng Q, không cần K và V'],
    'Đây là cơ chế của mọi mô hình truy vấn: truy vấn đối tượng đọc đặc trưng ảnh (DETR), truy vấn BEV đọc đặc trưng nhiều camera, truy vấn của track đọc khung hiện tại.'),

  q.match('32', 2, 'Ghép loại lớp với chi phí mỗi lớp (n token, d chiều).', [
    ['Attention tự thân', 'O(n²d), đường đi dài nhất O(1)'],
    ['Hồi quy', 'O(nd²), tuần tự O(n), đường đi O(n)'],
    ['Tích chập cỡ k', 'O(knd²), đường đi O(log_k n)'],
  ], 'Attention nối thẳng mọi cặp token nhưng chi phí bình phương theo n. Ảnh 640 × 640 với bước 8 cho n = 6 400, bản đồ attention 4,1·10⁷ phần tử mỗi đầu.'),

  q.fill('33', 2, 'ViT với ảnh 224 × 224, mảnh 16 × 16, thêm token [CLS]. Tổng cộng bao nhiêu token?', ['197'],
    'N = HW/P² = 224²/16² = 196 mảnh, thêm [CLS] thành 197. Phép chiếu mảnh tương đương Conv2d(3, 768, k = 16, s = 16).'),

  q.single('34', 1, 'Vì sao ViT cần dữ liệu tiền huấn luyện lớn hơn CNN?',
    'Chỉ MLP là cục bộ còn attention là toàn cục: thiên kiến quy nạp yếu hơn, phải học nhiều hơn từ dữ liệu',
    ['ViT có ít tham số hơn CNN nên cần thêm dữ liệu', 'ViT không dùng được tăng cường dữ liệu', 'ViT chỉ nhận ảnh độ phân giải thấp'],
    'ViT-B/16: 79,2 top-1 khi chỉ học trên ImageNet-1k, nhưng 84,5 khi tiền huấn luyện 21k. DeiT cho thấy tăng cường mạnh và chưng cất bù được phần nào.'),

  q.order('35', 2, 'Sắp xếp các thành phần của một mô hình nhận thức theo luồng dữ liệu.', [
    'Backbone: ảnh → đặc trưng nhiều tỉ lệ C₂–C₅',
    'Neck (FPN): trộn các tỉ lệ',
    'Head: đưa ra hộp, mặt nạ hoặc keypoint',
  ], 'Backbone thường khởi tạo từ tiền huấn luyện; neck và head thường khởi tạo ngẫu nhiên.'),

  q.single('36', 1, 'Câu hỏi đúng khi chọn backbone cho sản phẩm là gì?',
    'Mạng nào đủ tốt trong độ trễ đo được trên thiết bị đích',
    ['Mạng nào đứng đầu bảng ImageNet', 'Mạng nào có ít FLOPs nhất', 'Mạng nào mới công bố gần nhất'],
    'Chọn backbone quyết định cùng lúc chất lượng đặc trưng, ngân sách tính toán và tiền huấn luyện sẵn có. Độ trễ phải đo trên đúng thiết bị và runtime đích.'),

  q.order('37', 3, 'Sắp xếp các mốc backbone theo thời gian.', [
    'LeNet: tích chập đầu tiên',
    'AlexNet: ReLU, GPU',
    'ResNet: residual',
    'ViT: mảnh ảnh làm token',
    'ConvNeXt: ResNet hiện đại hoá',
    'DINOv3: mô hình nền tảng 7 tỉ tham số',
  ], 'LeNet (1998), AlexNet (2012), ResNet (2015), ViT (2020), ConvNeXt (2022), DINOv3 (2025). Hai dòng tích chập và transformer học lẫn nhau từ 2022.'),

  q.single('38', 2, 'Tích chập tách theo chiều sâu (MobileNet) giảm tham số bằng cách nào?',
    'Một bộ lọc k × k riêng cho mỗi kênh, rồi tích chập 1 × 1 để trộn kênh',
    ['Bỏ bias và chỉ giữ trọng số', 'Dùng bộ lọc 1 × 1 thay cho mọi bộ lọc 3 × 3', 'Chia sẻ một bộ lọc cho mọi kênh và mọi lớp'],
    'Với D_K = 3, M = 128, N = 256: 33 920 so với 294 912 tham số của tích chập chuẩn, tỉ lệ 0,115.'),

  q.single('39', 2, 'EfficientNet co giãn kép theo quy tắc nào?',
    'Tăng đồng thời độ sâu, độ rộng và độ phân giải theo α^φ, β^φ, γ^φ với α·β²·γ² ≈ 2',
    ['Chỉ tăng độ sâu, giữ nguyên độ rộng và độ phân giải', 'Tăng độ phân giải gấp đôi mỗi khi thêm một lớp', 'Giảm độ rộng khi tăng độ sâu để giữ FLOPs cố định'],
    'B0 tìm bằng NAS với α = 1,2, β = 1,1, γ = 1,15. Mỗi lần φ tăng thêm 1, FLOPs gần như nhân đôi.'),

  q.single('40', 2, 'RepVGG tận dụng ý tưởng gì để nhanh khi suy luận?',
    'Nhiều nhánh (3 × 3, 1 × 1, đồng nhất) khi huấn luyện, gộp thành một tích chập 3 × 3 khi suy luận',
    ['Dùng attention thay tích chập khi suy luận', 'Lượng tử hoá INT4 ngay khi huấn luyện', 'Bỏ hết kết nối tắt để giảm bộ nhớ'],
    'Tích chập dày một nhánh hợp với GPU: RepVGG-A0 (1,4 GMAC) nhanh hơn EfficientNet-B0 (0,39 GMAC) khoảng 2,3 lần.'),

  q.single('41', 2, 'ConvNeXt cho thấy điều gì về khoảng cách giữa CNN và transformer?',
    'Một phần khoảng cách là do công thức huấn luyện: chỉ huấn luyện lại ResNet-50 bằng công thức mới đã từ 76,1 lên 78,8',
    ['CNN không bao giờ bắt kịp transformer trên ImageNet', 'Transformer thắng chỉ vì có nhiều tham số hơn', 'Attention là thành phần duy nhất tạo ra khác biệt'],
    'Sau đó đổi kiến trúc từng bước (stem 4×4, tích chập tách kênh 7×7, GELU, LayerNorm…) ConvNeXt-T đạt 82,1%, ngang Swin-T trên phát hiện COCO.'),

  q.single('42', 2, 'Swin Transformer đạt chi phí tuyến tính theo số mảnh nhờ đâu?',
    'Attention trong cửa sổ M × M (M = 7), dịch cửa sổ giữa hai lớp liên tiếp',
    ['Bỏ softmax khỏi attention', 'Chỉ cho token [CLS] attend vào các mảnh', 'Giảm số đầu attention xuống 1'],
    'Ω(W-MSA) = 4hwC² + 2M²hwC, tuyến tính theo hw. Swin có 4 tỉ lệ đặc trưng nên dùng được với FPN hoặc U-Net.'),

  q.single('43', 2, 'DINOv2 hữu ích nhất trong hoàn cảnh nào?',
    'Ít nhãn (dưới khoảng 5 000): dùng đặc trưng đóng băng và thêm một đầu nhỏ',
    ['Khi có hơn một triệu nhãn và cần huấn luyện từ đầu', 'Khi cần chạy phát hiện dưới 5 ms trên thiết bị biên', 'Khi dữ liệu là chuỗi IMU'],
    'DINOv2 tự giám sát cho đặc trưng đóng băng mạnh: linear probe 81,1 (S), 84,5 (B). Giấy phép Apache-2.0; DINOv3 có giấy phép riêng, cần kiểm tra trước khi dùng thương mại.'),

  q.match('44', 2, 'Ghép mục tiêu tiền huấn luyện với phương pháp.', [
    ['Phân biệt: khớp hai góc nhìn của cùng ảnh', 'SimCLR, MoCo, DINO'],
    ['Sinh: tái tạo phần bị che', 'MAE (che 75% mảnh)'],
    ['Chuỗi dài với chi phí tuyến tính', 'Mamba (mô hình không gian trạng thái)'],
  ], 'MAE ViT-B tinh chỉnh đạt 83,6 so với 82,3 khi học từ đầu. Mamba là đối thủ của attention trên chuỗi dài.'),

  q.single('45', 1, 'EfficientNet-B0 có ít GMAC hơn ResNet-50 khoảng 10 lần. Thông lượng trên RTX 4090 thì sao?',
    'Chỉ nhanh hơn khoảng 2 lần: FLOPs không phải độ trễ',
    ['Nhanh hơn đúng 10 lần', 'Chậm hơn ResNet-50', 'Nhanh hơn khoảng 100 lần'],
    'Độ trễ phụ thuộc băng thông bộ nhớ và kiểu phép tính hợp phần cứng. DenseNet-121 chậm so với 2,8 GMAC vì ghép nối tốn băng thông. Chọn theo độ trễ đo trên thiết bị và runtime đích.'),

  q.match('46', 2, 'Ghép hoàn cảnh với backbone gợi ý.', [
    ['Dưới 5 000 nhãn, ảnh gần ảnh tự nhiên', 'DINOv2 ViT-S/B đóng băng + đầu nhỏ'],
    ['Phát hiện thời gian thực dưới 5 ms', 'YOLO cỡ nhỏ, TensorRT FP16'],
    ['Ít demo robot, huấn luyện từ đầu', 'ResNet-18 với GroupNorm'],
    ['Hơn 10⁶ nhãn, chạy trên máy chủ', 'ConvNeXt, Swin, ViT tiền huấn luyện 22k'],
  ], 'Bảng tổng hợp của nhóm biên soạn; số Jetson do nhà cung cấp hoặc tác giả báo cáo, nên đo lại trên thiết bị của bạn.'),

  q.single('47', 1, 'Cùng một ResNet-50, top-1 ImageNet đi từ 76,1 lên 80,9 nhờ gì?',
    'Chỉ nhờ công thức huấn luyện (torchvision V1 → V2), không đổi kiến trúc',
    ['Thêm attention vào mỗi khối', 'Tăng độ sâu lên 101 lớp', 'Dùng ảnh độ phân giải 512'],
    'Lịch cosine, label smoothing, EMA, mixup, CutMix, RandAugment, huấn luyện dài hơn… mỗi bước tăng một chút. Luôn ghi công thức huấn luyện bên cạnh mọi con số top-1.'),

  q.tf('48', 1, 'Lật ngang ảnh luôn là phép tăng cường an toàn cho mọi bài toán thị giác.', false,
    'Sai. Mỗi phép tăng cường khẳng định một bất biến. Lật ngang không hợp lệ khi nhãn mang hướng: làn trái/phải, biển báo có chữ đổi nghĩa.'),

  q.single('49', 2, 'Mixup và CutMix trộn nhãn thế nào?',
    'Nhãn trộn theo cùng tỉ lệ λ với ảnh; với CutMix λ là tỉ lệ diện tích vùng dán',
    ['Giữ nguyên nhãn của ảnh thứ nhất', 'Lấy nhãn của ảnh chiếm diện tích lớn hơn', 'Gán nhãn "nền" cho mọi ảnh trộn'],
    'Mixup: x̃ = λx_i + (1 − λ)x_j, ỹ tương tự. λ ~ Beta(α, α). Mạng học dự đoán xác suất thay vì nhớ từng mẫu.'),

  q.tf('50', 2, 'Mixup giúp phân loại nên cũng luôn giúp khi chuyển sang bài toán phát hiện.', false,
    'Sai. Mixup hạ 1,7 mAP khi chuyển sang phát hiện Pascal VOC, trong khi CutMix tăng 1,1. Phải kiểm chứng tăng cường trên chỉ số hạ nguồn của chính tác vụ.'),

  q.match('51', 3, 'Ghép kỹ thuật tăng cường với cách làm.', [
    ['RandAugment', 'Hai tham số: số phép N và cường độ M, không tìm kiếm'],
    ['TrivialAugment', 'Không tham số: một phép ngẫu nhiên, cường độ ngẫu nhiên'],
    ['Mosaic', 'Ghép 4 ảnh thành một'],
    ['Copy-Paste', 'Dán thực thể từ ảnh nguồn lên ảnh đích'],
  ], 'Xu hướng là bỏ tìm kiếm tốn kém (AutoAugment ~15 000 chính sách). Copy-Paste cho +10 AP khi chỉ có 10% COCO.'),

  q.match('52', 1, 'Học chuyển giao: ghép lượng và độ giống của dữ liệu đích với cách làm.', [
    ['Ít dữ liệu, giống dữ liệu tiền huấn luyện', 'Đóng băng backbone, chỉ huấn luyện bộ phân loại tuyến tính'],
    ['Nhiều dữ liệu, giống', 'Tinh chỉnh toàn bộ các lớp'],
    ['Ít dữ liệu, khác', 'Bộ phân loại tuyến tính trên đặc trưng ở tầng sớm hơn'],
    ['Nhiều dữ liệu, khác', 'Vẫn khởi tạo từ tiền huấn luyện và tinh chỉnh toàn bộ'],
  ], 'Đặc trưng tầng sớm (cạnh, vân) tổng quát hơn đặc trưng tầng sâu, nên hợp hơn khi miền dữ liệu khác xa.'),

  q.single('53', 1, 'Khi tinh chỉnh, vì sao đặt tốc độ học của backbone thấp hơn đầu mới (ví dụ 10 lần)?',
    'Để gradient của đầu khởi tạo ngẫu nhiên không phá trọng số tiền huấn luyện tốt',
    ['Vì backbone có ít tham số hơn đầu mới', 'Vì đầu mới không có gradient ở các bước đầu', 'Để backbone quá khớp nhanh hơn'],
    'Có thể giảm dần theo tầng: η_l = η_cơ_sở·decay^(L−l); công thức MAE cho ViT-B dùng 0,75. Không đặt weight decay cho tham số chuẩn hoá và bias.'),

  q.single('54', 2, 'Nghiên cứu "Rethinking ImageNet Pre-training" kết luận gì?',
    'Tiền huấn luyện tăng tốc hội tụ sớm nhưng không nhất thiết cải thiện độ chính xác cuối; học từ đầu hỏng khi chỉ ~1 000 ảnh',
    ['Tiền huấn luyện luôn tăng độ chính xác cuối ít nhất 5 AP', 'Học từ đầu luôn tốt hơn tiền huấn luyện', 'Tiền huấn luyện chỉ có ích với ViT'],
    'Học từ đầu đủ lâu khớp bản tiền huấn luyện kể cả với ~10 nghìn ảnh COCO (26,0 so với 25,9 AP). Diffusion Policy: ResNet-18 từ đầu 0,94, đóng băng chỉ 0,58.'),

  q.single('55', 2, 'Làm mịn nhãn (label smoothing) với ε = 0,1 đổi nhãn one-hot thành gì?',
    'q′(k) = (1 − ε)·δ_{k,y} + ε/K: lớp đúng giảm bớt, các lớp khác nhận phần nhỏ đều nhau',
    ['Nhãn lớp đúng tăng lên 1 + ε', 'Nhãn bị đổi ngẫu nhiên sang lớp khác với xác suất ε', 'Chỉ giữ lại K − 1 lớp sai'],
    'Giúp mô hình bớt quá tự tin; trong chuỗi torchvision đóng góp +0,32 top-1.'),

  q.single('56', 2, 'EMA trọng số W_ema ← d·W_ema + (1 − d)·W tốn gì khi suy luận?',
    'Không tốn gì thêm: vẫn một mạng, một lượt chạy',
    ['Gấp đôi thời gian suy luận vì chạy hai mạng', 'Cần lưu toàn bộ lịch sử trọng số', 'Phải chạy TTA để có lợi'],
    'd = 0,999 là giá trị ví dụ; EMA cho khoảng +0,25 top-1. Cần update_bn hoặc BatchNorm động lượng để thống kê khớp với trọng số trung bình.'),

  q.single('57', 2, 'RetinaNet khởi tạo bias lớp phân loại cuối theo tiên nghiệm π = 0,01 để làm gì?',
    'Để đầu ra ban đầu dự đoán gần như toàn nền, tránh mất mát nền khổng lồ làm mất ổn định lúc đầu',
    ['Để mọi lớp có xác suất bằng nhau 1/C', 'Để tăng gradient của mẫu dễ', 'Để tắt focal loss ở các bước đầu'],
    'Bộ phát hiện một giai đoạn có ~100 nghìn vị trí ứng viên mỗi ảnh, gần như toàn nền. RetinaNet (γ = 2, α = 0,25) từ 31,1 lên 34,0 AP so với CE cân bằng α tốt nhất.'),

  q.single('58', 2, 'Trong chưng cất tri thức, vì sao nhân hạng tử KL mềm với T²?',
    'Gradient của hạng tử mềm co theo 1/T², nhân T² để cân bằng với hạng tử nhãn cứng',
    ['Để làm đầu ra giáo viên cứng hơn', 'Để học sinh chạy với nhiệt độ T khi suy luận', 'Vì KL luôn âm khi T > 1'],
    'Nhiệt độ T > 1 làm đầu ra giáo viên mềm hơn, lộ ra lớp nào giống lớp nào. Sau huấn luyện học sinh chạy với T = 1. DeiT-B chưng cất: 81,8 → 83,4.'),

  q.single('59', 2, 'ResNet-50 có độ lệch chuẩn khoảng 0,10 điểm top-1 qua 100 hạt giống. Chênh lệch bao nhiêu nên coi là nhiễu?',
    'Dưới khoảng 0,3 điểm',
    ['Dưới 3 điểm', 'Dưới 0,01 điểm', 'Mọi chênh lệch đều có ý nghĩa'],
    'Luôn báo cáo trung bình và độ lệch chuẩn qua nhiều hạt giống. Thứ tự gỡ lỗi: nhìn dữ liệu, mất mát ban đầu, quá khớp một lô, rồi mới chính quy hoá.'),

  q.match('60', 1, 'Ghép kỹ thuật suy luận với nơi nên dùng.', [
    ['Vòng điều khiển trên robot (10–30 Hz)', 'Một lượt chạy, gộp BatchNorm, FP16/INT8, TensorRT, EMA'],
    ['Gán nhãn tự động ngoại tuyến', 'TTA lật + đa tỉ lệ, ensemble, WBF'],
    ['Thích ứng miền mới', 'Chuẩn hoá lại thống kê BatchNorm; Tent trên tham số chuẩn hoá'],
  ], 'TTA và ensemble thuộc ngoại tuyến. Trên robot dùng thứ không tốn thêm: EMA, soup, chưng cất, gộp BatchNorm.'),

  q.single('61', 1, 'Vì sao TTA không phù hợp cho vòng điều khiển robot?',
    'Chi phí gần tuyến tính theo số góc nhìn K mà mức tăng chỉ nhỏ đến trung bình, và có thể đổi nhãn đúng thành sai',
    ['TTA làm giảm độ chính xác trên mọi tập dữ liệu', 'TTA chỉ chạy được trên CPU', 'TTA yêu cầu nhãn của ảnh kiểm tra'],
    'YOLOv5x với TTA: mAP 0,504 → 0,516 nhưng 22,4 → 80,6 ms/ảnh (3,6 lần). CenterPoint 10 góc quay ~710 ms, vượt xa chu kỳ LiDAR 20 Hz.'),

  q.single('62', 2, 'WBF khác NMS và Soft-NMS ở điểm nào?',
    'WBF tạo hộp mới bằng trung bình có trọng số độ tin cậy của cả cụm, thay vì chọn một hộp có sẵn',
    ['WBF xoá mọi hộp có IoU > 0,55 với hộp cao điểm nhất', 'WBF chỉ giảm điểm hộp trùng mà không xoá', 'WBF chỉ dùng được với một mô hình duy nhất'],
    'WBF cần nhiều góc nhìn hoặc nhiều mô hình mới có lợi: với lật ngang chỉ hơn NMS 0,29 điểm mAP, với ensemble B6 + B7 hơn rõ hơn. Soft-NMS giảm điểm bằng exp(−IoU²/σ).'),

  q.single('63', 2, 'Tổ hợp mô hình (model soup) có điều kiện gì?',
    'Các mô hình phải tinh chỉnh từ cùng một khởi tạo; chi phí suy luận vẫn 1×',
    ['Các mô hình phải khác kiến trúc', 'Phải chạy song song mọi mô hình khi suy luận', 'Chỉ dùng được với mạng không có BatchNorm'],
    'Trung bình trọng số không tốn thêm ở suy luận nên hợp robot hơn ensemble dự đoán (M = 5 tốn 5×).'),

  q.single('64', 3, 'ResNet-50 huấn luyện ở 224 đạt top-1 cao nhất khi kiểm tra ở độ phân giải nào (theo FixRes)?',
    '288, vì cắt ngẫu nhiên lúc huấn luyện làm vật to hơn lúc kiểm tra',
    ['224, đúng bằng lúc huấn luyện', '160, vì ảnh nhỏ ít nhiễu hơn', '512, vì càng lớn càng tốt'],
    '78,4 khi kiểm tra ở 288 so với 77,0 ở 224; tỉ lệ biểu kiến ≈ 1,15. Cỡ ảnh kiểm tra là siêu tham số cần dò trên tập kiểm định.'),

  q.single('65', 1, 'Co giãn nhiệt độ (temperature scaling) ảnh hưởng thế nào đến độ chính xác?',
    'Không đổi độ chính xác vì thứ tự lớp giữ nguyên; chỉ làm độ tin cậy khớp thực tế hơn (giảm ECE)',
    ['Tăng độ chính xác nhờ làm mịn đầu ra', 'Giảm độ chính xác để đổi lấy độ tin cậy', 'Đổi lớp dự đoán của các mẫu khó'],
    'ResNet-152: ECE 5,48% → 1,86%. Nhưng T khớp trên dữ liệu i.i.d. mất hiệu lực khi phân phối dịch chuyển; ensemble là cách tốt nhất trong thử nghiệm của Ovadia.'),

  q.single('66', 2, 'Tent thích ứng lúc kiểm tra bằng cách nào?',
    'Cực tiểu hoá entropy dự đoán trên từng lô, chỉ cập nhật γ, β của chuẩn hoá (dưới 1% tham số)',
    ['Huấn luyện lại toàn bộ mạng trên nhãn của tập kiểm tra', 'Chạy TTA rồi lấy trung bình', 'Tăng nhiệt độ softmax cho từng mẫu'],
    'ImageNet-C: Tent 44,0% lỗi so với 49,9% chỉ chuẩn hoá lại thống kê. Cần theo lô, và thất bại ở một số dịch chuyển (MNIST → SVHN).'),

  q.tf('67', 2, 'Gộp BatchNorm vào tích chập làm thay đổi kết quả suy luận đáng kể.', false,
    'Sai. w_gộp = γw/√(σ² + ε), b_gộp = β + γ(b − µ)/√(σ² + ε) là chính xác lúc suy luận (sai số số học ≈ 10⁻⁶): bớt một lớp mà không đổi kết quả.'),

  q.single('68', 2, 'Với EfficientNet-b0, lượng tử hoá INT8 kiểu PTQ và QAT cho kết quả thế nào?',
    'PTQ 72,06 so với QAT 76,95 (FP32 76,85): mạng nhạy cần huấn luyện có mô phỏng lượng tử hoá',
    ['PTQ và QAT như nhau, đều mất dưới 0,1 điểm', 'QAT tệ hơn PTQ vì huấn luyện lại gây quá khớp', 'Cả hai đều rơi xuống dưới 30%'],
    'PTQ chỉ hiệu chỉnh không huấn luyện; với hiệu chỉnh cực đại đơn giản EfficientNet-b0 còn rơi xuống 22,3%. ResNet-50 thì PTQ gần như không mất (76,05).'),

  q.single('69', 3, 'YOLO26n trên Jetson Orin Nano Super: PyTorch 15,60 ms, TensorRT FP16 4,57 ms. INT8 đổi lại gì?',
    '3,80 ms nhưng mAP giảm 3,1 điểm (0,480 → 0,449)',
    ['1,2 ms và mAP tăng nhẹ', '4,57 ms, không nhanh hơn FP16', '3,80 ms và mAP không đổi'],
    'FP16 nhanh 3,4 lần so với PyTorch. INT8 nhanh thêm chút nhưng mất độ chính xác: luôn đo lại mAP sau lượng tử hoá.'),

  q.multi('70', 1, 'Đo độ trễ cho đúng cần những gì? (chọn nhiều)',
    ['Chạy khởi động (warmup) trước khi đo', 'Đồng bộ GPU (torch.cuda.synchronize hoặc CUDA event)', 'Báo cáo phân vị p50, p95, p99', 'Đo trên thiết bị đích, gồm cả tiền và hậu xử lý'],
    ['Dùng time.time() quanh lời gọi mô hình trên GPU là đủ', 'Chỉ báo cáo trung bình của lô lớn nhất'],
    'GPU chạy bất đồng bộ; lần chạy đầu tải thư viện (cuBLAS 2 775 µs lần đầu, 22 µs lần hai). Ở lô 1, AMP có thể chậm hơn FP32.'),
]
