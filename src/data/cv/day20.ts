import { maker } from './make'

const q = maker(20)

// Day 20 · Bộ lọc Kalman & hợp nhất xác suất
export const day20 = [
  q.multi('01', 1, 'Ba điều kiện chung khiến bộ lọc Kalman xuất hiện trong một bài toán là gì? (chọn nhiều)',
    ['Có một đại lượng ẩn cần biết', 'Cảm biến nhiễu, trễ hoặc thiếu', 'Đại lượng đó thay đổi theo một quy luật nào đó'],
    ['Có nhãn đúng cho mọi thời điểm', 'Dữ liệu phải đến đều đặn đúng nhịp'],
    'Điện thoại, xe tự lái, drone, tàu Apollo, dự báo thời tiết, tài chính đều có đủ ba thứ này.'),

  q.single('02', 2, 'Trong định vị điện thoại, khi vào hầm và mất GPS, bộ lọc làm gì?',
    'Bước dự đoán vẫn chạy bằng cảm biến chuyển động (dead reckoning); có GPS lại thì cập nhật kéo vị trí về đúng',
    ['Dừng hẳn và giữ vị trí cuối cùng cho tới khi có GPS', 'Đặt lại toàn bộ trạng thái về 0', 'Chuyển sang dùng camera để đo vị trí'],
    'Vận tốc và hướng đi là trạng thái ẩn: không cảm biến nào đo trực tiếp. Không có phép đo thì chỉ có bước dự đoán, và độ bất định tăng dần.'),

  q.order('03', 2, 'Sắp xếp chuỗi xử lý theo dõi đối tượng trong xe tự lái.', [
    'Phát hiện',
    'Gán dữ liệu',
    'Lọc Kalman',
    'Dự đoán quỹ đạo',
  ], 'Kalman giúp hợp nhất ba cảm biến, giữ ID khi đối tượng bị che vài khung (bước dự đoán vẫn đẩy track đi tiếp), và cho vận tốc để dự đoán quỹ đạo, phanh sớm.'),

  q.match('04', 1, 'Drone dùng hai cảm biến có lỗi trái ngược. Ghép cảm biến với kiểu lỗi.', [
    ['Con quay (gyroscope)', 'Mượt nhưng trôi (drift) vì cộng dồn sai số'],
    ['Gia tốc kế (accelerometer)', 'Không trôi nhưng nhiễu khi drone rung'],
  ], 'Con quay tốt ngắn hạn, gia tốc kế tốt dài hạn. Bộ lọc tin con quay cho thay đổi nhanh và dùng gia tốc kế kéo sai số trôi về. PX4 và ArduPilot dùng EKF.'),

  q.single('05', 2, 'Vì sao bộ lọc Kalman phù hợp với máy tính dẫn đường tàu Apollo có rất ít bộ nhớ?',
    'Bộ lọc chỉ nhớ x và P, không cần lưu lịch sử phép đo',
    ['Bộ lọc không cần phép nhân ma trận', 'Bộ lọc chỉ chạy một lần trước khi phóng', 'Bộ lọc lưu toàn bộ phép đo nhưng nén lại'],
    'Rudolf Kálmán công bố năm 1960; nhóm của Stanley Schmidt ở NASA Ames áp dụng cho bài toán bay tới Mặt Trăng, với phép đo lẻ tẻ từ radar mặt đất và kính lục phân.'),

  q.single('06', 2, 'Ensemble Kalman filter (EnKF) trong dự báo thời tiết giải quyết vấn đề gì?',
    'Ma trận P quá lớn để lưu (hàng chục triệu biến), nên ước lượng P từ độ phân tán của 20–100 lần chạy mô hình',
    ['Mô hình thời tiết không có quy luật chuyển động', 'Không có phép đo nào từ vệ tinh', 'Cần dự báo chính xác từng phân tử khí'],
    'Ý tưởng dùng nhiều mẫu thay cho một công thức rất gần với bộ lọc hạt ở phần phi tuyến.'),

  q.tf('07', 3, 'Mô hình xu hướng cục bộ (local linear trend) trong tài chính là một bộ lọc Kalman 2 trạng thái giống bài toán vị trí và vận tốc.', true,
    'Đúng. Mức giá nền và độ dốc xu hướng là hai trạng thái ẩn dưới giá quan sát nhiễu. Ngân hàng trung ương cũng dùng để nowcasting lạm phát hay GDP.'),

  q.single('08', 1, 'Chuyện cái hầm: phỏng đoán nói 170 m (kém chắc), bộ đếm bánh xe nói 150 m (khá chắc). Nên làm gì?',
    'Trộn cả hai, nghiêng về manh mối ít bất định hơn (kết quả gần 150 m, khoảng 152 m)',
    ['Chọn phỏng đoán vì nó dựa trên vật lý', 'Chọn cảm biến và bỏ hẳn phỏng đoán', 'Lấy trung bình cộng 160 m'],
    'Đừng chọn một trong hai. Trọng số tỉ lệ nghịch với phương sai nên manh mối chắc hơn nặng ký hơn.'),

  q.single('09', 2, 'Đo n lần một đại lượng đứng yên với cảm biến nhiễu σ. Sai số kỳ vọng của trung bình là bao nhiêu?',
    'σ/√n',
    ['σ/n', 'σ·√n', 'σ, không đổi theo n'],
    'Lấy trung bình nhiều phép đo độc lập giảm sai số theo √n: đo 100 lần giảm sai số 10 lần.'),

  q.match('10', 2, 'Ba cách theo dõi một robot đang chuyển động: ghép cách với đặc điểm.', [
    ['Chỉ dự đoán', 'Mượt nhưng trôi dần'],
    ['Chỉ cảm biến', 'Đúng trung bình nhưng giật'],
    ['Trộn (bộ lọc Kalman)', 'Mượt và chính xác'],
  ], 'Trong một lần chạy minh hoạ sai số trung bình lần lượt khoảng 3,4 m, 2,6 m và 1,0 m (số đổi theo mỗi lần chạy ngẫu nhiên).'),

  q.single('11', 1, 'Phân phối Gauss được mô tả trọn vẹn bởi những gì?',
    'Hai con số: trung bình μ và độ lệch chuẩn σ',
    ['Ba con số: trung bình, trung vị và yếu vị', 'Toàn bộ histogram của dữ liệu', 'Giá trị lớn nhất và nhỏ nhất'],
    'p(x) = 1/(σ√(2π))·exp(−(x − μ)²/(2σ²)). Vùng ±1σ chứa 68%, ±2σ chứa 95%.'),

  q.single('12', 2, 'Vì sao nhiễu cảm biến gần như luôn có dạng Gauss?',
    'Định lý giới hạn trung tâm: tổng nhiều nguồn nhiễu nhỏ, độc lập tiến về hình chuông',
    ['Vì cảm biến được thiết kế để cho nhiễu Gauss', 'Vì Gauss là phân phối duy nhất có trung bình', 'Vì nhiễu Gauss không bao giờ vượt quá 1σ'],
    'Rung động, nhiệt, điện từ cộng lại thành hình chuông, bất kể từng nguồn riêng lẻ trông thế nào.'),

  q.tf('13', 1, 'Nhân hai đường cong Gauss rồi chuẩn hoá lại cho ra một đường cong Gauss mới, hẹp hơn cả hai.', true,
    'Đúng. Gauss cộng Gauss vẫn ra Gauss, và phép nhân hai hình chuông (hợp nhất niềm tin) cũng ra hình chuông. Nhiều thông tin hơn, ít nghi ngờ hơn. Nhờ vậy Kalman dùng công thức gọn thay vì mô phỏng cả phân phối.'),

  q.single('14', 2, 'Niềm tin μ = 10 m, σ = 1,5 m. Khoảng chứa sự thật với xác suất 95% là gì?',
    '7,0 đến 13,0 m (±2σ)',
    ['8,5 đến 11,5 m', '5,5 đến 14,5 m', '9,0 đến 11,0 m'],
    '±1σ (68%) là 8,5–11,5 m; ±2σ (95%) là 7,0–13,0 m. Bộ lọc theo dõi phương sai σ² vì phương sai cộng lại rất gọn.'),

  q.fill('15', 1, 'Dự đoán nói 10 m (phương sai 4), cảm biến nói 12 m (phương sai 1). Ước lượng hợp nhất μ bằng bao nhiêu?', ['11,6', '11.6'],
    'Cách A: trọng số 1/4 và 1/1 → (0,25·10 + 1·12)/1,25 = 11,6. Cách B: K = 4/(4 + 1) = 0,8 → 10 + 0,8·(12 − 10) = 11,6. Cách B chính là bước cập nhật Kalman.'),

  q.fill('16', 1, 'Cùng ví dụ (phương sai dự đoán 4, phương sai cảm biến 1). Phương sai sau hợp nhất bằng bao nhiêu?', ['0,8', '0.8'],
    'σ² = 1/(1/4 + 1/1) = 0,8, hoặc (1 − K)·P = 0,2·4 = 0,8. Nhỏ hơn cả hai đầu vào.'),

  q.single('17', 1, 'Hệ số Kalman K = P/(P + R) gần bằng 1 nghĩa là gì?',
    'Gần như tin hoàn toàn phép đo: ước lượng mới gần bằng phép đo',
    ['Gần như tin hoàn toàn dự đoán', 'Bộ lọc đã phân kỳ', 'Phép đo và dự đoán có độ tin cậy bằng nhau'],
    'K ≈ 1 khi P ≫ R (nghi ngờ dự đoán nhiều, cảm biến tốt). K ≈ 0 khi cảm biến rất nhiễu. P = R cho K = 0,5.'),

  q.single('18', 2, 'Trong x = x⁻ + K(z − x⁻), đại lượng (z − x⁻) gọi là gì?',
    'Độ bất ngờ (innovation): phép đo trừ dự đoán',
    ['Nhiễu quá trình Q', 'Hệ số Kalman', 'Phương sai tiên nghiệm'],
    'Ước lượng mới = dự đoán + K × độ bất ngờ. Bộ lọc nhích từ dự đoán về phía phép đo một phần K.'),

  q.single('19', 1, 'Trong vòng lặp Kalman, độ bất định thay đổi thế nào qua hai bước?',
    'Dự đoán làm bất định tăng; cập nhật làm bất định giảm',
    ['Dự đoán làm bất định giảm; cập nhật làm bất định tăng', 'Cả hai bước đều làm bất định giảm', 'Bất định không đổi, chỉ trung bình thay đổi'],
    'Thời gian trôi làm ta kém chắc hơn, không bao giờ chắc hơn. Phép đo mới làm ta chắc hơn. Bộ lọc chỉ nhớ hai thứ: x và P.'),

  q.single('20', 2, 'Bước dự đoán 1 chiều là x⁻ = x + u, P⁻ = P + Q. Nếu đặt Q = 0 thì sao?',
    'Đường cong niềm tin dịch đi mà không nở ra',
    ['Đường cong nở ra nhưng không dịch', 'Bộ lọc không chạy được vì chia cho 0', 'Ước lượng nhảy thẳng tới phép đo'],
    'Q là nhiễu quá trình: những gì ta chưa mô hình hoá. Q > 0 làm phương sai tăng sau mỗi bước dự đoán.'),

  q.order('21', 1, 'Sắp xếp năm phương trình của bộ lọc Kalman 1 chiều theo đúng thứ tự chạy.', [
    'x⁻ = x + u (dịch phỏng đoán)',
    'P⁻ = P + Q (cộng thêm nghi ngờ)',
    'K = P⁻/(P⁻ + R) (tin cảm biến bao nhiêu)',
    'x = x⁻ + K(z − x⁻) (nhích về phía phép đo)',
    'P = (1 − K)P⁻ (nghi ngờ giảm)',
  ], 'Hai dòng đầu là dự đoán, ba dòng sau là cập nhật.'),

  q.match('22', 1, 'Ghép ký hiệu với ý nghĩa.', [
    ['x', 'Ước lượng tốt nhất của trạng thái'],
    ['P', 'Phương sai của ước lượng đó'],
    ['Q', 'Nhiễu quá trình: thế giới làm ta bất ngờ bao nhiêu'],
    ['R', 'Nhiễu đo: phương sai của cảm biến'],
    ['z', 'Phép đo'],
    ['x⁻', 'Tiên nghiệm (prior): dự đoán trước khi cập nhật'],
  ], 'u là chuyển động đã biết (tốc độ × thời gian), K là hệ số Kalman từ 0 đến 1.'),

  q.match('23', 1, 'Ghép tổ hợp Q và R với hành vi của bộ lọc.', [
    ['Q nhỏ, R nhỏ', 'Tin cả hai: mượt và chính xác, trường hợp lý tưởng'],
    ['Q nhỏ, R lớn', 'Tin mô hình: rất mượt nhưng chậm nhận ra thay đổi thật'],
    ['Q lớn, R nhỏ', 'Tin cảm biến: bám nhanh nhưng gần như chép luôn nhiễu'],
    ['Q lớn, R lớn', 'Không tin cả hai: đầu ra bất định, P lớn'],
  ], 'Hành vi phụ thuộc tỉ lệ Q : R; độ lớn tuyệt đối quyết định bộ lọc tự nhận mình chắc đến đâu (P).'),

  q.single('24', 1, 'Quy tắc ngón tay cái khi chỉnh Q và R là gì?',
    'Đặt R từ tài liệu kỹ thuật hoặc độ tản mác đo được của cảm biến, rồi chỉnh Q đến khi bám được động tác thật mà không đuổi theo nhiễu',
    ['Đặt Q = R cho mọi bài toán', 'Đặt R thật nhỏ để bộ lọc luôn tin cảm biến', 'Chỉnh R đến khi đường ước lượng trông mượt nhất'],
    'R đo được trực tiếp (ghi cảm biến khi mục tiêu đứng yên). Q khó đo hơn nên được chỉnh theo hành vi mong muốn.'),

  q.single('25', 1, 'Trôi một phút trong hầm nên P rất lớn, bỗng có tín hiệu GPS chính xác (R nhỏ). Điều gì xảy ra?',
    'K gần bằng 1: ước lượng nhảy gần như tới phép đo GPS, P giảm mạnh',
    ['K gần bằng 0: bộ lọc bỏ qua GPS', 'K = 0,5: ước lượng nằm giữa dự đoán và GPS', 'Bộ lọc báo lỗi vì P quá lớn'],
    'K = P/(P + R) với P ≫ R thì K ≈ 1. Đây chính là cảnh đường đi "giật" về đúng chỗ khi ra khỏi hầm.'),

  q.single('26', 1, 'LiDAR chỉ đo vị trí của một chiếc xe. Vì sao bộ lọc vẫn ước lượng được vận tốc?',
    'Vận tốc là trạng thái ẩn; các vị trí tăng dần qua thời gian và mô hình chuyển động liên hệ sai số vị trí với sai số vận tốc',
    ['LiDAR có đo Doppler giống radar', 'Bộ lọc giả định vận tốc luôn bằng 0', 'Vận tốc được lấy từ nhãn huấn luyện'],
    'Trạng thái x = [vị trí; vận tốc], ta chỉ đo phần tử đầu. Bộ lọc học được sai số vị trí và vận tốc liên hệ với nhau thế nào (ngoài đường chéo của P).'),

  q.match('27', 2, 'Ghép ý tưởng 1 chiều với dạng nhiều chiều.', [
    ['x', 'Vectơ trạng thái x'],
    ['P', 'Ma trận hiệp phương sai P'],
    ['x + u', 'F·x (trạng thái tiến triển sau Δt)'],
    ['z = x', 'z = H·x (cảm biến thấy gì của trạng thái)'],
  ], 'Vẫn là năm ý tưởng, chỉ có "cái hộp đựng" thay đổi. K thành một trọng số tin cậy cho mỗi phần tử trạng thái.'),

  q.single('28', 2, 'Trong ma trận hiệp phương sai P (2 × 2), phần tử ngoài đường chéo cho biết gì?',
    'Sai số của hai đại lượng liên hệ với nhau thế nào; ρ > 0 nghĩa là vị trí đoán quá cao thì vận tốc nhiều khả năng cũng quá cao',
    ['Độ bất định riêng của vận tốc', 'Độ bất định riêng của vị trí', 'Nhiễu của cảm biến'],
    'Đường chéo là nghi ngờ về từng đại lượng. Bất định 2 chiều vẽ ra là một elip, nghiêng khi có tương quan.'),

  q.fill('29', 3, 'σ_vị trí = 1,5; σ_vận tốc = 1,0; tương quan ρ = 0,6. Phần tử ngoài đường chéo của P bằng bao nhiêu?', ['0,9', '0.9', '0,90'],
    'Cov = ρ·σ₁·σ₂ = 0,6·1,5·1,0 = 0,9. P = [[2,25; 0,9]; [0,9; 1,0]].'),

  q.single('30', 1, 'Mô hình vận tốc không đổi dùng F và H nào khi cảm biến chỉ đo vị trí?',
    'F = [[1, Δt], [0, 1]], H = [1, 0]',
    ['F = [[1, 0], [0, 1]], H = [0, 1]', 'F = [[Δt, 1], [1, 0]], H = [1, 1]', 'F = [[1, Δt], [0, 0]], H = [1, 0]'],
    'Vị trí mới = vị trí + tốc độ × Δt; tốc độ giữ nguyên. H = [1, 0] lấy ra phần vị trí của trạng thái.'),

  q.single('31', 1, 'Trong bộ lọc nhiều chiều, phương trình dự đoán hiệp phương sai là gì?',
    'P⁻ = F·P·Fᵀ + Q',
    ['P⁻ = P + F + Q', 'P⁻ = F·P + Q', 'P⁻ = (I − KH)·P'],
    'P = (I − KH)P⁻ là bước cập nhật. Dạng F·P·Fᵀ đưa độ bất định qua phép biến đổi tuyến tính F.'),

  q.single('32', 2, 'Trong bước cập nhật nhiều chiều, S = H·P⁻·Hᵀ + R có ý nghĩa gì?',
    'Độ lớn kỳ vọng của sự bất ngờ (hiệp phương sai của innovation)',
    ['Hệ số Kalman cho mỗi phần tử trạng thái', 'Trạng thái sau cập nhật', 'Nhiễu quá trình đã chuẩn hoá'],
    'K = P⁻Hᵀ·S⁻¹. So với 1 chiều K = P/(P + R): cùng hình dạng, hộp đựng lớn hơn. S cũng dùng cho gating.'),

  q.single('33', 2, 'Khi chặn cảm biến 2 giây trong demo 2D, elip bất định và ước lượng thay đổi ra sao?',
    'Elip nở ra trong khi bộ lọc vẫn đi tiếp nhờ vận tốc',
    ['Elip co lại vì không có nhiễu đo', 'Ước lượng đứng yên tại vị trí cuối', 'Bộ lọc nhảy về gốc toạ độ'],
    'Không có phép đo thì chỉ chạy bước dự đoán: x⁻ = Fx đẩy trạng thái theo vận tốc, P⁻ = FPFᵀ + Q làm bất định tăng.'),

  q.single('34', 2, 'Gating "loại bất ngờ lớn hơn 3σ" dùng để làm gì?',
    'Loại điểm ngoại lai: phép đo có độ bất ngờ vượt xa độ lớn kỳ vọng S bị bỏ qua',
    ['Tăng Q khi bộ lọc trễ', 'Giảm R khi cảm biến tốt', 'Chia nhỏ bước thời gian Δt'],
    'Một phép đo bóng ma kéo giật ước lượng nếu không có cổng lọc. Cổng dựa vào chính S mà bộ lọc kỳ vọng.'),

  q.match('35', 1, 'Ghép bộ lọc với ý tưởng xử lý phi tuyến.', [
    ['KF', 'Công thức đóng, mô hình tuyến tính'],
    ['EKF', 'Thay đường cong bằng tiếp tuyến (Jacobian)'],
    ['UKF', 'Đẩy vài điểm sigma qua đường cong thật'],
    ['Particle Filter', 'Hàng trăm hạt (phỏng đoán) tự nhân lên'],
  ], 'Cả bốn dùng cùng vòng lặp dự đoán rồi cập nhật; khác nhau ở cách đưa niềm tin qua hàm phi tuyến.'),

  q.single('36', 1, 'Trong họ bộ lọc, loại nào cần tính Jacobian?',
    'Chỉ EKF',
    ['KF và EKF', 'EKF và UKF', 'Cả bốn loại'],
    'KF đã tuyến tính sẵn; UKF dùng điểm sigma thay đạo hàm; bộ lọc hạt dùng mẫu. Chỉ EKF tuyến tính hoá bằng đạo hàm tại điểm đang tin.'),

  q.single('37', 1, 'Khi nào cần bộ lọc hạt thay vì KF/EKF/UKF?',
    'Khi niềm tin không còn là một hình chuông, ví dụ nhiều đỉnh như robot chưa biết mình ở cửa nào trong 3 cửa giống nhau',
    ['Khi mô hình tuyến tính và nhiễu Gauss', 'Khi cần chi phí tính toán thấp nhất', 'Khi chỉ có một cảm biến duy nhất'],
    'KF/EKF/UKF chỉ biểu diễn được một hình chuông. Bộ lọc hạt cho niềm tin bất kỳ, đa đỉnh, nhưng tốn nhiều hạt và chi phí tăng nhanh theo số chiều.'),

  q.single('38', 2, 'Radar đo r = √(x² + y²) và φ = atan2(y, x). Vì sao Kalman thường không dùng trực tiếp được?',
    'Phép đo là hàm phi tuyến của vị trí (x, y), nên cần EKF hoặc UKF',
    ['Radar không đo được khoảng cách', 'Radar chỉ chạy được trong mưa', 'Kalman thường không xử lý được hai chiều'],
    'EKF: dự đoán bằng hàm thật, lấy Jacobian H = ∂h/∂x tại đó, dùng H cho K và P, độ bất ngờ là z − h(x⁻).'),

  q.multi('39', 2, 'EKF dễ hỏng trong những trường hợp nào? (chọn nhiều)',
    ['Hàm cong mạnh', 'Độ bất định σ lớn', 'Đạo hàm tại điểm đang tin xấp xỉ 0'],
    ['Mô hình hoàn toàn tuyến tính', 'Nhiễu đo rất nhỏ và hàm gần thẳng'],
    'Tiếp tuyến chỉ đúng trong lân cận nhỏ. Khi niềm tin rộng hoặc hàm cong, EKF lệch cả trung bình lẫn độ rộng; UKF xấp xỉ tốt hơn.'),

  q.single('40', 2, 'UKF với trạng thái n chiều đẩy bao nhiêu điểm sigma qua hàm thật mỗi bước?',
    '2n + 1 điểm',
    ['n điểm', 'n² điểm', 'Hàng trăm điểm ngẫu nhiên'],
    'Trung bình và các điểm đối xứng quanh nó (1 chiều: 3 điểm). Không cần đạo hàm, nhưng cần căn ma trận (Cholesky) và vẫn giả định Gauss. Hay dùng cho tư thế bằng quaternion.'),

  q.order('41', 2, 'Sắp xếp một vòng lặp của bộ lọc hạt.', [
    'Di chuyển: dịch từng hạt theo mô hình + nhiễu',
    'Gán trọng số: hạt khớp phép đo (likelihood) thì nặng hơn',
    'Lấy mẫu lại: bỏ hạt nhẹ, nhân hạt nặng',
  ], 'Bắt đầu các hạt rải đều (chưa biết mình ở đâu). Ứng dụng: định vị Monte Carlo (AMCL) cho robot hút bụi, robot kho.'),

  q.tf('42', 1, 'Khi hợp nhất nhiều cảm biến bằng cập nhật tuần tự, thứ tự cập nhật (LiDAR rồi radar, hay ngược lại) làm thay đổi kết quả.', false,
    'Sai. Hợp nhất là cộng thông tin, nên A rồi B bằng B rồi A. Mỗi cảm biến thêm chỉ là một bước cập nhật nữa với R riêng.'),

  q.match('43', 1, 'Ghép cảm biến với điểm mạnh và điểm yếu.', [
    ['LiDAR', 'Vị trí 3D chính xác; yếu khi mưa, sương mù, tuyết'],
    ['Radar', 'Khoảng cách và tốc độ Doppler mọi thời tiết; góc ngang thô'],
    ['Camera', 'Góc ngang và loại đối tượng; yếu về độ sâu, bóng tối, chói'],
  ], 'Sai số của chúng chỉ về các hướng khác nhau, nên hợp nhất tốt hơn bất kỳ cảm biến đơn lẻ nào.'),

  q.single('44', 2, 'Elip bất định của radar và camera khác nhau thế nào?',
    'Radar sắc nét dọc theo đường ngắm, mờ theo chiều ngang; camera ngược lại',
    ['Cả hai đều sắc nét theo mọi hướng', 'Radar mờ dọc đường ngắm, camera mờ theo mọi hướng', 'Camera sắc nét về độ sâu, radar sắc nét về góc'],
    'Vì vậy elip hợp nhất nhỏ hơn tất cả. Khi thời tiết xấu, LiDAR và camera xấu đi còn radar thì không.'),

  q.fill('45', 2, 'LiDAR phương sai 4, radar phương sai 1, camera phương sai 2. Tổng "thông tin" (1/phương sai) sau hợp nhất bằng bao nhiêu?', ['1,75', '1.75'],
    'Thông tin = 1/phương sai: 0,25 + 1 + 0,5 = 1,75. Phương sai hợp nhất = 1/1,75 ≈ 0,57.'),

  q.fill('46', 3, 'Cùng ví dụ, số đọc LiDAR 10,5; radar 12,0; camera 11,0. Trung bình hợp nhất bằng bao nhiêu?', ['11,5', '11.5'],
    '(0,25·10,5 + 1·12 + 0,5·11)/1,75 = (2,625 + 12 + 5,5)/1,75 = 20,125/1,75 = 11,5.'),

  q.tf('47', 2, 'Thêm một cảm biến rất nhiễu vào hợp nhất có thể làm kết quả tệ đi, kể cả khi R của nó trung thực.', false,
    'Sai. Cảm biến nhiễu đóng góp ít thông tin nhưng không bao giờ có hại nếu R của nó trung thực. Dạng ma trận: P⁻¹ = Σ Pᵢ⁻¹.'),

  q.single('48', 1, 'LiDAR 10 Hz, radar 20 Hz, camera 30 Hz đến lệch nhịp. Bộ lọc xử lý mỗi phép đo đến thế nào?',
    'Dự đoán tiến tới đúng mốc thời gian của phép đo, rồi cập nhật bằng H và R của cảm biến đó',
    ['Đợi đủ cả ba cảm biến rồi mới cập nhật một lần', 'Bỏ phép đo của cảm biến chậm nhất', 'Lấy trung bình ba phép đo gần nhất bất kể thời điểm'],
    'Mỗi lần đến được xử lý riêng rẽ. Δt trong F không cần đều nhau giữa các cảm biến.'),

  q.match('49', 2, 'Ghép kiểu hợp nhất với đặc điểm.', [
    ['Hợp nhất tập trung (central)', 'Đưa phép đo thô vào một bộ lọc duy nhất: chính xác nhất'],
    ['Hợp nhất track-to-track', 'Mỗi cảm biến giữ bộ theo dõi riêng rồi ghép track: gọn nhưng sai số có thể tương quan'],
  ], 'Sai số tương quan giữa các track dẫn tới đếm trùng thông tin, làm hợp nhất quá tự tin.'),

  q.match('50', 1, 'Ghép sự cố hợp nhất với cách sửa.', [
    ['Đếm trùng (sai số tương quan)', 'Hợp nhất phép đo thô, hoặc giao hiệp phương sai (covariance intersection)'],
    ['Điểm ngoại lai (bóng ma, trục trặc)', 'Cổng lọc (gating) theo S'],
    ['Lệch thời gian và hiệu chuẩn', 'Đồng bộ đồng hồ, gắn dấu thời gian lúc thu, hiệu chuẩn vị trí cảm biến'],
    ['Q hoặc R không trung thực', 'Đo R; kiểm tra độ bất ngờ có đúng cỡ kỳ vọng không'],
  ], 'Hợp nhất chỉ trung thực bằng độ bất định bạn cung cấp: R rác, hợp nhất rác.'),

  q.fill('51', 2, 'Lệch thời gian 50 ms khi vật chạy 20 m/s gây sai lệch vị trí bao nhiêu mét?', ['1', '1 m', '1m'],
    '0,05 s × 20 m/s = 1 m. Vì vậy đồng bộ thời gian quan trọng ngang hiệu chuẩn.'),

  q.single('52', 2, 'Trong code Python của bộ lọc, dòng `y = z - self.H @ self.x` tính gì?',
    'Độ bất ngờ (innovation): phép đo trừ phép đo dự đoán',
    ['Hệ số Kalman', 'Trạng thái dự đoán', 'Hiệp phương sai của phép đo'],
    'Tiếp theo: S = HPHᵀ + R, K = PHᵀS⁻¹, x = x + Ky, P = (I − KH)P. Hợp nhất nhiều cảm biến = đổi H, R rồi gọi update nhiều lần.'),

  q.single('53', 2, 'Vì sao nên bắt đầu với P lớn (ví dụ np.eye(2)·100) khi chưa chắc về trạng thái ban đầu?',
    'Để bộ lọc tin các phép đo đầu tiên nhiều; P sẽ co lại nhanh',
    ['Để bộ lọc bỏ qua các phép đo đầu tiên', 'Vì P nhỏ làm bộ lọc chạy chậm', 'Vì P phải luôn lớn hơn R'],
    'P lớn cho K gần 1 ở các bước đầu. P quá nhỏ lúc đầu khiến bộ lọc tự tin sai và bỏ qua dữ liệu.'),

  q.single('54', 1, 'Khi gỡ lỗi bộ lọc, nên kiểm tra gì trước tiên?',
    'Đơn vị và dấu thời gian: hầu hết "lỗi bộ lọc" nằm ở đây',
    ['Đổi sang UKF ngay', 'Tăng số chiều trạng thái', 'Giảm R về 0'],
    'Sau đó: đặt R từ dữ liệu (ghi khi mục tiêu đứng yên), chỉnh Q cho các động tác, nhìn độ bất ngờ (phải giống nhiễu ngẫu nhiên với độ tản mác S), giữ P đối xứng xác định dương (dạng Joseph).'),

  q.match('55', 1, 'Ghép triệu chứng với núm vặn cần chỉnh.', [
    ['Ước lượng trễ so với thực tế', 'Tăng Q'],
    ['Ước lượng giật', 'Giảm Q hoặc tăng R'],
    ['Phản ứng với mọi trục trặc', 'Thêm gating'],
    ['Quỹ đạo cong mà EKF lệch', 'Thử UKF hoặc bộ lọc hạt'],
  ], 'Bộ lọc bỏ qua dữ liệu mới nghĩa là P quá nhỏ: cũng tăng Q.'),

  q.single('56', 2, 'Q hoặc R quá NHỎ so với thực tế dẫn đến điều gì?',
    'Bộ lọc quá tự tin, bỏ qua dữ liệu mới và có thể phân kỳ',
    ['Bộ lọc chậm chạp nhưng luôn đúng', 'Bộ lọc chép nguyên nhiễu của cảm biến', 'Không ảnh hưởng gì vì K tự điều chỉnh'],
    'Quá lớn thì bộ lọc chậm chạp. Kiểm tra bằng cách xem độ bất ngờ có đúng cỡ bộ lọc kỳ vọng (S) không.'),
]
