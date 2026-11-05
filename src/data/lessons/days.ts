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
      "Sensors & their limits (cảm biến và giới hạn): Mỗi cảm biến chỉ cho một phép đo nhiễu; chọn theo nhiệm vụ.",
      "Degradation & health (suy giảm và sức khoẻ): Biết khi nào cảm biến đang xấu đi và phản ứng theo mức.",
      "Calibration & time sync (hiệu chuẩn và đồng bộ): Ghép được nhiều cảm biến chỉ khi đúng chỗ, đúng lúc."
    ],
    "groups": [
      {
        "k": "sensor",
        "t": "Sensors & their limits (cảm biến và giới hạn)",
        "note": "Mỗi cảm biến chỉ cho một phép đo nhiễu; chọn theo nhiệm vụ."
      },
      {
        "k": "health",
        "t": "Degradation & health (suy giảm và sức khoẻ)",
        "note": "Biết khi nào cảm biến đang xấu đi và phản ứng theo mức."
      },
      {
        "k": "align",
        "t": "Calibration & time sync (hiệu chuẩn và đồng bộ)",
        "note": "Ghép được nhiều cảm biến chỉ khi đúng chỗ, đúng lúc."
      }
    ],
    "concepts": [
      {
        "g": "sensor",
        "t": "Measurement model (mô hình đo)",
        "en": "z = h(x) + noise",
        "d": "Cảm biến không cho sự thật x mà cho phép đo z: một hàm h của trạng thái cộng nhiễu.",
        "ex": "Radar đo khoảng cách và vận tốc hướng tâm, camera đo pixel: đều là \"hình chiếu\" nhiễu của vị trí xe.",
        "more": "Hiểu h và nhiễu của từng cảm biến là bước đầu để ghép chúng lại (Day 20, Day 23)."
      },
      {
        "g": "sensor",
        "t": "Sensor choice by task (chọn cảm biến theo nhiệm vụ)",
        "en": "camera · LiDAR · radar · sonar / ToF",
        "d": "Không có cảm biến tốt nhất, chỉ có cảm biến hợp nhiệm vụ, môi trường, ngân sách và mục tiêu an toàn.",
        "ex": "AEB cần camera để nhận ra người đi bộ, LiDAR hoặc radar để biết khoảng cách và tốc độ.",
        "more": "Camera giỏi nhận dạng (người, xe, biển báo, làn); LiDAR giỏi khoảng cách 3D chính xác; radar đo vận tốc, nhìn xa, chịu mưa sương; sonar/ToF rẻ, dùng ở cự ly gần. Đỗ xe dùng sonar; drone hạ cánh dùng rangefinder ToF. Còn phải tính sức tính toán của máy."
      },
      {
        "g": "sensor",
        "t": "Rolling vs global shutter (màn trập cuốn và toàn cục)",
        "en": "rolling shutter vs global shutter",
        "d": "Rolling shutter đọc ảnh từng hàng nên vật thẳng bị nghiêng khi camera rung hay quay nhanh; global shutter chụp mọi pixel cùng lúc.",
        "ex": "Cột điện nghiêng khi drone xoay nhanh: lỗi màn trập, không phải lỗi detector.",
        "more": "Camera trước của xe ADAS thường cần màn trập nhanh hoặc global shutter cùng HDR."
      },
      {
        "deep": true,
        "g": "sensor",
        "t": "Camera types (các loại camera)",
        "en": "mono · stereo · fisheye · thermal · event camera",
        "d": "Mỗi loại camera đổi một điểm yếu lấy một điểm mạnh: độ sâu, góc rộng, nhìn đêm hay tốc độ.",
        "ex": "Thermal thấy người đi bộ ban đêm mà camera RGB bỏ lỡ.",
        "more": "Mono RGB rẻ, giàu màu nhưng yếu khi chói, đêm, mưa. Stereo cho độ sâu nhưng cần bề mặt có vân và khoảng cách hai ống kính. Fisheye nhìn rộng, méo mạnh nên cần hiệu chuẩn kỹ. Event camera phản ứng rất nhanh, dải sáng rộng, nhưng dữ liệu thưa và khó xử lý. Robot trong nhà có thể dùng RGB-D; drone nhỏ ưu tiên camera nhẹ + optical flow + rangefinder."
      },
      {
        "deep": true,
        "g": "sensor",
        "t": "Radar types (các kiểu radar)",
        "en": "SRR / MRR / LRR · 4D imaging radar",
        "d": "Radar đo khoảng cách và vận tốc (Doppler), giữ được trong mưa sương, nhưng góc kém hơn camera và LiDAR.",
        "ex": "Cầu, rào chắn có thể tạo \"bóng ma\" radar do phản xạ nhiều đường (multipath).",
        "more": "Radar tầm ngắn (SRR) cho đỗ xe, điểm mù; tầm trung/xa (MRR, LRR) cho ACC, AEB trên cao tốc. Radar 4D đo thêm góc ngẩng. Trong mưa radar vẫn giữ được khoảng cách tới xe phía trước."
      },
      {
        "g": "health",
        "t": "Sensor degradation ladder (thang suy giảm)",
        "en": "vật lý → tín hiệu → nhận thức → thời gian → tính năng",
        "d": "Lỗi vật lý nhỏ lan dần thành tín hiệu xấu, nhận thức sai, track hỏng và cuối cùng là tính năng hỏng.",
        "ex": "Bùn che ống kính → bỏ sót người đi bộ → tracker mất ID → AEB phanh muộn.",
        "more": "Vật lý: mưa, sương, rung, chói, nước trên ống kính. Tín hiệu: mờ, nhiễu, mất điểm, bóng ma radar. Nhận thức: sai hộp, bỏ sót vật. Thời gian: đổi ID, rung, vật ma. Tính năng: phanh muộn, hạ cánh sai. Suy giảm không chỉ làm giảm mAP mà phá giả định của tracking, hợp nhất và điều khiển."
      },
      {
        "g": "health",
        "t": "Sensor health monitoring (theo dõi sức khoẻ cảm biến)",
        "en": "chỉ số chất lượng ghi log cùng timestamp",
        "d": "Biến chất lượng cảm biến thành con số ghi log theo thời gian để phát hiện sớm khi nó xấu đi.",
        "ex": "Số gói LiDAR mỗi khung tụt đột ngột báo mất gói trên đường truyền.",
        "more": "Camera: độ sáng, tỷ lệ điểm cháy sáng, độ nét (phương sai Laplacian), rớt khung. LiDAR: mật độ điểm theo khoảng cách, số gói mỗi khung. Radar: SNR, tỷ lệ bóng ma. Sonar/ToF: giá trị kẹt, ngoài tầm. Chéo giữa các cảm biến: sai lệch chiếu camera–LiDAR."
      },
      {
        "g": "health",
        "t": "Degradation levels S0–S3 (bốn mức suy giảm)",
        "en": "Normal · Mild · Degraded · Critical",
        "d": "Mỗi mức suy giảm có phản ứng riêng: từ dùng bình thường tới bỏ hẳn cảm biến và chuyển chế độ an toàn.",
        "ex": "Camera chói (S2) nhưng radar bình thường (S0): vẫn bám vật bằng radar.",
        "more": "S0: dùng bình thường. S1: ghi cảnh báo, làm mượt thêm, giảm trọng số một chút. S2: đổi trọng số hợp nhất, yêu cầu xe/robot chạy chậm lại. S3: không tin cảm biến nữa, tắt tính năng hoặc chuyển chế độ an toàn. Ví dụ: LiDAR mất gói (S3) + camera mưa (S2) → giảm tốc hoặc chuyển chế độ an toàn."
      },
      {
        "g": "align",
        "t": "Three calibration layers (ba lớp hiệu chuẩn)",
        "en": "intrinsics · extrinsics · temporal calibration",
        "d": "Intrinsic: cảm biến tự đo lệch ra sao; extrinsic: lắp ở đâu, hướng nào; thời gian: trễ bao nhiêu.",
        "ex": "Lệch cố định → extrinsic; lệch tăng theo tốc độ → thời gian; mép ảnh cong → intrinsic.",
        "more": "Intrinsic: tiêu cự, tâm ảnh, méo ống kính; sai thì chiếu sai ngay trong một ảnh. Extrinsic: phép biến đổi cứng giữa camera, LiDAR, radar, IMU và xe; sai thì hợp nhất lệch. Thời gian: độ lệch timestamp, độ trễ cảm biến; sai thì vật lệch theo vận tốc."
      },
      {
        "g": "align",
        "t": "Time sync & motion compensation (đồng bộ thời gian và bù chuyển động)",
        "en": "time sync · deskew",
        "d": "Các cảm biến không đo cùng lúc; phải đưa mọi phép đo về một thời điểm chung trước khi ghép.",
        "ex": "Không bù thời gian, vật đang chạy bị chiếu sai chỗ và tracker sinh vật ma. Thử ở mô phỏng.",
        "more": "Camera 30 Hz, LiDAR 10 Hz, radar 20 Hz. Cách làm: ghi timestamp gốc, đo độ trễ từng khâu, nội suy về một thời điểm hợp nhất chung và bù chuyển động của xe (deskew) trước khi ghép."
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
        "deep": true,
        "tex": "B = \\text{FPS} \\times W \\times H \\times \\text{bit depth}",
        "read": "Băng thông thô cần cho một camera = số khung mỗi giây × số điểm ảnh × số bit mỗi điểm.",
        "ex": "1920 × 1080, 12 bit, 30 fps ≈ 746 Mbit/s: đã sát mức 1 Gbit/s của cổng GigE."
      },
      {
        "deep": true,
        "tex": "x(t) = x(t_0) + \\dfrac{t - t_0}{t_1 - t_0}\\,\\bigl(x(t_1) - x(t_0)\\bigr)",
        "read": "Nội suy tuyến tính: ước lượng giá trị ở thời điểm hợp nhất t nằm giữa hai lần đo t₀ và t₁.",
        "ex": "LiDAR đo lúc 0 và 0,1 s; ảnh chụp lúc 0,03 s → lấy 30% đoạn đường giữa hai lần quét."
      },
      {
        "deep": true,
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
      "Hiệu chuẩn bằng bảng caro trong lab chính xác nhưng không mở rộng được cho cả đội xe; xe chạy ngoài đường cần hiệu chuẩn lại khi rung, tháo lắp, va chạm.",
      "Mô hình tốt trên benchmark sạch vẫn có thể hỏng trên cảm biến bẩn, lệch, không đồng bộ."
    ],
    "deepTraps": [
      "Đừng tin một lần đo đơn lẻ của radar hay sonar: cần lọc, yêu cầu xuất hiện liên tục, gating và cảm biến dự phòng.",
      "Auto-label từ nhiều cảm biến sai theo nếu hiệu chuẩn hoặc đồng bộ thời gian sai."
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
      "Why a filter (vì sao cần bộ lọc): Trộn dự đoán và phép đo để vừa mượt vừa đúng.",
      "The Kalman loop (vòng lặp Kalman): Dự đoán, cập nhật, và hai núm vặn Q, R.",
      "Curves: EKF, UKF, particles (khi quan hệ là đường cong): Ba cách đưa hình chuông qua hàm phi tuyến.",
      "Many sensors (nhiều cảm biến): Mỗi cảm biến thêm chỉ là một lần cập nhật nữa."
    ],
    "groups": [
      {
        "k": "why",
        "t": "Why a filter (vì sao cần bộ lọc)",
        "note": "Trộn dự đoán và phép đo để vừa mượt vừa đúng."
      },
      {
        "k": "loop",
        "t": "The Kalman loop (vòng lặp Kalman)",
        "note": "Dự đoán, cập nhật, và hai núm vặn Q, R."
      },
      {
        "k": "nonlin",
        "t": "Curves: EKF, UKF, particles (khi quan hệ là đường cong)",
        "note": "Ba cách đưa hình chuông qua hàm phi tuyến."
      },
      {
        "k": "multi",
        "t": "Many sensors (nhiều cảm biến)",
        "note": "Mỗi cảm biến thêm chỉ là một lần cập nhật nữa."
      }
    ],
    "concepts": [
      {
        "g": "why",
        "t": "When to use Kalman (khi nào cần bộ lọc)",
        "en": "ba điều kiện chung",
        "d": "Cần bộ lọc khi có một đại lượng ẩn, cảm biến nhiễu hoặc thiếu, và đại lượng đó đổi theo quy luật.",
        "ex": "Điện thoại trong hầm: mất GPS thì vẫn dự đoán vị trí, có GPS lại thì kéo về.",
        "more": "Ba điều kiện: (1) một đại lượng ẩn cần biết (vị trí, vận tốc), (2) cảm biến nhiễu, trễ hoặc thiếu (GPS mất hoặc nhảy vài chục mét), (3) đại lượng đó thay đổi theo một quy luật (vật lý chuyển động). Khi mất GPS, bước dự đoán vẫn chạy (dead reckoning)."
      },
      {
        "g": "why",
        "t": "Predict only vs sensor only vs fused",
        "en": "ba cách theo dõi một robot",
        "d": "Chỉ dự đoán thì mượt nhưng trôi; chỉ tin cảm biến thì giật; trộn cả hai thì vừa mượt vừa đúng.",
        "ex": "Demo trong slide: sai số 3,4 m (chỉ dự đoán), 2,6 m (chỉ cảm biến), 1,0 m (Kalman).",
        "more": "Chỉ dự đoán theo lệnh tốc độ thì trôi dần vì bánh xe trượt. Chỉ tin cảm biến thì đúng trung bình nhưng giật theo nhiễu."
      },
      {
        "g": "why",
        "t": "Gaussian belief (niềm tin hình chuông)",
        "en": "giá trị đoán μ + độ không chắc σ",
        "d": "Giữ một giá trị đoán μ kèm độ không chắc σ; hình chuông càng hẹp càng chắc.",
        "ex": "μ = 10 m, σ = 1,5 m: 68% khả năng sự thật nằm trong 8,5–11,5 m.",
        "more": "Phương sai σ² là thứ bộ lọc thực sự theo dõi (ký hiệu P) vì nó cộng và trộn rất gọn. Đo cùng một thứ n lần rồi lấy trung bình thì sai số giảm còn σ/√n."
      },
      {
        "g": "loop",
        "t": "Fusion of two beliefs (trộn hai niềm tin)",
        "en": "cân theo 1 / phương sai",
        "d": "Trộn hai hình chuông: kết quả nghiêng về cái chắc hơn và luôn hẹp hơn cả hai.",
        "ex": "Dự đoán 10 m (phương sai 4) + cảm biến 12 m (phương sai 1) → 11,6 m, phương sai 0,8. Thử ở mô phỏng \"Trộn hai niềm tin\".",
        "more": "Mỗi nguồn được cân theo 1 / phương sai: phương sai nhỏ (chắc hơn) thì nặng ký hơn."
      },
      {
        "g": "loop",
        "t": "Predict → update loop (vòng lặp dự đoán – cập nhật)",
        "en": "đoán trước, sửa bằng bằng chứng",
        "d": "Dự đoán: đoán vị trí mới và kém chắc hơn; cập nhật: có phép đo thì trộn vào và chắc hơn.",
        "ex": "Bộ lọc chỉ cần nhớ x và P, không cần lưu lịch sử.",
        "more": "Bước dự đoán dùng điều đã biết (tốc độ, lệnh điều khiển, vật lý); thời gian trôi nên độ không chắc tăng. Máy tính tàu Apollo chỉ có khoảng hai nghìn từ nhớ ghi được; việc chỉ cần nhớ x và P là điều kiện sống còn."
      },
      {
        "g": "loop",
        "t": "Kalman gain K & innovation (độ bất ngờ)",
        "en": "tin phép đo bao nhiêu phần",
        "d": "Độ bất ngờ = phép đo − dự đoán; K (0 đến 1) quyết định nhích về phía phép đo bao nhiêu phần.",
        "ex": "Vừa ra khỏi hầm: P rất lớn, GPS chính xác → K ≈ 1, ước lượng nhảy về GPS.",
        "more": "K gần 1: gần như theo hẳn cảm biến. K gần 0: gần như giữ dự đoán."
      },
      {
        "g": "loop",
        "t": "Process noise Q (nhiễu quá trình)",
        "en": "mình nghi mô hình chuyển động bao nhiêu",
        "d": "Q là độ nghi ngờ mô hình chuyển động, cộng vào P sau mỗi bước dự đoán; Q lớn thì tin cảm biến hơn.",
        "ex": "Q quá nhỏ: xe dừng đột ngột mà ước lượng vẫn \"chạy tiếp\". Thử ở mô phỏng \"Hai núm vặn Q và R\".",
        "more": "Mô hình chuyển động không bao giờ đúng hoàn toàn: bánh xe trượt, xe phía trước phanh gấp, gió đẩy drone. Q lớn → P sau dự đoán lớn → K lớn. Q quá lớn thì ước lượng giật theo từng phép đo nhiễu."
      },
      {
        "g": "loop",
        "t": "Measurement noise R (nhiễu đo)",
        "en": "mình nghi cảm biến bao nhiêu",
        "d": "R là độ tản mác của cảm biến; R lớn thì ít tin phép đo, ước lượng mượt nhưng chậm theo.",
        "ex": "Đo R bằng cách ghi cảm biến khi vật đứng yên rồi xem các lần đo tản mác bao nhiêu.",
        "more": "R nhỏ → K lớn → bám sát phép đo, kể cả nhiễu của nó. Có thể lấy R từ thông số kỹ thuật. Đặt R trước, rồi mới chỉnh Q cho tới khi bám được cú rẽ, cú phanh thật mà không đuổi theo nhiễu."
      },
      {
        "deep": true,
        "g": "loop",
        "t": "Q : R ratio (tỷ lệ hai núm vặn)",
        "en": "hành vi do tỷ lệ quyết định",
        "d": "Bám nhanh hay mượt do tỷ lệ Q : R quyết định; độ lớn tuyệt đối chỉ đổi mức tự tin của bộ lọc.",
        "ex": "Nhân cả Q và R lên 10 lần: đường ước lượng gần như không đổi, dải ±2σ rộng ra.",
        "more": "Độ lớn tuyệt đối của Q và R quyết định P lớn hay nhỏ, tức bộ lọc tự nhận mình chắc đến đâu."
      },
      {
        "deep": true,
        "g": "loop",
        "t": "Hidden state (trạng thái ẩn)",
        "en": "ước lượng điều chưa từng đo",
        "d": "Ước lượng được cả đại lượng không cảm biến nào đo, như vận tốc khi LiDAR chỉ đo vị trí.",
        "ex": "Vị trí cứ tăng dần cho bộ lọc biết vật đang chạy nhanh cỡ nào.",
        "more": "Trạng thái gồm [vị trí; vận tốc]. Mô hình vận tốc không đổi: vị trí mới = vị trí + vận tốc × Δt, vận tốc giữ nguyên (hơn kém chút ít)."
      },
      {
        "deep": true,
        "g": "loop",
        "t": "Covariance matrix P (ma trận hiệp phương sai)",
        "en": "bất định 2 chiều là một elip",
        "d": "Nhiều chiều thì P thành bảng: đường chéo là độ nghi ngờ từng đại lượng, ngoài chéo là chúng liên quan ra sao.",
        "ex": "P = [[2,25; 0,9]; [0,9; 1]]: đoán vị trí quá cao thì nhiều khả năng vận tốc cũng quá cao.",
        "more": "Vẽ ra thì P là một hình elip. Tương quan ρ > 0 nghĩa là sai số hai đại lượng cùng chiều."
      },
      {
        "g": "nonlin",
        "t": "Linear vs nonlinear (tuyến tính và phi tuyến)",
        "en": "vì sao Kalman thường cần bản mở rộng",
        "d": "Kalman gốc chỉ đúng với quan hệ đường thẳng; qua đường cong thì hình chuông bị méo.",
        "ex": "Radar đo khoảng cách r = √(x² + y²) và góc atan2(y, x): đều phi tuyến.",
        "more": "Đưa một hình chuông qua đường thẳng thì ra vẫn là hình chuông, nên công thức Kalman đúng. Xe ôm cua thì hướng đi đổi theo sin, cos, cũng phi tuyến."
      },
      {
        "g": "nonlin",
        "t": "EKF · Extended Kalman Filter (Kalman mở rộng)",
        "en": "thay đường cong bằng tiếp tuyến",
        "d": "Tại giá trị đoán, thay đường cong bằng tiếp tuyến rồi chạy Kalman bình thường.",
        "ex": "x ≈ 1 ± 0,5 qua y = x²: EKF ra trung bình 1, phương sai 1; đúng là 1,25 và 1,125.",
        "more": "Giống phóng to sát một đường cong thì thấy gần như thẳng. Độ dốc tiếp tuyến là đạo hàm; nhiều chiều thì gom thành ma trận Jacobian. Nhanh, dễ hiểu, nhưng phải tự tính đạo hàm và sai nhiều khi đường cong uốn mạnh trong vùng chưa chắc chắn. PX4 và ArduPilot (phần mềm bay của drone) dùng EKF."
      },
      {
        "g": "nonlin",
        "t": "UKF · Unscented Kalman Filter (Kalman dùng điểm sigma)",
        "en": "đẩy vài điểm đại diện qua hàm thật",
        "d": "Chọn vài điểm đại diện cho hình chuông, đưa từng điểm qua đúng hàm cong, rồi tính lại trung bình và phương sai.",
        "ex": "Ba điểm 0,134; 1; 1,866 qua y = x² cho đúng 1,25 và 1,125. Thử ở mô phỏng \"Hình chuông đi qua đường cong\".",
        "more": "Các điểm đó gọi là sigma points: một điểm giữa và các điểm hai bên, trọng số 1/6, 2/3, 1/6 trong ví dụ. Không cần đạo hàm, thường chính xác hơn EKF khi hàm cong mạnh, chi phí tương đương."
      },
      {
        "deep": true,
        "g": "nonlin",
        "t": "Particle filter (bộ lọc hạt)",
        "en": "hàng trăm phỏng đoán",
        "d": "Giữ niềm tin bằng hàng trăm \"hạt\" phỏng đoán; hạt khớp phép đo được giữ và nhân lên.",
        "ex": "Robot chưa biết đứng trước cửa nào trong 3 cửa giống nhau: niềm tin có 3 đỉnh.",
        "more": "Xử lý được niềm tin nhiều đỉnh mà một hình chuông không giữ được, đổi lại tốn tính toán. Ensemble Kalman (EnKF) trong dự báo thời tiết dùng ý tưởng gần giống: chạy 20–100 bản mô hình và ước lượng P từ độ phân tán của chúng."
      },
      {
        "g": "multi",
        "t": "Sensor fusion (hợp nhất nhiều cảm biến)",
        "en": "mỗi cảm biến là một lần cập nhật",
        "d": "Mỗi cảm biến thêm chỉ là một bước cập nhật nữa với H và R riêng; đến lúc nào thì dự đoán tới lúc đó rồi cập nhật.",
        "ex": "LiDAR giỏi vị trí, radar giỏi tốc độ, camera giỏi góc ngang: sai số khác hướng nên ghép lại tốt hơn.",
        "more": "Thứ tự cập nhật không quan trọng. Hợp nhất tập trung (đưa phép đo thô vào một bộ lọc) chính xác nhất; track-to-track (mỗi cảm biến một tracker rồi ghép) gọn hơn nhưng sai số có thể tương quan. LiDAR sợ mưa sương; radar chạy mọi thời tiết nhưng góc ngang thô; camera kém độ sâu."
      },
      {
        "deep": true,
        "g": "multi",
        "t": "Gating & outliers (cổng lọc ngoại lai)",
        "en": "loại phép đo bất ngờ quá mức",
        "d": "Loại phép đo có độ bất ngờ vượt khoảng 3 lần mức \"bình thường\" S để bóng ma không kéo giật ước lượng.",
        "ex": "Bóng ma radar lệch xa dự đoán bị bỏ qua thay vì kéo track đi.",
        "more": "Độ bất ngờ nên trông như nhiễu ngẫu nhiên với độ tản mác đúng bằng S; nếu không, Q hoặc R đang khai sai."
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
        "deep": true,
        "tex": "P^- = F P F^{\\top} + Q, \\qquad K = P^- H^{\\top}\\!\\left(H P^- H^{\\top} + R\\right)^{-1}",
        "read": "Bản nhiều chiều của cùng năm dòng: F mô tả chuyển động, H mô tả cảm biến thấy gì của trạng thái. Phần trong ngoặc là S, độ lớn kỳ vọng của độ bất ngờ.",
        "ex": "Vận tốc không đổi: F = [[1, Δt], [0, 1]], H = [1, 0] (cảm biến chỉ thấy vị trí)."
      },
      {
        "deep": true,
        "tex": "\\dfrac{1}{\\sigma^2_{\\text{fused}}} = \\sum_i \\dfrac{1}{\\sigma_i^2}",
        "read": "\"Thông tin\" = 1 / phương sai. Hợp nhất là cộng thông tin của các cảm biến.",
        "ex": "LiDAR 10,5 (phương sai 4), radar 12 (1), camera 11 (2): thông tin 0,25 + 1 + 0,5 = 1,75 → phương sai 0,57; trung bình 11,5."
      },
      {
        "deep": true,
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
        "deep": true,
        "tex": "\\chi \\in \\{\\mu,\\ \\mu \\pm \\sqrt{3}\\,\\sigma\\},\\quad w = \\tfrac{2}{3},\\ \\tfrac{1}{6},\\ \\tfrac{1}{6}",
        "read": "UKF một chiều: ba điểm sigma và trọng số của chúng; đưa từng điểm qua hàm thật rồi lấy trung bình có trọng số.",
        "ex": "μ = 1, σ = 0,5: điểm 1; 1,866; 0,134 → bình phương 1; 3,482; 0,018 → trung bình 1,25."
      },
      {
        "deep": true,
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
      "Thêm cảm biến nhiễu không bao giờ có hại, miễn R của nó khai đúng. R rác thì hợp nhất rác.",
      "Chỉ EKF cần tính đạo hàm (Jacobian); UKF và bộ lọc hạt thì không."
    ],
    "deepTraps": [
      "Đếm trùng: hai track \"độc lập\" nhưng chung một nguồn sai số làm kết quả hợp nhất quá tự tin. Hợp nhất phép đo thô, hoặc dùng covariance intersection (quy tắc hợp nhất thận trọng).",
      "Lệch thời gian 50 ms khi vật chạy 20 m/s đã sai 1 m: đồng bộ đồng hồ, gắn dấu thời gian lúc thu, hiệu chuẩn vị trí cảm biến.",
      "Gỡ lỗi bộ lọc: kiểm tra đơn vị và dấu thời gian trước tiên. Chưa chắc trạng thái ban đầu thì đặt P lớn; nó co lại nhanh."
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
      "LiDAR data & frames (dữ liệu LiDAR và hệ trục): Mỗi điểm mang gì, và đưa mọi thứ về cùng một hệ trục.",
      "Representations & detectors (biểu diễn và detector): Biến đám điểm thưa thành tensor rồi dò hộp 3D.",
      "LiDAR meets camera (LiDAR gặp camera): Chiếu điểm lên ảnh để kiểm hiệu chuẩn và ghép.",
      "Debugging (gỡ lỗi): Kiểm tra theo thứ tự, từ đọc dữ liệu tới metric."
    ],
    "groups": [
      {
        "k": "data",
        "t": "LiDAR data & frames (dữ liệu LiDAR và hệ trục)",
        "note": "Mỗi điểm mang gì, và đưa mọi thứ về cùng một hệ trục."
      },
      {
        "k": "repr",
        "t": "Representations & detectors (biểu diễn và detector)",
        "note": "Biến đám điểm thưa thành tensor rồi dò hộp 3D."
      },
      {
        "k": "cam",
        "t": "LiDAR meets camera (LiDAR gặp camera)",
        "note": "Chiếu điểm lên ảnh để kiểm hiệu chuẩn và ghép."
      },
      {
        "k": "debug",
        "t": "Debugging (gỡ lỗi)",
        "note": "Kiểm tra theo thứ tự, từ đọc dữ liệu tới metric."
      }
    ],
    "concepts": [
      {
        "g": "data",
        "t": "Point fields (các trường của một điểm LiDAR)",
        "en": "x, y, z · intensity · ring · time offset",
        "d": "Mỗi điểm LiDAR không chỉ có toạ độ mà còn độ phản xạ, tia nào tạo ra và thời điểm trong vòng quét.",
        "ex": "Thiếu time offset thì không bù chuyển động được khi xe quay nhanh.",
        "more": "Intensity: độ phản xạ của vật liệu. Ring: tia laser nào tạo ra điểm; thiếu cả một ring → nghi tia hỏng hoặc mưa sương. Time offset: thời điểm của điểm trong một vòng quét, cần để deskew. Return type: phản xạ đầu, mạnh nhất hay cuối."
      },
      {
        "g": "data",
        "t": "Coordinate frames (hệ trục và phép biến đổi)",
        "en": "T_camera_lidar · T_ego_sensor",
        "d": "LiDAR, camera, IMU, xe và bản đồ có trục khác nhau; mọi thứ phải về cùng một hệ, cùng mét và radian.",
        "ex": "Điểm 10 m phía trước, sau biến đổi phải vẫn ở phía trước và chiếu vào ảnh với độ sâu dương.",
        "more": "Camera thường x phải, y xuống, z tới trước; LiDAR tuỳ driver và dataset. Phép biến đổi viết dạng T_camera_lidar, T_ego_sensor. Bài test trên chỉ mất 5 phút.",
        "fig": "frames",
        "figCap": "LiDAR và camera dùng trục khác nhau; mọi thứ phải về cùng một hệ, cùng đơn vị trước khi học."
      },
      {
        "deep": true,
        "g": "data",
        "t": "Preprocessing (tiền xử lý)",
        "en": "crop · deskew · multi-sweep · voxelize",
        "d": "Cắt vùng, bỏ điểm lỗi, bù chuyển động, gộp vài lần quét rồi chia voxel; mỗi bước là một đánh đổi.",
        "ex": "Gộp nhiều lần quét mà sai pose → vật ma, vật nhân đôi.",
        "more": "Các bước: cắt vùng theo tầm nhìn, bỏ NaN/Inf, bù chuyển động theo time offset, có thể bỏ mặt đường, gộp 2–10 lần quét, chia voxel. Đánh đổi giữa độ trễ, khả năng thấy vật nhỏ và bộ nhớ. Cắt quá hẹp → bỏ sót người đi bộ ở rìa. Không deskew → xe quay nhanh làm vật bị kéo dài."
      },
      {
        "deep": true,
        "g": "data",
        "t": "Point cloud degradation (point cloud xuống cấp)",
        "en": "range dropout · motion smear · occlusion · drift",
        "d": "LiDAR tốt vẫn có lúc cho dữ liệu xấu: thưa ở xa, bị kéo khi quay, bị che, lệch hiệu chuẩn, điểm sai.",
        "ex": "Mưa sương và mặt hấp thụ làm mật độ điểm tụt (range dropout).",
        "more": "Xe quay nhanh mà thiếu thời gian từng điểm làm vật bị kéo (motion smear); xe lớn che người (occlusion); giá đỡ lỏng làm hiệu chuẩn trôi; kính và bề mặt phản xạ sinh điểm sai; mất gói làm thiếu cả mảng. Nên ghi log theo thời gian: số điểm mỗi khung, mật độ theo góc, tỷ lệ điểm lỗi, phân bố intensity, mất gói, khoảng hở thời gian, điểm khớp khi chiếu lên ảnh."
      },
      {
        "deep": true,
        "g": "data",
        "t": "Datasets & conventions (bộ dữ liệu và quy ước)",
        "en": "KITTI · nuScenes · Waymo · log của đội",
        "d": "Mỗi bộ dữ liệu có cách lắp cảm biến, hệ trục, bảng lớp, cách chia và metric riêng.",
        "ex": "nuScenes chỉ gán nhãn khung chính 2 Hz; KITTI ít cảnh nhưng file hiệu chuẩn rất quan trọng.",
        "more": "KITTI hợp để học chiếu LiDAR–camera và hộp 3D cơ bản; nuScenes có nhiều lần quét, radar, camera, LiDAR và metric NDS; Waymo lớn, nhiều ca hiếm; log robot/drone của đội là miền thật nhưng thiếu nhãn."
      },
      {
        "g": "repr",
        "t": "Point cloud representations (cách biểu diễn)",
        "en": "point-based · voxel · pillar / BEV · range image",
        "d": "Bốn cách biểu diễn: học thẳng trên điểm, chia voxel 3D, gộp thành cột (pillar/BEV) hoặc xếp theo tia (range image).",
        "ex": "Xe ADAS thường dùng voxel hoặc pillar để kịp độ trễ.",
        "more": "Point-based giữ chi tiết nhưng khó chạy realtime; hay gặp ở bước tinh chỉnh hộp hoặc phân đoạn. Voxel + sparse convolution chính xác nhưng tốn bộ nhớ theo độ phân giải. Pillar/BEV gộp chiều cao nên rất nhanh, dùng được CNN 2D nhưng mất chi tiết theo chiều đứng.",
        "fig": "pc-repr",
        "figCap": "Cùng một đám điểm: chia ô 3D (voxel), gộp chiều cao thành cột (pillar), rồi nhìn từ trên thành ảnh giả 2D (BEV)."
      },
      {
        "g": "repr",
        "t": "Voxelization (voxel hoá)",
        "en": "voxel_size · point_cloud_range · max_points_per_voxel",
        "d": "Chia không gian thành ô 3D đều nhau; ô to thì nhanh nhưng mất vật nhỏ, ô nhỏ thì tốn bộ nhớ và độ trễ.",
        "ex": "Đổi voxel_size mà không đo lại độ trễ và lát vật nhỏ thì chưa đủ bằng chứng. Thử ở mô phỏng.",
        "more": "Tham số chính: voxel_size, point_cloud_range, max_points_per_voxel. Đổi các tham số này thì kết quả không còn so sánh công bằng với checkpoint cũ."
      },
      {
        "g": "repr",
        "t": "PointPillars",
        "en": "pillar → PointNet → ảnh giả BEV → CNN 2D",
        "d": "Gộp điểm thành cột, mã hoá mỗi cột bằng PointNet nhỏ, xếp thành \"ảnh giả\" nhìn từ trên rồi chạy CNN 2D.",
        "ex": "Baseline nhanh, dễ chạy demo.",
        "more": "Pillar là voxel không chia theo chiều cao. Nếu AP của người đi bộ, xe đạp thấp → kiểm tra mật độ điểm, vùng cắt và augmentation trước khi đổi mô hình."
      },
      {
        "g": "repr",
        "t": "Center-based head (đầu dò theo tâm, CenterPoint)",
        "en": "heatmap tâm vật thay cho anchor",
        "d": "Mạng vẽ bản đồ nhiệt đánh dấu tâm vật trên BEV rồi hồi quy kích thước, độ cao, yaw và vận tốc.",
        "ex": "Tâm vật cũng giúp nối với tracking bằng cách ghép tâm gần nhất.",
        "more": "Thay cho việc thử mọi hộp neo (anchor). Khi debug: tâm trên heatmap có lệch không, yaw có bị quấn quanh ±π không, vận tốc từ nhiều lần quét có đúng hệ và đúng thời gian không."
      },
      {
        "g": "repr",
        "t": "3D box convention (quy ước hộp 3D)",
        "en": "x, y, z, dx, dy, dz, yaw",
        "d": "Hộp 3D gồm tâm, ba kích thước và yaw, nhưng mỗi dataset một quy ước; lệch quy ước là đánh giá sai.",
        "ex": "Hộp lơ lửng hoặc chui xuống đất → lẫn tâm hộp với tâm đáy.",
        "more": "Có thể kèm lớp, điểm, vận tốc. Khác nhau ở: tâm hộp hay tâm đáy, thứ tự kích thước, trục yaw. Xe xoay 90° → đảo dx, dy hoặc sai trục yaw; hộp khổng lồ → lẫn cm và m.",
        "fig": "box-conv",
        "figCap": "Lẫn tâm hộp với tâm đáy làm hộp lơ lửng h/2; yaw đo từ trục x và quấn ở ±π."
      },
      {
        "deep": true,
        "g": "repr",
        "t": "3D metrics & slices (metric 3D và lát đánh giá)",
        "en": "KITTI AP · nuScenes NDS · slices",
        "d": "KITTI chấm AP theo IoU, nuScenes dùng NDS; ngoài ra cần độ trễ và lát theo khoảng cách, lớp, thời tiết.",
        "ex": "Phải xem riêng 0–20 m, 20–50 m, trên 50 m và người đi bộ gần xe.",
        "more": "KITTI chấm AP theo 2D, BEV, 3D với ngưỡng IoU, lớp và độ khó. nuScenes NDS kết hợp mAP với lỗi vị trí, kích thước, hướng, vận tốc, thuộc tính. Độ trễ đo p50/p95. mAP cao chưa đủ an toàn."
      },
      {
        "g": "cam",
        "t": "LiDAR–camera projection (chiếu LiDAR lên ảnh)",
        "en": "K · [R | t]",
        "d": "Đưa điểm LiDAR sang hệ camera bằng [R | t], bỏ điểm phía sau, rồi chiếu bằng K ra pixel.",
        "ex": "Bài test hiệu chuẩn rẻ nhất: điểm phải bám vào xe, cột, mép đường. Thử ở mô phỏng.",
        "more": "Bỏ điểm có độ sâu không dương. Phủ điểm lên ảnh theo độ sâu; đo thêm sai số chiếu lại (reprojection error) và độ khớp cạnh theo thời gian."
      },
      {
        "deep": true,
        "g": "cam",
        "t": "Camera–LiDAR fusion styles (cách ghép camera và LiDAR)",
        "en": "point painting · frustum · BEV fusion · late fusion",
        "d": "Bốn kiểu ghép: tô nhãn ảnh lên điểm, dùng hộp 2D khoanh vùng, gộp trên BEV, hoặc ghép kết quả cuối.",
        "ex": "Ghép sớm nhạy với lệch hiệu chuẩn và chất lượng ảnh.",
        "more": "Point painting: chiếu điểm vào ảnh lấy nhãn ngữ nghĩa rồi đưa lại vào detector 3D. Frustum: detector 2D khoanh vùng, LiDAR tinh chỉnh. BEV fusion: đưa đặc trưng camera lên BEV rồi ghép với LiDAR. Late fusion: dễ tích hợp nhưng khó tận dụng tương tác sâu. Ghép không tự làm hệ an toàn hơn nếu một cảm biến xấu mà không ai phát hiện."
      },
      {
        "deep": true,
        "g": "cam",
        "t": "LiDAR helps camera labeling (LiDAR hỗ trợ gán nhãn ảnh)",
        "en": "project 3D box → 2D gợi ý · label QA · data mining",
        "d": "Chiếu hộp 3D lên ảnh để gợi ý hộp 2D, kiểm nhãn lệch và tìm khung khó để gán nhãn thêm.",
        "ex": "Một script phủ điểm lên ảnh thường đáng giá hơn một mô hình mới chưa debug dữ liệu.",
        "more": "Nhãn 2D không khớp phép chiếu → kiểm tra nhãn, hiệu chuẩn hoặc timestamp. Chọn các khung có vật xa, bị che, mật độ thấp hay chiếu lệch để gán nhãn và huấn luyện lại. Kèm một bảng thống kê chỗ lệch."
      },
      {
        "g": "debug",
        "t": "Debug order: 6 layers (thứ tự gỡ lỗi)",
        "en": "I/O → geometry → time → preprocess → model → metric",
        "d": "Detector 3D tệ thì kiểm theo thứ tự: I/O → hình học → thời gian → tiền xử lý → mô hình → metric.",
        "ex": "Đọc sai trường dữ liệu thì đổi mô hình cũng vô ích.",
        "more": "I/O: đọc đúng trường và frame chưa. Hình học: biến đổi và quy ước hộp. Thời gian: đồng bộ và deskew. Tiền xử lý: vùng cắt, voxel, bảng lớp có khớp lúc đánh giá không. Mô hình: checkpoint đúng dataset chưa. Metric: có đúng lát của bài toán không. Bằng chứng tối thiểu: in schema và thống kê điểm; vẽ 3D với một điểm tự đặt; đo khoảng hở thời gian; dump config; đo độ trễ p50/p95."
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
        "deep": true,
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
        "deep": true,
        "tex": "\\psi \\leftarrow \\operatorname{atan2}(\\sin\\psi,\\ \\cos\\psi)",
        "read": "Đưa góc yaw về khoảng (−π, π] để hai hộp cùng hướng không bị coi là lệch gần 2π.",
        "ex": "3,3 rad và −2,98 rad là cùng một hướng."
      },
      {
        "deep": true,
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
      "Đổi kích thước ảnh mà không scale fx, fy, cx, cy; dùng ảnh gốc chưa khử méo với intrinsic của ảnh đã khử méo."
    ],
    "deepTraps": [
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
      "Tracking basics (nền tảng tracking): Gắn ID ổn định qua các khung bằng vòng lặp bốn bước.",
      "Association (ghép track với hộp): Đo mức giống nhau rồi ghép một–một.",
      "Tracker families (các họ tracker): Mỗi tracker vá một điểm yếu của cái trước.",
      "Errors & metrics (lỗi và metric): Mỗi metric \"thích\" một kiểu tracker."
    ],
    "groups": [
      {
        "k": "basics",
        "t": "Tracking basics (nền tảng tracking)",
        "note": "Gắn ID ổn định qua các khung bằng vòng lặp bốn bước."
      },
      {
        "k": "assoc",
        "t": "Association (ghép track với hộp)",
        "note": "Đo mức giống nhau rồi ghép một–một."
      },
      {
        "k": "family",
        "t": "Tracker families (các họ tracker)",
        "note": "Mỗi tracker vá một điểm yếu của cái trước."
      },
      {
        "k": "eval",
        "t": "Errors & metrics (lỗi và metric)",
        "note": "Mỗi metric \"thích\" một kiểu tracker."
      }
    ],
    "concepts": [
      {
        "g": "basics",
        "t": "Detection vs tracking (phát hiện và theo dõi)",
        "en": "có gì, ở đâu → là ai, đi đâu",
        "d": "Detection cho biết \"có gì, ở đâu\" từng khung; tracking gắn thêm ID ổn định để biết \"là ai, đi đâu\".",
        "ex": "Detector báo \"3 người\"; tracker biết người số 2 đang đi sang phải 1,2 m/s.",
        "more": "Có ID mới có lịch sử: vận tốc, hướng đi, thời gian xuất hiện."
      },
      {
        "g": "basics",
        "t": "Tracking-by-detection (theo dõi dựa trên phát hiện)",
        "en": "detect → predict → associate → update",
        "d": "Dùng detector có sẵn; tracker chỉ ghép hộp qua các khung bằng vòng detect → predict → associate → update.",
        "ex": "3 track cũ, 4 hộp mới: ghép 3 cặp, hộp thừa sinh một track thử.",
        "more": "Đây là cách phổ biến nhất. Tracker không thể tốt hơn detector.",
        "fig": "track-loop",
        "figCap": "Bốn bước lặp lại ở mỗi khung; bước ghép (associate) là nơi các thuật toán khác nhau nhiều nhất."
      },
      {
        "g": "basics",
        "t": "Predict with Kalman (dự đoán bằng Kalman)",
        "en": "giả định vận tốc không đổi",
        "d": "Mỗi track dùng Kalman đẩy vị trí đi tiếp theo vận tốc cũ; không có hộp thì độ bất định tăng dần.",
        "ex": "Người đi sau cột rồi rẽ trái: dự đoán vẫn đi thẳng, hộp mới hiện ra lệch xa.",
        "more": "Giả định vận tốc không đổi (Day 20). Điểm yếu: lúc vật bị che mà rẽ, Kalman vẫn đi thẳng."
      },
      {
        "g": "basics",
        "t": "Track lifecycle (vòng đời một track)",
        "en": "tentative → confirmed → lost → removed",
        "d": "Track đi qua thử → xác nhận → lạc → xoá; lạc mà ghép lại kịp thì giữ ID cũ.",
        "ex": "Bị che 18 khung với track_buffer = 30: hiện lại vẫn là ID 1.",
        "more": "Đủ min_hits khung thì xác nhận (confirmed); mất hộp thì sang lạc (lost); lạc quá track_buffer khung thì bị xoá (removed). Bị che 40 khung thì track đã bị xoá, người hiện lại nhận ID mới.",
        "fig": "track-life",
        "figCap": "Hai tham số min_hits và track_buffer quyết định track sinh ra nhanh đến đâu và sống được bao lâu khi mất dấu."
      },
      {
        "g": "assoc",
        "t": "Cost matrix (bảng chi phí)",
        "en": "track dự đoán × hộp mới",
        "d": "Bảng điểm \"khác nhau bao nhiêu\" giữa mỗi track dự đoán và mỗi hộp mới.",
        "ex": "SORT dùng 1 − IoU; DeepSORT trộn Mahalanobis với độ giống ngoại hình.",
        "more": "Có thể dựa vào chồng lấn (IoU), chuyển động (Mahalanobis) hoặc ngoại hình (Re-ID); thường là tổng có trọng số của vài thước đo."
      },
      {
        "g": "assoc",
        "t": "IoU and its limits (IoU và giới hạn)",
        "en": "IoU · GIoU · DIoU · CIoU",
        "d": "IoU = giao / hợp: rẻ, nhưng bằng 0 khi hai hộp không chạm nhau dù là cùng một vật.",
        "ex": "Hai hộp 12 ô, giao 4 ô: IoU = 4 / 20 = 0,20.",
        "more": "Vật nhỏ ở xa, chạy nhanh hoặc fps thấp: dịch chuyển lớn hơn bề rộng hộp → IoU = 0, nên dùng khoảng cách tâm. GIoU, DIoU, CIoU phân biệt được \"gần\" và \"xa\" khi IoU = 0, chủ yếu dùng làm hàm mất mát khi huấn luyện detector."
      },
      {
        "g": "assoc",
        "t": "Re-ID (nhận lại theo ngoại hình)",
        "en": "appearance embedding · OSNet · BoT",
        "d": "Một CNN nén ảnh mỗi người thành vector \"vân ngoại hình\"; cùng người thì vector gần nhau.",
        "ex": "Cứu được khi người biến mất rồi quay lại hoặc đổi camera.",
        "more": "Đo bằng độ giống cosine. Tốn tính toán và vô dụng khi mọi người trông giống hệt nhau. OSNet khoảng 2,2 triệu tham số, chạy được trên CPU (mặc định khi bật Re-ID trong Ultralytics); BoT baseline (ResNet-50) khoảng 24 triệu tham số, chính xác hơn nhưng cần GPU."
      },
      {
        "g": "assoc",
        "t": "Hungarian vs greedy (ghép tối ưu và ghép tham lam)",
        "en": "tổng chi phí nhỏ nhất · O(n³)",
        "d": "Tham lam chọn cặp rẻ nhất trước; Hungarian tìm cách ghép một–một có tổng chi phí nhỏ nhất.",
        "ex": "Bảng [[1, 2, 6], [2, 8, 7], [6, 7, 3]]: tham lam 12, Hungarian 7. Thử ở mô phỏng.",
        "more": "Tham lam nhanh nhưng lựa chọn đầu \"ngon\" có thể kéo theo cặp cuối rất tệ (1 + 3 + 8). Hungarian (Kuhn–Munkres) ra 2 + 2 + 3, độ phức tạp O(n³). Chọn xong vẫn loại cặp có chi phí vượt ngưỡng. Trong Python: scipy.optimize.linear_sum_assignment."
      },
      {
        "deep": true,
        "g": "assoc",
        "t": "Motion gating (Mahalanobis)",
        "en": "tin dự đoán đến đâu thì chấp nhận đến đó",
        "d": "Chia khoảng cách theo độ bất định của dự đoán: hướng nào chắc thì vùng chấp nhận hẹp.",
        "ex": "DeepSORT loại cặp có d² > 9,4877 (chi-square 95%, 4 bậc tự do).",
        "more": "Kalman cho cả vùng bất định chứ không chỉ một điểm. Cặp vượt ngưỡng bị loại trước khi ghép. Điểm yếu: vật rẽ gấp hay đổi tốc độ đột ngột thì vùng dự đoán sai.",
        "fig": "mahalanobis",
        "figCap": "Vòng tròn coi mọi hướng như nhau nên nhận nhầm D2; elip biết hướng dọc đang chắc nên loại D2 và giữ D1."
      },
      {
        "g": "family",
        "t": "SORT → DeepSORT",
        "en": "motion + IoU → thêm ngoại hình",
        "d": "SORT: Kalman + Hungarian trên IoU, rất nhẹ; DeepSORT thêm ngoại hình và Mahalanobis để giữ ID khi bị che.",
        "ex": "DeepSORT giảm khoảng 45% số lần đổi ID so với SORT.",
        "more": "SORT (2016) mất ID khi bị che quá vài khung; hợp cảnh thưa, camera tĩnh. DeepSORT (2017) có \"matching cascade\": ưu tiên ghép track vừa mất trước, track mất lâu sau, vì dự đoán của track mất lâu kém tin cậy; hợp an ninh, bán lẻ hay bị che."
      },
      {
        "g": "family",
        "t": "ByteTrack",
        "en": "đừng vứt hộp điểm thấp",
        "d": "Đừng vứt hộp điểm thấp: ghép vòng hai bằng hộp điểm thấp cho các track chưa ghép được.",
        "ex": "Người bị kệ hàng che vẫn giữ ID vì hộp mờ của họ được dùng. Thử ở mô phỏng \"ByteTrack\".",
        "more": "Vòng 1 dùng hộp điểm cao cho mọi track; vòng 2 dùng hộp điểm thấp. Hộp điểm thấp không bao giờ tạo track mới. Không cần Re-ID nên vẫn rất nhanh; hợp camera cố định, đông người."
      },
      {
        "deep": true,
        "g": "family",
        "t": "OC-SORT",
        "en": "sửa Kalman khi bị che rồi đổi hướng",
        "d": "Khi tìm lại vật sau lúc bị che, dựng quỹ đạo ảo giữa hai lần thấy thật để sửa trạng thái Kalman.",
        "ex": "Hợp chuyển động phi tuyến: thể thao, nhảy múa.",
        "more": "Thêm ràng buộc hướng đi. Không cần Re-ID, nhanh gần bằng SORT. Vẫn không cứu được hai vật giống hệt đi sát nhau."
      },
      {
        "deep": true,
        "g": "family",
        "t": "BoT-SORT & StrongSORT",
        "en": "bù chuyển động camera · cộng dồn bản vá",
        "d": "BoT-SORT trừ chuyển động của chính camera; StrongSORT nâng từng mắt xích của DeepSORT.",
        "ex": "Camera gắn xe, drone → BoT-SORT.",
        "more": "BoT-SORT ước lượng chuyển động camera (optical flow/ECC) để vật đứng yên không bị tưởng là đang chạy. StrongSORT: trộn embedding mượt hơn, Kalman tin theo score, bù camera, nối track offline. StrongSORT với AFLink/GSI chạy offline, hợp phân tích video sau khi quay."
      },
      {
        "deep": true,
        "g": "family",
        "t": "Joint & end-to-end trackers (học luôn việc theo dõi)",
        "en": "FairMOT · CenterTrack · MOTR · SAM 2/3",
        "d": "Một mạng học luôn việc theo dõi thay vì detector rồi tracker riêng.",
        "ex": "SAM 2/3 rất mạnh để tạo nhãn video nhanh.",
        "more": "FairMOT: một mạng xuất cả hộp lẫn embedding. CenterTrack: dự đoán dịch chuyển tâm giữa hai khung. MOTR: mỗi vật là một \"track query\" của transformer. SAM 2/3: bám theo mask từ một điểm hay một mô tả chữ. Thực tế sản xuất: tracking-by-detection vẫn là \"ngựa thồ\" vì rẻ, dễ debug, tách được lỗi do detector hay do tracker."
      },
      {
        "g": "eval",
        "t": "Error types (các loại lỗi)",
        "en": "FN · FP · ID switch · fragmentation",
        "d": "Bốn loại lỗi: bỏ sót, hộp ma, đổi ID và quỹ đạo bị cắt thành nhiều đoạn.",
        "ex": "Đổi ID làm quỹ đạo dự đoán nhảy lung tung: xe phanh gấp hoặc không phanh.",
        "more": "FN: có vật thật mà không có hộp. FP: có hộp ở chỗ không có gì. ID switch: hai người giao nhau và nhãn bị hoán đổi; đây là lỗi quan trọng nhất với bài toán quỹ đạo. Fragmentation: một quỹ đạo bị cắt thành nhiều đoạn."
      },
      {
        "g": "eval",
        "t": "MOTA vs IDF1 vs HOTA",
        "en": "mỗi metric \"thích\" một kiểu tracker",
        "d": "MOTA chủ yếu đo detector; IDF1 phạt nặng việc đổi ID; HOTA cân bằng cả hai.",
        "ex": "Tracker A: MOTA 82, IDF1 61; tracker B: MOTA 68, IDF1 74. Dự đoán quỹ đạo thì chọn B. Thử ở mô phỏng.",
        "more": "MOTA = 1 − (FN + FP + IDSW) / GT: mỗi lần đổi ID chỉ tính một lỗi. IDF1 ghép mỗi người thật với đúng một ID cho cả video. HOTA = √(DetA × AssA), là metric chính của MOT Challenge; tracker B có HOTA 72. Đếm vật mỗi khung thì A đủ."
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
        "deep": true,
        "tex": "\\mathrm{GIoU} = \\mathrm{IoU} - \\dfrac{|C \\setminus (A \\cup B)|}{|C|}",
        "read": "C là hộp nhỏ nhất bao cả hai; phần thừa của C càng lớn (hai hộp càng xa) thì điểm càng âm.",
        "ex": "Hai hộp rời nhau: IoU = 0 cho cả trường hợp gần lẫn xa, GIoU thì phân biệt được."
      },
      {
        "deep": true,
        "tex": "d^2 = (x-\\mu)^{\\top}\\,\\Sigma^{-1}\\,(x-\\mu)",
        "read": "Khoảng cách Mahalanobis: khoảng cách đã chia theo độ không chắc của dự đoán, nên hướng nào chắc thì vùng chấp nhận hẹp.",
        "ex": "DeepSORT loại cặp có d² > 9,4877."
      },
      {
        "deep": true,
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
        "deep": true,
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
      "MOTA cao chưa chắc giữ ID tốt; đọc thêm IDF1 và HOTA."
    ],
    "deepTraps": [
      "Hạ ngưỡng điểm để khỏi mất người bị che thì hộp báo nhầm cũng thành track; ByteTrack giải quyết bằng vòng ghép thứ hai.",
      "StrongSORT với AFLink/GSI chạy offline, không hợp ứng dụng tức thời.",
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
    "why": "Xe tự lái lập kế hoạch trên mặt đường theo mét, không theo pixel. BEV (nhìn từ trên xuống) là không gian chung cho mọi camera và cảm biến, còn fusion quyết định xe có thấy người đi bộ khuất sau xe tải trong đêm mưa hay không. Dùng lại Kalman/EKF (Day 20) và ghép dữ liệu (Day 22).",
    "steps": [
      "Từ pixel về 3D: camera mất độ sâu, phải đoán lại.",
      "BEV: đưa mọi camera lên một bản đồ nhìn từ trên xuống.",
      "Cảm biến: mỗi loại giỏi một thứ, và phải căn đúng chỗ, đúng lúc.",
      "Fusion: gộp ở tầng nào, rồi cập nhật một track bằng EKF."
    ],
    "groups": [
      {
        "k": "pix3d",
        "t": "From pixel to 3D (từ pixel về 3D)",
        "note": "Camera làm mất độ sâu; mọi cách lấy 3D từ ảnh đều là đoán lại nó."
      },
      {
        "k": "bev",
        "t": "BEV (bird's-eye view)",
        "note": "Đưa nhiều camera về một bản đồ mặt đất chung."
      },
      {
        "k": "sensor",
        "t": "Sensors & alignment (cảm biến và căn chỉnh)",
        "note": "Camera, LiDAR, radar bù điểm mù cho nhau, nếu căn đúng chỗ và đúng lúc."
      },
      {
        "k": "fusion",
        "t": "Fusion (hợp nhất)",
        "note": "Chọn chỗ gộp, rồi mỗi cảm biến cập nhật cùng một track."
      }
    ],
    "concepts": [
      {
        "g": "pix3d",
        "t": "Depth ambiguity (một pixel là cả một tia)",
        "en": "camera mất độ sâu khi chiếu",
        "d": "Mọi điểm trên cùng một tia nhìn rơi vào cùng một pixel, nên một ảnh không cho biết vật xa bao nhiêu.",
        "ex": "Một hộp trong ảnh có thể là xe hơi ở 45 m hoặc vật nhỏ ở 10 m.",
        "more": "Muốn biết độ sâu phải thêm thông tin: kích thước đã biết của vật, chỗ vật chạm đất, hai góc nhìn (stereo, chuyển động) hoặc một cảm biến đo trực tiếp (LiDAR, radar).",
        "fig": "pixel-ray",
        "figCap": "Ba vật khác kích thước, khác độ sâu nhưng cùng nằm trên một tia nên cho cùng một pixel."
      },
      {
        "g": "pix3d",
        "t": "Pinhole projection & K⁻¹ (chiếu và giải mã ngược)",
        "en": "pixel = K · điểm 3D",
        "d": "Camera chia toạ độ cho độ sâu Z để ra pixel; biết pixel và đoán được z thì nhân K⁻¹ để lấy lại điểm 3D.",
        "ex": "Đây là bước cuối của mọi detector 3D từ camera.",
        "more": "K chứa tiêu cự và tâm ảnh. Công thức ngược: điểm 3D = z · K⁻¹ · [u, v, 1]. K, R, t do bộ dữ liệu (KITTI, nuScenes, Waymo) cung cấp sẵn nên người dùng dataset không cần tự hiệu chuẩn."
      },
      {
        "g": "pix3d",
        "t": "Ground contact (đặt chân xuống mặt đường)",
        "en": "Z = f · h / (v − c_y)",
        "d": "Xe đứng trên đường phẳng thì hàng pixel của chân xe cho ra khoảng cách.",
        "ex": "Chân xe 40 px dưới chân trời → 29,7 m; lệch 1 px → 29,0 … 30,5 m. Thử ở mô phỏng.",
        "more": "Với h = 1,65 m (độ cao camera), f = 720. Càng gần đường chân trời, lệch 1 pixel càng đổi nhiều mét; đường dốc hay xe nhún làm công thức sai."
      },
      {
        "g": "bev",
        "t": "BEV (bird's-eye view, nhìn từ trên xuống)",
        "en": "không gian chung cho mọi camera, cảm biến",
        "d": "Bản đồ mặt đất quanh xe, nơi vật có đúng kích thước và vị trí, mọi camera và cảm biến cùng vẽ lên.",
        "ex": "Trên ảnh xe xa nhỏ và méo; trên BEV hai xe cùng cỡ, làn song song.",
        "more": "Nhiều tác vụ (hộp, làn, bản đồ) dùng chung một bản đồ đặc trưng, và lập kế hoạch cũng làm việc trên mặt đất. Sáu camera kiểu nuScenes phủ kín 360°; BEVFormer dùng lưới khoảng 200 × 200 ô, mỗi ô 0,5 m, phủ ±51 m quanh xe.",
        "fig": "persp-vs-bev",
        "figCap": "Cùng hai chiếc xe: trong ảnh phối cảnh xe xa nhỏ và làn hội tụ; trên BEV hai xe cùng kích thước, làn song song."
      },
      {
        "g": "bev",
        "t": "Bottom-up: lift-splat (LSS, BEVDepth)",
        "en": "đoán độ sâu từng pixel rồi rải lên BEV",
        "d": "Mỗi pixel đoán một phân phối độ sâu dọc tia của nó, rồi rải đặc trưng vào các ô BEV theo phân phối đó.",
        "ex": "Đoán độ sâu không chắc thì đặc trưng bị nhoè dọc tia. Thử ở mô phỏng \"Lift-splat\".",
        "more": "Hình học rõ ràng, dễ debug theo độ sâu, nhưng phụ thuộc chất lượng độ sâu. BEVDepth giám sát độ sâu bằng LiDAR lúc huấn luyện để phân phối sắc nét hơn."
      },
      {
        "g": "bev",
        "t": "Top-down: queries (DETR3D, BEVFormer, PETR)",
        "en": "từ BEV / query hỏi ngược vào ảnh",
        "d": "Đi theo chiều ngược lại: mỗi ô BEV hay mỗi query chiếu điểm 3D của nó vào ảnh và lấy đặc trưng tại đó.",
        "ex": "DETR3D: mỗi query đoán một điểm 3D, nhìn vào camera thấy điểm đó, lặp 6 lớp.",
        "more": "DETR3D huấn luyện bằng ghép Hungarian nên không cần NMS. BEVFormer: mỗi ô BEV attend vào ảnh và vào BEV khung trước. PETR: cộng mã vị trí 3D vào đặc trưng ảnh, không cần chiếu. Hướng gần đây: sparse query + nhiều khung (StreamPETR, Sparse4D) để nhẹ hơn BEV dày mà vẫn mạnh."
      },
      {
        "g": "sensor",
        "t": "Camera vs LiDAR vs radar (mỗi loại giỏi một thứ)",
        "en": "ngữ nghĩa · hình học · vận tốc",
        "d": "Camera biết vật là gì, LiDAR đo hình dạng và khoảng cách, radar đo vận tốc và xuyên mưa.",
        "ex": "Đêm mưa, người khuất sau xe tải: mỗi cảm biến chỉ thấy lờ mờ, ghép lại mới chắc.",
        "more": "Camera rẻ, giỏi loại vật, biển báo, góc ngang; kém độ sâu, tối, chói. LiDAR đo khoảng cách trực tiếp bằng thời gian bay laser; thưa dần theo khoảng cách, kém trong sương mưa. Radar tầm xa trên 200 m, rẻ; phân giải góc thấp, nhiễu do lan can và đa đường."
      },
      {
        "g": "sensor",
        "t": "Radar Doppler (radar chỉ thấy một nửa vận tốc)",
        "en": "chỉ thành phần dọc tia nhìn",
        "d": "Radar chỉ đo phần vận tốc hướng về phía nó; phần chạy ngang thì không thấy.",
        "ex": "Xe chạy 15 m/s cắt ngang chéo: radar chỉ đo 3,9 m/s. Thử ở mô phỏng.",
        "more": "Đó là hiệu ứng Doppler: v_r = v cos(ψ − φ). Ví dụ trên: xe ở góc 25°, chạy hướng 100°; phần 14,5 m/s vuông góc với tia nhìn bị mất. Xe chạy ngang qua trục nhìn cho Doppler gần 0."
      },
      {
        "g": "sensor",
        "t": "Calibration & time sync (đúng chỗ, đúng lúc)",
        "en": "intrinsic · extrinsic · PTP · deskew",
        "d": "Hiệu chuẩn cho biết mỗi cảm biến đặt ở đâu và đo lệch bao nhiêu; đồng bộ cho biết mỗi phép đo xảy ra lúc nào.",
        "ex": "Lệch 4° góc lắp là mọi điểm LiDAR trượt khỏi vật trên ảnh.",
        "more": "Intrinsic (không đổi khi tháo lắp): K và méo ống kính của camera (đo bằng bàn cờ, phương pháp Zhang), bảng hiệu chỉnh từng tia LiDAR, bias IMU. Extrinsic: vị trí, hướng lắp so với xe; hai cảm biến gắn cứng thì giải AX = XB từ nhiều chuyển động. Đồng bộ: kích chụp phần cứng theo đồng hồ chung (PTP, GPS PPS), hoặc ghép timestamp gần nhất trong cửa sổ (ví dụ ±50 ms); LiDAR quét một vòng mất ~100 ms nên cần bù chuyển động (deskew). Trên xe thật hiệu chuẩn trôi theo thời gian, cần hiệu chuẩn lại trực tuyến."
      },
      {
        "g": "fusion",
        "t": "Early / mid / late fusion (hợp nhất ở tầng nào)",
        "en": "dữ liệu thô · đặc trưng · hộp / track",
        "d": "Gộp dữ liệu thô (early), gộp đặc trưng thường trên BEV (mid), hay gộp hộp đã phát hiện (late).",
        "ex": "Mid fusion (BEVFusion) là xu hướng chính vì cân bằng nhất.",
        "more": "Early giữ nhiều thông tin nhất nhưng cần hiệu chuẩn, đồng bộ cực chuẩn và một cảm biến hỏng làm hỏng cả đầu vào; ví dụ \"sơn\" mỗi điểm LiDAR bằng màu pixel nó chiếu tới. Late độc lập, dễ debug, nhưng nếu cả hai chỉ \"hơi thấy\" một vật thì khó cứu; ví dụ detector camera và detector LiDAR chạy riêng rồi Kalman hợp nhất các hộp.",
        "fig": "fusion-levels",
        "figCap": "Cùng hai cảm biến, ba chỗ cắt khác nhau trong pipeline."
      },
      {
        "g": "fusion",
        "t": "Track-then-fuse vs fuse-then-track (theo dõi trước hay gộp trước)",
        "en": "trục thứ hai, độc lập với early/mid/late",
        "d": "Một track nhận lần lượt phép đo của từng cảm biến (track-then-fuse), hay gộp các phép đo thành một rồi mới cập nhật (fuse-then-track).",
        "ex": "Lab Day 23: LiDAR rồi camera lần lượt update cùng một EKF.",
        "more": "Fuse-then-track cần tự thiết kế \"hàm gộp\" và rất nhạy lệch đồng bộ; PointPainting, BEVFusion thuộc loại này. Ô tô sản xuất còn có track-to-track: mỗi ECU cảm biến tự theo dõi rồi ECU trung tâm ghép track.",
        "fig": "track-fuse",
        "figCap": "Nhiều update lần lượt là track-then-fuse; gộp thành một z trước khi update là fuse-then-track."
      },
      {
        "g": "fusion",
        "t": "Multi-sensor EKF (EKF nhiều cảm biến)",
        "en": "một trạng thái, mỗi cảm biến một cặp (h, R)",
        "d": "Một trạng thái chung; mỗi cảm biến chỉ cần một hàm đo h(x) và độ nhiễu R riêng.",
        "ex": "Xe ở 50 m: LiDAR kéo phương sai 4,02 → 0,24; camera gần như không giúp (K ≈ −0,04).",
        "more": "LiDAR đo vị trí (tuyến tính); camera đo pixel (chia cho khoảng cách, phi tuyến); radar đo khoảng cách, góc, tốc độ hướng tâm (phi tuyến). Phi tuyến thì dùng Jacobian (EKF, Day 20). Camera yếu ở 49 m vì 1 pixel ứng với hơn 1 m."
      },
      {
        "deep": true,
        "g": "pix3d",
        "t": "3D box from an image (hộp 3D từ ảnh)",
        "en": "x, y, z · w, l, h · yaw θ",
        "d": "Hộp 3D có bảy số; khó nhất là độ sâu z và góc hướng θ.",
        "ex": "Xe ở X = −3 m, Z = 18 m, θ = 35° → α ≈ 44°.",
        "more": "Kích thước gần như cố định theo loại xe. Hình dạng xe trong ảnh phụ thuộc góc nhìn tới xe α chứ không phụ thuộc θ, nên mạng dự đoán α rồi đổi θ = α + arctan(x/z)."
      },
      {
        "deep": true,
        "g": "pix3d",
        "t": "Monocular 3D detector (detector 3D đơn ảnh)",
        "en": "SMOKE · FCOS3D · MonoFlex · CaDDN",
        "d": "Ảnh → backbone → các đầu dự đoán tâm, độ sâu, kích thước, hướng → giải mã bằng K⁻¹.",
        "ex": "Sai số chủ yếu ở độ sâu, không phải phân loại.",
        "more": "SMOKE bỏ hộp 2D; FCOS3D cho mỗi pixel dự đoán tất cả; MonoFlex xử lý riêng vật bị cắt biên và trộn nhiều ước lượng độ sâu; CaDDN dự đoán phân phối độ sâu rồi dựng BEV. Sai số định vị lớn là động lực chuyển sang nhiều camera và BEV."
      },
      {
        "deep": true,
        "g": "pix3d",
        "t": "Uncertainty-weighted depth loss (loss độ sâu có độ bất định)",
        "en": "L = |z − ẑ| / σ + log σ",
        "d": "Mạng đoán thêm độ không chắc σ để vật khó (xa, bị che) được giảm phạt.",
        "ex": "log σ ngăn mạng đặt σ vô hạn để né mọi lỗi.",
        "more": "Các đầu khác: heatmap dùng focal loss (đa số pixel là nền), kích thước dùng L1, hướng dùng sin/cos hoặc chia cung để tránh nhảy ở 0°/360°. Đây là lý do FCOS3D, MonoFlex, PGD chính xác hơn hẳn các bản đầu."
      },
      {
        "deep": true,
        "g": "pix3d",
        "t": "3D detection metrics (đo detector 3D)",
        "en": "KITTI AP₃D · nuScenes NDS · Waymo LET-3D-AP",
        "d": "KITTI ghép theo IoU 3D (rất khắt khe), nuScenes theo khoảng cách tâm, Waymo khoan dung sai số dọc.",
        "ex": "NDS: FCOS3D 42,8 → BEVFormer 56,9 → BEVFusion 72,9.",
        "more": "KITTI: xe cần IoU 3D ≥ 0,7, lệch vài chục cm là mất điểm. nuScenes ghép theo khoảng cách tâm 0,5 / 1 / 2 / 4 m và cộng năm sai số ATE, ASE, AOE, AVE, AAE thành NDS. CenterPoint (LiDAR) đạt 65,5. Waymo LET-3D-AP khoan dung theo phương dọc vì đó là lỗi vốn có của camera."
      },
      {
        "deep": true,
        "g": "bev",
        "t": "Temporal BEV & occupancy (BEV theo thời gian, lưới chiếm chỗ)",
        "en": "nhớ qua khung · ô 3D trống hay đặc",
        "d": "Gộp BEV khung trước để biết vận tốc và nhớ vật bị che; occupancy đoán từng ô 3D trống hay đặc thay vì vẽ hộp.",
        "ex": "Xe đổ, cần cẩu không có hộp chuẩn nhưng vẫn chiếm chỗ.",
        "more": "Temporal: dịch BEV khung trước theo chuyển động của xe rồi gộp với BEV hiện tại, cũng giảm nhiễu độ sâu. Occupancy xử lý vật hình dạng bất kỳ và không cần biết trước loại vật để \"không đâm\". Tesla giới thiệu Occupancy Network năm 2022; học thuật có Occ3D, SurroundOcc."
      },
      {
        "deep": true,
        "g": "fusion",
        "t": "Gating & data association (phép đo thuộc track nào)",
        "en": "gating · Hungarian · JPDA · MHT",
        "d": "Loại phép đo nằm ngoài vùng elip quanh dự đoán, rồi ghép 1–1 bằng Hungarian.",
        "ex": "Ngưỡng d² ≤ 5,99: giữ 0,2; 1,0; 4,1, loại 9,8; 14,5; 16,0.",
        "more": "d² = γᵀS⁻¹γ là ngưỡng chi-square 95% với 2 bậc tự do. Khi hai vật sát nhau, JPDA trộn có trọng số mọi phép đo trong vùng theo xác suất, MHT giữ nhiều kịch bản ghép song song vài khung rồi mới chốt."
      },
      {
        "deep": true,
        "g": "fusion",
        "t": "Ego localization fusion (biết mình ở đâu)",
        "en": "GNSS + IMU + odometry",
        "d": "GNSS cho vị trí tuyệt đối nhưng chậm, nhiễu; IMU nhanh nhưng trôi. Kalman lấy điểm mạnh của cả hai.",
        "ex": "Trong hầm chỉ trôi nhẹ, có tín hiệu lại thì kéo về.",
        "more": "GNSS sai ±1 đến vài m, 1–10 Hz, mất trong hầm. IMU chạy hàng trăm Hz nhưng tích phân làm sai số lớn dần. Robot kho, drone, xe tự lái đều chạy một bộ EKF hoặc SLAM như vậy ở bên dưới."
      },
      {
        "deep": true,
        "g": "fusion",
        "t": "Fusion failure modes (fusion hỏng ở đâu)",
        "en": "drift · lệch thời gian · phụ thuộc một cảm biến · chiếu nhầm",
        "d": "Hiệu chuẩn trôi, lệch thời gian, cảm biến bẩn, mô hình quá dựa vào LiDAR, điểm LiDAR rơi nhầm vào vật che.",
        "ex": "Tắt LiDAR là sụp: chữa bằng modality dropout khi huấn luyện.",
        "more": "Cổng ghép quá rộng ghép nhầm, quá hẹp bỏ sót. Ca 2016 (Florida): theo giải thích của hãng xe, camera không phân biệt được mặt hông trắng của xe đầu kéo với nền trời sáng. Một luật lọc nhiễu hợp lý ở tình huống này có thể sai chết người ở tình huống khác, nên cần gating cẩn trọng thay vì luật cứng theo từng cảm biến."
      },
      {
        "deep": true,
        "g": "fusion",
        "t": "Latency budget (ngân sách độ trễ)",
        "en": "mỗi 100 ms ở 50 km/h là 1,4 m",
        "d": "Mô hình giỏi mà chậm vẫn khiến xe không kịp phanh; perception chỉ có khoảng 50–100 ms.",
        "ex": "50 km/h, trễ tổng 270 ms → quãng dừng 19,8 m.",
        "more": "Ví dụ trong slide: perception 120 ms + planning và phanh 150 ms; người ở 40 m thì còn cách 20,2 m. BEV dày, backbone lớn phải giảm bằng quantization, TensorRT, sparse; đồng bộ nhiều cảm biến cũng tốn thời gian."
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
        "read": "Đặt chân xuống đường: khoảng cách = tiêu cự × độ cao camera chia khoảng cách từ chân vật tới đường chân trời (pixel).",
        "ex": "720 · 1,65 / 40 = 29,7 m."
      },
      {
        "tex": "v_r = v\\cos(\\psi - \\varphi)",
        "read": "Radar đo vận tốc hướng tâm = tốc độ × cos(góc giữa hướng chạy ψ và tia nhìn φ).",
        "ex": "15 × cos 75° ≈ 3,9 m/s."
      },
      {
        "deep": true,
        "tex": "\\theta = \\alpha + \\arctan\\dfrac{x}{z}",
        "read": "Góc hướng thật = góc nhìn tới xe + góc lệch của xe so với trục camera.",
        "ex": "Hình dạng xe trong ảnh phụ thuộc α, nên mạng dự đoán α rồi đổi ra θ."
      },
      {
        "deep": true,
        "tex": "\\mathcal{L}_z = \\dfrac{|z - \\hat z|}{\\sigma} + \\log\\sigma",
        "read": "Mạng tự đoán độ không chắc σ: vật khó được giảm phạt, nhưng log σ ngăn σ vô hạn.",
        "ex": "Lý do FCOS3D, MonoFlex chính xác hơn bản đầu."
      },
      {
        "deep": true,
        "tex": "\\mathrm{NDS} = \\tfrac{1}{10}\\Bigl[\\,5\\,\\mathrm{mAP} + \\sum \\bigl(1 - \\min(1, \\mathrm{mTP})\\bigr)\\Bigr]",
        "read": "Điểm nuScenes = gộp \"tìm đúng\" (mAP) và năm loại sai số vị trí, kích thước, hướng, vận tốc, thuộc tính.",
        "ex": "FCOS3D 42,8 → BEVFusion 72,9."
      },
      {
        "deep": true,
        "tex": "d^2 = \\gamma^{\\top} S^{-1} \\gamma \\le 5{,}99",
        "read": "Cổng gating: độ bất ngờ γ chia theo độ lớn kỳ vọng S; vượt ngưỡng chi-square 95% (2 bậc tự do) thì loại.",
        "ex": "d² = 4,1 giữ lại; d² = 9,8 loại."
      },
      {
        "deep": true,
        "tex": "\\dfrac{\\partial u}{\\partial p_y} = -\\dfrac{f}{p_x}",
        "read": "Jacobian của mô hình đo camera: độ nhạy của pixel theo vị trí ngang giảm khi vật ở xa.",
        "ex": "Vì vậy ở 49 m camera gần như không giúp định vị."
      },
      {
        "deep": true,
        "tex": "s = v\\,t \\approx 13{,}9\\ \\tfrac{\\text{m}}{\\text{s}} \\times 0{,}1\\ \\text{s} \\approx 1{,}4\\ \\text{m}",
        "read": "Ở 50 km/h, mỗi 100 ms trễ xe đi thêm 1,4 m trước khi kịp phản ứng.",
        "ex": "Perception chỉ có ngân sách ~50–100 ms."
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
      "Radar không thấy vận tốc ngang: xe cắt ngang có thể đo gần 0."
    ],
    "deepTraps": [
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
      "Data flow (dòng dữ liệu): Từ vài TB mỗi giờ tới vài khung hình đáng giá, theo một vòng lặp.",
      "Storage & processing (lưu trữ và xử lý): Lưu thô, làm sạch, kiểm tra và chạy lại được.",
      "Choosing & splitting data (chọn và chia dữ liệu): Lấy đúng khung cần học, chia sao cho test không rò rỉ.",
      "Labels (nhãn): Nhãn là đặc tả; máy gán trước, người duyệt và kiểm."
    ],
    "groups": [
      {
        "k": "flow",
        "t": "Data flow (dòng dữ liệu)",
        "note": "Từ vài TB mỗi giờ tới vài khung hình đáng giá, theo một vòng lặp."
      },
      {
        "k": "store",
        "t": "Storage & processing (lưu trữ và xử lý)",
        "note": "Lưu thô, làm sạch, kiểm tra và chạy lại được."
      },
      {
        "k": "select",
        "t": "Choosing & splitting data (chọn và chia dữ liệu)",
        "note": "Lấy đúng khung cần học, chia sao cho test không rò rỉ."
      },
      {
        "k": "label",
        "t": "Labels (nhãn)",
        "note": "Nhãn là đặc tả; máy gán trước, người duyệt và kiểm."
      }
    ],
    "concepts": [
      {
        "g": "flow",
        "t": "Data funnel (pipeline là phễu)",
        "en": "vài TB mỗi giờ vào, vài khung hình ra",
        "d": "Một xe ghi vài TB mỗi giờ; qua bộ lọc có chủ đích, dataset chỉ còn vài khung hình đáng giá.",
        "ex": "8 camera ≈ 5,4 TB/giờ thô; mã hoá video còn khoảng 36 GB/giờ.",
        "more": "Thô khoảng 3–6 TB mỗi giờ tuỳ cảm biến: 8 camera × 1080p × 30 fps × 3 byte ≈ 5,4 TB/giờ; mã hoá 10 Mbps mỗi camera nhỏ hơn cỡ 150 lần. Hai câu hỏi dẫn dắt: cái gì đến được mô hình, và ai quy định ý nghĩa của một nhãn.",
        "fig": "data-funnel",
        "figCap": "Từ terabyte thô tới vài khung hình có nhãn: mỗi tầng lọc bớt và làm sạch hơn."
      },
      {
        "g": "flow",
        "t": "Five pipeline stages (năm chặng của pipeline)",
        "en": "generation → ingestion → storage → transformation → serving",
        "d": "Pipeline nào cũng qua năm chặng: sinh, nạp, lưu, biến đổi, phục vụ.",
        "ex": "Lab Day 24: FFmpeg lấy 2 khung/giây → Bronze → Silver → Gold → Postgres → Metabase.",
        "more": "Sinh dữ liệu (camera xe), nạp (Kafka, upload S3), lưu (lakehouse), biến đổi (Spark, dbt), phục vụ (huấn luyện, dashboard). Bên dưới là ba lớp xuyên suốt: điều phối (lịch chạy, thử lại), chất lượng (kiểm tra từng chặng), bảo mật (quyền truy cập, ẩn danh). Trong lab, Airflow điều phối, dbt + DuckDB làm cổng kiểm tra."
      },
      {
        "g": "flow",
        "t": "Data engine (vòng lặp dữ liệu 10 bước)",
        "en": "record → trigger → ingest → index → curate → label → dataset → train → eval → deploy",
        "d": "Mười bước nối thành vòng: lỗi tìm thấy khi đánh giá trở thành dữ liệu cần thu thêm.",
        "ex": "Vòng hay hỏng vì không đo được, nhãn đến trễ, leakage hoặc không ai chịu trách nhiệm.",
        "more": "record → trigger → ingest → index → curate → label → dataset → train → eval → deploy. Bốn kiểu flywheel khác nhau ở phần được tự động: trigger-first (lọc ngay trên xe), search-first (tìm cảnh hiếm trong log), rollout-first (robot chạy, người sửa lỗi), generate-first (sinh video rồi lọc). Mỗi bước cần một đầu ra và một người sở hữu.",
        "fig": "data-engine",
        "figCap": "Mười bước khép thành vòng: eval chỉ ra chỗ yếu, curate thu thêm đúng dữ liệu đó."
      },
      {
        "deep": true,
        "g": "flow",
        "t": "Batch vs streaming ingest (nạp theo lô hay theo luồng)",
        "en": "Kafka · Airbyte · upload S3",
        "d": "Batch gom cả ca rồi upload (rẻ, trễ cỡ giờ); streaming đẩy từng sự kiện (trễ cỡ giây, tốn vận hành).",
        "ex": "Telemetry → Kafka; video, ảnh → upload thẳng S3.",
        "more": "Tệp video đi thẳng vào object storage; hàng đợi chỉ mang sự kiện nhỏ. Telemetry liên tục → Kafka/Kinesis; database, SaaS → Airbyte theo lịch; video, ảnh → S3/GCS."
      },
      {
        "g": "store",
        "t": "Medallion: Bronze / Silver / Gold",
        "en": "nguyên bản → làm sạch → dataset huấn luyện",
        "d": "Bronze giữ nguyên bản chỉ ghi thêm, Silver làm sạch và gắn cờ, Gold là dataset huấn luyện.",
        "ex": "Silver và Gold luôn tạo lại được từ Bronze.",
        "more": "Bronze: append-only, kèm metadata (nguồn, giờ nhận, checksum), áp schema khi đọc; ví dụ uri s3://fleet/raw/car12/cam3.mp4, event_ts 14:03:11, ingested 21:04:52. Silver: thống nhất đơn vị (m/s, độ, UTC), đẩy dòng lỗi sang bảng reject kèm lý do, gắn cờ chất lượng cho mỗi khung."
      },
      {
        "g": "store",
        "t": "Event time vs ingestion time (thời điểm xảy ra và thời điểm đến)",
        "en": "join theo event time · watermark",
        "d": "Ghép các luồng cảm biến theo lúc sự kiện xảy ra, không theo lúc dữ liệu tới hệ thống.",
        "ex": "Ảnh chụp lúc 14:03 tới lúc 21:04: ghép với LiDAR lúc 14:03.",
        "more": "LiDAR 10 Hz, camera 30 Hz, IMU 200 Hz đến theo cụm; phải chờ một khoảng (watermark) cho dữ liệu đến muộn rồi mới ghép.",
        "fig": "event-time",
        "figCap": "Ba luồng khác nhịp; dấu đỏ là thời điểm ghép theo event time, sau khi chờ dữ liệu đến muộn."
      },
      {
        "g": "store",
        "t": "Orchestration & idempotent backfill (điều phối và chạy lại an toàn)",
        "en": "DAG · Airflow / Dagster · ghi đè partition",
        "d": "Chạy lại một partition hỏng phải ghi đè partition đó để chạy bao nhiêu lần cũng ra cùng kết quả.",
        "ex": "5 ngày × 1 000 hàng, chạy lại ngày 3: ghi đè vẫn 5 000, ghi thêm thành 6 000.",
        "more": "Bộ điều phối (Airflow, Dagster, Prefect, Flyte) lên lịch, thử lại và chạy bù (backfill) cả đồ thị các bước (DAG). Ghi thêm làm ngày 3 nhân đôi."
      },
      {
        "g": "store",
        "t": "Automated data quality (kiểm chất lượng tự động)",
        "en": "Great Expectations · Soda · dbt tests",
        "d": "Kiểm tra viết thành code, chạy mỗi lần có dữ liệu mới; trượt một kiểm tra là lô đó dừng.",
        "ex": "Bốn số [100, 60, 50, 80] đọc ba kiểu đều hợp lệ nhưng ra ba hộp khác nhau. Thử ở mô phỏng.",
        "more": "Công cụ: Great Expectations, Soda, dbt tests. Bảng: schema, null, khoảng giá trị, độ tươi, trùng lặp. Ảnh và video: khung đen, khung mờ, hộp nằm ngoài ảnh. Với hộp: kiểm phạm vi và vẽ thử vài hộp sau mỗi lần xuất nhãn (xywh góc, xyxy, xywh tâm)."
      },
      {
        "deep": true,
        "g": "store",
        "t": "Lakehouse & table formats (lakehouse và định dạng bảng)",
        "en": "object storage · Parquet · Delta / Iceberg / Hudi",
        "d": "Lakehouse vừa rẻ như data lake vừa có bảng và giao dịch như warehouse; video nằm ở object storage, bảng giữ con trỏ.",
        "ex": "Delta/Iceberg cho đọc lại phiên bản cũ (time travel).",
        "more": "Warehouse có ACID nhưng đắt, không chứa video; data lake rẻ nhưng không có ACID. Bảng giữ (id, ts, uri, nhãn). Parquet lưu theo cột nên truy vấn hai cột chỉ đọc hai cột. Delta/Iceberg/Hudi coi mỗi commit là một danh sách tệp, tệp cũ không sửa. Xoá dòng mà quên xoá tệp → tệp mồ côi; tệp bị sửa mà bảng không biết → cần checksum."
      },
      {
        "deep": true,
        "g": "store",
        "t": "ELT for video & decode bottleneck (ELT cho video và nút cổ chai giải mã)",
        "en": "nạp trước, biến đổi sau · Spark / Flink / dbt",
        "d": "ELT nạp tệp gốc trước rồi mới biến đổi, vì giải mã video quá nặng để làm giữa đường.",
        "ex": "Video 30 fps lấy mỗi khung thứ 6 → khung 0, 6, 12, 18, 24.",
        "more": "ETL (biến đổi rồi mới nạp) bị kẹt ở bước giải mã. Chỉ dòng metadata đi qua bảng. Chọn engine theo độ trễ: Spark cho lô cả ngày, Flink cho từng sự kiện trong vài giây, dbt cho SQL theo lịch. Giải mã trên CPU thường là nút cổ chai; giảm tải bằng FFmpeg, NVIDIA DALI (GPU), Ray Data. Video fps không cố định làm lệch chỉ số khung giữa nhãn và ảnh."
      },
      {
        "deep": true,
        "g": "store",
        "t": "Lineage & dataset versioning (dấu vết nguồn gốc và phiên bản)",
        "en": "OpenLineage · DataHub · DVC / lakeFS",
        "d": "Lineage ghi mỗi bảng, mô hình được tạo từ đâu; một phiên bản dataset = commit dữ liệu + split + mã xử lý.",
        "ex": "lane-frames v3: lakefs://frames@c7f2a91, split by_scene (seed 7), code git 4be90d1.",
        "more": "Công cụ: OpenLineage, DataHub (lineage); DVC, lakeFS (phiên bản). Lineage cho phép truy ngược từ mô hình về log gốc."
      },
      {
        "g": "select",
        "t": "Data selection: triggers & embedding search (chọn dữ liệu)",
        "en": "shadow mode · CLIP / SigLIP · vector search",
        "d": "Trigger trên xe ghi lại cảnh mô hình lệch người lái; embedding cho tìm khung hình bằng một câu mô tả.",
        "ex": "\"xe máy cắt ngang trong mưa\" → embedding → FAISS / pgvector → các khung gần nhất.",
        "more": "Trigger (shadow mode): khi dự đoán lệch hành vi người lái quá ngưỡng thì ghi một snapshot ngắn để tải lên; khớp thì bỏ qua. Embedding (CLIP, SigLIP) đưa ảnh và câu chữ vào cùng không gian; người duyệt kết quả tìm được. Kho vector khác: Milvus."
      },
      {
        "g": "select",
        "t": "Split by scene (chia theo cảnh để tránh rò rỉ)",
        "en": "leakage giữa các khung liền nhau",
        "d": "Khung liền nhau gần như giống hệt, nên phải chia train/test theo cảnh chứ không theo khung.",
        "ex": "Minh hoạ trong slide: chia theo khung val 95%, theo cảnh chỉ 70%. Thử ở mô phỏng.",
        "more": "Chia ngẫu nhiên theo khung thì mỗi khung test có \"anh em\" gần trùng ở train, điểm đẹp giả. Có thể chia theo chuyến hoặc theo cụm. Nghiên cứu đã tìm thấy leakage chưa biết ngay trong KITTI."
      },
      {
        "g": "label",
        "t": "Label is a specification (nhãn là một đặc tả)",
        "en": "guideline · đồng thuận giữa người gán",
        "d": "Cùng khung hình, guideline khác cho nhãn khác; ngay cả người với người cũng không khớp 100%.",
        "ex": "Người dắt xe đạp: guideline A gán \"pedestrian\" + \"bicycle\", guideline B gán \"cyclist\".",
        "more": "Mức bất đồng giữa người gán là \"sàn nhiễu\" của phép đo, nhất là với vật nhỏ. Mỗi dạng nhãn (hộp 2D, mask, hộp 3D + track ID, làn, occupancy, quỹ đạo, ngôn ngữ) cần guideline và cách đo đồng thuận riêng. Waymo: ba lượt gán lại của người đạt IoU 3D trung bình 80,92% so với nhãn gốc. Test set công khai có ít nhất 3,3% nhãn sai trung bình."
      },
      {
        "g": "label",
        "t": "Pre-labeling with foundation models (gán nhãn sẵn bằng mô hình lớn)",
        "en": "Grounded-SAM · Autodistill · SAM 2",
        "d": "Mô hình lớn gán nhãn trước, người duyệt sửa; nhãn máy chỉ thành đáp án sau khi người duyệt.",
        "ex": "SAM 2 giảm thời gian vẽ mask từ 37,8 s xuống 4,5 s mỗi khung.",
        "more": "Grounded-SAM: câu chữ (\"car . pedestrian\") → Grounding DINO ra hộp → SAM ra mask → người duyệt. Autodistill: mô hình lớn (base) gán nhãn cho mô hình nhỏ (target) chạy trên xe. Mô hình càng tốt, người càng chuyển từ vẽ sang duyệt (SAM 2 nhanh 8,4 lần)."
      },
      {
        "g": "label",
        "t": "Confidence routing (định tuyến theo độ tin cậy)",
        "en": "tự chấp nhận · người kiểm · gán lại",
        "d": "Nhãn máy điểm cao tự nhận, điểm vừa để người kiểm, điểm thấp thì gán lại.",
        "ex": "Ngưỡng minh hoạ: ≥ 0,9 tự nhận; 0,4–0,9 người kiểm; < 0,4 gán lại. Thử ở mô phỏng \"Định tuyến nhãn máy\".",
        "more": "Định tuyến theo điểm tin cậy và mức bất đồng giữa hai mô hình. Làn tự nhận vẫn audit mẫu. Ngưỡng phải hiệu chỉnh trên tập gold. Người duyệt dễ gật đầu với nhãn máy sai (automation bias): đo bằng lỗi cấy sẵn, tập gold không pre-label, tỷ lệ chấp nhận theo từng người."
      },
      {
        "deep": true,
        "g": "label",
        "t": "Offboard auto-labeling (gán nhãn ngoại tuyến)",
        "en": "dùng cả khung tương lai · Waymo 3DAL",
        "d": "Gán nhãn ngoại tuyến được dùng cả khung tương lai và mô hình nặng, nên chính xác hơn trên xe.",
        "ex": "Waymo 3DAL: 3D AP@0.7 đạt 85,37 cho xe.",
        "more": "Trên xe chỉ có quá khứ và bị giới hạn độ trễ. 3DAL: chuỗi LiDAR → detector 5 khung → tracking → hiệu chỉnh riêng vật tĩnh / động → hộp 3D theo track; tracking + hiệu chỉnh cộng 8,39 điểm AP@0.8. Học trò học 10% nhãn người + 90% nhãn máy đạt 70,0 AP, gần 71,2 khi dùng 100% nhãn người."
      },
      {
        "deep": true,
        "g": "label",
        "t": "Human audit (kiểm nhãn người)",
        "en": "gold ~10% · audit 10–20%",
        "d": "Nhãn người cũng phải kiểm; con số chất lượng nhãn luôn kèm cỡ mẫu đã audit.",
        "ex": "Audit 200 nhãn, thấy 8 lỗi → precision 96% trên 200 nhãn.",
        "more": "Người thứ hai kiểm mọi nhãn, hoặc auditor kiểm ngẫu nhiên 10–20%. Tập gold khoảng 10%."
      },
      {
        "deep": true,
        "g": "label",
        "t": "Confident learning (tìm nhãn sai bằng dự đoán ngoài mẫu)",
        "en": "K-fold · ma trận nhãn × dự đoán · cleanlab",
        "d": "Cho mô hình dự đoán trên dữ liệu nó chưa thấy, đặt cạnh nhãn đang có; chỗ lệch là nghi ngờ nhãn sai.",
        "ex": "Khoảng 645 ảnh \"missile\" trong ImageNet có thể bị gán nhầm thành \"projectile\".",
        "more": "Dùng K-fold; công cụ cleanlab. Với detection, gắn cờ ba loại: thiếu vật (dự đoán chắc mà không có nhãn), hộp lệch, sai lớp."
      },
      {
        "deep": true,
        "g": "label",
        "t": "Active learning (học chủ động)",
        "en": "uncertainty · core-set · BADGE",
        "d": "Chọn mẫu đáng gán nhãn nhất theo độ bất định, độ đa dạng hoặc cả hai, thay vì chọn ngẫu nhiên.",
        "ex": "Ví dụ trong slide: ngẫu nhiên 25,67 mIoU, cách tốt nhất 26,62, toàn bộ nhãn 26,83.",
        "more": "Uncertainty: mẫu gần biên quyết định. Core-set: phủ đều không gian. BADGE: kết hợp cả hai. Entropy 25,91; core-set 25,96. Phải thắng baseline ngẫu nhiên đã tối ưu, cùng tập khởi đầu, nhiều seed, thì mới đáng dùng.",
        "fig": "al-bars",
        "figCap": "Các chiến lược chọn mẫu chỉ hơn ngẫu nhiên (đã tối ưu) một chút; trục dọc bắt đầu từ 25."
      },
      {
        "deep": true,
        "g": "label",
        "t": "Teacher–student self-training (tự huấn luyện thầy–trò)",
        "en": "pseudo-label · Noisy Student",
        "d": "Thầy học nhãn người rồi gán nhãn giả; trò học nhãn giả có thêm nhiễu rồi thành thầy mới.",
        "ex": "Noisy Student: 300 triệu ảnh không nhãn, 88,4% top-1 ImageNet.",
        "more": "Nhiễu: dropout, augmentation. Lỗi của thầy có thể lan sang trò. 3DAL khi đổi miền dữ liệu: 59,4 → 64,2 AP. Các lựa chọn ngân sách khác: tiền huấn luyện tự giám sát (MAE) khi nhiều dữ liệu chưa nhãn; mua nhãn người cho test set và lớp an toàn."
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
        "deep": true,
        "tex": "\\text{precision} = 1 - \\dfrac{8}{200} = 96\\%",
        "read": "Kiểm 200 nhãn thấy 8 lỗi thì độ chính xác nhãn 96%, và phải ghi kèm cỡ mẫu đã kiểm.",
        "ex": "Mốc tham chiếu: người gán ~10%, kiểm 10–20%."
      },
      {
        "deep": true,
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
      "Nhãn máy chưa phải đáp án cho tới khi người duyệt; người duyệt dễ gật đầu với nhãn máy sai."
    ],
    "deepTraps": [
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
    "why": "VLM là mô hình đứng sau auto-label của Day 24: tạo nhãn, tìm cảnh hiếm, sinh lập luận cho xe tự lái. Nhưng nó có thể trả lời đúng mà không thực sự nhìn ảnh, nên phải biết khi nào tin, khi nào kiểm. VLA đưa VLM tới hành động; mô hình quyết định thì chỉ chọn đáp án.",
    "steps": [
      "VLM architecture (kiến trúc VLM): Ảnh thành token rồi cùng chữ đi vào LLM.",
      "Using a VLM (dùng VLM cho dữ liệu): Đọc đúng đầu ra, giữ chi phí, và luôn kiểm chéo.",
      "Training (huấn luyện): Năm giai đoạn, từ căn chỉnh tới học tăng cường.",
      "From words to action (từ chữ tới hành động): VLA sinh hành động; mô hình quyết định chỉ chọn đáp án."
    ],
    "groups": [
      {
        "k": "arch",
        "t": "VLM architecture (kiến trúc VLM)",
        "note": "Ảnh thành token rồi cùng chữ đi vào LLM."
      },
      {
        "k": "use",
        "t": "Using a VLM (dùng VLM cho dữ liệu)",
        "note": "Đọc đúng đầu ra, giữ chi phí, và luôn kiểm chéo."
      },
      {
        "k": "train",
        "t": "Training (huấn luyện)",
        "note": "Năm giai đoạn, từ căn chỉnh tới học tăng cường."
      },
      {
        "k": "act",
        "t": "From words to action (từ chữ tới hành động)",
        "note": "VLA sinh hành động; mô hình quyết định chỉ chọn đáp án."
      }
    ],
    "concepts": [
      {
        "g": "arch",
        "t": "VLM architecture (kiến trúc VLM)",
        "en": "vision encoder → projector → LLM",
        "d": "ViT rút đặc trưng từ các mảnh ảnh, projector đổi thành token ảnh, rồi LLM đọc cùng token chữ và trả lời.",
        "ex": "Ảnh đường phố + \"Đếm số xe\" → \"Có 2 xe con\".",
        "more": "Qwen3-VL, GLM-V, InternVL, Kimi-VL, DeepSeek-VL2 đều theo khuôn ViT – MLP – LLM. Projector thường là MLP.",
        "fig": "vlm-arch",
        "figCap": "Ảnh thành mảnh, mảnh thành token qua ViT và projector, rồi cùng token chữ đi vào LLM."
      },
      {
        "g": "arch",
        "t": "Visual tokens & token budget (token ảnh và ngân sách token)",
        "en": "patch 16 px · gộp 2×2 → 1 token / 32×32 px",
        "d": "Số token mỗi ảnh quyết định chi phí và độ chi tiết; Qwen3-VL dùng một token cho mỗi ô 32 × 32 px.",
        "ex": "1280×720 ≈ 900 token, 1920×1080 ≈ 2 000 token. Thử ở mô phỏng.",
        "more": "Qwen3-VL cắt mảnh 16 px rồi gộp 2×2 mảnh thành một token. Độ phân giải, số tile và hệ số gộp quyết định số token. Gemma 3: 256 token mỗi ảnh; DeepSeek-OCR Tiny: 64 token mỗi trang."
      },
      {
        "deep": true,
        "g": "arch",
        "t": "Vision encoders (bộ mã hoá ảnh)",
        "en": "CLIP → SigLIP 2 → native resolution",
        "d": "Bộ mã hoá ảnh đi từ CLIP tới SigLIP 2, và nay nhận ảnh ở độ phân giải gốc.",
        "ex": "Không phải ép mọi ảnh về 336 × 336 nữa: chữ nhỏ không bị bóp mất.",
        "more": "CLIP (2021) học tương phản trên cặp ảnh–chữ; LLaVA-1.5 dùng CLIP-ViT-L-336px. SigLIP 2 (2025) thêm caption, tự chưng cất, dự đoán vùng bị che; Qwen3-VL khởi tạo từ SigLIP 2. Giữ tỷ lệ khung ảnh: NaViT, MoonViT, Pixtral."
      },
      {
        "deep": true,
        "g": "arch",
        "t": "Projector (bộ chiếu)",
        "en": "MLP · Q-Former · gộp 2×2 + MLP · conv nén",
        "d": "Projector (connector) nén token ảnh trước khi đưa vào LLM.",
        "ex": "2×2 token ViT, mỗi token 1 152 chiều → ghép → MLP 2 lớp → 1 token cho LLM.",
        "more": "LLaVA-1.5 dùng MLP; BLIP-2 dùng Q-Former; Qwen3-VL, InternVL3 gộp 2×2 token rồi MLP; DeepSeek-OCR dùng conv nén 16 lần."
      },
      {
        "deep": true,
        "g": "arch",
        "t": "Fusion style (cách nối ảnh vào LLM)",
        "en": "adapter · early fusion · token rời rạc",
        "d": "Ba cách nối ảnh vào LLM: adapter gắn sau, early fusion từ đầu, hoặc biến ảnh thành token như chữ.",
        "ex": "Phần lớn VLM mở hiện vẫn theo adapter; xu hướng mới là early fusion.",
        "more": "Adapter: LLM tiền huấn luyện bằng chữ trước rồi mới nối ViT (Qwen2.5-VL, GLM-V). Early fusion (từ 2025): ảnh và chữ dùng chung backbone ngay từ đầu (Llama 4). Token rời rạc: Chameleon biến ảnh 512 × 512 thành 1 024 token."
      },
      {
        "deep": true,
        "g": "arch",
        "t": "Positions, video & DeepStack (vị trí, video và DeepStack)",
        "en": "2D-RoPE · interleaved-MRoPE · mốc thời gian dạng chữ",
        "d": "Token ảnh cần biết vị trí 2D và thời gian; DeepStack đưa thêm đặc trưng tầng giữa của ViT vào LLM.",
        "ex": "DeepStack: DocVQA 89,5 → 91,1 trong ablation của Qwen3-VL.",
        "more": "ViT dùng 2D-RoPE trên lưới mảnh; Qwen3-VL dùng interleaved-MRoPE xen kẽ ba trục t, h, w để chia đều tần số. Với video, mỗi 2 khung gộp một temporal patch và mốc thời gian được viết thành chữ (\"<2.0 seconds>\"). DeepStack lấy đặc trưng lớp 8, 16, 24 của ViT đưa vào các lớp đầu của LLM mà không thêm token; InfoVQA 71,9 → 74,2."
      },
      {
        "g": "use",
        "t": "Grounding coordinates (hệ toạ độ hộp đầu ra)",
        "en": "pixel · thang 0–1000",
        "d": "Mỗi mô hình trả hộp theo một hệ toạ độ; đọc nhầm hệ là hộp sai chỗ mà không báo lỗi.",
        "ex": "x = 500 (thang 0–1000) trên ảnh rộng 1 920 px → 960 px. Thử ở mô phỏng.",
        "more": "Qwen2.5-VL trả pixel tuyệt đối dạng JSON; Qwen3-VL và GLM-4.5V trả toạ độ chuẩn hoá về thang 0–1000. Code phân tích hộp không dùng chung được giữa hai thế hệ Qwen. Đọc nhầm như pixel thì hộp dồn về góc trái trên."
      },
      {
        "g": "use",
        "t": "Cost knobs: thinking & MoE (chi phí: chế độ thinking và MoE)",
        "en": "reasoning on/off · tổng tham số vs tham số hoạt động",
        "d": "Chế độ thinking tăng chất lượng nhưng nhân chi phí; MoE có tổng tham số lớn nhưng mỗi token chỉ dùng một phần.",
        "ex": "Qwen3-VL 30B-A3B: 30B tổng, 3B hoạt động.",
        "more": "Gán nhãn hàng loạt thì tắt thinking, ca khó thì bật. Độ trễ mỗi khung trong một thử nghiệm: Qwen3-VL-30B-Thinking 31,5 s, CLIP ViT-L/14 0,2 s. MoE (hỗn hợp chuyên gia): bộ nhớ GPU theo tổng tham số, chi phí tính theo phần hoạt động."
      },
      {
        "g": "use",
        "t": "VLM roles in the data loop (VLM trong vòng lặp dữ liệu)",
        "en": "nhãn khởi tạo · tìm cảnh · duyệt nhãn · vết lập luận",
        "d": "VLM có bốn vai: tạo nhãn khởi tạo, tìm cảnh, duyệt nhãn, sinh vết lập luận; mỗi vai cần phép đo riêng.",
        "ex": "Aurora: 98,1% đúng cả hãng, mẫu, đời xe để dựng hộp 3D.",
        "more": "Aurora dùng Gemini 2.5 Pro suy ra hãng, mẫu, kích thước xe; sai số kích thước giảm 14,0 / 33,7 / 19,9% dài/rộng/cao so với baseline chỉ biết loại xe. Tìm cảnh theo câu chữ: RefAV. Duyệt nhãn: DriveBench cho thấy VLM còn kém. Vết lập luận: Alpamayo-R1, khoảng 10% do người gán."
      },
      {
        "g": "use",
        "t": "Structured output (đầu ra có cấu trúc)",
        "en": "JSON schema · cho phép null · kiểm giá trị trong code",
        "d": "Ép VLM trả JSON theo khuôn: khuôn bảo đảm cấu trúc, không bảo đảm giá trị đúng.",
        "ex": "length_m là null hoặc ngoài 2,5–20 m → chuyển cho người.",
        "more": "Mỗi trường cho phép null để VLM có chỗ từ chối; giá trị vô lý thì đẩy sang người (route_to_human). Ngưỡng 2,5–20 m chỉ là minh hoạ. Tài liệu Gemini: \"always validate values in your application\"."
      },
      {
        "g": "use",
        "t": "Blind VLM & cross-checking (VLM \"không nhìn\" và kiểm chéo)",
        "en": "textual shortcut · inventory của detector",
        "d": "VLM có thể đoán từ câu hỏi mà không nhìn ảnh, nên so mỗi khẳng định với danh sách vật của detector.",
        "ex": "GPT-4o đúng 59,5% với ảnh đen, 59,0% với ảnh thật.",
        "more": "DriveBench: ngẫu nhiên ~33%, người 93,3%. Kiểm chéo: so với inventory do detector + tracker tìm ra; khớp thì nhận, lệch thì gửi người. Thêm inventory YOLOE: recall 0,814 → 0,932 nhưng precision vẫn ≈ 0,71 (108 khung)."
      },
      {
        "deep": true,
        "g": "use",
        "t": "Scene search needs tracks (tìm cảnh cần track, không chỉ embedding)",
        "en": "CLIP · track 3D · chương trình truy vấn",
        "d": "Câu mô tả chuyển động theo thời gian cần track 3D và chương trình truy vấn; embedding ảnh không đủ.",
        "ex": "\"Xe đạp vượt xe ego từ bên phải rồi rẽ trái\" không tìm được bằng CLIP.",
        "more": "RefAV (HOTA-Temporal): CLIP 24,6 → RefProg 64,8 với track đáp án; với tracker thật 17,2 → 50,1."
      },
      {
        "g": "train",
        "t": "Training stages (năm giai đoạn huấn luyện)",
        "en": "alignment → pretraining → long context → SFT → RL",
        "d": "Căn chỉnh (chỉ mở projector) → tiền huấn luyện → kéo dài ngữ cảnh → SFT → học tăng cường.",
        "ex": "Qwen3-VL: căn chỉnh 67B token, tiền huấn luyện ~1T token.",
        "more": "Giai đoạn 1: đóng băng ViT và LLM, loss là đoán token chữ tiếp theo trên caption, OCR. Giai đoạn 2–3: mở toàn bộ, ngữ cảnh 32K → 256K. Giai đoạn 4: SFT (1,2 triệu mẫu) và long-CoT để dạy cách trả lời; theo GLM-V, SFT căn phong cách trả lời chứ không thêm kiến thức.",
        "fig": "vlm-stages",
        "figCap": "Ô đậm là phần được cập nhật trọng số ở mỗi giai đoạn: chỉ projector ở giai đoạn 1, cả ba từ giai đoạn 2."
      },
      {
        "deep": true,
        "g": "train",
        "t": "RL with verifiable reward (học tăng cường có phần thưởng kiểm chứng)",
        "en": "policy sinh nhiều đáp án · verifier chấm",
        "d": "Mô hình sinh nhiều đáp án, bộ chấm tự động cho điểm, rồi mô hình được chỉnh theo điểm.",
        "ex": "Đáp án đúng → 1; hộp có IoU 0,8 → 0,8.",
        "more": "Chỉ dùng được khi đáp án kiểm tra được bằng máy. Các biến thể: SAPO (Qwen3-VL), RLCS bỏ mẫu quá dễ/quá khó (GLM-V), GSPO (InternVL3.5)."
      },
      {
        "deep": true,
        "g": "train",
        "t": "Reducing hallucination (giảm ảo giác)",
        "en": "recaption · RL phản trực giác · reward model",
        "d": "Không có mẹo duy nhất chống ảo giác; vẫn phải kiểm nhãn VLM độc lập.",
        "ex": "GLM-V viết lại caption, bỏ chi tiết không có thật.",
        "more": "Qwen3-VL: RL trên tác vụ phản trực giác như đếm vật, đọc giờ. Dùng reward model lọc mẫu kém trước SFT. InternVL3: MPO giảm lệch giữa huấn luyện và suy luận. Chưa có nguồn đo riêng mức giảm của từng kỹ thuật."
      },
      {
        "g": "act",
        "t": "VLA (vision–language–action)",
        "en": "VLM đã pretrain + đầu ra hành động",
        "d": "Nhận ảnh camera và câu lệnh, trả về hành động: robot ra lệnh tay máy, xe ra quỹ đạo.",
        "ex": "\"Nhặt cốc đỏ\" + ảnh → chuỗi lệnh cho cánh tay.",
        "more": "Robot ra dx, dy, dz, xoay, kẹp. Ba cách sinh hành động: token rời rạc (giải mã như sinh chữ), đầu flow/diffusion (khử nhiễu cả chuỗi mượt), hai hệ nhanh–chậm (VLM chậm, policy nhanh chạy song song). Helix S1 (Figure) sinh lệnh motor ở 200 Hz.",
        "fig": "vla-vs-decision",
        "figCap": "VLA tự sinh hành động liên tục; mô hình quyết định chỉ chọn một đáp án, lệnh motor do code bên ngoài tạo."
      },
      {
        "g": "act",
        "t": "Decision models (mô hình quyết định)",
        "en": "Decisions API · Jev · chọn 1 trong N",
        "d": "Không phải VLA: chỉ chọn một đáp án trong danh sách kèm xác suất; lệnh điều khiển do code bên ngoài tạo.",
        "ex": "\"phanh\" 0,81, \"đi thẳng\" 0,15, \"rẽ trái\" 0,04.",
        "more": "Gọi vài lần mỗi giây (Decisions API, Jev). Không hợp làm vòng an toàn: danh sách hữu hạn, độ trễ mạng dao động, thứ tự đáp án có thể làm đổi xác suất. Confidence 0,84 trong ví dụ không phải xác suất cao nhất. Jev nhận chữ, tối đa 255 đáp án, độ trễ công bố 70–500 ms."
      },
      {
        "deep": true,
        "g": "act",
        "t": "Qwen-Drive",
        "en": "VLM + planner flow matching · 50 waypoint",
        "d": "Qwen-Drive: VLM đọc nhiều camera rồi một planner sinh quỹ đạo 50 điểm cho 5 giây tới.",
        "ex": "Vòng hở PDMS 90,7, nhưng vòng kín close-encounter 41,0% so với Alpamayo-R1 19,0%.",
        "more": "Backbone Qwen3.5-4B đọc 6–8 camera, lịch sử và trạng thái xe, lệnh dẫn đường; ra năm nhánh: chữ (VQA, lập luận), hộp 3D, occupancy, bản đồ BEV và quỹ đạo (x, y, hướng) ở 10 Hz. Planner flow matching (~1,1 tỷ tham số) tinh chỉnh cả 50 điểm từ nhiễu qua 10 bước. Huấn luyện bốn giai đoạn: perception trước, planner sau khi VLM đã đóng băng. Một lệnh run trả 6 quỹ đạo ứng viên, shape (6, 50, 3). Close-encounter thấp hơn là tốt."
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
        "deep": true,
        "tex": "\\text{VRAM} \\propto N_{\\text{total}}, \\qquad \\text{compute} \\propto N_{\\text{active}}",
        "read": "Mô hình MoE: bộ nhớ theo tổng tham số, chi phí tính theo phần tham số hoạt động mỗi token.",
        "ex": "Qwen3-VL 30B-A3B: 30B tổng, 3B hoạt động."
      },
      {
        "deep": true,
        "tex": "r = \\begin{cases} 1 & \\text{đáp án đúng} \\\\ \\mathrm{IoU} & \\text{đáp án là hộp} \\\\ 0 & \\text{sai} \\end{cases}",
        "read": "Phần thưởng kiểm chứng được: verifier tự động chấm đáp án, không cần người.",
        "ex": "Hộp lệch nhẹ, IoU 0,8 → phần thưởng 0,8."
      },
      {
        "deep": true,
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
          "Mở trọng số (Apache 2.0)"
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
      "Schema JSON bảo đảm cấu trúc, không bảo đảm giá trị đúng: luôn kiểm giá trị trong code.",
      "VLM có thể trả lời đúng mà không nhìn ảnh: GPT-4o với ảnh đen vẫn 59,5%."
    ],
    "deepTraps": [
      "\"confidence\" trong phản hồi không phải xác suất cao nhất; thứ tự đáp án có thể làm đổi xác suất.",
      "Chế độ \"thinking\" nhân chi phí; tắt khi gán nhãn hàng loạt.",
      "Qwen-Drive điểm vòng hở cao nhưng thua Alpamayo-R1 ở vòng kín; lập luận có thể không khớp quyết định thật."
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
        "Ảnh 1920×1080 qua Qwen3-VL khoảng bao nhiêu token?",
        "Khoảng 2 000 (mỗi token ≈ 32×32 px)."
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
        "DeepStack làm gì?",
        "Đưa đặc trưng lớp 8, 16, 24 của ViT vào các lớp đầu của LLM, không thêm token."
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
    "why": "Dữ liệu đuôi dài (hiếm, nguy hiểm) quyết định độ an toàn, và có những nhãn con người không gán nổi (độ sâu, optical flow, vận tốc chính xác). Dữ liệu tổng hợp lấp chỗ đó, nhưng dễ tạo con số đẹp giả nếu so sánh không công bằng. Buổi này dùng lại tracking (Day 22), BEV (Day 23), pipeline và split (Day 24); Day 27 dùng các bộ sinh để kiểm thử.",
    "steps": [
      "Why synthetic data (vì sao cần dữ liệu tổng hợp): Cảnh hiếm quá đắt để chờ; tự tạo ra thay vì chờ.",
      "Sim, reconstruct, generate (dựng, tái dựng, sinh): Ba cách tạo ảnh và cảm biến, mỗi cách một khoảng cách với thật.",
      "Trajectory & behavior data (quỹ đạo và hành vi): Quỹ đạo chưng cất từ log phải làm mượt và qua cổng khả thi.",
      "Measuring honestly (đo trung thực): Cùng ngân sách huấn luyện, test thật, đừng tự lừa."
    ],
    "groups": [
      {
        "k": "why",
        "t": "Why synthetic data (vì sao cần dữ liệu tổng hợp)",
        "note": "Cảnh hiếm quá đắt để chờ; tự tạo ra thay vì chờ."
      },
      {
        "k": "make",
        "t": "Sim, reconstruct, generate (dựng, tái dựng, sinh)",
        "note": "Ba cách tạo ảnh và cảm biến, mỗi cách một khoảng cách với thật."
      },
      {
        "k": "traj",
        "t": "Trajectory & behavior data (quỹ đạo và hành vi)",
        "note": "Quỹ đạo chưng cất từ log phải làm mượt và qua cổng khả thi."
      },
      {
        "k": "measure",
        "t": "Measuring honestly (đo trung thực)",
        "note": "Cùng ngân sách huấn luyện, test thật, đừng tự lừa."
      }
    ],
    "concepts": [
      {
        "g": "why",
        "t": "Long tail as a Poisson problem (đuôi dài là bài toán Poisson)",
        "en": "chờ đợi rất đắt",
        "d": "Cảnh hiếm xảy ra λ lần mỗi triệu km, nên muốn gặp đủ k lần phải chạy cỡ k/λ triệu km.",
        "ex": "λ = 0,2: muốn gặp 100 lần cần khoảng 500 triệu km. Thử ở mô phỏng.",
        "more": "Số lần gặp sau d km theo phân phối Poisson với trung bình λd. Chạy 10 triệu km chỉ gặp trung bình 2 lần. Thay vì chờ, ta dựng, tái dựng hoặc sinh ra cảnh đó."
      },
      {
        "g": "why",
        "t": "Four taps of data (bốn vòi dữ liệu)",
        "en": "build · reconstruct · generate · behavior",
        "d": "Từ log thật có bốn vòi: dựng, tái dựng, sinh và hành vi; huấn luyện trên hỗn hợp, kết luận từ test thật.",
        "ex": "Dữ liệu tổng hợp lấp chỗ dữ liệu thật không với tới, không thay thế nó.",
        "more": "Dựng: simulator, tài sản 3D. Tái dựng: NeRF, Gaussian splat. Sinh: diffusion, world model. Hành vi: quỹ đạo, kịch bản. Cả bốn hội tụ ở một câu hỏi: đo lợi ích thế nào cho trung thực. Mỗi bộ sinh có phân phối riêng.",
        "fig": "four-taps",
        "figCap": "Log thật đi vào bốn vòi; quy tắc chung: huấn luyện trên hỗn hợp, kết luận chỉ từ test thật."
      },
      {
        "g": "why",
        "t": "Fake-looking can teach better (trông giả vẫn dạy tốt)",
        "en": "độ phủ quan trọng hơn vẻ thật",
        "d": "Dữ liệu ngẫu nhiên hoá \"trông giả\" có thể dạy tốt hơn thế giới dựng kỹ, vì phủ rộng hơn.",
        "ex": "Công thức an toàn nhất: tiền huấn luyện tổng hợp, fine-tune trên thật.",
        "more": "Tremblay 2018: chỉ học tổng hợp thì VKITTI (trông thật) hơn DR; nhưng DR fine-tune thêm trên 6 000 ảnh thật đạt AP 98,5, hơn chỉ học dữ liệu thật 2,1 điểm."
      },
      {
        "deep": true,
        "g": "why",
        "t": "Ten years of synthetic data (mười năm dữ liệu tổng hợp)",
        "en": "ảnh dựng → game engine → DR → thích nghi → tái dựng → mô hình sinh",
        "d": "Mười năm, mỗi giai đoạn thêm một cơ chế: ảnh dựng → game engine → ngẫu nhiên hoá → thích nghi → tái dựng → mô hình sinh.",
        "ex": "⅓ CamVid thật + 25k ảnh từ game vượt toàn bộ CamVid.",
        "more": "2015 ảnh dựng sẵn có nhãn flow, disparity; 2016 lấy nhãn từ buffer của game; 2017 ngẫu nhiên hoá thay vì làm thật; 2018–20 thích nghi ảnh, bố cục, cảm biến; 2020–24 tái dựng log thật; 2023–26 mô hình sinh, nhãn thành điều kiện. Lý do thứ hai: có những nhãn người không gán nổi (độ sâu, flow, vận tốc chính xác) mà mô phỏng cho miễn phí. Robot chỉ học từ simulator ngẫu nhiên hoá định vị vật thật sai 1,5 cm; bớt được tới 70% dữ liệu thật mà detector không giảm chất lượng."
      },
      {
        "g": "make",
        "t": "Three sim-to-real gaps (ba khoảng cách mô phỏng – thật)",
        "en": "appearance · content & behavior · sensor",
        "d": "Mô phỏng khác thật ở ba chỗ: ngoại hình, nội dung và hành vi, cảm biến; chẩn đoán đúng chỗ rồi mới sửa.",
        "ex": "LiDAR mô phỏng không mất tia nào chính là một lỗi.",
        "more": "Ngoại hình: texture, ánh sáng, vật liệu. Nội dung và hành vi: bố cục cảnh, ai đi đâu, khi nào. Cảm biến: nhiễu, tia LiDAR mất, blooming, rolling shutter. Ngoài đời kính, sơn đen, vật xa đều làm mất tia."
      },
      {
        "g": "make",
        "t": "Domain randomization width (độ rộng ngẫu nhiên hoá)",
        "en": "DR · structured DR",
        "d": "Ngẫu nhiên hoá màu, ánh sáng, vị trí để thế giới thật thành \"một biến thể nữa\"; đặt vật theo ngữ cảnh thì tốt hơn.",
        "ex": "AP ca khó: ngẫu nhiên thuần 24,0 → ngẫu nhiên có cấu trúc 52,2.",
        "more": "Quá hẹp thì không phủ thế giới thật, quá rộng thì phí mẫu; với nhiều tham số, hộp ngẫu nhiên hoá phình theo lập phương nên tỷ lệ mẫu có ích tụt nhanh. Structured DR: xe nằm trên làn, người trên vỉa hè (Prakash 2019)."
      },
      {
        "g": "make",
        "t": "Real2Sim: NeRF vs Gaussian splatting (tái dựng)",
        "en": "ghi một lần, vẽ lại vô số lần",
        "d": "Dựng lại cảnh 3D từ log thật rồi thêm, bớt, dời xe và vẽ lại từ góc nhìn mới, kèm nhãn miễn phí.",
        "ex": "3DGS vẽ 134 khung/giây so với 0,06 của NeRF, nên driving chuyển sang splatting.",
        "more": "Ghi một lần, vẽ lại vô số lần; độ sâu, LiDAR, mask, flow, hộp đi kèm. NeRF giữ cảnh trong trọng số MLP, hỏi dọc từng tia nên chậm (Mip-NeRF360 huấn luyện 48 giờ). 3D Gaussian Splatting giữ hàng triệu ellipse tường minh rồi raster hoá, huấn luyện 41 phút, PSNR chỉ thấp hơn ~0,5 dB, dễ chỉnh sửa."
      },
      {
        "g": "make",
        "t": "Conditional generation (sinh có điều kiện)",
        "en": "diffusion · nhãn có trước ảnh",
        "d": "Diffusion sinh ảnh theo điều kiện hộp 3D và bản đồ, nên nhãn có trước ảnh; vẫn phải kiểm ảnh có tôn trọng nhãn.",
        "ex": "Cổng IoU 0,5 bằng detector độc lập giữ 47/60 vật, bỏ oan 8% vật đúng.",
        "more": "Diffusion học đi ngược quá trình làm nhiễu. Điều kiện gồm hộp 3D, bản đồ BEV và thông số camera; mô hình sinh sáu góc nhìn nhất quán. Ví dụ: MagicDrive, Panacea, DriveDreamer-2. Cổng: detector độc lập tìm lại vật và loại cặp có IoU thấp."
      },
      {
        "deep": true,
        "g": "make",
        "t": "Fixing appearance & sensors (sửa ngoại hình và cảm biến)",
        "en": "CyCADA · G-buffer · learned raydrop",
        "d": "Ngoại hình sửa được bằng dịch phong cách ảnh mà giữ hình học; cảm biến sửa bằng học cách tia LiDAR mất.",
        "ex": "CyCADA game → Cityscapes: mIoU 17,9 → 35,4.",
        "more": "CNN đọc G-buffer (độ sâu, pháp tuyến, vật liệu) của renderer để dịch ảnh. Với LiDAR, vị trí mất tia quan trọng hơn số lượng. LiDARsim (AP@0,7): không mất tia 69,2; mất ngẫu nhiên 69,4; mất tia học từ dữ liệu thật 71,6; tia mất thật 72,3."
      },
      {
        "deep": true,
        "g": "make",
        "t": "Off-trajectory degradation (càng rời đường đã ghi càng xấu)",
        "en": "vùng chưa từng nhìn · prior sinh",
        "d": "Càng dời camera khỏi đường đã ghi, ảnh tái dựng càng xấu vì có những mặt chưa ai nhìn từ góc đó.",
        "ex": "UniSim (FID): dời làn 2 m → 3 m, 74,7 → 97,5.",
        "more": "Kính, mặt phản chiếu, dáng người, blur cũng hay gãy. Thêm mô hình sinh làm prior cho vùng chưa thấy: StreetCrafter 58,2 ở 2 m. Replay track thì xe khác không phản ứng khi ta đổi đường. Xu hướng 2025–26: tái dựng feed-forward log 10–20 s thành cảnh splat trong khoảng 1,5 s."
      },
      {
        "g": "traj",
        "t": "Trajectory data from logs (quỹ đạo chưng cất từ log)",
        "en": "auto-label offline → track + smooth → cổng chất lượng",
        "d": "Quỹ đạo được chưng cất từ log qua auto-label và tracking, nên mang theo mọi lỗi của tracker.",
        "ex": "Nhiễu 10 cm ở 10 Hz thành gia tốc giả ~24,5 m/s² (≈ 2,5 g). Thử ở mô phỏng.",
        "more": "Các bước: auto-label offline hai chiều thời gian, tracking và làm mượt (RTS smoother), cắt mẫu lịch sử – tương lai – bản đồ, qua cổng chất lượng. Một lần đổi ID cắt quỹ đạo thành hai mẩu cụt. Lấy gia tốc bằng sai phân hai lần phóng đại nhiễu theo 1/Δt², trong khi chuyển làn thật chỉ ~1 m/s². Phải làm mượt trước khi lấy đạo hàm."
      },
      {
        "g": "traj",
        "t": "Feasibility gate (cổng khả thi)",
        "en": "gia tốc · jerk · độ cong · gia tốc ngang · liên tục · bản đồ",
        "d": "Sáu phép kiểm tách \"không thể xảy ra\" (lỗi) khỏi \"hiếm\" (quý), dựa trên giới hạn vật lý của xe.",
        "ex": "κ = 0,05 ở 15 m/s cần gia tốc ngang 11,3 m/s², vượt ma sát: bất khả thi.",
        "more": "Gia tốc sau làm mượt (box rung), jerk (nối nhầm track), độ cong (heading lật 180°), gia tốc ngang v²κ (vào cua bất khả thi), liên tục (ID switch), bản đồ (tâm xe ngoài vùng lái được: sai calib, sai pose). Mô hình xe đạp: κ_max = tan 35° / 2,8 m ≈ 0,25 m⁻¹. Cùng κ = 0,05 ở 5 m/s thì khả thi; ma sát ~8–9 m/s². Xe giảm tốc −7 m/s² đều, mượt: gửi xem lại, đừng xoá."
      },
      {
        "deep": true,
        "g": "traj",
        "t": "Augment & rebalance (mở rộng và cân bằng lại)",
        "en": "biến thể phải qua cổng · ESS",
        "d": "Mỗi biến thể quỹ đạo phải qua cổng khả thi; cân bằng bằng trọng số, vì chỉ lặp mẫu hiếm làm ESS tụt.",
        "ex": "Tăng nhịp ×1,2 làm gia tốc ngang tăng ×1,44.",
        "more": "Biến thể: dịch, lật gương, đổi nhịp. Tỷ lệ minh hoạ trong log: đi thẳng 78%, chuyển làn 10%, rẽ 7%, nhường 3%, cắt làn 1,5%, quay đầu 0,5%. highD có 110k xe nhưng chỉ 5 600 lần chuyển làn."
      },
      {
        "deep": true,
        "g": "traj",
        "t": "Behavior & scenario generation (sinh hành vi và kịch bản)",
        "en": "adversarial search · generative behavior · realism",
        "d": "Hai họ: tìm kiếm đối nghịch (đẩy hành vi tới khi planner thất bại) và mô hình sinh hành vi (học phân phối rồi lấy mẫu).",
        "ex": "Nguy hiểm mà bất khả thi là dữ liệu độc.",
        "more": "Đối nghịch: STRIVE, KING. Sinh: TrafficGen, MotionLM; MotionLM coi chuyển động như ngôn ngữ, mỗi bước 0,5 s là một token (Δx, Δy). Cả hai phải qua cổng khả thi và đo độ giống người: động học, tương tác (khoảng cách, TTC, va chạm), bản đồ. Waymo Sim Agents chấm realism bằng likelihood của hành vi thật dưới 32 lần chạy mô phỏng."
      },
      {
        "deep": true,
        "g": "traj",
        "t": "Robot demo multiplication (nhân demo robot)",
        "en": "MimicGen · ADR · đa dạng > số lượng",
        "d": "Viết lại đoạn thao tác theo khung toạ độ của vật rồi đặt sang tư thế vật mới; đa dạng thắng số lượng.",
        "ex": "MimicGen: ~200 demo người → 50k+ demo.",
        "more": "Biến đổi τ′ = T_{W,O′} T_{W,O}⁻¹ τ, chạy thử trong simulator, chỉ giữ lần thành công. ADR tự nới rộng vùng ngẫu nhiên hoá khi policy đủ giỏi, thu hẹp khi kém. Lin et al. (ICLR 2025, hơn 40 000 demo): chia tốt nhất là 32 nơi × 4 demo."
      },
      {
        "g": "measure",
        "t": "Fair comparison (so sánh công bằng)",
        "en": "cùng số bước huấn luyện",
        "d": "Cho baseline chỉ dùng dữ liệu thật học cùng số bước, lợi ích của dữ liệu sinh có thể gần như biến mất.",
        "ex": "MagicDrive: +1,95 NDS; baseline gấp đôi epoch thì còn +0,74.",
        "more": "Tiền huấn luyện trên dữ liệu sinh rồi fine-tune trên thật nghĩa là học gấp đôi epoch. Camera + LiDAR: +1,13 → +0,03. Đây là câu hỏi đầu tiên cho mọi con số \"+X nhờ dữ liệu sinh\".",
        "fig": "fair-compare",
        "figCap": "Cùng một bài báo: lợi ích co lại khi baseline được cùng ngân sách huấn luyện."
      },
      {
        "g": "measure",
        "t": "Mix ratio, collapse & forgetting (tỷ lệ trộn, sụp mô hình, quên)",
        "en": "n_eff = n_real + λ·n_syn · model collapse · EWC",
        "d": "Một mẫu tổng hợp đáng giá ít hơn một mẫu thật; học lặp trên dữ liệu tự sinh làm đuôi phân phối biến mất.",
        "ex": "Mỗi thế hệ fit lại một Gauss trên 40 mẫu: σ co dần về gần 0. Thử ở mô phỏng.",
        "more": "n_eff = n_real + λ·n_syn với λ < 1, khác nhau theo slice; tỷ lệ thật : tổng hợp là siêu tham số chỉnh trên validation thật. Model collapse: tích luỹ, đừng thay thế. Đuôi |x| > 2 (thật 4,6%) biến mất. Huấn luyện lại thì canh để không quên việc cũ (rehearsal, EWC, slice canh giữ)."
      },
      {
        "g": "measure",
        "t": "Honest test sets (test set trung thực)",
        "en": "bộ đóng băng · bộ mới theo nơi và thời gian · rò rỉ",
        "d": "Giữ một bộ test đóng băng để so phiên bản, thêm bộ mới theo nơi và thời gian; dữ liệu sinh không vào test.",
        "ex": "Thu lại ImageNet đúng giao thức cũ: điểm tụt 11–14.",
        "more": "Một test set mới là một lần lệch phân phối. CIFAR-10 thu lại tụt 3–15 điểm, thứ tự mô hình gần như giữ nguyên. Đo rò rỉ gần trùng: 3,3% ảnh test CIFAR-10 và 10% CIFAR-100 có bản gần trùng trong train. Muốn biết thành phố mới: giữ riêng một thành phố và ba tháng cuối làm test.",
        "fig": "test-sets",
        "figCap": "Một bộ đóng băng không bao giờ đổi để so phiên bản; các bộ mới theo nơi và thời gian để biết ngoài đời."
      },
      {
        "deep": true,
        "g": "measure",
        "t": "Measuring synthetic data (đo lợi ích dữ liệu sinh)",
        "en": "FID ≠ nhãn đúng · năm luật",
        "d": "FID đo ảnh giống thật không, không biết hộp ở đâu; cần năm luật đo trên test thật.",
        "ex": "Bằng chứng tốt: +1,5 mAP ở slice mưa đêm, test thật, cùng số bước, 3 seed.",
        "more": "Năm luật: test chỉ chứa dữ liệu thật, đóng băng trước khi sinh; baseline cùng kiến trúc, cùng số bước; báo cáo trên slice được sinh cho và slice cần giữ; nhiều seed, khoảng tin cậy theo cảnh; ghi lineage của bộ sinh. \"FID giảm\" hay \"ảnh đẹp không phân biệt được\" không phải bằng chứng. FVD là bản cho video."
      },
      {
        "deep": true,
        "g": "measure",
        "t": "Scaling & marginal gain (scaling và lợi ích biên)",
        "en": "err = a·D^(−α) + c · lợi ích biên từng slice",
        "d": "Lỗi giảm theo lũy thừa khi thêm dữ liệu nhưng có sàn; đổ dữ liệu vào slice có lợi ích biên cao nhất.",
        "ex": "SemDeDup bỏ 50% dữ liệu gần trùng, hiệu năng gần như không đổi.",
        "more": "err = a·D^(−α) + c: nhân đôi dữ liệu không chia đôi lỗi, gần sàn rất đắt. Mỗi slice có đường cong riêng. Đôi khi bước tốt nhất là bỏ bớt dữ liệu trùng (SemDeDup giảm một nửa thời gian huấn luyện). Open-loop scale theo luật lũy thừa nhưng closed-loop thì không đơn giản như vậy."
      },
      {
        "deep": true,
        "g": "measure",
        "t": "Measuring rare events (đo tần suất sự kiện hiếm)",
        "en": "importance sampling · ESS · 0 lần ≠ không có",
        "d": "Kéo phân phối lấy mẫu về nơi nguy hiểm rồi đo có trọng số để trả lại tần suất tự nhiên; 0 lần không có nghĩa là không có.",
        "ex": "Không thấy va chạm nào trong n lần thì chỉ báo được cận trên 3/n.",
        "more": "Tìm ra một vụ va chạm thì dễ, đo tần suất mới khó. Importance sampling (CEM), trọng số p/q, báo kèm số mẫu hiệu dụng. Lab minh hoạ: 101/400 va chạm khi phát lại log (phần lớn tông đuôi) nhưng 0/400 khi xe khác phản ứng; tần suất thật ≈ 1,2·10⁻³ (95 vụ / 81 920 lần)."
      }
    ],
    "formulas": [
      {
        "tex": "P(N \\ge k) = 1 - \\sum_{j<k} e^{-\\lambda d}\\,\\dfrac{(\\lambda d)^j}{j!}",
        "read": "Xác suất gặp cảnh hiếm ít nhất k lần sau quãng đường d, với tần suất λ (Poisson).",
        "ex": "λ = 0,2 / triệu km, d = 10 triệu km → trung bình 2 lần; gặp đủ 100 lần cần ~500 triệu km."
      },
      {
        "deep": true,
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
        "tex": "\\kappa_{\\max} = \\dfrac{\\tan\\delta_{\\max}}{L}, \\qquad a_{\\text{lat}} = v^2\\,\\kappa",
        "read": "Độ cong tối đa theo góc lái và chiều dài trục; gia tốc ngang khi vào cua = tốc độ² × độ cong.",
        "ex": "tan 35° / 2,8 ≈ 0,25 m⁻¹; 15 m/s, κ = 0,05 → 11,3 m/s², vượt ma sát (~8–9) nên bất khả thi."
      },
      {
        "deep": true,
        "tex": "\\mathrm{ESS} = \\dfrac{\\left(\\sum_i w_i\\right)^2}{\\sum_i w_i^2}",
        "read": "Số mẫu hiệu dụng: lặp đi lặp lại vài mẫu hiếm làm ESS tụt, tức không thêm thông tin.",
        "ex": "Cần mẫu mới thật, không chỉ nhân bản."
      },
      {
        "deep": true,
        "tex": "\\tau' = T_{W,O'}\\,T_{W,O}^{-1}\\,\\tau",
        "read": "Nhân demo robot: chuyển đoạn thao tác τ về khung của vật cũ O rồi đặt sang tư thế vật mới O′.",
        "ex": "Dời vật 0,15 m, xoay 60°: đoạn tiếp cận và nắm đi theo vật."
      },
      {
        "deep": true,
        "tex": "\\mathrm{err}(D) = a\\,D^{-\\alpha} + c",
        "read": "Lỗi giảm theo lũy thừa khi thêm dữ liệu, nhưng không xuống dưới sàn c.",
        "ex": "α = 0,35: mỗi lần nhân đôi dữ liệu, phần lỗi giảm được chỉ còn × 0,78."
      },
      {
        "deep": true,
        "tex": "n_{\\text{eff}} = n_{\\text{real}} + \\lambda\\,n_{\\text{syn}}, \\quad \\lambda < 1",
        "read": "Một mẫu tổng hợp đáng giá ít hơn một mẫu thật; λ khác nhau theo slice.",
        "ex": "Tỷ lệ trộn chỉnh trên validation thật, không đoán."
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
          "Ngẫu nhiên hoá, dịch phong cách ảnh (CyCADA, G-buffer)"
        ],
        [
          "Nội dung & hành vi",
          "Bố cục cảnh, ai đi đâu",
          "Ngẫu nhiên có cấu trúc, phát lại log, mô hình hành vi"
        ],
        [
          "Cảm biến",
          "Tia LiDAR mất, blooming, rolling shutter",
          "Học mô hình cảm biến từ dữ liệu thật (LiDARsim, NeuRAD)"
        ]
      ]
    },
    "traps": [
      "FID đẹp không có nghĩa nhãn đúng: FID không biết hộp nằm đâu.",
      "Test lẫn dữ liệu sinh chỉ đo mô hình trên thế giới của bộ sinh.",
      "\"+X nhờ dữ liệu sinh\" mà baseline không được cùng số bước huấn luyện thì chưa phải bằng chứng."
    ],
    "deepTraps": [
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
        "Vì sao driving chuyển từ NeRF sang Gaussian splatting?",
        "Nhanh hơn rất nhiều (134 so với 0,06 khung/giây) và dễ chỉnh sửa, chất lượng gần ngang."
      ],
      [
        "Một xe \"phanh gấp 2,5 g\" trong log: nghi gì?",
        "Nhiễu vị trí của tracker bị sai phân hai lần phóng đại; làm mượt trước khi kết luận."
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
    "why": "Một lỗi nhỏ ở nhận thức lan xuống: bỏ sót khung → đổi ID → dự báo lệch → phanh trễ → nguy cơ va chạm. Kiểm thử phải nhìn cả hệ thống, không chỉ mAP. Buổi này dùng lại tracking (Day 22), BEV và occupancy (Day 23), pipeline dữ liệu (Day 24) và bộ sinh kịch bản (Day 26).",
    "steps": [
      "Test ladder (thang kiểm thử): Bắt lỗi ở bậc rẻ nhất có thể.",
      "Log replay (phát lại nhật ký): Cô lập thay đổi phần mềm trên cùng đầu vào.",
      "Open vs closed loop (vòng hở và vòng kín): Điểm vòng hở đẹp chưa chắc lái an toàn.",
      "Scenarios & agents (kịch bản và tác nhân): Quét ranh giới nguy hiểm với xe khác biết phản ứng."
    ],
    "groups": [
      {
        "k": "ladder",
        "t": "Test ladder (thang kiểm thử)",
        "note": "Bắt lỗi ở bậc rẻ nhất có thể."
      },
      {
        "k": "replay",
        "t": "Log replay (phát lại nhật ký)",
        "note": "Cô lập thay đổi phần mềm trên cùng đầu vào."
      },
      {
        "k": "loop",
        "t": "Open vs closed loop (vòng hở và vòng kín)",
        "note": "Điểm vòng hở đẹp chưa chắc lái an toàn."
      },
      {
        "k": "scen",
        "t": "Scenarios & agents (kịch bản và tác nhân)",
        "note": "Quét ranh giới nguy hiểm với xe khác biết phản ứng."
      }
    ],
    "concepts": [
      {
        "g": "ladder",
        "t": "Test ladder (thang kiểm thử)",
        "en": "unit → replay → open-loop → closed-loop → scenario → track → road",
        "d": "Bậc dưới rẻ, nhanh, cô lập lỗi tốt; bậc trên sát thực tế nhưng đắt; trượt ở bậc nào là dừng ở bậc đó.",
        "ex": "Đổi detector: phát lại log rồi vòng hở trước. Đổi planner: lên vòng kín và kịch bản.",
        "more": "Bảy bậc: unit → replay → open-loop → closed-loop → scenario → track → road. Mỗi thay đổi đi qua các bậc từ dưới lên; không \"để đường thật kiểm nốt\".",
        "fig": "test-ladder",
        "figCap": "Đi lên thang thì sát thực tế hơn nhưng đắt và chậm hơn; lỗi càng bắt sớm càng rẻ."
      },
      {
        "g": "ladder",
        "t": "Error propagation (lỗi lan qua các khối)",
        "en": "miss → ID switch → bad forecast → late brake",
        "d": "Lỗi nhận thức lan xuống: bỏ sót khung → đổi ID → dự báo lệch → phanh trễ; mAP chỉ thấy bước đầu.",
        "ex": "Hai detector cùng mAP, một cái bỏ sót liền 5 khung ở xe phía trước gây phanh trễ.",
        "more": "Detector kia bỏ sót rải rác nên tracker che được. Muốn thấy hậu quả phải chạy cả chuỗi."
      },
      {
        "deep": true,
        "g": "ladder",
        "t": "Why road miles are not enough (vì sao chạy đường thật không đủ)",
        "en": "RAND · 275 triệu dặm",
        "d": "Va chạm chết người rất hiếm, nên chứng minh an toàn ngang người cần khoảng 275 triệu dặm không lỗi.",
        "ex": "RAND 2016: 274,8 triệu dặm ≈ 12,5 năm với 100 xe chạy 24/7.",
        "more": "Tỷ lệ ở Mỹ cỡ 1,09 lần mỗi 100 triệu dặm; độ tin 95%. Muốn chứng minh tốt hơn người 20% cần cỡ 518 năm. Phải dựa vào mô phỏng và kịch bản để thử những thứ đường thật hiếm khi cho gặp."
      },
      {
        "g": "replay",
        "t": "Log replay (phát lại nhật ký)",
        "en": "ghi một lần, phát lại vô số lần",
        "d": "Ghi cảm biến một lần, phát lại bao nhiêu lần cũng được; cùng đầu vào mà khác đầu ra là do phần mềm.",
        "ex": "Đổi tracker, phát lại 10 000 đoạn log qua đêm, so ID switch theo slice.",
        "more": "Giới hạn: thế giới trong log không đổi theo hành động mới của xe. Slice ví dụ: đêm, mưa, giao lộ."
      },
      {
        "g": "replay",
        "t": "Three replay levels (ba mức phát lại)",
        "en": "raw sensor · perception output · single process",
        "d": "Phát lại từ cảm biến thô, từ đầu ra nhận thức, hoặc chỉ một tiến trình: càng muộn càng nhanh và cô lập.",
        "ex": "Nghi lỗi ở planner thì phát lại từ đầu ra nhận thức.",
        "more": "Từ cảm biến thô: sát thật nhất, kiểm cả nhận thức nhưng chậm. Từ đầu ra nhận thức: kiểm tracking, dự báo, planner nhanh hơn. Một tiến trình với đầu vào đã ghi: hợp với test hồi quy hằng ngày.",
        "fig": "replay-levels",
        "figCap": "Điểm bắt đầu phát lại càng muộn thì càng nhanh và cô lập, nhưng kiểm được ít khối hơn."
      },
      {
        "g": "replay",
        "t": "Real-time vs as-fast-as-possible (thời gian thực và nhanh nhất có thể)",
        "en": "deadline có bị lỡ không",
        "d": "Phát lại nhanh nhất có thể chờ mọi khối nên không bao giờ lỡ hạn; cần chạy thời gian thực để bắt lỗi trễ.",
        "ex": "Detector 120 ms với khung 100 ms: phát lại vẫn \"đạt\", chạy thật thì cứ khung thứ hai bị bỏ.",
        "more": "Ngoài đời, khối chậm làm lỡ khung và dùng dữ liệu cũ. Chế độ thời gian thực phải chạy trên phần cứng đích (GPU xe)."
      },
      {
        "g": "replay",
        "t": "What replay can and cannot do (phát lại làm được gì)",
        "en": "cô lập phần mềm ≠ kiểm hành động",
        "d": "Phát lại so được phần mềm trên cùng đầu vào, nhưng không đánh giá được hành động mới.",
        "ex": "Planner mới phanh sớm: xe sau trong log vẫn lao tới và \"tông đuôi\". Va chạm giả.",
        "more": "Làm được: so phiên bản, tái hiện lỗi, đo nhận thức và dự báo. Không làm được: khi xe ta đi khác log, các xe khác vẫn đi như cũ và cảm biến vẫn nhìn từ đường cũ."
      },
      {
        "deep": true,
        "g": "replay",
        "t": "Change one block, compare by slice (đổi một khối, so theo slice)",
        "en": "A/B replay",
        "d": "Mỗi lần chỉ đổi một khối rồi so trên cùng log, theo từng slice chứ không chỉ trung bình.",
        "ex": "Tracker mới: ID switch toàn bộ −8% nhưng giao lộ đông người +15% → chưa phát hành.",
        "more": "Một thay đổi tốt hơn trung bình có thể tệ hơn ở đêm mưa (A/B replay)."
      },
      {
        "deep": true,
        "g": "replay",
        "t": "Run card (thẻ lần chạy)",
        "en": "log · code · model · calib · seed · config",
        "d": "Mỗi lần chạy ghi đủ log, mã, mô hình, hiệu chuẩn, seed, cấu hình để tái lập được.",
        "ex": "Hai lần chạy khác cả mô hình lẫn hiệu chuẩn: không kết luận được gì.",
        "more": "Thiếu một thứ thì khi kết quả lạ không biết là do thay đổi nào."
      },
      {
        "deep": true,
        "g": "replay",
        "t": "Regression replay (phát lại hồi quy)",
        "en": "bộ log lỗi cũ chạy mỗi phiên bản",
        "d": "Mỗi lỗi đã gặp ngoài đường thành một đoạn log trong bộ hồi quy mà mọi phiên bản phải qua.",
        "ex": "Vụ xe tải trắng dưới nắng gắt nằm vĩnh viễn trong bộ hồi quy.",
        "more": "Lỗi cũ quay lại là chặn. Bộ chỉ lớn lên, không bỏ bớt."
      },
      {
        "deep": true,
        "g": "replay",
        "t": "Non-determinism & tolerance (không tất định và dung sai)",
        "en": "float · đa luồng · GPU",
        "d": "Hai lần phát lại không giống nhau từng bit, nên so sánh cần ngưỡng chấp nhận.",
        "ex": "(0,1 + 0,2) + 0,3 = 0,6000000000000001 nhưng 0,1 + (0,2 + 0,3) = 0,6.",
        "more": "Nguồn khác biệt: thứ tự cộng số thực, lịch đa luồng, kernel GPU. Đặt ngưỡng theo từng đại lượng và chạy nhiều lần để biết độ dao động tự nhiên."
      },
      {
        "g": "loop",
        "t": "Open-loop vs closed-loop (vòng hở và vòng kín)",
        "en": "đặt lại theo log · tự chịu hậu quả",
        "d": "Vòng hở đặt xe về log sau mỗi bước nên lỗi không tích luỹ; vòng kín để xe tự lái và lỗi cộng dồn.",
        "ex": "Lệch 0,2 m mỗi bước cùng chiều: chưa tới 10 bước đã ra khỏi làn. Thử ở mô phỏng.",
        "more": "Trong vòng kín, lệch nhỏ đưa xe vào trạng thái chưa từng thấy trong dữ liệu (compounding error). Nửa làn rộng 1,75 m.",
        "fig": "open-closed",
        "figCap": "Vòng hở kéo xe về log sau mỗi bước; vòng kín để sai lệch cộng dồn."
      },
      {
        "g": "loop",
        "t": "Ranking reversal (xếp hạng đảo ngược)",
        "en": "tốt vòng hở ≠ an toàn vòng kín",
        "d": "Xếp hạng theo sai số vòng hở và theo va chạm vòng kín có thể ngược nhau; luôn so với một bộ luật đơn giản.",
        "ex": "IDM tệ nhất vòng hở (1,51 m) nhưng an toàn nhất (0,1% va chạm).",
        "more": "EgoMLP 0,76 m nhưng 24,1% va chạm. Mô hình học máy không thắng nổi luật đơn giản thì chưa đáng triển khai.",
        "fig": "rank-flip",
        "figCap": "Cùng bốn bộ điều khiển, hai bảng xếp hạng gần như ngược nhau."
      },
      {
        "g": "loop",
        "t": "DAgger (học từ chính sai lầm)",
        "en": "dataset aggregation",
        "d": "Cho mô hình tự lái, ghi các trạng thái lệch nó gây ra, nhờ thầy gắn nhãn đúng rồi học lại.",
        "ex": "PercMLP+ sau DAgger an toàn ngang IDM dù sai số vòng hở xấu đi. Thử ở mô phỏng.",
        "more": "Mô hình học từ log chỉ thấy trạng thái \"lái đúng\"; DAgger (dataset aggregation) dạy nó cách hồi phục. Thầy trong lab là IDM, nên PercMLP+ chỉ \"không kém IDM\".",
        "fig": "dagger-loop",
        "figCap": "Vòng DAgger: tự lái → ghi trạng thái lạ → thầy gắn nhãn → gộp dữ liệu → huấn luyện lại."
      },
      {
        "deep": true,
        "g": "loop",
        "t": "Open-loop shortcut (lối tắt vòng hở)",
        "en": "trạng thái xe ta đã đủ đoán",
        "d": "Chỉ cần vận tốc và gia tốc hiện tại của xe ta là đoán quỹ đạo khá tốt, vì đa số cảnh là đi thẳng.",
        "ex": "Ego-MLP không nhìn đường: L2 0,35 m, ngang VAD dùng camera (0,37 m).",
        "more": "73,9% cảnh nuScenes là đi thẳng. Điểm vòng hở cao không chứng minh mô hình hiểu cảnh."
      },
      {
        "deep": true,
        "g": "loop",
        "t": "Closed-loop noise & driving score (nhiễu vòng kín và điểm lái)",
        "en": "seed · route completion × penalty",
        "d": "Vòng kín nhạy với seed nên phải chạy nhiều seed; CARLA chấm điểm lái = hoàn thành lộ trình × hệ số phạt.",
        "ex": "Va chạm EgoMLP từ 11,9% đến 35,9% tuỳ seed.",
        "more": "Đi 80% lộ trình, phạt 0,7 → 56%. Ba tầng đánh giá: vòng hở trên log, vòng kín không phản ứng, vòng kín có tác nhân phản ứng."
      },
      {
        "g": "scen",
        "t": "Scenario levels (ba mức kịch bản)",
        "en": "functional → logical → concrete",
        "d": "Kịch bản đi từ lời mô tả, sang khoảng giá trị tham số, tới một bộ giá trị cụ thể để chạy.",
        "ex": "\"Xe cắt vào\" → 5–40 m, 0–15 m/s → 12 m, 5 m/s. Thử ở mô phỏng.",
        "more": "Ba mức: functional → logical → concrete. Khai thác log tìm cảnh TTC thấp hoặc phanh gắt, rồi tổng quát hoá thành kịch bản logical và quét lưới: từ một lỗi trong log sinh ra cả họ biến thể."
      },
      {
        "g": "scen",
        "t": "Reactive agents (tác nhân phản ứng)",
        "en": "IDM · tính cách tài xế",
        "d": "Xe và người khác trong mô phỏng phản ứng với xe thử; phát lại log thì không, nên sinh va chạm giả.",
        "ex": "IDM đổi tham số là đổi tính cách: giữ khoảng cách 24 / 17 / 10 m. Thử ở mô phỏng.",
        "more": "IDM là mô hình tài xế theo luật. Ba tính cách trong lab: cẩn thận / bình thường / hung hăng ở cùng tốc độ. Va chạm giả: xe sau tông đuôi vì không biết xe ta đã phanh."
      },
      {
        "g": "scen",
        "t": "Release gate (cổng phát hành)",
        "en": "R1–R7 · một quy tắc trượt là chặn",
        "d": "Bảy quy tắc phải qua hết; trượt một là chặn, không lấy trung bình để bù.",
        "ex": "Trong lab chỉ PercMLP+ qua cổng.",
        "more": "R1 phát lại tái lập; R2 không va chạm trên log; R3 xe dẫn phanh gấp; R4 lưới cắt vào; R5 ổn định theo hạt giống; R6 xe sau phản ứng; R7 đủ số kịch bản."
      },
      {
        "deep": true,
        "g": "scen",
        "t": "Criticality metrics (độ nguy hiểm của kịch bản)",
        "en": "TTC · required deceleration",
        "d": "TTC cho biết còn bao lâu nữa va; v²/(2d) cho biết phải phanh gắt cỡ nào để kịp dừng.",
        "ex": "12 m, tiến gần 10 m/s → TTC 1,2 s, cần 4,2 m/s², gắt hơn phanh êm (~3).",
        "more": "Dùng cả hai để tìm và xếp hạng kịch bản nguy hiểm. 12 m, 5 m/s → TTC 2,4 s, cần 1,0 m/s²."
      },
      {
        "deep": true,
        "g": "scen",
        "t": "Coverage (độ bao phủ)",
        "en": "đếm vùng đã thử, không đếm số kịch bản",
        "d": "Đếm vùng của miền vận hành đã thử, không đếm số kịch bản; lỗi thường nằm ở ranh giới.",
        "ex": "Quét đủ lưới cắt vào mới thấy ranh giới TTC ≈ 1,5 s.",
        "more": "Chia miền vận hành (ODD) thành các ô theo tham số rồi đếm ô đã thử. 24 kịch bản cùng một góc vẫn thiếu. Kiểm ranh giới, không kiểm trung bình."
      },
      {
        "deep": true,
        "g": "scen",
        "t": "Agent choice changes the verdict (loại tác nhân đổi kết luận)",
        "en": "reactivity flip · nhiều tương lai",
        "d": "Đổi từ tác nhân phát lại sang tác nhân phản ứng có thể đảo thứ tự hai planner.",
        "ex": "Planner A 9% → 8%, planner B 4% → 14% va chạm khi xe khác phản ứng.",
        "more": "Một cảnh chỉ có một tương lai trong log nhưng nhiều tương lai khả dĩ: lấy mẫu nhiều lần (ví dụ 32) để thấy phân phối kết quả. Chọn sai loại tác nhân là chọn nhầm planner."
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
        "tex": "e_{t+1} = e_t + \\delta_t \\;\\Rightarrow\\; e_T \\approx \\sum_{t<T} \\delta_t",
        "read": "Vòng kín: sai lệch mỗi bước cộng dồn vào vị trí; vòng hở đặt lại e = 0 sau mỗi bước.",
        "ex": "Lệch 0,2 m mỗi bước, 30 bước → cỡ 6 m nếu lệch cùng chiều."
      },
      {
        "deep": true,
        "tex": "\\text{điểm lái} = \\text{hoàn thành lộ trình} \\times \\text{hệ số phạt}",
        "read": "Đi hết đường mà vi phạm nhiều thì điểm vẫn thấp (CARLA).",
        "ex": "0,8 × 0,7 = 56%."
      },
      {
        "deep": true,
        "tex": "n \\approx \\dfrac{-\\ln(1-C)}{r}",
        "read": "Số dặm cần chạy không lỗi để chứng minh tỷ lệ lỗi dưới r với độ tin C.",
        "ex": "r = 1,09·10⁻⁸ / dặm, C = 95% → ≈ 275 triệu dặm."
      },
      {
        "deep": true,
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
      "Phát lại log để đánh giá planner mới sinh va chạm giả.",
      "Chọn sai loại tác nhân có thể chọn nhầm bộ lập kế hoạch."
    ],
    "deepTraps": [
      "Phát lại \"nhanh nhất có thể\" che mất lỗi xử lý trễ hạn.",
      "Một hạt giống không đại diện: va chạm EgoMLP từ 11,9% đến 35,9% tuỳ seed.",
      "Đếm số kịch bản không phải độ bao phủ; kiểm ranh giới, không kiểm trung bình.",
      "Chia dữ liệu theo quỹ đạo, không theo khung."
    ],
    "remember": [
      "Thang kiểm thử: phát lại → vòng hở/kín → kịch bản → tác nhân phản ứng → chạy thật.",
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
        "Vì sao một mô hình chỉ biết vận tốc xe ta vẫn điểm vòng hở cao?",
        "Đa số cảnh là đi thẳng đều (73,9% nuScenes)."
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
      ],
      [
        "Detector chậm hơn hạn khung nhưng phát lại vẫn đạt. Vì sao?",
        "Phát lại nhanh nhất có thể chờ mọi khối, không bao giờ lỡ hạn; cần chạy thời gian thực."
      ]
    ]
  }
]
