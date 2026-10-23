import { maker } from './make'

const q = maker(24)

// Day 24 · Data và Annotation Pipeline cho CV & Robotics
export const day24 = [
  q.single('01', 2, 'Theo ước tính (CIDR 2021), một xe ghi bao nhiêu dữ liệu thô mỗi giờ?',
    '3–6 TB mỗi giờ, tuỳ cảm biến',
    ['3–6 GB mỗi giờ', '30–60 MB mỗi giờ', '3–6 PB mỗi giờ'],
    'Pipeline là một cái phễu: vài TB mỗi giờ vào, qua bộ lọc có chủ đích chỉ còn vài khung hình vào dataset.'),

  q.order('02', 1, 'Sắp xếp năm giai đoạn của mọi data pipeline.', [
    'Generation (camera xe)',
    'Ingestion (Kafka, S3)',
    'Storage (lakehouse)',
    'Transformation (Spark, dbt)',
    'Serving (training, dashboard)',
  ], 'Bên dưới cả năm giai đoạn có ba lớp xuyên suốt: điều phối (lịch chạy, thử lại), chất lượng (kiểm tra từng chặng), bảo mật (quyền truy cập, ẩn danh).'),

  q.single('03', 2, 'Lớp Silver trong pipeline lab Day 9 làm gì?',
    'Đưa về một schema thống nhất (m/s, độ, UTC), đẩy dòng lỗi vào telemetry_rejects kèm lý do, gắn cờ chất lượng cho từng khung',
    ['Lưu nguyên bản dữ liệu thô, chỉ ghi thêm', 'Chứa dataset huấn luyện cuối cùng', 'Vẽ dashboard cho người dùng'],
    'Bronze giữ nguyên bản, Silver làm sạch và gắn cờ (cổng 1), Gold là dataset huấn luyện (cổng 2). Airflow điều phối; dbt + DuckDB vừa là SQL vừa là cổng kiểm tra.'),

  q.single('04', 3, '8 camera × 1080p × 30 fps × 3 byte cho khoảng 5,4 TB/giờ. Mã hoá 10 Mbps mỗi camera cho bao nhiêu?',
    'Khoảng 36 GB/giờ, nhỏ hơn bản thô cỡ 150 lần',
    ['Khoảng 3,6 TB/giờ, nhỏ hơn 1,5 lần', 'Khoảng 360 MB/giờ, nhỏ hơn 15 000 lần', 'Không đổi vì video đã nén sẵn'],
    '10 Mbps × 8 camera × 3 600 s = 288 Gbit ≈ 36 GB. Đây là phép tính, không phải số đo. Hạ 30 → 2 Hz và nén 10× trên ~5 TB thô cũng ra cùng bậc (~33 GB/giờ).'),

  q.order('05', 1, 'Sắp xếp 10 bước của data engine.', [
    'Record',
    'Trigger',
    'Ingest',
    'Index',
    'Curate',
    'Label',
    'Dataset',
    'Train',
    'Eval',
    'Deploy',
  ], 'Vòng khép lại: eval chỉ chỗ yếu, curate thêm dữ liệu; lỗi ở eval và deploy thành dữ liệu cần thu.'),

  q.match('06', 2, 'Ghép kiểu flywheel với ví dụ.', [
    ['Trigger-first: xe lệch người lái → snapshot', 'Tesla'],
    ['Search-first: log → tìm kiếm → cảnh hiếm', 'Waymo, Wayve'],
    ['Rollout-first: robot chạy → lỗi → người sửa', 'Physical Intelligence'],
    ['Generate-first: video sinh → lọc → nhãn hành động', 'NVIDIA'],
  ], 'Bốn kiểu khác nhau ở phần được tự động hoá.'),

  q.multi('07', 2, 'Vòng lặp data engine thường hỏng ở những chỗ nào? (chọn nhiều)',
    ['Không đo được: bước nào cũng cần số đo', 'Nhãn đến trễ: vòng lặp chậm theo nhãn', 'Leakage: mẫu test lọt vào train', 'Không ai sở hữu: lỗi không ai sửa'],
    ['Có quá nhiều GPU', 'Dùng định dạng Parquet'],
    'Mỗi bước cần một sản phẩm đầu ra và một người chịu trách nhiệm.'),

  q.match('08', 2, 'Ghép kiểu ghi dữ liệu với đặc điểm.', [
    ['Batch', 'Upload theo lô cả ca; trễ cỡ giờ; rẻ và đơn giản'],
    ['Streaming', 'Telemetry liên tục qua Kafka; trễ cỡ giây; tốn vận hành'],
  ], 'Chọn theo độ trễ cần thiết của bài toán.'),

  q.single('09', 1, 'Video và ảnh lớn nên được ingest thế nào?',
    'Upload thẳng vào object storage (S3, GCS); queue chỉ mang sự kiện nhỏ',
    ['Đẩy từng khung hình qua Kafka', 'Lưu thẳng vào bảng warehouse', 'Gửi qua Airbyte theo lịch'],
    'Kafka/Kinesis/Pub/Sub cho telemetry liên tục độ trễ thấp; Airbyte/Fivetran cho database, SaaS theo lịch; tệp lớn thì vào object storage.'),

  q.multi('10', 1, 'Lớp Bronze có những đặc điểm nào? (chọn nhiều)',
    ['Append-only: chỉ thêm, không sửa', 'Giữ nguyên bản, làm sạch ở lớp sau', 'Kèm metadata: nguồn, giờ nhận, checksum', 'Schema-on-read: áp schema khi đọc'],
    ['Xoá dữ liệu lỗi ngay khi nhận', 'Chỉ giữ khung hình đã gán nhãn'],
    'Giữ nguyên bản để các lớp sau luôn chạy lại được.'),

  q.single('11', 1, 'Ghép nhiều luồng cảm biến (LiDAR 10 Hz, camera 30 Hz, IMU 200 Hz) nên theo mốc thời gian nào?',
    'Event time (lúc sự kiện xảy ra), chờ dữ liệu đến muộn bằng watermark',
    ['Ingestion time (lúc dữ liệu đến pipeline)', 'Thứ tự đến của bản ghi', 'Thời điểm job transformation chạy'],
    'IMU có thể đến theo cụm, mạng có thể trễ. Ghép theo thứ tự đến sẽ ghép sai khoảnh khắc.'),

  q.match('12', 2, 'Ghép kiến trúc lưu trữ với đặc điểm.', [
    ['Warehouse', 'Bảng; schema lúc ghi; chi phí lưu cao; có ACID'],
    ['Data lake', 'Mọi tệp kể cả video; schema lúc đọc; rẻ; không ACID'],
    ['Lakehouse', 'Bảng và tệp; cả hai kiểu schema; rẻ; có ACID'],
  ], 'Lakehouse gộp giao dịch của warehouse vào data lake.'),

  q.single('13', 2, 'Bảng khung hình chỉ giữ con trỏ uri tới video trong object storage. Rủi ro nào cần xử lý?',
    'Tệp mồ côi khi xoá dòng mà không xoá tệp, và tệp bị đổi mà bảng không biết (cần checksum)',
    ['Bảng quá lớn không truy vấn được', 'Video bị nén mất chất lượng', 'Không thể đọc video bằng SQL'],
    'Bảng nhỏ và truy vấn nhanh; dữ liệu lớn nằm ở object storage. Cần dọn rác tệp mồ côi và checksum để phát hiện thay đổi.'),

  q.single('14', 2, 'Vì sao Parquet hợp cho bảng metadata?',
    'Lưu theo cột: truy vấn hai cột chỉ đọc hai cột, giá trị cùng kiểu nằm cạnh nhau nên nén tốt',
    ['Lưu theo dòng nên ghi nhanh từng bản ghi', 'Chứa được cả khung hình video', 'Không cần schema'],
    'Dữ liệu thị giác: Parquet giữ bảng metadata, MP4 giữ khung hình.'),

  q.single('15', 2, 'Open table format (Delta, Iceberg, Hudi) cài đặt commit và time travel thế nào?',
    'Mỗi commit là một danh sách tệp; tệp Parquet ghi một lần không sửa; đọc phiên bản cũ là đọc danh sách cũ',
    ['Sao chép toàn bộ bảng ở mỗi commit', 'Lưu lịch sử trong một tệp log văn bản để đọc lại', 'Dùng khoá database để chặn mọi lần ghi'],
    'Nhờ vậy có giao dịch ACID trên object storage. Ví dụ: v1 (f1), v2 (f1, f2), v3 (f1, f2, f3); time travel về v1 chỉ đọc 1 tệp.'),

  q.match('16', 1, 'Ghép lớp medallion với nội dung.', [
    ['Bronze', 'Log thô, video MP4 (Kafka, upload S3)'],
    ['Silver', 'Bảng khung hình đã làm sạch (Spark, dbt)'],
    ['Gold', 'Dataset huấn luyện (dbt, Delta Lake)'],
  ], 'Mỗi lớp lọc bớt và sạch hơn. Bronze giữ bản gốc; Silver và Gold sinh lại được từ Bronze.'),

  q.single('17', 2, 'Vì sao với dữ liệu camera nên dùng ELT thay vì ETL?',
    'Biến đổi video (decode) quá nặng để làm trước khi nạp; ELT nạp tệp gốc vào lakehouse rồi biến đổi bằng SQL/dbt trên bảng metadata',
    ['ELT không cần lưu trữ', 'ETL không hỗ trợ video', 'ELT tự động gán nhãn dữ liệu'],
    'ETL: biến đổi rồi nạp. ELT: nạp rồi biến đổi ngay trong lakehouse; video nằm yên, chỉ dòng metadata đi qua bảng.'),

  q.match('18', 2, 'Ghép engine xử lý với lúc dùng.', [
    ['Spark', 'Batch, micro-batch: tính lại cả ngày'],
    ['Flink', 'Per-event: cảnh báo telemetry trong vài giây'],
    ['dbt', 'SQL theo lịch: dựng bảng khung hình'],
  ], 'Micro-batch gom lô nhỏ rồi xử lý; per-event xử lý từng bản ghi.'),

  q.single('19', 2, 'Trong xử lý khung hình, nút cổ chai thường nằm ở đâu?',
    'Decode video trên CPU',
    ['Tính embedding trên GPU', 'Ghi Parquet', 'Truy vấn SQL'],
    'Giảm tải bằng FFmpeg, NVIDIA DALI (decode trên GPU), Ray Data (song song). Video fps không cố định còn làm lệch chỉ số khung giữa nhãn và ảnh.'),

  q.match('20', 3, 'Ghép công cụ orchestration với mô hình và lúc chọn.', [
    ['Airflow', 'Task; nhiều tích hợp'],
    ['Dagster', 'Asset; cần lineage, partition'],
    ['Prefect', 'Flow; Python, quy mô nhỏ'],
    ['Flyte', 'Workflow; ML trên Kubernetes'],
  ], 'DAG là đồ thị các bước; backfill là chạy bù khoảng thời gian cũ.'),

  q.single('21', 1, 'Chạy lại partition ngày 3 (1 000 hàng) trong bảng 5 ngày. Cách ghi nào đúng?',
    'Ghi đè theo partition: tổng vẫn 5 000 hàng',
    ['Ghi thêm (append): tổng thành 6 000 hàng', 'Xoá cả bảng rồi chạy lại mọi ngày', 'Ghi vào bảng mới mỗi lần chạy'],
    'Idempotent: chạy lại nhiều lần cho cùng kết quả, nên backfill một partition là an toàn. Append làm hàng ngày 3 nhân đôi.'),

  q.multi('22', 2, 'Kiểm tra chất lượng tự động nào áp dụng cho ảnh và video? (chọn nhiều)',
    ['Khung đen', 'Khung mờ', 'Hộp nằm ngoài ảnh'],
    ['Độ dài tên file', 'Số lượng GPU đang chạy'],
    'Bảng thì kiểm schema, null, range, freshness, trùng lặp. Công cụ: Great Expectations, Soda, dbt tests. Một kiểm tra hỏng (ví dụ hộp ngoài ảnh) là đủ để dừng lô, không sang Silver.'),

  q.single('23', 1, 'Bốn số [100, 60, 50, 80] có thể đọc theo ba quy ước box. Vấn đề là gì?',
    'Cả ba cách đọc đều là bốn số hợp lệ nên sai định dạng không báo lỗi; phải kiểm phạm vi và vẽ thử vài hộp',
    ['Chỉ có một cách đọc hợp lệ nên không có vấn đề', 'Code sẽ báo lỗi kiểu dữ liệu', 'Box tự động được chuẩn hoá về [0, 1]'],
    'COCO dùng xywh theo pixel; Ultralytics YOLO dùng tâm hộp chuẩn hoá 0–1; nhiều hàm dùng xyxy.'),

  q.single('24', 2, 'Lineage trả lời câu hỏi gì?',
    'Model này được train từ dữ liệu nào: truy ngược từ model về log gốc',
    ['Model chạy nhanh bao nhiêu trên GPU', 'Ai đã gán nhãn từng khung', 'Dataset chiếm bao nhiêu dung lượng'],
    'Mỗi bảng và model ghi nguồn tạo ra nó. OpenLineage là chuẩn mở; DataHub, Unity Catalog vẽ đồ thị lineage. Catalog là nơi tra dataset, chủ sở hữu, schema.'),

  q.single('25', 1, 'Một phiên bản dataset (ví dụ v3) phải xác định được bằng những gì?',
    'Commit dữ liệu + danh sách split + mã xử lý',
    ['Tên thư mục và ngày tạo', 'Số lượng ảnh và kích thước tệp', 'Tên người tạo dataset'],
    'Công cụ: DVC (tệp con trỏ trong Git), lakeFS (branch và commit cho object storage), HF Hub/Delta/Iceberg (repo, tag, snapshot).'),

  q.single('26', 1, 'Trigger trên xe kiểu "shadow mode" lọc dữ liệu thế nào?',
    'Khi dự đoán của model lệch hành vi người lái quá ngưỡng, xe ghi một snapshot ngắn để tải lên xem lại',
    ['Ghi toàn bộ dữ liệu rồi lọc trên cloud', 'Chỉ ghi khi xe dừng hẳn', 'Ghi ngẫu nhiên 1% số khung'],
    'Quy tắc lọc chạy ngay trên xe: chỉ phần đáng xem mới được tải lên (IEEE Spectrum 2022 về Tesla).'),

  q.single('27', 1, 'Tìm khung hình bằng câu "xe máy cắt ngang trong mưa" dùng cơ chế gì?',
    'CLIP/SigLIP đưa ảnh và câu chữ vào cùng không gian embedding, vector search (FAISS, pgvector, Milvus) lấy khung gần nhất, người duyệt trước khi đưa vào dataset',
    ['Tìm theo tên file chứa từ "mưa"', 'Chạy detector trên mọi khung rồi đếm xe máy', 'Gán nhãn tay toàn bộ log trước'],
    'Embedding search là bước curate trong data engine.'),

  q.single('28', 1, 'Vì sao phải chia split theo cảnh thay vì theo khung hình?',
    'Khung liền kề gần như giống hệt: chia ngẫu nhiên theo khung làm mỗi khung test có bản gần trùng trong train (leakage), điểm val bị thổi phồng',
    ['Chia theo cảnh cho nhiều dữ liệu train hơn', 'Chia theo khung tốn nhiều bộ nhớ hơn', 'Chia theo cảnh giúp model học nhanh hơn'],
    'Minh hoạ: val 95% khi chia theo khung so với 70% khi chia theo cảnh (số minh hoạ). Leakage chưa biết đã được tìm thấy ngay trong KITTI.'),

  q.single('29', 2, 'Với dữ liệu robot, đơn vị ghi là gì?',
    'Episode: một lần thử kèm một câu lệnh, gồm các luồng camera, khớp, hành động',
    ['Một khung ảnh đơn lẻ', 'Một ngày vận hành', 'Một tệp cấu hình robot'],
    'Thu bằng teleop (người lái từ xa). Nhiều robot thì phải thống nhất tên camera và tần số.'),

  q.single('30', 1, 'Ba người gán nhãn cùng một khung hình cho IoU giữa họ dưới 1, và với vật nhỏ còn thấp hơn. Ý nghĩa là gì?',
    'Đó là noise floor của phép đo: nhãn người cũng có sai số, vật nhỏ bất đồng lớn hơn',
    ['Có người gán sai và phải bị loại', 'Công cụ gán nhãn bị lỗi', 'IoU không dùng được để so nhãn'],
    'Waymo 3DAL: ba lượt gán lại của người đạt IoU 3D trung bình 80,92% so với nhãn gốc.'),

  q.single('31', 1, 'Tình huống "người dắt xe đạp đi bộ" cho thấy điều gì về nhãn?',
    'Nhãn là một đặc tả: cùng khung hình, guideline khác cho nhãn khác (pedestrian + bicycle hay cyclist)',
    ['Luôn chỉ có một nhãn đúng duy nhất', 'Người gán nhãn nên tự quyết theo cảm nhận', 'Nên bỏ qua các tình huống mơ hồ'],
    'Guideline A: cyclist chỉ khi đang ngồi trên xe, người dắt xe gán hai box. Ai quy định ý nghĩa của nhãn là câu hỏi dẫn của Phần B.'),

  q.multi('32', 2, 'Nghiên cứu về nhãn sai trong test set công khai cho thấy gì? (chọn nhiều)',
    ['Trung bình ít nhất 3,3% lỗi nhãn trên 10 tập kiểm tra', 'ImageNet validation có ít nhất 6% lỗi nhãn', 'Sửa nhãn có thể làm ResNet-18 vượt ResNet-50'],
    ['Test set công khai không có lỗi nhãn', 'Lỗi nhãn chỉ có ở dữ liệu y tế'],
    'Northcutt et al. 2021. Một preprint 2026 (chưa phản biện) gán lại KITTI tìm thêm tới 60% object, chủ yếu do thiếu nhãn.'),

  q.match('33', 1, 'Ba cách giảm số nhãn người phải gán: ghép cách với ví dụ.', [
    ['Máy gán nhãn', 'Auto-label ngoại tuyến, pre-label'],
    ['Chọn mẫu', 'Trigger, mining, active learning'],
    ['Dữ liệu không nhãn', 'Pseudo-label, tiền huấn luyện tự giám sát'],
  ], 'Nhãn người dành cho test set và lát cắt khó.'),

  q.single('34', 1, 'Audit 200 nhãn người, tìm thấy 8 lỗi. Nên báo cáo chất lượng thế nào?',
    'Precision 96% trên 200 nhãn đã audit: luôn kèm cỡ mẫu audit',
    ['Chất lượng nhãn 96% cho toàn bộ dataset', 'Chất lượng 100% vì lỗi đã sửa', 'Không báo cáo vì mẫu quá nhỏ'],
    'Mức tham chiếu (Alpamayo-R1): ~10% dữ liệu do người gán, audit 10–20% nhãn người. Một con số chất lượng nhãn không có cỡ mẫu thì khó tin.'),

  q.single('35', 1, 'Vì sao auto-label ngoại tuyến (offboard) chính xác hơn model chạy trên xe?',
    'Dùng được cả khung tương lai (t+1, t+2…) và không bị giới hạn độ trễ',
    ['Dùng GPU mạnh hơn nên model luôn tốt hơn', 'Không cần dữ liệu LiDAR', 'Không phải xử lý khung bị che'],
    'Trên xe chỉ có quá khứ; ngoại tuyến suy nhãn tại t từ cả khung trước và sau (Waymo 3D Auto Labeling, CVPR 2021).'),

  q.order('36', 2, 'Sắp xếp pipeline Waymo 3DAL.', [
    'Chuỗi LiDAR',
    'Detector (MVF++, 5 khung)',
    'Tracking (gắn ID)',
    'Hiệu chỉnh (tĩnh / động)',
    'Box 3D theo track',
  ], 'Tracking và hiệu chỉnh box cho +8,39 điểm AP@0.8. 3DAL đạt 3D AP@0.7 xe 85,37 trên val Waymo.'),

  q.single('37', 3, 'Trong 3DAL, student học từ 10% nhãn người + 90% nhãn máy so với 100% nhãn người cho kết quả thế nào?',
    '70,0 AP so với 71,2 AP: gần bằng với một phần nhỏ nhãn người',
    ['50,0 AP so với 71,2 AP', '71,2 AP so với 70,0 AP (tốt hơn)', 'Bằng nhau tuyệt đối'],
    'Lưu ý: nhãn người cũng được chấm theo ground truth do người gán.'),

  q.single('38', 2, 'Alpamayo-R1 tạo nhãn Chain-of-Causation (CoC) thế nào?',
    'Keyframe theo luật → GPT-5 (video 2 Hz, quỹ đạo ego, meta-action) sinh vết lập luận → người gán ~10% và audit 10–20%',
    ['Người viết tay toàn bộ vết lập luận', 'Chỉ dùng detector để sinh nhãn', 'Không cần người kiểm tra'],
    'Judge GPT-5 khớp đánh giá của người 92%. Ràng buộc causal locality: nguyên nhân chỉ lấy từ lịch sử quan sát được.'),

  q.tf('39', 2, 'Theo bài giảng, VLM zero-shot đã đáng tin để chấm robot làm thành công một tác vụ hay chưa.', false,
    'Sai. Nhãn "thành công" (SuccessVQA, GVL) với VLM zero-shot chưa đáng tin. Nhãn robot gồm lệnh ngôn ngữ, subtask, thành công và pointing.'),

  q.order('40', 2, 'Sắp xếp pipeline Grounded-SAM tạo pre-label.', [
    'Prompt văn bản ("car . pedestrian")',
    'Grounding DINO: ra box',
    'SAM: ra mask',
    'Pre-label: người duyệt sửa rồi chấp nhận',
  ], 'Pre-label bỏ bớt thao tác vẽ; nhãn chỉ thành ground truth sau khi người duyệt.'),

  q.single('41', 2, 'Autodistill hoạt động thế nào?',
    'Ontology (prompt → tên class) → base model lớn (Grounded SAM, OWLv2) gán nhãn → train target model nhỏ (YOLOv8, DETR) để chạy trên xe/robot',
    ['Model nhỏ gán nhãn cho model lớn', 'Người gán nhãn toàn bộ rồi chưng cất', 'Sinh ảnh tổng hợp để thay dữ liệu thật'],
    'Chỉ hỗ trợ detection và instance segmentation. Core giấy phép Apache 2.0, plugin theo giấy phép từng mô hình.'),

  q.single('42', 2, 'SAM 2 trong vòng lặp gán nhãn đã giảm thời gian gán mask mỗi khung thế nào?',
    'Từ 37,8 s (SAM theo khung) xuống 4,5 s (SAM 2 trong vòng lặp): khoảng 8,4 lần',
    ['Từ 10 s xuống 9 s', 'Từ 4,5 s lên 37,8 s', 'Từ 1 giờ xuống 1 phút'],
    'Giai đoạn giữa (SAM + SAM 2 Mask) là 7,4 s. Mô hình càng tốt thì người càng chuyển từ vẽ sang duyệt.'),

  q.match('43', 1, 'Router định tuyến nhãn máy theo độ tin cậy: ghép làn với điều kiện (ngưỡng minh hoạ).', [
    ['Tự chấp nhận (có audit mẫu)', 'Score ≥ 0,9'],
    ['Người kiểm (sửa pre-label)', 'Score 0,4–0,9 hoặc hai detector bất đồng'],
    ['Người gán lại từ đầu', 'Score < 0,4'],
  ], 'Ngưỡng phải hiệu chuẩn trên tập gold. Ngưỡng công bố: Waymo giữ box score > 0,1 cho student; TAO Grounding DINO mặc định 0,5.'),

  q.single('44', 1, 'Confident learning tìm nhãn sai bằng cách nào?',
    'Dự đoán K-fold (model không thấy ảnh nó dự đoán), so nhãn với dự đoán; ô ngoài đường chéo là nghi ngờ',
    ['Cho model dự đoán trên chính ảnh đã train rồi so', 'Đếm số người gán nhãn đồng ý', 'Loại mọi mẫu có loss cao nhất'],
    'Với detection, cờ gồm: thiếu object, box lệch, sai class. Ví dụ thật: 645 ảnh tên lửa trong ImageNet có khả năng bị gán class cha projectile.'),

  q.single('45', 1, 'Thiên kiến tự động hoá (automation bias) trong gán nhãn là gì, và đo thế nào?',
    'Người duyệt dễ chấp nhận pre-label sai; đo bằng lỗi cấy trước, tập gold đối chứng không pre-label, tỷ lệ chấp nhận theo từng người',
    ['Máy gán nhãn chậm hơn người', 'Người duyệt luôn sửa mọi pre-label', 'Pre-label làm người gán nhãn mệt hơn'],
    'Bằng chứng gián tiếp: RCT 2 784 người cho thấy buộc sửa nâng độ chính xác 66% → 68% (tác vụ trích xuất văn bản; chưa có nghiên cứu cho 3D).'),

  q.match('46', 2, 'Ghép chiến lược học chủ động với cách chọn mẫu.', [
    ['Uncertainty', 'Dồn vào vùng sát biên quyết định'],
    ['Core-set', 'Phủ đều không gian, kể cả vùng đã chắc'],
    ['BADGE', 'Vừa bất định vừa khác nhau trong không gian gradient'],
  ], 'BADGE kết hợp cả độ bất định và độ đa dạng khi chọn lô.'),

  q.single('47', 1, 'Học chủ động phải được so với baseline nào mới công bằng?',
    'Baseline ngẫu nhiên đã tối ưu siêu tham số, cùng tập khởi đầu, nhiều seed',
    ['Baseline không dùng nhãn nào', 'Baseline ngẫu nhiên chưa tinh chỉnh', 'Kết quả của paper khác trên dataset khác'],
    'Ví dụ: random 25,67, entropy 25,91, core-set 25,96, class-distribution AL 26,62, toàn bộ nhãn 26,83 mIoU. Với chính quy hoá mạnh, lợi ích nhỏ hoặc bằng 0.'),

  q.order('48', 2, 'Sắp xếp vòng lặp teacher–student (self-training).', [
    'Teacher học trên nhãn người',
    'Teacher sinh pseudo-label trên dữ liệu không nhãn',
    'Student học với nhiễu (dropout, RandAugment)',
    'Student thành teacher mới, lặp lại',
  ], 'Noisy Student dùng 300M ảnh không nhãn đạt 88,4% top-1 ImageNet. 3DAL khi dịch chuyển miền: 59,4 → 64,2 AP.'),

  q.match('49', 2, 'Ghép cách dùng ngân sách nhãn với rủi ro.', [
    ['Tiền huấn luyện (MAE)', 'Vẫn cần fine-tune'],
    ['Pseudo-label', 'Lỗi của teacher lan sang student'],
    ['Mua nhãn người', 'Đắt, chậm; dành cho test set, class an toàn'],
  ], 'MAE: ViT-H đạt 87,8% top-1 chỉ với ImageNet-1K.'),

  q.multi('50', 2, 'Checklist trước khi gán nhãn hàng loạt gồm những gì? (chọn nhiều)',
    ['Guideline gán nhãn và taxonomy', 'Tập gold ~10% do người gán', 'Máy gán nhãn khởi tạo, định tuyến, audit', 'Chọn mẫu so với baseline ngẫu nhiên đã tối ưu'],
    ['Gán nhãn càng nhanh càng tốt, kiểm tra sau', 'Dùng VLM làm nhãn cuối, không cần kiểm'],
    'Mục thứ năm: VLM gán nhãn khởi tạo (Day 10) nhưng phải kiểm độc lập.'),

  q.single('51', 1, 'Trước khi deploy model train lại, câu hỏi nào trong slide đang làm nút Deploy bị chặn?',
    'Đã chạy closed-loop hay sim chưa? (chưa)',
    ['Tốt hơn ở đúng chỗ hay hỏng chỗ khác?', 'Test đã cách ly theo cảnh chưa?', 'Rollback về bản trước được không?'],
    'Ba câu còn lại đã đạt; chỉ một câu chưa đạt là đủ để chặn deploy. Pipeline không dừng ở mô hình: kết quả ngoài đường quay lại thành dữ liệu.'),

  q.match('52', 3, 'Kịch bản nền tảng dữ liệu đội 500 xe: ghép vai trò với công cụ mẫu.', [
    ['Ingest streaming', 'Kafka'],
    ['Ingest theo lô (connector)', 'Airbyte'],
    ['Table format', 'Delta Lake'],
    ['Stream processing', 'Flink'],
    ['Version dataset', 'lakeFS'],
  ], 'Các vai trò khác: object storage (S3), batch/ELT (Spark), video nặng (Ray), orchestration (Airflow), data quality (Great Expectations), catalog/lineage (DataHub).'),
]
