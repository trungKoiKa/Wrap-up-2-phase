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
        "d": "Phân loại (1 nhãn), phát hiện (hộp + lớp), phân đoạn ngữ nghĩa (lớp mỗi pixel), phân đoạn thực thể (mặt nạ mỗi vật), panoptic (cả hai), keypoint (điểm khớp).",
        "ex": "Camera đếm xe và biết vùng mặt đường → panoptic."
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
    "analogy": "Bạn lái xe vào hầm và mất GPS. Bạn có hai manh mối: \"mình chạy 60 km/h trong 10 giây nên đã đi ~170 m\" (phỏng đoán) và \"bộ đếm bánh xe báo 150 m\" (cảm biến). Không nên chọn một bỏ một; hãy trộn cả hai và tin nhiều hơn vào cái chắc chắn hơn. Bộ lọc Kalman làm đúng việc đó, lặp đi lặp lại mỗi khoảnh khắc.",
    "why": "Kalman là phần \"dự đoán\" trong mọi tracker (Day 22) và là công cụ chính để hợp nhất LiDAR, radar, camera (Day 23). GPS điện thoại, drone, tàu Apollo đều dùng nó.",
    "steps": [
      "Biểu diễn niềm tin bằng một đường cong hình chuông: giá trị đoán + mức không chắc.",
      "Trộn hai niềm tin theo độ chắc chắn của từng cái.",
      "Lặp hai bước: dự đoán (bớt chắc) rồi cập nhật bằng phép đo (chắc hơn).",
      "Mở rộng sang nhiều chiều để ước lượng cả vận tốc chưa từng đo.",
      "Thế giới cong thì dùng EKF, UKF hoặc bộ lọc hạt; nhiều cảm biến thì cập nhật nhiều lần."
    ],
    "concepts": [
      {
        "t": "Niềm tin hình chuông",
        "en": "Gaussian belief",
        "d": "Thay vì một con số, ta giữ một giá trị đoán tốt nhất μ và độ không chắc σ. Đường cong càng hẹp càng chắc chắn.",
        "ex": "μ = 10 m, σ = 1,5 m: 68% khả năng sự thật nằm trong 8,5–11,5 m."
      },
      {
        "t": "Phương sai",
        "en": "variance σ²",
        "d": "Bình phương của σ. Bộ lọc theo dõi phương sai vì nó cộng và trộn rất gọn.",
        "ex": "Ký hiệu P trong bộ lọc chính là phương sai của ước lượng."
      },
      {
        "t": "Hợp nhất hai niềm tin",
        "en": "fusion",
        "d": "Trộn hai đường cong: kết quả nằm gần cái chắc hơn và luôn hẹp hơn cả hai đầu vào.",
        "ex": "Dự đoán 10 (var 4) + cảm biến 12 (var 1) → 11,6 (var 0,8)."
      },
      {
        "t": "Hệ số Kalman K",
        "en": "Kalman gain",
        "d": "Con số từ 0 đến 1 nói \"tin phép đo bao nhiêu phần\". K gần 1: tin cảm biến; K gần 0: tin dự đoán.",
        "ex": "Ra khỏi hầm, P rất lớn, GPS chính xác → K ≈ 1, ước lượng nhảy về GPS."
      },
      {
        "t": "Q và R",
        "en": "process / measurement noise",
        "d": "Q: ta nghi ngờ mô hình chuyển động bao nhiêu. R: ta nghi ngờ cảm biến bao nhiêu. Tỉ lệ Q : R quyết định hành vi bộ lọc.",
        "ex": "R lấy từ thông số cảm biến; Q chỉnh tới khi bám được chuyển động thật mà không đuổi theo nhiễu."
      },
      {
        "t": "Trạng thái ẩn",
        "en": "hidden state",
        "d": "Đại lượng cần biết mà không cảm biến nào đo trực tiếp. Bộ lọc suy ra nó từ quy luật chuyển động.",
        "ex": "LiDAR chỉ đo vị trí, nhưng bộ lọc vẫn ra vận tốc."
      },
      {
        "t": "EKF, UKF, bộ lọc hạt",
        "en": "nonlinear filters",
        "d": "Khi phép đo hay chuyển động là đường cong: EKF xấp xỉ bằng tiếp tuyến, UKF đẩy vài điểm đại diện qua hàm thật, bộ lọc hạt dùng hàng trăm phỏng đoán.",
        "ex": "Robot chưa biết mình ở cửa nào trong 3 cửa giống nhau → bộ lọc hạt."
      },
      {
        "t": "Hợp nhất nhiều cảm biến",
        "en": "sensor fusion",
        "d": "Mỗi cảm biến thêm chỉ là một bước cập nhật nữa với độ nhiễu riêng. Thứ tự cập nhật không quan trọng.",
        "ex": "LiDAR giỏi vị trí, radar giỏi tốc độ, camera giỏi loại vật."
      }
    ],
    "formulas": [
      {
        "tex": "x^- = x + u, \\qquad P^- = P + Q",
        "read": "Dự đoán: dịch giá trị đoán theo chuyển động đã biết u, và cộng thêm nghi ngờ Q.",
        "ex": "Thời gian trôi làm ta kém chắc hơn, không bao giờ chắc hơn."
      },
      {
        "tex": "K = \\dfrac{P^-}{P^- + R}",
        "read": "Mức tin phép đo = nghi ngờ vào dự đoán chia (nghi ngờ dự đoán + nhiễu cảm biến).",
        "ex": "P = 4, R = 1 → K = 0,8."
      },
      {
        "tex": "x = x^- + K\\,(z - x^-), \\qquad P = (1-K)\\,P^-",
        "read": "Cập nhật: nhích từ dự đoán về phía phép đo z một phần K; nghi ngờ giảm còn (1 − K).",
        "ex": "10 + 0,8·(12 − 10) = 11,6; P = 0,2·4 = 0,8."
      },
      {
        "tex": "P^- = F P F^{\\top} + Q, \\qquad K = P^- H^{\\top}\\!\\left(H P^- H^{\\top} + R\\right)^{-1}",
        "read": "Bản nhiều chiều của cùng ý tưởng: F mô tả chuyển động, H mô tả cảm biến thấy gì của trạng thái.",
        "ex": "Vận tốc không đổi: F = [[1, Δt], [0, 1]], H = [1, 0]."
      },
      {
        "tex": "\\dfrac{1}{\\sigma^2_{\\text{fused}}} = \\sum_i \\dfrac{1}{\\sigma_i^2}",
        "read": "\"Thông tin\" = 1/phương sai. Hợp nhất là cộng thông tin của các cảm biến.",
        "ex": "Phương sai 4, 1, 2 → 0,25 + 1 + 0,5 = 1,75 → phương sai 0,57."
      },
      {
        "tex": "\\sigma_{\\bar z} = \\dfrac{\\sigma}{\\sqrt{n}}",
        "read": "Trung bình n phép đo có sai số giảm theo căn n.",
        "ex": "Đo 100 lần thì sai số còn 1/10."
      }
    ],
    "table": {
      "title": "Hai núm vặn Q và R",
      "cols": [
        "",
        "Cảm biến tốt (R nhỏ)",
        "Cảm biến kém (R lớn)"
      ],
      "rows": [
        [
          "Mô hình tốt (Q nhỏ)",
          "Mượt và chính xác",
          "Rất mượt nhưng chậm nhận ra thay đổi"
        ],
        [
          "Mô hình kém (Q lớn)",
          "Bám nhanh nhưng chép cả nhiễu",
          "Không tin ai, độ bất định lớn"
        ]
      ]
    },
    "traps": [
      "Chỉ EKF cần tính đạo hàm (Jacobian); UKF và bộ lọc hạt thì không.",
      "Thêm cảm biến nhiễu không bao giờ có hại, miễn R của nó khai đúng.",
      "Lệch thời gian 50 ms khi vật chạy 20 m/s đã sai 1 m.",
      "Q, R khai quá nhỏ làm bộ lọc tự tin sai và bỏ qua dữ liệu mới.",
      "Gỡ lỗi bộ lọc: kiểm tra đơn vị và dấu thời gian trước tiên."
    ],
    "remember": [
      "Niềm tin = giá trị đoán + độ không chắc; trộn theo nghịch đảo phương sai.",
      "Dự đoán làm bất định tăng, cập nhật làm bất định giảm.",
      "R rác thì hợp nhất rác: khai đúng độ nhiễu của từng cảm biến."
    ],
    "cards": [
      [
        "Ước lượng trễ so với thực tế thì chỉnh gì?",
        "Tăng Q."
      ],
      [
        "Ước lượng bị giật thì chỉnh gì?",
        "Giảm Q hoặc tăng R."
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
        "Khi nào cần bộ lọc hạt?",
        "Khi niềm tin có nhiều đỉnh, không còn là một hình chuông."
      ],
      [
        "Radar và camera bù nhau thế nào?",
        "Radar chính xác theo tia nhìn, camera chính xác theo góc ngang."
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
        "t": "Một điểm LiDAR",
        "en": "point fields: x, y, z · intensity · ring · time offset",
        "d": "Mỗi điểm không chỉ có tọa độ. Intensity cho biết độ phản xạ của vật liệu; ring cho biết tia laser nào tạo ra điểm; time offset là thời điểm của điểm trong một vòng quét, cần để bù chuyển động; return type cho biết phản xạ đầu, mạnh nhất hay cuối.",
        "ex": "Thiếu cả một ring → nghi tia hỏng hoặc mưa sương; thiếu time offset → không deskew được khi xe quay nhanh."
      },
      {
        "t": "Hệ trục và phép biến đổi",
        "en": "coordinate frames · T_camera_lidar",
        "d": "LiDAR, camera, IMU, xe (ego) và bản đồ có trục khác nhau. Camera thường x phải, y xuống, z tới trước; LiDAR tùy driver và dataset. Mọi thứ phải về cùng một hệ, cùng đơn vị mét và radian, trước khi học.",
        "ex": "Test 5 phút: một điểm cách xe 10 m phía trước, sau biến đổi phải vẫn ở phía trước; chiếu lên camera phải nằm trong ảnh và có độ sâu dương."
      },
      {
        "t": "Tiền xử lý",
        "en": "crop · deskew · multi-sweep · voxelize",
        "d": "Cắt vùng theo tầm nhìn, bỏ NaN/Inf, bù chuyển động theo time offset, có thể bỏ mặt đường, gộp 2–10 lần quét, rồi chia voxel. Mỗi bước là một đánh đổi giữa độ trễ, khả năng thấy vật nhỏ và bộ nhớ.",
        "ex": "Cắt quá hẹp → bỏ sót người đi bộ ở rìa. Không deskew → xe quay nhanh làm vật bị kéo dài. Gộp nhiều lần quét mà sai pose → vật ma, vật nhân đôi."
      },
      {
        "t": "Cách biểu diễn point cloud",
        "en": "point-based · voxel · pillar / BEV · range image",
        "d": "Point-based học thẳng trên điểm, giữ chi tiết nhưng khó chạy realtime. Voxel + sparse convolution chính xác, tận dụng tính cục bộ nhưng tốn bộ nhớ theo độ phân giải. Pillar/BEV gộp chiều cao thành cột nên rất nhanh, dùng được CNN 2D nhưng mất chi tiết theo chiều đứng. Range image xếp điểm theo tia quét.",
        "ex": "Trong ADAS, detector thường dùng voxel hoặc pillar để đạt độ trễ; point-based hay gặp ở bước tinh chỉnh hộp hoặc phân đoạn."
      },
      {
        "t": "Voxel hoá",
        "en": "voxel_size · point_cloud_range · max_points_per_voxel",
        "d": "Chia không gian thành các ô 3D đều nhau để dữ liệu thưa thành tensor có cấu trúc. Voxel to thì nhanh nhưng mất vật nhỏ; voxel nhỏ thì chính xác hơn nhưng bộ nhớ và độ trễ tăng vọt.",
        "ex": "Đổi voxel_size hay point_cloud_range mà không đo lại độ trễ và lát vật nhỏ thì chưa đủ bằng chứng; kết quả cũng không còn so sánh công bằng với checkpoint cũ."
      },
      {
        "t": "PointPillars",
        "en": "PointPillars",
        "d": "Pillar là voxel không chia theo chiều cao. Mỗi cột được mã hoá bằng một PointNet nhỏ, xếp thành một \"ảnh giả\" nhìn từ trên xuống, rồi đưa qua CNN 2D và đầu dò hộp. Là baseline nhanh, dễ chạy demo.",
        "ex": "AP của người đi bộ, xe đạp thấp → kiểm tra mật độ điểm, vùng cắt và augmentation trước khi đổi mô hình."
      },
      {
        "t": "Đầu dò theo tâm",
        "en": "center-based head (CenterPoint)",
        "d": "Thay vì thử mọi hộp neo (anchor), mạng vẽ một bản đồ nhiệt (heatmap) đánh dấu tâm vật trên BEV, rồi hồi quy kích thước, độ cao z, góc yaw và vận tốc. Tâm vật cũng giúp nối với tracking bằng cách ghép tâm gần nhất.",
        "ex": "Khi debug: tâm trên heatmap có lệch không, yaw có bị quấn quanh ±π không, vận tốc từ nhiều lần quét có đúng hệ và đúng thời gian không."
      },
      {
        "t": "Quy ước hộp 3D",
        "en": "3D box convention: x, y, z, dx, dy, dz, yaw",
        "d": "Hộp 3D gồm tâm, ba kích thước và góc yaw (cộng lớp, điểm, vận tốc). Dataset khác nhau dùng tâm hộp hay tâm đáy, thứ tự kích thước và trục yaw khác nhau. Mô hình đúng mà đánh giá sai nếu quy ước không khớp.",
        "ex": "Hộp lơ lửng hoặc chui xuống đất → lẫn tâm và tâm đáy; xe xoay 90° → đảo dx, dy hoặc sai trục yaw; hộp khổng lồ → lẫn cm và m."
      },
      {
        "t": "Metric 3D và lát đánh giá",
        "en": "KITTI AP · nuScenes NDS · slices",
        "d": "KITTI chấm AP theo 2D, BEV, 3D với ngưỡng IoU, lớp và độ khó. nuScenes NDS kết hợp mAP với các lỗi vị trí, kích thước, hướng, vận tốc, thuộc tính. Ngoài ra cần độ trễ p50/p95 và lát theo khoảng cách, lớp, che khuất, thời tiết.",
        "ex": "mAP cao chưa đủ an toàn: phải xem riêng 0–20 m, 20–50 m, trên 50 m và người đi bộ gần xe."
      },
      {
        "t": "Chiếu LiDAR lên camera",
        "en": "LiDAR–camera projection K·[R | t]",
        "d": "Biến điểm LiDAR sang hệ camera bằng extrinsic [R | t], bỏ điểm có độ sâu không dương, rồi chiếu bằng intrinsic K ra điểm ảnh (u, v). Là bài test hiệu chuẩn rẻ nhất: điểm phải bám vào xe, cột, mép đường trên ảnh.",
        "ex": "Phủ điểm lên ảnh theo độ sâu; đo thêm sai số chiếu lại (reprojection error) và độ khớp cạnh theo thời gian. Thử ở mô phỏng."
      },
      {
        "t": "Cách ghép camera và LiDAR",
        "en": "point painting · frustum · BEV fusion · late fusion",
        "d": "Point painting: chiếu điểm vào ảnh để lấy nhãn ngữ nghĩa rồi đưa lại vào detector 3D. Frustum: detector 2D khoanh vùng, LiDAR tinh chỉnh. BEV fusion: đưa đặc trưng camera lên BEV rồi ghép với LiDAR. Late fusion: ghép kết quả cuối, dễ tích hợp nhưng khó tận dụng tương tác sâu.",
        "ex": "Ghép sớm nhạy với lệch hiệu chuẩn và chất lượng ảnh; ghép không tự làm hệ an toàn hơn nếu một cảm biến xấu mà không ai phát hiện."
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
    "why": "Có ID thì mới có lịch sử, vận tốc, hướng đi để dự đoán quỹ đạo và lập kế hoạch. Năm 2018, một xe thử nghiệm coi mỗi lần đổi nhãn là vật mới, xoá lịch sử chuyển động và không kịp phản ứng.",
    "steps": [
      "Mỗi khung: detector cho các hộp.",
      "Mỗi track cũ dự đoán vị trí mới bằng Kalman.",
      "Ghép track với hộp mới bằng bảng chi phí và thuật toán Hungarian.",
      "Cập nhật track đã ghép, tạo track mới, xoá track mất quá lâu.",
      "Đo chất lượng bằng MOTA, IDF1, HOTA."
    ],
    "concepts": [
      {
        "t": "Tracking-by-detection",
        "en": "tracking-by-detection",
        "d": "Cách phổ biến nhất: dùng detector có sẵn, tracker chỉ lo ghép hộp qua các khung. Tracker không thể tốt hơn detector.",
        "ex": "SORT, DeepSORT, ByteTrack đều theo cách này."
      },
      {
        "t": "Vòng đời một track",
        "en": "track lifecycle",
        "d": "Track mới ở trạng thái thử (tentative), đủ vài khung thì xác nhận (confirmed), mất hộp thì sang lạc (lost), lạc quá lâu thì bị xoá (removed).",
        "ex": "Bị che 18 khung với track_buffer = 30 → hiện lại vẫn giữ ID cũ."
      },
      {
        "t": "Bảng chi phí",
        "en": "cost matrix",
        "d": "Bảng điểm \"khác nhau bao nhiêu\" giữa mỗi track dự đoán và mỗi hộp mới. Có thể dựa vào chồng lấn (IoU), chuyển động (Mahalanobis) hoặc ngoại hình (Re-ID).",
        "ex": "SORT dùng chi phí = 1 − IoU."
      },
      {
        "t": "Hungarian",
        "en": "Hungarian matching",
        "d": "Thuật toán ghép một–một sao cho tổng chi phí nhỏ nhất. Tốt hơn ghép tham lam (chọn cặp rẻ nhất trước) vì không \"hy sinh\" cặp cuối.",
        "ex": "Trong Python: scipy.optimize.linear_sum_assignment."
      },
      {
        "t": "Re-ID",
        "en": "re-identification",
        "d": "Nén ảnh mỗi người thành một vector \"dấu vân ngoại hình\". Cùng người thì vector gần nhau, giúp nhận lại người sau khi bị che lâu.",
        "ex": "Vô dụng khi mọi người mặc đồng phục giống hệt."
      },
      {
        "t": "ByteTrack",
        "en": "ByteTrack",
        "d": "Người bị che thường vẫn được thấy nhưng điểm tin cậy thấp. ByteTrack dùng các hộp điểm thấp ở vòng ghép thứ hai để giữ track, nhưng không bao giờ tạo track mới từ chúng.",
        "ex": "Không cần Re-ID nên vẫn rất nhanh."
      },
      {
        "t": "OC-SORT và BoT-SORT",
        "en": "motion fixes",
        "d": "OC-SORT sửa dự đoán khi vật bị che rồi đổi hướng. BoT-SORT trừ chuyển động của chính camera (xe, drone) để vật đứng yên không bị tưởng là đang chạy.",
        "ex": "Thể thao → OC-SORT; camera gắn xe → BoT-SORT."
      },
      {
        "t": "ID switch",
        "en": "identity switch",
        "d": "Hai người đi ngang nhau và tracker đổi nhãn của họ. Đây là lỗi tracking quan trọng nhất.",
        "ex": "MOTA gần như không nhạy với lỗi này; IDF1 và HOTA thì nhạy."
      }
    ],
    "formulas": [
      {
        "tex": "c_{ij} = 1 - \\mathrm{IoU}(T_i, D_j)",
        "read": "Chi phí ghép track i với hộp j = 1 trừ độ chồng lấn.",
        "ex": "Chồng khít → chi phí gần 0."
      },
      {
        "tex": "d^2 = (x-\\mu)^{\\top}\\,\\Sigma^{-1}\\,(x-\\mu)",
        "read": "Khoảng cách Mahalanobis: khoảng cách đã chia theo độ không chắc của dự đoán, nên hướng nào chắc thì vùng chấp nhận hẹp.",
        "ex": "DeepSORT loại cặp có d² > 9,49."
      },
      {
        "tex": "\\cos\\theta = \\dfrac{u \\cdot v}{\\|u\\|\\,\\|v\\|}",
        "read": "Độ giống ngoại hình giữa hai vector Re-ID.",
        "ex": "Cùng người ≈ 0,9; người khác ≈ 0,2."
      },
      {
        "tex": "\\mathrm{MOTA} = 1 - \\dfrac{\\mathrm{FN} + \\mathrm{FP} + \\mathrm{IDSW}}{\\mathrm{GT}}",
        "read": "Độ chính xác = 1 trừ (bỏ sót + báo nhầm + đổi ID) chia tổng số vật thật.",
        "ex": "1 000 vật thật, 180 lỗi → 82%."
      },
      {
        "tex": "\\mathrm{IDF1} = \\dfrac{2\\,\\mathrm{IDTP}}{2\\,\\mathrm{IDTP} + \\mathrm{IDFN} + \\mathrm{IDFP}}",
        "read": "Đo mức giữ đúng một ID cho mỗi người suốt video.",
        "ex": "Một người, 6 khung ID 1 rồi 4 khung ID 2: IDF1 60%, trong khi MOTA 90%."
      },
      {
        "tex": "\\mathrm{HOTA} = \\sqrt{\\mathrm{DetA} \\times \\mathrm{AssA}}",
        "read": "Trung bình nhân của \"phát hiện tốt\" và \"giữ ID tốt\"; một bên tệ kéo cả điểm xuống.",
        "ex": "DetA 85%, AssA 45% → 61,8%."
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
          "Camera cố định, đông người, hay bị che",
          "ByteTrack",
          "Giữ track bằng hộp điểm thấp"
        ],
        [
          "Camera gắn xe hoặc drone",
          "BoT-SORT",
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
          "Drone bám theo một người",
          "Tracker SOT",
          "Bài toán một đối tượng, họ khác"
        ]
      ]
    },
    "traps": [
      "IoU = 0 khi vật chạy nhanh hoặc fps thấp, dù vẫn là cùng một vật.",
      "Hungarian chọn xong vẫn loại cặp có IoU dưới ngưỡng.",
      "StrongSORT với AFLink/GSI chạy offline, không hợp ứng dụng tức thời.",
      "MOTA cao chưa chắc giữ ID tốt.",
      "Nhãn đáp án (ground truth) sai thì điểm cũng sai theo."
    ],
    "remember": [
      "Tracking = detection + trí nhớ: dự đoán, ghép, cập nhật.",
      "Các tracker khác nhau ở bảng chi phí chứa gì và khi nào tin tín hiệu nào.",
      "MOTA thiên về phát hiện; IDF1, HOTA nhạy với việc giữ ID."
    ],
    "cards": [
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
      ]
    ]
  },
  {
    "id": "day23",
    "part": 23,
    "n": 23,
    "title": "3D, BEV & Sensor fusion",
    "question": "Chỉ có ảnh phẳng, làm sao biết vật cách bao nhiêu mét? Và khi nào phải nhờ LiDAR, radar, gộp chúng thế nào cho đúng?",
    "analogy": "Nhìn một chiếc xe trong ảnh, bạn đoán nó xa vì nó nhỏ và gần đường chân trời. Máy tính cũng phải đoán như vậy, vì camera làm mất độ sâu. LiDAR là thước đo khoảng cách bằng laser, radar là \"súng bắn tốc độ\". Mỗi giác quan có điểm mù riêng, gộp lại thì bù cho nhau.",
    "why": "Xe tự lái lập kế hoạch trên mặt đường theo mét, không theo pixel. BEV (nhìn từ trên xuống) là không gian chung cho mọi camera và cảm biến, và fusion quyết định xe có thấy người đi bộ trong đêm mưa hay không.",
    "steps": [
      "Hiểu vì sao một pixel là cả một tia: camera mất độ sâu.",
      "Detector 3D đơn ảnh đoán lại độ sâu rồi đổi ngược về toạ độ 3D.",
      "Đưa nhiều camera lên một bản đồ nhìn từ trên xuống (BEV).",
      "Hiệu chuẩn và đồng bộ thời gian giữa các cảm biến.",
      "Chọn cách hợp nhất, ghép phép đo với track rồi cập nhật bằng EKF."
    ],
    "concepts": [
      {
        "t": "Phép chiếu pinhole",
        "en": "pinhole projection",
        "d": "Camera biến điểm 3D (X, Y, Z) thành pixel (u, v) bằng cách chia cho độ sâu Z. Phép chia đó làm mất hẳn một chiều.",
        "ex": "Một chiếc hộp ở 10 m hay 45 m đều có thể rơi vào cùng một pixel."
      },
      {
        "t": "Intrinsic và extrinsic",
        "en": "calibration",
        "d": "Intrinsic (K): đặc tính riêng của cảm biến như tiêu cự, tâm ảnh. Extrinsic ([R | t]): cảm biến được lắp ở đâu, xoay hướng nào trên xe.",
        "ex": "Lệch 4° extrinsic đã làm mọi điểm LiDAR trượt khỏi vật trong ảnh."
      },
      {
        "t": "Hộp 3D bảy tham số",
        "en": "3D box",
        "d": "Tâm (x, y, z), kích thước (rộng, dài, cao) và góc hướng. Khó nhất là độ sâu z và góc hướng.",
        "ex": "Sai số mono 3D chủ yếu nằm ở độ sâu, không phải nhận nhầm loại."
      },
      {
        "t": "BEV",
        "en": "bird's-eye view",
        "d": "Bản đồ nhìn từ trên xuống quanh xe. Vật không bị méo phối cảnh, mọi cảm biến và tác vụ dùng chung một không gian.",
        "ex": "BEVFormer dùng lưới ~200 × 200 ô, mỗi ô ~0,5 m, phủ ±51 m."
      },
      {
        "t": "Bottom-up và top-down",
        "en": "image → BEV",
        "d": "Bottom-up: đoán độ sâu từng pixel rồi rải lên BEV (LSS, BEVDepth). Top-down: mỗi ô BEV hay truy vấn hỏi ngược vào ảnh (DETR3D, BEVFormer, PETR).",
        "ex": "Thêm khung trước đó (temporal) giúp ước lượng vận tốc và nhớ vật bị che."
      },
      {
        "t": "Ba loại cảm biến",
        "en": "camera, LiDAR, radar",
        "d": "Camera giỏi loại vật và góc ngang, kém độ sâu. LiDAR đo khoảng cách chính xác, kém trong sương mưa. Radar đo tốc độ và chạy mọi thời tiết, nhưng góc ngang thô.",
        "ex": "Radar chỉ đo được phần vận tốc dọc tia nhìn: xe chạy ngang gần như đo ra 0."
      },
      {
        "t": "Đồng bộ thời gian",
        "en": "synchronization",
        "d": "Hai cảm biến hiếm khi chụp cùng lúc. Lệch thời gian làm vật đang chạy bị lệch vị trí, vật đứng yên thì không.",
        "ex": "LiDAR quay một vòng mất ~100 ms nên cần bù chuyển động (de-skew)."
      },
      {
        "t": "Hai trục thiết kế fusion",
        "en": "fusion design",
        "d": "Trục 1: gộp ở tầng nào (dữ liệu thô / đặc trưng / hộp). Trục 2: gộp phép đo trước rồi mới theo dõi, hay giữ một track rồi cập nhật lần lượt từng cảm biến. Hai trục độc lập với nhau.",
        "ex": "Bài lab dùng một track, cập nhật lần lượt LiDAR rồi camera."
      },
      {
        "t": "Gating và ghép dữ liệu",
        "en": "data association",
        "d": "Trước khi cập nhật, phải biết phép đo thuộc track nào: loại phép đo quá xa (gating), ghép 1–1 (Hungarian), quản lý vòng đời track.",
        "ex": "Hai xe sát nhau: JPDA trộn theo xác suất, MHT giữ nhiều kịch bản rồi chốt sau."
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
          "Cần hiệu chuẩn, đồng bộ cực chuẩn"
        ],
        [
          "Mid: gộp đặc trưng (thường trên BEV)",
          "Cân bằng nhất, xu hướng hiện nay",
          "Phải huấn luyện chung, tốn dữ liệu"
        ],
        [
          "Late: gộp hộp / track",
          "Mỗi nhánh độc lập, dễ gỡ lỗi",
          "Mất thông tin thô"
        ]
      ]
    },
    "traps": [
      "Lỗi góc lắp đặt làm lệch mọi vật (xa càng tệ); lệch thời gian chỉ làm lệch vật đang chạy.",
      "Trục \"early/mid/late\" và trục \"gộp trước hay theo dõi trước\" là hai chuyện khác nhau.",
      "Phụ thuộc một cảm biến: chữa bằng modality dropout khi huấn luyện.",
      "Ở 49 m, camera gần như không giúp định vị; LiDAR gánh phần lớn.",
      "Báo cáo mô hình mà không nêu độ trễ là chưa đủ."
    ],
    "remember": [
      "Mọi detector 3D từ camera là một cách đoán lại độ sâu bị mất.",
      "BEV là \"ngôn ngữ chung\" để gộp nhiều camera và cảm biến.",
      "Fusion chỉ đúng khi hiệu chuẩn và đồng bộ đúng."
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
        "Waymo và Tesla khác triết lý cảm biến thế nào?",
        "Waymo dùng nhiều camera + LiDAR + radar; Tesla chỉ dùng camera."
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
    "why": "Mô hình chỉ giỏi bằng dữ liệu nó được xem. Lỗi dữ liệu (định dạng hộp sai, mẫu test lọt vào train, nhãn không nhất quán) làm điểm số đẹp giả mà không báo lỗi.",
    "steps": [
      "Dữ liệu đi qua năm chặng: sinh ra, nạp, lưu, biến đổi, phục vụ.",
      "Lưu theo ba lớp Bronze → Silver → Gold, có cổng kiểm tra.",
      "Chọn dữ liệu đáng gán nhãn và chia train/test không rò rỉ.",
      "Để máy gán nhãn trước, người kiểm theo mức độ tin cậy.",
      "Kiểm soát chất lượng nhãn và đo xem cách chọn mẫu có thật sự giúp."
    ],
    "concepts": [
      {
        "t": "Data engine",
        "en": "data flywheel",
        "d": "Vòng lặp 10 bước: ghi, lọc, nạp, đánh chỉ mục, chọn, gán nhãn, đóng gói, huấn luyện, đánh giá, triển khai. Lỗi phát hiện khi đánh giá trở thành dữ liệu cần thu thêm.",
        "ex": "Tesla lọc ngay trên xe; Waymo tìm cảnh hiếm trong log."
      },
      {
        "t": "Medallion",
        "en": "Bronze / Silver / Gold",
        "d": "Bronze giữ nguyên bản, chỉ ghi thêm. Silver làm sạch và gắn cờ. Gold là bộ dữ liệu huấn luyện. Silver và Gold luôn tạo lại được từ Bronze.",
        "ex": "Dòng lỗi được đẩy vào bảng telemetry_rejects kèm lý do."
      },
      {
        "t": "Event time",
        "en": "event time vs ingestion time",
        "d": "Ghép các luồng cảm biến theo thời điểm sự kiện xảy ra, không theo thời điểm dữ liệu tới hệ thống.",
        "ex": "LiDAR 10 Hz, camera 30 Hz, IMU 200 Hz đến lệch nhau."
      },
      {
        "t": "Idempotent",
        "en": "idempotent pipeline",
        "d": "Chạy lại bao nhiêu lần cũng ra cùng kết quả. Chạy lại một ngày thì ghi đè ngày đó, không ghi thêm.",
        "ex": "Ghi thêm làm 1 000 dòng của ngày 3 nhân đôi."
      },
      {
        "t": "Rò rỉ dữ liệu",
        "en": "leakage",
        "d": "Mẫu gần trùng với mẫu test lọt vào tập train, làm điểm đánh giá đẹp giả. Với video, các khung liền nhau gần như giống hệt.",
        "ex": "Phải chia theo cảnh, nơi, thời gian, không chia ngẫu nhiên theo khung."
      },
      {
        "t": "Nhãn là một đặc tả",
        "en": "labeling guideline",
        "d": "Cùng khung hình, quy tắc khác cho nhãn khác. Ngay cả người gán nhãn cũng không khớp nhau 100%, nhất là với vật nhỏ.",
        "ex": "Người dắt xe đạp: \"người đi bộ + xe đạp\" hay \"người đi xe đạp\"?"
      },
      {
        "t": "Pre-label và định tuyến",
        "en": "auto-label + routing",
        "d": "Mô hình lớn gán nhãn trước. Nhãn tin cậy cao tự nhận (kèm kiểm tra mẫu), tin cậy vừa cho người sửa, tin cậy thấp cho người vẽ lại.",
        "ex": "Grounding DINO cho hộp, SAM cho mặt nạ, người duyệt."
      },
      {
        "t": "Học chủ động",
        "en": "active learning",
        "d": "Chọn mẫu \"đáng gán nhãn nhất\" (mô hình đang không chắc, hoặc đa dạng). Phải thắng được cách chọn ngẫu nhiên đã tối ưu thì mới đáng dùng.",
        "ex": "Lợi ích thường nhỏ: 25,67 → 26,62 mIoU."
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
      "Nhãn máy chưa phải đáp án cho tới khi người duyệt.",
      "Người duyệt dễ gật đầu với nhãn máy sai (automation bias).",
      "Ngay cả test set công khai cũng có ≥ 3,3% nhãn sai.",
      "Giải mã video trên CPU thường là nút cổ chai."
    ],
    "remember": [
      "Giữ nguyên bản, mọi lớp sau đều tạo lại được; chạy lại phải cho cùng kết quả.",
      "Chia dữ liệu theo cảnh để tránh rò rỉ.",
      "Máy gán nhãn, máy kiểm tra, người quyết định."
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
