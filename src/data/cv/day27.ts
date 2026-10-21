import { maker } from './make'

const q = maker(27)

// Day 27 · Phát lại nhật ký và kiểm thử vòng kín
export const day27 = [
  q.order('01', 1, 'Sắp xếp các bậc kiểm thử một bản nhận thức mới trước khi chạy thật.', [
    'Phát lại nhật ký',
    'Vòng hở và vòng kín',
    'Kịch bản kiểm thử',
    'Tác nhân phản ứng',
    'Chạy thật',
  ], 'Lỗi bị chặn càng sớm càng ít tốn kém. Vì vậy không chỉ đo mAP mà phải xem tác động lên cả hệ thống.'),

  q.order('02', 1, 'Một lỗi nhận thức lan xuống chuỗi xử lý thế nào? Sắp xếp theo thứ tự lan.', [
    'Nhận thức: bỏ sót một khung',
    'Theo dõi: đổi định danh',
    'Dự báo: quỹ đạo lệch',
    'Lập kế hoạch: phanh trễ',
    'Điều khiển: nguy cơ va chạm',
  ], 'Một thay đổi ở nhận thức lan xuống cả chuỗi, nên phải kiểm thử ở mức hệ thống.'),

  q.single('03', 1, 'Vì sao phát lại nhật ký cô lập được tác động của một thay đổi phần mềm?',
    'Cùng đầu vào, chỉ đổi phần mềm: khác biệt ở đầu ra đến từ thay đổi đó',
    ['Vì nhật ký tự sửa lỗi của phần mềm', 'Vì phát lại nhanh hơn chạy thật', 'Vì nhật ký không có nhiễu cảm biến'],
    'Ghi một lần ngoài đường, phát lại bao nhiêu lần cũng được, theo đúng thứ tự và dấu thời gian của nhật ký.'),

  q.match('04', 2, 'Ghép mức phát lại với cách đưa dữ liệu vào hệ thống.', [
    ['Mức 1 · cảm biến thô', 'Nhật ký → nhận thức → lập kế hoạch → điều khiển: sát hệ thống thật nhất'],
    ['Mức 2 · đầu ra nhận thức', 'Nhật ký đi thẳng vào lập kế hoạch, bỏ qua nhận thức'],
    ['Mức 3 · một tiến trình', 'Chỉ chạy nhận thức: nhanh và cô lập nhất'],
  ], 'Chọn mức theo việc cần kiểm: đổi detector thì mức 3 hoặc 1; đổi planner thì mức 2.'),

  q.single('05', 2, 'Bản v2 chỉ đổi khối nhận thức cho chênh lệch điểm: ban đêm +6, xa trên 50 m +3, bị che −4, mưa −2. Bài học là gì?',
    'So theo lát cắt: một con số trung bình có thể che mất lát cắt tệ đi',
    ['v2 tốt hơn ở mọi trường hợp', 'Chỉ cần nhìn điểm trung bình', 'Lát cắt mưa không quan trọng'],
    'Khác biệt thuộc về khối đã đổi; số liệu lát cắt trong slide là minh hoạ.'),

  q.multi('06', 1, 'Để phát lại tái lập được y hệt, thẻ lần chạy cần ghi những gì? (chọn nhiều)',
    ['Mã nhật ký', 'Mã phần mềm (commit)', 'Phiên bản mô hình nhận thức', 'Hiệu chuẩn, hạt giống ngẫu nhiên, cấu hình'],
    ['Tên người chạy', 'Thời tiết hôm chạy lại'],
    'Thiếu một dòng là lần chạy không tái lập được.'),

  q.single('07', 2, 'Mỗi lần sửa mã, phát lại cả kho nhật ký và so với kết quả chuẩn dùng để làm gì?',
    'Kiểm thử chống suy giảm (regression test): mở xem những đoạn lệch',
    ['Huấn luyện lại mô hình', 'Tạo dữ liệu tổng hợp', 'Đo tốc độ GPU'],
    'Ví dụ openpilot process_replay so đầu ra từng tiến trình với kết quả chuẩn đã biết.'),

  q.multi('08', 2, 'Những nguồn nào làm hai lần phát lại cùng nhật ký cho kết quả hơi khác nhau? (chọn nhiều)',
    ['Thứ tự cộng số thực', 'Đa luồng', 'Thứ tự bản tin', 'Kernel GPU'],
    ['Nhật ký tự thay đổi giữa hai lần', 'Hạt giống cố định'],
    'Khác biệt nhỏ nhưng không bằng 0, nên so sánh cần dung sai chứ không đòi bằng nhau từng bit.'),

  q.single('09', 2, 'Trong số thực 64 bit, (0,1 + 0,2) + 0,3 và 0,1 + (0,2 + 0,3) cho kết quả gì?',
    '0,6000000000000001 và 0,6: khác nhau ở chữ số cuối',
    ['Cả hai đúng bằng 0,6', 'Cả hai bằng 0,6000000000000001', 'Lỗi tràn số'],
    'Phép cộng số thực không có tính kết hợp tuyệt đối. GPU cộng song song theo thứ tự không cố định.'),

  q.single('10', 1, 'Phát lại "nhanh nhất có thể" có thể che lỗi gì?',
    'Lỗi vượt thời hạn xử lý: không có hạn chót nên không thấy khung bị trễ',
    ['Lỗi nhận sai lớp đối tượng', 'Lỗi hiệu chuẩn camera', 'Lỗi thiếu dữ liệu GPS'],
    'Muốn kiểm tra thời hạn thì phát lại theo tốc độ thời gian thật.'),

  q.match('11', 3, 'Ghép công cụ với vai trò.', [
    ['ros2 bag (rosbag2)', 'Ghi và phát lại dữ liệu ROS 2'],
    ['MCAP', 'Định dạng tệp nhật ký cho robot'],
    ['Foxglove', 'Xem nhật ký theo trục thời gian'],
    ['openpilot process_replay', 'Kiểm thử chống suy giảm bằng nhật ký'],
  ], 'Đây là bộ công cụ cho chương phát lại nhật ký.'),

  q.single('12', 1, 'Phát lại nhật ký KHÔNG làm được việc gì?',
    'Đánh giá hành động mới, vì thế giới trong nhật ký không đổi theo hành động của xe',
    ['Kiểm tra phần nhận thức', 'Phát hiện lỗi phần mềm', 'Tái hiện sự cố từ xe thật'],
    'Đánh giá hành động cần vòng kín: hành động phải làm thay đổi thế giới.'),

  q.match('13', 1, 'Ghép kiểu đánh giá với đặc điểm.', [
    ['Vòng hở', 'Hành động không đổi gì; xe luôn được đặt lại về nhật ký'],
    ['Vòng kín', 'Hành động đổi thế giới; xe đi theo kết quả của chính nó'],
  ], 'Vòng hở xoá sai lệch mỗi bước nên điểm cao; vòng kín giữ lại nên sai lệch nhỏ cộng dồn, có thể dẫn tới va chạm.'),

  q.single('14', 1, 'Vì sao sai số ở vòng kín tăng dần theo số bước còn vòng hở gần như phẳng?',
    'Vòng hở không bao giờ để xe tới trạng thái lạ; vòng kín tích luỹ sai lệch và đưa xe vào trạng thái chưa từng thấy',
    ['Vòng kín dùng cảm biến kém hơn', 'Vòng hở dùng mô hình lớn hơn', 'Vòng kín chạy ở tần số thấp hơn'],
    'Đường vẽ trong slide là minh hoạ khái niệm.'),

  q.single('15', 2, 'Vì sao một mô hình chỉ "giữ vận tốc hiện tại" vẫn có điểm vòng hở cao trên nuScenes?',
    'Khoảng 73,9% cảnh trong nuScenes là chạy thẳng, nên điểm vòng hở phản ánh phần cảnh dễ',
    ['Vì nuScenes có nhãn sai', 'Vì mô hình giữ vận tốc dùng camera tốt', 'Vì vòng hở chấm trên dữ liệu tổng hợp'],
    'Li và cs. (CVPR 2024): Ego-MLP không dùng camera có L2 0,35 m, còn tốt hơn VAD đủ camera (0,37 m).'),

  q.tf('16', 1, 'Mô hình có sai số L2 vòng hở thấp thì chắc chắn lái an toàn hơn trong vòng kín.', false,
    'Sai. Trong lab Day 12, mô hình L2 thấp vẫn đâm ở ca phanh gấp cả 5/5 lần huấn luyện. Điểm vòng hở tốt chưa có nghĩa hệ thống hành xử tốt.'),

  q.single('17', 2, 'mAP nhận thức tăng đều qua các phiên bản v1 → v6. Va chạm vòng kín thì sao?',
    'Có thể dao động, không theo mAP: phải đo cả chỉ số nhận thức lẫn kết quả hệ thống ở vòng kín',
    ['Luôn giảm tỉ lệ thuận với mAP', 'Luôn bằng 0 khi mAP > 0,5', 'Không thể đo được'],
    'Minh hoạ khái niệm: mAP từ ~0,40 lên ~0,61 trong khi va chạm dao động 8–12%.'),

  q.single('18', 1, 'Khi nào một mô hình học mới đáng thay bộ luật đơn giản?',
    'Khi vượt bộ luật đơn giản trong vòng kín',
    ['Khi có L2 vòng hở thấp hơn', 'Khi có nhiều tham số hơn', 'Khi huấn luyện xong không lỗi'],
    'Luôn so với một bộ luật đơn giản làm chuẩn.'),

  q.single('19', 1, 'Xếp hạng bộ lập kế hoạch theo vòng hở và vòng kín có thể như thế nào?',
    'Đảo ngược nhau: chọn theo vòng hở có thể chọn nhầm',
    ['Luôn giống hệt nhau', 'Vòng kín luôn cho điểm cao hơn', 'Không so sánh được'],
    'Trên nuPlan Val14, hai cách chấm xếp một số planner ngược nhau.'),

  q.single('20', 2, 'Cùng phần mềm, cùng bản đồ, 5 lần chạy vòng kín cho 3/5 thành công. Bài học là gì?',
    'Vòng kín cũng có nhiễu: phải chạy nhiều lần, một lần chưa đủ',
    ['Phần mềm bị lỗi ngẫu nhiên phải viết lại', 'Chỉ lấy lần chạy tốt nhất', 'Bản đồ bị sai'],
    'Kết quả đổi theo nhiễu nên cần nhiều lần chạy và nhiều hạt giống.'),

  q.fill('21', 2, 'CARLA Leaderboard: hoàn thành lộ trình 80%, hệ số phạt vi phạm 0,7. Điểm lái là bao nhiêu phần trăm?', ['56', '56%', '0,56'],
    'Điểm lái = hoàn thành lộ trình × mức phạt = 0,8 × 0,7 = 0,56. Hoàn thành cao vẫn bị kéo xuống nếu có vi phạm.'),

  q.match('22', 2, 'Ghép mức đánh giá với đặc điểm.', [
    ['Vòng hở', 'So với nhật ký; rẻ, dùng để sàng lọc'],
    ['Mô phỏng ngắn (NAVSIM)', 'Cảnh ngắn từ dữ liệu thật'],
    ['Vòng kín (CARLA, nuPlan)', 'Xe tự lái trong mô phỏng; bắt buộc trước phát hành'],
  ], 'Robot kho: Isaac Lab hoặc Gazebo trước khi ra sàn kho.'),

  q.single('23', 2, 'Theo RAND (2016), để chứng minh an toàn ngang người lái cần bao nhiêu dặm không lỗi?',
    'Khoảng 274,8 triệu dặm (12,5 năm với 100 xe chạy 24/7)',
    ['Khoảng 1 triệu dặm', 'Khoảng 10 000 dặm', 'Khoảng 518 triệu năm'],
    'Muốn thấy mức giảm 20% so với người lái cần 518 năm với cùng đội xe. Lái thử ngoài đường không đủ để chứng minh an toàn, nên cần kiểm thử theo kịch bản.'),

  q.match('24', 1, 'Ghép mức kịch bản với ví dụ.', [
    ['Chức năng', '"Xe bên cạnh cắt vào trước mặt": mô tả bằng lời'],
    ['Logic', 'Khoảng cách 5–40 m, tiến gần 0–15 m/s: khoảng giá trị'],
    ['Cụ thể', 'Khoảng cách 12 m, tiến gần 5 m/s: chạy được ngay'],
  ], 'Mức logic sinh ra cả họ ca; càng xuống mức cụ thể càng chạy được.'),

  q.single('25', 2, 'Từ một lỗi đã gặp trong nhật ký, nên làm gì để kiểm thử?',
    'Tham số hoá ca đó rồi quét quanh nó để tìm ranh giới an toàn/va chạm',
    ['Chỉ phát lại đúng ca đó một lần', 'Xoá ca đó khỏi nhật ký', 'Huấn luyện lại trên đúng ca đó'],
    'Một lỗi thành nhiều biến thể. Lỗi nằm trên một ranh giới: kiểm thử ranh giới, không kiểm thử trung bình.'),

  q.fill('26', 1, 'Khoảng cách 12 m, tốc độ tiến gần 5 m/s. TTC bằng bao nhiêu giây?', ['2,4', '2.4'],
    'TTC = khoảng cách ÷ tốc độ tiến gần = 12/5 = 2,4 s (cần phanh). 30 m, 5 m/s → 6 s; 12 m, 10 m/s → 1,2 s (nguy hiểm).'),

  q.fill('27', 2, 'Giảm tốc cần thiết = (tốc độ tiến gần)²/(2 × khoảng cách). Với 12 m và 10 m/s, bằng bao nhiêu m/s²? (1 chữ số thập phân)', ['4,2', '4.2', '4,17', '4.17'],
    '10²/(2·12) = 100/24 ≈ 4,2 m/s², vượt mức phanh êm ~3 m/s² nhưng dưới giới hạn ~8 m/s² (ngưỡng minh hoạ). Dùng bên cạnh TTC vì mỗi độ đo chỉ trả lời một câu hẹp.'),

  q.multi('28', 2, 'Kịch bản cho nhận thức gồm những điều kiện làm khó cảm biến nào? (chọn nhiều)',
    ['Ban đêm', 'Mưa', 'Bị che khuất', 'Cảm biến mất tín hiệu'],
    ['Đường thẳng ban ngày quang đãng', 'Xe đứng yên trong bãi'],
    'Mỗi điều kiện là một trục tham số: độ sáng, cường độ mưa, mức che khuất, tỷ lệ mất điểm.'),

  q.match('29', 3, 'Ghép công cụ chạy kịch bản với vai trò.', [
    ['OpenSCENARIO', 'Chuẩn tệp mô tả kịch bản (ASAM)'],
    ['Scenic', 'Ngôn ngữ mô tả phân bố kịch bản'],
    ['CARLA ScenarioRunner', 'Chạy kịch bản trong CARLA'],
    ['esmini', 'Trình chạy OpenSCENARIO gọn nhẹ'],
  ], 'Chuẩn hoá kịch bản giúp tái sử dụng giữa các simulator.'),

  q.single('30', 1, 'Hai bộ 24 kịch bản: một bộ chỉ phủ một góc, một bộ phủ cả miền vận hành. Nên đếm gì?',
    'Độ bao phủ: số vùng của miền vận hành đã thử, không phải số ca',
    ['Số ca: hai bộ như nhau', 'Số lần va chạm', 'Thời gian chạy'],
    'Độ bao phủ quan trọng hơn số kịch bản.'),

  q.tf('31', 1, 'Một kịch bản bắt buộc thất bại là đủ để dừng bản phát hành, dù các bậc khác đều đạt.', true,
    'Đúng. Cổng phát hành gồm: phát lại khớp, vòng hở đạt ngưỡng, bộ kịch bản bắt buộc, tác nhân phản ứng đạt. Thiếu một là chặn.'),

  q.single('32', 1, 'Phát lại nhật ký khi xe thử phanh sớm hơn lần ghi thường cho kết quả gì?',
    'Va chạm giả: xe sau chạy đúng nhật ký, không biết xe thử đã phanh nên đâm vào',
    ['Không có gì thay đổi', 'Xe sau tự phanh theo', 'Xe thử tự động tăng tốc'],
    'Tác nhân phản ứng (xe sau tự phanh) cho kết quả sát ngoài đời hơn. Tương tự robot kho: người trong nhật ký không biết robot nhanh hơn lần ghi.'),

  q.single('33', 2, 'Trong mô hình tài xế thông minh (IDM), đổi tham số làm gì?',
    'Đổi tính cách tài xế: thận trọng, bình thường, liều lĩnh (khoảng cách nhỏ nhất khi xe trước phanh lần lượt ~24, 17, 10 m)',
    ['Đổi bản đồ đường', 'Đổi loại cảm biến', 'Đổi tốc độ khung hình'],
    'IDM là tác nhân theo luật: dễ kiểm soát. Số liệu chạy với tham số minh hoạ.'),

  q.match('34', 1, 'Ghép cách mô hình hoá xe và người khác với đặc điểm.', [
    ['Phát lại nhật ký', 'Đơn giản, không phản ứng'],
    ['Theo luật (IDM)', 'Dễ kiểm soát'],
    ['Học từ dữ liệu', 'Thực tế hơn, phụ thuộc dữ liệu'],
  ], 'Loại tác nhân có thể đổi thứ hạng bộ lập kế hoạch.'),

  q.single('35', 3, 'Waymo Sim Agents Challenge yêu cầu bao nhiêu tương lai chung cho mỗi cảnh?',
    '32',
    ['1', '6', '100'],
    'Tác nhân học từ dữ liệu cho nhiều tương lai khả dĩ: mỗi lần lấy mẫu cho một tương lai khác.'),

  q.single('36', 1, 'Khi nào tác nhân mô phỏng đáng tin?',
    'Khi phân bố hành vi của nó (ví dụ khoảng cách tới xe trước) khớp với nhật ký thật',
    ['Khi nó không bao giờ va chạm', 'Khi nó chạy nhanh nhất', 'Khi nó có nhiều tham số nhất'],
    'Tác nhân lệch phân bố thì kết luận về planner kém tin cậy.'),

  q.single('37', 1, 'Tỷ lệ va chạm (minh hoạ): không phản ứng A 9% / B 4%; phản ứng A 8% / B 14%. Kết luận?',
    'Chọn sai loại tác nhân có thể chọn nhầm bộ lập kế hoạch',
    ['B luôn tốt hơn A', 'A luôn tốt hơn B', 'Tác nhân không ảnh hưởng kết luận'],
    'Không phản ứng thì B thắng; có phản ứng thì A thắng. Tính phản ứng đổi kết luận.'),

  q.match('38', 2, 'Ghép bộ điều khiển trong lab với vai trò.', [
    ['constant-velocity', 'Mốc dưới: giữ vận tốc'],
    ['IDM', 'Luật chuẩn: nhìn khoảng cách, vận tốc xe dẫn'],
    ['EgoMLP', 'Đường tắt: chỉ nhìn vận tốc của chính nó'],
    ['PercMLP', 'Có nhận thức: thêm khoảng cách, vận tốc xe dẫn'],
    ['PercMLP+', 'Bản sửa: như PercMLP, huấn luyện thêm (DAgger)'],
  ], '"Nhận thức" trong lab là hai số đọc từ nhật ký, không có cảm biến.'),

  q.single('39', 2, 'EgoMLP và PercMLP khác nhau ở đâu?',
    'Cùng kiến trúc và dữ liệu; PercMLP chỉ thêm 2 số đầu vào (khoảng cách, vận tốc xe dẫn)',
    ['PercMLP có nhiều lớp hơn', 'EgoMLP dùng camera', 'PercMLP dùng hàm mất mát khác'],
    'Đầu vào 22 số (vận tốc 2 s qua) → hai lớp 128 ReLU → 30 số (độ đổi vận tốc 0,1 đến 3 s).'),

  q.single('40', 2, 'Nhãn huấn luyện trong lab là gì?',
    'Độ đổi vận tốc y_k = v(t + k) − v(t), k = 1…30, trên cửa sổ 2 s quá khứ và 3 s tương lai',
    ['Vận tốc tuyệt đối tại t + 3 s', 'Vị trí xe sau 3 s', 'Nhãn va chạm có/không'],
    'Cửa sổ trượt bước 0,2 s trên mỗi quỹ đạo.'),

  q.single('41', 1, 'Lab chia 9 993 quỹ đạo thành train 70% / test 30% theo quỹ đạo. Vì sao không chia theo khung?',
    'Các khung liền kề của một quỹ đạo gần như giống nhau, không được rơi vào cả hai phía',
    ['Để test có nhiều mẫu hơn', 'Vì khung không có nhãn', 'Vì chia theo khung chạy chậm'],
    'Loại 383 bản trùng hệt trước khi chia: 6 727 quỹ đạo train, 2 883 test.'),

  q.fill('42', 3, 'Mô hình xuất 30 độ đổi vận tốc; lấy số thứ năm ŷ₅ (sau 0,5 s). Nếu ŷ₅ = −1,5 m/s thì gia tốc lệnh a bằng bao nhiêu m/s²?', ['-3', '−3', '-3,0'],
    'a = ŷ₅ / 0,5 s = −3 m/s², rồi cắt trong [−9; +3] m/s² trước khi gửi lệnh.'),

  q.single('43', 1, 'Kết quả lab: IDM có L2 vòng hở tệ nhất (1,51 m) nhưng va chạm vòng kín thấp nhất (0,1%). Ý nghĩa?',
    'L2 vòng hở không đo chất lượng lái; hai bảng xếp hạng có thể ngược nhau',
    ['IDM bị lỗi đo', 'L2 thấp luôn đồng nghĩa an toàn', 'Va chạm vòng kín không đáng tin'],
    'EgoMLP có L2 tốt hơn constant-velocity (0,76 so với 1,24 m) nhưng va chạm nhiều hơn (24,1% so với 18,9%).'),

  q.single('44', 2, 'Va chạm của EgoMLP theo 5 hạt giống dao động 11,9% đến 35,9%. Bài học?',
    'Một hạt giống không đại diện: phải báo cáo qua nhiều hạt giống',
    ['Chọn hạt giống tốt nhất để báo cáo', 'Hạt giống không ảnh hưởng kết quả', 'Chỉ cần chạy 1 hạt giống nếu mô hình nhỏ'],
    'Khi xe dẫn phanh, hạt giống xấu nhất va chạm 69,0% số quỹ đạo; IDM chỉ 0,6%.'),

  q.single('45', 2, 'PercMLP vẫn va chạm ở vùng gia tốc chưa từng thấy. Nguyên nhân?',
    'Người lái trong nhật ký chỉ phanh tới 3,6 m/s², nên tập huấn luyện không phủ vùng 3,6–9 m/s² (12,7% ô lưới)',
    ['PercMLP thiếu đầu vào vận tốc', 'Lưới kịch bản bị lỗi', 'PercMLP quá lớn'],
    'Ở 20 m/s, 25,6–33,3% ô còn tránh được vẫn va chạm. Cổng R4 và R6 lộ ra điều đó.'),

  q.order('46', 1, 'Sắp xếp một vòng DAgger dùng để sửa PercMLP.', [
    'Mô hình tự lái',
    'Ghi lại trạng thái gặp phải',
    'IDM gắn nhãn 3 s cho các trạng thái đó',
    'Huấn luyện lại',
  ], 'DAgger dạy mô hình hồi phục từ chính sai số của nó, vì dữ liệu đến từ trạng thái do mô hình tự gây ra.'),

  q.single('47', 1, 'Sau khi sửa, PercMLP+ an toàn hơn hẳn nhưng L2 vòng hở xấu đi (0,62 → 0,80 m). Điều đó cho thấy gì?',
    'Điểm vòng hở không đo chất lượng lái',
    ['Bản sửa làm mô hình tệ đi', 'Nên quay về PercMLP', 'L2 và an toàn luôn đi cùng nhau'],
    'Ô lưới tránh được mà vẫn va chạm giảm 19,9% → 0,8%; va chạm trên nhật ký 0,6–0,9% → 0,2–0,3%.'),

  q.single('48', 2, 'Trong cổng bảy quy tắc R1–R7, bộ điều khiển nào được phát hành?',
    'Chỉ PercMLP+',
    ['constant-velocity và PercMLP+', 'EgoMLP và PercMLP', 'Cả bốn'],
    'R2 (va chạm trên nhật ký), R3 (xe dẫn phanh gấp), R4 (lưới cắt vào), R6 (xe sau phản ứng) chặn ba bộ còn lại. Lưu ý R7 đếm số kịch bản chứ chưa đo độ bao phủ.'),

  q.single('49', 2, 'Vì sao PercMLP+ qua cổng nhưng chỉ ở mức "không kém IDM"?',
    'Nó học từ nhãn của IDM nên khó vượt chính IDM',
    ['Vì cổng quá dễ', 'Vì nó dùng ít dữ liệu hơn IDM', 'Vì IDM được huấn luyện thêm'],
    'Nhãn lấy từ dự báo 3 s của IDM trong DAgger.'),

  q.match('50', 1, 'Ghép tình huống với bậc kiểm thử phù hợp.', [
    ['Đổi bộ nhận diện vật cản', 'Phát lại nhật ký, rồi vòng hở'],
    ['Robot báo dừng giữa lối đi', 'Phát lại đúng đoạn nhật ký'],
    ['Đổi bộ lập kế hoạch', 'Vòng kín và bộ kịch bản'],
    ['Chuẩn bị phát hành', 'Tác nhân phản ứng, chạy thử có giám sát'],
  ], 'Thất bại sớm và rẻ hơn thất bại ngoài đường.'),

  q.single('51', 3, 'Duckietown AI Driving Olympics đi qua các giai đoạn nào?',
    'Mô phỏng trực tuyến → phần cứng chuẩn hoá → sự kiện thi chính thức',
    ['Sự kiện thi → mô phỏng → phần cứng', 'Chỉ thi trên phần cứng thật', 'Chỉ thi trong mô phỏng'],
    'Cùng bẫy vòng hở và vòng kín, trên đường hay trên sân thi.'),
]
