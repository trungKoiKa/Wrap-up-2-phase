import { maker } from './make'

const q = maker(18)

// Day 18 · 2D Perception: detection, segmentation, keypoints
export const day18 = [
  q.match('01', 1, 'Ghép bài toán 2D với dạng output của nó.', [
    ['Classification', '(C,): một nhãn cho cả ảnh'],
    ['Detection', 'N × (box, class, score)'],
    ['Semantic segmentation', 'H × W → class'],
    ['Instance segmentation', 'N × (mask, class, score)'],
    ['Panoptic segmentation', 'H × W → (class, id)'],
    ['Keypoints', 'N × K × (x, y, v)'],
  ], 'Cùng một ảnh, sáu kiểu câu trả lời khác nhau ở cấu trúc output. Từ detection trở đi, N thay đổi theo ảnh.'),

  q.single('02', 1, '"Sợi chỉ xuyên suốt" của các bài toán 2D có output là tập kích thước thay đổi là gì?',
    'Assignment: quyết định dự đoán nào khớp với ground-truth nào',
    ['Chọn backbone đủ lớn', 'Tăng độ phân giải ảnh đầu vào', 'Chuẩn hoá ảnh về trung bình 0'],
    'N không biết trước nên phải ghép dự đoán với GT: anchor, NMS, Hungarian matching, Mask2Former, ghép theo OKS đều là cách trả lời câu hỏi này.'),

  q.match('03', 2, 'Ghép bài toán với metric thường dùng.', [
    ['Detection', 'box mAP@[.5:.95]'],
    ['Semantic segmentation', 'mIoU'],
    ['Panoptic segmentation', 'PQ = SQ × RQ'],
    ['Keypoints', 'OKS-AP'],
  ], 'Instance segmentation dùng mask mAP (như box AP nhưng IoU tính trên mask); classification dùng Top-1/Top-5.'),

  q.single('04', 2, 'Camera giao thông cần đếm từng xe và đồng thời biết vùng nào là mặt đường. Output nào khớp nhất?',
    'Panoptic segmentation',
    ['Object detection', 'Semantic segmentation', 'Image classification'],
    'Xe là "things" (đếm được, cần id riêng), mặt đường là "stuff" (chỉ cần class). Panoptic gán mỗi pixel (class, id) nên phủ cả hai.'),

  q.match('05', 1, 'Ghép quy ước box với nơi dùng.', [
    ['xyxy (x1, y1, x2, y2), pixel', 'torchvision, Pascal VOC, hầu hết hàm IoU/NMS'],
    ['xywh (góc trên-trái + kích thước), pixel', 'File JSON của COCO'],
    ['cxcywh chuẩn hoá về [0, 1]', 'Nhãn YOLO .txt'],
  ], 'Letterbox (resize giữ tỉ lệ rồi đệm viền) thì phải trừ padding và chia scale khi trả box về ảnh gốc.'),

  q.single('06', 1, 'Nhầm xywh (COCO) với cxcywh (YOLO) khi chuyển nhãn gây hậu quả gì?',
    'Mọi box lệch nửa kích thước; loss vẫn giảm nhưng mAP thì không',
    ['Code báo lỗi ngay khi đọc file nhãn', 'Box bị lật ngang nhưng vị trí tâm vẫn đúng', 'Chỉ ảnh hưởng tới vật nhỏ hơn 32 px'],
    'Lỗi âm thầm vì cả hai đều là bốn số hợp lệ. Sau mỗi lần chuyển định dạng, vẽ lại vài nhãn lên ảnh trước khi train.'),

  q.multi('07', 2, 'IoU đóng những vai trò nào trong pipeline phát hiện? (chọn nhiều)',
    ['Assignment khi train', 'Ngưỡng của NMS', 'Tiêu chí TP/FP khi đánh giá'],
    ['Hàm kích hoạt của lớp ra', 'Tốc độ học của head'],
    'IoU = |A ∩ B| / |A ∪ B|. IoU loss = 1 − IoU có gradient 0 khi hai box không giao; GIoU, DIoU, CIoU sửa điều đó và hội tụ nhanh hơn. DETR dùng L1 + GIoU.'),

  q.order('08', 1, 'Sắp xếp họ R-CNN theo thứ tự ra đời và ý tưởng chính.', [
    'R-CNN: ~2 000 vùng Selective Search, chạy CNN cho từng vùng',
    'Fast R-CNN: chạy CNN một lần, cắt feature từng vùng bằng RoI Pool',
    'Faster R-CNN: RPN học luôn bước đề xuất vùng trên feature map',
  ], 'Mỗi bước gỡ một nút thắt tốc độ: chia sẻ tính toán giữa các vùng (Fast, nhanh hơn R-CNN 213 lần lúc test), rồi học bước đề xuất (Faster, 5 fps toàn pipeline).'),

  q.order('09', 2, 'Sắp xếp các giai đoạn của Faster R-CNN.', [
    'Backbone + FPN: feature đa tỷ lệ',
    'RPN: anchor → objectness + offset, NMS 0.7 → ~1 000 proposals',
    'RoIAlign: cắt feature 7 × 7 mỗi proposal',
    'Head: class + tinh chỉnh box, NMS 0.5 theo class',
  ], 'Chính xác, tốt với object nhỏ và dễ mở rộng (thêm mask head = Mask R-CNN), nhưng nhiều bước tuần tự, hai lần NMS, khó real-time trên edge.'),

  q.single('10', 2, 'Feature map 512 × 20 × 15, RPN đặt K = 9 anchor ở mỗi vị trí. Tensor box offset có kích thước nào?',
    '36 × 20 × 15',
    ['9 × 20 × 15', '4 × 20 × 15', '512 × 9 × 4'],
    'Mỗi anchor có 4 offset nên 4K = 36 kênh. Objectness có K × 20 × 15. K = 9 là 3 kích thước × 3 tỉ lệ.'),

  q.tf('11', 2, 'RPN về bản chất là một detector một giai đoạn chỉ có 2 lớp (object / nền).', true,
    'Đúng. Thay 2 lớp bằng C lớp và bỏ giai đoạn hai là ra detector một giai đoạn như RetinaNet, YOLO.'),

  q.single('12', 1, 'Vì sao Mask R-CNN thay RoI Pool bằng RoI Align?',
    'Bỏ làm tròn toạ độ, nội suy song tuyến nên feature khớp đúng pixel, quan trọng cho mask',
    ['RoI Align chạy nhanh hơn RoI Pool', 'RoI Align tốn ít bộ nhớ hơn', 'RoI Pool không dùng được với FPN'],
    'RoI Pool làm tròn khiến bin lệch tới nửa ô, tức 16 px ảnh gốc ở stride 32. Box chịu được, mask từng pixel thì không: RoI Align cải thiện mask tương đối 10–50%.'),

  q.single('13', 2, 'FPN chọn tầng feature cho một RoI kích thước w × h theo công thức nào?',
    'k = ⌊4 + log₂(√(wh)/224)⌋: RoI lớn lấy tầng sâu hơn',
    ['Luôn lấy tầng P2 vì phân giải cao nhất', 'Luôn lấy tầng P5 vì ngữ nghĩa mạnh nhất', 'Chọn ngẫu nhiên một tầng mỗi lần train'],
    'FPN: đường top-down đưa ngữ nghĩa từ C5 xuống, lateral conv 1 × 1 giữ chi tiết. PAN (YOLOv4 → YOLO26) thêm một đường bottom-up nữa sau FPN.'),

  q.fill('14', 1, 'Ảnh 640 × 640, detector dự đoán trên 3 tầng stride 8, 16, 32, mỗi vị trí 1 dự đoán. Có bao nhiêu dự đoán trước NMS?', ['8400', '8 400', '8.400'],
    '80² + 40² + 20² = 6 400 + 1 600 + 400 = 8 400. Gần như tất cả là nền, nên cần focal loss và cần bỏ duplicate.'),

  q.match('15', 2, 'Ghép chiến lược label assignment với ví dụ.', [
    ['Tĩnh theo IoU (≥ 0.7 positive, < 0.3 negative)', 'Faster R-CNN RPN, RetinaNet'],
    ['Thống kê: ngưỡng = mean + std IoU của candidate', 'ATSS'],
    ['Động theo chất lượng t = s^α · u^β, lấy top-k', 'SimOTA, TAL (YOLOv8, YOLO26)'],
  ], 'Quy tắc assignment ảnh hưởng mAP không kém backbone. Tĩnh phụ thuộc thiết kế anchor; động dùng điểm class và IoU dự đoán.'),

  q.single('16', 1, 'Vì sao assignment one-to-many cần NMS còn one-to-one thì không?',
    'One-to-many cho k > 1 positive mỗi object nên sinh duplicate; one-to-one chỉ 1 dự đoán học mỗi object',
    ['One-to-one dùng anchor còn one-to-many thì không', 'One-to-many chỉ dùng khi suy luận', 'NMS chỉ chạy được với head anchor-free'],
    'One-to-many cho tín hiệu học dày nhưng phải dọn duplicate bằng NMS. DETR và YOLO26 dùng one-to-one để bỏ NMS.'),

  q.single('17', 2, 'YOLOv1 (2016) dự đoán thế nào?',
    'Lưới 7 × 7, ô chứa tâm object chịu trách nhiệm; output 7 × 7 × 30, một lần forward',
    ['Hai giai đoạn: đề xuất vùng rồi phân lớp', 'Anchor từ k-means trên 3 tỷ lệ', 'Object query với ghép Hungarian'],
    'Ý còn giữ tới nay: một lần forward, mỗi vị trí dự đoán trực tiếp box và class. Anchor k-means đến từ YOLOv2, 3 tỷ lệ từ YOLOv3.'),

  q.order('18', 3, 'Sắp xếp các phiên bản YOLO theo ý tưởng mới mà chúng đưa vào.', [
    'YOLOv2: anchor từ k-means, BatchNorm',
    'YOLOv3: dự đoán ở 3 tỷ lệ, Darknet-53',
    'YOLOv8: anchor-free, head tách nhánh, DFL, TAL',
    'YOLOv10: dual assignment, suy luận không NMS',
    'YOLO26: bỏ DFL, head one-to-one, STAL, ProgLoss, MuSGD',
  ], 'YOLOv4/v5 thêm CSP + PAN, Mosaic; YOLO26 ra 01/2026, hỗ trợ 7 tác vụ.'),

  q.single('19', 1, 'YOLO26 trên COCO (80 class), head one-to-many: mỗi trong 8 400 điểm dự đoán xuất ra bao nhiêu số?',
    '84 = 4 box + 80 class',
    ['85 = 4 box + 1 objectness + 80 class', '144 = 4 × 16 bin DFL + 80 class', '6 = x1, y1, x2, y2, score, class'],
    'YOLO26 không có objectness và bỏ DFL (reg_max = 1), nên tensor là (1, 84, 8400) → NMS. Head one-to-one cho (1, 300, 6), không NMS.'),

  q.single('20', 1, 'Head one-to-one không cần NMS. Vì sao YOLO26 / YOLOv10 vẫn giữ head one-to-many lúc train?',
    'One-to-one chỉ có 1 positive mỗi object nên tín hiệu học thưa, hội tụ chậm',
    ['Để inference nhanh hơn', 'Vì one-to-one không dùng được với anchor-free', 'Vì NMS là bắt buộc khi train'],
    'Hai head train cùng lúc; ProgLoss dịch dần trọng số sang one-to-one. Head one-to-one thấp hơn 0.6–0.8 mAP nhưng latency ổn định, dễ export.'),

  q.tf('21', 2, 'Ultralytics 8.4.x mặc định chạy YOLO26 bằng head one-to-one (không NMS).', false,
    'Sai. Mặc định là one-to-many + NMS. Phải đặt nms=False để dùng head one-to-one (tối đa 300 box) — đây là cấu hình của số latency công bố.'),

  q.single('22', 2, 'Anchor-free (FCOS, YOLOv8 → YOLO26) hồi quy box bằng gì?',
    'Khoảng cách từ điểm tới 4 cạnh (l, t, r, b)',
    ['Offset so với anchor định sẵn', 'Toạ độ hai góc chéo trên heatmap', 'Một mask nhị phân rồi lấy box bao'],
    'Anchor-based (SSD, RetinaNet, YOLOv3–v5): box = anchor + offset, phải chọn kích thước anchor theo dữ liệu. Anchor-free bớt siêu tham số.'),

  q.single('23', 2, 'Với focal loss γ = 2, một ví dụ khó có p_t = 0,1 được giữ lại bao nhiêu phần so với CE?',
    'Khoảng 0,81 lần: gần như giữ nguyên',
    ['0,01 lần: giảm 100 lần', '0,5 lần: giảm một nửa', '0 lần: bị bỏ hẳn'],
    '(1 − 0,1)² = 0,81. Ví dụ dễ p_t = 0,9 thì (0,1)² = 0,01, giảm 100 lần. RetinaNet (γ = 2, α = 0.25) là detector một giai đoạn đầu tiên vượt hai giai đoạn trên COCO.'),

  q.match('24', 3, 'Ghép cách hồi quy box với mô hình dùng nó.', [
    ['Smooth L1 trên offset (dx, dy, dw, dh)', 'Faster R-CNN, SSD'],
    ['Họ IoU (GIoU, CIoU)', 'YOLOv4–v8, DETR'],
    ['DFL: mỗi cạnh là phân phối trên bin rời rạc', 'YOLOv8, YOLO11'],
    ['Phân phối tinh chỉnh dần qua từng lớp decoder', 'D-FINE'],
    ['Hồi quy trực tiếp, bỏ DFL', 'YOLO26'],
  ], 'Xu hướng 2025–26: nhánh real-time đơn giản hoá head để chạy tốt trên CPU / NPU / TensorRT, bù độ chính xác bằng assignment và chiến lược huấn luyện.'),

  q.order('25', 1, 'Sắp xếp các bước của greedy NMS.', [
    'Lọc theo confidence (ví dụ ≥ 0.25)',
    'Sắp score giảm dần, giữ box cao nhất',
    'Loại mọi box còn lại có IoU > ngưỡng với box vừa giữ',
    'Lặp lại với các box còn sót',
  ], 'Ví dụ YOLO26n trên bus.jpg (conf ≥ 0.25): 51 box trước NMS còn 5 box sau NMS IoU 0.7.'),

  q.single('26', 2, 'Class-aware NMS (batched NMS) làm thế nào để box khác class không loại nhau?',
    'Cộng một offset theo class vào toạ độ để box khác class không chồng nhau, rồi chạy NMS một lần',
    ['Chạy NMS riêng trên từng ảnh của lô', 'Chỉ giữ class có điểm cao nhất trong ảnh', 'Đặt ngưỡng IoU bằng 1 cho các class khác nhau'],
    'Mẹo offset cho phép dùng một lời gọi NMS cho mọi class, nhanh hơn lặp qua từng class.'),

  q.multi('27', 1, 'Ba vấn đề chính của NMS là gì? (chọn nhiều)',
    ['Cảnh đông: hai người đứng sát có IoU > ngưỡng nên một người bị xoá', 'Latency không ổn định: tệ nhất O(N²), chạy tuần tự, NPU hỗ trợ kém', 'Không end-to-end: heuristic không khả vi, model không được dạy "mỗi object một box"'],
    ['NMS làm giảm độ phân giải feature map', 'NMS bắt buộc phải dùng anchor'],
    'Soft-NMS giảm score thay vì xoá, đỡ cảnh đông nhưng không giải quyết latency. Lời giải triệt để là học one-to-one ngay trong model.'),

  q.single('28', 2, 'CenterNet (Objects as Points) bỏ được NMS nhờ đâu?',
    'Chỉ giữ các đỉnh cục bộ của heatmap tâm (max-pool 3 × 3)',
    ['Ghép Hungarian giữa dự đoán và ground-truth như DETR', 'Mỗi ảnh chỉ dự đoán một object', 'Đặt ngưỡng confidence rất cao'],
    'Mỗi object là một đỉnh trên heatmap tâm (C kênh) + (w, h) + offset. Thêm K offset thành pose, thêm độ sâu thành 3D. CornerNet trước đó dùng heatmap hai góc + embedding để ghép cặp.'),

  q.single('29', 1, 'Khi train DETR, dự đoán nào học class ∅ (không có object)?',
    'Những query không được ghép với GT nào trong ghép Hungarian một–một',
    ['Những query có score thấp nhất sau NMS', 'Query đầu tiên trong mỗi lô', 'Mọi query ở lớp decoder cuối'],
    'Chi phí ghép = −p̂(c) + λ₁‖b − b̂‖₁ + λ₂(1 − GIoU). Vì vậy model tự học không sinh duplicate: không anchor, không NMS. Nhược điểm: hội tụ chậm (500 epoch COCO), yếu với object nhỏ.'),

  q.match('30', 2, 'Ghép mô hình họ DETR với ý tưởng chính.', [
    ['Deformable DETR', 'Attention thưa, đa tỷ lệ: train ít epoch hơn ~10×'],
    ['DINO (2022)', 'Denoising queries, chọn query lai'],
    ['RT-DETR', 'Hybrid encoder hiệu quả, DETR real-time'],
    ['DEIM', 'Dense one-to-one: tăng số positive trong matching 1–1'],
    ['RF-DETR', 'Backbone DINOv2 + NAS theo latency'],
  ], 'Hai động lực: matching dày hơn để hội tụ nhanh, và backbone foundation (DINOv2/v3) để có feature mạnh sẵn.'),

  q.single('31', 2, 'Hai trường phái DETR và YOLO "hội tụ" ở đâu?',
    'Matching một–một: DETR học cách hội tụ nhanh, YOLO học cách bỏ NMS',
    ['Cùng quay lại dùng anchor từ k-means', 'Cùng dùng hai giai đoạn như Faster R-CNN', 'Cùng bỏ backbone CNN để dùng ViT thuần'],
    'YOLOv10 dùng dual assignment; YOLO26 dùng head one-to-one với ProgLoss. Ultralytics công bố CPU nhanh hơn tới 43%.'),

  q.single('32', 1, 'CLIP phân loại zero-shot như thế nào?',
    'Nhúng câu "a photo of a {class}" cho mọi class, chọn câu có embedding gần ảnh nhất',
    ['Fine-tune lớp cuối trên vài ảnh mỗi class', 'Dùng detector để đếm object rồi suy ra class', 'Tra nhãn trong cơ sở dữ liệu ImageNet'],
    'CLIP học tương phản (InfoNCE) trên ~400 triệu cặp ảnh – alt-text: kéo cặp đúng lại gần, đẩy cặp sai ra xa. Prompt + ensembling thêm ~5% trên ImageNet.'),

  q.single('33', 2, 'Trên ObjectNet (cùng class, góc nhìn lạ), CLIP zero-shot so với ResNet-101 (ImageNet) thế nào?',
    'CLIP 72,3% so với 32,6%, dù cả hai cùng 76,2% trên ImageNet',
    ['Cả hai cùng khoảng 76%', 'ResNet-101 hơn CLIP khoảng 40 điểm', 'CLIP chỉ hơn khoảng 1 điểm'],
    'Học từ dữ liệu internet đa dạng giúp CLIP bền hơn với dịch chuyển phân phối. Điểm yếu: cấu trúc câu ("cốc trên cỏ" vs "cỏ trong cốc") và caption cả ảnh thiếu vị trí.'),

  q.single('34', 2, 'Khi nào detector chuyên biệt fine-tune thường thắng open-vocabulary zero-shot?',
    'Class cố định, latency chặt trên edge, domain hẹp',
    ['Class thay đổi liên tục, long-tail', 'Cần bootstrap nhãn cho dữ liệu mới', 'Cần tìm kiếm ảnh bằng câu chữ'],
    'Open-vocabulary (Grounding DINO, OWLv2, YOLO-World, YOLOE, SAM 3) hợp với bootstrap nhãn, class đổi liên tục, long-tail. Grounding DINO/OWLv2 nặng, hợp chạy server.'),

  q.tf('35', 2, 'VLM như LLaVA, Qwen3-VL đã thay được detector chuyên biệt khi cần mAP cao và latency vài ms trên edge.', false,
    'Sai. VLM dùng tốt cho hỏi đáp mở, kiểm tra lại nhãn, sinh mô tả cho auto-labeling, nhưng chưa thay được detector khi cần box chính xác từng pixel và latency vài ms.'),

  q.order('36', 1, 'Sắp xếp quy tắc ghép dự đoán với GT khi đánh giá (mỗi class).', [
    'Sắp xếp mọi dự đoán theo confidence giảm dần',
    'Mỗi dự đoán ghép với GT cùng class, chưa bị ghép, IoU cao nhất',
    'IoU ≥ τ → TP; ngược lại (hoặc GT đã bị ghép) → FP',
    'GT không được ghép → FN',
  ], 'Precision = TP/(TP + FP), Recall = TP/#GT. Mỗi duplicate mà NMS bỏ sót là một FP, nên hậu xử lý ảnh hưởng trực tiếp mAP.'),

  q.single('37', 2, 'COCO tính AP từ đường precision–recall thế nào?',
    'Lấy envelope p(r) = max_{r′ ≥ r} p(r′), rồi lấy mẫu 101 mức recall 0; 0,01; …; 1 và lấy trung bình',
    ['Lấy precision tại ngưỡng confidence 0,5', 'Lấy diện tích dưới đường ROC', 'Lấy trung bình precision của 10 dự đoán đầu tiên'],
    'Recall không đạt tới (ví dụ chỉ tới 0.7) thì phần còn lại tính precision 0. Ví dụ slide: 10 GT, 15 dự đoán → AP = 0.535.'),

  q.single('38', 1, 'mAP@[.5:.95] của COCO là gì?',
    'Trung bình AP trên 10 ngưỡng IoU 0.50, 0.55, …, 0.95 và trên mọi class',
    ['AP tại một ngưỡng IoU duy nhất 0.5', 'AP trung bình của 50 đến 95 ảnh đầu tiên', 'Độ chính xác phân loại trung bình trên 95% dữ liệu'],
    'AP50 là định vị "lỏng" (gần chuẩn VOC), AP75 định vị chặt. APS/APM/APL theo diện tích < 32², 32²–96², > 96² pixel; AR@100 là recall tối đa 100 dự đoán mỗi ảnh.'),

  q.single('39', 2, 'Box A = (0, 0, 4, 4) và B = (2, 2, 6, 6) dạng xyxy. IoU(A, B) bằng bao nhiêu?',
    '≈ 0,14',
    ['0,50', '0,25', '≈ 0,33'],
    'Giao là hình vuông 2 × 2 = 4. Hợp = 16 + 16 − 4 = 28. IoU = 4/28 ≈ 0,143.'),

  q.single('40', 2, 'Model A có AP50 cao hơn model B nhưng mAP@[.5:.95] thấp hơn. Điều này nói gì?',
    'A tìm được object nhưng box kém chính xác hơn B',
    ['A tìm được ít object hơn B', 'A có nhiều duplicate hơn B', 'Hai model như nhau, chênh lệch do nhiễu'],
    'AP50 chỉ đòi chồng lấn 50%. mAP@[.5:.95] gồm cả các ngưỡng chặt 0.75–0.95, nên phạt box lệch.'),

  q.multi('41', 2, 'Những bẫy nào khi đọc mAP? (chọn nhiều)',
    ['mAP tính ở conf ≈ 0.001 trong khi sản phẩm chạy ở 0.25–0.5', 'Trung bình theo class che mất AP thấp của class hiếm', 'mAP không đo latency, sai số đếm hay độ hiệu chỉnh score', 'Tập val không phủ phân phối triển khai thì metric vẫn "đẹp"'],
    ['mAP luôn bằng precision tại ngưỡng deploy', 'mAP phạt lỗi phân loại nặng gấp đôi lỗi định vị'],
    'Báo cáo thêm P/R/F1 ở ngưỡng deploy, AP từng class, confusion matrix. TIDE tách lỗi thành classification, localization, duplicate, background, missed.'),

  q.match('42', 2, 'Ghép mô hình segmentation ngữ nghĩa với ý tưởng.', [
    ['FCN (2015)', 'Thay lớp fully-connected bằng conv để output dày đặc'],
    ['U-Net (2015)', 'Encoder–decoder với skip nối (concat) giữ chi tiết biên'],
    ['DeepLab', 'Atrous conv + ASPP: nhìn rộng mà không giảm độ phân giải'],
    ['SegFormer (2021)', 'Transformer encoder + decoder MLP nhẹ'],
  ], 'U-Net là chuẩn mực cho ảnh y tế ít dữ liệu, train được với rất ít ảnh nhờ elastic deformation.'),

  q.single('43', 2, 'Transposed conv 1D, stride 2, input [a, b], filter [x, y, z]. Phần tử thứ 3 của output là gì?',
    'az + bx',
    ['az', 'bx', 'ay + by'],
    'Output = [ax, ay, az + bx, by, bz]: input dịch 1 thì output dịch 2, chỗ chồng lấn cộng dồn. Chồng lấn không đều dễ sinh "artifact bàn cờ".'),

  q.match('44', 3, 'Ghép cách upsampling với mô tả.', [
    ['Nearest neighbor', 'Lặp mỗi giá trị thành khối 2 × 2, không tham số'],
    ['Bed of nails', 'Đặt giá trị ở một góc, các ô còn lại bằng 0'],
    ['Max unpooling', 'Nhớ vị trí max lúc pooling, trả giá trị về đúng chỗ'],
    ['Transposed conv', 'Học được; còn gọi up-convolution'],
  ], 'Mạng giảm độ phân giải để có ngữ cảnh rồi phải tăng lại để trả nhãn cho từng pixel.'),

  q.multi('45', 2, 'Bốn lời giải cho "bài toán độ phân giải" trong segmentation là gì? (chọn nhiều)',
    ['Image pyramid: nhiều tỷ lệ', 'Skip connection: ghép feature lớp nông khi upsample', 'Dilated / atrous conv', 'CRF hậu xử lý làm mượt nhãn'],
    ['Tăng stride của mọi lớp', 'Bỏ hết lớp pooling và dùng ảnh nhỏ hơn'],
    'Lớp nông chi tiết nhưng ít ngữ nghĩa, lớp sâu ngữ nghĩa nhưng thô. Tiến trình trên VOC (xấp xỉ): FCN ≈ 54 → +skip ≈ 56 → +dilation ≈ 58 → +CRF ≈ 62 mIoU.'),

  q.single('46', 1, 'Conv 3 × 3 với dilation rate r = 4: vùng nhìn và số trọng số mỗi kênh là bao nhiêu?',
    '9 × 9 và 9 trọng số',
    ['3 × 3 và 9 trọng số', '9 × 9 và 81 trọng số', '12 × 12 và 9 trọng số'],
    'Vùng nhìn = k + (k − 1)(r − 1) = 3 + 2·3 = 9. Số tham số không đổi vì chỉ chèn r − 1 lỗ giữa các phần tử kernel.'),

  q.single('47', 2, 'ASPP trong DeepLabv3 làm gì?',
    'Chạy song song conv 1 × 1, ba conv atrous 3 × 3 (r = 6, 12, 18 ở output stride 16) và pooling toàn ảnh, rồi nối lại',
    ['Pool feature về lưới 1×1, 2×2, 3×3, 6×6 rồi nối', 'Dùng attention toàn ảnh thay cho tích chập', 'Upsample bằng transposed conv nhiều tầng'],
    'Pooling 1/2/3/6 là PSPNet. DeepLabv3+ thêm decoder nhẹ làm sắc biên (89.0% mIoU VOC 2012).'),

  q.single('48', 2, 'Dice loss = 1 − 2|P ∩ G| / (|P| + |G|) hữu ích khi nào?',
    'Foreground rất nhỏ so với ảnh; thường dùng kèm cross-entropy (CE + Dice)',
    ['Khi mọi class có số pixel bằng nhau', 'Khi cần phân loại cả ảnh', 'Khi output là bounding box'],
    'Pixel accuracy và CE thuần dễ bị class nền lấn át. Dice tính trên tỉ lệ chồng lấn nên ổn định với vùng nhỏ.'),

  q.tf('49', 2, 'mIoU chuẩn bằng trung bình IoU của từng ảnh.', false,
    'Sai. mIoU chuẩn cộng dồn TP/FP/FN trên toàn dataset rồi mới chia (IoU_c = TP/(TP + FP + FN)), sau đó lấy trung bình theo class. Hai cách có thể cho số khác nhau đáng kể.'),

  q.single('50', 1, 'Với chiến lược "detect rồi mới segment" (Mask R-CNN, YOLO26 → SAM), chất lượng mask bị giới hạn bởi gì?',
    'Bị chặn trên bởi detector: object bị detector bỏ sót thì không có mask',
    ['Bị chặn bởi số class trong dataset', 'Bị chặn bởi kích thước prototype', 'Không bị giới hạn vì mask tách khỏi box'],
    'Chiến lược còn lại là "segment rồi phân lớp" (Selective Search, MCG đề xuất vùng), mask không phụ thuộc class nhưng bị giới hạn bởi bước đề xuất thủ công.'),

  q.single('51', 2, 'Nhánh mask của Mask R-CNN có đặc điểm gì?',
    'FCN nhỏ ra C × 28 × 28, mask theo class dùng sigmoid, tách "là gì" khỏi "hình dạng"',
    ['Một mask softmax dùng chung cho mọi class', 'Mask kích thước bằng ảnh gốc cho mỗi RoI', 'Mask sinh từ 32 prototype dùng chung'],
    'Giới hạn: 28 × 28 kéo giãn cho object lớn nên biên thô; chi phí tăng theo số RoI. torchvision v2: 47.4 box AP / 41.8 mask AP.'),

  q.single('52', 2, 'YOLO-Seg tạo mask thế nào và vì sao nhanh?',
    'Ghép 32 prototype dùng chung với 32 hệ số mỗi detection: mask_i = σ(P·c_i), chi phí gần như không đổi theo số object',
    ['Chạy một FCN riêng cho từng box', 'Dùng SAM cho mỗi box phát hiện được', 'Phân lớp từng pixel rồi gom nhóm bằng NMS'],
    'Ý tưởng từ YOLACT (2019). Prototype có độ phân giải 1/4 ảnh vào; mask được crop theo box rồi upsample.'),

  q.single('53', 1, 'Một model panoptic có SQ = 0,8 và RQ = 0,5. PQ bằng bao nhiêu và nên cải thiện phần nào trước?',
    '0,40 — nhận diện segment (bỏ sót, nhận nhầm)',
    ['0,65 — biên mask', '1,30 — không cần cải thiện', '0,40 — biên mask'],
    'PQ = SQ × RQ. SQ (kiểu IoU trung bình của cặp TP) đã cao; RQ (kiểu F1) thấp nghĩa là bỏ sót hoặc nhận nhầm segment nhiều.'),

  q.match('54', 2, 'Ghép loại vùng trong panoptic với cách gán nhãn.', [
    ['Things (người, xe)', 'Hình dạng xác định, đếm được: có id riêng'],
    ['Stuff (đường, cỏ, trời)', 'Vùng vô định hình: chỉ có class'],
  ], 'Cặp dự đoán–GT khớp khi IoU > 0.5, luôn duy nhất vì segment không chồng nhau. Mask2Former dùng một kiến trúc (N query → class + mask, ghép Hungarian) cho cả semantic, instance và panoptic.'),

  q.match('55', 1, 'Ghép phiên bản SAM với điểm mới.', [
    ['SAM (04/2023)', 'Encoder ViT nặng chạy 1 lần + decoder nhẹ ~50 ms; prompt mơ hồ → 3 mask'],
    ['SAM 2 (07/2024)', 'Thêm memory để theo dõi mask qua video'],
    ['SAM 3 (11/2025)', 'Cụm danh từ hoặc ảnh mẫu → mask mọi instance khớp khái niệm'],
  ], 'SA-1B có 11M ảnh, 1.1B mask. SAM 3 ~840M tham số, weights gated trên Hugging Face.'),

  q.single('56', 2, 'Pattern gán nhãn segmentation hay gặp nhất được bài giảng khuyến nghị là gì?',
    'Dùng SAM để tạo nhãn, rồi train YOLO26-seg để triển khai',
    ['Dùng SAM trực tiếp trên thiết bị edge', 'Gán tay toàn bộ polygon rồi train SAM', 'Chỉ dùng semantic segmentation cho mọi bài toán'],
    'Model lớn dạy model nhỏ: một polygon mask COCO tốn ~80 s (> 22 giờ / 1 000 mask), một box extreme clicking ~7 s, box truyền thống ~35 s.'),

  q.single('57', 1, 'Trong nhãn keypoint (x, y, v), v = 1 nghĩa là gì?',
    'Có nhãn nhưng bị che',
    ['Không được gán nhãn', 'Nhìn thấy rõ', 'Keypoint nằm ngoài ảnh'],
    'v = 0 không gán nhãn, v = 1 có nhãn nhưng bị che, v = 2 nhìn thấy. Schema: COCO body 17, WholeBody 133, bàn tay 21, tiger-pose 12.'),

  q.tf('58', 2, 'Đổi thứ tự keypoint trong dữ liệu mà không sửa code hậu xử lý sẽ làm chương trình báo lỗi ngay.', false,
    'Sai. Thứ tự keypoint là hợp đồng giữa dữ liệu, model và code hậu xử lý; đổi thứ tự là bug âm thầm, không báo lỗi.'),

  q.single('59', 2, 'Vì sao heatmap thắng hồi quy toạ độ trực tiếp trong pose (2014–2020)?',
    'Output có thể đa đỉnh; hồi quy L2 lấy trung bình hai giả thuyết thành một điểm sai ở giữa',
    ['Heatmap tốn ít bộ nhớ hơn hồi quy', 'Heatmap không có lỗi lượng tử theo stride', 'Hồi quy không train được bằng gradient'],
    'Heatmap chính xác nhưng tốn bộ nhớ và có lỗi lượng tử. RLE (YOLO26-pose) quay lại hồi quy nhưng học cả phân phối sai số bằng normalizing flow.'),

  q.match('60', 2, 'Ghép cách biểu diễn output keypoint với mô tả.', [
    ['Hồi quy', 'Trực tiếp (x, y) từ feature'],
    ['Heatmap', 'Gaussian quanh keypoint, lấy argmax (HRNet, ViTPose)'],
    ['SimCC', 'Phân lớp 1D theo x và theo y, bin nhỏ hơn pixel (RTMPose)'],
    ['RLE', 'Hồi quy + học phân phối sai số (YOLO26-pose)'],
  ], 'Mỗi cách đánh đổi giữa tốc độ, bộ nhớ và độ chính xác định vị.'),

  q.single('61', 2, 'Input 256 × 192 → heatmap 64 × 48, giải mã bằng argmax (lấy tâm ô). Sai số lượng tử tối đa trên mỗi trục, tính theo pixel input?',
    '2 px',
    ['0,5 px', '1 px', '4 px'],
    'Mỗi ô heatmap ứng với 4 pixel input (stride 4). Lấy tâm ô thì sai lệch tối đa nửa ô = 2 px. Giải mã thường dịch thêm 1/4 ô về phía lân cận lớn hơn để giảm sai số này.'),

  q.single('62', 1, 'Ảnh có 50 người. Kiến trúc pose nào có thời gian suy luận tăng gần tuyến tính theo số người?',
    'Top-down (detect người → pose từng crop)',
    ['Bottom-up (OpenPose, PAF)', 'One-stage (YOLO26-pose)', 'Cả ba như nhau'],
    'Top-down chạy pose cho từng crop nên tăng tuyến tính; bottom-up và one-stage gần như cố định. Độ chính xác benchmark cao nhất vẫn thuộc top-down backbone lớn (ViTPose ~81 AP).'),

  q.single('63', 2, 'OpenPose ghép keypoint thành từng người bằng cách nào?',
    'Lấy tích phân trường vector PAF dọc đoạn nối hai ứng viên, chiếu lên hướng đoạn nối để chấm điểm cặp',
    ['Chạy detector người trước rồi crop từng người', 'Ghép theo khoảng cách Euclid gần nhất', 'Dùng Hungarian giữa keypoint và box người'],
    'PAF là vector đơn vị dọc theo chi; cặp sai có tích phân ≈ 0 nên không nối. Chi phí gần như không đổi theo số người, nhưng yếu ở cảnh đông, chi bị che.'),

  q.single('64', 2, 'HRNet khác SimpleBaseline ở điểm nào?',
    'Giữ nhánh độ phân giải 1/4 suốt mạng, thêm dần nhánh thấp hơn và trao đổi thông tin lặp lại',
    ['Giảm 32 lần rồi dùng 3 lớp deconv tăng lại', 'Bỏ heatmap, hồi quy toạ độ trực tiếp', 'Dùng PAF để ghép người'],
    'SimpleBaseline: ResNet giảm 32 lần → 3 deconv tăng 8 lần → heatmap 1/4; đã đạt 73.7 AP. HRNet-W48 đạt 75.5 AP test-dev và thành backbone của nhiều model sau.'),

  q.single('65', 1, 'Cùng một người, dự đoán lệch 8 pixel ở mắt và ở hông. Keypoint nào bị OKS phạt nặng hơn?',
    'Mắt',
    ['Hông', 'Như nhau vì cùng 8 pixel', 'Tuỳ diện tích người'],
    'OKS = Σ exp(−dᵢ²/(2s²kᵢ²))…, kᵢ = 2σᵢ. σ mắt = 0.025 nhỏ hơn hông 0.107 (người gán nhãn đặt mắt chính xác hơn), nên cùng sai số thì mắt bị phạt nặng hơn. Người nhỏ (s nhỏ) cũng bị phạt nặng hơn.'),

  q.single('66', 2, 'PCK khác OKS-AP ở điểm nào?',
    'PCK giả sử đã biết vị trí người và chỉ đếm % keypoint đúng; OKS-AP phạt cả detection lẫn định vị',
    ['PCK phạt cả người bị bỏ sót, OKS-AP thì không', 'PCK dùng IoU của box, OKS-AP dùng IoU của mask', 'Hai metric giống hệt nhau'],
    'PCK: đúng nếu d/h < α (PCKh dùng độ dài đầu). OKS-AP ghép theo OKS, quét ngưỡng 0.50–0.95 như detection, sát hệ thống thật hơn.'),

  q.single('67', 1, 'Bẫy flip_idx trong tiger-pose là gì?',
    'Lật gương mà không hoán đổi left ↔ right làm nhãn sai, và tập val toàn hổ quay phải nên không lộ ra lỗi',
    ['Lật gương làm ảnh mất màu', 'flip_idx làm số keypoint tăng gấp đôi', 'Tập val có quá nhiều hổ quay trái'],
    '263/263 con hổ quay phải. Augmentation phải hiểu nhãn; tập val phải phủ phân phối triển khai, nên cần đo thêm trên val lật gương.'),

  q.match('68', 2, 'Năm câu hỏi trước khi chọn model: ghép câu hỏi với gợi ý.', [
    ['Output cần gì?', 'Vị trí → detect; hình dạng → seg; tư thế → pose'],
    ['Class cố định hay mở?', 'Cố định → fine-tune YOLO26 / RF-DETR; mở → YOLOE, SAM 3'],
    ['Latency và phần cứng?', 'Edge → YOLO26 n/s NMS-free; GPU server → họ DETR'],
    ['Có bao nhiêu nhãn?', 'Ít → foundation model + auto-label; nhiều → model chuyên biệt'],
  ], 'Câu thứ năm: đánh giá thế nào — metric khớp mục tiêu sản phẩm và tập val phủ phân phối triển khai. Bắt đầu bằng baseline nhỏ nhất chạy end-to-end trên phần cứng đích.'),

  q.multi('69', 2, 'Những cách nào giúp phát hiện object nhỏ trong ảnh độ phân giải cao? (chọn nhiều)',
    ['Tăng imgsz (640 → 1280, chi phí ~4×)', 'Thêm head P2 (stride 4)', 'Tiling kiểu SAHI rồi gộp bằng NMS/WBF', 'Kiểm tra stride/anchor khớp phân bố kích thước object'],
    ['Thu nhỏ ảnh 4K về 320 px để chạy nhanh hơn', 'Tăng ngưỡng IoU của NMS lên 0.95'],
    'Camera 4K thu về 640 px làm object 30 px còn ~5 px. Kiểm tra histogram kích thước box và mức thu nhỏ của pipeline trước.'),

  q.single('70', 2, 'Khi triển khai, nên đo latency thế nào?',
    'Trên phần cứng đích, batch = 1, video thật: p50 và p95 end-to-end gồm tiền và hậu xử lý',
    ['Chỉ đo thời gian forward trung bình trên GPU máy chủ', 'Đo với batch lớn nhất có thể để có thông lượng cao', 'Chỉ đo lần chạy đầu tiên'],
    'Pipeline gồm pre-process, inference, post-process (NMS, giải mã mask/keypoint) và logic. NMS-free cho graph tĩnh, latency ổn định, dễ chạy trên NPU.'),

  q.single('71', 2, 'Grad-CAM khác CAM ở điểm nào?',
    'Trọng số là gradient trung bình theo kênh nên dùng được cho mọi lớp, mọi CNN; CAM cần global pooling + FC',
    ['Grad-CAM chỉ dùng được cho transformer', 'Grad-CAM không cần gradient', 'Grad-CAM cho bounding box thay vì bản đồ nhiệt'],
    'Dùng trong phân tích lỗi: model nhìn vào object hay dựa vào ngữ cảnh ("mũ bảo hộ" vì có công trường)? Lỗi kiểu này không hiện trên mAP nếu tập val có cùng thiên lệch.'),

  q.order('72', 2, 'Sắp xếp vòng lặp phân tích lỗi.', [
    'Metric tổng: mAP, P / R tại ngưỡng deploy',
    'Theo lát cắt: AP từng class, kích thước, camera',
    'Loại lỗi: TIDE (cls, loc, dupe, bkg, miss)',
    'Xem bằng mắt 50 ảnh tệ nhất',
    'Sửa dữ liệu, quy ước, rồi mới sửa model',
  ], 'Nguồn lỗi hay gặp: domain shift, nhãn không nhất quán, mất cân bằng class, che khuất, object nhỏ bị thu nhỏ quá mức, ngưỡng score trôi.'),

  q.single('73', 1, 'mAP val là 0.62 nhưng camera thật bỏ sót nhiều người vào ban đêm. Việc nên làm đầu tiên là gì?',
    'Thêm ảnh ban đêm vào tập val để đo đúng lỗi, rồi mới thu dữ liệu train',
    ['Đổi sang model lớn hơn', 'Train thêm nhiều epoch', 'Hạ ngưỡng IoU của NMS'],
    'Tập val không phủ phân phối triển khai thì metric vẫn "đẹp". Metric và tập val là quyết định thiết kế: chúng quyết định bạn thấy lỗi nào.'),
]
