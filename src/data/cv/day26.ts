import { maker } from './make'

const q = maker(26)

// Day 26 · Synthetic, Simulated & Trajectory Data
export const day26 = [
  q.single('01', 1, 'Vì sao "chờ" dữ liệu đuôi dài (ví dụ em bé chạy ra từ sau xe lúc chạng vạng, trời mưa) rất đắt?',
    'Số lần gặp theo mô hình Poisson: với tần suất rất thấp, cần hàng trăm triệu km mới gặp đủ 100 lần',
    ['Vì cảm biến không ghi được cảnh trời mưa', 'Vì luật cấm ghi hình trẻ em', 'Vì cảnh đó luôn bị nhãn sai'],
    'Minh hoạ với λ = 0,2 lần/triệu km: cần khoảng 498 triệu km (trung vị) cho 100 lần. Hôm nay: trồng dữ liệu thay vì chờ nó, mà không tự lừa mình.'),

  q.match('02', 1, 'Ghép bốn cách có dữ liệu mà không cần chờ với công cụ.', [
    ['Dựng', 'Simulator, tài sản 3D'],
    ['Tái dựng', 'NeRF, Gaussian splat'],
    ['Sinh', 'Diffusion, world model'],
    ['Hành vi', 'Quỹ đạo, kịch bản'],
  ], 'Cả bốn hội tụ ở một câu hỏi: đo lợi ích thế nào cho trung thực.'),

  q.tf('03', 2, 'Dữ liệu tổng hợp sẽ thay thế dữ liệu thật.', false,
    'Sai. Nó lấp chỗ dữ liệu thật không với tới, và mỗi bộ sinh có phân phối riêng. Quy tắc: huấn luyện trên hỗn hợp, kết luận chỉ từ test thật độc lập.'),

  q.single('04', 1, 'Vì sao không được đánh giá model trên test set có lẫn dữ liệu sinh?',
    'Test lẫn dữ liệu sinh đo model trên phân phối của bộ sinh, không phải thế giới thật',
    ['Vì dữ liệu sinh không có nhãn', 'Vì test set sẽ quá lớn', 'Vì model sẽ luôn đạt 100%'],
    'Phán quyết cuối về model ngoài đời phải đến từ test thật. Dữ liệu tổng hợp được phép dạy model.'),

  q.match('05', 2, 'Ghép giai đoạn lịch sử dữ liệu tổng hợp với cơ chế mới.', [
    ['Ảnh dựng sẵn (2015)', 'Flow, disparity có nhãn tuyệt đối'],
    ['Game engine (2016)', 'Lấy nhãn từ buffer của game'],
    ['Simulator mở + DR (2017)', 'Ngẫu nhiên hoá thay vì làm thật'],
    ['Tái dựng thần kinh (2020–24)', 'Log thật → cảnh vẽ lại được'],
    ['Mô hình sinh (2023–26)', 'Nhãn trở thành điều kiện'],
  ], 'Giai đoạn 2018–20 thu hẹp khoảng cách bằng thích nghi ảnh, bố cục, cảm biến.'),

  q.multi('06', 2, 'Những nhãn nào người gán nhãn gần như không gán nổi, nhưng bộ dựng tổng hợp cho miễn phí? (chọn nhiều)',
    ['Độ sâu từng pixel', 'Optical flow', 'Vận tốc chính xác'],
    ['Tên class của ô tô', 'Box 2D quanh người đi bộ'],
    'Người gán được box (chậm) và mask (rất chậm). Bộ dựng cho box chính xác cả vật bị che, mask, độ sâu, flow, vận tốc từ chính mô phỏng.'),

  q.single('07', 2, 'Kết quả Richter 2016 cho thấy gì về dữ liệu game?',
    'Chỉ ⅓ dữ liệu CamVid thật + 25k ảnh từ game đã vượt toàn bộ CamVid',
    ['Dữ liệu game làm model tệ hơn', 'Cần gấp 10 lần dữ liệu thật để bù dữ liệu game', 'Game chỉ có ích cho phân loại ảnh'],
    'Các con số khác: 1,5 cm sai số định vị chỉ học từ simulator ngẫu nhiên hoá (Tobin 2017); bớt tới 70% dữ liệu thật mà detector không giảm (Burdorf 2022).'),

  q.single('08', 1, 'Ảnh tổng hợp "trông giả" (domain randomization) có học kém hơn ảnh "trông thật"?',
    'Không nhất thiết: độ phủ quan trọng hơn vẻ thật; DR fine-tune thêm 6 000 ảnh thật đạt 98,5 AP, hơn chỉ dùng thật 2,1 điểm',
    ['Có, ảnh trông giả luôn tệ hơn', 'Ảnh trông giả chỉ có ích cho LiDAR', 'Ảnh trông thật luôn đủ, không cần fine-tune'],
    'Trước fine-tune, VKITTI (trông thật) cao hơn DR. Công thức an toàn nhất: pretrain tổng hợp, fine-tune thật (Tremblay et al., CVPRW 2018).'),

  q.match('09', 1, 'Sim2real gồm ba khoảng cách. Ghép khoảng cách với công cụ sửa.', [
    ['Ngoại hình (texture, ánh sáng, vật liệu)', 'DR, CyCADA, photoreal CNN'],
    ['Nội dung & hành vi (bố cục, ai đi đâu khi nào)', 'Structured DR, Meta-Sim, log-replay'],
    ['Mô hình cảm biến (nhiễu, raydrop, blooming, rolling shutter)', 'LiDARsim, NeuRAD, đo cảm biến thật'],
  ], '"Ảnh giả trông không thật" chỉ là một phần. Chẩn đoán trước: lỗi rơi vào ngoại hình, nội dung hay cảm biến?'),

  q.single('10', 2, 'LiDAR mô phỏng hoàn hảo, không mất tia nào. Vì sao đó lại là lỗi?',
    'LiDAR thật mất tia trên kính, sơn đen, ở xa; model học từ dữ liệu "hoàn hảo" sẽ lệch khi gặp dữ liệu thật',
    ['Vì LiDAR mô phỏng chạy quá chậm', 'Vì không có tia nào thì không có nhãn', 'Vì LiDAR thật có nhiều tia hơn mô phỏng'],
    'Đây là khoảng cách cảm biến. Sửa bằng mô hình cảm biến học từ dữ liệu thật.'),

  q.single('11', 2, 'Độ rộng ngẫu nhiên hoá (DR) nên chọn thế nào?',
    'Quá hẹp thì không phủ thế giới thật, quá rộng thì phí mẫu; và với nhiều tham số, hộp ngẫu nhiên hoá phình theo lũy thừa số chiều',
    ['Càng rộng càng tốt, không có giá', 'Càng hẹp càng tốt để mẫu giống nhau', 'Luôn chọn đúng phân phối đều trên [0, 1]'],
    'Minh hoạ 3 trục: chỉ 32% mẫu sim rơi gần cảnh thật so với 85% nếu chỉ 1 chiều. ADR (phần robot) tự chọn độ rộng theo năng lực policy.'),

  q.single('12', 2, 'Structured DR (đặt vật theo ngữ cảnh: xe trên làn, khoảng cách hợp lý) so với DR thuần trên ca khó thế nào?',
    'AP ca khó tăng từ 24,0 lên 52,2, gấp đôi',
    ['Ngang bằng DR thuần', 'Tệ hơn vì ít ngẫu nhiên hơn', 'Chỉ tăng ở ca dễ'],
    'Ngẫu nhiên có cấu trúc thắng mọi cách khác: xe nằm trên đường, không lơ lửng giữa trời (Prakash et al., ICRA 2019).'),

  q.single('13', 3, 'CyCADA (thích nghi ảnh và đặc trưng) cải thiện mIoU từ game sang Cityscapes bao nhiêu?',
    '17,9 → 35,4',
    ['35,4 → 17,9', '50,0 → 52,0', '17,9 → 19,0'],
    'Sửa ngoại hình sau khi vẽ: dịch ảnh sang phong cách thật nhưng giữ hình học để nhãn còn đúng. G-buffer (Richter 2021) đọc cả buffer trung gian của renderer.'),

  q.single('14', 1, 'LiDARsim cho thấy điều gì về mô phỏng raydrop?',
    'Vị trí tia mất quan trọng hơn số lượng: raydrop học từ dữ liệu thật (71,6) áp sát raydrop thật (72,3), còn ngẫu nhiên chỉ 69,4',
    ['Không mô phỏng raydrop là tốt nhất', 'Raydrop ngẫu nhiên tốt ngang raydrop thật', 'Raydrop không ảnh hưởng AP'],
    'AP@0,7 trên dữ liệu thật: không raydrop 69,2; ngẫu nhiên 69,4; học 71,6; GT 72,3; train trên thật 75,2.'),

  q.single('15', 1, 'Real2Sim (tái dựng từ log thật) cho lợi ích gì, và hạn chế gì nếu chỉ replay track?',
    'Ghi một lần, chỉnh sửa và vẽ lại vô số lần với nhãn đi kèm; nhưng replay track thì xe khác không phản ứng khi ta đổi đường',
    ['Không cần log thật; nhưng tốn nhiều GPU', 'Tạo được mọi cảnh chưa từng thấy; không có hạn chế', 'Chỉ dùng được cho camera; không cho LiDAR'],
    'Nhãn đi kèm vì ta biết hình học (độ sâu, LiDAR, mask, flow, box từ track). Cần mô hình hành vi (phần 06) để xe khác phản ứng.'),

  q.match('16', 1, 'Ghép cách lưu cảnh với đặc điểm (cùng benchmark).', [
    ['NeRF', 'Hỏi MLP dọc từng tia, ẩn trong trọng số: 0,06 FPS, huấn luyện 48 h'],
    ['3D Gaussian Splatting', 'Hàng triệu Gaussian tường minh, raster hoá: 134 FPS, huấn luyện 41 phút'],
  ], 'PSNR của 3DGS chỉ thấp hơn ~0,5 dB, nên driving chuyển sang splatting: nhanh hơn và dễ chỉnh sửa hơn.'),

  q.single('17', 2, 'Khi dời camera xa khỏi quỹ đạo đã ghi (ví dụ lệch làn 2 m → 3 m), chất lượng ảnh vẽ lại thay đổi thế nào?',
    'Tệ đi (FID tăng); thêm prior từ mô hình sinh giúp vá vùng chưa từng thấy',
    ['Tốt lên vì góc nhìn mới', 'Không đổi vì cảnh 3D đầy đủ', 'Chỉ đổi màu, hình học giữ nguyên'],
    'UniSim: FID 74,7 (2 m) → 97,5 (3 m). StreetCrafter thêm prior sinh giảm FID rõ. Hai bài báo, hai giao thức: chỉ so trong từng bài.'),

  q.multi('18', 2, 'Tái dựng thường gãy ở đâu? (chọn nhiều)',
    ['Vùng chưa từng nhìn thấy', 'Kính, mặt phản chiếu', 'Người: dáng đi, chân tay', 'Blur, rolling shutter trong log'],
    ['Mặt đường phẳng đã được ghi kỹ', 'Toà nhà tĩnh nhìn từ góc đã ghi'],
    'Đi kèm miễn phí: độ sâu, LiDAR vẽ lại, mask tĩnh/động, flow, box từ track, góc camera mới.'),

  q.single('19', 2, 'Trong diffusion x_t = √ᾱ_t·x₀ + √(1 − ᾱ_t)·ε, phần nào là việc khó mô hình phải học?',
    'Đi ngược: khử nhiễu từ x_t về x₀; làm nhiễu thì dễ',
    ['Thêm nhiễu Gauss vào ảnh sạch', 'Chọn lịch cosine cho ᾱ', 'Tính căn bậc hai của ᾱ'],
    'Điều kiện (box, bản đồ, camera) không bị nhiễu: nó dẫn hướng quá trình khử nhiễu.'),

  q.single('20', 1, 'Với MagicDrive (box 3D, bản đồ BEV, camera vào → sáu góc nhìn ra), nhãn của ảnh sinh đến từ đâu?',
    'Chính là các điều kiện đầu vào: nhãn có trước ảnh; câu hỏi còn lại là ảnh có tôn trọng nhãn không',
    ['Người gán nhãn lại toàn bộ ảnh sinh', 'Một detector chạy trên ảnh sinh', 'Không có nhãn, chỉ dùng để pretrain'],
    'Vì vậy cần cổng kiểm tra: vật sinh ra có nằm đúng chỗ box nói không (ví dụ detector độc lập tìm lại, so IoU — thiết kế đề xuất, chưa có chuẩn công bố).'),

  q.single('21', 1, 'Bài báo báo "+2 NDS nhờ dữ liệu sinh". Câu hỏi đầu tiên nên hỏi là gì?',
    'Baseline có được cùng ngân sách huấn luyện (cùng số bước, batch, kiến trúc) không?',
    ['FID của bộ sinh là bao nhiêu?', 'Ảnh sinh có đẹp không?', 'Bộ sinh có bao nhiêu tham số?'],
    'Pretrain trên dữ liệu sinh rồi fine-tune trên thật nghĩa là model học gấp đôi epoch. MagicDrive Bảng 6: cho baseline gấp đôi epoch, lợi ích còn +0,74 (camera) và +0,03 (cam + LiDAR).'),

  q.single('22', 2, 'Vì sao FID đẹp không có nghĩa là nhãn của dữ liệu sinh đúng?',
    'FID chỉ so phân phối ảnh, không biết box ở đâu',
    ['FID chỉ đo được trên video', 'FID càng thấp thì nhãn càng sai', 'FID tính trên nhãn chứ không trên ảnh'],
    'FID nhạy với độ phân giải, cách cắt; FVD gần như bỏ qua lỗi thời gian. Đo bằng nhiệm vụ: train thật + sinh, test trên thật, cùng ngân sách, theo slice, tìm lại box bằng detector độc lập.'),

  q.multi('23', 1, 'Giao thức đo lợi ích của dữ liệu sinh gồm những luật nào? (chọn nhiều)',
    ['Test set chỉ chứa dữ liệu thật, đóng băng trước khi sinh', 'Baseline cùng kiến trúc, cùng số bước huấn luyện', 'Báo cáo trên slice được sinh cho và các slice cần giữ', 'Nhiều seed, khoảng tin cậy theo scene; ghi lineage bộ sinh'],
    ['Báo cáo FID thay cho mAP', 'Test trên hỗn hợp thật + sinh cho đủ lớn'],
    'Năm luật; luật cuối là ghi lineage: phiên bản bộ sinh, điều kiện, bộ lọc.'),

  q.single('24', 2, 'Bằng chứng nào thuyết phục nhất rằng dữ liệu sinh có ích?',
    '+1,5 mAP ở slice mưa đêm, test thật, cùng số bước huấn luyện, 3 seed',
    ['FID của bộ sinh giảm từ 25 xuống 16', 'mAP tăng 4 điểm trên test set gồm thật + sinh', 'Ảnh sinh đẹp đến mức người xem không phân biệt được'],
    'Chỉ phương án này đo bằng nhiệm vụ, trên dữ liệu thật, với baseline công bằng và nhiều seed.'),

  q.order('25', 2, 'Sắp xếp quy trình chưng cất tập quỹ đạo từ log.', [
    'Log cảm biến (camera, LiDAR, radar)',
    'Auto-label offline (hai chiều thời gian)',
    'Track + smooth (ID, RTS smoother)',
    'Cắt mẫu (lịch sử, tương lai, map)',
    'Cổng chất lượng (động học, liên tục, map)',
  ], 'Kết quả: tập quỹ đạo có phiên bản, gắn lineage về log gốc. Quỹ đạo không được thu thập: chúng được chưng cất từ log, kèm mọi lỗi của tracker.'),

  q.single('26', 2, 'Một lần ID switch ảnh hưởng thế nào tới dữ liệu quỹ đạo?',
    'Một quỹ đạo thành hai mẩu cụt, model forecasting học rằng xe có thể biến mất; sửa bằng nối lại offline với gating Mahalanobis',
    ['Không ảnh hưởng vì quỹ đạo vẫn liên tục', 'Làm quỹ đạo dài gấp đôi', 'Chỉ làm sai nhãn class'],
    'Ví dụ: xe tải che làm ID 7 "biến mất", ID 12 "xuất hiện". Offline có cả tương lai nên nối được qua khoảng trống.'),

  q.fill('27', 2, 'Gia tốc ước lượng bằng sai phân hai lần có std = √6·σ/Δt². Với σ = 0,10 m và Δt = 0,1 s, std bằng bao nhiêu m/s²? (1 chữ số thập phân)', ['24,5', '24.5'],
    '√6 ≈ 2,449; 2,449 × 0,10 / 0,01 = 24,5 m/s² ≈ 2,5 g. Một lần chuyển làn thật chỉ cần khoảng 1 m/s²: nhiễu lớn gấp hơn 20 lần tín hiệu.'),

  q.single('28', 1, 'Vì vậy, khi tính gia tốc từ track, nên làm gì?',
    'Làm mượt trước rồi mới lấy đạo hàm',
    ['Lấy đạo hàm trực tiếp ở tần số cao nhất có thể', 'Bỏ qua gia tốc, chỉ dùng vị trí', 'Giảm Δt xuống càng nhỏ càng tốt'],
    'Phương sai sai số = (1² + 2² + 1²)σ²/Δt⁴ = 6σ²/Δt⁴. Giảm Δt làm nhiễu tăng theo 1/Δt², càng tệ.'),

  q.match('29', 2, 'Ghép phép kiểm của cổng khả thi với lỗi nó bắt.', [
    ['Gia tốc |a| ≤ ~μg sau làm mượt', 'Box rung'],
    ['Jerk |da/dt|', 'Nối nhầm track'],
    ['Độ cong κ ≤ κ_max', 'Heading lật 180°'],
    ['Gia tốc ngang v²κ', 'Vào cua "không thể"'],
    ['Bản đồ: tâm xe trong vùng lái được', 'Sai calib, sai pose'],
  ], 'Phép kiểm thứ sáu: liên tục (khoảng trống đã nối chưa) bắt ID switch.'),

  q.single('30', 2, 'Mô hình xe đạp với δ_max = 35°, L = 2,8 m cho κ_max và bán kính quay nhỏ nhất bao nhiêu?',
    'κ_max ≈ 0,25 m⁻¹, R_min ≈ 4 m',
    ['κ_max ≈ 2,5 m⁻¹, R_min ≈ 0,4 m', 'κ_max ≈ 0,025 m⁻¹, R_min ≈ 40 m', 'κ_max ≈ 1 m⁻¹, R_min ≈ 1 m'],
    'κ_max = tan δ_max / L = tan 35° / 2,8 ≈ 0,7/2,8 = 0,25. Các giá trị là minh hoạ cho xe con.'),

  q.single('31', 1, 'Cùng độ cong κ = 0,05: khả thi ở 5 m/s nhưng bất khả thi ở 15 m/s. Vì sao?',
    'Gia tốc ngang v²κ ở 15 m/s là 11,3 m/s², vượt μg ≈ 8–9 m/s²',
    ['Vì độ cong thay đổi theo tốc độ', 'Vì ở 15 m/s xe không thể rẽ', 'Vì gia tốc ngang không phụ thuộc tốc độ'],
    '15² × 0,05 = 11,25 m/s². Cổng phải xét độ cong và tốc độ cùng lúc.'),

  q.single('32', 2, 'Mẫu nào nên gửi đi xem lại thay vì xoá?',
    'Xe con giảm tốc −7 m/s² đều trong 1,5 s, quỹ đạo mượt',
    ['Xe con quay 180° trong một khung hình', 'Người đi bộ đi 25 m/s suốt 3 giây', 'Tâm xe tải nằm trên mái một toà nhà'],
    'Phanh gấp −7 m/s² mượt là hiếm nhưng khả thi (dưới μg): dữ liệu quý. Ba mẫu kia vật lý bất khả thi: lỗi tracker hoặc calib. Cổng khả thi tách "không thể" khỏi "hiếm".'),

  q.single('33', 2, 'Tăng nhịp một quỹ đạo rẽ lên ×1,2 để mở rộng dữ liệu thì gia tốc ngang thay đổi thế nào?',
    'Tăng ×1,44 (vì a_lat = v²κ), có thể không còn khả thi',
    ['Tăng ×1,2', 'Không đổi', 'Giảm ×1,44'],
    'Mỗi biến thể phải qua cổng khả thi. Một phép mở rộng tạo mẫu bất khả thi là đang dạy model sai vật lý.'),

  q.single('34', 1, 'Cân bằng lại về phía thao tác hiếm (quay đầu 0,5%) bằng cách lặp mẫu có nhược điểm gì?',
    'Không thêm thông tin: ESS = (Σw)²/Σw² tụt mạnh; cần mẫu mới thật',
    ['Làm model quên hoàn toàn đi thẳng', 'Tăng ESS lên gấp đôi', 'Không có nhược điểm nào'],
    'Trọng số w_c ∝ p_c^(−α) (α = 0 giữ nguyên, 1 là đều). Mẫu lặp chỉ là cùng một thông tin nhân lên.'),

  q.match('35', 3, 'Ghép tập quỹ đạo mở với quy mô.', [
    ['Waymo Open Motion', '100k+ cảnh, 570+ h, mỗi mẫu 20 s @ 10 Hz'],
    ['Argoverse 2 Motion', '250k kịch bản, 6 thành phố, 11 s @ 10 Hz'],
    ['nuPlan', '1 282 h, 4 thành phố'],
    ['highD (drone)', '16,5 h, 110k xe, chỉ 5 600 lần chuyển làn'],
  ], 'Ngay cả tập lớn cũng hiếm thao tác đặc biệt.'),

  q.tf('36', 2, 'Trên 30 000 giờ log, luật lũy thừa scaling đúng cho cả open-loop lẫn closed-loop.', false,
    'Sai. Luật lũy thừa đúng với open-loop nhưng không đúng với closed-loop (Zheng et al.). Open-loop ≠ closed-loop.'),

  q.match('37', 1, 'Ghép họ sinh hành vi/kịch bản với cách làm.', [
    ['Tìm kiếm đối nghịch (STRIVE, AdvSim, KING, CAT)', 'Nhiễu hoá hành vi đến khi planner thất bại'],
    ['Mô hình sinh hành vi (TrafficGen, VBD, MotionLM, SMART)', 'Học phân phối hành vi rồi lấy mẫu'],
  ], 'Cả hai cần cùng một cổng: hành vi sinh ra phải khả thi động học và trông như người thật.'),

  q.tf('38', 1, 'Một kịch bản cắt làn sinh ra càng nguy hiểm thì càng có ích, kể cả khi nó vượt giới hạn vật lý.', false,
    'Sai. Nguy hiểm mà bất khả thi là dữ liệu độc. Luôn qua cổng khả thi (ví dụ gia tốc ngang dưới μg ≈ 8 m/s²).'),

  q.single('39', 2, 'MotionLM biểu diễn chuyển động thế nào?',
    'Mỗi bước 0,5 s thành một token (Δx, Δy) trong bảng từ vựng; transformer đoán token kế tiếp cho mọi xe cùng lúc',
    ['Mỗi xe một ảnh BEV riêng', 'Chuỗi góc lái liên tục', 'Một vector cố định cho cả quỹ đạo'],
    'Token hoá chuyển động biến dự đoán và sinh cảnh tương tác thành một bài toán.'),

  q.multi('40', 2, 'Waymo Sim Agents đo độ "giống người" của hành vi sinh ra theo những nhóm chỉ số nào? (chọn nhiều)',
    ['Động học: phân phối tốc độ, gia tốc', 'Tương tác: khoảng cách xe gần nhất, time-to-collision, va chạm', 'Bản đồ: ra khỏi đường, sai làn'],
    ['Độ đẹp của ảnh render', 'Số tham số của mô hình'],
    'Điểm cuối là likelihood xấp xỉ của đặc trưng hành vi thật dưới histogram từ 32 lần chạy mô phỏng. Realism đo cả phân phối, không chỉ sai số vị trí.'),

  q.single('41', 1, 'MimicGen nhân demo robot bằng cách nào?',
    'Viết lại đoạn thao tác trong khung toạ độ của vật rồi biến đổi theo tư thế vật mới, chạy thử trong simulator và chỉ giữ lần thành công',
    ['Ghi thêm demo bằng người điều khiển', 'Lật gương video demo', 'Sinh video bằng diffusion rồi gán nhãn tay'],
    'τ′ = T_{W,O′}·T_{W,O}⁻¹·τ. ~200 demo người, 18 nhiệm vụ → 50k+ demo.'),

  q.single('42', 2, 'ADR (Automatic Domain Randomization) điều chỉnh vùng ngẫu nhiên hoá thế nào?',
    'Thành công > t_H thì nới rộng; thành công < t_L thì thu hẹp',
    ['Luôn giữ cố định từ đầu', 'Nới rộng ngẫu nhiên mỗi epoch', 'Thu hẹp khi policy thành công nhiều'],
    'Mỗi tham số (ma sát, khối lượng, độ trễ điều khiển) có khoảng quanh giá trị danh định. ADR giải đúng bài "rộng bao nhiêu thì vừa" (OpenAI 2019).'),

  q.single('43', 1, 'Có 1 000 lượt demo robot: nên thu 1 bếp × 1 000 hay nhiều nơi × ít lần?',
    'Nhiều nơi ít lần: đa dạng môi trường và vật quan trọng hơn tổng số demo',
    ['1 bếp × 1 000 để model thành thạo', 'Không khác nhau', 'Chỉ cần 10 demo ở 1 nơi'],
    'Lin et al. (ICLR 2025): hơn 40 000 demo, hơn 15 000 lần chạy robot thật. Cách chia tốt nhất: 32 nơi × 4 demo, tổng 128.'),

  q.single('44', 3, 'BOP 2020: CosyPose chỉ học ảnh dựng vật lý (PBR) so với PBR + ảnh thật đạt AR bao nhiêu?',
    '57,0 so với 63,7: gần bắt kịp nhưng chưa bắt kịp hẳn',
    ['63,7 so với 57,0', 'Bằng nhau 60,0', '20,0 so với 63,7'],
    '350k ảnh PBR phát kèm benchmark. DOPE (CoRL 2018) là mạng 6-DoF chỉ học từ dữ liệu tổng hợp đầu tiên đạt state of the art.'),

  q.single('45', 1, 'Theo mô hình err(D) = a·D^(−α) + c, nhân đôi dữ liệu có chia đôi lỗi không?',
    'Không: phần lỗi giảm được nhân với 2^(−α) (≈ 0,78 khi α = 0,35), và không bao giờ xuống dưới sàn c',
    ['Có, luôn chia đôi', 'Lỗi tăng khi có nhiều dữ liệu hơn', 'Lỗi giảm về 0 sau vài lần nhân đôi'],
    'Đường lũy thừa là đường thẳng trên trục log-log cho tới khi chạm sàn. Gần sàn rất đắt. Số mũ thật phải ước lượng từ pilot của chính bạn.'),

  q.single('46', 2, 'Chia ngân sách dữ liệu cho nhiều slice nên theo nguyên tắc nào?',
    'Ước lượng đường cong từng slice từ pilot, rồi đổ dữ liệu vào chỗ lợi ích biên dP/dn cao nhất',
    ['Chia đều cho mọi slice', 'Dồn hết vào slice phổ biến nhất', 'Dồn hết vào slice đang có lỗi cao nhất bất kể đường cong'],
    'Mỗi slice: P_d(n) = A_d(1 − e^(−n/k_d)). Minh hoạ: chia theo lợi ích biên +0,486 so với chia đều +0,428.'),

  q.single('47', 2, 'SemDeDup cho thấy gì khi bỏ 50% dữ liệu gần trùng ngữ nghĩa?',
    'Hiệu năng gần như không đổi, thời gian huấn luyện giảm một nửa',
    ['Hiệu năng giảm một nửa', 'Hiệu năng tăng gấp đôi', 'Model không còn hội tụ'],
    'Đôi khi bước tốt nhất là bỏ bớt dữ liệu. Với thước đo cắt tỉa đủ tốt, lỗi có thể giảm theo hàm mũ thay vì lũy thừa (Sorscher et al., NeurIPS 2022).'),

  q.single('48', 2, 'Trong n_eff = n_real + λ·n_syn, λ thường thế nào?',
    'λ < 1 và khác nhau theo slice: một mẫu tổng hợp đáng giá ít hơn một mẫu thật',
    ['λ > 1 vì dữ liệu tổng hợp sạch hơn', 'λ = 1 cho mọi slice', 'λ = 0 vì dữ liệu tổng hợp vô dụng'],
    'Tỉ lệ thật : tổng hợp là siêu tham số, chỉnh trên validation thật cho từng slice.'),

  q.single('49', 1, 'Model collapse là gì?',
    'Học lặp từ dữ liệu do chính model sinh ra làm đuôi phân phối biến mất dần',
    ['Model bị sập vì hết bộ nhớ GPU', 'Model quên dữ liệu cũ khi học dữ liệu mới', 'Model cho mọi đầu vào cùng một đầu ra vì learning rate quá lớn'],
    'Mô phỏng: độ lệch chuẩn thật 1,00 co về 0,08 sau nhiều thế hệ; P(|x| > 2) còn 0% (thật 4,6%). Cách tránh: tích luỹ dữ liệu thật, đừng thay thế.'),

  q.multi('50', 2, 'Khi huấn luyện lại trên tập đã lớn, những cách nào giúp không quên việc cũ? (chọn nhiều)',
    ['Rehearsal: trộn lại một phần dữ liệu cũ', 'EWC: phạt khi trọng số quan trọng cho việc cũ trôi đi', 'Slice canh giữ trong cổng retrain để phát hiện quên trước khi ship'],
    ['Xoá dữ liệu cũ để tiết kiệm bộ nhớ', 'Tăng learning rate gấp 10 lần'],
    'EWC: L(θ) = L_mới(θ) + (λ/2)Σ Fᵢ(θᵢ − θᵢ⋆)², trọng số có Fisher lớn bị giữ chặt quanh giá trị cũ.'),

  q.single('51', 1, 'Thu lại test set theo đúng giao thức cũ (ImageNet, CIFAR-10), điểm thay đổi thế nào?',
    'Tụt 3–15 điểm, thứ tự các model gần như giữ nguyên; nguyên nhân là mẫu mới hơi khó hơn, không phải overfit',
    ['Giữ nguyên chính xác', 'Tăng vì model đã tốt hơn', 'Thứ tự model đảo ngược hoàn toàn'],
    'Recht et al., ICML 2019. Một test set mới là một lần lệch phân phối, kể cả khi không ai đổi gì: không so số mới với số cũ.'),

  q.match('52', 1, 'Ghép loại test set với mục đích.', [
    ['Bộ hồi quy đóng băng', 'Không bao giờ đổi, để so mọi phiên bản với nhau'],
    ['Các bộ mới theo nơi và thời gian', 'Biết hiệu năng thật trên dữ liệu mới'],
  ], 'Dữ liệu huấn luyện, kể cả dữ liệu sinh, không bao giờ lấy từ log của test và không bao giờ vào phán quyết.'),

  q.single('53', 2, 'Kiểm tra rò rỉ gần trùng cho thấy bao nhiêu ảnh test CIFAR-10 có bản gần trùng trong train?',
    '3,3% (CIFAR-100: 10%)',
    ['0%', '33%', '50%'],
    'p_leak(τ) = tỉ lệ ảnh test có ảnh train giống hơn ngưỡng τ. Video lái xe còn tệ hơn vì khung liền nhau gần như giống hệt.'),

  q.single('54', 1, 'Muốn con số trung thực về hiệu năng ở một thành phố mới, nên chia dữ liệu thế nào?',
    'Giữ riêng một thành phố và ba tháng cuối làm test',
    ['Trộn mọi khung hình, chia ngẫu nhiên 80/20', 'Chia theo cảnh, mọi cảnh từ cùng các thành phố', 'Sinh cảnh thành phố mới bằng world model rồi test'],
    'Chia theo cảnh, nơi, thời gian, không theo khung. Test bằng dữ liệu sinh chỉ đo model trên phân phối của bộ sinh.'),

  q.single('55', 2, 'Trong lab, chạy 400 kịch bản bằng log phát lại cho 101 va chạm, còn khi xe khác phản ứng thì 0. Vì sao?',
    'Log phát lại sinh va chạm giả: xe trong log không biết xe ta đã phanh nên tông đuôi',
    ['Planner tệ hơn khi xe khác phản ứng', 'Log phát lại chính xác hơn', 'Kịch bản phản ứng bị lỗi'],
    'Phần lớn 101 vụ là bị tông đuôi. Cần tác nhân phản ứng để đo đúng.'),

  q.single('56', 2, 'Đo tần suất va chạm hiếm bằng importance sampling, vì sao trộn q = 0,8·q_CEM + 0,2·p?',
    'Thành phần 0,2·p giữ trọng số w = p/q ≤ 5, tránh vài mẫu có trọng số khổng lồ; báo kèm ESS',
    ['Để tìm nhiều va chạm hơn', 'Để bỏ được trọng số p/q', 'Để chạy nhanh gấp 5 lần'],
    'p̂ = (1/n)Σ (p(uᵢ)/q(uᵢ))·1[va chạmᵢ]: p/q trả lại tần suất tự nhiên. CEM kéo q về nơi nguy hiểm, nên săn theo từng kiểu thất bại.'),

  q.fill('57', 2, 'Chạy n = 1 000 mẫu, không thấy va chạm nào. Nên báo cận trên tần suất bao nhiêu (theo quy tắc 3/n)?', ['0,003', '0.003', '3/1000', '3e-3'],
    'Chưa thấy ≠ không có: 0 va chạm trong n mẫu thì báo cận trên 3/n (khoảng tin cậy 95%), không báo 0.'),
]
