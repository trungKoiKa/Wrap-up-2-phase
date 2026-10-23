// Nội dung bài học Phase 2 (Day 16–27), viết cho người mới. Sinh từ bản sổ ôn; công thức là LaTeX.
import type { Lesson } from './types'

export const DAYS: Lesson[] = [
  {
    "id": "day16",
    "part": 16,
    "n": 16,
    "title": "Mạng nơ-ron & huấn luyện",
    "question": "Một mạng nơ-ron \"học\" như thế nào, và khi nó không chịu học thì sửa ở đâu?",
    "analogy": "Hình dung bạn tập ném bóng vào rổ khi bị bịt mắt. Mỗi lần ném (truyền xuôi), bạn được báo ném lệch bao xa (hàm mất mát). Bạn suy ra nên chỉnh tay thế nào (truyền ngược), rồi chỉnh một chút (cập nhật). Lặp lại hàng nghìn lần thì ném chuẩn dần. Huấn luyện mạng nơ-ron chính là vòng lặp đó.",
    "why": "Mọi mô hình ở các buổi sau (detector, tracker, VLM) đều được huấn luyện bằng đúng vòng lặp này. Khi một mô hình 3D \"không hội tụ\", lỗi thường nằm ở vòng lặp huấn luyện chứ không ở phần 3D.",
    "steps": [
      "Mô hình là một hàm có tham số: đưa ảnh vào, ra dự đoán.",
      "Hàm mất mát đo dự đoán sai bao nhiêu so với đáp án.",
      "Đạo hàm cho biết chỉnh mỗi tham số thì mất mát đổi ra sao.",
      "Lan truyền ngược tính đạo hàm cho mọi tham số cùng lúc.",
      "Bộ tối ưu dùng đạo hàm để chỉnh tham số, lặp lại tới khi tốt."
    ],
    "concepts": [
      {
        "t": "Nơ-ron nhân tạo",
        "en": "neuron",
        "d": "Một phép tính nhỏ: nhân mỗi đầu vào với một \"trọng số\" (độ quan trọng), cộng lại, cộng thêm hệ số tự do, rồi đưa qua một hàm \"bẻ cong\" gọi là hàm kích hoạt.",
        "ex": "x = (0,35; 0,7), w = (0,2; 0,2): tổng = 0,21, qua sigmoid được 0,5523."
      },
      {
        "t": "Hàm kích hoạt",
        "en": "activation function",
        "d": "Hàm phi tuyến đặt giữa các lớp. Không có nó, xếp chồng bao nhiêu lớp cũng chỉ bằng một phép nhân ma trận, mạng sâu trở nên vô nghĩa.",
        "ex": "ReLU = max(0, z) giữ số dương, chặn số âm; sigmoid ép giá trị vào (0, 1)."
      },
      {
        "t": "Hàm mất mát",
        "en": "loss function",
        "d": "Con số đo mô hình sai bao nhiêu. Mỗi loại bài toán có hàm riêng: dự đoán số thực dùng sai số bình phương, phân loại dùng cross-entropy.",
        "ex": "Dự đoán 0,6651 trong khi đáp án 0,5: mất mát ½(0,1651)² = 0,0136."
      },
      {
        "t": "Gradient",
        "en": "gradient",
        "d": "Danh sách đạo hàm của mất mát theo từng tham số. Nó chỉ hướng làm mất mát TĂNG nhanh nhất, nên ta đi ngược lại để giảm.",
        "ex": "Gradient âm ở một trọng số nghĩa là tăng trọng số đó sẽ làm mất mát giảm."
      },
      {
        "t": "Lan truyền ngược",
        "en": "backpropagation",
        "d": "Cách tính gradient cho hàng triệu tham số chỉ bằng một lượt đi ngược từ đầu ra về đầu vào, dùng quy tắc chuỗi và tái sử dụng các phần đã tính.",
        "ex": "Mạng 6 trọng số: thử từng cái tốn 12 lượt chạy; lan truyền ngược chỉ cần 1 lượt xuôi + 1 lượt ngược."
      },
      {
        "t": "Gradient biến mất",
        "en": "vanishing gradient",
        "d": "Mỗi lớp sigmoid nhân gradient với một số ≤ 0,25. Qua nhiều lớp, gradient về tới lớp đầu gần bằng 0 nên lớp đầu gần như không học.",
        "ex": "Sau 10 lớp: 0,25¹⁰ ≈ 10⁻⁶. Chữa bằng ReLU, khởi tạo đúng, chuẩn hoá, kết nối tắt."
      },
      {
        "t": "Tốc độ học",
        "en": "learning rate η",
        "d": "Độ dài mỗi bước chỉnh tham số. Quá nhỏ thì học rất chậm, quá lớn thì nhảy lung tung và phân kỳ.",
        "ex": "Với f(x) = x²: η = 0,05 hội tụ chậm, η = 0,45 nhanh, η = 1,05 phân kỳ."
      },
      {
        "t": "Adam / AdamW",
        "en": "optimizer",
        "d": "Bộ tối ưu tự cho mỗi tham số một bước riêng: tham số có gradient luôn lớn đi bước nhỏ, và ngược lại. AdamW tách phần \"phạt trọng số lớn\" ra riêng nên ổn định hơn.",
        "ex": "Điểm bắt đầu hay dùng: AdamW với η = 3·10⁻⁴."
      },
      {
        "t": "Quá khớp / chưa khớp",
        "en": "overfitting / underfitting",
        "d": "Quá khớp: thuộc lòng dữ liệu huấn luyện nhưng làm kém trên dữ liệu mới. Chưa khớp: mô hình quá đơn giản, sai cả trên dữ liệu huấn luyện.",
        "ex": "Mất mát train về gần 0 mà validation tăng lại = quá khớp."
      }
    ],
    "formulas": [
      {
        "tex": "w \\leftarrow w - \\eta\\,\\dfrac{\\partial J}{\\partial w}",
        "read": "Trọng số mới = trọng số cũ trừ (tốc độ học × đạo hàm của mất mát theo trọng số đó).",
        "ex": "Đây là toàn bộ \"học\": đi ngược hướng dốc một bước dài η."
      },
      {
        "tex": "a = \\sigma\\!\\left(\\sum_i w_i x_i + b\\right)",
        "read": "Đầu ra nơ-ron = hàm kích hoạt của (tổng có trọng số các đầu vào + hệ số tự do).",
        "ex": "0,2·0,35 + 0,2·0,7 = 0,21 → σ(0,21) = 0,5523."
      },
      {
        "tex": "\\#\\theta_{\\text{layer}} = n_{\\text{out}}\\,(n_{\\text{in}} + 1)",
        "read": "Số tham số một lớp = số nơ-ron ra × (số đầu vào + 1 cho bias).",
        "ex": "784 → 128 → 10: 128·785 + 10·129 = 101 770."
      },
      {
        "tex": "\\sigma'(z) = \\sigma(z)\\bigl(1-\\sigma(z)\\bigr) \\le \\tfrac{1}{4}",
        "read": "Độ dốc của sigmoid không bao giờ vượt 0,25.",
        "ex": "Lý do mạng sigmoid sâu bị gradient biến mất."
      },
      {
        "tex": "\\dfrac{\\partial \\ell}{\\partial z_k} = p_k - y_k",
        "read": "Với softmax + cross-entropy, gradient = xác suất dự đoán trừ nhãn đúng (1 ở lớp đúng, 0 ở lớp khác).",
        "ex": "p = (0,659; 0,242; 0,099), nhãn lớp 1 → (−0,341; 0,242; 0,099): lớp đúng được đẩy lên."
      },
      {
        "tex": "\\mathrm{FL}(p_t) = -(1-p_t)^{\\gamma}\\log p_t",
        "read": "Focal loss: cross-entropy nhân thêm hệ số làm nhỏ mất mát của mẫu đã dễ (p_t gần 1).",
        "ex": "γ = 2, p_t = 0,9: mất mát giảm 100 lần. Dùng khi nền chiếm áp đảo."
      },
      {
        "tex": "\\ell_0 = -\\log\\tfrac{1}{C} = \\ln C",
        "read": "Lúc chưa học gì, mô hình đoán đều mọi lớp nên mất mát ban đầu bằng ln(số lớp).",
        "ex": "10 lớp → 2,30. Lệch xa con số này là có lỗi khởi tạo, nhãn hoặc code."
      },
      {
        "tex": "\\operatorname{Var}[W] = \\dfrac{2}{n_{\\text{in}}}",
        "read": "Khởi tạo He: phương sai trọng số ban đầu = 2 chia số đầu vào.",
        "ex": "ReLU cắt mất nửa tín hiệu nên nhân đôi để bù."
      }
    ],
    "table": {
      "title": "Chẩn đoán qua đường cong mất mát",
      "cols": [
        "Bạn thấy",
        "Thường do",
        "Thử trước"
      ],
      "rows": [
        [
          "Mất mát đứng yên quanh ln C",
          "Tốc độ học quá thấp, nhãn sai, gradient không chảy",
          "Cho mô hình học thuộc một lô nhỏ"
        ],
        [
          "Dao động rồi thành NaN",
          "Tốc độ học quá cao, log 0, tràn số FP16",
          "Giảm η 3–10 lần, cắt gradient"
        ],
        [
          "Train giảm về 0, validation tăng",
          "Quá khớp",
          "Thêm dữ liệu, weight decay, dropout, dừng sớm"
        ],
        [
          "Cả hai cùng cao",
          "Chưa khớp",
          "Mô hình lớn hơn, huấn luyện lâu hơn"
        ]
      ]
    },
    "traps": [
      "Gradient chỉ hướng mất mát TĂNG; muốn giảm thì đi theo −gradient.",
      "Cắt gradient (clipping) chỉ chữa gradient bùng nổ, không chữa gradient biến mất.",
      "Phân loại dùng cross-entropy, không dùng sai số bình phương trên sigmoid (gradient bị bão hoà).",
      "Bộ tối ưu không cần tìm cực tiểu toàn cục; cần cực tiểu làm tốt trên dữ liệu mới.",
      "PyTorch MSELoss không có hệ số ½ như công thức trong bài."
    ],
    "remember": [
      "Huấn luyện = truyền xuôi → mất mát → truyền ngược → cập nhật, lặp lại.",
      "Chọn hàm mất mát theo loại nhãn: số thực → bình phương; lớp → cross-entropy.",
      "Trước khi train lâu: kiểm tra mất mát bước 0 ≈ ln C và học thuộc được một lô nhỏ."
    ],
    "cards": [
      [
        "Vì sao cần hàm kích hoạt phi tuyến?",
        "Không có nó, nhiều lớp tuyến tính gộp lại vẫn chỉ là một phép tuyến tính."
      ],
      [
        "Mất mát ở bước 0 của bộ phân loại 10 lớp?",
        "ln 10 ≈ 2,30."
      ],
      [
        "Mô hình không học thuộc nổi 10 mẫu. Lỗi ở đâu?",
        "Gần như chắc là lỗi code: nhãn lệch đầu vào, mất mát sai, tham số không cập nhật."
      ],
      [
        "Tăng lô (batch) lên 4 lần thì nhiễu gradient?",
        "Giảm một nửa, vì nhiễu tỉ lệ 1/√B."
      ],
      [
        "Focal loss sinh ra để làm gì?",
        "Giảm ảnh hưởng của hàng chục nghìn mẫu nền dễ trong bài toán phát hiện."
      ],
      [
        "AdamW khác Adam(weight_decay) ở đâu?",
        "AdamW trừ phần phạt trọng số riêng, không bị chia cho √v̂ như Adam."
      ]
    ]
  },
  {
    "id": "day17",
    "part": 17,
    "n": 17,
    "title": "Kiến trúc thị giác",
    "question": "Với ảnh, chuỗi thời gian hay tập đối tượng, nên dùng kiến trúc mạng nào, và chạy nó nhanh trên robot thế nào?",
    "analogy": "Mỗi kiến trúc là một \"kính lúp\" khác nhau. Tích chập nhìn từng mảnh nhỏ và trượt khắp ảnh như soi kính lúp. Mạng hồi quy đọc lần lượt như đọc sách, nhớ tóm tắt những trang trước. Attention cho mọi phần tử \"hỏi thẳng\" mọi phần tử khác như một cuộc họp ai cũng nói được với ai.",
    "why": "Backbone (phần rút đặc trưng) là nền của mọi detector, tracker, BEV ở các buổi sau. Chọn sai kiến trúc thì cần nhiều dữ liệu hơn, chạy chậm hơn, hoặc không chạy kịp trên robot.",
    "steps": [
      "Ảnh có tính cục bộ và lặp lại: dùng tích chập.",
      "Mạng sâu khó huấn luyện: thêm kết nối tắt (residual).",
      "Chuỗi theo thời gian: RNN, LSTM, GRU giữ trạng thái.",
      "Muốn mọi phần tử nhìn nhau: attention và Transformer.",
      "Chọn backbone theo độ trễ thật, huấn luyện bằng công thức tốt, suy luận gọn trên robot."
    ],
    "concepts": [
      {
        "t": "Tích chập",
        "en": "convolution",
        "d": "Một bộ lọc nhỏ (ví dụ 3×3) trượt khắp ảnh, ở mỗi vị trí nhân rồi cộng. Cùng một bộ lọc dùng cho mọi vị trí nên rất ít tham số.",
        "ex": "Bộ lọc [1, 0, −1] theo cột phát hiện cạnh dọc với chỉ 9 tham số."
      },
      {
        "t": "Trường tiếp nhận",
        "en": "receptive field",
        "d": "Vùng ảnh gốc mà một điểm đặc trưng \"nhìn thấy\". Xếp chồng nhiều lớp thì vùng này to dần.",
        "ex": "Ba lớp 3×3 bước 1 nhìn được vùng 7×7."
      },
      {
        "t": "Kết nối tắt (residual)",
        "en": "residual connection",
        "d": "Cộng thẳng đầu vào vào đầu ra của khối, để khối chỉ phải học phần chênh lệch. Giúp huấn luyện mạng rất sâu.",
        "ex": "ResNet-34 có lỗi 25,03% so với 28,54% của mạng thường cùng độ sâu."
      },
      {
        "t": "Chuẩn hoá",
        "en": "BatchNorm / LayerNorm / GroupNorm",
        "d": "Đưa đặc trưng về trung bình 0, độ lệch 1 để huấn luyện ổn định. BatchNorm tính theo lô, LayerNorm theo từng mẫu, GroupNorm theo nhóm kênh khi lô nhỏ.",
        "ex": "Quên chuyển model.eval() là lỗi hay gặp với BatchNorm."
      },
      {
        "t": "LSTM / GRU",
        "en": "gated RNN",
        "d": "Mạng hồi quy có \"cổng\" quyết định giữ, ghi, xuất bao nhiêu thông tin. Thông tin đi theo đường cộng nên nhớ lâu hơn RNN thường.",
        "ex": "Sau 50 bước: RNN còn ~10⁻¹⁶ gradient, LSTM còn ~10⁻¹¹."
      },
      {
        "t": "Attention",
        "en": "attention",
        "d": "Mỗi phần tử đặt một câu hỏi (query), so với \"nhãn\" (key) của mọi phần tử khác, rồi lấy trung bình nội dung (value) theo mức khớp.",
        "ex": "Chi phí tăng theo bình phương số token: 196 token cho 3,8·10⁴ cặp mỗi đầu."
      },
      {
        "t": "Vision Transformer (ViT)",
        "en": "ViT",
        "d": "Cắt ảnh thành các mảnh 16×16, coi mỗi mảnh như một từ rồi đưa vào Transformer. Ít giả định về ảnh nên cần rất nhiều dữ liệu tiền huấn luyện.",
        "ex": "Ảnh 224×224 → 196 mảnh + 1 token [CLS]."
      },
      {
        "t": "Backbone, neck, head",
        "en": "perception model",
        "d": "Backbone rút đặc trưng nhiều tỉ lệ, neck (như FPN) trộn các tỉ lệ, head đưa ra hộp, mặt nạ hay keypoint.",
        "ex": "ResNet-50 + FPN + đầu phát hiện."
      },
      {
        "t": "Kỹ thuật suy luận",
        "en": "TTA, ensemble, EMA, INT8",
        "d": "TTA và ensemble chạy nhiều lần cho chính xác hơn, hợp gán nhãn ngoại tuyến. Trên robot dùng thứ không tốn thêm: EMA, gộp BatchNorm, FP16/INT8, TensorRT.",
        "ex": "YOLO26n trên Jetson: PyTorch 15,6 ms → TensorRT FP16 4,57 ms."
      }
    ],
    "formulas": [
      {
        "tex": "H_{\\text{out}} = \\left\\lfloor \\dfrac{H + 2p - d(k-1) - 1}{s} \\right\\rfloor + 1",
        "read": "Kích thước đầu ra = (kích thước vào + đệm − vùng bộ lọc) chia bước trượt, làm tròn xuống, cộng 1.",
        "ex": "AlexNet: (227 − 11)/4 + 1 = 55."
      },
      {
        "tex": "\\#\\theta = C_{\\text{out}}\\,(C_{\\text{in}}\\,k^2 + 1)",
        "read": "Tham số lớp tích chập = số bộ lọc × (số kênh vào × cỡ bộ lọc² + 1). Không phụ thuộc kích thước ảnh.",
        "ex": "AlexNet lớp 1: 96·(3·121 + 1) = 34 944."
      },
      {
        "tex": "r_l = r_{l-1} + (k_l - 1)\\,j_{l-1}",
        "read": "Trường tiếp nhận mới = cũ + (cỡ bộ lọc − 1) × khoảng cách giữa hai điểm ở lớp trước.",
        "ex": "Ba lớp 3×3, lớp giữa bước 2 → 9."
      },
      {
        "tex": "\\operatorname{softmax}\\!\\left(\\dfrac{QK^{\\top}}{\\sqrt{d_k}}\\right)V",
        "read": "So câu hỏi Q với mọi khoá K, chia √d_k cho đỡ lớn, softmax thành trọng số, rồi lấy trung bình có trọng số của V.",
        "ex": "Công thức lõi của mọi Transformer."
      },
      {
        "tex": "N = \\dfrac{HW}{P^2}",
        "read": "Số token của ViT = diện tích ảnh chia diện tích một mảnh.",
        "ex": "224²/16² = 196."
      },
      {
        "tex": "\\mathcal{L} = \\alpha\\,T^2\\,\\mathrm{KL}\\!\\left(p_{\\text{teacher}}^{(T)} \\,\\middle\\|\\, p_{\\text{student}}^{(T)}\\right) + (1-\\alpha)\\,\\mathrm{CE}",
        "read": "Chưng cất: mô hình nhỏ vừa học nhãn thật, vừa bắt chước đầu ra \"mềm\" của mô hình lớn.",
        "ex": "DeiT-B chưng cất: 81,8 → 83,4 top-1."
      }
    ],
    "table": {
      "title": "Ba họ kiến trúc",
      "cols": [
        "Họ",
        "Hợp với",
        "Chi phí mỗi lớp"
      ],
      "rows": [
        [
          "Tích chập",
          "Lưới không gian: ảnh, bản đồ BEV",
          "$O(k n d^2)$"
        ],
        [
          "Hồi quy (RNN, LSTM)",
          "Chuỗi thời gian: IMU, odometry",
          "$O(n d^2)$, chạy tuần tự"
        ],
        [
          "Attention",
          "Tập không thứ tự: đối tượng, điểm LiDAR",
          "$O(n^2 d)$"
        ]
      ]
    },
    "traps": [
      "FLOPs ít không có nghĩa là nhanh: EfficientNet-B0 ít phép tính hơn ResNet-50 10 lần nhưng chỉ nhanh hơn ~2 lần.",
      "Lật ngang ảnh sai khi nhãn có hướng (làn trái/phải, biển có chữ).",
      "TTA không phải \"chính xác miễn phí\": tốn K lần tính toán và có thể biến đúng thành sai.",
      "Co giãn nhiệt độ (temperature scaling) không đổi độ chính xác, chỉ sửa độ tự tin.",
      "Mạng 56 lớp lỗi huấn luyện cao hơn 20 lớp không phải quá khớp, mà là khó tối ưu."
    ],
    "remember": [
      "Kiến trúc khớp cấu trúc dữ liệu: lưới → tích chập, chuỗi → hồi quy, tập → attention.",
      "Công thức huấn luyện quan trọng ngang kiến trúc: cùng ResNet-50 đi từ 76,1 lên 80,9.",
      "Chọn và đo mô hình theo độ trễ trên đúng thiết bị đích."
    ],
    "cards": [
      [
        "Vì sao hai lớp 3×3 tốt hơn một lớp 5×5?",
        "Cùng vùng nhìn, ít tham số hơn 28%, có thêm một hàm kích hoạt."
      ],
      [
        "Residual học gì?",
        "Phần dư F(x) = H(x) − x; đầu ra là F(x) + x."
      ],
      [
        "Vì sao ViT cần nhiều dữ liệu hơn CNN?",
        "Ít giả định về ảnh (thiên kiến quy nạp yếu) nên phải học nhiều hơn từ dữ liệu."
      ],
      [
        "Tinh chỉnh: tốc độ học backbone so với head?",
        "Thấp hơn ~10 lần để không phá trọng số đã học."
      ],
      [
        "Đo độ trễ đúng cần gì?",
        "Chạy khởi động, đồng bộ GPU, báo p50/p95/p99, đo trên thiết bị đích."
      ],
      [
        "Model soup có điều kiện gì?",
        "Các mô hình tinh chỉnh từ cùng một khởi tạo; chạy vẫn chỉ 1 lần."
      ]
    ]
  },
  {
    "id": "day18",
    "part": 18,
    "n": 18,
    "title": "2D Perception",
    "question": "Từ một tấm ảnh, làm sao biết có gì, ở đâu, chiếm những pixel nào và tư thế ra sao?",
    "analogy": "Cùng một bức ảnh đường phố, sáu người được giao sáu câu hỏi khác nhau: \"ảnh này về gì?\", \"khoanh từng vật lại\", \"tô màu từng pixel theo loại\", \"tô màu từng vật riêng\", \"tô cả đường lẫn từng xe\", \"chấm các khớp xương\". Sáu câu hỏi đó là sáu bài toán 2D.",
    "why": "Đây là tầng \"nhìn\" của robot và xe tự lái. Hộp phát hiện ở đây là đầu vào của tracking (Day 22), BEV (Day 23) và cả quy trình gán nhãn (Day 24).",
    "steps": [
      "Biết output của từng bài toán trông thế nào.",
      "Phát hiện vật thể: từ R-CNN hai giai đoạn đến YOLO một giai đoạn.",
      "Ghép dự đoán với đáp án (assignment) và dọn trùng (NMS).",
      "Đo bằng IoU, AP, mAP mà không bị con số đánh lừa.",
      "Mở rộng sang phân đoạn từng pixel và keypoint, rồi đưa vào sản phẩm."
    ],
    "concepts": [
      {
        "t": "Sáu bài toán 2D",
        "en": "classification → keypoints",
        "d": "Classification (phân loại: cả ảnh một nhãn) · object detection (phát hiện vật thể: hộp + lớp cho từng vật) · semantic segmentation (phân đoạn ngữ nghĩa: lớp cho mỗi pixel) · instance segmentation (phân đoạn thực thể: mặt nạ riêng cho từng vật) · panoptic segmentation (phân đoạn toàn cảnh: gộp cả hai) · keypoint detection / pose estimation (dò điểm khớp, ước lượng tư thế).",
        "ex": "Camera vừa đếm từng xe vừa biết vùng mặt đường → panoptic segmentation (phân đoạn toàn cảnh)."
      },
      {
        "t": "IoU",
        "en": "Intersection over Union",
        "d": "Độ chồng lấn giữa hai hộp: phần giao chia phần hợp, từ 0 đến 1. Dùng khi train, khi lọc trùng và khi chấm điểm.",
        "ex": "Hai hộp 4×4 lệch nhau 2 ô mỗi chiều: 4/28 ≈ 0,14."
      },
      {
        "t": "Detector hai giai đoạn",
        "en": "Faster R-CNN",
        "d": "Giai đoạn 1 đề xuất vùng có thể chứa vật (RPN), giai đoạn 2 phân lớp và chỉnh hộp. Chính xác nhưng nhiều bước.",
        "ex": "RPN đặt 9 anchor mỗi vị trí trên bản đồ đặc trưng."
      },
      {
        "t": "Detector một giai đoạn",
        "en": "YOLO, RetinaNet",
        "d": "Mỗi vị trí trên bản đồ đặc trưng dự đoán thẳng hộp và lớp trong một lượt chạy. Nhanh, nhưng gần như mọi dự đoán là nền.",
        "ex": "Ảnh 640 cho 8 400 dự đoán mỗi ảnh."
      },
      {
        "t": "Gán nhãn khi train",
        "en": "label assignment",
        "d": "Quy tắc quyết định dự đoán nào phải học vật nào. Cho nhiều dự đoán học một vật (one-to-many) thì học nhanh nhưng sinh trùng.",
        "ex": "DETR, YOLO26 dùng một–một (one-to-one) nên không cần NMS."
      },
      {
        "t": "NMS",
        "en": "Non-Maximum Suppression",
        "d": "Dọn hộp trùng: giữ hộp điểm cao nhất, xoá các hộp chồng lấn nhiều với nó, lặp lại.",
        "ex": "bus.jpg: 51 hộp → 5 hộp. Nhược điểm: hai người đứng sát dễ mất một."
      },
      {
        "t": "mAP",
        "en": "mean Average Precision",
        "d": "Điểm tổng hợp: lấy AP (diện tích dưới đường precision–recall) trung bình qua các lớp và 10 ngưỡng IoU từ 0,5 đến 0,95.",
        "ex": "AP50 cao mà mAP thấp: tìm được vật nhưng hộp chưa khít."
      },
      {
        "t": "Phân đoạn",
        "en": "segmentation",
        "d": "Gán nhãn cho từng pixel. Khó vì vừa cần ngữ nghĩa (lớp sâu) vừa cần độ phân giải (lớp nông). U-Net, DeepLab, Mask R-CNN là các lời giải.",
        "ex": "SAM tạo mặt nạ theo một điểm hay hộp gợi ý."
      },
      {
        "t": "Keypoint & pose",
        "en": "pose estimation",
        "d": "Tìm các điểm có tên (mắt, khuỷu tay…) theo đúng thứ tự. Top-down: tìm người trước rồi tìm khớp; bottom-up: tìm mọi khớp rồi ghép thành người.",
        "ex": "COCO dùng 17 keypoint cho cơ thể người."
      }
    ],
    "formulas": [
      {
        "tex": "\\mathrm{IoU} = \\dfrac{|A \\cap B|}{|A \\cup B|}",
        "read": "Diện tích phần giao chia diện tích phần hợp của hai hộp.",
        "ex": "Giao 4, hợp 16 + 16 − 4 = 28 → 0,14."
      },
      {
        "tex": "80^2 + 40^2 + 20^2 = 8\\,400",
        "read": "Số dự đoán của detector một giai đoạn trên ảnh 640 ở ba tầng bước 8, 16, 32.",
        "ex": "Vì quá nhiều nền nên cần focal loss."
      },
      {
        "tex": "\\text{Precision} = \\dfrac{TP}{TP + FP}, \\qquad \\text{Recall} = \\dfrac{TP}{\\#GT}",
        "read": "Precision: trong các hộp đã báo, bao nhiêu đúng. Recall: trong các vật thật, tìm được bao nhiêu.",
        "ex": "Mỗi hộp trùng mà NMS bỏ sót là một FP."
      },
      {
        "tex": "k_{\\text{eff}} = k + (k-1)(r-1)",
        "read": "Bộ lọc giãn (atrous) với tỉ lệ r nhìn rộng hơn mà không thêm tham số.",
        "ex": "k = 3, r = 4 → nhìn 9×9, vẫn 9 trọng số."
      },
      {
        "tex": "\\mathrm{PQ} = \\mathrm{SQ} \\times \\mathrm{RQ}",
        "read": "Điểm panoptic = độ khít mặt nạ × độ nhận diện đúng segment.",
        "ex": "SQ 0,8 × RQ 0,5 = 0,40: nên sửa phần nhận diện."
      },
      {
        "tex": "\\mathrm{OKS} = \\dfrac{\\sum_i \\exp\\!\\left(-\\dfrac{d_i^2}{2s^2k_i^2}\\right)\\delta(v_i>0)}{\\sum_i \\delta(v_i>0)}",
        "read": "\"IoU của keypoint\": khoảng cách lệch được chia theo cỡ người và độ khó của từng khớp.",
        "ex": "Lệch 8 px ở mắt bị phạt nặng hơn ở hông."
      }
    ],
    "table": {
      "title": "Ba cách ghi một hộp",
      "cols": [
        "Định dạng",
        "Bốn số là",
        "Dùng ở"
      ],
      "rows": [
        [
          "xyxy",
          "Góc trên-trái và góc dưới-phải, pixel",
          "torchvision, Pascal VOC"
        ],
        [
          "xywh",
          "Góc trên-trái + rộng, cao, pixel",
          "COCO JSON"
        ],
        [
          "cxcywh ∈ [0, 1]",
          "Tâm + rộng, cao, chia cho kích thước ảnh",
          "Nhãn YOLO .txt"
        ]
      ]
    },
    "traps": [
      "Nhầm định dạng hộp: mất mát vẫn giảm nhưng mAP thì không. Luôn vẽ thử vài nhãn.",
      "mAP tính ở ngưỡng tin cậy 0,001; sản phẩm chạy ở 0,25–0,5, nên báo thêm P/R ở ngưỡng thật.",
      "Ultralytics mặc định chạy YOLO26 với NMS; muốn không NMS phải đặt nms=False.",
      "Lật gương ảnh pose phải đổi trái ↔ phải (flip_idx).",
      "Tập kiểm định không có ảnh ban đêm thì không đo được lỗi ban đêm."
    ],
    "remember": [
      "Output 2D là tập có số lượng thay đổi, nên việc ghép dự đoán với đáp án là trái tim của kiến trúc.",
      "NMS là hệ quả của one-to-many; one-to-one bỏ được NMS.",
      "Metric và tập kiểm định quyết định bạn nhìn thấy lỗi nào."
    ],
    "cards": [
      [
        "YOLO26 mỗi điểm xuất bao nhiêu số trên COCO?",
        "84 = 4 số hộp + 80 lớp."
      ],
      [
        "Vì sao Mask R-CNN dùng RoI Align thay RoI Pool?",
        "Bỏ làm tròn toạ độ nên mặt nạ khớp đúng pixel."
      ],
      [
        "CenterNet bỏ NMS bằng cách nào?",
        "Chỉ giữ các đỉnh cục bộ trên bản đồ nhiệt tâm vật."
      ],
      [
        "Pattern gán nhãn mặt nạ hay dùng?",
        "SAM tạo nhãn, rồi huấn luyện YOLO-seg nhỏ để triển khai."
      ],
      [
        "Kiến trúc pose nào chậm dần khi đông người?",
        "Top-down, vì chạy pose cho từng người."
      ],
      [
        "Camera bỏ sót người ban đêm, làm gì trước?",
        "Thêm ảnh ban đêm vào tập kiểm định để đo đúng lỗi."
      ]
    ]
  },
  {
    "id": "day19",
    "part": 19,
    "n": 19,
    "title": "Cảm biến, hiệu chuẩn & đồng bộ thời gian",
    "question": "Trước khi đổ lỗi cho mô hình: cảm biến có đang đo đúng không, đo lúc nào, ở hệ trục nào, và khung hình này còn đủ tốt để tin không?",
    "analogy": "Một đội điều tra có ba nhân chứng: một người tinh mắt nhưng kém lúc trời tối (camera), một người đo khoảng cách bằng thước rất chuẩn nhưng sợ sương mù (LiDAR), một người nghe tiếng xe chạy nhanh hay chậm ngay cả khi mưa (radar). Muốn ghép lời khai đúng, phải biết mỗi người đứng ở đâu (hiệu chuẩn), mỗi lời khai nói về lúc mấy giờ (đồng bộ thời gian), và hôm nay ai đang mệt, nói kém tin cậy (sức khoẻ cảm biến).",
    "why": "Trong dự án ADAS thật, mô hình AI chỉ là một phần. Chất lượng cảm biến, thời điểm đo, hiệu chuẩn, băng thông và theo dõi sức khoẻ cảm biến quyết định kết quả perception có dùng được ngoài đường hay không. Day 20 (Kalman) sẽ dùng đúng câu trả lời của buổi này: mỗi cảm biến đo gì và đáng tin bao nhiêu.",
    "steps": [
      "Cảm biến đo gián tiếp trạng thái thế giới: z = h(x) + nhiễu. Dữ liệu đi qua driver, đồng bộ, hiệu chuẩn rồi mới tới mô hình.",
      "Chọn cảm biến theo tính năng, môi trường và giới hạn phần cứng: camera, LiDAR, radar, sonar/ToF mỗi loại mạnh một việc.",
      "Biết cảm biến xuống cấp thế nào (mưa, sương, chói, rung, mất gói) và biến chất lượng thành con số để theo dõi.",
      "Phân biệt ba lớp hiệu chuẩn: intrinsic, extrinsic và thời gian; nhìn kiểu lệch để đoán lớp nào sai.",
      "Đồng bộ các cảm biến khác nhịp về một thời điểm chung và bù chuyển động trước khi hợp nhất."
    ],
    "concepts": [
      {
        "t": "Mô hình đo",
        "en": "measurement model z = h(x) + noise",
        "d": "Cảm biến không đưa ra \"sự thật\" x mà đưa ra phép đo z, là một hàm h của trạng thái cộng với nhiễu. Hiểu h và nhiễu của từng cảm biến là bước đầu để ghép chúng lại.",
        "ex": "Radar đo khoảng cách và vận tốc hướng tâm; camera đo điểm ảnh; cả hai đều chỉ là \"hình chiếu\" nhiễu của vị trí thật của chiếc xe phía trước."
      },
      {
        "t": "Chọn cảm biến theo nhiệm vụ",
        "en": "camera · LiDAR · radar · sonar / ToF",
        "d": "Không có cảm biến \"tốt nhất\", chỉ có cảm biến hợp với nhiệm vụ, môi trường, ngân sách, sức tính và mục tiêu an toàn. Camera giỏi nhận dạng (người, xe, biển báo, làn); LiDAR giỏi khoảng cách 3D chính xác; radar đo vận tốc, nhìn xa và chịu mưa sương tốt; sonar/ToF rẻ, dùng ở cự ly gần.",
        "ex": "AEB cần nhận ra người đi bộ (camera) và biết khoảng cách, tốc độ chính xác (LiDAR, radar). Đỗ xe dùng sonar; drone hạ cánh dùng rangefinder ToF."
      },
      {
        "t": "Các loại camera",
        "en": "mono · stereo · fisheye · thermal · event camera",
        "d": "Mono RGB rẻ, giàu màu nhưng yếu khi chói, đêm, mưa. Stereo cho độ sâu nhưng cần bề mặt có vân và khoảng cách hai ống kính. Fisheye nhìn rộng, méo mạnh nên cần hiệu chuẩn kỹ. Thermal thấy người đi bộ ban đêm. Event camera phản ứng rất nhanh, dải sáng rộng, nhưng dữ liệu thưa và khó xử lý.",
        "ex": "Camera trước của xe ADAS cần màn trập nhanh hoặc global shutter cùng HDR; robot trong nhà có thể dùng RGB-D; drone nhỏ ưu tiên camera nhẹ + optical flow + rangefinder."
      },
      {
        "t": "Màn trập cuốn",
        "en": "rolling shutter vs global shutter",
        "d": "Rolling shutter đọc ảnh từng hàng một, nên khi xe rung hoặc quay nhanh, vật thẳng đứng bị nghiêng theo hàng quét. Global shutter chụp mọi điểm ảnh cùng lúc.",
        "ex": "Cột điện và vạch làn bị nghiêng khi drone xoay nhanh: dấu hiệu rolling shutter, không phải lỗi detector."
      },
      {
        "t": "Radar và các kiểu radar",
        "en": "SRR / MRR / LRR · 4D imaging radar",
        "d": "Radar đo khoảng cách và vận tốc (Doppler), giữ được khi mưa, sương. Radar tầm ngắn cho đỗ xe, điểm mù; tầm trung/xa cho ACC, AEB trên cao tốc nhưng phân giải góc kém hơn camera, LiDAR. Radar 4D đo thêm góc ngẩng.",
        "ex": "Trong mưa, radar vẫn giữ được khoảng cách tới xe phía trước, nhưng cầu, rào chắn, xe lớn có thể tạo \"bóng ma\" do phản xạ nhiều đường (multipath)."
      },
      {
        "t": "Thang suy giảm",
        "en": "sensor degradation ladder",
        "d": "Lỗi đi từ vật lý (mưa, sương, rung, chói, nước trên ống kính) → tín hiệu (mờ, nhiễu, mất điểm, bóng ma radar) → nhận thức (sai hộp, bỏ sót vật) → thời gian (đổi ID, rung, vật ma) → tính năng (phanh muộn, hạ cánh sai). Suy giảm không chỉ làm giảm mAP mà phá giả định của tracking, hợp nhất và điều khiển.",
        "ex": "Ống kính bị bùn che một góc → detector bỏ sót người đi bộ ở góc đó → tracker mất ID → AEB phanh muộn."
      },
      {
        "t": "Theo dõi sức khoẻ cảm biến",
        "en": "sensor health monitoring",
        "d": "Biến chất lượng cảm biến thành con số ghi log cùng timestamp: camera (độ sáng, tỷ lệ điểm cháy sáng, độ nét, rớt khung), LiDAR (mật độ điểm theo khoảng cách, số gói mỗi khung), radar (SNR, tỷ lệ bóng ma), sonar/ToF (giá trị kẹt, ngoài tầm), và chéo giữa các cảm biến (sai lệch chiếu camera–LiDAR).",
        "ex": "Độ nét ảnh đo bằng phương sai Laplacian; số gói LiDAR mỗi khung tụt đột ngột báo mất gói trên đường truyền."
      },
      {
        "t": "Bốn mức suy giảm",
        "en": "S0 Normal · S1 Mild · S2 Degraded · S3 Critical",
        "d": "Không phải lỗi nào cũng xử lý giống nhau. S0: dùng bình thường. S1: ghi cảnh báo, làm mượt thêm, giảm trọng số một chút. S2: đổi trọng số hợp nhất, yêu cầu xe/robot chạy chậm lại. S3: không tin cảm biến nữa, tắt tính năng hoặc chuyển chế độ an toàn.",
        "ex": "Camera chói (S2) nhưng radar bình thường (S0) → vẫn bám vật bằng radar. LiDAR mất gói (S3) + camera mưa (S2) → giảm tốc hoặc chuyển chế độ an toàn."
      },
      {
        "t": "Ba lớp hiệu chuẩn",
        "en": "intrinsics · extrinsics · temporal calibration",
        "d": "Intrinsic: tiêu cự, tâm ảnh, méo ống kính; sai thì chiếu sai ngay trong một ảnh. Extrinsic: phép biến đổi cứng giữa camera, LiDAR, radar, IMU và xe; sai thì hợp nhất lệch. Thời gian: độ lệch timestamp, độ trễ cảm biến; sai thì vật lệch theo vận tốc.",
        "ex": "Đoán nhanh: lệch cố định → extrinsic; lệch tăng theo tốc độ → đồng bộ thời gian; mép ảnh cong, méo → intrinsic."
      },
      {
        "t": "Đồng bộ thời gian và bù chuyển động",
        "en": "time sync · motion compensation",
        "d": "Camera 30 Hz, LiDAR 10 Hz, radar 20 Hz không đo cùng lúc. Phải ghi timestamp gốc, đo độ trễ từng khâu, rồi nội suy về một thời điểm hợp nhất chung và bù chuyển động của xe (deskew) trước khi ghép.",
        "ex": "Không bù thời gian, vật đang chạy bị chiếu sai chỗ; tracker có thể tạo vật ma hoặc ghép nhầm."
      }
    ],
    "formulas": [
      {
        "tex": "z = h(x) + v,\\qquad v \\sim \\mathcal{N}(0, R)",
        "read": "Phép đo = hàm của trạng thái thật + nhiễu có phương sai R.",
        "ex": "Day 20 dùng chính R này để quyết định tin cảm biến bao nhiêu."
      },
      {
        "tex": "\\Delta p = v\\,\\Delta t",
        "read": "Lệch thời gian Δt làm vật đang chạy với vận tốc v bị đặt sai chỗ một đoạn v·Δt.",
        "ex": "50 km/h ≈ 13,9 m/s; lệch 50 ms → khoảng 0,7 m. Thử ở mô phỏng."
      },
      {
        "tex": "e \\approx d\\,\\tan\\Delta\\theta",
        "read": "Lắp lệch một góc nhỏ Δθ làm điểm ở khoảng cách d lệch ngang một đoạn e, càng xa càng lệch nhiều.",
        "ex": "Lệch 1° ở 30 m: 30 × tan 1° ≈ 0,52 m, như nhau dù xe đứng yên hay chạy."
      },
      {
        "tex": "B = \\text{FPS} \\times W \\times H \\times \\text{bit depth}",
        "read": "Băng thông thô cần cho một camera = số khung mỗi giây × số điểm ảnh × số bit mỗi điểm.",
        "ex": "1920 × 1080, 12 bit, 30 fps ≈ 746 Mbit/s: đã sát mức 1 Gbit/s của cổng GigE."
      },
      {
        "tex": "x(t) = x(t_0) + \\dfrac{t - t_0}{t_1 - t_0}\\,\\bigl(x(t_1) - x(t_0)\\bigr)",
        "read": "Nội suy tuyến tính: ước lượng giá trị ở thời điểm hợp nhất t nằm giữa hai lần đo t₀ và t₁.",
        "ex": "LiDAR đo lúc 0 và 0,1 s; ảnh chụp lúc 0,03 s → lấy 30% đoạn đường giữa hai lần quét."
      },
      {
        "tex": "\\text{độ nét} = \\operatorname{Var}\\!\\bigl(\\nabla^2 I\\bigr)",
        "read": "Phương sai của ảnh sau phép Laplacian: ảnh mờ ít cạnh nên phương sai thấp.",
        "ex": "Ngưỡng phải chọn theo từng camera và từng loại cảnh; nên ghi kèm timestamp để sau này lọc khung hình xấu."
      }
    ],
    "table": {
      "title": "Bốn mức suy giảm và hành động",
      "cols": [
        "Mức",
        "Tình trạng",
        "Hệ thống làm gì"
      ],
      "rows": [
        [
          "S0 Normal",
          "Cảm biến khoẻ",
          "Dùng độ tin và output bình thường"
        ],
        [
          "S1 Mild",
          "Nhiễu nhẹ",
          "Ghi cảnh báo, làm mượt thêm, giảm trọng số một chút"
        ],
        [
          "S2 Degraded",
          "Ảnh hưởng rõ tới output",
          "Đổi model hoặc trọng số hợp nhất, yêu cầu chạy chậm lại"
        ],
        [
          "S3 Critical",
          "Không còn tin được",
          "Tắt tính năng hoặc chuyển chế độ an toàn"
        ]
      ]
    },
    "traps": [
      "Đo FPS chưa đủ: phải đo độ trễ đầu–cuối, vì hàng đợi có thể làm khung hình đến muộn dù FPS vẫn đẹp.",
      "Đừng tin một lần đo đơn lẻ của radar hay sonar: cần lọc, yêu cầu xuất hiện liên tục, gating và cảm biến dự phòng.",
      "Hiệu chuẩn bằng bảng caro trong lab chính xác nhưng không mở rộng được cho cả đội xe; xe chạy ngoài đường cần hiệu chuẩn lại khi rung, tháo lắp, va chạm.",
      "Auto-label từ nhiều cảm biến sai theo nếu hiệu chuẩn hoặc đồng bộ thời gian sai.",
      "Mô hình tốt trên benchmark sạch vẫn có thể hỏng trên cảm biến bẩn, lệch, không đồng bộ."
    ],
    "remember": [
      "Trước khi đổ lỗi cho mô hình: cảm biến đo đúng chưa, timestamp đúng chưa, khung hình này còn đủ tốt chưa.",
      "Lệch cố định → extrinsic; lệch theo tốc độ → thời gian; méo ảnh → intrinsic.",
      "Biến chất lượng cảm biến thành con số và mức S0–S3, mỗi mức có hành động riêng."
    ],
    "cards": [
      [
        "Vì sao không có cảm biến \"tốt nhất\"?",
        "Mỗi loại mạnh một việc; chọn theo tính năng, môi trường, ngân sách, sức tính, mục tiêu an toàn."
      ],
      [
        "Vật lệch vị trí nhiều hơn khi xe chạy nhanh: nghi lớp hiệu chuẩn nào?",
        "Hiệu chuẩn thời gian (lệch timestamp, độ trễ)."
      ],
      [
        "Radar dễ sinh bóng ma ở đâu?",
        "Gần cầu, rào chắn, xe lớn: phản xạ nhiều đường (multipath)."
      ],
      [
        "Đo độ mờ ảnh bằng gì?",
        "Phương sai Laplacian (cùng với độ nhất quán optical flow)."
      ],
      [
        "Camera chói ở S2 nhưng radar S0 thì sao?",
        "Vẫn bám vật bằng radar, giảm trọng số camera."
      ],
      [
        "Data loop dùng sức khoẻ cảm biến để làm gì?",
        "Lọc đúng lát dữ liệu khó (đêm, mưa, mất điểm, chói) để gán nhãn, huấn luyện lại và benchmark."
      ]
    ]
  },
  {
    "id": "day20",
    "part": 20,
    "n": 20,
    "title": "Kalman & hợp nhất xác suất",
    "question": "Khi cảm biến nhiễu và mô hình chuyển động không hoàn hảo, làm sao ra được ước lượng tốt nhất về vị trí, vận tốc?",
    "analogy": "Bạn lái xe vào hầm và mất GPS. Bạn còn hai manh mối: \"mình chạy 60 km/h trong 10 giây nên đã đi khoảng 170 m\" (phỏng đoán, sai số cứ cộng dồn) và \"bộ đếm vòng bánh xe báo 150 m\" (cảm biến, khá chuẩn nhưng không tuyệt đối). Đừng chọn một bỏ một: trộn cả hai và nghiêng về manh mối chắc chắn hơn, kết quả khoảng 152 m. Bộ lọc Kalman làm đúng việc đó, lặp lại mỗi khoảnh khắc.",
    "why": "Kalman có mặt ở điện thoại (GPS + cảm biến chuyển động), xe tự lái, drone, tàu Apollo, dự báo thời tiết và cả tài chính. Trong Phase 2, nó là phần \"dự đoán\" của mọi tracker (Day 22) và là công cụ chính để hợp nhất LiDAR, radar, camera (Day 23).",
    "steps": [
      "Biết khi nào cần bộ lọc: có đại lượng ẩn, cảm biến nhiễu/trễ/thiếu, và đại lượng đó thay đổi theo một quy luật.",
      "Biểu diễn niềm tin bằng hình chuông (giá trị đoán + độ không chắc) và trộn hai niềm tin theo độ chắc chắn.",
      "Chạy vòng lặp hai bước: dự đoán (nghi ngờ tăng thêm Q) rồi cập nhật bằng phép đo (tin theo K, nghi ngờ giảm).",
      "Hiểu hai núm vặn: Q (nghi mô hình) và R (nghi cảm biến) quyết định K và hành vi của bộ lọc.",
      "Mở rộng sang nhiều chiều để ước lượng cả vận tốc chưa từng đo.",
      "Thế giới cong thì dùng EKF, UKF hoặc bộ lọc hạt.",
      "Nhiều cảm biến thì cập nhật nhiều lần; coi chừng ngoại lai, thời gian, sai số tương quan và R không trung thực."
    ],
    "concepts": [
      {
        "t": "When to use Kalman (khi nào cần bộ lọc)",
        "en": "ba điều kiện chung",
        "d": "Bộ lọc Kalman xuất hiện khi có đủ ba thứ: (1) một đại lượng ẩn cần biết, (2) cảm biến nhiễu, trễ hoặc thiếu, (3) đại lượng đó thay đổi theo một quy luật nào đó.",
        "ex": "Điện thoại trong hầm: vị trí, vận tốc là đại lượng ẩn; GPS mất hoặc nhảy vài chục mét; xe chuyển động theo quy luật vật lý. Mất GPS thì bước dự đoán vẫn chạy (dead reckoning), có GPS lại thì cập nhật kéo về đúng."
      },
      {
        "t": "Predict only vs sensor only vs fused",
        "en": "ba cách theo dõi một robot",
        "d": "Chỉ dự đoán theo lệnh tốc độ thì mượt nhưng trôi dần vì bánh xe trượt. Chỉ tin cảm biến thì đúng trung bình nhưng giật. Trộn cả hai (Kalman) thì vừa mượt vừa chính xác.",
        "ex": "Trong một lần chạy demo của slide: sai số trung bình chỉ dự đoán 3,4 m, chỉ cảm biến 2,6 m, Kalman 1,0 m."
      },
      {
        "t": "Gaussian belief (niềm tin hình chuông)",
        "en": "giá trị đoán μ + độ không chắc σ",
        "d": "Thay vì một con số, ta giữ giá trị đoán tốt nhất μ và độ không chắc σ. Đường cong càng hẹp càng chắc chắn. Phương sai σ² là thứ bộ lọc thực sự theo dõi (ký hiệu P) vì nó cộng và trộn rất gọn.",
        "ex": "μ = 10 m, σ = 1,5 m: 68% khả năng sự thật nằm trong 8,5–11,5 m. Đo cùng một thứ n lần rồi lấy trung bình thì sai số giảm còn σ/√n."
      },
      {
        "t": "Fusion of two beliefs (trộn hai niềm tin)",
        "en": "cân theo 1 / phương sai",
        "d": "Trộn hai hình chuông: kết quả nằm gần cái chắc hơn, và luôn hẹp hơn cả hai đầu vào. Cái nào phương sai nhỏ (chắc hơn) thì được cân nặng hơn.",
        "ex": "Dự đoán 10 m (phương sai 4) + cảm biến 12 m (phương sai 1) → 11,6 m, phương sai 0,8. Thử ở mô phỏng \"Trộn hai niềm tin\"."
      },
      {
        "t": "Predict → update loop (vòng lặp dự đoán – cập nhật)",
        "en": "đoán trước, sửa bằng bằng chứng",
        "d": "Bước dự đoán: dùng điều đã biết (tốc độ, lệnh điều khiển, vật lý) để đoán bây giờ ta ở đâu; thời gian trôi nên ta kém chắc hơn. Bước cập nhật: có phép đo thì trộn vào; ta chắc hơn. Bộ lọc chỉ cần nhớ hai thứ: giá trị đoán x và độ không chắc P, không cần lưu lịch sử.",
        "ex": "Máy tính tàu Apollo chỉ có khoảng hai nghìn từ nhớ ghi được; việc chỉ cần nhớ x và P là điều kiện sống còn."
      },
      {
        "t": "Kalman gain K & innovation (độ bất ngờ)",
        "en": "tin phép đo bao nhiêu phần",
        "d": "Độ bất ngờ (innovation) = phép đo − dự đoán: cảm biến nói khác dự đoán bao nhiêu. K là con số từ 0 đến 1 quyết định nhích về phía phép đo bao nhiêu phần của độ bất ngờ đó. K gần 1: gần như theo hẳn cảm biến; K gần 0: gần như giữ dự đoán.",
        "ex": "Vừa ra khỏi hầm sau một phút: P rất lớn, GPS chính xác (R nhỏ) → K ≈ 1, ước lượng nhảy về GPS."
      },
      {
        "t": "Process noise Q (nhiễu quá trình)",
        "en": "mình nghi mô hình chuyển động bao nhiêu",
        "d": "Mô hình chuyển động không bao giờ đúng hoàn toàn: bánh xe trượt, xe phía trước phanh gấp, gió đẩy drone. Q là lượng nghi ngờ cộng thêm vào P sau mỗi bước dự đoán để bù cho những thứ chưa mô hình hoá. Q lớn → P sau dự đoán lớn → K lớn → bộ lọc tin cảm biến nhiều hơn.",
        "ex": "Q quá nhỏ: bộ lọc quá tin mô hình, xe dừng đột ngột mà ước lượng vẫn \"chạy tiếp\" một lúc (trễ). Q quá lớn: ước lượng giật theo từng phép đo nhiễu. Thử ở mô phỏng \"Hai núm vặn Q và R\"."
      },
      {
        "t": "Measurement noise R (nhiễu đo)",
        "en": "mình nghi cảm biến bao nhiêu",
        "d": "R là phương sai nhiễu của cảm biến: cùng một vật mà các lần đo tản mác bao nhiêu. R lớn → K nhỏ → bộ lọc ít tin phép đo, ước lượng mượt nhưng chậm theo. R nhỏ → K lớn → bám sát phép đo, kể cả nhiễu của nó.",
        "ex": "Đặt R từ thông số kỹ thuật, hoặc ghi lại cảm biến khi vật đứng yên rồi đo độ tản mác. Sau đó mới chỉnh Q cho tới khi bám được cú rẽ, cú phanh thật mà không đuổi theo nhiễu."
      },
      {
        "t": "Q : R ratio (tỷ lệ hai núm vặn)",
        "en": "hành vi do tỷ lệ quyết định",
        "d": "Hành vi của bộ lọc (bám nhanh hay mượt) phụ thuộc vào tỷ lệ Q : R. Còn độ lớn tuyệt đối của chúng quyết định bộ lọc tự nhận mình chắc đến đâu (P lớn hay nhỏ).",
        "ex": "Nhân cả Q và R lên 10 lần: đường ước lượng gần như không đổi, nhưng dải bất định ±2σ rộng ra."
      },
      {
        "t": "Hidden state (trạng thái ẩn)",
        "en": "ước lượng điều chưa từng đo",
        "d": "Đại lượng cần biết mà không cảm biến nào đo trực tiếp. Trạng thái gồm [vị trí; vận tốc] dù LiDAR chỉ đo vị trí: các vị trí cứ tăng dần cho bộ lọc biết vật đang chuyển động và nhanh cỡ nào.",
        "ex": "Mô hình vận tốc không đổi: vị trí mới = vị trí + vận tốc × Δt, vận tốc giữ nguyên (hơn kém chút ít)."
      },
      {
        "t": "Covariance matrix P (ma trận hiệp phương sai)",
        "en": "bất định 2 chiều là một elip",
        "d": "Khi trạng thái có nhiều phần tử, P thành một bảng: đường chéo là độ nghi ngờ của từng đại lượng, ngoài đường chéo là chúng liên hệ với nhau thế nào. Vẽ ra thì P là một hình elip.",
        "ex": "Tương quan ρ > 0: nếu đoán vị trí quá cao thì nhiều khả năng cũng đoán vận tốc quá cao. P = [[2,25; 0,9]; [0,9; 1]]."
      },
      {
        "t": "Linear vs nonlinear (tuyến tính và phi tuyến)",
        "en": "vì sao Kalman thường cần bản mở rộng",
        "d": "Kalman gốc chỉ đúng khi chuyển động và phép đo là hàm đường thẳng: đưa một hình chuông qua đường thẳng thì ra vẫn là hình chuông. Ngoài đời nhiều quan hệ là đường cong; hình chuông đi qua đường cong bị méo, công thức Kalman không còn đúng.",
        "ex": "Radar không đo x, y mà đo khoảng cách r = √(x² + y²) và góc atan2(y, x); xe ôm cua thì hướng đi đổi theo sin, cos. Cả hai đều phi tuyến."
      },
      {
        "t": "EKF · Extended Kalman Filter (Kalman mở rộng)",
        "en": "thay đường cong bằng tiếp tuyến",
        "d": "Tại giá trị đoán hiện tại, coi đường cong như đoạn thẳng tiếp tuyến (giống phóng to sát một đường cong thì thấy gần như thẳng), rồi chạy Kalman bình thường. Độ dốc tiếp tuyến là đạo hàm; nhiều chiều thì gom thành ma trận Jacobian. Nhanh, dễ hiểu, nhưng phải tự tính đạo hàm và sai nhiều khi đường cong uốn mạnh trong vùng chưa chắc chắn.",
        "ex": "x có giá trị đoán 1, độ lệch chuẩn 0,5, qua y = x²: EKF ra trung bình 1 và phương sai 1, trong khi đúng là 1,25 và 1,125. PX4 và ArduPilot (phần mềm bay của drone) dùng EKF."
      },
      {
        "t": "UKF · Unscented Kalman Filter (Kalman dùng điểm sigma)",
        "en": "đẩy vài điểm đại diện qua hàm thật",
        "d": "Không xấp xỉ hàm mà chọn vài điểm đại diện cho hình chuông (sigma points: một điểm giữa và các điểm hai bên), đưa từng điểm qua đúng hàm cong, rồi tính lại trung bình và phương sai từ kết quả. Không cần đạo hàm, thường chính xác hơn EKF khi hàm cong mạnh, chi phí tương đương.",
        "ex": "Cùng ví dụ y = x²: ba điểm 0,134; 1; 1,866 với trọng số 1/6, 2/3, 1/6 cho đúng trung bình 1,25 và phương sai 1,125. Thử ở mô phỏng \"Hình chuông đi qua đường cong\"."
      },
      {
        "t": "Particle filter (bộ lọc hạt)",
        "en": "hàng trăm phỏng đoán",
        "d": "Giữ niềm tin bằng hàng trăm, hàng nghìn \"hạt\" phỏng đoán thay vì một hình chuông; hạt nào khớp phép đo thì được giữ và nhân lên. Xử lý được niềm tin nhiều đỉnh, đổi lại tốn tính toán. Ensemble Kalman (EnKF) trong dự báo thời tiết dùng ý tưởng gần giống: chạy 20–100 bản mô hình và ước lượng P từ độ phân tán của chúng.",
        "ex": "Robot chưa biết mình đứng trước cửa nào trong 3 cửa giống nhau: niềm tin có 3 đỉnh, chỉ bộ lọc hạt giữ được cả ba."
      },
      {
        "t": "Sensor fusion (hợp nhất nhiều cảm biến)",
        "en": "mỗi cảm biến là một lần cập nhật",
        "d": "Mỗi cảm biến thêm chỉ là một bước cập nhật nữa với H và R riêng; thứ tự cập nhật không quan trọng. Cảm biến đến không cùng lúc thì với mỗi lần đến: dự đoán tới đúng mốc thời gian đó rồi cập nhật. Hợp nhất tập trung (đưa phép đo thô vào một bộ lọc) chính xác nhất; track-to-track (mỗi cảm biến một tracker rồi ghép) gọn hơn nhưng sai số có thể tương quan.",
        "ex": "LiDAR giỏi vị trí 3D nhưng sợ mưa sương; radar giỏi khoảng cách, tốc độ, mọi thời tiết nhưng góc ngang thô; camera giỏi góc ngang và loại vật nhưng kém độ sâu. Sai số chỉ về các hướng khác nhau nên ghép lại tốt hơn từng cái."
      },
      {
        "t": "Gating & outliers (cổng lọc ngoại lai)",
        "en": "loại phép đo bất ngờ quá mức",
        "d": "Một phép đo lệch xa (bóng ma radar, trục trặc) có thể kéo giật ước lượng. Bộ lọc biết độ bất ngờ \"bình thường\" lớn cỡ nào (ký hiệu S), nên loại những phép đo có độ bất ngờ vượt quá khoảng 3 lần mức đó.",
        "ex": "Độ bất ngờ nên trông như nhiễu ngẫu nhiên với độ tản mác đúng bằng S; nếu không, Q hoặc R đang khai sai."
      }
    ],
    "formulas": [
      {
        "tex": "x^- = x + u, \\qquad P^- = P + Q",
        "read": "Dự đoán: dịch giá trị đoán theo chuyển động đã biết u, và cộng thêm nghi ngờ Q.",
        "ex": "Thời gian trôi làm ta kém chắc hơn, không bao giờ chắc hơn. Đặt Q = 0 thì đường cong chỉ dịch đi mà không nở ra."
      },
      {
        "tex": "K = \\dfrac{P^-}{P^- + R}",
        "read": "Mức tin phép đo = nghi ngờ vào dự đoán chia (nghi ngờ dự đoán + nhiễu cảm biến). Q làm P⁻ lớn lên nên K tăng; R lớn thì K giảm.",
        "ex": "P⁻ = 4, R = 1 → K = 0,8: tin cảm biến 80%, tin dự đoán 20%."
      },
      {
        "tex": "x = x^- + K\\,(z - x^-), \\qquad P = (1-K)\\,P^-",
        "read": "Cập nhật: nhích từ dự đoán về phía phép đo z một phần K của độ bất ngờ (z − x⁻); nghi ngờ giảm còn (1 − K).",
        "ex": "10 + 0,8 × (12 − 10) = 11,6; P = 0,2 × 4 = 0,8."
      },
      {
        "tex": "P^- = F P F^{\\top} + Q, \\qquad K = P^- H^{\\top}\\!\\left(H P^- H^{\\top} + R\\right)^{-1}",
        "read": "Bản nhiều chiều của cùng năm dòng: F mô tả chuyển động, H mô tả cảm biến thấy gì của trạng thái. Phần trong ngoặc là S, độ lớn kỳ vọng của độ bất ngờ.",
        "ex": "Vận tốc không đổi: F = [[1, Δt], [0, 1]], H = [1, 0] (cảm biến chỉ thấy vị trí)."
      },
      {
        "tex": "\\dfrac{1}{\\sigma^2_{\\text{fused}}} = \\sum_i \\dfrac{1}{\\sigma_i^2}",
        "read": "\"Thông tin\" = 1 / phương sai. Hợp nhất là cộng thông tin của các cảm biến.",
        "ex": "LiDAR 10,5 (phương sai 4), radar 12 (1), camera 11 (2): thông tin 0,25 + 1 + 0,5 = 1,75 → phương sai 0,57; trung bình 11,5."
      },
      {
        "tex": "\\sigma_{\\bar z} = \\dfrac{\\sigma}{\\sqrt{n}}",
        "read": "Trung bình n phép đo có sai số giảm theo căn n.",
        "ex": "Đo 100 lần thì sai số còn 1/10."
      },
      {
        "tex": "f(x) \\approx f(\\mu) + f'(\\mu)\\,(x - \\mu)",
        "read": "EKF thay hàm cong bằng tiếp tuyến tại giá trị đoán μ; độ dốc f′(μ) (nhiều chiều là Jacobian) dùng như ma trận F hoặc H.",
        "ex": "y = x², μ = 1: tiếp tuyến y ≈ 1 + 2(x − 1) → trung bình 1, phương sai 2² × 0,25 = 1."
      },
      {
        "tex": "\\chi \\in \\{\\mu,\\ \\mu \\pm \\sqrt{3}\\,\\sigma\\},\\quad w = \\tfrac{2}{3},\\ \\tfrac{1}{6},\\ \\tfrac{1}{6}",
        "read": "UKF một chiều: ba điểm sigma và trọng số của chúng; đưa từng điểm qua hàm thật rồi lấy trung bình có trọng số.",
        "ex": "μ = 1, σ = 0,5: điểm 1; 1,866; 0,134 → bình phương 1; 3,482; 0,018 → trung bình 1,25."
      },
      {
        "tex": "\\mathbb{E}[x^2] = \\mu^2 + \\sigma^2",
        "read": "Trung bình thật của x² lớn hơn bình phương của trung bình: độ cong cộng thêm σ².",
        "ex": "μ = 1, σ = 0,5 → 1,25. EKF bỏ mất phần σ² này vì tiếp tuyến không có độ cong."
      }
    ],
    "table": {
      "title": "Hai núm vặn Q và R",
      "cols": [
        "",
        "R nhỏ (tin cảm biến)",
        "R lớn (nghi cảm biến)"
      ],
      "rows": [
        [
          "Q nhỏ (tin mô hình)",
          "Tin cả hai: mượt và chính xác. Trường hợp lý tưởng khi cả mô hình lẫn cảm biến đều tốt.",
          "Tin mô hình, gần như bỏ qua cảm biến: rất mượt nhưng chậm nhận ra thay đổi thật (xe phanh mà ước lượng vẫn chạy)."
        ],
        [
          "Q lớn (nghi mô hình)",
          "Tin cảm biến: bám nhanh nhưng gần như chép luôn nhiễu.",
          "Không tin ai: đầu ra bất định, bộ lọc báo P lớn."
        ]
      ]
    },
    "traps": [
      "Q hoặc R khai quá nhỏ: bộ lọc tự tin sai, bỏ qua dữ liệu mới và có thể phân kỳ. Quá lớn: chậm chạp hoặc giật.",
      "Đếm trùng: hai track \"độc lập\" nhưng chung một nguồn sai số làm kết quả hợp nhất quá tự tin. Hợp nhất phép đo thô, hoặc dùng covariance intersection (quy tắc hợp nhất thận trọng).",
      "Lệch thời gian 50 ms khi vật chạy 20 m/s đã sai 1 m: đồng bộ đồng hồ, gắn dấu thời gian lúc thu, hiệu chuẩn vị trí cảm biến.",
      "Thêm cảm biến nhiễu không bao giờ có hại, miễn R của nó khai đúng. R rác thì hợp nhất rác.",
      "Gỡ lỗi bộ lọc: kiểm tra đơn vị và dấu thời gian trước tiên. Chưa chắc trạng thái ban đầu thì đặt P lớn; nó co lại nhanh.",
      "Chỉ EKF cần tính đạo hàm (Jacobian); UKF và bộ lọc hạt thì không."
    ],
    "remember": [
      "Niềm tin = giá trị đoán + độ không chắc; trộn theo nghịch đảo phương sai, kết quả luôn chắc hơn cả hai đầu vào.",
      "Dự đoán làm nghi ngờ tăng thêm Q; cập nhật làm nghi ngờ giảm theo K. Q nghi mô hình, R nghi cảm biến.",
      "Hợp nhất chỉ là cập nhật thêm; phi tuyến thì EKF (tiếp tuyến), UKF (điểm sigma), bộ lọc hạt (nhiều phỏng đoán)."
    ],
    "cards": [
      [
        "Ước lượng trễ so với thực tế thì chỉnh gì?",
        "Tăng Q (bớt tin mô hình)."
      ],
      [
        "Ước lượng bị giật theo nhiễu thì chỉnh gì?",
        "Giảm Q hoặc tăng R."
      ],
      [
        "Bộ lọc bỏ qua dữ liệu mới thì sao?",
        "P quá nhỏ: tăng Q."
      ],
      [
        "Phản ứng với mọi trục trặc của cảm biến thì làm gì?",
        "Thêm gating: loại phép đo có độ bất ngờ quá lớn so với S."
      ],
      [
        "R nên lấy từ đâu?",
        "Thông số kỹ thuật, hoặc đo độ tản mác của cảm biến khi vật đứng yên."
      ],
      [
        "Bộ lọc chỉ cần nhớ những gì?",
        "Chỉ x và P, không cần lưu lịch sử phép đo."
      ],
      [
        "Vì sao vẫn ước lượng được vận tốc khi chỉ đo vị trí?",
        "Vị trí tăng dần theo thời gian và mô hình chuyển động liên hệ vị trí với vận tốc."
      ],
      [
        "EKF và UKF khác nhau ở đâu?",
        "EKF thay hàm cong bằng tiếp tuyến (cần đạo hàm); UKF đưa vài điểm sigma qua hàm thật (không cần đạo hàm)."
      ],
      [
        "Khi nào cần bộ lọc hạt?",
        "Khi niềm tin có nhiều đỉnh, không còn là một hình chuông."
      ],
      [
        "Radar và camera bù nhau thế nào?",
        "Radar chính xác dọc theo tia nhìn, camera chính xác theo góc ngang."
      ]
    ]
  },
  {
    "id": "day21",
    "part": 21,
    "n": 21,
    "title": "3D từ point cloud",
    "question": "Từ hàng trăm nghìn điểm LiDAR thô, làm sao ra được hộp 3D đúng vị trí, chiếu khớp lên ảnh camera, và biết con số benchmark có đáng tin không?",
    "analogy": "Point cloud giống một bức tượng được phủ bằng hàng trăm nghìn hạt bụi phát sáng: hình dáng có đủ nhưng không có màu, càng xa càng thưa. Muốn máy hiểu, ta gom bụi vào các ô (voxel) hoặc các cột (pillar), nhìn từ trên xuống (BEV), rồi khoanh từng vật bằng hộp 3D. Muốn mượn màu và ngữ nghĩa của camera, ta phải \"rọi\" từng hạt bụi lên bức ảnh, và chỉ cần rọi lệch một chút là cả bức tranh sai.",
    "why": "Một detector tốt vẫn hỏng nếu dữ liệu trước nó lệch 2 cm, trễ 50 ms hoặc sai trục. Buổi này nối cảm biến, hiệu chuẩn, thời gian (Day 19, Day 20) với perception 3D; hộp 3D và BEV sẽ được dùng lại cho tracking (Day 22) và hợp nhất BEV (Day 23).",
    "steps": [
      "Hiểu một khung point cloud: mỗi điểm có x, y, z, intensity, ring, time offset; đọc đúng định dạng và đúng hệ trục.",
      "Tiền xử lý: cắt vùng, bỏ điểm lỗi, bù chuyển động (deskew), gộp nhiều lần quét, chia voxel.",
      "Chọn cách biểu diễn: point-based, voxel + sparse conv, pillar/BEV, range image; mỗi cách là một đánh đổi tốc độ – độ chi tiết.",
      "Phát hiện vật 3D bằng PointPillars hoặc CenterPoint, ra hộp 3D theo một quy ước rõ ràng; đọc metric theo lát.",
      "Chiếu LiDAR lên camera bằng K·[R | t] để kiểm tra hiệu chuẩn, hỗ trợ gán nhãn và hợp nhất."
    ],
    "concepts": [
      {
        "t": "Point fields (các trường của một điểm LiDAR)",
        "en": "x, y, z · intensity · ring · time offset",
        "d": "Mỗi điểm không chỉ có tọa độ. Intensity cho biết độ phản xạ của vật liệu; ring cho biết tia laser nào tạo ra điểm; time offset là thời điểm của điểm trong một vòng quét, cần để bù chuyển động; return type cho biết phản xạ đầu, mạnh nhất hay cuối.",
        "ex": "Thiếu cả một ring → nghi tia hỏng hoặc mưa sương; thiếu time offset → không deskew được khi xe quay nhanh."
      },
      {
        "t": "Coordinate frames (hệ trục và phép biến đổi)",
        "en": "T_camera_lidar · T_ego_sensor",
        "fig": "frames",
        "figCap": "LiDAR và camera dùng trục khác nhau; mọi thứ phải về cùng một hệ, cùng đơn vị trước khi học.",
        "d": "LiDAR, camera, IMU, xe (ego) và bản đồ có trục khác nhau. Camera thường x phải, y xuống, z tới trước; LiDAR tùy driver và dataset. Mọi thứ phải về cùng một hệ, cùng đơn vị mét và radian, trước khi học.",
        "ex": "Test 5 phút: một điểm cách xe 10 m phía trước, sau biến đổi phải vẫn ở phía trước; chiếu lên camera phải nằm trong ảnh và có độ sâu dương."
      },
      {
        "t": "Preprocessing (tiền xử lý)",
        "en": "crop · deskew · multi-sweep · voxelize",
        "d": "Cắt vùng theo tầm nhìn, bỏ NaN/Inf, bù chuyển động theo time offset, có thể bỏ mặt đường, gộp 2–10 lần quét, rồi chia voxel. Mỗi bước là một đánh đổi giữa độ trễ, khả năng thấy vật nhỏ và bộ nhớ.",
        "ex": "Cắt quá hẹp → bỏ sót người đi bộ ở rìa. Không deskew → xe quay nhanh làm vật bị kéo dài. Gộp nhiều lần quét mà sai pose → vật ma, vật nhân đôi."
      },
      {
        "t": "Point cloud representations (cách biểu diễn)",
        "en": "point-based · voxel · pillar / BEV · range image",
        "fig": "pc-repr",
        "figCap": "Cùng một đám điểm: chia ô 3D (voxel), gộp chiều cao thành cột (pillar), rồi nhìn từ trên thành ảnh giả 2D (BEV).",
        "d": "Point-based học thẳng trên điểm, giữ chi tiết nhưng khó chạy realtime. Voxel + sparse convolution chính xác, tận dụng tính cục bộ nhưng tốn bộ nhớ theo độ phân giải. Pillar/BEV gộp chiều cao thành cột nên rất nhanh, dùng được CNN 2D nhưng mất chi tiết theo chiều đứng. Range image xếp điểm theo tia quét.",
        "ex": "Trong ADAS, detector thường dùng voxel hoặc pillar để đạt độ trễ; point-based hay gặp ở bước tinh chỉnh hộp hoặc phân đoạn."
      },
      {
        "t": "Voxelization (voxel hoá)",
        "en": "voxel_size · point_cloud_range · max_points_per_voxel",
        "d": "Chia không gian thành các ô 3D đều nhau để dữ liệu thưa thành tensor có cấu trúc. Voxel to thì nhanh nhưng mất vật nhỏ; voxel nhỏ thì chính xác hơn nhưng bộ nhớ và độ trễ tăng vọt.",
        "ex": "Đổi voxel_size hay point_cloud_range mà không đo lại độ trễ và lát vật nhỏ thì chưa đủ bằng chứng; kết quả cũng không còn so sánh công bằng với checkpoint cũ."
      },
      {
        "t": "PointPillars",
        "en": "pillar → PointNet → ảnh giả BEV → CNN 2D",
        "d": "Pillar là voxel không chia theo chiều cao. Mỗi cột được mã hoá bằng một PointNet nhỏ, xếp thành một \"ảnh giả\" nhìn từ trên xuống, rồi đưa qua CNN 2D và đầu dò hộp. Là baseline nhanh, dễ chạy demo.",
        "ex": "AP của người đi bộ, xe đạp thấp → kiểm tra mật độ điểm, vùng cắt và augmentation trước khi đổi mô hình."
      },
      {
        "t": "Center-based head (đầu dò theo tâm, CenterPoint)",
        "en": "heatmap tâm vật thay cho anchor",
        "d": "Thay vì thử mọi hộp neo (anchor), mạng vẽ một bản đồ nhiệt (heatmap) đánh dấu tâm vật trên BEV, rồi hồi quy kích thước, độ cao z, góc yaw và vận tốc. Tâm vật cũng giúp nối với tracking bằng cách ghép tâm gần nhất.",
        "ex": "Khi debug: tâm trên heatmap có lệch không, yaw có bị quấn quanh ±π không, vận tốc từ nhiều lần quét có đúng hệ và đúng thời gian không."
      },
      {
        "t": "3D box convention (quy ước hộp 3D)",
        "en": "x, y, z, dx, dy, dz, yaw",
        "fig": "box-conv",
        "figCap": "Lẫn tâm hộp với tâm đáy làm hộp lơ lửng h/2; yaw đo từ trục x và quấn ở ±π.",
        "d": "Hộp 3D gồm tâm, ba kích thước và góc yaw (cộng lớp, điểm, vận tốc). Dataset khác nhau dùng tâm hộp hay tâm đáy, thứ tự kích thước và trục yaw khác nhau. Mô hình đúng mà đánh giá sai nếu quy ước không khớp.",
        "ex": "Hộp lơ lửng hoặc chui xuống đất → lẫn tâm và tâm đáy; xe xoay 90° → đảo dx, dy hoặc sai trục yaw; hộp khổng lồ → lẫn cm và m."
      },
      {
        "t": "3D metrics & slices (metric 3D và lát đánh giá)",
        "en": "KITTI AP · nuScenes NDS · slices",
        "d": "KITTI chấm AP theo 2D, BEV, 3D với ngưỡng IoU, lớp và độ khó. nuScenes NDS kết hợp mAP với các lỗi vị trí, kích thước, hướng, vận tốc, thuộc tính. Ngoài ra cần độ trễ p50/p95 và lát theo khoảng cách, lớp, che khuất, thời tiết.",
        "ex": "mAP cao chưa đủ an toàn: phải xem riêng 0–20 m, 20–50 m, trên 50 m và người đi bộ gần xe."
      },
      {
        "t": "LiDAR–camera projection (chiếu LiDAR lên ảnh)",
        "en": "K · [R | t]",
        "d": "Biến điểm LiDAR sang hệ camera bằng extrinsic [R | t], bỏ điểm có độ sâu không dương, rồi chiếu bằng intrinsic K ra điểm ảnh (u, v). Là bài test hiệu chuẩn rẻ nhất: điểm phải bám vào xe, cột, mép đường trên ảnh.",
        "ex": "Phủ điểm lên ảnh theo độ sâu; đo thêm sai số chiếu lại (reprojection error) và độ khớp cạnh theo thời gian. Thử ở mô phỏng."
      },
      {
        "t": "Camera–LiDAR fusion styles (cách ghép camera và LiDAR)",
        "en": "point painting · frustum · BEV fusion · late fusion",
        "d": "Point painting: chiếu điểm vào ảnh để lấy nhãn ngữ nghĩa rồi đưa lại vào detector 3D. Frustum: detector 2D khoanh vùng, LiDAR tinh chỉnh. BEV fusion: đưa đặc trưng camera lên BEV rồi ghép với LiDAR. Late fusion: ghép kết quả cuối, dễ tích hợp nhưng khó tận dụng tương tác sâu.",
        "ex": "Ghép sớm nhạy với lệch hiệu chuẩn và chất lượng ảnh; ghép không tự làm hệ an toàn hơn nếu một cảm biến xấu mà không ai phát hiện."
      },
      {
        "t": "Point cloud degradation (point cloud xuống cấp)",
        "en": "range dropout · motion smear · occlusion · drift",
        "d": "LiDAR tốt vẫn có lúc cho dữ liệu xấu: vật xa, mặt hấp thụ, mưa sương làm mật độ giảm (range dropout); xe quay nhanh mà thiếu thời gian từng điểm làm vật bị kéo (motion smear); xe lớn che người (occlusion); giá đỡ lỏng làm hiệu chuẩn trôi; kính và bề mặt phản xạ sinh điểm sai; mất gói làm thiếu cả mảng.",
        "ex": "Nên ghi log theo thời gian: số điểm mỗi khung, mật độ theo góc, tỷ lệ điểm lỗi, phân bố intensity, mất gói, khoảng hở thời gian và điểm khớp khi chiếu lên ảnh."
      },
      {
        "t": "Datasets & conventions (bộ dữ liệu và quy ước)",
        "en": "KITTI · nuScenes · Waymo · log của đội",
        "d": "Mỗi bộ dữ liệu có cách lắp cảm biến, hệ trục, bảng lớp, cách chia và metric riêng. KITTI hợp để học chiếu LiDAR–camera và hộp 3D cơ bản; nuScenes có nhiều lần quét, radar, camera, LiDAR và metric NDS; Waymo lớn, nhiều ca hiếm; log robot/drone của đội là miền thật nhưng thiếu nhãn.",
        "ex": "nuScenes chỉ gán nhãn khung chính 2 Hz; KITTI ít cảnh nhưng file hiệu chuẩn rất quan trọng."
      },
      {
        "t": "LiDAR helps camera labeling (LiDAR hỗ trợ gán nhãn ảnh)",
        "en": "project 3D box → 2D gợi ý · label QA · data mining",
        "d": "Chiếu hộp 3D từ LiDAR lên ảnh để gợi ý hộp 2D cho người gán nhãn; nếu nhãn 2D không khớp phép chiếu thì kiểm tra nhãn, hiệu chuẩn hoặc timestamp; chọn các khung có vật xa, bị che, mật độ thấp hay chiếu lệch để gán nhãn và huấn luyện lại.",
        "ex": "Một script phủ điểm lên ảnh và một bảng thống kê chỗ lệch thường có giá trị hơn một mô hình mới chưa debug dữ liệu."
      },
      {
        "t": "Debug order: 6 layers (thứ tự gỡ lỗi)",
        "en": "I/O → geometry → time → preprocess → model → metric",
        "d": "Khi detector 3D tệ, kiểm tra theo thứ tự: đọc đúng trường và frame chưa (I/O), biến đổi và quy ước hộp đúng chưa (hình học), đồng bộ và deskew chưa (thời gian), vùng cắt, voxel, bảng lớp có khớp lúc đánh giá không (tiền xử lý), checkpoint đúng dataset chưa (mô hình), metric có đúng lát của bài toán không (metric).",
        "ex": "Bằng chứng tối thiểu: in schema và thống kê điểm; vẽ 3D với một điểm tự đặt; đo khoảng hở thời gian; dump config; chạy mẫu đo độ trễ p50/p95."
      }
    ],
    "formulas": [
      {
        "tex": "s\\begin{bmatrix}u\\\\v\\\\1\\end{bmatrix} = K\\,[R \\mid t]\\begin{bmatrix}x\\\\y\\\\z\\\\1\\end{bmatrix}",
        "read": "Điểm 3D nhân với extrinsic [R | t] để sang hệ camera, nhân với intrinsic K để ra điểm ảnh; s là độ sâu.",
        "ex": "Đảo nhầm T_cam_lidar với T_lidar_cam là lỗi số một trong checklist."
      },
      {
        "tex": "u = f_x\\,\\dfrac{X}{Z} + c_x,\\qquad v = f_y\\,\\dfrac{Y}{Z} + c_y",
        "read": "Chiếu pinhole trong hệ camera: chia cho độ sâu Z, nhân tiêu cự, cộng tâm ảnh. Chỉ dùng khi Z > 0.",
        "ex": "fx = 500, cx = 320, điểm X = 1 m, Z = 10 m → u = 370."
      },
      {
        "tex": "f_x' = s\\,f_x,\\quad f_y' = s\\,f_y,\\quad c_x' = s\\,c_x,\\quad c_y' = s\\,c_y",
        "read": "Đổi kích thước ảnh theo hệ số s thì phải đổi K theo cùng hệ số.",
        "ex": "Thu ảnh 640 → 320 (s = 0,5): fx 500 → 250, cx 320 → 160. Quên bước này thì điểm bay khỏi vật."
      },
      {
        "tex": "N_x = \\dfrac{x_{\\max} - x_{\\min}}{v_x}",
        "read": "Số ô theo một trục = độ dài vùng cắt chia kích thước voxel.",
        "ex": "Vùng −50…50 m: voxel 0,2 m → 500 ô mỗi trục; voxel 0,1 m → 1000 ô, tức gấp 4 lần số ô trên BEV."
      },
      {
        "tex": "\\psi \\leftarrow \\operatorname{atan2}(\\sin\\psi,\\ \\cos\\psi)",
        "read": "Đưa góc yaw về khoảng (−π, π] để hai hộp cùng hướng không bị coi là lệch gần 2π.",
        "ex": "3,3 rad và −2,98 rad là cùng một hướng."
      },
      {
        "tex": "\\text{NDS} = \\tfrac{1}{10}\\Bigl[5\\,\\text{mAP} + \\textstyle\\sum_{\\text{TP}}\\bigl(1 - \\min(1, \\text{lỗi})\\bigr)\\Bigr]",
        "read": "Điểm nuScenes: một nửa từ mAP, nửa còn lại từ năm loại lỗi vị trí, kích thước, hướng, vận tốc, thuộc tính.",
        "ex": "mAP 0,6 và cả năm lỗi bằng 0,3 → (3 + 3,5) / 10 = 0,65."
      }
    ],
    "table": {
      "title": "Chọn cách biểu diễn point cloud",
      "cols": [
        "Cách",
        "Ý tưởng",
        "Mạnh",
        "Yếu"
      ],
      "rows": [
        [
          "Point-based",
          "Học trực tiếp trên điểm",
          "Giữ hình học tốt, chính xác",
          "Khó gom batch, chậm khi nhiều điểm"
        ],
        [
          "Voxel + sparse conv",
          "Chia không gian 3D thành ô",
          "Chính xác, khai thác tính cục bộ",
          "Bộ nhớ tăng theo độ phân giải"
        ],
        [
          "Pillar / BEV",
          "Gộp chiều cao thành cột",
          "Rất nhanh, dùng CNN 2D",
          "Mất chi tiết theo chiều đứng"
        ],
        [
          "Range image",
          "Xếp điểm theo tia quét",
          "Hiệu quả cho từng đường quét",
          "Méo do chiếu, khó với che khuất"
        ],
        [
          "BEV fusion",
          "Gom đặc trưng các cảm biến lên BEV",
          "Hợp với planner, tracking, hợp nhất",
          "Cần hiệu chuẩn và đồng bộ tốt"
        ]
      ]
    },
    "traps": [
      "Không lọc điểm có z_cam ≤ 0 thì điểm phía sau camera bị lật ra trước, thành vật ma trên ảnh.",
      "Đổi kích thước ảnh mà không scale fx, fy, cx, cy; dùng ảnh gốc chưa khử méo với intrinsic của ảnh đã khử méo.",
      "Đọc PointCloud2 bằng width × height mà quên row_step, hoặc đọc intensity sai offset: tạo ra benchmark giả.",
      "Không so sánh paper nếu khác split, vùng cắt, bảng lớp, số lần quét hoặc script đánh giá.",
      "Hợp nhất có thể lan truyền lỗi: nếu một cảm biến xấu mà không được phát hiện, kết quả ghép tệ hơn từng cảm biến."
    ],
    "remember": [
      "Trước khi benchmark mô hình, hãy benchmark sức khoẻ dữ liệu: frame, timestamp, đơn vị, quy ước hộp.",
      "Biểu diễn là đánh đổi: point giữ chi tiết, voxel chính xác, pillar/BEV nhanh.",
      "Chiếu LiDAR lên ảnh là bài test hiệu chuẩn rẻ nhất; metric phải đọc theo lát và kèm failure case."
    ],
    "cards": [
      [
        "Trường nào cần để deskew point cloud?",
        "Time offset của từng điểm trong vòng quét."
      ],
      [
        "Pillar khác voxel ở đâu?",
        "Pillar không chia theo chiều cao; cả cột thành một ô trên BEV."
      ],
      [
        "Hộp 3D lơ lửng trên mặt đường: nghi gì trước?",
        "Lẫn quy ước tâm hộp với tâm đáy (z center vs bottom)."
      ],
      [
        "Thu nhỏ ảnh một nửa thì intrinsic đổi thế nào?",
        "fx, fy, cx, cy đều nhân 0,5."
      ],
      [
        "NDS khác mAP ở đâu?",
        "Cộng thêm điểm từ các lỗi vị trí, kích thước, hướng, vận tốc, thuộc tính."
      ],
      [
        "Thứ tự 6 lớp debug khi detector tệ?",
        "I/O → hình học → thời gian → tiền xử lý → mô hình → metric."
      ]
    ]
  },
  {
    "id": "day22",
    "part": 22,
    "n": 22,
    "title": "Tracking",
    "question": "Detector chỉ nói \"có 3 người trong khung hình này\". Làm sao biết người nào là người nào qua từng khung, và họ đang đi đâu?",
    "analogy": "Detector giống người có trí nhớ cá vàng: mỗi khung hình nhìn thế giới như lần đầu. Tracker đặt cho mỗi người một số áo (ID) và nhớ họ đã đi đâu. Khung tiếp theo, tracker đoán mỗi người sẽ ở đâu, rồi ghép người mới thấy với số áo phù hợp nhất.",
    "why": "Có ID thì mới có lịch sử, vận tốc, hướng đi để dự đoán quỹ đạo và lập kế hoạch: pipeline xe tự lái là cảm biến → detection → tracking → dự đoán → lập kế hoạch. Năm 2018 (Tempe, Arizona), một xe thử nghiệm phát hiện người dắt xe đạp từ 5,2 giây trước va chạm, nhưng mỗi lần nhãn đổi (Other → Vehicle → Bicycle → Unknown) phần mềm coi là một vật mới và xoá lịch sử chuyển động.",
    "steps": [
      "Mỗi khung: detector cho các hộp (detect).",
      "Mỗi track cũ dự đoán vị trí mới bằng Kalman (predict).",
      "Ghép track với hộp mới bằng bảng chi phí và Hungarian (associate).",
      "Cập nhật track đã ghép, tạo track mới, xoá track mất quá lâu (update).",
      "Chọn tracker theo hoàn cảnh: SORT, DeepSORT, ByteTrack, OC-SORT, BoT-SORT…",
      "Đo chất lượng bằng MOTA, IDF1, HOTA, và hiểu mỗi metric \"thích\" tracker nào."
    ],
    "concepts": [
      {
        "t": "Detection vs tracking (phát hiện và theo dõi)",
        "en": "có gì, ở đâu → là ai, đi đâu",
        "d": "Detection trả lời \"có gì, ở đâu\" cho từng khung riêng lẻ. Tracking trả lời thêm \"là ai, đang đi đâu\" bằng cách gắn một ID ổn định xuyên các khung. Có ID mới có lịch sử: vận tốc, hướng đi, thời gian xuất hiện.",
        "ex": "Cùng một video: detector báo \"3 người\" ở mọi khung; tracker biết người số 2 đang đi sang phải với 1,2 m/s."
      },
      {
        "t": "Tracking-by-detection (theo dõi dựa trên phát hiện)",
        "en": "detect → predict → associate → update",
        "d": "Cách phổ biến nhất: dùng detector có sẵn, tracker chỉ lo ghép hộp qua các khung theo vòng lặp bốn bước. Tracker không thể tốt hơn detector.",
        "ex": "Một khung có 3 track cũ và 4 hộp mới: ghép được 3 cặp, hộp thừa sinh một track mới ở trạng thái thử.",
        "fig": "track-loop",
        "figCap": "Bốn bước lặp lại ở mỗi khung; bước ghép (associate) là nơi các thuật toán khác nhau nhiều nhất."
      },
      {
        "t": "Predict with Kalman (dự đoán bằng Kalman)",
        "en": "giả định vận tốc không đổi",
        "d": "Mỗi track dùng bộ lọc Kalman (Day 20) đẩy vị trí đi tiếp theo vận tốc cũ; độ bất định tăng dần khi không có hộp để cập nhật. Điểm yếu: lúc vật bị che mà rẽ, Kalman vẫn đi thẳng.",
        "ex": "Người đi sau cột rồi rẽ trái: dự đoán vẫn đi thẳng, khi người hiện ra thì hộp mới nằm lệch xa dự đoán."
      },
      {
        "t": "Track lifecycle (vòng đời một track)",
        "en": "tentative → confirmed → lost → removed",
        "d": "Track mới ở trạng thái thử (tentative), đủ min_hits khung thì xác nhận (confirmed), mất hộp thì sang lạc (lost), lạc quá track_buffer khung thì bị xoá (removed). Track đang lạc mà ghép lại được thì quay về confirmed với ID cũ.",
        "ex": "Bị che 18 khung với track_buffer = 30 → hiện lại vẫn giữ ID 1. Bị che 40 khung → track đã bị xoá, người hiện lại nhận ID mới.",
        "fig": "track-life",
        "figCap": "Hai tham số min_hits và track_buffer quyết định track sinh ra nhanh đến đâu và sống được bao lâu khi mất dấu."
      },
      {
        "t": "Cost matrix (bảng chi phí)",
        "en": "track dự đoán × hộp mới",
        "d": "Bảng điểm \"khác nhau bao nhiêu\" giữa mỗi track dự đoán và mỗi hộp mới. Có thể dựa vào chồng lấn (IoU), chuyển động (Mahalanobis) hoặc ngoại hình (Re-ID); thường là tổng có trọng số của vài thước đo.",
        "ex": "SORT dùng chi phí = 1 − IoU; DeepSORT trộn Mahalanobis với độ giống ngoại hình."
      },
      {
        "t": "IoU and its limits (IoU và giới hạn)",
        "en": "IoU · GIoU · DIoU · CIoU",
        "d": "IoU = phần giao / phần hợp của hai hộp: rẻ, không cần huấn luyện. Nhưng hai hộp không chạm nhau thì IoU = 0, dù là cùng một vật đang chạy nhanh hoặc fps thấp. GIoU, DIoU, CIoU phân biệt được \"gần\" và \"xa\" khi IoU = 0, chủ yếu dùng làm hàm mất mát khi huấn luyện detector.",
        "ex": "Hai hộp mỗi hộp 12 ô, giao 4 ô: IoU = 4 / (12 + 12 − 4) = 0,20. Vật nhỏ ở xa, fps thấp: dịch chuyển lớn hơn bề rộng hộp → IoU = 0, nên dùng khoảng cách tâm."
      },
      {
        "t": "Motion gating (Mahalanobis)",
        "en": "tin dự đoán đến đâu thì chấp nhận đến đó",
        "d": "Kalman không chỉ cho một điểm dự đoán mà cho cả vùng bất định. Khoảng cách Mahalanobis chia khoảng cách theo độ bất định đó: hướng nào đang chắc thì vùng chấp nhận hẹp, hướng nào chưa chắc thì rộng. Cặp vượt ngưỡng bị loại trước khi ghép.",
        "ex": "DeepSORT loại cặp có d² > 9,4877 (ngưỡng chi-square 95% với 4 bậc tự do). Điểm yếu: vật rẽ gấp hay đổi tốc độ đột ngột thì vùng dự đoán sai.",
        "fig": "mahalanobis",
        "figCap": "Vòng tròn coi mọi hướng như nhau nên nhận nhầm D2; elip biết hướng dọc đang chắc nên loại D2 và giữ D1."
      },
      {
        "t": "Re-ID (nhận lại theo ngoại hình)",
        "en": "appearance embedding · OSNet · BoT",
        "d": "Một mạng CNN nén ảnh mỗi người thành một vector \"dấu vân ngoại hình\"; cùng người thì vector gần nhau (cosine cao). Cứu được khi vật biến mất rồi quay lại hoặc đổi camera, nhưng tốn tính toán và vô dụng khi mọi người trông giống hệt nhau.",
        "ex": "OSNet khoảng 2,2 triệu tham số, chạy được trên CPU (mặc định khi bật Re-ID trong Ultralytics); BoT baseline (ResNet-50) khoảng 24 triệu tham số, chính xác hơn nhưng cần GPU."
      },
      {
        "t": "Hungarian vs greedy (ghép tối ưu và ghép tham lam)",
        "en": "tổng chi phí nhỏ nhất · O(n³)",
        "d": "Ghép tham lam chọn cặp rẻ nhất trước rồi khoá hàng và cột: nhanh nhưng lựa chọn đầu \"ngon\" có thể kéo theo cặp cuối rất tệ. Hungarian (Kuhn–Munkres) tìm cách ghép một–một có tổng chi phí nhỏ nhất. Chọn xong vẫn loại cặp có chi phí vượt ngưỡng.",
        "ex": "Bảng [[1, 2, 6], [2, 8, 7], [6, 7, 3]]: tham lam ra 1 + 3 + 8 = 12, Hungarian ra 2 + 2 + 3 = 7. Trong Python: scipy.optimize.linear_sum_assignment."
      },
      {
        "t": "SORT → DeepSORT",
        "en": "motion + IoU → thêm ngoại hình",
        "d": "SORT (2016): Kalman + Hungarian trên 1 − IoU, cực nhẹ, nhưng mất ID khi bị che quá vài khung. DeepSORT (2017): thêm Re-ID và Mahalanobis, và \"matching cascade\" ưu tiên ghép track vừa mất trước, track mất lâu sau, vì dự đoán của track mất lâu kém tin cậy.",
        "ex": "Paper DeepSORT báo giảm khoảng 45% số lần đổi ID so với SORT. SORT hợp cảnh thưa, camera tĩnh; DeepSORT hợp an ninh, bán lẻ hay bị che."
      },
      {
        "t": "ByteTrack",
        "en": "đừng vứt hộp điểm thấp",
        "d": "Người bị che thường vẫn được thấy nhưng điểm tin cậy tụt. ByteTrack ghép hai vòng: vòng 1 dùng hộp điểm cao cho mọi track; vòng 2 dùng hộp điểm thấp cho các track chưa ghép được. Hộp điểm thấp không bao giờ tạo track mới.",
        "ex": "Không cần Re-ID nên vẫn rất nhanh; hợp camera cố định, đông người, hay bị kệ hàng che. Thử ở mô phỏng \"ByteTrack\"."
      },
      {
        "t": "OC-SORT",
        "en": "sửa Kalman khi bị che rồi đổi hướng",
        "d": "Khi tìm lại vật sau lúc bị che, OC-SORT dựng một quỹ đạo ảo giữa hai lần quan sát thật gần nhất để cập nhật lại trạng thái, cộng ràng buộc hướng đi. Không cần Re-ID, nhanh gần bằng SORT.",
        "ex": "Hợp chuyển động phi tuyến: thể thao, người nhảy múa. Vẫn không cứu được hai vật giống hệt đi sát nhau."
      },
      {
        "t": "BoT-SORT & StrongSORT",
        "en": "bù chuyển động camera · cộng dồn bản vá",
        "d": "BoT-SORT ước lượng chuyển động của chính camera (optical flow/ECC) rồi trừ vào dự đoán, để vật đứng yên không bị tưởng là đang chạy. StrongSORT nâng từng mắt xích của DeepSORT (trộn embedding mượt hơn, Kalman tin theo score, bù camera, nối track offline).",
        "ex": "Camera gắn xe, drone → BoT-SORT. StrongSORT với AFLink/GSI chạy offline, hợp phân tích video sau khi quay."
      },
      {
        "t": "Joint & end-to-end trackers (học luôn việc theo dõi)",
        "en": "FairMOT · CenterTrack · MOTR · SAM 2/3",
        "d": "Thay vì detector rồi tracker: FairMOT dùng một mạng xuất cả hộp lẫn embedding; CenterTrack dự đoán dịch chuyển tâm giữa hai khung; MOTR giữ mỗi vật là một \"track query\" của transformer; SAM 2/3 bám theo mask từ một điểm hay một mô tả chữ.",
        "ex": "Thực tế sản xuất: tracking-by-detection vẫn là \"ngựa thồ\" vì rẻ, dễ debug, tách được lỗi do detector hay do tracker. SAM 2/3 rất mạnh để tạo nhãn video nhanh."
      },
      {
        "t": "Error types (các loại lỗi)",
        "en": "FN · FP · ID switch · fragmentation",
        "d": "Bỏ sót (FN): có vật thật mà không có hộp. Hộp ma (FP): có hộp ở chỗ không có gì. Đổi ID (ID switch): hai người giao nhau và nhãn bị hoán đổi. Phân mảnh (fragmentation): một quỹ đạo bị cắt thành nhiều đoạn.",
        "ex": "ID switch là lỗi quan trọng nhất với bài toán quỹ đạo: quỹ đạo dự đoán nhảy lung tung, xe phanh gấp hoặc không phanh."
      },
      {
        "t": "MOTA vs IDF1 vs HOTA",
        "en": "mỗi metric \"thích\" một kiểu tracker",
        "d": "MOTA = 1 − (FN + FP + IDSW) / GT: mỗi lần đổi ID chỉ tính một lỗi nên chủ yếu phản ánh detector. IDF1 ghép mỗi người thật với đúng một ID cho cả video nên phạt nặng việc chia đôi danh tính. HOTA = √(DetA × AssA) cân bằng phát hiện và giữ ID, là metric chính của MOT Challenge.",
        "ex": "Minh hoạ trong slide: tracker A (detector rất tốt, ID hay đổi) có MOTA 82 nhưng IDF1 61; tracker B (ID ổn định) có MOTA 68 nhưng IDF1 74, HOTA 72. Đếm vật mỗi khung thì A đủ; dự đoán quỹ đạo thì cần B."
      }
    ],
    "formulas": [
      {
        "tex": "\\mathrm{IoU} = \\dfrac{|A \\cap B|}{|A \\cup B|}",
        "read": "Phần giao chia phần hợp của hai hộp.",
        "ex": "Giao 4 ô, mỗi hộp 12 ô: 4 / 20 = 0,20."
      },
      {
        "tex": "c_{ij} = 1 - \\mathrm{IoU}(T_i, D_j)",
        "read": "Chi phí ghép track i với hộp j = 1 trừ độ chồng lấn.",
        "ex": "Chồng khít → chi phí gần 0."
      },
      {
        "tex": "\\mathrm{GIoU} = \\mathrm{IoU} - \\dfrac{|C \\setminus (A \\cup B)|}{|C|}",
        "read": "C là hộp nhỏ nhất bao cả hai; phần thừa của C càng lớn (hai hộp càng xa) thì điểm càng âm.",
        "ex": "Hai hộp rời nhau: IoU = 0 cho cả trường hợp gần lẫn xa, GIoU thì phân biệt được."
      },
      {
        "tex": "d^2 = (x-\\mu)^{\\top}\\,\\Sigma^{-1}\\,(x-\\mu)",
        "read": "Khoảng cách Mahalanobis: khoảng cách đã chia theo độ không chắc của dự đoán, nên hướng nào chắc thì vùng chấp nhận hẹp.",
        "ex": "DeepSORT loại cặp có d² > 9,4877."
      },
      {
        "tex": "\\cos\\theta = \\dfrac{u \\cdot v}{\\|u\\|\\,\\|v\\|}",
        "read": "Độ giống ngoại hình giữa hai vector Re-ID.",
        "ex": "Cùng người ≈ 0,9; người khác ≈ 0,2."
      },
      {
        "tex": "\\mathrm{MOTA} = 1 - \\dfrac{\\mathrm{FN} + \\mathrm{FP} + \\mathrm{IDSW}}{\\mathrm{GT}}",
        "read": "Độ chính xác = 1 trừ (bỏ sót + báo nhầm + đổi ID) chia tổng số vật thật. Có thể âm khi lỗi nhiều hơn số vật.",
        "ex": "1 000 vật thật, 100 + 50 + 30 lỗi → 82%."
      },
      {
        "tex": "\\mathrm{IDF1} = \\dfrac{2\\,\\mathrm{IDTP}}{2\\,\\mathrm{IDTP} + \\mathrm{IDFN} + \\mathrm{IDFP}}",
        "read": "Đo mức giữ đúng một ID cho mỗi người suốt video.",
        "ex": "Một người, 6 khung ID 1 rồi 4 khung ID 2: IDF1 60%, trong khi MOTA 90%. Thử ở mô phỏng."
      },
      {
        "tex": "\\mathrm{HOTA} = \\sqrt{\\mathrm{DetA} \\times \\mathrm{AssA}}",
        "read": "Trung bình nhân của \"phát hiện tốt\" và \"giữ ID tốt\", tính ở nhiều ngưỡng IoU α rồi lấy trung bình; một bên tệ kéo cả điểm xuống.",
        "ex": "10 TP, 2 FN, 1 FP → DetA ≈ 77%; 8/10 cặp giữ đúng ID → AssA ≈ 80% → HOTA ≈ 78%."
      }
    ],
    "table": {
      "title": "Chọn tracker theo hoàn cảnh",
      "cols": [
        "Hoàn cảnh",
        "Tracker",
        "Vì sao"
      ],
      "rows": [
        [
          "Camera cố định, đông người, hay bị che (bán lẻ)",
          "ByteTrack",
          "Giữ track bằng hộp điểm thấp, không cần bù camera"
        ],
        [
          "Camera gắn xe hoặc drone",
          "BoT-SORT (± Re-ID)",
          "Bù chuyển động camera"
        ],
        [
          "Thể thao: đồng phục, đổi hướng gấp",
          "OC-SORT + Re-ID số áo",
          "Xử lý chuyển động phi tuyến"
        ],
        [
          "Nhiều camera an ninh",
          "StrongSORT / DeepSORT",
          "Re-ID mạnh để nhận lại người"
        ],
        [
          "Kho vận, robot AMR: ít vật, cần realtime",
          "SORT",
          "Đơn giản, rất nhanh"
        ],
        [
          "Drone bám theo một người",
          "Tracker SOT (KCF, SiamFC…)",
          "Bài toán một đối tượng, họ khác"
        ]
      ]
    },
    "traps": [
      "IoU = 0 khi vật chạy nhanh hoặc fps thấp, dù vẫn là cùng một vật.",
      "Hungarian chọn xong vẫn loại cặp có chi phí vượt ngưỡng: track đó sang Lost, hộp thừa sinh track mới.",
      "Hạ ngưỡng điểm để khỏi mất người bị che thì hộp báo nhầm cũng thành track; ByteTrack giải quyết bằng vòng ghép thứ hai.",
      "StrongSORT với AFLink/GSI chạy offline, không hợp ứng dụng tức thời.",
      "MOTA cao chưa chắc giữ ID tốt; đọc thêm IDF1 và HOTA.",
      "Nhãn đáp án (ground truth) sai thì điểm cũng sai theo: một lỗi đổi ID trong GT làm tracker hoàn hảo cũng bị trừ IDF1."
    ],
    "remember": [
      "Tracking = detection + trí nhớ: dự đoán, ghép, cập nhật.",
      "Các tracker khác nhau ở bảng chi phí chứa gì và khi nào tin tín hiệu nào.",
      "MOTA thiên về phát hiện; IDF1, HOTA nhạy với việc giữ ID."
    ],
    "cards": [
      [
        "Bốn bước của tracking-by-detection?",
        "Detect → predict → associate → update."
      ],
      [
        "IoU của hai hộp không chạm nhau?",
        "Bằng 0, dù hai hộp gần hay xa."
      ],
      [
        "DeepSORT ưu tiên ghép track nào trước?",
        "Track vừa mới mất, vì dự đoán của track mất lâu kém tin cậy."
      ],
      [
        "Hộp điểm thấp trong ByteTrack có tạo track mới không?",
        "Không, chỉ dùng để giữ track đã có."
      ],
      [
        "Tracker nào không dùng Re-ID: SORT, DeepSORT, ByteTrack, OC-SORT?",
        "SORT, ByteTrack và OC-SORT."
      ],
      [
        "Detector rất tốt nhưng ID hay đổi: metric nào chấm cao?",
        "MOTA. IDF1 và HOTA sẽ chấm thấp."
      ],
      [
        "Vì sao dùng Hungarian thay vì ghép tham lam?",
        "Để tổng chi phí nhỏ nhất, không bị cặp cuối rất tệ."
      ],
      [
        "Vật bị che lâu hơn track_buffer thì sao?",
        "Track bị xoá, vật hiện lại nhận ID mới; cần Re-ID để nối lại."
      ],
      [
        "Camera gắn xe, vật đứng yên bị tưởng đang chạy: sửa bằng gì?",
        "Bù chuyển động camera (GMC) như BoT-SORT."
      ]
    ]
  },
  {
    "id": "day23",
    "part": 23,
    "n": 23,
    "title": "3D, BEV & Sensor fusion",
    "question": "Chỉ có ảnh phẳng, làm sao biết vật cách bao nhiêu mét? Và khi nào phải nhờ LiDAR, radar, gộp chúng thế nào cho đúng?",
    "analogy": "Nhìn một chiếc xe trong ảnh, bạn đoán nó xa vì nó nhỏ và gần đường chân trời. Máy tính cũng phải đoán như vậy, vì camera làm mất độ sâu. LiDAR là thước đo khoảng cách bằng laser, radar là \"súng bắn tốc độ\". Mỗi giác quan có điểm mù riêng; ba manh mối yếu hợp lại thành một kết luận chắc chắn.",
    "why": "Xe tự lái lập kế hoạch trên mặt đường theo mét, không theo pixel. BEV (nhìn từ trên xuống) là không gian chung cho mọi camera và cảm biến, còn fusion quyết định xe có thấy người đi bộ khuất sau xe tải trong đêm mưa hay không. Nó dùng lại Kalman/EKF (Day 20) và ghép dữ liệu (Day 22).",
    "steps": [
      "Hiểu vì sao một pixel là cả một tia: camera mất độ sâu.",
      "Detector 3D đơn ảnh đoán lại độ sâu rồi giải mã ngược về toạ độ 3D bằng K⁻¹.",
      "Đưa nhiều camera lên một bản đồ nhìn từ trên xuống (BEV): bottom-up hoặc top-down.",
      "Hiệu chuẩn và đồng bộ thời gian giữa các cảm biến.",
      "Chọn tầng hợp nhất (early/mid/late) và thứ tự với tracking (track-then-fuse hay fuse-then-track).",
      "Ghép phép đo với track (gating, Hungarian) rồi cập nhật bằng EKF, mỗi cảm biến một cặp (h, R)."
    ],
    "concepts": [
      {
        "t": "Depth ambiguity (một pixel là cả một tia)",
        "en": "camera mất độ sâu khi chiếu",
        "d": "Mọi điểm nằm trên cùng một tia nhìn đều rơi vào cùng một pixel, nên chỉ từ một ảnh không biết vật nằm đâu trên tia đó. Muốn biết phải thêm thông tin: kích thước đã biết của vật, chỗ vật chạm đất, hai góc nhìn (stereo, chuyển động) hoặc một cảm biến đo trực tiếp (LiDAR, radar).",
        "ex": "Một hộp chiếm đúng một chỗ trong ảnh: nếu nó ở 45 m thì rộng 1,8 m, nhiều khả năng là một xe hơi; ở 10 m thì chỉ là một vật nhỏ.",
        "fig": "pixel-ray",
        "figCap": "Ba vật khác kích thước, khác độ sâu nhưng cùng nằm trên một tia nên cho cùng một pixel."
      },
      {
        "t": "Pinhole projection & K⁻¹ (chiếu và giải mã ngược)",
        "en": "pixel = K · điểm 3D trong hệ camera",
        "d": "Camera chiếu điểm 3D (X, Y, Z) thành pixel bằng cách chia cho độ sâu Z rồi nhân tiêu cự, cộng tâm ảnh (ma trận K). Đi ngược: biết pixel (u, v) và đoán được z thì tính lại điểm 3D bằng z · K⁻¹ · [u, v, 1]. Đây là bước cuối của mọi detector 3D từ camera.",
        "ex": "K, R, t do bộ dữ liệu (KITTI, nuScenes, Waymo) cung cấp sẵn; người dùng dataset không cần tự hiệu chuẩn."
      },
      {
        "t": "3D box from an image (hộp 3D từ ảnh)",
        "en": "x, y, z · w, l, h · yaw θ",
        "d": "Hộp 3D có bảy tham số: tâm, ba kích thước (gần như cố định theo loại xe) và góc hướng. Khó nhất là độ sâu z và góc θ. Hình dạng xe trong ảnh phụ thuộc góc nhìn tới xe α chứ không phụ thuộc θ, nên mạng dự đoán α rồi đổi θ = α + arctan(x/z).",
        "ex": "Xe ở X = −3 m, Z = 18 m, θ = 35° → α = θ − arctan(X/Z) ≈ 44°."
      },
      {
        "t": "Ground contact (đặt chân xuống mặt đường)",
        "en": "Z = f · h / (v − c_y)",
        "d": "Nếu xe đứng trên mặt đường phẳng, hàng pixel của chân xe cho ra khoảng cách. Gần đường chân trời, lệch 1 pixel đổi hàng chục mét; đường dốc hay xe nhún làm công thức sai.",
        "ex": "h = 1,65 m, f = 720, chân xe 40 px dưới chân trời → 29,7 m; lệch 1 px → 29,0 … 30,5 m. Thử ở mô phỏng."
      },
      {
        "t": "Monocular 3D detector (detector 3D đơn ảnh)",
        "en": "SMOKE · FCOS3D · MonoFlex · CaDDN",
        "d": "Khung chung: ảnh → backbone + FPN → các \"đầu\" dự đoán heatmap tâm 3D, độ lệch tâm, độ sâu z, kích thước, hướng (sin α, cos α) → giải mã bằng K⁻¹. SMOKE bỏ hộp 2D; FCOS3D cho mỗi pixel dự đoán tất cả; MonoFlex xử lý riêng vật bị cắt biên và trộn nhiều ước lượng độ sâu; CaDDN dự đoán phân phối độ sâu rồi dựng BEV.",
        "ex": "Phần lớn sai số của mono 3D đến từ định vị (chủ yếu độ sâu), không phải phân loại: động lực để chuyển sang nhiều camera và BEV."
      },
      {
        "t": "Uncertainty-weighted depth loss (loss độ sâu có độ bất định)",
        "en": "L = |z − ẑ| / σ + log σ",
        "d": "Mỗi đầu ra có loss riêng: heatmap dùng focal loss (đa số pixel là nền), kích thước dùng L1, hướng dùng sin/cos hoặc chia cung để tránh nhảy ở 0°/360°. Riêng độ sâu, mạng đoán thêm độ bất định σ: vật khó (xa, bị che) tự được giảm phạt, còn log σ ngăn mạng đặt σ vô hạn.",
        "ex": "Lý do FCOS3D, MonoFlex, PGD chính xác hơn hẳn các bản đầu: mạng học được lúc nào nên tự tin."
      },
      {
        "t": "3D detection metrics (đo detector 3D)",
        "en": "KITTI AP₃D · nuScenes NDS · Waymo LET-3D-AP",
        "d": "KITTI ghép theo IoU 3D (xe: ngưỡng 0,7) nên rất khắt khe: lệch vài chục cm là mất điểm. nuScenes ghép theo khoảng cách tâm (0,5 / 1 / 2 / 4 m) và cộng năm sai số ATE, ASE, AOE, AVE, AAE thành NDS. Waymo có LET-3D-AP khoan dung sai số theo phương dọc vì đó là lỗi vốn có của camera.",
        "ex": "NDS nuScenes theo công bố gốc: FCOS3D 42,8 → BEVFormer 56,9 → CenterPoint (LiDAR) 65,5 → BEVFusion (camera + LiDAR) 72,9."
      },
      {
        "t": "BEV (bird's-eye view, nhìn từ trên xuống)",
        "en": "không gian chung cho mọi camera, cảm biến",
        "d": "Bản đồ nhìn từ trên xuống quanh xe. Trên ảnh, xe xa nhỏ và méo; trên BEV, xe có đúng kích thước và vị trí trên mặt đường. Mọi camera, cảm biến và nhiều tác vụ (hộp, làn, bản đồ) dùng chung một bản đồ đặc trưng; lập kế hoạch cũng làm việc trên mặt đất.",
        "ex": "Sáu camera kiểu nuScenes phủ kín 360°; BEVFormer dùng lưới khoảng 200 × 200 ô, mỗi ô 0,5 m, phủ ±51 m quanh xe.",
        "fig": "persp-vs-bev",
        "figCap": "Cùng hai chiếc xe: trong ảnh phối cảnh xe xa nhỏ và làn đường hội tụ; trên BEV hai xe cùng kích thước, làn song song."
      },
      {
        "t": "Bottom-up: lift-splat (LSS, BEVDepth)",
        "en": "đoán độ sâu từng pixel rồi rải lên BEV",
        "d": "Mỗi pixel được \"nâng\" thành một phân phối trên nhiều mức độ sâu dọc tia của nó, đặc trưng được rải (splat) vào các ô BEV theo trọng số đó. Hình học rõ ràng, dễ debug theo độ sâu, nhưng phụ thuộc chất lượng độ sâu: đoán không chắc thì đặc trưng bị nhoè dọc tia.",
        "ex": "BEVDepth giám sát độ sâu bằng LiDAR lúc huấn luyện để phân phối độ sâu sắc nét hơn. Thử ở mô phỏng \"Lift-splat\"."
      },
      {
        "t": "Top-down: queries (DETR3D, BEVFormer, PETR)",
        "en": "từ BEV / query hỏi ngược vào ảnh",
        "d": "DETR3D: mỗi object query đoán một điểm 3D, chiếu điểm đó vào camera nào nhìn thấy nó, lấy đặc trưng tại pixel đó, cập nhật query, lặp 6 lớp; huấn luyện bằng ghép Hungarian nên không cần NMS. BEVFormer: mỗi ô BEV chiếu điểm 3D của nó vào ảnh và attend vào đó, thêm attention với BEV khung trước. PETR: cộng mã vị trí 3D vào đặc trưng ảnh, không cần chiếu.",
        "ex": "Hướng gần đây: sparse query + nhiều khung (StreamPETR, Sparse4D) để nhẹ hơn BEV dày mà vẫn mạnh."
      },
      {
        "t": "Temporal BEV & occupancy (BEV theo thời gian và lưới chiếm chỗ)",
        "en": "nhớ qua khung · ô 3D trống hay đặc",
        "d": "Temporal: dịch BEV khung trước theo chuyển động của xe rồi gộp với BEV hiện tại để ước lượng vận tốc, nhớ vật bị che tạm thời, giảm nhiễu độ sâu. Occupancy: thay vì hộp, dự đoán mỗi voxel trống hay đặc kèm lớp, xử lý được vật hình dạng bất kỳ và không cần biết trước loại vật để \"không đâm\".",
        "ex": "Xe đổ, cần cẩu, đống rác không có hộp chuẩn nhưng vẫn chiếm chỗ. Tesla giới thiệu Occupancy Network năm 2022; học thuật có Occ3D, SurroundOcc."
      },
      {
        "t": "Camera vs LiDAR vs radar (mỗi loại giỏi một thứ)",
        "en": "ngữ nghĩa · hình học · vận tốc",
        "d": "Camera giỏi loại vật, biển báo, góc ngang, rẻ; kém độ sâu, tối, chói. LiDAR đo khoảng cách trực tiếp bằng thời gian bay laser, hình dạng chi tiết; thưa dần theo khoảng cách, kém trong sương mưa. Radar đo khoảng cách và vận tốc, tầm xa trên 200 m, xuyên mưa sương, rẻ; phân giải góc thấp, nhiễu do lan can và đa đường.",
        "ex": "Đêm mưa, người đi bộ khuất sau xe tải: camera gần như không thấy người, LiDAR chỉ còn vài điểm thưa, radar thấy tín hiệu yếu; ghép lại thì kết luận chắc chắn có người."
      },
      {
        "t": "Radar Doppler (radar chỉ thấy một nửa vận tốc)",
        "en": "chỉ thành phần dọc tia nhìn",
        "d": "Hiệu ứng Doppler chỉ đo thành phần vận tốc dọc theo tia nhìn từ radar tới vật (vận tốc hướng tâm). Thành phần vuông góc với tia nhìn thì radar không thấy. Xe chạy ngang qua trục nhìn cho Doppler gần 0.",
        "ex": "Xe ở góc 25°, chạy hướng 100°, 15 m/s: radar đo +3,9 m/s (đang ra xa) và không thấy 14,5 m/s còn lại. Thử ở mô phỏng."
      },
      {
        "t": "Calibration for each sensor (hiệu chuẩn từng cảm biến)",
        "en": "intrinsic · extrinsic · hand-eye AX = XB",
        "d": "Mọi cảm biến đều có intrinsic (tự nó đo lệch bao nhiêu, không đổi khi tháo lắp) và extrinsic (đặt ở đâu, hướng nào so với xe). Camera: K và méo ống kính, đo bằng bàn cờ (phương pháp Zhang); LiDAR: bảng hiệu chỉnh từng tia; radar: mảng ăng-ten; IMU: bias và hệ số tỷ lệ; IMU, GNSS: lever arm tới tâm xe. Hai cảm biến gắn cứng thì giải AX = XB từ nhiều chuyển động.",
        "ex": "Chỉ lệch 4° extrinsic là mọi điểm LiDAR trượt khỏi vật trên ảnh. Trên xe thật hiệu chuẩn trôi theo thời gian nên cần hiệu chuẩn lại trực tuyến."
      },
      {
        "t": "Time synchronization (đồng bộ thời gian)",
        "en": "PTP trigger · timestamp + cửa sổ · bù chuyển động",
        "d": "Hiệu chuẩn trả lời \"ở đâu\", đồng bộ trả lời \"lúc nào\". LiDAR quét một vòng mất khoảng 100 ms nên điểm phía trước và phía sau không cùng thời điểm. Ba cách: kích chụp phần cứng theo đồng hồ chung (PTP, GPS PPS); gắn timestamp mềm rồi ghép cặp gần nhất trong cửa sổ dung sai (ví dụ ±50 ms); dùng IMU/odometry nội suy về một mốc chung (deskew).",
        "ex": "Trong EKF, bước predict chính là công cụ ngoại suy trạng thái tới đúng timestamp của phép đo mới; dt không cần đều giữa các cảm biến."
      },
      {
        "t": "Early / mid / late fusion (hợp nhất ở tầng nào)",
        "en": "dữ liệu thô · đặc trưng · hộp / track",
        "d": "Early: gộp dữ liệu thô trước mọi mạng, giữ nhiều thông tin nhất nhưng cần hiệu chuẩn, đồng bộ cực chuẩn và một cảm biến hỏng làm hỏng cả đầu vào. Mid: mỗi cảm biến tự rút đặc trưng (thường trên BEV) rồi gộp, cân bằng nhất, là xu hướng chính (BEVFusion). Late: mỗi cảm biến tự ra hộp rồi hợp nhất, độc lập, dễ debug, nhưng nếu cả hai chỉ \"hơi thấy\" một vật thì khó cứu.",
        "ex": "Early: \"sơn\" mỗi điểm LiDAR bằng màu pixel nó chiếu tới. Late: detector camera và detector LiDAR chạy riêng, rồi Kalman/EKF hợp nhất các hộp.",
        "fig": "fusion-levels",
        "figCap": "Cùng hai cảm biến, ba chỗ cắt khác nhau trong pipeline."
      },
      {
        "t": "Track-then-fuse vs fuse-then-track (hợp nhất trước hay theo dõi trước)",
        "en": "trục thiết kế thứ hai, độc lập với early/mid/late",
        "d": "Track-then-fuse: mỗi vật chỉ có một track (x, P); mỗi phép đo mới, từ cảm biến nào cũng được, lần lượt predict rồi update với (h, R) của cảm biến đó. Fuse-then-track: gộp phép đo các cảm biến thành một z duy nhất trước, tracker chỉ update một lần, cần tự thiết kế \"hàm gộp\" và rất nhạy lệch đồng bộ. Ô tô sản xuất còn có track-to-track: mỗi ECU cảm biến tự theo dõi rồi ECU trung tâm ghép track.",
        "ex": "Lab Day 23 làm track-then-fuse (LiDAR rồi camera lần lượt update một EKF). PointPainting, BEVFusion là fuse-then-track.",
        "fig": "track-fuse",
        "figCap": "Nhìn vào bước update: nhiều update lần lượt là track-then-fuse; gộp thành một z trước khi update là fuse-then-track."
      },
      {
        "t": "Multi-sensor EKF (EKF nhiều cảm biến)",
        "en": "một trạng thái, mỗi cảm biến một cặp (h, R)",
        "d": "Track giữ trạng thái chung [vị trí; vận tốc]. Mỗi cảm biến có mô hình đo h(x) riêng: LiDAR đo vị trí (tuyến tính), camera đo pixel (chia cho khoảng cách, phi tuyến), radar đo khoảng cách, góc, tốc độ hướng tâm (phi tuyến). Phi tuyến thì dùng Jacobian, tức độ dốc của h tại điểm dự đoán (EKF, Day 20).",
        "ex": "Ví dụ trong slide: xe cách 50 m. Update LiDAR (R = 0,25): K vị trí = 0,94, phương sai 4,02 → 0,24. Update camera đo độ rộng pixel ở 49 m: K chỉ −0,04 vì 1 px ở khoảng cách đó là hơn 1 m. LiDAR gánh gần hết việc định vị."
      },
      {
        "t": "Gating & data association (phép đo thuộc track nào)",
        "en": "gating · Hungarian · JPDA · MHT",
        "d": "Trước khi update phải biết phép đo thuộc track nào: vẽ vùng elip quanh dự đoán (d² = γᵀS⁻¹γ) và loại phép đo ngoài vùng; ghép 1–1 bằng Hungarian; quản lý vòng đời track. Khi hai vật sát nhau, JPDA trộn có trọng số mọi phép đo trong vùng theo xác suất, MHT giữ nhiều kịch bản ghép song song vài khung rồi mới chốt.",
        "ex": "Ngưỡng 95% với 2 bậc tự do: d² ≤ 5,99. Phép đo d² = 0,2; 1,0; 4,1 được giữ; 9,8; 14,5; 16,0 bị loại ngay."
      },
      {
        "t": "Ego localization fusion (hợp nhất để biết mình ở đâu)",
        "en": "GNSS + IMU + odometry",
        "d": "GNSS cho vị trí tuyệt đối nhưng nhiễu (±1 đến vài m), chậm (1–10 Hz), mất trong hầm. IMU chạy hàng trăm Hz nhưng tích phân làm sai số lớn dần. Kalman lấy điểm mạnh của cả hai: trong hầm chỉ trôi nhẹ, có tín hiệu lại thì kéo về.",
        "ex": "Robot kho, drone, xe tự lái đều chạy một bộ EKF hoặc SLAM như vậy ở bên dưới."
      },
      {
        "t": "Fusion failure modes (fusion hỏng ở đâu)",
        "en": "drift · lệch thời gian · phụ thuộc một cảm biến · chiếu nhầm",
        "d": "Hiệu chuẩn trôi do rung; lệch thời gian làm vật đang chạy lệch chỗ; cảm biến suy giảm (bẩn, sương, bề mặt tối bóng); mô hình quen dựa vào LiDAR, tắt LiDAR là sụp (chữa bằng modality dropout khi huấn luyện); điểm LiDAR phía sau vật che vẫn rơi vào pixel của vật che; cổng ghép quá rộng ghép nhầm, quá hẹp bỏ sót.",
        "ex": "Ca 2016 (Florida): theo giải thích của hãng xe, camera không phân biệt được mặt hông trắng của xe đầu kéo với nền trời sáng. Một luật lọc nhiễu hợp lý ở tình huống này có thể sai chết người ở tình huống khác, nên cần gating cẩn trọng thay vì luật cứng theo từng cảm biến."
      },
      {
        "t": "Latency budget (ngân sách độ trễ)",
        "en": "mỗi 100 ms ở 50 km/h là 1,4 m",
        "d": "Mô hình giỏi mà chậm vẫn có thể khiến xe không kịp phanh. Perception chỉ có ngân sách khoảng 50–100 ms; BEV dày, backbone lớn phải giảm bằng quantization, TensorRT, sparse; đồng bộ nhiều cảm biến cũng tốn thời gian.",
        "ex": "Ví dụ trong slide: 50 km/h, trễ perception 120 ms + planning và phanh 150 ms → quãng dừng 19,8 m, còn cách người ở 40 m là 20,2 m."
      }
    ],
    "formulas": [
      {
        "tex": "u = f\\,\\dfrac{X}{Z} + c_x, \\qquad v = f\\,\\dfrac{Y}{Z} + c_y",
        "read": "Toạ độ pixel = tiêu cự × (toạ độ chia độ sâu) + tâm ảnh.",
        "ex": "Chia cho Z là lúc độ sâu biến mất."
      },
      {
        "tex": "\\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} = z\\,K^{-1}\\begin{bmatrix} u \\\\ v \\\\ 1 \\end{bmatrix}",
        "read": "Biết pixel và đoán được độ sâu z thì tính ngược ra điểm 3D bằng ma trận nghịch đảo của K.",
        "ex": "Bước cuối của mọi detector 3D từ camera."
      },
      {
        "tex": "Z = \\dfrac{f\\,h}{v - c_y}",
        "read": "Mẹo đặt chân xuống đường: khoảng cách = tiêu cự × độ cao camera chia khoảng cách từ chân vật tới đường chân trời (pixel).",
        "ex": "720 · 1,65 / 40 = 29,7 m; gần chân trời lệch 1 px là sai hàng chục mét."
      },
      {
        "tex": "\\theta = \\alpha + \\arctan\\dfrac{x}{z}",
        "read": "Góc hướng thật = góc nhìn tới xe + góc lệch của xe so với trục camera.",
        "ex": "Hình dạng xe trong ảnh phụ thuộc α, nên mạng dự đoán α rồi đổi ra θ."
      },
      {
        "tex": "\\mathcal{L}_z = \\dfrac{|z - \\hat z|}{\\sigma} + \\log\\sigma",
        "read": "Mạng tự đoán độ không chắc σ: vật khó (xa, bị che) được giảm phạt, nhưng log σ ngăn nó đặt σ vô hạn.",
        "ex": "Lý do FCOS3D, MonoFlex chính xác hơn bản đầu."
      },
      {
        "tex": "\\mathrm{NDS} = \\tfrac{1}{10}\\Bigl[\\,5\\,\\mathrm{mAP} + \\sum \\bigl(1 - \\min(1, \\mathrm{mTP})\\bigr)\\Bigr]",
        "read": "Điểm nuScenes = gộp \"tìm đúng\" (mAP) và năm loại sai số vị trí, kích thước, hướng, vận tốc, thuộc tính.",
        "ex": "FCOS3D 42,8 → BEVFusion 72,9."
      },
      {
        "tex": "v_r = v\\cos(\\psi - \\varphi)",
        "read": "Radar đo vận tốc hướng tâm = tốc độ × cos(góc giữa hướng chạy ψ và tia nhìn φ).",
        "ex": "v = 15 m/s, ψ = 100°, φ = 25°: 15 × cos 75° ≈ 3,9 m/s; phần 14,5 m/s vuông góc thì không thấy."
      },
      {
        "tex": "d^2 = \\gamma^{\\top} S^{-1} \\gamma \\le 5{,}99",
        "read": "Cổng gating: độ bất ngờ γ = z − h(x⁻) chia theo độ lớn kỳ vọng S; vượt ngưỡng chi-square 95% (2 bậc tự do) thì loại.",
        "ex": "d² = 4,1 giữ lại; d² = 9,8 loại."
      },
      {
        "tex": "\\dfrac{\\partial u}{\\partial p_y} = -\\dfrac{f}{p_x}",
        "read": "Jacobian của mô hình đo camera (u = c_u − f·p_y/p_x): độ nhạy của pixel theo vị trí ngang giảm khi vật ở xa.",
        "ex": "Vì vậy ở 49 m camera gần như không giúp định vị theo độ sâu."
      },
      {
        "tex": "s = v\\,t \\approx 13{,}9\\ \\tfrac{\\text{m}}{\\text{s}} \\times 0{,}1\\ \\text{s} \\approx 1{,}4\\ \\text{m}",
        "read": "Ở 50 km/h, mỗi 100 ms trễ xe đi thêm 1,4 m trước khi kịp phản ứng.",
        "ex": "Vì vậy perception chỉ có ngân sách ~50–100 ms."
      }
    ],
    "table": {
      "title": "Gộp ở tầng nào",
      "cols": [
        "Tầng",
        "Ưu điểm",
        "Nhược điểm"
      ],
      "rows": [
        [
          "Early: gộp dữ liệu thô",
          "Giữ nhiều thông tin nhất",
          "Cần hiệu chuẩn, đồng bộ cực chuẩn; một cảm biến hỏng làm hỏng cả đầu vào"
        ],
        [
          "Mid: gộp đặc trưng (thường trên BEV)",
          "Cân bằng nhất, xu hướng hiện nay",
          "Phải huấn luyện chung, tốn dữ liệu và tính toán"
        ],
        [
          "Late: gộp hộp / track",
          "Mỗi nhánh độc lập, dễ gỡ lỗi",
          "Mất thông tin thô; vật cả hai chỉ \"hơi thấy\" khó cứu"
        ]
      ]
    },
    "traps": [
      "Lỗi góc lắp đặt làm lệch mọi vật (xa càng tệ); lệch thời gian chỉ làm lệch vật đang chạy.",
      "Trục \"early/mid/late\" và trục \"track-then-fuse / fuse-then-track\" là hai chuyện độc lập.",
      "NMS cho hộp 3D phải dùng IoU của hình chữ nhật xoay theo yaw (BEV-IoU), không dùng IoU thẳng trục.",
      "Lật ảnh khi augmentation phải lật cả dấu của yaw và x; copy-paste vật phải scale đúng theo phối cảnh.",
      "Phụ thuộc một cảm biến: chữa bằng modality dropout khi huấn luyện.",
      "Báo cáo mô hình mà không nêu độ trễ là chưa đủ."
    ],
    "remember": [
      "Mọi detector 3D từ camera là một cách đoán lại độ sâu bị mất; sai số chủ yếu ở z.",
      "BEV là \"ngôn ngữ chung\" để gộp nhiều camera và cảm biến.",
      "Fusion chỉ đúng khi hiệu chuẩn và đồng bộ đúng; mỗi cảm biến chỉ cần một cặp (h, R)."
    ],
    "cards": [
      [
        "Intrinsic khác extrinsic thế nào?",
        "Intrinsic không đổi khi tháo lắp; extrinsic là vị trí, hướng lắp trên xe."
      ],
      [
        "Radar đo vận tốc thế nào và hạn chế gì?",
        "Bằng Doppler, chỉ thành phần dọc tia nhìn; xe chạy ngang đo gần 0."
      ],
      [
        "Occupancy hơn hộp 3D ở đâu?",
        "Xử lý vật hình dạng bất kỳ và không cần biết trước loại vật."
      ],
      [
        "Thêm cảm biến mới vào kiến trúc một track cần gì?",
        "Thêm một hàm đo h(x) và độ nhiễu R."
      ],
      [
        "Vì sao mid fusion là xu hướng chính?",
        "Đặc trưng từng cảm biến đã được làm sạch trước khi gộp nên bền với lỗi nhỏ."
      ],
      [
        "DETR3D lấy đặc trưng ảnh thế nào?",
        "Mỗi query đoán điểm 3D, chiếu vào camera nhìn thấy nó, lấy đặc trưng tại pixel đó, lặp 6 lớp."
      ],
      [
        "Lift-splat nhoè khi nào?",
        "Khi phân phối độ sâu dọc tia không chắc: đặc trưng bị rải ra nhiều ô."
      ],
      [
        "Khi hai xe sát nhau, thay Hungarian bằng gì?",
        "JPDA (trộn có trọng số) hoặc MHT (giữ nhiều kịch bản ghép)."
      ],
      [
        "Waymo và Tesla khác triết lý cảm biến thế nào?",
        "Waymo dùng nhiều camera + LiDAR + radar; Tesla dựa chủ yếu vào camera."
      ]
    ]
  },
  {
    "id": "day24",
    "part": 24,
    "n": 24,
    "title": "Data & Annotation",
    "question": "Xe ghi vài terabyte mỗi giờ. Làm sao biến đống đó thành một bộ dữ liệu sạch, có nhãn đúng, đủ tin để huấn luyện?",
    "analogy": "Hình dung một nhà máy lọc nước. Nước sông (dữ liệu thô) chảy qua nhiều bể: bể chứa nguyên bản, bể lọc sạch, bể nước uống được. Mỗi bể có trạm kiểm tra, bể nào bẩn thì dừng. Gán nhãn là bước \"dán tem chất lượng\", và tem chỉ có giá trị khi ai cũng hiểu cùng một quy tắc.",
    "why": "Mô hình chỉ giỏi bằng dữ liệu nó được xem, và pipeline quyết định dữ liệu đó là gì. Lỗi dữ liệu (định dạng hộp sai, mẫu test lọt vào train, nhãn không nhất quán) làm điểm số đẹp giả mà không báo lỗi. Hôm nay có dataset; Day 25 dùng VLM để gán nhãn và cần kiểm tra độc lập.",
    "steps": [
      "Dữ liệu đi qua năm chặng: sinh ra, nạp, lưu, biến đổi, phục vụ; bên dưới là điều phối, chất lượng, bảo mật.",
      "Lưu theo ba lớp Bronze → Silver → Gold trên lakehouse, ghép luồng theo event time, chạy lại an toàn.",
      "Kiểm chất lượng tự động ở mỗi lớp, ghi lineage và version cho dataset.",
      "Chọn dữ liệu đáng gán nhãn (trigger, tìm bằng câu chữ) và chia train/test theo cảnh.",
      "Viết guideline; để máy gán nhãn trước, định tuyến theo độ tin cậy, người kiểm và audit.",
      "Tìm nhãn sai, chọn mẫu chủ động, tự huấn luyện thầy–trò; luôn so với baseline ngẫu nhiên."
    ],
    "concepts": [
      {
        "t": "Data funnel (pipeline là phễu)",
        "en": "vài TB mỗi giờ vào, vài khung hình ra",
        "d": "Một xe ghi khoảng 3–6 TB dữ liệu thô mỗi giờ (tuỳ cảm biến). Qua bộ lọc có chủ đích, dataset chỉ còn vài khung hình đáng giá. Hai câu hỏi dẫn dắt: cái gì trong đó đến được mô hình, và ai quy định ý nghĩa của một nhãn.",
        "ex": "8 camera × 1080p × 30 fps × 3 byte ≈ 5,4 TB/giờ; mã hoá video 10 Mbps mỗi camera còn khoảng 36 GB/giờ, nhỏ hơn cỡ 150 lần.",
        "fig": "data-funnel",
        "figCap": "Từ terabyte thô tới vài khung hình có nhãn: mỗi tầng lọc bớt và làm sạch hơn."
      },
      {
        "t": "Five pipeline stages (năm chặng của pipeline)",
        "en": "generation → ingestion → storage → transformation → serving",
        "d": "Pipeline nào cũng đi qua năm chặng: sinh dữ liệu (camera xe), nạp (Kafka, upload S3), lưu (lakehouse), biến đổi (Spark, dbt), phục vụ (huấn luyện, dashboard). Bên dưới là ba lớp xuyên suốt: điều phối (lịch chạy, thử lại), chất lượng (kiểm tra từng chặng), bảo mật (quyền truy cập, ẩn danh).",
        "ex": "Lab Day 24: Python + FFmpeg lấy mẫu 2 khung/giây → Bronze → Silver → Gold → Postgres → Metabase; Airflow điều phối, dbt + DuckDB làm cổng kiểm tra."
      },
      {
        "t": "Data engine (vòng lặp dữ liệu 10 bước)",
        "en": "record → trigger → ingest → index → curate → label → dataset → train → eval → deploy",
        "d": "Mười bước nối thành vòng: lỗi phát hiện khi đánh giá và triển khai trở thành dữ liệu cần thu thêm. Bốn kiểu flywheel khác nhau ở phần được tự động: trigger-first (lọc ngay trên xe), search-first (tìm cảnh hiếm trong log), rollout-first (robot chạy, người sửa lỗi), generate-first (sinh video rồi lọc).",
        "ex": "Vòng lặp thường hỏng ở bốn chỗ: không đo được, nhãn đến trễ, leakage, không ai chịu trách nhiệm. Mỗi bước cần một đầu ra và một người sở hữu.",
        "fig": "data-engine",
        "figCap": "Mười bước khép thành vòng: eval chỉ ra chỗ yếu, curate thu thêm đúng dữ liệu đó."
      },
      {
        "t": "Batch vs streaming ingest (nạp theo lô hay theo luồng)",
        "en": "Kafka · Airbyte · upload S3",
        "d": "Batch gom cả ca rồi upload: rẻ, đơn giản, trễ cỡ giờ. Streaming đẩy từng sự kiện (telemetry) qua Kafka: trễ cỡ giây nhưng tốn vận hành. Tệp video đi thẳng vào object storage; hàng đợi chỉ mang sự kiện nhỏ.",
        "ex": "Telemetry liên tục → Kafka/Kinesis; database, SaaS → Airbyte theo lịch; video, ảnh → upload thẳng S3/GCS."
      },
      {
        "t": "Medallion: Bronze / Silver / Gold",
        "en": "nguyên bản → làm sạch → dataset huấn luyện",
        "d": "Bronze chỉ ghi thêm (append-only), giữ nguyên bản kèm metadata (nguồn, giờ nhận, checksum), áp schema khi đọc. Silver thống nhất đơn vị (m/s, độ, UTC), đẩy dòng lỗi sang bảng reject kèm lý do, gắn cờ chất lượng cho mỗi khung. Gold là dataset huấn luyện. Silver và Gold luôn tạo lại được từ Bronze.",
        "ex": "Bản ghi Bronze: uri s3://fleet/raw/car12/cam3.mp4, event_ts 14:03:11, ingested 21:04:52, checksum sha256:…"
      },
      {
        "t": "Event time vs ingestion time (thời điểm xảy ra và thời điểm đến)",
        "en": "join theo event time · watermark",
        "d": "Ghép các luồng cảm biến theo thời điểm sự kiện xảy ra, không theo thứ tự dữ liệu tới hệ thống. LiDAR 10 Hz, camera 30 Hz, IMU 200 Hz đến theo cụm; phải chờ một khoảng (watermark) cho dữ liệu đến muộn rồi mới ghép.",
        "ex": "Ảnh tới pipeline lúc 21:04 nhưng chụp lúc 14:03: ghép với LiDAR lúc 14:03, không phải LiDAR vừa tới lúc 21:04.",
        "fig": "event-time",
        "figCap": "Ba luồng khác nhịp; dấu đỏ là thời điểm ghép theo event time, sau khi chờ dữ liệu đến muộn."
      },
      {
        "t": "Lakehouse & table formats (lakehouse và định dạng bảng)",
        "en": "object storage · Parquet · Delta / Iceberg / Hudi",
        "d": "Warehouse có bảng và giao dịch ACID nhưng đắt, không chứa video; data lake rẻ, chứa mọi tệp nhưng không có ACID; lakehouse có cả hai. Video nằm ở object storage, bảng chỉ giữ con trỏ (id, ts, uri, nhãn). Parquet lưu theo cột nên truy vấn hai cột chỉ đọc hai cột. Delta/Iceberg/Hudi coi mỗi commit là một danh sách tệp, tệp cũ không sửa, nên đọc lại được phiên bản cũ (time travel).",
        "ex": "Xoá dòng trong bảng mà quên xoá tệp → tệp mồ côi cần dọn; tệp bị sửa mà bảng không biết → cần checksum."
      },
      {
        "t": "ELT for video & decode bottleneck (ELT cho video và nút cổ chai giải mã)",
        "en": "nạp trước, biến đổi sau · Spark / Flink / dbt",
        "d": "ETL biến đổi rồi mới nạp: kẹt vì giải mã video quá nặng. ELT nạp tệp gốc vào lakehouse trước, chỉ dòng metadata đi qua bảng. Chọn engine theo độ trễ: Spark cho lô cả ngày, Flink cho từng sự kiện trong vài giây, dbt cho SQL theo lịch. Giải mã video trên CPU thường là nút cổ chai; giảm tải bằng FFmpeg, NVIDIA DALI (giải mã trên GPU), Ray Data.",
        "ex": "Video 30 fps lấy mỗi khung thứ 6 → khung 0, 6, 12, 18, 24. Video fps không cố định làm lệch chỉ số khung giữa nhãn và ảnh."
      },
      {
        "t": "Orchestration & idempotent backfill (điều phối và chạy lại an toàn)",
        "en": "DAG · Airflow / Dagster · ghi đè partition",
        "d": "Bộ điều phối (Airflow, Dagster, Prefect, Flyte) lên lịch, thử lại và chạy bù (backfill) cả đồ thị các bước. Chạy lại một partition hỏng phải ghi đè partition đó, không ghi thêm, để chạy lại bao nhiêu lần cũng ra cùng kết quả.",
        "ex": "5 ngày × 1 000 hàng; chạy lại ngày 3: ghi đè vẫn 5 000 hàng, ghi thêm thành 6 000 (ngày 3 nhân đôi)."
      },
      {
        "t": "Automated data quality (kiểm chất lượng tự động)",
        "en": "Great Expectations · Soda · dbt tests",
        "d": "Kiểm tra viết thành code và chạy mỗi lần có dữ liệu mới, ở mỗi lớp: bảng (schema, null, khoảng giá trị, độ tươi, trùng lặp), ảnh và video (khung đen, khung mờ, hộp nằm ngoài ảnh). Một kiểm tra trượt là lô đó dừng, không sang lớp sau.",
        "ex": "Bốn số [100, 60, 50, 80] đọc theo xywh góc, xyxy, xywh tâm đều hợp lệ nhưng ra ba hộp khác nhau: kiểm phạm vi hộp và vẽ thử vài hộp sau mỗi lần xuất nhãn. Thử ở mô phỏng."
      },
      {
        "t": "Lineage & dataset versioning (dấu vết nguồn gốc và phiên bản)",
        "en": "OpenLineage · DataHub · DVC / lakeFS",
        "d": "Lineage ghi mỗi bảng và mô hình được tạo từ đâu, để truy ngược từ mô hình về log gốc. Một phiên bản dataset phải xác định được bằng commit dữ liệu + danh sách split + mã xử lý.",
        "ex": "Manifest minh hoạ: lane-frames v3, data lakefs://frames@c7f2a91, split by_scene (seed 7), code git 4be90d1."
      },
      {
        "t": "Data selection: triggers & embedding search (chọn dữ liệu)",
        "en": "shadow mode · CLIP / SigLIP · vector search",
        "d": "Trigger chạy ngay trên xe: khi dự đoán của mô hình lệch hành vi người lái quá ngưỡng thì ghi một snapshot ngắn để tải lên; khớp thì bỏ qua. Embedding đưa ảnh và câu chữ vào cùng không gian, nên tìm được khung hình bằng một câu mô tả rồi người duyệt kết quả.",
        "ex": "Truy vấn \"xe máy cắt ngang trong mưa\" → embedding → FAISS / pgvector / Milvus → các khung gần nhất."
      },
      {
        "t": "Split by scene (chia theo cảnh để tránh rò rỉ)",
        "en": "leakage giữa các khung liền nhau",
        "d": "Các khung liền nhau trong video gần như giống hệt. Chia ngẫu nhiên theo khung thì mỗi khung test có một \"anh em\" gần trùng ở train, điểm đánh giá đẹp giả. Phải chia theo cảnh (hoặc theo chuyến, theo cụm).",
        "ex": "Minh hoạ trong slide: chia theo khung cho val 95%, chia theo cảnh chỉ còn 70%. Nghiên cứu đã tìm thấy leakage chưa biết ngay trong KITTI. Thử ở mô phỏng."
      },
      {
        "t": "Label is a specification (nhãn là một đặc tả)",
        "en": "guideline · đồng thuận giữa người gán",
        "d": "Cùng khung hình, guideline khác cho nhãn khác; ngay cả người với người cũng không khớp 100%, nhất là với vật nhỏ, và mức bất đồng đó là \"sàn nhiễu\" của phép đo. Mỗi dạng nhãn (hộp 2D, mask, hộp 3D + track ID, làn, occupancy, quỹ đạo, ngôn ngữ) cần guideline và cách đo đồng thuận riêng.",
        "ex": "Người dắt xe đạp: guideline A gán riêng \"pedestrian\" + \"bicycle\", guideline B gán một hộp \"cyclist\". Waymo: ba lượt gán lại của người đạt IoU 3D trung bình 80,92% so với nhãn gốc. Test set công khai có ít nhất 3,3% nhãn sai trung bình."
      },
      {
        "t": "Offboard auto-labeling (gán nhãn ngoại tuyến)",
        "en": "dùng cả khung tương lai · Waymo 3DAL",
        "d": "Trên xe chỉ có quá khứ và bị giới hạn độ trễ; ngoại tuyến dùng được cả khung trước lẫn sau và mô hình nặng. Waymo 3DAL: chuỗi LiDAR → detector 5 khung → tracking → hiệu chỉnh riêng vật tĩnh / động → hộp 3D theo track.",
        "ex": "3DAL đạt 3D AP@0.7 85,37 (xe) trên Waymo val; tracking + hiệu chỉnh cộng thêm 8,39 điểm AP@0.8. Học trò học 10% nhãn người + 90% nhãn máy đạt 70,0 AP, gần 71,2 khi dùng 100% nhãn người."
      },
      {
        "t": "Pre-labeling with foundation models (gán nhãn sẵn bằng mô hình lớn)",
        "en": "Grounded-SAM · Autodistill · SAM 2",
        "d": "Câu chữ (\"car . pedestrian\") → Grounding DINO ra hộp → SAM ra mask → người duyệt sửa rồi chấp nhận. Autodistill: mô hình lớn (base) gán nhãn cho mô hình nhỏ (target) chạy trên xe. Nhãn máy chỉ thành đáp án chuẩn sau khi người duyệt.",
        "ex": "SAM 2 trong vòng gán nhãn giảm thời gian vẽ mask từ 37,8 s xuống 4,5 s mỗi khung (8,4 lần): mô hình càng tốt, người càng chuyển từ vẽ sang duyệt."
      },
      {
        "t": "Confidence routing (định tuyến theo độ tin cậy)",
        "en": "tự chấp nhận · người kiểm · gán lại",
        "d": "Nhãn máy đi qua bộ định tuyến theo điểm tin cậy và mức bất đồng: điểm cao tự chấp nhận (vẫn audit mẫu); điểm vừa hoặc hai mô hình bất đồng thì người kiểm và sửa; điểm thấp thì người vẽ lại. Ngưỡng phải hiệu chỉnh trên tập gold. Người duyệt dễ gật đầu với nhãn máy sai (automation bias): đo bằng lỗi cấy sẵn, tập gold không pre-label, tỷ lệ chấp nhận theo từng người.",
        "ex": "Ngưỡng minh hoạ trong slide: ≥ 0,9 tự chấp nhận; 0,4–0,9 người kiểm; < 0,4 gán lại. Thử ở mô phỏng \"Định tuyến nhãn máy\"."
      },
      {
        "t": "Human audit (kiểm nhãn người)",
        "en": "gold ~10% · audit 10–20%",
        "d": "Nhãn người làm chuẩn cũng phải kiểm: người thứ hai kiểm mọi nhãn, hoặc auditor kiểm ngẫu nhiên 10–20%. Một con số chất lượng nhãn luôn phải kèm cỡ mẫu đã audit.",
        "ex": "Audit 200 nhãn, thấy 8 lỗi → precision 96% trên 200 nhãn đã audit."
      },
      {
        "t": "Confident learning (tìm nhãn sai bằng dự đoán ngoài mẫu)",
        "en": "K-fold · ma trận nhãn × dự đoán · cleanlab",
        "d": "Cho mô hình dự đoán trên dữ liệu nó chưa thấy (K-fold), đặt nhãn đang có cạnh dự đoán; các ô lệch là nghi ngờ. Với detection, gắn cờ ba loại: thiếu vật (dự đoán chắc, không có nhãn), hộp lệch, sai lớp.",
        "ex": "Khoảng 645 ảnh tên lửa (missile) trong ImageNet có khả năng bị gán nhầm thành lớp cha \"projectile\"."
      },
      {
        "t": "Active learning (học chủ động)",
        "en": "uncertainty · core-set · BADGE",
        "d": "Chọn mẫu đáng gán nhãn nhất thay vì chọn ngẫu nhiên: theo độ bất định (gần biên quyết định), theo độ đa dạng (core-set phủ đều không gian), hoặc kết hợp cả hai (BADGE). Phải thắng được baseline ngẫu nhiên đã được tối ưu, cùng tập khởi đầu, nhiều seed, thì mới đáng dùng.",
        "ex": "Ví dụ trong slide (mIoU): ngẫu nhiên 25,67; entropy 25,91; core-set 25,96; cách đề xuất 26,62; toàn bộ nhãn 26,83: chênh lệch rất nhỏ.",
        "fig": "al-bars",
        "figCap": "Các chiến lược chọn mẫu chỉ hơn ngẫu nhiên (đã tối ưu) một chút; trục dọc bắt đầu từ 25."
      },
      {
        "t": "Teacher–student self-training (tự huấn luyện thầy–trò)",
        "en": "pseudo-label · Noisy Student",
        "d": "Thầy học trên nhãn người, sinh nhãn giả cho dữ liệu không nhãn; trò học trên nhãn giả có thêm nhiễu (dropout, augmentation) rồi thành thầy mới. Lỗi của thầy có thể lan sang trò. Các lựa chọn ngân sách khác: tiền huấn luyện tự giám sát (MAE) khi nhiều dữ liệu chưa nhãn, mua nhãn người cho test set và lớp an toàn.",
        "ex": "Noisy Student: 300 triệu ảnh không nhãn, 88,4% top-1 ImageNet. 3DAL khi đổi miền dữ liệu: 59,4 → 64,2 AP."
      }
    ],
    "formulas": [
      {
        "tex": "8 \\times 1080\\text{p} \\times 30\\ \\text{fps} \\times 3\\ \\text{B} \\approx 5{,}4\\ \\text{TB/h}",
        "read": "Dữ liệu thô của 8 camera mỗi giờ.",
        "ex": "Mã hoá video còn ~36 GB/giờ, nhỏ hơn ~150 lần."
      },
      {
        "tex": "\\text{version} = \\text{data commit} + \\text{split} + \\text{code}",
        "read": "Một phiên bản dataset phải xác định được bằng: dữ liệu nào, chia train/test ra sao, xử lý bằng mã nào.",
        "ex": "Công cụ: DVC, lakeFS, Delta, Iceberg."
      },
      {
        "tex": "5 \\times 1\\,000 + 1\\,000 = 6\\,000 \\ne 5\\,000",
        "read": "Chạy lại ngày 3 bằng ghi thêm (append) làm dữ liệu ngày 3 nhân đôi; ghi đè partition thì vẫn 5 000.",
        "ex": "Pipeline idempotent: chạy lại nhiều lần cho cùng kết quả."
      },
      {
        "tex": "\\text{precision} = 1 - \\dfrac{8}{200} = 96\\%",
        "read": "Kiểm 200 nhãn thấy 8 lỗi thì độ chính xác nhãn 96%, và phải ghi kèm cỡ mẫu đã kiểm.",
        "ex": "Mốc tham chiếu: người gán ~10%, kiểm 10–20%."
      },
      {
        "tex": "37{,}8\\ \\text{s} \\;\\to\\; 4{,}5\\ \\text{s}\\ \\text{mỗi khung}",
        "read": "Đưa SAM 2 vào vòng gán nhãn giảm thời gian vẽ mặt nạ 8,4 lần.",
        "ex": "Mô hình càng tốt, người càng chuyển từ vẽ sang duyệt."
      }
    ],
    "table": {
      "title": "Định tuyến nhãn máy (ngưỡng minh hoạ)",
      "cols": [
        "Làn",
        "Khi nào",
        "Người làm gì"
      ],
      "rows": [
        [
          "Tự chấp nhận",
          "Điểm tin cậy ≥ 0,9",
          "Kiểm tra ngẫu nhiên một phần"
        ],
        [
          "Người kiểm",
          "0,4–0,9 hoặc hai mô hình bất đồng",
          "Xem và sửa nhãn có sẵn"
        ],
        [
          "Gán lại",
          "Điểm < 0,4",
          "Vẽ lại từ đầu theo quy tắc"
        ]
      ]
    },
    "traps": [
      "Bốn số [100, 60, 50, 80] đọc theo ba định dạng hộp đều hợp lệ, nên sai mà không báo lỗi.",
      "Chia train/test ngẫu nhiên theo khung hình làm điểm đánh giá đẹp giả.",
      "Nhãn máy chưa phải đáp án cho tới khi người duyệt; người duyệt dễ gật đầu với nhãn máy sai.",
      "Ngay cả test set công khai cũng có ≥ 3,3% nhãn sai trung bình.",
      "Chạy lại một partition bằng ghi thêm làm dữ liệu nhân đôi.",
      "Học chủ động phải so với baseline ngẫu nhiên đã tối ưu, nhiều seed; nếu không, lợi ích có thể là ảo."
    ],
    "remember": [
      "Giữ nguyên bản, mọi lớp sau đều tạo lại được; chạy lại phải cho cùng kết quả.",
      "Chia dữ liệu theo cảnh để tránh rò rỉ; version = data + split + code.",
      "Máy gán nhãn, máy kiểm tra, người quyết định; mọi con số chất lượng kèm cỡ mẫu."
    ],
    "cards": [
      [
        "Vì sao gán nhãn offline (sau khi chạy) chính xác hơn trên xe?",
        "Dùng được cả khung tương lai và không bị giới hạn độ trễ."
      ],
      [
        "ETL hay ELT cho video?",
        "ELT: nạp tệp gốc trước, biến đổi bảng metadata sau."
      ],
      [
        "Ghép LiDAR với camera theo thời điểm nào?",
        "Event time (lúc xảy ra), có chờ dữ liệu đến muộn; không theo lúc dữ liệu tới."
      ],
      [
        "Parquet nhanh hơn ở đâu?",
        "Lưu theo cột: truy vấn hai cột chỉ đọc hai cột, và nén tốt hơn."
      ],
      [
        "Confident learning tìm nhãn sai thế nào?",
        "Cho mô hình dự đoán trên dữ liệu nó chưa thấy, so với nhãn; chỗ lệch là nghi ngờ."
      ],
      [
        "Lineage trả lời câu hỏi gì?",
        "Mô hình này được huấn luyện từ dữ liệu nào."
      ],
      [
        "Teacher–student hoạt động ra sao?",
        "Thầy học nhãn người, sinh nhãn giả; trò học có nhiễu rồi thành thầy mới."
      ],
      [
        "Một nút chặn deploy thường là câu hỏi nào?",
        "Đã chạy thử trong mô phỏng vòng kín chưa?"
      ]
    ]
  },
  {
    "id": "day25",
    "part": 25,
    "n": 25,
    "title": "VLM & VLA",
    "question": "Mô hình vừa nhìn ảnh vừa hiểu chữ hoạt động ra sao, dùng nó gán nhãn có tin được không, và làm sao biến nó thành hành động lái xe?",
    "analogy": "VLM giống một người phiên dịch: bộ mã hoá ảnh \"nhìn\" và kể lại bằng một thứ ngôn ngữ trung gian, bộ chiếu dịch sang ngôn ngữ mà mô hình ngôn ngữ lớn hiểu, rồi LLM trả lời bằng chữ. VLA thì thêm \"tay chân\": thay vì chỉ trả lời, nó xuất lệnh di chuyển.",
    "why": "VLM đang được dùng để tạo nhãn, tìm cảnh hiếm và sinh lập luận cho xe tự lái. Nhưng nó có thể trả lời đúng mà không thực sự nhìn ảnh, nên phải biết khi nào tin, khi nào kiểm.",
    "steps": [
      "Ảnh được cắt thành mảnh rồi biến thành token như chữ.",
      "Huấn luyện theo giai đoạn: căn chỉnh trước, mở toàn bộ sau, cuối cùng là RL.",
      "Dùng VLM trong vòng dữ liệu: tạo nhãn tốt, chấm nhãn kém.",
      "VLA gắn thêm đầu ra hành động, ví dụ Qwen-Drive sinh quỹ đạo.",
      "Phân biệt VLA với mô hình chỉ chọn một đáp án."
    ],
    "concepts": [
      {
        "t": "Ba khối của VLM",
        "en": "encoder → projector → LLM",
        "d": "Bộ mã hoá ảnh (ViT) rút đặc trưng, bộ chiếu (projector, thường là MLP) nén và đổi chúng thành token, LLM đọc token ảnh cùng câu hỏi rồi sinh câu trả lời.",
        "ex": "Qwen3-VL, InternVL, GLM-V đều theo khuôn này."
      },
      {
        "t": "Token ảnh",
        "en": "visual tokens",
        "d": "Mỗi vùng ảnh thành một token. Nhiều token thì chi tiết hơn nhưng tốn hơn, nên độ phân giải ảnh quyết định chi phí.",
        "ex": "Qwen3-VL: ảnh 1280×720 ≈ 900 token."
      },
      {
        "t": "Giai đoạn căn chỉnh",
        "en": "alignment stage",
        "d": "Bước đầu chỉ dạy bộ chiếu, giữ nguyên bộ mã hoá ảnh và LLM, để hai bên \"nói chuyện\" được với nhau.",
        "ex": "Sau đó mới mở toàn bộ: tiền huấn luyện, ngữ cảnh dài, SFT, RL."
      },
      {
        "t": "RL có bộ chấm tự động",
        "en": "RL with verifiable reward",
        "d": "Mô hình sinh nhiều câu trả lời, một bộ chấm tự động (đúng/sai, IoU của hộp) cho điểm, rồi mô hình được chỉnh theo điểm.",
        "ex": "Giúp cải thiện lập luận và giảm bịa chi tiết."
      },
      {
        "t": "Đầu ra có cấu trúc",
        "en": "structured output",
        "d": "Ép VLM trả JSON theo khuôn. Khuôn đảm bảo đúng cấu trúc, không đảm bảo giá trị đúng, nên phải kiểm tra trong code và cho phép trả \"null\".",
        "ex": "Chiều dài xe ngoài 2,5–20 m thì gửi người duyệt."
      },
      {
        "t": "VLM \"không nhìn\"",
        "en": "textual shortcut",
        "d": "Có lúc VLM đoán từ câu hỏi mà không dùng ảnh. Vì vậy mỗi nhãn VLM tạo cần một phép kiểm độc lập.",
        "ex": "GPT-4o đúng 59,5% với ảnh đen, ngang 59,0% với ảnh thật."
      },
      {
        "t": "VLA",
        "en": "vision-language-action",
        "d": "VLM đã huấn luyện + đầu ra hành động. Nhận ảnh và câu lệnh, trả về chuyển động.",
        "ex": "Qwen-Drive: VLM 4B + bộ lập quỹ đạo ~1,1 tỷ tham số, xuất 50 điểm trong 5 giây."
      },
      {
        "t": "Mô hình quyết định",
        "en": "decision model",
        "d": "Chỉ chọn một trong N đáp án kèm xác suất; lệnh điều khiển phải do code bên ngoài tạo. Không hợp làm vòng an toàn.",
        "ex": "OpenAI Decisions API và Jev thuộc nhóm này, không phải VLA."
      }
    ],
    "formulas": [
      {
        "tex": "\\text{tokens} \\approx \\dfrac{W}{32} \\cdot \\dfrac{H}{32}",
        "read": "Qwen3-VL: mảnh 16 px, gộp 2×2 thành một token, nên mỗi token ứng với 32×32 px.",
        "ex": "1280×720 ≈ 900; 1920×1080 ≈ 2 000."
      },
      {
        "tex": "x_{\\text{px}} = \\dfrac{x}{1000}\\,W",
        "read": "Đổi toạ độ hộp từ thang 0–1000 (Qwen3-VL) sang pixel.",
        "ex": "x = 500 trên ảnh rộng 1 920 → 960 px. Qwen2.5-VL thì đã là pixel."
      },
      {
        "tex": "\\text{VRAM} \\propto N_{\\text{total}}, \\qquad \\text{compute} \\propto N_{\\text{active}}",
        "read": "Mô hình MoE: bộ nhớ theo tổng tham số, chi phí tính theo phần tham số hoạt động mỗi token.",
        "ex": "Qwen3-VL 30B-A3B: 30B tổng, 3B hoạt động."
      },
      {
        "tex": "50\\ \\text{điểm} = 5\\ \\text{s} \\times 10\\ \\text{Hz}",
        "read": "Quỹ đạo Qwen-Drive: 50 điểm (x, y, hướng) cho 5 giây tới.",
        "ex": "Bộ lập quỹ đạo tinh chỉnh cả 50 điểm cùng lúc qua 10 bước khử nhiễu."
      }
    ],
    "table": {
      "title": "Ai thật sự sinh hành động",
      "cols": [
        "Mô hình",
        "Vào → ra",
        "Truy cập"
      ],
      "rows": [
        [
          "Qwen-Drive",
          "Ảnh, lịch sử xe, lệnh → quỹ đạo 50 điểm",
          "Mở trọng số"
        ],
        [
          "Decisions API",
          "Chữ/ảnh + danh sách đáp án → xác suất",
          "Đóng, beta"
        ],
        [
          "Jev",
          "Chữ → đáp án + xác suất",
          "Đóng, API"
        ]
      ]
    },
    "traps": [
      "Hai thế hệ Qwen dùng hệ toạ độ hộp khác nhau: code đọc hộp không dùng chung được.",
      "\"confidence\" trong phản hồi không phải xác suất cao nhất.",
      "Thứ tự đáp án có thể làm đổi xác suất của mô hình quyết định.",
      "Chế độ \"thinking\" nhân chi phí; tắt khi gán nhãn hàng loạt.",
      "Qwen-Drive điểm vòng hở cao nhưng thua Alpamayo-R1 ở vòng kín."
    ],
    "remember": [
      "VLM = bộ mã hoá ảnh + bộ chiếu + LLM; token ảnh quyết định chi phí.",
      "VLM tạo nhãn khởi tạo tốt nhưng chấm nhãn kém: luôn kiểm độc lập.",
      "Chỉ VLA sinh hành động; mô hình quyết định chỉ chọn đáp án."
    ],
    "cards": [
      [
        "Giai đoạn căn chỉnh cập nhật phần nào?",
        "Chỉ bộ chiếu; bộ mã hoá ảnh và LLM giữ nguyên."
      ],
      [
        "Tìm cảnh \"xe đạp vượt phải rồi rẽ trái\" cần gì ngoài embedding?",
        "Track 3D và chương trình truy vấn trên track."
      ],
      [
        "Đối chiếu với danh sách vật của detector giúp gì?",
        "Recall tăng 0,814 → 0,932, precision vẫn ≈ 0,71."
      ],
      [
        "Qwen-Drive chạy 6 mẫu trả về shape gì?",
        "(6, 50, 3): 6 ứng viên, 50 điểm, (x, y, hướng)."
      ],
      [
        "SFT dạy gì theo GLM-V?",
        "Phong cách trả lời, không thêm kiến thức."
      ],
      [
        "Vì sao mô hình quyết định không hợp làm vòng an toàn?",
        "Chỉ chọn trong danh sách hữu hạn, phụ thuộc mạng, nhạy thứ tự đáp án."
      ]
    ]
  },
  {
    "id": "day26",
    "part": 26,
    "n": 26,
    "title": "Synthetic & Trajectory data",
    "question": "Cảnh nguy hiểm hiếm đến mức chạy hàng trăm triệu km mới gặp đủ. Có thể tự tạo dữ liệu đó không, và làm sao không tự lừa mình?",
    "analogy": "Phi công tập tình huống động cơ cháy trong buồng mô phỏng chứ không chờ máy bay thật cháy. Dữ liệu tổng hợp là \"buồng mô phỏng\" cho mô hình. Nhưng bài thi cuối vẫn phải là chuyến bay thật: kết luận chỉ đến từ dữ liệu thật.",
    "why": "Dữ liệu đuôi dài (hiếm, nguy hiểm) quyết định độ an toàn. Dữ liệu tổng hợp giúp lấp chỗ đó, nhưng dễ tạo ra con số đẹp giả nếu so sánh không công bằng.",
    "steps": [
      "Bốn cách có dữ liệu: dựng mô phỏng, tái dựng từ log, sinh bằng diffusion, sinh hành vi.",
      "Thu hẹp khoảng cách mô phỏng–thật ở ngoại hình, nội dung, cảm biến.",
      "Đo lợi ích của dữ liệu sinh một cách công bằng.",
      "Làm sạch quỹ đạo lấy từ log và lọc mẫu bất khả thi.",
      "Giữ test set thật, đứng yên và không rò rỉ."
    ],
    "concepts": [
      {
        "t": "Khoảng cách sim2real",
        "en": "sim-to-real gap",
        "d": "Ba loại: ngoại hình (màu, ánh sáng), nội dung và hành vi (ai đi đâu), cảm biến (nhiễu, tia LiDAR bị mất). Mỗi loại có cách sửa riêng.",
        "ex": "LiDAR mô phỏng \"hoàn hảo, không mất tia nào\" lại là một lỗi."
      },
      {
        "t": "Ngẫu nhiên hoá",
        "en": "domain randomization",
        "d": "Đổi ngẫu nhiên màu, ánh sáng, vị trí trong mô phỏng để thế giới thật trở thành \"một biến thể nữa\". Đặt vật theo ngữ cảnh hợp lý thì hiệu quả hơn nhiều.",
        "ex": "Ca khó: 24,0 → 52,2 AP khi xe được đặt đúng trên làn."
      },
      {
        "t": "Tái dựng (Real2Sim)",
        "en": "NeRF, 3D Gaussian Splatting",
        "d": "Ghi một lần ngoài đường, dựng lại cảnh 3D, rồi đổi góc nhìn hay thêm bớt xe. Nhãn đi kèm miễn phí. Càng rời xa đường đã ghi, ảnh càng xấu.",
        "ex": "3DGS chạy 134 khung/giây so với 0,06 của NeRF."
      },
      {
        "t": "Sinh có điều kiện",
        "en": "conditional diffusion",
        "d": "Đưa hộp, bản đồ, thông số camera vào, mô hình sinh ảnh khớp với chúng. Nhãn có trước ảnh, nhưng vẫn phải kiểm ảnh có tôn trọng nhãn không.",
        "ex": "MagicDrive sinh 6 góc nhìn quanh xe."
      },
      {
        "t": "So sánh công bằng",
        "en": "equal training budget",
        "d": "Pretrain trên dữ liệu sinh rồi fine-tune trên thật nghĩa là học gấp đôi. Cho baseline học gấp đôi thì lợi ích có thể gần như biến mất.",
        "ex": "MagicDrive: +1,95 NDS chỉ còn +0,74 khi baseline cùng ngân sách."
      },
      {
        "t": "Cổng khả thi",
        "en": "feasibility gate",
        "d": "Quỹ đạo lấy từ tracker có nhiễu. Kiểm gia tốc, độ cong, gia tốc ngang, bản đồ để tách \"không thể xảy ra\" (lỗi) khỏi \"hiếm\" (quý).",
        "ex": "Xe quay 180° trong một khung = lỗi; phanh −7 m/s² mượt = hiếm nhưng thật."
      },
      {
        "t": "Nhân demo robot",
        "en": "demo augmentation",
        "d": "Viết lại thao tác theo toạ độ của vật rồi biến đổi cho vị trí mới; chạy thử trong mô phỏng, chỉ giữ lần thành công. Đa dạng môi trường quan trọng hơn số lượng demo.",
        "ex": "~200 demo người → 50 000+ demo (MimicGen)."
      },
      {
        "t": "Test set trung thực",
        "en": "honest evaluation",
        "d": "Giữ một bộ test đóng băng để so phiên bản, thêm bộ mới theo nơi và thời gian. Dữ liệu sinh không bao giờ vào bài thi cuối.",
        "ex": "Thu lại test ImageNet theo cùng quy trình, điểm vẫn tụt 3–15 điểm."
      }
    ],
    "formulas": [
      {
        "tex": "x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1 - \\bar\\alpha_t}\\,\\varepsilon",
        "read": "Diffusion làm nhiễu ảnh sạch x₀ dần theo lịch ᾱ; mô hình học đường ngược lại từ nhiễu về ảnh.",
        "ex": "Làm nhiễu thì dễ, khử nhiễu mới là việc phải học."
      },
      {
        "tex": "\\operatorname{std}(\\hat a) = \\dfrac{\\sqrt{6}\\,\\sigma}{\\Delta t^2}",
        "read": "Lấy gia tốc bằng sai phân hai lần thì nhiễu vị trí σ bị phóng đại theo 1/Δt².",
        "ex": "σ = 0,1 m, Δt = 0,1 s → 24,5 m/s² ≈ 2,5 g giả. Phải làm mượt trước."
      },
      {
        "tex": "a_{\\text{lat}} = v^2\\,\\kappa",
        "read": "Gia tốc ngang khi vào cua = tốc độ² × độ cong.",
        "ex": "15 m/s, κ = 0,05 → 11,3 m/s², vượt ma sát (~8–9) nên bất khả thi."
      },
      {
        "tex": "\\mathrm{ESS} = \\dfrac{\\left(\\sum_i w_i\\right)^2}{\\sum_i w_i^2}",
        "read": "Số mẫu hiệu dụng: lặp đi lặp lại vài mẫu hiếm làm ESS tụt, tức không thêm thông tin.",
        "ex": "Cần mẫu mới thật, không chỉ nhân bản."
      },
      {
        "tex": "\\mathrm{err}(D) = a\\,D^{-\\alpha} + c",
        "read": "Lỗi giảm theo lũy thừa khi thêm dữ liệu, nhưng không xuống dưới sàn c.",
        "ex": "Nhân đôi dữ liệu không chia đôi lỗi."
      },
      {
        "tex": "\\hat p \\le \\dfrac{3}{n}",
        "read": "Chạy n lần không thấy va chạm nào thì chỉ được nói tần suất ≤ 3/n, không được nói bằng 0.",
        "ex": "1 000 lần → ≤ 0,003."
      }
    ],
    "table": {
      "title": "Ba khoảng cách mô phỏng – thật",
      "cols": [
        "Khoảng cách",
        "Ví dụ",
        "Cách sửa"
      ],
      "rows": [
        [
          "Ngoại hình",
          "Màu, ánh sáng, vật liệu",
          "Ngẫu nhiên hoá, dịch phong cách ảnh"
        ],
        [
          "Nội dung & hành vi",
          "Bố cục cảnh, ai đi đâu",
          "Ngẫu nhiên có cấu trúc, phát lại log"
        ],
        [
          "Cảm biến",
          "Tia LiDAR mất, rolling shutter",
          "Học mô hình cảm biến từ dữ liệu thật"
        ]
      ]
    },
    "traps": [
      "FID đẹp không có nghĩa nhãn đúng: FID không biết hộp nằm đâu.",
      "Test lẫn dữ liệu sinh chỉ đo mô hình trên thế giới của bộ sinh.",
      "Kịch bản nguy hiểm mà vi phạm vật lý là dữ liệu độc.",
      "Với tia LiDAR mất, vị trí mất quan trọng hơn số lượng mất.",
      "Học lặp trên dữ liệu tự sinh làm đuôi phân phối biến mất (model collapse)."
    ],
    "remember": [
      "Huấn luyện trên hỗn hợp, kết luận chỉ từ test thật độc lập.",
      "Đo lợi ích dữ liệu sinh với baseline cùng ngân sách huấn luyện.",
      "Quỹ đạo: làm mượt, qua cổng khả thi, đừng chỉ lặp mẫu hiếm."
    ],
    "cards": [
      [
        "Báo cáo \"+2 NDS nhờ dữ liệu sinh\": hỏi gì trước tiên?",
        "Baseline có cùng số bước, cùng kiến trúc không?"
      ],
      [
        "Pretrain tổng hợp, fine-tune thật có tác dụng không?",
        "Có, đây là công thức an toàn nhất."
      ],
      [
        "1 000 demo robot nên chia thế nào?",
        "Nhiều nơi, ít lần mỗi nơi (ví dụ 32 nơi × 4 demo)."
      ],
      [
        "ADR tự chỉnh độ rộng ngẫu nhiên hoá ra sao?",
        "Robot làm tốt thì nới rộng, làm kém thì thu hẹp."
      ],
      [
        "Muốn biết mô hình chạy tốt ở thành phố mới, chia test thế nào?",
        "Giữ riêng một thành phố và vài tháng cuối làm test."
      ],
      [
        "Phát lại log cho 101 vụ va chạm, xe phản ứng thì 0. Vì sao?",
        "Xe trong log không biết xe ta đã phanh nên tông đuôi: va chạm giả."
      ]
    ]
  },
  {
    "id": "day27",
    "part": 27,
    "n": 27,
    "title": "Replay & Closed-loop test",
    "question": "Bộ nhận thức mới vừa huấn luyện xong. Làm sao chắc nó không làm cả hệ thống lái tệ đi, khi chưa được chạy ngoài đường thật?",
    "analogy": "Vòng hở giống chấm học lái bằng cách xem học viên có cầm lái giống video mẫu không, nhưng mỗi giây lại đặt xe về đúng chỗ trong video. Vòng kín là để học viên tự lái và chịu hậu quả của từng quyết định. Học viên giống video nhất chưa chắc là người lái an toàn nhất.",
    "why": "Một lỗi nhỏ ở nhận thức lan xuống: bỏ sót khung → đổi ID → dự báo lệch → phanh trễ → nguy cơ va chạm. Kiểm thử phải nhìn cả hệ thống, không chỉ mAP.",
    "steps": [
      "Phát lại nhật ký đã ghi để cô lập thay đổi phần mềm.",
      "So vòng hở với vòng kín và hiểu vì sao xếp hạng có thể đảo ngược.",
      "Biến lỗi đã gặp thành họ kịch bản có tham số, quét tìm ranh giới.",
      "Cho xe và người khác phản ứng để tránh va chạm giả.",
      "Đi qua cổng phát hành; thất bại ở bất kỳ bậc nào là dừng."
    ],
    "concepts": [
      {
        "t": "Phát lại nhật ký",
        "en": "log replay",
        "d": "Ghi cảm biến một lần ngoài đường, phát lại bao nhiêu lần cũng được với phần mềm mới. Cùng đầu vào, khác đầu ra là do thay đổi phần mềm.",
        "ex": "Không đánh giá được hành động mới vì thế giới trong log không đổi theo."
      },
      {
        "t": "So sánh có dung sai",
        "en": "tolerance",
        "d": "Hai lần phát lại không bao giờ giống nhau từng bit (thứ tự cộng số thực, đa luồng, GPU). So sánh cần ngưỡng chấp nhận.",
        "ex": "(0,1 + 0,2) + 0,3 = 0,6000000000000001."
      },
      {
        "t": "Vòng hở và vòng kín",
        "en": "open-loop vs closed-loop",
        "d": "Vòng hở: chấm so với log, xe luôn được đặt lại. Vòng kín: xe đi theo quyết định của chính nó, sai lệch nhỏ cộng dồn.",
        "ex": "Mô hình chỉ giữ vận tốc vẫn điểm vòng hở cao vì 73,9% cảnh nuScenes là đi thẳng."
      },
      {
        "t": "Kịch bản ba mức",
        "en": "functional → logical → concrete",
        "d": "Mô tả bằng lời (\"xe cắt vào\"), khoảng giá trị (5–40 m, 0–15 m/s), giá trị cụ thể (12 m, 5 m/s) để chạy ngay.",
        "ex": "Từ một lỗi trong log sinh ra cả họ biến thể."
      },
      {
        "t": "Độ bao phủ",
        "en": "coverage",
        "d": "Đếm vùng của miền vận hành đã thử, không đếm số kịch bản. 24 kịch bản cùng một góc thì vẫn thiếu.",
        "ex": "Lỗi nằm trên ranh giới: kiểm ranh giới, không kiểm trung bình."
      },
      {
        "t": "Tác nhân phản ứng",
        "en": "reactive agents",
        "d": "Xe và người khác trong mô phỏng phản ứng với xe thử. Phát lại log thì không, nên sinh va chạm giả.",
        "ex": "IDM: mô hình tài xế theo luật, đổi tham số là đổi tính cách tài xế."
      },
      {
        "t": "DAgger",
        "en": "DAgger",
        "d": "Cho mô hình tự lái, ghi các trạng thái nó gây ra, nhờ \"thầy\" (IDM) gắn nhãn, rồi huấn luyện lại. Mô hình học cách hồi phục từ chính sai lầm của nó.",
        "ex": "PercMLP+ an toàn hơn hẳn dù sai số vòng hở xấu đi."
      },
      {
        "t": "Cổng phát hành",
        "en": "release gate",
        "d": "Bảy quy tắc: phát lại tái lập, va chạm trên log, xe dẫn phanh gấp, lưới cắt vào, ổn định theo hạt giống, xe sau phản ứng, đủ kịch bản. Một quy tắc trượt là chặn.",
        "ex": "Trong lab chỉ PercMLP+ qua cổng."
      }
    ],
    "formulas": [
      {
        "tex": "\\mathrm{TTC} = \\dfrac{d}{v_{\\text{rel}}}",
        "read": "Thời gian tới va chạm = khoảng cách chia tốc độ tiến gần.",
        "ex": "12 m, 5 m/s → 2,4 s; 12 m, 10 m/s → 1,2 s (nguy hiểm)."
      },
      {
        "tex": "a_{\\text{req}} = \\dfrac{v_{\\text{rel}}^2}{2d}",
        "read": "Mức phanh cần để kịp dừng = tốc độ tiến gần² chia hai lần khoảng cách.",
        "ex": "10 m/s, 12 m → 4,2 m/s², gắt hơn mức phanh êm ~3 m/s²."
      },
      {
        "tex": "\\text{điểm lái} = \\text{hoàn thành lộ trình} \\times \\text{hệ số phạt}",
        "read": "Đi hết đường mà vi phạm nhiều thì điểm vẫn thấp (CARLA).",
        "ex": "0,8 × 0,7 = 56%."
      },
      {
        "tex": "a = \\dfrac{\\hat y_5}{0{,}5\\ \\text{s}}, \\qquad a \\in [-9,\\ 3]\\ \\text{m/s}^2",
        "read": "Trong lab: lấy độ đổi vận tốc dự đoán sau 0,5 s, chia 0,5 ra gia tốc, rồi giới hạn trong khoảng an toàn.",
        "ex": "ŷ₅ = −1,5 m/s → a = −3 m/s²."
      }
    ],
    "table": {
      "title": "Kết quả lab: hai bảng xếp hạng ngược nhau",
      "cols": [
        "Bộ điều khiển",
        "Sai số vòng hở",
        "Va chạm vòng kín"
      ],
      "rows": [
        [
          "PercMLP",
          "0,62 m (tốt nhất)",
          "0,8%"
        ],
        [
          "EgoMLP",
          "0,76 m",
          "24,1%"
        ],
        [
          "Giữ vận tốc",
          "1,24 m",
          "18,9%"
        ],
        [
          "IDM (luật)",
          "1,51 m (tệ nhất)",
          "0,1% (tốt nhất)"
        ]
      ]
    },
    "traps": [
      "Điểm vòng hở tốt chưa có nghĩa hệ thống lái tốt.",
      "Phát lại \"nhanh nhất có thể\" che mất lỗi xử lý trễ hạn.",
      "Một hạt giống không đại diện: va chạm EgoMLP từ 11,9% đến 35,9% tuỳ seed.",
      "Chọn sai loại tác nhân có thể chọn nhầm bộ lập kế hoạch.",
      "Chia dữ liệu theo quỹ đạo, không theo khung."
    ],
    "remember": [
      "Kiểm thử năm bậc: phát lại → vòng hở/kín → kịch bản → tác nhân phản ứng → chạy thật.",
      "Luôn so với một bộ luật đơn giản làm chuẩn trong vòng kín.",
      "Thất bại sớm, trong mô phỏng, rẻ hơn thất bại ngoài đường."
    ],
    "cards": [
      [
        "Ba mức phát lại khác nhau thế nào?",
        "Từ cảm biến thô (sát thật nhất), từ đầu ra nhận thức, hoặc chỉ một tiến trình (nhanh, cô lập nhất)."
      ],
      [
        "Thẻ lần chạy cần ghi gì để tái lập?",
        "Nhật ký, mã phần mềm, mô hình, hiệu chuẩn, hạt giống, cấu hình."
      ],
      [
        "Vì sao lái thử ngoài đường không đủ chứng minh an toàn?",
        "Cần ~275 triệu dặm không lỗi, tức 12,5 năm với 100 xe chạy liên tục."
      ],
      [
        "Vì sao PercMLP+ chỉ \"không kém IDM\"?",
        "Nó học từ nhãn do IDM gắn."
      ],
      [
        "Đổi bộ lập kế hoạch thì kiểm ở bậc nào?",
        "Vòng kín và bộ kịch bản."
      ],
      [
        "Đổi bộ nhận diện vật cản thì kiểm ở bậc nào?",
        "Phát lại nhật ký, rồi vòng hở."
      ]
    ]
  }
]
