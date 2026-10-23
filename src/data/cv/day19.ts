import { maker } from './make'

const q = maker(19)

// Day 19 · Cảm biến và chuỗi khung hình – thời gian
export const day19 = [
  q.single('01', 1, 'Thông điệp chính của buổi học về cảm biến trong dự án ADAS thật là gì?',
    'Mô hình AI chỉ là một phần; chất lượng cảm biến, thời điểm đo, hiệu chuẩn, băng thông và theo dõi sức khoẻ cảm biến quyết định perception có dùng được ngoài đường hay không',
    ['Chỉ cần mô hình đủ lớn thì cảm biến rẻ nào cũng dùng được', 'Cảm biến chỉ quan trọng khi thu thập dữ liệu huấn luyện, không quan trọng lúc chạy thật', 'Hiệu chuẩn chỉ cần làm một lần khi xuất xưởng'],
    'Slide nhấn mạnh: trong dự án ADAS thật, lỗi thường xuất hiện trước mô hình: cáp dài gây mất khung, đồng hồ lệch, ống kính bẩn, radar bóng ma, LiDAR bị mưa sương hoặc méo do chuyển động.'),

  q.single('02', 1, 'Trong mô hình đo z = h(x) + noise, z là gì?',
    'Phép đo cảm biến trả về, là một hàm của trạng thái thật cộng nhiễu',
    ['Trạng thái thật của thế giới', 'Độ trễ của cảm biến', 'Ma trận hiệu chuẩn extrinsic'],
    'Cảm biến đo gián tiếp trạng thái thế giới x. Day 20 dùng chính mô hình này (và phương sai nhiễu R) trong bước cập nhật Kalman.'),

  q.order('03', 2, 'Sắp xếp các khâu dữ liệu cảm biến đi qua trước khi tới tính năng (theo stack thực tế).', [
    'Dữ liệu thô của cảm biến',
    'Driver & IO',
    'Đồng bộ & bộ đệm',
    'Hiệu chuẩn',
    'Perception',
    'Tính năng (AEB, ACC, LKA…)',
  ], 'Sensor không đi thẳng vào model: raw → driver/IO (CSI, GMSL, USB, Ethernet, CAN) → sync & buffer (timestamp, hàng đợi, độ trễ) → calibration (intrinsic, extrinsic, health check) → perception → feature.'),

  q.single('04', 1, 'Nguyên tắc chọn cảm biến được nêu trong bài là gì?',
    'Không có cảm biến "tốt nhất"; chọn cảm biến hợp với nhiệm vụ, môi trường, ngân sách, sức tính, mục tiêu an toàn và khả năng debug',
    ['Luôn chọn LiDAR vì đo 3D chính xác nhất', 'Luôn chọn camera vì rẻ và giàu thông tin nhất', 'Chọn cảm biến có tần số cao nhất'],
    'Mỗi loại mạnh một việc: camera nhận dạng, LiDAR đo khoảng cách 3D, radar đo vận tốc và chịu thời tiết xấu, sonar/ToF rẻ ở cự ly gần.'),

  q.match('05', 1, 'Ghép cảm biến với điểm mạnh chính của nó.', [
    ['Camera', 'Nhận dạng người, xe, biển báo, làn và màu sắc'],
    ['LiDAR', 'Khoảng cách 3D chính xác'],
    ['Radar', 'Vận tốc, nhìn xa, giữ được khi mưa, sương'],
    ['Sonar / ToF', 'Cự ly gần, rẻ, hợp đỗ xe và robot'],
  ], 'Bảng chọn cảm biến theo tính năng ADAS/robot/drone: AEB/FCW dùng camera để nhận dạng, LiDAR cho khoảng cách 3D, radar cho vận tốc trong mưa/sương; sonar không hợp tầm xa.'),

  q.single('06', 2, 'Với robot di động, sonar/ToF thường được dùng ở cự ly nào?',
    'Gần, phổ biến dưới khoảng 5 m',
    ['Từ 50 đến 200 m', 'Chỉ dùng trên cao tốc', 'Không dùng cho robot'],
    'Bảng chọn cảm biến ghi sonar/ToF "rất phổ biến < 5 m" cho robot: phát hiện vật cản gần, docking, đỗ xe.'),

  q.match('07', 2, 'Ghép loại camera với đặc điểm của nó.', [
    ['Stereo / depth', 'Cho độ sâu nhưng cần bề mặt có vân và khoảng cách hai ống kính'],
    ['Fisheye / surround', 'Nhìn rộng, méo mạnh nên cần hiệu chuẩn chính xác'],
    ['Thermal / IR', 'Thấy người đi bộ ban đêm, trong khói'],
    ['Event camera', 'Chuyển động rất nhanh, HDR, độ trễ thấp; dữ liệu thưa'],
  ], 'Mono RGB rẻ, giàu màu nhưng yếu khi chói, đêm, mưa. Mỗi loại camera phục vụ một bài toán khác nhau.'),

  q.single('08', 2, 'Camera trước của xe ADAS nên có đặc điểm gì theo ví dụ trong bài?',
    'Màn trập nhanh hoặc global shutter cùng HDR',
    ['Fisheye để nhìn 360°', 'Thermal để thay mọi camera khác', 'Event camera vì dễ xử lý nhất'],
    'Ví dụ dự án: camera trước ADAS cần global/fast shutter + HDR; robot trong nhà có thể dùng RGB-D; drone nhỏ ưu tiên camera nhẹ + optical flow + rangefinder.'),

  q.single('09', 1, 'Vạch làn và cột điện trong ảnh bị nghiêng khi drone xoay nhanh. Nguyên nhân hợp lý nhất?',
    'Rolling shutter: ảnh được đọc từng hàng nên vật bị lệch theo hàng quét',
    ['Detector bị quá khớp', 'LiDAR mất gói', 'Radar bị multipath'],
    'Rolling shutter làm vật/làn bị nghiêng khi xe hoặc drone rung, quay nhanh. Hỏi: có cần global shutter hay bù chuyển động không?'),

  q.single('10', 1, 'Khi tích hợp camera, câu hỏi nào kiểm tra đúng nguy cơ ở cổng truyền (MIPI/GMSL/USB/GigE)?',
    'Băng thông có đủ cho FPS × độ phân giải × số bit mỗi điểm ảnh không?',
    ['Mô hình có đủ tham số không?', 'Ảnh có đủ màu không?', 'Có đủ nhãn huấn luyện không?'],
    'Cổng truyền có thể rớt khung hoặc tăng độ trễ. Băng thông thô = FPS × W × H × bit depth.'),

  q.fill('11', 2, 'Camera 1920 × 1080, 12 bit mỗi điểm ảnh, 30 fps cần băng thông thô khoảng bao nhiêu Mbit/s? (làm tròn tới hàng đơn vị)', ['746', '746 Mbit/s', '746Mbit/s'],
    '1920 × 1080 = 2.073.600 điểm ảnh; × 12 bit = 24.883.200 bit mỗi khung; × 30 = 746.496.000 bit/s ≈ 746 Mbit/s, đã sát mức 1 Gbit/s của GigE.'),

  q.tf('12', 1, 'Đo FPS là đủ để biết camera pipeline có kịp thời hay không.', false,
    'Sai. Phải đo độ trễ đầu–cuối (end-to-end latency), không chỉ FPS: hàng đợi có thể làm khung đến muộn dù FPS vẫn cao.'),

  q.match('13', 2, 'Ghép loại LiDAR với ứng dụng/đặc điểm.', [
    ['Single-point ToF', 'Đo độ cao drone, hạ cánh, robot trong nhà; rẻ, nhẹ'],
    ['2D scanning LiDAR', 'SLAM robot, tránh vật cản; không thấy vật treo hoặc thấp'],
    ['3D spinning LiDAR', 'Xe tự lái, robot ngoài trời, lập bản đồ; point cloud dày'],
    ['FMCW LiDAR', 'Có tiềm năng đo vận tốc trực tiếp'],
  ], 'Với drone/robot nhỏ, rangefinder ToF/LiDAR thường quan trọng hơn LiDAR 3D đắt tiền vì giới hạn công suất, khối lượng và sức tính.'),

  q.multi('14', 2, 'Những rủi ro nào khi tích hợp LiDAR được nêu trong bài? (chọn nhiều)',
    ['Mất gói UDP / băng thông', 'Mưa, sương, bụi nước làm giảm tầm và sinh điểm giả', 'Méo do chuyển động khi xe quay lúc chưa quét xong', 'Kính, vật đen, biển phản quang', 'Hiệu chuẩn trôi do rung, tháo lắp'],
    ['LiDAR không đo được khoảng cách'],
    'Mỗi rủi ro có tác động riêng: point cloud thưa, mất vật nhỏ, vật bị cong/kéo dài, sai khoảng cách, chiếu lệch và hợp nhất sai.'),

  q.single('15', 2, 'Theo "debug recipe" cho LiDAR, nên kiểm tra gì trước khi kết luận mô hình kém?',
    'Số gói, timestamp, mật độ điểm theo khoảng cách, histogram intensity và độ chồng khớp với camera/radar',
    ['Chỉ cần train lại với nhiều epoch hơn', 'Đổi sang mô hình lớn hơn', 'Tắt LiDAR và chỉ dùng camera'],
    'Dữ liệu LiDAR thật nhưng không tự sạch: kiểm data health trước khi đổ lỗi cho mô hình.'),

  q.match('16', 1, 'Ghép loại radar với ứng dụng.', [
    ['Radar tầm ngắn (SRR)', 'Đỗ xe, điểm mù, xe cắt ngang'],
    ['Radar tầm trung/xa (MRR/LRR)', 'ACC, AEB, cao tốc'],
    ['Radar 4D imaging', 'Đo khoảng cách, góc phương vị, góc ngẩng và vận tốc'],
  ], 'Radar tầm xa có Doppler đo vận tốc nhưng phân giải góc thấp hơn camera/LiDAR. Radar 4D đang phát triển mạnh cho thời tiết xấu.'),

  q.single('17', 1, 'Radar vẫn giữ khoảng cách tới xe trước trong mưa, nhưng có nhược điểm gì cần xử lý?',
    'Dễ sinh bóng ma do phản xạ nhiều đường (multipath); cần tracking, gating và hợp nhất để giảm báo sai',
    ['Không đo được vận tốc', 'Không dùng được ban đêm', 'Chỉ đo được vật màu đỏ'],
    'Cầu, rào chắn, xe lớn tạo phản xạ phụ. Nếu tracking/gating yếu, chúng thành vật cản ảo.'),

  q.single('18', 2, 'Dữ liệu radar dạng thô (ADC/FFT/range-Doppler map) khác target list ở điểm nào?',
    'Dữ liệu thô giúp nghiên cứu; target list nhỏ hơn, dùng cho ECU sản phẩm',
    ['Target list chứa nhiều thông tin hơn dữ liệu thô', 'Dữ liệu thô chỉ có ở camera', 'Hai loại hoàn toàn giống nhau'],
    'Slide: "Raw ADC/FFT/RD map giúp nghiên cứu. Target list nhỏ hơn cho production ECU."'),

  q.multi('19', 2, 'Điểm yếu của cảm biến siêu âm (ultrasonic/sonar) là gì? (chọn nhiều)',
    ['Kém với vật mềm hoặc nghiêng', 'Bị gió ảnh hưởng', 'Nhiễu chéo khi nhiều cảm biến đặt gần nhau'],
    ['Quá đắt cho xe phổ thông', 'Chỉ hoạt động ở tầm trên 100 m'],
    'Sonar rẻ, gần, hợp đỗ xe và robot chậm. Vật mềm/nghiêng hấp thụ âm; nhiều sonar gần nhau phản xạ lẫn nhau.'),

  q.tf('20', 2, 'Theo bài, cảm biến rẻ và đơn giản đôi khi giúp drone/robot an toàn hơn nếu đặt đúng vị trí, hiệu chuẩn đúng và có health check rõ ràng.', true,
    'Đúng. Đây là một bài học quan trọng cho drone/robot: rangefinder, sonar rẻ vẫn rất hữu ích khi tích hợp đúng.'),

  q.match('21', 2, 'Ghép nền tảng với ràng buộc hay gặp.', [
    ['Xe ADAS', 'Nhiệt độ, an toàn, chiều dài cáp, timestamp, domain controller'],
    ['Drone', 'Khối lượng, công suất, rung, chuyển động nhanh, sức tính yếu'],
    ['Robot di động', 'Ánh sáng trong nhà, bề mặt phản xạ, cáp/USB chập chờn'],
  ], 'Kỹ năng kỹ sư cần: đọc datasheet, tính băng thông, đo độ trễ, ghi log thô, tạo test case suy giảm và chứng minh tính năng vẫn an toàn.'),

  q.order('22', 1, 'Sắp xếp "thang suy giảm" cảm biến từ gốc vật lý tới lỗi tính năng.', [
    'Vật lý (mưa, sương, rung, chói)',
    'Tín hiệu (mờ, nhiễu, mất điểm, bóng ma)',
    'Nhận thức (sai hộp, bỏ sót vật)',
    'Thời gian (đổi ID, rung, vật ma)',
    'Tính năng (phanh muộn, hạ cánh sai)',
  ], 'Suy giảm không chỉ làm giảm mAP: nó phá giả định của tracking, hợp nhất, điều khiển và có thể thành lỗi an toàn.'),

  q.tf('23', 1, 'Suy giảm cảm biến chỉ làm giảm mAP, không ảnh hưởng tracking hay điều khiển.', false,
    'Sai. Slide: degradation làm sai giả định của tracking/fusion/control và có thể biến thành lỗi an toàn.'),

  q.match('24', 1, 'Ghép kiểu suy giảm camera với metric đo nó.', [
    ['Chói / cháy sáng', 'Tỷ lệ điểm ảnh bão hoà, độ tương phản cục bộ'],
    ['Thiếu sáng / hầm', 'Độ sáng, entropy, thời gian phơi sáng, gain'],
    ['Mờ do chuyển động / rung', 'Phương sai Laplacian, độ nhất quán optical flow'],
    ['Ống kính bẩn', 'Độ nhất quán theo thời gian + bản đồ vùng bẩn'],
  ], 'Mẹo thực tế: lưu health metric cùng timestamp trong log để sau này khai thác ca lỗi nhanh hơn thay vì chỉ lưu ảnh.'),

  q.single('25', 2, 'Metric nào phù hợp để phát hiện rolling shutter làm lệch ảnh?',
    'Phần dư giữa IMU và camera, ước lượng độ trễ giữa các hàng (line delay)',
    ['Số gói LiDAR mỗi khung', 'Tỷ lệ bóng ma radar', 'Số nhãn mỗi lớp'],
    'Rolling shutter làm vật/làn nghiêng theo hàng quét và làm VIO trôi; đo bằng IMU-camera residual và line delay.'),

  q.match('26', 2, 'Ghép kiểu suy giảm LiDAR với metric đo nó.', [
    ['Sương / mưa / bụi nước', 'Mật độ điểm theo khoảng cách, tỷ lệ điểm ngoại lai'],
    ['Mất gói / băng thông', 'Số gói mỗi khung, độ phủ góc phương vị'],
    ['Méo do chuyển động', 'Phần dư sau bù ego-motion'],
    ['Lệch cơ khí sau rung, va chạm', 'Reprojection error, độ khớp cạnh/mặt phẳng'],
  ], 'Benchmark nhỏ: làm nhiễu point cloud bằng point dropout + nhiễu Gaussian + motion smear rồi đo recall vật gần/xa.'),

  q.single('27', 2, 'Nguyên tắc hành động với radar và sonar khi đọc giá trị bất thường là gì?',
    'Đừng tin một lần đọc: cần lọc, yêu cầu xuất hiện liên tục, gating và cảm biến dự phòng',
    ['Luôn tin lần đọc mới nhất', 'Tắt ngay cảm biến khi có một giá trị lạ', 'Tăng tần số lấy mẫu là đủ'],
    'Slide "Action rule": không tin một reading; dùng filter, persistence, gating và fallback modality.'),

  q.single('28', 2, 'Rangefinder bị "bão hoà" (saturation) có biểu hiện gì?',
    'Nắng mạnh, độ phản xạ thấp hoặc độ cao ngoài tầm làm giá trị khoảng cách nhảy hoặc mất',
    ['Khoảng cách luôn bằng 0 một cách ổn định', 'Ảnh camera bị cháy sáng', 'Radar sinh nhiều mục tiêu'],
    'Bão hoà rangefinder là một kiểu suy giảm khó thấy bằng mắt nhưng gây lỗi rất thật cho drone hạ cánh, giữ độ cao.'),

  q.match('29', 2, 'Ghép modality với metric sức khoẻ có thể ghi log.', [
    ['Camera', 'Độ sáng, bão hoà, độ mờ, entropy, rớt khung'],
    ['LiDAR', 'Mật độ điểm, số gói, histogram intensity, độ phủ tầm'],
    ['Radar', 'SNR, tỷ lệ bóng ma, số mục tiêu, nhất quán Doppler'],
    ['Chéo cảm biến', 'Sai số chiếu camera–LiDAR, ghép radar–LiDAR'],
  ], 'Sensor health monitoring biến chất lượng cảm biến thành tín hiệu đo được, có ngưỡng cảnh báo nhẹ và nặng.'),

  q.order('30', 2, 'Sắp xếp bốn mức suy giảm từ nhẹ tới nặng.', [
    'S0 Normal',
    'S1 Mild',
    'S2 Degraded',
    'S3 Critical',
  ], 'S0 dùng bình thường; S1 ghi cảnh báo, làm mượt; S2 đổi trọng số hợp nhất, chạy chậm lại; S3 không tin cảm biến, tắt tính năng hoặc chế độ an toàn.'),

  q.match('31', 1, 'Ghép mức suy giảm với hành động của hệ thống.', [
    ['S0 Normal', 'Dùng độ tin và output bình thường'],
    ['S1 Mild', 'Ghi cảnh báo, làm mượt thêm, giảm trọng số một chút'],
    ['S2 Degraded', 'Đổi model/trọng số hợp nhất, yêu cầu chạy chậm lại'],
    ['S3 Critical', 'Tắt tính năng hoặc chuyển chế độ an toàn'],
  ], 'Không phải lỗi nào cũng xử lý giống nhau; mỗi mức có hành động riêng.'),

  q.single('32', 1, 'AEB: camera bị chói ở mức S2 nhưng radar vẫn S0. Hệ thống nên làm gì?',
    'Vẫn giữ tracking bằng radar, giảm trọng số camera',
    ['Tắt hẳn AEB', 'Bỏ radar, chỉ tin camera', 'Không cần thay đổi gì'],
    'Ví dụ trong slide: camera glare S2, radar S0 → vẫn giữ tracking bằng radar.'),

  q.single('33', 2, 'LiDAR mất gói ở mức S3 và camera mưa ở mức S2. Theo ví dụ trong bài, hệ thống nên làm gì?',
    'Giảm tốc hoặc chuyển sang chế độ an toàn',
    ['Tăng tốc để thoát vùng mưa', 'Giữ nguyên vì vẫn còn camera', 'Chỉ ghi log và tiếp tục như bình thường'],
    'Khi hai cảm biến cùng suy giảm nặng, không còn đủ nguồn tin cậy: giảm tốc hoặc safe fallback.'),

  q.match('34', 1, 'Ghép lớp hiệu chuẩn với hậu quả khi sai.', [
    ['Intrinsic', 'Chiếu sai ngay trong một ảnh (tiêu cự, tâm ảnh, méo)'],
    ['Extrinsic', 'Hợp nhất lệch giữa camera, LiDAR, radar, IMU, xe'],
    ['Hiệu chuẩn thời gian', 'Vật lệch vị trí theo vận tốc'],
  ], 'Ba lớp lỗi cần phân biệt: lens model, T_cam_lidar, và độ lệch timestamp/độ trễ cảm biến.'),

  q.match('35', 1, 'Ghép dấu hiệu lệch với lớp hiệu chuẩn nên nghi.', [
    ['Điểm chiếu lệch một khoảng cố định', 'Extrinsic'],
    ['Vật lệch nhiều hơn khi chạy nhanh', 'Đồng bộ thời gian'],
    ['Mép ảnh cong, méo', 'Intrinsic / distortion'],
  ], 'Slide: projection lệch cố định → extrinsics; lệch theo tốc độ → time sync; méo/rìa ảnh sai → intrinsics/distortion.'),

  q.fill('36', 1, 'Xe chạy 50 km/h, timestamp lệch 50 ms. Vật bị đặt sai khoảng bao nhiêu mét? (làm tròn 1 chữ số thập phân)', ['0,7', '0.7', '0,7 m', '0.7 m'],
    '50 km/h ≈ 13,9 m/s; 13,9 × 0,05 ≈ 0,69 m ≈ 0,7 m. Với người đi bộ, xe đạp, sai lệch này đủ làm detector và tracker bất ổn.'),

  q.fill('37', 2, 'LiDAR lắp lệch 1° so với hiệu chuẩn. Ở khoảng cách 30 m, điểm lệch ngang khoảng bao nhiêu mét? (làm tròn 2 chữ số thập phân)', ['0,52', '0.52', '0,52 m', '0.52 m'],
    'e ≈ d·tan Δθ = 30 × tan 1° ≈ 30 × 0,01745 ≈ 0,52 m. Lệch do góc tăng theo khoảng cách, không đổi theo tốc độ.'),

  q.match('38', 2, 'Ghép cách hiệu chuẩn với đặc điểm.', [
    ['Target-based', 'Bảng caro/AprilTag trong lab; chính xác nhưng không mở rộng cho cả đội xe'],
    ['Targetless', 'Dùng cạnh, mặt phẳng, vật, độ sâu trong cảnh tự nhiên'],
    ['Online', 'Ước lượng khi xe đang chạy; phải chịu được vật chuyển động'],
    ['Re-calibration trigger', 'Kích hoạt khi health metric báo lệch sau rung, tháo lắp, va chạm'],
  ], 'Nghiên cứu gần đây đi theo hướng targetless/online: ground-plane + edge matching, tương ứng vật, depth dày và tinh chỉnh tự giám sát.'),

  q.single('39', 2, 'Mini demo về hiệu chuẩn trong bài gợi ý làm gì?',
    'Làm lệch extrinsic 0,5–2° hoặc vài cm, rồi đo reprojection error và mức tụt mAP/ghép đối tượng',
    ['Train lại mô hình với dữ liệu mới', 'Thay camera bằng LiDAR', 'Tăng độ phân giải ảnh lên gấp đôi'],
    'Perturb có kiểm soát để thấy hiệu chuẩn sai ảnh hưởng thuật toán thế nào.'),

  q.single('40', 1, 'Camera 30 Hz, LiDAR 10 Hz, radar 20 Hz. Trước khi hợp nhất, kỹ sư cần làm gì?',
    'Ghi timestamp gốc, đo độ trễ từng khâu, nội suy/deskew theo ego-motion về một thời điểm hợp nhất chung',
    ['Hạ mọi cảm biến về 10 Hz rồi ghép theo thứ tự đến', 'Chỉ dùng cảm biến nhanh nhất', 'Ghép theo thời điểm dữ liệu tới máy tính'],
    'Lệch thời gian làm vật đang chuyển động bị chiếu sai chỗ; tracking có thể tạo vật ma hoặc ghép nhầm.'),

  q.fill('41', 2, 'LiDAR quét lúc t₀ = 0 s và t₁ = 0,1 s. Ảnh chụp lúc 0,03 s. Khi nội suy tuyến tính về thời điểm ảnh, trọng số của lần quét sau (t₁) là bao nhiêu? (dạng thập phân)', ['0,3', '0.3', '30%'],
    '(t − t₀)/(t₁ − t₀) = 0,03 / 0,1 = 0,3: lấy 30% đoạn thay đổi giữa hai lần quét.'),

  q.tf('42', 1, 'Lệch thời gian giữa các cảm biến có thể khiến tracker tạo vật ma hoặc ghép nhầm đối tượng.', true,
    'Đúng. Object đang di chuyển bị chiếu sai vị trí, nên data association sai hoặc sinh ghost.'),

  q.match('43', 2, 'Trong auto-label nhiều cảm biến, ghép cảm biến với phần nó đóng góp.', [
    ['Camera segmentation', 'Gán lớp (ngữ nghĩa); độ sâu yếu'],
    ['LiDAR 3D', 'Vị trí 3D tốt; phân lớp yếu'],
    ['Radar', 'Vận tốc tốt; thưa và có bóng ma'],
  ], 'Kết quả dùng để auto-label radar/LiDAR hoặc ưu tiên khung khó cho người gán nhãn.'),

  q.single('44', 1, 'Rủi ro lớn nhất của pseudo-label từ nhiều cảm biến là gì?',
    'Nếu hiệu chuẩn hoặc đồng bộ thời gian sai thì pseudo-label cũng sai',
    ['Pseudo-label luôn chính xác hơn nhãn người', 'Không thể dùng cho radar', 'Tốn nhiều băng thông hơn ảnh thô'],
    'Auto-label cần độ tin, sự đồng thuận giữa cảm biến và kiểm tra thủ công (manual audit).'),

  q.order('45', 2, 'Sắp xếp vòng dữ liệu dùng sức khoẻ cảm biến để chọn dữ liệu.', [
    'Nạp log (dữ liệu thô + health metric)',
    'Khai thác lát dữ liệu (đêm, mưa, chói, mất điểm)',
    'Auto-label chéo cảm biến + độ bất định',
    'Người kiểm tra các khung giá trị cao',
    'Benchmark theo lát + cổng chặn regression',
  ], 'Một data loop tốt không chỉ lấy thêm nhiều dữ liệu mà lấy đúng dữ liệu mà cảm biến/mô hình/hợp nhất đang yếu, có metric rõ và tái hiện được.'),

  q.single('46', 2, 'Truy vấn "đêm + đường ướt + LiDAR mật độ thấp + cảnh báo bóng ma radar + camera chói" dùng để làm gì?',
    'Chọn clip để benchmark và gán nhãn: đúng lát dữ liệu hệ thống đang yếu',
    ['Xoá các clip xấu khỏi dữ liệu', 'Huấn luyện mô hình bỏ qua đêm và mưa', 'Hiệu chuẩn lại camera'],
    'Ví dụ query data trong slide: dùng health metric để tìm rare case, đưa vào benchmark và labeling.'),

  q.multi('47', 2, 'Kết quả benchmark robust perception (KITTI-C, nuScenes-C, Waymo-C) cho thấy điều gì? (chọn nhiều)',
    ['Nhiều kiểu corruption được mô phỏng trên camera/LiDAR', 'Corruption do chuyển động và nhiễu cảm biến có thể làm hiệu năng tụt mạnh'],
    ['Mô hình hợp nhất luôn miễn nhiễm với corruption', 'Corruption chỉ ảnh hưởng camera, không ảnh hưởng LiDAR'],
    'Dong et al. CVPR 2023: 27 kiểu corruption; motion corruption và sensor noise gây tụt rất mạnh.'),

  q.single('48', 3, 'Rubric chấm mini project của buổi này dành tỷ trọng lớn nhất cho phần nào?',
    'Benchmark chạy được (40%)',
    ['Trình bày trade-off (15%)', 'Giải thích thuật toán (20%)', 'Hiểu lỗi thực tế (25%)'],
    'Rubric: 40% benchmark chạy được · 25% hiểu real-world failure · 20% giải thích thuật toán · 15% trình bày rõ trade-off.'),

  q.order('49', 2, 'Sắp xếp các khái niệm cầu nối từ Day 19 sang Day 20 (Kalman / hợp nhất).', [
    'Mô hình đo z = h(x) + nhiễu',
    'Nhiễu / độ bất định (R, hiệp phương sai)',
    'Dự đoán – cập nhật',
    'Kiểm tra nhất quán (NIS/NEES, gating, fallback)',
  ], 'Day 19 trả lời "cảm biến đo gì và đáng tin không"; Day 20 đưa độ bất định đó vào Kalman/filter/fusion.'),

  q.multi('50', 1, 'Checklist trước khi đổ lỗi cho mô hình gồm những câu nào? (chọn nhiều)',
    ['Cảm biến đúng loại cho tính năng và môi trường chưa?', 'Băng thông, CPU/GPU đủ cho độ phân giải, FPS, tốc độ điểm chưa?', 'Timestamp, độ trễ, rớt khung có được ghi log đầy đủ chưa?', 'Benchmark có lát suy giảm (đêm, mưa, sương, mờ, mất gói) chưa?'],
    ['Mô hình đã đủ lớn chưa?', 'Đã thử learning rate lớn hơn chưa?'],
    'Checklist 6 câu còn có: intrinsic/extrinsic/temporal calibration có metric kiểm tra chưa; có sensor-health score và ngưỡng fallback chưa. Mô hình tốt trên benchmark sạch vẫn có thể hỏng trên cảm biến bẩn/lệch/không đồng bộ.'),
]
