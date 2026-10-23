import { maker } from './make'

const q = maker(23)

// Day 23 · 3D từ camera, BEV & Sensor fusion
export const day23 = [
  q.single('01', 1, 'Vì sao từ một ảnh camera không biết được vật cách bao xa?',
    'Mọi điểm trên cùng một tia nhìn đều rơi vào cùng một pixel: phép chiếu làm mất độ sâu',
    ['Vì camera chỉ chụp ảnh đen trắng', 'Vì ảnh có độ phân giải quá thấp', 'Vì camera không có tiêu cự'],
    'Một ảnh, vô số thế giới. Muốn biết vật nằm đâu trên tia cần thêm thông tin: kích thước đã biết, điểm chạm đất, hai góc nhìn, hoặc cảm biến đo trực tiếp (LiDAR, radar).'),

  q.match('02', 1, 'Ghép tham số camera với ý nghĩa.', [
    ['K (intrinsics)', 'Tiêu cự f, tâm ảnh c_x, c_y: đặc trưng riêng của camera'],
    ['[R | t] (extrinsics)', 'Camera đặt ở đâu, xoay hướng nào so với thân xe'],
  ], 'Pinhole: u = f·X/Z + c_x, v = f·Y/Z + c_y. Chia cho Z là lý do ảnh mất hẳn một chiều.'),

  q.single('03', 1, 'Bước "giải mã bằng K⁻¹" trong detector 3D đơn ảnh làm gì?',
    'Từ pixel (u, v) và độ sâu z dự đoán, tính lại điểm 3D: [x, y, z]ᵀ = z·K⁻¹·[u, v, 1]ᵀ',
    ['Chiếu điểm 3D xuống ảnh để vẽ box', 'Ước lượng tiêu cự camera từ ảnh', 'Xoá méo ống kính trước khi đưa vào mạng'],
    'Mạng chỉ đoán được điểm trên ảnh và độ sâu. K chiếu 3D xuống ảnh; K⁻¹ đi ngược lại để ra toạ độ 3D thật quanh xe.'),

  q.single('04', 2, 'Hộp 3D gồm 7 tham số. Hai tham số nào khó dự đoán nhất từ ảnh?',
    'Độ sâu z và hướng θ (yaw)',
    ['Chiều rộng w và chiều cao h', 'Toạ độ ngang x và chiều dài l', 'Chiều cao h và toạ độ y'],
    'w, l, h gần như cố định theo loại xe. Phân tích lỗi cho thấy phần lớn sai số của mono 3D đến từ định vị, chủ yếu độ sâu.'),

  q.single('05', 2, 'Vì sao nhiều detector dự đoán góc nhìn α rồi đổi sang yaw bằng θ = α + arctan(x/z)?',
    'Hình dạng xe trong ảnh phụ thuộc góc nhìn tới xe α, không phụ thuộc trực tiếp vào θ',
    ['Vì α luôn bằng 0 với xe đi thẳng', 'Vì θ không xác định được bằng toán học', 'Vì arctan rẻ hơn phép nhân ma trận'],
    'Cùng một θ, xe ở bên trái và bên phải ảnh trông khác nhau. α gắn với những gì mạng "thấy", nên dễ học hơn.'),

  q.fill('06', 1, 'Mẹo đặt chân xuống mặt đường: f = 720, camera cao h = 1,65 m, chân vật ở 40 px dưới đường chân trời. Khoảng cách Z (mét, 1 chữ số thập phân)?', ['29,7', '29.7'],
    'Z = f·h/(v − c_y) = 720·1,65/40 = 29,7 m. Lệch 1 px đã ra 29,0–30,5 m; gần đường chân trời 1 px đổi hàng chục mét. Đường dốc hoặc xe nhún làm công thức sai thêm.'),

  q.match('07', 2, 'Ghép hướng vượt nút thắt độ sâu với ví dụ.', [
    ['Nâng hộp 2D lên 3D', 'Mono3D, Deep3DBox'],
    ['Depth → point cloud', 'Pseudo-LiDAR'],
    ['Dự đoán trực tiếp (center-based)', 'SMOKE, FCOS3D, MonoFlex'],
    ['Phân phối depth → BEV', 'LSS, CaDDN, BEVDepth'],
    ['Query / Transformer', 'DETR3D, BEVFormer, PETR'],
  ], 'Càng về sau càng dùng nhiều camera và nhiều frame (BEVDet4D, StreamPETR, Sparse4D).'),

  q.match('08', 2, 'Ghép detector 3D đơn ảnh với ý tưởng.', [
    ['SMOKE', 'Bỏ hộp 2D, dự đoán tâm 3D chiếu lên ảnh bằng heatmap'],
    ['FCOS3D', 'Mở rộng FCOS anchor-free: mỗi pixel dự đoán offset, depth, kích thước, hướng'],
    ['MonoFlex', 'Xử lý riêng vật bị cắt biên, trộn nhiều ước lượng depth theo độ bất định'],
    ['CaDDN', 'Phân phối depth rời rạc mỗi pixel → voxel → BEV, giám sát depth bằng LiDAR'],
  ], 'Khung chung: backbone + FPN, vài đầu hồi quy, rồi giải mã bằng hình học camera (K⁻¹).'),

  q.single('09', 2, 'Uncertainty-weighted depth loss L = |z − ẑ|/σ + log σ mang lại gì?',
    'Mạng tự đoán độ bất định σ: depth khó (vật xa, bị che) được giảm phạt thay vì ép đoán điều bất khả thi',
    ['Mạng luôn dự đoán depth bằng 0 khi không chắc', 'Loss không phụ thuộc depth nên hội tụ nhanh', 'Phạt nặng hơn các vật ở gần'],
    'Số hạng log σ ngăn mạng đặt σ vô hạn. Đây là lý do FCOS3D, MonoFlex, PGD chính xác hơn hẳn các bản đầu.'),

  q.single('10', 2, 'Vì sao không hồi quy trực tiếp góc hướng mà dùng (sin α, cos α) hoặc multi-bin?',
    'Hồi quy góc trực tiếp bị "nhảy" ở biên 0°/360°',
    ['Vì sin và cos tính nhanh hơn góc', 'Vì góc luôn nằm trong [0, 90°]', 'Vì heatmap không chứa thông tin hướng'],
    'Multi-bin chia 360° thành vài cung, phân loại cung + hồi quy phần dư. Heatmap tâm dùng focal loss; offset và kích thước dùng L1/Smooth-L1.'),

  q.multi('11', 2, 'Những kỹ thuật nào giúp vắt thêm độ chính xác 3D từ một ảnh? (chọn nhiều)',
    ['Depth-aware convolution', 'NMS dùng rotated IoU (BEV-IoU)', 'Augmentation nhận biết hình học (lật ảnh thì lật dấu yaw và x)', 'Dùng nhiều frame liên tiếp'],
    ['Lật ảnh ngang nhưng giữ nguyên yaw', 'NMS bằng IoU 2D thẳng trục trên hộp xoay'],
    'Copy-paste một vật cũng phải scale lại kích thước theo phối cảnh. Các paper SOTA thường cộng dồn 4–5 mẹo nhỏ, mỗi mẹo 1–2% NDS/AP.'),

  q.single('12', 2, 'nuScenes ghép dự đoán với GT theo tiêu chí nào khi tính mAP?',
    'Khoảng cách tâm ở các ngưỡng 0,5 / 1 / 2 / 4 m',
    ['IoU 3D ≥ 0,7 cho xe', 'IoU 2D trên ảnh camera', 'Sai số hướng dưới 10°'],
    'KITTI dùng IoU 3D (xe 0,7), rất khắt khe. nuScenes cộng thêm 5 sai số TP: ATE, ASE, AOE, AVE, AAE.'),

  q.match('13', 2, 'Ghép sai số TP của nuScenes với ý nghĩa.', [
    ['ATE', 'Sai số vị trí'],
    ['ASE', 'Sai số kích thước'],
    ['AOE', 'Sai số hướng'],
    ['AVE', 'Sai số vận tốc'],
    ['AAE', 'Sai số thuộc tính (ví dụ đang đứng / đang đi)'],
  ], 'NDS = (1/10)·[5·mAP + Σ(1 − min(1, mTP))]: gom "tìm đúng" và "định vị đúng" thành một con số.'),

  q.single('14', 2, 'LET-3D-AP của Waymo cho camera-only khác AP thường ở điểm nào?',
    'Khoan dung sai số theo phương dọc (độ sâu), vì đó là lỗi vốn có của camera',
    ['Bỏ qua hoàn toàn sai số hướng', 'Chỉ chấm các vật trong 20 m', 'Dùng IoU 2D thay vì 3D'],
    'Longitudinal Error Tolerant: chấp nhận lệch theo đường ngắm, vẫn đòi chính xác theo phương ngang.'),

  q.order('15', 2, 'Sắp xếp các mô hình theo NDS trên nuScenes test (thấp → cao).', [
    'FCOS3D (camera)',
    'DETR3D (camera)',
    'BEVFormer (camera)',
    'BEVDepth (camera)',
    'CenterPoint (LiDAR)',
    'BEVFusion (camera + LiDAR)',
  ], '42,8 → 47,9 → 56,9 → 60,9 → 65,5 → 72,9. Bước nhảy lớn nhất là từ mono sang đa camera + BEV. LiDAR vẫn dẫn ở cùng thế hệ vì đo độ sâu trực tiếp; fusion cao nhất.'),

  q.multi('16', 1, 'Vì sao dùng không gian BEV (nhìn từ trên xuống)? (chọn nhiều)',
    ['Không gian chung cho mọi camera và cảm biến', 'Planning làm việc trên mặt đất (x, y)', 'Kích thước không bị phối cảnh bóp méo', 'Nhiều tác vụ (hộp, làn, bản đồ) chia sẻ một feature'],
    ['BEV giữ nguyên màu sắc chi tiết hơn ảnh', 'BEV không cần hiệu chuẩn camera'],
    'BEV là "ngôn ngữ chung" của fusion hiện đại. BEVFormer trên nuScenes dùng lưới ~200 × 200 ô, mỗi ô ~0,5 m, phủ ±51 m.'),

  q.match('17', 1, 'Ghép trường phái đưa ảnh lên BEV với đặc điểm.', [
    ['Bottom-up (LSS, BEVDet, BEVDepth)', 'Dự đoán depth từng pixel rồi rải lên BEV; phụ thuộc chất lượng depth'],
    ['Top-down (DETR3D, BEVFormer, PETR)', 'Từ ô BEV hoặc query hỏi ngược vào ảnh bằng attention'],
  ], 'Bottom-up có hình học rõ ràng, dễ debug theo depth. Hướng gần đây: sparse query + nhiều frame (StreamPETR, Sparse4D).'),

  q.order('18', 2, 'Sắp xếp các bước trong một lớp decoder của DETR3D.', [
    'Object query dự đoán một reference point 3D',
    'Chiếu điểm vào mọi camera bằng K và [R | t]',
    'Lấy feature tại pixel đó (bilinear) ở camera nhìn thấy nó',
    'Cập nhật query',
  ], 'Toàn bộ lặp 6 lần (6 decoder layer): đoán → nhìn lại → sửa. Huấn luyện bằng ghép Hungarian nên không cần NMS.'),

  q.single('19', 2, 'PETR khác DETR3D ở điểm nào?',
    'Cộng mã vị trí 3D vào feature ảnh rồi để query attend toàn cục, không cần chiếu điểm',
    ['Dùng dense BEV với depth từng pixel', 'Bỏ object query, dùng anchor', 'Chỉ dùng một camera phía trước'],
    'DETR3D chiếu reference point vào ảnh để lấy feature; PETR mã hoá vị trí 3D sẵn vào feature.'),

  q.multi('20', 2, 'Temporal fusion trên BEV (dịch BEV frame trước theo ego-motion rồi hợp nhất) mang lại gì? (chọn nhiều)',
    ['Ước lượng được vận tốc mà một ảnh không cho', 'Nhớ vật bị che tạm thời', 'Giảm nhiễu depth nhờ thị sai theo thời gian'],
    ['Bỏ được nhu cầu hiệu chuẩn camera', 'Giảm số camera cần dùng xuống một'],
    'Tương tự tracking vật qua nhiều frame. BEVFormer còn attention với BEV của frame trước.'),

  q.single('21', 1, 'Occupancy (dự đoán voxel trống/đặc kèm class) giải quyết điều gì mà hộp 3D không làm được?',
    'Xử lý vật hình dạng bất kỳ (xe đổ, cần cẩu, rác) và không cần class biết trước để "không đâm"',
    ['Đo vận tốc chính xác hơn radar', 'Giảm số tham số của mô hình', 'Thay thế hoàn toàn cảm biến LiDAR'],
    'Tesla giới thiệu Occupancy Network năm 2022; học thuật có Occ3D, SurroundOcc.'),

  q.single('22', 1, 'Đêm mưa, người đi bộ khuất sau xe tải: không cảm biến nào một mình thấy rõ. Fusion giúp thế nào?',
    'Ba manh mối yếu hợp lại thành kết luận chắc: camera gợi ý vị trí ngang và lớp, LiDAR xác nhận hình dạng/khoảng cách, radar xác nhận vật đang chuyển động',
    ['Chọn cảm biến có điểm tin cậy cao nhất và bỏ các cảm biến khác', 'Tắt camera vì trời tối', 'Chỉ dùng radar vì xuyên mưa'],
    'Đó là lý do fusion tồn tại: sai số và điểm mù của các cảm biến khác nhau nên bù cho nhau.'),

  q.single('23', 2, 'Bài học thiết kế từ vụ Williston, Florida 2016 (xe hỗ trợ lái đâm hông xe đầu kéo băng ngang) là gì?',
    'Một heuristic lọc nhiễu hợp lý ở tình huống này có thể sai chết người ở tình huống khác; cần gán/gating cẩn trọng thay vì luật cứng theo từng cảm biến',
    ['Radar luôn phát hiện được xe tải trắng', 'Camera tốt hơn radar trong mọi điều kiện', 'Chỉ cần thêm LiDAR là hết lỗi'],
    'NTSB xác nhận: xe tải không nhường đường, người lái mất tập trung, và không hệ thống hỗ trợ năm 2016 nào được thiết kế cho vật cắt ngang. Giả thuyết "radar lọc xe tải như biển báo phía trên" chưa được NTSB xác nhận.'),

  q.single('24', 1, 'LiDAR đo khoảng cách bằng cách nào và có điểm yếu gì?',
    'Đo trực tiếp bằng thời gian bay laser; điểm thưa dần theo khoảng cách và có bóng che phía sau vật',
    ['Suy ra từ kích thước vật trong ảnh; yếu khi vật lạ', 'Đo bằng hiệu ứng Doppler; yếu khi vật đứng yên', 'Đo bằng stereo hai camera; yếu ban đêm'],
    'LiDAR giỏi vị trí, camera giỏi ngữ nghĩa. Detector LiDAR thường quy điểm về BEV (mật độ, chiều cao, cường độ) trước mạng 2D.'),

  q.single('25', 1, 'Radar đo vận tốc bằng Doppler. Khi xe chạy ngang qua trục nhìn của radar thì sao?',
    'Doppler gần 0, vì radar chỉ đo thành phần vận tốc dọc theo tia nhìn',
    ['Radar đo đúng toàn bộ vận tốc', 'Radar đo vận tốc gấp đôi thực tế', 'Radar mất hẳn tín hiệu khoảng cách'],
    'Radar mạnh: range và vận tốc trực tiếp, tầm 200 m+, xuyên mưa sương, rẻ. Yếu: phân giải góc thấp, ít điểm, nhiễu phản xạ. Vì vậy radar bổ sung chứ không thay thế.'),

  q.single('26', 1, 'Lỗi hiệu chuẩn góc (extrinsics) và lỗi lệch thời gian ảnh hưởng khác nhau thế nào?',
    'Lỗi góc lệch mọi vật (cùng số pixel, nhưng tính ra mét thì xa càng tệ); lệch thời gian chỉ làm vật đang chuyển động bị lệch',
    ['Cả hai chỉ ảnh hưởng vật ở gần', 'Lỗi góc chỉ ảnh hưởng vật chuyển động', 'Lệch thời gian làm lệch cả vật đứng yên'],
    'Chỉ 4° sai lệch extrinsics trên dữ liệu thật đã làm mọi điểm LiDAR trượt khỏi vật trong toàn bộ khung ảnh.'),

  q.match('27', 2, 'Ghép cảm biến với tham số intrinsic điển hình.', [
    ['Camera', 'K (f_x, f_y, c_x, c_y) + hệ số méo; đo bằng bàn cờ checkerboard'],
    ['LiDAR', 'Bảng hiệu chỉnh theo từng tia: góc dọc, offset, hệ số cường độ'],
    ['Radar', 'Hiệu chỉnh mảng ăng-ten: lệch pha, bias góc và vận tốc'],
    ['IMU', 'Bias và scale factor của từng trục'],
  ], 'Intrinsic = sensor tự nó đo lệch bao nhiêu, không đổi khi tháo lắp. Extrinsic = đặt ở đâu, hướng nào so với xe, đổi mỗi khi tháo lắp. IMU và GNSS còn có lever arm.'),

  q.single('28', 2, 'Hand-eye calibration AX = XB dùng khi nào?',
    'Hai cảm biến gắn cứng trên cùng robot: di chuyển robot qua nhiều vị trí, đo chuyển động A và B, giải ra phép biến đổi cố định X',
    ['Hiệu chuẩn tiêu cự camera bằng bàn cờ', 'Đồng bộ đồng hồ giữa hai cảm biến', 'Đo bias của IMU khi đứng yên'],
    'Trên xe thật calibration trôi theo thời gian (rung, va chạm nhẹ) nên cần online re-calibration: liên tục kiểm tra điểm LiDAR có khớp biên vật trong ảnh không.'),

  q.tf('29', 3, 'Khi dùng dataset KITTI, nuScenes hay Waymo, người dùng phải tự hiệu chuẩn K, R, t trước khi dùng.', false,
    'Sai. Các dataset này cung cấp sẵn K, R, t rất chính xác (đo trong phòng thí nghiệm trước khi ghi dữ liệu).'),

  q.match('30', 2, 'Ghép giải pháp đồng bộ thời gian với mô tả.', [
    ['Trigger phần cứng', 'Xung đồng hồ chung (PTP, GPS PPS) để camera chụp đúng lúc LiDAR quét qua'],
    ['Timestamp mềm + cửa sổ dung sai', 'Tìm khung có timestamp gần nhất trong ví dụ ±50 ms, quá xa thì bỏ'],
    ['Bù chuyển động (de-skew)', 'Dùng IMU/odometry nội suy/ngoại suy về một mốc thời gian chung'],
  ], 'LiDAR quay một vòng ~100 ms (10 Hz) nên điểm phía trước và phía sau không cùng mốc thời gian. Trong EKF, bước predict ngoại suy trạng thái tới đúng timestamp phép đo.'),

  q.match('31', 1, 'Ghép tầng hợp nhất với đặc điểm.', [
    ['Early fusion (data-level)', 'Gộp dữ liệu thô vào một mạng; giữ nhiều thông tin nhất nhưng cần calibration/đồng bộ cực chuẩn'],
    ['Mid fusion (feature-level)', 'Mỗi cảm biến rút feature riêng rồi gộp (thường trong BEV); xu hướng chủ đạo'],
    ['Late fusion (object-level)', 'Mỗi cảm biến tự ra hộp rồi hợp nhất; module độc lập, dễ debug nhưng mất thông tin thô'],
  ], 'Không có tầng đúng duy nhất: đó là quyết định thiết kế. BEVFusion và họ hàng là mid fusion.'),

  q.single('32', 2, 'Nhược điểm của late fusion khi cả hai cảm biến đều chỉ "hơi" thấy một vật là gì?',
    'Mỗi detector đã bỏ qua vật đó trước bước hợp nhất, nên late fusion khó cứu được',
    ['Late fusion luôn tạo ra hai hộp cho vật đó', 'Late fusion cần calibration hoàn hảo nên lỗi', 'Late fusion chạy quá chậm để kịp xử lý'],
    'Đổi lại late fusion là module độc lập: một nhánh lỗi không nhất thiết kéo sập cả hệ thống.'),

  q.tf('33', 1, 'Trục early/mid/late và trục fuse-then-track/track-then-fuse là cùng một cách phân loại.', false,
    'Sai. Early/mid/late hỏi hợp nhất ở tầng nào trong một khung hình. Fuse-then-track/track-then-fuse hỏi hợp nhất trước hay sau bước theo dõi theo thời gian. Hai trục độc lập.'),

  q.single('34', 1, 'Làm sao nhận ra kiến trúc track-then-fuse?',
    'Một track (x, P) duy nhất được các cảm biến lần lượt cập nhật, không gộp phép đo thô trước',
    ['Phép đo các cảm biến bị gộp thành một z_fused trước khi vào tracker', 'Mỗi cảm biến có một tracker riêng không bao giờ ghép', 'Chỉ dùng một cảm biến duy nhất'],
    'Mỗi phép đo mới (từ bất kỳ cảm biến nào) chạy predict rồi update. Bài Lab Day 23 dùng đúng cách này.'),

  q.single('35', 1, 'Trong track-then-fuse, thêm một cảm biến mới cần gì?',
    'Thêm một hàm đo h(x) và ma trận nhiễu R, không đổi cấu trúc track',
    ['Thiết kế một hàm gộp cho từng cặp cảm biến', 'Huấn luyện lại toàn bộ mạng detector', 'Thêm một track riêng cho cảm biến đó'],
    'Sensor hỏng chỉ bỏ qua bước update đó, track vẫn chạy. Yêu cầu đồng bộ lỏng hơn fuse-then-track.'),

  q.single('36', 2, 'Điểm yếu của fuse-then-track là gì?',
    'Cần tự thiết kế hàm gộp hai phép đo khác không gian, và rất nhạy lệch đồng bộ: gộp sai thì tracker không sửa lại được',
    ['Không thêm được cảm biến thứ hai', 'Tracker phải update nhiều lần mỗi chu kỳ', 'Không dùng được với Kalman'],
    'Ví dụ thực tế của gộp trước: PointPainting, BEVFusion gộp camera + LiDAR thành một biểu diễn rồi mới chạy detector + tracker.'),

  q.single('37', 3, 'Trong ô tô sản xuất, mỗi ECU cảm biến tự phát hiện và theo dõi riêng, ECU trung tâm gộp các track. Đây là kiến trúc gì?',
    'Track-to-track fusion: kiến trúc thứ ba, khác cả fuse-then-track lẫn track-then-fuse',
    ['Early fusion', 'Track-then-fuse như bài Lab', 'Fuse-then-track kiểu BEVFusion'],
    'Camera của Mobileye, radar của Continental/Bosch… xuất danh sách track ra bus; một ECU trung tâm ghép lại.'),

  q.match('38', 1, 'Ghép cảm biến với mô hình đo h(x) trong EKF.', [
    ['LiDAR', 'Vị trí [p_x, p_y, p_z]: tuyến tính, H hằng số'],
    ['Camera', 'Pixel u = c_u − f·p_y/p_x: phi tuyến'],
    ['Radar', '(r, φ, ṙ) = (‖p‖, atan2(p_y, p_x), p·v/‖p‖): phi tuyến'],
  ], 'Với h phi tuyến, Jacobian là "độ dốc tại chỗ" tại x⁻; EKF dùng nó để tính K. Phép chia cho p_x của camera chính là phép chiếu pinhole.'),

  q.single('39', 1, 'Trong EKF nhiều cảm biến, cảm biến có R nhỏ ảnh hưởng thế nào đến K?',
    'R nhỏ → K lớn → tin cảm biến đó hơn',
    ['R nhỏ → K nhỏ → tin dự đoán hơn', 'R không ảnh hưởng K', 'R nhỏ → P tăng'],
    'K = P⁻Hᵀ(HP⁻Hᵀ + R)⁻¹. Mỗi sensor chỉ cần một cặp (h, R).'),

  q.single('40', 2, 'Ví dụ EKF: xe cách 50 m, LiDAR đo vị trí (σ = 0,5 m). Vì sao K_v ≈ 0,02 trong khi K_p ≈ 0,94?',
    'LiDAR đo vị trí rất tốt nhưng gần như không nói gì trực tiếp về vận tốc',
    ['Vì vận tốc luôn bằng 0', 'Vì LiDAR đo vận tốc bằng Doppler', 'Vì P của vận tốc bằng 0'],
    'Residual −0,3 m: vị trí 49,8 → 49,52, vận tốc gần như giữ −2,0. Phương sai vị trí giảm mạnh 4,02 → 0,24.'),

  q.single('41', 1, 'Ở 49 m, camera đo độ rộng pixel cho K rất nhỏ (≈ −0,04). Bài học là gì?',
    'Ở xa, LiDAR gánh gần hết việc định vị, camera chỉ tinh chỉnh rất nhẹ; nếu LiDAR mất tín hiệu thì K của camera tự lớn hơn để gánh thay',
    ['Camera bị lỗi và nên bỏ đi', 'Kalman không dùng được với camera', 'Camera luôn chính xác hơn LiDAR ở xa'],
    'Ở 49 m, 1 px sai số tương đương hơn 1 m, nên camera "nói khẽ". Residual camera tính bằng pixel; Jacobian quy đổi sang mét.'),

  q.order('42', 1, 'Trước khi update, hệ thống nhiều track phải trả lời "phép đo này thuộc track nào". Sắp xếp các bước.', [
    'Gating: loại phép đo ngoài vùng khả dĩ d² = γᵀS⁻¹γ',
    'Association: ghép 1–1 bằng Hungarian (tổng chi phí nhỏ nhất)',
    'Track management: initialized → tentative → confirmed, lâu không ghép thì deleted',
  ], 'Phép đo không ghép được với track nào có thể là vật mới, tạo track mới.'),

  q.fill('43', 3, 'Cổng gating chi-square 2 bậc tự do ở xác suất 95% có ngưỡng d² bằng bao nhiêu?', ['5,99', '5.99'],
    'Phép đo có d² ≤ 5,99 nằm trong elip cổng; ví dụ z4 (14,5), z5 (16,0), z6 (9,8) bị loại ngay.'),

  q.match('44', 1, 'Ghép cách xử lý gán dữ liệu mơ hồ với đặc điểm.', [
    ['GNN / Hungarian', 'Gán cứng 1–1, tin 100% lựa chọn tốt nhất; nhanh, đủ khi vật thưa'],
    ['JPDA', 'Trộn có trọng số mọi phép đo trong cổng theo xác suất'],
    ['MHT', 'Giữ nhiều kịch bản gán song song, chốt khi đủ bằng chứng'],
  ], 'Cảnh đông, nhiều giao cắt thì cân nhắc JPDA/MHT hoặc affinity học được (vẫn ghép bằng Hungarian trên ma trận học được).'),

  q.single('45', 2, 'Fusion định vị chính xe (ego) kết hợp GNSS với IMU/odometry thế nào?',
    'GNSS cho vị trí tuyệt đối nhưng nhiễu và chậm; IMU/odometry mượt nhưng trôi; Kalman lấy điểm mạnh của cả hai',
    ['Chỉ dùng GNSS vì nó tuyệt đối', 'Chỉ dùng IMU vì nó nhanh nhất', 'Lấy trung bình cộng hai vị trí'],
    'Trong hầm, ước lượng chỉ trôi theo IMU rồi tự kéo lại khi có tín hiệu GNSS. Robot kho, drone, xe tự lái đều chạy EKF/SLAM như vậy.'),

  q.match('46', 2, 'Ghép lỗi fusion với triệu chứng hoặc cách chữa.', [
    ['Calibration drift', 'Điểm LiDAR chiếu lên ảnh dần không khớp'],
    ['Phụ thuộc một cảm biến', 'Modality dropout khi huấn luyện (tắt ngẫu nhiên từng cảm biến)'],
    ['Chiếu nhầm do che khuất', 'Điểm LiDAR phía sau vật che vẫn rơi vào pixel của vật che'],
    ['Cổng gán quá rộng / quá hẹp', 'Ghép nhầm / bỏ sót, hai vật gần nhau dễ đổi ID'],
  ], 'Thêm: lệch thời gian (vật chuyển động lệch), cảm biến suy giảm (ống kính bẩn, LiDAR mất điểm trên kính, bề mặt tối bóng).'),

  q.match('47', 3, 'Ghép hãng với triết lý cảm biến (số liệu công khai).', [
    ['Waymo Driver thế hệ 5', '29 camera, LiDAR mái 360° + LiDAR quanh thân, imaging radar'],
    ['Tesla FSD', '8 camera, không LiDAR, radar gỡ khỏi dây chuyền từ 2021 (Tesla Vision)'],
  ], 'Waymo đặt cược vào dư thừa đa cảm biến cho robotaxi không người lái; Tesla đặt cược vào camera + mạng sâu để giảm chi phí phần cứng ở quy mô triệu xe. Thông tin radar HW4 của Tesla chưa thống nhất.'),

  q.match('48', 2, 'Ghép loại robot với bộ cảm biến điển hình.', [
    ['Xe phổ thông (ADAS)', 'Camera trước + radar'],
    ['Robot kho (AMR)', 'LiDAR 2D + camera + IMU + odometry bánh xe'],
    ['Drone', 'Camera + IMU (visual-inertial odometry) + GNSS'],
    ['Cánh tay robot', 'Camera RGB-D hoặc stereo + cảm biến lực'],
  ], 'Không có đáp án chung: lựa chọn phụ thuộc môi trường vận hành, chi phí và mức an toàn cần đạt.'),

  q.fill('49', 2, 'Ở 50 km/h, mỗi 100 ms trễ làm xe đi thêm khoảng bao nhiêu mét? (1 chữ số thập phân)', ['1,4', '1.4'],
    '50 km/h ≈ 13,9 m/s, nên 0,1 s ≈ 1,4 m. Perception phải chạy trong ngân sách ~50–100 ms; báo cáo mô hình mà không nêu độ trễ là chưa đủ.'),

  q.multi('50', 2, 'Để BEV dày và backbone lớn chạy kịp ngân sách độ trễ, bài giảng gợi ý những gì? (chọn nhiều)',
    ['Quantization', 'TensorRT', 'Biểu diễn sparse'],
    ['Tăng kích thước lưới BEV', 'Thêm nhiều frame lịch sử hơn'],
    'Đánh đổi thật: độ chính xác (NDS) vs tốc độ (FPS) vs bộ nhớ GPU. Đồng bộ nhiều cảm biến cũng ăn thời gian.'),

  q.single('51', 1, 'Ý cần nhớ nhất về 3D detection từ camera là gì?',
    'Mọi detector 3D từ camera là một cách đoán lại độ sâu đã mất rồi giải mã ngược qua K; sai số chủ yếu ở z',
    ['Camera đo độ sâu trực tiếp như LiDAR', 'Sai số chủ yếu đến từ phân loại sai lớp', 'Chỉ cần một ảnh là đủ cho mọi khoảng cách'],
    'Đó là động lực của BEV, nhiều camera, nhiều frame và fusion với LiDAR/radar.'),

  q.single('52', 1, 'Vì sao mid fusion (như BEVFusion) là xu hướng chủ đạo?',
    'Cân bằng tốt nhất độ chính xác và độ bền: feature đã được làm sạch riêng từng cảm biến trước khi gộp',
    ['Không cần dữ liệu đồng bộ khi train', 'Không cần huấn luyện mạng nào', 'Chỉ dùng một cảm biến nên rẻ nhất'],
    'Đổi lại phải huấn luyện chung cả hai nhánh (tốn dữ liệu, compute) và vẫn cần dữ liệu hai cảm biến đồng bộ.'),
]
