import { maker } from './make'

const q = maker(21)

// Day 21 · 3D từ point cloud
export const day21 = [
  q.order('01', 1, 'Sắp xếp pipeline thực tế từ tia laser tới quyết định của xe/robot.', [
    'Gói LiDAR (UDP/Ethernet, timestamp)',
    'Point cloud (XYZI + ring + time offset)',
    'Ego frame (TF, extrinsic, deskew)',
    'Biểu diễn (voxel / pillar / range / BEV)',
    'Detector 3D (hộp, lớp, điểm, vận tốc)',
    'Đầu vào planner (AEB / ACC / tránh vật / tracking)',
  ], 'Pipeline thực tế không bắt đầu từ model: một detector tốt vẫn có thể hỏng nếu dữ liệu trước nó lệch 2 cm, trễ 50 ms hoặc sai trục.'),

  q.single('02', 1, 'Rule of thumb của buổi học là gì?',
    'Trước khi benchmark mô hình, hãy benchmark sức khoẻ dữ liệu',
    ['Luôn bắt đầu bằng mô hình mới nhất', 'Train lâu hơn trước khi debug dữ liệu', 'Chỉ cần mAP cao là đủ'],
    'Frame nào, timestamp nào, đơn vị nào, đã bù chuyển động chưa, có điểm phía sau camera không, hộp tâm hay đáy, yaw theo trục nào: phải trả lời trước.'),

  q.match('03', 1, 'Ghép trường của một điểm LiDAR với ý nghĩa.', [
    ['x, y, z', 'Toạ độ 3D trong hệ cảm biến hoặc hệ xe'],
    ['intensity', 'Độ phản xạ của vật liệu'],
    ['ring / channel', 'Tia laser nào tạo ra điểm'],
    ['time offset', 'Thời điểm của điểm trong một vòng quét'],
    ['return type', 'Phản xạ đầu, mạnh nhất hay cuối'],
  ], 'Các trường phụ quyết định việc deskew, lọc và debug: ring giúp tìm tia hỏng, mưa sương; time offset cần cho deskew; return type ảnh hưởng cây cối, kính, mưa, vật mỏng.'),

  q.single('04', 1, 'Trường nào cần để bù chuyển động (deskew) khi xe/robot đang chạy?',
    'Time offset của từng điểm trong vòng quét',
    ['Intensity', 'Return type', 'Class map'],
    'Mỗi điểm được đo ở một thời điểm khác nhau trong một vòng quét; thiếu time offset thì không deskew được.'),

  q.multi('05', 2, 'Kiểm tra nhanh nào nên làm với một khung point cloud? (chọn nhiều)',
    ['Đếm số điểm', 'Tìm NaN/Inf', 'Min/max khoảng cách', 'Mật độ theo góc', 'Phân bố intensity và tính nhất quán frame_id/timestamp'],
    ['Đổi learning rate'],
    'Đây là sanity check dữ liệu trước khi chọn hay đánh giá mô hình.'),

  q.single('06', 2, 'Khi đọc ROS PointCloud2, giả định nào là sai?',
    'x, y, z, intensity luôn nằm liền nhau trong bộ đệm',
    ['Cần kiểm tra point_step, offsets, endian', 'Nên kiểm tra frame_id có trong TF tree', 'Nên kiểm tra timestamp tăng dần'],
    'PointCloud2 là bộ đệm nhị phân + fields/offset/point_step. Không giả định các trường liền nhau; không lặp từng điểm bằng Python khi có hơn 100k điểm.'),

  q.multi('07', 2, 'Những lỗi data loader nào được nêu là hay gặp? (chọn nhiều)',
    ['Dùng width × height mà quên row_step', 'Đọc intensity sai offset', 'Đổi kích thước ảnh mà không scale intrinsic', 'Đổi dataset nhưng giữ quy ước hộp cũ'],
    ['Dùng float32 cho toạ độ'],
    'Đọc point cloud sai là tạo benchmark giả; phần I/O thường tốn thời gian debug hơn phần kiến trúc.'),

  q.single('08', 2, 'File .bin của KITTI thường chứa gì?',
    'float32 [x, y, z, reflectance]; cần file calibration để chiếu Velodyne sang camera',
    ['Ảnh RGB nén JPEG', 'Danh sách hộp 3D đã gán nhãn', 'Bản đồ HD của thành phố'],
    'PCD/PLY/NPY dễ xem bằng Open3D/PCL/Rerun nhưng phải giữ metadata: frame, timestamp, calibration, class map.'),

  q.single('09', 2, 'Hệ trục camera pinhole thường dùng có quy ước nào?',
    'x sang phải, y xuống dưới, z hướng tới trước',
    ['x tới trước, y sang trái, z lên trên', 'x lên trên, y tới trước, z sang phải', 'Tuỳ ý, không cần quy ước'],
    'LiDAR thì "x forward? y left? z up?" tuỳ driver và dataset; vì vậy mọi thứ phải về cùng một hệ trước khi học.'),

  q.single('10', 1, 'Bài test 5 phút cho hệ trục là gì?',
    'Lấy một điểm cách xe 10 m phía trước: sau biến đổi vẫn ở phía trước ego, chiếu lên camera nằm trong ảnh và có độ sâu dương',
    ['Train mô hình 1 epoch và xem loss', 'Đếm số lớp trong dataset', 'Đo FPS của camera'],
    'Nếu điểm dễ kiểm này sai, dừng mô hình lại để debug biến đổi.'),

  q.multi('11', 2, 'Checklist hệ trục gồm những gì? (chọn nhiều)',
    ['Tên frame trong TF tree rõ ràng', 'Đơn vị là mét/radian', 'Thứ tự biến đổi được test bằng một điểm dễ kiểm', 'Yaw của hộp được chuẩn hoá theo dataset'],
    ['Mọi cảm biến phải cùng tần số'],
    'Bốn mục trong "Checklist frame" của slide.'),

  q.order('12', 2, 'Sắp xếp các bước tiền xử lý trước khi đưa vào detector.', [
    'Cắt vùng (crop range)',
    'Bỏ điểm lỗi (NaN, inf)',
    'Bù chuyển động (deskew)',
    'Bỏ mặt đường / ROI (tuỳ chọn)',
    'Gộp nhiều lần quét (multi-sweep)',
    'Voxel hoá',
  ], 'Mỗi bước có đánh đổi: độ trễ, recall vật nhỏ, độ bền và bộ nhớ.'),

  q.match('13', 1, 'Ghép lỗi tiền xử lý với hậu quả.', [
    ['Cắt vùng quá hẹp', 'Bỏ sót người đi bộ, xe đạp ở rìa'],
    ['Không deskew', 'Xe quay nhanh làm vật bị kéo dài, hộp lệch'],
    ['Gộp nhiều lần quét sai pose', 'Vật ma, vật nhân đôi'],
    ['Voxel quá lớn', 'Nhanh nhưng mất vật nhỏ'],
    ['Voxel quá nhỏ', 'Chính xác hơn nhưng bộ nhớ và độ trễ tăng vọt'],
  ], 'Thực chiến: lưu config tiền xử lý cùng checkpoint. Đổi voxel_size, point_cloud_range hoặc class mapping thì kết quả không còn so sánh công bằng.'),

  q.tf('14', 1, 'Đổi voxel_size hoặc point_cloud_range nhưng giữ nguyên checkpoint cũ thì kết quả vẫn so sánh công bằng với trước.', false,
    'Sai. Config tiền xử lý phải đi cùng checkpoint; đổi các tham số này là đổi điều kiện so sánh.'),

  q.match('15', 2, 'Ghép kiểu suy giảm point cloud với nguyên nhân.', [
    ['Range dropout', 'Vật xa, mặt hấp thụ, mưa sương làm giảm mật độ'],
    ['Motion smear', 'Ego-motion, cảm biến quay, thiếu thời gian từng điểm'],
    ['Calibration drift', 'Cảm biến rung, giá đỡ lỏng, nhiệt độ thay đổi'],
    ['Bandwidth drop', 'Mất gói, nén, tràn hàng đợi driver'],
  ], 'Ngoài ra còn occlusion (xe lớn che người) và bề mặt kính/phản xạ (multipath, phản xạ sai). Đừng chỉ benchmark trên ngày nắng và cảm biến sạch.'),

  q.single('16', 1, 'Chọn cách biểu diễn point cloud thực chất là chọn gì?',
    'Đánh đổi giữa độ chi tiết, độ trễ, bộ nhớ và khả năng triển khai',
    ['Chọn dataset', 'Chọn số lớp đối tượng', 'Chọn màu hiển thị'],
    'Không có biểu diễn nào thắng mọi tình huống; cần biết chọn baseline nhanh và đọc paper/model zoo.'),

  q.match('17', 1, 'Ghép cách biểu diễn với điểm mạnh.', [
    ['Point-based', 'Giữ hình học tốt, chính xác'],
    ['Voxel / sparse conv', 'Chính xác, khai thác tính cục bộ'],
    ['Pillar / BEV', 'Rất nhanh, dùng được CNN 2D'],
    ['Range image', 'Hiệu quả cho từng đường quét'],
    ['BEV fusion', 'Hợp với planner, tracking, hợp nhất'],
  ], 'Điểm yếu tương ứng: khó gom batch; bộ nhớ tăng theo độ phân giải; mất chi tiết chiều đứng; méo do chiếu và che khuất; cần hiệu chuẩn và đồng bộ tốt.'),

  q.single('18', 2, 'Điểm yếu chính của biểu diễn pillar/BEV là gì?',
    'Mất chi tiết theo chiều đứng',
    ['Rất chậm', 'Không dùng được CNN 2D', 'Không chạy được realtime'],
    'Pillar gộp cả chiều cao thành một cột, nên nhanh nhưng có thể kém với vật nhỏ hoặc cảnh nhiều tầng.'),

  q.single('19', 2, 'Trong ADAS, mô hình point-based thường xuất hiện ở đâu?',
    'Ở bước tinh chỉnh hộp hoặc phân đoạn; detector chính thường dùng voxel/pillar để đạt độ trễ',
    ['Làm detector chính vì nhanh nhất', 'Chỉ dùng để xem dữ liệu', 'Thay thế hoàn toàn camera'],
    'Point-based giữ chi tiết nhưng sampling có thể làm mất vật nhỏ, batch nhỏ, khó đạt realtime khi input lớn.'),

  q.single('20', 2, 'Câu hỏi debug quan trọng với mô hình point-based là gì?',
    'Sau sampling, lớp hiếm / vật nhỏ còn đủ điểm không?',
    ['Ảnh có đủ sáng không?', 'Radar có bóng ma không?', 'Learning rate có quá lớn không?'],
    'Sampling (lấy mẫu điểm) giảm số điểm để chạy nhanh hơn, nhưng có thể xoá mất vật nhỏ.'),

  q.order('21', 2, 'Sắp xếp luồng của detector dùng voxel + sparse convolution.', [
    'Điểm thô XYZI',
    'Voxel hoá (lưới 3D)',
    'Backbone sparse conv 3D',
    'Làm phẳng thành BEV',
    'Đầu dò hộp 3D + lớp',
  ], 'Voxel hoá biến dữ liệu thưa thành tensor có cấu trúc; điểm yếu là phải chọn voxel size và vùng cắt.'),

  q.match('22', 2, 'Ghép tham số voxel với tác động chính.', [
    ['voxel_size', 'Độ phân giải đổi lấy bộ nhớ/độ trễ'],
    ['point_cloud_range', 'Vùng học và vùng đánh giá'],
    ['max_points_per_voxel', 'Giữ chi tiết hay cắt bớt'],
    ['max_voxels', 'Bị cắt bớt khi cảnh đông'],
  ], 'Thực chiến: thay voxel_size mà không benchmark độ trễ và lát vật nhỏ là chưa đủ bằng chứng.'),

  q.fill('23', 2, 'Vùng cắt từ −50 m tới 50 m, voxel 0,2 m. Có bao nhiêu ô theo một trục?', ['500'],
    'N = (x_max − x_min) / v = 100 / 0,2 = 500. Voxel 0,1 m cho 1000 ô mỗi trục, tức gấp 4 lần số ô trên BEV.'),

  q.single('24', 1, 'Pillar khác voxel ở điểm nào?',
    'Pillar không chia theo chiều cao z; cả cột thành một ô trên mặt đất',
    ['Pillar chia nhỏ hơn voxel theo mọi trục', 'Pillar chỉ dùng cho camera', 'Pillar là tên khác của range image'],
    'PointPillars: pillar = voxel không chia theo z; tạo ảnh giả BEV rồi dùng CNN 2D.'),

  q.order('25', 1, 'Sắp xếp luồng của PointPillars.', [
    'Lưới pillar (ô x–y)',
    'Bộ mã hoá PointNet cho mỗi pillar',
    'Ảnh giả (pseudo-image) BEV',
    'Backbone CNN 2D',
    'Đầu SSD/anchor ra hộp 3D',
  ], 'PointPillars là baseline nhanh, dễ chạy demo, có sẵn checkpoint và config trong nhiều codebase.'),

  q.single('26', 2, 'AP của người đi bộ, xe đạp thấp khi chạy PointPillars. Theo bài, nên kiểm tra gì trước?',
    'Mật độ điểm, vùng cắt và augmentation; xem độ phủ input/BEV',
    ['Đổi ngay sang mô hình lớn hơn', 'Tăng số epoch gấp đôi', 'Bỏ lớp người đi bộ khỏi đánh giá'],
    'Debug thực tế: visualize BEV feature/độ phủ input trước khi đổi mô hình.'),

  q.single('27', 1, 'Đầu dò theo tâm (CenterPoint) khác cách dùng anchor ở điểm nào?',
    'Dò tâm vật trên heatmap BEV rồi hồi quy kích thước, z, yaw, vận tốc, thay vì liệt kê mọi hộp neo',
    ['Dò từng điểm LiDAR một', 'Chỉ dùng ảnh camera', 'Không cần BEV'],
    'Center-based head đơn giản hoá detection và tracking trong BEV.'),

  q.single('28', 2, 'Vì sao CenterPoint dễ nối với tracking?',
    'Có thể ghép đối tượng giữa các khung bằng tâm gần nhất (closest-center matching)',
    ['Vì nó không cần hiệu chuẩn', 'Vì nó chỉ phát hiện một lớp', 'Vì nó không dùng vận tốc'],
    'Nhiều baseline nuScenes/Waymo dựa trên ý tưởng center-based.'),

  q.multi('29', 2, 'Khi debug CenterPoint, nên nhìn những gì? (chọn nhiều)',
    ['Tâm trên heatmap có lệch không', 'Yaw có bị quấn quanh ±π không', 'Vận tốc từ nhiều lần quét có đúng hệ và đúng thời gian không'],
    ['Màu của ảnh camera', 'Số GPU trong cụm'],
    'Ba điểm cần nhìn khi debug trong slide CenterPoint.'),

  q.tf('30', 1, 'Output của detector 3D trong sản phẩm thường đi thẳng vào planner mà không cần xử lý thêm.', false,
    'Sai. Output cần gating, tracking, sensor fusion và ràng buộc an toàn trước khi tới planner.'),

  q.single('31', 1, 'Trạng thái hộp 3D phổ biến gồm những gì?',
    'x, y, z, dx, dy, dz, yaw, cộng lớp, điểm, vận tốc, thuộc tính',
    ['Chỉ x, y và chiều rộng', 'Bốn góc của hộp trên ảnh', 'Chỉ tâm và lớp'],
    'Một số dataset dùng z ở tâm hộp, một số dùng tâm đáy.'),

  q.match('32', 1, 'Ghép lỗi quy ước hộp với dấu hiệu.', [
    ['Lẫn tâm hộp và tâm đáy (z)', 'Hộp lơ lửng hoặc chui xuống đất'],
    ['Sai trục yaw', 'Hộp xoay 90° hoặc 180°'],
    ['Sai class mapping', 'AP tụt ở một lớp, confusion lạ'],
    ['Lẫn đơn vị cm/m', 'Hộp khổng lồ hoặc siêu nhỏ'],
  ], 'Phát hiện nhanh: xem side view + mặt đất; test một vật thẳng trước xe; in id → tên lớp; kiểm min/max kích thước.'),

  q.single('33', 2, 'Xe trong kết quả bị xoay 90° và có kích thước cao/rộng bất thường sau khi đổi công cụ. Nghi gì?',
    'Thứ tự kích thước dx, dy, dz bị đảo khi đổi tool',
    ['Camera bị chói', 'Radar sinh bóng ma', 'Mô hình quá khớp'],
    'Dimension order có thể bị swap khi đổi tool; dấu hiệu là xe xoay 90° hoặc hộp cao/rộng bất thường.'),

  q.fill('34', 3, 'Yaw = 3,3 rad. Sau khi chuẩn hoá về (−π, π] bằng atan2(sin, cos), yaw bằng bao nhiêu? (làm tròn 2 chữ số thập phân)', ['-2,98', '-2.98', '−2,98', '−2.98'],
    '3,3 − 2π ≈ −2,98 rad. Heading quấn tại ±π; không chuẩn hoá thì hai hộp cùng hướng bị coi là lệch gần 2π.'),

  q.match('35', 2, 'Ghép dataset với thứ học tốt nhất từ nó.', [
    ['KITTI', 'Chiếu LiDAR–camera, hộp 3D cơ bản, demo nhanh'],
    ['nuScenes', 'Nhiều lần quét, radar/camera/LiDAR, NDS'],
    ['Waymo', 'Quy mô lớn, đuôi dài, nhãn 3D/2D, tracking'],
    ['Log robot/drone của đội', 'Miền thật, độ trễ và sức tính thật'],
  ], 'Lưu ý: KITTI ít cảnh, file calibration quan trọng; nuScenes keyframe 2 Hz, metric phức tạp hơn; Waymo định dạng nặng; log riêng thiếu nhãn, cần auto-label/QA.'),

  q.tf('36', 1, 'Có thể so sánh trực tiếp kết quả hai paper dù khác split, vùng cắt point cloud, bảng lớp hoặc script đánh giá.', false,
    'Sai. Không so sánh paper nếu khác dataset split, point cloud range, class map, sensor config, số sweep hoặc evaluation script.'),

  q.single('37', 2, 'KITTI-style AP được tính theo những trục nào?',
    'Theo 2D/BEV/3D, ngưỡng IoU, lớp và độ khó',
    ['Chỉ theo độ trễ', 'Theo vận tốc và thuộc tính', 'Theo số lần quét'],
    'Hữu ích để học detector 3D truyền thống.'),

  q.single('38', 1, 'nuScenes NDS khác mAP ở điểm nào?',
    'Kết hợp mAP với các lỗi vị trí, kích thước, hướng, vận tốc, thuộc tính',
    ['Chỉ đo độ trễ', 'Chỉ dùng cho camera', 'Không quan tâm vận tốc'],
    'NDS hợp hơn cho perception AV đa nhiệm.'),

  q.fill('39', 3, 'NDS = (5·mAP + Σ(1 − lỗi)) / 10 với 5 loại lỗi. Nếu mAP = 0,6 và cả năm lỗi đều bằng 0,3 thì NDS bằng bao nhiêu?', ['0,65', '0.65'],
    '5 × 0,6 = 3; 5 × (1 − 0,3) = 3,5; (3 + 3,5) / 10 = 0,65.'),

  q.multi('40', 1, 'Báo cáo benchmark thực chiến nên có những lát (slice) nào? (chọn nhiều)',
    ['Khoảng cách 0–20 / 20–50 / trên 50 m', 'Lớp: xe, người đi bộ, xe đạp gần ego', 'Che khuất, vật nhỏ', 'Đêm, mưa, sương, hiệu chuẩn trôi'],
    ['Tên người gán nhãn'],
    'mAP cao chưa chắc đủ an toàn cho use-case; metric phải đọc cùng lát và failure case. Thêm metric triển khai: độ trễ p50/p95, rớt khung, false positive gần ego, độ ổn định tracking.'),

  q.order('41', 2, 'Sắp xếp cách bắt đầu với model zoo / codebase có sẵn.', [
    'Chọn dataset (mini split)',
    'Chạy demo, xem hộp',
    'Đọc config (vùng, voxel, lớp)',
    'Benchmark độ trễ + mAP',
    'Stress test (dropout, hiệu chuẩn trôi)',
  ], 'Đừng tự train từ đầu khi mục tiêu là học pipeline; chọn checkpoint sẵn, chạy demo, hiểu config rồi mới thay dataset/model.'),

  q.match('42', 2, 'Ghép codebase với đặc điểm.', [
    ['MMDetection3D', 'Bộ công cụ OpenMMLab cho phát hiện 3D, hỗ trợ LiDAR/camera/đa cảm biến'],
    ['OpenPCDet', 'Codebase PyTorch cho phát hiện 3D bằng LiDAR, tách data và model'],
    ['Autoware CenterPoint', 'Gần sản phẩm: vào PointCloud2, ra DetectedObjects, chạy TensorRT'],
  ], 'Gợi ý lớp học: dùng checkpoint + sample data để tập debug và benchmark trước, không dành 2 giờ chỉ để setup training.'),

  q.order('43', 1, 'Sắp xếp pipeline chiếu điểm LiDAR lên ảnh camera.', [
    'Điểm LiDAR (XYZI)',
    'Biến đổi bằng extrinsic T_cam_lidar',
    'Điểm trong hệ camera, giữ độ sâu > 0',
    'Áp intrinsic K và méo ống kính',
    'Pixel (u, v) nằm trong ảnh',
    'Phủ lên ảnh để kiểm tra',
  ], 'Projection là bài test hiệu chuẩn rẻ và hữu ích: nếu point cloud không bám vào ảnh, mọi hợp nhất/gán nhãn phía sau đều đáng nghi.'),

  q.single('44', 1, 'Trong s·[u, v, 1]ᵀ = K·[R | t]·[x, y, z, 1]ᵀ, [R | t] là gì?',
    'Extrinsic: phép quay và tịnh tiến từ hệ LiDAR sang hệ camera',
    ['Intrinsic của camera', 'Độ phân giải ảnh', 'Ma trận nhầm lẫn của detector'],
    'K là intrinsic (tiêu cự, tâm ảnh); s là độ sâu theo trục camera.'),

  q.fill('45', 2, 'fx = 500, cx = 320. Một điểm trong hệ camera có X = 1 m, Z = 10 m. Toạ độ u bằng bao nhiêu pixel?', ['370'],
    'u = fx·X/Z + cx = 500 × 0,1 + 320 = 370.'),

  q.fill('46', 2, 'Ảnh được thu nhỏ từ 640 xuống 320 pixel bề ngang. Nếu fx ban đầu là 500, fx mới phải là bao nhiêu?', ['250'],
    'Đổi kích thước ảnh theo hệ số s thì fx, fy, cx, cy đều nhân s: 500 × 0,5 = 250. Quên bước này thì điểm chiếu bay khỏi vật.'),

  q.match('47', 1, 'Ghép lỗi chiếu LiDAR–camera với mô tả.', [
    ['Matrix order', 'Đảo nhầm T_cam_lidar và T_lidar_cam'],
    ['Depth sign', 'Không lọc z_cam ≤ 0, điểm sau camera bị lật ra trước'],
    ['Resize image', 'Không scale fx, fy, cx, cy'],
    ['Distortion', 'Dùng ảnh thô nhưng intrinsic của ảnh đã khử méo'],
    ['Axis convention', 'Camera y xuống nhưng xe z lên'],
  ], 'Checklist 10 lỗi còn có: lệch timestamp, không deskew, lẫn đơn vị, chiếu điểm ngoài FOV, rolling shutter. Projection sai thường không crash, chỉ âm thầm làm hợp nhất hỏng.'),

  q.single('48', 2, 'Trước khi đổ lỗi cho mô hình về projection, bài khuyên làm gì?',
    'Vẽ overlay 5 khung ở nhiều khoảng cách, nhiều góc nhìn và lúc ego chuyển động mạnh',
    ['Train lại toàn bộ mô hình', 'Chỉ kiểm tra một khung lúc xe đứng yên', 'Tăng ngưỡng điểm của detector'],
    'QA trực quan: xe, cột, mép đường phải khớp; QA định lượng: reprojection error, độ khớp cạnh, độ trôi theo thời gian.'),

  q.match('49', 2, 'Ghép cách ghép camera–LiDAR với mô tả.', [
    ['Point painting', 'Chiếu điểm vào ảnh lấy đặc trưng ngữ nghĩa rồi đưa lại detector 3D'],
    ['Frustum-based', 'Detector 2D tạo vùng chóp cụt; LiDAR tinh chỉnh vị trí, kích thước'],
    ['BEV fusion', 'Đưa đặc trưng camera lên BEV rồi ghép với BEV của LiDAR'],
    ['Late fusion', 'Ghép kết quả cuối; dễ tích hợp nhưng khó tận dụng tương tác sâu'],
  ], 'Ghép sớm nhạy với lệch hiệu chuẩn và chất lượng ảnh; BEV fusion tốn compute cho phép biến đổi góc nhìn và cần đồng bộ tốt.'),

  q.order('50', 1, 'Sắp xếp 6 lớp debug khi detector 3D tệ, theo thứ tự nên kiểm tra.', [
    'I/O (trường, offset, frame_id, timestamp)',
    'Hình học (biến đổi, quy ước hộp)',
    'Thời gian (đồng bộ, deskew)',
    'Tiền xử lý (vùng, voxel, class map khớp eval)',
    'Mô hình (checkpoint đúng dataset/lớp)',
    'Metric (lát đúng use-case)',
  ], 'Thứ tự này tiết kiệm thời gian trong dự án thật. 3D perception là hình học + hệ dữ liệu + mô hình + bằng chứng, không chỉ là mạng nơ-ron.'),
]
