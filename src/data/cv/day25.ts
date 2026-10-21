import { maker } from './make'

const q = maker(25)

// Day 25 · Vision–Language Model và VLA
export const day25 = [
  q.order('01', 1, 'Sắp xếp luồng xử lý của một VLM theo khuôn ViT–MLP–LLM.', [
    'Ảnh chia thành patch',
    'Vision encoder (ViT) rút đặc trưng',
    'Projector (MLP) chuyển thành token ảnh',
    'LLM nhận token ảnh + token văn bản và sinh câu trả lời',
  ], 'Qwen3-VL, GLM-V, InternVL, Kimi-VL, DeepSeek-VL2 đều theo khuôn này. Một số paper gọi projector là connector.'),

  q.single('02', 2, 'Qwen3-VL dùng patch 16 px và gộp 2 × 2 patch thành 1 token. Mỗi token ứng với vùng ảnh bao nhiêu?',
    '32 × 32 px',
    ['16 × 16 px', '64 × 64 px', '8 × 8 px'],
    'Ước tính 1 token cho mỗi 32 × 32 px, cạnh làm tròn về bội 32: ảnh 1280 × 720 ≈ 900 token, 1920 × 1080 ≈ 2 000 token.'),

  q.fill('03', 3, 'Theo ước tính 1 token/32×32 px của Qwen3-VL, ảnh 1280 × 720 cho khoảng bao nhiêu token?', ['900', '≈ 900', '~900', '880', '920'],
    '1280/32 = 40, 720/32 = 22,5 → làm tròn thành 22 hoặc 23 hàng: 880–920, tức ≈ 900 token. Độ phân giải, số tile và hệ số gộp đặt số token mỗi ảnh, tức chi phí và độ chi tiết.'),

  q.match('04', 2, 'Ghép vision encoder với đặc điểm.', [
    ['CLIP (2021)', 'Học tương phản trên cặp ảnh–văn bản; LLaVA-1.5 dùng CLIP-ViT-L-336px'],
    ['SigLIP 2 (2025)', 'Thêm caption, self-distillation, masked prediction; Qwen3-VL khởi tạo từ đây'],
    ['NaViT', 'Packing giữ tỉ lệ khung ảnh, nhận độ phân giải gốc'],
  ], 'MoonViT (Kimi-VL), Pixtral, Qwen3-VL cũng nhận ảnh ở độ phân giải gốc.'),

  q.match('05', 3, 'Ghép mô hình với ngân sách token ảnh.', [
    ['Gemma 3', '256 token mỗi ảnh'],
    ['InternVL3', '256 token mỗi tile 448²'],
    ['DeepSeek-OCR Tiny', '64 token mỗi trang'],
    ['DeepSeek-VL2', '196 token mỗi tile, tối đa 9 tile'],
  ], 'Token ảnh nhiều thì chi tiết hơn nhưng chi phí cao hơn.'),

  q.match('06', 2, 'Ghép kiểu projector với mô hình dùng nó.', [
    ['MLP', 'LLaVA-1.5'],
    ['Q-Former', 'BLIP-2'],
    ['Gộp 2×2 + MLP', 'Qwen3-VL, InternVL3'],
    ['Conv nén 16×', 'DeepSeek-OCR'],
  ], 'Projector nén token ảnh trước khi vào LLM; ví dụ Qwen3-VL ghép 4 token ViT × 1 152 chiều rồi MLP 2 lớp → 1 token.'),

  q.match('07', 2, 'Ghép cách fusion ảnh–văn bản với ví dụ.', [
    ['Adapter: tiền huấn luyện LLM văn bản trước rồi nối ViT', 'Qwen2.5-VL, GLM-V'],
    ['Early fusion: ảnh và văn bản chung backbone từ đầu', 'Llama 4, Qwen3.5, DeepSeek-V4.1'],
    ['Token rời rạc: ảnh 512×512 thành 1 024 token', 'Chameleon'],
  ], 'Early fusion phổ biến từ 2025.'),

  q.single('08', 2, 'Interleaved-MRoPE (Qwen3-VL) khác M-RoPE (Qwen2-VL) thế nào?',
    'Xen kẽ các trục t, h, w để phân bổ tần số đều hơn, thay vì mỗi trục một khối liền',
    ['Bỏ trục thời gian t', 'Dùng mã vị trí học được thay cho RoPE', 'Chỉ mã hoá vị trí cho token văn bản'],
    'ViT dùng 2D-RoPE (h, w) trên lưới patch; LLM thêm trục t. GLM-V dùng 3D-RoPE trong LLM; InternVL3 dùng V2PE với bước vị trí nhỏ cho token ảnh.'),

  q.single('09', 2, 'DeepStack trong Qwen3-VL làm gì?',
    'Đưa đặc trưng các lớp 8, 16, 24 của ViT qua merger riêng rồi cộng vào lớp 1–3 của LLM, không tăng số token ảnh',
    ['Xếp chồng nhiều ảnh thành một token', 'Thêm 3 lớp LLM mới cho ảnh', 'Nhân đôi số token ảnh để tăng chi tiết'],
    'Ablation: DocVQA 89,5 → 91,1; InfoVQA 71,9 → 74,2.'),

  q.single('10', 2, 'Qwen3-VL đánh dấu thời gian trong video thế nào?',
    'Chèn mốc thời gian dạng văn bản như "<2.0 seconds>" cùng token ảnh',
    ['Dùng time id tuyệt đối trong MRoPE như Qwen2.5-VL', 'Bỏ thông tin thời gian', 'Mỗi khung một video riêng'],
    'Qwen2.5-VL dùng time id tuyệt đối nên video dài cho id lớn và thưa. Mỗi 2 khung gộp thành 1 temporal patch.'),

  q.single('11', 1, 'Khi nạp nhãn box từ VLM, vì sao code phân tích box không dùng chung giữa Qwen2.5-VL và Qwen3-VL?',
    'Qwen2.5-VL trả pixel tuyệt đối, Qwen3-VL trả toạ độ chuẩn hoá [0, 1000]',
    ['Qwen3-VL không xuất được box', 'Hai mô hình dùng thứ tự (y, x) ngược nhau', 'Qwen2.5-VL trả box dạng mask'],
    'Đổi box thang 0–1000 sang pixel: x/1000·W, y/1000·H. GLM-4.5V cũng dùng [0, 1000] nhưng bọc trong thẻ <|begin_of_box|>.'),

  q.fill('12', 3, 'Qwen3-VL trả box x1 = 500 (thang 0–1000) cho ảnh rộng W = 1 920 px. x1 bằng bao nhiêu pixel?', ['960'],
    'x1_px = 500/1000 · 1 920 = 960. Với Qwen2.5-VL thì box đã là pixel, không chia.'),

  q.single('13', 1, 'Khi nào nên tắt chế độ thinking của VLM?',
    'Khi tag hoặc caption hàng loạt: thinking tăng chất lượng lập luận nhưng nhân chi phí token và độ trễ',
    ['Khi gặp trường hợp khó cần lập luận', 'Khi cần box chính xác hơn', 'Không bao giờ nên tắt'],
    'Ví dụ trên RTX 3090: Qwen3-VL-30B-Thinking 31,5 s/khung so với CLIP ViT-L/14 0,2 s/khung. Trường hợp khó thì bật.'),

  q.single('14', 2, 'Với mô hình MoE như Qwen3-VL 30B-A3B, bộ nhớ GPU và chi phí tính toán phụ thuộc gì?',
    'VRAM theo tổng tham số (30B); chi phí tính theo phần hoạt động mỗi token (3B)',
    ['Cả hai theo tham số hoạt động', 'Cả hai theo tổng tham số', 'VRAM theo tham số hoạt động; chi phí theo tổng'],
    'MoE: tổng tham số lớn, tham số hoạt động mỗi token nhỏ. Kimi-VL 16B tổng, 2,8B hoạt động.'),

  q.single('15', 1, 'Giai đoạn 1 (căn chỉnh) khi huấn luyện Qwen3-VL cập nhật thành phần nào?',
    'Chỉ projector (merger); ViT và LLM đóng băng',
    ['Chỉ LLM; ViT và projector đóng băng', 'Cả ViT, projector và LLM', 'Chỉ ViT'],
    'Qwen3-VL dùng 67B token cho giai đoạn này; MiMo-VL 300B token chỉ projector; DeepSeek-VL2 cập nhật cả ViT + adapter. Các giai đoạn sau mở cả ba.'),

  q.order('16', 2, 'Sắp xếp năm giai đoạn huấn luyện VLM (theo Qwen3-VL).', [
    'Căn chỉnh (alignment)',
    'Tiền huấn luyện (pretraining)',
    'Ngữ cảnh dài (32K rồi 256K)',
    'Tinh chỉnh có giám sát (SFT)',
    'Học tăng cường (RL)',
  ], 'Căn chỉnh trước, mở toàn bộ sau. Tiền huấn luyện ~1T token; SFT 1,2M mẫu; RL dùng verifier.'),

  q.single('17', 2, 'Hàm mất mát của giai đoạn căn chỉnh là gì?',
    'Dự đoán token tiếp theo, chỉ tính trên text token; dữ liệu caption, OCR, tri thức',
    ['Tái tạo pixel của ảnh', 'Contrastive giữa ảnh và văn bản', 'Hồi quy box trên ảnh'],
    'Token ảnh là ngữ cảnh đầu vào; mất mát chỉ tính trên phần văn bản mô hình cần sinh.'),

  q.single('18', 2, 'Theo GLM-V, SFT có vai trò gì?',
    'Căn chỉnh phong cách trả lời, không thêm tri thức',
    ['Thêm tri thức mới về thế giới', 'Thay thế hoàn toàn tiền huấn luyện', 'Chỉ dạy mô hình đọc chữ (OCR)'],
    'Qwen3-VL SFT 1,2M mẫu (2/3 có ảnh/video), rồi long-CoT cold start (VL : text ≈ 1:1), strong-to-weak distillation chỉ cho LLM.'),

  q.single('19', 1, 'RL với phần thưởng kiểm chứng được (verifiable reward) hoạt động thế nào với VLM?',
    'VLM sinh nhiều đáp án, verifier tự động chấm (đúng = 1, IoU cho box…) rồi cập nhật policy',
    ['Người chấm từng đáp án bằng tay', 'Mô hình tự chấm đáp án của chính nó', 'Chỉ giữ đáp án ngắn nhất'],
    'Phần thưởng đến từ verifier khi đáp án kiểm tra được. Biến thể: SAPO (Qwen3-VL), RLCS (GLM-V), MPO → GSPO (InternVL3.5), MORL (MiMo-VL, RLVR + RLHF).'),

  q.single('20', 3, 'RLCS của GLM-V làm gì với các mẫu huấn luyện?',
    'Bỏ mẫu quá dễ và quá khó theo pass@k',
    ['Chỉ giữ mẫu có ảnh', 'Lặp lại mẫu khó nhiều lần', 'Đổi nhãn mẫu sai'],
    'Mẫu luôn đúng hoặc luôn sai không cho tín hiệu học có ích trong RL.'),

  q.match('21', 2, 'Ghép kỹ thuật giảm hallucination với mô hình.', [
    ['Recaption: bỏ chi tiết không có thật trong caption', 'GLM-V'],
    ['RL phản trực giác: đếm object, đọc giờ', 'Qwen3-VL'],
    ['MPO: giảm lệch huấn luyện–suy luận', 'InternVL3'],
  ], 'Qwen3-VL còn dùng reward model lọc mẫu kém trước SFT. Chưa có nguồn đo mức giảm POPE của từng kỹ thuật.'),

  q.multi('22', 1, 'Khi chọn VLM để gán nhãn, cần xem những yếu tố nào? (chọn nhiều)',
    ['Giấy phép trọng số', 'Định dạng box', 'Chi phí token'],
    ['Màu logo của hãng', 'Số lượng sao trên GitHub'],
    'Qwen3-VL: Apache-2.0, box 0–1000. GLM-4.5V: MIT, box 0–1000 có thẻ. Benchmark công bố không thay phép thử trên dữ liệu riêng.'),

  q.match('23', 1, 'Ghép vai trò của VLM trong vòng lặp dữ liệu với ví dụ.', [
    ['Tạo nhãn khởi tạo', 'Aurora: hãng, mẫu, kích thước xe'],
    ['Tìm cảnh', 'RefAV: 10 000 truy vấn'],
    ['Duyệt nhãn', 'DriveBench: GPT-4o đúng 59,5% với ảnh đen'],
    ['Vết lập luận', 'Alpamayo-R1: GPT-5 sinh nhãn CoC'],
  ], 'Mỗi vai cần phép đo riêng. VLM tạo nhãn khởi tạo tốt nhưng đánh giá nhãn kém.'),

  q.single('24', 2, 'Aurora dùng VLM để làm gì trong gán nhãn 3D?',
    'Từ crop camera, suy ra hãng, mẫu, đời xe và kích thước theo mẫu xe để tạo box 3D khởi tạo cho người chỉnh',
    ['Thay thế hoàn toàn LiDAR trong gán nhãn', 'Gán nhãn mask từng pixel', 'Đếm số người trong ảnh'],
    'Gemini 2.5 Pro đúng cả hãng, mẫu, đời 98,1%; sai số dài/rộng/cao giảm 14,0/33,7/19,9% so với baseline biết loại xe. Số từ bài báo, chưa kiểm lại.'),

  q.single('25', 1, 'Structured output với JSON schema bảo đảm điều gì?',
    'Cấu trúc đúng schema, nhưng không bảo đảm giá trị đúng: phải kiểm giá trị trong code',
    ['Cả cấu trúc lẫn giá trị đều đúng', 'Giá trị đúng nhưng cấu trúc có thể sai', 'Mô hình không bao giờ trả null'],
    'Cho phép null để VLM từ chối trả lời. Ví dụ: chiều dài null hoặc ngoài 2,5–20 m thì gửi người duyệt. Gemini docs: "always validate values in your application".'),

  q.single('26', 1, 'RefAV cho thấy gì về tìm cảnh theo ngôn ngữ tự nhiên ("xe đạp vượt xe ego từ bên phải rồi rẽ trái")?',
    'Cần track 3D và chương trình truy vấn trên track; embedding CLIP thuần kém xa (24,6 so với 64,8 HOTA-Temporal trên track GT)',
    ['CLIP thuần là đủ cho mọi truy vấn', 'Chương trình truy vấn không cần tracker', 'Tracker thật cho kết quả tốt hơn track GT'],
    'Với tracker thật: CLIP 17,2, RefProg 50,1. Truy vấn có quan hệ thời gian và không gian cần cấu trúc, không chỉ độ giống ảnh–câu.'),

  q.single('27', 1, 'DriveBench: GPT-4o đạt 59,5% với ảnh đen và 59,0% với ảnh thật trên MCQ perception 3 lựa chọn. Kết luận?',
    'Mô hình dựa vào gợi ý văn bản hơn là thật sự nhìn ảnh; cần kiểm độc lập khi dùng VLM duyệt nhãn',
    ['GPT-4o nhìn trong bóng tối tốt', 'Ảnh thật bị nhiễu nên kém hơn', 'Câu hỏi quá khó cho người'],
    'Ngẫu nhiên ~33%, người 93,3%. Trích dẫn: "…textual cues rather than true visual grounding". DriveBench: 12 VLM, 19 200 khung.'),

  q.single('28', 2, 'Đối chiếu caption VLM với inventory của detector (Semantic-Drive) thay đổi recall và precision thế nào?',
    'Recall tăng 0,814 → 0,932 nhưng precision gần như không đổi ≈ 0,71',
    ['Precision tăng lên 0,99, recall giảm', 'Cả hai cùng tăng lên trên 0,95', 'Không thay đổi gì'],
    'Inventory giúp lọc chi tiết không có thật, nhưng ~29% khung bị gắn cờ vẫn sai. N = 108 khung là mẫu nhỏ.'),

  q.single('29', 2, 'Caption VLM: "Hai xe con dừng trước vạch, một người đi bộ đang qua đường." Inventory detector: car × 2, person × 0. Quyết định hợp lý?',
    'Gửi người duyệt, vì caption và inventory lệch nhau ở người đi bộ',
    ['Nhận caption vì VLM thông minh hơn detector', 'Xoá cả khung hình', 'Sửa inventory cho khớp caption'],
    'Khớp thì nhận, lệch thì gửi người. Máy tạo nhãn khởi tạo, máy kiểm tra, người quyết định.'),

  q.order('30', 2, 'Sắp xếp pipeline gán nhãn có VLM do giảng viên thiết kế.', [
    'Chọn dữ liệu (trigger, truy vấn)',
    'Hình học (detector, SAM, tracker)',
    'VLM tạo nhãn (JSON, cho phép null)',
    'Kiểm tự động (inventory, ảnh đen)',
    'Judge chấm đúng/sai',
    'Người sửa, audit 10–20%, gold',
    'Huấn luyện (active learning cho class hiếm)',
    'Ghi phiên bản (mô hình, prompt, schema)',
  ], 'Nhánh "bất đồng" từ bước kiểm tự động đi thẳng tới người.'),

  q.single('31', 2, 'Embodied-CoT dùng VLM gán nhãn quỹ đạo Bridge v2 và đạt kết quả gì?',
    'Gán nhãn trong 7 ngày; OpenVLA tăng 28 điểm phần trăm success trên tác vụ generalization khó',
    ['Thay hoàn toàn người điều khiển robot', 'Giảm số demo cần thu xuống 0', 'Tăng tốc độ robot gấp 28 lần'],
    'Nhưng thành công vẫn cần đo: SuccessVQA cho thấy Flamingo chưa tinh chỉnh gần mức ngẫu nhiên; GVL ước lượng tiến độ từ thứ tự frame.'),

  q.single('32', 1, 'VLA là gì?',
    'VLM đã pretrain + đầu ra hành động: nhận ảnh và câu lệnh, trả về hành động (dx, dy, dz, xoay, kẹp)',
    ['VLM chỉ trả lời câu hỏi bằng văn bản', 'Bộ phát hiện vật thể có nhãn văn bản', 'Mô hình chọn một đáp án trong danh sách'],
    'Ví dụ: "nhặt cốc đỏ" → cánh tay robot nhận chuỗi lệnh chuyển động.'),

  q.match('33', 2, 'Ghép cách sinh hành động của VLA với mô tả.', [
    ['Token rời rạc', 'Giải mã từng token như sinh văn bản'],
    ['Flow / diffusion head', 'Khử nhiễu thành chuỗi mượt cùng lúc (Qwen-Drive)'],
    ['Hai hệ nhanh–chậm', 'VLM chậm và policy nhanh chạy song song'],
  ], 'Qwen-Drive thuộc họ flow/diffusion: planner khử nhiễu cả quỹ đạo cùng lúc.'),

  q.single('34', 2, 'Qwen-Drive-1.0 gồm những gì?',
    'Backbone VLM Qwen3.5-4B + planner flow matching ~1,1 tỷ tham số, mở trọng số Apache 2.0',
    ['Một detector YOLO + bộ luật lái', 'LLM 70B chỉ xử lý văn bản', 'Mô hình đóng chỉ truy cập qua API'],
    'Alibaba Qwen và HUST. Một mô hình làm ba việc: nhận thức 3D, VQA, lập kế hoạch.'),

  q.single('35', 1, 'Planner của Qwen-Drive xuất quỹ đạo dạng nào?',
    '50 waypoint (x, y, heading) trong 5 s ở 10 Hz, trong khung toạ độ của ego tại thời điểm hiện tại',
    ['10 waypoint trong 1 s', 'Một lệnh góc lái duy nhất', '50 ảnh dự đoán tương lai'],
    'Đầu vào: 6–8 camera, lịch sử ego, lệnh dẫn đường. Planning đọc 3 camera trước × 4 mốc thời gian (−1,5 s … hiện tại).'),

  q.match('36', 3, 'Ghép đầu ra của Qwen-Drive với dạng dữ liệu.', [
    ['Chữ', 'Trả lời VQA, chuỗi lập luận'],
    ['Hộp 3D', 'Góc nhìn BEV, 7 lớp'],
    ['Occupancy', 'Voxel 200 × 200 × 16'],
    ['Bản đồ BEV', '400 × 200, 6 lớp'],
    ['Quỹ đạo', '50 điểm (x, y, heading), 5 s, 10 Hz'],
  ], 'Quỹ đạo là loại đầu ra cuối, do planner sinh.'),

  q.single('37', 2, 'Planner của Qwen-Drive tạo quỹ đạo thế nào?',
    'Tinh chỉnh cả 50 điểm cùng lúc từ nhiễu qua 10 bước, đọc key/value từ 8 lớp VLM',
    ['Sinh từng điểm một như sinh token văn bản', 'Chọn quỹ đạo gần nhất trong cơ sở dữ liệu', 'Nội suy tuyến tính từ vị trí hiện tại'],
    'Planner flow matching 32 lớp, mỗi cache → 4 lớp; có nhánh x-prediction ước lượng thẳng quỹ đạo sạch.'),

  q.single('38', 2, 'Lệnh run của Qwen-Drive với num_samples = 6 trả về trajectories có shape nào?',
    '(6, 50, 3): 6 ứng viên × 50 điểm × (x, y, heading)',
    ['(50, 6, 3)', '(6, 3)', '(1, 50, 2)'],
    'Mô hình trả 6 ứng viên; chọn cái tốt nhất theo oracle (đáp án chuẩn) là việc của người chấm. VLM nặng 9,1 GB; GPU ≥ 24 GB được khuyến nghị.'),

  q.order('39', 2, 'Sắp xếp bốn giai đoạn huấn luyện Qwen-Drive.', [
    'Perception: huấn luyện vision encoder và perception head',
    'VLM + perception',
    'Flow matching: huấn luyện planner',
    'RL với phần thưởng: tinh chỉnh planner',
  ], 'Planner chỉ được huấn luyện khi VLM đã đóng băng.'),

  q.single('40', 3, 'Dữ liệu huấn luyện Qwen-Drive gồm bao nhiêu mẫu planning và VQA?',
    '2,83 triệu mẫu planning (24,2% có lập luận) và 3,09 triệu mẫu VQA từ 24 bộ',
    ['283 nghìn planning và 309 nghìn VQA', '28 triệu planning, không có VQA', '3,09 triệu planning và 2,83 triệu VQA'],
    'Nguồn planning: NAVSIM, OpenScene, WOD-E2E, PAI-AV; 685 nghìn mẫu có chuỗi lập luận.'),

  q.single('41', 2, 'Qwen-Drive đạt PDMS 90,7 trên NAVSIM nhưng thua Alpamayo-R1 ở đâu?',
    'Vòng kín AlpaSim: close-encounter 41,0% so với 19,0% của Alpamayo-R1 (thấp hơn là tốt)',
    ['NAVSIM: Alpamayo-R1 đạt 99,0', 'WOD-E2E: Qwen-Drive thua người lái 3 điểm', 'Không thua ở đâu'],
    'WOD-E2E RFS 7,91 so với người lái 8,13. 91,4 PDMS là best-of-6 theo oracle. Paper tự nêu: lập luận có thể không khớp quyết định thật, và không nêu độ trễ.'),

  q.single('42', 1, 'Vì sao OpenAI Decisions API và Jev không phải VLA?',
    'Chúng chỉ chọn 1 trong N đáp án kèm xác suất; lệnh motor phải do mã bên ngoài sinh',
    ['Chúng không nhận đầu vào văn bản', 'Chúng chạy nhanh hơn 200 Hz', 'Chúng sinh quỹ đạo liên tục'],
    'VLA sinh hành động liên tục, ví dụ Helix S1 (Figure) 200 Hz. Mô hình quyết định chọn đáp án vài lần/giây (ước tính từ độ trễ 70–500 ms).'),

  q.tf('43', 2, 'Trong phản hồi của Decisions API hay Jev, "confidence" chính là xác suất cao nhất trong danh sách đáp án.', false,
    'Sai. Tài liệu ghi rõ confidence ≠ xác suất cao nhất. Ví dụ Jev: choice technical, confidence 0,78 trong khi xác suất technical là 0,85.'),

  q.single('44', 2, 'Jev (TypeSafe) có đặc điểm gì?',
    'Chỉ nhận văn bản, không tự hồi quy, không sinh chữ; tối đa 255 đáp án, 64k token ngữ cảnh',
    ['Nhận ảnh camera và sinh quỹ đạo', 'Là một VLA mở trọng số', 'Sinh văn bản dài như chatbot'],
    'TypeSafe gọi Jev là "System One". Độ trễ công bố 70–500 ms.'),

  q.multi('45', 1, 'Vì sao mô hình quyết định không hợp làm vòng an toàn? (chọn nhiều)',
    ['Chỉ chọn trong danh sách hữu hạn', 'Độ trễ mạng dao động, cần lớp an toàn cục bộ', 'Thứ tự đáp án có thể đổi xác suất'],
    ['Chúng luôn chọn đáp án đầu tiên', 'Chúng không trả về xác suất'],
    'Góc dữ liệu: log (trạng thái, đáp án, kết quả) có thể thành dataset. Chưa thấy kết quả lái xe của hai mô hình này.'),

  q.match('46', 1, 'Ghép mô hình với vào → ra.', [
    ['Qwen-Drive', 'Ảnh, ego, lệnh → quỹ đạo 50 điểm (mở)'],
    ['Decisions API', 'Chữ/ảnh + đáp án → xác suất (đóng, beta)'],
    ['Jev', 'Chữ → đáp án + xác suất (đóng, API)'],
  ], 'Chỉ Qwen-Drive sinh quỹ đạo; hai mô hình kia cần mã ngoài tạo lệnh motor.'),

  q.single('47', 1, 'Ý chính của chương "VLM trong vòng lặp dữ liệu" là gì?',
    'VLM tạo nhãn khởi tạo tốt nhưng đánh giá nhãn kém, nên mỗi nhãn cần kiểm độc lập',
    ['VLM đã thay được người gán nhãn', 'VLM chỉ dùng được để tìm cảnh', 'VLM đánh giá nhãn tốt hơn tạo nhãn'],
    'Kiểm độc lập: inventory của detector, kiểm ảnh đen, judge, người audit.'),

  q.single('48', 2, 'Vì sao năm hệ thống lái (Alpamayo-R1, DriveGPT4, DriveLM, Qwen-Drive, LINGO-1) dùng VLM tạo dữ liệu nhưng không so sánh trực tiếp được?',
    'Mỗi hệ thống dùng một quy trình tạo dữ liệu khác nhau',
    ['Chúng dùng cùng một dataset', 'Chúng đều đóng mã nguồn', 'Chúng chỉ khác nhau ở tên gọi'],
    'Ví dụ: GPT-5 viết CoC (Alpamayo-R1), ChatGPT sinh QA từ box YOLOv8 (DriveGPT4), QA bán rule-based (DriveLM), VLM viết lại và lọc giữ 55,9% (Qwen-Drive), lời bình tài xế (LINGO-1).'),

  q.tf('49', 3, 'Qwen3-VL có cả bản Instruct và bản Thinking, ngữ cảnh 256K.', true,
    'Đúng. Cấu hình: dense 2B/4B/8B/32B, MoE 30B-A3B và 235B-A22B, ngữ cảnh 256K. Chạy được bằng transformers (~12 dòng) hoặc vllm serve mở API kiểu OpenAI.'),

  q.single('50', 2, 'Trong pipeline Qwen3-VL, ảnh đi qua những khối nào để ra text và box?',
    'SigLIP-2 ViT (patch 16, 2D-RoPE) → merger 2×2 → LLM Qwen3 (interleaved-MRoPE, DeepStack) → text, box 0–1000',
    ['CLIP ResNet → Q-Former → LLaMA → box pixel', 'ViT → không projector → GPT → mask', 'CNN → FPN → head phát hiện → box'],
    'Mốc thời gian video dạng văn bản đi vào LLM cùng token ảnh.'),
]
