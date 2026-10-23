import { maker } from './make'

const q = maker(22)

// Day 22 · Tracking
export const day22 = [
  q.single('01', 1, 'Tracking trả lời thêm câu hỏi gì mà detection không trả lời?',
    'Là ai và đang đi đâu: có ID ổn định nên có lịch sử, vận tốc, hướng đi',
    ['Có gì và ở đâu trong một khung hình', 'Vật thuộc lớp nào với xác suất bao nhiêu', 'Ảnh có bao nhiêu điểm ảnh sáng'],
    'Detector có "trí nhớ cá vàng": mỗi frame là một bài toán mới. Không có ID thì không có lịch sử và không ước lượng được vận tốc từ một frame.'),

  q.single('02', 1, 'Trong vụ tai nạn xe thử nghiệm Uber ATG năm 2018 (báo cáo NTSB), lỗi mấu chốt liên quan tracking là gì?',
    'Mỗi lần nhãn phân loại đổi, phần mềm coi đó là vật thể mới và xoá lịch sử vị trí, vận tốc',
    ['Radar và LiDAR không phát hiện được vật thể', 'Camera bị mù hoàn toàn vì trời tối', 'Xe đi quá tốc độ giới hạn của đoạn đường'],
    'Vật thể được phát hiện từ ~5,2 s trước va chạm nhưng nhãn đổi liên tục (Other, Vehicle, Bicycle, Unknown…). Giữ một ID liên tục bất kể nhãn dao động là lý do cốt lõi để tracking tồn tại.'),

  q.order('03', 2, 'Sắp xếp pipeline xe tự lái mà tracking là cầu nối.', [
    'Sensors',
    'Detection',
    'Tracking',
    'Prediction',
    'Planning',
  ], 'Planning cần biết vật đang đi về đâu, nhưng detector chỉ nói vật đang ở đây. Tracker cho ID ổn định, vận tốc, hướng, lịch sử quỹ đạo, tuổi track.'),

  q.match('04', 2, 'Ghép trục phân loại bài toán tracking với các lựa chọn.', [
    ['Số đối tượng', 'SOT (bám một vật cho trước) · MOT (bám mọi vật thuộc class quan tâm)'],
    ['Cách chạy', 'Online (chỉ dùng quá khứ) · Offline (được nhìn cả tương lai)'],
    ['Kiến trúc', 'Tracking-by-detection · Joint detection+tracking · Query-based'],
    ['Số camera', 'Một camera · Nhiều camera (cross-camera Re-ID)'],
  ], 'Bài học tập trung vào MOT · online · tracking-by-detection · 2D box; phần còn lại là biến thể.'),

  q.order('05', 1, 'Sắp xếp bốn bước của vòng lặp tracking-by-detection ở mỗi frame.', [
    'Detect: detector trả box + class + score',
    'Predict: mỗi track cũ dự đoán vị trí ở frame t (Kalman)',
    'Associate: ghép track dự đoán với detection bằng cost matrix + Hungarian',
    'Update: cập nhật track đã ghép, tạo track mới, xoá track mất quá lâu',
  ], 'Gần như mọi tracker 2D phổ biến đều là biến tấu của vòng lặp này. Chương Association là nơi các thuật toán khác nhau nhất.'),

  q.tf('06', 1, 'Chất lượng của tracker tracking-by-detection bị chặn trên bởi chất lượng detector.', true,
    'Đúng. Tracker chỉ ghép những gì detector đưa ra; vật detector bỏ sót thì tracker chỉ còn dự đoán.'),

  q.single('07', 2, 'Một frame có 3 track cũ và 4 detection mới, ghép được 3 cặp. Detection thừa được xử lý thế nào?',
    'Tạo track mới ở trạng thái tentative, chờ vài frame xác nhận',
    ['Bỏ đi vì không khớp track nào', 'Gán vào track có IoU cao nhất dù đã ghép', 'Tạo ngay track confirmed'],
    'Track mới chưa chắc là vật thật (có thể là nhiễu), nên phải xuất hiện đủ min_hits frame mới được xác nhận.'),

  q.single('08', 1, 'Điểm yếu của giả định vận tốc không đổi trong Kalman khi vật bị che là gì?',
    'Kalman đi thẳng theo vận tốc cũ trong khi vật thật có thể cua, nên dự đoán sai khi vật xuất hiện lại',
    ['Kalman dừng hẳn khi không có detection', 'Kalman tăng tốc vật lên gấp đôi', 'Kalman đổi ID của vật sau mỗi frame'],
    'Khi bị che chỉ có bước predict, độ bất định tăng. OC-SORT được thiết kế để vá đúng điểm yếu này.'),

  q.order('09', 1, 'Sắp xếp vòng đời của một track.', [
    'Tentative',
    'Confirmed (đủ min_hits)',
    'Lost (mất detection)',
    'Removed (quá track_buffer frame)',
  ], 'Track ở trạng thái Lost mà được ghép lại thì quay về Confirmed với cùng ID.'),

  q.single('10', 2, 'Vật bị che 18 frame, track_buffer = 30. Khi vật xuất hiện lại thì sao?',
    'Track vẫn ở trạng thái Lost nên vật được ghép lại với cùng ID cũ',
    ['Track đã bị xoá nên vật nhận ID mới', 'Track bị chia thành hai track', 'Tracker dừng cho tới khi reset'],
    '18 ≤ 30 nên track chưa bị xoá. Nếu vật bị che lâu hơn track_buffer thì nhận ID mới; khi đó cần Re-ID hoặc nối tracklet offline.'),

  q.single('11', 2, 'Trong cost matrix IoU, Hungarian chọn cặp T3–D3 với IoU 0,19 nhưng ngưỡng tối thiểu là 0,20. Kết quả?',
    'Cặp bị loại: T3 chuyển sang Lost và D3 thành track mới',
    ['Cặp vẫn được giữ vì Hungarian đã chọn', 'T3 bị xoá ngay lập tức', 'D3 bị bỏ đi và T3 giữ nguyên'],
    'Hungarian tìm ghép tối ưu tổng thể, sau đó cặp nào dưới ngưỡng IoU vẫn bị loại. Track không có detection → Lost; detection thừa → track mới.'),

  q.match('12', 1, 'Ghép tín hiệu đo "giống nhau" với tracker đã đưa nó vào.', [
    ['Hình học — IoU', 'SORT (2016)'],
    ['Chuyển động — Mahalanobis trên dự đoán Kalman', 'DeepSORT (2017)'],
    ['Ngoại hình — Re-ID embedding', 'DeepSORT (2017) → OSNet…'],
    ['Hình học mở rộng — GIoU / DIoU / CIoU', 'Chủ yếu làm loss cho detector (2019–2020)'],
  ], 'Cost cuối cùng thường là tổng có trọng số của vài thước đo, không nhất thiết chỉ chọn một.'),

  q.fill('13', 2, 'Box A chiếm 12 ô, box B chiếm 12 ô, phần giao 4 ô. IoU bằng bao nhiêu?', ['0,2', '0.2', '0,20'],
    'IoU = 4 / (12 + 12 − 4) = 4/20 = 0,20. SORT dùng cost = 1 − IoU cho Hungarian.'),

  q.single('14', 1, 'Vì sao IoU thất bại với vật chạy nhanh hoặc khi fps thấp?',
    'Dịch chuyển giữa hai frame xa hơn bề rộng box, hai box không còn chạm nhau nên IoU = 0 dù là cùng một vật',
    ['IoU tăng quá 1 khi vật chạy nhanh', 'IoU chỉ tính được với box vuông', 'IoU cần ảnh màu, fps thấp thì mất màu'],
    'IoU = 0 nói "không liên quan" dù thực ra là một người. Cách xử lý: cost theo khoảng cách tâm, tăng fps, hoặc thêm motion/appearance.'),

  q.single('15', 2, 'Khoảng cách Mahalanobis tốt hơn khoảng cách thường trong gating vì sao?',
    'Nó chuẩn hoá theo độ bất định Σ của dự đoán Kalman: hướng nào tự tin thì vùng chấp nhận hẹp, hướng nào không chắc thì rộng',
    ['Nó luôn nhỏ hơn khoảng cách Euclid', 'Nó không cần dự đoán Kalman', 'Nó bỏ qua hướng chuyển động của vật'],
    'd² = (x − μ)ᵀΣ⁻¹(x − μ). Vùng chấp nhận là elip thay vì vòng tròn, nên loại đúng detection nằm lệch theo hướng đang chắc chắn.'),

  q.fill('16', 3, 'DeepSORT gating: ngưỡng chi-square 95% với 4 bậc tự do xấp xỉ bao nhiêu?', ['9,4877', '9.4877', '9,49', '9.49'],
    'Cặp có d² > 9,4877 bị loại trước Hungarian. Giảm ghép nhầm và tính toán thừa, nhưng phụ thuộc giả định vận tốc không đổi.'),

  q.single('17', 2, 'Re-ID embedding đo độ giống ngoại hình bằng gì và yếu ở đâu?',
    'Cosine giữa hai vector; tốn compute (chạy thêm CNN mỗi box) và vô dụng khi hai vật mặc đồng phục giống hệt',
    ['Khoảng cách Euclid giữa hai box; yếu khi vật đứng yên', 'IoU giữa hai mask; yếu khi vật nhỏ', 'Hiệu số độ sáng trung bình; yếu ban đêm'],
    'cos(θ) = u·v / (‖u‖‖v‖). Re-ID mạnh khi vật biến mất rồi quay lại, hoặc đổi camera.'),

  q.single('18', 1, 'Vì sao dùng Hungarian thay vì ghép tham lam (chọn cặp cost thấp nhất trước)?',
    'Hungarian tìm cách ghép có tổng cost nhỏ nhất toàn cục; tham lam có thể chọn cặp đầu "ngon" rồi kéo theo cặp cuối rất tệ',
    ['Tham lam không chạy được với cost thực', 'Hungarian luôn nhanh hơn tham lam', 'Hungarian không cần cost matrix'],
    'Kuhn–Munkres có độ phức tạp O(n³), với vài chục đối tượng mỗi frame vẫn rất nhanh. Trong code: scipy.optimize.linear_sum_assignment hoặc lap.'),

  q.match('19', 2, 'Ghép backbone Re-ID với đặc điểm.', [
    ['BoT baseline', 'ResNet-50 + loạt mẹo huấn luyện, ~24M tham số, cần GPU, chính xác cao'],
    ['OSNet', 'Nhiều nhánh đa tỷ lệ, ~2,2M tham số, chạy ổn trên CPU, mặc định trong Ultralytics'],
    ['FastReID', 'Thư viện PyTorch đóng gói nhiều backbone, có weight pretrained'],
  ], 'Re-ID không phải một thuật toán duy nhất; FastReID không phải kiến trúc mới mà là bộ công cụ.'),

  q.order('20', 3, 'Sắp xếp các tracker theo năm ra đời.', [
    'SORT',
    'DeepSORT',
    'ByteTrack',
    'OC-SORT',
    'SAM 2',
  ], 'SORT 2016, DeepSORT 2017, ByteTrack 2021, OC-SORT và BoT-SORT 2022, SAM 2 2024. Xu hướng: ghép thủ công → học end-to-end → mô hình nền tảng.'),

  q.order('21', 2, 'Sắp xếp pipeline của SORT.', [
    'Detection',
    'Kalman predict',
    'Cost = 1 − IoU',
    'Hungarian',
    'Update track',
  ], 'Cực nhẹ, hàng trăm FPS, chi phí chính nằm ở detector. Hiểu SORT là hiểu 80% phần còn lại.'),

  q.single('22', 2, 'SORT phù hợp nhất với ngữ cảnh nào?',
    'Cảnh thưa người, camera tĩnh, ưu tiên tốc độ (kho vận, đếm xe camera cố định)',
    ['Đám đông bị che khuất dày', 'Camera gắn trên drone bay lượn', 'Nhiều người mặc đồng phục đi cắt nhau'],
    'SORT mất ID ngay khi bị che quá vài frame và dễ hoán đổi ID khi hai người giao nhau sát.'),

  q.single('23', 1, 'DeepSORT thêm gì vào SORT?',
    'Trí nhớ ngoại hình: cost = Mahalanobis + λ·cosine(Re-ID), cùng matching cascade theo tuổi track',
    ['Thêm vòng ghép cho box điểm thấp', 'Bù chuyển động camera bằng optical flow', 'Thay Kalman bằng Transformer'],
    'Paper báo cáo giảm ~45% ID switch so với SORT. Đổi lại chạy thêm mạng Re-ID cho mọi box nên chậm hơn đáng kể.'),

  q.single('24', 2, 'Matching cascade của DeepSORT ưu tiên track nào được ghép trước, và vì sao?',
    'Track vừa mất (tuổi nhỏ) được ghép trước, vì dự đoán Kalman của track mất lâu đã kém tin cậy',
    ['Track mất lâu nhất được ghép trước để cứu nó', 'Track có ID nhỏ nhất được ghép trước', 'Ghép ngẫu nhiên để tránh thiên lệch'],
    'Nếu xét ngang hàng, track mất lâu (bất định lớn) dễ "cướp" detection của track vừa mất. Ý tưởng cần nhớ: SORT = motion + hình học, DeepSORT = thêm ngoại hình.'),

  q.single('25', 1, 'Ý tưởng chính của ByteTrack là gì?',
    'Đừng vứt box điểm thấp: dùng chúng ở vòng ghép thứ hai để cứu track bị che',
    ['Thêm Re-ID mạnh cho mọi box', 'Bù chuyển động camera', 'Dựng quỹ đạo ảo khi vật bị che'],
    'Người đi sau cột vẫn được detector thấy nhưng score tụt dưới τ. ByteTrack không cần Re-ID, chỉ thêm một vòng ghép nên vẫn rất nhanh.'),

  q.order('26', 2, 'Sắp xếp hai vòng ghép của ByteTrack.', [
    'Vòng 1: box điểm cao (≥ τ) ghép với mọi track cũ',
    'Vòng 2: box điểm thấp (< τ) ghép với track còn chưa ghép được',
  ], 'Box điểm thấp có thể là vật bị che, không phải rác. Nhưng chúng chỉ dùng để nuôi track đã có.'),

  q.tf('27', 1, 'Trong ByteTrack, box điểm thấp có thể sinh ra track mới.', false,
    'Sai. Box điểm thấp không bao giờ sinh track mới; chúng chỉ dùng để nuôi track đã có, tránh tạo track từ false positive.'),

  q.single('28', 2, 'OC-SORT vá lỗi Kalman khi vật bị che rồi đổi hướng bằng cách nào?',
    'Khi tìm lại vật, dựng quỹ đạo ảo giữa hai lần quan sát thật gần nhất để cập nhật lại trạng thái, cộng ràng buộc hướng đi',
    ['Thêm mạng Re-ID dự đoán hướng', 'Tăng track_buffer lên vô hạn', 'Bù chuyển động camera bằng ECC'],
    'Không cần Re-ID, nhanh gần bằng SORT. Hợp chuyển động phi tuyến: thể thao, nhảy múa. Nhưng hai vật giống hệt đi gần nhau thì vẫn không cứu được.'),

  q.single('29', 1, 'BoT-SORT giải quyết vấn đề gì của camera di chuyển?',
    'Ước lượng chuyển động camera (GMC bằng ECC/optical flow) rồi trừ vào dự đoán Kalman, để vật tĩnh không bị tưởng là đang di chuyển',
    ['Cứu box điểm thấp khi bị che', 'Dựng quỹ đạo ảo khi vật đổi hướng', 'Nối tracklet offline bằng nội suy Gauss'],
    'Không bù thì cả khung hình trôi kéo theo vị trí của mọi vật. BoT-SORT còn dùng trực tiếp w, h trong state Kalman và Re-ID tuỳ chọn. Có sẵn trong Ultralytics.'),

  q.single('30', 2, 'StrongSORT có đặc điểm gì?',
    'Cộng dồn nhiều bản vá nhỏ lên DeepSORT (EMA feature bank, NSA Kalman, bù chuyển động camera, AFLink/GSI offline)',
    ['Một kiến trúc Transformer end-to-end hoàn toàn mới', 'Bỏ Kalman và chỉ dùng IoU', 'Chỉ chạy được trên CPU'],
    'Độ chính xác cao nhất trong nhóm nhưng nặng hơn hẳn; AFLink/GSI cần offline nên không hợp ứng dụng cần kết quả ngay.'),

  q.tf('31', 2, 'StrongSORT với AFLink/GSI phù hợp cho xe tự lái cần kết quả thời gian thực.', false,
    'Sai. AFLink (Appearance-Free Link) và GSI (Gaussian-Smoothed Interpolation) là hậu xử lý offline. StrongSORT hợp phân tích video theo lô, an ninh đa camera.'),

  q.match('32', 2, 'Ghép hướng "học luôn việc theo dõi" với ví dụ.', [
    ['Joint detection + tracking', 'JDE / FairMOT: một mạng ra cả box lẫn embedding'],
    ['Query-based (Transformer)', 'TrackFormer, MOTR: mỗi vật là một track query sống xuyên frame'],
    ['Mô hình nền tảng', 'SAM 2: chấm điểm hoặc mask ở frame đầu, có memory bám theo'],
  ], 'CenterTrack dự đoán dịch chuyển tâm từ 2 frame; Tracktor dùng regression của detector. Query-based khó train, cần nhiều dữ liệu, chậm hơn.'),

  q.single('33', 2, 'SAM 3 khác SAM 2 trong tracking ở điểm nào?',
    'Nhận concept prompt (chữ hoặc ảnh mẫu) và tự tìm, theo dõi mọi vật khớp khái niệm đó',
    ['Chạy realtime trên xe tự lái', 'Bỏ memory bank để nhanh hơn', 'Chỉ theo dõi được một vật duy nhất'],
    'SAM 2 chỉ theo dõi đúng cái người dùng đã chỉ. Cả hai rất mạnh để tạo nhãn video nhanh nhưng chưa phải tracker nhẹ cho xe chạy realtime.'),

  q.single('34', 1, 'Vì sao tracking-by-detection vẫn là "ngựa thồ" trong sản xuất?',
    'Rẻ, dễ debug, tách được lỗi do detector hay do tracker',
    ['Nó luôn chính xác nhất trên mọi benchmark', 'Nó không cần detector', 'Nó là cách duy nhất chạy được trên GPU'],
    'Transformer và SAM 2/3 là hướng tương lai, nhưng sản phẩm cần khả năng gỡ lỗi từng thành phần.'),

  q.match('35', 1, 'Ghép ứng dụng với tracker hợp lý.', [
    ['Xe tự lái đô thị (camera di chuyển)', 'BoT-SORT (± Re-ID) hoặc tracking 3D trên LiDAR/BEV'],
    ['Bán lẻ, camera cố định, hay bị kệ hàng che', 'ByteTrack'],
    ['Thể thao: đồng phục giống nhau, đổi hướng đột ngột', 'OC-SORT + Re-ID số áo/OCR'],
    ['An ninh đa camera', 'StrongSORT / DeepSORT + Re-ID mạnh'],
    ['Drone follow-me (bám một đối tượng)', 'Tracker SOT riêng (KCF, SiamFC…)'],
  ], 'Không có tracker "tốt nhất", chỉ có tracker hợp với đặc điểm cảnh của bạn. Robot kho ít vật, cần realtime: SORT đơn giản.'),

  q.match('36', 1, 'Ghép loại lỗi tracking với định nghĩa.', [
    ['FN (bỏ sót)', 'Có vật thật nhưng tracker không xuất box'],
    ['FP (box ma)', 'Tracker xuất box ở nơi không có gì'],
    ['ID switch', 'Hai người giao nhau, nhãn bị hoán đổi'],
    ['Fragmentation', 'Một quỹ đạo bị cắt thành nhiều đoạn'],
  ], 'MOTA đếm mỗi ID switch là 1 lỗi như mỗi box bị miss; IDF1 và HOTA phạt việc đổi ID nặng hơn.'),

  q.single('37', 2, 'Trong bộ CLEAR MOT, MOTP đo gì?',
    'Độ khít: trung bình IoU của các cặp ghép đúng, không liên quan việc giữ đúng ID',
    ['Tỷ lệ ID switch trên tổng số track', 'Số frame mỗi giây của tracker', 'Độ đầy đủ: 1 − lỗi / GT'],
    'MOTP trả lời: khi tracker nói vật ở đây, box có khít không. MOTA mới là độ đầy đủ và ổn định.'),

  q.fill('38', 1, 'GT = 1 000 box, FN = 100, FP = 50, IDSW = 30. MOTA bằng bao nhiêu phần trăm?', ['82', '82%', '82,0', '0,82'],
    'MOTA = 1 − (FN + FP + IDSW)/GT = 1 − 180/1 000 = 0,82 = 82%.'),

  q.multi('39', 2, 'Những nhận xét nào đúng về MOTA? (chọn nhiều)',
    ['MOTA có thể âm khi số lỗi vượt số GT', 'MOTA chủ yếu phản ánh chất lượng detector', 'MOTA hầu như không nhạy với việc đổi ID'],
    ['MOTA luôn nằm trong khoảng [0, 1]', 'MOTA phạt mỗi ID switch nặng gấp 10 lần một box bị miss'],
    'Mỗi ID switch chỉ tính một lỗi, và GT thường lớn nên vài chục ID switch gần như không đổi điểm.'),

  q.single('40', 1, 'Một người đi qua 10 frame; tracker gán ID 1 cho 6 frame đầu, ID 2 cho 4 frame sau. IDF1 và MOTA bằng bao nhiêu?',
    'IDF1 = 60%, MOTA = 90%',
    ['IDF1 = 90%, MOTA = 60%', 'Cả hai bằng 100%', 'IDF1 = 100%, MOTA = 90%'],
    'IDF1 ghép toàn cục GT với một ID tốt nhất (ID 1): IDTP = 6, IDFN = 4, IDFP = 4 → 2·6/(12 + 4 + 4) = 60%. MOTA chỉ có 1 IDSW / 10 GT nên 90%.'),

  q.single('41', 1, 'HOTA được tính như thế nào?',
    'HOTA(α) = √(DetA × AssA), rồi lấy trung bình trên các ngưỡng IoU α = 0,05…0,95',
    ['Trung bình cộng của MOTA và IDF1', 'MOTA tính ở ngưỡng IoU 0,5', 'Tỷ lệ frame không có ID switch'],
    'DetA = TP/(TP + FN + FP) đo phát hiện; AssA đo độ khớp ID trung bình. Trung bình hình học nên một nửa tệ kéo cả điểm xuống. HOTA là metric chính của MOT Challenge, tính bằng TrackEval.'),

  q.single('42', 2, 'DetA = 85%, AssA = 45%. HOTA (một ngưỡng) bằng bao nhiêu so với trung bình cộng?',
    'HOTA ≈ 61,8%, thấp hơn trung bình cộng 65,0%',
    ['HOTA = 65,0%, bằng trung bình cộng', 'HOTA = 85%, lấy giá trị lớn hơn', 'HOTA = 38,3%, bằng tích hai số'],
    '√(0,85 × 0,45) ≈ 0,618. Trung bình hình học phạt sự mất cân bằng giữa phát hiện và gán ID.'),

  q.single('43', 1, 'Tracker A (detector rất tốt, ID hay đổi) và B (detector kém hơn, ID rất ổn định). Metric nào chọn A?',
    'MOTA chọn A; IDF1 và HOTA chọn B',
    ['Cả ba metric đều chọn A', 'MOTA chọn B; IDF1 và HOTA chọn A', 'Không metric nào phân biệt được'],
    'Bài toán đếm số vật mỗi frame thì A đủ dùng; bài toán dự đoán quỹ đạo (xe tự lái, phân tích hành vi) cần B.'),

  q.match('44', 2, 'Ghép benchmark với thử thách chính.', [
    ['MOT17 / MOT20', 'Người đi bộ, che khuất dày, đám đông'],
    ['DanceTrack', 'Ngoại hình giống nhau, chuyển động phi tuyến'],
    ['BDD100K MOT', 'Camera gắn xe, nhiều điều kiện thời tiết'],
    ['nuScenes / Waymo', '3D tracking; nuScenes dùng AMOTA'],
  ], 'SportsMOT: cầu thủ chạy nhanh, đồng phục; KITTI tracking: nhỏ, cũ nhưng chuẩn mực cho AV.'),

  q.single('45', 3, 'Định dạng ground truth MOTChallenge (.txt) có các cột đầu là gì?',
    'frame, id, x, y, w, h, conf, …',
    ['id, class, x1, y1, x2, y2', 'x, y, z, l, w, h, yaw', 'frame, class, cx, cy, w, h'],
    'Công cụ đo: TrackEval (HOTA, CLEAR, IDF1) và py-motmetrics.'),

  q.match('46', 1, 'Ghép ca khó với cách gỡ.', [
    ['Che khuất ngắn (1–2 frame, score tụt)', 'Tăng track_buffer; dùng box điểm thấp (ByteTrack)'],
    ['Che khuất dài vượt track_buffer', 'Re-ID; hoặc nối tracklet offline'],
    ['Ngoại hình giống nhau (đồng phục)', 'Tăng trọng số motion (OC-SORT), ràng buộc hướng đi'],
    ['Camera chạy, rung', 'Bù chuyển động camera (BoT-SORT, StrongSORT)'],
    ['Vật nhỏ, xa, fps thấp (IoU = 0)', 'Cost theo khoảng cách tâm; tăng fps; ảnh phân giải cao hơn'],
  ], 'Đám đông: detector mạnh hơn, ảnh phân giải cao hơn, thêm appearance vào cost thay vì chỉ IoU.'),

  q.single('47', 2, 'Vì sao HOTA phải lấy trung bình trên nhiều ngưỡng IoU α thay vì chỉ một?',
    'Để đánh giá cả độ chính xác định vị: một ngưỡng duy nhất có thể quá lỏng hoặc quá chặt',
    ['Để HOTA luôn cao hơn MOTA', 'Vì mỗi α ứng với một class khác nhau', 'Vì TrackEval không tính được ở một ngưỡng'],
    'Tương tự mAP@[.5:.95] trong detection: lấy trung bình qua các ngưỡng thưởng cho tracker vừa tìm đúng vừa đặt box khít.'),

  q.single('48', 1, 'Ground truth tự nó có một lỗi đổi ID. Một tracker đúng 100% so với sự thật sẽ bị chấm thế nào, và bài học là gì?',
    'Bị trừ điểm IDF1 dù không sai; GT sai thì metric nói dối, GT tốt là nền móng',
    ['Vẫn đạt IDF1 100% vì metric tự sửa GT', 'IDF1 tăng lên vì tracker sửa được GT', 'Không ảnh hưởng vì IDF1 không dùng ID'],
    'Metric so với GT chứ không so với sự thật. Kiểm tra chất lượng GT trước khi tin vào bảng xếp hạng.'),

  q.multi('49', 2, 'Năm ý cần nhớ của bài Tracking gồm những gì? (chọn nhiều)',
    ['Tracking = detection + trí nhớ: detect → predict → associate → update', 'Mọi thuật toán khác nhau ở cost matrix chứa gì và khi nào tin cái nào', 'MOTA thiên về detection; IDF1/HOTA nhạy với ID'],
    ['Tracker càng nhiều tham số càng tốt', 'IoU là thước đo duy nhất cần dùng'],
    'Hai ý còn lại: ByteTrack — đừng vứt box điểm thấp; GT tốt là nền móng.'),

  q.single('50', 2, 'Bộ tracker SORT, DeepSORT, ByteTrack, OC-SORT: tracker nào KHÔNG dùng appearance (Re-ID)?',
    'SORT, ByteTrack và OC-SORT',
    ['Chỉ SORT', 'DeepSORT và ByteTrack', 'Cả bốn đều dùng Re-ID'],
    'Chỉ DeepSORT trong nhóm này dùng Re-ID. BoT-SORT có Re-ID tuỳ chọn; FairMOT học embedding chung trong một mạng.'),

  q.tf('51', 2, 'Tracking trên ảnh 2D và tracking 3D trên LiDAR/BEV là hai biến thể trên cùng trục "không gian" của bài toán.', true,
    'Đúng. Trục không gian gồm 2D trên ảnh và 3D trên LiDAR/BEV. Ý tưởng predict → associate → update giống nhau, chỉ đổi biểu diễn.'),

  q.single('52', 3, 'Trên chiếc xe Uber ATG năm 2018, tính năng phanh khẩn cấp ở chế độ tự lái ở trạng thái nào?',
    'Đã bị tắt; trách nhiệm giao cho người lái an toàn, người này không kịp phản ứng',
    ['Bật nhưng hỏng cảm biến', 'Bật và đã phanh nhưng quá muộn 0,1 s', 'Không tồn tại trên xe'],
    'Hệ thống còn giả định "vehicle/bicycle" đi cùng làn và "unknown" đứng yên, đều sai với hướng đi thật của nạn nhân.'),
]
